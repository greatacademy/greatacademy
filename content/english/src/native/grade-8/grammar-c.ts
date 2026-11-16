// Grade 8: a third knowledge point for each grammar topic of the grade, most of them applying the rule in editing.

import type { KnowledgePointDef } from "@ga/content";
import { choose, type Label, label } from "../grade-6/kit.ts";

const join = (lines: readonly string[]) => lines.join("\n");

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

const afterVerb = choose(
  "gerund-or-infinitive-after-a-verb",
  ["Gerund or Infinitive After a Verb", "动词后用动名词还是不定式"],
  [
    "Some verbs take a **gerund** as their object: *enjoy*, *finish*, *avoid*, *keep*, *mind*, *practice*, *suggest*: *She enjoys **swimming***. Others take an **infinitive**: *decide*, *hope*, *plan*, *want*, *agree*, *refuse*, *promise*: *We decided **to leave***. The bare verb fits neither.",
    "有些动词以**动名词**作宾语：*enjoy*、*finish*、*avoid*、*keep*、*mind*、*practice*、*suggest*：*She enjoys **swimming***。另一些以**不定式**作宾语：*decide*、*hope*、*plan*、*want*、*agree*、*refuse*、*promise*：*We decided **to leave***。动词原形两种都不适用。",
  ],
  ["Which verbal completes the sentence?", "哪个非谓语形式能补全句子？"],
  `
  She enjoys ___ in the lake.|swimming|to swim|swim
  We decided ___ early.|to leave|leaving|leave
  He finished ___ the fence before dark.|painting|to paint|paint
  They hope ___ the finals this year.|to reach|reaching|reach
  Please avoid ___ on the wet floor.|running|to run|run
  She refused ___ the old rules.|to follow|following|follow
  I don't mind ___ for a few minutes.|waiting|to wait|wait
  The band plans ___ a new album.|to record|recording|record
  He keeps ___ the same mistake.|making|to make|make
  We agreed ___ the costs.|to share|sharing|share
  He enjoys ___ old movies.|watching|to watch|watch
  She decided ___ a new bike.|to buy|buying|buy
  They finished ___ the walls at noon.|painting|to paint|paint
  We hope ___ you soon.|to see|seeing|see
  I avoid ___ on icy roads.|driving|to drive|drive
  He promised ___ on time.|to arrive|arriving|arrive
  She keeps ___ about the trip.|talking|to talk|talk
  We plan ___ the museum on Sunday.|to visit|visiting|visit
  They practiced ___ the song all week.|singing|to sing|sing
  I want ___ how to fly a kite.|to learn|learning|learn
  He suggested ___ a break.|taking|to take|take
  She agreed ___ us with the project.|to help|helping|help
  We missed ___ the sunrise.|seeing|to see|see
  They refused ___ the old rules.|to follow|following|follow
  I don't mind ___ the dishes.|washing|to wash|wash
  He learned ___ at age five.|to read|reading|read
  She gave up ___ sweets for a month.|eating|to eat|eat
  We expect ___ by ten.|to finish|finishing|finish
  They considered ___ to a bigger house.|moving|to move|move
  I need ___ more water.|to drink|drinking|drink
  `,
  (right, shown) => [
    `"${shown.replace("___", right)}": this verb takes ${right.startsWith("to ") ? "an infinitive" : "a gerund"} as its object.`,
    `“${shown.replace("___", right)}”：这个动词以${right.startsWith("to ") ? "不定式" : "动名词"}作宾语。`,
  ],
  [
    ["*{wrong}* is the other verbal, which this verb does not take.", "*{wrong}* 是另一种非谓语形式，这个动词不接它。"],
    ["*{wrong}* is the bare verb, which cannot be the object here.", "*{wrong}* 是动词原形，在这里不能作宾语。"],
  ],
);

const gerundJob = choose(
  "the-job-of-the-gerund",
  ["The Job of the Gerund", "动名词的作用"],
  [
    "A gerund is a verb used as a **noun**, so it does a noun's jobs. It can be the **subject**: ***Swimming** keeps me fit*. It can be the **object** of a verb: *I love **swimming***. It can be the **object of a preposition**: *She is good at **swimming***. Find the gerund, then ask what it is doing in the sentence.",
    "动名词是当作**名词**用的动词，所以它承担名词的作用。它可以作**主语**：***Swimming** keeps me fit*。可以作动词的**宾语**：*I love **swimming***。也可以作**介词的宾语**：*She is good at **swimming***。先找出动名词，再问它在句子里起什么作用。",
  ],
  ["What job does the gerund do in this sentence?", "这个动名词在句子中起什么作用？"],
  `
  Swimming keeps me fit.|subject|object of a verb|object of a preposition
  I love swimming in the sea.|object of a verb|subject|object of a preposition
  She is good at drawing faces.|object of a preposition|subject|object of a verb
  Reading before bed helps me sleep.|subject|object of a verb|object of a preposition
  He quit playing the drums.|object of a verb|subject|object of a preposition
  They talked about moving to Spain.|object of a preposition|subject|object of a verb
  Cooking for ten people takes time.|subject|object of a verb|object of a preposition
  We enjoyed hiking in the hills.|object of a verb|subject|object of a preposition
  Thank you for helping me.|object of a preposition|subject|object of a verb
  Winning the cup was a dream.|subject|object of a verb|object of a preposition
  Running is my favorite sport.|subject|object of a verb|object of a preposition
  I enjoy running in the park.|object of a verb|subject|object of a preposition
  She is tired of running every day.|object of a preposition|subject|object of a verb
  Dancing makes her happy.|subject|object of a verb|object of a preposition
  He hates waiting in line.|object of a verb|subject|object of a preposition
  We talked about moving to the coast.|object of a preposition|subject|object of a verb
  Cooking dinner takes an hour.|subject|object of a verb|object of a preposition
  They finished painting the shed.|object of a verb|subject|object of a preposition
  Writing letters is a lost art.|subject|object of a verb|object of a preposition
  My dog loves chasing balls.|object of a verb|subject|object of a preposition
  She left without saying goodbye.|object of a preposition|subject|object of a verb
  Gardening relaxes my grandmother.|subject|object of a verb|object of a preposition
  I started learning French last year.|object of a verb|subject|object of a preposition
  He is afraid of flying.|object of a preposition|subject|object of a verb
  Climbing that hill was hard.|subject|object of a verb|object of a preposition
  We avoided driving at night.|object of a verb|subject|object of a preposition
  She dreams of becoming a pilot.|object of a preposition|subject|object of a verb
  Skating on thin ice is dangerous.|subject|object of a verb|object of a preposition
  They kept laughing all night.|object of a verb|subject|object of a preposition
  We are excited about visiting the zoo.|object of a preposition|subject|object of a verb
  `,
  (right) => [
    `The gerund here is the **${right}**.`,
    `这里的动名词是**${right === "subject" ? "主语" : right === "object of a verb" ? "动词的宾语" : "介词的宾语"}**。`,
  ],
  [
    ["The gerund does a different job here: look at what comes right before it.", "这里的动名词起的是别的作用：看看它前面紧挨着的是什么。"],
    [
      "The gerund does yet another job here: is it before the verb, after a verb, or after a preposition?",
      "这里的动名词起的是另一种作用：它是在谓语动词前、在动词后，还是在介词后？",
    ],
  ],
);

const compoundComplex = label(
  "compound-complex-sentences",
  ["Compound-Complex Sentences", "并列复合句"],
  [
    "A **compound** sentence has two or more independent clauses: *The rain stopped, and we went out.* A **complex** sentence has one independent clause and at least one dependent clause: *When the rain stopped, we went out.* A **compound-complex** sentence has both: two independent clauses and at least one dependent clause: *When the rain stopped, we went out, and the sun appeared.*",
    "**并列句**有两个或更多独立分句：*The rain stopped, and we went out.* **复合句**有一个独立分句和至少一个从句：*When the rain stopped, we went out.* **并列复合句**两者都有：两个独立分句和至少一个从句：*When the rain stopped, we went out, and the sun appeared.*",
  ],
  ["What kind of sentence is this?", "这是什么类型的句子？"],
  join([
    ...[
      "When the rain stopped, we went out, and the sun appeared.",
      "I wanted to go, but I stayed because my brother was sick.",
      "Although the test was hard, Mia finished early, and she checked every answer.",
      "The dog barked when the bell rang, so we opened the door.",
      "Because the road was closed, we turned back, and we took the long way.",
      "She read the letter that her aunt had sent, and then she smiled.",
      "After the game ended, the fans cheered, and the players waved.",
      "We stayed inside while it snowed, but the kids wanted to play.",
      "The cake that Grandma baked was delicious, and everyone asked for more.",
      "If you finish early, you can read, or you can draw.",
    ].map((s) => `${s}|compound-complex`),
    ...[
      "The rain stopped, and we went out.",
      "I wanted to go, but I stayed home.",
      "Mia finished early; she checked every answer.",
      "The dog barked, so we opened the door.",
      "We turned back, and we took the long way.",
      "She read the letter, and then she smiled.",
      "The game ended, and the fans cheered.",
      "It snowed all day, but the kids wanted to play.",
      "Grandma baked a cake; everyone asked for more.",
      "You can read, or you can draw.",
    ].map((s) => `${s}|compound`),
    ...[
      "When the rain stopped, we went out.",
      "I stayed because my brother was sick.",
      "Although the test was hard, Mia finished early.",
      "The dog barked when the bell rang.",
      "Because the road was closed, we turned back.",
      "She read the letter that her aunt had sent.",
      "After the game ended, the fans cheered.",
      "We stayed inside while it snowed.",
      "The cake that Grandma baked was delicious.",
      "If you finish early, you can read.",
    ].map((s) => `${s}|complex`),
  ]),
  {
    "compound-complex": L(
      "并列复合句",
      "The sentence has two independent clauses and at least one dependent clause.",
      "这个句子有两个独立分句和至少一个从句。",
      "The sentence does not have both two independent clauses and a dependent clause.",
      "这个句子并不同时具有两个独立分句和一个从句。",
    ),
    compound: L(
      "并列句",
      "The sentence joins two independent clauses and has no dependent clause.",
      "这个句子连接了两个独立分句，没有从句。",
      "The sentence has a dependent clause, or only one independent clause.",
      "这个句子有从句，或者只有一个独立分句。",
    ),
    complex: L(
      "复合句",
      "The sentence has one independent clause and a dependent clause.",
      "这个句子有一个独立分句和一个从句。",
      "The sentence has more than one independent clause, or no dependent clause.",
      "这个句子有不止一个独立分句，或者没有从句。",
    ),
  },
);

const thatComma = choose(
  "no-comma-before-that",
  ["No Comma Before That", "that 前不加逗号"],
  [
    "A clause beginning with *that*, whether it is the object of a verb (*I know that you are right*) or an essential relative clause (*the book that I lost*), is joined to the sentence with **no comma**. A comma there splits a verb from its object or a noun from the clause that tells which one.",
    "以 *that* 开头的从句，无论是动词的宾语（*I know that you are right*），还是必要的关系从句（*the book that I lost*），都**不用逗号**与句子连接。在那里加逗号，会把动词和它的宾语，或名词和说明是哪一个的从句分开。",
  ],
  ["Which sentence is punctuated correctly?", "哪个句子的标点正确？"],
  join(
    [
      ["I know", "that you are right"],
      ["She said", "that the game was over"],
      ["The book", "that I lost was found", "The book"],
      ["We hope", "that it will not rain"],
      ["He forgot", "that the shop was closed"],
      ["The song", "that won the contest is catchy", "The song"],
      ["They agreed", "that the plan was fair"],
      ["The road", "that leads to the lake is steep", "The road"],
      ["Scientists found", "that the ice is melting"],
      ["The coat", "that I wanted was sold", "The coat"],
      ["We noticed", "that the door was open"],
      ["The house", "that we rented had a garden", "The house"],
      ["He explained", "that the bus was late"],
      ["The cake", "that she baked was delicious", "The cake"],
      ["I believe", "that honesty matters"],
      ["The dog", "that lives next door barks at night", "The dog"],
      ["They learned", "that the museum was free"],
      ["The bike", "that he fixed works again", "The bike"],
      ["She promised", "that she would call"],
      ["The letter", "that came today is for you", "The letter"],
      ["We discovered", "that the cave was deep"],
      ["The path", "that we chose was muddy", "The path"],
      ["My mom thinks", "that I should rest"],
      ["The plant", "that you gave me is growing", "The plant"],
      ["He admitted", "that he was wrong"],
      ["The movie", "that we watched was scary", "The movie"],
      ["The teacher announced", "that the test was moved"],
      ["The jacket", "that I borrowed was warm", "The jacket"],
      ["We heard", "that the bridge had reopened"],
      ["The game", "that they played lasted hours", "The game"],
    ].map(([a = "", b = ""]) => `${a} / ${b}|${a} ${b}.|${a}, ${b}.|${a} ${b.replace(/^that /u, "that, ")}.`),
  ),
  (right) => [`"${right}" joins the *that* clause with no comma.`, `“${right}”连接 *that* 从句时没有用逗号。`],
  [
    [
      '"{wrong}" puts a comma before *that*, splitting the sentence where it should hold together.',
      "“{wrong}”在 *that* 前加了逗号，把本应连在一起的地方分开了。",
    ],
    ['"{wrong}" puts a comma after *that*, inside the clause.', "“{wrong}”在 *that* 后面、从句内部加了逗号。"],
  ],
);

const wrongConjunction = choose(
  "fixing-the-wrong-conjunction",
  ["Fixing the Wrong Conjunction", "改正用错的连词"],
  [
    "A subordinating conjunction states how two ideas relate, so the wrong one says something false: *Because it was raining, we played outside* claims the rain was the reason. Read both clauses, decide the relation, contrast, cause, time or condition, and choose the conjunction that states it: ***Although** it was raining, we played outside*.",
    "从属连词说明两个意思之间的关系，所以用错了连词就会说出不符合事实的话：*Because it was raining, we played outside* 是说下雨是出去玩的原因。读一读两个分句，判断它们的关系是转折、因果、时间还是条件，再选出表达这种关系的连词：***Although** it was raining, we played outside*。",
  ],
  ["Which revision states the relation correctly?", "哪个修改正确地表达了两者的关系？"],
  `
  Because it was raining, we played outside.|Although it was raining, we played outside.|Since it was raining, we played outside.|Until it was raining, we played outside.
  Although she studied hard, she passed the test.|Because she studied hard, she passed the test.|Even though she studied hard, she passed the test.|Unless she studied hard, she passed the test.
  If the bell rang, the students left the room.|When the bell rang, the students left the room.|Unless the bell rang, the students left the room.|Although the bell rang, the students left the room.
  Since he was tired, he kept running.|Though he was tired, he kept running.|Because he was tired, he kept running.|Once he was tired, he kept running.
  Unless we leave now, we will catch the train.|If we leave now, we will catch the train.|Unless we leave soon, we will catch the train.|Although we leave now, we will catch the train.
  Even though the shop was closed, we went home.|Because the shop was closed, we went home.|Although the shop was closed, we went home.|Unless the shop was closed, we went home.
  Before the storm passed, we went outside.|After the storm passed, we went outside.|Until the storm passed, we went outside.|Although the storm passed, we went outside.
  Because the film was long, nobody left early.|Although the film was long, nobody left early.|Since the film was long, nobody left early.|Until the film was long, nobody left early.
  While you finish your homework, you cannot play.|Until you finish your homework, you cannot play.|As you finish your homework, you cannot play.|Because you finish your homework, you cannot play.
  Although the river flooded, the farmers moved their animals.|Because the river flooded, the farmers moved their animals.|Though the river flooded, the farmers moved their animals.|Unless the river flooded, the farmers moved their animals.
  Because the soup was cold, he ate it.|Although the soup was cold, he ate it.|Since the soup was cold, he ate it.|Until the soup was cold, he ate it.
  Although we left early, we arrived on time.|Because we left early, we arrived on time.|Though we left early, we arrived on time.|Unless we left early, we arrived on time.
  If the movie ended, everyone clapped.|When the movie ended, everyone clapped.|Unless the movie ended, everyone clapped.|Although the movie ended, everyone clapped.
  Since she was afraid, she climbed the ladder.|Though she was afraid, she climbed the ladder.|Because she was afraid, she climbed the ladder.|Once she was afraid, she climbed the ladder.
  Before the game ended, the fans went home.|After the game ended, the fans went home.|Until the game ended, the fans went home.|Although the game ended, the fans went home.
  Because the shop was crowded, we found a seat.|Although the shop was crowded, we found a seat.|Since the shop was crowded, we found a seat.|Until the shop was crowded, we found a seat.
  While you clean your room, you cannot go out.|Until you clean your room, you cannot go out.|As you clean your room, you cannot go out.|Because you clean your room, you cannot go out.
  Although the bridge was closed, we took the ferry.|Because the bridge was closed, we took the ferry.|Though the bridge was closed, we took the ferry.|Unless the bridge was closed, we took the ferry.
  Because he was hungry, he skipped lunch.|Although he was hungry, he skipped lunch.|Since he was hungry, he skipped lunch.|Until he was hungry, he skipped lunch.
  Although it was sunny, we wore sunscreen.|Because it was sunny, we wore sunscreen.|Even though it was sunny, we wore sunscreen.|Unless it was sunny, we wore sunscreen.
  If the lights went out, we lit candles last night.|When the lights went out, we lit candles last night.|Unless the lights went out, we lit candles last night.|Although the lights went out, we lit candles last night.
  Since the team lost, they kept smiling.|Though the team lost, they kept smiling.|Because the team lost, they kept smiling.|Once the team lost, they kept smiling.
  Before the paint dried, we hung the picture.|After the paint dried, we hung the picture.|Until the paint dried, we hung the picture.|Although the paint dried, we hung the picture.
  Because the hill was steep, the old man reached the top.|Although the hill was steep, the old man reached the top.|Since the hill was steep, the old man reached the top.|Until the hill was steep, the old man reached the top.
  While you return the book, you cannot borrow another.|Until you return the book, you cannot borrow another.|As you return the book, you cannot borrow another.|Because you return the book, you cannot borrow another.
  Although the baby was tired, she fell asleep quickly.|Because the baby was tired, she fell asleep quickly.|Though the baby was tired, she fell asleep quickly.|Unless the baby was tired, she fell asleep quickly.
  Because the water was freezing, they swam anyway.|Although the water was freezing, they swam anyway.|Since the water was freezing, they swam anyway.|Until the water was freezing, they swam anyway.
  Although the alarm rang, we left the building at once.|Because the alarm rang, we left the building at once.|Even though the alarm rang, we left the building at once.|Unless the alarm rang, we left the building at once.
  Before the guests ate, we washed their dirty plates.|After the guests ate, we washed their dirty plates.|Until the guests ate, we washed their dirty plates.|Although the guests ate, we washed their dirty plates.
  Since the price was high, she bought the coat.|Though the price was high, she bought the coat.|Because the price was high, she bought the coat.|Once the price was high, she bought the coat.
  `,
  (right) => [`"${right}" states the relation the two clauses actually have.`, `“${right}”表达了两个分句之间实际的关系。`],
  [
    ['"{wrong}" still states the wrong relation.', "“{wrong}”表达的关系仍然不对。"],
    ['"{wrong}" states another relation that does not fit either.', "“{wrong}”表达了另一种同样不符合的关系。"],
  ],
);

/** woven are quotations from invented sources, with a phrase from them that a writer weaves into a sentence. */
const woven = [
  ["Mayor Ortiz", "the city has never been stronger"],
  ["the coach", "a team that never gives up"],
  ["Dr. Lin", "the most important discovery of the decade"],
  ["the review", "a quiet and moving film"],
  ["the principal", "a school where every voice matters"],
  ["the captain", "the hardest season of my life"],
  ["the author", "a story about home and loss"],
  ["the report", "a slow but steady recovery"],
  ["the judge", "a fair and careful decision"],
  ["the guide", "the oldest bridge in the region"],
  ["Senator Ruiz", "a turning point for the state"],
  ["the critic", "a bold and beautiful album"],
  ["Professor Hale", "the clearest proof we have"],
  ["the newspaper", "a night the town will never forget"],
  ["the scientist", "a small step toward a cure"],
  ["Coach Rivera", "the best defense in the league"],
  ["the poet", "a city made of light"],
  ["the manager", "a simple plan that works"],
  ["Governor Kim", "a promise kept"],
  ["the historian", "the most famous battle of the war"],
  ["the chef", "a dish full of surprises"],
  ["the article", "a quiet revolution in farming"],
  ["Mayor Grant", "a park for everyone"],
  ["the referee", "a clean and fair match"],
  ["the director", "a film about courage"],
  ["the teacher", "a class that loves to read"],
  ["Dr. Patel", "a rare but treatable illness"],
  ["the magazine", "the trip of a lifetime"],
  ["the singer", "a song about my mother"],
  ["the explorer", "the coldest place on earth"],
] as const;

const wovenLines = join(
  woven.map(([who, phrase]) => {
    const verb = who.startsWith("the ") ? `${who[4]!.toUpperCase()}${who.slice(5)}` : who;
    const subject = who.startsWith("the ") ? `The ${who.slice(4)}` : verb;
    return `${subject} called it ___.|"${phrase}"|"... ${phrase} ..."|"... ${phrase}"`;
  }),
);

const noDots = choose(
  "no-dots-around-a-woven-phrase",
  ["No Dots Around a Woven Phrase", "嵌入的短语两端不加省略号"],
  [
    'When you weave a short phrase from a source into your own sentence, the reader already knows it is part of something longer, so **no ellipsis** goes at its start or end: *The mayor called it "the city\'s best year."* An ellipsis marks words left out **inside** a quotation, not the obvious fact that the quotation began and ended somewhere.',
    '把资料中的一个短语嵌入自己的句子时，读者已经知道它是更长内容的一部分，所以短语的开头和结尾**不加省略号**：*The mayor called it "the city\'s best year."* 省略号表示引文**内部**省去了词语，而不是表示引文前后还有内容这个显而易见的事实。',
  ],
  ["Which quotation completes the sentence?", "哪个引文能补全句子？"],
  wovenLines,
  (right) => [`${right} is woven into the sentence, so it needs no dots.`, `${right} 嵌入在句子中，所以不需要省略号。`],
  [
    [
      "{wrong} puts dots at both ends of a phrase that is plainly part of something longer.",
      "{wrong} 在一个显然是摘录的短语两端加了省略号。",
    ],
    ["{wrong} puts dots at the end of a phrase woven into the sentence.", "{wrong} 在嵌入句子的短语末尾加了省略号。"],
  ],
);

const wishPast = choose(
  "wishes-about-the-past",
  ["Wishes About the Past", "对过去的愿望"],
  [
    "A wish about the **present** uses the past form: *I wish I **were** taller*; *I wish I **knew** the answer*. A wish about the **past**, something that did not happen, uses the **past perfect**: *I wish I **had seen** the film*; *She wishes she **had not said** that*. *Would* does not belong in the wish itself.",
    "对**现在**的愿望用过去式：*I wish I **were** taller*；*I wish I **knew** the answer*。对**过去**的愿望，即没有发生的事，用**过去完成时**：*I wish I **had seen** the film*；*She wishes she **had not said** that*。*would* 不用在愿望本身之中。",
  ],
  ["Which form completes the wish?", "哪个形式能补全这个愿望？"],
  `
  I missed the film. I wish I ___ it.|had seen|saw|would see
  She was rude. She wishes she ___ that.|had not said|did not say|would not say
  We lost the map. I wish we ___ it.|had kept|kept|would keep
  He failed the test. He wishes he ___ harder.|had studied|studied|would study
  I am short. I wish I ___ taller.|were|had been|would be
  I don't know the answer. I wish I ___ it.|knew|had known|would know
  They missed the bus. They wish they ___ earlier.|had left|left|would leave
  I live far from the sea. I wish I ___ near it.|lived|had lived|would live
  She forgot his birthday. She wishes she ___.|had remembered|remembered|would remember
  We can't swim. We wish we ___ swim.|could|could have|would
  I broke the vase. I wish I ___ more careful.|had been|was|would be
  He shouted at his friend. He wishes he ___.|had not shouted|did not shout|would not shout
  We missed the concert. I wish we ___.|had gone|went|would go
  She lost her ring. She wishes she ___ it off.|had not taken|did not take|would not take
  I can't play the guitar. I wish I ___ play it.|could|could have|would
  It is raining. I wish it ___ sunny.|were|had been|would be
  They ate all the cake. They wish they ___ some.|had saved|saved|would save
  I don't have a dog. I wish I ___ one.|had|had had|would have
  He forgot his lines. He wishes he ___ more.|had practiced|practiced|would practice
  I told the secret. I wish I ___ quiet.|had kept|kept|would keep
  She lives in a small flat. She wishes she ___ a garden.|had|had had|would have
  We sold the old car. We wish we ___ it.|had kept|kept|would keep
  I am not good at math. I wish I ___ better at it.|were|had been|would be
  He didn't call his grandma. He wishes he ___ her.|had called|called|would call
  They don't speak Spanish. They wish they ___ it.|spoke|had spoken|would speak
  I stayed up too late. I wish I ___ to bed earlier.|had gone|went|would go
  She didn't bring a coat. She wishes she ___ one.|had brought|brought|would bring
  We don't live near our cousins. We wish we ___ closer.|lived|had lived|would live
  I didn't read the instructions. I wish I ___ them.|had read|read|would read
  He wasn't at the party. He wishes he ___ there.|had been|was|would be
  `,
  (right, shown) => [
    `"${shown.replace("___", right)}": a wish about ${right.startsWith("had") ? "the past takes the past perfect" : "the present takes the past form"}.`,
    `“${shown.replace("___", right)}”：对${right.startsWith("had") ? "过去的愿望用过去完成时" : "现在的愿望用过去式"}。`,
  ],
  [
    ["*{wrong}* is for a wish about the other time, past or present.", "*{wrong}* 用于对另一个时间（过去或现在）的愿望。"],
    ["*{wrong}* puts *would* in the wish itself.", "*{wrong}* 把 *would* 用在了愿望本身之中。"],
  ],
);

const repeatTo = choose(
  "to-once-or-every-time",
  ["To Once or Every Time", "to 用一次还是每次都用"],
  [
    "In a series of infinitives, use *to* **once**, before the first item, or before **every** item, but do not mix the two: *She likes to read, write and draw* or *She likes to read, to write and to draw*, not *to read, write and to draw*.",
    "在一连串不定式中，*to* 要么只在第一项前用**一次**，要么在**每一项**前都用，但不能两者混用：*She likes to read, write and draw* 或 *She likes to read, to write and to draw*，而不是 *to read, write and to draw*。",
  ],
  ["Which sentence is parallel?", "哪个句子是平行的？"],
  `
  She likes / read / write / draw|She likes to read, write and draw.|She likes to read, write and to draw.|She likes to read, to write and draw.
  We came / learn / listen / ask questions|We came to learn, to listen and to ask questions.|We came to learn, listen and to ask questions.|We came to learn, to listen and ask questions.
  He wants / travel / cook / paint|He wants to travel, cook and paint.|He wants to travel, cook and to paint.|He wants to travel, to cook and paint.
  The goal is / win / grow / have fun|The goal is to win, to grow and to have fun.|The goal is to win, grow and to have fun.|The goal is to win, to grow and have fun.
  They hope / save / build / share|They hope to save, build and share.|They hope to save, build and to share.|They hope to save, to build and share.
  Remember / stretch / drink water / rest|Remember to stretch, drink water and rest.|Remember to stretch, drink water and to rest.|Remember to stretch, to drink water and rest.
  I plan / study / exercise / sleep early|I plan to study, to exercise and to sleep early.|I plan to study, exercise and to sleep early.|I plan to study, to exercise and sleep early.
  Our club aims / read / discuss / write|Our club aims to read, discuss and write.|Our club aims to read, discuss and to write.|Our club aims to read, to discuss and write.
  She learned / sail / fish / swim|She learned to sail, to fish and to swim.|She learned to sail, fish and to swim.|She learned to sail, to fish and swim.
  We need / plan / measure / cut|We need to plan, measure and cut.|We need to plan, measure and to cut.|We need to plan, to measure and cut.
  He hopes / win / travel / rest|He hopes to win, travel and rest.|He hopes to win, travel and to rest.|He hopes to win, to travel and rest.
  They decided / paint / clean / fix the fence|They decided to paint, to clean and to fix the fence.|They decided to paint, clean and to fix the fence.|They decided to paint, to clean and fix the fence.
  I love / sing / dance / act|I love to sing, dance and act.|I love to sing, dance and to act.|I love to sing, to dance and act.
  We want / explore / camp / fish|We want to explore, to camp and to fish.|We want to explore, camp and to fish.|We want to explore, to camp and fish.
  She needs / rest / eat / drink water|She needs to rest, eat and drink water.|She needs to rest, eat and to drink water.|She needs to rest, to eat and drink water.
  Our aim is / teach / inspire / help|Our aim is to teach, to inspire and to help.|Our aim is to teach, inspire and to help.|Our aim is to teach, to inspire and help.
  He tried / run / jump / climb|He tried to run, jump and climb.|He tried to run, jump and to climb.|He tried to run, to jump and climb.
  The plan is / save / invest / spend wisely|The plan is to save, to invest and to spend wisely.|The plan is to save, invest and to spend wisely.|The plan is to save, to invest and spend wisely.
  They like / read / talk / laugh|They like to read, talk and laugh.|They like to read, talk and to laugh.|They like to read, to talk and laugh.
  I came / see / hear / understand|I came to see, to hear and to understand.|I came to see, hear and to understand.|I came to see, to hear and understand.
  She wants / swim / surf / sail|She wants to swim, surf and sail.|She wants to swim, surf and to sail.|She wants to swim, to surf and sail.
  We hope / grow / change / improve|We hope to grow, to change and to improve.|We hope to grow, change and to improve.|We hope to grow, to change and improve.
  He learned / cook / bake / grill|He learned to cook, bake and grill.|He learned to cook, bake and to grill.|He learned to cook, to bake and grill.
  The goal is / listen / think / respond|The goal is to listen, to think and to respond.|The goal is to listen, think and to respond.|The goal is to listen, to think and respond.
  I promised / call / write / visit|I promised to call, write and visit.|I promised to call, write and to visit.|I promised to call, to write and visit.
  They agreed / share / help / wait|They agreed to share, to help and to wait.|They agreed to share, help and to wait.|They agreed to share, to help and wait.
  She chose / stay / study / work|She chose to stay, study and work.|She chose to stay, study and to work.|She chose to stay, to study and work.
  We aim / build / test / launch|We aim to build, to test and to launch.|We aim to build, test and to launch.|We aim to build, to test and launch.
  He likes / draw / paint / sculpt|He likes to draw, paint and sculpt.|He likes to draw, paint and to sculpt.|He likes to draw, to paint and sculpt.
  Our job is / plan / measure / build|Our job is to plan, to measure and to build.|Our job is to plan, measure and to build.|Our job is to plan, to measure and build.
  `,
  (right) => [`"${right}" uses *to* once or every time, not both.`, `“${right}”的 *to* 要么只用一次，要么每次都用，没有混用。`],
  [
    ['"{wrong}" drops *to* in the middle but brings it back at the end.', "“{wrong}”中间省略了 *to*，最后又加了回来。"],
    ['"{wrong}" repeats *to* and then drops it.', "“{wrong}”先重复了 *to*，后来又省略了。"],
  ],
);

const passiveTenses = choose(
  "the-passive-in-every-tense",
  ["The Passive in Every Tense", "各种时态的被动语态"],
  [
    "The passive is a form of *be* plus the past participle, and the tense is carried by *be*: *is painted* (present), *is being painted* (progressive), *was painted* (past), *has been painted* (perfect), *will be painted* (future). Each part must be there and in the right form.",
    "被动语态由 *be* 的某种形式加过去分词构成，时态由 *be* 体现：*is painted*（一般现在时）、*is being painted*（进行时）、*was painted*（一般过去时）、*has been painted*（完成时）、*will be painted*（将来时）。每个部分都要有，而且形式要正确。",
  ],
  ["Which passive form completes the sentence?", "哪个被动形式能补全句子？"],
  `
  Right now the house ___ by two workers.|is being painted|is painting|is been painted
  The letters ___ yesterday.|were sent|were send|are sending
  The bridge ___ since last spring.|has been closed|has closed|has being closed
  The results ___ tomorrow.|will be announced|will announced|will be announce
  The cake ___ by the time we arrived.|had been eaten|had eaten|had been eat
  The road ___ at the moment.|is being repaired|is repairing|is been repaired
  The windows ___ every week.|are cleaned|are clean|are cleaning
  The thief ___ last night.|was caught|was catch|is catching
  The new library ___ next year.|will be opened|will opened|will be open
  Three trees ___ in the storm so far.|have been knocked down|have knocked down|have being knocked down
  Right now the road ___ by the city.|is being repaired|is repairing|is been repaired
  The cookies ___ last night.|were baked|were bake|are baking
  The museum ___ since June.|has been closed|has closed|has being closed
  The winners ___ next week.|will be named|will named|will be name
  At this moment the patient ___ by a doctor.|is being examined|is examining|is been examined
  The windows ___ on Monday.|were washed|were wash|are washing
  The park ___ for two years.|has been cleaned up|has cleaned up|has being cleaned up
  The new rules ___ in May.|will be introduced|will introduced|will be introduce
  The tickets ___ online every day.|are sold|are sell|are selling
  The book ___ into ten languages.|has been translated|has translated|has being translated
  The pizza ___ in twenty minutes.|will be delivered|will delivered|will be deliver
  The car ___ when I arrived.|was being washed|was washing|was been washed
  The fence ___ before the storm came.|had been fixed|had fixed|had being fixed
  English ___ in many countries.|is spoken|is speak|is speaking
  The match ___ because of rain.|was canceled|was cancel|is canceling
  The bridge ___ by next summer.|will have been built|will have built|will have be built
  At the moment the files ___.|are being copied|are copying|are been copied
  The letters ___ by hand every week.|are written|are write|are writing
  The mistake ___ yet.|has not been noticed|has not noticed|has not being noticed
  The doors ___ at nine tomorrow.|will be opened|will opened|will be open
  `,
  (right) => [`*${right}*: the tense is carried by *be*, followed by the past participle.`, `*${right}*：时态由 *be* 体现，后接过去分词。`],
  [
    ["*{wrong}* leaves out a part of the passive or makes it active.", "*{wrong}* 漏掉了被动语态的某个部分，或者变成了主动语态。"],
    ["*{wrong}* uses the wrong form of *be* or of the verb.", "*{wrong}* 用错了 *be* 或动词的形式。"],
  ],
);

const ly = choose(
  "no-hyphen-after-ly",
  ["No Hyphen After -ly", "-ly 后不加连字符"],
  [
    "A compound modifier before a noun is usually hyphenated: *a well-known writer*, *a fast-moving train*. But an adverb ending in **-ly** never takes a hyphen, because it can only describe the word after it: *a **quickly moving** train*, *a **brightly lit** room*.",
    "名词前的复合修饰语通常要加连字符：*a well-known writer*、*a fast-moving train*。但以 **-ly** 结尾的副词从不加连字符，因为它只能修饰后面的词：*a **quickly moving** train*、*a **brightly lit** room*。",
  ],
  ["Which phrase is hyphenated correctly?", "哪个短语的连字符用得对？"],
  `
  a quickly moving train|a quickly moving train|a quickly-moving train|a quickly moving-train
  a well known writer|a well-known writer|a well known writer|a well-known-writer
  a brightly lit room|a brightly lit room|a brightly-lit room|a brightly lit-room
  a fast moving river|a fast-moving river|a fast moving river|a fast-moving-river
  a carefully planned trip|a carefully planned trip|a carefully-planned trip|a carefully planned-trip
  a high quality camera|a high-quality camera|a high quality camera|a high-quality-camera
  a newly built school|a newly built school|a newly-built school|a newly built-school
  a part time job|a part-time job|a part time job|a part-time-job
  a badly damaged car|a badly damaged car|a badly-damaged car|a badly damaged-car
  a long term plan|a long-term plan|a long term plan|a long-term-plan
  a freshly baked pie|a freshly baked pie|a freshly-baked pie|a freshly baked-pie
  a well dressed man|a well-dressed man|a well dressed man|a well-dressed-man
  a highly trained dog|a highly trained dog|a highly-trained dog|a highly trained-dog
  a slow moving line|a slow-moving line|a slow moving line|a slow-moving-line
  a perfectly cooked steak|a perfectly cooked steak|a perfectly-cooked steak|a perfectly cooked-steak
  a full time worker|a full-time worker|a full time worker|a full-time-worker
  a recently opened shop|a recently opened shop|a recently-opened shop|a recently opened-shop
  a short term loan|a short-term loan|a short term loan|a short-term-loan
  a beautifully painted wall|a beautifully painted wall|a beautifully-painted wall|a beautifully painted-wall
  a hard working student|a hard-working student|a hard working student|a hard-working-student
  a nicely written letter|a nicely written letter|a nicely-written letter|a nicely written-letter
  a good looking horse|a good-looking horse|a good looking horse|a good-looking-horse
  a widely read author|a widely read author|a widely-read author|a widely read-author
  a low cost flight|a low-cost flight|a low cost flight|a low-cost-flight
  a poorly lit street|a poorly lit street|a poorly-lit street|a poorly lit-street
  a big city lawyer|a big-city lawyer|a big city lawyer|a big-city-lawyer
  a happily married couple|a happily married couple|a happily-married couple|a happily married-couple
  a last minute change|a last-minute change|a last minute change|a last-minute-change
  a deeply moving speech|a deeply moving speech|a deeply-moving speech|a deeply moving-speech
  a world famous singer|a world-famous singer|a world famous singer|a world-famous-singer
  `,
  (right) => [
    `"${right}" ${right.includes("ly ") ? "keeps the -ly adverb without a hyphen" : "joins the compound modifier with a hyphen"}.`,
    `“${right}”${right.includes("ly ") ? "中的 -ly 副词不加连字符" : "用连字符连接了复合修饰语"}。`,
  ],
  [
    ['"{wrong}" gets the hyphen wrong between the modifier\'s words.', "“{wrong}”在修饰语的词之间用错了连字符。"],
    ['"{wrong}" joins the modifier to the noun, which never takes a hyphen.', "“{wrong}”把修饰语和名词连了起来，而名词前从不加连字符。"],
  ],
);

const whoeverPrep = choose(
  "the-clause-not-the-preposition",
  ["The Clause, Not the Preposition", "看从句，不看介词"],
  [
    "After a preposition, *whoever* or *whomever* is chosen by its job **inside its own clause**, not by the preposition: *Give the prize to **whoever** wins* (whoever is the subject of *wins*). The whole clause is the preposition's object. Only when the pronoun is an object inside the clause is it *whomever*: *Give it to **whomever** you choose*.",
    "在介词后面，选 *whoever* 还是 *whomever* 要看它**在自己所在从句中**的作用，而不是看介词：*Give the prize to **whoever** wins*（whoever 是 *wins* 的主语）。整个从句才是介词的宾语。只有当代词在从句中作宾语时才用 *whomever*：*Give it to **whomever** you choose*。",
  ],
  ["Which word completes the sentence?", "哪个词能补全句子？"],
  `
  Give the prize to ___ wins.|whoever|whomever|whom
  The job will go to ___ applies first.|whoever|whomever|whom
  Send the invitation to ___ you like.|whomever|whoever|who
  Talk to ___ is at the front desk.|whoever|whomever|whom
  The coach will pick from ___ shows up.|whoever|whomever|whom
  Lend the book to ___ you trust.|whomever|whoever|who
  We will listen to ___ has a good idea.|whoever|whomever|whom
  Write a note to ___ found the wallet.|whoever|whomever|whom
  The prize goes to ___ the judges choose.|whomever|whoever|who
  Ask for help from ___ knows the way.|whoever|whomever|whom
  Give the tickets to ___ arrives first.|whoever|whomever|whom
  The medal goes to ___ runs fastest.|whoever|whomever|whom
  Show the photos to ___ you meet.|whomever|whoever|who
  Ask for help from ___ is on duty.|whoever|whomever|whom
  Lend the book to ___ needs it.|whoever|whomever|whom
  Offer a seat to ___ looks tired.|whoever|whomever|whom
  Write to ___ you admire.|whomever|whoever|who
  The prize will go to ___ the judges choose.|whomever|whoever|who
  Speak with ___ answers the phone.|whoever|whomever|whom
  Sell the bike to ___ pays the most.|whoever|whomever|whom
  Give a copy to ___ wants one.|whoever|whomever|whom
  Send a card to ___ you invited.|whomever|whoever|who
  Hand the keys to ___ is driving.|whoever|whomever|whom
  The letter is for ___ finds it.|whoever|whomever|whom
  Pass the ball to ___ is open.|whoever|whomever|whom
  We will work with ___ the coach picks.|whomever|whoever|who
  Thanks go to ___ cleaned the kitchen.|whoever|whomever|whom
  Report the problem to ___ is in charge.|whoever|whomever|whom
  Give the job to ___ you trust.|whomever|whoever|who
  Talk to ___ knows the answer.|whoever|whomever|whom
  `,
  (right, shown) => [
    `"${shown.replace("___", right)}": the pronoun is ${right === "whoever" ? "the subject" : "an object"} inside its own clause.`,
    `“${shown.replace("___", right)}”：这个代词在自己的从句中作${right === "whoever" ? "主语" : "宾语"}。`,
  ],
  [
    [
      "*{wrong}* follows the preposition, but the job inside the clause decides.",
      "*{wrong}* 是根据介词选的，但决定因素是它在从句中的作用。",
    ],
    ["*{wrong}* cannot begin a clause meaning *anyone who*.", "*{wrong}* 不能引导表示“任何……的人”的从句。"],
  ],
);

const plainOrder = choose(
  "putting-the-line-in-plain-order",
  ["Putting the Line in Plain Order", "把诗行还原为正常语序"],
  [
    "Poets often bend word order for rhythm or rhyme: *Across the field the shadows creep*; *Sweet was the song she sang*. To read such a line, put it back into plain order, subject, verb, object: *The shadows creep across the field*; *The song she sang was sweet*. A plain version must keep who does what.",
    "诗人常为了节奏或押韵改变语序：*Across the field the shadows creep*；*Sweet was the song she sang*。读这样的诗行，要把它还原为正常语序，即主语、谓语、宾语：*The shadows creep across the field*；*The song she sang was sweet*。还原后的句子必须保持谁做什么不变。",
  ],
  ["Which sentence says the line in plain order?", "哪个句子用正常语序表达了这行诗？"],
  `
  Across the field the shadows creep.|The shadows creep across the field.|The field creeps across the shadows.|Across the shadows the field creeps.
  Sweet was the song she sang.|The song she sang was sweet.|She was sweet and sang a song.|The sweet song sang her.
  Over the hill the old moon rose.|The old moon rose over the hill.|The hill rose over the old moon.|Over the moon the old hill rose.
  The letter in his hand he read.|He read the letter in his hand.|The letter read him in his hand.|His hand read the letter.
  Deep in the woods an owl did call.|An owl called deep in the woods.|The woods called deep in an owl.|Deep in an owl the woods did call.
  Loud roared the sea against the rocks.|The sea roared loudly against the rocks.|The rocks roared loudly against the sea.|Against the sea the rocks roared loud.
  Her name I never knew.|I never knew her name.|Her name never knew me.|She never knew my name.
  Up from the river the mist came.|The mist came up from the river.|The river came up from the mist.|Up from the mist the river came.
  Gone are the summers of my youth.|The summers of my youth are gone.|My youth is gone from the summers.|The summers are of my gone youth.
  The bells of morning soft did ring.|The bells of morning rang softly.|Morning rang the soft bells.|The soft morning rang the bells.
  Into the woods the children ran.|The children ran into the woods.|The woods ran into the children.|Into the children the woods ran.
  Bright were the stars that night.|The stars were bright that night.|The night was bright with stars that ran.|The bright night was the stars.
  Down the road the old cart rolled.|The old cart rolled down the road.|The road rolled down the old cart.|Down the cart the old road rolled.
  The book upon the shelf I found.|I found the book upon the shelf.|The book found me upon the shelf.|The shelf found the book.
  Cold was the wind from the north.|The wind from the north was cold.|The north was cold with wind.|The cold north was the wind.
  Through the window the sunlight fell.|The sunlight fell through the window.|The window fell through the sunlight.|Through the sunlight the window fell.
  His secret he told to no one.|He told his secret to no one.|His secret told him to no one.|No one told him his secret.
  Over the sea the gulls flew.|The gulls flew over the sea.|The sea flew over the gulls.|Over the gulls the sea flew.
  Loud was the cry of the crowd.|The cry of the crowd was loud.|The crowd was loud in its cry.|The loud crowd was the cry.
  The rose in her hair she wore.|She wore the rose in her hair.|The rose wore her in her hair.|Her hair wore the rose.
  Across the lake the boat drifted.|The boat drifted across the lake.|The lake drifted across the boat.|Across the boat the lake drifted.
  Dark grew the sky above.|The sky above grew dark.|Above grew the dark sky.|The dark above grew the sky.
  The song of the bird we heard.|We heard the song of the bird.|The song of the bird heard us.|The bird heard our song.
  Beneath the bridge the river flowed.|The river flowed beneath the bridge.|The bridge flowed beneath the river.|Beneath the river the bridge flowed.
  Long was the road ahead of them.|The road ahead of them was long.|They were long ahead of the road.|The long road was ahead of the long.
  The gift from his mother he kept.|He kept the gift from his mother.|The gift kept him from his mother.|His mother kept the gift.
  From the chimney the smoke rose.|The smoke rose from the chimney.|The chimney rose from the smoke.|From the smoke the chimney rose.
  Soft was the voice that called her.|The voice that called her was soft.|She was soft and called a voice.|The soft voice was her call.
  Upon the hill the castle stood.|The castle stood upon the hill.|The hill stood upon the castle.|Upon the castle the hill stood.
  The answer to the riddle she knew.|She knew the answer to the riddle.|The answer knew her riddle.|The riddle knew her answer.
  `,
  (right) => [`"${right}" keeps who does what and puts the subject first.`, `“${right}”保持了谁做什么不变，并把主语放在了前面。`],
  [
    ['"{wrong}" swaps the subject and the object, so it changes who does what.', "“{wrong}”把主语和宾语对调了，改变了谁做什么。"],
    ['"{wrong}" keeps a twisted order or changes the meaning.', "“{wrong}”仍是颠倒的语序，或者改变了意思。"],
  ],
);

const prepOnce = choose(
  "the-preposition-only-once",
  ["The Preposition Only Once", "介词只用一次"],
  [
    "A preposition that goes with a relative pronoun belongs in **one** place: before the pronoun in formal writing (*the house **in** which I lived*) or at the end of the clause in everyday writing (*the house which I lived **in***). Using it in both places is an error: *the house in which I lived in*.",
    "与关系代词搭配的介词只放在**一个**地方：正式写作中放在关系代词前面（*the house **in** which I lived*），日常写作中放在从句末尾（*the house which I lived **in***）。两个地方都用是错误的：*the house in which I lived in*。",
  ],
  ["Which sentence is correct?", "哪个句子正确？"],
  `
  the house / lived in|This is the house in which I lived.|This is the house in which I lived in.|This is the house in where I lived.
  the friend / spoke to|She is the friend to whom I spoke.|She is the friend to whom I spoke to.|She is the friend to who I spoke.
  the box / kept letters in|That is the box in which she kept her letters.|That is the box in which she kept her letters in.|That is the box in where she kept her letters.
  the coach / learned from|He is the coach from whom I learned the most.|He is the coach from whom I learned the most from.|He is the coach from who I learned the most.
  the town / grew up in|It is the town in which we grew up.|It is the town in which we grew up in.|It is the town in where we grew up.
  the team / played for|That is the team for which he played.|That is the team for which he played for.|That is the team for what he played.
  the topic / wrote about|This is the topic about which I wrote.|This is the topic about which I wrote about.|This is the topic about what I wrote.
  the chair / sat on|That is the chair on which she sat.|That is the chair on which she sat on.|That is the chair on where she sat.
  the people / worked with|They are the people with whom I worked.|They are the people with whom I worked with.|They are the people with who I worked.
  the river / swam in|This is the river in which we swam.|This is the river in which we swam in.|This is the river in where we swam.
  the city / grew up in|This is the city in which I grew up.|This is the city in which I grew up in.|This is the city in where I grew up.
  the teacher / talked to|She is the teacher to whom I talked.|She is the teacher to whom I talked to.|She is the teacher to who I talked.
  the drawer / kept keys in|That is the drawer in which he kept his keys.|That is the drawer in which he kept his keys in.|That is the drawer in where he kept his keys.
  the author / heard about|He is the author about whom I heard.|He is the author about whom I heard about.|He is the author about who I heard.
  the bench / sat on|This is the bench on which we sat.|This is the bench on which we sat on.|This is the bench on where we sat.
  the friends / traveled with|They are the friends with whom I traveled.|They are the friends with whom I traveled with.|They are the friends with who I traveled.
  the lake / fished in|This is the lake in which we fished.|This is the lake in which we fished in.|This is the lake in where we fished.
  the girl / wrote to|She is the girl to whom I wrote.|She is the girl to whom I wrote to.|She is the girl to who I wrote.
  the problem / thought about|This is the problem about which I thought.|This is the problem about which I thought about.|This is the problem about what I thought.
  the shelf / put books on|That is the shelf on which she put the books.|That is the shelf on which she put the books on.|That is the shelf on where she put the books.
  the doctor / got advice from|He is the doctor from whom I got advice.|He is the doctor from whom I got advice from.|He is the doctor from who I got advice.
  the box / found coins in|That is the box in which we found the coins.|That is the box in which we found the coins in.|That is the box in where we found the coins.
  the neighbor / borrowed a ladder from|She is the neighbor from whom we borrowed a ladder.|She is the neighbor from whom we borrowed a ladder from.|She is the neighbor from who we borrowed a ladder.
  the house / stayed in|This is the house in which we stayed.|This is the house in which we stayed in.|This is the house in where we stayed.
  the player / passed the ball to|He is the player to whom I passed the ball.|He is the player to whom I passed the ball to.|He is the player to who I passed the ball.
  the song / danced to|This is the song to which we danced.|This is the song to which we danced to.|This is the song to what we danced.
  the team / played against|They are the team against whom we played.|They are the team against whom we played against.|They are the team against who we played.
  the room / slept in|That is the room in which I slept.|That is the room in which I slept in.|That is the room in where I slept.
  the cousin / stayed with|She is the cousin with whom I stayed.|She is the cousin with whom I stayed with.|She is the cousin with who I stayed.
  the park / walked through|This is the park through which we walked.|This is the park through which we walked through.|This is the park through where we walked.
  `,
  (right) => [`"${right}" uses the preposition once, before the relative pronoun.`, `“${right}”只用了一次介词，放在关系代词前面。`],
  [
    ['"{wrong}" uses the preposition twice, before the pronoun and at the end.', "“{wrong}”用了两次介词，关系代词前和句末各一次。"],
    ['"{wrong}" puts a word after the preposition that cannot follow it.', "“{wrong}”在介词后用了一个不能跟在它后面的词。"],
  ],
);

const confusedLines = join([
  ...[
    "The question was meant to elicit an honest answer.",
    "Selling stolen goods is illicit.",
    "An eminent scientist gave the lecture.",
    "Dark clouds warned of an imminent storm.",
    "The flight was delayed by adverse weather.",
    "He is averse to taking risks.",
    "She was discreet and kept the secret.",
    "The test has three discrete parts.",
    "Some governments censor the news.",
    "The senate voted to censure the official.",
    "The rich man liked to flaunt his cars.",
    "The drivers flout the speed limit every day.",
    "The police found illicit drugs in the car.",
    "Her speech was meant to elicit support.",
    "The eminent judge retired last year.",
  ].map((s) => `${s}|correct`),
  ...[
    "The question was meant to illicit an honest answer.",
    "Selling stolen goods is elicit.",
    "An imminent scientist gave the lecture.",
    "Dark clouds warned of an eminent storm.",
    "The flight was delayed by averse weather.",
    "He is adverse to taking risks.",
    "She was discrete and kept the secret.",
    "The test has three discreet parts.",
    "Some governments censure the news.",
    "The senate voted to censor the official.",
    "The rich man liked to flout his cars.",
    "The drivers flaunt the speed limit every day.",
    "The comedian tried to illicit a laugh.",
    "The mayor's visit is eminent, so clean the hall.",
    "Some students flaunt the school rules.",
  ].map((s) => `${s}|wrong word`),
]);

const confused = label(
  "proofreading-for-confused-words",
  ["Proofreading for Confused Words", "校对易混淆词"],
  [
    "A spell checker will not catch a confused word, because the wrong word is spelled correctly. Stop at each word of a confused pair and check its meaning: to **elicit** is to draw out, **illicit** is unlawful; **eminent** is famous, **imminent** is about to happen; to **flaunt** is to show off, to **flout** is to break a rule openly.",
    "拼写检查发现不了易混淆词，因为错用的词本身拼写正确。遇到易混淆词组中的每个词都停下来，核对它的意思：**elicit** 是引出，**illicit** 是非法的；**eminent** 是著名的，**imminent** 是即将发生的；**flaunt** 是炫耀，**flout** 是公然违反规则。",
  ],
  ["Is the confused word used correctly?", "这个易混淆词用对了吗？"],
  confusedLines,
  {
    correct: L(
      "正确",
      "The word has the meaning the sentence needs.",
      "这个词的意思正是句子所需要的。",
      "The word is its pair's partner, with a different meaning.",
      "这个词是与它成对的那个词，意思不同。",
    ),
    "wrong word": L(
      "用错了词",
      "The word is spelled correctly, but the sentence needs its pair's meaning.",
      "这个词拼写正确，但句子需要的是与它成对的那个词的意思。",
      "The word has the meaning the sentence needs.",
      "这个词的意思正是句子所需要的。",
    ),
  },
);

/** deeper8 are the third knowledge points of the grammar topics of grade 8, by topic id. */
export const deeper8: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "gerund-and-infinitive-phrases": [afterVerb],
  "identifying-verbals": [gerundJob],
  "simple-compound-and-complex-sentences": [compoundComplex],
  "commas-in-complex-sentences": [thatComma],
  "choosing-the-subordinating-conjunction": [wrongConjunction],
  "ellipses-in-quotations": [noDots],
  "the-subjunctive-in-wishes-and-conditions": [wishPast],
  "parallel-verbals": [repeatTo],
  "shifts-in-voice": [passiveTenses],
  "hyphenating-compound-modifiers": [ly],
  "who-whoever-whom-whomever": [whoeverPrep],
  "reading-inverted-sentences": [plainOrder],
  "prepositions-before-relative-pronouns": [prepOnce],
  "commonly-confused-words-4": [confused],
};
