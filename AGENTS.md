# AGENTS.md

> English | [简体中文](AGENTS.zh-CN.md)

This is the working guide for AI coding agents and contributors. It summarizes the rules; the details live in the documents below. When this file conflicts with them, the documents win and this file must be corrected.

| Document | Contents |
| :--- | :--- |
| [docs/architecture.md](docs/architecture.md) | Technology choices, repository structure, dependency direction, domain model, request flow, deployment |
| [docs/content.md](docs/content.md) | Content model and authoring: topics, knowledge points, generators, checkers, courses, the compiler |
| [docs/learning-engine.md](docs/learning-engine.md) | The engine's algorithms and parameters: frontier, FIRe, task selection, lessons, reviews, quizzes, diagnostic, XP |
| [docs/development.md](docs/development.md) | Toolchain, commands, local database, running the apps |
| [docs/roadmap.md](docs/roadmap.md) | Phases, completion criteria, status, risks |
| [docs/math-curriculum.md](docs/math-curriculum.md) | Reference catalog of a complete mathematics curriculum (37 courses), the plan for content |
| [docs/the-math-academy-way.md](docs/the-math-academy-way.md), [docs/math-academy-website.md](docs/math-academy-website.md) | Research notes the design is based on |

## Project Overview

Great Academy is an adaptive learning platform for many subjects, starting with mathematics. Everything is TypeScript: a web app on Cloudflare Workers, an Expo mobile app, and pure libraries for content and the learning engine.

## Directory Structure

```text
apps/web/            TanStack Start on Cloudflare Workers: pages, Connect API, better-auth
apps/mobile/         Expo app
libs/content/        Content model, compiler, problem runtime, checkers (subject-agnostic)
libs/engine/         Learning engine (pure, subject-agnostic)
libs/subject-math/   Mathematics checkers and generator helpers
libs/proto/          Protobuf contracts and generated TypeScript
libs/db/             Drizzle schema, migrations, repositories
libs/design/         Design tokens and strings
libs/math-ui/        Math rendering and input components
content/math/        Mathematics content
tools/simulate/      Simulated students
tools/catalog/       Reference course catalogs
```

## Commands

Tool versions are pinned in `mise.toml`; `pnpm nx` runs Nx under `mise exec`.

```bash
mise install
pnpm install
pnpm nx run-many -t typecheck test lint    # Check everything
pnpm nx affected -t typecheck test lint    # Check affected projects
pnpm format                                # Format and fix with Biome
```

Every package declares its targets as `package.json` scripts (`typecheck`, `test`, `lint`, and where relevant `build`, `generate`, `dev`); Nx infers them.

## TypeScript Conventions

- ESM only, `strict`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`, `erasableSyntaxOnly` (no enums, namespaces or parameter properties, so Node runs the sources directly); imports of local files carry the `.ts` extension.
- Libraries export their source (`"exports": { ".": "./src/index.ts" }`); there is no library build step.
- Pin exact dependency versions (`savePrefix: ''`).
- Every exported identifier has a doc comment that starts with its name.
- `libs/content`, `libs/engine` and `libs/subject-math` are pure: no I/O, no `Date.now()`, no `Math.random()`. Time and seeds are parameters.
- The core never mentions a subject. Subject-specific logic lives in `libs/subject-<id>` and `content/<id>`.
- Format and lint with Biome (`biome.json`); do not add Prettier or ESLint.
- Do not name a function `fit`, `fdescribe` or the like: Biome's `noFocusedTests` reports any call to it as a focused test.

## Content Conventions

- Every user-visible text exists in English and Simplified Chinese (`t(en, zh)`); the compiler rejects missing locales.
- Topic, knowledge point and course ids are kebab case and never change once published: learner state refers to them.
- Every generator is deterministic, lists plausible wrong responses in `wrong`, and passes `sampleGenerators` (run by each content package's tests).
- Never lower the bar: no hints that give away answers; scaffolding goes into explanations, worked examples and extra knowledge points.

## Testing Conventions

- Vitest everywhere; tests sit next to the code as `*.test.ts`.
- Engine rules are tested with explicit times and seeds; no test depends on the wall clock.
- Database tests run on PGlite; no test needs a running server.

## Documentation

- Every document exists in English (`<name>.md`) and Simplified Chinese (`<name>.zh-CN.md`) with section-by-section correspondence; the two link to each other at the top. Change both in the same commit.
- Documents describe the adopted design only.
- Changes to architecture, technology choices or the dependency direction update [docs/architecture.md](docs/architecture.md) and this file; changes to engine behavior or parameters update [docs/learning-engine.md](docs/learning-engine.md); changes to the content model update [docs/content.md](docs/content.md); finished phases update [docs/roadmap.md](docs/roadmap.md).

## Commits

- Commit directly on `main`; no Co-Authored-By trailers.
- Conventional Commits with the Nx project name as scope: `feat(engine): …`, `build: …`, `docs: …`.
- One purpose per commit; `pnpm nx affected -t typecheck test lint` passes before committing.
