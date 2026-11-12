// Grades 9 to 12: more cores for the grammar and style banks. Frames, people and phrases cross these cores into a
// hundred items or more for each knowledge point; every item is built the same way on every run.

/** pickMore takes an element of a list by an index that may run past its end. */
const pickMore = <T>(list: readonly T[], i: number): T => list[i % list.length] as T;

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** moreShapeCores are a main clause and three modifiers that may come before it (periodic) or after it (cumulative). */
export const moreShapeCores: readonly (readonly [main: string, mods: readonly string[]])[] = [
  ["the bus pulled away", ["late as always", "its windows fogged", "a crowd still waving behind it"]],
  ["the bridge collapsed", ["after a week of rain", "groaning under the trucks", "its cables snapping one by one"]],
  ["the boy finally spoke", ["after an hour of silence", "his voice shaking", "his eyes on the floor"]],
  ["the old tree fell", ["struck by lightning", "split down the middle", "its roots torn from the earth"]],
  ["the plane landed", ["through thick fog", "its wings rocking", "its engines roaring as it braked"]],
  ["the baby slept", ["warm in her blanket", "one fist under her chin", "deaf to the thunder outside"]],
  ["the king abdicated", ["in a short speech", "his crown on the table", "his ministers staring in disbelief"]],
  ["the team walked off the field", ["muddy", "beaten", "their heads bowed"]],
  ["the villagers rebuilt the school", ["after the earthquake", "with their own hands", "brick by brick"]],
  ["the wolf howled", ["alone on the ridge", "its breath steaming", "the moon huge behind it"]],
  ["the doctor gave the news", ["quietly", "her hand on my mother's shoulder", "the machines beeping softly"]],
  ["the market opened", ["at dawn", "noisy and crowded", "full of fish, spices and shouting"]],
  ["the poet read her last poem", ["in a whisper", "standing in the rain", "the crowd silent around her"]],
  ["the lighthouse went dark", ["after a century of service", "its lamp cold", "its keeper gone"]],
  ["the mountain disappeared", ["behind the clouds", "slowly", "peak first, then the forests, then the village"]],
  ["the old car started", ["coughing", "spitting smoke", "on the twentieth try"]],
  ["the children went quiet", ["at the first notes of the song", "their games forgotten", "their faces turned to the stage"]],
  ["the jury returned", ["after two days", "tired", "their verdict sealed in an envelope"]],
  ["the storm reached the coast", ["at midnight", "tearing roofs from houses", "pushing the sea into the streets"]],
  ["my father planted the garden", ["every spring", "kneeling in the mud", "whistling the same old song"]],
  ["the rebels took the palace", ["before sunrise", "without firing a shot", "the guards already gone"]],
  ["the cat came home", ["after three weeks", "thin", "a torn ribbon around its neck"]],
  ["the choir began to sing", ["softly at first", "in the dark church", "the candles flickering"]],
  ["the expedition turned back", ["out of food", "half frozen", "two days from the pole"]],
  ["the river froze", ["in a single night", "white and hard", "the boats locked in the ice"]],
  ["the student handed in the exam", ["last of all", "her pen still warm", "every page full"]],
  ["the ship left port", ["on the morning tide", "its flags flying", "its decks crowded with families"]],
  ["the fire burned out", ["by morning", "the forest black", "the smoke drifting over the town"]],
  ["the old woman smiled", ["for the first time in years", "her eyes wet", "the letter pressed to her chest"]],
  ["the soldiers crossed the river", ["at night", "in small boats", "their rifles held above the water"]],
  ["the crowd cheered", ["when the gates opened", "waving flags", "pushing toward the stage"]],
  ["the explorer reached the city", ["after months in the jungle", "sick with fever", "his maps lost in a river"]],
  ["the dancer took a bow", ["breathless", "her feet bleeding", "the audience on its feet"]],
  ["the train stopped", ["suddenly", "in the middle of the desert", "its brakes screaming"]],
  ["the hikers saw the lake", ["at the top of the pass", "still and blue", "the peaks mirrored in it"]],
  ["the town celebrated", ["for three days", "with music and fireworks", "the war finally over"]],
];

/** moreShapeParts are lines of "main clause|details|periodic|cumulative|split" built from the first two modifiers of each core. */
export const moreShapeParts = moreShapeCores
  .map(([main, mods]) => {
    const [a = "", b = ""] = mods;
    return `${main}|${a}; ${b}|${cap(a)}, ${b}, ${main}.|${cap(main)}, ${a}, ${b}.|${cap(a)}, ${main}, ${b}.`;
  })
  .join("\n");

/** actions are a verb as base, third person, past and participle, and the rest of its clause. */
const actions = [
  ["catch", "catches", "caught", "caught", "the early bus"],
  ["find", "finds", "found", "found", "the key"],
  ["win", "wins", "won", "won", "the race"],
  ["take", "takes", "took", "taken", "the medicine"],
  ["write", "writes", "wrote", "written", "the letter"],
  ["pass", "passes", "passed", "passed", "the test"],
  ["see", "sees", "saw", "seen", "the doctor"],
  ["finish", "finishes", "finished", "finished", "the work"],
] as const;
/** outcomes are a result as base form and participle. */
const outcomes = [
  ["be happy", "been happy"],
  ["feel better", "felt better"],
  ["tell us", "told us"],
  ["call home", "called home"],
] as const;

/** moreConditionalRows are lines of "sentence|right|wrong|wrong" for the verb form of a real, unreal or past unreal conditional. */
export const moreConditionalRows = actions
  .flatMap(([base, third, past, pp, rest]) =>
    outcomes.flatMap(([result, resultPP]) => [
      `If {F} ___ ${rest}, she will ${result}.|${third}|${past}|had ${pp}`,
      `If {F} ___ ${rest}, she would ${result}.|${past}|${third}|had ${pp}`,
      `If {F} ___ ${rest}, she would have ${resultPP}.|had ${pp}|${past}|would ${base}`,
    ]),
  )
  .join("\n");

const condPeople = [
  ["Ana", "she"],
  ["Ravi", "he"],
  ["my sister", "she"],
  ["the coach", "he"],
] as const;

/** moreConditionLines are lines of "sentence|kind" for naming a real, unreal present, unreal past or mixed conditional. */
export const moreConditionLines = (real: string, unrealNow: string, unrealPast: string, mixed: string): string =>
  actions
    .flatMap(([, third, past, pp, rest], i) =>
      outcomes.slice(0, 3).flatMap(([result, resultPP], j) => {
        const [who, pron] = pickMore(condPeople, i + j);
        return [
          `If ${who} ${third} ${rest}, ${pron} will ${result}.|${real}`,
          `If ${who} ${past} ${rest}, ${pron} would ${result}.|${unrealNow}`,
          `If ${who} had ${pp} ${rest}, ${pron} would have ${resultPP}.|${unrealPast}`,
          `If ${who} had ${pp} ${rest}, ${pron} would ${result} now.|${mixed}`,
        ];
      }),
    )
    .join("\n");

/** absolutePairs are a main clause, two absolutes as noun, be and participle, a participial phrase and a prepositional one. */
const absolutePairs: readonly (readonly [
  main: string,
  first: readonly [string, string, string],
  second: readonly [string, string, string],
  participial: string,
  prepositional: string,
])[] = [
  [
    "the girl began to sing",
    ["her hands", "were", "trembling"],
    ["her voice", "was", "rising over the noise"],
    "stepping onto the stage",
    "under the hot lights",
  ],
  [
    "the old man waited",
    ["his hat", "was", "pulled low"],
    ["his cane", "was", "resting against the bench"],
    "watching the trains",
    "on the platform",
  ],
  ["the dog slept", ["its paws", "were", "twitching"], ["its nose", "was", "buried in the blanket"], "dreaming of rabbits", "by the fire"],
  [
    "the boys raced down the hill",
    ["their bikes", "were", "rattling"],
    ["their jackets", "were", "flapping behind them"],
    "shouting at each other",
    "in the rain",
  ],
  [
    "the captain stood on deck",
    ["his coat", "was", "soaked through"],
    ["his eyes", "were", "fixed on the horizon"],
    "gripping the rail",
    "through the storm",
  ],
  [
    "the nurse hurried down the hall",
    ["her shoes", "were", "squeaking"],
    ["her arms", "were", "full of towels"],
    "calling for the doctor",
    "at midnight",
  ],
  [
    "the farmer walked home",
    ["his boots", "were", "caked with mud"],
    ["his dog", "was", "trotting at his heels"],
    "humming to himself",
    "at dusk",
  ],
  [
    "the queen entered the hall",
    ["her gown", "was", "trailing behind her"],
    ["her crown", "was", "glittering"],
    "nodding to the guests",
    "in silence",
  ],
  [
    "the runner kept going",
    ["her lungs", "were", "burning"],
    ["her legs", "were", "shaking with every stride"],
    "ignoring the pain",
    "up the last hill",
  ],
  ["the boat drifted", ["its sail", "was", "torn"], ["its rudder", "was", "broken"], "turning slowly", "on the calm sea"],
  [
    "the teacher read the poem",
    ["her glasses", "were", "perched on her nose"],
    ["her finger", "was", "following each line"],
    "pausing at every comma",
    "in a soft voice",
  ],
  [
    "the soldier wrote home",
    ["his hand", "was", "cramped with cold"],
    ["his candle", "was", "burning low"],
    "choosing every word",
    "by the trench wall",
  ],
  [
    "the eagle circled",
    ["its wings", "were", "spread wide"],
    ["its eyes", "were", "searching the valley"],
    "riding the wind",
    "above the cliffs",
  ],
  [
    "the baker opened the shop",
    ["her apron", "was", "white with flour"],
    ["the bread", "was", "still steaming"],
    "whistling a tune",
    "before dawn",
  ],
  [
    "the climber hung from the rope",
    ["his fingers", "were", "numb"],
    ["his helmet", "was", "cracked"],
    "waiting for help",
    "over the drop",
  ],
  [
    "the old house stood empty",
    ["its windows", "were", "boarded up"],
    ["its garden", "was", "overgrown"],
    "falling slowly apart",
    "at the end of the lane",
  ],
  [
    "the fans left the stadium",
    ["their faces", "were", "painted blue"],
    ["their voices", "were", "hoarse from singing"],
    "chanting the team's name",
    "after the final",
  ],
  ["the child fell asleep", ["her book", "was", "open on her chest"], ["her lamp", "was", "still on"], "smiling slightly", "on the sofa"],
  [
    "the horse galloped across the plain",
    ["its mane", "was", "flying"],
    ["its hooves", "were", "throwing up dust"],
    "leaving the riders behind",
    "toward the river",
  ],
  [
    "the judge left the court",
    ["her robe", "was", "folded over her arm"],
    ["her work", "was", "done for the day"],
    "nodding to the guards",
    "through a side door",
  ],
  [
    "the train crawled north",
    ["its windows", "were", "frosted"],
    ["its passengers", "were", "wrapped in blankets"],
    "climbing into the mountains",
    "through the night",
  ],
  [
    "the scientist checked the results",
    ["her heart", "was", "pounding"],
    ["her notes", "were", "spread across the desk"],
    "reading every number twice",
    "in the empty lab",
  ],
  [
    "the fisherman mended his nets",
    ["his pipe", "was", "clamped between his teeth"],
    ["his boat", "was", "rocking beside him"],
    "squinting in the sun",
    "on the harbor wall",
  ],
  [
    "the students marched to the square",
    ["their banners", "were", "held high"],
    ["their songs", "were", "echoing off the walls"],
    "chanting for change",
    "in the spring of that year",
  ],
  [
    "the lion lay in the grass",
    ["its tail", "was", "flicking"],
    ["its cubs", "were", "tumbling around it"],
    "watching the herd",
    "under a thorn tree",
  ],
  [
    "the pianist played the last chord",
    ["his hands", "were", "lifted high"],
    ["his eyes", "were", "closed"],
    "holding the note",
    "in the silent hall",
  ],
  [
    "the refugees reached the border",
    ["their bags", "were", "nearly empty"],
    ["their children", "were", "asleep in their arms"],
    "walking through the night",
    "after many days",
  ],
  [
    "the gardener knelt by the roses",
    ["her gloves", "were", "torn"],
    ["her basket", "was", "filling with petals"],
    "cutting the dead stems",
    "in the morning light",
  ],
  [
    "the wrestler stood up",
    ["his shoulder", "was", "bleeding"],
    ["his opponent", "was", "lying still on the mat"],
    "raising one fist",
    "in the center of the ring",
  ],
  [
    "the bus climbed the pass",
    ["its engine", "was", "groaning"],
    ["its roof", "was", "piled with luggage"],
    "swaying around the bends",
    "in low gear",
  ],
  [
    "the writer finished the novel",
    ["her desk", "was", "covered in drafts"],
    ["her tea", "was", "long cold"],
    "typing the final word",
    "at three in the morning",
  ],
  [
    "the hunters returned",
    ["their rifles", "were", "slung over their shoulders"],
    ["their bags", "were", "empty"],
    "grumbling about the weather",
    "before supper",
  ],
  [
    "the bride walked down the aisle",
    ["her veil", "was", "floating"],
    ["her father", "was", "holding her arm"],
    "smiling at the guests",
    "to the sound of the organ",
  ],
  [
    "the goat climbed the cliff",
    ["its hooves", "were", "finding every ledge"],
    ["its beard", "was", "blowing in the wind"],
    "leaping from rock to rock",
    "above the sea",
  ],
  [
    "the mayor cut the ribbon",
    ["her scissors", "were", "flashing in the sun"],
    ["the crowd", "was", "clapping politely"],
    "posing for the cameras",
    "at the new bridge",
  ],
  [
    "the old sailor told his story",
    ["his voice", "was", "low"],
    ["his hands", "were", "shaping the waves in the air"],
    "leaning toward the fire",
    "for the hundredth time",
  ],
];

/** moreAbsoluteCores are a main clause, an absolute, a participial phrase and a prepositional phrase, two for each pair. */
export const moreAbsoluteCores: readonly (readonly [main: string, absolute: string, participial: string, prepositional: string])[] =
  absolutePairs.flatMap(([main, [n1, , r1], [n2, , r2], participial, prepositional]) => [
    [main, `${n1} ${r1}`, participial, prepositional],
    [main, `${n2} ${r2}`, participial, prepositional],
  ]);

/** moreAbsoluteCombineLines are lines of "two sentences|absolute|comma splice|dangling participle" for combining sentences. */
export const moreAbsoluteCombineLines = absolutePairs
  .flatMap(([main, first, second]) =>
    [first, second].map(
      ([noun, be, rest]) =>
        `${cap(main)}. ${cap(noun)} ${be} ${rest}.|${cap(main)}, ${noun} ${rest}.|${cap(main)}, ${noun} ${be} ${rest}.|${cap(rest)}, ${main}.`,
    ),
  )
  .join("\n");

/** moreNounClauses are clauses that act as nouns; the clauses with that cannot follow a preposition. */
export const moreNounClauses: readonly (readonly [clause: string, afterPreposition: boolean])[] = [
  ["what the old letter said", true],
  ["whether the ice would hold", true],
  ["that the king was dying", false],
  ["why the birds had left", true],
  ["how the prisoner escaped", true],
  ["who had taken the money", true],
  ["where the river began", true],
  ["when the ship would return", true],
  ["that the plan had failed", false],
  ["which door was locked", true],
  ["what the witness saw", true],
  ["whether the doctor would come", true],
  ["that the dam had cracked", false],
  ["why the mayor resigned", true],
  ["how the fire started", true],
  ["who would lead the team", true],
  ["where the treasure lay", true],
  ["that the test was unfair", false],
];

const whereBits = [
  "the old key was hidden",
  "the treasure was buried",
  "the two rivers meet",
  "the battle was fought",
  "my grandfather was born",
  "the letters were kept",
] as const;
const whenBits = ["the storm began", "the war ended", "the train left", "the bell rang", "the power failed", "the guests arrived"] as const;
const whyBits = [
  "the bridge collapsed",
  "the lights went out",
  "the shop closed",
  "the dog barked all night",
  "the plan failed",
  "the team lost",
] as const;

/** moreClauseLines are lines of "sentence|kind" for telling a noun clause from a relative or an adverb clause. */
export const moreClauseLines = (noun: string, relative: string, adverb: string): string =>
  [
    ...whereBits.flatMap((b) => [
      `Nobody knew **where ${b}**.|${noun}`,
      `**Where ${b}** is still a secret.|${noun}`,
      `The house **where ${b}** is now a museum.|${relative}`,
      `We stopped to rest **where ${b}**.|${adverb}`,
    ]),
    ...whenBits.flatMap((b) => [
      `Nobody remembers **when ${b}**.|${noun}`,
      `**When ${b}** is written in the log.|${noun}`,
      `I still remember the day **when ${b}**.|${relative}`,
      `Everyone ran inside **when ${b}**.|${adverb}`,
    ]),
    ...whyBits.flatMap((b) => [
      `No one could explain **why ${b}**.|${noun}`,
      `**Why ${b}** puzzled the experts.|${noun}`,
      `Nobody knows the reason **why ${b}**.|${relative}`,
      `We went home early **because ${b}**.|${adverb}`,
    ]),
  ].join("\n");

const negatives = ["Never", "Rarely", "Seldom", "Not once"] as const;
const witnesses = ["the village", "the old sailor", "our town", "the young doctor", "my grandfather", "the whole country"] as const;
const sights = ["a flood", "a crowd", "courage", "a sunset", "kindness", "a storm"] as const;
const memories = ["That summer", "Her kindness", "The first snow", "His last words", "That old song", "The smell of the sea"] as const;
const rememberers = ["I", "we", "my mother", "the whole town"] as const;
const helpers = ["my grandmother", "the youngest player", "a stranger", "our neighbor"] as const;
/** helps are a deed as past, base and the rest of the clause. */
const helps = [
  ["taught", "teach", "me to swim"],
  ["found", "find", "the lost dog"],
  ["called", "call", "the fire brigade"],
  ["saved", "save", "the old mill"],
  ["wrote", "write", "the winning song"],
  ["fixed", "fix", "the bridge"],
] as const;

/** moreEmphasisLines are lines of "sentence|move" for naming inversion, fronting or a cleft sentence. */
export const moreEmphasisLines = (inversion: string, fronting: string, cleft: string): string =>
  [
    ...negatives.flatMap((neg, i) => witnesses.map((who, j) => `${neg} had ${who} seen such ${pickMore(sights, i + j)}.|${inversion}`)),
    ...memories.flatMap((memory) =>
      rememberers.map(
        (who) => `${memory} ${who} ${who === "my mother" || who === "the whole town" ? "will" : "shall"} never forget.|${fronting}`,
      ),
    ),
    ...helpers.flatMap((who) => helps.map(([past, , rest]) => `It was ${who} who ${past} ${rest}.|${cleft}`)),
  ].join("\n");

const needers = [
  ["We", "need"],
  ["The town", "needs"],
  ["The team", "needs"],
  ["My sister", "needs"],
] as const;
const needs = ["more time", "a new coach", "clean water", "an honest answer", "a quiet place", "a second chance"] as const;
const subjectsNever = ["We", "The village", "The old sailor", "Our town", "The young doctor", "My grandfather"] as const;

/** moreStressLines are lines of "sentence with bold words|stressing rewrite|broken grammar|stress on other words". */
export const moreStressLines = [
  ...subjectsNever.flatMap((who, i) =>
    sights.map((t) => {
      const s = i === 0 ? "we" : who.charAt(0).toLowerCase() + who.slice(1);
      return `${who} had **never** seen such ${t}.|Never had ${s} seen such ${t}.|Never ${s} had seen such ${t}.|Such ${t} ${s} had never seen.`;
    }),
  ),
  ...helpers.flatMap((who) =>
    helps.map(
      ([past, base, rest]) =>
        `**${cap(who)}** ${past} ${rest}.|It was ${who} who ${past} ${rest}.|It was ${who} ${past} who ${rest}.|What ${who} did was ${base} ${rest}.`,
    ),
  ),
  ...needers.flatMap(([who, need]) =>
    needs.map(
      (x) =>
        `${who} ${need} **${x}** above all.|What ${who.toLowerCase()} ${need} above all is ${x}.|What ${who.toLowerCase()} ${need} above all ${x} is.|It is above all that ${who.toLowerCase()} ${need} ${x}.`,
    ),
  ),
].join("\n");
