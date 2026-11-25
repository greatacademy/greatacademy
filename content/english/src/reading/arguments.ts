import type { ReadingUnitDef } from "@ga/content";
import { t } from "@ga/content";

const claims = { topic: "claims", weight: 0.3 } as const;
const claimsSome = { topic: "claims", weight: 0.2 } as const;
const support = { topic: "evidence", weight: 0.3 } as const;
const supportSome = { topic: "evidence", weight: 0.2 } as const;
const reasoning = { topic: "reasoning", weight: 0.3 } as const;
const reasoningSome = { topic: "reasoning", weight: 0.2 } as const;
const rebuttals = { topic: "counterclaims-and-rebuttals", weight: 0.3 } as const;

/** makingTheCase is a reading unit of grades 6 to 8 of short original arguments, whose questions practice finding claims, judging support and following reasoning. */
export const makingTheCase: ReadingUnitDef = {
  id: "making-the-case",
  title: t("Making the Case", "摆事实，讲道理"),
  passages: [
    {
      id: "start-school-later",
      title: t("Start School Later", "推迟上学时间"),
      body: `Every weekday morning, thousands of students in our town drag themselves out of bed before the sun is up. They sit in first period with heavy eyes, trying to pay attention to lessons they will not remember. Our middle school should start at nine o'clock instead of a quarter to eight.

Teenagers are not lazy. Doctors who study sleep have found that around the age of twelve, the body's clock shifts. Young teens naturally fall asleep later at night and wake later in the morning. Asking them to be sharp at a quarter to eight is like asking an adult to do math at five in the morning.

Tired students do worse in school. They forget more, get sick more often and have a harder time controlling their tempers. Schools in other cities that moved their start times later have reported better attendance and fewer students falling asleep in class.

A later start would mean changing bus routes and practice times, and that will take work. But the goal of a school is to help students learn, and students learn best when they are awake. It is time for our school board to change the bell.`,
      topics: [claims],
      glossed: ["tempers", "attendance"],
      xp: 5,
      questions: [
        {
          prompt: t("What is the writer's claim?", "作者的论点是什么？"),
          right: t("The middle school should start at nine o'clock", "这所初中应该九点开始上课"),
          wrong: [
            t("Teenagers are lazy in the morning", "青少年早上很懒"),
            t("Bus routes are hard to change", "公交路线很难改"),
            t("Adults cannot do math early in the morning", "成年人早上没法做数学"),
          ],
          solution: t(
            "The claim is the position the whole passage argues for. It is stated at the end of the first paragraph and again in the last sentence: the school should start later.",
            "论点是整篇文章所支持的立场。它出现在第一段末尾，又在最后一句重申：学校应该推迟上课。",
          ),
          why: [
            t("The writer says teenagers are not lazy.", "作者说青少年并不懒。"),
            t("Bus routes are a cost the writer admits, not the claim.", "校车路线是作者承认的代价，不是观点。"),
            t("Adults doing math is a comparison, not the claim.", "大人做数学题是比喻，不是观点。"),
          ],
        },
        {
          prompt: t("Which sentence states the claim again at the end?", "哪句话在结尾重申了论点？"),
          right: t("It is time for our school board to change the bell.", "是时候让学校董事会改一改铃声了。"),
          wrong: [
            t("Tired students do worse in school.", "疲倦的学生在学校表现更差。"),
            t("Teenagers are not lazy.", "青少年并不懒。"),
            t("That will take work.", "那需要花些工夫。"),
          ],
          solution: t(
            "Changing the bell means changing the start time, which is the claim. The other sentences are reasons or a point the writer admits.",
            "改铃声就是改上课时间，也就是论点本身。其他句子是理由，或是作者承认的一点。",
          ),
          why: [
            t("Tired students doing worse is a reason in the middle.", "学生疲倦成绩差是中间的一条理由。"),
            t("Teenagers not being lazy is a reason near the start.", "青少年不懒是开头附近的理由。"),
            t("The work of changing routes is a cost the writer admits.", "改路线费功夫是作者承认的代价。"),
          ],
        },
        {
          prompt: t("Which is a reason the writer gives for the claim?", "作者为论点给出的理由是哪一个？"),
          right: t("The body's clock shifts around the age of twelve", "大约十二岁时人体的生物钟会推后"),
          wrong: [
            t("Students like to sleep in on weekends", "学生喜欢周末睡懒觉"),
            t("Buses are cheaper later in the day", "晚些时候公交更便宜"),
            t("Teachers want shorter days", "老师们想要更短的上课日"),
          ],
          solution: t(
            "The second paragraph says doctors who study sleep found that the body's clock shifts around twelve, so young teens wake later.",
            "第二段说研究睡眠的医生发现，人体生物钟在十二岁左右会推后，所以青少年醒得更晚。",
          ),
          why: [
            t("Weekends are never mentioned.", "文中从没提周末。"),
            t("Bus prices are never mentioned.", "文中从没提校车价格。"),
            t("Teachers' wishes are never mentioned.", "文中从没提老师的意愿。"),
          ],
        },
      ],
    },
    {
      id: "keep-the-library-open",
      title: t("Keep the Library Open on Sundays", "让图书馆周日开放"),
      body: `To the members of the town council:

Last week you voted to close the public library on Sundays to save money. I am writing to ask you to change your mind. The library should stay open on Sundays.

For many families in our town, Sunday is the only day of the week when parents are not working. It is the one day they can bring their children to choose books, use the computers or sit together in the reading room. Closing on Sunday does not close the library a little. For these families, it closes it completely.

The library is also one of the few places in town where anyone can go without paying. Students without internet at home finish their homework there. Older people come to read the newspaper and talk with neighbors. On a cold Sunday afternoon, the reading room is full.

I understand that the town must save money. But there are other ways to do it, such as closing on a quieter weekday morning, when the building is nearly empty.

Please keep the doors open on Sundays. A library is only useful if people can get inside.

Sincerely,
Nadia Haddad`,
      topics: [claims],
      names: ["Nadia", "Haddad"],
      glossed: ["council", "sincerely"],
      xp: 5,
      questions: [
        {
          prompt: t("What does Nadia want the town council to do?", "纳迪娅想让镇议会做什么？"),
          right: t("Keep the library open on Sundays", "让图书馆周日继续开放"),
          wrong: [
            t("Build a new reading room", "建一个新的阅览室"),
            t("Buy more computers", "买更多电脑"),
            t("Close the library on weekdays", "工作日关闭图书馆"),
          ],
          solution: t(
            "Her claim is stated at the end of the first paragraph: the library should stay open on Sundays. Closing on a weekday morning is only offered as another way to save money.",
            "她的论点在第一段末尾：图书馆应该在周日继续开放。工作日上午关门只是她提出的另一种省钱办法。",
          ),
          why: [
            t("The reading room already exists.", "阅览室本来就有。"),
            t("She asks for no new computers.", "她没要求买新电脑。"),
            t("She suggests a quiet weekday morning only, not all weekdays.", "她只建议关一个冷清的工作日上午，不是所有工作日。"),
          ],
        },
        {
          prompt: t("Which reason does she give?", "她给出了哪条理由？"),
          right: t("Sunday is the only day many working parents can visit", "周日是许多上班的父母唯一能来的日子"),
          wrong: [
            t("The library has too many books", "图书馆的书太多了"),
            t("The town has plenty of money", "镇上有很多钱"),
            t("Children do not like weekday visits", "孩子们不喜欢工作日去"),
          ],
          solution: t(
            "The second paragraph says Sunday is the only day of the week when many parents are not working.",
            "第二段说周日是一周中许多父母唯一不上班的日子。",
          ),
          why: [
            t("Too many books is never a concern.", "书太多从来不是问题。"),
            t("She admits the town must save money.", "她承认镇上需要省钱。"),
            t("Children's feelings about weekdays are not mentioned.", "文中没提孩子对工作日的感受。"),
          ],
        },
        {
          prompt: t("Why does Nadia mention closing on a weekday morning?", "纳迪娅为什么提到工作日上午关门？"),
          right: t("To show the town can save money without closing on Sundays", "说明镇上不用周日关门也能省钱"),
          wrong: [
            t("To ask for the library to close more often", "要求图书馆更常关门"),
            t("To show that weekday mornings are busy", "说明工作日上午很忙"),
            t("To agree with the council's vote", "赞同议会的投票"),
          ],
          solution: t(
            "She admits the town must save money, then names a quieter time to close, when the building is nearly empty, so the Sunday closing is not needed.",
            "她承认镇上必须省钱，然后提出在更清静、楼里几乎没人的时候关门，这样周日就不必关门了。",
          ),
          why: [
            t("She wants it open more, not less.", "她希望开放得更多，不是更少。"),
            t("The building is nearly empty then.", "那时图书馆几乎没人。"),
            t("She is asking the council to change its vote.", "她是请议会改变决定。"),
          ],
        },
      ],
    },
    {
      id: "arguing-about-lunch",
      title: t("Arguing About Lunch", "关于午餐的争论"),
      body: `Ms. Okafor's class was arguing about the school lunch menu. She wrote three sentences on the board.

"Pizza is served on Fridays." "Pizza is delicious." "The school should serve pizza every day."

"Only one of these is a claim you could build an argument on," she said. "Which one?"

Leo raised his hand. "The first one is just a fact. You can check the menu. Nobody argues about it."

"Good. And the second?"

"That's an opinion," said Priya. "But it's only about taste. If I hate pizza, you can't prove me wrong."

"Right," said Ms. Okafor. "A claim worth arguing is a position that reasonable people could disagree about, and that you can support with reasons. So it's the third sentence. Someone could argue that pizza every day is cheap and popular. Someone else could argue that it is not healthy, or that students would grow bored of it."

She erased the board. "Now each of you write one claim about our school. It must be something people could disagree about, and something you could defend with reasons, not just your taste."

Leo frowned at his paper. It was harder than it looked.`,
      topics: [claims],
      names: ["Okafor", "Okafor's", "Leo", "Priya"],
      xp: 5,
      questions: [
        {
          prompt: t('Why is "Pizza is served on Fridays" not a claim worth arguing?', "为什么“周五供应比萨”不是值得争论的论点？"),
          right: t("It is a fact that anyone can check on the menu", "它是任何人都能在菜单上核实的事实"),
          wrong: [t("It is only about taste", "它只关乎口味"), t("It is too long", "它太长了"), t("Nobody likes pizza", "没有人喜欢比萨")],
          solution: t(
            "Leo says the first sentence is a fact: you can check the menu, and nobody argues about it. A claim must be something people could disagree about.",
            "利奥说第一句是事实：可以查菜单，没人会争论它。论点必须是人们可能有分歧的东西。",
          ),
          why: [
            t("Taste is the second sentence, about delicious.", "口味是第二句，说的是好吃。"),
            t("Length has nothing to do with it.", "这与句子长短无关。"),
            t("Whether people like pizza is not the point.", "大家喜不喜欢比萨不是重点。"),
          ],
        },
        {
          prompt: t("According to Ms. Okafor, what makes a claim worth arguing?", "按照奥卡福老师的说法，什么样的论点值得争论？"),
          right: t("People could disagree about it, and it can be supported with reasons", "人们可能对它有分歧，并且能用理由来支持"),
          wrong: [
            t("It is about food", "它是关于食物的"),
            t("Everyone already agrees with it", "每个人都已经同意它"),
            t("It describes a personal taste", "它描述个人口味"),
          ],
          solution: t(
            "She says a claim worth arguing is a position that reasonable people could disagree about, and that you can support with reasons.",
            "她说值得争论的论点是理性的人可能有分歧、并且能用理由支持的立场。",
          ),
          why: [
            t("Food was only the class example.", "食物只是课堂上的例子。"),
            t("A claim worth arguing is one people could disagree about.", "值得论证的观点是人们会有分歧的。"),
            t("Personal taste cannot be proved wrong.", "个人口味无法被证明是错的。"),
          ],
        },
        {
          prompt: t("Which of these would Ms. Okafor accept as a claim?", "下面哪一个奥卡福老师会接受为论点？"),
          right: t("Our school should have a longer lunch break.", "我们学校应该延长午休时间。"),
          wrong: [
            t("Lunch starts at noon.", "午饭十二点开始。"),
            t("I love chocolate milk.", "我爱喝巧克力牛奶。"),
            t("Our school has three hundred students.", "我们学校有三百名学生。"),
          ],
          solution: t(
            "A longer lunch break is a position people could disagree about and defend with reasons. The others are facts that can be checked or a personal taste.",
            "延长午休是人们可能有分歧、也能用理由辩护的立场。其他几项要么是可以核实的事实，要么是个人口味。",
          ),
          why: [
            t("Lunch starting at noon is a fact you can check.", "午饭十二点开始是可以查证的事实。"),
            t("Loving chocolate milk is only taste.", "喜欢巧克力牛奶只是口味。"),
            t("The number of students is a fact you can count.", "学生人数是可以数的事实。"),
          ],
        },
      ],
    },
    {
      id: "trees-on-every-street",
      title: t("Trees on Every Street", "每条街都种树"),
      body: `Our city should plant a tree in front of every home that does not already have one.

The strongest reason is heat. On a summer afternoon, the air above a bare parking lot can be ten degrees hotter than the air in a shady park nearby. City workers measured the temperature on two streets in our own neighborhood last July. Under the old oaks on Elm Street, it was eighty-four degrees. Two blocks away, on bare Market Street, it was ninety-three. A street with trees is a cooler street, and on the hottest days, a cooler street can keep older people and babies out of the hospital.

Trees also save families money. A tree that shades a house in summer means the air conditioner does not have to run as long.

Some people say that trees are messy, and that their roots crack sidewalks. My neighbor told me she once tripped over a root. But one fall does not prove that trees are dangerous, and sidewalks can be fixed. Planting the right kind of tree, with room for its roots, solves most of the problem.

Trees cost little, grow for a hundred years and make every street better. Let's plant them.`,
      topics: [support, claimsSome],
      names: ["Elm", "Market"],
      glossed: ["oaks", "degrees", "temperature", "measured", "shady"],
      xp: 5,
      questions: [
        {
          prompt: t("Which is the strongest evidence for the claim that trees cool streets?", "哪一条是证明树能让街道降温的最有力证据？"),
          right: t(
            "Workers measured eighty-four degrees on Elm Street and ninety-three on Market Street",
            "工人们在榆树街测得八十四度，在市场街测得九十三度",
          ),
          wrong: [
            t("A neighbor tripped over a root", "一位邻居被树根绊倒"),
            t("Trees grow for a hundred years", "树能长一百年"),
            t("Trees make every street better", "树让每条街都更好"),
          ],
          solution: t(
            "Measured temperatures on two real streets are specific and can be checked. The other choices are a single story, a fact that does not show cooling, and the writer's opinion.",
            "在两条真实街道上测得的温度是具体的、可以核实的。其他选项要么是一个人的经历，要么是不能说明降温的事实，要么是作者的看法。",
          ),
          why: [
            t("The fall is about danger, not heat.", "摔倒讲的是危险，不是温度。"),
            t("A tree's life span is not about heat.", "树的寿命与温度无关。"),
            t("Making streets better is an opinion, not a measurement.", "让街道更好是看法，不是测量。"),
          ],
        },
        {
          prompt: t("Why does the writer say one fall does not prove that trees are dangerous?", "作者为什么说一次摔倒不能证明树很危险？"),
          right: t("A single story is weak support for a general claim", "单个经历不足以支持一个普遍的说法"),
          wrong: [
            t("The neighbor was not telling the truth", "邻居没有说实话"),
            t("Roots never crack sidewalks", "树根从不会让人行道开裂"),
            t("The writer has never seen a root", "作者从没见过树根"),
          ],
          solution: t(
            "The writer does not deny the fall happened. The point is that one person's fall is not enough to show that trees in general are dangerous.",
            "作者并没有否认摔倒的事。重点是一个人摔倒不足以说明树普遍都很危险。",
          ),
          why: [
            t("The writer does not doubt her honesty.", "作者没有怀疑她说谎。"),
            t("The writer admits roots can crack sidewalks.", "作者承认树根会弄裂人行道。"),
            t("The writer's own experience is not discussed.", "文中没讨论作者自己的经历。"),
          ],
        },
        {
          prompt: t("What is the writer's claim?", "作者的论点是什么？"),
          right: t("The city should plant a tree in front of every home without one", "城市应该在每户没有树的人家门前种一棵树"),
          wrong: [
            t("Parking lots are hot", "停车场很热"),
            t("Sidewalks should be fixed", "人行道应该修补"),
            t("Air conditioners cost too much", "空调太贵了"),
          ],
          solution: t(
            "The first sentence states the claim, and the last paragraph repeats it: let's plant them.",
            "第一句提出了论点，最后一段又重申：让我们种树吧。",
          ),
          why: [
            t("Hot parking lots are evidence, not the claim.", "停车场很热是证据，不是观点。"),
            t("Fixing sidewalks answers an objection.", "修人行道是回应反对意见。"),
            t("Air conditioning is a reason, not the claim.", "空调是理由，不是观点。"),
          ],
        },
      ],
    },
    {
      id: "phones-in-class",
      title: t("Should Phones Stay in Lockers?", "手机该锁在柜子里吗？"),
      body: `Next year, our school plans to make every student lock away their phone from the first bell to the last. I believe this is the right decision.

My cousin's school tried the same rule last year. Before the rule, teachers there counted how many times a phone interrupted a lesson during one week: one hundred and twelve times across the school. After the rule, the count dropped to nine. Teachers said that students talked to each other more at lunch, too.

Some students worry that they will not be able to reach their parents in an emergency. That is a fair worry. But the office has a phone, and every teacher has one too. A parent who needs a child can call the school, just as parents did for a hundred years before cell phones.

Others say that phones are useful for schoolwork, for looking things up or using a calculator. But the school already gives every student a laptop for that, and the laptops do not buzz with messages from friends.

Lessons are short, and every interruption costs a little of them. Locking phones away for the day is a small price for a classroom where everyone can pay attention.`,
      topics: [support, claimsSome],
      glossed: ["lockers", "interruption", "interrupted", "emergency", "laptop", "laptops", "calculator"],
      xp: 5,
      questions: [
        {
          prompt: t("Which evidence does the writer use to support the claim?", "作者用什么证据来支持论点？"),
          right: t(
            "A count of phone interruptions before and after a rule at another school",
            "另一所学校实行规定前后手机打断课堂的次数统计",
          ),
          wrong: [
            t("A survey of parents in the writer's town", "对作者镇上家长的调查"),
            t("The writer's feeling that phones are annoying", "作者觉得手机很烦"),
            t("A report from a phone company", "一家手机公司的报告"),
          ],
          solution: t(
            "The second paragraph gives the counts at the cousin's school: one hundred and twelve interruptions before the rule and nine after.",
            "第二段给出了表亲学校的统计数字：规定实行前打断了一百一十二次，实行后只有九次。",
          ),
          why: [
            t("No survey of parents is given.", "文中没有家长调查。"),
            t("The writer uses counts, not just feelings.", "作者用的是统计数字，不只是感受。"),
            t("No phone company is mentioned.", "文中没提手机公司。"),
          ],
        },
        {
          prompt: t("How strong is that evidence?", "这条证据有多有力？"),
          right: t(
            "Fairly strong, since it counts what happened, though it comes from only one school",
            "比较有力，因为它统计了实际发生的情况，但只来自一所学校",
          ),
          wrong: [
            t("Very weak, since numbers can never support a claim", "非常弱，因为数字永远不能支持论点"),
            t("Perfect, since it proves the rule works everywhere", "完美，因为它证明了规定在任何地方都有效"),
            t("Useless, since the cousin is a student", "毫无用处，因为表亲是学生"),
          ],
          solution: t(
            "Counts taken by teachers are specific and relevant, which makes the evidence fairly strong. But one school may not be like every school, so it does not prove the rule works everywhere.",
            "老师们做的统计具体且相关，因此证据比较有力。但一所学校不一定和所有学校一样，所以它不能证明规定在任何地方都有效。",
          ),
          why: [
            t("Numbers can support a claim.", "数字可以支持观点。"),
            t("One school cannot prove it works everywhere.", "一所学校不能证明它处处有效。"),
            t("The teachers did the counting, not the cousin.", "统计是老师做的，不是表亲。"),
          ],
        },
        {
          prompt: t("How does the writer answer the worry about laptops and schoolwork?", "作者怎样回应关于用手机做功课的担忧？"),
          right: t("The school already gives every student a laptop", "学校已经给每个学生发了笔记本电脑"),
          wrong: [
            t("Schoolwork does not need any tools", "做功课不需要任何工具"),
            t("Phones are better than laptops", "手机比笔记本电脑更好"),
            t("Students should buy calculators", "学生应该买计算器"),
          ],
          solution: t(
            "The fourth paragraph says the school already gives every student a laptop for looking things up, and the laptops do not buzz with messages.",
            "第四段说学校已经给每个学生发了笔记本电脑用来查资料，而且电脑不会有消息嗡嗡响。",
          ),
          why: [
            t("The worry is about tools, and the writer offers laptops.", "担心的是工具，作者给出了笔记本电脑。"),
            t("The writer never compares phones as better.", "作者从没说手机更好。"),
            t("Buying calculators is not suggested.", "作者没建议买计算器。"),
          ],
        },
      ],
    },
    {
      id: "the-four-day-week",
      title: t("A Four-Day School Week?", "每周上四天学？"),
      body: `Some towns have switched to a school week of four longer days. A few people in our town want to do the same. Here is why I think it would be a mistake.

A four-day week saves money only on the fifth day: on buses, heating and lunches. But the savings are small, because teachers still need to be paid and the school still needs to be heated over the long weekend.

Meanwhile, the costs fall on families. If school is closed on Friday, parents who work must find someone to watch their children. Families who cannot pay for help may have to leave younger children home alone, or with an older brother or sister who misses a day of learning to babysit.

There is also the problem of tired students. Adding an hour to each school day means that a nine-year-old sits in class until almost five. By the last hour, few young children can learn much.

So the reasoning goes like this. The goal of a school week is learning. A four-day week saves little money, puts a heavy load on families and makes the school day too long for young learners. A plan that hurts learning to save a little money is not a good plan.`,
      topics: [reasoning, supportSome],
      glossed: ["babysit", "heating", "heated"],
      xp: 5,
      questions: [
        {
          prompt: t("Which statement links the writer's reasons to the claim?", "哪句话把作者的理由和论点联系起来？"),
          right: t("A plan that hurts learning to save a little money is not a good plan.", "为省一点钱而损害学习的计划不是好计划。"),
          wrong: [
            t("Some towns have switched to a school week of four longer days.", "有些镇已经改为每周四天、每天更长的上学安排。"),
            t("Teachers still need to be paid.", "老师们仍然要领工资。"),
            t("Parents who work must find someone to watch their children.", "上班的父母必须找人看孩子。"),
          ],
          solution: t(
            "The last paragraph spells out the reasoning: the goal is learning, the plan hurts learning and saves little, so it is not a good plan. That general rule is what connects the reasons to the claim.",
            "最后一段讲明了推理：目标是学习，这个计划损害学习、省钱又少，所以不是好计划。正是这条普遍原则把理由和论点连在一起。",
          ),
          why: [
            t("That opening sentence states what some towns did.", "开头那句只是说有些城镇的做法。"),
            t("Paying teachers explains small savings.", "给老师发工资解释了为什么省得少。"),
            t("Parents finding care is one reason, not the link.", "家长找人看孩子是一条理由，不是连接。"),
          ],
        },
        {
          prompt: t("Why does the writer say the savings are small?", "作者为什么说省下的钱很少？"),
          right: t("Teachers still need to be paid and the building still needs heat", "老师仍要领工资，楼里仍要供暖"),
          wrong: [
            t("Buses cost nothing to run", "公交车运行不花钱"),
            t("Families pay for school lunches", "家庭自己付午饭钱"),
            t("The town already has plenty of money", "镇上已经很有钱"),
          ],
          solution: t(
            "The second paragraph says the savings are small because teachers still need to be paid and the school still needs to be heated.",
            "第二段说省钱很少，因为老师仍要领工资，学校仍要供暖。",
          ),
          why: [
            t("Buses do cost money on the fifth day.", "第五天的校车确实要花钱。"),
            t("Lunches are part of the small savings.", "午餐是那点节省的一部分。"),
            t("The town's money is never discussed.", "文中从没讨论镇上的钱。"),
          ],
        },
        {
          prompt: t(
            "What does the writer assume that the reader must accept for the argument to work?",
            "要让这个论证成立，读者必须接受作者的什么前提？",
          ),
          right: t("The main goal of a school week is learning", "上学周的主要目标是学习"),
          wrong: [
            t("The main goal of a school week is saving money", "上学周的主要目标是省钱"),
            t("Every family has a babysitter", "每个家庭都有保姆"),
            t("Young children learn best late in the day", "年幼的孩子在傍晚学得最好"),
          ],
          solution: t(
            "The reasoning starts from the idea that the goal of a school week is learning. Someone who believed saving money mattered most would not be convinced.",
            "这段推理的出发点是：上学周的目标是学习。如果有人认为省钱最重要，就不会被说服。",
          ),
          why: [
            t("Saving money is what the writer weighs against learning.", "省钱正是作者拿来与学习对比的东西。"),
            t("The writer says many families cannot pay for help.", "作者说许多家庭请不起人帮忙。"),
            t("The writer says young children learn little late in the day.", "作者说小孩子在一天的最后学不进什么。"),
          ],
        },
      ],
    },
    {
      id: "everyone-has-a-dog",
      title: t("Everyone Else Has a Dog", "别人家都有狗"),
      body: `Marcus had been planning his argument for a week. At dinner on Sunday, he finally began.

"We should get a dog," he said. "Everyone in my class has one."

His mother put down her fork. "Everyone?"

"Well, a lot of people. And if we don't get one, I'll be the only kid without a dog, and nobody will want to come over, and I'll have no friends."

His older sister laughed. "That is a terrible argument."

Marcus felt his face grow hot. "Why?"

"Because it's not true that everyone has a dog," she said. "And even if they did, that's not a reason we should. Also, people don't stop being your friend because you don't have a pet. You jumped from one thing to a much bigger thing."

Marcus thought about it. Then he tried again.

"Okay. I've walked the Garcias' dog every day for a month, and I never missed once. That shows I can take care of one. I'll use my own money for food. And Dr. Lin said that kids who walk dogs get more exercise, which you're always telling me I need."

His mother smiled. "Now," she said, "that is an argument. Let's talk about it."`,
      topics: [reasoning, claimsSome],
      names: ["Marcus", "Garcias", "Lin"],
      xp: 5,
      questions: [
        {
          prompt: t('What is wrong with "Everyone in my class has one" as a reason?', "“我们班每个人都有狗”作为理由有什么问题？"),
          right: t(
            "It is not true, and others having a dog is not a reason his family should",
            "这不是真的，而且别人有狗并不是他家也该养的理由",
          ),
          wrong: [
            t("It is too short", "它太短了"),
            t("It is about his class instead of his school", "它说的是班级而不是学校"),
            t("It is a fact that can be checked", "它是可以核实的事实"),
          ],
          solution: t(
            "His sister points out both problems: not everyone has a dog, and even if they did, that is not a reason his family should get one.",
            "姐姐指出了两个问题：并非人人有狗；即使人人都有，也不是他家该养狗的理由。",
          ),
          why: [
            t("Length is not the problem.", "长短不是问题。"),
            t("Class or school does not matter.", "班级还是学校都无关紧要。"),
            t("It is not true, so it is not a checked fact.", "这不是真的，所以不是查证过的事实。"),
          ],
        },
        {
          prompt: t(
            'What mistake does his sister mean by "You jumped from one thing to a much bigger thing"?',
            "姐姐说“你从一件事跳到了一件大得多的事”，指的是什么错误？",
          ),
          right: t("Claiming that not having a dog will lead to having no friends", "声称没有狗就会没有朋友"),
          wrong: [
            t("Asking for a dog at dinner", "在吃饭时要狗"),
            t("Walking a neighbor's dog", "帮邻居遛狗"),
            t("Offering to pay for dog food", "提出自己付狗粮钱"),
          ],
          solution: t(
            "Marcus said that without a dog nobody would come over and he would have no friends. Each step is bigger than the last, and none is supported.",
            "马库斯说没有狗就没人来玩，他就会没有朋友。每一步都比上一步夸大，而且都没有依据。",
          ),
          why: [
            t("Asking at dinner is not a jump in logic.", "在晚饭时提出请求不是逻辑跳跃。"),
            t("Walking a dog is good evidence, from his second try.", "遛狗是第二次论证里的好证据。"),
            t("Paying for food is part of his better argument.", "自己付狗粮钱是更好论证的一部分。"),
          ],
        },
        {
          prompt: t("Why is his second argument stronger?", "他的第二个论证为什么更有力？"),
          right: t(
            "He gives reasons based on what he has actually done and what a doctor said",
            "他给出的理由基于他实际做过的事和医生说的话",
          ),
          wrong: [
            t("He speaks more loudly", "他说话声音更大"),
            t("He mentions more friends", "他提到了更多朋友"),
            t("He promises never to ask again", "他保证再也不提了"),
          ],
          solution: t(
            "Walking the Garcias' dog every day for a month shows he can care for one, he offers to pay for food, and he cites Dr. Lin on exercise. Each reason connects to the claim.",
            "一个月每天遛加西亚家的狗说明他能照顾狗，他提出自己付狗粮钱，还引用了林医生关于运动的话。每条理由都与论点相关。",
          ),
          why: [
            t("He does not get louder.", "他并没有提高声音。"),
            t("He mentions no friends the second time.", "第二次他没提朋友。"),
            t("He makes no such promise.", "他没作这样的承诺。"),
          ],
        },
      ],
    },
    {
      id: "homework-on-weekends",
      title: t("No Homework on Weekends", "周末不留作业"),
      body: `Students in our school should get no homework on weekends.

Some teachers argue that weekend homework is needed to finish the lessons on time. They point out that there are only so many days in the school year, and that a little practice over the weekend keeps skills fresh. This is a reasonable concern, and it deserves an answer.

But the answer is not more work on Saturday. Teachers could give a little more practice during the week, when students are already in the habit of working. Most homework could be finished in class if the last ten minutes of each lesson were set aside for it.

Weekends are when students rest, play sports, visit family and simply think. Those things matter too. A tired, unhappy student does not learn faster on Monday. In fact, students who come back rested often remember more, not less.

There is also the question of fairness. Some students have quiet homes and parents who can help on weekends. Others work, babysit younger brothers and sisters or travel between two homes. Weekend homework makes those differences larger.

Keeping skills fresh is important. So is giving students time to be young. We can do both, by keeping homework to the school week.`,
      topics: [rebuttals, reasoningSome],
      glossed: ["fairness", "concern"],
      xp: 5,
      questions: [
        {
          prompt: t("What counterclaim does the writer answer?", "作者回应了哪个反方观点？"),
          right: t("Weekend homework is needed to finish the lessons on time", "要按时完成课程，周末作业是必要的"),
          wrong: [
            t("Students should play more sports", "学生应该多做运动"),
            t("Teachers should give no homework at all", "老师应该完全不留作业"),
            t("Weekends are for visiting family", "周末是用来看望家人的"),
          ],
          solution: t(
            "The second paragraph gives the teachers' side: weekend homework is needed to finish the lessons on time and keep skills fresh.",
            "第二段给出了老师们的观点：要按时完成课程、保持技能熟练，就需要周末作业。",
          ),
          why: [
            t("Sports are something students do on weekends.", "运动是学生周末做的事。"),
            t("The writer still supports homework in the week.", "作者仍然支持平时布置作业。"),
            t("Visiting family is the writer's own point.", "探望家人是作者自己的观点。"),
          ],
        },
        {
          prompt: t("How does the writer rebut it?", "作者怎样反驳它？"),
          right: t("By showing the practice could be done during the week instead", "说明这些练习可以改在工作日完成"),
          wrong: [
            t("By saying teachers are wrong about everything", "说老师们什么都错"),
            t("By ignoring it", "置之不理"),
            t("By agreeing that weekend homework is needed", "同意周末作业是必要的"),
          ],
          solution: t(
            "The third paragraph answers the concern directly: give a little more practice during the week, or finish homework in the last ten minutes of each lesson.",
            "第三段直接回应了这个顾虑：在工作日多做一点练习，或在每节课最后十分钟完成作业。",
          ),
          why: [
            t("The writer criticizes no one so broadly.", "作者没有这样全盘否定别人。"),
            t("The writer answers it directly.", "作者直接回应了它。"),
            t("The writer disagrees about weekends.", "作者在周末作业上不同意。"),
          ],
        },
        {
          prompt: t("Why does the writer call the teachers' concern reasonable?", "作者为什么说老师们的顾虑是合理的？"),
          right: t("Treating the other side fairly makes the argument more convincing", "公正对待对方会让论证更有说服力"),
          wrong: [
            t("The writer has changed sides", "作者改变了立场"),
            t("The writer wants more homework", "作者想要更多作业"),
            t("The concern is the writer's own claim", "这个顾虑就是作者自己的论点"),
          ],
          solution: t(
            "A writer who admits what is fair in the other side, then answers it, earns the reader's trust. The claim stays the same: no homework on weekends.",
            "作者承认对方合理的地方再加以回应，就能赢得读者信任。论点没有变：周末不留作业。",
          ),
          why: [
            t("The writer keeps the same side.", "作者立场没变。"),
            t("The writer wants less weekend homework.", "作者希望周末少留作业。"),
            t("The concern belongs to some teachers.", "这个担忧来自一些老师。"),
          ],
        },
      ],
    },
    {
      id: "the-town-pool",
      title: t("Save the Town Pool", "拯救镇上的游泳池"),
      body: `The town wants to fill in the old swimming pool on Hill Road and build a parking lot. The pool should be repaired, not paved over.

Those who favor the parking lot make two points. First, they say the pool loses money every year. Second, they say the shops downtown need more parking.

Both points deserve a careful look. It is true that the pool loses money, about twenty thousand dollars a year. But parks and playgrounds lose money too, and nobody suggests paving them. A town pays for such places because they make life better, not because they earn a profit. The pool is where hundreds of children learn to swim each summer, and learning to swim can save a life.

As for parking, the town's own count found that the lot behind the post office is less than half full on most days, even on Saturdays. The shops do not need a new lot; drivers need to know where the empty one is. A few signs would cost far less than tearing out a pool.

So the case for the parking lot rests on one fact that misses the point and one need that does not exist. Fix the pool, put up some signs, and let the children swim.`,
      topics: [rebuttals, supportSome],
      names: ["Hill"],
      glossed: ["paved", "paving", "profit", "downtown"],
      xp: 5,
      questions: [
        {
          prompt: t("What are the two points made by those who favor the parking lot?", "支持建停车场的人提出了哪两点？"),
          right: t("The pool loses money, and the shops need more parking", "游泳池亏钱，商店需要更多停车位"),
          wrong: [
            t("The pool is too small, and children cannot swim", "游泳池太小，孩子们不会游泳"),
            t("The post office is closing, and parks are full", "邮局要关门，公园都满了"),
            t("Signs are expensive, and drivers are lost", "指示牌很贵，司机会迷路"),
          ],
          solution: t(
            "The second paragraph lists them: first, the pool loses money; second, the shops downtown need more parking.",
            "第二段列出了这两点：第一，游泳池亏钱；第二，市中心的商店需要更多停车位。",
          ),
          why: [
            t("Size is never discussed.", "文中从没讨论泳池大小。"),
            t("The post office is not closing.", "邮局没有关门。"),
            t("Signs are the writer's cheap fix, not their point.", "标识是作者提出的省钱办法，不是对方的观点。"),
          ],
        },
        {
          prompt: t("How does the writer rebut the point about parking?", "作者怎样反驳关于停车位的观点？"),
          right: t(
            "The town's own count shows the lot by the post office is less than half full",
            "镇上自己的统计显示邮局后面的停车场还不到半满",
          ),
          wrong: [
            t("By saying drivers should walk", "说司机应该走路"),
            t("By saying the shops are not important", "说商店不重要"),
            t("By agreeing that a new lot is needed", "同意需要新停车场"),
          ],
          solution: t(
            "The fourth paragraph uses the town's own count to show that an existing lot has plenty of room, so the need does not exist.",
            "第四段用镇上自己的统计说明现有停车场空位很多，所以这个需求并不存在。",
          ),
          why: [
            t("Walking is never suggested.", "文中从没建议步行。"),
            t("The shops matter; they just have parking.", "商店很重要，只是停车位够了。"),
            t("The writer says no new lot is needed.", "作者说不需要新停车场。"),
          ],
        },
        {
          prompt: t("How does the writer handle the fact that the pool loses money?", "作者怎样处理游泳池亏钱这个事实？"),
          right: t("Admits it is true but argues it misses the point", "承认它属实，但认为它没有抓住要点"),
          wrong: [
            t("Says it is false", "说它是假的"),
            t("Ignores it completely", "完全无视它"),
            t("Uses it to support the parking lot", "用它来支持建停车场"),
          ],
          solution: t(
            "The writer says it is true that the pool loses money, then argues that parks lose money too, and a town pays for such places because they make life better.",
            "作者承认游泳池确实亏钱，然后指出公园也亏钱，镇上出钱维持这些地方是因为它们让生活更好。",
          ),
          why: [
            t("The writer admits it is true.", "作者承认这是事实。"),
            t("The writer answers it directly.", "作者直接回应了它。"),
            t("The writer uses it to argue for the pool.", "作者用它来支持保留泳池。"),
          ],
        },
      ],
    },
    {
      id: "two-letters-about-the-field",
      title: t("Two Letters About the Field", "关于操场的两封信"),
      body: `The school board must decide whether to replace the grass field behind the school with artificial turf. Two parents wrote to the local paper.

The first letter: "Artificial turf is the clear choice. A grass field turns to mud after every rain, and games are canceled. Last spring, our team lost eleven practice days to mud. Turf can be played on in any weather. It also needs no water and no mowing, which saves the school money every year."

The second letter: "I understand why turf sounds good after a rainy spring. But turf has costs that its supporters leave out. On a sunny afternoon, its surface can become hot enough to burn bare skin. It must be replaced every ten years or so, at great expense. And when it wears out, it cannot be recycled easily and ends up in the trash. Instead, the board could pay to fix the field's drainage, so that rain soaks away and the grass dries quickly. That would solve the mud problem and keep a living field for our children."

Both writers want a field students can use. They disagree about which choice serves that goal best over many years.`,
      topics: [rebuttals, supportSome, reasoningSome],
      glossed: ["artificial", "turf", "drainage", "mowing", "recycled", "canceled", "expense"],
      xp: 5,
      questions: [
        {
          prompt: t("What does the second writer do before arguing against turf?", "第二位作者在反对人造草坪之前做了什么？"),
          right: t("Admits why turf sounds good after a rainy spring", "承认在多雨的春天之后人造草坪听起来不错"),
          wrong: [
            t("Agrees that turf is the clear choice", "同意人造草坪是显而易见的选择"),
            t("Says the first writer is lying", "说第一位作者在撒谎"),
            t("Lists the practice days lost to mud", "列出因泥泞损失的训练天数"),
          ],
          solution: t(
            'The second letter opens with "I understand why turf sounds good after a rainy spring," which grants the other side\'s point before answering it.',
            "第二封信开头说“我理解在多雨的春天之后人造草坪听起来不错”，先承认对方的观点，再加以回应。",
          ),
          why: [
            t("The second writer argues against turf.", "第二位作者反对人造草坪。"),
            t("No one is called a liar.", "没有人被说成撒谎。"),
            t("Lost practice days come from the first letter.", "训练日损失出自第一封信。"),
          ],
        },
        {
          prompt: t("How does the second writer answer the problem of mud?", "第二位作者怎样回应泥泞的问题？"),
          right: t("By proposing to fix the field's drainage", "提议改善操场的排水"),
          wrong: [
            t("By saying mud is good for children", "说泥巴对孩子有好处"),
            t("By saying games should be canceled more often", "说比赛应该更常取消"),
            t("By saying turf never gets hot", "说人造草坪从不发烫"),
          ],
          solution: t(
            "The second letter suggests paying to fix the drainage so rain soaks away and the grass dries quickly. That solves the first writer's problem without turf.",
            "第二封信建议出钱改善排水，让雨水渗走、草地快干。这样不用人造草坪也能解决第一位作者提出的问题。",
          ),
          why: [
            t("Mud is a problem to solve, not good.", "泥泞是要解决的问题，不是好事。"),
            t("The writer wants fewer cancellations.", "作者希望少取消比赛。"),
            t("The writer says turf can get very hot.", "作者说草坪会很烫。"),
          ],
        },
        {
          prompt: t("Which piece of evidence does the first writer use?", "第一位作者用了哪条证据？"),
          right: t("The team lost eleven practice days to mud last spring", "去年春天球队因泥泞损失了十一天训练"),
          wrong: [
            t("Turf must be replaced every ten years", "人造草坪大约十年就得更换"),
            t("Turf can burn bare skin", "人造草坪会烫伤皮肤"),
            t("Turf ends up in the trash", "人造草坪最后会进垃圾堆"),
          ],
          solution: t(
            "The eleven lost practice days come from the first letter. The other three are costs of turf named in the second letter.",
            "损失十一天训练出自第一封信。其他三项是第二封信中提到的人造草坪的代价。",
          ),
          why: [
            t("Replacement every ten years is in the second letter.", "每十年更换一次出自第二封信。"),
            t("Burning skin is in the second letter.", "烫伤皮肤出自第二封信。"),
            t("Ending up in the trash is in the second letter.", "最后进垃圾堆出自第二封信。"),
          ],
        },
      ],
    },
  ],
};
