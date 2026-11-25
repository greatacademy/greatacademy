// IELTS Reading: note completion and short-answer questions, answered by typing words from the text. Each short text
// carries three gaps in notes, ONE WORD ONLY, and three questions, NO MORE THAN TWO WORDS AND/OR A NUMBER. Some wrong
// responses are the right words copied with one word too many, which the exam marks wrong.

import { type TopicDef, t } from "@ga/content";
import { point, type TypedItem, typedGenerator } from "@ga/subject-english";
import { examTopic, interleave } from "./kit.ts";
import { copiedMistakes } from "./mistakes.ts";

/** Asked is a note line with a gap or a question, the accepted answers with the best first, likely wrong ones, and the words of the text that decide it. */
type Asked = readonly [asked: string, accepted: readonly string[], wrong: readonly string[], evidence: string];

/** Noted is a short text, the title of the notes made on it, three note lines with a gap and three questions. */
interface Noted {
  readonly text: string;
  readonly notes: string;
  readonly gaps: readonly [Asked, Asked, Asked];
  readonly questions: readonly [Asked, Asked, Asked];
}

const texts: readonly Noted[] = [
  {
    text: "Mangroves are trees that grow along tropical coasts, where the land meets the sea. Few plants can survive in salt water, but mangroves have roots that filter out most of the salt. Some species push special roots up through the mud so that they can take in air at low tide. Mangrove forests protect the coast in two ways. Their dense roots slow down waves during storms, and they trap mud carried by rivers, which slowly builds up the land. They are also nurseries for young fish, which hide among the roots until they are large enough to survive in open water. Despite this, large areas of mangrove have been cleared to make room for shrimp farms. In recent years, several countries have begun replanting them, often with the help of local fishing communities.",
    notes: "Mangroves",
    gaps: [
      ["Roots remove most of the ___ from sea water.", ["salt"], ["mud", "air", "waves"], "roots that filter out most of the salt"],
      [
        "Some roots rise above the mud to take in ___ at low tide.",
        ["air"],
        ["salt", "water", "light"],
        "push special roots up through the mud so that they can take in air at low tide",
      ],
      [
        "Large areas have been cleared for ___ farms.",
        ["shrimp"],
        ["fish", "mangrove", "coastal"],
        "cleared to make room for shrimp farms",
      ],
    ],
    questions: [
      [
        "What do mangrove roots slow down during storms?",
        ["waves"],
        ["rivers", "mud", "the sea"],
        "Their dense roots slow down waves during storms",
      ],
      [
        "Where do young fish hide?",
        ["among the roots", "the roots", "roots"],
        ["open water", "the mud", "the trees"],
        "hide among the roots",
      ],
      [
        "Who often helps with the replanting?",
        ["fishing communities"],
        ["local fishing communities", "shrimp farms", "several countries"],
        "often with the help of local fishing communities",
      ],
    ],
  },
  {
    text: "Walk through almost any park and you will see narrow strips of bare earth cutting across the grass. Planners call them desire paths: routes made by people who choose the shortest way rather than the paved one. For a long time, park managers treated them as damage and put up fences to stop them. More recently, some universities have taken a different approach. Instead of laying paths before a new building opens, they plant grass everywhere and wait. After about a year, the routes that students actually use are clear, and only then are they paved. One campus that tried this in 2015 found that it needed 30 per cent fewer paths than its original plan had included. The method is cheap, but it requires patience, and visitors in the first year must accept muddy shoes.",
    notes: "Desire paths",
    gaps: [
      [
        "Made by people who take the ___ way.",
        ["shortest"],
        ["paved", "longest", "easiest"],
        "choose the shortest way rather than the paved one",
      ],
      ["Park managers once put up ___ to stop them.", ["fences"], ["paths", "grass", "signs"], "put up fences to stop them"],
      ["Some universities first plant ___ everywhere.", ["grass"], ["trees", "paths", "earth"], "they plant grass everywhere and wait"],
    ],
    questions: [
      [
        "How long do the universities wait before paving?",
        ["a year", "one year", "1 year"],
        ["about a year", "2015", "30 per cent"],
        "After about a year",
      ],
      ["In which year did one campus try the method?", ["2015"], ["2005", "30", "1 year"], "One campus that tried this in 2015"],
      [
        "What must visitors in the first year accept?",
        ["muddy shoes"],
        ["shoes", "fewer paths", "patience"],
        "visitors in the first year must accept muddy shoes",
      ],
    ],
  },
  {
    text: "Deep below the surface of the Antarctic ice lie layers of snow that fell hundreds of thousands of years ago. Each winter's snow is pressed down by the snow above it until it turns to ice, trapping tiny bubbles of air. Scientists drill out long cylinders of this ice, called cores, and study them in laboratories kept below minus 20 degrees. The bubbles are especially valuable: they hold samples of the atmosphere from the time the snow fell, so researchers can measure how much carbon dioxide the air once contained. Layers of dust and ash also record distant volcanic eruptions. The oldest continuous core so far covers about 800,000 years, and teams are now searching for ice that is older still.",
    notes: "Ice cores",
    gaps: [
      ["Snow is pressed down until it turns to ___.", ["ice"], ["snow", "dust", "water"], "until it turns to ice"],
      [
        "Cores are studied in cold ___.",
        ["laboratories"],
        ["cylinders", "layers", "bubbles"],
        "study them in laboratories kept below minus 20 degrees",
      ],
      [
        "Layers of dust and ___ record eruptions.",
        ["ash"],
        ["air", "ice", "snow"],
        "Layers of dust and ash also record distant volcanic eruptions",
      ],
    ],
    questions: [
      [
        "What do the bubbles hold samples of?",
        ["the atmosphere", "atmosphere", "air"],
        ["carbon dioxide", "dust", "snow"],
        "they hold samples of the atmosphere",
      ],
      [
        "Which gas can researchers measure in the bubbles?",
        ["carbon dioxide"],
        ["air", "ash", "oxygen"],
        "researchers can measure how much carbon dioxide the air once contained",
      ],
      [
        "How many years does the oldest continuous core cover?",
        ["800,000", "800000", "about 800,000", "800,000 years"],
        ["20", "minus 20", "8,000"],
        "The oldest continuous core so far covers about 800,000 years",
      ],
    ],
  },
  {
    text: "In a vertical farm, crops grow indoors on shelves stacked one above another, sometimes ten or more levels high. Instead of sunlight, the plants receive light from LED lamps, which can be tuned to the colours plants use most. Most vertical farms grow leafy vegetables such as lettuce and herbs, because these crops grow quickly and are light enough for the shelves. Water is pumped around in a closed system and reused, so a vertical farm may use up to 95 per cent less water than a field. The main drawback is energy: lighting and cooling a building all year is expensive, and several companies have closed because their electricity bills were too high. Supporters argue that falling prices for solar power could change this.",
    notes: "Vertical farms",
    gaps: [
      [
        "Crops grow indoors on stacked ___.",
        ["shelves"],
        ["levels", "fields", "lamps"],
        "crops grow indoors on shelves stacked one above another",
      ],
      ["Plants receive light from ___ lamps.", ["LED"], ["solar", "sun", "coloured"], "the plants receive light from LED lamps"],
      [
        "Water moves in a ___ system and is reused.",
        ["closed"],
        ["open", "pumped", "solar"],
        "Water is pumped around in a closed system and reused",
      ],
    ],
    questions: [
      [
        "What kind of vegetables do most vertical farms grow?",
        ["leafy vegetables", "leafy"],
        ["lettuce and herbs", "fruit", "root vegetables"],
        "Most vertical farms grow leafy vegetables",
      ],
      [
        "How much less water may a vertical farm use than a field?",
        ["95 per cent", "95%", "95 percent", "95"],
        ["up to 95 per cent", "5 per cent", "10"],
        "a vertical farm may use up to 95 per cent less water than a field",
      ],
      [
        "What have high electricity bills made several companies do?",
        ["close", "closed"],
        ["grow", "reuse water", "use solar power"],
        "several companies have closed because their electricity bills were too high",
      ],
    ],
  },
  {
    text: "Corals are tiny animals that live in large colonies, building the hard skeletons that form reefs. Their bright colours come from algae living inside their bodies. The relationship benefits both: the algae receive shelter, and in return they provide the coral with most of its food through photosynthesis. When the sea becomes too warm, however, the corals push the algae out. Without them, the corals turn white, a process known as bleaching. A bleached coral is not dead, and if temperatures fall within a few weeks, the algae can return. If the heat continues, the coral starves. Scientists are now testing whether corals from naturally hotter waters, such as shallow lagoons, could be moved to reefs that are warming.",
    notes: "Coral bleaching",
    gaps: [
      [
        "Coral colours come from ___ living inside them.",
        ["algae"],
        ["skeletons", "animals", "colonies"],
        "Their bright colours come from algae living inside their bodies",
      ],
      [
        "The algae make food through ___.",
        ["photosynthesis"],
        ["shelter", "bleaching", "colonies"],
        "most of its food through photosynthesis",
      ],
      ["Without the algae, corals turn ___.", ["white"], ["bright", "dead", "warm"], "Without them, the corals turn white"],
    ],
    questions: [
      ["What do the algae receive from the coral?", ["shelter"], ["food", "colour", "photosynthesis"], "the algae receive shelter"],
      [
        "What happens to a bleached coral if the heat continues?",
        ["it starves", "starves"],
        ["bleaching", "turns white", "the algae return"],
        "If the heat continues, the coral starves",
      ],
      [
        "Where do some corals from naturally hotter waters live?",
        ["shallow lagoons", "lagoons"],
        ["reefs", "warm seas", "open water"],
        "corals from naturally hotter waters, such as shallow lagoons",
      ],
    ],
  },
  {
    text: "For most of the twentieth century, tall buildings were made of steel and concrete. Wood was thought to be too weak and too likely to burn. A material called cross-laminated timber is now changing this view. It is made by gluing layers of boards together, with the grain of each layer at right angles to the one below, which makes the panels very strong. In a fire, the outer surface chars, and this black layer protects the wood inside, so a thick panel keeps its strength for a long time. Builders also like the material because panels are cut in a factory and arrive ready to fit, which can shorten building work by several months. Its supporters point out that trees store carbon, whereas producing cement releases large amounts of it.",
    notes: "Cross-laminated timber",
    gaps: [
      [
        "Made by gluing layers of ___ together.",
        ["boards"],
        ["panels", "steel", "trees"],
        "It is made by gluing layers of boards together",
      ],
      ["In a fire, the outer surface ___.", ["chars"], ["burns", "protects", "breaks"], "In a fire, the outer surface chars"],
      ["Panels are cut in a ___.", ["factory"], ["forest", "building", "fire"], "panels are cut in a factory"],
    ],
    questions: [
      [
        "Apart from being weak, what was wood thought likely to do?",
        ["burn", "to burn"],
        ["break", "char", "rot"],
        "Wood was thought to be too weak and too likely to burn",
      ],
      [
        "By how much can the material shorten building work?",
        ["several months"],
        ["a few weeks", "a year", "months"],
        "which can shorten building work by several months",
      ],
      ["What does producing cement release?", ["carbon"], ["heat", "dust", "smoke"], "producing cement releases large amounts of it"],
    ],
  },
  {
    text: "Nearly all animals with a backbone yawn, from fish to humans, yet scientists still disagree about why. An old idea was that yawning brings extra oxygen into the blood, but experiments in which people breathed air with more oxygen did not reduce yawning. A newer theory is that yawning cools the brain. In one study, people who held a cold pack against their forehead yawned far less often than those holding a warm one. Yawning is also contagious: seeing, hearing or even reading about a yawn can trigger one. This effect is weaker in young children and seems to appear at around the age of four, at the same time as children begin to understand what other people are thinking.",
    notes: "Yawning",
    gaps: [
      [
        "Old idea: yawning brings extra ___ into the blood.",
        ["oxygen"],
        ["air", "heat", "water"],
        "yawning brings extra oxygen into the blood",
      ],
      ["Newer theory: yawning ___ the brain.", ["cools"], ["warms", "wakes", "trains"], "yawning cools the brain"],
      [
        "Contagious yawning appears at around the age of ___.",
        ["four", "4"],
        ["two", "fourteen", "forty"],
        "seems to appear at around the age of four",
      ],
    ],
    questions: [
      [
        "What did people hold against their forehead to yawn less?",
        ["cold pack"],
        ["a cold pack", "warm pack", "ice"],
        "people who held a cold pack against their forehead yawned far less often",
      ],
      [
        "Apart from seeing and hearing, what can trigger a yawn?",
        ["reading"],
        ["breathing", "thinking", "oxygen"],
        "seeing, hearing or even reading about a yawn can trigger one",
      ],
      [
        "In whom is contagious yawning weaker?",
        ["young children", "children"],
        ["fish", "animals", "adults"],
        "This effect is weaker in young children",
      ],
    ],
  },
  {
    text: "A seed bank stores seeds so that plant species can be grown again if they disappear from fields or forests. Before storage, seeds are dried until they contain only a small amount of water, then sealed in packets and kept at around minus 18 degrees. Under these conditions many seeds stay alive for decades, and some for centuries. Every few years, staff take a sample from each collection and test whether the seeds will still sprout. If too few do, new plants are grown from the remaining seeds to produce a fresh supply. Not every species can be stored this way: the seeds of many tropical trees die when they are dried, so they must be kept as living plants or frozen in liquid nitrogen instead.",
    notes: "Seed banks",
    gaps: [
      ["Dried seeds are sealed in ___.", ["packets"], ["banks", "collections", "plants"], "then sealed in packets"],
      ["Staff test whether the seeds will still ___.", ["sprout"], ["dry", "freeze", "die"], "test whether the seeds will still sprout"],
      [
        "Seeds of many tropical ___ die when dried.",
        ["trees"],
        ["plants", "forests", "species"],
        "the seeds of many tropical trees die when they are dried",
      ],
    ],
    questions: [
      [
        "At what temperature are the packets kept?",
        ["minus 18 degrees", "-18 degrees", "minus 18", "-18"],
        ["18 degrees", "decades", "centuries"],
        "kept at around minus 18 degrees",
      ],
      [
        "How long do some seeds stay alive?",
        ["centuries", "for centuries"],
        ["decades", "for decades", "every few years"],
        "many seeds stay alive for decades, and some for centuries",
      ],
      [
        "Apart from as living plants, how can tropical tree seeds be kept?",
        ["frozen", "liquid nitrogen"],
        ["dried", "in packets", "minus 18 degrees"],
        "they must be kept as living plants or frozen in liquid nitrogen instead",
      ],
    ],
  },
  {
    text: "Desert locusts usually live alone, avoiding one another, and cause little harm. After heavy rains, however, plants spread quickly across the desert and the insects breed in large numbers. When they become crowded, constant contact between their back legs triggers a change. Within a few hours they begin to seek each other out, and over several generations their colour changes from green to yellow and black. These crowded locusts form swarms that can travel up to 150 kilometres in a day, eating their own weight in food. Early warning is the best defence: teams search remote areas for young locusts, which cannot yet fly, and treat them before a swarm forms.",
    notes: "Desert locusts",
    gaps: [
      ["They breed in large numbers after heavy ___.", ["rains", "rain"], ["winds", "plants", "swarms"], "After heavy rains"],
      [
        "Contact between their back ___ triggers a change.",
        ["legs"],
        ["wings", "bodies", "feet"],
        "constant contact between their back legs triggers a change",
      ],
      [
        "Over generations their colour changes from ___ to yellow and black.",
        ["green"],
        ["brown", "white", "red"],
        "their colour changes from green to yellow and black",
      ],
    ],
    questions: [
      [
        "How far can a swarm travel in a day?",
        ["150 kilometres", "150 km", "150 kilometers", "150"],
        ["up to 150 kilometres", "15 kilometres", "a day"],
        "can travel up to 150 kilometres in a day",
      ],
      [
        "What is the best defence against locusts?",
        ["early warning"],
        ["heavy rains", "swarms", "remote areas"],
        "Early warning is the best defence",
      ],
      ["What can young locusts not yet do?", ["fly", "to fly"], ["eat", "breed", "swarm"], "young locusts, which cannot yet fly"],
    ],
  },
  {
    text: "A repair café is a free meeting where people bring broken household items and fix them with the help of volunteers. The first ones were organised in the late 2000s, and there are now thousands around the world, usually held once a month in community halls or libraries. Volunteers include retired electricians, tailors and bicycle mechanics. Visitors are expected to take part in the repair rather than simply leave the item, so that they learn how to do it themselves next time. Organisers keep records of each item: one network reported that about two thirds of the objects brought in were successfully repaired, with lamps and clothing among the easiest. The main obstacle, volunteers say, is products that are glued shut and cannot be opened without breaking them.",
    notes: "Repair cafés",
    gaps: [
      ["Usually held once a ___.", ["month"], ["week", "year", "day"], "usually held once a month"],
      [
        "Volunteers include retired electricians, tailors and bicycle ___.",
        ["mechanics"],
        ["repairers", "owners", "riders"],
        "retired electricians, tailors and bicycle mechanics",
      ],
      [
        "Visitors take part so that they ___ how to repair things themselves.",
        ["learn"],
        ["pay", "wait", "decide"],
        "so that they learn how to do it themselves next time",
      ],
    ],
    questions: [
      [
        "Where are repair cafés usually held?",
        ["community halls", "libraries", "halls"],
        ["repair shops", "cafés", "homes"],
        "in community halls or libraries",
      ],
      [
        "What share of the objects were successfully repaired?",
        ["two thirds", "two-thirds", "2/3"],
        ["about two thirds", "one third", "half"],
        "about two thirds of the objects brought in were successfully repaired",
      ],
      [
        "Besides lamps, what was among the easiest things to repair?",
        ["clothing"],
        ["lamps", "bicycles", "furniture"],
        "with lamps and clothing among the easiest",
      ],
    ],
  },
];

for (const n of texts) {
  for (const [asked, , , evidence] of [...n.gaps, ...n.questions]) {
    if (!n.text.includes(evidence)) throw new Error(`the evidence for "${asked}" is not in the text: ${evidence}`);
  }
}

/** end gives the period a quoted piece of evidence needs when it has no closing punctuation of its own. */
const end = (evidence: string) => (/[.!?]$/u.test(evidence) ? "" : ".");

const evidenceOf = new Map<string, string>();

/** items turns the gaps or the questions of every text into typed items, remembering the evidence of each. */
function items(pick: (n: Noted) => readonly Asked[], show: (n: Noted, asked: string) => string): readonly TypedItem[] {
  return interleave(
    texts.map((n) =>
      pick(n).map(([asked, accepted, wrong, evidence]): TypedItem => {
        const shown = show(n, asked);
        evidenceOf.set(shown, evidence);
        return { shown, accepted, wrong };
      }),
    ),
  );
}

const gapItems = items(
  (n) => n.gaps,
  (n, line) => `${n.text}\n\n**Notes: ${n.notes}**\n\n${line}`,
);

const questionItems = items(
  (n) => n.questions,
  (n, question) => `${n.text}\n\n**${question}**`,
);

/** notesAndShortAnswers is the IELTS topic of completing notes and answering short questions with words of the text. */
export const notesAndShortAnswers: TopicDef = examTopic({
  id: "ielts-notes-and-short-answers",
  title: t("Note Completion and Short Answers", "笔记填空与简答题"),
  summary: t(
    "IELTS-style questions answered by typing words from a short text: gaps in notes, one word only, and short answers of no more than two words and/or a number.",
    "雅思风格的题目，从短文中找词并键入作答：笔记填空只填一个词，简答题不超过两个词和/或一个数字。",
  ),
  intro: t(
    "In IELTS typed reading tasks, knowing the right fact is only half the score—writing a synonym not in the passage, dropping a plural *-s*, or exceeding the word limit by a single article (*the*) turns a right idea into zero marks.",
    "在雅思拼写类阅读题中，找对信息只算完成一半——换用原文没有的同义词、漏掉复数 *-s*，或多写一个冠词超出字数上限，都会让原本找对的答案丢分。",
  ),
  strand: "reading",
  prerequisites: ["ielts-sentence-and-summary-completion"],
  encompasses: [{ topic: "ielts-sentence-and-summary-completion", weight: 0.3 }],
  xp: 12,
  points: [
    point(
      "ielts-note-completion",
      t("Note Completion", "笔记填空"),
      t(
        "Notes, tables and flow charts sum up part of a text in short lines, and each gap must be filled with a word **copied from the text**. Read the line and decide what kind of word it needs: a noun after *the*, a verb after *they*, a number after *age*. Then find the part of the text the line is about: its words usually differ, but the order of the notes follows the text.\n\n> **Watch out.** Copy the word **verbatim** from the passage (keeping exact spelling and any plural *-s*)—a synonym not printed in the text (*burns* instead of *chars*) is marked wrong.",
        "笔记、表格和流程图用简短的句子概括原文的一部分，每个空都必须用**从原文中照抄的词**来填。先读这一行，判断空格需要哪一类词：*the* 后面要名词，*they* 后面要动词，*age* 后面要数字。再找到这一行对应的原文：用词通常不同，但笔记的顺序与原文一致。\n\n> **注意。** 必须**原样照抄**原文里的词（包括拼写和复数 *-s*）——意思相同但原文没出现的词（如用 *burns* 代替 *chars*）会被判错。",
      ),
      typedGenerator(
        "word-form",
        t("Complete the note. Write ONE WORD ONLY from the text.", "完成笔记。只写一个从原文中选出的词（ONE WORD ONLY）。"),
        gapItems,
        (right, shown) => {
          const evidence = evidenceOf.get(shown) ?? "";
          return t(
            `**${right}**. The text says: "${evidence}${end(evidence)}" The note says the same thing in fewer words, and the gap takes the word exactly as the text spells it.\n\n**Check.** Confirm *${right}* is one word copied verbatim from "${evidence}${end(evidence)}" and fits the grammar of the note.`,
            `**${right}**。原文是："${evidence}${end(evidence)}" 笔记用更少的词说了同一件事，空格里要填原文中拼写完全一样的那个词。\n\n**检验。** 确认 *${right}* 是从原文“${evidence}${end(evidence)}”原样抄下的单个词，且符合笔记的语法。`,
          );
        },
        copiedMistakes("one"),
      ),
    ),
    point(
      "ielts-short-answers",
      t("Short-Answer Questions", "简答题"),
      t(
        "Short-answer questions ask for a fact from the text and set a limit, such as **NO MORE THAN TWO WORDS AND/OR A NUMBER**. Find the part of the text that answers the question, then copy the fewest words that still answer it. Numbers may be written as figures. The questions follow the order of the text.\n\n> **Watch out.** Every tiny word (*a*, *the*, *about*, *up to*) counts toward the word limit—trim *about two thirds* to *two thirds* so you never exceed two words.",
        "简答题要求从原文中找出一个事实，并限定字数，例如**不超过两个词和/或一个数字**（NO MORE THAN TWO WORDS AND/OR A NUMBER）。找到回答问题的那部分原文，再照抄仍能回答问题的最少的词。数字可以写成阿拉伯数字。题目的顺序与原文一致。\n\n> **注意。** 每个小词（*a*、*the*、*about*、*up to*）都算字数——例如把 *about two thirds* 精简为 *two thirds*，绝不超过两词上限。",
      ),
      typedGenerator(
        "word-form",
        t(
          "Answer the question. Write NO MORE THAN TWO WORDS AND/OR A NUMBER from the text.",
          "回答问题。从原文中选用不超过两个词和/或一个数字（NO MORE THAN TWO WORDS AND/OR A NUMBER）。",
        ),
        questionItems,
        (right, shown) => {
          const evidence = evidenceOf.get(shown) ?? "";
          return t(
            `**${right}**. The text says: "${evidence}${end(evidence)}" Copy only the words that answer the question, and no more than the limit allows.\n\n**Check.** Count the words in *${right}* (within the two-word-and/or-number limit) and verify each word matches the passage spelling.`,
            `**${right}**。原文是："${evidence}${end(evidence)}" 只抄写回答问题的词，不要超过字数限制。\n\n**检验。** 数一下 *${right}* 的词数（不超过两个词和/或一个数字），并核对拼写与原文一致。`,
          );
        },
        copiedMistakes("two"),
      ),
    ),
  ],
});
