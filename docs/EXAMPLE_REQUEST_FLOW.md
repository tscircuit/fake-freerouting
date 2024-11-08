# Example Request Flow

This document shows a typical sequence of API requests when using the router service.

## 1. Create Session

First, create a new session:

```http
POST /v1/sessions/create

Response:
{
  "id": "1610a2a1-65dd-4a25-ab1d-a0ddfa8610aa",
  "user_id": "d3586263-7ba3-43b3-b3af-bc2ebfd9d9a9",
  "host": "tscircuit/0.0.1"
}
```

## 2. Create Job

Create a new routing job within the session:

```http
POST /v1/jobs/enqueue
{
  "session_id": "1610a2a1-65dd-4a25-ab1d-a0ddfa8610aa",
  "name": "test-job",
  "priority": "NORMAL"
}

Response:
{
  "id": "06630d56-49af-43e4-b3c6-857e91594671",
  "created_at": "2024-10-29T22:41:22.995128598Z",
  "session_id": "1610a2a1-65dd-4a25-ab1d-a0ddfa8610aa",
  "name": "test-job",
  "state": "QUEUED",
  ...
}
```

## 3. Configure Job Settings

Optionally customize the router settings:

```http
POST /v1/jobs/06630d56-49af-43e4-b3c6-857e91594671/settings
{
  "max_passes": 5,
  "via_costs": 42
}
```

## 4. Upload Design File

Upload the board design file:

```http
POST /v1/jobs/06630d56-49af-43e4-b3c6-857e91594671/input
{
  "filename": "test.dsn",
  "data": "base64_encoded_dsn_file..."
}
```

## 5. Start Routing

Start the routing process:

```http
PUT /v1/jobs/06630d56-49af-43e4-b3c6-857e91594671/start

Response:
{
  "id": "06630d56-49af-43e4-b3c6-857e91594671",
  "state": "RUNNING",
  "stage": "ROUTING",
  ...
}
```

## 6. Monitor Progress

Poll the job status:

```http
GET /v1/jobs/06630d56-49af-43e4-b3c6-857e91594671

Response:
{
  "id": "06630d56-49af-43e4-b3c6-857e91594671",
  "state": "RUNNING",
  "stage": "ROUTING",
  ...
}
```

## 7. Get Results

Once complete, retrieve the routed board file:

```http
GET /v1/jobs/06630d56-49af-43e4-b3c6-857e91594671/output

Response:
{
  "job_id": "06630d56-49af-43e4-b3c6-857e91594671",
  "data": "base64_encoded_session_file...",
  "format": "SES",
  ...
}
```

## System Status

At any point, you can check system status:

```http
GET /v1/system/status

Response:
{
  "status": "OK",
  "cpu_load": 96.75,
  "ram_used": 48,
  "ram_available": 30,
  ...
}
```
