import { getTestServer } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("GET /v1/jobs/[job_id]", async () => {
  const { axios } = await getTestServer()

  const headers = {
    "Freerouting-Profile-ID": "test-user-id",
    "Freerouting-Environment-Host": "test-host",
  }

  // Create a session first
  const createSessionRes = await axios.post(
    "/v1/sessions/create",
    {},
    { headers },
  )
  const sessionId = createSessionRes.data.id

  // Create a job
  const createJobRes = await axios.post(
    "/v1/jobs/enqueue",
    {
      session_id: sessionId,
      name: "test-job",
      priority: "NORMAL",
    },
    { headers },
  )
  const jobId = createJobRes.data.id

  // Get job details
  const { data } = await axios.get(`/v1/jobs/${jobId}`, { headers })

  expect(data).toMatchObject({
    id: jobId,
    created_at: expect.any(String),
    session_id: sessionId,
    name: "test-job",
    state: "QUEUED",
    priority: "NORMAL",
    stage: "IDLE",
    router_settings: expect.any(Object),
  })
})

test("GET /v1/jobs/[job_id] - not found", async () => {
  const { axios } = await getTestServer()

  const headers = {
    "Freerouting-Profile-ID": "test-user-id",
    "Freerouting-Environment-Host": "test-host",
  }

  await expect(
    axios.get("/v1/jobs/non-existent-job", { headers }),
  ).rejects.toThrow()
})
