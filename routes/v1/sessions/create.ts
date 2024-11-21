import { withRouteSpec } from "lib/middleware/with-winter-spec"
import { z } from "zod"
import { randomUUID } from "node:crypto"

export default withRouteSpec({
  methods: ["POST"],
  jsonResponse: z.object({
    id: z.string(),
    user_id: z.string(),
    host: z.string(),
  }),
  jsonBody: z.object({
    body: z.string().optional(),
  }),
})((req, ctx) => {
  if (req.jsonBody.body !== "") {
    return ctx.json({ id: "", user_id: "", host: "" }, { status: 502 })
  }

  const session = {
    session_id: randomUUID(),
    user_id: req.headers.get("Freerouting-Profile-ID") ?? randomUUID(),
    host: req.headers.get("Freerouting-Environment-Host") ?? "unknown",
    created_at: new Date().toISOString(),
  }

  ctx.db.sessions.push(session)

  return ctx.json({
    id: session.session_id,
    user_id: session.user_id,
    host: session.host,
  })
})
