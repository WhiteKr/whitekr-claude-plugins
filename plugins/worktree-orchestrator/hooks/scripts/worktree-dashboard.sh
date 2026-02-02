#!/bin/bash

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree &>/dev/null; then
    exit 0
fi

# Check git version (minimum 2.17.0 required)
GIT_VERSION=$(git --version | sed 's/git version //')
MAJOR=$(echo "$GIT_VERSION" | cut -d. -f1)
MINOR=$(echo "$GIT_VERSION" | cut -d. -f2)

if [ "$MAJOR" -lt 2 ] || ([ "$MAJOR" -eq 2 ] && [ "$MINOR" -lt 17 ]); then
    echo "⚠️ Git 버전 경고"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "worktree-orchestrator는 Git 2.17.0 이상이 필요합니다."
    echo "현재 버전: $GIT_VERSION"
    echo ""
    echo "git worktree remove 명령어가 Git 2.17.0에서 추가되었습니다."
    echo "Git을 업그레이드하세요: https://git-scm.com/downloads"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    exit 0
fi

# Get worktree list
WORKTREE_LIST=$(git worktree list)
WORKTREE_COUNT=$(echo "$WORKTREE_LIST" | wc -l)

# Skip if only one worktree
if [ "$WORKTREE_COUNT" -le 1 ]; then
    exit 0
fi

# Get current directory
CURRENT_DIR=$(pwd)
CURRENT_BASENAME=$(basename "$CURRENT_DIR")

echo "📊 Worktree Dashboard"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📁 Active Worktrees ($WORKTREE_COUNT)"

while IFS= read -r line; do
    WORKTREE_PATH=$(echo "$line" | awk '{print $1}')
    WORKTREE_BRANCH=$(echo "$line" | grep -oP '\[.*?\]' | head -1)
    WORKTREE_BASENAME=$(basename "$WORKTREE_PATH")

    if [ "$WORKTREE_PATH" = "$CURRENT_DIR" ]; then
        printf "  • %-30s %s  ← 현재\n" "." "$WORKTREE_BRANCH"
    else
        printf "  • %-30s %s\n" "../$WORKTREE_BASENAME" "$WORKTREE_BRANCH"
    fi
done <<< "$WORKTREE_LIST"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
