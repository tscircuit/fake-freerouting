## /v1/jobs/de64107e-502d-4def-9786-6ba4174ed3a8/input

### POST Request

```json
{"filename":"test.dsn","data":"KFBDQiAidW50aXRsZWQuYnJkIgogIChwYXJzZXIKICAgIChzdHJpbmdfcXVvdGUgIikKICAgIChzcGFjZV9pbl9xdW90ZWRfdG9rZW5zIG9uKQogICAgKGhvc3RfY2FkIENhZFNvZnQpCiAgICAoaG9zdF92ZXJzaW9uICJFYWdsZSBWIDkuNSAtIFVzaW5nIGVhZ2xlMmZyZWVyb3V0aW5nLnVscCwgdmVyc2lvbiAyMDIyLTA5LTAxLCBvbiA5LzIwLzIwMjIgOTo1NiBQTSIpCiAgICAoY2FzZV9zZW5zaXRpdmUgb2ZmKQogICAgKHZpYV9yb3RhdGVfZmlyc3Qgb24pCiAgKQogIChyZXNvbHV0aW9uIG1pbCAyNTQwKQogICh1bml0IG1pbCkKICAoc3RydWN0dXJlCiAgICAobGF5ZXIgIjEjVG9wIiAodHlwZSBzaWduYWwpKQogICAgKGxheWVyICIxNiNCb3R0b20iICh0eXBlIHNpZ25hbCkpCiAgICAoYm91bmRhcnkKICAgICAgKHJlY3QgcGNiIDAuMDAwMDAwIDAuMDAwMDAwIDgzNy4wMDc4NzQgMTY0OS42MDYyOTkpKQogICAgKGJvdW5kYXJ5CiAgICAgIChwYXRoIHNpZ25hbCAwIDAuMDAwMDAwIDAuMDAwMDAwIDgzNy4wMDc4NzQgMC4wMDAwMDAgODM3LjAwNzg3NCAxNjQ5LjYwNjI5OSAwLjAwMDAwMCAxNjQ5LjYwNjI5OSAgMC4wMDAwMDAgMC4wMDAwMDApCiAgICAgIChjbGVhcmFuY2VfY2xhc3MgYm91bmRhcnkpCiAgICApCiAgICAodmlhCiAgICAgICJSb3VuZDEkMTMuNzc5NTI4IgogICAgKQogICAgKGNvbnRyb2wKICAgICAgKHZpYV9hdF9zbWQgb24pCiAgICApCiAgICAocnVsZSAod2lkdGggMTYuMDAwMDAwKShjbGVhcmFuY2UgMTIuMDAwMDAwKSkKICAgIChydWxlIChjbGVhcmFuY2UgMTAuMDAwMDAwICh0eXBlIGRlZmF1bHRfYm91bmRhcnkpKSkKICAgIChydWxlIChjbGVhcmFuY2UgNi4wMDAwMDAgKHR5cGUgd2lyZV92aWEpKSkKICAgIChydWxlIChjbGVhcmFuY2UgNi4wMDAwMDAgKHR5cGUgcGluX3BpbikpKQogICAgKHJ1bGUgKGNsZWFyYW5jZSA2LjAwMDAwMCAodHlwZSBwaW5fdmlhKSkpCiAgICAocnVsZSAoY2xlYXJhbmNlIDYuMDAwMDAwICh0eXBlIHZpYV92aWEpKSkKICAgIChydWxlIChjbGVhcmFuY2UgNi4wMDAwMDAgKHR5cGUgc21kX3BpbikpKQogICAgKHJ1bGUgKGNsZWFyYW5jZSA2LjAwMDAwMCAodHlwZSBzbWRfdmlhKSkpCiAgICAocnVsZSAoY2xlYXJhbmNlIDYuMDAwMDAwICh0eXBlIHNtZF9zbWQpKSkKICAgIChydWxlIChjbGVhcmFuY2UgMTAuMDAwMDAwICh0eXBlIGFyZWFfd2lyZSkpKQogICAgKHJ1bGUgKGNsZWFyYW5jZSAxMC4wMDAwMDAgKHR5cGUgYXJlYV92aWEpKSkKICApCiAgKHBsYWNlbWVudAogICAgKHBsYWNlX2NvbnRyb2wgKGZsaXBfc3R5bGUgcm90YXRlX2ZpcnN0KSkKICAgIChjb21wb25lbnQgIlVTQi1BLVMtTk9TSUxLLUZFTUFMRSRTcGFya0Z1bi1Db25uZWN0b3JzIgogICAgICAocGxhY2UgIkoxIiA0MDAuMDAwMDAwIDUwLjAwMDAwMCBGcm9udCA5MC4wMDAwMDApCiAgICApCiAgICAoY29tcG9uZW50ICJVU0ItTUlOSUIkU3BhcmtGdW4tQ29ubmVjdG9ycyIKICAgICAgKHBsYWNlICJKMiIgMzg1LjAwMDAwMCA4MDUuMDAwMDAwIEZyb250IDE4MC4wMDAwMDApCiAgICApCiAgICAoY29tcG9uZW50ICJVU0ItTUlOSUIkU3BhcmtGdW4tQ29ubmVjdG9ycyIKICAgICAgKHBsYWNlICJKMyIgNDAwLjAwMDAwMCAxNDAwLjAwMDAwMCBGcm9udCAyNzAuMDAwMDAwKQogICAgKQogICkKICAobGlicmFyeQogICAgKGltYWdlICJVU0ItQS1TLU5PU0lMSy1GRU1BTEUkU3BhcmtGdW4tQ29ubmVjdG9ycyIKICAgICAgKHBpbiAiU01EXzEiICJEKyIgMjY1LjgyNjc3MiAtMzkuMzcwMDc5KQogICAgICAocGluICJTTURfMSIgIkQtIiAyNjUuODI2NzcyIDM5LjM3MDA3OSkKICAgICAgKHBpbiAiU01EXzEiICJHTkQiIDI2NS44MjY3NzIgLTEzNy43OTUyNzYpCiAgICAgIChwaW4gIlJvdW5kMSIgIlNITEQxIiAxMDAuMDAwMDAwIC0yNTguNTAwMDAwKQogICAgICAocGluICJSb3VuZDEiICJTSExEMiIgMTAwLjAwMDAwMCAyNTguNTAwMDAwKQogICAgICAocGluICJTTURfMSIgIlZCVVMiIDI2NS44MjY3NzIgMTM3Ljc5NTI3NikKICAgICkKICAgIChpbWFnZSAiVVNCLU1JTklCJFNwYXJrRnVuLUNvbm5lY3RvcnMiCiAgICAgIChrZWVwb3V0IChjaXJjIHNpZ25hbCAxMTUuNDMzMDcxIDAuMDAwMDAwIDg2LjYxNDE3MykpCiAgICAgIChjbGVhcmFuY2VfY2xhc3MgYm91bmRhcnkpCiAgICAgIChrZWVwb3V0IChjaXJjIHNpZ25hbCAxMTUuNDMzMDcxIDAuMDAwMDAwIC04Ni42MTQxNzMpKQogICAgICAoY2xlYXJhbmNlX2NsYXNzIGJvdW5kYXJ5KQogICAgICAocGluICJTTURfMiIgIkQrIiA5OC40MjUxOTcgMC4wMDAwMDApCiAgICAgIChwaW4gIlNNRF8yIiAiRC0iIDk4LjQyNTE5NyAzMS40OTYwNjMpCiAgICAgIChwaW4gIlNNRF8yIiAiR05EIiA5OC40MjUxOTcgLTYyLjk5MjEyNikKICAgICAgKHBpbiAiU01EXzIiICJJRCIgOTguNDI1MTk3IC0zMS40OTYwNjMpCiAgICAgIChwaW4gIlNNRF8zIiAiUzEiIC0xMTguMTEwMjM2IDE3Ny4xNjUzNTQpCiAgICAgIChwaW4gIlNNRF8zIiAiUzIiIDk4LjQyNTE5NyAxNzcuMTY1MzU0KQogICAgICAocGluICJTTURfMyIgIlMzIiAtMTE4LjExMDIzNiAtMTc3LjE2NTM1NCkKICAgICAgKHBpbiAiU01EXzMiICJTNCIgOTguNDI1MTk3IC0xNzcuMTY1MzU0KQogICAgICAocGluICJTTURfMiIgIlZCVVMiIDk4LjQyNTE5NyA2Mi45OTIxMjYpCiAgICApCiAgICAocGFkc3RhY2sgIlZpYURlZmF1bHQkMTMuNzc5NTI4IgogICAgICAoc2hhcGUgKGNpcmNsZSBzaWduYWwgMjkuNzc5NTI4IDAgMCkpCiAgICAgIChhdHRhY2ggb2ZmKQogICAgKQogICAgKHBhZHN0YWNrICJSb3VuZDEkMTMuNzc5NTI4IgogICAgICAoc2hhcGUgKGNpcmNsZSAiMSNUb3AiIDI5Ljc3OTUyOCAwIDApKQogICAgICAoc2hhcGUgKGNpcmNsZSAiMTYjQm90dG9tIiAyOS43Nzk1MjggMCAwKSkKICAgICAgKGF0dGFjaCBvZmYpCiAgICApCiAgICAocGFkc3RhY2sgIlNNRF8xIgogICAgICAoc2hhcGUgKHBvbHlnb24gIjEjVG9wIiAwIDU5LjA1NTExOCAxNy43MTY1MzUgLTU5LjA1NTExOCAxNy43MTY1MzUgLTU5LjA1NTExOCAtMTcuNzE2NTM1IDU5LjA1NTExOCAtMTcuNzE2NTM1KSkKICAgICAgKGF0dGFjaCBvZmYpCiAgICApCiAgICAocGFkc3RhY2sgIlNNRF8yIgogICAgICAoc2hhcGUgKHBvbHlnb24gIjEjVG9wIiAwIDQ5LjIxMjU5OCA5Ljg0MjUyMCAtNDkuMjEyNTk4IDkuODQyNTIwIC00OS4yMTI1OTggLTkuODQyNTIwIDQ5LjIxMjU5OCAtOS44NDI1MjApKQogICAgICAoYXR0YWNoIG9mZikKICAgICkKICAgIChwYWRzdGFjayAiU01EXzMiCiAgICAgIChzaGFwZSAocG9seWdvbiAiMSNUb3AiIDAgNDkuMjEyNTk4IDM5LjM3MDA3OSAtNDkuMjEyNTk4IDM5LjM3MDA3OSAtNDkuMjEyNTk4IC0zOS4zNzAwNzkgNDkuMjEyNTk4IC0zOS4zNzAwNzkpKQogICAgICAoYXR0YWNoIG9mZikKICAgICkKICAgIChwYWRzdGFjayAiUm91bmQxIgogICAgICAoc2hhcGUgKGNpcmNsZSAiMSNUb3AiIDEzMS4wMDAwMDAgMCAwKSkKICAgICAgKHNoYXBlIChjaXJjbGUgIjE2I0JvdHRvbSIgMTMxLjAwMDAwMCAwIDApKQogICAgICAoYXR0YWNoIG9mZikKICAgICkKICApCiAgKG5ldHdvcmsKICAgIChuZXQgIkQrIgogICAgICAocGlucyAiSjMiLSJEKyIgIkoxIi0iRCsiKQogICAgKQogICAgKG5ldCAiRC0iCiAgICAgIChwaW5zICJKMyItIkQtIiAiSjEiLSJELSIpCiAgICApCiAgICAobmV0ICJOJDUiCiAgICAgIChwaW5zICJKMiItIkdORCIgIkozIi0iR05EIiAiSjEiLSJHTkQiKQogICAgKQogICAgKG5ldCAiVkJVUyIKICAgICAgKHBpbnMgIkozIi0iVkJVUyIpCiAgICApCiAgICAobmV0ICJWQ0MiCiAgICAgIChwaW5zICJKMiItIlZCVVMiICJKMSItIlZCVVMiKQogICAgKQogICkKICAod2lyaW5nCiAgKQop"}
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
```