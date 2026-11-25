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
          [
            t(
              "No ruler forbade meeting. Greece had no single ruler, and the mountains kept villages apart.",
              "没有统治者禁止往来。希腊没有统一的统治者，是山脉把村庄隔开。",
            ),
            t(
              "The villages were in valleys on the mainland. The islands are a separate detail.",
              "这些村庄在大陆的山谷里。岛屿是另一个细节。",
            ),
            t(
              "Different languages is wrong. Later the passage says the Greeks shared one language.",
              "语言不同是错的。后文说希腊人说同一种语言。",
            ),
          ],
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
          [
            t("Flowers are not mentioned. The soil suited olives and grapes.", "文中没提花。那种土壤适合橄榄和葡萄。"),
            t("Ships were for trade, not farming. Size is never the issue.", "船是用来贸易的，不是种地的。大小从来不是问题。"),
            t("A flood is never mentioned. The soil was thin and stony.", "文中从没提到洪水。土壤又薄又多石。"),
          ],
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
          [
            t("Liking is not discussed. The sentence says what each one did.", "文中没谈喜好。这句话说的是山和海各起了什么作用。"),
            t("The thin soil also drove trade, and the sea made it possible.", "贫瘠的土壤也推动了贸易，而大海让贸易成为可能。"),
            t("Greek sailors traveled all around the Mediterranean.", "希腊水手航行到地中海各地。"),
          ],
        ),
        ask(
          t("What grew well in the thin, stony soil of Greece?", "希腊贫瘠多石的土壤适合种什么？"),
          t("Olive trees and grapevines", "橄榄树和葡萄藤"),
          [t("Large fields of wheat", "大片小麦"), t("Rice", "水稻"), t("Corn and beans", "玉米和豆子")],
          t(
            "The soil was good for olive trees and grapevines but poor for large fields of wheat.",
            "土壤适合种橄榄树和葡萄藤，却不适合种大片小麦。",
          ),
          [
            t("Large fields of wheat were what the soil was poor for.", "大片麦田正是这种土壤不适合的。"),
            t("Rice is not mentioned in the passage.", "文中没提到稻米。"),
            t("Corn and beans are not mentioned.", "文中没提到玉米和豆子。"),
          ],
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
          [
            t("A single king is the opposite. Each city-state governed itself.", "单一的国王正好相反。每个城邦自己管理自己。"),
            t("A large country is what Greece never was.", "希腊从来不是一个大国。"),
            t("The marketplace is the agora, one part of a city-state.", "市场是集市广场，只是城邦的一部分。"),
          ],
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
          [
            t("Buying food and arguing happened in the agora, below the hill.", "买食物和争论是在山下的集市广场。"),
            t("The Olympic Games were held at Olympia, in another passage.", "奥运会在奥林匹亚举行，是另一篇文章。"),
            t("Keeping barbarians out of farms is never mentioned.", "文中从没提到把外族挡在农田外。"),
          ],
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
          [
            t("Each city-state had its own army and its own laws.", "每个城邦都有自己的军队和法律。"),
            t("There was no single ruler, and each often had its own money.", "没有统一的统治者，各城邦往往也有自己的货币。"),
            t("They often competed and sometimes went to war.", "它们经常竞争，有时还会打仗。"),
          ],
        ),
        ask(
          t("What was the agora?", "集市广场是什么？"),
          t("An open marketplace", "一个露天市场"),
          [t("A hill with temples", "一座有神庙的山丘"), t("An army camp", "一个军营"), t("A school", "一所学校")],
          t(
            "Below the acropolis lay the agora, an open marketplace where citizens bought food and traded news.",
            "卫城下面是集市广场，一个市民买食物、交流消息的露天市场。",
          ),
          [
            t("A hill with temples is the acropolis.", "有神庙的山丘是卫城。"),
            t("An army camp is not described.", "文中没描述军营。"),
            t("A school is not described here.", "这里没有描述学校。"),
          ],
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
          [
            t("A king is what democracy replaced, not part of the word.", "国王是民主取代的对象，不是这个词的组成部分。"),
            t("The hill is where they met, not the source of the word.", "山坡是开会的地方，不是这个词的来源。"),
            t("No first leader is named. The word comes from people and power.", "文中没提第一位领袖。这个词来自“人民”和“权力”。"),
          ],
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
          [
            t(
              "There was no king choosing friends. Athens chose democracy instead of a king.",
              "没有国王挑选朋友。雅典选择了民主而不是国王。",
            ),
            t("Votes were counted by a show of hands.", "投票是举手计数的。"),
            t("Danger is never mentioned. The lottery let ordinary citizens take turns.", "文中从没提到危险。抽签让普通公民轮流任职。"),
          ],
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
          [
            t("Free men born in Athens were exactly the ones who could vote.", "生在雅典的自由男子正是能投票的人。"),
            t("Jurors were citizens chosen by lottery.", "陪审员是抽签选出的公民。"),
            t("The hillside was where the Assembly met, not where people lived.", "山坡是公民大会开会的地方，不是住的地方。"),
          ],
        ),
        ask(
          t("How were votes in the Assembly often counted?", "公民大会上的投票通常怎样计数？"),
          t("By a show of hands", "举手表决"),
          [t("By drawing names", "抽签"), t("By writing on paper", "写在纸上"), t("By the king alone", "只由国王决定")],
          t("The text says votes were often counted by a show of hands.", "短文说投票通常以举手的方式计数。"),
          [
            t("Drawing names was how public jobs were filled.", "抽签是选出公职的方法。"),
            t("Writing on paper is never mentioned.", "文中从没提到写在纸上。"),
            t("Athens had no king deciding.", "雅典没有国王做决定。"),
          ],
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
          [
            t("Debates describe Athens, not Sparta.", "辩论描述的是雅典，不是斯巴达。"),
            t("Trading olive oil was about Greek sailors in general.", "运橄榄油说的是希腊水手，不专指斯巴达。"),
            t("The lottery was used in Athens.", "抽签是雅典用的方法。"),
          ],
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
          [
            t("Fighting in wars is never said of Spartan girls.", "文中从没说斯巴达女孩要上战场。"),
            t("Leaving home at seven describes Spartan boys.", "七岁离家说的是斯巴达男孩。"),
            t("The Olympic Games are not mentioned in this passage.", "这篇文章没提奥运会。"),
          ],
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
          [
            t('They understood the threat. "If" turns it back on him.', "他们听懂了威胁。“如果”一词把威胁反抛回去。"),
            t("Fear does not fit. Spartans were trained to be tough.", "害怕不合理。斯巴达人受训就是为了坚强。"),
            t("They spoke Greek. They chose to use one word.", "他们会说希腊语。是他们选择只用一个词。"),
          ],
        ),
        ask(
          t("How many kings did Sparta have at the same time?", "斯巴达同时有几位国王？"),
          t("Two", "两位"),
          [t("One", "一位"), t("None", "没有"), t("Seven", "七位")],
          t("The text says Sparta had two kings at the same time.", "短文说斯巴达同时有两位国王。"),
          [
            t("One king would be usual, but Sparta had two at once.", "一位国王很常见，但斯巴达同时有两位。"),
            t("None is wrong. The passage names two kings.", "没有是错的。文中说有两位国王。"),
            t("Seven is the age when boys left home.", "七是男孩离家的年龄。"),
          ],
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
          [
            t("The race was the first event, not the truce.", "赛跑是第一个比赛项目，不是休战。"),
            t("Free meals were rewards back home for champions.", "免费餐是冠军回到家乡得到的奖励。"),
            t("The wreath was the prize, not the truce.", "花环是奖品，不是休战。"),
          ],
        ),
        ask(
          t("What did the winners of the ancient games receive at Olympia?", "古代奥运会的获胜者在奥林匹亚得到什么？"),
          t("A wreath of olive leaves", "一个橄榄叶花环"),
          [t("A gold medal", "一枚金牌"), t("A bag of coins", "一袋钱币"), t("A new chariot", "一辆新战车")],
          t(
            "The fourth paragraph says winners did not receive gold medals; each was crowned with a wreath of olive leaves.",
            "第四段说，获胜者没有金牌，而是戴上一个橄榄叶花环。",
          ),
          [
            t("Gold medals were not given, the passage says.", "文中说当时不发金牌。"),
            t("Coins are not mentioned.", "文中没提到钱币。"),
            t("Chariots were for races, not prizes.", "战车是比赛用的，不是奖品。"),
          ],
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
          [
            t(
              "776 BCE tells when the ancient games began, not their link to today.",
              "公元前776年说的是古代奥运何时开始，不是和今天的联系。",
            ),
            t("The first event describes the ancient games only.", "第一个项目只描述古代奥运。"),
            t("Poets' songs are about ancient champions.", "诗人的歌颂是关于古代冠军的。"),
          ],
        ),
        ask(
          t("In honor of which god were the Olympic Games held?", "奥林匹克运动会是为了纪念哪位神？"),
          t("Zeus, the king of the gods", "众神之王宙斯"),
          [t("The god of the sea", "海神"), t("The god of the sun", "太阳神"), t("The goddess of wisdom", "智慧女神")],
          t("The Olympic Games were held in honor of Zeus, the king of the gods.", "奥林匹克运动会是为纪念众神之王宙斯而举行的。"),
          [
            t("A sea god is not named in the passage.", "文中没提海神。"),
            t("A sun god is not named.", "文中没提太阳神。"),
            t("The goddess of wisdom is not mentioned here.", "这里没提到智慧女神。"),
          ],
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
          [
            t("Socrates wrote nothing down.", "苏格拉底什么都没写下来。"),
            t("He did not give answers. He asked more questions.", "他不给答案，而是继续提问。"),
            t("The Academy was founded by Plato, his student.", "学园是他的学生柏拉图创办的。"),
          ],
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
          [
            t("Socrates wrote no books.", "苏格拉底没写过书。"),
            t("Aristotle collected observations of nature, not about Socrates.", "亚里士多德收集的是对自然的观察，不是关于苏格拉底的。"),
            t("The Assembly made laws. It does not tell us about him.", "公民大会制定法律，并不告诉我们他的事。"),
          ],
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
          [
            t("They were teacher and student, not family.", "他们是师生，不是一家人。"),
            t("Thinkers did not rule. They became famous for asking questions.", "这些思想家不统治城邦。他们因提问而出名。"),
            t("They did meet: each taught the next.", "他们确实见过：每人都教过下一位。"),
          ],
        ),
        ask(
          t("What did Plato found?", "柏拉图创办了什么？"),
          t("A school called the Academy", "一所叫学园的学校"),
          [t("The Olympic Games", "奥林匹克运动会"), t("The Assembly", "公民大会"), t("A new city-state", "一个新的城邦")],
          t("Plato founded a school called the Academy.", "柏拉图创办了一所叫学园的学校。"),
          [
            t("The Olympic Games began long before, in honor of Zeus.", "奥运会早就为纪念宙斯而开始了。"),
            t("The Assembly was part of Athenian democracy.", "公民大会是雅典民主的一部分。"),
            t("Plato founded a school, not a city.", "柏拉图创办的是学校，不是城市。"),
          ],
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
          [
            t("Crowds did not pray inside. Ceremonies were outside.", "人群不在里面祈祷。仪式在外面举行。"),
            t("A school is not what a temple was.", "神庙不是学校。"),
            t("The Assembly met on a hillside, not in a temple.", "公民大会在山坡上开会，不在神庙里。"),
          ],
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
          [
            t("Leaves describe the Corinthian style.", "叶子描述的是科林斯式。"),
            t("Flat and plain describes the Doric style.", "平而朴素描述的是多立克式。"),
            t("Every style has a top. Ionic tops curl.", "每种风格都有柱头。爱奥尼亚式的柱头是卷曲的。"),
          ],
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
          [
            t("It was on purpose, a clever trick, not a mistake.", "这是有意的巧妙设计，不是失误。"),
            t("An earthquake is never mentioned.", "文中从没提到地震。"),
            t("Crowds did not go inside a temple.", "人群不进入神庙。"),
          ],
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
          [
            t("Far is part of telephone, not alphabet.", "“远”是 telephone 的一部分，不是 alphabet。"),
            t("The study of life is biology.", "生命的研究是 biology（生物学）。"),
            t("Pythagoras studied shapes and numbers, not letters.", "毕达哥拉斯研究图形和数字，不是字母。"),
          ],
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
          [
            t(
              "Time order is not used. The parts are words, ideas, math and stories.",
              "文章不是按时间排的。各部分是词语、思想、数学和故事。",
            ),
            t("No problem is set up and solved.", "文中没有提出问题再解决。"),
            t("Athens and Sparta are compared in another passage.", "雅典和斯巴达的比较在另一篇文章。"),
          ],
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
          [
            t("Banks have Greek-style columns today, not temples.", "今天银行用的是希腊式柱子，不是神庙。"),
            t("Films are modern. The Greeks wrote the first plays.", "电影是现代的。希腊人写了最早的戏剧。"),
            t(
              "The alphabet's name comes from Greek letters, not the first alphabet in the world.",
              "alphabet 的名字来自希腊字母，文中没说是世界上第一套字母。",
            ),
          ],
        ),
      ],
    ),
  ],
};
