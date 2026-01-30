# Atomic Commits Plugin

Claude Code 플러그인으로 atomic commits와 conventional commits 철학을 준수하는 git 커밋 자동화 도구입니다.

## 기능

- **스마트 커밋 분석**: Git 변경사항을 분석하여 논리적으로 독립적인 변경사항 식별
- **Atomic Commits**: 변경사항을 단일 책임 원칙에 따라 여러 커밋으로 분리
- **Conventional Commits 생성**: 표준 형식(feat/fix/docs 등)에 맞는 커밋 메시지 자동 생성
- **형식 검증**: 커밋 실행 전 conventional commit 형식 자동 검증
- **자동 Staging**: 각 atomic commit에 필요한 파일만 선택적으로 stage
- **설정 가능**: 프로젝트별 커밋 타입, scope, 검증 모드 커스터마이징

## 설치

### From Source

```bash
# 플러그인 디렉토리로 이동
cd ~/.claude-plugins/

# 플러그인 복사
cp -r /path/to/atomic-commits ./atomic-commits

# Claude Code 재시작
```

### Local Testing

```bash
# 플러그인 디렉토리에서 Claude Code 실행
cc --plugin-dir /path/to/atomic-commits
```

## 사용법

코드 변경 후 `/commit` 명령 실행:

```
User: /commit

Claude: I'll analyze your changes for atomic commit separation.

Analysis Complete:
─────────────────────────────────────────────────────
Proposed Commit #1: feat(auth): add OAuth2 login flow
Files:
  - src/auth/oauth.ts
  - src/auth/providers/google.ts
  - tests/auth/oauth.test.ts

Rationale: Complete OAuth2 feature implementation

Proposed Commit #2: fix(api): handle empty query correctly
Files:
  - src/api/search.ts
  - tests/api/search.test.ts

Rationale: Independent bugfix in search functionality

Does this separation look correct? Should I proceed?
```

승인 후 각 커밋이 자동으로 생성됩니다.

### 워크플로우

1. **코드 변경** - 여러 기능/수정 작업 수행
2. **`/commit` 실행** - atomic-commit-assistant agent 호출
3. **분석 확인** - 제안된 atomic commit 분리 검토
4. **승인** - 제안이 적절하면 승인
5. **커밋 생성** - 각 atomic commit 자동 생성 및 검증
6. **완료** - Git log 확인

## 설정

프로젝트별 설정은 `.claude/atomic-commits.local.md` 파일로 관리합니다.

### 설정 파일 생성

프로젝트 루트에 `.claude/atomic-commits.local.md` 생성:

```yaml
---
# Validation mode: strict (차단), warning (경고만), off (비활성화)
validation_mode: strict

# Custom commit types (표준 타입 외 추가)
custom_types:
  - security    # 보안 취약점 수정
  - deps        # 의존성 업데이트
  - i18n        # 국제화
  - a11y        # 접근성 개선

# Project-specific scopes (파일 경로 기반 자동 제안)
scopes:
  - auth        # 인증 관련
  - api         # API 관련
  - ui          # UI 관련
  - db          # 데이터베이스 관련

# Commit message customization
co_authored_by_enabled: false        # Co-Authored-By 추가 여부
concise_mode: false                  # 간결한 커밋 메시지 모드
description_language: English        # Description 언어 (Korean, English 등)
---

# Atomic Commits Plugin Configuration

이 파일은 atomic-commits 플러그인 설정을 관리합니다.
```

### .gitignore 추가

설정 파일을 git에 커밋하지 않으려면:

```gitignore
.claude/*.local.md
```

### 기본값

설정 파일이 없으면 다음 기본값 사용:
- `validation_mode`: `warning` (경고만 표시)
- `custom_types`: 없음 (표준 타입만)
- `scopes`: 파일 경로에서 자동 추론
- `co_authored_by_enabled`: `false`
- `concise_mode`: `false`
- `description_language`: `English`

## 커밋 타입

### 표준 타입

- `feat` - 새로운 기능 추가
- `fix` - 버그 수정
- `docs` - 문서 변경
- `style` - 코드 포맷팅 (로직 변경 없음)
- `refactor` - 코드 리팩토링 (동작 변경 없음)
- `perf` - 성능 개선
- `test` - 테스트 추가/수정
- `build` - 빌드 시스템, 의존성 변경
- `ci` - CI/CD 설정 변경
- `chore` - 기타 유지보수 작업

### Breaking Changes

Breaking changes는 두 가지 방법으로 표시:

**방법 1: `!` 사용**
```
feat(api)!: redesign user endpoint
```

**방법 2: Footer 사용**
```
feat(api): update authentication

BREAKING CHANGE: token format changed
```

## 커밋 메시지 커스터마이징

### Co-Authored-By 설정

Claude의 Co-Authored-By 라인 추가 여부를 제어합니다:

```yaml
co_authored_by_enabled: false  # 기본값: 추가하지 않음
```

- `false` (기본값): Co-Authored-By 라인 제거
- `true`: Co-Authored-By 라인 추가

### Concise Mode

커밋 메시지 본문 생성 여부를 제어합니다:

```yaml
concise_mode: false  # 기본값: 필요시 본문 추가
```

- `false` (기본값): 상세한 설명이 필요한 경우 본문 포함
- `true`: 제목만 작성 (간결한 형식)

### Description Language

Commit description의 언어를 설정합니다:

```yaml
description_language: English  # 기본값
```

**지원 언어:**
- `English`: 영어 (conventional commits 표준)
- `Korean`: 한국어
- `Japanese`: 일본어
- 기타 모든 자연어 지원

**예시 (Korean):**
```
feat(auth): OAuth2 로그인 흐름 추가
fix(api): 사용자 조회 버그 수정
docs(readme): 설치 가이드 업데이트
```

**주의:** Type과 scope는 항상 영어로 유지 (conventional commits 표준)

## 트러블슈팅

### 커밋이 차단됨

**문제:** Strict 모드에서 형식 오류로 커밋 차단

**해결:**
1. 에러 메시지 확인
2. Conventional commits 형식 따르기
3. 또는 `.claude/atomic-commits.local.md`에서 `validation_mode: warning` 설정

### Scope를 모르겠음

**문제:** 어떤 scope를 사용해야 할지 모름

**해결:**
1. Scope 생략 가능: `feat: add feature`
2. 파일 경로 기반 추론 활용
3. `.claude/atomic-commits.local.md`에 프로젝트 scopes 정의

### 너무 많은 파일 변경

**문제:** 변경된 파일이 너무 많아 분리가 어려움

**해결:**
1. Agent가 논리적으로 그룹화
2. 관련 파일끼리 묶어서 제안
3. 필요시 제안 조정 요청

### 부분 파일 staging이 필요

**문제:** 하나의 파일에 여러 논리적 변경이 있음

**해결:**
1. Agent가 `git add -p` 수동 사용 안내
2. Hunk 단위로 선택적 staging
3. 각 hunk를 별도 커밋으로 생성

## 라이선스

MIT License

## 기여

이슈 및 PR 환영합니다!

## 작성자

WhiteKr (white_kr@icloud.com)
