# SAP Job Scheduling Service - Troubleshooting Guide

Complete troubleshooting reference for SAP Job Scheduling Service.

**Source**: https://help.sap.com/docs/job-scheduling/sap-job-scheduling-service/troubleshooting

**Support Component**: BC-CP-CF-JBS

---

## Service Availability Issues

### Service Not in Marketplace

**Symptoms:**
- `cf marketplace` doesn't show jobscheduler
- Service tile missing in BTP Cockpit

**Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| Region not supported | Check SAP BTP regions documentation for availability |
| Missing entitlements | Configure entitlements in Global Account |
| Quota not assigned | Assign quota in Subaccount |

**Verification:**
```bash
cf marketplace | grep jobscheduler
```

### Service Unavailable in Data Center

**Solution:** Create a new subaccount in a supported region and enable the service there.

### Service Running But Not Accessible

**Causes:**
1. Insufficient quota
2. Missing authorization

**Solutions:**
1. Check entitlements: BTP Cockpit > Subaccount > Entitlements
2. Verify Space Developer role assignment

---

## Dashboard Access Issues

### 500 Error When Accessing Dashboard

**Cause:** Missing authorization permissions

**Solution:** Grant permissions via landscape UAA profile URL

### Dashboard Not Loading

**Requirements:**
- Cloud Foundry: `SpaceDeveloper` role
- Kyma: `SAP_Job_Scheduling_Service_Admin` or `SAP_Job_Scheduling_Service_Viewer`

---

## REST API Errors

### HTTP 400 - Bad Request

**Common Causes:**

| Error Message | Cause | Solution |
|---------------|-------|----------|
| "calmConfig must not be empty" | Empty calmConfig object | Use `{ "enabled": true }` or omit |
| "enabled must be a boolean" | Wrong type for enabled | Use boolean, not string |
| "Missing required properties" | Required field missing | Check API documentation |
| "Unsupported properties" | Unknown field in request | Remove unsupported fields |

### HTTP 401 - Unauthorized

**Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| Invalid credentials | Verify clientid/clientsecret |
| Expired token | Request new access token |
| Wrong authentication method | Use OAuth for standard plan |
| Missing scope grant | Update xs-security.json |

**Verification:**
```bash
# Test token retrieval
curl -X POST "<uaa.url>/oauth/token" \
  -H "Authorization: Basic $(echo -n 'clientid:secret' | base64)" \
  -d "grant_type=client_credentials"
```

### HTTP 404 - Not Found

**Causes:**
- Invalid job ID
- Invalid schedule ID
- Invalid run ID

**Solution:** Verify IDs exist using list endpoints

### HTTP 413 - Request Entity Too Large

**Cause:** POST request exceeds 100 KB limit

**Solution:** Reduce payload size or split into multiple requests

### HTTP 429 - Too Many Requests

**Cause:** Per-tenant rate limit exceeded

**Solution:**
1. Check `retry-after` header
2. Wait specified seconds
3. Retry request

### HTTP 503 - Service Unavailable

**Cause:** System-wide rate limit exceeded

**Solution:**
1. Wait at least 1 minute
2. Retry with exponential backoff

---

## Schedule Processing Issues

### Schedule Not Triggering

**Possible Causes:**

| Cause | Verification | Solution |
|-------|--------------|----------|
| endTime in past | Check schedule endTime | Update to future time |
| Schedule inactive | Check active status | Set active: true |
| Invalid cron format | Verify cron syntax | Use SAP cron format |
| Job inactive | Check job active status | Activate job |

### Wrong Execution Time

**Cause:** Time zone confusion

**Solution:** All times are in **UTC**. Convert local time to UTC.

**Example:**
- Local time: 10:00 AM PST (UTC-8)
- UTC time: 18:00 (6:00 PM)

### Schedule Auto-Deactivated

**Triggers for auto-deactivation:**

| Trigger | Description |
|---------|-------------|
| One-time execution | Schedule marked DEACTIVATION_ON_COMPLETION |
| Cron pattern exhausted | No future dates match pattern |
| Job endTime reached | Job has passed its end time |
| Endpoint unreachable | 10+ consecutive days of failures |

---

## Job Execution Issues

### ACK_NOT_RECVD Status

**Cause:** Application hasn't updated run log status for async job

**Solution:**
1. Ensure endpoint returns HTTP 202 Accepted
2. Store job headers (jobId, scheduleId, runId)
3. Call Update Run Log API when complete:

```bash
PUT /scheduler/jobs/{jobId}/schedules/{scheduleId}/runs/{runId}
{
  "success": true,
  "message": "Job completed"
}
```

### REQUEST_ERROR Status

**Cause:** Error invoking action endpoint

**Possible issues:**
- Endpoint URL unreachable
- SSL/TLS certificate problems
- Network connectivity issues
- Application crashed

**Verification:**
```bash
# Test endpoint manually
curl -X POST "https://your-app.com/api/action" \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

### UNKNOWN Status

**Cause:** Async job didn't call Update Run Log API within timeout

**Default timeout:** 30 minutes

**Solution:**
1. Check asynchronous timeout configuration
2. Ensure Update Run Log API is called
3. Increase timeout if needed (max: 7 days)

### SUCCESS But Wrong HTTP Status

**Expected codes for SUCCESS:**
- 200-399 (excluding 202)

**For async jobs:** Return 202 Accepted

---

## Scope and Token Issues

### Missing Scopes in Token

**Cause:** Scopes not correctly granted in xs-security.json

**Solution:**

1. Verify xs-security.json:
```json
{
  "scopes": [{
    "name": "$XSAPPNAME.JOBSCHEDULER",
    "grant-as-authority-to-apps": ["$XSSERVICENAME(my-jobscheduler)"]
  }]
}
```

2. Update XSUAA instance:
```bash
cf update-service <xsuaa-instance> -c xs-security.json
```

3. **Wait up to 12 hours** for token cache to refresh

### HTTP 401 When Calling Application

**Debugging steps:**

1. Manually obtain access token:
```bash
curl -X POST "<uaa.url>/oauth/token" \
  -H "Authorization: Basic $(echo -n 'clientid:secret' | base64)" \
  -d "grant_type=client_credentials"
```

2. Test endpoint with token:
```bash
curl -X POST "https://your-app.com/api/action" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json"
```

3. If manual test succeeds, check application token validation

---

## Cloud Foundry Task Issues

### Unable to Create CF Task

**Common Cause:** Memory constraints

**Default allocation:** 1 GB

**Solution:**

1. Check available memory:
```bash
cf org <org-name>
cf space <space-name>
```

2. Configure task memory:
```json
{
  "memory_in_mb": 256
}
```

### Retrieving Task Logs

```bash
cf logs <application_name> --recent
```

**Requirement:** Space Developer role

---

## Service Behavior Issues

### Missed Schedules During Outage

**Behavior:**

| Outage Duration | Behavior |
|-----------------|----------|
| < 20 minutes | All missed executions run |
| > 20 minutes | Only last missed execution runs |

### One-Time Schedule Didn't Run

**Possible causes:**

| Cause | Solution |
|-------|----------|
| Time in past, no endTime | Schedule won't run |
| Both time and endTime in past | Schedule won't run |
| Schedule deactivated before execution | Reactivate if needed |

### Run Logs Missing

**Cause:** Logs auto-delete after 15 days

**Solution:** Archive logs using:
- REST API: `GET /scheduler/jobs/{jobId}/schedules/{scheduleId}/runs`
- Dashboard: Download option

---

## Quick Diagnostic Checklist

- [ ] Service instance created and bound?
- [ ] XSUAA scope granted to Job Scheduling?
- [ ] Application restaged after binding?
- [ ] Action endpoint accessible (test with curl)?
- [ ] Time zone: Using UTC?
- [ ] Schedule active?
- [ ] Job active?
- [ ] endTime in future?
- [ ] Correct HTTP method configured?
- [ ] For async: Returning 202 and calling Update Run Log?

---

## Common FAQ

**Q: What cron format is supported?**
A: SAP cron format only (7 fields), not standard Linux cron.

**Q: What is the SLA for scheduled jobs?**
A: About 20 minutes from scheduled time.

**Q: Can I create CF tasks via REST API?**
A: No, only through the dashboard.

**Q: How do I create an immediate execution?**
A: Use `"time": "now"` in schedule configuration.

---

**Documentation Source**: https://github.com/SAP-docs/btp-job-scheduling-service/blob/main/docs/troubleshooting-scenarios-b05dc8c.md
