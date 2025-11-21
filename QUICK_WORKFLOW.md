# Quick Workflow: Build a Skill in 5 Minutes

**Goal**: Create a production-ready SAP skill from scratch as fast as possible.

**Prerequisites**: Read [START_HERE.md](START_HERE.md) once

---

## The 5-Minute Workflow

### Step 1: Create Directory (30 seconds)

```bash
cd ~/github-repos/sap-skills
mkdir -p skills/my-skill-name/
cd skills/my-skill-name/
```

**Done when**: You have a `skills/my-skill-name/` directory

---

### Step 2: Create SKILL.md with Frontmatter (2 minutes)

Create `SKILL.md` with YAML frontmatter:

```yaml
---
name: my-skill-name  # Must match directory name
description: |
  This skill provides... [write 3-5 sentences]

  Use when: [scenarios]

  Keywords: [tech, errors, use-cases]
license: MIT
---

# [Skill Name]

## Quick Start
[How to use in <5 min]

## Critical Rules
### Always Do
- [Rule 1]

### Never Do
- [Anti-pattern 1]

## Common Issues
| Issue | Solution | Source |
|-------|----------|--------|
| [Error] | [Fix] | [SAP Note/GitHub] |
```

**Done when**: SKILL.md has valid frontmatter and core sections

---

### Step 3: Create README.md with Keywords (30 seconds)

Create `README.md` with auto-trigger keywords:

```markdown
# [Skill Name]

[Brief description]

**Version**: 1.0.0 | **Last Verified**: 2025-11-21

## Auto-Trigger Keywords

**Primary**: [exact tech names]
**Secondary**: [related terms]
**Errors**: [common error messages]

## What It Does
[Brief explanation]

## When to Use
- [Scenario 1]
- [Scenario 2]
```

**Done when**: Keywords cover all ways someone might mention this skill

---

### Step 4: Add Resources (Optional)

```bash
# If you have templates
mkdir -p templates/

# If you have reference docs
mkdir -p references/

# If you have scripts
mkdir -p scripts/
```

---

### Step 5: Test (30 seconds)

Ask Claude Code to use the skill:
```
"Use the my-skill-name skill to help me with [task]"
```

**Done when**: Claude discovers and uses the skill

---

## Detailed Workflow (For First-Time Builders)

### Phase 1: Research (30-60 minutes)

**Skip if you're already an expert in the SAP domain**

1. **Check existing skills**
   ```bash
   ls skills/
   # Is this skill already covered?
   ```

2. **Find official SAP docs**
   - SAP Help Portal: https://help.sap.com/
   - SAP Developer Center: https://developers.sap.com/
   - SAP Community: https://community.sap.com/

3. **Verify SDK versions**
   - Check package.json for @sap/* packages
   - Check SAP release notes

4. **Build example project**
   - Start from scratch
   - Document every error you hit
   - Save working example

**Done when**: You have a working example and documented issues

---

### Phase 2: Create Files (5-10 minutes)

1. **Create directory**
   ```bash
   mkdir -p skills/my-skill-name/
   ```

2. **Create SKILL.md**
   - YAML frontmatter with name, description, license
   - Quick Start section
   - Critical Rules (what to do/avoid)
   - Known Issues (with SAP Note links)
   - Configuration examples
   - Common patterns

3. **Create README.md**
   - Primary (3-5): Exact tech names
   - Secondary (5-10): Related terms
   - Errors (2-5): Common error messages

4. **Add resources** (if applicable)
   - `scripts/`: Executable code
   - `references/`: Documentation
   - `assets/`: Templates, images

**Done when**: All required files created with real content

---

### Phase 3: Test (5-10 minutes)

1. **Test discovery**
   - Open Claude Code
   - Mention the technology
   - Claude should suggest your skill

2. **Test templates**
   - Copy any templates from `assets/`
   - Build a project using them
   - Verify everything works

3. **Verify checklist**
   - Open [ONE_PAGE_CHECKLIST.md](ONE_PAGE_CHECKLIST.md)
   - Check off each item
   - Fix any that fail

**Done when**: All checklist items pass

---

### Phase 4: Commit (2-5 minutes)

1. **Review changes**
   ```bash
   git diff skills/my-skill-name/
   ```

2. **Add and commit**
   ```bash
   git add skills/my-skill-name/
   git commit -m "Add my-skill-name for [use case]

   - Provides [feature]
   - Token savings: ~XX%
   - Errors prevented: X

   Production tested: [evidence]"
   ```

3. **Push**
   ```bash
   git push
   ```

**Done when**: Skill is in GitHub

---

## Time Estimates

| Task | First Time | Experienced | Notes |
|------|-----------|-------------|-------|
| Research | 30-60 min | Skip | Only needed once per domain |
| Create directory | 30 sec | 30 sec | Simple command |
| Create SKILL.md | 10-20 min | 5-10 min | Depends on complexity |
| Create README.md | 2 min | 1 min | Easy |
| Add resources | 5-10 min | 2-5 min | Optional |
| Test | 5-10 min | 2-3 min | Includes building example |
| Verify checklist | 5 min | 2 min | Scan and check |
| Commit | 2-5 min | 1-2 min | Review and push |
| **Total** | **1-2 hours** | **15-20 min** | Faster after first skill |

---

## Quick Command Reference

```bash
# Create skill directory
mkdir -p skills/my-skill-name/

# Create required files
touch skills/my-skill-name/SKILL.md
touch skills/my-skill-name/README.md

# Optional resource directories
mkdir -p skills/my-skill-name/templates/
mkdir -p skills/my-skill-name/references/
mkdir -p skills/my-skill-name/scripts/

# Commit
git add skills/my-skill-name/
git commit -m "Add my-skill-name"

# Push
git push
```

---

## Common Shortcuts

### Using Existing Skills as Templates

Copy from `skill-review` as a starting point:
```bash
cp -r skills/skill-review/ skills/my-new-skill/
# Then edit to update content
```

---

## Workflow Decision Tree

```
Do you know the SAP domain well?
  ├─ YES → Skip research, go straight to creating files
  └─ NO  → Research first (30-60 min)

Is this your first skill?
  ├─ YES → Follow detailed workflow
  └─ NO  → Use 5-minute workflow

Do you have working templates?
  ├─ YES → Add to templates/ directory
  └─ NO  → Skip templates/ for now

Do you have reference docs?
  ├─ YES → Add to references/ directory
  └─ NO  → Skip references/ for now

Do you have scripts?
  ├─ YES → Add to scripts/ directory
  └─ NO  → Skip scripts/ for now
```

---

## Quality Gates

Don't skip these, even when rushing:

1. ✅ **Frontmatter complete** (name + description + keywords)
2. ✅ **Tested** (skill actually works)
3. ✅ **No TODO markers** left in committed files
4. ✅ **Checklist verified** (at least scan it)

Everything else can be improved later.

---

## What If Something Goes Wrong?

### Skill not discovered
- Verify frontmatter YAML is valid
- Add more keywords to description

### Templates don't work
- Test them in fresh directory
- Check for hardcoded paths
- Verify package versions current

### Can't think of good keywords
- Look at errors people search for
- Check SAP Community questions
- Review official SAP docs examples

### Stuck on description
- Start with: "This skill provides..."
- Add: "Use when..."
- List: "Keywords:"

---

## Next Steps

After building your first skill:

1. Check [ONE_PAGE_CHECKLIST.md](ONE_PAGE_CHECKLIST.md)
2. Study `skills/skill-review/` for a working example
3. Build second skill (will be much faster!)

---

**Remember**: The goal is production-ready skills, not perfect documentation. Ship it, then improve it!

**Most important**: Make sure Claude can discover and use the skill. Everything else is secondary.
