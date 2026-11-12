// College writing: more cores for the grammar and style banks. Frames, people and phrases cross these cores into a
// hundred items or more for each knowledge point; every item is built the same way on every run.

/** pickMore takes an element of a list by an index that may run past its end. */
const pickMore = <T>(list: readonly T[], i: number): T => list[i % list.length] as T;

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** habits are a habit as a gerund phrase, as a past clause, the outcome, and two groups it was studied in. */
const habits = [
  ["walking daily", "walked daily", "better memory", ["older adults", "office workers"]],
  ["reading aloud", "read aloud each day", "better spelling", ["young children", "language learners"]],
  ["drinking green tea", "drank green tea", "longer sleep", ["night-shift workers", "university students"]],
  ["eating breakfast", "ate breakfast", "higher test scores", ["secondary pupils", "trainee nurses"]],
  ["practicing meditation", "meditated each morning", "lower stress", ["teachers", "hospital staff"]],
  ["playing a musical instrument", "played an instrument", "stronger attention", ["primary pupils", "teenagers"]],
  ["cycling to work", "cycled to work", "fewer sick days", ["city commuters", "factory workers"]],
  ["using a standing desk", "used a standing desk", "less back pain", ["call-center staff", "programmers"]],
  ["taking short naps", "took short naps", "faster reaction times", ["pilots", "truck drivers"]],
  ["learning a second language", "learned a second language", "better problem solving", ["retired adults", "nine-year-olds"]],
  ["gardening weekly", "gardened weekly", "improved mood", ["older adults", "people living alone"]],
  ["limiting screen time", "limited their screen time", "earlier bedtimes", ["teenagers", "young children"]],
] as const;
const habitCases = habits.flatMap(([gerund, past, outcome, groups]) => groups.map((group) => [gerund, past, outcome, group] as const));

/** moreHedgingLines are lines of "evidence|claim as strong as it|claim too strong or too weak|claim too strong or too weak". */
export const moreHedgingLines = habitCases
  .flatMap(([gerund, past, outcome, group], i) => [
    `One survey of ${20 + (i % 5) * 7} ${group} found that those who ${past} reported ${outcome}.|${cap(gerund)} may be linked to ${outcome} in ${group}.|${cap(gerund)} gives every one of the ${group} ${outcome}.|This survey proves that ${gerund} always leads to ${outcome}.`,
    `Over ${30 + (i % 4) * 10} controlled trials with thousands of ${group} found that those assigned to ${gerund} had ${outcome}.|${cap(gerund)} leads to ${outcome} in ${group}.|${cap(gerund)} might possibly have some small link to ${outcome}, perhaps.|${cap(gerund)} guarantees ${outcome} for people of every age and background.`,
    `National records over ${10 + (i % 3) * 10} years show that ${group} who ${past} had ${outcome}.|In these records, ${group} who ${past} tended to have ${outcome}.|${cap(gerund)} causes ${outcome} in everyone.|It is barely conceivable that ${gerund} could perhaps matter somewhat.`,
  ])
  .join("\n");

/** moreClaimLines are lines of "evidence and claim|what is wrong with the claim" for the four verdicts on a claim. */
export const moreClaimLines = (causal: string, broad: string, timid: string, fits: string): string =>
  habitCases
    .flatMap(([gerund, past, outcome, group], i) => [
      `Evidence: a survey of ${200 + (i % 6) * 50} ${group} found that those who ${past} had ${outcome}.\\nClaim: ${cap(gerund)} causes ${outcome} in ${group}.|${causal}`,
      `Evidence: a controlled trial with ${40 + (i % 5) * 10} ${group} in one town found that ${gerund} led to ${outcome}.\\nClaim: ${cap(gerund)} leads to ${outcome} in people everywhere.|${broad}`,
      `Evidence: forty controlled trials with 20,000 ${group} found that ${gerund} led to ${outcome}.\\nClaim: ${cap(gerund)} may possibly lead to ${outcome} in some ${group}.|${timid}`,
      `Evidence: a survey of ${300 + (i % 4) * 100} ${group} found that those who ${past} reported ${outcome}.\\nClaim: In this survey, ${group} who ${past} reported ${outcome}.|${fits}`,
    ])
    .join("\n");

const scholars = ["Abara", "Bianchi", "Chen", "Duarte", "Eriksen", "Farouk", "Gupta", "Horvat", "Ibsen", "Juarez"] as const;
const findings = [
  "the city's buses run late more often in winter",
  "most of the town's water comes from one river",
  "students who sleep longer score higher",
  "the old factory still pollutes the river",
  "online shopping has hurt small shops",
  "the museum's oldest map is a copy",
  "school uniforms reduce bullying",
  "the forest is shrinking each year",
  "remote work raises productivity",
  "the dam has weakened the fishing industry",
  "the census undercounted rural families",
  "the festival brings in more money than it costs",
] as const;
/** citingFrames are, for each reporting verb, what the source does and the frame of the sentence that reports it. */
const citingFrames = [
  ["argues", "{N} gives reasons for one position and defends it against objections.", "{N} ___ that {C}."],
  ["concedes", "{N} takes the other side but admits one point to the critics.", "{N} ___ that {C}."],
  ["refutes", "{N} shows with clear evidence that a popular belief is false.", "{N} ___ the claim that {C}."],
  ["observes", "{N} simply points out a fact, without arguing about it.", "{N} ___ that {C}."],
  ["suggests", "{N} offers a possible explanation, cautiously, without claiming to be sure.", "{N} ___ that {C}."],
  ["doubts", "{N} is not convinced by a popular claim and says so.", "{N} ___ that {C}."],
  ["denies", "Accused of hiding the truth, {N} says flatly that it is false.", "{N} ___ that {C}."],
] as const;
const dangers = [
  "the bridge will fail within five years",
  "the lake will dry up by 2040",
  "cheap chargers can start fires",
  "the drug harms the kidneys over time",
  "the coast will flood every winter",
  "the archive will be lost if it is not copied",
] as const;

/** moreCitingRows are lines of "what a source does and a sentence with a gap|the reporting verb". */
export const moreCitingRows = [
  ...citingFrames.flatMap(([verb, does, frame], v) =>
    scholars.map((name, i) => {
      const claim = pickMore(findings, i + v * 3);
      return `${does.replaceAll("{N}", name)} ${frame.replace("{N}", name).replace("{C}", claim)}|${verb}`;
    }),
  ),
  ...dangers.map(
    (danger, i) =>
      `${pickMore(scholars, i + 4)} alerts readers to a danger if nothing changes. ${pickMore(scholars, i + 4)} ___ that ${danger}.|warns`,
  ),
].join("\n");

const stanceSources = ["Okafor", "The report", "The study", "Mensah", "The survey", "Dr. Ito", "The audit", "The review"] as const;
const acceptVerbs = ["shows", "demonstrates", "establishes", "confirms"] as const;
const doubtVerbs = ["claims", "alleges", "insists"] as const;
const neutralVerbs = ["writes", "states", "reports", "notes"] as const;

/** moreStanceLines are lines of "a sentence with a reporting verb in bold|what the verb shows of the writer's view". */
export const moreStanceLines = (accepts: string, doubts: string, neutral: string): string =>
  stanceSources
    .flatMap((source, i) => [
      ...[0, 1, 2].map((j) => `${source} **${pickMore(acceptVerbs, i + j)}** that ${pickMore(findings, i + j)}.|${accepts}`),
      ...[0, 1, 2].map((j) => `${source} **${pickMore(doubtVerbs, i + j)}** that ${pickMore(findings, i + j + 4)}.|${doubts}`),
      ...[0, 1, 2].map((j) => `${source} **${pickMore(neutralVerbs, i + j)}** that ${pickMore(findings, i + j + 8)}.|${neutral}`),
    ])
    .join("\n");

/** knownThings are a first sentence that ends with a thing, the thing as named again, its participle, its past, and who acted on it. */
const knownThings = [
  ["the city built a new bridge over the river", "The bridge", "designed", "designed", "a young engineer from the university"],
  ["the school opened a garden behind the gym", "The garden", "planted", "planted", "students from every grade"],
  ["the museum bought an old map of the coast", "The map", "drawn", "drew", "a sailor in 1620"],
  ["the town held a vote on a new park", "The vote", "won", "won", "the park's supporters"],
  ["the library received a box of old letters", "The letters", "written", "wrote", "a soldier far from home"],
  ["the council proposed a tax on plastic bags", "The tax", "opposed", "opposed", "shop owners who feared losing customers"],
  ["the researchers collected water from forty wells", "The water", "tested", "tested", "a lab in the capital"],
  ["the company released a new phone", "The phone", "reviewed", "reviewed", "dozens of magazines"],
  ["the hospital bought a new scanner", "The scanner", "paid for", "paid for", "a local charity"],
  ["the orchestra played a forgotten symphony", "The symphony", "found", "found", "a student in an attic"],
  ["the farmers planted a new kind of rice", "The rice", "developed", "developed", "scientists in the Philippines"],
  ["the police found a stolen painting", "The painting", "taken", "took", "thieves from a museum in Oslo"],
  ["the team tested a new vaccine", "The vaccine", "made", "made", "a small firm in Belgium"],
  ["the school replaced its old textbooks", "The new textbooks", "written", "wrote", "a group of local teachers"],
  ["the village restored its old mill", "The mill", "built", "built", "monks in the twelfth century"],
  ["the city planted ten thousand trees", "The trees", "chosen", "chose", "experts at the botanic garden"],
  ["the navy raised an old shipwreck", "The wreck", "located", "located", "divers searching for a lost cargo"],
  ["the court heard a famous case", "The case", "brought", "brought", "a group of fishermen"],
  ["the magazine printed a new short story", "The story", "written", "wrote", "a seventeen-year-old student"],
  ["the zoo welcomed a baby panda", "The panda", "named", "named", "children from the nearby school"],
  ["the government passed a new law on noise", "The law", "drafted", "drafted", "a committee of doctors"],
  ["the gallery showed a set of early photographs", "The photographs", "taken", "took", "a doctor during the war"],
  ["the club built a new pitch", "The pitch", "funded", "funded", "the families of the players"],
  ["the archive found a lost film", "The film", "made", "made", "a director nobody remembers"],
] as const;
const openings = ["Last year,", "In 2019,", "After years of debate,"] as const;

/** moreCohesionLines are lines of "first sentence|next sentence starting with what is known|two that start with what is new". */
export const moreCohesionLines = knownThings
  .flatMap(([first, thing, pp, past, actor]) =>
    openings.map((opening) => {
      const be = /s$/.test(thing) ? "were" : "was";
      const known = thing.charAt(0).toLowerCase() + thing.slice(1);
      return `${opening} ${first}.|${thing} ${be} ${pp} by ${actor}.|${cap(actor)} ${past} ${known}.|It was ${actor} who ${past} ${known}.`;
    }),
  )
  .join("\n");

/** chains are five things, as first named and as named again, and the four verbs that link them, active and passive. */
const chains: readonly (readonly [things: readonly string[], verbs: readonly (readonly [string, string])[]])[] = [
  [
    ["the valley/the valley", "a deep lake/the lake", "a river/the river", "an old mill/the mill", "flour for the village/the flour"],
    [
      ["holds", "is held in"],
      ["feeds", "is fed by"],
      ["turns", "is turned by"],
      ["grinds", "is ground in"],
    ],
  ],
  [
    [
      "our school/our school",
      "a radio club/the club",
      "a small transmitter/the transmitter",
      "farms across the valley/those farms",
      "news of the weather/the news",
    ],
    [
      ["runs", "is run by"],
      ["built", "was built by"],
      ["reaches", "are reached by"],
      ["receive", "is received on"],
    ],
  ],
  [
    [
      "the company/the company",
      "a new chef/the chef",
      "a winter menu/the menu",
      "local mushrooms/the mushrooms",
      "every dish on Fridays/those dishes",
    ],
    [
      ["hired", "was hired by"],
      ["created", "was created by"],
      ["uses", "are used in"],
      ["flavor", "is flavored with"],
    ],
  ],
  [
    [
      "the storm/the storm",
      "the harbor wall/the wall",
      "three fishing boats/the boats",
      "a crew of volunteers/the volunteers",
      "a new slipway/the slipway",
    ],
    [
      ["damaged", "was damaged by"],
      ["protected", "were protected by"],
      ["were repaired by", "repaired"],
      ["built", "was built by"],
    ],
  ],
  [
    [
      "the museum/the museum",
      "a rare coin/the coin",
      "a Roman emperor/the emperor",
      "a famous bridge/the bridge",
      "the river Tiber/the river",
    ],
    [
      ["displays", "is displayed in"],
      ["shows", "is shown on"],
      ["built", "was built by"],
      ["crosses", "is crossed by"],
    ],
  ],
  [
    [
      "the festival/the festival",
      "a parade/the parade",
      "the main square/the square",
      "a statue of a poet/the statue",
      "a famous sonnet/the sonnet",
    ],
    [
      ["includes", "is included in"],
      ["fills", "is filled by"],
      ["contains", "is contained in"],
      ["quotes", "is quoted on"],
    ],
  ],
  [
    [
      "the factory/the factory",
      "glass bottles/the bottles",
      "a local brewery/the brewery",
      "a dark ale/the ale",
      "a prize at the fair/the prize",
    ],
    [
      ["makes", "are made in"],
      ["go to", "is supplied with"],
      ["brews", "is brewed in"],
      ["won", "was won by"],
    ],
  ],
  [
    [
      "the farm/the farm",
      "wheat/the wheat",
      "a bakery in town/the bakery",
      "bread for the school/the bread",
      "two hundred pupils/the pupils",
    ],
    [
      ["grows", "is grown on"],
      ["goes to", "is supplied with"],
      ["bakes", "is baked in"],
      ["feeds", "are fed with"],
    ],
  ],
  [
    [
      "the study/the study",
      "two thousand children/the children",
      "a reading test/the test",
      "a new method/the method",
      "teachers in four countries/those teachers",
    ],
    [
      ["followed", "were followed in"],
      ["took", "was taken by"],
      ["assessed", "was assessed by"],
      ["has spread to", "have adopted"],
    ],
  ],
  [
    ["the novel/the novel", "an orphan/the orphan", "an old sailor/the sailor", "a map of an island/the map", "a buried chest/the chest"],
    [
      ["follows", "is followed in"],
      ["meets", "is met by"],
      ["gives the boy", "is given to the boy by"],
      ["shows", "is shown on"],
    ],
  ],
  [
    [
      "the law/the law",
      "the right to vote/that right",
      "all adults/those adults",
      "a new party/the party",
      "the next election/the election",
    ],
    [
      ["gave", "was given by"],
      ["covers", "are covered by"],
      ["formed", "was formed by"],
      ["won", "was won by"],
    ],
  ],
  [
    [
      "the app/the app",
      "a daily reminder/the reminder",
      "a short exercise/the exercise",
      "the muscles of the back/those muscles",
      "the spine/the spine",
    ],
    [
      ["sends", "is sent by"],
      ["suggests", "is suggested by"],
      ["strengthens", "are strengthened by"],
      ["support", "is supported by"],
    ],
  ],
  [
    [
      "the river/the river",
      "a canyon/the canyon",
      "rare birds/the birds",
      "insects on the cliffs/the insects",
      "the canyon's wildflowers/the flowers",
    ],
    [
      ["carved", "was carved by"],
      ["shelters", "are sheltered in"],
      ["eat", "are eaten by"],
      ["pollinate", "are pollinated by"],
    ],
  ],
  [
    [
      "the painter/the painter",
      "a portrait of his mother/the portrait",
      "a museum in Madrid/the museum",
      "a fire in 1734/the fire",
      "most of the building/the building",
    ],
    [
      ["painted", "was painted by"],
      ["hung in", "held"],
      ["survived", "damaged"],
      ["destroyed", "was destroyed by"],
    ],
  ],
  [
    [
      "the city/the city",
      "a new tram line/the tram line",
      "the old port/the port",
      "fishing boats/the boats",
      "fresh fish each morning/the fish",
    ],
    [
      ["opened", "was opened by"],
      ["serves", "is served by"],
      ["shelters", "are sheltered in"],
      ["bring in", "is brought in by"],
    ],
  ],
  [
    [
      "the scientist/the scientist",
      "a new frog/the frog",
      "a single mountain/the mountain",
      "loggers/the loggers",
      "the last old trees/the trees",
    ],
    [
      ["discovered", "was discovered by"],
      ["lives on", "is home to"],
      ["is threatened by", "threaten"],
      ["are cutting", "are being cut by"],
    ],
  ],
  [
    [
      "the theater/the theater",
      "a famous play/the play",
      "a young actor/the actor",
      "a national award/the award",
      "a scholarship for students/the scholarship",
    ],
    [
      ["staged", "was staged by"],
      ["starred", "starred in"],
      ["won", "was won by"],
      ["funds", "is funded by"],
    ],
  ],
  [
    [
      "the survey/the survey",
      "five hundred workers/the workers",
      "long shifts/the shifts",
      "back pain/the pain",
      "many sick days/those days",
    ],
    [
      ["asked", "were asked by"],
      ["described", "were described by"],
      ["cause", "is caused by"],
      ["leads to", "follow from"],
    ],
  ],
  [
    ["the ship/the ship", "two hundred passengers/the passengers", "a doctor/the doctor", "a fever/the fever", "the crew/the crew"],
    [
      ["carried", "were carried by"],
      ["included", "was included among"],
      ["treated", "was treated by"],
      ["spread through", "was struck by"],
    ],
  ],
  [
    [
      "the company/the company",
      "a phone/the phone",
      "a battery/the battery",
      "a lab in Seoul/the lab",
      "three hundred engineers/the engineers",
    ],
    [
      ["launched", "was launched by"],
      ["has", "is in"],
      ["was developed in", "developed"],
      ["employs", "work in"],
    ],
  ],
  [
    [
      "the council/the council",
      "a new tax/the tax",
      "road repairs/the repairs",
      "the main highway/the highway",
      "every truck in the region/those trucks",
    ],
    [
      ["proposed", "was proposed by"],
      ["pays for", "are paid for by"],
      ["are needed on", "needs"],
      ["carries", "is carried on"],
    ],
  ],
  [
    [
      "the library/the library",
      "a large gift/the gift",
      "a former student/the student",
      "a career in medicine/that career",
      "a clinic in her home town/the clinic",
    ],
    [
      ["received", "was received by"],
      ["came from", "gave"],
      ["built", "was built by"],
      ["led to", "came from"],
    ],
  ],
  [
    [
      "the teacher/the teacher",
      "a garden club/the club",
      "twenty pupils/the pupils",
      "vegetables/the vegetables",
      "the school kitchen/the kitchen",
    ],
    [
      ["started", "was started by"],
      ["has", "belong to"],
      ["grow", "are grown by"],
      ["supply", "is supplied with"],
    ],
  ],
  [
    [
      "the dam/the dam",
      "a reservoir/the reservoir",
      "drinking water/the water",
      "the capital/the capital",
      "four million people/those people",
    ],
    [
      ["created", "was created by"],
      ["holds", "is held in"],
      ["reaches", "is reached by"],
      ["serves", "are served by"],
    ],
  ],
];
const chainOpenings = ["", "As the guide explains, ", "In this account, "] as const;
const named2 = (pair: string) => pair.split("/") as [string, string];

/** moreBreakLines are lines of four sentences, the number of the one that starts with something new, and what it starts with. */
export const moreBreakLines = chains
  .flatMap(([things, verbs]) =>
    [2, 3, 4].map((broken, b) => {
      const sentences = verbs.map(([active, passive], k) => {
        const [, before] = named2(pickMore(things, k));
        const [after] = named2(pickMore(things, k + 1));
        const subject = k === 0 ? named2(pickMore(things, 0))[0] : before;
        return k + 1 === broken ? `${cap(after)} ${passive} ${subject}.` : `${cap(subject)} ${active} ${after}.`;
      });
      const opening = pickMore(chainOpenings, b);
      const [s1 = "", s2 = "", s3 = "", s4 = ""] = sentences;
      const first = opening === "" ? s1 : `${opening}${s1.charAt(0).toLowerCase()}${s1.slice(1)}`;
      const [newThing] = named2(pickMore(things, broken));
      const [, oldThing] = named2(pickMore(things, broken - 1));
      return `${first}|${s2}|${s3}|${s4}|${broken}|*${cap(newThing)}*, which is new, instead of ${oldThing} named just before`;
    }),
  )
  .join("\n");

/** buriedActions are an abstract noun, the verb in past and base form, and things it may act on. */
const buriedActions = [
  ["review", "reviewed", "review"],
  ["approval", "approved", "approve"],
  ["analysis", "analyzed", "analyze"],
  ["inspection", "inspected", "inspect"],
  ["revision", "revised", "revise"],
  ["evaluation", "evaluated", "evaluate"],
  ["discussion", "discussed", "discuss"],
  ["investigation", "investigated", "investigate"],
  ["examination", "examined", "examine"],
  ["rejection", "rejected", "reject"],
  ["cancellation", "cancelled", "cancel"],
  ["renewal", "renewed", "renew"],
] as const;
const deskThings = ["the budget", "the contract", "the report", "the plan", "the policy", "the proposal"] as const;
const deciders = ["the board", "the committee", "the council", "the manager", "the panel", "the director"] as const;
const whenWords = ["in May", "last week", "on Monday", "after the election"] as const;
const buriedCases = buriedActions.flatMap((action, i) =>
  deskThings.map((thing, j) => [action, thing, pickMore(deciders, i + j), pickMore(whenWords, i * 2 + j)] as const),
);

/** moreClarityLines are lines of "a sentence of abstract nouns|clear revision|still abstract|meaning changed". */
export const moreClarityLines = buriedCases
  .map(
    ([[noun, past, base], thing, who, when]) =>
      `The ${noun} of ${thing} by ${who} took place ${when}.|${cap(who)} ${past} ${thing} ${when}.|${cap(thing)} underwent ${noun} by ${who} ${when}.|${cap(who)} did not ${base} ${thing} ${when}.`,
  )
  .join("\n");

/** moreActorLines are lines of "a sentence|the real character and action|an abstraction as character|a weak verb as action". */
export const moreActorLines = buriedCases
  .map(
    ([[noun, , base], thing, who, when]) =>
      `There was a ${noun} of ${thing} by ${who} ${when}.|Character: ${who}. Action: ${base}.|Character: the ${noun}. Action: ${base}.|Character: ${who}. Action: there was.`,
  )
  .join("\n");

const toneReaders = [
  "your manager",
  "a client",
  "a professor you have never met",
  "a colleague in another team",
  "the head of the department",
  "a new customer",
] as const;
/** asks are something to ask for, said politely, casually, bluntly and stiffly, with a reason. */
const asks = [
  [
    "a copy of the latest report",
    "Could you send me a copy of the latest report?",
    "send me the report pls",
    "Send me the latest report today.",
    "It is requested that a copy of the latest report be furnished to the undersigned.",
    "I need it to prepare for Monday's meeting.",
  ],
  [
    "a short delay to a deadline",
    "Would it be possible to move the deadline to Friday?",
    "can we push the deadline lol",
    "Move the deadline to Friday.",
    "It is hereby requested that the deadline be postponed until Friday.",
    "Two of the figures are still being checked.",
  ],
  [
    "a meeting next week",
    "Could we meet for half an hour next week?",
    "wanna meet next week??",
    "We are meeting next week. Pick a time.",
    "The undersigned wishes to request the scheduling of a meeting during the coming week.",
    "I would like to go over the new schedule.",
  ],
  [
    "feedback on a draft",
    "Would you have time to look over my draft?",
    "thoughts on my draft? thx",
    "Read my draft and tell me what is wrong with it.",
    "Your evaluation of the attached draft is hereby solicited.",
    "I want to be sure the argument is clear.",
  ],
  [
    "help with a broken printer",
    "Could you help me with the printer when you have a moment?",
    "printer's dead again, help",
    "Fix the printer.",
    "Assistance with the malfunctioning printing device is respectfully requested.",
    "It stopped working this morning.",
  ],
  [
    "a reference letter",
    "Would you be willing to write me a reference?",
    "can u write me a reference",
    "Write me a reference by next week.",
    "The provision of a letter of reference by your good self is hereby requested.",
    "I am applying for a place on a summer course.",
  ],
  [
    "a refund for a late order",
    "Could you refund the shipping cost for my late order?",
    "where's my refund??",
    "Refund the shipping cost now.",
    "Reimbursement of the shipping charges is hereby demanded by the undersigned.",
    "The order arrived a week after the promised date.",
  ],
  [
    "a change of room",
    "Would it be possible to use a larger room?",
    "can we get a bigger room",
    "Give us a larger room.",
    "A reallocation of the meeting to a more capacious room is hereby requested.",
    "Twenty more people have signed up.",
  ],
  [
    "the slides from the talk",
    "Could you share the slides from your talk?",
    "slides plz?",
    "Send the slides.",
    "It would be appreciated if the slides were transmitted to the undersigned.",
    "I would like to use them in my own notes.",
  ],
  [
    "an extra day off",
    "Would it be possible for me to take Monday off?",
    "gonna skip monday ok?",
    "I am taking Monday off.",
    "Leave of absence for the undersigned on Monday is hereby requested.",
    "My brother is getting married on Sunday.",
  ],
  [
    "a quick call",
    "Could we have a quick call this afternoon?",
    "call me",
    "Call me this afternoon.",
    "A telephonic conversation this afternoon is hereby proposed.",
    "There is a question about the contract.",
  ],
  [
    "access to the shared files",
    "Could you give me access to the shared files?",
    "need the files, can u add me",
    "Give me access to the shared files.",
    "The granting of access privileges to the shared files is hereby requested.",
    "I have just joined the project.",
  ],
] as const;
const toneCases = toneReaders.flatMap((reader, i) => asks.map((ask, j) => [reader, ask, i * asks.length + j] as const));

/** moreToneLines are lines of "situation|message that suits it|too casual|too blunt or too stiff". */
export const moreToneLines = toneCases
  .map(
    ([reader, [thing, polite, casual, blunt, stiff, reason], k]) =>
      `Asking ${reader} for ${thing}.|${polite} ${reason}|${casual}|${k % 2 === 0 ? `${blunt} ${reason}` : stiff}`,
  )
  .join("\n");

/** moreToneProblemLines are lines of "reader, purpose and message|how the message suits its reader". */
export const moreToneProblemLines = (suits: string, casualLabel: string, bluntLabel: string, stiffLabel: string): string =>
  toneCases
    .map(([reader, [thing, polite, casual, blunt, stiff, reason], k]) => {
      const lead = `To ${reader}, asking for ${thing}:`;
      if (k % 4 === 0) return `${lead} ${polite} ${reason}|${suits}`;
      if (k % 4 === 1) return `${lead} ${casual}|${casualLabel}`;
      if (k % 4 === 2) return `${lead} ${blunt}|${bluntLabel}`;
      return `${lead} ${stiff}|${stiffLabel}`;
    })
    .join("\n");

/** listFormNames are the forms of moreListBreakLines, in the order of the plans it builds. */
const listFormNames = ["the -ing form", "the command form", "the to-form"] as const;
const listLeads = ["Headings of the report on", "Steps for", "Goals of the plan for"] as const;
const asForm = (form: number, [base, ing, rest]: readonly [string, string, string]) =>
  form === 0 ? `${cap(ing)} ${rest}` : form === 1 ? `${cap(base)} ${rest}.` : `To ${base} ${rest}`;

/** moreListBreakLines are lines of "lead-in|form|three items|the odd item|its form", built from cores of four steps. */
export const moreListBreakLines = (
  cores: readonly (readonly [topic: string, items: readonly (readonly [string, string, string])[]])[],
): string =>
  cores
    .flatMap(([topic, items]) =>
      [0, 1, 2].flatMap((form) =>
        [0, 1].map((v) => {
          const oddForm = [0, 1, 2].filter((f) => f !== form)[v] ?? 0;
          const at = (form * 2 + v) % items.length;
          const odd = items[at] as readonly [string, string, string];
          const rest = items.filter((_, k) => k !== at).slice(0, 3);
          return `${listLeads[form]} ${topic}:|${listFormNames[form]}|${rest.map((item) => asForm(form, item)).join(";")}|${asForm(oddForm, odd)}|${listFormNames[oddForm]}`;
        }),
      ),
    )
    .join("\n");
