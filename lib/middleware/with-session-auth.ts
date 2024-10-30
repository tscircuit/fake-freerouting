import type { Middleware } from "winterspec"

export const withSessionAuth: Middleware<{}, {}> = async (req, ctx, next) => {
  const sessionId = req.headers.get("Freerouting-Session-ID")

  // TODO

  return next(req, ctx)
}
