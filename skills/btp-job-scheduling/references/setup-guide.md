# SAP Job Scheduling Service - Setup Guide

Complete setup instructions for SAP Job Scheduling Service.

**Source**: https://help.sap.com/docs/job-scheduling/sap-job-scheduling-service/initial-setup

---

## Prerequisites

Before enabling SAP Job Scheduling Service:

- [ ] SAP BTP global account and subaccount established
- [ ] Global account administrator status
- [ ] Quota allocated for Job Scheduling Service (standard plan)
- [ ] Quota allocated for XSUAA (SAP Authorization and Trust Management service)
- [ ] Cloud Foundry space created OR Kyma cluster enabled
- [ ] Space Developer role (CF) or appropriate Kyma roles assigned
- [ ] Application deployed on SAP BTP
- [ ] Action endpoint configured in your application
- [ ] Application and service instance in the same CF space

---

## Setup Overview

Follow these steps **in order**:

1. Create Job Scheduling service instance
2. Create XSUAA service instance
3. Bind XSUAA to your application
4. Bind Job Scheduling service to your application

---

## Method 1: Cloud Foundry CLI

### Step 1: Check Service Availability

```bash
cf marketplace | grep jobscheduler
```

Expected output:
```
jobscheduler   standard   Job Scheduling Service
```

### Step 2: Create Service Instance

```bash
cf create-service jobscheduler standard <instance-name>
```

Example:
```bash
cf create-service jobscheduler standard my-jobscheduler
```

### Step 3: Bind to Application

**Standard binding:**
```bash
cf bind-service <app-name> <instance-name>
```

**With X.509 certificates:**

Create `parameters.json`:
```json
{
  "credential-type": "x509",
  "key-length": 2048,
  "validity": 7,
  "validity-type": "DAYS"
}
```

Bind with certificates:
```bash
cf bind-service <app-name> <instance-name> -c parameters.json
```

### Step 4: Restage Application

```bash
cf restage <app-name>
```

### Step 5: Verify Binding

```bash
cf env <app-name>
```

Look for `VCAP_SERVICES.jobscheduler` containing:
- `url`: REST API endpoint
- `uaa.url`: XSUAA endpoint
- `uaa.clientid`: Client ID
- `uaa.clientsecret`: Client secret (or certificate details)

---

## Method 2: SAP BTP Cockpit

### Step 1: Access Service Marketplace

1. Log into SAP BTP Cockpit
2. Navigate to your subaccount
3. Go to **Services** > **Service Marketplace**
4. Find "Job Scheduling Service"

### Step 2: Create Instance

1. Click on Job Scheduling Service tile
2. Select **Create** from Actions menu
3. Choose plan: **standard**
4. Enter instance name
5. Skip Parameters section (no customization available)
6. Review and select **Create**

### Step 3: Bind to Application

1. Go to **Services** > **Instances and Subscriptions**
2. Find your Job Scheduling instance
3. Select **Bind** from Actions menu
4. Choose your deployed application
5. Complete binding process

---

## Method 3: Kyma Dashboard

### Step 1: Access Kyma Console

1. Log into SAP BTP Cockpit
2. Navigate to your subaccount
3. Go to **Overview** > **Kyma Environment**
4. Click **Link to dashboard**

### Step 2: Create Service Instance

1. Go to **Service Management** > **Instances**
2. Click **Create Service Instance**
3. Select:
   - Service: jobscheduler
   - Plan: standard
4. Enter instance name
5. Create instance

### Step 3: Create Binding

1. Find your instance in the list
2. Click **Create Binding**
3. Enter binding name
4. Complete binding

---

## XSUAA Configuration

### Create xs-security.json

```json
{
  "xsappname": "my-application",
  "tenant-mode": "dedicated",
  "scopes": [
    {
      "name": "$XSAPPNAME.JOBSCHEDULER",
      "description": "Job Scheduler Scope",
      "grant-as-authority-to-apps": [
        "$XSSERVICENAME(my-jobscheduler)"
      ]
    }
  ]
}
```

### Create/Update XSUAA Instance

**Create new:**
```bash
cf create-service xsuaa application <xsuaa-instance> -c xs-security.json
```

**Update existing:**
```bash
cf update-service <xsuaa-instance> -c xs-security.json
```

### Bind XSUAA to Application

```bash
cf bind-service <app-name> <xsuaa-instance>
cf restage <app-name>
```

---

## Application Configuration

### Environment Variables

After binding, your application receives credentials in `VCAP_SERVICES`:

```javascript
// Node.js example
const xsenv = require('@sap/xsenv');
const credentials = xsenv.getServices({ jobscheduler: { tag: 'jobscheduler' } });

console.log('Job Scheduler URL:', credentials.jobscheduler.url);
console.log('UAA URL:', credentials.jobscheduler.uaa.url);
```

### manifest.yml Configuration

```yaml
applications:
  - name: my-app
    services:
      - my-jobscheduler
      - my-xsuaa
```

---

## Action Endpoint Setup

Your application must expose an HTTP endpoint for the scheduler to invoke:

```javascript
// Node.js/Express example
app.post('/api/job-action', async (req, res) => {
  // Extract job headers
  const jobId = req.headers['x-sap-job-id'];
  const scheduleId = req.headers['x-sap-job-schedule-id'];
  const runId = req.headers['x-sap-job-run-id'];

  // For synchronous jobs (< 15 seconds)
  try {
    await performAction(req.body);
    res.status(200).json({ message: 'Success' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

  // For asynchronous jobs (> 15 seconds)
  // Return 202 immediately, then update run log when complete
});
```

---

## Dashboard Access

### Via BTP Cockpit

1. Go to **Services** > **Instances and Subscriptions**
2. Find your Job Scheduling instance
3. Click **View Dashboard** icon

### Via CLI

```bash
cf service <instance-name>
```

Look for `dashboard` URL in the output.

---

## Required Roles

### Cloud Foundry
- **Space Manager** or **Space Developer** for instance creation/binding
- **Space Developer** for dashboard access

### Kyma
- `SAP_Job_Scheduling_Service_Admin` for full access
- `SAP_Job_Scheduling_Service_Viewer` for read-only access

---

## Verification Checklist

After setup, verify:

- [ ] Service instance created successfully
- [ ] Application bound to service instance
- [ ] XSUAA scope granted to Job Scheduling Service
- [ ] Credentials available in VCAP_SERVICES
- [ ] Dashboard accessible
- [ ] Action endpoint responding to test requests
- [ ] Test job executes successfully

---

## Troubleshooting Setup

### Service Not in Marketplace

Check:
- Region availability
- Entitlements and quotas
- Global account settings

### Binding Fails

Check:
- Space Developer role
- Available quota
- Application deployment status

### Dashboard 500 Error

Check:
- Authorization permissions
- UAA profile configuration

---

**Documentation Sources**:
- https://github.com/SAP-docs/btp-job-scheduling-service/blob/main/docs/initial-setup-0adb655.md
- https://github.com/SAP-docs/btp-job-scheduling-service/blob/main/docs/create-a-service-instance-using-cf-cli-cb56f9e.md
