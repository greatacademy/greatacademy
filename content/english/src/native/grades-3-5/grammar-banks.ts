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

/** irregularPluralBank asks for an irregular plural in a sentence. */
export const irregularPluralBank: readonly ChoiceItem[] = [0, 1, 2].flatMap((r) =>
  irregulars.map(([plural, wrong, sentences]): ChoiceItem => [pick(sentences, r), plural, wrong]),
);

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
export const adjectiveOrderBank: readonly ChoiceItem[] = range(40).map((i): ChoiceItem => {
  const [o, s, c] = [pick(opinions, i), pick(sizes, Math.floor(i / 5)), pick(colors, i)];
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
  ...range(18).map((i): ChoiceItem => {
    const [noun, materials, frame] = pick(materialThings, i);
    const [c, m] = [pick(colors, i + Math.floor(i / 6)), pick(materials, Math.floor(i / 6))];
    const say = (words: string) => frame.replace("{}", np(words, noun));
    return [which, say(`${c} ${m} ${noun}`), [say(`${m} ${c} ${noun}`), say(`${noun} ${c} ${m}`)]];
  }),
  ...range(12).map((i): ChoiceItem => {
    const [noun, materials, frame] = pick(materialThings, i);
    const [o, m] = [pick(origins, i + Math.floor(i / 6)), pick(materials, i + 1)];
    const say = (words: string) => frame.replace("{}", np(words, noun));
    return [which, say(`${o} ${m} ${noun}`), [say(`${m} ${o} ${noun}`), say(`${noun} ${o} ${m}`)]];
  }),
  ...range(12).map((i): ChoiceItem => {
    const [p, noun, frame] = pick(purposeThings, i);
    const c = pick(colors, i + Math.floor(i / 8) * 3);
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
export const progressiveFormBank: readonly ChoiceItem[] = range(48).map((i): ChoiceItem => {
  const time = i % 3;
  const [subject, now, past, wrongNow, wrongPast] = pick(people, Math.floor(i / 3));
  const [ing, rest] = pick(doings, i + Math.floor(i / 24));
  const opening = ["Right now", "At noon yesterday", "This time tomorrow"][time];
  const shown = `${opening}, ${subject} ___ ${rest}.`;
  if (time === 0) return [shown, `${now} ${ing}`, [`${wrongNow} ${ing}`, ing]];
  if (time === 1) return [shown, `${past} ${ing}`, [`${wrongPast} ${ing}`, `${now} ${ing}`]];
  return [shown, `will be ${ing}`, [`will ${ing}`, `${now} ${ing}`]];
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
];

/** progressiveMeaningBank asks which tense shows an action in progress, a habit, or an action that was interrupted. */
export const progressiveMeaningBank: readonly ChoiceItem[] = [0, 1, 2].flatMap((q) =>
  activities.map(([subject, ing, s, past, rest, habit, interruption]): ChoiceItem => {
    const now = `${subject} is ${ing} ${rest} right now.`;
    const usual = `${subject} ${s} ${rest} ${habit}.`;
    const yesterday = `${subject} ${past} ${rest} yesterday.`;
    const interrupted = `${subject} was ${ing} ${rest} when ${interruption}.`;
    const after = `${subject} ${past} ${rest} after ${interruption}.`;
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
    ],
  ],
];

/** modalMeaningBank asks for the modal verb with a meaning. */
export const modalMeaningBank: readonly ChoiceItem[] = range(6).flatMap((r) =>
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
export const modalFormBank: readonly ChoiceItem[] = range(40).map((i): ChoiceItem => {
  const subject = pick(modalSubjects, i);
  const modal = pick(modals, i + Math.floor(i / 8));
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
];

/** participleBank asks for the past participle of a verb in a perfect tense. */
export const participleBank: readonly TypedItem[] = participles.map(([plain, past, participle, regular, sentence]) => ({
  shown: `${plain}: ${sentence}`,
  accepted: [participle],
  canonical: participle,
  wrong: [past, regular],
}));

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
];

/** perfectMeaningBank asks for the perfect tense that shows an order of times. */
export const perfectMeaningBank: readonly ChoiceItem[] = range(15).flatMap((i): ChoiceItem[] => {
  const [later, subject, had, did, has] = pick(beforeScenes, i);
  const [who, hasSince, didOnce, hadBefore] = pick(sinceScenes, i);
  return [
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
export const pairAgreementBank: readonly ChoiceItem[] = range(45).map((i): ChoiceItem => {
  const kind = i % 3;
  const [one, many, other] = [
    pick(singular, Math.floor(i / 3)),
    pick(plural, i + Math.floor(i / 15)),
    pick(singular, Math.floor(i / 3) + 2),
  ];
  const [s, plain, rest] = pick(actions, i + Math.floor(i / 9));
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
