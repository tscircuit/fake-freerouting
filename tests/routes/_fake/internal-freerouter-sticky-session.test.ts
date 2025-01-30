import { expect, test } from "bun:test"
import defaultAxios from "redaxios"

test("Testing sticky session of internal-freerouter", async () => {
  const axios = defaultAxios.create({
    baseURL: "https://internal-freerouting-personal.fly.dev",
  })

  const headers = {
    "Freerouting-Profile-ID": "07d15f00-656b-4121-afe2-37ee91a288fb", // test user id
    "Freerouting-Environment-Host": "tscircuit/0.0.1", // test environment host
  }

  // Create a session
  const createSessionRes = await axios.post(
    "/v1/sessions/create",
    { body: "" },
    { headers },
  )
  const flyMachineId = createSessionRes.headers.get("fly-machine-id")
  const sessionId = createSessionRes.data.id

  // Create a job
  const createJobRes = await axios.post(
    "/v1/jobs/enqueue",
    {
      session_id: sessionId,
      name: "test-job",
      priority: "NORMAL",
    },
    { headers: { ...headers, "fly-force-instance-id": flyMachineId! } },
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
    { headers: { ...headers, "fly-force-instance-id": flyMachineId! } },
  )

  await axios.put(
    `/v1/jobs/${jobId}/start`,
    {},
    { headers: { ...headers, "fly-force-instance-id": flyMachineId! } },
  )
})

test("Testing sticky session of internal-freerouter to fail ", async () => {
  if (process.env.CI) {
    console.log("Skipping test in CI")
    return
  }

  const axios = defaultAxios.create({
    baseURL: "https://internal-freerouting-personal.fly.dev",
  })

  const headers = {
    "Freerouting-Profile-ID": "07d15f00-656b-4121-afe2-37ee91a288fb", // test user id
    "Freerouting-Environment-Host": "tscircuit/0.0.1", // test environment host
  }

  const createSessionRes = await axios.post(
    "/v1/sessions/create",
    { body: "" },
    { headers },
  )
  const flyMachineId = createSessionRes.headers.get("fly-machine-id")
  const machineIdWhereSessionIsNotCreated =
    flyMachineId === process.env.FLY_MACHINE_ID_1
      ? process.env.FLY_MACHINE_ID_2
      : process.env.FLY_MACHINE_ID_1

  const sessionId = createSessionRes.data.id

  try {
    await axios.post(
      "/v1/jobs/enqueue",
      { session_id: sessionId, name: "test-job", priority: "NORMAL" },
      {
        headers: {
          ...headers,
          "fly-force-instance-id": machineIdWhereSessionIsNotCreated!,
        },
      },
    )
    // Add explicit fail if we reach here
    throw new Error("Expected request to fail with 400 status")
  } catch (e: any) {
    expect(e.status).toBe(400)
  }
})
