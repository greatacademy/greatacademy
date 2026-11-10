// The reading unit of Gaokao English: eight texts of about 250 to 350 words in the words of B1 and below, each with
// four multiple-choice questions like those of the reading comprehension of the paper: a notice, stories, and texts
// on school life, nature and science. Every text is written for this course.

import { type ReadingUnitDef, t } from "@ga/content";
import { readingWords } from "../levels/b1/reading-words.ts";
import { passageMaker } from "../levels/pre-a1/reading-kit.ts";

const passage = passageMaker(readingWords, []);

const facts = ["main-idea", "supporting-details"];
const reasons = ["making-inferences", "authors-purpose"];

/** gaokaoReading is the reading unit of the Gaokao English course. */
export const gaokaoReading: ReadingUnitDef = {
  id: "gaokao-reading",
  title: t("Gaokao Reading", "高考阅读"),
  passages: [
    passage({
      id: "gaokao-reading-summer-courses",
      title: ["Summer Courses at the City Library", "市图书馆暑期课程"],
      body: `This summer, the City Library is offering four free courses for students from twelve to eighteen years old. All courses take place in the study rooms of the library on the second floor. There are only twenty places in each course, so please sign up early.

**Making Computer Games**

Build your first simple computer game, one small part at a time. No experience is needed, but you should be able to type well. Bring your own laptop if you have one; the library has ten computers for students who don't.

Dates: July 8 to July 19, Monday to Friday, 9:00 to 11:00 in the morning

**Writing Short Stories**

Our teacher, a writer of books for young people, will show you how to plan a story, create interesting characters and write a strong ending. At the end of the course, the best stories will be printed in the magazine of the library.

Dates: July 15 to July 26, Tuesdays and Thursdays, 2:00 to 4:00 in the afternoon

**Taking Better Photos**

Learn how to use light, color and space to take photos that tell a story. Most classes take place outside in the park next to the library, so wear good walking shoes. A phone camera is fine.

Dates: July 22 to August 2, Monday, Wednesday and Friday, 3:00 to 5:00 in the afternoon

**Speaking in Public**

Do you feel nervous when you speak in front of the class? In this course, you will practice giving short talks in a friendly group and learn simple ways to stay calm.

Dates: August 5 to August 16, Monday to Friday, 10:00 to 12:00 in the morning

**How to Sign Up**

Visit the front desk with your library card, or complete the form on our website. Students under fourteen need a parent to sign the form. Each student may take no more than two courses. If a course is full, you can ask to be put on a waiting list, and we will call you if a place becomes free.`,
      grammar: facts,
      questions: [
        [
          ["Which course is mainly held outdoors?", "哪门课程主要在室外进行？"],
          ["Taking Better Photos.", "摄影进阶（Taking Better Photos）。"],
          [
            ["Making Computer Games.", "制作电脑游戏（Making Computer Games）。"],
            ["Writing Short Stories.", "短篇小说写作（Writing Short Stories）。"],
            ["Speaking in Public.", "公开演讲（Speaking in Public）。"],
          ],
          [
            'The notice says that most photo classes "take place outside in the park next to the library".',
            "通知中说，摄影课的大多数课“在图书馆旁边的公园里进行”。",
          ],
        ],
        [
          ["What can students of the writing course hope for?", "写作课的学生可能得到什么？"],
          ["Seeing their story in a magazine.", "自己的故事登上杂志。"],
          [
            ["Meeting a famous film maker.", "见到一位著名的电影人。"],
            ["Getting a free laptop.", "得到一台免费的笔记本电脑。"],
            ["Writing a book with their teacher.", "和老师一起写一本书。"],
          ],
          ['"The best stories will be printed in the magazine of the library."', "通知中说：“最好的故事将刊登在图书馆的杂志上。”"],
        ],
        [
          ["A student who is free only in the mornings could take ___.", "只有上午有空的学生可以选___。"],
          ["the games course and the speaking course", "游戏制作课和演讲课"],
          [
            ["the writing course and the photo course", "写作课和摄影课"],
            ["the games course and the photo course", "游戏制作课和摄影课"],
            ["all four courses", "全部四门课"],
          ],
          [
            "Only Making Computer Games (9:00 to 11:00) and Speaking in Public (10:00 to 12:00) are in the morning. A student may also take no more than two courses.",
            "只有游戏制作课（上午 9:00 至 11:00）和演讲课（上午 10:00 至中午 12:00）在上午。而且每名学生最多只能选两门课。",
          ],
        ],
        [
          ["What must a thirteen-year-old do to sign up?", "一个十三岁的学生报名时必须做什么？"],
          ["Get a parent to sign the form.", "请家长在表格上签字。"],
          [
            ["Pay a small fee at the front desk.", "在服务台缴纳少量费用。"],
            ["Bring their own laptop.", "带上自己的笔记本电脑。"],
            ["Wait on a waiting list.", "先登记候补。"],
          ],
          [
            '"Students under fourteen need a parent to sign the form." The courses are free, and a waiting list is only for courses that are full.',
            "通知中说：“十四岁以下的学生需要家长在表格上签字。”课程是免费的，候补名单只用于已满的课程。",
          ],
        ],
      ],
    }),
    passage({
      id: "gaokao-reading-the-robot-club",
      title: ["The Robot Club", "机器人社团"],
      body: `When our school started a robot club three years ago, only six students came to the first meeting. Most of us had never touched a robot before. Our teacher, Mr. Zhou, put a box of parts on the table and said, "I don't know much more than you do. Let's learn together."

For the first few months, nothing we built worked. Our robots fell over, ran into walls or just did nothing at all. Some students lost interest and stopped coming. But the ones who stayed began to enjoy the problems. We learned that every mistake taught us something, and slowly our robots began to move the way we wanted.

In our second year, we decided to take part in a national contest. The task was to build a robot that could pick up small balls and drop them into a box. We worked after school almost every day. Sometimes we argued about the best design, and once we spent a whole weekend fixing a problem that turned out to be one small broken part.

At the contest, our robot dropped the first ball. My heart almost stopped. But then it picked up the next ball, and the next, and finished the task with ten seconds to spare. We didn't win, but we came fifth out of forty schools, which felt like winning to us.

Today the club has more than thirty members, and younger students teach each other what we once learned the hard way. Mr. Zhou still says he doesn't know much. But I think he knew exactly what he was doing when he put that box on the table. He gave us problems, not answers, and that made all the difference.`,
      names: ["Mr", "Zhou"],
      grammar: reasons,
      questions: [
        [
          ["What did Mr. Zhou say at the first meeting?", "在第一次活动时，周老师说了什么？"],
          ["He would learn about robots with the students.", "他会和学生们一起学习机器人。"],
          [
            ["He had built many robots before.", "他以前造过很多机器人。"],
            ["The club needed more members.", "社团需要更多成员。"],
            ["The students should read a book first.", "学生们应该先读一本书。"],
          ],
          ["He said, \"I don't know much more than you do. Let's learn together.\"", "他说：“我知道的并不比你们多。我们一起学吧。”"],
        ],
        [
          ["What can we learn about the club's first months?", "关于社团最初的几个月，我们可以知道什么？"],
          ["The students who stayed came to enjoy solving problems.", "留下来的学生渐渐喜欢上了解决问题。"],
          [
            ["Every robot they built worked well.", "他们造的每个机器人都运行良好。"],
            ["More and more students joined the club.", "越来越多的学生加入了社团。"],
            ["Mr. Zhou fixed most of the robots himself.", "大多数机器人是周老师亲自修好的。"],
          ],
          [
            'Nothing worked at first and some students left, "But the ones who stayed began to enjoy the problems."',
            "起初什么都不成功，有些学生离开了，“但留下来的人开始享受这些问题”。",
          ],
        ],
        [
          ["How did the writer feel when the robot dropped the first ball?", "机器人掉下第一个球时，作者感觉如何？"],
          ["Worried.", "担心。"],
          [
            ["Proud.", "自豪。"],
            ["Bored.", "无聊。"],
            ["Relieved.", "松了一口气。"],
          ],
          [
            '"My heart almost stopped" shows that the writer suddenly felt afraid that the robot would fail.',
            "“My heart almost stopped”（我的心都快停止跳动了）表明作者突然担心机器人会失败。",
          ],
        ],
        [
          ["What does the writer think of Mr. Zhou's way of teaching?", "作者如何看待周老师的教学方式？"],
          ["It was wise to let students find answers themselves.", "让学生自己寻找答案是明智的。"],
          [
            ["It was too difficult for young students.", "对年轻学生来说太难了。"],
            ["It showed that he did not prepare well.", "说明他准备得不充分。"],
            ["It was the reason the team did not win.", "这是团队没有获胜的原因。"],
          ],
          [
            'The writer says he "knew exactly what he was doing": "He gave us problems, not answers, and that made all the difference."',
            "作者说他“完全清楚自己在做什么”：“他给我们的是问题，而不是答案，这才是关键。”",
          ],
        ],
      ],
    }),
    passage({
      id: "gaokao-reading-grandmothers-garden",
      title: ["My Grandmother's Garden", "外婆的菜园"],
      body: `My grandmother lives in a small village two hours from our city. Behind her house there is a garden no bigger than a classroom, but it seems to hold the whole year. In spring there are young green onions; in summer, tomatoes and beans; in fall, potatoes and carrots.

When I was small, I spent every summer holiday with her. Every morning she woke me at six. "Plants don't wait for lazy children," she would say, and gave me a small box. Together we picked the vegetables that were ready, pulled up the grass that grew between them and carried water from the well. I complained a lot in those days. The work was hot and dirty, and my friends in the city were sleeping late and playing computer games.

But slowly, I began to notice things. I saw how the bean plants grew a little higher each day. I learned that tomatoes taste best when you eat them warm from the sun. I found out that if you plant flowers between the vegetables, the bees come and help the plants grow fruit.

My grandmother never went to school for long, but she knew more about plants than anyone I have met. She could tell from the color of a leaf whether a plant needed water, and from the smell of the air whether rain was coming. "The garden teaches you if you listen," she told me.

Now I am in high school and have little time for long holidays. But on the roof of our apartment building in the city, I grow tomatoes in boxes. They are not as big as hers, but every time I eat one warm from the sun, I feel as if I am back in her garden.`,
      grammar: reasons,
      questions: [
        [
          ["Why did the writer complain during the summer holidays?", "暑假期间作者为什么抱怨？"],
          ["The garden work was hard and unpleasant.", "菜园里的活又累又不舒服。"],
          [
            ["Grandmother was often angry with her.", "外婆经常对她生气。"],
            ["There was no water in the village.", "村子里没有水。"],
            ["Her friends came to the village too.", "她的朋友们也来了村子。"],
          ],
          ['"The work was hot and dirty", while her friends in the city were sleeping late.', "“活又热又脏”，而城里的朋友们却在睡懒觉。"],
        ],
        [
          ["What did the writer learn in the garden?", "作者在菜园里学到了什么？"],
          ["Flowers bring bees that help vegetables grow.", "花能引来蜜蜂，帮助蔬菜结果。"],
          [
            ["Beans grow best in the dark.", "豆子在黑暗中长得最好。"],
            ["Tomatoes should be eaten cold.", "西红柿应该凉着吃。"],
            ["Grass is good for vegetables.", "杂草对蔬菜有好处。"],
          ],
          [
            '"If you plant flowers between the vegetables, the bees come and help the plants grow fruit."',
            "文中说：“如果在蔬菜之间种花，蜜蜂就会来帮助植物结果。”",
          ],
        ],
        [
          ["What does the fourth paragraph mainly tell us about the grandmother?", "第四段主要告诉我们外婆的什么？"],
          ["She understood plants and nature very well.", "她非常了解植物和自然。"],
          [
            ["She studied plants at a university.", "她在大学里学习过植物。"],
            ["She wanted the writer to become a farmer.", "她希望作者成为农民。"],
            ["She did not like to talk about her garden.", "她不喜欢谈论她的菜园。"],
          ],
          [
            'She "never went to school for long" but "knew more about plants than anyone", telling the weather from the air.',
            "她“没上过多久学”，却“比任何人都更了解植物”，还能从空气中判断天气。",
          ],
        ],
        [
          ["Why does the writer grow tomatoes on the roof?", "作者为什么在楼顶种西红柿？"],
          ["They bring back happy memories of her grandmother.", "它们让她想起和外婆在一起的美好时光。"],
          [
            ["They are bigger than her grandmother's.", "它们比外婆种的更大。"],
            ["She wants to sell them at school.", "她想在学校里卖掉它们。"],
            ["Her teacher asked her to do it.", "她的老师让她这么做。"],
          ],
          [
            'Eating one warm from the sun, she feels "as if I am back in her garden".',
            "吃到被太阳晒暖的西红柿时，她觉得“仿佛回到了外婆的菜园”。",
          ],
        ],
      ],
    }),
    passage({
      id: "gaokao-reading-how-ants-find-food",
      title: ["How Ants Find Food", "蚂蚁如何找到食物"],
      body: `If you leave a piece of cake on a table outside, it will not be long before a line of ants arrives. How do these tiny animals, which can hardly see, find food so quickly and tell thousands of others where it is?

The answer is smell. When an ant leaves its home to look for food, it walks around almost without a plan. Once it finds something to eat, it carries a small piece back home. On the way, it leaves a trail, a line of a special chemical, on the ground. Other ants can smell this trail and follow it to the food. When they return home with food of their own, they add more of the chemical, so the trail becomes stronger.

This simple way of working is more clever than it looks. Imagine that two ants find two different ways to the same food, one short and one long. The ant on the short way gets home first and comes back earlier, so its trail gets stronger faster. More ants choose the stronger trail, and soon almost all of them are using the shorter way. No ant decides this. The group finds the best way together.

When the food is gone, the ants stop adding to the trail, and the smell slowly disappears. This means that the ants do not waste time going to a place where there is nothing left.

Scientists have learned a great deal from ants. Computer programs that copy their behavior are used to plan the routes of delivery cars and to send information through the internet. A small animal with a tiny brain has helped people solve some very big problems.`,
      glossed: ["trail"],
      grammar: [...facts, "authors-purpose"],
      questions: [
        [
          ["How does an ant tell others where food is?", "蚂蚁如何告诉其他蚂蚁食物在哪里？"],
          ["By leaving a smell on the ground.", "在地面上留下气味。"],
          [
            ["By making a special sound.", "发出一种特殊的声音。"],
            ["By showing them the food.", "把食物拿给它们看。"],
            ["By touching their heads.", "触碰它们的头部。"],
          ],
          [
            '"The answer is smell." On the way home, an ant "leaves a trail, a line of a special chemical, on the ground" that others follow.',
            "文中说：“答案是气味。”蚂蚁在回家的路上会“在地面上留下一条特殊化学物质的痕迹”，其他蚂蚁顺着它找到食物。",
          ],
        ],
        [
          ["Why do most ants end up using the shorter way?", "为什么大多数蚂蚁最后会走较短的路？"],
          ["Its trail becomes stronger more quickly.", "这条路上的气味变浓得更快。"],
          [
            ["A leader ant chooses it for them.", "一只领头的蚂蚁替它们选择了这条路。"],
            ["They can see that it is shorter.", "它们能看出这条路更短。"],
            ["The longer way has no food.", "较长的路上没有食物。"],
          ],
          [
            'The ant on the short way comes back earlier, "so its trail gets stronger faster", and more ants follow the stronger trail. "No ant decides this."',
            "走短路的蚂蚁回来得更早，“所以它的气味痕迹变浓得更快”，更多的蚂蚁就会跟随更浓的痕迹。文中说：“没有哪只蚂蚁做这个决定。”",
          ],
        ],
        [
          ["What happens when the food is gone?", "食物吃完后会发生什么？"],
          ["The trail slowly fades away.", "气味痕迹会慢慢消失。"],
          [
            ["The ants look for it at the same place.", "蚂蚁们还在同一个地方寻找食物。"],
            ["The ants make the trail stronger.", "蚂蚁们会让气味痕迹变得更浓。"],
            ["The ants move to a new home.", "蚂蚁们会搬到新家。"],
          ],
          ['"The ants stop adding to the trail, and the smell slowly disappears."', "文中说：“蚂蚁不再增加气味，气味会慢慢消失。”"],
        ],
        [
          ["What is the purpose of the last paragraph?", "最后一段的目的是什么？"],
          ["To show how people use what they have learned from ants.", "说明人们如何运用从蚂蚁身上学到的东西。"],
          [
            ["To explain why ants have small brains.", "解释蚂蚁的大脑为什么很小。"],
            ["To warn people not to leave food outside.", "提醒人们不要把食物留在室外。"],
            ["To describe how trucks deliver food.", "描述卡车如何运送食物。"],
          ],
          [
            'It says computer programs "that copy their behavior" plan delivery routes and send information through the internet.',
            "最后一段说，“基于蚂蚁行为”的计算机程序被用来规划送货路线和在互联网上传递信息。",
          ],
        ],
      ],
    }),
    passage({
      id: "gaokao-reading-a-museum-without-walls",
      title: ["A Museum Without Walls", "没有围墙的博物馆"],
      body: `Most people think of a museum as a quiet building where old things sit behind glass. But in the small town of Qingshui, the museum has no building at all. The whole town is the museum.

The idea came from a group of retired teachers. They were worried that young people knew little about the history of their town. "Our children could tell you everything about cities on the other side of the world," said Mrs. Hu, one of the group, "but they didn't know why the old road through our town is not straight, or who built the old stone bridge."

So the teachers began to collect stories. They talked to the oldest people in town and wrote down what they remembered. Then they put up small signs around the town. Each sign has a short story and a small square picture. If you point your phone at it, you can hear an old person telling the story in their own voice. A sign on the bridge tells how it was built by hand over three years. A sign outside the old station tells of a love story that began with a letter delivered to the wrong house.

Today there are more than eighty signs, and the museum has changed the town. Students from the local school now do projects on the stories and add new ones. Visitors come from nearby cities, and some families who moved away have returned to show their children where they grew up.

"A museum is not about things," Mrs. Hu says. "It is about memory. If we don't keep our stories, we lose a part of ourselves."`,
      names: ["Qingshui", "Mrs", "Hu"],
      grammar: [...facts, "making-inferences"],
      questions: [
        [
          ["What is special about the museum in Qingshui?", "清水镇的博物馆有什么特别之处？"],
          ["It is spread across the whole town.", "它分布在整个小镇。"],
          [
            ["It is the oldest building in town.", "它是镇上最古老的建筑。"],
            ["It shows objects from around the world.", "它展出来自世界各地的物品。"],
            ["It is run by the local school.", "它由当地学校管理。"],
          ],
          ['"The museum has no building at all. The whole town is the museum."', "文中说：“这座博物馆根本没有建筑。整个小镇就是博物馆。”"],
        ],
        [
          ["Why did the retired teachers start the project?", "退休教师们为什么发起这个项目？"],
          ["Young people knew little about their own town.", "年轻人对自己的小镇知之甚少。"],
          [
            ["The town needed more visitors.", "小镇需要更多游客。"],
            ["The old bridge was in danger.", "那座古桥有危险。"],
            ["They wanted to sell old objects.", "他们想出售旧物件。"],
          ],
          ['They "were worried that young people knew little about the history of their town".', "他们“担心年轻人对小镇的历史了解很少”。"],
        ],
        [
          ["What can visitors do with a sign?", "游客可以用标牌做什么？"],
          ["Listen to an old person telling a story.", "听一位老人讲述一个故事。"],
          [
            ["Send a letter to the post office.", "给邮局寄一封信。"],
            ["Buy a ticket for the museum.", "购买博物馆门票。"],
            ["Watch a film about the town.", "观看一部关于小镇的电影。"],
          ],
          [
            'If you point your phone at the picture on a sign, "you can hear an old person telling the story in their own voice".',
            "用手机对准标牌上的图案，“就能听到老人亲口讲述这个故事”。",
          ],
        ],
        [
          ["What does Mrs. Hu mean in the last paragraph?", "胡女士在最后一段想表达什么？"],
          ["Remembering stories helps people know who they are.", "记住这些故事能帮助人们了解自己是谁。"],
          [
            ["Museums should keep more old objects.", "博物馆应该收藏更多旧物件。"],
            ["Old people should write their own books.", "老人们应该自己写书。"],
            ["The town needs a museum building.", "小镇需要一座博物馆建筑。"],
          ],
          [
            '"A museum is not about things. It is about memory. If we don\'t keep our stories, we lose a part of ourselves."',
            "她说：“博物馆关乎的不是物品，而是记忆。如果不保存我们的故事，我们就会失去自己的一部分。”",
          ],
        ],
      ],
    }),
    passage({
      id: "gaokao-reading-the-boy-who-fixed-bicycles",
      title: ["The Boy Who Fixed Bicycles", "修自行车的男孩"],
      body: `Every Saturday morning, a line of broken bikes waits outside the front door of the Chen family. Some have wheels that won't turn, some have broken parts, and one or two look as if they will never ride again. By the evening, almost all of them are working, thanks to Chen Yu, who is fourteen years old.

It started two years ago, when his own bike broke and his father was too busy to help. Instead of waiting, he watched a few videos online, borrowed some tools from a neighbor and fixed it himself. It took him a whole afternoon and he got oil all over his clothes, but when he rode down the street, he felt like a hero.

Soon, neighbors began to ask him for help. An old man needed his bike to go to the market. A girl down the street could not get to school because her bike kept breaking down. Chen Yu fixed them all and refused to take any money. "If I can help, why should I ask for anything?" he said.

His parents were worried at first that the work would take time away from his studies. But they noticed that he had become more patient and more careful, and his grades in physics actually improved. "He understands how things work now," his father said. "He doesn't just learn it from a book."

Last month, Chen Yu used the money from a prize he had won at school to buy a box of new tools. He has also started teaching two younger children from his street. "One day I won't be here to fix all your bikes," he said with a smile. "So they need to learn too."`,
      names: ["Chen", "Yu"],
      grammar: reasons,
      questions: [
        [
          ["How did Chen Yu learn to fix his own bike?", "陈宇是怎样学会修自己的自行车的？"],
          ["By watching videos and trying it himself.", "看视频，然后自己动手尝试。"],
          [
            ["By taking a class at school.", "在学校上课。"],
            ["By asking his father for help.", "请父亲帮忙。"],
            ["By working in a bike shop.", "在自行车店打工。"],
          ],
          [
            'His father was busy, so "he watched a few videos online, borrowed some tools from a neighbor and fixed it himself".',
            "父亲很忙，于是“他在网上看了几个视频，向邻居借了些工具，自己把车修好了”。",
          ],
        ],
        [
          ["What does Chen Yu's answer in the third paragraph show about him?", "第三段中陈宇的回答表明他是个怎样的人？"],
          ["He is happy to help others for nothing.", "他乐于无偿帮助别人。"],
          [
            ["He wants to start his own business.", "他想自己创业。"],
            ["He thinks his neighbors are rich.", "他认为邻居们很富有。"],
            ["He is too shy to talk about money.", "他太害羞，不好意思谈钱。"],
          ],
          [
            'He "refused to take any money" and asked, "If I can help, why should I ask for anything?"',
            "他“拒绝收任何钱”，还说：“如果我能帮忙，为什么要索取回报呢？”",
          ],
        ],
        [
          ["How did fixing bikes affect Chen Yu's studies?", "修自行车对陈宇的学习有什么影响？"],
          ["It helped him do better in physics.", "它帮助他在物理上取得了更好的成绩。"],
          [
            ["It made him fall behind in class.", "它使他在班上落后了。"],
            ["It took too much of his time.", "它占用了他太多时间。"],
            ["It had no effect on them at all.", "它对学习完全没有影响。"],
          ],
          [
            'His parents worried at first, but "his grades in physics actually improved".',
            "他的父母起初很担心，但“他的物理成绩其实提高了”。",
          ],
        ],
        [
          ["Why is Chen Yu teaching two younger children?", "陈宇为什么要教两个更小的孩子？"],
          ["So that others can fix bikes when he is gone.", "这样他不在时别人也能修车。"],
          [
            ["Because their parents pay him.", "因为他们的父母付钱给他。"],
            ["Because he is tired of fixing bikes.", "因为他厌倦了修车。"],
            ["So that he can win another prize.", "这样他就能再得一个奖。"],
          ],
          [
            '"One day I won\'t be here to fix all your bikes. So they need to learn too."',
            "他说：“总有一天我不能再给大家修车了，所以他们也需要学会。”",
          ],
        ],
      ],
    }),
    passage({
      id: "gaokao-reading-sleep-and-teenagers",
      title: ["Sleep and Teenagers", "睡眠与青少年"],
      body: `Many parents complain that their teenage children stay up too late at night and are impossible to wake in the morning. They often blame phones, or think their children are lazy. But scientists say that part of the reason lies in the body itself.

Our bodies have an inside clock that tells us when to feel tired. In children, this clock makes them tired early in the evening. But when children become teenagers, the clock moves later by about two hours. A teenager of fifteen may not feel tired until eleven at night or later, even if they go to bed at nine. They do not choose this; it is a natural change.

The problem is that most schools start early. If a teenager goes to sleep at eleven and has to get up at six, they get only seven hours of sleep. Doctors say that teenagers need eight to ten hours. Without enough sleep, students find it hard to pay attention in class, remember what they have learned and control their feelings. They also get ill more often.

Some schools have tried starting the day later. In one study, a group of schools moved their start time from 7:30 to 8:30. Students slept on average forty minutes more each night. Their grades went up, not as many students were late, and they said they felt happier.

Of course, not every school can change its schedule. But there are things teenagers can do themselves. Experts suggest putting phones away an hour before bed, because the light from screens tells the brain it is still day. Going to bed and getting up at the same time every day, even at weekends, also helps the inside clock stay steady.`,
      grammar: [...facts, "making-inferences"],
      questions: [
        [
          ["According to scientists, why do teenagers stay up late?", "根据科学家的说法，青少年为什么熬夜？"],
          ["Their inside clock changes as they grow.", "他们体内的生物钟随着成长而改变。"],
          [
            ["They are lazier than children.", "他们比小孩更懒。"],
            ["They have too much homework.", "他们的作业太多。"],
            ["They drink too much coffee.", "他们喝了太多咖啡。"],
          ],
          [
            'When children become teenagers, "the clock moves later by about two hours". "They do not choose this; it is a natural change."',
            "孩子进入青春期后，“生物钟会推迟约两个小时”。文中说：“这不是一种选择，而是一种自然的变化。”",
          ],
        ],
        [
          ["Which is NOT mentioned as a result of too little sleep?", "下列哪一项没有作为睡眠不足的后果被提到？"],
          ["Growing more slowly.", "长得更慢。"],
          [
            ["Finding it hard to pay attention.", "难以集中注意力。"],
            ["Getting ill more easily.", "更容易生病。"],
            ["Having trouble controlling feelings.", "难以控制情绪。"],
          ],
          [
            "The text lists attention, memory, controlling feelings and getting ill. It says nothing about growth.",
            "文中列出的是注意力、记忆力、控制情绪和生病，没有提到生长发育。",
          ],
        ],
        [
          ["What happened when some schools started later?", "一些学校推迟上课时间后发生了什么？"],
          ["Students slept more and did better.", "学生睡得更多，表现也更好了。"],
          [
            ["Students went to bed even later.", "学生睡得更晚了。"],
            ["More students arrived late.", "迟到的学生更多了。"],
            ["Grades stayed the same.", "成绩没有变化。"],
          ],
          [
            'Students slept "forty minutes more each night. Their grades went up, not as many students were late".',
            "学生“每晚多睡了四十分钟。他们的成绩提高了，迟到的学生也减少了”。",
          ],
        ],
        [
          ["Why do experts suggest putting phones away before bed?", "专家为什么建议睡前把手机收起来？"],
          ["Screen light makes the brain think it is daytime.", "屏幕的光会让大脑以为还是白天。"],
          [
            ["Phones are too expensive to break.", "手机太贵，弄坏了可惜。"],
            ["Parents want to read their messages.", "父母想看他们的消息。"],
            ["Games make teenagers angry.", "游戏会让青少年生气。"],
          ],
          ['"The light from screens tells the brain it is still day."', "文中说：“屏幕发出的光会告诉大脑现在还是白天。”"],
        ],
      ],
    }),
    passage({
      id: "gaokao-reading-a-letter-to-a-future-self",
      title: ["A Letter to My Future Self", "写给未来自己的一封信"],
      body: `On the first day of high school, our English teacher, Ms. Lin, gave each of us a piece of paper and an envelope. "Write a letter to yourself," she said. "I will keep it, and you will open it on your last day here." Most of us laughed. Three years seemed like forever.

I remember sitting for a long time with an empty page. In the end I wrote about my fears: that I would not make friends, that I would fail math, that I was not as clever as everyone else. I also wrote down my dreams. I wanted to join the school band, to read a hundred books and to become a doctor one day. Then I closed the envelope and forgot about it.

Last week, on our final day, Ms. Lin gave the letters back. The room went quiet as we read. Some students laughed; one girl cried. When I opened mine, I hardly knew the person who had written it. She was so worried! I had made good friends in the first month. Math had been hard, but I had passed every test. I had not read a hundred books, but I had read more than sixty, and I had played the drums in the band for two years.

The doctor dream is still a dream, but now it feels possible. Before I left, I asked Ms. Lin why she did this every year. She smiled. "Because at fifteen, you can't see how much you will grow," she said. "At eighteen, you can look back and see it."

That evening, I took a new piece of paper and began another letter. This one I will open when I am twenty-five.`,
      names: ["Ms", "Lin"],
      grammar: reasons,
      questions: [
        [
          ["How did most students react when Ms. Lin explained the task?", "林老师布置这项任务时，大多数学生有什么反应？"],
          ["They thought three years was a very long time.", "他们觉得三年是很长的时间。"],
          [
            ["They refused to write anything.", "他们拒绝写任何东西。"],
            ["They were worried about their marks.", "他们担心自己的分数。"],
            ["They asked to read each other's letters.", "他们要求互相读信。"],
          ],
          ['"Most of us laughed. Three years seemed like forever."', "文中说：“我们大多数人都笑了。三年似乎永远也过不完。”"],
        ],
        [
          ["What was the writer like at the start of high school?", "刚上高中时，作者是个怎样的人？"],
          ["She lacked confidence.", "她缺乏自信。"],
          [
            ["She was very popular.", "她很受欢迎。"],
            ["She was good at math.", "她擅长数学。"],
            ["She hated reading.", "她讨厌阅读。"],
          ],
          [
            'She wrote that she feared she "was not as clever as everyone else" and would not make friends.',
            "她写道，她担心自己“不如别人聪明”，还担心交不到朋友。",
          ],
        ],
        [
          ["Which of the writer's dreams came true?", "作者的哪个梦想实现了？"],
          ["Joining the school band.", "加入学校乐队。"],
          [
            ["Reading a hundred books.", "读一百本书。"],
            ["Becoming a doctor.", "成为一名医生。"],
            ["Getting full marks in math.", "数学考满分。"],
          ],
          [
            'She "played the drums in the band for two years", but read only about sixty books, and the doctor dream "is still a dream".',
            "她“在乐队里打了两年鼓”，但只读了六十多本书，而当医生“仍然是一个梦想”。",
          ],
        ],
        [
          ["Why does Ms. Lin ask her students to write the letters?", "林老师为什么让学生写这些信？"],
          ["To help them see how much they have grown.", "帮助他们看到自己成长了多少。"],
          [
            ["To practice writing for the exam.", "为考试练习写作。"],
            ["To find out their students' secrets.", "了解学生们的秘密。"],
            ["To decide who should join the band.", "决定谁应该加入乐队。"],
          ],
          [
            '"At fifteen, you can\'t see how much you will grow. At eighteen, you can look back and see it."',
            "她说：“十五岁时，你看不到自己会成长多少；到了十八岁，你回头就能看到。”",
          ],
        ],
      ],
    }),
  ],
};
