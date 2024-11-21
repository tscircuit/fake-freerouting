import { getTestServer } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

// TODO: This test needs to run an autorouter to get the output
test.skip("GET /v1/jobs/[job_id]/output", async () => {
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

  // Get job output
  const { data } = await axios.get(`/v1/jobs/${jobId}/output`, { headers })

  expect(data).toMatchObject({
    job_id: jobId,
    data: expect.any(String),
    size: expect.any(Number),
    crc32: expect.any(Number),
    format: "SES",
    layer_count: expect.any(Number),
    component_count: expect.any(Number),
    netclass_count: expect.any(Number),
    net_count: expect.any(Number),
    track_count: expect.any(Number),
    trace_count: expect.any(Number),
    via_count: expect.any(Number),
    filename: expect.stringMatching(/\.ses$/),
    path: expect.any(String),
  })
})

test("GET /v1/jobs/[job_id]/output - not found", async () => {
  const { axios } = await getTestServer()

  const headers = {
    "Freerouting-Profile-ID": "test-user-id",
    "Freerouting-Environment-Host": "test-host",
  }

  await expect(
    axios.get("/v1/jobs/non-existent-job/output", { headers }),
  ).rejects.toThrow()
})
