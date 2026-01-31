# Task 기반 병렬 작업 패턴 레퍼런스

## Task Tool 사용법

### 백그라운드 Task 실행

```json
{
  "description": "Feature login 구현",
  "prompt": "cd ../repo-feature-login && 로그인 기능을 구현해주세요...",
  "subagent_type": "general-purpose",
  "run_in_background": true
}
```

**핵심 파라미터**:
- `run_in_background: true` - 논블로킹 실행
- `subagent_type: "general-purpose"` - 범용 에이전트
- Tool result에 `output_file` 경로와 `task_id` 포함

### Task 상태 확인

```json
// TaskOutput 호출
{
  "task_id": "task-123",
  "block": false,
  "timeout": 5000
}
```

- `block: false` - 즉시 현재 상태 반환
- `block: true` - 완료까지 대기

## 병렬 실행 패턴

### 패턴 1: 독립 작업 병렬화

```
User: "로그인 기능 추가하고 PR #45 리뷰해줘"

[분석]
- 로그인 기능: 새 브랜치 필요, 코드 작성
- PR 리뷰: 기존 브랜치, 읽기/분석 위주
- 두 작업은 서로 의존성 없음 → 병렬 가능

[실행]
Task 1 (백그라운드): feature-login worktree에서 구현
Task 2 (백그라운드): review-pr-45 worktree에서 리뷰
```

### 패턴 2: 순차 의존 작업

```
User: "API 변경하고 그에 맞게 프론트엔드도 수정해줘"

[분석]
- API 변경: 선행 작업
- 프론트엔드 수정: API 변경 후에 가능
- 의존 관계 있음 → 순차 실행

[실행]
Task 1 (백그라운드): API 변경
[Task 1 완료 대기]
Task 2 (백그라운드): 프론트엔드 수정
```

### 패턴 3: 혼합 (병렬 + 순차)

```
User: "로그인, 회원가입 기능 추가하고 통합 테스트 작성해줘"

[분석]
- 로그인 구현: 독립
- 회원가입 구현: 독립
- 통합 테스트: 로그인, 회원가입 완료 후 가능

[실행]
Task 1 (백그라운드): 로그인 구현
Task 2 (백그라운드): 회원가입 구현
[Task 1, 2 완료 대기]
Task 3 (백그라운드): 통합 테스트 작성
```

## 진행 상황 모니터링

### 사용자 질문 패턴

| 사용자 질문 | Claude 동작 |
|------------|------------|
| "PR #45 어때?" | TaskOutput(pr-45-task-id, block=false) |
| "로그인 진행 상황" | TaskOutput(login-task-id, block=false) |
| "다 됐어?" | 모든 활성 Task의 상태 확인 |
| "뭐 하고 있어?" | 실행 중인 Task 목록 + 상태 |

### 상태 보고 형식

```
📦 Task: feature-login
   상태: 진행 중 (70%)
   현재 작업: 테스트 코드 작성
   예상 남은 작업: API 연동 테스트

📦 Task: review-pr-45
   상태: 완료 ✓
   결과: 2개 이슈 발견, 승인 보류 권장
```

## Worktree 작업 Task Prompt 템플릿

### 기능 구현

```
Working directory: {worktree_path}
Branch: {branch_name}

작업 요청: {user_request}

수행할 작업:
1. 요구사항 분석
2. 구현 계획 수립
3. 코드 작성
4. 테스트 작성 (가능한 경우)
5. 변경사항 커밋

완료 시 보고:
- 구현된 기능 요약
- 생성/수정된 파일 목록
- 추가 작업 필요 여부
```

### PR 리뷰

```
Working directory: {worktree_path}
Branch: {branch_name}

PR #{pr_number} 리뷰 수행

검토 항목:
1. 코드 품질 및 스타일
2. 로직 정확성
3. 잠재적 버그
4. 성능 이슈
5. 보안 취약점

완료 시 보고:
- 발견된 이슈 목록 (심각도 포함)
- 승인/수정요청/거부 권장
- 구체적인 피드백
```

### 버그 수정

```
Working directory: {worktree_path}
Branch: {branch_name}

버그 설명: {bug_description}

수행할 작업:
1. 버그 재현 및 원인 분석
2. 수정 방안 결정
3. 코드 수정
4. 수정 검증
5. 변경사항 커밋

완료 시 보고:
- 버그 원인
- 적용한 수정 방법
- 영향받는 코드 영역
```

## 에러 처리

### Worktree 생성 실패

```
에러: worktree 경로가 이미 존재
해결: 기존 worktree 확인 후 재사용 또는 다른 이름 사용

에러: 브랜치가 다른 worktree에서 사용 중
해결: git worktree list로 확인 후 해당 worktree 사용
```

### Task 실패

```
에러: Task 실행 중 오류 발생
해결:
1. TaskOutput으로 상세 오류 확인
2. 사용자에게 보고
3. 수동 개입 필요 여부 판단
```
