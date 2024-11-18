import { withRouteSpec } from "lib/middleware/with-winter-spec"
import { z } from "zod"
import { parseDsnToCircuitJson, convertCircuitJsonToDsnString } from "dsn-converter"
import type { AnyCircuitElement, PcbTrace } from "circuit-json"
import { MultilayerIjump,getSimpleRouteJson } from "@tscircuit/infgrid-ijump-astar"

function addPcbTracesToCircuitJson(circuitJson: AnyCircuitElement[], traces: PcbTrace[]): AnyCircuitElement[] {
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
  const jobsToProcess = ctx.db.jobs.filter((job) => ["QUEUED"].includes(job.state))

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
      // const inputDsn = Buffer.from(job.input.data, 'base64').toString() // No input data in job
      const testCircuitJson = await Bun.file("tests/assets/circuit.json").json()
      const simpleRouteJson = getSimpleRouteJson(testCircuitJson)

      const autorouter = new MultilayerIjump({
        input: simpleRouteJson,
        OBSTACLE_MARGIN: 0.2
      })
      const traces = autorouter.solveAndMapToTraces() as PcbTrace[]
      const routedCircuitJson = addPcbTracesToCircuitJson(testCircuitJson, traces)
      const routedDsn = convertCircuitJsonToDsnString(routedCircuitJson)

      // Create output with routed DSN
      const output = {
        job_id: job.job_id,
        data: Buffer.from(routedDsn).toString("base64"),
        size: Buffer.from(routedDsn).length,
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
      }

      // Update job with output and mark as completed
      ctx.db.jobs[jobIndex] = {
        ...ctx.db.jobs[jobIndex],
        state: "COMPLETED",
        stage: "IDLE",
        output,
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
