# Great Academy Architecture

> English | [简体中文](architecture.zh-CN.md)

Great Academy is an adaptive learning platform built on the mechanisms described in [The Math Academy Way](the-math-academy-way.md):
- a knowledge graph of small topics,
- mastery learning,
- a hierarchical spaced-repetition system (FIRe),
- an adaptive diagnostic,
- an XP economy.

It is designed for many subjects. Mathematics is the first one implemented.

This document describes the system as built: technology choices, repository structure, dependency direction, and how the parts fit together. The algorithms are specified in [Learning Engine](learning-engine.md) and the content format in [Content](content.md).

---

## 1. Principles

1. **One knowledge graph per subject; courses are views.**
   - Topics, their edges and their knowledge points are authored once.
   - A course is an ordered selection of topics grouped into units and modules for display, plus a mastery floor.
   - The engine runs on the graph, never on a course ([Math Curriculum §4](math-curriculum.md#4-structure-and-reuse-analysis)).
2. **Subject-agnostic core.** Nothing in the engine, storage or API knows about mathematics.
   - A subject contributes three things: content (topics, courses), answer checkers, and renderers.
   - Mathematics is the first subject package.
3. **Never lower the bar.** These are pedagogical rules from the book, enforced by the engine, not left to UI choices:
   - a knowledge point is passed only by demonstrated performance;
   - students cannot edit their knowledge profile;
   - no "I don't know" button outside the diagnostic.
4. **Event log first.** Every answer, task and diagnostic response is appended to an immutable event log.
   - The student model (repetition state, ability, XP) is derived state that can be rebuilt by replaying the log through the engine.
   - Changing a parameter of the engine is therefore a replay, not a data migration.
5. **One language, shared everywhere.**
   - All code is TypeScript.
   - The engine and the content runtime are pure functions with no I/O. The same code runs in the Worker, the browser, the mobile app, tests and offline simulations.
6. **Content is code.**
   - Topics, knowledge points and problem generators are TypeScript modules reviewed through git.
   - A compiler validates the graph before anything is published.

## 2. Technology Choices

| Area | Choice | Notes |
| :--- | :--- | :--- |
| Language | **TypeScript 7** (native `tsc`), ES2024, ESM only | Strict mode everywhere |
| Monorepo | **pnpm workspaces + Nx** (inferred targets, local cache) | Tool versions pinned by **mise** |
| Lint / format | **Biome** | One tool, one config at the root |
| Tests | **Vitest** | Unit tests in every library; integration tests against PGlite |
| Contracts / RPC | **Protobuf + buf + Connect** (`protobuf-es` v2, `connect-es` v2), `protovalidate` | One contract for the web and mobile clients; JSON on the wire for mobile |
| Web app | **TanStack Start** (Router, Query, Form) on **Cloudflare Workers**; **React 19** | Built, run and deployed with Cloudflare's **`cf`** command line, not wrangler |
| UI | **Base UI**, **Tailwind CSS v4**, Phosphor icons | Design tokens from `libs/design` |
| Math rendering / input | **KaTeX** (rendering), **MathLive** (input), **Compute Engine** (parsing student answers) | Packaged in `libs/math-ui`; reused by the mobile app through Expo DOM components |
| Accounts | **better-auth** (email + password, passkeys later), in the Worker | Sessions shared by the web app and the mobile app (bearer tokens) |
| Email | **Resend**, called over HTTP from the Worker with the secrets `RESEND_API_KEY` and `EMAIL_FROM` | Password resets and address verification, in the learner's two languages; a Worker needs no SMTP client |
| Database | **PostgreSQL 17**, reached from the Worker through **Hyperdrive**; **Drizzle ORM** + drizzle-kit migrations | **PGlite** in tests; a `postgres:17-alpine` container (OrbStack) in development |
| Mobile | **Expo** (latest SDK), Expo Router, TanStack Query, **Uniwind** (Tailwind v4 for React Native) | Same contracts and tokens as the web app |
| Object storage | **R2** | Images of content; generated figures are inline SVG ([Content §4](content.md#4-knowledge-points-and-generators)) |

## 3. Repository Structure

```text
apps/web/             TanStack Start on Workers: pages, better-auth, and libs/api mounted under /api
apps/math-workers/    The Workers serving mathematics: a gateway and its shards (§6.1)
apps/mobile/          Expo app (iOS, Android)
libs/proto/           Contracts: proto/ga/<domain>/v1/*.proto, buf config, gen/ (generated, committed)
libs/api/             Connect service implementations and the session runner; transport- and host-agnostic
libs/engine/          Learning engine: graph, frontier, FIRe, task selection, diagnostic, XP, quizzes (pure)
libs/content/         Content model: topic/course definitions, compiler and validator, problem runtime, answer checking
libs/subject-math/    The mathematics subject: math answer checkers and helpers for math problem generators
libs/subject-worker/  Worker entrypoints that any subject's gateway and shards are made from
libs/db/              Drizzle schema, migrations and repositories (PostgreSQL)
libs/design/          Color tokens, palettes and the appearance model (§8), with their generated forms for web and mobile
libs/math-ui/         React components: math rendering and math input
content/math/         Authored mathematics content: topics, courses
tools/simulate/       Simulated students for tuning and checking the engine
tools/audit/          Content audit: outline coverage and heuristic quality checks
tools/pilot/          Pilot report: where real learners fail, from the answer and event logs
tools/catalog/        Reference catalogs (the Math Academy course skeleton) for planning content
docs/                 Documents (English + Simplified Chinese)
```

### 3.1 Dependency Direction

```text
apps/web ──► libs/api ──► libs/db ──► libs/engine ──► libs/content
   │            │                                       ▲
   │            └──► libs/proto                         │
   ├──► libs/design
   ├──► libs/math-ui ──► libs/design             libs/subject-math ◄── content/math
   └╌╌► apps/math-workers (development only, to run them alongside)
apps/math-workers ──► libs/subject-worker ──► libs/content
   └──► content/math, libs/subject-math
apps/mobile ──► libs/proto, libs/design, libs/math-ui
tools/simulate ──► libs/engine, content/math
tools/audit ──► libs/content, content/math
tools/pilot ──► libs/db, libs/engine, content/math
```

- `libs/content` depends on nothing in the repository. It defines the types every subject implements.
- `libs/engine` depends only on `libs/content`'s types. It has no I/O, no clock (time is a parameter) and no randomness (seeds are parameters).
- `libs/subject-math` depends only on `libs/content`.
- `libs/design` depends on nothing in the repository and has no I/O, so web and mobile share it.
- `content/<subject>` depends on `libs/content` and its subject library.
- `libs/api` implements the services against `libs/db` and the engine, but knows no host: the request's user and database client arrive as Connect context values, and the clock and seeds are injected. Its tests run the services end to end over PGlite.
- `libs/subject-worker` is the one library that imports the Workers runtime; it knows no subject.
- Only `apps/*` wire storage, transport, authentication and content together. The web Worker does not import content: it reaches subjects through service bindings.

## 4. Domain Model

| Entity | Meaning |
| :--- | :--- |
| Subject | A field of study with its own knowledge graph: `math`, later others |
| Topic | One teachable idea, a lesson of about 10–30 minutes; the node of the graph |
| Knowledge point (KP) | A step of a topic: explanation, worked example, problem generator; 2–4 per topic |
| Prerequisite edge | Topic → topic it requires; defines the knowledge frontier |
| Key prerequisite | KP → topic: the earlier skill a KP depends on most; drives remediation |
| Encompassing edge | Topic → simpler topic, weight 0–1: how much of the simpler topic the advanced one practices; drives FIRe |
| Course | Ordered topics grouped into units and modules, with a mastery floor |
| Learner | A person who studies, with one user account |
| Guardian | A user who follows a learner, and can set their goals, by the learner's invitation |
| League group | Up to 30 learners in a tier competing for a week |
| Enrollment | A learner in a course |
| Topic state | A learner's repetition state on a topic (derived) |
| Task | A lesson, review, quiz or diagnostic offered on a learner's dashboard |
| Event | An immutable record: task started, answer submitted, task completed, diagnostic answered |

The full model of content is in [Content](content.md). The derived learner state is defined in [Learning Engine](learning-engine.md).

## 5. Request Flow

1. The client calls a Connect service under `/api/rpc/ga.<domain>.v1.*` with the session cookie on the web, or a bearer token on mobile. better-auth itself is served under `/api/auth/*`.
2. The Worker authenticates with better-auth and loads the learner's state from PostgreSQL through Hyperdrive. Each request gets its own database client.
3. The service calls the engine with:
   - the subject graph, read from the subject's manifest and cached per isolate;
   - the learner state;
   - the current time.
4. The engine returns new state and the events to record. The service writes both in one transaction and returns the response.

A task is carried out as a **session**, one question per request (`StartTask`, then `SubmitAnswer` until a result). The session runner (`libs/api/src/runner.ts`) is a pure state machine over the engine's lesson, review, quiz and diagnostic rules. Its state holds problem references (topic, knowledge point, seed), never problems. A finished session stays readable: `ListSessions` lists a learner's finished sessions for a course, and `GetSession` reopens one with its questions, answers and solutions. `GetTopic` returns any topic of a course with its lesson, fresh examples from a seed, and the topics it builds on and leads to, so a learner can reread a lesson at any time; reading changes no learner state.

Problem instances are generated on the server from a seed and graded on the server, in the subject's shard Worker (§6.1). The answer is never sent to the client before submission.

The web app (`apps/web`) has one catch-all server route, `/api/$`, that hands requests to `src/server/handler.ts`. Pages are rendered on the server without learner data and fetch it in the browser with the Connect client and TanStack Query, so a page never needs the session on the server. The page language is decided on the server (the `ga-locale` cookie, else `Accept-Language`), so the first render is already in it.

`/` depends on who is asking. Signed out, it is the landing page, also at `/landing` for everyone, and rendered on the server. Signed in, it opens on the next task of the course most recently worked on; an account with no course and a guarded learner goes to `/guardian`, and any other account with no course is asked who will be learning. A session cookie is enough to choose between the two on the server, so a signed-in learner never sees the landing page flash. The catalog is its own public page, `/courses`.

A guardian reads a learner through the same read-only calls a learner uses: `GetDashboard`, `GetCourseProgress` and `ListSessions` take an optional `learner_id`, which is honored only for a learner the caller follows. Calls that change anything take no `learner_id`, and a guardian cannot open a session, so a learner's answers stay their own.

## 6. Deployment

- **Production:**
  - The web Worker (`apps/web`), deployed with `cf deploy`, with a Hyperdrive binding to a managed PostgreSQL, an R2 binding for media, and a service binding to each subject's gateway Worker.
  - The Workers of each subject (§6.1), deployed before the web Worker, shards before their gateway, because a service binding must name a Worker that exists.
  - Migrations are applied with drizzle-kit before a deployment.
- **Development:**
  - `cf dev` runs the Worker in workerd through Vite.
  - It connects to PostgreSQL in a `postgres:17-alpine` container under OrbStack. See [Development](development.md).
- **Mobile:** Expo builds (EAS). The app talks to the same API.

### 6.1 Subjects as Workers

Generators are code, so content cannot be loaded as data. A Worker has limits on both plans: 64 MiB uncompressed, 1 second to execute its global scope, and 128 MB of memory per isolate. All of mathematics is about 29 MB uncompressed and its shards load in about 460 ms under Node when added up, and more subjects are planned, so one Worker would reach these limits. So subjects run in Workers of their own:

```text
web Worker ──service binding──► subject gateway ──service bindings──► subject shards
 Registry                        manifest, routing                     generators, checkers
```

- **The web Worker** holds no content. It binds one gateway per subject (`SUBJECT_MATH`), and `apps/web/src/server/handler.ts` lists the bindings. Adding a subject deploys its Workers and adds one binding.
- **The gateway** implements `SubjectGateway` (`libs/content`): `listing` (the courses, small), `manifest` (the subject without its code, generated at build time by `subjectManifest`) and the `SubjectSource` methods `problems`, `lesson` and `judge`, which `routeSource` passes to the shard holding the topic.
- **A shard** holds the definitions of some of a subject's topics and implements `SubjectSource` with `topicSource`. Its definitions are built on the first call, not at startup.
- **`Registry`** (`libs/api`) reads the listings once per isolate, which is enough to list courses, and loads a subject's manifest when one of its courses is first used. It keeps the two most recently used subjects, because mathematics takes about 45 MB of memory once indexed and an isolate has 128 MB. A course's scope is computed when first used.

Mathematics has five shards, one for each stretch of the curriculum (`content/math/src/shards/`). `apps/math-workers/gen/` holds the generated manifest and the topics of each shard; it is not committed.

| Worker | Uncompressed size | Module load under Node |
| :--- | :--- | :--- |
| `ga-web` | 6.8 MB | |
| `ga-math` (gateway) | 5.9 MB | 51 ms |
| `ga-math-school` | 4.7 MB | 62 ms |
| `ga-math-algebra` | 5.8 MB | 108 ms |
| `ga-math-calculus` | 8.7 MB | 133 ms |
| `ga-math-college` | 6.8 MB | 112 ms |
| `ga-math-exam` | 2.6 MB | 49 ms |

A shard is split in two when its startup time or memory nears the limits, which `startup_time_ms` in the deployment output and production metrics show: topics move to a new file under `shards/`, a new entry under `apps/math-workers/src/shards/`, and a new binding. Which shard holds a topic is not stored in learner state, so this is safe at any time.

Service binding calls add no request fee and no charge for duration; the CPU time of every Worker in a call is billed, and the hops add little. Each Worker writes its own logs, so one request could write three log events. The gateway and shards therefore log 1% of their invocations (`headSamplingRate`). The web Worker logs every request, and errors from the gateway and shards reach it through RPC.

## 7. Storage

| Table | Contents |
| :--- | :--- |
| `user`, `session`, `account`, `verification` | better-auth's core schema |
| `learner` | A person who studies, one per user: public username, league choice, weekday goals |
| `enrollment` | A learner in a course |
| `event` | The engine's event log per learner and subject, numbered by `seq` without gaps; `xp` kept for reporting |
| `learner_state` | Snapshot of the fold of the log up to `seq`; rebuildable by replay |
| `task_session` | Sessions and their runner state; at most one active per learner and course |
| `answer` | Every judged response: problem reference, response, verdict |
| `league_group`, `league_member` | A week's groups by tier and who is in them; weekly XP and outcomes are computed from `event` |
| `guardian`, `guardian_invite` | Who follows which learner; single-use invitation codes that expire after 7 days |

**Consistency.**
- Completing a session appends the event, replaces the snapshot and closes the session in one transaction.
- The snapshot row and the session row are locked (`SELECT … FOR UPDATE`) while they are read for writing. The unique `(learner, subject, seq)` index rejects any writer that slips past.
- `SubmitAnswer` carries the index of the question it answers, so a repeated request is rejected instead of being judged twice.

**Migrations** are generated by drizzle-kit from `libs/db/src/schema` into `libs/db/drizzle` and committed. Tests apply them to PGlite; deployments apply them with `pnpm nx run db:migrate`.

## 8. Appearance

Appearance belongs to the client, not the account: each browser or device keeps its own settings, nothing reaches the server, and they work signed out. `libs/design` holds what all clients share and is pure, so mobile can use it unchanged.

| Setting | Choices | Default |
| :--- | :--- | :--- |
| `theme` | `system`, `light`, `dark` | `system` |
| `light` | The palette in light: `academy`, `iris`, `plum`, `rose`, `linen`, `terracotta`, `walnut`, `honey`, `olive`, `paper`, `sepia`, `pine`, `lake`, `sky`, `midnight`, `slate`, or a custom palette | `academy` |
| `dark` | The palette in dark, with the same choices | `academy` |
| `contrast` | `standard`, `high` | `standard` |
| `text` | `small`, `default`, `large` | `default` |
| `motion` | `system`, `reduced`, `full` | `system` |

**Colors.** `colorTokens(palette, scheme, contrast)` is the only source of built-in colors, by role (`ink`, `surface`, `accent`, …). A palette changes the neutrals and the accent; `good`, `bad` and `warn` are the same in every palette because a verdict must read the same. Half of the built-in palettes are warm and half cool. Tests hold every text pair to the target of the contrast level in every palette and scheme, 4.5:1 for `standard` and 7:1 for `high`, which also strengthens `line`; they keep any saturated accent at least 20 degrees of hue from the verdict colors. A new color role or palette is added here, never in a client.

**Logo.** `LOGO` holds the mark, a white G that follows the outline of a burgundy shield. Its colors are fixed and never follow a palette, and the app icons sit on a fixed light tile.

**Custom palettes.** Each scheme keeps its own list of up to `MAX_CUSTOM_PALETTES` named palettes, with ids such as `custom-3`. A custom palette is three colors (`accent`, `page`, `ink`); `customTokens` derives the rest. The page stays as light or dark as its scheme requires and text moves in lightness as far as needed, so tests hold any three colors to the same contrast targets. A new palette starts from the colors of the one in use. Built-in palettes never change: editing one makes a draft, shown only in the preview, that can be saved as a new custom palette. Deleting a palette that is showing returns the scheme to the default.

**Sharing.** `sharePalette` writes a custom or built-in palette as text, `great-academy-palette-v1:{"scheme","name","accent","page","ink"}`, and `parseSharedPalette` reads it strictly. Importing adds a new custom palette, only to the scheme it was made for, because its colors only work there.

**Storage.** `serializeAppearance` and `parseAppearance` define one format, for example `theme=dark&dark=custom-1&custom-dark=1.rrggbb.rrggbb.rrggbb.name`, with one `custom-light` or `custom-dark` entry per palette and the name percent-encoded, stored under `APPEARANCE_STORAGE_KEY`. Defaults are left out, and whatever is missing or invalid reads as the default.

**Web.**
- `libs/design/theme.css` is generated from the tokens with `pnpm nx run design:generate` and committed; a test fails if it is stale. `apps/web` imports it, so components only use Tailwind classes such as `bg-surface`.
- Settings live in `localStorage` and show as attributes of `<html>`: `data-theme`, `data-light`, `data-dark`, `data-contrast`, `data-text`, `data-motion`. A default has no attribute.
- Rules of the two schemes sit in the ordered cascade layers `ga-light` and `ga-dark`, so a dark rule beats a light one whatever its specificity.
- Custom palettes cannot be in a static file: `customPaletteCss` builds their stylesheet, stored under `CUSTOM_PALETTE_CSS_KEY` and added to the head in the element `CUSTOM_PALETTE_STYLE_ID`.
- With no `data-theme`, CSS follows the device through `prefers-color-scheme`, without any script.
- The server never knows the settings, so a short script from `appearanceScript()` runs in the head and sets the attributes and adds the stored stylesheet before the first paint. A test checks that it agrees with `parseAppearance`.
- These attributes work on any element, which is how the settings page draws its miniatures and preview.

**Mobile.** The mobile app will store the same format in its local storage, get colors from `resolveColors(appearance, device)` in hex (React Native cannot parse oklch), scale text by `TEXT_SCALE`, and resolve `system` against the device with `resolveColorScheme` and `resolveReducedMotion`. Today it only uses the default light colors.
