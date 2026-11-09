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

XP is earned in a subject and counted there. The account's total is the sum, which the league and the account page show.

**The current subject.** Each client remembers the subject last opened. A signed-in learner opens on it, else on the subject most recently worked in.

## 3. Pages of a subject

Each subject has three pages, the same on the web and in the apps:

- **Learn** — what to do now: the course and how far it is, the task in progress or the next tasks, the diagnostic or its report, and the last few finished tasks; beside them the subject's total XP with today's, the weekly goals with the last 14 days, the forecast with other paces to compare, and the week's league.
- **Progress** — how far the learner is: the course's topic map, and beside it the same goals and forecast cards as Learn; the history of finished tasks opens from its head.
- **Course** — what is being learned: the current course and its outline, the other courses of the subject, and the decisions about them: changing course, retaking the diagnostic and resetting the knowledge profile.

A topic's page and a session belong to the subject of their course and show its chip.

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

**Apps.** On a desktop the sidebar starts with the subject chip, which opens the switcher, then the subject's three pages; at its foot the learner's name opens the account menu, as the web's does (the course catalog, the league standings, the learners followed, the settings, signing out), beside the settings button. On a phone the top bar's title is the subject chip, the tab bar holds Learn, Progress, Course and Me, and Me holds the account, with the course catalog and the league standings under Learning. The settings' Account security lists changing the password, signing out and deleting the account; each of the two forms opens as its own page, on the web as in the apps.

**Catalog.** The catalog shows one subject at a time, chosen by tabs at its top; its shelves (grades, exams, university) are the subject's own. Every course in it opens its course page, the learner's current ones too. A course page names its subject with the chip.

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
