// Grades 3 to 5: the item banks of the grammar topics. Most are built from hand-written cores by templates that vary
// the people, things and times, so each knowledge point has thirty or more items; every one is built the same way on
// every run.

import type { ChoiceItem, TypedItem } from "@ga/subject-english";

const which = "Which sentence is correct?";

/** pick takes an element of a list by an index that may run past its end. */
const pick = <T>(list: readonly T[], i: number): T => list[i % list.length] as T;

/** article is a or an, as the next word needs. */
const article = (word: string) => (/^[aeiou]/i.test(word) ? "an" : "a");

const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** range lists the numbers from 0 below n. */
const range = (n: number) => Array.from({ length: n }, (_, i) => i);

// Plurals.

const plurals: readonly (readonly [one: string, many: string, ...wrong: string[]])[] = [
  ["box", "boxes", "boxs", "boxies"],
  ["city", "cities", "citys", "cityes"],
  ["bench", "benches", "benchs", "benchies"],
  ["leaf", "leaves", "leafs", "leafes"],
  ["dish", "dishes", "dishs", "dishies"],
  ["baby", "babies", "babys", "babyes"],
  ["monkey", "monkeys", "monkies", "monkeyes"],
  ["wolf", "wolves", "wolfs", "wolfes"],
  ["bus", "buses", "buss", "busies"],
  ["berry", "berries", "berrys", "berryes"],
  ["half", "halves", "halfs", "halfes"],
  ["fox", "foxes", "foxs", "foxies"],
  ["lunch", "lunches", "lunchs", "lunchies"],
  ["party", "parties", "partys", "partyes"],
  ["key", "keys", "kies", "keyes"],
  ["knife", "knives", "knifes", "knifs"],
  ["brush", "brushes", "brushs", "brushies"],
  ["glass", "glasses", "glasss", "glassies"],
  ["puppy", "puppies", "puppys", "puppyes"],
  ["day", "days", "dais", "dayes"],
  ["shelf", "shelves", "shelfs", "shelfes"],
  ["wish", "wishes", "wishs", "wishies"],
  ["story", "stories", "storys", "storyes"],
  ["toy", "toys", "toies", "toyes"],
  ["loaf", "loaves", "loafs", "loafes"],
  ["class", "classes", "classs", "classies"],
  ["family", "families", "familys", "familyes"],
  ["wife", "wives", "wifes", "wifs"],
  ["peach", "peaches", "peachs", "peachies"],
  ["boy", "boys", "boies", "boyes"],
  ["calf", "calves", "calfs", "calfes"],
  ["fly", "flies", "flys", "flyes"],
  ["tax", "taxes", "taxs", "taxies"],
  ["life", "lives", "lifes", "lifs"],
  ["watch", "watches", "watchs", "watchies"],
  ["pony", "ponies", "ponys", "ponyes"],
  ["dress", "dresses", "dresss", "dressies"],
  ["beach", "beaches", "beachs", "beachies"],
  ["inch", "inches", "inchs", "inchies"],
  ["kiss", "kisses", "kisss", "kissies"],
  ["match", "matches", "matchs", "matchies"],
  ["branch", "branches", "branchs", "branchies"],
  ["ax", "axes", "axs", "axies"],
  ["bush", "bushes", "bushs", "bushies"],
  ["crash", "crashes", "crashs", "crashies"],
  ["guess", "guesses", "guesss", "guessies"],
  ["coach", "coaches", "coachs", "coachies"],
  ["sandwich", "sandwiches", "sandwichs", "sandwichies"],
  ["address", "addresses", "addresss", "addressies"],
  ["waltz", "waltzes", "waltzs", "waltzies"],
  ["torch", "torches", "torchs", "torchies"],
  ["flash", "flashes", "flashs", "flashies"],
  ["boss", "bosses", "bosss", "bossies"],
  ["ditch", "ditches", "ditchs", "ditchies"],
  ["lady", "ladies", "ladys", "ladyes"],
  ["cherry", "cherries", "cherrys", "cherryes"],
  ["penny", "pennies", "pennys", "pennyes"],
  ["bunny", "bunnies", "bunnys", "bunnyes"],
  ["country", "countries", "countrys", "countryes"],
  ["candy", "candies", "candys", "candyes"],
  ["lily", "lilies", "lilys", "lilyes"],
  ["army", "armies", "armys", "armyes"],
  ["diary", "diaries", "diarys", "diaryes"],
  ["hobby", "hobbies", "hobbys", "hobbyes"],
  ["library", "libraries", "librarys", "libraryes"],
  ["body", "bodies", "bodys", "bodyes"],
  ["spy", "spies", "spys", "spyes"],
  ["daisy", "daisies", "daisys", "daisyes"],
  ["enemy", "enemies", "enemys", "enemyes"],
  ["donkey", "donkeys", "donkies", "donkeyes"],
  ["turkey", "turkeys", "turkies", "turkeyes"],
  ["valley", "valleys", "vallies", "valleyes"],
  ["chimney", "chimneys", "chimnies", "chimneyes"],
  ["tray", "trays", "traies", "trayes"],
  ["ray", "rays", "raies", "rayes"],
  ["play", "plays", "plaies", "playes"],
  ["journey", "journeys", "journies", "journeyes"],
  ["jockey", "jockeys", "jockies", "jockeyes"],
  ["highway", "highways", "highwaies", "highwayes"],
  ["thief", "thieves", "thiefs", "thiefes"],
  ["elf", "elves", "elfs", "elfes"],
  ["scarf", "scarves", "scarfs", "scarfes"],
  ["sheaf", "sheaves", "sheafs", "sheafes"],
  ["self", "selves", "selfs", "selfes"],
  ["hat", "hats", "hates", "hatz"],
  ["frog", "frogs", "froges", "frogz"],
  ["desk", "desks", "deskes", "deskies"],
  ["chair", "chairs", "chaires", "chairies"],
  ["apple", "apples", "applees", "applies"],
  ["river", "rivers", "riveres", "riveries"],
  ["planet", "planets", "planetes", "planeties"],
  ["window", "windows", "windowes", "windowies"],
  ["garden", "gardens", "gardenes", "gardenies"],
  ["pencil", "pencils", "penciles", "pencilies"],
  ["rabbit", "rabbits", "rabbites", "rabbities"],
  ["bridge", "bridges", "bridgees", "bridgies"],
  ["tiger", "tigers", "tigeres", "tigeries"],
  ["mountain", "mountains", "mountaines", "mountainies"],
  ["blanket", "blankets", "blanketes", "blanketies"],
  ["bottle", "bottles", "bottlees", "bottlies"],
  ["cloud", "clouds", "cloudes", "cloudies"],
  ["wax", "waxes", "waxs", "waxies"],
];

/** pluralSpellingBank asks for the plural of a regular or f-to-v noun. */
export const pluralSpellingBank: readonly TypedItem[] = plurals.map(([one, many, ...wrong]) => ({
  shown: `one ${one}, two ___`,
  accepted: [many],
  canonical: many,
  wrong,
}));

const irregulars: readonly (readonly [plural: string, wrong: readonly [string, string], sentences: readonly string[]])[] = [
  [
    "mice",
    ["mouses", "mices"],
    ["Three ___ ran across the kitchen floor.", "The cat watched the ___ in the barn.", "Our class keeps two pet ___ in a cage."],
  ],
  ["teeth", ["tooths", "teeths"], ["The dentist cleaned all of my ___.", "Brush your ___ before bed.", "The shark has rows of sharp ___."]],
  [
    "feet",
    ["foots", "feets"],
    ["Both of my ___ were cold after the walk in the snow.", "The duck has webbed ___ for swimming.", "Wipe your ___ on the mat, please."],
  ],
  [
    "sheep",
    ["sheeps", "sheepes"],
    ["A flock of ___ grazed on the hill.", "The farmer counted forty ___ in the field.", "Two ___ escaped through the open gate."],
  ],
  [
    "children",
    ["childs", "childrens"],
    ["All the ___ in the class went on the trip.", "The ___ built a snowman in the park.", "Five ___ waited for the school bus."],
  ],
  [
    "men",
    ["mans", "mens"],
    ["Two ___ carried the heavy table.", "The ___ in the boat pulled hard on the oars.", "Three ___ fixed the hole in the road."],
  ],
  [
    "oxen",
    ["oxes", "oxs"],
    [
      "The farmer used two ___ to pull the plow.",
      "A pair of ___ pulled the heavy cart.",
      "In ancient Egypt, ___ helped farmers in the fields.",
    ],
  ],
  [
    "geese",
    ["gooses", "geeses"],
    ["Two ___ honked as they flew over the lake.", "A line of ___ walked to the pond.", "The ___ fly south every autumn."],
  ],
  [
    "women",
    ["womans", "womens"],
    ["Three ___ stood talking by the gate.", "The ___ on the team won every race.", "Two ___ ran the bakery on our street."],
  ],
  [
    "deer",
    ["deers", "deeres"],
    ["A herd of ___ ran through the forest.", "We saw four ___ drinking at the stream.", "The ___ ate the flowers in our garden."],
  ],
  [
    "fish",
    ["fishs", "fishies"],
    ["We saw a school of ___ near the boat.", "My brother caught three ___ at the lake.", "Bright ___ swam around the coral."],
  ],
  [
    "moose",
    ["mooses", "meese"],
    ["Two ___ waded into the lake to eat plants.", "We saw three ___ near the road in Canada.", "The ___ in the forest have huge antlers."],
  ],
];

/** countingFrames count several of anything, so any irregular plural fits them. */
const countingFrames = [
  "I drew four ___ in my notebook.",
  "The picture book shows many ___.",
  "We read a story about two ___.",
  "There were six ___ in the photo.",
  "Can you count the ___ in this picture?",
  "The poem names ten ___.",
] as const;

/** irregularPluralBank asks for an irregular plural in a sentence. */
export const irregularPluralBank: readonly ChoiceItem[] = [
  ...[0, 1, 2].flatMap((r) => irregulars.map(([plural, wrong, sentences]): ChoiceItem => [pick(sentences, r), plural, wrong])),
  ...countingFrames.flatMap((frame) => irregulars.map(([plural, wrong]): ChoiceItem => [frame, plural, wrong])),
];

// The order of adjectives.

const opinions = ["beautiful", "strange", "lovely", "funny", "pretty"];
const sizes = ["big", "small", "tiny", "huge"];
const colors = ["red", "brown", "green", "white", "blue", "yellow"];
const things: readonly (readonly [noun: string, frame: string])[] = [
  ["box", "We found {} in the attic."],
  ["hat", "She wore {} to the party."],
  ["kite", "He flew {} at the beach."],
  ["cup", "Grandpa drank tea from {}."],
  ["ball", "The puppy chased {} across the yard."],
  ["bag", "Mom carried {} to the market."],
  ["scarf", "Dad wrapped {} around his neck."],
  ["bowl", "The soup came in {}."],
];

/** adjectiveOrderBank asks for opinion, size and color in order before a noun. */
export const adjectiveOrderBank: readonly ChoiceItem[] = range(120).map((i): ChoiceItem => {
  const [o, s, c] = [pick(opinions, i), pick(sizes, Math.floor(i / 5)), pick(colors, Math.floor(i / 20))];
  const [noun, frame] = pick(things, i);
  const say = (np: string) => frame.replace("{}", np);
  return [
    which,
    say(`${article(o)} ${o} ${s} ${c} ${noun}`),
    [say(`${article(c)} ${c} ${o} ${s} ${noun}`), say(`${article(noun)} ${noun} ${o} ${s} ${c}`)],
  ];
});

const materialThings: readonly (readonly [noun: string, materials: readonly string[], frame: string])[] = [
  ["jacket", ["leather", "wool", "cotton"], "He bought {} for the winter."],
  ["table", ["wooden", "glass", "metal"], "They ate dinner at {}."],
  ["spoon", ["silver", "wooden", "plastic"], "She stirred the soup with {}."],
  ["shirt", ["cotton", "silk", "wool"], "Dad ironed {} for the wedding."],
  ["box", ["wooden", "metal", "cardboard"], "The letters were kept in {}."],
  ["vase", ["glass", "clay", "metal"], "Grandma put the roses in {}."],
];
const origins = ["Chinese", "French", "Mexican", "Japanese", "Indian", "Italian"];
const purposeThings: readonly (readonly [purpose: string, noun: string, frame: string])[] = [
  ["sleeping", "bag", "We unrolled {} in the tent."],
  ["hiking", "boots", "She laced up {} before the climb."],
  ["soccer", "ball", "The coach pumped up {}."],
  ["running", "shoes", "He bought {} for the race."],
  ["tennis", "racket", "Mia packed {} in her bag."],
  ["fishing", "rod", "Grandpa carried {} down to the lake."],
  ["baking", "pan", "Mom greased {} for the cake."],
  ["swimming", "cap", "I lost {} at the pool."],
];

/** np builds a noun phrase with an article, or without one for a plural. */
const np = (words: string, noun: string) => (noun.endsWith("s") ? words : `${article(words)} ${words}`);

/** nearNounBank asks for color, origin, material and purpose in order next to a noun. */
export const nearNounBank: readonly ChoiceItem[] = [
  ...range(54).map((i): ChoiceItem => {
    const [noun, materials, frame] = pick(materialThings, i);
    const [c, m] = [pick(colors, Math.floor(i / 6) + Math.floor(i / 18)), pick(materials, Math.floor(i / 18))];
    const say = (words: string) => frame.replace("{}", np(words, noun));
    return [which, say(`${c} ${m} ${noun}`), [say(`${m} ${c} ${noun}`), say(`${noun} ${c} ${m}`)]];
  }),
  ...range(36).map((i): ChoiceItem => {
    const [noun, materials, frame] = pick(materialThings, i);
    const [o, m] = [pick(origins, Math.floor(i / 6)), pick(materials, i + Math.floor(i / 6))];
    const say = (words: string) => frame.replace("{}", np(words, noun));
    return [which, say(`${o} ${m} ${noun}`), [say(`${m} ${o} ${noun}`), say(`${noun} ${o} ${m}`)]];
  }),
  ...range(36).map((i): ChoiceItem => {
    const [p, noun, frame] = pick(purposeThings, i);
    const c = pick(colors, Math.floor(i / 8) + i);
    const say = (words: string) => frame.replace("{}", np(words, noun));
    return [which, say(`${c} ${p} ${noun}`), [say(`${p} ${c} ${noun}`), say(`${noun} ${c} ${p}`)]];
  }),
];

// Progressive tenses.

const people: readonly (readonly [subject: string, now: string, past: string, wrongNow: string, wrongPast: string])[] = [
  ["I", "am", "was", "is", "were"],
  ["she", "is", "was", "are", "were"],
  ["they", "are", "were", "is", "was"],
  ["we", "are", "were", "is", "was"],
  ["my brother", "is", "was", "are", "were"],
  ["my friends", "are", "were", "is", "was"],
  ["he", "is", "was", "are", "were"],
  ["the twins", "are", "were", "is", "was"],
];
const doings: readonly (readonly [ing: string, rest: string])[] = [
  ["reading", "a book"],
  ["eating", "lunch"],
  ["playing", "chess"],
  ["watching", "the rain"],
  ["drawing", "a map"],
  ["singing", "a song"],
];

/** progressiveFormBank asks for the progressive form that fits the subject and the time. */
export const progressiveFormBank: readonly ChoiceItem[] = range(144).map((i): ChoiceItem => {
  const time = i % 3;
  const [subject, now, past, wrongNow, wrongPast] = pick(people, Math.floor(i / 3));
  const [ing, rest] = pick(doings, Math.floor(i / 24));
  const opening = ["Right now", "At noon yesterday", "This time tomorrow"][time];
  const shown = `${opening}, ${subject} ___ ${rest}.`;
  if (time === 0) return [shown, `${now} ${ing}`, [`${wrongNow} ${ing}`, ing]];
  if (time === 1) return [shown, `${past} ${ing}`, [`${wrongPast} ${ing}`, `${now} ${ing}`]];
  return [shown, `will be ${ing}`, [`will ${ing}`, `${now} ${ing}`, `will ${now} ${ing}`]];
});

const activities: readonly (readonly [
  subject: string,
  ing: string,
  s: string,
  past: string,
  rest: string,
  habit: string,
  interruption: string,
])[] = [
  ["Maria", "reading", "reads", "read", "in her room", "every night", "the lights went out"],
  ["Dad", "walking", "walks", "walked", "the dog", "every morning", "it started to rain"],
  ["Ben", "painting", "paints", "painted", "the fence", "every spring", "his friend arrived"],
  ["The baby", "sleeping", "sleeps", "slept", "in her crib", "every afternoon", "the doorbell rang"],
  ["Grandma", "baking", "bakes", "baked", "bread", "every Sunday", "the phone rang"],
  ["Sam", "practicing", "practices", "practiced", "the piano", "after school", "his sister came home"],
  ["The cat", "chasing", "chases", "chased", "a mouse", "every evening", "the dog barked"],
  ["Lena", "riding", "rides", "rode", "her bike", "on weekends", "her tire went flat"],
  ["Mr. Chen", "watering", "waters", "watered", "the garden", "every evening", "the storm began"],
  ["Omar", "writing", "writes", "wrote", "in his diary", "before bed", "his pen ran out of ink"],
  ["Aunt Rosa", "cooking", "cooks", "cooked", "dinner", "every day", "the power went out"],
  ["Kim", "swimming", "swims", "swam", "laps", "every Saturday", "the whistle blew"],
  ["Nina", "feeding", "feeds", "fed", "the ducks", "every Sunday", "a dog ran up"],
  ["Uncle Ray", "fixing", "fixes", "fixed", "the car", "every month", "his tool broke"],
  ["Carlos", "playing", "plays", "played", "tag", "after lunch", "the bell rang"],
  ["Mom", "reading", "reads", "read", "the news", "every morning", "the kettle whistled"],
  ["Leo", "building", "builds", "built", "a tower", "on rainy days", "the cat knocked it over"],
  ["Ana", "drawing", "draws", "drew", "a horse", "after school", "her pencil broke"],
  ["The farmer", "milking", "milks", "milked", "the cows", "every dawn", "the barn door slammed"],
  ["Jake", "washing", "washes", "washed", "the dishes", "after dinner", "a plate slipped"],
  ["Grandpa", "telling", "tells", "told", "a story", "every bedtime", "we fell asleep"],
  ["The team", "training", "trains", "trained", "on the field", "every Tuesday", "the lights went off"],
  ["Mia", "singing", "sings", "sang", "in the choir", "every Friday", "she lost her voice"],
  ["The dog", "digging", "digs", "dug", "in the yard", "every afternoon", "it found a bone"],
  ["Dr. Patel", "checking", "checks", "checked", "the patients", "every morning", "an alarm sounded"],
  ["Tom", "sweeping", "sweeps", "swept", "the porch", "every Saturday", "the broom snapped"],
  ["The baker", "making", "makes", "made", "rolls", "before sunrise", "the oven stopped"],
  ["Lucy", "studying", "studies", "studied", "for her test", "every evening", "her friend called"],
  ["The pilot", "flying", "flies", "flew", "over the hills", "every week", "the clouds rolled in"],
  ["Ms. Lopez", "grading", "grades", "graded", "papers", "on Sundays", "her pen ran dry"],
  ["Pedro", "fishing", "fishes", "fished", "at the lake", "every summer", "the boat tipped"],
  ["Eva", "knitting", "knits", "knitted", "a scarf", "in the evenings", "the yarn tangled"],
  ["The bird", "building", "builds", "built", "a nest", "each spring", "the branch shook"],
  ["Max", "jogging", "jogs", "jogged", "around the lake", "every morning", "he twisted his ankle"],
  ["Aunt Lily", "planting", "plants", "planted", "tulips", "every fall", "the hose burst"],
  ["Rosa", "climbing", "climbs", "climbed", "the rope", "in gym class", "the coach blew the whistle"],
];

/** progressiveMeaningBank asks which tense shows an action in progress, a habit, or an action that was interrupted. */
export const progressiveMeaningBank: readonly ChoiceItem[] = [0, 1, 2].flatMap((q) =>
  activities.map(([subject, ing, s, past, rest, habit, interruption], i): ChoiceItem => {
    const now = `${subject} is ${ing} ${rest} right now.`;
    const usual = `${subject} ${s} ${rest} ${habit}.`;
    const yesterday = `${subject} ${past} ${rest} ${i % 2 === 0 ? "yesterday afternoon" : "yesterday"}.`;
    const interrupted = `${subject} was ${ing} ${rest} when ${interruption}.`;
    const after = `${subject} ${past} ${rest} ${i % 2 === 1 ? "right after" : "after"} ${interruption}.`;
    if (q === 0) return ["Which sentence tells about something happening at this very moment?", now, [usual, yesterday]];
    if (q === 1) return ["Which sentence tells about something that happens again and again, as a habit?", usual, [now, interrupted]];
    return ["Which sentence tells about an action that was in progress when something else happened?", interrupted, [after, usual]];
  }),
);

// Modal verbs.

const modalSentences: readonly (readonly [
  modal: string,
  wrong: readonly [string, string],
  question: string,
  sentences: readonly string[],
])[] = [
  [
    "must",
    ["might", "can"],
    "Which word shows that something is a rule you have to follow?",
    [
      "All visitors ___ sign in at the office.",
      "Drivers ___ stop at a red light.",
      "Players ___ wear shin guards during the game.",
      "Everyone ___ leave the building when the fire alarm rings.",
      "Library books ___ be returned within two weeks.",
      "Swimmers ___ shower before they enter the pool.",
      "Students ___ wear their name tags on the trip.",
      "Cyclists ___ stop at the crossing.",
      "You ___ show your ticket at the gate.",
      "Every player ___ shake hands after the match.",
      "Visitors ___ stay behind the yellow line.",
      "Dogs ___ be on a leash in the park.",
      "Passengers ___ wear seat belts on the plane.",
      "All bikes ___ be locked to the rack.",
      "Runners ___ stay in their own lanes.",
      "Pupils ___ raise a hand before they speak in class.",
      "Guests ___ check out of the hotel by noon.",
      "Workers ___ wear hard hats on the building site.",
      "Campers ___ put out the fire before they sleep.",
      "Riders ___ be taller than this sign.",
    ],
  ],
  [
    "can",
    ["must", "should"],
    "Which word shows that someone or something is able to do something?",
    [
      "My little brother ___ swim across the pool.",
      "Owls ___ see well in the dark.",
      "Cheetahs ___ run faster than any other land animal.",
      "Grandpa ___ speak three languages.",
      "A camel ___ go for days without drinking water.",
      "My sister ___ play the violin.",
      "Bats ___ fly in the dark.",
      "My aunt ___ bake bread without a recipe.",
      "Penguins ___ swim but not fly.",
      "Our parrot ___ say ten words.",
      "Frogs ___ jump many times their length.",
      "The baby ___ walk now.",
      "Ravi ___ count to a hundred in French.",
      "Dolphins ___ hear very high sounds.",
      "My dad ___ fix almost any bike.",
      "Some lizards ___ grow a new tail.",
      "Mia ___ type very fast.",
      "Kangaroos ___ jump over a fence.",
      "Our robot ___ pick up small blocks.",
      "Lena ___ juggle three balls.",
    ],
  ],
  [
    "might",
    ["must", "can"],
    "Which word shows that something is possible but not certain?",
    [
      "Take an umbrella; it ___ rain later.",
      "The bus ___ be late because of the snow.",
      "We ___ go to the beach if it is sunny.",
      "I am not sure, but the store ___ be closed today.",
      "Ask Dad; he ___ know the answer.",
      "The game ___ end early if the storm comes.",
      "The ice ___ melt by noon.",
      "Grandma ___ visit us next week, but she is not sure.",
      "The puppy ___ be hungry; let us check.",
      "My kite ___ get stuck in that tree.",
      "The show ___ sell out before we arrive.",
      "We ___ see a rainbow after the rain.",
      "The bridge ___ close if the river rises.",
      "Ben ___ come to the party if he feels better.",
      "The test ___ be easier than we think.",
      "That cloud ___ bring snow.",
      "The cat ___ be hiding under the bed.",
      "My shoes ___ be too small now.",
      "The train ___ arrive a little late.",
      "The team ___ win if they keep playing well.",
    ],
  ],
  [
    "should",
    ["might", "can"],
    "Which word gives advice?",
    [
      "You ___ wear a helmet when you ride your bike.",
      "You look tired; you ___ go to bed early tonight.",
      "We ___ bring water on the hike.",
      "You ___ say thank you when someone helps you.",
      "If you have a cough, you ___ see a doctor.",
      "You ___ read the directions before you start.",
      "You ___ drink water when it is hot.",
      "We ___ turn off the lights when we leave.",
      "You ___ wash your hands before you eat.",
      "You ___ ask for help if you are stuck.",
      "He ___ apologize to his sister.",
      "You ___ put on sunscreen at the beach.",
      "We ___ check the map before the hike.",
      "You ___ eat more fruit and vegetables.",
      "You ___ save some money for the trip.",
      "She ___ practice every day before the concert.",
      "You ___ tie your laces before you run.",
      "We ___ pack the night before.",
      "You ___ write the date at the top of the page.",
      "You ___ return the book on time.",
    ],
  ],
  [
    "May",
    ["Must", "Should"],
    "Which word asks for permission politely?",
    [
      "___ I borrow your pencil, please?",
      "___ we go outside for recess now?",
      "___ I have another slice of bread?",
      "___ I open the window? It is hot in here.",
      "___ we sit at this table?",
      "___ I use your phone to call my mom?",
      "___ I sit next to you?",
      "___ we bring our dog inside?",
      "___ I take a cookie?",
      "___ I ask a question?",
      "___ we leave early today?",
      "___ I turn on the fan?",
      "___ I join your game?",
      "___ we start the test now?",
      "___ I close the door?",
      "___ I borrow your eraser?",
      "___ we feed the ducks?",
      "___ I sharpen my pencil?",
      "___ I try on these shoes?",
      "___ we play in the garden?",
    ],
  ],
];

/** modalMeaningBank asks for the modal verb with a meaning. */
export const modalMeaningBank: readonly ChoiceItem[] = range(20).flatMap((r) =>
  modalSentences.map(([modal, wrong, question, sentences]): ChoiceItem => [`${question} *${pick(sentences, r)}*`, modal, wrong]),
);

const modalSubjects = ["She", "We", "You", "My dog", "They", "He", "I", "Our class"];
const modalVerbs: readonly (readonly [plain: string, s: string, rest: string])[] = [
  ["ride", "rides", "a horse"],
  ["finish", "finishes", "the puzzle"],
  ["carry", "carries", "the bag"],
  ["visit", "visits", "the zoo"],
  ["catch", "catches", "the ball"],
];
const modals = ["can", "must", "might", "should", "may"];

/** modalFormBank asks for a modal followed by the plain verb. */
export const modalFormBank: readonly ChoiceItem[] = range(120).map((i): ChoiceItem => {
  const subject = pick(modalSubjects, i);
  const modal = pick(modals, Math.floor(i / 8) + Math.floor(i / 40));
  const [plain, s, rest] = pick(modalVerbs, Math.floor(i / 8));
  return [
    which,
    `${subject} ${modal} ${plain} ${rest}.`,
    [`${subject} ${modal} ${s} ${rest}.`, `${subject} ${modal} to ${plain} ${rest}.`],
  ];
});

// Perfect tenses.

const participles: readonly (readonly [plain: string, past: string, participle: string, regular: string, sentence: string])[] = [
  ["eat", "ate", "eaten", "eated", "We have already ___ dinner."],
  ["write", "wrote", "written", "writed", "She has ___ three letters this week."],
  ["go", "went", "gone", "goed", "By the time we arrived, the bus had ___."],
  ["see", "saw", "seen", "seed", "I have never ___ a real whale."],
  ["take", "took", "taken", "taked", "He has ___ the dog for a walk."],
  ["break", "broke", "broken", "breaked", "Someone has ___ the window."],
  ["fly", "flew", "flown", "flied", "The birds had ___ south before the snow came."],
  ["give", "gave", "given", "gived", "My aunt has ___ me a new book."],
  ["swim", "swam", "swum", "swimmed", "By noon, they had ___ across the lake."],
  ["ride", "rode", "ridden", "rided", "Have you ever ___ a camel?"],
  ["choose", "chose", "chosen", "choosed", "The class has ___ a name for the hamster."],
  ["drive", "drove", "driven", "drived", "Mom has ___ this road many times."],
  ["speak", "spoke", "spoken", "speaked", "The principal has ___ to our class about the trip."],
  ["fall", "fell", "fallen", "falled", "Snow had ___ all night, and the roads were white."],
  ["grow", "grew", "grown", "growed", "The puppy has ___ so much since spring."],
  ["know", "knew", "known", "knowed", "I have ___ Sam since first grade."],
  ["throw", "threw", "thrown", "throwed", "Someone had ___ a ball over the fence."],
  ["begin", "began", "begun", "beginned", "The movie had already ___ when we sat down."],
  ["sing", "sang", "sung", "singed", "The choir has ___ this song before."],
  ["drink", "drank", "drunk", "drinked", "The baby has ___ all her milk."],
  ["ring", "rang", "rung", "ringed", "The bell had ___ before I reached the door."],
  ["wear", "wore", "worn", "weared", "He has ___ the same cap every day this week."],
  ["tear", "tore", "torn", "teared", "The wind has ___ a hole in the tent."],
  ["steal", "stole", "stolen", "stealed", "A crow had ___ the shiny spoon."],
  ["forget", "forgot", "forgotten", "forgetted", "I have ___ my lunch at home again."],
  ["hide", "hid", "hidden", "hided", "The squirrel had ___ its nuts under the leaves."],
  ["shake", "shook", "shaken", "shaked", "The earthquake had ___ every house on the street."],
  ["blow", "blew", "blown", "blowed", "The storm has ___ down the old oak tree."],
  ["draw", "drew", "drawn", "drawed", "Lily has ___ a map of the whole park."],
  ["bite", "bit", "bitten", "bited", "A mosquito has ___ me on the arm."],
  ["freeze", "froze", "frozen", "freezed", "The pond had ___ solid by morning."],
  ["wake", "woke", "woken", "waked", "The baby has ___ up from her nap."],
  ["do", "did", "done", "doed", "Have you ___ your homework yet?"],
  ["rise", "rose", "risen", "rised", "The sun had ___ before we woke up."],
  ["sink", "sank", "sunk", "sinked", "The old boat has ___ to the bottom of the lake."],
  ["shrink", "shrank", "shrunk", "shrinked", "My wool sweater has ___ in the wash."],
];

/** moreParticipleSentences are two more sentences for each verb in a perfect tense. */
const moreParticipleSentences: Readonly<Record<string, readonly string[]>> = {
  eat: ["The goats have ___ all the grass.", "Had you ___ breakfast before the trip?"],
  write: ["He had ___ his name on every page.", "Have you ___ to your pen pal yet?"],
  go: ["Dad has ___ to the store for milk.", "The snow had ___ by April."],
  see: ["Has anyone ___ my blue cap?", "We had ___ the movie twice before."],
  take: ["Someone has ___ my seat.", "The nurse had ___ my temperature."],
  break: ["The vase had ___ into three pieces.", "I have ___ my pencil again."],
  fly: ["The kite has ___ higher than the roof.", "Have you ever ___ in a plane?"],
  give: ["The coach had ___ us a short break.", "Who has ___ the cat its dinner?"],
  swim: ["I have ___ in this lake every summer.", "The ducks had ___ to the far shore."],
  ride: ["She has ___ her bike to school all year.", "We had never ___ a train before."],
  choose: ["Have you ___ a book to read?", "They had ___ blue for the walls."],
  drive: ["Grandpa had ___ all night to reach us.", "The bus has ___ past our stop."],
  speak: ["Have you ___ to the coach yet?", "She had never ___ in front of a crowd."],
  fall: ["Leaves have ___ all over the path.", "The baby had ___ asleep in the car."],
  grow: ["The tomatoes have ___ very tall.", "My hair had ___ long by summer."],
  know: ["We had ___ about the plan for weeks.", "Have you ___ him for long?"],
  throw: ["The pitcher has ___ ten strikes today.", "Who has ___ paper on the floor?"],
  begin: ["Has the game ___ yet?", "School had ___ by the time we moved."],
  sing: ["Have you ever ___ on a stage?", "The birds had ___ since dawn."],
  drink: ["The plants have ___ all the rain.", "I had ___ too much juice."],
  ring: ["Has the phone ___ today?", "The church bells had ___ at noon."],
  wear: ["The steps have ___ smooth over the years.", "She had ___ that dress only once."],
  tear: ["I have ___ my jeans on the fence.", "The dog had ___ the newspaper to bits."],
  steal: ["Someone has ___ the last cookie!", "The fox had ___ two eggs from the farm."],
  forget: ["Have you ___ my birthday?", "He had ___ the words of the song."],
  hide: ["Where have you ___ the present?", "The moon had ___ behind a cloud."],
  shake: ["The news has ___ the whole town.", "He had ___ the bottle before he opened it."],
  blow: ["The wind had ___ my hat into the pond.", "Have you ___ out the candles yet?"],
  draw: ["Have you ever ___ a dragon?", "The artist had ___ the whole street."],
  bite: ["The cat has never ___ anyone.", "A fish had ___ the hook."],
  freeze: ["The water pipes have ___ again.", "The lake had ___ before the holidays."],
  wake: ["Have the twins ___ up yet?", "The noise had ___ the whole house."],
  do: ["We had ___ the dishes before Mom got home.", "She has ___ her best on every test."],
  rise: ["The bread has ___ in the warm kitchen.", "Prices have ___ since last year."],
  sink: ["The stone had ___ before I could grab it.", "The sun has ___ behind the hills."],
  shrink: ["The puddle has ___ in the sun.", "My shirt had ___ two sizes."],
};

/** participleBank asks for the past participle of a verb in a perfect tense. */
export const participleBank: readonly TypedItem[] = participles.flatMap(([plain, past, participle, regular, sentence]) =>
  [sentence, ...(moreParticipleSentences[plain] ?? [])].map((s) => ({
    shown: `${plain}: ${s}`,
    accepted: [participle],
    canonical: participle,
    wrong: [past, regular],
  })),
);

const beforeScenes: readonly (readonly [later: string, earlier: string, had: string, did: string, has: string])[] = [
  ["When we reached the station", "the train", "had left", "left", "has left"],
  ["By the time Mom got home", "we", "had cleaned the kitchen", "cleaned the kitchen", "have cleaned the kitchen"],
  ["When the firefighters arrived", "the fire", "had gone out", "went out", "has gone out"],
  ["Before the guests came", "Dad", "had baked a cake", "baked a cake", "has baked a cake"],
  ["When I opened the box", "someone", "had eaten the cookies", "ate the cookies", "has eaten the cookies"],
  ["By the time the rain stopped", "the game", "had ended", "ended", "has ended"],
  ["When we got to the theater", "the show", "had started", "started", "has started"],
  ["Before she moved north", "Lena", "had never seen snow", "never saw snow", "has never seen snow"],
  ["When the teacher called on him", "Omar", "had forgotten the answer", "forgot the answer", "has forgotten the answer"],
  ["By the time I woke up", "my sister", "had gone to school", "went to school", "has gone to school"],
  ["When we checked the garden", "the rabbits", "had eaten the lettuce", "ate the lettuce", "have eaten the lettuce"],
  ["Before the storm hit", "the farmers", "had brought in the harvest", "brought in the harvest", "have brought in the harvest"],
  ["When the bell rang", "I", "had finished the test", "finished the test", "have finished the test"],
  ["By the time the doctor came", "the fever", "had gone down", "went down", "has gone down"],
  ["When we found the dog", "it", "had run three miles", "ran three miles", "has run three miles"],
  ["When Grandma called", "we", "had left for the beach", "left for the beach", "have left for the beach"],
  ["By the time the bus came", "the rain", "had stopped", "stopped", "has stopped"],
  ["When I reached the shop", "it", "had closed", "closed", "has closed"],
  ["Before the race started", "Leo", "had tied his laces twice", "tied his laces twice", "has tied his laces twice"],
  ["When the guests arrived", "Mom", "had set the table", "set the table", "has set the table"],
  ["By the time we got there", "the ice cream", "had melted", "melted", "has melted"],
  ["When the lights came on", "the cat", "had hidden under the bed", "hid under the bed", "has hidden under the bed"],
  ["Before the test began", "Nina", "had read every chapter", "read every chapter", "has read every chapter"],
  ["When Dad checked the oven", "the bread", "had burned", "burned", "has burned"],
  ["By the time the sun rose", "the farmers", "had milked the cows", "milked the cows", "have milked the cows"],
  ["When we returned from the trip", "the plants", "had died", "died", "have died"],
  ["Before the movie ended", "the baby", "had fallen asleep", "fell asleep", "has fallen asleep"],
  ["When the coach arrived", "the players", "had warmed up", "warmed up", "have warmed up"],
  ["By the time I found my ticket", "the train", "had gone", "went", "has gone"],
  ["When the snow melted", "the crocuses", "had already bloomed", "already bloomed", "have already bloomed"],
  ["Before Sam moved away", "he", "had lived here for ten years", "lived here for ten years", "has lived here for ten years"],
  ["When the alarm rang", "I", "had already woken up", "already woke up", "have already woken up"],
  ["By the time the pizza came", "we", "had finished the game", "finished the game", "have finished the game"],
  ["When the teacher looked up", "the class", "had stopped talking", "stopped talking", "has stopped talking"],
  ["Before the storm passed", "the river", "had flooded the road", "flooded the road", "has flooded the road"],
];

const sinceScenes: readonly (readonly [subject: string, has: string, did: string, had: string])[] = [
  ["We", "have lived in this town for five years", "lived in this town five years ago", "had lived in this town for five years by then"],
  ["My brother", "has played the violin since he was six", "played the violin when he was six", "had played the violin when he was six"],
  ["It", "has rained every day this week", "rained one day last week", "had rained every day that week"],
  ["Mrs. Diaz", "has taught at our school since 2010", "taught at our school in 2010", "had taught at our school by 2010"],
  ["I", "have known Sam since first grade", "knew Sam in first grade", "had known Sam since first grade"],
  ["The bakery", "has been open for fifty years", "was open fifty years ago", "had been open for fifty years by then"],
  ["My grandparents", "have kept bees since they retired", "kept bees after they retired", "had kept bees before they retired"],
  ["Our dog", "has slept on that rug for years", "slept on that rug last year", "had slept on that rug before"],
  ["Kim", "has wanted a bike since her birthday", "wanted a bike on her birthday", "had wanted a bike before her birthday"],
  [
    "The old tree",
    "has stood by the river for two hundred years",
    "stood by the river long ago",
    "had stood by the river before the flood",
  ],
  ["We", "have studied Spanish since September", "studied Spanish in September", "had studied Spanish before September"],
  ["Uncle Ray", "has worked at the factory since spring", "worked at the factory last spring", "had worked at the factory before spring"],
  ["The twins", "have shared a room all their lives", "shared a room when they were small", "had shared a room before they moved"],
  ["This bridge", "has carried cars since 1950", "carried cars in 1950", "had carried cars before 1950"],
  ["Leo", "has collected stamps since he was seven", "collected stamps when he was seven", "had collected stamps before he was seven"],
  ["My aunt", "has lived in Spain since 2015", "lived in Spain in 2015", "had lived in Spain before 2015"],
  ["The museum", "has stayed open late all summer", "stayed open late last summer", "had stayed open late before that summer"],
  ["Our class", "has kept a fish tank since October", "kept a fish tank in October", "had kept a fish tank before October"],
  ["Mia", "has played soccer for three years", "played soccer three years ago", "had played soccer for three years by then"],
  ["The shop", "has sold bikes since it opened", "sold bikes when it opened", "had sold bikes before it closed"],
  [
    "Grandpa",
    "has walked every morning since he retired",
    "walked every morning after he retired",
    "had walked every morning before he retired",
  ],
  ["The river", "has risen all week", "rose last week", "had risen all that week"],
  ["Our team", "has won every game this season", "won every game last season", "had won every game that season"],
  ["I", "have worn glasses since I was five", "wore glasses when I was five", "had worn glasses before I was five"],
  ["The library", "has lent books for a hundred years", "lent books a hundred years ago", "had lent books for a hundred years by then"],
  ["Ben", "has wanted a puppy for months", "wanted a puppy last month", "had wanted a puppy for months before that"],
  ["My parents", "have owned this car since 2019", "owned this car in 2019", "had owned this car before 2019"],
  ["The baby", "has slept since lunch", "slept after lunch yesterday", "had slept before lunch"],
  ["Ms. Park", "has coached the team since spring", "coached the team last spring", "had coached the team before spring"],
  ["We", "have waited for the bus for an hour", "waited for the bus an hour ago", "had waited for the bus for an hour by then"],
  ["The bakery", "has made this cake since 1980", "made this cake in 1980", "had made this cake before 1980"],
  ["My cousin", "has studied piano since she was four", "studied piano when she was four", "had studied piano before she was four"],
  ["This road", "has been closed since Monday", "was closed on Monday", "had been closed before Monday"],
  ["The cat", "has sat by the window all day", "sat by the window yesterday", "had sat by the window before dinner"],
  ["Our town", "has held a fair every June since 1990", "held a fair in June 1990", "had held a fair every June before 1990"],
];

/** perfectMeaningBank asks for the perfect tense that shows an order of times. */
export const perfectMeaningBank: readonly ChoiceItem[] = range(35).flatMap((i): ChoiceItem[] => {
  const [later, subject, had, did, has] = pick(beforeScenes, i);
  const [who, hasSince, didOnce, hadBefore] = pick(sinceScenes, i);
  const when = later.charAt(0).toLowerCase() + later.slice(1);
  const lead = capital(subject);
  return [
    [
      "Which sentence shows an action that was already complete when another past action happened?",
      `${lead} ${had} ${when}.`,
      [`${lead} ${did} ${when}.`, `${lead} ${has} ${when}.`],
    ],
    [
      "Which sentence shows an action that was already complete when another past action happened?",
      `${later}, ${subject} ${had}.`,
      [`${later}, ${subject} ${did}.`, `${later}, ${subject} ${has}.`],
    ],
    [
      "Which sentence shows an action that started in the past and goes on now?",
      `${who} ${hasSince}.`,
      [`${who} ${didOnce}.`, `${who} ${hadBefore}.`],
    ],
  ];
});

// Paired conjunctions.

const pairs: readonly (readonly [string, string])[] = [
  ["apples", "pears"],
  ["sandwiches", "fruit"],
  ["crayons", "paper"],
  ["a map", "a flashlight"],
  ["juice", "water"],
  ["cheese", "crackers"],
  ["a hat", "sunscreen"],
  ["books", "games"],
  ["soup", "bread"],
  ["pencils", "erasers"],
  ["a kite", "a ball"],
  ["rice", "beans"],
  ["paint", "brushes"],
  ["milk", "cookies"],
  ["a scarf", "gloves"],
  ["stickers", "markers"],
  ["a tent", "a sleeping bag"],
  ["carrots", "peas"],
  ["a pen", "a notebook"],
  ["grapes", "plums"],
  ["a jacket", "boots"],
  ["popcorn", "lemonade"],
  ["a ruler", "glue"],
  ["shells", "stones"],
  ["a whistle", "a compass"],
  ["eggs", "toast"],
  ["a camera", "a snack"],
  ["tea", "honey"],
  ["a blanket", "a pillow"],
  ["string", "tape"],
];

/** pairBank asks for the half of a paired conjunction that matches the other. */
export const pairBank: readonly ChoiceItem[] = [0, 1, 2, 3].flatMap((k) =>
  pairs.map(([a, b]): ChoiceItem => {
    if (k === 0) return [`You may take ___ ${a} or ${b}.`, "either", ["neither", "both"]];
    if (k === 1) return [`We had ___ ${a} nor ${b} for the trip.`, "neither", ["either", "both"]];
    if (k === 2) return [`She packed both ${a} ___ ${b}.`, "and", ["or", "nor"]];
    return [`He brought not only ${a} ___ ${b}.`, "but also", ["and also", "or also"]];
  }),
);

const singular = ["my sister", "the coach", "Ana", "our teacher", "the dog"];
const plural = ["my brothers", "the players", "the twins", "my parents", "the cats"];
const actions: readonly (readonly [s: string, plain: string, rest: string])[] = [
  ["waits", "wait", "by the gate"],
  ["sleeps", "sleep", "late on Sundays"],
  ["eats", "eat", "breakfast early"],
  ["runs", "run", "around the park"],
  ["hears", "hear", "the bell first"],
];

/** pairAgreementBank asks for the verb that agrees with subjects joined by a paired conjunction. */
export const pairAgreementBank: readonly ChoiceItem[] = range(120).map((i): ChoiceItem => {
  const kind = i % 3;
  const [one, many, other] = [
    pick(singular, Math.floor(i / 3)),
    pick(plural, Math.floor(i / 15)),
    pick(singular, Math.floor(i / 3) + 1 + (Math.floor(i / 15) % 4)),
  ];
  const [s, plain, rest] = pick(actions, Math.floor(i / 3) + Math.floor(i / 75));
  if (kind === 0)
    return [
      which,
      `Either ${many} or ${one} ${s} ${rest}.`,
      [`Either ${many} or ${one} ${plain} ${rest}.`, `Either ${many} nor ${one} ${s} ${rest}.`],
    ];
  if (kind === 1)
    return [
      which,
      `Neither ${one} nor ${many} ${plain} ${rest}.`,
      [`Neither ${one} nor ${many} ${s} ${rest}.`, `Neither ${one} or ${many} ${plain} ${rest}.`],
    ];
  return [
    which,
    capital(`both ${one} and ${other} ${plain} ${rest}.`),
    [capital(`both ${one} and ${other} ${s} ${rest}.`), capital(`both ${one} or ${other} ${plain} ${rest}.`)],
  ];
});

// Capitals.

const named: readonly (readonly [name: string, lower: string])[] = [
  ["Uncle Ray", "uncle Ray"],
  ["Aunt Lin", "aunt Lin"],
  ["Dr. Lopez", "dr. Lopez"],
  ["Grandma Rose", "grandma Rose"],
  ["Mr. Patel", "mr. Patel"],
];
const cities = ["Chicago", "Cairo", "Beijing", "Toronto", "Lagos", "Sydney", "Paris", "Lima"];
const commons = ["museum", "library", "zoo", "park", "market"];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** properNounBank asks for the sentence that capitalizes its proper nouns and only those. */
export const properNounBank: readonly ChoiceItem[] = range(40).map((i): ChoiceItem => {
  const [name, lowerName] = pick(named, i);
  const [city, place, day] = [pick(cities, i + Math.floor(i / 5)), pick(commons, i + Math.floor(i / 10)), pick(days, i)];
  const say = (n: string, p: string, c: string, d: string) => `${n} visited the ${p} in ${c} on ${d}.`;
  const lowered = [say(lowerName, place, city, day), say(name, place, city.toLowerCase(), day), say(name, place, city, day.toLowerCase())][
    i % 3
  ] as string;
  return [which, say(name, place, city, day), [lowered, say(name, capital(place), city, day)]];
});

const titles = [
  "The Wind in the Willows",
  "A Trip to the Moon",
  "The Owl Who Sang at the Dawn",
  "Life on the Farm",
  "How to Train a Puppy",
  "The Cat and the Hat Shop",
  "Stories of the Sea",
  "Into the Deep Woods",
  "A Song for the Rain",
  "The Secret of the Old Clock",
  "Journey to the Center of the Garden",
  "The Lion and the Mouse",
  "A House for a Hermit Crab",
  "Tales from the River",
  "The Girl with the Silver Kite",
  "Night at the Museum of Toys",
  "The Mystery of the Missing Map",
  "A Year in the Desert",
  "The Fox and the Crow",
  "Letters from a Lighthouse",
  "The Boy and the Dragon",
  "A Garden in the City",
  "Under the Big Top",
  "The King of the Pond",
  "Songs of the Seasons",
  "A Week on the Nile",
  "The Day the Crayons Ran",
  "Robots in the Library",
  "The Last Train to Nowhere",
  "Secrets of the Night Sky",
];
const small = new Set(["a", "an", "the", "and", "but", "or", "of", "in", "on", "to", "for", "with", "from", "at"]);

/** titleBank asks for the title capitalized by the rule for titles. */
export const titleBank: readonly ChoiceItem[] = titles.map((title): ChoiceItem => {
  const words = title.split(" ");
  const everyWord = words.map(capital).join(" ");
  const firstOnly = words.map((w, i) => (i === 0 ? w : small.has(w.toLowerCase()) ? w : w.toLowerCase())).join(" ");
  return ["Which title is capitalized correctly?", title, [everyWord, firstOnly]];
});
