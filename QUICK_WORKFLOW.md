# Quick Workflow

## Step 1: Use plugin-dev for Basics

Run: `/use plugin-dev:skill-development`

**This covers**:
- YAML frontmatter creation
- Plugin directory structure
- Resource organization (scripts/, references/, assets/)
- Progressive disclosure patterns

## Step 2: Add SAP-Specific Elements

See [SAP_DEVELOPMENT_GUIDE.md](SAP_DEVELOPMENT_GUIDE.md) for:

**SDK Version Tracking**:
```yaml
metadata:
  version: "2.1.0"
  cap_version: "@sap/cds 9.4.x"
  last_verified: "2025-12-28"
```

**Marketplace Cross-References**:
```markdown
## Related Skills
- **sap-fiori-tools**: Use for UI layer development
- **sap-btp-cloud-platform**: Use for deployment
```

**Production Testing Requirements**:
- Test with real SAP BTP account
- Verify templates in production
- Document error catalog with SAP Notes

**Error Catalog Pattern**:
```markdown
| Error Code | Message | Solution | Source |
|------------|---------|----------|--------|
| D1_ERROR 1105 | Database error | Use batch API | SAP Note 3456789 |
```

## Step 3: Generate Manifests

```bash
./scripts/sync-plugins.sh
```

This auto-generates:
- plugin.json files (plugin-level + skill-level)
- Updates marketplace.json
- Validates all 33 skills

## Step 4: Quality Review

```bash
/review-skill <skill-name>
```

14-phase comprehensive audit covering:
- YAML validation
- Official docs verification
- Version accuracy
- Template testing
- Error catalog validation

## Step 5: Verify with Checklist

See [ONE_PAGE_CHECKLIST.md](ONE_PAGE_CHECKLIST.md) for SAP-specific quality checks.

## Step 6: Commit

```bash
git add plugins/<skill-name> .claude-plugin/marketplace.json
git commit -m "Add <skill-name> for [SAP technology]

- Provides [key features]
- SAP SDK version: <version>
- Production tested: [evidence]
"
```

---

**For Complete Guide**: See [SAP_DEVELOPMENT_GUIDE.md](SAP_DEVELOPMENT_GUIDE.md)

**Last Updated**: 2025-12-28
