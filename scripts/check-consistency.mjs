#!/usr/bin/env node
// marketplace.json, .gitmodules, 각 플러그인의 plugin.json, README 버전 표가 서로 맞는지 검사한다.
// submodule 이 체크아웃된 상태에서 실행해야 한다 (git submodule update --init).
import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

const errors = [];
const warnings = [];

const marketplace = JSON.parse(readFileSync(".claude-plugin/marketplace.json", "utf8"));
const readme = readFileSync("README.md", "utf8");

// .gitmodules: path -> url
const submodules = new Map();
const gitmodules = execFileSync("git", ["config", "-f", ".gitmodules", "--get-regexp", "^submodule\\..*\\.(path|url)$"], { encoding: "utf8" });
const byName = {};
for (const line of gitmodules.trim().split("\n")) {
  const [key, value] = line.split(" ");
  const [, name, field] = key.match(/^submodule\.(.+)\.(path|url)$/);
  (byName[name] ??= {})[field] = value;
}
for (const { path, url } of Object.values(byName)) submodules.set(path, url);

// README 표의 행: | [**name**](...) | version | ...
const readmeVersions = new Map();
for (const m of readme.matchAll(/^\|\s*\[\*\*([^*]+)\*\*\]\([^)]*\)\s*\|\s*([^|]+?)\s*\|/gm)) {
  readmeVersions.set(m[1], m[2]);
}

const listed = new Set();
for (const plugin of marketplace.plugins) {
  const { name } = plugin;
  const path = `plugins/${name}`;
  listed.add(path);

  const url = plugin.source?.url;
  if (submodules.get(path) === undefined) {
    errors.push(`${name}: .gitmodules 에 ${path} submodule 이 없음`);
  } else if (url && submodules.get(path) !== url) {
    errors.push(`${name}: marketplace source.url (${url}) 과 .gitmodules url (${submodules.get(path)}) 이 다름`);
  }

  const manifestPath = `${path}/.claude-plugin/plugin.json`;
  if (!existsSync(manifestPath)) {
    errors.push(`${name}: ${manifestPath} 없음 (submodule 체크아웃 확인)`);
    continue;
  }
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  if (manifest.name !== name) {
    errors.push(`${name}: plugin.json name 이 "${manifest.name}"`);
  }

  const readmeVersion = readmeVersions.get(name);
  if (readmeVersion === undefined) {
    errors.push(`${name}: README 플러그인 표에 행이 없음`);
  } else if (readmeVersion !== manifest.version) {
    errors.push(`${name}: README 버전 ${readmeVersion} ≠ plugin.json 버전 ${manifest.version}`);
  }

  // 핀이 플러그인 저장소 기본 브랜치보다 뒤처졌는지는 이 저장소 변경과 무관하게 생기므로 경고만 한다.
  try {
    execFileSync("git", ["-C", path, "fetch", "--quiet", "origin", "HEAD"], { stdio: "ignore" });
    const behind = execFileSync("git", ["-C", path, "rev-list", "--count", "HEAD..FETCH_HEAD"], { encoding: "utf8" }).trim();
    if (behind !== "0") warnings.push(`${name}: submodule 핀이 원격 기본 브랜치보다 ${behind} 커밋 뒤처짐`);
  } catch {
    warnings.push(`${name}: 원격 기본 브랜치를 fetch 하지 못해 핀 비교를 건너뜀`);
  }
}

for (const path of submodules.keys()) {
  if (!listed.has(path)) errors.push(`${path}: submodule 이 marketplace.json 에 등록되지 않음`);
}
for (const name of readmeVersions.keys()) {
  if (!listed.has(`plugins/${name}`)) errors.push(`${name}: README 표에 있지만 marketplace.json 에 없음`);
}

const ci = process.env.GITHUB_ACTIONS === "true";
for (const w of warnings) console.log(ci ? `::warning::${w}` : `warning: ${w}`);
for (const e of errors) console.log(ci ? `::error::${e}` : `error: ${e}`);
if (errors.length) process.exit(1);
console.log(`OK: ${marketplace.plugins.length}개 플러그인 일치`);
