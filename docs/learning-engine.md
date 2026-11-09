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
| `lesson` | A lesson ends | Topic, passed or failed, questions asked and answered correctly, whether it was blown off (§10) |
| `review` | A review ends | Topic, correct answers, questions, whether it was blown off |
| `quiz` | A quiz ends | One result per question, by topic, whether it was blown off |
| `reading` | A passage's check ends | Passage, correct answers, questions, whether it was blown off |

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
3. A **passage to read**, when reading is below its share of the XP (below).
4. **Reviews** and **lessons** from the frontier, alternating, reviews first; after four reviews in a row, a lesson first. The reviews are the remedial reviews that failed lessons wait for (§3), then the compressed reviews of the other due topics.

**Reading.** A course offers reading only if it lists reading units. The next passage is the first of the course that the learner has not read, whose predecessor in its unit has been read, whose topics are all known, and whose known running words reach `readingKnownShare`. A word counts as unknown only when a topic not yet known teaches it. A passage is offered while `readingXp` is below `readingXpShare` of all XP, so that a learner who always takes the first task reads too. A passage read once is never offered again, passed or not, because it no longer tests comprehension. Frontier, reviews and quizzes do not depend on reading.

A check that shows understanding (at least half right) gives each topic of the passage implicit credit of `readingCredit × weight`, under the same condition as other implicit credit. A failed check neither credits nor penalizes, since the passage may simply be hard.

**Lesson share.** When lessons are available, at least 25% of the offered tasks are lessons. Reviews never crowd out new learning; new learning is also the cheapest way to review, as the next point explains. The order matters too, since many learners take the first task: the state counts the reviews since the last lesson, and after four in a row a lesson comes first. Without this, a learner whose reviews keep failing and coming due could spend weeks on reviews alone.

**Repetition compression.** Due topics are not reviewed one by one:

1. Due topics that the guaranteed lessons will repair implicitly (they are encompassed with weight ≥ 0.5) are dropped.
2. The rest are covered greedily, as a set cover: each step chooses the learned topic whose repetition repairs the most uncovered due topics (itself and the due topics it encompasses with weight ≥ 0.5), preferring a topic that is itself due, then the more advanced one.

One review of an advanced topic thereby replaces several reviews of the simpler topics inside it.

## 6. Lessons and Reviews

**Lessons.** A lesson walks through the topic's knowledge points in order. For each, the learner reads the explanation and a worked example, then answers practice problems from the knowledge point's generator:

- two correct answers **in a row** pass the knowledge point;
- the lesson **fails** as soon as passing the knowledge point within five questions has become impossible.

A **practice-only** topic ([Content §3](content.md#3-topics)) starts directly with the practice problems. A learner who failed its lesson gets the explanations and worked examples when they come back to it.

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
| `inferFoundationsMinAnswers` | 8 | Fewer answers say too little about the foundations as a whole |
| `inferFoundationsRate` | 0.85 | Admits a learner who knows the foundations and slips now and then; a learner missing half of them scores about 0.5 |
| `adviceMinTopics` | 5 | Fewer topics of an earlier course say too little to send a learner back to it |
| `adviceWeakShare` | 0.3 | Missing almost a third of an earlier course's part in the foundations is more than lessons on the way can fill comfortably |
| `adviceAheadShare` | 0.8 | A learner who knows four fifths of a course learns more in the next one |
| `kpStreak` | 2 | Two in a row is unlikely by chance yet quick for a learner who understands |
| `kpMaxQuestions` | 5 | Enough room for one or two slips; beyond that, a prerequisite is the likelier problem |
| `reviewQuestions`, `reviewPass` | 3, 2 | A short review that tolerates one slip |
| `quizEveryXp` | 150 | About every three to four days of 40 XP |
| `readingKnownShare` | 0.98 | The starting target for known running words; to be tuned by the pilot |
| `readingXpShare` | 0.2 | Volume matters, but must not crowd out the frontier; to be tuned by the pilot |
| `readingCredit` | 0.25 | Reading practices its topics lightly, far less than a review |
| `readingFailedXpShare` | 0.5 | The time was spent even when the check failed |
| `readingRushWpm` | 600 | Faster than anyone reads with understanding |
| `quizQuestions`, `quizMinTopics` | 8, 4 | Long enough to sample broadly, short enough for one sitting |
| `quizCredit`, `quizXp` | 0.5, 15 | One question is half a review |
| `minLessonShare` | 0.25 | At least one task in four is new learning |
| `maxReviewStreak` | 4 | About half a study day; no day passes on reviews alone. Three slowed typical learners by putting lessons before the reviews of their prerequisites |
| `xpPerfectBonus` | 2 | A small reward for all correct, as in Math Academy |
| `xpNearlyPerfect` | 0.8 | One slip in five costs nothing |
| `xpNearlyPassable`, `xpNearlyPassableShare` | 0.5, 0.15 | A failed lesson with half right was real work, so it earns a little |
| `rushSeconds`, `rushMinAnswers` | 6, 2 | Six seconds is too short to read a problem and the feedback before it and think; two such answers are not chance |
| `blowOffStep`, `blowOffMaxPenalty` | 3, 10 | Three warnings at 0 XP, then 1 XP more for every three more, up to 10 |
| `blowOffDecay` | 0.2 | Five passed tasks forgive one blown-off task, so that alternating with passed tasks does not escape the penalty |
| `forecastOverhead` | 1 | Simulated typical students earn 0.6 XP in reviews and quizzes per XP of lessons on a short course and about 1.3 on a long one |

These values come from the book's description and our judgment, not from data. Roadmap P10 recalibrates them against real learners' event logs, and replaying makes the change retroactive.

**Simulation.** `tools/simulate` runs simulated students through a course with the real content and the engine. A student answers correctly with probability `ability · (0.6 + 0.4 · memory)` and studies a fixed XP per day. Results on Foundations of Algebra (20 topics), 20 seeds each:

| Student | Ability, XP/day | Days | Explicit reviews per topic | Failed lessons |
| :--- | :--- | ---: | ---: | ---: |
| Strong | 0.95, 40 | 7.7 | 0.31 | 0.05 |
| Typical | 0.85, 30 | 10 | 0.76 | 1.8 |
| Struggling | 0.70, 20 | 16.6 | 2.36 | 11.3 |
| Typical, knows integers | 0.85, 30 | 7.7 | 0.93 | 1.4 |

Typical learners need fewer than one explicit review per topic, because lessons on later topics review earlier ones implicitly. Struggling learners get more explicit practice: their low speeds withhold implicit credit. The simulator's tests keep these properties from regressing.

On Prealgebra (218 topics, plus the arithmetic topics they build on) the same students need more explicit reviews: typical 350.7 days and 4.31 reviews per topic, strong 3.88, and struggling 6.19. Within the simulator's 365 days the typical student finishes in 14 of 20 runs and the struggling student in none. The course is broad rather than deep: many of its units (ratios and percentages, scientific notation, radicals, statistics, geometry) are practiced by few later topics in the course, so less of their review comes implicitly. Their encompassing topics come with Algebra I and Geometry. The weights record what each topic actually practices and are not raised to improve these numbers. Topics without authored encompassings use the inferred ones described in [content.md](content.md), which help strong students most: on 4th Grade Math reviews per topic fell from 3.14 to 2.30 for strong, 3.84 to 3.38 for typical and 5.13 to 5.11 for struggling students; on Linear Algebra from 3.41 to 3.27 for strong students, with typical and struggling students about unchanged.

On Algebra I (234 topics, plus the Prealgebra topics they build on, since the simulated students start from nothing) a typical student needs 302.0 days and 4.30 reviews per topic, a strong one 3.81, and a struggling one 6.26, finishing within 365 days in 2 of 20 runs. A review of the encompassings, recording every prerequisite that a topic's problems genuinely practice, lowered the typical count by about 3%. Most remaining reviews fall on topics that no later topic practices yet, such as work and mixture problems, coin problems, perpendicular lines, Vieta's formulas, radical equations and the profit models; they are reviewed explicitly until later units build on them.

```bash
pnpm nx run simulate:simulate                  # Foundations of Algebra
pnpm nx run simulate:simulate -- prealgebra    # Another course
```

## 9. Diagnostic

A learner new to a course is placed by an adaptive diagnostic over the topics of the course's scope not yet known. Each course has its own diagnostic, taken or skipped once (the state lists the diagnosed courses); topics learned in another course of the subject are not asked again, and a course with nothing left to place has no diagnostic. Every answer resolves more than the topic asked:

- **correct**: the topic and all its ancestors are known;
- **wrong** or "I don't know": the topic and all its descendants are not known.

The next question is the unresolved topic that maximizes min(topics resolved if correct, topics resolved if wrong), a binary search over the graph. The diagnostic asks at most min(n, 4 + ⌈2·log₂(n+1)⌉) questions for n topics. Each question uses the topic's diagnostic knowledge point ([Content §3](content.md#3-topics)).

Course topics left unresolved count as **not known**: placement errs on the side of teaching, since a lesson on something already known costs minutes, while a gap costs much more later. Foundations are different: a broad course has hundreds, and no affordable number of questions resolves them, so a learner who knows them all would sit through hundreds of lessons they do not need. Foundations left unresolved are therefore placed as known when the answers on foundations show the learner has them: at least `inferFoundationsMinAnswers` answers, of which at least `inferFoundationsRate` are correct. Otherwise they count as not known, and a foundation an answer showed is not known is never placed.

Placed topics start at `placedRepNum`, so they come back for review soon and a lucky placement is corrected by the first review.

**Current course.** As in Math Academy, a learner has one current course per subject. It is chosen when the account starts studying: by an adult or teen for themselves, by a guardian for a child. It changes only by a deliberate choice, in settings or in answer to the report below, and only a guardian changes a child's. Course pages introduce a course and do not enroll. Progress belongs to the subject, so a topic learned in one course counts in every course that has it, and changing course loses nothing. Past courses are kept as history.

**Report.** After a diagnostic that asked something, the dashboard shows a report until whoever chooses the course keeps it or takes the one recommended: the course's topics placed as known, the foundations still to learn, the dates the course would be finished at several daily paces, and `placementAdvice` (`libs/engine/src/courses.ts`):

- **later**, when at least `adviceAheadShare` of the course's XP is known and a course builds on it: the first such course;
- **earlier**, when the answers showed gaps in an earlier course: the lowest such course. Each course declares the courses it builds on ([Content §6](content.md#6-courses)), and the earlier courses are searched from the nearest. For each, the topics counted are its topics among the course's foundations that the answers resolved: those placed as known, and those shown not known, which are the topics answered wrongly and everything that depends on them. It is weak when at least `adviceMinTopics` are counted and the gaps make up at least `adviceWeakShare` of their XP;
- **stay** otherwise, and always after a skipped diagnostic.

Unresolved topics are not counted as gaps, although placement teaches them: counting them would send every learner to the first course. The `placed` event records the topics answered wrongly for this reason.

**Labels and the end of a course.** A foundation offered as a lesson or review names the course it comes from: the nearest earlier course that teaches it, else the first course of the catalog that does. When every topic of the current course is learned, the dashboard offers the courses that build on it.

## 10. XP

XP approximates minutes of focused work and is computed from events. A task has a **full XP**: the topic's `xp` for a lesson, max(3, round(xp / 3)) for a review, 15 for a quiz, the passage's `xp` for reading. What it earns depends on how it went:

| Task | XP |
| :--- | :--- |
| Lesson with every answer correct | Full + 2 |
| Passed lesson, at least 80% correct | Full |
| Passed lesson, under 80% correct | Full × fraction correct |
| Failed lesson, at least 50% correct | max(1, round(full × 0.15)) |
| Failed lesson, under 50% correct | 0 |
| Passed review or quiz, every answer correct | Full + 2 |
| Passed review, some wrong | Full × fraction correct |
| Failed review | 0 |
| Quiz, some wrong | Full × fraction correct |
| Reading, at least half right | Full |
| Reading, under half right | Full × 0.5 |
| Blown-off task | 0, or less after repeated ones (below) |

So XP rewards results and still credits honest effort: a poor lesson earns nothing, and the time it costs shows in the calendar, as the struggling student's extra days in §8 do.

**Blown-off tasks.** A task counts as blown off when it was not passed and at least two wrong answers, making up at least half of its wrong answers, arrived within six seconds of the question being served. The time is the server's, recorded per question, so the client cannot affect it. Failing slowly is never blowing off, nor is passing quickly, and the diagnostic is exempt. The event carries the verdict as `blownOff`, so a replay does not need the times.

A reading task counts as blown off when its check failed and the passage's words went by faster than `readingRushWpm`, since a learner reads before answering and the answers alone say little about the time spent.

The state counts recent blown-off tasks in `blowOffs`. The penalty for one is floor(blowOffs / 3) XP before counting it, capped at 10 and at the task's full XP: the first three cost nothing and serve as warnings, the next three cost 1 XP, and so on. Each passed task lowers the count by 0.2. A subject's XP total never falls below zero. A learner sees the warning on the result page, with what it means.

## 11. Goals and Forecast

A learner sets an XP goal for each weekday, or pauses them. The week's goal is their sum; the dashboard compares today's and this week's XP with them, in the learner's time zone.

The forecast of a course is the lessons' XP not yet learned × (1 + `forecastOverhead`), divided by a pace in XP per day: the learner's average over the last 14 days and fixed paces to compare. It is an estimate, shown as a date, and changes with what the learner does.

## 12. Leagues

Leagues are optional. A learner joins by choosing a public username and turning them on; only the username and weekly XP are shown to others.

- **Week.** A league week starts on Monday 00:00 UTC, so it is one week for everyone. Total XP is unaffected; each week's standings start at zero.
- **Tiers.** Nine tiers: Iron, Bronze, Silver, Gold, Platinum, Sapphire, Ruby, Emerald, Diamond. A new member starts in Iron.
- **Groups.** The first XP earned in a week puts the learner in a group of at most 30 in their tier, the one with their pace band if one is open. The band comes from the XP of the last four weeks (under 100, 250, 500 per week, or more), so members can keep up with each other; a smaller platform has fewer full groups, so the band is a preference.
- **The end of a week.** Ranks go by XP, then by who joined first. The top third (rounded up) moves up and the bottom third (rounded down) moves down, none past the ends. A member with no XP at the end does not move up, and moves down unless in Iron.
- **Absence.** Each whole week missed lowers the tier by one. Pausing goals does not protect it.

There is no scheduled job: the outcome follows from the group's members and the immutable event log, so it is computed when needed.

