import { withRouteSpec } from "lib/middleware/with-winter-spec"
import { z } from "zod"
import { withApiKeyAuth } from "lib/middleware/with-api-key-auth"
import { NotFoundError } from "winterspec/middleware"
import { jobOutputSchema } from "lib/db/schema"

export default withRouteSpec({
  methods: ["GET"],
  routeParams: z.object({
    job_id: z.string(),
  }),
  jsonResponse: jobOutputSchema,
  auth: "api_key",
})((req, ctx) => {
  const jobId = req.routeParams.job_id
  const job = ctx.db.jobs.find((j) => j.job_id === jobId)

  if (!job) {
    throw new NotFoundError("Job not found")
  }

  if (job.state !== "COMPLETED") {
    throw new Error("The job hasn't finished yet.")
  }

  if (!job.output) {
    throw new Error("No output available for this job")
  }

  return ctx.json(job.output)
})
