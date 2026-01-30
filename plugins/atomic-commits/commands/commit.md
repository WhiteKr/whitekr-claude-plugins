---
description: Interactive atomic commit creation with conventional format
argument-hint: (no arguments)
allowed-tools: Bash(git:*)
---

Invoke the atomic-commit-assistant agent to analyze current git changes and create properly separated atomic commits.

The agent will:
1. Analyze all unstaged changes with git status/diff
2. Identify logical atomic commit separations
3. Generate conventional commit messages
4. Request confirmation before committing
5. Stage and commit each atomic unit separately

This command provides interactive guidance through the entire atomic commit workflow.
