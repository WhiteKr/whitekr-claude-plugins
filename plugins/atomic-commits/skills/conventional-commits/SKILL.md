---
name: Conventional Commits
description: This skill should be used when the user asks to "format commit message", "conventional commit syntax", "commit types", "breaking changes format", "commit scope", or mentions conventional commits specification.
version: 1.0.0
---

Conventional Commits is a specification for standardized commit messages that enable automated tooling and clear change communication.

## Core Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Required Commit Types

**feat** - Introduces new features or capabilities
- Correlates with MINOR in semantic versioning
- Examples: new endpoints, new UI components, new functionality

**fix** - Patches bugs or defects
- Correlates with PATCH in semantic versioning
- Examples: bug fixes, corrections, error handling improvements

## Additional Common Types

**docs** - Documentation only changes

**style** - Formatting, whitespace, semicolons (no code change)

**refactor** - Code restructuring without behavior change

**perf** - Performance improvements

**test** - Adding or correcting tests

**build** - Build system or dependency changes

**ci** - CI/CD configuration changes

**chore** - Maintenance, tooling updates

## Scope

Scope provides additional context about the section of codebase affected:
- Format: `type(scope): description`
- Scope is a noun describing codebase section
- Examples: `feat(auth)`, `fix(parser)`, `docs(readme)`
- Scope is optional but recommended for clarity

### Inferring Scopes from File Paths

When determining appropriate scopes, analyze file paths:
- `src/auth/login.ts` → scope: `auth`
- `src/api/users.ts` → scope: `api`
- `docs/README.md` → scope: `readme` or omit
- `tests/unit/parser.test.ts` → scope: `parser` or `tests`

Project-specific scopes can be configured in `.claude/atomic-commits.local.md`.

## Description

- MUST immediately follow colon and space
- Use imperative mood: "add feature" not "added feature"
- Keep under 72 characters
- Start with lowercase letter
- No period at end

### Imperative Mood Examples

✓ **Correct:**
- `feat(api): add user search endpoint`
- `fix(auth): prevent token expiry race condition`
- `docs(readme): update installation instructions`

✗ **Incorrect:**
- `feat(api): added user search endpoint` (past tense)
- `fix(auth): preventing token expiry` (present continuous)
- `docs(readme): Updated installation` (capitalized, past tense)

## Body

- Optional detailed explanation
- MUST be separated from description by blank line
- Can contain multiple paragraphs
- Explain motivation, contrast with previous behavior

### Body Examples

```
feat(api): add user profile endpoint

Implements GET /api/users/:id/profile with authentication.
Includes caching layer for improved performance.
Returns user profile with preferences and settings.
```

```
fix(parser): handle empty input correctly

Previously crashed on empty strings with NullPointerException.
Now returns empty result object gracefully.
```

## Breaking Changes

Indicate breaking changes two ways:

### 1. Using `!` symbol

```
feat(api)!: remove deprecated endpoints
```

The `!` immediately after type/scope signals breaking change.

### 2. Using footer

```
feat(api): update authentication flow

BREAKING CHANGE: token format changed from JWT to opaque tokens.
Clients must update token parsing logic.
```

Breaking changes correlate with MAJOR in semantic versioning.

## Footers

- Follow git trailer format: `token: value` or `token #value`
- MUST be separated from body by blank line
- Common footers:
  - `BREAKING CHANGE:` - Describes breaking changes
  - `Refs:` - References related issues
  - `Fixes:` - Closes issues
  - `Closes:` - Closes issues

### Footer Examples

```
feat(auth): add OAuth2 login flow

Implements OAuth2 with Google and GitHub providers.

Refs: #123
Closes: #456
```

## Real-World Examples

### Feature Addition

```
feat(auth): add OAuth2 login flow

Implements OAuth2 authentication supporting Google and GitHub providers.
Includes token refresh logic and secure storage.

Refs: #123
```

### Bug Fix

```
fix(parser): handle empty input correctly

Previously crashed on empty strings. Now returns empty result gracefully.
```

### Breaking Change

```
feat(api)!: redesign user endpoint response

BREAKING CHANGE: user endpoint now returns nested profile object
instead of flat structure. Update clients to access user.profile.name
instead of user.name.
```

## Validation Rules

Essential requirements for conventional commits:

1. **Type is REQUIRED** - Must be one of: feat, fix, docs, style, refactor, perf, test, build, ci, chore (or custom types from settings)
2. **Colon and space after type/scope is REQUIRED** - `feat:` (wrong), `feat: ` (correct)
3. **Description is REQUIRED** - Cannot be empty
4. **Blank line before body is REQUIRED** (if body exists)
5. **Footer format must follow git trailer conventions** - `Token: value` format

### Validation Examples

✓ **Valid:**
```
feat(api): add user search
fix: correct null pointer
docs(readme): update guide
```

✗ **Invalid:**
```
added feature           # No type
feat add search         # No colon
feat: Add Search        # Capitalized description
feat: add search.       # Period at end
feat:add search         # No space after colon
```

## Configuration

Project-specific customization via `.claude/atomic-commits.local.md`:

```yaml
---
custom_types:
  - security    # Security vulnerability fixes
  - deps        # Dependency updates
  - i18n        # Internationalization
  - a11y        # Accessibility improvements

scopes:
  - auth
  - api
  - ui
  - db
---
```

Custom types extend standard types. Both are valid in commits.
