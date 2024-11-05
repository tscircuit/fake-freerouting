import { getTestServer } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"
import fs from "fs"
import path from "path"

test("Complete user workflow", async () => {
  const { axios } = await getTestServer()

  const headers = {
    "Freerouting-Profile-ID": "test-user-id",
    "Freerouting-Environment-Host": "test-host",
  }

  // Step 1: Create a new session
  const createSessionRes = await axios.post("/v1/sessions/create", {}, { headers })
  const sessionId = createSessionRes.data.id
  
  expect(createSessionRes.data).toMatchObject({
    id: expect.any(String),
    user_id: "test-user-id",
    host: "test-host",
  })

  // Step 2: Create a new job
  const createJobRes = await axios.post(
    "/v1/jobs/enqueue",
    {
      session_id: sessionId,
      name: "workflow-test-job",
      priority: "NORMAL",
    },
    { headers },
  )
  const jobId = createJobRes.data.id

  expect(createJobRes.data).toMatchObject({
    id: expect.any(String),
    created_at: expect.any(String),
    session_id: sessionId,
    name: "workflow-test-job",
    state: "QUEUED",
    priority: "NORMAL",
    stage: "IDLE",
    router_settings: expect.any(Object),
  })

  // Step 3: Upload design file
  const testDsnFile = fs.readFileSync(
    path.join(process.cwd(), "tests/assets/example1.dsn"),
    "base64"
  )

  const uploadRes = await axios.post(
    `/v1/jobs/${jobId}/input`,
    {
      filename: "example1.dsn",
      data: testDsnFile,
    },
    { headers },
  )

  expect(uploadRes.data).toMatchObject({
    id: jobId,
    input: {
      filename: "example1.dsn",
      format: "DSN",
      size: expect.any(Number),
    },
  })

  // Step 4: Configure router settings
  const settingsRes = await axios.post(
    `/v1/jobs/${jobId}/settings`,
    {
      max_passes: 5,
      via_costs: 50,
      trace_costs: 10,
      start_pass: 1,
      start_ripup: 100,
    },
    { headers },
  )

  expect(settingsRes.data).toMatchObject({
    id: jobId,
    router_settings: expect.objectContaining({
      max_passes: 5,
      via_costs: 50,
      trace_costs: 10,
      start_pass: 1,
      start_ripup: 100,
    }),
  })

  // Step 5: Get job output
  const outputRes = await axios.get(`/v1/jobs/${jobId}/output`, { headers })

  expect(outputRes.data).toMatchObject({
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

  // Step 6: Verify final job state
  const finalJobRes = await axios.get(`/v1/jobs/${jobId}`, { headers })

  expect(finalJobRes.data).toMatchObject({
    id: jobId,
    session_id: sessionId,
    name: "workflow-test-job",
    state: "QUEUED",
    input: expect.any(Object),
    router_settings: expect.any(Object),
  })
})
