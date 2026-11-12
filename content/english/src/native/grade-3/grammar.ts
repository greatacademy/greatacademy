// Grade 3: grammar and mechanics: abstract and collective nouns, verb endings, commas in dates, places and letters,
// contractions, action and linking verbs, the four kinds of sentences, and spelling with -ck, -tch and -dge.

import { type Text, type TopicDef, t } from "@ga/content";
import { point, typed, typedGenerator } from "@ga/subject-english";
import { everyPair, everyTriple } from "../../levels/words.ts";
import { labelChoice } from "../../topics/steps.ts";
import { type Ask, askGenerator, gapFill, kinded, need, rows, topic } from "./kit.ts";

// Lines built from frames, so that each bank has a hundred sentences or more. Each is joined to the hand-written lines
// of its bank below.

/** lines joins built rows into the bar-separated lines a bank reads. */
const lines = (built: readonly (readonly string[])[]) => built.map((r) => r.join("|")).join("\n");

const feelingPeople = [
  ["The farmer", "farmer"],
  ["The little girl", "girl"],
  ["The old king", "king"],
  ["The puppy", "puppy"],
  ["The sailor", "sailor"],
  ["My cousin", "cousin"],
  ["The baker", "baker"],
  ["The teacher", "teacher"],
] as const;
const feelings = [
  "joy",
  "fear",
  "hope",
  "pride",
  "anger",
  "sadness",
  "delight",
  "surprise",
  "relief",
  "worry",
  "excitement",
  "calm",
  "wonder",
] as const;
const feelingEvents = [
  ["the letter arrived", "letter"],
  ["the bell rang", "bell"],
  ["the boat came back", "boat"],
  ["the train left", "train"],
  ["the gate opened", "gate"],
  ["the parcel came", "parcel"],
] as const;
const abstractBuilt = lines(
  everyTriple(feelingPeople, feelings, feelingEvents).map(([[who, person], feeling, [event, thing]]) => [
    `${who} felt ${feeling} when ${event}.`,
    feeling,
    person,
    thing,
  ]),
);

/** abstractFrames are sentences that can hold any abstract noun. */
const abstractFrames = ["Our class read a story about ___.", "The poem on the wall is about ___.", "We had a long talk about ___."];

const landGroups = [
  ["herd", "cows", "grazed"],
  ["flock", "sheep", "grazed"],
  ["swarm", "bees", "buzzed"],
  ["pack", "wolves", "howled"],
  ["pride", "lions", "rested"],
  ["colony", "ants", "marched"],
  ["troop", "monkeys", "played"],
  ["litter", "kittens", "slept"],
  ["gaggle", "geese", "waddled"],
] as const;
const landPlaces = [
  ["near the river", "river"],
  ["by the old barn", "barn"],
  ["beside the lake", "lake"],
  ["behind the hill", "hill"],
  ["across the field", "field"],
  ["near the road", "road"],
  ["under the trees", "trees"],
  ["at the edge of the forest", "forest"],
] as const;
const waterGroups = [
  ["school", "fish"],
  ["pod", "dolphins"],
  ["raft", "ducks"],
] as const;
const waterPlaces = [
  ["near the boat", "boat"],
  ["under the bridge", "bridge"],
  ["beside the rocks", "rocks"],
  ["close to the shore", "shore"],
  ["past the island", "island"],
  ["by the pier", "pier"],
] as const;
const collectiveBuilt = lines([
  ...everyPair(landGroups, landPlaces).map(([[group, members, verb], [place, noun]]) => [
    `A ${group} of ${members} ${verb} ${place}.`,
    group,
    members,
    noun,
  ]),
  ...everyPair(waterGroups, waterPlaces).map(([[group, members], [place, noun]]) => [
    `A ${group} of ${members} swam ${place}.`,
    group,
    members,
    noun,
  ]),
]);

const groupSubjects = [
  "The herd of cows",
  "The flock of sheep",
  "The swarm of bees",
  "The pack of wolves",
  "The pride of lions",
  "The colony of ants",
  "The troop of monkeys",
  "The litter of kittens",
  "The gaggle of geese",
  "The school of fish",
  "The pod of dolphins",
  "The team",
] as const;
const groupActs = [
  ["rests", "rest", "resting", "in the shade every afternoon"],
  ["moves", "move", "moving", "slowly in the morning"],
  ["stays", "stay", "staying", "close together at night"],
  ["gathers", "gather", "gathering", "near the water each day"],
  ["waits", "wait", "waiting", "for the rain to stop"],
  ["sleeps", "sleep", "sleeping", "after a long day"],
  ["travels", "travel", "traveling", "a long way each year"],
  ["hides", "hide", "hiding", "when danger comes"],
] as const;
const agreementBuilt = lines(
  everyPair(groupSubjects, groupActs).map(([who, [one, many, ing, rest]]) => [`${who} ___ ${rest}.`, one, many, ing]),
);

/** endingForms builds the -ed and -ing forms of a verb, with two wrong spellings of each, by its rule. */
const endingForms = (verb: string, rule: string): string[] => {
  const last = verb.slice(-1);
  const stem = verb.slice(0, -1);
  switch (rule) {
    case "double":
      return [`${verb}${last}ed`, `${verb}ed`, `${verb}t`, `${verb}${last}ing`, `${verb}ing`, `${verb}eing`];
    case "drop-e": {
      const c = stem.slice(-1);
      return [`${stem}ed`, `${verb}ed`, `${stem}${c}ed`, `${stem}ing`, `${verb}ing`, `${stem}${c}ing`];
    }
    case "y-to-i":
      return [`${stem}ied`, `${verb}ed`, `${stem}ed`, `${verb}ing`, `${stem}iing`, `${stem}ing`];
    case "keep-y":
      return [`${verb}ed`, `${stem}ied`, `${stem}id`, `${verb}ing`, `${stem}iing`, `${stem}ing`];
    default:
      return [`${verb}ed`, `${verb}${last}ed`, `${verb}t`, `${verb}ing`, `${verb}${last}ing`, `${verb}eing`];
  }
};
const moreEndingVerbs = [
  ["grab", "trip", "rub", "chop", "drag", "pat", "shop", "step", "wag", "jog", "tap", "beg", "mop", "ship"].map((v) => [v, "double"]),
  ["like", "use", "close", "share", "joke", "wipe", "chase", "glide", "rake", "trade", "bounce", "juggle", "tune"].map((v) => [
    v,
    "drop-e",
  ]),
  ["copy", "worry", "fry", "reply", "marry", "bury", "tidy", "empty"].map((v) => [v, "y-to-i"]),
  ["pray", "spray", "destroy", "delay", "obey", "annoy"].map((v) => [v, "keep-y"]),
  ["help", "wash", "pick", "push", "kick", "melt", "paint", "climb", "walk"].map((v) => [v, "plain"]),
].flat();
const endingBuilt = lines(moreEndingVerbs.map(([verb = "", rule = ""]) => [verb, rule, ...endingForms(verb, rule)]));

const commaOpeners = [
  "My aunt lives in",
  "We stayed in",
  "The parcel came from",
  "Our new friend moved here from",
  "The train stopped in",
  "My pen pal writes from",
  "The story takes place in",
] as const;
const commaPlaces = [
  "Madrid, Spain",
  "Lima, Peru",
  "Miami, Florida",
  "Osaka, Japan",
  "Vancouver, Canada",
  "Dallas, Texas",
  "Seoul, South Korea",
  "Berlin, Germany",
  "Mumbai, India",
  "Phoenix, Arizona",
] as const;
const commaEvents = [
  "The school fair is on",
  "The book sale began on",
  "My brother was born on",
  "Our class trip was on",
  "The museum opened on",
] as const;
const commaDates = ["May 4, 2026", "Tuesday, November 10, 2026", "February 14, 2025", "Saturday, June 6, 2026"] as const;
const commaBuilt = lines([
  ...everyPair(commaOpeners, commaPlaces).map(([opener, place]) => [`${opener} ${place}.`]),
  ...everyPair(commaEvents, commaDates).map(([event, date]) => [`${event} ${date}.`]),
]);

const moreGreetingNames = [
  "Aunt Lily",
  "Uncle Sam",
  "Grandma Rose",
  "Grandpa Joe",
  "Mrs. Park",
  "Mr. Diaz",
  "Ms. Green",
  "Coach Brown",
  "Leo",
  "Zoe",
  "Omar",
  "Priya",
  "Noah",
  "Ella",
  "Kai",
  "Ruby",
  "Jack",
  "Hana",
  "Luis",
  "Maya",
  "Ivy",
  "Finn",
  "Aria",
  "Theo",
  "Nora",
  "Eli",
  "Grace",
  "Owen",
  "Lucy",
  "Ravi",
  "Chloe",
  "Diego",
  "Amara",
  "Felix",
  "Sofia",
  "Jonah",
  "Mei",
  "Ali",
  "Rosa",
  "Tom",
] as const;
const moreClosings = [
  "Your brother|Your Brother",
  "Your sister|Your Sister",
  "Your classmate|Your Classmate",
  "Your neighbor|Your Neighbor",
  "Your teammate|Your Teammate",
  "Your student|Your Student",
  "Your son|Your Son",
  "Your daughter|Your Daughter",
  "Your buddy|Your Buddy",
  "Love and hugs|Love And Hugs",
  "With thanks|With Thanks",
  "Warm wishes|Warm Wishes",
  "All my love|All My Love",
  "Many thanks|Many Thanks",
  "Best regards|Best Regards",
  "Kind regards|Kind Regards",
  "Talk soon|Talk Soon",
  "Write soon|Write Soon",
  "Miss you|Miss You",
  "Your biggest fan|Your Biggest Fan",
  "Cheers|Cheers",
  "Thanks|Thanks",
  "Fondly|Fondly",
  "Your old friend|Your Old Friend",
  "Your best friend|Your Best Friend",
  "Your pen pal|Your Pen Pal",
  "Lots of love|Lots Of Love",
  "Have fun|Have Fun",
] as const;

/** moreContractions are more pairs of words, each with its contraction, two wrong spellings and a sentence that uses the words. */
const moreContractions = rows(`
  he would|he'd|hed|he'ld|I think he would like the book.
  she would|she'd|shed|she'ld|She would rather walk home.
  we would|we'd|wed|we'ld|We would love to come.
  they would|they'd|theyd|they'ld|They would help if you asked.
  you would|you'd|youd|you'ld|You would enjoy the show.
  it will|it'll|itll|it'l|It will rain later.
  she will|she'll|shell|she'l|She will be here soon.
  we will|we'll|well|we'l|We will win next time.
  that will|that'll|thatll|tha'll|That will be fun.
  who will|who'll|wholl|who'l|Who will feed the fish?
  where is|where's|wheres|whe'res|Where is my hat?
  here is|here's|heres|her'es|Here is your pencil.
  how is|how's|hows|ho'ws|How is your grandma?
  when is|when's|whens|whe'ns|When is the party?
  must not|mustn't|mustnt|must'nt|You must not touch the stove.
  need not|needn't|neednt|need'nt|You need not bring lunch.
  he has|he's|hes|he'has|He has lost his key.
  she has|she's|shes|she'has|She has finished her work.
  it has|it's|its|it'has|It has stopped snowing.
  I had|I'd|Id|I'hd|I had never seen a whale before.
  we had|we'd|wed|we'hd|We had just left when it rained.
  they have|they've|theyve|they'v|They have gone to the park.
  who would|who'd|whod|who'ld|Who would like some soup?
  could have|could've|couldve|could'v|We could have won.
  should have|should've|shouldve|should'v|I should have asked first.
  would have|would've|wouldve|would'v|She would have liked the cake.
  might not|mightn't|mightnt|might'nt|It might not snow after all.
  there will|there'll|therell|there'l|There will be a test on Friday.
  what will|what'll|whatll|wha'll|What will we eat?
  it would|it'd|itd|it'ld|It would be nice to swim.
  you had|you'd|youd|you'hd|You had better hurry.
  he had|he'd|hed|he'hd|He had forgotten his coat.
  there has|there's|theres|ther'es|There has been a mistake.
  I would|I'd|Id|I'ld|I would like a glass of water.
  are not|aren't|arent|are'nt|The shops are not open yet.
  is not|isn't|isnt|is'nt|The bus is not here yet.
`);

const itsAnimals = ["dog", "cat", "fox", "puppy", "kitten", "pony"] as const;
const itsActs = ["licked ___ paw", "shook ___ fur", "wagged ___ tail"] as const;
const itsStates = ["too cold to swim", "time for lunch", "going to snow", "a good idea", "very late", "Sam's turn"] as const;
const theirGroups = ["The kids", "The players", "The twins"] as const;
const theirActs = ["packed ___ bags", "washed ___ hands", "found ___ seats"] as const;
const theyreAdjs = ["ready", "on time", "happy"] as const;
const thereThings = ["boxes", "chairs", "boots", "books", "plates", "toys", "bags", "cups", "coats"] as const;
const yourThings = ["coat", "lunch", "ticket", "library book", "water bottle", "scarf", "pencil case", "homework", "hat"] as const;
const yourAdjs = ["right", "tired", "hungry"] as const;
const openers3 = ["I think", "Mom says", "I hope"] as const;
const whoseThings = ["kite", "coat", "pencil", "ball", "lunch box", "drawing"] as const;
const whosDoings = ["coming to lunch", "ready for the game", "at the gate", "making that noise", "next in line", "on the phone"] as const;
const possessiveBuilt = lines([
  ...everyPair(itsAnimals, itsActs).map(([animal, act]) => [`The ${animal} ${act}.`, "its", "it's", "its'"]),
  ...everyPair(openers3, itsStates).map(([opener, state]) => [`${opener} ___ ${state}.`, "it's", "its", "its'"]),
  ...everyPair(theirGroups, theirActs).map(([who, act]) => [`${who} ${act}.`, "their", "there", "they're"]),
  ...everyPair(openers3, theyreAdjs).map(([opener, adj]) => [`${opener} ___ ${adj}.`, "they're", "their", "there"]),
  ...thereThings.map((thing) => [`Put the ${thing} over ___.`, "there", "their", "they're"]),
  ...yourThings.map((thing) => [`Please bring ___ ${thing}.`, "your", "you're", "youre"]),
  ...everyPair(openers3, yourAdjs).map(([opener, adj]) => [`${opener} ___ ${adj}.`, "you're", "your", "youre"]),
  ...whoseThings.map((thing) => [`___ ${thing} is this?`, "Whose", "Who's", "Whos"]),
  ...whosDoings.map((doing) => [`___ ${doing}?`, "Who's", "Whose", "Whos"]),
]);

const actionSubjects = ["The baker", "My brother", "The fisherman", "Our teacher", "The pilot", "The gardener"] as const;
const actionActs = [
  "**carried** a basket of bread",
  "**opened** the heavy door",
  "**painted** the fence blue",
  "**fixed** the broken chair",
  "**cleaned** the windows",
  "**caught** the bus",
] as const;
const linkingActs = [
  "**was** tired after work",
  "**seemed** happy today",
  "**looked** worried",
  "**felt** cold in the wind",
  "**became** a friend of ours",
  "**is** very busy",
] as const;
const notVerbScenes = [
  ["The **tall** tree", "swayed"],
  ["The **red** kite", "flew"],
  ["A **happy** dog", "barked"],
  ["The **old** clock", "ticked"],
  ["The **little** boat", "drifted"],
  ["A **cold** wind", "blew"],
] as const;
const notVerbEnds = ["in the morning", "near the river", "all afternoon"] as const;
const verbKindBuilt = lines([
  ...everyPair(actionSubjects, actionActs).map(([who, act]) => [`${who} ${act}.`, "action verb"]),
  ...everyPair(actionSubjects, linkingActs).map(([who, act]) => [`${who} ${act}.`, "linking verb"]),
  ...everyPair(notVerbScenes, notVerbEnds).map(([[scene, verb], end]) => [`${scene} ${verb} ${end}.`, "not a verb"]),
]);

const linkedSubjects = [
  ["The baker", "baker"],
  ["The puppy", "puppy"],
  ["My aunt", "aunt"],
  ["The pilot", "pilot"],
  ["The children", "children"],
  ["The old man", "man"],
] as const;
const linkedStates = [
  ["seemed", "tired"],
  ["looked", "happy"],
  ["felt", "cold"],
  ["was", "hungry"],
  ["became", "quiet"],
  ["grew", "sleepy"],
  ["looked", "proud"],
  ["seemed", "nervous"],
  ["felt", "warm"],
  ["was", "excited"],
  ["became", "calm"],
  ["seemed", "lonely"],
] as const;
const linkedPlaces = [
  ["at the station", "station"],
  ["by the lake", "lake"],
  ["in the garden", "garden"],
  ["after the trip", "trip"],
  ["near the window", "window"],
  ["on the bus", "bus"],
] as const;
const linkedBuilt = lines(
  everyTriple(linkedSubjects, linkedStates, linkedPlaces).map(([[who, noun], [verb, adj], [place, thing]]) => [
    `${who} ${verb} ${adj} ${place}.`,
    adj,
    noun,
    thing,
  ]),
);

/** kindNouns are a thing, an adjective that describes it, a different adjective and a verb that does something to it. */
const kindNouns = [
  ["kite", "red", "blue", "fly"],
  ["garden", "big", "green", "water"],
  ["puppy", "sleepy", "small", "feed"],
  ["castle", "tall", "dark", "draw"],
  ["train", "fast", "long", "watch"],
  ["cake", "sweet", "soft", "cut"],
  ["boat", "slow", "white", "paint"],
  ["box", "heavy", "full", "open"],
  ["drum", "loud", "new", "play"],
  ["window", "dirty", "wide", "close"],
  ["lamp", "bright", "broken", "fix"],
  ["map", "useful", "torn", "fold"],
  ["shell", "pretty", "pink", "find"],
  ["bike", "shiny", "fast", "ride"],
  ["tent", "warm", "dry", "pack"],
  ["garden gate", "rusty", "narrow", "shut"],
  ["soup", "hot", "thick", "stir"],
  ["picture", "funny", "bright", "hang"],
] as const;
const upper = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const kindBuilt = lines(
  kindNouns.flatMap(([noun, adj, other, verb]) => [
    [`The ${noun} is ${adj}.`, "statement"],
    [`Is the ${noun} ${other}?`, "question"],
    [`What a ${adj} ${noun}!`, "exclamation"],
    [`Please ${verb} the ${noun}.`, "command"],
  ]),
);

/** moreSpellRows are more words that end in the sounds /k/, /ch/ and /j/, each with its rule and a sentence. */
const moreSpellRows = rows(`
  ck|kick|Give the ball a hard ___.
  ck|brick|He laid one ___ on top of another.
  ck|snack|I eat an apple as a ___ after school.
  ck|track|The runners raced around the ___.
  ck|deck|We sat on the ___ of the ship.
  ck|check|Please ___ your answers before you hand them in.
  ck|lock|Turn the key in the ___.
  ck|knock|I heard a ___ at the door.
  ck|luck|Good ___ on your test!
  ck|chick|The little ___ hatched from its egg.
  ck|crack|There is a ___ in the glass.
  ck|pack|Please ___ your bag for the trip.
  ck|thick|The dictionary is a very ___ book.
  ck|quick|The rabbit made a ___ jump.
  k|park|We played on the swings at the ___.
  k|fork|Eat your salad with a ___.
  k|tank|The fish swim in a glass ___.
  k|pink|She wore a ___ dress.
  k|sink|Wash the cups in the ___.
  k|bank|I keep my coins in a piggy ___.
  k|shark|A ___ swam near the boat.
  k|mask|He wore a lion ___ in the play.
  k|snake|A long ___ slid under the rock.
  k|joke|Dad told a funny ___.
  k|rake|Use the ___ to gather the leaves.
  k|week|There are seven days in a ___.
  tch|hatch|The eggs will ___ in the spring.
  tch|pitch|The coach asked me to ___ the ball.
  tch|stitch|Grandma sewed one more ___.
  tch|switch|Flip the ___ to turn on the light.
  tch|scratch|The cat left a ___ on my arm.
  tch|stretch|We ___ before we run.
  tch|hutch|Our rabbit lives in a ___.
  tch|latch|Close the ___ on the gate.
  tch|batch|Mom baked a ___ of cookies.
  tch|crutch|He walked with a ___ after he hurt his leg.
  tch|notch|Cut a ___ in the stick.
  tch|witch|The ___ in the story rode a broom.
  ch|reach|I can't ___ the top shelf.
  ch|couch|We sat on the ___ to watch TV.
  ch|porch|Grandpa sat on the front ___.
  ch|branch|A bird sat on the ___.
  ch|punch|We drank fruit ___ at the party.
  ch|crunch|I heard the leaves ___ under my feet.
  ch|speech|She gave a ___ to the class.
  ch|torch|He lit a ___ to see in the cave.
  ch|march|The band will ___ down the street.
  ch|launch|They will ___ the rocket tomorrow.
  dge|ridge|We walked along the ___ of the mountain.
  dge|nudge|Give your friend a gentle ___.
  dge|smudge|There is a ___ of paint on my nose.
  dge|wedge|Put a ___ under the door.
  dge|dodge|Try to ___ the ball.
  dge|lodge|We stayed in a ___ in the woods.
  dge|ledge|A bird sat on the window ___.
  dge|trudge|We had to ___ through the deep snow.
  ge|age|What is your ___?
  ge|charge|Plug in the phone to ___ it.
  ge|hinge|The door ___ needs oil.
  ge|orange|I peeled an ___ for lunch.
  ge|strange|We heard a ___ noise.
  ge|range|The mountain ___ is covered in snow.
  ge|bulge|The bag had a ___ where the ball was.
  ge|plunge|The divers ___ into the pool.
`);

/** spellForms gives the start of a word and two wrong spellings of its ending, by its rule. */
const spellForms = (rule: string, word: string): [start: string, w1: string, w2: string] => {
  switch (rule) {
    case "ck": {
      const s = word.slice(0, -2);
      return [s, `${s}k`, `${s}ch`];
    }
    case "k": {
      if (word.endsWith("e")) {
        const s = word.slice(0, -2);
        return [s, `${s}cke`, `${s}ck`];
      }
      const s = word.slice(0, -1);
      return [s, `${s}ck`, `${s}c`];
    }
    case "tch": {
      const s = word.slice(0, -3);
      return [s, `${s}ch`, `${s}dge`];
    }
    case "ch": {
      const s = word.slice(0, -2);
      return [s, `${s}tch`, `${s}ge`];
    }
    case "dge": {
      const s = word.slice(0, -3);
      return [s, `${s}ge`, `${s}tch`];
    }
    default: {
      const s = word.slice(0, -2);
      return [s, `${s}dge`, `${s}tch`];
    }
  }
};
const spellBuilt = lines(
  moreSpellRows.map(([rule = "", word = "", sentence = ""]) => {
    const [start, w1, w2] = spellForms(rule, word);
    return [sentence, word, w1, w2, rule, start];
  }),
);

// Abstract nouns: sentence|abstract noun|concrete noun|concrete noun.

const abstractRows = rows(`
  The knight showed great courage when he faced the dragon.|courage|knight|dragon
  Our friendship began on the first day of school.|friendship|day|school
  The farmer felt joy when the rain came.|joy|farmer|rain
  The fox was known for his honesty in the village.|honesty|fox|village
  Grandpa told the children about his childhood on the farm.|childhood|children|farm
  The tortoise crossed the field with great patience.|patience|tortoise|field
  The girl's kindness made the old man smile.|kindness|girl|man
  The bird sang with happiness in the tree.|happiness|bird|tree
  My sister has a lot of curiosity about the stars.|curiosity|sister|stars
  The prince shared his wisdom with the people.|wisdom|prince|people
  The mouse felt fear when the cat came near the door.|fear|mouse|door
  The puppy brought great comfort to the sick boy.|comfort|puppy|boy
  The crowd cheered for the freedom of the birds when the cage opened.|freedom|crowd|cage
  The lion's pride kept him from asking the mouse for help.|pride|lion|mouse
  The boy's anger faded when his brother said sorry.|anger|boy|brother
  The baker's generosity fed the whole village.|generosity|baker|village
  The goose's beauty amazed the people at the pond.|beauty|goose|pond
  The little crab felt loneliness on the empty beach.|loneliness|crab|beach
  The old woman's love for her garden showed in every flower.|love|woman|flower
  The king rewarded the shepherd for his loyalty.|loyalty|king|shepherd
  A feeling of hope filled the sailors when they saw land.|hope|sailors|land
  The crow used her intelligence to drink from the jar.|intelligence|crow|jar
  The children laughed with delight at the clown's silly hat.|delight|children|hat
  The fisherman's greed cost him his golden fish.|greed|fisherman|fish
  Mia felt surprise when she opened the box of crayons.|surprise|box|crayons
  The hare's laziness let the tortoise win.|laziness|hare|tortoise
  The family sat in peace by the warm fire.|peace|family|fire
  The judge was known for her fairness to everyone in the town.|fairness|judge|town
  The athlete's strength helped her lift the heavy log.|strength|athlete|log
  The rabbit's speed helped it escape the fox.|speed|rabbit|fox
  The students showed respect to the visitor from the museum.|respect|students|visitor
  The boy's sadness disappeared when his dog came home.|sadness|boy|dog
${abstractBuilt}
`).map((row) => need(row, 4));

const abstractBank: readonly Ask[] = abstractRows.map(([shown = "", right = "", c1 = "", c2 = ""]) => ({
  question: t("Which noun in this sentence is abstract?", "这个句子里哪个名词是抽象名词？"),
  shown,
  right,
  wrong: [c1, c2],
  why: t(
    `*${right}* is abstract: it names a feeling, an idea or a quality, something you cannot see, hear or touch. The other nouns name people, animals, places or things you could point to.`,
    `*${right}* 是抽象名词：它表示一种感受、想法或品质，是看不见、听不到、摸不着的。其他名词指的是能指出来的人、动物、地方或东西。`,
  ),
  whyNot: [c1, c2].map((c) =>
    t(
      `*${c}* is a concrete noun: it names something you could see or touch. An abstract noun names a feeling or an idea.`,
      `*${c}* 是具体名词：它指的是能看见或摸到的东西。抽象名词表示感受或想法。`,
    ),
  ),
}));

// Forming abstract nouns: sentence with a gap|the word to start from|the abstract noun|wrong|wrong.

const formingRows = rows(`
  The firefighter was famous for her ___.|brave|bravery|braveness|bravedom
  The birds flew out of the cage to their ___.|free|freedom|freeness|freeship
  You have a ___ between the red kite and the blue one.|choose|choice|choosement|choosing
  The puppy filled the house with ___.|happy|happiness|happyness|happiment
  Thank you for your ___ to the new girl.|kind|kindness|kindity|kindship
  The old owl was known for her ___.|wise|wisdom|wiseness|wisity
  The judge praised the boy for his ___.|honest|honesty|honestness|honestment
  Their ___ lasted for many years.|friend|friendship|friendness|friendhood
  Grandma loves to talk about her ___ in the mountains.|child|childhood|childship|childness
  The giant was proud of his great ___.|strong|strength|strongness|strongth
  We measured the ___ of the table with a ruler.|long|length|longness|longth
  Always tell the ___, even when it is hard.|true|truth|trueness|truety
  A feeling of ___ came over me when my friend moved away.|sad|sadness|sadity|saddom
  The empty house filled the old man with ___.|lonely|loneliness|lonelyness|lonelity
  Her ___ led her to open the strange box.|curious|curiosity|curiousness|curiousity
  Fishing takes a lot of ___.|patient|patience|patientness|patiency
  The dog showed great ___ to its owner.|loyal|loyalty|loyalness|loyalship
  The coach is known for her ___ to every player.|fair|fairness|fairity|fairdom
  The class talked about ___ for boys and girls.|equal|equality|equalness|equalty
  It is my ___ that we can win the game.|believe|belief|believement|believing
  Her face glowed with ___ when she won the prize.|proud|pride|proudness|proudity
  The giant shouted in ___ when the boy stole his hen.|angry|anger|angriness|angriment
  The ___ of the crowd grew as the race began.|excite|excitement|excitation|excitness
  The two friends came to an ___ about the game.|agree|agreement|agreeness|agreeance
  We read for ___, not for a test.|enjoy|enjoyment|enjoyness|enjoyance
  The ___ of the sunflower surprised everyone.|grow|growth|growment|growness
  Books give us ___ about the world.|know|knowledge|knowment|knowness
  The team celebrated its ___ with a party.|succeed|success|succeedment|succeedness
  The story came from the writer's ___.|imagine|imagination|imaginement|imagineness
  The king's ___ helped many poor families.|generous|generosity|generousness|generousity
  The library was full of ___.|silent|silence|silentness|silency
  The teacher spoke about the ___ of sleep.|important|importance|importantness|importancy
  We felt the ___ of the fire on our faces.|warm|warmth|warmness|warmity
  The ___ of the lake surprised the divers.|deep|depth|deepness|deepth
`).map((row) => need(row, 5));

const formingBank = formingRows.flatMap(([sentence = "", base = "", noun = "", w1 = "", w2 = ""]) =>
  [sentence, ...abstractFrames].map((frame) => typed(`${frame} (${base})`, noun, [w1, w2, base])),
);

const formingBase = new Map(formingRows.map(([, base = "", noun = ""]) => [noun, base]));

// Collective nouns: sentence|collective noun|noun|noun.

const collectiveRows = rows(`
  A herd of goats climbed the rocky hill.|herd|goats|hill
  A flock of geese flew over the lake.|flock|geese|lake
  The team won the game on Saturday.|team|game|Saturday
  Our class planted a tree beside the library.|class|tree|library
  A swarm of bees buzzed around the hive.|swarm|bees|hive
  A pack of wolves howled at the moon.|pack|wolves|moon
  The band played music in the park.|band|music|park
  A school of fish swam under the boat.|school|fish|boat
  The crowd cheered for the runners at the finish line.|crowd|runners|line
  The family ate dinner on the porch.|family|dinner|porch
  A pride of lions rested under a tree.|pride|lions|tree
  A bunch of grapes hung from the vine.|bunch|grapes|vine
  The audience clapped for the singer on the stage.|audience|singer|stage
  The army marched across the bridge to the city.|army|bridge|city
  A colony of ants built a nest under the porch.|colony|ants|porch
  The orchestra played a song for the queen.|orchestra|song|queen
  A litter of puppies slept in the basket.|litter|puppies|basket
  The committee chose a name for the new park.|committee|name|park
  A crew of sailors cleaned the deck of the ship.|crew|sailors|ship
  A gaggle of geese waddled across the road.|gaggle|geese|road
  A troop of monkeys swung through the trees.|troop|monkeys|trees
  The choir sang carols in the hall.|choir|carols|hall
  A bouquet of roses sat on the table.|bouquet|roses|table
  The club meets in the gym on Mondays.|club|gym|Mondays
  A pod of whales swam past the island.|pod|whales|island
  The staff of the zoo fed the animals at noon.|staff|zoo|animals
  A stack of books leaned against the wall.|stack|books|wall
  The jury listened to the story of the farmer.|jury|story|farmer
  A fleet of ships sailed into the harbor.|fleet|ships|harbor
  A group of children waited at the bus stop.|group|children|stop
  A pile of leaves covered the garden path.|pile|leaves|path
  A string of beads hung around her neck.|string|beads|neck
${collectiveBuilt}
`).map((row) => need(row, 4));

const collectiveBank: readonly Ask[] = collectiveRows.map(([shown = "", right = "", members = "", other = ""]) => ({
  question: t(
    "Which word in this sentence is a collective noun, naming a group as one thing?",
    "这个句子里哪个词是集合名词，把一个群体当作一个整体来称呼？",
  ),
  shown,
  right,
  wrong: [members, other],
  why: t(
    `*${right}* is the collective noun: it names a whole group as one thing. You can have one ${right}, even though it is made of many members.`,
    `*${right}* 是集合名词：它把整个群体当作一个整体来称呼。虽然它由许多成员组成，但可以说“一个 ${right}”。`,
  ),
  whyNot: [
    t(
      `*${members}* is a noun in the sentence, but it does not name a group as one thing; it names people, animals or things one by one.`,
      `*${members}* 是句中的名词，但它不是把群体当作整体来称呼，而是指一个个的人、动物或东西。`,
    ),
    t(
      `*${other}* is a noun, but it names a single thing, a place or a time, not a group of members.`,
      `*${other}* 是名词，但它指的是一个东西、地方或时间，而不是由成员组成的群体。`,
    ),
  ],
}));

const agreement = kinded(
  ["Which verb agrees with the collective noun?", "哪个动词与集合名词一致？"],
  (right, shown) => [
    `${gapFill(shown, right)} A collective noun names one group acting together, so it takes the singular verb *${right}*.`,
    `${gapFill(shown, right)} 集合名词指一个共同行动的群体，所以要用单数动词 *${right}*。`,
  ],
  [
    [
      "*{wrong}* is the verb for a plural subject. The group acts as one, so the sentence needs *{right}*.",
      "*{wrong}* 是复数主语用的动词。这个群体是作为一个整体行动的，所以句子要用 *{right}*。",
    ],
    [
      "*{wrong}* cannot be the main verb of the sentence on its own; the sentence needs *{right}*.",
      "*{wrong}* 不能单独做句子的谓语动词，句子要用 *{right}*。",
    ],
  ],
);

const agreementBank: readonly Ask[] = rows(`
  The flock of geese ___ flying south for the winter.|is|are|be
  The team ___ every Saturday morning.|practices|practice|practicing
  Our class ___ a trip to the zoo next week.|is taking|are taking|taking
  A swarm of bees ___ near the flowers.|buzzes|buzz|buzzing
  The band ___ in the park on Sundays.|plays|play|playing
  The family ___ dinner together each night.|eats|eat|eating
  The crowd ___ loudly when the runner wins.|cheers|cheer|cheering
  A pack of wolves ___ through the snowy forest.|runs|run|running
  A herd of elephants ___ to the water hole every evening.|walks|walk|walking
  The audience ___ quiet during the song.|was|were|be
  The army ___ ready to march at dawn.|is|are|be
  A school of fish ___ past the coral.|swims|swim|swimming
  The choir ___ beautifully at every concert.|sings|sing|singing
  A colony of ants ___ a nest under the rock.|builds|build|building
  The committee ___ once a month.|meets|meet|meeting
  The crew ___ the ship before each trip.|checks|check|checking
  A litter of kittens ___ in the barn.|sleeps|sleep|sleeping
  The orchestra ___ a new piece tonight.|is playing|are playing|playing
  A troop of monkeys ___ in the tall trees.|lives|live|living
  The jury ___ to every word.|listens|listen|listening
  A fleet of boats ___ the harbor each morning.|leaves|leave|leaving
  The club ___ new members every fall.|welcomes|welcome|welcoming
  A pride of lions ___ in the shade at noon.|rests|rest|resting
  The staff ___ the animals at noon.|feeds|feed|feeding
  A pod of dolphins ___ beside our boat yesterday.|was swimming|were swimming|swimming
  The group ___ at the bus stop every day.|waits|wait|waiting
  A bunch of bananas ___ on the counter.|sits|sit|sitting
  The crowd ___ the street after the parade.|fills|fill|filling
  A flock of sheep ___ on the green hill.|grazes|graze|grazing
  The class ___ excited about the play.|is|are|be
  Our team ___ won three games this year.|has|have|having
  The band ___ been practicing for weeks.|has|have|having
${agreementBuilt}
`).map((row) => agreement(need(row, 4)));

// Adding -ed and -ing: verb|rule|-ed form|wrong|wrong|-ing form|wrong|wrong.

const endingRows = rows(`
  stop|double|stopped|stoped|stopt|stopping|stoping|stopeing
  clap|double|clapped|claped|clapt|clapping|claping|clapeing
  hop|double|hopped|hoped|hopt|hopping|hoping|hopeing
  plan|double|planned|planed|plannd|planning|planing|planeing
  skip|double|skipped|skiped|skipt|skipping|skiping|skipeing
  drip|double|dripped|driped|dript|dripping|driping|dripeing
  hug|double|hugged|huged|hugd|hugging|huging|hugeing
  nod|double|nodded|noded|nodd|nodding|noding|nodeing
  bake|drop-e|baked|bakeed|bakked|baking|bakeing|bakking
  smile|drop-e|smiled|smileed|smilled|smiling|smileing|smilling
  dance|drop-e|danced|danceed|dancced|dancing|danceing|dancking
  hope|drop-e|hoped|hopeed|hopped|hoping|hopeing|hopping
  wave|drop-e|waved|waveed|wavved|waving|waveing|wavving
  skate|drop-e|skated|skateed|skatted|skating|skateing|skatting
  race|drop-e|raced|raceed|racced|racing|raceing|raccing
  carry|y-to-i|carried|carryed|carred|carrying|carriing|carring
  cry|y-to-i|cried|cryed|crid|crying|criing|cring
  hurry|y-to-i|hurried|hurryed|hurred|hurrying|hurriing|hurring
  dry|y-to-i|dried|dryed|drid|drying|driing|dring
  study|y-to-i|studied|studyed|studed|studying|studiing|studing
  play|keep-y|played|plaied|plaid|playing|plaiing|plaing
  stay|keep-y|stayed|staied|staid|staying|staiing|staing
  enjoy|keep-y|enjoyed|enjoied|enjoid|enjoying|enjoiing|enjoing
  jump|plain|jumped|jumpped|jumpt|jumping|jumpping|jumpeing
  rain|plain|rained|rainned|raind|raining|rainning|raineing
  look|plain|looked|lookked|lookt|looking|lookking|lookeing
${endingBuilt}
`).map((row) => need(row, 8));

const endingRule = (verb: string, rule: string, ending: string): [string, string] => {
  switch (rule) {
    case "double":
      return [
        `*${verb}* ends in one short vowel and one consonant, so the last consonant is doubled before ${ending}.`,
        `*${verb}* 以一个短元音加一个辅音结尾，所以加 ${ending} 之前要双写最后的辅音字母。`,
      ];
    case "drop-e":
      return [
        `*${verb}* ends in a silent e, so the e is dropped before ${ending}, and nothing is doubled.`,
        `*${verb}* 以不发音的 e 结尾，所以加 ${ending} 之前去掉 e，也不双写辅音。`,
      ];
    case "y-to-i":
      return ending === "-ed"
        ? [
            `*${verb}* ends in a consonant and y, so the y changes to i before -ed.`,
            `*${verb}* 以辅音加 y 结尾，所以加 -ed 之前把 y 变成 i。`,
          ]
        : [
            `*${verb}* ends in a consonant and y, but the y stays before -ing, so that the word does not get two i's in a row.`,
            `*${verb}* 以辅音加 y 结尾，但加 -ing 时 y 保留不变，免得出现两个连在一起的 i。`,
          ];
    case "keep-y":
      return [
        `*${verb}* ends in a vowel and y, so the y stays and ${ending} is simply added.`,
        `*${verb}* 以元音加 y 结尾，所以 y 保留，直接加 ${ending}。`,
      ];
    default:
      return [
        `*${verb}* does not end in one short vowel and one consonant, a silent e or a y, so ${ending} is simply added.`,
        `*${verb}* 既不以一个短元音加一个辅音结尾，也不以不发音的 e 或 y 结尾，所以直接加 ${ending}。`,
      ];
  }
};

const endingItems = endingRows.flatMap(([verb = "", rule = "", ed = "", e1 = "", e2 = "", ing = "", i1 = "", i2 = ""]) => [
  { verb, rule, ending: "-ed", right: ed, wrong: [e1, e2] },
  { verb, rule, ending: "-ing", right: ing, wrong: [i1, i2] },
]);

const endingChoiceBank: readonly Ask[] = endingItems.map(({ verb, rule, ending, right, wrong }) => {
  const [en, zh] = endingRule(verb, rule, ending);
  return {
    question: t(`Which is the right spelling of *${verb}* with ${ending}?`, `*${verb}* 加上 ${ending} 后，哪个拼写是正确的？`),
    shown: "",
    right,
    wrong,
    why: t(`It is **${right}**. ${en}`, `正确的是 **${right}**。${zh}`),
    whyNot: wrong.map((w) => t(`*${w}* does not follow the rule. ${en}`, `*${w}* 不符合规则。${zh}`)),
  };
});

const endingTypedBank = endingItems.map(({ verb, ending, right, wrong }) => typed(`${verb} + ${ending}`, right, wrong));

const endingRuleOf = new Map(endingItems.map((i) => [i.right, i] as const));

// Commas in dates and places: the sentence with its commas; the learner sees it without them.

const commaSentences = rows(`
  My sister was born on June 12, 2019.
  Our school opened on September 3, 1998.
  The letter arrived on March 21, 2026.
  The first snow fell on December 2, 2025.
  Grandpa came to this country on April 9, 1975.
  The fair opens on Saturday, July 11, 2026.
  The play is on Friday, May 15, 2026.
  The pyramids of Giza are near Cairo, Egypt.
  My aunt lives in Austin, Texas.
  We visited the Great Wall near Beijing, China.
  The museum is in London, England.
  My pen pal lives in Sydney, Australia.
  The river flows past Paris, France.
  Our team played a game in Portland, Oregon.
  My cousin moved to Toronto, Canada.
  The parade is in Chicago, Illinois.
  We flew to Tokyo, Japan.
  The fossil was found near Calgary, Alberta.
  My uncle was born in Boston, Massachusetts.
  The book was written in Dublin, Ireland.
  The library opens on Monday, January 5, 2026.
  Our class trip is on Thursday, October 8, 2026.
  The bridge was finished on July 4, 1884.
  The first people landed on the moon on July 20, 1969.
  The letter came from Nairobi, Kenya.
  My grandma grew up in Rome, Italy.
  The concert will be held in Seattle, Washington.
  The first day of spring is March 20, 2026.
  We have a picnic every year in Denver, Colorado.
  Her birthday party is on Sunday, August 2, 2026.
  The giant panda was born in Chengdu, China.
  Our soccer camp starts on June 29, 2026.
  The new park opened on Wednesday, April 1, 2026.
${commaBuilt}
`).map((row) => need(row, 1)[0] ?? "");

const commaBank = commaSentences.map((right) => {
  const shown = right.replaceAll(",", "");
  const misplaced = right.replace(/([A-Z][a-z]+) (\d{1,2}), (\d{4})/, "$1, $2 $3");
  return typed(shown, right, misplaced === right ? [shown] : [shown, misplaced]);
});

// Greetings and closings of a friendly letter: the right one|wrong|wrong|what the second wrong one gets wrong.

const greetingBank: readonly Ask[] = rows(`
  Grandma
  Grandpa
  Aunt May
  Uncle Leo
  Mom
  Dad
  Sam
  Lily
  Ana
  Max
  Cousin Jo
  Nana
  Ben
  Mia
  Aunt Rosa
  Uncle Wei
`)
  .concat(moreGreetingNames.map((name) => [name]))
  .map(([name = ""]) => ({
    question: t(`Which greeting of a friendly letter to ${name} is written correctly?`, `给 ${name} 的一封友好书信，哪个称呼写得正确？`),
    shown: "",
    right: `Dear ${name},`,
    wrong: [`Dear ${name}.`, `Dear, ${name}`],
    why: t(
      `The greeting of a friendly letter begins with a capital letter and ends with a comma: **Dear ${name},**. The body of the letter starts on the next line.`,
      `友好书信的称呼以大写字母开头，以逗号结尾：**Dear ${name},**。正文从下一行开始。`,
    ),
    whyNot: [
      t(
        "A greeting is not a sentence, so it does not end with a period; it ends with a comma.",
        "称呼不是句子，所以不以句号结尾，而以逗号结尾。",
      ),
      t(
        `The comma goes after the name, at the end of the greeting, not between *Dear* and the name.`,
        "逗号放在名字后面、称呼的末尾，而不是放在 *Dear* 和名字之间。",
      ),
    ],
  }));

const closingBank: readonly Ask[] = rows(`
  Your friend|Your Friend
  Love|Love
  Your cousin|Your Cousin
  Sincerely|Sincerely
  Best wishes|Best Wishes
  Your grandson|Your Grandson
  Your granddaughter|Your Granddaughter
  Love always|Love Always
  See you soon|See You Soon
  Your pal|Your Pal
  Thank you again|Thank You Again
  With love|With Love
  Hugs|Hugs
  Your niece|Your Niece
  Your nephew|Your Nephew
  Take care|Take Care
${moreClosings.join("\n")}
`).map(([closing = "", capitals = ""]) => {
  const oneWord = !closing.includes(" ");
  return {
    question: t("Which closing of a friendly letter is written correctly?", "哪个友好书信的结束语写得正确？"),
    shown: "",
    right: `${closing},`,
    wrong: [`${closing}.`, oneWord ? closing : `${capitals},`],
    why: t(
      `A closing begins with a capital letter, only its first word has one, and it ends with a comma: **${closing},**. The writer's name goes on the line below it.`,
      `结束语以大写字母开头，只有第一个词大写，并以逗号结尾：**${closing},**。写信人的名字写在下一行。`,
    ),
    whyNot: [
      t("A closing is not a sentence, so it ends with a comma, not a period.", "结束语不是句子，所以以逗号结尾，而不是句号。"),
      oneWord
        ? t("A closing needs a comma after it, before the writer's name on the next line.", "结束语后面要有逗号，下一行再写写信人的名字。")
        : t(
            "Only the first word of a closing begins with a capital letter; the other words are lowercase.",
            "结束语只有第一个词的首字母大写，其他词都小写。",
          ),
    ],
  };
});

// Contractions: two words|contraction|wrong|wrong.

const contractionRows = rows(`
  do not|don't|dont|do'nt
  does not|doesn't|doesnt|does'nt
  did not|didn't|didnt|did'nt
  is not|isn't|isnt|is'nt
  are not|aren't|arent|are'nt
  was not|wasn't|wasnt|was'nt
  were not|weren't|werent|were'nt
  cannot|can't|cant|cann't
  will not|won't|willn't|wont
  could not|couldn't|couldnt|could'nt
  should not|shouldn't|shouldnt|should'nt
  would not|wouldn't|wouldnt|would'nt
  have not|haven't|havent|have'nt
  has not|hasn't|hasnt|has'nt
  I am|I'm|Im|Iam
  I will|I'll|Ill|I'l
  I have|I've|Ive|I'v
  you are|you're|youre|your
  you will|you'll|youll|you'l
  he is|he's|hes|he'is
  she is|she's|shes|she'is
  it is|it's|its|it'is
  we are|we're|were|we'are
  they are|they're|their|theyre
  they will|they'll|theyll|they'l
  we have|we've|weve|we'v
  let us|let's|lets|let'us
  that is|that's|thats|tha'ts
  what is|what's|whats|wha'ts
  there is|there's|theres|their's
  who is|who's|whose|whos
  I would|I'd|Id|I'ld
  you have|you've|youve|you'v
  he will|he'll|hell|he'l
`).map((row) => need(row, 4));

const contractionBank = [
  ...contractionRows.map(([words = "", short = "", w1 = "", w2 = ""]) => typed(words, short, [w1, w2, words])),
  ...moreContractions
    .filter(([words = ""]) => !contractionRows.some(([w]) => w === words))
    .map(([words = "", short = "", w1 = "", w2 = ""]) => typed(words, short, [w1, w2, words])),
  ...moreContractions.map(([words = "", short = "", w1 = "", w2 = "", sentence = ""]) =>
    typed(`${sentence} (${words})`, short, [w1, w2, words]),
  ),
];

/** wordsOf finds the two words a contraction item shows, alone or in brackets after a sentence. */
const wordsOf = (shown: string) => /\(([^)]+)\)$/.exec(shown)?.[1] ?? shown;

// Contractions or possessives: which word fits the gap.

const soundAlike: Readonly<Record<string, readonly [string, string]>> = {
  its: ["*its* means belonging to it, with no apostrophe", "*its* 表示“它的”，没有撇号"],
  "it's": ["*it's* is short for *it is* or *it has*", "*it's* 是 *it is* 或 *it has* 的缩写"],
  "its'": ["*its'* is not a word at all", "*its'* 根本不是一个词"],
  their: ["*their* means belonging to them", "*their* 表示“他们的”"],
  there: ["*there* names a place, or begins *there is*", "*there* 表示地点，或用于 *there is* 句型"],
  "they're": ["*they're* is short for *they are*", "*they're* 是 *they are* 的缩写"],
  your: ["*your* means belonging to you", "*your* 表示“你的”"],
  "you're": ["*you're* is short for *you are*", "*you're* 是 *you are* 的缩写"],
  youre: ["*youre* is missing the apostrophe of *you're*, so it is not a word", "*youre* 少了 *you're* 的撇号，所以不是一个词"],
  whose: ["*whose* asks or tells who something belongs to", "*whose* 询问或说明某物属于谁"],
  "who's": ["*who's* is short for *who is* or *who has*", "*who's* 是 *who is* 或 *who has* 的缩写"],
  whos: ["*whos* is missing the apostrophe of *who's*, so it is not a word", "*whos* 少了 *who's* 的撇号，所以不是一个词"],
};

const meaningOfWord = (word: string): readonly [string, string] => {
  const found = soundAlike[word.toLowerCase()];
  if (!found) throw new Error(`no meaning for ${word}`);
  return found;
};

const possessiveBank: readonly Ask[] = rows(`
  The dog wagged ___ tail.|its|it's|its'
  ___ going to rain this afternoon.|It's|Its|Its'
  The bird built ___ nest in the oak tree.|its|it's|its'
  I think ___ time for lunch.|it's|its|its'
  The river flooded ___ banks every summer.|its|it's|its'
  ___ been a long day at the museum.|It's|Its|Its'
  The castle lost ___ tower in the storm.|its|it's|its'
  Mom says ___ too cold to swim.|it's|its|its'
  The kids hung ___ coats on the hooks.|their|there|they're
  ___ coming to my party on Saturday.|They're|Their|There
  Put the books over ___ on the shelf.|there|their|they're
  I hope ___ not late for the bus.|they're|their|there
  The farmers sold ___ rice at the market.|their|there|they're
  ___ is a fox in the garden.|There|Their|They're
  Is this ___ backpack?|your|you're|youre
  ___ my best friend.|You're|Your|Youre
  Don't forget ___ lunch!|your|you're|youre
  I think ___ right about the map.|you're|your|youre
  Wash ___ hands before dinner.|your|you're|youre
  Tell me when ___ ready to go.|you're|your|youre
  ___ turn is it to feed the fish?|Whose|Who's|Whos
  ___ at the door?|Who's|Whose|Whos
  I know ___ bike this is.|whose|who's|whos
  ___ coming to the beach with us?|Who's|Whose|Whos
  The boy ___ kite flew highest won a prize.|whose|who's|whos
  Ask the man ___ selling the maps.|who's|whose|whos
  The cat licked ___ paw.|its|it's|its'
  ___ been raining all week.|It's|Its|Its'
  The children rode ___ bikes to the park.|their|there|they're
  We will meet you ___ at noon.|there|their|they're
  ___ playing music in the hall.|They're|Their|There
  Is that ___ dog barking?|your|you're|youre
  Let me know if ___ hungry.|you're|your|youre
  ___ painting is this?|Whose|Who's|Whos
${possessiveBuilt}
`).map((row) => {
  const [shown = "", right = "", w1 = "", w2 = ""] = need(row, 4);
  const [en, zh] = meaningOfWord(right);
  return {
    question: t("Which word completes the sentence?", "哪个词能补全句子？"),
    shown,
    right,
    wrong: [w1, w2],
    why: t(
      `${gapFill(shown, right)} Here ${en}, which is what the sentence needs. To test a contraction, say the two long words in its place.`,
      `${gapFill(shown, right)} 这里 ${zh}，正是句子需要的。检验缩写形式时，可以把它换成两个完整的词读一读。`,
    ),
    whyNot: [w1, w2].map((w) => {
      const [wen, wzh] = meaningOfWord(w);
      return t(`${wen.charAt(0).toUpperCase()}${wen.slice(1)}, which does not fit this sentence.`, `${wzh}，放进这个句子不合适。`);
    }),
  };
});

// Action and linking verbs.

const verbLabels = {
  "action verb": {
    zh: "行为动词",
    why: ["It tells what the subject does, an action you could see or hear.", "它说明主语做了什么，是能看到或听到的动作。"],
    not: [
      "An action verb tells what the subject does. This word does not show the subject doing anything.",
      "行为动词说明主语做了什么，这个词并没有表示主语在做什么动作。",
    ],
  },
  "linking verb": {
    zh: "系动词",
    why: [
      "It shows no action; it joins the subject to a word that names or describes it, like *is*, *was*, *seems* or *became*.",
      "它不表示动作，而是把主语和说明或描述主语的词连接起来，如 *is*、*was*、*seems*、*became*。",
    ],
    not: [
      "A linking verb joins the subject to a word that names or describes it. This word does not do that job.",
      "系动词把主语和说明或描述主语的词连接起来，这个词没有起这样的作用。",
    ],
  },
  "not a verb": {
    zh: "不是动词",
    why: [
      "The word in bold is a noun or an adjective: it names or describes something, and the verb is another word in the sentence.",
      "加粗的词是名词或形容词：它称呼或描述某物，句子的动词是另一个词。",
    ],
    not: [
      "The word in bold is the verb of the sentence: take it out and the sentence has no verb.",
      "加粗的词正是句子的动词：去掉它，句子就没有动词了。",
    ],
  },
} as const;

const verbKindLines = `
  The river **flowed** past the old city.|action verb
  The emperor **was** a wise ruler.|linking verb
  The workers **built** a long wall.|action verb
  The soup **smells** delicious.|linking verb
  The farmers **planted** millet in the spring.|action verb
  The bronze bell **looked** green with age.|linking verb
  The scholar **wrote** with a brush.|action verb
  The silk **felt** smooth and cool.|linking verb
  The guard **climbed** the watchtower.|action verb
  The night **became** cold and windy.|linking verb
  The children **are** excited about the festival.|linking verb
  The potter **shaped** the wet clay.|action verb
  The river **seems** calm today.|linking verb
  The dragon dancers **leaped** into the street.|action verb
  The **wall** stretched across the mountains.|not a verb
  The ancient **bowl** was made of bronze.|not a verb
  The **farmers** dug canals for the water.|not a verb
  The wall is **long** and strong.|not a verb
  The king **became** a great leader.|linking verb
  The ox **pulled** the heavy cart.|action verb
  The fields **were** yellow with grain.|linking verb
  The moth **spun** a silk cocoon.|action verb
  The tea **tasted** bitter.|linking verb
  The flood **swept** away the houses.|action verb
  I **am** a student of history.|linking verb
  The **silk** shone in the sun.|not a verb
  The soldiers **marched** along the wall.|action verb
  The sky **grew** dark before the storm.|linking verb
  The girl **is** proud of her painting.|linking verb
  The **bright** lanterns glowed.|not a verb
  The merchant **sold** silk at the market.|action verb
  The old map **seemed** strange to us.|linking verb
  The students **read** the old poem aloud.|action verb
${verbKindBuilt}
`;

const linked = kinded(
  ["Which word does the linking verb join to the subject, to name or describe it?", "系动词把哪个词和主语连接起来，用来说明或描述主语？"],
  (right, shown) => [
    `In "${shown}", the linking verb joins the subject to *${right}*, which tells what the subject is or is like.`,
    `在“${shown}”中，系动词把主语和 *${right}* 连接起来，说明主语是什么或怎么样。`,
  ],
  [
    ["*{wrong}* is the subject itself; the linking verb joins it to *{right}*.", "*{wrong}* 是主语本身，系动词把它和 *{right}* 连接起来。"],
    [
      "*{wrong}* is part of a later phrase; it does not name or describe the subject itself.",
      "*{wrong}* 是后面短语的一部分，并不说明或描述主语本身。",
    ],
  ],
);

const linkedBank: readonly Ask[] = rows(`
  The river was muddy after the flood.|muddy|river|flood
  The silk felt smooth in her hands.|smooth|silk|hands
  The old bell looked green with age.|green|bell|age
  The wall became famous around the world.|famous|wall|world
  The farmer seemed tired after the harvest.|tired|farmer|harvest
  The tea tasted bitter in the cup.|bitter|tea|cup
  The night became cold near the mountains.|cold|night|mountains
  My grandfather was a potter in his village.|potter|grandfather|village
  The watchtower on the hill is tall.|tall|watchtower|hill
  The children were happy at the festival.|happy|children|festival
  The soup smells spicy in the kitchen.|spicy|soup|kitchen
  The fields looked golden in the evening.|golden|fields|evening
  The dragon kite seemed huge in the sky.|huge|kite|sky
  Her brush strokes were neat on the paper.|neat|strokes|paper
  The scholar became a teacher in the capital.|teacher|scholar|capital
  The bronze pot felt heavy in my arms.|heavy|pot|arms
  The lanterns were red for the new year.|red|lanterns|year
  The road along the river is narrow.|narrow|road|river
  The village seemed quiet at dawn.|quiet|village|dawn
  Mei is a painter of birds.|painter|Mei|birds
  The water in the canal looked clear.|clear|water|canal
  The ox seemed strong enough to pull the cart.|strong|ox|cart
  The boy grew sleepy by the fire.|sleepy|boy|fire
  The cocoon felt soft in my hand.|soft|cocoon|hand
  The ruler was a woman of great courage.|woman|ruler|courage
  The noodles tasted salty at the market.|salty|noodles|market
  The flood was dangerous for the farms.|dangerous|flood|farms
  The mountains looked blue in the distance.|blue|mountains|distance
  The guards became nervous at midnight.|nervous|guards|midnight
  My sister is a dancer in the parade.|dancer|sister|parade
  The jade carving looked shiny under the lamp.|shiny|carving|lamp
  The poem seemed sad to the class.|sad|poem|class
${linkedBuilt}
`).map((row) => linked(need(row, 4)));

// The four kinds of sentences.

const kindLabels = {
  statement: {
    zh: "陈述句",
    why: ["It tells something and ends with a period.", "它陈述一件事，以句号结尾。"],
    not: [
      "A statement tells something and ends with a period; this sentence does something else.",
      "陈述句陈述一件事并以句号结尾，这个句子的作用不同。",
    ],
  },
  question: {
    zh: "疑问句",
    why: ["It asks something and ends with a question mark.", "它提出一个问题，以问号结尾。"],
    not: [
      "A question asks something and ends with a question mark; this sentence does not ask.",
      "疑问句提出问题并以问号结尾，这个句子并没有提问。",
    ],
  },
  command: {
    zh: "祈使句",
    why: [
      "It tells someone to do something; its subject, *you*, is left out, and it ends with a period or an exclamation mark.",
      "它要求别人做某事，省略了主语 *you*，以句号或感叹号结尾。",
    ],
    not: [
      "A command tells someone to do something and begins with what to do; this sentence does not give an order.",
      "祈使句要求别人做某事，开头就是要做的动作，这个句子并没有发出指令。",
    ],
  },
  exclamation: {
    zh: "感叹句",
    why: ["It shows strong feeling and ends with an exclamation mark.", "它表达强烈的感情，以感叹号结尾。"],
    not: [
      "An exclamation shows strong feeling and ends with an exclamation mark; this sentence does not burst out with feeling.",
      "感叹句表达强烈的感情并以感叹号结尾，这个句子没有表达强烈的感情。",
    ],
  },
} as const;

const kindLines = `
  The drum is made of wood and skin.|statement
  Can you play the violin?|question
  Hold the bow gently.|command
  What a beautiful song that was!|exclamation
  Our school has a band.|statement
  Where do you keep your flute?|question
  Please tune your guitar before the concert.|command
  How loud the trumpets are!|exclamation
  The piano has eighty-eight keys.|statement
  Who wrote this song?|question
  Clap along with the beat.|command
  Wow, you sang so well!|exclamation
  Stop banging on the pots!|command
  Do drums come in many sizes?|question
  A cello is bigger than a violin.|statement
  I can't believe we won the contest!|exclamation
  Listen to the high notes.|command
  Why does a tuba sound so low?|question
  My brother plays the trumpet in a band.|statement
  What a long concert that was!|exclamation
  Turn the music down, please.|command
  Is the concert on Friday?|question
  The choir sang three songs.|statement
  How happy the crowd looked!|exclamation
  Practice your scales every day.|command
  How many strings does a guitar have?|question
  Music can make people feel calm.|statement
  That was the best show ever!|exclamation
  Don't touch the drum skin with wet hands.|command
  Have you ever heard a sitar?|question
  The flute is a woodwind instrument.|statement
  Hooray, the band is here!|exclamation
  Bring your recorder to class tomorrow.|command
${kindBuilt}
`;

const asQuestion = t("Rewrite it as a question.", "把它改写成疑问句。");
const asStatement = t("Rewrite it as a statement.", "把它改写成陈述句。");
const asCommand = t("Rewrite it as a command.", "把它改写成祈使句。");
const asExclamation = t("Rewrite it as an exclamation that begins with *What*.", "把它改写成以 *What* 开头的感叹句。");

const kindOfRewrite = new Map<string, "question" | "statement" | "command" | "exclamation">();

const toQuestion = (shown: string, right: string) => {
  kindOfRewrite.set(right, "question");
  return typed(shown, right, [right.replace("?", "."), shown.replace(".", "?")], undefined, asQuestion);
};
const toStatement = (shown: string, right: string) => {
  kindOfRewrite.set(right, "statement");
  return typed(shown, right, [right.replace(".", "?"), shown.replace("?", ".")], undefined, asStatement);
};
const toCommand = (shown: string, right: string) => {
  kindOfRewrite.set(right, "command");
  return typed(shown, right, [shown, right.replace(".", "?")], [right.replace(/\.$/, "[.|!]")], asCommand);
};
const toExclamation = (shown: string, right: string, tail: string) => {
  kindOfRewrite.set(`${right}!`, "exclamation");
  return typed(shown, `${right}!`, [`${right}.`, shown.replace(".", "!")], [`${right}( ${tail})!`], asExclamation);
};

const rewriteBank = [
  toQuestion("The drum is loud.", "Is the drum loud?"),
  toQuestion("The band is playing tonight.", "Is the band playing tonight?"),
  toQuestion("The concert was long.", "Was the concert long?"),
  toQuestion("You can play the flute.", "Can you play the flute?"),
  toQuestion("The singers are ready.", "Are the singers ready?"),
  toQuestion("Mia will sing a song.", "Will Mia sing a song?"),
  toQuestion("The piano is out of tune.", "Is the piano out of tune?"),
  toQuestion("The children were excited.", "Were the children excited?"),
  toQuestion("Leo can read music.", "Can Leo read music?"),
  toQuestion("The tuba is heavy.", "Is the tuba heavy?"),
  toQuestion("The violins are in the case.", "Are the violins in the case?"),
  toQuestion("Sam will join the choir.", "Will Sam join the choir?"),
  toQuestion("The song is new.", "Is the song new?"),
  toStatement("Is the guitar new?", "The guitar is new."),
  toStatement("Are the drums loud?", "The drums are loud."),
  toStatement("Can Ana play the cello?", "Ana can play the cello."),
  toStatement("Was the show fun?", "The show was fun."),
  toStatement("Will the band march in the parade?", "The band will march in the parade."),
  toStatement("Is the flute made of silver?", "The flute is made of silver."),
  toCommand("You should hold the drumsticks loosely.", "Hold the drumsticks loosely."),
  toCommand("You should sit up straight when you sing.", "Sit up straight when you sing."),
  toCommand("You should clap on the beat.", "Clap on the beat."),
  toCommand("You should put the violin in its case.", "Put the violin in its case."),
  toCommand("You should listen to the conductor.", "Listen to the conductor."),
  toCommand("You should practice every day.", "Practice every day."),
  toExclamation("That is a loud drum.", "What a loud drum", "that is"),
  toExclamation("That was a long song.", "What a long song", "that was"),
  toExclamation("That is a beautiful voice.", "What a beautiful voice", "that is"),
  toExclamation("That was an exciting show.", "What an exciting show", "that was"),
  toExclamation("This is a huge tuba.", "What a huge tuba", "this is"),
  toExclamation("That was a funny dance.", "What a funny dance", "that was"),
  toExclamation("That is a sweet tune.", "What a sweet tune", "that is"),
  ...kindNouns.flatMap(([noun, adj, other, verb]) => [
    toQuestion(`The ${noun} is ${adj}.`, `Is the ${noun} ${adj}?`),
    toStatement(`Is the ${noun} ${other}?`, `The ${noun} is ${other}.`),
    toCommand(`You should ${verb} the ${noun}.`, `${upper(verb)} the ${noun}.`),
    toExclamation(`That is a ${adj} ${noun}.`, `What a ${adj} ${noun}`, "that is"),
  ]),
];

const rewriteWhy = (right: string): Text => {
  switch (kindOfRewrite.get(right)) {
    case "question":
      return t(
        `**${right}** A question moves the helping verb, such as *is*, *can* or *will*, in front of the subject and ends with a question mark.`,
        `**${right}** 疑问句把 *is*、*can*、*will* 等助动词移到主语前面，并以问号结尾。`,
      );
    case "exclamation":
      return t(
        `**${right}** An exclamation that begins with *What a* shows strong feeling and ends with an exclamation mark; *that is* may follow or be left out.`,
        `**${right}** 以 *What a* 开头的感叹句表达强烈的感情，以感叹号结尾；后面的 *that is* 可以加，也可以省略。`,
      );
    case "command":
      return t(
        `**${right}** A command begins with what to do; its subject, *you*, is understood, and it ends with a period, or an exclamation mark for a strong command.`,
        `**${right}** 祈使句以要做的动作开头，主语 *you* 被省略，以句号结尾，语气强烈时用感叹号。`,
      );
    default:
      return t(
        `**${right}** A statement puts the subject first, then the verb, and ends with a period.`,
        `**${right}** 陈述句先说主语，再说动词，以句号结尾。`,
      );
  }
};

// Spelling with -ck, -tch and -dge: sentence|word|wrong|wrong|rule|the start of the word.

const endingSpellRows = rows(`
  I threw a ___ for the dog to fetch.|stick|stik|stich|ck|sti
  A ___ swam across the pond.|duck|duk|duch|ck|du
  The ___ on the wall says it is noon.|clock|clok|cloc|ck|clo
  My cat has soft ___ fur.|black|blak|blac|ck|bla
  The big ___ carried bricks to the wall.|truck|truk|truc|ck|tru
  The giraffe has a very long ___.|neck|nek|nec|ck|ne
  I lost one ___ in the laundry.|sock|sok|soc|ck|so
  She sat on a smooth gray ___.|rock|rok|roc|ck|ro
  The ball hit me on the ___.|back|bak|bac|ck|ba
  We baked a ___ for Grandma's birthday.|cake|cacke|cack|k|ca
  I ride my ___ to school.|bike|bicke|bick|k|bi
  We swam in the cold ___.|lake|lacke|lack|k|la
  A cow gives us ___.|milk|milck|milc|k|mil
  I sat at my ___ to do my homework.|desk|desck|desc|k|des
  Gray ___ rose from the chimney.|smoke|smocke|smock|k|smo
  We took a long ___ up the mountain.|hike|hicke|hick|k|hi
  Grandma sewed a ___ over the hole in my jeans.|patch|pach|padge|tch|pa
  Can you ___ the ball?|catch|cach|cadge|tch|ca
  Strike a ___ to light the candle.|match|mach|madge|tch|ma
  Throw the stick and the dog will ___ it.|fetch|fech|fedge|tch|fe
  A bug bite can make your skin ___.|itch|ich|idge|tch|i
  She drew a quick ___ of the cat.|sketch|skech|skedge|tch|ske
  Water ran along the ___ beside the road.|ditch|dich|didge|tch|di
  The ___ on my wrist tells the time.|watch|wach|wadge|tch|wa
  We sat on a ___ in the park.|bench|bentch|benge|ch|ben
  I ate a sandwich for ___.|lunch|luntch|lunge|ch|lun
  We built sandcastles on the ___.|beach|beatch|beage|ch|bea
  A ___ is a soft, fuzzy fruit.|peach|peatch|peage|ch|pea
  The ___ blew her whistle to start the game.|coach|coatch|coage|ch|coa
  Our music teacher will ___ us a new song.|teach|teatch|teage|ch|tea
  Don't ___ your sister!|pinch|pintch|pinge|ch|pin
  We drove over the ___ across the river.|bridge|brige|britch|dge|bri
  The scout wore a ___ on her shirt.|badge|bage|batch|dge|ba
  Don't stand too close to the ___ of the cliff.|edge|ege|etch|dge|e
  Mom made chocolate ___ for the party.|fudge|fuge|futch|dge|fu
  A tall green ___ grew around the garden.|hedge|hege|hetch|dge|he
  The ___ listened to both sides.|judge|juge|jutch|dge|ju
  Turn to the next ___ of the book.|page|padge|patch|ge|pa
  The bird sang in its ___.|cage|cadge|catch|ge|ca
  An elephant is a ___ animal.|huge|hudge|hutch|ge|hu
  The actors stood on the ___.|stage|stadge|statch|ge|sta
  I ordered a ___ glass of juice.|large|lardge|larch|ge|lar
  The leaves ___ color in the fall.|change|chandge|chanch|ge|chan
  I used a ___ to wash the dishes.|sponge|spondge|sponch|ge|spon
${spellBuilt}
`).map((row) => need(row, 6));

const spellRule = (word: string, rule: string): readonly [string, string] => {
  switch (rule) {
    case "ck":
      return [
        `*${word}* has one short vowel just before the sound /k/ at its end, so the sound is spelled *ck*.`,
        `*${word}* 词尾 /k/ 音前面紧挨着一个短元音，所以这个音拼作 *ck*。`,
      ];
    case "k":
      return [
        `*${word}* has a long vowel or a consonant before the sound /k/, so the sound is spelled *k*, not *ck*.`,
        `*${word}* 的 /k/ 音前面是长元音或辅音，所以这个音拼作 *k*，而不是 *ck*。`,
      ];
    case "tch":
      return [
        `*${word}* has one short vowel just before the sound /ch/ at its end, so the sound is spelled *tch*.`,
        `*${word}* 词尾 /ch/ 音前面紧挨着一个短元音，所以这个音拼作 *tch*。`,
      ];
    case "ch":
      return [
        `*${word}* has a long vowel or a consonant before the sound /ch/, so the sound is spelled *ch*, not *tch*.`,
        `*${word}* 的 /ch/ 音前面是长元音或辅音，所以这个音拼作 *ch*，而不是 *tch*。`,
      ];
    case "dge":
      return [
        `*${word}* has one short vowel just before the sound /j/ at its end, so the sound is spelled *dge*.`,
        `*${word}* 词尾 /j/ 音前面紧挨着一个短元音，所以这个音拼作 *dge*。`,
      ];
    default:
      return [
        `*${word}* has a long vowel or a consonant before the sound /j/, so the sound is spelled *ge*, not *dge*.`,
        `*${word}* 的 /j/ 音前面是长元音或辅音，所以这个音拼作 *ge*，而不是 *dge*。`,
      ];
  }
};

const spellChoiceBank: readonly Ask[] = endingSpellRows.map(([shown = "", word = "", w1 = "", w2 = "", rule = ""]) => {
  const [en, zh] = spellRule(word, rule);
  return {
    question: t("Which spelling of the missing word is correct?", "所缺单词的哪种拼写是正确的？"),
    shown,
    right: word,
    wrong: [w1, w2],
    why: t(`${gapFill(shown, word)} ${en}`, `${gapFill(shown, word)} ${zh}`),
    whyNot: [
      t(`*${w1}* uses the spelling for the other side of the rule. ${en}`, `*${w1}* 用了规则另一种情况的拼写。${zh}`),
      t(
        `*${w2}* is not how the word this sentence needs is spelled: it breaks the rule or makes a different word.`,
        `*${w2}* 不是句子所需单词的拼法：它要么不符合规则，要么成了另一个词。`,
      ),
    ],
  };
});

const spellTypedBank = endingSpellRows.map(([shown = "", word = "", w1 = "", w2 = "", , start = ""]) =>
  typed(shown.replace("___", `${start}___`), word, [w1, w2]),
);

const spellRuleOf = new Map(endingSpellRows.map(([, word = "", , , rule = ""]) => [word, rule]));

/** grammarTopics are the grammar and mechanics topics of grade 3. */
export const grammarTopics: readonly TopicDef[] = [
  topic(
    "abstract-nouns",
    t("Abstract Nouns for Ideas and Feelings", "表示想法和感受的抽象名词"),
    t(
      "Nouns for feelings, ideas and qualities, which cannot be seen or touched, such as courage, honesty and friendship.",
      "表示感受、想法和品质的名词，看不见也摸不着，比如 courage、honesty 和 friendship。",
    ),
    ["nouns-and-pronouns"],
    [
      point(
        "concrete-or-abstract",
        t("Concrete or Abstract", "具体名词还是抽象名词"),
        t(
          "A **concrete noun** names something you can see, hear, touch, taste or smell: *knight*, *dragon*, *bread*. An **abstract noun** names a feeling, an idea or a quality that you cannot touch: *courage*, *friendship*, *honesty*.\n\nTo tell them apart, ask: could I put it in a box or take a picture of it? You can photograph a knight, but not his courage.",
          "**具体名词**指能看见、听到、摸到、尝到或闻到的东西：*knight*、*dragon*、*bread*。**抽象名词**表示摸不着的感受、想法或品质：*courage*、*friendship*、*honesty*。\n\n区分它们时可以问：我能把它放进盒子里或给它拍照吗？骑士可以拍照，他的勇气却不能。",
        ),
        askGenerator(abstractBank),
      ),
      point(
        "forming-abstract-nouns",
        t("Forming Abstract Nouns", "构成抽象名词"),
        t(
          "Many abstract nouns are made from an adjective or a verb with a suffix: *kind* → *kindness*, *free* → *freedom*, *friend* → *friendship*, *child* → *childhood*, *enjoy* → *enjoyment*, *imagine* → *imagination*, *honest* → *honesty*.\n\nSome change their spelling: *brave* → *bravery*, *wise* → *wisdom*, *strong* → *strength*, *true* → *truth*, *choose* → *choice*, *proud* → *pride*. When you are not sure, say the word in a sentence and listen for the one you have heard before.",
          "许多抽象名词由形容词或动词加后缀构成：*kind* → *kindness*，*free* → *freedom*，*friend* → *friendship*，*child* → *childhood*，*enjoy* → *enjoyment*，*imagine* → *imagination*，*honest* → *honesty*。\n\n有些会改变拼写：*brave* → *bravery*，*wise* → *wisdom*，*strong* → *strength*，*true* → *truth*，*choose* → *choice*，*proud* → *pride*。拿不准时，把词放进句子里读一读，找出你听过的那个。",
        ),
        typedGenerator(
          "word-form",
          t("Type the abstract noun made from the word in brackets, to fill the gap.", "输入由括号里的词构成的抽象名词，填入空格。"),
          formingBank,
          (right) =>
            t(
              `From *${formingBase.get(right) ?? ""}* comes the abstract noun **${right}**, the name of the quality or the idea. Learn the ending with the word, because the suffixes differ.`,
              `由 *${formingBase.get(right) ?? ""}* 构成的抽象名词是 **${right}**，表示这种品质或想法。要连同词尾一起记，因为后缀各不相同。`,
            ),
        ),
      ),
    ],
  ),
  topic(
    "collective-nouns",
    t("Collective Nouns", "集合名词"),
    t(
      "A noun that names a group as one thing, such as a herd of goats, a team or a class, and takes a singular verb when the group acts as one.",
      "把一个群体当作一个整体来称呼的名词，比如 a herd of goats、a team、a class；当群体作为整体行动时，用单数动词。",
    ),
    ["plural-nouns", "simple-verb-tenses"],
    [
      point(
        "finding-the-collective-noun",
        t("Finding the Collective Noun", "找出集合名词"),
        t(
          "A **collective noun** names a group as one thing: a *herd* of goats, a *flock* of geese, a *team* of players, a *class* of children. The group is made of many members, but the noun is singular: one herd, one team.\n\nIn *A herd of goats climbed the hill*, *goats* names the members one by one, and *herd* names them all as one group.",
          "**集合名词**把一个群体当作一个整体来称呼：a *herd* of goats，a *flock* of geese，a *team* of players，a *class* of children。群体由许多成员组成，但这个名词是单数：one herd，one team。\n\n在 *A herd of goats climbed the hill* 中，*goats* 指一只只的山羊，*herd* 把它们当作一个群体。",
        ),
        askGenerator(collectiveBank),
      ),
      point(
        "verbs-with-collective-nouns",
        t("Verbs with Collective Nouns", "集合名词的动词一致"),
        t(
          "When a group acts as one, its collective noun takes a **singular verb**: *The flock **is** flying south. The team **practices** on Saturday. The band **has** played for years.*\n\nDo not be fooled by a plural noun after *of*: in *A swarm of bees buzzes*, the subject is *swarm*, not *bees*.",
          "当群体作为一个整体行动时，集合名词用**单数动词**：*The flock **is** flying south. The team **practices** on Saturday. The band **has** played for years.*\n\n不要被 *of* 后面的复数名词迷惑：在 *A swarm of bees buzzes* 中，主语是 *swarm*，不是 *bees*。",
        ),
        askGenerator(agreementBank),
      ),
    ],
  ),
  topic(
    "adding-ed-and-ing",
    t("Adding -ed and -ing", "加 -ed 和 -ing"),
    t(
      "Spelling rules for verb endings: double the last consonant after one short vowel, drop a silent e, and change y to i before -ed but not before -ing.",
      "动词词尾的拼写规则：一个短元音后双写最后的辅音，去掉不发音的 e，辅音加 y 结尾的词在 -ed 前把 y 变 i，但在 -ing 前不变。",
    ),
    ["simple-verb-tenses"],
    [
      point(
        "choosing-the-spelling",
        t("Choosing the Spelling", "选择正确的拼写"),
        t(
          "Look at the end of the verb before you add *-ed* or *-ing*.\n\n- One short vowel and one consonant: double the consonant. *stop* → *stopped*, *stopping*.\n- A silent *e*: drop it. *bake* → *baked*, *baking*.\n- A consonant and *y*: change *y* to *i* before *-ed* only. *carry* → *carried*, but *carrying*.\n- A vowel and *y*: keep the *y*. *play* → *played*, *playing*.\n- Anything else: just add the ending. *jump* → *jumped*, *rain* → *raining*.\n\nThe rules matter: *hoped* comes from *hope*, but *hopped* comes from *hop*.",
          "加 *-ed* 或 *-ing* 之前，先看动词的结尾。\n\n- 一个短元音加一个辅音：双写辅音。*stop* → *stopped*、*stopping*。\n- 不发音的 *e*：去掉。*bake* → *baked*、*baking*。\n- 辅音加 *y*：只在 *-ed* 前把 *y* 变成 *i*。*carry* → *carried*，但 *carrying*。\n- 元音加 *y*：保留 *y*。*play* → *played*、*playing*。\n- 其他情况：直接加词尾。*jump* → *jumped*，*rain* → *raining*。\n\n规则很重要：*hoped* 来自 *hope*，而 *hopped* 来自 *hop*。",
        ),
        askGenerator(endingChoiceBank),
      ),
      point(
        "typing-the-ending",
        t("Typing the Verb with Its Ending", "写出加词尾的动词"),
        t(
          "To write a verb with its ending, decide first which rule its last letters call for, then spell it: double the consonant after one short vowel (*plan* → *planned*), drop a silent *e* (*smile* → *smiling*), change a *y* after a consonant to *i* before *-ed* (*study* → *studied*), and otherwise just add the ending (*look* → *looked*).",
          "写加词尾的动词时，先根据最后几个字母判断用哪条规则，再拼写：一个短元音后双写辅音（*plan* → *planned*），去掉不发音的 *e*（*smile* → *smiling*），辅音后的 *y* 在 *-ed* 前变成 *i*（*study* → *studied*），其他情况直接加词尾（*look* → *looked*）。",
        ),
        typedGenerator("word-form", t("Type the verb with its ending.", "写出加上词尾后的动词。"), endingTypedBank, (right) => {
          const item = endingRuleOf.get(right);
          const [en, zh] = endingRule(item?.verb ?? "", item?.rule ?? "", item?.ending ?? "");
          return t(`It is spelled **${right}**. ${en}`, `正确拼写是 **${right}**。${zh}`);
        }),
      ),
    ],
  ),
  topic(
    "commas-in-dates-addresses-and-letters",
    t("Commas in Dates, Addresses and Letters", "日期、地址和书信中的逗号"),
    t(
      "A comma goes between the day and the year, between a city and its state or country, and after the greeting and the closing of a friendly letter.",
      "日和年之间、城市和州或国家之间、友好书信的称呼和结束语之后，都要加逗号。",
    ),
    ["capitalizing-names-and-titles"],
    [
      point(
        "commas-in-dates-and-places",
        t("Commas in Dates and Places", "日期和地名中的逗号"),
        t(
          "In a date, a comma goes between the day and the year: *June 12, 2019*. If the day of the week comes first, a comma follows it too: *Saturday, July 11, 2026*.\n\nIn a place, a comma goes between the city and its state or country: *Cairo, Egypt*; *Austin, Texas*. There is no comma between the month and the day.",
          "日期中，日和年之间加逗号：*June 12, 2019*。如果前面有星期几，星期几后面也加逗号：*Saturday, July 11, 2026*。\n\n地名中，城市和州或国家之间加逗号：*Cairo, Egypt*；*Austin, Texas*。月份和日之间不加逗号。",
        ),
        typedGenerator(
          "sentence",
          t("Type the sentence again, adding the commas it needs.", "重新输入这个句子，加上需要的逗号。"),
          commaBank,
          (right) =>
            t(
              `**${right}** A comma goes between the day and the year, after the day of the week, and between a city and its state or country.`,
              `**${right}** 日和年之间、星期几之后、城市和州或国家之间都要加逗号。`,
            ),
        ),
      ),
      point(
        "commas-in-letters",
        t("Commas in Letters", "书信中的逗号"),
        t(
          "A friendly letter has a comma after its greeting and after its closing:\n\n*Dear Grandma,*\n...\n*Your friend,*\n*Mia*\n\nThe greeting begins with *Dear* and a capital, and the comma comes after the name. The closing begins with a capital, only on its first word, and the writer's name goes on the line below.",
          "友好书信的称呼和结束语后面都要加逗号：\n\n*Dear Grandma,*\n……\n*Your friend,*\n*Mia*\n\n称呼以 *Dear* 和大写字母开头，逗号放在名字后面。结束语只有第一个词首字母大写，写信人的名字写在下一行。",
        ),
        askGenerator([...greetingBank, ...closingBank]),
      ),
    ],
  ),
  topic(
    "contractions",
    t("Contractions", "缩约形式"),
    t(
      "A contraction joins two words and puts an apostrophe where letters are left out: do not becomes don't, they are becomes they're, will not becomes won't.",
      "缩约形式把两个词合在一起，在省略字母的地方加撇号：do not 变成 don't，they are 变成 they're，will not 变成 won't。",
    ),
    ["apostrophes-and-possessives"],
    [
      point(
        "forming-contractions",
        t("Forming Contractions", "构成缩约形式"),
        t(
          "A **contraction** is two words squeezed into one. An apostrophe takes the place of the letters that are left out: *do not* → *don't* (the *o* of *not* is gone), *I am* → *I'm*, *they are* → *they're*, *we have* → *we've*.\n\nThe apostrophe goes exactly where the letters were, not between the two words: *don't*, not *do'nt*. Two contractions are special: *will not* → *won't* and *cannot* → *can't*.",
          "**缩约形式**是把两个词压缩成一个词。撇号代替被省略的字母：*do not* → *don't*（*not* 的 *o* 省略了），*I am* → *I'm*，*they are* → *they're*，*we have* → *we've*。\n\n撇号要放在字母被省略的地方，而不是两个词之间：写 *don't*，不写 *do'nt*。有两个特殊的：*will not* → *won't*，*cannot* → *can't*。",
        ),
        typedGenerator("word-form", t("Type the contraction of these words.", "输入这些词的缩约形式。"), contractionBank, (right, shown) =>
          t(
            `*${wordsOf(shown)}* becomes **${right}**: the apostrophe stands where letters were left out.`,
            `*${wordsOf(shown)}* 缩约成 **${right}**：撇号代替了被省略的字母。`,
          ),
        ),
      ),
      point(
        "contraction-or-possessive",
        t("Contraction or Possessive", "缩约形式还是所有格"),
        t(
          "Some contractions sound just like possessive words: *it's* and *its*, *they're* and *their* (and *there*), *you're* and *your*, *who's* and *whose*.\n\nTo choose, say the two long words in the gap. If *it is* fits (*It is going to rain*), write *it's*. If it does not (*The dog wagged it is tail*), write *its*, which means belonging to it. A possessive pronoun never has an apostrophe.",
          "有些缩约形式和表示所属的词读音一样：*it's* 和 *its*，*they're* 和 *their*（还有 *there*），*you're* 和 *your*，*who's* 和 *whose*。\n\n选择时，把两个完整的词放进空格读一读。如果 *it is* 说得通（*It is going to rain*），就写 *it's*；如果说不通（*The dog wagged it is tail*），就写 *its*，意思是“它的”。物主代词从来不带撇号。",
        ),
        askGenerator(possessiveBank),
      ),
    ],
  ),
  topic(
    "action-and-linking-verbs",
    t("Action and Linking Verbs", "行为动词和系动词"),
    t(
      "An action verb tells what a subject does; a linking verb such as is, was, seems or became joins it to a word that names or describes it.",
      "行为动词说明主语做什么；系动词（如 is、was、seems、became）把主语和说明或描述它的词连接起来。",
    ),
    ["subjects-and-predicates"],
    [
      point(
        "action-or-linking",
        t("Action or Linking", "行为动词还是系动词"),
        t(
          "An **action verb** tells what the subject does: *The workers **built** a wall. The river **flowed**.* A **linking verb** shows no action. It joins the subject to a word that names or describes it: *The wall **was** long. The night **became** cold. The silk **felt** smooth.*\n\nTo test a verb, put *is* in its place. If the sentence still makes sense (*The silk is smooth*), the verb is linking.",
          "**行为动词**说明主语做什么：*The workers **built** a wall. The river **flowed**.* **系动词**不表示动作，它把主语和说明或描述主语的词连接起来：*The wall **was** long. The night **became** cold. The silk **felt** smooth.*\n\n检验方法：用 *is* 替换这个动词。如果句子仍然说得通（*The silk is smooth*），它就是系动词。",
        ),
        labelChoice(["What is the word in bold?", "加粗的词是什么？"], verbKindLines, verbLabels),
      ),
      point(
        "after-the-linking-verb",
        t("After the Linking Verb", "系动词后面的词"),
        t(
          "After a linking verb comes a word that names or describes the subject: *The river was **muddy**. My grandfather was a **potter**.* It tells what the subject is or what it is like.\n\nTo find it, ask: the subject was what? *The river was muddy* answers *muddy*. Words in a phrase that follows, such as *after the flood*, tell when or where, not what the subject is.",
          "系动词后面是说明或描述主语的词：*The river was **muddy**. My grandfather was a **potter**.* 它说明主语是什么或怎么样。\n\n找它时可以问：主语是什么样的？*The river was muddy* 的答案是 *muddy*。后面短语里的词，比如 *after the flood*，说明的是时间或地点，而不是主语是什么。",
        ),
        askGenerator(linkedBank),
      ),
    ],
  ),
  topic(
    "four-kinds-of-sentences",
    t("Four Kinds of Sentences", "四种句子"),
    t(
      "A statement tells, a question asks, a command tells someone to do something, and an exclamation shows strong feeling; each has its end mark.",
      "陈述句陈述，疑问句提问，祈使句要求别人做事，感叹句表达强烈的感情；每种句子都有自己的结尾标点。",
    ),
    ["capitals-and-end-punctuation"],
    [
      point(
        "naming-the-kind",
        t("Naming the Kind of Sentence", "说出句子的种类"),
        t(
          "There are four kinds of sentences.\n\n- A **statement** tells something and ends with a period: *The drum is loud.*\n- A **question** asks something and ends with a question mark: *Can you play the violin?*\n- A **command** tells someone to do something; its subject, *you*, is left out: *Hold the bow gently.*\n- An **exclamation** shows strong feeling and ends with an exclamation mark: *What a beautiful song that was!*\n\nA strong command can end with an exclamation mark too, so look at what the sentence does, not only at its end mark.",
          "句子有四种。\n\n- **陈述句**陈述一件事，以句号结尾：*The drum is loud.*\n- **疑问句**提出问题，以问号结尾：*Can you play the violin?*\n- **祈使句**要求别人做某事，省略了主语 *you*：*Hold the bow gently.*\n- **感叹句**表达强烈的感情，以感叹号结尾：*What a beautiful song that was!*\n\n语气强烈的祈使句也可以用感叹号结尾，所以要看句子的作用，而不只看结尾标点。",
        ),
        labelChoice(["What kind of sentence is this?", "这是哪一种句子？"], kindLines, kindLabels),
      ),
      point(
        "changing-the-kind",
        t("Changing the Kind of Sentence", "改变句子的种类"),
        t(
          "To turn a statement into a question, move the helping verb in front of the subject and end with a question mark: *The drum is loud.* → *Is the drum loud?* To turn it back, put the subject first again and end with a period.\n\nTo make a command, start with what to do: *You should clap on the beat.* → *Clap on the beat.* To make an exclamation, begin with *What a*: *That is a loud drum.* → *What a loud drum that is!*",
          "把陈述句改成疑问句，要把助动词移到主语前面，并以问号结尾：*The drum is loud.* → *Is the drum loud?* 改回来时，把主语放回前面，以句号结尾。\n\n改成祈使句，要以要做的动作开头：*You should clap on the beat.* → *Clap on the beat.* 改成感叹句，以 *What a* 开头：*That is a loud drum.* → *What a loud drum that is!*",
        ),
        typedGenerator(
          "sentence-pattern",
          t("Rewrite the sentence as the kind asked for, with the right end mark.", "按要求把句子改写成另一种句子，并用正确的结尾标点。"),
          rewriteBank,
          rewriteWhy,
        ),
      ),
    ],
  ),
  topic(
    "spelling-ck-tch-and-dge",
    t("Spelling with -ck, -tch and -dge", "用 -ck、-tch 和 -dge 拼写"),
    t(
      "After one short vowel, the sounds /k/, /ch/ and /j/ at the end of a word are spelled ck, tch and dge; after a long vowel or a consonant they are k, ch and ge.",
      "在一个短元音之后，词尾的 /k/、/ch/、/j/ 音拼作 ck、tch、dge；在长元音或辅音之后，拼作 k、ch、ge。",
    ),
    ["adding-ed-and-ing"],
    [
      point(
        "choosing-the-ending-spelling",
        t("Choosing the Spelling of the Ending", "选择词尾的拼写"),
        t(
          "Listen to the vowel before the last sound of the word.\n\n- After **one short vowel**, /k/ is *ck*, /ch/ is *tch* and /j/ is *dge*: *stick*, *patch*, *bridge*.\n- After a **long vowel** or a **consonant**, /k/ is *k*, /ch/ is *ch* and /j/ is *ge*: *cake*, *milk*; *beach*, *bench*; *page*, *large*.\n\nThe extra letter (*c*, *t* or *d*) keeps the short vowel short.",
          "听一听单词最后一个音前面的元音。\n\n- 在**一个短元音**之后，/k/ 拼作 *ck*，/ch/ 拼作 *tch*，/j/ 拼作 *dge*：*stick*、*patch*、*bridge*。\n- 在**长元音**或**辅音**之后，/k/ 拼作 *k*，/ch/ 拼作 *ch*，/j/ 拼作 *ge*：*cake*、*milk*；*beach*、*bench*；*page*、*large*。\n\n多出来的字母（*c*、*t* 或 *d*）让短元音保持短音。",
        ),
        askGenerator(spellChoiceBank),
      ),
      point(
        "typing-the-word",
        t("Typing the Word", "写出单词"),
        t(
          "To finish a word, say it and listen: is the vowel before the last sound short, as in *duck*, or long, as in *bike*? Is there a consonant before it, as in *lunch*? Then choose: *ck*, *tch* or *dge* after one short vowel, and *k*, *ch* or *ge* otherwise.",
          "补全单词时，先读出来仔细听：最后一个音前面的元音是像 *duck* 那样的短元音，还是像 *bike* 那样的长元音？前面是不是辅音，比如 *lunch*？然后选择：一个短元音之后用 *ck*、*tch* 或 *dge*，其他情况用 *k*、*ch* 或 *ge*。",
        ),
        typedGenerator(
          "word-form",
          t("The word with the gap is only begun. Type the whole word.", "带空格的单词只写了开头，请输入整个单词。"),
          spellTypedBank,
          (right) => {
            const [en, zh] = spellRule(right, spellRuleOf.get(right) ?? "");
            return t(`The word is **${right}**. ${en}`, `这个词是 **${right}**。${zh}`);
          },
        ),
      ),
    ],
  ),
];
