# MultilayerIjump Autorouter

The MultilayerIjump autorouter is a PCB routing solution that supports multi-layer routing with automatic via placement. This guide explains how to use the autorouter in your projects.

## Basic Usage

```javascript
const ijump = new MultilayerIjump({
  OBSTACLE_MARGIN: minTraceWidth * 2,
  isRemovePathLoopsEnabled: true,
  optimizeWithGoalBoxes: true,
  connMap: connectivityMap,
  input: {
    obstacles: [], // Array of obstacles
    minTraceWidth: 0.16, // Minimum trace width in mm
    connections: [
      {
        name: "unique_trace_id",
        pointsToConnect: [
          { x: 0, y: 0, layer: "top", pcb_port_id: "port1" },
          { x: 10, y: 10, layer: "bottom", pcb_port_id: "port2" },
        ],
      },
    ],
    layerCount: 2,
    bounds: {
      minX: -5,
      maxX: 15,
      minY: -5,
      maxY: 15,
    },
  },
})

const traces = ijump.solveAndMapToTraces()
```

## Configuration Options

### Constructor Parameters

- `OBSTACLE_MARGIN`: Distance to maintain from obstacles (typically 2x minimum trace width)
- `isRemovePathLoopsEnabled`: Boolean to enable path loop removal
- `optimizeWithGoalBoxes`: Boolean to enable optimization using goal boxes (recommended when connecting PCB ports)
- `connMap`: Connectivity map for determining electrical connections

### Input Object Structure

```javascript
{
  obstacles: Array<Obstacle>,
  minTraceWidth: number,
  connections: Array<Connection>,
  layerCount: number,
  bounds: Bounds
}
```

#### Obstacle Definition

```javascript
{
  type: "rect",
  layers: string[],
  center: { x: number, y: number },
  width: number,
  height: number,
  connectedTo: string[] // IDs of electrically connected elements
}
```

#### Connection Definition

```javascript
{
  name: string,
  pointsToConnect: Array<{
    x: number,
    y: number,
    layer: string,
    pcb_port_id?: string
  }>
}
```

#### Bounds Definition

```javascript
{
  minX: number,
  maxX: number,
  minY: number,
  maxY: number
}
```

## Output Format

The `solveAndMapToTraces()` method returns an array of simplified PCB traces. Each trace contains a route array with segments that can be either wires or vias:

```javascript
{
  route: [
    {
      route_type: "wire",
      start_pcb_port_id?: string,
      end_pcb_port_id?: string,
      layer: string,
      x: number,
      y: number
    },
    {
      route_type: "via",
      from_layer: string,
      to_layer: string,
      x: number,
      y: number
    }
  ]
}
```

## Best Practices

1. **Obstacle Margins**: Set the obstacle margin to at least twice the minimum trace width to ensure adequate clearance.

2. **Bounds**: Add a margin to the routing bounds (typically 2mm) beyond the actual connection points to give the router room to navigate around obstacles.

3. **Layer Assignment**: When working with a dominant layer, ensure all wire segments have a layer assigned. The router may not always specify layers for single-layer routes.

4. **Error Handling**: Always handle cases where the router cannot find a solution:

```javascript
try {
  const traces = ijump.solveAndMapToTraces()
  if (traces.length === 0) {
    console.error("No route found")
    return
  }
  // Process traces
} catch (e) {
  console.error("Error solving route:", e.message)
}
```

## Via Parameters

When the router creates vias, you can specify their physical parameters:

```javascript
{
  hole_diameter: 0.3, // mm
  outer_diameter: 0.6, // mm
  layers: [fromLayer, toLayer]
}
```

## Limitations

1. The router requires a defined boundary box for operation
2. All obstacles must be rectangular
3. The router works best with two-layer boards
4. Complex routes may require manual route hints or multiple passes

## Performance Considerations

- Larger boundary boxes increase computation time
- More obstacles increase computation time
- Enable path loop removal for cleaner routes but slightly longer computation times
- Use goal boxes optimization when connecting PCB ports for better results
