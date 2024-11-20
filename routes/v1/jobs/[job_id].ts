import { withRouteSpec } from "lib/middleware/with-winter-spec"
import { z } from "zod"
import { withApiKeyAuth } from "lib/middleware/with-api-key-auth"
import { NotFoundError } from "winterspec/middleware"
import {
  jobInputSchema,
  jobStateSchema,
  routerSettingsSchema,
} from "lib/db/schema"

export default withRouteSpec({
  methods: ["GET"],
  routeParams: z.object({
    job_id: z.string(),
  }),
  jsonResponse: z.object({
    id: z.string(),
    created_at: z.string(),
    started_at: z.string().optional(),
    input: jobInputSchema.optional(),
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
  const job = ctx.db.jobs.find((j) => j.job_id === jobId)

  if (!job) {
    throw new NotFoundError("Job not found")
  }

  return ctx.json({
    id: job.job_id,
    created_at: job.created_at,
    started_at: job.started_at,
    input: job.input,
    session_id: job.session_id,
    name: job.name,
    state: job.state,
    priority: job.priority,
    stage: job.stage,
    router_settings: job.router_settings,
  })
})
