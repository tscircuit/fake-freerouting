import { createWithWinterSpec } from "winterspec"
import { withDb } from "./with-db"
import { withApiKeyAuth } from "./with-api-key-auth"
import { withSessionAuth } from "./with-session-auth"

export const withRouteSpec = createWithWinterSpec({
  apiName: "tscircuit Debug API",
  productionServerUrl: "https://debug-api.tscircuit.com",
  beforeAuthMiddleware: [],
  authMiddleware: {
    api_key: withApiKeyAuth,
    session: withSessionAuth,
  },
  afterAuthMiddleware: [withDb],
})
