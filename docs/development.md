# Development

> English | [简体中文](development.zh-CN.md)

This document explains how to set up the repository, run the checks, and run the applications locally. Conventions for code, content, tests and commits are in [AGENTS.md](../AGENTS.md).

---

## 1. Toolchain

Tool versions are pinned in `mise.toml` (Node.js, pnpm, buf, and Python and uv for the voice service). Install [mise](https://mise.jdx.dev), then the commands below. The native app needs Native Shell from its main branch, which mise does not provide (§6).

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

The voice service (`apps/voice`) is the one Python project: its `typecheck`, `test` and `lint` scripts run pyright, pytest, and `ruff check` with `ruff format --check` through `uv run`, configured in its `pyproject.toml` (§7).

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
| `nsh` | `apps/nsh` | The Native Shell app: the welcome page, sign-in, sign-up and the age question; the Learn, Progress, Courses and Me tabs; account settings (profile, weekly goals, leagues, password, guardians); course outlines, the progress map, the history and the task player; privacy, consent and the guardian pages; against the web app's API (§6) |
| `simulate` | `tools/simulate` | Simulated students for tuning the engine: `pnpm nx run simulate:simulate` ([Learning Engine §8](learning-engine.md#8-parameters)) |
| `audit` | `tools/audit` | Content audit: outline topics missing from courses and heuristic checks (short explanations, terse solutions, missing `wrong`, missing figures, a right option that is usually the longest and more). `pnpm nx run audit:audit -- <absolute path>` writes a Markdown report; findings are leads to review, not errors. `pnpm nx run audit:stats -- <subject> [path] [seeds]` counts a subject's courses, topics, knowledge points, passages and conversations, samples each knowledge point for its distinct problems, and lists the knowledge points below the depth content/english/PROGRESS.md asks and the topics of one knowledge point |
| `voice` | `apps/voice` | The voice service for live conversation in English, in Python on Pipecat; tested with faked speech services and a faked web Worker (§7) |
| `pilot` | `tools/pilot` | Pilot report for a course from a database: `DATABASE_URL=… pnpm nx run pilot:report -- --course algebra-i` ([Roadmap §3](roadmap.md#3-pilot)) |
| `calibrate` | `tools/calibrate` | Calibration of one route on one criterion: `DATABASE_URL=… AI_KEYS_SECRET=… pnpm nx run calibrate:calibrate -- --criterion w4-topic-sentence@1 --provider <id> --model <model> --prompt writing-1 --set scored.jsonl`. Each line of the set is `{id, task: {prompt, modelAnswer, source?}, text, scores: {"<id@version>": [first, second]}}`, the two people's yes or no. It records the calibration, passed or not, and prints a report naming texts by id ([English Development Plan §4](english-development-plan.md#4-stage-2-reading-and-writing)) |

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
docker compose up -d                  # PostgreSQL 18 on localhost:54329 (compose.yaml)
pnpm nx run db:migrate                # Apply the migrations in libs/db/drizzle
cp apps/web/.dev.vars.example apps/web/.dev.vars
pnpm nx run web:dev                   # http://localhost:5173
```

- `apps/web/cloudflare.config.ts` declares the Worker: the Hyperdrive binding `HYPERDRIVE`, whose `dev.connectionString` points at the container, the secrets `BETTER_AUTH_SECRET`, `EMAIL_PROVIDER`, `RESEND_API_KEY`, `EMAIL_FROM` and `AI_KEYS_SECRET`, the `send_email` binding `EMAIL` of Cloudflare Email Service, read from `.dev.vars` locally (git-ignored), the R2 bucket `GUARDIAN_FORMS`, which is local in development, and a daily Cron Trigger. Without `STRIPE_SECRET_KEY` billing is off and anyone can study; to try it, put a Stripe test account's keys in `.dev.vars` and forward its events with `stripe listen --forward-to localhost:5173/api/stripe`, whose signing secret is `STRIPE_WEBHOOK_SECRET` ([Billing](billing.md) §10). `EMAIL_PROVIDER` is `resend`, `cloudflare` or `cloudflare,resend`; with it and `RESEND_API_KEY` both empty, password-reset and verification emails are written to the console instead of sent, so the links can be opened from the server's output. The binding `EMAIL` is remote in development too, so with `cloudflare` the local server sends real email; the sending subdomain `mail.greatacademy.dev` is onboarded with `cf email-sending subdomains create`, which wrote its bounce MX, SPF, DKIM and DMARC records, and `cf email-sending subdomains dns status` checks them.
- `pnpm nx run web:typecheck` first runs `cf workers types`, which writes the `Env` declarations to `.cloudflare/types`.
- `apps/web/vite.config.ts` runs the subject Workers alongside the web Worker in development, so `web:dev` needs nothing else. Run it through Nx, which generates the manifest first.
- `pnpm nx run web:build` builds the Worker into `.cloudflare/output`; `cf deploy` deploys it. The Worker serves `greatacademy.dev`, declared in the same file. Before deploying, add that domain to the Cloudflare account as a zone, create the Hyperdrive configuration, put its id in `cloudflare.config.ts`, create the R2 bucket `ga-guardian-forms`, and set the secrets, with `EMAIL_FROM` an address on the domain that each service `EMAIL_PROVIDER` lists has verified: onboard the domain to Cloudflare Email Service (on Workers Paid) for `cloudflare`, verify it in Resend for `resend`, and with both, keep one SPF record that names both services.
- Deploy subjects first: `pnpm nx run math-workers:deploy` builds the Workers of mathematics and deploys the shards, then the gateway, and `pnpm nx run english-workers:deploy` does the same for English. Then deploy the web Worker.

The admin console is at `/admin`. Answer the age question as an adult on an account, then grant it the role with `pnpm nx run db:grant-admin -- <email>`. Every market starts closed to minors, so open one there before trying a child's account. To run the retention rules once while `web:dev` is up:

```bash
curl -X POST -H 'content-type: application/json' -d '{"cron":"0 3 * * *"}' 'http://localhost:5173/cdn-cgi/local/explorer/api/local/scheduled?worker=ga-web'
```

To try it: create an account, answer the age question, choose "I'm learning myself", choose *Foundations of Algebra*, then take the diagnostic or skip it; a diagnostic that asked something ends with a report to keep the course or take the one recommended. The home page offers the next tasks; the progress map shows every topic's status and estimated memory.

## 6. Running the Native App

The Native Shell app calls the same Connect services as the web app, so start the web app first (§5). It uses Native Shell from the `greatacademy` branch of the project's fork, [greatacademy/nsh](https://github.com/greatacademy/nsh): upstream's main and the app's own fixes. The app's Rust crate, `apps/nsh/native/store` (StoreKit for in-app purchases, imported as `ga/store`), pins a commit of that branch, and `nsh` builds each platform's host from it, which needs Git, Rust and Xcode. Build the `nsh` command from the same commit:

```bash
git clone --branch greatacademy https://github.com/greatacademy/nsh.git ~/.nsh/source
```

```bash
cd ~/.nsh/source && cargo build --release --locked -p nsh-cli && mkdir -p ~/.nsh/bin ~/.local/bin && ln -sf ~/.nsh/source/target/release/nsh ~/.nsh/bin/nsh && ln -sf ~/.nsh/bin/nsh ~/.local/bin/nsh
```

To update, pull the branch there, build again, and move `rev` in the app's crates, `apps/nsh/native/store/Cargo.toml` and `apps/nsh/native/voice/Cargo.toml`, to the same commit. The first run or package for each platform compiles that host with the app's crates, which takes several minutes; later ones reuse it. Build one platform at a time, since the builds share one directory and wait for each other.

```bash
pnpm nx run nsh:dev                   # A window on this machine
```

```bash
pnpm nx run nsh:ios                   # The iOS simulator; needs Xcode
```

```bash
pnpm nx run nsh:android               # An emulator or device; needs the Android SDK and a JDK
```

- `API_URL` in `apps/nsh/lib/rpc.ts` is `http://localhost:5173` under `nsh run`, which the desktops and the iOS simulator reach directly. Android reaches it after `adb reverse tcp:5173 tcp:5173`. For an app packaged to an iPhone, start the web app with `DEV_HOST=0.0.0.0` and pass `--api-url http://<this machine's address>:5173`. The same works for Android: Native Shell allows plain HTTP only in development builds, so the packaging script allows it when `--api-url` starts with `http://`.
- Screens live in `apps/nsh/screens`. `nsh:test` runs the app headless, with no simulator, and `nsh:typecheck` runs `nsh check`, which also generates `.nsh/types`.
- The app signs in with a bearer token and keeps it in `Storage`.
- The app opens on its mark (`screens/Launch.tsx`), kept until the first page can be drawn whole (for someone signed in, the Learn tab's first answer) or for at most two seconds, then the mark grows as it fades into the page; the system tab bar comes as it leaves.
- A signed-in account sees four tabs, Learn, Progress, Courses and Me (`screens/Home.tsx`). Learn shows the weekly goals as the web's learn page does, in a column beside the tasks in a window 1024 points wide or more; Me opens the account's own pages (`screens/Account.tsx`: profile and email verification, weekly goals, league username and taking part, changing the password), lists the guardians with a way to remove them, and deletes the account, so nothing needs the web. The tabs sit in a tab bar on phones, which shows only while the tabs do: the system's on iOS (Liquid Glass on iOS 26 and later), and on Android a pill of glass the app draws (`GlassTabs` in `screens/Home.tsx`), and in a sidebar on desktops: Learn, Progress and Courses with their icons, which ⌘1 to ⌘3 (Ctrl elsewhere) switch, each showing its key on hover, or the number alone while ⌘ is held; a button that collapses the sidebar to its icons, animated by its width, which the app remembers; and at its foot the name signed in and a settings button, only the button while collapsed, which opens Me as Settings, as ⌘, does. On macOS the window has no title bar of the system's (`lib/window.ts`): the sidebar's top row and each page's header take its place and drag the window, with the traffic lights at the top left, the collapse button at the sidebar's right end, or right of the traffic lights while collapsed, and the page's title after them (`lib/chrome.ts`); the pages' top left corner beside the sidebar is rounded, and a task's bar sits in the same row, its progress right of the traffic lights and its close button at the right end (at the left on phones). In a task, 1 to 9 or a to i pick a choice, Enter submits and Escape leaves.
- The palette chosen on the device is nsh's `primary` too (`followPalette` in `lib/ui.tsx`, through `setTheme`), so the system's own controls, iOS's tab bar and Android's dialog buttons, take its accent.
- On phones the tab bar slides out of sight while a page scrolls down and comes back as it scrolls up, at the top and on every new page (`followScroll` and `barStyle` in `lib/ui.tsx`).
- On phones a tab has no system header: its own top bar (`TopBar` in `lib/ui.tsx`), with the logo and the tab's name, reaches up under the status bar, and the page scrolls under it, under glass (`glass`): on iOS the system's Liquid Glass, as the tab bar's; on Android a light blur under a thin tint of the page's color, with a hairline below the top bar. Android's tab bar is the same glass, with no shadow, which Android would draw through the glass. Below the bar the tint fades out, as iOS 26's scroll edge effect does. Pages opened from a tab keep the system header.
- A pull from the top of a page reads it again (`PullScroll`): an indicator in the palette's accent comes in with the pull and spins until the read ends, at least 0.6 seconds, so the system always hears the refresh both start and end. Only a drag that begins with the page at rest at its top is a pull: a scroll or a fling that runs past the top, and a swipe that catches the page still bouncing from one, bounce back without the indicator.
- Pages read the server through `query` (`lib/query.ts`), which keeps answers in TanStack Query's `query-core`, as the web app does: a page opened again shows what it read before at once and reads again in the background once that is 30 seconds old. A call that changes something marks every answer as old, and the pages on the stack read again once the learner leaves a task; signing in or out drops them all. Long pages (the course list, a course's outline and its progress map) lay their rows out in a `List` in the scroll view (`viewport="parent"`), which binds the rows that show and the rest over the next frames, so a page opens without a pause on Android.
- On desktops the app puts an icon in the system tray (`lib/tray.ts`, `assets/tray.svg`) whose menu opens the window or a tab and quits.
- `nsh test` runs headless as iOS, where the system tab bar takes no presses, so tests that switch tabs open the app with `platform: "macos"` and use the sidebar.
- Text with math and figures shows in web views, which load KaTeX and MathLive from the web app under `/embed`. `apps/web/vite.config.ts` copies them into `public/embed`, which is ignored by git. Plain text uses native views.
- `nsh test` does not run web views, so plots and the math field have no headless test.
- A page in a web view that cannot load the KaTeX stylesheet shows each formula's MathML instead. On `--target web` the page is a sandboxed frame without an origin, so `/embed` allows any origin. Some embedded browsers, such as the Claude desktop app's browser pane, refuse every request from a sandboxed frame, so check math in a regular browser or on a native target.
- A desktop window cannot be made smaller than 420 by 600 points (`lib/window.ts`).
- `pnpm nx run nsh:package -- --target <target>` builds an installable app, whose identifier is `dev.greatacademy.app`, with its icon from `assets/`. It uses `https://greatacademy.dev` unless `--api-url` names another server, and passes other flags, such as `--sign` and `--profile`, on to `nsh package`. Nx runs its arguments through a shell, so when a value holds parentheses, as a signing identity does, run `node scripts/package.ts` with the same flags from `apps/nsh` under `mise exec`.
- The icon follows the system's light or dark appearance: the background is white or the dark surface token. `nsh package` takes one icon, so the script then compiles `assets/AppIcon.icon` with `actool` for iOS and macOS (macOS keeps the `.icns` for older systems), adds `assets/icon-dark.png` as Android's night launcher icon, and signs the app again. Windows and Linux keep the light icon. An iOS host linked against an SDK older than iOS 26, as Native Shell's 0.4.0 release was, is made to report iOS 26 before signing, since UIKit draws Liquid Glass only for apps that do.

## 7. Running the Voice Service

The voice service (`apps/voice`, [English curriculum §13.3](english-curriculum.md#133-the-voice-service)) is a Python project managed by uv; `mise install` provides both. `uv run` creates `apps/voice/.venv` from `uv.lock` on first use, which the Nx targets do too.

```bash
pnpm nx run-many -t typecheck test lint -p voice   # pyright, pytest, ruff
cd apps/voice && uv run python -m ga_voice.devkeys # A development key pair for tickets
```

- The tests need no network: speech services, voice activity and the web Worker are faked, and an end-to-end test runs the server in the process with real WebSockets, including a `SIGTERM` during a session.
- The service reads `VOICE_*` variables: `VOICE_TICKET_PUBLIC_KEY` (the public half of the key the Worker signs tickets with), `VOICE_WORKER_URL` and `VOICE_WORKER_CREDENTIAL` are required; `VOICE_SPEECH` is `unconfigured` (sessions are refused with `speech_unavailable`) or `fake` (scripted speech, for local development only). No speech provider is chosen in code.
- In a container, as in production: copy `apps/voice/.env.example` to `apps/voice/.env.local` (ignored by git) and fill in the public key, then:

```bash
docker compose build voice
docker compose up -d voice          # ws://localhost:8089/v1/conversation; /healthz and /readyz
docker compose stop voice           # SIGTERM: refuses new sessions, waits for running ones (up to 25 minutes)
```

- The `voice` service is in the `voice` profile, so a plain `docker compose up -d` still starts only PostgreSQL. It reaches `cf dev` on the host at `http://host.docker.internal:5173`; set `VOICE_WORKER_URL` to point elsewhere. Start the web app with `DEV_HOST=0.0.0.0` if the container cannot reach it.
- To run a conversation end to end, put the private half of the key pair in `apps/web/.dev.vars` as `VOICE_TICKET_PRIVATE_KEY`, with `VOICE_URL=ws://localhost:8089/v1/conversation` and `VOICE_SERVICE_CREDENTIAL` equal to the container's `VOICE_WORKER_CREDENTIAL`. A learner is offered a conversation only through a live, calibrated, priced route of use `conversation` for it; in a local database, add the provider, price and route in the admin console and a passing calibration row for the conversation's id by hand.
- With `VOICE_SPEECH=fake`, the learner's first stretch of sound in each turn is recognized as the next of four scripted lines, which start over when they run out, and the tutor speaks as a tone. Headless Chrome speaks a recording with `--use-fake-ui-for-media-stream`, `--use-fake-device-for-media-stream` and `--use-file-for-fake-audio-capture=<file.wav>`; on macOS it also needs `--disable-features=AudioServiceSandbox`, or the fake microphone gives silence.
- The container has no volume and a read-only filesystem with `/tmp` in memory. Logs hold no audio or transcripts: Pipecat's own records are kept only from warnings up, and debug output is never turned on.
- `/metrics` reports `voice_sessions_active`, `voice_sessions_capacity` and `voice_draining` in Prometheus's text format, for scaling.

The cluster's manifests are in `deploy/voice` ([its README](../deploy/voice/README.md)); `mise install` provides kustomize and kubeconform:

```bash
mise run voice:check                # Render the overlays and validate them; touches no cluster
mise run voice:push test            # Build, push to GHCR and pin the test overlay to the digest
```
