## /v1/jobs/de64107e-502d-4def-9786-6ba4174ed3a8

### GET Request

```json

```

### Response

```json
{
  "id": "de64107e-502d-4def-9786-6ba4174ed3a8",
  "created_at": "2024-11-08T02:05:52.436319300Z",
  "started_at": null,
  "finished_at": null,
  "input": {
    "size": 3891,
    "crc32": 2301961647,
    "format": "DSN",
    "statistics": {
      "host": "CadSoft,Eagle V 9.5 - Using eagle2freerouting.ulp, version 2022-09-01, on 9/20/2022 9:56 PM",
      "layer_count": 2,
      "component_count": 3,
      "netclass_count": 0,
      "total_net_count": 6,
      "unrouted_net_count": null,
      "routed_net_count": 0,
      "routed_net_length": null,
      "clearance_violation_count": null,
      "via_count": 3
    },
    "filename": "test-job.dsn",
    "path": ""
  },
  "snapshot": null,
  "output": null,
  "session_id": "f0993183-7df7-4490-b0c3-a69f242b1342",
  "name": "test-job",
  "state": "READY_TO_START",
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
```