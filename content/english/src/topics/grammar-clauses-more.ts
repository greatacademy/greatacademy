// More items for the grades 6 to 8 clause and sentence topics: hand-written records that both grammar-clauses.ts and writing-sentences.ts build banks from.

import type { ChoiceItem } from "@ga/subject-english";

const upper = (s: string) => s[0]!.toUpperCase() + s.slice(1);
const lower = (s: string) => s[0]!.toLowerCase() + s.slice(1);
const words = (s: string) => s.split(" ");
const lastWords = (s: string, n: number) => words(s).slice(-n).join(" ");
const firstWord = (s: string) => words(s)[0]!;
const noStop = (s: string) => s.replace(/\.$/, "");

/** RelativeRecord is a sentence with a relative clause: the noun, the relative word, the rest of the clause, the rest of the sentence, the clause as its own sentence, whether it only adds information, and whether the relative word is the clause's object. */
export type RelativeRecord = readonly [
  noun: string,
  word: "who" | "that" | "which" | "whose",
  clause: string,
  rest: string,
  second: string,
  adds: boolean,
  object: boolean,
];

/** relativeRecords are the relative-clause records. */
export const relativeRecords: readonly RelativeRecord[] = [
  ["The girl", "who", "sits by the window", "won the spelling bee", "She sits by the window.", false, false],
  ["The book", "that", "Leo borrowed", "was overdue", "Leo borrowed it.", false, true],
  ["The boy", "whose", "bike was stolen", "told the police", "His bike was stolen.", false, false],
  ["My uncle", "who", "lives in Texas", "raises horses", "He lives in Texas.", true, false],
  ["The Nile", "which", "flows north", "is the longest river in Africa", "It flows north.", true, false],
  ["The bus", "that", "goes to the zoo", "leaves at nine", "It goes to the zoo.", false, false],
  ["The firefighter", "who", "saved the cat", "visited our class", "He saved the cat.", false, false],
  ["The kite", "that", "we built", "flew above the trees", "We built it.", false, true],
  ["The family", "whose", "house burned down", "stayed with us", "Their house burned down.", false, false],
  ["Dr. Patel", "who", "is our dentist", "has a fish tank in her office", "She is our dentist.", true, false],
  ["My phone", "which", "is three years old", "still works well", "It is three years old.", true, false],
  ["The plant", "that", "grows on the wall", "needs little water", "It grows on the wall.", false, false],
  ["The players", "who", "missed practice", "sat on the bench", "They missed practice.", false, false],
  ["The soup", "that", "Grandpa made", "was too salty", "Grandpa made it.", false, true],
  ["The tree", "whose", "roots cracked the sidewalk", "was cut down", "Its roots cracked the sidewalk.", false, false],
  ["Our principal", "who", "loves jazz", "plays the trumpet", "He loves jazz.", true, false],
  ["The museum", "which", "opened last spring", "has a dinosaur hall", "It opened last spring.", true, false],
  ["The woman", "who", "runs the bakery", "gave us free rolls", "She runs the bakery.", false, false],
  ["The photo", "that", "Nina took", "won first prize", "Nina took it.", false, true],
  ["The author", "whose", "books we love", "signed my copy", "We love her books.", false, false],
  ["Lake Baikal", "which", "is in Siberia", "holds a fifth of the world's fresh water", "It is in Siberia.", true, false],
  ["The bridge", "that", "crosses the river", "is closed for repairs", "It crosses the river.", false, false],
  ["The scientist", "who", "studies volcanoes", "spoke at our school", "She studies volcanoes.", false, false],
  ["The student", "who", "found the wallet", "took it to the office", "He found the wallet.", false, false],
  ["My best friend", "who", "moved to Ohio", "writes me every week", "She moved to Ohio.", true, false],
  ["Our kitchen", "which", "faces east", "fills with light each morning", "It faces east.", true, false],
  ["The coach", "who", "lost his voice", "used a whistle all game", "He lost his voice.", false, false],
  ["Mr. Haddad", "who", "drives the school bus", "knows every student by name", "He drives the school bus.", true, false],
  ["The Great Wall", "which", "is thousands of miles long", "was built over many centuries", "It is thousands of miles long.", true, false],
  ["The cookies", "that", "Dad baked", "disappeared in an hour", "Dad baked them.", false, true],
  ["My grandmother", "who", "grew up on a farm", "can milk a cow", "She grew up on a farm.", true, false],
  ["Our old car", "which", "has a dent in the door", "still runs well", "It has a dent in the door.", true, false],
  ["The singer", "whose", "song won the prize", "thanked her fans", "Her song won the prize.", false, false],
  ["Ms. Larsen", "who", "teaches art", "painted the mural in the hall", "She teaches art.", true, false],
  ["The Pacific Ocean", "which", "covers a third of the Earth", "is the deepest ocean", "It covers a third of the Earth.", true, false],
  ["The trail", "that", "leads to the falls", "is muddy after rain", "It leads to the falls.", false, false],
  ["My cousin Theo", "who", "is learning Korean", "wants to visit Seoul", "He is learning Korean.", true, false],
  ["The volcano", "which", "last erupted in 1980", "is quiet now", "It last erupted in 1980.", true, false],
  ["The neighbors", "who", "own the bakery", "brought us bread", "They own the bakery.", false, false],
  ["Our teacher", "who", "loves birds", "built a feeder outside the window", "She loves birds.", true, false],
  ["This sweater", "which", "my aunt knitted", "is very warm", "My aunt knitted it.", true, true],
  ["The Moon", "which", "has no air", "is silent", "It has no air.", true, false],
  ["Captain Reyes", "who", "flew in the air show", "signed autographs afterward", "She flew in the air show.", true, false],
  ["Our school garden", "which", "the fifth graders planted", "grows tomatoes and beans", "The fifth graders planted it.", true, true],
  ["Uncle Joe", "who", "repairs clocks", "fixed my watch for free", "He repairs clocks.", true, false],
  ["The hamster", "that", "escaped from its cage", "hid in my shoe", "It escaped from its cage.", false, false],
];

/** relativeSentence writes a relative record as one sentence, with the given word in the relative word's place. */
export const relativeSentence = ([noun, , clause, rest, , adds]: RelativeRecord, word: string): string =>
  adds ? `${noun}, ${word} ${clause}, ${rest}.` : `${noun} ${word} ${clause} ${rest}.`;

const relativeWrong: Readonly<Record<RelativeRecord[1], readonly [string, string]>> = {
  who: ["which", "whose"],
  that: ["who", "whose"],
  which: ["who", "whose"],
  whose: ["who", "which"],
};

/** moreRelativeWords are items that ask which relative word fills the gap. */
export const moreRelativeWords: readonly ChoiceItem[] = relativeRecords.map((r) => [
  relativeSentence(r, "___"),
  r[1],
  [...relativeWrong[r[1]]],
]);

/** moreRelativeFinds are items that ask for the relative clause in a sentence. */
export const moreRelativeFinds: readonly ChoiceItem[] = relativeRecords.map((r) => {
  const [noun, word, clause, rest, , adds] = r;
  return [relativeSentence(r, word), `${word} ${clause}`, [noun, rest, `${lastWords(clause, 2)}${adds ? "," : ""} ${firstWord(rest)}`]];
});

/** AppositiveRecord is a noun, an appositive that renames it, the rest of the sentence and the appositive as its own sentence. */
export type AppositiveRecord = readonly [noun: string, appositive: string, rest: string, second: string];

/** appositiveRecords are sentences whose appositive follows the subject. */
export const appositiveRecords: readonly AppositiveRecord[] = [
  ["Mr. Ortiz", "our science teacher", "keeps a snake in the classroom", "He is our science teacher."],
  ["Venus", "the hottest planet", "is covered in thick clouds", "It is the hottest planet."],
  ["My sister", "a nurse at the city hospital", "works at night", "She is a nurse at the city hospital."],
  ["Rex", "our neighbor's old dog", "sleeps on our porch", "He is our neighbor's old dog."],
  ["The Amazon", "the largest rain forest on Earth", "is home to millions of species", "It is the largest rain forest on Earth."],
  ["Coach Rivera", "a former pro player", "runs the summer camp", "She is a former pro player."],
  ["Paris", "the capital of France", "sits on the Seine", "It is the capital of France."],
  ["Our cat", "a fluffy gray tabby", "hides under the bed", "It is a fluffy gray tabby."],
  ["Aunt Rosa", "the best cook in the family", "made the birthday cake", "She is the best cook in the family."],
  ["Mount Fuji", "the tallest mountain in Japan", "is often covered in snow", "It is the tallest mountain in Japan."],
  ["Jamal", "the team captain", "scored the first goal", "He is the team captain."],
  ["The whale shark", "the biggest fish in the sea", "eats tiny plankton", "It is the biggest fish in the sea."],
  ["Ms. Okafor", "the new principal", "greeted every student", "She is the new principal."],
  ["Saturn", "the planet with bright rings", "is mostly gas", "It is the planet with bright rings."],
  ["My grandfather", "a retired sailor", "tells great stories", "He is a retired sailor."],
  ["Charlotte's Web", "a book about a pig and a spider", "made me cry", "It is a book about a pig and a spider."],
  ["Dr. Kim", "an expert on bones", "looked at my X-ray", "She is an expert on bones."],
  ["The Sahara", "the largest hot desert", "gets very little rain", "It is the largest hot desert."],
  ["Pablo", "my lab partner", "spilled the water", "He is my lab partner."],
  ["Our town library", "a brick building from 1910", "is getting a new roof", "It is a brick building from 1910."],
  ["Mei", "the fastest runner in our grade", "won the relay", "She is the fastest runner in our grade."],
  ["The cheetah", "the fastest land animal", "can run seventy miles an hour", "It is the fastest land animal."],
];

/** lateComma moves the comma that closes a mid-sentence appositive one word too far, past the verb that follows it. */
export const lateComma = (sentence: string): string => {
  const close = sentence.indexOf(", ", sentence.indexOf(", ") + 2);
  const next = sentence.indexOf(" ", close + 2);
  return `${sentence.slice(0, close)} ${sentence.slice(close + 2, next)},${sentence.slice(next)}`;
};

/** appositiveSentence writes an appositive record as one sentence with its two commas. */
export const appositiveSentence = ([noun, appositive, rest]: AppositiveRecord): string => `${noun}, ${appositive}, ${rest}.`;

/** EndAppositiveRecord is the start of a sentence, the noun that ends it, an appositive that renames the noun and the appositive as its own sentence. */
export type EndAppositiveRecord = readonly [start: string, noun: string, appositive: string, second: string];

/** endAppositiveRecords are sentences that end with an appositive. */
export const endAppositiveRecords: readonly EndAppositiveRecord[] = [
  ["We visited", "Rome", "a city full of old ruins", "It is a city full of old ruins."],
  ["I met", "Mr. Banks", "the author of the book", "He is the author of the book."],
  ["She adopted", "Pepper", "a shy black kitten", "It is a shy black kitten."],
  ["We climbed", "Pikes Peak", "a mountain in Colorado", "It is a mountain in Colorado."],
  ["Dad cooked", "paella", "a rice dish from Spain", "It is a rice dish from Spain."],
  ["The class read", "Hatchet", "a story about survival", "It is a story about survival."],
  ["I called", "Grandma Lu", "my mother's mother", "She is my mother's mother."],
  ["We cheered for", "the Hawks", "our town's soccer team", "They are our town's soccer team."],
  ["Tom plays", "the cello", "a large string instrument", "It is a large string instrument."],
  ["They toured", "the White House", "the home of the president", "It is the home of the president."],
  ["My brother fixed", "the old radio", "a gift from our grandfather", "It is a gift from our grandfather."],
  ["We studied", "the octopus", "an animal with eight arms", "It is an animal with eight arms."],
  ["I emailed", "Ms. Grant", "my writing teacher", "She is my writing teacher."],
  ["The town honored", "Captain Diaz", "a brave firefighter", "He is a brave firefighter."],
  ["Lena painted", "the lighthouse", "a tall white tower by the sea", "It is a tall white tower by the sea."],
  ["We watched", "the eclipse", "a rare event", "It is a rare event."],
  ["He thanked", "Officer Bell", "the crossing guard", "He is the crossing guard."],
  ["Our class visited", "the aquarium", "a place full of sharks and rays", "It is a place full of sharks and rays."],
  ["I finished", "my project", "a model of the solar system", "It is a model of the solar system."],
  ["Everyone liked", "Ms. Adeyemi", "the substitute teacher", "She is the substitute teacher."],
  ["We tasted", "mochi", "a sweet rice cake from Japan", "It is a sweet rice cake from Japan."],
  ["The team chose", "Ravi", "the best listener in the group", "He is the best listener in the group."],
];

/** moreAppositiveFinds are items that ask for the appositive in a sentence. */
export const moreAppositiveFinds: readonly ChoiceItem[] = appositiveRecords.flatMap((r, i): ChoiceItem[] => {
  const [noun, appositive, rest] = r;
  // Every other item also offers the noun together with its appositive, a mistake that takes in too much.
  const front: ChoiceItem = [
    appositiveSentence(r),
    appositive,
    [noun, rest, i % 2 === 0 ? `${noun}, ${appositive}` : lastWords(appositive, 2)],
  ];
  const e = endAppositiveRecords[i];
  if (e === undefined) return [front];
  const [start, endNoun, endAppositive] = e;
  return [
    front,
    [
      `${start} ${endNoun}, ${endAppositive}.`,
      endAppositive,
      [endNoun, start, i % 2 === 1 ? `${endNoun}, ${endAppositive}` : lastWords(endAppositive, 2)],
    ],
  ];
});

/** moreAppositiveCommas are items that ask for the correctly punctuated sentence; the first wrong one lacks the comma before the appositive, the second the comma after it, and the third puts that comma one word too late. */
export const moreAppositiveCommas: readonly ChoiceItem[] = appositiveRecords.map((r) => {
  const [noun, appositive, rest] = r;
  return [
    "",
    appositiveSentence(r),
    [`${noun} ${appositive}, ${rest}.`, `${noun}, ${appositive} ${rest}.`, lateComma(appositiveSentence(r))],
  ];
});

/** ParticipleRecord is a participial phrase and the sentence it opens: the -ing, past participle, -s and simple past forms of the verb, the rest of the phrase, the subject, the predicate, and whether the subject does the action. */
export type ParticipleRecord = readonly [
  ing: string,
  done: string,
  s: string,
  past: string,
  phrase: string,
  subject: string,
  predicate: string,
  active: boolean,
];

/** participleRecords are the participial-phrase records. */
export const participleRecords: readonly ParticipleRecord[] = [
  ["Grabbing", "Grabbed", "Grabs", "grabbed", "her umbrella", "Nora", "ran out the door into the rain", true],
  ["Surprising", "Surprised", "Surprises", "", "by the news", "Kayla", "dropped her phone on the floor", false],
  ["Whistling", "Whistled", "Whistles", "whistled", "a happy tune", "the farmer", "fed the chickens in the yard", true],
  ["Climbing", "Climbed", "Climbs", "climbed", "the steep hill", "we", "stopped to rest under a tree", true],
  ["Painting", "Painted", "Paints", "", "bright yellow", "the old door", "looked brand new", false],
  ["Searching", "Searched", "Searches", "searched", "under the couch", "Max", "found his lost shoe at last", true],
  ["Smiling", "Smiled", "Smiles", "smiled", "at the crowd", "the singer", "took a deep bow and waved", true],
  ["Frightening", "Frightened", "Frightens", "", "by the thunder", "the horses", "ran back to the safety of the barn", false],
  ["Shivering", "Shivered", "Shivers", "shivered", "in the cold", "the puppy", "curled up by the fire", true],
  ["Checking", "Checked", "Checks", "checked", "her watch", "Ms. Hale", "started the math test", true],
  ["Writing", "Written", "Writes", "", "in pencil", "the note", "was very hard to read", false],
  ["Pointing", "Pointed", "Points", "pointed", "at the sky", "Leo", "spotted a shooting star", true],
  ["Turning", "Turned", "Turns", "turned", "the last page", "Ava", "closed the book with a sigh", true],
  ["Wrapping", "Wrapped", "Wraps", "", "in a warm blanket", "the baby", "fell fast asleep in her crib", false],
  ["Racing", "Raced", "Races", "raced", "down the field", "the striker", "kicked the ball into the net", true],
  ["Humming", "Hummed", "Hums", "hummed", "to herself", "Grandma", "rolled out the dough", true],
  ["Tiring", "Tired", "Tires", "", "from the long game", "the players", "went straight to bed", false],
  ["Wiping", "Wiped", "Wipes", "wiped", "his glasses", "the old man", "read the sign again", true],
  ["Packing", "Packed", "Packs", "packed", "their bags", "the campers", "waited for the bus", true],
  ["Covering", "Covered", "Covers", "", "in snow", "the mountains", "glowed pink at sunset", false],
  ["Spotting", "Spotted", "Spots", "spotted", "a hawk", "the rabbit", "dashed into its hole", true],
  ["Stretching", "Stretched", "Stretches", "stretched", "its wings", "the eagle", "rose high into the air", true],
  ["Hiding", "Hidden", "Hides", "", "behind a cloud", "the moon", "gave very little light", false],
  ["Yawning", "Yawned", "Yawns", "yawned", "loudly", "Ben", "turned off the light", true],
  ["Juggling", "Juggled", "Juggles", "juggled", "three oranges", "the clown", "walked across the stage", true],
  ["Clutching", "Clutched", "Clutches", "clutched", "her ticket", "Zoe", "boarded the train", true],
  ["Tiptoeing", "Tiptoed", "Tiptoes", "tiptoed", "down the hall", "the twins", "sneaked a cookie", true],
  ["Sniffing", "Sniffed", "Sniffs", "sniffed", "the ground", "the hound", "followed the trail", true],
  ["Balancing", "Balanced", "Balances", "balanced", "on one foot", "the dancer", "spun slowly", true],
  ["Splashing", "Splashed", "Splashes", "splashed", "through the puddles", "the children", "laughed all the way home", true],
  ["Mumbling", "Mumbled", "Mumbles", "mumbled", "an excuse", "Theo", "handed in his late homework", true],
];

/** participleWord is the participle that opens a record's sentence. */
export const participleWord = (r: ParticipleRecord): string => (r[7] ? r[0] : r[1]);

/** participleSentence writes a participle record as one sentence opened by its phrase. */
export const participleSentence = (r: ParticipleRecord): string => `${participleWord(r)} ${r[4]}, ${r[5]} ${r[6]}.`;

/** moreParticipleFinds are items that ask for the participial phrase in a sentence. */
export const moreParticipleFinds: readonly ChoiceItem[] = participleRecords.map((r) => {
  const [, , , , phrase, subject, predicate] = r;
  return [
    participleSentence(r),
    `${participleWord(r)} ${phrase}`,
    [`${upper(subject)} ${firstWord(predicate)}`, predicate, `${lastWords(phrase, 1)}, ${subject}`],
  ];
});

/** moreParticipleForms are items that ask which form of the verb opens the sentence. */
export const moreParticipleForms: readonly ChoiceItem[] = participleRecords.map(([ing, done, s, , phrase, subject, predicate, active]) => [
  `___ ${phrase}, ${subject} ${predicate}.`,
  active ? ing : done,
  active ? [`${done} by`, s] : [ing, s],
]);

/** misplacedRecords are pairs of sentences whose describing phrases sit next to the words they describe, and pairs whose phrases do not. */
export const misplacedRecords: readonly { readonly good: readonly [string, string]; readonly bad: readonly [string, string] }[] = [
  {
    good: ["Hiking up the trail, we saw a deer.", "We saw a deer while we were hiking up the trail."],
    bad: ["Hiking up the trail, a deer came into view.", "A deer was seen by us hiking up the trail."],
  },
  {
    good: ["Covered in chocolate, the cake looked delicious.", "The cake, covered in chocolate, looked delicious."],
    bad: ["Covered in chocolate, I thought the cake looked delicious.", "I served the cake to my friends covered in chocolate."],
  },
  {
    good: ["Mia found a ring that sparkled in the sand.", "In the sand, Mia found a sparkling ring."],
    bad: ["Sparkling in the sand, Mia found a ring.", "Mia, sparkling in the sand, found a ring."],
  },
  {
    good: ["After finishing my homework, I watched TV.", "I watched TV after I finished my homework."],
    bad: ["After finishing my homework, the TV was turned on.", "Finishing my homework, the TV seemed louder."],
  },
  {
    good: ["The boy in the red hat waved at us.", "Wearing a red hat, the boy waved at us."],
    bad: ["Wearing a red hat, we were waved at by the boy.", "The boy waved at us wearing a red hat."],
  },
  {
    good: ["Barking at the mail carrier, the dog woke the baby.", "The dog that was barking at the mail carrier woke the baby."],
    bad: ["Barking at the mail carrier, the baby was woken by the dog.", "The dog woke the baby barking at the mail carrier."],
  },
  {
    good: ["Running late, Dad grabbed a quick breakfast.", "Dad, who was running late, grabbed a quick breakfast."],
    bad: ["Running late, a quick breakfast was grabbed.", "A quick breakfast, running late, was grabbed by Dad."],
  },
  {
    good: ["Lying on the beach, we watched the waves.", "We watched the waves as we lay on the beach."],
    bad: ["Lying on the beach, the waves looked huge.", "The waves were watched lying on the beach."],
  },
  {
    good: ["The girl in the blue coat fed the ducks.", "Wearing a blue coat, the girl fed the ducks."],
    bad: ["Wearing a blue coat, the ducks were fed by the girl.", "The girl fed the ducks in the blue coat."],
  },
  {
    good: ["Excited about the trip, Sam packed early.", "Sam, excited about the trip, packed early."],
    bad: ["Excited about the trip, the bags were packed early.", "The bags, excited about the trip, were packed early."],
  },
  {
    good: ["Flying over the city, the pilot saw the stadium.", "The pilot saw the stadium while flying over the city."],
    bad: ["Flying over the city, the stadium looked tiny.", "The stadium, flying over the city, was seen by the pilot."],
  },
  {
    good: ["Rushing out the door, I forgot my keys.", "I forgot my keys as I rushed out the door."],
    bad: ["Rushing out the door, my keys were left on the table.", "My keys, rushing out the door, stayed on the table."],
  },
  {
    good: ["Tired after the game, the players rested.", "The players, tired after the game, rested."],
    bad: ["Tired after the game, the bench was where the players rested.", "The bench, tired after the game, held the players."],
  },
  {
    good: ["Reading the recipe, Ana noticed a mistake.", "Ana noticed a mistake while reading the recipe."],
    bad: ["Reading the recipe, a mistake jumped out.", "A mistake, reading the recipe, was noticed by Ana."],
  },
  {
    good: ["Painted bright red, the barn stood out.", "The barn, painted bright red, stood out."],
    bad: ["Painted bright red, we could see the barn from the road.", "Painted bright red, the road led us to the barn."],
  },
  {
    good: ["Swimming in the pond, the frog caught a fly.", "The frog caught a fly while swimming in the pond."],
    bad: ["Swimming in the pond, a fly was caught by the frog.", "A fly, swimming in the pond, was caught by the frog."],
  },
  {
    good: ["Holding the leash tightly, Omar walked the puppy.", "Omar walked the puppy, holding the leash tightly."],
    bad: ["Holding the leash tightly, the puppy was walked by Omar.", "The puppy, holding the leash tightly, was walked by Omar."],
  },
  {
    good: ["Built in 1850, the church needs repairs.", "The church, built in 1850, needs repairs."],
    bad: ["Built in 1850, repairs are needed on the church.", "Built in 1850, the town wants to repair the church."],
  },
  {
    good: ["Looking out the window, Lily saw snow.", "Lily saw snow when she looked out the window."],
    bad: ["Looking out the window, snow covered the yard.", "Snow, looking out the window, covered the yard."],
  },
  {
    good: ["Hungry after school, the twins ate apples.", "The twins, hungry after school, ate apples."],
    bad: ["Hungry after school, the apples were eaten by the twins.", "The apples, hungry after school, were eaten by the twins."],
  },
  {
    good: ["Waiting for the train, we played cards.", "We played cards while we waited for the train."],
    bad: ["Waiting for the train, the cards came out.", "The cards, waiting for the train, were played."],
  },
  {
    good: ["Stuck in traffic, Mom called to say she would be late.", "Mom, stuck in traffic, called to say she would be late."],
    bad: ["Stuck in traffic, the phone rang with Mom's call.", "The phone, stuck in traffic, rang with Mom's call."],
  },
];

/** moreMisplacedFinds are items that ask which sentence has a misplaced or dangling modifier. */
export const moreMisplacedFinds: readonly ChoiceItem[] = misplacedRecords.map(({ good, bad }, i) => ["", bad[i % 2]!, [...good]]);

/** moreMisplacedFixes are items that ask which sentence places its modifiers clearly. */
export const moreMisplacedFixes: readonly ChoiceItem[] = misplacedRecords.map(({ good, bad }, i) => ["", good[(i + 1) % 2]!, [...bad]]);

/** VoiceRecord is an action: the doer, the simple past, the past participle, the receiver, and whether the doer and the receiver are plural. */
export type VoiceRecord = readonly [doer: string, past: string, done: string, receiver: string, doers: boolean, receivers: boolean];

/** voiceRecords are the voice records. */
export const voiceRecords: readonly VoiceRecord[] = [
  ["the storm", "knocked over", "knocked over", "the old oak", false, false],
  ["the students", "painted", "painted", "the mural", true, false],
  ["a bee", "stung", "stung", "my brother", false, false],
  ["the mayor", "opened", "opened", "the new library", false, false],
  ["the puppy", "chewed", "chewed", "my slippers", false, true],
  ["Grandpa", "fixed", "fixed", "the fence", false, false],
  ["the waves", "washed away", "washed away", "the sandcastle", true, false],
  ["Ms. Diaz", "read", "read", "the poem", false, false],
  ["the volunteers", "cleaned", "cleaned", "the park", true, false],
  ["a fox", "stole", "stolen", "the eggs", false, true],
  ["the firefighters", "rescued", "rescued", "the kitten", true, false],
  ["Ana", "drew", "drawn", "the map", false, false],
  ["the coach", "chose", "chosen", "the players", false, true],
  ["lightning", "struck", "struck", "the tower", false, false],
  ["the band", "played", "played", "the anthem", false, false],
  ["the kids", "built", "built", "a snowman", true, false],
  ["my aunt", "knitted", "knitted", "the scarf", false, false],
  ["the judges", "picked", "picked", "the winner", true, false],
  ["the wind", "scattered", "scattered", "the leaves", false, true],
  ["Dr. Ruiz", "treated", "treated", "the injured hiker", false, false],
  ["the crowd", "cheered", "cheered", "the runners", false, true],
  ["the chef", "sliced", "sliced", "the onions", false, true],
];

const be = (plural: boolean) => (plural ? "were" : "was");

/** activeOf writes a voice record in the active voice; swapped, the receiver becomes the doer. */
export const activeOf = ([doer, past, , receiver]: VoiceRecord, swapped = false): string =>
  swapped ? `${upper(receiver)} ${past} ${doer}.` : `${upper(doer)} ${past} ${receiver}.`;

/** passiveOf writes a voice record in the passive voice, naming the doer after *by* when asked; swapped, the doer becomes the receiver. */
export const passiveOf = ([doer, , done, receiver, doers, receivers]: VoiceRecord, by: boolean, swapped = false): string =>
  swapped
    ? `${upper(doer)} ${be(doers)} ${done} by ${receiver}.`
    : `${upper(receiver)} ${be(receivers)} ${done}${by ? ` by ${doer}` : ""}.`;

/** moreToActive are items that ask for the active version of a passive sentence; the first wrong one is active with the roles swapped, the second still passive and swapped. */
export const moreToActive: readonly ChoiceItem[] = voiceRecords.map((r) => [
  passiveOf(r, true),
  activeOf(r),
  [activeOf(r, true), passiveOf(r, true, true)],
]);

/** voiceSentences are, round by round, the active, the passive naming the doer and the passive without it, each with whether it is active. */
export const voiceSentences: readonly (readonly [sentence: string, active: boolean])[] = [
  ...voiceRecords.map((r) => [activeOf(r), true] as const),
  ...voiceRecords.map((r) => [passiveOf(r, true), false] as const),
  ...voiceRecords.map((r) => [passiveOf(r, false), false] as const),
];

/** parallelRecords are lists of three: the words before the list, then each item as the parallel form, a form that breaks the pattern, and another wrong form. */
export const parallelRecords: readonly (readonly [before: string, ...items: string[]])[] = [
  ["On weekends, Sara loves", "dancing|to dance|danced", "singing|to sing|sang", "acting|acts|acted"],
  [
    "The puppy likes",
    "chewing shoes|to chew shoes|chews shoes",
    "digging holes|digs holes|dug holes",
    "chasing cats|to chase cats|chased cats",
  ],
  [
    "Mom asked me",
    "to feed the cat|feeding the cat|fed the cat",
    "to water the plants|watering the plants|watered the plants",
    "to take out the trash|taking out the trash|took out the trash",
  ],
  [
    "Yesterday Jake",
    "mowed the lawn|mowing the lawn|mows the lawn",
    "washed the car|was washing the car|to wash the car",
    "raked the leaves|raking the leaves|rakes the leaves",
  ],
  ["The hotel room was", "clean|had cleanness|cleanly", "quiet|had quiet|quietly", "cozy|full of coziness|cozily"],
  [
    "My grandmother enjoys",
    "gardening|to garden|gardens",
    "baking bread|to bake bread|bakes bread",
    "doing puzzles|to do puzzles|did puzzles",
  ],
  [
    "During the storm, we",
    "closed the windows|closing the windows|close the windows",
    "lit candles|lighting candles|to light candles",
    "listened to the radio|listening to the radio|listens to the radio",
  ],
  [
    "To stay healthy, you should",
    "eat vegetables|eating vegetables|ate vegetables",
    "sleep well|sleeping well|slept well",
    "exercise daily|to exercise daily|exercised daily",
  ],
  ["The new student seemed", "shy|had shyness|shyly", "polite|acted with politeness|politely", "curious|full of curiosity|curiously"],
  [
    "At camp, the kids learned",
    "to paddle a canoe|paddling a canoe|paddled a canoe",
    "to build a fire|building a fire|built a fire",
    "to tie knots|tying knots|tied knots",
  ],
  [
    "Before the race, Lena",
    "stretched her legs|stretching her legs|stretches her legs",
    "drank some water|drinking some water|drinks some water",
    "tied her shoes|tying her shoes|ties her shoes",
  ],
  [
    "My little brother hates",
    "taking baths|to take baths|took baths",
    "eating peas|to eat peas|ate peas",
    "going to bed early|to go to bed early|went to bed early",
  ],
  [
    "The firefighters",
    "climbed the ladder|climbing the ladder|climbs the ladder",
    "broke the window|breaking the window|breaks the window",
    "carried the boy out|carrying the boy out|carries the boy out",
  ],
  ["The old house was", "dark|had darkness|darkly", "dusty|full of dust|dustily", "cold|had a chill|coldly"],
  [
    "Ravi wants",
    "to travel|traveling|travels",
    "to learn Spanish|learning Spanish|learns Spanish",
    "to write a book|writing a book|writes a book",
  ],
  ["In art class, we enjoy", "drawing|to draw|drew", "painting|to paint|painted", "making clay pots|to make clay pots|made clay pots"],
  [
    "After dinner, Dad",
    "washed the dishes|washing the dishes|washes the dishes",
    "dried them|drying them|dries them",
    "put them away|putting them away|puts them away",
  ],
  [
    "The teacher reminded us",
    "to check our spelling|checking our spelling|checked our spelling",
    "to number the pages|numbering the pages|numbered the pages",
    "to sign our names|signing our names|signed our names",
  ],
  ["The movie was", "funny|full of humor|funnily", "exciting|had excitement|excitingly", "sad|had sadness|sadly"],
  [
    "Every morning, the baker",
    "mixes the dough|mixing the dough|mixed the dough",
    "shapes the loaves|shaping the loaves|to shape the loaves",
    "bakes the bread|baking the bread|baked the bread",
  ],
  ["My cousins prefer", "skiing|to ski|skied", "skating|to skate|skated", "sledding|to sled|sledded"],
  [
    "At the zoo, we",
    "fed the goats|feeding the goats|feeds the goats",
    "watched the seals|watching the seals|watches the seals",
    "rode the train|riding the train|rides the train",
  ],
  ["Nadia promised", "to call|calling|called", "to visit|visiting|visited", "to send photos|sending photos|sent photos"],
];

const parallelParts = ([before, ...items]: readonly [string, ...string[]]) =>
  [before, items.map((item) => item.split("|") as [string, string, string])] as const;

const list = (before: string, items: readonly string[]) => `${before} ${items[0]}, ${items[1]} and ${items[2]}.`;

/** moreParallelFinds are items that ask which sentence keeps its list parallel. */
export const moreParallelFinds: readonly ChoiceItem[] = parallelRecords.map((r, i) => {
  const [before, items] = parallelParts(r);
  const right = items.map(([form]) => form);
  const broken = (k: number) =>
    list(
      before,
      right.map((form, j) => (j === k ? items[j]![1] : form)),
    );
  return ["", list(before, right), [broken((i + 2) % 3), broken(i % 3)]];
});

/** moreParallelFixes are items that ask how to fix the one item that breaks a list's pattern. */
export const moreParallelFixes: readonly ChoiceItem[] = parallelRecords.map((r, i) => {
  const [before, items] = parallelParts(r);
  const k = (i + 2) % 3;
  const [form, broken, other] = items[k]!;
  return [
    list(
      before,
      items.map(([f], j) => (j === k ? broken : f)),
    ),
    form,
    [broken, other],
  ];
});

/** openingRecords are phrases of time or place, and the sentences they can open. */
export const openingRecords: readonly (readonly [phrase: string, rest: string])[] = [
  ["before breakfast", "we fed the chickens"],
  ["during the concert", "my phone buzzed twice"],
  ["behind the shed", "Leo found an old bike"],
  ["at midnight", "the clock tower rang"],
  ["in the spring", "the river floods the meadow"],
  ["after the game", "the team ate pizza"],
  ["across the street", "a new bakery opened"],
  ["on Saturday morning", "we cleaned the garage"],
  ["inside the cave", "the air felt damp"],
  ["at the top of the hill", "we stopped for lunch"],
  ["since last summer", "Ana has grown two inches"],
  ["under the porch", "a cat had her kittens"],
  ["during the night", "snow covered the roads"],
  ["beside the lake", "the campers set up their tents"],
  ["after school", "Max walks his dog"],
  ["in the corner of the room", "a spider spun its web"],
  ["before the test", "Mia reviewed her notes"],
  ["along the path", "wildflowers bloomed"],
  ["at the end of the day", "the workers went home"],
  ["through the window", "we watched the parade"],
  ["in the morning", "the birds sing loudly"],
  ["near the station", "my uncle runs a small shop"],
];

/** moreFillers are long phrases, the short word that can replace each, and two short words that cannot. */
export const moreFillers: readonly ChoiceItem[] = [
  ["at the present time", "now", ["soon", "before"]],
  ["for the purpose of", "for", ["despite", "without"]],
  ["in the near future", "soon", ["lately", "once"]],
  ["a majority of", "most", ["few", "none of"]],
  ["in close proximity to", "near", ["far from", "above"]],
  ["despite the fact that", "although", ["because", "so"]],
  ["make a decision", "decide", ["refuse", "forget"]],
  ["give consideration to", "consider", ["ignore", "reject"]],
  ["in the course of", "during", ["after", "before"]],
  ["prior to", "before", ["after", "during"]],
  ["subsequent to", "after", ["before", "during"]],
  ["at all times", "always", ["never", "sometimes"]],
  ["is able to", "can", ["must", "won't"]],
  ["owing to the fact that", "because", ["although", "unless"]],
  ["in a timely manner", "promptly", ["slowly", "rarely"]],
  ["a small number of", "a few", ["many", "most"]],
  ["each and every", "every", ["no", "few"]],
  ["come to a conclusion", "conclude", ["begin", "doubt"]],
  ["in the vicinity of", "near", ["inside", "beyond"]],
  ["with the exception of", "except", ["including", "besides"]],
  ["in light of the fact that", "since", ["unless", "although"]],
  ["take action", "act", ["wait", "rest"]],
];

/** moreWordy are tight sentences, each with two wordy versions that say the same thing. */
export const moreWordy: readonly ChoiceItem[] = (
  [
    [
      "The meeting starts at nine.",
      "The meeting has a start time of nine o'clock in the morning.",
      "The meeting begins and starts at nine.",
    ],
    ["Please reply soon.", "Please send a reply back to me at your earliest convenience.", "Please reply back soon."],
    ["The sky was blue.", "The sky was blue in color.", "The color of the sky was a blue color."],
    ["We worked together.", "We worked together as a team with each other.", "We all collaborated together jointly."],
    ["The plan failed.", "The plan was a failure that did not succeed.", "The plan ended up in failure in the end."],
    ["She is tall.", "She is tall in height.", "She has a height that is tall."],
    ["The result surprised us.", "The final end result surprised us.", "The end result was something that surprised us."],
    ["I agree.", "I am in agreement with that.", "I personally agree with that in my opinion."],
    ["The test was hard.", "The test was hard and difficult.", "The test was of a difficult nature."],
    ["He repeated the joke.", "He repeated the joke again.", "He said the joke again a second time."],
    [
      "The shop closes early on Sundays.",
      "The shop closes at an early time on Sundays.",
      "On Sundays, the shop has an early closing time.",
    ],
    ["They returned home.", "They returned back home.", "They came back and returned home."],
    ["The bag is heavy.", "The bag is heavy in weight.", "The bag has a weight that is heavy."],
    ["We must plan ahead.", "We must plan ahead in advance.", "It is necessary for us to make plans ahead of time in advance."],
    ["Each student got a book.", "Each and every single student got a book.", "Every student, each one, got a book."],
    ["The story is true.", "The story is a true fact.", "The story is true and not false."],
    ["I will call you tomorrow.", "I will give you a call on the phone tomorrow.", "Tomorrow I will call you on the following day."],
    ["The noise was loud.", "The noise was loud in volume.", "The noise was of a loud kind."],
    ["She smiled.", "She smiled with her mouth.", "She made a smile on her face."],
    ["The two friends met.", "The two friends met together.", "The two friends had a meeting with each other."],
    ["We should cooperate.", "We should cooperate together.", "We should all cooperate jointly as a group."],
    ["Most people liked the film.", "The majority of people liked the film.", "A large number of most people liked the film."],
  ] as const
).map(([right, a, b]): ChoiceItem => ["", right, [a, b]]);

/** helpers shared with the banks that build typed items from these records. */
export const recordText = { upper, lower, noStop };
