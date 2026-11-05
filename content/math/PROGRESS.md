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
   - `content/math/src/index.ts`: add one import and one spread per topic file.
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
- `tools/audit/src/aliases.ts` lists outline titles that a topic covers under another title. A course with one of those topics covers the entry, so the report lists only real gaps; add an entry only after reading the topic.
- These findings are known false positives; review them only after a content change:
  - *visual topic without a figure*: titles that say "graphing calculator" or "significant figures", where the problems use tables or no picture. Also exam topics where a figure adds nothing or gives the answer away: the equations of circles, Classifying Triangles, Describing Behavior of a Function Graph, and Finding a Net Cost or Profit, whose title only contains "net".
  - *canonical answer appears in the prompt*: questions where the answer is an equal quantity named in the prompt, such as $\sin T = \cos S$ or $\varnothing$ in the input instructions.
  - *topic in no course*: older topics whose ids must stay. Most are computed foundations, because course topics list them as prerequisites.
  - *duplicate topic titles*: an exam topic shares its outline title with the Fundamentals topic it builds on (about 60 findings). Also `units-of-time` and `units-of-time-and-elapsed-time`, and `mean-of-a-data-set` and `the-mean-of-a-data-set`, are different topics with one outline title, and no course contains both.

## Open Gaps

The board tracks whether a course exists, not whether it is finished. Measured on 2026-11-04:

- **University courses have few figures.** The share of topics with one is Partial Differential Equations 27%, Real Analysis 19%, Calculus I 16%, Discrete Mathematics 16%, Number Theory 14%, Precalculus 11%, Calculus II 9%, Differential Equations 8%, Linear Algebra 7%, Multivariable Calculus 7%, Methods of Proof 7%, Linear Programming 7%, Probability & Statistics 6%, Complex Analysis 6% and Abstract Algebra 4%. Add more in `topics/figure-reading-more.ts`.
- **Most topics are below the design.** Against the 3 to 4 knowledge points of the design, only Algebra I (3.00), Geometry (3.13), Algebra II (3.12), Mathematical Foundations II (3.04) and the Integrated Math courses (3.04 to 3.11, except III Honors at 2.63) reach it. Discrete Mathematics averages 2.92, Complex Analysis 2.91, Linear Programming 2.83, 8th Grade 2.72, Methods of Proof 2.70, Abstract Algebra 2.69, Calculus II 2.67, Linear Algebra 2.67, Partial Differential Equations 2.67, Number Theory 2.66, Probability & Statistics 2.66, Calculus I 2.65, Precalculus 2.64, Differential Equations 2.60, Real Analysis 2.58, 7th Grade 2.57, Multivariable Calculus 2.51, Prealgebra 2.49, 2nd Grade 2.46, 1st Grade 2.44, 6th Grade 2.42, 3rd Grade 2.38, 4th Grade 2.38, 5th Grade 2.35 and Foundations of Algebra 2.35. SAT Math Prep and ACT Math Prep stay at 2.00 by design: they practice topics taught in the Fundamentals courses.
- **Courses outside the catalog are short.** Number Theory (50), Real Analysis (43), Complex Analysis (34), Linear Programming (30) and Partial Differential Equations (30) are far smaller than the catalog's university courses (129 and up), and 1st, 2nd and 3rd Grade (61, 65 and 65) than 4th Grade (141). They have no outline to measure against.
- **Some generated text is lightly read.** One sample prompt per knowledge point was read for the additions to 1st, 2nd and 3rd Grade, and their figures were read for one seed at low resolution. Their explanations had less proofreading than their prompts, and none of these courses has been used in the real app.
- **Some questions test little.** A few reduce a skill to reading a number off the prompt. They were found by reading samples, so more may remain in the university courses.
- **Encompassing edges are only partly reviewed.** There are about 5,050 edges. Two seeded samples, of 70 and of 170, were read. About 5% of the first and 10% of the second were doubtful, mostly a topic pointing at a sibling it does not exercise. The twenty found were removed, so hundreds like them likely remain, each giving a small unearned credit. `encompassings.ts` also holds inferred weights for topics with no encompassings of their own. Writing reviewed encompassings on a topic and deleting its entry improves on them.
- **Large courses take more than a year at a low pace.** In simulation at 20 to 30 XP a day, 16 of the first 39 courses simulated hit the 365-day cap for a typical student and 25 for a struggling one. Among the courses added since, a struggling student finishes Real Analysis in 1 of 3 runs and Complex Analysis in none, because of the prerequisites they pull in. This is a matter of pace, not of a fault in the graph.
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
| ACT Math Fundamentals, ACT Math Prep | Precalculus | done | | Assigned slot **G**. 2 courses: ACT Math Fundamentals (rebuilt to the full outline: 7 units, 931 topics) and ACT Math Prep (rebuilt as exam topics: 6 units, 348 topics, `act-exam-*.ts`, with 2 ordinary topics kept; the outline lists "Solving Exponential Equations" in modules 1.1 and 3.16, and 3.16 holds "Finding Inputs of Exponential Functions" because a course lists a topic once); `act-*.ts` hold 27 topics and `act-fundamentals-*.ts` 29 more for outline titles that had no topic of their own |
| 1st, 2nd and 3rd Grade Math | — | done | | 1st: 13 units, 61 topics; 2nd: 14 units, 65 topics; 3rd: 14 units, 65 topics. Outside the reference catalog, so no outline |
| Number Theory, Real Analysis, Complex Analysis, Linear Programming, Partial Differential Equations | Set topic by topic | done | | 50, 43, 34, 30 and 30 topics. Outside the reference catalog, so no outline |

## Requests

Missing topics or helpers one agent needs from another. Use the format `- [requester → owner] topic-id: why`. Delete the line once it lands.

## Handoffs

Topics written for a course that someone else will claim. Use the format `- topic-id in <file> (written by <agent>)`. The course owner adds them to its `CourseDef`.

