import { withRouteSpec } from "lib/middleware/with-winter-spec"
import { z } from "zod"
import { withApiKeyAuth } from "lib/middleware/with-api-key-auth"
import { NotFoundError } from "winterspec/middleware"
import { jobInputSchema } from "lib/db/schema"

export default withRouteSpec({
  methods: ["GET"],
  routeParams: z.object({
    job_id: z.string(),
  }),
  jsonResponse: z.object({
    job_id: z.string(),
    data: z.string(),
    size: z.number(),
    crc32: z.number(),
    format: z.string(),
    layer_count: z.number(),
    component_count: z.number(),
    netclass_count: z.number(),
    net_count: z.number(),
    track_count: z.number(),
    trace_count: z.number(),
    via_count: z.number(),
    filename: z.string(),
    path: z.string(),
  }),
  auth: "api_key",
})((req, ctx) => {
  const jobId = req.routeParams.job_id
  const job = ctx.db.jobs.find((j) => j.job_id === jobId)

  if (!job) {
    throw new NotFoundError("Job not found")
  }

  // For now, return a mock SES file output
  const output = {
    job_id: job.job_id,
    data: Buffer.from("(session test)").toString("base64"),
    size: 14, // Length of "(session test)"
    crc32: 0, // TODO: Implement actual CRC32
    format: "SES",
    layer_count: 0,
    component_count: 0,
    netclass_count: 0,
    net_count: 0,
    track_count: 0,
    trace_count: 0,
    via_count: 0,
    filename: `${job.name}.ses`,
    path: "",
  }

  return ctx.json(output)
})
