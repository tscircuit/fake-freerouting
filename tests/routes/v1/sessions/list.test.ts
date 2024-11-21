import { getTestServer } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("GET /v1/sessions/list", async () => {
  const { axios } = await getTestServer()

  const headers = {
    "Freerouting-Profile-ID": "test-user-id",
    "Freerouting-Environment-Host": "test-host",
  }

  // Create a session first
  const createRes = await axios.post(
    "/v1/sessions/create",
    { body: "" },
    { headers },
  )
  const sessionId = createRes.data.id

  // Get list of sessions
  const { data } = await axios.get("/v1/sessions/list", { headers })

  expect(Array.isArray(data)).toBe(true)
  expect(data).toContain(sessionId)
})
