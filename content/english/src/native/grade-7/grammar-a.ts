// Grade 7: grammar of the first five units: shifts in mood, phrases and clauses, dangling modifiers, suffixes,
// pronouns in pairs, adjective and adverb clauses, interrupters and tricky subjects.

import type { TopicDef } from "@ga/content";
import { everyPair } from "../../levels/words.ts";
import { choose, type Label, label, topic } from "../grade-6/kit.ts";

// Crossed items: frames, people and phrases multiply the lines below into a hundred items or more for each bank.

const join = (lines: readonly string[]) => lines.join("\n");
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const low = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** commands are a first command, the verb of a second one and the words after it. */
const commands = [
  ["Raise your hand", "wait for", "the teacher"],
  ["Plan your speech", "practice", "it twice"],
  ["Read both articles", "choose", "the stronger one"],
  ["Open your notebook", "copy", "the chart"],
  ["Listen to the speaker", "take", "notes"],
  ["Check the time", "finish", "your answer"],
  ["Sharpen your pencil", "start", "the test"],
  ["Wash your hands", "set", "the table"],
  ["Pack your bag", "meet", "us at the gate"],
  ["Find a partner", "share", "your idea"],
  ["Fold the letter", "seal", "the envelope"],
  ["Turn off the stove", "cover", "the pot"],
  ["Water the seeds", "place", "the pot in the sun"],
  ["Mix the flour and eggs", "pour", "the batter into the pan"],
  ["Write your name", "answer", "the first question"],
  ["Feed the dog", "walk", "him around the block"],
  ["Clear your desk", "take out", "a pencil"],
  ["Read the question twice", "underline", "the key words"],
  ["Put on your boots", "grab", "an umbrella"],
  ["Close the window", "lock", "the door"],
] as const;
/** factsAndOrders are a statement, an order that follows from it, and a statement that could follow instead. */
const factsAndOrders = [
  ["The bus leaves at eight", "be at the stop early", "most students are at the stop early"],
  ["The library closes at five", "return your books today", "most people return their books by then"],
  ["The test has three parts", "budget your time", "most students budget their time"],
  ["The floor is wet", "walk slowly", "the janitor has put out a sign"],
  ["The museum is free on Sundays", "visit then", "many families visit then"],
  ["The ice is thin", "stay off the pond", "the rangers keep people off the pond"],
  ["The play starts at seven", "take your seats", "the ushers seat everyone"],
  ["The paint is still wet", "do not touch the door", "a sign warns people about the door"],
  ["The soup is hot", "blow on it first", "Dad blows on it first"],
  ["The road is closed", "take the other route", "drivers take the other route"],
] as const;
/** wishes are an unreal condition, its pronoun, what would follow, and a second action in its base and present forms. */
const wishes = [
  ["If I were the coach", "I", "change the lineup", "explain it to the team", "explain it to the team"],
  ["If she were the mayor", "she", "build more parks", "plant trees everywhere", "plants trees everywhere"],
  ["If he were our teacher", "he", "give less homework", "grade it quickly", "grades it quickly"],
  ["If we were in charge", "we", "open the pool early", "keep it open late", "keep it open late"],
  ["If they were rich", "they", "buy a farm", "raise horses", "raise horses"],
  ["If I were older", "I", "drive to the coast", "stay for a week", "stay for a week"],
  ["If she were the principal", "she", "lengthen recess", "join the games", "joins the games"],
  ["If he were taller", "he", "play center", "block every shot", "blocks every shot"],
  ["If you were the captain", "you", "choose the plays", "call them loudly", "call them loudly"],
  ["If the park were bigger", "it", "have a lake", "attract more birds", "attracts more birds"],
] as const;
const moodNames = join([
  ...commands.flatMap(([first, verb, rest]) => [
    `${first}, and then you should ${verb} ${rest}.|imperative to indicative`,
    `${first}, and then ${verb} ${rest}.|no shift`,
    `${first}, and you will ${verb} ${rest}.|imperative to indicative`,
  ]),
  ...factsAndOrders.flatMap(([fact, order, statement]) => [
    `${fact}, so ${order}.|indicative to imperative`,
    `${fact}, so ${statement}.|no shift`,
  ]),
  ...wishes.flatMap(([condition, who, first, base, present]) => [
    `${condition}, ${who} would ${first}, and ${who} ${present}.|subjunctive to indicative`,
    `${condition}, ${who} would ${first} and would ${base}.|no shift`,
  ]),
]);
const linkers = ["and ___", "and then ___", "and after that ___", "and next ___"] as const;
const moodKeeps = join([
  ...commands.flatMap(([first, verb, rest], k) =>
    [0, 1, 2, 3].map((j) => {
      const wrongs = (k + j) % 2 === 0 ? [`you should ${verb}`, `you will ${verb}`] : [`you will ${verb}`, `you can ${verb}`];
      return `${first}, ${linkers[j]} ${rest}.|${verb}|${wrongs[0]}|${wrongs[1]}`;
    }),
  ),
  ...wishes.map(([condition, who, first, base]) => `${condition}, ${who} would ${first} and ___ ${base}.|would|will|can`),
]);

/** scenes are a subject, its verb, a prepositional phrase, an appositive, an infinitive of purpose and a participial phrase. */
const scenes = [
  ["The octopus", "hid", "under a rock", "a clever hunter", "to escape the shark", "sensing danger"],
  ["The crab", "scuttled", "across the sand", "a small gray creature", "to find shelter", "startled by our steps"],
  ["The seal", "slept", "on the warm rocks", "a young pup", "to rest after the hunt", "warmed by the sun"],
  ["The fishermen", "waited", "by the harbor", "three old friends", "to unload their catch", "tired after the night"],
  ["The gulls", "circled", "above the boat", "noisy white birds", "to steal some fish", "screaming at each other"],
  ["The children", "swam", "near the shore", "my younger cousins", "to cool off", "laughing loudly"],
  ["The diver", "searched", "among the reeds", "an expert on coral", "to find the lost ring", "holding a flashlight"],
  ["The whale", "rose", "from the deep water", "a huge humpback", "to take a breath", "covered in barnacles"],
  ["The turtle", "crawled", "toward the sea", "a newborn hatchling", "to escape the birds", "moving slowly"],
  ["The sailor", "rowed", "past the lighthouse", "a retired captain", "to reach the island", "singing an old song"],
  ["The dolphins", "leaped", "beside the ship", "playful bottlenoses", "to chase the waves", "flashing in the sun"],
  ["The girl", "ran", "along the beach", "my best friend", "to catch the kite", "shouting with joy"],
  ["The pelican", "dived", "into the bay", "a hungry bird", "to catch a fish", "folding its wings"],
  ["The lifeguard", "climbed", "onto the tower", "a strong swimmer", "to watch the swimmers", "wearing a red cap"],
  ["The otter", "floated", "on its back", "a playful animal", "to crack open a clam", "holding a stone"],
  ["The scientists", "sailed", "through the strait", "a team from Chile", "to study the whales", "carrying special cameras"],
] as const;
const sceneOpeners = [
  "When the storm hit",
  "Because the tide rose",
  "After the boat left",
  "Although the water was cold",
  "Before the sun rose",
  "While the divers watched",
] as const;
const phraseClause = join(
  scenes.flatMap(([who, verb, place], k) => {
    const [a = "", b = ""] = [sceneOpeners[k % 6], sceneOpeners[(k + 3) % 6]];
    return [
      `${who} ${verb} *${place}*.|phrase`,
      `*${who} ${verb} ${place}*, and the sea was calm.|independent clause`,
      ...[a, b].flatMap((opener) => [
        `*${opener}*, ${low(who)} ${verb} ${place}.|dependent clause`,
        `${opener}, ${low(who)} ${verb} *${place}*.|phrase`,
        `${opener}, *${low(who)} ${verb} ${place}*.|independent clause`,
      ]),
    ];
  }),
);
const phraseKindLines = join(
  scenes.flatMap(([who, verb, place, appositive, purpose, participle]) => [
    `${who} ${verb} *${place}*.|prepositional phrase`,
    `${who}, *${appositive}*, ${verb} ${place}.|appositive phrase`,
    `${who} ${verb} ${place} *${purpose}*.|infinitive phrase`,
    `${who}, *${participle}*, ${verb} ${place}.|participial phrase`,
    `*${cap(participle)}*, ${low(who)} ${verb} ${place}.|participial phrase`,
  ]),
);

/** danglers are an opening phrase, what the doers did, two endings with the wrong subject, and an action that misplaces it. */
const danglers = [
  ["Walking into the museum", "admired the statues", "the statues impressed everyone", "the statues seemed huge", "photographed a guard"],
  ["Climbing the steep hill", "saw the whole valley", "the valley came into view", "the view was breathtaking", "spotted a goat"],
  ["Running for the bus", "dropped our tickets", "the tickets fell out of the bag", "our tickets were lost", "passed a dog"],
  ["Opening the old trunk", "found a faded map", "a faded map was inside", "the smell was terrible", "noticed a spider"],
  ["Hiking through the forest", "heard a woodpecker", "a woodpecker was heard", "the trees blocked the sun", "met a ranger"],
  ["Looking out the window", "watched the snow fall", "the snow looked beautiful", "the street was white", "saw a cat"],
  ["Swimming in the lake", "felt the cold water", "the water felt cold", "the fish swam past", "waved to a boy"],
  ["Reading the letter", "learned the secret", "the secret was revealed", "the news was shocking", "called a friend"],
  ["Crossing the bridge", "heard the river below", "the river roared below", "the wind was strong", "greeted a farmer"],
  ["Waiting in line", "talked about the movie", "the movie started late", "the hour passed slowly", "chatted with a clerk"],
  ["Riding our bikes", "enjoyed the cool breeze", "the breeze felt cool", "the hill seemed endless", "passed a jogger"],
  ["Cooking dinner", "burned the rice", "the rice was burned", "the smoke alarm went off", "heard a neighbor"],
] as const;
const danglerDoers = ["we", "my cousins", "the students", "the tourists"] as const;
const danglerSpot = join(
  danglers.flatMap(([opening, done, wrong1, wrong2, misplaced], k) => [
    ...danglerDoers.map((who) => `${opening}, ${who} ${done}.|clear`),
    `${opening}, ${wrong1}.|dangling`,
    `${opening}, ${wrong2}.|dangling`,
    `${cap(danglerDoers[k % 4] ?? "we")} ${misplaced} ${low(opening)}.|misplaced`,
    `${cap(danglerDoers[(k + 2) % 4] ?? "we")} ${misplaced} ${low(opening)}.|misplaced`,
  ]),
);
const danglerFix = join(
  danglers.flatMap(([opening, done, wrong1, wrong2], k) =>
    [wrong1, wrong2].flatMap((wrong, j) =>
      [0, 1, 2].map((d) => {
        const who = danglerDoers[(k + j + d) % 4] ?? "we";
        return `${opening}, ${wrong}.|${opening}, ${who} ${done}.|${cap(wrong)}, ${low(opening)}.|${opening}, ${wrong} again.`;
      }),
    ),
  ),
);

/** spellDouble doubles the first consonant after the second letter, a common slip. */
const spellDouble = (word: string) => {
  const at = [...word].findIndex((c, i) => i >= 2 && /[bcdfgklmnprstvz]/.test(c));
  const i = at < 0 ? [...word].findIndex((c) => /[bcdfgklmnprstvz]/.test(c)) : at;
  return i < 0 ? `${word}${word.at(-1)}` : `${word.slice(0, i + 1)}${word.slice(i)}`;
};
/** silentE are a base, a suffix and the right spelling. */
const silentE = [
  "ride ing riding",
  "smile ing smiling",
  "bake er baker",
  "value able valuable",
  "desire able desirable",
  "adore able adorable",
  "nerve ous nervous",
  "adventure ous adventurous",
  "close ure closure",
  "guide ance guidance",
  "continue ous continuous",
  "arrive al arrival",
  "survive al survival",
  "refuse al refusal",
  "dispose al disposal",
  "insure ance insurance",
  "please ure pleasure",
  "move ing moving",
  "shine y shiny",
  "ice y icy",
  "noise y noisy",
  "ease y easy",
  "complete ion completion",
  "use ful useful",
  "grace ful graceful",
  "waste ful wasteful",
  "peace ful peaceful",
  "shame ful shameful",
  "place ment placement",
  "agree ment agreement",
  "safe ty safety",
  "nine ty ninety",
  "lone ly lonely",
  "live ly lively",
  "late ly lately",
  "sincere ly sincerely",
  "rude ness rudeness",
  "polite ness politeness",
  "like ness likeness",
  "hope less hopeless",
  "use less useless",
  "tire less tireless",
  "name less nameless",
  "change able changeable",
  "manage able manageable",
  "outrage ous outrageous",
  "peace able peaceable",
  "trace able traceable",
  "true ly truly",
  "argue ment argument",
  "nine th ninth",
  "whole ly wholly",
  "awe ful awful",
  "write er writer",
  "excite able excitable",
  "advise able advisable",
  "compare ison comparison",
  "admire ation admiration",
  "operate ion operation",
  "confuse ion confusion",
  "fame ous famous",
  "invite ation invitation",
  "settle ment settlement",
  "engage ment engagement",
  "wise ly wisely",
  "brave ly bravely",
  "care ful careful",
  "pure ly purely",
  "time less timeless",
  "taste less tasteless",
  "blame less blameless",
  "smoke y smoky",
] as const;
const silentELines = join(
  silentE
    .filter((entry) => entry !== "fame ous famous")
    .map((entry) => {
      const [base = "", suffix = "", right = ""] = entry.split(" ");
      const kept = `${base}${suffix}`;
      const rule = right === kept ? `${base.slice(0, -1)}${suffix}` : kept;
      return `${base} + ${suffix}|${right}|${rule}|${spellDouble(right)}`;
    }),
);
/** finalY are a base, a suffix and the right spelling. */
const finalY = [
  "easy ly easily",
  "heavy er heavier",
  "funny est funniest",
  "pretty er prettier",
  "tiny est tiniest",
  "hungry ly hungrily",
  "noisy ly noisily",
  "lucky ly luckily",
  "ready ly readily",
  "cry ed cried",
  "try ed tried",
  "fry ed fried",
  "spy ed spied",
  "copy ed copied",
  "marry ed married",
  "apply ed applied",
  "deny al denial",
  "bury al burial",
  "carry age carriage",
  "marry age marriage",
  "plenty ful plentiful",
  "fancy ful fanciful",
  "mystery ous mysterious",
  "fury ous furious",
  "glory ous glorious",
  "luxury ous luxurious",
  "vary ous various",
  "envy ous envious",
  "ugly ness ugliness",
  "empty ness emptiness",
  "silly ness silliness",
  "friendly ness friendliness",
  "happy ly happily",
  "play ing playing",
  "pay able payable",
  "stay ed stayed",
  "obey ed obeyed",
  "pray er prayer",
  "joy ful joyful",
  "buy er buyer",
  "cry ing crying",
  "try ing trying",
  "worry ing worrying",
  "copy ing copying",
  "fly ing flying",
  "deny ing denying",
  "bury ing burying",
  "spy ing spying",
  "day ly daily",
  "pay ed paid",
  "lay ed laid",
  "say ed said",
  "shy ly shyly",
  "dry ness dryness",
  "convey ed conveyed",
  "survey ed surveyed",
  "betray al betrayal",
  "portray ed portrayed",
  "rely able reliable",
  "deny able deniable",
  "envy able enviable",
  "pity less pitiless",
  "mercy less merciless",
  "body ly bodily",
  "steady ly steadily",
  "busy est busiest",
  "early er earlier",
  "dirty est dirtiest",
  "sunny er sunnier",
  "salty est saltiest",
  "magnify ed magnified",
  "satisfy ed satisfied",
] as const;
const finalYLines = join(
  finalY.map((entry) => {
    const [base = "", suffix = "", right = ""] = entry.split(" ");
    const kept = `${base}${suffix}`;
    const rule = right === kept ? `${base.slice(0, -1)}i${suffix}` : kept;
    return `${base} + ${suffix}|${right}|${rule}|${spellDouble(right)}`;
  }),
);

/** pronounSets are a subject pronoun, its object form and its reflexive form. */
const pronounSets = [
  ["I", "me", "myself"],
  ["he", "him", "himself"],
  ["she", "her", "herself"],
  ["we", "us", "ourselves"],
  ["they", "them", "themselves"],
] as const;
const partners = ["Amara", "My cousin", "Leo", "Our neighbor"] as const;
const pairActs = [
  "visited the old mosque",
  "read about the pyramids",
  "built a model ship",
  "won the spelling bee",
  "cleaned the garage",
  "walked to the museum",
  "painted the fence",
  "baked a cake",
  "planted a tree",
  "found a lost wallet",
  "wrote a play",
  "caught the early train",
] as const;
const pairObjects = [
  ["The guide showed", "the library"],
  ["Grandma thanked", "for the flowers"],
  ["The coach chose", "for the relay"],
  ["Our teacher praised", "in front of the class"],
  ["The driver took", "to the station"],
  ["Mom invited", "to the picnic"],
] as const;
const pairLines = join([
  ...everyPair(pronounSets, pairActs).map(
    ([[subject, object, self], act], k) => `${partners[k % 4]} and ___ ${act}.|${subject}|${object}|${self}`,
  ),
  ...everyPair(pronounSets, pairObjects).map(([[subject, object, self], [opening, rest]], k) => {
    const partner = low(partners[(k + 1) % 4] ?? "Leo");
    const who = partner.startsWith("my") || partner.startsWith("our") ? partner : cap(partner);
    return `${opening} ${who} and ___ ${rest}.|${object}|${subject}|${self}`;
  }),
]);
const prepFrames = [
  "The gift is for {N} and ___.",
  "Everyone came except {N} and ___.",
  "Mom sat beside {N} and ___.",
  "The letter was from {N} and ___.",
  "The teacher spoke to {N} and ___.",
  "We walked behind {N} and ___.",
  "The story is about {N} and ___.",
  "Grandpa made pancakes for {N} and ___.",
  "A note arrived for {N} and ___.",
  "The ball rolled past {N} and ___.",
  "Nobody sat near {N} and ___.",
  "The prize went to {N} and ___.",
  "The puppy ran toward {N} and ___.",
  "Keep the secret between {N} and ___.",
] as const;
const prepNames = ["Ama", "Musa", "my sister", "the coach", "Ravi"] as const;
const prepLines = join(
  everyPair(prepFrames, pronounSets).map(([frame, [subject, object, self]], k) => {
    const shown = frame.replace("{N}", prepNames[k % prepNames.length] ?? "Ama");
    return `${shown}|${object}|${subject}|${self}`;
  }),
);

/** clauseFolk are described by adjective clauses; nounClauses follow a verb of knowing. */
const clauseFolk = ["The girl", "The man", "The traveler", "The trader", "The farmer", "The teacher"] as const;
const folkActs = ["*who sold us the map*", "*who lives by the river*", "*who found the coins*"] as const;
const folkEnds = ["was from Timbuktu", "spoke three languages", "waved to us"] as const;
const clauseThings = ["book", "map", "letter", "coin", "bowl"] as const;
const thingClauses = ["*that we borrowed*", "*which my uncle found*"] as const;
const adverbOpeners = [
  "When the caravan arrived",
  "Because the road was flooded",
  "After the market closed",
  "If the rains come",
  "Although the trip was long",
  "Before the sun set",
] as const;
const adverbMains = [
  ["the traders rested", "the traders will rest"],
  ["the town grew quiet", "the town will grow quiet"],
  ["we went home", "we will go home"],
] as const;
const knowers = ["No one knew", "We wondered", "The guide explained", "I learned", "She remembered", "They forgot"] as const;
const nounClauses = [
  "what the letter said",
  "why the road was closed",
  "where the well was",
  "that the river had flooded",
  "how the map was made",
  "who had built the tower",
] as const;
const mainFor = (opener: string, [past, future]: readonly [string, string]) => (opener.startsWith("If") ? future : past);
const clauseNames = join([
  ...everyPair(clauseFolk, folkActs).map(([who, act], k) => `${who} ${act} ${folkEnds[k % 3]}.|adjective clause`),
  ...everyPair(clauseThings, thingClauses).map(
    ([thing, clause], k) => `The ${thing} ${clause} ${k % 2 === 0 ? "was very old" : "is on my desk"}.|adjective clause`,
  ),
  ...everyPair(adverbOpeners, adverbMains).flatMap(([opener, main]) => [
    `*${opener}*, ${mainFor(opener, main)}.|adverb clause`,
    `${cap(mainFor(opener, main))} *${low(opener)}*.|adverb clause`,
  ]),
  ...everyPair(knowers, nounClauses).map(([knower, clause]) => `${knower} *${clause}*.|noun clause`),
]);
/** adverbJobRows are what a clause tells, the clause, and two main clauses that fit it. */
const adverbJobRows = [
  ["time", "When the rains ended", "the traders set out", "the roads dried quickly"],
  ["time", "After the market closed", "the merchants counted their coins", "the square grew quiet"],
  ["time", "Before the sun rose", "the camels were loaded", "we left the oasis"],
  ["time", "While the camels rested", "the guides cooked dinner", "we drew water from the well"],
  ["time", "As soon as the gate opened", "the crowd rushed in", "the traders set up their stalls"],
  ["reason", "Because the road was flooded", "we stayed in town", "the caravan waited a week"],
  ["reason", "Since the well was dry", "the travelers moved on", "we carried extra water"],
  ["reason", "Because the guide was sick", "the trip was delayed", "we hired a new guide"],
  ["reason", "Since the prices rose", "people bought less salt", "the merchants grew rich"],
  ["reason", "Because the wind was strong", "the tents blew down", "we stayed inside"],
  ["condition", "If the rains come", "the river will rise", "the crops will grow"],
  ["condition", "Unless the river floods", "the bridge will stay open", "we will cross tomorrow"],
  ["condition", "If the guide agrees", "we will leave at dawn", "the trip will be shorter"],
  ["condition", "If the road is open", "the caravan will arrive tonight", "we will reach the city by noon"],
  ["condition", "Unless the camels rest", "they will collapse", "the trip will fail"],
  ["contrast", "Although the trip was long", "no one complained", "the travelers stayed cheerful"],
  ["contrast", "Even though the camels were tired", "they kept walking", "the caravan reached the city"],
  ["contrast", "Though the market was crowded", "we found the spice seller", "the prices were fair"],
  ["contrast", "Although the price was high", "she bought the cloth", "many people paid it"],
  ["contrast", "Even though the water was cold", "the children swam", "we washed in the river"],
] as const;
const adverbTells = join(
  adverbJobRows.flatMap(([job, clause, main1, main2]) => [
    `*${clause}*, ${main1}.|${job}`,
    `*${clause}*, ${main2}.|${job}`,
    `${cap(main1)} *${low(clause)}*.|${job}`,
    `${cap(main2)} *${low(clause)}*.|${job}`,
  ]),
);

/** interrupted are a subject and what it did, broken by interrupterWords. */
const interrupted = [
  ["the plan", "worked well"],
  ["our team", "won the final"],
  ["the bridge", "was closed for repairs"],
  ["the museum", "opened late"],
  ["the storm", "missed our town"],
  ["the bus", "arrived early"],
  ["my sister", "finished first"],
  ["the concert", "was sold out"],
] as const;
const interrupterWords = [
  "however",
  "of course",
  "in fact",
  "I think",
  "as it turned out",
  "by the way",
  "for once",
  "after all",
  "it seems",
] as const;
const interrupterLines = join(
  everyPair(interrupted, interrupterWords).map(([[who, did], word]) => {
    const words = did.split(" ");
    const cut = `${words.slice(0, -1).join(" ")}, ${words.at(-1)}`;
    return `${who} ${word} ${did}|${cap(who)}, ${word}, ${did}.|${cap(who)}, ${word} ${did}.|${cap(who)} ${word}, ${did}.|${cap(who)}, ${word}, ${cut}.`;
  }),
);
const callNames = ["Doctor", "Maria", "Coach", "Grandma", "Sam", "Mr. Kim"] as const;
const callQuestions = [
  "is it serious",
  "can we go now",
  "where is the nurse",
  "did you see the bird",
  "is the game over",
  "may I leave early",
] as const;
const openers = ["Yes", "No", "Well", "Oh"] as const;
const statements = [
  "I had the shot",
  "we are ready",
  "the bus is late",
  "I finished my homework",
  "the store is closed",
  "I found the key",
] as const;
const farewells = ["Thank you", "See you tomorrow", "Good morning", "Come here"] as const;
const splitAt = (s: string, n: number) => {
  const words = s.split(" ");
  return [words.slice(0, n).join(" "), words.slice(n).join(" ")] as const;
};
const nameLines = join([
  ...everyPair(callNames, callQuestions).map(([name, question]) => {
    const [head, tail] = splitAt(question, 2);
    return `${low(name)} ${question}|${name}, ${question}?|${name} ${head}, ${tail}?|${name} ${question}?`;
  }),
  ...everyPair(openers, statements).map(([opener, statement]) => {
    const [head, tail] = splitAt(statement, 1);
    return `${low(opener)} ${statement}|${opener}, ${statement}.|${opener} ${head}, ${tail}.|${opener} ${statement}.`;
  }),
  ...everyPair(farewells, callNames).map(([farewell, name]) => {
    const [head, tail] = splitAt(farewell, 1);
    return `${low(farewell)} ${name}|${farewell}, ${name}.|${head}, ${tail} ${name}.|${farewell} ${name}.`;
  }),
]);

/** oneThing are subjects that look plural but name one thing, each with three endings. */
const oneThing = [
  ["The news", ["on at six tonight", "better than yesterday's", "full of storms today"]],
  ["Mathematics", ["my best subject now", "harder this year", "useful every day"]],
  ["Measles", ["spreading in the town now", "rare in our country today", "easy to prevent today"]],
  ["Physics", ["my sister's favorite class now", "taught in the new lab", "full of puzzles"]],
  ["Economics", ["the study of money and choices", "a popular course here", "on the timetable this term"]],
  ["The United States", ["a large country", "hosting the games this year", "home to many languages"]],
  ["Gymnastics", ["a hard sport", "on television tonight", "my brother's hobby now"]],
  ["Mumps", ["a disease of the glands", "rare these days", "going around the school now"]],
  ["Civics", ["taught on Fridays", "about how government works", "my favorite class this term"]],
  ["Checkers", ["a game for two players", "easier than chess", "a game of moves and jumps"]],
  ["Billiards", ["played on a big table", "popular at the club", "hard to learn"]],
  ["Dominoes", ["Grandpa's favorite game", "fun on rainy days", "a quick game to learn"]],
] as const;
const pairTools = [
  "My scissors",
  "These jeans",
  "Her glasses",
  "His pants",
  "The binoculars",
  "My shorts",
  "The tongs",
  "The pliers",
] as const;
const toolEnds = ["on the table now", "too small for me now", "brand new"] as const;
const pairOfs = ["A pair of scissors", "This pair of jeans", "That pair of glasses", "A pair of pliers"] as const;
const lookPlural = join([
  ...oneThing.flatMap(([subject, ends]) => ends.map((end) => `${subject} ___ ${end}.|is|are|were`)),
  ...everyPair(pairTools, toolEnds).map(([subject, end]) => `${subject} ___ ${end}.|are|is|were`),
  ...everyPair(pairOfs, toolEnds).map(([subject, end]) => `${subject} ___ ${end}.|is|are|were`),
]);
const groupsOfOne = ["team", "class", "band", "jury", "crowd", "committee", "audience", "choir"] as const;
const groupEnds = ["ready now", "in the hall now", "waiting outside now"] as const;
const amounts = [
  ["Ten dollars", "too much for a sandwich"],
  ["Five miles", "a long way to walk"],
  ["Three hours", "enough time for the trip"],
  ["Two weeks", "a long time to wait"],
  ["Fifty pounds", "heavy for one bag"],
  ["Twenty minutes", "plenty of time"],
  ["Six meters", "the length of the boat"],
  ["Forty dollars", "the price of the ticket"],
] as const;
const counted = ["students", "players", "birds", "cars", "visitors", "parents"] as const;
const aNumberEnds = ["waiting outside", "sick this week", "late today"] as const;
const theNumberEnds = ["growing every year", "smaller than last year", "hard to count"] as const;
const groupLines = join([
  ...everyPair(groupsOfOne, groupEnds).map(([group, end]) => `The ${group} ___ ${end}.|is|are|were`),
  ...amounts.flatMap(([amount, end]) => [`${amount} ___ ${end}.|is|are|were`, `I think ${low(amount)} ___ ${end}.|is|are|were`]),
  ...everyPair(counted, aNumberEnds).map(([things, end]) => `A number of ${things} ___ ${end}.|are|is|was`),
  ...everyPair(counted, theNumberEnds).map(([things, end]) => `The number of ${things} ___ ${end}.|is|are|was`),
]);

const shiftLabels: Readonly<Record<string, Label>> = {
  "no shift": {
    zh: "没有转换",
    why: [
      "Every verb in the sentence stays in the same mood from start to finish, so there is **no shift**.\n\n**Check.** Compare the first verb and the second verb side by side: both are commands, both are statements, or both stay in the unreal *would* mood.",
      "句中每个动词从头到尾都保持同一种语气，因此**没有转换**。\n\n**检验。** 把前后两个动词并排对照：要么都是命令，要么都是陈述，要么都保持非真实的 *would* 语气。",
    ],
    not: [
      "This sentence does keep one mood throughout, so there is no shift to name.",
      "这个句子自始至终保持同一种语气，所以没有转换可言。",
    ],
  },
  "imperative to indicative": {
    zh: "从祈使语气转为陈述语气",
    why: [
      "The first clause issues a direct command (imperative), and the second slides into a statement with *you should*, *you will*, or *you can* (indicative); that is **imperative to indicative**.\n\n**Check.** Notice how the subject suddenly appears in the second half (*you should/will/can*) after an unspoken *you* command in the first half.",
      "前半句发出直接命令（祈使语气），后半句滑成了带 *you should*、*you will* 或 *you can* 的陈述（陈述语气），因此是**从祈使语气转为陈述语气**。\n\n**检验。** 注意前半句省略主语直接用动词原形下命令，后半句却突然冒出 *you should/will/can* 变成了陈述。",
    ],
    not: ["This sentence does not start with a command and then turn into a statement.", "这个句子并不是先发出命令再转为陈述。"],
  },
  "indicative to imperative": {
    zh: "从陈述语气转为祈使语气",
    why: [
      "The first clause states a plain fact (indicative), and the second abruptly switches to a direct order (imperative); that is **indicative to imperative**.\n\n**Check.** Look right after *so*: the sentence drops its subject and begins an order with a bare verb.",
      "前半句陈述事实（陈述语气），后半句突然切换成直接命令（祈使语气），因此是**从陈述语气转为祈使语气**。\n\n**检验。** 看 *so* 后面的部分：句子突然省去主语，改用动词原形直接发号施令。",
    ],
    not: ["This sentence does not start with a statement and then turn into a command.", "这个句子并不是先陈述再转为命令。"],
  },
  "subjunctive to indicative": {
    zh: "从虚拟语气转为陈述语气",
    why: [
      "The sentence opens in an unreal *if … were* scenario (subjunctive/conditional) and then abruptly switches to an ordinary present-tense fact (indicative); that is **subjunctive to indicative**.\n\n**Check.** Compare the first outcome (*would …*) with the second verb: the second verb drops *would* and states the unreal event as if it were actually happening now.",
      "句子以非真实的 *if … were* 假设开头，后半句却突然换成了普通现在时陈述，因此是**从虚拟语气转为陈述语气**。\n\n**检验。** 对比第一个结果（*would …*）和第二个动词：第二个动词丢掉了 *would*，把假设说成了正在发生的现实。",
    ],
    not: [
      "This sentence does not start with an unreal wish or condition and then switch to a plain fact.",
      "这个句子并不是先说不真实的愿望或条件再转为平常的事实。",
    ],
  },
};

const moodShifts = topic("grammar", {
  id: "shifts-in-verb-mood",
  title: ["Shifts in Verb Mood", "动词语气的转换"],
  summary: [
    "A sentence keeps one mood: a command stays a command, a fact a fact, and an unreal wish stays unreal.",
    "一个句子保持同一种语气：命令一直是命令，事实一直是事实，不真实的愿望一直是不真实的。",
  ],
  intro: [
    "*Wash the berries, and then you should slice them* starts as a brisk command and drifts into a statement halfway through. Avoiding **shifts in verb mood** keeps every clause pulling in the same grammatical gear.",
    "*Wash the berries, and then you should slice them* 开头是利落的命令，写到一半却滑成了陈述。避免**动词语气的转换**，才能让前后分句始终保持一致的语气。",
  ],
  after: ["verb-moods"],
  points: [
    label(
      "naming-the-shift",
      ["Naming the Shift", "辨认语气的转换"],
      [
        "A sentence should stay in one **mood** unless meaning clearly demands a change. In *Open the box, and then you should take out the cable*, the verb shifts from **imperative** (*Open*) to **indicative** (*you should take*). Watch also for **indicative to imperative** (*The floor is wet, so walk slowly*) and **subjunctive to indicative** (*If I were mayor, I would build a park, and it wins*).\n\n> **Watch out.** Check *both* verbs carefully before labeling a sentence **no shift**—a single dropped *would* or inserted *you should* creates a mood shift.",
        "除非语义明确需要，否则一个句子应保持同一种**语气**。在 *Open the box, and then you should take out the cable* 中，语气从**祈使**（*Open*）滑向了**陈述**（*you should take*）。同样要留意**陈述转祈使**（*The floor is wet, so walk slowly*）和**虚拟转陈述**（*If I were mayor, I would build a park, and it wins*）。\n\n> **注意。** 判为**没有转换**前务必核对前后*两个*动词——少写一个 *would* 或多插一个 *you should* 都会造成语气转换。",
      ],
      ["Does the sentence shift mood, and how?", "这个句子是否转换了语气？怎样转换的？"],
      `
${moodNames}
        Read the motion aloud, and then you should give your first reason.|imperative to indicative
        Read the motion aloud, and then give your first reason.|no shift
        Each speaker has two minutes, so watch the clock.|indicative to imperative
        Each speaker has two minutes, and the moderator watches the clock.|no shift
        If I were the judge, I would ask more questions, and I ask them politely.|subjunctive to indicative
        If I were the judge, I would ask more questions and would ask them politely.|no shift
        Write down the other side's claim, and you will answer it next.|imperative to indicative
        Write down the other side's claim, and answer it next.|no shift
        The team meets at four, so bring your notes.|indicative to imperative
        The team meets at four, and everyone brings notes.|no shift
        If the school were to ban phones, students would complain, and they complain loudly.|subjunctive to indicative
        If the school were to ban phones, students would complain, and they would complain loudly.|no shift
        Stand when you speak, and you should look at the judges.|imperative to indicative
        Stand when you speak, and look at the judges.|no shift
        The rules allow one rebuttal, so keep it short.|indicative to imperative
        The rules allow one rebuttal, and most speakers keep it short.|no shift
        If she were our captain, she would plan every practice, and she plans them well.|subjunctive to indicative
        If she were our captain, she would plan every practice and would plan them well.|no shift
        Check your facts, and then you can quote the study.|imperative to indicative
        Check your facts, and then quote the study.|no shift
        A good argument answers objections, so answer at least one.|indicative to imperative
        A good argument answers objections, and this one answers two.|no shift
        If we were allowed to vote, we would choose the park, and the park wins.|subjunctive to indicative
        If we were allowed to vote, we would choose the park, and the park would win.|no shift
        Thank your opponent, and you should shake hands at the end.|imperative to indicative
        Thank your opponent, and shake hands at the end.|no shift
        The jury listens to both sides, so listen carefully too.|indicative to imperative
        The jury listens to both sides, and the judge listens too.|no shift
        If I were mayor, I would build a skate park, and I build it near the river.|subjunctive to indicative
        If I were mayor, I would build a skate park and would build it near the river.|no shift
      `,
      shiftLabels,
    ),
    choose(
      "keeping-one-mood",
      ["Keeping One Mood", "保持同一种语气"],
      [
        "To keep a sentence steady, match the second verb to the mood of the first. Follow a command with a bare command verb (*Open the box, and **take out** the cable*), and follow an unreal *If … were* clause with **would** in both actions (*If I were captain, I **would** practice more and **would** listen to everyone*).\n\n> **Watch out.** Do not let *you should*, *you will*, or a plain present verb sneak into the second half—keep the exact same verb pattern as the opening clause.",
        "要保持语气一致，就让后半句的动词顺着前半句的语气走：命令后面接动词原形命令（*Open the box, and **take out** the cable*）；非真实的 *If … were* 后面两个动作都用 **would**（*If I were captain, I **would** practice more and **would** listen to everyone*）。\n\n> **注意。** 别让 *you should*、*you will* 或普通现在时混进后半句——保持与开头分句完全一致的动词形式。",
      ],
      ["Which words keep the sentence in one mood?", "哪个选项能让句子保持同一种语气？"],
      `
${moodKeeps}
        Raise your hand, and then ___ your question.|ask|you should ask|you will ask
        Plan your speech, and ___ it twice before the debate.|practice|you should practice|you practiced
        Read both articles, and ___ the stronger one.|choose|you will choose|you can choose
        Look at the evidence, and ___ what it really shows.|decide|you should decide|you decided
        Turn off your phone, and ___ it in your bag.|put|you can put|you should put
        Listen to the question, and ___ before you answer.|pause|you should pause|you paused
        Open your notebook, and ___ the date at the top.|write|you should write|you will write
        Make a claim, and ___ it with two reasons.|support|you need to support|you supported
        Find the main idea, and ___ it in one sentence.|state|you will state|you stated
        Check the source, and ___ who wrote it.|note|you should note|you noted
        If I were the principal, I would add a garden and ___ students run it.|would let|let|will let
        If he were taller, he would play center and ___ every rebound.|would catch|catches|will catch
        If we were in charge, we would change the menu and ___ fresh fruit.|would add|add|will add
        If she were here, she would explain the rule and ___ our questions.|would answer|answers|will answer
        If I were you, I would apologize and ___ to make it right.|would offer|offer|will offer
        If they were older, they would vote and ___ the town council.|would join|join|will join
        If it were summer, we would swim and ___ on the beach.|would camp|camp|will camp
        If the bus were on time, I would arrive early and ___ the library first.|would visit|visit|will visit
        If our team were stronger, we would win and ___ to the finals.|would travel|travel|will travel
        If I were an author, I would write mysteries and ___ them in Venice.|would set|set|will set
        Close the door, and ___ the lights.|turn off|you should turn off|you turned off
        Copy the quotation exactly, and ___ the author's name.|add|you should add|you added
        Write a clear thesis, and ___ it in your conclusion.|repeat|you will repeat|you repeated
        Take one card, and ___ it to your partner.|pass|you should pass|you passed
        Sit down quietly, and ___ the first page.|read|you should read|you will read
        Mix the flour and the water, and ___ it for ten minutes.|stir|you should stir|you stirred
        Answer each objection, and ___ why it is weaker.|explain|you should explain|you explained
        Wash your hands, and ___ them on a clean towel.|dry|you should dry|you dried
        Count the votes, and ___ the result.|announce|you will announce|you announced
        Find a partner, and ___ your arguments.|compare|you should compare|you compared
      `,
      (right) => [
        `**${right}** keeps the second clause in the exact same mood as the first.\n\n**Check.** Compare the opening verb with **${right}**: both are bare commands or both stay in the unreal *would* mood, with no sudden switch to *you should*, *will*, or a past/present statement.`,
        `**${right}** 让后半句与前半句保持完全一致的语气。\n\n**检验。** 把句首动词和 **${right}** 对照：要么同为动词原形命令，要么同为非真实的 *would*，没有突兀切换成 *you should*、*will* 或普通陈述。`,
      ],
      [
        [
          "*{wrong}* turns the sentence into a statement or a different kind of verb halfway through, a shift in mood.",
          "*{wrong}* 让句子中途变成陈述或另一种动词形式，造成语气转换。",
        ],
        [
          "*{wrong}* changes the time or the mood of the verb, so the two parts no longer match.",
          "*{wrong}* 改变了动词的时间或语气，两部分就不再一致。",
        ],
      ],
    ),
  ],
});

const phraseLabels: Readonly<Record<string, Label>> = {
  phrase: {
    zh: "短语",
    why: [
      "This group of words lacks a subject paired with a finite verb, so it is a **phrase**, not a clause.\n\n**Check.** Try finding both a subject and its own conjugated verb inside the italics—one or both are missing, confirming it is a phrase.",
      "这组词缺少主语和限定动词的搭配，因此是**短语**而非从句。\n\n**检验。** 试着在斜体部分里同时找出主语和谓语动词——至少缺了一个，证明它只是短语。",
    ],
    not: ["A phrase has no subject and verb of its own, and this group of words has both.", "短语没有自己的主语和动词，而这组词两者都有。"],
  },
  "independent clause": {
    zh: "独立从句",
    why: [
      "This group has a subject and a finite verb and expresses a complete thought on its own; it is an **independent clause**.\n\n**Check.** Read only the italicized words with a capital letter and period: it stands cleanly as a full sentence.",
      "这组词有主语和谓语动词，且能独立表达完整意思，因此是**独立从句**。\n\n**检验。** 只读斜体部分并在末尾加上句号：它能稳稳当当地独立成句。",
    ],
    not: ["An independent clause could stand alone as a sentence; this group of words could not.", "独立从句可以单独成句，而这组词不能。"],
  },
  "dependent clause": {
    zh: "从属从句",
    why: [
      "This group has a subject and a finite verb yet starts with a subordinating or relative word (*when*, *because*, *although*, *that*, *who*) that leaves it incomplete; it is a **dependent clause**.\n\n**Check.** Confirm both halves: it *does* contain a subject + verb, yet stopping after it leaves the listener waiting for the main clause.",
      "这组词既有主语又有谓语动词，但开头带从属连词或关系词（*when*、*because*、*although*、*that*、*who*），意思未完，因此是**从属从句**。\n\n**检验。** 核对两点：它*确实*包含主谓结构，但单读它时话没说完，必须依附主句。",
    ],
    not: [
      "A dependent clause has a subject and a verb but needs the rest of the sentence; this group does not fit that.",
      "从属从句有主语和动词但需要依附句子的其余部分；这组词不符合这一点。",
    ],
  },
};

const phraseKinds: Readonly<Record<string, Label>> = {
  "prepositional phrase": {
    zh: "介词短语",
    why: [
      "It starts with a preposition (*in*, *under*, *across*, *beneath*, *against*) and ends with its noun object; that is a **prepositional phrase**.\n\n**Check.** Spot the first word in italics: it shows place, direction, or time before a noun—never a verb form.",
      "它以介词（*in*、*under*、*across*、*beneath*、*against*）开头、以名词宾语收尾，这是**介词短语**。\n\n**检验。** 看斜体部分的第一个词：它是放在名词前表示方位、方向或时间的介词，而不是动词形式。",
    ],
    not: ["A prepositional phrase begins with a preposition, and this one does not.", "介词短语以介词开头，而这个短语不是。"],
  },
  "participial phrase": {
    zh: "分词短语",
    why: [
      "It opens with an *-ing* or *-ed* participle (*gliding*, *covered*, *tired*, *carrying*) and describes a nearby noun; that is a **participial phrase**.\n\n**Check.** Look at the first italicized word: it comes from a verb ending in *-ing* or *-ed* (or irregular participle like *left*) and acts like an adjective describing a noun.",
      "它以 *-ing* 或 *-ed* 分词（*gliding*、*covered*、*tired*、*carrying*）开头并修饰附近名词，这是**分词短语**。\n\n**检验。** 看斜体首词：它是由动词变来的分词形式，像形容词一样描述旁边的名词。",
    ],
    not: [
      "A participial phrase starts with an *-ing* or *-ed* verb form that describes a noun, and this one does not.",
      "分词短语以描述名词的 *-ing* 或 *-ed* 动词形式开头，而这个短语不是。",
    ],
  },
  "appositive phrase": {
    zh: "同位语短语",
    why: [
      "It is a noun phrase placed right beside another noun to rename or identify it; that is an **appositive phrase**.\n\n**Check.** Put an equals sign between the preceding noun and the italicized phrase (*the blue whale = the largest animal on Earth*): they refer to the exact same person or thing.",
      "它是一个紧挨在另一名词旁、用来重命名或补充说明该名词的名词短语，这是**同位语短语**。\n\n**检验。** 在前面的名词和斜体短语之间画一个等号（*the blue whale = the largest animal on Earth*）：两者指的正是同一个人或事物。",
    ],
    not: [
      "An appositive renames the noun beside it, and this phrase does not rename a noun.",
      "同位语给旁边的名词换个说法，而这个短语没有。",
    ],
  },
  "infinitive phrase": {
    zh: "不定式短语",
    why: [
      "It begins with *to* plus the base form of a verb (*to find*, *to escape*, *to clean*); that is an **infinitive phrase**.\n\n**Check.** Check the word right after *to*: because it is a **verb** (not a noun like *to the bottom*), the phrase is an infinitive phrase rather than a prepositional phrase.",
      "它以 *to* 加动词原形（*to find*、*to escape*、*to clean*）开头，这是**不定式短语**。\n\n**检验。** 看 *to* 紧后面的词：它是**动词**（而不是像 *to the bottom* 里的名词），因此是不定式短语而不是介词短语。",
    ],
    not: ["An infinitive phrase begins with *to* and a verb, and this phrase does not.", "不定式短语以 *to* 加动词开头，而这个短语不是。"],
  },
};

const phrasesAndClauses = topic("grammar", {
  id: "phrases-and-clauses",
  title: ["Phrases and Clauses", "短语与从句"],
  summary: [
    "A clause has a subject and a verb; a phrase does not. Some clauses stand alone, and phrases do different jobs.",
    "从句有主语和动词，短语没有。有些从句能单独成句，而短语各有不同的作用。",
  ],
  intro: [
    "*After the storm* and *After the storm ended* differ by a single verb—yet that one verb turns a **phrase** into a **clause**. Knowing phrases from clauses lets you punctuate and build complex sentences with precision.",
    "*After the storm* 和 *After the storm ended* 只差一个动词，却把**短语**变成了**从句**。分清短语和从句以及各类短语的作用，才能精准断句、写出漂亮的长句。",
  ],
  after: ["prepositional-phrases", "subordinating-conjunctions"],
  points: [
    label(
      "phrase-or-clause",
      ["Phrase or Clause", "短语还是从句"],
      [
        "A **clause** contains both a subject and its finite verb (*the octopus hid*). An **independent clause** can stand alone as a complete sentence; a **dependent clause** starts with a marker like *when*, *because*, *although*, *who*, or *that* and needs a main clause. A **phrase** has no subject-verb pair (*under a rock*, *swimming near the reef*).\n\n> **Watch out.** An *-ing* or *to* + verb form (*swimming close to the bottom*, *to protect the turtles*) is *not* a finite verb with a subject—those groups are **phrases**, not clauses.",
        "**从句**同时包含主语和限定动词（*the octopus hid*）。**独立从句**能单独成句；**从属从句**带 *when*、*because*、*although*、*who* 或 *that* 等引导词，必须依附主句。**短语**没有主谓搭配（*under a rock*、*swimming near the reef*）。\n\n> **注意。** *-ing* 或 *to* + 动词形式（*swimming close to the bottom*、*to protect the turtles*）不是带主语的谓语动词——它们属于**短语**，不是从句。",
      ],
      ["What is the group of words in italics?", "斜体部分是什么？"],
      `
${phraseClause}
        The octopus hid *under a rock*.|phrase
        *The octopus hid* under a rock.|independent clause
        *When the shark swam past*, the octopus hid.|dependent clause
        Divers saw a turtle *near the reef*.|phrase
        *The reef was quiet* after the storm.|independent clause
        The fish scattered *because a seal appeared*.|dependent clause
        *Swimming close to the bottom*, the ray looked for clams.|phrase
        *The water grew colder* as we went deeper.|independent clause
        The water grew colder *as we went deeper*.|dependent clause
        The whale *that we saw* was a humpback.|dependent clause
        Plankton drift *with the currents*.|phrase
        *Plankton drift*, and whales follow them.|independent clause
        *Although the sea looked calm*, the current was strong.|dependent clause
        The crab scuttled *across the sand*.|phrase
        The crab scuttled across the sand, *and the gull followed it*.|independent clause
        We waited *until the tide went out*.|dependent clause
        *To protect the turtles*, the beach closes at night.|phrase
        The beach closes at night *so that turtles can nest*.|dependent clause
        *The turtles nest* in the summer.|independent clause
        Scientists *studying the reef* counted the fish.|phrase
        Scientists *who study the reef* counted the fish.|dependent clause
        *Scientists counted the fish* on the reef.|independent clause
        The kelp forest grows *in cold water*.|phrase
        *If the water warms*, the kelp may die.|dependent clause
        If the water warms, *the kelp may die*.|independent clause
        A jellyfish drifted *past the boat*.|phrase
        The diver, *a marine biologist*, took photos.|phrase
        The diver took photos *while the seal watched*.|dependent clause
        *The seal watched* the diver.|independent clause
        Sea stars live *in tide pools*.|phrase
      `,
      phraseLabels,
    ),
    label(
      "kinds-of-phrases",
      ["Kinds of Phrases", "短语的种类"],
      [
        "Four common phrases each start in a recognizable way: a **prepositional phrase** opens with a preposition (*beneath the waves*); a **participial phrase** opens with an *-ing* or *-ed* participle describing a noun (*covered in barnacles*); an **appositive phrase** renames a neighboring noun (*the blue whale, the largest animal on Earth*); and an **infinitive phrase** opens with *to* + base verb (*to find food*).\n\n> **Watch out.** *To* can start two different phrases—check the next word: *to the sandy bottom* (*to* + noun) is a **prepositional phrase**, while *to find food* (*to* + verb) is an **infinitive phrase**.",
        "四种常见短语各有清晰开头：**介词短语**以介词领起（*beneath the waves*）；**分词短语**以 *-ing* 或 *-ed* 分词领起并修饰名词（*covered in barnacles*）；**同位语短语**重命名旁边的名词（*the blue whale, the largest animal on Earth*）；**不定式短语**以 *to* + 动词原形领起（*to find food*）。\n\n> **注意。** *to* 可以引出两种不同短语，关键看紧跟的词：*to the sandy bottom*（*to* + 名词）是**介词短语**，而 *to find food*（*to* + 动词）才是**不定式短语**。",
      ],
      ["What kind of phrase is in italics?", "斜体部分是哪种短语？"],
      `
${phraseKindLines}
        The ship sank *beneath the waves*.|prepositional phrase
        The rock, *covered in barnacles*, was slippery.|participial phrase
        The blue whale, *the largest animal on Earth*, eats tiny krill.|appositive phrase
        Seals dive deep *to find food*.|infinitive phrase
        *Gliding through the water*, the shark circled the boat.|participial phrase
        Coral grows *in warm, shallow seas*.|prepositional phrase
        Our guide, *an old fisherman*, knew every rock.|appositive phrase
        The team worked hard *to clean the beach*.|infinitive phrase
        A crab hid *inside an empty shell*.|prepositional phrase
        *Tired from the long swim*, the turtle rested on the sand.|participial phrase
        The *Alvin*, *a small submersible*, carried three people.|appositive phrase
        Volunteers came *to count the birds*.|infinitive phrase
        Fish *living near the bottom* are often flat.|participial phrase
        We walked *along the shore* at sunset.|prepositional phrase
        Dr. Earle, *a famous ocean explorer*, gave the talk.|appositive phrase
        The boat slowed *to avoid the dolphins*.|infinitive phrase
        Light fades quickly *below two hundred meters*.|prepositional phrase
        *Frightened by the noise*, the fish darted away.|participial phrase
        Krill, *tiny shrimp-like animals*, feed many whales.|appositive phrase
        Sea otters use rocks *to open shellfish*.|infinitive phrase
        *Carried by the current*, the bottle reached Spain.|participial phrase
        The anchor dropped *to the sandy bottom*.|prepositional phrase
        The Pacific, *the deepest ocean*, covers a third of Earth.|appositive phrase
        It is hard *to see in the deep sea*.|infinitive phrase
        The penguins waddled *across the ice*.|prepositional phrase
        *Feeding on plankton*, the whale shark swam slowly.|participial phrase
        My aunt, *a ship's captain*, sails every summer.|appositive phrase
        The class went to the aquarium *to study jellyfish*.|infinitive phrase
        Waves crashed *against the cliffs*.|prepositional phrase
        Nets *left in the sea* trap many animals.|participial phrase
      `,
      phraseKinds,
    ),
  ],
});

const danglingLabels: Readonly<Record<string, Label>> = {
  dangling: {
    zh: "垂悬修饰语",
    why: [
      "The opening phrase implies a doer who never appears as the subject after the comma, leaving the modifier **dangling**.\n\n**Check.** Ask *Who performed the opening phrase?* Then look right after the comma: that subject (*the paintings*, *the tickets*, *the wall*) could not do that action.",
      "句首短语隐含的动作发出者并没有作为主语出现在逗号后面，导致修饰语成为**垂悬修饰语**。\n\n**检验。** 问一句*谁做的开头那个动作？*再看逗号后的主语：那个主语（*the paintings*、*the tickets*、*the wall*）根本做不了这个动作。",
    ],
    not: [
      "A dangling modifier has no right noun to describe, and here the opening phrase fits the subject after it.",
      "垂悬修饰语找不到它应修饰的名词，而这里开头的短语与后面的主语相符。",
    ],
  },
  misplaced: {
    zh: "错位修饰语",
    why: [
      "The right person *is* already in the sentence, yet the modifier sits next to the wrong noun, making it **misplaced**.\n\n**Check.** Notice that the doer is the subject at the start of the sentence, while the modifier drifted to the end beside another noun.",
      "动作发出者本来就在句中，只是修饰语放到了错误的名词旁边，因此是**错位修饰语**。\n\n**检验。** 注意动作发出者就在句首当主语，而修饰语跑到了句尾、紧挨着另一个名词。",
    ],
    not: [
      "A misplaced modifier sits beside the wrong word of the sentence; that is not the problem here.",
      "错位修饰语是放在了句中错误的词旁边，这里的问题不是这个。",
    ],
  },
  clear: {
    zh: "清楚",
    why: [
      "The subject immediately after the comma is the exact person or thing performing or described by the opening phrase, so the sentence is **clear**.\n\n**Check.** Link the opening phrase straight to the subject after the comma: the pairing makes complete literal sense.",
      "逗号后紧跟着的主语正好就是句首短语所描述的人或物，因此句子**清楚**。\n\n**检验。** 把句首短语和逗号后的主语直接连起来读：字面意思完全合理。",
    ],
    not: [
      "The modifier in this sentence does not attach to the right word, so the sentence is not clear.",
      "这个句子中的修饰语没有连到正确的词上，所以句子不清楚。",
    ],
  },
};

const dangling = topic("grammar", {
  id: "dangling-modifiers",
  title: ["Dangling Modifiers", "垂悬修饰语"],
  summary: [
    "An opening phrase must describe the subject right after it; when the right noun is missing, the modifier dangles.",
    "句首的短语必须描述紧跟其后的主语；如果缺了正确的名词，修饰语就是垂悬的。",
  ],
  intro: [
    "*Sprinting to the pier, the ferry pulled away* makes it sound as if the ferry were sprinting—because the runner never appears as the subject after the comma. Spotting and fixing **dangling modifiers** removes those accidental comedies.",
    "*Sprinting to the pier, the ferry pulled away* 听起来像渡轮在狂奔——因为真正狂奔的人没出现在逗号后的主语位置上。识别并改正**垂悬修饰语**，就能消除这类让人发笑的病句。",
  ],
  after: ["misplaced-modifiers"],
  points: [
    label(
      "spotting-a-dangling-modifier",
      ["Spotting a Dangling Modifier", "找出垂悬修饰语"],
      [
        "An opening modifier must describe the **subject** directly after the comma. In *Walking into the chapel, the paintings amazed us*, the person walking is not the subject (*the paintings*), so the modifier is **dangling**. In a **misplaced** modifier, the right subject *is* present, yet the phrase sits beside the wrong noun (*She saw a statue walking to school*).\n\n> **Watch out.** Do not confuse **dangling** with **misplaced**: if the phrase sits at the *start* before a comma and the wrong subject follows, it is **dangling**; if it sits at the *end* beside the wrong object, it is **misplaced**.",
        "句首修饰短语必须修饰紧跟逗号后的**主语**。在 *Walking into the chapel, the paintings amazed us* 中，主语是 *the paintings* 而不是走进教堂的人，因此是**垂悬修饰语**。**错位修饰语**则是正确主语已经在句中，但短语放到了错误名词旁边（*She saw a statue walking to school*）。\n\n> **注意。** 区分**垂悬**与**错位**：短语在*句首*逗号前且后面主语不对，是**垂悬**；短语落在*句末*紧挨着错误宾语，是**错位**。",
      ],
      ["Is the modifier in this sentence dangling, misplaced or clear?", "这个句子中的修饰语是垂悬的、错位的，还是清楚的？"],
      `
${danglerSpot}
        Walking into the chapel, the paintings amazed us.|dangling
        Walking into the chapel, we were amazed by the paintings.|clear
        We saw a fresco walking through the palace.|misplaced
        Painted in 1504, the statue stands in Florence.|dangling
        Carved in 1504, the statue stands in Florence.|clear
        Having studied for years, the painting was finally finished.|dangling
        Having studied for years, the apprentice finally finished the painting.|clear
        The artist sold a portrait to the duke covered in gold paint.|misplaced
        To become a master, years of training were needed.|dangling
        To become a master, an apprentice needed years of training.|clear
        Looking through the telescope, the moon seemed rough and full of craters.|dangling
        Looking through the telescope, Galileo saw that the moon was rough.|clear
        Galileo saw mountains on the moon looking through his telescope.|misplaced
        After reading the pamphlet, the idea seemed less strange.|dangling
        After reading the pamphlet, the merchant found the idea less strange.|clear
        Covered in dust, the workers carried the old manuscript.|dangling
        Covered in dust, the old manuscript was carried out by the workers.|clear
        Excited by the news, the printing press ran all night.|dangling
        Excited by the news, the printer ran his press all night.|clear
        The tourists photographed the dome climbing the stairs.|misplaced
        While mixing the plaster, the wall cracked.|dangling
        While mixing the plaster, the painter noticed a crack in the wall.|clear
        Born in a small village, Leonardo's talent was noticed early.|dangling
        Born in a small village, Leonardo showed his talent early.|clear
        The patron paid the sculptor riding a white horse.|misplaced
        Hoping for a commission, the young artist wrote to the pope.|clear
        Hoping for a commission, a letter was written to the pope.|dangling
        At the age of fourteen, his father sent him to a workshop.|dangling
        At the age of fourteen, he was sent by his father to a workshop.|clear
        She found an old map of Florence cleaning the attic.|misplaced
      `,
      danglingLabels,
    ),
    choose(
      "fixing-a-dangling-modifier",
      ["Fixing a Dangling Modifier", "改正垂悬修饰语"],
      [
        "Fix a dangling modifier in one of two ways: name the true doer as the subject directly after the comma (*Walking into the chapel, **we** were amazed by the paintings*), or expand the phrase into a full clause with its own subject (***As we walked** into the chapel, the paintings amazed us*).\n\n> **Watch out.** Merely moving the phrase to the end of the sentence (*The paintings amazed us, walking into the chapel*) does *not* fix a dangler—the subject of the main clause is still the paintings.",
        "改正垂悬修饰语有两种办法：把真正的动作发出者直接放进逗号后的主语位置（*Walking into the chapel, **we** were amazed by the paintings*），或把短语展开成带主语的完整从句（***As we walked** into the chapel, the paintings amazed us*）。\n\n> **注意。** 光把短语挪到句尾（*The paintings amazed us, walking into the chapel*）治标不治本——主句主语依然是画而不是人。",
      ],
      ["Which sentence fixes the dangling modifier?", "哪个句子改正了垂悬修饰语？"],
      `
${danglerFix}
        Walking into the chapel, the paintings amazed us.|Walking into the chapel, we were amazed by the paintings.|The paintings amazed us, walking into the chapel.|Walking into the chapel, the paintings were amazing to us.
        Having studied for years, the painting was finally finished.|Having studied for years, the apprentice finally finished the painting.|The painting was finally finished, having studied for years.|Having studied for years, the painting was finally finished by her.
        To become a master, years of training were needed.|To become a master, an apprentice needed years of training.|Years of training were needed to become a master.|To become a master, years of training were needed by many.
        Looking through the telescope, the moon seemed rough.|Looking through the telescope, Galileo saw that the moon was rough.|The moon seemed rough, looking through the telescope.|Looking through the telescope, the moon seemed rough to him.
        After reading the pamphlet, the idea seemed less strange.|After reading the pamphlet, the merchant found the idea less strange.|The idea seemed less strange after reading the pamphlet.|After reading the pamphlet, the idea seemed less strange to some.
        Excited by the news, the printing press ran all night.|Excited by the news, the printer ran his press all night.|The printing press ran all night, excited by the news.|Excited by the news, the printing press was run all night.
        While mixing the plaster, the wall cracked.|While the painter was mixing the plaster, the wall cracked.|The wall cracked while mixing the plaster.|While mixing the plaster, the wall suddenly cracked.
        Born in a small village, Leonardo's talent was noticed early.|Born in a small village, Leonardo showed his talent early.|Leonardo's talent was noticed early, born in a small village.|Born in a small village, Leonardo's great talent was noticed early.
        Hoping for a commission, a letter was written to the pope.|Hoping for a commission, the artist wrote a letter to the pope.|A letter was written to the pope, hoping for a commission.|Hoping for a commission, a long letter was written to the pope.
        At the age of fourteen, his father sent him to a workshop.|When he was fourteen, his father sent him to a workshop.|His father sent him to a workshop at the age of fourteen, as a boy.|At the age of fourteen, his own father sent him to a workshop.
        Tired after the long climb, the view from the dome was beautiful.|Tired after the long climb, we found the view from the dome beautiful.|The view from the dome was beautiful, tired after the long climb.|Tired after the long climb, the view from the dome was very beautiful.
        Running late for class, the bus left without me.|Running late for class, I missed the bus.|The bus left without me, running late for class.|Running late for class, the bus left without me again.
        Opening the old book, a pressed flower fell out.|When I opened the old book, a pressed flower fell out.|A pressed flower fell out, opening the old book.|Opening the old book, a dry pressed flower fell out.
        Using only a feather, the letters were painted in gold.|Using only a feather, the monk painted the letters in gold.|The letters were painted in gold, using only a feather.|Using only a feather, the gold letters were painted.
        After finishing the dome, the city held a festival.|After Brunelleschi finished the dome, the city held a festival.|The city held a festival, after finishing the dome.|After finishing the great dome, the city held a festival.
        Sketching every day, his drawing improved quickly.|Sketching every day, he improved his drawing quickly.|His drawing improved quickly, sketching every day.|Sketching every day, his drawing quickly improved.
        To print a book, many letters must be set by hand.|To print a book, a printer must set many letters by hand.|Many letters must be set by hand to print a book.|To print a book, many small letters must be set by hand.
        Climbing the scaffold, the ceiling seemed very close.|Climbing the scaffold, the painter came very close to the ceiling.|The ceiling seemed very close, climbing the scaffold.|Climbing the scaffold, the ceiling seemed close at last.
        Studying the stars, a new idea came to Copernicus.|Studying the stars, Copernicus came to a new idea.|A new idea came to Copernicus, studying the stars.|Studying the stars, a bold new idea came to Copernicus.
        Walking through the market, the smell of bread was everywhere.|Walking through the market, we smelled bread everywhere.|The smell of bread was everywhere, walking through the market.|Walking through the market, the smell of fresh bread was everywhere.
        Born in Poland, the sun was placed at the center by Copernicus.|Born in Poland, Copernicus placed the sun at the center.|The sun was placed at the center by Copernicus, born in Poland in his theory.|Born in Poland, the sun was placed at the center of his model.
        Arriving at the museum, the doors were closed.|When we arrived at the museum, the doors were closed.|The doors were closed, arriving at the museum.|Arriving at the museum, the big doors were closed.
        Practicing for hours, her lines were perfect by Friday.|Practicing for hours, she knew her lines perfectly by Friday.|Her lines were perfect by Friday, practicing for hours.|Practicing for hours, her lines were finally perfect by Friday.
        Frightened by the thunder, the bed was the dog's hiding place.|Frightened by the thunder, the dog hid under the bed.|The bed was the dog's hiding place, frightened by the thunder.|Frightened by the loud thunder, the bed was where the dog hid.
        Having lost the map, the road home was hard to find.|Having lost the map, the travelers could not find the road home.|The road home was hard to find, having lost the map.|Having lost the map, the road home was very hard to find.
        To win the prize, the painting had to be finished by May.|To win the prize, she had to finish the painting by May.|The painting had to be finished by May to win the prize.|To win the prize, the painting had to be finished early.
        Hurrying to the gate, my ticket fell out of my pocket.|Hurrying to the gate, I dropped my ticket.|My ticket fell out of my pocket, hurrying to the gate.|Hurrying to the gate, my ticket fell out.
        After eating lunch, the museum tour began.|After we ate lunch, the museum tour began.|The museum tour began, after eating lunch.|After eating a quick lunch, the museum tour began.
        Reading by candlelight, the scholar's eyes grew tired.|Reading by candlelight, the scholar felt his eyes grow tired.|The scholar's eyes grew tired, reading by candlelight.|Reading by candlelight, the old scholar's eyes grew tired.
        Lost in thought, the paintbrush slipped from her hand.|Lost in thought, she let the paintbrush slip from her hand.|The paintbrush slipped from her hand, lost in thought.|Lost in thought, the wet paintbrush slipped from her hand.
      `,
      (right) => [
        `The corrected sentence is: **${right}** The person doing the action is now named clearly in the right subject slot.\n\n**Check.** Ask *Who performs the opening action?* Look right after the comma (or inside the opening *When/While/After* clause): that exact doer is now clearly stated.`,
        `改正后的句子是：**${right}** 动作发出者现在清楚地落在正确的主语位置上。\n\n**检验。** 问一句*谁发出的开头动作？*看逗号后面（或开头的 *When/While/After* 从句内部）：真正的动作发出者已经明确写出。`,
      ],
      [
        [
          "*{wrong}* only moves the phrase to the end; the person it describes is still missing, so it still dangles.",
          "*{wrong}* 只是把短语移到了句末；它所描述的人仍然不在句中，所以仍然是垂悬的。",
        ],
        [
          "*{wrong}* adds a word or two but keeps the wrong subject after the comma, so the modifier still dangles.",
          "*{wrong}* 加了一两个词，但逗号后面仍是错误的主语，所以修饰语仍然垂悬。",
        ],
      ],
    ),
  ],
});

const suffixSpelling = topic("grammar", {
  id: "spelling-words-with-suffixes",
  title: ["Spelling Words with Suffixes", "加后缀的拼写"],
  summary: [
    "A final silent e drops before a suffix that starts with a vowel, and a final y after a consonant becomes i.",
    "词尾不发音的 e 在以元音开头的后缀前去掉，辅音后的词尾 y 变成 i。",
  ],
  intro: [
    "Why does *hope + ing* drop the *e* (*hoping*) while *hope + ful* keeps it (*hopeful*), and why does *carry + ed* change *y* to *i* (*carried*) while *carry + ing* keeps *y* (*carrying*)? Two clean suffix rules handle almost every case.",
    "为什么 *hope + ing* 去掉 *e*（*hoping*），*hope + ful* 却保留 *e*（*hopeful*）？为什么 *carry + ed* 把 *y* 变成 *i*（*carried*），*carry + ing* 却保留 *y*（*carrying*）？两条清晰的后缀拼写规则就能搞定绝大多数情况。",
  ],
  after: ["spelling-doubling-final-consonants"],
  points: [
    choose(
      "dropping-or-keeping-e",
      ["Dropping or Keeping a Final E", "去掉还是保留词尾的 e"],
      [
        "When a base word ends in a **silent e**, drop the *e* before a **vowel suffix** (*-ing*, *-able*, *-ous*, *-ion*, *-y*): *ride* + *-ing* → **riding**, *fame* + *-ous* → **famous**. Keep the *e* before a **consonant suffix** (*-ment*, *-ful*, *-ly*, *-ness*): *safe* + *-ly* → **safely**. Keep *e* after soft *c* or *g* before *-able/-ous* (*noticeable*, *courageous*, *changeable*).\n\n> **Watch out.** Check two traps: a few everyday exceptions drop *e* before a consonant (*truly*, *argument*, *ninth*, *wholly*, *awful*), and never double a consonant when dropping *e* (*writing*, not *writting*).",
        "词尾是**不发音的 e** 时，遇到**元音开头的后缀**（*-ing*、*-able*、*-ous*、*-ion*、*-y*）要去掉 *e*：*ride* + *-ing* → **riding**，*fame* + *-ous* → **famous**。遇到**辅音开头的后缀**（*-ment*、*-ful*、*-ly*、*-ness*）则保留 *e*：*safe* + *-ly* → **safely**。为保持软音 *c/g*，在 *-able/-ous* 前仍保留 *e*（*noticeable*、*courageous*、*changeable*）。\n\n> **注意。** 留心两个陷阱：少数高频例外在辅音后缀前也去 *e*（*truly*、*argument*、*ninth*、*wholly*、*awful*）；此外去 *e* 时绝不要顺手双写辅音（是 *writing*，不是 *writting*）。",
      ],
      ["How is the word with its suffix spelled?", "这个词加上后缀后怎样拼写？"],
      `
${silentELines}
        hope + ing|hoping|hopeing|hopping
        hope + ful|hopeful|hopful|hoppful
        fame + ous|famous|fameous|famos
        safe + ly|safely|safly|safelly
        create + ive|creative|createive|creattive
        move + ment|movement|movment|movemant
        write + ing|writing|writeing|writting
        care + less|careless|carless|carreless
        use + able|usable|useable|usible
        state + ment|statement|statment|statemant
        believe + able|believable|believeable|believible
        excite + ment|excitement|excitment|excitemant
        dance + ing|dancing|danceing|dansing
        nice + ly|nicely|nicly|nicelly
        separate + ion|separation|separateion|seperation
        love + ly|lovely|lovly|lovelly
        imagine + ation|imagination|imagineation|imaginnation
        late + ness|lateness|latness|lateniss
        explore + er|explorer|exploreer|explorrer
        hate + ful|hateful|hatful|hatefull
        make + ing|making|makeing|makking
        amuse + ment|amusement|amusment|amusemant
        decorate + ion|decoration|decorateion|decorration
        complete + ly|completely|completly|completelly
        notice + able|noticeable|noticable|noticible
        courage + ous|courageous|couragous|courageus
        live + ing|living|liveing|livving
        manage + ment|management|managment|managemant
        sense + ible|sensible|senseible|sensable
        close + ness|closeness|closness|closenes
      `,
      (right, shown) => [
        `**${right}** is the standard spelling: ${shown.split(" + ")[1]?.match(/^[aeiouy]/) ? "the suffix starts with a vowel sound, so silent *e* normally drops" : "the suffix starts with a consonant, so silent *e* normally stays"}${["noticeable", "courageous", "changeable", "manageable", "outrageous", "peaceable", "traceable"].includes(right) ? "—except here *e* stays to preserve the soft *c* or *g*" : ["truly", "argument", "ninth", "wholly", "awful"].includes(right) ? "—except this common word is one of the few that drops *e* before a consonant" : ""}.\n\n**Check.** Compare the join point of *${shown}* against **${right}**: no extra consonant was doubled, and the silent *e* follows the suffix rule (or its soft-*c/g* / common-word exception).`,
        `**${right}** 是标准拼写：${shown.split(" + ")[1]?.match(/^[aeiouy]/) ? "后缀以元音音素开头，通常去掉不发音的 *e*" : "后缀以辅音开头，通常保留不发音的 *e*"}${["noticeable", "courageous", "changeable", "manageable", "outrageous", "peaceable", "traceable"].includes(right) ? "——但本词为保留软音 *c* 或 *g* 而保留 *e*" : ["truly", "argument", "ninth", "wholly", "awful"].includes(right) ? "——但本词属于少数在辅音后缀前也去 *e* 的常见例外" : ""}。\n\n**检验。** 核对 *${shown}* 的拼接处和 **${right}**：没有误双写辅音，且词尾 *e* 的去留符合后缀规则（或对应的软音/常见例外）。`,
      ],
      [
        [
          "*{wrong}* keeps or drops the final e against the rule for this suffix.",
          "*{wrong}* 违反了这个后缀的规则，错误地保留或去掉了词尾的 e。",
        ],
        ["*{wrong}* doubles or changes a letter that should stay as it is.", "*{wrong}* 把本应保持不变的字母双写或改变了。"],
      ],
    ),
    choose(
      "changing-y-to-i",
      ["Changing Y to I", "把 y 变成 i"],
      [
        "When a word ends in **consonant + y**, change *y* to *i* before most suffixes: *happy* + *-ness* → **happiness**, *beauty* + *-ful* → **beautiful**. Keep *y* before **-ing** so two *i*'s do not collide (*carrying*, *studying*), and keep *y* after a **vowel** (*play* + *-ed* → **played**, *enjoy* + *-ment* → **enjoyment**).\n\n> **Watch out.** Watch for a handful of short exceptions—*paid*, *laid*, *said*, *daily* change *y* to *i* even after a vowel, while *shyly* and *dryness* keep *y*.",
        "单词以**辅音 + y** 结尾时，接大多数后缀都要把 *y* 改成 *i*：*happy* + *-ness* → **happiness**，*beauty* + *-ful* → **beautiful**。在 **-ing** 前保留 *y* 以免出现双 *i*（*carrying*、*studying*）；**元音 + y** 结尾也保留 *y*（*play* + *-ed* → **played**，*enjoy* + *-ment* → **enjoyment**）。\n\n> **注意。** 记住几个短词例外：*paid*、*laid*、*said*、*daily* 虽然是元音加 *y* 仍变 *i*，而 *shyly* 和 *dryness* 保留 *y*。",
      ],
      ["How is the word with its suffix spelled?", "这个词加上后缀后怎样拼写？"],
      `
${finalYLines}
        happy + ness|happiness|happyness|happieness
        carry + ed|carried|carryed|caried
        carry + ing|carrying|carriing|caring
        beauty + ful|beautiful|beautyful|beautifull
        play + ed|played|plaied|playd
        enjoy + ment|enjoyment|enjoiment|enjoyement
        study + ing|studying|studiing|studing
        study + ed|studied|studyed|studid
        busy + ly|busily|busyly|busilly
        pity + ful|pitiful|pityful|pitifull
        delay + ed|delayed|delaied|delayd
        easy + er|easier|easyer|easeir
        lonely + ness|loneliness|lonelyness|lonelness
        hurry + ing|hurrying|hurriing|huring
        hurry + ed|hurried|hurryed|huried
        employ + er|employer|emploier|employeer
        mercy + ful|merciful|mercyful|mercifull
        heavy + est|heaviest|heavyest|heavist
        destroy + ed|destroyed|destroied|destroyd
        duty + ful|dutiful|dutyful|dutifull
        reply + ed|replied|replyed|replid
        reply + ing|replying|repliing|repling
        lazy + ness|laziness|lazyness|lazeness
        annoy + ance|annoyance|annoiance|annoyence
        angry + ly|angrily|angryly|angrilly
        defy + ance|defiance|defyance|defience
        pay + ment|payment|paiment|payement
        ready + ness|readiness|readyness|readness
        worry + ed|worried|worryed|woried
        apply + cation|application|applycation|aplication
      `,
      (right, shown) => [
        `**${right}** is spelled correctly: ${["paid", "laid", "said", "daily"].includes(right) ? "this common word is an irregular exception that changes *y* to *i*" : ["shyly", "dryness"].includes(right) ? "this short word keeps its *y* before the suffix" : /[aeiou]y \+/.test(shown) ? "a vowel comes before *y*, so *y* stays" : shown.endsWith("+ ing") ? "*y* stays before *-ing* so two *i*'s do not meet" : "a consonant comes before *y*, so *y* changes to *i*"}.\n\n**Check.** Inspect the letter right before *y* and the first letter of the suffix in *${shown}*: **${right}** handles the *y* cleanly without dropping or doubling other letters.`,
        `**${right}** 拼写正确：${["paid", "laid", "said", "daily"].includes(right) ? "这个常见词属于把 *y* 变 *i* 的不规则例外" : ["shyly", "dryness"].includes(right) ? "这个短词接后缀时保留 *y*" : /[aeiou]y \+/.test(shown) ? "*y* 前面是元音，所以保留 *y*" : shown.endsWith("+ ing") ? "在 *-ing* 前保留 *y* 以免出现双 *i*" : "*y* 前面是辅音，所以加后缀时把 *y* 改成 *i*"}。\n\n**检验。** 看 *${shown}* 中 *y* 前面的字母以及后缀首字母：**${right}** 既正确处理了 *y*，也没有误删或误双写其他字母。`,
      ],
      [
        [
          "*{wrong}* keeps or changes the y against the rule for the letter before it.",
          "*{wrong}* 违反了看 y 前面字母的规则，错误地保留或改变了 y。",
        ],
        ["*{wrong}* drops, doubles or adds a letter that the word does not have.", "*{wrong}* 去掉、双写或加上了这个词本来没有的字母。"],
      ],
    ),
  ],
});

const pairs = topic("grammar", {
  id: "pronouns-in-compound-subjects-and-objects",
  title: ["Pronouns in Pairs", "并列结构中的代词"],
  summary: [
    "In a pair such as Amara and I or Amara and me, the pronoun takes the case it would take alone.",
    "在 Amara and I 或 Amara and me 这样的并列结构中，代词用它单独使用时的格。",
  ],
  intro: [
    "Pairing a pronoun with a name often tricks writers into switching cases: *Lina and me walked home* or *Mom drove Lina and I*. Cover the name and test the pronoun alone: *I walked home* and *Mom drove me*, so **Lina and I** and **Lina and me**. In this topic you choose the right pronoun in compound subjects, compound objects, and pairs after prepositions.",
    "把代词和人名并列时，很容易选错格，比如写成 *Lina and me walked home* 或 *Mom drove Lina and I*。遮住人名单独试一下：*I walked home* 和 *Mom drove me*，所以应该是 **Lina and I** 与 **Lina and me**。本节练习在并列主语、并列宾语以及介词后的并列结构中选用正确的代词。",
  ],
  after: ["pronoun-case"],
  points: [
    choose(
      "pronouns-as-subjects-and-objects",
      ["Pronouns Paired with a Noun", "与名词并列的代词"],
      [
        "When a pronoun is joined to a noun with *and* or *or*, cover the noun and try the pronoun alone. *Amara and ___ visited Timbuktu*: *I visited*, so **Amara and I**. *The guide showed Amara and ___ the library*: *showed me*, so **Amara and me**. Use *myself* only when *I* is already the subject: *I taught myself*.\n\n> **Watch out.** Do not use *I* as an object just because it sounds polite, and do not use *myself* as a substitute for *I* or *me*.",
        "当代词与名词用 *and* 或 *or* 连在一起时，遮住名词，单独试一试代词。*Amara and ___ visited Timbuktu*：*I visited*，所以用 **Amara and I**。*The guide showed Amara and ___ the library*：*showed me*，所以用 **Amara and me**。只有当 *I* 已经是主语时才用 *myself*：*I taught myself*。\n\n> **注意。** 不要因为觉得 *I* 听起来更礼貌就在宾语位置用 *I*，也不要拿 *myself* 代替 *I* 或 *me*。",
      ],
      ["Which pronoun completes the sentence?", "哪个代词能补全句子？"],
      `
${pairLines}
        Amara and ___ visited the old mosque.|I|me|myself
        The guide showed Amara and ___ the library.|me|I|myself
        My cousin and ___ read about Mansa Musa.|I|me|myself
        The teacher gave Kofi and ___ a map of Mali.|me|I|myself
        ___ and her brother learned to play the kora.|She|Her|Herself
        The griot sang for the children and ___.|us|we|ourselves
        ___ and the other traders crossed the desert.|He|Him|Himself
        The scholar thanked Musa and ___ for the books.|him|he|himself
        Ama and ___ wrote a report on Timbuktu.|I|me|myself
        Mr. Diallo asked Ama and ___ to read aloud.|me|I|myself
        ___ and their parents went to the market.|They|Them|Themselves
        The merchant sold the salt to Ali and ___.|them|they|themselves
        You and ___ can finish the poster together.|I|me|myself
        The prize went to my partner and ___.|me|I|myself
        ___ and Fatou were chosen to lead the tour.|We|Us|Ourselves
        Grandma told Fatou and ___ a story about Sundiata.|us|we|ourselves
        Either Musa or ___ will carry the drum.|he|him|himself
        The class voted for either Musa or ___.|him|he|himself
        My sister and ___ built a model of the mosque.|I|me|myself
        The museum gave my sister and ___ free tickets.|me|I|myself
        ___ and the scholars studied the stars.|She|Her|Herself
        The camel followed the boy and ___.|her|she|herself
        Neither Kwame nor ___ had seen a real salt slab.|I|me|myself
        The guide warned Kwame and ___ about the heat.|me|I|myself
        ___ and their teacher visited the archive.|They|Them|Themselves
        The archive was opened for the students and ___.|them|they|themselves
        You and ___ should practice the speech.|she|her|herself
        The judges praised you and ___.|her|she|herself
        Our class and ___ took the same bus.|they|them|themselves
        The driver waited for our class and ___.|them|they|themselves
      `,
      (right) => [
        `**${right}** is the form the pronoun takes alone in this slot, so it stays in the same case when paired with a noun.\n\n**Check.** Drop the other noun and read the sentence with just *${right}*; the verb or preposition matches it cleanly.`,
        `**${right}** 是这个代词单独用在该位置时的形式，与名词并列时格保持不变。\n\n**检验。** 去掉并列的另一个名词，只留 *${right}* 读一遍，动词或介词都能顺畅衔接。`,
      ],
      [
        [
          "*{wrong}* is the wrong case: cover the other person and try *{wrong}* alone, and the sentence no longer works.",
          "*{wrong}* 的格不对：遮住另一个人，单独试一试 *{wrong}*，句子就不通了。",
        ],
        [
          "*{wrong}* is a reflexive pronoun, which is used only when the same person is already the subject of the sentence.",
          "*{wrong}* 是反身代词，只有当同一个人已经是句子的主语时才用。",
        ],
      ],
    ),
    choose(
      "pronouns-after-prepositions",
      ["Pronouns after Prepositions", "介词后的代词"],
      [
        "A pronoun after a preposition such as *between*, *for*, *with*, *to* or *except* is an **object**, so it takes the object form, even in a pair: *between you and **me***, *for her and **him***, *with Ama and **us***. *Between you and I* is a common mistake; try the pronoun alone: *between me*.\n\n> **Watch out.** *Between* always needs two things, so *between me* sounds incomplete — test with *between us* instead, which uses the same object case.",
        "*between*、*for*、*with*、*to* 或 *except* 这样的介词后面的代词是**宾语**，所以要用宾格形式，即使在并列结构中也是如此：*between you and **me***、*for her and **him***、*with Ama and **us***。*between you and I* 是常见的错误；单独试一试代词：*between me*。\n\n> **注意。** *between* 后面通常跟两个对象，单说 *between me* 听起来不完整；可以换成 *between us* 来测，两者同属宾格。",
      ],
      ["Which pronoun completes the sentence?", "哪个代词能补全句子？"],
      `
${prepLines}
        Keep this secret between you and ___.|me|I|myself
        The gift is for Ama and ___.|him|he|himself
        Everyone came except Musa and ___.|her|she|herself
        Come to the market with my brother and ___.|me|I|myself
        The teacher divided the books between Kofi and ___.|me|I|myself
        This letter is addressed to you and ___.|him|he|himself
        Sit beside Fatou and ___.|us|we|ourselves
        The guide walked ahead of the scholars and ___.|them|they|themselves
        There is no difference between you and ___.|her|she|herself
        The story was told to the children and ___.|us|we|ourselves
        The map was drawn by Ali and ___.|me|I|myself
        I bought a drink for Ama and ___.|her|she|herself
        No one but you and ___ knows the answer.|me|I|myself
        The traders shared the water with the guides and ___.|them|they|themselves
        Stand between Kwame and ___ in the photo.|me|I|myself
        The camel walked behind the merchant and ___.|him|he|himself
        The prize was split among Ama, Kofi and ___.|me|I|myself
        The teacher was proud of you and ___.|me|I|myself
        Send the photos to Fatou and ___.|us|we|ourselves
        The decision is up to you and ___.|them|they|themselves
        Without you and ___, the play would fail.|her|she|herself
        The rules apply to the captain and ___.|him|he|himself
        This argument is between my sister and ___.|me|I|myself
        We saved seats for the guests and ___.|them|they|themselves
        Everyone laughed except Musa and ___.|me|I|myself
        The coach talked to my partner and ___.|me|I|myself
        The books were given to the scholars and ___.|us|we|ourselves
        A letter came for you and ___.|her|she|herself
        The driver waited for Ali and ___.|him|he|himself
        The story is about the king and ___.|her|she|herself
      `,
      (right) => [
        `**${right}** is the object form, which a pronoun takes after a preposition even when it is paired with another person.\n\n**Check.** Replace the whole pair after the preposition with *us* or *them*: both are object forms, confirming that *${right}* belongs in the slot.`,
        `**${right}** 是宾格形式，介词后面的代词即便在并列结构里也要用宾格。\n\n**检验。** 把介词后面的整个并列结构换成 *us* 或 *them*，它们都是宾格，印证这里该用 *${right}*。`,
      ],
      [
        [
          "*{wrong}* is the subject form, but after a preposition the pronoun is an object; try it alone after the preposition.",
          "*{wrong}* 是主格形式，但介词后面的代词是宾语；单独把它放在介词后面试一试。",
        ],
        [
          "*{wrong}* is reflexive, used only when the same person is the subject, which is not so here.",
          "*{wrong}* 是反身代词，只有当同一个人是主语时才用，而这里不是。",
        ],
      ],
    ),
  ],
});

const clauseLabels: Readonly<Record<string, Label>> = {
  "adjective clause": {
    zh: "形容词从句",
    why: [
      "It describes a noun and tells which one or what kind, usually beginning with *who*, *which*, *that*, *whose* or *where*.\n\n**Check.** Look right before the clause: it sits next to a noun and narrows which one the sentence means.",
      "它修饰一个名词，说明是哪一个或哪一种，通常以 *who*、*which*、*that*、*whose* 或 *where* 开头。\n\n**检验。** 看从句紧前面：它紧挨着一个名词，并且限定了句子指的具体是哪一个。",
    ],
    not: ["An adjective clause describes a noun, and this clause does not describe one.", "形容词从句描述名词，而这个从句并不描述名词。"],
  },
  "adverb clause": {
    zh: "副词从句",
    why: [
      "It tells when, why, where or under what condition the main action happens, beginning with a subordinator such as *when*, *because*, *if* or *although*.\n\n**Check.** Drop the clause from the sentence: the main clause still stands on its own, and the dropped clause answered *when?*, *why?* or *under what condition?*.",
      "它说明主要动作在何时、为何、何地或在什么条件下发生，以 *when*、*because*、*if* 或 *although* 等从属连词开头。\n\n**检验。** 去掉这个从句后主句依然完整，而去掉的部分回答的正是“什么时候”“为什么”或“在什么条件下”。",
    ],
    not: [
      "An adverb clause tells when, why or under what condition, and this clause does not do that.",
      "副词从句说明时间、原因或条件，而这个从句不是这样。",
    ],
  },
  "noun clause": {
    zh: "名词从句",
    why: [
      "It does the job of a noun, acting as the subject or object of the sentence, often beginning with *what*, *that*, *how*, *why* or *whoever*.\n\n**Check.** Replace the entire italicized clause with the single pronoun *it* or *something*: the sentence still reads grammatically.",
      "它起名词的作用，作句子的主语或宾语，常以 *what*、*that*、*how*、*why* 或 *whoever* 开头。\n\n**检验。** 把整段斜体从句替换成单个代词 *it* 或 *something*，句子在语法上依然成立。",
    ],
    not: ["A noun clause works as a subject or object, and this clause does not.", "名词从句作主语或宾语，而这个从句不是。"],
  },
};

const adverbJobs: Readonly<Record<string, Label>> = {
  time: {
    zh: "时间",
    why: [
      "The clause tells **when** the main action happens, introduced by a time subordinator such as *when*, *after*, *before*, *while* or *until*.\n\n**Check.** Ask *When did the main action happen?* — the italicized clause answers directly.",
      "这个从句说明主要动作**何时**发生，由 *when*、*after*、*before*、*while* 或 *until* 等时间连词引导。\n\n**检验。** 问一句“主要动作在什么时候发生？”，斜体从句正好给出回答。",
    ],
    not: ["This clause does not tell when the action happens.", "这个从句并不说明动作何时发生。"],
  },
  reason: {
    zh: "原因",
    why: [
      "The clause tells **why** the main action happens, introduced by *because*, *since* or *as*.\n\n**Check.** Swap the opener for *because* if it is *since* or *as* — the cause-and-effect link stays the same.",
      "这个从句说明主要动作**为什么**发生，由 *because*、*since* 或 *as* 引导。\n\n**检验。** 如果开头是 *since* 或 *as*，换成 *because* 读一遍，因果关系完全一致。",
    ],
    not: ["This clause does not give a reason for the action.", "这个从句并不给出动作的原因。"],
  },
  condition: {
    zh: "条件",
    why: [
      "The clause tells **under what condition** the main action happens, introduced by *if*, *unless* or *as long as*.\n\n**Check.** Ask whether the main action depends on this clause being true first — it does.",
      "这个从句说明主要动作**在什么条件下**发生，由 *if*、*unless* 或 *as long as* 引导。\n\n**检验。** 看主要动作是否以这个从句先成立为前提——确实如此。",
    ],
    not: ["This clause does not set a condition for the action.", "这个从句并不为动作设定条件。"],
  },
  contrast: {
    zh: "对比",
    why: [
      "The clause sets up something **in contrast** to the main idea, introduced by *although*, *though* or *even though*.\n\n**Check.** Notice that the main clause happens *in spite of* the italicized clause, not because of it.",
      "这个从句提出与主要意思**相对比**的内容，由 *although*、*though* 或 *even though* 引导。\n\n**检验。** 主句发生的事情是“尽管如此”依然成立，而不是由斜体从句引起的。",
    ],
    not: ["This clause does not set up a contrast with the main idea.", "这个从句并不提出与主要意思相对比的内容。"],
  },
};

const clauses = topic("grammar", {
  id: "adjective-and-adverb-clauses",
  title: ["Adjective and Adverb Clauses", "形容词从句与副词从句"],
  summary: [
    "A dependent clause can describe a noun, as an adjective does, or tell when, why or under what condition, as an adverb does.",
    "从属从句可以像形容词一样描述名词，也可以像副词一样说明时间、原因或条件。",
  ],
  intro: [
    "Dependent clauses do different jobs in a sentence. In *the bridge that crosses the river*, the clause describes the noun *bridge*; in *before the rain started, we packed up*, the clause tells when the action happened. In this topic you identify adjective, adverb, and noun clauses and tell what job an adverb clause performs.",
    "从属从句在句中承担不同的角色。在 *the bridge that crosses the river* 里，从句修饰名词 *bridge*；在 *before the rain started, we packed up* 里，从句说明动作发生的时间。本节练习区分形容词从句、副词从句和名词从句，并判断副词从句表达的逻辑关系。",
  ],
  after: ["relative-clauses"],
  points: [
    label(
      "naming-the-clause",
      ["Naming the Clause", "辨认从句"],
      [
        "A dependent clause does one of three jobs. An **adjective clause** describes a noun: *the scholar **who copied the book***. An **adverb clause** tells when, why, where or under what condition: ***when the caravan arrived***, *the market filled*. A **noun clause** works as a noun, as the subject or the object: *No one knew **what the letter said***.\n\n> **Watch out.** The word *that* can start either an adjective clause (*the book **that I read***) or a noun clause (*I know **that it rained***). Test whether the clause describes a noun or can be replaced by *it*.",
        "从属从句起三种作用之一。**形容词从句**描述名词：*the scholar **who copied the book***。**副词从句**说明时间、原因、地点或条件：***when the caravan arrived***, *the market filled*。**名词从句**起名词的作用，作主语或宾语：*No one knew **what the letter said***。\n\n> **注意。** *that* 既可以引导形容词从句（*the book **that I read***），也可以引导名词从句（*I know **that it rained***）。要检验它是修饰名词，还是能整体替换成 *it*。",
      ],
      ["What kind of clause is in italics?", "斜体部分是哪种从句？"],
      `
${clauseNames}
        The scholar *who copied the book* lived in Timbuktu.|adjective clause
        *When the caravan arrived*, the market filled with people.|adverb clause
        No one knew *what the letter said*.|noun clause
        The salt *that the traders carried* came from the north.|adjective clause
        The city grew rich *because it controlled the gold trade*.|adverb clause
        *What Mansa Musa gave away* made prices fall in Cairo.|noun clause
        Mali was an empire *whose rulers were very rich*.|adjective clause
        *If the wells were dry*, the caravan turned back.|adverb clause
        Historians believe *that the mosque was built in 1327*.|noun clause
        The griot *who sang the story* was very old.|adjective clause
        *Although the desert was dangerous*, traders crossed it every year.|adverb clause
        The scholars asked *how the planets moved*.|noun clause
        The manuscripts, *which were kept in wooden chests*, survived for centuries.|adjective clause
        The travelers rested *until the heat of the day had passed*.|adverb clause
        *Whoever controlled the river* controlled the trade.|noun clause
        Timbuktu is the city *where the great library stood*.|adjective clause
        *Since gold was plentiful*, the emperor gave much of it away.|adverb clause
        We learned *why salt was so valuable*.|noun clause
        The camels *that led the caravan* wore bells.|adjective clause
        *Before the sun rose*, the caravan was already moving.|adverb clause
        The guide explained *what each sign meant*.|noun clause
        The king *whom the people loved* ruled for twenty years.|adjective clause
        Farmers planted crops *after the rains came*.|adverb clause
        *That the empire was rich* is clear from the records.|noun clause
        The river *that floods each year* made the soil rich.|adjective clause
        *Unless a guide led them*, travelers could get lost.|adverb clause
        The visitors wondered *where the gold came from*.|noun clause
        Musa built a mosque *that still stands today*.|adjective clause
        *As the empire grew*, more scholars arrived.|adverb clause
        The teacher asked *who had read the chapter*.|noun clause
      `,
      clauseLabels,
    ),
    label(
      "what-an-adverb-clause-tells",
      ["What an Adverb Clause Tells", "副词从句说明什么"],
      [
        "The first word of an **adverb clause** tells you its job. *When*, *after*, *before*, *while* and *until* tell **time**. *Because*, *since* and *as* (meaning because) give a **reason**. *If*, *unless* and *as long as* set a **condition**. *Although*, *though* and *even though* set up a **contrast**.\n\n> **Watch out.** *Since* and *as* can show either time or reason. Read the meaning of the whole sentence: if *because* can replace the word without changing the sense, the clause gives a reason.",
        "**副词从句**的第一个词说明它的作用。*when*、*after*、*before*、*while* 和 *until* 说明**时间**。*because*、*since* 和 *as*（意为因为）给出**原因**。*if*、*unless* 和 *as long as* 设定**条件**。*although*、*though* 和 *even though* 提出**对比**。\n\n> **注意。** *since* 和 *as* 既可能表时间也可能表原因。要读懂整句意思：如果换成 *because* 意思不变，就表示原因。",
      ],
      ["What does the clause in italics tell?", "斜体的从句说明什么？"],
      `
${adverbTells}
        *When the rains ended*, the traders set out.|time
        The traders set out *because the rains had ended*.|reason
        The traders will set out *if the rains end soon*.|condition
        *Although the rains had ended*, the traders waited.|contrast
        *After the prayers were over*, the scholars began to teach.|time
        The library grew *because families collected books*.|reason
        *Unless the wells have water*, no caravan can cross.|condition
        *Even though the journey was long*, Musa reached Mecca.|contrast
        The camels drank *before they entered the desert*.|time
        *Since salt kept food from spoiling*, people paid well for it.|reason
        You may borrow the book *as long as you return it*.|condition
        *Though Timbuktu was small*, its scholars were famous.|contrast
        The market stayed open *until the sun went down*.|time
        *As the gold mines were secret*, few traders knew their place.|reason
        *If the emperor agreed*, the city would build a school.|condition
        *Although gold was plentiful*, salt was harder to find.|contrast
        *While the griot sang*, the children listened quietly.|time
        The prices in Cairo fell *because Musa gave away so much gold*.|reason
        The traders would not sell *unless the price was fair*.|condition
        *Even though the manuscripts were old*, the ink was still dark.|contrast
        *Before he left for Mecca*, Musa chose a ruler to govern.|time
        The city was safe *since the army guarded the river*.|reason
        *If you visit Djenné*, you can see the mud mosque.|condition
        *Though the walls are made of mud*, the mosque has stood for a century.|contrast
        The scholars copied the books *after the originals grew worn*.|time
        *Because the river flooded*, the fields were rich.|reason
        The guide will lead us *as long as we follow his rules*.|condition
        *Although the empire fell*, its books survived.|contrast
        *Until the new road was built*, the trip took a month.|time
        *As it was too hot to travel*, the caravan rested at noon.|reason
      `,
      adverbJobs,
    ),
  ],
});

const interrupters = topic("grammar", {
  id: "commas-with-interrupters",
  title: ["Commas with Interrupters", "插入语的逗号"],
  summary: [
    "Words that interrupt a sentence, such as however, of course, names of people spoken to and yes or no, are set off by commas.",
    "打断句子的词，如 however、of course、直接称呼的人名以及 yes 或 no，要用逗号隔开。",
  ],
  intro: [
    "Side comments and direct names step briefly out of a sentence's main grammar, so commas fence them off: *The train, indeed, left on time* and *Wait, Leo, you forgot your scarf.* Drop the fenced-off words and the sentence still flows cleanly. In this topic you place commas around interrupters, direct address, and opening *yes*, *no*, or *well*.",
    "插入的评论和直接称呼的人名暂时跳出了句子的主干结构，需要用逗号隔开，例如 *The train, indeed, left on time* 和 *Wait, Leo, you forgot your scarf.* 去掉逗号隔开的部分，句子依然通顺完整。本节练习给插入语、称呼语以及句首的 *yes*、*no*、*well* 正确加逗号。",
  ],
  after: ["commas-with-nonessential-elements"],
  points: [
    choose(
      "commas-around-interrupters",
      ["Commas around Interrupters", "插入语两边的逗号"],
      [
        "An **interrupter** is a word or phrase that breaks into a sentence to comment on it: *however*, *of course*, *for example*, *in fact*, *I think*, *by the way*. Set it off with commas: a comma **before and after** it in the middle of a sentence, one comma after it at the start, one before it at the end. *The storm, however, missed the city.*\n\n> **Watch out.** When an interrupter sits in the middle of a sentence, writers often drop the second comma (*The storm, however missed the city*). Always pair both commas.",
        "**插入语**是插进句子里对句子加以评论的词或短语：*however*、*of course*、*for example*、*in fact*、*I think*、*by the way*。用逗号把它隔开：在句子中间时**前后**各一个逗号，在句首时后面一个逗号，在句末时前面一个逗号。*The storm, however, missed the city.*\n\n> **注意。** 插入语位于句中时，最容易漏掉后面那个逗号（*The storm, however missed the city*）。句中插入语前后两个逗号必须成对出现。",
      ],
      ["Which sentence is punctuated correctly?", "哪个句子的标点正确？"],
      `
${interrupterLines}
        the vaccine however was not ready|The vaccine, however, was not ready.|The vaccine, however was not ready.|The vaccine however, was not ready.|The vaccine, however, was not, ready.
        the doctor of course washed her hands|The doctor, of course, washed her hands.|The doctor, of course washed her hands.|The doctor of course, washed her hands.|The doctor, of course, washed her, hands.
        smallpox in fact has been ended|Smallpox, in fact, has been ended.|Smallpox, in fact has been ended.|Smallpox in fact, has been ended.|Smallpox, in fact, has been, ended.
        many diseases for example spread through water|Many diseases, for example, spread through water.|Many diseases, for example spread through water.|Many diseases for example, spread through water.|Many diseases, for example, spread through, water.
        the clinic I think opens at nine|The clinic, I think, opens at nine.|The clinic, I think opens at nine.|The clinic I think, opens at nine.|The clinic, I think, opens at, nine.
        the fever by the way is going down|The fever, by the way, is going down.|The fever, by the way is going down.|The fever by the way, is going down.|The fever, by the way, is going, down.
        however the germ was hard to see|However, the germ was hard to see.|However the germ, was hard to see.|However the germ was, hard to see.|However, the germ was hard to, see.
        of course you should rest|Of course, you should rest.|Of course you, should rest.|Of, course you should rest.|Of course, you should, rest.
        in fact the cure was simple|In fact, the cure was simple.|In fact the cure, was simple.|In, fact the cure was simple.|In fact, the cure was, simple.
        the town was spared fortunately|The town was spared, fortunately.|The town, was spared fortunately.|The town was, spared fortunately.|The town was spared,, fortunately.
        hand washing on the other hand is free|Hand washing, on the other hand, is free.|Hand washing, on the other hand is free.|Hand washing on the other hand, is free.|Hand washing, on the other hand, is, free.
        the result as you can see was clear|The result, as you can see, was clear.|The result, as you can see was clear.|The result as you can see, was clear.|The result, as you can see, was, clear.
        Jenner's idea surprisingly worked|Jenner's idea, surprisingly, worked.|Jenner's idea, surprisingly worked.|Jenner's idea surprisingly, worked.|Jenner's idea, surprisingly,, worked.
        the outbreak therefore ended quickly|The outbreak, therefore, ended quickly.|The outbreak, therefore ended quickly.|The outbreak therefore, ended quickly.|The outbreak, therefore, ended, quickly.
        the nurse in my opinion deserves a prize|The nurse, in my opinion, deserves a prize.|The nurse, in my opinion deserves a prize.|The nurse in my opinion, deserves a prize.|The nurse, in my opinion, deserves a, prize.
        for example cholera spreads in dirty water|For example, cholera spreads in dirty water.|For example cholera, spreads in dirty water.|For, example cholera spreads in dirty water.|For example, cholera spreads in dirty, water.
        the pump was the cause after all|The pump was the cause, after all.|The pump, was the cause after all.|The pump was, the cause after all.|The pump was the cause, after, all.
        the patients meanwhile waited outside|The patients, meanwhile, waited outside.|The patients, meanwhile waited outside.|The patients meanwhile, waited outside.|The patients, meanwhile, waited, outside.
        the germ theory at first seemed strange|The germ theory, at first, seemed strange.|The germ theory, at first seemed strange.|The germ theory at first, seemed strange.|The germ theory, at first, seemed, strange.
        honestly I hate getting shots|Honestly, I hate getting shots.|Honestly I hate, getting shots.|Honestly I, hate getting shots.|Honestly, I hate getting, shots.
        the doctors to be sure were tired|The doctors, to be sure, were tired.|The doctors, to be sure were tired.|The doctors to be sure, were tired.|The doctors, to be sure, were, tired.
        the medicine as a result was cheaper|The medicine, as a result, was cheaper.|The medicine, as a result was cheaper.|The medicine as a result, was cheaper.|The medicine, as a result, was, cheaper.
        the city nevertheless built new sewers|The city, nevertheless, built new sewers.|The city, nevertheless built new sewers.|The city nevertheless, built new sewers.|The city, nevertheless, built new, sewers.
        the shot it seems did not hurt|The shot, it seems, did not hurt.|The shot, it seems did not hurt.|The shot it seems, did not hurt.|The shot, it seems, did not, hurt.
        Lister's spray for instance killed germs|Lister's spray, for instance, killed germs.|Lister's spray, for instance killed germs.|Lister's spray for instance, killed germs.|Lister's spray, for instance, killed, germs.
        the experiment unfortunately failed|The experiment, unfortunately, failed.|The experiment, unfortunately failed.|The experiment unfortunately, failed.|The experiment, unfortunately,, failed.
        you should wear a mask by the way|You should wear a mask, by the way.|You should wear, a mask by the way.|You should, wear a mask by the way.|You should wear a mask, by the, way.
        clean water in short saves lives|Clean water, in short, saves lives.|Clean water, in short saves lives.|Clean water in short, saves lives.|Clean water, in short, saves, lives.
        the cough I believe is getting better|The cough, I believe, is getting better.|The cough, I believe is getting better.|The cough I believe, is getting better.|The cough, I believe, is getting, better.
        indeed the plan worked|Indeed, the plan worked.|Indeed the plan, worked.|Indeed the, plan worked.|Indeed, the plan, worked.
      `,
      (right) => [
        `*${right}* sets the interrupter off cleanly with commas wherever it breaks into the sentence, before and after it in the middle.\n\n**Check.** Lift out the words set off by commas: what remains is a complete sentence with no stray comma breaking the subject from its verb.`,
        `*${right}* 在插入语打断句子的地方用逗号把它隔开，句中前后成对加逗号。\n\n**检验。** 拿掉逗号隔开的插入语后，剩下的部分是一句完整的句子，主语和谓语之间没有多余的逗号。`,
      ],
      [
        [
          "*{wrong}* leaves out one of the commas, so the interrupter is not fully set off.",
          "*{wrong}* 漏掉了一个逗号，插入语没有被完全隔开。",
        ],
        [
          "*{wrong}* puts a comma in the wrong place, splitting the sentence where nothing interrupts it.",
          "*{wrong}* 把逗号放错了地方，在没有插入语的地方把句子断开了。",
        ],
        [
          "*{wrong}* sets the interrupter off but adds one comma too many, cutting the sentence where nothing breaks into it.",
          "*{wrong}* 隔开了插入语，却多加了一个逗号，在没有插入语的地方把句子断开了。",
        ],
      ],
    ),
    choose(
      "commas-with-names-and-yes-or-no",
      ["Commas with Names and Yes or No", "称呼语和 yes、no 的逗号"],
      [
        "Commas also set off the **name of the person spoken to** (*Doctor, is it serious?* *Thank you, Maria.* *I think, Sam, that you are right.*) and words such as **yes**, **no** and **well** at the start of an answer (*Yes, I had the shot.* *Well, it hurt a little.*). Without the comma, *Let's eat, Grandma* turns into *Let's eat Grandma*.\n\n> **Watch out.** Put commas around a name only when you are speaking *to* that person, not *about* them: *Thank you, Maria* needs a comma, while *I thanked Maria* does not.",
        "逗号还用来隔开**直接称呼的人名**（*Doctor, is it serious?* *Thank you, Maria.* *I think, Sam, that you are right.*）以及回答开头的 **yes**、**no** 和 **well** 等词（*Yes, I had the shot.* *Well, it hurt a little.*）。没有逗号的话，*Let's eat, Grandma* 就成了 *Let's eat Grandma*。\n\n> **注意。** 只有**对着**某人说话时的称呼才加逗号，提到某人时不加：*Thank you, Maria* 要加逗号，而 *I thanked Maria* 不加。",
      ],
      ["Which sentence is punctuated correctly?", "哪个句子的标点正确？"],
      `
${nameLines}
        doctor is it serious|Doctor, is it serious?|Doctor is it, serious?|Doctor is it serious?
        thank you Maria|Thank you, Maria.|Thank, you Maria.|Thank you Maria.
        yes I had the shot|Yes, I had the shot.|Yes I, had the shot.|Yes I had the shot.
        no the clinic is closed|No, the clinic is closed.|No the clinic, is closed.|No the clinic is closed.
        well it hurt a little|Well, it hurt a little.|Well it, hurt a little.|Well it hurt a little.
        I think Sam that you are right|I think, Sam, that you are right.|I think, Sam that you are right.|I think Sam, that you are right.
        nurse can you help me|Nurse, can you help me?|Nurse can you, help me?|Nurse can you help me?
        please sit down Mr. Ito|Please sit down, Mr. Ito.|Please, sit down Mr. Ito.|Please sit down Mr. Ito.
        yes the fever is gone|Yes, the fever is gone.|Yes the fever, is gone.|Yes the fever is gone.
        Lena did you wash your hands|Lena, did you wash your hands?|Lena did you, wash your hands?|Lena did you wash your hands?
        no thank you|No, thank you.|No thank, you.|No thank you.
        well that is good news|Well, that is good news.|Well that, is good news.|Well that is good news.
        listen class this is important|Listen, class, this is important.|Listen, class this is important.|Listen class, this is important.
        are you feeling better Grandpa|Are you feeling better, Grandpa?|Are you, feeling better Grandpa?|Are you feeling better Grandpa?
        yes Doctor I will take the medicine|Yes, Doctor, I will take the medicine.|Yes, Doctor I will take the medicine.|Yes Doctor, I will take the medicine.
        no Ben the pills are not candy|No, Ben, the pills are not candy.|No, Ben the pills are not candy.|No Ben, the pills are not candy.
        well I suppose you are right|Well, I suppose you are right.|Well I suppose, you are right.|Well I suppose you are right.
        come in Ms. Lopez|Come in, Ms. Lopez.|Come, in Ms. Lopez.|Come in Ms. Lopez.
        Dad where is the first aid kit|Dad, where is the first aid kit?|Dad where is, the first aid kit?|Dad where is the first aid kit?
        your test results Mrs. Kim are normal|Your test results, Mrs. Kim, are normal.|Your test results, Mrs. Kim are normal.|Your test results Mrs. Kim, are normal.
        yes the vaccine is safe|Yes, the vaccine is safe.|Yes the vaccine, is safe.|Yes the vaccine is safe.
        no I do not have a cough|No, I do not have a cough.|No I do, not have a cough.|No I do not have a cough.
        good morning everyone|Good morning, everyone.|Good, morning everyone.|Good morning everyone.
        well the shot is over now|Well, the shot is over now.|Well the shot, is over now.|Well the shot is over now.
        tell me Ana how do you feel|Tell me, Ana, how do you feel?|Tell me, Ana how do you feel?|Tell me Ana, how do you feel?
        thanks Coach|Thanks, Coach.|Thanks Coach.|Thanks, Coach,.
        yes Ms. Patel I finished the report|Yes, Ms. Patel, I finished the report.|Yes, Ms. Patel I finished the report.|Yes Ms. Patel, I finished the report.
        sir your ticket please|Sir, your ticket, please.|Sir your ticket, please.|Sir, your ticket please.
        no I have never had measles|No, I have never had measles.|No I have never, had measles.|No I have never had measles.
        let's eat Grandma|Let's eat, Grandma.|Let's, eat Grandma.|Let's eat Grandma.
      `,
      (right) => [
        `*${right}* sets off the person spoken to — or the opening *yes*, *no* or *well* — with commas in every spot where it touches the rest of the sentence.\n\n**Check.** Drop the direct name or opening word: the remaining sentence still reads smoothly with no broken phrase.`,
        `*${right}* 用逗号把直接称呼的人名或开头的 *yes*、*no*、*well* 与句子其余部分准确隔开。\n\n**检验。** 去掉称呼语或句首的应答词后，剩下的句子依然顺畅完整，没有被逗号劈开的短语。`,
      ],
      [
        ["*{wrong}* misses a comma or puts one where nothing should be set off.", "*{wrong}* 漏了逗号，或在不该隔开的地方放了逗号。"],
        [
          "*{wrong}* leaves the name or the opening word without the commas that set it off.",
          "*{wrong}* 没有用逗号把称呼语或开头的词隔开。",
        ],
      ],
    ),
  ],
});

const tricky = topic("grammar", {
  id: "agreement-with-tricky-subjects",
  title: ["Agreement with Tricky Subjects", "棘手主语的主谓一致"],
  summary: [
    "Some subjects look plural but take a singular verb, such as news and mathematics; others, such as scissors, are always plural; a group or an amount is usually singular.",
    "有些主语看起来是复数却用单数动词，如 news 和 mathematics；有些如 scissors 总是复数；集体或数量通常是单数。",
  ],
  intro: [
    "Not every noun ending in *-s* is plural, and not every group noun is plural either: *Checkers is easy to learn*, *Two miles is a quick jog*, yet *My tweezers are missing.* Matching the verb to what the subject actually counts — one unit or a plural pair — keeps agreement steady. In this topic you match verbs to tricky *-s* nouns, collective nouns, and amounts.",
    "并不是所有以 *-s* 结尾的名词都是复数，也不是所有集体名词都是复数：*Checkers is easy to learn* 和 *Two miles is a quick jog* 用单数，而 *My tweezers are missing* 用复数。按主语实际指代的是一个整体还是成对复数来配动词，主谓一致才不会出错。本节练习处理形复实单名词、成对复数名词以及集体与数量名词的主谓一致。",
  ],
  after: ["subject-verb-agreement-with-phrases-between"],
  points: [
    choose(
      "subjects-that-look-plural",
      ["Subjects That Look Plural", "看起来是复数的主语"],
      [
        "Some nouns end in *-s* but name **one** thing or subject, so they take a singular verb: *news*, *mathematics*, *physics*, *measles*, *economics*, *the United States*. Others name one object but are **always plural**, because the object has two parts: *scissors*, *jeans*, *glasses*, *pants*. Ask whether the word names one thing or a pair.\n\n> **Watch out.** Do not judge a subject by its final *-s* alone: *the news* is singular (*it is*), while *my glasses* is plural (*they are*).",
        "有些名词以 *-s* 结尾，却指**一个**事物或学科，所以用单数动词：*news*、*mathematics*、*physics*、*measles*、*economics*、*the United States*。另一些名词指一件东西，却**总是复数**，因为这件东西由两部分组成：*scissors*、*jeans*、*glasses*、*pants*。要问这个词指的是一个事物还是一对东西。\n\n> **注意。** 不要单凭词尾的 *-s* 决定单复数：*the news* 是单数（可用 *it* 替代），而 *my glasses* 是复数（可用 *they* 替代）。",
      ],
      ["Which verb completes the sentence?", "哪个动词能补全句子？"],
      `
${lookPlural}
        The news ___ good today.|is|are|were
        Mathematics ___ my favorite subject this year.|is|are|were
        Measles ___ a very contagious disease.|is|are|were
        My scissors ___ on the desk right now.|are|is|was
        These jeans ___ too long for me now.|are|is|was
        Physics ___ the study of matter and energy.|is|are|were
        The United States ___ fifty states today.|has|have|had
        My glasses ___ in my bag at the moment.|are|is|was
        Economics ___ about how people use money.|is|are|were
        Her pants ___ covered in paint now.|are|is|was
        The evening news ___ at six every day.|starts|start|started
        Gymnastics ___ a hard sport to learn.|is|are|were
        The tongs ___ hanging by the grill now.|are|is|was
        Civics ___ taught in the eighth grade at our school.|is|are|were
        The pliers ___ in the red toolbox today.|are|is|was
        Mumps ___ rare in this country now.|is|are|were
        The shorts I bought ___ too big.|are|is|was
        Statistics ___ a branch of mathematics.|is|are|were
        My binoculars ___ broken today.|are|is|was
        The Philippines ___ more than seven thousand islands.|has|have|had
        This news ___ hard to believe.|is|are|were
        Athletics ___ popular at our school this term.|is|are|were
        Your sunglasses ___ on your head right now.|are|is|was
        Politics ___ often a topic at dinner these days.|is|are|were
        The tweezers ___ in the first aid kit now.|are|is|was
        Linguistics ___ the study of language.|is|are|were
        My pajamas ___ in the dryer now.|are|is|was
        The Netherlands ___ famous for its tulips.|is|are|were
        Electronics ___ a fast-changing field today.|is|are|were
        These trousers ___ too tight now.|are|is|was
      `,
      (right) => [
        `**${right}** agrees with the subject in number and matches the present tense of the sentence.\n\n**Check.** Substitute *it* if the subject names one field, country, illness, or broadcast, or *they* if it names a two-part tool or garment — *${right}* matches that pronoun.`,
        `**${right}** 在单复数上与主语一致，也符合句子的现在时。\n\n**检验。** 主语指一门学科、国家、疾病或新闻时换成 *it*，指成对工具或衣物时换成 *they*，*${right}* 正好与之搭配。`,
      ],
      [
        [
          "*{wrong}* has the wrong number: check whether this *-s* noun names one single thing or a two-part pair.",
          "*{wrong}* 的单复数不对：要看这个以 *-s* 结尾的名词指的是一件单一事物，还是由两部分组成的成对物品。",
        ],
        ["*{wrong}* is in the past tense, but the sentence speaks of now.", "*{wrong}* 是过去时，而句子说的是现在。"],
      ],
    ),
    choose(
      "groups-and-amounts",
      ["Groups and Amounts", "集体与数量"],
      [
        "A **collective noun** such as *team*, *class*, *family*, *jury* or *committee* names one group, so in American English it usually takes a **singular** verb: *The team is ready.* An **amount** of money, time or distance treated as one sum is singular too: *Ten dollars is too much. Three hours is a long wait.* But *a number of* means many and is plural: *A number of students are sick.*\n\n> **Watch out.** *The number of* is singular (it refers to one figure: *The number of cases is falling*), whereas *a number of* means *many* and is plural (*A number of students are sick*).",
        "**集体名词**如 *team*、*class*、*family*、*jury* 或 *committee* 指一个群体，所以在美国英语中通常用**单数**动词：*The team is ready.* 被当作一个总数的钱、时间或距离也是单数：*Ten dollars is too much. Three hours is a long wait.* 但 *a number of* 表示许多，是复数：*A number of students are sick.*\n\n> **注意。** *the number of* 指一个具体的数量，用单数（*The number of cases is falling*）；而 *a number of* 意为“许多”，用复数（*A number of students are sick*）。",
      ],
      ["Which verb completes the sentence?", "哪个动词能补全句子？"],
      `
${groupLines}
        The team ___ ready for the game now.|is|are|were
        Ten dollars ___ too much for a sandwich today.|is|are|were
        A number of students ___ sick this week.|are|is|was
        The class ___ on a trip to the museum today.|is|are|were
        Three hours ___ a long time to wait now.|is|are|were
        The jury ___ still deciding today.|is|are|were
        A number of doctors ___ studying the virus now.|are|is|was
        The committee ___ every Monday.|meets|meet|met
        Five kilometers ___ a long way to walk today.|is|are|were
        My family ___ visiting Grandma this weekend.|is|are|were
        The number of cases ___ falling this month.|is|are|were
        The audience ___ clapping loudly now.|is|are|was
        Twenty minutes ___ enough time for the test today.|is|are|were
        The band ___ playing in the park tonight.|is|are|were
        A number of birds ___ nesting on the roof now.|are|is|was
        The crowd ___ growing by the minute.|is|are|were
        Two weeks ___ the usual time to recover.|is|are|were
        The staff ___ a meeting at noon today.|has|have|had
        A number of questions ___ still open now.|are|is|was
        The council ___ voting on the plan tonight.|is|are|were
        The flock ___ flying south now.|is|are|were
        A hundred dollars ___ the price of the bike today.|is|are|were
        The orchestra ___ tuning its instruments now.|is|are|were
        The number of visitors ___ higher this year.|is|are|were
        The herd ___ moving toward the river now.|is|are|were
        A number of players ___ injured this season.|are|is|was
        The panel ___ its report tomorrow.|gives|give|gave
        Fifty grams ___ the right amount of sugar for this recipe.|is|are|were
        The group ___ waiting for the bus right now.|is|are|were
        A number of shops ___ closed today.|are|is|was
      `,
      (right) => [
        `**${right}** agrees with the subject in number and matches the present tense of the sentence.\n\n**Check.** Replace a single group, total amount, or *the number of …* with *it*, and replace *a number of …* with *many of them* — *${right}* fits the replacement.`,
        `**${right}** 在单复数上与主语一致，也符合句子的现在时。\n\n**检验。** 把单一集体、总数或 *the number of …* 换成 *it*，把 *a number of …* 换成 *many of them*，*${right}* 正好与之搭配。`,
      ],
      [
        [
          "*{wrong}* has the wrong number: a group, a total amount, or *the number of* counts as singular, while *a number of* counts as plural.",
          "*{wrong}* 的单复数不对：集体、总数或 *the number of* 算作单数，而 *a number of* 算作复数。",
        ],
        [
          "*{wrong}* is in the past tense, but the sentence speaks of now or of a regular schedule.",
          "*{wrong}* 是过去时，而句子说的是现在或常规安排。",
        ],
      ],
    ),
  ],
});

/** grammarTopics7a are the grammar topics of the first five units of grade 7. */
export const grammarTopics7a: readonly TopicDef[] = [
  moodShifts,
  phrasesAndClauses,
  dangling,
  suffixSpelling,
  pairs,
  clauses,
  interrupters,
  tricky,
];
