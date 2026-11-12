// Grade 8: the reading unit of the ninth theme, journeys to a new home, from the immigration stations of Ellis Island
// and Angel Island to the Great Migration, a diplomat who saved thousands, and the voices of people who start again.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const migrationWords = { topic: "words-of-migration", weight: 0.3 } as const;
const newLifeWords = { topic: "words-of-new-lives", weight: 0.3 } as const;
const diplomacyWords = { topic: "words-of-diplomacy", weight: 0.3 } as const;
const oralHistory = { topic: "reading-an-oral-history", weight: 0.2 } as const;
const memoirAndReport = { topic: "comparing-a-memoir-and-a-report", weight: 0.2 } as const;
const academic1 = { topic: "academic-words-1", weight: 0.1 } as const;
const academic2 = { topic: "academic-words-2", weight: 0.1 } as const;

/** journeysToANewHome is a reading unit of grade 8 on migration, refugees and the lives people build in a new country. */
export const journeysToANewHome: ReadingUnitDef = {
  id: "journeys-to-a-new-home",
  title: t("Journeys to a New Home", "迁往新家园"),
  passages: [
    passage(
      "the-island-of-hope",
      t("The Island of Hope", "希望之岛"),
      `Between 1892 and 1954, about twelve million people passed through Ellis Island, a small island in New York Harbor. It was the busiest immigration station in the United States, and for most of the people who arrived there, it was their first step onto American soil. Today, about four in ten Americans have at least one ancestor who came through it.

Most immigrants had crossed the Atlantic Ocean in the crowded lower decks of steamships, a journey of one to two weeks. Passengers who had paid for first- or second-class cabins were usually inspected on board and allowed to go straight into the city. Everyone else was taken by ferry to Ellis Island.

There, they climbed a long staircase to the Great Hall. Unknown to most of them, doctors were watching from the top of the stairs. Anyone who seemed out of breath, had trouble walking or looked ill might be marked with chalk on their coat: "H" for heart, "E" for eyes, "L" for lameness. Those who were marked were taken aside for a closer examination. Then inspectors asked each newcomer a series of questions: their name, their job, whether they had money and where they were going.

For about eight out of ten immigrants, the whole process took only a few hours. Only about two percent were refused entry and sent back, usually because of illness or because officials believed they would not be able to support themselves. For those families, Ellis Island became the "Island of Tears."

For the rest, it was the beginning of a new life. They took a ferry to Manhattan or a train to the West, carrying their belongings in trunks and bundles, ready to look for work, find relatives and settle in a new homeland.`,
      [migrationWords, newLifeWords, academic2],
      [
        ask(
          t("Why did first- and second-class passengers usually skip Ellis Island?", "为什么一等舱和二等舱乘客通常不必去埃利斯岛？"),
          t("They were inspected on board the ship and allowed straight into the city", "他们在船上接受检查，然后直接进入城市"),
          [
            t("They were all American citizens", "他们都是美国公民"),
            t("They arrived at a different harbor", "他们在另一个港口登岸"),
            t("They did not need to answer any questions", "他们不需要回答任何问题"),
          ],
          t(
            "The second paragraph says passengers in first- or second-class cabins were usually inspected on board and allowed to go straight into the city.",
            "第二段说一等舱或二等舱的乘客通常在船上接受检查，然后直接进城。",
          ),
        ),
        ask(
          t("Why did doctors watch immigrants climbing the staircase?", "为什么医生要观察爬楼梯的移民？"),
          t("To spot people who seemed ill or had trouble walking", "为了发现看起来生病或行走困难的人"),
          [
            t("To count how many people arrived each day", "为了统计每天到达的人数"),
            t("To help them carry their belongings", "为了帮他们搬行李"),
            t("To check their tickets", "为了检查他们的船票"),
          ],
          t(
            "The third paragraph says doctors at the top of the stairs marked anyone who seemed out of breath, had trouble walking or looked ill.",
            "第三段说楼梯顶上的医生会给看起来喘不过气、行走困难或面带病容的人做记号。",
          ),
        ),
        ask(
          t('Why was Ellis Island also called the "Island of Tears"?', "为什么埃利斯岛也被称为“泪水之岛”？"),
          t("Some families were refused entry and sent back", "一些家庭被拒绝入境并被遣返"),
          [
            t("Most immigrants were refused entry", "大多数移民被拒绝入境"),
            t("The island was often flooded", "这个岛经常被淹"),
            t("Immigrants had to wait there for years", "移民必须在那里等待好几年"),
          ],
          t(
            "The fourth paragraph says about two percent were refused entry and sent back, and for those families Ellis Island became the Island of Tears.",
            "第四段说约百分之二的人被拒绝入境并被遣返，对这些家庭来说，埃利斯岛成了“泪水之岛”。",
          ),
        ),
      ],
      [
        "Ellis",
        "Island",
        "New",
        "York",
        "Harbor",
        "United",
        "States",
        "American",
        "Americans",
        "Atlantic",
        "Ocean",
        "Great",
        "Hall",
        "Tears",
        "Manhattan",
        "West",
        "Hope",
      ],
    ),
    passage(
      "poems-on-the-walls",
      t("Poems on the Walls", "墙上的诗"),
      `On the other side of the United States, in San Francisco Bay, lies Angel Island. From 1910 to 1940, it was the site of an immigration station, but its purpose was very different from that of Ellis Island. Many of the people held there had come from China, and the United States had passed laws designed to keep them out.

The Chinese Exclusion Act of 1882 banned most Chinese workers from entering the country. Only certain groups, such as merchants, students and the children of American citizens, were allowed in. To prove that they belonged to one of these groups, Chinese immigrants faced long, detailed interviews. Officials asked about the number of windows in their family's house in China, the location of the village well and the names of neighbors. Their answers were then compared with those of relatives who had already arrived. A single difference could lead to deportation.

Because of these questions, many Chinese immigrants were held on the island for weeks or months, and some for nearly two years. They lived in crowded wooden barracks behind locked doors, separated from their families.

Some of them expressed their feelings by carving poems into the wooden walls. Written in Chinese, the poems speak of loneliness, anger at their treatment and longing for home. One describes the writer staring across the water toward the city, unable to reach it.

In 1940, a fire destroyed the administration building, and the station closed. Years later, the barracks were about to be torn down when a park ranger noticed the carved characters on the walls. Historians and members of the Chinese American community worked to save them. More than two hundred poems have been recorded, and the barracks are now a museum. The Chinese Exclusion Act itself was not repealed until 1943.`,
      [migrationWords, newLifeWords, academic1],
      [
        ask(
          t("How was the purpose of Angel Island different from that of Ellis Island?", "天使岛的用途与埃利斯岛有什么不同？"),
          t(
            "Laws were designed to keep many of the people held there out of the country",
            "法律的目的是把许多被关押在那里的人挡在国门之外",
          ),
          [
            t("It welcomed more immigrants than Ellis Island", "它接收的移民比埃利斯岛还多"),
            t("It was a hospital rather than a station", "它是一家医院而不是移民站"),
            t("It was open only to merchants", "它只对商人开放"),
          ],
          t(
            "The first paragraph says many held there came from China, and the United States had passed laws designed to keep them out.",
            "第一段说被关在那里的许多人来自中国，而美国通过了旨在把他们拒之门外的法律。",
          ),
        ),
        ask(
          t("Why were immigrants asked about windows, wells and neighbors?", "为什么移民被问到窗户、水井和邻居的问题？"),
          t(
            "To check their answers against those of relatives and test their claims",
            "为了把他们的回答与亲属的回答进行比对，检验他们的说法",
          ),
          [
            t("To help them find a place to live", "为了帮他们找住处"),
            t("To prepare a map of China", "为了绘制一张中国地图"),
            t("To decide which job they should have", "为了决定他们应该做什么工作"),
          ],
          t(
            "The second paragraph says their answers were compared with those of relatives who had already arrived, and a single difference could lead to deportation.",
            "第二段说他们的回答会与已经到达的亲属的回答进行比对，一处不同就可能导致被驱逐出境。",
          ),
        ),
        ask(
          t("Why are the poems on the walls valuable to historians?", "为什么墙上的诗对历史学家很有价值？"),
          t("They record the feelings of the immigrants in their own words", "它们用移民自己的话记录了他们的感受"),
          [
            t("They were written by the officials who ran the station", "它们是管理移民站的官员写的"),
            t("They give the answers to the interview questions", "它们给出了面试问题的答案"),
            t("They were written in English for visitors", "它们是用英文写给参观者的"),
          ],
          t(
            "The poems, carved by the detained immigrants themselves, speak of loneliness, anger and longing, a firsthand record found nowhere else.",
            "这些诗由被拘留的移民亲手刻下，诉说着孤独、愤怒和思乡之情，是别处找不到的第一手记录。",
          ),
        ),
      ],
      ["United", "States", "San", "Francisco", "Bay", "Angel", "Island", "Ellis", "China", "Chinese", "Exclusion", "Act", "American"],
    ),
    passage(
      "one-suitcase-an-oral-history",
      t("One Suitcase: An Oral History", "一只手提箱：一段口述历史"),
      `The following is part of an oral history interview recorded for a community project. The speaker, Mr. Le, came to Canada from Vietnam as a refugee in 1979, when he was fourteen. The interviewer's questions are in italics in the original recording notes and are marked here with a Q.

Q: Can you tell me about the day you left?

Mr. Le: We left at night, in a small fishing boat. There were sixty-two of us, and the boat was made for maybe twenty. My mother gave me one bag. She said, "Whatever you can carry, that is what we have now." I took a jacket, a photograph of my grandparents and a math book. I don't know why the math book. I think I wanted something from school.

Q: What was the journey like?

Mr. Le: Five days on the sea. Very little water. On the third day, a storm came, and I was sure we would die. I remember my little sister asleep on my knees, and I kept thinking, if she wakes up, I must not look afraid. Then we reached a camp in Malaysia. We stayed there eight months.

Q: How did you feel when you arrived in Canada?

Mr. Le: Cold! (laughs) We arrived in February. A church in Winnipeg sponsored our family. A woman from the church met us at the airport with coats, and she cried when she saw us. I didn't understand her words, but I understood that.

Q: What does home mean to you now?

Mr. Le: For a long time, I thought home was the place I lost. Now I think home is the people. My children were born here. I am Canadian, and I am Vietnamese. I don't have to choose.`,
      [migrationWords, newLifeWords, oralHistory],
      [
        ask(
          t("What does the introduction before the interview tell the reader?", "采访前的介绍告诉了读者什么？"),
          t("Who the speaker is, when he came and how the questions are marked", "讲述者是谁、他何时来的，以及问题是如何标注的"),
          [
            t("Why the boat was made for twenty people", "为什么那艘船是为二十人建造的"),
            t("The name of the woman from the church", "教会那位女士的名字"),
            t("What happened to the math book later", "那本数学书后来怎么样了"),
          ],
          t(
            "The first paragraph gives the speaker's name, where he came from and when, and explains that the interviewer's questions are marked with a Q.",
            "第一段给出了讲述者的名字、来自哪里、何时到来，并说明采访者的问题用 Q 标注。",
          ),
        ),
        ask(
          t("What does the detail of the math book suggest about Mr. Le as a boy?", "数学书这个细节暗示了少年时的黎先生是怎样的人？"),
          t("He wanted to hold on to something from his normal life at school", "他想保留一些学校里正常生活的东西"),
          [
            t("He planned to become a math teacher", "他打算成为一名数学老师"),
            t("His mother told him to bring it", "他妈妈叫他带上它"),
            t("He needed it to pass a test in Canada", "他需要它通过加拿大的考试"),
          ],
          t(
            'Mr. Le says, "I think I wanted something from school," which suggests he was holding on to a piece of the ordinary life he was leaving.',
            "黎先生说“我想我是想留一点学校里的东西”，这表明他想抓住即将离开的平常生活的一部分。",
          ),
        ),
        ask(
          t("How has Mr. Le's idea of home changed?", "黎先生对家的看法发生了怎样的变化？"),
          t("He once thought of home as the place he lost but now sees it as the people", "他曾认为家是他失去的地方，现在认为家是人"),
          [
            t("He now thinks home is only Vietnam", "他现在认为家只是越南"),
            t("He now thinks home is the church in Winnipeg", "他现在认为家是温尼伯的那座教堂"),
            t("He has never thought about home", "他从未想过家的问题"),
          ],
          t(
            "In his last answer, he says that for a long time home was the place he lost, but now he thinks home is the people.",
            "在最后一个回答中，他说很长时间以来家是他失去的地方，但现在他认为家是人。",
          ),
        ),
      ],
      [
        "Mr",
        "Le",
        "Canada",
        "Vietnam",
        "Malaysia",
        "February",
        "Winnipeg",
        "Canadian",
        "Vietnamese",
        "Q",
        "Le's",
        "One",
        "Suitcase",
        "Oral",
        "History",
      ],
    ),
    passage(
      "the-great-migration",
      t("The Great Migration", "大迁徙"),
      `Not every great migration crosses an ocean. Between about 1910 and 1970, some six million African Americans left the rural South of the United States and moved to cities in the North, the Midwest and the West. Historians call this movement the Great Migration. It was one of the largest movements of people within a single country in modern history, and it changed the nation.

People left for many reasons. In the South, laws known as Jim Crow laws kept Black and white Americans separate in schools, trains, restaurants and even hospitals. Black citizens were often prevented from voting, and they lived under the threat of violence. Many worked as sharecroppers, farming land owned by others for a share of the crop, and they often fell deeper into debt each year.

At the same time, factories in northern cities needed workers, especially after the First World War cut off immigration from Europe. Black newspapers such as the Chicago Defender printed stories of jobs and freedom in the North and urged readers to come. Families wrote letters home describing better wages, and one relative's move often led to another's.

The North was not the promised land that many had hoped for. Newcomers faced discrimination in housing and jobs, and they were often crowded into the poorest neighborhoods. Yet they built strong communities. In Harlem, in New York City, writers, artists and musicians created a flowering of culture known as the Harlem Renaissance. Jazz and the blues spread from the South to the clubs of Chicago and New York.

The writer Isabel Wilkerson, who interviewed more than a thousand people for her history of the migration, compared these migrants to immigrants from abroad. They were, she wrote, seeking asylum within their own country.`,
      [migrationWords, newLifeWords, academic1],
      [
        ask(
          t("Which reasons for leaving the South does the second paragraph give?", "第二段给出了离开南方的哪些原因？"),
          t("Segregation laws, being prevented from voting, violence and debt", "种族隔离法、被剥夺投票权、暴力和债务"),
          [
            t("Better schools and hospitals in the South", "南方有更好的学校和医院"),
            t("The end of the First World War", "第一次世界大战的结束"),
            t("A shortage of land to farm", "可耕种的土地短缺"),
          ],
          t(
            "The second paragraph lists Jim Crow laws, being prevented from voting, the threat of violence and sharecroppers falling deeper into debt.",
            "第二段列举了吉姆·克劳法、被阻止投票、暴力威胁以及佃农债务越积越深。",
          ),
        ),
        ask(
          t("How did newspapers and letters encourage the migration?", "报纸和信件如何促进了这次迁徙？"),
          t("They described jobs and better wages in the North", "它们描述了北方的工作机会和更高的工资"),
          [
            t("They warned people to stay in the South", "它们警告人们留在南方"),
            t("They offered free train tickets", "它们提供免费火车票"),
            t("They were written by factory owners", "它们是由工厂主写的"),
          ],
          t(
            "The third paragraph says the Chicago Defender printed stories of jobs and freedom, and families wrote home describing better wages.",
            "第三段说《芝加哥保卫者报》刊登了关于工作和自由的报道，家人们也写信回家描述更高的工资。",
          ),
        ),
        ask(
          t(
            'What does Wilkerson mean by calling the migrants people "seeking asylum within their own country"?',
            "威尔克森称这些移民是“在自己国家内寻求庇护的人”，是什么意思？",
          ),
          t(
            "Like refugees, they were escaping danger and injustice, though they never left the country",
            "他们像难民一样在逃离危险和不公，尽管从未离开这个国家",
          ),
          [
            t("They were refused entry to the North", "他们被拒绝进入北方"),
            t("They planned to leave the United States", "他们计划离开美国"),
            t("They were new immigrants from Europe", "他们是来自欧洲的新移民"),
          ],
          t(
            "Asylum is protection sought by people fleeing danger; Wilkerson's comparison shows that the migrants fled injustice without crossing a border.",
            "庇护是逃离危险的人所寻求的保护；威尔克森的比较表明，这些移民没有越过国界，却在逃离不公。",
          ),
        ),
      ],
      [
        "African",
        "Americans",
        "South",
        "United",
        "States",
        "North",
        "Midwest",
        "West",
        "Great",
        "Migration",
        "Jim",
        "Crow",
        "Black",
        "First",
        "World",
        "War",
        "Europe",
        "Chicago",
        "Defender",
        "Harlem",
        "New",
        "York",
        "City",
        "Renaissance",
        "Isabel",
        "Wilkerson",
      ],
    ),
    passage(
      "the-diplomat-who-wrote-visas",
      t("The Diplomat Who Wrote Visas", "签发签证的外交官"),
      `In the summer of 1940, a crowd gathered outside the Japanese consulate in Kaunas, a city in Lithuania. Most of the people waiting at the gates were Jewish refugees who had fled from Poland when the German army invaded. Now the Soviet Union had taken over Lithuania, and the Nazis were advancing across Europe. The refugees were desperate to escape, but almost every country had closed its doors to them.

The Japanese consul in Kaunas was a diplomat named Chiune Sugihara. The refugees had found a possible route: across the Soviet Union to Japan, and from there to other countries. But to travel through Japan, they needed a transit visa, and Sugihara's government had ordered him to give visas only to people with proper papers and enough money. Most of the refugees had neither.

Sugihara asked his government for permission three times, and three times he was refused. He discussed it with his wife, Yukiko. Then he decided to disobey. For about six weeks, he wrote visas by hand, for up to eighteen hours a day, until his arm ached. When the consulate was closed and he was ordered to leave, he kept writing at his hotel, and even from the window of his train as it pulled out of the station, passing the papers to the people on the platform.

Historians estimate that Sugihara issued more than two thousand visas, many for whole families. Around six thousand people may have escaped because of them. Today their descendants number in the tens of thousands.

After the war, Sugihara left the diplomatic service and lived quietly for many years. In 1985, Israel honored him as one of the Righteous Among the Nations, a title for people who risked their own safety to save Jews from persecution.`,
      [diplomacyWords, migrationWords, newLifeWords, academic1],
      [
        ask(
          t("Why did the refugees need a visa from Sugihara?", "为什么难民需要杉原千亩的签证？"),
          t("They needed a transit visa to travel through Japan to other countries", "他们需要过境签证，才能途经日本前往其他国家"),
          [
            t("They wanted to settle in Lithuania", "他们想在立陶宛定居"),
            t("They planned to return to Poland", "他们打算回到波兰"),
            t("They wanted to work at the consulate", "他们想在领事馆工作"),
          ],
          t(
            "The second paragraph says their route ran across the Soviet Union to Japan and on to other countries, and to pass through Japan they needed a transit visa.",
            "第二段说他们的路线是穿越苏联到日本，再去其他国家，要途经日本就需要过境签证。",
          ),
        ),
        ask(
          t("What does Sugihara's writing visas from his train window show about him?", "杉原千亩在火车窗口写签证说明了他是怎样的人？"),
          t("He was determined to save as many people as he could until the last moment", "他决心到最后一刻都要尽可能多地救人"),
          [
            t("He wanted to leave Lithuania as quickly as possible", "他想尽快离开立陶宛"),
            t("He was following his government's orders", "他在执行政府的命令"),
            t("He did not know the consulate had closed", "他不知道领事馆已经关闭了"),
          ],
          t(
            "Even after being ordered to leave, he kept writing at his hotel and from the train, which shows his determination to save every person he could.",
            "即使在被命令离开之后，他仍在旅馆和火车上继续写签证，这表明他决心救下每一个能救的人。",
          ),
        ),
        ask(
          t("Why did Israel honor Sugihara as one of the Righteous Among the Nations?", "以色列为什么授予杉原千亩“国际义人”的称号？"),
          t("He risked his own safety to save Jews from persecution", "他冒着自身危险从迫害中拯救犹太人"),
          [
            t("He was the first Japanese diplomat in Europe", "他是第一位驻欧洲的日本外交官"),
            t("He wrote a history of the war", "他写了一部战争史"),
            t("He lived in Israel after the war", "战后他住在以色列"),
          ],
          t(
            "The last paragraph says the title is given to people who risked their own safety to save Jews from persecution, as Sugihara did by disobeying orders.",
            "最后一段说这个称号授予那些冒着自身危险从迫害中拯救犹太人的人，杉原千亩违抗命令正是这样做的。",
          ),
        ),
      ],
      [
        "Japanese",
        "Kaunas",
        "Lithuania",
        "Jewish",
        "Poland",
        "German",
        "Soviet",
        "Union",
        "Nazis",
        "Europe",
        "Chiune",
        "Sugihara",
        "Japan",
        "Sugihara's",
        "Yukiko",
        "Israel",
        "Righteous",
        "Among",
        "Nations",
        "Jews",
      ],
    ),
    passage(
      "two-accounts-of-arrival",
      t("Two Accounts of Arrival", "关于抵达的两种叙述"),
      `The two short accounts below describe the same kind of event, the arrival of a child refugee in Britain in 1939. Both were written for this lesson, one in the style of a memoir and one in the style of a report.

The memoir: "I was ten when the train carried me across Germany to the sea. My mother had sewn my name onto every piece of my clothing, and she ran beside the carriage until she could not keep up. On the ship, I was sick the whole night. In London, at a big station full of smoke, a lady I had never met held up a card with my name on it. She smelled of soap and pipe tobacco. I did not know a single word of English except 'thank you,' so I said it to her again and again. I never saw my mother again."

The report: "Between December 1938 and September 1939, the rescue effort later known as the Kindertransport brought about ten thousand children, most of them Jewish, from Germany, Austria and Czechoslovakia to Britain. The British government allowed the children to enter without visas, but their parents were not admitted. Volunteer organizations found foster families and paid a guarantee for each child's care. Most of the children never saw their parents again."

Each account does something the other cannot. The report gives the facts: dates, numbers, places and the government's decision. It tells us how large the event was and why it happened. The memoir shows us what it felt like to one child: the name tags, the mother running beside the train, the stranger's smell, the only English words she knew. Historians use both kinds of sources. A report without memoirs can seem cold, and a memoir without reports can be hard to place in the larger story.`,
      [migrationWords, newLifeWords, diplomacyWords, memoirAndReport, academic1],
      [
        ask(
          t("Which information appears in the report but not in the memoir?", "哪些信息出现在报告中而没有出现在回忆录中？"),
          t("The number of children and the dates of the rescue", "儿童的人数和救援的日期"),
          [
            t("The smell of the lady at the station", "车站那位女士身上的气味"),
            t("The mother running beside the train", "母亲在火车旁边奔跑"),
            t("The only English words the child knew", "孩子唯一会说的英语单词"),
          ],
          t(
            "The report gives dates, numbers and places, such as about ten thousand children between December 1938 and September 1939; the other details come from the memoir.",
            "报告给出了日期、人数和地点，比如1938年12月至1939年9月间约一万名儿童；其他细节来自回忆录。",
          ),
        ),
        ask(
          t("What does the memoir show that the report cannot?", "回忆录展现了什么是报告无法展现的？"),
          t("What the experience felt like to one child", "这段经历对一个孩子来说是什么感受"),
          [
            t("Why the British government made its decision", "英国政府为什么作出那个决定"),
            t("How many children were rescued", "有多少儿童获救"),
            t("Which countries the children came from", "这些孩子来自哪些国家"),
          ],
          t(
            "The last paragraph says the memoir shows what it felt like to one child, through personal details such as the name tags and the stranger's smell.",
            "最后一段说回忆录通过名字标签、陌生人的气味等个人细节，展现了一个孩子的感受。",
          ),
        ),
        ask(
          t("Why do historians use both kinds of sources?", "为什么历史学家两种资料都使用？"),
          t(
            "Reports place events in the larger story, and memoirs show the human experience",
            "报告把事件放在更大的背景中，回忆录则展现人的亲身经历",
          ),
          [
            t("Memoirs are always more accurate than reports", "回忆录总是比报告更准确"),
            t("Reports are always more interesting than memoirs", "报告总是比回忆录更有趣"),
            t("Both kinds of sources give exactly the same information", "两种资料提供的信息完全一样"),
          ],
          t(
            "The passage ends by saying a report without memoirs can seem cold and a memoir without reports can be hard to place in the larger story.",
            "文章结尾说没有回忆录的报告会显得冷冰冰，而没有报告的回忆录则难以放进更大的历史背景中。",
          ),
        ),
      ],
      [
        "Britain",
        "Germany",
        "London",
        "English",
        "December",
        "September",
        "Kindertransport",
        "Jewish",
        "Austria",
        "Czechoslovakia",
        "British",
      ],
    ),
    passage(
      "money-sent-home",
      t("Money Sent Home", "寄回家的钱"),
      `Every month, a nurse from the Philippines working in a hospital in Dubai sends part of her pay to her parents in Manila. A construction worker from Mexico living in Texas sends money to his wife and children in a village in Oaxaca. A taxi driver in London sends money to his brothers in Bangladesh to help them pay for school. These payments are called remittances, and together they are one of the largest flows of money in the world.

According to the World Bank, migrants sent more than six hundred and fifty billion dollars to low- and middle-income countries in 2023. That is more than these countries received in foreign aid and in some years more than they received from foreign businesses. In a few countries, such as Tonga and Tajikistan, remittances are equal to more than a third of the whole economy.

Remittances change lives. Families use them to buy food, pay doctors and send children to school. Some build houses or start small businesses. Because the money goes straight to families, it often reaches people that government aid misses. In hard times, such as after a hurricane or an earthquake, migrants often send more, not less.

But remittances also have costs. Sending money across borders can be expensive, and fees have sometimes taken a tenth of each payment. Families can come to depend on money that may stop if the migrant loses a job. And the money is earned through separation. Many migrants spend years apart from their children, seeing them only on a phone screen.

For millions of people around the world, the diaspora is not a distant community. It is a mother working in another country, and the money she sends is a way of being present in a home she cannot visit.`,
      [newLifeWords, migrationWords],
      [
        ask(
          t("How does the author open the passage?", "作者如何开始这篇文章？"),
          t("With three examples of migrants sending money to their families", "用三个移民给家人寄钱的例子"),
          [
            t("With a definition from a dictionary", "用一个词典里的定义"),
            t("With a story about a hurricane", "用一个关于飓风的故事"),
            t("With a list of the fees for sending money", "用一份寄钱费用的清单"),
          ],
          t(
            "The first paragraph describes a nurse, a construction worker and a taxi driver before naming the payments remittances.",
            "第一段先描述了一位护士、一名建筑工人和一位出租车司机，然后才把这些款项称为侨汇。",
          ),
        ),
        ask(
          t("Which fact best shows how large remittances are?", "哪个事实最能说明侨汇的规模之大？"),
          t("They are more than low- and middle-income countries receive in foreign aid", "它们超过了中低收入国家获得的外国援助"),
          [
            t("A nurse sends part of her pay every month", "一位护士每个月寄出部分工资"),
            t("Migrants often send more after a hurricane", "飓风之后移民往往寄得更多"),
            t("Fees can take a tenth of each payment", "手续费可能占到每笔款项的十分之一"),
          ],
          t(
            "The second paragraph compares remittances with all the foreign aid these countries receive, which shows their scale across the world.",
            "第二段把侨汇与这些国家获得的全部外国援助相比较，显示了侨汇在全世界的规模。",
          ),
        ),
        ask(
          t("Which is a cost of remittances named in the fourth paragraph?", "第四段提到了侨汇的哪一项代价？"),
          t("Migrants spend years apart from their children", "移民多年与孩子分离"),
          [
            t("Families use the money to send children to school", "家庭用这笔钱送孩子上学"),
            t("The money reaches people government aid misses", "这笔钱能到达政府援助覆盖不到的人"),
            t("Some families start small businesses", "一些家庭开办了小生意"),
          ],
          t(
            "The fourth paragraph says the money is earned through separation, with many migrants spending years apart from their children; the other choices are benefits.",
            "第四段说这笔钱是以分离为代价挣来的，许多移民多年与孩子分开；其他选项是好处。",
          ),
        ),
      ],
      ["Philippines", "Dubai", "Manila", "Mexico", "Texas", "Oaxaca", "London", "Bangladesh", "World", "Bank", "Tonga", "Tajikistan"],
    ),
    passage(
      "between-two-languages",
      t("Between Two Languages", "在两种语言之间"),
      `This is part of an oral history recorded by a student for a school project. The speaker, Amira, is seventeen. She moved from Syria to Germany with her family when she was eleven, and later to Canada. The recording has been lightly edited for length.

Q: What was the hardest part of the first year?

Amira: Being quiet. In Syria, I was the girl who always had her hand up. In Germany, I sat at the back and understood nothing. I felt like I had become a different person, a smaller one. My teacher gave me picture books for little children, and I was so embarrassed that I hid them in my bag.

Q: How did you learn the language?

Amira: Television, mostly. Cartoons, then the news. And a girl in my class named Lena. She drew pictures for me when I didn't understand, and she never laughed at my mistakes. By the second year, I was translating for my parents at the doctor's and at the bank. That was strange, being the one who explains things to your parents.

Q: Do you feel at home now?

Amira: (pause) Sometimes I feel like I belong to three places and to none of them. When I visit my cousins in Turkey, they say my Arabic sounds foreign. Here, people ask where I'm really from. But I've stopped thinking that I have to pick one identity. I dream in three languages. That's not a problem. That's a gift.

Q: What would you tell a newcomer who just arrived?

Amira: That the quiet doesn't last. You're still yourself, even when you can't say it yet.`,
      [newLifeWords, migrationWords, oralHistory],
      [
        ask(
          t('Why does the introduction say the recording "has been lightly edited"?', "为什么介绍中说录音“经过了少量编辑”？"),
          t(
            "To tell readers that some parts were shortened, so they know it is not the full recording",
            "告诉读者有些部分被删减了，让他们知道这不是完整的录音",
          ),
          [
            t("To show that Amira wrote her own answers", "表明阿米拉的回答是她自己写的"),
            t("To explain why Amira moved to Canada", "解释阿米拉为什么搬到加拿大"),
            t("To prove that every word is exactly as spoken", "证明每个字都与原话一模一样"),
          ],
          t(
            'A reader of an oral history should know how it was recorded and changed; "lightly edited for length" means some parts were cut.',
            "口述历史的读者应该知道它是如何记录和修改的；“为篇幅作了少量编辑”意味着有些部分被删掉了。",
          ),
        ),
        ask(
          t('What does Amira mean when she says she had become "a smaller one"?', "阿米拉说自己变成了“一个更渺小的人”是什么意思？"),
          t("Without the language, she could no longer show who she really was", "因为不会说那门语言，她无法再表现出真正的自己"),
          [
            t("She had lost weight after the journey", "旅途之后她瘦了"),
            t("She was the youngest student in the class", "她是班上年龄最小的学生"),
            t("She was given a smaller desk at school", "她在学校分到了一张更小的课桌"),
          ],
          t(
            "She contrasts the girl who always had her hand up in Syria with the girl who sat silent at the back in Germany, understanding nothing.",
            "她把在叙利亚总是举手的女孩，与在德国坐在后排、什么也听不懂、默不作声的女孩进行对比。",
          ),
        ),
        ask(
          t(
            "How does Amira's view of her identity change by the end of the interview?",
            "到采访结束时，阿米拉对自己身份的看法有什么变化？",
          ),
          t(
            "She no longer feels she must choose one, and sees her languages as a gift",
            "她不再觉得必须选择其一，并把她的多种语言视为一份礼物",
          ),
          [
            t("She decides that she is only Syrian", "她认定自己只是叙利亚人"),
            t("She wishes she spoke only one language", "她希望自己只会说一种语言"),
            t("She plans to move back to Germany", "她打算搬回德国"),
          ],
          t(
            "She says she has stopped thinking she has to pick one identity and calls dreaming in three languages a gift.",
            "她说自己不再认为必须选择一种身份，并把用三种语言做梦称为一份礼物。",
          ),
        ),
      ],
      ["Amira", "Syria", "Germany", "Canada", "Lena", "Turkey", "Arabic", "Q", "Syrian"],
    ),
  ],
};
