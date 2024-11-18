import { withRouteSpec } from "lib/middleware/with-winter-spec"
import { z } from "zod"
import { withApiKeyAuth } from "lib/middleware/with-api-key-auth"
import { NotFoundError } from "winterspec/middleware"

export default withRouteSpec({
  methods: ["GET"],
  routeParams: z.object({
    session_id: z.string(),
  }),
  jsonResponse: z.array(z.string()),
  auth: "api_key",
})((req, ctx) => {
  const sessionId = req.routeParams.session_id

  // Verify session exists
  const session = ctx.db.sessions.find((s) => s.session_id === sessionId)
  if (!session) {
    throw new NotFoundError("Session not found")
  }

  // Get all job IDs for this session
  const jobIds = ctx.db.jobs
    .filter((job) => job.session_id === sessionId)
    .map((job) => job.job_id)

  return ctx.json(jobIds)
})
