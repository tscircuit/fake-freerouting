import { withRouteSpec } from "lib/middleware/with-winter-spec"
import { z } from "zod"
import { withApiKeyAuth } from "lib/middleware/with-api-key-auth"
import { NotFoundError } from "winterspec/middleware"
import { jobInputSchema } from "lib/db/schema"

export default withRouteSpec({
  methods: ["POST"],
  routeParams: z.object({
    job_id: z.string(),
  }),
  jsonBody: z.object({
    filename: z.string(),
    data: z.string(),
  }),
  jsonResponse: z.object({
    id: z.string(),
    created_at: z.string(),
    input: jobInputSchema.optional(),
    session_id: z.string(),
    name: z.string(),
    state: z.enum(["QUEUED", "RUNNING", "COMPLETED", "FAILED"]),
    priority: z.enum(["LOW", "NORMAL", "HIGH"]),
    stage: z.enum(["IDLE", "ROUTING"]),
    router_settings: z.object({
      default_preferred_direction_trace_cost: z.number(),
      default_undesired_direction_trace_cost: z.number(),
      max_passes: z.number(),
      fanout_max_passes: z.number(),
      max_threads: z.number(),
      improvement_threshold: z.number(),
      trace_pull_tight_accuracy: z.number(),
      allowed_via_types: z.boolean(),
      via_costs: z.number(),
      plane_via_costs: z.number(),
      start_ripup_costs: z.number(),
      automatic_neckdown: z.boolean(),
    }),
  }),
  auth: "api_key",
})((req, ctx) => {
  const jobId = req.routeParams.job_id
  const { filename, data } = req.jsonBody

  // Find the job
  const jobIndex = ctx.db.jobs.findIndex((j) => j.job_id === jobId)
  if (jobIndex === -1) {
    throw new NotFoundError("Job not found")
  }

  // Calculate input metadata
  const decodedData = Buffer.from(data, 'base64')
  const input = {
    size: decodedData.length,
    crc32: 0, // TODO: Implement CRC32 calculation
    format: filename.split('.').pop()?.toUpperCase() || '',
    layer_count: 0,
    component_count: 0,
    netclass_count: 0,
    net_count: 0,
    track_count: 0,
    trace_count: 0,
    via_count: 0,
    filename,
    path: '',
  }

  // Update the job
  const updatedJob = {
    ...ctx.db.jobs[jobIndex],
    input,
  }
  ctx.db.jobs[jobIndex] = updatedJob

  return ctx.json({
    id: updatedJob.job_id,
    created_at: updatedJob.created_at,
    input: updatedJob.input,
    session_id: updatedJob.session_id,
    name: updatedJob.name,
    state: updatedJob.state,
    priority: updatedJob.priority,
    stage: updatedJob.stage,
    router_settings: updatedJob.router_settings,
  })
})
