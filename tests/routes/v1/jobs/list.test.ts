import { getTestServer } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("GET /v1/jobs/list/[session_id]", async () => {
  const { axios } = await getTestServer()

  const headers = {
    "Freerouting-Profile-ID": "test-user-id",
    "Freerouting-Environment-Host": "test-host",
  }

  // Create a session first
  const createSessionRes = await axios.post(
    "/v1/sessions/create",
    { body: "" },
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

  // Get list of jobs for session
  const { data } = await axios.get(`/v1/jobs/list/${sessionId}`, { headers })

  expect(Array.isArray(data)).toBe(true)
  expect(data).toContain(jobId)
})

test("GET /v1/jobs/list/[session_id] - not found", async () => {
  const { axios } = await getTestServer()

  const headers = {
    "Freerouting-Profile-ID": "test-user-id",
    "Freerouting-Environment-Host": "test-host",
  }

  await expect(
    axios.get("/v1/jobs/list/non-existent-session", { headers }),
  ).rejects.toThrow()
})
