// Grade 6: grammar of pronouns and clauses: who and whom, who and which, commas with extra information, intensive and
// vague pronouns, agreement across a phrase, numbers, and shifts in pronoun number.

import type { TopicDef } from "@ga/content";
import { everyPair } from "../../levels/words.ts";
import { choose, type Label, label, topic } from "./kit.ts";

// Crossed items: people, things and actions multiply the lines below into a hundred items or more for each bank.

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const join = (lines: readonly string[]) => lines.join("\n");

/** askActs are what someone did; askTimes end a question about it. */
const askActs = [
  "cleaned the kitchen",
  "took my pencil",
  "fed the goldfish",
  "locked the back door",
  "drew this map",
  "moved my chair",
  "ate the last apple",
  "turned off the lights",
  "found the missing key",
  "wrote on the board",
  "watered the plants",
  "opened the window",
] as const;
const askTimes = ["yesterday", "this morning", "after school"] as const;
/** askPeople do the action in a question with whom; askDeeds take whom as their object. */
const askPeople = ["you", "Sam", "the coach", "your sister", "the class", "Grandma"] as const;
const askDeeds = [
  "invite to the picnic",
  "see at the park",
  "call last night",
  "help with the project",
  "thank for the gift",
  "meet at the station",
  "choose for the team",
  "visit in the hospital",
  "follow into the shop",
  "warn about the storm",
] as const;
const askOwned = ["umbrella", "lunch box", "scarf", "phone", "bicycle", "notebook", "cap", "wallet", "drawing", "glove"] as const;
const askPlaces = ["is on the bench", "is left in the hall", "is under the table"] as const;
const whoQuestions = join([
  ...everyPair(askActs, askTimes).map(([act, time]) => `___ ${act} ${time}?|who`),
  ...everyPair(askPeople, askDeeds).map(([who, deed]) => `___ did ${who} ${deed}?|whom`),
  ...everyPair(askOwned, askPlaces).map(([thing, place]) => `___ ${thing} ${place}?|whose`),
]);

/** clausePeople are described by clauses with who, whom and whose. */
const clausePeople = ["girl", "man", "teacher", "nurse", "boy", "woman", "pilot", "coach", "baker", "farmer"] as const;
const clauseDoes = ["fixed our sink", "won the prize", "drove the bus", "found my wallet", "painted the mural"] as const;
const clauseDone = ["we met", "you invited", "the class thanked", "I called", "everyone admired"] as const;
const clauseOwns = ["dog barked all night", "car blocked the road", "son is in my class"] as const;
const clauseEnds = ["lives on our street", "smiled at us", "is my aunt's friend", "moved here last year", "waved goodbye"] as const;
const clauseEnd = (k: number) => clauseEnds[k % clauseEnds.length] ?? "smiled at us";
const whoClauses = join([
  ...everyPair(clausePeople, clauseDoes).map(([who, act], k) => `The ${who} ___ ${act} ${clauseEnd(k)}.|who`),
  ...everyPair(clausePeople, clauseDone).map(([who, act], k) => `The ${who} ___ ${act} ${clauseEnd(k + 2)}.|whom`),
  ...everyPair(clausePeople, clauseOwns).map(([who, act], k) => `The ${who} ___ ${act} ${clauseEnd(k + 1)}.|whose`),
]);

/** relativeNames and relativeThings take clauses of extra information; relativeKept take clauses that tell which one. */
const relativeNames = ["My aunt", "Mr. Ito", "Our coach", "Dr. Patel", "My grandmother", "Ms. Rivera", "Uncle Ravi", "The mayor"] as const;
const relativeAbout = ["lives in Lima", "grew up on a farm", "speaks three languages", "loves jazz", "was born in Kenya"] as const;
const relativeThings = [
  "The old bridge",
  "Our school",
  "The river",
  "My bike",
  "The museum",
  "The town hall",
  "The lake",
  "The park",
] as const;
const relativeFacts = [
  "was built in 1900",
  "is very old",
  "is near my house",
  "was repaired last year",
  "is popular with tourists",
] as const;
const relativeKept = ["book", "map", "song", "cake", "game", "film", "coat", "photo"] as const;
const relativeChosen = ["you lent me", "we found", "I wanted", "she made", "they chose"] as const;
const relativeEnds = ["is on the table", "was perfect", "is my favorite", "got lost", "was a surprise"] as const;
const personEnds = ["visited us last week", "gave a short speech", "baked us a pie", "told a funny story"] as const;
const thingEnds = ["looks lovely in spring", "was in the news", "is closed today", "needs a new sign"] as const;
const relativeLines = join([
  ...everyPair(relativeNames, relativeAbout).map(
    ([who, about], k) => `${who}, ___ ${about}, ${personEnds[k % personEnds.length]}.|who|which|that`,
  ),
  ...everyPair(relativeThings, relativeFacts).map(
    ([what, fact], k) => `${what}, ___ ${fact}, ${thingEnds[k % thingEnds.length]}.|which|who|that`,
  ),
  ...everyPair(relativeKept, relativeChosen).map(
    ([what, chosen], k) => `The ${what} ___ ${chosen} ${relativeEnds[k % relativeEnds.length]}.|that|who|whose`,
  ),
]);

/** whoseThings and whoseGoings make questions with whose and who's. */
const whoseThings = [
  "jacket",
  "backpack",
  "pencil case",
  "kite",
  "water bottle",
  "basketball",
  "hat",
  "sweater",
  "lunch",
  "ruler",
] as const;
const whoseWhere = ["on the floor", "in the car", "by the door"] as const;
const goings = [
  "going to the park",
  "bringing snacks",
  "coming to the concert",
  "reading the poem aloud",
  "taking the bus home",
  "making the posters",
  "playing goalie",
  "joining the club",
  "leading the hike",
  "cooking dinner",
] as const;
const goingTimes = ["today", "after lunch", "this weekend"] as const;
const whoseOwned = ["dog barks at night", "sister sings in the choir", "garden is full of roses"] as const;
const whoDid = ["helped us", "fixed the swing"] as const;
const whoseLines = join([
  ...everyPair(whoseThings, whoseWhere).map(([thing, where]) => `___ ${thing} is ${where}?|whose|who's|who`),
  ...everyPair(goings, goingTimes).map(([going, time]) => `___ ${going} ${time}?|who's|whose|who`),
  ...everyPair(clausePeople, whoseOwned).map(([who, owned], k) => `The ${who} ___ ${owned} ${clauseEnd(k)}.|whose|who's|who`),
  ...everyPair(clausePeople, whoDid).map(([who, did], k) => `The ${who} ___ ${did} ${clauseEnd(k + 3)}.|who|who's|whose`),
]);

/** apposed are a name and words that rename it; apposedActs end their sentences. */
const apposed = [
  ["Mr. Ruiz", "our neighbor"],
  ["Ms. Chen", "the librarian"],
  ["Dr. Oduya", "a dentist"],
  ["Coach Hall", "a former runner"],
  ["Grandma Rose", "a retired teacher"],
  ["Mr. Brooks", "the janitor"],
  ["Aunt Lila", "a pilot"],
  ["Ms. Novak", "our principal"],
] as const;
const apposedActs = ["waved to us", "fixed the clock", "told a funny story", "planted roses", "laughed loudly", "found my keys"] as const;
const keptThings = ["cake", "kite", "bike", "song", "jacket", "photo", "map", "book"] as const;
const keptClauses = ["we bought", "I made", "she found", "you chose"] as const;
const keptEnds = ["was perfect", "is on the shelf", "got wet in the rain"] as const;
const endPlaces = ["Lisbon", "Oslo", "Cairo", "Lima", "Hanoi", "Dublin"] as const;
const endFacts = ["is a capital city", "was busy in summer", "has narrow old streets", "sits beside the water"] as const;
const apposedCross = everyPair(apposed, apposedActs);
const keptCross = everyPair(keptThings, keptClauses).map(
  ([thing, clause], k) => [thing, clause, keptEnds[k % keptEnds.length] ?? ""] as const,
);
const endCross = everyPair(endPlaces, endFacts);
const commaPlaces = join([
  ...apposedCross.map(
    ([[name, words], act]) => `extra facts about ${name}|${name}, ${words}, ${act}.|${name} ${words}, ${act}.|${name}, ${words} ${act}.`,
  ),
  ...keptCross.map(
    ([thing, clause, end]) =>
      `a clause that tells which ${thing}|The ${thing} that ${clause} ${end}.|The ${thing}, that ${clause}, ${end}.|The ${thing} that ${clause}, ${end}.`,
  ),
  ...endCross.map(
    ([place, fact]) =>
      `extra facts at the end|We visited ${place}, which ${fact}.|We visited ${place} which ${fact}.|We visited, ${place} which ${fact}.`,
  ),
]);
const commaKinds = join([
  ...apposedCross.map(([[name, words], act]) => `${name} *${words}* ${act}.|a pair of commas`),
  ...keptCross.map(([thing, clause, end]) => `The ${thing} *that ${clause}* ${end}.|no commas`),
  ...endCross.map(([place, fact]) => `We visited ${place} *which ${fact}*.|one comma before it`),
]);

/** selfPeople are a subject and its -self pronoun, with a nonstandard form and a form that does not match. */
const selfPeople = [
  ["The chef", "himself", "hisself", "themselves"],
  ["The queen", "herself", "herselves", "himself"],
  ["The players", "themselves", "theirselves", "himself"],
  ["We", "ourselves", "ourself", "myself"],
  ["I", "myself", "meself", "yourself"],
  ["The mayor", "herself", "herselves", "itself"],
  ["Our teacher", "himself", "hisself", "ourselves"],
  ["The twins", "themselves", "themself", "herself"],
  ["You and Ana", "yourselves", "yourselfs", "themselves"],
] as const;
const selfActs = [
  "painted the sign",
  "baked the bread",
  "carried the boxes",
  "wrote the letter",
  "built the shed",
  "cleaned the room",
] as const;
const selfTurns = [
  ["hurt", "on the ladder"],
  ["taught", "to knit"],
  ["dried", "with a towel"],
  ["introduced", "to the class"],
  ["saw", "in the mirror"],
  ["reminded", "to stay calm"],
] as const;
const selfFriends = ["Leo", "Ana", "My cousin", "Mr. Diaz", "The coach", "Priya"] as const;
const selfWrong = [
  "and *myself* went to the fair",
  "and *myself* won the race",
  "and *myself* cooked lunch",
  "and *myself* missed the bus",
] as const;
const selfKinds = join([
  ...everyPair(selfPeople.slice(0, 8), selfActs).map(([[who, self], act]) => `${who} *${self}* ${act}.|intensive`),
  ...everyPair(selfPeople.slice(0, 8), selfTurns).map(([[who, self], [verb, tail]]) => `${who} ${verb} *${self}* ${tail}.|reflexive`),
  ...everyPair(selfFriends, selfWrong).map(([who, wrong]) => `${who} ${wrong}.|a mistake`),
]);
const selfJobs = [
  "fixed the roof",
  "painted the room",
  "made the costumes",
  "carried the boxes",
  "planned the trip",
  "cleaned the garage",
  "solved the puzzle",
  "built the fence",
  "wrote the play",
  "baked the pie",
] as const;
const selfForms = join(
  everyPair(selfPeople, selfJobs).map(([[who, right, bad, other], job]) => `${who} ${job} ___.|${right}|${bad}|${other}`),
);

/** vagueGirls and vagueBoys are pairs of the same kind, so he or she could mean either; mixedPairs have one of each. */
const samePairs = [
  ["Ana", "Mia", "she", "her"],
  ["Zoe", "Lily", "she", "her"],
  ["Hana", "Rosa", "she", "her"],
  ["Leo", "Sam", "he", "him"],
  ["Omar", "Ben", "he", "him"],
  ["Tariq", "Max", "he", "him"],
] as const;
const mixedPairs = [
  ["Ana", "Leo", "she"],
  ["Ben", "Zoe", "he"],
  ["Hana", "Omar", "she"],
  ["Max", "Rosa", "he"],
  ["Lily", "Tariq", "she"],
  ["Sam", "Mia", "he"],
] as const;
/** vagueNews are what one friend told another, with the same words in the first person. */
const vagueNews = [
  ["had won the prize", "have won the prize"],
  ["needed a new bike", "need a new bike"],
  ["was late for practice", "am late for practice"],
  ["should apologize to the teacher", "should apologize to the teacher"],
  ["would lead the team", "will lead the team"],
] as const;
/** vaguePlaces are a place where nobody named speaks, and who really speaks there. */
const vaguePlaces = [
  ["station", "the guard"],
  ["airport", "the agents"],
  ["bank", "the teller"],
  ["museum", "the guide"],
  ["clinic", "the nurse"],
  ["library", "the librarian"],
  ["mall", "the manager"],
  ["stadium", "the announcer"],
] as const;
const vagueSaid = [
  "said the doors would close early",
  "told us to wait in line",
  "gave out free maps",
  "asked everyone to be quiet",
] as const;
const vagueAnimals = [
  ["dog", "cat"],
  ["fox", "hen"],
  ["cat", "mouse"],
  ["horse", "goat"],
  ["puppy", "squirrel"],
  ["goose", "duck"],
] as const;
const vagueFalls = ["knocked over a vase", "fell into the pond", "hid under the porch"] as const;
const vagueSpot = join([
  ...everyPair(samePairs, vagueNews).map(([[a, b, p], [news]]) => `${a} told ${b} that *${p}* ${news}.|two possible nouns`),
  ...everyPair(mixedPairs, vagueNews).map(([[a, b, p], [news]]) => `${a} told ${b} that *${p}* ${news}.|clear`),
  ...everyPair(vaguePlaces, vagueSaid).map(([[place], said]) => `At the ${place}, *they* ${said}.|no noun at all`),
]);
const vagueFix = join([
  ...everyPair(samePairs, vagueNews).map(
    ([[a, b, p, obj], [news, mine]]) =>
      `${a} told ${b} that ${p} ${news}.|${a} told ${b}, "I ${mine}."|${a} told ${obj} that ${p} ${news}.|That ${p} ${news}, ${a} told ${b}.`,
  ),
  ...everyPair(vaguePlaces, vagueSaid).map(
    ([[place, who], said]) =>
      `At the ${place}, they ${said}.|At the ${place}, ${who} ${said}.|At the ${place}, it ${said}.|They ${said} at the ${place}.`,
  ),
  ...everyPair(vagueAnimals, vagueFalls).map(
    ([[a, b], fell]) =>
      `When the ${a} chased the ${b}, it ${fell}.|When the ${a} chased the ${b}, the ${b} ${fell}.|When the ${a} chased the ${b}, they ${fell}.|When it chased the ${b}, it ${fell}.`,
  ),
]);

/** heldHeads are one container holding many things; heldVerbs are a singular verb, its plural and a third form, and the rest. */
const heldHeads = ["The box", "A bag", "The basket", "The jar", "A crate", "The bowl"] as const;
const heldThings = ["crayons", "apples", "marbles", "cookies", "shells"] as const;
const heldVerbs = [
  ["sits", "sit", "sitting", "by the door"],
  ["costs", "cost", "costing", "five dollars"],
  ["needs", "need", "needing", "a new label"],
] as const;
/** manyHeads are many things in one place; manyVerbs are a plural verb, its singular and a third form, and the rest. */
const manyHeads = [
  ["The keys to the car", "keys", "car"],
  ["The pages of the book", "pages", "book"],
  ["The cups in the cupboard", "cups", "cupboard"],
  ["The lights in the hall", "lights", "hall"],
  ["The windows of the house", "windows", "house"],
  ["The shelves in the shop", "shelves", "shop"],
] as const;
const manyVerbs = [
  ["need", "needs", "needing", "cleaning"],
  ["look", "looks", "looking", "old"],
  ["are", "is", "was being", "dusty"],
] as const;
const alongHeads = [
  ["My aunt, along with my cousins,", "aunt", "cousins"],
  ["The coach, together with the players,", "coach", "players"],
  ["The teacher, as well as the students,", "teacher", "students"],
  ["Grandpa, along with the twins,", "Grandpa", "twins"],
  ["The captain, together with her crew,", "captain", "crew"],
  ["The mayor, as well as her helpers,", "mayor", "helpers"],
] as const;
const alongVerbs = [
  ["is", "are", "being", "coming to the game"],
  ["plans", "plan", "planning", "to visit us"],
] as const;
const heldCross = everyPair(heldHeads, heldThings).flatMap(([head, things], k) =>
  [0, 1].map((j) => [head, things, heldVerbs[(k + j) % heldVerbs.length] ?? heldVerbs[0]] as const),
);
const manyCross = everyPair(manyHeads, manyVerbs);
const alongCross = everyPair(alongHeads, alongVerbs);
const agreeVerbs = join([
  ...heldCross.map(([head, things, [one, many, other, rest]]) => `${head} of ${things} ___ ${rest}.|${one}|${many}|${other}`),
  ...manyCross.map(([[head], [many, one, other, rest]]) => `${head} ___ ${rest}.|${many}|${one}|${other}`),
  ...alongCross.map(([[head], [one, many, other, rest]]) => `${head} ___ ${rest}.|${one}|${many}|${other}`),
]);
const agreeSubjects = join([
  ...heldCross.map(
    ([head, things, [one, , , rest]]) => `${head} of ${things} ${one} ${rest}.|${head.split(" ")[1]}|${things}|${rest.split(" ").at(-1)}`,
  ),
  ...manyCross.map(([[head, subject, other], [many, , , rest]]) => `${head} ${many} ${rest}.|${subject}|${other}|${rest}`),
  ...alongCross.map(([[head, subject, other], [one, , , rest]]) => `${head} ${one} ${rest}.|${subject}|${other}|${rest.split(" ").at(-1)}`),
]);

/** tensWords and onesWords make compound numbers; numberPlaces count them. */
const tensWords = ["twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"] as const;
const onesWords = [
  ["one", 1],
  ["three", 3],
  ["five", 5],
  ["eight", 8],
] as const;
const numberPlaces = [
  ["Our class collected", "cans"],
  ["The bus has", "seats"],
  ["The garden has", "rose bushes"],
  ["The farm keeps", "sheep"],
  ["The album holds", "photos"],
  ["The shelf holds", "jars"],
] as const;
const teens = [
  ["Twelve", 12],
  ["Fifteen", 15],
  ["Eighteen", 18],
  ["Eleven", 11],
  ["Thirteen", 13],
  ["Nineteen", 19],
  ["Seventeen", 17],
  ["Fourteen", 14],
] as const;
const teenScenes = ["people came to the meeting", "birds sat on the wire", "cars waited in the lot", "boats left the harbor"] as const;
const bigNumbers = [
  ["2,350", "two thousand three hundred fifty"],
  ["7,125", "seven thousand one hundred twenty-five"],
  ["1,840", "one thousand eight hundred forty"],
  ["3,600", "three thousand six hundred"],
  ["9,275", "nine thousand two hundred seventy-five"],
  ["5,430", "five thousand four hundred thirty"],
  ["6,710", "six thousand seven hundred ten"],
  ["8,960", "eight thousand nine hundred sixty"],
] as const;
const bigScenes = [
  ["The library owns", "books"],
  ["The stadium seats", "fans"],
  ["The town has", "people"],
  ["The museum shows", "objects"],
] as const;
const tensValue = (tens: string) => (tensWords.indexOf(tens as (typeof tensWords)[number]) + 2) * 10;
const numberSpell = join([
  ...everyPair(tensWords, onesWords).map(([tens, [ones, n]], k) => {
    const [opening, things] = numberPlaces[k % numberPlaces.length] ?? numberPlaces[0];
    return `${opening} ___ ${things}.|${tens}-${ones}|${tensValue(tens) + n}|${tens} ${ones}`;
  }),
  ...everyPair(teens, teenScenes).map(([[word, n], scene]) => `___ ${scene}.|${word}|${n}|${word.toLowerCase()}`),
  ...everyPair(bigNumbers, bigScenes).map(
    ([[figure, words], [opening, things]]) => `${opening} ___ ${things}.|${figure}|${words}|${words.replaceAll(" ", "-")}`,
  ),
]);
const timeEvents = ["concert", "game", "show", "meeting", "class", "movie"] as const;
const timeWords = ["seven thirty p.m.", "eight fifteen a.m.", "six forty-five p.m.", "ten twenty a.m."] as const;
const measures = [
  ["The trail is", "kilometers", "long"],
  ["The box is", "centimeters", "wide"],
  ["The pool is", "meters", "deep"],
  ["The rope is", "meters", "long"],
  ["The tower is", "meters", "tall"],
] as const;
const smallWords = ["four", "six", "nine", "twelve"] as const;
const prices = ["The ticket costs", "The book costs", "Lunch costs", "The toy costs", "The map costs"] as const;
const countThings = ["tickets", "apples", "pencils", "kites", "maps", "plates"] as const;
const numberForm = join([
  ...everyPair(timeEvents, timeWords).map(([event, time]) => `The ${event} starts at *${time}*.|in figures`),
  ...everyPair(measures, smallWords).map(([[opening, unit, how], n]) => `${opening} *${n} ${unit}* ${how}.|in figures`),
  ...everyPair(prices, smallWords).map(([opening, n]) => `${opening} *${n} dollars*.|in figures`),
  ...everyPair(["three", "five", "seven", "nine"], countThings).map(([n, things]) => `We bought *${n}* ${things}.|spelled out`),
  ...everyPair(tensWords, ["two", "six"]).map(
    ([tens, ones], k) => `The class collected *${tens} ${ones}* ${countThings[k % countThings.length]}.|with a hyphen`,
  ),
]);

/** groupsOne are singular groups and groupsMany plural people; groupDeeds and peopleDeeds have ___ for the pronoun. */
const groupsOne = ["The company", "The team", "The club", "The school", "The band", "The town"] as const;
const groupDeeds = [
  "changed ___ name",
  "celebrated ___ anniversary",
  "opened ___ doors to visitors",
  "posted ___ schedule online",
  "painted ___ building",
  "chose ___ leader",
  "held ___ meeting",
  "won ___ award",
] as const;
const groupsMany = ["The players", "The students", "The neighbors", "The teachers", "The scouts", "The workers"] as const;
const peopleDeeds = [
  "packed ___ bags",
  "raised ___ hands",
  "shared ___ lunch",
  "finished ___ work",
  "cleaned ___ desks",
  "wore ___ coats",
  "called ___ families",
  "signed ___ names",
] as const;
const itStates = [
  "too cold to swim today",
  "time to go home",
  "getting dark outside",
  "raining again",
  "almost noon",
  "a long walk to the lake",
] as const;
const saying = ["", "I think ", "Mom says "] as const;
const groupCross = everyPair(groupsOne, groupDeeds);
const peopleCross = everyPair(groupsMany, peopleDeeds);
const itsLines = join([
  ...groupCross.map(([who, deed]) => `${who} ${deed}.|its`),
  ...peopleCross.map(([who, deed]) => `${who} ${deed}.|their`),
  ...everyPair(itStates, saying).map(([state, say]) => `${cap(`${say}___`)} ${state}.|it's`),
]);
const steadyLines = join([
  ...groupCross.map(([who, deed]) => {
    const thing = deed.split("___ ")[1]?.split(" ")[0] ?? "";
    const many = `${who}s`.replace("companys", "companies");
    return `${who.toLowerCase()} and its ${thing}|${who} ${deed.replace("___", "its")}.|${who} ${deed.replace("___", "their")}.|${many} ${deed.replace("___", "its")}.`;
  }),
  ...peopleCross.map(([who, deed]) => {
    const thing = deed.split("___ ")[1]?.split(" ")[0] ?? "";
    const one = who.replace(/s$/, "");
    return `${who.toLowerCase()} and their ${thing}|${who} ${deed.replace("___", "their")}.|${who} ${deed.replace("___", "its")}.|${one} ${deed.replace("___", "their")}.`;
  }),
]);

const whoLabels: Readonly<Record<string, Label>> = {
  who: {
    zh: "who",
    why: [
      "*Who* is the subject: it does the action of its verb, as *he* or *she* would.",
      "*who* 是主语：它是动词动作的执行者，就像 *he* 或 *she* 一样。",
    ],
    not: ["*Who* is for a subject; here the pronoun is not the one doing the action.", "*who* 用作主语；这里的代词并不是动作的执行者。"],
  },
  whom: {
    zh: "whom",
    why: [
      "*Whom* is the object: it receives the action or follows a preposition, as *him* or *her* would.",
      "*whom* 是宾语：它承受动作或跟在介词后面，就像 *him* 或 *her* 一样。",
    ],
    not: ["*Whom* is for an object; here the pronoun is the subject of its verb.", "*whom* 用作宾语；这里的代词是动词的主语。"],
  },
  whose: {
    zh: "whose",
    why: ["*Whose* shows belonging: it comes before the thing that someone owns.", "*whose* 表示所属：它放在某人拥有的东西前面。"],
    not: ["*Whose* shows belonging, and no noun of belonging follows it here.", "*whose* 表示所属，而这里后面没有表示所属物的名词。"],
  },
};

const whoAndWhom = topic("grammar", {
  id: "who-and-whom",
  title: ["Who and Whom", "who 与 whom"],
  summary: ["Who is a subject, like he; whom is an object, like him.", "who 是主语，像 he；whom 是宾语，像 him。"],
  after: ["pronoun-case"],
  points: [
    label(
      "who-or-whom-in-questions",
      ["Who or Whom in a Question", "疑问句中的 who 与 whom"],
      [
        "*Who* and *whom* follow the same rule as *he* and *him*. Use **who** for the subject, the one doing the action: *Who called?* Use **whom** for the object, the one the action is done to, and after a preposition: *Whom did you call? To whom did you write?* To test, answer the question with *he* or *him*: *You called him*, so *whom*.",
        "*who* 和 *whom* 的规则与 *he* 和 *him* 相同。主语、即动作的执行者用 **who**：*Who called?* 宾语、即动作的承受者，以及介词后面，用 **whom**：*Whom did you call? To whom did you write?* 检验方法：用 *he* 或 *him* 回答这个问题：*You called him*，所以用 *whom*。",
      ],
      ["Which word completes the question?", "哪个词能补全这个问题？"],
      `
${whoQuestions}
        ___ left the gate open?|who
        ___ did the coach choose as captain?|whom
        ___ bike is chained to the fence?|whose
        ___ wrote this poem about the sea?|who
        To ___ should I give the permission slip?|whom
        ___ is knocking at the door?|who
        ___ did you meet at the museum?|whom
        ___ coat is lying on the floor?|whose
        ___ will carry the flag in the parade?|who
        With ___ did you share your lunch?|whom
        ___ invented the first telescope?|who
        ___ did the judges name the winner?|whom
        ___ turn is it to feed the fish?|whose
        ___ knows the answer to number five?|who
        For ___ did you buy these flowers?|whom
        ___ broke the window in the gym?|who
        ___ will you invite to the party?|whom
        ___ idea was it to paint the fence green?|whose
        ___ is your favorite author?|who
        From ___ did you borrow that book?|whom
        ___ found the lost puppy?|who
        ___ did the principal thank at the assembly?|whom
        ___ footprints are these in the snow?|whose
        ___ has the key to the music room?|who
        About ___ is this biography written?|whom
        ___ is going to sing first?|who
        ___ should we ask for directions?|whom
        ___ team scored the last goal?|whose
        ___ painted the mural in the hall?|who
        ___ did the dog follow home?|whom
      `,
      whoLabels,
    ),
    label(
      "who-or-whom-in-clauses",
      ["Who or Whom in a Clause", "从句中的 who 与 whom"],
      [
        "Inside a clause, decide by the clause alone. Cover the rest of the sentence and turn the clause into its own sentence with *he* or *him*: in *the girl ___ I met*, *I met her*, so *whom*; in *the girl ___ met me*, *she met me*, so *who*. Words such as *I think* inside the clause do not change the answer: *the man who I think stole it* (*he* stole it).",
        "在从句中，只看从句本身来判断。遮住句子的其余部分，用 *he* 或 *him* 把从句变成独立的句子：在 *the girl ___ I met* 中，*I met her*，所以用 *whom*；在 *the girl ___ met me* 中，*she met me*，所以用 *who*。从句中插入的 *I think* 之类的词不影响答案：*the man who I think stole it*（*he* stole it）。",
      ],
      ["Which word completes the clause?", "哪个词能补全这个从句？"],
      `
${whoClauses}
        The girl ___ won the spelling bee is in my class.|who
        The teacher ___ we visited lives on a farm.|whom
        The boy ___ dog ran away put up posters.|whose
        This is the doctor ___ helped my grandmother.|who
        The player ___ the coach praised smiled proudly.|whom
        I know a woman ___ has climbed three mountains.|who
        The author to ___ we wrote sent us a reply.|whom
        The family ___ house burned down stayed with us.|whose
        The pilot, ___ had flown for years, landed safely.|who
        My cousin, ___ you met last summer, is visiting.|whom
        We thanked the firefighter ___ saved the cat.|who
        The friend with ___ I traveled got lost twice.|whom
        The artist ___ paintings hang here is only twelve.|whose
        The scientist ___ discovered the comet gave a talk.|who
        The guest ___ I think you invited has arrived.|who
        The singer ___ everyone cheered bowed to the crowd.|whom
        The student ___ project won will go to the state fair.|whose
        Ask the man ___ sells the tickets.|who
        The neighbor ___ we asked for help came at once.|whom
        Anyone ___ finishes early may read quietly.|who
        The leader for ___ the people voted gave a speech.|whom
        The child ___ kite was stuck in the tree began to cry.|whose
        The runner ___ I believe will win is my sister.|who
        The guide ___ the tourists followed knew every street.|whom
        People ___ exercise often sleep better.|who
        The king ___ the soldiers served was cruel.|whom
        The girl ___ voice we heard on the radio is my friend.|whose
        The builder ___ made this bridge was a woman.|who
        The poet ___ we studied lived two hundred years ago.|whom
        The farmer ___ cows broke the fence apologized.|whose
      `,
      whoLabels,
    ),
  ],
});

const relativeLabels: Readonly<Record<string, Label>> = {
  who: {
    zh: "who",
    why: ["*Who* begins a clause about a person.", "*who* 引导关于人的从句。"],
    not: ["*Who* is for people, and this clause is about a thing or an animal.", "*who* 用于人，而这个从句说的是事物或动物。"],
  },
  which: {
    zh: "which",
    why: [
      "*Which* begins a clause of extra information about a thing, set off by commas.",
      "*which* 引导关于事物的补充信息从句，用逗号隔开。",
    ],
    not: ["*Which* is for things, and this clause is about a person.", "*which* 用于事物，而这个从句说的是人。"],
  },
  that: {
    zh: "that",
    why: ["*That* begins a clause that tells which one is meant, with no commas.", "*that* 引导说明所指对象的从句，不用逗号。"],
    not: [
      "*That* never begins a clause set off by commas; a clause of extra information needs *who* or *which*.",
      "*that* 从不引导用逗号隔开的从句；补充信息从句要用 *who* 或 *which*。",
    ],
  },
  whose: {
    zh: "whose",
    why: ["*Whose* shows that the noun after it belongs to someone or something.", "*whose* 表示它后面的名词属于某人或某物。"],
    not: ["*Whose* shows belonging; it is not a short form of *who is*.", "*whose* 表示所属，它不是 *who is* 的缩写。"],
  },
  "who's": {
    zh: "who's",
    why: [
      "*Who's* is short for *who is* or *who has*; say the two words and the sentence still works.",
      "*who's* 是 *who is* 或 *who has* 的缩写；换成这两个词，句子依然通顺。",
    ],
    not: ["*Who's* means *who is* or *who has*, which makes no sense here.", "*who's* 的意思是 *who is* 或 *who has*，放在这里说不通。"],
  },
};

const whoWhichThat = topic("grammar", {
  id: "who-which-and-that",
  title: ["Who, Which and That", "who、which 与 that"],
  summary: [
    "Who is for people, which for things in a clause set off by commas, that for a clause that tells which one; whose shows belonging.",
    "who 用于人，which 用于逗号隔开的从句中的事物，that 用于说明所指对象的从句；whose 表示所属。",
  ],
  after: ["relative-clauses"],
  points: [
    label(
      "who-which-or-that",
      ["Who, Which or That", "who、which 还是 that"],
      [
        "Use **who** for people and **which** for things in a clause of extra information set off by commas: *My aunt, who lives in Lima, is a pilot. The bridge, which is old, is closed.* Use **that** in a clause with no commas that tells *which one*: *The bridge that we crossed is new.* After a comma, *that* is always wrong.",
        "在用逗号隔开的补充信息从句中，人用 **who**，事物用 **which**：*My aunt, who lives in Lima, is a pilot. The bridge, which is old, is closed.* 在不用逗号、说明“哪一个”的从句中用 **that**：*The bridge that we crossed is new.* 逗号后面用 *that* 一定是错的。",
      ],
      ["Which word begins the clause?", "哪个词引导这个从句？"],
      `
${relativeLines}
        My grandfather, ___ grew up in Cairo, speaks four languages.|who|which|that
        The Nile, ___ flows north, is the longest river in Africa.|which|who|that
        The book ___ you lent me was exciting.|that|who|whose
        Our coach, ___ played for the national team, is strict.|who|which|that
        The museum, ___ opened in 1880, has a mummy.|which|who|that
        This is the road ___ leads to the castle.|that|who|whose
        Dr. Osei, ___ treated my broken arm, was very kind.|who|which|that
        The storm, ___ lasted all night, knocked down trees.|which|who|that
        The cake ___ Mom baked is gone already.|that|who|whose
        Mr. Lin, ___ teaches art, painted the stage set.|who|which|that
        My bike, ___ is red, has a flat tire.|which|who|that
        I lost the pen ___ my uncle gave me.|that|who|whose
        Rosa Parks, ___ refused to give up her seat, became a hero.|who|which|that
        The Colosseum, ___ held fifty thousand people, still stands.|which|who|that
        Where is the map ___ shows the hiking trails?|that|who|whose
        Our neighbor, ___ keeps bees, gave us honey.|who|which|that
        The volcano, ___ last erupted in 1902, is quiet now.|which|who|that
        The song ___ we sang at the concert was hard.|that|who|whose
        My sister, ___ is two years older, drives me to school.|who|which|that
        The library, ___ has a new roof, reopens on Monday.|which|who|that
        This is the key ___ opens the shed.|that|who|whose
        Marie Curie, ___ studied radium, won two Nobel prizes.|who|which|that
        Mount Everest, ___ is the highest mountain, lies in the Himalayas.|which|who|that
        The shoes ___ I wanted were sold out.|that|who|whose
        The mayor, ___ was elected last year, opened the park.|who|which|that
        Our school bus, ___ is very old, broke down again.|which|who|that
        I liked the film ___ we watched in class.|that|who|whose
        The twins, ___ were born in May, love to swim.|who|which|that
        The Great Wall, ___ stretches for thousands of kilometers, was built over centuries.|which|who|that
        The puzzle ___ you gave me has a thousand pieces.|that|who|whose
      `,
      relativeLabels,
    ),
    label(
      "whose-or-whos",
      ["Whose or Who's", "whose 还是 who's"],
      [
        "**Whose** shows belonging and comes before a noun: *the girl whose bag is red*. **Who's** is a contraction of *who is* or *who has*: *Who's coming? Who's seen my keys?* To test, read the sentence with *who is* or *who has*. If it still makes sense, write *who's*; if not, write *whose*. Plain **who** has no noun after it and no *is* inside it.",
        "**whose** 表示所属，放在名词前：*the girl whose bag is red*。**who's** 是 *who is* 或 *who has* 的缩写：*Who's coming? Who's seen my keys?* 检验方法：把它读成 *who is* 或 *who has*。如果句子仍然通顺，就写 *who's*；否则写 *whose*。单独的 **who** 后面没有名词，也不包含 *is*。",
      ],
      ["Which word completes the sentence?", "哪个词能补全句子？"],
      `
${whoseLines}
        ___ jacket is this on the bench?|whose|who's|who
        ___ going to the game on Saturday?|who's|whose|who
        The boy ___ painting won first prize is shy.|whose|who's|who
        ___ seen the remote control?|who's|whose|who
        I met a girl ___ father is a pilot.|whose|who's|who
        ___ turn is it to wash the dishes?|whose|who's|who
        ___ the new student in your class?|who's|whose|who
        The man ___ car was towed was angry.|whose|who's|who
        ___ been eating my cookies?|who's|whose|who
        The writer ___ books I love is visiting our school.|whose|who's|who
        Do you know ___ bringing the drinks?|who's|whose|who
        ___ shoes are covered in mud?|whose|who's|who
        The singer ___ performing tonight is from Brazil.|who's|whose|who
        The friend ___ helped me move is strong.|who|who's|whose
        ___ idea was it to go camping in the rain?|whose|who's|who
        ___ ready for the test tomorrow?|who's|whose|who
        The family ___ dog barks all night moved away.|whose|who's|who
        I wonder ___ calling so late at night.|who's|whose|who
        The girl ___ won the race shook my hand.|who|who's|whose
        ___ phone keeps ringing during class?|whose|who's|who
        ___ finished the reading already?|who's|whose|who
        The teacher ___ lessons we enjoy is retiring.|whose|who's|who
        A scientist ___ studying whales visited us.|who's|whose|who
        Anyone ___ name is called should stand up.|whose|who's|who
        ___ coming with us to the lake?|who's|whose|who
        The player ___ scored the goal was carried off the field.|who|who's|whose
        ___ handwriting is on this note?|whose|who's|who
        The baker ___ bread we buy opens at six.|whose|who's|who
        Tell me ___ been chosen for the team.|who's|whose|who
        The pilot ___ flew us home waved goodbye.|who|who's|whose
      `,
      relativeLabels,
    ),
  ],
});

const commaLabels: Readonly<Record<string, Label>> = {
  "no commas": {
    zh: "不用逗号",
    why: [
      "The words tell which one is meant, so they are essential and take no commas.",
      "这些词说明指的是哪一个，所以是必要成分，不用逗号。",
    ],
    not: [
      "Without these words we would not know which one is meant, so they need no commas.",
      "没有这些词就不知道指的是哪一个，所以不用逗号。",
    ],
  },
  "a pair of commas": {
    zh: "一对逗号",
    why: [
      "The words add extra information in the middle of the sentence, so a comma goes on each side.",
      "这些词在句子中间补充额外信息，所以两边各用一个逗号。",
    ],
    not: [
      "A pair of commas is for extra information in the middle of a sentence, which is not the case here.",
      "一对逗号用于句子中间的补充信息，这里不是这种情况。",
    ],
  },
  "one comma before it": {
    zh: "前面用一个逗号",
    why: [
      "The extra information ends the sentence, so one comma before it is enough; the period closes it.",
      "补充信息在句末，所以前面用一个逗号就够了，句号把它结束。",
    ],
    not: [
      "One comma before it is for extra information at the end of a sentence, which is not the case here.",
      "前面用一个逗号适用于句末的补充信息，这里不是这种情况。",
    ],
  },
};

const nonessentialCommas = topic("grammar", {
  id: "commas-with-nonessential-elements",
  title: ["Commas with Nonessential Elements", "非必要成分的逗号"],
  summary: [
    "Commas set off words that add extra information, such as appositives and clauses with who or which; words that tell which one take none.",
    "逗号把补充额外信息的词隔开，例如同位语和 who 或 which 引导的从句；说明“哪一个”的词不用逗号。",
  ],
  after: ["appositives", "who-which-and-that"],
  points: [
    choose(
      "where-the-commas-go",
      ["Where the Commas Go", "逗号放在哪里"],
      [
        "A **nonessential** element adds extra information about a noun that is already clear: *My brother, a chef, cooked dinner.* You could take it out and the sentence would still name the same person. Put a comma before it and another after it, unless it ends the sentence. An **essential** element tells which one, so it takes no commas: *The chef who cooked dinner is my brother.*",
        "**非必要**成分为一个已经明确的名词补充额外信息：*My brother, a chef, cooked dinner.* 把它去掉，句子指的仍是同一个人。在它前后各加一个逗号，除非它在句末。**必要**成分说明是哪一个，所以不用逗号：*The chef who cooked dinner is my brother.*",
      ],
      ["Which sentence is punctuated correctly?", "哪个句子的标点正确？"],
      `
${commaPlaces}
        extra facts about Mrs. Diaz|Mrs. Diaz, our coach, blew the whistle.|Mrs. Diaz our coach, blew the whistle.|Mrs. Diaz, our coach blew the whistle.
        extra facts about Paris|Paris, which is the capital of France, has many bridges.|Paris which is the capital of France, has many bridges.|Paris, which is the capital, of France has many bridges.
        a clause that tells which dog|The dog that bit me belongs to Sam.|The dog, that bit me, belongs to Sam.|The dog that bit me, belongs to Sam.
        extra facts about my uncle|My uncle, who is a vet, fixed the bird's wing.|My uncle who is a vet, fixed the bird's wing.|My uncle, who is a vet fixed the bird's wing.
        a name that tells which friend|My friend Ali lives next door.|My friend, Ali lives next door.|My friend Ali, lives next door.
        extra facts about the Amazon|The Amazon, the largest rain forest, is shrinking.|The Amazon the largest rain forest, is shrinking.|The Amazon, the largest rain forest is shrinking.
        a clause that tells which students|Students who finish early may read.|Students, who finish early, may read.|Students who finish early, may read.
        extra facts at the end|We visited Rome, which is full of ruins.|We visited Rome which is full of ruins.|We visited, Rome which is full of ruins.
        extra facts about our dog|Our dog, a beagle, howls at sirens.|Our dog a beagle, howls at sirens.|Our dog, a beagle howls at sirens.
        a clause that tells which book|The book that I lost was overdue.|The book, that I lost, was overdue.|The book that I lost, was overdue.
        extra facts about Mr. Kim|Mr. Kim, who drives the bus, is always early.|Mr. Kim who drives the bus, is always early.|Mr. Kim, who drives the bus is always early.
        extra facts at the end|I gave the letter to Ms. Park, the principal.|I gave the letter to Ms. Park the principal.|I gave the letter, to Ms. Park the principal.
        a title that tells which film|The film Finding Home made me cry.|The film, Finding Home made me cry.|The film Finding Home, made me cry.
        extra facts about Saturn|Saturn, which has bright rings, is the sixth planet.|Saturn which has bright rings, is the sixth planet.|Saturn, which has bright rings is the sixth planet.
        a clause that tells which people|People who litter should be fined.|People, who litter, should be fined.|People who litter, should be fined.
        extra facts about my grandmother|My grandmother, a nurse for forty years, still helps at the clinic.|My grandmother a nurse for forty years, still helps at the clinic.|My grandmother, a nurse for forty years still helps at the clinic.
        extra facts at the end|We met Dr. Ruiz, who studies sharks.|We met Dr. Ruiz who studies sharks.|We met, Dr. Ruiz who studies sharks.
        a clause that tells which house|The house that has a red door is ours.|The house, that has a red door, is ours.|The house that has a red door, is ours.
        extra facts about the Thames|The Thames, which flows through London, is tidal.|The Thames which flows through London, is tidal.|The Thames, which flows through London is tidal.
        extra facts about Lena|Lena, the tallest girl in class, plays center.|Lena the tallest girl in class, plays center.|Lena, the tallest girl in class plays center.
        a name that tells which cousin|My cousin Maya is visiting from Chile.|My cousin, Maya is visiting from Chile.|My cousin Maya, is visiting from Chile.
        extra facts at the end|The prize went to Omar, a sixth grader.|The prize went to Omar a sixth grader.|The prize went, to Omar a sixth grader.
        a clause that tells which game|The game that we played was too long.|The game, that we played, was too long.|The game that we played, was too long.
        extra facts about Mount Fuji|Mount Fuji, which is a volcano, is snowy in winter.|Mount Fuji which is a volcano, is snowy in winter.|Mount Fuji, which is a volcano is snowy in winter.
        extra facts about the mayor|The mayor, Ms. Grant, cut the ribbon.|The mayor Ms. Grant, cut the ribbon.|The mayor, Ms. Grant cut the ribbon.
        a clause that tells which girl|The girl who sang first was nervous.|The girl, who sang first, was nervous.|The girl who sang first, was nervous.
        extra facts at the end|We ate at Luigi's, which serves pizza.|We ate at Luigi's which serves pizza.|We ate, at Luigi's which serves pizza.
        extra facts about our town|Our town, which is tiny, has one shop.|Our town which is tiny, has one shop.|Our town, which is tiny has one shop.
        extra facts about Ben|Ben, my best friend, moved to Texas.|Ben my best friend, moved to Texas.|Ben, my best friend moved to Texas.
        a clause that tells which plants|Plants that get no light will die.|Plants, that get no light, will die.|Plants that get no light, will die.
      `,
      (right) => [
        `**${right}** The commas, or their absence, show whether the words add extra information or tell which one is meant.`,
        `**${right}** 用不用逗号，表明这些词是在补充额外信息，还是在说明指的是哪一个。`,
      ],
      [
        [
          "*{wrong}* is missing one of the commas that should set off the extra words, or adds commas where none belong.",
          "*{wrong}* 漏了隔开补充成分的一个逗号，或者在不该加逗号的地方加了逗号。",
        ],
        [
          "*{wrong}* puts a comma in the wrong place, cutting into the words that belong together.",
          "*{wrong}* 把逗号放错了位置，把本该连在一起的词切开了。",
        ],
      ],
    ),
    label(
      "essential-or-nonessential",
      ["Essential or Nonessential", "必要还是非必要"],
      [
        "Ask: if I take these words out, do I still know which one is meant? If not, the words are **essential**: no commas. If yes, they are **nonessential**: a pair of commas in the middle of a sentence, or one comma before them at the end. A name after a general word such as *my friend* is essential if you have more than one friend; *my mother, Ana,* is nonessential, since you have only one mother.",
        "问自己：把这些词去掉，还知道指的是哪一个吗？如果不知道，这些词就是**必要**的：不用逗号。如果知道，它们就是**非必要**的：在句子中间用一对逗号，在句末则在前面用一个逗号。*my friend* 这样的泛称后面的名字，如果你有不止一个朋友，就是必要的；*my mother, Ana,* 是非必要的，因为你只有一个母亲。",
      ],
      ["How should the words in italics be punctuated?", "斜体部分应该怎样加标点？"],
      `
${commaKinds}
        My mother *a doctor* works at night.|a pair of commas
        The girl *who lives next door* has a parrot.|no commas
        We drove to Boston *which is three hours away*.|one comma before it
        The movie *that we saw last night* was scary.|no commas
        Jupiter *the largest planet* has many moons.|a pair of commas
        I wrote a letter to my grandfather *who lives in Seoul*.|one comma before it
        Children *who eat breakfast* learn better.|no commas
        Our principal *Mr. Hale* gave a speech.|a pair of commas
        I finally met Mr. Okafor *the new librarian*.|one comma before it
        The bus *that goes downtown* is late.|no commas
        The Pacific *which is the deepest ocean* covers a third of Earth.|a pair of commas
        We stayed with Aunt Rosa *who has six cats*.|one comma before it
        The player *who scores the most points* wins a trophy.|no commas
        My only brother *Luis* is in college.|a pair of commas
        We hiked up Mount Rainier *a volcano in Washington*.|one comma before it
        A dog *that barks all night* annoys the neighbors.|no commas
        The Mona Lisa *which hangs in Paris* is small.|a pair of commas
        Our class sent cards to Mrs. Ito *who is in the hospital*.|one comma before it
        The keys *that you found* are mine.|no commas
        Shakespeare *a famous playwright* was born in 1564.|a pair of commas
        I bought a gift for Dad *who loves fishing*.|one comma before it
        Anyone *who wants a ticket* should line up here.|no commas
        Antarctica *the coldest continent* has no towns.|a pair of commas
        The concert ended with a song by Elena *our best singer*.|one comma before it
        The trail *that follows the river* is the easiest.|no commas
        Our cat *which is fourteen* sleeps all day.|a pair of commas
        We crossed the Golden Gate Bridge *which was built in 1937*.|one comma before it
        The students *who were absent* must take the test later.|no commas
        My best friend *Kai* plays the drums.|a pair of commas
        The prize went to the poem *that made everyone laugh*.|no commas
      `,
      commaLabels,
    ),
  ],
});

const intensiveLabels: Readonly<Record<string, Label>> = {
  intensive: {
    zh: "强调代词",
    why: [
      "It only stresses the noun or pronoun before it; take it out and the sentence still makes sense.",
      "它只是强调前面的名词或代词；去掉它，句子依然成立。",
    ],
    not: [
      "This *-self* word cannot be removed without breaking the sentence, so it is not intensive.",
      "去掉这个 *-self* 词句子就不成立，所以它不是强调代词。",
    ],
  },
  reflexive: {
    zh: "反身代词",
    why: [
      "The action turns back on the subject; the *-self* word is needed, so the sentence breaks without it.",
      "动作返回到主语自身；这个 *-self* 词是必需的，去掉句子就不成立。",
    ],
    not: [
      "The *-self* word here could be taken out, so it only adds stress and is not reflexive.",
      "这里的 *-self* 词可以去掉，所以它只是强调，不是反身代词。",
    ],
  },
  "a mistake": {
    zh: "用错了",
    why: [
      "A *-self* word needs a noun or pronoun in the same sentence to point back to; here it has none, so it should be *I* or *me*.",
      "*-self* 词需要句中有一个它回指的名词或代词；这里没有，所以应该用 *I* 或 *me*。",
    ],
    not: [
      "The *-self* word here points back to a noun or pronoun in the sentence, so it is used correctly.",
      "这里的 *-self* 词回指句中的名词或代词，所以用得正确。",
    ],
  },
};

const intensivePronouns = topic("grammar", {
  id: "intensive-pronouns",
  title: ["Intensive Pronouns", "强调代词"],
  summary: [
    "A -self pronoun that only adds stress, as in I did it myself; it can be taken out, unlike a reflexive pronoun.",
    "只起强调作用的 -self 代词，如 I did it myself；它与反身代词不同，可以去掉。",
  ],
  after: ["reflexive-pronouns"],
  points: [
    label(
      "intensive-or-reflexive",
      ["Intensive or Reflexive", "强调代词还是反身代词"],
      [
        "The *-self* pronouns have two jobs. A **reflexive** pronoun is needed, because the action turns back on the subject: *She hurt herself.* An **intensive** pronoun only adds stress, and the sentence works without it: *The queen herself opened the gate.* A *-self* word with nothing to point back to is **a mistake**: *Ana and myself went* should be *Ana and I went*.",
        "*-self* 代词有两种用法。**反身代词**是必需的，因为动作返回到主语自身：*She hurt herself.* **强调代词**只起强调作用，没有它句子也成立：*The queen herself opened the gate.* 没有回指对象的 *-self* 词是**用错了**：*Ana and myself went* 应该是 *Ana and I went*。",
      ],
      ["How is the word in italics used?", "斜体词的用法是什么？"],
      `
${selfKinds}
        The chef *himself* carried out the cake.|intensive
        Mia taught *herself* to juggle.|reflexive
        Please send the report to Mr. Lee or *myself*.|a mistake
        We *ourselves* painted the whole fence.|intensive
        The cat washed *itself* in the sun.|reflexive
        Jamal and *myself* won the relay.|a mistake
        The president *herself* answered my letter.|intensive
        They prepared *themselves* for the storm.|reflexive
        The coach gave the trophy to Kim and *myself*.|a mistake
        I *myself* saw the comet last night.|intensive
        Be careful not to cut *yourself*.|reflexive
        *Myself* and my sister cleaned the garage.|a mistake
        The mountain *itself* is not very tall.|intensive
        He introduced *himself* to the new neighbors.|reflexive
        Thank you for inviting my parents and *myself*.|a mistake
        You *yourself* said the test would be easy.|intensive
        The children enjoyed *themselves* at the fair.|reflexive
        The letter was written by Leo and *myself*.|a mistake
        The author *herself* signed my book.|intensive
        I reminded *myself* to bring an umbrella.|reflexive
        Ms. Cruz asked Tom and *myself* to help.|a mistake
        The students *themselves* organized the bake sale.|intensive
        The machine turns *itself* off at night.|reflexive
        Our team and *ourselves* left early.|a mistake
        The king *himself* rode at the front of the army.|intensive
        We found *ourselves* lost in the woods.|reflexive
        My brother and *myself* share a room.|a mistake
        The idea *itself* was good, but the plan failed.|intensive
        She looked at *herself* in the mirror.|reflexive
        The guide showed Ravi and *myself* the cave.|a mistake
      `,
      intensiveLabels,
    ),
    choose(
      "forms-of-self-pronouns",
      ["The Forms of -self Pronouns", "-self 代词的形式"],
      [
        "Each *-self* pronoun matches the noun it points back to: *myself*, *yourself*, *himself*, *herself*, *itself*, *ourselves*, *yourselves*, *themselves*. Plural ones end in *-selves*. *Hisself*, *theirselves* and *themself* are not standard English; use **himself** and **themselves**.",
        "每个 *-self* 代词都与它回指的名词一致：*myself*、*yourself*、*himself*、*herself*、*itself*、*ourselves*、*yourselves*、*themselves*。复数形式以 *-selves* 结尾。*hisself*、*theirselves* 和 *themself* 不是标准英语，要用 **himself** 和 **themselves**。",
      ],
      ["Which pronoun completes the sentence?", "哪个代词能补全句子？"],
      `
${selfForms}
        The boys built the treehouse ___.|themselves|theirselves|himself
        Grandpa fixed the roof ___.|himself|hisself|themselves
        We ___ cooked the whole meal.|ourselves|ourself|myself
        The players ___ chose the team's name.|themselves|theirselves|itself
        Leo hurt ___ playing soccer.|himself|hisself|herself
        The girls made the costumes ___.|themselves|theirselves|herself
        The robot cleans ___ after each use.|itself|itsself|themselves
        You two should be proud of ___.|yourselves|yourselfs|yourself
        Sam taught ___ to play the guitar.|himself|hisself|themselves
        The twins dressed ___ for school.|themselves|theirselves|himself
        The baby bird can feed ___ now.|itself|itsself|herself
        Students, please help ___ to the snacks.|yourselves|yourselfs|themselves
        The farmer ___ drove the cows home.|himself|hisself|themselves
        My parents ___ planted the garden.|themselves|theirselves|ourselves
        The puppy saw ___ in the puddle.|itself|itsself|himself
        We reminded ___ to lock the door.|ourselves|ourself|themselves
        The mayor ___ came to the opening.|himself|hisself|ourselves
        The workers rested ___ in the shade.|themselves|theirselves|itself
        Did you make that kite ___, Ana?|yourself|yourselves|herself
        Ben blamed ___ for the mistake.|himself|hisself|myself
        The singers warmed ___ up before the show.|themselves|theirselves|ourselves
        The door locked ___ behind us.|itself|itsself|themselves
        Our class ___ raised the money.|itself|itsself|ourselves
        The old man talks to ___ while he walks.|himself|hisself|themselves
        The neighbors ___ cleared the snow from the road.|themselves|theirselves|himself
        Kids, keep ___ warm out there.|yourselves|yourselfs|themselves
        The captain ___ steered the ship through the storm.|himself|hisself|themselves
        The scouts found ___ near the river at dusk.|themselves|theirselves|ourselves
        The plant turns ___ toward the light.|itself|itsself|themselves
        I promised ___ I would finish the book.|myself|meself|ourselves
      `,
      (right, shown) => [
        `${shown.replace("___", `**${right}**`)} *${right}* matches the noun it points back to and is the standard form.`,
        `${shown.replace("___", `**${right}**`)} *${right}* 与它回指的名词一致，而且是标准形式。`,
      ],
      [
        ["*{wrong}* is not standard English; the standard form is **{right}**.", "*{wrong}* 不是标准英语，标准形式是 **{right}**。"],
        ["*{wrong}* does not match the noun it points back to in person or number.", "*{wrong}* 在人称或数上与它回指的名词不一致。"],
      ],
    ),
  ],
});

const vagueLabels: Readonly<Record<string, Label>> = {
  clear: {
    zh: "清楚",
    why: ["The pronoun has one clear noun to point back to.", "这个代词只有一个明确的名词可以回指。"],
    not: ["This pronoun has exactly one noun it can mean, so it is clear.", "这个代词只可能指一个名词，所以是清楚的。"],
  },
  "two possible nouns": {
    zh: "可能指两个名词",
    why: [
      "Two nouns before the pronoun could fit, so the reader cannot tell which is meant.",
      "代词前面有两个名词都说得通，读者分不清指的是哪一个。",
    ],
    not: ["The pronoun does not have two nouns it could mean.", "这个代词并没有两个可能指代的名词。"],
  },
  "no noun at all": {
    zh: "没有可指的名词",
    why: [
      "The pronoun points back to no noun in the sentence; *they* or *it* stands for nobody named.",
      "这个代词在句中没有可以回指的名词；*they* 或 *it* 并不指任何提到的人或物。",
    ],
    not: ["The pronoun does have a noun in the sentence to point back to.", "这个代词在句中确实有可回指的名词。"],
  },
};

const vaguePronouns = topic("grammar", {
  id: "vague-pronouns",
  title: ["Vague Pronouns", "指代不清的代词"],
  summary: [
    "A pronoun is vague when it could mean two nouns or no noun at all; fix it by naming the noun.",
    "当代词可能指两个名词，或者根本没有可指的名词时，它就指代不清；把名词说出来就能改正。",
  ],
  after: ["pronoun-antecedent-agreement"],
  points: [
    label(
      "spotting-a-vague-pronoun",
      ["Spotting a Vague Pronoun", "找出指代不清的代词"],
      [
        "A pronoun must point back to one clear noun, its **antecedent**. A pronoun is **vague** in two ways. It may have **two possible nouns**: *Ana told Mia that she won* (who won?). Or it may have **no noun at all**: *At the station, they said the train was late* (who said?). Read the pronoun and ask, who or what exactly?",
        "代词必须回指一个明确的名词，即它的**先行词**。代词指代不清有两种情况。可能有**两个可能的名词**：*Ana told Mia that she won*（谁赢了？）。也可能**根本没有可指的名词**：*At the station, they said the train was late*（谁说的？）。读到代词时问一问：到底是谁或什么？",
      ],
      ["Is the pronoun in italics clear or vague?", "斜体代词指代清楚还是不清？"],
      `
${vagueSpot}
        Leo called Sam after *he* got home.|two possible nouns
        In the newspaper *it* says the park will close.|no noun at all
        Maria lost her scarf, but *she* found it later.|clear
        When the dog chased the cat, *it* knocked over a vase.|two possible nouns
        At the zoo *they* let you feed the goats.|no noun at all
        The tree fell in the storm, and *it* blocked the road.|clear
        Kim told her mother that *she* needed new shoes.|two possible nouns
        On the news *they* said it would snow.|no noun at all
        The students cheered when *they* heard the news.|clear
        I put the vase on the shelf, and *it* broke.|two possible nouns
        In this book *it* explains how volcanoes form.|no noun at all
        Our teacher smiled because *she* liked our project.|clear
        Dad told Grandpa that *his* car was making a noise.|two possible nouns
        At the airport *they* checked every bag.|no noun at all
        Nina finished her essay before *it* was due.|clear
        The girls met the twins, and *they* went to the park.|two possible nouns
        In Japan *they* eat a lot of rice.|no noun at all
        The baker opened early, so *he* sold out by noon.|clear
        Take the plate off the box and wash *it*.|two possible nouns
        On the website *it* says tickets are free.|no noun at all
        The river rose quickly, and *it* flooded the fields.|clear
        Raj argued with Ben until *he* got angry.|two possible nouns
        At school *they* make us wear uniforms.|no noun at all
        Mom bought a new lamp because *it* was on sale.|clear
        When the truck hit the fence, *it* was badly damaged.|two possible nouns
        In the instructions *it* tells you to add water.|no noun at all
        The puppies were hungry, so *they* whined.|clear
        Ella showed Rosa the photo of *her* new house.|two possible nouns
        At the hospital *they* gave me a cast.|no noun at all
        Omar trained every day, and *he* won the race.|clear
      `,
      vagueLabels,
    ),
    choose(
      "fixing-a-vague-pronoun",
      ["Fixing a Vague Pronoun", "改正指代不清的代词"],
      [
        "To fix a vague pronoun, replace it with the noun it should mean, or rewrite the sentence so only one noun fits. *Leo called Sam after he got home* becomes *After Sam got home, Leo called him.* *In the paper it says* becomes *The paper says*. Do not swap one vague pronoun for another.",
        "改正指代不清的代词，要用它应指的名词替换它，或者改写句子，让只有一个名词说得通。*Leo called Sam after he got home* 改为 *After Sam got home, Leo called him.* *In the paper it says* 改为 *The paper says*。不要用另一个指代不清的代词去替换。",
      ],
      ["Which sentence fixes the vague pronoun?", "哪个句子改正了指代不清的代词？"],
      `
${vagueFix}
        In the newspaper it says the park will close.|The newspaper says the park will close.|In the newspaper they say the park will close.|In it the newspaper says the park will close.
        Kim told her mother that she needed new shoes.|Kim told her mother, "I need new shoes."|Kim told her mother that she needed them.|Kim told her that she needed new shoes.
        At the zoo they let you feed the goats.|The zookeepers let visitors feed the goats.|At the zoo it lets you feed the goats.|They let you feed the goats at the zoo.
        When the dog chased the cat, it knocked over a vase.|When the dog chased the cat, the cat knocked over a vase.|When the dog chased the cat, they knocked over a vase.|When it chased the cat, it knocked over a vase.
        On the news they said it would snow.|The weather reporter said it would snow.|On the news it said they would get snow.|They said on the news it would snow.
        Dad told Grandpa that his car was making a noise.|Dad told Grandpa, "Your car is making a noise."|Dad told him that his car was making a noise.|Dad told Grandpa that it was making a noise.
        In this book it explains how volcanoes form.|This book explains how volcanoes form.|In this book they explain how volcanoes form.|It explains in this book how volcanoes form.
        Raj argued with Ben until he got angry.|Raj argued with Ben until Ben got angry.|Raj argued with Ben until they got angry.|Raj argued with him until he got angry.
        At school they make us wear uniforms.|Our school makes students wear uniforms.|At school it makes us wear uniforms.|They make us wear uniforms at school.
        Take the plate off the box and wash it.|Take the plate off the box and wash the plate.|Take the plate off the box and wash them.|Take it off the box and wash it.
        On the website it says tickets are free.|The website says tickets are free.|On the website they say tickets are free.|It says on the website they are free.
        Ella showed Rosa the photo of her new house.|Ella showed Rosa a photo of Rosa's new house.|Ella showed her the photo of her new house.|Ella showed Rosa the photo of their new house.
        At the hospital they gave me a cast.|At the hospital a nurse gave me a cast.|At the hospital it gave me a cast.|They gave me a cast at the hospital.
        Leo called Sam after he got home.|After Sam got home, Leo called him.|Leo called Sam after they got home.|Leo called him after he got home.
        In Japan they eat a lot of rice.|People in Japan eat a lot of rice.|In Japan it eats a lot of rice.|They eat a lot of rice in Japan.
        When the truck hit the fence, it was badly damaged.|When the truck hit the fence, the fence was badly damaged.|When the truck hit the fence, they were badly damaged.|When it hit the fence, it was badly damaged.
        In the instructions it tells you to add water.|The instructions tell you to add water.|In the instructions they tell you to add water.|It tells you in the instructions to add water.
        The girls met the twins, and they went to the park.|The girls met the twins, and all four went to the park.|The girls met them, and they went to the park.|The girls met the twins, and it went to the park.
        Mia gave Lucy her book back.|Mia gave Lucy's book back to her.|Mia gave her book back to her.|Mia gave Lucy their book back.
        At the store they said the shoes were sold out.|The store clerk said the shoes were sold out.|At the store it said the shoes were sold out.|They said at the store they were sold out.
        I put the vase on the shelf, and it broke.|I put the vase on the shelf, and the vase broke.|I put the vase on the shelf, and they broke.|I put it on the shelf, and it broke.
        Tom told his brother that he was late.|Tom told his brother, "You are late."|Tom told him that he was late.|Tom told his brother that they were late.
        In the museum guide it says the mummy is fake.|The museum guide says the mummy is fake.|In the museum guide they say the mummy is fake.|It says in the guide that it is fake.
        When Ana met Rosa, she smiled.|When Ana met Rosa, Rosa smiled.|When Ana met Rosa, they smiled at her.|When she met Rosa, she smiled.
        At the meeting they decided to build a park.|At the meeting the council decided to build a park.|At the meeting it decided to build a park.|They decided at the meeting to build it.
        The coach praised the captain because she played well.|The coach praised the captain for playing well.|The coach praised her because she played well.|The coach praised the captain because they played well.
        On the label it says to keep the jar cold.|The label says to keep the jar cold.|On the label they say to keep the jar cold.|It says on the label to keep it cold.
        Remove the lid from the pot and clean it.|Remove the lid from the pot and clean the lid.|Remove the lid from the pot and clean them.|Remove it from the pot and clean it.
        In the article they claim sugar is harmful.|The article's author claims sugar is harmful.|In the article it claims sugar is harmful.|They claim in it that sugar is harmful.
        Jin's father told Ravi that he could stay for dinner.|Jin's father told Ravi, "You can stay for dinner."|Jin's father told him that he could stay for dinner.|Jin's father told Ravi that they could stay for dinner.
      `,
      (right) => [
        `**${right}** names the noun that was meant, so the reader knows exactly who or what it is.`,
        `**${right}** 说出了原本所指的名词，读者就确切知道指的是谁或什么。`,
      ],
      [
        [
          "*{wrong}* only swaps one vague pronoun for another; the reader still cannot tell who or what is meant.",
          "*{wrong}* 只是把一个指代不清的代词换成了另一个，读者仍然分不清指的是谁或什么。",
        ],
        ["*{wrong}* moves words around but keeps a pronoun with no clear noun.", "*{wrong}* 只是调换了词序，仍留着一个指代不明的代词。"],
      ],
    ),
  ],
});

const agreementBetween = topic("grammar", {
  id: "subject-verb-agreement-with-phrases-between",
  title: ["Agreement with Phrases Between", "主谓之间有短语时的一致"],
  summary: [
    "The verb agrees with its subject, not with a noun in a phrase that comes between them: The box of apples is heavy.",
    "动词与主语一致，而不是与主谓之间短语里的名词一致：The box of apples is heavy。",
  ],
  after: ["subject-verb-agreement", "prepositional-phrases"],
  points: [
    choose(
      "verb-after-a-phrase",
      ["The Verb After a Phrase", "短语之后的动词"],
      [
        "A phrase between a subject and its verb does not change the subject. In *The box of apples is heavy*, the subject is *box*, not *apples*, so the verb is singular. Cover the phrase that begins with *of*, *in*, *with*, *near* or *along with*, and match the verb to the noun that is left: *The players on the team ~~are~~ → The players are*.",
        "主语和动词之间的短语不会改变主语。在 *The box of apples is heavy* 中，主语是 *box* 而不是 *apples*，所以动词用单数。遮住以 *of*、*in*、*with*、*near* 或 *along with* 开头的短语，让动词与剩下的名词一致：*The players on the team are*。",
      ],
      ["Which verb completes the sentence?", "哪个动词能补全句子？"],
      `
${agreeVerbs}
        The box of crayons ___ on the shelf.|is|are|were being
        The students in the back row ___ talking.|are|is|was being
        A bag of oranges ___ two dollars.|costs|cost|costing
        The leaves on the old oak tree ___ turning red.|are|is|was being
        The girl with the curly braids ___ my cousin.|is|are|be
        The books on my desk ___ overdue.|are|is|was being
        One of the puppies ___ a black spot.|has|have|having
        The noise from the trucks ___ me awake.|keeps|keep|keeping
        The flowers in the garden ___ every spring.|bloom|blooms|blooming
        The teacher, along with her students, ___ the museum today.|visits|visit|visiting
        The price of the tickets ___ too high.|is|are|be
        The boys near the fountain ___ soccer.|play|plays|playing
        A list of rules ___ on the door.|hangs|hang|hanging
        The paintings in this room ___ very old.|are|is|was being
        The captain of the ships ___ the orders.|gives|give|giving
        Each of the students ___ a locker.|has|have|having
        The cookies in the jar ___ chocolate chips.|have|has|having
        The sound of the waves ___ me feel calm.|makes|make|making
        The cars in the parking lot ___ covered in snow.|are|is|was being
        The coach with his players ___ on the bus.|rides|ride|riding
        The members of the band ___ every Friday.|practice|practices|practicing
        A herd of elephants ___ the river each morning.|crosses|cross|crossing
        The windows of the old house ___ broken.|are|is|was being
        The color of the walls ___ bright yellow.|is|are|be
        The bridges over the river ___ closed today.|are|is|was being
        The smell of fresh bread ___ the kitchen.|fills|fill|filling
        The friends of my brother ___ loud.|are|is|was being
        A basket of apples ___ on the table.|sits|sit|sitting
        The houses on our street ___ red roofs.|have|has|having
        The leader of the hikers ___ the map.|carries|carry|carrying
      `,
      (right, shown) => [
        `${shown.replace("___", `**${right}**`)} Cover the phrase between the subject and the verb; the verb agrees with the subject that is left.`,
        `${shown.replace("___", `**${right}**`)} 遮住主语和动词之间的短语，动词与剩下的主语一致。`,
      ],
      [
        [
          "*{wrong}* agrees with the noun in the phrase, not with the true subject of the sentence.",
          "*{wrong}* 与短语里的名词一致，而不是与句子真正的主语一致。",
        ],
        ["*{wrong}* is not a form that can be the main verb of this present-tense sentence.", "*{wrong}* 不能作这个现在时句子的谓语动词。"],
      ],
    ),
    choose(
      "finding-the-true-subject",
      ["Finding the True Subject", "找出真正的主语"],
      [
        "Before you choose the verb, find the true subject: the noun the sentence is about, before any phrase that begins with a preposition. In *The keys to the car are lost*, the phrase *to the car* describes *keys*, so *keys* is the subject. *Along with*, *as well as* and *together with* also start phrases that do not join the subject.",
        "选动词之前，先找出真正的主语：句子所说的那个名词，在任何以介词开头的短语之前。在 *The keys to the car are lost* 中，短语 *to the car* 修饰 *keys*，所以 *keys* 是主语。*along with*、*as well as* 和 *together with* 开头的短语也不会并入主语。",
      ],
      ["Which word is the subject of the verb?", "哪个词是动词的主语？"],
      `
${agreeSubjects}
        The keys to the old car are missing.|keys|car|old
        A flock of geese flies over the lake.|flock|geese|lake
        The pictures on the wall need dusting.|pictures|wall|dusting
        My aunt, along with my cousins, lives in Ohio.|aunt|cousins|Ohio
        The bottom of the boxes is wet.|bottom|boxes|wet
        The cost of the repairs was surprising.|cost|repairs|surprising
        The students in Mr. Lee's class are on a trip.|students|class|trip
        One of my friends plays the trumpet.|One|friends|trumpet
        The lights in the hall flicker at night.|lights|hall|night
        A plate of cookies sits by the oven.|plate|cookies|oven
        The rules of the game are simple.|rules|game|simple
        The dog with three puppies barks at strangers.|dog|puppies|strangers
        The roof of the houses was damaged.|roof|houses|damaged
        The pages of this book are torn.|pages|book|torn
        The mayor, as well as the council members, agrees.|mayor|members|council
        The sound of drums echoes through the valley.|sound|drums|valley
        The trees along the river grow tall.|trees|river|tall
        A box of old letters was found in the attic.|box|letters|attic
        The singers in the choir wear blue robes.|singers|choir|robes
        The player with the most goals wins a prize.|player|goals|prize
        Each of the boys has a bike.|Each|boys|bike
        The members of the club meet on Mondays.|members|club|Mondays
        The bowl of strawberries is empty.|bowl|strawberries|empty
        The windows in the classroom face east.|windows|classroom|east
        The captain, together with his crew, sails at dawn.|captain|crew|dawn
        The tracks of the deer lead into the woods.|tracks|deer|woods
        A group of hikers was lost in the fog.|group|hikers|fog
        The colors of the sunset are beautiful.|colors|sunset|beautiful
        The smell of the roses fills the yard.|smell|roses|yard
        The coats in the closet belong to my brothers.|coats|closet|brothers
      `,
      (right, shown) => [
        `The subject is **${right}**: it is what the sentence is about, and the phrase after it only describes it. ${shown}`,
        `主语是 **${right}**：句子说的是它，后面的短语只是在修饰它。${shown}`,
      ],
      [
        [
          "*{wrong}* sits inside a phrase that describes the subject, so it cannot be the subject.",
          "*{wrong}* 在修饰主语的短语里，所以不可能是主语。",
        ],
        [
          "*{wrong}* comes after the verb or describes something else; it is not what the verb agrees with.",
          "*{wrong}* 在动词之后或修饰别的成分，动词不与它一致。",
        ],
      ],
    ),
  ],
});

const numbers = topic("grammar", {
  id: "numbers-in-words-or-figures",
  title: ["Numbers in Words or Figures", "数字用文字还是阿拉伯数字"],
  summary: [
    "Spell out numbers under one hundred and any number that begins a sentence; use figures for dates, times, measurements, money and large numbers.",
    "一百以下的数和句首的数用文字写；日期、时间、度量、金额和大数用阿拉伯数字写。",
  ],
  after: ["hyphens"],
  points: [
    choose(
      "spelling-out-numbers",
      ["Spelling Out Numbers", "用文字写数字"],
      [
        "In most writing, **spell out** numbers from one to ninety-nine, with a hyphen in the compound ones from twenty-one to ninety-nine: *forty-two students*. Always spell out a number that **begins a sentence**: *Twelve people came*, not *12 people came*. Larger numbers, such as *350*, are written in figures in the middle of a sentence.",
        "在大多数文章中，一到九十九的数要**用文字写**，二十一到九十九之间的复合数要加连字符：*forty-two students*。**句首的数**一律用文字写：*Twelve people came*，而不是 *12 people came*。较大的数，如 *350*，在句中用阿拉伯数字写。",
      ],
      ["Which way of writing the number is correct?", "哪种写法正确？"],
      `
${numberSpell}
        Our class has ___ students.|twenty-six|26|twenty six
        ___ people came to the meeting.|Fifteen|15|fifteen
        The library owns ___ books.|4,580|four thousand five hundred eighty|four-thousand-five-hundred-eighty
        I have read ___ chapters so far.|eleven|11|eleventh
        ___ ducks swam across the pond.|Thirty-one|31|Thirty one
        The school has ___ students in all.|612|six hundred twelve|six-hundred-twelve
        My grandmother is ___ years old.|eighty-four|84|eighty four
        ___ runners finished the race.|Ninety-nine|99|Ninety nine
        The stadium holds ___ fans.|41,370|forty-one thousand three hundred seventy|41 thousand 370
        We saw ___ deer on our hike.|seven|7|seventh
        ___ students signed the letter.|Forty-three|43|Forty three
        The farm has ___ chickens.|fifty-five|55|fifty five
        The town has ___ people.|8,215|eight thousand two hundred fifteen|8 thousand 215
        ___ planets go around the Sun.|Eight|8|eighth
        Our team won ___ games this year.|nineteen|19|ninteen
        There were ___ pages in the report.|thirty-two|32|thirty two
        ___ boats sailed into the harbor.|Twenty|20|twenty
        The book has ___ pages.|384|three hundred eighty-four|three-hundred-eighty-four
        I counted ___ birds on the wire.|twelve|12|twelfth
        ___ cars were stuck in the snow.|Sixty-eight|68|Sixty eight
        The museum has ___ paintings.|1,256|one thousand two hundred fifty-six|1 thousand 256
        Our dog had ___ puppies.|six|6|sixth
        ___ trees were planted in the park.|Seventy-five|75|Seventy five
        My brother has ___ stickers.|forty-four|44|forty four
        The bridge took ___ workers to build.|2,140|two thousand one hundred forty|2 thousand 140
        ___ members voted yes.|Fourteen|14|fourteen
        The bakery sold ___ loaves today.|ninety-one|91|ninety one
        The class collected ___ cans of food.|312|three hundred twelve|three-hundred-twelve
        ___ students joined the chess club.|Twenty-two|22|Twenty two
        There are ___ days in a week.|seven|7|seventh
      `,
      (right, shown) => [
        `${shown.replace("___", `**${right}**`)} Spell out numbers under one hundred and at the start of a sentence; write larger numbers in figures.`,
        `${shown.replace("___", `**${right}**`)} 一百以下的数和句首的数用文字写，较大的数用阿拉伯数字写。`,
      ],
      [
        [
          "*{wrong}* breaks the rule for numbers of this size or at this place in the sentence.",
          "*{wrong}* 违反了这类大小或这个位置的数字的写法规则。",
        ],
        [
          "*{wrong}* is not a correct way to write this number; check the hyphen and the spelling.",
          "*{wrong}* 不是这个数的正确写法，检查连字符和拼写。",
        ],
      ],
    ),
    label(
      "when-to-use-figures",
      ["When to Use Figures", "什么时候用阿拉伯数字"],
      [
        "Some numbers are always written in **figures**, even when they are small: **dates** (*May 4*), **times** with a.m. or p.m. (*7:30 p.m.*), **measurements** with units (*3 kilometers*, *5 kg*), **money** (*$8*), **percentages** (*6 percent*) and numbers that are **large** (*1,500*). Small counts of ordinary things are **spelled out**.",
        "有些数即使很小，也总是用**阿拉伯数字**写：**日期**（*May 4*）、带 a.m. 或 p.m. 的**时间**（*7:30 p.m.*）、带单位的**度量**（*3 kilometers*、*5 kg*）、**金额**（*$8*）、**百分比**（*6 percent*），以及**大数**（*1,500*）。普通事物的小数目则**用文字写**。",
      ],
      ["How should the number in italics be written?", "斜体的数应该怎么写？"],
      `
${numberForm}
        The concert starts at *seven thirty p.m.*|in figures
        We bought *three* tickets.|spelled out
        My cousin was born on *July nine*.|in figures
        The trail is *four kilometers* long.|in figures
        I have *two* sisters and a brother.|spelled out
        The book costs *nine dollars*.|in figures
        About *five percent* of the students were absent.|in figures
        We waited *ten* minutes for the bus.|spelled out
        The baby weighed *three kilograms*.|in figures
        School ends on *June fourteen*.|in figures
        Our class has *four* hamsters.|spelled out
        The flight leaves at *six fifteen a.m.*|in figures
        The box is *thirty centimeters* wide.|in figures
        I ate *two* apples for lunch.|spelled out
        A ticket costs *twelve dollars*.|in figures
        Prices rose by *eight percent*.|in figures
        We visited *three* museums.|spelled out
        The river is *six meters* deep here.|in figures
        Mom's birthday is *March twenty*.|in figures
        Dinner is at *six p.m.*|in figures
        She owns *five* hats.|spelled out
        The pumpkin weighs *nine kilograms*.|in figures
        Only *two percent* of the water is fresh.|in figures
        The boy found *six* shells.|spelled out
        The game was on *October three*.|in figures
        The fish was *forty centimeters* long.|in figures
        I spent *four dollars* on snacks.|in figures
        We sang *three* songs.|spelled out
        The bell rings at *eight ten a.m.*|in figures
        The tank holds *fifty liters* of water.|in figures
      `,
      {
        "in figures": {
          zh: "用阿拉伯数字",
          why: [
            "Dates, times, measurements, money and percentages are written in figures, whatever their size.",
            "日期、时间、度量、金额和百分比不论大小都用阿拉伯数字写。",
          ],
          not: [
            "This is a small count of ordinary things, which is spelled out, not written in figures.",
            "这是普通事物的小数目，要用文字写，而不是用阿拉伯数字。",
          ],
        },
        "spelled out": {
          zh: "用文字写",
          why: ["A small count of ordinary things is spelled out.", "普通事物的小数目用文字写。"],
          not: [
            "Dates, times, measurements, money and percentages are written in figures, so this one should not be spelled out.",
            "日期、时间、度量、金额和百分比用阿拉伯数字写，所以这里不该用文字。",
          ],
        },
        "with a hyphen": {
          zh: "用连字符",
          why: [
            "Compound numbers from twenty-one to ninety-nine take a hyphen when spelled out.",
            "二十一到九十九之间的复合数用文字写时要加连字符。",
          ],
          not: [
            "A hyphen joins the parts of a spelled-out number from twenty-one to ninety-nine; it does not decide whether to use figures.",
            "连字符用于连接用文字写的二十一到九十九的数，它不决定是否用阿拉伯数字。",
          ],
        },
      },
    ),
  ],
});

const pronounNumber = topic("grammar", {
  id: "shifts-in-pronoun-number",
  title: ["Shifts in Pronoun Number", "代词数的不当转换"],
  summary: [
    "A pronoun keeps the number of its noun: a singular noun takes it or its, a plural noun takes they or their.",
    "代词与它所指的名词保持数的一致：单数名词用 it 或 its，复数名词用 they 或 their。",
  ],
  after: ["shifts-in-pronoun-person", "indefinite-pronouns-and-agreement"],
  points: [
    label(
      "its-or-their",
      ["Its or Their", "its 还是 their"],
      [
        "A pronoun must match the **number** of its noun. A singular thing, animal or group acting as one unit takes **its**: *The team lost its first game. The tree dropped its leaves.* Plural nouns take **their**: *The trees dropped their leaves.* Do not confuse *its* (belonging to it) with **it's** (it is).",
        "代词必须与它所指名词的**数**一致。单数的事物、动物或作为一个整体行动的群体用 **its**：*The team lost its first game. The tree dropped its leaves.* 复数名词用 **their**：*The trees dropped their leaves.* 不要把 *its*（它的）和 **it's**（it is）弄混。",
      ],
      ["Which word completes the sentence?", "哪个词能补全句子？"],
      `
${itsLines}
        The company moved ___ office to the city.|its
        The birds built ___ nests in the barn.|their
        ___ too cold to swim today.|it's
        The school held ___ fair in May.|its
        The players thanked ___ fans.|their
        The dog wagged ___ tail.|its
        ___ been raining all week.|it's
        The flowers opened ___ petals in the sun.|their
        The city repaired ___ oldest bridge.|its
        The students handed in ___ projects.|their
        I think ___ time to go home.|it's
        The committee announced ___ decision.|its
        The cars turned on ___ headlights.|their
        The river overflowed ___ banks.|its
        ___ a long way to the top.|it's
        The bees returned to ___ hive.|their
        The band played ___ new song.|its
        The farmers sold ___ apples at the market.|their
        ___ my turn to choose a game.|it's
        The country celebrated ___ independence.|its
        The kittens drank ___ milk.|their
        The museum opened ___ doors at nine.|its
        ___ hard to believe summer is over.|it's
        The hikers packed ___ tents.|their
        The jury gave ___ verdict.|its
        The boys forgot ___ lunches.|their
        The computer lost ___ power.|its
        ___ the best book I have read.|it's
        The waves left ___ shells on the sand.|their
        The class chose ___ leader.|its
      `,
      {
        its: {
          zh: "its",
          why: ["The noun is singular, so the pronoun of belonging is *its*.", "名词是单数，所以表示所属的代词用 *its*。"],
          not: ["*Its* is singular, and the noun here is plural.", "*its* 是单数，而这里的名词是复数。"],
        },
        their: {
          zh: "their",
          why: ["The noun is plural, so the pronoun of belonging is *their*.", "名词是复数，所以表示所属的代词用 *their*。"],
          not: [
            "*Their* is plural, and the noun here is singular or the gap needs *it is*.",
            "*their* 是复数，而这里的名词是单数，或者空格处需要 *it is*。",
          ],
        },
        "it's": {
          zh: "it's",
          why: [
            "The gap means *it is* or *it has*, so the contraction *it's* fits.",
            "空格处的意思是 *it is* 或 *it has*，所以用缩写 *it's*。",
          ],
          not: ["*It's* means *it is*, and the gap needs a word of belonging.", "*it's* 的意思是 *it is*，而空格处需要一个表示所属的词。"],
        },
      },
    ),
    choose(
      "keeping-pronoun-number",
      ["Keeping the Number Steady", "保持数的一致"],
      [
        "When you write about one thing, keep the pronouns singular all the way through; when you write about many, keep them plural. *A volcano can erupt when their pressure builds* shifts from singular to plural. Fix it by matching the pronoun to its noun: *when its pressure builds*, or make both plural: *Volcanoes can erupt when their pressure builds*.",
        "写一件事物时，代词要始终用单数；写许多事物时，要始终用复数。*A volcano can erupt when their pressure builds* 由单数转成了复数。改正方法是让代词与名词一致：*when its pressure builds*，或者两者都用复数：*Volcanoes can erupt when their pressure builds*。",
      ],
      ["Which sentence keeps the pronoun number steady?", "哪个句子的代词保持了数的一致？"],
      `
${steadyLines}
        a volcano and its pressure|A volcano erupts when its pressure builds.|A volcano erupts when their pressure builds.|A volcano erupts when they build pressure.
        bees and their stings|Bees use their stings to defend the hive.|Bees use its sting to defend the hive.|A bee uses their stings to defend the hive.
        the team and its coach|The team listened to its coach.|The team listened to their coach and it nodded.|The team listened to them coach.
        planets and their orbits|The planets follow their orbits around the Sun.|The planets follow its orbit around the Sun.|Each planet follows their orbits around the Sun.
        a frog and its tongue|A frog catches flies with its long tongue.|A frog catches flies with their long tongue.|Frogs catches flies with its long tongue.
        the trees and their roots|The trees spread their roots deep.|The trees spread its roots deep.|The tree spread their roots deep.
        the store and its prices|The store lowered its prices.|The store lowered their prices.|The stores lowered its prices.
        students and their books|Students should label their books.|Students should label his book.|A student should label their books.
        a plant and its leaves|A plant turns its leaves toward the light.|A plant turns their leaves toward the light.|Plants turns its leaves toward the light.
        the families and their pets|The families brought their pets to the vet.|The families brought its pets to the vet.|The family brought their pets and its dog.
        the city and its parks|The city takes care of its parks.|The city takes care of their parks.|The cities takes care of its parks.
        cars and their engines|Cars need oil for their engines.|Cars need oil for its engine.|A car needs oil for their engines.
        a spider and its web|A spider spins its web at night.|A spider spins their web at night.|Spiders spins its web at night.
        the climbers and their ropes|The climbers checked their ropes.|The climbers checked its ropes.|The climber checked their ropes.
        the school and its library|The school opened its new library.|The school opened their new library.|The schools opened its new library.
        rivers and their mouths|Rivers carry mud to their mouths.|Rivers carry mud to its mouth.|A river carries mud to their mouths.
        the club and its members|The club welcomed its new members.|The club welcomed their new members.|The clubs welcomed its new member.
        birds and their feathers|Birds clean their feathers every day.|Birds clean its feathers every day.|A bird cleans their feathers every day.
        the country and its flag|The country raised its flag.|The country raised their flag.|The countries raised its flag.
        workers and their tools|The workers put away their tools.|The workers put away its tools.|The worker put away their tools.
        the machine and its parts|The machine needs oil for its parts.|The machine needs oil for their parts.|The machines needs oil for its parts.
        dogs and their owners|Dogs often look like their owners.|Dogs often look like its owner.|A dog often looks like their owners.
        the band and its fans|The band waved to its fans.|The band waved to their fans and it bowed.|The bands waved to its fans.
        leaves and their color|Leaves change their color in fall.|Leaves change its color in fall.|A leaf changes their colors in fall.
        the river and its banks|The river flooded its banks.|The river flooded their banks.|The rivers flooded its bank.
        children and their coats|The children hung up their coats.|The children hung up its coats.|The child hung up their coats.
        the hive and its queen|The hive protects its queen.|The hive protects their queen.|The hives protects its queen.
        ships and their sails|The ships raised their sails.|The ships raised its sail.|The ship raised their sails.
        the cat and its kittens|The cat fed its kittens.|The cat fed their kittens.|The cats fed its kittens.
        stars and their light|Stars give off their own light.|Stars give off its own light.|A star gives off their own light.
      `,
      (right) => [
        `**${right}** The pronoun has the same number as its noun all the way through.`,
        `**${right}** 代词始终与它所指的名词数一致。`,
      ],
      [
        ["*{wrong}* shifts the pronoun to the other number from its noun.", "*{wrong}* 把代词转成了与名词不同的数。"],
        [
          "*{wrong}* mixes singular and plural between the noun, the verb and the pronoun.",
          "*{wrong}* 在名词、动词和代词之间混用了单数和复数。",
        ],
      ],
    ),
  ],
});

/** grammarTopics6a are the grade 6 topics of pronouns, clauses, agreement and numbers. */
export const grammarTopics6a: readonly TopicDef[] = [
  whoAndWhom,
  whoWhichThat,
  nonessentialCommas,
  intensivePronouns,
  vaguePronouns,
  agreementBetween,
  numbers,
  pronounNumber,
];
