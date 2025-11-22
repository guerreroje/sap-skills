---
name: sap-btp-developer-guide
description: Develops business applications on SAP Business Technology Platform (BTP) using CAP (Node.js/Java) or ABAP Cloud. Use when building cloud applications on SAP BTP, deploying to Cloud Foundry or Kyma runtimes, integrating with SAP HANA Cloud, implementing SAP Fiori UIs, connecting to remote SAP systems, building multitenant SaaS applications, extending SAP S/4HANA or SuccessFactors, setting up CI/CD pipelines, implementing observability, or following SAP development best practices.
license: MIT
---

# SAP BTP Developer Guide Skill

Comprehensive guidance for developing, deploying, and operating business applications on SAP Business Technology Platform.

## When to Use This Skill

Use when:
- Building new applications on SAP BTP (Cloud Foundry or Kyma runtime)
- Developing with SAP Cloud Application Programming Model (CAP)
- Building ABAP Cloud applications in SAP BTP ABAP Environment
- Deploying SAP Fiori or SAPUI5 user interfaces
- Connecting applications to SAP S/4HANA, SuccessFactors, or on-premise systems
- Building multitenant SaaS applications
- Implementing side-by-side extensions for SAP solutions
- Setting up CI/CD pipelines for SAP BTP
- Implementing observability with SAP Cloud ALM or SAP Cloud Logging
- Using SAP HANA Cloud for data persistence

## Runtime and Programming Model Selection

For detailed runtime comparison: See `references/runtimes.md`

### Decision Matrix

| Criteria | CAP (Cloud Foundry/Kyma) | ABAP Cloud |
|----------|--------------------------|------------|
| **Languages** | Node.js, Java, TypeScript | ABAP |
| **Best For** | New cloud-native apps, extensions | Organizations with ABAP expertise |
| **Runtime** | Cloud Foundry or Kyma | SAP BTP ABAP Environment |
| **Persistence** | SAP HANA Cloud, PostgreSQL | SAP HANA Cloud (ABAP-managed) |
| **UI Framework** | SAP Fiori Elements, SAPUI5 | SAP Fiori Elements, SAPUI5 |
| **IDE** | SAP Business Application Studio, VS Code | ABAP Development Tools (Eclipse) |

### CAP Application Development

CAP provides three operational profiles:
- **Development**: Mock services, minimal setup, SQLite/H2 for local testing
- **Hybrid**: Local app connected to cloud services
- **Production**: Full cloud deployment with SAP HANA Cloud

Key capabilities:
- Domain-driven design with CDS (Core Data Services)
- Built-in multitenancy support
- Automatic OData/REST service generation
- Platform-agnostic design (no vendor lock-in)

For CAP details: See `references/cap-development.md`

### ABAP Cloud Development

ABAP Cloud uses four foundational technologies:
1. **Core Data Services (CDS)** - Data modeling and analytics
2. **ABAP RESTful Application Programming Model (RAP)** - Service-oriented development
3. **Restricted ABAP Language** - Cloud-safe API access
4. **Released Public APIs** - Upgrade-stable extensions

For ABAP details: See `references/abap-cloud.md`

## Development Workflow

### Phase 1: Explore and Discover

1. **Identify business problem** - Conduct stakeholder interviews
2. **Understand user needs** - Visit customers, observe workflows
3. **Define security requirements** - Threat modeling, compliance planning (GDPR, HIPAA)
4. **Establish governance** - Set up organizational structure

### Phase 2: Design

1. **User Experience Design**
   - Follow SAP Fiori Design Guidelines
   - Implement accessibility (WCAG 2.2)
   - Use design thinking methodology

2. **Technology Design**
   - Apply Domain-Driven Design for complex applications (30+ use cases)
   - Define module boundaries and communication patterns
   - Plan microservices architecture if needed

3. **Security in Design**
   - Secure user interfaces with SAP Fiori authentication
   - Implement RBAC/ABAC using OAuth/OpenID Connect
   - Validate CDS models for data protection

For design patterns: See `references/design-patterns.md`

### Phase 3: Develop

**CAP Development:**
```bash
# Initialize CAP project
cds init my-project
cd my-project

# Add SAP HANA support
cds add hana

# Add authentication
cds add xsuaa

# Run locally
cds watch
```

**Key development tools:**
- SAP Business Application Studio (primary IDE)
- SAP Cloud SDK (OData/OpenAPI clients)
- MTA Build Tool (packaging)

**Coding standards:**
- Follow SAPUI5 Guidelines and SAP Fiori Design Guidelines
- Establish naming conventions
- Implement parameterized queries (prevent SQL injection)
- Use CDS constraints for input validation

For tools catalog: See `references/tools.md`

### Phase 4: Deploy

**Cloud Foundry Deployment:**
```bash
# Build MTA archive
mbt build

# Deploy to Cloud Foundry
cf deploy mta_archives/my-project_1.0.0.mtar
```

**Kyma Deployment:**
```bash
# Use Helm charts or Terraform
terraform init
terraform apply
```

**ABAP Deployment:**
- Use Manage Software Components app (gCTS)
- Transport via Landscape Portal
- Partner options: Multitenant SaaS or Add-on Product

For deployment details: See `references/deployment.md`

### Phase 5: Run and Scale

**Monitoring:**
- SAP Cloud ALM (central observability)
- SAP Cloud Logging (detailed logs, metrics, traces)
- ABAP Technical Monitoring Cockpit

**Scaling:**
- Cloud Foundry: Automatic instance distribution across AZs
- Kyma: Kubernetes-native scaling
- ABAP: Elastic scaling with ACUs (0.5 ACU increments)

**Cost optimization:**
- System hibernation (ABAP) - reduce to <5% operational cost
- SAP HANA Cloud Native Storage Extension
- Elastic Compute Nodes for peak workloads

For operations: See `references/operations.md`

## Key Services and Tools

### Platform Services

| Service | Purpose |
|---------|---------|
| SAP HANA Cloud | Database-as-a-Service, multi-model |
| SAP Connectivity Service | On-premise/VPC connections via Cloud Connector |
| SAP Destination Service | Routing, authentication management |
| SAP Event Mesh | Event distribution between applications |
| SAP Integration Suite | API Management, Cloud Integration |

### Development Tools

| Tool | Purpose |
|------|---------|
| SAP Business Application Studio | Primary cloud IDE |
| SAP Build | Low-code/no-code development |
| Cloud Foundry CLI | CF deployment and management |
| kubectl/Helm | Kyma/Kubernetes management |
| Terraform Provider for SAP BTP | Infrastructure as code |

For architecture details: See `references/architecture.md`

## Security Implementation

### CAP Security Features
- Parameterized queries (SQL injection prevention)
- CSRF protection for UI applications
- Built-in authentication/authorization frameworks
- SAP Credential Store for secrets management

### Security Guidelines
1. **Secure environment configuration** - Restrict network access
2. **Security testing** - Penetration testing before go-live
3. **Secure deployment pipelines** - Code scanning, dependency validation
4. **Secrets management** - Use SAP Credential Store

For security details: See `references/security.md`

## Connectivity Patterns

### Cloud-to-On-Premise
- SAP Connectivity Service + Cloud Connector
- User propagation supported
- Protocols: HTTP, RFC, LDAP, FTP

### Cloud-to-Cloud
- SAP Destination Service for routing
- OAuth token management
- SAP Transparent Proxy for Kubernetes

For connectivity details: See `references/connectivity.md`

## CI/CD Implementation

**SAP Continuous Integration and Delivery** provides pre-configured pipelines:
- Cloud Foundry Environment jobs (SAP Fiori, CAP)
- SAP Fiori for ABAP Platform jobs
- SAP Integration Suite Artifacts jobs

Setup steps:
1. Enable in SAP BTP cockpit
2. Assign Administrator/Developer roles
3. Configure repository credentials (GitHub, GitLab, Bitbucket, Azure Repos)
4. Add repositories and create jobs
5. Configure webhooks for automated builds

For CI/CD details: See `references/cicd.md`

## Observability Implementation

### Central Layer (SAP Cloud ALM)
- Real User Monitoring
- Health Monitoring
- Integration and Exception Monitoring
- Synthetic User Monitoring

### Local Layer (SAP Cloud Logging)
- Log Analytics (OpenSearch-based)
- Distributed tracing
- Custom dashboards and alerting

**OpenTelemetry** is the industry standard for instrumentation.

For observability details: See `references/observability.md`

## Tutorials and Missions

### CAP Learning Path
1. **Starter Mission**: Full-Stack CAP Application
2. **Extension Mission**: Side-by-Side CAP-Based Extensions
3. **Enterprise Mission**: Change Tracking, Audit Logging, Attachments
4. **Multitenant Mission**: SaaS Application Development
5. **Observability Mission**: SAP Cloud Logging Integration

### ABAP Learning Path
1. **RAP100 Basics**: Fiori apps, OData services, business logic
2. **RAP100 Intermediate**: Actions, dynamic feature control, unit testing
3. **RAP120**: AI-assisted development with SAP Joule
4. **Analytics**: CDS views with SAP Analytics Cloud

Sample applications:
- **Incident Management** (CAP)
- **Flight Reference Scenario** (ABAP)
- **Poetry Slam Manager** (Partner SaaS)

For tutorial details: See `references/tutorials.md`

## Partner/ISV Development

### Deployment Options
1. **Multitenant SaaS** - Cloud service operated in partner's global account
2. **Add-on Product** - Installed in customer's ABAP environment

### Requirements
- SAP PartnerEdge Build contract
- Registered ABAP namespace (mandatory)
- Landscape Portal for lifecycle management

For partner details: See `references/partners.md`

## Quick Reference Links

**Official Documentation:**
- SAP BTP Help: https://help.sap.com/docs/btp
- CAP Documentation: https://cap.cloud.sap/docs/
- SAP Discovery Center: https://discovery-center.cloud.sap/
- SAP API Business Hub: https://api.sap.com/

**Design Resources:**
- SAP Fiori Design: https://experience.sap.com/fiori-design-web/
- SAPUI5 SDK: https://sapui5.hana.ondemand.com/

**Learning:**
- SAP Developers: https://developers.sap.com/
- SAP Learning: https://learning.sap.com/

**Source Documentation:**
- This skill is based on: https://github.com/SAP-docs/btp-developer-guide
- Track updates: See `PROGRESS_TRACKING.md`

## Common Errors and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| Third-party cookie issues | Browser deprecation | See SAP Note 3409306 |
| XSUAA binding failures | Missing service instance | Run `cf create-service xsuaa application` |
| HANA deployment errors | Wrong target container | Check `requires` in mta.yaml |
| ATC Priority 1 findings | Non-cloud-compliant code | Use ABAP_CLOUD_DEVELOPMENT_DEFAULT variant |

## Version Information

- **Skill Version**: 1.0.0
- **Source Last Updated**: 2025-11-21
- **Based On**: SAP BTP Developer Guide (https://github.com/SAP-docs/btp-developer-guide)
- **Next Review**: 2026-02-21
