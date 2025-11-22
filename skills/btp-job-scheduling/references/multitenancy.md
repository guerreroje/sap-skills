# SAP Job Scheduling Service - Multitenancy Guide

Complete multitenancy configuration for SAP Job Scheduling Service.

**Source**: https://help.sap.com/docs/job-scheduling/sap-job-scheduling-service/multitenancy

---

## Overview

SAP Job Scheduling Service supports job execution in the context of:
- **PaaS tenants** (Provider subaccount)
- **SaaS tenants** (Subscriber subaccounts)

Multitenant applications can manage jobs across all subscribed tenants.

---

## Prerequisites

1. Deploy a multitenant application to a provider subaccount
2. Bind application to SAP SaaS Provisioning service instance
3. Bind application to SAP Job Scheduling service instance
4. Configure Job Scheduling service as a dependency in SaaS Provisioning

---

## Tenant Types

### PaaS Tenant (Provider)

- The provider subaccount where the application is deployed
- Has **unrestricted access** to all jobs and schedules within the bound service instance
- Can create, view, edit, and delete jobs for any tenant

### SaaS Tenant (Subscriber)

- Subscriber subaccounts that subscribe to the multitenant application
- Can only access jobs created for their own tenant
- Cannot see or modify jobs from other tenants

---

## Dashboard Behavior

The administration dashboard shows:
- Jobs of all subscribed SaaS tenants
- Jobs created with the PaaS tenant credentials

**Note**: Developers can implement tenant-specific dashboards using the REST API.

---

## Subscription Behavior

### Single Service Instance, One Application

When a SaaS tenant unsubscribes:
- All jobs and schedules for that tenant are **automatically deleted**

### Single Service Instance, Multiple Applications

When applications share a service instance:
- Data is shared among applications the tenant subscribed to
- Data persists until **all subscriptions** are removed
- Unsubscribing from one application does not delete jobs

---

## Access Rules

| Credentials | Access Level |
|-------------|--------------|
| SaaS tenant token | Own tenant's jobs only |
| PaaS tenant (provider) | All jobs across all tenants |

---

## Creating Jobs for SaaS Tenants

### Step 1: Get Provider Access Token

```bash
curl -X POST "<uaa.url>/oauth/token" \
  -H "Authorization: Basic $(echo -n '<clientid>:<clientsecret>' | base64)" \
  -d "grant_type=client_credentials"
```

### Step 2: Exchange for Tenant Token

Use XSUAA token exchange to get a tenant-specific token:

```javascript
const xssec = require('@sap/xssec');

// Exchange user token for service token
async function getTenantToken(userToken, tenantId) {
  return new Promise((resolve, reject) => {
    xssec.requests.requestClientCredentialsToken(
      null,
      xsuaaCredentials,
      { tenantId: tenantId },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      }
    );
  });
}
```

### Step 3: Create Job with Tenant Token

```bash
curl -X POST "<url>/scheduler/jobs" \
  -H "Authorization: Bearer <tenant_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "tenant-job",
    "description": "Job for specific tenant",
    "action": "https://app.example.com/api/action",
    "httpMethod": "POST",
    "active": true,
    "schedules": [...]
  }'
```

---

## Retrieving Jobs by Tenant

### With PaaS Token (Provider Access)

Filter by tenant:
```bash
GET /scheduler/jobs?tenantId=<tenant-guid>
```

### With SaaS Token

Automatically filtered to the token's tenant:
```bash
GET /scheduler/jobs
```

---

## Tenant Information in Job Execution

When the scheduler invokes an action endpoint, tenant information is included in the access token passed in the Authorization header.

### Extracting Tenant from Token

```javascript
const xssec = require('@sap/xssec');

app.post('/api/job-action', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  xssec.createSecurityContext(token, xsuaaCredentials, (err, ctx) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const tenantId = ctx.getSubdomain();
    const zoneId = ctx.getZoneId();

    console.log(`Job executed for tenant: ${tenantId}`);

    // Process job for specific tenant
    performTenantAction(tenantId, req.body);

    res.status(200).json({ success: true });
  });
});
```

---

## Dashboard Limitations

- **Cannot create SaaS tenant jobs from dashboard**: Dashboard job creation is PaaS-specific only
- **SaaS tenant jobs require API**: Use token exchange with XSUAA to create tenant jobs

---

## REST API for Multitenancy

### List Jobs for All Tenants (PaaS Token Only)

```bash
GET /scheduler/jobs?filter=tenantId eq '<tenant-guid>'
```

### Bulk Operations

When using PaaS credentials, you can:
- View all jobs across all tenants
- Delete jobs for any tenant
- Update schedules for any tenant

---

## Token Exchange Flow

```
┌─────────────────┐         ┌─────────────────┐
│   User Token    │────────►│     XSUAA       │
│  (SaaS Tenant)  │         │                 │
└─────────────────┘         └────────┬────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │  Service Token  │
                            │  (For Tenant)   │
                            └────────┬────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │  Job Scheduler  │
                            │      API        │
                            └─────────────────┘
```

---

## Multitenancy FAQ

**Q: Can I create tenant-specific jobs from the dashboard?**
A: No, dashboard job creation is PaaS-specific only. Use REST API with token exchange.

**Q: Can I filter jobs by tenant?**
A: Yes, use the `tenantId` query parameter with PaaS (provider) token.

**Q: Where is tenant information provided?**
A: In the access token sent in request headers when invoking action endpoints.

**Q: What happens when a tenant unsubscribes?**
A: All jobs and schedules for that tenant are deleted (single app) or remain until all subscriptions are removed (multiple apps).

---

## Best Practices

1. **Use tenant-aware action endpoints**: Always validate tenant context in your endpoints
2. **Implement tenant isolation**: Ensure jobs cannot access data from other tenants
3. **Log tenant context**: Include tenant ID in all job execution logs
4. **Handle unsubscription**: Plan for job cleanup when tenants unsubscribe
5. **Use PaaS credentials sparingly**: Prefer tenant-specific tokens for operations

---

**Documentation Source**: https://github.com/SAP-docs/btp-job-scheduling-service/blob/main/docs/20---Concepts/multitenancy-in-sap-job-scheduling-service-464b613.md
