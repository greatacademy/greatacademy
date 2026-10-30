# Roadmap

> English | [简体中文](roadmap.zh-CN.md)

Phases, their completion criteria and the current status. Mathematics is the first subject. The design of every phase keeps the core subject-agnostic ([Architecture §1](architecture.md#1-principles)).

## 1. Phases

| Phase | Scope | Completion criteria | Status |
| :--- | :--- | :--- | :--- |
| P0 Foundations | Monorepo (mise, pnpm, Nx, TypeScript, Biome, Vitest), documents | `pnpm nx run-many -t typecheck test lint` passes on a clean checkout | Done |
| P1 Content model | `libs/content`: topic, KP, course and problem types; compiler and validator; seeded problem runtime; answer checking | The compiler rejects cycles, dangling references, bad weights and non-deterministic generators; tests cover each rule | Done |
| P2 First math slice | `libs/subject-math`, `content/math`: a connected slice from integer arithmetic to linear equations and inequalities, bilingual, with prerequisite and encompassing edges | The slice compiles; every generator is sampled 200 times per KP with correct, self-consistent answers | Done |
| P3 Learning engine | `libs/engine`: frontier, FIRe repetition model, task selection with repetition compression, lessons and KP flow, reviews, quizzes, diagnostic, XP; `tools/simulate` | Unit tests for every rule in [Learning Engine](learning-engine.md); simulated students finish the slice with about one explicit review per topic or fewer | Done |
| P4 Contracts and storage | `libs/proto`, `libs/db`, `libs/api`: services, schema, event log, repositories, session runner | Repositories and services pass integration tests on PGlite; replaying the event log reproduces the stored state | Done |
| P5 Web app | `apps/web`: accounts, catalog, enrollment, diagnostic, dashboard, lesson, review and quiz players, progress | A new learner signs up, takes the diagnostic, and completes lessons and reviews end to end in `cf dev` against PostgreSQL | Done |
| P6 Mobile app | `apps/mobile`: sign in, dashboard, task players with shared math components | The app runs in the iOS simulator against the development server | Skeleton: course list and outline |
| P7 Content scale-up | The rest of Prealgebra, then Algebra I → Precalculus → Calculus, planned from [Math Curriculum](math-curriculum.md) | Each course compiles and passes generator sampling; edges reviewed | In progress: Prealgebra (72 topics) |
| P8 Accounts and oversight | Parent and teacher roles, managed learner profiles, reports | — | Planned |
| P9 Billing | Subscriptions: Stripe on the web, in-app purchases on mobile | — | Planned |
| P10 Calibration | Fit topic difficulty and engine parameters from real answers; content analytics per question | — | Planned |
| P11 More subjects | A second subject on the same core | — | Planned |

## 2. Risks and Open Items

- **Content volume** is the main cost. About 3,500 topics are needed to cover grade 4 through upper-division mathematics, each with KPs, worked examples and generators. Tooling for authoring and review matters more than any other part of the system.
- **Engine parameters** come from the book's description and our own choices, not from data. They are recorded in [Learning Engine §8](learning-engine.md#8-parameters) and must be recalibrated in P10.
- **`cf` command line** is in beta; its configuration may change.
- **Math input on mobile** goes through Expo DOM components (a web view). This needs to be checked on low-end Android devices.
