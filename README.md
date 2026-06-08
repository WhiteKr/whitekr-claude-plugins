# WhiteKr Plugins

Claude Code 플러그인 마켓플레이스 — git 워크플로우 생산성 도구 모음.

## 마켓플레이스 추가

```
/plugin marketplace add WhiteKr/whitekr-claude-plugins
```

## 플러그인

| 플러그인 | 설명 | 설치 |
|----------|------|------|
| [**commit**](https://github.com/WhiteKr/claude-plugin-commit) | 논리적 의도 단위(hunk 레벨)로만 git commit을 만드는 워크플로우. 메시지는 레포의 기존 언어/관례를 따름. | `/plugin install commit@whitekr-claude-plugins` |
| [**pull**](https://github.com/WhiteKr/claude-plugin-pull) | CWD 하위 모든 레포 + settings의 외부 워크스페이스를 병렬 fetch 후 outdated만 rebase-pull. submodule 업데이트도 보고. | `/plugin install pull@whitekr-claude-plugins` |

각 플러그인의 상세 사용법은 해당 저장소를 참고하세요.
