# Worktree Orchestrator

Task-based parallel worktree orchestration for efficient multi-branch development.

## Overview

Git worktree를 활용하여 여러 브랜치에서 동시에 작업할 수 있게 해주는 Claude Code 플러그인입니다. 백그라운드 Task를 통해 병렬 작업을 오케스트레이션하고, 논블로킹 방식으로 빠른 응답을 제공합니다.

## Requirements

- **Git**: 2.17.0 이상 (필수)
  - `git worktree remove` 명령어가 Git 2.17.0에서 추가됨
  - 버전 확인: `git --version`
- **Claude Code**: 1.0.0 이상

## Features

- **병렬 개발**: 여러 기능을 동시에 독립된 worktree에서 개발
- **백그라운드 실행**: 작업을 백그라운드 Task로 실행하여 논블로킹 응답
- **자동 브랜치 네이밍**: 작업 유형에 따른 일관된 브랜치 명명 규칙
- **진행 상황 모니터링**: 언제든지 백그라운드 작업 상태 확인 가능
- **컨텍스트 보존**: 작업 상태를 저장하여 다음 세션에서 복원

## Installation

### Option 1: Plugin Directory

```bash
claude --plugin-dir /path/to/worktree-orchestrator
```

### Option 2: Project Plugin

프로젝트 루트에 `.claude-plugin/` 디렉토리로 복사:

```bash
cp -r worktree-orchestrator/.claude-plugin /your/project/.claude-plugin
```

## Usage

### 기본 사용

```
User: "로그인 기능 구현하면서 동시에 PR #45 리뷰해줘"

Claude: 두 작업을 백그라운드에서 시작합니다...
  - feature/login → ../repo-feature-login
  - review/pr-45 → ../repo-review-pr-45
```

### 진행 상황 확인

```
User: "로그인 어떻게 돼가?"

Claude: 📦 Task: feature-login
   상태: 진행 중
   현재: useAuth 훅 구현 완료, API 연동 중...
```

### Worktree 정리

세션 종료 시 자동으로 정리 여부를 확인합니다:

```
📦 Worktree 정리

다음 worktree의 브랜치가 이미 병합되었습니다:
• ../repo-feature-login [feature/login]

정리하시겠습니까?
```

## Branch Naming Convention

| 작업 유형 | 브랜치 패턴 | Worktree 디렉토리 |
|----------|------------|------------------|
| 새 기능 | `feature/{desc}` | `../repo-feature-desc` |
| 버그 수정 | `fix/{desc}` | `../repo-fix-desc` |
| 리팩토링 | `refactor/{desc}` | `../repo-refactor-desc` |
| 핫픽스 | `hotfix/{desc}` | `../repo-hotfix-desc` |
| PR 리뷰 | `review/pr-{n}` | `../repo-review-pr-n` |

## Components

### Agent: worktree-orchestrator

병렬 작업 요청을 처리하는 메인 에이전트. 다음 트리거에 반응:
- "동시에", "병렬로", "백그라운드에서"
- "A하면서 B해줘", "A하고 동시에 B"
- PR 리뷰 + 다른 작업 조합

### Hooks

- **SessionStart**: Worktree 대시보드 표시 및 Git 버전 확인
- **Stop**: 세션 종료 전 worktree 정리 확인

### Skills

- **worktree-workflow**: Git worktree 기본 사용법 및 베스트 프랙티스
  - Task 기반 병렬 작업 패턴
  - 컨텍스트 저장/복원

## Context Preservation

작업 상태는 각 worktree의 `.claude/worktree-context.md`에 저장됩니다:

```markdown
---
last_updated: 2024-01-15T10:30:00Z
branch: feature/add-login
status: in_progress
---

# Worktree Context: feature/add-login

## 마지막 작업 파일
- src/components/Login.tsx
- src/hooks/useAuth.ts

## 진행 중인 TODO
- [x] 로그인 폼 UI 구현
- [ ] API 연동

## 다음 단계
1. auth.ts에서 login API 호출 구현
2. 에러 처리 추가
```

## Troubleshooting

### Git 버전이 너무 낮음

```
오류: Git 2.17.0 이상이 필요합니다.
현재 버전: 2.15.0
```

해결: Git을 최신 버전으로 업그레이드하세요.

### Worktree 경로 충돌

```
오류: '../repo-feature-login' 경로가 이미 존재합니다.
```

해결: 기존 worktree를 확인하고 재사용하거나 다른 이름을 사용하세요.

```bash
git worktree list
```

### 브랜치가 이미 체크아웃됨

```
오류: 'feature/login' 브랜치가 이미 다른 worktree에서 사용 중입니다.
```

해결: 해당 worktree에서 작업을 계속하거나, 먼저 정리하세요.

## License

MIT
