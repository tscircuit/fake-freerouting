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
  methods: ["PUT"],
  routeParams: z.object({
    job_id: z.string(),
  }),
  jsonResponse: z.union([
    z.object({
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
    z.object({
      error: z.string(),
    }),
  ]),
  auth: "api_key",
})((req, ctx) => {
  const jobId = req.routeParams.job_id
  const job = ctx.db.jobs.find((j) => j.job_id === jobId)

  if (!job) {
    throw new NotFoundError("Job not found")
  }

  // Verify job has input
  if (!job.input) {
    return ctx.json(
      { error: "Cannot start job without input file" },
      { status: 400 },
    )
  }

  // Update job state
  const jobIndex = ctx.db.jobs.findIndex((j) => j.job_id === jobId)
  const updatedJob = {
    ...job,
    state: "READY_TO_START" as const,
    stage: "ROUTING" as const,
    started_at: new Date().toISOString(),
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
