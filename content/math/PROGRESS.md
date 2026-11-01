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
| Discrete Mathematics | Methods of Proof | in progress | claude-main | Slot **B** after Methods of Proof. Reuse `combinatorics.ts` and `probability.ts` |
| 4th Grade Math, 5th Grade Math | — | open | | Assigned slot **C**. `grade-4-operations.ts` and the Prealgebra files already cover part of these |
| 6th, 7th and 8th Grade Math | 5th Grade Math (outline) | open | | Assigned slot **D**. Mostly reuse Prealgebra and Algebra I topics; can start alongside slot C, and request missing grade 4–5 topics from C |
| Integrated Math I, II, III | Prealgebra | open | | Assigned slot **E**. Mostly course definitions that reuse Algebra I, Geometry and Algebra II topics |
| Integrated Math I, II, III (Honors) | Prealgebra | open | | Slot **E** after the standard Integrated courses |
| Mathematical Foundations I, II, III | — | open | | Slot **E** later. Mostly reuse; III needs Calculus I topics, which are done |
| AP Calculus AB, AP Calculus BC | Calculus I, Calculus II | done | | 9 units (212 topics) and 16 units (305 topics) (revision complete) |
| Multivariable Calculus | Linear Algebra | open | | |
| Differential Equations | Multivariable Calculus | blocked | | Calculus II unit 5 covers the first-order topics |
| Probability & Statistics | Multivariable Calculus | blocked | | |
| Mathematics for Machine Learning | Calculus II, Linear Algebra | blocked | | |
| Mathematical Methods for the Physical Sciences I, II | Calculus II | blocked | | |
| Abstract Algebra | Methods of Proof, Linear Algebra | open | | |
| SAT Math Fundamentals, SAT Math Prep | Algebra II | open | | Low priority: almost entirely reuse; do after the courses above |
| ACT Math Fundamentals, ACT Math Prep | Precalculus | open | | Low priority, as for SAT |

## Requests

Missing topics or helpers one agent needs from another. Use the format `- [requester → owner] topic-id: why`. Delete the line once it lands.

## Handoffs

Topics written for a course that someone else will claim. Use the format `- topic-id in <file> (written by <agent>)`. The course owner adds them to its `CourseDef`.

