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
| `engine` | `libs/engine` | Learning engine: frontier, FIRe, task selection, lessons, reviews, quizzes, diagnostic ([Learning Engine](learning-engine.md)) |
| `proto` | `libs/proto` | Contracts; `pnpm nx run proto:generate` after editing a `.proto` file |
| `db` | `libs/db` | Drizzle schema, migrations, data access; `pnpm nx run db:generate -- --name <change>` after editing the schema |
| `api` | `libs/api` | Connect services and the session runner, tested end to end on PGlite |
| `web` | `apps/web` | The web app: TanStack Start on Workers, better-auth, the Connect services under `/api` (§5) |
| `subject-worker` | `libs/subject-worker` | Worker entrypoints for any subject's gateway and shards |
| `math-workers` | `apps/math-workers` | The gateway and shard Workers of mathematics ([Architecture](architecture.md) §6.1); `pnpm nx run math-workers:generate` writes the manifest to `gen/`, which targets that need it do first |
| `mobile` | `apps/mobile` | The Expo app, a skeleton for now: the course list and outlines, read from the web app's API (§6) |
| `simulate` | `tools/simulate` | Simulated students for tuning the engine: `pnpm nx run simulate:simulate` ([Learning Engine §8](learning-engine.md#8-parameters)) |
| `audit` | `tools/audit` | Content audit: outline topics missing from courses and heuristic checks (short explanations, terse solutions, missing `wrong`, missing figures and more). `pnpm nx run audit:audit -- <absolute path>` writes a Markdown report; findings are leads to review, not errors |
| `pilot` | `tools/pilot` | Pilot report for a course from a database: `DATABASE_URL=… pnpm nx run pilot:report -- --course algebra-i` ([Roadmap §3](roadmap.md#3-pilot)) |

The table grows with the repository; [Architecture §3](architecture.md#3-repository-structure) shows the target structure.

## 4. Adding a Package

1. Create the directory under `apps/`, `libs/`, `content/` or `tools/`.
2. Add `package.json` with a `@ga/<name>` package name, `"type": "module"`, `"private": true`, exact dependency versions, the `typecheck`, `test` and `lint` scripts, and `"nx": { "name": "<name>" }`.
3. Add `tsconfig.json` extending `../../tsconfig.base.json`.
4. For a library, export the source: `"exports": { ".": "./src/index.ts" }`.
5. Run `pnpm install`, then the checks.

## 5. Running the Web App

The web app runs in workerd through Vite (`cf dev`) against PostgreSQL in a container. On macOS, [OrbStack](https://orbstack.dev) provides `docker`.

```bash
docker compose up -d                  # PostgreSQL 17 on localhost:54329 (compose.yaml)
pnpm nx run db:migrate                # Apply the migrations in libs/db/drizzle
cp apps/web/.dev.vars.example apps/web/.dev.vars
pnpm nx run web:dev                   # http://localhost:5173
```

- `apps/web/cloudflare.config.ts` declares the Worker: the Hyperdrive binding `HYPERDRIVE`, whose `dev.connectionString` points at the container, and the secrets `BETTER_AUTH_SECRET`, `RESEND_API_KEY` and `EMAIL_FROM`, read from `.dev.vars` locally (git-ignored). With `RESEND_API_KEY` empty, password-reset and verification emails are written to the console instead of sent, so the links can be opened from the server's output.
- `pnpm nx run web:typecheck` first runs `cf workers types`, which writes the `Env` declarations to `.cloudflare/types`.
- `apps/web/vite.config.ts` runs the subject Workers alongside the web Worker in development, so `web:dev` needs nothing else. Run it through Nx, which generates the manifest first.
- `pnpm nx run web:build` builds the Worker into `.cloudflare/output`; `cf deploy` deploys it. Before deploying, create the Hyperdrive configuration, put its id in `cloudflare.config.ts`, and set the secret.
- Deploy subjects first: `pnpm nx run math-workers:deploy` builds the Workers of mathematics and deploys the shards, then the gateway. Then deploy the web Worker.

To try it: create an account, choose "I'm learning myself", open *Foundations of Algebra*, enroll, then take the diagnostic or skip it. The home page offers the next tasks; the progress map shows every topic's status and estimated memory.

## 6. Running the Mobile App

The Expo app calls the same Connect services as the web app, so start the web app first (§5).

```bash
pnpm nx run mobile:dev                # Metro; press i for the iOS simulator
```

- The API address is `http://localhost:5173` by default, which the iOS simulator reaches directly. On a device or the Android emulator, set `EXPO_PUBLIC_API_URL` to an address the device can reach, for example `http://192.168.1.10:5173`.
- The app uses Expo Router; screens live in `apps/mobile/src/app`. `npx expo export --platform ios` in `apps/mobile` bundles the app without a simulator, which checks that Metro resolves the workspace packages.
- The app is a skeleton (roadmap P6): signing in, the dashboard and the session player remain on the web app for now.
