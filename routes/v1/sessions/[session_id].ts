import { withRouteSpec } from "lib/middleware/with-winter-spec"
import { z } from "zod"
import { withApiKeyAuth } from "lib/middleware/with-api-key-auth"
import { NotFoundError } from "winterspec/middleware"

export default withRouteSpec({
  methods: ["GET"],
  routeParams: z.object({
    session_id: z.string(),
  }),
  jsonResponse: z.object({
    id: z.string(),
    user_id: z.string(),
    host: z.string(),
    created_at: z.string(),
  }),
  auth: "api_key",
})((req, ctx) => {
  const sessionId = req.routeParams.session_id
  const session = ctx.db.sessions.find((s) => s.session_id === sessionId)

  if (!session) {
    throw new NotFoundError("Session not found")
  }

  return ctx.json({
    id: session.session_id,
    user_id: session.user_id,
    host: session.host,
    created_at: session.created_at,
  })
})
