# WhiteKr Plugins

Claude Code 생산성 도구 모음 (Claude Code Productivity Toolkit)

## 사전 요구 사항

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI가 설치되어 있어야 합니다.

## 설치

### 1단계: 마켓플레이스 등록

이 저장소를 Claude Code 플러그인 마켓플레이스로 등록합니다.

```bash
/plugin marketplace add WhiteKr/whitekr-claude-plugins
```

> GitHub 단축 경로(`owner/repo`) 형식을 사용합니다. 전체 Git URL도 지원됩니다:
> ```bash
> /plugin marketplace add https://github.com/WhiteKr/whitekr-claude-plugins.git
> ```

마켓플레이스를 등록하면 플러그인 카탈로그만 추가되며, 개별 플러그인은 아직 설치되지 않습니다.

### 2단계: 플러그인 설치

마켓플레이스 등록 후, 원하는 플러그인을 개별적으로 설치합니다.

**인터랙티브 UI를 통한 설치:**

```bash
/plugin
```

`Discover` 탭에서 사용 가능한 플러그인을 탐색하고 설치할 수 있습니다.

**CLI를 통한 설치:**

```bash
/plugin install <plugin-name>@whitekr-claude-plugins
```

### 3단계: 설치 확인

```bash
/plugin
```

`Installed` 탭에서 설치된 플러그인과 활성화 상태를 확인합니다.

## 설치 범위 (Scope)

플러그인 설치 시 `--scope` 옵션으로 적용 범위를 지정할 수 있습니다:

```bash
/plugin install <plugin-name>@whitekr-claude-plugins --scope <scope>
```

| 범위 | 설정 파일 | 설명 |
|------|----------|------|
| **user** (기본값) | `~/.claude/settings.json` | 모든 프로젝트에서 사용 가능한 개인 설정 |
| **project** | `.claude/settings.json` | Git을 통해 팀과 공유되는 프로젝트 설정 |
| **local** | `.claude/settings.local.json` | gitignore 처리되어 로컬에만 유지되는 설정 |

범위 우선순위: managed > local > project > user

## 플러그인 관리

**활성화/비활성화:**

```bash
# 플러그인 비활성화 (제거하지 않고 끄기)
/plugin disable <plugin-name>@whitekr-claude-plugins

# 플러그인 다시 활성화
/plugin enable <plugin-name>@whitekr-claude-plugins
```

**업데이트/제거:**

```bash
# 플러그인을 최신 버전으로 업데이트
/plugin update <plugin-name>@whitekr-claude-plugins

# 플러그인 제거
/plugin uninstall <plugin-name>@whitekr-claude-plugins
```

## 마켓플레이스 관리

```bash
# 등록된 마켓플레이스 목록 확인
/plugin marketplace list

# 마켓플레이스의 플러그인 목록 갱신
/plugin marketplace update whitekr-claude-plugins

# 마켓플레이스 등록 해제
/plugin marketplace remove whitekr-claude-plugins
```

`/plugin` 인터랙티브 UI의 `Marketplaces` 탭에서도 동일한 작업을 수행할 수 있습니다.

## 라이선스

MIT
