# Learning Engine

> English | [简体中文](learning-engine.zh-CN.md)

This document specifies the learning engine: how Great Academy decides what a learner does next and how every answer changes what it knows about them. The engine lives in `libs/engine`. It is pure (no clock, no randomness except a seeded `Rng`, no I/O) and subject-agnostic: it sees only the compiled knowledge graph ([Content](content.md)) and the learner's event log.

The pedagogy it implements is described in [The Math Academy Way](the-math-academy-way.md). Where the book leaves a choice open, this document records our choice and its reason; the numbers are collected in [§8](#8-parameters).

---

## 1. State and Events

The engine is **event-sourced**. The database stores completed tasks as events; the learner state is a fold over them:

```ts
state = replay(ctx, events, initialState);   // applyEvent, one event at a time
```

| Event | Recorded when | Data |
| :--- | :--- | :--- |
| `placed` | A course's diagnostic ends (or is skipped) | The course; topics placed as known; which of them were asked directly |
| `lesson` | A lesson ends | Topic, passed or failed, questions asked and answered correctly |
| `review` | A review ends | Topic, correct answers, questions |
| `quiz` | A quiz ends | One result per question, by topic |

Because state is derived, a change of parameters or of a rule applies to every learner by replaying, and the event log is the audit trail of every decision.

Per topic the state holds `TopicState`:

| Field | Meaning |
| :--- | :--- |
| `learned` | The lesson was passed, or the diagnostic placed the topic |
| `repNum` | Number of successful spaced repetitions, fractional |
| `last` | Effective time of the last repetition |
| `speed` | How quickly this learner masters this topic, in [0.5, 1.5]; 1 is typical |
| `failedAt` | When the lesson was last failed |
| `explicitReviews` | Reviews done, for analysis |

## 2. Memory

Retention follows an exponential forgetting curve whose interval grows with each successful repetition:

```
interval(repNum) = min(1 day · 2.5^repNum, 365 days)
memory(now)      = 2^(−(now − last) / interval(repNum))
```

A topic is **due** when its memory falls to 0.5, that is one interval after its last repetition: 1 day after the lesson, then about 2.5, 6, 16, 39 days and so on. `repNum` is fractional, so partial credit lengthens the interval smoothly.

## 3. The Frontier

A course is a view over the subject's graph ([Content §6](content.md#6-courses)). Its **scope** is its topics plus its foundations; the mastery floor and its ancestors are **assumed** known and never taught or reviewed.

The **frontier** is the set of topics the learner can learn next: in scope, not learned, and with every prerequisite known. It is listed in teaching order (foundations first, then the course order).

**Failed lessons.** A topic whose lesson was failed leaves the frontier until each of its key prerequisites has had a repetition (explicit or implicit) after the failure. A failure usually means a weak prerequisite, so the engine repairs it first instead of retrying the same lesson immediately. Key prerequisites are the union of the knowledge points' `keyPrerequisites`, or the direct prerequisites when none are declared. The engine offers these **remedial reviews** itself, first among the reviews, whether the prerequisites are due or not (§5). Otherwise a learner whose remaining lessons had all failed would have nothing to learn until those prerequisites happened to come due: one simulated struggling learner spent months on due reviews alone.

## 4. Repetitions and FIRe

Every explicit repetition (a lesson, a review, a quiz answer) has a **result** in [0, 1] and is propagated through the encompassing edges. This is **Fractional Implicit Repetition** (FIRe).

**Encompassing closure.** If A encompasses B with weight w₁ and B encompasses C with weight w₂, A encompasses C with weight w₁·w₂. When several paths exist, the largest product is used.

**Credit (result > 0).** The topic receives credit `result`, and every learned topic it encompasses receives `result · w`. A credit f:

- adds `f · early · speed` to `repNum`;
- moves `last` the fraction f of the way to now, so memory is restored in proportion to the credit.

`early` discounts repetitions made before the topic is due: 0 right after a repetition (memory 1), 1 once due (memory ≤ 0.5), linear in between. Reviewing something that is still fresh barely strengthens it, which matches the spacing effect.

Topics on which the learner is **slow** (speed < 1) receive **no implicit credit**. A learner who struggled with a topic needs to practice it explicitly; credit from harder topics would hide the weakness.

**Penalty (result 0).** The topic loses one repetition and its memory is reset (`last` = now), so it becomes due again after a short interval. Every learned topic that encompasses it loses `w · 0.5` repetitions, without the reset: they depend on the failed skill and should come back sooner, but they were not themselves shown to be forgotten.

## 5. Tasks

`nextTasks` offers up to six tasks:

1. Until the learner is placed in the course, the **diagnostic**, alone (§9).
2. A **quiz**, when one is due (§7).
3. **Reviews** and **lessons** from the frontier, alternating, reviews first; after four reviews in a row, a lesson first. The reviews are the remedial reviews that failed lessons wait for (§3), then the compressed reviews of the other due topics.

**Lesson share.** When lessons are available, at least 25% of the offered tasks are lessons. Reviews never crowd out new learning; new learning is also the cheapest way to review, as the next point explains. The order matters too, since many learners take the first task: the state counts the reviews since the last lesson, and after four in a row a lesson comes first. Without this, a learner whose reviews keep failing and coming due could spend weeks on reviews alone.

**Repetition compression.** Due topics are not reviewed one by one:

1. Due topics that the guaranteed lessons will repair implicitly (they are encompassed with weight ≥ 0.5) are dropped.
2. The rest are covered greedily, as a set cover: each step chooses the learned topic whose repetition repairs the most uncovered due topics (itself and the due topics it encompasses with weight ≥ 0.5), preferring a topic that is itself due, then the more advanced one.

One review of an advanced topic thereby replaces several reviews of the simpler topics inside it.

## 6. Lessons and Reviews

**Lessons.** A lesson walks through the topic's knowledge points in order. For each, the learner reads the explanation and a worked example, then answers practice problems from the knowledge point's generator:

- two correct answers **in a row** pass the knowledge point;
- the lesson **fails** as soon as passing the knowledge point within five questions has become impossible.

Requiring a streak rather than a count means a lucky guess is not enough, and stopping at five keeps a struggling learner from grinding: the engine reroutes them to the prerequisites instead (§3).

A passed lesson:

- learns the topic with `repNum` 0;
- estimates `speed = 0.5 + fewest / asked`, where `fewest` = knowledge points × 2 (a perfect lesson gives 1.5);
- counts as a full repetition of the topics it encompasses.

**Reviews.** A review asks three questions, starting from the topic's last (most complete) knowledge points and shuffled. Two or more correct is a pass with result `correct / 3`; fewer is a failure (result 0). Each review also moves the topic's speed: `speed ← 0.8 · speed + 0.2 · (0.5 + correct / total)`.

## 7. Quizzes

After every 150 XP, once at least four topics are learned, the learner is offered a quiz: eight questions, one per topic, with no hints and no feedback until the end. Three quarters of the topics are the most recently learned, and the rest are sampled from older topics.

Each correct answer is an explicit repetition with result 0.5, and each wrong answer is a failure (§4). The quiz is a retrieval test: it catches what reviews scheduled by the model would miss.

## 8. Parameters

| Parameter | Value | Rationale |
| :--- | :--- | :--- |
| `baseIntervalDays` | 1 | The first review the day after a lesson, as in the book |
| `intervalGrowth` | 2.5 | The usual ease factor of spaced repetition systems (SM-2 starts at 2.5) |
| `maxIntervalDays` | 365 | A topic is reviewed at least once a year |
| `dueMemory` | 0.5 | Due after exactly one interval; reviews at about 50% retention are both efficient and hard enough to be desirable |
| `failPenalty` | 1 | A failure undoes one successful repetition |
| `implicitPenaltyScale` | 0.5 | Encompassing topics share the blame, but only half, since they were not themselves tested |
| `minCoverWeight` | 0.5 | A repetition repairs a due topic only if it practices at least half of it |
| `minSpeed`, `maxSpeed` | 0.5, 1.5 | Speed scales credit; the bounds keep one lesson from dominating |
| `placedRepNum` | 1 (+0.5 if asked) | Placed topics are known but not recently practiced; a direct correct answer is stronger evidence |
| `kpStreak` | 2 | Two in a row is unlikely by chance yet quick for a learner who understands |
| `kpMaxQuestions` | 5 | Enough room for one or two slips; beyond that, a prerequisite is the likelier problem |
| `reviewQuestions`, `reviewPass` | 3, 2 | A short review that tolerates one slip |
| `quizEveryXp` | 150 | About every three to four days of 40 XP |
| `quizQuestions`, `quizMinTopics` | 8, 4 | Long enough to sample broadly, short enough for one sitting |
| `quizCredit`, `quizXp` | 0.5, 15 | One question is half a review |
| `minLessonShare` | 0.25 | At least one task in four is new learning |
| `maxReviewStreak` | 4 | About half a study day; no day passes on reviews alone. Three slowed typical learners by putting lessons before the reviews of their prerequisites |

These values come from the book's description and our judgment, not from data. Roadmap P10 recalibrates them against real learners' event logs, and replaying makes the change retroactive.

**Simulation.** `tools/simulate` runs simulated students through a course with the real content and the engine. A student answers correctly with probability `ability · (0.6 + 0.4 · memory)` and studies a fixed XP per day. Results on Foundations of Algebra (20 topics), 20 seeds each:

| Student | Ability, XP/day | Days | Explicit reviews per topic | Failed lessons |
| :--- | :--- | ---: | ---: | ---: |
| Strong | 0.95, 40 | 5.7 | 0.24 | 0 |
| Typical | 0.85, 30 | 7.8 | 0.55 | 1.3 |
| Struggling | 0.70, 20 | 11.4 | 1.40 | 5.8 |
| Typical, knows integers | 0.85, 30 | 5.9 | 0.58 | 0.7 |

Typical learners need fewer than one explicit review per topic, because lessons on later topics review earlier ones implicitly. Struggling learners get more explicit practice: their low speeds withhold implicit credit. The simulator's tests keep these properties from regressing.

On Prealgebra (72 topics) the same students need more explicit reviews: typical 32.6 days and 2.06 reviews per topic, strong 1.31, struggling 4.12 over 54 days, since a slower learner also has more time for reviews to come due. Many of the units it adds (number theory, decimals and percents, radicals, ratios, statistics, geometry) are broad rather than deep: few later topics in the course practice them, so less of their review comes implicitly. Their encompassing topics come with Algebra I and Geometry. The weights record what each topic actually practices and are not raised to improve these numbers.

```bash
pnpm nx run simulate:simulate                  # Foundations of Algebra
pnpm nx run simulate:simulate -- prealgebra    # Another course
```

## 9. Diagnostic

A learner new to a course is placed by an adaptive diagnostic over the topics of the course's scope not yet known. Each course has its own diagnostic, taken or skipped once (the state lists the diagnosed courses); topics learned in another course of the subject are not asked again, and a course with nothing left to place has no diagnostic. Every answer resolves more than the topic asked:

- **correct**: the topic and all its ancestors are known;
- **wrong** or "I don't know": the topic and all its descendants are not known.

The next question is the unresolved topic that maximizes min(topics resolved if correct, topics resolved if wrong), a binary search over the graph. The diagnostic asks at most min(n, 4 + ⌈2·log₂(n+1)⌉) questions for n topics. Each question uses the topic's diagnostic knowledge point ([Content §3](content.md#3-topics)).

Topics left unresolved count as **not known**: placement errs on the side of teaching, since a lesson on something already known costs minutes, while a gap costs much more later. Placed topics start at `placedRepNum`, so they come back for review soon and a lucky placement is corrected by the first review.

## 10. XP

XP approximates minutes of focused work and is computed from events:

| Event | XP |
| :--- | :--- |
| Passed lesson | The topic's `xp` |
| Failed lesson | 0 |
| Passed review | max(3, round(xp / 3)) × correct / total |
| Failed review | 0 |
| Quiz | 15 × fraction correct |

Failures earn no XP: XP rewards results, so it stays an honest measure of progress. The time a failure costs shows in the calendar instead, as the struggling student's extra days in §8 do.
