// Grade 9: grammar and mechanics of the later units: brackets in quotations, the literary present, rules and myths
// of usage, a fifth set of commonly confused words and words that are often misspelled.

import type { TopicDef } from "@ga/content";
import { everyPair } from "../../levels/words.ts";
import { choose, type Label, label, topic } from "../grade-6/kit.ts";

// Crossed items: frames, people and phrases multiply the lines below into a hundred items or more for each bank.

const join = (lines: readonly string[]) => lines.join("\n");
const upper = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** quotedPeople are characters with the pronoun that stands for them; quotedDeeds are what a pronoun did in a source. */
const quotedPeople = [
  ["Penelope", "She"],
  ["Juliet", "She"],
  ["Antigone", "She"],
  ["Ophelia", "She"],
  ["Odysseus", "He"],
  ["Hamlet", "He"],
  ["Macbeth", "He"],
  ["Romeo", "He"],
] as const;
const quotedDeeds = [
  "waited by the window every night",
  "refused to speak to the king",
  "hid the letter in a book",
  "walked alone by the river",
  "trusted the wrong friend",
  "kept the secret for years",
  "argued with the old servant",
  "left the castle before dawn",
  "wrote a long letter home",
  "laughed at the warning",
] as const;
const sources = ["The narrator says that", "The critic notes that", "The summary states that", "One reader argues that"] as const;
const bracketLines = join(
  everyPair(quotedPeople, quotedDeeds).map(([[name, pronoun], deed], k) => {
    const source = sources[k % 4];
    return `Original: "${pronoun} ${deed}." Write about ${name}.|${source} "[${name}] ${deed}."|${source} "(${name}) ${deed}."|${source} "${name} ${deed}."`;
  }),
);
const groups = ["The sailors", "The rebels", "The students", "The villagers", "The soldiers"] as const;
const groupStates = ["ready to leave", "tired of waiting", "afraid of the storm", "proud of the work"] as const;
const signs = [
  ["Visitors must [not] feed", "the bears"],
  ["Guests should [not] touch", "the paintings"],
  ["Swimmers must [not] dive into", "the shallow end"],
  ["Hikers should [not] leave", "the marked trail"],
] as const;
const signPlaces = ["at the zoo", "in the park", "at the museum", "by the lake"] as const;
const sicErrors = [
  "the war ended in 1815 [sic]",
  "the capital of Australia is Sydney [sic]",
  "the moon is a planet [sic]",
  "the company was founded in 1990 [sic]",
  "Shakespeare wrote Don Quixote [sic]",
  "the river flows north to the Atlantic [sic]",
  "the bridge opened in 1937 [sic]",
  "whales are a kind of fish [sic]",
] as const;
const whyBracketLines = join([
  ...everyPair(quotedPeople, quotedDeeds)
    .filter((_, k) => k % 2 === 0)
    .map(([[name], deed]) => `"[${name}] ${deed}."|replaces a pronoun`),
  ...everyPair(groups, groupStates).map(([group, state]) => `${group} wrote that they "[were] ${state}."|fits the grammar`),
  ...everyPair(signs, signPlaces).map(([[rule, thing], place]) => `The sign ${place} said, "${rule} ${thing}."|adds a missing word`),
  ...sicErrors.flatMap((error) => [
    `The letter claims that "${error}."|marks an error in the original`,
    `The old report says "${error}."|marks an error in the original`,
  ]),
]);

/** plotEvents are a character, present, past, past perfect and base forms, and the rest of the event. */
const plotEvents = [
  ["Romeo", "meets", "met", "had met", "meet", "Juliet at a feast"],
  ["Pip", "visits", "visited", "had visited", "visit", "Miss Havisham"],
  ["Elizabeth", "refuses", "refused", "had refused", "refuse", "Mr. Darcy's first proposal"],
  ["Victor", "creates", "created", "had created", "create", "the creature"],
  ["Huck", "floats", "floated", "had floated", "float", "down the Mississippi"],
  ["Jane", "leaves", "left", "had left", "leave", "Thornfield Hall"],
  ["the animals", "drive", "drove", "had driven", "drive", "out Mr. Jones"],
  ["George", "dreams", "dreamed", "had dreamed", "dream", "of owning a farm"],
  ["Scout", "meets", "met", "had met", "meet", "Boo Radley"],
  ["Ishmael", "joins", "joined", "had joined", "join", "the crew of the Pequod"],
  ["Jim", "finds", "found", "had found", "find", "the treasure map"],
  ["Okonkwo", "fears", "feared", "had feared", "fear", "being thought weak"],
] as const;
const plotFrames = ["In the story,", "In one scene,", "As the plot unfolds,", "At one point,"] as const;
/** writing are an author, the work and the year it appeared. */
const writing = [
  ["Shakespeare", "the play", "around 1595"],
  ["Dickens", "Great Expectations", "in 1861"],
  ["Jane Austen", "Pride and Prejudice", "in 1813"],
  ["Mary Shelley", "Frankenstein", "in 1818"],
  ["Mark Twain", "the novel", "in 1884"],
  ["Charlotte Brontë", "Jane Eyre", "in 1847"],
  ["Orwell", "Animal Farm", "in 1945"],
  ["Steinbeck", "the novella", "in 1937"],
  ["Harper Lee", "her only early novel", "in 1960"],
  ["Melville", "Moby-Dick", "in 1851"],
  ["Stevenson", "Treasure Island", "in 1883"],
  ["Achebe", "Things Fall Apart", "in 1958"],
] as const;
const tenseLines = join([
  ...everyPair(plotEvents, plotFrames).map(
    ([[who, present, past, perfect, , rest], frame]) => `${frame} ${who} ___ ${rest}.|${present}|${past}|${perfect}`,
  ),
  ...writing.flatMap(([author, work, when]) => [
    `${author} ___ ${work} ${when}.|wrote|writes|is writing`,
    `${author} ___ ${work} ${when}, and it sold well.|published|publishes|is publishing`,
  ]),
]);
const textOrHistory = join([
  ...everyPair(plotEvents, plotFrames).map(
    ([[who, , , , base, rest], frame]) => `${frame} ${who} ___ ${rest}. (${base})|the text: present tense`,
  ),
  ...writing.flatMap(([author, work, when]) => [
    `${author} ___ ${work} ${when}. (write)|history: past tense`,
    `${author} ___ ${work} ${when}. (finish)|history: past tense`,
  ]),
]);

/** usageClaims are a claim, what it is, and examples that it is about. */
const usageClaims = [
  [
    "A verb must agree with its subject in number",
    "real rule",
    [
      "The dogs bark",
      "She runs every day",
      "The list of names is long",
      "Each of the girls has a ticket",
      "My friends were late",
      "The box of books is heavy",
    ],
  ],
  [
    "Never split an infinitive",
    "myth",
    ["to boldly go", "to quickly finish", "to really understand", "to carefully read", "to fully recover", "to gently remind"],
  ],
  [
    "Never end a sentence with a preposition",
    "myth",
    [
      "Who did you talk to?",
      "What is it made of?",
      "This is the town I grew up in.",
      "Which box should I put it in?",
      "Where are you from?",
      "That is the song we danced to.",
    ],
  ],
  [
    "Never begin a sentence with a conjunction",
    "myth",
    [
      "But the plan failed.",
      "And then it rained.",
      "So we went home.",
      "Yet nobody complained.",
      "Or we could wait.",
      "But the king said no.",
    ],
  ],
  [
    "Capitalize the names of particular people and places",
    "real rule",
    ["Paris", "Lake Victoria", "Maria", "Mount Fuji", "the Nile", "Tokyo"],
  ],
  ["Use an before a vowel sound", "real rule", ["an hour", "an apple", "an honest man", "an umbrella", "an egg", "an idea"]],
  ["Avoid contractions in a formal report", "choice of style", ["don't", "can't", "won't", "it's", "isn't", "they're"]],
  [
    "Put a comma before the last and in a list",
    "choice of style",
    [
      "red, white, and blue",
      "bread, milk, and eggs",
      "pens, paper, and glue",
      "cats, dogs, and birds",
      "Lima, Quito, and Bogotá",
      "north, south, and west",
    ],
  ],
  [
    "Do not join two sentences with only a comma",
    "real rule",
    [
      "The rain stopped, we went out",
      "I was tired, I went to bed",
      "The bus was late, we walked",
      "She won, everyone cheered",
      "It was cold, we lit a fire",
      "He called, no one answered",
    ],
  ],
  [
    "Never use the passive voice",
    "myth",
    [
      "The bridge was built in 1900",
      "Mistakes were made",
      "The data were collected in May",
      "The letter was signed by the mayor",
      "The water was heated to 80 degrees",
      "The winner will be announced tomorrow",
    ],
  ],
  [
    "Spell out numbers under ten in a magazine article",
    "choice of style",
    ["three dogs", "seven days", "five friends", "two hours", "nine books", "six miles"],
  ],
  [
    "Use fewer with things you can count in formal writing",
    "real rule",
    ["fewer cars", "fewer students", "fewer mistakes", "fewer days", "fewer books", "fewer apples"],
  ],
] as const;
const ruleLines = join(
  usageClaims.flatMap(([claim, kind, examples]) => examples.map((example) => `${claim}, as in "${example}".|${kind}`)),
);
const groupNouns = ["boys", "girls", "players", "students", "guests", "workers"] as const;
const theirThings = ["a ticket", "a locker", "a badge", "a seat"] as const;
const slang = ["kind of awesome", "super weird", "totally lame", "a big deal, honestly", "pretty sketchy", "a huge letdown"] as const;
const slangSubjects = ["The results", "The ending", "The data", "The experiment", "The plan"] as const;
const fineLines = [
  "She decided to quickly leave the room.",
  "They hoped to finally reach the summit.",
  "What are you afraid of?",
  "This is the house I was born in.",
  "But the king would not listen.",
  "And so the war began.",
  "Who did you give the key to?",
  "We wanted to really help.",
  "That is the problem we must deal with.",
  "So the town built a new bridge.",
  "The judge asked us to carefully read the rules.",
  "Which team are you on?",
  "Yet the storm passed without harm.",
  "Somebody left their coat in the hall.",
  "The council voted to slowly raise the fee.",
  "Where did the letter come from?",
  "Or we could take the early train.",
  "Everyone brought their own lunch.",
  "That was the bridge we walked across.",
  "Because the road was closed, we waited.",
  "The class tried to fully understand the poem.",
  "This is the book I told you about.",
  "But nobody answered the door.",
  "And then the lights came on.",
] as const;
const acceptableLines = join([
  ...fineLines.map((line) => `${line}|acceptable`),
  ...everyPair(groupNouns, theirThings).map(([who, thing]) => `Each of the ${who} have ${thing}.|an error`),
  ...groupNouns.map((who) => `Neither of the ${who} were ready.|an error`),
  ...everyPair(slangSubjects, slang).map(
    ([subject, word]) => `${subject} ${subject === "The data" || subject === "The results" ? "were" : "was"} ${word}.|too informal`,
  ),
]);

/** confusedSentences are sentences for each word of the ten pairs, with the word it is confused with and a third word. */
const confusedSentences = [
  [
    "allude",
    "elude",
    "illude",
    [
      "The speaker seemed to ___ to an old scandal.",
      "Writers often ___ to the Bible.",
      "Did the letter ___ to the missing money?",
      "The song's title may ___ to a famous poem.",
    ],
  ],
  [
    "elude",
    "allude",
    "delude",
    [
      "The fox managed to ___ the hounds.",
      "Sleep continued to ___ her all night.",
      "The answer seemed to ___ every student.",
      "The spy tried to ___ the guards at the border.",
    ],
  ],
  [
    "appraise",
    "apprise",
    "praise",
    [
      "The jeweler will ___ the ring tomorrow.",
      "Please ___ the damage before we pay.",
      "The expert came to ___ the old coins.",
      "Coaches ___ each player's skill at the tryout.",
    ],
  ],
  [
    "apprise",
    "appraise",
    "apprize",
    [
      "Please ___ me of any changes to the plan.",
      "The doctor will ___ the family of the results.",
      "Did anyone ___ the captain of the storm?",
      "We will ___ you of our decision by Friday.",
    ],
  ],
  [
    "cite",
    "site",
    "sight",
    [
      "Remember to ___ every source in your essay.",
      "Can you ___ an example from the text?",
      "Lawyers often ___ earlier cases.",
      "Please ___ the page number of the quotation.",
    ],
  ],
  [
    "site",
    "cite",
    "sight",
    [
      "The ___ of the new library is next to the park.",
      "Workers cleared the building ___.",
      "Archaeologists found coins at the ___.",
      "The campers chose a ___ near the river.",
    ],
  ],
  [
    "credible",
    "credulous",
    "creditable",
    [
      "The witness gave a ___ account of the crash.",
      "Is this website a ___ source?",
      "Her excuse was not very ___.",
      "The scientist offered a ___ explanation.",
    ],
  ],
  [
    "credulous",
    "credible",
    "incredible",
    [
      "Only a ___ person would believe that rumor.",
      "The ___ villagers paid for fake medicine.",
      "Don't be so ___; check the facts first.",
      "The swindler looked for ___ buyers.",
    ],
  ],
  [
    "disinterested",
    "uninterested",
    "interesting",
    [
      "A judge must be ___ in the case.",
      "We need a ___ referee for the final.",
      "The dispute was settled by a ___ expert.",
      "Only a ___ observer can be truly fair.",
    ],
  ],
  [
    "uninterested",
    "disinterested",
    "interested",
    [
      "The bored students seemed ___ in the lecture.",
      "My cat is completely ___ in its new toy.",
      "He looked ___ and kept checking his phone.",
      "The audience grew ___ as the speech went on.",
    ],
  ],
] as const;
const pick3 = (k: number) => confusedSentences[k % confusedSentences.length] ?? confusedSentences[0];
const fitWordLines = join(
  confusedSentences.flatMap(([word, partner, third, sentences]) => sentences.map((sentence) => `${sentence}|${word}|${partner}|${third}`)),
);
const fitWordMore = join(
  confusedSentences.flatMap(([word, partner, , sentences], k) =>
    sentences.map(
      (sentence, j) =>
        `${["In the essay,", "As expected,", "Once again,", "This time,"][j % 4]} ${sentence.charAt(0).toLowerCase()}${sentence.slice(1)}|${word}|${partner}|${pick3(k + 2 + j * 2)[0]}`,
    ),
  ),
);
/** meanings are definitions in several words for each confused word. */
const meanings = [
  [
    "allude",
    "elude",
    "illude",
    [
      "to hint at something without naming it",
      "to make an indirect reference",
      "to refer to something in passing",
      "to suggest something without saying it outright",
    ],
  ],
  [
    "elude",
    "allude",
    "delude",
    ["to escape by cleverness or speed", "to avoid being caught", "to slip away from a pursuer", "to remain out of reach of someone"],
  ],
  [
    "appraise",
    "apprise",
    "praise",
    [
      "to estimate what something is worth",
      "to judge the quality of something",
      "to set a price on something after study",
      "to size up carefully",
    ],
  ],
  [
    "apprise",
    "appraise",
    "apprize",
    ["to give someone news", "to keep someone informed", "to let someone know the facts", "to tell someone about a situation"],
  ],
  ["cite", "site", "sight", ["to quote a source", "to name as an example", "to refer to as proof", "to mention a law or case as support"]],
  [
    "site",
    "cite",
    "sight",
    [
      "the place where something is built",
      "a location for an event",
      "the spot where something happened",
      "a piece of land chosen for a purpose",
    ],
  ],
  ["sight", "site", "cite", ["the ability to see", "something that is seen", "a view worth seeing", "the act of seeing"]],
  ["credible", "credulous", "creditable", ["believable", "worthy of trust", "convincing enough to accept", "likely to be true"]],
  [
    "credulous",
    "credible",
    "incredible",
    ["too ready to believe things", "easily fooled", "trusting without proof", "quick to accept any story"],
  ],
  [
    "disinterested",
    "uninterested",
    "interesting",
    ["fair because you have nothing to gain", "free of personal interest", "impartial", "not taking sides"],
  ],
  [
    "uninterested",
    "disinterested",
    "interested",
    ["bored", "not curious", "not paying attention because of boredom", "without any wish to know more"],
  ],
  [
    "historic",
    "historical",
    "history",
    [
      "famous and important in history",
      "likely to be remembered for a long time",
      "marking a turning point",
      "of great importance in the story of a nation",
    ],
  ],
  [
    "historical",
    "historic",
    "hysterical",
    [
      "having to do with history",
      "based on people or events of the past",
      "set in an earlier period",
      "belonging to the study of the past",
    ],
  ],
  [
    "ingenious",
    "ingenuous",
    "ingenuity",
    ["very clever and inventive", "showing original skill", "cleverly made", "full of smart new ideas"],
  ],
  ["ingenuous", "ingenious", "ingenue", ["innocent and trusting", "open and honest like a child", "lacking guile", "simple and sincere"]],
  [
    "perspective",
    "prospective",
    "persuasive",
    ["a point of view", "a way of seeing a problem", "the angle from which a story is told", "a sense of what really matters"],
  ],
  ["loathe", "loath", "load", ["to hate deeply", "to feel disgust for", "to detest", "to find hateful"]],
  ["loath", "loathe", "loth", ["unwilling", "reluctant to do something", "not ready to agree", "slow to give permission"]],
] as const;
const meaningLines = join(meanings.flatMap(([word, partner, third, defs]) => defs.map((def) => `${def}|${word}|${partner}|${third}`)));

/** hardWords are a commonly misspelled word, two misspellings, and two sentences that use it with two other words from each. */
const hardWords = [
  [
    "accommodate",
    "accomodate",
    "acommodate",
    ["The new hall can ___ two hundred people.|hall|people", "We will ___ every guest in the old inn.|guest|inn"],
  ],
  [
    "argument",
    "arguement",
    "argumint",
    ["Her ___ convinced the whole jury.|convinced|jury", "The ___ ended when Dad came home.|ended|home"],
  ],
  ["beginning", "begining", "beggining", ["The ___ of the film was slow.|film|slow", "At the ___ of term, we got new books.|term|books"]],
  ["believe", "beleive", "belive", ["I ___ the story is true.|story|true", "Few people ___ in ghosts now.|people|ghosts"]],
  ["calendar", "calender", "calandar", ["Mark the date on the ___.|date|Mark", "The kitchen ___ shows every holiday.|kitchen|holiday"]],
  [
    "cemetery",
    "cemetary",
    "cematery",
    ["The old ___ lies behind the church.|church|behind", "We walked past the ___ at dusk.|walked|dusk"],
  ],
  ["committee", "commitee", "comittee", ["The ___ will vote on Monday.|vote|Monday", "A ___ of parents planned the fair.|parents|fair"]],
  [
    "conscious",
    "concious",
    "consious",
    ["The patient was ___ after the surgery.|patient|surgery", "She made a ___ effort to listen.|effort|listen"],
  ],
  ["environment", "enviroment", "envirnment", ["We must protect the ___.|protect|must", "The school has a friendly ___.|school|friendly"]],
  [
    "exaggerate",
    "exagerate",
    "exaggarate",
    ["Fishermen often ___ the size of their catch.|Fishermen|catch", "Please do not ___ the danger.|danger|Please"],
  ],
  [
    "existence",
    "existance",
    "existense",
    ["Scientists doubt the ___ of the monster.|Scientists|monster", "The town's ___ depends on the river.|town's|river"],
  ],
  [
    "foreign",
    "foriegn",
    "foreing",
    ["She speaks three ___ languages.|speaks|languages", "The ___ visitors loved the market.|visitors|market"],
  ],
  ["government", "goverment", "govermint", ["The ___ raised the tax on fuel.|tax|fuel", "Our ___ meets in the capital.|meets|capital"]],
  ["guarantee", "garantee", "guarentee", ["The shop gives a ___ on every bike.|shop|bike", "I cannot ___ that it will work.|cannot|work"]],
  ["harass", "harrass", "harras", ["The geese ___ anyone near the pond.|geese|pond", "Please do not ___ the animals.|animals|Please"]],
  ["immediately", "immediatly", "imediately", ["Call the doctor ___.|Call|doctor", "The crowd left ___ after the game.|crowd|game"]],
  [
    "independent",
    "independant",
    "indipendent",
    ["The country became ___ in 1960.|country|became", "She is a very ___ thinker.|thinker|very"],
  ],
  ["library", "libary", "liberry", ["The ___ opens at nine.|opens|nine", "I borrowed this book from the ___.|borrowed|book"]],
  ["maintenance", "maintainance", "maintenence", ["The road needs regular ___.|road|regular", "The ___ crew fixed the lift.|crew|lift"]],
  [
    "millennium",
    "millenium",
    "milennium",
    ["The city was founded a ___ ago.|city|founded", "Fireworks marked the new ___.|Fireworks|marked"],
  ],
  ["mischievous", "mischievious", "mischevous", ["The ___ puppy chewed my shoe.|puppy|shoe", "He gave a ___ grin.|gave|grin"]],
  ["neighbor", "nieghbor", "neigbor", ["Our ___ grows giant pumpkins.|grows|pumpkins", "A kind ___ fed our cat.|kind|cat"]],
  [
    "noticeable",
    "noticable",
    "noticeble",
    ["There was a ___ change in the weather.|change|weather", "The scratch is barely ___.|scratch|barely"],
  ],
  ["occasion", "ocassion", "occassion", ["The wedding was a happy ___.|wedding|happy", "Wear your best suit for the ___.|Wear|suit"]],
  ["parallel", "paralel", "parralel", ["The two roads run ___ to the river.|roads|river", "Draw a ___ line below the first.|Draw|line"]],
  [
    "persistent",
    "persistant",
    "persistint",
    ["The ___ rain flooded the fields.|rain|fields", "A ___ reporter finally got the story.|reporter|story"],
  ],
  [
    "possession",
    "posession",
    "possesion",
    ["The ring is her most precious ___.|ring|precious", "The team kept ___ of the ball.|team|ball"],
  ],
  ["recommend", "reccomend", "recomend", ["I ___ the soup.|soup|I", "Doctors ___ eight hours of sleep.|Doctors|sleep"]],
  ["restaurant", "restaraunt", "resturant", ["The ___ serves fresh fish.|serves|fish", "We met at a small ___ downtown.|met|downtown"]],
  ["schedule", "schedual", "skedule", ["The train ___ changed in May.|train|changed", "Check the ___ before you leave.|Check|leave"]],
  ["supersede", "supercede", "superseed", ["The new rules ___ the old ones.|rules|old", "This law will ___ the last one.|law|last"]],
  [
    "threshold",
    "threshhold",
    "treshold",
    ["She paused at the ___ of the room.|paused|room", "The noise passed the ___ of pain.|noise|pain"],
  ],
  ["tomorrow", "tommorow", "tomorow", ["The test is ___ morning.|test|morning", "We leave for the coast ___.|leave|coast"]],
  ["vacuum", "vaccum", "vacuumm", ["Please ___ the living room.|living|room", "Sound cannot travel through a ___.|Sound|travel"]],
  ["weird", "wierd", "weerd", ["We heard a ___ noise in the attic.|noise|attic", "The play had a ___ ending.|play|ending"]],
] as const;
const spellingLines = join(
  hardWords.flatMap(([word, wrong1, wrong2, sentences]) =>
    sentences.map((line) => {
      const [sentence = ""] = line.split("|");
      return `${sentence}|${word}|${wrong1}|${wrong2}`;
    }),
  ),
);
const misspelledLines = join(
  hardWords.flatMap(([, wrong1, wrong2, sentences]) =>
    sentences.map((line, j) => {
      const [sentence = "", a = "", b = ""] = line.split("|");
      const bad = j === 0 ? wrong1 : wrong2;
      const shown = sentence.startsWith("___") ? sentence.replace("___", upper(bad)) : sentence.replace("___", bad);
      return `${shown}|${sentence.startsWith("___") ? upper(bad) : bad}|${a}|${b}`;
    }),
  ),
);

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

const brackets = topic("grammar", {
  id: "brackets-in-quotations",
  title: ["Brackets in Quotations", "引文中的方括号"],
  summary: [
    "Square brackets mark the words a writer changes or adds inside a quotation, so that it fits the sentence and stays clear; [sic] marks an error in the original.",
    "方括号标出作者在引文中改动或添加的词，使引文与句子相符并保持清楚；[sic] 标出原文中的错误。",
  ],
  after: ["ellipses-in-quotations"],
  points: [
    choose(
      "using-brackets-correctly",
      ["Using Brackets Correctly", "正确使用方括号"],
      [
        "A quotation must give the writer's exact words. When you need to change a word so that the quotation fits your sentence or makes sense on its own, put the change in **square brackets**: *Odysseus says that “[he] longed to see the smoke rise from [his] own land.”* Brackets can replace a pronoun with a name (*[Juliet]* for *she*), change a verb to fit your tense, change a capital letter, or add a missing word.\n\nNever use parentheses for these changes: parentheses would look like part of the original.",
        "引文必须给出作者的原话。为了让引文与你的句子相符，或在单独看时意思清楚而需要改动某个词时，把改动放在**方括号**里：*Odysseus says that “[he] longed to see the smoke rise from [his] own land.”* 方括号可以用名字替换代词（用 *[Juliet]* 替换 *she*），改动动词使之与你的时态一致，改动大小写，或补上缺少的词。\n\n这些改动不能用圆括号：圆括号看起来像是原文的一部分。",
      ],
      ["Which quotation uses brackets correctly?", "哪个引文正确使用了方括号？"],
      `
${bracketLines}
        Original: "She waited by the window every night." Write about Penelope.|The narrator says that "[Penelope] waited by the window every night."|The narrator says that "(Penelope) waited by the window every night."|The narrator says that "Penelope waited by the window every night."
        Original: "I will not go back," he said. Write about the hero in the third person.|The hero insists that "[he] will not go back."|The hero insists that "(he) will not go back."|The hero insists that "he will not go back."
        Original: "It was the worst storm in living memory." Name the storm.|The report calls "[the storm of 1703] the worst storm in living memory."|The report calls "(the storm of 1703) the worst storm in living memory."|The report calls "the storm of 1703 the worst storm in living memory."
        Original: "They burned the bridge behind them." Name who burned it.|The letter states that "[the rebels] burned the bridge behind them."|The letter states that "(the rebels) burned the bridge behind them."|The letter states that "the rebels burned the bridge behind them."
        Original: "Fear is the mind's worst enemy." Fit it into your sentence after "that".|The author argues that "[f]ear is the mind's worst enemy."|The author argues that "(f)ear is the mind's worst enemy."|The author argues that "Fear is the mind's worst enemy (sic)."
        Original: "We march at dawn." Fit it into a sentence in the past tense.|The general wrote that they "[marched] at dawn."|The general wrote that they "(marched) at dawn."|The general wrote that they "marched at dawn."
        Original: "He gave it to her." Make clear who and what.|The witness says that "[the clerk] gave [the letter] to her."|The witness says that "(the clerk) gave (the letter) to her."|The witness says that "the clerk gave the letter to her."
        Original: "The city was never the same." Name the city.|The historian writes that "[Pompeii] was never the same."|The historian writes that "(Pompeii) was never the same."|The historian writes that "the city Pompeii was never the same."
        Original: "Its roots go down a hundred feet." Name the tree.|The guide says that "[the redwood's] roots go down a hundred feet."|The guide says that "(the redwood's) roots go down a hundred feet."|The guide says that "the redwood's roots go down a hundred feet."
        Original: "She never forgave him." Name both people.|The novel tells us that "[Estella] never forgave [Pip]."|The novel tells us that "(Estella) never forgave (Pip)."|The novel tells us that "Estella never forgave Pip."
        Original: "Our ships are faster than theirs." Name both sides.|The admiral boasted that "[British] ships are faster than [French ones]."|The admiral boasted that "(British) ships are faster than (French ones)."|The admiral boasted that "British ships are faster than French ones."
        Original: "Hope is the thing with feathers." Fit it after "that".|Dickinson suggests that "[h]ope is the thing with feathers."|Dickinson suggests that "(h)ope is the thing with feathers."|Dickinson suggests that "Hope is the thing with feathers [sic]."
        Original: "The king they loved is dead." Name the king.|The crowd cried that "[Arthur], the king they loved, is dead."|The crowd cried that "(Arthur), the king they loved, is dead."|The crowd cried that "Arthur, the king they loved, is dead."
        Original: "I am the master of my fate." Write in the third person.|The speaker declares that "[he is] the master of [his] fate."|The speaker declares that "(he is) the master of (his) fate."|The speaker declares that "he is the master of his fate."
        Original: "The plague spread faster than rumor." Name the year.|The diary says "[i]n 1665 the plague spread faster than rumor."|The diary says "(in 1665) the plague spread faster than rumor."|The diary says "in 1665 the plague spread faster than rumor."
        Original: "It changed everything." Name what changed everything.|She claims that "[the printing press] changed everything."|She claims that "(the printing press) changed everything."|She claims that "the printing press changed everything."
        Original: "They refuse to pay the tax." Fit it into a sentence in the past.|The colonists announced that they "[refused] to pay the tax."|The colonists announced that they "(refused) to pay the tax."|The colonists announced that they "refused to pay the tax."
        Original: "He was born in the village and died there." Name the village.|The plaque says that "he was born in [Stratford] and died there."|The plaque says that "he was born in (Stratford) and died there."|The plaque says that "he was born in Stratford and died there."
        Original: "Her courage shamed them all." Name her.|The chronicler writes that "[Joan's] courage shamed them all."|The chronicler writes that "(Joan's) courage shamed them all."|The chronicler writes that "Joan's courage shamed them all."
        Original: "We have nothing to fear." Fit it into a sentence about "the nation".|The president told the nation that "[it had] nothing to fear."|The president told the nation that "(it had) nothing to fear."|The president told the nation that "it had nothing to fear."
        Original: "This is the end of the old world." Name the event.|The poet saw the war as "the end of the old world."|The poet saw the war as "(the war) the end of the old world."|The poet saw the war as "the end of [sic] the old world."
        Original: "They found nothing in the tomb." Name who searched it.|The report states that "[the robbers] found nothing in the tomb."|The report states that "(the robbers) found nothing in the tomb."|The report states that "the robbers found nothing in the tomb."
        Original: "The water rose to the second floor." Name the town.|A survivor recalled that "[in Johnstown] the water rose to the second floor."|A survivor recalled that "(in Johnstown) the water rose to the second floor."|A survivor recalled that "in Johnstown the water rose to the second floor."
        Original: "She plays it every night." Name the instrument.|Her neighbor says that "she plays [the cello] every night."|Her neighbor says that "she plays (the cello) every night."|Her neighbor says that "she plays the cello every night."
        Original: "Their armor shone like the sun." Name the soldiers.|The poem says that "[the Greeks'] armor shone like the sun."|The poem says that "(the Greeks') armor shone like the sun."|The poem says that "the Greeks' armor shone like the sun."
        Original: "The experiment failed twice." Name the scientist's experiment.|Her notes say that "[the cloud chamber] experiment failed twice."|Her notes say that "(the cloud chamber) experiment failed twice."|Her notes say that "the cloud chamber experiment failed twice."
        Original: "I shall return." Write in the third person, past tense.|The general promised that "[he would] return."|The general promised that "(he would) return."|The general promised that "he would return."
        Original: "Nobody believed him." Name him.|The article reports that "[n]obody believed [Galileo]."|The article reports that "(n)obody believed (Galileo)."|The article reports that "nobody believed Galileo."
        Original: "It was a cold and bitter night." Name the night.|The memoir describes "[Christmas Eve, 1914 as] a cold and bitter night."|The memoir describes "(Christmas Eve, 1914 as) a cold and bitter night."|The memoir describes "Christmas Eve, 1914 as a cold and bitter night."
        Original: "Its walls were never breached." Name the fortress.|The guidebook boasts that "[the castle's] walls were never breached."|The guidebook boasts that "(the castle's) walls were never breached."|The guidebook boasts that "the castle's walls were never breached."
      `,
      (right) => [
        `${right} The changed or added words sit in square brackets, so the reader can see exactly which words are not the original's.`,
        `${right} 改动或添加的词放在方括号里，读者能看清哪些词不是原文的。`,
      ],
      [
        [
          "*{wrong}* puts the change in parentheses, which a reader would take as part of the original words.",
          "*{wrong}* 把改动放在圆括号里，读者会以为那是原文的一部分。",
        ],
        [
          "*{wrong}* changes or adds words inside the quotation marks without marking them, so it misquotes the original, or it marks something that is not an error.",
          "*{wrong}* 在引号里改动或添加了词却没有标明，这就歪曲了原文，或者把不是错误的地方标成了错误。",
        ],
      ],
    ),
    label(
      "why-the-brackets-are-there",
      ["Why the Brackets Are There", "方括号的用途"],
      [
        "Brackets in a quotation do one of four jobs. They **replace a pronoun** with the name it stands for, so the reader knows who is meant: *“[Juliet] drinks the potion.”* They **fit the grammar** of your sentence, changing a verb's tense or a capital letter: *She said they “[were] ready.”* They **add a missing word** that the quotation needs to make sense alone. And **[sic]**, Latin for *thus*, tells the reader that an error was in the original and is not yours: *“The ship sank in 1812 [sic].”*",
        "引文中的方括号有四种用途。**替换代词**，换成它所指的名字，让读者知道指的是谁：*“[Juliet] drinks the potion.”* **配合语法**，使引文符合你的句子，改动动词时态或大小写：*She said they “[were] ready.”* **补充缺少的词**，让引文单独看时意思完整。**[sic]**（拉丁文“原文如此”）告诉读者错误出自原文，不是你的：*“The ship sank in 1812 [sic].”*",
      ],
      ["What job do the brackets do in this quotation?", "这个引文中的方括号起什么作用？"],
      `
${whyBracketLines}
        "[Juliet] drinks the potion without a word."|replaces a pronoun
        She wrote that they "[were] ready to leave."|fits the grammar
        The sign said, "Visitors must [not] feed the bears."|adds a missing word
        The letter claims that "the war ended in 1815 [sic]" (it ended in 1814).|marks an error in the original
        "[Odysseus] wept when he heard the song."|replaces a pronoun
        The critic argues that "[t]he novel is a warning."|fits the grammar
        The note read, "Meet me at [the] old mill."|adds a missing word
        The diary spells it "Febuary [sic]."|marks an error in the original
        "[The captain] gave the order to abandon ship."|replaces a pronoun
        He promised that he "[would] return by spring."|fits the grammar
        The ad promised "the best [coffee] in town."|adds a missing word
        The poster announced "a concert for there [sic] fans."|marks an error in the original
        "[Lady Macbeth] cannot wash the blood away."|replaces a pronoun
        The witness said she "[saw] a man run past."|fits the grammar
        The recipe says to "bake [it] for an hour."|adds a missing word
        The old map shows "Pacifick [sic] Ocean."|marks an error in the original
        "[The villagers] would not open the gate."|replaces a pronoun
        The coach insisted that "[e]very player counts."|fits the grammar
        The telegram read: "Arrive Tuesday [with] children."|adds a missing word
        The student wrote that Shakespeare "was born in 1654 [sic]."|marks an error in the original
        "[Achilles] dragged the body around the walls."|replaces a pronoun
        The report found that prices "[had] doubled."|fits the grammar
        The message said, "Keys under [the] mat."|adds a missing word
        The menu offered "fresh brocoli [sic]."|marks an error in the original
        "[Her grandmother's] hands were never still."|replaces a pronoun
        The scientist noted that the water "[was] boiling."|fits the grammar
        The poet's note reads, "Revise [the] last line."|adds a missing word
        The letter was addressed to "Mr. Smyth [sic]," though his name was Smith.|marks an error in the original
        "[The monster] stood at the foot of the bed."|replaces a pronoun
        The mayor said the town "[would] rebuild."|fits the grammar
      `,
      {
        "replaces a pronoun": L(
          "替换代词",
          "The bracketed name stands where the original had a pronoun such as *he*, *she* or *they*, so the reader knows who is meant.",
          "方括号里的名字放在原文代词（如 *he*、*she*、*they*）的位置上，让读者知道指的是谁。",
          "The brackets do not stand in for a pronoun here.",
          "这里的方括号并不是替换代词。",
        ),
        "fits the grammar": L(
          "配合语法",
          "The brackets change a verb's tense or a capital letter so that the quotation fits the writer's own sentence.",
          "方括号改动了动词时态或大小写，使引文与作者自己的句子相符。",
          "The brackets do not change a verb or a capital letter to fit the sentence.",
          "这里的方括号并没有为了配合句子而改动动词或大小写。",
        ),
        "adds a missing word": L(
          "补充缺少的词",
          "The bracketed word was not in the original; it is added so that the quotation makes sense on its own.",
          "方括号里的词原文没有，是为了让引文单独看时意思完整而添加的。",
          "The brackets do not add a word that the original left out.",
          "这里的方括号并没有补充原文省略的词。",
        ),
        "marks an error in the original": L(
          "标出原文错误",
          "[sic] tells the reader that the mistake was in the original and has been copied faithfully.",
          "[sic] 告诉读者错误出自原文，引用者如实照录。",
          "There is no [sic] here, so the brackets do not mark an error in the original.",
          "这里没有 [sic]，所以方括号并不是标出原文的错误。",
        ),
      },
    ),
  ],
});

const literaryPresent = topic("grammar", {
  id: "the-literary-present",
  title: ["The Literary Present", "文学现在时"],
  summary: [
    "Writing about what happens in a story, poem or play, and about what an author does in a text, in the present tense, while events of history and of authors' lives stay in the past.",
    "用现在时写故事、诗歌或戏剧中发生的事，以及作者在文本中所做的事；而历史事件和作者的生平仍用过去时。",
  ],
  after: ["when-to-shift-tense"],
  points: [
    choose(
      "the-tense-for-a-text",
      ["The Tense for a Text", "写文本时用的时态"],
      [
        "A story happens again every time someone reads it, so when you write about literature you use the **present tense**: *Romeo **meets** Juliet at a feast. Shakespeare **shows** how quickly love grows.* This is the **literary present**. It holds for what characters do, what a text says and what an author does in it (*Orwell **warns**, the poem **ends***).\n\nEvents of history and of an author's life stay in the **past**: *Shakespeare **wrote** the play around 1595.*",
        "每当有人读故事时，故事就又发生一次，所以写文学评论时用**现在时**：*Romeo **meets** Juliet at a feast. Shakespeare **shows** how quickly love grows.* 这就是**文学现在时**。人物做的事、文本说的话以及作者在文本中所做的事都用它（*Orwell **warns**、the poem **ends***）。\n\n历史事件和作者的生平仍用**过去时**：*Shakespeare **wrote** the play around 1595.*",
      ],
      ["Which verb fits the sentence of a literary essay?", "哪个动词适合文学评论中的这个句子？"],
      `
${tenseLines}
        In the first scene, Romeo ___ Juliet at a feast.|meets|met|had met
        Shakespeare ___ the play around 1595.|wrote|writes|is writing
        At the end of the novel, Pip ___ that Estella has changed.|realizes|realized|had realized
        In the poem, the speaker ___ the sea to a sleeping giant.|compares|compared|was comparing
        Orwell ___ the novel while he was ill on a Scottish island.|wrote|writes|has been writing
        Throughout the story, the narrator ___ the reader to trust him.|asks|asked|had asked
        When Odysseus reaches home, he ___ himself as a beggar.|disguises|disguised|had disguised
        Homer's epic ___ in the middle of the war.|begins|began|had begun
        The poet ___ in 1886, and most of her poems were found after her death.|died|dies|is dying
        In chapter three, Scout ___ her teacher on the first day of school.|angers|angered|was angering
        The author ___ the ending to show that the family will survive.|uses|used|had used
        Macbeth ___ the king while he sleeps.|murders|murdered|had murdered
        In the last stanza, the tone ___ from grief to hope.|shifts|shifted|was shifting
        Mary Shelley ___ Frankenstein when she was eighteen.|began|begins|is beginning
        The monster ___ to read by watching a family through a crack in the wall.|learns|learned|had learned
        In the play, the nurse ___ Juliet's secret messages to Romeo.|carries|carried|was carrying
        The novel ___ the reader feel the heat of the long summer.|makes|made|has made
        Dickens ___ in a factory as a boy, which shaped his novels.|worked|works|is working
        In the story, the old man ___ the fish for three days.|fights|fought|had fought
        By the end of the chapter, Jane ___ to leave Thornfield.|decides|decided|was deciding
        The speaker of the poem ___ the reader to "seize the day."|urges|urged|had urged
        The first readers of the book ___ shocked by its ending.|were|are|have been
        In this passage, Steinbeck ___ the dust storm in vivid detail.|describes|described|was describing
        Before the duel, Mercutio ___ jokes about his own death.|makes|made|had made
        The essay ___ that freedom of speech protects everyone.|argues|argued|was arguing
        The writer ___ the essay in 1963 from a prison cell.|wrote|writes|is writing
        The tale ___ with the wedding of the prince and the shepherd girl.|ends|ended|had ended
        When the storm hits, the children ___ shelter in the barn.|find|found|had found
        In the second act, the king ___ his eldest daughter.|banishes|banished|was banishing
        Keats ___ the poem a year before he died.|wrote|writes|is writing
      `,
      (right) => [
        `**${right}** fits: what happens in a text and what an author does in it take the present tense, while history and the author's life take the past.`,
        `**${right}** 合适：文本中发生的事和作者在文本中所做的事用现在时，而历史和作者的生平用过去时。`,
      ],
      [
        [
          "*{wrong}* uses the wrong tense: decide whether the sentence is about what happens in the text (present) or about history and the author's life (past).",
          "*{wrong}* 用错了时态：判断句子说的是文本中发生的事（现在时），还是历史和作者的生平（过去时）。",
        ],
        [
          "*{wrong}* shifts into a form, such as the past perfect or a continuous tense, that the sentence gives no reason for.",
          "*{wrong}* 换成了过去完成时或进行时这样的形式，而句子并没有用它的理由。",
        ],
      ],
    ),
    label(
      "text-or-history",
      ["Text or History?", "文本还是历史？"],
      [
        "Before choosing a tense, decide what the sentence is about. If it is about **what happens in a text** (characters, events of the plot, what a passage says or does), use the present. If it is about **the author's life or the real past** (when a book was written, how it was received, what happened in history), use the past. One paragraph can do both: *Achebe **wrote** the novel in 1958. In it, Okonkwo **fears** being thought weak.*",
        "选择时态之前，先判断句子说的是什么。如果说的是**文本中发生的事**（人物、情节、某段文字说了什么或起什么作用），用现在时。如果说的是**作者的生平或真实的过去**（书何时写成、如何被接受、历史上发生了什么），用过去时。一个段落可以两者兼有：*Achebe **wrote** the novel in 1958. In it, Okonkwo **fears** being thought weak.*",
      ],
      [
        "Is the sentence about the text or about history, and so which tense does it need?",
        "这个句子说的是文本还是历史？因此需要哪种时态？",
      ],
      `
${textOrHistory}
        Okonkwo ___ being thought weak like his father. (fear)|the text: present tense
        Achebe ___ the novel in 1958. (write)|history: past tense
        The novel ___ millions of copies in its first decade. (sell)|history: past tense
        In the opening chapter, the village ___ a wrestling match. (hold)|the text: present tense
        Critics ___ the play when it opened in London. (attack)|history: past tense
        Hamlet ___ his father's ghost on the castle walls. (see)|the text: present tense
        The poet ___ her first poems at the age of twelve. (publish)|history: past tense
        The narrator ___ the house as cold and dark. (describe)|the text: present tense
        The book ___ banned in several countries for years. (be)|history: past tense
        Elizabeth ___ Darcy's first proposal. (refuse)|the text: present tense
        Austen ___ the novel under the title First Impressions. (draft)|history: past tense
        The last line of the poem ___ the reader with a question. (leave)|the text: present tense
        The real ship ___ in 1912 with more than two thousand people on board. (sink)|history: past tense
        In the story, the ship ___ during a storm on the first night. (sink)|the text: present tense
        Twain ___ as a riverboat pilot before he became a writer. (work)|history: past tense
        Huck ___ down the river on a raft with Jim. (float)|the text: present tense
        The author's family ___ the manuscript after her death. (find)|history: past tense
        The diary ___ with Anne's thirteenth birthday. (open)|the text: present tense
        Anne Frank ___ in a hidden room for two years. (live)|history: past tense
        The chorus ___ the audience how the play will end. (tell)|the text: present tense
        The play ___ first performed at the Globe Theatre. (be)|history: past tense
        The hero ___ the dragon's treasure but loses his life. (win)|the text: present tense
        Monks ___ the poem down in the eleventh century. (write)|history: past tense
        The speaker ___ that death cannot be proud. (insist)|the text: present tense
        Orwell ___ in Spain during its civil war. (fight)|history: past tense
        The animals ___ the farmer and take over the farm. (drive out)|the text: present tense
        The first edition ___ only five hundred copies. (have)|history: past tense
        In this scene, Juliet ___ to drink the potion. (decide)|the text: present tense
        Readers in 1818 ___ the author was a man. (assume)|history: past tense
        The essay ___ with a story about a broken watch. (begin)|the text: present tense
      `,
      {
        "the text: present tense": L(
          "文本：现在时",
          "The sentence is about what happens in the text, so it takes the literary present.",
          "这个句子说的是文本中发生的事，所以用文学现在时。",
          "The sentence is not about what happens in the text, so the literary present does not fit.",
          "这个句子说的不是文本中发生的事，所以不适合用文学现在时。",
        ),
        "history: past tense": L(
          "历史：过去时",
          "The sentence is about the author's life or the real past, so it takes the past tense.",
          "这个句子说的是作者的生平或真实的过去，所以用过去时。",
          "The sentence is not about the author's life or the real past, so the past tense does not fit.",
          "这个句子说的不是作者的生平或真实的过去，所以不适合用过去时。",
        ),
        "an author's habit: present perfect": L(
          "作者的习惯：现在完成时",
          "The sentence is about something an author has done again and again up to now.",
          "这个句子说的是作者到现在为止一再做的事。",
          "The sentence is not about something an author has done over and over up to now; it is about one text or one past event.",
          "这个句子说的不是作者到现在为止一再做的事，而是关于一个文本或一件过去的事。",
        ),
      },
    ),
  ],
});

const myths = topic("grammar", {
  id: "usage-rules-and-myths",
  title: ["Usage Rules and Myths", "用法规则与误区"],
  summary: [
    "Telling the real rules of standard English from myths such as never splitting an infinitive, and from choices of style that depend on the task.",
    "区分标准英语的真正规则、诸如“绝不能分裂不定式”之类的误区，以及取决于写作任务的风格选择。",
  ],
  after: ["formal-and-informal-english", "subject-verb-agreement"],
  points: [
    label(
      "rule-myth-or-choice",
      ["Rule, Myth or Choice of Style", "规则、误区还是风格选择"],
      [
        "Some advice about English is a **real rule**: break it and the sentence is wrong in standard English (*a verb agrees with its subject*). Some is a **myth**: careful writers have always broken it, and dictionaries and style guides allow it (*never split an infinitive*, *never end a sentence with a preposition*, *never begin a sentence with* and). And some is a **choice of style** that depends on the task and the reader (*avoid* I *in a formal essay*, *avoid contractions in a report*).",
        "关于英语的建议，有些是**真正的规则**：违反了，句子在标准英语中就是错的（*动词与主语一致*）。有些是**误区**：优秀的作家一向不遵守，词典和文体指南也允许（*绝不能分裂不定式*、*句子绝不能以介词结尾*、*句子绝不能以 and 开头*）。还有些是**风格选择**，取决于写作任务和读者（*正式论文中避免用 I*、*报告中避免用缩约形式*）。",
      ],
      ["Is this piece of advice a real rule, a myth or a choice of style?", "这条建议是真正的规则、误区还是风格选择？"],
      `
${ruleLines}
        A verb must agree with its subject in number.|real rule
        Never split an infinitive, as in "to boldly go."|myth
        Avoid using "I" in a formal research essay.|choice of style
        Never end a sentence with a preposition.|myth
        Do not join two independent clauses with only a comma.|real rule
        Never begin a sentence with "and" or "but."|myth
        Avoid contractions such as "don't" in a formal report.|choice of style
        A pronoun must agree with the noun it refers to.|real rule
        Never begin a sentence with "because."|myth
        Use the active voice more often than the passive in a story.|choice of style
        Put a period at the end of a statement.|real rule
        "None" must always take a singular verb.|myth
        Keep paragraphs short in a newspaper article.|choice of style
        Use "whom" when the pronoun is an object, in formal writing.|real rule
        Never use "they" to refer to one person.|myth
        Use a semicolon, not a comma, between two independent clauses without a conjunction.|real rule
        Never use the passive voice.|myth
        Use a dash rather than parentheses to make an aside stand out.|choice of style
        A sentence needs a subject and a verb to be complete, except in special cases such as commands.|real rule
        "Hopefully" can never mean "it is hoped."|myth
        Avoid slang in a letter to a judge.|choice of style
        Do not shift tenses without a reason.|real rule
        Never use "who" for animals.|myth
        Spell out numbers under ten in a magazine article.|choice of style
        Use "fewer" with things you can count, in formal writing.|real rule
        Never start a sentence with a conjunction such as "so."|myth
        Write "the author argues" rather than "I think" in an analytical essay.|choice of style
        Place a modifier next to the word it describes.|real rule
        Never use "like" to compare.|myth
        Use first names for the people in a feature story, but last names in a news report.|choice of style
      `,
      {
        "real rule": L(
          "真正的规则",
          "Breaking this advice makes a sentence incorrect in standard English, so careful writers follow it.",
          "违反这条建议会使句子在标准英语中出错，所以认真的作者都会遵守。",
          "Careful writers break this advice without error, or it depends on the task, so it is not a real rule.",
          "优秀的作者违反这条建议也不算错，或者它取决于写作任务，所以不是真正的规则。",
        ),
        myth: L(
          "误区",
          "Good writers have long broken this advice, and dictionaries and style guides accept the result, so it is a myth.",
          "优秀的作家一向不遵守这条建议，词典和文体指南也接受这样的用法，所以它是误区。",
          "This advice is not a myth: either breaking it makes a real error, or it is a sensible choice for some tasks.",
          "这条建议不是误区：要么违反它会造成真正的错误，要么它是某些任务中合理的选择。",
        ),
        "choice of style": L(
          "风格选择",
          "This advice depends on the task and the reader: it is sensible for some kinds of writing and not needed in others.",
          "这条建议取决于写作任务和读者：在某些文体中合理，在另一些文体中则不必。",
          "This advice does not depend on the task: it is either always right or not a rule at all.",
          "这条建议并不取决于写作任务：它要么总是对的，要么根本不是规则。",
        ),
      },
    ),
    label(
      "acceptable-or-an-error",
      ["Acceptable or an Error?", "可以接受还是错误？"],
      [
        "Judge a sentence by the real rules, not the myths. *She decided to quickly leave* splits an infinitive, but it is **acceptable**. *Who did you go with?* ends with a preposition and is **acceptable**. *Each of the boys have a ticket* breaks the rule of agreement and is an **error**. A sentence can also be correct but **too informal** for formal writing: *The results were kind of awesome.*",
        "用真正的规则而不是误区来判断句子。*She decided to quickly leave* 分裂了不定式，但**可以接受**。*Who did you go with?* 以介词结尾，也**可以接受**。*Each of the boys have a ticket* 违反了主谓一致规则，是**错误**。一个句子也可能是对的，但对正式写作来说**太随意**：*The results were kind of awesome.*",
      ],
      [
        "In a formal essay, is this sentence acceptable, an error, or too informal?",
        "在正式论文中，这个句子可以接受、有错误，还是太随意？",
      ],
      `
${acceptableLines}
        She decided to quickly leave the room.|acceptable
        Each of the boys have a ticket.|an error
        The results were kind of awesome.|too informal
        This is the house I was born in.|acceptable
        Me and my brother visited the museum.|an error
        The experiment was a total bust.|too informal
        And so the war began.|acceptable
        The team are playing their best this season, but the coach have doubts.|an error
        The author's argument is pretty sketchy.|too informal
        They hoped to finally reach the summit.|acceptable
        Running down the street, the bus left without me.|an error
        The poem is super sad.|too informal
        But the king would not listen.|acceptable
        Neither of the plans were accepted.|an error
        The scientists were totally blown away by the data.|too informal
        What are you afraid of?|acceptable
        The book that I read it was long.|an error
        The main character is a real jerk.|too informal
        Because the bridge was closed, we took the ferry.|acceptable
        The storm destroyed the town, many people lost their homes.|an error
        Gonna be honest, the ending did not work.|too informal
        Somebody left their umbrella on the bus.|acceptable
        Between you and I, the plan will fail.|an error
        The essay makes a bunch of good points.|too informal
        The committee voted to gradually reduce the fee.|acceptable
        The data shows that less people are reading newspapers.|an error
        The villain is creepy and stuff.|too informal
        That is something we must think about.|acceptable
        She don't agree with the author.|an error
        The novel's ending is a huge letdown, no cap.|too informal
      `,
      {
        acceptable: L(
          "可以接受",
          "The sentence breaks only a myth, such as splitting an infinitive or ending with a preposition, or none at all, so it is acceptable in formal writing.",
          "这个句子只违反了某个误区（如分裂不定式或以介词结尾），或者什么都没违反，所以在正式写作中可以接受。",
          "The sentence breaks a real rule or is too informal, so it is not acceptable as it stands.",
          "这个句子违反了真正的规则或太随意，所以照原样是不能接受的。",
        ),
        "an error": L(
          "错误",
          "The sentence breaks a real rule of standard English, such as agreement, pronoun case or the joining of clauses.",
          "这个句子违反了标准英语的真正规则，如主谓一致、代词的格或分句的连接。",
          "The sentence breaks no real rule of standard English.",
          "这个句子没有违反标准英语的真正规则。",
        ),
        "too informal": L(
          "太随意",
          "The grammar is fine, but slang or casual words such as *kind of*, *super* or *a bunch of* do not suit a formal essay.",
          "语法没有问题，但 *kind of*、*super*、*a bunch of* 这样的俚语或随意的词不适合正式论文。",
          "The sentence uses no slang or casual words that would be out of place in a formal essay.",
          "这个句子没有用在正式论文中不合适的俚语或随意的词。",
        ),
      },
    ),
  ],
});

const confused5 = topic("grammar", {
  id: "commonly-confused-words-5",
  title: ["Commonly Confused Words 5", "易混淆词 5"],
  summary: [
    "Pairs such as allude and elude, credible and credulous, or disinterested and uninterested look or sound alike but mean different things.",
    "allude 和 elude、credible 和 credulous、disinterested 和 uninterested 这样的词形或读音相近，意思却不同。",
  ],
  after: ["commonly-confused-words-4"],
  points: [
    choose(
      "the-word-that-fits",
      ["The Word That Fits", "合适的词"],
      [
        "Ten more pairs that careful writers keep apart. To **allude** is to mention indirectly; to **elude** is to escape. To **appraise** is to judge the value of; to **apprise** is to inform. To **cite** is to quote; a **site** is a place; **sight** is seeing. **Credible** means believable; **credulous** means too ready to believe. **Disinterested** means fair, with nothing to gain; **uninterested** means bored. **Historic** means important in history; **historical** means having to do with the past. **Ingenious** means clever; **ingenuous** means innocent and trusting. **Loath** (adjective) means unwilling; to **loathe** (verb) is to hate. **Perspective** is a point of view; **prospective** means likely to be. **Respectfully** means with respect; **respectively** means in the order given.",
        "又有十对需要认真区分的词。**allude** 是暗指，**elude** 是逃避。**appraise** 是估价，**apprise** 是通知。**cite** 是引用，**site** 是地点，**sight** 是视力或景象。**credible** 意为可信的，**credulous** 意为轻信的。**disinterested** 意为公正无私的，**uninterested** 意为不感兴趣的。**historic** 意为有历史意义的，**historical** 意为与过去有关的。**ingenious** 意为巧妙的，**ingenuous** 意为天真坦率的。**loath**（形容词）意为不情愿的，**loathe**（动词）意为憎恨。**perspective** 是观点，**prospective** 意为可能的、未来的。**respectfully** 意为恭敬地，**respectively** 意为分别地（按所列顺序）。",
      ],
      ["Which word fits the sentence?", "哪个词适合这个句子？"],
      `
${fitWordLines}\n${fitWordMore}
        The poem seems to ___ to an old myth without naming it.|allude|elude|elicit
        The thief managed to ___ the police for weeks.|elude|allude|illude
        In his speech, he ___ to his rival's failures but never named her.|alluded|eluded|deluded
        An expert came to ___ the old painting.|appraise|apprise|apprize
        Please ___ me of any changes to the schedule.|apprise|appraise|appease
        The jeweler ___ the ring at a thousand dollars.|appraised|apprised|approved
        Be sure to ___ your sources at the end of the essay.|cite|site|sight
        The castle was built on the ___ of a Roman fort.|site|cite|sight
        After the operation, her ___ slowly returned.|sight|site|cite
        The witness gave a ___ account of the crash.|credible|credulous|creditable
        The ___ villagers believed every word of the traveling salesman.|credulous|credible|incredible
        Her story was not ___; no one believed it.|credible|credulous|credulity
        A judge must be ___ and have nothing to gain from the case.|disinterested|uninterested|disinterest
        The bored students seemed ___ in the lecture.|uninterested|disinterested|uninteresting
        We need a ___ referee who does not favor either team.|disinterested|uninterested|interested
        The signing of the treaty was a ___ moment for both nations.|historic|historical|history
        The library keeps ___ records going back three hundred years.|historical|historic|histrionic
        She writes ___ novels set in ancient Rome.|historical|historic|historian
        The inventor came up with an ___ way to store rainwater.|ingenious|ingenuous|ingenue
        The ___ child believed that everyone told the truth.|ingenuous|ingenious|ingenuity
        Her ___ plan fooled even the guards.|ingenious|ingenuous|genial
        He was ___ to leave his old friends behind.|loath|loathe|loth
        Cats seem to ___ getting wet.|loathe|loath|lathe
        I ___ the sound of chalk on a blackboard.|loathe|loath|loaf
        Living abroad gave her a new ___ on her own country.|perspective|prospective|perspicacity
        The ___ buyers looked around the house.|prospective|perspective|prosperous
        From the ___ of a child, the room looked enormous.|perspective|prospective|perception
        Ana and Leo finished first and second, ___.|respectively|respectfully|respectably
        The students stood ___ when the principal entered.|respectfully|respectively|respectably
        The red and blue lines show sales in May and June, ___.|respectively|respectfully|respective
      `,
      (right) => [`**${right}** is the word with the meaning this sentence needs.`, `**${right}** 才是这个句子需要的意思。`],
      [
        [
          "*{wrong}* looks or sounds like **{right}**, but it means something else, and that meaning does not fit here.",
          "*{wrong}* 看起来或听起来像 **{right}**，但意思不同，那个意思在这里不合适。",
        ],
        [
          "*{wrong}* is a different word, or a different form, that does not give the meaning the sentence needs.",
          "*{wrong}* 是另一个词或另一种词形，不能表达句子需要的意思。",
        ],
      ],
    ),
    choose(
      "the-word-for-the-meaning",
      ["The Word for the Meaning", "符合释义的词"],
      [
        "Learn each pair by a clue. *Allude* and *mention* both have to do with speech; *elude* and *escape* both begin with *e*. *Apprise* has the *s* of *say*. A *credulous* person is full of belief; a *credible* story is able to be believed. A *disinterested* judge has no *interest* (stake) in the result. *Respectively* keeps things in their *respective* places.",
        "用线索记住每一对词。*allude* 与 *mention* 都和说话有关；*elude* 与 *escape* 都以 *e* 开头。*apprise* 里有 *say*（告诉）的意思。*credulous* 的人充满了相信；*credible* 的故事能够被相信。*disinterested* 的法官与结果没有 *interest*（利害关系）。*respectively* 让事物各归其位。",
      ],
      ["Which word has this meaning?", "哪个词有这个意思？"],
      `
${meaningLines}
        to mention something indirectly|allude|elude|illude
        to escape or avoid, often by cleverness|elude|allude|delude
        to judge the value or quality of something|appraise|apprise|praise
        to tell or inform someone|apprise|appraise|apprize
        to quote or mention as evidence|cite|site|sight
        a place where something is, was or will be|site|cite|sight
        the ability to see|sight|site|cite
        able to be believed|credible|credulous|creditable
        too ready to believe things|credulous|credible|credited
        fair, with nothing to gain from the result|disinterested|uninterested|interested
        not interested; bored|uninterested|disinterested|uninteresting
        important or famous in history|historic|historical|histrionic
        having to do with history or the past|historical|historic|historian
        clever and inventive|ingenious|ingenuous|genuine
        innocent, open and trusting|ingenuous|ingenious|ingenuity
        unwilling or reluctant|loath|loathe|lath
        to hate very much|loathe|loath|clothe
        a particular way of looking at something|perspective|prospective|prospect
        likely to become or to happen|prospective|perspective|perspicuous
        in the order already mentioned|respectively|respectfully|respectably
        in a way that shows respect|respectfully|respectively|respectably
        a person who is too easily fooled is this|credulous|credible|crude
        a witness whose story can be trusted is this|credible|credulous|credulity
        a referee who favors neither side is this|disinterested|uninterested|disinteresting
        the place chosen for a new school|site|cite|sight
        to name a book you used as a source|cite|site|sight
        to warn someone of a danger, formally|apprise|appraise|approve
        to set a price on a house for a sale|appraise|apprise|appease
        a building that played a famous part in history is this|historic|historical|histrionic
        a novel set in the past is this kind of fiction|historical|historic|history
      `,
      (right) => [
        `**${right}** has this meaning; the other choices are look-alike words whose meanings differ.`,
        `**${right}** 有这个意思；其他选项是形似的词，意思不同。`,
      ],
      [
        [
          "*{wrong}* looks or sounds like **{right}**, but it has a different meaning.",
          "*{wrong}* 看起来或听起来像 **{right}**，但意思不同。",
        ],
        ["*{wrong}* is another word or form; it does not have this meaning.", "*{wrong}* 是另一个词或词形，没有这个意思。"],
      ],
    ),
  ],
});

const spelling = topic("grammar", {
  id: "spelling-commonly-misspelled-words",
  title: ["Commonly Misspelled Words", "常拼错的词"],
  summary: [
    "Thirty words that even good writers misspell, such as accommodate, conscientious, definitely and rhythm, with ways to remember them.",
    "连好的作者也常拼错的三十个词，如 accommodate、conscientious、definitely 和 rhythm，以及记住它们的方法。",
  ],
  after: ["spelling-words-with-suffixes", "spelling-words-with-prefixes"],
  points: [
    choose(
      "the-correct-spelling",
      ["The Correct Spelling", "正确的拼写"],
      [
        "Some words trip up even strong writers because their spelling hides a doubled letter, a silent letter or a vowel that is not pronounced clearly. Memory tricks help. *Accommodate* has room for two *c*'s and two *m*'s. *Definitely* has *finite* in it. *Separate* has *a rat* in it. *Rhythm* has two *h*'s and no vowels but *y*. *Conscience* is *con* + *science*. *Necessary* has one *collar* (c) and two *sleeves* (s).",
        "有些词连写作好的人也会拼错，因为它们的拼写里藏着双写字母、不发音的字母或读得不清楚的元音。记忆窍门会有帮助。*accommodate* 有地方容纳两个 *c* 和两个 *m*。*definitely* 里有 *finite*。*separate* 里有 *a rat*。*rhythm* 有两个 *h*，除了 *y* 没有别的元音。*conscience* 是 *con* + *science*。*necessary* 有一个“领子”（c）和两只“袖子”（s）。",
      ],
      ["Which spelling is correct?", "哪个拼写是正确的？"],
      `
${spellingLines}
        The hotel can ___ forty guests.|accommodate|accomodate|acommodate
        I will ___ be there on time.|definitely|definately|definitly
        Keep the eggs ___ from the flour.|separate|seperate|separete
        The drummer kept a steady ___.|rhythm|rythm|rhythym
        A guilty ___ kept him awake.|conscience|concience|conscence
        Water is ___ for life.|necessary|neccessary|necesary
        She was ___ to the noise.|embarrassed|embarassed|embarrased
        The two events happened at the same ___.|occurrence|occurence|ocurrence
        They plan to ___ in the spring.|marry|mary|marrie
        It was a ___ that we met again.|coincidence|coincedence|coinsidence
        She is a ___ student who checks every answer.|conscientious|consciencious|conscientous
        The ___ of the city was 50,000.|population|popullation|populasion
        Please ___ the package when it arrives.|receive|recieve|receeve
        The ___ of the two rivers is a famous spot.|confluence|confluance|confluense
        He made a ___ effort to stay calm.|conscious|concious|consious
        The ___ of the novel lives in Paris.|protagonist|protaganist|protagnist
        The ___ ceremony was held in the town hall.|ceremonial|ceremonail|ceremonal
        Her ___ in the race surprised everyone.|occurred|occured|ocurred
        The ___ of the storm was terrible.|aftermath|afthermath|aftermatch
        Her ___ is sold in every bookshop.|memoir|memior|memoire
        He looked at me with ___ eyes.|unforgettable|unforgetable|unforgettible
        They will ___ their new neighbors to dinner.|invite|envite|invight
        The ___ of the evidence decided the case.|weight|wieght|weigth
        A ___ came over the hill at dawn.|sergeant|sargeant|sergent
        The ___ in the cellar was full of old wine.|cellar|celler|sellar
        The play was a great ___.|success|sucess|succes
        Her ___ is to become a doctor.|privilege|priviledge|privelege
        The ___ arrived with a letter from the king.|messenger|messanger|messinger
        The ___ of the experiment were surprising.|results|resaults|resultes
        They waited in the ___ for the doctor.|corridor|corridore|coridor
      `,
      (right) => [
        `**${right}** is the correct spelling; the other choices drop, double or swap a letter.`,
        `**${right}** 是正确的拼写；其他选项漏写、多写或调换了字母。`,
      ],
      [
        [
          "*{wrong}* drops or misplaces a letter that the word needs, a common slip with this word.",
          "*{wrong}* 漏写或错放了这个词需要的字母，这是拼这个词时常见的错误。",
        ],
        [
          "*{wrong}* writes a sound with the wrong letters; the correct spelling is **{right}**.",
          "*{wrong}* 用错了表示某个音的字母；正确的拼写是 **{right}**。",
        ],
      ],
    ),
    choose(
      "find-the-misspelled-word",
      ["Find the Misspelled Word", "找出拼错的词"],
      [
        "When you proofread, slow down on the words you know are tricky. Read each word as letters, not as a sound. Look for doubled letters (*accommodate*, *embarrass*, *occurred*), letters that are not pronounced (*government*, *February*, *Wednesday*), and vowels that sound alike (*separate*, *definite*, *independent*). Spell-checkers miss words that are real but wrong, so look closely at every one.",
        "校对时，遇到你知道容易出错的词要放慢速度。把每个词当作字母来读，而不是当作声音。注意双写字母（*accommodate*、*embarrass*、*occurred*）、不发音的字母（*government*、*February*、*Wednesday*）和读音相近的元音（*separate*、*definite*、*independent*）。拼写检查器发现不了拼成了另一个真实单词的错误，所以每个词都要仔细看。",
      ],
      ["Which word in the sentence is misspelled?", "句子中哪个词拼错了？"],
      `
${misspelledLines}
        The goverment announced a new tax on Wednesday.|goverment|announced|Wednesday
        We arrived in Febuary, just before the festival.|Febuary|arrived|festival
        The independant candidate won the election.|independant|candidate|election
        She was embarassed by the mistake in her speech.|embarassed|mistake|speech
        The accident occured near the old bridge.|occured|accident|bridge
        He definately deserved the award.|definately|deserved|award
        The library has a seperate room for rare books.|seperate|library|rare
        The museum could not accomodate the large crowd.|accomodate|museum|crowd
        Her neice won a scholarship to study music.|neice|scholarship|music
        The dancers moved to the rythm of the drums.|rythm|dancers|drums
        It is neccessary to book tickets in advance.|neccessary|tickets|advance
        The writer's begining was slow but the ending was strong.|begining|writer's|ending
        We recieved a letter from our cousin in Spain.|recieved|letter|cousin
        The tournament is held every Wendesday in summer.|Wendesday|tournament|summer
        The comittee met to discuss the new park.|comittee|discuss|park
        She has an excellant memory for faces.|excellant|memory|faces
        The arguement between the brothers lasted all night.|arguement|brothers|lasted
        The guide gave us useful knowlege about the caves.|knowlege|useful|caves
        The beggining of the play was confusing.|beggining|play|confusing
        His behavior was completly unacceptable.|completly|behavior|unacceptable
        The restaraunt served food from many countries.|restaraunt|served|countries
        The judge's desicion surprised the lawyers.|desicion|judge's|lawyers
        I was suprised by the size of the cathedral.|suprised|size|cathedral
        The proffessor explained the theory clearly.|proffessor|explained|theory
        The weather was perfect for a picnic untill the rain came.|untill|weather|picnic
        Her persistance finally paid off.|persistance|finally|paid
        The ocassion called for a formal dress.|ocassion|formal|dress
        We visited the cemetary where the poet is buried.|cemetary|visited|buried
        The magazine published a calender of local events.|calender|magazine|events
        The tired athelete crossed the finish line.|athelete|crossed|finish
      `,
      (right) => [
        `**${right}** is misspelled; check the dictionary spelling of the word.`,
        `**${right}** 拼错了；查一查这个词在词典中的拼写。`,
      ],
      [
        ["*{wrong}* is spelled correctly; the misspelled word is **{right}**.", "*{wrong}* 拼写正确；拼错的词是 **{right}**。"],
        ["*{wrong}* is spelled correctly too; look again at **{right}**.", "*{wrong}* 拼写也正确；再看看 **{right}**。"],
      ],
    ),
  ],
});

/** grammarTopics9b are the grammar and mechanics topics of the later units of grade 9. */
export const grammarTopics9b: readonly TopicDef[] = [brackets, literaryPresent, myths, confused5, spelling];
