// Grade 7: grammar of the last units: confused words, semicolons, the past perfect, the subjunctive of demands,
// the passive in science and plurals from Latin and Greek.

import type { TopicDef } from "@ga/content";
import { everyPair } from "../../levels/words.ts";
import { choose, type Label, label, topic } from "../grade-6/kit.ts";

// Crossed items: frames, people and phrases multiply the lines below into a hundred items or more for each bank.

const join = (lines: readonly string[]) => lines.join("\n");
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** wordFrames are a word, the word it is confused with, and frames with fillers that each take the word. */
type WordFrames = readonly [string, string, readonly (readonly [string, readonly string[]])[]];
/** confusedLines crosses each word's frames with their fillers; the third option is a word from another pair. */
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
const soundAlike: readonly WordFrames[] = [
  [
    "principal",
    "principle",
    [
      [
        "The ___ {x}.",
        [
          "greeted every student at the door",
          "spoke at the assembly",
          "called my parents",
          "visited our classroom",
          "announced a snow day",
        ],
      ],
      ["The ___ reason for the delay was {x}.", ["the snow", "the traffic", "a broken bus", "the storm", "a power cut"]],
    ],
  ],
  [
    "principle",
    "principal",
    [
      [
        "Fairness is a ___ that {x}.",
        ["our club follows", "the judge respects", "guides the team", "the founders believed in", "every referee needs"],
      ],
      ["The machine works on a simple ___ of {x}.", ["physics", "balance", "leverage", "motion", "heat"]],
    ],
  ],
  [
    "complement",
    "compliment",
    [
      ["The red scarf is a perfect ___ to {x}.", ["her gray coat", "the white dress", "his blue suit", "the green hat", "the black boots"]],
      ["The ship sailed with a full ___ of {x}.", ["sailors", "officers", "passengers", "engineers", "cooks"]],
    ],
  ],
  [
    "compliment",
    "complement",
    [
      ["She paid me a ___ on {x}.", ["my drawing", "my speech", "my new haircut", "my essay", "my garden"]],
      ["He blushed at the ___ about {x}.", ["his singing", "his cooking", "his poem", "his painting", "his goal"]],
    ],
  ],
  [
    "council",
    "counsel",
    [
      [
        "The city ___ voted to {x}.",
        ["build a new library", "close the old bridge", "plant more trees", "repair the roads", "open a skate park"],
      ],
      ["The student ___ meets {x}.", ["every Monday", "after school", "in the library", "once a month", "before each dance"]],
    ],
  ],
  [
    "counsel",
    "council",
    [
      ["The coach gave wise ___ to {x}.", ["the new players", "the nervous goalie", "the young team", "the captain", "the rookies"]],
      ["Her lawyer will ___ her to {x}.", ["stay quiet", "settle the case", "wait a week", "sign the deal", "appeal"]],
    ],
  ],
  [
    "stationary",
    "stationery",
    [
      [
        "The bike stays ___ while {x}.",
        ["you pedal", "the trainer adjusts it", "we fix the chain", "the rider warms up", "the class exercises"],
      ],
      ["The truck remained ___ {x}.", ["for an hour", "in the traffic jam", "at the crossing", "behind the bus", "near the gate"]],
    ],
  ],
  [
    "stationery",
    "stationary",
    [
      ["She wrote the letter on {x} ___.", ["pink", "fancy", "plain", "new", "her grandmother's"]],
      ["The shop sells {x} and ___.", ["pens", "ink", "envelopes", "cards", "stamps"]],
    ],
  ],
];
const closeInForm: readonly WordFrames[] = [
  [
    "allusion",
    "illusion",
    [
      ["The poem makes an ___ to {x}.", ["an old myth", "a famous speech", "a fairy tale", "Shakespeare", "the flood story"]],
      [
        "Her joke was an ___ to {x}.",
        ["a popular movie", "our trip last year", "a famous painting", "a song we all knew", "an old cartoon"],
      ],
    ],
  ],
  [
    "illusion",
    "allusion",
    [
      ["The painting creates the ___ of {x}.", ["depth", "an open window", "motion", "a deep tunnel", "water"]],
      ["The magician's trick was only an ___ {x}.", ["of fire", "done with mirrors", "of flying", "that fooled us", "of a vanishing coin"]],
    ],
  ],
  [
    "emigrate",
    "immigrate",
    [
      ["My grandparents chose to ___ from {x}.", ["Ireland", "Poland", "Korea", "Italy", "Mexico"]],
      ["Many families had to ___ from {x}.", ["the war zone", "the dry plains", "the poor villages", "the island", "the flooded valley"]],
    ],
  ],
  [
    "immigrate",
    "emigrate",
    [
      ["They decided to ___ to {x}.", ["Canada", "Brazil", "Australia", "the United States", "New Zealand"]],
      ["Her uncle hoped to ___ to {x} for work.", ["Germany", "Singapore", "Chile", "Kenya", "Ireland"]],
    ],
  ],
  [
    "farther",
    "further",
    [
      ["The village is ___ {x}.", ["than the lake", "than we thought", "down the road", "up the valley", "from the station than the farm"]],
      ["Can you throw the ball ___ than {x}?", ["your brother", "last time", "the fence", "the coach", "me"]],
    ],
  ],
  [
    "further",
    "farther",
    [
      ["We need ___ {x} before we decide.", ["information", "study", "research", "details", "practice"]],
      ["Let's discuss this ___ {x}.", ["tomorrow", "after lunch", "at the meeting", "next week", "in class"]],
    ],
  ],
  [
    "adopt",
    "adapt",
    [
      ["The family will ___ {x}.", ["a puppy", "a kitten", "a baby girl", "a rescue dog", "an orphan"]],
      ["The school voted to ___ {x}.", ["a new dress code", "the plan", "a later start time", "the new rules", "a shorter lunch"]],
    ],
  ],
  [
    "adapt",
    "adopt",
    [
      ["Animals must ___ to {x}.", ["the cold", "the desert heat", "new habitats", "changes in their food", "the long winter"]],
      ["She had to ___ {x} for the younger readers.", ["the story", "the play", "her speech", "the lesson", "the poem"]],
    ],
  ],
  [
    "imply",
    "infer",
    [
      ["Are you trying to ___ that {x}?", ["I lied", "the test was easy", "we were late", "the plan failed", "I cheated"]],
      [
        "His frown seemed to ___ that {x}.",
        ["he was angry", "the answer was wrong", "the news was bad", "he disagreed", "we should leave"],
      ],
    ],
  ],
  [
    "infer",
    "imply",
    [
      [
        "From the clues, we can ___ that {x}.",
        ["the butler did it", "it rained last night", "the dog was hungry", "the house was empty", "someone had left early"],
      ],
      ["What can you ___ from {x}?", ["the graph", "her smile", "the title", "the footprints", "the last paragraph"]],
    ],
  ],
  [
    "precede",
    "proceed",
    [
      ["A short speech will ___ {x}.", ["the award ceremony", "the concert", "the dinner", "the parade", "the game"]],
      ["Did the storm ___ {x}?", ["the flood", "the power cut", "the landslide", "the blackout", "the rescue"]],
    ],
  ],
  [
    "proceed",
    "precede",
    [
      ["Please ___ to {x}.", ["the next question", "gate four", "the exit", "the main hall", "the front desk"]],
      ["After the delay, the trial will ___ {x}.", ["on Monday", "as planned", "without him", "tomorrow", "at noon"]],
    ],
  ],
];
const soundAlikeLines = confusedLines(soundAlike);
const closeFormLines = confusedLines(closeInForm);

/** clausePairs are two related clauses about a person and a transition that can join them. */
const clausePairs = [
  ["{N} studied all week", "she passed the test", "therefore"],
  ["{N} missed the bus", "she walked to school", "instead"],
  ["{N} loves soccer", "her brother prefers chess", "however"],
  ["{N} practiced every day", "she won the contest", "as a result"],
  ["{N} forgot her umbrella", "she got soaked", "consequently"],
  ["{N} finished early", "she helped her friends", "then"],
  ["{N} wanted a puppy", "her parents said no", "however"],
  ["{N} saved her money", "she bought a bike", "eventually"],
  ["{N} hates spinach", "she ate it anyway", "nevertheless"],
  ["{N} read the map", "she found the trail", "meanwhile"],
  ["{N} trained for months", "she ran the marathon", "finally"],
  ["{N} speaks Spanish", "she translated the letter", "therefore"],
  ["{N} lost her key", "she climbed in the window", "instead"],
  ["{N} wrote the song", "her sister sang it", "later"],
  ["{N} planted the seeds", "the rain watered them", "afterward"],
  ["{N} fixed the lamp", "the room was bright again", "now"],
] as const;
const girls = ["Maya", "Lena", "Aisha", "Rosa"] as const;
const semicolonLines = join(
  clausePairs.flatMap(([first, second, linker], k) =>
    [0, 1, 2, 3].flatMap((n) => {
      const a = first.replace("{N}", girls[(k + n) % girls.length] ?? "Maya");
      const [head = "", ...tail] = a.split(" ");
      const [bHead = "", ...bTail] = second.split(" ");
      return n === 3
        ? [`${a} ${linker} ${second}|${a}; ${linker}, ${second}.|${a}, ${linker}, ${second}.|${a}; ${linker} ${bHead}, ${bTail.join(" ")}.`]
        : [
            `${a} ${second}|${a}; ${second}.|${a}, ${second}.|${head}; ${tail.join(" ")} ${second}.`,
            ...(n === 0
              ? [
                  `${a} ${linker} ${second}|${a}; ${linker}, ${second}.|${a}, ${linker}, ${second}.|${a}; ${linker} ${bHead}, ${bTail.join(" ")}.`,
                ]
              : []),
          ];
    }),
  ),
);
/** listItem builds one list with three two-part items. */
const listItem = (frame: string, items: readonly (readonly [string, string])[]) => {
  const [a, b, c] = items;
  if (!a || !b || !c) return "";
  const shown = `${frame} ${a[0]} ${a[1]} ${b[0]} ${b[1]} and ${c[0]} ${c[1]}.`;
  const right = `${frame} ${a[0]}, ${a[1]}; ${b[0]}, ${b[1]}; and ${c[0]}, ${c[1]}.`;
  const commas = `${frame} ${a[0]}, ${a[1]}, ${b[0]}, ${b[1]}, and ${c[0]}, ${c[1]}.`;
  const inside = `${frame} ${a[0]}; ${a[1]}, ${b[0]}; ${b[1]}, and ${c[0]}; ${c[1]}.`;
  return `${shown}|${right}|${commas}|${inside}`;
};
const cityPairs = [
  ["Madrid", "Spain"],
  ["Nairobi", "Kenya"],
  ["Hanoi", "Vietnam"],
  ["Cairo", "Egypt"],
  ["Oslo", "Norway"],
  ["Santiago", "Chile"],
  ["Manila", "the Philippines"],
  ["Accra", "Ghana"],
  ["Toronto", "Canada"],
] as const;
const peopleRoles = [
  ["Ana Ruiz", "a pilot"],
  ["Ben Cho", "a nurse"],
  ["Kofi Mensah", "a poet"],
  ["Mei Lin", "a judge"],
  ["Omar Haddad", "a baker"],
  ["Lucy Park", "a coach"],
  ["Raj Patel", "an architect"],
  ["Elena Rossi", "a painter"],
  ["Sam Okafor", "a vet"],
] as const;
const datePairs = [
  ["June 5", "2019"],
  ["July 9", "2020"],
  ["May 1", "2021"],
  ["March 3", "2018"],
  ["October 12", "2022"],
  ["April 20", "2017"],
  ["August 8", "2023"],
  ["January 15", "2016"],
  ["November 30", "2024"],
] as const;
const triples = [0, 1, 2, 3, 4, 5, 6, 7, 8].flatMap((k) => [
  [k, (k + 1) % 9, (k + 2) % 9],
  [k, (k + 3) % 9, (k + 6) % 9],
  [k, (k + 2) % 9, (k + 4) % 9],
  [k, (k + 4) % 9, (k + 1) % 9],
]);
const pickThree = <T>(pool: readonly T[], [a, b, c]: readonly number[]) =>
  [pool[a ?? 0], pool[b ?? 0], pool[c ?? 0]].filter((x): x is T => x !== undefined);
const listLines = join([
  ...triples.flatMap((t, k) => [
    listItem(
      ["We visited", "The tour stopped in", "Our pen pals live in", "Flights left for"][k % 4] ?? "We visited",
      pickThree(cityPairs, t),
    ),
    listItem(
      ["The speakers were", "The winners were", "The team included", "The guests were"][k % 4] ?? "The speakers were",
      pickThree(peopleRoles, t),
    ),
    listItem(
      ["The fairs were held on", "The storms struck on", "The team won titles on", "The club met on"][k % 4] ?? "The fairs were held on",
      pickThree(datePairs, t),
    ),
  ]),
]);

/** earlier are events finished before another: a subject, past, past participle, present, and the rest. */
const earlier = [
  ["the snow", "melted", "melted", "melts", ""],
  ["the cat", "ate", "eaten", "eats", " the fish"],
  ["the train", "left", "left", "leaves", ""],
  ["someone", "locked", "locked", "locks", " the door"],
  ["the baby", "fell", "fallen", "falls", " asleep"],
  ["the rain", "stopped", "stopped", "stops", ""],
  ["the store", "closed", "closed", "closes", ""],
  ["the cake", "burned", "burned", "burns", ""],
] as const;
const later = ["we arrived", "the guests came", "the bell rang", "the teacher returned", "the sun came up", "Dad got home"] as const;
const firstLines = join(
  everyPair(earlier, later).flatMap(([[who, past, done, , rest], then]) =>
    [
      `When ${then}, ${who} had ${done}${rest}.`,
      `By the time ${then}, ${who} had ${done}${rest}.`,
      `${cap(who)} had ${done}${rest} before ${then}.`,
    ].map((sentence) => `${sentence}|${who} ${past}${rest}|${then}|the two happened at the same moment`),
  ),
);
const perfectMore = join(
  everyPair(earlier, later).map(
    ([[who, , done, now, rest], then]) => `${cap(who)} ___${rest} before ${then}.|had ${done}|has ${done}|${now}`,
  ),
);
const perfectLines = join([
  perfectMore,
  ...everyPair(earlier, later).flatMap(([[who, , done, now, rest], then], k) => [
    `${k % 2 === 0 ? "When" : "By the time"} ${then}, ${who} ___${rest}.|had ${done}|has ${done}|${now}`,
  ]),
]);

/** demanders are openings that call for the base form; clauses are a subject, base, -s form, past and the rest. */
const demanders = [
  "The coach insisted that",
  "The rules require that",
  "The doctor recommended that",
  "Our teacher asked that",
  "The judge ordered that",
  "The club proposed that",
  "Mom suggested that",
  "The principal demanded that",
  "The guide advised that",
  "The captain urged that",
] as const;
const thatClauses = [
  ["every player", "arrive", "arrives", "arrived", " on time"],
  ["she", "rest", "rests", "rested", " for a week"],
  ["he", "be", "is", "was", " quiet"],
  ["the door", "stay", "stays", "stayed", " locked"],
  ["each student", "bring", "brings", "brought", " a pencil"],
  ["the team", "practice", "practices", "practiced", " daily"],
  ["he", "apologize", "apologizes", "apologized", " to her"],
  ["the dog", "wear", "wears", "wore", " a leash"],
  ["she", "take", "takes", "took", " the medicine"],
  ["the meeting", "end", "ends", "ended", " by noon"],
] as const;
const baseLines = join(
  everyPair(demanders, thatClauses).map(([opening, [who, base, s, past, rest]]) => `${opening} ${who} ___${rest}.|${base}|${s}|${past}`),
);
const noticers = ["She noticed that", "I heard that", "We knew that", "Everyone saw that", "The news said that"] as const;
const subjunctiveLabels = join([
  ...everyPair(demanders, thatClauses).map(([opening, [who, base, s, , rest]], k) =>
    k % 2 === 0 ? `${opening} ${who} *${base}*${rest}.|correct` : `${opening} ${who} *${s}*${rest}.|should be the base form`,
  ),
  ...everyPair(noticers, thatClauses).map(([opening, [who, base, , past, rest]], k) =>
    k % 2 === 0 ? `${opening} ${who} *${past}*${rest}.|correct` : `${opening} ${who} *${base}*${rest}.|should be an ordinary tense`,
  ),
]);

/** samples are things tested in a lab; labVerbs are a participle, its past and its -ing form. */
const samples = ["rock sample", "soil sample", "water sample", "ice sample", "leaf sample", "sand sample"] as const;
const labVerbs = [
  ["heated", "heated", "heating", "to 80 degrees"],
  ["weighed", "weighed", "weighing", "three times"],
  ["measured", "measured", "measuring", "with a ruler"],
  ["tested", "tested", "testing", "for salt"],
  ["cooled", "cooled", "cooling", "in the fridge"],
  ["labeled", "labeled", "labeling", "with a date"],
  ["photographed", "photographed", "photographing", "under the microscope"],
  ["stored", "stored", "storing", "in a jar"],
  ["examined", "examined", "examining", "by two students"],
  ["sealed", "sealed", "sealing", "in a bag"],
  ["frozen", "froze", "freezing", "overnight"],
  ["shaken", "shook", "shaking", "for a minute"],
] as const;
const passiveLines = join([
  ...everyPair(samples, labVerbs).map(
    ([sample, [done, past, ing, rest]]) => `Yesterday the ${sample} ___ ${rest}.|was ${done}|${past}|was ${ing}`,
  ),
  ...everyPair(samples, labVerbs).map(
    ([sample, [done, past, ing, rest]]) => `Last week the ${sample}s ___ ${rest}.|were ${done}|${past}|were ${ing}`,
  ),
]);
const makers = [
  ["The telephone", "invented", "Alexander Graham Bell"],
  ["Radium", "discovered", "Marie Curie"],
  ["Penicillin", "discovered", "Alexander Fleming"],
  ["The theory of relativity", "developed", "Albert Einstein"],
  ["The World Wide Web", "invented", "Tim Berners-Lee"],
  ["The polio vaccine", "developed", "Jonas Salk"],
  ["The laws of motion", "described", "Isaac Newton"],
  ["The theory of evolution", "proposed", "Charles Darwin"],
  ["The Mona Lisa", "painted", "Leonardo da Vinci"],
  ["Dynamite", "invented", "Alfred Nobel"],
  ["The periodic table", "created", "Dmitri Mendeleev"],
  ["The first printing press in Europe", "built", "Johannes Gutenberg"],
  ["The Great Wall's oldest parts", "ordered", "early Chinese kings"],
  ["The first computer program", "written", "Ada Lovelace"],
] as const;
const blamed = [
  ["the test results", "were", "lost"],
  ["the money", "was", "spent"],
  ["the window", "was", "broken"],
  ["the files", "were", "deleted"],
  ["the report", "was", "changed"],
  ["the cookies", "were", "eaten"],
  ["the warnings", "were", "ignored"],
  ["the lamp", "was", "knocked over"],
  ["the river", "was", "polluted"],
  ["the deadline", "was", "missed"],
  ["the trees", "were", "cut down"],
  ["the prices", "were", "raised"],
  ["the data", "were", "changed"],
  ["the letters", "were", "never sent"],
  ["the bridge", "was", "badly built"],
  ["the plan", "was", "kept secret"],
  ["the safety check", "was", "skipped"],
  ["mistakes", "were", "made"],
] as const;
const blameFrames = ["Sorry, {x}.", "The company said that {x}.", "When asked, the team admitted that {x}."] as const;
const passiveFitLines = join([
  ...makers.flatMap(([work, done, who]) => [
    `${work} was ${done} by ${who}.|the active is better: the doer is the point`,
    `Everyone knows that ${work.charAt(0).toLowerCase()}${work.slice(1)} was ${done} by ${who}.|the active is better: the doer is the point`,
  ]),
  ...blamed.flatMap(([thing, be, done], k) =>
    [0, 1]
      .map(
        (n) =>
          `${(blameFrames[(k + n) % 3] ?? "{x}").replace("{x}", `${thing} ${be} ${done}`)}|the active is better: the passive hides who is responsible`,
      )
      .map((line) => cap(line)),
  ),
  ...everyPair(samples, labVerbs)
    .filter((_, k) => k % 2 === 0)
    .map(([sample, [done, , , rest]]) => `The ${sample} was ${done} ${rest}.|the passive fits`),
]);

/** latinPlurals are a singular, its plural, the English plural and a wrong Latin ending. */
const latinPlurals = [
  ["fungus", "fungi", "funguses", "fungae"],
  ["bacterium", "bacteria", "bacteriums", "bacterii"],
  ["analysis", "analyses", "analysises", "analysi"],
  ["criterion", "criteria", "criterions", "criterii"],
  ["larva", "larvae", "larvas", "larvi"],
  ["nucleus", "nuclei", "nucleuses", "nucleae"],
  ["hypothesis", "hypotheses", "hypothesises", "hypothesi"],
  ["phenomenon", "phenomena", "phenomenons", "phenomeni"],
  ["stimulus", "stimuli", "stimuluses", "stimulae"],
  ["crisis", "crises", "crisises", "crisi"],
  ["radius", "radii", "radiuses", "radiae"],
  ["thesis", "theses", "thesises", "thesi"],
  ["vertebra", "vertebrae", "vertebras", "vertebri"],
  ["oasis", "oases", "oasises", "oasi"],
  ["diagnosis", "diagnoses", "diagnosises", "diagnosi"],
  ["alga", "algae", "algas", "algi"],
  ["axis", "axes", "axises", "axi"],
  ["bacillus", "bacilli", "bacilluses", "bacillae"],
  ["nebula", "nebulae", "nebulas", "nebuli"],
  ["locus", "loci", "locuses", "locae"],
  ["ovum", "ova", "ovums", "ovi"],
  ["genus", "genera", "genuses", "geni"],
  ["synopsis", "synopses", "synopsises", "synopsi"],
  ["ellipsis", "ellipses", "ellipsises", "ellipsi"],
  ["emphasis", "emphases", "emphasises", "emphasi"],
  ["parenthesis", "parentheses", "parenthesises", "parenthesi"],
  ["basis", "bases", "basises", "basi"],
  ["prognosis", "prognoses", "prognosises", "prognosi"],
  ["metamorphosis", "metamorphoses", "metamorphosises", "metamorphosi"],
  ["antithesis", "antitheses", "antithesises", "antithesi"],
  ["synthesis", "syntheses", "synthesises", "synthesi"],
  ["cumulus", "cumuli", "cumuluses", "cumulae"],
  ["erratum", "errata", "erratums", "errati"],
  ["addendum", "addenda", "addendums", "addendi"],
  ["phylum", "phyla", "phylums", "phyli"],
  ["quantum", "quanta", "quantums", "quanti"],
] as const;
const pluralFrames = ["one {s}, two ___", "a single {s}, several ___", "this {s} and those ___"] as const;
const pluralLines = join(
  latinPlurals.flatMap(([one, many, english, wrong], k) =>
    pluralFrames.filter((_, f) => k >= 18 || f > 0).map((frame) => `${frame.replace("{s}", one)}|${many}|${english}|${wrong}`),
  ),
);
const manyFrames = ["These ___ were studied in class.", "Both ___ appear in the report.", "Several ___ were listed on the board."] as const;
const oneFrames = [
  "This ___ was studied in class.",
  "Only one ___ appears in the report.",
  "A single ___ was listed on the board.",
] as const;
const plusS = (word: string) => (word.endsWith("s") ? `${word}es` : `${word}s`);
const numberLines = join(
  latinPlurals
    .filter((_, k) => k % 2 === 0 || k >= 18)
    .flatMap(([one, many], k) => [
      `${manyFrames[k % 3]?.replace("___", "___")}|${many}|${one}|${many.endsWith("s") ? plusS(one) : plusS(many)}`,
      `${oneFrames[(k + 1) % 3]}|${one}|${many}|${plusS(one)}`,
      `${manyFrames[(k + 2) % 3]}|${many}|${one}|${many.endsWith("s") ? plusS(one) : plusS(many)}`,
      `${oneFrames[k % 3]}|${one}|${many}|${plusS(one)}`,
    ]),
);

const confusedLabels: Readonly<Record<string, Label>> = {
  principal: {
    zh: "principal（校长；主要的）",
    why: [
      "*Principal* is the head of a school, or an adjective meaning main or most important.\n\n**Check.** Substitute *school head* or *main* in the blank: the sentence keeps the exact meaning.",
      "*principal* 指校长，或作形容词，意为主要的、最重要的。\n\n**检验。** 把空格换成“校长”或“主要的”读一遍，句意完全吻合。",
    ],
    not: ["*Principal* means the head of a school or main, which does not fit here.", "*principal* 意为校长或主要的，这里不合适。"],
  },
  principle: {
    zh: "principle（原则）",
    why: [
      "*Principle* is a rule or a belief that guides what someone does.\n\n**Check.** Substitute *rule* in the blank: both *principle* and *rule* end in *-le*, and *rule* fits the sentence.",
      "*principle* 指指导人们行为的规则或信念。\n\n**检验。** 把空格换成 *rule*（规则），两词都以 *-le* 结尾，放进句中意思顺畅。",
    ],
    not: ["*Principle* is a rule or belief, which does not fit here.", "*principle* 指规则或信念，这里不合适。"],
  },
  compliment: {
    zh: "compliment（赞美）",
    why: [
      "*Compliment* is praise, or to praise someone: *She complimented my drawing.*\n\n**Check.** Substitute *praise* in the blank: the sentence still says someone expressed admiration.",
      "*compliment* 指赞美，或赞美某人：*She complimented my drawing.*\n\n**检验。** 把空格换成“夸奖/赞美”，句意仍然是表达欣赏。",
    ],
    not: ["*Compliment* means praise, which does not fit here.", "*compliment* 意为赞美，这里不合适。"],
  },
  complement: {
    zh: "complement（补充；相配）",
    why: [
      "*Complement* means to complete or go well with something: *The sauce complements the fish.*\n\n**Check.** Notice *compl**e**ment* shares its *e* with *compl**e**te*: the sentence is about completing or matching, not praising.",
      "*complement* 意为补全或与某物相配：*The sauce complements the fish.*\n\n**检验。** *compl**e**ment* 和 *compl**e**te* 一样带 *e*，句子说的是配齐或相配，而不是夸奖。",
    ],
    not: ["*Complement* means to complete or go well with, which does not fit here.", "*complement* 意为补全或相配，这里不合适。"],
  },
  stationary: {
    zh: "stationary（静止的）",
    why: [
      "*Stationary* means not moving; remember *a* for *at rest*.\n\n**Check.** Substitute *still* or *not moving* in the blank: the sentence is describing a lack of motion.",
      "*stationary* 意为静止不动的；可以用 *a* 联想 *at rest*。\n\n**检验。** 把空格换成“静止不动的”读一遍，句子描述的正是没有移动的状态。",
    ],
    not: ["*Stationary* means not moving, which does not fit here.", "*stationary* 意为静止的，这里不合适。"],
  },
  stationery: {
    zh: "stationery（文具）",
    why: [
      "*Stationery* is writing paper and envelopes; remember *e* for *envelope*.\n\n**Check.** Substitute *writing paper* in the blank: the sentence talks about supplies for writing, not staying still.",
      "*stationery* 指信纸和信封等文具；可以用 *e* 联想 *envelope*。\n\n**检验。** 把空格换成“信纸/文具”，句子说的是书写用品，而不是保持静止。",
    ],
    not: ["*Stationery* is writing paper, which does not fit here.", "*stationery* 指文具，这里不合适。"],
  },
  council: {
    zh: "council（委员会）",
    why: [
      "*Council* is a group of people chosen to make decisions, such as a city council.\n\n**Check.** Substitute *committee* in the blank: the sentence refers to an elected or official group.",
      "*council* 指被选出来做决定的一群人，如市议会。\n\n**检验。** 把空格换成“委员会/议会”，句子指的正是负责决策的团体。",
    ],
    not: ["*Council* is a group that decides, which does not fit here.", "*council* 指决策团体，这里不合适。"],
  },
  counsel: {
    zh: "counsel（建议；劝告）",
    why: [
      "*Counsel* is advice, or to give advice: *She counseled patience.*\n\n**Check.** Substitute *advice* or *advise* in the blank: the sentence is about guidance, not a governing board.",
      "*counsel* 指建议，或给予建议：*She counseled patience.*\n\n**检验。** 把空格换成“建议”或“劝告”，句子谈的是指导意见，而不是议会团体。",
    ],
    not: ["*Counsel* means advice, which does not fit here.", "*counsel* 意为建议，这里不合适。"],
  },
  allusion: {
    zh: "allusion（典故；暗指）",
    why: [
      "*Allusion* is a brief mention of a famous person, story or event.\n\n**Check.** Substitute *reference* in the blank: the sentence points to a known work or event rather than a visual trick.",
      "*allusion* 指对著名人物、故事或事件的简短提及。\n\n**检验。** 把空格换成“典故/提及”，句子指向的是某个广为人知的作品或事件，而非错觉。",
    ],
    not: ["*Allusion* is a mention of something famous, which does not fit here.", "*allusion* 指暗指著名的事物，这里不合适。"],
  },
  illusion: {
    zh: "illusion（错觉；幻想）",
    why: [
      "*Illusion* is something that looks real or true but is not.\n\n**Check.** Substitute *false appearance* or *trick of the eye* in the blank: the sentence describes something deceptive.",
      "*illusion* 指看起来真实但并非如此的东西。\n\n**检验。** 把空格换成“假象/错觉”，句子描述的正是让人看花眼的现象。",
    ],
    not: ["*Illusion* is a false appearance, which does not fit here.", "*illusion* 指假象，这里不合适。"],
  },
  emigrate: {
    zh: "emigrate（移居出境）",
    why: [
      "*Emigrate* is to **leave** one's own country to live elsewhere: *emigrate from*.\n\n**Check.** Look at the preposition right after the blank: *from* signals leaving (*e-* for *exit*), which pairs with *emigrate*.",
      "*emigrate* 指**离开**本国去别处居住：*emigrate from*。\n\n**检验。** 看空格后面的介词：*from* 表示“离开”（*e-* 对应 *exit*），与 *emigrate* 搭配。",
    ],
    not: ["*Emigrate* means to leave a country, which does not fit here.", "*emigrate* 意为离开一个国家，这里不合适。"],
  },
  immigrate: {
    zh: "immigrate（移居入境）",
    why: [
      "*Immigrate* is to **come into** a new country to live: *immigrate to*.\n\n**Check.** Look at the preposition right after the blank: *to* signals moving into a destination (*in-* for *into*), which pairs with *immigrate*.",
      "*immigrate* 指**来到**一个新国家居住：*immigrate to*。\n\n**检验。** 看空格后面的介词：*to* 表示“进入目的地”（*im-* 对应 *into*），与 *immigrate* 搭配。",
    ],
    not: ["*Immigrate* means to come into a country, which does not fit here.", "*immigrate* 意为移入一个国家，这里不合适。"],
  },
  farther: {
    zh: "farther（更远，指距离）",
    why: [
      "*Farther* is for real physical distance you could measure.\n\n**Check.** Ask whether you could measure the gap in meters or miles — here you can, so *farther* (with *far* inside it) fits.",
      "*farther* 用于可以测量的实际距离。\n\n**检验。** 看这段差距能否用米或公里量出来——这里可以，所以用含 *far* 的 *farther*。",
    ],
    not: ["*Farther* is for measurable distance, which this is not.", "*farther* 用于可测量的距离，这里不是。"],
  },
  further: {
    zh: "further（进一步）",
    why: [
      "*Further* means more or to a greater degree, for ideas, discussion, or time rather than physical distance.\n\n**Check.** Substitute *additional* or *more* in the blank: the sentence makes full sense without any physical distance involved.",
      "*further* 意为更多或更进一步，用于想法、讨论或时间，而不是实际距离。\n\n**检验。** 把空格换成“更多的”或“更深入地”，句意通顺且不涉及物理距离。",
    ],
    not: [
      "*Further* means more, for ideas rather than distance, which does not fit here.",
      "*further* 意为进一步，用于想法而不是距离，这里不合适。",
    ],
  },
  imply: {
    zh: "imply（暗示）",
    why: [
      "The speaker, writer, or clue **implies**: it suggests something without stating it outright.\n\n**Check.** Check who is doing the action: the sender of the message hints at it, rather than a reader working it out.",
      "说话人、写作者或线索**暗示**：不直接说出而加以提示。\n\n**检验。** 看动作的主语：是发出信息的一方在含蓄表达，而不是读者在推理。",
    ],
    not: ["*Imply* is what a speaker does, which does not fit here.", "*imply* 是说话人做的事，这里不合适。"],
  },
  infer: {
    zh: "infer（推断）",
    why: [
      "The listener or reader **infers**: they work out a meaning from clues.\n\n**Check.** Check who is doing the action: someone is drawing a conclusion *from* evidence, which is what *infer* names.",
      "听者或读者**推断**：根据线索得出意思。\n\n**检验。** 看动作的主语：是接收信息的一方根据线索得出结论，所以用 *infer*。",
    ],
    not: ["*Infer* is what a listener does, which does not fit here.", "*infer* 是听者做的事，这里不合适。"],
  },
  precede: {
    zh: "precede（在……之前）",
    why: [
      "*Precede* means to come before: *A storm preceded the flood.*\n\n**Check.** Notice the prefix *pre-* means *before*: substituting *come before* keeps the exact timeline of the sentence.",
      "*precede* 意为在……之前：*A storm preceded the flood.*\n\n**检验。** 前缀 *pre-* 表示“在……之前”，把空格换成“先于……发生”，时间顺序完全一致。",
    ],
    not: ["*Precede* means to come before, which does not fit here.", "*precede* 意为在前，这里不合适。"],
  },
  proceed: {
    zh: "proceed（继续进行）",
    why: [
      "*Proceed* means to go on or continue: *Please proceed to gate four.*\n\n**Check.** Notice the prefix *pro-* means *forward*: substituting *go forward* or *continue* fits the sentence.",
      "*proceed* 意为继续进行：*Please proceed to gate four.*\n\n**检验。** 前缀 *pro-* 表示“向前”，把空格换成“继续”或“前往”，句意自然通顺。",
    ],
    not: ["*Proceed* means to go on, which does not fit here.", "*proceed* 意为继续，这里不合适。"],
  },
  adapt: {
    zh: "adapt（适应）",
    why: [
      "*Adapt* means to change in order to fit new conditions.\n\n**Check.** Substitute *adjust* in the blank: *adapt* and *adjust* both start with *ad-* and describe changing to fit.",
      "*adapt* 意为为了适应新情况而改变。\n\n**检验。** 把空格换成“调整/适应”，句子说的是为适应环境而做出改变。",
    ],
    not: ["*Adapt* means to change to fit, which does not fit here.", "*adapt* 意为适应，这里不合适。"],
  },
  adopt: {
    zh: "adopt（采用；收养）",
    why: [
      "*Adopt* means to take something as your own, such as a plan, a rule or a child.\n\n**Check.** Substitute *take as one's own* in the blank: nothing is being reshaped to fit — something is being taken in.",
      "*adopt* 意为把某物当作自己的，如采用计划、规则或收养孩子。\n\n**检验。** 把空格换成“采纳”或“收养”，句子说的是接纳为己有，而不是改造适应。",
    ],
    not: ["*Adopt* means to take as your own, which does not fit here.", "*adopt* 意为采用，这里不合适。"],
  },
};

const confused = topic("grammar", {
  id: "commonly-confused-words-3",
  title: ["Commonly Confused Words 3", "易混淆词（三）"],
  summary: [
    "Pairs such as principal and principle, imply and infer, or farther and further sound alike or close, but mean different things.",
    "principal 与 principle、imply 与 infer、farther 与 further 这样的词读音相同或相近，意思却不同。",
  ],
  intro: [
    "Spell-checkers never catch a real word put in the wrong slot: *The town council gave wise counsel* and *A speaker implies while a listener infers.* One letter can flip a sentence's meaning from praise to matching or from leaving to arriving. In this topic you distinguish homophones and look-alike pairs by their meaning and clues in the sentence.",
    "拼写检查不会标出用错位置的真实单词，例如 *The town council gave wise counsel* 或 *A speaker implies while a listener infers.* 往往一个字母之差，句意就从“赞美”变成“相配”，或从“移出”变成“移入”。本节通过词义和语境线索区分同音词与形近易混词。",
  ],
  after: ["commonly-confused-words-2"],
  points: [
    label(
      "words-that-sound-alike",
      ["Words That Sound Alike", "同音词"],
      [
        "Some words sound the same but are spelled differently and mean different things. A **principal** runs a school (*the principal is your pal*); a **principle** is a rule. A **compliment** is praise; to **complement** is to complete. **Stationary** means not moving; **stationery** is paper for letters. A **council** is a group; **counsel** is advice.\n\n> **Watch out.** *Principal* is not only a noun for a school head; it is also an adjective meaning *main* (*the principal reason*). Always check whether the sentence means *main* or *rule*.",
        "有些词读音相同，拼写和意思却不同。**principal** 是校长（*the principal is your pal*）；**principle** 是原则。**compliment** 是赞美；**complement** 是补全。**stationary** 意为静止的；**stationery** 是写信用的纸。**council** 是委员会；**counsel** 是建议。\n\n> **注意。** *principal* 不只是名词“校长”，还能作形容词表示“主要的”（*the principal reason*）。要看句子表达的是“主要的”还是“原则”。",
      ],
      ["Which word belongs in the blank?", "空格里应该填哪个词？"],
      `
${soundAlikeLines}
        The ___ welcomed the new students at the assembly.|principal|principle|counsel
        Honesty is a ___ she never breaks.|principle|principal|council
        The ___ reason for the delay was the snow.|principal|principle|complement
        Our club follows one simple ___: everyone gets a turn.|principle|principal|counsel
        He blushed when she paid him a ___ on his speech.|compliment|complement|counsel
        The red scarf is a perfect ___ to her coat.|complement|compliment|council
        Thank you for the kind ___ about my painting.|compliment|complement|principle
        A good wine sauce will ___ the fish.|complement|compliment|counsel
        The bus remained ___ while the driver waited.|stationary|stationery|principal
        I wrote the letter on blue ___ with matching envelopes.|stationery|stationary|council
        Ride the ___ bike at the gym for twenty minutes.|stationary|stationery|principle
        The shop sells pens, notebooks and other ___.|stationery|stationary|counsel
        The city ___ voted to build a new library.|council|counsel|principal
        The lawyer gave her client wise ___.|counsel|council|principle
        Each class elects two members to the student ___.|council|counsel|compliment
        She went to her grandmother for ___ before the big decision.|counsel|council|complement
        The ___ of the school met with the parents.|principal|principle|council
        Fairness was the guiding ___ of the new rules.|principle|principal|counsel
        Her blue eyes ___ her dark hair.|complement|compliment|counsel
        Accept the ___ with a smile and a thank you.|compliment|complement|council
        The satellite seems ___, but it moves with the Earth.|stationary|stationery|principal
        Mom bought new ___ for her thank-you notes.|stationery|stationary|counsel
        The town ___ meets on the first Monday of each month.|council|counsel|principle
        The coach will ___ the players to stay calm.|counsel|council|compliment
        Salt and pepper are the ___ spices in the dish.|principal|principle|counsel
        It is against my ___ to cheat on a test.|principle|principal|council
        The two players ___ each other well on the field.|complement|compliment|counsel
        He gave me a ___ on my new haircut.|compliment|complement|principle
        Keep the camera ___ when you take the picture.|stationary|stationery|principal
        The ___ elected a new chairperson.|council|counsel|complement
      `,
      confusedLabels,
    ),
    label(
      "words-close-in-meaning-or-form",
      ["Words Close in Meaning or Form", "意思或形式相近的词"],
      [
        "Other pairs look or sound close. An **allusion** mentions something famous; an **illusion** is a false appearance. You **emigrate from** your country and **immigrate to** a new one. **Farther** is for distance; **further** means more. A speaker **implies**; a listener **infers**. To **precede** is to come before; to **proceed** is to go on. To **adapt** is to change; to **adopt** is to take as your own.\n\n> **Watch out.** *Imply* and *infer* are opposite sides of the same moment: the speaker or clue *implies*, and the listener or reader *infers*. Check which side is the subject of the sentence.",
        "另一些词对的形式或读音相近。**allusion** 是提及著名的事物；**illusion** 是假象。你从本国 **emigrate from**，移入新的国家是 **immigrate to**。**farther** 用于距离；**further** 意为更进一步。说话人 **imply**（暗示）；听者 **infer**（推断）。**precede** 是在前；**proceed** 是继续。**adapt** 是适应；**adopt** 是采用。\n\n> **注意。** *imply* 和 *infer* 是同一件事的两面：说话人或线索去 *imply*（暗示），听者或读者去 *infer*（推断）。要看句子的主语站在哪一边。",
      ],
      ["Which word belongs in the blank?", "空格里应该填哪个词？"],
      `
${closeFormLines}
        Her speech made an ___ to Martin Luther King's dream.|allusion|illusion|infer
        The mirror created the ___ of a bigger room.|illusion|allusion|imply
        His family decided to ___ from Ireland in 1880.|emigrate|immigrate|adopt
        Many people ___ to Canada every year.|immigrate|emigrate|adapt
        The lake is ___ away than it looks.|farther|further|precede
        We need ___ information before we decide.|further|farther|proceed
        Are you trying to ___ that I was late on purpose?|imply|infer|adopt
        From her smile, I ___ that she had won.|infer|imply|adapt
        A short speech will ___ the awards ceremony.|precede|proceed|imply
        After the break, we will ___ with the meeting.|proceed|precede|infer
        Animals must ___ to the cold of winter.|adapt|adopt|precede
        The school will ___ a new dress code next year.|adopt|adapt|proceed
        The poem contains an ___ to a Greek myth.|allusion|illusion|imply
        The magician's trick was only an ___.|illusion|allusion|infer
        My grandparents chose to ___ from Vietnam to start a new life.|emigrate|immigrate|adopt
        They hoped to ___ to the United States when they were young.|immigrate|emigrate|adapt
        Which runner threw the ball ___?|farther|further|proceed
        Let's not argue about this any ___.|further|farther|precede
        The author seems to ___ that the hero is lying.|imply|infer|adopt
        What can you ___ from the last line of the story?|infer|imply|adapt
        Lightning will always ___ thunder.|precede|proceed|imply
        Please ___ to the exit in an orderly line.|proceed|precede|infer
        It took me a month to ___ to my new school.|adapt|adopt|proceed
        The family wants to ___ a puppy from the shelter.|adopt|adapt|precede
        The title is an ___ to a famous painting.|allusion|illusion|infer
        Heat on the road can create the ___ of water.|illusion|allusion|imply
        He decided to ___ from his homeland after the war.|emigrate|immigrate|adapt
        Thousands of families wanted to ___ to Australia after the war.|immigrate|emigrate|adopt
        The town is ten kilometers ___ down the road.|farther|further|precede
        I have nothing ___ to say on the matter.|further|farther|proceed
      `,
      confusedLabels,
    ),
  ],
});

const semicolons = topic("grammar", {
  id: "semicolons-between-clauses",
  title: ["Semicolons between Clauses", "从句之间的分号"],
  summary: [
    "A semicolon joins two complete sentences that belong together, also before a transition such as however; it also separates list items that contain commas.",
    "分号连接两个关系紧密的完整句子，也用在 however 等过渡词之前；分号还用于分隔本身含有逗号的列表项。",
  ],
  intro: [
    "A comma is too weak to hold two complete sentences together, while a period can feel too abrupt. A semicolon bridges them neatly: *The ferry docked; passengers hurried ashore.* Semicolons also keep complex lists readable when the items already contain commas. In this topic you join clauses with semicolons and punctuate heavy lists.",
    "两个完整句子只用逗号连太弱，用句号断开又显得生硬，分号正好搭起桥梁：*The ferry docked; passengers hurried ashore.* 当列表项本身已含逗号时，分号也能让层次一目了然。本节练习用分号连接独立从句以及分隔复杂列表。",
  ],
  after: ["however-and-therefore"],
  points: [
    choose(
      "semicolon-or-comma",
      ["Semicolon or Comma", "分号还是逗号"],
      [
        "Two complete sentences cannot be joined by a comma alone; that is a comma splice. Join them with a **semicolon**: *The price rose; few people bought it.* When a transition such as *however*, *therefore* or *as a result* starts the second sentence, put a semicolon before it and a comma after it: *The price rose; **however,** people kept buying.* A comma is enough only with *and*, *but* or *so*.\n\n> **Watch out.** Do not put a semicolon before *and*, *but*, or *so* when joining two short clauses, and do not put a comma before *however* when a complete sentence stands on each side.",
        "两个完整的句子不能只用逗号连接，那是逗号粘连句。可以用**分号**连接：*The price rose; few people bought it.* 当 *however*、*therefore* 或 *as a result* 这样的过渡词引出第二个句子时，在它前面用分号，后面用逗号：*The price rose; **however,** people kept buying.* 只有与 *and*、*but* 或 *so* 连用时，逗号才够。\n\n> **注意。** 用 *and*、*but*、*so* 连接两个短句时前面用逗号而非分号；而 *however* 两侧都是完整句子时，前面必须用分号而不能只用逗号。",
      ],
      ["Which sentence is punctuated correctly?", "哪个句子的标点正确？"],
      `
${semicolonLines}
        the price rose few people bought it|The price rose; few people bought it.|The price rose, few people bought it.|The price; rose few people bought it.
        the price rose however people kept buying|The price rose; however, people kept buying.|The price rose, however, people kept buying.|The price rose; however people, kept buying.
        the shop opened early therefore the line was short|The shop opened early; therefore, the line was short.|The shop opened early, therefore, the line was short.|The shop opened early; therefore the line, was short.
        she saved every week she bought the bike in June|She saved every week; she bought the bike in June.|She saved every week, she bought the bike in June.|She saved; every week she bought the bike in June.
        the bank was closed as a result we used the machine|The bank was closed; as a result, we used the machine.|The bank was closed, as a result, we used the machine.|The bank was closed; as a result we, used the machine.
        demand was high and prices went up|Demand was high, and prices went up.|Demand was high; and, prices went up.|Demand was high and, prices went up.
        the coins were old they were worth a lot|The coins were old; they were worth a lot.|The coins were old, they were worth a lot.|The coins; were old they were worth a lot.
        the store raised prices consequently sales fell|The store raised prices; consequently, sales fell.|The store raised prices, consequently, sales fell.|The store raised prices; consequently sales, fell.
        I wanted the game but it cost too much|I wanted the game, but it cost too much.|I wanted the game; but, it cost too much.|I wanted the game but, it cost too much.
        the loan was large nevertheless they paid it back|The loan was large; nevertheless, they paid it back.|The loan was large, nevertheless, they paid it back.|The loan was large; nevertheless they, paid it back.
        some people save others spend everything|Some people save; others spend everything.|Some people save, others spend everything.|Some; people save others spend everything.
        the bakery made a profit so it hired a baker|The bakery made a profit, so it hired a baker.|The bakery made a profit; so, it hired a baker.|The bakery made a profit so, it hired a baker.
        the market crashed meanwhile gold prices rose|The market crashed; meanwhile, gold prices rose.|The market crashed, meanwhile, gold prices rose.|The market crashed; meanwhile gold, prices rose.
        cash is easy to lose cards are safer|Cash is easy to lose; cards are safer.|Cash is easy to lose, cards are safer.|Cash is easy; to lose cards are safer.
        the lemonade cost a dollar in addition cookies were fifty cents|The lemonade cost a dollar; in addition, cookies were fifty cents.|The lemonade cost a dollar, in addition, cookies were fifty cents.|The lemonade cost a dollar; in addition cookies, were fifty cents.
        we had little money but we had a plan|We had little money, but we had a plan.|We had little money; but, we had a plan.|We had little money but, we had a plan.
        the company grew quickly it now has ninety workers|The company grew quickly; it now has ninety workers.|The company grew quickly, it now has ninety workers.|The company; grew quickly it now has ninety workers.
        prices were low for example a loaf cost ten cents|Prices were low; for example, a loaf cost ten cents.|Prices were low, for example, a loaf cost ten cents.|Prices were low; for example a loaf, cost ten cents.
        she lent me five dollars I paid her back on Friday|She lent me five dollars; I paid her back on Friday.|She lent me five dollars, I paid her back on Friday.|She lent me; five dollars I paid her back on Friday.
        the sale ended instead the store offered coupons|The sale ended; instead, the store offered coupons.|The sale ended, instead, the store offered coupons.|The sale ended; instead the store, offered coupons.
        the stall sold out by noon we came too late|The stall sold out by noon; we came too late.|The stall sold out by noon, we came too late.|The stall; sold out by noon we came too late.
        the fee was small still many families could not pay it|The fee was small; still, many families could not pay it.|The fee was small, still, many families could not pay it.|The fee was small; still many families, could not pay it.
        the shirt was on sale so I bought two|The shirt was on sale, so I bought two.|The shirt was on sale; so, I bought two.|The shirt was on sale so, I bought two.
        interest rates rose borrowing became harder|Interest rates rose; borrowing became harder.|Interest rates rose, borrowing became harder.|Interest rates; rose borrowing became harder.
        the factory closed as a result many people lost jobs|The factory closed; as a result, many people lost jobs.|The factory closed, as a result, many people lost jobs.|The factory closed; as a result many, people lost jobs.
        I counted the money twice it was all there|I counted the money twice; it was all there.|I counted the money twice, it was all there.|I counted; the money twice it was all there.
        the plan was risky however it worked|The plan was risky; however, it worked.|The plan was risky, however, it worked.|The plan was risky; however it, worked.
        the town had no bank so people kept cash at home|The town had no bank, so people kept cash at home.|The town had no bank; so, people kept cash at home.|The town had no bank so, people kept cash at home.
        the toy was cheap it broke in a week|The toy was cheap; it broke in a week.|The toy was cheap, it broke in a week.|The toy; was cheap it broke in a week.
        we ran out of change therefore we paid by card|We ran out of change; therefore, we paid by card.|We ran out of change, therefore, we paid by card.|We ran out of change; therefore we, paid by card.
      `,
      (right) => [
        `*${right}* joins the two complete sentences cleanly: a semicolon between standalone clauses, a semicolon before a transition with a comma after it, or a comma before *and*, *but* or *so*.\n\n**Check.** Test both sides of the semicolon (or the comma + *and*/*but*/*so*): each side can stand alone as a full sentence with its own subject and verb.`,
        `*${right}* 准确连接了两个完整句子：独立分句之间用分号，过渡词前用分号、后用逗号，*and*、*but*、*so* 前用逗号。\n\n**检验。** 分别检查分号（或逗号加 *and*/*but*/*so*）两侧：两边各自都有主语和谓语，都能独立成句。`,
      ],
      [
        [
          "*{wrong}* joins two complete sentences with only commas, which makes a comma splice.",
          "*{wrong}* 只用逗号连接两个完整的句子，构成了逗号粘连句。",
        ],
        [
          "*{wrong}* puts the semicolon or comma in the wrong place, splitting a sentence where it should not be split.",
          "*{wrong}* 把分号或逗号放错了地方，在不该断开的地方断开了句子。",
        ],
      ],
    ),
    choose(
      "semicolons-in-a-list",
      ["Semicolons in a List", "列表中的分号"],
      [
        "Items in a list are usually separated by commas. But when the items themselves contain commas, as with *city, country* or *name, job*, separate the items with **semicolons** so the reader can tell them apart: *We visited Lima, Peru; Quito, Ecuador; and Bogotá, Colombia.*\n\n> **Watch out.** Keep the comma *inside* each item (*Lima, Peru*) and put the semicolon *between* items. Swapping them (*Lima; Peru, Quito; Ecuador*) splits each pair apart.",
        "列表中的各项通常用逗号分隔。但当各项本身含有逗号时，如 *city, country* 或 *name, job*，就要用**分号**分隔各项，好让读者分清：*We visited Lima, Peru; Quito, Ecuador; and Bogotá, Colombia.*\n\n> **注意。** 每一项内部仍然用逗号（*Lima, Peru*），项与项之间才用分号。如果反过来写成 *Lima; Peru, Quito; Ecuador*，就把本来成对的内容拆散了。",
      ],
      ["Which sentence is punctuated correctly?", "哪个句子的标点正确？"],
      `
${listLines}
        We visited Lima Peru Quito Ecuador and Bogotá Colombia.|We visited Lima, Peru; Quito, Ecuador; and Bogotá, Colombia.|We visited Lima, Peru, Quito, Ecuador, and Bogotá, Colombia.|We visited Lima; Peru, Quito; Ecuador, and Bogotá; Colombia.
        The speakers were Ana Ruiz a banker Tom Lee a farmer and Sara Diaz a chef.|The speakers were Ana Ruiz, a banker; Tom Lee, a farmer; and Sara Diaz, a chef.|The speakers were Ana Ruiz, a banker, Tom Lee, a farmer, and Sara Diaz, a chef.|The speakers were Ana Ruiz; a banker, Tom Lee; a farmer, and Sara Diaz; a chef.
        The meetings are on May 2 2025 June 6 2025 and July 4 2025.|The meetings are on May 2, 2025; June 6, 2025; and July 4, 2025.|The meetings are on May 2, 2025, June 6, 2025, and July 4, 2025.|The meetings are on May 2; 2025, June 6; 2025, and July 4; 2025.
        The shop sold pens red and blue paper lined and plain and glue.|The shop sold pens, red and blue; paper, lined and plain; and glue.|The shop sold pens, red and blue, paper, lined and plain, and glue.|The shop sold pens; red and blue, paper; lined and plain, and glue.
        Branches opened in Austin Texas Denver Colorado and Reno Nevada.|Branches opened in Austin, Texas; Denver, Colorado; and Reno, Nevada.|Branches opened in Austin, Texas, Denver, Colorado, and Reno, Nevada.|Branches opened in Austin; Texas, Denver; Colorado, and Reno; Nevada.
        The prizes went to Kim the treasurer Raj the secretary and Lu the president.|The prizes went to Kim, the treasurer; Raj, the secretary; and Lu, the president.|The prizes went to Kim, the treasurer, Raj, the secretary, and Lu, the president.|The prizes went to Kim; the treasurer, Raj; the secretary, and Lu; the president.
        We tasted apples sweet and crisp pears soft and juicy and plums tart.|We tasted apples, sweet and crisp; pears, soft and juicy; and plums, tart.|We tasted apples, sweet and crisp, pears, soft and juicy, and plums, tart.|We tasted apples; sweet and crisp, pears; soft and juicy, and plums; tart.
        The tour stops in Paris France Rome Italy and Madrid Spain.|The tour stops in Paris, France; Rome, Italy; and Madrid, Spain.|The tour stops in Paris, France, Rome, Italy, and Madrid, Spain.|The tour stops in Paris; France, Rome; Italy, and Madrid; Spain.
        The team has Mia a pitcher Leo a catcher and Zoe a shortstop.|The team has Mia, a pitcher; Leo, a catcher; and Zoe, a shortstop.|The team has Mia, a pitcher, Leo, a catcher, and Zoe, a shortstop.|The team has Mia; a pitcher, Leo; a catcher, and Zoe; a shortstop.
        The store is open Monday 9 to 5 Saturday 10 to 2 and Sunday noon to 4.|The store is open Monday, 9 to 5; Saturday, 10 to 2; and Sunday, noon to 4.|The store is open Monday, 9 to 5, Saturday, 10 to 2, and Sunday, noon to 4.|The store is open Monday; 9 to 5, Saturday; 10 to 2, and Sunday; noon to 4.
        The guests came from Cairo Egypt Nairobi Kenya and Accra Ghana.|The guests came from Cairo, Egypt; Nairobi, Kenya; and Accra, Ghana.|The guests came from Cairo, Egypt, Nairobi, Kenya, and Accra, Ghana.|The guests came from Cairo; Egypt, Nairobi; Kenya, and Accra; Ghana.
        The winners were Ben first place Ivy second place and Max third place.|The winners were Ben, first place; Ivy, second place; and Max, third place.|The winners were Ben, first place, Ivy, second place, and Max, third place.|The winners were Ben; first place, Ivy; second place, and Max; third place.
        The menu offered soup hot or cold salad with or without cheese and bread.|The menu offered soup, hot or cold; salad, with or without cheese; and bread.|The menu offered soup, hot or cold, salad, with or without cheese, and bread.|The menu offered soup; hot or cold, salad; with or without cheese, and bread.
        The bills were due on March 1 2024 April 1 2024 and May 1 2024.|The bills were due on March 1, 2024; April 1, 2024; and May 1, 2024.|The bills were due on March 1, 2024, April 1, 2024, and May 1, 2024.|The bills were due on March 1; 2024, April 1; 2024, and May 1; 2024.
        The authors are Li Wei a poet Omar Haddad a novelist and Jo Park a reporter.|The authors are Li Wei, a poet; Omar Haddad, a novelist; and Jo Park, a reporter.|The authors are Li Wei, a poet, Omar Haddad, a novelist, and Jo Park, a reporter.|The authors are Li Wei; a poet, Omar Haddad; a novelist, and Jo Park; a reporter.
        Our offices are in Leeds England Cork Ireland and Perth Scotland.|Our offices are in Leeds, England; Cork, Ireland; and Perth, Scotland.|Our offices are in Leeds, England, Cork, Ireland, and Perth, Scotland.|Our offices are in Leeds; England, Cork; Ireland, and Perth; Scotland.
        The board includes Dr. Ito the chair Ms. Cole the treasurer and Mr. Fox a member.|The board includes Dr. Ito, the chair; Ms. Cole, the treasurer; and Mr. Fox, a member.|The board includes Dr. Ito, the chair, Ms. Cole, the treasurer, and Mr. Fox, a member.|The board includes Dr. Ito; the chair, Ms. Cole; the treasurer, and Mr. Fox; a member.
        I packed shirts blue and white socks wool and cotton and shoes.|I packed shirts, blue and white; socks, wool and cotton; and shoes.|I packed shirts, blue and white, socks, wool and cotton, and shoes.|I packed shirts; blue and white, socks; wool and cotton, and shoes.
        The flights land in Oslo Norway Riga Latvia and Vilnius Lithuania.|The flights land in Oslo, Norway; Riga, Latvia; and Vilnius, Lithuania.|The flights land in Oslo, Norway, Riga, Latvia, and Vilnius, Lithuania.|The flights land in Oslo; Norway, Riga; Latvia, and Vilnius; Lithuania.
        The club chose Pia the leader Sam the planner and Kai the writer.|The club chose Pia, the leader; Sam, the planner; and Kai, the writer.|The club chose Pia, the leader, Sam, the planner, and Kai, the writer.|The club chose Pia; the leader, Sam; the planner, and Kai; the writer.
        Sales rose in Lyon France Porto Portugal and Ghent Belgium.|Sales rose in Lyon, France; Porto, Portugal; and Ghent, Belgium.|Sales rose in Lyon, France, Porto, Portugal, and Ghent, Belgium.|Sales rose in Lyon; France, Porto; Portugal, and Ghent; Belgium.
        The jobs went to Eva a cook Dan a driver and Lin a clerk.|The jobs went to Eva, a cook; Dan, a driver; and Lin, a clerk.|The jobs went to Eva, a cook, Dan, a driver, and Lin, a clerk.|The jobs went to Eva; a cook, Dan; a driver, and Lin; a clerk.
        The games are on Friday August 8 Saturday August 9 and Sunday August 10.|The games are on Friday, August 8; Saturday, August 9; and Sunday, August 10.|The games are on Friday, August 8, Saturday, August 9, and Sunday, August 10.|The games are on Friday; August 8, Saturday; August 9, and Sunday; August 10.
        The fair had rides fast and slow games easy and hard and food.|The fair had rides, fast and slow; games, easy and hard; and food.|The fair had rides, fast and slow, games, easy and hard, and food.|The fair had rides; fast and slow, games; easy and hard, and food.
        We wrote to Lagos Nigeria Dakar Senegal and Tunis Tunisia.|We wrote to Lagos, Nigeria; Dakar, Senegal; and Tunis, Tunisia.|We wrote to Lagos, Nigeria, Dakar, Senegal, and Tunis, Tunisia.|We wrote to Lagos; Nigeria, Dakar; Senegal, and Tunis; Tunisia.
        The panel had Nia a judge Ravi a lawyer and Ola a juror.|The panel had Nia, a judge; Ravi, a lawyer; and Ola, a juror.|The panel had Nia, a judge, Ravi, a lawyer, and Ola, a juror.|The panel had Nia; a judge, Ravi; a lawyer, and Ola; a juror.
        The trips were on June 3 2023 July 9 2023 and August 1 2023.|The trips were on June 3, 2023; July 9, 2023; and August 1, 2023.|The trips were on June 3, 2023, July 9, 2023, and August 1, 2023.|The trips were on June 3; 2023, July 9; 2023, and August 1; 2023.
        The family lived in Hue Vietnam Busan Korea and Osaka Japan.|The family lived in Hue, Vietnam; Busan, Korea; and Osaka, Japan.|The family lived in Hue, Vietnam, Busan, Korea, and Osaka, Japan.|The family lived in Hue; Vietnam, Busan; Korea, and Osaka; Japan.
        The finalists were Ali a singer Bea a dancer and Cy a juggler.|The finalists were Ali, a singer; Bea, a dancer; and Cy, a juggler.|The finalists were Ali, a singer, Bea, a dancer, and Cy, a juggler.|The finalists were Ali; a singer, Bea; a dancer, and Cy; a juggler.
        The stalls sold hats wool and straw bags large and small and belts.|The stalls sold hats, wool and straw; bags, large and small; and belts.|The stalls sold hats, wool and straw, bags, large and small, and belts.|The stalls sold hats; wool and straw, bags; large and small, and belts.
      `,
      (right) => [
        `*${right}* uses semicolons between the three list items while keeping commas inside each item.\n\n**Check.** Count the chunks separated by semicolons: there are three complete entries, and none of the internal pairs is split apart.`,
        `*${right}* 在三个列表项之间用分号分隔，同时在每一项内部保留逗号。\n\n**检验。** 数一数分号隔开的块：正好是三项完整内容，没有任何一项内部被拆散。`,
      ],
      [
        [
          "*{wrong}* uses only commas, so the reader cannot tell where one item ends and the next begins.",
          "*{wrong}* 只用了逗号，读者分不清一项在哪里结束、下一项从哪里开始。",
        ],
        ["*{wrong}* puts the semicolons inside the items instead of between them.", "*{wrong}* 把分号放在了各项内部，而不是各项之间。"],
      ],
    ),
  ],
});

const pastPerfect = topic("grammar", {
  id: "past-perfect-for-earlier-events",
  title: ["The Past Perfect for Earlier Events", "用过去完成时表示更早的事"],
  summary: [
    "When a story is already in the past, had plus a past participle shows what happened even earlier.",
    "当故事已经在讲过去时，用 had 加过去分词表示更早发生的事。",
  ],
  intro: [
    "When a story already sits in the past, you need a way to step one layer further back: *By noon, the baker had sold every loaf.* The helping verb *had* marks the earlier event so the timeline never tangles. In this topic you read timelines with the past perfect and choose between simple past and past perfect.",
    "当故事本身已经发生在过去，需要再往前追溯一步时，就用过去完成时：*By noon, the baker had sold every loaf.* 助动词 *had* 标出更早发生的动作，让时间线清清楚楚。本节练习辨认过去完成时的先后顺序，并在一般过去时与过去完成时之间做出选择。",
  ],
  after: ["irregular-past-participles"],
  points: [
    choose(
      "which-came-first",
      ["Which Came First", "哪件事先发生"],
      [
        "The **past perfect** (*had* + past participle) marks the **earlier** of two past events: *When the crew woke, the ship **had drifted** off course.* The drifting came first; the waking came second. With *before*, *after* or *by the time*, the past perfect goes with the event that happened first.\n\n> **Watch out.** Do not assume the first clause in the sentence happened first. Read the verbs: whichever event carries *had* + past participle happened earlier.",
        "**过去完成时**（*had* + 过去分词）标出两件过去的事中**较早**的一件：*When the crew woke, the ship **had drifted** off course.* 漂离航线在前，醒来在后。与 *before*、*after* 或 *by the time* 连用时，过去完成时用于先发生的那件事。\n\n> **注意。** 不要以为排在句子前半句的事就一定先发生。要看动词：带 *had* 加过去分词的那个动作才发生在前面。",
      ],
      ["Which event happened first?", "哪件事先发生？"],
      `
${firstLines}
        When the crew woke, the ship had drifted off course.|the ship drifted|the crew woke|the two happened at the same moment
        By the time the rescue came, the robot had fixed the engine.|the robot fixed the engine|the rescue came|the two happened at the same moment
        She had never seen Earth from space before she joined the mission.|she had not seen Earth|she joined the mission|the two happened at the same moment
        The colony had run out of water when the supply ship landed.|the colony ran out of water|the supply ship landed|the two happened at the same moment
        After the storm had passed, the explorers left the cave.|the storm passed|the explorers left|the two happened at the same moment
        The alarm rang, but the captain had already left the bridge.|the captain left|the alarm rang|the two happened at the same moment
        When we reached the station, the train had gone.|the train went|we reached the station|the two happened at the same moment
        He realized he had left his key card in the lab.|he left the key card|he realized it|the two happened at the same moment
        The scientists had tested the suit many times before the first walk.|they tested the suit|the first walk|the two happened at the same moment
        By the time Mira woke up, the city had changed completely.|the city changed|Mira woke up|the two happened at the same moment
        The machine stopped because someone had cut the power.|someone cut the power|the machine stopped|the two happened at the same moment
        They had lived on Mars for ten years when the message arrived.|they lived on Mars|the message arrived|the two happened at the same moment
        Before the door opened, the guards had locked every window.|the guards locked the windows|the door opened|the two happened at the same moment
        The robot remembered that it had seen the boy before.|it saw the boy|it remembered|the two happened at the same moment
        When the lights came back, the stranger had disappeared.|the stranger disappeared|the lights came back|the two happened at the same moment
        We had finished dinner when the spaceship flew over.|we finished dinner|the spaceship flew over|the two happened at the same moment
        The planet had cooled for millions of years before life began.|the planet cooled|life began|the two happened at the same moment
        After she had read the warning, she closed the hatch.|she read the warning|she closed the hatch|the two happened at the same moment
        Jon knew the answer because he had studied the map.|he studied the map|Jon knew the answer|the two happened at the same moment
        By the time the council voted, the people had already decided.|the people decided|the council voted|the two happened at the same moment
        The town was silent; everyone had gone inside.|everyone went inside|the town was silent|the two happened at the same moment
        The pilot had checked the fuel before the ship took off.|the pilot checked the fuel|the ship took off|the two happened at the same moment
        When I arrived, the meeting had started.|the meeting started|I arrived|the two happened at the same moment
        The dog barked at the robot it had never met.|it had not met the robot|the dog barked|the two happened at the same moment
        She thanked the man who had saved her life.|the man saved her|she thanked him|the two happened at the same moment
        The forest had burned before the rains came.|the forest burned|the rains came|the two happened at the same moment
        By noon, the sun had melted the ice.|the sun melted the ice|noon came|the two happened at the same moment
        The students had heard the story before the teacher told it.|they heard the story|the teacher told it|the two happened at the same moment
        When the doors opened, the crowd had waited for hours.|the crowd waited|the doors opened|the two happened at the same moment
        The ship had landed safely, so the families cheered.|the ship landed|the families cheered|the two happened at the same moment
      `,
      (right) => [
        `First, **${right}**: the verb with *had* marks the earlier of the two past events.\n\n**Check.** Put the two events on a timeline: the *had* action was already finished before the simple-past event took place.`,
        `先发生的是 **${right}**：带 *had* 的动词标出两件过去的事中较早的那件。\n\n**检验。** 把两件事排在时间线上：带 *had* 的动作在一般过去时的事件发生之前就已经完成了。`,
      ],
      [
        [
          "*{wrong}* happened later; the verb with *had* shows the event that came before it.",
          "*{wrong}* 发生得较晚；带 *had* 的动词表示在它之前发生的事。",
        ],
        [
          "The past perfect shows that one event came first, so they did not happen at once.",
          "过去完成时表示一件事先发生，所以两件事并非同时发生。",
        ],
      ],
    ),
    choose(
      "past-or-past-perfect",
      ["Past or Past Perfect", "一般过去时还是过去完成时"],
      [
        "Use the **simple past** for the main line of events and the **past perfect** for something that happened before it: *When I **got** home, my brother **had eaten** all the soup.* Do not use the past perfect for events told in the order they happened: *I woke up, **ate** breakfast and **left**.*\n\n> **Watch out.** Do not mix *has/have* (present perfect) into a past-tense story: when the anchor event is in the past (*got*, *arrived*, *rang*), the earlier action needs *had*, not *has* or *have*.",
        "用**一般过去时**讲事件的主线，用**过去完成时**讲在它之前发生的事：*When I **got** home, my brother **had eaten** all the soup.* 按发生顺序讲述的事件不要用过去完成时：*I woke up, **ate** breakfast and **left**.*\n\n> **注意。** 过去时态的故事里不要混入 *has/have*（现在完成时）：当基准事件是过去时（*got*、*arrived*、*rang*）时，更早的动作要用 *had*，而不是 *has* 或 *have*。",
      ],
      ["Which verb completes the sentence?", "哪个动词能补全句子？"],
      `
${perfectLines}
        When I got home, my brother ___ all the soup.|had eaten|has eaten|eats
        By the time the robot arrived, the fire ___ out.|had gone|has gone|goes
        She ___ the book before, so she knew the ending.|had read|has read|reads
        The crew ___ for help long before the ship appeared.|had called|has called|calls
        I woke up, ___ breakfast and left for school.|ate|had eaten|eats
        When the bell rang, the test ___ an hour.|had lasted|has lasted|lasts
        They ___ the city before the war began.|had left|have left|leave
        After the guard ___ the gate, the prisoners escaped.|had opened|has opened|opens
        He opened the door, ___ inside and sat down.|walked|had walked|walks
        We were tired because we ___ all day.|had walked|have walked|walk
        By 2090, people ___ on the moon for decades.|had lived|have lived|live
        The captain ___ the map before the voyage began.|had studied|has studied|studies
        She smiled, ___ the letter and put it away.|folded|had folded|folds
        The town was empty; everyone ___ to the coast.|had fled|has fled|flees
        When I saw the stranger, I knew we ___ before.|had met|have met|meet
        The robot ___ the message before the signal failed.|had sent|has sent|sends
        I finished my homework and then ___ to bed.|went|had gone|go
        The scientists ___ the cure before the outbreak spread.|had found|have found|find
        He could not pay because he ___ his wallet.|had lost|has lost|loses
        The plants died because no one ___ them.|had watered|has watered|waters
        We arrived at the cinema, ___ tickets and found our seats.|bought|had bought|buy
        By the time the police came, the thief ___ away.|had run|has run|runs
        The ship ___ for three weeks when the sailors saw land.|had sailed|has sailed|sails
        Mia was nervous because she never ___ in public.|had spoken|has spoken|speaks
        The storm ___ by the time we reached the shore.|had ended|has ended|ends
        Leo picked up the phone, ___ a number and waited.|dialed|had dialed|dials
        After they ___ the river, they set up camp.|had crossed|have crossed|cross
        The museum ___ before we got there.|had closed|has closed|closes
        I recognized the song because I ___ it on the radio.|had heard|have heard|hear
        She got up, ___ her coat and went outside.|grabbed|had grabbed|grabs
      `,
      (right) => [
        `**${right}** matches the sentence's timeline: past perfect (*had* + participle) for an earlier past event, or simple past for actions moving forward in order.\n\n**Check.** Ask whether the blank reaches back before another past verb or simply continues a chain of past actions — *${right}* fits that exact step.`,
        `**${right}** 符合句子的时间线：更早发生的过去动作配过去完成时（*had* + 过去分词），顺着时间推进的连续动作配一般过去时。\n\n**检验。** 判断空格是在另一个过去动作之前发生，还是顺着过去动作往下推进，*${right}* 正好对应这一步。`,
      ],
      [
        [
          "*{wrong}* links the event to the present or to an order that does not fit this past story.",
          "*{wrong}* 把这件事与现在联系起来，或用了不符合这个过去故事的顺序。",
        ],
        ["*{wrong}* is in the present, but the story is told in the past.", "*{wrong}* 是现在时，而故事是用过去时讲述的。"],
      ],
    ),
  ],
});

const demands = topic("grammar", {
  id: "the-subjunctive-in-demands-and-proposals",
  title: ["The Subjunctive in Demands and Proposals", "要求和提议中的虚拟语气"],
  summary: [
    "After verbs such as demand, insist, propose and recommend, and after it is essential that, the verb takes its base form: that every voter be heard.",
    "在 demand、insist、propose、recommend 等动词之后，以及 it is essential that 之后，动词用原形：that every voter be heard。",
  ],
  intro: [
    "After a demand or proposal, English strips the verb down to its bare base form: *The referee insisted that the clock stop* and *It is vital that he be ready.* Notice there is no *-s* on *stop* and no *is* in place of *be*. In this topic you choose the subjunctive base form and distinguish demands from ordinary statements of fact.",
    "在要求或提议之后，英语会把从句动词还原成不带任何变化的原形：*The referee insisted that the clock stop* 和 *It is vital that he be ready.* 注意 *stop* 不加 *-s*，*be* 也不变成 *is*。本节练习在要求与提议从句中使用动词原形，并区分虚拟语气与普通陈述。",
  ],
  after: ["verb-moods"],
  points: [
    choose(
      "the-base-form-after-that",
      ["The Base Form after That", "that 之后的动词原形"],
      [
        "After verbs of demanding and proposing, such as *demand*, *insist*, *propose*, *recommend*, *request*, *suggest* and *ask*, the verb in the *that* clause takes its **base form**, with no *-s* and no tense: *The marchers demanded that the law **change**.* *We propose that she **be** our speaker.* Expressions such as *it is essential that* and *it is important that* work the same way.\n\n> **Watch out.** Even when the main verb is in the past (*demanded*, *insisted*) or the subject is singular (*he*, *she*, *every voter*), the *that*-clause verb still stays in its plain base form (*be*, *tell*, *drink*).",
        "在 *demand*、*insist*、*propose*、*recommend*、*request*、*suggest* 和 *ask* 等表示要求和提议的动词之后，*that* 从句中的动词用**原形**，不加 *-s*，也没有时态变化：*The marchers demanded that the law **change**.* *We propose that she **be** our speaker.* *it is essential that* 和 *it is important that* 等说法也是如此。\n\n> **注意。** 即使主句动词是过去时（*demanded*、*insisted*），或者从句主语是第三人称单数（*he*、*she*、*every voter*），*that* 从句里的动词也一律保持原形（*be*、*tell*、*drink*）。",
      ],
      ["Which verb completes the sentence?", "哪个动词能补全句子？"],
      `
${baseLines}
        The marchers demanded that the law ___.|change|changes|changed
        We propose that she ___ our speaker.|be|is|was
        The judge insisted that the witness ___ the truth.|tell|tells|told
        The doctor recommends that he ___ more water.|drink|drinks|drank
        It is essential that every voter ___ heard.|be|is|was
        The council requested that each citizen ___ a form.|sign|signs|signed
        I suggest that he ___ to the meeting early.|come|comes|came
        They asked that the mayor ___ the park open.|keep|keeps|kept
        It is important that she ___ on time.|arrive|arrives|arrived
        The leaders demanded that the prisoner ___ freed.|be|is|was
        The teacher insists that each student ___ a book.|read|reads|readed
        We recommend that the school ___ longer breaks.|allow|allows|allowed
        It is necessary that everyone ___ the rules.|follow|follows|followed
        She proposed that the club ___ every Friday.|meet|meets|met
        The workers demanded that the factory ___ safer.|be|is|was
        My parents insist that my brother ___ his room.|clean|cleans|cleaned
        It is vital that the bridge ___ repaired soon.|be|is|was
        The coach suggested that Ana ___ goalkeeper.|play|plays|played
        The petition asks that the city ___ a crosswalk.|build|builds|built
        It is essential that he ___ the medicine daily.|take|takes|took
        The board recommended that the store ___ on Sundays.|close|closes|closed
        The protesters insisted that their voices ___ counted.|be|are|were
        I request that this letter ___ read aloud.|be|is|was
        The rule requires that each player ___ a helmet.|wear|wears|wore
        She demanded that he ___ the money at once.|return|returns|returned
        It is important that the speech ___ short.|be|is|was
        The committee proposed that the vote ___ next week.|take place|takes place|took place
        We ask that every member ___ quietly.|listen|listens|listened
        The nurse suggested that he ___ in bed.|stay|stays|stayed
        The law demands that every child ___ to school.|go|goes|went
      `,
      (right) => [
        `**${right}** is the plain base form, which the subjunctive requires in a *that* clause after a demand, proposal, or *it is essential/important/vital that*.\n\n**Check.** Test the verb after *to* (*to ${right}*): it matches the dictionary base form with no *-s* and no past ending.`,
        `**${right}** 是动词原形，在表示要求、提议或 *it is essential/important/vital that* 之后的 *that* 从句中，虚拟语气要求用原形。\n\n**检验。** 把它放到 *to* 后面试一下（*to ${right}*）：正好是不加 *-s*、不带过去式的词典原形。`,
      ],
      [
        [
          "*{wrong}* is an ordinary present-tense form; after a demand or a proposal, the verb takes its base form with no *-s*.",
          "*{wrong}* 是普通的现在时形式；在要求或提议之后，动词用不加 *-s* 的原形。",
        ],
        [
          "*{wrong}* is in the past tense, but the verb after a demand or a proposal takes no tense at all.",
          "*{wrong}* 是过去时，而要求或提议之后的动词根本不带时态。",
        ],
      ],
    ),
    label(
      "subjunctive-or-not",
      ["Subjunctive or Not", "是否用虚拟语气"],
      [
        "Not every *that* clause takes the subjunctive. After verbs of **demanding or proposing**, the base form is right: *She insisted that he **leave**.* After verbs of **knowing or saying a fact**, such as *know*, *say*, *think* or *notice*, use an ordinary tense: *She noticed that he **leaves** early.* And *insist* can also mean *say firmly that something is true*: *He insisted that he **was** innocent.*\n\n> **Watch out.** Do not switch to the base form just because you see the word *that*. Look at the verb *before* *that*: only a demand, request, proposal, or urgency trigger calls for the subjunctive.",
        "并不是每个 *that* 从句都用虚拟语气。在表示**要求或提议**的动词之后，用原形是正确的：*She insisted that he **leave**.* 在表示**知道或陈述事实**的动词如 *know*、*say*、*think* 或 *notice* 之后，用普通时态：*She noticed that he **leaves** early.* 而且 *insist* 也可以表示*坚称某事属实*：*He insisted that he **was** innocent.*\n\n> **注意。** 不要一看到 *that* 就改用动词原形。要先看 *that* 前面的主句动词：只有表示要求、请求、提议或紧迫性的表达才触发虚拟语气。",
      ],
      ["Is the verb in italics correct?", "斜体的动词是否正确？"],
      `
${subjunctiveLabels}
        The marchers demanded that the law *change*.|correct
        The marchers demanded that the law *changes*.|should be the base form
        She noticed that he *leave* early every day.|should be an ordinary tense
        She noticed that he *leaves* early every day.|correct
        We propose that the meeting *be* shorter.|correct
        We propose that the meeting *is* shorter.|should be the base form
        I know that she *be* the captain.|should be an ordinary tense
        I know that she *is* the captain.|correct
        He insisted that he *was* innocent.|correct
        The judge insisted that the guard *leaves* the room.|should be the base form
        The judge insisted that the guard *leave* the room.|correct
        Everyone thinks that the plan *work* well.|should be an ordinary tense
        Everyone thinks that the plan *works* well.|correct
        It is essential that the rules *be* fair.|correct
        It is essential that the rules *are* fair.|should be the base form
        The report says that the river *be* polluted.|should be an ordinary tense
        The report says that the river *is* polluted.|correct
        The doctor recommended that she *rests* for a week.|should be the base form
        The doctor recommended that she *rest* for a week.|correct
        We noticed that the door *be* open.|should be an ordinary tense
        We noticed that the door *was* open.|correct
        The leaders asked that every town *sends* a delegate.|should be the base form
        The leaders asked that every town *send* a delegate.|correct
        I believe that he *tell* the truth.|should be an ordinary tense
        I believe that he *tells* the truth.|correct
        It is important that each voice *is* heard.|should be the base form
        It is important that each voice *be* heard.|correct
        The coach suggested that Sam *practices* more.|should be the base form
        The coach suggested that Sam *practice* more.|correct
        The news said that the strike *be* over.|should be an ordinary tense
      `,
      {
        correct: {
          zh: "正确",
          why: [
            "The verb fits the clause: the base form after a demand or proposal, or an ordinary tense after a verb of knowing or stating a fact.\n\n**Check.** Check the trigger before *that*: it matches the mood of the italicized verb.",
            "这个动词与从句相符：要求或提议之后用了原形，表示知道或陈述事实的动词之后用了普通时态。\n\n**检验。** 对照 *that* 前面的引导词：它与斜体动词的语气完全匹配。",
          ],
          not: ["The verb does not fit the kind of clause it is in, so it is not correct.", "这个动词与它所在的从句类型不符，所以不正确。"],
        },
        "should be the base form": {
          zh: "应该用原形",
          why: [
            "The clause follows a demand, request, or proposal, so the verb should take its bare base form with no *-s* or tense.\n\n**Check.** Replace the italicized verb with its plain base form (*be*, *change*, *leave*): the sentence now follows the subjunctive rule.",
            "这个从句跟在要求、请求或提议之后，所以动词应该用不加 *-s*、不带时态的原形。\n\n**检验。** 把斜体动词换成不带词尾变化的原形（如 *be*、*change*、*leave*），就符合虚拟语气规则了。",
          ],
          not: [
            "The clause does not follow a demand or proposal that calls for the base form here.",
            "这个从句并不跟在需要用原形的要求或提议之后。",
          ],
        },
        "should be an ordinary tense": {
          zh: "应该用普通时态",
          why: [
            "The clause follows a verb of knowing, thinking, or reporting a fact, so it needs an ordinary tense rather than the subjunctive base form.\n\n**Check.** Ask whether the main clause is urging someone to act or reporting what is true — it reports a fact, so an ordinary tense belongs here.",
            "这个从句跟在表示知道、认为或陈述事实的动词之后，所以要用普通时态，而不是虚拟语气原形。\n\n**检验。** 看主句是在要求别人做什么，还是在陈述事实——这里是在陈述事实，因此应该用普通时态。",
          ],
          not: [
            "The clause does not follow a verb of knowing or saying, so an ordinary tense is not what it needs.",
            "这个从句并不跟在表示知道或陈述的动词之后，所以它需要的不是普通时态。",
          ],
        },
      },
    ),
  ],
});

const passiveLabels: Readonly<Record<string, Label>> = {
  "the passive fits": {
    zh: "被动语态合适",
    why: [
      "The person who did the action does not matter here; what matters is what happened to the thing tested, so the passive keeps the focus in the right place.\n\n**Check.** Ask *Would naming the lab worker add anything useful?* — no, the procedure and sample are the whole point.",
      "这里做动作的人并不重要，重要的是被测试的东西经历了什么，所以被动语态把焦点放在了正确的位置上。\n\n**检验。** 问一句“写出是谁操作的，会增加有用的信息吗？”——不会，重点全在实验步骤和样本上。",
    ],
    not: ["Here the doer matters, so the passive is not the better choice.", "这里做动作的人很重要，所以被动语态不是更好的选择。"],
  },
  "the active is better: the doer is the point": {
    zh: "主动语态更好：做动作的人正是重点",
    why: [
      "The sentence names the doer, and that person is the news, so the active voice puts the doer right at the front.\n\n**Check.** Flip the sentence so the named doer is the subject: the sentence becomes shorter and more direct.",
      "句子点出了做动作的人，而且这个人正是要传达的重点，用主动语态就能把他直接放到句首。\n\n**检验。** 把点出名字的动作执行者改作主语读一遍，句子立刻更简短、更有力。",
    ],
    not: ["This sentence does not name a doer who is the point of the sentence.", "这个句子并没有点出作为句子重点的做动作的人。"],
  },
  "the active is better: the passive hides who is responsible": {
    zh: "主动语态更好：被动语态掩盖了谁负责",
    why: [
      "Someone is responsible for what went wrong, but the passive leaves that person out and dodges the question *who did it?*\n\n**Check.** Try adding *by …* to the sentence: you realize the real actor is missing on purpose, which the active voice would force into the open.",
      "有人要为出的问题负责，但被动语态把这个人省去了，回避了“到底是谁干的？”。\n\n**检验。** 试着在句尾补上 *by …*，就会发现真正该负责的人被刻意藏了起来，而主动语态会迫使句子说清楚。",
    ],
    not: [
      "This sentence does not hide a responsible person; either the doer does not matter or the doer is named.",
      "这个句子并没有掩盖负责的人：要么做动作的人不重要，要么已经点出了做动作的人。",
    ],
  },
};

const passiveScience = topic("grammar", {
  id: "passive-voice-in-science",
  title: ["The Passive Voice in Science", "科学写作中的被动语态"],
  summary: [
    "Science writing often uses the passive to keep the focus on what was tested, but the active is better when the doer matters.",
    "科学写作常用被动语态，把重点放在被测试的东西上；但当做动作的人重要时，主动语态更好。",
  ],
  intro: [
    "In a lab report, nobody cares which student held the beaker; readers care about the sample: *The crystals were weighed after drying.* Yet outside routine procedures, the passive can feel clunky or evasive. In this topic you build passive verb phrases accurately and judge when science or history writing should stay active.",
    "在实验报告里，读者关心的不是哪位同学端着烧杯，而是样本本身：*The crystals were weighed after drying.* 但在常规实验步骤之外，滥用被动语态会让句子笨重，甚至掩盖责任人。本节练习正确构成被动语态，并判断何时该用主动语态。",
  ],
  after: ["active-and-passive-voice"],
  points: [
    choose(
      "forming-the-passive",
      ["Forming the Passive", "构成被动语态"],
      [
        "The **passive voice** is a form of *be* plus a past participle: *The wing **was tested** in a wind tunnel.* The thing acted on becomes the subject. The tense lives in *be*: *is tested*, *was tested*, *has been tested*, *will be tested*. Science reports use it to describe what was done in an experiment.\n\n> **Watch out.** *Was testing* is not passive — it is past progressive active (*someone was testing*). Passive always pairs *be* with a **past participle** (*was tested*, *were frozen*).",
        "**被动语态**由 *be* 的某种形式加过去分词构成：*The wing **was tested** in a wind tunnel.* 被作用的东西成为主语。时态体现在 *be* 上：*is tested*、*was tested*、*has been tested*、*will be tested*。科学报告用它来描述实验中做了什么。\n\n> **注意。** *was testing* 不是被动语态，而是过去进行时的主动语态。被动语态必须由 *be* 加**过去分词**构成（如 *was tested*、*were frozen*）。",
      ],
      ["Which words complete the sentence in the passive?", "哪个选项能用被动语态补全句子？"],
      `
${passiveLines}
        Yesterday the wing ___ in a wind tunnel.|was tested|tested|was testing
        Each paper plane ___ three times last week.|was thrown|threw|was throwing
        The results ___ in the table below.|are shown|show|are showing
        Last year the first engine ___ by hand.|was built|built|was building
        Every flight ___ on video now.|is recorded|records|is recording
        The model ___ from balsa wood in 1903.|was made|made|was making
        Next week the data ___ by the class.|will be checked|will check|will be checking
        The air pressure ___ every ten seconds.|is measured|measures|is measuring
        The glider ___ off the hill at noon yesterday.|was launched|launched|was launching
        So far, the experiment ___ twice.|has been repeated|has repeated|has been repeating
        The kites ___ with string of the same length last time.|were tied|tied|were tying
        The wings ___ by twenty degrees for the second test.|were tilted|tilted|were tilting
        The distance of each flight ___ in meters.|is recorded|records|is recording
        In 1783 the first balloon ___ with hot air.|was filled|filled|was filling
        The results ___ to the class tomorrow.|will be presented|will present|will be presenting
        A small motor ___ to the propeller last week.|was attached|attached|was attaching
        The fuel ___ before every flight.|is weighed|weighs|is weighing
        Five designs ___ at the start of the project.|were drawn|drew|were drawing
        Each model ___ from the same height in our test.|was dropped|dropped|was dropping
        The temperature ___ at the start of each trial.|is noted|notes|is noting
        The new shape ___ by engineers in 2019.|was designed|designed|was designing
        The planes ___ in order of weight last week.|were ranked|ranked|were ranking
        Since March, the tunnel ___ for repairs.|has been closed|has closed|has been closing
        Each wing ___ with a ruler before the test.|was measured|measured|was measuring
        The air speed ___ by a sensor.|is controlled|controls|is controlling
        The pilot's notes ___ to the report next week.|will be added|will add|will be adding
        Two of the gliders ___ in the crash last Friday.|were damaged|damaged|were damaging
        The flights ___ on a calm day last spring.|were held|held|were holding
        The heaviest model ___ by the wind yesterday.|was pushed|pushed|was pushing
        The final design ___ by the judges last week.|was chosen|chose|was choosing
      `,
      (right) => [
        `**${right}** pairs the right tense of *be* with the past participle, forming the passive with the tested item as subject.\n\n**Check.** Verify two parts: *be* matches the subject's number and time clue, and the main verb is a past participle (not *-ing* and not bare active past).`,
        `**${right}** 用正确时态的 *be* 搭配过去分词，构成了以被测物体为主语的被动语态。\n\n**检验。** 核对两部分：*be* 的形式与主语单复数和时间状语一致，后面的实义动词是过去分词（不是 *-ing*，也不是单独的主动过去式）。`,
      ],
      [
        ["*{wrong}* is active, which would make the object itself do the action.", "*{wrong}* 是主动语态，会让那个物体自己去做这个动作。"],
        [
          "*{wrong}* is a progressive form, an action in progress, not the passive.",
          "*{wrong}* 是进行时形式，表示进行中的动作，不是被动语态。",
        ],
      ],
    ),
    label(
      "when-the-passive-fits",
      ["When the Passive Fits", "什么时候用被动语态合适"],
      [
        "In a lab report, the passive fits when the **doer does not matter**: *The water **was heated** to 80 degrees* (it does not matter who turned on the heat). Use the **active** when the doer is the point (*The Wright brothers flew the first plane*) or when the passive hides who is responsible and makes the sentence vague (*Mistakes were made*).\n\n> **Watch out.** Not every sentence with *by + person* belongs in the passive. When the person named after *by* is the real headline — an inventor, author, or witness — flip the sentence to active.",
        "在实验报告中，当**做动作的人不重要**时，用被动语态合适：*The water **was heated** to 80 degrees*（谁打开热源并不重要）。当做动作的人正是重点时（*The Wright brothers flew the first plane*），或者被动语态掩盖了谁负责、让句子含糊时（*Mistakes were made*），要用**主动语态**。\n\n> **注意。** 并非所有带 *by + 人名* 的句子都适合用被动语态。如果 *by* 后面的人正是句子的主角（发明者、作者、当事人），改为主动语态会更直接。",
      ],
      ["Is the passive a good choice here, or would the active be better?", "这里用被动语态好，还是用主动语态更好？"],
      `
${passiveFitLines}
        The water was heated to 80 degrees.|the passive fits
        The first powered flight was made by the Wright brothers in 1903.|the active is better: the doer is the point
        Each sample was weighed three times.|the passive fits
        Mistakes were made, but no one will say by whom.|the active is better: the passive hides who is responsible
        The paper planes were thrown from the same line.|the passive fits
        The prize was won by Amelia Earhart for her solo flight.|the active is better: the doer is the point
        The results were recorded in a table.|the passive fits
        A new theory of lift was proposed by Daniel Bernoulli.|the active is better: the doer is the point
        The wings were cut from the same sheet of card.|the passive fits
        The window was broken, and the report does not say who did it.|the active is better: the passive hides who is responsible
        The temperature was measured every minute.|the passive fits
        The famous speech was given by the astronaut after landing.|the active is better: the doer is the point
        The seeds were planted in three kinds of soil.|the passive fits
        It was decided that our group would skip the last test.|the active is better: the passive hides who is responsible
        The balloons were filled with equal amounts of air.|the passive fits
        The record was broken by a twelve-year-old pilot.|the active is better: the doer is the point
        Ten drops of dye were added to each glass.|the passive fits
        The experiment was ruined by Leo, who dropped the beaker.|the active is better: the doer is the point
        The model was tested in a wind tunnel.|the passive fits
        The telescope was invented by a Dutch lens maker.|the active is better: the doer is the point
        The data were checked for errors.|the passive fits
        The cake was eaten by my little brother before the party.|the active is better: the doer is the point
        The magnets were placed ten centimeters apart.|the passive fits
        The question was answered by the smartest student in class.|the active is better: the doer is the point
        Each trial was repeated five times.|the passive fits
        The lab was left a mess, but no names were given.|the active is better: the passive hides who is responsible
        The leaves were dried in the sun for a week.|the passive fits
        The rules of the contest were quietly changed the night before.|the active is better: the passive hides who is responsible
        The distance was measured with a tape.|the passive fits
        The first jet engine was built by Frank Whittle.|the active is better: the doer is the point
      `,
      passiveLabels,
    ),
  ],
});

const plurals = topic("grammar", {
  id: "plurals-from-latin-and-greek",
  title: ["Plurals from Latin and Greek", "来自拉丁语和希腊语的复数"],
  summary: [
    "Some science words keep the plural of the language they came from: one fungus, two fungi; one criterion, two criteria; one analysis, two analyses.",
    "一些科学词汇保留了来源语言的复数形式：one fungus, two fungi；one criterion, two criteria；one analysis, two analyses。",
  ],
  intro: [
    "Many scientific terms borrowed from Latin and Greek do not add *-s* to become plural: *one syllabus, two syllabi* and *one cactus, two cacti.* Because those plurals end in *-i*, *-a*, *-ae*, or *-es*, they can also fool writers into using singular verbs with plural nouns. In this topic you form classical plurals and match singular or plural forms to the rest of the sentence.",
    "许多源自拉丁语和希腊语的科学词汇不靠加 *-s* 变复数，比如 *one syllabus, two syllabi* 和 *one cactus, two cacti*。由于这些复数以 *-i*、*-a*、*-ae* 或 *-es* 结尾，很容易被误当成单数。本节练习构成这些经典复数形式，并根据句中线索正确选用单数或复数。",
  ],
  after: ["plural-nouns"],
  points: [
    choose(
      "making-the-plural",
      ["Making the Plural", "构成复数"],
      [
        "Many words of science come from Latin or Greek and keep their old plurals. **-us** becomes **-i** (*fungus*, *fungi*). **-um** becomes **-a** (*bacterium*, *bacteria*). **-is** becomes **-es** (*analysis*, *analyses*). **-on** becomes **-a** (*criterion*, *criteria*). **-a** becomes **-ae** (*larva*, *larvae*). **-ix** or **-ex** becomes **-ices** (*appendix*, *appendices*).\n\n> **Watch out.** Match the singular ending to its exact family: *-us* goes to *-i* (*nuclei*), while *-a* goes to *-ae* (*larvae*) — do not mix *-i* and *-ae* across endings.",
        "许多科学词汇来自拉丁语或希腊语，保留了原来的复数形式。**-us** 变成 **-i**（*fungus*、*fungi*）。**-um** 变成 **-a**（*bacterium*、*bacteria*）。**-is** 变成 **-es**（*analysis*、*analyses*）。**-on** 变成 **-a**（*criterion*、*criteria*）。**-a** 变成 **-ae**（*larva*、*larvae*）。**-ix** 或 **-ex** 变成 **-ices**（*appendix*、*appendices*）。\n\n> **注意。** 要把单数词尾和对应的复数变化对上号：*-us* 变 *-i*（*nuclei*），*-a* 变 *-ae*（*larvae*），不要把 *-i* 和 *-ae* 混用。",
      ],
      ["What is the plural?", "复数形式是什么？"],
      `
${pluralLines}
        one fungus, two ___|fungi|funguses|fungae
        one bacterium, many ___|bacteria|bacteriums|bacterii
        one analysis, two ___|analyses|analysises|analysi
        one criterion, three ___|criteria|criterions|criterii
        one larva, many ___|larvae|larvas|larvi
        one appendix, two ___|appendices|appendixes|appendi
        one nucleus, two ___|nuclei|nucleuses|nucleae
        one hypothesis, two ___|hypotheses|hypothesises|hypothesi
        one phenomenon, many ___|phenomena|phenomenons|phenomeni
        one cactus, three ___|cacti|cactuses|cactae
        one stimulus, many ___|stimuli|stimuluses|stimulae
        one crisis, two ___|crises|crisises|crisi
        one datum, many ___|data|datums|dati
        one antenna of an insect, two ___|antennae|antennas|antenni
        one radius, two ___|radii|radiuses|radiae
        one thesis, two ___|theses|thesises|thesi
        one medium, several ___|media|mediums|medii
        one vertebra, many ___|vertebrae|vertebras|vertebri
        one index, two ___|indices|indexes|indi
        one alumnus, many ___|alumni|alumnuses|alumnae
        one oasis, two ___|oases|oasises|oasi
        one curriculum, two ___|curricula|curriculums|curriculi
        one formula, many ___|formulae|formulas|formuli
        one stratum of rock, many ___|strata|stratums|strati
        one diagnosis, two ___|diagnoses|diagnosises|diagnosi
        one matrix, two ___|matrices|matrixes|matri
        one alga, many ___|algae|algas|algi
        one axis, two ___|axes|axises|axi
        one bacillus, many ___|bacilli|bacilluses|bacillae
        one memorandum, two ___|memoranda|memorandums|memorandi
      `,
      (right) => [
        `**${right}** keeps the classical plural of the word's Latin or Greek ending.\n\n**Check.** Trace the singular ending in the prompt (*-us → -i*, *-um/-on → -a*, *-is → -es*, *-a → -ae*, *-ix/-ex → -ices*): it maps directly to *${right}*.`,
        `**${right}** 保留了这个词拉丁语或希腊语词尾对应的经典复数形式。\n\n**检验。** 对照题面中单数词的词尾变化（*-us → -i*、*-um/-on → -a*、*-is → -es*、*-a → -ae*、*-ix/-ex → -ices*），正好得到 *${right}*。`,
      ],
      [
        [
          "*{wrong}* adds an English plural that science writing does not use for this word.",
          "*{wrong}* 加了英语式的复数，科学写作中这个词不这样用。",
        ],
        ["*{wrong}* uses the wrong Latin or Greek ending for this word.", "*{wrong}* 用了这个词不对的拉丁语或希腊语词尾。"],
      ],
    ),
    choose(
      "one-or-many",
      ["One or Many", "单数还是复数"],
      [
        "Because these plurals do not end in *-s*, they are easy to mistake for singulars. *Criteria*, *phenomena*, *bacteria* and *fungi* are plural: *These criteria **are** strict.* The singulars are *criterion*, *phenomenon*, *bacterium* and *fungus*: *This criterion **is** strict.* Match the noun to *this* or *these* and to the verb.\n\n> **Watch out.** Never add *-s* onto a word that is already plural (*criterias*, *bacterias*, *fungis*): *-a*, *-i*, and *-ae* already carry the plural meaning.",
        "因为这些复数不以 *-s* 结尾，所以容易被误当作单数。*criteria*、*phenomena*、*bacteria* 和 *fungi* 是复数：*These criteria **are** strict.* 单数是 *criterion*、*phenomenon*、*bacterium* 和 *fungus*：*This criterion **is** strict.* 名词要与 *this* 或 *these* 以及动词一致。\n\n> **注意。** 不要给本身已经是复数的词再加 *-s*（如 *criterias*、*bacterias*、*fungis*）：*-a*、*-i*、*-ae* 本身就已经表示复数了。",
      ],
      ["Which word completes the sentence?", "哪个词能补全句子？"],
      `
${numberLines}
        These ___ are strict.|criteria|criterion|criterias
        This ___ is the most important one.|criterion|criteria|criterions
        The northern lights are a beautiful ___.|phenomenon|phenomena|phenomenas
        Earthquakes and floods are natural ___.|phenomena|phenomenon|phenomenons
        A single ___ can divide in twenty minutes.|bacterium|bacteria|bacterias
        Many ___ live in the human gut.|bacteria|bacterium|bacteriums
        This ___ grows on dead logs.|fungus|fungi|fungis
        Mushrooms and molds are both ___.|fungi|fungus|fungis
        Each ___ of the cell holds its DNA.|nucleus|nuclei|nucleuses
        The ___ of these cells are stained blue.|nuclei|nucleus|nucleis
        The scientist tested one ___ at a time.|hypothesis|hypotheses|hypothesises
        Both ___ turned out to be wrong.|hypotheses|hypothesis|hypothesi
        The beetle's ___ hatch in the spring.|larvae|larva|larvas
        One ___ crawled out of the egg.|larva|larvae|larvaes
        This ___ needs very little water.|cactus|cacti|cactis
        These ___ bloom only at night.|cacti|cactus|cactuses
        The ___ were sent to three different labs.|analyses|analysis|analysises
        Her ___ showed that the water was safe.|analysis|analyses|analysi
        The ___ of a circle is half its width.|radius|radii|radiuses
        All the ___ of a circle are the same length.|radii|radius|radiis
        A ___ in the spine protects the nerves.|vertebra|vertebrae|vertebras
        The ___ of the neck are small.|vertebrae|vertebra|vertebraes
        Each ___ in the desert has a spring.|oasis|oases|oasises
        Travelers rested at two ___ on the way.|oases|oasis|oasi
        These ___ grow quickly in warm ponds.|algae|alga|algaes
        One ___ cell is too small to see.|alga|algae|algas
        A loud noise is a ___ that makes us jump.|stimulus|stimuli|stimuluses
        Light and sound are both ___.|stimuli|stimulus|stimulis
        One ___ in the table was clearly wrong.|datum|data|datums
        The ___ were collected over two years.|data|datum|datas
      `,
      (right) => [
        `**${right}** matches the number clues in the sentence: *a*, *one*, *this*, *each* and *is/was* take the singular; *these*, *both*, *several*, *many* and *are/were* take the plural.\n\n**Check.** Check the determiner and verb next to the blank: they agree with *${right}* in number, and *${right}* is a valid Latin/Greek form with no extra *-s*.`,
        `**${right}** 与句中的单复数线索一致：*a*、*one*、*this*、*each* 和 *is/was* 配单数；*these*、*both*、*several*、*many* 和 *are/were* 配复数。\n\n**检验。** 核对空格前后的限定词和动词：它们与 *${right}* 的单复数一致，且 *${right}* 是规范词形、没有多余的 *-s*。`,
      ],
      [
        ["*{wrong}* has the wrong number for the words around it.", "*{wrong}* 的单复数与周围的词不一致。"],
        ["*{wrong}* is not a real form of this word.", "*{wrong}* 不是这个词的真实形式。"],
      ],
    ),
  ],
});

/** grammarTopics7b are the grammar topics of the last units of grade 7. */
export const grammarTopics7b: readonly TopicDef[] = [confused, semicolons, pastPerfect, demands, passiveScience, plurals];
