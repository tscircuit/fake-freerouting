import { getTestServer } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("POST /_fake/run_autorouter", async () => {
  const { axios } = await getTestServer()

  const headers = {
    "Freerouting-Profile-ID": "test-user-id",
    "Freerouting-Environment-Host": "test-host",
  }

  // Create a session
  const createSessionRes = await axios.post("/v1/sessions/create", {}, { headers })
  const sessionId = createSessionRes.data.id

  // Create two jobs - one with input, one without
  const createJobRes1 = await axios.post(
    "/v1/jobs/enqueue",
    {
      session_id: sessionId,
      name: "test-job-1",
      priority: "NORMAL",
    },
    { headers },
  )
  const jobId1 = createJobRes1.data.id

  const createJobRes2 = await axios.post(
    "/v1/jobs/enqueue",
    {
      session_id: sessionId,
      name: "test-job-2", 
      priority: "NORMAL",
    },
    { headers },
  )
  const jobId2 = createJobRes2.data.id

  // Add input to first job only
  await axios.post(
    `/v1/jobs/${jobId1}/input`,
    {
      filename: "test.dsn",
      data: "SGVsbG8gV29ybGQ=", // "Hello World" in base64
    },
    { headers },
  )

  // Run the autorouter
  const { data } = await axios.post("/_fake/run_autorouter", {}, { headers })

  // Verify response format
  expect(data).toMatchObject({
    processed_jobs: expect.any(Number),
    errors: expect.arrayContaining([
      expect.objectContaining({
        job_id: expect.any(String),
        error: expect.any(String),
      }),
    ]),
  })

  // Check first job completed successfully
  const job1Status = await axios.get(`/v1/jobs/${jobId1}`, { headers })
  expect(job1Status.data.state).toBe("COMPLETED")

  // Check second job failed due to missing input
  const job2Status = await axios.get(`/v1/jobs/${jobId2}`, { headers })
  expect(job2Status.data.state).toBe("FAILED")
})
