// Grade 10: agreement in the hardest cases, and fresh language in place of clichés.

import type { TopicDef } from "@ga/content";
import { choose, type Label, label, topic } from "../grade-6/kit.ts";

const join = (lines: readonly string[]) => lines.join("\n");

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

// Agreement in hard cases.

/** oneOf are a plural group, what they do in the plural and in the singular, and a form that is not finite. */
const oneOf = [
  ["players", "train", "trains", "training", "every morning"],
  ["writers", "revise", "revises", "revising", "each page twice"],
  ["students", "walk", "walks", "walking", "to school"],
  ["doctors", "work", "works", "working", "at night"],
  ["singers", "read", "reads", "reading", "music by sight"],
  ["scientists", "share", "shares", "sharing", "their data"],
  ["neighbors", "keep", "keeps", "keeping", "bees"],
  ["teachers", "speak", "speaks", "speaking", "three languages"],
] as const;

const oneOfLines = join(
  oneOf.flatMap(([group, plural, singular, ing, rest]) => [
    `She is one of the ${group} who ___ ${rest}.|${plural}|${singular}|${ing}`,
    `She is the only one of the ${group} who ___ ${rest}.|${singular}|${plural}|${ing}`,
  ]),
);

/** singularSubjects are subjects that look plural but name one title, dish, clause or field, with their sentence. */
const singularSubjects = [
  ["*The Grapes of Wrath* ___ a novel about migrant workers.", "is", "are", "be"],
  ["*Romeo and Juliet* ___ performed every summer in the park.", "is", "are", "be"],
  ["What we need ___ more volunteers.", "is", "are", "be"],
  ["What the critics praised ___ the actors' voices.", "was", "were", "be"],
  ["Fish and chips ___ my favorite meal.", "is", "are", "be"],
  ["Bread and butter ___ all he wanted for breakfast.", "was", "were", "be"],
  ["*The Canterbury Tales* ___ written in Middle English.", "was", "were", "be"],
  ["Whether they will come ___ still unclear.", "is", "are", "be"],
  ["Economics ___ the subject she studies.", "is", "are", "be"],
  ["*Great Expectations* ___ one of Dickens's later novels.", "is", "are", "be"],
  ["That the bridges were unsafe ___ known for years.", "was", "were", "be"],
  ["Macaroni and cheese ___ on the menu today.", "is", "are", "be"],
] as const;

const singularLines = join(singularSubjects.map((row) => row.join("|")));

/** joined are subjects with a phrase such as as well as after them, and the verbs that agree and do not. */
const joined = [
  ["The captain, as well as her players, ___ tired after the match.", "is", "are", "being"],
  ["The teacher, along with his students, ___ visiting the museum.", "is", "are", "being"],
  ["The players, together with their coach, ___ on the bus.", "are", "is", "being"],
  ["The mayor, accompanied by two aides, ___ arriving at noon.", "is", "are", "being"],
  ["My sisters, as well as my brother, ___ coming to the wedding.", "are", "is", "being"],
  ["The house, including its gardens, ___ for sale.", "is", "are", "being"],
  ["The ministers, along with the president, ___ in the hall.", "are", "is", "being"],
  ["The author, together with her editors, ___ revised the book.", "has", "have", "having"],
  ["The engine, as well as the wheels, ___ to be replaced.", "needs", "need", "needing"],
  ["The children, with their dog, ___ playing in the yard.", "are", "is", "being"],
  ["The singer, along with the band, ___ touring Europe.", "is", "are", "being"],
  ["The witnesses, as well as the judge, ___ heard the recording.", "have", "has", "having"],
] as const;

const joinedLines = join(joined.map((row) => row.join("|")));

const hardAgreement = topic("grammar", {
  id: "agreement-in-hard-cases",
  title: ["Agreement in Hard Cases", "疑难情况下的主谓一致"],
  summary: [
    "The hardest cases of agreement: *one of those who*, titles and clauses that take a singular verb, and subjects followed by *as well as* or *along with*.",
    "主谓一致中最难的几种情况：*one of those who*、要用单数动词的书名和从句，以及后面跟着 *as well as* 或 *along with* 的主语。",
  ],
  after: ["agreement-with-tricky-subjects", "indefinite-pronouns-and-agreement"],
  points: [
    choose(
      "one-of-those-who",
      ["One of Those Who", "one of those who"],
      [
        "In *one of the players who train every morning*, *who* refers to **the players**, a plural, so its verb is plural: she is one of many who train. But in *the only one of the players who trains every morning*, *who* refers to **the only one**, so its verb is singular: no other player trains. Ask what *who* stands for.",
        "在 *one of the players who train every morning* 中，*who* 指的是 **the players**，是复数，所以它的动词用复数：她是许多训练者之一。但在 *the only one of the players who trains every morning* 中，*who* 指的是 **the only one**，所以动词用单数：别的队员都不训练。要问 *who* 指代的是什么。",
      ],
      ["Which verb agrees with *who*?", "哪个动词与 *who* 一致？"],
      oneOfLines,
      (right, shown) => [
        `"${shown.replace("___", right)}": the verb agrees with what *who* stands for.`,
        `“${shown.replace("___", right)}”：动词与 *who* 所指代的成分一致。`,
      ],
      [
        [
          "*{wrong}* agrees with the wrong word: after *one of the …s who*, *who* means the plural group; after *the only one of the …s who*, it means the one.",
          "*{wrong}* 与错误的词一致：在 *one of the …s who* 之后，*who* 指复数群体；在 *the only one of the …s who* 之后，它指那一个。",
        ],
        ["*{wrong}* is not a finite verb, so the clause would have none.", "*{wrong}* 不是限定动词，从句就没有谓语动词了。"],
      ],
    ),
    choose(
      "titles-clauses-and-dishes",
      ["Titles, Clauses and Dishes", "书名、从句和菜名"],
      [
        "Some subjects look plural but name **one** thing, so they take a singular verb. The title of a work is one work: *The Grapes of Wrath **is** a novel*. A clause as subject, beginning with *what*, *whether* or *that*, is one idea: *What we need **is** more volunteers*. A pair that makes one dish is one thing: *Fish and chips **is** my favorite meal*. So is the name of a field such as *economics*.",
        "有些主语看起来是复数，却指**一个**事物，所以用单数动词。作品的标题指一部作品：*The Grapes of Wrath **is** a novel*。以 *what*、*whether* 或 *that* 开头的从句做主语时，表示一个整体的意思：*What we need **is** more volunteers*。组成一道菜的一对东西是一个整体：*Fish and chips **is** my favorite meal*。像 *economics* 这样的学科名称也是如此。",
      ],
      ["Which verb completes the sentence?", "哪个动词能补全句子？"],
      singularLines,
      (right, shown) => [
        `"${shown.replace("___", right)}": the subject names one title, idea, dish or field.`,
        `“${shown.replace("___", right)}”：主语指的是一个标题、意思、菜或学科。`,
      ],
      [
        ["*{wrong}* treats the subject as plural, but it names one thing.", "*{wrong}* 把主语当成了复数，但它指的是一个事物。"],
        ["*{wrong}* is not a finite verb, so the sentence would have none.", "*{wrong}* 不是限定动词，句子就没有谓语动词了。"],
      ],
    ),
    choose(
      "as-well-as-and-along-with",
      ["As Well As and Along With", "as well as 和 along with"],
      [
        "Phrases such as *as well as*, *along with*, *together with*, *including* and *accompanied by* do not join subjects the way *and* does. The verb agrees with the subject **before** the phrase: *The captain, as well as her players, **is** tired*; *The players, together with their coach, **are** on the bus*. The commas around the phrase are a sign that it can be lifted out.",
        "*as well as*、*along with*、*together with*、*including* 和 *accompanied by* 等短语不像 *and* 那样连接主语。动词与短语**前面**的主语一致：*The captain, as well as her players, **is** tired*；*The players, together with their coach, **are** on the bus*。短语两边的逗号表明它可以被拿掉。",
      ],
      ["Which verb agrees with the subject?", "哪个动词与主语一致？"],
      joinedLines,
      (right, shown) => [
        `"${shown.replace("___", right)}": the verb agrees with the subject before the phrase.`,
        `“${shown.replace("___", right)}”：动词与短语前面的主语一致。`,
      ],
      [
        [
          "*{wrong}* agrees with the noun inside the phrase, not with the subject before it.",
          "*{wrong}* 与短语中的名词一致，而没有与短语前的主语一致。",
        ],
        ["*{wrong}* is not a finite verb, so the sentence would have none.", "*{wrong}* 不是限定动词，句子就没有谓语动词了。"],
      ],
    ),
  ],
});

// Clichés.

/** cliches are a cliché, what it means, two wrong meanings, a sentence with it, a fresh revision and two cliché revisions. */
const cliches = [
  [
    "a piece of cake",
    "very easy",
    "a small reward",
    "a kind of treat",
    "The test was a piece of cake.",
    "I finished the test in ten minutes.",
    "The test was as easy as pie.",
    "The test was a walk in the park.",
  ],
  [
    "a blessing in disguise",
    "something good that first seemed bad",
    "a gift hidden from someone",
    "a secret that brings luck",
    "Losing the job was a blessing in disguise.",
    "Losing the job sent her back to the piano she had abandoned.",
    "Losing the job was a silver lining.",
    "Losing the job was a stroke of luck.",
  ],
  [
    "only time will tell",
    "the answer is not known yet",
    "the clock is wrong",
    "people will gossip",
    "Only time will tell whether the bridge is safe.",
    "Engineers will know after the spring floods whether the bridge is safe.",
    "We will cross that bridge when we come to it.",
    "Time will tell, at the end of the day.",
  ],
  [
    "at the end of the day",
    "in the end, all things considered",
    "in the evening",
    "after a long wait",
    "At the end of the day, the plan failed.",
    "Once the money ran out in March, the plan failed.",
    "When all is said and done, the plan failed.",
    "In the final analysis, the plan bit the dust.",
  ],
  [
    "as busy as a bee",
    "very busy",
    "fond of flowers",
    "easily angered",
    "She was as busy as a bee before the opening.",
    "She answered forty emails before the gallery opened.",
    "She was running around like a headless chicken.",
    "She had her hands full and then some.",
  ],
  [
    "the silence was deafening",
    "no one said anything, and it was striking",
    "the room was very loud",
    "someone lost their hearing",
    "When he finished, the silence was deafening.",
    "When he finished, no one moved; a chair creaked.",
    "When he finished, you could hear a pin drop.",
    "When he finished, the room went dead quiet.",
  ],
  [
    "a melting pot",
    "a place where many cultures mix",
    "a hot kitchen",
    "a dangerous factory",
    "The city is a melting pot.",
    "In one block of the city you can hear Polish, Tagalog and Spanish.",
    "The city is a rich tapestry of cultures.",
    "The city is a mosaic of peoples.",
  ],
  [
    "give it one hundred and ten percent",
    "try as hard as possible",
    "pay too much",
    "count carefully",
    "The coach told us to give it one hundred and ten percent.",
    "The coach told us to sprint every ball until the whistle.",
    "The coach told us to leave it all on the field.",
    "The coach told us to go the extra mile.",
  ],
  [
    "like a well-oiled machine",
    "smoothly, with every part working",
    "noisily and dirtily",
    "against its will",
    "The kitchen ran like a well-oiled machine.",
    "In the kitchen, each cook passed a plate before anyone asked.",
    "The kitchen ran like clockwork.",
    "The kitchen was a well-run ship.",
  ],
  [
    "think outside the box",
    "think in new ways",
    "work outdoors",
    "leave a job",
    "We need to think outside the box.",
    "We could ask the students to design the timetable.",
    "We need to push the envelope.",
    "We need a paradigm shift.",
  ],
] as const;

const clicheLabels = join([
  ...cliches.map(([, , , , sentence]) => `${sentence}|cliché`),
  ...cliches.map(([, , , , , fresh]) => `${fresh}|fresh`),
  ...cliches.map(([, , , , , , other]) => `${other}|cliché`),
]);

const revisionLines = join(cliches.map(([, , , , sentence, fresh, a, b]) => `${sentence}|${fresh}|${a}|${b}`));

const meaningLines = join(cliches.map(([phrase, right, a, b]) => `What does the cliché *${phrase}* say?|${right}|${a}|${b}`));

const freshLanguage = topic("writing", {
  id: "replacing-cliches",
  title: ["Replacing Clichés", "替换陈词滥调"],
  summary: [
    "Clichés, phrases such as *a piece of cake* and *at the end of the day* that were vivid once and are worn out now, and how to replace them with a precise detail.",
    "陈词滥调，即 *a piece of cake* 和 *at the end of the day* 这类曾经生动、如今已被用滥的说法，以及如何用一个准确的细节替换它们。",
  ],
  after: ["choosing-precise-diction"],
  points: [
    choose(
      "what-a-cliche-says",
      ["What a Cliché Says", "陈词滥调说了什么"],
      [
        "A **cliché** is a phrase used so often that readers no longer see it: *a piece of cake*, *only time will tell*, *at the end of the day*. Before you can replace one, know what it says in plain words: *a piece of cake* means *very easy*. Then ask what, in your subject, shows that.",
        "**陈词滥调**是用得太多、读者已经视而不见的说法：*a piece of cake*、*only time will tell*、*at the end of the day*。要替换它，先要知道它用平白的话说是什么意思：*a piece of cake* 的意思是 *very easy*（很容易）。然后问一问，在你写的内容里，什么能表现出这一点。",
      ],
      ["What does this cliché say in plain words?", "这个陈词滥调用平白的话说是什么意思？"],
      meaningLines,
      (right) => [`In plain words it says **${right}**.`, `用平白的话说，它的意思是 **${right}**。`],
      [
        ["*{wrong}* reads the words literally, not as the fixed phrase.", "“{wrong}”是按字面理解，而不是把它当作固定说法。"],
        ["*{wrong}* is not what the phrase is used to say.", "“{wrong}”不是这个说法通常表达的意思。"],
      ],
    ),
    label(
      "cliche-or-fresh",
      ["Cliché or Fresh", "陈词滥调还是新鲜表达"],
      [
        "A sentence built on a cliché tells the reader what to think in borrowed words: *The test was a piece of cake*. A **fresh** sentence shows it with a detail only this subject has: *I finished the test in ten minutes*. Swapping one stock phrase for another, *as easy as pie*, is still a cliché.",
        "建立在陈词滥调上的句子是用借来的话告诉读者该怎么想：*The test was a piece of cake*。**新鲜**的句子用只有这个对象才有的细节来表现：*I finished the test in ten minutes*。用一个现成说法替换另一个，比如 *as easy as pie*，仍然是陈词滥调。",
      ],
      ["Does this sentence lean on a cliché?", "这个句子依赖陈词滥调吗？"],
      clicheLabels,
      {
        cliché: L(
          "陈词滥调",
          "The sentence leans on a stock phrase that readers have met many times.",
          "这个句子依赖读者见过许多次的现成说法。",
          "The sentence says what it means with a detail of its own.",
          "这个句子用自己的细节表达意思。",
        ),
        fresh: L(
          "新鲜",
          "The sentence shows its point with a precise detail, not a stock phrase.",
          "这个句子用准确的细节而不是现成说法来表达意思。",
          "The sentence leans on a stock phrase.",
          "这个句子依赖现成的说法。",
        ),
      },
    ),
    choose(
      "the-fresh-revision",
      ["The Fresh Revision", "新鲜的修改"],
      [
        "To revise a cliché, keep the point and replace the phrase with a detail: what happened, how many, how long, what someone saw or heard. *When he finished, the silence was deafening* becomes *When he finished, no one moved; a chair creaked*. A revision that uses another stock phrase has changed nothing.",
        "修改陈词滥调时，保留要表达的意思，用细节替换那个说法：发生了什么、有多少、多久、某人看到或听到了什么。*When he finished, the silence was deafening* 改成 *When he finished, no one moved; a chair creaked*。用另一个现成说法来改，等于什么也没改。",
      ],
      ["Which revision replaces the cliché with a detail?", "哪个修改用细节替换了陈词滥调？"],
      revisionLines,
      (right) => [`"${right}" keeps the point and shows it with a detail.`, `“${right}”保留了意思，并用细节把它表现了出来。`],
      [
        ['"{wrong}" trades one cliché for another.', "“{wrong}”只是用一个陈词滥调换了另一个。"],
        ['"{wrong}" still leans on stock phrases.', "“{wrong}”仍然依赖现成的说法。"],
      ],
    ),
  ],
});

/** grammarTopics10c are the topics of grade 10 added for agreement in hard cases and fresh language. */
export const grammarTopics10c: readonly TopicDef[] = [hardAgreement, freshLanguage];
