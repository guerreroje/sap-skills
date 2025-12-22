# SAP Datasphere Skill

Comprehensive Claude Code skill for SAP Datasphere development covering data warehouse creation, analytic modeling, data integration, administration, and connectivity.

## Overview

SAP Datasphere is SAP's cloud-native data warehouse solution on SAP Business Technology Platform (BTP). This skill provides comprehensive guidance for building enterprise data warehouses with SAP Datasphere.

## When to Use

This skill activates when working with:

- SAP Datasphere tenant setup and configuration
- Data Builder (graphical views, SQL views, tables, flows)
- Business Builder (business entities, consumption models)
- Analytic models for SAP Analytics Cloud
- Data integration (replication, transformation, task chains)
- Connection configuration (40+ connection types)
- Space and user administration
- Data access controls and security
- Content transport between tenants

## Keywords

**Product Terms**: sap datasphere, data warehouse cloud, dwc, sap btp data warehouse, datasphere tenant, datasphere space

**Data Builder**: data builder, graphical view, sql view, sqlscript, local table, remote table, data flow, replication flow, transformation flow, task chain, e-r model, intelligent lookup

**Business Builder**: business builder, business entity, fact model, consumption model, authorization scenario

**Analytic Modeling**: analytic model, dimension, fact, measure, hierarchy, calculated measure, restricted measure, currency conversion, unit conversion, time dimension, fiscal calendar

**Connectivity**: datasphere connection, cloud connector, data provisioning agent, sap s4hana connection, bw4hana connection, hana cloud connection, aws connection, azure connection, gcp connection, kafka connection, odata connection, jdbc connection

**Administration**: datasphere administration, space management, user management, role management, elastic compute node, monitoring, audit log

**Integration**: data integration, real-time replication, delta replication, cdc, data persistence, view analyzer, scheduling

**Security**: data access control, row-level security, dac, single values dac, hierarchy dac

**Transport**: content transport, export package, import package, csn json, cloud transport management

**Errors**: datasphere deployment failed, connection timeout, replication error, out of memory, permission denied

## File Structure

```
skills/sap-datasphere/
├── SKILL.md                              # Main skill file
├── README.md                             # This file
└── references/
    ├── data-acquisition-preparation.md   # Data flows, replication, tables
    ├── data-modeling.md                  # Analytic models, Business Builder
    ├── graphical-sql-views.md            # Views, E-R models, lookups
    ├── administration.md                 # Tenant, spaces, users, monitoring
    ├── connectivity.md                   # All connection types
    ├── data-integration-monitor.md       # Monitoring, scheduling
    ├── data-access-security.md           # Row-level security
    └── content-transport.md              # Export, import, packages
```

## Documentation Sources

- **SAP Help Portal**: [https://help.sap.com/docs/SAP_DATASPHERE](https://help.sap.com/docs/SAP_DATASPHERE)
- **GitHub Repository**: [https://github.com/SAP-docs/sap-datasphere](https://github.com/SAP-docs/sap-datasphere)
- **SAP Community**: [https://community.sap.com/topics/datasphere](https://community.sap.com/topics/datasphere)
- **API Reference**: [https://api.sap.com/package/sapdatasphere](https://api.sap.com/package/sapdatasphere)

## Coverage

This skill covers **558 documentation files** from the official SAP Datasphere documentation:

| Section | Files | Topics |
|---------|-------|--------|
| Acquiring-Preparing-Modeling-Data | 286 | Data Builder, Business Builder, Views |
| Administering | 135 | Tenant, Spaces, Users, Monitoring |
| Integrating-data-and-managing-spaces | 137 | Connections, Monitor, Security |

## Version

- **Skill Version**: 1.3.0
- **Last Verified**: 2025-11-26
- **SAP Datasphere Version**: Current (2024 releases)

## License

GPL-3.0
