# SAP Job Scheduling Service - REST API Reference

Complete REST API reference for SAP Job Scheduling Service.

**Source**: https://help.sap.com/docs/job-scheduling/sap-job-scheduling-service/sap-job-scheduling-service-rest-apis

---

## API Overview

**Base URL**: `<credentials.url>/scheduler/`

All APIs:
- Support pagination
- Operate in **UTC time zone only**
- Have **100 KB POST request limit**
- Use `Content-Type: application/json`

---

## Job Management APIs

### Create Job

**POST** `/scheduler/jobs`

Creates a job with one or more schedules.

**Note**: CF tasks cannot be created via REST API.

#### Request Body

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| name | Yes | string | Job identifier (no special chars, not only numeric) |
| description | Yes | string | Job details |
| action | Yes | string | Fully qualified URL (use HTTPS for production) |
| active | Yes | boolean | Activation status (default: false) |
| httpMethod | Yes | string | GET, POST, PUT, or DELETE |
| startTime | No | string/object/null | Job start time |
| endTime | No | string/object/null | Job termination time |
| ansConfig | No | object | Alert notification: `{ "onSuccess": bool, "onError": bool }` |
| calmConfig | No | object | Cloud ALM: `{ "enabled": bool }` |
| schedules | Yes | array | Array of schedule configurations |

#### Schedule Object

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| active | Yes | boolean | Schedule activation status |
| description | No | string | Schedule details |
| startTime | No | string/object | Schedule start time |
| endTime | No | string/object | Schedule end time |
| data | No | object | Parameters passed to endpoint |
| cron | - | string | Crontab pattern (use one timing option) |
| time | - | string/object | One-time execution time |
| repeatInterval | - | string | Recurring interval |
| repeatAt | - | string | Daily recurring time |

#### Example Request

```json
POST /scheduler/jobs

{
  "name": "validateSalesOrder",
  "description": "Validates sales order requests",
  "action": "https://app.example.com/api/validate",
  "active": true,
  "httpMethod": "PUT",
  "ansConfig": {
    "onError": true,
    "onSuccess": false
  },
  "calmConfig": {
    "enabled": true
  },
  "schedules": [
    {
      "cron": "* * * * * */10 0",
      "description": "Runs every 10 minutes",
      "data": {
        "salesOrderId": "1234"
      },
      "active": true,
      "startTime": {
        "date": "2025-10-20 04:30 +0000",
        "format": "YYYY-MM-DD HH:mm Z"
      }
    }
  ]
}
```

#### Response (201 Created)

```json
{
  "name": "validateSalesOrder",
  "action": "https://app.example.com/api/validate",
  "active": true,
  "httpMethod": "PUT",
  "description": "Validates sales order requests",
  "startTime": null,
  "endTime": null,
  "signatureVersion": 0,
  "schedules": [
    {
      "active": true,
      "startTime": "2025-10-20 04:30:00",
      "endTime": null,
      "description": "Runs every 10 minutes",
      "data": "{\"salesOrderId\":\"1234\"}",
      "cron": "* * * * * * */10",
      "type": "recurring",
      "scheduleId": "abc123-def456"
    }
  ],
  "_id": 3
}
```

---

### Retrieve All Jobs

**GET** `/scheduler/jobs`

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| name | string | Filter by job name |
| jobId | number | Filter by job ID |
| jobType | string | HTTP_ENDPOINT or CF_TASK |
| page_size | number | Results per page (default: 10) |
| offset | number | Records to skip (default: 1) |
| tenantId | string | Filter by tenant (PaaS token only) |
| filter | string | OData-style filter expression |

#### OData Filter Examples

```
GET /scheduler/jobs?filter=contains(name, 'my_job')
GET /scheduler/jobs?filter=name eq 'my_job'
GET /scheduler/jobs?filter=contains(name, 'test') and subDomain eq 'domain'
```

**Filterable properties**: name, subDomain, tenantId

#### Response (200 OK)

```json
{
  "total": 15,
  "results": [
    {
      "jobId": 3,
      "name": "validateSalesOrder",
      "description": "...",
      "action": "https://...",
      "active": true,
      "httpMethod": "PUT",
      "jobType": "HTTP_ENDPOINT",
      "createdAt": "2025-01-15T10:30:00Z",
      "modifiedAt": "2025-01-15T10:30:00Z"
    }
  ],
  "prev_url": null,
  "next_url": "/scheduler/jobs?offset=11&page_size=10"
}
```

---

### Retrieve Job Details

**GET** `/scheduler/jobs/{jobId}`

Returns complete job details including all schedules.

---

### Update Job (by ID)

**PUT** `/scheduler/jobs/{jobId}`

#### Request Body

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| description | Yes | string | Job description |
| active | Yes | boolean | Activation status |
| action | Yes | string | Job action URL |
| httpMethod | Yes | string | GET, POST, PUT, DELETE |
| startTime | No | string/object/null | Job start time |
| endTime | Yes | string/object/null | Job end time |
| ansConfig | No | object | Alert notification settings |
| calmConfig | No | object | Cloud ALM settings |

#### Example

```json
PUT /scheduler/jobs/3

{
  "active": true,
  "httpMethod": "GET",
  "description": "Updated description"
}
```

---

### Update Job (by Name)

**PUT** `/scheduler/jobs?name={jobName}`

Same as update by ID, but identifies job by name.

---

### Delete Job

**DELETE** `/scheduler/jobs/{jobId}`

Removes job and all associated schedules and logs.

#### Response (200 OK)

```json
{
  "success": true
}
```

---

## Schedule Management APIs

### Create Job Schedule

**POST** `/scheduler/jobs/{jobId}/schedules`

#### Request Body

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| active | Yes | boolean | Schedule status |
| description | No | string | Schedule details |
| startTime | No | string/object | Start time |
| endTime | No | string/object | End time |
| data | No | object | Payload for endpoint |
| cron | - | string | Crontab pattern |
| time | - | string | One-time execution |
| repeatInterval | - | string | Recurring interval |
| repeatAt | - | string | Daily time |

#### Examples

**Immediate execution:**
```json
POST /scheduler/jobs/3/schedules

{
  "active": true,
  "description": "Execute now",
  "time": "now"
}
```

**Recurring with start time:**
```json
POST /scheduler/jobs/3/schedules

{
  "repeatInterval": "2 hours",
  "active": true,
  "description": "Every 2 hours",
  "startTime": {
    "date": "2025-08-21",
    "format": "YYYY-MM-DD"
  }
}
```

---

### Retrieve Job Schedules

**GET** `/scheduler/jobs/{jobId}/schedules`

Returns all schedules for a job.

---

### Retrieve Schedule Details

**GET** `/scheduler/jobs/{jobId}/schedules/{scheduleId}`

---

### Update Schedule

**PUT** `/scheduler/jobs/{jobId}/schedules/{scheduleId}`

**Note**: Cannot switch scheduling modes (e.g., cron to repeatInterval).

#### Example

```json
PUT /scheduler/jobs/3/schedules/abc123

{
  "description": "Updated to run every 2 hours",
  "active": true,
  "repeatInterval": "2 hours",
  "startTime": {
    "date": "2025-12-08 09:30:26.123"
  }
}
```

---

### Delete Schedule

**DELETE** `/scheduler/jobs/{jobId}/schedules/{scheduleId}`

---

### Delete All Schedules

**DELETE** `/scheduler/jobs/{jobId}/schedules`

---

### Bulk Activate/Deactivate

**POST** `/scheduler/jobs/{jobId}/schedules/activationStatus`

```json
{
  "activationStatus": false
}
```

---

## Run Log APIs

### Retrieve Run Logs

**GET** `/scheduler/jobs/{jobId}/schedules/{scheduleId}/runs`

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| page_size | integer | Logs per page (default: 10 with offset, 200 without) |
| offset | integer | Logs to skip (default: 1) |

#### Response

```json
{
  "total": 50,
  "results": [
    {
      "runId": "ea16b621-eaa8-4824-8629-ff6e6221bb56",
      "runText": "Success message",
      "httpStatus": 200,
      "executionTimestamp": "2025-01-15T10:00:00Z",
      "scheduleTimestamp": "2025-01-15T09:59:55Z",
      "completionTimestamp": "2025-01-15T10:00:05Z",
      "runStatus": "COMPLETED",
      "runState": "SUCCESS"
    }
  ]
}
```

---

### Retrieve Run Log Details

**GET** `/scheduler/jobs/{jobId}/schedules/{scheduleId}/runs/{runId}`

---

### Update Run Log (Asynchronous Jobs)

**PUT** `/scheduler/jobs/{jobId}/schedules/{scheduleId}/runs/{runId}`

**Required for asynchronous jobs** to report completion status.

```json
{
  "success": true,
  "message": "Long running operation completed successfully"
}
```

---

## Error Responses

### HTTP 400 - Bad Request

Common causes:
- Empty calmConfig object
- Non-boolean enabled value
- Missing required properties
- Unsupported properties

### HTTP 401 - Unauthorized

Invalid or missing authentication credentials.

### HTTP 404 - Not Found

Invalid job ID or schedule ID.

### HTTP 413 - Request Entity Too Large

POST request exceeds 100 KB limit.

### HTTP 429 - Too Many Requests

Per-tenant rate limit exceeded. Check `retry-after` header.

### HTTP 503 - Service Unavailable

System-wide rate limit exceeded. Wait and retry.

---

## Rate Limiting

### Two-Tier System

1. **Absolute Limit** (system-wide)
   - Near limit: Throttling with 'throttling' header
   - Exceeded: 503 Service Unavailable

2. **Client Limit** (per-tenant)
   - Near limit: Throttling with 'throttling' header
   - Exceeded: 429 Too Many Requests with 'retry-after'

### Headers

- `throttling`: Milliseconds of server-side delay
- `retry-after`: Seconds to wait before retrying

---

**Documentation Source**: https://github.com/SAP-docs/btp-job-scheduling-service/tree/main/docs/40---Using-JOB-SCHDULR-TITLE
