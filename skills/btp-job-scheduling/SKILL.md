---
name: btp-job-scheduling
description: |
  Develops and integrates SAP BTP Job Scheduling Service for scheduled task execution. Use when creating jobs with cron or time-based schedules, implementing asynchronous job patterns, configuring REST API endpoints for job actions, setting up multitenancy job scheduling, integrating with SAP Alert Notification or Cloud ALM, troubleshooting job execution issues, or working with Cloud Foundry tasks. Covers schedule formats (cron, repeatInterval, repeatAt), OAuth 2.0 authentication, Node.js client library, and dashboard management.
license: MIT
---

# SAP BTP Job Scheduling Service

This skill provides comprehensive guidance for implementing SAP Job Scheduling Service on SAP Business Technology Platform.

## When to Use This Skill

Use this skill when:
- Creating scheduled jobs with one-time or recurring execution
- Implementing cron-based or interval-based schedules
- Setting up action endpoints for job execution
- Configuring asynchronous (long-running) job patterns
- Working with Cloud Foundry tasks
- Setting up multitenancy job scheduling (PaaS/SaaS)
- Integrating with SAP Alert Notification or Cloud ALM
- Troubleshooting job execution issues
- Using the Node.js client library (@sap/jobs-client)

## Quick Reference

### Service Plans
- **standard**: Full features, OAuth 2.0 authentication, X.509 certificates
- **lite**: HTTP Basic Authentication only

### Key Constraints
| Constraint | Value |
|------------|-------|
| Minimum schedule interval | 5 minutes |
| Synchronous job timeout | 15 seconds |
| Asynchronous job timeout | 30 minutes (configurable to 7 days) |
| POST request size limit | 100 KB |
| Run log retention | 15 days |
| Token cache duration | 12 hours |
| SLA for scheduled jobs | ~20 minutes from scheduled time |

### Supported Time Zone
**UTC only** - No other time zones are supported.

## Core Concepts

### Job
A collection of schedules with an action endpoint. Jobs are configured with a URL that the service invokes on the defined schedule.

### Schedule Types
1. **One-time**: Execute once at a specific time
2. **Recurring**: Execute repeatedly using cron, repeatInterval, or repeatAt

### Execution Modes
1. **Synchronous**: Action completes within 15 seconds, returns HTTP 200-399
2. **Asynchronous**: For long-running operations, returns HTTP 202 Accepted, then calls Update Job Run Log API

### Schedule Lifecycle States
```
SCHEDULED → RUNNING → COMPLETED
           ↓
         TRIGGERED → ACK_RECVD → SUCCESS/ERROR/UNKNOWN
                   → ACK_NOT_RECVD → REQUEST_ERROR
```

## Schedule Formats

### Cron Format (7 fields)
```
Year Month Day DayOfWeek Hour Minute Second
```

**Examples:**
```
* * * fri 12 0 0          # Every Friday at 12:00
* * * * * */30 0          # Every 30 minutes
* * -1 * 9 0 0            # Last day of every month at 09:00
* * * -1.sun 9 0 0        # Last Sunday of every month at 09:00
```

### RepeatInterval Format
```json
{ "repeatInterval": "5 minutes" }
{ "repeatInterval": "2 hours" }
{ "repeatInterval": "1 day" }
```

### RepeatAt Format (daily at specific time)
```json
{ "repeatAt": "4.40pm" }
{ "repeatAt": "18.40" }
{ "repeatAt": "6.20am" }
```

### Human-Readable Time
```json
{ "time": "now" }
{ "time": "10 hours from now" }
{ "time": "tomorrow at 4pm" }
{ "time": "next week monday at 5am" }
```

For complete schedule format details, see `references/schedule-formats.md`.

## REST API Quick Reference

**Base URL**: `<credentials.url>/scheduler/`

### Job Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /jobs | Create job with schedules |
| GET | /jobs | List all jobs |
| GET | /jobs/{jobId} | Get job details |
| PUT | /jobs/{jobId} | Update job |
| DELETE | /jobs/{jobId} | Delete job |

### Schedule Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /jobs/{jobId}/schedules | Create schedule |
| GET | /jobs/{jobId}/schedules | List schedules |
| PUT | /jobs/{jobId}/schedules/{scheduleId} | Update schedule |
| DELETE | /jobs/{jobId}/schedules/{scheduleId} | Delete schedule |
| POST | /jobs/{jobId}/schedules/activationStatus | Bulk activate/deactivate |

### Run Logs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /jobs/{jobId}/schedules/{scheduleId}/runs | Get run logs |
| PUT | /jobs/{jobId}/schedules/{scheduleId}/runs/{runId} | Update run status |

For complete API documentation, see `references/rest-api.md`.

## Initial Setup

### Prerequisites
1. SAP BTP global account and subaccount
2. Cloud Foundry space OR Kyma cluster
3. XSUAA service instance
4. Deployed application with action endpoint

### Quick Setup (CF CLI)
```bash
# Create service instance
cf create-service jobscheduler standard <instance-name>

# Bind to application
cf bind-service <app-name> <instance-name>

# Restage application
cf restage <app-name>
```

### With X.509 Certificates
```bash
# Create parameters.json
{
  "credential-type": "x509",
  "key-length": 2048,
  "validity": 7,
  "validity-type": "DAYS"
}

# Bind with certificates
cf bind-service <app-name> <instance-name> -c parameters.json
```

For complete setup instructions, see `references/setup-guide.md`.

## Authentication

### Standard Plan (OAuth 2.0)

**Get Access Token:**
```bash
curl -X POST "<uaa.url>/oauth/token" \
  -H "Authorization: Basic $(echo -n 'clientid:clientsecret' | base64)" \
  -d "grant_type=client_credentials"
```

**Use Token in API Requests:**
```bash
curl -X GET "<credentials.url>/scheduler/jobs" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json"
```

### Scope Configuration (xs-security.json)
```json
{
  "scopes": [{
    "name": "$XSAPPNAME.JOBSCHEDULER",
    "description": "Job Scheduler Scope",
    "grant-as-authority-to-apps": ["$XSSERVICENAME(<jobscheduler-instance>)"]
  }]
}
```

For complete security configuration, see `references/security.md`.

## Create Job Template

```json
{
  "name": "myScheduledJob",
  "description": "Job that runs every hour",
  "action": "https://<app-url>/api/execute",
  "active": true,
  "httpMethod": "POST",
  "schedules": [
    {
      "repeatInterval": "1 hour",
      "description": "Hourly execution",
      "active": true,
      "data": {
        "param1": "value1"
      }
    }
  ]
}
```

For more templates, see `templates/` directory.

## Asynchronous Job Pattern

For jobs exceeding 15 seconds:

1. **Scheduler invokes endpoint with headers:**
   - `x-sap-job-id`
   - `x-sap-job-schedule-id`
   - `x-sap-job-run-id`
   - `x-sap-scheduler-host`

2. **Application responds:**
   ```json
   HTTP 202 Accepted
   ```

3. **After processing, application updates status:**
   ```bash
   PUT /scheduler/jobs/{jobId}/schedules/{scheduleId}/runs/{runId}
   {
     "success": true,
     "message": "Processing completed successfully"
   }
   ```

## Node.js Client Library

### Installation
```bash
npm install @sap/jobs-client
```

### Basic Usage
```javascript
const JobSchedulerClient = require('@sap/jobs-client');
const scheduler = new JobSchedulerClient.Scheduler();

// Create job
scheduler.createJob({ /* job config */ }, (err, result) => {
  if (err) return console.error(err);
  console.log('Job created:', result);
});

// Fetch all jobs
scheduler.fetchAllJobs((err, jobs) => {
  if (err) return console.error(err);
  console.log('Jobs:', jobs);
});
```

For complete Node.js examples, see `references/nodejs-client.md`.

## Best Practices

### Schedule Timing
- **Avoid**: 0th or 30th second, 0th or 30th minute, multiples of 5 minutes
- **Prefer**: Irregular times like 01:12:17 or 01:38:37
- **Note**: Midnight UTC is especially congested

### One-Time Schedules
- Use for testing and validation
- Use cron or repeatInterval for production recurring tasks

### Asynchronous Jobs
- Send 202 Accepted immediately
- Use Update Run Logs API to report final status
- Store job headers (jobId, scheduleId, runId) for callback

### Rate Limits
- Requests may be throttled with 'throttling' header
- 503 Service Unavailable: System-wide limit exceeded
- 429 Too Many Requests: Per-tenant limit exceeded
- Wait for 'retry-after' seconds before retrying

## Integrations

### SAP Alert Notification
- Event types: `JobSchedulerJobExecution`, `JobSchedulerTaskExecution`
- Configure `ansConfig` in job creation: `{ "onError": true, "onSuccess": true }`
- Cloud Foundry only

### SAP Cloud ALM
- Configure `calmConfig` in job creation: `{ "enabled": true }`
- Provides monitoring visibility for job activities

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| HTTP 401 | Invalid credentials | Verify API credentials |
| HTTP 503 | Rate limit exceeded | Wait and retry |
| HTTP 429 | Per-tenant limit | Check 'retry-after' header |
| ACK_NOT_RECVD | No status update | Call Update Run Log API |
| Schedule not triggering | Past endTime | Verify endTime is future |
| Wrong execution time | Time zone issue | Use UTC time |

### Support Component
**BC-CP-CF-JBS**

For complete troubleshooting guide, see `references/troubleshooting.md`.

## Reference Files

- `references/schedule-formats.md` - Complete schedule format documentation
- `references/rest-api.md` - Full REST API reference
- `references/security.md` - Authentication and authorization
- `references/setup-guide.md` - Detailed setup instructions
- `references/multitenancy.md` - Multi-tenant configuration
- `references/nodejs-client.md` - Node.js client library guide
- `references/troubleshooting.md` - Error resolution guide

## Documentation Links

- **SAP Help Portal**: https://help.sap.com/docs/job-scheduling
- **GitHub Docs**: https://github.com/SAP-docs/btp-job-scheduling-service
- **REST API Reference**: https://help.sap.com/docs/job-scheduling/sap-job-scheduling-service/sap-job-scheduling-service-rest-apis
- **Node.js Package**: https://www.npmjs.com/package/@sap/jobs-client

---

**Last Updated**: 2025-11-22
**Documentation Version**: Based on SAP documentation as of October 2025
