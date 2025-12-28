# SAP Skill Quality Checklist

**For general plugin development**, use **plugin-dev skills** FIRST.

This checklist covers **SAP-specific quality standards** only.

---

## Pre-Build Checklist

**General Plugin Development** (use plugin-dev):
- [ ] Used plugin-dev:skill-development for basic skill creation
- [ ] Used plugin-dev:plugin-structure for directory setup
- [ ] YAML frontmatter created with plugin-dev guidance

**SAP-Specific Validation**:
- [ ] Skill is SAP-specific (not general development)
- [ ] Identified skill family (Tooling/BTP/UI/Data/Core)
- [ ] Checked for existing related SAP skills

---

## SAP SDK Version Tracking

**Package Versions**:
- [ ] SAP SDK versions documented in metadata section
- [ ] Version format: `cap_version: "@sap/cds 9.4.x"`
- [ ] Last verified date current (<90 days): `last_verified: "2025-12-28"`
- [ ] All package.json dependencies use latest stable versions

**Version Sources**:
- [ ] Verified against official SAP release notes
- [ ] Checked npm registry for latest versions
- [ ] Tested with documented versions

---

## Known Issues Documentation

**SAP-Specific Issues**:
- [ ] Common SAP errors documented with error codes
- [ ] SAP Note numbers cited where applicable
- [ ] GitHub issue links for known bugs
- [ ] Workarounds provided with clear instructions

**Example Format**:
```markdown
| Issue | Solution | Source |
|-------|----------|--------|
| D1_ERROR 1105 | Use batch API | SAP Note 3456789 |
```

---

## Production Testing

**Real SAP Environment Testing**:
- [ ] Tested with actual SAP BTP account (not just localhost)
- [ ] Verified with real SAP systems (HANA, S/4HANA, etc.)
- [ ] Templates work in production environments
- [ ] Error catalog validated against real errors
- [ ] Deployment tested end-to-end

---

## Marketplace Integration

**Cross-References**:
- [ ] Related SAP skills identified and documented
- [ ] Cross-references added to Related Skills section
- [ ] Example:
  ```markdown
  ## Related Skills
  - **sap-fiori-tools**: Use for UI layer development
  - **sap-btp-cloud-platform**: Use for deployment
  ```

**Category Assignment**:
- [ ] Correct category: Tooling / BTP / UI / Data / Core
- [ ] Keywords include SAP technology names
- [ ] Description mentions SAP-specific use cases

---

## Error Catalog Pattern

**SAP Error Documentation**:
- [ ] Common error messages documented
- [ ] Error codes included (BTP errors, HANA errors, etc.)
- [ ] Solutions provided with step-by-step instructions
- [ ] Links to SAP documentation

---

## Comprehensive Quality Review

**skill-review Plugin** (14-phase audit):
- [ ] Run: `/review-skill <skill-name>`
- [ ] All 🔴 Critical issues resolved
- [ ] All 🟡 High issues resolved
- [ ] 🟠 Medium and 🟢 Low issues reviewed

**Covers**:
- Standards compliance (YAML validation)
- Official docs verification (Context7/WebFetch)
- Code examples audit
- Dependency version checks
- Anti-pattern detection

---

## Automation & Manifest Generation

**After Skill Creation**:
- [ ] Run: `./scripts/sync-plugins.sh`
- [ ] Verify plugin.json generated correctly
- [ ] Check marketplace.json updated with new skill
- [ ] Validate cross-references appear

**Verification**:
```bash
# Check plugin.json exists
ls plugins/<skill-name>/.claude-plugin/plugin.json

# Check marketplace.json includes skill
jq '.plugins | map(.name)' .claude-plugin/marketplace.json | grep <skill-name>
```

---

## Git Commit Checklist

**Files to Include**:
- [ ] plugins/<skill-name>/ (all skill files)
- [ ] .claude-plugin/marketplace.json (updated registry)
- [ ] Both plugin.json files (plugin-level + skill-level)

**Commit Message Template**:
```
Add <skill-name> for [SAP technology]

- Provides [key features]
- SAP SDK version: <version>
- Tested with: [production evidence]
- Related skills: [cross-references]

Production tested: [evidence]
```

---

## Quarterly Maintenance

**Every 3 Months**:
- [ ] Check SAP SDK updates (npm outdated)
- [ ] Review SAP release notes for breaking changes
- [ ] Re-test skill in production environment
- [ ] Update last_verified date if current
- [ ] Update package versions if needed
- [ ] Re-run skill-review plugin

---

## Final Sign-Off

✅ **I certify**:
- [ ] All SAP-specific checklists complete
- [ ] Used plugin-dev for general plugin development
- [ ] Skill tested in production SAP environment
- [ ] skill-review plugin passed (all critical issues resolved)
- [ ] Marketplace integration complete
- [ ] Automation scripts run successfully

---

**Skill Name**: _______________
**Date**: _______________
**Verified By**: _______________

**If all boxes checked: SHIP IT! 🚀**

---

**Last Updated**: 2025-12-28
