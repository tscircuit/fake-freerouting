import type { Middleware } from "winterspec"

export const withApiKeyAuth: Middleware<{}, {}> = async (req, ctx, next) => {
  const profileId = req.headers.get("Freerouting-Profile-ID")
  const frEnv = req.headers.get("Freerouting-Environment-Host")

  if (!profileId) {
    throw new Error("Freerouting-Session-ID header is required")
  }

  if (!frEnv) {
    throw new Error("Freerouting-Environment-Host header is required")
  }

  // TODO

  return next(req, ctx)
}
