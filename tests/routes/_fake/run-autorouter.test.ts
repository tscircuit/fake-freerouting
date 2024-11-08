import { getTestServer } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"
import circuitJson from "tests/assets/circuit.json"
import { convertCircuitJsonToDsnJson, parseDsnToDsnJson, convertDsnJsonToCircuitJson, stringifyDsnJson } from "dsn-converter"

test.skip("POST /_fake/run_autorouter", async () => {
  const { axios } = await getTestServer()

  const headers = {
    "Freerouting-Profile-ID": "test-user-id",
    "Freerouting-Environment-Host": "test-host",
  }

  // Create a session
  const createSessionRes = await axios.post("/v1/sessions/create", {}, { headers })
  const sessionId = createSessionRes.data.id

  // Create two jobs - one with input, one without
  const createJobRes1 = await axios.post(
    "/v1/jobs/enqueue",
    {
      session_id: sessionId,
      name: "test-job-1",
      priority: "NORMAL",
    },
    { headers },
  )
  const jobId1 = createJobRes1.data.id


  // Convert circuit JSON to DSN format and encode as base64
  const dsnJson = convertCircuitJsonToDsnJson(circuitJson as any)
  const dsnString = stringifyDsnJson(dsnJson)
  const dsnBase64 = Buffer.from(dsnString).toString('base64')

  // Add input to first job
  await axios.post(
    `/v1/jobs/${jobId1}/input`,
    {
      filename: "test.dsn",
      data: dsnBase64,
    },
    { headers },
  )

  // Run the autorouter
  const { data } = await axios.post("/_fake/run_autorouter", {}, { headers })

  // Verify response format
  expect(data).toMatchObject({
    processed_jobs: expect.any(Number),
    errors: expect.any(Array),
  })

  // If there are errors, verify their format
  if (data.errors.length > 0) {
    expect(data.errors[0]).toMatchObject({
      job_id: expect.any(String),
      error: expect.any(String),
    })
  }

  // Get the output from the completed job
  const outputRes = await axios.get(`/v1/jobs/${jobId1}/output`, { headers })
  
  // Decode the base64 output
  const decodedOutput = Buffer.from(outputRes.data.data, 'base64').toString()
  
  // Convert back to DSN JSON and then to Circuit JSON
  const outputDsnJson = parseDsnToDsnJson(decodedOutput)
  const outputCircuitJson = convertDsnJsonToCircuitJson(outputDsnJson)

  // Check job completed successfully
  const job1Status = await axios.get(`/v1/jobs/${jobId1}`, { headers })
  expect(job1Status.data.state).toBe("COMPLETED")

  // Verify the output circuit JSON has expected structure
  expect(outputCircuitJson).toMatchObject({
    // Add specific circuit JSON validation here based on your needs
    // This is just an example structure:
    components: expect.any(Array),
    nets: expect.any(Array),
    board: expect.any(Object)
  })
})
