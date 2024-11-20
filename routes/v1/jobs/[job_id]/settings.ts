import { withRouteSpec } from "lib/middleware/with-winter-spec"
import { z } from "zod"
import { withApiKeyAuth } from "lib/middleware/with-api-key-auth"
import { NotFoundError } from "winterspec/middleware"
import { jobStateSchema, routerSettingsSchema } from "lib/db/schema"

export default withRouteSpec({
  methods: ["POST"],
  routeParams: z.object({
    job_id: z.string(),
  }),
  jsonBody: z.object({
    max_passes: z.number().optional(),
    via_costs: z.number().optional(),
  }),
  jsonResponse: z.object({
    id: z.string(),
    created_at: z.string(),
    started_at: z.string().optional(),
    input: z
      .object({
        size: z.number(),
        crc32: z.number(),
        format: z.string(),
        layer_count: z.number(),
        component_count: z.number(),
        netclass_count: z.number(),
        net_count: z.number(),
        track_count: z.number(),
        trace_count: z.number(),
        via_count: z.number(),
        filename: z.string(),
        path: z.string(),
      })
      .optional(),
    session_id: z.string(),
    name: z.string(),
    state: jobStateSchema,
    priority: z.enum(["LOW", "NORMAL", "HIGH"]),
    stage: z.enum(["IDLE", "ROUTING"]),
    router_settings: routerSettingsSchema,
  }),
  auth: "api_key",
})((req, ctx) => {
  const jobId = req.routeParams.job_id
  const { max_passes, via_costs } = req.jsonBody

  // Find the job
  const jobIndex = ctx.db.jobs.findIndex((j) => j.job_id === jobId)
  if (jobIndex === -1) {
    throw new NotFoundError("Job not found")
  }

  // Update router settings
  const job = ctx.db.jobs[jobIndex]
  const updatedSettings = {
    ...job.router_settings,
    ...(max_passes !== undefined && { max_passes }),
    ...(via_costs !== undefined && { via_costs }),
  }

  // Update the job
  const updatedJob = {
    ...job,
    router_settings: updatedSettings,
  }
  ctx.db.jobs[jobIndex] = updatedJob

  return ctx.json({
    id: updatedJob.job_id,
    created_at: updatedJob.created_at,
    started_at: updatedJob.started_at,
    input: updatedJob.input,
    session_id: updatedJob.session_id,
    name: updatedJob.name,
    state: updatedJob.state,
    priority: updatedJob.priority,
    stage: updatedJob.stage,
    router_settings: updatedJob.router_settings,
  })
})
