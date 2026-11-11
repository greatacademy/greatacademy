// Grade 5: grammar, usage and spelling of the last five units: shifts of tense, -ant and -ent, hyphens, commas with
// yes, no, tags and names, paragraphs of dialogue, interjections, however and therefore, prepositions and adverbs,
// titles, pronoun person and more confused words.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, typed } from "@ga/subject-english";
import { choose, field, type Label, label, type Pair, rows, topic, type } from "./kit.ts";

const items = (lines: string, shown?: string): ChoiceItem[] =>
  rows(lines).map(
    (r): ChoiceItem => [shown ?? field(r, 0), field(r, shown ? 0 : 1), shown ? [field(r, 1), field(r, 2)] : [field(r, 2), field(r, 3)]],
  );

// When to shift tense.
const shiftLabels: Record<string, Label> = {
  "a needed shift": {
    zh: "必要的时态变化",
    why: [
      "The time really changes: the writer tells what is still true now or what happened earlier.",
      "时间确实变了：作者讲的是至今仍然成立的事，或更早发生的事。",
    ],
    not: ["The tense does change, and the change matches no change of time.", "时态确实变了，但没有对应时间的变化。"],
  },
  "a wrong shift": {
    zh: "错误的时态变化",
    why: [
      "The events happen at one time, but the tense slides from past to present or back.",
      "事件发生在同一时间，时态却在过去和现在之间来回变。",
    ],
    not: [
      "The change of tense matches a real change of time, or there is no change.",
      "时态的变化对应了真实的时间变化，或者根本没有变化。",
    ],
  },
  "no shift": {
    zh: "没有时态变化",
    why: ["Every verb stays in one tense, because everything happens at one time.", "所有动词都保持同一时态，因为所有事情发生在同一时间。"],
    not: ["The tense of the verbs does change in this sentence.", "这个句子里动词的时态确实变了。"],
  },
};
const shiftLines = `
  The Inca built roads that still cross the Andes.|a needed shift
  The Maya studied the stars, and their calendars are still accurate today.|a needed shift
  The farmers planted maize where the forest had stood.|a needed shift
  The Aztec built Tenochtitlan on an island that is now part of Mexico City.|a needed shift
  Before the Spanish arrived, the Inca had built a huge empire.|a needed shift
  The guide told us that Machu Picchu sits high in the mountains.|a needed shift
  The Maya left cities that we can visit today.|a needed shift
  Scientists know that the Maya had used zero long before Europeans did.|a needed shift
  The traders crossed the lake on causeways that had taken years to build.|a needed shift
  Our teacher explained that llamas still carry loads in the Andes.|a needed shift
  The Inca ran messages along the road and they pass them to the next runner.|a wrong shift
  The Maya climbed the temple and look at the stars.|a wrong shift
  The Aztec built floating gardens and grow corn on them.|a wrong shift
  The explorers reached the city and find it empty.|a wrong shift
  The farmer cut steps into the hill and plants potatoes on them.|a wrong shift
  The priests watched the sun and mark the longest day.|a wrong shift
  The traders paddle across the lake and sold cacao at the market.|a wrong shift
  The king called his people and tells them to build a wall.|a wrong shift
  The runners carried knotted strings and they read them at the next stop.|a wrong shift
  The city grew quickly, and then it is abandoned.|a wrong shift
  The Inca built a road and paved it with stone.|no shift
  The Maya watched the sky and recorded the moon's changes.|no shift
  The Aztec built gardens on the lake and grew corn on them.|no shift
  The explorers reached the city and found it empty.|no shift
  The runners carried messages and passed them to the next runner.|no shift
  The guide leads us up the hill and shows us the old walls.|no shift
  The farmers plant maize, beans and squash together.|no shift
  The priests watched the sun and marked the longest day.|no shift
  The traders crossed the lake and sold cacao at the market.|no shift
  The king called his people and told them to build a wall.|no shift
`;
const fixShift = items(
  `
  The Inca ran messages along the road and passed them to the next runner.|The Inca ran messages along the road and pass them to the next runner.|The Inca run messages along the road and passed them to the next runner.
  The Maya climbed the temple and looked at the stars.|The Maya climbed the temple and look at the stars.|The Maya climb the temple and looked at the stars.
  The Aztec built floating gardens and grew corn on them.|The Aztec built floating gardens and grow corn on them.|The Aztec build floating gardens and grew corn on them.
  The explorers reached the city and found it empty.|The explorers reached the city and find it empty.|The explorers reach the city and found it empty.
  The farmer cut steps into the hill and planted potatoes on them.|The farmer cut steps into the hill and plants potatoes on them.|The farmer cuts steps into the hill and planted potatoes on them.
  The priests watched the sun and marked the longest day.|The priests watched the sun and mark the longest day.|The priests watch the sun and marked the longest day.
  The traders paddled across the lake and sold cacao at the market.|The traders paddle across the lake and sold cacao at the market.|The traders paddled across the lake and sell cacao at the market.
  The king called his people and told them to build a wall.|The king called his people and tells them to build a wall.|The king calls his people and told them to build a wall.
  The city grew quickly, and then it was abandoned.|The city grew quickly, and then it is abandoned.|The city grows quickly, and then it was abandoned.
  The Inca built roads that still cross the Andes.|The Inca built roads that still crossed the Andes.|The Inca build roads that still crossed the Andes.
  The Maya left cities that we can still visit today.|The Maya left cities that we could still visit today.|The Maya leave cities that we could still visit today.
  Our guide said that llamas still carry loads in the Andes.|Our guide said that llamas still carried loads in the Andes.|Our guide says that llamas still carried loads in the Andes.
  The farmers planted maize where the forest had stood.|The farmers planted maize where the forest stands.|The farmers plant maize where the forest had stood.
  Before the Spanish came, the Inca had built a great empire.|Before the Spanish came, the Inca build a great empire.|Before the Spanish come, the Inca had built a great empire.
  The people climbed to the plaza and danced all night.|The people climbed to the plaza and dance all night.|The people climb to the plaza and danced all night.
  The scribe painted the codex and folded it carefully.|The scribe painted the codex and folds it carefully.|The scribe paints the codex and folded it carefully.
  The traders rested, and then they walked on.|The traders rested, and then they walk on.|The traders rest, and then they walked on.
  The children carried water and poured it on the fields.|The children carried water and pour it on the fields.|The children carry water and poured it on the fields.
  The storm hit the coast and destroyed the huts.|The storm hit the coast and destroys the huts.|The storm hits the coast and destroyed the huts.
  The workers carved the stones and lifted them into place.|The workers carved the stones and lift them into place.|The workers carve the stones and lifted them into place.
  The soldiers marched along the causeway and entered the city.|The soldiers marched along the causeway and enter the city.|The soldiers march along the causeway and entered the city.
  The Maya counted the days and named each one.|The Maya counted the days and name each one.|The Maya count the days and named each one.
  The Aztec traded at the market, where they used cacao as money.|The Aztec traded at the market, where they use cacao as money.|The Aztec trade at the market, where they used cacao as money.
  The guide opened the gate and led us inside.|The guide opened the gate and leads us inside.|The guide opens the gate and led us inside.
  The rain fell for days, and the river flooded the valley.|The rain fell for days, and the river floods the valley.|The rain falls for days, and the river flooded the valley.
  The city was empty when the explorers arrived.|The city was empty when the explorers arrive.|The city is empty when the explorers arrived.
  The farmers dug canals and filled them with water.|The farmers dug canals and fill them with water.|The farmers dig canals and filled them with water.
  The queen watched the games and cheered for the winners.|The queen watched the games and cheers for the winners.|The queen watches the games and cheered for the winners.
  The climbers reached the top and saw the clouds below them.|The climbers reached the top and see the clouds below them.|The climbers reach the top and saw the clouds below them.
  The archaeologists dug carefully and found a jade mask.|The archaeologists dug carefully and find a jade mask.|The archaeologists dig carefully and found a jade mask.
`,
  "Check the verbs of the three versions.",
);

const whenToShift = topic("grammar", {
  id: "when-to-shift-tense",
  title: ["When to Shift Tense", "何时改变时态"],
  summary: [
    "Tense stays the same unless the time changes: a writer shifts to tell what is still true or what happened earlier.",
    "时间不变，时态就不变：作者改变时态，是为了讲述至今仍成立的事或更早发生的事。",
  ],
  after: ["verb-tense-consistency", "perfect-verb-tenses"],
  points: [
    label(
      "needed-or-wrong-shift",
      ["A Needed Shift or a Wrong One", "必要的还是错误的时态变化"],
      [
        "Verbs stay in one tense while the events happen at one time: *The Maya watched the sky and recorded the moon*. A writer **shifts** tense only when the time changes: to tell what is **still true** (*The Inca built roads that still **cross** the Andes*) or what happened **earlier** (*where the forest **had stood***). A shift with no change of time is a mistake.",
        "事件发生在同一时间时，动词保持同一时态：*The Maya watched the sky and recorded the moon*。只有时间变化时才**改变**时态：讲述**至今仍成立**的事（*The Inca built roads that still **cross** the Andes*），或**更早**发生的事（*where the forest **had stood***）。时间没变却改变时态就是错误。",
      ],
      ["Does this sentence shift tense, and is the shift needed?", "这个句子改变时态了吗？这种变化是必要的吗？"],
      shiftLines,
      shiftLabels,
    ),
    choose(
      "fixing-a-wrong-shift",
      ["Fixing a Wrong Shift", "改正错误的时态变化"],
      [
        "To fix a wrong shift, find the time of the main events and put every verb of those events in that tense. Keep a shift that is needed: a fact that is still true stays in the present, and an earlier action stays in the past perfect. Changing a needed shift is a mistake too.",
        "改正错误的时态变化时，先找出主要事件发生的时间，把这些事件的动词都改成那个时态。保留必要的变化：至今仍成立的事实保持现在时，更早的动作保持过去完成时。把必要的变化改掉同样是错误。",
      ],
      ["Which version keeps the tenses right?", "哪个版本的时态正确？"],
      fixShift,
      (right) => [
        `**${right}** keeps the events at one time in one tense and shifts only where the time really changes.`,
        `**${right}** 让同一时间的事件保持同一时态，只在时间确实变化时才改变时态。`,
      ],
      [
        ["*{wrong}* shifts tense, or keeps a shift, where the time does not change.", "*{wrong}* 在时间没有变化的地方改变了时态。"],
        ["*{wrong}* changes the wrong verb, so the tenses still do not match the times.", "*{wrong}* 改错了动词，时态仍然与时间不符。"],
      ],
    ),
  ],
});

// -ant and -ent: adjective|noun|wrong spelling|sentence
const antLines = rows(`
  important|importance|importent|Water is ___ for every living thing.
  distant|distance|distent|We could see the ___ mountains.
  elegant|elegance|elegent|The temple had ___ stone columns.
  abundant|abundance|abundent|Fish were ___ in the lake.
  tolerant|tolerance|tolerent|The city was ___ of many beliefs.
  brilliant|brilliance|brillient|A ___ light shone over the plaza.
  fragrant|fragrance|fragrent|The market smelled of ___ flowers.
  ignorant|ignorance|ignorent|Nobody wants to stay ___ of the facts.
  relevant|relevance|relevent|Only ___ facts belong in your report.
  observant|observation|observent|An ___ scribe noticed every eclipse.
  hesitant|hesitation|hesitent|The new boy was ___ to speak.
  dominant|dominance|dominent|The Aztec became the ___ power in the valley.
  reluctant|reluctance|reluctent|The tired runner was ___ to go on.
  radiant|radiance|radient|She gave a ___ smile.
  vacant|vacancy|vacent|The houses stood ___ after the city was abandoned.
  different|difference|differant|Each city had a ___ ruler.
  silent|silence|silant|The ruins were ___ at night.
  patient|patience|patiant|A good scribe had to be ___.
  confident|confidence|confidant|The speaker was ___ that the plan would work.
  absent|absence|absant|Three students were ___ today.
  excellent|excellence|excellant|The farmers grew ___ crops on the terraces.
  innocent|innocence|innocant|The prisoner said that he was ___.
  violent|violence|violant|A ___ storm hit the coast.
  intelligent|intelligence|intelligant|The llama is an ___ animal.
  obedient|obedience|obediant|The ___ dog sat when it was told.
  independent|independence|independant|Each city-state was ___.
  evident|evidence|evidant|It was ___ that the city had been abandoned.
  permanent|permanence|permanant|The stone walls were meant to be ___.
  convenient|convenience|convenant|The market was in a ___ place.
  magnificent|magnificence|magnificant|The palace was ___.
`);
const isAnt = (w: string) => w.endsWith("ant");
const antWhy = (right: string, related: string): Pair =>
  isAnt(right)
    ? [
        `The related word is *${related}*, with an *a*, so the ending is *-ant*: **${right}**.`,
        `相关的词是带 *a* 的 *${related}*，所以词尾是 *-ant*：**${right}**。`,
      ]
    : [
        `The related word is *${related}*, with an *e*, so the ending is *-ent*: **${right}**.`,
        `相关的词是带 *e* 的 *${related}*，所以词尾是 *-ent*：**${right}**。`,
      ];
const relatedOf = (w: string) => antLines.find((r) => r[0] === w)?.[1] ?? "";

const antAndEnt = topic("grammar", {
  id: "spelling-ant-and-ent",
  title: ["Spelling -ant and -ent", "-ant 与 -ent 的拼写"],
  summary: [
    "Endings that sound alike are told apart by related words: -ant goes with -ance and -ation (important, importance), -ent with -ence (different, difference).",
    "读音相近的词尾可以借助相关的词区分：-ant 对应 -ance 和 -ation（important、importance），-ent 对应 -ence（different、difference）。",
  ],
  after: ["spelling-tion-and-sion"],
  points: [
    choose(
      "ending-from-a-related-word",
      ["The Ending from a Related Word", "根据相关的词选词尾"],
      [
        "The endings **-ant** and **-ent** sound the same, so a related word helps. If the noun ends in **-ance**, **-ancy** or **-ation**, the adjective ends in **-ant**: *importance, important*; *hesitation, hesitant*. If the noun ends in **-ence**, the adjective ends in **-ent**: *difference, different*. The vowel stays the same in both words.",
        "词尾 **-ant** 和 **-ent** 读音相同，所以要借助相关的词。名词以 **-ance**、**-ancy** 或 **-ation** 结尾，形容词就以 **-ant** 结尾：*importance, important*；*hesitation, hesitant*。名词以 **-ence** 结尾，形容词就以 **-ent** 结尾：*difference, different*。两个词中的元音保持一致。",
      ],
      ["Which word fits the sentence?", "哪个词适合这个句子？"],
      antLines.map((r): ChoiceItem => [`${field(r, 3)} (Related word: *${field(r, 1)}*.)`, field(r, 0), [field(r, 2), field(r, 1)]]),
      (right) => antWhy(right, relatedOf(right)),
      [
        [
          "*{wrong}* has the wrong vowel in its ending; the related word shows it is **{right}**.",
          "*{wrong}* 词尾的元音错了；相关的词表明应是 **{right}**。",
        ],
        ["*{wrong}* is the noun; the sentence needs the adjective, **{right}**.", "*{wrong}* 是名词；句子需要形容词 **{right}**。"],
      ],
    ),
    type(
      "typing-ant-and-ent-words",
      ["Typing -ant and -ent Words", "拼写 -ant 和 -ent 词"],
      [
        "Before you write a word that ends in *-ant* or *-ent*, think of its noun. *Silence* has an *e*, so you write *silent*; *distance* has an *a*, so you write *distant*. If you cannot think of a related word, check a dictionary, because the sound alone does not tell you.",
        "写以 *-ant* 或 *-ent* 结尾的词之前，先想想它的名词。*silence* 有 *e*，所以写 *silent*；*distance* 有 *a*，所以写 *distant*。如果想不出相关的词，就查词典，因为光靠读音无法判断。",
      ],
      ["Type the missing word, which ends in -ant or -ent.", "输入缺少的词，它以 -ant 或 -ent 结尾。"],
      antLines.map((r) =>
        typed(
          field(r, 3),
          field(r, 0),
          [field(r, 2)],
          undefined,
          t(`A related word is *${field(r, 1)}*.`, `相关的词是 *${field(r, 1)}*。`),
        ),
      ),
      (right) => antWhy(right, relatedOf(right)),
    ),
  ],
});

// Hyphens: phrase before a noun, the same words after a verb.
const hyphenLines = rows(`
  They crossed a well-built bridge.|They crossed a well built bridge.|They crossed a well-built-bridge.|The bridge was well built.|The bridge was well-built.|The bridge-was well built.
  The city has a ten-story tower.|The city has a ten story tower.|The city has a ten-story-tower.|The tower is ten stories tall.|The tower is ten-stories tall.|The tower-is ten stories tall.
  It is a hundred-year-old bridge.|It is a hundred year old bridge.|It is a hundred-year old-bridge.|The bridge is a hundred years old.|The bridge is a hundred-years-old.|The bridge-is a hundred years old.
  She is a well-known engineer.|She is a well known engineer.|She is a well-known-engineer.|The engineer is well known.|The engineer is well-known.|The engineer-is well known.
  We took a two-hour tour.|We took a two hour tour.|We took a two-hour-tour.|The tour lasted two hours.|The tour lasted two-hours.|The tour-lasted two hours.
  It was a long-awaited opening.|It was a long awaited opening.|It was a long-awaited-opening.|The opening was long awaited.|The opening was long-awaited.|The opening-was long awaited.
  The town built a four-lane road.|The town built a four lane road.|The town built a four-lane-road.|The road has four lanes.|The road has four-lanes.|The road-has four lanes.
  Workers poured a fast-drying concrete.|Workers poured a fast drying concrete.|Workers poured a fast-drying-concrete.|The concrete was fast drying.|The concrete was fast-drying-.|The concrete-was fast drying.
  It is a world-famous dome.|It is a world famous dome.|It is a world-famous-dome.|The dome is famous around the world.|The dome is famous-around the world.|The dome-is famous around the world.
  He made a last-minute change.|He made a last minute change.|He made a last-minute-change.|He changed the plan at the last minute.|He changed the plan at the last-minute.|He changed the plan-at the last minute.
  The bridge has a three-kilometer span.|The bridge has a three kilometer span.|The bridge has a three-kilometer-span.|The span is three kilometers long.|The span is three-kilometers long.|The span-is three kilometers long.
  We climbed a steep-sided hill.|We climbed a steep sided hill.|We climbed a steep-sided-hill.|The hill had steep sides.|The hill had steep-sides.|The hill-had steep sides.
  She drew a full-size model.|She drew a full size model.|She drew a full-size-model.|The model was full size.|The model was full-size-.|The model-was full size.
  The tower has a high-speed elevator.|The tower has a high speed elevator.|The tower has a high-speed-elevator.|The elevator moves at high speed.|The elevator moves at high-speed.|The elevator-moves at high speed.
  They chose a low-cost design.|They chose a low cost design.|They chose a low-cost-design.|The design was low in cost.|The design was low-in cost.|The design-was low in cost.
`);
const numberLines = rows(`
  The tower has twenty-one floors.|The tower has twenty one floors.|The tower has twenty-one-floors.
  The bridge took thirty-six months to build.|The bridge took thirty six months to build.|The bridge took thirty-six-months to build.
  There are forty-four cables on each side.|There are forty four cables on each side.|There are forty-four-cables on each side.
  The dome is ninety-two meters across.|The dome is ninety two meters across.|The dome is ninety-two-meters across.
  The engineer was self-confident.|The engineer was self confident.|The engineer was self-con-fident.
  My ex-teacher became an engineer.|My ex teacher became an engineer.|My ex-teach-er became an engineer.
  The robot is self-driving.|The robot is self driving.|The robot is self-driv-ing.
  The workers checked fifty-five bolts.|The workers checked fifty five bolts.|The workers checked fifty-five-bolts.
  The stairs have sixty-eight steps.|The stairs have sixty eight steps.|The stairs have sixty-eight-steps.
  The plan was self-explanatory.|The plan was self explanatory.|The plan was self-ex-planatory.
  Seventy-seven people crossed first.|Seventy seven people crossed first.|Seventy-seven-people crossed first.
  The old mayor, an ex-engineer, cut the ribbon.|The old mayor, an ex engineer, cut the ribbon.|The old mayor, an ex-engin-eer, cut the ribbon.
  The crane lifted eighty-three beams.|The crane lifted eighty three beams.|The crane lifted eighty-three-beams.
  The arch is a self-supporting shape.|The arch is a self supporting shape.|The arch is a self-support-ing shape.
  The tunnel is thirty-one kilometers long.|The tunnel is thirty one kilometers long.|The tunnel is thirty-one-kilometers long.
`);
const hyphenWhere: ChoiceItem[] = [
  ...hyphenLines.map((r): ChoiceItem => ["Choose the sentence with its hyphens right.", field(r, 0), [field(r, 1), field(r, 2)]]),
  ...numberLines.map((r): ChoiceItem => ["Choose the sentence with its hyphens right.", field(r, 0), [field(r, 1), field(r, 2)]]),
];
const beforeOrAfter: ChoiceItem[] = hyphenLines.flatMap((r): ChoiceItem[] => [
  ["The words come before a noun.", field(r, 0), [field(r, 1), field(r, 2)]],
  ["The words come after the verb.", field(r, 3), [field(r, 4), field(r, 5)]],
]);

const hyphens = topic("grammar", {
  id: "hyphens",
  title: ["Hyphens", "连字符"],
  summary: [
    "A hyphen joins words that act as one adjective before a noun (a well-built bridge), compound numbers (twenty-one) and some prefixes (self-, ex-).",
    "连字符用来连接在名词前共同充当一个形容词的几个词（a well-built bridge）、复合数字（twenty-one）和某些前缀（self-、ex-）。",
  ],
  after: ["compound-words"],
  points: [
    choose(
      "where-a-hyphen-goes",
      ["Where a Hyphen Goes", "连字符的位置"],
      [
        "A **hyphen** (-) joins words that work together as one describing word **before a noun**: *a well-built bridge*, *a ten-story tower*, *a two-hour tour*. It also joins the parts of the numbers from *twenty-one* to *ninety-nine*, and it follows the prefixes *self-* and *ex-*: *self-confident*, *ex-teacher*. The noun itself is never joined on.",
        "**连字符**（-）用来连接在**名词前**共同充当一个修饰词的几个词：*a well-built bridge*、*a ten-story tower*、*a two-hour tour*。从 *twenty-one* 到 *ninety-nine* 的数字也用连字符连接，前缀 *self-* 和 *ex-* 后也加连字符：*self-confident*、*ex-teacher*。名词本身不连上去。",
      ],
      ["Which sentence uses hyphens correctly?", "哪个句子的连字符用得正确？"],
      hyphenWhere,
      (right) => [
        `**${right}** joins only the words that act as one, a number from twenty-one to ninety-nine, or *self-* or *ex-* to its word.`,
        `**${right}** 只连接了共同起作用的词、二十一到九十九的数字，或 *self-*、*ex-* 与其后的词。`,
      ],
      [
        ["*{wrong}* leaves out a hyphen that the joined words need.", "*{wrong}* 漏掉了需要的连字符。"],
        [
          "*{wrong}* puts a hyphen where none belongs, such as before the noun or inside a word.",
          "*{wrong}* 在不该加的地方加了连字符，例如名词前或单词中间。",
        ],
      ],
    ),
    choose(
      "before-a-noun-or-after-a-verb",
      ["Before a Noun or After a Verb", "在名词前还是在动词后"],
      [
        "The same words may need a hyphen in one place and not in another. Before a noun they act as one adjective, so they are joined: *a **well-built** bridge*. After a verb such as *is* or *was*, they are usually written apart: *The bridge was **well built***. Numbers that measure also change: *a ten-story tower*, but *ten stories tall*.",
        "同样的词在一个位置需要连字符，在另一个位置可能不需要。在名词前它们共同充当一个形容词，所以要连起来：*a **well-built** bridge*。在 *is*、*was* 等动词后，通常分开写：*The bridge was **well built***。表示度量的数字也会变：*a ten-story tower*，但 *ten stories tall*。",
      ],
      ["Read where the words come, then choose the sentence that is right.", "看这些词所在的位置，再选出正确的句子。"],
      beforeOrAfter,
      (right, shown) =>
        shown.includes("before")
          ? [
              `Before a noun, the words act as one adjective and are joined: **${right}**`,
              `在名词前，这些词共同充当一个形容词，要连起来：**${right}**`,
            ]
          : [`After the verb, the words are written apart: **${right}**`, `在动词后，这些词分开写：**${right}**`],
      [
        ["*{wrong}* treats the words the wrong way for where they stand.", "*{wrong}* 没有按照这些词所在的位置处理。"],
        ["*{wrong}* joins a word with a hyphen that should stand alone.", "*{wrong}* 用连字符连上了一个应该独立的词。"],
      ],
    ),
  ],
});

// Commas with yes, no, tags and names: right|misplaced|other misplaced, then a line to fix.
const tagLines = rows(`
  Yes, I saw him by the window.|Yes I saw, him by the window.|Yes I saw him, by the window.
  No, the door was not locked.|No the door, was not locked.|No the door was, not locked.
  You were there, weren't you?|You were, there weren't you?|You, were there weren't you?
  Look, Inspector, the window is open.|Look Inspector, the window, is open.|Look, Inspector the window, is open.
  The cake was here at noon, wasn't it?|The cake was here, at noon wasn't it?|The cake, was here at noon wasn't it?
  Maya, did you see who took it?|Maya did you, see who took it?|Maya did you see, who took it?
  Yes, Detective, I heard a crash.|Yes Detective, I heard, a crash.|Yes, Detective I heard, a crash.
  No, Sam, I was in the garden.|No Sam, I was, in the garden.|No, Sam I was in, the garden.
  You locked the shed, didn't you?|You locked, the shed didn't you?|You, locked the shed didn't you?
  Tell me, Mrs. Lee, where were you at six?|Tell me Mrs. Lee, where were you, at six?|Tell me, Mrs. Lee where were you, at six?
  It wasn't the dog, was it?|It wasn't, the dog was it?|It, wasn't the dog was it?
  Well, Officer, the trophy was gone.|Well Officer, the trophy, was gone.|Well, Officer the trophy was, gone.
  Yes, the map was torn in half.|Yes the map, was torn in half.|Yes the map was torn, in half.
  Ben, show me your shoes.|Ben show me, your shoes.|Ben show, me your shoes.
  She left early, didn't she?|She left, early didn't she?|She, left early didn't she?
  No, I did not take the key.|No I did, not take the key.|No I did not take, the key.
  Listen, everyone, the culprit is in this room.|Listen everyone, the culprit, is in this room.|Listen, everyone the culprit is, in this room.
  The parrot can talk, can't it?|The parrot can, talk can't it?|The parrot, can talk can't it?
  Yes, Chief, the prints match.|Yes Chief, the prints, match.|Yes, Chief the prints, match.
  Jo, where is the hamster?|Jo where is, the hamster?|Jo where, is the hamster?
  You heard the train, didn't you?|You heard, the train didn't you?|You, heard the train didn't you?
  No, Grandpa, the shed is empty.|No Grandpa, the shed, is empty.|No, Grandpa the shed is, empty.
  Thank you, Miss Park, for your help.|Thank you Miss Park, for your, help.|Thank you, Miss Park for your, help.
  The note was in the book, wasn't it?|The note was, in the book wasn't it?|The note, was in the book wasn't it?
  Yes, I am sure of it.|Yes I am, sure of it.|Yes I am sure, of it.
  Wait, Leo, look at the flour.|Wait Leo, look at, the flour.|Wait, Leo look at, the flour.
  We have met before, haven't we?|We have, met before haven't we?|We, have met before haven't we?
  No, sir, I did not see anyone.|No sir, I did not, see anyone.|No, sir I did not, see anyone.
  Professor, is this your umbrella?|Professor is this, your umbrella?|Professor is, this your umbrella?
  You found the clue, didn't you?|You found, the clue didn't you?|You, found the clue didn't you?
`);
const fixTagLines = rows(`
  "Yes I heard it," said the cook.|"Yes, I heard it," said the cook.|"Yes I, heard it," said the cook.|"Yes I heard it" said, the cook.
  "You saw the thief didn't you?" asked Lin.|"You saw the thief, didn't you?" asked Lin.|"You saw, the thief didn't you?" asked Lin.|"You saw the thief didn't, you?" asked Lin.
  "Look Inspector the glass is broken."|"Look, Inspector, the glass is broken."|"Look Inspector, the glass, is broken."|"Look, Inspector the, glass is broken."
  "No I was at home," said Mr. Diaz.|"No, I was at home," said Mr. Diaz.|"No I was, at home," said Mr. Diaz.|"No I was at home" said, Mr. Diaz.
  "Ana where were you at noon?"|"Ana, where were you at noon?"|"Ana where, were you at noon?"|"Ana where were, you at noon?"
  "It was raining wasn't it?" asked the detective.|"It was raining, wasn't it?" asked the detective.|"It was, raining wasn't it?" asked the detective.|"It, was raining wasn't it?" asked the detective.
  "Yes Officer the window was open."|"Yes, Officer, the window was open."|"Yes Officer, the window, was open."|"Yes, Officer the window, was open."
  "Tom did you lock the gate?"|"Tom, did you lock the gate?"|"Tom did, you lock the gate?"|"Tom did you, lock the gate?"
  "No Detective I never touched it."|"No, Detective, I never touched it."|"No Detective, I never, touched it."|"No, Detective I never, touched it."
  "You left the light on didn't you?"|"You left the light on, didn't you?"|"You left, the light on didn't you?"|"You, left the light on didn't you?"
  "Well Sam the clock had stopped."|"Well, Sam, the clock had stopped."|"Well Sam, the clock, had stopped."|"Well, Sam the clock, had stopped."
  "Yes the dog barked twice."|"Yes, the dog barked twice."|"Yes the dog, barked twice."|"Yes the dog barked, twice."
  "Nina show me the note."|"Nina, show me the note."|"Nina show, me the note."|"Nina show me, the note."
  "He was late wasn't he?"|"He was late, wasn't he?"|"He was, late wasn't he?"|"He, was late wasn't he?"
  "No ma'am the shed was empty."|"No, ma'am, the shed was empty."|"No ma'am, the shed, was empty."|"No, ma'am the shed, was empty."
  "Listen everyone the thief is here."|"Listen, everyone, the thief is here."|"Listen everyone, the thief, is here."|"Listen, everyone the thief, is here."
  "The map was torn wasn't it?"|"The map was torn, wasn't it?"|"The map was, torn wasn't it?"|"The map, was torn wasn't it?"
  "Yes Captain the boat is gone."|"Yes, Captain, the boat is gone."|"Yes Captain, the boat, is gone."|"Yes, Captain the boat, is gone."
  "Kim what did you see?"|"Kim, what did you see?"|"Kim what, did you see?"|"Kim what did, you see?"
  "You heard a scream didn't you?"|"You heard a scream, didn't you?"|"You heard, a scream didn't you?"|"You, heard a scream didn't you?"
  "No sir the trophy was not there."|"No, sir, the trophy was not there."|"No sir, the trophy, was not there."|"No, sir the trophy, was not there."
  "Yes I locked it myself."|"Yes, I locked it myself."|"Yes I, locked it myself."|"Yes I locked, it myself."
  "Ravi come and look at this."|"Ravi, come and look at this."|"Ravi come, and look at this."|"Ravi come and, look at this."
  "She has a key doesn't she?"|"She has a key, doesn't she?"|"She has, a key doesn't she?"|"She, has a key doesn't she?"
  "Wait Inspector there is more."|"Wait, Inspector, there is more."|"Wait Inspector, there, is more."|"Wait, Inspector there, is more."
  "No the parrot was silent all night."|"No, the parrot was silent all night."|"No the parrot, was silent all night."|"No the parrot was, silent all night."
  "Mom have you seen my hamster?"|"Mom, have you seen my hamster?"|"Mom have, you seen my hamster?"|"Mom have you, seen my hamster?"
  "We met at the station didn't we?"|"We met at the station, didn't we?"|"We met, at the station didn't we?"|"We, met at the station didn't we?"
  "Yes Doctor the door was locked."|"Yes, Doctor, the door was locked."|"Yes Doctor, the door, was locked."|"Yes, Doctor the door, was locked."
  "Alex that was a clever guess."|"Alex, that was a clever guess."|"Alex that, was a clever guess."|"Alex that was, a clever guess."
`);

const tagCommas = topic("grammar", {
  id: "commas-before-tag-questions",
  title: ["Commas with Yes, No, Tags and Names", "yes、no、附加疑问和称呼前后的逗号"],
  summary: [
    "A comma sets off yes and no, a tag question (you were there, weren't you?) and the name of the person spoken to.",
    "逗号用来隔开 yes 和 no、附加疑问（you were there, weren't you?）以及被称呼的人名。",
  ],
  after: ["commas-after-introductions"],
  points: [
    choose(
      "where-the-commas-go",
      ["Where the Commas Go", "逗号的位置"],
      [
        "Three things are set off by commas because they stand apart from the rest of the sentence. **Yes** and **no** at the start: *Yes, I saw him*. A **tag question** at the end: *You were there, weren't you?* And the **name of the person spoken to**, wherever it comes: *Look, Inspector, the window is open*. A name in the middle needs a comma on each side.",
        "有三样东西要用逗号隔开，因为它们独立于句子的其余部分：句首的 **yes** 和 **no**：*Yes, I saw him*；句末的**附加疑问**：*You were there, weren't you?*；以及**被称呼的人名**，无论出现在哪里：*Look, Inspector, the window is open*。人名在句子中间时，两边都要加逗号。",
      ],
      ["Which sentence has its commas in the right places?", "哪个句子的逗号位置正确？"],
      tagLines.map((r): ChoiceItem => ["Check each comma of the three versions.", field(r, 0), [field(r, 1), field(r, 2)]]),
      (right) => [
        `**${right}** puts commas only around *yes* or *no*, a tag question or the name of the person spoken to.`,
        `**${right}** 只在 *yes*、*no*、附加疑问或被称呼的人名周围加了逗号。`,
      ],
      [
        ["*{wrong}* puts a comma inside the main part of the sentence, where none belongs.", "*{wrong}* 在句子主干中间加了不该有的逗号。"],
        [
          "*{wrong}* misses a comma that sets something apart and adds one elsewhere.",
          "*{wrong}* 漏掉了起隔开作用的逗号，却在别处加了逗号。",
        ],
      ],
    ),
    point(
      "fixing-a-line-of-dialogue",
      t("Fixing a Line of Dialogue", "改正一句对话"),
      t(
        "Characters in mysteries often answer *yes* or *no*, check a fact with a tag question or call someone by name, so their lines need these commas. Read the words inside the quotation marks on their own, find the *yes*, *no*, tag or name, and set it off. The comma that ends the spoken words still goes inside the closing quotation mark.",
        "推理故事里的人物常常回答 *yes* 或 *no*，用附加疑问核对事实，或称呼某人的名字，所以他们的话需要这些逗号。单独读引号里的话，找出 *yes*、*no*、附加疑问或人名，把它隔开。结束引语的逗号仍放在后引号之内。",
      ),
      choiceGenerator(
        t("This line of dialogue is missing commas. Which version fixes it?", "这句对话缺少逗号。哪个版本改正了？"),
        fixTagLines.map((r): ChoiceItem => [field(r, 0), field(r, 1), [field(r, 2), field(r, 3)]]),
        (right) =>
          t(
            `**${right}** sets off the *yes* or *no*, the tag question or the name with commas, and keeps the rest of the line together.`,
            `**${right}** 用逗号隔开了 *yes*、*no*、附加疑问或人名，句子的其余部分保持完整。`,
          ),
        (wrong) =>
          t(
            `*${wrong}* puts a comma where none belongs and misses one that sets something apart.`,
            `*${wrong}* 在不该加逗号的地方加了逗号，却漏掉了起隔开作用的逗号。`,
          ),
      ),
    ),
  ],
});

// A new paragraph for each speaker: cores of five paragraphs, each with a ^ where a wrong break could fall.
interface Talk {
  readonly people: readonly [string, string, string];
  readonly paragraphs: readonly { readonly who: 0 | 1; readonly text: string }[];
}
const talks: readonly Talk[] = [
  [
    "Mia|Leo|Mr. Ross",
    `
    0|"The trophy was on the shelf at lunch," Mia said.^ She pointed at the empty spot.
    1|"Then who came in after lunch?" Leo asked.^ He opened his notebook.
    0|"Only Mr. Ross, to water the plants."^ She frowned.
    1|"But the plants are dry."^ He touched the soil.
    0|"So he never watered them at all."^ Her eyes went wide.
  `,
  ],
  [
    "Ava|Sam|the baker",
    `
    0|"Look at the flour on the floor," Ava whispered.^ She knelt beside the bench.
    1|"Those are paw prints, not shoes," Sam said.^ He leaned closer.
    0|"Small paws, too."^ She followed them to the door.
    1|"Then it was not the baker who ate the pie."^ He laughed.
    0|"No, it was a very hungry cat."^ She pointed at the window.
  `,
  ],
  [
    "Nora|Ben|the parrot",
    `
    0|"The parrot talks all day," Nora said.^ She stared at the cage.
    1|"Then why was it silent last night?" Ben asked.^ He tapped the bars.
    0|"Someone covered the cage with a cloth."^ She lifted the cloth.
    1|"So nobody heard the thief come in."^ He shook his head.
    0|"Whoever did it knew the bird well."^ She sighed.
  `,
  ],
  [
    "Jin|Priya|the janitor",
    `
    0|"The hamster's cage is open," Jin said.^ He held up the little door.
    1|"The latch is not broken," Priya said.^ She checked it twice.
    0|"So someone opened it by hand."^ He looked around the room.
    1|"Or the hamster pushed it with its nose."^ She smiled.
    0|"Let's ask the janitor what he saw."^ He headed for the door.
  `,
  ],
  [
    "Omar|Lily|the captain",
    `
    0|"The map is torn right through the island," Omar said.^ He laid the pieces down.
    1|"Someone wanted half of it," Lily said.^ She turned a piece over.
    0|"The half with the cave on it."^ He tapped the corner.
    1|"Only the captain knew about the cave."^ She looked up.
    0|"Then we should talk to the captain."^ He rolled up the map.
  `,
  ],
  [
    "Rosa|Theo|the librarian",
    `
    0|"There is a note inside this book," Rosa said.^ She slid it out.
    1|"What does it say?" Theo asked.^ He leaned over her shoulder.
    0|"Meet me at the clock at six."^ She read it twice.
    1|"The book was due back last week."^ He checked the stamp.
    0|"Then the librarian may know who borrowed it."^ She closed the book.
  `,
  ],
  [
    "Kai|Elena|Grandpa",
    `
    0|"The shed is locked from the inside," Kai said.^ He rattled the handle.
    1|"Then how did anyone get out?" Elena asked.^ She walked around the shed.
    0|"Through the small window, maybe."^ He pointed up.
    1|"It is far too small for a person."^ She measured it with her hands.
    0|"But not for Grandpa's cat."^ He grinned.
  `,
  ],
  [
    "Lucy|Marco|the conductor",
    `
    0|"The last train left at nine," Lucy said.^ She showed him the ticket.
    1|"The man said he was on it," Marco said.^ He read the time again.
    0|"But this ticket is for the train at ten."^ She held it to the light.
    1|"So his story does not fit."^ He frowned.
    0|"Let's show it to the conductor."^ She tucked it away.
  `,
  ],
  [
    "Ines|Hugo|the gardener",
    `
    0|"The roses were cut last night," Ines said.^ She lifted a stem.
    1|"The cuts are clean," Hugo said.^ He studied the stem.
    0|"So someone used sharp shears."^ She glanced at the tool shed.
    1|"The gardener keeps the only pair."^ He nodded slowly.
    0|"We had better ask him where they are."^ She started up the path.
  `,
  ],
  [
    "Ella|Raj|the coach",
    `
    0|"Someone moved the coach's whistle," Ella said.^ She searched the bench.
    1|"It was here before the game," Raj said.^ He lifted a towel.
    0|"I heard it blow at half time."^ She thought hard.
    1|"Then it was taken after half time."^ He looked at the field.
    0|"Only the players were here then."^ She counted on her fingers.
  `,
  ],
].map(([people, lines]) => {
  const [a, b, c] = (people ?? "").split("|");
  return {
    people: [a ?? "", b ?? "", c ?? ""] as const,
    paragraphs: rows(lines ?? "").map((r) => ({ who: (field(r, 0) === "1" ? 1 : 0) as 0 | 1, text: field(r, 1) })),
  };
});

const plain = (s: string) => s.replace("^ ", " ");
const layoutItems: ChoiceItem[] = talks.flatMap((talk) =>
  [0, 1, 2].map((start): ChoiceItem => {
    const ps = talk.paragraphs.slice(start, start + 3);
    const [p1, p2, p3] = ps.map((p) => p.text);
    const right = [p1, p2, p3].map((p) => plain(p ?? "")).join("\n\n");
    // Each wrong layout breaks at two places too, one of them inside a speaker's paragraph.
    const inside = (p: string) => p.replace("^ ", "\n\n");
    const wrongA = `${inside(p1 ?? "")} ${plain(p2 ?? "")}\n\n${plain(p3 ?? "")}`;
    const wrongB = `${plain(p1 ?? "")}\n\n${plain(p2 ?? "")} ${inside(p3 ?? "")}`;
    return [`${talk.people[0]} and ${talk.people[1]} take turns speaking.`, right, [wrongA, wrongB]];
  }),
);
const speakerItems: ChoiceItem[] = talks.flatMap((talk) => {
  const text = talk.paragraphs.map((p, i) => `(${i + 1}) ${plain(p.text)}`).join("\n\n");
  return [2, 3, 4].map((n): ChoiceItem => {
    const who = talk.paragraphs[n]?.who ?? 0;
    const right = talk.people[who];
    return [`${text}\n\nWho speaks the words of paragraph ${n + 1}?`, right, [talk.people[who === 0 ? 1 : 0], talk.people[2]]];
  });
});

const paragraphsForSpeakers = topic("grammar", {
  id: "paragraphs-for-each-speaker",
  title: ["A New Paragraph for Each Speaker", "每换一个说话人就另起一段"],
  summary: [
    "In written dialogue each new speaker starts a new paragraph, so the reader knows who is speaking without a tag on every line.",
    "书面对话中，每换一个说话人就另起一段，这样读者不用每句都看引述语也知道是谁在说话。",
  ],
  after: ["punctuating-dialogue"],
  points: [
    choose(
      "where-a-new-paragraph-begins",
      ["Where a New Paragraph Begins", "从哪里另起一段"],
      [
        "In a story, every time a **different character speaks**, a new paragraph begins. What a speaker does just before or after the words stays in that speaker's paragraph: *\"Look at the flour,\" Ava whispered. She knelt beside the bench.* Breaking in the middle of one speaker's turn, or running two speakers together, confuses the reader.",
        '在故事中，每当**换一个人物说话**，就另起一段。说话人在说话前后的动作留在这个说话人的段落里：*"Look at the flour," Ava whispered. She knelt beside the bench.* 在同一个说话人的话中间断开，或把两个说话人的话连在一起，都会让读者困惑。',
      ],
      ["Which layout of this dialogue is right?", "这段对话的哪种分段是正确的？"],
      layoutItems,
      () => [
        "Each speaker's words, with what that speaker does, form one paragraph, and a new paragraph begins when the speaker changes.",
        "每个说话人的话连同他的动作组成一段，换说话人时另起一段。",
      ],
      [
        [
          "This layout breaks one speaker's turn in two and joins two speakers in one paragraph.",
          "这种分段把一个说话人的话断成两段，又把两个说话人的话放在一段。",
        ],
        [
          "This layout joins two speakers in one paragraph and splits another speaker's turn.",
          "这种分段把两个说话人的话放在一段，又把另一个说话人的话拆开了。",
        ],
      ],
    ),
    point(
      "who-speaks-a-line-with-no-tag",
      t("Who Speaks a Line with No Tag", "没有引述语的话是谁说的"),
      t(
        "Once a writer has shown who is talking, the new paragraphs let the tags drop away. When two people talk, the turns alternate: if paragraph 1 is Mia and paragraph 2 is Leo, paragraph 3 is Mia again. Count back to the last paragraph that names its speaker, then count forward by turns.",
        "作者一旦说明了谁在说话，新的段落就能让引述语省去。两个人对话时，轮流交替：如果第 1 段是 Mia，第 2 段是 Leo，那么第 3 段又是 Mia。往回找到最后一个说出说话人的段落，再按轮次往后数。",
      ),
      choiceGenerator(
        t("Read the dialogue and answer the question.", "读这段对话，回答问题。"),
        speakerItems,
        (right) =>
          t(
            `The speakers take turns, one paragraph each, so counting the paragraphs from the last tag shows that **${right}** is speaking.`,
            `说话人轮流说话，每人一段，所以从最后一个引述语往后数段落，就知道是 **${right}** 在说话。`,
          ),
        (wrong, right) =>
          t(
            `Count the paragraphs from the last tag: the turns alternate, and this one belongs to ${right}, not ${wrong}.`,
            `从最后一个引述语往后数段落：说话人轮流交替，这一段是 ${right} 说的，不是 ${wrong}。`,
          ),
      ),
    ),
  ],
});

// Interjections.
const interjectionLines = items(`
  Oh, the fire has gone out.|Oh|fire|gone
  Wow! Look at that waterfall.|Wow|look|waterfall
  Ouch! The rope burned my hand.|Ouch|rope|burned
  Hooray, the rescue boat is here!|Hooray|rescue|boat
  Help! The canoe is sinking.|Help|canoe|sinking
  Well, we could try the other path.|Well|could|other
  Phew, we made it to the shore.|Phew|made|shore
  Hey, there is smoke over the hill.|Hey|smoke|hill
  Oops, I dropped the flint.|Oops|dropped|flint
  Alas, the raft was lost in the storm.|Alas|raft|lost
  Yikes! A snake is under the log.|Yikes|snake|under
  Ah, now I understand the map.|Ah|understand|map
  Ugh, the water tastes of salt.|Ugh|water|tastes
  Shh! The bear is close.|Shh|bear|close
  Oh no! The tent blew away.|Oh no|tent|blew
  Aha! Here are the missing matches.|Aha|missing|matches
  Hmm, which way is north?|Hmm|which|north
  Whoa! The ice is cracking.|Whoa|ice|cracking
  Gosh, I never knew it could be so cold.|Gosh|never|cold
  Yes! We found fresh water.|Yes|found|fresh
  Oh, I forgot the canteen.|Oh|forgot|canteen
  Ow! A thorn caught my leg.|Ow|thorn|caught
  Hurray! The plane has seen our signal.|Hurray|plane|signal
  Well, the storm has passed at last.|Well|storm|passed
  Wow, the stars are bright out here.|Wow|stars|bright
  Ah! A light in the distance!|Ah|light|distance
  Oops! The map fell in the river.|Oops|map|river
  Hey! Over here, we are stuck!|Hey|over|stuck
  Phew! The bridge held our weight.|Phew|bridge|weight
  Ugh! My boots are full of mud.|Ugh|boots|mud
`);
const interjectionPunct = rows(`
  shouted in terror|Help! The canoe is sinking.|Help, the canoe is sinking.|Help the canoe is sinking.
  said quietly|Oh, the fire has gone out.|Oh! The fire has gone out.|Oh the fire has gone out.
  shouted with joy|Hooray! The rescue boat is here.|Hooray, the rescue boat is here.|Hooray the rescue boat is here.
  said calmly|Well, we could try the other path.|Well! We could try the other path.|Well we could try the other path.
  cried out in pain|Ouch! The rope burned my hand.|Ouch, the rope burned my hand.|Ouch the rope burned my hand.
  said with a small sigh|Phew, we made it to the shore.|Phew! We made it to the shore.|Phew we made it to the shore.
  yelled in alarm|Yikes! A snake is under the log.|Yikes, a snake is under the log.|Yikes a snake is under the log.
  said softly|Ah, now I understand the map.|Ah! Now I understand the map.|Ah now I understand the map.
  shouted in fright|Whoa! The ice is cracking.|Whoa, the ice is cracking.|Whoa the ice is cracking.
  said in a mild voice|Hmm, which way is north?|Hmm! Which way is north?|Hmm which way is north?
  cried in delight|Aha! Here are the missing matches.|Aha, here are the missing matches.|Aha here are the missing matches.
  muttered|Oops, I dropped the flint.|Oops! I dropped the flint.|Oops I dropped the flint.
  screamed|Oh no! The tent blew away.|Oh no, the tent blew away.|Oh no the tent blew away.
  said sadly and quietly|Alas, the raft was lost.|Alas! The raft was lost.|Alas the raft was lost.
  whispered sharply|Shh! The bear is close.|Shh, the bear is close.|Shh the bear is close.
  said with mild surprise|Gosh, it is cold out here.|Gosh! It is cold out here.|Gosh it is cold out here.
  shouted with excitement|Yes! We found fresh water.|Yes, we found fresh water.|Yes we found fresh water.
  said in a calm voice|Oh, I forgot the canteen.|Oh! I forgot the canteen.|Oh I forgot the canteen.
  yelped|Ow! A thorn caught my leg.|Ow, a thorn caught my leg.|Ow a thorn caught my leg.
  cheered loudly|Hurray! The plane has seen us.|Hurray, the plane has seen us.|Hurray the plane has seen us.
  said with relief, quietly|Well, the storm has passed.|Well! The storm has passed.|Well the storm has passed.
  said in quiet wonder|Wow, the stars are bright.|Wow! The stars are bright.|Wow the stars are bright.
  gasped loudly|Ah! A light in the distance.|Ah, a light in the distance.|Ah a light in the distance.
  shouted in dismay|Oops! The map fell in the river.|Oops, the map fell in the river.|Oops the map fell in the river.
  yelled for help|Hey! We are stuck over here.|Hey, we are stuck over here.|Hey we are stuck over here.
  breathed out softly|Phew, the bridge held.|Phew! The bridge held.|Phew the bridge held.
  groaned loudly|Ugh! My boots are full of mud.|Ugh, my boots are full of mud.|Ugh my boots are full of mud.
  said with a quiet groan|Ugh, the water tastes of salt.|Ugh! The water tastes of salt.|Ugh the water tastes of salt.
  called out in alarm|Hey! There is smoke over the hill.|Hey, there is smoke over the hill.|Hey there is smoke over the hill.
  said gently|Hey, there is smoke over the hill.|Hey! There is smoke over the hill.|Hey there is smoke over the hill.
`);
const strong = (shown: string) => !/quiet|calm|soft|mild|sigh|mutter|gentl|sad/.test(shown);

const interjections = topic("grammar", {
  id: "interjections",
  title: ["Interjections", "感叹词"],
  summary: [
    "An interjection shows feeling and stands apart from the sentence, with an exclamation mark when strong (Help!) and a comma when mild (Oh, the fire is out).",
    "感叹词表达情感，独立于句子之外：情感强烈时用感叹号（Help!），情感温和时用逗号（Oh, the fire is out）。",
  ],
  after: ["choosing-punctuation-for-effect"],
  points: [
    choose(
      "finding-the-interjection",
      ["Finding the Interjection", "找出感叹词"],
      [
        "An **interjection** is a word or two that shows a feeling, such as surprise, pain, joy or fear: *oh, wow, ouch, hooray, help, phew, oops*. It is not part of the grammar of the sentence: take it away and the sentence still works. *Phew, we made it to the shore* still makes sense as *We made it to the shore*.",
        "**感叹词**是表达惊讶、疼痛、高兴或害怕等情感的一两个词：*oh, wow, ouch, hooray, help, phew, oops*。它不属于句子的语法结构：把它去掉，句子依然成立。*Phew, we made it to the shore* 去掉感叹词后 *We made it to the shore* 仍然通顺。",
      ],
      ["Which word is the interjection?", "哪个词是感叹词？"],
      interjectionLines,
      (right) => [
        `**${right}** shows a feeling and stands apart: take it away and the rest is still a whole sentence.`,
        `**${right}** 表达情感，独立于句子之外：去掉它，剩下的仍是完整的句子。`,
      ],
      [
        [
          "*{wrong}* is a word of the sentence itself; without it the sentence would not work.",
          "*{wrong}* 是句子本身的词，去掉它句子就不成立。",
        ],
        [
          "*{wrong}* belongs to the grammar of the sentence, so it is not an interjection.",
          "*{wrong}* 属于句子的语法结构，所以不是感叹词。",
        ],
      ],
    ),
    choose(
      "punctuating-an-interjection",
      ["Punctuating an Interjection", "感叹词的标点"],
      [
        "A **strong** interjection, shouted or cried out, takes an **exclamation mark**, and the next sentence begins with a capital: *Help! The canoe is sinking.* A **mild** one, said quietly, takes a **comma** and runs on into the sentence: *Oh, the fire has gone out.* An interjection always needs one of the two marks.",
        "**强烈的**感叹词（喊出或叫出的）用**感叹号**，后面的句子以大写字母开头：*Help! The canoe is sinking.* **温和的**感叹词（轻声说的）用**逗号**，接着说下去：*Oh, the fire has gone out.* 感叹词后总要用其中一种标点。",
      ],
      ["The words are said this way. Which punctuation fits?", "这些话是这样说的。哪种标点合适？"],
      interjectionPunct.map((r): ChoiceItem => [`The speaker ${field(r, 0)}.`, field(r, 1), [field(r, 2), field(r, 3)]]),
      (right, shown) =>
        strong(shown)
          ? [
              `The feeling is strong, so the interjection takes an exclamation mark: **${right}**`,
              `情感强烈，所以感叹词后用感叹号：**${right}**`,
            ]
          : [`The feeling is mild, so the interjection takes a comma: **${right}**`, `情感温和，所以感叹词后用逗号：**${right}**`],
      [
        ["*{wrong}* uses the mark for the other strength of feeling.", "*{wrong}* 用了另一种情感强度的标点。"],
        ["*{wrong}* has no mark after the interjection, but it must stand apart.", "*{wrong}* 感叹词后没有标点，但它必须独立出来。"],
      ],
    ),
  ],
});

// However and therefore.
const howeverLabels: Record<string, Label> = {
  correct: {
    zh: "正确",
    why: ["The word starts a new sentence or follows a semicolon, with a comma after it.", "这个词放在新句子开头或分号之后，后面加逗号。"],
    not: ["The sentence has a mistake with the linking word.", "句子中连接词的用法有错误。"],
  },
  "a comma splice": {
    zh: "逗号粘连",
    why: [
      "Two sentences are joined by a comma alone; the linking word cannot join them.",
      "两个句子只用逗号连接；这个连接词不能把它们连起来。",
    ],
    not: ["The two sentences are not joined by a comma alone.", "这两个句子并不是只用逗号连接的。"],
  },
  "a comma missing after it": {
    zh: "其后缺逗号",
    why: [
      "The linking word begins its sentence or follows a semicolon, but no comma follows it.",
      "连接词位于句首或分号之后，但后面没有逗号。",
    ],
    not: ["A comma already follows the linking word.", "连接词后面已经有逗号了。"],
  },
};
const splices: readonly [string, string, string][] = [
  ["The river rose quickly", "however", "the raft stayed afloat"],
  ["We had no matches", "therefore", "we used the flint"],
  ["The storm grew worse", "meanwhile", "the boys built a shelter"],
  ["The path was blocked", "however", "a deer trail led around the rocks"],
  ["Our water ran low", "therefore", "we rationed every sip"],
  ["The canoe had a crack", "however", "we patched it with pine sap"],
  ["The fog was thick", "therefore", "we stayed by the fire"],
  ["Night was falling", "meanwhile", "the rescuers searched the ridge"],
  ["The ice looked solid", "however", "it cracked under the first step"],
  ["The map was wet", "therefore", "we followed the river instead"],
];
const howeverLines = splices
  .flatMap(([a, w, b]) => {
    const cap = w.charAt(0).toUpperCase() + w.slice(1);
    return [`${a}; ${w}, ${b}.|correct`, `${a}, ${w}, ${b}.|a comma splice`, `${a}. ${cap} ${b}.|a comma missing after it`];
  })
  .join("\n");
const fixSplices = [
  ...splices,
  ["The wind died down", "however", "the waves were still high"],
  ["The cave was dark", "therefore", "we lit the lantern"],
  ["The bridge had washed away", "however", "the river was shallow"],
  ["Mia twisted her ankle", "therefore", "Leo carried her pack"],
  ["The sun came out", "meanwhile", "our clothes dried on the rocks"],
  ["We heard a helicopter", "however", "it flew past without seeing us"],
  ["The fire went out", "therefore", "we gathered more kindling"],
  ["The snow kept falling", "meanwhile", "the tent sagged under its weight"],
  ["The trail was steep", "however", "the view from the top was worth it"],
  ["The lake was frozen", "therefore", "we walked across it"],
  ["Our boat drifted all night", "however", "nobody fell overboard"],
  ["The ranger was late", "therefore", "we waited at the hut"],
  ["The wolves howled", "meanwhile", "the children slept by the fire"],
  ["The radio was broken", "however", "the flare still worked"],
  ["We were lost", "therefore", "we stayed in one place"],
  ["The tide was coming in", "meanwhile", "the boys climbed higher"],
  ["The berries looked good", "however", "we did not know if they were safe"],
  ["The sky cleared", "therefore", "we could see the stars to steer by"],
  ["The canoe tipped over", "however", "we all had life jackets"],
  ["Our food was gone", "therefore", "we fished in the stream"],
] as const;
const fixItems: ChoiceItem[] = fixSplices.map(([a, w, b], i): ChoiceItem => {
  const cap = w.charAt(0).toUpperCase() + w.slice(1);
  const right = i % 2 === 0 ? `${a}; ${w}, ${b}.` : `${a}. ${cap}, ${b}.`;
  return [`${a}, ${w}, ${b}.`, right, [`${a}, ${w}, ${b}.`, `${a}, ${w}; ${b}.`]];
});

const howeverAndTherefore = topic("grammar", {
  id: "however-and-therefore",
  title: ["However and Therefore", "however 与 therefore"],
  summary: [
    "Words such as however, therefore and meanwhile do not join two sentences with a comma alone: they start a new sentence or follow a semicolon, with a comma after them.",
    "however、therefore、meanwhile 等词不能只用逗号连接两个句子：它们要放在新句子开头或分号之后，后面加逗号。",
  ],
  after: ["choosing-transitions", "run-ons-and-comma-splices"],
  points: [
    label(
      "correct-or-comma-splice",
      ["A Correct Sentence or a Comma Splice", "正确的句子还是逗号粘连"],
      [
        "*However*, *therefore* and *meanwhile* link the ideas of two sentences, but they are not joining words like *and* or *but*. So two sentences joined by a comma and *however* make a **comma splice**: *The river rose, however, the raft stayed afloat.* Either start a new sentence or use a **semicolon**, and put a comma after the linking word.",
        "*however*、*therefore* 和 *meanwhile* 能连接两个句子的意思，但它们不是 *and*、*but* 那样的连词。所以用逗号加 *however* 连接两个句子会造成**逗号粘连**：*The river rose, however, the raft stayed afloat.* 要么另起一句，要么用**分号**，并在连接词后加逗号。",
      ],
      ["Is this sentence correct, and if not, what is wrong?", "这个句子正确吗？如果不正确，错在哪里？"],
      howeverLines,
      howeverLabels,
    ),
    choose(
      "fixing-the-splice",
      ["Fixing the Splice", "改正逗号粘连"],
      [
        "To fix a comma splice with *however* or *therefore*, change the comma before the word to a **semicolon** or to a **full stop** with a capital, and keep a **comma after** the word: *The river rose; however, the raft stayed afloat.* or *The river rose. However, the raft stayed afloat.* Both ways are right.",
        "改正带 *however* 或 *therefore* 的逗号粘连时，把这个词前面的逗号改成**分号**，或改成**句号**并大写，词**后面保留逗号**：*The river rose; however, the raft stayed afloat.* 或 *The river rose. However, the raft stayed afloat.* 两种都对。",
      ],
      ["This sentence is a comma splice. Which version fixes it?", "这个句子是逗号粘连。哪个版本改正了？"],
      fixItems,
      (right) => [
        `**${right}** ends the first sentence with a semicolon or a full stop and puts a comma after the linking word.`,
        `**${right}** 用分号或句号结束第一个句子，并在连接词后加了逗号。`,
      ],
      [
        ["*{wrong}* leaves the splice as it was: two sentences joined by a comma alone.", "*{wrong}* 保持原样，仍然只用逗号连接两个句子。"],
        [
          "*{wrong}* puts the semicolon after the linking word, so the first sentence ends in the wrong place.",
          "*{wrong}* 把分号放在了连接词之后，第一个句子在错误的位置结束了。",
        ],
      ],
    ),
  ],
});

// Preposition or adverb.
const posLabels: Record<string, Label> = {
  "a preposition": {
    zh: "介词",
    why: [
      "It has an object, a noun or pronoun after it: the word and its object make a phrase.",
      "它后面有宾语（名词或代词）：这个词和宾语构成一个短语。",
    ],
    not: [
      "A preposition needs an object after it, and this word has none, or what follows is a clause.",
      "介词后面需要宾语，而这个词后面没有，或者后面是一个从句。",
    ],
  },
  "an adverb": {
    zh: "副词",
    why: ["It stands alone with no object and tells where or how the action goes.", "它单独使用，没有宾语，说明动作的方向或方式。"],
    not: [
      "An adverb stands alone, but this word is followed by its own object or clause.",
      "副词单独使用，但这个词后面跟着自己的宾语或从句。",
    ],
  },
  "a conjunction": {
    zh: "连词",
    why: ["It begins a clause with its own subject and verb.", "它引出一个有自己主语和动词的从句。"],
    not: [
      "A conjunction begins a clause with a subject and a verb, and nothing like that follows it here.",
      "连词引出含主语和动词的从句，这里后面没有这样的从句。",
    ],
  },
};
const posLines = `
  She swam **across** the river.|a preposition
  She swam **across** and waved.|an adverb
  The climbers looked **down** the cliff.|a preposition
  The climbers looked **down** in fear.|an adverb
  We crawled **inside** the cave.|a preposition
  It was cold, so we went **inside**.|an adverb
  The boat drifted **past** the island.|a preposition
  A helicopter flew **past**.|an adverb
  He climbed **up** the mast.|a preposition
  He looked **up** and saw the hawk.|an adverb
  The children waited **outside** the hut.|a preposition
  The dog stayed **outside** all night.|an adverb
  We hiked **along** the ridge.|a preposition
  Come **along**, the boat is leaving.|an adverb
  The raft floated **under** the bridge.|a preposition
  The canoe tipped, and he went **under**.|an adverb
  We rested **before** the climb.|a preposition
  We rested **before** we climbed.|a conjunction
  The storm came **after** sunset.|a preposition
  The storm came **after** the sun had set.|a conjunction
  They waited **until** morning.|a preposition
  They waited **until** the rain stopped.|a conjunction
  No one had crossed the desert **since** spring.|a preposition
  No one had spoken **since** the canoe broke.|a conjunction
  The ranger stood **behind** the tree.|a preposition
  The slow hikers fell **behind**.|an adverb
  She jumped **off** the rock.|a preposition
  The lid fell **off**.|an adverb
  The fox ran **around** the tent.|a preposition
  The lost boy turned **around**.|an adverb
`;
const objectLines = items(`
  She swam **across** the wide river.|river|swam|wide
  The climbers looked **down** the steep cliff.|cliff|climbers|steep
  We crawled **inside** the dark cave.|cave|crawled|dark
  The boat drifted **past** the rocky island.|island|boat|rocky
  He climbed **up** the tall mast.|mast|climbed|tall
  The children waited **outside** the old hut.|hut|children|old
  We hiked **along** the narrow ridge.|ridge|hiked|narrow
  The raft floated **under** the broken bridge.|bridge|raft|broken
  The ranger stood **behind** a pine tree.|tree|ranger|pine
  She jumped **off** the slippery rock.|rock|jumped|slippery
  The fox ran **around** our tent.|tent|fox|ran
  We sheltered **beneath** a huge boulder.|boulder|sheltered|huge
  The eagle circled **above** the frozen lake.|lake|eagle|frozen
  They camped **beside** a cold stream.|stream|camped|cold
  The path led **through** the thick forest.|forest|path|thick
  He waded **into** the icy water.|water|waded|icy
  We rested **near** the old lighthouse.|lighthouse|rested|old
  The lifeboat drifted **toward** the shore.|shore|lifeboat|drifted
  A light shone **across** the dark bay.|bay|light|dark
  The hikers walked **down** the muddy trail.|trail|hikers|muddy
  The bear wandered **into** our camp.|camp|bear|wandered
  Snow fell **on** the silent valley.|valley|snow|silent
  The castaway waited **for** a passing ship.|ship|castaway|passing
  The wind howled **over** the empty plain.|plain|wind|empty
  We slept **under** the bright stars.|stars|slept|bright
  The canoe slid **between** two rocks.|rocks|canoe|slid
  She climbed **onto** the floating log.|log|climbed|floating
  The guide pointed **at** the distant peak.|peak|guide|distant
  Smoke rose **from** the tiny chimney.|chimney|smoke|tiny
  He crawled **out of** the narrow tunnel.|tunnel|crawled|narrow
`);

const prepositionOrAdverb = topic("grammar", {
  id: "preposition-or-adverb",
  title: ["Preposition or Adverb", "介词还是副词"],
  summary: [
    "A word such as up, down, inside or across is a preposition when it has an object (across the river) and an adverb when it stands alone (she swam across).",
    "up、down、inside、across 这样的词有宾语时是介词（across the river），单独使用时是副词（she swam across）。",
  ],
  after: ["prepositional-phrases"],
  points: [
    label(
      "preposition-adverb-or-conjunction",
      ["Preposition, Adverb or Conjunction", "介词、副词还是连词"],
      [
        "Many small words can do more than one job. *Across* is a **preposition** when a noun follows it as its object (*across the river*) and an **adverb** when it stands alone (*She swam across*). *Before*, *after*, *until* and *since* can also be **conjunctions** when a clause with a subject and a verb follows them (*before we climbed*).",
        "许多小词可以有不止一种用法。*across* 后面跟名词作宾语时是**介词**（*across the river*），单独使用时是**副词**（*She swam across*）。*before*、*after*、*until* 和 *since* 后面跟着含主语和动词的从句时，也可以是**连词**（*before we climbed*）。",
      ],
      ["What is the word in bold in this sentence?", "这个句子中加粗的词是什么词性？"],
      posLines,
      posLabels,
    ),
    choose(
      "the-object-of-a-preposition",
      ["The Object of a Preposition", "介词的宾语"],
      [
        "The **object of a preposition** is the noun or pronoun the preposition points to. Ask *across what?*, *under what?*, *into what?*: in *She swam across the wide river*, the answer is *river*. Words such as *the* and *wide* describe the object but are not the object itself.",
        "**介词的宾语**是介词所指向的名词或代词。问一问 *across what?*、*under what?*、*into what?*：在 *She swam across the wide river* 中，答案是 *river*。*the*、*wide* 这样的词修饰宾语，但不是宾语本身。",
      ],
      ["What is the object of the preposition in bold?", "加粗介词的宾语是什么？"],
      objectLines,
      (right) => [
        `Ask what the preposition points to: **${right}** is the noun that answers, so it is the object.`,
        `问一问介词指向什么：回答这个问题的名词是 **${right}**，所以它是宾语。`,
      ],
      [
        [
          "*{wrong}* is the subject or the verb of the sentence, not what the preposition points to.",
          "*{wrong}* 是句子的主语或动词，不是介词所指向的对象。",
        ],
        ["*{wrong}* describes the object, or is the verb, but is not the object itself.", "*{wrong}* 修饰宾语或是动词，但不是宾语本身。"],
      ],
    ),
  ],
});

// Titles in italics and quotation marks: kind|title|whole or part
const titleRows = rows(`
  a book|Letters from the Canal|whole
  a newspaper|The Valley Herald|whole
  a film|The Lighthouse Keeper|whole
  a magazine|Young Historian|whole
  a television series|Life Long Ago|whole
  an album of songs|Songs of the Road|whole
  a play|The Gold Rush|whole
  a long poem printed as a book|The Voyage West|whole
  a book of letters|Dear Mama|whole
  a diary printed as a book|A Year on the Prairie|whole
  a poem|The Old Lantern|part
  a chapter of a book|The First Winter|part
  an article in a newspaper|Flood Waters Rise|part
  a song on an album|Homeward Bound|part
  an episode of a television series|The Blacksmith's Secret|part
  a short story in a collection|The Peddler's Cart|part
  a poem in a magazine|Rain on the Roof|part
  an article in a magazine|How Telegrams Worked|part
  a chapter of a diary printed as a book|Spring Planting|part
  a letter printed in a book of letters|From the Gold Fields|part
`);
const wholeMore = rows(`
  an encyclopedia|The Children's Encyclopedia|whole
  a website|History for Kids|whole
  a poem in a book|The Blacksmith|part
  a chapter of a novel|Across the Ocean|part
  a radio series|Voices of the Past|whole
  a song|The Telegram Boy|part
  an atlas|The World Long Ago|whole
  an article on a website|Life in a Sod House|part
  a newspaper|The Morning Post|whole
  a poem|Grandmother's Quilt|part
`);
const allTitles = [...titleRows, ...wholeMore];
const wholes = allTitles.filter((r) => r[2] === "whole");
const parts = allTitles.filter((r) => r[2] === "part");
const describe = (r: readonly string[]) => `${field(r, 0)} called ${field(r, 1)}`;
const wholeOrPart: ChoiceItem[] = wholes.flatMap((w, i): ChoiceItem[] => [
  ["Which of these is a whole work?", describe(w), [describe(parts[i] ?? w), describe(parts[(i + 4) % parts.length] ?? w)]],
  ["Which of these is a part of a larger work?", describe(parts[i] ?? w), [describe(w), describe(wholes[(i + 6) % wholes.length] ?? w)]],
]);
const titleMark: ChoiceItem[] = allTitles.map((r): ChoiceItem => {
  const title = field(r, 1);
  const italic = `*${title}*`;
  const quoted = `"${title}"`;
  return field(r, 2) === "whole"
    ? [`Write the title of ${field(r, 0)}: ${title}`, italic, [quoted, title]]
    : [`Write the title of ${field(r, 0)}: ${title}`, quoted, [italic, title]];
});

const kindOf = (shown: string) => {
  const kind = shown.replace("Write the title of ", "").split(":")[0] ?? "";
  return kind.charAt(0).toUpperCase() + kind.slice(1);
};

const titlesInItalics = topic("grammar", {
  id: "titles-in-italics-and-quotation-marks",
  title: ["Titles in Italics and Quotation Marks", "标题用斜体还是引号"],
  summary: [
    "Titles of whole works (books, newspapers, films) are in italics or underlined; titles of parts (poems, chapters, articles, songs) are in quotation marks.",
    "完整作品（书、报纸、电影）的标题用斜体或下划线；作品中某一部分（诗、章节、文章、歌曲）的标题用引号。",
  ],
  after: ["capitalizing-names-and-titles", "quotation-marks-for-quotations"],
  points: [
    point(
      "whole-work-or-part",
      t("A Whole Work or a Part", "完整作品还是其中一部分"),
      t(
        "Before you mark a title, decide what it names. A **whole work** stands on its own: a book, a newspaper, a magazine, a film, a play, an album, a television series. A **part** sits inside one of these: a poem, a chapter, an article, a song, an episode or a short story in a collection.",
        "标记标题之前，先判断它指的是什么。**完整作品**是独立的：书、报纸、杂志、电影、剧本、专辑、电视剧。**一部分**则包含在这些作品之中：诗、章节、文章、歌曲、一集节目或文集中的短篇故事。",
      ),
      choiceGenerator(
        t("Read the question and choose.", "读问题，然后选择。"),
        wholeOrPart,
        (right, shown) =>
          shown.includes("whole")
            ? t(
                `*${right}* stands on its own as a complete work, so it is a whole work.`,
                `*${right}* 是一部独立完整的作品，所以是完整作品。`,
              )
            : t(
                `*${right}* is one piece inside something larger, so it is a part of a work.`,
                `*${right}* 是更大作品中的一部分，所以是作品的一部分。`,
              ),
        (wrong) =>
          wholes.some((w) => describe(w) === wrong)
            ? t(`*${wrong}* stands on its own, so it is a whole work.`, `*${wrong}* 独立成篇，是完整作品。`)
            : t(`*${wrong}* is one piece inside something larger, so it is a part.`, `*${wrong}* 是更大作品中的一部分。`),
      ),
    ),
    choose(
      "marking-a-title",
      ["How a Title Is Marked", "标题的标记方法"],
      [
        'The title of a **whole** work is written in *italics* (or underlined by hand): *Dear Mama*, *The Valley Herald*. The title of a **part** of a work goes in "quotation marks": "The Old Lantern" (a poem), "Flood Waters Rise" (an article). Either way, the important words of a title take capitals.',
        '**完整**作品的标题用*斜体*（手写时加下划线）：*Dear Mama*、*The Valley Herald*。作品中**一部分**的标题用"引号"："The Old Lantern"（一首诗）、"Flood Waters Rise"（一篇文章）。无论哪种，标题中的重要单词都要大写。',
      ],
      ["How should this title be written?", "这个标题应该怎么写？"],
      titleMark,
      (right, shown) =>
        right.startsWith("*")
          ? [`${kindOf(shown)} is a whole work, so its title is in italics: ${right}`, `这是一部完整作品，所以标题用斜体：${right}`]
          : [
              `${kindOf(shown)} is a part of a larger work, so its title is in quotation marks: ${right}`,
              `这是更大作品的一部分，所以标题用引号：${right}`,
            ],
      [
        ["That marking belongs to the other kind of title.", "那种标记属于另一类标题。"],
        [
          "A title needs a mark, italics for a whole work or quotation marks for a part.",
          "标题需要标记：完整作品用斜体，作品的一部分用引号。",
        ],
      ],
    ),
  ],
});

// Shifts in pronoun person.
const shiftPerson = items(`
  When we reached the top, **you** could see the whole valley.|you|we|whole
  We wrote letters every week, and you always waited for an answer.|you|we|letters
  I opened the old trunk, and you could smell the cedar.|you|I|trunk
  When people lived in sod houses, you had to sweep the dirt floor daily.|you|people|floor
  We lit the lantern because you could not see the path.|you|we|path
  If a pupil forgot the slate, you had to share.|you|pupil|share
  Our family walked to church, and you wore your best shoes.|you|family|shoes
  When one writes a diary, you should date each entry.|you|one|entry
  We churned butter on Saturdays, and your arms ached afterward.|your|we|butter
  The settlers built cabins, and you used logs from the forest.|you|settlers|logs
  I sat by the hearth while you listened to the wind.|you|I|wind
  When we got a telegram, you knew it was important.|you|we|telegram
  Travelers on the canal slept on deck, and you woke with the sun.|you|travelers|deck
  We read by candlelight, so you went to bed early.|you|we|bed
  If a miner found gold, you shouted for joy.|you|miner|gold
  I kept a diary, and you wrote in it every night.|you|I|diary
  When students misbehaved, you had to stand in the corner.|you|students|corner
  We walked two miles to school, and you carried your lunch.|you|we|lunch
  One must be careful, because you can slip on the ice.|you|one|ice
  The family saved every scrap, and you never wasted food.|you|family|food
  When we crossed the ocean, you felt seasick for days.|you|we|ocean
  I loved the peddler's cart, because you never knew what he carried.|you|I|cart
  Our class visited the museum, and you could touch the old tools.|you|class|tools
  When people wrote letters, you used a quill and ink.|you|people|quill
  We milked the cows at dawn, and your hands were cold.|your|we|cows
  The keeper climbed the stairs, and you lit the lamp at dusk.|you|keeper|lamp
  If a child was sick, you called the doctor from the next town.|you|child|doctor
  We waited for the mail coach, and you hoped for a letter.|you|we|letter
  I learned to sew, and your stitches had to be tiny.|your|I|stitches
  When the flood came, we climbed to the roof, and you could see nothing but water.|you|we|roof
`).map(([shown, right, wrong]): ChoiceItem => [shown.replace("**you**", "you"), right, wrong]);
const keepPerson = items(`
  When we reached the top, ___ could see the whole valley.|we|you|one
  We wrote every week, and ___ always waited for an answer.|we|you|they
  I opened the trunk, and ___ could smell the cedar.|I|you|one
  When people lived in sod houses, ___ had to sweep the floor daily.|they|you|we
  We lit the lantern because ___ could not see the path.|we|you|one
  If pupils forgot their slates, ___ had to share.|they|you|we
  When one writes a diary, ___ should date each entry.|one|you|they
  We churned butter on Saturdays, and ___ arms ached afterward.|our|your|their
  The settlers built cabins, and ___ used logs from the forest.|they|you|we
  When we got a telegram, ___ knew it was important.|we|you|they
  Travelers on the canal slept on deck and woke when ___ saw the sun.|they|you|we
  We read by candlelight, so ___ went to bed early.|we|you|they
  I kept a diary, and ___ wrote in it every night.|I|you|we
  When students misbehaved, ___ had to stand in the corner.|they|you|we
  We walked to school, and ___ carried our lunch.|we|you|they
  The family saved every scrap and never wasted ___ food.|its|your|our
  When we crossed the ocean, ___ felt seasick for days.|we|you|they
  Our class visited the museum, where ___ could touch the old tools.|we|you|they
  When people wrote letters, ___ used a quill and ink.|they|you|we
  We milked the cows at dawn, and ___ hands were cold.|our|your|their
  If children were sick, ___ stayed home from school.|they|you|we
  We waited for the mail coach and hoped ___ would bring a letter.|it|you|they
  I learned to sew, and ___ stitches had to be tiny.|my|your|our
  When the flood came, we climbed to the roof, and ___ could see only water.|we|you|they
  Miners worked all day, and ___ often found nothing.|they|you|we
  We kept the fire burning so that ___ stayed warm.|we|you|they
  When one travels by canal, ___ moves slowly.|one|you|they
  The pupils wrote on slates because ___ had no paper.|they|you|we
  I mailed the letter, and ___ reached my aunt a month later.|it|you|they
  We planted the garden, and ___ watered it every evening.|we|you|they
`);

const pronounPerson = topic("grammar", {
  id: "shifts-in-pronoun-person",
  title: ["Shifts in Pronoun Person", "代词人称的转换"],
  summary: [
    "A piece keeps one person: it does not slide from we or one to you without a reason.",
    "一篇文字要保持同一人称：不能无故从 we 或 one 转成 you。",
  ],
  after: ["pronoun-antecedent-agreement"],
  points: [
    choose(
      "finding-the-shift",
      ["Finding the Shift", "找出人称转换"],
      [
        "Pronouns have a **person**: the first person speaks (*I, we*), the second is spoken to (*you*), and the third is spoken about (*he, she, it, they, one, people*). A sentence that begins in one person should stay there. *When we reached the top, you could see the valley* slides from *we* to *you*, though the writer still means *we*.",
        "代词有**人称**：第一人称是说话的人（*I, we*），第二人称是听话的人（*you*），第三人称是被谈论的人或物（*he, she, it, they, one, people*）。句子用哪个人称开头，就应保持下去。*When we reached the top, you could see the valley* 从 *we* 滑到了 *you*，而作者指的仍然是 *we*。",
      ],
      ["Which word shifts the person of the sentence?", "哪个词改变了句子的人称？"],
      shiftPerson,
      (right) => [
        `**${right}** slides into the second person, though the sentence is about the person or people named at its start.`,
        `**${right}** 转成了第二人称，而句子讲的是开头提到的人。`,
      ],
      [
        [
          "*{wrong}* sets the person of the sentence; the word that slides away from it is **{right}**.",
          "*{wrong}* 确定了句子的人称；偏离它的是 **{right}**。",
        ],
        [
          "*{wrong}* is not a pronoun of person; look for the pronoun that changes, **{right}**.",
          "*{wrong}* 不是人称代词；要找改变了人称的代词 **{right}**。",
        ],
      ],
    ),
    choose(
      "keeping-the-person-steady",
      ["Keeping the Person Steady", "保持人称一致"],
      [
        "To keep the person steady, look at who the sentence is about at its start and use the pronoun of that person all the way through. After *we*, use *we* or *our*; after *people* or *settlers*, use *they* or *their*; after *one*, use *one*. Use *you* only when you really speak to the reader.",
        "要保持人称一致，看句子开头讲的是谁，从头到尾都用那个人称的代词。前面是 *we*，就用 *we* 或 *our*；前面是 *people* 或 *settlers*，就用 *they* 或 *their*；前面是 *one*，就用 *one*。只有真正对读者说话时才用 *you*。",
      ],
      ["Which pronoun keeps the person steady?", "哪个代词能保持人称一致？"],
      keepPerson,
      (right) => [
        `**${right}** stays in the person the sentence begins with, so the reader knows it means the same people.`,
        `**${right}** 保持了句子开头的人称，读者就知道指的是同一些人。`,
      ],
      [
        ["*{wrong}* slides into the second person without a reason.", "*{wrong}* 无故转成了第二人称。"],
        ["*{wrong}* points to different people from the ones the sentence is about.", "*{wrong}* 指的是与句子所讲的不同的人。"],
      ],
    ),
  ],
});

// More commonly confused words.
const confusedLines = items(`
  ___ letter is this on the table?|Whose|Who's|Who
  ___ coming to the museum with us?|Who's|Whose|Whom
  I asked the peddler ___ cart it was.|whose|who's|whom
  ___ been reading my diary?|Who's|Whose|Who
  Do not ___ the key to the trunk.|lose|loose|lost
  The ___ board creaked under my feet.|loose|lose|loss
  If we ___ the map, we will be lost.|lose|loose|loss
  The horse broke ___ from its rope.|loose|lose|lost
  Please ___ this small gift.|accept|except|expect
  Everyone came ___ my cousin.|except|accept|expect
  Did the school ___ your letter?|accept|except|expect
  All the letters were in ink ___ one.|except|accept|expect
  The library is very ___ in the morning.|quiet|quite|quit
  The trip was ___ long.|quite|quiet|quit
  Be ___ while the baby sleeps.|quiet|quite|quit
  It is not ___ time to leave.|quite|quiet|quit
  Camels can cross the ___.|desert|dessert|deserted
  We had apple pie for ___.|dessert|desert|deserted
  The ___ sun was very hot.|desert|dessert|deserted
  What is for ___ tonight?|dessert|desert|deserted
  The cold weather will ___ the crops.|affect|effect|afflict
  The flood had a terrible ___ on the town.|effect|affect|affection
  How did the news ___ your grandmother?|affect|effect|afflict
  One ___ of the war was a shortage of food.|effect|affect|affection
  ___ house has the red door?|Whose|Who's|Who
  The ___ was gone after the long winter.|dessert|desert|deserts
  The noise did not ___ her sleep.|affect|effect|afflict
  The old envelope came ___ in my hand.|loose|lose|loss
  Everyone was ___ in the reading room.|quiet|quite|quit
  I will ___ your apology.|accept|except|expect
`);
const findWrong = items(`
  Whose going to post the letter?|Whose|post|letter
  I hope we don't loose the old photographs.|loose|hope|photographs
  Everyone accept my brother wrote a letter.|accept|Everyone|wrote
  The house was quite after the guests left.|quite|house|guests
  We ate ice cream for desert.|desert|ate|cream
  The cold winter had a bad affect on the crops.|affect|winter|crops
  Who's diary did you find in the attic?|Who's|diary|attic
  The button on my coat is lose.|lose|button|coat
  I cannot except such a costly gift.|except|cannot|costly
  It was quiet late when the telegram came.|quiet|late|telegram
  The travelers were lost in the dessert.|dessert|travelers|lost
  Did the news effect your plans?|effect|news|plans
  Whose the man at the door?|Whose|man|door
  Don't loose your ticket for the boat.|loose|ticket|boat
  All the children except one accept the invitation.|accept|children|invitation
  The ship was quite and dark that night.|quite|ship|dark
  Grandma made a pie for desert.|desert|made|pie
  The storm will effect the harvest.|effect|storm|harvest
  I know who's hat this is.|who's|know|hat
  If you loose the key, call me.|loose|key|call
  Everything was packed accept the lantern.|accept|packed|lantern
  She was quite as a mouse.|quite|mouse|was
  The camels crossed the dessert slowly.|dessert|camels|slowly
  The long journey began to effect his health.|effect|journey|health
  Whose been eating the bread?|Whose|eating|bread
  The horse got lose in the night.|lose|horse|night
  Please except my thanks.|except|Please|thanks
  The room went quiet still.|quiet|room|still
  We had a fruit desert after dinner.|desert|fruit|dinner
  The war had a great affect on the family.|affect|war|family
`);
const pairNote: Record<string, Pair> = {
  whose: [
    "*whose* asks who owns something; *who's* is short for *who is* or *who has*",
    "*whose* 问某物属于谁；*who's* 是 *who is* 或 *who has* 的缩写",
  ],
  "who's": [
    "*who's* is short for *who is* or *who has*; *whose* asks who owns something",
    "*who's* 是 *who is* 或 *who has* 的缩写；*whose* 问某物属于谁",
  ],
  lose: ["*lose* means to stop having something; *loose* means not tight", "*lose* 意为丢失；*loose* 意为松的"],
  loose: ["*loose* means not tight or not tied; *lose* means to stop having something", "*loose* 意为松的、没系住的；*lose* 意为丢失"],
  accept: ["*accept* means to take or agree to; *except* means leaving out", "*accept* 意为接受；*except* 意为除了"],
  except: ["*except* means leaving out; *accept* means to take or agree to", "*except* 意为除了；*accept* 意为接受"],
  quiet: ["*quiet* means with little noise; *quite* means very or completely", "*quiet* 意为安静的；*quite* 意为相当、完全"],
  quite: ["*quite* means very or completely; *quiet* means with little noise", "*quite* 意为相当、完全；*quiet* 意为安静的"],
  desert: [
    "a *desert* is dry land (one *s*); a *dessert* is a sweet course (two, for something sweet)",
    "*desert* 是沙漠（一个 *s*）；*dessert* 是甜点（两个 *s*）",
  ],
  dessert: ["a *dessert* is a sweet course after a meal; a *desert* is dry land", "*dessert* 是饭后甜点；*desert* 是沙漠"],
  affect: [
    "*affect* is usually the verb, to change something; *effect* is usually the noun, the result",
    "*affect* 通常是动词，意为影响；*effect* 通常是名词，意为结果",
  ],
  effect: ["*effect* is usually the noun, the result; *affect* is usually the verb", "*effect* 通常是名词，意为结果；*affect* 通常是动词"],
};
const noteOf = (w: string): Pair => pairNote[w.toLowerCase()] ?? ["", ""];
const fixedWord: Record<string, string> = {
  whose: "who's",
  "who's": "whose",
  lose: "loose",
  loose: "lose",
  accept: "except",
  except: "accept",
  quiet: "quite",
  quite: "quiet",
  desert: "dessert",
  dessert: "desert",
  affect: "effect",
  effect: "affect",
};

const confusedWords2 = topic("grammar", {
  id: "commonly-confused-words-2",
  title: ["More Commonly Confused Words", "更多易混淆的词"],
  summary: [
    "Whose and who's, lose and loose, accept and except, quiet and quite, desert and dessert, affect and effect.",
    "whose 与 who's、lose 与 loose、accept 与 except、quiet 与 quite、desert 与 dessert、affect 与 effect。",
  ],
  after: ["commonly-confused-words", "contractions"],
  points: [
    choose(
      "choosing-the-word-that-fits",
      ["Choosing the Word That Fits", "选择合适的词"],
      [
        "Some pairs of words look or sound so alike that writers mix them up. *Whose* asks who owns something; *who's* means *who is*. You *lose* a key, but a *loose* board wobbles. You *accept* a gift; everyone came *except* one. A *quiet* room is *quite* peaceful. A *desert* is dry; a *dessert* is sweet. To *affect* is to change; an *effect* is a result.",
        "有些成对的词外形或读音太相似，写的时候容易混淆。*whose* 问某物属于谁；*who's* 意为 *who is*。你会 *lose*（丢失）钥匙，而 *loose*（松动的）木板会晃。你 *accept*（接受）礼物；everyone came *except*（除了）one。*quiet*（安静的）房间 *quite*（相当）宁静。*desert* 是干旱的沙漠；*dessert* 是甜点。*affect* 是影响；*effect* 是结果。",
      ],
      ["Which word fits the gap?", "哪个词适合填空？"],
      confusedLines,
      (right) => {
        const [en, zh] = noteOf(right);
        return [`The sentence needs **${right}**: ${en}.`, `句子需要 **${right}**：${zh}。`];
      },
      [
        [
          "*{wrong}* is the word it is often confused with; this sentence needs **{right}**.",
          "*{wrong}* 是常与之混淆的词；这个句子需要 **{right}**。",
        ],
        [
          "*{wrong}* looks similar but has another meaning or form; the word is **{right}**.",
          "*{wrong}* 外形相似，但意思或形式不同；正确的是 **{right}**。",
        ],
      ],
    ),
    point(
      "finding-and-fixing-the-wrong-word",
      t("Finding and Fixing the Wrong Word", "找出并改正用错的词"),
      t(
        "When you proofread, read slowly and stop at each word of a confused pair. Test it: say *who is* in place of *who's*, think *a result* for *effect*, picture something sweet for *dessert*. If the test fails, the other word of the pair belongs there. Spell checkers miss these mistakes, because both words are real.",
        '校对时要慢慢读，遇到易混淆词就停下来检验：用 *who is* 替换 *who\'s*，用"结果"理解 *effect*，想到甜的东西就是 *dessert*。检验不通过，就该用这对词中的另一个。拼写检查发现不了这类错误，因为两个词都是真实的单词。',
      ),
      choiceGenerator(
        t(
          "One word of this sentence is the wrong one of a confused pair. Which is it?",
          "这个句子中有一个词用错了，是一对易混淆词中错误的那个。是哪个？",
        ),
        findWrong,
        (right) => {
          const fixed = fixedWord[right.toLowerCase()] ?? "";
          const [en, zh] = noteOf(fixed);
          return t(
            `**${right}** is wrong here; the sentence needs *${fixed}*: ${en}.`,
            `这里 **${right}** 用错了，句子需要 *${fixed}*：${zh}。`,
          );
        },
        (wrong, right) =>
          t(`*${wrong}* is used correctly; the confused word is **${right}**.`, `*${wrong}* 用得正确；用错的是 **${right}**。`),
      ),
    ),
  ],
});

/** grammarTopics5b are the topics of grammar, usage and spelling of the last five units of grade 5. */
export const grammarTopics5b: readonly TopicDef[] = [
  whenToShift,
  antAndEnt,
  hyphens,
  tagCommas,
  paragraphsForSpeakers,
  interjections,
  howeverAndTherefore,
  prepositionOrAdverb,
  titlesInItalics,
  pronounPerson,
  confusedWords2,
];
