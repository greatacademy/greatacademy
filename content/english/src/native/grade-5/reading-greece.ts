// Grade 5: the reading unit of the fifth theme, ancient Greece, from its mountains and city-states to the ideas it
// left the world.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "./reading-kit.ts";

const greeceWords = { topic: "words-of-ancient-greece", weight: 0.3 } as const;
const ideaWords = { topic: "words-of-greek-ideas-and-learning", weight: 0.3 } as const;
const governmentWords = { topic: "words-for-government-and-choices", weight: 0.3 } as const;
const history = { topic: "connecting-events-in-history", weight: 0.2 } as const;
const structures = { topic: "comparing-structures-of-two-texts", weight: 0.2 } as const;
const legend = { topic: "legend-or-history", weight: 0.2 } as const;
const academic2 = { topic: "academic-words-2", weight: 0.1 } as const;

/** ancientGreece is a reading unit of grade 5 on the land, the city-states and the ideas of ancient Greece. */
export const ancientGreece: ReadingUnitDef = {
  id: "ancient-greece",
  title: t("Ancient Greece", "古希腊"),
  passages: [
    passage(
      "land-of-mountains-and-sea",
      t("Land of Mountains and Sea", "山与海之地"),
      `Look at a map of Greece and you will see a land broken into pieces. Steep, rocky mountains cover most of it, and the sea reaches deep into the land on almost every side. Hundreds of small islands lie scattered across the blue water.

This land shaped the way the ancient Greeks lived. Because the mountains made travel over land slow and hard, villages in different valleys grew up apart from one another. Each valley became its own small world, with its own leaders and its own customs.

The mountains also left little flat land for farming. The soil was thin and stony, good for olive trees and grapevines but poor for large fields of wheat. To get enough grain, many Greeks had to trade for it.

That is where the sea came in. No place in Greece is very far from the coast, so the Greeks became skilled sailors. Their ships carried olive oil, wine and painted pots to ports around the Mediterranean Sea and came home with grain, metal and new ideas.

In this way, the mountains kept the Greeks apart, while the sea brought them together with the wider world.`,
      [greeceWords, history],
      [
        ask(
          t("Why did villages in different valleys grow up apart?", "为什么不同山谷里的村庄彼此分开发展？"),
          t("The mountains made travel over land slow and hard", "群山使陆路旅行又慢又难"),
          [
            t("The rulers of Greece forbade them to meet", "希腊的统治者禁止他们见面"),
            t("Each valley was on a separate island", "每个山谷都在不同的岛上"),
            t("The villages spoke completely different languages", "这些村庄说完全不同的语言"),
          ],
          t(
            "The second paragraph gives the cause: the mountains made travel slow and hard, so each valley became its own small world.",
            "第二段给出了原因：群山使旅行又慢又难，所以每个山谷都成了一个独立的小世界。",
          ),
        ),
        ask(
          t("Why did many Greeks have to trade for grain?", "为什么许多希腊人必须通过贸易获得粮食？"),
          t("The thin, stony soil was poor for wheat", "贫瘠多石的土壤不适合种小麦"),
          [
            t("They preferred to grow only flowers", "他们只喜欢种花"),
            t("Their ships were too small for farming", "他们的船太小，不能种地"),
            t("The sea had flooded all their fields", "海水淹没了他们所有的田地"),
          ],
          t(
            "The third paragraph says the soil was good for olives and grapes but poor for large fields of wheat, so they traded for grain.",
            "第三段说，土壤适合种橄榄和葡萄，却不适合大片种植小麦，所以他们要通过贸易获得粮食。",
          ),
        ),
        ask(
          t("How does the last sentence sum up the passage?", "最后一句话怎样总结了全文？"),
          t("Mountains divided the Greeks, and the sea connected them", "群山把希腊人分开，大海把他们联系起来"),
          [
            t("The Greeks liked the sea more than the mountains", "希腊人喜欢大海胜过群山"),
            t("The mountains were the only reason for trade", "群山是贸易的唯一原因"),
            t("The Greeks never left their own valleys", "希腊人从不离开自己的山谷"),
          ],
          t(
            "The last sentence joins the two causes the passage has explained: the mountains kept the Greeks apart, while the sea brought them together with the world.",
            "最后一句把文章解释过的两个原因联系在一起：群山让希腊人彼此分开，而大海把他们与外面的世界联系起来。",
          ),
        ),
      ],
    ),
    passage(
      "city-states",
      t("City-States", "城邦"),
      `Ancient Greece was never one country with one ruler. Instead, it was made up of hundreds of city-states. A city-state was a city together with the farms and villages around it, and it governed itself like a tiny nation.

Each city-state had its own laws, its own army and often its own money. Most were small. Many had only a few thousand citizens, and a person could walk from one side to the other in a day.

At the center of most city-states stood a hill called an acropolis, where people built temples and could gather for safety in times of war. Below it lay the agora, an open marketplace where citizens bought food, traded news and argued about the affairs of the city.

The city-states did not always get along. They often competed with one another and sometimes went to war. Yet all of them shared the same language, worshipped the same gods and told the same stories. They called themselves Hellenes, and everyone else they called barbarians, which meant people whose speech sounded like nonsense.

The two most famous city-states, Athens and Sparta, were very different, as you will see.`,
      [governmentWords, greeceWords],
      [
        ask(
          t("What was a city-state?", "什么是城邦？"),
          t("A city and the land around it, governing itself", "一座城市及其周边土地，自己管理自己"),
          [
            t("A part of Greece ruled by a single king", "由一位国王统治的希腊的一部分"),
            t("A large country made up of many islands", "由许多岛屿组成的大国"),
            t("A marketplace where citizens traded news", "市民交换消息的市场"),
          ],
          t(
            "The first paragraph defines a city-state as a city with its farms and villages that governed itself like a tiny nation. The agora was the marketplace.",
            "第一段把城邦定义为一座城市连同周围的农田和村庄，像一个小国家一样自治。市场是 agora。",
          ),
        ),
        ask(
          t("What was the acropolis used for?", "卫城有什么用途？"),
          t("Temples, and a safe place in times of war", "建神庙，战时也是安全的地方"),
          [
            t("Buying food and arguing about laws", "买食物和争论法律"),
            t("Training the army for the Olympic Games", "训练军队参加奥运会"),
            t("Keeping barbarians out of the farms", "把外族人挡在农田之外"),
          ],
          t(
            "The third paragraph says people built temples on the acropolis and gathered there for safety in war. Buying food happened in the agora.",
            "第三段说，人们在卫城上建神庙，战时在那里聚集避难。买食物是在 agora 进行的。",
          ),
        ),
        ask(
          t("What did all the city-states share?", "所有的城邦有什么共同之处？"),
          t("A language, their gods and their stories", "语言、神灵和故事"),
          [
            t("One army and one set of laws", "一支军队和一套法律"),
            t("The same ruler and the same money", "同一个统治者和同一种货币"),
            t("A promise never to go to war", "永不开战的约定"),
          ],
          t(
            "The fourth paragraph says they shared the same language, gods and stories, even though each had its own laws, army and money.",
            "第四段说，它们有相同的语言、神灵和故事，尽管各有自己的法律、军队和货币。",
          ),
        ),
      ],
    ),
    passage(
      "athens-and-the-first-democracy",
      t("Athens and the First Democracy", "雅典与最早的民主"),
      `About 2,500 years ago, the people of Athens tried something new. Instead of letting a king or a few rich families decide everything, they decided that citizens would rule themselves. They called this democracy, from two Greek words meaning "people" and "power."

In Athens, any citizen could come to the Assembly, a great meeting held on a hillside about forty times a year. Thousands gathered there to debate and vote on laws, on taxes and even on whether to go to war. Votes were often counted by a show of hands.

Many public jobs were filled not by election but by lottery. Names were drawn at random, so that ordinary citizens, not only the rich and powerful, would take turns running the city. Juries in the courts were chosen the same way and could have hundreds of members.

Athenian democracy had serious limits, however. Only free men born in Athens counted as citizens. Women, enslaved people and foreigners living in the city could not vote at all.

Even so, the idea that people can govern themselves spread far beyond Athens. Many countries today have democracies, though most elect representatives instead of voting on every law themselves.`,
      [governmentWords, history],
      [
        ask(
          t("Where does the word democracy come from?", "democracy 这个词从哪里来？"),
          t('Two Greek words meaning "people" and "power"', '两个意思是 "people" 和 "power" 的希腊词'),
          [
            t('A Greek word meaning "king of the city"', '一个意思是 "king of the city" 的希腊词'),
            t("The name of the hill where Athenians met", "雅典人集会的那座山的名字"),
            t("The name of the first leader of Athens", "雅典第一位领袖的名字"),
          ],
          t(
            'The first paragraph says democracy comes from two Greek words meaning "people" and "power."',
            '第一段说，democracy 来自两个希腊词，意思是 "people" 和 "power"。',
          ),
        ),
        ask(
          t("Why were many public jobs filled by lottery?", "为什么许多公职通过抽签产生？"),
          t("So ordinary citizens would take turns, not only the rich", "让普通公民轮流担任，而不只是富人"),
          [
            t("So the king could choose his own friends", "让国王能选择自己的朋友"),
            t("Because no one in Athens could count votes", "因为雅典没有人会计票"),
            t("Because the jobs were too dangerous to want", "因为这些职位太危险，没人想要"),
          ],
          t(
            "The third paragraph says names were drawn at random so that ordinary citizens, not only the rich and powerful, would take turns.",
            "第三段说，随机抽取名字，是为了让普通公民而不只是有钱有势的人轮流管理城市。",
          ),
        ),
        ask(
          t("Who could not vote in Athens?", "在雅典，哪些人不能投票？"),
          t("Women, enslaved people and foreigners", "妇女、奴隶和外国人"),
          [
            t("Any man who was born in Athens", "任何生在雅典的男子"),
            t("Members of the juries in the courts", "法庭陪审团的成员"),
            t("Citizens who lived on the hillside", "住在山坡上的公民"),
          ],
          t(
            "The fourth paragraph says only free men born in Athens were citizens; women, enslaved people and foreigners could not vote.",
            "第四段说，只有生在雅典的自由男子才是公民；妇女、奴隶和外国人都不能投票。",
          ),
        ),
      ],
    ),
    passage(
      "life-in-sparta",
      t("Life in Sparta", "斯巴达的生活"),
      `If Athens was a city of debate, Sparta was a city of soldiers. Everything in Sparta was organized around one goal: building the strongest army in Greece.

Spartan boys left home at the age of seven to live in groups and train together. They learned to run, wrestle, fight and survive with very little. They were given thin clothes and plain food, and they slept on beds of reeds they gathered themselves. The training was meant to make them tough, obedient and loyal to the city above everything else.

Spartan girls trained too. They ran races and threw spears, because the Spartans believed strong mothers would have strong children. Spartan women could own land and run households, which gave them more freedom than women in most other city-states.

Sparta was governed differently from Athens. It had two kings at the same time, and a small council of older men made most of the important decisions.

The Spartans were also known for saying a lot in very few words. Our word "laconic," which means using few words, comes from Laconia, the region where Sparta stood. When an enemy king threatened, "If I invade, I will destroy your city," the Spartans are said to have replied with a single word: "If."`,
      [governmentWords, structures, academic2],
      [
        ask(
          t("What was the main goal of life in Sparta?", "斯巴达生活的主要目标是什么？"),
          t("Building the strongest army in Greece", "建立希腊最强大的军队"),
          [
            t("Holding the greatest debates in Greece", "举行希腊最伟大的辩论"),
            t("Trading olive oil across the sea", "跨海贩卖橄榄油"),
            t("Choosing leaders by lottery", "通过抽签选领导人"),
          ],
          t(
            "The first paragraph states it directly: everything was organized around building the strongest army in Greece.",
            "第一段直接说明：一切都围绕着建立希腊最强大的军队来安排。",
          ),
        ),
        ask(
          t("Why did Spartan girls train too?", "斯巴达女孩为什么也要训练？"),
          t("Spartans believed strong mothers had strong children", "斯巴达人相信强壮的母亲会生出强壮的孩子"),
          [
            t("Girls had to fight in every war", "女孩每场战争都必须参战"),
            t("Girls were sent to live with soldiers at seven", "女孩七岁就被送去和士兵一起生活"),
            t("Girls wanted to win the Olympic Games", "女孩想赢得奥运会"),
          ],
          t(
            "The third paragraph gives the reason: the Spartans believed strong mothers would have strong children.",
            "第三段给出了原因：斯巴达人相信强壮的母亲会生出强壮的孩子。",
          ),
        ),
        ask(
          t('What does the reply "If" show about the Spartans?', '回答 "If" 体现了斯巴达人的什么特点？'),
          t("They could say a lot in very few words", "他们能用极少的话表达很多意思"),
          [
            t("They did not understand the enemy king", "他们没听懂敌国国王的话"),
            t("They were too frightened to answer fully", "他们害怕得不敢完整回答"),
            t("They only knew one word of Greek", "他们只会一个希腊词"),
          ],
          t(
            'The last paragraph uses the reply as an example of saying a lot in few words: "If" means the enemy may never manage to invade.',
            '最后一段用这个回答举例说明言简意赅："If" 的意思是敌人未必能攻进来。',
          ),
        ),
      ],
    ),
    passage(
      "the-olympic-games",
      t("The Olympic Games", "奥林匹克运动会"),
      `Every four years, Greeks from all the city-states traveled to Olympia, a valley in the south of Greece, for the greatest festival of the ancient world. The Olympic Games were held in honor of Zeus, the king of the gods, and the first ones recorded took place in 776 BCE.

The games were so important that a sacred truce was announced before them. Messengers traveled from city to city, and for the weeks of the festival, wars were paused so that athletes and visitors could travel safely.

At first, the only event was a short running race, about the length of the stadium. Over time, more events were added: longer races, wrestling, boxing, chariot races and the pentathlon, which combined five events, including the long jump and throwing the discus.

The winners did not receive gold medals. Instead, each was crowned with a wreath of olive leaves cut from a sacred tree. But back home, a champion was treated like a hero. Some cities gave winners free meals for life, and poets wrote songs in their honor.

The ancient games ended about 1,600 years ago. In 1896, they were brought back to life in Athens, and today athletes from almost every country take part.`,
      [greeceWords, legend],
      [
        ask(
          t("What was the sacred truce?", "什么是神圣休战？"),
          t("A pause in wars so people could travel safely", "暂停战争，让人们能安全出行"),
          [
            t("A race run in honor of Zeus", "为纪念宙斯而举行的赛跑"),
            t("A promise to give winners free meals", "给获胜者免费饭食的承诺"),
            t("A wreath of leaves from a sacred tree", "用圣树叶子编成的花环"),
          ],
          t(
            "The second paragraph says that during the truce wars were paused so athletes and visitors could travel safely.",
            "第二段说，休战期间战争暂停，让运动员和观众能安全出行。",
          ),
        ),
        ask(
          t("What did the winners of the ancient games receive at Olympia?", "古代奥运会的获胜者在奥林匹亚得到什么？"),
          t("A wreath of olive leaves", "一个橄榄叶花环"),
          [t("A gold medal", "一枚金牌"), t("A bag of coins", "一袋钱币"), t("A new chariot", "一辆新战车")],
          t(
            "The fourth paragraph says winners did not receive gold medals; each was crowned with a wreath of olive leaves.",
            "第四段说，获胜者没有金牌，而是戴上一个橄榄叶花环。",
          ),
        ),
        ask(
          t("Which sentence tells how the ancient games and the modern games are connected?", "哪句话说明了古代奥运会和现代奥运会的联系？"),
          t("In 1896, they were brought back to life in Athens", "1896 年，奥运会在雅典重新举办"),
          [
            t("The first recorded games took place in 776 BCE", "有记录的第一届运动会于公元前 776 年举行"),
            t("At first, the only event was a short running race", "起初唯一的项目是一场短跑"),
            t("Poets wrote songs in honor of the champions", "诗人为冠军写歌"),
          ],
          t(
            "The last paragraph links the two: the ancient games ended, and in 1896 they were brought back to life in Athens.",
            "最后一段把两者联系起来：古代运动会结束了，1896 年又在雅典重新举办。",
          ),
        ),
      ],
    ),
    passage(
      "the-thinkers-of-athens",
      t("The Thinkers of Athens", "雅典的思想家"),
      `Some of the most famous people of ancient Athens never won a battle or ruled a city. They became famous for asking questions.

Socrates walked the streets and the agora, stopping people to ask them things that seemed simple. What is courage? What is justice? What makes a good life? When someone gave an answer, Socrates asked another question, and then another, until the person saw that the answer was not as simple as it seemed. Teachers still use this way of learning through questions, and they name it after him. Socrates wrote nothing down. We know about him mainly from his student Plato.

Plato founded a school called the Academy, where students studied mathematics, the stars and the right way to govern a city. It lasted for hundreds of years, and the word "academy" is still used for schools today.

Plato's most famous student was Aristotle. He was curious about almost everything: plants, animals, the weather, poetry and politics. He collected and sorted huge numbers of observations, and many people call him one of the first scientists.

Teacher to student, student to teacher, these three thinkers passed their ideas down a chain that still reaches us.`,
      [ideaWords, history],
      [
        ask(
          t("How did Socrates help people think more carefully?", "苏格拉底怎样帮助人们更仔细地思考？"),
          t("He kept asking questions about their answers", "他不断就他们的回答提出问题"),
          [
            t("He wrote long books for them to read", "他写了很长的书给他们读"),
            t("He gave them the right answers at once", "他立刻告诉他们正确答案"),
            t("He sent them to study at the Academy", "他送他们去学园学习"),
          ],
          t(
            "The second paragraph says he asked another question, and then another, until people saw their answers were not so simple. He wrote nothing down.",
            "第二段说，他一个问题接一个问题地问，直到人们发现自己的答案并不简单。他什么也没写下来。",
          ),
        ),
        ask(
          t("How do we know about Socrates?", "我们是怎样了解苏格拉底的？"),
          t("Mainly from the writing of his student Plato", "主要通过他的学生柏拉图的著作"),
          [
            t("From the books Socrates wrote himself", "通过苏格拉底自己写的书"),
            t("From the observations Aristotle collected", "通过亚里士多德收集的观察记录"),
            t("From the laws of the Assembly", "通过公民大会的法律"),
          ],
          t(
            "The second paragraph says Socrates wrote nothing down and that we know about him mainly from his student Plato.",
            "第二段说，苏格拉底什么也没写下来，我们主要是从他的学生柏拉图那里了解他的。",
          ),
        ),
        ask(
          t("How are the three thinkers connected?", "这三位思想家有什么联系？"),
          t("Each was the teacher of the next", "每一位都是下一位的老师"),
          [
            t("They were brothers in one family", "他们是一家的兄弟"),
            t("They ruled Athens one after another", "他们先后统治雅典"),
            t("They argued and never met", "他们互相争论却从未见过面"),
          ],
          t(
            "Socrates taught Plato, and Plato taught Aristotle; the last paragraph calls this a chain of teacher and student.",
            "苏格拉底教了柏拉图，柏拉图又教了亚里士多德；最后一段称之为师生相传的链条。",
          ),
        ),
      ],
    ),
    passage(
      "temples-and-columns",
      t("Temples and Columns", "神庙与立柱"),
      `High on the Acropolis of Athens stands the Parthenon, a temple built nearly 2,500 years ago for Athena, the goddess the city was named after. Even in ruins, it is one of the most admired buildings in the world.

Greek temples were not places where crowds gathered to pray inside. They were homes for the gods. Inside stood a statue of the god, sometimes enormous, and people held ceremonies outside, at an altar in front of the temple.

What makes Greek temples easy to recognize are their columns, tall stone posts holding up the roof. The Greeks had three main styles. Doric columns are thick and plain, with a simple flat top. Ionic columns are thinner, with a top that curls into two scrolls, like a rolled-up piece of paper. Corinthian columns are the fanciest of all, with tops carved into leaves.

The builders of the Parthenon used clever tricks. The columns bulge very slightly in the middle and lean a tiny bit inward, so that from far away the building looks perfectly straight and balanced.

Today, you can see Greek-style columns on banks, museums and government buildings all over the world. Look for them, and see if you can tell which style they are.`,
      [greeceWords, structures],
      [
        ask(
          t("What was a Greek temple for?", "希腊神庙是做什么用的？"),
          t("It was a home for a god, holding the god's statue", "它是神的居所，里面供着神像"),
          [
            t("It was a hall where crowds prayed inside", "它是人群在里面祈祷的大厅"),
            t("It was a school for the city's children", "它是城里孩子的学校"),
            t("It was a place where the Assembly voted", "它是公民大会投票的地方"),
          ],
          t(
            "The second paragraph says temples were homes for the gods, with a statue inside; ceremonies took place outside, not in a crowd inside.",
            "第二段说，神庙是神的居所，里面有神像；仪式在外面举行，人们不在里面聚集。",
          ),
        ),
        ask(
          t("How can you tell an Ionic column?", "怎样认出爱奥尼亚式柱？"),
          t("Its top curls into two scrolls", "它的柱头卷成两个涡卷"),
          [
            t("Its top is carved into leaves", "它的柱头雕成叶子"),
            t("Its top is flat and very plain", "它的柱头平坦而朴素"),
            t("It has no top at all", "它根本没有柱头"),
          ],
          t(
            "The third paragraph says Ionic tops curl into two scrolls. Leaves belong to Corinthian columns, and plain flat tops to Doric ones.",
            "第三段说，爱奥尼亚式柱头卷成两个涡卷。叶子是科林斯式柱的特征，平坦朴素的柱头是多立克式的。",
          ),
        ),
        ask(
          t("Why do the Parthenon's columns bulge and lean slightly?", "帕特农神庙的柱子为什么略微鼓起并倾斜？"),
          t("So the building looks straight from far away", "让建筑从远处看起来笔直"),
          [
            t("Because the builders made a mistake", "因为建造者犯了错误"),
            t("Because an earthquake bent them later", "因为后来的地震把它们弄弯了"),
            t("So more people could fit inside", "让里面能容纳更多的人"),
          ],
          t(
            "The fourth paragraph calls these clever tricks: they make the building look perfectly straight and balanced from far away.",
            "第四段称之为巧妙的手法：它们让建筑从远处看起来完全笔直、匀称。",
          ),
        ),
      ],
    ),
    passage(
      "what-greece-left-us",
      t("What Greece Left Us", "希腊留给我们的遗产"),
      `The ancient Greek city-states disappeared long ago, but pieces of their world are all around us, often where we least expect them.

Start with words. Thousands of English words come from Greek. "Telephone" joins two Greek words meaning "far" and "sound." "Biology" means "the study of life," and "geography" means "writing about the earth." Even the word "alphabet" comes from alpha and beta, the first two Greek letters.

Then there are ideas. The belief that citizens should have a say in their government began in Athens. So did the habit of asking questions and testing answers that lies at the heart of science. The theater is Greek too: the Greeks wrote the first plays we know of, both tragedies and comedies, and performed them in huge open-air theaters built into hillsides.

Some of the math you learn in school was worked out by Greek thinkers. Pythagoras and Euclid studied shapes and numbers more than 2,000 years ago, and students still learn their discoveries.

Finally, there are the stories. Greek myths of gods, heroes and monsters are still retold in books and films.

So the next time you watch a play, cast a vote or use a word like "biology," you are borrowing something from ancient Greece.`,
      [ideaWords, history],
      [
        ask(
          t('What does the passage say about the word "alphabet"?', '文章怎样解释 "alphabet" 一词？'),
          t("It comes from the first two Greek letters", "它来自希腊字母表的头两个字母"),
          [
            t('It joins words meaning "far" and "sound"', '它由意思是 "far" 和 "sound" 的词组成'),
            t('It means "the study of life"', '它的意思是 "the study of life"'),
            t("It was invented by Pythagoras", "它是毕达哥拉斯发明的"),
          ],
          t(
            'The second paragraph says "alphabet" comes from alpha and beta, the first two Greek letters. "Far" and "sound" make "telephone."',
            '第二段说 "alphabet" 来自 alpha 和 beta，即希腊字母的头两个。"far" 和 "sound" 组成的是 "telephone"。',
          ),
        ),
        ask(
          t("How is the passage organized?", "这篇文章是怎样组织的？"),
          t("By kinds of things Greece left us: words, ideas, math, stories", "按希腊留下的东西分类：词语、思想、数学、故事"),
          [
            t("In order of time, from the oldest city-state to the newest", "按时间顺序，从最古老的城邦到最新的"),
            t("As a problem in ancient Greece and its solution", "以古希腊的一个问题及其解决办法展开"),
            t("As a comparison of Athens and Sparta", "作为雅典和斯巴达的比较"),
          ],
          t(
            'The passage takes one kind of gift at a time, with signal words such as "Start with," "Then," and "Finally."',
            '文章一次讲一类遗产，并用 "Start with"、"Then"、"Finally" 等提示词连接。',
          ),
        ),
        ask(
          t("Which of these does the passage say began in Athens?", "文章说下面哪一项起源于雅典？"),
          t("The belief that citizens should have a say in government", "公民应该在政府中拥有发言权的观念"),
          [
            t("The habit of building temples on banks", "在银行上建神庙的习惯"),
            t("The first open-air films about heroes", "第一部关于英雄的露天电影"),
            t("The first alphabet in the world", "世界上第一套字母表"),
          ],
          t(
            "The third paragraph says the belief that citizens should have a say in their government began in Athens.",
            "第三段说，公民应该在政府中拥有发言权的观念起源于雅典。",
          ),
        ),
      ],
    ),
  ],
};
