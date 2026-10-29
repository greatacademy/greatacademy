# The Math Academy Way: Study Notes for Great Academy

> **Source:** Justin Skycak (advised by Jason Roberts), *The Math Academy Way: Using the Power of Science to Supercharge Student Learning*, working draft (Google Doc, ~510 pages), read on 2026-10-29. Several chapters (11, 24–28) and parts of the FAQ are still marked "in progress" in the draft.
>
> **Purpose:** Summarize the book's pedagogy and system mechanics, and pull out what Great Academy needs to design. Everything here is paraphrased; consult the original for exact wording and citations. Chinese version: [the-math-academy-way.zh-CN.md](the-math-academy-way.zh-CN.md).

## TL;DR

Math Academy is an attempt to automate the decisions of an expert one-on-one tutor. The book makes three claims:

1. **The learning science is settled; adoption isn't.** Active learning, mastery learning, spaced repetition, interleaving, retrieval practice and related strategies are well supported by research, yet classrooms rarely use them. They feel harder, demand more work from teachers, and clash with tradition.
2. **Only technology can apply them fully.** One teacher cannot track a separate review schedule and knowledge frontier for every student on every topic. Software can.
3. **The knowledge graph is the core technology.** Thousands of fine-grained topics, linked by prerequisite and *encompassing* relationships, make it possible to do mastery learning, adaptive diagnostics, targeted remediation and **hierarchical spaced repetition** (FIRe), where advanced practice counts as implicit review of simpler skills.

The claimed result: a serious student learns about **4× as much** as in a traditional classroom in the same time. Students pass about **95%** of lessons on the first try and **99%** within two tries.

---

## 1. Foundations

### 1.1 Bloom's two-sigma problem (Ch. 1)
- Bloom (1984) found that students given one-on-one tutoring plus mastery learning scored about two standard deviations above classroom-taught students. Tutoring is too expensive to scale.
- Bloom's work on talent development (elite athletes, musicians, mathematicians) showed a common pattern. Expert coaching, deliberate practice and accountability over many years produce elite performance. Ordinary schooling looks nothing like that.
- Math Academy frames itself as a *mathematical talent-development platform* that emulates an expert tutor at scale.

### 1.2 How the brain constrains design (Ch. 3, 7, 15)
- Information flows from sensory memory to working memory to long-term memory. **Working memory is tiny and short-lived; long-term memory is effectively unlimited.**
- Learning means increasing the quantity, depth, retrievability and generalizability of knowledge in long-term memory.
- **Working-memory capacity (WMC)** differs between people. It affects perceived effort, ability to abstract, and learning speed. Learning styles don't matter. Students need the same kind of practice in different amounts.
- **Automaticity** compresses low-level skills into single chunks, freeing working memory for higher-order reasoning. It is a prerequisite for creativity and problem solving, not an obstacle to them.
- There is an "abstraction ceiling." Most people can learn far more math than they do. They usually fall short because of missing foundations, ineffective practice, too little practice, or low motivation, not because of innate limits.

### 1.3 Accountability and incentives (Ch. 5, 23)
- Without accountability, classrooms drift toward mediocrity: grade inflation, a tragedy of the commons, and resistance to objective measurement.
- Teachers are "victims of circumstance." With 30 students whose knowledge profiles differ widely, every student effectively needs a private tutor.
- Math Academy holds itself accountable for measured learning. If students fail, it fixes the content (see §4.6).

### 1.4 Misconceptions the book argues against (Ch. 6–9)
- Neuromyths such as learning styles persist because they are comforting.
- Effective practice doesn't imitate professional work. Beginners need **direct instruction**, not unguided discovery or group projects (expertise reversal effect).
- Effective learning is effortful. Testing, repetition and computation are necessary.
- Acceleration is fine once prerequisites are mastered. It doesn't make learning shallow, and accelerated students don't run out of courses.

---

## 2. The learning strategies and how each is implemented

| # | Strategy (chapter) | Core idea | How Math Academy implements it |
|---|---|---|---|
| 1 | Active learning (10) | Every student must actively work on every piece of material. | Each lesson is a minimal explanation followed immediately by problem-solving. No passive video lectures. |
| 2 | Direct instruction (11, draft) | Beginners need explicit guidance. | Every knowledge point starts with a worked example. |
| 3 | Deliberate practice (12) | Effortful, individualized practice at the edge of ability, with immediate feedback. | Tasks always come from the student's knowledge frontier, and every answer gets immediate feedback. |
| 4 | Mastery learning (13) | Show proficiency on prerequisites before advancing. | The knowledge graph gates lessons: a topic unlocks only after its prerequisites are mastered. Learning is de-synchronized, so each student has their own path. |
| 5 | Minimizing cognitive load (14) | Keep each step within working-memory capacity. | Content is scaffolded about 10× more finely than a textbook: about 300 topics × 3–4 knowledge points ≈ 1,000 steps for calculus, versus about 100 textbook sections. Uses subgoal labels, dual coding (many diagrams, even in abstract algebra), and gradual removal of scaffolding (expertise reversal). |
| 6 | Developing automaticity (15) | Low-level skills must become effortless. | Spaced review, timed quizzes, and layering keep basic skills in continual use. |
| 7 | Layering (16) | Keep building on existing knowledge. Facilitation and structural integrity follow. | Students move forward as soon as prerequisites are mastered. The curriculum is highly connected: applications, explicit-connection topics, and multi-part problems. Lessons cover every problem type a student who knows the topic should be able to solve. |
| 8 | Non-interference (17) | Similar material learned close together causes confusion. | The student works on several dissimilar topics at once. Related topics are spread out over time. |
| 9 | Spaced repetition (18) | Spaced reviews consolidate memory and stretch the interval before the next review. | Hierarchical spaced repetition (HSRS) with FIRe; see §4.4. |
| 10 | Interleaving (19) | Mixed practice beats blocked practice for retention and for telling problem types apart. | Lessons use a short block of practice for first learning. Reviews and quizzes are interleaved (micro-interleaving), and the order of lessons is breadth-first (macro-interleaving). |
| 11 | Testing effect (20) | Retrieving from memory beats re-reading. | Frequent, low-stakes, timed, cumulative quizzes. Reviews are meant to be solved without looking at references. |
| 12 | Targeted remediation (21) | Strengthen the specific weak spot without lowering the bar. | Retry after a break, remedial reviews on key prerequisites, review after each missed quiz question, and fixing the content itself; see §4.6. |
| 13 | Gamification (22) | Game elements raise engagement, as long as they can't be gamed. | XP with bonuses and penalties, plus optional weekly league leaderboards; see §4.7. |

**Desirable difficulty** is the common thread. Most of these strategies feel harder and lower short-term performance, but they improve long-term retention and transfer. Students and teachers mistake that effort for poor learning, which is why the strategies stay underused. Gamification is the exception: it makes effort feel rewarding.

---

## 3. Curriculum and content model

### 3.1 Granularity
- The curriculum runs from 4th grade through university: Pre-Algebra, Algebra I/II, Geometry, Precalculus, Calculus I/II, AP Calculus BC, Linear Algebra, Multivariable Calculus, Differential Equations, Probability & Statistics, Discrete Math, Abstract Algebra, Methods of Proof, SAT prep, and others.
- A course has about **150–300 topics (lessons)**. A lesson has about **3–4 knowledge points (KPs)** of increasing difficulty. A KP is **one worked example plus 2–5 practice questions**; the number of questions adapts to performance.
- A course is just a subset of the global knowledge graph. **The knowledge graph is the source of truth**, and the course graph is a human-readable summary of it.
- All content is written in-house and checked against the major textbooks so each course covers a superset of their material.

### 3.2 Task types
| Task | Format | Scaffolding | Purpose |
|---|---|---|---|
| **Lesson** | Intro, then KP1…KPn (worked example + adaptive practice) | High (blocked) | Learn a new topic to baseline mastery. |
| **Review** | Several mixed questions from the topic's question pool, different from those already seen | Medium (example to use isn't obvious) | Spaced retrieval practice; earns repetition credit. |
| **Quiz** | Timed, cumulative across everything learned, no references, topics not announced | None | Measure automaticity and calibrate pace. Missed questions trigger remedial reviews. Retake allowed after a weak result. About a 30 XP window to start it. |
| **Multistep problem** | A complex scenario in parts, each part reusing an earlier skill | Per part | Higher-order thinking, layering, retrieval. |
| **Diagnostic** | Adaptive placement test with an "I don't know" button | None | Estimate the knowledge frontier. |
| **Supplemental diagnostic** | A handful of questions | None | Refresh the profile after the knowledge graph changes. |

"Reference mode" lets a student look back at a lesson during a review, but only as a last resort.

### 3.3 Core vs. supplemental topics (Ch. 32)
- Core topics are covered first. They get more cumulative practice and are prerequisites more often. No topic is skipped; only the order changes.
- The constraint: if a topic is core, all of its ancestors are core, and each course keeps a balance between core and supplemental topics. The actual algorithm is proprietary.
- About a third of the topics from 4th grade through AP Calculus BC are required by standards but are **not prerequisites for university math**. Removing them produces the faster *Mathematical Foundations* sequence for adults.

---

## 4. System mechanics

### 4.1 Knowledge graph schema (Ch. 4, 21, 29)
Entities: **Topic** (lesson), **Knowledge Point** (inside a topic), **Module**, **Course** (a set of topics), **Question** (a pool per KP).

Edges:
- **Prerequisite** (topic → topic): gates mastery learning and defines the knowledge frontier.
- **Key prerequisite** (KP → topic, which may be several levels back): the skill a specific KP depends on most directly. This drives targeted remediation.
- **Encompassing** (advanced topic → simpler topic, weight 0–1): the fraction of the simpler topic that the advanced topic practices implicitly. Roughly, the probability that a random advanced problem includes a random simpler problem. This drives FIRe. Partial weights are common in higher math.
- **Non-ancestor encompassing**: an equivalent topic in a different course that isn't a prerequisite (for example, algebra-based vs. calculus-based statistics). It carries full credit.
- **Mastery floor** (per course): lower-level topics automatically treated as known. They are far enough back, or below anything the diagnostic tests.

Setting weights: an expert sets them only on **direct and key prerequisite edges** where the weight is nontrivial, can't be inferred by propagation, and the topics are close in the graph. The number of such edges grows linearly with the number of topics. All other weights are inferred or assumed to be zero. A prerequisite edge can have encompassing weight 0 when only conceptual familiarity is needed.

### 4.2 Knowledge frontier
- A student's knowledge profile is the set of topics they know. Its edge, the **knowledge frontier**, is the set of topics whose prerequisites are all known. It plays the role of Vygotsky's zone of proximal development. One cited study found students were 3–4× more likely to master a topic on their frontier than one beyond it.
- The frontier is really a zone. Its lower edge is the conservative edge measured by the diagnostic (hardest question type, every topic). Its upper edge is the aggressive edge that layering uses (passed the lesson, not yet automatic).
- **Baseline mastery** (passing a lesson) is enough to build on. **Full mastery** takes months of spaced repetitions.

### 4.3 Adaptive diagnostic (Ch. 30)
- Goal: estimate the frontier across the course **and its foundations** (sometimes more than 1,000 topics) with about 20–40 questions for lower-grade courses and 40–60 for higher ones.
- Techniques:
  1. **Graph compression.** Choose the smallest set of topics that covers the course: a topic is covered if it has both an ancestor and a descendant in the compressed set within 3 prerequisite edges.
  2. **Propagation.** Strict causal propagation through encompassings, plus looser inference: correct answers credit prerequisites, wrong answers debit post-requisites, and a correct "leaf" topic credits the other leaf topics in its module.
  3. **Information-gain selection.** Ask where the system is least certain, so students get about half right whatever their level.
- **Plus-minus balance per topic.** The sign is the prediction (known or not); the magnitude is confidence. Each answer has weight 1 by default, reduced when a correct answer is excessively slow. Correct answers raise the topic and its ancestors; wrong answers lower the topic and its descendants. Topics with a positive balance start with that many repetitions.
- **Conflicts** (an advanced topic right but a simpler one wrong, or a correct answer that took too long) lower confidence. Topics placed out only narrowly become **conditionally completed**: they are assumed known, but the system "falls back" quickly if the student struggles on them.
- **Choosing a diagnostic question:** the simplest question that would convince an expert tutor the topic is mastered **and** that exercises every prerequisite. Avoid the hardest question in the topic, because it invites silly mistakes.
- Placement puts students **at the bottom of their lowest knowledge gap**, not at the top of their highest.
- Students cannot edit their own knowledge profile; credit comes only from demonstrated performance. They can retake the diagnostic, or reset everything with a "clean slate" after a long break.

### 4.4 Hierarchical Spaced Repetition System (HSRS) (Ch. 18, 29)
The book describes three parts.

**(a) Fractional Implicit Repetition (FIRe)**
- **Credit flows down.** Passing a review of an advanced topic gives implicit repetition credit to the topics it encompasses, recursively and scaled by the edge weights. Credit passes undiminished along a "trunk" of full encompassings and fades along partial ones.
- **Penalties flow up.** Failing a simpler topic penalizes the advanced topics that encompass it.
- Implicit credit is **discounted when it arrives early**, before the simpler topic's next review is due.
- When a student's learning speed on a topic is below 1, **incoming implicit credit is turned off and explicit reviews are required.** Weaker students don't reliably absorb implicit practice on difficult topics.

**(b) Per-student, per-topic repetition state**
| Variable | Meaning |
|---|---|
| `repNum` | Number of successful spaced repetitions accumulated (can be fractional). |
| `days` | Days since the last repetition. |
| `interval` | Ideal gap in days between repetition `repNum` and `repNum + 1`. |
| `memory` | Expected retention now. It decays over time; a review is due when it gets low enough. |
| `speed` | Student-topic learning speed. A review at speed 2 counts as 2 repetitions; at speed 0.5, as 0.5. |
| `rawDelta` | Credit earned from one repetition: positive for a pass, negative for a fail, larger for better passes or worse fails, and discounted if done early (memory still high). |
| `decay` | How fast a failed repetition moves the student backward. It starts at 1 and grows the more overdue the review was, which models the "summer slide." |
| `failed` | 1 if the repetition was failed, else 0. |

**Learning speed** combines student ability and topic difficulty:
- **Ability** is tracked per topic as accuracy weighted toward recent answers. Correct answers propagate down to encompassed topics and wrong answers propagate up. A new topic's initial value is predicted from its neighborhood: direct and key prerequisites, encompassings, and topics in the same module.
- **Difficulty** is the topic's accuracy across all serious students' assessment answers. It improves the starting prediction and acts as a correction: a hard topic means students needed more review, so the schedule slows.
- Low predicted speed doubles as **preventative remediation**: weak prerequisites get forced explicit reviews before a struggle happens.

**(c) Spaced Repetition Compression (task selection)**
- Collect every topic with a due review. Choose the **smallest set of reviews and new lessons whose implicit credit covers all of them.**
- Once due reviews are covered, look ahead: pick tasks that **head off upcoming reviews**, while climbing the graph evenly to keep many options open later.
- Result: a typical math course needs about **one explicit review per topic** on average. Flashcard-style SRS, with no encompassings, is the theoretical *minimum* efficiency. A fully encompassed chain approaches the theoretical *maximum* of zero explicit reviews.
- Reviews persist across courses: everything ever learned keeps being scheduled, and newer material usually satisfies those reviews implicitly.
- Spiral curricula are "the best a teacher can do by hand." True spaced repetition is the per-student, per-topic, adaptive version of the same idea.

### 4.5 Task dashboard
- The dashboard is "a menu, not a queue." It holds a varied set of high-importance tasks, and the student picks any of them.
- Importance combines how many reviews a task satisfies, how much later content depends on it, and other factors.
- Never show a review that a lesson already on the dashboard would satisfy.
- Tasks generally stay on the dashboard once added. Selecting tasks takes time, students would otherwise dodge tasks forever, and a task that has been waiting a while feels fairer to require.
- Hard rule: on average, at least about **25%** of a student's tasks should be lessons, so progress never stalls under a pile of reviews.
- When a missing foundation is concentrated in one area (often trigonometry), interleaving drops temporarily because few learning paths are open.

### 4.6 Remediation (Ch. 21)
| Type | Trigger | Action |
|---|---|---|
| Within a task | Wrong answers during a KP | More questions, up to the limit of 2–5. |
| Corrective, first failure | Lesson failed | Pause that path, let the student continue elsewhere, retry later with different questions. |
| Corrective, repeated failure | Failed twice at the same KP with no new progress | Remedial reviews on that KP's **key prerequisites**. If those fail, re-teach the prerequisite lessons. Rolling back is deliberately slow when there is strong prior evidence, so students can't game the system. |
| Quiz follow-up | Each missed quiz question | Immediate remedial review of that topic. Retake the quiz if the score was weak. |
| Preventative | Low predicted learning speed | Slower spacing and forced explicit reviews on weak prerequisites. |
| Foundational | Diagnostic finds gaps below the course | Start with course topics that don't depend on the gaps, to build momentum, then fill the gaps when they block progress. "Holistic mode" (filling every lower-grade gap) is off for university courses. |
| Content | Pass rate low on any topic, KP or question | Add scaffolding: a better explanation or example, an extra KP, or split the topic. **Never lower the standard.** Analytics go down to the individual question. |

The principle: **never lower the bar.** No giveaway hints, no "explain it a different way" loops, and no "I don't know" button outside the diagnostic. If a student needs many different explanations, either the original explanation was poor or a prerequisite is missing.

### 4.7 XP and gamification (Ch. 22)
- **1 XP ≈ 1 minute** of fully focused work for an average serious student at that level. XP is how daily goals are set and how behavior is incentivized.
- Rewards by quality: bonus XP for perfect work, full XP for nearly perfect, most XP for passable, a little for nearly passable, zero for poor, and **negative XP for blowing off a task.** Penalties grow if it continues.
- Penalties stop "XP hackers" from doing easy tasks and guessing randomly on hard ones. After penalties were introduced, those students' pass rates rose from under 50% to over 90%. Calibration rule: penalize as much as a tutor sitting beside the student would be frustrated.
- Optional **weekly leagues**: students compete in groups of similar ability, with promotion and demotion.
- Anti-cheating: individual paths, large question pools, randomized individual quizzes, and delays plus fresh questions on retries.
- **Progress is separate from XP.** Progress (the percentage of topics completed) only increases when a lesson is completed. Total course XP changes with performance, because reviews speed up or slow down, so it can't measure progress. Progress is naturally fast early in a course and slower near the end.
- Planned: XP that also accounts for how often the student looks back at worked examples.

### 4.8 Learning efficiency and pace (Ch. 31)
- **Learning efficiency** is how close a student gets to the course's maximum, based on pass rates and accuracy. Efficiency 1.0 means 1× the work; 0.5 means 2×; 0.25 means 4×.
- **Pace** is XP per weekday. The baseline is 40, roughly one focused class period. Empirically the efficiency multiplier is `(pace / 40)^0.1`, so doubling the pace adds about 7%.
- A course is about **3,000 XP** (Pre-Algebra about 2,000, Precalculus about 4,000, AP Calculus BC about 6,000).
  | Pace (XP/weekday) | Multiplier | 3,000 XP course takes |
  |---|---|---|
  | 160 | 1.15 | ~3 weeks |
  | 80 | 1.07 | ~7 weeks |
  | 40 | 1.00 | ~15 weeks |
  | 20 | 0.93 | ~32 weeks |
  | 10 | 0.87 | ~1.3 years |
  | 5 | 0.81 | ~3 years |
- The traditional equivalent, about 100 minutes per day for 36 weeks, would finish a course in 5–6 weeks at 100 XP per weekday, a 6× speedup (about 4× for AP Calculus BC once exam prep is counted). The recommended minimum is 15 XP per weekday.
- Estimated completion date = estimated XP remaining (which depends on performance) ÷ recent XP per day.
- Reviews behave like a credit-card balance: if the student slows down, the reviews owed from earlier lessons still come due, so the share of reviews goes up.

---

## 5. Key numbers

| Metric | Value |
|---|---|
| Topics per course | ~150–300 |
| KPs per lesson | ~3–4 |
| Questions per KP | 2–5 (adaptive) |
| Lesson pass rate | ~95% first try, ~99% within two |
| Diagnostic length | 20–40 questions (lower grades), 40–60 (higher) |
| Topics informed per diagnostic question | ~10 on average |
| Explicit reviews per topic over a course | ~1 on average |
| Minimum share of tasks that are lessons | ~25% on average |
| Target quiz accuracy | 80–85% (difficulty adapts) |
| XP per course | ~3,000 (2,000–6,000) |
| Baseline pace | 40 XP per weekday |
| Efficiency multiplier | (pace/40)^0.1 |
| Claimed speedup over a classroom | ~4× (up to 6× at equal time) |
| School-program outcome | Pre-Algebra through AP Calculus BC in grades 6–8, at about 40 XP/day |
| Warning signs of misuse | Failing more than 1 in 10 lessons, any negative XP, or under ~0.5 XP per minute |

---

## 6. Deliberate product stances and missing features

Each choice protects learning efficiency:
- **No choosing your own tasks.** The algorithm picks; more student agency is being explored only where it won't hurt efficiency.
- **No editing your knowledge profile.** Learners overestimate what they know.
- **No advance notice of quiz topics.** That would prime students and corrupt the signal.
- **No "I don't know" button** except on the diagnostic. Everything needed is in the worked example or reference mode.
- **No LLM tutoring chat.** Explanations are written by hand in small pieces and delivered at the right moment. The feedback loop is whether the student solved the problem. The authors argue that the hard parts of "AI for education" are scaffolding, sequencing, assessment, mastery gating, spaced repetition and remediation, not conversation.
- **No human tutoring support.** The content is refined until it rarely fails.
- **No support for very casual use** (an hour or two a month). The target is students who will work hard, trained "like athletes."
- **Paid product.** Depending on a huge casual user base would pull the product toward techniques that feel easy but teach less.
- **No note-taking advice.** Notes become a crutch; spaced repetition handles retention.

---

## 7. Coaching and student behavior (Ch. 24–28 drafts and FAQ)
- **Parents and guardians:** sit with young students for the first few lessons to model careful reading, working on paper, and the right use of references, then step back while watching the warning signs (§5).
- **Expected learning behavior:** be prepared; read for comprehension; work through worked examples on paper; slow down and justify each step; try independently before peeking at references; after about 5 minutes stuck, submit a best guess and study the solution.
- **Sessions:** short and frequent beats long and rare (for example, 6 × 30 minutes instead of 2 × 90). This builds habit, keeps focus high and limits forgetting. There's no hard daily maximum: stop when mistakes or zoning out start.
- **Habit** is the strongest predictor of future behavior. Consistent context matters. Doing a little on bad days protects the habit.
- **Praise:** the drafts touch on calibrating praise (for example, a 5-to-1 ratio) and on maintaining motivation under high accountability.

---

## 8. What the book does *not* specify (we must design these)
1. The exact formulas for `interval(repNum)`, memory decay, `rawDelta` scaling, the early-credit discount, and how `decay` grows.
2. How encompassing weights combine across several paths (product along a path? maximum or sum across paths?) and the cutoff depth.
3. The objective function and algorithm for Spaced Repetition Compression (probably a greedy weighted set cover with look-ahead and a "climb evenly" regularizer).
4. The core-topic labeling algorithm (described as proprietary).
5. The exact pass rule for a KP or review. Order matters: ✖✔✖✔✔ passes and ✔✔✖✔✖ may not. A sequential or streak-based rule is implied. *The website states the lesson rule (two correct in a row, at most 5 questions); see [math-academy-website.md](math-academy-website.md) §3.3. The rule for reviews is still unknown.*
6. XP values per task, bonus and penalty thresholds, and how "blowing off a task" is detected (time per question, guessing patterns).
7. How quiz difficulty is calibrated toward 80–85% accuracy, how quizzes are scheduled (roughly every N XP), and the retake rules. *The website gives about every 150 XP, and a retake with new questions after the remedial reviews; see [math-academy-website.md](math-academy-website.md) §3.5.*
8. How lessons are ordered within the frontier beyond "importance."
9. The tooling for authoring content and the knowledge graph. This is the real cost: years of work by a team of math experts.

## 9. Implications for Great Academy

**Adopt as-is (the core of the method):**
- A single global knowledge graph as the source of truth, with courses as views of it.
- Topic → KP → (worked example + adaptive questions) granularity, with key prerequisites per KP.
- Mastery gating on the frontier, de-synchronized learning, and a lesson → review → quiz progression that removes scaffolding over time.
- HSRS with FIRe-style credit flowing down and penalties flowing up, per-student-per-topic speed, and review compression.
- An information-gain diagnostic with plus-minus confidence and conditional completion.
- Remediation that never lowers the bar; content analytics down to the question.
- XP calibrated to minutes, with penalties; progress tracked separately from XP.

**Decisions specific to Great Academy:**
- **Other subjects:** learning efficiency depends on *encompassing density*. Physics, chemistry and programming are dense and would benefit fully. History, literature and vocabulary are close to flashcards and would fall back toward ordinary SRS. Estimate the encompassing density of a subject before committing to it.
- **Use of LLMs:** the book argues against *conversational tutoring*, not against AI in general. A promising use of LLMs is offline: drafting topic decompositions, KPs, worked examples and question variants, and proposing prerequisite and encompassing edges. Human experts review, and pass-rate analytics catch errors. This targets the biggest cost (§8.9) without breaking the "never lower the bar" principle. Free-response grading for less structured subjects is another candidate.
- **First build:** start with one dense vertical slice (for example, Pre-Algebra through Algebra I aligned to Common Core) to validate the graph schema, the scheduling engine and the authoring pipeline before scaling up.
