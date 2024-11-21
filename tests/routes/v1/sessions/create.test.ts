import { getTestServer } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("POST /v1/sessions/create", async () => {
  const { axios } = await getTestServer()

  const headers = {
    "Freerouting-Profile-ID": "test-user-id",
    "Freerouting-Environment-Host": "test-host",
  }

  const { data } = await axios.post("/v1/sessions/create", {}, { headers })

  expect(data).toMatchObject({
    id: expect.any(String),
    user_id: "test-user-id",
    host: "test-host",
  })
})
