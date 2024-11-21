import { getTestServer } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("POST /v1/jobs/enqueue", async () => {
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
  const { data } = await axios.post(
    "/v1/jobs/enqueue",
    {
      session_id: sessionId,
      name: "test-job",
      priority: "NORMAL",
    },
    { headers },
  )

  expect(data).toMatchObject({
    id: expect.any(String),
    created_at: expect.any(String),
    session_id: sessionId,
    name: "test-job",
    state: "QUEUED",
    priority: "NORMAL",
    stage: "IDLE",
    router_settings: expect.any(Object),
  })
})

test("POST /v1/jobs/enqueue - invalid session", async () => {
  const { axios } = await getTestServer()

  const headers = {
    "Freerouting-Profile-ID": "test-user-id",
    "Freerouting-Environment-Host": "test-host",
  }

  await expect(
    axios.post(
      "/v1/jobs/enqueue",
      {
        session_id: "non-existent-session",
        name: "test-job",
        priority: "NORMAL",
      },
      { headers },
    ),
  ).rejects.toThrow()
})
