// Grade 6: the reading unit of the fourth theme, the first cities of Mesopotamia, from the rivers that fed them to
// the tablets that let us read them again.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const cityWords = { topic: "words-of-the-first-cities", weight: 0.3 } as const;
const recordWords = { topic: "words-of-writing-and-records", weight: 0.3 } as const;
const tradeWords = { topic: "words-of-trade", weight: 0.3 } as const;
const sentenceJob = { topic: "how-a-sentence-fits-the-whole", weight: 0.2 } as const;
const developed = { topic: "how-an-idea-is-developed", weight: 0.2 } as const;

/** theFirstCities is a reading unit of grade 6 on the cities of ancient Mesopotamia and how we know about them. */
export const theFirstCities: ReadingUnitDef = {
  id: "the-first-cities",
  title: t("The First Cities", "最早的城市"),
  passages: [
    passage(
      "between-two-rivers",
      t("Between Two Rivers", "两河之间"),
      `About ten thousand years ago, most people still lived as nomads. They moved from place to place, following herds of animals and gathering wild plants. Then, in a few parts of the world, people began to stay in one place and farm. One of the first of these places lay between two great rivers, the Tigris and the Euphrates, in what is now Iraq. The Greeks later called it Mesopotamia, which means "the land between the rivers."

The land itself was not easy. Summers were burning hot, and almost no rain fell for months. Yet the rivers made farming possible. Each spring, melting snow in the northern mountains swelled them, and they spilled across a wide floodplain. When the water went down, it left behind a layer of rich mud in which crops grew well.

Over many generations, farmers learned to domesticate wild plants and animals. Wheat and barley became crops, and wild sheep and goats became herds. Because the soil was so rich, a family could often grow more food than it needed. This surplus changed everything.

With extra food stored away, not everyone had to farm. Some people could become potters, weavers, builders or priests instead. This specialization, in which people do different jobs and trade for what they need, is one of the marks of a city. By about 3500 BCE, villages along the rivers had grown into the first true cities in the world.`,
      [cityWords, developed],
      [
        ask(
          t("Why was a surplus of food so important?", "为什么剩余的粮食如此重要？"),
          t("It let some people do jobs other than farming", "它让一些人可以从事农业以外的工作"),
          [
            t("It meant that nobody had to work at all", "它意味着谁都不用工作了"),
            t("It allowed people to become nomads again", "它让人们可以重新过游牧生活"),
            t("It was used to pay the Greeks for the land", "它被用来向希腊人支付土地的费用"),
          ],
          t(
            "The last paragraph explains that with extra food stored, not everyone had to farm, so some people became potters, weavers, builders or priests.",
            "最后一段解释说，有了储存的余粮，不是每个人都必须务农，所以有些人成了陶工、织工、建筑工或祭司。",
          ),
        ),
        ask(
          t("What job does the second paragraph do in the passage?", "第二段在文章中起什么作用？"),
          t("It explains how the rivers made farming possible in a dry land", "它解释了河流如何让这片干旱的土地能够耕种"),
          [
            t("It tells the story of one nomad family", "它讲述了一个游牧家庭的故事"),
            t("It sums up the whole passage", "它总结了整篇文章"),
            t("It compares Mesopotamia with Greece", "它把美索不达米亚和希腊作比较"),
          ],
          t(
            "The second paragraph describes the hot, dry land and then shows how the spring floods left rich mud for crops.",
            "第二段描写了炎热干燥的土地，然后说明春季洪水如何留下适合庄稼生长的肥沃泥土。",
          ),
        ),
        ask(
          t("What does specialization mean in this passage?", "在这篇文章中，specialization 是什么意思？"),
          t("People doing different jobs and trading for what they need", "人们从事不同的工作，并通过交换获得所需"),
          [
            t("Moving from place to place to follow herds", "随着牧群四处迁移"),
            t("Growing only one kind of crop each year", "每年只种一种庄稼"),
            t("Storing extra food for a dry summer", "为干旱的夏天储存余粮"),
          ],
          t(
            "The last paragraph defines it right after the word: a system in which people do different jobs and trade for what they need.",
            "最后一段在这个词后面紧接着给出了定义：人们从事不同的工作并通过交换获得所需的一种体系。",
          ),
        ),
      ],
      ["Tigris", "Euphrates", "Iraq", "Mesopotamia"],
    ),
    passage(
      "taming-the-two-rivers",
      t("Taming the Floods", "驯服洪水"),
      `The rivers of Mesopotamia gave life, but they could also take it. Unlike the gentle Nile in Egypt, the Tigris and the Euphrates flooded at unpredictable times. In some years, a sudden flood swept away whole villages and drowned the young crops. In other years, too little water came, and the fields dried out under the summer sun.

To survive, the people of Mesopotamia had to control the water. They built high banks of earth along the rivers to hold back floods. Behind the banks, they dug canals that carried water out to the fields. Small gates of mud and reeds could be opened to let water flow in, or closed to keep it out. With this system of irrigation, farmers could water their crops even in the driest months.

Building and caring for the canals was hard work, and no single family could do it alone. Hundreds of people had to dig together, and every year the canals had to be cleaned of the mud that the rivers carried. Someone had to plan the work and decide who would get water first. This need for planning helped give rise to leaders, officials and the first governments.

Irrigation also brought a problem that the farmers did not understand. As water evaporated from the fields, it left behind traces of salt. Over hundreds of years, the salt built up until some fields could no longer grow wheat. Farmers switched to barley, which can stand more salt, but even barley failed in the end. The same water that built the cities slowly wore away the land that fed them.`,
      [cityWords, sentenceJob, developed],
      [
        ask(
          t("How were the rivers of Mesopotamia different from the Nile?", "美索不达米亚的河流与尼罗河有什么不同？"),
          t("They flooded at times no one could predict", "它们在无法预测的时间泛滥"),
          [
            t("They never flooded at all", "它们从不泛滥"),
            t("They were much smaller and slower", "它们小得多，也慢得多"),
            t("They flowed through thick forests", "它们流经茂密的森林"),
          ],
          t(
            "The first paragraph says that, unlike the gentle Nile, the Tigris and the Euphrates flooded at unpredictable times.",
            "第一段说，与温和的尼罗河不同，底格里斯河和幼发拉底河在无法预测的时间泛滥。",
          ),
        ),
        ask(
          t("According to the passage, how did irrigation help lead to governments?", "根据文章，灌溉是如何促成政府产生的？"),
          t("The canals needed many workers and someone to plan the work", "修建运河需要很多劳力，还需要有人来规划"),
          [
            t("Kings invented irrigation to become rich", "国王为了致富发明了灌溉"),
            t("Each family built its own canal alone", "每个家庭各自独立修建运河"),
            t("The canals carried messages between cities", "运河在城市之间传递消息"),
          ],
          t(
            "The third paragraph says hundreds of people had to dig together and someone had to plan the work, which helped give rise to leaders and governments.",
            "第三段说，成百上千的人必须一起挖掘，还得有人规划工作，这促成了首领和政府的出现。",
          ),
        ),
        ask(
          t("What is the job of the last sentence of the passage?", "文章最后一句起什么作用？"),
          t("It sums up how irrigation both helped and harmed the land", "它总结了灌溉对土地既有益又有害"),
          [
            t("It gives a new example of a canal gate", "它给出了运河闸门的一个新例子"),
            t("It defines the word irrigation", "它给 irrigation 这个词下了定义"),
            t("It introduces a new topic about Egypt", "它引出了一个关于埃及的新话题"),
          ],
          t(
            "The sentence draws the passage together: the water that built the cities also slowly ruined the fields that fed them.",
            "这句话把全文收拢起来：建起城市的水，也慢慢毁掉了养活城市的田地。",
          ),
        ),
      ],
      ["Mesopotamia", "Tigris", "Euphrates", "Nile", "Egypt"],
    ),
    passage(
      "the-temple-on-the-hill",
      t("The Temple on the Hill", "山上的神庙"),
      `If you had walked toward the city of Ur four thousand years ago, the first thing you would have seen was the ziggurat. Rising high above the flat plain, this great stepped tower could be seen from many kilometers away. It was not a palace or a fort. It was a temple, built as a home for the moon god Nanna, who the people of Ur believed protected their city.

The ziggurat was made of millions of mud bricks. The inside was filled with bricks dried in the sun, which were cheap and easy to make. The outside was covered with bricks that had been baked hard in ovens and set in tar, so that the rare winter rains would not wash the building away. Wide stairways led up the front to a small shrine at the very top.

Only priests were allowed to climb to the shrine. They believed that the gods had to be fed, clothed and honored every day, or they might turn against the city. So the priests brought offerings of bread, beer, meat and fruit, and they sang and prayed on behalf of everyone below.

The temple was also the center of the city's life. Around its base stood storerooms, workshops and offices. A steward kept track of the grain and animals that flowed in from the temple's farms, and workers were paid from these stores. In many ways, the temple was the city's bank, its market and its largest employer, as well as its holiest place.`,
      [cityWords, sentenceJob],
      [
        ask(
          t("Why was the outside of the ziggurat covered in baked bricks?", "为什么金字形神塔的外层用烧制的砖覆盖？"),
          t("So that rain would not wash the building away", "这样雨水就不会冲毁建筑"),
          [
            t("Because baked bricks were cheaper to make", "因为烧制的砖造价更低"),
            t("So that the tower could be seen at night", "这样晚上也能看到塔"),
            t("Because the priests liked their color", "因为祭司们喜欢它们的颜色"),
          ],
          t(
            "The second paragraph says the outside bricks were baked hard and set in tar so the rare winter rains would not wash the building away.",
            "第二段说，外层的砖经过烧制变得坚硬，并用沥青粘合，这样偶尔的冬雨就不会冲毁建筑。",
          ),
        ),
        ask(
          t("What does the last paragraph mainly show?", "最后一段主要说明了什么？"),
          t(
            "That the temple was the center of the city's work and wealth as well as worship",
            "神庙不仅是礼拜的地方，也是城市劳作和财富的中心",
          ),
          [
            t("That only priests could live in the city", "只有祭司可以住在城里"),
            t("That the ziggurat was built in a single year", "金字形神塔是在一年内建成的"),
            t("That the moon god was the most powerful god", "月神是最强大的神"),
          ],
          t(
            "It lists the storerooms, workshops and offices around the temple and calls it the city's bank, market and largest employer.",
            "它列举了神庙周围的仓库、作坊和办公处，并称它是城市的银行、市场和最大的雇主。",
          ),
        ),
        ask(
          t("What did a steward do at the temple?", "神庙里的管事做什么？"),
          t("Kept track of the grain and animals that came in", "记录收进来的粮食和牲畜"),
          [
            t("Climbed the stairs to sing to the gods", "登上台阶向神灵歌唱"),
            t("Baked the bricks for the ziggurat", "为金字形神塔烧砖"),
            t("Guarded the city walls at night", "晚上守卫城墙"),
          ],
          t(
            "The last paragraph says a steward kept track of the grain and animals that flowed in from the temple's farms.",
            "最后一段说，管事负责记录从神庙农场运来的粮食和牲畜。",
          ),
        ),
      ],
      ["Ur", "Nanna"],
    ),
    passage(
      "wedges-in-clay",
      t("Wedges in Clay", "泥板上的楔形"),
      `Imagine trying to run a temple that collects thousands of sheep, jars of oil and sacks of barley every year, without any way to write. Sooner or later, someone would forget who had paid and who still owed. This was exactly the problem the people of Sumer, in southern Mesopotamia, faced about 5,200 years ago. Their solution was one of the most important inventions in history: writing.

The first writing was simple. To record five sheep, an official drew a small picture of a sheep on a lump of wet clay and added five marks. These pictures are called pictographs. They worked well for counting, but they could not show names, ideas or actions.

Over the centuries, the system changed. Scribes began using a stylus, a reed with an end cut into a wedge shape. Instead of drawing curved lines, they pressed the stylus into the clay, leaving neat, wedge-shaped marks. The pictures slowly became groups of wedges that no longer looked like the things they stood for. Many signs came to stand for sounds, so scribes could write any word, even a name. Today we call this writing cuneiform, from a Latin word meaning "wedge-shaped."

When a tablet was finished, it was left to dry in the sun. Important tablets were baked, which made them as hard as pottery. Because of this, hundreds of thousands of clay tablets have survived. They record letters, laws, stories, recipes and endless lists of goods, and they let us hear the voices of people who lived five thousand years ago.`,
      [recordWords, developed, sentenceJob],
      [
        ask(
          t("How does the passage introduce its key idea?", "文章是怎样引出关键观点的？"),
          t("By asking the reader to imagine running a temple with no way to write", "让读者想象在无法书写的情况下管理一座神庙"),
          [
            t("By quoting a famous scribe", "引用一位著名书吏的话"),
            t("By defining the word cuneiform", "给 cuneiform 下定义"),
            t("By listing the dates of each change", "列出每次变化的日期"),
          ],
          t(
            "The first sentence begins with Imagine and describes the problem of keeping records without writing, which leads into the invention.",
            "第一句以 Imagine 开头，描述了没有文字时记录的难题，由此引出这项发明。",
          ),
        ),
        ask(
          t("Why were the first pictographs not enough?", "为什么最初的象形符号不够用？"),
          t("They could not show names, ideas or actions", "它们无法表示名字、观念或动作"),
          [
            t("They were too hard to draw on clay", "它们太难在泥板上画"),
            t("They could not be used for counting", "它们不能用来计数"),
            t("They washed away in the rain", "它们会被雨水冲掉"),
          ],
          t(
            "The second paragraph says pictographs worked well for counting but could not show names, ideas or actions.",
            "第二段说，象形符号很适合计数，但无法表示名字、观念或动作。",
          ),
        ),
        ask(
          t("Why have so many clay tablets survived?", "为什么有这么多泥板保存了下来？"),
          t("They were dried or baked until they were very hard", "它们被晒干或烧制得非常坚硬"),
          [
            t("They were kept inside glass cases", "它们被保存在玻璃柜里"),
            t("They were written on with ink that never faded", "它们是用永不褪色的墨水写的"),
            t("Scribes copied them again every year", "书吏每年都重新抄写一遍"),
          ],
          t(
            "The last paragraph says tablets were dried in the sun and important ones were baked as hard as pottery, so hundreds of thousands survived.",
            "最后一段说，泥板在阳光下晒干，重要的还会烧得像陶器一样坚硬，所以有数十万块保存了下来。",
          ),
        ),
      ],
      ["Sumer", "Mesopotamia"],
    ),
    passage(
      "a-school-for-scribes",
      t("A School for Scribes", "书吏学校"),
      `Among the clay tablets found in Mesopotamia are some that seem surprisingly familiar. They are the complaints of schoolboys. One tablet, written almost four thousand years ago, tells of a student who arrived late, spoke without permission and wrote his lesson badly. Each time, the boy says, he was punished. His story shows us what it was like to learn to write in the world's first schools.

The school was called the tablet house. Most of the students were sons of wealthy families, because only the rich could spare a child from work for so many years. Boys often started young and studied for about twelve years before they became scribes.

Learning cuneiform was slow and difficult. There were hundreds of signs to learn, and each had to be pressed into the clay exactly. The teacher wrote a model on one side of a tablet, and the student copied it on the other, again and again. Students also copied long lists of words, practiced mathematics and wrote out famous stories and proverbs.

All this work had a reward. In a world where very few people were literate, a scribe held a respected and well-paid position. Scribes kept the accounts of temples and palaces, wrote letters for kings and merchants, recorded laws and made a census of the people and their animals. A good scribe could rise to become an important official.

The schoolboy's tablet ends happily. His father invites the teacher home, gives him a gift, and the teacher praises the boy. Even four thousand years ago, it seems, parents knew how to help a struggling student.`,
      [recordWords, sentenceJob],
      [
        ask(
          t("What job does the first paragraph do?", "第一段起什么作用？"),
          t(
            "It opens with a real student's story to lead into the topic of scribe schools",
            "它以一个真实学生的故事开头，引出书吏学校这个主题",
          ),
          [
            t("It explains how cuneiform signs were made", "它解释了楔形文字符号是怎样制作的"),
            t("It lists the jobs that scribes did", "它列举了书吏从事的工作"),
            t("It argues that schools should be stricter", "它主张学校应该更严格"),
          ],
          t(
            "The first paragraph tells of the schoolboy's complaints and says his story shows what learning to write was like.",
            "第一段讲述了那个学生的抱怨，并说他的故事展示了学习写字是什么样子。",
          ),
        ),
        ask(
          t("Why were most students the sons of wealthy families?", "为什么大多数学生是富裕家庭的儿子？"),
          t("Only the rich could spare a child from work for so many years", "只有富人才能让孩子多年不干活"),
          [
            t("Poor children were not allowed to touch clay", "穷人的孩子不准碰泥板"),
            t("The school was inside the king's palace", "学校在国王的宫殿里"),
            t("Wealthy boys already knew how to write", "富家子弟早就会写字"),
          ],
          t(
            "The second paragraph gives the reason: only the rich could spare a child from work for about twelve years of study.",
            "第二段给出了原因：只有富人才能让孩子不干活，花大约十二年来学习。",
          ),
        ),
        ask(
          t("Why was being a scribe a respected job?", "为什么书吏是受人尊敬的职业？"),
          t("Few people could read and write, and scribes kept important records", "很少有人会读写，而书吏负责重要的记录"),
          [
            t("Scribes were the only people allowed to farm", "书吏是唯一被允许耕种的人"),
            t("Scribes did not have to study at all", "书吏根本不用学习"),
            t("Scribes were chosen by the moon god", "书吏是由月神挑选的"),
          ],
          t(
            "The fourth paragraph says very few people were literate and lists the important records scribes kept for temples, palaces and kings.",
            "第四段说，识字的人很少，并列举了书吏为神庙、宫殿和国王保管的重要记录。",
          ),
        ),
      ],
      ["Mesopotamia"],
    ),
    passage(
      "the-laws-on-the-stone",
      t("The Laws on the Stone", "石头上的法律"),
      `In 1901, a team of French archaeologists digging in Iran found a tall pillar of black stone. Carved into its surface were thousands of tiny wedge-shaped signs. At the top was a picture of a king standing before a god. When scholars managed to read the signs, they discovered one of the oldest written collections of laws in the world: the Code of Hammurabi.

Hammurabi ruled the city of Babylon about 3,750 years ago. He conquered many of the cities around him and built a large kingdom. To rule it, he wanted a single set of laws that everyone could know. He had 282 laws carved on stone pillars and set up in public places.

Each law follows the same pattern: if someone does a certain thing, then a certain thing will happen to them. If a man steals an ox, he must pay back thirty times its value. If a builder builds a house badly and it falls and kills the owner, the builder shall be put to death. Some laws protected the weak, such as widows and orphans. Others set fair prices and wages.

To modern readers, many of the punishments seem harsh. The laws were also unequal: the same crime brought a different punishment depending on whether the victim was a noble, a free person or a slave. Even so, Hammurabi's code was an important step. By writing the laws down and placing them where people could see them, he made the rules public. Judges could not simply invent a punishment, because the law was written in stone.`,
      [cityWords, recordWords, developed],
      [
        ask(
          t("Why did Hammurabi want a single set of laws?", "汉谟拉比为什么想要一套统一的法律？"),
          t("To rule the large kingdom he had built by conquest", "为了统治他通过征服建立起来的大王国"),
          [
            t("To please the French archaeologists", "为了取悦法国考古学家"),
            t("To replace writing with pictures", "为了用图画代替文字"),
            t("To make every punishment the same", "为了让所有惩罚都一样"),
          ],
          t(
            "The second paragraph says he conquered many cities and built a large kingdom, and to rule it he wanted one set of laws everyone could know.",
            "第二段说，他征服了许多城市，建立了一个大王国，为了统治它，他想要一套人人都能知道的法律。",
          ),
        ),
        ask(
          t("How does the third paragraph develop the idea of the code?", "第三段是怎样展开法典这个观点的？"),
          t("It gives examples of the laws and the pattern they follow", "它举出法律的例子以及它们遵循的格式"),
          [
            t("It tells how the pillar was found", "它讲述了石柱是怎样被发现的"),
            t("It compares Babylon with Ur", "它把巴比伦和乌尔作比较"),
            t("It explains how cuneiform was invented", "它解释了楔形文字是怎样发明的"),
          ],
          t(
            "The paragraph states the if-then pattern and then gives examples: the stolen ox, the badly built house and the laws that protected the weak.",
            "这一段说明了 if-then 的格式，然后举例：偷牛、房子盖得不好，以及保护弱者的法律。",
          ),
        ),
        ask(
          t(
            "According to the passage, why was writing the laws in stone an important step?",
            "根据文章，为什么把法律刻在石头上是重要的一步？",
          ),
          t("It made the rules public, so judges could not invent punishments", "它让法律公开，法官不能随意编造惩罚"),
          [
            t("It made all the punishments gentle", "它让所有惩罚都变得温和"),
            t("It meant that slaves and nobles were treated the same", "它意味着奴隶和贵族受到同样的对待"),
            t("It allowed Hammurabi to change the laws every day", "它让汉谟拉比可以每天修改法律"),
          ],
          t(
            "The last paragraph says that by writing the laws down in public, he made the rules public, and judges could not simply invent a punishment.",
            "最后一段说，他把法律公开写下来，使规则公之于众，法官不能随意编造惩罚。",
          ),
        ),
      ],
      ["Iran", "Hammurabi", "Babylon"],
    ),
    passage(
      "merchants-of-ur",
      t("Merchants of Ur", "乌尔的商人"),
      `Mesopotamia had rich soil and plenty of mud, but it lacked almost everything else. There were no forests for timber, no quarries for stone and no mines for metal. Yet the cities of Mesopotamia were full of bronze tools, wooden furniture and jewelry made of gold and blue stone. How did they get them? The answer is trade.

The merchants of Ur were some of the busiest traders in the ancient world. They loaded boats with goods that Mesopotamia made well: barley, woven wool cloth, leather and pottery. Then they sailed down the river to the sea and along the coast to distant ports. There they would export their wares and buy copper, tin, timber and precious stones to bring home.

Trading was not simple. A merchant might haggle for hours over the price of a load of copper. Many deals were paid in silver, weighed out on a scale, because there were no coins. To prove who owned a bundle of merchandise, a merchant pressed his own carved seal into a lump of clay tied around it. Each seal was different, like a signature.

We know a great deal about these merchants because they kept careful records. One famous tablet is a complaint from a man named Nanni to a copper merchant called Ea-nasir. Nanni writes angrily that the copper he received was of poor quality and that he was treated rudely. It may be the oldest customer complaint ever found.

Trade made the cities rich, and it did more than move goods. Along with copper and cloth, merchants carried ideas, stories and new skills between peoples.`,
      [tradeWords, cityWords, developed],
      [
        ask(
          t("How does the passage introduce its central idea?", "文章是怎样引出中心观点的？"),
          t("It describes a puzzle and asks a question that trade answers", "它描述了一个谜题，并提出一个由贸易来回答的问题"),
          [
            t("It begins with the story of Nanni's complaint", "它以南尼的投诉故事开头"),
            t("It starts with a definition of trade", "它以贸易的定义开头"),
            t("It opens by listing the prices of copper", "它以列出铜的价格开头"),
          ],
          t(
            "The first paragraph shows that Mesopotamia lacked wood, stone and metal yet had them, asks how, and answers: trade.",
            "第一段说明美索不达米亚缺少木材、石头和金属却拥有这些东西，提出了怎么做到的问题，并回答：贸易。",
          ),
        ),
        ask(
          t("Why did merchants press seals into clay?", "商人为什么要把印章压在泥块上？"),
          t("To prove who owned a bundle of goods", "为了证明一捆货物归谁所有"),
          [
            t("To pay for the goods instead of silver", "用来代替白银支付货款"),
            t("To make the bundle heavier", "为了让货捆更重"),
            t("To write a letter of complaint", "为了写投诉信"),
          ],
          t(
            "The third paragraph says the seal proved who owned a bundle of merchandise and worked like a signature.",
            "第三段说，印章可以证明一捆货物归谁所有，作用就像签名一样。",
          ),
        ),
        ask(
          t("What is the job of the fourth paragraph?", "第四段起什么作用？"),
          t("It gives an example that shows how we know about the merchants", "它举了一个例子，说明我们是怎样了解这些商人的"),
          [
            t("It explains why there were no coins", "它解释了为什么没有硬币"),
            t("It lists the goods Mesopotamia made", "它列出了美索不达米亚制造的货物"),
            t("It states the central idea for the first time", "它第一次提出中心观点"),
          ],
          t(
            "The paragraph says merchants kept careful records and then gives the example of Nanni's tablet complaining about poor copper.",
            "这一段说商人保存了详细的记录，然后举了南尼抱怨铜质量差的泥板为例。",
          ),
        ),
      ],
      ["Mesopotamia", "Ur", "Nanni", "Ea-nasir"],
    ),
    passage(
      "a-city-is-found-again",
      t("A City Is Found Again", "重新发现的城市"),
      `For more than two thousand years, the great cities of Mesopotamia lay forgotten. Their mud-brick walls had crumbled, and the wind had covered them with sand. All that remained were low hills rising from the desert. Travelers passed them without knowing that whole cities lay beneath their feet.

In the 1800s, explorers from Europe began to dig into these hills. They found palaces, statues and thousands of clay tablets covered in strange wedge-shaped marks. But no one alive could read cuneiform. The tablets were like locked boxes without a key.

The key came from a cliff in Iran. There, an ancient king had carved an inscription in three languages, all written in cuneiform. A British officer named Henry Rawlinson risked his life climbing the cliff to copy it. Because one of the languages, Old Persian, was simpler and already partly understood, scholars could use it to work out the others. Slowly, sign by sign, they began to decipher the writing.

One of the most exciting moments came in 1872. A young man named George Smith was studying broken tablets in the British Museum when he read a story about a great flood and a man who built a boat to save his family and animals. It was part of the Epic of Gilgamesh, a poem older than any other story then known. Smith was so excited, it is said, that he ran around the room.

Today, archaeologists are still finding tablets. Each one adds a line to the chronicle of the first cities, and lets the people who built them speak again.`,
      [recordWords, cityWords, sentenceJob],
      [
        ask(
          t("Why are the tablets compared to locked boxes without a key?", "为什么把泥板比作没有钥匙的锁着的盒子？"),
          t("Because no one alive could read the writing on them", "因为当时没有人能读懂上面的文字"),
          [
            t("Because they were kept in locked rooms", "因为它们被锁在房间里"),
            t("Because they were too heavy to open", "因为它们太重打不开"),
            t("Because the explorers wanted to sell them", "因为探险家想卖掉它们"),
          ],
          t(
            "The second paragraph says no one alive could read cuneiform, so the tablets held their words like boxes that could not be opened.",
            "第二段说没有人能读懂楔形文字，所以泥板就像打不开的盒子一样藏着它们的文字。",
          ),
        ),
        ask(
          t("How did the inscription on the cliff help scholars?", "悬崖上的铭文是怎样帮助学者的？"),
          t(
            "One of its three languages was simpler and partly understood, so it unlocked the others",
            "三种语言中有一种较简单且已部分被理解，因此能用来破解其他两种",
          ),
          [
            t("It had a list of every cuneiform sign with its meaning", "它列有每个楔形文字符号及其含义"),
            t("It was written in modern English", "它是用现代英语写的"),
            t("It showed a map of the buried cities", "它画着被掩埋城市的地图"),
          ],
          t(
            "The third paragraph explains that Old Persian was simpler and already partly understood, so scholars could use it to work out the other languages.",
            "第三段解释说，古波斯语较简单，而且已经部分被理解，所以学者可以借助它破解其他语言。",
          ),
        ),
        ask(
          t("What is the job of the last paragraph?", "最后一段起什么作用？"),
          t("It brings the story to the present and sums up why the tablets matter", "它把故事带到现在，并总结泥板为什么重要"),
          [
            t("It tells the plot of the Epic of Gilgamesh", "它讲述了《吉尔伽美什史诗》的情节"),
            t("It describes how Rawlinson climbed the cliff", "它描述了罗林森如何攀爬悬崖"),
            t("It explains how mud-brick walls crumble", "它解释了泥砖墙是怎样坍塌的"),
          ],
          t(
            "It says archaeologists are still finding tablets and that each one lets the people of the first cities speak again.",
            "它说考古学家仍在发现泥板，每一块都让最早城市的人们重新开口说话。",
          ),
        ),
      ],
      ["Mesopotamia", "Iran", "Henry", "Rawlinson", "George", "Smith", "Gilgamesh"],
    ),
  ],
};
