import { getTestServer } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("GET /v1/sessions/[session_id]", async () => {
  const { axios } = await getTestServer()

  const headers = {
    "Freerouting-Profile-ID": "test-user-id",
    "Freerouting-Environment-Host": "test-host",
  }

  // Create a session first
  const createRes = await axios.post("/v1/sessions/create", {}, { headers })
  const sessionId = createRes.data.id

  // Get specific session
  const { data } = await axios.get(`/v1/sessions/${sessionId}`, { headers })

  expect(data).toMatchObject({
    id: sessionId,
    user_id: "test-user-id",
    host: "test-host",
    created_at: expect.any(String),
  })
})

test("GET /v1/sessions/[session_id] - not found", async () => {
  const { axios } = await getTestServer()

  const headers = {
    "Freerouting-Profile-ID": "test-user-id",
    "Freerouting-Environment-Host": "test-host",
  }

  await expect(
    axios.get("/v1/sessions/non-existent-id", { headers }),
  ).rejects.toThrow()
})
