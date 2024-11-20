import { z } from "zod"

// When defining your database schema, try to use snake case for column names.

export const routerSettingsSchema = z.object({
  default_preferred_direction_trace_cost: z.number().default(1),
  default_undesired_direction_trace_cost: z.number().default(1),
  max_passes: z.number().default(100),
  fanout_max_passes: z.number().default(20),
  max_threads: z.number().default(1),
  improvement_threshold: z.number().default(0.01),
  trace_pull_tight_accuracy: z.number().default(500),
  allowed_via_types: z.boolean().default(true),
  via_costs: z.number().default(50),
  plane_via_costs: z.number().default(5),
  start_ripup_costs: z.number().default(100),
  automatic_neckdown: z.boolean().default(true),
})
export type RouterSettings = z.infer<typeof routerSettingsSchema>

export const jobOutputSchema = z.object({
  size: z.number().default(0),
  crc32: z.number().default(0),
  format: z.string(),
  layer_count: z.number().default(0),
  component_count: z.number().default(0),
  netclass_count: z.number().default(0),
  net_count: z.number().default(0),
  track_count: z.number().default(0),
  trace_count: z.number().default(0),
  via_count: z.number().default(0),
  filename: z.string(),
  path: z.string().default(""),
  data: z.string(),
})
export type JobOutput = z.infer<typeof jobOutputSchema>

export const jobInputSchema = z.object({
  size: z.number().default(0),
  crc32: z.number().default(0),
  format: z.string(),
  layer_count: z.number().default(0),
  component_count: z.number().default(0),
  netclass_count: z.number().default(0),
  net_count: z.number().default(0),
  track_count: z.number().default(0),
  trace_count: z.number().default(0),
  via_count: z.number().default(0),
  filename: z.string(),
  path: z.string().default(""),
  _input_dsn: z.string().optional(),
})
export type JobInput = z.infer<typeof jobInputSchema>

export const sessionSchema = z.object({
  session_id: z.string(),
  user_id: z.string(),
  host: z.string(),
  created_at: z.string(),
})
export type Session = z.infer<typeof sessionSchema>

export const jobStateSchema = z.enum([
  "QUEUED",
  "RUNNING",
  "COMPLETED",
  "FAILED",
  "READY_TO_START",
])

export const jobSchema = z.object({
  job_id: z.string(),
  created_at: z.string(),
  started_at: z.string().optional(),
  input: jobInputSchema.optional(),
  output: jobOutputSchema.optional(),
  session_id: z.string(),
  name: z.string(),
  state: jobStateSchema,
  priority: z.enum(["LOW", "NORMAL", "HIGH"]),
  stage: z.enum(["IDLE", "ROUTING"]),
  router_settings: routerSettingsSchema,
})
export type Job = z.infer<typeof jobSchema>

export const databaseSchema = z.object({
  idCounter: z.number().default(0),
  sessions: z.array(sessionSchema).default([]),
  jobs: z.array(jobSchema).default([]),
})
export type DatabaseSchema = z.infer<typeof databaseSchema>
