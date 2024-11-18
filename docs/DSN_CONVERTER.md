# DSN Converter Documentation

The DSN converter is a tool for converting between Circuit JSON format and DSN (Design) files used in PCB design. This document explains the key components and their functionality.

## Core Functionality

The converter provides bidirectional conversion between:
- Circuit JSON format (used by tscircuit)
- DSN files (used by PCB design tools like KiCad and FreeRouting)

## Key Components

### Circuit JSON to DSN Conversion

The main conversion functions are:

- `convertCircuitJsonToDsnString`: Converts Circuit JSON to DSN file format string
- `convertCircuitJsonToDsnJson`: Converts Circuit JSON to intermediate DSN JSON format
- `stringifyDsnJson`: Converts DSN JSON to DSN file format string

### DSN to Circuit JSON Conversion

For converting DSN files to Circuit JSON:

- `parseDsnToCircuitJson`: Main entry point for converting DSN files to Circuit JSON
- `parseDsnToDsnJson`: Parses DSN file into intermediate DSN JSON format
- `convertDsnJsonToCircuitJson`: Converts DSN JSON to Circuit JSON

### Component Processing

Several specialized functions handle different PCB elements:

- `processComponentsAndPads`: Processes components and their pads
- `processPlatedHoles`: Handles plated holes in the PCB
- `processNets`: Processes electrical connections between components
- `processPcbTraces`: Converts PCB traces between formats

### Utility Functions

Helper functions for specific conversions:

- `convertPadstacksToSmtPads`: Converts padstack definitions to SMT pads
- `convertPolylinePathToPcbTraces`: Converts polyline paths to PCB traces
- `convertWiringPathToPcbTraces`: Converts wiring paths to PCB traces
- `getComponentValue`: Extracts component values (resistance, capacitance)
- `getFootprintName`: Determines footprint names for components
- `getPadstackName`: Generates padstack names for components

## File Structure

```
lib/
├── dsn-pcb/
│   ├── circuit-json-to-dsn-json/    # Circuit JSON to DSN conversion
│   └── dsn-json-to-circuit-json/    # DSN to Circuit JSON conversion
└── utils/                           # Utility functions
```

## Usage Example

```typescript
import { 
  convertCircuitJsonToDsnString,
  parseDsnToCircuitJson 
} from 'dsn-converter'

// Convert Circuit JSON to DSN
const dsnString = convertCircuitJsonToDsnString(circuitJson)

// Convert DSN to Circuit JSON
const circuitJson = parseDsnToCircuitJson(dsnString)
```

## Coordinate Systems

The converter handles coordinate system transformations:
- Circuit JSON uses millimeters (mm)
- DSN files use micrometers (μm)
- Y-axis may be flipped between formats

## Types

Key types are defined in `types.ts`:
- `DsnPcb`: Represents a PCB in DSN format
- `DsnSession`: Represents a DSN session
- `Component`, `Padstack`, `Net`: Various PCB elements
