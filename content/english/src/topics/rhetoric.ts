// Rhetoric and composition: how writers and speakers persuade, the reasoning that fails, and writing about both, for grades 9 to 12.

import { type CriterionSpec, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, criterionById, point, type WritingItem, writingGenerator } from "@ga/subject-english";
import {
  allusionMore,
  appealMore,
  audienceMore,
  characterizationMore,
  deviceMore,
  fallacyMore,
  paradoxMore,
  purposeMore,
  rhetoricalAnalysisMore,
  sourceMore,
  synthesisMore,
} from "./rhetoric-more.ts";
import {
  allusionChoiceStep,
  appealStep,
  contradictionStep,
  deviceStep,
  repairStep,
  sourceWeaknessStep,
  traitStep,
} from "./rhetoric-steps.ts";

type Say = (wrong: string, right: string, shown: string, position: number) => readonly [string, string];

const pick = (
  question: [string, string],
  bank: readonly ChoiceItem[],
  en: (right: string) => string,
  zh: (right: string) => string,
  not: Say,
) =>
  choiceGenerator(
    t(question[0], question[1]),
    bank,
    (right) => t(en(right), zh(right)),
    (wrong, right, shown, position) => t(...not(wrong, right, shown, position)),
  );

/** meaning looks up the feedback for a wrong label; a label with no entry is a mistake in the bank. */
const meaning =
  (says: Readonly<Record<string, readonly [string, string]>>): Say =>
  (wrong) => {
    const said = says[wrong];
    if (!said) throw new Error(`no feedback for the label ${wrong}`);
    return said;
  };

const named = (
  question: [string, string],
  bank: readonly ChoiceItem[],
  why: Readonly<Record<string, readonly [string, string]>>,
  not: Say,
) =>
  pick(
    question,
    bank,
    (right) => `This is **${right}**. ${why[right]?.[0] ?? ""}`,
    (right) => `这是 **${right}**。${why[right]?.[1] ?? ""}`,
    not,
  );

const criterion = (id: string): CriterionSpec => {
  const found = criterionById(id);
  if (!found) throw new Error(`unknown criterion ${id}`);
  return found;
};

// The rhetorical situation.

const audienceBank: readonly ChoiceItem[] = [
  [
    '"As parents, you want your children to come home safe. That is why I am asking you to support a crossing guard at Elm Street."',
    "parents of the town's schoolchildren",
    ["the children themselves", "the town's road builders"],
  ],
  [
    '"Fellow players, we have trained for this all season. Tonight, every pass and every tackle counts."',
    "the members of a sports team",
    ["the fans in the stands", "the referees of the game"],
  ],
  [
    '"If you hire me, you will get a worker who arrives early, learns fast and never leaves a task half done."',
    "an employer deciding whom to hire",
    ["the speaker's future coworkers", "customers of the business"],
  ],
  [
    '"Members of the council, the library\'s roof has leaked for three winters. Your vote tonight can fix it."',
    "the members of a town council",
    ["the library's readers", "the workers who will fix the roof"],
  ],
  [
    '"You have spent four years in these halls. Now, as you leave, remember the friends who helped you here."',
    "students at their graduation",
    ["teachers starting their first year", "parents of new students"],
  ],
  [
    '"Dear neighbors, the empty lot on Pine Road could become a garden for all of us. Will you lend a hand on Saturday?"',
    "the people who live near the empty lot",
    ["the owner of the lot", "gardeners from other cities"],
  ],
  [
    '"Scientists in this room know how hard it is to win funding. I am here to show you a way to share our equipment."',
    "scientists at a meeting",
    ["students thinking about science", "the companies that sell equipment"],
  ],
  [
    '"Kids, before you swim, look for the lifeguard\'s flag. Green means go; red means stay on the sand."',
    "children at a beach",
    ["the lifeguards on duty", "parents who cannot swim"],
  ],
  ...audienceMore,
];

const purposeBank: readonly ChoiceItem[] = [
  [
    "A pamphlet lists the warning signs of a stroke and tells readers to call for help at once.",
    "to inform readers so they can act",
    ["to entertain readers with a story", "to persuade readers to buy a product"],
  ],
  [
    "A letter to the editor argues that the town should keep the pool open in winter.",
    "to persuade readers to agree with a position",
    ["to inform readers of the pool's hours", "to entertain readers with a funny event"],
  ],
  [
    "A short story follows a dog that sneaks onto a train and travels across the country.",
    "to entertain readers",
    ["to persuade readers to adopt a dog", "to explain how trains work"],
  ],
  [
    "A speech at a fundraiser describes children without books and asks the audience to donate.",
    "to persuade the audience to give",
    ["to inform the audience about printing", "to entertain the audience with jokes"],
  ],
  [
    "A manual explains, step by step, how to set up a new printer.",
    "to inform readers how to do something",
    ["to persuade readers to buy a printer", "to entertain readers"],
  ],
  [
    "An editorial urges voters to choose a candidate who promises cleaner rivers.",
    "to persuade readers how to vote",
    ["to inform readers about how rivers form", "to entertain readers with a story about fishing"],
  ],
  [
    "A news report describes a fire downtown: when it started, how many were hurt and what caused it.",
    "to inform readers about an event",
    ["to persuade readers to become firefighters", "to entertain readers with a thrilling tale"],
  ],
  [
    "A comic poem describes a cat's failed attempts to catch a fly.",
    "to entertain readers",
    ["to inform readers about insects", "to persuade readers to own a cat"],
  ],
  ...purposeMore,
];

// Appeals.

const appealBank: readonly ChoiceItem[] = [
  ["As a doctor with thirty years in emergency rooms, I have seen what one helmet can save.", "ethos", ["pathos", "logos"]],
  ["Picture a child shivering alone in a doorway on the coldest night of the year.", "pathos", ["ethos", "logos"]],
  ["The new road would cut travel time by twelve minutes for forty thousand drivers each day.", "logos", ["pathos", "ethos"]],
  ["I have coached this team for fifteen seasons, and I know what these players can do.", "ethos", ["logos", "pathos"]],
  ["If plastic use keeps rising at this rate, the ocean will hold more plastic than fish by weight.", "logos", ["ethos", "pathos"]],
  ["Think of the elderly woman who waits for hours at the bus stop because the route was cut.", "pathos", ["logos", "ethos"]],
  ["Since every study of the program shows higher reading scores, the program works.", "logos", ["pathos", "ethos"]],
  ["Three Nobel Prize winners have signed this letter supporting the research.", "ethos", ["pathos", "logos"]],
  ["Imagine the joy on your daughter's face when she sees the park for the first time.", "pathos", ["ethos", "logos"]],
  ...appealMore,
];

const appealWhy: Readonly<Record<string, readonly [string, string]>> = {
  ethos: [
    "It persuades through the speaker's credibility: experience, expertise or the trust of respected people.",
    "它借助说话者的可信度来说服：经验、专业知识或受人尊敬者的认可。",
  ],
  pathos: ["It persuades through the audience's feelings, such as pity, fear or joy.", "它借助听众的情感来说服，例如同情、恐惧或喜悦。"],
  logos: ["It persuades through reason: facts, numbers and logical steps.", "它借助理性来说服：事实、数字和逻辑推理。"],
};

const appealNot = meaning({
  ethos: [
    "Ethos rests on who is speaking or who agrees. This line does not lean on anyone's experience or reputation.",
    "人格诉求依靠说话者或支持者的身份。这句话没有借助任何人的经验或声望。",
  ],
  pathos: [
    "Pathos works through feelings. This line gives reasons or credentials rather than asking the reader to feel.",
    "情感诉求通过情感起作用。这句话给出的是理由或资历，而不是唤起读者的感受。",
  ],
  logos: [
    "Logos works through facts and reasoning. This line gives no figures or logical steps.",
    "理性诉求通过事实和推理起作用。这句话没有给出数据或推理步骤。",
  ],
});

// Devices.

const deviceBank: readonly ChoiceItem[] = [
  ["We shall not tire. We shall not falter. We shall not fail.", "anaphora", ["antithesis", "rhetorical question"]],
  ["It was the best of plans; it was the worst of plans.", "antithesis", ["anaphora", "rhetorical question"]],
  ["Who among us has never needed a second chance?", "rhetorical question", ["antithesis", "anaphora"]],
  [
    "Every child deserves a teacher. Every child deserves a book. Every child deserves a chance.",
    "anaphora",
    ["rhetorical question", "antithesis"],
  ],
  ["Speech is silver, but silence is gold.", "antithesis", ["anaphora", "rhetorical question"]],
  ["Is a world without music a world worth living in?", "rhetorical question", ["anaphora", "antithesis"]],
  ["Many are called, but few are chosen.", "antithesis", ["rhetorical question", "anaphora"]],
  ["With courage we began, with courage we struggled, and with courage we will finish.", "anaphora", ["antithesis", "rhetorical question"]],
  ["How much longer must we wait for clean water?", "rhetorical question", ["anaphora", "antithesis"]],
  ...deviceMore,
];

const deviceWhy: Readonly<Record<string, readonly [string, string]>> = {
  anaphora: [
    "The same words begin several sentences or clauses in a row, building rhythm and emphasis.",
    "同样的词连续出现在几个句子或分句的开头，营造节奏并加强语气。",
  ],
  antithesis: [
    "Opposite ideas are set side by side in balanced phrases, so each sharpens the other.",
    "相反的意思以平衡的短语并列，使彼此更加鲜明。",
  ],
  "rhetorical question": [
    "A question is asked for effect, not for an answer; the answer is meant to be obvious.",
    "为了效果而提出问题，并不期待回答；答案本应不言自明。",
  ],
};

const deviceNot = meaning({
  anaphora: [
    "Anaphora repeats the opening words of sentences or clauses. These openings differ.",
    "首语重复是重复句子或分句开头的词。这里的开头各不相同。",
  ],
  antithesis: [
    "Antithesis sets two opposite ideas against each other. Here no pair of opposites is balanced.",
    "对照是把两个相反的意思放在一起。这里没有成对平衡的相反意思。",
  ],
  "rhetorical question": [
    "A rhetorical question is a question asked for effect. There is no question here.",
    "反问是为了效果而提的问题。这里没有问题。",
  ],
});

// Fallacies.

const fallacyBank: readonly ChoiceItem[] = [
  ["We should ignore Ms. Ray's plan for the budget. She can't even keep her own desk tidy.", "ad hominem", ["straw man", "false dilemma"]],
  [
    "My opponent wants to reduce the army's budget. Clearly, he wants to leave our country defenseless.",
    "straw man",
    ["ad hominem", "slippery slope"],
  ],
  [
    "Either we build the new stadium, or our town will never be anything but a failure.",
    "false dilemma",
    ["hasty generalization", "straw man"],
  ],
  [
    "If we let students choose one book for class, soon they will choose every lesson, and then teachers will have no say at all.",
    "slippery slope",
    ["false dilemma", "bandwagon"],
  ],
  ["I met two rude people from that city, so everyone from there must be rude.", "hasty generalization", ["ad hominem", "bandwagon"]],
  [
    "Millions of people already drink this juice every morning, so it must be good for you.",
    "bandwagon",
    ["hasty generalization", "slippery slope"],
  ],
  [
    "Why listen to the scientist's warning about the river? He failed his driving test twice.",
    "ad hominem",
    ["bandwagon", "false dilemma"],
  ],
  ["You either support every new road or you are against progress.", "false dilemma", ["straw man", "slippery slope"]],
  ["Everyone in my class is getting the new phone, so I should get one too.", "bandwagon", ["ad hominem", "hasty generalization"]],
  [
    "She says we should eat less sugar. So she thinks we should never enjoy dessert again.",
    "straw man",
    ["slippery slope", "hasty generalization"],
  ],
  ...fallacyMore,
];

const fallacyWhy: Readonly<Record<string, readonly [string, string]>> = {
  "ad hominem": ["It attacks the person instead of the person's argument.", "它攻击的是人，而不是这个人的论点。"],
  "straw man": [
    "It twists the other side's view into a weaker, more extreme one that is easier to knock down.",
    "它把对方的观点歪曲成更弱、更极端、更容易驳倒的样子。",
  ],
  "false dilemma": ["It offers only two choices when many more exist.", "它只给出两个选择，而实际上还有很多。"],
  "slippery slope": [
    "It claims that one small step will lead, without proof, to a chain of extreme results.",
    "它断言一小步会毫无根据地引发一连串极端后果。",
  ],
  "hasty generalization": ["It draws a broad conclusion from too few examples.", "它根据太少的例子得出宽泛的结论。"],
  bandwagon: ["It claims something is right or good because many people do it.", "它以很多人都这样做为由，断定某事正确或好。"],
};

const fallacyNot = meaning({
  "ad hominem": [
    "An ad hominem attacks the person making an argument. This argument does not turn on anyone's character.",
    "人身攻击针对的是提出论点的人。这个论证并不涉及任何人的品格。",
  ],
  "straw man": [
    "A straw man misstates the other side's view. Here the other side's view is not restated at all.",
    "稻草人谬误歪曲对方的观点。这里根本没有重述对方的观点。",
  ],
  "false dilemma": [
    "A false dilemma limits the choices to two. This argument does not set up an either-or.",
    "非此即彼谬误把选择限制为两个。这个论证没有设定二选一。",
  ],
  "slippery slope": [
    "A slippery slope predicts a chain of worse and worse results. This argument predicts no such chain.",
    "滑坡谬误预言一连串越来越坏的后果。这个论证没有这样的预言。",
  ],
  "hasty generalization": [
    "A hasty generalization rests on too few examples. This argument does not reason from a handful of cases.",
    "以偏概全依据的例子太少。这个论证并不是从少数几个例子推出结论。",
  ],
  bandwagon: [
    "The bandwagon fallacy appeals to popularity. Nothing here rests on what most people do.",
    "从众谬误诉诸流行。这里没有任何内容依据大多数人怎么做。",
  ],
});

// Characterization.

const characterizationBank: readonly ChoiceItem[] = (
  [
    ["Mr. Hale was the meanest man in the village.", "direct", ["indirect"]],
    ["Mr. Hale kicked the stray cat out of his way and slammed the door on the carol singers.", "indirect", ["direct"]],
    ["Rosa was patient and kind with every child she taught.", "direct", ["indirect"]],
    ["Rosa knelt beside the crying boy and waited, saying nothing, until he was ready to talk.", "indirect", ["direct"]],
    ["The captain was a brave and stubborn woman.", "direct", ["indirect"]],
    ['"Turn back?" the captain laughed, gripping the wheel as the waves rose. "Not while I\'m standing."', "indirect", ["direct"]],
    ["Jin counted his coins three times before handing over a single one, then asked for a receipt.", "indirect", ["direct"]],
    ["Everyone agreed that Jin was the most careful spender in town.", "direct", ["indirect"]],
    ...characterizationMore,
  ] as ChoiceItem[]
)
  .map(([shown, right, wrong]): ChoiceItem => [shown, right, [...wrong, "neither"]])
  .concat(
    [
      "The village sat at the foot of the mountain, its roofs covered in snow.",
      "The train left the station at seven and reached the coast by noon.",
      "Rain had fallen all night, and the streets were full of puddles.",
      "The kitchen was painted yellow and had a window over the sink.",
      "The museum opens at nine and closes at five, except on Mondays.",
      "Three roads met at the old stone bridge outside town.",
      "The orchard held apple trees, pear trees and a single tall walnut.",
      "Winter came early that year, and the lake froze in November.",
    ].map((shown, i): ChoiceItem => [shown, "neither", i % 2 === 0 ? ["direct", "indirect"] : ["indirect", "direct"]]),
  );

// Allusion.

const allusionBank: readonly ChoiceItem[] = [
  [
    "Selling the family farm would be opening Pandora's box.",
    "It would release many troubles that could not be undone.",
    ["It would make the family very rich, with enough money to buy a big house in the city.", "It would let them keep the farm safe."],
  ],
  [
    "The small company faced the giant corporation like David facing Goliath.",
    "A weak side is challenging a much stronger one, and might win.",
    ["The two companies are the same size.", "The small company has already lost the fight and is closing down."],
  ],
  [
    "Tired of the noise, he wished he could find his own Walden.",
    "He wants a quiet, simple place away from crowds.",
    ["He wants to join a bigger city.", "He wants to become famous."],
  ],
  [
    "Her one weakness, her Achilles' heel, was her fear of speaking in public.",
    "It is the single weak point in someone otherwise strong.",
    ["It is her greatest strength.", "It is an old injury to her foot that still hurts when she walks."],
  ],
  [
    "Finishing the project became a Herculean task.",
    "It needed enormous strength and effort.",
    ["It was quick and easy.", "It was done by a team of heroes."],
  ],
  [
    "The new student was a Good Samaritan, helping everyone who dropped their books.",
    "He helps strangers in need without being asked.",
    ["He only helps his close friends.", "He is new to the town's religion."],
  ],
  [
    "Mia's tale of the fish she caught grew longer each time, like Pinocchio's nose.",
    "Her story is growing into a lie.",
    ["Her fish is getting bigger in real life.", "She is becoming a better storyteller."],
  ],
  [
    "Leaving his job to chase a dream, he felt he had crossed the Rubicon.",
    "He has made a choice that cannot be taken back.",
    ["He has gone on a long journey by boat across a river in another country.", "He has failed at his dream."],
  ],
  ...allusionMore,
];

// Paradox and oxymoron.

const paradoxBank: readonly ChoiceItem[] = (
  [
    ["The silence was deafening.", "oxymoron", ["paradox"]],
    ["The more you learn, the more you realize how little you know.", "paradox", ["oxymoron"]],
    ["She gave me a small, bittersweet smile.", "oxymoron", ["paradox"]],
    ["To save time, we must spend it planning.", "paradox", ["oxymoron"]],
    ["The plan was a clever foolishness.", "oxymoron", ["paradox"]],
    ["Less is more.", "paradox", ["oxymoron"]],
    ["They were living a lonely crowd of a life, surrounded by strangers.", "oxymoron", ["paradox"]],
    ["You must be cruel to be kind.", "paradox", ["oxymoron"]],
    ...paradoxMore,
  ] as ChoiceItem[]
)
  .map(([shown, right, wrong]): ChoiceItem => [shown, right, [...wrong, "neither"]])
  .concat(
    [
      "The day was hot, but the night was cold.",
      "She likes tea, while her brother prefers coffee.",
      "The old house was dark inside and bright outside.",
      "He was tall and his sister was short.",
      "Some students walk to school; others take the bus.",
      "The river is calm in summer and wild in spring.",
      "The first test was easy, and the second was hard.",
      "The city is loud by day and quiet by night.",
    ].map((shown, i): ChoiceItem => [shown, "neither", i % 2 === 0 ? ["oxymoron", "paradox"] : ["paradox", "oxymoron"]]),
  );

const paradoxWhy: Readonly<Record<string, readonly [string, string]>> = {
  oxymoron: ["Two words that seem to contradict each other are joined in one phrase.", "两个看似矛盾的词组合在一个短语里。"],
  paradox: [
    "A whole statement seems to contradict itself, yet holds a truth when you think about it.",
    "整个陈述看似自相矛盾，仔细想来却包含着道理。",
  ],
  neither: [
    "The sentence sets two different things side by side, but nothing in it contradicts itself, so it is a plain contrast.",
    "句子把两个不同的事物并列，但其中没有任何自相矛盾之处，所以只是普通的对比。",
  ],
};

const paradoxNot = meaning({
  oxymoron: [
    "An oxymoron is a pair of clashing words. Here the contradiction is in the whole idea, not in two words side by side.",
    "矛盾修饰是一对互相冲突的词。这里的矛盾在于整个意思，而不是并列的两个词。",
  ],
  paradox: [
    "A paradox is a whole statement that seems impossible. Here the clash is between two words placed together.",
    "悖论是看似不可能的整个陈述。这里的冲突来自放在一起的两个词。",
  ],
  neither: [
    "There is a real contradiction here: two ideas that seem unable to be true together, which a plain contrast does not have.",
    "这里有真正的矛盾：两个看似不能同时成立的意思，而普通的对比没有这种矛盾。",
  ],
});

// Sources.

const sourceBank: readonly ChoiceItem[] = [
  [
    "You are writing about the health effects of sleep. Which source is most credible?",
    "A study in a medical journal by sleep researchers at a university",
    [
      "A mattress company's advertisement about better sleep, quoting a doctor it pays",
      "An anonymous post on a forum about staying up late",
    ],
  ],
  [
    "You are writing about the history of the town's bridge. Which source is most credible?",
    "Records kept by the town's historical society, with dates and photographs",
    [
      "A blog post by someone who once drove over the bridge, with photos of it from the car window",
      "A souvenir shop's leaflet with no author",
    ],
  ],
  [
    "You are writing about whether a new medicine works. Which source is most credible?",
    "A report by an independent health agency that reviewed many trials",
    ["The medicine maker's website, with a long page of glowing reviews from customers", "A celebrity's interview praising the medicine"],
  ],
  [
    "You are writing about this year's weather in your region. Which source is most credible?",
    "The national weather service's records for the region",
    ["A friend's memory of a cold winter", 'A video titled "The Craziest Weather Ever!" with no source given'],
  ],
  [
    "You are writing about how much water the city uses. Which source is most credible?",
    "The city water department's yearly report",
    ["A social media post claiming the city wastes water", "A water bottle company's advertisement"],
  ],
  [
    "You are writing about the life of a famous scientist. Which source is most credible?",
    "A biography by a historian that lists the letters and records it used",
    ["A movie loosely based on the scientist's life", "A quiz website with fun facts and no sources"],
  ],
  [
    "You are writing about recycling rates in your country. Which source is most credible?",
    "Data published by the government's environment agency, updated this year",
    ["A news article from fifteen years ago", "A comment by a reader below an online article, with hundreds of likes and replies"],
  ],
  [
    "You are writing about the dangers of a volcano. Which source is most credible?",
    "A geological survey's report written by volcano scientists",
    ["A travel agency's page about visiting the volcano, with tips on the best season to go", "A novel set near the volcano"],
  ],
  ...sourceMore,
];

// Writing about rhetoric.

/** rhetoricalAnalysisBank asks for a paragraph that analyzes how a short passage persuades. */
const rhetoricalAnalysisBank: readonly WritingItem[] = [
  {
    task: "Write a paragraph that analyzes how the speaker tries to persuade the audience. Name a choice the speaker makes, quote it, and explain its effect.",
    source:
      "Friends, I have taught in this school for twenty-two years. I have seen students arrive hungry and leave hungry. A free breakfast program costs less than one new scoreboard. Which will help our students more?",
    model:
      'The speaker persuades by pairing her credibility with a sharp comparison. She opens with "I have taught in this school for twenty-two years," which gives her the authority of long experience. She then sets the cost of breakfast against "one new scoreboard," making the program seem cheap and the scoreboard seem trivial. The closing rhetorical question, "Which will help our students more?", leaves the audience only one sensible answer.',
  },
  {
    task: "Write a paragraph that analyzes how the writer tries to persuade the reader. Name a choice the writer makes, quote it, and explain its effect.",
    source:
      "Every year, our town sends forty thousand tons of waste to the landfill. Half of it could have been recycled. The landfill will be full in eight years. After that, we will pay to truck our trash to the next county.",
    model:
      'The writer persuades mainly through logos, building a chain of facts that leads to a cost. The figures "forty thousand tons" and "Half of it could have been recycled" show the size of the waste. The deadline, "full in eight years," adds urgency without any emotional language. By ending with the practical result that "we will pay to truck our trash," the writer turns a distant problem into one every taxpayer will feel.',
  },
  {
    task: "Write a paragraph that analyzes how the speaker tries to persuade the audience. Name a choice the speaker makes, quote it, and explain its effect.",
    source:
      "Picture the river as it was when your grandparents were young: clear enough to see the stones on the bottom, full of fish, alive with children swimming. Now picture it today. We can bring that river back.",
    model:
      'The speaker persuades through pathos, asking the audience to imagine and then to compare. The image of a river "clear enough to see the stones on the bottom" and "alive with children swimming" calls up warm memories of family and the past. The short command "Now picture it today" forces the listener to feel the loss for themselves. The final sentence, "We can bring that river back," turns that sadness into hope and a call to act.',
  },
  {
    task: "Write a paragraph that analyzes how the writer tries to persuade the reader. Name a choice the writer makes, quote it, and explain its effect.",
    source:
      "We do not ask for much. We ask for safe roads. We ask for clean parks. We ask for a library that is open on weekends. These are not luxuries; they are the basics of a good town.",
    model:
      'The writer uses anaphora to make the demands sound modest yet firm. Repeating "We ask for" three times creates a steady rhythm, so each request feels like part of one reasonable list. The opening, "We do not ask for much," frames everything that follows as small and fair. The final antithesis, "These are not luxuries; they are the basics," makes refusing the requests seem unreasonable.',
  },
  {
    task: "Write a paragraph that analyzes how the speaker tries to persuade the audience. Name a choice the speaker makes, quote it, and explain its effect.",
    source:
      "Doctors, nurses and every major health agency agree: helmets cut the risk of serious head injury by more than half. I am not asking you to trust me. I am asking you to trust them.",
    model:
      'The speaker persuades by borrowing the credibility of experts rather than claiming her own. She lists "Doctors, nurses and every major health agency," so the claim rests on a wide and trusted group. The statistic "by more than half" adds logos to that ethos. Her modest line, "I am not asking you to trust me," makes her seem honest, which makes the audience more willing to listen.',
  },
  {
    task: "Write a paragraph that analyzes how the writer tries to persuade the reader. Name a choice the writer makes, quote it, and explain its effect.",
    source:
      "Some say a four-day school week would leave children with nothing to do. But in towns that tried it, attendance rose and teachers stayed longer in their jobs. The fifth day became a day for family, sports and rest.",
    model:
      'The writer persuades by raising a counterclaim and answering it with evidence. Beginning with "Some say" shows the writer has considered the other side, which makes the argument seem fair. The word "But" then turns to results from real towns, where "attendance rose and teachers stayed longer." Replacing the fear of "nothing to do" with "family, sports and rest" reframes the free day as a benefit rather than a problem.',
  },
  {
    task: "Write a paragraph that analyzes how the speaker tries to persuade the audience. Name a choice the speaker makes, quote it, and explain its effect.",
    source:
      "Our grandparents built this hall with their own hands. They carried every brick up that hill. Will we be the generation that lets it fall?",
    model:
      'The speaker appeals to the audience\'s sense of duty to the past. Details such as "with their own hands" and "carried every brick up that hill" make the hall a symbol of the grandparents\' sacrifice. The rhetorical question "Will we be the generation that lets it fall?" casts inaction as a betrayal. Listeners are pushed to save the hall not for its own sake but to honor their families.',
  },
  {
    task: "Write a paragraph that analyzes how the writer tries to persuade the reader. Name a choice the writer makes, quote it, and explain its effect.",
    source:
      "A bus pass costs a student forty dollars a month. A tank of gas costs more than that in a week. Free bus passes for students would save families money and take cars off the road at the busiest hour.",
    model:
      'The writer persuades through a simple cost comparison that any family can follow. Setting "forty dollars a month" against a tank of gas that "costs more than that in a week" makes the bus seem obviously cheaper. The plain, numerical style suggests the writer is reasoning rather than selling. By adding that passes would "take cars off the road at the busiest hour," the writer gives a second benefit for readers who are not parents.',
  },
  ...rhetoricalAnalysisMore,
];

/** synthesisBank asks for a paragraph that brings two sources together in support of one claim. */
const synthesisBank: readonly WritingItem[] = [
  {
    task: "Using both sources, write a paragraph that supports a claim about whether cities should plant more trees. Use evidence from each source and explain how they work together.",
    source:
      "Source A: A city study found that streets with trees were up to five degrees cooler in summer. Source B: A survey of shop owners found that customers spent more time on tree-lined streets.",
    model:
      'Cities should plant more trees, because trees improve both comfort and business. Source A shows that tree-lined streets were "up to five degrees cooler in summer," which makes them more pleasant to walk. Source B adds that customers "spent more time on tree-lined streets." Together, the sources suggest a link: cooler streets invite people to linger, and lingering shoppers help local businesses.',
  },
  {
    task: "Using both sources, write a paragraph that supports a claim about whether schools should start later. Use evidence from each source and explain how they work together.",
    source:
      "Source A: Sleep researchers report that teenagers' bodies naturally fall asleep later than adults'. Source B: After one district moved its start time an hour later, car crashes involving teen drivers fell.",
    model:
      'Schools should start later because teenagers\' biology makes early mornings unsafe. According to Source A, teenagers\' bodies "naturally fall asleep later than adults\'," so an early start cuts their sleep short. Source B shows what happens when schools adjust: crashes involving teen drivers "fell" after a later start. Source A explains the cause, and Source B shows the benefit of addressing it.',
  },
  {
    task: "Using both sources, write a paragraph that supports a claim about whether students should learn a second language. Use evidence from each source and explain how they work together.",
    source:
      "Source A: A report on employers found that workers who speak two languages are offered more jobs. Source B: Brain scientists found that bilingual children are better at switching between tasks.",
    model:
      'Learning a second language benefits students both now and later. Source B finds that bilingual children are "better at switching between tasks," a skill that helps in every subject at school. Source A shows a later reward: workers with two languages "are offered more jobs." Read together, the sources suggest that the same mental flexibility that helps a child in class may help an adult at work.',
  },
  {
    task: "Using both sources, write a paragraph that supports a claim about whether towns should build bike lanes. Use evidence from each source and explain how they work together.",
    source:
      "Source A: A traffic report found that the number of cyclists doubled on streets after protected lanes were added. Source B: A health agency reports that adults who cycle to work have lower rates of heart disease.",
    model:
      'Towns should build protected bike lanes because they get people cycling, and cycling makes people healthier. Source A shows that the number of cyclists "doubled" once protected lanes were added, so the lanes clearly change behavior. Source B shows why that change matters: adults who cycle to work "have lower rates of heart disease." One source shows the lanes work; the other shows what they are worth.',
  },
  {
    task: "Using both sources, write a paragraph that supports a claim about whether families should limit screen time before bed. Use evidence from each source and explain how they work together.",
    source:
      "Source A: Researchers found that the light from screens delays the body's release of a sleep hormone. Source B: A school survey found that students who used phones in bed were more often tired in morning classes.",
    model:
      'Families should limit screens before bed because screens disturb sleep and the next day suffers. Source A explains the cause: screen light "delays the body\'s release of a sleep hormone." Source B shows the effect in real classrooms, where students who used phones in bed were "more often tired in morning classes." The lab finding and the survey point to the same conclusion from two directions.',
  },
  {
    task: "Using both sources, write a paragraph that supports a claim about whether schools should have gardens. Use evidence from each source and explain how they work together.",
    source:
      "Source A: Teachers at a school with a garden reported that students scored higher on science tests. Source B: A nutrition study found that children who grow vegetables are more likely to eat them.",
    model:
      'School gardens are worth the space because they teach both science and healthy eating. Source A reports higher science scores at a school with a garden, which suggests that hands-on growing makes lessons stick. Source B shows a second benefit: children who grow vegetables "are more likely to eat them." Together, the sources show that a garden is a classroom for the mind and the body at once.',
  },
  {
    task: "Using both sources, write a paragraph that supports a claim about whether libraries should stay open longer. Use evidence from each source and explain how they work together.",
    source:
      "Source A: A library that added evening hours saw its number of visitors rise by a third. Source B: A survey found that many working adults cannot visit the library before six o'clock.",
    model:
      'Libraries should stay open in the evening so that working adults can use them. Source B explains the problem: many working adults "cannot visit the library before six o\'clock." Source A shows that solving it works, since visitors rose "by a third" after evening hours were added. The survey reveals the need, and the library\'s results prove that meeting it brings people in.',
  },
  {
    task: "Using both sources, write a paragraph that supports a claim about whether students should do community service. Use evidence from each source and explain how they work together.",
    source:
      "Source A: A study of teenagers found that volunteers felt more connected to their communities. Source B: College admissions officers say they value applicants who have served others.",
    model:
      'Community service helps students grow and opens doors for their future. Source A finds that teenage volunteers "felt more connected to their communities," a sense of belonging that supports their well-being. Source B shows that this service is also noticed, since admissions officers "value applicants who have served others." The sources together show that service rewards students in the present and later on.',
  },
  ...synthesisMore,
];

/** rhetoricTopics are the topics of rhetoric, literature and composition for grades 9 to 12. */
export const rhetoricTopics: readonly TopicDef[] = [
  {
    id: "rhetorical-situation",
    title: t("The Rhetorical Situation", "修辞情境"),
    summary: t(
      "Who is speaking, to whom, and for what purpose: the facts that shape every persuasive choice.",
      "谁在说、对谁说、为了什么目的：决定每一个说服选择的基本因素。",
    ),
    prerequisites: ["authors-purpose", "claims"],
    encompasses: [{ topic: "authors-purpose", weight: 0.3 }],
    xp: 12,
    knowledgePoints: [
      point(
        "finding-the-audience",
        t("Finding the Audience", "找出听众"),
        t(
          "Every text is written for someone. The **audience** is the group the writer or speaker is trying to reach, and clues in the words tell you who they are: how they are addressed (*Fellow players*, *Members of the council*), what they are assumed to care about, and what they are asked to do.\n\nThe audience is not always everyone who might hear the words. A speech about a crossing guard may mention children, but if it asks for votes or money, it is aimed at the adults who can give them.",
          "每篇文本都是写给某些人的。**听众**（audience）是作者或演讲者想要打动的群体，文字中的线索会告诉你他们是谁：怎样称呼他们（*Fellow players*、*Members of the council*）、假定他们关心什么，以及要求他们做什么。\n\n听众并不总是所有可能听到这些话的人。一篇关于交通协管员的演讲可能会提到孩子，但如果它要求的是投票或捐款，它针对的就是能够投票或捐款的成年人。",
        ),
        pick(
          ["Who is the intended audience?", "目标听众是谁？"],
          audienceBank,
          (right) => `The audience is *${right}*: the way the speaker addresses them and what they are asked to do point to this group.`,
          (right) => `听众是 *${right}*：说话者对他们的称呼以及要求他们做的事都指向这个群体。`,
          (wrong) => [
            `*${wrong}* may be mentioned or affected, but the speaker is not addressing them or asking them to act.`,
            `*${wrong}* 也许被提到或受到影响，但说话者并不是在对他们说话，也没有要求他们行动。`,
          ],
        ),
      ),
      point(
        "naming-the-purpose",
        t("Naming the Purpose", "说出目的"),
        t(
          "A writer's **purpose** is what the text is meant to do. Most texts aim mainly to **inform** (explain or report), to **persuade** (change what the reader thinks or does), or to **entertain** (give pleasure through a story or humor). A text may do more than one, but its main purpose shows in what it finally asks of the reader.\n\nA pamphlet full of facts that ends with *Call for help at once* informs so that readers can act. An editorial full of facts that ends with *Vote for her* persuades.",
          "作者的**目的**（purpose）是文本想要达到的作用。大多数文本主要是为了**告知**（解释或报道）、**说服**（改变读者的想法或行动）或**娱乐**（通过故事或幽默带来乐趣）。一篇文本可能不止一个目的，但它的主要目的体现在它最终对读者的要求上。\n\n一份满是事实、最后写着 *Call for help at once* 的小册子，是为了告知读者以便他们行动。一篇满是事实、最后写着 *Vote for her* 的社论，则是为了说服。",
        ),
        pick(
          ["What is the main purpose of this text?", "这篇文本的主要目的是什么？"],
          purposeBank,
          (right) => `The main purpose is *${right}*: that is what the text finally asks of its readers.`,
          (right) => `主要目的是 *${right}*：这正是文本最终对读者的要求。`,
          (wrong) => [
            `*${wrong}* does not match what the text finally asks of its readers. Look at its last move: does it report, urge or amuse?`,
            `*${wrong}* 与文本最终对读者的要求不符。看看它最后做了什么：是在报道、劝说，还是逗乐？`,
          ],
        ),
      ),
    ],
  },
  {
    id: "rhetorical-appeals",
    title: t("Ethos, Pathos and Logos", "人格、情感与理性诉求"),
    summary: t(
      "The three ways an argument persuades: through the speaker's credibility, the audience's feelings, and reason.",
      "论证说服人的三种方式：借助说话者的可信度、听众的情感，以及理性。",
    ),
    prerequisites: ["rhetorical-situation", "reasoning"],
    encompasses: [
      { topic: "reasoning", weight: 0.2 },
      { topic: "rhetorical-situation", weight: 0.2 },
    ],
    xp: 16,
    knowledgePoints: [
      point(
        "naming-the-appeal",
        t("Naming the Appeal", "辨别诉求"),
        t(
          "Since ancient Greece, persuasion has been described in three appeals. **Ethos** appeals to credibility: *As a doctor for thirty years...* **Pathos** appeals to emotion: *Picture a child alone in the cold...* **Logos** appeals to reason: facts, statistics and logical steps.\n\nStrong arguments usually blend all three, but a single sentence often leans on one. Ask what the sentence wants you to trust: the speaker, your feelings, or the facts.",
          "自古希腊以来，说服就被归纳为三种诉求。**人格诉求**（ethos）诉诸可信度：*As a doctor for thirty years...* **情感诉求**（pathos）诉诸情感：*Picture a child alone in the cold...* **理性诉求**（logos）诉诸理性：事实、统计数据和逻辑推理。\n\n有力的论证通常三者兼用，但一个句子往往侧重其中之一。问问这个句子想让你相信什么：说话者、你的感受，还是事实。",
        ),
        named(["Which appeal does this sentence mainly use?", "这个句子主要运用了哪种诉求？"], appealBank, appealWhy, appealNot),
      ),
      appealStep,
    ],
  },
  {
    id: "rhetorical-devices",
    title: t("Rhetorical Devices", "修辞手法"),
    summary: t(
      "Anaphora, antithesis and the rhetorical question: patterns of language that make a point hard to forget.",
      "首语重复、对照和反问：让观点令人难忘的语言模式。",
    ),
    prerequisites: ["rhetorical-appeals", "parallel-structure"],
    encompasses: [{ topic: "parallel-structure", weight: 0.2 }],
    xp: 16,
    knowledgePoints: [
      point(
        "naming-the-device",
        t("Naming the Device", "辨别手法"),
        t(
          "Speakers shape their sentences so that listeners remember them. **Anaphora** repeats the opening words of several sentences or clauses: *We shall not tire. We shall not falter.* **Antithesis** sets opposite ideas side by side in balanced form: *Speech is silver, but silence is gold.* A **rhetorical question** is asked not for an answer but for effect, because the answer seems obvious: *Who has never needed a second chance?*",
          "演讲者精心组织句子，让听众记住它们。**首语重复**（anaphora）重复几个句子或分句开头的词：*We shall not tire. We shall not falter.* **对照**（antithesis）以平衡的形式把相反的意思并列：*Speech is silver, but silence is gold.* **反问**（rhetorical question）不是为了得到回答，而是为了效果，因为答案似乎显而易见：*Who has never needed a second chance?*",
        ),
        named(["Which rhetorical device is used here?", "这里运用了哪种修辞手法？"], deviceBank, deviceWhy, deviceNot),
      ),
      deviceStep,
    ],
  },
  {
    id: "logical-fallacies",
    title: t("Logical Fallacies", "逻辑谬误"),
    summary: t(
      "Six common flaws in reasoning: ad hominem, straw man, false dilemma, slippery slope, hasty generalization and bandwagon.",
      "六种常见的推理缺陷：人身攻击、稻草人、非此即彼、滑坡、以偏概全和从众。",
    ),
    prerequisites: ["rhetorical-appeals"],
    encompasses: [{ topic: "reasoning", weight: 0.2 }],
    xp: 18,
    knowledgePoints: [
      point(
        "naming-the-fallacy",
        t("Naming the Fallacy", "辨别谬误"),
        t(
          "A **fallacy** is an argument that seems convincing but rests on bad reasoning.\n\n- **Ad hominem** attacks the person, not the argument.\n- **Straw man** twists the other side's view into a weaker one.\n- **False dilemma** offers only two choices when there are more.\n- **Slippery slope** claims one step will lead to a chain of extreme results.\n- **Hasty generalization** draws a broad conclusion from too few cases.\n- **Bandwagon** claims something is right because many people do it.\n\nNaming a fallacy is only the start: the point is to see what the argument fails to prove.",
          "**谬误**（fallacy）是看似有说服力、实则推理有误的论证。\n\n- **人身攻击**（ad hominem）攻击人，而不是论点。\n- **稻草人**（straw man）把对方的观点歪曲成更弱的样子。\n- **非此即彼**（false dilemma）在有更多选择时只给出两个。\n- **滑坡**（slippery slope）断言一步会引发一连串极端后果。\n- **以偏概全**（hasty generalization）根据太少的例子得出宽泛的结论。\n- **从众**（bandwagon）以很多人这样做为由断定某事正确。\n\n说出谬误的名字只是开始：关键是看清这个论证没能证明什么。",
        ),
        named(["Which fallacy does this argument commit?", "这个论证犯了哪种谬误？"], fallacyBank, fallacyWhy, fallacyNot),
      ),
      repairStep,
    ],
  },
  {
    id: "evaluating-sources",
    title: t("Evaluating Sources", "评估来源"),
    summary: t(
      "Judge a source by who made it, what they know, what they gain, and how current it is.",
      "根据作者是谁、他们懂什么、他们能得到什么以及来源是否新近来判断来源。",
    ),
    prerequisites: ["evidence"],
    encompasses: [{ topic: "evidence", weight: 0.2 }],
    xp: 16,
    knowledgePoints: [
      point(
        "the-credible-source",
        t("The Credible Source", "可信的来源"),
        t(
          "Evidence is only as strong as its source. Before you use one, ask four questions. **Who** made it, and are they named? **What do they know**: are they experts, or do they rely on records? **What do they gain**: is someone selling a product or pushing a cause? **When** was it made: is it current enough for the question?\n\nA study by researchers, official records, and reports that show their sources usually pass. Advertisements, anonymous posts and stories based loosely on facts usually do not.",
          "证据的力量取决于它的来源。使用之前，先问四个问题。**谁**做的，他们有没有署名？**他们懂什么**：他们是专家，还是依据记录？**他们能得到什么**：是否有人在推销产品或推动某个主张？**什么时候**做的：对这个问题来说是否足够新？\n\n研究者的研究、官方记录以及注明来源的报告通常可信。广告、匿名帖子和仅仅松散地依据事实改编的故事通常不可信。",
        ),
        pick(
          ["Read the situation and choose the most credible source.", "阅读情境，选出最可信的来源。"],
          sourceBank,
          (right) =>
            `*${right}* is made by people who know the subject, gain nothing from the answer, and can show where their facts come from.`,
          (right) => `*${right}* 由懂这个领域的人制作，他们不会因答案而获利，并且能说明事实的出处。`,
          (wrong) => [
            `*${wrong}* fails at least one test: its maker is unnamed, has something to gain, lacks expertise, or is out of date.`,
            `*${wrong}* 至少有一项不合格：作者没有署名、能从中获利、缺乏专业知识，或者内容已过时。`,
          ],
        ),
      ),
      sourceWeaknessStep,
    ],
  },
  {
    id: "characterization",
    title: t("Characterization", "人物塑造"),
    summary: t(
      "Direct characterization tells what a character is like; indirect characterization shows it through speech, action and thought.",
      "直接塑造说出人物的特点；间接塑造通过言语、行动和想法来展示。",
    ),
    prerequisites: ["narrative-point-of-view", "characters"],
    encompasses: [{ topic: "characters", weight: 0.2 }],
    xp: 14,
    knowledgePoints: [
      point(
        "telling-or-showing",
        t("Telling or Showing", "直接说出还是间接展示"),
        t(
          "Writers reveal characters in two ways. **Direct characterization** tells the reader outright: *Mr. Hale was the meanest man in the village.* **Indirect characterization** shows the trait and lets the reader infer it, through what a character says, does, thinks or looks like, and how others react: *Mr. Hale kicked the stray cat out of his way.*\n\nIf the sentence names the trait with an adjective such as *mean*, *kind* or *brave*, it is direct. A sentence that only describes a place or events, and reveals no character, is neither.",
          "作者用两种方式展现人物。**直接塑造**（direct characterization）直接告诉读者：*Mr. Hale was the meanest man in the village.* **间接塑造**（indirect characterization）展示人物特点，让读者自己推断：通过人物的言语、行动、想法或外貌，以及别人的反应：*Mr. Hale kicked the stray cat out of his way.*\n\n如果句子用 *mean*、*kind*、*brave* 这样的形容词直接说出特点，就是直接塑造。只描写地点或事件、没有展现人物的句子，两者都不是。",
        ),
        pick(
          ["Is this direct or indirect characterization, or neither?", "这是直接塑造、间接塑造，还是两者都不是？"],
          characterizationBank,
          (right) =>
            right === "direct"
              ? "It is **direct**: the sentence names the character's trait outright."
              : right === "indirect"
                ? "It is **indirect**: the sentence shows the trait through words or actions, and the reader infers it."
                : "It is **neither**: the sentence describes a place, a time or events, and reveals no trait of any character.",
          (right) =>
            right === "direct"
              ? "这是**直接塑造**：句子直接说出了人物的特点。"
              : right === "indirect"
                ? "这是**间接塑造**：句子通过言语或行动展示特点，由读者推断。"
                : "**两者都不是**：句子描写的是地点、时间或事件，没有展现任何人物的特点。",
          (wrong) =>
            wrong === "direct"
              ? [
                  "No word here names the trait; the reader has to infer it from what the character says or does.",
                  "这里没有词直接说出特点；读者要从人物的言行中推断。",
                ]
              : wrong === "indirect"
                ? [
                    "The sentence names the trait with a describing word, so nothing is left to infer.",
                    "句子用描述词直接说出了特点，所以没有什么需要推断。",
                  ]
                : [
                    "A character is revealed here, either by a word naming a trait or by speech or actions that show one.",
                    "这里展现了人物：要么用词直接说出了特点，要么通过言行展示了特点。",
                  ],
        ),
      ),
      traitStep,
    ],
  },
  {
    id: "allusion",
    title: t("Allusion", "典故"),
    summary: t(
      "A brief reference to a well-known story, person or event that brings its meaning along.",
      "简短地提及广为人知的故事、人物或事件，从而带入它的含义。",
    ),
    prerequisites: ["symbolism"],
    encompasses: [],
    xp: 14,
    knowledgePoints: [
      point(
        "what-the-allusion-adds",
        t("What the Allusion Adds", "典故带来的含义"),
        t(
          "An **allusion** mentions a famous story, person or event without explaining it, and trusts the reader to bring its meaning. *Opening Pandora's box* recalls the Greek myth of a box that released the world's troubles, so it means starting something that leads to many problems. *David and Goliath* recalls a small fighter who beat a giant.\n\nTo read an allusion, recall the original story, then ask which part of it fits the new situation.",
          "**典故**（allusion）提到一个著名的故事、人物或事件却不加解释，相信读者能带入它的含义。*Opening Pandora's box* 让人想起希腊神话中放出世间灾祸的盒子，所以它指开始一件会引出许多麻烦的事。*David and Goliath* 让人想起打败巨人的弱小战士。\n\n解读典故时，先回想原来的故事，再问问它的哪一部分与新的情境相符。",
        ),
        pick(
          ["What does the allusion suggest?", "这个典故暗示了什么？"],
          allusionBank,
          (right) => `${right} The original story gives the sentence this meaning.`,
          (right) => `${right} 原来的故事赋予了这个句子这层含义。`,
          (wrong) => [
            `${wrong} This reads the words literally or misses what the original story is about.`,
            `${wrong} 这是按字面理解，或者没有理解原来的故事讲的是什么。`,
          ],
        ),
      ),
      allusionChoiceStep,
    ],
  },
  {
    id: "paradox-and-oxymoron",
    title: t("Paradox and Oxymoron", "悖论与矛盾修饰"),
    summary: t(
      "Contradictions that reveal a truth: in two words, or in a whole statement.",
      "揭示道理的矛盾：在两个词里，或在整个陈述里。",
    ),
    prerequisites: ["personification-and-hyperbole"],
    encompasses: [],
    xp: 14,
    knowledgePoints: [
      point(
        "contradictions-that-mean",
        t("Contradictions That Mean Something", "有意义的矛盾"),
        t(
          "An **oxymoron** joins two words that seem to clash: *deafening silence*, *bittersweet*, *clever foolishness*. A **paradox** is a whole statement that seems to contradict itself but holds a truth: *The more you learn, the more you realize how little you know.*\n\nBoth make the reader stop and think. To tell them apart, look at the size of the contradiction: two words side by side, or an entire idea. A plain contrast, such as *hot by day and cold by night*, is neither: the two halves never contradict each other.",
          "**矛盾修饰**（oxymoron）把两个看似冲突的词放在一起：*deafening silence*、*bittersweet*、*clever foolishness*。**悖论**（paradox）是看似自相矛盾、却包含道理的整个陈述：*The more you learn, the more you realize how little you know.*\n\n两者都让读者停下来思考。要区分它们，就看矛盾的范围：是并列的两个词，还是整个意思。普通的对比，比如 *hot by day and cold by night*，两者都不是：两半之间并不矛盾。",
        ),
        named(["Is this a paradox, an oxymoron, or neither?", "这是悖论、矛盾修饰，还是两者都不是？"], paradoxBank, paradoxWhy, paradoxNot),
      ),
      contradictionStep,
    ],
  },
  {
    id: "writing-a-rhetorical-analysis",
    title: t("Writing a Rhetorical Analysis", "写修辞分析"),
    summary: t(
      "Explain how a passage persuades: name a choice its writer made, quote it, and explain its effect on the audience.",
      "解释一段文字怎样说服人：指出作者的一个选择，引用原文，并解释它对听众的作用。",
    ),
    prerequisites: ["rhetorical-devices", "writing-a-literary-analysis-paragraph"],
    encompasses: [
      { topic: "rhetorical-appeals", weight: 0.3 },
      { topic: "rhetorical-devices", weight: 0.3 },
      { topic: "writing-a-literary-analysis-paragraph", weight: 0.2 },
    ],
    xp: 22,
    criteria: ["w5-names-rhetorical-choice", "w5-uses-source", "w5-explains-effect"].map(criterion),
    knowledgePoints: [
      point(
        "choice-quote-effect",
        t("Choice, Quotation, Effect", "选择、引用、作用"),
        t(
          "A rhetorical analysis does not argue for or against the passage; it explains how the passage works. Open by naming a **choice** the writer made: an appeal, a device, a comparison, a word. **Quote** the words where the choice appears. Then explain its **effect**: what does it make the audience feel, believe or want to do, and why does that help the writer's purpose?\n\n*The speaker uses statistics* only names a tool. *The statistics make the cost seem small, so refusing seems unreasonable* explains how it persuades.",
          "修辞分析不是赞成或反对这段文字，而是解释它怎样起作用。开头指出作者做出的一个**选择**：一种诉求、一种手法、一个对比、一个词。**引用**体现这个选择的原话。然后解释它的**作用**：它让听众感受到、相信或想做什么？为什么这有助于作者的目的？\n\n*The speaker uses statistics* 只是说出了一种手段。*The statistics make the cost seem small, so refusing seems unreasonable* 才解释了它怎样说服人。",
        ),
        writingGenerator(
          t(
            "Read the passage, then write a paragraph in English: name a persuasive choice, quote it, and explain its effect on the audience.",
            "阅读文段，然后用英语写一个段落：指出一个说服性的选择，引用原文，并解释它对听众的作用。",
          ),
          rhetoricalAnalysisBank,
          ["w5-names-rhetorical-choice", "w5-uses-source", "w5-explains-effect"],
          { minWords: 50, maxChars: 2000 },
          (model) => t(`One good paragraph:\n\n> ${model}`, `一个好的段落：\n\n> ${model}`),
        ),
      ),
    ],
  },
  {
    id: "synthesizing-sources",
    title: t("Synthesizing Sources", "综合多个来源"),
    summary: t(
      "Bring two sources together in support of one claim, and show how they connect.",
      "把两个来源结合起来支持同一个论点，并说明它们之间的联系。",
    ),
    prerequisites: ["evaluating-sources", "writing-an-evidence-paragraph"],
    encompasses: [
      { topic: "writing-an-evidence-paragraph", weight: 0.3 },
      { topic: "evaluating-sources", weight: 0.2 },
    ],
    xp: 22,
    criteria: ["w4-topic-sentence", "w5-uses-both-sources", "w5-connects-sources"].map(criterion),
    knowledgePoints: [
      point(
        "two-sources-one-claim",
        t("Two Sources, One Claim", "两个来源，一个论点"),
        t(
          "To **synthesize** is to combine sources into one argument rather than summarizing them one after another. Open with your claim. Use evidence from each source, saying which is which (*Source A shows...*, *According to Source B...*). Then show how they **connect**: does one explain a cause and the other its effect? Does one show a need and the other a solution? Do they reach the same point from different directions?\n\nThe connecting sentence is what makes it synthesis. Without it, the paragraph is two summaries side by side.",
          "**综合**（synthesize）是把多个来源融合为一个论证，而不是一个接一个地概括它们。开头提出你的论点。使用每个来源中的论据，并说明出自哪个来源（*Source A shows...*、*According to Source B...*）。然后说明它们怎样**联系**：一个解释原因、另一个说明结果？一个揭示需要、另一个提供办法？它们是否从不同方向得出同一结论？\n\n起联系作用的句子才使之成为综合。没有它，段落只是两段并排的概括。",
        ),
        writingGenerator(
          t(
            "Read both sources, then write a paragraph in English: a claim, evidence from each source, and an explanation of how the sources work together.",
            "阅读两个来源，然后用英语写一个段落：论点、每个来源中的论据，以及两个来源如何相互配合的解释。",
          ),
          synthesisBank,
          ["w4-topic-sentence", "w5-uses-both-sources", "w5-connects-sources"],
          { minWords: 55, maxChars: 2000 },
          (model) => t(`One good paragraph:\n\n> ${model}`, `一个好的段落：\n\n> ${model}`),
        ),
      ),
    ],
  },
];
