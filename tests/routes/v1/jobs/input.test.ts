import { getTestServer } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("POST /v1/jobs/[job_id]/input", async () => {
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

  // Update job input
  const { data } = await axios.post(
    `/v1/jobs/${jobId}/input`,
    {
      filename: "test.dsn",
      data: "SGVsbG8gV29ybGQ=", // "Hello World" in base64
    },
    { headers },
  )

  expect(data).toMatchObject({
    id: jobId,
    input: {
      size: 11, // Length of "Hello World"
      filename: "test.dsn",
      format: "DSN",
    },
  })
})

test("POST /v1/jobs/[job_id]/input - not found", async () => {
  const { axios } = await getTestServer()

  const headers = {
    "Freerouting-Profile-ID": "test-user-id",
    "Freerouting-Environment-Host": "test-host",
  }

  await expect(
    axios.post(
      "/v1/jobs/non-existent-job/input",
      {
        filename: "test.dsn",
        data: "SGVsbG8gV29ybGQ=",
      },
      { headers },
    ),
  ).rejects.toThrow()
})
