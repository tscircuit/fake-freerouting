import { getTestServer } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("POST /_fake/run_autorouter", async () => {
  const { axios } = await getTestServer()

  const headers = {
    "Freerouting-Profile-ID": "test-user-id",
    "Freerouting-Environment-Host": "test-host",
  }

  // Create a session
  const createSessionRes = await axios.post("/v1/sessions/create", {}, { headers })
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

  // Add input to the job
  const exampleDsn = await Bun.file("tests/assets/example1.dsn").text()
  const encodedDsn = Buffer.from(exampleDsn).toString('base64')

  // Add input to job
  await axios.post(
    `/v1/jobs/${jobId}/input`,
    {
      filename: "test.dsn",
      data: encodedDsn,
    },
    { headers },
  )

  // Run the autorouter
  const { data } = await axios.post("/_fake/run_autorouter", {}, { headers })
  expect(data.processed_jobs).toBe(1)

  // Check first job completed successfully
  const job1Status = await axios.get(`/v1/jobs/${jobId}`, { headers })
  expect(job1Status.data.state).toBe("COMPLETED")
  
  // Get job output and verify routing
  const output = await axios.get(`/v1/jobs/${jobId}/output`, { headers })
  const decodedOutput = Buffer.from(output.data.data, 'base64').toString()
  
  // Verify output contains routing information
  expect(decodedOutput).toContain("(wire")
  expect(output.data.track_count).toBeGreaterThan(0)

})
