# BTP Job Scheduling Service Skill

Claude Code skill for SAP BTP Job Scheduling Service development and integration.

## Overview

This skill provides comprehensive guidance for implementing SAP Job Scheduling Service on SAP Business Technology Platform. It covers job creation, schedule configuration, REST API usage, authentication, multitenancy, and troubleshooting.

## Keywords for Discovery

### Primary Keywords
- SAP Job Scheduling Service
- BTP Job Scheduler
- SAP BTP scheduled jobs
- Cloud Foundry job scheduling
- Kyma job scheduling
- jobscheduler service

### Schedule Types
- cron schedule
- repeatInterval
- repeatAt
- one-time schedule
- recurring schedule
- SAP cron format

### API and Integration
- Job Scheduling REST API
- @sap/jobs-client
- Node.js job scheduler
- OAuth 2.0 job scheduling
- XSUAA job scheduler
- action endpoint

### Operations
- create job
- delete job
- update schedule
- activate schedule
- deactivate schedule
- job run logs
- async job
- synchronous job
- asynchronous mode

### Configuration
- xs-security.json job scheduler
- VCAP_SERVICES jobscheduler
- cf bind-service jobscheduler
- X.509 certificate binding
- credential rotation

### Integration Services
- SAP Alert Notification
- SAP Cloud ALM
- ansConfig
- calmConfig

### Multitenancy
- SaaS tenant jobs
- PaaS tenant
- multitenant job scheduling
- tenant-aware scheduling

### Troubleshooting
- ACK_NOT_RECVD
- job not triggering
- schedule not running
- HTTP 401 job scheduler
- rate limiting
- BC-CP-CF-JBS

### Error Messages
- request entity too large
- too many requests
- service unavailable
- invalid cron format
- missing scope

## Skill Contents

### Main Files
- `SKILL.md` - Primary skill instructions and quick reference
- `README.md` - This file with keywords
- `PROGRESS_TRACKING.md` - Documentation extraction status

### Reference Files
- `references/schedule-formats.md` - Complete cron and time format documentation
- `references/rest-api.md` - Full REST API reference
- `references/security.md` - Authentication and authorization
- `references/setup-guide.md` - Initial setup instructions
- `references/multitenancy.md` - Multi-tenant configuration
- `references/nodejs-client.md` - Node.js client library guide
- `references/troubleshooting.md` - Error resolution guide

### Templates
- `templates/job-definition.json` - Job creation template
- `templates/schedule-examples.json` - Schedule format examples
- `templates/nodejs-async-handler.js` - Async job handler template

## Use Cases

This skill should be triggered when users ask about:
- Creating scheduled jobs on SAP BTP
- Configuring cron expressions for SAP Job Scheduler
- Setting up recurring job schedules
- Implementing asynchronous job patterns
- Cloud Foundry task scheduling
- Job Scheduling REST API usage
- @sap/jobs-client Node.js library
- OAuth authentication for job scheduler
- Multitenancy in job scheduling
- SAP Alert Notification integration
- SAP Cloud ALM job monitoring
- Troubleshooting job execution issues

## Version Information

- **Created**: 2025-11-22
- **Documentation Source**: SAP Help Portal (October 2025)
- **GitHub Docs**: https://github.com/SAP-docs/btp-job-scheduling-service
- **SAP Help Portal**: https://help.sap.com/docs/job-scheduling

## License

MIT License

## Related Skills

- sap-btp-setup
- sap-cloud-foundry
- sap-kyma
- sap-xsuaa
