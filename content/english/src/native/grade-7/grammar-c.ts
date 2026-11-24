// Grade 7: a third knowledge point for each grammar topic of the grade, most of them applying the rule in editing.

import type { KnowledgePointDef } from "@ga/content";
import { choose, type Label, label } from "../grade-6/kit.ts";

const join = (lines: readonly string[]) => lines.join("\n");

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

const doer = choose(
  "who-did-it-in-a-passive",
  ["Who Did It in a Passive", "被动句中的施动者"],
  [
    "In a passive sentence the subject receives the action, and the one who did it comes after *by*, if at all: *The ball was kicked **by Sam***. Often there is no *by* phrase: *The window was broken* does not say who broke it. Reading a passive closely means asking who acted, and noticing when the sentence does not say.\n\n> **Watch out.** Do not mistake a time or place phrase (*in 1890*, *during the game*, *after the storm*) for the doer: only a *by* phrase names who performed the action.",
    "在被动句中，主语是动作的承受者，施动者如果出现，放在 *by* 后面：*The ball was kicked **by Sam***。很多时候没有 *by* 短语：*The window was broken* 并没有说是谁打破的。仔细读被动句，就要问是谁做的，并注意句子什么时候没有说。\n\n> **注意。** 不要把时间或地点短语（如 *in 1890*、*during the game*、*after the storm*）当成施动者：只有 *by* 短语才点明动作是谁做的。",
  ],
  ["Who did the action?", "动作是谁做的？"],
  `
  The ball was kicked by Sam.|Sam|the ball|the sentence does not say
  The cake was baked by my grandmother.|my grandmother|the cake|the sentence does not say
  The window was broken during the game.|the sentence does not say|the window|the game
  The letter was written by a famous poet.|a famous poet|the letter|the sentence does not say
  The bridge was built in 1890.|the sentence does not say|the bridge|1890
  The thief was caught by two police officers.|two police officers|the thief|the sentence does not say
  The rules were changed last year.|the sentence does not say|the rules|last year
  The song was sung by the whole class.|the whole class|the song|the sentence does not say
  The trees were planted along the river.|the sentence does not say|the trees|the river
  The prize was won by a girl from Kenya.|a girl from Kenya|the prize|the sentence does not say
  The fence was painted by my uncle.|my uncle|the fence|the sentence does not say
  The money was stolen last night.|the sentence does not say|the money|last night
  The play was written by a student.|a student|the play|the sentence does not say
  The road was closed after the storm.|the sentence does not say|the road|the storm
  The fish was caught by my little sister.|my little sister|the fish|the sentence does not say
  The house was sold in March.|the sentence does not say|the house|March
  The speech was given by the mayor.|the mayor|the speech|the sentence does not say
  The cookies were eaten before lunch.|the sentence does not say|the cookies|lunch
  The picture was drawn by a famous artist.|a famous artist|the picture|the sentence does not say
  The mistake was found in the second test.|the sentence does not say|the mistake|the second test
  The game was won by the visiting team.|the visiting team|the game|the sentence does not say
  The lights were turned off at midnight.|the sentence does not say|the lights|midnight
  The car was repaired by a mechanic.|a mechanic|the car|the sentence does not say
  The message was deleted yesterday.|the sentence does not say|the message|yesterday
  The trees were cut down by the city.|the city|the trees|the sentence does not say
  The bell was rung at noon.|the sentence does not say|the bell|noon
  The puppy was rescued by a firefighter.|a firefighter|the puppy|the sentence does not say
  The prices were raised in January.|the sentence does not say|the prices|January
  The book was read by every student in the class.|every student in the class|the book|the sentence does not say
  The vase was knocked over during the party.|the sentence does not say|the vase|the party
  `,
  (right) => [
    right === "the sentence does not say"
      ? "There is no *by* phrase naming an actor, so the sentence does not say who performed the action.\n\n**Check.** Try rewriting the sentence in the active voice: you have to supply a blank subject like *someone*, proving the doer is left out."
      : `*${right}* follows *by*, so *${right}* performed the action while the sentence's subject received it.\n\n**Check.** Flip the sentence into the active voice with *${right}* as the subject: the meaning stays identical.`,
    right === "the sentence does not say"
      ? "句中没有点出施动者的 *by* 短语，所以句子并没有说是谁做的。\n\n**检验。** 试着把句子改写成主动语态：你只能补一个“某人”当主语，说明原句确实没提施动者。"
      : `*${right}* 跟在 *by* 后面，因此是 *${right}* 发出了动作，而句子的主语是承受者。\n\n**检验。** 把 *${right}* 改作主动句的主语读一遍，句意完全不变。`,
  ],
  [
    ["*{wrong}* is the subject, which receives the action in a passive.", "*{wrong}* 是主语，在被动句中是动作的承受者。"],
    ["*{wrong}* is not the answer: look for a *by* phrase.", "*{wrong}* 不对：找一找 *by* 短语。"],
  ],
);

const would = choose(
  "would-in-the-result",
  ["Would in the Result", "结果中的 would"],
  [
    "An unreal condition, something that is not true now, uses the past form in the *if* clause and **would** (or *could*, *might*) in the result: *If I had wings, I **would** fly*. *Will* belongs to real conditions, ones that may well happen: *If it rains, we will stay in*.\n\n> **Watch out.** Match the two halves of the conditional: a present-tense *if* clause (*If it rains*) pairs with *will*, while a past-tense or *were* *if* clause (*If I had wings*, *If she were taller*) pairs with *would*, *could*, or *might*.",
    "不真实的条件，即现在并不成立的事，在 *if* 从句中用过去式，在结果中用 **would**（或 *could*、*might*）：*If I had wings, I **would** fly*。*will* 用于很可能发生的真实条件：*If it rains, we will stay in*。\n\n> **注意。** 条件句前后两半要配对：现在时的 *if* 从句（*If it rains*）配 *will*，过去式或 *were* 的 *if* 从句（*If I had wings*、*If she were taller*）配 *would*、*could* 或 *might*。",
  ],
  ["Which word completes the sentence?", "哪个词能补全句子？"],
  `
  If I had wings, I ___ fly to school.|would|will|am
  If she were taller, she ___ reach the shelf.|could|can|is
  If we lived by the sea, we ___ swim every day.|would|will|are
  If it rains tomorrow, we ___ stay inside.|will|would|were
  If dogs could talk, they ___ tell us their secrets.|would|will|are
  If you heat ice, it ___ melt.|will|would|were
  If I knew the answer, I ___ tell you.|would|will|am
  If the bus comes late, we ___ miss the start.|will|would|were
  If he practiced more, he ___ win the match.|might|will|is
  If you study tonight, you ___ do well on the test.|will|would|were
  If I had a car, I ___ drive to the beach.|would|will|am
  If he were older, he ___ vote.|could|can|is
  If we had more time, we ___ visit the museum.|would|will|are
  If it snows tonight, the school ___ close.|will|would|were
  If cats could fly, they ___ catch birds easily.|would|will|are
  If you mix red and blue, you ___ get purple.|will|would|were
  If I won the lottery, I ___ buy a house.|would|will|am
  If the store is open, we ___ buy some milk.|will|would|were
  If she trained harder, she ___ make the team.|might|will|is
  If you leave now, you ___ catch the train.|will|would|were
  If I lived in Paris, I ___ eat croissants every day.|would|will|am
  If they were here, they ___ help us.|could|can|are
  If we had a boat, we ___ sail to the island.|would|will|are
  If the bus is late, I ___ call you.|will|would|were
  If trees could talk, they ___ tell old stories.|would|will|are
  If you drop the glass, it ___ break.|will|would|were
  If I knew her number, I ___ call her.|would|will|am
  If the weather is nice, we ___ have a picnic.|will|would|were
  If he studied more, he ___ pass the exam.|might|will|is
  If you water the plant, it ___ grow.|will|would|were
  `,
  (right, shown) => [
    `The completed sentence reads *${shown.replace("___", right)}* — the condition is ${right === "will" ? "real and likely, so the result takes *will*" : "imaginary or contrary to fact, so the result takes a past modal (*would*, *could*, or *might*)"}.\n\n**Check.** Look back at the verb in the *if* clause: ${right === "will" ? "it is in the present tense, matching *will*" : `it is a past form or *were*, matching *${right}*`}.`,
    `补全后是 *${shown.replace("___", right)}*：这个条件${right === "will" ? "是可能发生的真实条件，结果用 *will*" : "是假设或不真实的条件，结果用过去式情态动词（*would*、*could* 或 *might*）"}。\n\n**检验。** 回看 *if* 从句里的动词：${right === "will" ? "它是现在时，正好与 *will* 搭配" : `它是过去式或 *were*，正好与 *${right}* 搭配`}。`,
  ],
  [
    ["*{wrong}* belongs to the other kind of condition, real or unreal.", "*{wrong}* 属于另一种条件，真实或不真实。"],
    ["*{wrong}* does not make a result clause here.", "*{wrong}* 在这里构不成结果从句。"],
  ],
);

const correlative = choose(
  "parallel-after-not-only-and-either",
  ["Parallel After Not Only and Either", "not only 和 either 后的平行结构"],
  [
    "Pairs such as *not only … but also*, *either … or*, *neither … nor* and *both … and* need the **same kind of words** after each half: *She is not only smart but also **kind*** (two adjectives); *We can either **walk** or **take** the bus* (two verbs).\n\n> **Watch out.** Check the exact word right after the first partner (*not only*, *either*, *neither*, *both*): if it is a preposition (*by card*), a gerund (*swimming*), or a verb (*walk*), the second partner must open with the same grammatical form.",
    "*not only … but also*、*either … or*、*neither … nor* 和 *both … and* 这样的成对连词，两半后面要跟**同类的词**：*She is not only smart but also **kind***（两个形容词）；*We can either **walk** or **take** the bus*（两个动词）。\n\n> **注意。** 盯紧前半个连词（*not only*、*either*、*neither*、*both*）紧后面的成分：如果是介词短语（*by card*）、动名词（*swimming*）或动词原形（*walk*），后半个连词后面也必须用同样的语法形式。",
  ],
  ["Which words complete the sentence in parallel?", "哪组词能用平行结构补全句子？"],
  `
  She is not only smart but also ___.|kind|has kindness|being kind
  We can either walk or ___.|take the bus|the bus|taking the bus
  The film was both funny and ___.|sad|it made us sad|sadness
  He neither called nor ___.|wrote|a letter|writing
  The coach praised not only our speed but also ___.|our teamwork|we worked as a team|working together
  You can pay either by card or ___.|by cash|you can use cash|cash paying
  The garden was both large and ___.|beautiful|it had flowers|beauty
  She likes neither swimming nor ___.|running|to run|she runs
  The book is not only long but also ___.|boring|it bores me|a bore to read
  We will either finish today or ___.|finish tomorrow|tomorrow is fine|finishing tomorrow
  He is not only fast but also ___.|strong|has strength|being strong
  We can either cook at home or ___.|eat out|a restaurant|eating out
  The test was both long and ___.|hard|it was hard|hardness
  She neither smiled nor ___.|waved|a wave|waving
  The teacher praised not only our ideas but also ___.|our writing|we wrote well|writing it well
  You can travel either by train or ___.|by plane|you can fly|plane flying
  The room was both bright and ___.|warm|it felt warm|warmth
  He enjoys neither singing nor ___.|dancing|to dance|he dances
  The movie was not only exciting but also ___.|funny|it made us laugh|a comedy to watch
  They will either win today or ___.|win next week|next week is fine|winning next week
  The new park is both large and ___.|peaceful|it has peace|peacefulness
  I want not only to travel but also ___.|to learn languages|languages to learn|learning languages
  She can either sing or ___.|play the piano|the piano|playing the piano
  The soup was neither hot nor ___.|tasty|it had taste|tastiness
  The plan saves not only time but also ___.|money|we save money|saving money
  We will meet either at the library or ___.|at the park|the park is better|meeting at the park
  The puppy is both playful and ___.|gentle|it is gentle|gentleness
  He neither apologized nor ___.|explained|an explanation|explaining
  The trip was not only cheap but also ___.|fun|we had fun|funny times
  You may either stay or ___.|leave|your leaving|leaving now
  `,
  (right) => [
    `**${right}** matches the grammatical form that follows the first half of the correlative pair.\n\n**Check.** Read the opening of the sentence with only the second item (*${right}*), dropping the first half of the pair: it plugs into the sentence just as cleanly as the first item did.`,
    `**${right}** 与成对连词前半部分后面的语法结构完全一致。\n\n**检验。** 去掉前半个并列项，只把句子开头和 *${right}* 连起来读一遍：它和前半项一样顺畅地接在主干后面。`,
  ],
  [
    [
      "*{wrong}* is a different kind of word or a whole clause, so the halves are not parallel.",
      "*{wrong}* 是另一类词或一个完整分句，两半就不平行了。",
    ],
    ["*{wrong}* uses a different form from the first half.", "*{wrong}* 与前半部分的形式不同。"],
  ],
);

const latinVerb = choose(
  "the-verb-with-a-latin-plural",
  ["The Verb with a Latin Plural", "拉丁语复数后的动词"],
  [
    "A plural from Latin or Greek takes a **plural** verb, even without an *-s*: *The criteria **are** clear*; *These phenomena **are** rare*; *The bacteria **multiply***. Its singular takes a singular verb: *The crisis **is** over*; *This analysis **shows***. In formal writing *data* is plural: *The data **show***.\n\n> **Watch out.** Do not let *-is* fool you into thinking a noun is plural: *crisis*, *analysis*, and *diagnosis* are **singular**, while *crises*, *analyses*, and *diagnoses* are plural.",
    "来自拉丁语或希腊语的复数名词即使没有 *-s* 也要用**复数**动词：*The criteria **are** clear*；*These phenomena **are** rare*；*The bacteria **multiply***。它的单数形式用单数动词：*The crisis **is** over*；*This analysis **shows***。在正式写作中，*data* 是复数：*The data **show***。\n\n> **注意。** 别被词尾的 *-is* 误导成复数：*crisis*、*analysis*、*diagnosis* 都是**单数**，它们的复数分别是 *crises*、*analyses*、*diagnoses*。",
  ],
  ["Which verb agrees with the subject?", "哪个动词与主语一致？"],
  `
  The criteria for the prize ___ clear.|are|is|being
  These phenomena ___ rare in winter.|are|is|being
  The bacteria ___ quickly in warm water.|multiply|multiplies|multiplying
  The crisis ___ over at last.|is|are|being
  This analysis ___ a rise in prices.|shows|show|showing
  The data from the survey ___ a clear pattern.|show|shows|showing
  The alumni ___ a reunion every June.|hold|holds|holding
  The main criterion ___ speed.|is|are|being
  The fungi ___ on the fallen log.|grow|grows|growing
  Both analyses ___ the same result.|reach|reaches|reaching
  The criteria for the job ___ strict.|are|is|being
  These phenomena ___ hard to explain.|are|is|being
  Bacteria ___ in the warm, wet soil.|thrive|thrives|thriving
  The crisis ___ getting worse.|is|are|being
  The analysis ___ that sales fell.|suggests|suggest|suggesting
  The data ___ that more students walk to school.|show|shows|showing
  The alumni ___ money to the school.|give|gives|giving
  One criterion ___ cost.|is|are|being
  The fungi ___ under the old leaves.|spread|spreads|spreading
  The two crises ___ at the same time.|overlap|overlaps|overlapping
  The cacti ___ little water.|need|needs|needing
  That phenomenon ___ every summer.|occurs|occur|occurring
  The curricula of both schools ___ new.|are|is|being
  The stimuli ___ the plants to grow.|cause|causes|causing
  This bacterium ___ illness.|causes|cause|causing
  The theses ___ due in May.|are|is|being
  The nuclei of the cells ___ dark.|look|looks|looking
  The diagnosis ___ a relief to the family.|was|were|being
  The larvae ___ into moths.|turn|turns|turning
  The appendices ___ extra charts.|contain|contains|containing
  `,
  (right, shown) => [
    `The completed sentence reads *${shown.replace("___", right)}* — **${right}** is a finite verb that agrees in number with the Latin or Greek subject.\n\n**Check.** Replace the subject with *it* (if singular, ending in *-on*, *-um*, *-us*, or *-is*) or *they* (if plural, ending in *-a*, *-i*, *-ae*, *-es*, or *-ices*): *${right}* matches that pronoun.`,
    `补全后是 *${shown.replace("___", right)}*：**${right}** 是限定动词，在单复数上与这个拉丁语或希腊语主语一致。\n\n**检验。** 把主语换成 *it*（单数，如 *-on*、*-um*、*-us*、*-is*）或 *they*（复数，如 *-a*、*-i*、*-ae*、*-es*、*-ices*），*${right}* 正好与之搭配。`,
  ],
  [
    ["*{wrong}* treats the noun as the wrong number: these plurals have no *-s*.", "*{wrong}* 把名词的单复数弄错了：这些复数没有 *-s*。"],
    ["*{wrong}* is not a finite verb, so the sentence would have none.", "*{wrong}* 不是限定动词，句子就没有谓语动词了。"],
  ],
);

const fragment = choose(
  "fixing-a-fragment",
  ["Fixing a Fragment", "修正句子片段"],
  [
    "A phrase or a dependent clause punctuated as a sentence is a **fragment**: *After the long game.* *Because the bus was late.* Fix it by joining it to a nearby independent clause: *After the long game, we rested.* Adding a period or a capital does not help; it needs a subject and verb that can stand alone.\n\n> **Watch out.** Making a fragment longer (*After the long game ended.*) or moving it to the front (*Because the bus was late. I missed class.*) still leaves a fragment behind a period.",
    "被当作句子加了句号的短语或从句是**句子片段**：*After the long game.* *Because the bus was late.* 修正的方法是把它与附近的独立分句连在一起：*After the long game, we rested.* 加句号或大写字母都没用；它需要一个能独立存在的主语和谓语。\n\n> **注意。** 给片段加长（*After the long game ended.*）或者把它挪到前面（*Because the bus was late. I missed class.*），只要还用句号单独隔着，它依然是句子片段。",
  ],
  ["Which revision fixes the fragment?", "哪个修改纠正了句子片段？"],
  `
  We rested. After the long game.|After the long game, we rested.|We rested. After the long game ended.|After the long game. We rested and ate.
  I missed class. Because the bus was late.|I missed class because the bus was late.|I missed class. Because the bus was very late.|Because the bus was late. I missed class.
  She waited. Until the rain stopped.|She waited until the rain stopped.|She waited. Until the rain stopped at last.|Until the rain stopped. She waited.
  The dog barked. At the mail carrier.|The dog barked at the mail carrier.|The dog barked. At the mail carrier again.|At the mail carrier. The dog barked.
  We found shells. Walking along the beach.|Walking along the beach, we found shells.|We found shells. Walking slowly along the beach.|Walking along the beach. We found shells.
  He smiled. When he saw the cake.|He smiled when he saw the cake.|He smiled. When he saw the big cake.|When he saw the cake. He smiled.
  The town flooded. After three days of rain.|The town flooded after three days of rain.|The town flooded. After three long days of rain.|After three days of rain. The town flooded.
  I read a book. Which my aunt gave me.|I read a book which my aunt gave me.|I read a book. Which my aunt gave me last year.|Which my aunt gave me. I read a book.
  They cheered. As the runners crossed the line.|They cheered as the runners crossed the line.|They cheered. As the runners crossed the finish line.|As the runners crossed the line. They cheered.
  Mia laughed. Since the joke was silly.|Mia laughed since the joke was silly.|Mia laughed. Since the joke was very silly.|Since the joke was silly. Mia laughed.
  We went home. After the party ended.|We went home after the party ended.|We went home. After the party ended late.|After the party ended. We went home.
  I stayed inside. Because it was cold.|I stayed inside because it was cold.|I stayed inside. Because it was very cold.|Because it was cold. I stayed inside.
  He kept running. Until he reached the gate.|He kept running until he reached the gate.|He kept running. Until he reached the front gate.|Until he reached the gate. He kept running.
  The cat slept. On the warm windowsill.|The cat slept on the warm windowsill.|The cat slept. On the warm windowsill again.|On the warm windowsill. The cat slept.
  We saw deer. Driving through the forest.|Driving through the forest, we saw deer.|We saw deer. Driving slowly through the forest.|Driving through the forest. We saw deer.
  She cried. When she heard the news.|She cried when she heard the news.|She cried. When she heard the sad news.|When she heard the news. She cried.
  The game stopped. During the thunderstorm.|The game stopped during the thunderstorm.|The game stopped. During the long thunderstorm.|During the thunderstorm. The game stopped.
  I lost the pen. That my friend lent me.|I lost the pen that my friend lent me.|I lost the pen. That my friend lent me yesterday.|That my friend lent me. I lost the pen.
  The crowd went quiet. As the singer stepped forward.|The crowd went quiet as the singer stepped forward.|The crowd went quiet. As the singer slowly stepped forward.|As the singer stepped forward. The crowd went quiet.
  Ben stayed up late. Since there was no school.|Ben stayed up late since there was no school.|Ben stayed up late. Since there was no school the next day.|Since there was no school. Ben stayed up late.
  The birds sang. Before the sun came up.|The birds sang before the sun came up.|The birds sang. Before the sun came up over the hill.|Before the sun came up. The birds sang.
  We ate lunch. In the shade of a tree.|We ate lunch in the shade of a tree.|We ate lunch. In the shade of a tall tree.|In the shade of a tree. We ate lunch.
  He fell asleep. While the movie was playing.|He fell asleep while the movie was playing.|He fell asleep. While the long movie was playing.|While the movie was playing. He fell asleep.
  I met a girl. Who knows my cousin.|I met a girl who knows my cousin.|I met a girl. Who knows my cousin from school.|Who knows my cousin. I met a girl.
  They left early. To avoid the traffic.|They left early to avoid the traffic.|They left early. To avoid the heavy traffic.|To avoid the traffic. They left early.
  The dog waited. By the front door.|The dog waited by the front door.|The dog waited. By the big front door.|By the front door. The dog waited.
  We found the map. Hidden under the floor.|We found the map hidden under the floor.|We found the map. Hidden deep under the floor.|Hidden under the floor. We found the map.
  She smiled. Although she was tired.|She smiled although she was tired.|She smiled. Although she was very tired.|Although she was tired. She smiled.
  The bus stopped. At the corner of Main Street.|The bus stopped at the corner of Main Street.|The bus stopped. At the busy corner of Main Street.|At the corner of Main Street. The bus stopped.
  The baby laughed. Whenever the dog barked.|The baby laughed whenever the dog barked.|The baby laughed. Whenever the big dog barked.|Whenever the dog barked. The baby laughed.
  `,
  (right) => [
    `*${right}* attaches the dependent piece to the independent clause so nothing is stranded behind a period.\n\n**Check.** Count the sentences: there is now one complete sentence with a main subject and verb, and no period cutting off a phrase or dependent clause.`,
    `*${right}* 把从属部分和独立分句连成一句，不再让片段孤零零地落在句号后面。\n\n**检验。** 数一数句子个数：现在只有一句带完整主谓的句子，没有句号把短语或从句截断。`,
  ],
  [
    ['"{wrong}" adds words to the fragment but leaves it standing alone.', "“{wrong}”给片段加了词，但它仍然独立成句。"],
    ['"{wrong}" moves the fragment but still punctuates it as a sentence.', "“{wrong}”移动了片段，但仍把它当作句子加标点。"],
  ],
);

const adverbComma = choose(
  "the-comma-with-an-adverb-clause",
  ["The Comma with an Adverb Clause", "状语从句与逗号"],
  [
    "An adverb clause that **opens** a sentence is followed by a comma: *Because it rained, we stayed in*. When the clause comes **last**, it usually needs no comma: *We stayed in because it rained*. A comma between a main clause and a closing *because* clause, or no comma after an opening one, is an error.\n\n> **Watch out.** Never use a semicolon between an adverb clause and a main clause: a semicolon needs a full independent sentence on *both* sides.",
    "**放在句首**的状语从句后面要加逗号：*Because it rained, we stayed in*。从句**放在句末**时，通常不需要逗号：*We stayed in because it rained*。在主句和句末的 *because* 从句之间加逗号，或在句首的从句后面不加逗号，都是错误的。\n\n> **注意。** 状语从句和主句之间绝不能用分号：分号要求**两侧**都是能独立成句的完整分句。",
  ],
  ["Which sentence is punctuated correctly?", "哪个句子的标点正确？"],
  join(
    [
      ["Because it rained", "we stayed in"],
      ["When the bell rang", "the students left"],
      ["If you finish early", "you may read"],
      ["Because she was tired", "she slowed down"],
      ["After the storm passed", "we went outside"],
      ["Before you leave", "turn off the lights"],
      ["Since the shop was closed", "we went home"],
      ["After the guests left", "we washed the dishes"],
      ["Until the bus arrives", "we will wait here"],
      ["As soon as I got home", "I called my friend"],
      ["When the movie ended", "we walked home"],
      ["Because the road was icy", "the bus was late"],
      ["If it snows tonight", "school will close"],
      ["After we ate dinner", "we played a game"],
      ["Before the race started", "the runners stretched"],
      ["When the lights went out", "the baby cried"],
      ["Because he practiced daily", "he played well"],
      ["If you need help", "ask the librarian"],
      ["After the sun set", "the air grew cold"],
      ["Until the paint dries", "do not touch the wall"],
      ["As soon as the door opened", "the dog ran out"],
      ["When Grandma visits", "she bakes bread"],
      ["Because the test was hard", "the teacher gave extra time"],
      ["If the team wins", "we will celebrate"],
      ["Before you swim", "check the water"],
      ["After the concert ended", "the crowd cheered"],
      ["When the alarm rang", "I jumped out of bed"],
      ["Because the shop was busy", "we waited an hour"],
      ["Until the rain stops", "we will stay inside"],
      ["As soon as the bell rings", "the class will begin"],
    ].map(([clause = "", main = ""], i) => {
      const lower = `${clause[0]!.toLowerCase()}${clause.slice(1)}`;
      const cap = `${main[0]!.toUpperCase()}${main.slice(1)}`;
      return i % 2 === 0
        ? `${clause} / ${main}|${clause}, ${main}.|${clause} ${main}.|${clause}; ${main}.`
        : `${main} / ${lower}|${cap} ${lower}.|${cap}, ${lower}.|${cap}; ${lower}.`;
    }),
  ),
  (right) => [
    `*${right}* follows the order rule: a comma after an opening adverb clause, and no comma before a closing one.\n\n**Check.** Spot the subordinating word (*because*, *when*, *if*, *after*, *before*, *until*): if it opens the sentence, a comma separates the two clauses; if it sits in the middle, no comma is needed.`,
    `*${right}* 遵循位置规则：状语从句在句首时后面加逗号，在句末时前面不加逗号。\n\n**检验。** 找到从属连词（*because*、*when*、*if*、*after*、*before*、*until* 等）：它在句首就用逗号隔开两半，在句中就直接连读不加逗号。`,
  ],
  [
    ['"{wrong}" gets the comma wrong for where the adverb clause stands.', "“{wrong}”没有根据状语从句的位置正确使用逗号。"],
    ['"{wrong}" uses a semicolon, which joins only two independent clauses.', "“{wrong}”用了分号，而分号只能连接两个独立分句。"],
  ],
);

const tag = choose(
  "commas-before-a-tag-question",
  ["Commas Before a Tag Question", "反意疑问句前的逗号"],
  [
    "A **tag question** at the end of a sentence, such as *isn't it?* or *did you?*, is set off by a comma, and the sentence ends with a question mark: *It's cold, **isn't it?*** The tag usually reverses the statement: a positive statement takes a negative tag, and a negative statement a positive one.\n\n> **Watch out.** Check two things at once: the comma *before* the tag, and the polarity flip (positive statement → negative tag; negative statement → positive tag).",
    "句末的**反意疑问部分**，如 *isn't it?* 或 *did you?*，要用逗号隔开，整个句子以问号结尾：*It's cold, **isn't it?*** 反意疑问部分通常与陈述部分相反：肯定陈述用否定疑问，否定陈述用肯定疑问。\n\n> **注意。** 要同时核对两点：反意疑问前必须有逗号，且肯否定要翻转（前肯后否、前否后肯）。",
  ],
  ["Which sentence is correct?", "哪个句子正确？"],
  `
  It's cold / isn't it|It's cold, isn't it?|It's cold isn't it?|It's cold, is it?
  You finished the book / didn't you|You finished the book, didn't you?|You finished the book didn't you?|You finished the book, did you?
  She can swim / can't she|She can swim, can't she?|She can swim can't she?|She can swim, can she?
  They aren't coming / are they|They aren't coming, are they?|They aren't coming are they?|They aren't coming, aren't they?
  He likes pizza / doesn't he|He likes pizza, doesn't he?|He likes pizza doesn't he?|He likes pizza, does he?
  We won the game / didn't we|We won the game, didn't we?|We won the game didn't we?|We won the game, did we?
  You won't forget / will you|You won't forget, will you?|You won't forget will you?|You won't forget, won't you?
  The shop is open / isn't it|The shop is open, isn't it?|The shop is open isn't it?|The shop is open, is it?
  She hasn't left yet / has she|She hasn't left yet, has she?|She hasn't left yet has she?|She hasn't left yet, hasn't she?
  This is your coat / isn't it|This is your coat, isn't it?|This is your coat isn't it?|This is your coat, is it?
  It's raining / isn't it|It's raining, isn't it?|It's raining isn't it?|It's raining, is it?
  You saw the movie / didn't you|You saw the movie, didn't you?|You saw the movie didn't you?|You saw the movie, did you?
  He can drive / can't he|He can drive, can't he?|He can drive can't he?|He can drive, can he?
  We aren't late / are we|We aren't late, are we?|We aren't late are we?|We aren't late, aren't we?
  She plays chess / doesn't she|She plays chess, doesn't she?|She plays chess doesn't she?|She plays chess, does she?
  They lost the match / didn't they|They lost the match, didn't they?|They lost the match didn't they?|They lost the match, did they?
  You won't tell anyone / will you|You won't tell anyone, will you?|You won't tell anyone will you?|You won't tell anyone, won't you?
  The water is warm / isn't it|The water is warm, isn't it?|The water is warm isn't it?|The water is warm, is it?
  He hasn't eaten yet / has he|He hasn't eaten yet, has he?|He hasn't eaten yet has he?|He hasn't eaten yet, hasn't he?
  That is your bike / isn't it|That is your bike, isn't it?|That is your bike isn't it?|That is your bike, is it?
  You like chocolate / don't you|You like chocolate, don't you?|You like chocolate don't you?|You like chocolate, do you?
  She was at the party / wasn't she|She was at the party, wasn't she?|She was at the party wasn't she?|She was at the party, was she?
  We should leave now / shouldn't we|We should leave now, shouldn't we?|We should leave now shouldn't we?|We should leave now, should we?
  They don't know / do they|They don't know, do they?|They don't know do they?|They don't know, don't they?
  He will come / won't he|He will come, won't he?|He will come won't he?|He will come, will he?
  The test wasn't hard / was it|The test wasn't hard, was it?|The test wasn't hard was it?|The test wasn't hard, wasn't it?
  You have a sister / don't you|You have a sister, don't you?|You have a sister don't you?|You have a sister, do you?
  It isn't broken / is it|It isn't broken, is it?|It isn't broken is it?|It isn't broken, isn't it?
  She could hear us / couldn't she|She could hear us, couldn't she?|She could hear us couldn't she?|She could hear us, could she?
  They have finished / haven't they|They have finished, haven't they?|They have finished haven't they?|They have finished, have they?
  `,
  (right) => [
    `*${right}* sets off the tag question with a comma and flips the statement's positive/negative sign.\n\n**Check.** Verify both parts: a comma sits right before the tag, and one half has *n't* while the other does not.`,
    `*${right}* 用逗号隔开了反意疑问部分，并让前后肯否定相反。\n\n**检验。** 核对两点：反意疑问前有逗号，且前后两半恰好只有一半带否定缩略 *n't*。`,
  ],
  [
    ['"{wrong}" leaves out the comma before the tag.', "“{wrong}”在反意疑问部分前漏掉了逗号。"],
    ['"{wrong}" does not reverse the statement in the tag.', "“{wrong}”的反意疑问部分没有与陈述部分相反。"],
  ],
);

const hadForm = choose(
  "forming-the-past-perfect",
  ["Forming the Past Perfect", "过去完成时的构成"],
  [
    "The past perfect is **had** plus the **past participle**, for every subject: *By the time we arrived, the train **had left***. With an irregular verb, take care to use the participle, not the simple past: *had gone*, *had written*, *had eaten*. *Has* belongs to the present perfect.\n\n> **Watch out.** Simple past forms like *ate*, *went*, *wrote*, *saw*, and *broke* never follow *had*. Test the participle in *It has already ___* (*gone*, *written*, *eaten*, *seen*, *broken*).",
    "过去完成时由 **had** 加**过去分词**构成，所有主语都一样：*By the time we arrived, the train **had left***。遇到不规则动词时，要注意用过去分词而不是一般过去式：*had gone*、*had written*、*had eaten*。*has* 属于现在完成时。\n\n> **注意。** *ate*、*went*、*wrote*、*saw*、*broke* 这类一般过去式绝不能跟在 *had* 后面。可以用 *already* 搭配过去分词检验（*gone*、*written*、*eaten*、*seen*、*broken*）。",
  ],
  ["Which form completes the sentence?", "哪个形式能补全句子？"],
  `
  By the time we arrived, the train ___.|had left|had leave|has left
  She ___ the book before she saw the film.|had read|had readed|has read
  We ___ dinner when the phone rang.|had eaten|had ate|has eaten
  They ___ home before the storm began.|had gone|had went|has gone
  He ___ the letter, so he knew the news.|had written|had wrote|has written
  I ___ my keys, so I could not get in.|had lost|had lose|have lost
  The guests ___ by the time we finished.|had arrived|had arrive|have arrived
  The river ___ over its banks before dawn.|had risen|had rose|has risen
  She ___ the race twice before that year.|had won|had win|has won
  The class ___ the song many times.|had sung|had sang|has sung
  By noon, the snow ___.|had melted|had melt|has melted
  He ___ the movie before he read the book.|had seen|had saw|has seen
  We ___ the dishes when the guests arrived.|had washed|had wash|have washed
  They ___ the house before the rain started.|had left|had leaved|have left
  She ___ a poem, so she read it aloud.|had written|had wrote|has written
  I ___ my homework, so I went outside.|had finished|had finish|have finished
  The plane ___ by the time we got to the gate.|had taken off|had took off|has taken off
  The children ___ asleep before the movie ended.|had fallen|had fell|have fallen
  He ___ that song many times before.|had heard|had hear|has heard
  The team ___ every game that season.|had won|had winned|has won
  By Friday, she ___ three books.|had read|had readed|has read
  We ___ the museum twice before.|had visited|had visit|have visited
  The guests ___ all the cake by eight.|had eaten|had ate|have eaten
  He ___ his arm, so he could not play.|had broken|had broke|has broken
  The store ___ before we got there.|had closed|had close|has closed
  I ___ her before at a party.|had met|had meet|have met
  The sun ___ by the time we reached camp.|had set|had setted|has set
  They ___ the bridge long before the war.|had built|had builded|have built
  She ___ the answer, so she raised her hand.|had known|had knew|has known
  The bus ___ by the time I ran outside.|had gone|had went|has gone
  `,
  (right) => [
    `**${right}** pairs *had* with the true past participle, forming the past perfect.\n\n**Check.** Check both pieces: *had* (not *has* or *have*) anchors the tense in the past, and the verb after *had* is the third principal part (the past participle).`,
    `**${right}** 用 *had* 搭配真正的过去分词，构成过去完成时。\n\n**检验。** 核对两部分：助动词用 *had*（而不是 *has* 或 *have*）锁定在过去，后面的动词是过去分词形式。`,
  ],
  [
    ["*{wrong}* puts the wrong form of the verb after *had*.", "*{wrong}* 在 *had* 后面用了错误的动词形式。"],
    ["*{wrong}* is the present perfect, not the past perfect.", "*{wrong}* 是现在完成时，不是过去完成时。"],
  ],
);

const splice = choose(
  "fixing-a-comma-splice",
  ["Fixing a Comma Splice", "修正逗号粘连"],
  [
    "Two independent clauses joined by a comma alone make a **comma splice**: *The rain stopped, we went outside.* Fix it with a **semicolon**, with a **period**, or with a comma plus a conjunction such as *and* or *so*. Just removing the comma makes a run-on sentence.\n\n> **Watch out.** Adding an adverb like *however*, *therefore*, or *then* after a comma (*The test was hard, however I passed*) does **not** fix a comma splice — only *and, but, or, nor, for, so, yet* can pair with a comma to join two full sentences.",
    "两个独立分句只用逗号连接，就是**逗号粘连**：*The rain stopped, we went outside.* 修正的方法是用**分号**、用**句号**，或者用逗号加上 *and*、*so* 等连词。只删掉逗号会造成连写句。\n\n> **注意。** 在逗号后面加 *however*、*therefore* 或 *then* 这类副词（*The test was hard, however I passed*）并不能修好逗号粘连——只有 *and、but、or、nor、for、so、yet* 这类并列连词才能和逗号一起连接两个完整句子。",
  ],
  ["Which revision fixes the comma splice?", "哪个修改纠正了逗号粘连？"],
  `
  The rain stopped, we went outside.|The rain stopped; we went outside.|The rain stopped we went outside.|The rain stopped, then we went outside.
  My brother loves soccer, he plays every day.|My brother loves soccer; he plays every day.|My brother loves soccer he plays every day.|My brother loves soccer, also he plays every day.
  The test was hard, I passed it anyway.|The test was hard, but I passed it anyway.|The test was hard I passed it anyway.|The test was hard, however I passed it anyway.
  It was late, the store was closed.|It was late. The store was closed.|It was late the store was closed.|It was late, therefore the store was closed.
  The dog barked, the cat ran away.|The dog barked, and the cat ran away.|The dog barked the cat ran away.|The dog barked, then the cat ran away.
  We missed the bus, we walked to school.|We missed the bus, so we walked to school.|We missed the bus we walked to school.|We missed the bus, thus we walked to school.
  She studied hard, her grades improved.|She studied hard; her grades improved.|She studied hard her grades improved.|She studied hard, as a result her grades improved.
  The sun set, the stars came out.|The sun set. The stars came out.|The sun set the stars came out.|The sun set, soon the stars came out.
  I called him, he did not answer.|I called him, but he did not answer.|I called him he did not answer.|I called him, still he did not answer.
  The road was icy, the bus was late.|The road was icy; the bus was late.|The road was icy the bus was late.|The road was icy, consequently the bus was late.
  The phone rang, nobody answered.|The phone rang, but nobody answered.|The phone rang nobody answered.|The phone rang, however nobody answered.
  I was tired, I went to bed early.|I was tired, so I went to bed early.|I was tired I went to bed early.|I was tired, therefore I went to bed early.
  The snow fell all night, the roads were closed.|The snow fell all night; the roads were closed.|The snow fell all night the roads were closed.|The snow fell all night, as a result the roads were closed.
  My sister plays the violin, I play the drums.|My sister plays the violin, and I play the drums.|My sister plays the violin I play the drums.|My sister plays the violin, also I play the drums.
  The movie was long, we enjoyed it.|The movie was long, but we enjoyed it.|The movie was long we enjoyed it.|The movie was long, still we enjoyed it.
  The bell rang, the students left.|The bell rang. The students left.|The bell rang the students left.|The bell rang, then the students left.
  He forgot his umbrella, he got wet.|He forgot his umbrella, so he got wet.|He forgot his umbrella he got wet.|He forgot his umbrella, thus he got wet.
  The cake was in the oven, the kitchen smelled sweet.|The cake was in the oven; the kitchen smelled sweet.|The cake was in the oven the kitchen smelled sweet.|The cake was in the oven, soon the kitchen smelled sweet.
  We practiced every day, we won the contest.|We practiced every day, and we won the contest.|We practiced every day we won the contest.|We practiced every day, consequently we won the contest.
  The river was high, the bridge was closed.|The river was high; the bridge was closed.|The river was high the bridge was closed.|The river was high, therefore the bridge was closed.
  I knocked twice, no one opened the door.|I knocked twice, but no one opened the door.|I knocked twice no one opened the door.|I knocked twice, however no one opened the door.
  The store was out of milk, we bought juice.|The store was out of milk, so we bought juice.|The store was out of milk we bought juice.|The store was out of milk, instead we bought juice.
  The wind howled, the windows rattled.|The wind howled. The windows rattled.|The wind howled the windows rattled.|The wind howled, meanwhile the windows rattled.
  My dog is old, he still loves to run.|My dog is old, but he still loves to run.|My dog is old he still loves to run.|My dog is old, nevertheless he still loves to run.
  The lights went out, we lit candles.|The lights went out, so we lit candles.|The lights went out we lit candles.|The lights went out, then we lit candles.
  Ana studied all week, she felt ready.|Ana studied all week; she felt ready.|Ana studied all week she felt ready.|Ana studied all week, finally she felt ready.
  The game ended, the fans went home.|The game ended. The fans went home.|The game ended the fans went home.|The game ended, afterward the fans went home.
  The soup was cold, I heated it up.|The soup was cold, so I heated it up.|The soup was cold I heated it up.|The soup was cold, therefore I heated it up.
  Leo likes math, his twin likes art.|Leo likes math, and his twin likes art.|Leo likes math his twin likes art.|Leo likes math, besides his twin likes art.
  The trail was steep, we kept climbing.|The trail was steep, but we kept climbing.|The trail was steep we kept climbing.|The trail was steep, still we kept climbing.
  `,
  (right) => [
    `*${right}* repairs the boundary between the two independent clauses with a semicolon, a period, or a comma plus a coordinating conjunction (*and*, *but*, *so*).\n\n**Check.** Inspect the seam between the two full clauses: it is neither bare (run-on) nor held by just a comma and an adverb.`,
    `*${right}* 用分号、句号，或逗号加并列连词（*and*、*but*、*so*）修好了两个独立分句之间的连接。\n\n**检验。** 检查两个完整分句的交界处：既没有无标点硬连（连写句），也没有只靠逗号加副词勉强粘在一起。`,
  ],
  [
    ['"{wrong}" removes the comma and makes a run-on sentence.', "“{wrong}”删掉了逗号，造成了连写句。"],
    [
      '"{wrong}" still joins two clauses with a comma, adding only an adverb, not a conjunction.',
      "“{wrong}”仍然只用逗号连接两个分句，加的是副词而不是连词。",
    ],
  ],
);

const method = choose(
  "the-passive-in-a-method",
  ["The Passive in a Method", "实验方法中的被动语态"],
  [
    "The method of a lab report tells what was done, in the **past passive**: *The samples **were heated** for ten minutes*. *Was* goes with a singular subject and *were* with a plural one. The active *We heated* is acceptable in some reports, but a bare past form with the thing as subject, *The samples heated*, says the samples did the heating.\n\n> **Watch out.** Check both parts of the verb: a lab subject like *The solution* or *The samples* cannot act on itself (so it needs *was/were + participle*), and *was* vs. *were* must match the subject's number.",
    "实验报告的方法部分用**一般过去时的被动语态**说明做了什么：*The samples **were heated** for ten minutes*。单数主语用 *was*，复数主语用 *were*。有些报告也可以用主动的 *We heated*，但把物当主语、只用过去式，如 *The samples heated*，就成了样本自己在加热。\n\n> **注意。** 要同时核对两点：实验对象（如 *The solution* 或 *The samples*）不会自己操作自己，所以要用 *was/were + 过去分词*；并且 *was* 和 *were* 要与主语的单复数一致。",
  ],
  ["Which words complete the method?", "哪组词能补全方法部分？"],
  `
  The samples ___ for ten minutes.|were heated|was heated|heated
  The solution ___ into three beakers.|was poured|were poured|poured
  The seeds ___ in damp soil.|were planted|was planted|planted
  The mixture ___ every five minutes.|was stirred|were stirred|stirred
  The plants ___ twice a day.|were watered|was watered|watered
  The water ___ to 80 degrees.|was cooled|were cooled|cooled
  The results ___ in a table.|were recorded|was recorded|recorded
  The leaf ___ under a microscope.|was examined|were examined|examined
  The rocks ___ before and after soaking.|were weighed|was weighed|weighed
  The jars ___ in a dark cupboard.|were stored|was stored|stored
  The beakers ___ with clean water.|were rinsed|was rinsed|rinsed
  The powder ___ into the flask.|was added|were added|added
  The worms ___ under a lamp.|were placed|was placed|placed
  The liquid ___ through a filter.|was passed|were passed|passed
  The cups ___ with labels.|were marked|was marked|marked
  The metal ___ in acid for an hour.|was soaked|were soaked|soaked
  The temperatures ___ every hour.|were measured|was measured|measured
  The sample ___ under a strong light.|was viewed|were viewed|viewed
  The eggs ___ in salt water.|were tested|was tested|tested
  The paper ___ into strips.|was cut|were cut|cut
  The tubes ___ for two days.|were left|was left|left
  The salt ___ in warm water.|was dissolved|were dissolved|dissolved
  The beans ___ in wet cotton.|were grown|was grown|grown
  The ice ___ in a dish.|was melted|were melted|melted
  The magnets ___ near the compass.|were held|was held|held
  The soil ___ for moisture.|was tested|were tested|tested
  The marbles ___ down the ramp.|were rolled|was rolled|rolled
  The gas ___ in a balloon.|was collected|were collected|collected
  The shells ___ by size.|were sorted|was sorted|sorted
  The thermometer ___ in the water.|was placed|were placed|placed
  `,
  (right, shown) => [
    `The completed method step reads *${shown.replace("___", right)}* — **${right}** is the past passive agreeing with the subject.\n\n**Check.** Substitute *it* (singular → *was*) or *they* (plural → *were*) for the subject and confirm that something was done *to* it.`,
    `补全后的步骤是 *${shown.replace("___", right)}*：**${right}** 是与主语单复数一致的一般过去时被动语态。\n\n**检验。** 把主语换成 *it*（单数配 *was*）或 *they*（复数配 *were*），并确认动作是施加在它身上的。`,
  ],
  [
    ["*{wrong}* does not agree with the subject in number.", "*{wrong}* 与主语的单复数不一致。"],
    ["*{wrong}* is active, so it says the thing did the action itself.", "*{wrong}* 是主动形式，意思就成了物自己做了这个动作。"],
  ],
);

const every = choose(
  "each-and-every-with-and",
  ["Each and Every with And", "each 和 every 与 and"],
  [
    "Two subjects joined by *and* usually take a plural verb, but when *each* or *every* comes before them, each is taken **one at a time**, so the verb is singular: ***Every** boy and girl **has** a ticket*; ***Each** chair and table **was** cleaned*. Without *each* or *every*, the plural returns: *The boy and the girl have tickets*.\n\n> **Watch out.** Do not let *and* automatically trigger a plural verb: scan the very start of the subject for *each* or *every* first.",
    "用 *and* 连接的两个主语通常用复数动词，但如果前面有 *each* 或 *every*，就是**逐个**来看，所以动词用单数：***Every** boy and girl **has** a ticket*；***Each** chair and table **was** cleaned*。没有 *each* 或 *every* 时，又要用复数：*The boy and the girl have tickets*。\n\n> **注意。** 不要一看到 *and* 就直接选复数动词：先扫一眼主语最前面有没有 *each* 或 *every*。",
  ],
  ["Which verb agrees with the subject?", "哪个动词与主语一致？"],
  `
  Every boy and girl ___ a ticket.|has|have|having
  Each chair and table ___ cleaned.|was|were|being
  Every teacher and student ___ invited.|is|are|being
  The teacher and the student ___ invited.|are|is|being
  Each book and magazine ___ a label.|has|have|having
  Every cat and dog ___ a checkup.|needs|need|needing
  My cat and my dog ___ along well.|get|gets|getting
  Each man and woman ___ a vote.|has|have|having
  Every house and shop ___ power again.|has|have|having
  The house and the shop ___ power again.|have|has|having
  Every parent and teacher ___ welcome.|is|are|being
  Each pen and pencil ___ a name on it.|has|have|having
  The pen and the pencil ___ on the desk.|are|is|being
  Every bike and scooter ___ a lock.|needs|need|needing
  Each room and hallway ___ painted.|was|were|being
  The room and the hallway ___ painted.|were|was|being
  Every player and coach ___ a jersey.|wears|wear|wearing
  My brother and my sister ___ in college.|are|is|being
  Each girl and boy ___ a turn.|gets|get|getting
  Every street and park ___ clean.|looks|look|looking
  The street and the park ___ clean.|look|looks|looking
  Each apple and pear ___ washed.|was|were|being
  Every window and door ___ locked.|is|are|being
  The window and the door ___ locked.|are|is|being
  Each singer and dancer ___ a costume.|has|have|having
  Every lamp and fan ___ turned off.|was|were|being
  My aunt and my uncle ___ near the lake.|live|lives|living
  Each desk and chair ___ a number.|has|have|having
  Every song and poem ___ a title.|needs|need|needing
  The song and the poem ___ titles.|need|needs|needing
  `,
  (right, shown) => [
    `The completed sentence reads *${shown.replace("___", right)}* — ${shown.startsWith("Each") || shown.startsWith("Every") ? "*each* or *every* takes the subjects one at a time, so the verb is singular" : "two subjects joined by *and* without *each* or *every* take a plural verb"}.\n\n**Check.** Substitute ${shown.startsWith("Each") || shown.startsWith("Every") ? "*every single one*" : "*they*"} for the subject: **${right}** matches it cleanly.`,
    `补全后是 *${shown.replace("___", right)}*：${shown.startsWith("Each") || shown.startsWith("Every") ? "*each* 或 *every* 表示逐个来看，动词用单数" : "没有 *each* 或 *every* 时，*and* 连接的两个主语用复数动词"}。\n\n**检验。** 把主语换成${shown.startsWith("Each") || shown.startsWith("Every") ? "“每一个”（单数）" : " *they*（复数）"}，**${right}** 正好与之搭配。`,
  ],
  [
    [
      "*{wrong}* has the wrong number: check for *each* or *every* before the subjects.",
      "*{wrong}* 的单复数不对：看看主语前有没有 *each* 或 *every*。",
    ],
    ["*{wrong}* is not a finite verb, so the sentence would have none.", "*{wrong}* 不是限定动词，句子就没有谓语动词了。"],
  ],
);

const directions = choose(
  "revising-directions",
  ["Revising Directions", "修改说明文字"],
  [
    "Directions are clearest in the **imperative** throughout: *Mix the flour. Add the eggs. Stir well.* A step that slips into another mood, *You should add the eggs* or *The eggs are added*, breaks the pattern. Revise every step to begin with its verb.\n\n> **Watch out.** Even polite advice (*You should …*, *You could …*) breaks the imperative rhythm in a set of instructions. Cut the subject and modal so the verb leads.",
    "说明文字从头到尾都用**祈使语气**最清楚：*Mix the flour. Add the eggs. Stir well.* 某一步换成别的语气，如 *You should add the eggs* 或 *The eggs are added*，就打破了统一的格式。把每一步都改成以动词开头。\n\n> **注意。** 哪怕是委婉的建议（*You should …*、*You could …*），也会打断操作说明的祈使句节奏。删掉主语和情态动词，直接让动词打头。",
  ],
  ["Which step keeps the directions in one mood?", "哪一步让说明文字保持了统一的语气？"],
  `
  Mix the flour. ___ Stir well.|Add the eggs.|You should add the eggs.|The eggs are added.
  Open the lid. ___ Close it tightly.|Pour in the water.|You could pour in the water.|The water is poured in.
  Turn left at the bank. ___ Stop at the red door.|Walk two blocks.|You will walk two blocks.|Two blocks are walked.
  Wash your hands. ___ Dry them well.|Use warm soap and water.|You should use warm soap and water.|Warm soap and water are used.
  Read the question. ___ Write your answer.|Underline the key words.|You might underline the key words.|The key words are underlined.
  Unplug the lamp. ___ Screw in the new bulb.|Remove the old bulb.|You should remove the old bulb.|The old bulb is removed.
  Fold the paper in half. ___ Crease the edge.|Fold it again.|You can fold it again.|It is folded again.
  Fill the pot with water. ___ Add the pasta.|Bring it to a boil.|You should bring it to a boil.|It is brought to a boil.
  Choose a topic. ___ Write a draft.|Make a plan.|You ought to make a plan.|A plan is made.
  Set the timer. ___ Check the oven.|Wait ten minutes.|You should wait ten minutes.|Ten minutes are waited.
  Preheat the oven. ___ Bake for twenty minutes.|Grease the pan.|You should grease the pan.|The pan is greased.
  Find a seat. ___ Listen to the guide.|Turn off your phone.|You should turn off your phone.|Your phone is turned off.
  Plug in the cable. ___ Wait for the light.|Press the power button.|You might press the power button.|The power button is pressed.
  Sweep the floor. ___ Let it dry.|Mop it with warm water.|You should mop it with warm water.|It is mopped with warm water.
  Open the box. ___ Read the instructions.|Take out the parts.|You can take out the parts.|The parts are taken out.
  Peel the potatoes. ___ Boil them for ten minutes.|Cut them into cubes.|You should cut them into cubes.|They are cut into cubes.
  Stand up straight. ___ Breathe slowly.|Relax your shoulders.|You could relax your shoulders.|Your shoulders are relaxed.
  Write your name. ___ Begin the test.|Read all the questions.|You should read all the questions.|All the questions are read.
  Dig a small hole. ___ Cover it with soil.|Drop in the seed.|You will drop in the seed.|The seed is dropped in.
  Rinse the brush. ___ Dip it in the paint.|Dry it on a cloth.|You should dry it on a cloth.|It is dried on a cloth.
  Take off your shoes. ___ Step onto the mat.|Put on the slippers.|You ought to put on the slippers.|The slippers are put on.
  Cut the bread. ___ Add the cheese.|Spread the butter.|You should spread the butter.|The butter is spread.
  Lock the door. ___ Hang up the key.|Turn off the lights.|You might turn off the lights.|The lights are turned off.
  Sort the papers. ___ Put them in the folder.|Staple each set.|You should staple each set.|Each set is stapled.
  Shake the bottle. ___ Pour a little into the cup.|Open the cap.|You can open the cap.|The cap is opened.
  Measure the wood. ___ Sand the edges.|Saw it to length.|You should saw it to length.|It is sawed to length.
  Fill the bucket. ___ Wash the car.|Add the soap.|You should add the soap.|The soap is added.
  Warm up for five minutes. ___ Cool down slowly.|Run two laps.|You should run two laps.|Two laps are run.
  Choose a book. ___ Write a short summary.|Read the first chapter.|You might read the first chapter.|The first chapter is read.
  Line up at the door. ___ Walk to the bus.|Wait for your name.|You should wait for your name.|Your name is waited for.
  `,
  (right) => [
    `*${right}* opens with a bare command verb, keeping all three steps in the imperative mood.\n\n**Check.** Read the first word of all three steps in a row: every one is an action verb giving a direct command.`,
    `*${right}* 以动词原形开头发出指令，让三个步骤保持统一的祈使语气。\n\n**检验。** 依次读三个步骤的第一个词：每一个都是直接发出指令的动词。`,
  ],
  [
    ['"{wrong}" slips into advice with a modal, not a command.', "“{wrong}”变成了带情态动词的建议，而不是指令。"],
    ['"{wrong}" slips into the passive, which hides who does the step.', "“{wrong}”变成了被动语态，看不出是谁做这一步。"],
  ],
);

const opener = choose(
  "the-doer-after-the-opener",
  ["The Doer After the Opener", "开头短语后的施动者"],
  [
    "An opening phrase with a verb in it describes whoever comes right after the comma, so the **doer** of that action must be the subject: *Running for the bus, **I** dropped my bag*. If the subject is something else, *my bag fell*, the bag was running.\n\n> **Watch out.** Even a possessive like *Grandma's face* or *Dad's hand* makes *face* or *hand* the subject instead of the person. Put the person themselves right after the comma.",
    "含有动词的开头短语描述的是紧跟在逗号后面的那个人或物，所以这个动作的**施动者**必须做主语：*Running for the bus, **I** dropped my bag*。如果主语是别的东西，如 *my bag fell*，那就成了包在跑。\n\n> **注意。** 哪怕写成 *Grandma's face* 或 *Dad's hand* 这样的所有格，主语也会变成 *face* 或 *hand* 而不是人本身。必须把人直接放在逗号后面作主语。",
  ],
  ["Which words complete the sentence correctly?", "哪组词能正确地补全句子？"],
  `
  Running for the bus, ___|I dropped my bag.|my bag fell.|the bag was dropped.
  Opening the door, ___|she saw a puppy.|a puppy was there.|the puppy was seen.
  Tired after the game, ___|the players went home.|the bus took the players home.|home was where the players went.
  Climbing the hill, ___|we saw the whole town.|the town came into view.|the whole town was seen.
  Hungry after school, ___|Leo ate a sandwich.|a sandwich was eaten.|the sandwich looked good.
  Reading the letter, ___|Grandma began to cry.|tears ran down Grandma's face.|the letter made Grandma cry.
  Excited about the trip, ___|the students packed early.|the bags were packed early.|packing was done early.
  Looking out the window, ___|I saw the snow.|the snow was falling.|the snow could be seen.
  Finishing the race, ___|the runner raised her arms.|the crowd cheered for the runner.|the arms of the runner went up.
  Walking into the kitchen, ___|Dad smelled smoke.|smoke filled the air.|the smell of smoke was noticed.
  Jumping into the pool, ___|the kids splashed everyone.|water splashed everywhere.|everyone was splashed.
  Lost in the woods, ___|the hikers used a compass.|the compass showed the way.|the way was found.
  Waiting for the bus, ___|I read my book.|the rain started to fall.|my book was read.
  Painting the fence, ___|Tom got paint on his shoes.|paint dripped onto Tom's shoes.|Tom's shoes were covered in paint.
  Nervous before the test, ___|Ana took a deep breath.|a deep breath helped Ana.|a deep breath was taken.
  Turning the corner, ___|we saw the ocean.|the ocean appeared.|the ocean was seen.
  Baking the cake, ___|Dad burned his hand.|the oven burned Dad's hand.|Dad's hand was burned.
  Proud of her work, ___|Lena showed the poster to her class.|the poster hung on the wall.|the poster was shown to the class.
  Opening the gift, ___|Max gasped with joy.|joy filled Max's face.|the gift was opened.
  Cleaning the attic, ___|Mom found old photos.|old photos fell out of a box.|old photos were found.
  Swimming across the lake, ___|the girl felt tired.|the lake seemed huge.|the lake was crossed.
  Hearing the thunder, ___|the dog hid under the bed.|the bed hid the dog.|the dog was hidden.
  Covered in snow, ___|the children built a fort.|the fort stood in the yard.|a fort was built.
  Writing the essay, ___|I checked every fact.|every fact seemed true.|every fact was checked.
  Entering the museum, ___|the students saw a dinosaur.|a dinosaur stood by the door.|a dinosaur was seen.
  Late for class, ___|Sam ran down the hall.|the hall was empty.|the hall was crossed quickly.
  Fixing the bike, ___|Grandpa whistled a tune.|a tune filled the garage.|a tune was whistled.
  Reaching the top, ___|the climbers took photos.|the view was amazing.|photos were taken.
  Excited by the news, ___|the fans danced in the street.|the street filled with music.|dancing was done in the street.
  Watching the movie, ___|we ate popcorn.|the popcorn ran out.|popcorn was eaten.
  `,
  (right) => [
    `*${right}* puts the person who did the opening action right after the comma as the main subject.\n\n**Check.** Ask *Who is doing or feeling the opening phrase?* — the subject immediately after the comma answers that question.`,
    `*${right}* 把发出开头动作或处于开头状态的人直接放在逗号后面作主语。\n\n**检验。** 问一句“是谁在做开头的动作或处于那种状态？”，紧跟逗号后的主语正好给出回答。`,
  ],
  [
    ['"{wrong}" makes something else the subject, so the opener dangles.', "“{wrong}”让别的东西做了主语，开头短语成了悬垂修饰语。"],
    ['"{wrong}" is passive, so the doer never becomes the subject.', "“{wrong}”是被动语态，施动者没有做主语。"],
  ],
);

const essential = choose(
  "it-is-essential-that",
  ["It Is Essential That", "It is essential that 句型"],
  [
    "After *it is essential that*, *it is important that*, *it is necessary that* and *it is vital that*, formal English uses the subjunctive, the **base form** of the verb for every subject: *It is essential that he **be** on time*; *It is important that she **arrive** early*. The base form has no *-s* and no past tense.\n\n> **Watch out.** Even when the opener is in the past (*It was necessary that …*), the verb in the *that* clause stays in its plain base form (*know*, *sign*, *come*), never past tense.",
    "在 *it is essential that*、*it is important that*、*it is necessary that* 和 *it is vital that* 之后，正式英语用虚拟语气，即所有主语都用动词**原形**：*It is essential that he **be** on time*；*It is important that she **arrive** early*。原形不加 *-s*，也不用过去式。\n\n> **注意。** 即使开头是过去时（*It was necessary that …*），*that* 从句里的动词也依然保持原形（*know*、*sign*、*come*），绝不改成过去式。",
  ],
  ["Which verb completes the sentence in formal English?", "在正式英语中，哪个动词能补全句子？"],
  `
  It is essential that he ___ on time.|be|is|was
  It is important that she ___ early.|arrive|arrives|arrived
  It is necessary that every student ___ a form.|sign|signs|signed
  It is vital that the doctor ___ the results.|see|sees|saw
  It is essential that the bridge ___ repaired.|be|is|was
  It is important that he ___ the medicine daily.|take|takes|took
  It was necessary that she ___ the truth.|know|knows|knew
  It is vital that the door ___ locked.|be|is|was
  It is important that the team ___ together.|practice|practices|practiced
  It is essential that each player ___ a helmet.|wear|wears|wore
  It is essential that she ___ the form today.|send|sends|sent
  It is important that he ___ quiet during the test.|stay|stays|stayed
  It is necessary that the patient ___ in bed.|rest|rests|rested
  It is vital that the child ___ safe.|be|is|was
  It is essential that the report ___ finished by Friday.|be|is|was
  It is important that everyone ___ the rules.|follow|follows|followed
  It was necessary that he ___ the letter himself.|sign|signs|signed
  It is vital that the water ___ clean.|be|is|was
  It is important that the class ___ on time.|begin|begins|began
  It is essential that each driver ___ a seat belt.|wear|wears|wore
  It is necessary that she ___ her passport.|bring|brings|brought
  It is important that he ___ his mother.|call|calls|called
  It is vital that the bridge ___ checked every year.|be|is|was
  It is essential that the team ___ together.|work|works|worked
  It was important that the doctor ___ immediately.|come|comes|came
  It is necessary that every visitor ___ in.|sign|signs|signed
  It is vital that the plant ___ sunlight.|get|gets|got
  It is essential that he ___ honest.|be|is|was
  It is important that she ___ enough sleep.|get|gets|got
  It is necessary that the door ___ shut.|stay|stays|stayed
  `,
  (right, shown) => [
    `The completed sentence reads *${shown.replace("___", right)}* — the subjunctive takes the bare base form **${right}** regardless of subject or main-clause tense.\n\n**Check.** Put *to* in front of *${right}* (*to ${right}*): it is the untouched dictionary base form with no *-s* and no past ending.`,
    `补全后是 *${shown.replace("___", right)}*：虚拟语气不随主语人称或主句时态变化，一律用动词原形 **${right}**。\n\n**检验。** 在 *${right}* 前面加上 *to*（*to ${right}*）：它就是不加 *-s*、不带过去式的词典原形。`,
  ],
  [
    [
      "*{wrong}* is the present tense with *-s* or a form of *be*, not the base form.",
      "*{wrong}* 是带 *-s* 的现在时或 *be* 的变化形式，不是原形。",
    ],
    ["*{wrong}* is the past tense, not the base form.", "*{wrong}* 是过去式，不是原形。"],
  ],
);

const weUs = choose(
  "we-or-us-before-a-noun",
  ["We or Us Before a Noun", "名词前用 we 还是 us"],
  [
    "When *we* or *us* comes right before a noun, as in *we students*, drop the noun to choose: *(We) students want a longer lunch* → ***We** want*, so *We students*. *The coach praised (us) players* → *praised **us***, so *us players*.\n\n> **Watch out.** *Our* is possessive and means the group belongs to someone else (*our students* = the students we teach), whereas *we students* and *us students* mean we *are* the students.",
    "当 *we* 或 *us* 紧挨在名词前面时，如 *we students*，先把名词去掉再选：*(We) students want a longer lunch* → ***We** want*，所以是 *We students*。*The coach praised (us) players* → *praised **us***，所以是 *us players*。\n\n> **注意。** *our* 是所有格，表示“我们的（学生）”，意思就变了；而 *we students* 和 *us students* 表示“我们这些学生”。",
  ],
  ["Which pronoun completes the sentence?", "哪个代词能补全句子？"],
  `
  ___ students want a longer lunch.|We|Us|Our
  The coach praised ___ players after the game.|us|we|our
  ___ neighbors planted the garden together.|We|Us|Our
  The prize was shared by ___ winners.|us|we|our
  ___ fans cheered louder than ever.|We|Us|Ours
  The museum gave ___ visitors a free map.|us|we|our
  Some of ___ singers had colds.|us|we|our
  ___ sixth graders will lead the parade.|We|Us|Our
  The rules apply to ___ swimmers too.|us|we|our
  ___ campers built the fire ourselves.|We|Us|Our
  ___ drivers must follow the rules.|We|Us|Our
  The guide showed ___ tourists the old castle.|us|we|our
  ___ readers loved the ending.|We|Us|Our
  The award was given to ___ volunteers.|us|we|our
  ___ musicians practiced all night.|We|Us|Our
  The teacher gave ___ students extra time.|us|we|our
  Some of ___ runners got lost.|us|we|our
  ___ seventh graders planned the trip.|We|Us|Our
  The new rule affects ___ cyclists most.|us|we|our
  ___ swimmers dove in together.|We|Us|Our
  The mayor thanked ___ helpers in a speech.|us|we|our
  ___ kids want a bigger playground.|We|Us|Our
  The storm surprised ___ hikers on the trail.|us|we|our
  ___ dancers wore matching shoes.|We|Us|Our
  The chef taught ___ cooks a new recipe.|us|we|our
  ___ players never give up.|We|Us|Our
  The bus left ___ passengers at the station.|us|we|our
  ___ scouts set up the tents.|We|Us|Our
  The judges watched ___ singers closely.|us|we|our
  ___ artists painted the mural in a week.|We|Us|Our
  `,
  (right) => [
    `**${right}** is the right case because it serves as the ${right === "We" ? "subject" : "object"} of the sentence.\n\n**Check.** Cover the noun right after the blank and read the sentence with just *${right}*: it stays grammatical without the noun.`,
    `**${right}** 的格正确，因为它在句中作${right === "We" ? "主语" : "宾语"}。\n\n**检验。** 遮住空格后面的名词，只留 *${right}* 读一遍句子，语法依然完全通顺。`,
  ],
  [
    ["*{wrong}* is the wrong case: drop the noun and read the sentence.", "*{wrong}* 的格不对：去掉名词再读一读句子。"],
    ["*{wrong}* is a possessive, which changes the meaning.", "*{wrong}* 是所有格，改变了句子的意思。"],
  ],
);

const keepE = choose(
  "keeping-e-after-c-and-g",
  ["Keeping E After C and G", "c 和 g 之后保留 e"],
  [
    "A silent *e* is usually dropped before a suffix that starts with a vowel: *hope*, *hoping*. But after a **soft c or g**, the *e* stays before *-able* and *-ous*, to keep the sound soft: *notice*, *noticeable*; *courage*, *courageous*; *change*, *changeable*. Before a suffix starting with a consonant, the *e* stays: *hopeful*, *careless*.\n\n> **Watch out.** Do not double the *l* in *-ful* (*hopeful*, not *hopefull*), and do not change *-able* to *-ible* after keeping the *e* (*noticeable*, not *noticeible*).",
    "不发音的 *e* 在以元音开头的后缀前通常要去掉：*hope*、*hoping*。但在**软音 c 或 g** 后面，*e* 在 *-able* 和 *-ous* 前要保留，以保持软音：*notice*、*noticeable*；*courage*、*courageous*；*change*、*changeable*。在以辅音开头的后缀前，*e* 保留：*hopeful*、*careless*。\n\n> **注意。** 后缀 *-ful* 只有一个 *l*（*hopeful*，不是 *hopefull*）；保留 *e* 后也不要把 *-able* 误拼成 *-ible*（*noticeable*，不是 *noticeible*）。",
  ],
  ["Which spelling is correct?", "哪个拼写正确？"],
  `
  notice + able|noticeable|noticable|noticeible
  courage + ous|courageous|couragous|couragious
  change + able|changeable|changable|changeible
  outrage + ous|outrageous|outragous|outragious
  manage + able|manageable|managable|manageible
  peace + able|peaceable|peacable|peaceible
  advantage + ous|advantageous|advantagous|advantagious
  hope + ful|hopeful|hopful|hopefull
  care + less|careless|carless|carelless
  replace + able|replaceable|replacable|replaceible
  trace + able|traceable|tracable|traceible
  knowledge + able|knowledgeable|knowledgable|knowledgeible
  service + able|serviceable|servicable|serviceible
  enforce + able|enforceable|enforcable|enforceible
  acknowledge + able|acknowledgeable|acknowledgable|acknowledgeible
  pronounce + able|pronounceable|pronouncable|pronounceible
  use + ful|useful|usful|usefull
  hate + ful|hateful|hatful|hatefull
  home + less|homeless|homless|homelless
  age + less|ageless|agless|agelless
  place + ment|placement|placment|placemint
  manage + ment|management|managment|managemint
  change + less|changeless|changless|changelless
  grace + ful|graceful|gracful|gracefull
  price + less|priceless|pricless|pricelless
  care + ful|careful|carful|carefull
  waste + ful|wasteful|wastful|wastefull
  move + ment|movement|movment|movemint
  peace + ful|peaceful|peacful|peacefull
  taste + less|tasteless|tastless|tastelless
  `,
  (right) => [
    `**${right}** keeps the silent *e* — either to keep soft *c*/*g* before *-able*/*-ous* or because the suffix begins with a consonant — and spells the suffix accurately.\n\n**Check.** Split **${right}** back into base word + suffix: both the full base word (ending in *e*) and the exact suffix from the prompt remain intact.`,
    `**${right}** 按规则保留了不发音的 *e*（在 *-able*/*-ous* 前保持软音 *c*/*g*，或在辅音开头的后缀前保留词根），且后缀拼写正确。\n\n**检验。** 把 **${right}** 拆回词根加后缀：带 *e* 的完整词根和题面给出的后缀都完好无损。`,
  ],
  [
    ["*{wrong}* drops the *e* that keeps the sound or the base word.", "*{wrong}* 去掉了用来保持读音或词根的 *e*。"],
    ["*{wrong}* misspells the suffix.", "*{wrong}* 拼错了后缀。"],
  ],
);

const confusedLines = join([
  ...[
    "The principal welcomed the new students.",
    "Honesty is a principle she lives by.",
    "Her red scarf complements her coat.",
    "He paid me a kind compliment.",
    "The bus remained stationary in the snow.",
    "She wrote the note on pink stationery.",
    "The city council voted on the plan.",
    "Lawyers counsel their clients.",
    "The magician's trick was a clever illusion.",
    "The poem makes an allusion to a Greek myth.",
    "Our principal reads the news each morning.",
    "The cheese complements the apples well.",
    "The town council meets on Mondays.",
    "Mirrors create the illusion of a bigger room.",
    "Fairness is the first principle of the club.",
  ].map((s) => `${s}|correct`),
  ...[
    "The principle welcomed the new students.",
    "Honesty is a principal she lives by.",
    "Her red scarf compliments her coat.",
    "He paid me a kind complement.",
    "The bus remained stationery in the snow.",
    "She wrote the note on pink stationary.",
    "The city counsel voted on the plan.",
    "Lawyers council their clients.",
    "The magician's trick was a clever allusion.",
    "The poem makes an illusion to a Greek myth.",
    "Our principle reads the news each morning.",
    "The cheese compliments the apples well.",
    "The town counsel meets on Mondays.",
    "Mirrors create the allusion of a bigger room.",
    "Fairness is the first principal of the club.",
  ].map((s) => `${s}|wrong word`),
]);

const confused = label(
  "proofreading-for-confused-words",
  ["Proofreading for Confused Words", "校对易混淆词"],
  [
    "A spell checker will not catch a confused word, because the wrong word is spelled correctly. Proofread by stopping at each word of a confused pair and asking which meaning the sentence needs: a person who runs a school is a **principal**, a rule is a **principle**; praise is a **compliment**, completing is a **complement**.\n\n> **Watch out.** Do not read by sound alone when proofreading: *stationary* and *stationery* sound identical, so check the telling letter (*a* for *at rest*, *e* for *envelope*; *pal* in *principal*, *le* in *rule*/*principle*).",
    "拼写检查发现不了易混淆词，因为错用的词本身拼写正确。校对时，遇到易混淆词组中的每个词都停下来，问一问句子需要哪个意思：管理学校的人是 **principal**，原则是 **principle**；称赞是 **compliment**，补充使完整是 **complement**。\n\n> **注意。** 校对时不能只靠读音判断：*stationary* 和 *stationery* 读音完全一样，必须盯住关键字母（*a* 对应 *at rest*、*e* 对应 *envelope*；*principal* 含 *pal*，*principle* 与 *rule* 同以 *-le* 结尾）。",
  ],
  ["Is the confused word used correctly?", "这个易混淆词用对了吗？"],
  confusedLines,
  {
    correct: L(
      "正确",
      "The word's spelling matches the meaning the sentence calls for.\n\n**Check.** Substitute the plain definition of that exact spelling into the sentence: it fits without changing the intended sense.",
      "这个词的拼写正好对应句子需要的意思。\n\n**检验。** 把这个拼写对应的释义代进原句读一遍，句意完全贴合。",
      "The word is its pair's partner, with a different meaning.",
      "这个词是与它成对的那个词，意思不同。",
    ),
    "wrong word": L(
      "用错了词",
      "The word is spelled correctly, but it is the other half of the pair and carries the wrong meaning for this sentence.\n\n**Check.** Swap in the definition of the spelling shown: it produces a nonsensical image (such as a rule welcoming students or writing on a still bus), confirming the partner word belongs here.",
      "这个词本身没有拼错，但它是易混词对里的另一个词，意思和句子不符。\n\n**检验。** 按当前拼写的字面意思去理解句子，会得出不合常理的画面，说明这里该换成它的配对词。",
      "The word has the meaning the sentence needs.",
      "这个词的意思正是句子所需要的。",
    ),
  },
);

/** deeper7 are the third knowledge points of the grammar topics of grade 7, by topic id. */
export const deeper7: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "active-and-passive-voice": [doer],
  "verb-moods": [would],
  "parallel-structure": [correlative],
  "plurals-from-latin-and-greek": [latinVerb],
  "phrases-and-clauses": [fragment],
  "adjective-and-adverb-clauses": [adverbComma],
  "commas-with-interrupters": [tag],
  "past-perfect-for-earlier-events": [hadForm],
  "semicolons-between-clauses": [splice],
  "passive-voice-in-science": [method],
  "agreement-with-tricky-subjects": [every],
  "shifts-in-verb-mood": [directions],
  "dangling-modifiers": [opener],
  "the-subjunctive-in-demands-and-proposals": [essential],
  "pronouns-in-compound-subjects-and-objects": [weUs],
  "spelling-words-with-suffixes": [keepE],
  "commonly-confused-words-3": [confused],
};
