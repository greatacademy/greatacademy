# Development

> English | [简体中文](development.zh-CN.md)

This document explains how to set up the repository, run the checks, and run the applications locally. Conventions for code, content, tests and commits are in [AGENTS.md](../AGENTS.md).

---

## 1. Toolchain

Tool versions are pinned in `mise.toml` (Node.js, pnpm, buf). Install [mise](https://mise.jdx.dev), then:

```bash
mise install
pnpm install
```

`pnpm nx …` runs Nx through `mise exec`, so the pinned versions are used even when the shell has not activated mise.

## 2. Checks

```bash
pnpm nx run-many -t typecheck test lint    # Every project
pnpm nx affected -t typecheck test lint    # Projects affected by the working tree
pnpm nx run content:test                   # One target of one project
pnpm format                                # Biome: format and apply safe fixes
```

| Target | Tool | Notes |
| :--- | :--- | :--- |
| `typecheck` | `tsc` (TypeScript 7) | No emit; libraries are consumed as source |
| `test` | Vitest | Tests sit next to the code as `*.test.ts` |
| `lint` | Biome | Configured once in `biome.json` |

Nx caches the results of these targets in `.nx/` (ignored by git); a target reruns only when its inputs change.

## 3. Projects

| Project | Path | Purpose |
| :--- | :--- | :--- |
| `content` | `libs/content` | Content model, compiler, problem runtime, core checkers ([Content](content.md)) |
| `subject-math` | `libs/subject-math` | Mathematics checkers: LaTeX parser, exact rationals, polynomial forms ([Content §10](content.md#10-mathematics)) |
| `content-math` | `content/math` | Mathematics topics and courses |

The table grows with the repository; [Architecture §3](architecture.md#3-repository-structure) shows the target structure.

## 4. Adding a Package

1. Create the directory under `apps/`, `libs/`, `content/` or `tools/`.
2. Add `package.json` with a `@ga/<name>` package name, `"type": "module"`, `"private": true`, exact dependency versions, the `typecheck`, `test` and `lint` scripts, and `"nx": { "name": "<name>" }`.
3. Add `tsconfig.json` extending `../../tsconfig.base.json`.
4. For a library, export the source: `"exports": { ".": "./src/index.ts" }`.
5. Run `pnpm install`, then the checks.
