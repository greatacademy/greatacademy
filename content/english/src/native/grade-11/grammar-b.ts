// Grade 11: more grammar for rhetoric and argument: where limiting words such as only and almost go, inversion for
// effect, and the passive that hides who acted.

import type { TopicDef } from "@ga/content";
import { choose, type Label, label, topic } from "../grade-6/kit.ts";

const join = (lines: readonly string[]) => lines.join("\n");

const cap = (s: string) => `${s[0]!.toUpperCase()}${s.slice(1)}`;

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

// Limiting modifiers.

/** scenes are a subject, a verb, an object and a time, for sentences whose only moves. */
const scenes = [
  ["she", "reads", "poetry", "on Sundays"],
  ["the shop", "sells", "bread", "in the morning"],
  ["he", "drinks", "coffee", "at work"],
  ["the museum", "opens", "the east wing", "in summer"],
  ["our coach", "praises", "the captain", "after a win"],
  ["the clinic", "treats", "children", "on weekdays"],
  ["my father", "cooks", "fish", "on Fridays"],
  ["the paper", "prints", "letters", "in winter"],
] as const;

/** onlyLines place only before the subject, the object and the time, each with what it limits. */
const onlyMeanings = join(
  scenes.flatMap(([s, v, o, time]) => [
    `${cap(s)} ${v} only ${o} ${time}.|nothing but ${o}|no one else|at no other time`,
    `Only ${s} ${v} ${o} ${time}.|no one else|nothing but ${o}|at no other time`,
    `${cap(s)} ${v} ${o} only ${time}.|at no other time|nothing but ${o}|no one else`,
  ]),
);

/** nearly are sentences where almost or nearly belongs before a number or an all, not before the verb. */
const nearly = [
  ["almost", "The team lost all its games.", "The team almost lost all its games.", "The team lost almost all its games."],
  ["nearly", "She read every book on the list.", "She nearly read every book on the list.", "She read nearly every book on the list."],
  ["almost", "He ate the whole cake.", "He almost ate the whole cake.", "He ate almost the whole cake."],
  ["nearly", "The storm destroyed every house.", "The storm nearly destroyed every house.", "The storm destroyed nearly every house."],
  ["almost", "We spent all our money.", "We almost spent all our money.", "We spent almost all our money."],
  [
    "nearly",
    "The class finished all the questions.",
    "The class nearly finished all the questions.",
    "The class finished nearly all the questions.",
  ],
  ["just", "I need ten minutes.", "I just need ten minutes.", "I need just ten minutes."],
  ["only", "He has one brother.", "He only has one brother.", "He has only one brother."],
  ["almost", "The jury agreed on every point.", "The jury almost agreed on every point.", "The jury agreed on almost every point."],
  ["nearly", "The flood covered the whole town.", "The flood nearly covered the whole town.", "The flood covered nearly the whole town."],
  [
    "only",
    "The library lends three books at a time.",
    "The library only lends three books at a time.",
    "The library lends only three books at a time.",
  ],
  ["just", "The play lasts an hour.", "The play just lasts an hour.", "The play lasts just an hour."],
] as const;

const placeLines = join(
  nearly.map(([word, base, loose, exact]) => {
    const early = `${cap(word)} ${base[0]!.toLowerCase()}${base.slice(1)}`;
    return `Place *${word}* so that it qualifies the amount: ${base}|${exact}|${loose}|${early}`;
  }),
);

/** squinting are sentences with a modifier that could belong to what comes before it or after it, and clear versions. */
const squinting = [
  ["Students who study often get good grades.", "Students who often study get good grades.", "Students who study get good grades often."],
  ["Running quickly tires me.", "Quickly running tires me.", "Running tires me quickly."],
  ["The doctor said on Monday she would call.", "On Monday, the doctor said she would call.", "The doctor said she would call on Monday."],
  [
    "People who exercise regularly live longer.",
    "People who regularly exercise live longer.",
    "People who exercise live longer, as a rule.",
  ],
  ["Calling often irritates my sister.", "Frequent calling irritates my sister.", "Calling irritates my sister often."],
  [
    "The coach told the players before the game to rest.",
    "Before the game, the coach told the players to rest.",
    "The coach told the players to rest before the game.",
  ],
  [
    "Writers who revise frequently publish more.",
    "Writers who frequently revise publish more.",
    "Writers who revise publish more frequently.",
  ],
  [
    "The mayor promised during the campaign to cut taxes.",
    "During the campaign, the mayor promised to cut taxes.",
    "The mayor promised to cut taxes during the campaign.",
  ],
] as const;

const modifierLabels = join([
  ...squinting.map(([bad]) => `${bad}|ambiguous: could modify either side`),
  ...squinting.flatMap(([, a, b]) => [`${a}|clear`, `${b}|clear`]),
  ...nearly.filter(([word]) => word === "almost" || word === "nearly").map(([, , loose]) => `${loose}|says it did not happen`),
  ...nearly.map(([, , , exact]) => `${exact}|clear`),
]);

const limiting = topic("grammar", {
  id: "placing-limiting-modifiers",
  title: ["Placing Limiting Modifiers", "限定修饰语的位置"],
  summary: [
    "Words such as *only*, *just*, *almost* and *nearly*, which limit the word right after them, and modifiers that squint at two words at once.",
    "*only*、*just*、*almost* 和 *nearly* 等词限定紧跟在它们后面的词，以及同时可能修饰前后两个词的“斜视”修饰语。",
  ],
  after: ["dangling-modifiers"],
  points: [
    choose(
      "what-only-limits",
      ["What Only Limits", "only 限定了什么"],
      [
        "*Only* limits the word or phrase that comes **right after** it. *She reads only poetry on Sundays* means nothing but poetry; *Only she reads poetry on Sundays* means no one else does; *She reads poetry only on Sundays* means at no other time. Moving *only* moves the meaning, so careful writers put it next to what it limits.",
        "*Only* 限定**紧跟在它后面**的词或短语。*She reads only poetry on Sundays* 的意思是只读诗；*Only she reads poetry on Sundays* 的意思是没有别人读；*She reads poetry only on Sundays* 的意思是别的时候不读。*only* 一移动，意思就跟着变，所以认真的作者把它放在它所限定的词旁边。",
      ],
      ["What does *only* limit in this sentence?", "在这个句子里，*only* 限定的是什么？"],
      onlyMeanings,
      (right, shown) => [
        `In "${shown}", *only* comes right before what it limits, so the sentence means **${right}**.`,
        `在“${shown}”中，*only* 紧挨在它所限定的成分之前，所以句子的意思是 **${right}**。`,
      ],
      [
        ["*{wrong}* would need *only* before a different word.", "要表达“{wrong}”，*only* 得放在另一个词前面。"],
        ["*{wrong}* would need *only* in yet another place.", "要表达“{wrong}”，*only* 得放在另一个位置。"],
      ],
    ),
    choose(
      "placing-almost-and-nearly",
      ["Placing Almost and Nearly", "almost 和 nearly 的位置"],
      [
        "*Almost*, *nearly*, *just* and *only* go before the amount they qualify, not before the verb. *The team lost almost all its games* says it lost most of them; *The team almost lost all its games* says it came close to losing but did not. At the start of the sentence they qualify the whole clause, which is rarely what is meant.",
        "*Almost*、*nearly*、*just* 和 *only* 应放在它们所修饰的数量之前，而不是动词之前。*The team lost almost all its games* 说的是输掉了大部分比赛；*The team almost lost all its games* 说的是差点全输但其实没有。放在句首时，它们修饰的是整个分句，这通常不是作者的本意。",
      ],
      ["Which sentence places the word correctly?", "哪个句子把这个词放在了正确的位置？"],
      placeLines,
      (right) => [`"${right}" puts the word right before the amount it qualifies.`, `“${right}”把这个词放在了它所修饰的数量之前。`],
      [
        [
          '"{wrong}" puts the word before the verb, which says the action came close to happening but did not.',
          "“{wrong}”把这个词放在了动词前，意思变成动作差点发生但没有发生。",
        ],
        ['"{wrong}" puts the word at the start, where it qualifies the whole sentence.', "“{wrong}”把这个词放在句首，修饰的是整个句子。"],
      ],
    ),
    label(
      "clear-or-squinting",
      ["Clear or Squinting", "清楚还是斜视"],
      [
        "A **squinting** modifier sits between two words and could belong to either: in *Students who study often get good grades*, *often* could go with *study* or with *get*. Move it so that only one reading is possible. A limiting word before the verb can also say the opposite of what is meant: *She nearly read every book* says she read none of them.",
        "**斜视**修饰语夹在两个词之间，可能属于任何一个：在 *Students who study often get good grades* 中，*often* 既可以修饰 *study*，也可以修饰 *get*。把它移开，让句子只有一种理解。放在动词前的限定词也可能表达与本意相反的意思：*She nearly read every book* 说的是她一本也没读。",
      ],
      ["Is the modifier in this sentence placed clearly?", "这个句子中的修饰语位置清楚吗？"],
      modifierLabels,
      {
        "ambiguous: could modify either side": L(
          "有歧义：可能修饰前后两边",
          "The modifier sits between two words and could belong to either, so the sentence has two readings.",
          "修饰语夹在两个词之间，可能属于任何一个，所以句子有两种理解。",
          "The modifier can belong to only one word here.",
          "这里的修饰语只能属于一个词。",
        ),
        "says it did not happen": L(
          "说成了没有发生",
          "The limiting word sits before the verb, so the sentence says the action came close to happening but did not.",
          "限定词放在动词前，句子的意思变成动作差点发生但没有发生。",
          "The limiting word is not placed before the verb.",
          "限定词没有放在动词之前。",
        ),
        clear: L(
          "清楚",
          "The modifier sits next to the only word it can belong to.",
          "修饰语紧挨着它唯一能修饰的词。",
          "The modifier could belong to two words, or the limiting word sits before the verb.",
          "修饰语可能修饰两个词，或限定词放在了动词之前。",
        ),
      },
    ),
  ],
});

// Inversion for effect.

/** fronted are sentences that put a place or a phrase first and the subject after the verb, with the subject. */
const fronted = [
  ["Into the room walked a stranger.", "a stranger", "the room", "walked"],
  ["On the hill stood an old church.", "an old church", "the hill", "stood"],
  ["Down the stairs came the twins.", "the twins", "the stairs", "came"],
  ["Among the guests was the mayor.", "the mayor", "the guests", "was"],
  ["Across the field ran a fox.", "a fox", "the field", "ran"],
  ["Out of the cave flew a thousand bats.", "a thousand bats", "the cave", "flew"],
  ["Beside the door hung a portrait.", "a portrait", "the door", "hung"],
  ["At the end of the road lies the harbor.", "the harbor", "the road", "lies"],
  ["Under the bridge flowed a slow river.", "a slow river", "the bridge", "flowed"],
  ["Behind the curtain stood the actors.", "the actors", "the curtain", "stood"],
] as const;

const subjectLines = join(fronted.map((row) => row.join("|")));

/** agreeing are inverted sentences with the verb that agrees, one that agrees with the wrong noun, and a form that is not finite. */
const agreeing = [
  ["Among the guests ___ two famous actors.", "were", "was", "being"],
  ["On the table ___ a pile of letters.", "was", "were", "being"],
  ["Behind the house ___ three tall trees.", "stand", "stands", "standing"],
  ["In the box ___ a key and a map.", "were", "was", "being"],
  ["Here ___ the results of the vote.", "are", "is", "being"],
  ["Beyond the hills ___ many small villages.", "lie", "lies", "lying"],
  ["At the heart of the city ___ a quiet park.", "lies", "lie", "lying"],
  ["Gone ___ the days of easy money.", "are", "is", "being"],
  ["Under the bridge ___ the river, wide and slow.", "flows", "flow", "flowing"],
  ["Beside the queen ___ her two sons.", "stand", "stands", "standing"],
  ["Not far from the school ___ a library and a pool.", "are", "is", "being"],
  ["Rarely ___ such courage been seen.", "has", "have", "having"],
] as const;

const agreementLines = join(agreeing.map((row) => row.join("|")));

/** negatives are a plain sentence with a negative or limiting word, its inversion and a wrong inversion. */
const negatives = [
  [
    "I have never seen such a crowd.",
    "Never have I seen such a crowd.",
    "Never I have seen such a crowd.",
    "Never have seen I such a crowd.",
  ],
  [
    "We realized the danger only then.",
    "Only then did we realize the danger.",
    "Only then we realized the danger.",
    "Only then realized we the danger.",
  ],
  [
    "She had hardly sat down when the phone rang.",
    "Hardly had she sat down when the phone rang.",
    "Hardly she had sat down when the phone rang.",
    "Hardly sat she down when the phone rang.",
  ],
  ["He did not speak until the end.", "Not until the end did he speak.", "Not until the end he spoke.", "Not until the end spoke he."],
  [
    "The city has seldom faced such a test.",
    "Seldom has the city faced such a test.",
    "Seldom the city has faced such a test.",
    "Seldom faced the city such a test.",
  ],
  [
    "You must not open this door under any circumstances.",
    "Under no circumstances must you open this door.",
    "Under no circumstances you must open this door.",
    "Under no circumstances open you must this door.",
  ],
  [
    "They had no sooner arrived than it began to snow.",
    "No sooner had they arrived than it began to snow.",
    "No sooner they had arrived than it began to snow.",
    "No sooner arrived they than it began to snow.",
  ],
  [
    "I understood the poem only after reading it twice.",
    "Only after reading it twice did I understand the poem.",
    "Only after reading it twice I understood the poem.",
    "Only after reading it twice understood I the poem.",
  ],
  [
    "The king rarely left the palace.",
    "Rarely did the king leave the palace.",
    "Rarely the king left the palace.",
    "Rarely left the king the palace.",
  ],
  [
    "She not only wrote the play but also directed it.",
    "Not only did she write the play, but she also directed it.",
    "Not only she wrote the play, but she also directed it.",
    "Not only wrote she the play, but she also directed it.",
  ],
  [
    "We had little idea how hard it would be.",
    "Little did we know how hard it would be.",
    "Little we knew how hard it would be.",
    "Little knew we how hard it would be.",
  ],
  [
    "The truth came out only later.",
    "Only later did the truth come out.",
    "Only later the truth came out.",
    "Only later came out the truth.",
  ],
] as const;

const negativeLines = join(negatives.map(([plain, right, keep, verb]) => `${plain}|${right}|${keep}|${verb}`));

const inversion = topic("grammar", {
  id: "inversion-for-effect",
  title: ["Inversion for Effect", "为效果而倒装"],
  summary: [
    "Sentences that put a place, a negative or *only* first and the verb before the subject, as in *Into the room walked a stranger* and *Never have I seen such a crowd*, and the agreement they need.",
    "把地点、否定词或 *only* 放在句首、把动词放在主语前面的句子，如 *Into the room walked a stranger* 和 *Never have I seen such a crowd*，以及它们所需的主谓一致。",
  ],
  after: ["reading-inverted-sentences", "word-order-for-emphasis"],
  points: [
    choose(
      "finding-the-subject",
      ["Finding the Subject", "找出主语"],
      [
        "When a phrase of place or direction comes first, the verb may come before the subject: *Into the room walked **a stranger***. The subject is still the one doing or being: ask *who walked?* The noun in the opening phrase, such as *the room*, belongs to a preposition and is never the subject.",
        "当表示地点或方向的短语放在句首时，动词可以放在主语之前：*Into the room walked **a stranger***。主语仍然是发出动作或处于状态的那个：问一问 *who walked?* 句首短语里的名词，如 *the room*，属于介词，从来不是主语。",
      ],
      ["What is the subject of this sentence?", "这个句子的主语是什么？"],
      subjectLines,
      (right) => [
        `*${right}* is what the verb is about, though it comes after the verb.`,
        `*${right}* 是动词所陈述的对象，虽然它在动词后面。`,
      ],
      [
        [
          "*{wrong}* belongs to the opening phrase, after a preposition, so it cannot be the subject.",
          "*{wrong}* 属于句首的介词短语，不能做主语。",
        ],
        ["*{wrong}* is the verb, not its subject.", "*{wrong}* 是动词，不是主语。"],
      ],
    ),
    choose(
      "agreement-after-inversion",
      ["Agreement After Inversion", "倒装后的主谓一致"],
      [
        "The verb agrees with the subject that follows it, not with the noun of the opening phrase: *Among the guests **were** two famous actors*, *On the table **was** a pile of letters*. Find the subject after the verb, decide whether it is singular or plural, then choose the verb.",
        "动词与它后面的主语一致，而不是与句首短语里的名词一致：*Among the guests **were** two famous actors*，*On the table **was** a pile of letters*。先找出动词后面的主语，判断它是单数还是复数，再选择动词。",
      ],
      ["Which verb agrees with the subject?", "哪个动词与主语一致？"],
      agreementLines,
      (right, shown) => [
        `"${shown.replace("___", right)}": the verb agrees with the subject that comes after it.`,
        `“${shown.replace("___", right)}”：动词与它后面的主语一致。`,
      ],
      [
        [
          "*{wrong}* agrees with the noun of the opening phrase, not with the subject after the verb.",
          "*{wrong}* 与句首短语里的名词一致，而没有与动词后面的主语一致。",
        ],
        ["*{wrong}* is not a finite verb, so the sentence would have none.", "*{wrong}* 不是限定动词，句子就没有谓语动词了。"],
      ],
    ),
    choose(
      "inverting-after-a-negative",
      ["Inverting After a Negative", "否定词后的倒装"],
      [
        "When a negative or limiting word opens a sentence, *never*, *seldom*, *rarely*, *hardly*, *no sooner*, *little*, *not until*, *only then* and *under no circumstances*, an auxiliary comes before the subject, as in a question: *Never **have I** seen such a crowd*. With no auxiliary, add *do*, *does* or *did*: *Only then **did we** realize the danger*. Keeping the usual order, or putting the main verb before the subject, is wrong.",
        "当否定词或限定词放在句首时，如 *never*、*seldom*、*rarely*、*hardly*、*no sooner*、*little*、*not until*、*only then* 和 *under no circumstances*，助动词要像疑问句一样放在主语前面：*Never **have I** seen such a crowd*。没有助动词时，加上 *do*、*does* 或 *did*：*Only then **did we** realize the danger*。保持正常语序，或把实义动词放到主语前面，都是错的。",
      ],
      ["Which sentence opens with the negative correctly?", "哪个句子正确地以否定词开头？"],
      negativeLines,
      (right) => [
        `"${right}" puts an auxiliary before the subject after the opening negative.`,
        `“${right}”在句首否定词之后把助动词放在了主语前面。`,
      ],
      [
        ['"{wrong}" keeps the usual order of subject and verb after the opening word.', "“{wrong}”在句首词之后仍用正常的主谓语序。"],
        ['"{wrong}" puts the main verb, not an auxiliary, before the subject.', "“{wrong}”把实义动词而不是助动词放在了主语前面。"],
      ],
    ),
  ],
});

// The passive that hides who acted.

/** hidden are an agentless passive, the agent it hides, and the active sentence that names them. */
const hidden = [
  ["Mistakes were made.", "the managers", "The managers made mistakes."],
  ["The decision was taken to close the hospital.", "the board", "The board decided to close the hospital."],
  ["Shots were fired at the protesters.", "the police", "The police fired at the protesters."],
  ["The funds were spent on other projects.", "the council", "The council spent the funds on other projects."],
  ["The village was burned to the ground.", "the soldiers", "The soldiers burned the village to the ground."],
  ["Errors were found in the report.", "the auditors", "The auditors found errors in the report."],
  ["The river was polluted for decades.", "the factory", "The factory polluted the river for decades."],
  ["Workers were let go without notice.", "the company", "The company let workers go without notice."],
  ["The documents were destroyed.", "the minister's staff", "The minister's staff destroyed the documents."],
  ["Prices were raised twice this year.", "the landlords", "The landlords raised prices twice this year."],
] as const;

/** apt are passives that suit their purpose: the actor is unknown, obvious or unimportant. */
const apt = [
  "The bridge was built in 1890.",
  "The suspect was arrested last night.",
  "Rice is grown in the south.",
  "The samples were heated to 100 degrees.",
  "The museum was founded by a group of teachers.",
  "My bike was stolen yesterday.",
  "The results will be announced on Friday.",
  "The novel has been translated into forty languages.",
  "The patient was given a new drug.",
  "The letters were written in the eighteenth century.",
];

const agencyLabels = join([
  ...hidden.map(([p]) => `${p}|hides who is responsible`),
  ...apt.map((p) => `${p}|suits its purpose`),
  ...hidden.map(([, , a]) => `${a}|names who acted`),
]);

const revealLines = join(
  hidden.map(([p, agent, active], i) => {
    const other = hidden[(i + 3) % hidden.length]!;
    const vague = p.replace(/\.$/u, ", it is said.");
    return `${p} (The act was by ${agent}.)|${active}|${vague}|${other[2]}`;
  }),
);

const whyLines = join([
  ...hidden
    .slice(0, 6)
    .map(
      ([p, agent]) =>
        `A press release about a scandal says: "${p}" What does the passive do here?|It leaves out who did it, ${agent}, so no one is blamed.|It shows the action is a scientific process.|It names who did it more clearly than the active would.`,
    ),
  ...[
    [
      'A lab report says: "The samples were heated to 100 degrees." Why is the passive apt?',
      "The method matters, not who heated them.",
      "It hides a person who is to blame.",
      "It names who heated them.",
    ],
    [
      'A history book says: "The bridge was built in 1890." Why is the passive apt?',
      "The builders are unknown or unimportant to the point.",
      "It hides a person who is to blame.",
      "It names who built it.",
    ],
    [
      'A news story says: "The suspect was arrested last night." Why is the passive apt?',
      "It is obvious that the police made the arrest.",
      "It hides a person who is to blame.",
      "It names who made the arrest.",
    ],
    [
      'A sign says: "Rice is grown in the south." Why is the passive apt?',
      "The farmers are too many to name, and the crop is the topic.",
      "It hides a person who is to blame.",
      "It names who grows it.",
    ],
    [
      'A report says: "The results will be announced on Friday." Why is the passive apt?',
      "The results are the topic, and who announces them is unimportant.",
      "It hides a person who is to blame.",
      "It names who will announce them.",
    ],
  ].map((row) => row.join("|")),
]);

const agency = topic("grammar", {
  id: "the-passive-and-agency",
  title: ["The Passive and Agency", "被动语态与施动者"],
  summary: [
    "The passive without an agent, which can hide who is responsible, as in *Mistakes were made*, how to tell it from a passive that suits its purpose, and how to name who acted.",
    "不带施动者的被动语态，它可能掩盖责任人，如 *Mistakes were made*；如何把它与恰当使用的被动语态区分开，以及如何点明施动者。",
  ],
  after: ["reducing-nominalizations"],
  points: [
    label(
      "hiding-or-suiting",
      ["Hiding or Suiting", "掩盖还是恰当"],
      [
        "A passive may leave out who acted. That suits its purpose when the actor is unknown (*My bike was stolen*), obvious (*The suspect was arrested*), or beside the point, as in a method (*The samples were heated*). But when someone is responsible for a harm or a choice, a passive with no agent can **hide who is responsible**: *Mistakes were made* does not say by whom. An active sentence **names who acted**.",
        "被动语态可以不提施动者。当施动者未知（*My bike was stolen*）、显而易见（*The suspect was arrested*）或无关紧要时，例如描述方法（*The samples were heated*），这样用是恰当的。但当某人应对一个损害或决定负责时，不带施动者的被动语态就可能**掩盖责任人**：*Mistakes were made* 没有说是谁犯的错。主动句则**点明施动者**。",
      ],
      ["What does the voice of this sentence do?", "这个句子的语态起了什么作用？"],
      agencyLabels,
      {
        "hides who is responsible": L(
          "掩盖责任人",
          "Someone is responsible for this harm or choice, and the passive leaves them out.",
          "有人应对这个损害或决定负责，而被动语态把他们略去了。",
          "No one responsible is left out of this sentence.",
          "这个句子没有略去应负责任的人。",
        ),
        "suits its purpose": L(
          "恰当",
          "The actor is unknown, obvious or beside the point, so the passive keeps the focus where it belongs.",
          "施动者未知、显而易见或无关紧要，被动语态把重点放在了应有的位置。",
          "The passive here leaves out someone who is responsible, or the sentence is active.",
          "这里的被动语态略去了应负责任的人，或者这个句子是主动句。",
        ),
        "names who acted": L(
          "点明施动者",
          "The sentence is active, and its subject is the one who acted.",
          "这个句子是主动句，主语就是施动者。",
          "The sentence does not name who acted as its subject.",
          "这个句子没有把施动者作为主语点明。",
        ),
      },
    ),
    choose(
      "naming-the-actor",
      ["Naming the Actor", "点明施动者"],
      [
        "To name who acted, make the actor the subject and the passive's subject the object: *Mistakes were made* becomes *The managers made mistakes*. Adding *it is said* only hides the actor further, and an active sentence about another actor changes what happened.",
        "要点明施动者，就让施动者做主语，让被动句的主语做宾语：*Mistakes were made* 变成 *The managers made mistakes*。加上 *it is said* 只会把施动者藏得更深；换成关于另一个施动者的主动句，则改变了事实。",
      ],
      ["Which revision names who acted?", "哪个修改点明了施动者？"],
      revealLines,
      (right) => [`"${right}" makes the actor the subject of an active sentence.`, `“${right}”让施动者做了主动句的主语。`],
      [
        [
          '"{wrong}" keeps the passive and adds a vaguer phrase, which hides the actor further.',
          "“{wrong}”保留了被动语态，又加了更含糊的说法，把施动者藏得更深。",
        ],
        ['"{wrong}" is active, but it is about a different act.', "“{wrong}”是主动句，但说的是另一件事。"],
      ],
    ),
    choose(
      "what-the-passive-does-here",
      ["What the Passive Does Here", "被动语态在这里的作用"],
      [
        "In rhetorical analysis, ask what a passive does in its context. In a press release about a failure, a passive with no agent shifts attention from who failed; in a lab report or a history, it keeps the focus on what was done. The same form can be honest in one place and evasive in another.",
        "做修辞分析时，要问被动语态在上下文中起了什么作用。在一份关于失误的新闻稿里，不带施动者的被动语态会把注意力从失误者身上移开；在实验报告或历史书里，它让重点落在做了什么上。同样的形式在一处可能是坦诚的，在另一处则可能是在回避。",
      ],
      ["What does the passive do in this context?", "在这个语境中，被动语态起了什么作用？"],
      whyLines,
      (right) => [`Here: ${right}`, `在这里：${right}`],
      [
        ["That is what a passive does in a different context, not in this one.", "这是被动语态在另一种语境中的作用，不是在这里的作用。"],
        ["A passive with no agent does not name who acted.", "不带施动者的被动语态不会点明施动者。"],
      ],
    ),
  ],
});

/** grammarTopics11b are the grammar topics of grade 11 added for rhetoric and argument. */
export const grammarTopics11b: readonly TopicDef[] = [limiting, inversion, agency];
