// Grade 6: writing skills checked by rule, part one: combining with participial phrases, paraphrasing a source,
// transitions between ideas, defining a term and precise words for science.

import type { TopicDef } from "@ga/content";
import type { ChoiceItem } from "@ga/subject-english";
import { choose, field, type Label, label, rows, topic } from "./kit.ts";

// Pairs to combine: first sentence|second sentence|combined, phrase by its noun|phrase by the wrong noun|meaning changed
const participleRows = rows(`
  The scribe sat by the river.|He copied the king's laws onto clay.|Sitting by the river, the scribe copied the king's laws onto clay.|Sitting by the river, the king's laws were copied onto clay by the scribe.|The scribe sat by the river after he had copied the king's laws.
  The legion marched all night.|It reached the city at dawn.|Marching all night, the legion reached the city at dawn.|Marching all night, the city was reached by the legion at dawn.|The legion reached the city and then marched all night.
  The emperor stood on the steps.|He spoke to the crowd.|Standing on the steps, the emperor spoke to the crowd.|Standing on the steps, the crowd heard the emperor speak.|The emperor spoke to the crowd before he stood on the steps.
  The builders worked with stone.|They raised a great arch.|Working with stone, the builders raised a great arch.|Working with stone, a great arch was raised by the builders.|The builders raised a great arch so that they could work with stone.
  The senator shook with anger.|He left the meeting.|Shaking with anger, the senator left the meeting.|Shaking with anger, the meeting was left by the senator.|The senator left the meeting, and later he shook with anger.
  The girl held her breath.|She dove into the cold lake.|Holding her breath, the girl dove into the cold lake.|Holding her breath, the cold lake swallowed the girl.|The girl dove into the cold lake and then held her breath.
  The farmer watched the sky.|He hoped for rain.|Watching the sky, the farmer hoped for rain.|Watching the sky, rain was hoped for by the farmer.|The farmer hoped for rain until he stopped watching the sky.
  The gladiator raised his shield.|He stepped into the arena.|Raising his shield, the gladiator stepped into the arena.|Raising his shield, the arena was entered by the gladiator.|The gladiator stepped into the arena without his shield.
  The boy ran to the door.|He shouted for his mother.|Running to the door, the boy shouted for his mother.|Running to the door, his mother heard the boy shout.|The boy shouted for his mother and stayed by the window.
  The merchant counted his coins.|He smiled at the profit.|Counting his coins, the merchant smiled at the profit.|Counting his coins, the profit made the merchant smile.|The merchant smiled at the profit and lost his coins.
  The dog barked at the stranger.|It guarded the gate.|Barking at the stranger, the dog guarded the gate.|Barking at the stranger, the gate was guarded by the dog.|The dog guarded the gate after the stranger barked.
  The engineer studied the map.|She planned the new road.|Studying the map, the engineer planned the new road.|Studying the map, the new road was planned by the engineer.|The engineer planned the new road without a map.
  The children laughed loudly.|They chased the ducks across the park.|Laughing loudly, the children chased the ducks across the park.|Laughing loudly, the ducks were chased across the park.|The ducks laughed loudly as the children chased them.
  The poet sat at her desk.|She wrote late into the night.|Sitting at her desk, the poet wrote late into the night.|Sitting at her desk, the night passed as the poet wrote.|The poet wrote late into the night and never sat down.
  The soldiers carried heavy packs.|They climbed the steep hill.|Carrying heavy packs, the soldiers climbed the steep hill.|Carrying heavy packs, the steep hill was climbed by the soldiers.|The soldiers climbed the hill and then picked up their packs.
  The cook tasted the soup.|He added more salt.|Tasting the soup, the cook added more salt.|Tasting the soup, more salt was added by the cook.|The cook added more salt without tasting the soup.
  The queen wore a golden crown.|She greeted the visitors.|Wearing a golden crown, the queen greeted the visitors.|Wearing a golden crown, the visitors were greeted by the queen.|The visitors wore golden crowns when the queen greeted them.
  The runner gasped for air.|She crossed the finish line.|Gasping for air, the runner crossed the finish line.|Gasping for air, the finish line was crossed by the runner.|The runner crossed the finish line and was not tired at all.
  The slave worked in the mines.|He dreamed of freedom.|Working in the mines, the slave dreamed of freedom.|Working in the mines, freedom filled the slave's dreams.|The slave dreamed of freedom and never worked in the mines.
  The cat crept along the wall.|It watched the birds.|Creeping along the wall, the cat watched the birds.|Creeping along the wall, the birds were watched by the cat.|The birds crept along the wall and watched the cat.
  The general looked at the river.|He ordered a bridge to be built.|Looking at the river, the general ordered a bridge to be built.|Looking at the river, a bridge was ordered by the general.|The general ordered a bridge and never saw the river.
  The tourists followed the guide.|They walked through the old forum.|Following the guide, the tourists walked through the old forum.|Following the guide, the old forum was walked through by the tourists.|The guide followed the tourists through the old forum.
  The baby clutched a toy.|She fell asleep.|Clutching a toy, the baby fell asleep.|Clutching a toy, sleep came to the baby.|The baby fell asleep and then reached for a toy.
  The students listened carefully.|They took notes on the lesson.|Listening carefully, the students took notes on the lesson.|Listening carefully, notes on the lesson were taken.|The students took notes and did not listen to the lesson.
  The sailor scanned the horizon.|He spotted land.|Scanning the horizon, the sailor spotted land.|Scanning the horizon, land appeared to the sailor.|The sailor spotted land and then began to scan the sea.
  The crowd cheered wildly.|It welcomed the winning chariot.|Cheering wildly, the crowd welcomed the winning chariot.|Cheering wildly, the winning chariot was welcomed by the crowd.|The winning chariot cheered as the crowd welcomed it.
  The teacher smiled warmly.|She handed back the tests.|Smiling warmly, the teacher handed back the tests.|Smiling warmly, the tests were handed back by the teacher.|The teacher handed back the tests with an angry frown.
  The miners dug deeper.|They found a vein of silver.|Digging deeper, the miners found a vein of silver.|Digging deeper, a vein of silver was found by the miners.|The miners found silver and then stopped digging.
  The old man leaned on his cane.|He walked slowly to the market.|Leaning on his cane, the old man walked slowly to the market.|Leaning on his cane, the market was reached slowly by the old man.|The old man walked quickly to the market without his cane.
  The wind howled through the trees.|It kept us awake all night.|Howling through the trees, the wind kept us awake all night.|Howling through the trees, we were kept awake all night by the wind.|We howled through the trees and kept the wind awake.
`);

const combinedSentence: ChoiceItem[] = participleRows.map((r) => [
  `${field(r, 0)} ${field(r, 1)}`,
  field(r, 2),
  [field(r, 4), field(r, 3)],
]);
const phraseByNoun: ChoiceItem[] = participleRows.map((r) => [`${field(r, 0)} ${field(r, 1)}`, field(r, 2), [field(r, 3), field(r, 4)]]);

const participial = topic("writing", {
  id: "combining-with-participial-phrases",
  title: ["Combining with Participial Phrases", "用分词短语合并句子"],
  summary: [
    "Two sentences about one subject can become one when an action turns into a participial phrase placed right next to the noun it describes.",
    "关于同一主语的两个句子，可以把其中一个动作变成分词短语，紧挨它所修饰的名词，合并成一句。",
  ],
  after: ["participial-phrases", "combining-with-relative-clauses"],
  points: [
    choose(
      "the-combined-sentence",
      ["The Combined Sentence", "合并后的句子"],
      [
        "When two sentences share a subject, one action can become a **participial phrase** with an *-ing* verb: *The scribe sat by the river. He copied the laws.* becomes *Sitting by the river, the scribe copied the laws.* The combined sentence must keep **both facts** and their order in time; it must not change who did what or what happened first.",
        "两个句子主语相同时，可以把其中一个动作变成带 *-ing* 动词的**分词短语**：*The scribe sat by the river. He copied the laws.* 变成 *Sitting by the river, the scribe copied the laws.* 合并后的句子必须保留**两个事实**及其时间顺序，不能改变谁做了什么，也不能改变先后顺序。",
      ],
      ["Which sentence combines the two and keeps their meaning?", "哪个句子合并了这两句并保留了原意？"],
      combinedSentence,
      (right) => [
        `**${right}** The first action became an *-ing* phrase, and the sentence keeps both facts in the same order.`,
        `**${right}** 第一个动作变成了 *-ing* 短语，句子按原来的顺序保留了两个事实。`,
      ],
      [
        [
          "*{wrong}* changes the meaning: the order of events or a fact is different from the two sentences.",
          "*{wrong}* 改变了原意：事件的顺序或某个事实与原来两句不同。",
        ],
        [
          "*{wrong}* puts the wrong noun after the phrase, so the phrase seems to describe something that cannot do the action.",
          "*{wrong}* 在短语后面放错了名词，使短语好像在修饰一个做不了这个动作的东西。",
        ],
      ],
    ),
    choose(
      "the-phrase-next-to-its-noun",
      ["The Phrase Next to Its Noun", "短语紧挨它的名词"],
      [
        "A participial phrase at the start of a sentence describes the **first noun after the comma**. *Sitting by the river, the scribe copied the laws* is right: the scribe sat. *Sitting by the river, the laws were copied* says that the laws sat by the river, a **dangling modifier**. Choose the sentence where the noun after the comma is the one doing the action.",
        "放在句首的分词短语修饰的是**逗号后的第一个名词**。*Sitting by the river, the scribe copied the laws* 是对的：坐着的是抄写员。*Sitting by the river, the laws were copied* 等于说法律坐在河边，这就是**垂悬修饰语**。要选出逗号后的名词正是做这个动作的人或物的句子。",
      ],
      ["Which combined sentence puts the phrase next to the right noun?", "哪个合并句把短语放在了正确的名词旁边？"],
      phraseByNoun,
      (right) => [
        `**${right}** The noun right after the comma is the one doing the action of the *-ing* phrase.`,
        `**${right}** 紧跟逗号的名词正是做 *-ing* 短语中那个动作的人或物。`,
      ],
      [
        [
          "*{wrong}* dangles: the noun after the comma is not the one doing the action.",
          "*{wrong}* 是垂悬修饰语：逗号后的名词并不是做这个动作的人或物。",
        ],
        ["*{wrong}* does not use a participial phrase, and it changes the meaning.", "*{wrong}* 没有使用分词短语，而且改变了原意。"],
      ],
    ),
  ],
});

// Sources to paraphrase: source|good paraphrase|copies the source|changes a fact
const paraphraseRows = rows(`
  The Sumerians built the first cities in Mesopotamia about 5,000 years ago.|About five thousand years ago, the first cities in Mesopotamia were built by the Sumerians.|The Sumerians built the first cities in Mesopotamia about 5,000 years ago, it says.|The Egyptians built the first cities in Mesopotamia about 5,000 years ago.
  Farmers dug canals to carry river water to their fields.|To bring water from the river to their crops, farmers cut channels through the land.|Farmers dug canals to carry the river water to their fields.|Farmers dug canals to drain water away from their fields.
  Scribes went to school for many years to learn hundreds of signs.|Learning the hundreds of signs of writing took scribes years of schooling.|Scribes went to school for many years to learn the hundreds of signs.|Scribes learned the few signs of writing in a single week.
  The ziggurat stood at the center of the city and was a temple to its god.|In the middle of the city rose the ziggurat, a temple for the city's god.|The ziggurat stood at the very center of the city and was a temple to its god.|The ziggurat stood outside the city walls and was a palace for the king.
  Hammurabi wrote down 282 laws so that everyone would know the rules.|So that all people could know the rules, Hammurabi recorded a set of 282 laws.|Hammurabi wrote down 282 laws so that everyone would know what the rules were.|Hammurabi wrote down 28 laws so that only judges would know the rules.
  Traders carried grain and cloth up the river and returned with wood and stone.|Merchants took grain and cloth upriver and brought back stone and timber.|Traders carried grain and cloth up the river and came back with wood and stone.|Traders carried wood and stone up the river and returned with gold.
  The wheel was first used for making pots, and only later for carts.|Before people put wheels on carts, they used them to shape pots.|The wheel was first used for making pots, and only later was it used for carts.|The wheel was first used for carts, and only later for making pots.
  Clay tablets were baked hard so that the writing would last.|To make their writing last, people baked the clay tablets until they were hard.|Clay tablets were baked until hard so that the writing would last.|Clay tablets were kept soft so that the writing could be changed.
  Most people in the first cities were farmers who lived outside the walls.|The majority of people in early cities farmed the land beyond the walls.|Most of the people in the first cities were farmers who lived outside the walls.|Most people in the first cities were soldiers who lived inside the palace.
  Floods could destroy a whole year's crops in a single day.|In just one day, a flood might ruin all the crops of a year.|Floods could destroy a whole year's crops in only a single day.|Floods helped the crops grow twice as fast in a single day.
  The city's walls protected its people from raiders and wild animals.|Raiders and wild animals were kept away from the people by the city walls.|The city's walls protected all its people from raiders and wild animals.|The city's walls kept the people from leaving to trade.
  Writing began as a way to count sheep, grain and jars of oil.|People first wrote to keep count of things like grain, sheep and oil jars.|Writing began as a way of counting sheep, grain and jars of oil.|Writing began as a way to tell stories about the gods.
  A volcano forms when melted rock rises through a crack in Earth's crust.|When magma pushes up through a gap in the crust, a volcano begins to form.|A volcano forms when the melted rock rises up through a crack in Earth's crust.|A volcano forms when rain wears a hole in Earth's crust.
  Earthquakes happen when two plates of rock suddenly slip past each other.|A sudden slip between two plates of rock causes an earthquake.|Earthquakes happen when two plates of rock suddenly slip past one another.|Earthquakes happen when two plates of rock slowly melt together.
  Cells are the smallest living units of every plant and animal.|Every animal and plant is made of cells, the tiniest units that are alive.|Cells are the smallest of the living units of every plant and animal.|Cells are the largest living units, found only in animals.
  Plants use sunlight to turn water and carbon dioxide into sugar.|With the energy of sunlight, plants make sugar from carbon dioxide and water.|Plants use the sunlight to turn water and carbon dioxide into sugar.|Plants use moonlight to turn sugar into water and carbon dioxide.
  Bees carry pollen from flower to flower, which helps fruit to grow.|Fruit can grow because bees move pollen between flowers.|Bees carry the pollen from flower to flower, and this helps fruit to grow.|Bees eat pollen from flowers, which stops fruit from growing.
  Nearly a third of the food grown in the world is wasted.|About one third of the world's food ends up thrown away.|Nearly a third of all the food grown in the world is wasted.|Nearly all of the food grown in the world is wasted.
  The first Olympic Games were held in Greece in 776 BCE.|In 776 BCE, Greece hosted the earliest Olympic Games.|The first Olympic Games were held in Greece in the year 776 BCE.|The first Olympic Games were held in Rome in 776 BCE.
  Referees were added to football to stop arguments over the rules.|To end disputes about the rules, football began to use referees.|Referees were added to football in order to stop arguments over the rules.|Referees were added to football to make the games last longer.
  Tsunamis can cross an entire ocean in less than a day.|In under a day, a tsunami may travel all the way across an ocean.|Tsunamis can cross an entire ocean in a little less than a day.|Tsunamis can cross a small lake in less than a week.
  Roman roads were built in straight lines to save time on long journeys.|To make long trips quicker, the Romans built their roads straight.|Roman roads were built in straight lines to save time on their long journeys.|Roman roads were built in curves to make long journeys more scenic.
  Seeds can stay alive for years in a cold, dry place.|In cold, dry conditions, seeds may survive for many years.|Seeds can stay alive for many years in a cold, dry place.|Seeds die within days in a cold, dry place.
  Vaccines teach the body to fight a disease before it gets sick.|Before illness strikes, a vaccine trains the body to defend itself against a disease.|Vaccines teach the body how to fight a disease before it gets sick.|Vaccines cure a disease after the body gets sick.
  The word "salary" comes from the Latin word for salt.|"Salary" grew out of the Latin word that meant salt.|The word "salary" comes from the Latin word that means salt.|The word "salary" comes from the Greek word for gold.
  Sleep helps the brain store what it learned during the day.|During sleep, the brain saves the things it learned that day.|Sleep helps the brain to store what it learned during the day.|Sleep makes the brain forget what it learned during the day.
  The Nile flooded every summer and left rich black soil behind.|Each summer the Nile overflowed, leaving behind dark, fertile soil.|The Nile flooded every summer and left the rich black soil behind.|The Nile flooded every winter and washed all the soil away.
  Chocolate was first made as a bitter drink by the peoples of Central America.|The peoples of Central America first prepared chocolate as a bitter drink.|Chocolate was first made as a bitter drink by peoples of Central America.|Chocolate was first made as a sweet cake by the peoples of Europe.
  Genes carry the instructions that tell a cell how to grow.|The instructions for how a cell grows are carried in its genes.|Genes carry all the instructions that tell a cell how to grow.|Genes carry the food that a cell needs to grow.
  Athletes drink water often because the body loses a lot through sweat.|Since sweating drains so much water from the body, athletes drink often.|Athletes drink water often because the body loses a lot of it through sweat.|Athletes drink little water because the body makes its own while running.
`);

const keepsMeaning: ChoiceItem[] = paraphraseRows.map((r) => [field(r, 0), field(r, 1), [field(r, 3), field(r, 2)]]);

const paraphrase = topic("writing", {
  id: "paraphrasing-a-source",
  title: ["Paraphrasing a Source", "转述来源"],
  summary: [
    "A paraphrase keeps every idea of the source in new words and a new sentence order, adds nothing and changes no fact.",
    "转述用新的词语和新的句子顺序保留来源的每一个意思，不增加内容，也不改变任何事实。",
  ],
  after: ["quote-paraphrase-or-summary"],
  points: [
    choose(
      "the-paraphrase-that-keeps-the-meaning",
      ["The Paraphrase That Keeps the Meaning", "保留原意的转述"],
      [
        "To **paraphrase** is to say what a source says in your own words. A good paraphrase changes the words *and* the order of the sentence, but keeps every fact: the same who, what, when and how many. Read the source, then check each choice fact by fact.",
        "**转述**就是用自己的话说出来源的内容。好的转述既改变词语*也*改变句子顺序，但保留每一个事实：同样的人物、事情、时间和数量。先读来源，再逐个事实地检查每个选项。",
      ],
      ["Which is the best paraphrase of the source?", "哪一项是对来源最好的转述？"],
      keepsMeaning,
      (right) => [
        `**${right}** It uses new words and a new order, and every fact of the source is still there.`,
        `**${right}** 它用了新的词语和新的顺序，来源中的每个事实都还在。`,
      ],
      [
        [
          "*{wrong}* changes a fact of the source, so it is no longer a true paraphrase.",
          "*{wrong}* 改变了来源中的一个事实，所以已经不是正确的转述。",
        ],
        [
          "*{wrong}* copies the source almost word for word; that is a quotation without quotation marks.",
          "*{wrong}* 几乎逐字照抄了来源，这等于是没有加引号的引用。",
        ],
      ],
    ),
    label(
      "what-is-wrong-with-it",
      ["What Is Wrong with It", "它有什么问题"],
      [
        "A paraphrase can go wrong in two ways. It **copies the source** when it keeps most of the words and their order, changing only a word or two; that is not your own words. It **changes a fact** when a name, a number, a place or a cause is different from the source. A paraphrase that does neither is **a good paraphrase**.",
        "转述可能在两方面出错。如果它保留了大部分词语及其顺序，只改了一两个词，就是**照抄来源**，不算自己的话。如果人名、数字、地点或原因与来源不同，就是**改变了事实**。两种错误都没有的转述就是**好的转述**。",
      ],
      ["Source and paraphrase: what is true of the paraphrase?", "来源与转述：这个转述属于哪种情况？"],
      paraphraseRows
        .map((r, i) => {
          const pick = i % 3;
          const shown = `Source: ${field(r, 0)} Paraphrase: ${field(r, pick + 1)}`;
          return `${shown}|${["a good paraphrase", "it copies the source", "it changes a fact"][pick]}`;
        })
        .join("\n"),
      {
        "a good paraphrase": {
          zh: "好的转述",
          why: ["The words and their order are new, and every fact matches the source.", "词语和顺序都是新的，每个事实都与来源一致。"],
          not: [
            "Something is wrong here: either the words are copied or a fact has changed.",
            "这里有问题：要么词语是照抄的，要么事实被改了。",
          ],
        },
        "it copies the source": {
          zh: "照抄来源",
          why: [
            "It keeps nearly all the words of the source in the same order; only a word or two has changed.",
            "它几乎按原来的顺序保留了来源的所有词语，只改了一两个词。",
          ],
          not: ["The words here are not copied; the sentence has been put in new words.", "这里的词语不是照抄的，句子已经换了说法。"],
        },
        "it changes a fact": {
          zh: "改变了事实",
          why: ["A name, number, place or cause is different from the source.", "某个人名、数字、地点或原因与来源不同。"],
          not: ["Every fact here matches the source.", "这里的每个事实都与来源一致。"],
        },
      },
    ),
  ],
});

const relationLabels: Readonly<Record<string, Label>> = {
  adding: {
    zh: "补充",
    why: [
      "The second sentence adds another point of the same kind; *furthermore*, *also* or *in addition* fits.",
      "第二句补充同类的另一个要点，适合用 *furthermore*、*also* 或 *in addition*。",
    ],
    not: ["The second sentence does not simply add another point of the same kind.", "第二句并不只是补充同类的另一个要点。"],
  },
  contrast: {
    zh: "对比",
    why: [
      "The second sentence turns to a difference or an opposite; *however* or *on the other hand* fits.",
      "第二句转向差异或相反的一面，适合用 *however* 或 *on the other hand*。",
    ],
    not: ["The second sentence does not turn to an opposite point.", "第二句没有转向相反的一面。"],
  },
  "cause and effect": {
    zh: "因果",
    why: [
      "The second sentence tells what resulted from the first; *as a result* or *therefore* fits.",
      "第二句说明第一句造成的结果，适合用 *as a result* 或 *therefore*。",
    ],
    not: ["The second sentence is not a result of the first.", "第二句不是第一句的结果。"],
  },
  example: {
    zh: "举例",
    why: [
      "The second sentence gives a particular case of the first; *for instance* or *for example* fits.",
      "第二句给出第一句的具体事例，适合用 *for instance* 或 *for example*。",
    ],
    not: ["The second sentence is not a particular case of the first.", "第二句不是第一句的具体事例。"],
  },
  time: {
    zh: "时间",
    why: [
      "The second sentence tells what happened at another point in time; *meanwhile*, *later* or *afterward* fits.",
      "第二句说明在另一时间发生的事，适合用 *meanwhile*、*later* 或 *afterward*。",
    ],
    not: ["The link between the two sentences is not one of time.", "两句之间不是时间关系。"],
  },
  conclusion: {
    zh: "总结",
    why: [
      "The second sentence sums up what came before; *in short* or *in conclusion* fits.",
      "第二句概括前面的内容，适合用 *in short* 或 *in conclusion*。",
    ],
    not: ["The second sentence does not sum up what came before.", "第二句没有概括前面的内容。"],
  },
};

// Sentence pairs: first|second|relation|right transition|wrong transition|wrong transition
const transitionRows = rows(`
  Canals brought water to the fields.|___, the farmers could grow crops in the dry season.|cause and effect|As a result|For instance|On the other hand
  The Sumerians invented writing.|___, they built the first wheeled carts.|adding|Furthermore|As a result|For instance
  Many early cities grew beside rivers.|___, Ur stood on the banks of the Euphrates.|example|For instance|However|Meanwhile
  City people bought their food at the market.|___, village families grew their own.|contrast|On the other hand|As a result|In short
  The army marched north.|___, the king's ships sailed down the coast.|time|Meanwhile|For instance|Therefore
  The city had walls, laws, schools and a temple.|___, it was a well-organized place to live.|conclusion|In short|For instance|Meanwhile
  The river flooded every spring.|___, the fields were covered with fresh mud.|cause and effect|Therefore|However|For example
  Volcanoes can destroy towns.|___, their ash makes some of the richest soil on Earth.|contrast|However|Therefore|In addition
  Earthquakes can break roads.|___, they can knock down bridges and buildings.|adding|In addition|However|For instance
  Some animals sense danger early.|___, dogs have been seen acting strangely before earthquakes.|example|For example|In short|Meanwhile
  The ground shook for a full minute.|___, the sea began to pull back from the shore.|time|Afterward|For instance|Similarly
  Cells take in food, release energy and make copies of themselves.|___, they do everything a living thing needs.|conclusion|In short|For example|However
  Plant cells have stiff walls.|___, animal cells have only a thin, bendy membrane.|contrast|In contrast|For instance|As a result
  Red blood cells carry oxygen.|___, white blood cells fight germs.|adding|Also|Therefore|For instance
  The farmer used too much fertilizer.|___, the extra washed into the stream and harmed the fish.|cause and effect|As a result|In addition|For example
  Some foods are rich in fiber.|___, beans and oats help the body digest.|example|For instance|However|In short
  The village had no rain for months.|___, a famine spread through the valley.|cause and effect|Consequently|Similarly|For example
  The team practiced every morning.|___, their opponents rested.|time|Meanwhile|As a result|For instance
  Fair play means following the rules.|___, it means respecting your opponents.|adding|Furthermore|However|Therefore
  The referee missed the foul.|___, the other team scored an unfair goal.|cause and effect|As a result|Furthermore|In contrast
  Some sports need very little equipment.|___, running needs only a pair of shoes.|example|For example|However|Meanwhile
  Winning feels wonderful.|___, losing can teach more.|contrast|However|For example|Therefore
  The players trained hard, played fairly and helped each other.|___, they were the best team in the league.|conclusion|In short|For instance|Meanwhile
  Many English words came from French.|___, "beef" and "pork" came from French words for animals.|example|For instance|In contrast|Therefore
  The word "nice" once meant foolish.|___, it came to mean pleasant.|time|Later|For example|Furthermore
  English borrows words from many languages.|___, it keeps inventing new ones.|adding|In addition|As a result|For instance
  Old English used many endings on words.|___, modern English uses word order instead.|contrast|By contrast|For example|In addition
  The printing press made books cheap.|___, spelling began to settle into fixed forms.|cause and effect|As a result|For instance|However
  English took words from Latin, French, Norse and Hindi.|___, it is a language of many languages.|conclusion|In short|Meanwhile|However
  The guards slept by the gate.|___, the thieves crept over the back wall.|time|Meanwhile|Therefore|For example
`);

const transitionRelation = transitionRows
  .map((r) => `${field(r, 0)} ${field(r, 1).replace("___", `*${field(r, 3)}*`)}|${field(r, 2)}`)
  .join("\n");
const transitionChoice: ChoiceItem[] = transitionRows.map((r) => [
  `${field(r, 0)} ${field(r, 1)}`,
  field(r, 3),
  [field(r, 4), field(r, 5)],
]);

const transitions = topic("writing", {
  id: "transitions-between-ideas",
  title: ["Transitions Between Ideas", "观点之间的过渡"],
  summary: [
    "Transitions name how two ideas relate: adding, contrast, cause and effect, example, time and conclusion.",
    "过渡词说明两个观点之间的关系：补充、对比、因果、举例、时间和总结。",
  ],
  after: ["linking-words-for-reasons-and-contrast"],
  points: [
    label(
      "how-the-ideas-relate",
      ["How the Ideas Relate", "观点之间是什么关系"],
      [
        "A transition tells the reader how the second sentence relates to the first. It can mark **adding** another point (*furthermore*), a **contrast** (*however*), a **cause and effect** (*as a result*), an **example** of the first (*for instance*), a step in **time** (*meanwhile*), or a **conclusion** that sums up (*in short*). Read the two sentences, notice the transition in italics, and name the relation.",
        "过渡词告诉读者第二句和第一句是什么关系。它可以表示**补充**另一个要点（*furthermore*）、**对比**（*however*）、**因果**（*as a result*）、第一句的**举例**（*for instance*）、**时间**上的一步（*meanwhile*），或者概括前文的**总结**（*in short*）。读这两句话，注意斜体的过渡词，说出它们的关系。",
      ],
      ["What relation does the transition in italics show?", "斜体的过渡词表示什么关系？"],
      transitionRelation,
      relationLabels,
    ),
    choose(
      "the-transition-that-fits",
      ["The Transition That Fits", "合适的过渡词"],
      [
        "Each relation has its own transitions. **Adding**: *furthermore*, *in addition*, *also*. **Contrast**: *however*, *on the other hand*, *in contrast*. **Cause and effect**: *as a result*, *therefore*, *consequently*. **Example**: *for instance*, *for example*. **Time**: *meanwhile*, *later*, *afterward*. **Conclusion**: *in short*, *in conclusion*. A wrong transition tells the reader the wrong relation.",
        "每种关系都有自己的过渡词。**补充**：*furthermore*、*in addition*、*also*。**对比**：*however*、*on the other hand*、*in contrast*。**因果**：*as a result*、*therefore*、*consequently*。**举例**：*for instance*、*for example*。**时间**：*meanwhile*、*later*、*afterward*。**总结**：*in short*、*in conclusion*。用错过渡词，就会把错误的关系告诉读者。",
      ],
      ["Which transition fits the gap?", "哪个过渡词适合填入空格？"],
      transitionChoice,
      (right, shown) => [
        `*${shown.replace("___", right)}* **${right}** names the relation between the two sentences.`,
        `*${shown.replace("___", right)}* **${right}** 说明了两句之间的关系。`,
      ],
      [
        ["*{wrong}* names a different relation from the one between these sentences.", "*{wrong}* 表示的关系与这两句之间的关系不同。"],
        ["*{wrong}* would confuse the reader about how the two ideas connect.", "*{wrong}* 会让读者弄不清两个观点之间的联系。"],
      ],
    ),
  ],
});

// Definitions: term|good definition|circular or vague definition|no class named
const definitionRows = rows(`
  geyser|A geyser is a hot spring that shoots water and steam into the air.|A geyser is something that geysers up.|A geyser is when hot water and steam come shooting up out of the ground very high.
  volcano|A volcano is a mountain formed by melted rock that erupts from inside Earth.|A volcano is a volcanic mountain.|A volcano is where it gets really hot inside and then lava explodes out the top.
  earthquake|An earthquake is a sudden shaking of the ground caused by moving rock.|An earthquake is a quake of the earth.|An earthquake is when everything around you starts to shake and things fall off the shelves.
  cell|A cell is the smallest living unit that makes up a plant or animal.|A cell is a cellular thing.|A cell is when something is so small that you need a microscope to see it at all.
  glacier|A glacier is a huge mass of ice that moves slowly over land.|A glacier is a glacial body.|A glacier is where it is icy and cold all year and the ice slowly slides down the hill.
  canal|A canal is a channel dug by people to carry water or boats.|A canal is a canal for water.|A canal is when water goes along in a long straight line that people dug out.
  scribe|A scribe is a person whose job is to write and copy records.|A scribe is someone who does scribing.|A scribe is when someone sits all day writing things down on clay or paper.
  harvest|A harvest is the gathering of crops when they are ripe.|A harvest is when you harvest.|A harvest is when the farmers go out in the fall and pick everything they planted.
  fossil|A fossil is the remains or print of a living thing preserved in rock.|A fossil is a fossilized thing.|A fossil is something really old that you dig out of the ground and put in a museum.
  nucleus|The nucleus is the part of a cell that controls its activities.|The nucleus is the nuclear part.|The nucleus is in the middle of the cell, where all the important stuff happens.
  famine|A famine is a long shortage of food across a whole region.|A famine is a time of famine.|A famine is when people are sad and hungry because there is not enough to eat for a long time.
  referee|A referee is an official who makes sure players follow the rules.|A referee is a person who referees.|A referee is when someone runs around the field blowing a whistle at the players.
  tsunami|A tsunami is a giant sea wave caused by an earthquake or eruption under the sea.|A tsunami is a tsunami wave.|A tsunami is when the sea gets really big and comes crashing over the beach and the town.
  pollen|Pollen is a fine powder that flowers make to produce seeds.|Pollen is pollen dust.|Pollen is yellow and sticky and makes people sneeze a lot in the spring.
  dialect|A dialect is a form of a language spoken in one place or by one group.|A dialect is a dialectal way of talking.|A dialect is when people from one place talk differently and say some words in a funny way.
  aqueduct|An aqueduct is a bridge or channel built to carry water to a city.|An aqueduct is an aqueduct structure.|An aqueduct is where water goes along the top of big stone arches into the city.
  vaccine|A vaccine is a medicine that trains the body to fight a disease.|A vaccine is what vaccinates people.|A vaccine is when you go to the doctor and get a shot in your arm so you do not get sick.
  gene|A gene is a part of a cell that carries a trait from parent to child.|A gene is a genetic thing.|A gene is about families and why kids look like their moms and dads.
  erosion|Erosion is the slow wearing away of land by wind and water.|Erosion is when things erode.|Erosion is about rocks and dirt getting smaller and going away over a long time.
  ziggurat|A ziggurat is a tall stepped temple built in ancient Mesopotamia.|A ziggurat is a ziggurat building.|A ziggurat is big and old and has lots of steps going all the way up to the top.
  irrigation|Irrigation is the supplying of water to land through canals or pipes.|Irrigation is when you irrigate.|Irrigation is about farms and getting the water out to where the plants are growing.
  magma|Magma is melted rock found beneath Earth's surface.|Magma is magma rock.|Magma is when it gets so hot underground that the rocks start to melt and move.
  calorie|A calorie is a unit that measures the energy in food.|A calorie is a caloric amount.|A calorie is something in cake and candy that you are not supposed to eat too much of.
  marathon|A marathon is a running race of about 42 kilometers.|A marathon is a marathon race.|A marathon is when you run a lot, for hours and hours, until you get to the end.
  mold|Mold is a fungus that grows on damp food or surfaces.|Mold is a moldy thing.|Mold is when bread goes bad and gets green fuzzy spots all over it.
  plateau|A plateau is a large area of high, flat land.|A plateau is a plateau area.|A plateau is up high, like when you climb a mountain and then it gets flat.
  membrane|A membrane is a thin layer that surrounds a cell and controls what enters.|A membrane is a membranous layer.|A membrane is around something, kind of like a skin that covers it up.
  idiom|An idiom is a phrase whose meaning differs from the meanings of its words.|An idiom is an idiomatic phrase.|An idiom is when you say something funny that does not mean what the words say.
  drought|A drought is a long period with little or no rain.|A drought is a dry drought.|A drought is when it is hot and dry and it does not rain for a really long time.
  pesticide|A pesticide is a chemical used to kill insects that harm crops.|A pesticide is what pesticides do.|A pesticide is when farmers spray stuff on the fields to get rid of the bugs.
`);

const betterDefinition: ChoiceItem[] = definitionRows.map((r, i) => [
  `Which is the better definition of *${field(r, 0)}*?`,
  field(r, 1),
  [i % 2 === 0 ? field(r, 2) : field(r, 3), i % 2 === 0 ? field(r, 3) : field(r, 2)],
]);

// Definitions inside explanations: shown|sentence that defines the term|sentence that uses it undefined|sentence that defines it by itself
const inExplanationRows = rows(`
  Explaining why the land shook: use *fault*.|The ground shook along a fault, a crack in Earth's crust where rocks move.|The ground shook along a fault that runs under the town, past the school and out toward the hills.|The ground shook along a fault, which is a kind of faulty place.
  Explaining Mesopotamian farming: use *irrigation*.|Farmers used irrigation, a system of canals that carried river water to their fields.|Farmers depended on irrigation to grow their wheat and barley through the long, dry summers.|Farmers used irrigation, which means irrigating the fields.
  Explaining how a volcano erupts: use *magma*.|Deep underground, magma, or melted rock, pushes up toward the surface.|Deep underground, the magma pushes up slowly toward the surface until the volcano erupts.|Deep underground, magma, which is a magma substance, pushes up.
  Explaining how a cell works: use *nucleus*.|The nucleus, the cell's control center, holds the instructions for its work.|The nucleus holds all the instructions the cell needs for its work, from growing to dividing.|The nucleus, which is the nuclear part, holds the instructions.
  Explaining a tsunami: use *epicenter*.|The quake's epicenter, the point on the surface above where it began, was under the sea.|The quake's epicenter was far under the sea, more than a hundred kilometers from land.|The quake's epicenter, its epicentral point, was under the sea.
  Explaining heredity: use *trait*.|Each child inherits traits, features such as eye color passed down from parents.|Each child inherits traits from both parents, which is why brothers and sisters can look so different.|Each child inherits traits, which are things that are traits.
  Explaining early writing: use *cuneiform*.|Scribes wrote in cuneiform, a script of wedge-shaped marks pressed into clay.|Scribes wrote their records in cuneiform, keeping track of grain, cattle and taxes for the city.|Scribes wrote in cuneiform, which is cuneiform writing.
  Explaining digestion: use *enzyme*.|In the stomach, enzymes, chemicals that break food into smaller parts, go to work.|In the stomach, enzymes go to work on the food as soon as it arrives from the throat.|In the stomach, enzymes, which are enzyme chemicals, go to work.
  Explaining farming: use *fallow*.|Some fields are left fallow, unplanted for a season so the soil can rest.|Some fields are left fallow every few years, and the farmers plant the other fields instead.|Some fields are left fallow, which is the fallow state.
  Explaining rock layers: use *sediment*.|Rivers carry sediment, bits of sand, mud and stone, and drop it in layers.|Rivers carry sediment downstream for many kilometers and drop it in layers at the bottom of the sea.|Rivers carry sediment, which is sedimentary stuff.
  Explaining a sport: use *offside*.|A player is offside, ahead of the last defender when the ball is passed, and the goal does not count.|A player is offside when the ball is passed, and so the goal she scores does not count.|A player is offside, which means being off the side, and the goal does not count.
  Explaining the water cycle: use *evaporation*.|Through evaporation, the change of liquid water into vapor, the sea feeds the clouds.|Through evaporation, the sea feeds the clouds that later bring rain to the land far away.|Through evaporation, which is when water evaporates, the sea feeds the clouds.
  Explaining photosynthesis: use *chlorophyll*.|Leaves contain chlorophyll, a green substance that captures sunlight.|Leaves contain chlorophyll, which helps them make the food the whole plant needs to grow.|Leaves contain chlorophyll, a chlorophyll substance.
  Explaining trade: use *barter*.|Before coins, merchants used barter, the trading of goods for other goods.|Before coins, merchants used barter in the busy markets along the rivers and the coast.|Before coins, merchants used barter, which is bartering.
  Explaining disease: use *bacteria*.|Some illnesses are caused by bacteria, tiny one-celled living things.|Some illnesses are caused by bacteria in dirty water, which is why people boil water before drinking.|Some illnesses are caused by bacteria, which are bacterial things.
  Explaining an ancient city: use *citadel*.|The king lived in the citadel, a fortress on the highest ground of the city.|The king lived safely in the citadel with his family, his guards and his treasure.|The king lived in the citadel, a citadel building.
  Explaining mountains: use *plate*.|The Himalayas rose where two plates, giant slabs of Earth's crust, pushed together.|The Himalayas rose where two plates pushed together over millions of years, lifting the land.|The Himalayas rose where two plates, which are plate-shaped, pushed together.
  Explaining nutrition: use *protein*.|Muscles need protein, a nutrient found in foods such as eggs and beans.|Muscles need protein to grow strong, so athletes often eat more of it during training.|Muscles need protein, which is a protein food.
  Explaining words: use *etymology*.|The etymology of a word, the story of where it came from, can be surprising.|The etymology of a word can be surprising, and many common words have very strange histories.|The etymology of a word, its etymological story, can be surprising.
  Explaining an earthquake: use *aftershock*.|Hours later came an aftershock, a smaller quake that follows a large one.|Hours later came an aftershock that cracked more walls and sent people running into the street.|Hours later came an aftershock, which is an after-shock.
  Explaining a race: use *relay*.|Our team ran a relay, a race in which each runner covers one part.|Our team ran a relay at the city games and came second, just behind the school from the next town.|Our team ran a relay, a relaying race.
  Explaining cells: use *membrane*.|The membrane, a thin skin around the cell, lets food in and waste out.|The membrane lets food in and waste out, and it keeps the inside of the cell together.|The membrane, the membranous part, lets food in and waste out.
  Explaining Mesopotamia: use *delta*.|The rivers ended in a delta, flat land formed where a river drops its mud.|The rivers ended in a wide delta, where farmers grew rich crops in the soft ground.|The rivers ended in a delta, a delta-shaped region.
  Explaining a volcano: use *crater*.|At the top is a crater, a bowl-shaped hollow where the lava comes out.|At the top is a large crater, and smoke still rises from it on some days.|At the top is a crater, which is a cratered area.
  Explaining farming: use *crop rotation*.|Farmers practiced crop rotation, planting different crops in a field each year.|Farmers practiced crop rotation to keep the soil rich and their harvests large year after year.|Farmers practiced crop rotation, which is rotating crops.
  Explaining food: use *preservative*.|Salt was an early preservative, a substance that keeps food from spoiling.|Salt was an early preservative used by sailors on long voyages across the sea.|Salt was an early preservative, a preserving thing.
  Explaining heredity: use *dominant*.|Brown eyes are dominant, meaning they show up even if only one parent passes them on.|Brown eyes are dominant in many families, so many children have brown eyes like their parents.|Brown eyes are dominant, which is a dominant trait.
  Explaining language: use *loanword*.|"Piano" is a loanword, a word taken from another language.|"Piano" is a loanword in English, and so are many other words used in music.|"Piano" is a loanword, a loaned word.
  Explaining a sport: use *penalty*.|The team got a penalty, a punishment for breaking a rule, such as a free kick for the other side.|The team got a penalty late in the game, and the other side scored from it to win.|The team got a penalty, which means being penalized.
  Explaining the restless Earth: use *seismologist*.|A seismologist, a scientist who studies earthquakes, read the instruments.|A seismologist read the instruments carefully and told the city that more shaking might come.|A seismologist, a seismological person, read the instruments.
`);

const definesInExplanation: ChoiceItem[] = inExplanationRows.map((r) => [field(r, 0), field(r, 1), [field(r, 2), field(r, 3)]]);

const defining = topic("writing", {
  id: "defining-a-term-in-a-sentence",
  title: ["Defining a Term in a Sentence", "在句子中定义术语"],
  summary: [
    "A good definition names the class a thing belongs to and what sets it apart, and never uses the word to define itself.",
    "好的定义说出事物所属的类别以及它与众不同之处，而且从不用这个词本身来定义它。",
  ],
  after: ["technical-words-in-context"],
  points: [
    choose(
      "the-better-definition",
      ["The Better Definition", "更好的定义"],
      [
        "A good definition has two parts: the **class** the thing belongs to (*a geyser is a hot spring*) and **what sets it apart** from others in the class (*that shoots water into the air*). Avoid definitions that use the word itself (*a geyser is something that geysers*) and those that begin with *is when* or *is where*, which name no class.",
        "好的定义有两部分：事物所属的**类别**（*a geyser is a hot spring*）和它与同类事物的**区别**（*that shoots water into the air*）。避免用这个词本身来下定义（*a geyser is something that geysers*），也避免用 *is when* 或 *is where* 开头，因为它们没有说出类别。",
      ],
      ["Choose the better definition.", "选出更好的定义。"],
      betterDefinition,
      (right) => [
        `**${right}** It names the class and then what sets this thing apart.`,
        `**${right}** 它说出了类别，又说出了这个事物的区别特征。`,
      ],
      [
        [
          "*{wrong}* uses the word, or a form of it, to define itself, so it explains nothing.",
          "*{wrong}* 用这个词或它的变体来定义自己，什么也没解释。",
        ],
        [
          "*{wrong}* names no class; *is when* or a vague phrase does not say what the thing is.",
          "*{wrong}* 没有说出类别；*is when* 或含糊的说法并没有说明它是什么。",
        ],
      ],
    ),
    choose(
      "defining-it-in-the-explanation",
      ["Defining It in the Explanation", "在说明中下定义"],
      [
        "In an explanation, define a new term **the first time you use it**, inside the same sentence, often after a comma: *Farmers used irrigation, a system of canals that carried water to their fields.* A sentence that uses the term without defining it leaves a new reader lost, and one that defines it with the same word does not help.",
        "在说明文中，要在**第一次使用**新术语时就在同一句中给出定义，常放在逗号之后：*Farmers used irrigation, a system of canals that carried water to their fields.* 使用术语却不加定义，会让初学的读者不明白；用同一个词来定义它也没有帮助。",
      ],
      ["Which sentence defines the term within the explanation?", "哪个句子在说明中给术语下了定义？"],
      definesInExplanation,
      (right) => [
        `**${right}** It uses the term and, right beside it, says what the term means.`,
        `**${right}** 它使用了这个术语，并在旁边紧接着说明了它的意思。`,
      ],
      [
        ["*{wrong}* uses the term without saying what it means.", "*{wrong}* 使用了术语，却没有说明它的意思。"],
        [
          "*{wrong}* defines the term with the term itself, so a new reader learns nothing.",
          "*{wrong}* 用术语本身来定义它，初学的读者什么也学不到。",
        ],
      ],
    ),
  ],
});

// Vague and precise: sentence with the vague word in italics|the vague word|precise revision|still vague|wrong fact|exact word|exact word
const preciseRows = rows(`
  The lava went up *a lot* in the last hour.|a lot|The lava rose 3 meters in the last hour.|The lava went up quite a bit in the last hour.|The lava fell 3 meters in the last hour.|lava|the last hour
  The two plates *bumped into* each other.|bumped into|The two plates collided.|The two plates kind of hit each other.|The two plates moved apart.|two plates|each other
  The cell is *really small*.|really small|The cell is about 0.01 millimeters wide.|The cell is super tiny.|The cell is about 10 meters wide.|cell|The cell
  The earthquake lasted *a while*.|a while|The earthquake lasted 45 seconds.|The earthquake lasted for some time.|The earthquake lasted 45 days.|earthquake|lasted
  The volcano is *pretty tall*.|pretty tall|The volcano is 3,776 meters tall.|The volcano is very, very tall.|The volcano is 37 centimeters tall.|volcano|The volcano
  The water got *hot*.|hot|The water reached 100°C and began to boil.|The water got really warm.|The water froze at 0°C.|water|The water
  The plant grew *a bunch*.|a bunch|The plant grew 12 centimeters in two weeks.|The plant grew loads.|The plant shrank 12 centimeters in two weeks.|plant|grew
  The scientist *looked at* the cells.|looked at|The scientist examined the cells under a microscope.|The scientist checked out the cells.|The scientist ignored the cells.|scientist|cells
  The ground *moved around*.|moved around|The ground shook from side to side.|The ground did stuff.|The ground stayed perfectly still.|ground|The ground
  The river *got bigger* after the storm.|got bigger|The river rose two meters after the storm.|The river got way bigger after the storm.|The river dried up after the storm.|river|after the storm
  The crops did *badly* this year.|badly|The wheat harvest fell by a third this year.|The crops did not so great this year.|The wheat harvest doubled this year.|crops|this year
  Lots of *stuff* came out of the volcano.|stuff|Ash, gas and lava poured out of the volcano.|Lots of things came out of the volcano.|Only clean water came out of the volcano.|came out|volcano
  The bacteria *spread fast*.|spread fast|The bacteria doubled in number every 20 minutes.|The bacteria spread really, really fast.|The bacteria died out in 20 minutes.|bacteria|The bacteria
  The city was *very old*.|very old|The city was about 5,000 years old.|The city was super ancient.|The city was about 50 years old.|city|The city
  The tsunami was *huge*.|huge|The tsunami was 30 meters high.|The tsunami was gigantic and massive.|The tsunami was 30 centimeters high.|tsunami|The tsunami
  The animals *went away* from the forest.|went away|The animals migrated out of the forest.|The animals left or something.|The animals moved into the forest.|animals|forest
  The rock *changed*.|changed|The rock melted into magma.|The rock was different.|The rock stayed exactly the same.|rock|The rock
  The scientists *figured out* the cause.|figured out|The scientists identified the cause.|The scientists sort of got the cause.|The scientists never found the cause.|scientists|cause
  The temperature *dropped a little*.|dropped a little|The temperature dropped by 2°C.|The temperature went down slightly-ish.|The temperature rose by 2°C.|temperature|The temperature
  The heart *pushes* blood.|pushes|The heart pumps blood through the arteries.|The heart moves blood along.|The heart stops blood from moving.|heart|blood
  The ice *got smaller*.|got smaller|The glacier shrank by 50 meters in ten years.|The ice got kind of smaller.|The glacier grew by 50 meters in ten years.|ice|The ice
  The soil had *good stuff* in it.|good stuff|The soil was rich in nitrogen.|The soil had nice things in it.|The soil had no nutrients at all.|soil|in it
  The rain came *down hard*.|down hard|Fifty millimeters of rain fell in an hour.|The rain came down very hard indeed.|Five drops of rain fell in an hour.|rain|The rain
  The cell *splits*.|splits|The cell divides into two identical cells.|The cell does a split thing.|The cell joins with another cell.|cell|The cell
  The magma *comes up*.|comes up|The magma rises through cracks in the crust.|The magma goes up somehow.|The magma sinks toward the core.|magma|The magma
  The athlete *ran fast*.|ran fast|The athlete ran 100 meters in 11 seconds.|The athlete ran super fast.|The athlete ran 100 meters in 11 minutes.|athlete|The athlete
  The farm *made a lot of food*.|made a lot of food|The farm produced 40 tons of potatoes.|The farm made tons and tons of food.|The farm produced 40 grams of potatoes.|farm|The farm
  The roots *get* water from the soil.|get|The roots absorb water from the soil.|The roots grab water from the soil.|The roots release water into the soil.|roots|water from the soil
  The quake *broke things*.|broke things|The quake toppled 200 buildings.|The quake wrecked stuff.|The quake left every building standing.|quake|The quake
  The weather *was weird*.|was weird|Snow fell in May for the first time in fifty years.|The weather was strange and odd.|The weather in May was exactly as usual.|weather|The weather
`);

const findVague: ChoiceItem[] = preciseRows.map((r) => [field(r, 0).replace(/\*/g, ""), field(r, 1), [field(r, 5), field(r, 6)]]);
const preciseRevision: ChoiceItem[] = preciseRows.map((r) => [field(r, 0), field(r, 2), [field(r, 3), field(r, 4)]]);

const precise = topic("writing", {
  id: "precise-words-for-science",
  title: ["Precise Words for Science", "科学写作的精确用词"],
  summary: [
    "Explanations use exact words and amounts instead of vague ones: rose 3 meters, not went up a lot; collide, not bump into.",
    "说明文用准确的词语和数量代替含糊的说法：rose 3 meters 而不是 went up a lot；collide 而不是 bump into。",
  ],
  after: ["formal-style"],
  points: [
    choose(
      "finding-the-vague-word",
      ["Finding the Vague Word", "找出含糊的词"],
      [
        "Vague words leave the reader guessing: *a lot*, *stuff*, *really small*, *a while*, *got bigger*. In science, the reader needs to know **how much**, **how long** and **exactly what happened**. Find the word or phrase that a scientist would replace with a number or an exact verb.",
        "含糊的词让读者只能去猜：*a lot*、*stuff*、*really small*、*a while*、*got bigger*。在科学写作中，读者需要知道**多少**、**多久**以及**到底发生了什么**。找出科学家会用数字或准确动词替换的词或短语。",
      ],
      ["Which word or phrase is vague?", "哪个词或短语含糊？"],
      findVague,
      (right) => [
        `**${right}** is vague: it does not say how much or exactly what happened. A number or an exact verb would replace it.`,
        `**${right}** 是含糊的：它没有说明多少或到底发生了什么，应该用数字或准确的动词替换。`,
      ],
      [
        ["*{wrong}* is already exact enough; it is not the vague part.", "*{wrong}* 已经足够准确，不是含糊的部分。"],
        ["*{wrong}* names a thing clearly; the vague words are elsewhere.", "*{wrong}* 清楚地说出了事物，含糊的词在别处。"],
      ],
    ),
    choose(
      "the-precise-revision",
      ["The Precise Revision", "精确的修改"],
      [
        "A precise revision replaces a vague word with an **exact amount** (*3 meters*, *45 seconds*) or an **exact verb** (*collided*, *examined*, *absorbed*), and it keeps the facts true. Adding words like *very* or *super* does not make a sentence precise, and a revision that changes what happened is wrong.",
        "精确的修改用**准确的数量**（*3 meters*、*45 seconds*）或**准确的动词**（*collided*、*examined*、*absorbed*）替换含糊的词，并保持事实正确。加上 *very* 或 *super* 之类的词并不能使句子精确，而改变了所发生的事情的修改是错误的。",
      ],
      ["Which revision makes the sentence precise?", "哪个修改使句子变得精确？"],
      preciseRevision,
      (right) => [
        `**${right}** It replaces the vague words with an exact amount or verb and keeps the fact the same.`,
        `**${right}** 它用准确的数量或动词替换了含糊的词，并保持事实不变。`,
      ],
      [
        [
          "*{wrong}* is still vague; extra words such as *very* or *kind of* add no exact information.",
          "*{wrong}* 仍然含糊；*very* 或 *kind of* 之类的词没有增加准确的信息。",
        ],
        [
          "*{wrong}* is exact, but it changes what happened, so it is no longer true.",
          "*{wrong}* 虽然准确，却改变了所发生的事情，已经不符合事实。",
        ],
      ],
    ),
  ],
});

/** writingTopics6a are the first grade 6 writing topics checked by rule. */
export const writingTopics6a: readonly TopicDef[] = [participial, paraphrase, transitions, defining, precise];
