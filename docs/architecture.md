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
| Database | **PostgreSQL 17**, reached from the Worker through **Hyperdrive**; **Drizzle ORM** + drizzle-kit migrations | **PGlite** in tests; a `postgres:17-alpine` container (OrbStack) in development |
| Mobile | **Expo** (latest SDK), Expo Router, TanStack Query, **Uniwind** (Tailwind v4 for React Native) | Same contracts and tokens as the web app |
| Object storage | **R2** | Images and figures of content |

## 3. Repository Structure

```text
apps/web/             TanStack Start on Workers: pages, better-auth, and libs/api mounted under /api
apps/mobile/          Expo app (iOS, Android)
libs/proto/           Contracts: proto/ga/<domain>/v1/*.proto, buf config, gen/ (generated, committed)
libs/api/             Connect service implementations and the session runner; transport- and host-agnostic
libs/engine/          Learning engine: graph, frontier, FIRe, task selection, diagnostic, XP, quizzes (pure)
libs/content/         Content model: topic/course definitions, compiler and validator, problem runtime, answer checking
libs/subject-math/    The mathematics subject: math answer checkers and helpers for math problem generators
libs/db/              Drizzle schema, migrations and repositories (PostgreSQL)
libs/design/          Design tokens, strings (en, zh-CN) and their generated forms for web and mobile
libs/math-ui/         React components: math rendering and math input
content/math/         Authored mathematics content: topics, courses
tools/simulate/       Simulated students for tuning and checking the engine
tools/catalog/        Reference catalogs (the Math Academy course skeleton) for planning content
docs/                 Documents (English + Simplified Chinese)
```

### 3.1 Dependency Direction

```text
apps/web ──► libs/api ──► libs/db ──► libs/engine ──► libs/content
   │            │                                       ▲
   │            └──► libs/proto                         │
   ├──► libs/math-ui ──► libs/design             libs/subject-math ◄── content/math
   └──► content/math
apps/mobile ──► libs/proto, libs/design, libs/math-ui
tools/simulate ──► libs/engine, content/math
```

- `libs/content` depends on nothing in the repository. It defines the types every subject implements.
- `libs/engine` depends only on `libs/content`'s types. It has no I/O, no clock (time is a parameter) and no randomness (seeds are parameters).
- `libs/subject-math` depends only on `libs/content`.
- `content/<subject>` depends on `libs/content` and its subject library.
- `libs/api` implements the services against `libs/db` and the engine, but knows no host: the request's user and database client arrive as Connect context values, and the clock and seeds are injected. Its tests run the services end to end over PGlite.
- Only `apps/*` wire storage, transport, authentication and content together.

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
| Learner | A person who studies (a user account, later also managed child profiles) |
| Enrollment | A learner in a course |
| Topic state | A learner's repetition state on a topic (derived) |
| Task | A lesson, review, quiz or diagnostic offered on a learner's dashboard |
| Event | An immutable record: task started, answer submitted, task completed, diagnostic answered |

The full model of content is in [Content](content.md). The derived learner state is defined in [Learning Engine](learning-engine.md).

## 5. Request Flow

1. The client calls a Connect service under `/api/ga.<domain>.v1.*` with the session cookie on the web, or a bearer token on mobile.
2. The Worker authenticates with better-auth and loads the learner's state from PostgreSQL through Hyperdrive. Each request gets its own database client.
3. The service calls the engine with:
   - the subject graph, compiled content bundled into the Worker and cached per isolate;
   - the learner state;
   - the current time.
4. The engine returns new state and the events to record. The service writes both in one transaction and returns the response.

A task is carried out as a **session**, one question per request (`StartTask`, then `SubmitAnswer` until a result). The session runner (`libs/api/src/runner.ts`) is a pure state machine over the engine's lesson, review, quiz and diagnostic rules. Its state holds problem references (topic, knowledge point, seed), never problems.

Problem instances are generated on the server from a seed and graded on the server. The answer is never sent to the client before submission.

## 6. Deployment

- **Production:**
  - One Worker (`apps/web`), deployed with `cf deploy`, with a Hyperdrive binding to a managed PostgreSQL and an R2 binding for media.
  - Migrations are applied with drizzle-kit before a deployment.
- **Development:**
  - `cf dev` runs the Worker in workerd through Vite.
  - It connects to PostgreSQL in a `postgres:17-alpine` container under OrbStack. See [Development](development.md).
- **Mobile:** Expo builds (EAS). The app talks to the same API.

## 7. Storage

| Table | Contents |
| :--- | :--- |
| `user`, `session`, `account`, `verification` | better-auth's core schema |
| `learner` | A person who studies; one per user today |
| `enrollment` | A learner in a course |
| `event` | The engine's event log per learner and subject, numbered by `seq` without gaps; `xp` kept for reporting |
| `learner_state` | Snapshot of the fold of the log up to `seq`; rebuildable by replay |
| `task_session` | Sessions and their runner state; at most one active per learner and course |
| `answer` | Every judged response: problem reference, response, verdict |

**Consistency.**
- Completing a session appends the event, replaces the snapshot and closes the session in one transaction.
- The snapshot row and the session row are locked (`SELECT … FOR UPDATE`) while they are read for writing. The unique `(learner, subject, seq)` index rejects any writer that slips past.
- `SubmitAnswer` carries the index of the question it answers, so a repeated request is rejected instead of being judged twice.

**Migrations** are generated by drizzle-kit from `libs/db/src/schema` into `libs/db/drizzle` and committed. Tests apply them to PGlite; deployments apply them with `pnpm nx run db:migrate`.
