// The reading unit of Cambridge B2 First: six texts of about 400 to 500 words in the words of B2 and below, with
// questions in the formats of Reading and Use of English Parts 5 to 7: multiple choice on a long text, a gapped text
// whose missing sentences are chosen, and multiple matching across four short texts. Every text is written for this
// course.

import { type ReadingUnitDef, t } from "@ga/content";
import { readingWords } from "../levels/b2/reading-words.ts";
import { type Pair, passageMaker, type QuestionSpec } from "../levels/pre-a1/reading-kit.ts";

const passage = passageMaker(readingWords, []);

const multipleChoice = ["making-inferences", "authors-purpose", "tone-and-mood"];
const gappedText = ["ordering-sentences-in-a-paragraph", "choosing-transitions"];
const matching = ["making-inferences"];

/** Removed is a sentence taken out of a gapped text: the sentence, and why it fits its gap. */
type Removed = readonly [sentence: Pair, why: Pair];

/** shown gives a sentence of the text as an option, with its meaning for Chinese readers. */
const shown = ([en, zh]: Pair): Pair => [en, `${en}（${zh}）`];

/**
 * gapQuestions asks, for each gap of a text in turn, which sentence fills it. removed are the sentences in the order of
 * the gaps, and extra is one that fits no gap; each question offers the right sentence and three others.
 */
function gapQuestions(removed: readonly Removed[], extra: Pair): readonly QuestionSpec[] {
  const all = [...removed.map(([s]) => s), extra];
  return removed.map(([sentence, why], i): QuestionSpec => {
    const others = all.filter((s) => s !== sentence);
    const wrong = [0, 1, 2].map((k) => others[(i + k * 2) % others.length] as Pair);
    return [
      [`Which sentence fits gap ${i + 1}?`, `哪个句子适合填入第 ${i + 1} 个空？`],
      shown(sentence),
      [...new Set(wrong)].map(shown),
      why,
    ];
  });
}

/** match asks which of the people of a text a statement fits; people are their names in English and Chinese. */
function match(people: readonly Pair[], prompt: Pair, right: string, why: Pair): QuestionSpec {
  const named = (p: Pair): Pair => [p[0], `${p[0]}（${p[1]}）`];
  const person = people.find((p) => p[0] === right);
  if (!person) throw new Error(`no person ${right}`);
  return [prompt, named(person), people.filter((p) => p !== person).map(named), why];
}

const volunteers: readonly Pair[] = [
  ["Hana", "哈娜"],
  ["Leo", "利奥"],
  ["Sofia", "索菲娅"],
  ["Ben", "本"],
];
const nightWorkers: readonly Pair[] = [
  ["Ruth", "露丝"],
  ["Daniel", "丹尼尔"],
  ["Tomasz", "托马斯"],
  ["Amira", "阿米拉"],
];

/** fceReading is the reading unit of the Cambridge B2 First course. */
export const fceReading: ReadingUnitDef = {
  id: "fce-reading",
  title: t("B2 First Reading", "B2 First 阅读"),
  passages: [
    passage({
      id: "fce-reading-a-year-without-a-phone",
      title: ["A Year Without a Phone", "没有手机的一年"],
      body: `When my phone broke on the first day of January, I did not replace it. At first it was meant to be a short experiment, a week or two to see whether I could manage. In the end, it went on for a whole year, and I have been asked about it so often since then that I have decided to write down what really happened.

The first month was the hardest. I kept putting my hand into my pocket for something that was not there, perhaps fifty times a day. Every time I was waiting for a bus or standing in a line at the shops, I felt a kind of fear, as if I had forgotten something important. I had not noticed that I almost never stood still and looked around me. Slowly, though, the fear turned into something more like being bored, and then, to my surprise, into a kind of calm.

Practical problems were less serious than I had expected. I bought a paper map of the city and a cheap clock to wake me up, and I learned the numbers of my parents and my two best friends by heart. For everything else, I used the computer at home. My friends were less patient. Arranging to meet someone without a phone means agreeing on a time and a place and then actually being there, and several of them admitted that they found this much more difficult than they expected. One friend stopped inviting me out, because, as she put it, I was "too much work".

What I had not predicted was the effect on my memory. Without a screen to remind me, I had to remember dates, addresses and train times myself, and I discovered that my memory was far better than I had believed. I also read more books that year than in the five years before it together, mostly on buses and in waiting rooms, the places where I had once looked through news that I forgot at once.

There were costs, too. I missed the photos that my sister shared online when her baby first walked, and I was not able to call for help when my bike broke down late one evening on a country road. I walked home for two hours in the rain, and I was more angry with myself than I would like to admit.

When the year ended, I bought a new phone. I use it in a different way now. It stays in a box by the door when I am at home, and I do not take it out when I am talking to someone. I am not trying to persuade anyone to follow my example; for most people, a year without a phone would be impossible. But I would suggest a smaller experiment: leave it at home for one afternoon, and notice what you notice.`,
      grammar: multipleChoice,
      questions: [
        [
          ["Why has the writer decided to write about her year?", "作者为什么决定写下她的这一年？"],
          ["Many people have asked her about it.", "很多人问过她这件事。"],
          [
            ["She wants other people to try it too.", "她希望别人也试一试。"],
            ["She had always planned to write about it.", "她一直打算写这件事。"],
            ["She wants to explain why her phone broke.", "她想解释手机为什么坏了。"],
          ],
          [
            'She says she has "been asked about it so often" that she decided to write it down. At the end she says she is "not trying to persuade anyone".',
            "她说“被问到的次数太多了”，所以决定写下来。结尾她说自己“并不想说服任何人”。",
          ],
        ],
        [
          ["How did the writer feel while waiting during the first month?", "第一个月等待的时候，作者有什么感受？"],
          ["Uneasy, as if something was missing", "不安，好像少了什么"],
          [
            ["Calm, because she could look around her", "平静，因为她可以看看四周"],
            ["Bored, because the buses were late", "无聊，因为公交车晚点"],
            ["Proud of what she was doing", "为自己的做法感到骄傲"],
          ],
          [
            'She "felt a kind of fear, as if I had forgotten something important". Calm came only later, after boredom.',
            "她“感到一种恐惧，好像忘了什么重要的东西”。平静是后来的事，在无聊之后才出现。",
          ],
        ],
        [
          [
            'What does "this" refer to in "they found this much more difficult than they expected"?',
            "“they found this much more difficult than they expected”中的“this”指什么？",
          ],
          ["Being at an agreed place at an agreed time", "在约定的时间到达约定的地点"],
          [
            ["Learning phone numbers by heart", "背下电话号码"],
            ["Inviting the writer to parties", "邀请作者参加聚会"],
            ["Finding their way with a paper map", "用纸质地图找路"],
          ],
          [
            '"This" points back to arranging a meeting without a phone: "agreeing on a time and a place and then actually being there".',
            "“this”指的是不用手机约见面这件事：“约好时间和地点，然后真的按时到那里”。",
          ],
        ],
        [
          ["What surprised the writer most during the year?", "这一年中最让作者意外的是什么？"],
          ["How well she could remember things", "自己的记性竟然这么好"],
          [
            ["How few practical problems there were", "实际问题竟然这么少"],
            ["How patient her friends were", "朋友们竟然这么有耐心"],
            ["How much she enjoyed the news", "她竟然这么喜欢看新闻"],
          ],
          [
            'She "had not predicted" the effect on her memory, which was "far better than I had believed". Her friends were "less patient".',
            "她“没有预料到”对记忆的影响，她的记性“比自己以为的好得多”。朋友们反而“没那么有耐心”。",
          ],
        ],
        [
          ["How did the writer feel after walking home in the rain?", "冒雨走回家之后，作者有什么感受？"],
          ["Annoyed with herself", "生自己的气"],
          [
            ["Pleased that she had managed alone", "为自己独自应付过来而高兴"],
            ["Angry with her sister", "生姐姐的气"],
            ["Frightened of riding her bike again", "害怕再骑自行车"],
          ],
          ['She "was angrier with myself than I would like to admit".', "她说自己“比愿意承认的还要生自己的气”。"],
        ],
        [
          ["What is the writer's main message in the last paragraph?", "最后一段作者主要想说什么？"],
          ["A short time without a phone can teach you something.", "短时间不用手机也能让人有所收获。"],
          [
            ["Everyone should spend a year without a phone.", "每个人都应该一年不用手机。"],
            ["She is sorry that she bought a new phone.", "她后悔买了新手机。"],
            ["Her experiment was not worth the trouble.", "她的实验不值得费这番功夫。"],
          ],
          [
            'She says a year "would be impossible" for most people, but suggests leaving the phone at home "for one afternoon".',
            "她说对大多数人来说一年“是不可能的”，但建议把手机留在家里“一个下午”。",
          ],
        ],
      ],
    }),
    passage({
      id: "fce-reading-the-woman-who-mapped-the-ocean-floor",
      title: ["The Woman Who Mapped the Ocean Floor", "绘制海底地图的女性"],
      body: `For most of history, people knew less about the floor of the ocean than about the far side of the moon. They knew that the sea went down a long way, but they imagined its floor as empty and even, like a desert under the water. The person who did most to change that picture never once went down to see it. Her name was Marie Tharp, and she drew the first map of the floor of all the oceans of the world.

Tharp was born in Michigan in 1920. Her father made maps of the land for the government, and as a child she often traveled with him for his work. Later, she studied the science of rocks at a time when few women did. During the Second World War, many young men were away at war, and universities began to accept women in subjects that had been closed to them before. In 1948, she found a job at a research center of Columbia University in New York, where she began to work with a young scientist called Bruce Heezen.

Their work was divided in a way that seems strange today. Women were not allowed on the research ships of the university, so Heezen crossed the Atlantic by ship, measuring how far down the ocean floor was, while Tharp stayed in the office and turned thousands of numbers into pictures. It was slow, careful work, done by hand with pens and long pieces of paper.

In 1952, as she was drawing the middle of the Atlantic, Tharp noticed something unexpected. Along the top of a long line of mountains under the sea ran a valley, as if the mountains had been pulled away from each other. She believed this showed that the floor of the ocean was slowly spreading. At that time, most scientists, Heezen included, did not accept the idea that the continents moved, and he told her that her valley was impossible. It took him almost a year to change his opinion, after other data showed that small earthquakes happened along exactly the same line.

Over the next twenty years, Tharp and Heezen made maps of every ocean on Earth. Their final map, painted by the artist Heinrich Berann and published in 1977, showed a world that no one had seen: huge lines of mountains, valleys and long breaks in the ocean floor that went around the planet like the lines on a tennis ball. It helped to persuade the last scientists who still had doubts that the surface of the Earth is made of huge moving pieces.

For many years, Tharp's part in the discovery was hardly mentioned, and the scientific papers about it usually carried Heezen's name instead of hers. Recognition came late, but it came. In the last years of her life, she received several important prizes, and today her maps are seen as one of the great scientific achievements of the last century.`,
      grammar: multipleChoice,
      names: ["Marie", "Tharp", "Tharp's", "Columbia", "Bruce", "Heezen", "Heezen's", "Atlantic", "Heinrich", "Berann", "Michigan", "York"],
      questions: [
        [
          ["Before Tharp's work, what did people think the ocean floor was like?", "在塔普的研究之前，人们认为海底是什么样的？"],
          ["Empty and even, with nothing on it", "空旷平坦，什么也没有"],
          [
            ["Covered in mountains and valleys", "布满山脉和峡谷"],
            ["Too far down to imagine at all", "深得根本无法想象"],
            ["Similar to the surface of the moon", "和月球表面相似"],
          ],
          [
            'They "imagined its floor as empty and even, like a desert under the water". The moon is mentioned only to say how little was known.',
            "人们“把海底想象成空旷平坦的样子，就像水下的沙漠”。提到月球只是为了说明人们对海底知道得多么少。",
          ],
        ],
        [
          ["Why did Tharp stay in the office while Heezen sailed?", "为什么希森出海时塔普留在办公室？"],
          ["Women were not permitted on the ships.", "女性不能上船。"],
          [
            ["She preferred drawing to collecting measurements.", "比起收集数据，她更喜欢绘图。"],
            ["She did not enjoy travelling by sea.", "她不喜欢乘船旅行。"],
            ["Only one of them could be paid to sail.", "只有一个人能拿报酬出海。"],
          ],
          ['"Women were not allowed on the university\'s research ships."', "原文说“大学的科考船不允许女性登船”。"],
        ],
        [
          ["How did Heezen first react to the valley?", "希森最初对这条峡谷有什么反应？"],
          ["He refused to believe it.", "他拒绝相信。"],
          [
            ["He asked her to check her numbers.", "他让她核对数据。"],
            ["He told other scientists about it.", "他把它告诉了其他科学家。"],
            ["He said earthquakes had caused it.", "他说是地震造成的。"],
          ],
          [
            'He "told her that her valley was impossible", because he did not accept the idea that continents moved.',
            "他“告诉她这条峡谷是不可能存在的”，因为他不接受大陆会移动的观点。",
          ],
        ],
        [
          ["What finally changed Heezen's mind?", "最终是什么改变了希森的看法？"],
          ["Evidence of earthquakes along the same line", "沿同一条线发生地震的证据"],
          [
            ["The painted map of 1977", "1977 年的手绘地图"],
            ["A journey to the bottom of the sea", "一次去海底的旅行"],
            ["The views of other scientists", "其他科学家的看法"],
          ],
          [
            'He changed his opinion "after other data showed that small earthquakes happened along exactly the same line".',
            "“其他测量显示小地震恰好沿着同一条线发生”之后，他才改变了看法。",
          ],
        ],
        [
          [
            'Why does the writer compare the breaks in the ocean floor to "the lines on a tennis ball"?',
            "作者为什么把这些裂缝比作“网球上的线”？",
          ],
          ["To show that they go all the way around the Earth", "为了说明它们环绕整个地球"],
          [
            ["To suggest that they are very small", "为了说明它们很小"],
            ["To explain why they were hard to find", "为了解释它们为什么难以发现"],
            ["To show that the Earth is round", "为了说明地球是圆的"],
          ],
          [
            'The breaks "went around the planet" as the lines go around a ball: the comparison shows their shape and length.',
            "裂缝“环绕着地球”，就像网球上的线环绕着球：这个比喻说明了它们的形状和长度。",
          ],
        ],
        [
          ["What does the last paragraph say about Tharp?", "最后一段关于塔普说了什么？"],
          ["Her work was not properly recognised for a long time.", "她的工作长期没有得到应有的承认。"],
          [
            ["She was angry that Heezen took the credit.", "她因为希森占了功劳而生气。"],
            ["She never received any prizes for her work.", "她的工作从未获得任何奖项。"],
            ["Her maps are no longer used by scientists.", "科学家已经不再使用她的地图。"],
          ],
          [
            'Her part "was hardly mentioned" for many years, and "recognition came late". The text says nothing about her feelings.',
            "她的贡献多年来“几乎没人提起”，“认可来得很晚”。原文没有提到她的感受。",
          ],
        ],
      ],
    }),
    passage({
      id: "fce-reading-learning-to-cook-at-forty",
      title: ["Learning to Cook at Forty", "四十岁学做饭"],
      body: `Until last year, I could cook boiled eggs, bread with cheese and anything that came in a box with instructions on the back. I am forty-one, and for most of my adult life this did not seem like a problem. I lived in a city full of cheap restaurants, and I was usually too busy to care. **[1]**

My daughter was the reason I changed. She came home from school one day and announced that her class was making a book of recipes, and that every child had to bring a dish cooked by a parent. Her mother was working abroad that month. **[2]** I realized, and I was a little embarrassed, that I did not know how to cook a single meal from the beginning.

I signed up for an evening class at the local college, where twelve of us met every Tuesday in a large kitchen. Most of the others had stopped working, and several had cooked for decades but wanted to learn new dishes. **[3]** They showed me how to hold a knife the right way, how to tell when oil was hot enough, and why you should taste food while you cook it and not only at the end.

The hardest lesson was patience. I wanted everything to happen quickly, and I kept turning the heat up to save time. The result was usually burned on the outside and raw in the middle. Our teacher, a calm woman who had run a restaurant for twenty years, told me that most of cooking is waiting. **[4]** Onions, she said, take as long as they take.

By the end of the course, I could make about ten dishes well, and I had cooked the chicken soup my grandmother used to make, from memory, for my daughter and her class. It was not the best soup in the world, but every bowl was empty. Since then, I have cooked dinner for us most evenings. **[5]** Instead, an hour in the kitchen after work has become the most relaxing part of my day.`,
      grammar: gappedText,
      questions: gapQuestions(
        [
          [
            ["Cooking for one person also seemed like a waste of time.", "为一个人做饭似乎也是浪费时间。"],
            [
              "The paragraph gives reasons why not cooking did not matter: cheap restaurants, no time. *Also* adds one more reason.",
              "这一段列举不做饭也无所谓的理由：便宜的餐馆、没有时间。*also* 又加了一个理由。",
            ],
          ],
          [
            ["That meant the job was mine.", "这意味着这件事落到了我头上。"],
            [
              "The mother is away, so *that* points back to her absence, and the next sentence shows the writer facing the job.",
              "母亲不在家，*that* 指的就是她不在这件事；下一句写作者面对这项任务。",
            ],
          ],
          [
            ["I was the youngest by about twenty years, and they were very kind to me.", "我比他们小了大约二十岁，他们对我非常好。"],
            [
              "The sentence before describes the others in the class, and *They* in the next sentence refers to these kind older people.",
              "前一句描述班上的其他人，下一句的 *They* 指的就是这些和善的长者。",
            ],
          ],
          [
            ["It was the most useful thing anyone told me that year.", "这是那一年别人对我说过的最有用的话。"],
            [
              "*It* refers to the teacher's advice that cooking is waiting, and the next sentence repeats what she said.",
              "*It* 指老师说做饭主要是等待的那句话，下一句接着转述她的话。",
            ],
          ],
          [
            ["I had expected it to feel like one more job to do.", "我原以为这会像是又多了一件要做的事。"],
            [
              "*Instead* in the next sentence needs an expectation to contrast with: a job, not a pleasure.",
              "下一句的 *Instead* 需要一个与之对比的预期：以为是一项任务，结果却是享受。",
            ],
          ],
        ],
        ["My grandmother had never written any of her recipes down.", "我奶奶从来没有把她的菜谱写下来过。"],
      ),
    }),
    passage({
      id: "fce-reading-a-theatre-that-saved-a-town",
      title: ["A Theatre That Saved a Town", "一座拯救了小镇的剧院"],
      body: `Twenty years ago, Holbridge was a town that people left. The factory that had employed half of its workers had closed, the shops on the main street were empty one after another, and young people moved to the city as soon as they finished school. In the middle of the main street stood the Royal, an old theater with broken windows, which had not shown a play since 1985. **[1]**

The change began with a retired teacher called Margaret Hale. She had acted at the Royal as a girl, and she could not bear to watch it fall down. In 2006 she wrote a letter to the local newspaper, asking anyone who cared about the building to meet her there one Saturday morning. She expected perhaps a dozen people. **[2]**

The group had no money and no experience of running a theater, but it had plenty of energy. Volunteers took out years of old trash, painted walls and repaired seats, while others organized concerts and cake sales to pay for a new roof. **[3]** It took four years, and many arguments, before the Royal opened its doors again with a show performed by local children.

What happened next surprised everyone. People came from other towns to see shows at the Royal, and they needed a place to eat before and after. A coffee shop opened opposite the theater, then a restaurant, then a small hotel. **[4]** Today, the main street has hardly any empty shops, and the population of the town is growing for the first time in fifty years.

Not everyone is happy about the change. Some older people complain that house prices have risen and that the town is full of strangers at weekends. Margaret Hale, now over eighty, understands their point of view. **[5]** "A theater can't save a town on its own," she says. "People do that. The theater just gave them a reason to come."`,
      grammar: gappedText,
      names: ["Holbridge", "Royal", "Margaret", "Hale"],
      questions: gapQuestions(
        [
          [
            ["Most people agreed that it would soon have to be pulled down.", "大多数人都认为它很快就得被拆掉。"],
            [
              "The paragraph describes a town in decline, and *it* refers to the broken old theatre just mentioned.",
              "这一段描写一个衰落的小镇，*it* 指刚提到的那座破旧剧院。",
            ],
          ],
          [
            ["More than two hundred arrived.", "结果来了两百多人。"],
            [
              "The number answers *She expected perhaps a dozen people*, and the surprise leads into *The group* that follows.",
              "这个数字回应了“她以为大概只有十来个人”，这份意外又引出下文的 *The group*。",
            ],
          ],
          [
            ["A local builder offered his workers at weekends for nothing.", "一位当地的建筑商周末免费派来了他的工人。"],
            [
              "The paragraph lists who helped with the work and the money; free workers from a builder belong in that list, before the four years it took.",
              "这一段列举谁在出力、谁在筹钱；建筑商免费提供工人正属于这一类，接着才是花了四年时间。",
            ],
          ],
          [
            ["Each of them employed young people who might otherwise have moved away.", "每一家都雇用了本来可能会离开的年轻人。"],
            [
              "*Each of them* refers to the coffee shop, the restaurant and the hotel, and young people staying links back to the first paragraph.",
              "*Each of them* 指咖啡馆、餐馆和旅馆；年轻人留下来又呼应了第一段。",
            ],
          ],
          [
            ["But she points out that the town had no future without it.", "但她指出，没有它，小镇就没有未来。"],
            [
              "*But* turns from understanding the complaints to her own view, which her words in the next sentences explain.",
              "*But* 从理解别人的抱怨转到她自己的看法，后面引用的话进一步说明了这一点。",
            ],
          ],
        ],
        ["Tickets for the first show sold out in less than an hour.", "第一场演出的票不到一小时就卖光了。"],
      ),
    }),
    passage({
      id: "fce-reading-four-young-volunteers",
      title: ["Four Young Volunteers", "四位年轻的志愿者"],
      body: `**Hana**

I started at the animal center because I needed something for my university application, if I'm honest. For the first few weeks I nearly stopped going. The work was dirty, the dogs were noisy, and nobody seemed to notice whether I was there or not. Then a very scared old dog arrived who wouldn't let anyone near him. I sat beside him every afternoon for a month, reading, until one day he put his head on my knee. After that I was completely won over. I had planned to study business, but I've changed my plans: I'm applying to train as an animal doctor next year.

**Leo**

Every Thursday evening I help older people at the library to use computers and phones. I thought it would be easy, because I've used technology all my life, but explaining something you've always known is much harder than I expected. My first student wanted to send a photo to her grandchild, and it took us three weeks. I've had to learn to slow down and stop using words that mean nothing to them. What I didn't expect is how much they teach me. One man, who's ninety, has told me more about the history of our town than I learned in ten years at school.

**Sofia**

My grandmother used to work at the food bank in our town, and when she hurt her back last year, I offered to take her place on Saturdays. I check the food that people give, look at the dates and pack boxes for families. At first I felt embarrassed when people came in, because I didn't know what to say. Now I know many of them by name, and we chat while I pack. It has made me think about people who need help in a different way: most of them have jobs, and many are just one unexpected bill away from real problems, like anyone.

**Ben**

Last summer I spent two months with a group repairing paths in a national park. We lived in tents, worked outside in all kinds of weather and carried stones up the mountain by hand. It was very hard work, but I loved being part of a team. I also learned how to use a lot of tools, and when I came home, a local building company gave me a job in part because of that experience. I still go back to the park for a weekend every few months. The people I met there are now some of my best friends.`,
      grammar: matching,
      names: ["Hana", "Leo", "Sofia", "Ben"],
      questions: [
        match(volunteers, ["Which volunteer nearly stopped going?", "哪位志愿者差点不去了？"], "Hana", [
          'Hana: "For the first few weeks I nearly stopped going."',
          "Hana 说：“头几个星期我差点不去了。”",
        ]),
        match(volunteers, ["Which volunteer found the work harder than expected?", "哪位志愿者觉得这份工作比预想的难？"], "Leo", [
          'Leo "thought it would be easy", but explaining is "much harder than I expected". Ben found his work hard, but says nothing about what he expected.',
          "Leo“以为会很容易”，但解释起来“出人意料地难”。Ben 觉得很累，但没有说他原来的预期。",
        ]),
        match(volunteers, ["Which volunteer took over from a member of the family?", "哪位志愿者接替了一位家人？"], "Sofia", [
          'Sofia offered "to take her place" when her grandmother hurt her back.',
          "奶奶伤了背之后，Sofia 主动“接替了她”。",
        ]),
        match(
          volunteers,
          ["Which volunteer got paid work partly because of what they learned?", "哪位志愿者部分因为学到的东西而找到了有报酬的工作？"],
          "Ben",
          [
            'Ben learned to use tools, and a building company "gave me a job in part because of that experience".',
            "Ben 学会了使用工具，一家建筑公司“部分因为这段经历给了我一份工作”。",
          ],
        ),
        match(volunteers, ["Which volunteer has changed their plans for the future?", "哪位志愿者改变了对未来的打算？"], "Hana", [
          'Hana "had planned to study business", but is now applying to train as an animal doctor.',
          "Hana“原本打算学商科”，现在却要申请学兽医。",
        ]),
        match(
          volunteers,
          ["Which volunteer now sees the people they help differently?", "哪位志愿者现在对所帮助的人有了不同的看法？"],
          "Sofia",
          [
            'Sofia says it "has made me think about people who need help in a different way".',
            "Sofia 说这“让我对需要帮助的人有了不同的看法”。",
          ],
        ),
        match(
          volunteers,
          ["Which volunteer has learned about the past of the place where they live?", "哪位志愿者了解到了自己所住地方的过去？"],
          "Leo",
          [
            'A man of ninety "has told me more about the history of our town" than school did.',
            "一位九十岁的老人“给我讲的我们镇的历史”比学校教的还多。",
          ],
        ),
      ],
    }),
    passage({
      id: "fce-reading-night-shift-at-the-zoo",
      title: ["Night Shift at the Zoo", "动物园的夜班"],
      body: `**Ruth**

Most visitors think the zoo goes to sleep when the gates close, but for many animals, night is when the day begins. I look after the animals that are active in the dark: owls, foxes and a family of small wild cats from the forests of Asia. I check that they are eating, clean what I can without getting in their way and write notes on anything strange. The hardest part is my own body. After six years, I still feel terrible at four in the morning, and I've never really got used to sleeping in the day. But I wouldn't change jobs. Watching the cats hunt in the light of the moon is something few people ever see.

**Daniel**

I'm the animal doctor here. I'm not at work every night, but I'm the person they call if something goes wrong. Animals don't choose convenient times to get ill, and births especially often happen at night. Last spring I spent eleven hours with a giraffe who was having a very difficult birth. It was the most worrying night of my career, and at one point I was sure we would lose both of them. In the end, a healthy baby was standing up within an hour of being born. Nights like that are why I chose this work, even if I'm no good for anything the next day.

**Tomasz**

I work in security here. People think my job is about stopping thieves, and it's true that people have tried to steal birds' eggs a few times over the years. But mostly I'm walking around checking that the fences, the gates and the heating are working. If the heating fails in the snake house on a winter night, the animals can be at risk within hours. I enjoy the quiet. During the day this place is full of noise and children, but at night you hear things you would never notice: the lions calling to each other, or the sound of rain on the leaves. I find it very peaceful.

**Amira**

I'm writing a long study for my university on how zoo animals sleep, so I spend three nights a week in a small room watching cameras. It sounds boring, and some nights it is. But we know very little about the subject, and the zoo lets me observe animals that would be almost impossible to study in the wild. I've discovered, for example, that our elephants sleep for only about four hours a night, and lie down for just two of them. My results could help zoos design better places for animals to rest.`,
      grammar: matching,
      names: ["Ruth", "Daniel", "Tomasz", "Amira", "Asia"],
      questions: [
        match(nightWorkers, ["Who still finds working at night hard on their body?", "谁仍然觉得上夜班对身体是一种折磨？"], "Ruth", [
          'Ruth: "I still feel terrible at four in the morning."',
          "Ruth 说：“我在凌晨四点仍然感觉很糟。”",
        ]),
        match(nightWorkers, ["Who describes a night when they feared the worst?", "谁讲述了一个担心发生最坏情况的夜晚？"], "Daniel", [
          'Daniel "was sure we would lose both of them" during the birth.',
          "Daniel 在分娩过程中一度“确信两个都保不住了”。",
        ]),
        match(nightWorkers, ["Who says that people have the wrong idea about their job?", "谁说人们对他的工作有误解？"], "Tomasz", [
          '"People think my job is about stopping thieves", but it is "mostly" checking the fences and the heating. Ruth speaks about the zoo, not her job.',
          "“人们以为我的工作是抓小偷”，其实“主要”是检查围栏和供暖。Ruth 说的是动物园，而不是她的工作。",
        ]),
        match(nightWorkers, ["Who hopes their work will make life better for animals?", "谁希望自己的工作能让动物生活得更好？"], "Amira", [
          'Her results "could help zoos design better places for animals to rest".',
          "她的研究结果“可以帮助动物园设计更好的休息空间”。",
        ]),
        match(nightWorkers, ["Who mentions a danger caused by cold weather?", "谁提到了寒冷天气带来的危险？"], "Tomasz", [
          'If the heating fails "on a winter night, the animals can be at risk within hours".',
          "如果供暖系统“在冬夜”出故障，“动物几个小时内就会有危险”。",
        ]),
        match(nightWorkers, ["Who admits that their work can be dull?", "谁承认自己的工作有时很枯燥？"], "Amira", [
          'Amira: "It sounds boring, and some nights it is."',
          "Amira 说：“听起来很无聊，有些晚上确实如此。”",
        ]),
        match(nightWorkers, ["Who is called in only when they are needed?", "谁只在需要的时候才被叫来？"], "Daniel", [
          'Daniel is "not at work every night" but is "the person they call if something goes wrong".',
          "Daniel“不是每晚都上班”，但“出了问题时大家会打电话找我”。",
        ]),
      ],
    }),
  ],
};
