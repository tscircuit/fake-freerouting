import { MultilayerIjump } from "@tscircuit/infgrid-ijump-astar"
import { convertCircuitJsonToDsnJson, convertDsnJsonToCircuitJson, parseDsnToDsnJson, stringifyDsnJson } from "dsn-converter"
import { withRouteSpec } from "lib/middleware/with-winter-spec"
import { z } from "zod"

export default withRouteSpec({
  methods: ["POST"],
  jsonBody: z.object({
    data: z.string(),
  }),
  jsonResponse: z.object({
    processed_jobs: z.number(),
    errors: z.array(
      z.object({
        job_id: z.string(),
        error: z.string(),
      }),
    ),
  }),
})((req, ctx) => {
  const errors: Array<{ job_id: string; error: string }> = []
  let processedCount = 0

  // Find all QUEUED jobs
  const queuedJobs = ctx.db.jobs.filter((job) => job.state === "QUEUED")

  for (const job of queuedJobs) {
    try {
      // Verify job has input file
      if (!job.input) {
        throw new Error("No input file uploaded")
      }

      // Update job state to RUNNING
      const jobIndex = ctx.db.jobs.findIndex((j) => j.job_id === job.job_id)
      ctx.db.jobs[jobIndex] = {
        ...job,
        state: "RUNNING",
        stage: "ROUTING",
        started_at: new Date().toISOString(),
      }

      // Decode input DSN and convert to Circuit JSON
      const dsnString = Buffer.from(req.jsonBody.data, 'base64').toString()
      const dsnJson = parseDsnToDsnJson(dsnString)
      const circuitJson = convertDsnJsonToCircuitJson(dsnJson)

      // Also process the input data from request body if provided
      let requestCircuitJson = null
      if (req.jsonBody?.data) {
        const requestDsnString = Buffer.from(req.jsonBody.data, 'base64').toString()
        const requestDsnJson = parseDsnToDsnJson(requestDsnString)
        requestCircuitJson = convertDsnJsonToCircuitJson(requestDsnJson)
      }

      // Use the request circuit JSON if provided, otherwise use the job input
      const finalCircuitJson = requestCircuitJson || circuitJson

      // Extract board bounds from circuit JSON
      const components = finalCircuitJson.components || []
      const bounds = components.reduce((acc, comp) => {
        return {
          minX: Math.min(acc.minX, comp.x - comp.width/2),
          maxX: Math.max(acc.maxX, comp.x + comp.width/2),
          minY: Math.min(acc.minY, comp.y - comp.height/2),
          maxY: Math.max(acc.maxY, comp.y + comp.height/2)
        }
      }, { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity })

      // Add margin to bounds
      const margin = 2 // 2mm margin
      bounds.minX -= margin
      bounds.maxX += margin
      bounds.minY -= margin
      bounds.maxY += margin

      // Convert components to obstacles
      const obstacles = components.map(comp => ({
        type: "rect",
        layers: ["top", "bottom"],
        center: { x: comp.x, y: comp.y },
        width: comp.width,
        height: comp.height,
        connectedTo: []
      }))

      // Convert nets to connections
      const connections = finalCircuitJson.nets?.map(net => ({
        name: net.name,
        pointsToConnect: net.points.map(point => ({
          x: point.x,
          y: point.y,
          layer: point.layer,
          pcb_port_id: point.port_id
        }))
      })) || []

      // Create MultilayerIjump instance
      const ijump = new MultilayerIjump({
        OBSTACLE_MARGIN: 0.32, // 2x minimum trace width
        isRemovePathLoopsEnabled: true,
        optimizeWithGoalBoxes: true,
        connMap: finalCircuitJson.nets?.reduce((acc, net) => {
          acc[net.name] = net.points.map(p => p.port_id)
          return acc
        }, {}),
        input: {
          obstacles,
          minTraceWidth: 0.16,
          connections,
          layerCount: finalCircuitJson.board?.layer_count || 2,
          bounds,
        },
      })

      // Run autorouter
      const traces = ijump.solveAndMapToTraces()

      // Convert back to DSN format
      const routedCircuitJson = {
        ...circuitJson,
        traces,
      }
      const routedDsnJson = convertCircuitJsonToDsnJson(routedCircuitJson)
      const routedDsnString = stringifyDsnJson(routedDsnJson)
      
      // Create output
      const output = {
        size: Buffer.from(routedDsnString).length,
        crc32: 0, // Would need to calculate actual CRC32
        format: "SES",
        layer_count: circuitJson.board?.layer_count || 2,
        component_count: circuitJson.components?.length || 0,
        netclass_count: 0,
        net_count: circuitJson.nets?.length || 0,
        track_count: traces.length,
        trace_count: traces.length,
        via_count: traces.filter(t => t.route.some(r => r.route_type === "via")).length,
        filename: `${job.name}.ses`,
        path: "",
        data: Buffer.from(routedDsnString).toString("base64")
      }

      // Add traces to the output
      const outputWithTraces = {
        ...output,
        traces: traces
      }

      ctx.db.jobs[jobIndex] = {
        ...ctx.db.jobs[jobIndex],
        state: "COMPLETED",
        output: outputWithTraces
      }

      processedCount++
    } catch (error) {
      // Update job state to FAILED
      const jobIndex = ctx.db.jobs.findIndex((j) => j.job_id === job.job_id)
      ctx.db.jobs[jobIndex] = {
        ...job,
        state: "FAILED",
      }

      errors.push({
        job_id: job.job_id,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  return ctx.json({
    processed_jobs: processedCount,
    errors,
  })
})
