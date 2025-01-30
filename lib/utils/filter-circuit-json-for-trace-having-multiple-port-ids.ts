import type { AnyCircuitElement, SourceTrace } from "circuit-json"

export function filterCircuitJsonForTraceHavingMultiplePortIds(
  circuitJson: AnyCircuitElement[],
) {
  // Get all source traces
  const sourceTraces = circuitJson.filter(
    (item): item is typeof item & { connected_source_port_ids: string[] } =>
      item.type === "source_trace" &&
      Array.isArray(item.connected_source_port_ids),
  )

  // First split any traces with more than 2 ports
  const tracesToSplit = sourceTraces.filter(
    (trace) => trace.connected_source_port_ids.length > 2,
  ) as SourceTrace[]

  for (const traceToSplit of tracesToSplit) {
    // Remove the original trace
    circuitJson.splice(circuitJson.indexOf(traceToSplit), 1)

    // Create pairs of connections
    const ports = traceToSplit.connected_source_port_ids
    const newTraces = []

    for (let i = 0; i < ports.length - 1; i++) {
      newTraces.push({
        type: "source_trace",
        source_trace_id: `${traceToSplit.source_trace_id}_${i}`,
        connected_source_net_ids: traceToSplit.connected_source_net_ids,
        connected_source_port_ids: [ports[i], ports[i + 1]],
      })
    }

    circuitJson.push(...(newTraces as AnyCircuitElement[]))
  }

  // Get updated list of source traces and PCB traces
  const updatedSourceTraces = circuitJson.filter(
    (item): item is typeof item & { connected_source_port_ids: string[] } =>
      item.type === "source_trace" &&
      Array.isArray(item.connected_source_port_ids),
  ) as SourceTrace[]
  const pcbTraces = circuitJson.filter((item) => item.type === "pcb_trace")

  // Helper function to check if two port arrays have matching patterns
  const hasMatchingPorts = (ports1: string[], ports2: string[]) => {
    return (
      ports1.length === ports2.length &&
      ports1.every((port1, index) => {
        const pattern1 = port1.split("-").pop()
        const pattern2 = ports2[index].split("-").pop()
        return (
          pattern1 &&
          pattern2 &&
          (pattern1.includes(pattern2) || pattern2.includes(pattern1))
        )
      })
    )
  }

  // Find and remove duplicate traces, keeping ones with PCB traces
  const tracesToRemove = updatedSourceTraces.filter((trace1) => {
    const hasPcbTrace = pcbTraces.some(
      (pcb) => pcb.source_trace_id === trace1.source_trace_id,
    )
    if (hasPcbTrace) return false

    // Check if there's another trace with the same port patterns that has a PCB trace
    return updatedSourceTraces.some(
      (trace2) =>
        trace1 !== trace2 &&
        hasMatchingPorts(
          trace1.connected_source_port_ids,
          trace2.connected_source_port_ids,
        ) &&
        pcbTraces.some((pcb) => pcb.source_trace_id === trace2.source_trace_id),
    )
  })

  // Remove the duplicate traces
  for (const trace of tracesToRemove) {
    const index = circuitJson.indexOf(trace)
    if (index !== -1) {
      circuitJson.splice(index, 1)
    }
  }
}
