import { getTestServer } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("PUT /v1/jobs/[job_id]/start", async () => {
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

  // Upload input file
  const exampleDsn = await Bun.file("tests/assets/example1.dsn").text()
  await axios.post(
    `/v1/jobs/${jobId}/input`,
    {
      filename: "test.dsn",
      data: Buffer.from(exampleDsn).toString("base64"),
    },
    { headers },
  )

  // Start the job
  const { data } = await axios.put(`/v1/jobs/${jobId}/start`, {}, { headers })

  expect(data).toMatchObject({
    id: jobId,
    created_at: expect.any(String),
    started_at: expect.any(String),
    input: expect.any(Object),
    session_id: sessionId,
    name: "test-job",
    state: "READY_TO_START",
    priority: "NORMAL",
    stage: "ROUTING",
    router_settings: expect.any(Object),
  })
})

test("PUT /v1/jobs/[job_id]/start - not found", async () => {
  const { axios } = await getTestServer()

  const headers = {
    "Freerouting-Profile-ID": "test-user-id",
    "Freerouting-Environment-Host": "test-host",
  }

  await expect(
    axios.put("/v1/jobs/non-existent-job/start", {}, { headers }),
  ).rejects.toThrow()
})

test("PUT /v1/jobs/[job_id]/start - no input file", async () => {
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

  // Create a job without input
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

  // Try to start job without input
  const response = await axios.put(
    `/v1/jobs/${jobId}/start`,
    {},
    {
      headers,
      validateStatus: () => true, // Don't throw on error status codes
    },
  )

  expect(response.status).toBe(400)
  expect(response.data.error).toBe("Cannot start job without input file")
})
