/**
 * The purpose of this script is to ping the production freerouting api and
 * record the responses so that we know how to design the fake. The result of
 * this script outputs into scripts/prod-request-recordings/{endpoint}.md
 */
import { writeFileSync } from "node:fs"
import * as Path from "node:path"

const OUTPUT_DIR = Path.join(import.meta.dirname, "prod-request-recordings")

async function fetchAndRecord(url: string, opts?: Parameters<typeof fetch>[1]) {
  const response = await fetch(url, opts).then((r) => r.json())
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

await fetchAndRecord("https://api.freerouting.app/v1/system/status")
