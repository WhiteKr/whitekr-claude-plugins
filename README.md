# WhiteKr Plugins

Claude Code 플러그인 마켓플레이스 — git 워크플로우와 터미널 출력용 생산성 도구 모음.

## 마켓플레이스 추가

```
/plugin marketplace add WhiteKr/whitekr-claude-plugins
```

## 플러그인

| 플러그인 | 버전 | 설명 | 설치 |
|----------|------|------|------|
| [**mermaid**](https://github.com/WhiteKr/claude-plugin-mermaid) | 0.2.1 | 응답의 ```` ```mermaid ```` 블록을 다이어그램으로 바꿔 그림 (`/show-me` 출력 등). 터미널은 유니코드 박스(lovely-mermaid), 데스크톱·VS Code·모바일은 라이트/다크 벡터 SVG(beautiful-mermaid + dagre). 오프라인 동작. | `/plugin install mermaid@whitekr-claude-plugins` |
| [**context-meter**](https://github.com/WhiteKr/claude-plugin-context-meter) | 0.2.3 | 입력창에 한 줄 미터를 그려 콘텍스트 저하 구간과 5시간·7일·지출 한도 사용량을 보여 줌. 다음 구간, 자동 압축, 한도 소진까지 남은 양도 예측. | `/plugin install context-meter@whitekr-claude-plugins` |
| [**secret-guard**](https://github.com/WhiteKr/claude-plugin-secret-guard) | 0.1.9 | 코드, 도구 출력, 대화 속 키와 토큰을 모델에게는 `<<secret:…>>` 자리표시자로 가리고, Edit·Write·Bash가 실행될 때만 실제 값으로 바꿔 넣음. 값은 OS 키체인에 보관해 다음 세션에서도 쓰고, Bash에는 명령줄 대신 임시 파일로 전달. 답변의 값은 서식을 유지한 채 누르면 복사되는 링크로 표시. | `/plugin install secret-guard@whitekr-claude-plugins` |
| [**clawd-buddy**](https://github.com/WhiteKr/claude-plugin-clawd-buddy) | 0.2.0 | 데스크톱 입력창 위에 픽셀 게 Clawd를 띄움. 쉬면 졸고, 생각하면 걷고, 파일을 읽으면 책을, 검색하면 돋보기를, 편집하거나 명령을 실행하면 노트북을 꺼내며, 턴이 끝나면 꽃게춤을 춘 뒤 졺. | `/plugin install clawd-buddy@whitekr-claude-plugins` |

각 플러그인의 상세 사용법은 해당 저장소를 참고하세요.

## 개발

각 플러그인은 자체 저장소(`claude-plugin-mermaid`, `claude-plugin-context-meter`, `claude-plugin-secret-guard`, `claude-plugin-clawd-buddy`)에서 배포되며, 이 저장소에는 submodule 로 링크돼 있다. 사용자는 마켓플레이스 `source`(각 플러그인 저장소의 기본 브랜치)에서 설치하므로 여기의 submodule 핀은 개발 편의용이다. 플러그인 저장소에 새 커밋을 올린 뒤에는 `git submodule update --remote` 로 핀을 옮기고 `plugins` 변경을 commit 해야 vendored 사본이 배포본과 어긋나지 않는다.

`scripts/check-consistency.mjs` 는 `marketplace.json`, `.gitmodules`, 각 플러그인의 `plugin.json` 버전, 위 README 표가 서로 맞는지 검사한다. CI(`.github/workflows/validate.yml`)는 push·PR마다 이 스크립트와 `claude plugin validate --strict` 를 실행한다. 핀을 옮긴 뒤 README 표의 버전도 함께 고쳐야 CI가 통과한다.
