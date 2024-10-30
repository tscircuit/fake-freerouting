import type { Middleware } from "winterspec"

export const withSessionAuth: Middleware<{}, {}> = async (req, ctx, next) => {
  const sessionId = req.headers.get("Freerouting-Session-ID")

  if (!sessionId) {
    throw new Error("Freerouting-Session-ID header is required")
  }

  return next(req, ctx)
}
