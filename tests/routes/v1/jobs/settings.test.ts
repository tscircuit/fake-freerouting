import { getTestServer } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("POST /v1/jobs/[job_id]/settings", async () => {
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

  // Update job settings
  const { data } = await axios.post(
    `/v1/jobs/${jobId}/settings`,
    {
      max_passes: 5,
      via_costs: 42,
    },
    { headers },
  )

  expect(data).toMatchObject({
    id: jobId,
    router_settings: expect.objectContaining({
      max_passes: 5,
      via_costs: 42,
    }),
  })
})

test("POST /v1/jobs/[job_id]/settings - not found", async () => {
  const { axios } = await getTestServer()

  const headers = {
    "Freerouting-Profile-ID": "test-user-id",
    "Freerouting-Environment-Host": "test-host",
  }

  await expect(
    axios.post(
      "/v1/jobs/non-existent-job/settings",
      {
        max_passes: 5,
        via_costs: 42,
      },
      { headers },
    ),
  ).rejects.toThrow()
})
