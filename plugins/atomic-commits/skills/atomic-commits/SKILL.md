---
name: Atomic Commits
description: This skill should be used when the user asks to "create atomic commits", "separate commits", "commit best practices", "single responsibility commits", or mentions atomic commit philosophy.
version: 1.0.0
---

Atomic commits represent the single responsibility principle applied to version control. Each commit contains one logical change that can be described simply and reverted cleanly.

## Core Philosophy

An atomic commit is the smallest set of changes that:
1. Represents a complete unit of work
2. Has a single clear purpose
3. Can be reverted without side effects
4. Makes sense in isolation

The principle derives from: *"Gather together the things that change for the same reasons. Separate those things that change for different reasons."*

## Separation Criteria

### Single Logical Change
Each commit addresses exactly one task, feature, fix, or refactor.

**Separate These:**
- Adding authentication system
- Fixing validation bug

**Keep Together:**
- Adding authentication function
- Adding tests for authentication function (tests change for same reason as implementation)

### Different Reasons for Change
If two changes have different motivations, separate them.

**Example:**
- Refactoring for code clarity → Commit 1
- Adding new feature → Commit 2

**Rationale:** Future developers understand each independently. If feature needs reverting, refactoring can stay.

### Completeness
Each commit should represent finished work, not partial implementation.

**Good:** `feat(auth): add complete OAuth2 flow`
- Includes provider integration, token handling, error cases

**Bad:** `feat(auth): add OAuth2 (part 1 of 3)`
- Incomplete implementation
- Cannot be used or tested independently

## Practical Examples

### Scenario 1: Feature + Documentation
**Changes:** New API endpoint + README update

**Atomic Separation:**
```
Commit 1: feat(api): add user profile endpoint
Files: src/api/users.ts, tests/api/users.test.ts

Commit 2: docs: document user profile API
Files: README.md
```

**Rationale:** Code and documentation serve different purposes.

### Scenario 2: Bug Fix + Refactoring
**Atomic Separation:**
```
Commit 1: fix(parser): handle null input safely
Commit 2: refactor(parser): improve error handling structure
```

**Rationale:** Bugfix addresses immediate problem; refactoring improves maintainability. Separate concerns.

### Scenario 3: Feature with Tests
**Single Commit:**
```
feat(validation): add email format validator

Includes comprehensive tests for valid/invalid formats.
```

**Rationale:** Tests belong with implementation. They verify the feature works.

### Scenario 4: Multiple Unrelated Bugs
**Atomic Separation:**
```
Commit 1: fix(auth): prevent token expiry race condition
Commit 2: fix(profile): correct avatar rendering on mobile
Commit 3: fix(search): handle empty query gracefully
```

**Rationale:** Each bug is independent and revertable separately.

## Benefits

### Easier Code Review
Reviewers understand single-purpose commits faster.

**Good:** `refactor(auth): extract token validation logic`
- Clear focus: Is extraction done correctly?

**Bad:** `update auth system and fix bugs and add features`
- Unclear: Which changes relate to which goal?

### Better Debugging (Git Bisect)
Pinpointing regressions is straightforward with atomic commits.

### Selective Reverting
Revert specific changes without side effects.

**Scenario:** Feature A introduced bug, but Features B and C are fine.
- **Atomic:** `git revert <feature-A-commit>` - cleanly removes only Feature A.

## When to Combine vs Separate

### Combine These:
**Implementation + Tests**
```
✓ feat(validation): add email validator
  Includes tests verifying valid/invalid formats.
```

**Fix + Regression Test**
```
✓ fix(auth): prevent token expiry race
  Includes test reproducing and verifying fix.
```

### Separate These:
**Feature + Unrelated Refactor**
```
✓ Commit 1: refactor(api): extract validation logic
✓ Commit 2: feat(api): add user search endpoint
```

**Multiple Independent Fixes**
```
✓ Commit 1: fix(auth): handle token expiry
✓ Commit 2: fix(search): validate input
✓ Commit 3: fix(profile): render avatar correctly
```

**Code + Documentation**
```
✓ Commit 1: feat(api): add user profile endpoint
✓ Commit 2: docs: document user profile API
```

### The "Smell Test"
Can you describe the commit in one sentence without using "and"?

**✓ Pass:**
- "Add user authentication"
- "Fix null pointer in parser"

**✗ Fail:**
- "Add user authentication **and** fix profile bug"
- "Update API **and** refactor tests **and** fix docs"

If you need "and", consider splitting into multiple commits.

## Workflow Integration

### 1. Make Changes Incrementally
Stay focused on one task. When you notice unrelated issues, note them for later.

### 2. Stage Selectively
Use `git add -p` for partial staging when file contains unrelated changes.

```bash
git add -p src/api/users.ts
# Stage first change: y
# Stage second change: n
git commit -m "feat(api): add user search"

git add -p src/api/users.ts
# Stage second change: y
git commit -m "fix(api): validate user input"
```

### 3. Commit Frequently
Small atomic commits beat large mixed commits.

**Good rhythm:**
- Complete one logical task
- Write/update tests
- Commit
- Move to next task

### 4. Review Before Pushing
Check each commit has single clear purpose before pushing.

```bash
git log --oneline -10

# Review:
# - Does each have single clear purpose?
# - Can each be described without "and"?
```
