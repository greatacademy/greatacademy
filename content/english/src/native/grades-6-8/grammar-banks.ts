// Grades 6 to 8: the item banks of the grammar and punctuation topics. Most are built from hand-written cores by
// templates that vary the people and the sentences, so each knowledge point has a hundred or more items; every one is
// built the same way on every run.

import type { ChoiceItem } from "@ga/subject-english";

/** pick takes an element of a list by an index that may run past its end. */
const pick = <T>(list: readonly T[], i: number): T => list[i % list.length] as T;

const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** rows splits hand-written lines of fields separated by bars. */
const rows = (lines: string): string[][] =>
  lines
    .trim()
    .split("\n")
    .map((line) => line.trim().split("|"));

// Pronoun case.

const names = ["Maya", "Leo", "Priya", "Sam", "Ana", "Jun", "Omar", "Lena"];

/** pronouns are the subject, object and reflexive forms that a compound subject or object may need. */
const pronouns: readonly (readonly [subject: string, object: string, reflexive: string])[] = [
  ["I", "me", "myself"],
  ["he", "him", "himself"],
  ["she", "her", "herself"],
  ["they", "them", "themselves"],
];

const subjectFrames = [
  "{N} and ___ walked to the library after school.",
  "Yesterday {N} and ___ found a lost kitten under the porch.",
  "Last summer, {N} and ___ learned to sail on the lake.",
  "{N} and ___ were the last ones to leave the gym.",
  "{N} and ___ built a birdhouse for the garden.",
  "On Friday {N} and ___ cooked dinner for the whole family.",
  "{N} and ___ won the three-legged race at the fair.",
  "After the storm, {N} and ___ helped clear the branches.",
  "{N} and ___ have been friends since kindergarten.",
  "Every morning {N} and ___ walk the dog before school.",
  "{N} and ___ wrote a play for the spring show.",
  "Last week {N} and ___ visited the science museum.",
];

const objectFrames = [
  "The coach gave {N} and ___ a ride home after practice.",
  "Grandma knitted warm sweaters for {N} and ___.",
  "The teacher asked {N} and ___ to hand out the new books.",
  "Please save two seats for {N} and ___ at the front.",
  "The librarian showed {N} and ___ the new computers.",
  "Mom made pancakes for {N} and ___ on Sunday.",
  "The guide led {N} and ___ through the cave.",
  "A letter arrived for {N} and ___ this morning.",
  "The judges praised {N} and ___ for the clever design.",
  "Our neighbor invited {N} and ___ to the barbecue.",
  "The story was written by {N} and ___ together.",
  "Nobody sat between {N} and ___ on the bus.",
];

/** compoundCaseBank asks for the pronoun of a compound subject or object. */
export const compoundCaseBank: readonly ChoiceItem[] = [
  ...subjectFrames.flatMap((frame, f) =>
    pronouns.flatMap(([subject, object, reflexive], p) =>
      [0, 3].map((n): ChoiceItem => [frame.replace("{N}", pick(names, f * 4 + p + n)), subject, [object, reflexive]]),
    ),
  ),
  ...objectFrames.flatMap((frame, f) =>
    pronouns.flatMap(([subject, object, reflexive], p) =>
      [3, 6].map((n): ChoiceItem => [frame.replace("{N}", pick(names, f * 4 + p + n)), object, [subject, reflexive]]),
    ),
  ),
  ["Between you and ___, I think the movie was far too long.", "me", ["I", "myself"]],
  ["The prize was shared between Rosa and ___ because we tied.", "me", ["I", "myself"]],
  ["Dad took a photo of Ben and ___ standing by the waterfall.", "her", ["she", "herself"]],
  ["It was Kai and ___ who painted the mural in the hallway.", "I", ["me", "myself"]],
];

/** whoPeople are people described by who or whom clauses; whoDid are what they did, whomDone what was done to them. */
const whoPeople = ["The neighbor", "The coach", "The pilot", "The artist", "The nurse", "The author", "The stranger", "The tutor"] as const;
const whoDid = ["helped us", "called this morning", "found the wallet", "spoke at the assembly", "fixed the swing"] as const;
const whomDone = ["we met", "my parents hired", "everyone admired", "the town honored", "you recommended"] as const;
const whoEnds = ["lives on our street", "is moving to Spain", "gave us a gift", "was very kind", "is coming back next year"] as const;
const whoMore = [
  ...whoPeople.flatMap((who, i) => whoDid.map((did, j) => `${who} ___ ${did} ${pick(whoEnds, i + j)}.|who`)),
  ...whoPeople.flatMap((who, i) => whomDone.map((done, j) => `${who} ___ ${done} ${pick(whoEnds, i + j + 2)}.|whom`)),
].join("\n");

/** whoBank asks for who or whom: who as a subject, whom as an object. */
export const whoBank: readonly ChoiceItem[] = rows(`
${whoMore}
  The neighbor ___ fixed our fence refused to take any money.|who
  The neighbor ___ we thanked had fixed our fence for free.|whom
  The girl ___ won the spelling bee is in my class.|who
  The girl ___ the judges chose was only eleven.|whom
  The doctor ___ treated my broken arm was very gentle.|who
  The doctor ___ my parents trust is retiring next year.|whom
  The author ___ wrote this book grew up in a fishing village.|who
  The author ___ we met at the book fair signed my copy.|whom
  The player ___ scored the last goal was carried off the field.|who
  The player ___ the coach benched was furious.|whom
  The student ___ found the wallet returned it to the office.|who
  The student ___ the principal praised had returned a lost wallet.|whom
  The pilot ___ landed the plane safely was called a hero.|who
  The pilot ___ the passengers cheered had landed in a storm.|whom
  The friend ___ helped me move lives across the street.|who
  The friend ___ I called first came over with boxes.|whom
  The singer ___ opened the concert was a local teenager.|who
  The singer ___ everyone wanted to hear came on last.|whom
  ___ left the lights on in the kitchen?|Who
  ___ did you invite to the party?|Whom
  ___ is going to bring the snacks?|Who
  To ___ should I send the thank-you letter?|whom
  With ___ did you travel to the coast?|whom
  For ___ are these flowers?|whom
  ___ knows the answer to question five?|Who
  ___ did the class elect as president?|Whom
  The man to ___ I gave my ticket was not the conductor.|whom
  The woman with ___ she works is from Kenya.|whom
  The boy ___ sits behind me always hums during tests.|who
  The boy ___ I sit behind always hums during tests.|whom
  The explorers ___ crossed the desert ran out of water twice.|who
  The explorers ___ the villagers rescued were nearly starved.|whom
`).map(([shown, right]): ChoiceItem => {
  const lower = right!.toLowerCase();
  const other = lower === "who" ? "whom" : "who";
  const cap = right !== lower;
  return [shown!, right!, [cap ? capital(other) : other, cap ? "Which" : "which"]];
});

// Commas between adjectives.

/** adjectivePairs are two adjectives and a noun in a sentence, and whether the adjectives are coordinate. */
const adjectivePairs = rows(`
  It was a {} at the edge of the mountains.|long|cold|night|c
  Sunlight filled the {} at the top of the stairs.|bright|cheerful|room|c
  We squeezed onto the {} on the way downtown.|noisy|crowded|bus|c
  The shepherd trusted his {} to guard the flock.|brave|loyal|dog|c
  She wrapped the baby in a {}.|soft|warm|blanket|c
  A cat slipped down the {} behind the bakery.|dark|narrow|alley|c
  The goats climbed the {} without slipping.|steep|rocky|path|c
  The {} finally reached the cabin at dusk.|tired|hungry|hikers|c
  He bit into a {} from the market.|sweet|juicy|peach|c
  Our class was lucky to have such a {}.|calm|patient|teacher|c
  A {} blew across the frozen lake.|bitter|icy|wind|c
  The nurse spoke in a {}.|quiet|gentle|voice|c
  A {} rolled in from the sea.|thick|heavy|fog|c
  Everyone wants a {} like Jun.|smart|funny|friend|c
  We found the letters in a {}.|dusty|cluttered|attic|c
  The {} opened with a groan.|rusty|squeaky|gate|c
  The {} lasted all through the night.|loud|joyful|party|c
  A {} sat on the porch steps.|thin|shivering|kitten|c
  We crossed the river on an {}.|old|stone|bridge|n
  A {} danced above the beach.|bright|red|kite|n
  She kept her letters in a {}.|small|wooden|box|n
  A {} barked at the mail carrier.|big|black|dog|n
  They lived in a {} near the station.|little|brick|house|n
  Three {} slept in the basket.|tiny|gray|kittens|n
  The museum has a portrait by a {}.|famous|Italian|painter|n
  He saved for months to buy {}.|new|leather|shoes|n
  Don't forget your {} today.|heavy|winter|coat|n
  Grandma baked a {} for the party.|delicious|chocolate|cake|n
  She wore a {} on her little finger.|tiny|gold|ring|n
  My grandfather sang us an {}.|old|Chinese|song|n
  The light poured through a {}.|large|glass|window|n
  Leo rode his {} to school.|shiny|blue|bicycle|n
  The {} pushed up through the snow.|first|spring|flowers|n
  The shelf was full of {}.|cheap|plastic|toys|n
  An {} shaded the whole yard.|enormous|oak|tree|n
  We drank from a {}.|cool|mountain|stream|n
`).map(([frame, a, b, noun, kind]) => ({ frame: frame!, a: a!, b: b!, noun: noun!, coordinate: kind === "c" }));

/** withArticle puts a phrase in its frame, turning a frame's "a" into "an" before a vowel and back. */
const withArticle = (frame: string, phrase: string) =>
  frame.replace(/\b([Aa])n? \{\}/, (_m, a: string) => `${a}${/^[aeiou]/i.test(phrase) ? "n" : ""} {}`).replace("{}", phrase);

/** adjectiveCommaBank asks for the sentence whose adjectives are punctuated correctly. */
export const adjectiveCommaBank: readonly ChoiceItem[] = adjectivePairs.map(({ frame, a, b, noun, coordinate }) => {
  const comma = withArticle(frame, `${a}, ${b} ${noun}`);
  const none = withArticle(frame, `${a} ${b} ${noun}`);
  const after = withArticle(frame, `${a}, ${b}, ${noun}`);
  return coordinate ? ["", comma, [none, after]] : ["", none, [comma, after]];
});

const coordinatePhrases = adjectivePairs.filter((p) => p.coordinate).map((p) => `${p.a} ${p.b} ${p.noun}`);
const cumulativePhrases = adjectivePairs.filter((p) => !p.coordinate).map((p) => `${p.a} ${p.b} ${p.noun}`);

/** adjectiveTestBank asks which phrase needs, or needs no, comma between its adjectives. */
export const adjectiveTestBank: readonly ChoiceItem[] = [
  ...coordinatePhrases.map(
    (phrase, i): ChoiceItem => [
      "Which phrase needs a comma between its adjectives?",
      phrase,
      [pick(cumulativePhrases, i), pick(cumulativePhrases, i + 7)],
    ],
  ),
  ...cumulativePhrases.map(
    (phrase, i): ChoiceItem => [
      "Which phrase needs no comma between its adjectives?",
      phrase,
      [pick(coordinatePhrases, i + 3), pick(coordinatePhrases, i + 11)],
    ],
  ),
];

// Verb moods.

const moods = ["indicative", "imperative", "conditional", "subjunctive"] as const;

/** moodTopics give the four moods one subject at a time: a fact, a command, what would happen and a wish. */
const moodTopics = [
  [
    "The bakery opens at six",
    "Buy the bread before noon",
    "With more flour, we would bake two loaves",
    "I wish the bakery were open all night",
  ],
  [
    "The river floods every spring",
    "Stay away from the riverbank",
    "With a higher wall, the town would stay dry",
    "If the river were calmer, we could swim",
  ],
  [
    "The museum has a dinosaur skeleton",
    "Look at the dinosaur skeleton first",
    "With more time, we would see every room",
    "The guide asks that each visitor stay with the group",
  ],
  [
    "Our team practices on Tuesdays",
    "Bring your water bottle to practice",
    "With a new coach, we might win the cup",
    "The coach insists that every player be on time",
  ],
  ["The bus stops at the corner", "Wait for the bus at the corner", "Without the bus, I would walk an hour", "I wish the bus were faster"],
  [
    "The garden needs water",
    "Water the garden tonight",
    "With more rain, the roses would bloom",
    "If I were the gardener, I would plant tulips",
  ],
  [
    "My sister plays the violin",
    "Practice the violin every day",
    "With a better bow, she could play louder",
    "Her teacher recommends that she practice daily",
  ],
  [
    "The library lends laptops",
    "Return the laptop by Friday",
    "With a laptop, I could finish faster",
    "The rules require that each laptop be returned on time",
  ],
  [
    "The volcano erupted in 1980",
    "Read the chapter about the volcano",
    "A bigger eruption would have buried the town",
    "If the volcano were active, we would leave",
  ],
  [
    "The kittens sleep in the barn",
    "Feed the kittens twice a day",
    "Without the barn, the kittens would freeze",
    "I wish the kittens were mine",
  ],
  [
    "The concert begins at eight",
    "Turn off your phone during the concert",
    "With better seats, we could see the stage",
    "The usher asks that everyone be seated by eight",
  ],
  [
    "Snow fell all night",
    "Shovel the path before breakfast",
    "With more snow, school would close",
    "If it were warmer, the snow would melt",
  ],
  ["The ferry crosses the bay", "Hold the rail on the ferry", "In a storm, the ferry would stay in port", "I wish the ferry were free"],
  [
    "The class planted an oak",
    "Plant the seeds in rows",
    "With good soil, the oak could live for centuries",
    "The teacher suggests that each student plant a seed",
  ],
  [
    "Dad drives a blue truck",
    "Fasten your seat belt",
    "With a bigger truck, we could carry the couch",
    "If Dad were here, he would drive us",
  ],
  [
    "The owl hunts at night",
    "Listen for the owl after dark",
    "Without mice, the owl would go hungry",
    "I wish I were able to see in the dark",
  ],
  [
    "The market sells fresh fish",
    "Ask the seller for the price",
    "With more money, I would buy the lobster",
    "The doctor recommends that she eat more fish",
  ],
  [
    "The school has a new gym",
    "Wear sneakers in the gym",
    "With a pool, the school would be perfect",
    "If the gym were bigger, we could play tennis",
  ],
] as const;
const moodMore = moodTopics
  .flatMap(([fact, command, would, wish]) => [
    `${fact}.|indicative`,
    `${command}.|imperative`,
    `${would}.|conditional`,
    `${wish}.|subjunctive`,
  ])
  .join("\n");

/** moodBank asks for the mood of a sentence's main verb. */
export const moodBank: readonly ChoiceItem[] = rows(`
${moodMore}
  The library opens at nine on Saturdays.|indicative
  Did you remember to feed the fish?|indicative
  Our team won the regional final last night.|indicative
  Snow covers the peaks for most of the year.|indicative
  The volcano has not erupted for two hundred years.|indicative
  Owls hunt mostly at night.|indicative
  Maya is reading a book about ancient Rome.|indicative
  The bus will leave at exactly seven.|indicative
  Close the door behind you, please.|imperative
  Turn left at the old church.|imperative
  Please hand in your essays by Friday.|imperative
  Don't touch the paint until it dries.|imperative
  Bring a warm jacket and a flashlight.|imperative
  Stir the soup slowly so it does not burn.|imperative
  Never swim alone in the ocean.|imperative
  Write your name at the top of the page.|imperative
  With more time, I would rewrite the ending.|conditional
  I would choose the window seat on a long flight.|conditional
  You could build a stronger bridge with better glue.|conditional
  In your place, she would ask the teacher for help.|conditional
  Given a map, we could find the trail easily.|conditional
  A bigger boat might survive that storm.|conditional
  Without the rain, the picnic would have been perfect.|conditional
  He would gladly lend you his bike.|conditional
  I wish my brother were here to see this.|subjunctive
  The coach insists that every player be on time.|subjunctive
  The doctor recommends that he rest for a week.|subjunctive
  It is important that each student bring a pencil.|subjunctive
  The teacher asked that the class remain seated.|subjunctive
  I wish it were summer already.|subjunctive
  She talks as if she were the queen of the school.|subjunctive
  If only Grandpa were here with us tonight.|subjunctive
`).map(([shown, right], i): ChoiceItem => {
  const others = moods.filter((m) => m !== right);
  return [shown!, right!, [pick(others, i), pick(others, i + 1)]];
});

/** unrealWho are subjects with their present form of be; unrealWhat are what they might be, with what would follow. */
const unrealWho = [
  ["I", "am"],
  ["Leo", "is"],
  ["my aunt", "is"],
  ["the dog", "is"],
  ["she", "is"],
  ["he", "is"],
] as const;
const unrealWhat = [
  ["taller", "could reach the shelf"],
  ["here", "would know the answer"],
  ["less tired", "would come to the game"],
  ["braver", "would jump into the lake"],
  ["older", "could drive us home"],
] as const;
const demandsOf = [
  "The coach insists that",
  "The doctor recommends that",
  "It is important that",
  "The rules require that",
  "Mom asks that",
] as const;
const demanded = [
  ["Leo", "rest", "rests", "rested", "for a week"],
  ["each student", "bring", "brings", "brought", "a pencil"],
  ["she", "arrive", "arrives", "arrived", "on time"],
  ["he", "wear", "wears", "wore", "a helmet"],
  ["the door", "stay", "stays", "stayed", "locked"],
  ["the team", "practice", "practices", "practiced", "every day"],
  ["he", "be", "is", "was", "quiet in the library"],
  ["she", "take", "takes", "took", "the medicine"],
  ["the meeting", "end", "ends", "ended", "by noon"],
] as const;
const subjunctiveMore = [
  ...unrealWho.flatMap(([who, be], i) =>
    unrealWhat.map(([what, then], j) => {
      const after = who === "I" ? "I" : ["she", "he"].includes(who) ? who : i % 2 === 0 ? "she" : "he";
      return (i + j) % 2 === 0 ? `If ${who} ___ ${what}, ${after} ${then}.|were|was|${be}` : `I wish ${who} ___ ${what}.|were|was|${be}`;
    }),
  ),
  ...demandsOf.flatMap((opening) => demanded.map(([who, base, s, past, rest]) => `${opening} ${who} ___ ${rest}.|${base}|${s}|${past}`)),
].join("\n");

/** subjunctiveBank asks for the verb form of a wish, a condition contrary to fact, or a demand. */
export const subjunctiveBank: readonly ChoiceItem[] = rows(`
${subjunctiveMore}
  If I ___ taller, I could reach the top shelf.|were|was|am
  If Leo ___ here, he would know what to do.|were|was|is
  I wish my grandmother ___ still alive to see this.|were|was|is
  If it ___ not raining, we would eat outside.|were|was|is
  She talks as if she ___ the boss of everyone.|were|was|is
  If I ___ you, I would apologize first.|were|was|am
  Jun wishes he ___ a better swimmer.|were|was|is
  If the test ___ tomorrow, I would not be ready.|were|was|is
  I wish the summer ___ longer.|were|was|is
  If Priya ___ older, she could drive us.|were|was|is
  He acts as though he ___ a famous star.|were|was|is
  If the bridge ___ open, we could cross the river.|were|was|is
  The coach insists that every player ___ on time.|be|is|are
  It is important that each student ___ a pencil.|bring|brings|brought
  The doctor recommends that she ___ for a week.|rest|rests|rested
  The rules require that every swimmer ___ a cap.|wear|wears|wore
  I suggest that he ___ the letter again before sending it.|read|reads|reading
  The teacher asked that the class ___ seated.|remain|remains|remained
  It is necessary that the dog ___ fed twice a day.|be|is|was
  The judge ordered that the man ___ the money back.|pay|pays|paid
  Mom insists that my brother ___ his room every Saturday.|clean|cleans|cleaned
  The sign demands that visitors ___ quiet in the library.|stay|stays|stayed
  We propose that the school ___ a longer lunch.|allow|allows|allowed
  It is essential that every hiker ___ water.|carry|carries|carried
  The captain commanded that the sails ___ lowered.|be|are|were
  Grandpa asked that no one ___ his garden without him.|enter|enters|entered
  It is vital that the patient ___ the medicine at night.|take|takes|took
  The mayor recommends that each family ___ an emergency kit.|keep|keeps|kept
  The club requires that each member ___ a fee.|pay|pays|paid
  If Ana ___ the captain, she would change the plan.|were|was|is
  I wish this backpack ___ lighter.|were|was|is
  The lifeguard insists that no one ___ near the rocks.|swim|swims|swam
`).map(([shown, right, ...wrong]): ChoiceItem => [shown!, right!, wrong]);

// Gerund, participial and infinitive phrases.

/** Verbals are four sentences around one action: a gerund as subject, a gerund as object, a participle and an infinitive. */
type Verbals = readonly [subject: string, object: string, participle: string, infinitive: string];

/** verbalActs are an -ing phrase, the same phrase after to, what it is as a subject, and what someone does while doing it. */
const verbalActs = [
  ["flying a kite on the beach", "fly a kite on the beach", "was the highlight of the trip", "lost track of time"],
  ["painting the fence", "paint the fence", "took the whole weekend", "got paint on the dog"],
  ["learning to juggle", "learn to juggle", "takes a lot of patience", "dropped the balls again and again"],
  ["building a sandcastle", "build a sandcastle", "kept the twins busy all afternoon", "found a crab in the moat"],
  ["practicing the piano", "practice the piano", "filled every evening", "counted the beats aloud"],
  ["collecting old coins", "collect old coins", "became a family hobby", "found a coin from 1890"],
  ["cleaning the attic", "clean the attic", "turned up a box of old letters", "sneezed at all the dust"],
  ["feeding the ducks", "feed the ducks", "is the best part of the walk", "ran out of bread"],
  ["hiking up the mountain", "hike up the mountain", "left everyone tired but happy", "stopped to watch an eagle"],
  ["sorting the recycling", "sort the recycling", "is a weekly chore", "found a lost earring"],
  ["drawing comic strips", "draw comic strips", "made the long winter go faster", "invented a talking cat"],
  ["mending the old quilt", "mend the old quilt", "took Grandma three days", "told stories about each patch"],
] as const;
const verbalPeople = ["Mia", "Leo", "Priya", "Sam", "Ana", "Jun"] as const;
const likeVerbs = ["loves", "enjoys", "finished", "started", "kept"] as const;
const wantVerbs = ["wants", "hopes", "plans", "decided", "promised"] as const;
const verbalMore: readonly Verbals[] = verbalActs.flatMap(([ing, base, asSubject, meanwhile], i) =>
  [0, 1, 2].map((n): Verbals => {
    const who = pick(verbalPeople, i + n * 2);
    return [
      `**${capital(ing)}** ${asSubject}${n === 0 ? "" : n === 1 ? ` for ${who}` : " last year"}.`,
      `${who} ${pick(likeVerbs, i + n)} **${ing}**.`,
      `**${capital(ing)}**, ${who} ${meanwhile}.`,
      `${who} ${pick(wantVerbs, i + n)} **to ${base}**.`,
    ];
  }),
);

const verbals: readonly Verbals[] = [
  [
    "**Climbing the old oak tree** was the best part of Mia's summer.",
    "Mia loved **climbing the old oak tree** behind her house.",
    "**Climbing the old oak tree**, Mia spotted her lost kite on the roof.",
    "Mia wanted **to climb the old oak tree** before the sun went down.",
  ],
  [
    "**Reading by flashlight** kept Leo awake past midnight.",
    "Leo enjoys **reading by flashlight** under his blanket.",
    "**Reading by flashlight**, Leo did not hear his mother come in.",
    "Leo tried **to read by flashlight**, but the batteries died.",
  ],
  [
    "**Training for the marathon** took up every Saturday morning.",
    "Priya began **training for the marathon** in January.",
    "**Training for the marathon**, Priya ran ten miles a day.",
    "Priya decided **to train for the marathon** with her father.",
  ],
  [
    "**Baking bread from scratch** fills the house with a wonderful smell.",
    "Grandpa has always loved **baking bread from scratch**.",
    "**Baking bread from scratch**, Grandpa hummed old songs.",
    "Grandpa promised **to bake bread from scratch** for the party.",
  ],
  [
    "**Painting the fence** took Omar and his sister all weekend.",
    "Omar did not mind **painting the fence**.",
    "**Painting the fence**, Omar got more paint on himself than on the boards.",
    "Omar agreed **to paint the fence** for ten dollars.",
  ],
  [
    "**Learning a new language** opens the door to new friends.",
    "Ana recommends **learning a new language** before a long trip.",
    "**Learning a new language**, Ana made mistakes every day and laughed at them.",
    "Ana hopes **to learn a new language** this year.",
  ],
  [
    "**Swimming across the lake** is harder than it looks.",
    "Jun practiced **swimming across the lake** all summer.",
    "**Swimming across the lake**, Jun saw a heron standing in the reeds.",
    "Jun plans **to swim across the lake** in August.",
  ],
  [
    "**Writing letters to her grandmother** became Lena's Sunday habit.",
    "Lena enjoys **writing letters to her grandmother**.",
    "**Writing letters to her grandmother**, Lena told her all about school.",
    "Lena remembered **to write letters to her grandmother** every week.",
  ],
  [
    "**Fixing old radios** is Sam's favorite hobby.",
    "Sam started **fixing old radios** when he was ten.",
    "**Fixing old radios in the garage**, Sam listened to music from long ago.",
    "Sam learned **to fix old radios** from his uncle.",
  ],
  [
    "**Walking the dog in the rain** is nobody's favorite chore.",
    "Nobody likes **walking the dog in the rain**.",
    "**Walking the dog in the rain**, Kai slipped on the wet sidewalk.",
    "Kai forgot **to walk the dog** before school.",
  ],
  [
    "**Telling the truth** took more courage than Ben expected.",
    "Ben considered **telling the truth** to his coach.",
    "**Telling the truth at last**, Ben felt a weight lift from his shoulders.",
    "Ben chose **to tell the truth** about the broken window.",
  ],
  [
    "**Planting tomatoes in spring** gives you fresh salads in summer.",
    "Rosa suggested **planting tomatoes** along the fence.",
    "**Planting tomatoes along the fence**, Rosa found an old silver coin in the soil.",
    "Rosa needs **to plant the tomatoes** before the rain.",
  ],
  ...verbalMore,
];

const gerund = "a gerund phrase";
const participial = "a participial phrase";
const infinitive = "an infinitive phrase";

/** verbalKindBank asks whether the phrase in bold is a gerund, participial or infinitive phrase. */
export const verbalKindBank: readonly ChoiceItem[] = [0, 1, 2, 3].flatMap((role) =>
  verbals.map((v): ChoiceItem => {
    const right = role < 2 ? gerund : role === 2 ? participial : infinitive;
    return [v[role]!, right, [gerund, participial, infinitive].filter((k) => k !== right)];
  }),
);

const asSubject = "the subject of the sentence";
const asObject = "the object of the verb";
const asModifier = "a description of a noun";

/** verbalJobBank asks what job the phrase in bold does in its sentence. */
export const verbalJobBank: readonly ChoiceItem[] = [0, 1, 2].flatMap((role) =>
  verbals.map((v): ChoiceItem => {
    const right = [asSubject, asObject, asModifier][role]!;
    return [v[role]!, right, [asSubject, asObject, asModifier].filter((k) => k !== right)];
  }),
);

// Simple, compound and complex sentences.

/** Clauses are two ideas, the conjunction that joins them as equals, and the subordinator that shows how they relate. */
type Clauses = readonly [first: string, second: string, coordinator: string, subordinator: string];

const clauses: readonly Clauses[] = [
  ["the storm knocked out the power", "we lit candles in the kitchen", "so", "because"],
  ["Maya practiced every night", "she still felt nervous before the recital", "but", "although"],
  ["the bell rang", "the students hurried to the buses", "and", "as soon as"],
  ["the river flooded the road", "the school bus took the long way around", "so", "since"],
  ["Leo had never seen snow", "he ran outside in his pajamas", "so", "because"],
  ["the museum was free on Sundays", "it was always crowded", "so", "because"],
  ["the team lost the first game", "they won the next five in a row", "but", "although"],
  ["the sun set behind the hills", "the air turned cold", "and", "after"],
  ["Grandpa told us stories", "we roasted marshmallows over the fire", "and", "while"],
  ["the bridge was closed for repairs", "drivers had to cross on the ferry", "so", "because"],
  ["Priya studied hard", "she did not pass the driving test", "but", "although"],
  ["the alarm went off", "everyone left the building calmly", "and", "when"],
  ["the library closed early", "we finished our project at home", "so", "because"],
  ["the puppy was tiny", "it barked like a big dog", "but", "although"],
  ["the rain stopped", "the children ran out to play", "and", "once"],
  ["Omar missed the bus", "he walked two miles to school", "so", "because"],
  ["the soup smelled delicious", "it was far too salty", "but", "although"],
  ["the play ended", "the audience stood and cheered", "and", "when"],
  ["the wind was strong", "the ferry stayed in the harbor", "so", "because"],
  ["Ana trained all winter", "she lost the first race", "but", "although"],
  ["the guests arrived", "Dad served the soup", "and", "after"],
  ["the shop was out of milk", "we had juice with breakfast", "so", "since"],
  ["the hike was long", "nobody complained", "but", "although"],
  ["the lights went out", "the audience gasped", "and", "when"],
  ["the ice was thin", "the skaters stayed off the pond", "so", "because"],
  ["Jun was tired", "he finished his homework", "but", "although"],
  ["the paint dried", "we hung the pictures", "and", "once"],
  ["the printer jammed", "the report was late", "so", "because"],
  ["the movie was long", "the children loved it", "but", "although"],
  ["the whistle blew", "the players left the field", "and", "as soon as"],
  ["the roads were icy", "school started late", "so", "since"],
  ["the test was hard", "most students passed", "but", "although"],
  ["the baby fell asleep", "the house grew quiet", "and", "after"],
  ["the price went up", "fewer people bought tickets", "so", "because"],
  ["Lena was shy", "she gave a great speech", "but", "although"],
  ["the music started", "everyone began to dance", "and", "when"],
  ["the creek dried up", "the frogs moved to the pond", "so", "because"],
  ["the house was old", "it stayed warm all winter", "but", "although"],
  ["Mom fixed the bike", "we rode to the park", "and", "after"],
  ["the trail was closed", "we hiked along the river", "so", "since"],
  ["the dog was old", "it still chased every ball", "but", "although"],
  ["the snow melted", "the crocuses came up", "and", "once"],
  ["the oven broke", "we ate sandwiches for dinner", "so", "because"],
  ["the room was crowded", "we found two seats", "but", "although"],
  ["the teacher spoke", "the class listened closely", "and", "while"],
  ["the battery died", "the clock stopped", "so", "because"],
  ["Sam was new", "he made friends quickly", "but", "although"],
  ["the sun came up", "the birds began to sing", "and", "as soon as"],
  ["the field was muddy", "the game was moved indoors", "so", "since"],
  ["the coat was expensive", "Rosa bought it anyway", "but", "although"],
];

const simple = "simple";
const compound = "compound";
const complex = "complex";

const compoundOf = ([a, b, c]: Clauses) => `${capital(a)}, ${c} ${b}.`;
const complexOf = ([a, b, , s]: Clauses) => `${capital(s)} ${a}, ${b}.`;

/** sentenceKindBank asks whether a sentence is simple, compound or complex. */
export const sentenceKindBank: readonly ChoiceItem[] = [
  ...clauses.map((c): ChoiceItem => [`${capital(c[0])}.`, simple, [compound, complex]]),
  ...clauses.map((c): ChoiceItem => [compoundOf(c), compound, [simple, complex]]),
  ...clauses.map((c): ChoiceItem => [complexOf(c), complex, [compound, simple]]),
];

const relationOf = (subordinator: string) =>
  ["because", "since"].includes(subordinator) ? "cause" : subordinator === "although" ? "contrast" : "time";

const relationWords: Readonly<Record<string, string>> = {
  cause: "the first idea is the cause of the second",
  contrast: "the second idea is surprising after the first",
  time: "the first idea tells when the second happens",
};

/** wrongSubordinator is a subordinator that shows a different relation. */
const wrongSubordinator = (subordinator: string) => {
  const relation = relationOf(subordinator);
  return relation === "cause" ? "although" : relation === "contrast" ? "because" : "although";
};

/** relationBank asks for the sentence that joins two ideas so as to show how they relate. */
export const relationBank: readonly ChoiceItem[] = [0, 1].flatMap((order) =>
  clauses.map((c): ChoiceItem => {
    const [a, b, , s] = c;
    const w = wrongSubordinator(s);
    const shown = `${capital(a)}. ${capital(b)}. Join them to show that ${relationWords[relationOf(s)]}.`;
    const right = order === 0 ? complexOf(c) : `${capital(b)} ${s} ${a}.`;
    const wrongSub = order === 0 ? `${capital(w)} ${a}, ${b}.` : `${capital(b)} ${w} ${a}.`;
    return [shown, right, [`${capital(a)}, and ${b}.`, wrongSub]];
  }),
);

// Dashes, parentheses and ellipses.

const asides: readonly (readonly [before: string, aside: string, after: string])[] = [
  ["My grandmother", "who is eighty-two", "still swims every morning."],
  ["The Great Wall", "thousands of miles long", "crosses deserts, rivers and mountains."],
  ["Our old car", "the one with the broken heater", "finally stopped running last winter."],
  ["The recipe", "my uncle's secret one", "calls for three kinds of cheese."],
  ["The test", "all fifty questions of it", "took nearly two hours."],
  ["Mount Everest", "the highest mountain on Earth", "rises almost nine kilometers above the sea."],
  ["The new student", "a quiet girl from Brazil", "sat next to me in science."],
  ["The museum", "open late on Fridays", "has a new dinosaur hall."],
  ["My best friend", "the funniest person I know", "is moving to Canada."],
  ["The storm", "the worst in fifty years", "knocked down hundreds of trees."],
  ["Our coach", "a former Olympic runner", "makes us warm up for twenty minutes."],
  ["The library", "built in 1910", "is the oldest building in town."],
  ["The puppy", "barely six weeks old", "chewed through my shoelaces."],
  ["The bridge", "closed for repairs since May", "will open again next week."],
  ["The concert", "our first one ever", "lasted until midnight."],
  ["Jupiter", "the largest planet in our solar system", "has dozens of moons."],
];

/** interruptionBank asks for the sentence whose dashes or parentheses set off an interruption correctly. */
export const interruptionBank: readonly ChoiceItem[] = [
  ...asides.map(
    ([b, a, c]): ChoiceItem => ["Set off the interruption with dashes.", `${b}—${a}—${c}`, [`${b}—${a}, ${c}`, `${b}—${a} ${c}`]],
  ),
  ...asides.map(
    ([b, a, c]): ChoiceItem => ["Set off the interruption with parentheses.", `${b} (${a}) ${c}`, [`${b} (${a} ${c})`, `${b} ${a}) ${c}`]],
  ),
];

/** quotations are sentences to be quoted, each with words in the middle that may be left out. */
const quotations = rows(`
  The old bridge|over the river|will close for repairs next month.
  The study found that students|who slept at least nine hours|earned higher grades.
  The mayor promised that the park|on the east side of town|would stay open all year.
  Coral reefs|which cover less than one percent of the ocean floor|shelter a quarter of all sea life.
  The explorers|tired and short of food|reached the coast in March.
  The printing press|first built in the 1440s|made books cheap enough for ordinary people.
  Our school|after a long debate among parents and teachers|will start thirty minutes later.
  The volcano|silent for more than two hundred years|began to rumble again in May.
  The museum|thanks to a gift from a local family|will offer free entry on Sundays.
  The Romans|over many centuries|built more than fifty thousand miles of roads.
  The new law|passed last week by a narrow vote|bans plastic bags in grocery stores.
  Whales|including the giant blue whale|feed on some of the smallest creatures in the sea.
  The telegraph|invented in the 1830s|could send a message across a country in minutes.
  The coach said that the team|in spite of three injuries|played its best game of the year.
  The author argues that homework|especially for young children|does more harm than good.
  The ship|battered by storms for six weeks|finally limped into the harbor.
  The scientist explained that plankton|though far too small to see|produces much of the oxygen we breathe.
  The city council|meeting late on Tuesday night|voted to build a new library.
  The first telephone call|made in 1876|was only a few words long.
  Zheng He's fleet|the largest the world had ever seen|sailed as far as East Africa.
  The steam engine|improved by James Watt in the 1770s|changed how factories worked.
  The report states that the river|polluted for decades by factories|is clean enough for fish again.
  My grandfather|who was born in a small village|still remembers his first train ride.
  The lighthouse|standing on the rocks for over a century|was finally replaced by a small light on a pole.
  Senators|dressed in white togas with purple stripes|met in a building near the forum.
  The novel|written when the author was only nineteen|became a classic.
  Astronauts|after a journey of three days|landed on the moon in July 1969.
  The headline claimed that the team|for the first time in its history|had won the title.
  Our principal announced that lunch|starting next Monday|will last forty minutes.
  The kelp forest|swaying in the cold currents|is home to otters, fish and urchins.
`).map(([a, m, b]) => [a!, m!, b!] as const);

/** ellipsisBank asks for the quotation that leaves out the words in brackets and marks where they were. */
export const ellipsisBank: readonly ChoiceItem[] = quotations.map(
  ([a, m, b]): ChoiceItem => [`${a} [${m}] ${b}`, `"${a} ... ${b}"`, [`"${a} ${b}"`, `"${a} ${m} ..."`]],
);
