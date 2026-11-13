// IELTS Reading: sentence completion with words from the text, and summary completion with words from a box. Each
// short text carries three sentences to complete and three gaps of a summary, so that a learner first copies a word
// the text uses and then finds the word that says the same in other words.

import { type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { examTopic, interleave, type SolvedChoice, solvedChoiceGenerator } from "./kit.ts";

/** end gives the period a quoted piece of evidence needs when it has no closing punctuation of its own. */
const end = (evidence: string) => (/[.!?…]$/u.test(evidence) ? "" : ".");

/** Gap is a sentence with a gap, its right word, wrong words and the words of the text that decide it. */
type Gap = readonly [sentence: string, right: string, wrong: readonly string[], evidence: string];

/** Completed is a short text with its sentences to complete and the gaps of its summary. */
interface Completed {
  readonly text: string;
  readonly sentences: readonly Gap[];
  readonly summary: readonly Gap[];
}

const texts: readonly Completed[] = [
  {
    text: "Bamboo is often called a tree, but it is in fact a type of grass. Some species can grow almost a metre in a single day, which makes bamboo one of the fastest-growing plants on Earth. Because it is both light and strong, it has long been used for scaffolding in parts of Asia, even on tall buildings. Builders value it because it bends in strong winds instead of breaking.",
    sentences: [
      [
        "Although it looks like a tree, bamboo is really a kind of ___.",
        "grass",
        ["species", "plant", "scaffolding"],
        "it is in fact a type of grass",
      ],
      [
        "In parts of Asia, bamboo is used to make ___ for building work.",
        "scaffolding",
        ["grass", "winds", "species"],
        "it has long been used for scaffolding",
      ],
      [
        "In strong winds, bamboo ___ rather than breaking.",
        "bends",
        ["grows", "breaks", "builds"],
        "it bends in strong winds instead of breaking",
      ],
    ],
    summary: [
      [
        "Bamboo grows extremely ___: up to a metre a day.",
        "quickly",
        ["slowly", "rarely", "strongly"],
        "Some species can grow almost a metre in a single day",
      ],
      [
        "Its combination of lightness and ___ explains its use in building.",
        "strength",
        ["height", "colour", "softness"],
        "Because it is both light and strong",
      ],
      [
        "Builders like it because it is ___ in high winds.",
        "flexible",
        ["fragile", "heavy", "expensive"],
        "it bends in strong winds instead of breaking",
      ],
    ],
  },
  {
    text: "In the 1950s, most children in Britain walked to school alone from the age of seven or eight. Today, fewer than one in four do. Researchers point to heavier traffic as the main reason, although parents also mention fears about strangers. Some cities have responded by closing streets near schools to cars for half an hour at the start and end of the day, and in these streets the number of children walking has risen sharply.",
    sentences: [
      [
        "Researchers believe the main cause of the change is heavier ___.",
        "traffic",
        ["strangers", "streets", "parents"],
        "Researchers point to heavier traffic as the main reason",
      ],
      [
        "Besides traffic, parents worry about ___.",
        "strangers",
        ["cars", "researchers", "schools"],
        "parents also mention fears about strangers",
      ],
      [
        "Some cities close streets near schools to ___ for half an hour.",
        "cars",
        ["children", "parents", "walkers"],
        "closing streets near schools to cars",
      ],
    ],
    summary: [
      [
        "Seventy years ago, young British children usually walked to school ___.",
        "unaccompanied",
        ["together", "late", "slowly"],
        "walked to school alone",
      ],
      [
        "The share of children walking alone has ___ to under a quarter.",
        "fallen",
        ["risen", "doubled", "stayed"],
        "Today, fewer than one in four do",
      ],
      [
        "Where streets are closed, walking to school has ___ considerably.",
        "increased",
        ["decreased", "stopped", "changed"],
        "the number of children walking has risen sharply",
      ],
    ],
  },
  {
    text: "Honeybees communicate the location of food through a movement known as the waggle dance. A bee returning to the hive moves in a figure of eight, shaking its body along the central line. The angle of this line shows the direction of the food in relation to the sun, while the length of the shaking tells other bees how far away it is. The dance was first explained by the Austrian scientist Karl von Frisch, who received a Nobel Prize for his work.",
    sentences: [
      [
        "Bees use the waggle dance to show other bees where to find ___.",
        "food",
        ["hives", "sun", "prizes"],
        "communicate the location of food",
      ],
      [
        "The direction of the food is shown by the ___ of the central line.",
        "angle",
        ["length", "shape", "speed"],
        "The angle of this line shows the direction of the food",
      ],
      [
        "The ___ of the shaking shows the distance to the food.",
        "length",
        ["angle", "direction", "figure"],
        "the length of the shaking tells other bees how far away it is",
      ],
    ],
    summary: [
      [
        "The dance follows a ___ pattern shaped like the number eight.",
        "repeated",
        ["random", "straight", "silent"],
        "moves in a figure of eight",
      ],
      ["The direction is given relative to the position of the ___.", "sun", ["hive", "moon", "flower"], "in relation to the sun"],
      [
        "The scientist who explained the dance was later ___ for it.",
        "honoured",
        ["criticised", "ignored", "replaced"],
        "who received a Nobel Prize for his work",
      ],
    ],
  },
  {
    text: "Before refrigerators, people in cold countries cut blocks of ice from frozen lakes in winter and stored them in ice houses. These were buildings partly underground, with thick walls and a layer of straw or sawdust around the ice. Packed in this way, ice could last until the end of summer. In the nineteenth century, ice from North American lakes was even shipped to India and the Caribbean.",
    sentences: [
      ["In winter, ice was cut from frozen ___.", "lakes", ["houses", "walls", "ships"], "cut blocks of ice from frozen lakes in winter"],
      ["Ice houses were built partly ___.", "underground", ["overseas", "outdoors", "upstairs"], "These were buildings partly underground"],
      ["The ice was surrounded by straw or ___.", "sawdust", ["sand", "water", "snow"], "a layer of straw or sawdust around the ice"],
    ],
    summary: [
      ["The ice houses kept ice ___ for several months.", "frozen", ["warm", "clean", "hidden"], "ice could last until the end of summer"],
      ["Their walls were ___ to keep out heat.", "thick", ["thin", "painted", "glass"], "with thick walls"],
      [
        "Ice was even ___ to tropical countries.",
        "exported",
        ["imported", "melted", "banned"],
        "ice from North American lakes was even shipped to India and the Caribbean",
      ],
    ],
  },
  {
    text: "A study of 2,000 office workers found that people who sat near a window slept on average 46 minutes longer each night than those who did not. The researchers believe that natural light during the day helps the body keep a regular rhythm of sleeping and waking. They recommend that offices place desks near windows where possible and that workers spend part of their lunch break outdoors.",
    sentences: [
      [
        "Workers near a window slept about 46 minutes longer each ___.",
        "night",
        ["day", "week", "break"],
        "slept on average 46 minutes longer each night",
      ],
      [
        "Natural light helps the body keep a regular ___.",
        "rhythm",
        ["break", "desk", "study"],
        "keep a regular rhythm of sleeping and waking",
      ],
      [
        "The researchers suggest spending part of the lunch break ___.",
        "outdoors",
        ["asleep", "indoors", "alone"],
        "spend part of their lunch break outdoors",
      ],
    ],
    summary: [
      [
        "The study ___ the sleep of office workers who sat in different places.",
        "compared",
        ["ignored", "shortened", "disturbed"],
        "people who sat near a window slept ... longer ... than those who did not",
      ],
      ["Daylight seems to make sleep more ___.", "regular", ["difficult", "expensive", "noisy"], "helps the body keep a regular rhythm"],
      [
        "The researchers advise offices to ___ desks near windows.",
        "position",
        ["remove", "replace", "paint"],
        "place desks near windows where possible",
      ],
    ],
  },
  {
    text: "The first public libraries in Britain opened in the 1850s, after a law allowed towns to use local taxes to pay for them. Supporters argued that free access to books would improve the education of working people. Opponents complained about the cost, and many towns waited decades before opening a library. By 1900, however, there were more than 300 public libraries across the country.",
    sentences: [
      [
        "Towns could pay for libraries with local ___.",
        "taxes",
        ["books", "laws", "decades"],
        "a law allowed towns to use local taxes to pay for them",
      ],
      [
        "Supporters hoped libraries would improve the ___ of working people.",
        "education",
        ["taxes", "cost", "health"],
        "would improve the education of working people",
      ],
      [
        "People who were against libraries complained about the ___.",
        "cost",
        ["books", "law", "education"],
        "Opponents complained about the cost",
      ],
    ],
    summary: [
      [
        "A change in the ___ made public libraries possible.",
        "law",
        ["tax", "weather", "school"],
        "after a law allowed towns to use local taxes",
      ],
      [
        "Many towns were ___ to open a library.",
        "slow",
        ["quick", "forced", "proud"],
        "many towns waited decades before opening a library",
      ],
      [
        "By the end of the century, libraries had become ___.",
        "widespread",
        ["rare", "private", "expensive"],
        "By 1900, however, there were more than 300 public libraries across the country",
      ],
    ],
  },
  {
    text: "Coral reefs cover less than one per cent of the ocean floor, yet they are home to about a quarter of all marine species. Corals are tiny animals that live together with algae, which give them food and their bright colours. When the water becomes too warm, the corals push the algae out and turn white, a process called bleaching. If temperatures fall again quickly, the corals can recover.",
    sentences: [
      [
        "About a quarter of all marine ___ live on coral reefs.",
        "species",
        ["algae", "corals", "floors"],
        "home to about a quarter of all marine species",
      ],
      [
        "Algae give corals food and their bright ___.",
        "colours",
        ["species", "temperatures", "reefs"],
        "which give them food and their bright colours",
      ],
      [
        "When corals lose their algae and turn white, this is called ___.",
        "bleaching",
        ["warming", "recovering", "colouring"],
        "a process called bleaching",
      ],
    ],
    summary: [
      [
        "Reefs occupy a very ___ part of the sea floor.",
        "small",
        ["large", "deep", "dark"],
        "cover less than one per cent of the ocean floor",
      ],
      [
        "Corals and algae ___ each other.",
        "depend on",
        ["attack", "avoid", "replace"],
        "Corals are tiny animals that live together with algae, which give them food",
      ],
      [
        "Bleached corals may ___ if the water cools soon.",
        "survive",
        ["disappear", "grow", "move"],
        "If temperatures fall again quickly, the corals can recover",
      ],
    ],
  },
  {
    text: "Many airports now use facial recognition to check passengers' identity at the gate. A camera compares the traveller's face with the photograph stored in their passport, which takes only a few seconds. Airlines say the system reduces queues and makes boarding faster. Privacy groups, however, are concerned about how long the images are kept and who is allowed to see them.",
    sentences: [
      [
        "A camera compares the passenger's face with the photograph in their ___.",
        "passport",
        ["gate", "camera", "airline"],
        "the photograph stored in their passport",
      ],
      ["According to airlines, the system reduces ___.", "queues", ["images", "cameras", "passports"], "the system reduces queues"],
      [
        "Privacy groups want to know how long the ___ are kept.",
        "images",
        ["queues", "seconds", "passengers"],
        "how long the images are kept",
      ],
    ],
    summary: [
      ["The identity check is very ___, lasting only seconds.", "quick", ["slow", "costly", "rare"], "which takes only a few seconds"],
      ["Airlines claim it ___ the boarding process.", "speeds up", ["slows down", "replaces", "complicates"], "makes boarding faster"],
      [
        "Some groups have ___ about the storage of the photos.",
        "doubts",
        ["hopes", "jokes", "rules"],
        "Privacy groups, however, are concerned",
      ],
    ],
  },
  {
    text: "Glass was first made in the Middle East more than 4,000 years ago, probably by accident when sand was heated with ash in a fire. For centuries, glass objects were small and expensive. The invention of glassblowing about 2,000 years ago changed this: by blowing air through a tube into melted glass, workers could make thin vessels quickly. Glass bottles and cups soon became common across the Roman Empire.",
    sentences: [
      [
        "Glass was probably first made when sand was heated with ___.",
        "ash",
        ["air", "water", "tubes"],
        "when sand was heated with ash in a fire",
      ],
      [
        "For a long time, glass objects were small and ___.",
        "expensive",
        ["common", "thin", "quick"],
        "glass objects were small and expensive",
      ],
      [
        "Glassblowers blew air into melted glass through a ___.",
        "tube",
        ["bottle", "fire", "cup"],
        "by blowing air through a tube into melted glass",
      ],
    ],
    summary: [
      ["The discovery of glass was probably ___.", "accidental", ["planned", "recent", "European"], "probably by accident"],
      [
        "Glassblowing allowed faster ___ of thin containers.",
        "production",
        ["destruction", "sale", "repair"],
        "workers could make thin vessels quickly",
      ],
      [
        "As a result, glass items became ___ in Roman times.",
        "ordinary",
        ["rare", "valuable", "illegal"],
        "Glass bottles and cups soon became common",
      ],
    ],
  },
  {
    text: "In some Dutch cities, traffic engineers have removed traffic lights, signs and even the lines in the middle of the road. The idea, known as shared space, is that drivers who are unsure who has priority will slow down and pay more attention to cyclists and pedestrians. In several towns where it was tried, the number of accidents fell, although some blind and older people say they find these streets confusing.",
    sentences: [
      [
        "Engineers removed traffic lights, signs and the ___ in the middle of the road.",
        "lines",
        ["cyclists", "towns", "streets"],
        "even the lines in the middle of the road",
      ],
      [
        "Drivers who are unsure about ___ tend to slow down.",
        "priority",
        ["accidents", "cyclists", "signs"],
        "drivers who are unsure who has priority will slow down",
      ],
      ["In several towns, the number of ___ fell.", "accidents", ["drivers", "signs", "streets"], "the number of accidents fell"],
    ],
    summary: [
      [
        "Shared space relies on drivers being more ___.",
        "careful",
        ["confident", "relaxed", "skilled"],
        "slow down and pay more attention",
      ],
      [
        "The results have generally been ___ for road safety.",
        "positive",
        ["negative", "unclear", "harmful"],
        "the number of accidents fell",
      ],
      [
        "Some blind and older people find the streets ___.",
        "difficult",
        ["pleasant", "empty", "noisy"],
        "say they find these streets confusing",
      ],
    ],
  },
];

function items(gaps: (c: Completed) => readonly Gap[], boxed: boolean): readonly SolvedChoice[] {
  return interleave(
    texts.map((c) =>
      gaps(c).map(([sentence, right, wrong, evidence]) => ({
        shown: `${c.text}\n\n**${boxed ? "Summary" : "Sentence"}:** ${sentence}`,
        right,
        wrong,
        solution: boxed
          ? t(
              `**${right}**. The text says it in other words: "${evidence}${end(evidence)}" In a summary the words usually differ from the text's, so match the meaning, then check that the word fits the grammar of the gap.`,
              `**${right}**。原文换了说法："${evidence}${end(evidence)}" 摘要用词通常与原文不同，要按意思匹配，再检查这个词是否符合空格处的语法。`,
            )
          : t(
              `**${right}**. The text says: "${evidence}${end(evidence)}" Copy the word exactly as the text spells it; a word that is in the text but means something else does not fit.`,
              `**${right}**。原文是："${evidence}${end(evidence)}" 要按原文拼写照抄；出现在原文中但意思不对的词不能填。`,
            ),
      })),
    ),
  );
}

/** sentenceAndSummaryCompletion is the IELTS topic of completing sentences and summaries. */
export const sentenceAndSummaryCompletion: TopicDef = examTopic({
  id: "ielts-sentence-and-summary-completion",
  title: t("Sentence and Summary Completion", "句子填空与摘要填空"),
  summary: t(
    "IELTS-style gaps after short texts: completing sentences with words of the text, and summaries with words from a box.",
    "雅思风格的短文填空：用原文的词完成句子，用方框里的词完成摘要。",
  ),
  strand: "reading",
  prerequisites: ["supporting-details"],
  encompasses: [{ topic: "supporting-details", weight: 0.3 }],
  xp: 10,
  points: [
    point(
      "ielts-sentence-completion",
      t("Completing Sentences from the Text", "用原文的词完成句子"),
      t(
        "Read the sentence first and decide what kind of word the gap needs: a noun, a verb, an adjective. Then find the part of the text it comes from: its words are usually close to the sentence's, but in a different order. Choose the word the text uses there, spelled exactly as in the text. Words that appear nearby but say something else are the traps.",
        "先读句子，判断空格需要什么词：名词、动词还是形容词。再找到它对应的原文：用词通常和句子相近，只是顺序不同。选原文在那里用的词，拼写与原文完全一致。附近出现但意思不对的词就是陷阱。",
      ),
      solvedChoiceGenerator(
        t("Complete the sentence with ONE WORD from the text.", "用原文中的**一个词**完成句子。"),
        items((c) => c.sentences, false),
      ),
    ),
    point(
      "ielts-summary-completion",
      t("Completing a Summary from a Box", "用方框中的词完成摘要"),
      t(
        "A summary restates the text in other words, so the right word is often not in the text at all: *fell* becomes *decreased*, *alone* becomes *unaccompanied*. Find the part of the text the summary sentence retells, decide what it means, and choose the word from the box with that meaning and the right grammar. Wrong choices are often the opposite meaning or a word of the text that means something else.",
        "摘要是用别的话复述原文，所以正确的词常常根本不在原文里：*fell* 变成 *decreased*，*alone* 变成 *unaccompanied*。找到摘要句复述的原文，弄清它的意思，再从方框中选出意思相同、语法也合适的词。错误选项常常是相反的意思，或者是原文中意思不对的词。",
      ),
      solvedChoiceGenerator(
        t("Complete the summary with a word from the box.", "从方框中选词完成摘要。"),
        items((c) => c.summary, true),
      ),
    ),
  ],
});
