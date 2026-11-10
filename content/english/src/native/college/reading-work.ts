// College writing: the reading unit of the seventh theme, writing at work: eight original model documents, each
// followed by a commentary on how it works. The companies and people are invented.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grades-6-8/reading-kit.ts";

const workplace = { topic: "words-of-the-workplace", weight: 0.3 } as const;
const documents = { topic: "reading-workplace-documents", weight: 0.3 } as const;
const register = { topic: "tone-and-register-at-work", weight: 0.1 } as const;

/** academic gives the edge to a batch of the shared academic words, which a passage uses as it goes. */
const academic = (n: 1 | 2 | 3) => ({ topic: `academic-words-${n}`, weight: 0.1 }) as const;

/** writingAtWork is a reading unit of the college writing course of model documents with commentary. */
export const writingAtWork: ReadingUnitDef = {
  id: "writing-at-work",
  title: t("Writing at Work", "职场写作"),
  passages: [
    passage(
      "a-request-to-a-manager",
      t("A Request to a Manager", "给经理的请求"),
      `Subject: Request to move the catalogue deadline to 18 March

Dear Helen,

I am writing to ask whether we could move the deadline for the spring catalogue from 4 March to 18 March.

The reason is the delay in receiving product photographs from our new supplier. We expected them on 10 February, but they arrived only yesterday, and about a third need to be retaken because the colors are wrong. The design team needs at least ten working days after receiving final photographs to complete the layout.

I have checked with the printer, and an 18 March deadline would still allow the catalogue to reach customers by 1 April, the date promised in our marketing plan. The extra two weeks would not affect the budget.

If moving the deadline is not possible, an alternative would be to publish the catalogue on time with the photographs we have and add the remaining products in a short supplement in April. I think this would be less effective, but I can prepare a plan for it if you prefer.

Could you let me know by Friday which option you would like? I am happy to discuss it if that would help.

Best regards,
Samir

A request is one of the most common documents in any workplace, and one of the easiest to get wrong. The writer wants something from a reader who has other priorities, and who may be inclined to say no. Samir's email is a good model because it makes saying yes as easy as possible.

Notice first the subject line. It states the request itself, not merely the topic. A manager scanning a full inbox knows from the subject alone what is being asked and roughly how important it is. A subject such as "Catalogue" or "Quick question" would tell her nothing.

Notice next the order. The request comes in the first sentence. Many writers, especially when asking for something they fear will be refused, begin with long explanations, hoping to build sympathy before reaching the point. The effect is usually the opposite: the reader grows impatient, and may miss the request altogether. Samir states what he wants and then explains why.

The explanation is specific. It gives dates, the cause of the delay, and the number of days the design team needs. It does not blame the supplier at length or describe the writer's frustration. A manager deciding whether to approve a change needs facts, not feelings.

The third paragraph anticipates the manager's likely concerns. Will customers still receive the catalogue on time? Will it cost more? By answering these questions before they are asked, Samir removes the most obvious reasons to refuse.

The fourth paragraph offers an alternative. This shows that the writer has thought about the manager's position, and it gives her a choice rather than a demand. It also states the writer's own view honestly, without pressing it.

Finally, the email ends with a clear request for action and a date. "Let me know what you think" invites delay; "Could you let me know by Friday which option you would like?" invites a decision. The closing offer to discuss is polite without being necessary.

The tone throughout is polite but direct. There are no apologies for asking and no excessive thanks. Samir writes as a colleague presenting a problem and a solution, which is exactly what he is.`,
      [workplace, documents, register, academic(2)],
      [
        ask(
          t("Why does the commentary praise Samir's subject line?", "评论为什么称赞萨米尔的邮件主题？"),
          t("It states the request itself, so the manager knows at once what is asked", "它直接写明了请求，经理一看就知道要她做什么"),
          [
            t("It is short and uses only one word", "它很短，只用了一个词"),
            t("It apologizes for the delay", "它为延误道了歉"),
            t("It names the supplier who caused the problem", "它点出了造成问题的供应商"),
          ],
          t(
            "The commentary says the subject line states the request, not merely the topic, so a manager scanning a full inbox knows what is being asked.",
            "评论说，邮件主题写明了请求本身而不只是话题，经理浏览满满的收件箱时就能知道对方要什么。",
          ),
        ),
        ask(
          t("What is the purpose of the email's third paragraph?", "这封邮件第三段的作用是什么？"),
          t(
            "To answer the manager's likely concerns about timing and cost before she asks",
            "在经理提问之前，先回答她可能关心的时间和费用问题",
          ),
          [
            t("To blame the supplier for the delay", "把延误归咎于供应商"),
            t("To describe the writer's frustration", "描述写信人的沮丧情绪"),
            t("To ask for a larger budget", "要求增加预算"),
          ],
          t(
            "The commentary says the paragraph anticipates whether customers will still get the catalogue on time and whether it will cost more.",
            "评论说，这一段预先回答了顾客能否按时收到目录以及是否会增加费用的问题。",
          ),
        ),
        ask(
          t(
            'Why is "Could you let me know by Friday which option you would like?" better than "Let me know what you think"?',
            "为什么“您能在周五前告诉我您选哪个方案吗？”比“告诉我您的想法”更好？",
          ),
          t("It invites a decision by a date instead of inviting delay", "它请求在某个日期前作出决定，而不是让事情拖下去"),
          [
            t("It is more polite and less direct", "它更礼貌，不那么直接"),
            t("It avoids giving the manager any choice", "它不给经理任何选择"),
            t("It is shorter than the other sentence", "它比另一句话短"),
          ],
          t(
            'The commentary says "Let me know what you think" invites delay, while the question with a date invites a decision.',
            "评论说“告诉我您的想法”会让事情拖延，而带日期的问题能促成决定。",
          ),
        ),
      ],
      ["Helen", "Samir", "Samir's"],
    ),
    passage(
      "saying-no-well",
      t("Saying No Well", "得体地拒绝"),
      `Subject: Your request to join the regional sales project

Dear Marta,

Thank you for your interest in joining the regional sales project. I can see from your note how much thought you have given to it, and your ideas about working with smaller shops are good ones.

I am sorry to say that I cannot add you to the project team this quarter. The team was planned with a fixed budget for six people, and all six places are filled. In addition, the project's first deliverables are due in five weeks, and adding a new member at this stage would slow the others down while they bring you up to date.

I would, however, like to involve you in other ways. The team will hold a review of its first results on 12 June, and I would welcome your feedback there, especially on the smaller shops. If the project is extended into the autumn, as we expect, I will consider you first for any new place.

I know this is not the answer you hoped for. Please let me know if you would like to talk it over.

Kind regards,
Daniel

Refusing a request is uncomfortable, and many writers handle the discomfort by avoiding the refusal. They write vaguely ("we will have to see"), delay their reply in the hope that the request will be forgotten, or bury the "no" so deeply in explanation that the reader is not sure it is there. Each of these approaches is unkind, because it leaves the other person uncertain, and unwise, because it produces further emails and resentment.

Daniel's email is a model of a clear and considerate refusal. It follows a pattern that works in most situations.

It begins by acknowledging the request in a way that shows it was read with care. The praise is specific, mentioning the writer's ideas about smaller shops, rather than general flattery. Specific praise is believable; general praise sounds like preparation for bad news, which readers learn to recognize.

The refusal itself comes early, in the second paragraph, and it is unambiguous: "I cannot add you to the project team this quarter." Notice that it is not softened into a possibility ("it may be difficult to") or hidden in the passive voice ("it has been decided that"). The writer takes responsibility for the decision.

The reasons follow, and they are real, specific and impersonal. They concern the budget and the timing, not the reader's ability. A refusal that gives no reasons feels arbitrary; one that gives too many sounds defensive. Two clear reasons are usually enough.

The third paragraph offers what the writer can give: a role in the review and a priority for future places. This is not a consolation prize invented to soften the blow. It is a genuine alternative that serves both the reader and the project. An offer of this kind should only be made if it is real; a promise that is not kept does more damage than no promise at all.

The ending acknowledges the reader's disappointment without dwelling on it and leaves the door open for conversation.

The register throughout is warm but professional. Daniel does not apologize repeatedly, which would suggest that the decision might be changed with enough pressure. He apologizes once, states the decision, explains it and moves on. A good refusal, in the end, is one the reader can accept without feeling dismissed.`,
      [workplace, documents, register],
      [
        ask(
          t("Why does the commentary call vague or delayed refusals unkind and unwise?", "评论为什么说含糊或拖延的拒绝既不友善也不明智？"),
          t(
            "They leave the other person uncertain and produce further emails and resentment",
            "它们让对方心里没底，还会引来更多邮件和不满",
          ),
          [
            t("They are always ruder than a direct refusal", "它们总是比直接拒绝更粗鲁"),
            t("They break the rules of the company", "它们违反了公司规定"),
            t("They require the writer to give too many reasons", "它们要求写信人给出太多理由"),
          ],
          t(
            "The commentary says each approach is unkind because it leaves the person uncertain, and unwise because it produces further emails and resentment.",
            "评论说，这些做法不友善是因为让人心里没底，不明智是因为会引来更多邮件和不满。",
          ),
        ),
        ask(
          t("What makes the refusal in the second paragraph clear?", "第二段中的拒绝为什么清楚明确？"),
          t("It states the decision directly and the writer takes responsibility for it", "它直接说明决定，写信人也为此承担责任"),
          [
            t("It is hidden in the passive voice", "它藏在被动语态里"),
            t("It is softened into a possibility", "它被弱化成一种可能性"),
            t("It comes at the very end of the email", "它出现在邮件的最后"),
          ],
          t(
            'The commentary says "I cannot add you" is not softened or hidden in the passive voice; the writer takes responsibility for the decision.',
            "评论说“我不能把你加进来”这句话没有被弱化，也没有藏在被动语态里，写信人为决定承担了责任。",
          ),
        ),
        ask(
          t("Why does Daniel apologize only once?", "丹尼尔为什么只道歉一次？"),
          t("Repeated apologies would suggest the decision might change under pressure", "反复道歉会暗示施加压力就可能改变决定"),
          [
            t("He does not feel sorry about the decision", "他对这个决定并不感到抱歉"),
            t("Company rules allow only one apology", "公司规定只能道歉一次"),
            t("Marta asked him not to apologize", "玛尔塔要求他不要道歉"),
          ],
          t(
            "The commentary says repeated apologies would suggest that the decision might be changed with enough pressure.",
            "评论说，反复道歉会让人觉得只要施加足够的压力，决定就可能改变。",
          ),
        ),
      ],
      ["Marta", "Daniel", "Daniel's"],
    ),
    passage(
      "a-meeting-summary",
      t("A Meeting Summary", "会议纪要"),
      `Subject: Summary of the website meeting, 3 May: decisions and actions

Present: Ana, Ben, Chloe, Dev, Ella

Decisions
1. The new website will launch on 1 July, not 15 June. The extra time is needed to test the online shop.
2. The home page will feature the three main services only. Other services will move to a separate page.
3. We will not translate the site this year. We will review this decision in January.

Actions
1. Ben will send the final list of services to Chloe by 10 May.
2. Chloe will deliver the new home page design by 24 May.
3. Dev will arrange testing of the online shop with ten customers in June.
4. Ella will tell the board about the new launch date at its meeting on 15 May.

Open question
We did not agree on whether to include customer reviews on the home page. Ana will ask two other companies how they manage reviews and report at our next meeting on 17 May.

Next meeting: 17 May, 10:00

Most meetings produce more talk than record. An hour of discussion ends, people return to their desks, and a week later they remember different things about what was decided. A summary sent soon after the meeting prevents this. It is one of the most useful documents in working life, and one of the most neglected.

The model above is short, and its shortness is deliberate. It does not record who said what, or the arguments that led to each decision. Readers who were present remember the arguments; readers who were absent mostly need the results. A summary that tries to reproduce the conversation becomes long, and long summaries are not read.

Instead, the summary is organized around three questions that every participant needs answered: What did we decide? Who will do what, by when? What remains unresolved? Each has its own heading, so that a reader can find any of them at a glance.

The decisions are stated as decisions, in plain sentences. Where a reason is needed to prevent the decision from being reopened, a short one is given, as in the first item. The third decision includes a date for review, which tells readers that the question is closed for now but not forever.

The actions are the heart of the document. Each names one person, one task and one date. This structure matters. An action assigned to "the team" or to "marketing" is usually done by no one, because everyone assumes someone else will do it. An action without a date is done when it is convenient, which may be never. Being named in a written summary also creates a kind of gentle commitment that a spoken agreement does not.

The open question is recorded honestly. It would be easy to leave out a disagreement and hope it resolves itself. Recording it, with a person responsible for moving it forward, ensures that it returns on the next agenda.

Finally, the subject line states what the email contains, and the summary was sent, according to its writer, within two hours of the meeting. Speed matters. A summary sent the same day is checked against fresh memories; corrections are made quickly; and the document becomes the agreed record. A summary sent a week later is often ignored, because by then everyone has already acted on their own version of events.`,
      [workplace, documents, register],
      [
        ask(
          t("Why does the summary not record who said what in the meeting?", "这份纪要为什么不记录会上谁说了什么？"),
          t(
            "Readers mostly need the results, and summaries that reproduce the conversation are not read",
            "读者主要需要结果，而复述整个对话的纪要没人会看",
          ),
          [
            t("Participants asked for their names to be removed", "与会者要求删去他们的名字"),
            t("The arguments were too confidential to write down", "这些争论太机密，不能写下来"),
            t("No one remembered who had spoken", "没有人记得谁发过言"),
          ],
          t(
            "The commentary says readers who were absent mostly need the results, and a summary that reproduces the conversation becomes long and is not read.",
            "评论说，缺席的人主要需要结果，复述对话的纪要会很长，没人会看。",
          ),
        ),
        ask(
          t('Why should an action not be assigned to "the team"?', "为什么不应该把任务分配给“团队”？"),
          t("Everyone assumes someone else will do it, so no one does", "每个人都以为别人会做，结果谁也不做"),
          [
            t("Teams are not allowed to receive actions", "团队不允许接受任务"),
            t("It makes the summary too long", "这会让纪要太长"),
            t("Team members cannot meet deadlines", "团队成员无法按期完成"),
          ],
          t(
            'The commentary says an action assigned to "the team" is usually done by no one, because everyone assumes someone else will do it.',
            "评论说，分配给“团队”的任务通常没人去做，因为每个人都以为别人会做。",
          ),
        ),
        ask(
          t("Why does the commentary say the summary should be sent quickly?", "评论为什么说纪要应该尽快发出？"),
          t("It is checked against fresh memories and becomes the agreed record", "它能趁大家记忆犹新时得到核对，成为公认的记录"),
          [
            t("The company requires every email within two hours", "公司要求每封邮件在两小时内发出"),
            t("Late summaries are not allowed to contain decisions", "发得晚的纪要不能包含决定"),
            t("The board meets on the same day", "董事会在同一天开会"),
          ],
          t(
            "The commentary says a summary sent the same day is checked against fresh memories and becomes the agreed record, while one sent a week later is often ignored.",
            "评论说，当天发出的纪要可以趁记忆犹新时核对，成为公认的记录，而一周后发出的往往被忽略。",
          ),
        ),
      ],
      ["Ana", "Ben", "Chloe", "Dev", "Ella"],
    ),
    passage(
      "a-memo-on-a-new-policy",
      t("A Memo on a New Policy", "关于新规定的备忘录"),
      `To: All staff
From: Ruth Okonjo, Head of Operations
Date: 2 September
Subject: New policy on working from home, starting 1 October

From 1 October, all staff may work from home on up to two days a week, with the agreement of their manager. This memo explains the policy, the reasons for it and what you need to do.

What is changing
At present, working from home is arranged informally, and practice varies widely between departments. The new policy sets one rule for everyone. You may choose up to two home days each week. Your manager may ask you to come in on a particular day for meetings or training, with at least a week's notice.

Why we are making this change
Last spring we asked staff for their views. Of the 312 people who replied, 78 percent said they would like to work from home part of the week, and most said they could do their work as well or better at home. Managers raised two concerns: that teams would lose contact with each other, and that new staff would find it harder to learn. The policy addresses both by limiting home days to two and by asking all teams to choose one shared office day each week.

What you need to do
1. Agree your home days with your manager by 20 September.
2. Make sure your home computer meets the security standards in the attached guide.
3. Check that your team has chosen its shared office day.

Questions
Your manager can answer most questions. For anything else, contact the operations office at extension 204.

A memo of this kind is written to many readers at once, most of whom will read only part of it. Its writer must therefore make the most important information impossible to miss, while making the rest easy to find. Ruth Okonjo's memo shows how.

The first paragraph contains the whole policy in a sentence: who, what, from when, and on what condition. A reader who stops there knows the essential point. This is sometimes called putting the bottom line first, and it is the single most important principle of workplace writing. Readers of memos are busy, and they decide in the first lines whether the rest is worth their time.

The headings divide the memo by the questions readers will ask. Someone who wants to know what to do can go straight to that section. The headings are phrased as plain statements, not as clever titles, because their job is to help readers find information.

The section on reasons deserves attention. Policies imposed without explanation create resentment, especially when they restrict what people were already doing. By citing the survey and the concerns of managers, the memo shows that the policy responds to evidence and to the views of the stakeholders affected. It also explains the two limits, rather than simply stating them, which makes them easier to accept.

The actions are numbered, because they are separate steps, and each has a date where one is needed. The final section tells readers where to go next. A memo that leaves readers with questions and no one to ask produces a flood of emails to its writer.

The tone is neutral and direct. The memo neither celebrates the policy nor apologizes for its limits. It treats readers as adults who need clear information to act, which is what most readers of memos want.`,
      [workplace, documents, register, academic(1), academic(3)],
      [
        ask(
          t("What does the first paragraph of the memo contain?", "备忘录的第一段包含什么内容？"),
          t(
            "The whole policy in a sentence: who, what, from when and on what condition",
            "用一句话概括整个规定：适用于谁、内容是什么、何时开始、有什么条件",
          ),
          [
            t("A history of working from home in the company", "公司居家办公的历史"),
            t("The results of the staff survey", "员工调查的结果"),
            t("A list of all the managers' concerns", "所有经理所担心的问题清单"),
          ],
          t(
            "The commentary says the first paragraph contains the whole policy in a sentence, so a reader who stops there knows the essential point.",
            "评论说第一段用一句话概括了整个规定，读者即使只读到这里也知道要点。",
          ),
        ),
        ask(
          t("Why does the memo explain the reasons for the policy?", "备忘录为什么要解释制定该规定的原因？"),
          t(
            "Policies imposed without explanation create resentment, and reasons make the limits easier to accept",
            "不加解释就强加的规定会引起不满，说明原因能让限制更容易被接受",
          ),
          [
            t("Because the law requires every memo to give reasons", "因为法律要求每份备忘录都说明原因"),
            t("To make the memo look longer and more serious", "为了让备忘录看起来更长、更正式"),
            t("Because staff had asked for a history of the policy", "因为员工要求了解这项规定的历史"),
          ],
          t(
            "The commentary says policies imposed without explanation create resentment, and explaining the two limits makes them easier to accept.",
            "评论说，不加解释就强加的规定会引起不满，而解释两项限制能让人更容易接受。",
          ),
        ),
        ask(
          t("Why are the memo's actions numbered?", "备忘录中的行动事项为什么要编号？"),
          t("They are separate steps, each with a date where one is needed", "它们是各自独立的步骤，需要时每项都有日期"),
          [
            t("Numbers make the memo look more official", "编号让备忘录看起来更正式"),
            t("They must be done in exactly that order", "必须严格按照那个顺序去做"),
            t("Each number refers to a different department", "每个编号代表一个不同的部门"),
          ],
          t(
            "The commentary says the actions are numbered because they are separate steps, and each has a date where one is needed.",
            "评论说行动事项编号是因为它们是独立的步骤，需要时每项都注明了日期。",
          ),
        ),
      ],
      ["Ruth", "Okonjo", "Okonjo's"],
    ),
    passage(
      "reading-a-job-posting",
      t("Reading a Job Posting", "读懂招聘启事"),
      `Project Coordinator, Community Programs
Greenway Housing Trust, full time, two-year contract

About the role
Greenway Housing Trust provides affordable homes for 4,000 families. We are looking for a project coordinator to help run our community programs, including after-school clubs, advice sessions and a summer festival.

You will
1. Plan and coordinate programs with a team of six staff and about forty volunteers.
2. Manage a budget of about 150,000 a year and report on spending each quarter.
3. Work with residents, local schools and partner organizations to design new programs.
4. Collect feedback from participants and write short reports for the board.

You will need
1. At least two years' experience organizing events or programs.
2. Strong written and spoken communication skills.
3. Experience managing a budget.
4. The ability to prioritize several projects with competing deadlines.

It would be good if you also had
1. Experience working with volunteers.
2. Knowledge of a second language spoken in our communities.

To apply, send a CV and a letter of no more than one page explaining how you meet the requirements through the careers page of our website by 30 April. Interviews will be held in the week of 12 May.

A job posting looks like a simple list, but it rewards close reading. Applicants who read it carefully learn not only what the employer wants but how to present themselves, and many applications fail because their authors read only the job title.

The first thing to notice is the distinction between requirements and preferences. The section headed "You will need" lists what the employer considers essential; an application that does not show evidence of each is likely to be rejected early, sometimes by a person who simply checks the list. The section headed "It would be good if you also had" lists advantages that might decide between strong candidates. An applicant who lacks a preferred qualification should still apply; one who lacks a required one should think carefully, or explain how other experience compensates.

Second, the duties reveal what the job actually involves, and therefore what the employer will want to hear about. Here, the duties suggest a job that is as much about people and money as about programs. Managing a budget appears both as a duty and as a requirement, which signals that it matters a great deal. Working with volunteers and residents suggests that the employer values the ability to collaborate with people who are not employees and cannot simply be told what to do.

Third, the language of the posting offers clues. The word "coordinator" implies organizing others rather than doing everything oneself, so an applicant should give examples of planning and delegating, not only of working hard. The phrase "competing deadlines" suggests that the job is busy and that priorities will often conflict.

Finally, the instructions for applying are part of the test. The posting asks for a letter of one page explaining how the applicant meets the requirements. An applicant who sends three pages, or a general letter that does not address the requirements, has shown that they did not read or did not follow instructions, which is a poor sign for a job that involves managing details.

A useful method is to copy the requirements into a table and, beside each, write one specific example from your own experience. If you cannot fill a row, you know where your application is weak. The table then becomes the plan for your letter, and the employer finds in it exactly what the posting asked for.`,
      [workplace, documents, register, academic(1), academic(3)],
      [
        ask(
          t(
            'What is the difference between "You will need" and "It would be good if you also had"?',
            "“你需要具备”和“如果你还具备……更好”有什么区别？",
          ),
          t(
            "The first lists essential requirements; the second lists advantages that might decide between strong candidates",
            "前者列出必备条件，后者列出可能在优秀候选人中起决定作用的加分项",
          ),
          [
            t("The first is for full-time staff and the second for volunteers", "前者针对全职员工，后者针对志愿者"),
            t("Both list requirements that every applicant must meet", "两者列出的都是每个申请人必须满足的条件"),
            t("The second lists the duties of the job", "后者列出的是工作职责"),
          ],
          t(
            "The commentary says the first section lists what the employer considers essential, and the second lists advantages that might decide between strong candidates.",
            "评论说，第一部分列出雇主认为必不可少的条件，第二部分列出可能在优秀候选人之间起决定作用的优势。",
          ),
        ),
        ask(
          t(
            "Why does the commentary conclude that managing a budget matters a great deal for this job?",
            "评论为什么认为管理预算对这份工作非常重要？",
          ),
          t("It appears both as a duty and as a requirement", "它既出现在职责中，又出现在要求中"),
          [
            t("The budget is larger than the employer's income", "预算比雇主的收入还多"),
            t("It is the first item in the posting", "它是启事中的第一项"),
            t("The posting says it is the only requirement", "启事说这是唯一的要求"),
          ],
          t(
            "The commentary notes that managing a budget appears both as a duty and as a requirement, which signals that it matters a great deal.",
            "评论指出，管理预算既是职责又是要求，这表明它非常重要。",
          ),
        ),
        ask(
          t("Why does the commentary call the instructions for applying part of the test?", "评论为什么说申请说明本身也是一种考验？"),
          t(
            "Not following them shows poor attention to detail, which this job requires",
            "不按说明去做，表明不够注重细节，而这份工作恰恰需要注重细节",
          ),
          [
            t("The employer will ask questions about them in the interview", "雇主会在面试中就此提问"),
            t("Applicants must memorize them", "申请人必须把它们背下来"),
            t("They contain hidden requirements for the job", "它们包含了这份工作的隐藏条件"),
          ],
          t(
            "The commentary says an applicant who ignores the one-page instruction has shown they did not read or follow instructions, a poor sign for a job managing details.",
            "评论说，不遵守一页纸要求的申请人表明自己没有阅读或遵守说明，对一份需要管理细节的工作来说是坏兆头。",
          ),
        ),
      ],
      ["Greenway", "CV"],
    ),
    passage(
      "a-cover-letter",
      t("A Cover Letter", "求职信"),
      `Dear Hiring Committee,

I am applying for the position of Project Coordinator, Community Programs, advertised on your website. For the past three years I have organized after-school programs for a youth charity, and I would welcome the chance to bring that experience to Greenway Housing Trust.

In my current role at Riverside Youth Network, I coordinate a program of weekly clubs for about 120 children, working with four staff and around twenty-five volunteers. Last year, when two of our staff left within a month, I reorganized the schedule so that no club was cancelled, and I trained six volunteers to lead sessions on their own. The program has grown by a third since I joined.

I also manage the program's budget of about 90,000 a year. I report on spending to our board each quarter, and in my second year I found savings of 8 percent by sharing equipment with a nearby school, which allowed us to open a new club for older children.

Your posting mentions working with residents to design new programs. At Riverside, I started a parents' group that meets every two months to give feedback, and two of our most popular clubs, cooking and a homework café, began as their suggestions. I would be glad to bring a similar approach to Greenway's communities.

I speak Portuguese, which I understand is spoken by many of the families you serve.

I have attached my CV, and I would welcome the opportunity to discuss the role. Thank you for your time and consideration.

Yours sincerely,
Lucia Moreno

A cover letter has one job: to persuade a reader that the writer meets the requirements of a particular position and deserves an interview. It is not a summary of the writer's life, which the CV provides, and it is not a statement of how much the writer wants the job, which the reader can assume. Lucia Moreno's letter does its job well, and the reasons can be learned.

First, it is addressed to this job and this employer. The opening names the position and connects the writer's experience to it in the first two sentences. A letter that could be sent unchanged to any employer reads as exactly that, and readers notice.

Second, it follows the employer's requirements, roughly in the order the posting lists them: coordinating programs and people, managing a budget, working with residents, and a second language. A reader checking the letter against the requirements finds each one addressed. This is not an accident. The writer clearly read the posting with care and planned the letter around it.

Third, every claim is supported by a specific example with numbers. The writer does not say she is "an excellent organizer" or "good with budgets". She describes what she did when two staff left, and the saving of 8 percent. Specific examples are believable in a way that adjectives are not, and they give interviewers something to ask about.

Fourth, the letter is short, under a page, as the posting required. It does not explain everything; it gives the reader enough to want to know more.

The tone is confident without boasting. The writer states her achievements plainly, using "I" because the letter is about her work, but she does not praise herself. The closing is polite and brief. There is no excessive gratitude, and no apology for any gaps in her experience; the letter simply does not mention the one preferred qualification, experience with volunteers in housing, that she might lack.

A useful test for any cover letter is to underline every sentence that contains specific evidence. If most of the letter is underlined, it is probably strong. If most is not, it probably says what every other applicant says.`,
      [workplace, documents, register, academic(1), academic(3)],
      [
        ask(
          t("According to the commentary, what is the one job of a cover letter?", "根据评论，求职信唯一的任务是什么？"),
          t(
            "To persuade the reader that the writer meets the requirements and deserves an interview",
            "说服读者相信写信人符合要求、值得获得面试机会",
          ),
          [
            t("To summarize the writer's whole life", "概括写信人的整个人生"),
            t("To show how much the writer wants the job", "表明写信人多么想得到这份工作"),
            t("To list every job the writer has had", "列出写信人做过的每一份工作"),
          ],
          t(
            "The commentary says a cover letter has one job: to persuade a reader that the writer meets the requirements and deserves an interview.",
            "评论说求职信只有一个任务：说服读者相信写信人符合职位要求，值得面试。",
          ),
        ),
        ask(
          t("Why does the commentary praise the letter's use of specific examples?", "评论为什么称赞这封信使用了具体的例子？"),
          t(
            "Examples with numbers are believable and give interviewers something to ask about",
            "带有数字的例子令人信服，也让面试官有话题可问",
          ),
          [
            t("Adjectives such as excellent are not allowed in letters", "信中不允许使用 excellent 这类形容词"),
            t("Examples make the letter longer than one page", "例子让信超过一页"),
            t("The employer asked for exactly three examples", "雇主要求正好三个例子"),
          ],
          t(
            "The commentary says specific examples are believable in a way that adjectives are not, and they give interviewers something to ask about.",
            "评论说，具体例子比形容词更可信，也给面试官提供了提问的内容。",
          ),
        ),
        ask(
          t("How is the letter organized, according to the commentary?", "根据评论，这封信是怎样组织的？"),
          t("Around the employer's requirements, roughly in the order the posting lists them", "围绕雇主的要求，大致按照启事列出的顺序"),
          [
            t("In the order of the writer's past jobs, oldest first", "按写信人过去工作的先后顺序，从最早的开始"),
            t("From the writer's weakest skill to the strongest", "从写信人最弱的技能到最强的"),
            t("In alphabetical order of skills", "按技能名称的字母顺序"),
          ],
          t(
            "The commentary says the letter follows the requirements roughly in the order the posting lists them, so a reader checking finds each one addressed.",
            "评论说，这封信大致按启事列出的顺序回应各项要求，核对的读者会发现每一项都有回应。",
          ),
        ),
      ],
      ["Greenway", "Greenway's", "Riverside", "Lucia", "Moreno", "Moreno's", "Portuguese", "CV"],
    ),
    passage(
      "a-complaint-and-its-reply",
      t("A Complaint and Its Reply", "投诉与回复"),
      `Subject: Order 58213: wrong item delivered twice

Dear Customer Service,

On 2 March I ordered a blue desk lamp, model DL4, from your website. On 6 March I received a white lamp of a different model. I returned it the same day, as your website instructs, and was promised a replacement. On 14 March I received a second white lamp of the same wrong model.

I have now spent two weeks without the lamp I ordered and paid for, and I have had to take a package to the post office for a return that was not my fault. I would like either the correct lamp delivered by 21 March or a full refund, including the cost of the return.

I look forward to your reply.

Yours faithfully,
Peter Wallis

Subject: Re: Order 58213: wrong item delivered twice

Dear Mr Wallis,

Thank you for writing, and I am very sorry that you have received the wrong lamp twice. That should not have happened, and I understand how frustrating it must be.

I have looked into your order. The blue DL4 lamp was listed under the wrong code in our warehouse, so that the same mistake was repeated when we sent the replacement. We have now corrected the code.

I have sent the correct lamp today by express delivery, and you should receive it by 19 March. I have also refunded the cost of your first return to your card, and added a credit of 10 to your account as an apology. You do not need to return the second white lamp; please keep it or give it away.

If the lamp does not arrive by 19 March, please reply to this email and I will deal with it personally.

Yours sincerely,
Amira Hassan, Customer Service

A complaint is a request written in difficult circumstances, and its reply is a chance to turn a frustrated customer into a loyal one. Both documents above are models.

The complaint works because it is factual and calm. It states the order number in the subject line, so that it can be traced at once. It gives dates, models and what happened at each step, without exaggeration. It describes the inconvenience briefly, which makes the request reasonable. And it ends with a specific request and a date: the correct lamp or a refund. Anger, however justified, rarely helps a complaint. A reader who feels attacked becomes defensive; a reader given clear facts and a clear request can simply act.

The reply works for several reasons. It begins with an apology that is specific and unqualified. "I am very sorry that you have received the wrong lamp twice" names the problem; vague apologies such as "we apologize for any inconvenience" sound automatic and suggest the writer has not read the complaint.

It then explains what went wrong, briefly, and what has been done to prevent it from happening again. Customers who understand the cause of a mistake are more likely to believe it will not recur.

It gives more than the customer asked for, but not absurdly more: the correct lamp sent quickly, the refund requested, a small credit, and the second lamp to keep. Each is concrete.

Finally, it offers a personal point of contact. The writer uses "I" throughout, rather than "we" or the passive voice, which tells the customer that a real person has taken responsibility.

Neither document is long. Both treat the reader as a reasonable person, and both state exactly what is expected or offered. That combination resolves most disputes before they become serious.`,
      [workplace, documents, register, academic(2)],
      [
        ask(
          t("Why does the commentary say the complaint works?", "评论为什么说这封投诉信写得好？"),
          t("It is factual and calm and ends with a specific request and date", "它客观冷静，并以具体的要求和日期结尾"),
          [
            t("It expresses the customer's anger strongly", "它强烈地表达了顾客的愤怒"),
            t("It threatens to tell other customers", "它威胁要告诉其他顾客"),
            t("It asks for the largest possible refund", "它要求尽可能多的退款"),
          ],
          t(
            "The commentary says the complaint is factual and calm, gives dates and details without exaggeration, and ends with a specific request and a date.",
            "评论说投诉信客观冷静，给出日期和细节而不夸大，并以具体的要求和日期结尾。",
          ),
        ),
        ask(
          t('Why is "we apologize for any inconvenience" a weak apology?', "为什么“对造成的任何不便我们深表歉意”是一种无力的道歉？"),
          t(
            "It is vague and sounds automatic, suggesting the writer has not read the complaint",
            "它含糊不清，听起来像套话，让人觉得写信人没读投诉内容",
          ),
          [
            t("It is too long and too formal", "它太长、太正式"),
            t("It admits the company was wrong", "它承认了公司有错"),
            t("It uses the word we instead of I", "它用了 we 而不是 I"),
          ],
          t(
            "The commentary contrasts a specific apology that names the problem with vague ones that sound automatic and suggest the complaint was not read.",
            "评论把点明问题的具体道歉与听起来像套话、让人觉得没读投诉的含糊道歉作了对比。",
          ),
        ),
        ask(
          t("Why does the reply explain what went wrong in the warehouse?", "回复为什么要解释仓库里出了什么错？"),
          t(
            "Customers who understand the cause are more likely to believe it will not happen again",
            "了解原因的顾客更有可能相信这种错误不会再发生",
          ),
          [
            t("To blame the warehouse staff for the mistake", "把错误归咎于仓库员工"),
            t("Because the customer asked about the warehouse", "因为顾客问起了仓库的事"),
            t("To make the reply longer than the complaint", "为了让回复比投诉更长"),
          ],
          t(
            "The commentary says customers who understand the cause of a mistake are more likely to believe it will not recur.",
            "评论说，了解错误原因的顾客更有可能相信它不会再次发生。",
          ),
        ),
      ],
      ["Peter", "Wallis", "Amira", "Hassan", "Mr", "DL", "Re"],
    ),
    passage(
      "instructions-for-a-new-hire",
      t("Instructions for a New Hire", "给新员工的说明"),
      `Welcome to the Finance Team: Your First Week

Before you arrive
Your manager, Joan Kerr, will meet you at the main entrance at 9:00 on Monday. Please bring a form of photo identification and your bank details for payroll.

Monday
1. Collect your building pass from the front desk. You will need it to enter every floor.
2. Joan will show you your desk and introduce you to the team.
3. In the afternoon, the IT office will set up your computer and accounts. This usually takes about two hours.

Tuesday to Thursday
You will spend these days with Omar Diaz, a senior colleague, who will show you how the team processes invoices. You will begin by watching, then work on simple invoices with Omar checking each one. Do not approve any payment on your own during this week.

Friday
You and Joan will meet for thirty minutes to discuss how the week went and agree your goals for the first month. Please come with any questions.

Who to ask
For questions about your work, ask Omar or Joan. For problems with your computer, call the IT office on extension 300. For questions about pay or leave, contact human resources on extension 150.

Good instructions are invisible: the reader follows them without noticing that they are being guided. Bad instructions are noticed constantly, because the reader keeps stopping to wonder what to do next. Documents for new employees matter more than their length suggests, because the first week shapes how a person feels about an organization, and confusion in that week is remembered.

The model above is organized by time, because a new employee's main question is "what happens next?" Each day has its own heading, so that the reader can find the current day at once. Within each day, the steps that must happen in order are numbered.

The instructions are specific. They name people, places, times and durations. "Your manager will meet you" would leave a new employee wondering where and when; "Joan Kerr will meet you at the main entrance at 9:00" answers both questions. Specificity reduces anxiety, which is high in any first week.

Each instruction begins with what the reader should do, usually with a verb: "Collect", "Please bring", "Do not approve". Instructions written this way are easier to follow than descriptions such as "building passes are available from the front desk", which leave the reader to work out what is expected.

The single prohibition, "Do not approve any payment on your own during this week", is stated plainly and placed where the risk arises. Important warnings should not be buried in a general section of rules at the end; they belong at the point where the reader might make the mistake.

The final section answers the question every new employee asks and is often too shy to say aloud: who do I ask? By naming a person or office for each kind of question, it prevents new staff from bothering the wrong people or not asking at all.

The tone is friendly but efficient. The document welcomes the reader in its title and then gets on with the information. A new employee wants to feel welcome, but above all wants to know what to do. Good instructions provide both by being clear.`,
      [workplace, documents, register, academic(2)],
      [
        ask(
          t("Why are the instructions organized by time?", "这份说明为什么按时间来组织？"),
          t('A new employee\'s main question is "what happens next?"', "新员工最关心的问题是“接下来做什么？”"),
          [
            t("The company organizes every document by time", "公司所有文件都按时间组织"),
            t("Joan Kerr prefers to read documents that way", "琼·克尔喜欢那样阅读文件"),
            t("It makes the document shorter", "这样能让文件更短"),
          ],
          t(
            'The commentary says the model is organized by time because a new employee\'s main question is "what happens next?"',
            "评论说范文按时间组织，是因为新员工最关心的问题是“接下来会发生什么？”",
          ),
        ),
        ask(
          t("Why does the commentary prefer instructions that begin with a verb?", "评论为什么更喜欢以动词开头的说明？"),
          t(
            "They tell the reader what to do, instead of leaving the reader to work it out",
            "它们直接告诉读者该做什么，而不是让读者自己去琢磨",
          ),
          [
            t("Verbs are shorter than nouns", "动词比名词短"),
            t("They sound more friendly than descriptions", "它们听起来比描述更友好"),
            t("Descriptions are not allowed in instructions", "说明中不允许使用描述"),
          ],
          t(
            'The commentary contrasts "Collect your building pass" with a description that leaves the reader to work out what is expected.',
            "评论把“领取你的出入证”这样的指令与需要读者自己去理解要求的描述作了对比。",
          ),
        ),
        ask(
          t("Where does the commentary say important warnings should be placed?", "评论认为重要的警示应该放在哪里？"),
          t("At the point where the reader might make the mistake", "放在读者可能犯错的地方"),
          [
            t("In a general section of rules at the end", "放在文末的一般规定部分"),
            t("In the title of the document", "放在文件标题里"),
            t("In a separate email sent later", "放在之后另发的邮件里"),
          ],
          t(
            "The commentary says warnings should not be buried in a general section at the end; they belong where the reader might make the mistake.",
            "评论说，警示不应该埋在文末的一般规定里，而应放在读者可能犯错的地方。",
          ),
        ),
      ],
      ["Joan", "Kerr", "Omar", "Diaz", "IT"],
    ),
  ],
};
