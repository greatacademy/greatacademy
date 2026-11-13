// Cambridge First Reading Part 6: gapped text. Each text has six paragraphs, and one sentence has been taken out of
// each; one more sentence fits no gap. A learner first fills the gap of a single paragraph, using the words that link
// it to the sentences around it, and then works through the whole text, where every other removed sentence is a
// possible answer.

import { type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { examTopic, interleave, type SolvedChoice, solvedChoiceGenerator } from "./kit.ts";

/** Gap is a paragraph with a sentence taken out: what comes before it, the sentence, what comes after, and why it fits. */
type Gap = readonly [before: string, removed: string, after: string, why: readonly [string, string]];

/** Gapped is a text of six paragraphs, each with one gap, and a sentence that fits none of them. */
interface Gapped {
  readonly title: string;
  readonly gaps: readonly [Gap, Gap, Gap, Gap, Gap, Gap];
  readonly extra: string;
}

const texts: readonly Gapped[] = [
  {
    title: "Learning to sail at sixty",
    gaps: [
      [
        "When I retired last year, my daughter gave me an unusual present: a week-long sailing course on the south coast.",
        "I had never been on a boat smaller than a ferry.",
        "So I arrived at the harbour on the first morning feeling more nervous than excited.",
        [
          "It explains why the writer felt nervous: never having sailed leads to *So ... nervous*.",
          "它解释了作者为什么紧张：从没坐过小船，所以（*So*）才会紧张。",
        ],
      ],
      [
        "There were six of us on the course, and I was by far the oldest.",
        "The youngest, a student called Leo, was not even born when I started my first job.",
        "Yet within an hour, age had stopped mattering, because none of us knew what we were doing.",
        [
          "*The youngest* continues the comparison of ages begun by *by far the oldest*, and *Yet* then turns away from it.",
          "*The youngest* 接着 *by far the oldest* 继续比较年龄，*Yet* 随后转折。",
        ],
      ],
      [
        "Our instructor, Jo, began by teaching us the names of every rope and sail.",
        "Most of them went straight out of my head.",
        "Luckily, she was patient, and by the third day I could at least tell one rope from another.",
        [
          "*Them* refers to the names of the ropes and sails, and forgetting them is why Jo needed to be patient.",
          "*Them* 指绳索和帆的名字；把它们忘了，所以 Jo 需要有耐心。",
        ],
      ],
      [
        "On the fourth day the wind picked up, and Jo decided we were ready to take a boat out without her.",
        "Leo and I were put together, which neither of us looked forward to.",
        "To our surprise, we made a good team: he was strong, and I was careful.",
        [
          "*Neither of us looked forward to* it sets up *To our surprise*, which shows that the opposite happened.",
          "*Neither of us looked forward to* 为 *To our surprise* 做了铺垫，后者说明结果正好相反。",
        ],
      ],
      [
        "Halfway across the bay, a sudden gust turned the boat almost on its side.",
        "For a moment I was sure we were going into the water.",
        "Then Leo pulled the sail in, I leaned out as Jo had shown us, and the boat came upright again.",
        [
          "The fear of falling in comes between the danger and *Then*, which tells how they recovered.",
          "掉进水里的恐惧处在危险和 *Then*（讲他们怎样脱险）之间。",
        ],
      ],
      [
        "I have been sailing almost every weekend since then.",
        "My daughter says it is the best present she has ever given me, and I have to agree.",
        "",
        ["It ends the story by going back to the present from the first paragraph.", "它回到第一段提到的礼物，为故事收尾。"],
      ],
    ],
    extra: "The course was cancelled because of the bad weather.",
  },
  {
    title: "The town that closed its centre to cars",
    gaps: [
      [
        "Ten years ago, the main square of Velden was a car park.",
        "Today it is full of market stalls, children's games and tables from the cafés around it.",
        "The change came after the town council voted to close the centre to traffic.",
        [
          "*Today* contrasts with *Ten years ago*, and *The change* in the next sentence refers to this before and after.",
          "*Today* 与 *Ten years ago* 形成对比，下一句的 *The change* 指的就是这一前后变化。",
        ],
      ],
      [
        "Not everyone welcomed the idea.",
        "Shop owners, in particular, feared that customers who could not park outside would simply go elsewhere.",
        "Some of them even collected signatures against the plan.",
        [
          "*Shop owners* are the people who did not welcome it, and *Some of them* refers back to them.",
          "*Shop owners* 就是不欢迎这个想法的人，*Some of them* 指的是他们。",
        ],
      ],
      [
        "To answer these fears, the council built a large car park on the edge of town.",
        "From there, a free electric bus runs to the square every ten minutes.",
        "It takes less time than driving through the old streets ever did.",
        [
          "*There* is the new car park, and *It* in the next sentence is the bus journey.",
          "*There* 指新停车场，下一句的 *It* 指乘公交的路程。",
        ],
      ],
      [
        "The results surprised even the plan's supporters.",
        "Within two years, the number of people visiting the centre on Saturdays had risen by a third.",
        "Several shops that had been empty for years opened again.",
        [
          "It gives the surprising result, and the shops that opened again add a second one.",
          "它给出了令人意外的结果，重新开张的商店是第二个结果。",
        ],
      ],
      [
        "There have been problems, of course.",
        "Deliveries, for example, are now allowed only before ten in the morning, which suits some businesses better than others.",
        "A bakery owner told me that she now starts work at five to receive her flour.",
        [
          "*For example* gives one of the problems, and the baker's early start is a case of the rule on deliveries.",
          "*For example* 举出一个问题，面包店老板早起收面粉正是送货规定带来的。",
        ],
      ],
      [
        "Other towns in the region are now studying Velden's example.",
        "Its mayor is happy to share the lessons, but warns that no plan works without the support of local people.",
        "",
        ["*Its mayor* refers to Velden, and the warning ends the article.", "*Its mayor* 指 Velden 的镇长，这句提醒为文章收尾。"],
      ],
    ],
    extra: "The council has now decided to build a new road through the square.",
  },
  {
    title: "My first year as a wildlife photographer",
    gaps: [
      [
        "People imagine that wildlife photographers spend their days watching lions and eagles.",
        "The truth is that most of my first year was spent waiting.",
        "I once sat in a cold shelter for eleven hours and saw nothing but a single wet pigeon.",
        [
          "*The truth is* corrects what people imagine, and the eleven hours are an example of the waiting.",
          "*The truth is* 纠正了人们的想象，坐等十一个小时正是“等待”的例子。",
        ],
      ],
      [
        "My first paid job was to photograph otters on a river in Scotland.",
        "These shy animals are mostly active at dawn and dusk, when the light is poor.",
        "That meant getting up at four every morning and using a camera that could cope with the dark.",
        [
          "*These shy animals* are the otters, and the poor light explains *a camera that could cope with the dark*.",
          "*These shy animals* 指水獭，光线差解释了为什么需要 *a camera that could cope with the dark*。",
        ],
      ],
      [
        "For the first two weeks, I did not see a single otter.",
        "I began to wonder whether I had chosen the wrong career.",
        "Then, one misty morning, a mother and two cubs swam right past my feet.",
        ["Doubt after two weeks of failure prepares for *Then*, the turning point.", "两周一无所获后的怀疑，为转折 *Then* 做了铺垫。"],
      ],
      [
        "I was so excited that my hands shook.",
        "As a result, most of the pictures I took that morning were blurred.",
        "Only one was sharp, but it was the one that the magazine chose for its cover.",
        [
          "Shaking hands cause blurred pictures: *As a result* links the two, and *Only one was sharp* follows.",
          "手抖导致照片模糊：*As a result* 连接两者，后面接 *Only one was sharp*。",
        ],
      ],
      [
        "Since then, I have learned to stay calm at important moments.",
        "I breathe slowly, keep my elbows against my body and press the button gently.",
        "These small habits make a surprising difference.",
        [
          "It lists the ways of staying calm, and *These small habits* refers to them.",
          "它列出了保持冷静的方法，*These small habits* 指的就是它们。",
        ],
      ],
      [
        "I still spend most of my time waiting.",
        "But now I see the waiting as part of the job rather than a waste of time.",
        "",
        [
          "*But now* contrasts with *still* and ends the story with how the writer's view has changed.",
          "*But now* 与 *still* 形成对比，以作者看法的改变为故事收尾。",
        ],
      ],
    ],
    extra: "The otters were kept in a large tank at the zoo.",
  },
  {
    title: "Why I gave up my car",
    gaps: [
      [
        "Two years ago, my car failed its safety test, and the repairs would have cost more than it was worth.",
        "Instead of buying another one, I decided to try living without a car for a month.",
        "I expected to give up after a week.",
        [
          "*Instead of buying another one* follows the failed car, and *give up* refers to the experiment.",
          "*Instead of buying another one* 承接车子没通过检测，*give up* 指的是这次尝试。",
        ],
      ],
      [
        "The first problem was the weekly shopping.",
        "I could no longer fill the car with bags from the supermarket on the edge of town.",
        "So I started buying smaller amounts more often from the shops near my flat.",
        ["It explains the problem with shopping, and *So* gives the answer to it.", "它说明了购物的问题，*So* 给出了解决办法。"],
      ],
      [
        "This turned out to have an unexpected benefit.",
        "I wasted far less food, because I only bought what I needed for a day or two.",
        "Less waste meant lower bills, and I got to know the people who run the shops in my street.",
        [
          "*This* is buying smaller amounts, and *Less waste* in the next sentence refers to wasting less food.",
          "*This* 指少量多次购物，下一句的 *Less waste* 指浪费的食物少了。",
        ],
      ],
      [
        "Getting to work was harder.",
        "The bus takes forty minutes, compared with fifteen by car.",
        "At first I hated the extra time, but now I use it to read, which I had not done for years.",
        [
          "It gives the problem with getting to work, and *the extra time* refers to the longer journey.",
          "它说明了上班的问题，*the extra time* 指多出来的路上时间。",
        ],
      ],
      [
        "There are still times when I need a car, such as visiting my parents in the countryside.",
        "On those occasions, I rent one for the day through a car club.",
        "It costs about the same as a train ticket, and I don't have to worry about repairs.",
        [
          "*Those occasions* are the times when a car is needed, and *It costs* refers to renting one.",
          "*Those occasions* 指需要用车的时候，*It costs* 指租车的费用。",
        ],
      ],
      [
        "The month I planned has now become two years.",
        "I am fitter, I have more money in the bank, and I have not missed my car once.",
        "",
        ["It sums up the results and ends the article.", "它总结了结果，为文章收尾。"],
      ],
    ],
    extra: "My new car is faster and much cheaper to run.",
  },
  {
    title: "The night the lights went out",
    gaps: [
      [
        "It was the coldest evening of the winter when the power went off across our whole village.",
        "At first, nobody was worried, because it usually came back within minutes.",
        "But an hour later, the houses were still dark and getting colder.",
        [
          "*At first, nobody was worried* is turned around by *But an hour later*.",
          "*At first, nobody was worried* 被 *But an hour later* 转折。",
        ],
      ],
      [
        "My neighbour, Mrs Patel, who is eighty-five, lives alone next door.",
        "I knocked on her door to see if she was all right.",
        "She was sitting in the kitchen wrapped in two blankets, trying to read by candlelight.",
        ["Knocking on her door is how the writer came to see her in the kitchen.", "作者敲了她的门，才看到她坐在厨房里。"],
      ],
      [
        "Our house has an old wood stove, so we were the only family with any heat.",
        "I suggested that she should spend the evening with us.",
        "She refused at first, saying she did not want to be a trouble, but the cold soon changed her mind.",
        [
          "*She refused at first* answers an invitation, which must come just before it.",
          "*She refused at first* 是对邀请的回应，邀请必须紧挨在它前面。",
        ],
      ],
      [
        "By nine o'clock, word had spread.",
        "Three more neighbours had arrived, carrying food that was going to spoil in their fridges.",
        "We cooked it all on top of the stove and ate together in the warm kitchen.",
        [
          "*Word had spread* explains why more neighbours came, and *it all* refers to their food.",
          "*Word had spread* 解释了为什么又来了邻居，*it all* 指他们带来的食物。",
        ],
      ],
      [
        "Someone brought a guitar, and Mrs Patel taught us songs from her childhood.",
        "Nobody looked at a phone all evening, partly because most of the batteries had died.",
        "It was the first time I had ever spent a whole evening simply talking and singing with my neighbours.",
        [
          "No phones leads to *simply talking and singing*: nothing else took their attention.",
          "没有手机，才有 *simply talking and singing*：没有别的东西分散注意力。",
        ],
      ],
      [
        "The power came back at two in the morning.",
        "Before we went home, we all agreed to meet again, with or without electricity.",
        "Now, on the first Friday of every month, someone in the street hosts a dinner.",
        ["The promise to meet again is kept by the monthly dinner.", "每月一次的晚餐兑现了再聚的约定。"],
      ],
    ],
    extra: "The village shop sold out of candles the following morning.",
  },
];

/** paragraph shows one gap's paragraph with the gap marked. */
const paragraph = ([before, , after]: Gap) => [before, "___", after].filter((s) => s !== "").join(" ");

/** whole shows a text with all its gaps numbered. */
const whole = (g: Gapped) =>
  `**${g.title}**\n\n${g.gaps
    .map(([before, , after], i) => [before, `**(${i + 1})** ___`, after].filter((s) => s !== "").join(" "))
    .join("\n\n")}`;

function items(g: Gapped, wholeText: boolean): readonly SolvedChoice[] {
  const all = [...g.gaps.map(([, removed]) => removed), g.extra];
  return g.gaps.map((gap, i) => {
    const [, removed, , [en, zh]] = gap;
    const others = all.filter((s) => s !== removed);
    // Each gap offers three of the other sentences, turning through them so that the extra one comes up as often as the rest.
    const wrong = [0, 1, 2].map((k) => others[(i + k * 2) % others.length] as string);
    return {
      shown: wholeText ? `${whole(g)}\n\n**Gap ${i + 1}**` : paragraph(gap),
      right: removed,
      wrong,
      solution: t(
        `**${removed}** ${en} The other sentences belong in other gaps or in none: they do not link to the words around this one.`,
        `**${removed}** ${zh} 其他句子属于别的空格，或者哪个空格都不适合：它们和这个空格前后的话接不上。`,
      ),
    };
  });
}

/** gappedText is the Cambridge First topic of the gapped text. */
export const gappedText: TopicDef = examTopic({
  id: "fce-gapped-text",
  title: t("Gapped Text", "段落填句"),
  summary: t(
    "Cambridge First Reading Part 6 style: sentences have been taken out of a text, and each one goes back into its gap.",
    "剑桥 B2 First 阅读第 6 部分风格：从文章中抽出若干句子，把每一句放回它的空格。",
  ),
  strand: "reading",
  prerequisites: ["choosing-transitions"],
  encompasses: [
    { topic: "ordering-sentences-in-a-paragraph", weight: 0.3 },
    { topic: "choosing-transitions", weight: 0.2 },
  ],
  xp: 12,
  points: [
    point(
      "fce-filling-one-gap",
      t("Linking a Sentence to Its Neighbours", "让句子与前后衔接"),
      t(
        "A sentence that fits a gap links to the sentence **before** it and the sentence **after** it. Look for the words that point backwards or forwards: *this*, *these*, *them*, *there*, *the change*; linking words such as *so*, *yet*, *as a result*, *for example*; and names or ideas that come up again. A sentence that fits the subject but leaves *them* or *so* with nothing to refer to is wrong. Read the paragraph again with your sentence in the gap to check that it flows.",
        "能填入空格的句子要和**前一句**、**后一句**都衔接得上。寻找向前或向后指的词：*this*、*these*、*them*、*there*、*the change*；连接词，如 *so*、*yet*、*as a result*、*for example*；以及再次出现的名字或意思。一句话如果话题对，却让 *them* 或 *so* 无所指，就是错的。把句子放进空格再读一遍段落，确认读起来顺畅。",
      ),
      solvedChoiceGenerator(
        t("Choose the sentence that fills the gap.", "选出填入空格的句子。"),
        interleave(texts.map((g) => items(g, false))),
      ),
    ),
    point(
      "fce-working-through-a-text",
      t("Working Through a Whole Text", "完成整篇填句"),
      t(
        "In the exam, six sentences have been taken out of a text, and there is one more that fits nowhere. First read the whole text to follow its story or argument. Then take the gaps one by one, checking each sentence against what comes before and after. Every removed sentence fits somewhere, so one that looks possible for this gap may belong better in another; the extra sentence often matches the subject but contradicts the text.",
        "考试中，从一篇文章里抽出了六个句子，另外还有一个哪里都不适合的句子。先通读全文，把握故事或论证的脉络。再逐个空格处理，用前后文核对每个句子。每个被抽出的句子都有自己的位置，所以看起来适合这个空格的句子，也许更适合另一个空格；多出的那一句常常话题相符，却与文章矛盾。",
      ),
      solvedChoiceGenerator(
        t("Choose the sentence that fills the gap named below the text.", "选出填入短文下方指定空格的句子。"),
        interleave(texts.map((g) => items(g, true))),
      ),
    ),
  ],
});
