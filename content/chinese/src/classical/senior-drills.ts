// The drills of classical language (文言) in senior secondary school (docs/chinese-curriculum.md §7): the function words
// 乃, 且, 若, 焉, 何 and 乎 in the required course, 因, 与, 则, 所, 也 and 者 in the selective required course, the
// kinds of classical sentence, words used as another part of speech, and words whose meaning has changed. Every sentence
// is from a classical text in the public domain; the meanings, the translations, the clues and the wrong answers are
// written for this subject. Grade 10 is the required course and grade 11 the selective required one.

import { type Text, t } from "@ga/content";

import type { ClassicalDrill } from "./drills.ts";
import { explained, type Usage, usage, usagePoint, wordPoint } from "./teach.ts";

const NAI: readonly Usage[] = [
  usage(
    "副词，于是、就",
    "“乃”接着前面的事情，引出随之而来的动作",
    "乃 carries on from what came before and brings in the action that follows from it",
  ),
  usage(
    "副词，竟然、却",
    "“乃”引出出乎意料、和常理相反的事，前后常有“今”“反”这样的字点明",
    "乃 brings in something against what one would expect, often with 今 or 反 nearby to show it",
  ),
  usage(
    "副词，是、就是",
    "“乃”连接两样东西，判断前者就是后者，句末常有“也”",
    "乃 links two things, judging that the first is the second, often with 也 at the end",
  ),
  usage(
    "代词，你、你的",
    "“乃”放在名词前面，指说话的对象，“乃翁”就是你的父亲",
    "乃 stands before a noun for the one spoken to: 乃翁 is your father",
  ),
];

const QIE: readonly Usage[] = [
  usage(
    "连词，尚且",
    "“且”在前一分句里，先说更难的情形也是这样，后面常有“况”“安”引出更进一层的反问",
    "且 is in the first clause, saying that even the harder case is so, and 况 or 安 often follows to ask about the easier one",
  ),
  usage(
    "副词，将要、将近",
    "“且”放在动词或数目前面，说事情快要发生，或者数目快要达到",
    "且 stands before a verb or a number: the thing is about to happen, or the number is nearly reached",
  ),
  usage("连词，而且、并且", "“且”连接两个并列的形容词或动作，两样同时具有", "且 joins two adjectives or actions that hold together"),
  usage(
    "副词，姑且、暂且",
    "“且”放在动作前面，说的是暂时这样做，带着将就、不得已或不急的意味",
    "且 stands before an action done for the time being, making do, unwillingly or with no hurry",
  ),
];

const RUO: readonly Usage[] = [
  usage(
    "连词，如果",
    "“若”在分句开头，提出一个假设，后面说出它的结果",
    "若 opens a clause that supposes something, and what follows says what comes of it",
  ),
  usage("动词，像、如同", "“若”后面跟着拿来打比方的事物，说前面的情形像它", "若 is followed by what something is likened to"),
  usage(
    "代词，你、你们",
    "“若”放在动词前作主语，或放在名词前，指说话的对象",
    "若 stands as the subject of a verb, or before a noun, for the one spoken to",
  ),
  usage(
    "连词，至于（若夫）",
    "“若”和“夫”连用在一段话开头，引出要说的另一种情形",
    "若 joins 夫 at the head of a passage, turning to another case",
  ),
];

const YAN: readonly Usage[] = [
  usage(
    "兼词，于此、在那里",
    "“焉”在句末，跟在动词后面，相当于“于此”，指前面说到的地方或事物",
    "焉 ends the sentence after a verb and stands for 于此, at or in it, pointing back to a place or thing named before",
  ),
  usage(
    "疑问代词，哪里、怎么",
    "“焉”放在动词前面发问，常是反问，问哪里或者怎么",
    "焉 stands before a verb and asks where or how, often rhetorically",
  ),
  usage(
    "语气词，表示陈述或疑问",
    "“焉”在句末，只表示陈述或疑问的语气，前面没有它能指的地方",
    "焉 at the end of a sentence only gives the tone of a statement or a question, and points back to no place",
  ),
  usage("词尾，……的样子", "“焉”跟在形容词或叠字后面，说的是……的样子", "焉 follows an adjective or a doubled word: looking so"),
];

const HE: readonly Usage[] = [
  usage(
    "疑问代词，什么",
    "“何”问的是事物，作动词的宾语，或放在名词前面",
    "何 asks about a thing, as the object of a verb or before a noun",
  ),
  usage("疑问代词，为什么、怎么", "“何”放在动词前面，问原因或方式", "何 stands before a verb and asks why or how"),
  usage("疑问代词，哪里", "“何”和“处”连用，问的是地方", "何 joins 处 to ask about a place"),
  usage(
    "副词，多么",
    "“何”放在形容词前面，不是发问，而是感叹程度之深",
    "何 stands before an adjective, not asking but exclaiming how much",
  ),
];

const HU: readonly Usage[] = [
  usage("语气词，表示疑问，吗", "“乎”在句末，提出真正的疑问，等对方回答", "乎 ends a real question, waiting for an answer"),
  usage(
    "语气词，表示反问，呢",
    "“乎”在句末，和“不亦”“宁”“况”这样的字配合，是反问，答案已在说话人心中",
    "乎 ends a rhetorical question with 不亦, 宁 or 况, whose answer the speaker already holds",
  ),
  usage(
    "语气词，表示感叹，啊",
    "“乎”跟在形容词或感叹的话后面，表示赞叹或惋惜",
    "乎 follows an adjective or a cry, in admiration or regret",
  ),
  usage(
    "介词，相当于“于”",
    "“乎”在动词或形容词后面，后面跟着名词，引出地点、对象或比较的对象，可以换成“于”",
    "乎 after a verb or adjective is followed by a noun, bringing in a place, a person or a thing compared, and can be replaced by 于",
  ),
];

const YIN: readonly Usage[] = [
  usage(
    "连词，于是、就",
    "“因”在动词前面，接着前面的事说下去，引出随后的动作",
    "因 stands before a verb and carries on from what came before",
  ),
  usage(
    "介词，凭借、通过",
    "“因”后面跟着人或事物，再接动作，说的是靠着它、经由它去做",
    "因 is followed by a person or thing and then an action: done by means of it or through it",
  ),
  usage(
    "介词，依照、顺着",
    "“因”后面跟着事物本来的样子或趋势，说的是顺着它去做",
    "因 is followed by how a thing is or tends, and the action goes along with it",
  ),
  usage("介词，趁着、趁机", "“因”说的是借着眼前的时机去做，常在“不如因……”里", "因 is seizing the moment at hand, often in 不如因……"),
];

const YU: readonly Usage[] = [
  usage(
    "介词或连词，和、跟、同",
    "“与”连接两个人或事物，或者引出一起做事的人",
    "与 joins two people or things, or brings in the one acted with",
  ),
  usage(
    "动词，给予",
    "“与”后面直接跟着给出去的东西，是句子的动词",
    "与 is followed directly by the thing handed over, as the verb of the sentence",
  ),
  usage("动词，参与", "“与”说的是加入某件事或某个活动", "与 is taking part in an event or an undertaking"),
  usage("语气词，同“欤”", "“与”在句末，表示疑问或感叹的语气", "与 ends the sentence with the tone of a question or a cry"),
];

const ZE: readonly Usage[] = [
  usage("连词，就、那么", "“则”连接条件和结果，前面说什么情况，后面说就会怎样", "则 joins a condition to what comes of it"),
  usage("连词，却、反而", "“则”前后两部分意思相反，后面出乎前面的意料", "则 joins two parts that run against each other"),
  usage("副词，是、就是", "“则”连接两样东西，判断前者就是后者", "则 links two things, judging that the first is the second"),
  usage(
    "连词，如果",
    "“则”用在前一分句里，引出一个假设的条件，结果在后一分句",
    "则 in the first clause brings in a supposed condition, and the result comes in the clause after it",
  ),
];

const SUO: readonly Usage[] = [
  usage(
    "助词，和动词组成“所”字结构，……的人、……的事物",
    "“所”放在动词前面，组成名词性的“所”字结构，指动作涉及的人或事物",
    "所 before a verb forms a noun, the person or thing the action bears on",
  ),
  usage(
    "名词，处所、地方",
    "“所”作名词，前面常有“其”“得”，指地方或应在的位置",
    "所 is a noun, often after 其 or 得: a place, or where something belongs",
  ),
  usage(
    "助词，和“为”组成被动句",
    "“所”和前面的“为”配合，组成“为……所”，表示被动",
    "所 pairs with 为 before it, as 为……所, making a passive",
  ),
  usage(
    "助词，和“以”组成“所以”，表示原因或凭借",
    "“所”和“以”连用成“所以”，说的是……的原因，或者用来……的凭借",
    "所 joins 以 as 所以: the reason for something, or the means of it",
  ),
];

const YE: readonly Usage[] = [
  usage(
    "语气词，表示判断",
    "“也”在句末，和“者”或前面的名词配合，判断前者是什么",
    "也 ends a sentence that judges what something is, often with 者",
  ),
  usage("语气词，表示疑问", "“也”在问句末尾，和“何”这样的疑问词配合，相当于“呢”", "也 ends a question with a word such as 何, like 呢"),
  usage(
    "语气词，用在句中表示停顿",
    "“也”在句中，放在主语或前一部分后面，让语气停一停，引出后面的话",
    "也 inside a sentence, after the subject or the first part, makes a pause before what follows",
  ),
  usage("语气词，表示感叹", "“也”在感叹句末尾，相当于“啊”", "也 ends an exclamation, like 啊"),
];

const ZHE: readonly Usage[] = [
  usage(
    "助词，……的人、……的事物",
    "“者”跟在动词、形容词或短语后面，组成“者”字结构，指……的人或事物",
    "者 follows a verb, adjective or phrase to name the person or thing that does or is so",
  ),
  usage(
    "助词，用在主语后表示停顿，引出判断",
    "“者”跟在主语后面，句末常有“也”，后面是对主语的判断",
    "者 follows the subject, often with 也 at the end, and what follows judges it",
  ),
  usage(
    "助词，用在时间词后，不译",
    "“者”跟在“昔”“今”这样表示时间的词后面，不译",
    "者 after a word of time such as 昔 or 今 is not translated",
  ),
  usage(
    "助词，用在数词后，指几种人或事物",
    "“者”跟在数词后面，总括前面说到的几种人或事物",
    "者 after a number sums up the several things named before",
  ),
];

const nai = `
乃不知有汉，无论魏晋（乃） | 1 | 竟然不知道有过汉朝，更不用说魏晋了 | 桃花源中的人与世隔绝几百年，连汉朝都不知道，这是渔人怎么也想不到的。 | Cut off for centuries, the people of the valley have not even heard of the Han, which the fisherman could never have expected.
今其智乃反不能及（乃） | 1 | 如今他们的智慧竟然反而比不上 | 句中有“今”“反”：士大夫看不起从师的百工，如今智慧反倒不如他们。 | 今 and 反 mark it: the scholars who look down on craftsmen now fall behind them.
今君乃亡赵走燕（乃） | 1 | 现在您却要从赵国逃到燕国去 | 前文说燕王想结交他，是因为他受赵王宠幸；现在他要背弃赵国投奔燕国，和常理相反。 | The king of Yan sought him only because Zhao favored him; to flee Zhao for Yan now goes against all sense.
乃重修岳阳楼（乃） | 0 | 于是重新修建岳阳楼 | 前文说滕子京治理一年，“政通人和，百废具兴”，重修岳阳楼是接着做的事。 | Teng Zijing's year of rule set everything right (政通人和，百废具兴); rebuilding the tower follows.
乃记之而去（乃） | 0 | 于是记下这件事就离开了 | 苏轼说完对石钟山的考察，接着说自己记下它，然后离开。 | Su Shi has finished looking into Stone Bell Mountain, and goes on to write it down and leave.
乃使其从者衣褐（乃） | 0 | 于是派他的随从穿上粗布衣服 | 蔺相如料定秦王不会给城，接着就让随从扮成平民，带璧从小路回赵。 | Lin Xiangru sees the king will not give the cities, and acts on it: a follower dressed as a commoner takes the jade home.
乃设九宾礼于廷（乃） | 0 | 于是在朝廷上设置九宾的礼仪 | 秦王答应斋戒五天，斋戒以后才在朝廷上摆出隆重的礼节。 | The king agrees to fast five days, and after that sets out the grand ceremony in his court.
当立者乃公子扶苏（乃） | 2 | 应当立为国君的是公子扶苏 | 句子判断“当立者”是谁，“乃”连接“当立者”和“公子扶苏”。 | The sentence judges who should take the throne: 乃 links 当立者 and 公子扶苏.
嬴乃夷门抱关者也（乃） | 2 | 我侯嬴不过是夷门的守门人 | 侯嬴说自己是什么人，句末有“也”。 | Hou Ying says what he is, and 也 ends the sentence.
吕公女乃吕后也（乃） | 2 | 吕公的女儿就是吕后 | 句末有“也”，句子说的是吕公的女儿是谁。 | 也 ends the sentence, which says who Lü Gong's daughter is.
家祭无忘告乃翁（乃） | 3 | 家里祭祀的时候不要忘记告诉你的父亲 | 这是陆游写给儿子的诗，“乃翁”说的是儿子的父亲，就是诗人自己。 | Lu You writes to his son, so 乃翁 is the son's father, the poet himself.
余嘉乃勋（乃） | 3 | 我赞美你的功勋 | 周王对着受赏的管仲说话，“勋”是听话人的功劳。 | The king speaks to Guan Zhong, whom he rewards: the merit is the listener's.
`;

const qie = `
臣死且不避，卮酒安足辞（且） | 0 | 我死尚且不躲避，一杯酒哪里值得推辞 | 后一分句用“安”反问：更难的死都不怕，一杯酒自然不在话下。 | The second clause asks with 安: he fears not even death, so a cup of wine is nothing.
且欲与常马等不可得（且） | 0 | 想要和普通的马一样尚且办不到 | 后文接着说“安求其能千里也”：连常马都比不上，更别说日行千里。 | It goes on 安求其能千里也: not even an ordinary horse's work, let alone a thousand li.
死马且买之五百金，况生马乎（且） | 0 | 死马尚且用五百金买下，何况活马呢 | 后一分句有“况”：死马都肯花钱买，活马就更不用说了。 | 况 follows: if a dead horse fetches five hundred, how much more a living one.
北山愚公者，年且九十（且） | 1 | 北山有个叫愚公的人，年纪将近九十岁
不者，若属皆且为所虏（且） | 1 | 不然的话，你们这些人都将要被他俘虏 | 范增预料以后的事：如果不杀沛公，你们将来都会被他俘虏，事情还没发生。 | Fan Zeng foresees what will come if Liu Bang lives: it has not happened yet.
河水清且涟猗（且） | 2 | 河水清澈而且泛起波纹
道阻且长（且） | 2 | 道路艰险而且漫长
存者且偷生，死者长已矣（且） | 3 | 活着的人姑且苟活，死去的人永远不在了 | 这是老妇人的话：儿子战死了，活着的人也只能暂且苟延，带着不得已的意味。 | The old woman's sons have died in war; those alive can only scrape by for now.
且放白鹿青崖间（且） | 3 | 暂且把白鹿放养在青青的山崖之间 | 诗人将要远行，白鹿先暂时放在山崖间，等要走时再骑。 | The poet is going away: for now he leaves the white deer on the green cliffs, to ride when he sets out.
且将新火试新茶（且） | 3 | 姑且点上新火来煮新茶 | 苏轼劝自己不要思念故乡，先就着眼前的新火新茶过日子。 | Su Shi tells himself not to pine for home but to make do, for now, with new fire and new tea.
`;

const ruo = `
若舍郑以为东道主（若） | 0 | 如果放弃攻打郑国，把它作为东方道路上的主人 | 烛之武提出一个设想，后文接着说出它的好处：“行李之往来，共其乏困，君亦无所害”。 | Zhu Zhiwu supposes, and goes on to the gain: Qin's envoys would be supplied, at no harm to Qin.
若亡郑而有益于君（若） | 0 | 如果灭掉郑国对您有好处 | 后文接着说“敢以烦执事”：真有好处，才值得劳烦您。 | It continues 敢以烦执事: only if there were gain would it be worth the trouble.
若事之不济，此乃天也（若） | 0 | 如果事情不成功，这就是天意 | 后一分句“此乃天也”说出前面情形出现时会怎样。 | The clause after, 此乃天也, says what it would mean if so.
皆若空游无所依（若） | 1 | 都好像在空中游动，没有什么依靠 | 柳宗元写潭中的鱼：水太清，看上去鱼好像游在空中。 | Liu Zongyuan writes of fish in water so clear they seem to swim in air.
日月之行，若出其中（若） | 1 | 太阳和月亮的运行，好像是从大海中出来的 | 曹操写大海：日月并不真从海中出来，是看上去这样。 | Cao Cao writes of the sea: sun and moon do not really rise from it; they only seem to.
星汉灿烂，若出其里（若） | 1 | 银河灿烂，好像是从大海里出来的 | 和上一句一样写大海的壮阔：银河看上去像是从海里出来的。 | Like the line before, it shows the vastness of the sea: the Milky Way seems to come out of it.
若入前为寿（若） | 2 | 你进去上前敬酒祝寿 | 范增对项庄下命令，“若”是“入”的主语，就是听他说话的人。 | Fan Zeng gives Xiang Zhuang an order: 若, the subject of 入, is the man he speaks to.
吾翁即若翁（若） | 2 | 我的父亲就是你的父亲 | 刘邦对项羽说话，“若翁”和“吾翁”相对。 | Liu Bang speaks to Xiang Yu, and 若翁 is set against 吾翁, my father.
不者，若属皆且为所虏（若） | 2 | 不然的话，你们这些人都将要被他俘虏 | 范增对项庄等人说话，“若属”是这一群听话的人。 | Fan Zeng speaks to Xiang Zhuang and the rest: 若属 is the group he addresses.
若夫淫雨霏霏，连月不开（若） | 3 | 至于那阴雨连绵，接连几个月不放晴的时候
若夫日出而林霏开（若） | 3 | 至于太阳出来，林中的雾气散开
`;

const yan = `
积土成山，风雨兴焉（焉） | 0 | 堆积土石成了高山，风雨就从那里兴起 | “焉”指前面说的“山”，风雨是从山那里兴起的。 | 焉 points back to 山: the wind and rain rise from the mountain.
积水成渊，蛟龙生焉（焉） | 0 | 积水成为深渊，蛟龙就在那里生长 | “焉”指前面说的“渊”，蛟龙生在深渊里。 | 焉 points back to 渊: the dragons live in the deep pool.
三人行，必有我师焉（焉） | 0 | 几个人一起走，其中一定有可以做我老师的人 | “焉”指前面的“三人”，老师就在这几个人当中。 | 焉 points back to 三人: the teacher is among them.
然力足以至焉，于人为可讥（焉） | 0 | 然而力量足以到达那里，却没有到达，在别人看来是可以讥笑的 | “焉”跟在“至”后面，指王安石他们没走到的洞的深处。 | 焉 after 至 is the depth of the cave that Wang Anshi and his friends did not reach.
且焉置土石（焉） | 1 | 况且把土和石头放到哪里去呢 | 愚公的妻子提出疑问，挖出来的土石总得有个去处。 | The Foolish Old Man's wife raises a doubt: the earth and stones must go somewhere.
焉用亡郑以陪邻（焉） | 1 | 哪里用得着灭掉郑国来增加邻国的土地呢 | 烛之武劝秦伯：灭郑只会让晋国得利，这是反问。 | Zhu Zhiwu argues that destroying Zheng would only help Jin: it is a rhetorical question.
未知生，焉知死（焉） | 1 | 还不懂得生，怎么能懂得死呢 | 孔子用反问回答子路，前一分句是“未知生”。 | Confucius answers Zilu with a rhetorical question; the first clause is 未知生.
寒暑易节，始一反焉（焉） | 2 | 冬夏换季，才往返一次 | 句子说的是运土的人一年才往返一次，前面没有“焉”能指的地方。 | It says the carriers went and came back once a year; there is no place before for 焉 to point to.
肉食者谋之，又何间焉（焉） | 2 | 当权的人自会谋划这件事，你又何必参与呢 | 句中已有“何”发问，“焉”在句末，不指什么地方。 | 何 already asks the question; 焉 at the end points to no place.
寡人之于国也，尽心焉耳矣（焉） | 2 | 我对于国家，真是尽心了啊 | “焉”“耳”“矣”三个语气词连用，加重语气，“焉”不指地方。 | 焉, 耳 and 矣 come together for force; 焉 points to no place.
盘盘焉，囷囷焉，蜂房水涡（焉） | 3 | 盘旋曲折的样子，曲折回旋的样子，像蜂房，像水涡
潸焉出涕（焉） | 3 | 泪流满面地哭了起来
`;

const he = `
大王来何操（何） | 0 | 大王来时带了什么礼物 | “何”是动词“操”的宾语，问的是拿了什么东西。 | 何 is the object of 操: what was brought.
客何为者（何） | 0 | 客人是干什么的 | “何为”就是“为何”，“何”是“为”（做）的宾语，问做的是什么。 | 何为 is 为何: 何 is the object of 为, to do, asking what he does.
何陋之有（何） | 0 | 有什么简陋的呢 | “何陋”是“有”的宾语，提到了动词前面，“何”修饰“陋”。 | 何陋 is the object of 有, brought before it, and 何 describes 陋.
然则何时而乐耶（何） | 0 | 那么什么时候才快乐呢 | “何”放在名词“时”前面，问的是什么时候。 | 何 stands before the noun 时: at what time.
肉食者谋之，又何间焉（何） | 1 | 当权的人自会谋划这件事，你又为什么要参与呢 | “何”在动词“间”前面，问的是参与的理由。 | 何 before the verb 间 asks for a reason to take part.
徐公何能及君也（何） | 1 | 徐公怎么能比得上您呢 | “何”在“能及”前面，问的是怎么能够。 | 何 before 能及 asks how he could.
何不按兵束甲，北面而事之（何） | 1 | 为什么不放下武器，捆起铠甲，向他称臣呢 | “何不”问的是为什么不这样做。 | 何不 asks why one does not do so.
何为其然也（何） | 1 | 箫声为什么这样悲凉呢 | 苏轼听到悲凉的箫声，问客人原因。 | Su Shi hears the mournful flute and asks his guest why.
今宵酒醒何处（何） | 2 | 今夜酒醒的时候身在哪里
何处望神州（何） | 2 | 在哪里能望见中原
何处是归程（何） | 2 | 哪里是回去的路
水何澹澹（何） | 3 | 海水多么宽阔，水波荡漾
何其衰也（何） | 3 | 多么衰败啊
莲叶何田田（何） | 3 | 莲叶多么茂盛
吏呼一何怒（何） | 3 | 差役呼喝得多么凶狠
`;

const hu = `
传不习乎（乎） | 0 | 老师传授的知识没有温习吗 | 曾子每天这样反省自己，是真的在问，要自己回答。 | Zengzi asks himself this every day: a real question, to be answered.
齐桓、晋文之事可得闻乎（乎） | 0 | 齐桓公、晋文公称霸的事，可以讲给我听听吗 | 齐宣王向孟子请教，等着孟子回答。 | King Xuan of Qi asks Mencius and waits for his answer.
客亦知夫水与月乎（乎） | 0 | 您也知道那水和月吗 | 苏轼问客人，接着自己讲起水和月的道理。 | Su Shi asks his guest, then explains the water and the moon himself.
学而时习之，不亦说乎（乎） | 1 | 学了又按时温习它，不也是很愉快的吗
人不知而不愠，不亦君子乎（乎） | 1 | 别人不了解我，我却不生气，不也是君子吗
王侯将相宁有种乎（乎） | 1 | 王侯将相难道是天生的贵种吗
死马且买之五百金，况生马乎（乎） | 1 | 死马尚且用五百金买下，何况活马呢
危乎高哉（乎） | 2 | 多么高峻啊
惜乎，子不遇时（乎） | 2 | 可惜啊，您没有遇到好时机
生乎吾前（乎） | 3 | 出生在我之前
其闻道也固先乎吾（乎） | 3 | 他懂得道理本来就比我早
浴乎沂，风乎舞雩（乎） | 3 | 在沂水里洗澡，在舞雩台上吹风
君子博学而日参省乎己（乎） | 3 | 君子广泛地学习，并且每天对自己检验反省
`;

const yin = `
因释其耒而守株（因） | 0 | 于是放下他的农具，守在树桩旁边 | 种田人捡到撞死的兔子，接着就放下农具守株，这是随后做的事。 | The farmer has picked up the dead hare, and what he does next is lay down his tool.
相如因持璧却立（因） | 0 | 蔺相如于是拿着璧退后几步站定 | 蔺相如看出秦王无意给城，接着就拿着璧退到柱子旁。 | Lin Xiangru sees the king will not give the cities, and next steps back with the jade.
因以为号焉（因） | 0 | 于是就用它作为自己的号 | 前文说宅边有五棵柳树，五柳先生接着就拿来作自己的号。 | Five willows stand by his house, and next he takes them as his name.
权因拔刀斫前奏案（因） | 0 | 孙权于是拔出刀砍面前放奏章的桌子 | 孙权听了周瑜的分析，下定决心，接着就拔刀砍案。 | Sun Quan hears Zhou Yu out, makes up his mind, and next draws his sword on the desk.
因宾客至蔺相如门谢罪（因） | 1 | 通过宾客引导，到蔺相如的门前请罪 | 廉颇是由宾客领着去请罪的，“因”后面跟着人“宾客”，再接动作“至”。 | Lian Po goes led by guests: 因 is followed by a person, 宾客, then the action 至.
因人之力而敝之，不仁（因） | 1 | 依靠别人的力量反而损害他，是不仁义的 | 晋文公说的是秦国帮过晋国，“因”后面是“人之力”，晋国靠它成事。 | Duke Wen of Jin means Qin's help: 因 is followed by 人之力, what Jin relied on.
因河为池（因） | 1 | 凭借黄河作为护城河 | “因”后面是“河”，秦人靠黄河来守卫。 | 因 is followed by 河, the river Qin used for defence.
因其固然（因） | 2 | 顺着牛体本来的结构 | 庖丁解牛，刀顺着牛身上天然的空隙走，“因”后面是“其固然”。 | Cook Ding's knife follows the natural gaps in the ox: 因 is followed by 其固然, how it already is.
善战者因其势而利导之（因） | 2 | 善于作战的人顺着事情的发展趋势加以引导 | “因”后面是“其势”，事情的趋势，用兵要顺着它。 | 因 is followed by 其势, the way things tend, which a general goes along with.
不如因而厚遇之，使归赵（因） | 3 | 不如趁此机会好好款待他，让他回到赵国 | 秦王认为杀了蔺相如也得不到璧，不如借着眼前的局面款待他。 | The king of Qin sees that killing Lin gains no jade, so better use the moment to treat him well.
不如因善遇之（因） | 3 | 不如趁这个机会好好对待他 | 项伯劝项羽：刘邦已经来谢罪，不如借着这个机会善待他。 | Xiang Bo urges Xiang Yu: Liu Bang has come to apologize, so use the moment to treat him well.
`;

const yu = `
吾与汝毕力平险（与） | 0 | 我和你们尽全力铲平险峻的大山
臣与将军戮力而攻秦（与） | 0 | 我和将军合力攻打秦国
与朋友交而不信乎（与） | 0 | 跟朋友交往是不是不诚信呢
令将军与臣有郤（与） | 0 | 使将军和我有了隔阂
则与一生彘肩（与） | 1 | 于是给了他一只生猪腿 | 项王说“赐之彘肩”，左右接着把猪腿给了樊哙。 | Xiang Yu orders 赐之彘肩, and his men hand Fan Kuai the shoulder.
则与斗卮酒（与） | 1 | 于是给了他一大杯酒 | 项王说“赐之卮酒”，左右接着把酒给了樊哙。 | Xiang Yu orders 赐之卮酒, and his men hand Fan Kuai the wine.
蹇叔之子与师（与） | 2 | 蹇叔的儿子参加了这支军队 | “师”是出征的军队，蹇叔的儿子是军中的一员。 | 师 is the army setting out, and Jian Shu's son is in it.
昔者仲尼与于蜡宾（与） | 2 | 从前孔子参加蜡祭，做陪祭的人 | “与于蜡宾”是在蜡祭中担任陪祭。 | 与于蜡宾 is serving as an attendant at the year-end sacrifice.
是谁之过与（与） | 3 | 这是谁的过错呢
子非三闾大夫与（与） | 3 | 您不是三闾大夫吗
`;

const ze = `
学而不思则罔（则） | 0 | 只学习不思考，就会迷惑
居庙堂之高则忧其民（则） | 0 | 在朝廷里做官，就为百姓担忧
然则何时而乐耶（则） | 0 | 那么什么时候才快乐呢 | “然则”是“既然这样，那么”，接着前面的话往下推。 | 然则 is "this being so, then", carrying the reasoning on.
则与一生彘肩（则） | 0 | 于是给了他一只生猪腿 | 项王下令“赐之彘肩”，“则”连接命令和随之而来的结果。 | Xiang Yu gives the order 赐之彘肩, and 则 joins it to what follows.
穷则独善其身（则） | 0 | 不得志时就独自修养自身
于其身也，则耻师焉（则） | 1 | 对于他自己，却以从师为耻 | 前文说爱自己的孩子，就选择老师教他；对自己却不肯从师，前后相反。 | Before, they choose teachers for their sons; for themselves they will not learn from one.
此则岳阳楼之大观也（则） | 2 | 这就是岳阳楼的壮丽景象 | 句末有“也”，“此”指前面写的景色，句子判断它是什么。 | 也 ends it: 此 is the view just described, and the sentence judges what it is.
此则寡人之罪也（则） | 2 | 这是我的罪过 | 句末有“也”，句子判断“此”是什么。 | 也 ends it, and the sentence judges what 此 is.
入则无法家拂士（则） | 3 | 在国内如果没有坚守法度的大臣和辅佐君主的贤士 | “则”后面不是结果，而是一个条件：没有法家拂士；结果“国恒亡”还在后面。 | What follows 则 is not a result but a condition; the result, 国恒亡, comes later.
出则无敌国外患者（则） | 3 | 在国外如果没有实力相当的国家和外患的忧虑 | “则”后面是一个条件，结果“国恒亡”在后一分句。 | What follows 则 is a condition; the result, 国恒亡, is in the next clause.
`;

const suo = `
鱼，我所欲也（所） | 0 | 鱼是我想要的东西
所恶有甚于死者（所） | 0 | 我厌恶的东西有比死亡更严重的
此人一一为具言所闻（所） | 0 | 这个人把自己听到的事一一详细地告诉了他们
不失其所者久（所） | 1 | 不丧失自己根基的人能够长久 | “所”前面是“其”，后面没有动词，是名词，指一个人应在的位置。 | 所 follows 其 with no verb after it: a noun, where one belongs.
雅颂各得其所（所） | 1 | 《雅》和《颂》各自找到了恰当的位置 | “所”前面有“得其”，后面没有动词，是乐曲应在的位置。 | 所 follows 得其 with no verb after it: where each piece belongs.
不者，若属皆且为所虏（所） | 2 | 不然的话，你们这些人都将要被他俘虏
为秦人积威之所劫（所） | 2 | 被秦国长期积累的威势所胁迫
师者，所以传道受业解惑也（所） | 3 | 老师是用来传授道理、教授学业、解答疑惑的人
此世所以不传也（所） | 3 | 这就是世上没有流传下来的原因
吾所以为此者，以先国家之急而后私仇也（所） | 3 | 我这样做的原因，是把国家的急难放在前面，把私人的仇怨放在后面
所以遣将守关者，备他盗之出入与非常也（所） | 3 | 派遣将领把守函谷关的原因，是防备别的盗贼进出和意外的变故
`;

const ye = `
陈胜者，阳城人也（也） | 0 | 陈胜是阳城人
城北徐公，齐国之美丽者也（也） | 0 | 城北的徐公，是齐国的美男子
廉颇者，赵之良将也（也） | 0 | 廉颇是赵国的优秀将领
寡人之民不加多，何也（也） | 1 | 我的百姓不增多，是什么原因呢
何由知吾可也（也） | 1 | 根据什么知道我可以呢
其闻道也固先乎吾（也） | 2 | 他懂得道理本来就比我早
师道之不传也久矣（也） | 2 | 从师的风尚不流传已经很久了
寡人之于国也，尽心焉耳矣（也） | 2 | 我对于国家，真是尽心了啊
何其衰也（也） | 3 | 多么衰败啊 | 句中有“何其”，这句是感叹，不是发问。 | 何其 makes it an exclamation, not a question.
甚矣，吾衰也（也） | 3 | 我衰老得很厉害了啊 | 孔子感叹自己老了，“甚矣”放在前面加强语气。 | Confucius laments his age; 甚矣 comes first for force.
`;

const zhe = `
择其善者而从之（者） | 0 | 选取他们好的方面来学习
有好事者船载以入（者） | 0 | 有个喜欢多事的人用船把驴运了进来
通国之善弈者也（者） | 0 | 是全国最擅长下棋的人
陈胜者，阳城人也（者） | 1 | 陈胜是阳城人
师者，所以传道受业解惑也（者） | 1 | 老师是用来传授道理、教授学业、解答疑惑的人
廉颇者，赵之良将也（者） | 1 | 廉颇是赵国的优秀将领
昔者仲尼与于蜡宾（者） | 2 | 从前孔子参加蜡祭，做陪祭的人
今者有小人之言（者） | 2 | 现在有小人的谗言
此三者，吾遗恨也（者） | 3 | 这三件事，是我的遗憾
二者不可得兼（者） | 3 | 两样东西不能同时得到
`;

/** WordPart is one word of a drill of two function words: its point, its usages, its items and how it is taught. */
interface WordPart {
  readonly word: string;
  readonly suffix: string;
  readonly usages: readonly Usage[];
  readonly data: string;
  /** walk works one sentence through, from where the word stands to its usage and the sentence in modern Chinese. */
  readonly walk: Text;
  /** watch names the mistake the wrong options of this word record. */
  readonly watch: Text;
}

/** pair builds a drill of two function words, a knowledge point each, with an intro that reads one sentence. */
function pair(grade: number, id: string, intro: Text, a: WordPart, b: WordPart): ClassicalDrill {
  const point = (p: WordPart) =>
    usagePoint({
      suffix: p.suffix,
      title: t(`The Usages of ${p.word}`, `“${p.word}”的用法`),
      explanation: explained(
        t(
          `${p.word} does four jobs in the passages you read, and what stands around it tells which:`,
          `在学过的文言文中，“${p.word}”有四种常见用法，它前后的成分能告诉你是哪一种：`,
        ),
        [p.usages],
        p.walk,
        p.watch,
      ),
      question: t(`What is the usage of ${p.word} in this sentence?`, `“${p.word}”在这句话中是什么用法？`),
      usages: p.usages,
      data: p.data,
    });
  return {
    grade,
    id,
    title: t(`Classical Chinese: ${a.word} and ${b.word}`, `文言文：“${a.word}”和“${b.word}”`),
    summary: t(`The usages of ${a.word} and ${b.word} in classical sentences.`, `文言句子中“${a.word}”“${b.word}”的用法。`),
    intro,
    points: [point(a), point(b)],
  };
}

const KINDS: readonly Usage[] = [
  usage(
    "判断句",
    "句子判断一样东西是什么，不用“是”，而用“……者，……也”，或用“乃”“则”",
    "the sentence judges what something is without 是, using ……者，……也, or 乃 or 则",
  ),
  usage(
    "被动句",
    "主语是承受动作的一方，句中有“为”“见”“被”“受”，或者动词后面有引出动作发出者的“于”",
    "the subject suffers the action, marked by 为, 见, 被 or 受, or by a 于 after the verb that brings in the doer",
  ),
  usage(
    "省略句",
    "句子省去了主语、宾语、介词或动词，翻译时要补出来",
    "the sentence leaves out a subject, an object, a preposition or a verb, which the translation must supply",
  ),
  usage(
    "倒装句",
    "句子成分的顺序和现代汉语不同，翻译时要调回来",
    "its parts stand in an order unlike modern Chinese, which the translation must restore",
  ),
];

const INVERSIONS: readonly Usage[] = [
  usage(
    "宾语前置",
    "疑问句或否定句中代词作宾语，放在动词前面，或者用“之”把宾语提到动词前面",
    "in a question or a negation a pronoun object stands before its verb, or 之 brings the object before it",
  ),
  usage("定语后置", "修饰名词的成分放在名词后面，常用“者”或“之……者”", "what describes a noun follows it, often with 者 or 之……者"),
  usage("状语后置", "“于”“以”“乎”组成的介词结构放在动词或形容词后面", "a phrase of 于, 以 or 乎 follows its verb or adjective"),
  usage("主谓倒装", "为了强调，把谓语放在主语前面", "the predicate comes before its subject, for force"),
];

const kinds = `
城北徐公，齐国之美丽者也 | 0 | 城北的徐公，是齐国的美男子 | 句末有“也”：前一部分说的是谁，后一部分说他是什么人，句中没有“是”。 | It ends with 也: the first part names a man, the second says what he is, and there is no 是.
廉颇者，赵之良将也 | 0 | 廉颇是赵国的优秀将领 | 句子用“……者，……也”：“者”跟在“廉颇”后面停一停，句末是“也”。 | It uses ……者，……也: 者 pauses after 廉颇, and 也 ends the sentence.
当立者乃公子扶苏 | 0 | 应当立为国君的是公子扶苏 | “乃”连接“当立者”和“公子扶苏”，说前者是谁。 | 乃 links 当立者 and 公子扶苏, saying who the first is.
吾属今为之虏矣 | 1 | 我们这些人如今要被他俘虏了 | 主语“吾属”是要被俘虏的一方，动词“虏”前面有“为之”。 | The subject, 吾属, is the side to be captured, and 为之 stands before the verb 虏.
信而见疑，忠而被谤 | 1 | 诚信却被怀疑，忠诚却被诽谤 | “见”“被”放在动词“疑”“谤”前面，受怀疑、受诽谤的是屈原自己。 | 见 and 被 stand before the verbs 疑 and 谤: Qu Yuan is the one doubted and slandered.
而君幸于赵王 | 1 | 而您受到赵王的宠幸 | 宠幸人的是赵王，“君”是被宠幸的一方，“于”在动词“幸”后面引出赵王。 | The king does the favoring and 君 receives it; 于 after the verb 幸 brings in the king.
吾不能举全吴之地，十万之众，受制于人 | 1 | 我不能拿全吴国的土地和十万军队，去受别人控制 | 受控制的是“吾”，“受”和动词后的“于人”引出控制他的人。 | 吾 is the one controlled: 受, and 于人 after the verb, bring in who controls him.
将军战河北，臣战河南 | 2 | 将军在黄河以北作战，我在黄河以南作战 | “战”和“河北”“河南”之间没有介词，说的却是在哪里作战。 | No preposition stands between 战 and 河北 or 河南, yet they say where the fighting is.
一鼓作气，再而衰，三而竭 | 2 | 第一次击鼓能振作士气，第二次击鼓士气就衰退，第三次击鼓士气就耗尽了 | “再”“三”后面没有“鼓”，说的却是第二次、第三次击鼓。 | No 鼓 follows 再 and 三, yet they mean the second and third beat.
竖子不足与谋 | 2 | 这小子不值得和他一起谋划 | “与”后面没有宾语，“和谁”谋划要从上下文补出来。 | 与 has no object after it: with whom one plans must be supplied.
何陋之有 | 3 | 有什么简陋的呢 | “有”的对象“何陋”放在了“有”的前面，中间用“之”。 | 何陋, what 有 takes, stands before it, with 之 between.
甚矣，汝之不惠 | 3 | 你太不聪明了 | 说“汝之不惠”怎么样的“甚矣”放在了前面。 | 甚矣, which says how 汝之不惠 is, comes first.
青，取之于蓝 | 3 | 靛青是从蓼蓝中提取的 | “于蓝”说的是从哪里提取，却放在了动词“取”的后面。 | 于蓝 says where it is taken from, yet follows the verb 取.
求人可使报秦者 | 3 | 寻找一个可以出使回复秦国的人 | 说明“人”是什么样的人的“可使报秦”，放在了“人”的后面。 | 可使报秦, which says what kind of man, follows 人.
`;

const inversions = `
何陋之有 | 0 | 有什么简陋的呢 | “何陋”是“有”的宾语，用“之”提到了动词“有”的前面。 | 何陋 is the object of 有, brought before it with 之.
沛公安在 | 0 | 沛公在哪里 | 这是疑问句，代词“安”是“在”的宾语，放在了“在”的前面。 | It is a question, and the pronoun 安 is the object of 在, before it.
宋何罪之有 | 0 | 宋国有什么罪呢 | “何罪”是“有”的宾语，用“之”提到了“有”的前面。 | 何罪 is the object of 有, brought before it with 之.
古之人不余欺也 | 0 | 古人没有欺骗我啊 | 这是否定句，代词“余”是“欺”的宾语，放在了“欺”的前面。 | It is a negation, and the pronoun 余 is the object of 欺, before it.
求人可使报秦者 | 1 | 寻找一个可以出使回复秦国的人 | “可使报秦”修饰“人”，却放在“人”的后面，用“者”收尾。 | 可使报秦 describes 人 but follows it, closed by 者.
蚓无爪牙之利，筋骨之强 | 1 | 蚯蚓没有锋利的爪牙、强健的筋骨 | “利”“强”修饰“爪牙”“筋骨”，却用“之”放在了它们后面。 | 利 and 强 describe 爪牙 and 筋骨 but follow them, after 之.
石之铿然有声者 | 1 | 敲起来铿铿作响的石头 | “铿然有声”修饰“石”，却放在“石”的后面，用“之……者”。 | 铿然有声 describes 石 but follows it, in 之……者.
马之千里者 | 1 | 能日行千里的马 | “千里”修饰“马”，却放在“马”的后面，用“之……者”。 | 千里 describes 马 but follows it, in 之……者.
青，取之于蓝，而青于蓝 | 2 | 靛青是从蓼蓝中提取的，却比蓼蓝更青 | 两个“于蓝”都放在了动词或形容词后面，现代汉语要说“从蓼蓝中提取”“比蓼蓝更青”。 | Both 于蓝 follow a verb or adjective, where modern Chinese puts them first.
战于长勺 | 2 | 在长勺交战 | 介词结构“于长勺”放在了动词“战”的后面。 | The phrase 于长勺 follows the verb 战.
君子博学而日参省乎己 | 2 | 君子广泛地学习，并且每天对自己检验反省 | “乎己”是介词结构，放在了“参省”的后面。 | 乎己 is a prepositional phrase after 参省.
具告以事 | 2 | 把事情详细地告诉了他 | “以事”放在了动词“告”的后面，现代汉语要说“把事情告诉他”。 | 以事 follows the verb 告, where modern Chinese puts it first.
甚矣，汝之不惠 | 3 | 你太不聪明了 | “甚矣”说的是“汝之不惠”的程度，却放在了它的前面。 | 甚矣 says how far 汝之不惠 goes, yet stands before it.
渺渺兮予怀 | 3 | 我的情思悠远 | “渺渺兮”说的是“予怀”怎么样，却放在了它的前面。 | 渺渺兮 says how 予怀 is, yet stands before it.
安在公子能急人之困也 | 3 | 公子能为人解救急难的品德表现在哪里呢 | “安在”说的是“公子能急人之困”在哪里，却放在了它的前面。 | 安在 asks where 公子能急人之困 is, yet stands before it.
`;

const FLEXIBLE: readonly Usage[] = [
  usage(
    "名词用作动词",
    "名词带着宾语，或者前面有副词、能愿动词，在句中表示主语自己做的动作",
    "a noun takes an object, or follows an adverb or a modal, and names an action the subject itself does",
  ),
  usage(
    "名词用作状语",
    "名词放在动词前面，说明动作的方式、工具或样子，可以译成“像……一样”“用……”",
    "a noun before a verb tells how the action is done: like a …, or with a …",
  ),
  usage("使动用法", "动词或形容词带着宾语，意思是使宾语怎么样", "a verb or adjective takes an object and means making it do or be so"),
  usage(
    "意动用法",
    "形容词或名词带着宾语，意思是认为宾语怎么样，或者把宾语当作什么",
    "an adjective or noun takes an object and means thinking it so, or treating it as such",
  ),
];

const flexible = `
驴不胜怒，蹄之（蹄） | 0 | 驴非常愤怒，用蹄子踢它 | 名词“蹄”后面带着宾语“之”（老虎），是驴自己做的踢的动作。 | The noun 蹄 takes 之, the tiger, as object: it is the donkey's own act of kicking.
范增数目项王（目） | 0 | 范增多次给项王使眼色 | 名词“目”前面有副词“数”，后面带着宾语“项王”，是范增自己做的动作。 | The noun 目 follows the adverb 数 and takes 项王 as object: Fan Zeng's own act.
籍吏民，封府库（籍） | 0 | 登记官吏和百姓，封存官府的仓库 | 名词“籍”（簿册）后面带着宾语“吏民”，和后面的动词“封”并列。 | The noun 籍, a register, takes 吏民 as object and parallels the verb 封.
假舟楫者，非能水也（水） | 0 | 借助船和桨的人，不是会游泳 | 名词“水”前面有能愿动词“能”，说的是一种本领。 | The noun 水 follows the modal 能: it names a skill.
其一犬坐于前（犬） | 1 | 其中一只狼像狗一样蹲坐在前面 | “犬”放在动词“坐”前面，说的是坐的样子；坐着的是狼，不是狗。 | 犬 stands before the verb 坐 and says how it sits; the one sitting is a wolf, not a dog.
天下云集响应（云） | 1 | 天下人像云一样聚集，像回声一样应和 | “云”放在动词“集”前面，说的是怎样聚集。 | 云 stands before the verb 集 and says how they gather.
吾得兄事之（兄） | 1 | 我得像对待兄长那样侍奉他 | “兄”放在动词“事”前面，说的是怎样侍奉。 | 兄 stands before the verb 事 and says how he serves.
斗折蛇行（蛇） | 1 | 溪水像北斗星那样曲折，像蛇那样蜿蜒前行 | “蛇”放在动词“行”前面，说的是溪水怎样流去。 | 蛇 stands before the verb 行 and says how the stream runs.
常以身翼蔽沛公（翼） | 1 | 常常用身体像鸟张开翅膀那样掩护沛公 | “翼”放在动词“蔽”前面，说的是怎样掩护。 | 翼 stands before the verb 蔽 and says how he shields him.
项伯杀人，臣活之（活） | 2 | 项伯杀了人，我使他活了下来 | “活”带着宾语“之”（项伯），活下来的是项伯，不是说话的张良。 | 活 takes 之, Xiang Bo, as object: it is Xiang Bo who lives, not Zhang Liang who speaks.
焚百家之言，以愚黔首（愚） | 2 | 焚烧诸子百家的著作，来使百姓愚昧 | 形容词“愚”带着宾语“黔首”，变愚昧的是百姓，不是焚书的秦王。 | The adjective 愚 takes 黔首 as object: the people are made ignorant, not the king.
舞幽壑之潜蛟（舞） | 2 | 使深谷中潜藏的蛟龙起舞 | “舞”的宾语是“幽壑之潜蛟”，起舞的是蛟龙，不是吹箫的人。 | 舞 takes 幽壑之潜蛟 as object: the dragon dances, not the flute player.
泣孤舟之嫠妇（泣） | 2 | 使孤舟上的寡妇哭泣 | “泣”带着宾语“孤舟之嫠妇”，哭泣的是寡妇，不是箫声。 | 泣 takes 孤舟之嫠妇 as object: the widow weeps, not the flute.
吾妻之美我者，私我也（美） | 3 | 我的妻子认为我美，是偏爱我 | 形容词“美”带着宾语“我”，妻子并不能使邹忌变美，只是心里这样认为。 | The adjective 美 takes 我 as object: his wife cannot make Zou Ji handsome, only think him so.
孔子登东山而小鲁（小） | 3 | 孔子登上东山，觉得鲁国变小了 | 形容词“小”带着宾语“鲁”，鲁国并没有变小，是孔子心里觉得它小。 | The adjective 小 takes 鲁 as object: Lu has not shrunk, Confucius only finds it small.
侣鱼虾而友麋鹿（友） | 3 | 以鱼虾为伴侣，以麋鹿为朋友 | 名词“友”带着宾语“麋鹿”，和“侣鱼虾”并列：不是使麋鹿成为朋友，而是把它们当作朋友。 | The noun 友 takes 麋鹿 as object, beside 侣鱼虾: not making them friends but treating them as friends.
而耻学于师（耻） | 3 | 却以向老师学习为耻 | “耻”带着宾语“学于师”，说的是心里把向老师学习看成可耻的事。 | 耻 takes 学于师 as object: in their minds, learning from a teacher is shameful.
`;

const oldAndNew = `
率妻子邑人来此绝境（妻子） | 妻子和儿女 | 男子的配偶 | 妻子的娘家人 | 妻子和邻居 | 带领妻子儿女和同乡人来到这个与外界隔绝的地方 | 这是先人逃避秦时战乱，全家迁来的情形，“妻子”是“妻”和“子”两个词。 | The forebears fled the wars of Qin with their whole households: 妻子 is two words, wife and children.
率妻子邑人来此绝境（绝境） | 与外界隔绝的地方 | 没有出路的境地 | 风景绝美的地方 | 偏远的边境 | 带领妻子儿女和同乡人来到这个与外界隔绝的地方 | 桃花源里的人来了就“不复出焉，遂与外人间隔”，“绝境”说的是与人世隔绝的地方，他们在那里安居乐业。 | They came and never left (不复出焉，遂与外人间隔): 绝境 is a place cut off from the world, where they lived happily.
乃不知有汉，无论魏晋（无论） | 更不用说 | 不管，不论 | 没有讨论 | 无法评论 | 竟然不知道有过汉朝，更不用说魏晋了 | 汉在魏晋之前，连汉朝都不知道，后来的魏晋就更不必说了。 | Han came before Wei and Jin: not knowing even the Han, still less did they know what came after.
古之学者必有师（学者） | 求学的人 | 有专门学问的人 | 学校里的老师 | 读书做官的人 | 古代求学的人一定有老师 | 后文说“人非生而知之者，孰能无惑”，要从师的是正在求学的人。 | It goes on 人非生而知之者，孰能无惑: those who need a teacher are those still learning.
备他盗之出入与非常也（非常） | 意外的变故 | 十分，很 | 不平常的人 | 违法的事情 | 防备别的盗贼进出和意外的变故 | “非常”和“他盗之出入”并列，都是“备”的对象，是一件要防备的事。 | 非常 stands with 他盗之出入 as what 备 guards against: a thing to be guarded against.
先帝不以臣卑鄙（卑鄙） | 身份低微，见识浅陋 | 品质恶劣 | 胆小怕事 | 为人吝啬 | 先帝不因为我身份低微、见识浅陋 | 诸葛亮说先帝不嫌弃自己，三次到草庐来看他，这是谦虚地说自己出身卑微。 | Zhuge Liang says the late emperor did not look down on him but called on him three times: he is humbly naming his low station.
今齐地方千里（地方） | 土地方圆 | 某一个区域 | 地方政府 | 本地 | 如今齐国的土地方圆千里 | “地方千里”是“地”和“方千里”：土地纵横各一千里，说的是齐国之大。 | 地方千里 is 地 and 方千里: land a thousand li each way, the size of Qi.
山东豪俊遂并起而亡秦族矣（山东） | 崤山以东 | 今天的山东省 | 东边的山 | 泰山以东 | 崤山以东的豪杰于是一起起事，灭掉了秦朝 | 秦在崤山、函谷关以西，起来反秦的是它以东六国旧地的豪杰。 | Qin lay west of Mount Xiao and the Hangu Pass; those who rose against it came from the lands of the six states east of it.
出则无敌国外患者（敌国） | 实力相当的国家 | 敌对的国家 | 被打败的国家 | 遥远的国家 | 在国外如果没有实力相当的国家和外患的忧虑 | 孟子说的是使国家警醒的力量：能与本国抗衡的国家，没有它，国家反而容易灭亡。 | Mencius means what keeps a state alert: a state of equal strength, without which it is apt to perish.
未尝不叹息痛恨于桓灵也（痛恨） | 痛心和遗憾 | 深深地憎恨 | 非常后悔 | 十分愤怒 | 没有一次不对桓帝、灵帝感到叹息、痛心和遗憾 | “痛恨”和“叹息”连用，刘备谈起桓帝、灵帝时惋惜汉朝的衰败。 | 痛恨 stands with 叹息, sighing: Liu Bei laments the decline of Han under those emperors.
吾从而师之（从而） | 跟从并且 | 因此，进而 | 然后 | 于是就 | 我跟从他，并且拜他为老师 | “从”是跟从，“而”连接后面的“师之”，是两个词，不是今天的一个连词。 | 从 is to follow and 而 joins 师之 after it: two words, not today's one conjunction.
中间力拉崩倒之声（中间） | 其中夹杂着 | 两头之间的位置 | 事物的中心 | 一段时间之内 | 其中夹杂着用力拉扯、房屋崩塌倒下的声音 | 前面写了呼喊声、哭声，“中间”说的是这些声音里还夹着别的声音。 | Before come shouts and cries; 中间 says that other sounds are mixed among them.
`;

/** seniorClassicalDrills are the drill topics of classical language in senior secondary school, in order. */
export const seniorClassicalDrills: readonly ClassicalDrill[] = [
  pair(
    10,
    "classical-function-words-10-01",
    t(
      "The function words of the required course are learned as those of grade 6 were: each has a few usages, and where it stands, with what comes before and after it, tells which. This topic takes 乃 and 且.\n\nTake 乃入见 from 曹刿论战. Cao Gui's neighbors tell him that those in power will see to the war; he answers that they are short-sighted, and then 乃入见. 乃 stands before the action 入见, going in to see the duke, and carries on from what he has just said: having made up his mind, he goes. So 乃 is 于是, and the sentence is 于是入朝去见鲁庄公. Had 乃 linked two things, 乃 would be 是; had what follows gone against what came before, it would be 竟然. The two knowledge points practise 乃, then 且.",
      "高中必修课的文言虚词，学法和六年级一样：每个词有几种用法，它在句中的位置、前后的成分告诉你是哪一种。这个主题学“乃”和“且”。\n\n比如《曹刿论战》里的“乃入见”。乡人劝曹刿说，当权的人自会谋划；曹刿回答说他们目光短浅，接着就“乃入见”。“乃”放在动作“入见”前面，接着他刚说的话往下走：拿定了主意，就去了。所以“乃”是“于是”，整句是“于是入朝去见鲁庄公”。如果“乃”连接的是两样东西，它就是“是”；如果后面的事和前面相反、出人意料，它就是“竟然”。两个知识点依次练习“乃”和“且”。",
    ),
    {
      word: "乃",
      suffix: "nai",
      usages: NAI,
      data: nai,
      walk: t(
        "Walk through 臣乃市井鼓刀屠者, from 信陵君窃符救赵: Zhu Hai tells the prince who he is. 乃 stands between 臣, I, and 市井鼓刀屠者, a butcher of the market who wields a knife. No action follows that could come next; nothing goes against expectation; no noun of a listener's follows. 乃 links two things and says the first is the second: it is 是, and the sentence is 我是市井中挥刀杀牲的屠夫.",
        "以《信陵君窃符救赵》里的“臣乃市井鼓刀屠者”为例：朱亥向公子说明自己是什么人。“乃”夹在“臣”（我）和“市井鼓刀屠者”（市场上挥刀宰杀牲畜的屠夫）中间。后面没有接着发生的动作，也没有出乎意料的转折，“乃”后面也不是听话人的什么东西。它连接两样东西，说前者就是后者，所以是“是”，整句是“我是市井中挥刀杀牲的屠夫”。",
      ),
      watch: t(
        "乃 before an action is not always 于是. If what follows goes against what one expects, it is 竟然: in 今其智乃反不能及, 今 and 反 show the scholars' wisdom has, against all sense, fallen behind. Weigh what comes before before choosing 于是.",
        "动作前面的“乃”不一定是“于是”。如果后面的事和常理相反，它就是“竟然”：“今其智乃反不能及”里有“今”“反”，说的是士大夫的智慧竟然反而不如别人。选“于是”之前，先看看前文。",
      ),
    },
    {
      word: "且",
      suffix: "qie",
      usages: QIE,
      data: qie,
      walk: t(
        "Walk through 犹且从师而问焉, from 师说: Han Yu says the sages of old far surpassed others, 犹且从师而问焉, and still learned from teachers. 且 stands in the first part of a comparison: even they, so far above others, asked teachers; the next sentence turns to people today, far below them, who are ashamed to. That is the 尚且 of a harder case set against an easier one, and the sentence is 尚且跟从老师向他请教.",
        "以《师说》里的“犹且从师而问焉”为例：韩愈说古代的圣人远远超出一般人，“犹且从师而问焉”。“且”在一组比较的前一部分：他们那样高明，尚且向老师请教；下一句就转到今天的一般人，远不如圣人，却以从师为耻。先说难的情形也是这样，再对比容易的情形，这就是“尚且”，整句是“尚且跟从老师向他请教”。",
      ),
      watch: t(
        "且 between two adjectives is not 将要 or 姑且. In 河汉清且浅, from 迢迢牵牛星, 清 and 浅 are both said of the Milky Way at once, so 且 is 而且: 银河又清又浅. Before reading 且 as an adverb, see whether it joins two equal parts.",
        "两个形容词中间的“且”不是“将要”，也不是“姑且”。《迢迢牵牛星》里的“河汉清且浅”，“清”和“浅”同时说银河，“且”是“而且”：银河又清又浅。把“且”当成副词之前，先看它是不是连接着两个并列的部分。",
      ),
    },
  ),
  pair(
    10,
    "classical-function-words-10-02",
    t(
      "若 and 焉 each do very different jobs, and the same sentence can hold both. 若 opens a supposition, makes a likeness, or names the one spoken to; 焉 points back to a place, asks where or how, or only gives a tone.\n\nTake 若有作奸犯科及为忠善者，宜付有司论其刑赏 from 出师表. 若 opens the first clause, and the second, 宜付有司论其刑赏, says what should then be done: hand the case to the officials. A supposition followed by what to do about it is 如果: 如果有做奸邪事情、犯科条法令和尽忠行善的人，应当交给主管官员评定刑赏. Nothing is likened here, and Zhuge Liang is not naming his listener with 若. The two knowledge points practise 若, then 焉.",
      "“若”和“焉”各有几种差别很大的用法。“若”可以提出假设、打比方，或者称呼说话的对象；“焉”可以指代前面的地方，可以问哪里、怎么，也可以只表示语气。\n\n比如《出师表》里的“若有作奸犯科及为忠善者，宜付有司论其刑赏”。“若”在前一分句开头，后一分句“宜付有司论其刑赏”说出这时该怎么办：交给主管官员。提出一种情况，再说怎样处理，这是“如果”：“如果有做奸邪事情、触犯法令和尽忠行善的人，应当交给主管官员评定刑赏。”这里没有打比方，诸葛亮也不是用“若”称呼听话的人。两个知识点依次练习“若”和“焉”。",
    ),
    {
      word: "若",
      suffix: "ruo",
      usages: RUO,
      data: ruo,
      walk: t(
        "Walk through 若能以吴越之众与中国抗衡，不如早与之绝, from 赤壁之战: Zhuge Liang advises Sun Quan. 若 opens the first clause, and the second says what Sun Quan should then do: break with Cao Cao early. 若 is no likeness, for nothing is compared; and it is not the subject, for the subject is Sun Quan, understood. So 若 is 如果: 如果能凭借吴越的兵力和中原抗衡，不如早点和他断绝关系.",
        "以《赤壁之战》里的“若能以吴越之众与中国抗衡，不如早与之绝”为例：诸葛亮劝孙权。“若”在前一分句开头，后一分句说出孙权这时应该做的事：早和曹操断绝关系。这里没有拿什么来比，“若”不是“像”；句子的主语是省去的孙权，“若”也不是“你”。所以“若”是“如果”：“如果能凭借吴越的兵力和中原抗衡，不如早点和他断绝关系。”",
      ),
      watch: t(
        "若 at the head of a clause is not always 如果. In 若入前为寿, Fan Zeng gives an order and no result follows: 若 is the subject of 入, the man he speaks to, 你. Read 若 as 如果 only when a result follows it.",
        "分句开头的“若”不一定是“如果”。“若入前为寿”是范增下命令，后面没有说出结果：“若”是“入”的主语，就是听话的项庄，“你”。只有后面跟着结果时，才把“若”读作“如果”。",
      ),
    },
    {
      word: "焉",
      suffix: "yan",
      usages: YAN,
      data: yan,
      walk: t(
        "Walk through 积善成德，而神明自得，圣心备焉, from 劝学. 焉 ends the sentence after the verb 备, to be complete. Before it stands a thing it can point to: the virtue built up from good deeds. So 焉 is 于此, in it, and the sentence is 圣人的思想也就具备在这里了. It is not a question, for nothing is asked, and no adjective stands before it.",
        "以《劝学》里的“积善成德，而神明自得，圣心备焉”为例。“焉”在句末，跟在动词“备”（具备）后面。它前面有能指的东西：积累善行养成的品德。所以“焉”是“于此”，在这里，整句是“圣人的思想也就在这里具备了”。句子没有发问，“焉”也不是疑问代词；前面也不是形容词，不是词尾。",
      ),
      watch: t(
        "焉 at the end of a sentence is not always 于此. In 寒暑易节，始一反焉 nothing named before is a place the trip happens in: 焉 only closes the statement. Ask what 焉 would point to; if nothing, it is a particle of tone.",
        "句末的“焉”不一定是“于此”。“寒暑易节，始一反焉”里，前面没有哪个地方是往返发生的所在，“焉”只是结束这个陈述。先问一问“焉”能指什么；什么也指不了，它就是语气词。",
      ),
    },
  ),
  pair(
    10,
    "classical-function-words-10-03",
    t(
      "何 and 乎 both turn up in questions, but neither always asks one. 何 asks what, why or where, and before an adjective it exclaims; 乎 ends a real question or a rhetorical one, exclaims, or works as the preposition 于.\n\nTake 何为不去也 from 苛政猛于虎: Confucius asks the woman, whose family the tigers have killed, why she does not leave. 何为 stands before the verb 不去 and asks a reason: 为什么不离开呢. 何 is not 什么, for no thing is asked about, and not 哪里, for there is no 处. Each 何 and 乎 is told this way: by what it stands before or after, and by whether an answer is wanted. The two knowledge points practise 何, then 乎.",
      "“何”和“乎”都常出现在问句里，但都不一定是在发问。“何”可以问什么、为什么、哪里，放在形容词前面还能表示感叹；“乎”可以结束真正的疑问或反问，可以表示感叹，也可以当介词“于”用。\n\n比如《苛政猛于虎》里的“何为不去也”：孔子问那位家人都被老虎咬死的妇人，为什么不离开这里。“何为”放在动词“不去”前面，问的是原因：“为什么不离开呢？”这里没有问什么东西，不是“什么”；后面也没有“处”，不是“哪里”。每个“何”和“乎”都这样判断：看它在什么前面、什么后面，看说话人要不要对方回答。两个知识点依次练习“何”和“乎”。",
    ),
    {
      word: "何",
      suffix: "he",
      usages: HE,
      data: he,
      walk: t(
        "Walk through 何以战, from 曹刿论战: Cao Gui asks the duke what he will fight with. 何以 is 以何, the object 何 brought before the preposition 以, as a question word is in classical Chinese. 何 asks about a thing, the means: it is 什么, and the sentence is 凭什么作战. It does not ask why, for the answer the duke gives is a list of things he relies on.",
        "以《曹刿论战》里的“何以战”为例：曹刿问鲁庄公凭什么作战。“何以”就是“以何”，疑问代词“何”作介词“以”的宾语，按文言的习惯放在了前面。“何”问的是一样东西，作战的凭借，所以是“什么”，整句是“凭什么作战”。它问的不是为什么，鲁庄公的回答正是他所依靠的几件事。",
      ),
      watch: t(
        "何 before a verb is not always 为什么. In 大王来何操, 何 is the object of 操, to hold: the question is what the king brought, 带了什么, not why. Ask what the answer would be, a reason or a thing.",
        "动词前后的“何”不一定是“为什么”。“大王来何操”里，“何”是“操”（拿）的宾语，问的是大王带了什么，不是为什么。想一想回答会是一个理由，还是一样东西。",
      ),
    },
    {
      word: "乎",
      suffix: "hu",
      usages: HU,
      data: hu,
      walk: t(
        "Walk through 为人谋而不忠乎, from 论语: Zengzi lists what he asks himself each day. 乎 ends the sentence, and no 不亦, 宁 or 况 stands with it; it follows no adjective of praise, and no noun comes after it. Zengzi truly asks and must answer: it is 吗, and the sentence is 替别人谋划事情是不是不尽心呢.",
        "以《论语》里的“为人谋而不忠乎”为例：曾子列出他每天反省自己的问题。“乎”在句末，前面没有“不亦”“宁”“况”和它配合；它不跟在赞叹的形容词后面，后面也没有名词。曾子真的在问，要自己回答，所以是“吗”，整句是“替别人谋划事情是不是不尽心呢”。",
      ),
      watch: t(
        "A question with 乎 is not always a real one. 不亦说乎 looks like 不也是愉快的吗, but Confucius is not waiting for an answer: 不亦……乎 says it is delightful. Look for 不亦, 宁 and 况 before taking 乎 as a real question.",
        "带“乎”的问句不一定真的在问。“不亦说乎”看上去是“不也是愉快的吗”，可孔子并不等人回答：“不亦……乎”是在肯定它很愉快。把“乎”当作真正的疑问之前，先找一找有没有“不亦”“宁”“况”。",
      ),
    },
  ),
  {
    grade: 10,
    id: "classical-sentence-patterns-10-01",
    title: t("Classical Chinese: Kinds of Sentence", "文言文：特殊句式"),
    summary: t(
      "Judgments, passives, sentences with words left out, and the inversions of classical Chinese.",
      "文言文中的判断句、被动句、省略句和倒装句。",
    ),
    intro: t(
      "Some classical sentences are built unlike any modern one: a judgment with no 是, a passive with no 被, a part left out, or parts in another order. They are the kinds of sentence (特殊句式), and a translation must rebuild them in modern Chinese.\n\nTake 南阳刘子骥，高尚士也 from 桃花源记. It names a man and then says what he was, ending with 也, and has no 是: it is a judgment, and modern Chinese adds the 是, 南阳人刘子骥是一个品德高尚的名士. To tell the kind of a sentence, look for its marks: 者 and 也 for a judgment, 为, 见, 被 or a 于 after the verb for a passive, a gap where a word must be supplied, or a part in a place modern Chinese would not put it. The first knowledge point tells the four kinds apart, the second the four kinds of inversion.",
      "有些文言句子的结构和现代汉语都不一样：判断不用“是”，被动不用“被”，省去了某个成分，或者成分的顺序不同。这就是文言的特殊句式，翻译时要按现代汉语的说法把它们重新组织。\n\n比如《桃花源记》里的“南阳刘子骥，高尚士也”。句子先说出一个人，再说他是什么样的人，句末用“也”，没有“是”：这是判断句，翻译时补上“是”，“南阳人刘子骥是一个品德高尚的名士”。判断句式，要找它的标志：判断句有“者”“也”；被动句有“为”“见”“被”或动词后的“于”；省略句有一处要补出词语的空缺；倒装句有成分放在了现代汉语不放的位置。第一个知识点区分四种特殊句式，第二个区分四种倒装句。",
    ),
    points: [
      usagePoint({
        suffix: "kinds",
        title: t("Four Kinds of Sentence", "四种特殊句式"),
        explanation: explained(
          t(
            "Classical Chinese has four kinds of sentence that modern Chinese says differently, each with its marks:",
            "文言文有四种和现代汉语说法不同的特殊句式，各有各的标志：",
          ),
          [KINDS],
          t(
            "Walk through 不拘于时, from 师说: Han Yu praises Li Pan, who 不拘于时, was not bound by the custom of the times. The one bound would be Li Pan, the subject; 时, the custom, does the binding, and 于 after the verb 拘 brings it in. The subject suffers the action, marked by 于 after the verb: it is a passive, and modern Chinese says 不被时俗所拘束.",
            "以《师说》里的“不拘于时”为例：韩愈称赞李蟠“不拘于时”。受拘束的是主语李蟠，拘束人的是“时”，当时的风气，动词“拘”后面的“于”把它引了出来。主语承受动作，用动词后的“于”作标志，这是被动句，现代汉语说成“不被时俗所拘束”。",
          ),
          t(
            "A sentence with 于 is not always passive. In 战于长勺, 于 brings in a place, and the subject does the fighting: it is an inversion, 于长勺战. Ask whether the subject does the action or suffers it.",
            "有“于”的句子不一定是被动句。“战于长勺”里，“于”引出的是地点，交战的就是主语自己：这是倒装句，就是“于长勺战”。先问主语是发出动作，还是承受动作。",
          ),
        ),
        question: t("What kind of sentence is this?", "这是哪种特殊句式？"),
        usages: KINDS,
        data: kinds,
      }),
      usagePoint({
        suffix: "inversions",
        title: t("Four Kinds of Inversion", "四种倒装句"),
        explanation: explained(
          t(
            "An inverted sentence puts a part where modern Chinese would not. The four kinds:",
            "倒装句把某个成分放在了现代汉语不放的位置。四种倒装：",
          ),
          [INVERSIONS],
          t(
            "Walk through 夫晋，何厌之有, from 烛之武退秦师: Zhu Zhiwu warns that Jin is never satisfied. 有 is the verb, and what it has is 何厌, what satisfaction; that object stands before 有, with 之 between them to mark it. So it is 宾语前置, and modern Chinese puts it back: 晋国有什么满足的呢.",
            "以《烛之武退秦师》里的“夫晋，何厌之有”为例：烛之武说晋国永远不会满足。动词是“有”，“有”的对象是“何厌”，什么满足；这个宾语放在了“有”的前面，中间用“之”作标志。所以是宾语前置，现代汉语要调回来：“晋国有什么满足的呢？”",
          ),
          t(
            "Something before the subject is not always an object fronted. In 贤哉，回也, Confucius praises Yan Hui: 贤哉 says what 回 is, so it is the predicate put first, 主谓倒装. Only an object of a verb can be fronted as 宾语前置.",
            "放在主语前面的不一定是前置的宾语。“贤哉，回也”是孔子称赞颜回：“贤哉”说的是颜回怎么样，是谓语放在了前面，属于主谓倒装。只有动词的宾语提前，才是宾语前置。",
          ),
        ),
        question: t("What kind of inversion is this?", "这是哪种倒装句？"),
        usages: INVERSIONS,
        data: inversions,
      }),
    ],
  },
  pair(
    11,
    "classical-function-words-11-01",
    t(
      "因 and 与 are words of modern Chinese too, in 因为 and 和, and that is what makes them hard: their classical usages are mostly others. 因 carries on, relies on, follows or seizes a moment; 与 joins, gives, takes part, or ends a question.\n\nTake 因利乘便，宰割天下 from 过秦论: Qin took advantage of its position to carve up the world. 因 is followed by 利, an advantage, and then the action: Qin acted by means of it. So 因 is 凭借, and the sentence is 凭借有利的形势，割取天下的土地. It is not 因为, a cause, for 利 is something Qin used, not why it acted. The two knowledge points practise 因, then 与.",
      "“因”和“与”在现代汉语里也常用，在“因为”“和”这些词里，难也就难在这里：它们在文言中的用法大多不是这些。“因”可以表示接着、凭借、顺着、趁机；“与”可以表示和、给予、参与，还能用在句末表示疑问。\n\n比如《过秦论》里的“因利乘便，宰割天下”：秦国凭借有利的形势宰割天下。“因”后面跟着“利”，有利的条件，再接动作：秦国靠它去做事。所以“因”是“凭借”，整句是“凭借有利的形势，割取天下的土地”。它不是“因为”：“利”是秦国利用的东西，不是秦国这样做的原因。两个知识点依次练习“因”和“与”。",
    ),
    {
      word: "因",
      suffix: "yin",
      usages: YIN,
      data: yin,
      walk: t(
        "Walk through 因击沛公于坐，杀之, from 鸿门宴: Fan Zeng tells Xiang Zhuang to perform a sword dance and, while doing so, strike Liu Bang where he sits. 因 stands before the action 击 and makes the dance the chance for it: not what comes after the dance, nor a means, but the moment seized. So 因 is 趁机, and the sentence is 趁机在座位上击杀沛公.",
        "以《鸿门宴》里的“因击沛公于坐，杀之”为例：范增让项庄借舞剑助兴，在座位上刺杀刘邦。“因”放在动作“击”前面，舞剑正是下手的时机：不是舞完剑以后再做的事，也不是凭借的工具，而是借着眼前的时机。所以“因”是“趁机”，整句是“趁机在座位上刺杀沛公”。",
      ),
      watch: t(
        "Modern 因为 tempts in every 因, and none of the four usages here is 因为. In 因释其耒而守株, the farmer does not lay down his tool because of something: he has found the hare, and next he lays it down, so 因 is 于是.",
        "每个“因”都容易让人想到今天的“因为”，可这里的四种用法都不是“因为”。“因释其耒而守株”里，种田人放下农具不是“因为”什么，而是捡到兔子以后接着就放下了，所以“因”是“于是”。",
      ),
    },
    {
      word: "与",
      suffix: "yu",
      usages: YU,
      data: yu,
      walk: t(
        "Walk through 吾与徐公孰美, from 邹忌讽齐王纳谏: Zou Ji asks his wife who is handsomer. 与 stands between 吾 and 徐公 and puts them side by side to be compared; no thing is handed over, and nothing is taken part in. So 与 is 和, and the sentence is 我和徐公比，谁更俊美.",
        "以《邹忌讽齐王纳谏》里的“吾与徐公孰美”为例：邹忌问妻子，自己和徐公谁更俊美。“与”夹在“吾”和“徐公”中间，把两个人并列起来比较；没有给出什么东西，也没有参加什么事。所以“与”是“和”，整句是“我和徐公比，谁更俊美”。",
      ),
      watch: t(
        "与 before a noun is not always 和. In 则与斗卮酒, nothing is joined to the wine: 与 is the verb of the sentence, and the wine is what is handed to Fan Kuai. If no second person or thing stands before 与, it is likely the verb.",
        "名词前面的“与”不一定是“和”。“则与斗卮酒”里，没有什么和酒并列：“与”是句子的动词，酒是给樊哙的东西。如果“与”前面没有另一个和它并列的人或事物，它多半是动词。",
      ),
    },
  ),
  pair(
    11,
    "classical-function-words-11-02",
    t(
      "则 and 所 build the frames of many classical sentences: 则 links a condition to its result, sets two parts against each other, or judges; 所 makes nouns of verbs, names a place, marks a passive with 为, and joins 以 as 所以.\n\nTake 此所谓战胜于朝廷 from 邹忌讽齐王纳谏: after a year of open counsel, the other states pay court to Qi. 所 stands before the verb 谓, to call, and makes of it a noun, 所谓, what is called; the sentence judges that this is it. So 所 forms a 所 structure, and the sentence is 这就是人们所说的在朝廷上战胜别国. The two knowledge points practise 则, then 所.",
      "“则”和“所”搭起了许多文言句子的框架：“则”可以连接条件和结果，可以表示前后相反，也可以表示判断；“所”可以和动词组成名词性的结构，可以表示处所，可以和“为”组成被动句，还可以和“以”组成“所以”。\n\n比如《邹忌讽齐王纳谏》里的“此所谓战胜于朝廷”：齐王广开言路一年以后，各国都来朝见。“所”放在动词“谓”（称说）前面，组成名词性的“所谓”，人们所说的；句子判断“此”就是它。所以“所”组成“所”字结构，整句是“这就是人们所说的在朝廷上战胜别国”。两个知识点依次练习“则”和“所”。",
    ),
    {
      word: "则",
      suffix: "ze",
      usages: ZE,
      data: ze,
      walk: t(
        "Walk through 君子博学而日参省乎己，则知明而行无过矣, from 劝学. Before 则 is a condition, learning widely and examining oneself every day; after it is what comes of that, clear knowing and faultless conduct. The two parts do not clash, and nothing is judged to be another; the condition is stated, not supposed. So 则 is 就, and the sentence is 君子广泛地学习并且每天检查反省自己，就会见识明达，行为没有过错.",
        "以《劝学》里的“君子博学而日参省乎己，则知明而行无过矣”为例。“则”前面是条件，广泛学习并且每天反省自己；后面是由此得到的结果，见识明达，行为没有过错。前后不相反，也不是判断谁是谁；条件是直接说出来的，不是假设。所以“则”是“就”，整句是“君子广泛地学习并且每天检查反省自己，就会见识明达，行为没有过错”。",
      ),
      watch: t(
        "则 is not always 就. In 于其身也，则耻师焉, what follows runs against what came before: they find teachers for their sons, yet for themselves are ashamed to learn. Read 则 as 就 only if the second part follows from the first.",
        "“则”不一定是“就”。“于其身也，则耻师焉”里，后面的事和前面相反：给孩子请老师，对自己却以从师为耻。只有后一部分是从前一部分推出来的，才把“则”读作“就”。",
      ),
    },
    {
      word: "所",
      suffix: "suo",
      usages: SUO,
      data: suo,
      walk: t(
        "Walk through 此所以学者不可以不深思而慎取之也, from 游褒禅山记. 所 joins 以 as 所以, and the sentence ends with 也, judging what 此, the mistakes Wang Anshi has just described, is. It is the reason why students must think hard and choose with care: 所以 here is ……的原因, and the sentence is 这就是求学的人不能不深入思考、慎重选取的原因.",
        "以《游褒禅山记》里的“此所以学者不可以不深思而慎取之也”为例。“所”和“以”连用成“所以”，句末有“也”，判断“此”（王安石刚说的那些以讹传讹）是什么：它是求学的人必须深思慎取的原因。所以这里的“所以”是“……的原因”，整句是“这就是求学的人不能不深入思考、慎重选取的原因”。",
      ),
      watch: t(
        "所以 is not today's 所以, therefore. 此所以学者不可以不深思 does not mean 因此学者不可以不深思: in a classical 所以 the 所 makes a noun, the reason or the means, and the sentence names it. Look for 此 or 者 with it, which a noun of reason or means needs.",
        "文言的“所以”不是今天表示结果的“所以”。“此所以学者不可以不深思”不是“因此学者不能不深思”：文言的“所以”里，“所”组成名词性的结构，是原因或凭借，句子在说出它。它前后常有“此”或“者”，因为这样一个表示原因或凭借的名词性结构需要它们。",
      ),
    },
  ),
  pair(
    11,
    "classical-function-words-11-03",
    t(
      "也 and 者 are the commonest particles of classical Chinese, and they often work together: 者 marks what a sentence is about, and 也 closes what is said of it. Each also has other jobs: 也 asks, pauses or exclaims; 者 names a person or thing, follows a word of time, or sums up a number.\n\nTake 先生不知何许人也 from 五柳先生传. 也 ends the sentence, which says of the gentleman what he is: someone of unknown place. It is no question, though 何 is in it, for 何许 is part of what is said: 不知 is the verb, and Tao Yuanming asks no one. So 也 marks a judgment, and the sentence is 五柳先生不知道是什么地方的人. The two knowledge points practise 也, then 者.",
      "“也”和“者”是文言里最常用的助词，常常配合使用：“者”标出句子说的是谁，“也”结束对它的说明。它们也各有别的用法：“也”可以表示疑问、停顿、感叹；“者”可以指人或事物，可以用在时间词后，也可以用在数词后总括。\n\n比如《五柳先生传》里的“先生不知何许人也”。“也”在句末，句子说的是先生是什么人：不知道是什么地方的人。句中虽有“何”，却不是问句：“何许”是被说明的内容，“不知”才是谓语，陶渊明并没有在问谁。所以“也”表示判断，整句是“五柳先生不知道是什么地方的人”。两个知识点依次练习“也”和“者”。",
    ),
    {
      word: "也",
      suffix: "ye",
      usages: YE,
      data: ye,
      walk: t(
        "Walk through 是说也，人常疑之, from 石钟山记. 也 does not end the sentence: it follows 是说, this explanation, the subject, and the sentence goes on to what people think of it, 人常疑之. A 也 inside a sentence, after its subject, gives a pause before what is said: 这种说法，人们常常怀疑它.",
        "以《石钟山记》里的“是说也，人常疑之”为例。“也”不在句末：它跟在主语“是说”（这种说法）后面，句子接着说人们对它的看法，“人常疑之”。句子中间、主语后面的“也”，表示停顿，引出后面的话：“这种说法，人们常常怀疑它。”",
      ),
      watch: t(
        "也 at the end of a sentence is not always a judgment. In 寡人之民不加多，何也, the king asks a question with 何, and 也 closes it as 呢: there is nothing judged to be something else. Look for a question word before calling 也 a judgment.",
        "句末的“也”不一定表示判断。“寡人之民不加多，何也”是梁惠王用“何”提出的问题，“也”相当于“呢”，并没有判断谁是什么。说“也”表示判断之前，先看看句中有没有疑问词。",
      ),
    },
    {
      word: "者",
      suffix: "zhe",
      usages: ZHE,
      data: zhe,
      walk: t(
        "Walk through 知者不惑，仁者不忧，勇者不惧, from 论语. Each 者 follows a word of quality, 知, wise, 仁, kind, 勇, brave, and makes with it the people who are so; what follows says how they are, 不惑, 不忧, 不惧. There is no 也 to close a judgment, no word of time, no number. So 者 is ……的人, and the sentence is 聪明的人不迷惑，仁德的人不忧愁，勇敢的人不畏惧.",
        "以《论语》里的“知者不惑，仁者不忧，勇者不惧”为例。每个“者”都跟在表示品质的词后面，“知”（聪明）、“仁”、“勇”，和它们一起指具有这种品质的人；后面说的是这些人怎么样，“不惑”“不忧”“不惧”。句末没有表示判断的“也”，“者”前面也不是时间词或数词。所以“者”是“……的人”，整句是“聪明的人不迷惑，仁德的人不忧愁，勇敢的人不畏惧”。",
      ),
      watch: t(
        "者 after a noun at the head of a sentence is not 的人. In 粟者，民之所种, from 论贵粟疏, 粟, grain, is already a thing, and what follows judges what it is: 者 only marks a pause before the judgment. Ask whether 者 makes a new noun or follows one that is already there.",
        "句首名词后面的“者”不是“……的人”。《论贵粟疏》里的“粟者，民之所种”，“粟”本身就是一样东西，后面是对它的判断：“者”只表示停顿，引出判断。先问一问“者”是组成了一个新的名词性结构，还是跟在一个现成的名词后面。",
      ),
    },
  ),
  {
    grade: 11,
    id: "classical-words-11-01",
    title: t("Classical Chinese: Words Used Anew and Words Changed", "文言文：词类活用和古今异义"),
    summary: t(
      "Words used as another part of speech, and words whose meaning has changed since classical times.",
      "文言文中的词类活用，以及古今意义不同的词。",
    ),
    intro: t(
      "Two things about classical words often trip a reader of today. A word may work, in one sentence, as another part of speech (词类活用); and a word may look like a modern one and mean something else (古今异义).\n\nTake 沛公军霸上 from 鸿门宴. 军 is a noun, an army, yet here it stands where the verb must be, between 沛公 and the place 霸上: Liu Bang 军 at Bashang. A noun in a verb's place names an action, so 军 is 驻军, and the sentence is 沛公在霸上驻军. Read as a noun, 沛公的军队霸上, the sentence has no verb at all. The first knowledge point tells four kinds of word used anew apart; the second practises words whose meaning has changed.",
      "文言词语有两种情况常常难住今天的读者：一个词在句子里临时用作别的词性，这是词类活用；一个词和现代汉语的词写法相同，意思却不一样，这是古今异义。\n\n比如《鸿门宴》里的“沛公军霸上”。“军”本是名词，军队，可它在这里站在动词的位置上，夹在“沛公”和地点“霸上”之间：沛公在霸上“军”。名词放在动词的位置上，表示动作，“军”就是驻军，整句是“沛公在霸上驻军”。如果把它当名词读，“沛公的军队霸上”，句子就没有动词了。第一个知识点区分四种词类活用，第二个练习古今异义的词。",
    ),
    points: [
      usagePoint({
        suffix: "flexible",
        title: t("Words Used as Another Part of Speech", "词类活用"),
        explanation: explained(
          t(
            "A classical word can work as another part of speech in a sentence. Four kinds, and how each is told:",
            "文言文中的词在句子里可以临时活用作别的词性。四种活用及其判断方法：",
          ),
          [FLEXIBLE],
          t(
            "Walk through 外连衡而斗诸侯, from 过秦论: abroad, Shang Yang's Qin made the alliances set the states against each other. 斗, to fight, takes 诸侯, the states, as object, but Qin does not fight them here: the states fight each other, and Qin makes them. A verb with an object that means making the object act is 使动用法, and the sentence is 对外实行连横策略，使诸侯自相争斗.",
            "以《过秦论》里的“外连衡而斗诸侯”为例：对外，秦国用连横之策让各国互相争斗。“斗”带着宾语“诸侯”，可这里不是秦国和诸侯打：争斗的是诸侯自己，是秦国使他们争斗。动词带宾语，意思是使宾语怎么样，这是使动用法，整句是“对外实行连横策略，使诸侯自相争斗”。",
          ),
          t(
            "使动 and 意动 look alike: both put an object after an adjective or a noun. Tell them by what really happens. In 邑人奇之, from 伤仲永, the townsfolk do not make Zhongyong remarkable; they think him remarkable, so it is 意动. If the object is made so in fact, it is 使动; if only thought so, 意动.",
            "使动和意动看上去很像：都是形容词或名词后面带着宾语。区分它们要看实际发生了什么。《伤仲永》里的“邑人奇之”，同县的人并没有使仲永变得奇特，只是认为他奇特，所以是意动。宾语真的变成这样，是使动；只是心里认为这样，是意动。",
          ),
        ),
        question: t("How is the word in brackets used in this sentence?", "括号里的字在这句话中是什么活用？"),
        usages: FLEXIBLE,
        data: flexible,
      }),
      wordPoint({
        suffix: "old-and-new",
        title: t("Words Whose Meaning Has Changed", "古今异义"),
        explanation: t(
          "Some words read the same as a modern word but meant something else: the meaning has grown, shrunk or moved, or two words of one character each have become one word of two.\n\nTake 牺牲玉帛，弗敢加也 from 曹刿论战: Duke Zhuang says he never overstates his offerings to the spirits. Today 牺牲 is to give one's life; here it stands beside 玉帛, jade and silk, among offerings, so it is the beasts offered in sacrifice, 祭祀用的牛羊猪. The sentence is 祭祀用的牛羊猪和玉器丝织品，我从来不敢虚报.\n\n> **Watch out.** A two-character word of today may be two words in a classical sentence. 可以一战 is not 可以, may, but 可, can, and 以, by means of it: 可以凭借这个打一仗. When a modern word makes a sentence read oddly, try its characters one by one.",
          "有些词和现代汉语的词写法相同，意思却不一样：词义扩大了、缩小了、转移了，或者原来是两个单音词，后来合成了一个双音词。\n\n比如《曹刿论战》里的“牺牲玉帛，弗敢加也”：鲁庄公说自己祭祀神灵从不虚报。今天“牺牲”是为正义献出生命；这里它和“玉帛”并列，都是祭品，所以是祭祀用的牲畜。整句是“祭祀用的牛羊猪和玉器丝织品，我从来不敢虚报”。\n\n> **注意。** 今天的一个双音词，在文言句子里可能是两个词。“可以一战”不是今天的“可以”，而是“可”和“以”：“可以凭借这个打一仗”。用今天的词义读起来别扭时，就把它拆成单个的字来理解。",
        ),
        question: t("What does the word in brackets mean in this sentence?", "括号里的词在这句话中是什么意思？"),
        kind: "changed",
        data: oldAndNew,
      }),
    ],
  },
];
