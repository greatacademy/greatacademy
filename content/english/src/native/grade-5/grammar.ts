// Grade 5: grammar, usage and spelling of the first five units: fewer and less, -able and -ible, Greek spellings,
// because and because of, the future perfect, complete comparisons, capitals of history and indefinite pronouns.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, typed } from "@ga/subject-english";
import { everyPair } from "../../levels/words.ts";
import { choose, field, type Label, label, type Pair, rows, topic, type } from "./kit.ts";

// Fewer or less.
/** moreCount and moreMass are further count and mass nouns for the frames below. */
const moreCount =
  "pencils chairs windows horses birds doors candles shells stones ladders spoons bridges boats tents cars bikes lamps cookies tickets keys shoes plates buttons marbles stamps feathers rocks blankets pillows towels baskets jars hats coats boxes".split(
    " ",
  );
const moreMass =
  "flour sugar butter cheese bread soup juice honey oil gold silver wool cotton advice knowledge music news weather equipment jewelry clothing garbage dust smoke steam snow fog electricity sunshine laughter courage patience glue paint soap".split(
    " ",
  );
const countNouns = [
  ..."droplets puddles glaciers bottles cups coins students rivers clouds waves buckets pipes trees apples books".split(" "),
  ...moreCount,
];
const massNouns = [
  ..."water rain sand rice money homework furniture information air milk salt ice mud traffic luggage".split(" "),
  ...moreMass,
];
const nounItems: ChoiceItem[] = countNouns.flatMap((c, i): ChoiceItem[] => [
  ["Choose the noun you can count one by one.", c, [massNouns[i] ?? "", massNouns[(i + 4) % massNouns.length] ?? ""]],
  ["Choose the noun you cannot count one by one.", massNouns[i] ?? "", [c, countNouns[(i + 7) % countNouns.length] ?? ""]],
]);
const isCount = (noun: string) => countNouns.includes(noun);

/** fewerFrames are frames for count nouns, then the same frames for mass nouns. */
const fewerFrames = [
  ["We have ___ {n} than last week.", "fewer|less|much", "less|fewer|many"],
  ["How ___ {n} do we need?", "many|much|less", "much|many|fewer"],
  ["The ___ of {n} grew each year.", "number|amount|much", "amount|number|many"],
] as const;
const fewerCross = [
  ...moreCount.slice(0, 20).flatMap((n) => fewerFrames.map(([frame, count]) => `${frame.replace("{n}", n)}|${count}|${n}`)),
  ...moreMass.slice(0, 20).flatMap((n) => fewerFrames.map(([frame, , mass]) => `${frame.replace("{n}", n)}|${mass}|${n}`)),
].join("\n");
const fewerLines = rows(`${fewerCross}\n
  This tap uses ___ water than the old one.|less|fewer|many|water
  There are ___ puddles on the road today.|fewer|less|much|puddles
  We saw ___ clouds than yesterday.|fewer|less|much|clouds
  The desert gets ___ rain than the forest.|less|fewer|many|rain
  How ___ glaciers are left in the Alps?|many|much|less|glaciers
  How ___ water does a shower use?|much|many|fewer|water
  A large ___ of students signed up.|number|amount|much|students
  A small ___ of salt is enough.|amount|number|many|salt
  Ten items or ___ at this checkout.|fewer|less|much|items
  The river carries ___ mud in summer.|less|fewer|many|mud
  ___ people swim in the lake now that it is clean.|Many|Much|Less|people
  There is not ___ ice left on the pond.|much|many|fewer|ice
  We need ___ buckets to carry all that sand.|more|much|less|buckets
  The new pipes waste ___ water.|less|fewer|many|water
  ___ wells are dry this year than last year.|Fewer|Less|Much|wells
  There was ___ traffic on Sunday.|less|fewer|many|traffic
  The ___ of rain that fell was measured each day.|amount|number|many|rain
  The ___ of rainy days doubled in May.|number|amount|much|days
  I have ___ homework than my brother.|less|fewer|many|homework
  There are ___ fish in the river since the factory closed.|fewer|less|much|fish
  How ___ money did the new filter cost?|much|many|fewer|money
  How ___ coins are in the jar?|many|much|less|coins
  The town uses ___ electricity at night.|less|fewer|many|electricity
  ___ than half of the students walked to school.|Fewer|Less|Much|students
  Our garden needs ___ sunshine than yours.|less|fewer|many|sunshine
  A huge ___ of rubbish washed up on the beach.|amount|number|many|rubbish
  A huge ___ of bottles washed up on the beach.|number|amount|much|bottles
  There are not ___ trees on the hill.|many|much|less|trees
  Drink ___ juice and more water.|less|fewer|many|juice
  Eat ___ sweets and more fruit.|fewer|less|much|sweets
`);
const fewerNoun = (shown: string) => fewerLines.find((r) => r[0] === shown)?.[4] ?? "";
const countWords = ["fewer", "many", "number", "more"];
const forCount = (w: string) => countWords.includes(w.toLowerCase());

const fewerOrLess = topic("grammar", {
  id: "fewer-or-less",
  title: ["Fewer or Less", "fewer 还是 less"],
  summary: [
    "Fewer, many and number go with things you can count; less, much and amount go with things you cannot.",
    "fewer、many 和 number 用于可数的东西；less、much 和 amount 用于不可数的东西。",
  ],
  after: ["plural-nouns"],
  points: [
    point(
      "count-or-mass-noun",
      t("Count Nouns and Mass Nouns", "可数名词与不可数名词"),
      t(
        "A **count noun** names things you can count one by one, so it has a plural: *one droplet, three droplets*. A **mass noun** names a substance or an amount that you cannot count one by one: *water, sand, information*. You say *some water* or *three glasses of water*, never *three waters* when you mean the substance.",
        "**可数名词**表示能一个一个数的东西，所以有复数：*one droplet, three droplets*。**不可数名词**表示不能一个一个数的物质或数量：*water, sand, information*。表示物质时说 *some water* 或 *three glasses of water*，不说 *three waters*。",
      ),
      choiceGenerator(
        t("Read the instruction and choose the noun.", "读要求，选出名词。"),
        nounItems,
        (right) =>
          isCount(right)
            ? t(`*${right}* can be counted (one, two, three), so it is a count noun.`, `*${right}* 可以一个一个数，所以是可数名词。`)
            : t(
                `*${right}* cannot be counted one by one; it is a mass noun, so we measure it instead.`,
                `*${right}* 不能一个一个数，是不可数名词，只能计量。`,
              ),
        (wrong) =>
          isCount(wrong)
            ? t(`*${wrong}* has a plural and can be counted, so it is a count noun.`, `*${wrong}* 有复数，可以数，是可数名词。`)
            : t(`You cannot count *${wrong}* one by one; it is a mass noun.`, `*${wrong}* 不能一个一个数，是不可数名词。`),
      ),
    ),
    point(
      "choosing-fewer-or-less",
      t("Choosing Fewer or Less", "选择 fewer 或 less"),
      t(
        "Use **fewer**, **many** and **number** with count nouns: *fewer droplets, many glaciers, the number of days*. Use **less**, **much** and **amount** with mass nouns: *less water, much ice, the amount of rain*. First decide whether the noun can be counted, then choose the word that goes with it.",
        "可数名词用 **fewer**、**many** 和 **number**：*fewer droplets, many glaciers, the number of days*。不可数名词用 **less**、**much** 和 **amount**：*less water, much ice, the amount of rain*。先判断名词是否可数，再选择与之搭配的词。",
      ),
      choiceGenerator(
        t("Which word fits the gap?", "哪个词适合填空？"),
        fewerLines.map((r): ChoiceItem => [field(r, 0), field(r, 1), [field(r, 2), field(r, 3)]]),
        (right, shown) => {
          const noun = fewerNoun(shown);
          return forCount(right)
            ? t(
                `*${noun}* can be counted, so the sentence needs **${right}**, a word for count nouns.`,
                `*${noun}* 可数，所以要用用于可数名词的 **${right}**。`,
              )
            : t(
                `*${noun}* cannot be counted one by one, so the sentence needs **${right}**, a word for amounts.`,
                `*${noun}* 不可数，所以要用表示数量的 **${right}**。`,
              );
        },
        (wrong, _right, shown) => {
          const noun = fewerNoun(shown);
          return forCount(wrong)
            ? t(
                `*${wrong}* goes with things you count, but *${noun}* is an amount here.`,
                `*${wrong}* 用于可数的东西，但这里的 *${noun}* 是一个量。`,
              )
            : t(
                `*${wrong}* goes with amounts, but *${noun}* are things you count.`,
                `*${wrong}* 用于不可数的量，但 *${noun}* 是可数的东西。`,
              );
        },
      ),
    ),
  ],
});

// -able and -ible: clue|right|wrong|wrong|kind (whole, part, drop), then the sentence for typing.
const ableLines = rows(`
  able to be broken|breakable|breakible|brakeable|whole|The glass vase is ___.
  able to be washed|washable|washible|washeable|whole|This jacket is ___ in cold water.
  able to be read|readable|readible|readeable|whole|Her handwriting is neat and ___.
  giving comfort|comfortable|comfortible|comfortabel|whole|The new chairs are very ___.
  giving joy|enjoyable|enjoyible|enjoyabel|whole|The trip to the lake was ___.
  able to be depended on|dependable|dependible|dependeble|whole|Our old car is slow but ___.
  worth remarking on|remarkable|remarkible|remarkeble|whole|The view from the top was ___.
  able to be predicted|predictable|predictible|predicteble|whole|The ending of the film was ___.
  in fashion|fashionable|fashionible|fashionabel|whole|Wide hats were ___ that summer.
  able to be afforded|affordable|affordible|affordeble|whole|The town built ___ houses.
  able to be laughed at|laughable|laughible|laugheble|whole|His excuse was ___.
  fit to drink|drinkable|drinkible|drinkeble|whole|The filter makes the river water ___.
  able to be seen|visible|visable|visibel|part|The stars are ___ on a clear night.
  able to bend|flexible|flexable|flexibel|part|A rubber hose is ___.
  able to happen|possible|possable|possibel|part|Is it ___ to walk there in an hour?
  very bad|terrible|terrable|terribel|part|The storm caused ___ damage.
  fit to eat|edible|edable|edibel|part|Some mushrooms are ___, but others are poisonous.
  loud enough to be heard|audible|audable|audibel|part|Her voice was barely ___ over the wind.
  clear enough to be read|legible|legable|legibel|part|Write your name in ___ letters.
  hard to believe|incredible|incredable|incredibel|part|The athlete made an ___ jump.
  showing good sense|sensible|sensable|sensibel|part|Wearing a helmet is ___.
  in charge of something|responsible|responsable|responsibel|part|Who is ___ for feeding the fish?
  full of terror|horrible|horrable|horribel|part|We heard a ___ crash.
  having great value|valuable|valueable|valuible|drop|The museum keeps ___ coins in a safe.
  easily excited|excitable|exciteable|excitible|drop|The puppy is ___ and jumps on everyone.
  able to be adored|adorable|adoreable|adorible|drop|The baby goat was ___.
  able to be believed|believable|believeable|believible|drop|Her story was hard to find ___.
  worth desiring|desirable|desireable|desirible|drop|A garden is a ___ thing to have.
  worth noting|notable|noteable|notible|drop|The bridge is a ___ example of old building.
  able to be recycled|recyclable|recycleable|recyclible|drop|Put ___ bottles in the blue bin.
  able to be cured|curable|cureable|curible|drop|The disease is ___ if it is found early.
  wise to do|advisable|adviseable|advisible|drop|It is ___ to carry water on a long hike.
  right for the purpose|suitable|suitible|suiteable|whole|Boots are ___ for a muddy hike.
  fair and sensible|reasonable|reasonible|reasonabel|whole|Five dollars is a ___ price for the book.
  able to be avoided|avoidable|avoidible|avoideble|whole|The accident was ___ if we had been careful.
  able to be accepted|acceptable|acceptible|accepteble|whole|Messy work is not ___ in this class.
  able to be counted|countable|countible|counteble|whole|Apples are ___, but water is not.
  pleasant and willing to agree|agreeable|agreeible|agreable|whole|The new neighbor is friendly and ___.
  open to doubt|questionable|questionible|questioneble|whole|His story about the alien was ___.
  likely to be true|plausible|plausable|plausibel|part|Her excuse sounded ___ to the teacher.
  able to be done|feasible|feasable|feasibel|part|Is it ___ to finish the model by Friday?
  able to be touched|tangible|tangable|tangibel|part|The prize was a ___ reward, a real medal.
  allowed to take part|eligible|eligable|eligibel|part|Only fifth graders are ___ for the contest.
  easy to trick|gullible|gullable|gullibel|part|The ___ boy believed the moon was made of cheese.
  too strong to be beaten|invincible|invincable|invincibel|part|The hero in the comic seemed ___.
  able to work together|compatible|compatable|compatibel|part|This charger is ___ with my tablet.
  able to be forgiven|forgivable|forgiveable|forgivible|drop|Forgetting a pencil is a ___ mistake.
  able to be imagined|imaginable|imagineable|imaginible|drop|The shop sold every flavor ___.
  open to argument|debatable|debateable|debatible|drop|Whether cats are smarter than dogs is ___.
  able to be compared|comparable|compareable|comparible|drop|The two bikes are ___ in price.
  able to be excused|excusable|excuseable|excusible|drop|Being late once is ___.
  able to be measured|measurable|measureable|measurible|drop|The plant made ___ growth in a week.
  giving pleasure|pleasurable|pleasureable|pleasurible|drop|The boat ride was ___.
`);
const ableKind = (word: string) => ableLines.find((r) => r[1] === word)?.[4] ?? "whole";
const ableWhy = (right: string): Pair => {
  const kind = ableKind(right);
  if (kind === "part")
    return [
      `**${right}** ends in *-ible*: what comes before the ending is not a whole English word on its own.`,
      `**${right}** 以 *-ible* 结尾：词尾前面的部分本身不是一个完整的英语单词。`,
    ];
  if (kind === "drop")
    return [
      `**${right}** is a whole word plus *-able*, and the silent *e* at its end drops before the ending.`,
      `**${right}** 是完整的单词加 *-able*，词末不发音的 *e* 在加词尾前去掉。`,
    ];
  return [
    `**${right}** is a whole word plus *-able*: a whole word usually takes *-able*.`,
    `**${right}** 是完整的单词加 *-able*：完整的单词通常加 *-able*。`,
  ];
};

const ableOrIble = topic("grammar", {
  id: "spelling-able-and-ible",
  title: ["Spelling -able and -ible", "-able 与 -ible 的拼写"],
  summary: [
    "-able usually follows a whole word (breakable), -ible a part that is not a word on its own (visible); a final silent e drops before -able.",
    "-able 通常接在完整的单词后（breakable），-ible 接在本身不成词的部分后（visible）；词末不发音的 e 在 -able 前去掉。",
  ],
  after: ["common-suffixes"],
  points: [
    choose(
      "choosing-able-or-ible",
      ["Choosing -able or -ible", "选择 -able 或 -ible"],
      [
        "The endings **-able** and **-ible** sound alike, so look at what comes before them. If it is a whole word, the ending is usually *-able*: *break, breakable*; *wash, washable*. If it is not a word on its own, the ending is usually *-ible*: *vis-ible*, *flex-ible*. A silent *e* at the end of the word drops: *value, valuable*.",
        "词尾 **-able** 和 **-ible** 读音相近，所以要看前面的部分。如果是完整的单词，通常用 *-able*：*break, breakable*；*wash, washable*。如果本身不成词，通常用 *-ible*：*vis-ible*、*flex-ible*。词末不发音的 *e* 要去掉：*value, valuable*。",
      ],
      ["Which word is spelled correctly for this meaning?", "表示这个意思的哪个词拼写正确？"],
      ableLines.flatMap((r): ChoiceItem[] => [
        [field(r, 0), field(r, 1), [field(r, 2), field(r, 3)]],
        [field(r, 5), field(r, 1), [field(r, 2), field(r, 3)]],
      ]),
      (right) => ableWhy(right),
      [
        ["*{wrong}* uses the other ending; **{right}** is the spelling.", "*{wrong}* 用错了词尾；正确拼写是 **{right}**。"],
        [
          "*{wrong}* changes the letters around the ending; the spelling is **{right}**.",
          "*{wrong}* 改动了词尾附近的字母；正确拼写是 **{right}**。",
        ],
      ],
    ),
    type(
      "typing-able-and-ible-words",
      ["Typing -able and -ible Words", "拼写 -able 和 -ible 词"],
      [
        "When you spell a word with one of these endings, check the part before it. A whole word keeps its letters and takes *-able*, except that a silent final *e* drops (*recycle, recyclable*). A part that cannot stand alone takes *-ible*, as in *legible* and *audible*. Say the word, then check it this way.",
        "拼写带这类词尾的词时，检查词尾前的部分。完整的单词保持原有字母并加 *-able*，但词末不发音的 *e* 要去掉（*recycle, recyclable*）。本身不能单独成词的部分加 *-ible*，如 *legible* 和 *audible*。先读出这个词，再这样检查。",
      ],
      ["Type the missing word, which ends in -able or -ible.", "输入缺少的词，它以 -able 或 -ible 结尾。"],
      ableLines.flatMap((r) => [
        typed(field(r, 5), field(r, 1), [field(r, 2), field(r, 3)], undefined, t(`It means: ${field(r, 0)}.`, `意思是：${field(r, 0)}。`)),
        typed(
          field(r, 0),
          field(r, 1),
          [field(r, 2), field(r, 3)],
          undefined,
          t("Type the word with this meaning.", "输入表示这个意思的词。"),
        ),
      ]),
      (right) => ableWhy(right),
    ),
  ],
});

// Greek spellings: meaning|right|wrong|wrong|sound|sentence
const greekLines = rows(`
  a picture made with a camera|photograph|fotograph|photograf|f|Grandma keeps an old ___ of her parents.
  a device you call people on|telephone|telefone|telepone|f|The ___ rang during dinner.
  the letters of a language in order|alphabet|alfabet|alphebet|f|The English ___ has twenty-six letters.
  a large gray animal with a trunk|elephant|elefant|elephent|f|The ___ sprayed water with its trunk.
  a clever sea animal that breathes air|dolphin|dolfin|dolphine|f|A ___ jumped beside our boat.
  a cup given as a prize|trophy|trofy|trophey|f|Our team won a shiny ___.
  a shop that sells medicine|pharmacy|farmacy|pharmasy|f|Dad picked up my medicine at the ___.
  a device that makes a voice louder|microphone|microfone|mikrophone|f|The singer held the ___ close.
  a group of sentences about one idea|paragraph|paragraf|parigraph|f|Start each ___ on a new line.
  the study of the earth's lands and peoples|geography|geografy|jeography|f|In ___ we learned about mountains and rivers.
  a child whose parents have died|orphan|orfan|orphen|f|The ___ in the story found a new family.
  a group of singers|chorus|korus|choros|k|Everyone joined in the ___ of the song.
  a scientist who studies substances|chemist|kemist|chemest|k|The ___ mixed two liquids in a glass.
  a person in a story|character|caracter|charakter|k|My favorite ___ in the book is the brave mouse.
  the organ where food is broken down|stomach|stomack|stomak|k|My ___ hurt after the big lunch.
  a sound that comes back|echo|eko|ecko|k|We heard an ___ in the empty cave.
  complete confusion|chaos|kaos|chaose|k|The room was in ___ after the party.
  a large group of musicians|orchestra|orkestra|orchestre|k|The ___ played a slow song.
  a heavy hook that holds a ship|anchor|anker|ancor|k|The sailors dropped the ___ in the bay.
  a person who fixes machines|mechanic|mekanic|mechanick|k|The ___ fixed the brakes of our car.
  a person who designs buildings|architect|arkitect|architekt|k|An ___ drew the plans for the new library.
  a record of events in time order|chronicle|kronicle|cronicle|k|The old book is a ___ of the town's history.
  a sign that stands for something|symbol|simbol|symbel|i|A heart is a ___ of love.
  a set of parts that work together|system|sistem|systim|i|The solar ___ has eight planets.
  something no one can explain|mystery|mistery|mystary|i|Who took the cake is still a ___.
  a room for sports and exercise|gym|jim|gim|i|We play basketball in the ___.
  an old story about gods or heroes|myth|mith|mythe|i|The ___ tells how a god brought fire to people.
  a regular beat in music|rhythm|rhithm|rythm|i|Clap your hands to the ___.
  a clear, hard mineral|crystal|cristal|crystel|i|A ___ of salt sparkled under the lens.
  usual or normal|typical|tipical|typicle|i|Rain is ___ in April.
  a long piece of music for an orchestra|symphony|simphony|symfony|i|The orchestra played a long ___.
  the gas in the air that we need to breathe|oxygen|oxigen|oxygin|i|Fish take ___ from the water.
  a round shape like a ball|sphere|sfere|sphear|f|The earth is almost a perfect ___.
  having to do with the body|physical|fisical|physicle|f|Running is good ___ exercise.
  a drawing that shows numbers as lines or bars|graph|graf|grath|f|Our class made a bar ___ of favorite fruits.
  the sounds that letters stand for, taught in reading|phonics|fonics|phonix|f|Little children learn ___ to sound out words.
  one of the shapes the moon shows in a month|phase|faze|phays|f|The full moon is one ___ of the moon.
  a bird with long tail feathers that lives in fields|pheasant|fesant|pheasent|f|A ___ ran across the farm road.
  a group of notes played together|chord|cord|chorde|k|She played a ___ on the guitar.
  the science of what things are made of|chemistry|kemistry|chemestry|k|In ___ class we mixed baking soda and vinegar.
  a plan, often a tricky one|scheme|skeme|sheme|k|The fox had a ___ to steal the eggs.
  a place where children learn|school|skool|scool|k|Our ___ has a new library.
  a group of singers in a church|choir|kwire|choyer|k|She sings in the church ___.
  a person who does flips and balances in sport|gymnast|jimnast|gymnest|i|The ___ landed a perfect flip.
  a brass plate that crashes in a band|cymbal|simbal|cymbel|i|He hit the ___ at the end of the song.
  an old tomb with four sloping sides|pyramid|piramid|pyramed|i|The ___ in Egypt is thousands of years old.
  a song of praise|hymn|him|hymm|i|The choir sang a ___.
  a shape like a can|cylinder|silinder|cylindar|i|A soup can is a ___.
  a sign of an illness|symptom|simptom|symptem|i|A cough is a ___ of a cold.
  a feeling of sharing someone's sadness|sympathy|simpathy|sympathey|i|We sent a card to show our ___.
`);
const greekSound = (word: string) => greekLines.find((r) => r[1] === word)?.[4] ?? "f";
const greekWhy = (right: string): Pair => {
  const sound = greekSound(right);
  if (sound === "f")
    return [
      `**${right}** comes from Greek, where the sound /f/ is spelled *ph*.`,
      `**${right}** 来自希腊语，希腊语来源的词中 /f/ 音拼作 *ph*。`,
    ];
  if (sound === "k")
    return [
      `**${right}** comes from Greek, where the sound /k/ is often spelled *ch*.`,
      `**${right}** 来自希腊语，希腊语来源的词中 /k/ 音常拼作 *ch*。`,
    ];
  return [
    `**${right}** comes from Greek, where a short /i/ sound is often spelled *y*.`,
    `**${right}** 来自希腊语，希腊语来源的词中短音 /i/ 常拼作 *y*。`,
  ];
};
const soundName: Record<string, Pair> = {
  f: ["It has the sound /f/.", "它含有 /f/ 音。"],
  k: ["It has the sound /k/.", "它含有 /k/ 音。"],
  i: ["It has a short /i/ sound.", "它含有短音 /i/。"],
};

const greekSpellings = topic("grammar", {
  id: "spelling-ph-ch-and-y",
  title: ["Spelling ph, ch and y from Greek", "希腊来源词中的 ph、ch 和 y"],
  summary: [
    "Words from Greek spell /f/ as ph (photo), /k/ as ch (chorus, chemist) and short /i/ as y (symbol).",
    "希腊来源的词把 /f/ 拼作 ph（photo），/k/ 拼作 ch（chorus、chemist），短音 /i/ 拼作 y（symbol）。",
  ],
  after: ["greek-roots-1"],
  points: [
    choose(
      "choosing-the-greek-spelling",
      ["Choosing the Greek Spelling", "选择希腊式拼写"],
      [
        "Many English words of science, music and learning come from Greek, and they keep Greek spellings of some sounds. The sound /f/ is spelled **ph** (*photo, alphabet*), the sound /k/ is often spelled **ch** (*chorus, chemist*), and a short /i/ is often spelled **y** (*symbol, mystery*).",
        "英语中许多科学、音乐和学术词汇来自希腊语，某些音保留了希腊式拼写。/f/ 音拼作 **ph**（*photo, alphabet*），/k/ 音常拼作 **ch**（*chorus, chemist*），短音 /i/ 常拼作 **y**（*symbol, mystery*）。",
      ],
      ["Which spelling is right for this word?", "这个词的哪种拼写是正确的？"],
      greekLines.flatMap((r): ChoiceItem[] => [
        [field(r, 0), field(r, 1), [field(r, 2), field(r, 3)]],
        [field(r, 5), field(r, 1), [field(r, 2), field(r, 3)]],
      ]),
      (right) => greekWhy(right),
      [
        [
          "*{wrong}* spells the sound the plain English way; the Greek spelling is **{right}**.",
          "*{wrong}* 用了普通的英语拼法；希腊式拼写是 **{right}**。",
        ],
        [
          "*{wrong}* has the Greek letters but gets another part wrong; the word is **{right}**.",
          "*{wrong}* 用了希腊式字母，但其他部分拼错了；正确的是 **{right}**。",
        ],
      ],
    ),
    type(
      "typing-greek-spellings",
      ["Typing Words with Greek Spellings", "拼写希腊来源的词"],
      [
        "To spell a word from Greek, listen for the sounds that Greek spells its own way. When you hear /f/ in a word of science or learning, try *ph*; when you hear /k/ in *chorus* or *chemist*, try *ch*; when you hear a short /i/ in the middle of the word, try *y*. Then check that the rest of the word looks right.",
        "拼写希腊来源的词时，注意希腊语有特殊拼法的音。在科学或学术词汇中听到 /f/，试试 *ph*；在 *chorus*、*chemist* 这样的词里听到 /k/，试试 *ch*；在词中间听到短音 /i/，试试 *y*。然后检查词的其余部分是否正确。",
      ],
      ["Type the word that has this meaning.", "输入表示这个意思的词。"],
      greekLines.flatMap((r) => {
        const sound = soundName[field(r, 4)] ?? ["", ""];
        return [
          typed(field(r, 0), field(r, 1), [field(r, 2), field(r, 3)], undefined, t(...sound)),
          typed(field(r, 5), field(r, 1), [field(r, 2), field(r, 3)], undefined, t(...sound)),
        ];
      }),
      (right) => greekWhy(right),
    ),
  ],
});

// Because or because of: what follows, then the word that fits.
/** causeRows are a noun, two adjectives that can be the cause, a result, and something that happened anyway. */
const causeRows = [
  ["road", "icy", "flooded", "We drove slowly", "we drove to the lake"],
  ["soup", "salty", "burnt", "Nobody finished lunch", "everyone asked for more"],
  ["room", "dark", "crowded", "We could not find our seats", "we found our seats"],
  ["river", "deep", "fast", "The children did not swim", "the ducks swam happily"],
  ["sky", "cloudy", "hazy", "We could not see the stars", "we had our picnic outside"],
  ["path", "steep", "slippery", "The hikers walked carefully", "the hikers reached the top"],
  ["floor", "wet", "muddy", "Mom told us to wear shoes", "the dancers kept dancing"],
  ["party", "noisy", "loud", "The baby could not sleep", "the baby fell asleep"],
  ["bus", "late", "slow", "We missed the start of the play", "we got there on time"],
  ["test", "hard", "long", "Many students felt tired", "most students passed"],
  ["map", "old", "torn", "The explorers got lost", "the explorers found the cave"],
  ["bridge", "weak", "broken", "The truck took another road", "the cyclists crossed the river"],
  ["water", "cold", "dirty", "We did not swim", "the dog jumped in"],
  ["tent", "small", "leaky", "We slept badly", "we stayed dry"],
  ["ice", "thin", "cracked", "Nobody skated on the pond", "the boys skated anyway"],
  ["hill", "steep", "icy", "The riders got off their bikes", "the riders reached the top"],
  ["kitten", "sick", "weak", "The kitten cried all night", "the kitten played with the ball"],
  ["film", "long", "scary", "My little brother left early", "my little brother watched to the end"],
] as const;
const causePairs = causeRows.flatMap(([noun, a, b, result, anyway]) =>
  [a, b].map((adj) => ({ clause: `the ${noun} was ${adj}`, phrase: `the ${adj} ${noun}`, result, anyway })),
);
const clauses = [
  "the milk was warm",
  "the bread rose",
  "the slide was dirty",
  "the cells divided",
  "the lab was sterile",
  "she wore goggles",
  "the yeast was alive",
  "the water boiled",
  "the germs spread",
  "the lens was cracked",
  "it rained all week",
  "he washed his hands",
  "the mold grew quickly",
  "the dough was cold",
  "the light was too dim",
  ...causePairs.map((p) => p.clause),
];
const phrases = [
  "the warm milk",
  "the rising bread",
  "the dirty slide",
  "the dividing cells",
  "the sterile lab",
  "her goggles",
  "the living yeast",
  "the boiling water",
  "the spreading germs",
  "the cracked lens",
  "a week of rain",
  "his clean hands",
  "the fast-growing mold",
  "the cold dough",
  "the dim light",
  ...causePairs.map((p) => p.phrase),
];
const followItems: ChoiceItem[] = clauses.flatMap((c, i): ChoiceItem[] => [
  ["Which words could follow **because**?", c, [phrases[i] ?? "", phrases[(i + 6) % phrases.length] ?? ""]],
  [
    "Which words could follow **because of**?",
    phrases[(i + 3) % phrases.length] ?? "",
    [clauses[(i + 3) % clauses.length] ?? "", clauses[(i + 9) % clauses.length] ?? ""],
  ],
]);
const isClause = (s: string) => clauses.includes(s);

const becauseCross = causePairs
  .flatMap(({ clause, phrase, result, anyway }) => [
    `${result} ___ ${phrase}.|because of|because|although`,
    `${result} ___ ${clause}.|because|because of|despite`,
    `___ ${phrase}, ${anyway}.|Despite|Although|Because`,
    `___ ${clause}, ${anyway}.|Although|Despite|Because of`,
  ])
  .join("\n");
const becauseLines = rows(`${becauseCross}\n
  The bread rose ___ the yeast.|because of|because|although
  The bread rose ___ the yeast was alive.|because|because of|despite
  We wore gloves ___ the germs.|because of|because|although
  We wore gloves ___ germs can spread.|because|because of|despite
  The slide was hard to see ___ a crack in the lens.|because of|because|although
  The slide was hard to see ___ the lens was cracked.|because|because of|despite
  ___ the heat, the cheese did not melt.|Despite|Although|Because
  ___ it was hot, the cheese did not melt.|Although|Despite|Because of
  The mold kept growing ___ the cold.|despite|although|because
  The mold kept growing ___ the fridge was cold.|although|despite|because of
  The class stayed inside ___ the rain.|because of|because|although
  The class stayed inside ___ it was raining.|because|because of|despite
  ___ the noise, the scientist kept working.|Despite|Although|Because
  ___ the room was noisy, the scientist kept working.|Although|Despite|Because of
  The milk went sour ___ the warm weather.|because of|because|although
  The milk went sour ___ we left it out.|because|because of|despite
  Yeast cannot grow ___ the lack of sugar.|because of|because|although
  Yeast cannot grow ___ there is no sugar.|because|because of|despite
  The bacteria survived ___ the boiling water.|despite|although|because
  The bacteria survived ___ we boiled the water.|although|despite|because of
  She washed her hands ___ the risk of infection.|because of|because|although
  She washed her hands ___ germs cause infection.|because|because of|despite
  ___ his cold, Leo went to the lab.|Despite|Although|Because
  ___ he had a cold, Leo went to the lab.|Although|Despite|Because of
  The plants wilted ___ the dry air.|because of|because|although
  The plants wilted ___ the air was dry.|because|because of|despite
  The experiment worked ___ a small mistake.|despite|although|because
  The experiment worked ___ we made a small mistake.|although|despite|because of
  The pond water was cloudy ___ the algae.|because of|because|although
  The pond water was cloudy ___ algae were growing in it.|because|because of|despite
`);
const pairOf = (w: string): "reason" | "contrast" => (["because", "because of"].includes(w.toLowerCase()) ? "reason" : "contrast");
const takesClause = (w: string) => ["because", "although"].includes(w.toLowerCase());

const becauseOrBecauseOf = topic("grammar", {
  id: "because-or-because-of",
  title: ["Because or Because Of", "because 还是 because of"],
  summary: [
    "Because and although begin a clause with a subject and a verb; because of and despite come before a noun phrase.",
    "because 和 although 引出含主语和动词的从句；because of 和 despite 放在名词短语前。",
  ],
  after: ["subordinating-conjunctions", "prepositional-phrases"],
  points: [
    choiceGenerator(
      t("Read the question and choose the words.", "读问题，选出词组。"),
      followItems,
      (right) =>
        isClause(right)
          ? t(
              `*${right}* has a subject and a verb, so it is a clause, and a clause follows **because**.`,
              `*${right}* 有主语和动词，是从句，从句跟在 **because** 后面。`,
            )
          : t(
              `*${right}* is a noun phrase with no verb of its own, and a noun phrase follows **because of**.`,
              `*${right}* 是没有谓语动词的名词短语，名词短语跟在 **because of** 后面。`,
            ),
      (wrong) =>
        isClause(wrong)
          ? t(
              `*${wrong}* has a subject and a verb; a clause follows **because**, not **because of**.`,
              `*${wrong}* 有主语和动词；从句跟在 **because** 后，不跟在 **because of** 后。`,
            )
          : t(
              `*${wrong}* has no verb; a noun phrase needs **because of**, not **because**.`,
              `*${wrong}* 没有动词；名词短语要用 **because of**，不用 **because**。`,
            ),
    ),
    choiceGenerator(
      t("Which word or words fit the gap?", "哪个词或词组适合填空？"),
      becauseLines.map((r): ChoiceItem => [field(r, 0), field(r, 1), [field(r, 2), field(r, 3)]]),
      (right) => {
        const clause = takesClause(right);
        const meaning: Pair = pairOf(right) === "reason" ? ["gives a reason", "表示原因"] : ["shows a contrast", "表示转折"];
        return clause
          ? t(
              `A clause with a subject and a verb follows, and the sentence ${meaning[0]}, so **${right}** fits.`,
              `后面是有主语和动词的从句，句子${meaning[1]}，所以用 **${right}**。`,
            )
          : t(
              `A noun phrase with no verb follows, and the sentence ${meaning[0]}, so **${right}** fits.`,
              `后面是没有动词的名词短语，句子${meaning[1]}，所以用 **${right}**。`,
            );
      },
      (wrong, right) =>
        pairOf(wrong) === pairOf(right)
          ? t(
              `*${wrong}* has the right meaning but the wrong form: ${takesClause(wrong) ? "it needs a clause after it" : "it needs a noun phrase after it"}.`,
              `*${wrong}* 意思对，但形式不对：${takesClause(wrong) ? "它后面要接从句" : "它后面要接名词短语"}。`,
            )
          : t(
              `*${wrong}* ${pairOf(wrong) === "reason" ? "gives a reason" : "shows a contrast"}, which is not what the two parts of this sentence show.`,
              `*${wrong}* ${pairOf(wrong) === "reason" ? "表示原因" : "表示转折"}，与句子两部分的关系不符。`,
            ),
    ),
  ].map((g, i) =>
    i === 0
      ? point(
          "clause-or-noun-phrase",
          t("Clause or Noun Phrase", "从句还是名词短语"),
          t(
            "A **clause** has a subject and a verb: *the milk was warm*. A **noun phrase** is a noun with the words around it and no verb of its own: *the warm milk*. **Because** and **although** begin a clause; **because of** and **despite** come before a noun phrase.",
            "**从句**有主语和动词：*the milk was warm*。**名词短语**是名词加上修饰它的词，没有自己的谓语动词：*the warm milk*。**because** 和 **although** 引出从句；**because of** 和 **despite** 放在名词短语前。",
          ),
          g,
        )
      : point(
          "choosing-because-or-because-of",
          t("Choosing the Word That Fits", "选择合适的词"),
          t(
            "Two questions decide the word. Does the sentence give a reason (*because, because of*) or a contrast (*although, despite*)? And does a clause or a noun phrase follow? *The bread rose because the yeast was alive* has a clause; *The bread rose because of the yeast* has a noun phrase.",
            "两个问题决定用哪个词。句子是表示原因（*because, because of*）还是转折（*although, despite*）？后面接的是从句还是名词短语？*The bread rose because the yeast was alive* 后面是从句；*The bread rose because of the yeast* 后面是名词短语。",
          ),
          g,
        ),
  ),
});

// The future perfect.
/** futureSubjects are a subject and whether it takes have. */
const futureSubjects = [
  ["my sister", false],
  ["the twins", true],
  ["our class", false],
  ["we", true],
  ["Grandpa", false],
  ["the workers", true],
] as const;
/** futureVerbs are a verb, its past participle and what it acts on. */
const futureVerbs = [
  ["finish", "finished", "the science project"],
  ["paint", "painted", "the fence"],
  ["read", "read", "all seven books"],
  ["build", "built", "a tree house"],
  ["plant", "planted", "the tomato seeds"],
  ["write", "written", "three letters"],
  ["learn", "learned", "the new song"],
  ["clean", "cleaned", "the garage"],
  ["save", "saved", "enough money"],
  ["visit", "visited", "every museum in town"],
  ["eat", "eaten", "all the cookies"],
  ["draw", "drawn", "the map"],
  ["sell", "sold", "all the lemonade"],
  ["fix", "fixed", "the old bike"],
  ["choose", "chosen", "a name for the puppy"],
] as const;
const futureTimes = [
  "By next Friday",
  "By the end of the month",
  "By the time the bell rings",
  "By 2035",
  "Before the summer ends",
] as const;
const futureCross = everyPair(futureSubjects, futureVerbs).map(([[who, many], [base, done, what]], k) => ({
  shown: `${futureTimes[k % futureTimes.length]}, ${who} ___ ${what}.`,
  base,
  right: `will have ${done}`,
  now: `${many ? "have" : "has"} ${done}`,
}));
const futureLines = rows(`${futureCross.map((f) => `${f.shown}|${f.right}|${f.now}|would have ${f.right.slice(10)}`).join("\n")}\n
  By the time you wake up, the rocket ___.|will have launched|has launched|would have launched
  By 2030, the probe ___ Jupiter.|will have reached|has reached|would have reached
  By next June, the astronauts ___ six months in space.|will have spent|have spent|would have spent
  By the end of the week, the rover ___ ten kilometers.|will have driven|has driven|would have driven
  Before the sun sets, the crew ___ the module.|will have repaired|has repaired|would have repaired
  By the time the countdown ends, everyone ___ their seat.|will have taken|has taken|would have taken
  By tomorrow night, the comet ___ out of sight.|will have moved|has moved|would have moved
  By the time we arrive, the show at the planetarium ___.|will have started|has started|would have started
  By 2040, people ___ on the moon again.|will have landed|have landed|would have landed
  When the capsule splashes down, it ___ around Earth sixteen times.|will have gone|has gone|would have gone
  By Friday, I ___ my report on Mars.|will have finished|have finished|would have finished
  By midnight, the eclipse ___.|will have ended|has ended|would have ended
  By the time the telescope is ready, the scientists ___ for ten years.|will have worked|have worked|would have worked
  By next year, the satellite ___ a million photos.|will have taken|has taken|would have taken
  By the end of the mission, the probe ___ every moon of Saturn.|will have visited|has visited|would have visited
  By the time you read this, the spacecraft ___ the edge of the solar system.|will have passed|has passed|would have passed
  By noon, the students ___ the model rocket.|will have built|have built|would have built
  By the end of the century, the station ___ in orbit for a hundred years.|will have stayed|has stayed|would have stayed
  By the time the crew returns, their muscles ___ weaker.|will have grown|have grown|would have grown
  By 2050, engineers ___ a base on the moon.|will have built|have built|would have built
  By the time the bus comes, we ___ for an hour.|will have waited|have waited|would have waited
  By next summer, my brother ___ his telescope.|will have built|has built|would have built
  By the end of the show, the stars ___ across the dome.|will have moved|have moved|would have moved
  By sunrise, the meteor shower ___.|will have ended|has ended|would have ended
  By the year 2100, the probe ___ far beyond Pluto.|will have traveled|has traveled|would have traveled
  By the time the crew wakes, the station ___ around Earth five times.|will have gone|has gone|would have gone
  By Monday, the class ___ every planet in its model.|will have painted|has painted|would have painted
  By the time you finish this book, you ___ about every moon of Mars.|will have read|have read|would have read
  By the next eclipse, scientists ___ a new camera.|will have made|have made|would have made
  By the end of the countdown, the engines ___.|will have started|have started|would have started
`);
const futureForm = rows(`${futureCross.map((f) => `${f.shown}|${f.base}|${f.right}|${f.now},will ${f.base}`).join("\n")}\n
  By 2030, the probe ___ Jupiter.|reach|will have reached|has reached,will reach
  By the time you wake up, the rocket ___.|launch|will have launched|has launched,will launch
  By next June, the crew ___ six months in space.|spend|will have spent|will have spended,have spent
  By Friday, I ___ my report.|finish|will have finished|have finished,will finish
  By midnight, the eclipse ___.|end|will have ended|has ended,will end
  By noon, we ___ the model rocket.|build|will have built|will have builded,have built
  By the end of the year, the rover ___ a thousand photos.|take|will have taken|will have took,has taken
  By the time we get there, the show ___.|begin|will have begun|will have began,has begun
  By next week, the satellite ___ around Earth a hundred times.|go|will have gone|will have went,has gone
  By 2040, people ___ on Mars.|land|will have landed|have landed,will land
  By tonight, the comet ___ behind the sun.|move|will have moved|has moved,will move
  By the end of the mission, the astronauts ___ many experiments.|do|will have done|will have did,have done
  By sunrise, the moon ___.|set|will have set|will have setted,has set
  By the time the lesson ends, you ___ ten new words.|learn|will have learned|have learned,will learn
  By next spring, the scientists ___ the new telescope.|test|will have tested|have tested,will test
  By the time the probe arrives, it ___ for seven years.|fly|will have flown|will have flew,has flown
  By Saturday, my sister ___ the book about stars.|read|will have read|will have readed,has read
  By the end of the day, the crew ___ their supplies.|check|will have checked|have checked,will check
  By 2035, the station ___ a new module.|get|will have gotten|will have got,has gotten
  By the time the bell rings, I ___ my answer.|write|will have written|will have wrote,have written
  By dinner, the bread ___.|rise|will have risen|will have rose,has risen
  By next month, the rocket ___ to the launch pad.|roll|will have rolled|has rolled,will roll
  By the time you call, we ___.|leave|will have left|will have leaved,have left
  By the end of the night, we ___ three planets.|see|will have seen|will have saw,have seen
  By 2045, the probe ___ the last of its fuel.|use|will have used|has used,will use
  By the time it lands, the capsule ___ the heat of the air.|survive|will have survived|has survived,will survive
  By tomorrow, the teacher ___ our reports.|mark|will have marked|has marked,will mark
  By the end of the trip, we ___ a lot about space.|learn|will have learned|have learned,learned
  By the time he is ten, he ___ to the planetarium twenty times.|go|will have gone|will have went,has gone
  By then, the storm on Jupiter ___ for four hundred years.|last|will have lasted|has lasted,will last
`);

const futurePerfect = topic("grammar", {
  id: "future-perfect-tense",
  title: ["The Future Perfect Tense", "将来完成时"],
  summary: [
    "Will have with a past participle tells what will be finished before a time in the future: by 2030 the probe will have reached Jupiter.",
    "will have 加过去分词表示在将来某个时间之前会完成的事：by 2030 the probe will have reached Jupiter。",
  ],
  after: ["perfect-verb-tenses"],
  points: [
    choose(
      "choosing-the-future-perfect",
      ["When to Use the Future Perfect", "何时用将来完成时"],
      [
        "The **future perfect** tells about an action that will be finished before a certain time in the future. It is formed with *will have* and the past participle: *By 2030, the probe **will have reached** Jupiter.* Phrases such as *by next year*, *by the time* and *before the sun sets* point to it.",
        "**将来完成时**表示在将来某个时间之前会完成的动作，由 *will have* 加过去分词构成：*By 2030, the probe **will have reached** Jupiter.* *by next year*、*by the time*、*before the sun sets* 这样的短语提示要用它。",
      ],
      ["Which verb fits the gap?", "哪个动词形式适合填空？"],
      futureLines.map((r): ChoiceItem => [field(r, 0), field(r, 1), [field(r, 2), field(r, 3)]]),
      (right) => [
        `The sentence names a future time by which the action is done, so it needs the future perfect: **${right}**.`,
        `句子指出了一个将来的时间，动作在此之前完成，所以要用将来完成时：**${right}**。`,
      ],
      [
        [
          "*{wrong}* is the present perfect, for something already done by now, not by a future time.",
          "*{wrong}* 是现在完成时，表示到现在已完成，而不是到将来某时完成。",
        ],
        [
          "*{wrong}* tells what would have happened if things were different, not what will be done by a future time.",
          "*{wrong}* 表示假设情况下本会发生的事，而不是到将来某时会完成的事。",
        ],
      ],
    ),
    type(
      "forming-the-future-perfect",
      ["Forming the Future Perfect", "构成将来完成时"],
      [
        "To form the future perfect, write *will have* and then the **past participle** of the verb. Regular verbs add *-ed*: *will have landed*. Irregular verbs have their own participles: *will have flown*, *will have begun*, *will have written*. The words *will have* stay the same for every subject.",
        "构成将来完成时，写 *will have*，再加动词的**过去分词**。规则动词加 *-ed*：*will have landed*。不规则动词有自己的过去分词：*will have flown*、*will have begun*、*will have written*。无论主语是什么，*will have* 都不变。",
      ],
      ["Type the future perfect of the verb in brackets.", "输入括号中动词的将来完成时。"],
      futureForm.map((r) =>
        typed(field(r, 0), field(r, 2), field(r, 3).split(","), undefined, t(`The verb is *${field(r, 1)}*.`, `动词是 *${field(r, 1)}*。`)),
      ),
      (right) => [
        `The future perfect is *will have* with the past participle: **${right}**.`,
        `将来完成时是 *will have* 加过去分词：**${right}**。`,
      ],
    ),
  ],
});

// Complete comparisons.
const comparisonLabels: Record<string, Label> = {
  "unlike things": {
    zh: "比较对象不对等",
    why: [
      "It compares a thing of one with the whole of the other, so it needs a word such as *those of* or a possessive.",
      "它把一方的某样东西和另一方整体相比，需要加 *those of* 或所有格。",
    ],
    not: ["The two things it compares are of the same kind, so that is not the problem.", "它比较的两样东西是同类的，所以问题不在这里。"],
  },
  "one side missing": {
    zh: "缺少比较的另一方",
    why: ["It says *more* or *bigger* but never names what it is compared with.", "它说了 *more* 或 *bigger*，却没有说出和什么比。"],
    not: ["Both sides of the comparison are named, so nothing is missing.", "比较的双方都说出来了，没有缺少。"],
  },
  "then for than": {
    zh: "把 than 写成了 then",
    why: ["A comparison needs *than*; *then* is a word of time.", "比较要用 *than*；*then* 是表示时间的词。"],
    not: ["The word after the comparative is already *than*.", "比较级后面已经是 *than* 了。"],
  },
  complete: {
    zh: "完整的比较",
    why: [
      "Both things are named and alike in kind, and *than* follows the comparative.",
      "双方都说出来了，而且是同类，比较级后面也用了 *than*。",
    ],
    not: ["Something in it is wrong, so it is not complete.", "其中有错误，所以不完整。"],
  },
};
/** compareOwners are pairs of people; compareThings are a thing and a comparative, then things and a comparative. */
const compareOwners = [
  ["Maria", "Leo"],
  ["Grandpa", "Dad"],
  ["Kim", "Omar"],
  ["Aunt Rosa", "Uncle Ben"],
  ["Nora", "Sam"],
  ["Mrs. Diaz", "Mr. Park"],
] as const;
const compareThings = [
  ["bike", "faster"],
  ["garden", "bigger"],
  ["voice", "louder"],
  ["kitchen", "cleaner"],
  ["handwriting", "neater"],
  ["dog", "friendlier"],
] as const;
const compareMany = [
  ["shoes", "newer"],
  ["cookies", "sweeter"],
  ["drawings", "more colorful"],
  ["answers", "longer"],
  ["plants", "taller"],
  ["photos", "sharper"],
] as const;
const compareOne = everyPair(compareOwners, compareThings).map(([[a, b], [thing, more]]) => ({
  complete: `${a}'s ${thing} is ${more} than ${b}'s.`,
  unlike: `${a}'s ${thing} is ${more} than ${b}.`,
  missing: `${a}'s ${thing} is ${more}.`,
  thenForThan: `${a}'s ${thing} is ${more} then ${b}'s.`,
}));
const compareTwo = everyPair(compareOwners, compareMany).map(([[a, b], [things, more]]) => ({
  complete: `The ${things} of ${a} are ${more} than those of ${b}.`,
  unlike: `The ${things} of ${a} are ${more} than ${b}.`,
  missing: `The ${things} of ${a} are ${more}.`,
  thenForThan: `The ${things} of ${a} are ${more} then those of ${b}.`,
}));
const comparisonLines = `
${compareOne.map((c) => `${c.complete}|complete\n${c.unlike}|unlike things\n${c.missing}|one side missing\n${c.thenForThan}|then for than`).join("\n")}
  Jupiter's moons outnumber Earth.|unlike things
  The rings of Saturn are wider than Jupiter.|unlike things
  Mars's day is a little longer than Earth.|unlike things
  The surface of Venus is hotter than Mercury.|unlike things
  The orbit of Neptune is longer than Uranus.|unlike things
  Our telescope's lens is bigger than the school.|unlike things
  The new rocket is much more powerful.|one side missing
  This photo of the moon is clearer.|one side missing
  The giant planets are colder.|one side missing
  The second launch went more smoothly.|one side missing
  Her report has more facts.|one side missing
  The red star looks brighter.|one side missing
  Saturn is lighter then water.|then for than
  The sun is bigger then all the planets together.|then for than
  A day on Venus is longer then its year.|then for than
  Mercury moves faster then any other planet.|then for than
  The moon is closer then the sun.|then for than
  Pluto is smaller then our moon.|then for than
  Jupiter's moons outnumber Earth's.|complete
  The rings of Saturn are wider than those of Jupiter.|complete
  Mars's day is a little longer than Earth's.|complete
  The new rocket is more powerful than the old one.|complete
  This photo of the moon is clearer than the last one.|complete
  Saturn is lighter than water.|complete
  The giant planets are colder than the rocky ones.|complete
  Mercury moves faster than any other planet.|complete
  The surface of Venus is hotter than that of Mercury.|complete
  Pluto is smaller than our moon.|complete
  The red star looks brighter than the blue one.|complete
  Her report has more facts than mine.|complete
`;
const completeLines = rows(`${[...compareOne, ...compareTwo]
  .map((c, k) => {
    const [x, y] = k % 3 === 0 ? [c.unlike, c.thenForThan] : k % 3 === 1 ? [c.unlike, c.missing] : [c.missing, c.thenForThan];
    return `${c.complete}|${x}|${y}`;
  })
  .join("\n")}\n
  Jupiter has more moons than Earth has.|Jupiter has more moons then Earth.|Jupiter has more moons.
  The rings of Saturn are wider than those of Jupiter.|The rings of Saturn are wider than Jupiter.|The rings of Saturn are wider then Jupiter's.
  A day on Mars is longer than a day on Earth.|A day on Mars is longer than Earth.|A day on Mars is longer.
  The surface of Venus is hotter than that of Mercury.|The surface of Venus is hotter than Mercury.|The surface of Venus is hotter then Mercury's.
  The new rocket is more powerful than the old one.|The new rocket is more powerful.|The new rocket is more powerful then the old one.
  Saturn is lighter than water.|Saturn is lighter then water.|Saturn is more lighter than water.
  The moon is closer to us than the sun is.|The moon is closer to us then the sun.|The moon is closer to us.
  Neptune's winds are faster than Earth's.|Neptune's winds are faster than Earth.|Neptune's winds are faster.
  Pluto is smaller than our moon.|Pluto is smaller then our moon.|Pluto is more smaller than our moon.
  The gas giants are colder than the rocky planets.|The gas giants are colder.|The gas giants are colder then the rocky planets.
  The orbit of Mars is longer than that of Earth.|The orbit of Mars is longer than Earth.|The orbit of Mars is longer.
  Her telescope is stronger than mine.|Her telescope is stronger than me.|Her telescope is stronger.
  This year's launch went better than last year's.|This year's launch went better than last year.|This year's launch went more better.
  The sun's light reaches us faster than sound could.|The sun's light reaches us faster then sound could.|The sun's light reaches us faster.
  Mercury's craters are deeper than the moon's.|Mercury's craters are deeper than the moon.|Mercury's craters are deeper.
  Venus spins more slowly than any other planet.|Venus spins more slowly then any other planet.|Venus spins more slowly.
  My model of Saturn is bigger than Leo's.|My model of Saturn is bigger than Leo.|My model of Saturn is bigger.
  The comet's tail was brighter than its head.|The comet's tail was brighter then its head.|The comet's tail was brighter.
  Uranus's tilt is greater than Earth's.|Uranus's tilt is greater than Earth.|Uranus's tilt is greater.
  The probe's photos are sharper than the telescope's.|The probe's photos are sharper than the telescope.|The probe's photos are sharper.
  Jupiter is larger than all the other planets put together.|Jupiter is larger then all the other planets put together.|Jupiter is larger.
  A year on Neptune lasts longer than a human life.|A year on Neptune lasts longer then a human life.|A year on Neptune lasts longer.
  The air on Mars is thinner than the air on Earth.|The air on Mars is thinner than Earth.|The air on Mars is thinner.
  Our class's rocket flew higher than the other class's.|Our class's rocket flew higher than the other class.|Our class's rocket flew higher.
  Titan's clouds are thicker than Earth's.|Titan's clouds are thicker than Earth.|Titan's clouds are thicker.
  The big dish hears signals better than the small one.|The big dish hears signals better then the small one.|The big dish hears signals better.
  Mars is farther from the sun than Earth is.|Mars is farther from the sun then Earth is.|Mars is farther from the sun.
  The seasons of Mars are longer than ours.|The seasons of Mars are longer than us.|The seasons of Mars are longer.
  The new map of the moon is more detailed than the old map.|The new map of the moon is more detailed.|The new map of the moon is more detailed then the old map.
  A spacesuit's gloves are thicker than a skier's.|A spacesuit's gloves are thicker than a skier.|A spacesuit's gloves are thicker.
`);
const mistakeOf = (s: string): Pair =>
  /\bthen\b/.test(s)
    ? ["it uses *then*, a word of time, where a comparison needs *than*", "它用了表示时间的 *then*，比较要用 *than*"]
    : /\bmore (smaller|lighter|better)\b/.test(s)
      ? ["it puts *more* before a comparative that already ends in *-er* or is *better*", "它在已经是比较级的词前又加了 *more*"]
      : /\bthan\b/.test(s)
        ? ["it compares a thing of one side with the whole of the other side", "它把一方的某样东西和另一方整体相比"]
        : ["it never says what the thing is compared with", "它没有说出和什么比"];

const completeComparisons = topic("grammar", {
  id: "complete-comparisons",
  title: ["Complete Comparisons", "完整的比较"],
  summary: [
    "A comparison names both things compared, compares like with like (Jupiter's moons outnumber Earth's) and puts than after the comparative.",
    "比较要说出比较的双方，同类相比（Jupiter's moons outnumber Earth's），比较级后用 than。",
  ],
  after: ["adverbs-that-compare"],
  points: [
    label(
      "what-is-wrong-with-a-comparison",
      ["What Is Wrong with a Comparison", "比较句错在哪里"],
      [
        "A complete comparison does three things. It names **both** things compared: *more powerful than the old one*, not just *more powerful*. It compares **like with like**: the moons of Jupiter with the moons of Earth (*Earth's*), not with Earth itself. And it uses **than**, not the time word *then*, after the comparative.",
        "完整的比较做到三点：说出比较的**双方**：*more powerful than the old one*，而不只是 *more powerful*；**同类相比**：木星的卫星和地球的卫星（*Earth's*）比，而不是和地球本身比；比较级后用 **than**，不用表示时间的 *then*。",
      ],
      ["What is wrong with this comparison, if anything?", "这个比较句有什么问题（如果有的话）？"],
      comparisonLines,
      comparisonLabels,
    ),
    point(
      "choosing-the-complete-comparison",
      t("Choosing the Complete Version", "选择完整的版本"),
      t(
        "To fix a comparison, check each side. If one side is missing, add *than* and the second thing. If the sides are unlike, make the second one match the first with a possessive (*Earth's*) or with *that of* or *those of*. Then make sure the word before the second thing is *than*.",
        "修改比较句时，逐一检查双方。缺少一方，就加上 *than* 和另一方。双方不对等，就用所有格（*Earth's*）或 *that of*、*those of* 让第二方与第一方对应。最后确认第二方前面的词是 *than*。",
      ),
      choiceGenerator(
        t("Which sentence makes a complete comparison?", "哪个句子是完整的比较？"),
        completeLines.map((r): ChoiceItem => ["Check both sides of each version.", field(r, 0), [field(r, 1), field(r, 2)]]),
        (right) =>
          t(
            `**${right}** names both things, compares things of the same kind and uses *than*.`,
            `**${right}** 说出了比较的双方，同类相比，并用了 *than*。`,
          ),
        (wrong) => {
          const [en, zh] = mistakeOf(wrong);
          return t(`Not *${wrong}*: ${en}.`, `不是 *${wrong}*：${zh}。`);
        },
      ),
    ),
  ],
});

// Capitals for events, eras and groups: the right sentence, a version with too few capitals, one with too many.
/** historyNames are a name, the name with no capitals, the name missing one capital, and the word that needs it. */
const historyNames = [
  ["the Stone Age", "the stone age", "the stone Age", "stone"],
  ["the Olympic Games", "the olympic games", "the olympic Games", "olympic"],
  ["the Middle Ages", "the middle ages", "the middle Ages", "middle"],
  ["the Ice Age", "the ice age", "the ice Age", "ice"],
  ["the Bronze Age", "the bronze age", "the bronze Age", "bronze"],
  ["the Iron Age", "the iron age", "the iron Age", "iron"],
  ["the Renaissance", "the renaissance", "the renaissance", "renaissance"],
  ["the Romans", "the romans", "the romans", "romans"],
  ["the Vikings", "the vikings", "the vikings", "vikings"],
  ["the Aztecs", "the aztecs", "the aztecs", "aztecs"],
  ["the Battle of Hastings", "the battle of Hastings", "the battle of Hastings", "battle"],
  ["the Gold Rush", "the gold rush", "the gold Rush", "gold"],
  ["the Boston Tea Party", "the boston tea party", "the Boston tea Party", "tea"],
  ["the Industrial Revolution", "the industrial revolution", "the industrial Revolution", "industrial"],
  ["the Great Depression", "the great depression", "the Great depression", "depression"],
  ["the Mayans", "the mayans", "the mayans", "mayans"],
  ["the Incas", "the incas", "the incas", "incas"],
  ["the Space Age", "the space age", "the space Age", "space"],
  ["the Cold War", "the cold war", "the cold War", "cold"],
  ["the Pilgrims", "the pilgrims", "the pilgrims", "pilgrims"],
] as const;
/** historyFrames are a sentence, the same with a common word capitalized, and two common words in it. */
const historyFrames = [
  ["Our class read a book about {X}.", "Our Class read a book about {X}.", "class", "book"],
  ["My uncle told us a story about {X}.", "My uncle told us a Story about {X}.", "uncle", "story"],
  ["The museum has a whole room about {X}.", "The museum has a whole Room about {X}.", "museum", "room"],
  ["We made a poster about {X} for history class.", "We made a Poster about {X} for history class.", "poster", "history"],
] as const;
const historyCross = everyPair(historyNames, historyFrames);
const capitalLines = rows(`${historyCross
  .map(([[name, none], [frame, many]]) => `${frame.replace("{X}", name)}|${frame.replace("{X}", none)}|${many.replace("{X}", name)}`)
  .join("\n")}\n
  The first Olympic Games were held in Greece.|The first olympic games were held in Greece.|The First Olympic Games were held in Greece.
  The Greeks built temples of stone.|The greeks built temples of stone.|The Greeks built Temples of stone.
  The Parthenon stands above Athens.|The parthenon stands above Athens.|The Parthenon stands above Athens' City.
  People of the Bronze Age made tools of metal.|People of the bronze age made tools of metal.|People of the Bronze Age made Tools of metal.
  Many children in Athens learned to read Greek.|Many children in Athens learned to read greek.|Many Children in Athens learned to read Greek.
  The Persian Wars lasted for many years.|The persian wars lasted for many years.|The Persian Wars lasted for many Years.
  The Spartans trained as soldiers from childhood.|The spartans trained as soldiers from childhood.|The Spartans trained as Soldiers from childhood.
  The Golden Age of Athens was a time of great art.|The golden age of Athens was a time of great art.|The Golden Age of Athens was a Time of great art.
  The Romans later copied Greek statues.|The romans later copied greek statues.|The Romans later copied Greek Statues.
  Plays were held in the Theater of Dionysus.|Plays were held in the theater of Dionysus.|Plays were held in the Theater of Dionysus at Night.
  The Trojan War is told in a long poem.|The trojan war is told in a long poem.|The Trojan War is told in a Long Poem.
  The Middle Ages came long after ancient Greece.|The middle ages came long after ancient Greece.|The Middle Ages came long after Ancient Greece.
  The Egyptians traded grain with the Greeks.|The egyptians traded grain with the greeks.|The Egyptians traded Grain with the Greeks.
  The Acropolis Museum holds statues from the hill.|The acropolis museum holds statues from the hill.|The Acropolis Museum holds statues from the Hill.
  Some Greeks spoke Latin as well as Greek.|Some greeks spoke latin as well as Greek.|Some Greeks spoke Latin as well as Greek Words.
  The Stone Age lasted far longer than any other age.|The stone age lasted far longer than any other age.|The Stone Age lasted far longer than any other Age.
  The Temple of Zeus was one of the wonders of the world.|The temple of Zeus was one of the wonders of the world.|The Temple of Zeus was one of the Wonders of the World.
  The Battle of Marathon was fought in 490 BCE.|The battle of Marathon was fought in 490 BCE.|The Battle of Marathon was Fought in 490 BCE.
  The Phoenicians gave the Greeks an alphabet.|The phoenicians gave the greeks an alphabet.|The Phoenicians gave the Greeks an Alphabet.
  The Iron Age followed the Bronze Age.|The iron age followed the bronze age.|The Iron Age followed the Bronze Age Period.
  The Olympic Games were held every four years.|The olympic games were held every four years.|The Olympic Games were held every four Years.
  The Athenians voted in the Assembly.|The athenians voted in the assembly.|The Athenians Voted in the Assembly.
  The Great Library of Alexandria held thousands of scrolls.|The great library of Alexandria held thousands of scrolls.|The Great Library of Alexandria held Thousands of scrolls.
  The Renaissance brought new interest in Greek art.|The renaissance brought new interest in greek art.|The Renaissance brought New Interest in Greek art.
  Today, Greeks still celebrate Independence Day in March.|Today, greeks still celebrate independence day in March.|Today, Greeks still Celebrate Independence Day in March.
  The Peloponnesian War split the Greek world.|The peloponnesian war split the Greek world.|The Peloponnesian War split the Greek World.
  The Macedonians conquered the city-states.|The macedonians conquered the city-states.|The Macedonians conquered the City-States.
  The Colosseum is Roman, not Greek.|The colosseum is roman, not greek.|The Colosseum is Roman, not Greek Building.
  The Ice Age ended thousands of years ago.|The ice age ended thousands of years ago.|The Ice Age ended Thousands of Years ago.
  The Minoans lived on Crete before the Greeks.|The minoans lived on Crete before the greeks.|The Minoans lived on Crete before the Greeks Arrived.
`);
const fixLines = rows(`${historyCross
  .map(([[, , one, word], [frame, , c1, c2]]) => `${frame.replace("{X}", one)}|${word}|${c1}|${c2}`)
  .join("\n")}\n
  The first olympic games were held at Olympia.|olympic|first|held
  The greeks built their temples on hills.|greeks|temples|hills
  We visited the parthenon on our trip.|parthenon|trip|visited
  People of the bronze Age used metal tools.|bronze|people|tools
  Many athenians could read and write.|athenians|many|write
  The persian Wars changed Greece.|persian|changed|wars
  Children in sparta trained to fight.|sparta|children|fight
  Pericles led athens in its golden age.|athens|golden|led
  The trojan War is a story told by Homer.|trojan|story|told
  The romans admired Greek art.|romans|admired|art
  He is learning to speak greek.|greek|learning|speak
  The temple of Zeus stood at Olympia.|temple|stood|zeus
  The stone Age came before the Bronze Age.|stone|came|before
  The egyptians traded with Greece.|egyptians|traded|with
  The battle of Marathon was in 490 BCE.|battle|marathon|was
  Our class read a myth about the spartans.|spartans|myth|class
  The middle Ages came long after Greece.|middle|after|long
  The acropolis rises above the city.|acropolis|rises|city
  The phoenicians were sailors and traders.|phoenicians|sailors|traders
  The iron Age began about 1200 BCE.|iron|began|about
  The museum shows a statue from the golden Age.|golden|statue|museum
  The macedonians conquered Athens.|macedonians|conquered|athens
  Some Greeks moved to italy.|italy|moved|some
  The renaissance looked back to Greece.|renaissance|looked|back
  The minoans built a palace on Crete.|minoans|palace|built
  She wrote a report on the ice Age.|ice|report|wrote
  The Olympic games began in 776 BCE.|games|began|olympic
  The theater of Dionysus held big crowds.|theater|crowds|held
  A Greek named euclid wrote about numbers.|euclid|greek|numbers
  The great Library of Alexandria held scrolls.|great|scrolls|library
`);

const capitalsOfHistory = topic("grammar", {
  id: "capitals-for-events-and-eras",
  title: ["Capitals for Events, Eras and Groups", "历史事件、时代和群体名称的大写"],
  summary: [
    "Names of historical events, eras, peoples, languages and buildings take capitals (the Olympic Games, the Bronze Age, the Greeks), but common words do not.",
    "历史事件、时代、民族、语言和建筑的名称要大写（the Olympic Games、the Bronze Age、the Greeks），普通名词不大写。",
  ],
  after: ["capitalizing-names-and-titles"],
  points: [
    choose(
      "which-words-need-capitals",
      ["Which Words Need Capitals", "哪些词要大写"],
      [
        "Each important word of a name takes a capital: historical **events** (*the Persian Wars*), **eras** (*the Bronze Age*), **peoples** (*the Greeks*), **languages** (*Greek*) and named **buildings** (*the Parthenon*). Common words stay small: *an age*, *a temple*, *a war*, *soldiers*. Small words inside a name, such as *of* and *the*, stay small too.",
        "名称中每个重要的词都要大写：历史**事件**（*the Persian Wars*）、**时代**（*the Bronze Age*）、**民族**（*the Greeks*）、**语言**（*Greek*）和有名称的**建筑**（*the Parthenon*）。普通名词小写：*an age*、*a temple*、*a war*、*soldiers*。名称中的 *of*、*the* 等小词也小写。",
      ],
      ["Which sentence uses capitals correctly?", "哪个句子的大写正确？"],
      capitalLines.map((r): ChoiceItem => ["Check each name in the three versions.", field(r, 0), [field(r, 1), field(r, 2)]]),
      (right) => [
        `In **${right}** every name of an event, era, people, language or building has a capital, and the common words do not.`,
        `在 **${right}** 中，事件、时代、民族、语言或建筑的名称都大写了，普通名词没有大写。`,
      ],
      [
        ["*{wrong}* leaves a name of history without its capital.", "*{wrong}* 有一个历史名称没有大写。"],
        ["*{wrong}* gives a capital to a common word that is not part of a name.", "*{wrong}* 把一个不属于名称的普通名词大写了。"],
      ],
    ),
    choose(
      "fixing-a-capital",
      ["Fixing a Missing Capital", "改正漏掉的大写"],
      [
        "To fix a sentence, find the word that is part of a name but has a small letter. Ask whether it names one particular event, era, people, language or building. *The bronze Age* is one particular era, so *Bronze* needs a capital; in *a long age*, *age* is a common word and stays small.",
        "改句子时，找出属于名称却没有大写的词。问问它是否指某一个特定的事件、时代、民族、语言或建筑。*The bronze Age* 指一个特定的时代，所以 *Bronze* 要大写；*a long age* 里的 *age* 是普通名词，保持小写。",
      ],
      ["Which word of this sentence needs a capital?", "这个句子中哪个词需要大写？"],
      fixLines.map((r): ChoiceItem => [field(r, 0), field(r, 1), [field(r, 2), field(r, 3)]]),
      (right) => [
        `*${right}* is part of the name of a particular event, era, people, language, place or building, so it needs a capital.`,
        `*${right}* 是某个特定事件、时代、民族、语言、地点或建筑名称的一部分，所以要大写。`,
      ],
      [
        [
          "*{wrong}* is a common word here, so it stays small; the word that needs a capital is *{right}*.",
          "*{wrong}* 在这里是普通词，保持小写；需要大写的是 *{right}*。",
        ],
        [
          "*{wrong}* is either a common word or already right; look for *{right}*.",
          "*{wrong}* 要么是普通词，要么已经正确；需要大写的是 *{right}*。",
        ],
      ],
    ),
  ],
});

// Indefinite pronouns.
const pronounLabels: Record<string, Label> = {
  singular: {
    zh: "单数",
    why: [
      "It means one at a time, so it takes a singular verb such as *has* or *is*.",
      "它指一个一个的人或物，所以用单数动词，如 *has* 或 *is*。",
    ],
    not: ["It does not mean one at a time.", "它并不指单个的人或物。"],
  },
  plural: {
    zh: "复数",
    why: [
      "It always means more than one, so it takes a plural verb such as *have* or *are*.",
      "它总是指多于一个，所以用复数动词，如 *have* 或 *are*。",
    ],
    not: ["It does not always mean more than one.", "它并不总是指多于一个。"],
  },
  "either one": {
    zh: "两者皆可",
    why: [
      "It can be singular or plural: the noun after *of* decides (*some of the bread is*, *some of the loaves are*).",
      "它可以是单数也可以是复数，由 *of* 后的名词决定（*some of the bread is*，*some of the loaves are*）。",
    ],
    not: ["It is always one number, not decided by the noun after it.", "它的单复数是固定的，不由后面的名词决定。"],
  },
};
/** indefiniteNouns are plural nouns with an adjective, and mass nouns with an adjective. */
const indefinitePlural = [
  ["players", "ready"],
  ["cookies", "burnt"],
  ["windows", "open"],
  ["students", "here"],
  ["kittens", "asleep"],
  ["trees", "tall"],
] as const;
const indefiniteMass = [
  ["milk", "sour"],
  ["sand", "wet"],
  ["homework", "finished"],
  ["bread", "stale"],
] as const;
const indefiniteCross = [
  ...everyPair(["each", "either", "neither", "one"], indefinitePlural).map(
    ([p, [n, adj]]) => [`${p} of the ${n}`, `${p} of the ${n} ___ ${adj}.`, "is", "are", "be", "singular"] as const,
  ),
  ...everyPair(["both", "few", "many", "several"], indefinitePlural).map(
    ([p, [n, adj]]) => [`${p} of the ${n}`, `${p} of the ${n} ___ ${adj}.`, "are", "is", "be", "plural"] as const,
  ),
  ...everyPair(["some", "all", "most", "none"], indefinitePlural).map(
    ([p, [n, adj]]) => [`${p} of the ${n}`, `${p} of the ${n} ___ ${adj}.`, "are", "is", "be", "either one"] as const,
  ),
  ...everyPair(["some", "all", "most", "none"], indefiniteMass).map(
    ([p, [n, adj]]) => [`${p} of the ${n}`, `${p} of the ${n} ___ ${adj}.`, "is", "are", "be", "either one"] as const,
  ),
];
const pronounLines = `
${indefiniteCross.map(([phrase, , , , , kind]) => `${phrase}|${kind}`).join("\n")}
  everyone|singular
  each of the citizens|singular
  nobody|singular
  someone|singular
  everybody in the assembly|singular
  either of the speakers|singular
  neither of the generals|singular
  anyone in Athens|singular
  no one|singular
  something|singular
  each|singular
  everything|singular
  both|plural
  both of the cities|plural
  few|plural
  few of the slaves|plural
  many|plural
  many of the athletes|plural
  several|plural
  several of the temples|plural
  others|plural
  some of the olive oil|either one
  some of the soldiers|either one
  all of the wine|either one
  all of the ships|either one
  most of the land|either one
  most of the farmers|either one
  none of the water|either one
  none of the votes|either one
  any of the food|either one
`;
const agreeLines = rows(`${indefiniteCross
  .map(([, shown, right, w1, w2, kind]) => `${shown.charAt(0).toUpperCase()}${shown.slice(1)}|${right}|${w1}|${w2}|${kind}`)
  .join("\n")}\n
  Each of the citizens ___ a vote.|has|have|having|singular
  Everyone in the assembly ___ to speak.|wants|want|wanting|singular
  Nobody ___ the answer to the riddle.|knows|know|knowing|singular
  Someone ___ left a scroll on the bench.|has|have|having|singular
  Either of the plans ___ good.|is|are|be|singular
  Neither of the runners ___ tired.|was|were|being|singular
  Everybody ___ to see the games.|hopes|hope|hoping|singular
  No one ___ in Sparta without training.|lives|live|living|singular
  Each of the girls brought ___ own lamp.|her|their|its|singular
  Everyone in the boys' class did ___ best.|his|their|its|singular
  Both of the cities ___ strong walls.|have|has|having|plural
  Few of the farmers ___ rich.|were|was|being|plural
  Many of the athletes ___ from far away.|come|comes|coming|plural
  Several of the temples ___ still standing.|are|is|be|plural
  Both of the sisters lost ___ sandals.|their|her|its|plural
  Many of the soldiers carried ___ own shields.|their|his|its|plural
  Few of the ships made ___ way home.|their|its|his|plural
  Several of the boys ___ the race.|win|wins|winning|plural
  Others ___ that the oracle was wrong.|say|says|saying|plural
  Both of the speakers ___ for an hour.|talk|talks|talking|plural
  Some of the olive oil ___ spilled.|was|were|are|either one
  Some of the soldiers ___ asleep.|were|was|is|either one
  All of the wine ___ gone.|is|are|were|either one
  All of the ships ___ in the harbor.|are|is|was|either one
  Most of the land ___ rocky.|is|are|were|either one
  Most of the farmers ___ olives.|grow|grows|growing|either one
  None of the water ___ clean.|was|were|are|either one
  Some of the bread ___ eaten.|was|were|are|either one
  Most of the citizens ___ the new law.|like|likes|liking|either one
  All of the money ___ in the treasury.|is|are|were|either one
`);
const agreeKind = (shown: string) => agreeLines.find((r) => r[0] === shown)?.[4] ?? "singular";

const indefinitePronouns = topic("grammar", {
  id: "indefinite-pronouns-and-agreement",
  title: ["Indefinite Pronouns and Agreement", "不定代词与一致"],
  summary: [
    "Everyone, each, nobody and someone are singular; both, few, many and several are plural; some, all, most and none depend on the noun after them.",
    "everyone、each、nobody、someone 是单数；both、few、many、several 是复数；some、all、most、none 取决于后面的名词。",
  ],
  after: ["subject-verb-agreement", "pronoun-antecedent-agreement"],
  points: [
    label(
      "singular-or-plural-pronoun",
      ["Singular or Plural", "单数还是复数"],
      [
        "An **indefinite pronoun** names people or things without saying exactly which. Pronouns that mean one at a time are **singular**: *everyone, each, nobody, someone, either, neither*. Pronouns that mean more than one are **plural**: *both, few, many, several*. *Some, all, most, none* and *any* can be **either**: the noun after *of* decides.",
        "**不定代词**泛指人或事物，不确指是哪一个。表示一个一个的是**单数**：*everyone, each, nobody, someone, either, neither*。表示多于一个的是**复数**：*both, few, many, several*。*some, all, most, none* 和 *any* **两者皆可**：由 *of* 后的名词决定。",
      ],
      ["Is this subject singular, plural or either one?", "这个主语是单数、复数，还是两者皆可？"],
      pronounLines,
      pronounLabels,
    ),
    choose(
      "verbs-and-pronouns-that-agree",
      ["Verbs and Pronouns That Agree", "一致的动词和代词"],
      [
        "The verb and any later pronoun agree with the indefinite pronoun, not with the noun after *of*: *Each of the citizens **has** a vote*, because *each* is singular. *Both of the cities **have** walls*. With *some, all, most* and *none*, look at the noun: *Most of the land **is** rocky*, but *Most of the farmers **grow** olives*.",
        "动词和后面的代词要与不定代词一致，而不是与 *of* 后的名词一致：*Each of the citizens **has** a vote*，因为 *each* 是单数。*Both of the cities **have** walls*。遇到 *some, all, most, none* 时看后面的名词：*Most of the land **is** rocky*，但 *Most of the farmers **grow** olives*。",
      ],
      ["Which word agrees with the subject?", "哪个词与主语一致？"],
      agreeLines.map((r): ChoiceItem => [field(r, 0), field(r, 1), [field(r, 2), field(r, 3)]]),
      (right, shown) => {
        const kind = agreeKind(shown);
        return kind === "either one"
          ? [
              `The pronoun takes the number of the noun after *of*, so the sentence needs **${right}**.`,
              `这个代词的单复数取决于 *of* 后的名词，所以要用 **${right}**。`,
            ]
          : [
              `The subject is ${kind}, so the word that agrees with it is **${right}**.`,
              `主语是${kind === "singular" ? "单数" : "复数"}，所以与之一致的是 **${right}**。`,
            ];
      },
      [
        ["*{wrong}* agrees with the wrong number; the subject needs **{right}**.", "*{wrong}* 的单复数不对；主语需要 **{right}**。"],
        ["*{wrong}* is not a form that can complete the sentence here.", "*{wrong}* 这个形式在这里不能使句子完整。"],
      ],
    ),
  ],
});

/** grammarTopics5a are the topics of grammar, usage and spelling of the first five units of grade 5. */
export const grammarTopics5a: readonly TopicDef[] = [
  fewerOrLess,
  ableOrIble,
  greekSpellings,
  becauseOrBecauseOf,
  futurePerfect,
  completeComparisons,
  capitalsOfHistory,
  indefinitePronouns,
];
