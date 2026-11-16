// Grade 9: modal perfects as writers use and misuse them, and using a source without plagiarizing it.

import type { TopicDef } from "@ga/content";
import { choose, type Label, label, topic } from "../grade-6/kit.ts";

const join = (lines: readonly string[]) => lines.join("\n");

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

// Modal perfects.

/** ofOrHave are sentences with a modal perfect, its modal and its past participle. */
const ofOrHave = [
  ["I ___ called you, but my phone died.", "should", "called"],
  ["She ___ won the race if she had not tripped.", "could", "won"],
  ["They ___ left already; the lights are off.", "must", "left"],
  ["We ___ taken the train instead.", "should", "taken"],
  ["He ___ helped us if we had asked.", "would", "helped"],
  ["You ___ seen her at the library.", "might", "seen"],
  ["The letter ___ arrived by now.", "should", "arrived"],
  ["I ___ finished sooner with a better map.", "could", "finished"],
  ["The thieves ___ used a ladder.", "must", "used"],
  ["Nobody ___ guessed the ending.", "could", "guessed"],
] as const;

const ofLines = join(
  ofOrHave.map(([s, modal, participle]) => {
    const blank = s.replace(` ${participle}`, "");
    return `${blank}|${modal} have ${participle}|${modal} of ${participle}|${modal} had ${participle}`;
  }),
);

/** pastIfs are a third conditional with the if-clause blank, the past perfect, and two wrong forms. */
const pastIfs = [
  ["If I ___ about the storm, I would have stayed home.", "had known", "would have known", "have known"],
  ["If she ___ the bus, she would have been on time.", "had caught", "would have caught", "has caught"],
  ["If we ___ earlier, we could have seen the parade.", "had left", "would have left", "have left"],
  ["If he ___ the map, he would not have got lost.", "had checked", "would have checked", "has checked"],
  ["If they ___ harder, they might have won.", "had trained", "would have trained", "have trained"],
  ["If you ___ me, I would have helped.", "had asked", "would have asked", "have asked"],
  ["If the ship ___ the iceberg in time, it would have turned.", "had seen", "would have seen", "has seen"],
  ["If I ___ the recipe, the cake would not have burned.", "had followed", "would have followed", "have followed"],
  ["If the council ___ the bridge, the town would have been cut off.", "had not repaired", "would not have repaired", "has not repaired"],
  ["If she ___ the letter, she would have known the truth.", "had read", "would have read", "has read"],
] as const;

const pastIfLines = join(pastIfs.map((row) => row.join("|")));

/** meanings say in plain words what each modal perfect says about the past. */
const meanings = {
  must: "It is almost certain that this happened.",
  might: "It is possible that this happened.",
  should: "This was the right or expected thing, but it did not happen.",
  cannot: "It is impossible that this happened.",
} as const;

type Sense = keyof typeof meanings;

/** guesses are sentences with a modal perfect and what it says. */
const guesses: readonly (readonly [string, Sense])[] = [
  ["The streets are wet. It must have rained.", "must"],
  ["Her coat is gone. She must have left.", "must"],
  ["The cake is half eaten. Someone must have been hungry.", "must"],
  ["He is late. He might have missed the bus.", "might"],
  ["I can't find my keys. I may have left them at school.", "might"],
  ["The letter is missing. It could have fallen behind the desk.", "might"],
  ["You should have told me about the test.", "should"],
  ["We should have booked a table; the restaurant is full.", "should"],
  ["They ought to have warned the villagers.", "should"],
  ["She can't have written this; she was abroad all year.", "cannot"],
  ["He couldn't have seen us; the room was dark.", "cannot"],
  ["The dog can't have opened the fridge by itself.", "cannot"],
];

const order: readonly Sense[] = ["must", "might", "should", "cannot"];

const senseLines = join(
  guesses.map(([s, sense], i) => {
    const others = order.filter((o) => o !== sense);
    const a = others[i % 3]!;
    const b = others[(i + 1) % 3]!;
    return `${s}|${meanings[sense]}|${meanings[a]}|${meanings[b]}`;
  }),
);

const modalPerfects = topic("grammar", {
  id: "modal-perfects-in-writing",
  title: ["Modal Perfects in Writing", "写作中的情态动词完成式"],
  summary: [
    "*Should have*, *could have*, *must have* and *might have*: never *should of*, never *would have* in the *if* clause of the past, and what each says about the past.",
    "*should have*、*could have*、*must have* 和 *might have*：绝不写成 *should of*，过去的 *if* 从句中不用 *would have*，以及它们各自对过去表达了什么。",
  ],
  after: ["conditional-sentences"],
  points: [
    choose(
      "have-not-of",
      ["Have, Not Of", "是 have，不是 of"],
      [
        "In speech, *should have* sounds like *should've*, which some writers mishear as *should of*. The form is always a modal, then **have**, then a past participle: *should have called*, *could have won*, *must have left*. *Of* is a preposition and cannot follow a modal, and *had* cannot either.",
        "在口语中，*should have* 听起来像 *should've*，有些人误听成 *should of*。正确的形式总是情态动词加 **have** 再加过去分词：*should have called*、*could have won*、*must have left*。*of* 是介词，不能跟在情态动词后面，*had* 也不能。",
      ],
      ["Which words complete the sentence?", "哪组词能补全句子？"],
      ofLines,
      (right) => [`*${right}*: a modal, then *have*, then the past participle.`, `*${right}*：情态动词，加 *have*，再加过去分词。`],
      [
        [
          "*{wrong}* writes down how *have* sounds in speech; *of* cannot follow a modal.",
          "*{wrong}* 是按 *have* 的口语发音写的；*of* 不能跟在情态动词后面。",
        ],
        ["*{wrong}* puts *had* after a modal, which English does not allow.", "*{wrong}* 把 *had* 放在情态动词后面，英语不允许这样。"],
      ],
    ),
    choose(
      "the-past-if-clause",
      ["The Past If Clause", "过去的 if 从句"],
      [
        "A conditional about the past puts the **past perfect** in the *if* clause and *would have*, *could have* or *might have* in the result: *If I **had known** about the storm, I would have stayed home*. *Would have* belongs in the result only; *If I would have known* is a common error in formal writing.",
        "关于过去的条件句在 *if* 从句中用**过去完成时**，在结果从句中用 *would have*、*could have* 或 *might have*：*If I **had known** about the storm, I would have stayed home*。*would have* 只属于结果从句；*If I would have known* 是正式写作中的常见错误。",
      ],
      ["Which form completes the *if* clause?", "哪个形式能补全 *if* 从句？"],
      pastIfLines,
      (right, shown) => [
        `"${shown.replace("___", right)}": the *if* clause of the past takes the past perfect.`,
        `“${shown.replace("___", right)}”：过去的 *if* 从句用过去完成时。`,
      ],
      [
        ["*{wrong}* belongs in the result clause, not in the *if* clause.", "*{wrong}* 属于结果从句，不属于 *if* 从句。"],
        ["*{wrong}* is a present tense, but the sentence is about the past.", "*{wrong}* 是现在时，但句子说的是过去。"],
      ],
    ),
    choose(
      "what-the-modal-perfect-says",
      ["What the Modal Perfect Says", "情态动词完成式表达了什么"],
      [
        "Each modal perfect judges the past differently. *Must have* means the writer is almost **certain** it happened. *Might have*, *may have* and *could have* mean it is **possible**. *Should have* and *ought to have* mean it was the right or expected thing but **did not happen**. *Can't have* and *couldn't have* mean it is **impossible**.",
        "每个情态动词完成式对过去的判断都不同。*must have* 表示作者几乎**肯定**它发生过。*might have*、*may have* 和 *could have* 表示它**可能**发生过。*should have* 和 *ought to have* 表示那本是正确或应该做的事，但**没有发生**。*can't have* 和 *couldn't have* 表示它**不可能**发生过。",
      ],
      ["What does the second sentence say about the past?", "第二句对过去表达了什么？"],
      senseLines,
      (right) => [`The modal perfect here says: ${right}`, `这里的情态动词完成式表达的是：${right}`],
      [
        ["That is what a different modal perfect would say.", "那是另一个情态动词完成式表达的意思。"],
        ["That is what yet another modal perfect would say.", "那是又一个情态动词完成式表达的意思。"],
      ],
    ),
  ],
});

// Plagiarism.

/** uses are a source with its author, then four ways a student used it: copied, patchwritten, paraphrased and quoted. */
const uses = [
  [
    "Okafor",
    "Cities that plant more trees stay cooler in summer, because leaves shade streets and release water into the air.",
    "Cities that plant more trees stay cooler in summer, because leaves shade streets and release water into the air (Okafor).",
    "Cities that plant extra trees remain cooler in the summer, since leaves shade roads and give off water into the air (Okafor).",
    "According to Okafor, trees cool a city in two ways: their shade blocks the sun, and their leaves add moisture to the air.",
    'Okafor notes that leaves "shade streets and release water into the air."',
  ],
  [
    "Lindqvist",
    "Teenagers who sleep less than eight hours a night are more likely to feel anxious and to struggle in class.",
    "Teenagers who sleep less than eight hours a night are more likely to feel anxious and to struggle in class (Lindqvist).",
    "Teens who sleep under eight hours each night are more likely to feel worried and to have trouble in class (Lindqvist).",
    "Lindqvist links short sleep to both worry and weaker schoolwork among teenagers.",
    'Lindqvist warns that short sleepers are "more likely to feel anxious and to struggle in class."',
  ],
  [
    "Reyes",
    "The printing press made books cheap enough for ordinary families, and reading spread far beyond the monasteries.",
    "The printing press made books cheap enough for ordinary families, and reading spread far beyond the monasteries (Reyes).",
    "The printing press made books inexpensive enough for normal families, and reading spread well beyond the monasteries (Reyes).",
    "Reyes argues that once printing lowered the price of books, reading stopped being a skill mainly of monks.",
    'Reyes writes that printed books became "cheap enough for ordinary families."',
  ],
  [
    "Haddad",
    "Coral reefs cover a tiny part of the ocean floor but shelter about a quarter of all sea species.",
    "Coral reefs cover a tiny part of the ocean floor but shelter about a quarter of all sea species (Haddad).",
    "Coral reefs take up a small part of the sea floor but protect around a quarter of all ocean species (Haddad).",
    "Haddad points out that reefs, though small in area, are home to roughly one in four kinds of sea life.",
    'Haddad observes that reefs "shelter about a quarter of all sea species."',
  ],
  [
    "Moreau",
    "Factory work in the nineteenth century pulled families from farms into crowded cities, where children often worked long shifts.",
    "Factory work in the nineteenth century pulled families from farms into crowded cities, where children often worked long shifts (Moreau).",
    "Factory jobs in the nineteenth century drew families from farms into packed cities, where children frequently worked long hours (Moreau).",
    "Moreau describes how the factories of the eighteen hundreds emptied the countryside and put many city children to work.",
    'Moreau notes that in the new cities "children often worked long shifts."',
  ],
  [
    "Tanaka",
    "Learning a second language early seems to make children better at switching between tasks.",
    "Learning a second language early seems to make children better at switching between tasks (Tanaka).",
    "Learning another language young appears to make children better at changing between tasks (Tanaka).",
    "Tanaka suggests that children who learn two languages may move more easily from one task to another.",
    'Tanaka finds that early language learners seem "better at switching between tasks."',
  ],
  [
    "Osei",
    "Volcanic ash can ground airplanes for days, because the glassy particles melt inside jet engines.",
    "Volcanic ash can ground airplanes for days, because the glassy particles melt inside jet engines (Osei).",
    "Volcanic ash can stop airplanes for days, since the glass-like particles melt within jet engines (Osei).",
    "Osei explains that planes stay on the ground after an eruption because ash turns to glass in a hot engine.",
    'Osei explains that the "glassy particles melt inside jet engines."',
  ],
  [
    "Brennan",
    "Advertisers aim at children because children influence much of what their families buy.",
    "Advertisers aim at children because children influence much of what their families buy (Brennan).",
    "Advertisers target kids because kids affect a lot of what their families purchase (Brennan).",
    "Brennan argues that companies sell to children in order to reach their parents' wallets.",
    'Brennan claims that children "influence much of what their families buy."',
  ],
] as const;

const useLabels = join(
  uses.flatMap(([, source, copied, patched, paraphrased, quoted]) => [
    `Source: "${source}" Student: ${copied}|copied without quotation marks`,
    `Source: "${source}" Student: ${patched}|patchwriting`,
    `Source: "${source}" Student: ${paraphrased} (cited)|fair paraphrase`,
    `Source: "${source}" Student: ${quoted} (cited)|fair quotation`,
  ]),
);

const fairLines = join(
  uses.map(([author, source, copied, patched, paraphrased]) => `Source (${author}): "${source}"|${paraphrased}|${copied}|${patched}`),
);

/** citing are facts a reader can check anywhere, and facts that came from one source. */
const commonKnowledge = [
  "The Earth orbits the Sun once a year.",
  "Water freezes at zero degrees Celsius.",
  "World War II ended in 1945.",
  "Paris is the capital of France.",
  "Shakespeare wrote Hamlet.",
  "The heart pumps blood around the body.",
  "The Pacific is the largest ocean.",
  "Plants need sunlight to grow.",
  "The Great Wall is in China.",
  "George Washington was the first president of the United States.",
];

const fromASource = [
  "A 2019 survey found that 62 percent of teenagers sleep less than eight hours.",
  "One historian argues that the war was lost in its first month.",
  "A study of 3,000 students found that music lessons improved memory.",
  "According to one estimate, the city lost a fifth of its trees in a decade.",
  "A researcher found that bees can recognize human faces.",
  "One critic calls the novel the finest of its century.",
  "A report counted 240 species of bird in the park last spring.",
  "Recent measurements show the glacier shrank by 30 meters in one year.",
  "An economist predicts that prices will rise by four percent next year.",
  "A survey of nurses found that most work more than one night shift a week.",
];

const citeLabels = join([...commonKnowledge.map((f) => `${f}|common knowledge`), ...fromASource.map((f) => `${f}|needs a citation`)]);

const plagiarism = topic("writing", {
  id: "avoiding-plagiarism",
  title: ["Avoiding Plagiarism", "避免抄袭"],
  summary: [
    "Using a source honestly: copied words in quotation marks, a paraphrase in your own words and structure, a citation for each idea that came from someone else, and none for common knowledge.",
    "诚实地使用资料：抄录的词句要加引号，转述要用自己的词语和句式，来自他人的每个观点都要注明出处，常识则不需要。",
  ],
  after: ["paraphrasing-a-source"],
  points: [
    label(
      "fair-use-or-plagiarism",
      ["Fair Use or Plagiarism", "合理使用还是抄袭"],
      [
        "Copying a source's words without **quotation marks** is plagiarism, even with a citation. So is **patchwriting**: keeping the source's sentence and swapping a few words for synonyms. A **fair paraphrase** restates the idea in your own words and your own structure, and cites the author. A **fair quotation** puts the author's exact words in quotation marks, and cites them too.",
        "照抄资料的原话而不加**引号**是抄袭，即使注明了出处也一样。**拼凑改写**也是抄袭：保留原句结构，只把几个词换成同义词。**合理转述**用你自己的词语和句式重述观点，并注明作者。**合理引用**把作者的原话放在引号里，同样要注明出处。",
      ],
      ["How does the student use the source?", "这个学生是如何使用资料的？"],
      useLabels,
      {
        "copied without quotation marks": L(
          "照抄而未加引号",
          "The student's sentence is the source's sentence word for word, with no quotation marks.",
          "学生的句子与原句一字不差，而且没有加引号。",
          "The student did not copy the source word for word without quotation marks.",
          "这个学生并没有一字不差地照抄而不加引号。",
        ),
        patchwriting: L(
          "拼凑改写",
          "The student kept the source's sentence and only swapped some words for synonyms.",
          "学生保留了原句的结构，只把一些词换成了同义词。",
          "The student did not just swap words in the source's sentence.",
          "这个学生并不只是替换了原句中的词。",
        ),
        "fair paraphrase": L(
          "合理转述",
          "The student restated the idea in new words and a new structure, and cited the author.",
          "学生用新的词语和句式重述了观点，并注明了作者。",
          "The student did not restate the idea in their own words and structure.",
          "这个学生没有用自己的词语和句式重述观点。",
        ),
        "fair quotation": L(
          "合理引用",
          "The author's exact words are in quotation marks, and the author is named.",
          "作者的原话放在了引号里，并点明了作者。",
          "The student did not put the author's exact words in quotation marks.",
          "这个学生没有把作者的原话放在引号里。",
        ),
      },
    ),
    choose(
      "the-fair-paraphrase",
      ["The Fair Paraphrase", "合理的转述"],
      [
        "To paraphrase fairly, read the source, look away, and write the idea as you would explain it to a friend; then check that no phrase of the source survives without quotation marks, and cite the author. A version that follows the source word by word, even with synonyms, is not your own.",
        "要合理地转述，先读原文，然后移开视线，像给朋友解释那样写下这个观点；再检查有没有原文的短语未加引号就留了下来，并注明作者。逐字跟随原文的版本，即使换了同义词，也不是你自己的。",
      ],
      ["Which is a fair paraphrase of the source?", "哪个是对这段资料的合理转述？"],
      fairLines,
      (right) => [
        `"${right}" restates the idea in new words and a new structure, and names the author.`,
        `“${right}”用新的词语和句式重述了观点，并点明了作者。`,
      ],
      [
        ['"{wrong}" copies the source word for word without quotation marks.', "“{wrong}”一字不差地照抄了原文，而且没有加引号。"],
        ['"{wrong}" keeps the source\'s sentence and only swaps some words.', "“{wrong}”保留了原句，只替换了一些词。"],
      ],
    ),
    label(
      "what-needs-a-citation",
      ["What Needs a Citation", "什么需要注明出处"],
      [
        "**Common knowledge**, facts that most readers know or can find in any reference book, needs no citation: *Water freezes at zero degrees Celsius*. A statistic, a finding, an estimate or someone's opinion came from **one source**, so it **needs a citation**: *A 2019 survey found that 62 percent of teenagers sleep less than eight hours*. When in doubt, cite.",
        "**常识**，即大多数读者都知道或在任何参考书中都能查到的事实，不需要注明出处：*Water freezes at zero degrees Celsius*。统计数字、研究发现、估计或某人的观点来自**某个特定来源**，所以**需要注明出处**：*A 2019 survey found that 62 percent of teenagers sleep less than eight hours*。拿不准的时候，就注明出处。",
      ],
      ["Does this sentence need a citation?", "这个句子需要注明出处吗？"],
      citeLabels,
      {
        "common knowledge": L(
          "常识",
          "Most readers know this, and any reference book states it.",
          "大多数读者都知道这一点，任何参考书都有记载。",
          "This is a finding, a number or an opinion from one source.",
          "这是来自某个特定来源的发现、数字或观点。",
        ),
        "needs a citation": L(
          "需要注明出处",
          "This is a finding, a number or an opinion that came from one source.",
          "这是来自某个特定来源的发现、数字或观点。",
          "Most readers know this, and any reference book states it.",
          "大多数读者都知道这一点，任何参考书都有记载。",
        ),
      },
    ),
  ],
});

/** grammarTopics9c are the topics of grade 9 added for modal perfects and the honest use of sources. */
export const grammarTopics9c: readonly TopicDef[] = [modalPerfects, plagiarism];
