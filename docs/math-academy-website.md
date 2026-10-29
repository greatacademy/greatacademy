# Math Academy Website: Study Notes for Great Academy

> **Sources:** five public pages on mathacademy.com, read on 2026-10-29: [How It Works](https://www.mathacademy.com/how-it-works), [Pedagogy](https://www.mathacademy.com/pedagogy), [FAQ](https://www.mathacademy.com/faq), [How Our AI Works](https://www.mathacademy.com/how-our-ai-works) and [Adult Students](https://www.mathacademy.com/adult-students). Everything is paraphrased.
>
> **Relationship to the book notes:** most of the pedagogy on these pages repeats *The Math Academy Way* (see [the-math-academy-way.md](the-math-academy-way.md)). This document records only (1) what the website adds, especially concrete product rules and business details, and (2) where the website and the book disagree. Chinese version: [math-academy-website.zh-CN.md](math-academy-website.zh-CN.md).

## TL;DR

- The website answers several questions the book left open: the **knowledge-point pass rule** (two correct in a row, at most 5 questions), **quiz cadence** (about every 150 XP), and what happens after a quiz (reviews on missed or too-slow questions, then an optional retake with different questions for extra XP).
- It describes product surfaces the book barely covers: the **diagnostic report**, the **oversight account** for parents, teachers and tutors, **timing accommodations**, **for-credit midterms and finals**, and **Test Prep Mode**.
- It describes the business: an accredited (WASC) and UC-approved online school still in **beta**, with no free trial but a 30-day refund, and subscriptions that can be paused.
- **How Our AI Works** splits the system into four modules (knowledge graph, student model, diagnostic algorithm, task-selection algorithm) and explains how quiz questions are chosen and how quiz difficulty is tuned to an expected score of about 80%. See §9.
- **Adult Students** adds concrete numbers: a lesson takes about 10 minutes, the dashboard offers 5 tasks, reviews start after a few days and quizzes within about a week. See §10.
- A few numbers differ from the book (lesson pass rates, the course list). The likeliest explanation is that the pages and the book were written at different times. The apparent conflict over what quizzes cover is resolved by How Our AI Works.

---

## 1. Positioning

- The site describes Math Academy as an "AI-powered, fully-automated" online math platform for grade 4 through university.
- It emphasizes that this is serious training, not "edutainment" or enrichment: students are trained the way you would train a professional athlete or musician, and every student is expected to master the material.
- Courses cover the Common Core State Standards and state standards. The site says they go "above and beyond" school courses because adaptivity frees time to cover every standard in full, from the introductory cases to the hardest.
- **Accreditation:**
  - Accredited by WASC (Western Association of Schools and Colleges). It issues certificates of completion and transcripts with grades. Families must get approval from their school in advance to take a course for credit.
  - Registered in the University of California's directory of online publishers, so schools can add courses for UC **a-g** credit.
- **Audiences:** homeschoolers (full replacement for a school math class), advanced students whose school has nothing at their level, students using it as a supplement to school, and adults.

## 2. Courses and sequences

- **Entry point:** 4th Grade Math. A student is ready once they know the multiplication facts through 12.
- **Integrated vs. traditional sequence:** the site prefers the **integrated** sequence (Integrated Math I–III), which teaches algebra and geometry together. The traditional order (Algebra I, Geometry, Algebra II) takes a year off from algebra, and the site calls the resulting backsliding "extremely inefficient." Both sequences cover the same topics.
- **Mathematical Foundations (MF I–III)** for adults:
  - Runs from fractions through calculus and contains about two-thirds of the high-school topics (Integrated Math I–III plus AP Calculus BC) plus essential middle-school topics (fractions, ratios, arithmetic, algebra basics, geometry).
  - At a little under an hour a day, 5 days a week, an adult who remembers only the multiplication tables can be ready for university-level courses in about a year.
  - MF III includes all the single-variable calculus expected before a STEM degree at a selective university.
- **University courses** (as listed on the FAQ page): Calculus I and II, Linear Algebra, Multivariable Calculus, Methods of Proof, and Mathematics for Machine Learning. Listed as coming soon: Probability and Statistics, Discrete Mathematics, Differential Equations, Real Analysis, and Abstract Algebra.
- A calculator isn't needed until Trigonometry; pencil and paper are enough.

## 3. Learning flow, with concrete rules

### 3.1 Diagnostic
- Takes about **30–45 minutes**, and doesn't have to be done in one sitting. The course chosen at sign-up is only the diagnostic's starting point.
- Measures **both mastery and automaticity**: it is timed, and a correct but slow answer counts as not yet "known cold." Because the bar is high, it's normal for the diagnostic to find many foundational topics to refresh.
- **Diagnostic report** sent to the family. It contains:
  - a recommended course placement,
  - estimated completion dates under several daily XP goals,
  - foundational gaps from earlier courses that the system will fill in,
  - the mastery level of each topic in the course,
  - which topics were assessed and how the student did on each.
- If the report recommends an earlier course, the family can keep the chosen course. Gaps from earlier courses are then filled in alongside the course material. The site suggests switching courses may suit younger students better.

### 3.2 Task choice
- The student chooses from a set of tasks that vary in topic, task type and XP. The site presents this as giving the student agency.
- The non-interference section says students can pick "any unlocked topic." The book's position is that students can't choose freely. The two fit together: the system builds the menu and the student picks from it.

### 3.3 Lessons and knowledge points
- A lesson opens with a tutorial: a new concept plus a method for one category of problem.
- Each knowledge point starts with a fully worked example, followed by **up to 5 practice problems**.
- **Pass rule: two correct answers in a row** move the student on to the next knowledge point; otherwise more problems are given. *This partly fills gap §8.5 in the book notes.*
- Every question has a worked explanation, so students learn from the practice problems as well as from the lesson.
- If the student clearly isn't getting a new concept, the system ends the lesson early, awards **0 XP**, and saves it for later. A failed topic is served again **within a few days**, and review of the prerequisites likely behind the confusion is prioritized.

### 3.4 XP
- **1 XP ≈ 1 minute** of focused effort; there is a daily XP goal.
- XP is awarded for correct answers: **full XP** for a lesson if most answers are correct, **partial XP** if some are, **bonus XP for a perfect score**, and **negative XP** on the rare occasions the system detects rushing and guessing.
- The site frames XP as rewarding good habits as well as correct answers: reading worked examples carefully, using pencil and paper, and comparing wrong answers with the full solution.

### 3.5 Quizzes
- A **timed quiz is assigned about every 150 XP**. *This fills part of gap §8.7.*
- No access to lessons or examples during a quiz.
- The quiz checks response time as well as correctness. Topics answered **wrong or over the time limit** are assigned for review immediately.
- After those reviews, an **optional retake** with different questions on the same topics becomes available and earns more XP. The site presents retakes as building confidence and reducing math anxiety.
- Timing can be adjusted per student in the **Accommodations** settings (for example, to meet an IEP).
- Students taking a course for credit are also assigned **midterms and a final exam** automatically.

### 3.6 Reviews and spaced repetition
- Reviews come from two sources: quiz mistakes, and the regular spaced-repetition schedule.
- Scheduled reviews often don't appear because a more advanced lesson covers them implicitly. New students see few reviews, and the number grows as they build up more learned material.
- The site says the algorithms track every question a student completes and keep updating that student's personal learning curve.
- **Knowledge graph view:** each topic is drawn as an oval, and **darker blue means more spaced repetitions**, i.e. more stable knowledge.

### 3.7 Leagues
- Weekly leagues are grouped by **how fast students earn XP**, with promotion and demotion each week.
- Students never lose accumulated XP; each week is a fresh start.
- Leagues are **optional**: families can opt out if they don't motivate the student.

## 4. Oversight and account features
- An **oversight account** for a parent, teacher or tutor can:
  - adjust the daily XP goal and the number of work days per week,
  - set a calendar for vacations and breaks,
  - share a student's progress with a teacher or tutor.
- **Recommended pace:** 20–40 XP per day, 3–5 days per week. As a supplement to school, use a lower goal, but not fewer than 3 days per week.
- **Test Prep Mode** is included in course XP (for example, AP Calculus BC). After the course, students should still take several full practice exams to learn the exam's format, pacing and free-response scoring.
- There is no human tutoring; the system's review of prerequisites is said to make outside help rarely necessary.

## 5. Business model (beta)
- **No free trial.** A **30-day full refund** for any reason, automatic and instant on cancellation. The site says it is a small company that wants to serve serious students.
- After 30 days, refunds only for technical problems that prevent use.
- **Pause:** 30–90 days at a time, which stops billing. XP is never lost.
- **Payment:** major credit cards through Stripe. No PayPal yet, no prepaid cards.
- **No discounts or regional pricing (PPP)** yet; only basic plans while in beta.
- **Approved vendor for charter homeschool networks** (purchase orders accepted).
- The site still describes the product as "beta" and acknowledges rough edges.

## 6. Notable numbers

| Item | Website | Book | Note |
|---|---|---|---|
| Lesson pass rate | 93% first try, 98% second | 95% first try, 99% within two | Probably data from different times. |
| Questions per knowledge point | Up to 5; two correct in a row to advance | 2–5, adaptive | Website states the rule. |
| Quiz frequency | About every 150 XP | Not specified (about a 30 XP window to start one) | New information. |
| Quiz coverage | How It Works: "a variety of recent topics"; How Our AI Works: random from everything learned, favoring the enrolled course | Everything learned so far, not only recent | Resolved: quizzes draw from everything learned (§9.4). |
| Quiz target score | About 80% (difficulty adapts) | 80–85% | Consistent. |
| Lesson length | About 10 minutes (Adult Students) | Not stated | New information. |
| Tasks on the dashboard | 5 (Adult Students) | Not stated | New information. |
| Diagnostic length | 30–45 minutes | 20–60 questions | Consistent. |
| Recommended pace | 20–40 XP/day, 3–5 days/week | Baseline 40 XP/weekday; at least 15 | Website is gentler. |
| 4× claim (AP Calculus BC) | School ≈ 24,000 minutes (17,600 class and homework, plus tests and AP prep) vs about 6,000 XP | Same claim | The website shows the calculation. |
| MF sequence size | About 2/3 of high-school topics plus key middle-school topics | About 1/3 of grade 4 through AP Calculus BC topics removed | Consistent. |

## 7. Pedagogy page
The Pedagogy page restates the book's strategies in short form: Bloom's two-sigma problem and mastery learning, automaticity, active learning and deliberate practice, spaced repetition, interleaving, layering, non-interference, and minimizing cognitive load. Additions:
- It frames **automaticity** as part of minimizing cognitive load: skills stored in long-term memory don't occupy working-memory "slots."
- The FAQ distinguishes **fluency** (a skill has been memorized) from **automaticity** (the skill is in long-term memory and recalled instantly). Timed diagnostics and quizzes exist to measure automaticity.
- Each strategy has a short "further reading" list of research papers. These are useful as a bibliography for Great Academy's own pedagogy documents.
- The page says a calculus course has "almost 1000 steps" (about 300 topics × 3 knowledge points), slightly fewer than the book's 3–4 per topic.

## 8. Implications for Great Academy
- **Adopt the concrete rules as starting defaults:** two correct in a row to pass a knowledge point, at most 5 questions; quiz about every 150 XP; reviews on wrong *or* too-slow quiz answers; optional retake with new questions after those reviews; failed lessons served again within a few days. Tune all of these against our own pass-rate data.
- **Build the surfaces that families and schools need, not only the learning engine:**
  - a diagnostic report with placement, completion-date estimates and the gap list,
  - an oversight account (goals, calendar, progress sharing),
  - timing accommodations,
  - for-credit midterms and finals,
  - Test Prep Mode.
- **Accreditation and standards alignment are part of the product** in the US market (WASC, UC a-g, Common Core and state standards). If Great Academy targets US students, plan for them early: they affect how courses are packaged and how transcripts are produced.
- **Prefer an integrated sequence** for high school, and consider an adult "foundations" track built from core topics only.
- **Make the task menu flexible but curated**: students pick from options the system has already chosen. This keeps student agency without losing efficiency.
- **Business model:** a paid product with a refund window, pausable subscriptions and an optional league system matches the target user, a serious learner. Decide early whether Great Academy targets the same niche or a broader market, since that choice changes many product decisions.
- **Use the four-module split from How Our AI Works (§9) as the top-level architecture**, with one objective shared by all modules: maximize learning per minute.
- **Quiz composition is a selection algorithm in its own right** (§9.4): random draw from everything learned, weighted toward the enrolled course, away from recently quizzed and already-encompassed topics, with difficulty steered toward an 80% expected score.

---

## 9. How Our AI Works page

This page is the closest the website comes to a technical description. Most of it matches the book's deep dives; these points are new or clearer.

### 9.1 Four-module architecture
The page describes the AI as an **expert system that emulates an expert tutor's choice of what to work on next**, built from four parts:

| Module | Input | Output |
|---|---|---|
| **Knowledge graph** | Expert-authored structure of mathematics | Topics, the easiest and hardest problem variations in each, prerequisites, and the background knowledge most relevant when a student struggles with a given problem type |
| **Student model** | The student's answers, overlaid on the graph | The **knowledge profile**: how many spaced repetitions the student has on each topic |
| **Diagnostic algorithm** | The knowledge graph and diagnostic answers | An initial knowledge profile with as few questions as possible |
| **Task-selection algorithm** | The knowledge profile | The tasks that produce the most learning per unit of time |

- The graph includes relationships between **"sub-atomic" components inside topics**, which corresponds to the per-knowledge-point key prerequisites in the book.
- The knowledge profile is defined concretely as **the number of spaced repetitions per topic**. A spaced repetition is "a minimum effective dose of successful review at the appropriate time."

### 9.2 Spaced repetition details
- The page lists why simple trickle-down doesn't work: a prerequisite is not always practiced implicitly (only *encompassed* topics are), implicit repetitions that arrive early must be discounted, and encompassings are often fractional.
- New detail: **for tasks with several questions, the repetition credit varies with performance on the task**, not just pass or fail.
- Review compression is described as toppling an arrangement of dominoes with the fewest pushes. New lessons are preferred for knocking out due reviews, so that review doesn't slow the learning of new material.

### 9.3 Adapting within a task
- The higher a student's accuracy, the **fewer questions** a task requires. Each wrong answer **raises** the number of required questions.
- Too many wrong answers **halt** the lesson. The student works on unrelated topics and comes back later.
- A second halt with no new progress triggers remedial reviews on the key prerequisites of that part of the lesson.

### 9.4 Quiz selection (new)
- A quiz is a diverse set of topics **drawn at random from everything the student has learned**, with these weights:
  - **favor** topics in the student's enrolled course,
  - **disfavor** topics that have already been quizzed,
  - **disfavor** topics that are encompassed by other quizzable topics.
- The stated goal is to audit the student's knowledge and catch unexpected weak areas quickly.
- **Difficulty adapts to an expected score of about 80%.** Above 80%, the next quiz uses slightly harder variations of each question; below 80%, slightly easier ones.

### 9.5 Diagnostic numbers
- A course has a few hundred topics plus about twice as many foundational topics, so **500–1,000 topics** need assessing. The algorithm cuts the number of questions by an order of magnitude.
- It compresses the graph first, then repeatedly picks the topic whose answer gives the **most information** about the profile.

## 10. Adult Students page

- **Mathematical Foundations I–III** are built for adults relearning math from fractions through calculus, stripped of topics that aren't direct prerequisites for upper-level courses.
- University courses claim to cover a **superset** of the most widely used textbooks.
- **A lesson takes about 10 minutes.** The suggested adult pace is **about 30 XP per day, 4 days a week**, and short sessions spread through the day are encouraged.
- The site promotes the "minimum effective dose" of practice: no long lecture videos and no endless problem sets.
- **Getting started:** most adults haven't studied math seriously in years, so the diagnostic often turns up forgotten material. Adults who have been away a while are encouraged to start with an MF course.
- After the diagnostic, a **custom course** is generated that includes the missing lower-course prerequisites. The diagnostic report adds **unit-level mastery analysis**.
- **Dashboard: 5 tasks** chosen by the algorithm; the student may pick any of them.
- **Onboarding timeline:** spaced-repetition reviews begin **after a few days**, and timed quizzes appear **within about a week**.
- **Adult course list** on this page: MF I–III, Calculus I and II, Linear Algebra, Multivariable Calculus, Methods of Proof, Probability & Statistics, Discrete Mathematics, Differential Equations, Mathematics for Machine Learning, **Mathematical Methods for the Physical Sciences I and II**, and Abstract Algebra (in development). Compared with the FAQ page, Probability & Statistics, Discrete Mathematics and Differential Equations now appear as available, the physical-sciences courses are new, and Real Analysis isn't listed.
