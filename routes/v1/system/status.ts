import { withRouteSpec } from "lib/middleware/with-winter-spec"
import { z } from "zod"
import os from "node:os"

export default withRouteSpec({
  methods: ["GET"],
  jsonResponse: z.object({
    status: z.string(),
    cpu_load: z.number(),
    ram_used: z.number(),
    ram_available: z.number(),
    storage_available: z.number(),
    session_count: z.number(),
  }),
})((req, ctx) => {
  const totalMem = os.totalmem()
  const freeMem = os.freemem()
  const usedMem = totalMem - freeMem

  return ctx.json({
    status: "OK",
    cpu_load: os.loadavg()[0],
    ram_used: Math.round((usedMem / totalMem) * 100),
    ram_available: Math.round((freeMem / totalMem) * 100),
    storage_available: 0, // Would need filesystem checks to implement
    session_count: ctx.db.sessions.length,
  })
})
