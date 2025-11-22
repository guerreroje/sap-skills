# SAP Cloud Logging - SAML Authentication Reference

**Source:** https://github.com/SAP-docs/btp-cloud-logging/blob/main/docs/prerequisites-41d8559.md
**Last Updated:** 2025-11-22

---

## Overview

SAP Cloud Logging strongly recommends integrating with SAP Cloud Identity Services using SAML 2.0 protocol for secure dashboard access. This enables centralized user management and group-based access control.

---

## Prerequisites

1. **SAP Cloud Identity Services tenant** (Identity Authentication)
2. **Administrator access** to Identity Authentication admin console
3. **Cloud Logging instance** ready for SAML configuration

---

## SAML 2.0 Configuration Steps

### Step 1: Gather Identity Provider Information

From your Identity Authentication tenant:

**Metadata URL:**
```
https://<tenant-id>.accounts.ondemand.com/saml2/metadata
```

**Entity ID:**
Extract from metadata file - look for `entityID` attribute in the root element.

Example:
```xml
<EntityDescriptor entityID="https://mytenant.accounts.ondemand.com">
```

---

### Step 2: Create SAML 2.0 Application

1. Log into Identity Authentication admin console
2. Navigate to **Applications & Resources** → **Applications**
3. Click **Create** → **SAML 2.0**
4. Enter application name (e.g., "SAP Cloud Logging - Production")

---

### Step 3: Configure Application Attributes

#### 3.1 Self-Defined Attribute

1. Go to application → **Attributes**
2. Add attribute:
   - **Name:** `groups`
   - **Source:** Identity Directory
   - **Value:** User Groups

#### 3.2 Name ID Format

1. Go to **SAML 2.0 Configuration**
2. Set **Name ID Format:** `E-mail`

#### 3.3 Manual SAML 2.0 Configuration

Configure the service provider settings:

| Setting | Value |
|---------|-------|
| Assertion Consumer Service | `https://<dashboards-url>/_opendistro/_security/saml/acs` |
| Single Logout Service | `https://<dashboards-url>/_opendistro/_security/saml/logout` |
| SP Entity ID | `cloud-logging-<instance-id>` |

---

### Step 4: Configure Request Signing (Recommended)

Request signing adds an extra layer of security by signing SAML requests.

#### Generate Signing Certificate and Key

```bash
# Generate private key (PKCS#8 format required)
openssl genpkey -algorithm RSA -out signing-key.pem -pkeyopt rsa_keygen_bits:2048

# Generate certificate signing request
openssl req -new -key signing-key.pem -out signing.csr -subj "/CN=Cloud Logging SAML Signing"

# Generate self-signed certificate (valid for 1 year)
openssl x509 -req -days 365 -in signing.csr -signkey signing-key.pem -out signing-cert.pem
```

#### Encode for Configuration

```bash
# Base64 encode the private key (remove headers)
cat signing-key.pem | grep -v "BEGIN\|END" | tr -d '\n' > signing-key-b64.txt

# Base64 encode the certificate (remove headers)
cat signing-cert.pem | grep -v "BEGIN\|END" | tr -d '\n' > signing-cert-b64.txt
```

#### Upload to Identity Authentication

1. Go to application → **SAML 2.0 Configuration**
2. Enable **Sign SAML Requests**
3. Upload the signing certificate

---

### Step 5: Create Access Group

1. In Identity Authentication, go to **Users & Authorizations** → **User Groups**
2. Create a group (e.g., `CLS-Administrators`)
3. Add users who need dashboard access

**Important:** The group configured as `admin_group` in Cloud Logging automatically maps to the `all_access` role in OpenSearch.

---

### Step 6: Configure Cloud Logging Instance

Update your Cloud Logging instance with SAML parameters:

```json
{
  "saml": {
    "enabled": true,
    "admin_group": "CLS-Administrators",
    "idp_initiated_sso": false,
    "roles_key": "groups",
    "idp_metadata_url": "https://<tenant-id>.accounts.ondemand.com/saml2/metadata",
    "idp_entity_id": "https://<tenant-id>.accounts.ondemand.com",
    "sp_entity_id": "cloud-logging-<unique-identifier>"
  }
}
```

**With request signing:**

```json
{
  "saml": {
    "enabled": true,
    "admin_group": "CLS-Administrators",
    "idp_initiated_sso": false,
    "roles_key": "groups",
    "idp_metadata_url": "https://<tenant-id>.accounts.ondemand.com/saml2/metadata",
    "idp_entity_id": "https://<tenant-id>.accounts.ondemand.com",
    "sp_entity_id": "cloud-logging-<unique-identifier>",
    "sign_request": true,
    "sign_request_private_key": "<base64-encoded-pkcs8-private-key>",
    "sign_request_cert": "<base64-encoded-certificate>"
  }
}
```

---

## SAML Parameter Reference

### Required Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `enabled` | boolean | Enable SAML authentication |
| `admin_group` | string | Group mapped to `all_access` role |
| `idp_initiated_sso` | boolean | Allow IdP-initiated SSO |
| `roles_key` | string | SAML attribute containing groups |
| `idp_metadata_url` | string | Identity Provider metadata URL |
| `idp_entity_id` | string | IdP entity identifier |
| `sp_entity_id` | string | Service Provider entity identifier |

### Optional Parameters (Request Signing)

| Parameter | Type | Description |
|-----------|------|-------------|
| `sign_request` | boolean | Enable request signing |
| `sign_request_private_key` | string | Base64-encoded PKCS#8 private key |
| `sign_request_cert` | string | Base64-encoded signing certificate |

---

## Role Mapping

### Default Role Mapping

| Group | OpenSearch Role |
|-------|-----------------|
| `admin_group` value | `all_access` |
| Other groups | Configurable via OpenSearch Security |

### Custom Role Mapping

After SAML setup, configure additional role mappings in OpenSearch Dashboards:

1. Go to **Security** → **Roles**
2. Create custom roles with specific index permissions
3. Go to **Security** → **Role Mappings**
4. Map SAML groups to OpenSearch roles

**Example custom role for read-only access:**
```yaml
role_name: cls_readonly
cluster_permissions:
  - cluster_composite_ops_ro
index_permissions:
  - index_patterns:
      - "logs-*"
      - "metrics-*"
    allowed_actions:
      - read
```

---

## Troubleshooting

### Login Fails with "Invalid SAML Response"

1. Verify `idp_entity_id` matches metadata exactly
2. Check `sp_entity_id` is unique
3. Ensure clock sync between IdP and Cloud Logging
4. Validate certificate hasn't expired

### User Not Authorized

1. Verify user is in the configured `admin_group`
2. Check group attribute is being sent in SAML assertion
3. Confirm `roles_key` matches the attribute name (`groups`)

### IdP Metadata URL Not Accessible

1. Check URL is publicly accessible
2. Verify network connectivity from Cloud Logging
3. Try downloading metadata manually and hosting it

### Request Signing Errors

1. Ensure private key is PKCS#8 format
2. Verify base64 encoding is correct (no headers)
3. Check certificate matches private key
4. Confirm certificate is uploaded to IdP

### IdP-Initiated SSO Not Working

1. Set `idp_initiated_sso: true`
2. Configure correct Relay State in IdP
3. Verify SP Entity ID matches

---

## Security Best Practices

1. **Enable request signing** for production environments
2. **Rotate signing certificates** annually
3. **Use dedicated group** for Cloud Logging admins
4. **Implement least privilege** with custom role mappings
5. **Review access** periodically
6. **Enable audit logging** in Identity Authentication

---

## Complete Configuration Example

### Identity Authentication Application Settings

| Setting | Value |
|---------|-------|
| Application Type | SAML 2.0 |
| Name ID Format | E-mail |
| Assertion Consumer Service | `https://dashboards.cls.example.com/_opendistro/_security/saml/acs` |
| SP Entity ID | `cloud-logging-prod-001` |
| Sign SAML Requests | Enabled |
| Groups Attribute | `groups` |

### Cloud Logging Instance Configuration

```json
{
  "retention_period": 14,
  "saml": {
    "enabled": true,
    "admin_group": "CLS-Administrators",
    "idp_initiated_sso": false,
    "roles_key": "groups",
    "idp_metadata_url": "https://mytenant.accounts.ondemand.com/saml2/metadata",
    "idp_entity_id": "https://mytenant.accounts.ondemand.com",
    "sp_entity_id": "cloud-logging-prod-001",
    "sign_request": true,
    "sign_request_private_key": "MIIEvgIBADANBg...",
    "sign_request_cert": "MIIDXTCCAkWgAw..."
  }
}
```

---

## Documentation Links

- **Source:** https://raw.githubusercontent.com/SAP-docs/btp-cloud-logging/main/docs/prerequisites-41d8559.md
- **SAP Cloud Identity Services:** https://help.sap.com/docs/cloud-identity
- **Identity Authentication Admin Guide:** https://help.sap.com/docs/identity-authentication
- **OpenSearch Security:** https://opensearch.org/docs/latest/security/
