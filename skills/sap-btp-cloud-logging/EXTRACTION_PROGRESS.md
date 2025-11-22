# SAP BTP Cloud Logging - Documentation Extraction Progress

**Source Repository:** https://github.com/SAP-docs/btp-cloud-logging/tree/main
**Last Extracted:** 2025-11-22
**Total Files:** 20 markdown files
**Status:** COMPLETE - All files extracted

---

## Documentation Files Extraction Status

### Overview & Planning (3 files)

| File | Status | Content Extracted |
|------|--------|-------------------|
| `index.md` | ✅ Complete | Documentation structure, navigation hierarchy |
| `what-is-sap-cloud-logging-8342176.md` | ✅ Complete | Service overview, key features, data storage, visualization, alerting, security |
| `service-plans-a9d2d1b.md` | ✅ Complete | Dev/Standard/Large plans, capacity, scaling, retention |

### Initial Setup (5 files)

| File | Status | Content Extracted |
|------|--------|-------------------|
| `prerequisites-41d8559.md` | ✅ Complete | Global Account, Subaccount, Entitlement requirements, SAML 2.0 integration with IAS |
| `initial-setup-ac50297.md` | ✅ Complete | Setup overview, SAP Build Code notes |
| `configuration-parameters-1830bca.md` | ✅ Complete | All 7 config params: backend, dashboards, ingest, ingest_otlp, feature_flags, retention_period, saml, rotate_root_ca |
| `create-an-sap-cloud-logging-instance-through-sap-btp-cockpit-3aca7af.md` | ✅ Complete | BTP Cockpit instance creation steps, service key creation |
| `create-an-sap-cloud-logging-instance-through-cloud-foundry-cli-3658d09.md` | ✅ Complete | CF CLI commands, example parameters |
| `create-an-sap-cloud-logging-instance-through-sap-btp-cli-21eb1bd.md` | ✅ Complete | BTP CLI commands, binding creation |
| `create-an-sap-cloud-logging-instance-through-sap-btp-service-operator-f6aa131.md` | ✅ Complete | Kubernetes/Kyma setup, ServiceInstance CRD, credential sharing |

### Data Ingestion (5 files)

| File | Status | Content Extracted |
|------|--------|-------------------|
| `ingest-observability-data-ba16ff7.md` | ✅ Complete | Overview of 4 ingestion methods |
| `ingest-from-cloud-foundry-runtime-f5a7c99.md` | ✅ Complete | CF binding, user-provided services, mTLS/Basic Auth, index patterns |
| `ingest-via-kyma-runtime-612c7b9.md` | ✅ Complete | Telemetry module, btp-operator, index patterns |
| `ingest-via-opentelemetry-api-endpoint-fdc78af.md` | ✅ Complete | OTLP gRPC setup, credentials, Java/Node.js automation, index patterns |
| `ingest-via-json-api-endpoint-3416f8f.md` | ✅ Complete | JSON API format, Fluent Bit config, batch uploads, compression |
| `rotate-the-ingestion-root-ca-certificate-bbcb3e7.md` | ✅ Complete | 3-step CA rotation procedure |

### Operations & Analysis (1 file)

| File | Status | Content Extracted |
|------|--------|-------------------|
| `access-and-analyze-observability-data-dad5b01.md` | ✅ Complete | Dashboard access, OpenSearch features, alerting |

### Security & Compliance (2 files)

| File | Status | Content Extracted |
|------|--------|-------------------|
| `security-recommendations-3382a69.md` | ✅ Complete | Security config recommendations, SAP Cloud ALM integration |
| `data-protection-and-privacy-80e76fd.md` | ✅ Complete | Legal disclaimers, data handling, localization |

### Backup & Recovery (1 file)

| File | Status | Content Extracted |
|------|--------|-------------------|
| `backup-and-restore-custom-contents-5b9bc66.md` | ✅ Complete | Automatic backups, restoration process, support ticket requirements |

---

## Key Information Extracted

### Service Plans Summary
- **dev**: 7.5 GB, no replication, evaluation only
- **standard**: 75 GB - 375 GB auto-scaling, replication, 8-43 days retention at 100 logs/sec
- **large**: 750 GB - 3.75 TB auto-scaling, replication, 8-43 days retention at 1000 logs/sec

### Configuration Parameters
1. `backend` - OpenSearch backend (max_data_nodes: 2-10)
2. `dashboards` - Custom labels (max 20 chars)
3. `ingest` - Autoscaling (min/max_instances: 2-10)
4. `ingest_otlp` - Enable OpenTelemetry (boolean)
5. `feature_flags` - Experimental features (e.g., upgradeToOpenSearchV2)
6. `retention_period` - Data retention (1-90 days, default: 7)
7. `saml` - SAML authentication config
8. `rotate_root_ca` - Certificate rotation (boolean)

### Index Patterns
- `logs-cfsyslog-*` - Cloud Foundry logs
- `metrics-otel-v1-*` - Resource metrics
- `logs-otel-v1-*` - OpenTelemetry logs
- `otel-v1-apm-span-*` - Distributed traces
- `otel-v1-apm-service-map` - Service map
- `logs-json-*` - JSON API logs
- `logs-json-istio-envoy-kyma*` - Kyma Istio logs
- `logs-json-kyma*` - Kyma application logs

### Security Recommendations Referenced
- BTP-CLS-0002 - Service key security
- BTP-CLS-0003 - Kyma runtime security

### Instance Creation Methods
1. SAP BTP Cockpit (UI)
2. Cloud Foundry CLI (`cf create-service`)
3. SAP BTP CLI (`btp create services/instance`)
4. SAP BTP Service Operator (Kubernetes CRD)

### Certificate Details
- Default validity: 90 days
- Configurable: 1-180 days (`certValidityDays`)
- Rotation: 3-step process via `rotate_root_ca` parameter

---

## Documentation Links for Updates

### GitHub Repository
- **Main Repo:** https://github.com/SAP-docs/btp-cloud-logging
- **Docs Folder:** https://github.com/SAP-docs/btp-cloud-logging/tree/main/docs

### Individual Documentation Pages
| Topic | GitHub Raw URL |
|-------|----------------|
| Overview | https://raw.githubusercontent.com/SAP-docs/btp-cloud-logging/main/docs/what-is-sap-cloud-logging-8342176.md |
| Service Plans | https://raw.githubusercontent.com/SAP-docs/btp-cloud-logging/main/docs/service-plans-a9d2d1b.md |
| Prerequisites | https://raw.githubusercontent.com/SAP-docs/btp-cloud-logging/main/docs/prerequisites-41d8559.md |
| Configuration | https://raw.githubusercontent.com/SAP-docs/btp-cloud-logging/main/docs/configuration-parameters-1830bca.md |
| BTP Cockpit Setup | https://raw.githubusercontent.com/SAP-docs/btp-cloud-logging/main/docs/create-an-sap-cloud-logging-instance-through-sap-btp-cockpit-3aca7af.md |
| CF CLI Setup | https://raw.githubusercontent.com/SAP-docs/btp-cloud-logging/main/docs/create-an-sap-cloud-logging-instance-through-cloud-foundry-cli-3658d09.md |
| BTP CLI Setup | https://raw.githubusercontent.com/SAP-docs/btp-cloud-logging/main/docs/create-an-sap-cloud-logging-instance-through-sap-btp-cli-21eb1bd.md |
| Service Operator | https://raw.githubusercontent.com/SAP-docs/btp-cloud-logging/main/docs/create-an-sap-cloud-logging-instance-through-sap-btp-service-operator-f6aa131.md |
| CF Ingestion | https://raw.githubusercontent.com/SAP-docs/btp-cloud-logging/main/docs/ingest-from-cloud-foundry-runtime-f5a7c99.md |
| Kyma Ingestion | https://raw.githubusercontent.com/SAP-docs/btp-cloud-logging/main/docs/ingest-via-kyma-runtime-612c7b9.md |
| OpenTelemetry | https://raw.githubusercontent.com/SAP-docs/btp-cloud-logging/main/docs/ingest-via-opentelemetry-api-endpoint-fdc78af.md |
| JSON API | https://raw.githubusercontent.com/SAP-docs/btp-cloud-logging/main/docs/ingest-via-json-api-endpoint-3416f8f.md |
| CA Rotation | https://raw.githubusercontent.com/SAP-docs/btp-cloud-logging/main/docs/rotate-the-ingestion-root-ca-certificate-bbcb3e7.md |
| Data Analysis | https://raw.githubusercontent.com/SAP-docs/btp-cloud-logging/main/docs/access-and-analyze-observability-data-dad5b01.md |
| Security | https://raw.githubusercontent.com/SAP-docs/btp-cloud-logging/main/docs/security-recommendations-3382a69.md |
| Data Protection | https://raw.githubusercontent.com/SAP-docs/btp-cloud-logging/main/docs/data-protection-and-privacy-80e76fd.md |
| Backup/Restore | https://raw.githubusercontent.com/SAP-docs/btp-cloud-logging/main/docs/backup-and-restore-custom-contents-5b9bc66.md |

### Official SAP Help Portal
- **Main Documentation:** https://help.sap.com/docs/cloud-logging
- **Discovery Center:** https://discovery-center.cloud.sap/serviceCatalog/cloud-logging

### Related SAP Resources
- **BTP Security Recommendations:** https://help.sap.com/docs/btp/sap-btp-security-recommendations-c8a9bb59fe624f0981efa0eff2497d7d/sap-btp-security-recommendations
- **OpenSearch Documentation:** https://opensearch.org/docs/latest/
- **SAP Cloud Identity Services:** https://help.sap.com/docs/cloud-identity

---

## Skill Creation Checklist

- [x] All 20 documentation files extracted
- [x] Service plans documented
- [x] Configuration parameters documented
- [x] All 4 instance creation methods documented
- [x] All 4 ingestion methods documented
- [x] Certificate rotation procedure documented
- [x] Security recommendations documented
- [x] Index patterns documented
- [x] Update links preserved
- [x] SKILL.md created
- [x] Reference files created (6 files)
- [x] README.md created with keywords
- [x] Skill verified

---

**Extraction Complete:** 2025-11-22
**Next Update Due:** Check GitHub repository for documentation updates
