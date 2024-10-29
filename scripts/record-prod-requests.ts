/**
 * The purpose of this script is to ping the production freerouting api and
 * record the responses so that we know how to design the fake. The result of
 * this script outputs into scripts/prod-request-recordings/{endpoint}.md
 *
 * You can run this file by running `bun run record-prod` in the root of the
 * project, or just by running `bun scripts/record-prod-requests.ts`
 */
import { writeFileSync } from "node:fs"
import * as Path from "node:path"

const OUTPUT_DIR = Path.join(import.meta.dirname, "prod-request-recordings")

async function fetchAndRecord(url: string, opts?: Parameters<typeof fetch>[1]) {
  console.log(`Fetching ${url}...`)
  const res = await fetch(url, opts)
  const responseText = await res.text()
  let response: any
  try {
    response = JSON.parse(responseText)
  } catch (e) {
    console.log(`Failed to parse JSON: Status ${res.status} - ${responseText}`)
    throw e
  }
  const pathname = new URL(url).pathname

  writeFileSync(
    Path.join(OUTPUT_DIR, `${pathname.slice(1).replace(/\//g, "_")}.md`),
    `
## ${pathname}

### ${opts?.method ?? "GET"} Request

\`\`\`json
${opts?.body ?? ""}
\`\`\`

### Response

\`\`\`json
${JSON.stringify(response, null, "  ")}
\`\`\`

`.trim(),
  )

  return response
}

// System endpoints
await fetchAndRecord("https://api.freerouting.app/v1/system/status")
await fetchAndRecord("https://api.freerouting.app/v1/system/environment")

// Get example DSN file for testing
const exampleDsn = await fetch(
  "https://raw.githubusercontent.com/freerouting/freerouting/refs/heads/master/tests/Issue143-rpi_splitter.dsn",
).then((r) => r.text())

// Sessions endpoints
// const sessionResponse = await fetchAndRecord(
//   "https://api.freerouting.app/v1/sessions/create",
//   {
//     method: "POST",
//     // body: JSON.stringify({}),
//     body: "",
//     headers: {
//       // "Freerouting-Environment-Host": "test",
//       // "Content-Type": "application/json",
//       // "Freerouting-Profile-ID": "123e4567-e89b-12d3-a456-426614174000",
//       "Freerouting-Profile-Email": "test@example.com",
//     },
//   },
// )
const sessionId = "" // sessionResponse.id

// await fetchAndRecord("https://api.freerouting.app/v1/sessions/list")
// await fetchAndRecord(`https://api.freerouting.app/v1/sessions/${sessionId}`)
// await fetchAndRecord(
//   `https://api.freerouting.app/v1/sessions/${sessionId}/logs/0`,
// )

// Jobs endpoints
const jobResponse = await fetchAndRecord(
  "https://api.freerouting.app/v1/jobs/enqueue",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      session_id: sessionId,
      name: "test-job",
      priority: "NORMAL",
    }),
  },
)
const jobId = jobResponse.id

await fetchAndRecord(`https://api.freerouting.app/v1/jobs/list/${sessionId}`)

await fetchAndRecord(`https://api.freerouting.app/v1/jobs/${jobId}/settings`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    max_passes: 5,
    via_costs: 42,
  }),
})

await fetchAndRecord(`https://api.freerouting.app/v1/jobs/${jobId}/input`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    filename: "test.dsn",
    data: Buffer.from(exampleDsn).toString("base64"),
  }),
})

await fetchAndRecord(`https://api.freerouting.app/v1/jobs/${jobId}/start`, {
  method: "PUT",
})

await fetchAndRecord(`https://api.freerouting.app/v1/jobs/${jobId}/logs/0`)
await fetchAndRecord(`https://api.freerouting.app/v1/jobs/${jobId}`)
await fetchAndRecord(`https://api.freerouting.app/v1/jobs/${jobId}/output`)
