## /v1/jobs/06630d56-49af-43e4-b3c6-857e91594671

### GET Request

```json

```

### Response

```json
{
  "id": "06630d56-49af-43e4-b3c6-857e91594671",
  "created_at": "2024-10-29T22:41:22.995128598Z",
  "started_at": "2024-10-29T22:41:25.218309304Z",
  "input": {
    "size": 3891,
    "crc32": 2301961647,
    "format": "DSN",
    "layer_count": 0,
    "component_count": 0,
    "netclass_count": 0,
    "net_count": 0,
    "track_count": 0,
    "trace_count": 0,
    "via_count": 0,
    "filename": "test-job.dsn",
    "path": ""
  },
  "session_id": "1610a2a1-65dd-4a25-ab1d-a0ddfa8610aa",
  "name": "test-job",
  "state": "RUNNING",
  "priority": "NORMAL",
  "stage": "ROUTING",
  "router_settings": {
    "default_preferred_direction_trace_cost": 1,
    "default_undesired_direction_trace_cost": 1,
    "max_passes": 5,
    "fanout_max_passes": 20,
    "max_threads": 1,
    "improvement_threshold": 0.01,
    "trace_pull_tight_accuracy": 500,
    "allowed_via_types": true,
    "via_costs": 42,
    "plane_via_costs": 5,
    "start_ripup_costs": 100,
    "automatic_neckdown": true
  }
}
```