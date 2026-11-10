// Writing: how the sentences of a paragraph work together.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, type OrderItem, orderGenerator, point } from "@ga/subject-english";

/** paragraphChoice is an item that shows sentences and asks for one of them, the first listed being the answer. */
const paragraphChoice = (right: string, ...others: readonly string[]): ChoiceItem => ["", right, others];

const findTopicBank: readonly ChoiceItem[] = [
  paragraphChoice(
    "Honeybees depend on one another to survive.",
    "Worker bees gather nectar from flowers.",
    "Other bees guard the hive.",
    "The queen lays all the eggs.",
  ),
  paragraphChoice(
    "Our town library offers much more than books.",
    "Children can attend story hour on Saturdays.",
    "Anyone can borrow a tablet for a week.",
    "Volunteers teach computer classes at night.",
  ),
  paragraphChoice(
    "Bicycles are a practical way to get around a city.",
    "They fit through heavy traffic.",
    "They are easy to park.",
    "They cost little to repair.",
  ),
  paragraphChoice(
    "Deserts are home to surprisingly many animals.",
    "Lizards hide under rocks at noon.",
    "Foxes hunt after dark.",
    "Beetles collect water from the morning fog.",
  ),
  paragraphChoice(
    "Learning to cook pays off in several ways.",
    "Meals made at home cost less.",
    "You can choose healthier ingredients.",
    "Friends enjoy eating what you make.",
  ),
  paragraphChoice(
    "The old bridge is no longer safe.",
    "Its beams have rusted through.",
    "Large cracks run across the deck.",
    "Pieces of stone have fallen into the river.",
  ),
  paragraphChoice(
    "Volcanoes can help as well as harm.",
    "Ash makes farm soil rich.",
    "Hot springs provide power to nearby towns.",
    "New islands form from cooled lava.",
  ),
  paragraphChoice(
    "Sleep affects how well students learn.",
    "Tired students have trouble paying attention.",
    "Memories get stored during deep sleep.",
    "Rested students solve problems faster.",
  ),
];

const chooseTopicBank: readonly ChoiceItem[] = [
  [
    "Details: Owls hear tiny sounds. Their wings make no noise. Their claws grip hard.",
    "Owls are built to hunt.",
    ["Owls live in many countries.", "Their claws grip hard."],
  ],
  [
    "Details: Tickets cost less online. You skip the line. You can pick your seat.",
    "Buying tickets online has real advantages.",
    ["The theater opens at noon.", "You skip the line."],
  ],
  [
    "Details: Trees give shade. They clean the air. They shelter birds.",
    "Trees do a great deal for a neighborhood.",
    ["Some trees lose their leaves.", "They shelter birds."],
  ],
  [
    "Details: The roof leaked. The heater broke. The door would not lock.",
    "The cabin was in terrible shape.",
    ["We reached the cabin at dusk.", "The door would not lock."],
  ],
  [
    "Details: Dogs guide people who cannot see. They find lost hikers. They sniff out danger at airports.",
    "Dogs do many important jobs.",
    ["Dogs come in many sizes.", "They find lost hikers."],
  ],
  [
    "Details: Lights were left on. Water ran all day. Windows stayed open in winter.",
    "Our school wastes a lot of energy.",
    ["Our school has two floors.", "Water ran all day."],
  ],
  [
    "Details: She practiced every morning. She studied old games. She asked her coach for advice.",
    "Tara worked hard to improve at chess.",
    ["Chess is an old game.", "She studied old games."],
  ],
  [
    "Details: Salt kept meat from spoiling. Armies were paid with it. Roads were built to carry it.",
    "Salt once mattered far more than it does today.",
    ["Salt is found in the sea.", "Armies were paid with it."],
  ],
];

const timeOrderBank: readonly OrderItem[] = [
  {
    sentences: [
      "First, mix the flour and the eggs.",
      "Next, pour the batter into a hot pan.",
      "When bubbles appear, flip the pancake.",
      "Finally, serve it with fruit.",
    ],
  },
  {
    sentences: [
      "Early that morning, Noor packed her bag.",
      "She caught the first bus to the coast.",
      "By noon she had reached the beach.",
      "That evening she watched the sun go down.",
    ],
  },
  {
    sentences: [
      "A seed falls into the soil.",
      "After a rain, a small root pushes down.",
      "Soon a green shoot breaks the surface.",
      "Over the years, it grows into a tall tree.",
    ],
  },
  {
    sentences: [
      "The alarm rang at six.",
      "Leo got dressed and ate quickly.",
      "Then he ran to the corner to catch the bus.",
      "He arrived at school just before the bell.",
    ],
  },
  {
    sentences: [
      "First, choose a topic you care about.",
      "Then write down everything you know about it.",
      "Next, put your ideas in order.",
      "Last, write your first draft.",
    ],
  },
  {
    sentences: [
      "In spring, the bird built a nest.",
      "A few weeks later, she laid four eggs.",
      "After the eggs hatched, she fed the chicks.",
      "By summer, the young birds had flown away.",
    ],
  },
  {
    sentences: [
      "The storm began late at night.",
      "By midnight, the wind had knocked down the power lines.",
      "Crews worked until dawn to repair them.",
      "The lights came back on at breakfast.",
    ],
  },
  {
    sentences: [
      "Fill the kettle with water.",
      "While it heats, put a tea bag in a cup.",
      "When the water boils, pour it over the tea.",
      "After three minutes, take out the bag.",
    ],
  },
];

const logicOrderBank: readonly OrderItem[] = [
  {
    sentences: [
      "Our class garden had a terrible problem last spring.",
      "Something was eating the lettuce every night.",
      "We set up a camera to catch the thief.",
      "The video showed a family of rabbits.",
    ],
  },
  {
    sentences: [
      "Penguins have a clever way to keep warm.",
      "They crowd together in large groups.",
      "Those on the outside slowly move toward the middle.",
      "This way, each bird gets a turn in the warmth.",
    ],
  },
  {
    sentences: [
      "Our city wants to build a new park.",
      "However, the only open land is a parking lot.",
      "Shop owners worry that this will hurt their business.",
      "The council will vote on the plan next month.",
    ],
  },
  {
    sentences: [
      "Camels are well suited to the desert.",
      "Their humps store fat for long journeys.",
      "That fat lets them go for days without food.",
      "Their long lashes also keep out blowing sand.",
    ],
  },
  {
    sentences: [
      "Maps have changed a great deal.",
      "Long ago, they were drawn by hand.",
      "These old maps often contained errors.",
      "Today, satellites make maps far more exact.",
    ],
  },
  {
    sentences: [
      "Our team lost its first three games.",
      "The coach decided that we needed more practice.",
      "We began meeting before school each day.",
      "Those extra hours led to a win in the fourth game.",
    ],
  },
  {
    sentences: [
      "Bats are often misunderstood.",
      "Many people think that they are blind.",
      "In fact, they can see quite well.",
      "They also use echoes to find insects in the dark.",
    ],
  },
  {
    sentences: [
      "The school lunch line was far too long.",
      "Students had only ten minutes left to eat.",
      "A group of students suggested opening a second line.",
      "Now everyone has time to finish lunch.",
    ],
  },
];

const contrastBank: readonly ChoiceItem[] = [
  ["The hike was exhausting. ___, the view made it worthwhile.", "However", ["For example", "In addition"]],
  ["Rain fell for a week. ___, the river rose above its banks.", "As a result", ["For example", "However"]],
  ["Many animals sleep through winter. ___, bears rest in dens for months.", "For example", ["However", "As a result"]],
  ["The bike is light. ___, it is cheap.", "In addition", ["However", "For example"]],
  ["The plan sounded simple. ___, it took months to finish.", "However", ["In addition", "For example"]],
  ["The bakery lost power. ___, it closed for the day.", "As a result", ["For example", "In addition"]],
  ["Some metals are soft. ___, gold can be bent by hand.", "For example", ["As a result", "However"]],
  ["The app saves time. ___, it reduces mistakes.", "In addition", ["However", "As a result"]],
  ["Few people came on Monday. ___, the show was a hit by Friday.", "However", ["For example", "As a result"]],
  ["The road was blocked. ___, the bus arrived an hour late.", "As a result", ["In addition", "For example"]],
];

const sequenceBank: readonly ChoiceItem[] = [
  ["___, turn off the machine. Then unplug it.", "First", ["Finally", "Meanwhile"]],
  ["Wash the rice. ___, put it in the pot.", "Next", ["First", "Earlier"]],
  ["We searched all day. ___, we found the key at sunset.", "Finally", ["First", "Next"]],
  ["Mom cooked dinner. ___, Dad set the table in the other room.", "Meanwhile", ["Finally", "First"]],
  ["Dry the wood well. ___, sand it, and paint it last.", "Then", ["Earlier", "First"]],
  ["The rain stopped at noon. ___, the sun came out.", "Soon after", ["Earlier", "First"]],
  ["He reached the top at last. ___ that morning, he had nearly given up.", "Earlier", ["Next", "Finally"]],
  ["___, read the question. Then write your answer.", "First", ["Finally", "Meanwhile"]],
  ["Add the eggs, then the milk. ___, stir until smooth.", "Finally", ["First", "Earlier"]],
  ["The team warmed up on the field. ___, the fans filled the seats.", "Meanwhile", ["First", "Finally"]],
];

const offTopic = (paragraph: readonly string[], odd: number): ChoiceItem => [
  paragraph.join(" "),
  paragraph[odd]!,
  paragraph.filter((_, i) => i !== odd && i !== 0),
];

const obviousBank: readonly ChoiceItem[] = [
  offTopic(
    [
      "Dolphins are very social animals.",
      "They live in groups called pods.",
      "My cousin has a pet turtle.",
      "They call to one another with clicks and whistles.",
    ],
    2,
  ),
  offTopic(
    [
      "Our school fair was a huge success.",
      "Hundreds of families came.",
      "The band sold all of its tickets.",
      "Tomatoes grow best in full sun.",
    ],
    3,
  ),
  offTopic(["Walking is good for your health.", "It strengthens your heart.", "My shoes are blue.", "It also improves your mood."], 2),
  offTopic(
    [
      "The Moon affects the tides.",
      "Its pull raises the level of the sea.",
      "Pizza was invented in Italy.",
      "Most coasts see two high tides a day.",
    ],
    2,
  ),
  offTopic(
    ["Our dog learned tricks quickly.", "He could sit within a week.", "My sister plays the flute.", "Soon he could roll over as well."],
    2,
  ),
  offTopic(
    ["Recycling saves valuable resources.", "Old cans become new ones.", "Paper can be turned into boxes.", "The bus stops at the corner."],
    3,
  ),
  offTopic(
    [
      "Spiders are skilled builders.",
      "They spin webs from silk.",
      "Last year I painted my room.",
      "Each web is strong enough to catch prey.",
    ],
    2,
  ),
  offTopic(["The new gym has much to offer.", "It has a large pool.", "It also has a climbing wall.", "Snow fell in the mountains."], 3),
];

const subtleBank: readonly ChoiceItem[] = [
  offTopic(
    [
      "Solar panels can lower a family's bills.",
      "They turn sunlight into power for the home.",
      "The first solar panels were built long ago.",
      "Extra power can even be sold back.",
    ],
    2,
  ),
  offTopic(
    [
      "Our class trip was badly planned.",
      "The bus came an hour late.",
      "The museum was closed when we arrived.",
      "Museums often have free days.",
    ],
    3,
  ),
  offTopic(
    [
      "Chess helps children think ahead.",
      "Players must imagine several moves.",
      "The pieces are often carved from wood.",
      "They learn to weigh each choice.",
    ],
    2,
  ),
  offTopic(
    [
      "Cats make easy pets for busy people.",
      "They need no daily walks.",
      "Lions are also a kind of cat.",
      "They can stay alone during the workday.",
    ],
    2,
  ),
  offTopic(
    [
      "Long winters are hard on city roads.",
      "Ice cracks the surface.",
      "Plows scrape away the top layer.",
      "Many children enjoy sledding in winter.",
    ],
    3,
  ),
  offTopic(
    [
      "Reading aloud helps young children.",
      "They hear new words.",
      "Their parents read many magazines.",
      "They also learn how stories work.",
    ],
    2,
  ),
  offTopic(
    [
      "Our lake is becoming polluted.",
      "Farm waste washes into the water.",
      "The lake was named after an explorer.",
      "Fish have started to die.",
    ],
    2,
  ),
  offTopic(
    [
      "Hand-written notes help students remember.",
      "Writing slowly forces you to choose what matters.",
      "Pens were once made from feathers.",
      "Students who write by hand recall more later.",
    ],
    2,
  ),
];

/** transitionNot gives the feedback for a wrong transition: what relationship it would name. */
const transitionNot = (says: Readonly<Record<string, readonly [string, string]>>) => (wrong: string) => {
  const said = says[wrong];
  if (!said) throw new Error(`no feedback for the transition ${wrong}`);
  return t(...said);
};

const meaningNot = transitionNot({
  However: [
    "*However* would signal a contrast, but the second sentence does not go against the first.",
    "*however* 表示对比，但第二句并没有和第一句相反。",
  ],
  "As a result": [
    "*As a result* would make the second sentence a consequence of the first, but the first does not cause it.",
    "*as a result* 会让第二句成为第一句的结果，但第一句并没有导致它。",
  ],
  "For example": [
    "*For example* would make the second sentence a case of the first, but it is not an example of it.",
    "*for example* 会让第二句成为第一句的实例，但它并不是一个例子。",
  ],
  "In addition": [
    "*In addition* would add a further point of the same kind, but the second sentence relates to the first in another way.",
    "*in addition* 补充同类的另一点，但第二句与第一句是别的关系。",
  ],
});

const timeNot = transitionNot({
  First: ["*First* marks the first step, but this step comes after another.", "*first* 表示第一步，但这一步在别的步骤之后。"],
  Next: [
    "*Next* only moves on to the following step of a series. Ask whether this sentence is that step, the end, or a look back.",
    "*next* 只表示进入一系列步骤中的下一步。问一问：这句话是下一步、结尾，还是回顾？",
  ],
  Finally: [
    "*Finally* marks the last step or the end, but more comes after this, or it is not the end.",
    "*finally* 表示最后一步或结尾，但这之后还有事，或者这里并不是结尾。",
  ],
  Meanwhile: [
    "*Meanwhile* means at the same time, but these events happen one after another.",
    "*meanwhile* 表示同时，但这些事是先后发生的。",
  ],
  Earlier: ["*Earlier* looks back to before, but this event comes later.", "*earlier* 回顾之前的事，但这件事发生在后面。"],
});

/** paragraphTopics are the topics of how sentences work together in a paragraph. */
export const paragraphTopics: readonly TopicDef[] = [
  {
    id: "identifying-topic-sentences",
    title: t("Identifying Topic Sentences", "识别主题句"),
    summary: t("The topic sentence states what the rest of the paragraph supports.", "主题句说明段落其余部分所支持的内容。"),
    prerequisites: ["combining-with-conjunctions"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      point(
        "finding-the-topic-sentence",
        t("Finding It", "找到主题句"),
        t(
          "A **topic sentence** states the main point of a paragraph. The other sentences give details that support it. To find it, ask which sentence the others could all serve as examples or reasons for.\n\nDetails are narrow; the topic sentence is broad enough to cover them all.",
          "**主题句**（topic sentence）说明段落的要点。其他句子给出支持它的细节。寻找时问一问：其他句子都可以作为哪一句的例子或理由？\n\n细节范围窄；主题句范围宽，足以涵盖全部细节。",
        ),
        choiceGenerator(
          t("These sentences form a paragraph. Which is the topic sentence?", "这些句子构成一个段落。哪一句是主题句？"),
          findTopicBank,
          (right) => t(`**${right}** The other sentences are details that support it.`, `**${right}** 其他句子都是支持它的细节。`),
          (wrong) =>
            t(
              `*${wrong}* is a detail: it could serve as an example for another sentence, but the others are not examples of it.`,
              `*${wrong}* 是一个细节：它可以作为另一句的例子，但其他句子不是它的例子。`,
            ),
        ),
      ),
      point(
        "choosing-a-topic-sentence",
        t("Choosing One for the Details", "为细节选择主题句"),
        t(
          "A good topic sentence covers all the details, and no more. One that merely repeats a detail is too narrow. One that mentions the subject without making a point about it is off target, even if it is true.",
          "好的主题句涵盖全部细节，不多也不少。只重复一个细节就太窄了。提到了主题却没有表明观点，即使内容属实也偏离了目标。",
        ),
        choiceGenerator(
          t("Which sentence would best open a paragraph with these details?", "哪个句子最适合作为包含这些细节的段落的开头？"),
          chooseTopicBank,
          (right) =>
            t(`**${right}** It covers every detail and makes a point about them.`, `**${right}** 它涵盖了所有细节，并表明了观点。`),
          (wrong, _right, shown) =>
            shown.includes(wrong)
              ? t(
                  `*${wrong}* only repeats one detail, so it is too narrow to cover the others.`,
                  `*${wrong}* 只是重复了一个细节，范围太窄，涵盖不了其他细节。`,
                )
              : t(
                  `*${wrong}* mentions the subject but makes no point that these details support.`,
                  `*${wrong}* 提到了主题，却没有表明这些细节所支持的观点。`,
                ),
        ),
      ),
    ],
  },
  {
    id: "ordering-sentences-in-a-paragraph",
    title: t("Ordering Sentences in a Paragraph", "排列段落中的句子"),
    summary: t("Use time words and references to put sentences in order.", "利用时间词和指代关系排列句子。"),
    prerequisites: ["identifying-topic-sentences"],
    encompasses: [{ topic: "identifying-topic-sentences", weight: 0.3 }],
    xp: 12,
    knowledgePoints: [
      point(
        "ordering-by-time",
        t("Ordering by Time", "按时间排序"),
        t(
          "Stories and instructions run in the order things happen. Look for words such as *first, then, next, after, by noon* and *finally*. Each one tells you where its sentence belongs.",
          "故事和操作说明按事情发生的顺序展开。留意 *first, then, next, after, by noon, finally* 这样的词，它们告诉你句子的位置。",
        ),
        orderGenerator(t("Put the sentences in the right order.", "把句子排成正确的顺序。"), timeOrderBank, (right) =>
          t(`The order is: ${right}`, `正确的顺序是：${right}`),
        ),
      ),
      point(
        "ordering-by-logic",
        t("Ordering by Logic", "按逻辑排序"),
        t(
          "Other paragraphs start with the topic sentence and build from there. Look for what each sentence refers back to: *they* and *this* point to something already mentioned, and *however* needs an earlier idea to contrast with. A sentence cannot come before what it refers to.",
          "另一些段落以主题句开始，再逐步展开。留意每个句子指向什么：*they* 和 *this* 指向已提到的内容，*however* 需要前面有可对比的意思。句子不能出现在它所指代的内容之前。",
        ),
        orderGenerator(t("Put the sentences in the right order.", "把句子排成正确的顺序。"), logicOrderBank, (right) =>
          t(`The order is: ${right}`, `正确的顺序是：${right}`),
        ),
      ),
    ],
  },
  {
    id: "choosing-transitions",
    title: t("Choosing Transitions", "选择过渡词"),
    summary: t("Transitions tell the reader how one sentence relates to the next.", "过渡词告诉读者前后句的关系。"),
    prerequisites: ["ordering-sentences-in-a-paragraph"],
    encompasses: [{ topic: "ordering-sentences-in-a-paragraph", weight: 0.2 }],
    xp: 10,
    knowledgePoints: [
      point(
        "transitions-of-meaning",
        t("Contrast, Result, Example and Addition", "对比、结果、举例和递进"),
        t(
          "A transition names the relationship between two sentences. *However* signals a contrast. *As a result* signals a consequence. *For example* introduces a case of what was just said. *In addition* adds a further point of the same kind.\n\nRead both sentences, decide how they relate, and only then choose.",
          "过渡词说明两个句子的关系。*however* 表示对比。*as a result* 表示结果。*for example* 引出刚才所说内容的实例。*in addition* 补充同类的另一点。\n\n先读两个句子，判断关系，再作选择。",
        ),
        choiceGenerator(
          t("Which transition fits?", "哪个过渡词合适？"),
          contrastBank,
          (right, shown) =>
            t(
              `${shown.replace("___", `**${right}**`)} This word names how the two sentences relate.`,
              `${shown.replace("___", `**${right}**`)} 这个词说明了两个句子的关系。`,
            ),
          meaningNot,
        ),
      ),
      point(
        "transitions-of-time",
        t("Time and Sequence", "时间和顺序"),
        t(
          "*First, next, then* and *finally* mark steps in a sequence. *Meanwhile* means at the same time. *Earlier* looks back to before, and *soon after* looks ahead a little.",
          "*first, next, then, finally* 表示步骤的先后。*meanwhile* 表示同时。*earlier* 回顾之前，*soon after* 表示稍后。",
        ),
        choiceGenerator(
          t("Which transition fits?", "哪个过渡词合适？"),
          sequenceBank,
          (right, shown) =>
            t(
              `${shown.replace("___", `**${right}**`)} This word places the event in time.`,
              `${shown.replace("___", `**${right}**`)} 这个词确定了事件的时间位置。`,
            ),
          timeNot,
        ),
      ),
    ],
  },
  {
    id: "removing-off-topic-sentences",
    title: t("Removing Off-Topic Sentences", "删除离题句"),
    summary: t("Every sentence of a paragraph must support its main point.", "段落中的每个句子都要支持它的要点。"),
    prerequisites: ["identifying-topic-sentences"],
    encompasses: [{ topic: "identifying-topic-sentences", weight: 0.4 }],
    xp: 10,
    knowledgePoints: [
      point(
        "plainly-off-topic",
        t("Plainly Off Topic", "明显离题"),
        t(
          "Read the topic sentence first, then check each of the others against it. A sentence on another subject breaks the paragraph, however interesting it may be, and it should go.",
          "先读主题句，再逐句对照。谈论其他话题的句子会破坏段落，无论它多有趣，都应该删去。",
        ),
        choiceGenerator(
          t(
            "The first sentence is the topic sentence. Which other sentence does not belong?",
            "第一句是主题句。其他句子中哪一句不属于这个段落？",
          ),
          obviousBank,
          (right) => t(`**${right}** It does not support the main point.`, `**${right}** 它不支持段落的要点。`),
          (wrong) => t(`*${wrong}* supports the topic sentence, so it belongs.`, `*${wrong}* 支持主题句，所以它属于这个段落。`),
        ),
      ),
      point(
        "on-the-subject-but-off-the-point",
        t("On the Subject but Off the Point", "话题相关却偏离要点"),
        t(
          "Some sentences mention the same subject and still do not belong. In a paragraph about how solar panels lower bills, a sentence about when they were invented is about solar panels, but it does not support the point. Test each sentence against the point, not just the subject.",
          "有些句子话题相同，却仍然不该出现。在一段讲太阳能板如何降低电费的文字中，说明它何时发明的句子虽然也谈太阳能板，却不支持要点。要用要点而不只是话题来检验每个句子。",
        ),
        choiceGenerator(
          t(
            "The first sentence is the topic sentence. Which other sentence does not belong?",
            "第一句是主题句。其他句子中哪一句不属于这个段落？",
          ),
          subtleBank,
          (right) =>
            t(`**${right}** It mentions the subject but does not support the point.`, `**${right}** 它提到了这个话题，却不支持要点。`),
          (wrong) =>
            t(
              `*${wrong}* supports the point of the topic sentence, not just its subject, so it belongs.`,
              `*${wrong}* 支持的是主题句的要点，而不只是话题，所以它属于这个段落。`,
            ),
        ),
      ),
    ],
  },
];
