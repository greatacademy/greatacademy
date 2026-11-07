# English Development Plan

> English | [简体中文](english-development-plan.zh-CN.md)

This document turns the design in [English Curriculum](english-curriculum.md) into milestones: what to change, in which files, how each is checked, and which results allow the next stage to begin. The design document says what English is; this one says in what order it gets built.

---

## 1. How the Work Is Organized

| Stage | Delivers | Needs from outside | Ends at |
| :--- | :--- | :--- | :--- |
| 0 Preparation | Decisions, reviewers and a deployed platform | Reviewers, legal advice | Gate G0 |
| 1 First slice | Grammar, sentence writing and words for grades 3 to 8, judged by rules | Pilot learners | Gate G1 |
| 2 Reading and writing | Graded reading, knowledge units, paragraphs and essays judged by AI | Human raters, model keys | Gate G2 |
| 3 Foreign-language courses | A1 to B1, audio, recording, S1 to S4 | Speech vendors, recordings scored by people | Gate G3 |
| 4 Conversation and both ends | S5 and S6 on the voice service, phonics, college writing, exam courses | The Kubernetes cluster | Each course meets its criteria |

```text
G0 ─► E1 first slice ─► G1 ─┬─► E2 reading ──────────┐
                            ├─► E3 AI writing ───────┴─► G2 ─► E4 foreign-language ─► G3 ─┬─► E5 conversation
                            │                                                             ├─► E6 phonics
                            └── P6 mobile task players (needed by E4.7)                   └─► E7 college and exams
```

**Rules for every milestone.**

- Each stage leaves mathematics untouched: its tests, its Workers and its learners' state behave as before.
- Nothing is built before its stage needs it. The first slice has no AI, audio or new Cloudflare product.
- Thresholds marked *starting* are first values to confirm with data, as with the engine's parameters.
- Work is sized rather than dated, because the longest waits are for people: **S** is a few commits in one package, **M** spans several packages, and **L** is a new service or a large body of content.
- Each milestone updates the documents it changes, in both languages, as [AGENTS.md](../AGENTS.md) requires. A finished stage updates [Roadmap](roadmap.md).

## 2. Stage 0: Preparation

| Id | Work | Size | Done when |
| :--- | :--- | :--- | :--- |
| E0.1 | Deploy the web and mathematics Workers to Cloudflare, which has not been done yet | M | A test account completes a lesson in production, and startup, memory and latency between Workers are measured ([Roadmap §2](roadmap.md#2-risks-and-open-items)) |
| E0.2 | Find an English teacher of grades 3 to 8 to review content, and a Chinese-speaking reviewer of explanations | S | Named people have agreed |
| E0.3 | Get legal advice on minors' text and recordings in each [first market](minors-data.md#4-market-rows) | S | Written advice on consent, retention and vendors, answering the questions in [Minors' Data](minors-data.md#13-enforcement-in-code-and-what-comes-when); speech and AI stages depend on it |
| E0.4 | Fix the first course's id and name. Course ids are unique across subjects and never change | S | The id, proposed as `english-grammar-writing`, is in this document |
| E0.5 | Choose word and frequency sources whose licenses allow use, and record them | S | `content/english/SOURCES.md` lists each source and its license |

**Gate G0.** The platform runs in production, a reviewer has agreed, and the legal question has an owner. Stage 1 can begin writing before E0.1 finishes, but its pilot cannot.

## 3. Stage 1: First Slice

### E1. Goal

The 41 topics of [§11 of the design](english-curriculum.md#11-first-slice), from compiler to real learners, testing whether mastery learning and implicit repetition work in English.

### E1.1 Subject Skeleton (M)

| Work | Files |
| :--- | :--- |
| Checkers and helpers of the subject | New `libs/subject-english` |
| Content package with `compileEnglish()`, shards and tests | New `content/english`, following `content/math` |
| Claiming and hand-over of courses | New `content/english/PROGRESS.md` |
| Gateway and one shard, `ga-english` and `ga-english-core`; `generate` writes the manifest | New `apps/english-workers`, following `apps/math-workers` |
| Binding `SUBJECT_ENGLISH` and its gateway | `apps/web/cloudflare.config.ts`, `apps/web/src/server/handler.ts`, `apps/web/vite.config.ts`, `apps/web/package.json` |
| Tools that only know mathematics take a subject | `tools/simulate`, `tools/audit` (`compileMath`, `docs/math-courses`), with outlines in new `docs/english-courses` |

**Done when** a course of two placeholder topics appears in the catalog beside mathematics and a lesson completes in `cf dev`, with both subjects loaded in one isolate within the memory limit (`Registry` keeps two subjects in memory).

### E1.2 Core Additions (M)

| Work | Files | Why |
| :--- | :--- | :--- |
| `CourseDef.explanationLocale`; the server reads lessons, problems and verdicts in that locale, and the interface keeps its own | `libs/content`, `libs/api` | Native courses explain in English whatever the interface language |
| A sampling rule of `content/english` that rejects an unescaped `$`; `\$` already writes a literal one | `content/english` | Text is Markdown with TeX between `$…$`, so `It costs $5 or $6` would render as math |
| Item bank helper: pick by seed, with the options and the sentences shuffled by seed | `libs/subject-english` | English has no random numbers to generate from |
| Input `order`: arrange a list by moving items; the response lists the indexes | `libs/content`, `libs/proto`, `apps/web` | `ordering-sentences-in-a-paragraph` |

Audience, audio and reading tasks are not added here; they wait for the stages that use them.

### E1.3 Checkers (M)

The core `text` checker lowercases its input and collapses whitespace, so it cannot judge capitals or punctuation. `libs/subject-english` adds:

| Checker | Accepts | Used by |
| :--- | :--- | :--- |
| `sentence` | Any listed sentence, exact in case and punctuation, normalizing only whitespace and curly quotes | Conventions and fixing errors |
| `sentence-pattern` | Sentences matching a pattern with alternatives and optional parts, such as `The dog barked(,) because it heard a noise.` | Combining and expanding |
| `word-form` | A word with the right form and spelling, with `same` so listed misspellings get feedback of their own | Words |

Tests include for each checker: accepted variants, near misses, Unicode punctuation and the mistakes listed by generators. A combining exercise names its connective and supplies its clauses, so that the accepted sentences can be listed in full. A learner's valid sentence that is rejected is a defect of the item: the pilot reports these (E1.6).

### E1.4 Content (L)

Written in this order, because each group is the prerequisite of the next and the first group tests the authoring kit:

| Order | Topics | Review |
| :--- | :--- | :--- |
| 1 | `subjects-and-predicates`, `complete-sentences-and-fragments`, `coordinating-conjunctions`, `expanding-with-because-but-so`, `base-words-and-affixes` | The reviewer reads all of them and the kit changes before anything else is written |
| 2 | The rest of grammar (14 topics) | Sampled by the reviewer |
| 3 | The rest of writing (12 topics) | Sampled by the reviewer |
| 4 | The rest of words (10 topics) | Sampled by the reviewer |

Each topic has 2 to 4 knowledge points, an item bank large enough to pass sampling and rarely repeat within a lesson (at least 8 items), wrong responses for every generator, and explanations in both locales. Passages and sentences are original. A content lint rejects items above the course's word level, once a word list exists.

**Done when** all 41 topics compile, generators pass `sampleGenerators`, the reviewer's defects are fixed, and encompassing weights have a recorded reason.

### E1.5 Simulation (S)

`tools/simulate` runs simulated students through the course. It checks that they finish, with fewer explicit reviews per topic than a mathematics course of the same breadth, and that no topic is unreachable or starves its dependents. English has a sparser graph in places, so unusual results lead to looking at the edges first. A typical student needs 2.45 explicit reviews per topic, against 3.84 on 3rd Grade Math, whose breadth is similar; most fall on word topics that no later topic practices yet. Weights are not raised to improve this number.

### E1.6 Outside Test and Pilot (M, mostly waiting)

| Work | Files or owner |
| :--- | :--- |
| A paper test written without the platform's items, in two equivalent forms | Reviewer |
| Report rejected responses that a person judges correct, as well as what it reports today | `tools/pilot` |
| Recruit 20 to 30 learners of grades 3 to 8 with guardians' signed consent, as [Minors' Data](minors-data.md#13-enforcement-in-code-and-what-comes-when) requires; run four weeks | The project owner |
| Weekly report, fixes and observed sessions, as in [Roadmap §3](roadmap.md#3-pilot) | Team |

**Gate G1.** Stage 2 begins when:

1. Learners improve on the outside test.
2. Valid sentences are rarely rejected: under 2% of responses (*starting*).
3. Learners keep to a pace near the simulated one.

If learners do not improve, the next work is on the method, not on more content. Decide together with the reviewer whether the cause is the content, the graph or the approach.

## 4. Stage 2: Reading and Writing

E2 and E3 are independent and can run at once. First, a short spike settles what [§13.6 of the design](english-curriculum.md#136-to-confirm-before-building) leaves open:

| Spike | Done when |
| :--- | :--- |
| `cf` can declare Workflows, the AI binding and Rate Limiting | Deployed in a test Worker, or a workaround is chosen and documented |
| pi-ai on Workers with real providers, through AI Gateway and the AI binding | Tool calls, invalid arguments, cancellation and streaming checked against real models; bundle size and startup measured |

### E2. Graded Reading and Knowledge (L)

| Id | Work | Files |
| :--- | :--- | :--- |
| E2.1 | `PassageDef`: text, level, depended topics and words, questions; a lexicon, with compiler checks | `libs/content`, `docs/content.md` |
| E2.2 | Share of known words per learner, a pure function with a parameter starting at 98% | `libs/engine`, `docs/learning-engine.md` |
| E2.3 | Task kind `reading` and event `reading`, with XP for time and partial credit to dependencies; frontier, reviews and quizzes stay as they are | `libs/engine`, `libs/proto`, `libs/db`, `libs/api` |
| E2.4 | Passages already read are not offered again as comprehension checks; replay yields the same state | `libs/engine` |
| E2.5 | Reading player, with reading time and blown-off detection | `apps/web` |
| E2.6 | Grades 3 to 5 reading, starting with 2 or 3 knowledge units of about 10 passages | `content/english` |

**Done when** simulated students get reading tasks in a sensible share of their time, replay reproduces state, and a pilot group reads without being flooded by unknown words. The pilot also tests the 98% parameter.

**Built ahead of G1.** The project owner chose to build E2.1 to E2.5 before the pilot of Stage 1, and they are done. They are code with no passages, so a course without reading units behaves as before. E2.6 and E2's pilot still wait for G1: if learners do not improve there, no passages are written.

### E3. AI Judgment of Writing (L)

| Id | Work | Files |
| :--- | :--- | :--- |
| E3.1 | Criteria, routes and prompts, and a `respond` tool; each quotation must be found in the learner's text or the result is rejected; tests on `faux` | New `libs/judge` |
| E3.2 | Worker with a Workflow per judgment: retries, a calibrated backup, and a limit of time and cost | New `apps/judge`, using the spike |
| E3.3 | Table `judgment`: answer, status, criteria and quotations, criterion version, model, prompt version, tokens, cost. `answer` gains a pending state and a score | `libs/db` |
| E3.4 | `SubmitAnswer` returns pending for an AI-judged item, and `GetSession` shows the verdict. The session waits for it. The event is appended only with the verdict, so replay never calls a model | `libs/proto`, `libs/api` |
| E3.5 | Item type without a `canonical` answer but with a model answer; length limits per level instead of the 2,000 characters in `CheckerRegistry` | `libs/content` |
| E3.6 | Attempts on one item: feedback with at most two points, rewriting, and passing on the revision | `libs/api`, `apps/web` |
| E3.7 | Writing player: a long text field, draft saving, waiting state, marked quotations | `apps/web` |
| E3.8 | `tools/calibrate`: runs a route on a scored set, reports agreement per criterion and writes the allowed routes | New `tools/calibrate` |
| E3.9 | Limits per learner, AI Gateway logs with no learner text, a cost alarm; learner text kept in clearly delimited data, with prompt injection tests | `apps/judge`, Cloudflare |
| E3.10 | Sampled human checks of live verdicts, tracking drift per route | `tools/calibrate` |
| E3.11 | Tables and checks for providers, routes and the [vendor register](minors-data.md#12-vendors), with no provider in the code. `tools/calibrate` writes them at first; then a platform administrator role and an [admin console](english-curriculum.md#131-ai-models) with write-only keys and a change log | `libs/db`, `libs/api`, `apps/web` |

**Failure behavior.** A failed judgment is never a failed answer. The learner sees that judging is delayed and can go on to other courses. Only one session per course can be active, so a learner cannot proceed in this course until the verdict arrives. A judgment that is still failing after its time limit lets the learner rewrite or skip with no result.

**Waiting targets (*starting*).** 95% of W2 and W4 verdicts within 30 seconds. An essay in W5 ends its session on submission and shows the verdict later.

**Content, in order.**

1. **W2 meaning checks** on the combining topics of the first slice, the cheapest and most checkable.
2. **W4 paragraphs**, one move at a time, in grades 3 to 8.
3. **W5 essays**, with outline, draft and revision, in grades 6 to 12.

W6 belongs to E7.

**Calibration.** Each criterion needs about 100 texts (*starting*) scored independently by two people. A route goes live when its Cohen's kappa with people is within 0.05 of the kappa between people (*starting*). A change of model, prompt or criterion version repeats this.

**Gate G2.** Stage 3 begins when:

1. Every live route has passed calibration.
2. Sampled checks show no drift.
3. The cost per active learner per month is measured and acceptable.
4. Learners improve on an outside writing test scored blind by people.

## 5. Stage 3: Foreign-Language Courses

### E4. A1 to B1, with Listening and S1 to S4 (L)

| Id | Work | Files | Done when |
| :--- | :--- | :--- | :--- |
| E4.1 | `audience` on knowledge points; `explanationLocale: "zh-CN"` courses | `libs/content`, `apps/web` | An adult beginner and a child see different examples in a test course |
| E4.2 | Audio on problems and explanations: an offline synthesis script with a reviewed voice, files in R2 named by content hash, a compiler check that each file exists | `libs/content`, new `tools/audio`, `apps/web` | Audio is cached and plays on slow networks |
| E4.3 | S1 listening, shipped first because it needs no microphone | `content/english` | Sound-discrimination topics pass sampling, with reviewers' checks of each audio file |
| E4.4 | Recording on the web and upload to R2 by a short-lived URL, with a lifecycle rule deleting files, the `speech` consent of [Minors' Data](minors-data.md#9-text-and-speech) and a microphone check; learners can skip | `apps/web`, `libs/api` | Recordings disappear on schedule, and learners without a microphone never get stuck |
| E4.5 | Speech interface behind `libs/judge`; a test of each speech-to-text service with 200 recordings of grammatical errors, for silent correction | `libs/judge`, `tools/calibrate` | The S4 service is chosen, or S4 is cut if none preserves errors |
| E4.6 | Pronunciation comparison of [§13.2 of the design](english-curriculum.md#132-recorded-speech): 200 to 300 clips (*starting*) rated by people, including Chinese first-language speakers, other accents and children, whose clips need the separate `research` consent of [Minors' Data](minors-data.md#9-text-and-speech) | `tools/calibrate` | A vendor is chosen, or target-word recognition replaces it for S2 |
| E4.7 | S2, S3 and S4 with low-confidence retries, on the web, then on mobile once P6 task players exist, using native recording | `apps/web`, `apps/nsh` | Low confidence asks for another recording and counts no failure, tested for each level |
| E4.8 | Courses in order A1, A2, B1, with the topics for speakers of Chinese (articles, tense, plurals, th, r and l) and practice balanced across the four strands | `content/english` | Each course compiles, is reviewed, and has time balanced across strands in simulation |
| E4.9 | Pilot of A1 and A2 with Chinese-speaking adults and other first languages, using an outside listening and speaking test | Team | Gate G3 |

**Gate G3.** Learners improve on the outside test, intelligible accented speech is rarely rejected (under 5%, *starting*), and legal review of recordings is complete in each market served. C1 and C2 then merge into the native courses as the design says.

## 6. Stage 4: Conversation and Both Ends

The three tracks are independent. E5 needs the cluster's details; E6 needs the audio and recording of E4.

### E5. S5, S6 and the Voice Service (L)

| Id | Work | Files | Done when |
| :--- | :--- | :--- | :--- |
| E5.1 | S5 retelling, judged by STT and AI coverage on the path of E3 | `libs/judge`, `content/english` | Coverage criteria pass calibration |
| E5.2 | Spike: Pipecat 1.15 or newer in a container, with a learner on a real phone connection; decide the license question for anything taken from Mavio | Scratch, then `apps/voice` | End-of-speech to first audio is measured in at least three regions |
| E5.3 | `apps/voice` with uv and pinned Python; `package.json` scripts run pytest, ruff and pyright, so that Nx sees it as any other project | `apps/voice`, `mise.toml` | `pnpm nx run-many -t typecheck test lint` includes it |
| E5.4 | Pipeline with faked speech services: voice activity, end of turn, barge-in, a longest pause by level, session limit | `apps/voice` | Tests pass with no network |
| E5.5 | Tickets, service credential and Protobuf messages; idempotent result writes | `libs/proto`, `libs/api`, `apps/voice` | Expired, forged and reused tickets are refused |
| E5.6 | `voice` in `compose.yaml`; a `SIGTERM` test during a session; a conversation with real services against `cf dev`, **in containers only** | `compose.yaml` | Stopping the container refuses new sessions and lets the current one finish |
| E5.7 | Conversation player on the web, with a microphone check, captions and an end-of-session summary | `apps/web` | A session completes end to end locally |
| E5.8 | Image with weights inside; a script that builds and pushes by digest. The repository has no CI, so this is a `mise` task until it does | `apps/voice`, `mise.toml` | The image starts without downloading anything |
| E5.9 | `deploy/voice`: base and overlays with Deployment, KEDA, PodDisruptionBudget, NetworkPolicy and `cloudflared`; locally rendered and validated only | `deploy/voice` | `kubectl kustomize` and schema validation pass |
| E5.10 | Test namespace on the cluster: Tunnel, secrets, rollout during a session, scale-down under drain | Cluster | Rollout loses no running session |
| E5.11 | Load test for sessions per pod; WebSocket stability through Tunnel for 20 minutes; measurements on mobile networks; decide if WebRTC is needed | Cluster | Capacity is recorded, and the transport decision is written into the design |
| E5.12 | Calibrate S6 rubrics on recorded test conversations; add limits and costs | `tools/calibrate` | Routes pass calibration |
| E5.13 | Production overlay, a small learner group first, then wider; alarms on sessions, latency, errors and cost | `deploy/voice` | Stable for a chosen period, with cost per minute measured |

**Needed from the cluster's owner before E5.9.** The region, whether KEDA and Prometheus are installed, the image registry, and how secrets are managed.

### E6. Phonics (L)

Kindergarten to grade 2: the sound and print strand, then oral reading fluency (S3) and listening comprehension. This relies on E4.2 and E4.4, and on speech recognition tested with children. Sessions assume an adult nearby, so the guardian's experience is part of the work: a pilot must include guardians, and sign-in and consent flows may change.

### E7. College and Exam Courses (L)

- **College and beyond:** research writing, critical reading and W6, with optional human review. Human review is a product decision needing its own plan and prices.
- **Grades 9 to 12:** rhetoric and literature, using only works in the public domain.
- **Exam courses:** IELTS, TOEFL, Cambridge and Gaokao, as practice-only courses over existing topics. Questions, texts and word lists from the tests are never copied, and each test's format is checked against its current official description when the course starts.

Each course is complete when it compiles, passes sampling and review, has its AI routes calibrated, and has shown improvement on an outside test when it is the first of its kind.

## 7. Across All Stages

### 7.1 Testing

| Layer | How |
| :--- | :--- |
| Checkers and generators | Vitest and `sampleGenerators`, in each package |
| Engine additions | Explicit times and seeds; replay reproduces state |
| Services and database | PGlite, with no running server |
| AI code | `faux`, with no network or keys. Real models run only in `tools/calibrate` and spikes |
| Voice service | pytest with faked speech services; real services by hand, with development keys in an ignored file |
| Deployment | Compose locally; manifests are rendered locally and first run in a test namespace |
| Learning | Outside tests, not the platform's own questions |

### 7.2 Dependencies on Other Phases

| Phase | Needed by | Why |
| :--- | :--- | :--- |
| Deployment to Cloudflare (E0.1) | E1.6 | A pilot needs a real service |
| P6 Mobile app | E4.7 | The app has no task players yet, so English works first on the web |
| P9 Billing | Before opening E3, E4.7 and E5 widely | AI and speech cost money per use, unlike mathematics, so pricing must cover them |
| P10 Calibration | After E1.6 | Weights and engine parameters are fitted per subject |

### 7.3 What Only People Can Do

| Item | Stage |
| :--- | :--- |
| Content review by teachers and Chinese-speaking reviewers | 1 onward |
| Outside tests, and recruiting learners and guardians | 1 onward |
| Legal review for minors' text and recordings | 0, and again before 3 |
| Human scoring of writing and speech for calibration | 2 and 3 |
| Vendor accounts, keys and contracts | 2 and 3 |
| Cluster details and access | 4 |

### 7.4 Cost Tracking

Every AI and speech call records its tokens or seconds and cost, grouped by use and course. Each gate reviews the cost per active learner per month; the total for content has not been estimated and is tracked per topic from E1.4.

### 7.5 What Stops the Plan

- **G1 fails:** no more content until the method is understood.
- **AI cannot reach calibration on a criterion:** that criterion is removed or split, and the item becomes rule-judged or a human-reviewed option. The bar is not lowered to pass the check.
- **No speech service preserves errors:** S4 and S5 lean on constrained forms, and S6 stays practice without scored grammar.
- **Legal advice forbids minors' recordings in a market:** speaking is turned off there for minors, and reading and writing keep working, as the design requires.
