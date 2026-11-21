# Experience

> English | [简体中文](experience.zh-CN.md)

This document describes how Great Academy presents itself to learners and guardians: what belongs to a subject and what to the account, how pages are arranged on the web and in the apps, and who makes which decisions. The algorithms behind the pages are in [Learning Engine](learning-engine.md); the content in [Content](content.md).

## 1. Principles

1. **A subject is a space of its own.** Mathematics and English are studied apart: each has its current course, tasks, progress, history, goals and knowledge profile. Every page that belongs to a subject shows which one, so a learner always knows where they are.
2. **The account is shared.** Profile, plan, privacy, appearance, language, guardians and the league are the same in every subject.
3. **Learners study; supervisors decide.** Which course to take, when to retake the diagnostic, whether to reset the knowledge profile, the weekly goals and the end date are decisions of the learner's supervisor (§5). A learner who is not their own supervisor sees them and who makes them, and does not change them.
4. **A decision says when it is the right one.** Each decision explains what it changes and when it helps. One that cannot be undone asks again.

## 2. Subjects

**Identity.** A subject declares a `mark`, one or two characters (`∑` for mathematics, `Aa` for English), and a `hue` from 0 to 360 ([Content §1](content.md#1-concepts)). `subjectColors(hue, scheme, contrast)` in `libs/design` turns the hue into the colors of the subject's chip, tint and progress bars, held to the same contrast targets as the palettes and kept at least 20 degrees from the verdict colors. The subject's color marks where a learner is; the palette's accent stays the color of actions.

**The subject chip** is the mark on a tinted square beside the subject's name. It stands at the start of every subject page's header, on a session's bar, in the subject switcher, and before any course or topic shown outside its subject.

**What belongs to a subject:**

| Per subject | Per account |
| :--- | :--- |
| Current course and past courses | Profile, password, email |
| Tasks, sessions and their history | Plan and billing |
| Topic map and knowledge profile | Privacy, age and data |
| Diagnostic | Appearance and language |
| Weekly goals, pace and forecast | Guardians |
| End date | League, on the XP of all subjects |

XP is earned in a subject and counted there. The account's total is the sum, which the league and the account page show. The league page ranks the week's learners of the tier, with a line where the promotion zone ends and one where the demotion zone starts, and says how many days the week has left.

**Names.** Every account, a child's included, has a name and a username, both asked at sign-up or when a guardian adds a child, and both changed in Profile. The name is private: only the person and their guardians see it. The username signs in, as the email address does, and is the only name the league shows; a child's account, which has no email address, signs in with it alone. The league's settings hold only whether to take part.

**The current subject.** A learner who signs in or opens the app starts in the subject last studied, on any device: the one whose course had the latest task or was chosen last. A subject opened after that stays current until the page is reloaded, the app is closed or the learner signs out; the web catalog opens on the subject last opened in that browser.

## 3. Pages of a subject

Each subject has three pages, the same on the web and in the apps:

- **Learn** — what to do now: the course and how far it is, the task in progress or the next tasks, the diagnostic or its report, the offer to start with an earlier course when the course needs more of them than its own ([Learning engine §9](learning-engine.md#9-diagnostic)), and the last few finished tasks; beside them the subject's total XP with today's, the weekly goals with the last 14 days, the forecast with other paces to compare, and the week's league.
- **Progress** — how far the learner is: the course's topic map, and beside it the same goals and forecast cards as Learn; the history of finished tasks opens from its head.
- **Course** — what is being learned: the current course and its outline, the other courses of the subject, and the decisions about them: changing course, retaking the diagnostic and resetting the knowledge profile.

A topic's page and a session belong to the subject of their course and show its chip.

**A task's result** shows the score and the XP earned against the task's full XP, then each question: its topic, its knowledge point (a lesson's questions stand under their knowledge points' titles), the time taken, whether it was late on a quiz, the answer given and, when wrong, the correct one and the solution. A review question offers its lesson as a reference, saying that a right answer after it earns half the credit; once opened, the reference stays above the question. A multistep problem shows "Part 2 of 3" while it is asked and is listed part by part, each part under the topic it practices. A lesson's result lists the topics it builds on, each marked known or not; a failed lesson's result names, as links, the key prerequisites to be reviewed before it comes back. The history opens the same results.

**The history** groups finished tasks by day, newest first, each day with the XP it earned, and shows each task's XP against its full XP, a negative one in red. **A lesson's card** lists the topics it builds on, each marked known or not. **The topic map** shades each learned topic by how firmly it is held: six shades of the palette's accent, from just learned to many spaced reviews passed, so the map reads like a heat map; a topic not learned is a hollow dot, edged in the accent when it can be learned next and in red when its lesson waits on a review. A learned topic is either up to date or due for review, never both, and both count as learned; a due one is ringed in amber and carries a chip, as do the topics to learn next and those waiting, while a topic's memory shows on hover. Each unit is headed by how many of its topics are learned and a bar with one segment per topic, the firmest first and the ones not learned left empty, as long as the unit is next to the course's largest. The legend gives the count of learned topics with the scale of shades, then the other statuses. Each entry explains what it means: on hover where there is a pointer, and on a tap or press of its name in the legend, so a phone shows it too; a topic's own page states it under its title. Each unit is numbered 1, 2, 3 and each of its modules 1.1, 1.2. The course's bar on the learn and course pages is shaded the same way, the firmest first, with the share of the course learned beside it, rounded down so that 100% means every topic; the learn page shows nothing more under it, and its course title opens the progress page. Hovering the bar explains it; tapping or clicking it opens, over the page so that nothing below moves, a popover on a wide screen and a sheet from the bottom on a phone, with the course sequence as tabs and for the course picked, how many topics sit at each shade and its units, numbered, each with its own shaded bar and share. Below them and on the Progress page, a button opens the course's **knowledge graph**, as Math Academy's percentage does: over the whole screen, each topic of the course is a box above the topics of the course it builds on, shaded and marked as on the progress map, with a line to each topic that builds on it directly; a prerequisite outside the course is passed through to the nearest topics of the course below it. The graph opens fitted to the screen; it is dragged to move, zoomed with the wheel, a pinch or the buttons in its corner, and pointing at a topic, or tapping it on a phone, lights the topics it builds on. On the web a topic of the current course opens its page; the apps have no topic pages. The course sequence lists up to three courses taken before, oldest first, the current course, then up to three that follow it on the learner's route, which is inferred and not shown, the course set out for among them when the learner moved back from it ([Learning engine §9](learning-engine.md#9-diagnostic)); the progress page has it too above the map, and picking another course shows that course's map from the same learner state, its topics not linked, since a topic's page speaks of the current course. A finished course leads on by itself, as in Math Academy: the learner is promoted into the next course on their route, and the learn page says which course they finished until they start a task in the new one; reviews go on. Only a course that nothing follows stays, and the learn page then congratulates and points whoever chooses the course to the catalog.

**The subject switcher** opens from the chip in the header. It lists the learner's subjects, each with its current course and today's XP against its goal, and offers the subjects not yet started, which lead to their catalog. Its last entry is the **Course catalog**, so named to tell it apart from a subject's Course page.

## 4. Arrangement

**Web.**

| Path | Page |
| :--- | :--- |
| `/` | Signed out, the landing page; signed in, the current subject's Learn page |
| `/{subject}` | Learn |
| `/{subject}/progress` | Progress |
| `/{subject}/history` | History of finished tasks |
| `/{subject}/course` | Course |
| `/{subject}/topics/{topic}` | A topic to reread |
| `/session/{id}` | A task |
| `/courses` | The public catalog, one tab per subject |
| `/courses/{course}` | A course's public page |
| `/settings` | The account |
| `/guardian`, `/guardian/{learner}` | A guardian's learners, and one learner |
| `/league` | The league |

The header holds the logo, the subject chip with the switcher, the subject's three pages, and at the right the league and the account menu. Outside a subject (the catalog, the account, the league) the chip is replaced by the page's name.

**Apps.** On a desktop the sidebar starts with the subject chip, which opens the switcher, then the subject's three pages; at its foot the learner's name opens the account menu, as the web's does (the course catalog, the league, the learners followed, the settings, signing out), beside the settings button. On a phone the top bar's title is the subject chip, the tab bar holds Learn, Progress, Course and Me, and Me holds the account. The settings' Account security lists changing the password, signing out and deleting the account; each of the two forms opens as its own page, on the web as in the apps.

**Catalog.** The catalog shows one subject at a time, chosen by tabs at its top; its shelves (grades, exams, university) are the subject's own. Every course in it opens its course page, the learner's current ones too. A course page names its subject with the chip.

**Course roadmap.** Below the shelves on the web, the catalog draws the subject's courses as a map: the first courses at the bottom, each course one row above the highest course it builds on, and a line from each course to the courses that build on it directly. A course is joined to one it reaches through another only through that one. Each box opens the course's page; pointing at a box lights the courses it builds on, and the learner's current courses are filled in. A map wider than the screen scrolls sideways inside its frame.

## 5. Supervision

**The supervisor** of a learner decides for them:

- an adult supervises themselves;
- a minor is supervised by their guardians, any of whom decides;
- a teen with no guardian supervises themselves until a guardian follows them. A child always has a guardian, who made their account.

**Decisions of a subject:**

| Decision | Where | When it helps |
| :--- | :--- | :--- |
| Change course | Course | The course is too easy or too hard, or a new goal (a grade, an exam). Progress is kept; the confirmation shows which of the new course's topics are already known and the forecast. |
| Retake the diagnostic | Course | After a break of more than ten weeks, or learning outside Great Academy. The topics the diagnostic placed are asked again; topics taught in lessons stay, and their reviews correct them. It asks again before it acts. |
| Reset the knowledge profile | Course | When the record cannot be trusted: work done with outside help or tools, or a profile far from what the learner knows. Inference starts again from the reset; the history and XP stay. It asks again before it acts. |
| Weekly goals | Learn, Progress | The XP to earn on each weekday in this subject. |
| End date | Learn, Progress | When the course should be finished; the forecast then says whether the pace is enough and what daily XP would be. |

A guardian makes these decisions on the learner's page, which has the same subject switcher and shows the learner's Learn, Progress and Course pages read-only, with the decisions enabled. A learner who is not their own supervisor sees each decision's current value and the words "Your guardian decides", without a control.

## 6. Guardians

The guardian's list shows each learner with their subjects' chips and, per subject, today's and this week's XP against the goals. A learner's page opens on the subject most recently worked in.
