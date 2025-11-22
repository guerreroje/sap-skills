# SAP Job Scheduling Service - Security Reference

Complete security configuration guide for SAP Job Scheduling Service.

**Source**: https://help.sap.com/docs/job-scheduling/sap-job-scheduling-service/security

---

## Authentication Overview

### Service Plans

| Plan | Authentication Method |
|------|----------------------|
| **standard** | OAuth 2.0 (recommended) |
| **lite** | HTTP Basic Authentication |

---

## Standard Plan - OAuth 2.0

### Obtaining Access Token

**Method 1: Client ID and Secret**

```bash
curl -X POST "<uaa.url>/oauth/token" \
  -H "Authorization: Basic $(echo -n '<clientid>:<clientsecret>' | base64)" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials"
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 43199,
  "scope": "...",
  "jti": "..."
}
```

**Method 2: X.509 Certificates**

1. Extract certificate and key from credentials:
```bash
# Save certificate
echo "<certificate_value>" | sed 's/\\n/\n/g' > cert.pem

# Save private key
echo "<key_value>" | sed 's/\\n/\n/g' > key.pem
```

2. Request token:
```bash
curl --cert cert.pem --key key.pem \
  -X POST "<certurl>/oauth/token" \
  -d "grant_type=client_credentials&client_id=<clientid>"
```

### Using Access Token

Include in all API requests:
```bash
curl -X GET "<credentials.url>/scheduler/jobs" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json"
```

---

## Lite Plan - Basic Authentication

Use credentials from `VCAP_SERVICES`:

```bash
curl -X GET "<url>/scheduler/jobs" \
  -u "<user>:<password>" \
  -H "Content-Type: application/json"
```

---

## XSUAA Configuration

### Prerequisites
- XSUAA service instance bound to your application
- xs-security.json configured with scope grants

### xs-security.json Configuration

Grant scope to Job Scheduling Service:

```json
{
  "xsappname": "my-application",
  "tenant-mode": "dedicated",
  "scopes": [
    {
      "name": "$XSAPPNAME.JOBSCHEDULER",
      "description": "Job Scheduler Scope",
      "grant-as-authority-to-apps": [
        "$XSSERVICENAME(<jobscheduler-instance-name>)"
      ]
    }
  ],
  "role-templates": [
    {
      "name": "JobSchedulerAdmin",
      "description": "Admin role for job scheduling",
      "scope-references": [
        "$XSAPPNAME.JOBSCHEDULER"
      ]
    }
  ]
}
```

### Apply Configuration

```bash
# Update existing XSUAA instance
cf update-service <xsuaa-instance-name> -c xs-security.json

# Restage application
cf restage <app-name>
```

---

## Action Endpoint Security

When the Job Scheduling Service invokes your action endpoint:

1. **Authorization header** contains JWT token
2. Token is cached for up to **12 hours** (scope updates may be delayed)
3. Application must validate token using bound XSUAA instance

### Token Validation (Node.js)

```javascript
const xsenv = require('@sap/xsenv');
const xssec = require('@sap/xssec');

// Get XSUAA credentials
const xsuaaCredentials = xsenv.getServices({ uaa: { tag: 'xsuaa' } }).uaa;

// Validate token
app.use('/api/job-action', (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  xssec.createSecurityContext(token, xsuaaCredentials, (err, securityContext) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Check scope
    if (!securityContext.checkLocalScope('JOBSCHEDULER')) {
      return res.status(403).json({ error: 'Insufficient scope' });
    }

    req.securityContext = securityContext;
    next();
  });
});
```

---

## Cloud Foundry Tasks

For CF tasks, security is handled by **CFUAA** (Cloud Foundry User Account and Authentication) rather than XSUAA.

---

## Credential Rotation

### Binding-Level Secrets

To rotate credentials:

1. Unbind the service from your application:
```bash
cf unbind-service <app-name> <jobscheduler-instance>
```

2. Rebind the service:
```bash
cf bind-service <app-name> <jobscheduler-instance>
```

3. Restage the application:
```bash
cf restage <app-name>
```

**Note**: The previous `clientsecret` becomes invalid after unbinding.

### Instance-Level Secrets

Instance-level secrets remain valid until explicitly rotated via rebind.

---

## X.509 Certificate Binding

### Create Certificate Binding

1. Create `parameters.json`:
```json
{
  "credential-type": "x509",
  "key-length": 2048,
  "validity": 7,
  "validity-type": "DAYS"
}
```

2. Bind with certificates:
```bash
cf bind-service <app-name> <instance-name> -c parameters.json
```

**Requirements**:
- Node.js: `@sap/jobs-client` version 1.6.3 or higher

---

## Dashboard Access Permissions

### Cloud Foundry

Required role: `SpaceDeveloper`

### Kyma

Required roles:
- `SAP_Job_Scheduling_Service_Admin`
- `SAP_Job_Scheduling_Service_Viewer`

---

## Data Protection

**Important Cautions**:

1. The service does **not** provide technical capabilities for personal data handling
2. Fields that may contain sensitive data:
   - Job names
   - Schedule descriptions
   - Message text in run logs
3. Organizations must implement additional safeguards if personal data is involved

---

## Security Best Practices

1. **Use HTTPS** for all action endpoints in production
2. **Validate JWT tokens** in your action endpoints
3. **Rotate credentials** regularly (at least quarterly)
4. **Use X.509 certificates** for enhanced security
5. **Limit scope grants** to only necessary permissions
6. **Monitor access logs** for unauthorized attempts
7. **Avoid storing personal data** in job names or descriptions

---

**Documentation Sources**:
- https://github.com/SAP-docs/btp-job-scheduling-service/tree/main/docs/50---Security
- https://help.sap.com/docs/job-scheduling/sap-job-scheduling-service/secure-access
