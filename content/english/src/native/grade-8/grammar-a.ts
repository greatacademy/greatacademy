// Grade 8: grammar of the first units: verbals, commas and conjunctions in complex sentences, ellipses in
// quotations, the subjunctive of wishes and unreal conditions, and shifts in voice.

import type { TopicDef } from "@ga/content";
import type { ChoiceItem } from "@ga/subject-english";
import { everyPair } from "../../levels/words.ts";
import { choose, field, type Label, label, rows, topic } from "../grade-6/kit.ts";

// Crossed items: frames, people and phrases multiply the lines below into a hundred items or more for each bank.

const join = (lines: readonly string[]) => lines.join("\n");
const upper = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** verbalActs are an -ing form, its base and what follows it. */
const verbalActs = [
  ["sailing", "sail", "around the world"],
  ["painting", "paint", "the old barn"],
  ["climbing", "climb", "the north face"],
  ["building", "build", "a raft"],
  ["learning", "learn", "Arabic"],
  ["repairing", "repair", "the engine"],
  ["mapping", "map", "the coast"],
  ["training", "train", "the horses"],
  ["writing", "write", "the report"],
  ["baking", "bake", "bread for the fair"],
  ["planting", "plant", "the rice"],
  ["exploring", "explore", "the cave"],
] as const;
const gerundEnds = ["was her dream", "took all summer", "made him proud", "became their hobby"] as const;
const infinitiveFrames = ["She hoped", "They planned", "He wanted", "We tried"] as const;
const participleMains = ["she kept a diary", "he whistled a tune", "they lost track of time", "we met an old friend"] as const;
const namingLines = join([
  ...everyPair(verbalActs, gerundEnds).map(([[ing, , rest], end]) => `**${upper(ing)}** ${rest} ${end}.|gerund`),
  ...everyPair(verbalActs, infinitiveFrames).map(([[, base, rest], frame]) => `${frame} **to ${base}** ${rest}.|infinitive`),
  ...everyPair(verbalActs, participleMains).map(([[ing, , rest], main]) => `**${upper(ing)}** ${rest}, ${main}.|participle`),
]);
const helpers = ["She was", "They were", "He is", "We are"] as const;
const describing = [
  ["barking", "dog", "woke the whole street", "The dog was barking all night."],
  ["rising", "tide", "covered the rocks", "The tide is rising fast."],
  ["falling", "leaves", "filled the yard", "The leaves were falling all day."],
  ["howling", "wind", "rattled the windows", "The wind is howling outside."],
  ["sleeping", "baby", "smiled in her dream", "The baby was sleeping in the cradle."],
  ["running", "water", "kept the wheel turning", "The water was running over the dam."],
  ["shining", "stars", "guided the sailors", "The stars were shining over the bay."],
  ["blooming", "roses", "smelled sweet", "The roses are blooming early this year."],
  ["melting", "snow", "flooded the path", "The snow is melting in the sun."],
  ["ringing", "phone", "interrupted the meeting", "The phone was ringing in the hall."],
] as const;
const verbOrVerbal = join([
  ...everyPair(verbalActs, helpers).map(([[ing, , rest], helper]) => `${helper} **${ing}** ${rest}.|main verb`),
  ...everyPair(verbalActs, gerundEnds).map(([[ing, , rest], end]) => `**${upper(ing)}** ${rest} ${end}.|gerund`),
  ...describing.flatMap(([ing, noun, pred, main]) => [
    `The **${ing}** ${noun} ${pred}.|participle`,
    `We watched the **${ing}** ${noun}.|participle`,
    `${main.replace(` ${ing} `, ` **${ing}** `)}|main verb`,
  ]),
]);

/** complexScenes are opening words with clauses, and main clauses that follow from any of them. */
const complexScenes = [
  [
    [
      ["When", "the whistle blew"],
      ["After", "the shift ended"],
      ["As soon as", "the bell rang"],
    ],
    ["the workers went home", "the machines fell silent", "the manager locked the gate"],
  ],
  [
    [
      ["Because", "the river ran dry"],
      ["Since", "the rains failed"],
      ["After", "the dam was built"],
    ],
    ["the mill wheel stopped", "the farmers dug new wells", "the town bought water by the barrel"],
  ],
  [
    [
      ["If", "the valve sticks"],
      ["Unless", "someone checks the gauge"],
      ["Whenever", "the pressure rises"],
    ],
    ["the boiler may burst", "the engine will shake", "the whistle will scream"],
  ],
  [
    [
      ["Before", "the railway came"],
      ["Until", "the canal opened"],
      ["While", "the roads were muddy"],
    ],
    ["goods moved slowly", "letters took weeks", "most people stayed close to home"],
  ],
  [
    [
      ["Once", "the telegraph arrived"],
      ["After", "the cable was laid"],
      ["When", "the line was finished"],
    ],
    ["news crossed the ocean in minutes", "traders learned prices at once", "the newspapers printed fresher stories"],
  ],
] as const;
const contrastEnds = [
  "although it was slow",
  "even though the pay was low",
  "though the hours were long",
  "whereas the old one broke often",
] as const;
const contrastMains = [
  "The machine never broke down",
  "The workers stayed",
  "The factory kept running",
  "The new loom was trusted",
] as const;
const complexMore = join(
  complexScenes.flatMap(([openers, mains]) => openers.flatMap(([conj, clause]) => mains.map((main) => `${conj}|${clause}|${main}`))),
);
const commaNeeds = join([
  ...complexScenes.flatMap(([openers, mains]) =>
    openers.flatMap(([conj, clause]) =>
      mains.flatMap((main) => [
        `${conj} ${clause} ${main}.|comma after the opening clause`,
        `${upper(main)} ${conj.toLowerCase()} ${clause}.|no comma: the clause comes last`,
      ]),
    ),
  ),
  ...everyPair(contrastMains, contrastEnds).map(([main, end]) => `${main} ${end}.|comma before a contrast`),
]);

/** meanings are a relationship, its conjunctions, whether they may open the sentence, and clause pairs. */
const meanings = [
  [
    "time",
    ["when", "after", "as soon as", "once"],
    true,
    [
      ["the whistle blew", "the workers left the mill"],
      ["the rain stopped", "the farmers went back to the fields"],
      ["the train arrived", "the crowd cheered"],
      ["the bell rang", "the children ran outside"],
      ["the sun set", "the lamps were lit"],
      ["the ship docked", "the sailors came ashore"],
    ],
  ],
  [
    "cause",
    ["because", "since"],
    true,
    [
      ["the river ran dry", "the mill closed"],
      ["the bridge was broken", "the carts went the long way"],
      ["the wages were low", "many workers left"],
      ["the road was icy", "the coach drove slowly"],
      ["the lamp was out", "we read by the fire"],
      ["the price of bread rose", "the families ate less"],
      ["the loom was faster", "the weavers lost their jobs"],
      ["the coal was cheap", "the factories grew"],
      ["the boy was sick", "his sister took his shift"],
      ["the gate was locked", "the workers waited outside"],
    ],
  ],
  [
    "condition",
    ["if", "provided that", "as long as"],
    true,
    [
      ["the fuel is dry", "the engine will start"],
      ["the weather holds", "the harvest will be good"],
      ["the bridge is repaired", "the carts can cross"],
      ["you have a pass", "you may enter the mill"],
      ["the river stays high", "the wheel will turn"],
      ["the tickets are cheap", "the hall will be full"],
    ],
  ],
  [
    "contrast",
    ["although", "though", "even though"],
    true,
    [
      ["the work was dangerous", "children were hired"],
      ["the pay was low", "the jobs filled quickly"],
      ["the machine was old", "it never broke down"],
      ["the night was cold", "the guards stayed outside"],
      ["the road was long", "the carts arrived on time"],
      ["the boss was strict", "the workers liked him"],
    ],
  ],
  [
    "purpose",
    ["so that", "in order that"],
    false,
    [
      ["their children could attend school", "the workers saved coins"],
      ["barges could carry coal", "the town built a canal"],
      ["the sailors could see the rocks", "she lit a lamp"],
      ["the wheel would turn smoothly", "they oiled the gears"],
      ["the workers could see better", "the owner added windows"],
      ["the fields would drain", "the farmers dug ditches"],
    ],
  ],
] as const;
const showsLines = join(
  meanings.flatMap(([meaning, conjs, opens, pairs]) =>
    everyPair(conjs as readonly string[], pairs as readonly (readonly [string, string])[]).flatMap(([conj, [clause, main]]) => [
      `${upper(main)} **${conj}** ${clause}.|${meaning}`,
      ...(opens ? [`**${upper(conj)}** ${clause}, ${main}.|${meaning}`] : []),
    ]),
  ),
);
/** fitting are clause pairs with the conjunction that fits and two that do not. */
const fitting = [
  ...meanings[0][3].flatMap(([clause, main]) =>
    (["when", "after", "as soon as"] as const).map((conj) => [conj, clause, main, "although", "unless"] as const),
  ),
  ...meanings[1][3].map(([clause, main]) => ["because", clause, main, "although", "unless"] as const),
  ...meanings[3][3].map(([clause, main]) => ["although", clause, main, "because", "unless"] as const),
  ...(
    [
      ["someone oils the gears", "the wheel will jam"],
      ["it rains soon", "the crops will fail"],
      ["you have a pass", "you cannot enter the mill"],
      ["the bridge is repaired", "the carts cannot cross"],
      ["the guards stay awake", "the fort will fall"],
      ["we leave now", "we will miss the train"],
    ] as const
  ).map(([clause, main]) => ["unless", clause, main, "because", "although"] as const),
];
const fitLines = join([
  ...fitting.flatMap(([conj, clause, main, w0, w1]) => [
    `___ ${clause}, ${main}.|${upper(conj)}|${upper(w0)}|${upper(w1)}`,
    `${upper(main)} ___ ${clause}.|${conj}|${w0}|${w1}`,
  ]),
  ...meanings[4][3].map(([clause, main]) => `${upper(main)} ___ ${clause}.|so that|although|unless`),
]);

/** quoted are a subject with two endings; asides are words that can be cut from the middle. */
const quoted = [
  ["The voyage", "changed how Europeans saw the world", "took three long years"],
  ["The captain", "kept a careful log", "never lost a ship"],
  ["Magellan's fleet", "crossed the Pacific", "ran short of food"],
  ["The new maps", "showed a vast ocean", "were wildly wrong"],
  ["The sailors", "feared the open sea", "ate rats to survive"],
  ["The spice trade", "made a few men rich", "drove the search for new routes"],
] as const;
const asides = [
  "as the records show",
  "according to the ship's log",
  "in the view of most historians",
  "despite years of doubt",
  "for the most part",
  "as one sailor later wrote",
] as const;
const fillers = ["actually", "finally", "clearly", "always", "really"] as const;
const shortenLines = join(
  everyPair(
    quoted.flatMap(([who, a, b]) => [
      [who, a],
      [who, b],
    ]),
    asides,
  ).map(
    ([[who, rest], aside], k) =>
      `Original: "${who}, ${aside}, ${rest}." Leave out "${aside}".|"${who} … ${rest}."|"${who} ${rest}."|"${who} … ${fillers[k % 5]} ${rest}."`,
  ),
);
const negated = [
  ["The captain", "to blame for the wreck"],
  ["The map", "accurate"],
  ["The treaty", "signed by the king"],
  ["The crew", "paid on time"],
  ["The island", "empty"],
  ["The voyage", "a failure"],
  ["The cargo", "lost at sea"],
  ["The letter", "written by Magellan"],
] as const;
const fairLines = join([
  ...everyPair(quoted, asides).flatMap(([[who, a], aside], k) => [
    k % 2 === 0
      ? `Original: "${who}, ${aside}, ${a}." Quoted: "${who} … ${a}."|fair`
      : `Original: "${who}, ${aside}, ${a}." Quoted: "${who} ${a}."|unmarked: no ellipsis`,
  ]),
  ...everyPair(quoted, asides).flatMap(([[who, , b], aside], k) => [
    k % 2 === 1
      ? `Original: "${who}, ${aside}, ${b}." Quoted: "${who} … ${b}."|fair`
      : `Original: "${who}, ${aside}, ${b}." Quoted: "${who} ${b}."|unmarked: no ellipsis`,
  ]),
  ...negated.flatMap(([who, rest]) => [
    `Original: "${who} was not ${rest}." Quoted: "${who} was … ${rest}."|unfair: the meaning changed`,
    `Original: "${who} was never ${rest}." Quoted: "${who} was … ${rest}."|unfair: the meaning changed`,
  ]),
]);

/** unreal are a subject, what it would be, and what would or will follow. */
const unreal = [
  ["the voyage", "shorter", "we would reach home sooner", "we will reach home sooner"],
  ["the king", "wiser", "he would listen to his people", "he will listen to his people"],
  ["my brother", "here", "he would help us", "he will help us"],
  ["the road", "safer", "we would travel at night", "we will travel at night"],
  ["the river", "calmer", "the boats would cross", "the boats will cross"],
  ["the winter", "milder", "the sheep would survive", "the sheep will survive"],
  ["the castle", "closer", "the army would rest there", "the army will rest there"],
  ["the queen", "kinder", "the prisoners would go free", "the prisoners will go free"],
  ["the test", "easier", "everyone would pass", "everyone will pass"],
  ["the market", "open", "we would buy bread", "we will buy bread"],
  ["the bridge", "finished", "the carts would cross", "the carts will cross"],
  ["the weather", "warmer", "the children would swim", "the children will swim"],
  ["the ship", "ready", "the crew would sail", "the crew will sail"],
  ["the harvest", "bigger", "the village would feast", "the village will feast"],
  ["the gate", "open", "the guests would come in", "the guests will come in"],
  ["the map", "clearer", "we would find the pass", "we will find the pass"],
] as const;
const roles = [
  ["the captain", "turn back"],
  ["the mayor", "fix the roads"],
  ["a bird", "fly over the wall"],
  ["taller", "reach the shelf"],
  ["older", "drive the cart"],
  ["rich", "buy the ship"],
] as const;
const people = [
  ["I", "I"],
  ["he", "he"],
  ["she", "she"],
] as const;
const wereLines = join([
  ...unreal.flatMap(([who, what], k) =>
    [`I wish ${who} ___ ${what}.`, `If only ${who} ___ ${what}.`, `Suppose ${who} ___ ${what}.`]
      .filter((_, f) => f !== k % 3)
      .map((frame) => `${frame}|were|was|would be`),
  ),
  ...unreal.map(([who, what, would]) => `If ${who} ___ ${what}, ${would}.|were|was|would be`),
  ...everyPair(people, roles).flatMap(([[p, q], [role, act]]) => [
    `If ${p} ___ ${role}, ${q} would ${act}.|were|was|would be`.replace(/^If i /, "If I "),
    `${p === "I" ? "I wish I" : `I wish ${p}`} ___ ${role}.|were|was|would be`,
  ]),
]);
const realLines = join(
  unreal.flatMap(([who, what, would, will]) => [
    `I wish ${who} were ${what}.|a wish`,
    `If only ${who} were ${what}.|a wish`,
    `If ${who} were ${what}, ${would}.|an unreal condition`,
    `Suppose ${who} were ${what}; ${would}.|an unreal condition`,
    `If ${who} is ${what}, ${will}.|a real possibility`,
  ]),
);

/** voiceDoers can each do every pair of actions in voiceActs. */
const voiceDoers = [
  "The colonists",
  "The farmers",
  "The rebels",
  "The villagers",
  "The sailors",
  "The merchants",
  "The students",
  "The miners",
] as const;
/** voiceActs are a first action, the second action, both in the passive, and an awkward passive. */
const voiceActs = [
  ["wrote a letter", "sent it to the governor", "A letter was written", "it was sent to the governor"],
  ["built a wall", "guarded it day and night", "A wall was built", "it was guarded day and night"],
  ["found an old map", "followed it to the coast", "An old map was found", "it was followed to the coast"],
  ["made a flag", "raised it over the square", "A flag was made", "it was raised over the square"],
  ["dug a well", "shared the water with everyone", "A well was dug", "the water was shared with everyone"],
  ["planned a march", "led it through the town", "A march was planned", "it was led through the town"],
  ["caught a thief", "took him to the judge", "A thief was caught", "he was taken to the judge"],
  ["repaired the bridge", "opened it in May", "The bridge was repaired", "it was opened in May"],
  ["collected the grain", "stored it in the barn", "The grain was collected", "it was stored in the barn"],
] as const;
const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const voiceSpot = join(
  everyPair(voiceDoers, voiceActs).flatMap(([who, [first, second, firstPassive, secondPassive]], k) =>
    k % 3 === 0
      ? [`${who} ${first}, and ${secondPassive}.|active to passive`, `${who} ${first} and ${second}.|no shift`]
      : k % 3 === 1
        ? [`${firstPassive}, and ${lowerFirst(who)} ${second}.|passive to active`, `${who} ${first} and then ${second}.|no shift`]
        : [
            `${who} ${first}, and ${secondPassive}.|active to passive`,
            `${firstPassive}, and ${lowerFirst(who)} ${second}.|passive to active`,
          ],
  ),
);
const voiceKeep = join(
  everyPair(voiceDoers, voiceActs).map(
    ([who, [first, second, , secondPassive]]) => `${who} ${first}, and ___|they ${second}.|${secondPassive}.|${secondPassive} by them.`,
  ),
);

const verbalLabels: Readonly<Record<string, Label>> = {
  gerund: {
    zh: "动名词",
    why: [
      "It ends in *-ing* and works as a noun: it names an activity and could be replaced by *it* or *that*.",
      "它以 *-ing* 结尾，起名词的作用：它指一种活动，可以用 *it* 或 *that* 替换。",
    ],
    not: [
      "A gerund is an *-ing* word used as a noun, and this verbal does not name an activity in that way.",
      "动名词是用作名词的 *-ing* 词，而这个非谓语形式不是这样指一种活动的。",
    ],
  },
  participle: {
    zh: "分词",
    why: [
      "It is an *-ing* or *-ed* form (or an irregular one such as *broken*) that describes a noun, as an adjective would.",
      "它是 *-ing* 或 *-ed* 形式（或 *broken* 这样的不规则形式），像形容词一样描述一个名词。",
    ],
    not: [
      "A participle describes a noun, as an adjective does, and this verbal does not describe one.",
      "分词像形容词一样描述名词，而这个非谓语形式没有描述名词。",
    ],
  },
  infinitive: {
    zh: "不定式",
    why: [
      "It is *to* followed by the base form of a verb, as in *to save* or *to reach*.",
      "它是 *to* 加动词原形，如 *to save* 或 *to reach*。",
    ],
    not: [
      "An infinitive is *to* with the base form of a verb, and this verbal is not.",
      "不定式是 *to* 加动词原形，而这个非谓语形式不是。",
    ],
  },
};

const ingLabels: Readonly<Record<string, Label>> = {
  "main verb": {
    zh: "谓语动词的一部分",
    why: [
      "The *-ing* word follows a helping verb such as *is* or *was* and is part of the sentence's main verb, telling what the subject is doing.",
      "这个 *-ing* 词跟在 *is* 或 *was* 这样的助动词后面，是句子谓语的一部分，说明主语正在做什么。",
    ],
    not: [
      "No helping verb such as *is* or *was* comes before it, so it is not part of the main verb.",
      "它前面没有 *is* 或 *was* 这样的助动词，所以不是谓语的一部分。",
    ],
  },
  gerund: {
    zh: "动名词",
    why: [
      "The *-ing* word names an activity and does a noun's job, such as the subject or the object of the sentence.",
      "这个 *-ing* 词指一种活动，起名词的作用，例如作句子的主语或宾语。",
    ],
    not: ["The *-ing* word does not name an activity as a noun would here.", "这里的 *-ing* 词没有像名词那样指一种活动。"],
  },
  participle: {
    zh: "分词",
    why: [
      "The *-ing* word describes a noun, telling which one or what it is like, as an adjective would.",
      "这个 *-ing* 词描述一个名词，说明是哪一个或是什么样的，就像形容词一样。",
    ],
    not: ["The *-ing* word does not describe a noun here.", "这里的 *-ing* 词没有描述名词。"],
  },
};

const verbals = topic("grammar", {
  id: "identifying-verbals",
  title: ["Identifying Verbals", "辨认非谓语动词"],
  summary: [
    "Gerunds, participles and infinitives are verb forms that do the work of nouns, adjectives and adverbs.",
    "动名词、分词和不定式是起名词、形容词和副词作用的动词形式。",
  ],
  after: ["gerund-and-infinitive-phrases"],
  points: [
    label(
      "naming-the-verbal",
      ["Naming the Verbal", "辨认非谓语形式"],
      [
        "A **verbal** is made from a verb but does not act as the sentence's verb. A **gerund** ends in *-ing* and works as a noun: ***Sailing** was her dream.* A **participle** ends in *-ing*, *-ed* or an irregular ending and works as an adjective: *the **sinking** ship*, *the **frozen** river*. An **infinitive** is *to* with a verb: *She hoped **to reach** the island.*\n\nAsk what job the word does: naming an activity (gerund), describing a noun (participle) or *to* plus a verb (infinitive).",
        "**非谓语动词**由动词变来，但不充当句子的谓语。**动名词**以 *-ing* 结尾，起名词作用：***Sailing** was her dream.* **分词**以 *-ing*、*-ed* 或不规则形式结尾，起形容词作用：*the **sinking** ship*、*the **frozen** river*。**不定式**是 *to* 加动词：*She hoped **to reach** the island.*\n\n问问这个词起什么作用：指一种活动（动名词），描述名词（分词），还是 *to* 加动词（不定式）。",
      ],
      ["What kind of verbal is the word in bold?", "粗体的词是哪种非谓语形式？"],
      `
${namingLines}
        **Sailing** around the world was her dream.|gerund
        The **sinking** ship sent up flares.|participle
        She hoped **to reach** the island by dawn.|infinitive
        **Exhausted** by the storm, the crew slept on deck.|participle
        He gave up **smoking** after the voyage.|gerund
        The captain had a plan **to save** the cargo.|infinitive
        The **frozen** river stopped the explorers.|participle
        **Reading** old maps is his favorite hobby.|gerund
        They climbed the mast **to see** the coast.|infinitive
        The **howling** wind kept everyone awake.|participle
        She was praised for **finding** the leak.|gerund
        **To forgive** him took her many years.|infinitive
        The **broken** compass was useless.|participle
        **Rowing** against the current tired them out.|gerund
        He came home **to tell** his family the news.|infinitive
        The letter, **written** in haste, was hard to read.|participle
        Her greatest talent is **telling** stories.|gerund
        The decision **to leave** was not easy.|infinitive
        **Shaking** with fear, the boy opened the door.|participle
        They argued about **choosing** a new leader.|gerund
        **To win** the race, you must train every day.|infinitive
        The **stolen** jewels were never found.|participle
        **Building** the railway took ten years.|gerund
        She saved her money **to buy** a ticket.|infinitive
        The **rising** tide covered the rocks.|participle
        He is afraid of **flying**.|gerund
        The first person **to cross** the ocean alone was a woman.|infinitive
        **Lost** in the fog, the ship drifted for days.|participle
        **Keeping** a diary helped her remember the journey.|gerund
        They had no wish **to return**.|infinitive
      `,
      verbalLabels,
    ),
    label(
      "verb-or-verbal",
      ["Verb or Verbal?", "谓语还是非谓语？"],
      [
        "Not every *-ing* word is a verbal. After a helping verb such as *is*, *was* or *were*, it is part of the main verb: *The crew **was rowing** toward shore.* Without a helping verb, it is a verbal: a gerund if it names the activity (***Rowing** took all night*), a participle if it describes a noun (*the **rowing** sailors*).",
        "并不是每个 *-ing* 词都是非谓语形式。在 *is*、*was*、*were* 这样的助动词后面，它是谓语的一部分：*The crew **was rowing** toward shore.* 没有助动词时，它是非谓语形式：指活动时是动名词（***Rowing** took all night*），描述名词时是分词（*the **rowing** sailors*）。",
      ],
      ["What is the *-ing* word in bold doing?", "粗体的 *-ing* 词在句中起什么作用？"],
      `
${verbOrVerbal}
        The crew was **rowing** toward shore.|main verb
        **Rowing** toward shore took all night.|gerund
        The **rowing** sailors sang to keep time.|participle
        The wind is **howling** outside.|main verb
        **Howling** at the moon is what wolves are known for.|gerund
        The **howling** wolves kept us awake.|participle
        She was **reading** by candlelight.|main verb
        **Reading** by candlelight hurts your eyes.|gerund
        The girl **reading** by the window is my sister.|participle
        They were **building** a raft.|main verb
        **Building** a raft took three days.|gerund
        The men **building** the raft worked fast.|participle
        He is **shaking** the tree.|main verb
        **Shaking** the tree brought down the apples.|gerund
        **Shaking** with cold, he wrapped himself in a blanket.|participle
        The baby was **crying** all night.|main verb
        **Crying** will not help.|gerund
        The **crying** baby woke the house.|participle
        We are **climbing** the hill.|main verb
        **Climbing** the hill was harder than we expected.|gerund
        The **climbing** roses covered the wall.|participle
        The ship was **sinking** fast.|main verb
        The **sinking** ship sent up flares.|participle
        Nobody could stop the ship's **sinking**.|gerund
        The river is **rising**.|main verb
        The **rising** river flooded the farms.|participle
        The **rising** of the river worried the farmers.|gerund
        She was **singing** in the choir.|main verb
        Her **singing** filled the hall.|gerund
        The **singing** children walked through town.|participle
      `,
      ingLabels,
    ),
  ],
});

// Complex sentences: conjunction|dependent clause|main clause, built in both orders.
const complexLines = rows(`
${complexMore}
  When|the engine started|the whole room shook
  Because|the belt snapped|the machine stopped
  After|the telegraph arrived|news traveled in minutes
  Before|the printing press existed|books were copied by hand
  If|the boiler gets too hot|the valve lets off steam
  Since|the factory opened|the town has doubled in size
  Until|the light bulb was invented|people worked by candlelight
  While|the computer was running|the screen flickered
  As soon as|the switch was pulled|the conveyor began to move
  Unless|someone oils the gears|the wheel will jam
  Whenever|the bell rang|the workers changed shifts
  Once|the code was debugged|the program ran smoothly
  As|the train gathered speed|the passengers cheered
  Wherever|the railway went|new towns appeared
  Because|the parts were all the same size|any worker could fix the machine
`);
const complexItems: ChoiceItem[] = complexLines.flatMap((r) => {
  const conj = field(r, 0);
  const clause = field(r, 1);
  const main = field(r, 2);
  const lower = conj.toLowerCase();
  const cap = (s: string) => `${s[0]?.toUpperCase()}${s.slice(1)}`;
  const words = lower.split(" ");
  const commaAfterConj = (c: string) => `${c},`;
  const lastWithComma = `${words.join(" ")},`;
  return [
    [
      `Join *${main}* and *${lower} ${clause}*, with the *${lower}* clause first.`,
      `${conj} ${clause}, ${main}.`,
      [`${conj} ${clause} ${main}.`, `${commaAfterConj(conj)} ${clause} ${main}.`],
    ],
    [
      `Join *${main}* and *${lower} ${clause}*, with the *${lower}* clause last.`,
      `${cap(main)} ${lower} ${clause}.`,
      [`${cap(main)}, ${lower} ${clause}.`, `${cap(main)} ${lastWithComma} ${clause}.`],
    ],
  ] satisfies ChoiceItem[];
});

const commaLabels: Readonly<Record<string, Label>> = {
  "comma after the opening clause": {
    zh: "开头的从句后加逗号",
    why: [
      "The sentence opens with a dependent clause, so a comma marks where it ends and the main clause begins.",
      "句子以从属从句开头，所以用逗号标出它在哪里结束、主句从哪里开始。",
    ],
    not: [
      "This sentence does not open with a dependent clause, so there is no opening clause to set off.",
      "这个句子不是以从属从句开头的，所以没有需要隔开的开头从句。",
    ],
  },
  "no comma: the clause comes last": {
    zh: "不加逗号：从句在句末",
    why: [
      "The dependent clause comes after the main clause and simply finishes it, so no comma is needed.",
      "从属从句在主句后面，只是把主句补充完整，所以不需要逗号。",
    ],
    not: [
      "Here the clause either opens the sentence or sets up a contrast, so it does need a comma.",
      "这里的从句要么在句首，要么引出对比，所以需要逗号。",
    ],
  },
  "comma before a contrast": {
    zh: "对比前加逗号",
    why: [
      "The clause at the end begins with *although*, *though*, *even though* or *whereas* and turns against the main clause, so a comma comes before it.",
      "句末的从句以 *although*、*though*、*even though* 或 *whereas* 开头，与主句形成对比，所以前面要加逗号。",
    ],
    not: [
      "The clause at the end does not set up a contrast with *although*, *though* or *whereas*.",
      "句末的从句没有用 *although*、*though* 或 *whereas* 引出对比。",
    ],
  },
};

const complexCommas = topic("grammar", {
  id: "commas-in-complex-sentences",
  title: ["Commas in Complex Sentences", "复合句中的逗号"],
  summary: [
    "A dependent clause that opens a sentence takes a comma; one that ends it usually does not, unless it sets up a contrast.",
    "位于句首的从属从句后面要加逗号；位于句末的通常不加，除非它引出对比。",
  ],
  after: ["simple-compound-and-complex-sentences", "commas-after-introductions"],
  points: [
    choose(
      "where-the-comma-goes",
      ["Where the Comma Goes", "逗号的位置"],
      [
        "A **complex sentence** joins a main clause and a dependent clause that begins with a word such as *when*, *because*, *if* or *until*. When the dependent clause comes first, put a comma after it: *When the engine started, the room shook.* When it comes last, leave the comma out: *The room shook when the engine started.* Never put the comma right after the joining word: it belongs to its own clause.",
        "**复合句**由一个主句和一个以 *when*、*because*、*if* 或 *until* 等词开头的从属从句组成。从属从句在前时，在它后面加逗号：*When the engine started, the room shook.* 从属从句在后时，不加逗号：*The room shook when the engine started.* 不要把逗号紧放在连接词后面，连接词属于它自己的从句。",
      ],
      ["Choose the correctly punctuated sentence.", "选出标点正确的句子。"],
      complexItems,
      (right) => [
        `**${right}** puts the comma where the clauses meet only when the dependent clause comes first.`,
        `**${right}** 只在从属从句在前时，才在两个从句交界处加逗号。`,
      ],
      [
        [
          "*{wrong}* gets the comma wrong for where the clause sits: an opening dependent clause needs one, and a closing one does not.",
          "*{wrong}* 的逗号与从句的位置不符：在句首的从属从句后面要加逗号，在句末的不加。",
        ],
        [
          "*{wrong}* puts a comma right after the joining word, cutting it off from its own clause.",
          "*{wrong}* 把逗号紧放在连接词后面，把它和它自己的从句割开了。",
        ],
      ],
    ),
    label(
      "does-it-need-a-comma",
      ["Does It Need a Comma?", "需要逗号吗？"],
      [
        "Three cases cover most complex sentences. A dependent clause that **opens** the sentence takes a comma after it. One that **ends** the sentence takes no comma: *The machine stopped because the belt snapped.* The exception is a clause of **contrast** with *although*, *though*, *even though* or *whereas*, which takes a comma even at the end: *The machine was slow, although it never broke down.*",
        "大多数复合句可以分三种情况。**在句首**的从属从句后面加逗号。**在句末**的不加逗号：*The machine stopped because the belt snapped.* 例外是用 *although*、*though*、*even though* 或 *whereas* 引出的**对比**从句，即使在句末也要加逗号：*The machine was slow, although it never broke down.*",
      ],
      ["The commas have been taken out. Which rule applies to this sentence?", "句子里的逗号已被去掉。哪条规则适用于这个句子？"],
      `
${commaNeeds}
        Although the machine was slow it never broke down.|comma after the opening clause
        The machine never broke down although it was slow.|comma before a contrast
        The machine stopped because the belt snapped.|no comma: the clause comes last
        If the valve sticks the boiler may burst.|comma after the opening clause
        The boiler may burst if the valve sticks.|no comma: the clause comes last
        The old engine burned coal whereas the new one runs on oil.|comma before a contrast
        When the whistle blew the workers left the mill.|comma after the opening clause
        The workers left the mill when the whistle blew.|no comma: the clause comes last
        The telegraph was fast even though each message cost a lot.|comma before a contrast
        Because the parts were identical any worker could replace them.|comma after the opening clause
        Any worker could replace the parts because they were identical.|no comma: the clause comes last
        The first computers filled whole rooms whereas today's fit in a pocket.|comma before a contrast
        Until the bridge was finished the ferry was the only way across.|comma after the opening clause
        The ferry was the only way across until the bridge was finished.|no comma: the clause comes last
        She kept the old typewriter though she rarely used it.|comma before a contrast
        After the code was fixed the program ran without errors.|comma after the opening clause
        The program ran without errors after the code was fixed.|no comma: the clause comes last
        The steam car was quiet although it took twenty minutes to start.|comma before a contrast
        Since the railway arrived the village has grown into a town.|comma after the opening clause
        The village has grown into a town since the railway arrived.|no comma: the clause comes last
        Edison is famous whereas his assistants are forgotten.|comma before a contrast
        While the printer warmed up she checked the pages.|comma after the opening clause
        She checked the pages while the printer warmed up.|no comma: the clause comes last
        The robot could lift a car even though it weighed only a ton.|comma before a contrast
        Unless the battery is charged the drone will not fly.|comma after the opening clause
        The drone will not fly unless the battery is charged.|no comma: the clause comes last
        Early phones were heavy though they could only make calls.|comma before a contrast
        As soon as the power returned the factory started again.|comma after the opening clause
        The factory started again as soon as the power returned.|no comma: the clause comes last
        The first car was slow whereas a horse could gallop faster.|comma before a contrast
      `,
      commaLabels,
    ),
  ],
});

const relationLabels: Readonly<Record<string, Label>> = {
  cause: {
    zh: "原因",
    why: [
      "The joining word gives the reason the main clause happens, as *because* and *since* do.",
      "连接词给出主句发生的原因，就像 *because* 和 *since* 那样。",
    ],
    not: ["The joining word does not give a reason here.", "这里的连接词没有给出原因。"],
  },
  contrast: {
    zh: "对比",
    why: [
      "The joining word sets two ideas against each other, as *although*, *even though* and *whereas* do.",
      "连接词把两个意思对立起来，就像 *although*、*even though* 和 *whereas* 那样。",
    ],
    not: ["The joining word does not set the two ideas against each other.", "连接词没有把两个意思对立起来。"],
  },
  condition: {
    zh: "条件",
    why: [
      "The joining word says what must be true for the main clause to happen, as *if*, *unless* and *provided that* do.",
      "连接词说明主句发生必须满足的条件，就像 *if*、*unless* 和 *provided that* 那样。",
    ],
    not: ["The joining word does not set a condition.", "连接词没有设定条件。"],
  },
  time: {
    zh: "时间",
    why: [
      "The joining word says when the main clause happens, as *when*, *until* and *after* do.",
      "连接词说明主句何时发生，就像 *when*、*until* 和 *after* 那样。",
    ],
    not: ["The joining word does not say when something happens.", "连接词没有说明事情何时发生。"],
  },
  purpose: {
    zh: "目的",
    why: [
      "The joining word says what the main clause is for, as *so that* and *in order that* do.",
      "连接词说明主句的目的，就像 *so that* 和 *in order that* 那样。",
    ],
    not: ["The joining word does not say what something is for.", "连接词没有说明目的。"],
  },
};

const conjunctions = topic("grammar", {
  id: "choosing-the-subordinating-conjunction",
  title: ["Choosing the Subordinating Conjunction", "选择从属连词"],
  summary: [
    "The word that joins a dependent clause tells how the two ideas relate: by cause, contrast, condition, time or purpose.",
    "引出从属从句的词说明两个意思之间的关系：原因、对比、条件、时间或目的。",
  ],
  after: ["simple-compound-and-complex-sentences"],
  points: [
    label(
      "what-the-conjunction-shows",
      ["What the Conjunction Shows", "连词表示的关系"],
      [
        "A **subordinating conjunction** joins a dependent clause to a main clause and tells how they relate. **Cause**: *because*, *since*, *as*. **Contrast**: *although*, *even though*, *whereas*. **Condition**: *if*, *unless*, *provided that*. **Time**: *when*, *until*, *after*, *once*. **Purpose**: *so that*, *in order that*. Some words have two jobs: *since* can mean *because* or *from the time that*, so read the whole sentence.",
        "**从属连词**把从属从句连接到主句上，并说明两者的关系。**原因**：*because*、*since*、*as*。**对比**：*although*、*even though*、*whereas*。**条件**：*if*、*unless*、*provided that*。**时间**：*when*、*until*、*after*、*once*。**目的**：*so that*、*in order that*。有些词身兼两职：*since* 可以表示 *because*，也可以表示“自从”，所以要读完整个句子。",
      ],
      ["What relation does the conjunction in bold show?", "粗体的连词表示什么关系？"],
      `
${showsLines}
        The mill closed **because** the river ran dry.|cause
        **Although** the work was dangerous, children were hired.|contrast
        The engine will start **provided that** the fuel is dry.|condition
        Nobody could leave **until** the whistle blew.|time
        She saved every coin **so that** her brother could go to school.|purpose
        **Since** the trains were cheaper, people stopped using the canals.|cause
        The town has grown **since** the railway arrived.|time
        **Unless** the strike ends, the factory will close.|condition
        The owner grew rich, **whereas** his workers stayed poor.|contrast
        They oiled the gears **in order that** the machine would run quietly.|purpose
        **Once** the furnace was lit, it burned for years.|time
        **As** the wages were low, many families went hungry.|cause
        **Even though** the law was passed, few factories obeyed it.|contrast
        **If** the union holds firm, the owners may agree.|condition
        The workers marched **so that** the city would hear them.|purpose
        **After** the new loom arrived, the weavers lost their jobs.|time
        The bridge was built **because** the ferry was too slow.|cause
        **Though** the smog was thick, the trains kept running.|contrast
        The miners went down **provided that** the lamps were safe.|condition
        **When** the bell rang, the children ran from the mill.|time
        She spoke slowly **so that** everyone could understand.|purpose
        **Because** coal was nearby, the factory grew quickly.|cause
        The country was rich in coal, **whereas** its neighbor had none.|contrast
        **Unless** someone checks the boiler, it may burst.|condition
        **Until** the reformers wrote about them, the slums were ignored.|time
        They built the canal **in order that** goods could reach the sea.|purpose
        **Since** the factory paid more, she left the farm.|cause
        **Although** he invented the machine, he never profited from it.|contrast
        The work would be finished by Friday **if** nobody fell ill.|condition
        **As soon as** the power returned, the looms started again.|time
      `,
      relationLabels,
    ),
    choose(
      "the-conjunction-that-fits",
      ["The Conjunction That Fits", "合适的连词"],
      [
        "To choose a conjunction, first decide how the two ideas relate. Does one cause the other? Then *because*. Does one go against what you would expect from the other? Then *although*. Must one be true for the other to happen? Then *if* or *unless*. A wrong conjunction makes the sentence say something false: *Because the work was dangerous, children were hired* claims the danger was the reason.",
        "选连词时，先判断两个意思之间是什么关系。一个导致另一个吗？那就用 *because*。一个与从另一个推出的预期相反吗？那就用 *although*。一个必须成立另一个才会发生吗？那就用 *if* 或 *unless*。用错连词会让句子说出不真实的话：*Because the work was dangerous, children were hired* 等于说危险是雇用童工的原因。",
      ],
      ["Which conjunction makes the sentence say what is meant?", "哪个连词能让句子表达出应有的意思？"],
      `
${fitLines}
        ___ the factory paid low wages, workers kept coming from the farms.|Although|Because|Unless
        The machine stopped ___ the belt snapped.|because|although|unless
        You cannot enter the mill ___ you have a pass.|unless|because|although
        ___ the railway was built, the trip took a week.|Before|Because|Unless
        They worked by lamplight ___ the night shift could see.|so that|although|unless
        The town grew quickly, ___ the village nearby stayed small.|whereas|because|so that
        ___ the river flooded, the mill wheel stopped turning.|When|Although|Unless
        The boiler will burst ___ someone releases the steam.|unless|whereas|so that
        ___ the inventor was poor, he kept building new machines.|Although|Because|So that
        Children worked in the mill ___ their families needed the money.|because|although|unless
        The workers waited ___ the owner agreed to meet them.|until|although|so that
        ___ the coal ran out, the mine would close.|If|Although|Whereas
        She studied engineering ___ she could build bridges.|so that|although|unless
        The new loom was faster, ___ the old one was easier to repair.|whereas|because|so that
        ___ the law changed, children under ten could work all day.|Until|Unless|Whereas
        The engine runs well ___ the fuel is clean.|provided that|although|whereas
        ___ the factory was noisy, the workers sang.|Although|Because|Provided that
        The lamps were covered ___ the gas would not explode.|so that|whereas|unless
        The miners struck ___ their pay was cut.|because|although|so that
        The trains will run on time ___ the snow stops.|if|whereas|although
        ___ he had never been to school, he became a great engineer.|Even though|Because|If
        The streets were lit with gas ___ people could walk safely at night.|so that|whereas|unless
        ___ the smog lifted, the city looked clean for a day.|When|Although|Unless
        Wages rose ___ workers were scarce after the war.|because|although|whereas
        The bridge will not open ___ the inspectors approve it.|unless|because|whereas
        ___ the city had tall factories, the countryside stayed green.|Whereas|Because|So that
        She left the mill ___ she had saved enough for a shop.|once|although|unless
        The owner built houses for his workers ___ they would stay.|so that|although|whereas
        ___ the work was hard, the pay was fair.|Although|Because|Unless
        The engine will not start ___ the crank is turned.|unless|whereas|so that
      `,
      (right) => [
        `**${right}** gives the relation the two ideas really have, so the sentence says what is meant.`,
        `**${right}** 表达了两个意思之间真正的关系，所以句子说出了应有的意思。`,
      ],
      [
        [
          "*{wrong}* sets up a different relation, so the sentence would claim something about cause, contrast or time that is not true.",
          "*{wrong}* 建立了另一种关系，句子就会在原因、对比或时间上说出不真实的话。",
        ],
        [
          "*{wrong}* links the ideas in a way that makes no sense here: the clause does not set a condition, a purpose or a contrast of that kind.",
          "*{wrong}* 以说不通的方式连接两个意思：这个从句并没有设定那样的条件、目的或对比。",
        ],
      ],
    ),
  ],
});

const ellipsisLabels: Readonly<Record<string, Label>> = {
  fair: {
    zh: "公正：意思没有改变",
    why: [
      "An ellipsis marks where words were left out, and the shortened quotation still says what the original meant.",
      "省略号标出了删去词语的地方，缩短的引文仍然表达原文的意思。",
    ],
    not: ["This quotation is not a fair shortening of the original.", "这段引文不是对原文的公正缩写。"],
  },
  "unfair: the meaning changed": {
    zh: "不公正：意思被改变了",
    why: [
      "The cut removes words such as *not*, *only* or *but* that the meaning depends on, so the quotation says something the writer did not say.",
      "删去的部分包括 *not*、*only* 或 *but* 这样决定意思的词，所以引文说出了作者没说过的话。",
    ],
    not: ["The cut here does not change what the writer meant.", "这里的删减没有改变作者的意思。"],
  },
  "unmarked: no ellipsis": {
    zh: "未标出：缺少省略号",
    why: [
      "Words are missing from the middle of the quotation, but no ellipsis shows the reader where they were cut.",
      "引文中间缺了词，却没有用省略号告诉读者删在哪里。",
    ],
    not: ["The quotation does not leave words out without marking them.", "这段引文没有不加标记地删去词语。"],
  },
};

const ellipses = topic("grammar", {
  id: "ellipses-in-quotations",
  title: ["Ellipses in Quotations", "引文中的省略号"],
  summary: [
    "An ellipsis (…) shows where words were left out of a quotation, and a fair cut never changes what the writer meant.",
    "省略号（…）标出引文中删去词语的地方，公正的删减从不改变作者的原意。",
  ],
  after: ["dashes-parentheses-and-ellipses", "quoting-accurately"],
  points: [
    choose(
      "shortening-a-quotation",
      ["Shortening a Quotation", "缩短引文"],
      [
        "When you quote only part of a sentence, put an **ellipsis** (three dots: …) where you left words out. The reader then knows the quotation has been shortened. The cut must be fair: leave out only words the meaning does not depend on, never a *not*, an *only* or the second half of a contrast.",
        "只引用句子的一部分时，要在删去词语的地方加**省略号**（三个点：…）。这样读者就知道引文被缩短了。删减必须公正：只删去不影响意思的词，绝不能删掉 *not*、*only* 或对比的后一半。",
      ],
      ["Which shortened quotation is correct and fair?", "哪个缩短的引文正确而公正？"],
      `
${shortenLines}
        Original: "The voyage, which lasted three long years, changed how Europeans saw the world." Leave out the clause about the years.|"The voyage … changed how Europeans saw the world."|"The voyage changed how Europeans saw the world."|"The voyage … actually changed how Europeans saw the world."
        Original: "The captain did not, as some have claimed, abandon his crew." Leave out the words between commas.|"The captain did not … abandon his crew."|"The captain did not abandon his crew."|"The captain did not … finally abandon his crew."
        Original: "Magellan, a Portuguese sailor in the service of Spain, led the fleet." Leave out the description.|"Magellan … led the fleet."|"Magellan led the fleet."|"Magellan … clearly led the fleet."
        Original: "The maps were, for the most part, wildly wrong." Leave out "for the most part".|"The maps were … wildly wrong."|"The maps were wildly wrong."|"The maps were … always wildly wrong."
        Original: "Columbus believed, mistakenly, that he had reached Asia." Leave out "mistakenly".|Quote it whole: "Columbus believed, mistakenly, that he had reached Asia."|"Columbus believed … that he had reached Asia."|"Columbus believed that he had reached Asia."
        Original: "The crew, hungry and sick with scurvy, refused to sail any farther." Leave out the description of the crew.|"The crew … refused to sail any farther."|"The crew refused to sail any farther."|"The crew … truly refused to sail any farther."
        Original: "The new route was faster, but it was far more dangerous." Quote only the first part.|Quote it whole: "The new route was faster, but it was far more dangerous."|"The new route was faster …"|"The new route was faster."
        Original: "Cook's ships, after months at sea, finally reached the coast of Australia." Leave out "after months at sea".|"Cook's ships … finally reached the coast of Australia."|"Cook's ships finally reached the coast of Australia."|"Cook's ships … actually finally reached the coast of Australia."
        Original: "The sextant, a simple brass instrument, allowed sailors to find their latitude." Leave out the description.|"The sextant … allowed sailors to find their latitude."|"The sextant allowed sailors to find their latitude."|"The sextant … finally allowed sailors to find their latitude."
        Original: "The explorers were not the first people to see these lands." Leave out "not the first".|Quote it whole: "The explorers were not the first people to see these lands."|"The explorers were … people to see these lands."|"The explorers were the first people to see these lands."
        Original: "The storm, which struck without warning, sank two of the five ships." Leave out the clause about the warning.|"The storm … sank two of the five ships."|"The storm sank two of the five ships."|"The storm … clearly sank two of the five ships."
        Original: "Life aboard, as one sailor wrote, was hard, cold and dull." Leave out "as one sailor wrote".|"Life aboard … was hard, cold and dull."|"Life aboard was hard, cold and dull."|"Life aboard … always was hard, cold and dull."
        Original: "The expedition was a success only in the eyes of the king." Leave out "only in the eyes of the king".|Quote it whole: "The expedition was a success only in the eyes of the king."|"The expedition was a success …"|"The expedition was a success."
        Original: "The flagship, its sails torn to rags, limped back into port." Leave out the description of the sails.|"The flagship … limped back into port."|"The flagship limped back into port."|"The flagship … truly limped back into port."
        Original: "The island, which the sailors named Hope, had fresh water and fruit." Leave out the clause about the name.|"The island … had fresh water and fruit."|"The island had fresh water and fruit."|"The island … actually had fresh water and fruit."
        Original: "The journey took, according to the ship's log, ninety-eight days." Leave out "according to the ship's log".|"The journey took … ninety-eight days."|"The journey took ninety-eight days."|"The journey took … finally ninety-eight days."
        Original: "Few of the sailors, perhaps one in five, ever saw home again." Leave out "perhaps one in five".|"Few of the sailors … ever saw home again."|"Few of the sailors ever saw home again."|"Few of the sailors … clearly ever saw home again."
        Original: "The armada was large but poorly led." Quote only "The armada was large".|Quote it whole: "The armada was large but poorly led."|"The armada was large …"|"The armada was large."
        Original: "The young cabin boy, only twelve years old, kept a diary of the voyage." Leave out his age.|"The young cabin boy … kept a diary of the voyage."|"The young cabin boy kept a diary of the voyage."|"The young cabin boy … always kept a diary of the voyage."
        Original: "Their maps showed, in great detail, a sea that did not exist." Leave out "in great detail".|"Their maps showed … a sea that did not exist."|"Their maps showed a sea that did not exist."|"Their maps showed … truly a sea that did not exist."
        Original: "The compass, invented in China, reached Europe in the twelfth century." Leave out "invented in China".|"The compass … reached Europe in the twelfth century."|"The compass reached Europe in the twelfth century."|"The compass … actually reached Europe in the twelfth century."
        Original: "The captain rarely, if ever, punished his men." Leave out "if ever".|"The captain rarely … punished his men."|"The captain rarely punished his men."|"The captain rarely … finally punished his men."
        Original: "The trade in spices made a few merchants rich and left many sailors dead." Quote only the first part.|Quote it whole: "The trade in spices made a few merchants rich and left many sailors dead."|"The trade in spices made a few merchants rich …"|"The trade in spices made a few merchants rich."
        Original: "The ship's doctor, who had never been to sea, learned quickly." Leave out the clause about the doctor.|"The ship's doctor … learned quickly."|"The ship's doctor learned quickly."|"The ship's doctor … clearly learned quickly."
        Original: "The new lands were, the explorer insisted, empty and waiting." Leave out "the explorer insisted".|Quote it whole: "The new lands were, the explorer insisted, empty and waiting."|"The new lands were … empty and waiting."|"The new lands were empty and waiting."
        Original: "The fleet sailed west, then south, and at last reached the strait." Leave out "then south".|"The fleet sailed west … and at last reached the strait."|"The fleet sailed west and at last reached the strait."|"The fleet sailed west … always and at last reached the strait."
        Original: "Chinese ships, some longer than a football field, sailed to Africa." Leave out the size.|"Chinese ships … sailed to Africa."|"Chinese ships sailed to Africa."|"Chinese ships … truly sailed to Africa."
        Original: "The voyage was not, by any measure, a failure." Leave out "not, by any measure,".|Quote it whole: "The voyage was not, by any measure, a failure."|"The voyage was … a failure."|"The voyage was a failure."
        Original: "Her letters, written by candlelight in the cabin, describe every storm." Leave out where she wrote them.|"Her letters … describe every storm."|"Her letters describe every storm."|"Her letters … actually describe every storm."
        Original: "The route, though long, avoided the pirates of the coast." Leave out "though long".|"The route … avoided the pirates of the coast."|"The route avoided the pirates of the coast."|"The route … finally avoided the pirates of the coast."
      `,
      (right) => [
        `${right.startsWith("Quote it whole") ? "Any cut here would change the meaning, so" : "The ellipsis marks the cut, and"} the quotation stays true to the original: ${right}`,
        `${right.startsWith("Quote it whole") ? "这里任何删减都会改变意思，所以" : "省略号标出了删减之处，"}引文忠实于原文：${right}`,
      ],
      [
        [
          "*{wrong}* leaves words out without an ellipsis, or with a cut that changes the meaning, so the reader is misled about what the writer said.",
          "*{wrong}* 删去了词却没有省略号，或者删减改变了意思，读者会误解作者说的话。",
        ],
        [
          "*{wrong}* does not match the original: it adds a word the writer never wrote, or cuts away the part that carries the point.",
          "*{wrong}* 与原文不符：它加了作者没写过的词，或者删掉了承载要点的部分。",
        ],
      ],
    ),
    label(
      "is-the-cut-fair",
      ["Is the Cut Fair?", "删减公正吗？"],
      [
        "Check a shortened quotation two ways. First, is every cut marked with an ellipsis? A quotation that drops words silently is **unmarked**. Second, does it still mean what the original meant? A cut that removes *not*, *only*, *rarely* or the second half of a contrast is **unfair**, even with an ellipsis. A cut that only drops a description or an aside, and marks it, is **fair**.",
        "从两方面检查缩短的引文。第一，每处删减都用省略号标出了吗？悄悄删词的引文属于**未标出**。第二，它的意思仍与原文相同吗？删掉 *not*、*only*、*rarely* 或对比后一半的删减是**不公正**的，即使加了省略号也一样。只删去描述或插入语并加以标出的删减是**公正**的。",
      ],
      ["Compare the quotation with the original. What is true of it?", "把引文与原文比较。哪个说法正确？"],
      `
${fairLines}
        Original: "The ship, battered by storms, reached port." Quoted: "The ship … reached port."|fair
        Original: "The ship, battered by storms, reached port." Quoted: "The ship reached port."|unmarked: no ellipsis
        Original: "The captain was not to blame for the wreck." Quoted: "The captain was … to blame for the wreck."|unfair: the meaning changed
        Original: "The map, drawn in 1570, shows the coast." Quoted: "The map … shows the coast."|fair
        Original: "The map, drawn in 1570, shows the coast." Quoted: "The map shows the coast."|unmarked: no ellipsis
        Original: "The plan was bold but foolish." Quoted: "The plan was bold …"|unfair: the meaning changed
        Original: "Only a few sailors survived the winter." Quoted: "… a few sailors survived the winter."|unfair: the meaning changed
        Original: "The crew, after a long debate, chose a new captain." Quoted: "The crew … chose a new captain."|fair
        Original: "The crew, after a long debate, chose a new captain." Quoted: "The crew chose a new captain."|unmarked: no ellipsis
        Original: "The island rarely, if ever, sees a storm." Quoted: "The island … sees a storm."|unfair: the meaning changed
        Original: "The compass, a gift from the king, never failed." Quoted: "The compass … never failed."|fair
        Original: "The compass, a gift from the king, never failed." Quoted: "The compass never failed."|unmarked: no ellipsis
        Original: "The voyage was a failure in every way but one." Quoted: "The voyage was a failure in every way …"|unfair: the meaning changed
        Original: "Her diary, kept for three years, records every port." Quoted: "Her diary … records every port."|fair
        Original: "Her diary, kept for three years, records every port." Quoted: "Her diary records every port."|unmarked: no ellipsis
        Original: "The explorer claimed, wrongly, that the river led to the sea." Quoted: "The explorer claimed … that the river led to the sea."|unfair: the meaning changed
        Original: "The harbor, crowded with ships, smelled of tar." Quoted: "The harbor … smelled of tar."|fair
        Original: "The harbor, crowded with ships, smelled of tar." Quoted: "The harbor smelled of tar."|unmarked: no ellipsis
        Original: "The new ship was fast, though it leaked badly." Quoted: "The new ship was fast …"|unfair: the meaning changed
        Original: "The sailors, tired and hungry, rowed all night." Quoted: "The sailors … rowed all night."|fair
        Original: "The sailors, tired and hungry, rowed all night." Quoted: "The sailors rowed all night."|unmarked: no ellipsis
        Original: "The colony did not survive its first winter." Quoted: "The colony did … survive its first winter."|unfair: the meaning changed
        Original: "The lighthouse, built of granite, still stands." Quoted: "The lighthouse … still stands."|fair
        Original: "The lighthouse, built of granite, still stands." Quoted: "The lighthouse still stands."|unmarked: no ellipsis
        Original: "The king, some historians say, never paid the sailors." Quoted: "The king … never paid the sailors."|unfair: the meaning changed
        Original: "The cook, a man from Lisbon, fed sixty men." Quoted: "The cook … fed sixty men."|fair
        Original: "The cook, a man from Lisbon, fed sixty men." Quoted: "The cook fed sixty men."|unmarked: no ellipsis
        Original: "The route was safe only in summer." Quoted: "The route was safe …"|unfair: the meaning changed
        Original: "The fleet, sailing at dawn, left the bay." Quoted: "The fleet … left the bay."|fair
        Original: "The fleet, sailing at dawn, left the bay." Quoted: "The fleet left the bay."|unmarked: no ellipsis
      `,
      ellipsisLabels,
    ),
  ],
});

const wishLabels: Readonly<Record<string, Label>> = {
  "a wish": {
    zh: "愿望",
    why: [
      "After *wish* or *if only*, the speaker wants something that is not true now, so the verb is *were*.",
      "在 *wish* 或 *if only* 后面，说话人想要的是现在并不真实的事，所以动词用 *were*。",
    ],
    not: ["The sentence does not wish for something with *wish* or *if only*.", "这个句子没有用 *wish* 或 *if only* 表达愿望。"],
  },
  "an unreal condition": {
    zh: "与事实相反的条件",
    why: [
      "The *if* or *as if* clause imagines something that is not true, so the verb is *were* and the main clause has *would*.",
      "*if* 或 *as if* 从句设想的是不真实的事，所以动词用 *were*，主句用 *would*。",
    ],
    not: [
      "The sentence does not imagine an unreal situation after *if* or *as if*.",
      "这个句子没有在 *if* 或 *as if* 后设想不真实的情况。",
    ],
  },
  "a real possibility": {
    zh: "真实的可能",
    why: [
      "The *if* clause speaks of something that may really be or have been true, so the ordinary *is* or *was* is right.",
      "*if* 从句说的是可能真实存在或发生过的事，所以用普通的 *is* 或 *was* 是正确的。",
    ],
    not: ["The situation here is unreal or wished for, not a real possibility.", "这里的情况是不真实的或是愿望，不是真实的可能。"],
  },
};

const wishes = topic("grammar", {
  id: "the-subjunctive-in-wishes-and-conditions",
  title: ["The Subjunctive in Wishes and Unreal Conditions", "愿望和虚拟条件中的虚拟语气"],
  summary: [
    "In formal English, wishes and unreal conditions use were for every subject: I wish it were, if he were king.",
    "在正式英语中，愿望和与事实相反的条件对所有主语都用 were：I wish it were、if he were king。",
  ],
  after: ["the-subjunctive-in-demands-and-proposals"],
  points: [
    choose(
      "were-for-the-unreal",
      ["Were for the Unreal", "用 were 表示不真实"],
      [
        "The **subjunctive** *were* marks something that is not true: a wish (*I wish the voyage **were** shorter*) or an unreal condition (*If he **were** king, he would free the prisoners*; *She acts as if she **were** the queen*). In formal writing, use *were* for every subject, even *I*, *he*, *she* and *it*. Everyday speech often uses *was*, but writing that is careful keeps *were*. A plain *is* would state a fact, not a wish.",
        "**虚拟语气**的 *were* 表示不真实的事：愿望（*I wish the voyage **were** shorter*）或与事实相反的条件（*If he **were** king, he would free the prisoners*；*She acts as if she **were** the queen*）。在正式写作中，所有主语都用 *were*，即使是 *I*、*he*、*she* 和 *it*。日常口语常用 *was*，但严谨的书面语保留 *were*。用平常的 *is* 就是在陈述事实，而不是愿望。",
      ],
      ["Which verb is right in careful, formal writing?", "在严谨的正式写作中，哪个动词是正确的？"],
      `
${wereLines}
        I wish the voyage ___ shorter.|were|was|would be
        If the king ___ wiser, he would listen to his people.|were|was|would be
        She speaks as if she ___ the queen herself.|were|was|would be
        If only the war ___ over.|were|was|would be
        If I ___ the captain, I would turn back.|were|was|would be
        He wishes he ___ braver.|were|was|would be
        If the law ___ fair, the colonists would obey it.|were|was|would be
        The tyrant acted as though he ___ above the law.|were|was|would be
        I wish it ___ possible to vote.|were|was|would be
        If she ___ free, she would go north.|were|was|would be
        If only the ship ___ faster.|were|was|would be
        If the army ___ larger, it could hold the city.|were|was|would be
        They wish their country ___ independent.|were|was|would be
        He talks as if he ___ a hero.|were|was|would be
        If I ___ older, I would join the militia.|were|was|would be
        She wishes the treaty ___ signed already.|were|was|would be
        If the printer ___ caught, he would be jailed.|were|was|would be
        If only my brother ___ here.|were|was|would be
        If the colony ___ richer, it would build schools.|were|was|would be
        I wish the news ___ better.|were|was|would be
        If the queen ___ to hear this, she would be furious.|were|was|would be
        He marched as though he ___ leading an army.|were|was|would be
        If the vote ___ held today, the patriots would win.|were|was|would be
        We wish the meeting ___ shorter.|were|was|would be
        If that ___ true, the letter would prove it.|were|was|would be
        If only the winter ___ milder.|were|was|would be
        If he ___ a citizen, he could vote.|were|was|would be
        She wishes she ___ in Paris.|were|was|would be
        The speaker shouted as if the crowd ___ deaf.|were|was|would be
        If the rebellion ___ to fail, its leaders would hang.|were|was|would be
      `,
      (right) => [
        `**${right}** is the subjunctive: the sentence speaks of something that is not true, so careful writing uses *were* for every subject.`,
        `**${right}** 是虚拟语气：句子说的是不真实的事，所以严谨的书面语对所有主语都用 *were*。`,
      ],
      [
        [
          "*{wrong}* is common in speech, but careful writing uses *were* for a wish or an unreal condition.",
          "*{wrong}* 在口语中很常见，但严谨的书面语在愿望和与事实相反的条件中用 *were*。",
        ],
        [
          "*{wrong}* puts *would* in the clause of the wish or the condition; *would* belongs only in the main clause, and this clause needs *were*.",
          "*{wrong}* 把 *would* 用在了表示愿望或条件的从句里；*would* 只属于主句，这个从句需要 *were*。",
        ],
      ],
    ),
    label(
      "real-or-unreal",
      ["Real or Unreal?", "真实还是不真实？"],
      [
        "Not every *if* needs *were*. If the clause speaks of something that may really be or have been true, use the ordinary verb: *If the letter **was** sent yesterday, it will arrive today.* Use *were* only when the situation is imagined or wished for: *If the letter **were** in French, I could not read it* (it is not in French).",
        "并不是每个 *if* 都要用 *were*。如果从句说的是可能真实存在或发生过的事，就用普通动词：*If the letter **was** sent yesterday, it will arrive today.* 只有在情况是设想的或是愿望时才用 *were*：*If the letter **were** in French, I could not read it*（信并不是法语写的）。",
      ],
      ["What does the sentence describe?", "这个句子描述的是什么？"],
      `
${realLines}
        I wish the colony were free.|a wish
        If the king were here, he would see the damage.|an unreal condition
        If the messenger was here this morning, he left a letter.|a real possibility
        If only the bridge were open.|a wish
        She talks as if she were the governor.|an unreal condition
        If the ship is late, we will wait.|a real possibility
        He wishes his father were alive to see this.|a wish
        If I were a bird, I would fly over the wall.|an unreal condition
        If the fort was taken last night, the road is closed.|a real possibility
        If only the people were allowed to vote.|a wish
        If the tax were lower, the farmers would pay it.|an unreal condition
        If the printer is arrested, his friends will protest.|a real possibility
        We wish the treaty were fair.|a wish
        He spends money as if he were a prince.|an unreal condition
        If the soldiers were at the gate an hour ago, they are inside now.|a real possibility
        I wish this speech were over.|a wish
        If the city were ours, we would rebuild it.|an unreal condition
        If it is raining, the parade will be cancelled.|a real possibility
        If only my letter were already in her hands.|a wish
        If the law were just, nobody would break it.|an unreal condition
        If the general was wounded, someone else gave the orders.|a real possibility
        She wishes the war were a bad dream.|a wish
        The boy marched as though he were a general.|an unreal condition
        If the vote is close, they will count again.|a real possibility
        If only the night were shorter.|a wish
        If he were president, he would free the slaves.|an unreal condition
        If the guard was asleep, the prisoner escaped easily.|a real possibility
        They wish their homeland were at peace.|a wish
        If the ocean were narrower, the news would travel faster.|an unreal condition
        If the ship arrives today, the letters will be read tonight.|a real possibility
      `,
      wishLabels,
    ),
  ],
});

const voiceLabels: Readonly<Record<string, Label>> = {
  "no shift": {
    zh: "没有转换",
    why: ["Both parts of the sentence keep the same voice, so it reads smoothly.", "句子的两部分保持同一种语态，读起来很流畅。"],
    not: ["This sentence does switch from one voice to the other.", "这个句子确实从一种语态转换成了另一种。"],
  },
  "active to passive": {
    zh: "从主动转为被动",
    why: [
      "The first part has the doer as its subject, and the second suddenly makes the thing done to the subject, with *was* or *were* and a participle.",
      "前半部分以动作的执行者为主语，后半部分却突然以承受动作的事物为主语，用 *was* 或 *were* 加分词。",
    ],
    not: ["The sentence does not move from an active verb to a passive one.", "这个句子没有从主动动词转为被动动词。"],
  },
  "passive to active": {
    zh: "从被动转为主动",
    why: [
      "The first part is passive, with *was* or *were* and a participle, and the second switches to the doer as subject.",
      "前半部分是被动的，用 *was* 或 *were* 加分词，后半部分转为以执行者为主语。",
    ],
    not: ["The sentence does not move from a passive verb to an active one.", "这个句子没有从被动动词转为主动动词。"],
  },
};

const voiceShifts = topic("grammar", {
  id: "shifts-in-voice",
  title: ["Shifts in Voice", "语态的转换"],
  summary: [
    "A sentence that starts in the active voice should not slide into the passive without a reason, or the reader loses track of who acts.",
    "一个句子以主动语态开头，就不应该无故滑向被动语态，否则读者会弄不清是谁在行动。",
  ],
  after: ["active-and-passive-voice", "shifts-in-verb-mood"],
  points: [
    label(
      "spotting-the-shift",
      ["Spotting the Shift", "发现语态的转换"],
      [
        "In the **active** voice the subject does the action: *The colonists signed the petition.* In the **passive**, the subject receives it: *The petition was signed.* A sentence that joins two actions by the same doer should keep one voice. *The colonists wrote a petition, and it was sent to the king* shifts from active to passive and hides who sent it.",
        "在**主动语态**中，主语执行动作：*The colonists signed the petition.* 在**被动语态**中，主语承受动作：*The petition was signed.* 连接同一执行者两个动作的句子应保持一种语态。*The colonists wrote a petition, and it was sent to the king* 从主动转为被动，掩盖了是谁寄出的。",
      ],
      ["Does the sentence shift voice?", "这个句子转换了语态吗？"],
      `
${voiceSpot}
        The colonists wrote a petition, and it was sent to the king.|active to passive
        The colonists wrote a petition and sent it to the king.|no shift
        The tax was announced in March, and the merchants protested at once.|passive to active
        The king announced the tax in March, and the merchants protested at once.|no shift
        The patriots gathered weapons, and they were hidden in a barn.|active to passive
        The patriots gathered weapons and hid them in a barn.|no shift
        The declaration was drafted by Jefferson, and Adams praised it.|passive to active
        Jefferson drafted the declaration, and Adams praised it.|no shift
        The crowd stormed the prison, and the prisoners were freed.|active to passive
        The crowd stormed the prison and freed the prisoners.|no shift
        The letter was written in secret, and the printer copied it.|passive to active
        The writer wrote the letter in secret, and the printer copied it.|no shift
        The militia marched at dawn, and the bridge was reached by noon.|active to passive
        The militia marched at dawn and reached the bridge by noon.|no shift
        The new laws were passed quickly, and the people obeyed them slowly.|passive to active
        The assembly passed the new laws quickly, and the people obeyed them slowly.|no shift
        She organized the meeting, and the speeches were given by her friends.|active to passive
        She organized the meeting, and her friends gave the speeches.|no shift
        The guillotine was built in a week, and the crowds came to watch.|passive to active
        Carpenters built the guillotine in a week, and the crowds came to watch.|no shift
        The general planned the attack, and it was carried out at night.|active to passive
        The general planned the attack and carried it out at night.|no shift
        The flag was sewn by hand, and the women raised it over the fort.|passive to active
        The women sewed the flag by hand and raised it over the fort.|no shift
        The rebels captured the fort, and the cannons were turned on the city.|active to passive
        The rebels captured the fort and turned the cannons on the city.|no shift
        The treaty was signed in Paris, and both sides celebrated.|passive to active
        Both sides signed the treaty in Paris and celebrated.|no shift
        He read the manifesto aloud, and copies were handed to the crowd.|active to passive
        He read the manifesto aloud and handed copies to the crowd.|no shift
      `,
      voiceLabels,
    ),
    choose(
      "keeping-one-voice",
      ["Keeping One Voice", "保持一种语态"],
      [
        "To fix a shift, keep the doer as the subject of both parts and make both verbs active: *The colonists wrote a petition and **sent** it to the king.* Do not fix one shift by making a new one, and do not drop the doer: the reader should still know who did each thing.",
        "要改正语态的转换，就让执行者在两部分中都作主语，两个动词都用主动语态：*The colonists wrote a petition and **sent** it to the king.* 不要用一个新的转换来改正旧的，也不要丢掉执行者：读者应该仍然知道每件事是谁做的。",
      ],
      ["Which version keeps one voice and keeps the doer clear?", "哪个版本保持了一种语态，并且执行者清楚？"],
      `
${voiceKeep}
        The farmers built a wall, and ___|they guarded it day and night.|it was guarded day and night.|day and night it was guarded by someone.
        The crowd surrounded the palace, and ___|it shouted for bread.|bread was shouted for.|the palace was shouted at for bread.
        The rebels wrote a manifesto, and ___|they nailed it to the church door.|it was nailed to the church door.|the church door was where it was nailed.
        The soldiers crossed the river, and ___|they attacked the camp at dawn.|the camp was attacked at dawn.|at dawn an attack on the camp was made.
        The printer set the type, and ___|he printed a thousand copies.|a thousand copies were printed.|copies, a thousand of them, were printed.
        The women made bandages, and ___|they carried them to the hospital.|they were carried to the hospital.|the hospital was where they were carried.
        The council debated the law, and ___|it passed the law by one vote.|the law was passed by one vote.|by one vote the law was passed.
        The general gave the order, and ___|his officers obeyed it at once.|it was obeyed at once.|at once it was obeyed.
        The colonists boycotted the tea, and ___|they dumped it into the harbor.|it was dumped into the harbor.|into the harbor the tea was dumped.
        The students wrote letters, and ___|they mailed them to the senator.|the letters were mailed to the senator.|the senator was mailed the letters.
        The king raised taxes, and ___|he spent the money on wars.|the money was spent on wars.|on wars the money was spent.
        The villagers hid the fugitive, and ___|they fed him for a week.|he was fed for a week.|for a week he was fed.
        The speaker climbed the steps, and ___|she read the declaration aloud.|the declaration was read aloud.|aloud the declaration was read.
        The army besieged the city, and ___|it cut off its food.|its food was cut off.|food for the city was cut off.
        The judge heard the case, and ___|he freed the prisoner.|the prisoner was freed.|freedom was given to the prisoner.
        The assembly wrote a constitution, and ___|it sent it to the states.|it was sent to the states.|the states were sent it.
        The sailors spotted the enemy, and ___|they raised the alarm.|the alarm was raised.|an alarm was raised by somebody.
        The workers built barricades, and ___|they defended them for three days.|they were defended for three days.|for three days they were defended.
        The queen signed the order, and ___|she sealed it with wax.|it was sealed with wax.|with wax it was sealed.
        The patriots elected a leader, and ___|they followed him into battle.|he was followed into battle.|into battle he was followed.
        The governor read the petition, and ___|he tore it in half.|it was torn in half.|in half it was torn.
        The farmers formed a militia, and ___|they drilled every Sunday.|drills were held every Sunday.|every Sunday drilling was done.
        The writer finished the pamphlet, and ___|she sold it for a penny.|it was sold for a penny.|for a penny it was sold.
        The mob broke the windows, and ___|it set the house on fire.|the house was set on fire.|fire was set to the house.
        The delegates signed the document, and ___|they rang the bell.|the bell was rung.|a ringing of the bell was done.
        The guards caught the spy, and ___|they locked him in the tower.|he was locked in the tower.|in the tower he was locked.
        The people stormed the hall, and ___|they demanded a vote.|a vote was demanded.|the hall was where a vote was demanded.
        The engineer designed the cannon, and ___|he tested it on the hill.|it was tested on the hill.|on the hill it was tested.
        The colonists sent a protest, and ___|they waited for an answer.|an answer was waited for.|for an answer there was waiting.
        The leaders met in secret, and ___|they planned the uprising.|the uprising was planned.|in secret the uprising was planned.
      `,
      (right) => [
        `*…${right}* keeps the doer as the subject and the verb active, so the sentence does not shift voice.`,
        `*…${right}* 让执行者继续作主语，动词保持主动，句子就没有转换语态。`,
      ],
      [
        [
          "*{wrong}* turns the second part passive, so the sentence shifts voice and the reader no longer sees who acts.",
          "*{wrong}* 把后半部分变成了被动，句子转换了语态，读者也看不出是谁在行动。",
        ],
        [
          "*{wrong}* is passive and awkward: the doer has dropped out of the sentence altogether.",
          "*{wrong}* 是被动的，而且很别扭：执行者从句子中完全消失了。",
        ],
      ],
    ),
  ],
});

/** grammarTopics8a are the grammar topics of the first units of grade 8. */
export const grammarTopics8a: readonly TopicDef[] = [verbals, complexCommas, conjunctions, ellipses, wishes, voiceShifts];
