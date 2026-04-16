---
description: how to update process docs after making changes
---

# Update Process Documentation

After **every** set of changes to the Space Museum project, update the following files:

// turbo-all

1. **`CHANGELOG.md`** — Add a new dated entry (`## [YYYY-MM-DD] - Title`) listing all changes made. Each bullet should describe the change and include a `**Reason**:` if the rationale isn't obvious.

2. **`process/QA_log.md`** — If the changes involved any QA audit, bug fixes, or testing, add a new numbered section under a new `## Execution Cycle` heading. Include:
   - **Status**: `[PASS]`, `[PASS — Issues Resolved]`, or `[FAIL — Pending]`
   - **Details**: Bullet points for each finding, with **Issue logged** and **Resolution** sub-items.
   - **Sign-off**: Summary line.

3. **`process/SPRINT_log.md`** — If the changes constitute a meaningful sprint (multiple related tasks), add a new `## Sprint N` entry with:
   - **Objective**: One sentence describing the sprint goal.
   - **Milestones Completed**: Numbered list of accomplishments.
   - **Retrospective**: `Successes` and `Friction` notes.

4. **`process/CURATOR_review.md`** — Only update if exhibit content, narrative, or educational value was significantly changed (e.g., new planet data, restructured information architecture).

### When to skip:
- Tiny cosmetic fixes (single typo, minor spacing) don't need a full sprint log entry — just a changelog bullet is sufficient.
- If only one file was touched for a quick fix, changelog alone is fine.
