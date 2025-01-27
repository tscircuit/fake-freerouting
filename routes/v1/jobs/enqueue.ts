import { withRouteSpec } from "lib/middleware/with-winter-spec"
import { z } from "zod"
import { randomUUID } from "node:crypto"
import { jobStateSchema, routerSettingsSchema } from "lib/db/schema"
import { withApiKeyAuth } from "lib/middleware/with-api-key-auth"

export default withRouteSpec({
  methods: ["POST"],
  auth: "api_key",
  jsonBody: z.object({
    session_id: z.string(),
    name: z.string(),
    priority: z.enum(["LOW", "NORMAL", "HIGH"]),
  }),
  jsonResponse: z.object({
    id: z.string(),
    created_at: z.string(),
    session_id: z.string(),
    name: z.string(),
    state: jobStateSchema,
    priority: z.enum(["LOW", "NORMAL", "HIGH"]),
    stage: z.enum(["IDLE", "ROUTING"]),
    router_settings: routerSettingsSchema,
  }),
})((req, ctx) => {
  const { session_id, name, priority } = req.jsonBody

  // Verify session exists
  const session = ctx.db.sessions.find((s) => s.session_id === session_id)
  if (!session) {
    throw new Error("Session not found")
  }

  const job = {
    job_id: randomUUID(),
    created_at: new Date().toISOString(),
    session_id,
    name,
    state: "QUEUED",
    priority,
    stage: "IDLE",
    router_settings: routerSettingsSchema.parse({}),
  } as const

  ctx.db.jobs.push(job)

  return ctx.json({
    id: job.job_id,
    created_at: job.created_at,
    session_id: job.session_id,
    name: job.name,
    state: job.state as
      | "QUEUED"
      | "RUNNING"
      | "COMPLETED"
      | "FAILED"
      | "READY_TO_START",
    priority: job.priority,
    stage: job.stage as "IDLE" | "ROUTING",
    router_settings: job.router_settings,
  })
})
