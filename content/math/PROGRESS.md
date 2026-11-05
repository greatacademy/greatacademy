# Math Content Progress

Several coding agents write mathematics content at the same time. This file is how they claim work and hand it over. It is a convention, not a lock: read it before starting, keep your own row current, and commit changes to it promptly.

The course catalog and outlines are in [docs/math-curriculum.md](../../docs/math-curriculum.md) and [docs/math-courses/](../../docs/math-courses/). Follow [AGENTS.md](../../AGENTS.md) for everything else.

## Rules

1. **Claim by course.** Pick an open row in the board below. Write your agent name in *Owner*, set *Status* to `in progress`, and commit only that change (`docs: claim <course> in content progress`) before you write any content. Never take a row someone else owns. If an owner seems gone, ask the user.
2. **Own your files.** Put a course's topics in `content/math/src/topics/<course-id>-*.ts`, for example `linear-algebra-matrices.ts`. Edit only your own topic files. If you need a helper from another file, export it with a minimal change and commit that change on its own.
3. **Topic ids are global.** Before you create a topic, search for its id (`grep -rn 'id: "<id>"' content/math/src`). Many topics appear in several courses: reuse the existing topic in your course definition instead of writing it again. Outline topics that are missing from the code are listed in the course outlines.
4. **Missing prerequisites.** If a topic you need belongs to another course:
   - If that course is claimed, add a line under *Requests*. Until it lands, point at the closest existing topic.
   - If that course is open, write the topic yourself in a file named after that course, and add a line under *Handoffs*.
5. **Shared files: small edits, committed at once.** These files are shared:
   - `content/math/src/shards/<shard>.ts`: add one import and one spread per topic file, in the shard of its stretch of the curriculum. Added knowledge points go through a map in the map list of each shard it touches.
   - `content/math/src/courses.ts`: add your `CourseDef` at the end.
   - `docs/content*.md` and `docs/roadmap*.md`.
   - This file.

   Change only your own lines, and commit right after the edit together with the content it registers. Never reformat or reorder other agents' lines.
6. **Commit only your own paths.** Stage files by name (`git add content/math/src/topics/linear-algebra-*.ts …`), never `git add -A` or `git add .`.
   - Run `pnpm nx affected -t typecheck test lint` before each commit.
   - If a check fails only because of another agent's uncommitted file, do not touch that file. Note it under *Requests* and wait.
   - If agents work in separate clones or worktrees, run `git pull --rebase` before committing and pushing.
7. **Finish a course.** A course is done when all of these are in place:
   - Its topics are written.
   - Its `CourseDef` is in `courses.ts`.
   - `pnpm nx run-many -t typecheck test lint` passes.
   - `docs/content.md` and `docs/roadmap.md` (and their `.zh-CN.md` versions) mention it.

   Then set *Status* to `done`, clear *Owner*, and claim the next row whose prerequisites are done.

## Improving Written Courses

All courses on the board are written; most remaining work improves them. To find it, run the audit:

```bash
pnpm nx run audit:audit -- /tmp/audit.md
```

The report lists outline topics missing from each course and the findings of heuristic checks, such as explanations under 15 words of prose, terse solutions, knowledge points with no `wrong` responses and visual topics without a figure. Findings are leads, not errors: confirm each one before changing content. Regenerate the report before starting rather than reusing an old one.

- Claim improvement work by course and check in *Notes* (for example "explanations"), and follow the rules above for files and commits.
- Every knowledge point explains its idea in at least 15 words of prose, and `content/math/src/content.test.ts` enforces this for every course; new knowledge points must meet it too.
- Every topic written by hand has at least two knowledge points; topics built by factories (`proofKp`, `placeValueKPs` and the like) get theirs from the factory. Solutions say why each step is taken, not only the result.
- *Two-option choice*: Abstract Algebra and Methods of Proof turn these into questions over four cases through `oneOfFourTopic`, except for questions with a Cayley table. The 45 that remain are questions about a figure, questions with long prompts and questions whose options are named things, where a yes-or-no check of one fact is reasonable; review them only where they dominate a course.
- *Exam lessons*: every SAT and ACT exam topic has a lesson of its own in `topics/exam-lessons-sat.ts` or `exam-lessons-act.ts`, on the method of its two kinds of questions; a test requires one for each topic, so a new exam topic needs one too.
- *Solution with no relation and under 10 words of prose*: a worked example shows the steps a learner cannot see yet, so a solution that only names the result, or says "compute" without computing, is a lead to fill in. The early grades and naming questions keep short solutions on purpose, such as "One of $10$ equal parts is $\\frac{1}{10}$"; read the rest.
- `tools/audit/src/aliases.ts` lists outline titles that a topic covers under another title. A course with one of those topics covers the entry, so the report lists only real gaps; add an entry only after reading the topic.
- These findings are known false positives; review them only after a content change:
  - *visual topic without a figure*: titles that say "graphing calculator" or "significant figures", where the problems use tables or no picture. Also exam topics where a figure adds nothing or gives the answer away: the equations of circles, Classifying Triangles, Describing Behavior of a Function Graph, and Finding a Net Cost or Profit, whose title only contains "net".
  - *canonical answer appears in the prompt*: questions where the answer is an equal quantity named in the prompt, such as $\sin T = \cos S$ or $\varnothing$ in the input instructions.
  - *topic in no course*: older topics whose ids must stay. Most are computed foundations, because course topics list them as prerequisites.
  - *duplicate topic titles*: an exam topic shares its outline title with the Fundamentals topic it builds on (about 60 findings). Also `units-of-time` and `units-of-time-and-elapsed-time`, and `mean-of-a-data-set` and `the-mean-of-a-data-set`, are different topics with one outline title, and no course contains both.

## Open Gaps

The board tracks whether a course exists, not whether it is finished. Measured on 2026-11-05:

- **University courses have fewer figures than school courses, by nature.** The share of knowledge points with one is Calculus II 12.4%, Mathematical Methods I 12.1%, Partial Differential Equations 12.0%, Calculus I 11.0%, Real Analysis 10.9%, Discrete Mathematics 10.9%, Multivariable Calculus 10.3%, Machine Learning 10.2%, Linear Algebra 10.1%, Linear Programming 9.5%, Differential Equations 9.5%, Complex Analysis 9.3%, Probability & Statistics 9.3%, Methods of Proof 8.8%, Number Theory 8.7%, Foundations III 8.5%, Mathematical Methods II 8.3% and Abstract Algebra 7.7%. Geometry is at 77.6%, Algebra II at 45.2% and Precalculus at 24.2%. Counting only the drawings of explanations, 1435 of the 12144 knowledge points have one: Geometry 72.7%, Algebra II 44.7%, Precalculus 21.1%, Algebra I 17.2%, Calculus I 3.0% and Calculus II 0.2%. The figure knowledge points added here were checked on contact sheets, not each in the real app.
- **Depth meets the design, except by intent.** Every course averages at least 3 knowledge points per topic, except SAT Math Prep (2.01) and ACT Math Prep (2.00), whose exam topics have two by design. Knowledge points added through `deeper-*.ts` add `addedPointXp` to the topic.
- **Courses outside the catalog have outlines of our own.** Grades 1 to 3 and the five courses beyond the catalog are in `docs/math-courses/`, written from the Common Core and from standard textbooks rather than taken from Math Academy. Grades 1 to 3 were checked standard by standard and no standard is missing. Comparing the five university courses with their standard syllabi added 15 topics (Number Theory 78, Real Analysis 82, Complex Analysis 59, Linear Programming 52, Partial Differential Equations 56), and each outline records what was left to a second course.
- **Generated text has been read in part.** Every course's dump was read in full on one sample per knowledge point, with the mathematics redone, and 1,261 knowledge points were read again on a seed whose question has a different form. All 12,000 or so knowledge points were then run on 40 seeds (about 484,000 problems) and searched for throws, `NaN`, float noise and empty divisions. The remaining variation of a generator has not been read: a wrong sentence on an unread seed is still possible, and `sampleGenerators` and the audit catch only what they test for. Figures in those rereads were checked for agreement with the text, not rendered. The real app was walked through 12 courses at desktop or phone width, without a formula error or overflow; those walks answered at random, so they cover display and flow, not every answer form.
- **Some questions are still simple by design.** Reading rewrote the questions whose prompt stated the result. The audit still lists 11 knowledge points whose canonical answer appears in the prompt (factorials, unions of intervals, trigonometric ratios, the Schwarz lemma, the strong triangle inequality), and these were read and kept because the answer has to be chosen, not copied. SAT and ACT topics have two knowledge points by design.
- **Scatter plot contexts are not tied to a direction, by design.** `describing-an-association-in-context` may show older cars costing more. The question tests reading the plot, and fixing the direction per context would let a student answer from common sense without reading it.
- **Encompassing edges were read one by one, on samples.** About 3,640 remain. Every non-exam edge was judged against one sample problem of each topic, and the batch judged most leniently was then judged again, which removed 524 more edges and corrected 71 more weights. All exam edges were reviewed by ids, and suspects by samples; 39 are excluded (`unpracticedBases`). A verdict rests on samples, with prompts sometimes cut short and figures unseen, so borderline edges remain in both directions, and only real review data can settle them.
- **What needs real students.** These cannot be done before launch, and [the pilot](../../docs/roadmap.md#3-pilot) is how they get done; `pnpm nx run pilot:report` reads its results. The reliability calibration (P10) and the estimate of XP per minute need real reviews, and so do the borderline encompassing edges. Pace is simulated: days at 30 XP a day (typical) and 20 (struggling), from nothing and with the course's prerequisites already known, which is what the diagnostic finds, are Real Analysis 360 and 547 against 78 and 123, Calculus I 344 and 499 against 135 and 198, Prealgebra 316 and 454 against 167 and 245, Algebra I 273 and 392 against 195 and 290, each from one simulated run. So a long total is mostly the prerequisites.
- **`grams-kilograms-and-liters` has no prerequisite**, since 2nd Grade does not teach mass or volume. It teaches them from the start, so this is accepted rather than open.

## Board

Status: `done`, `in progress`, `open` (claimable now), or `blocked` (prerequisite courses are not done).

| Course | Prerequisites (content) | Status | Owner | Notes |
| :--- | :--- | :--- | :--- | :--- |
| Foundations of Algebra, Prealgebra | — | done | | |
| Algebra I, Geometry, Algebra II, Precalculus | — | done | | |
| Calculus I | Precalculus | done | | |
| Calculus II | Calculus I | done | | 5 units, 160 topics |
| Linear Algebra | Calculus I | done | | Assigned slot **A**. Complete 8 units, 181 topics (revision complete: free-response checkers, signs and LaTeX polished) |
| Methods of Proof | Calculus I | done | | Assigned slot **B**. 7 units, 135 topics; Set Theory precedes Logic so the predicate topics can use sets |
| Discrete Mathematics | Methods of Proof | done | | Slot **B** after Methods of Proof. 8 units, 143 topics |
| 4th Grade Math, 5th Grade Math | — | done | — | 4th: 7 units, 141 topics; 5th: 9 units, 134 topics (`grade-4-*.ts`, `grade-5-*.ts`) |
| 6th, 7th and 8th Grade Math | 5th Grade Math (outline) | done | | Rebuilt to the full outlines. 6th: 8 units, 157 topics (`grade-6-*.ts`). 7th: 5 units, 27 modules, 170 topics (`grade-7-*.ts`). 8th: 9 units, 27 modules, 134 topics (`grade-8-*.ts`) |
| Integrated Math I, II, III | Prealgebra | done | | Assigned slot **E**. 3 courses (201, 211, 173 topics) reusing Algebra I, Geometry and Algebra II topics |
| Integrated Math I, II, III (Honors) | Prealgebra | done | | Assigned slot **E**. 3 courses (227, 331, 278 topics) providing an accelerated integrated pathway |
| Mathematical Foundations I, II, III | — | done | | Assigned slot **E**. 3 courses (358, 355, 323 topics) for adult foundational and calculus preparation |
| AP Calculus AB, AP Calculus BC | Calculus I, Calculus II | done | | 9 units (212 topics) and 16 units (305 topics) (revision complete) |
| Multivariable Calculus | Linear Algebra | done | | 6 units, 194 topics |
| Differential Equations | Multivariable Calculus | done | | 7 units, 159 topics (24 reused, 135 new) |
| Probability & Statistics | Multivariable Calculus | done | | 10 units, 181 topics (53 reused, 128 new) |
| Mathematics for Machine Learning | Calculus II, Linear Algebra | done | | 12 units, 301 topics (283 reused, 18 new) |
| Mathematical Methods for the Physical Sciences I, II | Calculus II | done | | 13 units (294 topics) and 12 units (238 topics) |
| Abstract Algebra | Methods of Proof, Linear Algebra | done | | 9 units, 129 topics |
| SAT Math Fundamentals, SAT Math Prep | Algebra II | done | | Assigned slot **F**. 2 courses: SAT Math Fundamentals (rebuilt to the full outline: 17 units, 658 topics, `sat-fundamentals-*.ts` for the 76 new ones) and SAT Math Prep (rebuilt as exam topics: 4 units, 284 topics, `sat-exam-*.ts`, with 32 ordinary topics kept) |
| ACT Math Fundamentals, ACT Math Prep | Precalculus | done | | Assigned slot **G**. 2 courses: ACT Math Fundamentals (rebuilt to the full outline: 7 units, 932 topics) and ACT Math Prep (rebuilt as exam topics: 6 units, 348 topics, `act-exam-*.ts`, with 2 ordinary topics kept; the outline lists "Solving Exponential Equations" in modules 1.1 and 3.16, and 3.16 holds "Finding Inputs of Exponential Functions" because a course lists a topic once); `act-*.ts` hold 27 topics and `act-fundamentals-*.ts` 29 more for outline titles that had no topic of their own |
| 1st, 2nd and 3rd Grade Math | — | done | | 1st: 13 units, 61 topics; 2nd: 14 units, 65 topics; 3rd: 14 units, 65 topics. Outside the reference catalog, so no outline |
| Number Theory, Real Analysis, Complex Analysis, Linear Programming, Partial Differential Equations | Set topic by topic | done | | 75, 79, 56, 50 and 52 topics. Outside the reference catalog, so no outline |

## Requests

Missing topics or helpers one agent needs from another. Use the format `- [requester → owner] topic-id: why`. Delete the line once it lands.

## Handoffs

Topics written for a course that someone else will claim. Use the format `- topic-id in <file> (written by <agent>)`. The course owner adds them to its `CourseDef`.

