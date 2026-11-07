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
| `subject-english` | `libs/subject-english` | English checkers and the kit for item banks ([Content §11](content.md#11-english)) |
| `content-english` | `content/english` | English topics and courses |
| `engine` | `libs/engine` | Learning engine: frontier, FIRe, task selection, lessons, reviews, quizzes, diagnostic ([Learning Engine](learning-engine.md)) |
| `proto` | `libs/proto` | Contracts; `pnpm nx run proto:generate` after editing a `.proto` file |
| `db` | `libs/db` | Drizzle schema, migrations, data access; `pnpm nx run db:generate -- --name <change>` after editing the schema |
| `api` | `libs/api` | Connect services and the session runner, tested end to end on PGlite |
| `web` | `apps/web` | The web app: TanStack Start on Workers, better-auth, the Connect services under `/api` (§5) |
| `subject-worker` | `libs/subject-worker` | Worker entrypoints for any subject's gateway and shards |
| `math-workers` | `apps/math-workers` | The gateway and shard Workers of mathematics ([Architecture](architecture.md) §6.1); `pnpm nx run math-workers:generate` writes the manifest to `gen/`, which targets that need it do first |
| `english-workers` | `apps/english-workers` | The gateway and shard Workers of English, built in the same way |
| `nsh` | `apps/nsh` | The Native Shell app, in progress: the course list and outlines, sign-in, sign-up and the age question, the dashboard and the task player, against the web app's API (§6) |
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

- `apps/web/cloudflare.config.ts` declares the Worker: the Hyperdrive binding `HYPERDRIVE`, whose `dev.connectionString` points at the container, the secrets `BETTER_AUTH_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM` and `AI_KEYS_SECRET`, read from `.dev.vars` locally (git-ignored), the R2 bucket `GUARDIAN_FORMS`, which is local in development, and a daily Cron Trigger. With `RESEND_API_KEY` empty, password-reset and verification emails are written to the console instead of sent, so the links can be opened from the server's output.
- `pnpm nx run web:typecheck` first runs `cf workers types`, which writes the `Env` declarations to `.cloudflare/types`.
- `apps/web/vite.config.ts` runs the subject Workers alongside the web Worker in development, so `web:dev` needs nothing else. Run it through Nx, which generates the manifest first.
- `pnpm nx run web:build` builds the Worker into `.cloudflare/output`; `cf deploy` deploys it. The Worker serves `greatacademy.dev`, declared in the same file. Before deploying, add that domain to the Cloudflare account as a zone, create the Hyperdrive configuration, put its id in `cloudflare.config.ts`, create the R2 bucket `ga-guardian-forms`, and set the secrets, with `EMAIL_FROM` an address on the domain that Resend has verified.
- Deploy subjects first: `pnpm nx run math-workers:deploy` builds the Workers of mathematics and deploys the shards, then the gateway, and `pnpm nx run english-workers:deploy` does the same for English. Then deploy the web Worker.

The admin console is at `/admin`. Answer the age question as an adult on an account, then grant it the role with `pnpm nx run db:grant-admin -- <email>`. Every market starts closed to minors, so open one there before trying a child's account. To run the retention rules once while `web:dev` is up:

```bash
curl -X POST -H 'content-type: application/json' -d '{"cron":"0 3 * * *"}' 'http://localhost:5173/cdn-cgi/local/explorer/api/local/scheduled?worker=ga-web'
```

To try it: create an account, answer the age question, choose "I'm learning myself", open *Foundations of Algebra*, enroll, then take the diagnostic or skip it. The home page offers the next tasks; the progress map shows every topic's status and estimated memory.

## 6. Running the Native App

The Native Shell app calls the same Connect services as the web app, so start the web app first (§5). `mise install` provides `nsh`.

```bash
pnpm nx run nsh:dev                   # A window on this machine
```

```bash
pnpm nx run nsh:ios                   # The iOS simulator; needs Xcode
```

```bash
pnpm nx run nsh:android               # An emulator or device; needs the Android SDK and a JDK
```

- `API_URL` in `apps/nsh/lib/rpc.ts` is `http://localhost:5173` under `nsh run`, which the desktops and the iOS simulator reach directly. Android reaches it after `adb reverse tcp:5173 tcp:5173`. For an app packaged to an iPhone, start the web app with `DEV_HOST=0.0.0.0` and pass `--api-url http://<this machine's address>:5173`. An app packaged for Android cannot use plain HTTP, since Native Shell allows it only in development builds, so it needs an HTTPS server; use `nsh:android` against the dev server.
- Screens live in `apps/nsh/screens`. `nsh:test` runs the app headless, with no simulator, and `nsh:typecheck` runs `nsh check`, which also generates `.nsh/types`.
- The app signs in with a bearer token and keeps it in `Storage`. Consent, guardian tools, the progress map and the history are not in the app yet.
- Text with math and figures shows in web views, which load KaTeX and MathLive from the web app under `/embed`. `apps/web/vite.config.ts` copies them into `public/embed`, which is ignored by git. Plain text uses native views.
- `nsh test` does not run web views, so plots and the math field have no headless test.
- A page in a web view that cannot load the KaTeX stylesheet shows each formula's MathML instead. On `--target web` the page is a sandboxed frame without an origin, so `/embed` allows any origin. Some embedded browsers, such as the Claude desktop app's browser pane, refuse every request from a sandboxed frame, so check math in a regular browser or on a native target.
- A desktop window does not stay under 420 by 600 points (`lib/window.ts`): Native Shell has no minimum size for a TSX app, so the window moves back once a drag passes the limit.
- `pnpm nx run nsh:package -- --target <target>` builds an installable app, whose identifier is `dev.greatacademy.app`, with its icon from `assets/`. It uses `https://greatacademy.dev` unless `--api-url` names another server, and passes other flags, such as `--sign` and `--profile`, on to `nsh package`. Nx runs its arguments through a shell, so when a value holds parentheses, as a signing identity does, run `node scripts/package.ts` with the same flags from `apps/nsh` under `mise exec`.
