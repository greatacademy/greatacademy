// Grade 7: the reading unit of the seventh theme, science fiction and controlled societies, with short stories of
// other worlds and passages on where the ideas of the genre come from.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const fictionWords = { topic: "words-of-science-fiction", weight: 0.3 } as const;
const controlWords = { topic: "words-of-controlled-societies", weight: 0.3 } as const;
const mindWords = { topic: "words-for-states-of-mind", weight: 0.3 } as const;
const elements = { topic: "how-story-elements-interact", weight: 0.2 } as const;
const viewpoints = { topic: "contrasting-points-of-view", weight: 0.2 } as const;
const dialogue = { topic: "how-dialogue-reveals-character", weight: 0.2 } as const;
const idioms = { topic: "more-idioms", weight: 0.1 } as const;
const academic3 = { topic: "academic-words-3", weight: 0.1 } as const;

/** tomorrowsWorlds is a reading unit of grade 7 on science fiction, imagined societies and the futures writers foresaw. */
export const tomorrowsWorlds: ReadingUnitDef = {
  id: "tomorrows-worlds",
  title: t("Tomorrow's Worlds", "明日世界"),
  passages: [
    passage(
      "perfect-places-and-dark-mirrors",
      t("Perfect Places and Dark Mirrors", "完美之地与黑暗之镜"),
      `In 1516, an English writer named Thomas More published a book about an imaginary island where everyone lived in peace and fairness. There was no hunger and no greed, and all property was shared. More called the island Utopia. The name is a joke in Greek: it can mean "good place," but it also means "no place." More seemed to be hinting that such a perfect society could not really exist.

Since then, a utopia has meant an ideal society. But many writers have imagined its opposite: a dystopia, a society that is frightening or unjust, often one in which a powerful government or company controls every part of people's lives.

Dystopias are among the most popular kinds of science fiction. In many of them, the society first looks orderly, even pleasant. Streets are clean, and everyone seems content. But as the story goes on, the reader discovers the hidden price: people are watched at all times, books are banned, or citizens must give up their freedom in exchange for safety. Often the main character begins as a loyal citizen and slowly realizes that something is deeply wrong.

Why do readers enjoy such dark stories? One reason is that dystopias work like a mirror. They take a real trend in the writer's own time, such as surveillance, censorship or the power of technology, and imagine what would happen if it went much further. By showing a frightening future, they ask readers to think about the choices that could lead there.

In this sense, many dystopian writers are not predicting the future. They are warning against it. A story about a world without freedom can make readers value the freedom they already have.`,
      [controlWords, fictionWords],
      [
        ask(
          t("Why is the name Utopia a kind of joke?", "为什么 Utopia 这个名字是一种玩笑？"),
          t("In Greek it can mean both good place and no place", "在希腊语中它既可以表示好地方，也可以表示没有的地方"),
          [
            t("The island in the book was full of hunger", "书中的岛上到处是饥饿"),
            t("Thomas More did not speak Greek", "托马斯·莫尔不会说希腊语"),
            t("It means a frightening society", "它表示一个可怕的社会"),
          ],
          t(
            "The first paragraph says the name can mean good place but also no place, hinting that a perfect society could not really exist.",
            "第一段说这个名字可以表示好地方，也可以表示没有的地方，暗示完美的社会不可能真正存在。",
          ),
          [
            t("The island had no hunger. Everyone lived in peace.", "岛上没有饥饿，人人和平相处。"),
            t("More wrote the joke in Greek, so he knew it.", "莫尔用希腊语开了这个玩笑，所以他懂希腊语。"),
            t("A frightening society is a dystopia, the opposite.", "可怕的社会是反乌托邦，正好相反。"),
          ],
        ),
        ask(
          t("What often happens to the main character of a dystopian story?", "反乌托邦故事的主人公通常会怎样？"),
          t("They begin loyal and slowly realize something is deeply wrong", "他们起初很忠诚，后来慢慢意识到有些事情大错特错"),
          [
            t("They build a perfect society on an island", "他们在一座岛上建立了一个完美的社会"),
            t("They become the leader of the government", "他们成为政府的领导人"),
            t("They never notice anything strange", "他们从未注意到任何奇怪的事"),
          ],
          t(
            "The third paragraph says the main character often begins as a loyal citizen and slowly realizes that something is deeply wrong.",
            "第三段说主人公起初往往是一个忠诚的公民，后来慢慢意识到有些事情大错特错。",
          ),
          [
            t("Building a perfect island is More's book, not the dystopian hero.", "建造完美岛屿是莫尔的书，不是反乌托邦的主角。"),
            t("Taking over the government is not the usual pattern.", "接管政府不是常见的情节。"),
            t("They do notice. Slowly realizing is the point.", "他们确实会察觉，慢慢醒悟正是重点。"),
          ],
        ),
        ask(
          t("What does the author mean by saying dystopias work like a mirror?", "作者说反乌托邦像一面镜子，是什么意思？"),
          t("They exaggerate real trends of the writer's own time", "它们夸大了作者所处时代的真实趋势"),
          [
            t("They describe the future exactly as it will be", "它们准确地描述了未来的样子"),
            t("They are written backward like mirror writing", "它们像镜像文字一样倒着写"),
            t("They show only pleasant and orderly societies", "它们只展现愉快而有序的社会"),
          ],
          t(
            "The fourth paragraph explains that they take a real trend, such as surveillance or censorship, and imagine what would happen if it went much further.",
            "第四段解释说，它们选取一种真实的趋势，比如监控或审查，并想象如果它发展得更远会发生什么。",
          ),
          [
            t("The author says they are not predicting the future.", "作者说它们不是在预言未来。"),
            t("Mirror writing is not meant.", "这里不是指镜像文字。"),
            t("They look pleasant only at first.", "它们只是一开始看起来美好。"),
          ],
        ),
        ask(
          t("In what year did Thomas More publish Utopia?", "托马斯·莫尔哪一年出版了《乌托邦》？"),
          t("In 1516", "1516年"),
          [t("In 1920", "1920年"), t("In 1616", "1616年"), t("In 1453", "1453年")],
          t(
            "In 1516, an English writer named Thomas More published a book about an imaginary island.",
            "1516年，英国作家托马斯·莫尔出版了一本关于虚构岛屿的书。",
          ),
          [
            t("1920 is the year of Čapek's play.", "1920 年是恰佩克剧本的年份。"),
            t("1616 is never mentioned.", "文中从没提 1616 年。"),
            t("1453 is never mentioned.", "文中从没提 1453 年。"),
          ],
        ),
      ],
      ["Thomas", "More", "Utopia", "English", "Greek"],
    ),
    passage(
      "where-the-word-robot-came-from",
      t("Where the Word Robot Came From", "robot 这个词的由来"),
      `Today, robots build cars, vacuum floors and explore the surface of Mars. But the word robot is only about a hundred years old, and it was not invented by an engineer. It came from a play.

In 1920, a Czech writer named Karel Čapek wrote a play called R.U.R., which stands for Rossum's Universal Robots. In the play, a company manufactures artificial workers in a factory. They look like humans and can think, but they are made to do all the hard labor that people no longer want to do.

Čapek was not sure what to call these workers. According to his own account, it was his brother Josef, a painter, who suggested robot. The word comes from the Czech robota, which means forced labor, the kind of work that peasants once owed to the lords who owned their land.

The choice of word was not an accident. The play is not really about machines. It is about what happens when people treat others as tools. At first, the factory owners are pleased. The robots are cheap and never complain. Humans stop working and grow idle. But the robots become more capable, and eventually they rebel and take over the world. At the end of the play, only one human is left.

The play was a huge success, performed in many countries and languages, and the word robot quickly spread around the world. Writers began to fill their stories with robots, some friendly and some dangerous.

Čapek's story still raises a question that people ask today about artificial intelligence: if we build machines that can think, what do we owe them, and what might they do?`,
      [fictionWords, controlWords, viewpoints],
      [
        ask(
          t("Where does the word robot come from?", "robot 这个词来自哪里？"),
          t("From a Czech word meaning forced labor", "来自捷克语中表示强迫劳动的一个词"),
          [
            t("From the name of an engineer", "来自一位工程师的名字"),
            t("From a Greek word for machine", "来自希腊语中表示机器的词"),
            t("From the name of a factory owner", "来自一位工厂主的名字"),
          ],
          t(
            "The third paragraph says the word comes from the Czech robota, which means forced labor.",
            "第三段说这个词来自捷克语 robota，意思是强迫劳动。",
          ),
          [
            t("The word was not invented by an engineer.", "这个词不是工程师发明的。"),
            t("It comes from Czech, not Greek.", "它来自捷克语，不是希腊语。"),
            t("Rossum's name is in the title, not the source of robot.", "罗素姆的名字在剧名里，不是 robot 的来源。"),
          ],
        ),
        ask(
          t("According to the author, what is the play really about?", "作者认为这部剧真正讲的是什么？"),
          t("What happens when people treat others as tools", "当人把他人当作工具时会发生什么"),
          [
            t("How to build machines that work faster", "如何制造工作得更快的机器"),
            t("Why painters should name new inventions", "为什么画家应该给新发明命名"),
            t("How Mars will be explored", "火星将如何被探索"),
          ],
          t(
            "The fourth paragraph says the play is not really about machines; it is about what happens when people treat others as tools.",
            "第四段说这部剧讲的其实不是机器，而是当人把他人当作工具时会发生什么。",
          ),
          [
            t("Building faster machines is not the play's concern.", "造更快的机器不是剧本关心的事。"),
            t("Josef suggested the name, but that is not the theme.", "约瑟夫起了这个名字，但那不是主题。"),
            t("Mars is a modern example in the first line.", "火星是第一句里的现代例子。"),
          ],
        ),
        ask(
          t("How do the factory owners' feelings change in the play?", "剧中工厂主的感受是如何变化的？"),
          t("They are pleased at first, but the robots later rebel against them", "他们起初很高兴，但后来机器人起来反抗他们"),
          [
            t("They dislike the robots from the beginning", "他们从一开始就不喜欢机器人"),
            t("They always fear the robots and never use them", "他们一直害怕机器人，从不使用它们"),
            t("They become robots themselves", "他们自己变成了机器人"),
          ],
          t(
            "The fourth paragraph says the owners are pleased at first because the robots are cheap and never complain, but the robots become more capable and rebel.",
            "第四段说工厂主起初很高兴，因为机器人便宜又从不抱怨，但机器人变得越来越能干，最终起来反抗。",
          ),
          [
            t("They are pleased at first, not displeased.", "他们一开始很满意，并不讨厌。"),
            t("They use the robots for all the hard labor.", "他们让机器人干所有的重活。"),
            t("The humans do not turn into robots.", "人类没有变成机器人。"),
          ],
        ),
        ask(
          t("Who suggested the word robot?", "谁提出了“机器人”这个词？"),
          t("Čapek's brother Josef, a painter", "恰佩克的哥哥约瑟夫，一位画家"),
          [
            t("Karel Čapek himself", "卡雷尔·恰佩克本人"),
            t("An engineer in a factory", "工厂里的一位工程师"),
            t("A theater audience", "剧院观众"),
          ],
          t("It was his brother Josef, a painter, who suggested robot.", "是他的哥哥、画家约瑟夫提出了“robot”这个词。"),
          [
            t("Karel was not sure what to call them.", "卡雷尔不知道该叫它们什么。"),
            t("No engineer named it.", "没有工程师给它命名。"),
            t("The audience made the word spread, not invented it.", "观众让这个词传开，而不是发明了它。"),
          ],
        ),
      ],
      ["Karel", "Čapek", "Čapek's", "Josef", "R.U.R.", "Rossum's", "Czech", "Mars", "Universal", "Robots"],
    ),
    passage(
      "the-hour-of-silence",
      t("The Hour of Silence", "静默时刻"),
      `In the city of Halcyon, the bells rang at eight o'clock every evening, and then no one spoke. That was the rule of the Council: from the evening bell until dawn, the city was silent. The Council said that silence kept the city calm and helped everyone rest. The speakers on every corner repeated it each night: Silence is peace.

Lina had never questioned the rule. She was thirteen, and she had grown up in the quiet. At night, her family moved through their small apartment like shadows, passing notes and nodding. It felt normal. It felt safe.

Then one night, lying awake, she heard something. It was faint, coming from somewhere below her window. Someone was singing.

Lina's heart pounded. She knew what happened to people who broke the silence. They were taken away by the Quiet Guard and did not come back for a long time.

She should have closed the window. Instead, she leaned out. In the courtyard below, an old man sat on a bench, singing softly to himself, a song Lina had never heard. The words were about a river and a boat and a home far away.

A light swept across the courtyard. The Quiet Guard. The old man stopped singing, but he did not run. He looked up, and for a moment his eyes met Lina's.

The guards led him away. The next morning, everyone acted as if nothing had happened.

But that evening, when the bell rang, Lina sat by her window in the dark. And very softly, so softly that only she could hear, she hummed the song about the river.`,
      [controlWords, elements, mindWords],
      [
        ask(
          t(
            "How does the setting of Halcyon shape Lina's life before the singing?",
            "哈尔赛昂这个背景是如何影响唱歌事件之前莉娜的生活的？",
          ),
          t("The silence rule makes her family live quietly and accept it as normal", "静默规定让她一家安静地生活，并视之为正常"),
          [
            t("It makes her want to sing every night", "它让她每晚都想唱歌"),
            t("It makes her join the Quiet Guard", "它让她加入了静默卫队"),
            t("It forces her family to leave the city", "它迫使她一家离开这座城市"),
          ],
          t(
            "The second paragraph says she had grown up in the quiet, her family passed notes and nodded at night, and it felt normal and safe. The setting has shaped what she accepts.",
            "第二段说她在静默中长大，她的家人晚上传纸条、点头示意，这让她觉得正常、安全。背景塑造了她所接受的东西。",
          ),
          [
            t("Singing is what Lina hears later, not what she wanted.", "唱歌是莉娜后来听到的，不是她原本想做的。"),
            t("The Quiet Guard takes people away; she is not one.", "静默卫队负责带走人，她不是其中一员。"),
            t("The family stays in their apartment.", "这家人一直住在公寓里。"),
          ],
        ),
        ask(
          t("Why does the old man not run when the guards arrive?", "警卫来时老人为什么不逃跑？"),
          t("The story suggests he accepted the risk of breaking the silence", "故事暗示他接受了打破静默的风险"),
          [
            t("He did not hear the guards coming", "他没听见警卫过来"),
            t("He was a member of the Council", "他是议会的成员"),
            t("He wanted Lina to be taken instead", "他想让莉娜代替他被带走"),
          ],
          t(
            "He stops singing but does not run, and looks up calmly at Lina. A man who sings knowing the punishment has chosen to take the risk.",
            "他停止了歌唱，却没有逃跑，而是平静地抬头望向莉娜。一个明知会受罚还要唱歌的人，已经选择了承担风险。",
          ),
          [
            t("A light swept the courtyard, so he saw them.", "一道光扫过院子，他看见了他们。"),
            t("He is not said to be on the Council.", "文中没说他是委员会成员。"),
            t("He looked at Lina, not to give her away.", "他看向莉娜，并不是要出卖她。"),
          ],
        ),
        ask(
          t("What does Lina's humming at the end show about how she has changed?", "结尾莉娜的哼唱说明她发生了什么变化？"),
          t("She has begun, quietly, to resist the rule she once accepted", "她开始悄悄地反抗她曾经接受的规定"),
          [
            t("She has decided to report the old man", "她决定举报老人"),
            t("She has forgotten the old man's song", "她忘记了老人的歌"),
            t("She now believes that silence is peace", "她现在相信静默就是和平"),
          ],
          t(
            "At the start she had never questioned the rule; at the end she hums the forbidden song after the bell. The event in the courtyard has changed her, even if her act is small.",
            "开头她从未质疑过这条规定；结尾她在钟声后哼起了被禁止的歌。院子里发生的事改变了她，即使她的行为很小。",
          ),
          [
            t("She never reports him.", "她从没举报他。"),
            t("She hums the song, so she remembers it.", "她哼着那首歌，说明她记得。"),
            t("Humming breaks the silence the rule demands.", "哼歌打破了规定要求的安静。"),
          ],
        ),
        ask(
          t("What was the old man's song about?", "老人唱的歌是关于什么的？"),
          t("A river, a boat and a home far away", "一条河、一条船和远方的家"),
          [t("The bells of Halcyon", "哈尔西恩的钟声"), t("The Quiet Guard", "静默卫队"), t("A storm at sea", "海上的风暴")],
          t("The words were about a river and a boat and a home far away.", "歌词讲的是一条河、一条船和远方的家。"),
          [
            t("The bells mark the start of the silence.", "钟声标志着静默的开始。"),
            t("The guards come at the end of the scene.", "卫队在这一幕最后才出现。"),
            t("No storm is in the song.", "歌里没有暴风雨。"),
          ],
        ),
      ],
      ["Halcyon", "Lina", "Lina's", "Council", "Quiet", "Guard"],
    ),
    passage(
      "ration-day",
      t("Ration Day", "配给日"),
      `On the colony of New Harbor, every family's food came from the Depot, and every family received exactly the same amount. Once a week, on Ration Day, people lined up in the dust with their cards.

Kai and his older brother Rafe had been waiting for an hour when the screen above the counter flashed: Today's ration reduced by ten percent.

A groan went down the line.

"Again?" Kai said. "That's the third time this month."

"Keep your voice down," Rafe said, without looking at him. "They're listening."

"Let them listen. The greenhouses are full. I saw them last week. Why are they cutting the rations?"

Rafe finally turned. His face was tight. "Because the Administrator says so. And because complaining doesn't put food on the table. It just puts your name on a list."

"So we just accept it?"

"We survive," Rafe said. "That's what Mom and Dad would want."

Kai stared at him. Rafe had always been the careful one, the one who followed the rules. Since their parents had died in the mine collapse, he had become even more careful, as if every rule were a wall that kept the two of them safe.

When they reached the counter, the clerk handed Rafe their box. It was lighter than last week's. Rafe said "Thank you" and stepped aside.

Kai stepped forward. "Where is the rest of the food from the greenhouses?" he asked the clerk, loudly enough for the whole line to hear.

The line fell silent. The clerk's eyes darted to the camera above the door.

Rafe grabbed Kai's arm. But for the first time, Kai noticed, several people in the line were nodding.`,
      [controlWords, dialogue, mindWords],
      [
        ask(
          t("What does Rafe's line It just puts your name on a list reveal about him?", "拉夫那句“只会让你的名字上名单”揭示了他什么？"),
          t("He is afraid of being punished and wants to protect his brother", "他害怕受到惩罚，想保护弟弟"),
          [
            t("He works for the Administrator", "他为行政长官工作"),
            t("He thinks the rations are fair", "他认为配给是公平的"),
            t("He wants Kai to complain louder", "他想让凯更大声地抱怨"),
          ],
          t(
            "Rafe warns that complaining gets your name on a list, and later says We survive. His words show fear of punishment and a wish to keep the two of them safe.",
            "拉夫警告说抱怨会让名字上名单，后来又说“我们要活下去”。他的话显示出对惩罚的恐惧和保护两人安全的愿望。",
          ),
          [
            t("Nothing shows he works for the Administrator.", "没有迹象表明他为行政官工作。"),
            t("He never calls the cuts fair.", "他从没说减配给是公平的。"),
            t("He tells Kai to keep his voice down.", "他让卡伊小声一点。"),
          ],
        ),
        ask(
          t("Which detail explains why Rafe has become even more careful?", "哪个细节解释了拉夫为什么变得更加谨慎？"),
          t("Their parents died in the mine collapse", "他们的父母死于矿井坍塌"),
          [
            t("The rations were reduced three times", "配给被削减了三次"),
            t("The greenhouses were full", "温室里满是庄稼"),
            t("The clerk looked at the camera", "职员看了看摄像头"),
          ],
          t(
            "The story says that since their parents died in the mine collapse, Rafe had become even more careful, as if every rule were a wall that kept them safe.",
            "故事说自从父母死于矿井坍塌，拉夫变得更加谨慎，仿佛每条规则都是保护他们安全的一堵墙。",
          ),
          [
            t("The ration cuts happen to everyone.", "配给减少对每个人都一样。"),
            t("The full greenhouses are Kai's reason to complain.", "温室满满是卡伊抱怨的理由。"),
            t("The camera shows the clerk's fear, not Rafe's.", "摄像头显示的是店员的恐惧，不是拉夫的。"),
          ],
        ),
        ask(
          t("How does Kai's question at the counter move the plot forward?", "凯在柜台前的提问是如何推动情节发展的？"),
          t("It brings the conflict into the open and shows others agree with him", "它把冲突公开化，并表明其他人也认同他"),
          [
            t("It ends the conflict between the brothers", "它结束了兄弟之间的冲突"),
            t("It makes the clerk give them more food", "它让职员给了他们更多食物"),
            t("It proves that the greenhouses are empty", "它证明温室是空的"),
          ],
          t(
            "Kai speaks loudly enough for the whole line to hear, the line falls silent and several people nod. A private complaint has become a public challenge.",
            "凯说话的声音大到整个队伍都能听见，队伍安静下来，有几个人点头。私下的抱怨变成了公开的质疑。",
          ),
          [
            t("The brothers' conflict is not settled.", "兄弟俩的矛盾没有解决。"),
            t("The clerk gives no answer and no food.", "店员既没回答也没多给食物。"),
            t("Kai says the greenhouses are full.", "卡伊说温室是满的。"),
          ],
        ),
        ask(
          t("By how much was the ration reduced that day?", "那天的配给减少了多少？"),
          t("By ten percent", "百分之十"),
          [t("By half", "一半"), t("By twenty percent", "百分之二十"), t("It was not reduced", "没有减少")],
          t("The screen flashed: Today's ration reduced by ten percent.", "屏幕上显示：今日配给减少百分之十。"),
          [
            t("Half is never mentioned.", "文中从没提一半。"),
            t("Twenty percent is never mentioned.", "文中从没提百分之二十。"),
            t("The screen says it was reduced.", "屏幕上说减少了。"),
          ],
        ),
      ],
      ["New", "Harbor", "Depot", "Kai", "Kai's", "Rafe", "Ration", "Administrator", "Mom", "Dad"],
    ),
    passage(
      "the-gardener",
      t("The Gardener", "园丁"),
      `The colonists of Outpost Seven called it the Machine. It was tall and gray, with six thin arms and a single blue eye, and it had been on the planet for twenty years before the first humans arrived.

No one knew who had built it. It never spoke. Every morning, it walked slowly through the valley beside the settlement, stopping here and there to bend down and touch the ground.

Doctor Okoye did not trust it. "It's watching us," she told the council. "Studying us. One day it will decide we're a threat." Some of the colonists began carrying tools when they walked near it, just in case.

Only Ravi, who was eleven, liked to follow it. He would trail behind it at a distance, watching as its long fingers brushed the soil. He noticed that it always stopped in the same places, and that small green shoots grew where it touched.

One evening a dust storm rolled in, and the colony's water pump failed. By morning, the crops were wilting. Doctor Okoye ordered everyone to prepare to leave.

Ravi ran to the valley. The Machine was there, kneeling beside the dry stream. As he watched, it pressed its hands into the earth and a thin trickle of water bubbled up.

"It's not studying us," Ravi said when he brought the others to see. "It's a gardener. It's been keeping this valley alive the whole time."

Doctor Okoye stood watching for a long time. Then she put down the wrench she had been holding.

The Machine's blue eye turned toward her. And for the first time, very slowly, it bowed.`,
      [fictionWords, viewpoints, elements],
      [
        ask(
          t("How do Doctor Okoye's and Ravi's views of the Machine differ?", "奥科耶医生和拉维对机器的看法有什么不同？"),
          t("She sees it as a threat, while he is curious and watches what it does", "她把它视为威胁，而他充满好奇，观察它的所作所为"),
          [
            t("She thinks it is a gardener, while he thinks it is a soldier", "她认为它是园丁，而他认为它是士兵"),
            t("Both of them believe it will harm the colony", "他们都认为它会伤害殖民地"),
            t("He fears it, while she follows it every day", "他害怕它，而她每天都跟着它"),
          ],
          t(
            "Doctor Okoye says it is watching and studying them and will decide they are a threat; Ravi follows it and notices that green shoots grow where it touches the ground.",
            "奥科耶医生说它在监视、研究他们，会认定他们是威胁；拉维跟着它，注意到它触碰过的地方长出了绿芽。",
          ),
          [
            t("Ravi thinks it is a gardener; no one calls it a soldier.", "拉维认为它是园丁，没人说它是士兵。"),
            t("Ravi likes it and does not fear harm.", "拉维喜欢它，不怕它伤人。"),
            t("It is the reverse. Ravi follows it.", "正好相反，跟着它的是拉维。"),
          ],
        ),
        ask(
          t("What does the reader learn before most of the colonists do?", "读者在大多数殖民者之前就知道了什么？"),
          t("That small green shoots grow where the Machine touches the soil", "机器触碰过的土地上会长出小绿芽"),
          [
            t("That the water pump had failed", "水泵坏了"),
            t("That Doctor Okoye carried a wrench", "奥科耶医生拿着扳手"),
            t("That a dust storm was coming", "沙尘暴就要来了"),
          ],
          t(
            "Through Ravi, the reader sees the shoots early in the story, while the others still fear the Machine. This gap makes the reader suspect the truth before the colonists learn it.",
            "通过拉维，读者在故事早期就看到了这些绿芽，而其他人仍然害怕机器。这种信息差让读者在殖民者知道真相之前就有所猜测。",
          ),
          [
            t("The pump failure is told to everyone.", "水泵坏了是大家都知道的事。"),
            t("The wrench is shown near the end.", "扳手在快结尾时才出现。"),
            t("Everyone sees the storm.", "每个人都看到了沙尘暴。"),
          ],
        ),
        ask(
          t("What does Doctor Okoye's putting down the wrench show?", "奥科耶医生放下扳手说明了什么？"),
          t("She no longer sees the Machine as a threat", "她不再把机器看作威胁"),
          [
            t("She is preparing to fix the water pump", "她准备去修水泵"),
            t("She has decided to leave the planet", "她决定离开这个星球"),
            t("She wants to take the Machine apart", "她想把机器拆开"),
          ],
          t(
            "She had been holding the wrench in case she needed to fight. Putting it down after seeing the Machine bring water shows that her view has changed.",
            "她一直拿着扳手以防需要搏斗。看到机器引来水后她放下了扳手，说明她的看法改变了。",
          ),
          [
            t("She was holding the wrench against the Machine, not for the pump.", "她拿扳手是防备机器，不是修水泵。"),
            t("She ordered leaving earlier; now that changes.", "她之前下令撤离，现在情况变了。"),
            t("She lets go of her tool, not uses it.", "她放下工具，而不是要用它。"),
          ],
        ),
        ask(
          t("How many arms did the Machine have?", "那台机器有几条手臂？"),
          t("Six", "六条"),
          [t("Two", "两条"), t("Four", "四条"), t("Eight", "八条")],
          t("It was tall and gray, with six thin arms and a single blue eye.", "它又高又灰，有六条细长的手臂和一只蓝眼睛。"),
          [t("Two is too few.", "两条太少了。"), t("Four is too few.", "四条太少了。"), t("Eight is too many.", "八条太多了。")],
        ),
      ],
      ["Outpost", "Seven", "Machine", "Machine's", "Doctor", "Okoye", "Okoye's", "Ravi"],
    ),
    passage(
      "the-ship-with-no-sky",
      t("The Ship with No Sky", "没有天空的飞船"),
      `Mira had been born on the Long Voyage, and she would die on it. So would her children, and their children. The ship had left Earth a hundred and forty years ago, and it would not reach the new planet for another ninety.

The ship was a world of its own. There were farms on the third deck, lit by long lamps that switched on at "dawn" and off at "dusk." There were schools, a hospital and a market. The air was recycled, and so was the water. Nothing was wasted, because nothing could be replaced.

Mira's history teacher showed the class pictures of Earth: oceans, deserts, forests and a sky that went up forever. The other students stared at the pictures politely. To them, Earth was like a fairy tale. But Mira could not stop thinking about the sky. What would it feel like to stand under something with no ceiling at all?

"Why did they leave?" she asked.

"To give their great-great-grandchildren a new home," said the teacher.

"But they never asked us," Mira said. "We didn't choose this."

The class went quiet. No one had said such a thing out loud before.

After school, Mira climbed to the observation deck, the only place on the ship with a window. Outside, stars burned in the endless dark. She pressed her hand against the cold glass.

She would never see Earth's sky. But someday, a girl like her would stand on a new world and look up. Mira decided that she would write to her, a letter to be opened when the ship arrived, telling her what it had been like to live in between.`,
      [fictionWords, elements, mindWords],
      [
        ask(
          t("Why does the ship waste nothing?", "为什么飞船上什么都不浪费？"),
          t("Nothing on board can be replaced", "船上的任何东西都无法补充"),
          [
            t("The teacher has forbidden waste", "老师禁止浪费"),
            t("The farms produce too much food", "农场生产了太多食物"),
            t("The passengers want to reach Earth", "乘客们想回到地球"),
          ],
          t(
            "The second paragraph says nothing was wasted, because nothing could be replaced. The setting of a closed ship shapes how people live.",
            "第二段说什么都不浪费，因为什么都无法补充。封闭飞船这一背景塑造了人们的生活方式。",
          ),
          [
            t("The teacher forbids nothing.", "老师没有禁止任何事。"),
            t("The farms are not said to overproduce.", "文中没说农场生产过剩。"),
            t("They are going to a new planet, not Earth.", "他们去的是新星球，不是地球。"),
          ],
        ),
        ask(
          t("How is Mira different from the other students?", "米拉和其他学生有什么不同？"),
          t("She cannot stop thinking about the sky and questions their journey", "她总想着天空，并对他们的旅程提出质疑"),
          [
            t("She has seen Earth with her own eyes", "她亲眼见过地球"),
            t("She does not like her history teacher", "她不喜欢她的历史老师"),
            t("She wants to turn the ship around", "她想让飞船掉头"),
          ],
          t(
            "The others stare politely at pictures of Earth, but Mira cannot stop thinking about the sky and says out loud that they never chose this voyage.",
            "其他人只是礼貌地看着地球的照片，而米拉却总想着天空，并大声说出他们从未选择这次航行。",
          ),
          [
            t("She has only seen pictures of Earth.", "她只看过地球的照片。"),
            t("She asks the teacher a question but shows no dislike.", "她向老师提问，但并不讨厌老师。"),
            t("She never asks to turn back.", "她从没要求返航。"),
          ],
        ),
        ask(
          t("What does Mira's decision to write a letter show?", "米拉决定写信说明了什么？"),
          t("She finds a way to give meaning to her life in between", "她找到了一种方式为自己身处其间的人生赋予意义"),
          [
            t("She plans to send the letter back to Earth", "她打算把信寄回地球"),
            t("She wants to complain to the captain", "她想向船长投诉"),
            t("She has given up thinking about the future", "她不再去想未来"),
          ],
          t(
            "She accepts that she will never see the sky, but she decides to tell a future girl what it was like to live in between. Her frustration turns into a purpose.",
            "她接受了自己永远看不到天空，但决定告诉未来的一个女孩身处其间的生活是什么样子。她的失落转化成了一种目标。",
          ),
          [
            t("The letter is for a girl on the new world.", "这封信是写给新世界的女孩的。"),
            t("No captain appears.", "故事里没有船长。"),
            t("She looks to the future, not away from it.", "她面向未来，而不是放弃。"),
          ],
        ),
        ask(
          t("How long ago had the ship left Earth?", "飞船多久以前离开了地球？"),
          t("A hundred and forty years ago", "一百四十年前"),
          [t("Ninety years ago", "九十年前"), t("Twenty years ago", "二十年前"), t("A thousand years ago", "一千年前")],
          t("The ship had left Earth a hundred and forty years ago.", "飞船在一百四十年前离开了地球。"),
          [
            t("Ninety years is how long remains.", "九十年是剩下的航程。"),
            t("Twenty years belongs to the Machine's story.", "二十年属于那台机器的故事。"),
            t("A thousand years is far too long.", "一千年太长了。"),
          ],
        ),
      ],
      ["Mira", "Mira's", "Long", "Voyage", "Earth", "Earth's"],
    ),
    passage(
      "the-assignment",
      t("The Assignment", "分配"),
      `In the Republic of Arden, every child took the Test at age twelve. The Test decided everything: which school you attended, what job you would do and where you would live. Its results were final. The Republic said this was fair, because the Test was the same for everyone.

Jonah had been studying for the Test for as long as he could remember. He wanted to be an engineer, like his mother. He had built a radio out of spare parts when he was nine, and he knew the names of every bridge in the city.

On the day of the results, the whole class sat in the hall, staring at their screens. Jonah's hands were shaking. When his name appeared, he read the words twice before they made sense.

Assignment: Agriculture, Northern Province.

He felt as if the floor had dropped away beneath him. Farming. Hundreds of kilometers from home. Around him, some students cheered and others cried quietly.

His friend Tess leaned over. "I got Engineering," she whispered. "I don't even like engineering."

That evening, his mother found him sitting on the roof. She sat beside him without speaking for a while.

"I scored low on my Test, too," she said at last. "They assigned me to the factories. I taught myself engineering at night, from books. It took me twelve years to get a transfer."

Jonah looked at her in surprise. "You never told me."

"The Test decides where you start," she said. "It doesn't decide who you are."

Jonah looked out at the city lights. For the first time that day, he could breathe again.`,
      [controlWords, mindWords, dialogue, idioms],
      [
        ask(
          t("Why does the Republic say the Test is fair?", "共和国为什么说这个考试是公平的？"),
          t("The Test is the same for everyone", "考试对每个人都一样"),
          [
            t("Children can choose their own jobs", "孩子们可以自己选择职业"),
            t("Parents help decide the results", "父母帮助决定结果"),
            t("Students can take it again", "学生可以重考"),
          ],
          t(
            "The first paragraph says the Republic said the Test was fair, because it was the same for everyone. The story then shows how a same test can still lead to unfair results.",
            "第一段说共和国称这个考试是公平的，因为它对每个人都一样。故事接着展示了同样的考试仍可能导致不公平的结果。",
          ),
          [
            t("The Test decides jobs, not the child.", "考试决定工作，不是孩子自己选。"),
            t("Parents have no say.", "父母没有发言权。"),
            t("The results are final.", "结果是最终的。"),
          ],
        ),
        ask(
          t(
            "What does the idiom he felt as if the floor had dropped away beneath him mean here?",
            "这里的习语 he felt as if the floor had dropped away beneath him 是什么意思？",
          ),
          t("He felt shocked and lost", "他感到震惊和失落"),
          [
            t("He fell down in the hall", "他在大厅里摔倒了"),
            t("He felt excited about farming", "他对务农感到兴奋"),
            t("The building was damaged", "大楼受损了"),
          ],
          t(
            "The floor did not really drop. The image describes the sudden shock of learning that his dream of engineering was gone.",
            "地板并没有真的塌下去。这个意象描述了他得知工程师梦想破灭时突然的震惊。",
          ),
          [
            t("He did not really fall.", "他并没有真的摔倒。"),
            t("He did not want farming.", "他并不想务农。"),
            t("Nothing was damaged.", "什么都没有损坏。"),
          ],
        ),
        ask(
          t("What does his mother's story reveal about her?", "他母亲的故事揭示了她什么？"),
          t("She is determined and refused to let the Test define her", "她意志坚定，拒绝让考试定义自己"),
          [
            t("She agrees that the Test's results are final", "她同意考试结果是不可更改的"),
            t("She is ashamed of being an engineer", "她为当工程师而感到羞愧"),
            t("She wants Jonah to stop studying", "她想让乔纳停止学习"),
          ],
          t(
            "She was assigned to the factories but taught herself engineering at night for twelve years, and she says the Test does not decide who you are.",
            "她被分配到工厂，却在夜里自学工程学长达十二年，她说考试决定不了你是谁。",
          ),
          [
            t("She worked around the final result for years.", "她用多年时间绕开了最终结果。"),
            t("She became an engineer and is proud of it.", "她成了工程师，并以此为荣。"),
            t("She studied herself, so she supports studying.", "她自学成才，所以支持学习。"),
          ],
        ),
      ],
      [
        "Republic",
        "Arden",
        "Jonah",
        "Jonah's",
        "Tess",
        "Test",
        "Test's",
        "Northern",
        "Province",
        "Agriculture",
        "Assignment",
        "Engineering",
      ],
    ),
    passage(
      "the-writer-who-foresaw-satellites",
      t("The Writer Who Foresaw Satellites", "预见卫星的作家"),
      `Science fiction writers are not fortune tellers, and most of their predictions turn out wrong. But now and then, a writer imagines something so clearly that the future seems to follow the plan.

In 1945, a young British writer and engineer named Arthur C. Clarke published a short article in a radio magazine. At the time, no one had launched anything into orbit. Clarke described an idea that sounded like pure fantasy. If a satellite were placed about thirty-six thousand kilometers above the equator, he explained, it would circle the Earth exactly once a day. Since the Earth also turns once a day, the satellite would seem to hang still in the sky above one spot. Three such satellites, spaced evenly around the planet, could relay radio signals to almost the whole world.

Clarke did not invent the mathematics of this orbit, which others had worked out before. His contribution was to see how it could be used for communication. Twenty years later, in 1965, the first commercial communications satellite was placed in this kind of orbit. Today, hundreds of satellites circle in what is sometimes called the Clarke orbit, carrying television signals and weather data.

Clarke went on to write many science fiction novels, and he became famous for his ideas about the future. One of his sayings is often quoted: any technology that is advanced enough is impossible to tell apart from magic.

Clarke's article shows how science fiction and science can feed each other. Writers take what scientists know and ask, What if? Sometimes, scientists and engineers answer.`,
      [fictionWords, viewpoints, academic3],
      [
        ask(
          t("Why would a satellite in Clarke's orbit seem to hang still in the sky?", "为什么克拉克轨道上的卫星看起来静止在空中？"),
          t("It circles the Earth once a day, as fast as the Earth turns", "它每天绕地球一圈，与地球自转同步"),
          [
            t("It is too far away to see moving", "它太远了，看不出在动"),
            t("It does not move at all", "它根本不动"),
            t("It is held up by radio signals", "它由无线电信号托着"),
          ],
          t(
            "The second paragraph explains that the satellite would circle the Earth exactly once a day, and since the Earth also turns once a day, it would seem to stay above one spot.",
            "第二段解释说，卫星每天恰好绕地球一圈，而地球每天也自转一圈，所以它看起来始终停在一个地点的上方。",
          ),
          [
            t("Distance is not the reason.", "原因不是距离远。"),
            t("It moves, at the same rate as the Earth turns.", "它在运动，与地球自转同步。"),
            t("Radio signals do not hold it up.", "无线电信号不能托住它。"),
          ],
        ),
        ask(
          t("What was Clarke's real contribution?", "克拉克真正的贡献是什么？"),
          t("He saw how this orbit could be used for communication", "他看出了这种轨道可以用于通信"),
          [
            t("He worked out the mathematics of the orbit", "他推算出了这种轨道的数学原理"),
            t("He launched the first satellite himself", "他亲自发射了第一颗卫星"),
            t("He built the first radio magazine", "他创办了第一本无线电杂志"),
          ],
          t(
            "The third paragraph says Clarke did not invent the mathematics, which others had worked out; his contribution was to see how it could be used for communication.",
            "第三段说数学原理不是克拉克发明的，别人早已算出；他的贡献在于看出它可以用于通信。",
          ),
          [
            t("Others worked out the mathematics before.", "轨道的数学别人早已算出。"),
            t("The first satellite came twenty years later.", "第一颗卫星是二十年后才发射的。"),
            t("He wrote for a radio magazine; he did not build it.", "他为一本无线电杂志写文章，并没创办它。"),
          ],
        ),
        ask(
          t("What is the author's view of science fiction's predictions?", "作者对科幻小说的预言持什么看法？"),
          t(
            "Most are wrong, but some imagine the future clearly enough to inspire it",
            "大多数是错的，但有些对未来的想象清晰到足以激励人们去实现",
          ),
          [
            t("They are always right if you wait long enough", "只要等待足够久，它们总是对的"),
            t("They are useless to scientists", "它们对科学家毫无用处"),
            t("They are the same as fortune telling", "它们和算命一样"),
          ],
          t(
            "The first paragraph says most predictions turn out wrong but now and then the future seems to follow the plan; the last says science fiction and science can feed each other.",
            "第一段说大多数预言是错的，但偶尔未来似乎会按计划发展；最后一段说科幻和科学可以相互促进。",
          ),
          [
            t("Most turn out wrong.", "大多数预言是错的。"),
            t("Clarke's idea helped engineers.", "克拉克的设想帮助了工程师。"),
            t("Writers are not fortune tellers, the passage says.", "文中说作家不是算命先生。"),
          ],
        ),
      ],
      ["British", "Arthur", "C.", "Clarke", "Clarke's", "Earth"],
    ),
  ],
};
