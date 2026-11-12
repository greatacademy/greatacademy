// More gaps for the grammar parts of the exams: frames crossed with verbs, jobs, times and places give each knowledge
// point a hundred items or more; every item is built the same way on every run.

/** pickGap takes an element of a list by an index that may run past its end. */
const pickGap = <T>(list: readonly T[], i: number): T => list[i % list.length] as T;

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** irregulars are verbs whose past and past participle differ, each with two things it can act on. */
const irregulars = [
  ["steal", "stole", "stolen", ["my bike", "the painting"]],
  ["break", "broke", "broken", ["the window", "the vase"]],
  ["write", "wrote", "written", ["the letter", "the report"]],
  ["take", "took", "taken", ["the photo", "the money"]],
  ["eat", "ate", "eaten", ["the cake", "the last apple"]],
  ["draw", "drew", "drawn", ["the map", "the plan"]],
  ["hide", "hid", "hidden", ["the key", "the present"]],
  ["throw", "threw", "thrown", ["the old chair", "the ball"]],
  ["choose", "chose", "chosen", ["the winner", "the colour"]],
  ["wear", "wore", "worn", ["the old coat", "the blue dress"]],
  ["forget", "forgot", "forgotten", ["the password", "the address"]],
  ["shake", "shook", "shaken", ["the bottle", "the box"]],
  ["tear", "tore", "torn", ["the poster", "the ticket"]],
  ["freeze", "froze", "frozen", ["the soup", "the bread"]],
  ["drive", "drove", "driven", ["the van", "the bus"]],
  ["give", "gave", "given", ["the prize", "the medal"]],
  ["ring", "rang", "rung", ["the bell", "the alarm"]],
  ["sing", "sang", "sung", ["the song", "the anthem"]],
] as const;
const verbCases = irregulars.flatMap(([base, past, pp, things]) => things.map((thing) => [base, past, pp, thing] as const));

/** jobs are jobs that take *an* and jobs that take *a*. */
const jobs = [
  ["an", "architect"],
  ["an", "engineer"],
  ["an", "accountant"],
  ["an", "artist"],
  ["an", "editor"],
  ["an", "optician"],
  ["a", "nurse"],
  ["a", "pilot"],
  ["a", "teacher"],
  ["a", "chef"],
  ["a", "lawyer"],
  ["a", "university lecturer"],
] as const;
const other = (article: string) => (article === "an" ? "a" : "an");

/** times are times that take *at*, *on* and *in*. */
const times = [
  ["at", "half past seven"],
  ["at", "noon"],
  ["at", "midnight"],
  ["on", "Monday"],
  ["on", "Friday evening"],
  ["on", "the third of May"],
  ["in", "July"],
  ["in", "2027"],
  ["in", "the spring"],
] as const;
const notThis = (prep: string) => ["at", "on", "in"].filter((p) => p !== prep);

/** OpenGapLike is the shape of an open-cloze item: the sentence, accepted words, wrong words and the kind of word. */
type OpenGapLike<K extends string> = readonly [shown: string, accepted: readonly string[], wrong: readonly string[], kind: K];

/** moreGrammarWords are open-cloze gaps for articles before jobs and prepositions before times. */
export const moreGrammarWords: readonly OpenGapLike<"article" | "preposition">[] = [
  ...jobs.flatMap(([article, job], i) =>
    ["Rome", "Toronto", "Sydney"].map(
      (city, c): OpenGapLike<"article"> => [
        `${pickGap(["My cousin", "Her neighbour", "Our old friend"], i + c)} works as ___ ${job} in ${city}.`,
        [article],
        [other(article), "the"],
        "article",
      ],
    ),
  ),
  ...times.flatMap(([prep, time], i) =>
    ["The concert", "Our meeting", "The match", "The sale"].map(
      (event, e): OpenGapLike<"preposition"> => [
        `${event} ${pickGap(["starts", "will take place", "is", "begins"], i + e)} ___ ${time}.`,
        [prep],
        notThis(prep),
        "preposition",
      ],
    ),
  ),
];

const weathers = [
  ["it was cold", "the cold"],
  ["it was raining", "the rain"],
  ["it was windy", "the wind"],
  ["it was getting dark", "the dark"],
  ["it was snowing", "the snow"],
  ["it was very hot", "the heat"],
] as const;
const outings = [
  "went for a walk",
  "played football",
  "had a picnic",
  "went swimming",
  "kept working in the garden",
  "went to the beach",
] as const;

/** moreLinkingWords are open-cloze gaps that need *although* before a clause or *despite* before a noun. */
export const moreLinkingWords: readonly OpenGapLike<"linker">[] = weathers.flatMap(([clause, noun], i) =>
  outings.flatMap((outing, j): OpenGapLike<"linker">[] => {
    const who = pickGap(["We", "The children", "My parents", "They", "Our class", "The tourists"], i + j);
    return [
      [`${who} ${outing} ___ ${clause}.`, ["although", "though"], ["despite", "however"], "linker"],
      [`${who} ${outing} ___ ${noun}.`, ["despite"], ["although", "however"], "linker"],
    ];
  }),
);

/** TransformationLike is the shape of a key word item: first sentence, key word, second sentence, answers, wrong ones, kind. */
type TransformationLike<K extends string> = readonly [
  first: string,
  key: string,
  second: string,
  patterns: readonly string[],
  wrong: readonly string[],
  kind: K,
];

const placePairs = [
  ["hotel", "hostel"],
  ["café", "restaurant"],
  ["park", "square"],
  ["station", "airport"],
  ["museum", "gallery"],
  ["beach", "lake"],
] as const;
const placeAdjectives = [
  ["busy", "busier"],
  ["quiet", "quieter"],
  ["old", "older"],
  ["small", "smaller"],
  ["clean", "cleaner"],
  ["cheap", "cheaper"],
] as const;

/** morePassivesAndComparisons are key word items that turn a past action into the passive and a comparison around. */
export const morePassivesAndComparisons: readonly TransformationLike<"passive" | "comparison">[] = [
  ...verbCases.map(([, past, pp, thing], i): TransformationLike<"passive"> => {
    const when = pickGap(["yesterday", "last week", "on Sunday"], i);
    return [`Someone ${past} ${thing} ${when}.`, "WAS", `${cap(thing)} ___ ${when}.`, [`was ${pp}`], [`was ${past}`, pp], "passive"];
  }),
  ...placePairs.flatMap(([a, b]) =>
    placeAdjectives.map(
      ([adj, er]): TransformationLike<"comparison"> => [
        `The ${a} is ${er} than the ${b}.`,
        "AS",
        `The ${b} ___ the ${a}.`,
        [`isn't as ${adj} as`, `is not as ${adj} as`],
        [`isn't ${er} as`, `is as ${adj} as`],
        "comparison",
      ],
    ),
  ),
];

const names = ["Ben", "Maria", "Mr Lee", "the cleaner", "Anna", "the new boy"] as const;

/** moreConditionalsAndModals are key word items for a regret with *wish* and for certainty about the past. */
export const moreConditionalsAndModals: readonly TransformationLike<"conditional" | "modal">[] = verbCases.flatMap(
  ([base, past, pp, thing], i): TransformationLike<"conditional" | "modal">[] => {
    const name = pickGap(names, i);
    return [
      [
        `I'm sorry I ${past} ${thing}.`,
        "HAD",
        `I wish I ___ ${thing}.`,
        [`hadn't ${pp}`, `had not ${pp}`],
        [`didn't ${base}`, `hadn't ${past}`],
        "conditional",
      ],
      [
        `I'm sure someone ${past} ${thing}.`,
        "MUST",
        `Someone ___ ${thing}.`,
        [`must have ${pp}`],
        [`must ${pp}`, `must have ${past}`],
        "modal",
      ],
      [
        `It's impossible that ${name} ${past} ${thing}.`,
        "CAN'T",
        `${cap(name)} ___ ${thing}.`,
        [`can't have ${pp}`, `cannot have ${pp}`],
        [`can't ${pp}`, `mustn't have ${pp}`],
        "modal",
      ],
    ];
  },
);

/** moreGivenWords are grammar-filling gaps that need the passive of a given verb or the comparative of a given adjective. */
export const moreGivenWords: readonly OpenGapLike<"passive" | "comparison">[] = [
  ...verbCases.map(([base, past, pp, thing], i): OpenGapLike<"passive"> => {
    const when = pickGap(["two days ago", "last Sunday", "the day before yesterday"], i);
    return [`${cap(thing)} ___ (${base}) ${when}.`, [`was ${pp}`], [pp, `was ${past}`, `is ${pp}`], "passive"];
  }),
  ...placePairs.flatMap(([a, b], i) =>
    placeAdjectives.map(
      ([adj, er], j): OpenGapLike<"comparison"> => [
        `${pickGap(["In our town, the", "On weekdays, the", "Most of the year, the"], i + j)} ${a} is ___ (${adj}) than the ${b}.`,
        [er],
        [adj, `more ${adj}`, `${adj}est`],
        "comparison",
      ],
    ),
  ),
];

/** moreNoWordGiven are grammar-filling gaps that need an article before a job or a preposition before a time. */
export const moreNoWordGiven: readonly OpenGapLike<"article" | "preposition">[] = [
  ...jobs.flatMap(([article, job], i) =>
    ["for ten years", "since 2020", "all her life"].map(
      (how, h): OpenGapLike<"article"> => [
        `${pickGap(["My aunt", "Li Hua's mother", "Our neighbour"], i + h)} has been ___ ${job} ${how}.`,
        [article],
        [other(article), "the"],
        "article",
      ],
    ),
  ),
  ...times.flatMap(([prep, time], i) =>
    ["the baby was born", "the plane landed", "the school was opened", "the letter arrived"].map(
      (what, w): OpenGapLike<"preposition"> => [
        `${pickGap(["We heard that", "Everyone knows that", "The record shows that", "They told us that"], i + w)} ${what} ___ ${time}.`,
        [prep],
        notThis(prep),
        "preposition",
      ],
    ),
  ),
];
