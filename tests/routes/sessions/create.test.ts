import { getTestServer } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("create a session", async () => {
  const { axios } = await getTestServer()

  const headers = {
    "Freerouting-Profile-ID": "test-user-id",
    "Freerouting-Environment-Host": "test-host",
  }

  const { data } = await axios.post("/sessions/create", {}, { headers })

  expect(data).toMatchObject({
    id: expect.any(String),
    user_id: "test-user-id",
    host: "test-host",
  })
})
