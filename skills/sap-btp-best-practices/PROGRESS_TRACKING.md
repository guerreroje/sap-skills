# SAP BTP Best Practices Skill - Progress Tracking Document

**Last Updated**: 2025-11-21
**Source Repository**: https://github.com/SAP-docs/btp-best-practices-guide
**Total Documentation Files**: 51 markdown files

---

## Documentation Coverage Status

This document tracks which content has been extracted from the SAP BTP Best Practices Guide and incorporated into this skill.

### Legend
- [x] = Content fully extracted and incorporated
- [ ] = Content not yet extracted
- [~] = Content partially extracted

---

## Root Level Files (4 files)

| File | Status | Notes |
|------|--------|-------|
| `docs/index.md` | [x] | Table of contents and navigation structure |
| `docs/develop-and-build-8a44d9c.md` | [x] | Development phases, programming models (CAP, ABAP Cloud) |
| `docs/onboard-to-sap-cloud-identity-services-9c897ee.md` | [x] | Identity Services onboarding, tenant setup, security hardening |
| `docs/what-s-new-for-sap-btp-administrator-s-guide-1b94a29.md` | [ ] | Release notes - dynamic content, link provided |

---

## Introduction (1 file)

| File | Status | Notes |
|------|--------|-------|
| `docs/intro/sap-btp-administrator-s-guide-9f2bb92.md` | [x] | Target audiences, ALM lifecycle phases, contribution options |

---

## Basic Platform Concepts (1 file)

| File | Status | Notes |
|------|--------|-------|
| `docs/basic-platform-concepts/basic-platform-concepts-38ecf59.md` | [x] | Global accounts, directories, subaccounts, entitlements, quotas, user types, commercial models, environments, regions, services |

---

## Getting Started Checklist (1 file)

| File | Status | Notes |
|------|--------|-------|
| `docs/getting-started-checklist/getting-started-checklist-cbd7663.md` | [x] | Prerequisites, free tier, commercial considerations, team building, implementation phases |

---

## Shared Responsibility (1 file)

| File | Status | Notes |
|------|--------|-------|
| `docs/shared-responsibility/shared-responsibility-model-between-you-and-sap-898509d.md` | [x] | SAP responsibilities, customer responsibilities, security recommendations |

---

## Set Up and Plan (29 files)

| File | Status | Notes |
|------|--------|-------|
| `docs/set-up-and-plan/set-up-and-plan-75e5031.md` | [x] | Overview of setup and planning phase |
| `docs/set-up-and-plan/creating-a-governance-model-bf0ce2c.md` | [x] | Governance model creation, organizational setup |
| `docs/set-up-and-plan/building-teams-fdeddf2.md` | [x] | Cloud Development Teams, Platform Engineering Team/CoE |
| `docs/set-up-and-plan/creating-a-knowledge-transfer-process-630c14c.md` | [x] | Knowledge sharing, training, communication channels |
| `docs/set-up-and-plan/creating-an-onboarding-process-for-development-projects-4bd29a8.md` | [x] | Onboarding documents, security documents, services catalog |
| `docs/set-up-and-plan/setting-up-your-account-model-2db81f4.md` | [x] | Global accounts, subaccounts, directories, spaces/namespaces |
| `docs/set-up-and-plan/account-model-with-directories-and-subaccounts-b5a6b58.md` | [x] | Directory use cases, labels, three account model examples |
| `docs/set-up-and-plan/account-model-with-subaccounts-049d331.md` | [x] | Simple subaccount model, data separation, SaaS limitations |
| `docs/set-up-and-plan/checklist-for-the-account-model-setup-7f1c318.md` | [x] | Prerequisites, ownership structure, directory templates |
| `docs/set-up-and-plan/creating-a-staged-development-environment-e2fbf87.md` | [x] | Three-subaccount model, alternative uses, geographic selection |
| `docs/set-up-and-plan/staged-development-with-the-cloud-foundry-environment-1c5f810.md` | [x] | CF subaccount/org relationship, data segregation, configuration capabilities |
| `docs/set-up-and-plan/staged-development-with-the-kyma-environment-ec8a269.md` | [x] | Kyma cluster provisioning, namespaces vs subaccounts decision framework |
| `docs/set-up-and-plan/naming-conventions-for-sap-btp-accounts-5302ea4.md` | [x] | Naming principles, character restrictions, CF and Kyma examples |
| `docs/set-up-and-plan/tools-for-account-administration-6bdb3a7.md` | [x] | BTP Cockpit, btp CLI, REST APIs, Terraform provider, Automation Pilot |
| `docs/set-up-and-plan/managing-cost-c615301.md` | [x] | Commercial models, contract provisioning, monitoring, billing validation |
| `docs/set-up-and-plan/setting-up-your-security-and-compliance-model-aaaad94.md` | [x] | Security requirements overview |
| `docs/set-up-and-plan/security-concepts-951d36c.md` | [x] | Network security, user management, identity federation, SSO |
| `docs/set-up-and-plan/setting-up-authentication-1dbce9c.md` | [x] | Identity Authentication recommendation, user types, default providers |
| `docs/set-up-and-plan/setting-up-authorization-cb9f0ac.md` | [x] | Provisioning vs federation comparison, authorization methods |
| `docs/set-up-and-plan/setting-up-identity-lifecycle-2c30208.md` | [x] | Identity Directory, Global User ID, integration approach |
| `docs/set-up-and-plan/giving-access-rights-to-platform-users-a03d08e.md` | [x] | Team-based access, environment-specific guidance (CF, ABAP, Kyma, Neo) |
| `docs/set-up-and-plan/setting-up-access-to-remote-systems-9d65539.md` | [x] | Destinations, Cloud Connector overview |
| `docs/set-up-and-plan/destination-authentication-methods-765423d.md` | [x] | 11 authentication methods with environment/proxy compatibility |
| `docs/set-up-and-plan/setting-up-identity-propagation-for-cloud-foundry-12cf719.md` | [x] | PrincipalPropagation, OAuth2SAMLBearerAssertion recommendations |
| `docs/set-up-and-plan/setting-up-identity-propagation-for-neo-d86d149.md` | [x] | Neo environment identity propagation decision tree |
| `docs/set-up-and-plan/extract-certificates-for-mutual-transport-layer-security-8a542ce.md` | [x] | X.509 certificate extraction, PEM file creation |
| `docs/set-up-and-plan/complying-with-data-protection-and-privacy-requirements-84e144a.md` | [x] | Compliance responsibility, EU Access services |
| `docs/set-up-and-plan/planning-failover-on-sap-btp-8c46464.md` | [x] | Failover principles, active/passive configuration |
| `docs/set-up-and-plan/role-based-access-control-rbac-in-kyma-bb31080.md` | [x] | Kubernetes RBAC, impersonation strategy, role configurations |
| `docs/set-up-and-plan/sharing-clusters-in-kyma-57ec1ea.md` | [x] | Cluster sharing use cases, control/data plane isolation |
| `docs/set-up-and-plan/separate-subaccounts-for-data-and-api-management-c973258.md` | [x] | API management subaccounts, shared database infrastructure |

---

## Deploy and Deliver (11 files)

| File | Status | Notes |
|------|--------|-------|
| `docs/deploy-and-deliver/deploy-and-deliver-5972cdb.md` | [x] | Deployment overview, delivery approach overview |
| `docs/deploy-and-deliver/deploying-applications-866ab13.md` | [x] | Deployment methods per runtime (CF, Neo, Kyma), MTA archives |
| `docs/deploy-and-deliver/delivering-applications-b39bae3.md` | [x] | CI/CD, Cloud Transport Management, CTS+, delivery options matrix |
| `docs/deploy-and-deliver/implementing-failover-df972c5.md` | [x] | Failover implementation tasks overview |
| `docs/deploy-and-deliver/deploy-your-application-in-two-data-centers-61d08d8.md` | [x] | Active/passive deployment, regional selection, legal considerations |
| `docs/deploy-and-deliver/keep-the-two-applications-in-sync-e6d2bdb.md` | [x] | Manual sync, CI/CD pipeline, Solution Export Wizard |
| `docs/deploy-and-deliver/define-how-a-failover-is-detected-88b86db.md` | [x] | Detection mechanisms, test categories, failover response |
| `docs/deploy-and-deliver/decide-on-the-failback-963f962.md` | [x] | Active/active vs active/passive, user-driven failback |
| `docs/deploy-and-deliver/multi-region-usecases.md` | [x] | Multi-region architectures, 5 reference use cases with hyperscaler integration |
| `docs/deploy-and-deliver/data-backups-managed-by-sap-6c1e071.md` | [x] | Automated backups (HANA Cloud, PostgreSQL), runtime-specific strategies |
| `docs/deploy-and-deliver/sap-btp-service-configuration-backups-managed-by-customers-9de0caa.md` | [x] | Customer-managed backup responsibilities |

---

## Go Live and Operate (1 file)

| File | Status | Notes |
|------|--------|-------|
| `docs/go-live-and-monitor/go-live-and-operate-b0ab4fb.md` | [x] | Go-live procedures, auth management, CDN, SAP Cloud ALM, monitoring, alerting, automation |

---

## Integrate and Test (1 file)

| File | Status | Notes |
|------|--------|-------|
| `docs/integrate-and-test/integrate-and-test-84ddc25.md` | [x] | Integration testing, OPA5, Cloud Connector, SAP Cloud Integration, Cloud Integration Automation |

---

## Improve and Retire (1 file)

| File | Status | Notes |
|------|--------|-------|
| `docs/improve-and-retire/improve-and-retire-89ffeab.md` | [x] | Neo migration, application retirement, maintenance, staying current |

---

## Summary Statistics

| Section | Files | Extracted | Coverage |
|---------|-------|-----------|----------|
| Root Level | 4 | 3 | 75% |
| Introduction | 1 | 1 | 100% |
| Basic Platform Concepts | 1 | 1 | 100% |
| Getting Started Checklist | 1 | 1 | 100% |
| Shared Responsibility | 1 | 1 | 100% |
| Set Up and Plan | 29 | 29 | 100% |
| Deploy and Deliver | 11 | 11 | 100% |
| Go Live and Operate | 1 | 1 | 100% |
| Integrate and Test | 1 | 1 | 100% |
| Improve and Retire | 1 | 1 | 100% |
| **TOTAL** | **51** | **50** | **98%** |

---

## Content Organization in Skill

The extracted content is organized using progressive disclosure:

### SKILL.md (Primary - ~4000 words)
Contains essential best practices organized by lifecycle phase:
- Platform concepts and architecture
- Account model setup
- Security and compliance
- Development and deployment
- Operations and monitoring
- Maintenance and retirement

### References (Detailed - On-demand loading)
Located in `references/` directory:
- `account-models.md` - Detailed account structure patterns
- `security-and-authentication.md` - Complete security guidance
- `deployment-and-delivery.md` - CI/CD and transport management
- `failover-and-resilience.md` - Multi-region and failover strategies
- `operations-and-monitoring.md` - Go-live and monitoring details
- `governance-and-teams.md` - Team structure and processes

---

## Source Documentation Links

For updating this skill, refer to the official documentation:

**Main Repository**:
https://github.com/SAP-docs/btp-best-practices-guide

**Key Documentation Sections**:
- Basic Concepts: https://github.com/SAP-docs/btp-best-practices-guide/tree/main/docs/basic-platform-concepts
- Set Up and Plan: https://github.com/SAP-docs/btp-best-practices-guide/tree/main/docs/set-up-and-plan
- Deploy and Deliver: https://github.com/SAP-docs/btp-best-practices-guide/tree/main/docs/deploy-and-deliver
- Go Live and Operate: https://github.com/SAP-docs/btp-best-practices-guide/tree/main/docs/go-live-and-monitor
- Integrate and Test: https://github.com/SAP-docs/btp-best-practices-guide/tree/main/docs/integrate-and-test
- Improve and Retire: https://github.com/SAP-docs/btp-best-practices-guide/tree/main/docs/improve-and-retire
- Shared Responsibility: https://github.com/SAP-docs/btp-best-practices-guide/tree/main/docs/shared-responsibility

**Official SAP Help Portal**:
https://help.sap.com/docs/btp/btp-administrators-guide

---

## Update Schedule

- **Quarterly Review**: Check for new documentation files and content updates
- **On SAP Release**: Review for breaking changes and new recommendations
- **Next Review Date**: 2026-02-21

---

*This tracking document was created on 2025-11-21 and should be updated whenever the skill content is modified.*
