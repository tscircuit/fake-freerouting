## /v1/jobs/list/f0993183-7df7-4490-b0c3-a69f242b1342

### GET Request

```json

```

### Response

```json
[
  {
    "id": "de64107e-502d-4def-9786-6ba4174ed3a8",
    "created_at": "2024-11-08T02:05:52.436319300Z",
    "started_at": null,
    "finished_at": null,
    "input": null,
    "snapshot": null,
    "output": null,
    "session_id": "f0993183-7df7-4490-b0c3-a69f242b1342",
    "name": "test-job",
    "state": "QUEUED",
    "priority": "NORMAL",
    "stage": "IDLE",
    "router_settings": {
      "default_preferred_direction_trace_cost": 1,
      "default_undesired_direction_trace_cost": 2.5,
      "job_timeout": "12:00:00",
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
]
```