import { withRouteSpec } from "lib/middleware/with-winter-spec"
import { z } from "zod"

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
})((req, ctx) => {
  const errors: Array<{ job_id: string; error: string }> = []
  let processedCount = 0

  // Find all QUEUED jobs
  const queuedJobs = ctx.db.jobs.filter((job) => job.state === "QUEUED")

  for (const job of queuedJobs) {
    try {
      // Verify job has input file
      if (!job.input) {
        throw new Error("No input file uploaded")
      }

      // Update job state to RUNNING
      const jobIndex = ctx.db.jobs.findIndex((j) => j.job_id === job.job_id)
      ctx.db.jobs[jobIndex] = {
        ...job,
        state: "RUNNING",
        stage: "ROUTING",
        started_at: new Date().toISOString(),
      }

      // Simulate successful autorouting with mock output
      const mockOutput = {
        size: 14, // Length of "(session test)"
        crc32: 0,
        format: "SES",
        layer_count: 0,
        component_count: 0,
        netclass_count: 0,
        net_count: 0,
        track_count: 0,
        trace_count: 0,
        via_count: 0,
        filename: `${job.name}.ses`,
        path: "",
        data: Buffer.from("(session test)").toString("base64")
      }

      ctx.db.jobs[jobIndex] = {
        ...ctx.db.jobs[jobIndex],
        state: "COMPLETED",
        output: mockOutput
      }

      processedCount++
    } catch (error) {
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
