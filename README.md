# WhiteKr Plugins

Claude Code 생산성 도구 모음 (Claude Code Productivity Toolkit)

## 포함된 플러그인

| 플러그인 | 버전 | 설명 |
|---------|------|------|
| **atomic-commits** | 1.0.1 | Atomic commits + Conventional commits 규칙에 따른 자동 커밋 분리 및 생성 |
| **worktree-orchestrator** | 0.1.2 | Git worktree 기반 병렬 멀티브랜치 개발 오케스트레이션 |

## 설치

### 사전 요구 사항

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI가 설치되어 있어야 합니다.
- Git 2.17.0 이상 (worktree-orchestrator 사용 시)

### 1단계: 마켓플레이스 등록

먼저 이 저장소를 Claude Code 플러그인 마켓플레이스로 등록합니다.

```bash
/plugin marketplace add WhiteKr/whitekr-claude-plugins
```

> GitHub 단축 경로(`owner/repo`) 형식을 사용합니다. 전체 Git URL도 지원됩니다:
> ```bash
> /plugin marketplace add https://github.com/WhiteKr/whitekr-claude-plugins.git
> ```

등록된 마켓플레이스 목록을 확인하려면:

```bash
/plugin marketplace list
```

### 2단계: 플러그인 설치

마켓플레이스 등록 후, 원하는 플러그인을 설치합니다.

**모든 플러그인 탐색 (인터랙티브 UI):**

```bash
/plugin
```

`Discover` 탭에서 사용 가능한 플러그인을 확인하고 설치할 수 있습니다.

**개별 플러그인 설치:**

```bash
# atomic-commits 플러그인 설치
/plugin install atomic-commits@whitekr-claude-plugins

# worktree-orchestrator 플러그인 설치
/plugin install worktree-orchestrator@whitekr-claude-plugins
```

### 3단계: 설치 확인

```bash
/plugin
```

`Installed` 탭에서 설치된 플러그인 목록을 확인합니다.

### 설치 범위 (Scope)

플러그인 설치 시 적용 범위를 선택할 수 있습니다:

| 범위 | 설명 | 적용 대상 |
|------|------|----------|
| **User** (기본값) | 사용자 전체 환경에 설치 | 모든 프로젝트에서 사용 가능 |
| **Project** | `.claude/settings.json`에 저장 | 프로젝트 협업자와 공유됨 |
| **Local** | 로컬 머신에만 저장 | 현재 사용자, 현재 저장소에서만 사용 |

## 사용법

### Atomic Commits

변경 사항을 논리적 단위로 자동 분리하고, Conventional Commits 형식으로 커밋합니다.

```bash
# /commit 명령어로 실행
/commit
```

또는 자연어로 요청:

```
커밋을 만들어줘
atomic commits로 분리해서 커밋해줘
```

**주요 기능:**
- `git diff` 분석을 통한 변경 사항 자동 분류
- Hunk 단위의 세밀한 스테이징 지원
- 인터랙티브 리뷰: 각 커밋 단위마다 사용자 확인
- Conventional Commits 형식 (`feat`, `fix`, `docs`, `refactor` 등) 자동 생성

**프로젝트별 설정:**

`.claude/atomic-commits.local.md` 파일을 생성하여 프로젝트별 설정을 관리할 수 있습니다:

```yaml
---
validation_mode: warning    # strict | warning | off
description_language: Korean
concise_mode: false
---
```

### Worktree Orchestrator

Git worktree를 활용하여 여러 작업을 병렬로 수행합니다.

자연어로 요청:

```
feature X 구현하면서 동시에 PR Y 리뷰해줘
로그인 기능 추가하면서 버그 수정도 병렬로 해줘
```

**주요 기능:**
- 작업 단위 자동 분석 및 worktree 생성
- 백그라운드 실행으로 비차단(non-blocking) 작업 처리
- 세션 시작 시 활성 worktree 대시보드 표시
- 작업 타입별 자동 브랜치 네이밍 (`feature/`, `fix/`, `refactor/` 등)

## 플러그인 관리

```bash
# 플러그인 비활성화 (제거하지 않고 끄기)
/plugin disable atomic-commits@whitekr-claude-plugins

# 플러그인 다시 활성화
/plugin enable atomic-commits@whitekr-claude-plugins

# 플러그인 제거
/plugin uninstall atomic-commits@whitekr-claude-plugins

# 마켓플레이스 업데이트 (새 버전 확인)
/plugin marketplace update whitekr-claude-plugins

# 마켓플레이스 제거
/plugin marketplace remove whitekr-claude-plugins
```

## 프로젝트 구조

```
whitekr-claude-plugins/
├── .claude-plugin/
│   └── marketplace.json          # 마켓플레이스 매니페스트
├── plugins/
│   ├── atomic-commits/           # Atomic Commits 플러그인
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json       # 플러그인 매니페스트
│   │   ├── agents/               # 에이전트 정의
│   │   ├── commands/             # /commit 명령어
│   │   ├── hooks/                # 커밋 메시지 검증 훅
│   │   └── skills/               # 참조 지식 (atomic-commits, conventional-commits)
│   └── worktree-orchestrator/    # Worktree Orchestrator 플러그인
│       ├── .claude-plugin/
│       │   └── plugin.json
│       ├── agents/               # 오케스트레이터 에이전트
│       ├── hooks/                # 세션 시작/종료 훅
│       └── skills/               # 워크트리 워크플로우 참조
└── README.md
```

## 라이선스

MIT
