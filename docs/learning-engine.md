# Learning Engine

> English | [简体中文](learning-engine.zh-CN.md)

This document specifies the learning engine: how Great Academy decides what a learner does next and how every answer changes what it knows about them. The engine lives in `libs/engine`. It is pure (no clock, no randomness except a seeded `Rng`, no I/O) and subject-agnostic: it sees only the compiled knowledge graph ([Content](content.md)) and the learner's event log.

The pedagogy it implements is described in [The Math Academy Way](the-math-academy-way.md). Where the book leaves a choice open, this document records our choice and its reason; the numbers are collected in [§8](#8-parameters).

---

## 1. State and Events

The engine is **event-sourced**. The database stores completed tasks, and the supervisor's decisions to start over, as events; the learner state is a fold over them:

```ts
state = replay(ctx, events, initialState);   // applyEvent, one event at a time
```

| Event | Recorded when | Data |
| :--- | :--- | :--- |
| `placed` | A course's diagnostic ends (or is skipped) | The course; topics placed as known; which of them were asked directly; the topics it was about; whether it was supplemental |
| `lesson` | A lesson ends | Topic, passed or failed, questions asked and answered correctly, the knowledge point a failed lesson stopped at, whether it was blown off (§10) |
| `review` | A review ends | Topic, correct answers, questions, whether it passed, the correct answers given after the reference, whether it was blown off |
| `quiz` | A quiz ends | One result per question, by topic, and whether it was late; whether it was a retake, whether it was blown off |
| `reading` | A passage's check ends | Passage, correct answers, questions, whether it was blown off |
| `retake` | The supervisor retakes a course's diagnostic (§9) | The course; the topics forgotten |
| `reset` | The supervisor resets the subject's knowledge profile (§9) | — |

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

**Failed lessons.** A topic whose lesson was failed leaves the frontier until each of its key prerequisites has had a repetition (explicit or implicit) after the failure. A failure usually means a weak prerequisite, so the engine repairs it first instead of retrying the same lesson immediately. Key prerequisites are those of the knowledge point the lesson failed at; when it declares none, the union of the knowledge points' `keyPrerequisites`, or the direct prerequisites when none are declared at all. The engine offers these **remedial reviews** itself, first among the reviews, whether the prerequisites are due or not (§5). Otherwise a learner whose remaining lessons had all failed would have nothing to learn until those prerequisites happened to come due: one simulated struggling learner spent months on due reviews alone.

**Teaching again.** Remediation escalates when reviews are not enough. Two remedial reviews of a prerequisite that fail in a row show that it is not held, and so do two lessons in a row that fail at the same knowledge point, its key prerequisites reviewed in between (`reteachAfterFailures`): the prerequisite, or the knowledge point's key prerequisites, are then marked `reteach`, once per run of failures. A single miss is not enough: in simulation, teaching again after every failed remedial review cost struggling learners a third more days. Such a topic stays learned, so what builds on it keeps its place, but its lesson is offered again, first on the frontier, with its explanations and worked examples, and the failed lesson waits for it. Passing it is a full repetition and clears the mark; failing it is a failed repetition and clears the mark too, so that the waiting lesson is tried again rather than the learner held on the prerequisite. Only topics of the course that are not assumed are taught again.

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

1. Until the learner is placed in the course, the **diagnostic**, alone (§9); after that, first, a **supplemental diagnostic** when one is due (§9).
2. A **quiz**, when one is due (§7).
3. A **passage to read**, when reading is below its share of the XP (below).
4. **Reviews** and **lessons** from the frontier, alternating, reviews first; after four reviews in a row, a lesson first. The reviews are the remedial reviews, of the topics missed on the last quiz (§7) and of the key prerequisites that failed lessons wait for (§3), then the compressed reviews of the other due topics.
5. Last, the optional **retake** of the last quiz, when one is offered (§7).

**Reading.** A course offers reading only if it lists reading units. The next passage is the first of the course that the learner has not read, whose predecessor in its unit has been read, whose topics are all known, and whose known running words reach `readingKnownShare`. A word counts as unknown only when a topic not yet known teaches it. A passage is offered while `readingXp` is below `readingXpShare` of all XP, so that a learner who always takes the first task reads too. A passage read once is never offered again, passed or not, because it no longer tests comprehension. Frontier, reviews and quizzes do not depend on reading.

A check that shows understanding (at least half right) gives each topic of the passage implicit credit of `readingCredit × weight`, under the same condition as other implicit credit. A failed check neither credits nor penalizes, since the passage may simply be hard.

**Spoken topics.** A topic answered aloud is in scope only while a speech route may hear the learner and the learner has not turned speaking off, for the day or until turned on again ([Content §3](content.md#3-topics)). Turning it off leaves a session waiting on a spoken question with nothing counted, and a course whose spoken topics wait only for speaking to come back is not finished. Spoken topics are never quizzed or asked by the diagnostic, since a quiz or a placement must not depend on a microphone.

**Lesson share.** When lessons are available, at least 25% of the offered tasks are lessons. Reviews never crowd out new learning; new learning is also the cheapest way to review, as the next point explains. The order matters too, since many learners take the first task: the state counts the reviews since the last lesson, and after four in a row a lesson comes first. Without this, a learner whose reviews keep failing and coming due could spend weeks on reviews alone.

**Repetition compression.** Due topics are not reviewed one by one:

1. Due topics that the guaranteed lessons will repair implicitly (they are encompassed with weight ≥ 0.5) are dropped.
2. The rest are covered greedily, as a set cover: each step chooses the learned topic whose repetition repairs the most uncovered due topics (itself and the due topics it encompasses with weight ≥ 0.5), preferring a topic that is itself due, then the more advanced one.

One review of an advanced topic thereby replaces several reviews of the simpler topics inside it.

## 6. Lessons and Reviews

**Lessons.** A lesson walks through the topic's knowledge points in order. For each, the learner reads the explanation and a worked example, then answers practice problems from the knowledge point's generator:

- the knowledge point **passes** once at least two answers on it are correct and the correct ones outnumber the wrong ones: two right in a row, or three after two slips;
- the lesson **fails** at the third wrong answer on one knowledge point.

A **practice-only** topic ([Content §3](content.md#3-topics)) starts directly with the practice problems. A learner who failed its lesson gets the explanations and worked examples when they come back to it.

**Difficulty.** A tiered knowledge point ([Content §4](content.md#4-knowledge-points-and-generators)) is practiced at three tiers. In a lesson its first question is easy and the last correct answer it needs is hard, with medium between; a wrong answer asks the same tier again. A review asks its first question at medium and the other planned ones hard, since it checks that the whole step holds, and the extra questions after slips at medium. A quiz starts at medium and steers toward `quizTargetAccuracy` correct: hard while the share of correct answers is above it, easy once it is more than 0.2 below. The problem shows its tier. A knowledge point that is not tiered ignores the tier.

**Multistep problems.** A multistep problem ([Content §4](content.md#4-knowledge-points-and-generators)) is asked part by part, each part after the answers to the ones before it, and counts as one question wherever questions are counted: it is correct only when every part is, and its time is the time of all its parts. Skipping a part, or a quiz's time running out during the problem, ends it with the parts answered, and it counts wrong.

Requiring more correct answers after each slip means a lucky guess is not enough, and stopping at the third slip, after at most five questions, keeps a struggling learner from grinding: the engine reroutes them to the prerequisites instead (§3). While a knowledge point is practiced, the session shows how many correct answers it has and how many it needs.

A passed lesson:

- learns the topic with `repNum` 0;
- estimates `speed = 0.5 + fewest / asked`, where `fewest` = knowledge points × 2 (a perfect lesson gives 1.5);
- counts as a full repetition of the topics it encompasses.

**Essays.** The lesson of an essay ([Content §5](content.md#5-answers-and-checkers)) asks once and passes or fails on that one text's verdict. A passed essay learns the topic with `speed` 1, since one text says nothing about pace, and counts as a repetition of the topics it encompasses. An essay is never reviewed, quizzed or asked by the diagnostic, so it never falls due: the topics it encompasses carry its practice on. While its verdict is awaited, its lesson is not offered again.

**Reviews.** A review needs three correct answers and asks up to five questions: three when every answer is right, one more after each wrong one. It starts from the topic's last (most complete) knowledge points, shuffled, and asks the further questions from the last ones again. It passes at the third correct answer, with result `correct / asked`, and fails (result 0) as soon as three correct within five has become impossible. The event records whether it passed. Each review also moves the topic's speed: `speed ← 0.8 · speed + 0.2 · (0.5 + correct / total)`.

**Reference.** Before answering a review question, the learner may look at the lesson of the knowledge point it asks. The server marks the question when the reference is opened, so the mark does not depend on the client. A correct answer after it counts fully toward passing, but earns `referenceCredit` of a correct answer's share of the repetition's result and of the XP, and the review earns no perfect bonus; the event counts these answers as `referenced`. Looking something up is better than guessing, and costs less than a failed review.

## 7. Quizzes

After every 150 XP, once at least four topics are learned, the learner is offered a quiz: eight questions, one per topic, with no hints and no feedback until the end. Three quarters of the topics are the most recently learned, and the rest are sampled from older topics. Topics the last quiz asked are left out while there are enough others, and so is a topic that another chosen topic encompasses with weight at least `minCoverWeight`, since that question already tests it.

**Time limit.** A quiz has `quizSecondsPerQuestion` seconds per question, two minutes, shown counting down. An answer that arrives more than `quizGraceSeconds` after the limit counts wrong; once the time is up the quiz ends, and the questions not answered count wrong and are marked late. Being slow is a miss as being wrong is: a topic that takes too long to recall has not been learned to fluency.

**As an exam.** The questions may be opened in any order, and each answer is saved, not judged, so it may be changed until the quiz is handed in. A multistep problem's parts are asked in order, and once one is saved its answers are final; so is an answer a model judged. Handing in, or the time running out, judges every answer saved; a question without one counts wrong.

Each correct answer is an explicit repetition with result 0.5, and each wrong answer is a failure (§4). The quiz is a retrieval test: it catches what reviews scheduled by the model would miss.

**Follow-up reviews.** The topics missed on a quiz are kept in the state (`lastQuiz.followUps`) and offered at once as remedial reviews, first among the reviews, due or not. A review of such a topic, passed or not, is its follow-up.

**Retake.** Once the follow-up reviews are done, a quiz that was not perfect may be taken once more, as an optional last task: the same topics with new questions. A retake earns the quiz's XP for each answer it improves on, (correct − correct the first time) / questions, and nothing for doing worse. Its answers are repetitions as a quiz's are, but it does not count as a quiz: the next one still comes 150 XP after the first, and a new quiz due replaces the offer.

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
| `supplementalMinTopics` | 2 | One gap is cheaper to teach than to ask about |
| `inferFoundationsRate` | 0.85 | Admits a learner who knows the foundations and slips now and then; a learner missing half of them scores about 0.5 |
| `adviceMinTopics` | 5 | Fewer topics of an earlier course say too little to send a learner back to it |
| `adviceWeakShare` | 0.3 | Missing almost a third of an earlier course's part in the foundations is more than lessons on the way can fill comfortably |
| `adviceAheadShare` | 0.8 | A learner who knows four fifths of a course learns more in the next one |
| `standingLessons`, `standingMinLessons` | 20, 10 | About a week of lessons: recent enough to follow a change, long enough that one bad day does not change the route |
| `fastMinSpeed`, `fastMaxFailRate` | 1.1, 0.1 | A fast sequence is for a learner who takes in new material quickly; failing more than one lesson in ten is Math Academy's warning sign |
| `slowSpeed`, `slowFailRate` | 1, 0.2 | Clearly short of the pace: slower than typical, or failing one lesson in five; between these and the fast bar the courses taken decide |
| `kpPass` | 2 | Two right is unlikely by chance yet quick for a learner who understands; each slip asks for one more |
| `kpMaxWrong` | 3 | Enough room for two slips; beyond that, a prerequisite is the likelier problem |
| `reteachAfterFailures` | 2 | One failure may be a bad day; two at the same step show its prerequisites need more than a review |
| `reviewQuestions`, `reviewPass`, `reviewMaxQuestions` | 3, 3, 5 | A short review when it goes well; a slip costs a question, not the review, and two slips still pass |
| `referenceCredit` | 0.5 | A correct review answer after the reference shows the step is partly held: half the credit of one without it |
| `quizEveryXp` | 150 | About every three to four days of 40 XP |
| `readingKnownShare` | 0.98 | The starting target for known running words; to be tuned by the pilot |
| `readingXpShare` | 0.2 | Volume matters, but must not crowd out the frontier; to be tuned by the pilot |
| `readingCredit` | 0.25 | Reading practices its topics lightly, far less than a review |
| `readingFailedXpShare` | 0.5 | The time was spent even when the check failed |
| `readingRushWpm` | 600 | Faster than anyone reads with understanding |
| `quizQuestions`, `quizMinTopics` | 8, 4 | Long enough to sample broadly, short enough for one sitting |
| `quizCredit`, `quizXp` | 0.5, 15 | One question is half a review |
| `quizSecondsPerQuestion`, `quizGraceSeconds` | 120, 5 | Enough to work a problem that is known; the grace covers the answer's way to the server |
| `quizTargetAccuracy` | 0.8 | Hard enough to find the edge of what is known, easy enough not to discourage, as in Math Academy |
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
| Strong | 0.95, 40 | 8.1 | 0.43 | 0 |
| Typical | 0.85, 30 | 9.8 | 0.69 | 0.95 |
| Struggling | 0.70, 20 | 15.8 | 2.08 | 8.5 |

Typical learners need fewer than one explicit review per topic, because lessons on later topics review earlier ones implicitly. Struggling learners get more explicit practice: their low speeds withhold implicit credit. The simulator's tests keep these properties from regressing.

On Prealgebra (218 topics, plus the arithmetic topics they build on) the same students need more explicit reviews: typical 347.1 days and 4.16 reviews per topic, strong 3.80, and struggling 6.24. Within the simulator's 365 days the typical student finishes in 18 of 20 runs and the struggling student in none; placed after the diagnostic, knowing what the course builds on, the typical student needs 162.3 days and the struggling one finishes in 19 of 20 runs. The course is broad rather than deep: many of its units (ratios and percentages, scientific notation, radicals, statistics, geometry) are practiced by few later topics in the course, so less of their review comes implicitly. Their encompassing topics come with Algebra I and Geometry. The weights record what each topic actually practices and are not raised to improve these numbers. Topics without authored encompassings use the inferred ones described in [content.md](content.md), which help strong students most: on 4th Grade Math reviews per topic fell from 3.14 to 2.30 for strong, 3.84 to 3.38 for typical and 5.13 to 5.11 for struggling students; on Linear Algebra from 3.41 to 3.27 for strong students, with typical and struggling students about unchanged.

On Algebra I (234 topics, plus the Prealgebra topics they build on, since the simulated students start from nothing) a typical student needs 324.9 days and 4.16 reviews per topic, a strong one 3.75, and a struggling one 6.20; the typical student finishes within 365 days in all 20 runs and the struggling one in none, and placed after the diagnostic they need 213.6 and 305.7 days. A review of the encompassings, recording every prerequisite that a topic's problems genuinely practice, lowered the typical count by about 3%. Most remaining reviews fall on topics that no later topic practices yet, such as work and mixture problems, coin problems, perpendicular lines, Vieta's formulas, radical equations and the profit models; they are reviewed explicitly until later units build on them.

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

**Supplemental diagnostic.** A course or the graph can change under a placed learner: a course gains foundations, or a topic gains a prerequisite. The learner then has gaps: topics in scope not known and never attempted, below a topic they know. Each `placed` event lists the topics its diagnostic was about (`checked`), and the state keeps them (`supplemented`). When at least `supplementalMinTopics` gaps were never part of a diagnostic, the first task is a **supplemental diagnostic** over just them, with the same questions and rules; its `placed` event is marked `supplemental`. Skipping it places nothing and marks the gaps as asked, so they are taught. It does not replace the course's diagnostic report.

**Starting over.** The supervisor can start a subject over in two ways ([Experience §5](experience.md#5-supervision)), each recorded as an event so that replaying gives the same state:

- **Retake the diagnostic** (`retake`) forgets the topics of the course's scope that a diagnostic placed and removes the course from the diagnosed list, so the next task is the course's diagnostic again. Topics taught in lessons stay: they were shown, not inferred, and their reviews correct them. The event names the topics it forgets (`retakeEvent`), so a later change of the course's scope does not change what was forgotten. The report waits for an answer again once the new diagnostic ends.
- **Reset the knowledge profile** (`reset`) forgets every topic of the subject and every diagnostic, and clears the count of blown-off tasks and reviews since a lesson, as for a new learner.

Both keep the XP, the quizzes taken and the passages read: they change what the engine believes is known, not the record of work. A task in progress in the course is abandoned.

**Current course.** As in Math Academy, a learner has one current course per subject. It is chosen and changed only by the learner's supervisor ([Experience §5](experience.md#5-supervision)): an adult or a teen no guardian follows for themselves, else a guardian. It changes by a deliberate choice, on the subject's Course page or in answer to the report below, and by promotion when the course is finished (below). Course pages introduce a course and do not enroll. Progress belongs to the subject, so a topic learned in one course counts in every course that has it, and changing course loses nothing. Past courses are kept as history.

**Starting earlier.** While a course's diagnostic is still due and the course needs more topics of earlier courses than it has of its own, counting only the foundations the learner has not shown they know and, on both sides, only the topics the learner can be taught (a topic judged by a model that no route may judge for them is left out, as in the course's own count of topics), the dashboard offers its supervisor to start with an earlier course instead: the one before it on the learner's route, else the first it builds on. The diagnostic would find the foundations already known; skipped, it leaves every one of them to be taught first, which a learner new to the subject is better served by in the earlier course. A learner who already learned those foundations in another course of the subject is not offered it.

**Report.** After a diagnostic that asked something, the dashboard shows a report until whoever chooses the course keeps it or takes the one recommended: the course's topics placed as known, the foundations still to learn, the dates the course would be finished at several daily paces, and `placementAdvice` (`libs/engine/src/courses.ts`):

- **later**, when at least `adviceAheadShare` of the course's XP is known and a course follows it: the course the learner would be promoted into (below);
- **earlier**, when the answers showed gaps in an earlier course: the lowest such course. Each course declares the courses it builds on ([Content §6](content.md#6-courses)), and the earlier courses are searched from the nearest. For each, the topics counted are its topics among the course's foundations that the answers resolved: those placed as known, and those shown not known, which are the topics answered wrongly and everything that depends on them. It is weak when at least `adviceMinTopics` are counted and the gaps make up at least `adviceWeakShare` of their XP;
- **stay** otherwise, and always after a skipped diagnostic.

Unresolved topics are not counted as gaps, although placement teaches them: counting them would send every learner to the first course. The `placed` event records the topics answered wrongly for this reason.

**Labels.** A foundation offered as a lesson or review names the course it comes from: the nearest earlier course that teaches it, else the first course of the catalog that does.

**Routes.** A subject declares sequences, routes through its courses such as Math Academy's traditional, integrated and honors high-school sequences ([Content §6](content.md#6-courses)). The learner's route is picked from their courses and from how they are doing now, never asked for, and never shown (`courseRoute`). How they are doing is the course's **standing** (`courseStanding`), read as Math Academy reads it, from lessons rather than answers: the mean learning speed (§1) of the topics learned in the latest `standingLessons` lessons of the current course, and the share of those lessons failed, known once there are `standingMinLessons` of them. Quizzes do not count, since they are kept near 80% right whoever takes them. A fast sequence (`fast`, [Content §6](content.md#6-courses)) covers the courses in less time than another, such as Prealgebra, which covers grades 6 to 8 in one course, or an honors sequence, which covers four years in three. A learner keeps its pace (`keepsPace`) when the topics are learned at `fastMinSpeed` or faster and at most `fastMaxFailRate` of the lessons are failed, falls clearly short of it below `slowSpeed` or above `slowFailRate`, and is not judged in between or while the standing is unknown. Among the sequences through the current course, a fast one is left out for a learner who falls short when its fallback, or the fallback's own where that is left out too, goes through the course; what it holds counts toward that fallback, as if the fallback led where it does and listed the courses it does. Of the rest the route is the one that leads on to the course the learner set out for, if they moved back from one; else the one that lists most of the courses they took; on a tie, the fastest when the learner keeps pace, else one that is not fast; else the first the subject lists. So a learner finishing 5th Grade Math goes on to Prealgebra only while keeping its pace, else to 6th Grade Math, the grade-by-grade route that the traditional and integrated routes fall back to. A learner of Prealgebra who came from Integrated Math I (Honors) heads back to it while keeping pace, and moves to the integrated route, the honors route's fallback, once they fall clearly short, which also drops the honors course as the one set out for; keeping pace again leads back to it. A learner already in Prealgebra or an honors course stays on a route through it, since no fallback goes through it. The university directions, such as probability and statistics or analysis, follow Math Academy's prerequisites and are a learner's choice, so they are picked from the courses taken and the course set out for, never from the pace. A course on no sequence has no route.

**The course set out for.** Choosing a course that comes before the current one, directly or not, as when the report recommends an earlier course, keeps the current one as the course set out for (`targetCourseId` of the learner's subject settings), or the one set out for before if it is still ahead. Choosing any other course forgets it, and so does promotion along a route that no longer leads to it.

**Promotion.** When every topic of the current course is learned, and no spoken topic waits for speaking to be turned back on, the learner is promoted into the next course (`nextCourse`), as Math Academy does: the one that follows on their route, else the first course that builds on the finished one; and when they moved back to fill gaps and that course does not lead back to the course set out for, that course itself, which is then forgotten once reached. Promotion happens when the profile or the dashboard is read, ends the finished course into the history, answers its report and clears the end date. It waits while the course's diagnostic report waits for an answer, since the report may recommend the next course itself, and does not happen into a retired course. The new course has its own diagnostic, as any course, and the dashboard says where the learner came from until they start a task in it. Only a finished course that nothing follows stays current, and the dashboard then congratulates and points to the catalog. The course sequence lists the courses after the current one the same way.

## 10. XP

XP approximates minutes of focused work and is computed from events. A task has a **full XP**: the topic's `xp` for a lesson, max(3, round(xp / 3)) for a review, 15 for a quiz, the passage's `xp` for reading. What it earns depends on how it went:

| Task | XP |
| :--- | :--- |
| Lesson with every answer correct | Full + 2 |
| Passed lesson, at least 80% correct | Full |
| Passed lesson, under 80% correct | Full × fraction correct |
| Failed lesson, at least 50% correct | max(1, round(full × 0.15)) |
| Failed lesson, under 50% correct | 0 |
| Passed review, every answer correct | Full + 2 |
| Passed review, some wrong | Full × fraction correct |
| Failed review | 0 |
| Quiz | Full × fraction correct, with no bonus |
| Quiz retake | Full × (correct − correct the first time) / questions, at least 0 |
| Reading, at least half right | Full |
| Reading, under half right | Full × 0.5 |
| Blown-off task | 0, or less after repeated ones (below) |

So XP rewards results and still credits honest effort: a poor lesson earns nothing, and the time it costs shows in the calendar, as the struggling student's extra days in §8 do.

**Blown-off tasks.** A task counts as blown off when it was not passed and at least two wrong answers, making up at least half of its wrong answers, arrived within six seconds of the question being served. The time is the server's, recorded per question, so the client cannot affect it. Failing slowly is never blowing off, nor is passing quickly, and the diagnostic is exempt. The event carries the verdict as `blownOff`, so a replay does not need the times.

A reading task counts as blown off when its check failed and the passage's words went by faster than `readingRushWpm`, since a learner reads before answering and the answers alone say little about the time spent.

The state counts recent blown-off tasks in `blowOffs`. The penalty for one is floor(blowOffs / 3) XP before counting it, capped at 10 and at the task's full XP: the first three cost nothing and serve as warnings, the next three cost 1 XP, and so on. Each passed task lowers the count by 0.2. A subject's XP total never falls below zero. A learner sees the warning on the result page, with what it means. The penalty's shape is set by `blowOffStep`, `blowOffMaxPenalty` and `blowOffDecay`, and calibrated on real learners: the pilot report (`tools/pilot`) counts the blown-off tasks and their share of all tasks, the learners with any and with three or more, and the XP the penalties took.

## 11. Goals and Forecast

Each subject has its own XP goal for each weekday, which the learner's supervisor sets or pauses. The week's goal is their sum; the dashboard compares today's and this week's XP in the subject with them, in the learner's time zone. Where XP of all subjects is shown, its goals are the sums of the subjects' goals. A subject may also have an end date for its current course, which changing course clears.

The forecast of a course is the lessons' XP not yet learned × (1 + `forecastOverhead`), divided by a pace in XP per day: the learner's average over the last 14 days and fixed paces to compare. It is an estimate, shown as a date, and changes with what the learner does.

## 12. Leagues

Leagues are optional, for every age band. A learner joins by turning them on; others see only the account's username and the weekly XP, never the name.

- **Week.** A league week starts on Monday 00:00 UTC, so it is one week for everyone. Total XP is unaffected; each week's standings start at zero.
- **Tiers.** Nine tiers: Iron, Bronze, Silver, Gold, Platinum, Sapphire, Ruby, Emerald, Diamond. A new member starts in Iron.
- **Groups.** The first XP earned in a week puts the learner in a group of at most 30 in their tier, the one with their pace band if one is open. The band comes from the XP of the last four weeks (under 100, 250, 500 per week, or more), so members can keep up with each other; a smaller platform has fewer full groups, so the band is a preference.
- **The end of a week.** Ranks go by XP, then by who joined first. The top third (rounded up) moves up and the bottom third (rounded down) moves down, none past the ends. A member with no XP at the end does not move up, and moves down unless in Iron.
- **Absence.** Each whole week missed lowers the tier by one. Pausing goals does not protect it.

There is no scheduled job: the outcome follows from the group's members and the immutable event log, so it is computed when needed.

