import { createWithWinterSpec } from "winterspec"
import { withDb } from "./with-db"
import { withApiKeyAuth } from "./with-api-key-auth"
import { withSessionAuth } from "./with-session-auth"
import { withRequestLogging } from "with-request-logging"

export const withRouteSpec = createWithWinterSpec({
  apiName: "tscircuit Debug API",
  productionServerUrl: "https://debug-api.tscircuit.com",
  beforeAuthMiddleware: [withRequestLogging],
  authMiddleware: {
    api_key: withApiKeyAuth,
    session: withSessionAuth,
  },
  afterAuthMiddleware: [withDb],
})
