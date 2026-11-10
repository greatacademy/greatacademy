import type { ReadingUnitDef } from "@ga/content";
import { t } from "@ga/content";

const situation = { topic: "rhetorical-situation", weight: 0.3 } as const;
const appeals = { topic: "rhetorical-appeals", weight: 0.3 } as const;
const appealsSome = { topic: "rhetorical-appeals", weight: 0.2 } as const;
const devices = { topic: "rhetorical-devices", weight: 0.3 } as const;
const devicesSome = { topic: "rhetorical-devices", weight: 0.2 } as const;
const fallacies = { topic: "logical-fallacies", weight: 0.3 } as const;
const sources = { topic: "evaluating-sources", weight: 0.3 } as const;
const academicWords = { topic: "academic-words-1", weight: 0.1 } as const;

/** voicesOfPersuasion is a reading unit of grades 9 to 12 of original speeches, letters and editorials, whose questions practice reading how a text persuades. */
export const voicesOfPersuasion: ReadingUnitDef = {
  id: "voices-of-persuasion",
  title: t("Voices of Persuasion", "说服之声"),
  passages: [
    {
      id: "the-bridge-on-mill-street",
      title: t("The Bridge on Mill Street", "磨坊街的桥"),
      body: `Members of the council, I have lived on Mill Street for forty-one years. I raised three children there. I have crossed the old bridge over the creek more times than I could count, first pushing a stroller, then walking beside a bicycle, and now leaning on this cane.

Last spring, a piece of the railing fell into the water. Nobody was hurt that day. But every morning since, I have watched children walk to school along that bridge, inches from the gap, and I have held my breath.

Your own engineers inspected the bridge in March. Their report, which is in front of you tonight, rates it as poor and recommends repairs within one year. That year ends in six weeks.

I know the budget is tight. I know there are other roads, other needs, other neighborhoods asking for your help. But a bridge is not a luxury. It is the only way to the school for two hundred families.

I am not an engineer, and I am not a politician. I am a grandmother who would like to stop holding her breath. Please vote tonight to repair the bridge on Mill Street.`,
      topics: [situation, appeals],
      glossed: ["stroller", "cane", "engineers", "inspected", "railing"],
      xp: 5,
      questions: [
        {
          prompt: t("Who is the speaker's audience?", "演讲者的听众是谁？"),
          right: t("The members of the town council, who will vote on the repair", "将要对维修进行投票的镇议会议员"),
          wrong: [
            t("The children who walk to school across the bridge", "过桥上学的孩子们"),
            t("The engineers who inspected the bridge", "检查过这座桥的工程师"),
            t("The families of other neighborhoods", "其他社区的家庭"),
          ],
          solution: t(
            'She opens with "Members of the council" and ends by asking them to vote tonight. The children and engineers are mentioned, but she is not speaking to them.',
            '她以 "Members of the council" 开头，结尾请他们今晚投票。孩子和工程师虽被提到，但她不是在对他们说话。',
          ),
        },
        {
          prompt: t("How does the first paragraph mainly persuade?", "第一段主要用什么方式说服人？"),
          right: t(
            "Through ethos: her long life on the street makes her a credible witness",
            "人格诉求：她在这条街上生活了很久，使她成为可信的见证者",
          ),
          wrong: [
            t("Through logos: it gives the results of the engineers' report", "理性诉求：它给出了工程师报告的结果"),
            t("Through a fallacy: it attacks the council members", "谬误：它攻击了议员们"),
            t("Through a rhetorical question about the budget", "一个关于预算的反问"),
          ],
          solution: t(
            "Forty-one years on Mill Street, three children raised there, and countless crossings establish that she knows the bridge. That is an appeal to her credibility, or ethos.",
            "在磨坊街住了四十一年、在那里养大三个孩子、无数次过桥，这些都说明她了解这座桥。这是在诉诸她的可信度，即人格诉求。",
          ),
        },
        {
          prompt: t("Why does the speaker mention the engineers' report?", "演讲者为什么提到工程师的报告？"),
          right: t("To add expert evidence to her personal story", "在她的个人经历之外加上专家的证据"),
          wrong: [
            t("To show that she is an engineer herself", "为了表明她自己是工程师"),
            t("To prove that the budget is tight", "为了证明预算紧张"),
            t("To blame the engineers for the broken railing", "为了把栏杆损坏归咎于工程师"),
          ],
          solution: t(
            'She admits she is "not an engineer," so she borrows the authority of people who are. The report rates the bridge as poor and sets a deadline, which turns her worry into a fact the council cannot ignore.',
            '她承认自己 "not an engineer"，所以借用了专业人士的权威。报告把桥评为差并给出期限，让她的担忧变成议会无法忽视的事实。',
          ),
        },
      ],
    },
    {
      id: "a-letter-on-the-four-day-week",
      title: t("A Letter on the Four-Day Week", "关于四天上学制的一封信"),
      body: `To the editor:

The school board is considering a plan to move our schools to a four-day week. Supporters say the plan would save money on buses and heating. I urge the board to look more carefully before it decides.

First, who would care for young children on the fifth day? Many parents in our town work five days a week. For them, a free Friday is not a gift; it is a new bill for childcare, or a child left home alone.

Second, the savings may be smaller than they seem. A study by the state education office looked at districts that had made the change. It found that most saved less than two percent of their budgets, because teachers' pay and building costs did not shrink.

Third, longer school days are hard on the youngest students. A seven-year-old who is tired by two o'clock will not learn more by staying until four.

I do not doubt that the board wants to save money, and it should. But our schools exist for our children, not for our budget. Before we change their week, let us make sure the change is worth it.

A parent of two`,
      topics: [appealsSome, sources],
      glossed: ["childcare", "districts", "budgets"],
      xp: 5,
      questions: [
        {
          prompt: t("What is the main purpose of the letter?", "这封信的主要目的是什么？"),
          right: t("To persuade the board to examine the plan carefully before adopting it", "说服董事会在采用这个计划之前仔细审视它"),
          wrong: [
            t("To inform readers about how school buses work", "告诉读者校车是怎样运营的"),
            t("To entertain readers with a story about a tired child", "用一个疲倦孩子的故事娱乐读者"),
            t("To announce that the board has chosen a four-day week", "宣布董事会已选择四天上学制"),
          ],
          solution: t(
            'The writer says "I urge the board to look more carefully" and ends "let us make sure the change is worth it." Every paragraph gives a reason to slow down, so the purpose is to persuade.',
            '作者说 "I urge the board to look more carefully"，结尾写 "let us make sure the change is worth it"。每一段都给出放慢决定的理由，所以目的是说服。',
          ),
        },
        {
          prompt: t("Why is the state education office's study good evidence?", "为什么州教育办公室的研究是有力的证据？"),
          right: t("It comes from an official office that looked at many districts", "它来自一个考察了许多学区的官方机构"),
          wrong: [
            t("It was written by the parent who wrote the letter", "它是写信的家长写的"),
            t("It shows that every district saved a lot of money", "它表明每个学区都省了很多钱"),
            t("It is the opinion of a single teacher", "它是一位老师的个人看法"),
          ],
          solution: t(
            "A named, official source that studied several districts gains nothing from the answer and draws on many cases, so its finding carries more weight than one person's opinion.",
            "一个有名称的官方来源研究了多个学区，它不会因答案而获利，且依据许多案例，所以它的结论比个人看法更有分量。",
          ),
        },
        {
          prompt: t("What does the writer do in the last paragraph before restating the position?", "作者在最后一段重申立场之前做了什么？"),
          right: t("Grants that the board is right to want to save money", "承认董事会想省钱是对的"),
          wrong: [
            t("Attacks the board members as careless people", "攻击董事会成员是粗心的人"),
            t("Gives a new statistic about heating costs", "给出关于取暖费用的新数据"),
            t("Asks readers to vote in the next election", "要求读者在下次选举中投票"),
          ],
          solution: t(
            '"I do not doubt that the board wants to save money, and it should" admits the other side\'s goal. Granting a fair point makes the writer seem reasonable before the final turn with "But".',
            '"I do not doubt that the board wants to save money, and it should" 承认了对方的目标。先承认合理之处，再用 "But" 转折，让作者显得通情达理。',
          ),
        },
      ],
    },
    {
      id: "we-who-plant-trees",
      title: t("We Who Plant Trees", "种树的我们"),
      body: `Friends, look around you. The ground beneath your feet was a parking lot five years ago. Today it is a park, and the trees you are standing under were planted by volunteers, by people like you, one shovel at a time.

We planted them in the rain. We planted them in the heat. We planted them when people said it could not be done.

Some of those trees will outlive every person here. They will shade children who have not yet been born. They will cool streets we will never walk. That is the strange gift of planting a tree: you work for a future you will not see.

Is there any better way to spend a Saturday morning?

This year, we want to plant five hundred more along River Road. The city has given us the land and the young trees. What it cannot give us is hands. We need yours.

So bring your gloves. Bring your neighbors. Bring your children, so that one day they can stand under these branches and say, "My family planted this."

Thank you. Now let us get to work.`,
      topics: [devices, appealsSome],
      glossed: ["volunteers", "shovel", "outlive"],
      xp: 5,
      questions: [
        {
          prompt: t(
            'Which device is used in "We planted them in the rain. We planted them in the heat. We planted them when people said it could not be done"?',
            '"We planted them in the rain. We planted them in the heat. We planted them when people said it could not be done" 运用了哪种手法？',
          ),
          right: t("Anaphora", "首语重复"),
          wrong: [t("Antithesis", "对照"), t("Rhetorical question", "反问"), t("Allusion", "典故")],
          solution: t(
            'Three sentences in a row begin with "We planted them." Repeating the opening words builds a rhythm of steady effort.',
            '连续三个句子都以 "We planted them" 开头。重复开头的词营造出坚持不懈的节奏。',
          ),
        },
        {
          prompt: t(
            'What is the effect of the question "Is there any better way to spend a Saturday morning?"',
            '"Is there any better way to spend a Saturday morning?" 这个问题有什么作用？',
          ),
          right: t("It invites the audience to agree that volunteering is worth their time", "引导听众认同做志愿者值得花时间"),
          wrong: [
            t("It asks the audience to suggest other activities", "请听众提出其他活动"),
            t("It shows that the speaker is unsure of the plan", "表明演讲者对计划没有把握"),
            t("It gives a fact about how people spend weekends", "给出人们怎样度过周末的事实"),
          ],
          solution: t(
            'It is a rhetorical question: the speaker expects no answer, because the expected answer, "No," is the point.',
            '这是一个反问：演讲者并不期待回答，因为预期的答案 "No" 本身就是要表达的意思。',
          ),
        },
        {
          prompt: t("What does the speaker ask the audience to do?", "演讲者要求听众做什么？"),
          right: t("Help plant five hundred trees along River Road", "帮忙沿河路种五百棵树"),
          wrong: [
            t("Give money to the city for young trees", "给市政府捐钱买树苗"),
            t("Turn the park back into a parking lot", "把公园改回停车场"),
            t("Vote for a new city council", "投票选出新的市议会"),
          ],
          solution: t(
            'The city has given land and trees; "What it cannot give us is hands. We need yours." The request is for people to come and plant.',
            '市政府提供了土地和树苗；"What it cannot give us is hands. We need yours." 要求的是人们来种树。',
          ),
        },
      ],
    },
    {
      id: "the-case-against-the-mall",
      title: t("The Case Against the Mall", "反对建商场的理由"),
      body: `A company has asked to build a shopping mall on the meadow north of town, and the planning board will decide next month. Both sides have strong feelings, but strong feelings are not the same as good arguments, and some of what I have heard this month falls short.

One speaker at last week's meeting said we should reject the mall because the company's director "has never lived in a small town and doesn't care about people like us." Perhaps that is true. It tells us nothing about whether the mall is a good idea.

Another warned that if we allow one mall, "soon every field will be paved, and our town will disappear under concrete." But one decision does not force the next. The board votes on each plan separately.

On the other side, a supporter claimed that "everyone wants the mall, so the board should approve it." Even if many people want something, that does not make it wise.

There are real questions here. How much traffic would the mall bring to the narrow roads? What would happen to the shops on Main Street? Would the meadow's wetland be protected? These deserve answers. Let us argue about them, and leave the rest aside.`,
      topics: [fallacies],
      glossed: ["meadow", "wetland", "paved", "concrete"],
      xp: 5,
      questions: [
        {
          prompt: t(
            "Which fallacy does the first speaker commit by talking about the director?",
            "第一位发言者谈论那位主管时犯了哪种谬误？",
          ),
          right: t("Ad hominem", "人身攻击"),
          wrong: [t("Bandwagon", "从众"), t("False dilemma", "非此即彼"), t("Hasty generalization", "以偏概全")],
          solution: t(
            'The speaker attacks the director\'s background instead of the plan. As the writer says, it "tells us nothing about whether the mall is a good idea."',
            '这位发言者攻击的是主管的背景而不是计划本身。正如作者所说，这 "tells us nothing about whether the mall is a good idea"。',
          ),
        },
        {
          prompt: t(
            'What fallacy is in the warning that "soon every field will be paved"?',
            '"soon every field will be paved" 这一警告中有什么谬误？',
          ),
          right: t("Slippery slope", "滑坡"),
          wrong: [t("Straw man", "稻草人"), t("Ad hominem", "人身攻击"), t("Bandwagon", "从众")],
          solution: t(
            'It claims that one mall will lead step by step to an extreme result, without showing why. The writer answers that "one decision does not force the next."',
            '它断言一个商场会一步步导致极端的结果，却没有说明理由。作者回应说 "one decision does not force the next"。',
          ),
        },
        {
          prompt: t("What does the writer want the debate to focus on?", "作者希望辩论聚焦于什么？"),
          right: t("Real questions such as traffic, Main Street's shops and the wetland", "真正的问题，例如交通、主街的商店和湿地"),
          wrong: [
            t("Whether the company's director has lived in a small town", "公司主管是否在小镇生活过"),
            t("How many people want the mall", "有多少人想要这个商场"),
            t("Which side has the strongest feelings", "哪一方的感受最强烈"),
          ],
          solution: t(
            'The last paragraph lists the questions that "deserve answers" and asks readers to "argue about them, and leave the rest aside." The other choices are the faulty arguments the writer sets aside.',
            '最后一段列出了 "deserve answers" 的问题，并请读者 "argue about them, and leave the rest aside"。其他选项正是作者搁置的错误论证。',
          ),
        },
      ],
    },
    {
      id: "to-the-graduates",
      title: t("To the Graduates", "致毕业生"),
      body: `Graduates, four years ago you walked into this building as strangers. Today you walk out as something harder to name: not quite adults, not children any more, and certainly not strangers.

You have learned a great deal here. You have learned to write an essay at midnight and to solve an equation at dawn. You have learned that a friend can be found in the last seat of the bus, and that a rival can become a teammate by spring.

But the most important lesson was never on a test. It is this: the people who succeed are not the ones who never fall. They are the ones who fall and get up, and fall and get up again.

Some of you will leave this town; some of you will stay and make it better. Some of you know exactly where you are going; most of you do not, and that is fine. Not knowing is where every discovery begins.

So go out and fall. Go out and get up. Ask questions that have no easy answers. And when you are tired, remember this room, these faces and this day, and know that we are proud of you.

Congratulations, graduates.`,
      topics: [devicesSome, situation],
      glossed: ["graduates", "equation", "rival"],
      xp: 5,
      questions: [
        {
          prompt: t("Which line uses antithesis?", "哪一句运用了对照？"),
          right: t(
            "Some of you know exactly where you are going; most of you do not",
            "Some of you know exactly where you are going; most of you do not（有些人确切知道要去哪里，大多数人不知道）",
          ),
          wrong: [
            t(
              "Graduates, four years ago you walked into this building as strangers",
              "Graduates, four years ago you walked into this building as strangers（四年前你们作为陌生人走进这栋楼）",
            ),
            t("You have learned a great deal here", "You have learned a great deal here（你们在这里学到了很多）"),
            t("Congratulations, graduates", "Congratulations, graduates（祝贺你们，毕业生们）"),
          ],
          solution: t(
            "Knowing exactly and not knowing are set side by side in two balanced halves, so each makes the other sharper. That is antithesis.",
            "确切知道与不知道被放在平衡的两半句中，彼此衬托得更鲜明。这就是对照。",
          ),
        },
        {
          prompt: t("What is the speaker's purpose?", "演讲者的目的是什么？"),
          right: t("To honor the graduates and encourage them as they leave", "向毕业生致敬，并在他们离开时鼓励他们"),
          wrong: [
            t("To persuade the graduates to stay in town", "说服毕业生留在镇上"),
            t("To inform the graduates about their test results", "告知毕业生他们的考试成绩"),
            t("To warn the graduates that most of them will fail", "警告毕业生他们大多数会失败"),
          ],
          solution: t(
            'The speech praises what the graduates learned, gives them a lesson for the future and ends "we are proud of you." It welcomes both leaving and staying, so it is not urging either.',
            '演讲称赞毕业生学到的东西，给他们一个面向未来的道理，最后说 "we are proud of you"。它对离开和留下都表示欢迎，所以并不是在劝说哪一种。',
          ),
        },
        {
          prompt: t('What does the speaker mean by "So go out and fall"?', '演讲者说 "So go out and fall" 是什么意思？'),
          right: t("Do not fear failure, because getting up again is how people succeed", "不要害怕失败，因为重新站起来才是成功之道"),
          wrong: [
            t("The graduates should be careful not to trip on the stairs", "毕业生下楼梯时要小心别摔倒"),
            t("Most of the graduates are going to fail", "大多数毕业生都会失败"),
            t("The graduates should leave in the autumn", "毕业生应该在秋天离开"),
          ],
          solution: t(
            'It follows the lesson that successful people "fall and get up, and fall and get up again." Falling here stands for failing, and the speaker urges the graduates to risk it.',
            '这句话紧接着那个道理：成功的人 "fall and get up, and fall and get up again"。这里的跌倒代表失败，演讲者鼓励毕业生敢于冒这个险。',
          ),
        },
      ],
    },
    {
      id: "the-miracle-tea",
      title: t("The Miracle Tea", "神奇的茶"),
      body: `The advertisement filled a whole page of the Sunday paper. "Doctors Are Amazed!" it said in large red letters. Below was a photograph of a smiling woman holding a cup of tea.

"Thousands of people already drink Golden Leaf Tea every day," the advertisement went on. "Join them, and feel ten years younger!"

A reader who looks closely will find reasons to doubt. Which doctors are amazed? The advertisement never names one. The smiling woman is described only as "a happy customer," and the small print at the bottom admits that she is a paid model.

The advertisement does offer a number: "In our study, nine out of ten drinkers felt more energetic." But the study was run by the company that sells the tea, and it included only ten people. A study that small, by people who profit from the result, proves very little.

Finally, the claim that thousands of people drink the tea is not evidence that it works. Many people once believed that the sun went around the Earth.

None of this means the tea is harmful. It may be a pleasant drink. But a careful reader should ask who is speaking, what they gain, and how much they really know.`,
      topics: [sources, fallacies, academicWords],
      glossed: ["advertisement", "energetic", "profit"],
      xp: 5,
      questions: [
        {
          prompt: t(
            'Which fallacy is in "Thousands of people already drink Golden Leaf Tea every day. Join them"?',
            '"Thousands of people already drink Golden Leaf Tea every day. Join them" 中有什么谬误？',
          ),
          right: t("Bandwagon", "从众"),
          wrong: [t("Ad hominem", "人身攻击"), t("Straw man", "稻草人"), t("Slippery slope", "滑坡")],
          solution: t(
            "It urges readers to drink the tea because many others do. As the writer notes, popularity is not evidence that the tea works.",
            "它以很多人都在喝为由劝读者喝这种茶。正如作者指出的，流行并不能证明这种茶有效。",
          ),
        },
        {
          prompt: t("Why does the company's study prove very little?", "为什么公司的研究几乎证明不了什么？"),
          right: t("It was small and run by people who profit from the result", "研究规模很小，而且是由从结果中获利的人做的"),
          wrong: [
            t("It was printed in a Sunday paper", "它刊登在周日的报纸上"),
            t("It found that the tea is harmful", "它发现这种茶有害"),
            t("It was run by amazed doctors", "它是由惊讶的医生做的"),
          ],
          solution: t(
            'The study "included only ten people," too few to generalize from, and the company "profit[s] from the result," so it has a reason to report good news.',
            '这项研究 "included only ten people"，人数太少，无法据此概括；而且公司会 "profit from the result"，所以它有理由只报喜。',
          ),
        },
        {
          prompt: t("What does the writer suggest a careful reader should do?", "作者建议细心的读者应该怎么做？"),
          right: t("Ask who is speaking, what they gain and how much they know", "问清楚是谁在说、他们能得到什么、他们懂多少"),
          wrong: [
            t("Never drink tea of any kind", "永远不喝任何茶"),
            t("Trust any claim that includes a number", "相信任何带数字的说法"),
            t("Believe the advertisement because it is in the paper", "因为广告登在报纸上就相信它"),
          ],
          solution: t(
            'The last sentence names the three questions. The writer says the tea "may be a pleasant drink," so the point is to question sources, not to avoid tea.',
            '最后一句列出了这三个问题。作者说这种茶 "may be a pleasant drink"，所以重点是质疑来源，而不是不喝茶。',
          ),
        },
      ],
    },
    {
      id: "the-right-to-read",
      title: t("The Right to Read", "阅读的权利"),
      body: `Last month, a group of parents asked our school to remove a novel from the tenth-grade reading list. The book, they said, deals with war and grief, and it is too upsetting for students.

I understand their concern. No parent wants to see a child hurt, and some books are painful to read. But I believe the novel should stay, and I want to explain why.

First, the students in tenth grade are fifteen and sixteen years old. Many of them have already met grief in their own lives, through the loss of a grandparent, a friend or a pet. A book that treats loss honestly can help them understand what they feel.

Second, the novel is taught, not simply handed out. Teachers guide students through it, discuss it in class and give them room to talk about what disturbs them. That is exactly the kind of support a hard subject needs.

Third, removing a book because it upsets some readers sets a rule that could empty the library. Nearly every great book upsets someone.

Families who object should be able to choose another book for their own child, and our school already allows that. But one family's choice should not decide what every student may read.`,
      topics: [appeals],
      glossed: ["novel", "grief", "disturbs"],
      xp: 5,
      questions: [
        {
          prompt: t("What does the writer do in the second paragraph before stating the claim?", "作者在第二段陈述论点之前做了什么？"),
          right: t("Acknowledges the parents' concern as understandable", "承认家长的担忧是可以理解的"),
          wrong: [
            t("Attacks the parents for wanting to ban books", "攻击家长想要禁书"),
            t("Gives statistics about tenth-grade students", "给出关于十年级学生的数据"),
            t("Retells the plot of the novel", "复述小说的情节"),
          ],
          solution: t(
            '"I understand their concern. No parent wants to see a child hurt" grants the other side\'s feelings. This builds goodwill before the writer disagrees.',
            '"I understand their concern. No parent wants to see a child hurt" 承认了对方的感受。这在表达反对之前先建立了善意。',
          ),
        },
        {
          prompt: t("Which reason relies mainly on logos?", "哪个理由主要依靠理性诉求？"),
          right: t(
            "Removing a book because it upsets some readers sets a rule that could empty the library",
            "因为有些读者不安就撤下一本书，会立下一个可能让图书馆空掉的规则",
          ),
          wrong: [
            t("No parent wants to see a child hurt", "没有哪个家长愿意看到孩子受伤害"),
            t("The writer understands the parents' concern", "作者理解家长的担忧"),
            t("Some books are painful to read", "有些书读起来让人痛苦"),
          ],
          solution: t(
            "It reasons from a principle to its consequence: if upsetting someone were enough, nearly every great book would go. That logical step is an appeal to reason.",
            "它从一个原则推出其后果：如果让人不安就足以撤书，那么几乎每本好书都要被撤下。这一推理是在诉诸理性。",
          ),
        },
        {
          prompt: t("What solution does the writer offer for families who object?", "作者为反对的家庭提出了什么解决办法？"),
          right: t("They can choose another book for their own child", "他们可以为自己的孩子选择另一本书"),
          wrong: [
            t("They can remove the book from the library", "他们可以把这本书从图书馆撤下"),
            t("They can teach the class themselves", "他们可以自己来上这门课"),
            t("They can move their child to another school", "他们可以让孩子转学"),
          ],
          solution: t(
            'The last paragraph says families "should be able to choose another book for their own child," which the school already allows, while the book stays for everyone else.',
            '最后一段说这些家庭 "should be able to choose another book for their own child"，学校已经允许这样做，而这本书仍保留给其他学生。',
          ),
        },
      ],
    },
    {
      id: "a-speech-for-the-river",
      title: t("A Speech for the River", "为河流发声"),
      body: `When my grandfather was a boy, he could see the stones at the bottom of this river. He caught fish here with his bare hands. On summer evenings, the whole town came down to swim.

When my father was a boy, the factories had arrived. The water turned brown. The fish grew few, and the swimming stopped.

When I was a boy, a sign stood where we stand now. It said: Danger. Do Not Touch the Water.

Three generations. One river. Is that the story we want to tell our children?

It does not have to be. Ten years ago, this town passed a law that the factories must clean their water before it reaches the river. Since then, scientists from the state university have tested the river every season. Their latest report shows that the water is the cleanest it has been in sixty years, and that fish have returned to every stretch they tested.

The sign is gone. But the work is not finished. The law expires next year, and some say it costs too much to renew.

I say we cannot afford to lose what we have won. Renew the law, and let the next boy who stands here see the stones again.`,
      topics: [devicesSome, appealsSome],
      glossed: ["factories", "generations", "expires", "renew"],
      xp: 5,
      questions: [
        {
          prompt: t("How do the first three paragraphs persuade?", "前三段是怎样说服人的？"),
          right: t(
            "They tell the river's decline through three generations, appealing to feeling",
            "它们通过三代人讲述河流的衰败，诉诸情感",
          ),
          wrong: [
            t("They give the results of the scientists' tests", "它们给出科学家的检测结果"),
            t("They attack the factory owners as bad people", "它们攻击工厂主是坏人"),
            t("They explain how the law was passed", "它们解释这项法律是怎样通过的"),
          ],
          solution: t(
            'Each paragraph begins "When my ... was a boy" and shows a loss: clear water, then brown water, then a danger sign. The family story makes the audience feel what was lost.',
            '每段都以 "When my ... was a boy" 开头，展示一次失去：清澈的水，然后是浑浊的水，再然后是危险标志。这个家族故事让听众感受到失去了什么。',
          ),
        },
        {
          prompt: t("Why does the speaker cite the state university's scientists?", "演讲者为什么引用州立大学科学家的研究？"),
          right: t("To show with credible evidence that the law has worked", "用可信的证据表明这项法律已经奏效"),
          wrong: [
            t("To show that the factories are still polluting", "为了表明工厂仍在污染"),
            t("To prove that his grandfather caught fish", "为了证明他祖父抓过鱼"),
            t("To argue that the law costs too much", "为了论证这项法律代价太高"),
          ],
          solution: t(
            'The scientists tested the river every season and found it "the cleanest it has been in sixty years." Expert, regular testing turns the emotional story into proof that renewing the law is worth it.',
            '科学家每个季节都检测河水，发现它是 "the cleanest it has been in sixty years"。专家的定期检测把感人的故事变成了值得续订这项法律的证据。',
          ),
        },
        {
          prompt: t(
            'What is the effect of ending with "let the next boy who stands here see the stones again"?',
            '以 "let the next boy who stands here see the stones again" 结尾有什么效果？',
          ),
          right: t("It echoes the opening image, so the speech comes full circle", "它呼应了开头的画面，使演讲首尾相连"),
          wrong: [
            t("It introduces a new reason the audience has not heard", "它引入了一个听众没听过的新理由"),
            t("It admits that the law has failed", "它承认这项法律失败了"),
            t("It asks a question the audience must answer", "它提出了一个听众必须回答的问题"),
          ],
          solution: t(
            'The speech began with a grandfather who could "see the stones at the bottom." Returning to that image ties the future to the past and gives the audience a clear picture of what renewing the law would win.',
            '演讲开头讲祖父能 "see the stones at the bottom"。回到这个画面把未来和过去连在一起，让听众清楚地看到续订法律能赢得什么。',
          ),
        },
      ],
    },
    {
      id: "two-reports-on-homework",
      title: t("Two Reports on Homework", "关于家庭作业的两份报告"),
      body: `A student writing a report on homework found two sources that seemed to disagree.

The first was a web page titled "Homework Is Ruining Childhood!" It said that "experts agree homework is useless" and that "kids everywhere are miserable." The page named no experts, gave no date and linked to no study. At the bottom, it advertised a tutoring app that promises to "finish your homework for you."

The second was a summary of research published by a university's school of education. It described more than fifty studies carried out over twenty years. It found that homework helped older students in high school, especially when it was short and closely tied to class lessons, but that it did little for young children. The authors were named, and each study was listed with its date.

At first, the student thought the sources were simply on opposite sides. But reading more closely, she saw that they were not equals. The first source had no evidence and something to sell. The second drew on many studies and gave a more careful answer than either "homework is good" or "homework is bad."

In her report, she used the second source. She mentioned the first only as an example of a claim that sounds certain but rests on nothing.`,
      topics: [sources, academicWords],
      glossed: ["tutoring", "miserable"],
      xp: 5,
      questions: [
        {
          prompt: t("Why is the web page a weak source?", "为什么那个网页是不可靠的来源？"),
          right: t("It names no experts, gives no date or study, and sells a product", "它没有列出专家、日期或研究，还在推销产品"),
          wrong: [
            t("It disagrees with the student's opinion", "它与学生的看法不同"),
            t("It is about homework rather than school", "它讲的是家庭作业而不是学校"),
            t("It was written by a university", "它是一所大学写的"),
          ],
          solution: t(
            "The page fails every test: no named author or experts, no date, no study, and an advertisement for an app that profits from students' dislike of homework.",
            "这个网页每一项都不合格：没有具名作者或专家、没有日期、没有研究，还为一个靠学生讨厌作业而获利的应用做广告。",
          ),
        },
        {
          prompt: t("What did the university's summary find?", "大学的研究综述发现了什么？"),
          right: t(
            "Homework helped older students when short and tied to lessons, but did little for young children",
            "作业简短且与课堂紧密相关时对高年级学生有帮助，但对年幼的孩子作用不大",
          ),
          wrong: [
            t("Homework is useless for every student", "作业对所有学生都没用"),
            t("Homework should be as long as possible", "作业应该越长越好"),
            t("Young children benefit most from homework", "年幼的孩子从作业中获益最多"),
          ],
          solution: t(
            "The summary gives a careful, mixed answer: help for older students under some conditions, little for young children. That is \"a more careful answer than either 'homework is good' or 'homework is bad.'\"",
            "这份综述给出了谨慎、分情况的答案：在某些条件下对高年级学生有帮助，对年幼孩子帮助不大。这是 \"a more careful answer than either 'homework is good' or 'homework is bad'\"。",
          ),
        },
        {
          prompt: t("What did the student realize when she read more closely?", "学生仔细阅读后意识到了什么？"),
          right: t("The two sources were not equally credible", "两个来源的可信度并不相同"),
          wrong: [
            t("Both sources said exactly the same thing", "两个来源说的完全一样"),
            t("She should use both sources equally", "她应该同等地使用两个来源"),
            t("Neither source discussed homework", "两个来源都没有讨论家庭作业"),
          ],
          solution: t(
            'She first saw two opposite sides, then saw "that they were not equals": one had no evidence and something to sell, the other drew on many studies.',
            '她起初以为是对立的两方，后来发现 "that they were not equals"：一个没有证据还在推销，另一个依据了许多研究。',
          ),
        },
      ],
    },
    {
      id: "the-last-stand-of-the-old-theater",
      title: t("The Last Stand of the Old Theater", "老剧院的最后坚守"),
      body: `My opponents in this debate say that if we do not tear down the old theater, our town must give up on growth forever. Either we build the new office tower, they say, or we stay poor.

That is not the choice in front of us. There are empty lots on Fourth Street, and a closed factory by the station, where an office tower could rise without destroying anything. We can have the tower and the theater.

They also say that I care more about old buildings than about jobs. I have never said that, and I do not believe it. I want jobs. I want them in a town that still has something worth living in.

The old theater is not just bricks. It is where this town has watched its children perform their first plays, where it gathered to hear the news on the night the war ended, where couples have danced at their weddings for ninety years. You cannot build that again, no matter how much money you spend.

So let us reject the false choice. Build the tower on Fourth Street. Keep the theater on Main. Let our town grow without forgetting what made it worth growing.`,
      topics: [fallacies, appealsSome],
      glossed: ["debate", "opponents", "perform", "couples", "weddings"],
      xp: 5,
      questions: [
        {
          prompt: t(
            "Which fallacy does the speaker say the opponents commit in the first paragraph?",
            "演讲者说对手在第一段犯了哪种谬误？",
          ),
          right: t("False dilemma", "非此即彼"),
          wrong: [t("Slippery slope", "滑坡"), t("Bandwagon", "从众"), t("Hasty generalization", "以偏概全")],
          solution: t(
            '"Either we build the new office tower ... or we stay poor" offers only two choices. The speaker shows a third: build the tower somewhere else.',
            '"Either we build the new office tower ... or we stay poor" 只给出两个选择。演讲者指出了第三种：把大楼建在别处。',
          ),
        },
        {
          prompt: t("In the third paragraph, the speaker answers which fallacy?", "在第三段，演讲者回应了哪种谬误？"),
          right: t("Straw man", "稻草人"),
          wrong: [t("Ad hominem", "人身攻击"), t("Bandwagon", "从众"), t("False dilemma", "非此即彼")],
          solution: t(
            'The opponents twisted the speaker\'s position into caring "more about old buildings than about jobs." The speaker replies, "I have never said that," showing the view was misstated.',
            '对手把演讲者的立场歪曲成 "more about old buildings than about jobs"。演讲者回应 "I have never said that"，指出观点被曲解了。',
          ),
        },
        {
          prompt: t("How does the fourth paragraph mainly persuade?", "第四段主要用什么方式说服人？"),
          right: t(
            "Through pathos: it recalls moments that give the theater meaning to the town",
            "情感诉求：它回顾了让剧院对小镇具有意义的时刻",
          ),
          wrong: [
            t("Through logos: it gives the cost of a new theater", "理性诉求：它给出新剧院的造价"),
            t("Through ethos: it lists the speaker's qualifications", "人格诉求：它列出演讲者的资历"),
            t("Through a fallacy: it attacks the opponents", "谬误：它攻击对手"),
          ],
          solution: t(
            "Children's first plays, the night the war ended and ninety years of weddings call up shared memories and feelings. That is an appeal to emotion.",
            "孩子们的第一场演出、战争结束的那个夜晚、九十年来的婚礼，唤起了共同的回忆和情感。这是在诉诸情感。",
          ),
        },
      ],
    },
  ],
};
