import { withRouteSpec } from "lib/middleware/with-winter-spec"
import { z } from "zod"
import { withApiKeyAuth } from "lib/middleware/with-api-key-auth"

export default withRouteSpec({
  methods: ["GET"],
  jsonResponse: z.array(z.string()),
  auth: "api_key",
})((req, ctx) => {
  const sessionIds = ctx.db.sessions.map((session) => session.session_id)
  return ctx.json(sessionIds)
})
