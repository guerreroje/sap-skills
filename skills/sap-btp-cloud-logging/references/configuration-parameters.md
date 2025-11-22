# SAP Cloud Logging - Configuration Parameters Reference

**Source:** https://github.com/SAP-docs/btp-cloud-logging/blob/main/docs/configuration-parameters-1830bca.md
**Last Updated:** 2025-11-22

---

## Overview

SAP Cloud Logging supports configuration parameters for create and update service operations. Some settings impact pricing - check the Discovery Center and SAP Cloud Logging Capacity Unit Estimator for details.

---

## Parameter Reference

### backend

Configures the OpenSearch backend infrastructure.

| Property | Type | Range | Default | Description |
|----------|------|-------|---------|-------------|
| `max_data_nodes` | int | 2-10 | 10 | Maximum number of data nodes |
| `api_enabled` | bool | - | false | Enable OpenSearch API access |

**Example:**
```json
{
  "backend": {
    "max_data_nodes": 10,
    "api_enabled": false
  }
}
```

---

### dashboards

Controls the OpenSearch Dashboards UI.

| Property | Type | Max Length | Default | Description |
|----------|------|------------|---------|-------------|
| `custom_label` | string | 20 chars | - | Label to identify instance in UI |

**Example:**
```json
{
  "dashboards": {
    "custom_label": "PROD-CLS"
  }
}
```

---

### ingest

Manages the ingest endpoint autoscaling behavior based on CPU utilization.

| Property | Type | Range | Default | Description |
|----------|------|-------|---------|-------------|
| `max_instances` | int | 2-10 | 10 | Maximum ingest instances |
| `min_instances` | int | 2-10 | 2 | Minimum ingest instances |

**Example:**
```json
{
  "ingest": {
    "max_instances": 10,
    "min_instances": 2
  }
}
```

---

### ingest_otlp

Enables data ingestion via OpenTelemetry Protocol (OTLP).

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enabled` | bool | false | Enable OTLP gRPC endpoint |

**Example:**
```json
{
  "ingest_otlp": {
    "enabled": true
  }
}
```

**Important:** When enabled, new service bindings include OTLP-specific credentials:
- `ingest-otlp-endpoint`
- `ingest-otlp-cert`
- `ingest-otlp-key`
- `server-ca`

---

### feature_flags

Array for enabling experimental features.

| Feature Flag | Description | Reversible |
|--------------|-------------|------------|
| `upgradeToOpenSearchV2` | Upgrade to OpenSearch 2.19 | **No** |

**Example:**
```json
{
  "feature_flags": ["upgradeToOpenSearchV2"]
}
```

**Warning:** The `upgradeToOpenSearchV2` flag triggers a non-reversible upgrade. Test thoroughly in non-production first.

---

### retention_period

Specifies how long ingested data is retained.

| Property | Type | Range | Default | Unit |
|----------|------|-------|---------|------|
| `retention_period` | int | 1-90 | 7 | days |

**Example:**
```json
{
  "retention_period": 14
}
```

**Note:** Automatic size-based removal takes priority when storage capacity is limited, regardless of retention setting.

---

### rotate_root_ca

Controls ingestion root CA certificate rotation.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `rotate_root_ca` | bool | false | Trigger CA rotation |

**Warning:** Updates may invalidate existing bindings. Follow the 3-step rotation process:
1. Set `true` to create new CA
2. Rebind all applications
3. Set `false` to delete old CA

**Example:**
```json
{
  "rotate_root_ca": true
}
```

---

### saml

Configures SAML 2.0 authentication for OpenSearch Dashboards.

#### Required Properties (when enabled)

| Property | Type | Description |
|----------|------|-------------|
| `enabled` | bool | Enable SAML authentication |
| `admin_group` | string | Group mapped to `all_access` role |
| `idp_initiated_sso` | bool | Allow IdP-initiated SSO |
| `roles_key` | string | Attribute name containing roles/groups |
| `idp_metadata_url` | string | Identity provider metadata URL |
| `idp_entity_id` | string | IdP entity identifier from metadata |
| `sp_entity_id` | string | Service provider entity identifier |

#### Optional Properties (for request signing)

| Property | Type | Description |
|----------|------|-------------|
| `sign_request` | bool | Enable request signing |
| `sign_request_private_key` | string | Base64-encoded PKCS#8 private key |
| `sign_request_cert` | string | Base64-encoded signing certificate |

**Example:**
```json
{
  "saml": {
    "enabled": true,
    "admin_group": "CLS-Admins",
    "idp_initiated_sso": false,
    "roles_key": "groups",
    "idp_metadata_url": "https://mytenant.accounts.ondemand.com/saml2/metadata",
    "idp_entity_id": "https://mytenant.accounts.ondemand.com",
    "sp_entity_id": "cloud-logging-abc123"
  }
}
```

---

## Complete Configuration Template

### Standard/Large Plan Production Setup

```json
{
  "retention_period": 14,
  "feature_flags": ["upgradeToOpenSearchV2"],
  "dashboards": {
    "custom_label": "PROD-CLS"
  },
  "backend": {
    "max_data_nodes": 10,
    "api_enabled": false
  },
  "ingest": {
    "max_instances": 10,
    "min_instances": 2
  },
  "ingest_otlp": {
    "enabled": true
  },
  "saml": {
    "enabled": true,
    "admin_group": "CLS-Administrators",
    "idp_initiated_sso": false,
    "roles_key": "groups",
    "idp_metadata_url": "https://<tenant>.accounts.ondemand.com/saml2/metadata",
    "idp_entity_id": "<from-metadata-entityID>",
    "sp_entity_id": "cloud-logging-<unique-id>"
  }
}
```

### Development/Evaluation Setup

```json
{
  "retention_period": 7
}
```

---

## Documentation Links

- **Source:** https://raw.githubusercontent.com/SAP-docs/btp-cloud-logging/main/docs/configuration-parameters-1830bca.md
- **SAP Help Portal:** https://help.sap.com/docs/cloud-logging
- **Discovery Center (Pricing):** https://discovery-center.cloud.sap/serviceCatalog/cloud-logging
