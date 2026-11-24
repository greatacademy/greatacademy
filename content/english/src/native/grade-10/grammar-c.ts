// Grade 10: agreement in the hardest cases, and fresh language in place of clichés.

import type { TopicDef } from "@ga/content";
import { choose, type Label, label, topic } from "../grade-6/kit.ts";

const join = (lines: readonly string[]) => lines.join("\n");

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

// Agreement in hard cases.

/** oneOf are a plural group, what they do in the plural and in the singular, and a form that is not finite. */
const oneOf = [
  ["players", "train", "trains", "training", "every morning"],
  ["writers", "revise", "revises", "revising", "each page twice"],
  ["students", "walk", "walks", "walking", "to school"],
  ["doctors", "work", "works", "working", "at night"],
  ["singers", "read", "reads", "reading", "music by sight"],
  ["scientists", "share", "shares", "sharing", "their data"],
  ["neighbors", "keep", "keeps", "keeping", "bees"],
  ["teachers", "speak", "speaks", "speaking", "three languages"],
  ["runners", "finish", "finishes", "finishing", "every marathon"],
  ["artists", "paint", "paints", "painting", "with their hands"],
  ["drivers", "stop", "stops", "stopping", "for every walker"],
  ["swimmers", "train", "trains", "training", "in the cold lake"],
  ["cooks", "bake", "bakes", "baking", "their own bread"],
  ["pilots", "fly", "flies", "flying", "at night"],
  ["volunteers", "visit", "visits", "visiting", "the hospital weekly"],
] as const;

const oneOfLines = join(
  oneOf.flatMap(([group, plural, singular, ing, rest]) => [
    `She is one of the ${group} who ___ ${rest}.|${plural}|${singular}|${ing}`,
    `She is the only one of the ${group} who ___ ${rest}.|${singular}|${plural}|${ing}`,
  ]),
);

/** singularSubjects are subjects that look plural but name one title, dish, clause or field, with their sentence. */
const singularSubjects = [
  ["*The Grapes of Wrath* ___ a novel about migrant workers.", "is", "are", "be"],
  ["*Romeo and Juliet* ___ performed every summer in the park.", "is", "are", "be"],
  ["What we need ___ more volunteers.", "is", "are", "be"],
  ["What the critics praised ___ the actors' voices.", "was", "were", "be"],
  ["Fish and chips ___ my favorite meal.", "is", "are", "be"],
  ["Bread and butter ___ all he wanted for breakfast.", "was", "were", "be"],
  ["*The Canterbury Tales* ___ written in Middle English.", "was", "were", "be"],
  ["Whether they will come ___ still unclear.", "is", "are", "be"],
  ["Economics ___ the subject she studies.", "is", "are", "be"],
  ["*Great Expectations* ___ one of Dickens's later novels.", "is", "are", "be"],
  ["That the bridges were unsafe ___ known for years.", "was", "were", "be"],
  ["Macaroni and cheese ___ on the menu today.", "is", "are", "be"],
  ["*Little Women* ___ set during the American Civil War.", "is", "are", "be"],
  ["*The Three Musketeers* ___ my brother's favorite book.", "is", "are", "be"],
  ["Peanut butter and jelly ___ the sandwich he always orders.", "is", "are", "be"],
  ["Rice and beans ___ served with every meal here.", "is", "are", "be"],
  ["What surprised us ___ the number of visitors.", "was", "were", "be"],
  ["What the town needs ___ new schools.", "is", "are", "be"],
  ["Physics ___ harder than I expected.", "is", "are", "be"],
  ["Mathematics ___ taught in every grade.", "is", "are", "be"],
  ["The news ___ better than we feared.", "was", "were", "be"],
  ["Measles ___ spreading in the region.", "is", "are", "be"],
  ["That the results were wrong ___ obvious to everyone.", "was", "were", "be"],
  ["Whether the trains will run ___ not yet known.", "is", "are", "be"],
  ["*The Birds* ___ a famous film by Hitchcock.", "is", "are", "be"],
  ["Spaghetti and meatballs ___ cooking on the stove.", "is", "are", "be"],
  ["Politics ___ a subject she avoids at dinner.", "is", "are", "be"],
  ["How the pyramids were built ___ still debated.", "is", "are", "be"],
  ["*Pride and Prejudice* ___ first published in 1813.", "was", "were", "be"],
  ["The United Nations ___ founded in 1945.", "was", "were", "be"],
] as const;

const singularLines = join(singularSubjects.map((row) => row.join("|")));

/** joined are subjects with a phrase such as as well as after them, and the verbs that agree and do not. */
const joined = [
  ["The captain, as well as her players, ___ tired after the match.", "is", "are", "being"],
  ["The teacher, along with his students, ___ visiting the museum.", "is", "are", "being"],
  ["The players, together with their coach, ___ on the bus.", "are", "is", "being"],
  ["The mayor, accompanied by two aides, ___ arriving at noon.", "is", "are", "being"],
  ["My sisters, as well as my brother, ___ coming to the wedding.", "are", "is", "being"],
  ["The house, including its gardens, ___ for sale.", "is", "are", "being"],
  ["The ministers, along with the president, ___ in the hall.", "are", "is", "being"],
  ["The author, together with her editors, ___ revised the book.", "has", "have", "having"],
  ["The engine, as well as the wheels, ___ to be replaced.", "needs", "need", "needing"],
  ["The children, with their dog, ___ playing in the yard.", "are", "is", "being"],
  ["The singer, along with the band, ___ touring Europe.", "is", "are", "being"],
  ["The witnesses, as well as the judge, ___ heard the recording.", "have", "has", "having"],
  ["The principal, along with the teachers, ___ at the gate.", "is", "are", "being"],
  ["The boys, as well as their father, ___ fishing today.", "are", "is", "being"],
  ["The farmer, together with his sons, ___ planted the field.", "has", "have", "having"],
  ["The recipe, including the sauces, ___ an hour to make.", "takes", "take", "taking"],
  ["The nurses, along with the doctor, ___ on duty tonight.", "are", "is", "being"],
  ["My aunt, as well as my cousins, ___ visiting next week.", "is", "are", "being"],
  ["The box, with all its contents, ___ lost in the move.", "was", "were", "being"],
  ["The pupils, together with their teacher, ___ planting trees.", "are", "is", "being"],
  ["The president, accompanied by her guards, ___ entering the hall.", "is", "are", "being"],
  ["The cars, as well as the bus, ___ stuck in the snow.", "are", "is", "being"],
  ["The library, along with its archives, ___ closed on Sundays.", "is", "are", "being"],
  ["The actors, together with the director, ___ bowed to the crowd.", "have", "has", "having"],
  ["The kitten, as well as its mother, ___ sleeping by the fire.", "is", "are", "being"],
  ["The workers, along with their manager, ___ to sign the form.", "need", "needs", "needing"],
  ["The city, including its suburbs, ___ two million people.", "has", "have", "having"],
  ["The guests, as well as the host, ___ dancing.", "are", "is", "being"],
  ["The team captain, with the coach, ___ chosen the players.", "has", "have", "having"],
  ["The flowers, along with the tree, ___ to be watered.", "need", "needs", "needing"],
] as const;

const joinedLines = join(joined.map((row) => row.join("|")));

const hardAgreement = topic("grammar", {
  id: "agreement-in-hard-cases",
  title: ["Agreement in Hard Cases", "疑难情况下的主谓一致"],
  summary: [
    "The hardest cases of agreement: *one of those who*, titles and clauses that take a singular verb, and subjects followed by *as well as* or *along with*.",
    "主谓一致中最难的几种情况：*one of those who*、要用单数动词的书名和从句，以及后面跟着 *as well as* 或 *along with* 的主语。",
  ],
  intro: [
    "Why does *The captain, along with her players, is tired* take *is*, while *one of the players who train every morning* takes *train*? Both traps hide the true subject behind nearby nouns. In this topic, you solve the three trickiest agreement patterns in formal English.",
    "为什么 *The captain, along with her players, is tired* 用单数 *is*，而 *one of the players who train every morning* 却用复数 *train*？这两类陷阱都把真正的主语藏在邻近名词后面。本主题带你攻克正式英语中最棘手的三类主谓一致。",
  ],
  after: ["agreement-with-tricky-subjects", "indefinite-pronouns-and-agreement"],
  points: [
    choose(
      "one-of-those-who",
      ["One of Those Who", "one of those who"],
      [
        "In *one of the players who train every morning*, *who* refers to **the players**, a plural, so its verb is plural: she is one of many who train. But in *the only one of the players who trains every morning*, *who* refers to **the only one**, so its verb is singular: no other player trains. Ask what *who* stands for.\n\n> **Watch out.** Look directly before *one*: bare *one of the …s who* takes a **plural** verb, while *the only one of the …s who* flips to a **singular** verb.",
        "在 *one of the players who train every morning* 中，*who* 指的是 **the players**，是复数，所以它的动词用复数：她是许多训练者之一。但在 *the only one of the players who trains every morning* 中，*who* 指的是 **the only one**，所以动词用单数：别的队员都不训练。要问 *who* 指代的是什么。\n\n> **注意。** 盯紧 *one* 前面的词：单纯的 *one of the …s who* 后接**复数**动词，一旦出现 *the only one of the …s who*，动词立刻变成**单数**。",
      ],
      ["Which verb agrees with *who*?", "哪个动词与 *who* 一致？"],
      oneOfLines,
      (right, shown) => [
        `"${shown.replace("___", right)}": the verb agrees with what *who* stands for.\n\n**Check.** Check whether *the only* appears before *one*: ${shown.includes("only one") ? `*the only one* makes the antecedent singular, matching **${right}**.` : `without *the only*, *who* refers to the plural group before it, matching **${right}**.`}`,
        `“${shown.replace("___", right)}”：动词与 *who* 所指代的成分一致。\n\n**检验。** 看 *one* 前面有没有 *the only*：${shown.includes("only one") ? `有 *the only one*，先行词为单数，配 **${right}**。` : `没有 *the only*，*who* 指代前面的复数群体，配 **${right}**。`}`,
      ],
      [
        [
          "*{wrong}* agrees with the wrong word: after *one of the …s who*, *who* means the plural group; after *the only one of the …s who*, it means the one.",
          "*{wrong}* 与错误的词一致：在 *one of the …s who* 之后，*who* 指复数群体；在 *the only one of the …s who* 之后，它指那一个。",
        ],
        ["*{wrong}* is not a finite verb, so the clause would have none.", "*{wrong}* 不是限定动词，从句就没有谓语动词了。"],
      ],
    ),
    choose(
      "titles-clauses-and-dishes",
      ["Titles, Clauses and Dishes", "书名、从句和菜名"],
      [
        "Some subjects look plural but name **one** thing, so they take a singular verb. The title of a work is one work: *The Grapes of Wrath **is** a novel*. A clause as subject, beginning with *what*, *whether* or *that*, is one idea: *What we need **is** more volunteers*. A pair that makes one dish is one thing: *Fish and chips **is** my favorite meal*. So is the name of a field such as *economics*.\n\n> **Watch out.** Do not let a plural noun inside a title, dish, or *what/that* clause trick your ear—replace the whole subject with *it* to hear the singular verb.",
        "有些主语看起来是复数，却指**一个**事物，所以用单数动词。作品的标题指一部作品：*The Grapes of Wrath **is** a novel*。以 *what*、*whether* 或 *that* 开头的从句做主语时，表示一个整体的意思：*What we need **is** more volunteers*。组成一道菜的一对东西是一个整体：*Fish and chips **is** my favorite meal*。像 *economics* 这样的学科名称也是如此。\n\n> **注意。** 别被书名、菜名或主语从句里藏着的复数名词带偏——把整个主语换成 *it* 默读一遍，立刻就能听出该用单数动词。",
      ],
      ["Which verb completes the sentence?", "哪个动词能补全句子？"],
      singularLines,
      (right, shown) => [
        `"${shown.replace("___", right)}": the subject names one title, idea, dish or field.\n\n**Check.** Substitute *It* for the entire subject before the blank: *It ${right} ...* sounds right, confirming the singular verb.`,
        `“${shown.replace("___", right)}”：主语指的是一个标题、意思、菜或学科。\n\n**检验。** 把空格前的整个主语替换成 *It* 试读：*It ${right} ...* 顺口自然，确认用单数动词。`,
      ],
      [
        ["*{wrong}* treats the subject as plural, but it names one thing.", "*{wrong}* 把主语当成了复数，但它指的是一个事物。"],
        ["*{wrong}* is not a finite verb, so the sentence would have none.", "*{wrong}* 不是限定动词，句子就没有谓语动词了。"],
      ],
    ),
    choose(
      "as-well-as-and-along-with",
      ["As Well As and Along With", "as well as 和 along with"],
      [
        "Phrases such as *as well as*, *along with*, *together with*, *including* and *accompanied by* do not join subjects the way *and* does. The verb agrees with the subject **before** the phrase: *The captain, as well as her players, **is** tired*; *The players, together with their coach, **are** on the bus*. The commas around the phrase are a sign that it can be lifted out.\n\n> **Watch out.** Never treat *as well as* or *along with* like *and*—cross out the entire comma-wrapped phrase and match the verb strictly to the subject left standing in front.",
        "*as well as*、*along with*、*together with*、*including* 和 *accompanied by* 等短语不像 *and* 那样连接主语。动词与短语**前面**的主语一致：*The captain, as well as her players, **is** tired*；*The players, together with their coach, **are** on the bus*。短语两边的逗号表明它可以被拿掉。\n\n> **注意。** 绝不要把 *as well as* 或 *along with* 当成 *and*——把逗号里的整个插入短语遮住，动词只与前面剩下的主语一致。",
      ],
      ["Which verb agrees with the subject?", "哪个动词与主语一致？"],
      joinedLines,
      (right, shown) => [
        `"${shown.replace("___", right)}": the verb agrees with the subject before the phrase.\n\n**Check.** Lift out the comma-enclosed phrase completely and read the bare subject straight into **${right}**: subject and verb match in number.`,
        `“${shown.replace("___", right)}”：动词与短语前面的主语一致。\n\n**检验。** 把逗号里的短语整体拿掉，让句首主语直接接 **${right}** 通读：单复数完全一致。`,
      ],
      [
        [
          "*{wrong}* agrees with the noun inside the phrase, not with the subject before it.",
          "*{wrong}* 与短语中的名词一致，而没有与短语前的主语一致。",
        ],
        ["*{wrong}* is not a finite verb, so the sentence would have none.", "*{wrong}* 不是限定动词，句子就没有谓语动词了。"],
      ],
    ),
  ],
});

// Clichés.

/** cliches are a cliché, what it means, two wrong meanings, a sentence with it, a fresh revision and two cliché revisions. */
const cliches = [
  [
    "a piece of cake",
    "very easy",
    "a small reward",
    "a kind of treat",
    "The test was a piece of cake.",
    "I finished the test in ten minutes.",
    "The test was as easy as pie.",
    "The test was a walk in the park.",
  ],
  [
    "a blessing in disguise",
    "something good that first seemed bad",
    "a gift hidden from someone",
    "a secret that brings luck",
    "Losing the job was a blessing in disguise.",
    "Losing the job sent her back to the piano she had abandoned.",
    "Losing the job was a silver lining.",
    "Losing the job was a stroke of luck.",
  ],
  [
    "only time will tell",
    "the answer is not known yet",
    "the clock is wrong",
    "people will gossip",
    "Only time will tell whether the bridge is safe.",
    "Engineers will know after the spring floods whether the bridge is safe.",
    "We will cross that bridge when we come to it.",
    "Time will tell, at the end of the day.",
  ],
  [
    "at the end of the day",
    "in the end, all things considered",
    "in the evening",
    "after a long wait",
    "At the end of the day, the plan failed.",
    "Once the money ran out in March, the plan failed.",
    "When all is said and done, the plan failed.",
    "In the final analysis, the plan bit the dust.",
  ],
  [
    "as busy as a bee",
    "very busy",
    "fond of flowers",
    "easily angered",
    "She was as busy as a bee before the opening.",
    "She answered forty emails before the gallery opened.",
    "She was running around like a headless chicken.",
    "She had her hands full and then some.",
  ],
  [
    "the silence was deafening",
    "no one said anything, and it was striking",
    "the room was very loud",
    "someone lost their hearing",
    "When he finished, the silence was deafening.",
    "When he finished, no one moved; a chair creaked.",
    "When he finished, you could hear a pin drop.",
    "When he finished, the room went dead quiet.",
  ],
  [
    "a melting pot",
    "a place where many cultures mix",
    "a hot kitchen",
    "a dangerous factory",
    "The city is a melting pot.",
    "In one block of the city you can hear Polish, Tagalog and Spanish.",
    "The city is a rich tapestry of cultures.",
    "The city is a mosaic of peoples.",
  ],
  [
    "give it one hundred and ten percent",
    "try as hard as possible",
    "pay too much",
    "count carefully",
    "The coach told us to give it one hundred and ten percent.",
    "The coach told us to sprint every ball until the whistle.",
    "The coach told us to leave it all on the field.",
    "The coach told us to go the extra mile.",
  ],
  [
    "like a well-oiled machine",
    "smoothly, with every part working",
    "noisily and dirtily",
    "against its will",
    "The kitchen ran like a well-oiled machine.",
    "In the kitchen, each cook passed a plate before anyone asked.",
    "The kitchen ran like clockwork.",
    "The kitchen was a well-run ship.",
  ],
  [
    "think outside the box",
    "think in new ways",
    "work outdoors",
    "leave a job",
    "We need to think outside the box.",
    "We could ask the students to design the timetable.",
    "We need to push the envelope.",
    "We need a paradigm shift.",
  ],
  [
    "the last straw",
    "the final problem that makes someone give up",
    "the shortest choice",
    "a cheap meal",
    "The broken heater was the last straw.",
    "When the heater broke in January, we called the landlord and gave notice.",
    "The broken heater was the final nail in the coffin.",
    "The broken heater broke the camel's back.",
  ],
  [
    "hit the nail on the head",
    "say exactly the right thing",
    "make a loud noise",
    "hurt someone by mistake",
    "Her comment hit the nail on the head.",
    "Her comment named the real problem: nobody had read the plan.",
    "Her comment was spot on.",
    "Her comment was right on the money.",
  ],
  [
    "the calm before the storm",
    "a quiet time before trouble",
    "a pleasant summer day",
    "a weather report",
    "The office was the calm before the storm.",
    "The office was silent on Monday morning; by noon the phones would not stop.",
    "The office was as quiet as a mouse.",
    "The office was dead quiet.",
  ],
  [
    "at the end of the day",
    "when everything is considered",
    "in the evening",
    "after work",
    "At the end of the day, the team played well.",
    "Despite the two missed penalties, the team created more chances than ever.",
    "When all is said and done, the team played well.",
    "All things considered, the team played well.",
  ],
  [
    "a needle in a haystack",
    "something almost impossible to find",
    "a sharp pain",
    "a farm tool",
    "Finding the ring was like looking for a needle in a haystack.",
    "The ring had slipped somewhere into three acres of wet sand.",
    "Finding the ring was a wild goose chase.",
    "Finding the ring was a lost cause.",
  ],
  [
    "break the ice",
    "make strangers feel at ease",
    "cross a frozen lake",
    "destroy something cold",
    "The teacher told a joke to break the ice.",
    "The teacher asked each of us to name the worst meal we had ever eaten.",
    "The teacher told a joke to get the ball rolling.",
    "The teacher told a joke to warm up the crowd.",
  ],
  [
    "cold feet",
    "sudden fear about doing something",
    "poor blood flow",
    "a winter illness",
    "He got cold feet before the speech.",
    "An hour before the speech, he locked himself in the bathroom and rehearsed his excuses.",
    "He lost his nerve before the speech.",
    "He chickened out before the speech.",
  ],
  [
    "in the nick of time",
    "just before it was too late",
    "at an exact hour",
    "after a long wait",
    "The firefighters arrived in the nick of time.",
    "The firefighters arrived as the first beam of the roof gave way.",
    "The firefighters arrived at the last minute.",
    "The firefighters arrived at the eleventh hour.",
  ],
  [
    "the tip of the iceberg",
    "a small sign of a much bigger problem",
    "the top of a mountain",
    "a cold drink",
    "The broken window was the tip of the iceberg.",
    "Behind the broken window, the inspector found rotten beams and no wiring at all.",
    "The broken window was just scratching the surface.",
    "The broken window was only the beginning.",
  ],
  [
    "a dime a dozen",
    "very common and of little value",
    "cheap to buy",
    "a kind of coin",
    "Singers like him are a dime a dozen.",
    "Every bar on the street has a singer who covers the same ten songs.",
    "Singers like him are ten a penny.",
    "Singers like him are two a penny.",
  ],
  [
    "under the weather",
    "slightly ill",
    "caught in the rain",
    "afraid of storms",
    "I am feeling under the weather.",
    "My throat burns and I have slept through two alarms.",
    "I am feeling a bit off color.",
    "I am feeling out of sorts.",
  ],
  [
    "burn the midnight oil",
    "work late into the night",
    "waste fuel",
    "start a fire",
    "She burned the midnight oil before the exam.",
    "She studied until three, with the kitchen lamp on and cold tea beside her.",
    "She pulled an all-nighter before the exam.",
    "She worked around the clock before the exam.",
  ],
  [
    "the ball is in your court",
    "it is your turn to decide",
    "you are playing tennis",
    "you have lost the game",
    "I have made my offer; the ball is in your court.",
    "I have made my offer; you have until Friday to answer.",
    "I have made my offer; it is your move.",
    "I have made my offer; it is up to you now.",
  ],
  [
    "a drop in the ocean",
    "far too small to make a difference",
    "a kind of rain",
    "a careless spill",
    "The donation was a drop in the ocean.",
    "The donation would pay for the school's roof for about a week.",
    "The donation was a drop in the bucket.",
    "The donation was a mere trifle.",
  ],
  [
    "time flies",
    "time seems to pass quickly",
    "clocks are fragile",
    "people travel fast",
    "Time flies when you are on holiday.",
    "We arrived on Saturday, and suddenly it was the last morning and the bags were packed.",
    "Time slips away when you are on holiday.",
    "The days fly by when you are on holiday.",
  ],
  [
    "every cloud has a silver lining",
    "something good comes from every bad thing",
    "the sky is always bright",
    "rain brings money",
    "Every cloud has a silver lining: the cancelled trip saved us money.",
    "The cancelled trip left us with enough money to fix the car.",
    "It is a blessing in disguise that the trip was cancelled.",
    "Look on the bright side: the trip was cancelled.",
  ],
  [
    "par for the course",
    "normal and expected",
    "a golf score",
    "a school timetable",
    "Delays are par for the course on this railway.",
    "On this railway, the eight o'clock train has not left at eight since March.",
    "Delays are business as usual on this railway.",
    "Delays are the name of the game on this railway.",
  ],
  [
    "a wake-up call",
    "an event that makes people see a danger",
    "an alarm clock",
    "a phone call in the morning",
    "The flood was a wake-up call for the town.",
    "After the flood, the town council voted to move the school off the riverbank.",
    "The flood was an eye-opener for the town.",
    "The flood rang alarm bells for the town.",
  ],
  [
    "go the extra mile",
    "do more than is expected",
    "walk a long way",
    "drive too far",
    "The nurses always go the extra mile.",
    "The night nurse learned each patient's favorite song and hummed it at bedtime.",
    "The nurses always give one hundred and ten percent.",
    "The nurses always bend over backwards.",
  ],
  [
    "the elephant in the room",
    "an obvious problem nobody mentions",
    "a large animal indoors",
    "a crowded party",
    "The budget was the elephant in the room.",
    "Everyone praised the plan, and no one asked how a town with no money would pay for it.",
    "The budget was the skeleton in the closet.",
    "The budget was the issue everyone swept under the rug.",
  ],
] as const;

const clicheLabels = join([
  ...cliches.map(([, , , , sentence]) => `${sentence}|cliché`),
  ...cliches.map(([, , , , , fresh]) => `${fresh}|fresh`),
  ...cliches.map(([, , , , , , other]) => `${other}|cliché`),
]);

const revisionLines = join(cliches.map(([, , , , sentence, fresh, a, b]) => `${sentence}|${fresh}|${a}|${b}`));

const meaningLines = join(cliches.map(([phrase, right, a, b]) => `What does the cliché *${phrase}* say?|${right}|${a}|${b}`));

const freshLanguage = topic("writing", {
  id: "replacing-cliches",
  title: ["Replacing Clichés", "替换陈词滥调"],
  summary: [
    "Clichés, phrases such as *a piece of cake* and *at the end of the day* that were vivid once and are worn out now, and how to replace them with a precise detail.",
    "陈词滥调，即 *a piece of cake* 和 *at the end of the day* 这类曾经生动、如今已被用滥的说法，以及如何用一个准确的细节替换它们。",
  ],
  intro: [
    "Writing *The rescue arrived in the nick of time* hands the reader a pre-packaged phrase; writing *The rescue boat reached the pier just as the roof beam snapped* puts the reader on the dock. In this topic, you unpack what clichés mean, tell fresh details from stock phrases, and pick concrete revisions.",
    "写 *The rescue arrived in the nick of time* 只是递给读者一句现成套话；写 *The rescue boat reached the pier just as the roof beam snapped* 才让读者身临其境。本主题带你拆解陈词滥调的本意、区分新鲜细节与套话，并选出具体的改写。",
  ],
  after: ["choosing-precise-diction"],
  points: [
    choose(
      "what-a-cliche-says",
      ["What a Cliché Says", "陈词滥调说了什么"],
      [
        "A **cliché** is a phrase used so often that readers no longer see it: *a piece of cake*, *only time will tell*, *at the end of the day*. Before you can replace one, know what it says in plain words: *a piece of cake* means *very easy*. Then ask what, in your subject, shows that.\n\n> **Watch out.** Reject any option that translates the cliché word for word—idiomatic clichés (*cold feet*, *break the ice*, *burn the midnight oil*) almost never mean their literal objects.",
        "**陈词滥调**是用得太多、读者已经视而不见的说法：*a piece of cake*、*only time will tell*、*at the end of the day*。要替换它，先要知道它用平白的话说是什么意思：*a piece of cake* 的意思是 *very easy*（很容易）。然后问一问，在你写的内容里，什么能表现出这一点。\n\n> **注意。** 排除逐字直译的选项——*cold feet*、*break the ice*、*burn the midnight oil* 这类固定说法几乎从不指字面上的物体。",
      ],
      ["What does this cliché say in plain words?", "这个陈词滥调用平白的话说是什么意思？"],
      meaningLines,
      (right) => [
        `In plain words it says **${right}**.\n\n**Check.** Picture the phrase in an everyday sentence and replace it with **${right}**: the figurative sense stays intact, unlike a literal word-for-word reading.`,
        `用平白的话说，它的意思是 **${right}**。\n\n**检验。** 把这个说法放进日常句子里，用 **${right}** 替换它：比喻义完整保留，而不像字面直译那样荒唐。`,
      ],
      [
        ["*{wrong}* reads the words literally, not as the fixed phrase.", "“{wrong}”是按字面理解，而不是把它当作固定说法。"],
        ["*{wrong}* is not what the phrase is used to say.", "“{wrong}”不是这个说法通常表达的意思。"],
      ],
    ),
    label(
      "cliche-or-fresh",
      ["Cliché or Fresh", "陈词滥调还是新鲜表达"],
      [
        "A sentence built on a cliché tells the reader what to think in borrowed words: *The test was a piece of cake*. A **fresh** sentence shows it with a detail only this subject has: *I finished the test in ten minutes*. Swapping one stock phrase for another, *as easy as pie*, is still a cliché.\n\n> **Watch out.** Ask whether the key phrase could be lifted out and dropped unchanged into a hundred unrelated essays—if it is a ready-made slogan (*a silver lining*, *like clockwork*, *push the envelope*), it is a **cliché**.",
        "建立在陈词滥调上的句子是用借来的话告诉读者该怎么想：*The test was a piece of cake*。**新鲜**的句子用只有这个对象才有的细节来表现：*I finished the test in ten minutes*。用一个现成说法替换另一个，比如 *as easy as pie*，仍然是陈词滥调。\n\n> **注意。** 问问自己核心短语能不能原封不动搬进一百篇毫不相干的文章里——如果是现成套话（如 *a silver lining*、*like clockwork*），那就是**陈词滥调**。",
      ],
      ["Does this sentence lean on a cliché?", "这个句子依赖陈词滥调吗？"],
      clicheLabels,
      {
        cliché: L(
          "陈词滥调",
          "The sentence leans on a stock phrase that readers have met many times.\n\n**Check.** Spot the ready-made figurative phrase carrying the sentence's point: it is a worn-out expression rather than a specific observation from this scene.",
          "这个句子依赖读者见过许多次的现成说法。\n\n**检验。** 找出撑起句意的现成比喻短语：那是听腻了的套话，而不是眼前场景独有的具体观察。",
          "The sentence says what it means with a detail of its own.",
          "这个句子用自己的细节表达意思。",
        ),
        fresh: L(
          "新鲜",
          "The sentence shows its point with a precise detail, not a stock phrase.\n\n**Check.** Notice the concrete numbers, actions, or sensory details unique to this situation—none of them rely on a pre-packaged idiom.",
          "这个句子用准确的细节而不是现成说法来表达意思。\n\n**检验。** 留意句中专属于这个情境的具体数字、动作或感官细节——完全没有借用现成套话。",
          "The sentence leans on a stock phrase.",
          "这个句子依赖现成的说法。",
        ),
      },
    ),
    choose(
      "the-fresh-revision",
      ["The Fresh Revision", "新鲜的修改"],
      [
        "To revise a cliché, keep the point and replace the phrase with a detail: what happened, how many, how long, what someone saw or heard. *When he finished, the silence was deafening* becomes *When he finished, no one moved; a chair creaked*. A revision that uses another stock phrase has changed nothing.\n\n> **Watch out.** Do not pick an option just because it sounds idiomatic or punchy—the two wrong choices simply swap the original cliché for *another* worn-out phrase.",
        "修改陈词滥调时，保留要表达的意思，用细节替换那个说法：发生了什么、有多少、多久、某人看到或听到了什么。*When he finished, the silence was deafening* 改成 *When he finished, no one moved; a chair creaked*。用另一个现成说法来改，等于什么也没改。\n\n> **注意。** 别因为某个选项听起来地道顺口就选它——两个干扰项只是把原来的陈词滥调换成了*另一句*陈词滥调。",
      ],
      ["Which revision replaces the cliché with a detail?", "哪个修改用细节替换了陈词滥调？"],
      revisionLines,
      (right) => [
        `"${right}" keeps the point and shows it with a detail.\n\n**Check.** Look for concrete evidence—a time, count, place, or physical action—that lets the reader *see* the point instead of hearing another stock idiom.`,
        `“${right}”保留了意思，并用细节把它表现了出来。\n\n**检验。** 找一找具体证据——时间、数字、地点或具体动作——让读者亲眼“看见”要点，而不是再听一遍现成套话。`,
      ],
      [
        ['"{wrong}" trades one cliché for another.', "“{wrong}”只是用一个陈词滥调换了另一个。"],
        ['"{wrong}" still leans on stock phrases.', "“{wrong}”仍然依赖现成的说法。"],
      ],
    ),
  ],
});

/** grammarTopics10c are the topics of grade 10 added for agreement in hard cases and fresh language. */
export const grammarTopics10c: readonly TopicDef[] = [hardAgreement, freshLanguage];
