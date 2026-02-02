# Git Worktree Workflow

Git worktree를 활용한 효율적인 멀티 브랜치 병렬 작업 가이드

## Git Worktree 개념

Git worktree는 하나의 Git 저장소에서 여러 작업 디렉토리를 동시에 유지할 수 있게 해주는 기능입니다. 각 worktree는 독립된 브랜치를 체크아웃하여 병렬 작업이 가능합니다.

### 핵심 명령어

```bash
# Worktree 목록 확인
git worktree list

# 새 worktree 생성 (새 브랜치)
git worktree add <path> -b <branch-name>

# 기존 브랜치로 worktree 생성
git worktree add <path> <existing-branch>

# Worktree 제거
git worktree remove <path>

# 연결 끊긴 worktree 정리
git worktree prune
```

## 자동 브랜치 네이밍 컨벤션

| 작업 유형 | 브랜치 패턴 | Worktree 디렉토리 |
|----------|------------|------------------|
| 새 기능 | `feature/{desc}` | `../repo-feature-desc` |
| 버그 수정 | `fix/{desc}` | `../repo-fix-desc` |
| 리팩토링 | `refactor/{desc}` | `../repo-refactor-desc` |
| 핫픽스 | `hotfix/{desc}` | `../repo-hotfix-desc` |
| PR 리뷰 | `review/pr-{n}` | `../repo-review-pr-n` |

**네이밍 규칙**:
- 소문자 사용
- 공백 대신 하이픈(-) 사용
- 간결하고 설명적인 이름 (예: `feature/add-login`, `fix/null-pointer`)

## Task 기반 병렬 작업 패턴

### 기본 패턴: 백그라운드 Task 실행

```
[작업 시작]
1. worktree 생성: git worktree add ../repo-feature-x -b feature/x
2. Task 실행 (run_in_background: true):
   - prompt: "cd ../repo-feature-x && 작업 수행"
   - subagent_type: "general-purpose"
3. 즉시 사용자에게 응답 (논블로킹)

[진행 상황 확인]
User: "feature-x 어때?"
Claude: TaskOutput(task_id, block=false) → 상태 확인 → 보고

[완료 시]
- 결과 종합 보고
- worktree 정리 여부 질문
```

### 병렬 실행 패턴

여러 독립 작업을 동시에 실행할 때:

```
[분석]
- 작업 A: feature-login → worktree 필요
- 작업 B: review-pr-45 → worktree 필요
- A와 B는 독립적 → 병렬 가능

[실행]
1. worktree A 생성
2. worktree B 생성
3. Task A 시작 (백그라운드)
4. Task B 시작 (백그라운드)
5. 즉시 응답: "두 작업을 백그라운드에서 시작했습니다."

[모니터링]
- 사용자가 언제든 진행 상황 질문 가능
- TaskOutput으로 각 Task 상태 확인
```

## Worktree 정리 Best Practices

### 정리 시점
- 브랜치가 main/master에 병합된 후
- PR이 완료된 후
- 실험적 작업이 폐기된 후

### 정리 절차
```bash
# 1. 변경사항 확인 (미커밋 변경 있는지)
cd <worktree-path>
git status

# 2. 필요시 커밋 또는 스태시
git add . && git commit -m "WIP: save progress"
# 또는
git stash

# 3. 메인 저장소로 이동
cd <main-repo>

# 4. worktree 제거
git worktree remove <worktree-path>

# 5. 브랜치도 삭제하려면
git branch -d <branch-name>
```

### 주의사항
- 미커밋 변경사항이 있으면 경고
- 원격에 푸시되지 않은 커밋이 있으면 경고
- 강제 삭제 전 항상 사용자 확인

## 컨텍스트 저장/복원 패턴

### 저장 위치
`{worktree}/.claude/worktree-context.md`

### 저장 내용 예시
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
- src/api/auth.ts

## 진행 중인 TODO
- [x] 로그인 폼 UI 구현
- [x] useAuth 훅 작성
- [ ] API 연동
- [ ] 에러 처리

## 작업 요약
로그인 기능 구현 중. UI와 훅은 완료, API 연동 작업 필요.

## 다음 단계
1. auth.ts에서 login API 호출 구현
2. 에러 처리 추가
3. 테스트 작성
```

### 복원 시 동작
worktree로 돌아왔을 때:
1. context 파일 존재 확인
2. 마지막 작업 상태 안내
3. 다음 단계 제안
