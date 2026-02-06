---
description: Interactive atomic commit creation with structured user feedback
argument-hint: (no arguments)
allowed-tools: Bash(git:*), AskUserQuestion
---

Invoke the atomic-commit-assistant agent to analyze current git changes and create properly separated atomic commits.

The agent uses `AskUserQuestion` tool at every decision point to provide structured choices, ensuring the conversation never breaks and users can give feedback seamlessly.

**Interactive flow:**
1. Analyze all changes with git status/diff
2. Propose atomic commit separation → **ask user to approve, modify, or combine**
3. Review each commit individually → **ask user to approve, edit message, change type/scope, skip, or merge**
4. Execute approved commits one by one
5. Show summary → **ask user for next action (done, push, review log, commit skipped files)**

This command provides a fully interactive, step-by-step guided workflow through the entire atomic commit process.
