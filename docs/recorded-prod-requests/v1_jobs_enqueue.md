## /v1/jobs/enqueue

### POST Request

```json
{"session_id":"1610a2a1-65dd-4a25-ab1d-a0ddfa8610aa","name":"test-job","priority":"NORMAL"}
```

### Response

```json
{
  "id": "06630d56-49af-43e4-b3c6-857e91594671",
  "created_at": "2024-10-29T22:41:22.995128598Z",
  "session_id": "1610a2a1-65dd-4a25-ab1d-a0ddfa8610aa",
  "name": "test-job",
  "state": "QUEUED",
  "priority": "NORMAL",
  "stage": "IDLE",
  "router_settings": {
    "default_preferred_direction_trace_cost": 1,
    "default_undesired_direction_trace_cost": 1,
    "max_passes": 100,
    "fanout_max_passes": 20,
    "max_threads": 1,
    "improvement_threshold": 0.01,
    "trace_pull_tight_accuracy": 500,
    "allowed_via_types": true,
    "via_costs": 50,
    "plane_via_costs": 5,
    "start_ripup_costs": 100,
    "automatic_neckdown": true
  }
}
```