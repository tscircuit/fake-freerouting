import { getTestServer } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"
import {
  convertDsnSessionToCircuitJson,
  parseDsnToDsnJson,
  type DsnPcb,
  type DsnSession,
} from "dsn-converter"
import { convertCircuitJsonToPcbSvg } from "circuit-to-svg"
import { su } from "@tscircuit/soup-util"

test("POST /_fake/run_autorouter - processes started jobs", async () => {
  const { axios } = await getTestServer()

  const headers = {
    "Freerouting-Profile-ID": "test-user-id",
    "Freerouting-Environment-Host": "test-host",
  }

  // Create a session
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

  // Add input to the job
  const exampleDsn = await Bun.file("tests/assets/example1.dsn").text()
  const encodedDsn = Buffer.from(exampleDsn).toString("base64")

  // Add input to job
  await axios.post(
    `/v1/jobs/${jobId}/input`,
    {
      filename: "test.dsn",
      data: encodedDsn,
    },
    { headers },
  )

  await axios.put(`/v1/jobs/${jobId}/start`, {}, { headers })

  // Run the autorouter
  const { data } = await axios.post("/_fake/run_autorouter", {}, { headers })

  // Check first job completed successfully
  const job1Status = await axios.get(`/v1/jobs/${jobId}`, { headers })
  expect(job1Status.data.state).toBe("COMPLETED")

  // Get job output and verify routing
  const output = await axios.get(`/v1/jobs/${jobId}/output`, { headers })
  const decodedOutput = Buffer.from(output.data.data, "base64").toString()

  // Verify output contains routing information
  expect(decodedOutput).toContain("(wire")
  expect(output.data.track_count).toBeGreaterThan(0)

  const dsnInput = parseDsnToDsnJson(exampleDsn) as DsnPcb
  const circuitJson = convertDsnSessionToCircuitJson(
    dsnInput,
    parseDsnToDsnJson(decodedOutput) as DsnSession,
  )

  expect(convertCircuitJsonToPcbSvg(circuitJson)).toMatchSvgSnapshot(
    import.meta.path,
  )
})

test("POST /_fake/run_autorouter - ignores unstarted jobs", async () => {
  const { axios } = await getTestServer()

  const headers = {
    "Freerouting-Profile-ID": "test-user-id",
    "Freerouting-Environment-Host": "test-host",
  }

  // Create a session
  const createSessionRes = await axios.post(
    "/v1/sessions/create",
    { body: "" },
    { headers },
  )
  const sessionId = createSessionRes.data.id

  // Create a job but don't start it
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
  const encodedDsn = Buffer.from(exampleDsn).toString("base64")

  await axios.post(
    `/v1/jobs/${jobId}/input`,
    {
      filename: "test.dsn",
      data: encodedDsn,
    },
    { headers },
  )

  // Run the autorouter without starting the job
  const { data } = await axios.post("/_fake/run_autorouter", {}, { headers })

  // Verify no jobs were processed
  expect(data.processed_jobs).toBe(0)
  expect(data.errors).toHaveLength(0)

  // Verify job is still in original state
  const jobStatus = await axios.get(`/v1/jobs/${jobId}`, { headers })
  expect(jobStatus.data.state).toBe("QUEUED")
})
