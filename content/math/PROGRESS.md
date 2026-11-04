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
- *Two-option choice* is a real weakness where it dominates: Yes/No questions make up 24% of the knowledge points of Abstract Algebra and 17% of Methods of Proof, and a learner can guess half of them. Replace them there first.
- These findings are known false positives; review them only after a content change:
  - *visual topic without a figure*: titles that say "graphing calculator" or "significant figures", where the problems use tables or no picture.
  - *canonical answer appears in the prompt*: questions where the answer is an equal quantity named in the prompt, such as $\sin T = \cos S$ or $\varnothing$ in the input instructions.
  - *topic in no course*: older topics whose ids must stay. Most are computed foundations, because course topics list them as prerequisites.
  - *duplicate topic titles*: an exam topic shares its outline title with the Fundamentals topic it builds on (about 60 findings). Also `units-of-time` and `units-of-time-and-elapsed-time`, and `mean-of-a-data-set` and `the-mean-of-a-data-set`, are different topics with one outline title, and no course contains both.

## Open Gaps

The board tracks whether a course exists, not whether it is finished. Measured on 2026-11-03:

- **SAT and ACT Math Prep are exam-style in their questions, not yet in everything.** 252 of the 284 SAT Prep topics and 345 of the 347 ACT Prep topics are exam topics (`exam.ts`), and what is left is:
  - 61 exam topics, most of them in geometry, ask about a figure in words and draw none, unlike the real test.
  - About 124 ACT exam topics reuse the SAT generators through `multipleChoice`, so a learner taking both courses sees similar questions.
  - Options are shuffled, while the real tests list numeric options in order.
  - The ACT outline lists "Solving Exponential Equations" twice, and the course has it once, so the course has 347 topics against 348 outline entries.
- **University courses have almost no figures.** About 1% of the topics of Linear Algebra, Multivariable Calculus and Probability & Statistics have one, and none in the Multivariable Calculus topics on vector fields, level curves and surfaces.
- **University topics are shallow.** They average about 2.0 knowledge points, against the 3 to 4 of the design.
- **Some questions test little.** A few reduce a skill to reading a number off the prompt, such as a cone's parametrization where the learner only computes $8u$.
- **`encompassings.ts` holds inferred weights** for topics with no encompassings of their own. Writing reviewed encompassings on a topic and deleting its entry improves on them.
- **Outside the reference catalog:** grades 1 to 3, real and complex analysis, partial differential equations, linear programming and a number theory course.

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
| 4th Grade Math, 5th Grade Math | — | done | — | 4th: 7 units, 140 topics; 5th: 8 units, 134 topics (`grade-4-*.ts`, `grade-5-*.ts`) |
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
| ACT Math Fundamentals, ACT Math Prep | Precalculus | done | | Assigned slot **G**. 2 courses: ACT Math Fundamentals (rebuilt to the full outline: 7 units, 888 topics) and ACT Math Prep (rebuilt as exam topics: 6 units, 347 topics, `act-exam-*.ts`, with 2 ordinary topics kept); `act-*.ts` hold 27 topics and `act-fundamentals-*.ts` 29 more for outline titles that had no topic of their own (see *Open Gaps* for what Prep still lacks) |

## Requests

Missing topics or helpers one agent needs from another. Use the format `- [requester → owner] topic-id: why`. Delete the line once it lands.

## Handoffs

Topics written for a course that someone else will claim. Use the format `- topic-id in <file> (written by <agent>)`. The course owner adds them to its `CourseDef`.

