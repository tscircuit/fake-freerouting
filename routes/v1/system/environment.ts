import { withRouteSpec } from "lib/middleware/with-winter-spec"
import { z } from "zod"
import os from "node:os"

export default withRouteSpec({
  methods: ["GET"],
  jsonResponse: z.object({
    freerouting_version: z.string(),
    app_started_at: z.string(),
    command_line_arguments: z.string(),
    architecture: z.string(),
    java: z.string(),
    system_language: z.string(),
    cpu_cores: z.number(),
    ram: z.number()
  }),
})((req, ctx) => {
  return ctx.json({
    freerouting_version: "2.0.0-SNAPSHOT,2024-10-24",
    app_started_at: new Date().toISOString(),
    command_line_arguments: "--api_server-enabled=true --gui-enabled=false",
    architecture: `${os.platform()},${os.arch()},${os.release()}`,
    java: "21.0.5,Eclipse Adoptium",
    system_language: process.env.LANG || "en,en_US",
    cpu_cores: os.cpus().length,
    ram: Math.round(os.totalmem() / (1024 * 1024)) // Convert to MB
  })
})
