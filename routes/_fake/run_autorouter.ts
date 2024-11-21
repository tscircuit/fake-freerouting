import {
  MultilayerIjump,
  getSimpleRouteJson,
} from "@tscircuit/infgrid-ijump-astar"
import type { AnyCircuitElement, PcbTrace } from "circuit-json"
import Debug from "debug"
import {
  type DsnPcb,
  convertCircuitJsonToDsnSession,
  parseDsnToCircuitJson,
  parseDsnToDsnJson,
  stringifyDsnSession,
} from "dsn-converter"
import { withRouteSpec } from "lib/middleware/with-winter-spec"
import { circuitJsonToMarkdownTable } from "tests/debug-utils/circuit-json-to-table"
import { analyzeWirePaths } from "tests/debug-utils/extract-trace-from-ses-file"
import { saveRouteAnalysis } from "tests/debug-utils/simple-route-json-to-table"
import { z } from "zod"

const debugGraphics = Debug("tscircuit:fake-autorouter")

function addPcbTracesToCircuitJson(
  circuitJson: AnyCircuitElement[],
  traces: PcbTrace[],
): AnyCircuitElement[] {
  return circuitJson.concat(traces)
}

export default withRouteSpec({
  methods: ["POST"],
  jsonResponse: z.object({
    processed_jobs: z.number(),
    errors: z.array(
      z.object({
        job_id: z.string(),
        error: z.string(),
      }),
    ),
  }),
})(async (req, ctx) => {
  const errors: Array<{ job_id: string; error: string }> = []
  let processedCount = 0

  // Find jobs that need processing
  const jobsToProcess = ctx.db.jobs.filter((job) =>
    ["READY_TO_START"].includes(job.state),
  )

  for (const job of jobsToProcess) {
    try {
      // Get job index
      const jobIndex = ctx.db.jobs.findIndex((j) => j.job_id === job.job_id)
      if (jobIndex === -1) continue

      // Verify job has input file
      if (!job.input) {
        throw new Error("No input file uploaded or invalid input data")
      }

      // Validate input format
      if (!["DSN"].includes(job.input.format)) {
        throw new Error(`Unsupported input format: ${job.input.format}`)
      }

      ctx.db.jobs[jobIndex] = {
        ...job,
        state: "RUNNING",
        stage: "ROUTING",
        started_at: new Date().toISOString(),
      }

      // Get the input DSN content and add fake routing
      const inputDsn = Buffer.from(job.input._input_dsn!, "base64").toString()
      const dsnPcb = parseDsnToDsnJson(inputDsn) as DsnPcb
      const circuitJson = parseDsnToCircuitJson(inputDsn)

      if (debugGraphics.enabled) {
        circuitJsonToMarkdownTable(
          circuitJson as any,
          "../routes/_fake/debug-files-stages/stage-1-circuit-json.md",
          "Stage 1: Circuit JSON as input to fake",
        )
      }

      const simpleRouteJson = getSimpleRouteJson(circuitJson)

      if (debugGraphics.enabled) {
        saveRouteAnalysis(
          simpleRouteJson,
          "../routes/_fake/debug-files-stages/stage-2-simple-route-json.md",
          "Stage 2: Simple Route JSON as input to autorouter",
        )
      }

      const autorouter = new MultilayerIjump({
        input: simpleRouteJson,
        OBSTACLE_MARGIN: 0.2,
      })
      const traces = autorouter.solveAndMapToTraces() as PcbTrace[]

      for (const trace of traces) {
        // HACK: autorouter should be able to return the source trace id
        trace.source_trace_id = trace.pcb_trace_id.split("pcb_trace_for_")[1]
      }
      const routedCircuitJson = addPcbTracesToCircuitJson(circuitJson, traces)

      if (debugGraphics.enabled) {
        circuitJsonToMarkdownTable(
          routedCircuitJson as any,
          "../routes/_fake/debug-files-stages/stage-3-routed-circuit-json.md",
          "Stage 3: Routed Circuit JSON as output from the fake autorouter",
        )
        // saveRouteAnalysis(traces, "routed-trace-points.md")
      }

      // console.dir(
      //   {
      //     simpleRouteJson,
      //     traces,
      //     source_traces: su(circuitJson).source_trace.list(),
      //     pcb_traces: su(routedCircuitJson).pcb_trace.list(),
      //   },
      //   { depth: null },
      // )

      const routedDsnSession = convertCircuitJsonToDsnSession(
        dsnPcb,
        routedCircuitJson,
      )

      const routedDsnString = stringifyDsnSession(routedDsnSession)
      if (debugGraphics.enabled) {
        debugGraphics({
          routedDsnString,
        })
        analyzeWirePaths(
          routedDsnString,
          "../routes/_fake/debug-files-stages/stage-4-ses-file-trace-points.md",
          "Last stage: SES file conversion from routed circuit JSON",
        )
      }
      // convert the DSN to a SES file

      ctx.db.jobs[jobIndex] = {
        ...ctx.db.jobs[jobIndex],
        state: "COMPLETED",
        stage: "IDLE",
        output: {
          data: Buffer.from(routedDsnString).toString("base64"),
          size: Buffer.from(routedDsnString).length,
          crc32: 0,
          format: "SES",
          layer_count: job.input?.layer_count ?? 2,
          component_count: job.input?.component_count ?? 0,
          netclass_count: job.input?.netclass_count ?? 0,
          net_count: job.input?.net_count ?? 0,
          track_count: 2, // Our fake routes
          trace_count: 2,
          via_count: 1,
          filename: job.input.filename.replace(".dsn", ".ses"),
          path: "",
        },
      }

      processedCount++
    } catch (error) {
      console.log("Setting job state to FAILED:", job.job_id, error)
      // Update job state to FAILED
      const jobIndex = ctx.db.jobs.findIndex((j) => j.job_id === job.job_id)
      ctx.db.jobs[jobIndex] = {
        ...job,
        state: "FAILED",
      }

      errors.push({
        job_id: job.job_id,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  return ctx.json({
    processed_jobs: processedCount,
    errors,
  })
})
