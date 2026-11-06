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
| P6 Mobile app | `apps/mobile`: sign in, dashboard, task players with shared math components and figures | The app runs in the iOS simulator against the development server | Skeleton: course list and outline |
| P7 Content scale-up | The rest of Prealgebra, then Algebra I → Geometry → Algebra II → Precalculus → Calculus, in the order of their prerequisites, planned from [Math Curriculum](math-curriculum.md) | Each course compiles and passes generator sampling; edges reviewed | Done: Prealgebra (218 topics), Algebra I (234 topics), Geometry (179 topics), Algebra II (180 topics), Precalculus (298 topics), Calculus I (175 topics), Calculus II (160 topics), Multivariable Calculus (194 topics), Differential Equations (159 topics), AP Calculus AB (212 topics), AP Calculus BC (305 topics), Linear Algebra (181 topics), Methods of Proof (135 topics), Discrete Mathematics (143 topics), Abstract Algebra (129 topics), Probability & Statistics (182 topics), Mathematics for Machine Learning (301 topics), Mathematical Methods for the Physical Sciences I, II (294, 238 topics), Integrated Math I, II, III (204, 212, 176 topics), Integrated Math I, II, III (Honors) (231, 333, 279 topics), Mathematical Foundations I, II, III (359, 359, 323 topics), 1st, 2nd, 3rd Grade Math (61, 65, 65 topics), 4th, 5th Grade Math (141, 134 topics), 6th, 7th, 8th Grade Math (157, 171, 137 topics), SAT Math Fundamentals, SAT Math Prep (661, 284 topics), ACT Math Fundamentals, ACT Math Prep (932, 348 topics), Number Theory (78 topics), Real Analysis (82 topics), Complex Analysis (59 topics), Linear Programming (52 topics) and Partial Differential Equations (56 topics) written; every course outline is covered, and what still needs real students is listed in `content/math/PROGRESS.md` |
| P8 Accounts and oversight | Password reset, email verification, account deletion, weekly goals, leagues; guardians linked by invite code who see a learner's progress and set goals; parent and teacher roles, managed learner profiles, reports | — | Partly done: everything before the last clause. Sending email in production needs a verified sender domain |
| P9 Billing | Subscriptions: Stripe on the web, in-app purchases on mobile | — | Planned |
| P10 Calibration | Fit topic difficulty and engine parameters from real answers; content analytics per question | — | Planned |
| P11 More subjects | A second subject on the same core: English, designed in [English Curriculum](english-curriculum.md) | Each course meets the criteria of its stage in that document | Planned |

## 2. Risks and Open Items

- **Content volume** is the main cost. About 4,100 topics are needed to cover grade 1 through upper-division mathematics, each with KPs, worked examples and generators. Tooling for authoring and review matters more than any other part of the system.
- **Engine parameters** come from the book's description and our own choices, not from data. They are recorded in [Learning Engine §8](learning-engine.md#8-parameters) and must be recalibrated in P10.
- **`cf` command line** is in beta; its configuration may change.
- **Worker size and startup.** Subjects run in Workers of their own, each well under the 64 MiB limit, the 1 second startup limit and the 128 MB memory limit as far as local measurements show ([Architecture](architecture.md) §6.1). This runs in workerd locally; it has not yet been deployed to Cloudflare, so startup time, the latency of calls between Workers and memory there are unmeasured.
- **Math input on mobile** goes through Expo DOM components (a web view). This needs to be checked on low-end Android devices.

## 3. Pilot

Tests and simulated students show that the content is correct and that the engine behaves. Only real learners can show that the content teaches. The pilot is how we find out, and it has to be run by people: it needs recruited learners and, for minors, the consent of their guardians.

**Who and what.** 20 to 30 learners of Algebra I for four weeks, a mix of levels, each doing about 30 XP a day. Algebra I comes first because its learners are the most numerous and its prerequisites are well covered.

**Measuring learning from outside the platform.** Give the same kind of short paper test, written without the platform's questions, before and after. XP and passed lessons are what the platform says about itself; the test is what checks them.

**Each week.** Run the report and act on it:

```bash
DATABASE_URL=… pnpm nx run pilot:report -- --course algebra-i --since 2026-12-01 --out /tmp/pilot.md
```

| The report shows | What to do |
| :--- | :--- |
| A knowledge point few learners get right the first time | Read its explanation and worked example, and add a step or split the knowledge point. Do not make the question easier |
| A wrong response that several learners give | Add it as a listed mistake with feedback of its own, or address it in the explanation |
| A topic with many failed lessons | Check that its prerequisites are really prerequisites, and whether a knowledge point in between is missing |
| Sessions started but abandoned | Ask the learners why: length, difficulty and display are different fixes |

A rate needs at least 5 learners to be listed, and even then it is a lead to read, not a verdict.

**Watching people learn.** Each week, watch two or three learners do a lesson while thinking aloud. This finds what numbers cannot: which sentences are skipped, and where a learner stops trusting the explanation.

**What the pilot decides.** Whether learners improve on the outside test, how long the course takes against the simulated pace, and which parameters to fit in P10 (the reliability calibration and XP per minute).

The report reads only topic, knowledge point, response and result, and shows no names. Handle its source database like any other learner data.
