// Grades 6 to 8: the reading unit of the third theme, ancient Rome, from its founding legend to the end of the
// empire in the west.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "./reading-kit.ts";

const clues = { topic: "context-clues", weight: 0.2 } as const;
const romeWords = { topic: "words-of-ancient-rome", weight: 0.3 } as const;
const sources = { topic: "primary-and-secondary-sources", weight: 0.2 } as const;
const structures = { topic: "text-structures", weight: 0.2 } as const;

/** ancientRome is a reading unit of grades 6 to 8 on the history, government and daily life of ancient Rome. */
export const ancientRome: ReadingUnitDef = {
  id: "ancient-rome",
  title: t("Ancient Rome", "古罗马"),
  passages: [
    passage(
      "the-founding-of-rome",
      t("The Legend of the Founding", "罗马建城的传说"),
      `Every great city has a story about how it began, and the Romans told one of the most dramatic. According to their legend, twin baby boys named Romulus and Remus were born to a princess and the god of war. A jealous king, afraid that the twins would one day take his throne, ordered them to be thrown into the Tiber River.

But the basket that held the babies did not sink. It floated downstream and came to rest on the muddy bank, where a she-wolf found the crying boys. Instead of harming them, she fed them with her own milk. Later, a shepherd discovered the twins and raised them as his own sons.

When Romulus and Remus grew up, they learned who they really were. They defeated the jealous king and decided to build a new city near the place where the wolf had saved them. However, the brothers could not agree on which hill to build on. They quarreled bitterly, and in the fight that followed, Romulus killed Remus. Romulus became the first king of the city and named it Rome, after himself. The Romans later said this happened in 753 BCE.

Historians do not believe the legend is true. Archaeologists have found that people lived in small villages on Rome's hills long before that date. Still, the story mattered to the Romans. A statue of the wolf feeding the twins became a symbol of the city, and it reminded Romans that their people were tough, fierce and favored by the gods.`,
      [clues, romeWords, sources],
      [
        ask(
          t("Why did the jealous king order the twins thrown into the river?", "嫉妒的国王为什么下令把双胞胎扔进河里？"),
          t("He feared they would take his throne", "他担心他们将来会夺走他的王位"),
          [
            t("He wanted to test the river god", "他想考验河神"),
            t("The twins had been cruel to him", "双胞胎对他很残忍"),
            t("The she-wolf had asked him to", "母狼要求他这么做"),
          ],
          t(
            "The first paragraph says the king was afraid the twins would one day take his throne.",
            "第一段说，国王担心双胞胎将来有一天会夺走他的王位。",
          ),
          [
            t("A river god is never mentioned. The king feared for his throne.", "文中从没提到河神。国王担心的是自己的王位。"),
            t("The twins were babies. They had done nothing to him.", "双胞胎还是婴儿，并没有对他做过什么。"),
            t("The she-wolf found the twins later. She did not speak to the king.", "母狼是后来才发现双胞胎的，她没有和国王说话。"),
          ],
        ),
        ask(
          t("What do archaeologists' findings show about the legend?", "考古学家的发现说明了这个传说的什么？"),
          t(
            "People lived on Rome's hills before 753 BCE, so the legend is not literally true",
            "公元前753年之前人们就住在罗马的山丘上，所以这个传说并非事实",
          ),
          [
            t("The she-wolf really existed", "那只母狼确实存在过"),
            t("Romulus built the city alone", "罗慕路斯独自建造了这座城市"),
            t("No one lived near the Tiber until much later", "很久以后台伯河附近才有人居住"),
          ],
          t(
            "The last paragraph says archaeologists found villages on the hills long before that date, so historians do not believe the legend.",
            "最后一段说，考古学家发现那个年代之前很久山丘上就有村落，所以历史学家并不相信这个传说。",
          ),
          [
            t("Archaeology does not prove the she-wolf. The finds are about villages.", "考古并不能证明母狼存在。发现的是村落。"),
            t("Building alone is part of the legend, not what the finds show.", "独自建城是传说的内容，不是考古发现的结论。"),
            t("The finds show the opposite: people lived there before 753 BCE.", "发现正好相反：公元前753年之前就有人住在那里。"),
          ],
        ),
        ask(
          t("Why did the legend matter to the Romans, even if it was not true?", "即使这个传说不是真的，它为什么对罗马人很重要？"),
          t("It showed them as a tough people favored by the gods", "它把罗马人描绘成受众神眷顾的坚强民族"),
          [
            t("It told them the exact date of every event", "它告诉他们每件事的确切日期"),
            t("It taught them how to raise wolves", "它教他们怎样养狼"),
            t("It explained how the Tiber River formed", "它解释了台伯河是怎样形成的"),
          ],
          t(
            "The last paragraph says the story reminded Romans that their people were tough, fierce and favored by the gods.",
            "最后一段说，这个故事提醒罗马人，他们的民族坚强、勇猛，并受到众神的眷顾。",
          ),
          [
            t("The legend gives one date, 753 BCE, not the date of every event.", "传说只给了一个日期：公元前753年，不是每件事的日期。"),
            t("Raising wolves is not the lesson. The wolf is a symbol.", "养狼不是传说的意义。狼是一个象征。"),
            t("The river is part of the story, not explained by it.", "河流只是故事的一部分，传说并不解释它的形成。"),
          ],
        ),
        ask(
          t("Who first fed the twins after their basket floated ashore?", "篮子漂到岸边后，最先喂养双胞胎的是谁？"),
          t("A she-wolf", "一只母狼"),
          [t("A shepherd", "一个牧羊人"), t("The jealous king", "那位嫉妒的国王"), t("The god of war", "战神")],
          t("A she-wolf found the crying boys and fed them with her own milk.", "一只母狼发现了哭着的孩子，用自己的奶喂养他们。"),
          [
            t("The shepherd came later and raised them.", "牧羊人是后来才收养他们的。"),
            t("The king wanted them dead.", "国王想让他们死。"),
            t("The god of war was their father, but he did not feed them.", "战神是他们的父亲，但没有喂养他们。"),
          ],
        ),
      ],
      ["Romans", "Romulus", "Remus", "Tiber", "Rome", "Rome's", "BCE"],
    ),
    passage(
      "the-roman-republic",
      t("The Republic", "罗马共和国"),
      `For about two hundred and fifty years, Rome was ruled by kings. The last of them, known as Tarquin the Proud, was so cruel that the people finally rose up and drove him out of the city, around 509 BCE. The Romans swore that they would never again be ruled by a king. Instead, they created a new kind of government, which they called a republic.

The word comes from the Latin words res publica, meaning "the public thing" or "the people's business." In a republic, the government belongs to the citizens, who choose their leaders by voting. This was a very different idea from rule by a single king who held power for life and passed it on to his son.

Not everyone in Rome had an equal voice, however. At first, power was held mostly by wealthy families called patricians. The ordinary citizens, called plebeians, were farmers, shopkeepers and workers. They made up most of the population, but they had little say in the government. Over many years, the plebeians struggled for more rights. At times they even refused to work or fight until their demands were met. Slowly, they won the right to hold office, to have their own leaders and to see the laws written down so that everyone could know them.

The Roman Republic lasted for nearly five hundred years. Its ideas, such as elected leaders, written laws and the belief that no one should hold too much power, later inspired the people who wrote the constitutions of many modern nations.`,
      [clues, romeWords, structures],
      [
        ask(
          t("Why did the Romans decide to stop having kings?", "罗马人为什么决定不再要国王？"),
          t("The last king was so cruel that the people drove him out", "最后一位国王太残暴，人们把他赶走了"),
          [
            t("The king died without a son", "国王死时没有儿子"),
            t("Another city conquered Rome", "另一座城市征服了罗马"),
            t("The gods ordered them to", "众神命令他们这样做"),
          ],
          t(
            "The first paragraph says Tarquin the Proud was so cruel that the people rose up and drove him out, then swore never to have a king again.",
            "第一段说，“傲慢者”塔克文太残暴，人们起来把他赶出城，并发誓再也不要国王。",
          ),
          [
            t("The king was driven out, not dead without a son.", "国王是被赶走的，不是死后无子。"),
            t("No conquest is mentioned. The people rose up themselves.", "文中没提被征服。是人民自己起来反抗。"),
            t("The gods did not order it. The people swore it.", "不是神下令，而是人民发誓。"),
          ],
        ),
        ask(
          t('What does "res publica" mean?', "“res publica”是什么意思？"),
          t("The people's business", "人民的事务"),
          [t("The king's command", "国王的命令"), t("The rich families", "富有的家族"), t("The city's walls", "城市的城墙")],
          t(
            'The second paragraph says the words mean "the public thing" or "the people\'s business."',
            "第二段说，这个词的意思是“公共的事物”或“人民的事务”。",
          ),
          [
            t("A king's command is what the republic replaced.", "国王的命令正是共和国要取代的。"),
            t("The rich families were patricians, not the meaning of the words.", "富裕家族是贵族，不是这个词的意思。"),
            t("Walls are never mentioned.", "文中从没提到城墙。"),
          ],
        ),
        ask(
          t("How did the plebeians gain more rights?", "平民是怎样获得更多权利的？"),
          t("By struggling for them over many years, at times refusing to work or fight", "多年抗争，有时拒绝劳动或作战"),
          [
            t("By paying the patricians", "向贵族付钱"),
            t("By choosing a new king", "选出一位新国王"),
            t("By leaving Rome forever", "永远离开罗马"),
          ],
          t(
            "The third paragraph says the plebeians struggled for many years and at times refused to work or fight until their demands were met.",
            "第三段说，平民抗争了许多年，有时拒绝劳动或作战，直到他们的要求得到满足。",
          ),
          [
            t("Paying the patricians is never mentioned.", "文中从没提到给贵族付钱。"),
            t("Choosing a king is the opposite. Romans swore never to have one.", "选国王正好相反。罗马人发誓不再要国王。"),
            t("They did not leave Rome forever. They refused to work or fight.", "他们没有永远离开罗马，而是拒绝工作或打仗。"),
          ],
        ),
        ask(
          t("Who held most of the power in the Republic at first?", "共和国早期大部分权力掌握在谁手里？"),
          t("Wealthy families called patricians", "叫作贵族的富有家族"),
          [t("The plebeians", "平民"), t("A single king", "一位国王"), t("The army", "军队")],
          t("At first, power was held mostly by wealthy families called patricians.", "起初，权力主要掌握在叫作贵族的富有家族手中。"),
          [
            t("The plebeians had little say at first.", "平民起初几乎没有发言权。"),
            t("The kings were gone by then.", "那时国王已经被赶走了。"),
            t("The army is not named as holding power.", "文中没说军队掌权。"),
          ],
        ),
      ],
      ["Rome", "Tarquin", "BCE", "Romans", "Latin", "res", "publica", "Roman", "Republic"],
    ),
    passage(
      "the-senate-and-the-consuls",
      t("The Senate and the Consuls", "元老院与执政官"),
      `How do you stop one person from becoming too powerful? The leaders of the Roman Republic answered this question with a careful system of checks.

At the top of the government were two consuls. They commanded the army, led the government and acted as judges in important cases. But there were always two of them, never one, and each consul could block the decisions of the other with a single word: veto, which means "I forbid." A consul also served for only one year. After that, he had to step down, and he could be put on trial for anything he had done wrong while in office.

The consuls were advised by the senate, a council of about three hundred men. Most senators had already served in high offices, and they kept their seats for life. The senate did not pass laws directly, but its advice carried enormous weight. It controlled the state's money, decided how to deal with other nations and could send armies to war. Because senators were experienced and served for so long, the senate was often the most powerful part of the government.

The citizens also had a role. They met in assemblies, where they elected the consuls and other officials and voted on laws. In this way, power was divided among the consuls, the senate and the people.

In an emergency, however, the Romans could appoint a dictator, a single leader with almost complete power. To keep this power from being abused, a dictator could rule for no more than six months.`,
      [clues, romeWords, structures],
      [
        ask(
          t("Why did the Republic have two consuls instead of one?", "为什么共和国有两位执政官而不是一位？"),
          t("So that each could block the other and neither had too much power", "这样两人可以互相制约，谁都不会权力过大"),
          [
            t("Because the army was too large for one person", "因为军队太大，一个人管不过来"),
            t("Because one consul was always away at war", "因为总有一位执政官在外打仗"),
            t("Because the senate could not agree on one", "因为元老院无法就一个人选达成一致"),
          ],
          t(
            "The first two paragraphs explain that the system was designed to stop one person from becoming too powerful: each consul could veto the other.",
            "前两段解释说，这个制度是为了防止一个人权力过大：每位执政官都可以否决另一位。",
          ),
          [
            t("The army's size is not the reason given.", "军队规模不是文中给的原因。"),
            t("Being away at war is not mentioned.", "文中没提一个执政官总是在外打仗。"),
            t("The senate advised. It did not fail to choose.", "元老院只是提供建议，不是选不出一个人。"),
          ],
        ),
        ask(
          t('What does the word "veto" mean?', "“veto”这个词是什么意思？"),
          t("I forbid", "我禁止"),
          [t("I agree", "我同意"), t("I command the army", "我指挥军队"), t("I step down", "我辞职")],
          t('The second paragraph says veto means "I forbid."', "第二段说，veto 的意思是“我禁止”。"),
          [
            t("Agreeing is the opposite of forbidding.", "同意和禁止正好相反。"),
            t("Commanding the army is a consul's job, not the word's meaning.", "指挥军队是执政官的职责，不是这个词的意思。"),
            t("Stepping down came after one year. Veto blocks a decision.", "卸任是一年后的事。否决是阻止决定。"),
          ],
        ),
        ask(
          t("How did the Romans limit the power of a dictator?", "罗马人怎样限制独裁官的权力？"),
          t("A dictator could rule for no more than six months", "独裁官的任期不得超过六个月"),
          [
            t("A dictator needed the votes of both consuls each day", "独裁官每天都需要两位执政官投票同意"),
            t("A dictator could not command the army", "独裁官不能指挥军队"),
            t("A dictator was chosen by lottery", "独裁官由抽签选出"),
          ],
          t(
            "The last paragraph says that to keep the power from being abused, a dictator could rule for no more than six months.",
            "最后一段说，为了防止权力被滥用，独裁官的任期不得超过六个月。",
          ),
          [
            t("Daily votes of both consuls are never mentioned.", "文中从没提到每天要两位执政官投票。"),
            t("A dictator had almost complete power, including the army.", "独裁官几乎拥有全部权力，包括军队。"),
            t("A lottery is not how a dictator was chosen here.", "这里独裁官不是抽签选出的。"),
          ],
        ),
        ask(
          t("How long did a consul serve?", "执政官任期多长？"),
          t("Only one year", "只有一年"),
          [t("For life", "终身"), t("Six months", "六个月"), t("Ten years", "十年")],
          t("A consul served for only one year and then had to step down.", "执政官只任职一年，然后必须卸任。"),
          [
            t("For life is how long senators served.", "终身任职的是元老。"),
            t("Six months is the limit for a dictator.", "六个月是独裁官的期限。"),
            t("Ten years is never mentioned.", "文中从没提到十年。"),
          ],
        ),
      ],
      ["Roman", "Republic", "Romans"],
    ),
    passage(
      "roads-of-the-empire",
      t("All Roads Lead to Rome", "条条大路通罗马"),
      `People still say that "all roads lead to Rome," and in ancient times, this was almost true. At its height, the Roman Empire was connected by more than fifty thousand miles of paved roads, stretching from Britain in the north to Egypt in the south.

The Romans did not build these roads for travelers' comfort. They built them, above all, for the army. A legion could march about twenty miles a day on a good road, so soldiers could reach trouble at the edge of the empire quickly. Roads also carried messengers, traders, tax collectors and, eventually, ordinary travelers.

Roman engineers planned their roads to be as straight as possible, cutting through hills and building bridges across rivers rather than winding around them. To build a road, workers first dug a trench. They filled it with layers: large stones at the bottom, then smaller stones mixed with lime, then gravel. On top they set large, flat paving stones, fitted together tightly. The surface was curved so that rainwater would run off into ditches at the sides.

Along the main roads, stone pillars called milestones marked each Roman mile, and every so often there were inns where travelers could rest and change their horses. The most famous road, the Appian Way, was begun in 312 BCE and ran south from Rome for more than three hundred miles.

These roads were so well built that some of them are still used today, more than two thousand years later.`,
      [clues, romeWords, structures],
      [
        ask(
          t("What was the main reason the Romans built their roads?", "罗马人修路的主要原因是什么？"),
          t("To move the army quickly", "让军队能迅速调动"),
          [
            t("To make travelers comfortable", "让旅行者舒适"),
            t("To mark the borders of the empire", "标出帝国的边界"),
            t("To give workers jobs", "给工人提供工作"),
          ],
          t(
            "The second paragraph says the Romans built the roads above all for the army, so soldiers could reach trouble quickly.",
            "第二段说，罗马人修路首先是为了军队，让士兵能迅速到达出事的地方。",
          ),
          [
            t("Comfort is what the Romans did not build them for.", "罗马人修路正不是为了舒适。"),
            t("Borders are not why roads were built.", "修路不是为了标明边界。"),
            t("Jobs for workers are not mentioned.", "文中没提为工人提供工作。"),
          ],
        ),
        ask(
          t("Why was the surface of a Roman road curved?", "罗马道路的路面为什么是弧形的？"),
          t("So that rainwater would run off into ditches", "让雨水流进路边的沟里"),
          [
            t("So that chariots could turn more easily", "让战车更容易转弯"),
            t("So that the road looked like a bridge", "让道路看起来像桥"),
            t("So that milestones could be placed on top", "便于在上面放置里程碑"),
          ],
          t(
            "The third paragraph says the surface was curved so that rainwater would run off into ditches at the sides.",
            "第三段说，路面做成弧形，是为了让雨水流进两侧的沟里。",
          ),
          [
            t("Turning chariots is not mentioned.", "文中没提战车转弯。"),
            t("The road is not shaped to look like a bridge.", "路面并不是为了像桥。"),
            t("Milestones stood along the roads, not on the curve.", "里程碑立在路边，不在路面上。"),
          ],
        ),
        ask(
          t("How is the third paragraph mainly organized?", "第三段主要是怎样组织的？"),
          t("As the steps of a process, in order", "按顺序写出一个过程的步骤"),
          [
            t("As a comparison of two roads", "比较两条道路"),
            t("As a problem and its solution", "一个问题及其解决办法"),
            t("As a list of famous roads", "列举著名的道路"),
          ],
          t(
            "The paragraph tells how a road was built step by step: first a trench, then layers of stone, then paving stones on top.",
            "这一段一步步讲述道路的修建方法：先挖沟，再铺几层石料，最后在上面铺石板。",
          ),
          [
            t("Only one way of building is described, not two roads.", "只描述了一种修路方法，没比较两条路。"),
            t("It describes how to build, not a problem and its fix.", "它讲怎么修路，不是问题和解决方法。"),
            t("The famous road is in the next paragraph.", "那条著名的路在下一段。"),
          ],
        ),
        ask(
          t("When was the Appian Way begun?", "阿庇亚大道是哪一年开始修的？"),
          t("In 312 BCE", "公元前312年"),
          [t("In 753 BCE", "公元前753年"), t("In 79 CE", "公元79年"), t("In 509 BCE", "公元前509年")],
          t("The Appian Way was begun in 312 BCE.", "阿庇亚大道始建于公元前312年。"),
          [
            t("753 BCE is the legendary founding of Rome.", "公元前753年是传说中罗马建城的年份。"),
            t("79 CE is when Vesuvius erupted.", "公元79年是维苏威火山喷发的年份。"),
            t("509 BCE is when the last king was driven out.", "公元前509年是最后一位国王被赶走的年份。"),
          ],
        ),
      ],
      ["Rome", "Roman", "Empire", "Britain", "Egypt", "Romans", "Appian", "BCE"],
    ),
    passage(
      "aqueducts",
      t("Water for a City of a Million", "供百万人用水的城市"),
      `By the first century CE, the city of Rome was home to about a million people. Feeding them was a challenge, but giving them water was an even greater one. The Tiber River was dirty, and there were not enough wells. The Romans' solution was the aqueduct, a channel that carried fresh water from springs in the distant hills into the city.

The first aqueduct was built in 312 BCE, and by the third century CE, Rome had eleven of them. Together, they brought in more water per person each day than many modern cities supply.

The aqueducts used no pumps. Instead, they relied entirely on gravity. Engineers planned each route so that the channel sloped gently downhill the whole way, sometimes for more than fifty miles. The slope had to be just right: too steep, and the water would rush and wear the channel away; too gentle, and it would stop flowing.

Most people picture aqueducts as rows of tall stone arches. In fact, most of each aqueduct ran underground, where the water stayed cool and clean and was safe from enemies. The famous arches were built only where the channel had to cross a valley.

When the water reached the city, it flowed into large tanks and then through pipes to public fountains, baths and the homes of wealthy citizens. Ordinary Romans collected water from the fountains, which ran day and night. Some Roman aqueducts still stand today, and one in Rome still carries water to the city's fountains.`,
      [clues, romeWords, structures],
      [
        ask(
          t("What problem did the aqueducts solve?", "引水渠解决了什么问题？"),
          t("Rome did not have enough clean water", "罗马没有足够的干净水"),
          [
            t("Rome flooded every spring", "罗马每年春天都会发洪水"),
            t("Rome had too many wells", "罗马的井太多了"),
            t("Rome's roads were too steep", "罗马的道路太陡"),
          ],
          t(
            "The first paragraph says the river was dirty and there were not enough wells, so aqueducts brought fresh water from the hills.",
            "第一段说，河水很脏，井也不够，所以人们用引水渠从山里引来淡水。",
          ),
          [
            t("Floods are never mentioned.", "文中从没提到洪水。"),
            t("There were not enough wells.", "水井是不够的。"),
            t("Steep roads are not part of this passage.", "陡峭的道路与这篇文章无关。"),
          ],
        ),
        ask(
          t("How did aqueducts move water without pumps?", "引水渠不用水泵怎样输水？"),
          t("The channels sloped gently downhill so gravity moved the water", "水渠缓缓向下倾斜，靠重力让水流动"),
          [
            t("Slaves carried the water in jars", "奴隶用罐子运水"),
            t("Wind pushed the water along", "风推动水流"),
            t("The arches lifted the water up", "拱门把水抬高"),
          ],
          t(
            "The third paragraph says the aqueducts relied entirely on gravity, with each channel sloping gently downhill.",
            "第三段说，引水渠完全依靠重力，每条水渠都缓缓向下倾斜。",
          ),
          [
            t("Slaves carrying jars are never mentioned.", "文中从没提到奴隶用罐子运水。"),
            t("Wind is not mentioned.", "文中没提风。"),
            t("The arches only crossed valleys. They did not lift water.", "拱只是跨越山谷，不能把水抬高。"),
          ],
        ),
        ask(
          t("According to the passage, which common belief about aqueducts is wrong?", "根据文章，关于引水渠的哪个常见看法是错误的？"),
          t("That they were mostly tall stone arches", "认为它们大多是高大的石拱"),
          [
            t("That they carried water to Rome", "认为它们把水运到罗马"),
            t("That they were built by the Romans", "认为它们是罗马人建造的"),
            t("That some still stand today", "认为其中一些至今还在"),
          ],
          t(
            "The fourth paragraph says most people picture rows of arches, but in fact most of each aqueduct ran underground.",
            "第四段说，大多数人想象的是一排排拱门，但实际上每条引水渠的大部分都在地下。",
          ),
          [
            t("Carrying water to Rome is true.", "把水送到罗马是真的。"),
            t("The Romans did build them.", "它们确实是罗马人建的。"),
            t("Some still stand, the passage says.", "文中说有些至今仍在。"),
          ],
        ),
        ask(
          t("How many aqueducts did Rome have by the third century CE?", "到公元三世纪，罗马有多少条渡槽？"),
          t("Eleven", "十一条"),
          [t("One", "一条"), t("Fifty", "五十条"), t("Three hundred", "三百条")],
          t("By the third century CE, Rome had eleven aqueducts.", "到公元三世纪，罗马共有十一条渡槽。"),
          [
            t("One was the first, in 312 BCE.", "一座是第一座，建于公元前312年。"),
            t("Fifty is the number of miles some routes ran.", "五十是某些水道的英里数。"),
            t("Three hundred is not about aqueducts.", "三百与引水渠无关。"),
          ],
        ),
      ],
      ["CE", "Rome", "Tiber", "Romans", "Romans'", "BCE", "Roman"],
    ),
    passage(
      "a-day-in-pompeii",
      t("A Day in Pompeii", "庞贝的一天"),
      `On the morning of August 24 in the year 79 CE, the town of Pompeii woke up like any other day. Bakers pulled loaves of bread from their ovens. Shopkeepers opened their doors onto the busy streets, where carts rattled over the paving stones. In the forum, people bought fish and vegetables and talked about the coming elections; painted slogans on the walls urged them to vote for one candidate or another.

Above the town rose Mount Vesuvius, green with vineyards. Few people knew it was a volcano. There had been earthquakes in the area for years, but no one connected them with the mountain.

Around midday, Vesuvius exploded. A huge cloud of ash and stone shot miles into the sky and spread out like the top of a pine tree. Soon, small stones began to rain down on Pompeii. Roofs collapsed under their weight. Many people fled, but others stayed, hiding in their homes and hoping the danger would pass. Early the next morning, clouds of burning gas and ash rushed down the mountain at enormous speed, and everyone who remained was killed.

We know about that day partly from a primary source. A young man named Pliny watched the eruption from across the bay, and years later he described it in two letters to a historian. His uncle had sailed toward the volcano to rescue people and died there.

Pompeii lay buried under deep ash for more than sixteen hundred years. Today, its streets, houses and paintings give us one of the clearest pictures of everyday Roman life.`,
      [clues, romeWords, sources, { topic: "academic-words-1", weight: 0.1 }],
      [
        ask(
          t("What does the first paragraph mainly show?", "第一段主要表现了什么？"),
          t("Pompeii was a busy, ordinary town on the morning of the eruption", "火山爆发那天早上，庞贝是一座繁忙而普通的小城"),
          [
            t("The people of Pompeii were preparing to flee", "庞贝人正准备逃离"),
            t("Vesuvius had already begun to erupt", "维苏威火山已经开始喷发"),
            t("The town had no forum or shops", "这个小城没有广场和商店"),
          ],
          t(
            "The first paragraph describes bakers, shopkeepers and people in the forum going about an ordinary day.",
            "第一段描写了面包师、店主和广场上的人们过着平常的一天。",
          ),
          [
            t("Nobody was preparing to flee that morning.", "那天早上没有人准备逃离。"),
            t("The eruption came around midday, after the morning scene.", "喷发发生在中午前后，在早晨的情景之后。"),
            t("The forum and shops are described in the paragraph.", "这一段就描写了广场和商店。"),
          ],
        ),
        ask(
          t("Why are Pliny's letters a primary source?", "为什么小普林尼的信是一手资料？"),
          t("He saw the eruption himself", "他亲眼目睹了火山喷发"),
          [
            t("He was a modern historian", "他是一位现代历史学家"),
            t("He lived in Pompeii all his life", "他一生都住在庞贝"),
            t("He wrote the letters before the eruption", "他在火山喷发之前写了这些信"),
          ],
          t(
            "A primary source comes from someone who was there. Pliny watched the eruption from across the bay and described what he saw.",
            "一手资料来自亲历者。小普林尼在海湾对岸目睹了喷发，并描述了他所看到的。",
          ),
          [
            t("Pliny lived then, not today.", "普林尼生活在当时，不是现代。"),
            t("He watched from across the bay, not from inside Pompeii.", "他是在海湾对岸看的，不是在庞贝城里。"),
            t("He wrote years after the eruption.", "他是在喷发多年后才写的。"),
          ],
        ),
        ask(
          t("Why do the ruins of Pompeii matter to historians today?", "庞贝遗址为什么对今天的历史学家很重要？"),
          t("They show everyday Roman life very clearly", "它们非常清楚地展现了罗马人的日常生活"),
          [
            t("They prove that volcanoes cannot be predicted", "它们证明火山无法预测"),
            t("They contain the only Roman letters", "里面有仅存的罗马信件"),
            t("They show how the town was rebuilt", "它们展示了小城是怎样重建的"),
          ],
          t(
            "The last paragraph says the streets, houses and paintings give one of the clearest pictures of everyday Roman life.",
            "最后一段说，那里的街道、房屋和壁画清楚地展现了罗马人的日常生活。",
          ),
          [
            t("Predicting volcanoes is not what the ruins show.", "遗址并不是用来说明火山能否预测的。"),
            t("Pliny's letters were not found in Pompeii.", "普林尼的信不是在庞贝发现的。"),
            t("The town was buried, not rebuilt.", "这座城被掩埋了，没有重建。"),
          ],
        ),
        ask(
          t("Why did roofs in Pompeii collapse?", "庞贝的屋顶为什么塌了？"),
          t("Under the weight of falling stones", "被落下的石块压塌"),
          [t("Because of a flood", "因为洪水"), t("Because of strong winds", "因为大风"), t("Because they were very old", "因为太旧")],
          t("Small stones began to rain down, and roofs collapsed under their weight.", "小石块像雨一样落下，屋顶被压塌了。"),
          [
            t("No flood is mentioned.", "文中没提洪水。"),
            t("Wind is not the cause given.", "风不是文中给的原因。"),
            t("The roofs' age is never mentioned.", "文中从没提到屋顶的年代。"),
          ],
        ),
      ],
      ["August", "CE", "Pompeii", "Vesuvius", "Pliny", "Roman"],
    ),
    passage(
      "the-colosseum",
      t("The Colosseum", "罗马斗兽场"),
      `In the center of Rome stands an enormous ruin, its broken walls rising in tiers of arches. It is the Colosseum, the largest amphitheater ever built in the ancient world. Construction began under the emperor Vespasian around 72 CE, and it was opened by his son Titus in 80 CE with a hundred days of games.

The Colosseum could hold about fifty thousand spectators. Entry was free, because emperors used the games to win the people's support. Seating followed strict rules: the emperor and senators sat closest to the arena, while poor citizens and women sat in the highest rows. Eighty entrances allowed the huge crowd to enter and leave quickly.

The shows were brutal. In the morning there were often animal hunts, with lions, bears and elephants brought from distant parts of the empire. In the afternoon came the gladiator fights. Gladiators were usually slaves, prisoners or poor men who hoped to win fame and money. Some became celebrities, and their names were scratched on walls across the city.

Beneath the wooden floor of the arena lay a maze of tunnels and cages. Workers used lifts and ropes to raise animals and scenery through trapdoors, so they seemed to appear by magic. On hot days, sailors stretched a giant canvas awning over the seats to give shade.

Over the centuries, earthquakes damaged the Colosseum, and people took away its stones to build other buildings. Yet it still stands, a symbol of both Rome's engineering genius and its taste for violent entertainment.`,
      [clues, romeWords, structures],
      [
        ask(
          t("Why was entry to the Colosseum free?", "为什么进斗兽场是免费的？"),
          t("Emperors used the games to win the people's support", "皇帝借这些表演赢得民众的支持"),
          [
            t("The gladiators paid for the tickets", "角斗士为门票付了钱"),
            t("The building had no doors", "这座建筑没有门"),
            t("Only senators were allowed in", "只有元老才能进去"),
          ],
          t(
            "The second paragraph says entry was free because emperors used the games to win the people's support.",
            "第二段说，入场免费，因为皇帝借这些表演赢得民众的支持。",
          ),
          [
            t("Gladiators did not pay for tickets.", "角斗士并不为门票付钱。"),
            t("It had eighty entrances.", "它有八十个入口。"),
            t("Poor citizens and women came too, in the highest rows.", "穷人和妇女也来，坐在最高的几排。"),
          ],
        ),
        ask(
          t("Who were most gladiators?", "大多数角斗士是什么人？"),
          t("Slaves, prisoners or poor men", "奴隶、囚犯或穷人"),
          [
            t("Senators and their sons", "元老及其儿子"),
            t("Soldiers of the emperor's guard", "皇帝卫队的士兵"),
            t("Sailors who worked the awning", "操作遮阳篷的水手"),
          ],
          t(
            "The third paragraph says gladiators were usually slaves, prisoners or poor men hoping for fame and money.",
            "第三段说，角斗士通常是奴隶、囚犯或希望成名发财的穷人。",
          ),
          [
            t("Senators were spectators, sitting close to the arena.", "元老是观众，坐在离竞技场最近的地方。"),
            t("The emperor's guard is not mentioned.", "文中没提皇帝的卫队。"),
            t("Sailors stretched the awning. They did not fight.", "水手负责撑遮阳篷，不参加角斗。"),
          ],
        ),
        ask(
          t("What two sides of Rome does the last sentence say the Colosseum stands for?", "最后一句说斗兽场象征了罗马的哪两个方面？"),
          t("Its engineering genius and its taste for violent entertainment", "它卓越的工程技术和对暴力娱乐的嗜好"),
          [
            t("Its wealth and its poverty", "它的富有和贫穷"),
            t("Its love of animals and its love of sailing", "它对动物和航海的热爱"),
            t("Its emperors and its gods", "它的皇帝和神祇"),
          ],
          t(
            "The final sentence calls the Colosseum a symbol of both Rome's engineering genius and its taste for violent entertainment.",
            "最后一句称斗兽场既象征罗马卓越的工程技术，也象征它对暴力娱乐的嗜好。",
          ),
          [
            t("Wealth and poverty are not what the sentence names.", "最后一句说的不是富有和贫穷。"),
            t("Animals were hunted there, and sailing is a side detail.", "动物是在那里被猎杀的，航海只是附带细节。"),
            t("Gods are not mentioned in the last sentence.", "最后一句没提到神。"),
          ],
        ),
      ],
      ["Rome", "Colosseum", "Vespasian", "CE", "Titus", "Rome's"],
    ),
    passage(
      "the-end-of-the-empire-in-the-west",
      t("The End of the Empire in the West", "西罗马帝国的终结"),
      `For centuries, the Roman Empire seemed too strong to fall. Yet in 476 CE, a Germanic leader named Odoacer removed the last emperor in the west, a teenage boy named Romulus Augustulus, and did not bother to replace him. Historians often use this date to mark the end of the Western Roman Empire. But the fall did not happen in a single day. It was the result of problems that had been building for two hundred years.

One problem was the size of the empire. Its borders stretched for thousands of miles, and defending them required huge armies that cost enormous amounts of money. To pay for them, emperors raised taxes, which made ordinary people poorer and angrier.

A second problem was weak leadership. In one fifty-year period of the third century, Rome had more than twenty emperors. Many were generals who seized power with the help of their soldiers and were then murdered by rivals.

A third problem came from outside. Groups of Germanic peoples, whom the Romans called barbarians, pressed against the borders, often because they themselves were fleeing from the Huns. Some settled inside the empire, and Rome began to hire them as soldiers. In 410 CE, one of these groups, the Visigoths, captured and looted the city of Rome itself.

Not all of the empire fell, however. In the east, the empire continued for nearly a thousand more years, with its capital at Constantinople, until that city fell in 1453.`,
      [clues, romeWords, structures, { topic: "academic-words-3", weight: 0.1 }],
      [
        ask(
          t(
            "Why do historians often choose 476 CE as the end of the Western Roman Empire?",
            "为什么历史学家常把公元476年定为西罗马帝国的终结？",
          ),
          t("That year, the last emperor in the west was removed and not replaced", "那一年，西部最后一位皇帝被废黜，且无人继位"),
          [
            t("That year, the Visigoths looted Rome", "那一年，西哥特人洗劫了罗马"),
            t("That year, Constantinople fell", "那一年，君士坦丁堡陷落"),
            t("That year, Rome had twenty emperors", "那一年，罗马有二十位皇帝"),
          ],
          t(
            "The first paragraph says Odoacer removed the last emperor in the west in 476 and did not replace him. The looting was in 410 and Constantinople fell in 1453.",
            "第一段说，奥多亚克在476年废黜了西部最后一位皇帝，且没有另立新君。洗劫罗马发生在410年，君士坦丁堡陷落于1453年。",
          ),
          [
            t("410 CE is when the Visigoths looted Rome.", "公元410年是西哥特人洗劫罗马的年份。"),
            t("Constantinople fell in 1453.", "君士坦丁堡在1453年陷落。"),
            t("Twenty emperors came in fifty years of the third century.", "二十位皇帝是在三世纪的五十年间。"),
          ],
        ),
        ask(
          t("How is the body of the passage mainly organized?", "文章的主体部分主要是怎样组织的？"),
          t("As a list of causes that led to an effect", "列出导致某个结果的几个原因"),
          [
            t("As a story told from one soldier's view", "从一名士兵的视角讲述的故事"),
            t("As a comparison of two cities", "比较两座城市"),
            t("As instructions for defending a border", "保卫边境的步骤说明"),
          ],
          t(
            "The passage gives a first, second and third problem, each a cause of the empire's fall.",
            "文章依次列出第一、第二和第三个问题，每一个都是帝国衰亡的原因。",
          ),
          [
            t("No single soldier tells the story.", "文中没有一个士兵在讲故事。"),
            t("It does not compare two cities.", "它没有比较两座城市。"),
            t("It explains causes, not how to defend a border.", "它解释原因，不是讲怎样守边。"),
          ],
        ),
        ask(
          t("Why did emperors raise taxes, according to the passage?", "根据文章，皇帝为什么要增加赋税？"),
          t("To pay for the armies that defended the long borders", "为了支付保卫漫长边境的军费"),
          [
            t("To build the Colosseum", "为了修建斗兽场"),
            t("To pay the Huns to leave", "为了花钱让匈人离开"),
            t("To make the people richer", "为了让人民更富有"),
          ],
          t(
            "The second paragraph says defending the borders required huge armies, and emperors raised taxes to pay for them.",
            "第二段说，保卫边境需要庞大的军队，皇帝为此增加了赋税。",
          ),
          [
            t("The Colosseum is in another passage.", "斗兽场在另一篇文章里。"),
            t("Paying the Huns is never mentioned.", "文中从没提到付钱给匈人。"),
            t("Taxes made people poorer, not richer.", "赋税让人们更穷，不是更富。"),
          ],
        ),
      ],
      [
        "Roman",
        "Empire",
        "CE",
        "Germanic",
        "Odoacer",
        "Romulus",
        "Augustulus",
        "Western",
        "Rome",
        "Romans",
        "Huns",
        "Visigoths",
        "Constantinople",
      ],
    ),
  ],
};
