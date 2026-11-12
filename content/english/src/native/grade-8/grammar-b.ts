// Grade 8: grammar of the last units: parallel verbals, hyphens in compound modifiers, whoever and whomever,
// inverted sentences, confused words and prepositions before relative pronouns.

import type { TopicDef } from "@ga/content";
import { everyPair } from "../../levels/words.ts";
import { choose, type Label, label, topic } from "../grade-6/kit.ts";

// Crossed items: frames, people and phrases multiply the lines below into a hundred items or more for each bank.

const join = (lines: readonly string[]) => lines.join("\n");
const upper = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** pastimes are an -ing form, a base form and a past form. */
const pastimes = [
  ["reading", "read", "read"],
  ["drawing", "draw", "drew"],
  ["singing", "sing", "sang"],
  ["swimming", "swim", "swam"],
  ["cooking", "cook", "cooked"],
  ["dancing", "dance", "danced"],
  ["painting", "paint", "painted"],
  ["hiking", "hike", "hiked"],
  ["sewing", "sew", "sewed"],
  ["gardening", "garden", "gardened"],
  ["fishing", "fish", "fished"],
  ["writing", "write", "wrote"],
] as const;
const seriesOf = [1, 3, 5].flatMap((step) => pastimes.map((_, k) => [k, (k + step) % 12, (k + step * 2 + 1) % 12] as const));
const gerundOpeners = [
  ["She loved", "she"],
  ["They spent the summer", "they"],
  ["He enjoyed", "he"],
  ["We filled the weekend with", "we"],
] as const;
const infinitiveOpeners = [
  ["She wanted", "she"],
  ["They planned", "they"],
  ["He hoped", "he"],
  ["We decided", "we"],
] as const;
const at = (k: number) => pastimes[k] ?? pastimes[0];
const formLines = join(
  seriesOf.flatMap(([a, b, c], k) => {
    const [x, y, z] = [at(a), at(b), at(c)];
    const [gOpen, gWho] = gerundOpeners[k % 4] ?? gerundOpeners[0];
    const [iOpen, iWho] = infinitiveOpeners[(k + 1) % 4] ?? infinitiveOpeners[0];
    return [
      `${gOpen} ${x[0]}, ${y[0]} and ___.|${z[0]}|to ${z[1]}|${gWho} ${z[2]}`,
      `${iOpen} to ${x[1]}, to ${y[1]} and ___.|to ${z[1]}|${z[0]}|that ${iWho} would ${z[1]}`,
    ];
  }),
);
const seriesLabels = join(
  seriesOf.flatMap(([a, b, c], k) => {
    const [x, y, z] = [at(a), at(b), at(c)];
    const [gOpen] = gerundOpeners[k % 4] ?? gerundOpeners[0];
    const [iOpen, iWho] = infinitiveOpeners[(k + 2) % 4] ?? infinitiveOpeners[0];
    return [
      k % 2 === 0 ? `${gOpen} ${x[0]}, ${y[0]} and ${z[0]}.|parallel` : `${iOpen} to ${x[1]}, to ${y[1]} and to ${z[1]}.|parallel`,
      k % 2 === 0
        ? `${iOpen} to ${x[1]}, ${y[0]} and to ${z[1]}.|mixes gerunds and infinitives`
        : `${gOpen} ${x[0]}, to ${y[1]} and ${z[0]}.|mixes gerunds and infinitives`,
      `${iOpen} to ${x[1]}, to ${y[1]} and that ${iWho} could ${z[1]}.|mixes a verbal with a clause`,
    ];
  }),
);

/** numbers and units make modifiers such as two-year study; famed are modifiers that describe people. */
const counts = ["two", "three", "five", "ten", "twelve", "twenty"] as const;
const units = [
  ["year", "study"],
  ["hour", "flight"],
  ["mile", "hike"],
  ["day", "journey"],
  ["week", "course"],
  ["minute", "speech"],
  ["page", "report"],
  ["story", "building"],
] as const;
const famed = ["well-known", "little-known", "world-famous", "hard-working", "kind-hearted", "award-winning"] as const;
const roles = ["scientist", "painter", "doctor", "teacher", "writer"] as const;
const article = (word: string) => (/^[aeiou]/.test(word) ? "an" : "a");
const joinLines = join([
  ...everyPair(counts, units).map(([n, [unit, noun]]) => `It was a ___.|${n}-${unit} ${noun}|${n} ${unit} ${noun}|${n}-${unit}-${noun}`),
  ...everyPair(famed, roles).map(
    ([mod, role]) => `She met ${article(mod)} ___.|${mod} ${role}|${mod.replace("-", " ")} ${role}|${mod}-${role}`,
  ),
]);
const lyMods = [
  ["highly skilled", "team"],
  ["newly built", "bridge"],
  ["widely read", "book"],
  ["carefully planned", "trip"],
  ["freshly baked", "bread"],
  ["brightly lit", "room"],
  ["badly damaged", "roof"],
  ["deeply moving", "film"],
] as const;
const hyphenLines = join([
  ...everyPair(famed, roles).flatMap(([mod, role], k) => {
    const open = mod.replace("-", " ");
    return k % 2 === 0
      ? [
          `She met ${article(mod)} *${open}* ${role}.|hyphen: it comes before the noun`,
          `The ${role} was *${open}*.|no hyphen: it comes after the noun`,
        ]
      : [
          `The ${role} became *${open}*.|no hyphen: it comes after the noun`,
          `He was ${article(mod)} *${open}* ${role}.|hyphen: it comes before the noun`,
        ];
  }),
  ...everyPair(counts, units)
    .filter((_, k) => k % 2 === 0)
    .map(([n, [unit, noun]]) => `It was a *${n} ${unit}* ${noun}.|hyphen: it comes before the noun`),
  ...lyMods.flatMap(([mod, noun]) => [
    `It was a *${mod}* ${noun}.|no hyphen: the first word ends in -ly`,
    `We saw a *${mod}* ${noun}.|no hyphen: the first word ends in -ly`,
  ]),
]);

/** whoParts feed the who, whom, whoever and whomever items. */
const gifts = ["the lantern", "the key", "the map", "the last candle", "the old book"] as const;
const doers = [
  "goes down to the crypt first",
  "finds the secret door",
  "wakes up first",
  "answers the riddle",
  "reaches the tower",
] as const;
const choosers = [
  ["She will haunt", "she pleases"],
  ["The king will reward", "he chooses"],
  ["You may invite", "you like"],
  ["They will hire", "they trust"],
  ["We will thank", "we meet"],
] as const;
const persons = ["poet", "knight", "lady", "stranger", "servant"] as const;
const personActs = ["wrote the tale", "lived in the tower", "found the ring", "opened the gate", "saw the ghost"] as const;
const personEnds = ["died young", "never came back", "told no one", "left at dawn", "spoke to the king"] as const;
const metVerbs = ["met", "feared", "trusted", "hired", "saw"] as const;
const rightForm = join([
  ...everyPair(gifts, doers).map(([gift, doer]) => `Give ${gift} to ___ ${doer}.|whoever|whomever|whom`),
  ...everyPair(choosers, persons).map(([[opening, rest], person]) => `${opening} ___ ${rest}, even the ${person}.|whomever|whoever|who`),
  ...everyPair(persons, personActs).map(([person, act], k) => `The ${person} ___ ${act} ${personEnds[k % 5]}.|who|whom|whoever`),
  ...everyPair(persons, metVerbs).map(([person, verb], k) => `The ${person} ___ we ${verb} ${personEnds[(k + 2) % 5]}.|whom|who|whomever`),
]);
const preps = ["to", "with", "for", "about", "from"] as const;
const jobLines = join([
  ...everyPair(doers, personEnds).map(([doer, end]) => `**Whoever** ${doer} ${end}.|subject of its clause`),
  ...everyPair(persons, personActs).map(([person, act], k) => `The ${person} **who** ${act} ${personEnds[k % 5]}.|subject of its clause`),
  ...everyPair(persons, metVerbs).map(
    ([person, verb], k) => `The ${person} **whom** we ${verb} ${personEnds[(k + 1) % 5]}.|object of its clause`,
  ),
  ...everyPair(persons, preps).map(
    ([person, prep], k) => `The ${person} **${prep} whom** we wrote ${personEnds[(k + 3) % 5]}.|object of a preposition`,
  ),
]);

/** places open inverted sentences; arrivals and dwellers are a verb and a subject. */
const moving = [
  "Into the hall",
  "Onto the stage",
  "Through the gate",
  "Out of the forest",
  "Down the stairs",
  "Across the bridge",
] as const;
const arrivals = [
  ["burst", "the angry duke"],
  ["rode", "three knights"],
  ["marched", "the royal guard"],
  ["crept", "a hungry fox"],
  ["came", "the old king"],
  ["stumbled", "a weary messenger"],
] as const;
const resting = [
  "On the hill",
  "Beside the river",
  "In the corner",
  "Under the bridge",
  "Behind the door",
  "At the top of the tower",
] as const;
const dwellers = [
  ["stood", "an old oak"],
  ["lay", "a sleeping dog"],
  ["sat", "two old men"],
  ["hid", "a frightened cat"],
  ["was", "a small chest"],
  ["lived", "a lonely giant"],
] as const;
const placeNoun = (place: string) => place.slice(place.indexOf("the "));
const subjectLines = join([
  ...everyPair(moving, arrivals).map(([place, [verb, who]]) => `${place} ${verb} ${who}.|${who}|${placeNoun(place)}|${verb} ${who}`),
  ...everyPair(resting, dwellers).map(([place, [verb, who]]) => `${place} ${verb} ${who}.|${who}|${placeNoun(place)}|${verb} ${who}`),
]);
const agreeing = [
  ["an old oak", "three old oaks", "stand", "stands", "standing"],
  ["a sleeping dog", "two sleeping dogs", "lie", "lies", "lying"],
  ["a lonely giant", "two lonely giants", "live", "lives", "living"],
  ["a small chest", "several small chests", "sit", "sits", "sitting"],
  ["a frightened cat", "two frightened cats", "hide", "hides", "hiding"],
  ["a tall statue", "two tall statues", "stand", "stands", "standing"],
] as const;
const thereThings = [
  ["a letter", "two letters"],
  ["a candle", "three candles"],
  ["a key", "some keys"],
  ["a sword", "two swords"],
  ["a crown", "two crowns"],
  ["a mirror", "four mirrors"],
] as const;
const thereSpots = ["on the table", "in the chest", "by the window", "under the bed", "on the shelf", "near the door"] as const;
const agreeLines = join([
  ...everyPair(resting, agreeing).flatMap(([place, [one, many, base, s, ing]]) => [
    `${place} ___ ${one}.|${s}|${base}|${ing}`,
    `${place} ___ ${many}.|${base}|${s}|${ing}`,
  ]),
  ...everyPair(thereThings, thereSpots).flatMap(([[one, many], spot], k) =>
    k % 2 === 0 ? [`There ___ ${one} ${spot}.|is|are|being`] : [`There ___ ${many} ${spot}.|are|is|being`],
  ),
]);

/** wordFrames are a word, the word it is confused with, and frames with fillers that each take the word. */
type WordFrames = readonly [string, string, readonly (readonly [string, readonly string[]])[]];
/** confusedLines crosses each word's frames with their fillers; the third option comes from another pair. */
const confusedLines = (words: readonly WordFrames[]) =>
  join(
    words.flatMap(([word, partner, frames], i) =>
      frames.flatMap(([frame, fillers]) =>
        fillers.map((filler, j) => {
          const other = words[(i + 2 * (1 + (j % (words.length / 2 - 1)))) % words.length]?.[0] ?? partner;
          return `${frame.replace("{x}", filler)}|${word}|${partner}|${other}`;
        }),
      ),
    ),
  );
const lookAlike: readonly WordFrames[] = [
  [
    "elicit",
    "illicit",
    [
      ["The teacher tried to ___ {x}.", ["an answer from the class", "a smile from the shy boy", "more ideas", "a response", "the truth"]],
      ["Good questions ___ {x}.", ["honest answers", "new ideas", "strong feelings", "long replies", "useful facts"]],
    ],
  ],
  [
    "illicit",
    "elicit",
    [
      [
        "The police found an ___ {x}.",
        ["stash of gold", "copy of the files", "trade in ivory", "factory in the woods", "deal with the smugglers"],
      ],
      [
        "The pirates sold ___ {x}.",
        ["goods at night", "silk in the harbor", "rum to the sailors", "weapons to the rebels", "tea without paying tax"],
      ],
    ],
  ],
  [
    "eminent",
    "imminent",
    [
      ["An ___ {x} spoke at the meeting.", ["historian", "scientist", "judge", "surgeon", "poet"]],
      ["She grew up to be an ___ {x}.", ["lawyer", "architect", "professor", "writer", "explorer"]],
    ],
  ],
  [
    "imminent",
    "eminent",
    [
      ["The sailors could tell that {x} was ___.", ["a storm", "the attack", "danger", "the end", "the flood"]],
      ["With the clouds so dark, {x} seemed ___.", ["rain", "a storm", "thunder", "a flood", "the downpour"]],
    ],
  ],
  [
    "flaunt",
    "flout",
    [
      ["The rich merchant liked to ___ {x}.", ["his gold rings", "his new coach", "his silk coat", "his wealth", "his fine horses"]],
      ["She did not need to ___ {x}.", ["her prize", "her talent", "her new dress", "her medals", "her success"]],
    ],
  ],
  [
    "flout",
    "flaunt",
    [
      ["The smugglers ___ {x} every night.", ["the law", "the curfew", "the rules", "the ban", "the tax laws"]],
      ["Drivers who ___ {x} will be fined.", ["the speed limit", "the parking rules", "the traffic laws", "the ban on horns", "the signs"]],
    ],
  ],
  [
    "ensure",
    "insure",
    [
      [
        "Check the list twice to ___ {x}.",
        [
          "that nothing is missing",
          "that no one is left out",
          "that the facts are right",
          "that every name is spelled right",
          "that the dates match",
        ],
      ],
      [
        "The guards will ___ {x}.",
        [
          "that the gate stays shut",
          "that the king is safe",
          "that no one enters",
          "that the prisoners stay inside",
          "the safety of the guests",
        ],
      ],
    ],
  ],
  [
    "insure",
    "ensure",
    [
      [
        "The family decided to ___ {x}.",
        ["their house against fire", "the new car", "the shop against theft", "the farm against floods", "their boat"],
      ],
      ["It costs a lot to ___ {x}.", ["a racehorse", "a ship and its cargo", "a famous painting", "a diamond ring", "a sports car"]],
    ],
  ],
];
const soundAlike: readonly WordFrames[] = [
  [
    "discreet",
    "discrete",
    [
      ["Please be ___ about {x}.", ["the surprise party", "her illness", "the secret plan", "my grades", "the gift"]],
      ["The ___ {x} kept every secret.", ["servant", "butler", "assistant", "doctor", "banker"]],
      ["He made a ___ {x}.", ["phone call", "exit", "inquiry", "signal", "note"]],
    ],
  ],
  [
    "discrete",
    "discreet",
    [
      ["The project was split into ___ {x}.", ["stages", "parts", "tasks", "steps", "units"]],
      ["Count the ___ {x} in the sample.", ["cells", "grains", "particles", "beads", "seeds"]],
      ["The data fall into ___ {x}.", ["groups", "categories", "classes", "bands", "levels"]],
    ],
  ],
  [
    "censor",
    "censure",
    [
      ["The government tried to ___ {x}.", ["the newspapers", "the film", "the letters", "the radio", "the books"]],
      [
        "The ___ cut {x}.",
        ["three scenes from the movie", "a page from the book", "the soldiers' letters", "the last chapter", "a line from the song"],
      ],
      ["Some schools ___ {x}.", ["student newspapers", "library books", "websites", "school plays", "art shows"]],
    ],
  ],
  [
    "censure",
    "censor",
    [
      ["The council voted to ___ {x}.", ["the mayor", "the senator", "the judge", "the officer", "the chairman"]],
      ["The board issued a ___ of {x}.", ["the manager", "the coach", "the director", "the treasurer", "the captain"]],
      ["The judge received a formal ___ from {x}.", ["the court", "the bar", "the senate", "the panel", "the board"]],
    ],
  ],
  [
    "adverse",
    "averse",
    [
      ["The ship turned back because of ___ {x}.", ["winds", "weather", "seas", "currents", "conditions"]],
      ["The new medicine had ___ {x}.", ["effects", "reactions", "results", "side effects", "outcomes"]],
      ["Farmers suffered from ___ {x}.", ["weather", "prices", "conditions", "rulings", "events"]],
    ],
  ],
  [
    "averse",
    "adverse",
    [
      ["She is not ___ to {x}.", ["hard work", "taking risks", "long walks", "early mornings", "new ideas"]],
      ["My cat is ___ to {x}.", ["water", "loud noises", "strangers", "the cold", "baths"]],
      ["The old captain was ___ to {x}.", ["change", "new maps", "steam engines", "risk", "advice"]],
    ],
  ],
];
const lookAlikeLines = confusedLines(lookAlike);
const soundAlikeLines = confusedLines(soundAlike);

/** placesAndFolk are a noun, its preposition and a clause that ends with that preposition. */
const thingsWith = [
  ["the town", "in", "I lived"],
  ["the island", "to", "they sailed"],
  ["the ship", "on", "we traveled"],
  ["the house", "in", "he grew up"],
  ["the box", "in", "she kept her letters"],
  ["the hill", "from", "we watched the fireworks"],
  ["the bridge", "under", "the boats passed"],
  ["the river", "across", "they swam"],
  ["the chair", "on", "the king sat"],
  ["the book", "about", "she spoke"],
] as const;
const folkWith = [
  ["the friend", "with", "she traveled"],
  ["the captain", "to", "she wrote"],
  ["the woman", "for", "he worked"],
  ["the boy", "about", "they talked"],
  ["the teacher", "from", "I learned the most"],
  ["the neighbor", "with", "we shared the garden"],
  ["the cousin", "to", "he sent the photos"],
  ["the guide", "after", "the town was named"],
] as const;
const relativeEnds = ["was far away", "has changed a lot", "is in my diary", "still matters to me"] as const;
const afterPrep = join([
  ...everyPair(thingsWith, relativeEnds).map(
    ([[noun, prep, clause], end]) => `${upper(noun)} ___ ${clause} ${end}.|${prep} which|${prep} that|${prep} whom`,
  ),
  ...everyPair(folkWith, relativeEnds).map(
    ([[noun, prep, clause], end]) => `${upper(noun)} ___ ${clause} ${end}.|${prep} whom|${prep} who|${prep} which`,
  ),
]);
const subjects = ["I", "she", "they", "we"] as const;
const swapSubject = (clause: string, who: string) => {
  const [, ...rest] = clause.split(" ");
  return `${who} ${rest.join(" ")}`;
};
const formalLines = join([
  ...everyPair(thingsWith, subjects).map(([[noun, prep, clause], who]) => {
    const c = swapSubject(clause, who);
    return `${noun} ${c} ${prep}|${noun} ${prep} which ${c}|${noun} ${prep} which ${c} ${prep}|${noun} ${prep} that ${c}`;
  }),
  ...everyPair(folkWith, subjects).map(([[noun, prep, clause], who]) => {
    const c = swapSubject(clause, who);
    return `${noun} ${c} ${prep}|${noun} ${prep} whom ${c}|${noun} ${prep} whom ${c} ${prep}|${noun} ${prep} that ${c}`;
  }),
]);

const parallelLabels: Readonly<Record<string, Label>> = {
  parallel: {
    zh: "平行",
    why: [
      "Every item in the series has the same form, all gerunds or all infinitives, so the sentence is balanced.",
      "并列的各项形式相同，都是动名词或都是不定式，所以句子是平衡的。",
    ],
    not: ["The items of this series do not all share one form.", "这组并列项的形式并不都相同。"],
  },
  "mixes gerunds and infinitives": {
    zh: "混用了动名词和不定式",
    why: [
      "Some items end in *-ing* and others begin with *to*, so the series breaks its pattern.",
      "有些项以 *-ing* 结尾，有些以 *to* 开头，所以并列打破了自己的格式。",
    ],
    not: ["The series does not mix *-ing* forms with *to* forms.", "这组并列项没有混用 *-ing* 形式和 *to* 形式。"],
  },
  "mixes a verbal with a clause": {
    zh: "混用了非谓语和从句",
    why: [
      "The series begins with verbals but ends with a whole clause that has its own subject, such as *she studied* or *that they rest*.",
      "并列项以非谓语形式开头，最后却是一个有自己主语的完整从句，如 *she studied* 或 *that they rest*。",
    ],
    not: ["No item of the series is a whole clause with its own subject.", "并列项中没有带自己主语的完整从句。"],
  },
};

const parallelVerbals = topic("grammar", {
  id: "parallel-verbals",
  title: ["Parallel Verbals", "平行的非谓语形式"],
  summary: [
    "Verbals in a series share one form: walking, talking and laughing, or to walk, to talk and to laugh.",
    "并列的非谓语形式要保持一致：walking, talking and laughing，或 to walk, to talk and to laugh。",
  ],
  after: ["parallel-structure", "identifying-verbals"],
  points: [
    choose(
      "matching-the-form",
      ["Matching the Form", "形式一致"],
      [
        "When verbals stand in a series, give them all the same form. A list that starts with gerunds keeps to gerunds: *The workers wanted **resting**, **eating** and **sleeping**...* is clumsy, but *They spent Sunday **resting**, **eating** and **sleeping*** is balanced. A list that starts with infinitives keeps to infinitives: *They hoped **to rest**, **to eat** and **to sleep**.* After the first *to*, the others may drop it: *to rest, eat and sleep*.",
        "非谓语形式并列时，要让它们形式相同。以动名词开头的并列要一直用动名词：*They spent Sunday **resting**, **eating** and **sleeping**.* 以不定式开头的并列要一直用不定式：*They hoped **to rest**, **to eat** and **to sleep**.* 第一个 *to* 之后，其余的可以省去 *to*：*to rest, eat and sleep*。",
      ],
      ["Which words complete the series in the same form?", "哪个选项能让并列项形式一致？"],
      `
${formLines}
        The children spent their days spinning, weaving and ___.|sweeping|to sweep|they swept the floor
        The reformers wanted to shorten the hours, to raise the pay and ___.|to close the worst mills|closing the worst mills|they closed the worst mills
        She loved reading, drawing and ___.|singing|to sing|she sang
        The union planned to march, to speak and ___.|to vote|voting|that they vote
        Working long hours, earning little and ___ wore the miners down.|breathing coal dust|to breathe coal dust|they breathed coal dust
        The owner hoped to cut costs, to sell more and ___.|to grow rich|growing rich|he grew rich
        The job meant lifting crates, loading carts and ___.|sweeping the yard|to sweep the yard|he swept the yard
        The children were told to sit still, to stay quiet and ___.|to work hard|working hard|they worked hard
        Cooking, cleaning and ___ filled her evenings.|sewing|to sew|she sewed
        The law aimed to protect children, to limit hours and ___.|to inspect factories|inspecting factories|that inspectors visit factories
        He was tired of waking early, walking far and ___.|working late|to work late|he worked late
        The workers voted to strike, to picket and ___.|to hold out|holding out|they held out
        Saving, planning and ___ helped the family buy a house.|waiting|to wait|they waited
        Her plan was to train, to compete and ___.|to win|winning|she would win
        The machine was good at cutting, folding and ___.|stacking|to stack|it stacked
        They hoped to find work, to earn wages and ___.|to send money home|sending money home|they sent money home
        Smoking chimneys, roaring furnaces and ___ filled the town.|clanging hammers|hammers that clanged|to clang hammers
        The foreman's job was to watch, to warn and ___.|to fine|fining|he fined them
        The boys passed the time joking, wrestling and ___.|racing|to race|they raced
        The city promised to pave the roads, to light the streets and ___.|to clean the water|cleaning the water|it cleaned the water
        Living in a tenement meant sharing a room, sharing a toilet and ___.|sharing the noise|to share the noise|they shared the noise
        She came to the city to work, to learn and ___.|to start again|starting again|she started again
        Mining, smelting and ___ made the region rich.|forging|to forge|they forged
        The children longed to play, to rest and ___.|to see the sun|seeing the sun|they saw the sun
        The guide warned against touching the looms, leaning on the belts and ___.|standing near the furnace|to stand near the furnace|you stood near the furnace
        The inventor wanted to build, to test and ___.|to improve|improving|he improved
        After work, they enjoyed talking, laughing and ___.|telling stories|to tell stories|they told stories
        The reformer's goals were to educate, to feed and ___.|to house the poor|housing the poor|she housed the poor
        Waiting for the doctor, fearing the worst and ___ was the hardest part.|hoping|to hope|she hoped
        They decided to leave the farm, to take the train and ___.|to find a job|finding a job|they found a job
      `,
      (right) => [
        `**${right}** has the same form as the other items, so the series stays parallel.`,
        `**${right}** 与其他并列项形式相同，所以并列保持平行。`,
      ],
      [
        [
          "*{wrong}* switches between *-ing* and *to* forms, breaking the pattern of the series.",
          "*{wrong}* 在 *-ing* 形式和 *to* 形式之间转换，打破了并列的格式。",
        ],
        [
          "*{wrong}* turns the last item into a clause with its own subject, so it no longer matches the verbals before it.",
          "*{wrong}* 把最后一项变成了带自己主语的从句，与前面的非谓语形式不再一致。",
        ],
      ],
    ),
    label(
      "is-the-series-parallel",
      ["Is the Series Parallel?", "并列是否平行？"],
      [
        "To check a series, find its items and look at the first word of each. *-ing*, *-ing*, *-ing* is parallel; *to*, *to*, *to* is parallel. A series that mixes them (*to rest, eating and sleeping*) is not, and neither is one whose last item becomes a clause with its own subject (*resting, eating and they slept*).",
        "检查并列时，找出各项，看每项的第一个词。*-ing*、*-ing*、*-ing* 是平行的；*to*、*to*、*to* 也是平行的。混用两者的并列（*to rest, eating and sleeping*）不平行，最后一项变成带自己主语的从句的并列（*resting, eating and they slept*）也不平行。",
      ],
      ["Is the series in this sentence parallel?", "这个句子里的并列平行吗？"],
      `
${seriesLabels}
        The workers wanted to rest, to eat and to sleep.|parallel
        The workers wanted to rest, eating and to sleep.|mixes gerunds and infinitives
        The workers wanted to rest, to eat and that they could sleep.|mixes a verbal with a clause
        She enjoyed weaving, sewing and knitting.|parallel
        She enjoyed weaving, to sew and knitting.|mixes gerunds and infinitives
        She enjoyed weaving, sewing and she also knitted.|mixes a verbal with a clause
        The law aimed to protect children and to limit their hours.|parallel
        The law aimed to protect children and limiting their hours.|mixes gerunds and infinitives
        The law aimed to protect children and that their hours be limited.|mixes a verbal with a clause
        Digging, hauling and loading coal took all day.|parallel
        Digging, to haul and loading coal took all day.|mixes gerunds and infinitives
        Digging, hauling and the men loaded coal all day.|mixes a verbal with a clause
        The reformers hoped to inform, to shame and to change the owners.|parallel
        The reformers hoped to inform, shaming and to change the owners.|mixes gerunds and infinitives
        The reformers hoped to inform, to shame and the owners would change.|mixes a verbal with a clause
        Travel by train meant buying a ticket, finding a seat and waiting.|parallel
        Travel by train meant buying a ticket, to find a seat and waiting.|mixes gerunds and infinitives
        Travel by train meant buying a ticket, finding a seat and you waited.|mixes a verbal with a clause
        He came to the city to work, learn and save.|parallel
        He came to the city to work, learning and saving.|mixes gerunds and infinitives
        He came to the city to work, to learn and he saved.|mixes a verbal with a clause
        Cleaning the looms and oiling the gears were the boys' jobs.|parallel
        Cleaning the looms and to oil the gears were the boys' jobs.|mixes gerunds and infinitives
        Cleaning the looms and the boys oiled the gears were their jobs.|mixes a verbal with a clause
        The mayor promised to build parks, to open schools and to clean the river.|parallel
        The mayor promised to build parks, opening schools and to clean the river.|mixes gerunds and infinitives
        The mayor promised to build parks, to open schools and the river would be cleaned.|mixes a verbal with a clause
        They passed the evening singing, dancing and talking.|parallel
        They passed the evening singing, to dance and talking.|mixes gerunds and infinitives
        They passed the evening singing, dancing and they talked.|mixes a verbal with a clause
      `,
      parallelLabels,
    ),
  ],
});

const hyphenLabels: Readonly<Record<string, Label>> = {
  "hyphen: it comes before the noun": {
    zh: "加连字符：修饰语在名词前",
    why: [
      "The words work together as one modifier before the noun, so a hyphen joins them: *a well-known scientist*.",
      "这几个词在名词前共同作一个修饰语，所以用连字符连起来：*a well-known scientist*。",
    ],
    not: ["The modifier here does not stand as one unit before a noun.", "这里的修饰语没有作为一个整体放在名词前。"],
  },
  "no hyphen: it comes after the noun": {
    zh: "不加连字符：修饰语在名词后",
    why: [
      "The modifier comes after the noun, usually after a verb such as *is*, so its words stand apart: *The scientist is well known.*",
      "修饰语在名词后面，通常在 *is* 这样的动词后，所以各个词分开写：*The scientist is well known.*",
    ],
    not: ["The modifier here comes before the noun, not after it.", "这里的修饰语在名词前，而不是在名词后。"],
  },
  "no hyphen: the first word ends in -ly": {
    zh: "不加连字符：第一个词以 -ly 结尾",
    why: [
      "The first word is an adverb ending in *-ly*, which clearly modifies the next word, so no hyphen is needed: *a highly trained crew*.",
      "第一个词是以 *-ly* 结尾的副词，它显然修饰后一个词，所以不需要连字符：*a highly trained crew*。",
    ],
    not: ["The first word of the modifier does not end in *-ly*.", "修饰语的第一个词不是以 *-ly* 结尾的。"],
  },
};

const compoundModifiers = topic("grammar", {
  id: "hyphenating-compound-modifiers",
  title: ["Hyphens in Compound Modifiers", "复合修饰语中的连字符"],
  summary: [
    "Two or more words that act as one modifier before a noun are joined by hyphens: a well-known scientist, a five-year study.",
    "在名词前共同作一个修饰语的两个或多个词要用连字符连接：a well-known scientist、a five-year study。",
  ],
  after: ["hyphens"],
  points: [
    choose(
      "joining-the-modifier",
      ["Joining the Modifier", "连接修饰语"],
      [
        "A **compound modifier** is two or more words that together describe a noun. Before the noun, join them with hyphens so the reader takes them as one idea: *a **well-known** scientist*, *a **five-year** study*, *a **slow-moving** glacier*. After the noun they stand apart: *The scientist is **well known**.* Never hyphenate an adverb ending in *-ly*: *a **highly trained** crew*. And the hyphen joins only the modifier, never the noun.",
        "**复合修饰语**是共同描述一个名词的两个或多个词。在名词前，要用连字符把它们连起来，让读者把它们当作一个意思：*a **well-known** scientist*、*a **five-year** study*、*a **slow-moving** glacier*。在名词后则分开写：*The scientist is **well known**.* 以 *-ly* 结尾的副词永远不加连字符：*a **highly trained** crew*。连字符只连接修饰语，不连接名词。",
      ],
      ["Which is hyphenated correctly?", "哪个选项的连字符用法正确？"],
      `
${joinLines}
        Darwin was a ___.|well-known naturalist|well known naturalist|well-known-naturalist
        The finches were studied in a ___.|twenty-year project|twenty year project|twenty-year-project
        The glacier is a ___.|slow-moving river of ice|slow moving river of ice|slow-moving-river of ice
        The paleontologist found a ___.|well-preserved skull|well preserved skull|well-preserved-skull
        The museum has a ___.|life-size model of a mammoth|life size model of a mammoth|life-size-model of a mammoth
        She led a ___.|highly trained team|highly-trained team|highly-trained-team
        The fossil came from a ___.|deep-sea vent|deep sea vent|deep-sea-vent
        The rock formed over a ___.|million-year period|million year period|million-year-period
        The naturalist was ___.|well known|well-known|well-known-ly
        The report described a ___.|carefully planned dig|carefully-planned dig|carefully-planned-dig
        The cheetah is a ___.|fast-running cat|fast running cat|fast-running-cat
        The scientists made a ___.|ground-breaking discovery|ground breaking discovery|ground-breaking-discovery
        The finch has a ___.|seed-cracking beak|seed cracking beak|seed-cracking-beak
        The study was ___.|long term|long-term|long-term-ly
        They built a ___.|well-lit laboratory|well lit laboratory|well-lit-laboratory
        The museum showed a ___.|newly discovered species|newly-discovered species|newly-discovered-species
        The trilobite was a ___.|bottom-dwelling animal|bottom dwelling animal|bottom-dwelling-animal
        Her theory was ___.|widely accepted|widely-accepted|widely-accepted-ly
        The fossil was found in ___.|ten-meter-deep rock|ten meter deep rock|ten-meter-deep-rock
        The explorers kept a ___.|day-by-day record|day by day record|day-by-day-record
        The specimen was ___.|well preserved|well-preserved|well-preserved-ly
        The book is a ___.|beautifully written account|beautifully-written account|beautifully-written-account
        The lizard is a ___.|cold-blooded animal|cold blooded animal|cold-blooded-animal
        The island has a ___.|tree-covered hill|tree covered hill|tree-covered-hill
        This kind of bird is ___.|fast growing|fast-growing|fast-growing-ly
        They found a ___.|half-buried bone|half buried bone|half-buried-bone
        The team used a ___.|specially designed brush|specially-designed brush|specially-designed-brush
        The whale is a ___.|warm-blooded mammal|warm blooded mammal|warm-blooded-mammal
        It was a ___.|two-week voyage|two week voyage|two-week-voyage
        The idea was ___.|hotly debated|hotly-debated|hotly-debated-ly
      `,
      (right) => [
        `**${right}** is right: hyphens join a compound modifier before a noun, but not after the noun and not after an *-ly* word.`,
        `**${right}** 是正确的：名词前的复合修饰语用连字符连接，在名词后或 *-ly* 词后则不用。`,
      ],
      [
        [
          "*{wrong}* gets the hyphen wrong between the words of the modifier: it leaves one out before a noun, or adds one after the noun or after an *-ly* word.",
          "*{wrong}* 在修饰语的词之间用错了连字符：在名词前漏了，或在名词后、*-ly* 词后多加了。",
        ],
        [
          "*{wrong}* carries the hyphen too far, joining words that are not part of one modifier.",
          "*{wrong}* 的连字符用得太多，连上了不属于同一个修饰语的词。",
        ],
      ],
    ),
    label(
      "does-it-need-a-hyphen",
      ["Does It Need a Hyphen?", "需要连字符吗？"],
      [
        "Ask two questions. Does the modifier come **before** the noun? If it comes after, as in *The study was long term*, no hyphen. Does its first word end in **-ly**? If so, as in *a newly found species*, no hyphen. Only a modifier before the noun whose first word is not an *-ly* adverb takes the hyphen: *a long-term study*.",
        "问两个问题。修饰语在名词**前面**吗？如果在后面，如 *The study was long term*，就不加连字符。它的第一个词以 **-ly** 结尾吗？如果是，如 *a newly found species*，也不加连字符。只有在名词前、第一个词不是 *-ly* 副词的修饰语才加连字符：*a long-term study*。",
      ],
      ["The hyphens have been taken out. Which rule applies to the words in italics?", "连字符已被去掉。斜体部分适用哪条规则？"],
      `
${hyphenLines}
        Darwin was a *well known* naturalist.|hyphen: it comes before the noun
        The naturalist was *well known*.|no hyphen: it comes after the noun
        She led a *highly skilled* team.|no hyphen: the first word ends in -ly
        It was a *five year* study.|hyphen: it comes before the noun
        The study lasted *five years*, and it was *long term*.|no hyphen: it comes after the noun
        They found a *newly hatched* turtle.|no hyphen: the first word ends in -ly
        The museum built a *life size* model.|hyphen: it comes before the noun
        The model was *life size*.|no hyphen: it comes after the noun
        It is a *rapidly changing* field.|no hyphen: the first word ends in -ly
        The crocodile is a *cold blooded* animal.|hyphen: it comes before the noun
        The crocodile is *cold blooded*.|no hyphen: it comes after the noun
        The bones were in a *carefully sealed* box.|no hyphen: the first word ends in -ly
        They published a *ground breaking* paper.|hyphen: it comes before the noun
        The paper was *ground breaking*.|no hyphen: it comes after the noun
        It was a *beautifully preserved* fossil.|no hyphen: the first word ends in -ly
        A *slow moving* glacier carved the valley.|hyphen: it comes before the noun
        The glacier is *slow moving*.|no hyphen: it comes after the noun
        She wrote a *widely read* book.|no hyphen: the first word ends in -ly
        The finch has a *short tailed* cousin.|hyphen: it comes before the noun
        The cousin is *short tailed*.|no hyphen: it comes after the noun
        The team found a *nearly complete* skeleton.|no hyphen: the first word ends in -ly
        The guide gave a *two hour* talk.|hyphen: it comes before the noun
        The talk was *two hours* long and *well planned*.|no hyphen: it comes after the noun
        The lab used a *specially built* microscope.|no hyphen: the first word ends in -ly
        The owl is a *night hunting* bird.|hyphen: it comes before the noun
        The bird is *night hunting*.|no hyphen: it comes after the noun
        It was a *poorly lit* cave.|no hyphen: the first word ends in -ly
        They camped on a *rock strewn* beach.|hyphen: it comes before the noun
        The beach was *rock strewn*.|no hyphen: it comes after the noun
        It was a *deeply buried* layer.|no hyphen: the first word ends in -ly
      `,
      hyphenLabels,
    ),
  ],
});

const whoeverLabels: Readonly<Record<string, Label>> = {
  "subject of its clause": {
    zh: "从句的主语",
    why: [
      "The pronoun does the verb of its own clause (*whoever **knocks***, *who **lived***), so it takes the subject form *who* or *whoever*.",
      "代词是它所在从句中动词的执行者（*whoever **knocks***、*who **lived***），所以用主格 *who* 或 *whoever*。",
    ],
    not: ["The pronoun is not the one doing the verb of its clause.", "这个代词不是它所在从句中动词的执行者。"],
  },
  "object of its clause": {
    zh: "从句的宾语",
    why: [
      "Someone else does the verb of the clause, and the pronoun receives it (*whom **she** feared*), so it takes the object form *whom* or *whomever*.",
      "从句的动词由别人执行，代词承受这个动作（*whom **she** feared*），所以用宾格 *whom* 或 *whomever*。",
    ],
    not: ["The pronoun is not the object of a verb in its clause.", "这个代词不是从句中动词的宾语。"],
  },
  "object of a preposition": {
    zh: "介词的宾语",
    why: [
      "The pronoun comes right after a preposition such as *to*, *with* or *for* and belongs to it, so it takes the object form *whom* or *whomever*.",
      "代词紧跟在 *to*、*with* 或 *for* 这样的介词后面并受它支配，所以用宾格 *whom* 或 *whomever*。",
    ],
    not: [
      "The pronoun does not belong to a preposition; check whether the preposition's object is the whole clause instead.",
      "这个代词不受介词支配；要看介词的宾语是否其实是整个从句。",
    ],
  },
};

const whoever = topic("grammar", {
  id: "who-whoever-whom-whomever",
  title: ["Who, Whoever, Whom and Whomever", "who、whoever、whom 和 whomever"],
  summary: [
    "The job a pronoun does in its own clause decides its form: whoever as a subject, whomever as an object.",
    "代词在自己从句中的作用决定它的形式：作主语用 whoever，作宾语用 whomever。",
  ],
  after: ["who-and-whom"],
  points: [
    choose(
      "the-right-form",
      ["The Right Form", "正确的形式"],
      [
        "**Who** and **whoever** are subjects; **whom** and **whomever** are objects. *Whoever* and *whomever* mean *any person who* or *any person whom*, while *who* and *whom* point to a person already named. What decides the form is the job inside the pronoun's **own clause**, not the word before it: *Give the prize to **whoever** finishes first* uses *whoever*, because it is the subject of *finishes*, even though *to* comes before it.",
        "**who** 和 **whoever** 作主语；**whom** 和 **whomever** 作宾语。*whoever* 和 *whomever* 意为“任何……的人”，而 *who* 和 *whom* 指已经提到的人。决定形式的是代词在**自己从句**中的作用，而不是它前面的词：*Give the prize to **whoever** finishes first* 用 *whoever*，因为它是 *finishes* 的主语，尽管前面有 *to*。",
      ],
      ["Which pronoun fits the blank?", "空格里应该填哪个代词？"],
      `
${rightForm}
        Give the lantern to ___ goes down to the crypt first.|whoever|whomever|whom
        The ghost appeared to ___ slept in the east room.|whoever|whomever|whom
        She will haunt ___ she pleases.|whomever|whoever|who
        The poet ___ wrote the tale died young.|who|whom|whoever
        The stranger ___ the villagers feared lived in the mansion.|whom|who|whomever
        ___ enters the house at night will hear the footsteps.|Whoever|Whomever|Whom
        Invite ___ you like to the reading.|whomever|whoever|who
        The narrator, ___ we cannot trust, swears he is sane.|whom|who|whomever
        The prize goes to ___ tells the scariest story.|whoever|whomever|whom
        Speak to ___ answers the door.|whoever|whomever|whom
        The man ___ she married was a ghost.|whom|who|whomever
        ___ wrote this letter knew the secret.|Whoever|Whomever|Whom
        The doctor gave the medicine to ___ needed it.|whoever|whomever|whom
        The girl ___ saw the apparition fainted.|who|whom|whoever
        The writer ___ the critics praised was Poe.|whom|who|whomever
        You may choose ___ you trust to keep the key.|whomever|whoever|who
        The servant, ___ nobody had noticed, slipped away.|whom|who|whomever
        ___ finds the map will find the treasure.|Whoever|Whomever|Whom
        Tell the story to ___ will listen.|whoever|whomever|whom
        The old woman ___ lived alone kept a raven.|who|whom|whoever
        The heir ___ the will named had vanished.|whom|who|whomever
        The castle will belong to ___ the king chooses.|whomever|whoever|who
        Ask ___ is in charge.|whoever|whomever|whom
        The visitor ___ the dog would not let in was a stranger.|whom|who|whomever
        The tale frightens ___ reads it alone.|whoever|whomever|whom
        The boy ___ the ghost followed ran home.|whom|who|whomever
        She asked ___ had seen her brother.|whoever|whomever|whom
        The man ___ built the house never lived in it.|who|whom|whoever
        Leave a candle for ___ comes after us.|whoever|whomever|whom
        The girl ___ everyone blamed was innocent.|whom|who|whomever
      `,
      (right) => [
        `**${right}** has the right form for its job in its own clause and the right meaning: a person named, or any person.`,
        `**${right}** 在自己的从句中作用正确，意思也正确：指已提到的人，或指任何人。`,
      ],
      [
        [
          "*{wrong}* has the wrong form for its job in its own clause: find the verb of the clause and ask whether the pronoun does it or receives it.",
          "*{wrong}* 在自己从句中的形式不对：找出从句的动词，问问代词是执行它还是承受它。",
        ],
        [
          "*{wrong}* is the wrong word for the meaning: *who* and *whom* point to someone named, *whoever* and *whomever* mean any person.",
          "*{wrong}* 意思不对：*who* 和 *whom* 指已提到的人，*whoever* 和 *whomever* 指任何人。",
        ],
      ],
    ),
    label(
      "the-job-in-the-clause",
      ["The Job in the Clause", "在从句中的作用"],
      [
        "Find the clause that the pronoun begins and its verb. If the pronoun does the verb, it is the **subject of its clause** (*who*, *whoever*). If someone else in the clause does the verb to it, it is the **object of its clause** (*whom*, *whomever*). If it comes after a preposition and belongs to it alone, it is the **object of a preposition** (*whom*): *the friend **with whom** she traveled*.",
        "找出代词引导的从句和从句的动词。如果代词执行这个动词，它是**从句的主语**（*who*、*whoever*）。如果从句中别的人对它执行动作，它是**从句的宾语**（*whom*、*whomever*）。如果它跟在介词后面并只受介词支配，它是**介词的宾语**（*whom*）：*the friend **with whom** she traveled*。",
      ],
      ["What job does the pronoun in bold do?", "粗体的代词起什么作用？"],
      `
${jobLines}
        **Whoever** knocks at midnight must not be let in.|subject of its clause
        The guest **whom** the host feared never arrived.|object of its clause
        The lady **to whom** he wrote never answered.|object of a preposition
        The poet **who** lived in the tower wrote by candlelight.|subject of its clause
        She trusted **whomever** her brother trusted.|object of its clause
        The friend **with whom** she traveled kept a diary.|object of a preposition
        Give the key to **whoever** asks for it.|subject of its clause
        The servant **whom** everyone suspected was innocent.|object of its clause
        The family **for whom** the house was built died out.|object of a preposition
        The man **who** saw the ghost never spoke again.|subject of its clause
        He will warn **whomever** he meets on the road.|object of its clause
        The child **from whom** the doll was taken cried all night.|object of a preposition
        Tell **whoever** is listening that the door is locked.|subject of its clause
        The doctor **whom** they called arrived too late.|object of its clause
        The soldier **beside whom** she stood was shaking.|object of a preposition
        The girl **who** found the letter opened it.|subject of its clause
        The prize goes to **whomever** the judges choose.|object of its clause
        The heir **about whom** they whispered had returned.|object of a preposition
        **Whoever** reads this diary will learn the truth.|subject of its clause
        The stranger **whom** the dog growled at left quickly.|object of its clause
        The knight **under whom** he served was cruel.|object of a preposition
        The woman **who** owned the mansion was never seen.|subject of its clause
        Invite **whomever** you wish to the reading.|object of its clause
        The guide **through whom** we learned the legend was old.|object of a preposition
        Help **whoever** needs it.|subject of its clause
        The boy **whom** the teacher praised blushed.|object of its clause
        The judge **before whom** he stood was stern.|object of a preposition
        The writer **who** invented the detective story was Poe.|subject of its clause
        She sent the letter to the cousin **whom** she missed most.|object of its clause
        The neighbor **against whom** they complained moved away.|object of a preposition
      `,
      whoeverLabels,
    ),
  ],
});

const inverted = topic("grammar", {
  id: "reading-inverted-sentences",
  title: ["Reading Inverted Sentences", "读懂倒装句"],
  summary: [
    "In poetry and drama the verb may come before the subject; find the subject to read the line and to make the verb agree.",
    "在诗歌和戏剧中，动词可能出现在主语前面；找出主语，才能读懂句子，并让动词与它一致。",
  ],
  after: ["agreement-with-tricky-subjects"],
  points: [
    choose(
      "finding-the-subject",
      ["Finding the Subject", "找出主语"],
      [
        "Most English sentences put the subject before the verb. **Inverted** sentences turn this around, often after a phrase of place or time: *Into the hall **burst the angry duke**.* Plays and poems invert words for rhythm and emphasis: *Sweet are the uses of adversity* means *The uses of adversity are sweet.* To read the line, ask who or what does the verb. The subject is usually the noun after the verb, not the noun in the opening phrase.",
        "大多数英语句子把主语放在动词前面。**倒装句**把顺序颠倒过来，常常是在表示地点或时间的短语之后：*Into the hall **burst the angry duke**.* 戏剧和诗歌为了节奏和强调而倒装：*Sweet are the uses of adversity* 的意思是 *The uses of adversity are sweet.* 要读懂这一行，就问是谁或什么执行了这个动词。主语通常是动词后面的名词，而不是开头短语中的名词。",
      ],
      ["What is the subject of the sentence?", "这个句子的主语是什么？"],
      `
${subjectLines}
        Into the hall burst the angry duke.|the angry duke|the hall|burst the angry duke
        On the stage stood three witches.|three witches|the stage|stood
        Sweet are the uses of adversity.|the uses of adversity|sweet|are the uses of adversity
        Behind the curtain hid the old king.|the old king|the curtain|hid
        Down the stairs came the nurse with the news.|the nurse|the stairs|the news
        Here comes the prince of Verona.|the prince of Verona|here|comes the prince of Verona
        Upon the wall appeared a ghost.|a ghost|the wall|appeared
        Great was the grief of the queen.|the grief of the queen|great|the queen
        Across the river lay the enemy's camp.|the enemy's camp|the river|lay the enemy's camp
        Out of the shadows stepped a masked man.|a masked man|the shadows|stepped
        Gone are the days of peace.|the days of peace|gone|are the days of peace
        From the balcony called a voice.|a voice|the balcony|called
        In the forest lived a band of outlaws.|a band of outlaws|the forest|outlaws
        Never has a story been so sad.|a story|never|has a story
        At the gate waited the messenger.|the messenger|the gate|waited
        Loud was the noise of the crowd.|the noise of the crowd|loud|was the noise of the crowd
        Through the window crept the morning light.|the morning light|the window|crept
        There lies the body of the king.|the body of the king|there|lies the body of the king
        Above the throne hung a golden crown.|a golden crown|the throne|hung
        Strange are the ways of the heart.|the ways of the heart|strange|are the ways of the heart
        Into the room rushed the servants.|the servants|the room|rushed
        On the table lay a letter and a dagger.|a letter and a dagger|the table|lay a letter and a dagger
        Fair is the lady of the castle.|the lady of the castle|fair|the castle
        Under the bridge flowed the dark river.|the dark river|the bridge|flowed the dark river
        Rarely does the prince speak in public.|the prince|rarely|speak
        Before the king knelt the guilty lord.|the guilty lord|the king|knelt the guilty lord
        Long was the night before the battle.|the night before the battle|long|the battle
        Over the hills rode the king's army.|the king's army|the hills|rode the king's army
        Such is the power of words.|the power of words|such|words
        In the corner sat a silent friar.|a silent friar|the corner|sat a silent friar
      `,
      (right) => [
        `The subject is **${right}**: it is what does the verb, though it comes after it. In usual order the line would begin with it.`,
        `主语是 **${right}**：它执行动词的动作，尽管它在动词后面。按通常的语序，这一行会以它开头。`,
      ],
      [
        [
          "*{wrong}* comes first, but it is part of the opening phrase or an adjective moved forward, not the subject.",
          "*{wrong}* 在句首，但它是开头短语的一部分或被提前的形容词，不是主语。",
        ],
        [
          "*{wrong}* is the verb, or the verb with the subject, or a word inside the subject: not the subject itself.",
          "*{wrong}* 是动词、动词加主语，或主语内部的一个词，不是主语本身。",
        ],
      ],
    ),
    choose(
      "agreeing-in-an-inverted-sentence",
      ["Agreement in an Inverted Sentence", "倒装句中的主谓一致"],
      [
        "In an inverted sentence the verb still agrees with its subject, which comes after it. *On the stage **stand** three witches*: the subject is *witches*, so the verb is plural. *There **is** a letter*, but *There **are** two letters*. Do not let the noun in the opening phrase (*the stage*) decide the verb. Find the subject after the verb first, then choose.",
        "在倒装句中，动词仍要与在它后面的主语一致。*On the stage **stand** three witches*：主语是 *witches*，所以动词用复数。*There **is** a letter*，但 *There **are** two letters*。不要让开头短语里的名词（*the stage*）决定动词。先找出动词后面的主语，再做选择。",
      ],
      ["Which verb agrees with the subject?", "哪个动词与主语一致？"],
      `
${agreeLines}
        On the stage ___ three witches.|stand|stands|standing
        Beyond the castle walls ___ the tents of the army.|stand|stands|standing
        Into the room ___ the duke.|bursts|burst|bursting
        There ___ two letters on the table.|are|is|being
        Here ___ the prince and his friends.|come|comes|coming
        In the garden ___ a fountain.|stands|stand|standing
        Across the river ___ the enemy's tents.|lie|lies|lying
        There ___ a ghost in the tower.|is|are|being
        Behind the throne ___ two guards.|wait|waits|waiting
        On the wall ___ a portrait of the king.|hangs|hang|hanging
        Here ___ the messenger with the news.|comes|come|coming
        Under the stairs ___ a hidden door.|is|are|being
        Through the gate ___ the soldiers.|march|marches|marching
        There ___ many reasons for his anger.|are|is|being
        In the corner ___ an old chest.|sits|sit|sitting
        Over the hill ___ the riders.|appear|appears|appearing
        There ___ one thing he never forgave.|was|were|being
        Among the guests ___ a stranger in a mask.|was|were|being
        At the door ___ the nurse and the friar.|wait|waits|waiting
        Out of the forest ___ a band of outlaws.|comes|come|coming
        There ___ several knights at the feast.|were|was|being
        On the table ___ a cup of poison.|lies|lie|lying
        Down the road ___ the king's men.|ride|rides|riding
        Sweet ___ the songs of the minstrels.|are|is|being
        Above the city ___ the clouds of war.|hang|hangs|hanging
        Great ___ the courage of the prince.|was|were|being
        There ___ a reason for her silence.|was|were|being
        Beside the bed ___ two candles.|burn|burns|burning
        Into the hall ___ the dancers.|whirl|whirls|whirling
        Near the window ___ a lute.|rests|rest|resting
      `,
      (right) => [
        `**${right}** agrees with the subject that follows the verb, not with the noun in the opening phrase.`,
        `**${right}** 与动词后面的主语一致，而不是与开头短语中的名词一致。`,
      ],
      [
        [
          "*{wrong}* has the wrong number: it agrees with the noun at the start, or ignores whether the subject after it is singular or plural.",
          "*{wrong}* 的单复数不对：它与句首的名词一致，或没有注意后面的主语是单数还是复数。",
        ],
        [
          "*{wrong}* is not a full verb on its own, so the sentence would have no main verb.",
          "*{wrong}* 单独不能作完整的谓语，句子就没有谓语动词了。",
        ],
      ],
    ),
  ],
});

const confusedLabels: Readonly<Record<string, Label>> = {
  elicit: {
    zh: "elicit（引出，诱出）",
    why: [
      "*Elicit* means to draw out a response or information: *to elicit a reply*.",
      "*elicit* 意为引出回应或信息：*to elicit a reply*。",
    ],
    not: ["*Elicit* means to draw out a response, which does not fit here.", "*elicit* 意为引出回应，这里不合适。"],
  },
  illicit: {
    zh: "illicit（非法的）",
    why: ["*Illicit* means not allowed by law or by custom: *illicit trade*.", "*illicit* 意为法律或习俗不允许的：*illicit trade*。"],
    not: ["*Illicit* means against the law, which does not fit here.", "*illicit* 意为违法的，这里不合适。"],
  },
  eminent: {
    zh: "eminent（杰出的）",
    why: ["*Eminent* means famous and respected: *an eminent scientist*.", "*eminent* 意为著名而受尊敬的：*an eminent scientist*。"],
    not: ["*Eminent* means famous and respected, which does not fit here.", "*eminent* 意为杰出的，这里不合适。"],
  },
  imminent: {
    zh: "imminent（即将发生的）",
    why: ["*Imminent* means about to happen: *an imminent storm*.", "*imminent* 意为即将发生的：*an imminent storm*。"],
    not: ["*Imminent* means about to happen, which does not fit here.", "*imminent* 意为即将发生的，这里不合适。"],
  },
  discreet: {
    zh: "discreet（谨慎的）",
    why: ["*Discreet* means careful not to attract attention or to give away secrets.", "*discreet* 意为谨慎、不引人注意或不泄露秘密的。"],
    not: ["*Discreet* means careful and quiet, which does not fit here.", "*discreet* 意为谨慎的，这里不合适。"],
  },
  discrete: {
    zh: "discrete（分离的，独立的）",
    why: ["*Discrete* means separate and distinct: *three discrete steps*.", "*discrete* 意为分开的、各自独立的：*three discrete steps*。"],
    not: ["*Discrete* means separate, which does not fit here.", "*discrete* 意为分离的，这里不合适。"],
  },
  censor: {
    zh: "censor（审查，删除）",
    why: [
      "To *censor* is to remove or ban parts of a book, film or letter thought unacceptable.",
      "*censor* 指删除或禁止书、电影或信件中被认为不可接受的部分。",
    ],
    not: ["To *censor* is to cut or ban material, which does not fit here.", "*censor* 指删除或禁止内容，这里不合适。"],
  },
  censure: {
    zh: "censure（谴责）",
    why: ["To *censure* is to criticize someone strongly and formally.", "*censure* 指强烈而正式地批评某人。"],
    not: ["To *censure* is to criticize formally, which does not fit here.", "*censure* 指正式谴责，这里不合适。"],
  },
  adverse: {
    zh: "adverse（不利的）",
    why: [
      "*Adverse* means harmful or unfavorable: *adverse weather*, *adverse effects*.",
      "*adverse* 意为有害的、不利的：*adverse weather*、*adverse effects*。",
    ],
    not: ["*Adverse* describes harmful conditions, not a person's dislike.", "*adverse* 描述有害的条件，不是人的反感。"],
  },
  averse: {
    zh: "averse（反感的，不愿意的）",
    why: [
      "*Averse* means unwilling or opposed, and it describes a person: *averse to risk*.",
      "*averse* 意为不愿意的、反对的，用来描述人：*averse to risk*。",
    ],
    not: ["*Averse* describes a person's dislike, which does not fit here.", "*averse* 描述人的反感，这里不合适。"],
  },
  flaunt: {
    zh: "flaunt（炫耀）",
    why: [
      "To *flaunt* is to show something off proudly: *to flaunt one's wealth*.",
      "*flaunt* 指得意地炫耀某物：*to flaunt one's wealth*。",
    ],
    not: ["To *flaunt* is to show off, which does not fit here.", "*flaunt* 指炫耀，这里不合适。"],
  },
  flout: {
    zh: "flout（公然违抗）",
    why: [
      "To *flout* is to break a rule openly, as if it did not matter: *to flout the law*.",
      "*flout* 指公然违反规则，好像规则无关紧要：*to flout the law*。",
    ],
    not: ["To *flout* is to break a rule openly, which does not fit here.", "*flout* 指公然违反规则，这里不合适。"],
  },
  ensure: {
    zh: "ensure（确保）",
    why: ["To *ensure* is to make certain that something happens.", "*ensure* 指确保某事发生。"],
    not: ["To *ensure* is to make certain, which does not fit here.", "*ensure* 指确保，这里不合适。"],
  },
  insure: {
    zh: "insure（为……投保）",
    why: [
      "To *insure* is to buy insurance, so that you are paid if something is lost or damaged.",
      "*insure* 指购买保险，在东西丢失或损坏时获得赔偿。",
    ],
    not: ["To *insure* is to buy insurance, which does not fit here.", "*insure* 指投保，这里不合适。"],
  },
};

const confused4 = topic("grammar", {
  id: "commonly-confused-words-4",
  title: ["Commonly Confused Words 4", "易混淆词（四）"],
  summary: [
    "Pairs such as elicit and illicit, eminent and imminent, or adverse and averse look or sound alike but mean different things.",
    "elicit 与 illicit、eminent 与 imminent、adverse 与 averse 这样的词形近或音近，意思却不同。",
  ],
  after: ["commonly-confused-words-3"],
  points: [
    label(
      "words-that-look-alike",
      ["Words That Look Alike", "形近词"],
      [
        "Some pairs differ by a letter or two. To **elicit** is to draw out (*elicit a reply*); **illicit** means against the law (*illicit trade*: the *ill* is a clue). **Eminent** means famous and respected; **imminent** means about to happen (*imminent* and *immediate* both begin with *imm*). **Discreet** means careful and quiet; **discrete** means separate (the *t* separates the two *e*s). To **censor** is to cut or ban; to **censure** is to criticize.",
        "有些词只差一两个字母。**elicit** 指引出（*elicit a reply*）；**illicit** 意为违法的（*illicit trade*：*ill* 是线索）。**eminent** 意为杰出的；**imminent** 意为即将发生的（*imminent* 和 *immediate* 都以 *imm* 开头）。**discreet** 意为谨慎的；**discrete** 意为分离的（*t* 把两个 *e* 分开了）。**censor** 是删除或禁止；**censure** 是谴责。",
      ],
      ["Which word belongs in the blank?", "空格里应该填哪个词？"],
      `
${lookAlikeLines}
        The question was meant to ___ an honest answer.|elicit|illicit|ensure
        The smugglers ran an ___ trade in tea.|illicit|elicit|discrete
        An ___ historian spoke at the meeting.|eminent|imminent|discreet
        The sailors could tell that a storm was ___.|imminent|eminent|adverse
        Be ___ when you speak about the plan.|discreet|discrete|eminent
        The process has four ___ stages.|discrete|discreet|imminent
        The government tried to ___ the newspaper.|censor|censure|elicit
        The council voted to ___ the mayor for lying.|censure|censor|flout
        The teacher's questions ___ a lively debate.|elicit|illicit|insure
        He was arrested for ___ gambling.|illicit|elicit|discreet
        She became an ___ judge.|eminent|imminent|discrete
        With the enemy so close, an attack was ___.|imminent|eminent|averse
        A ___ friend keeps your secrets.|discreet|discrete|eminent
        The data are counted in ___ units.|discrete|discreet|imminent
        The army would ___ every letter the soldiers sent home.|censor|censure|elicit
        The senate may ___ a member who breaks the rules.|censure|censor|flaunt
        The interview failed to ___ any new facts.|elicit|illicit|ensure
        The police found ___ goods in the cellar.|illicit|elicit|discrete
        The ___ scientist won the prize.|eminent|imminent|discreet
        Their departure was ___; the bags were packed.|imminent|eminent|adverse
        The butler was too ___ to listen at doors.|discreet|discrete|imminent
        The song is made of ___ sections.|discrete|discreet|eminent
        The film was ___ed before it was shown.|censor|censure|insure
        The report will ___ the company for its carelessness.|censure|censor|flout
        Kind words often ___ kind answers.|elicit|illicit|insure
        Selling the drug without a license is ___.|illicit|elicit|discreet
        An ___ visitor gave the opening speech.|eminent|imminent|discrete
        Thunder warned that rain was ___.|imminent|eminent|averse
        Please be ___ about my illness.|discreet|discrete|eminent
        The machine works in ___ steps.|discrete|discreet|imminent
      `,
      confusedLabels,
    ),
    label(
      "words-that-sound-alike",
      ["Words That Sound Alike", "音近词"],
      [
        "**Adverse** describes harmful conditions (*adverse weather*); **averse** describes a person who dislikes something (*averse to risk*). To **flaunt** is to show off (*flaunt one's wealth*); to **flout** is to break a rule openly (*flout the law*). To **ensure** is to make certain; to **insure** is to buy insurance. Ask what the sentence is about: a condition or a person, showing off or breaking a rule, making certain or paying for cover.",
        "**adverse** 描述有害的条件（*adverse weather*）；**averse** 描述讨厌某事的人（*averse to risk*）。**flaunt** 是炫耀（*flaunt one's wealth*）；**flout** 是公然违反规则（*flout the law*）。**ensure** 是确保；**insure** 是投保。问问句子说的是什么：是条件还是人，是炫耀还是违规，是确保还是买保险。",
      ],
      ["Which word belongs in the blank?", "空格里应该填哪个词？"],
      `
${soundAlikeLines}
        The ship turned back because of ___ winds.|adverse|averse|discrete
        She is not ___ to hard work.|averse|adverse|eminent
        The rich merchant liked to ___ his gold rings.|flaunt|flout|censure
        The smugglers ___ the law every night.|flout|flaunt|elicit
        Check the list twice to ___ that nothing is forgotten.|ensure|insure|elicit
        He decided to ___ the house against fire.|insure|ensure|censor
        The medicine had no ___ effects.|adverse|averse|imminent
        The old captain was ___ to taking risks.|averse|adverse|discreet
        Students who ___ the rules lose their privileges.|flout|flaunt|censor
        She did not ___ her prize; she kept it in a drawer.|flaunt|flout|elicit
        The guards will ___ that the prisoner does not escape.|ensure|insure|censure
        Farmers ___ their crops against hail.|insure|ensure|elicit
        The drought had an ___ effect on the harvest.|adverse|averse|eminent
        Cats are famously ___ to water.|averse|adverse|imminent
        The young lord would ___ his fine clothes at every ball.|flaunt|flout|censor
        Drivers who ___ the speed limit are fined.|flout|flaunt|censure
        Good planning will ___ success.|ensure|insure|elicit
        It is wise to ___ a valuable painting.|insure|ensure|censor
        The trial was halted by ___ publicity.|adverse|averse|discrete
        He was not ___ to a little adventure.|averse|adverse|eminent
        They ___ the king's orders and sailed anyway.|flout|flaunt|elicit
        She liked to ___ her knowledge of Latin.|flaunt|flout|censure
        Lock the door to ___ that no one enters.|ensure|insure|censor
        The company will ___ the cargo for a thousand pounds.|insure|ensure|elicit
        The patient showed an ___ reaction to the drug.|adverse|averse|imminent
        Some readers are ___ to sad endings.|averse|adverse|discreet
        The rebels ___ the curfew and gathered in the square.|flout|flaunt|censor
        Winners should not ___ their medals in front of the losers.|flaunt|flout|censure
        Rules exist to ___ fairness.|ensure|insure|elicit
        The museum must ___ its paintings before the exhibition travels.|insure|ensure|censor
      `,
      confusedLabels,
    ),
  ],
});

const prepositionRelatives = topic("grammar", {
  id: "prepositions-before-relative-pronouns",
  title: ["Prepositions Before Relative Pronouns", "关系代词前的介词"],
  summary: [
    "Formal English moves the preposition before which or whom: the country in which she was born, the friend to whom he wrote.",
    "正式英语把介词移到 which 或 whom 前面：the country in which she was born、the friend to whom he wrote。",
  ],
  after: ["who-which-and-that", "who-and-whom"],
  points: [
    choose(
      "the-pronoun-after-the-preposition",
      ["The Pronoun After the Preposition", "介词后的代词"],
      [
        "Everyday English often ends a relative clause with a preposition: *the country she was born **in***. Formal English moves the preposition to the front: *the country **in which** she was born*. After a preposition, use **which** for things and **whom** for people. Never use *that* or *who* right after a preposition: *in that* and *to who* are wrong.",
        "日常英语常常让关系从句以介词结尾：*the country she was born **in***。正式英语把介词移到前面：*the country **in which** she was born*。介词后面，指物用 **which**，指人用 **whom**。介词后面绝不能直接用 *that* 或 *who*：*in that* 和 *to who* 都是错的。",
      ],
      ["Which words complete the formal sentence?", "哪个选项能补全这个正式的句子？"],
      `
${afterPrep}
        The island ___ they sailed was far to the west.|to which|to that|to whom
        The captain ___ she wrote never replied.|to whom|to who|to which
        The house ___ he grew up has been torn down.|in which|in that|in whom
        The friend ___ she traveled kept a diary.|with whom|with who|with which
        The law ___ they protested was repealed.|against which|against that|against whom
        The man ___ the letter was addressed had died.|to whom|to who|to which
        The ship ___ they escaped was small.|on which|on that|on whom
        The leader ___ they fought was cruel.|under whom|under who|under which
        The reasons ___ she left are unclear.|for which|for that|for whom
        The teacher ___ I learned the most was Ms. Ruiz.|from whom|from who|from which
        The city ___ they moved was crowded.|to which|to that|to whom
        The neighbors ___ they shared a wall were noisy.|with whom|with who|with which
        The border ___ the refugees crossed was closed.|across which|across that|across whom
        The officer ___ he spoke was kind.|to whom|to who|to which
        The village ___ she came had no school.|from which|from that|from whom
        The cousins ___ they stayed welcomed them.|with whom|with who|with which
        The passport ___ she traveled was false.|with which|with that|with whom
        The judge ___ the case was heard was fair.|before whom|before who|before which
        The war ___ they fled lasted ten years.|from which|from that|from whom
        The family ___ the boy was sent lived on a farm.|to whom|to who|to which
        The street ___ they lived was full of shops.|on which|on that|on whom
        The aunt ___ she was named was a singer.|after whom|after who|after which
        The camp ___ they waited was cold.|in which|in that|in whom
        The people ___ the money was sent were grateful.|to whom|to who|to which
        The ship ___ the emigrants sailed sank on its return.|on which|on that|on whom
        The friend ___ he trusted most betrayed him.|in whom|in who|in which
        The language ___ she dreamed was her first.|in which|in that|in whom
        The doctor ___ they owed their lives refused payment.|to whom|to who|to which
        The harbor ___ the boats left was quiet.|from which|from that|from whom
        The guide ___ they crossed the mountains was a girl of fifteen.|with whom|with who|with which
      `,
      (right) => [
        `**${right}** is formal and right: the preposition comes first, followed by *which* for a thing or *whom* for a person.`,
        `**${right}** 正式而正确：介词在前，后面指物用 *which*，指人用 *whom*。`,
      ],
      [
        [
          "*{wrong}* puts *that* or *who* right after a preposition, which English does not allow; use *which* or *whom*.",
          "*{wrong}* 把 *that* 或 *who* 直接放在介词后面，英语不允许这样；要用 *which* 或 *whom*。",
        ],
        [
          "*{wrong}* uses the pronoun for the wrong kind of noun: *whom* is for people and *which* for things.",
          "*{wrong}* 代词与名词的类别不符：*whom* 指人，*which* 指物。",
        ],
      ],
    ),
    choose(
      "the-formal-version",
      ["The Formal Version", "正式的说法"],
      [
        "To make a relative clause formal, move its final preposition to the front, before *which* or *whom*, and take it off the end: *the town I lived **in*** becomes *the town **in which** I lived*. Two mistakes are common: keeping the preposition at the end as well (*in which I lived in*) and putting *that* after the moved preposition (*in that I lived*).",
        "要让关系从句变得正式，就把句末的介词移到 *which* 或 *whom* 前面，并把它从句末去掉：*the town I lived **in*** 变成 *the town **in which** I lived*。常见的错误有两种：句末仍保留介词（*in which I lived in*），以及在移到前面的介词后用 *that*（*in that I lived*）。",
      ],
      ["Which is the correct formal version?", "哪个是正确的正式说法？"],
      `
${formalLines}
        the town I lived in|the town in which I lived|the town in which I lived in|the town in that I lived
        the friend I wrote to|the friend to whom I wrote|the friend to whom I wrote to|the friend to that I wrote
        the ship they sailed on|the ship on which they sailed|the ship on which they sailed on|the ship on that they sailed
        the woman she worked for|the woman for whom she worked|the woman for whom she worked for|the woman for that she worked
        the country he came from|the country from which he came|the country from which he came from|the country from that he came
        the people we live with|the people with whom we live|the people with whom we live with|the people with that we live
        the law they fought against|the law against which they fought|the law against which they fought against|the law against that they fought
        the uncle she was named after|the uncle after whom she was named|the uncle after whom she was named after|the uncle after that she was named
        the border they crossed over|the border over which they crossed|the border over which they crossed over|the border over that they crossed
        the teacher I learned from|the teacher from whom I learned|the teacher from whom I learned from|the teacher from that I learned
        the camp they waited in|the camp in which they waited|the camp in which they waited in|the camp in that they waited
        the official he spoke to|the official to whom he spoke|the official to whom he spoke to|the official to that he spoke
        the war they escaped from|the war from which they escaped|the war from which they escaped from|the war from that they escaped
        the family she stayed with|the family with whom she stayed|the family with whom she stayed with|the family with that she stayed
        the street they lived on|the street on which they lived|the street on which they lived on|the street on that they lived
        the guide they relied on|the guide on whom they relied|the guide on whom they relied on|the guide on that they relied
        the language she dreamed in|the language in which she dreamed|the language in which she dreamed in|the language in that she dreamed
        the cousins they sent money to|the cousins to whom they sent money|the cousins to whom they sent money to|the cousins to that they sent money
        the harbor the boats left from|the harbor from which the boats left|the harbor from which the boats left from|the harbor from that the boats left
        the man she depended on|the man on whom she depended|the man on whom she depended on|the man on that she depended
        the reasons they left for|the reasons for which they left|the reasons for which they left for|the reasons for that they left
        the leader they served under|the leader under whom they served|the leader under whom they served under|the leader under that they served
        the room the children slept in|the room in which the children slept|the room in which the children slept in|the room in that the children slept
        the friend he traveled with|the friend with whom he traveled|the friend with whom he traveled with|the friend with that he traveled
        the city they moved to|the city to which they moved|the city to which they moved to|the city to that they moved
        the neighbor we borrowed from|the neighbor from whom we borrowed|the neighbor from whom we borrowed from|the neighbor from that we borrowed
        the boat they escaped in|the boat in which they escaped|the boat in which they escaped in|the boat in that they escaped
        the judge they appealed to|the judge to whom they appealed|the judge to whom they appealed to|the judge to that they appealed
        the village she grew up in|the village in which she grew up|the village in which she grew up in|the village in that she grew up
        the doctor they owed their lives to|the doctor to whom they owed their lives|the doctor to whom they owed their lives to|the doctor to that they owed their lives
      `,
      (right) => [
        `*${right}* moves the preposition before the pronoun and drops it from the end.`,
        `*${right}* 把介词移到代词前面，并把它从句末去掉。`,
      ],
      [
        ["*{wrong}* keeps the preposition at the end as well, so it appears twice.", "*{wrong}* 在句末也保留了介词，于是介词出现了两次。"],
        ["*{wrong}* puts *that* after the preposition, which English does not allow.", "*{wrong}* 在介词后用了 *that*，英语不允许这样。"],
      ],
    ),
  ],
});

/** grammarTopics8b are the grammar topics of the last units of grade 8. */
export const grammarTopics8b: readonly TopicDef[] = [
  parallelVerbals,
  compoundModifiers,
  whoever,
  inverted,
  confused4,
  prepositionRelatives,
];
