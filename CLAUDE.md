<coding_guidelines>
# SAP Skills - Project Context

**Repository**: https://github.com/secondsky/sap-skills
**Purpose**: Production-ready skills for SAP development with Claude Code CLI
**Version**: 2.1.0 | **Skills**: 33 | **Last Updated**: 2025-12-28

---

## What This Repository Is

33 production-tested Claude Code skills for SAP technologies: BTP, CAP, Fiori,
ABAP, Analytics, and more. Enables context-aware AI assistance for SAP development.

---

## Quick Navigation

**👋 Plugin Development Basics?** → Use official **plugin-dev skills** FIRST
  - skill-development, plugin-structure, command-development, agent-development,
    hook-development, mcp-integration, plugin-settings

**🔧 SAP-Specific Patterns?** → Read **SAP_DEVELOPMENT_GUIDE.md**
  - Marketplace infrastructure, quality assurance, SDK versioning

**✅ Verify Skill Quality?** → Use **skill-review plugin**
  - 14-phase comprehensive audit process

---

## Critical Directives

### 1. ALWAYS Use plugin-dev First

For all general plugin development tasks:
- Creating skills, commands, agents, hooks
- YAML frontmatter syntax
- Plugin directory structure
- MCP server integration
- Basic validation

### 2. ALWAYS Use skill-review for Quality Assurance

When reviewing skills in this repository:
- ✅ DO: Use `/review-skill <skill-name>` command
- ✅ DO: 14-phase comprehensive audit (Context7 verification, version checks)
- ❌ DON'T: Manually check versions/dates
- ❌ DON'T: Skip the automated review process

Located: `plugins/skill-review/`

### 3. ALWAYS Use Manual Review Process

**FORBIDDEN - Automated Refactoring**:
- Creating Python/shell scripts to refactor skills
- Using sed/awk to programmatically rewrite sections
- Batch processing without human review
- Auto-generating content via scripts

**REQUIRED - Manual Refactoring**:
- Use Read, Edit, Write tools manually
- Review each change before applying
- Human judgment for extraction decisions
- Quality control via manual review

**Why**: Skills require context-aware decisions. Automation introduces subtle
errors that break functionality.

---

## SAP-Specific Infrastructure

### Marketplace System

**Scale**: 33 plugins with coordinated versioning
**Structure**: Dual-level manifests (plugin + skill plugin.json)
**Registry**: Central marketplace.json (48KB, auto-generated)
**Cross-References**: 13 plugins reference related skills

**Categories**:
- Tooling & Development (4 skills)
- SAP BTP Platform (14 skills)
- UI Development (4 skills)
- Data & Analytics (5 skills)
- Core Technologies (6 skills)

### Automation Scripts

**sync-plugins.sh**: Orchestrates complete sync workflow
  1. Read global version from marketplace.json
  2. Generate/update all plugin.json files
  3. Regenerate marketplace.json

**generate-plugin-manifests.sh**: SKILL.md YAML → plugin.json conversion

**generate-marketplace.sh**: Aggregates 66 plugin.json into central registry

**Usage**:
```bash
./scripts/sync-plugins.sh           # Full sync
./scripts/sync-plugins.sh --dry-run # Preview changes
```

### Quality Standards

**Production Testing**: All skills tested with real SAP systems/BTP

**Version Tracking**: SAP SDK versions documented in metadata
```yaml
metadata:
  version: "2.1.0"
  cap_version: "@sap/cds 9.4.x"
  last_verified: "2025-12-28"
```

**Known Issues**: Documented with SAP Note/GitHub issue citations

**14-Phase Review**: Via skill-review plugin
  - Standards compliance (YAML validation)
  - Official docs verification (Context7/WebFetch)
  - Code examples audit
  - Dependency version checks
  - Anti-pattern detection
  - Severity classification (🔴/🟡/🟠/🟢)

---

## Maintenance Cycles

**Quarterly** (Every 3 months):
- Check SAP SDK/package versions
- Update to latest stable releases
- Re-test all skills in production
- Update last_verified dates

**When SAP Releases Major Updates**:
- Review breaking changes in release notes
- Update skill templates and examples
- Test thoroughly with new versions
- Document migration paths if needed

---

## Getting Help

**General Plugin Development**:
→ Use plugin-dev skills (official Anthropic)

**SAP-Specific Patterns**:
→ Read SAP_DEVELOPMENT_GUIDE.md

**Quality Verification**:
→ Use skill-review plugin: `/review-skill <name>`

**Issues**:
→ https://github.com/secondsky/sap-skills/issues

---

## External Resources

**Official Anthropic**:
- Plugin-dev skills: Use for all general plugin development
- Skills Spec: https://github.com/anthropics/skills/blob/main/agent_skills_spec.md

**SAP Resources**:
- SAP Developer Center: https://developers.sap.com/
- SAP Help Portal: https://help.sap.com/
- SAP Community: https://community.sap.com/

---

**Last Updated**: 2025-12-28
**Next Review**: 2026-03-28 (Quarterly)
**Maintainer**: SAP Skills Maintainers
</coding_guidelines>
