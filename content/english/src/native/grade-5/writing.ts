// Grade 5: the writing skills checked by rule: research questions and sources, sentences, quotations, plans of
// reports and opinion pieces, linking words, formal style, the shape and pace of stories, and proofreading.

import type { TopicDef } from "@ga/content";
import type { ChoiceItem } from "@ga/subject-english";
import { choose, field, type Label, label, type Pair, rows, topic } from "./kit.ts";

// Research questions: topic|too broad|a good question|a short yes-or-no question|another broad question|a long yes-or-no question
const questionRows = rows(`
  the water cycle|What is water?|How does water from the ocean end up as rain over land?|Is rain made of water?|What is everything about water?|Does water from the ocean ever end up falling as rain over the land?
  glaciers|What are glaciers?|How do glaciers carve valleys as they move?|Are glaciers cold?|What is there to know about ice?|Do glaciers carve out deep valleys in the mountains as they slowly move?
  the solar system|What is space?|Why does Mars look red from Earth?|Is Mars a planet?|What is in the universe?|Does Mars look red when people look at it from Earth through a telescope?
  the moon|What is the moon like?|How does the moon cause tides on Earth?|Does the moon go around Earth?|What are all the facts about the moon?|Does the moon have anything to do with the tides of the oceans on Earth?
  ancient Greece|What was ancient Greece like?|How did Athenian citizens vote in the assembly?|Did the Greeks have votes?|What happened in history?|Did the citizens of Athens vote by raising their hands in the assembly?
  the Maya|Who were the Maya?|How did the Maya keep track of time with their calendar?|Did the Maya have a calendar?|What did people do long ago?|Did the Maya keep track of time with a calendar of their own invention?
  the Inca|What about the Inca?|How did the Inca carry messages along their mountain roads?|Did the Inca build roads?|What were ancient empires like?|Did the Inca send messages along their mountain roads with fast runners?
  microbes|What are germs?|How does washing hands with soap remove germs?|Is soap good?|What is everything that lives?|Does washing your hands with soap and water get rid of germs on the skin?
  bridges|What are bridges?|Why do suspension bridges hang from cables?|Are bridges strong?|What is building?|Do suspension bridges hang from thick steel cables strung between towers?
  towers|What are towers like?|How do tall towers stay up in strong winds?|Can towers sway?|What are all the buildings in the world?|Do tall towers sway a little from side to side when strong winds blow?
  matter|What is matter?|Why does ice float on liquid water?|Does ice melt?|What is everything made of?|Does ice float on top of liquid water instead of sinking to the bottom?
  volcanoes|What are volcanoes?|How do scientists warn people before a volcano erupts?|Are volcanoes hot?|What happens inside the Earth?|Can scientists warn the people who live nearby before a volcano erupts?
  rain forests|What is a rain forest?|How do rain forest plants get enough sunlight under tall trees?|Do rain forests have trees?|What grows on Earth?|Do rain forest plants that grow under tall trees still get some sunlight?
  the Aztec|Who were the Aztec?|How did the Aztec grow crops on floating gardens?|Did the Aztec farm?|What is the history of Mexico?|Did the Aztec grow some of their crops on gardens floating in a lake?
  deserts|What are deserts?|How do camels survive for days without drinking?|Are deserts dry?|What are all the places on Earth?|Can camels survive for several days in the desert without drinking water?
  recycling|What is recycling?|What happens to plastic bottles after they are recycled?|Is recycling good?|What is garbage?|Are plastic bottles turned into something new after they are recycled?
  bees|What are bees?|How do honeybees tell each other where flowers are?|Do bees make honey?|What are insects?|Can honeybees tell the other bees in their hive where to find flowers?
  storms|What is weather?|How do hurricanes form over warm ocean water?|Are hurricanes windy?|What is the sky like?|Do hurricanes begin as storms over warm water far out in the ocean?
  the Olympics|What are sports?|How did the ancient Olympic Games differ from today's Games?|Were there Olympics long ago?|What is the history of every game?|Were the ancient Olympic Games different in any way from today's Games?
  domes|What are domes?|How did Roman builders make the Pantheon's dome so wide?|Is the Pantheon round?|What is architecture?|Did Roman builders use a special kind of concrete for the Pantheon's dome?
  mysteries|What are mysteries?|How do mystery writers hide clues from the reader?|Are mysteries fun?|What are all kinds of books?|Do mystery writers try to hide some of their clues from the reader?
  diaries|What is a diary?|What do diaries from 1850 tell us about school at the time?|Did children write diaries?|What happened in the past?|Do diaries written in 1850 tell us anything about school at that time?
  oceans|What is the ocean?|How do deep-sea fish find food in the dark?|Is the ocean deep?|What lives in water?|Do deep-sea fish manage to find food in the dark at the bottom of the sea?
  plants|What are plants?|How do plants turn sunlight into food?|Do plants need light?|What is nature?|Do plants use the energy of sunlight to make their own food in their leaves?
  the human body|What is the body?|How does the heart pump blood around the body?|Does the heart beat?|What is a living thing?|Does the heart pump blood all the way around the body through blood vessels?
  electricity|What is electricity?|How does a dam turn falling water into electricity?|Do dams make power?|What is energy?|Can a dam use the water falling through it to make electricity for a town?
  maps|What are maps?|How did sailors find their way before there were satellites?|Did old sailors use maps?|What is geography?|Did sailors find their way across the sea before there were satellites?
  survival|What is survival?|How do people stay warm if they are lost in the snow?|Is snow cold?|What are dangers?|Can people who are lost in the snow stay warm until someone rescues them?
  food|What is food?|Why does bread rise when it bakes?|Does bread have yeast?|What do people eat?|Does bread rise in the oven because of the yeast mixed into the dough?
  animals|What are animals?|How do monarch butterflies find their way to Mexico each autumn?|Do butterflies fly?|What are all creatures?|Do monarch butterflies fly all the way to Mexico at the end of each summer?
`);
const betterQuestions: ChoiceItem[] = questionRows.map(
  (r): ChoiceItem => [`Topic of a short report: ${field(r, 0)}`, field(r, 2), [field(r, 5), field(r, 1)]],
);
const narrowedQuestions: ChoiceItem[] = questionRows.map(
  (r): ChoiceItem => [`This question is too broad: *${field(r, 1)}*`, field(r, 2), [field(r, 4), field(r, 5)]],
);

const researchQuestion = topic("writing", {
  id: "asking-a-research-question",
  title: ["Asking a Research Question", "提出研究问题"],
  summary: [
    "A good research question is narrow enough to answer from a few sources and cannot be answered with yes or no.",
    "好的研究问题范围要小，用几个来源就能回答，而且不能用“是”或“否”来回答。",
  ],
  after: ["skimming-and-scanning"],
  points: [
    choose(
      "the-better-research-question",
      ["The Better Research Question", "更好的研究问题"],
      [
        "A research question guides what you read and write. A good one is **narrow**: a few sources can answer it in a short report. It is also **open**: it begins with *how*, *why* or *what happens* and cannot be answered with *yes* or *no*. *What is water?* is far too broad; *Is rain made of water?* is answered in one word.",
        "研究问题指引你读什么、写什么。好的研究问题范围**小**：几个来源就能在一篇短报告里回答它。它还是**开放的**：以 *how*、*why* 或 *what happens* 开头，不能用 *yes* 或 *no* 回答。*What is water?* 范围太大；*Is rain made of water?* 一个词就答完了。",
      ],
      ["Which is the best research question for the report?", "哪个是这篇报告最好的研究问题？"],
      betterQuestions,
      (right) => [
        `**${right}** is narrow enough for a few sources and needs more than yes or no to answer.`,
        `**${right}** 范围够小，几个来源就能回答，而且不能只用“是”或“否”回答。`,
      ],
      [
        [
          "*{wrong}* can be answered with yes or no, so there is nothing to research.",
          "*{wrong}* 用“是”或“否”就能回答，没有什么可研究的。",
        ],
        ["*{wrong}* is so broad that a whole library could not answer it.", "*{wrong}* 范围太大，整个图书馆也回答不完。"],
      ],
    ),
    choose(
      "narrowing-a-broad-question",
      ["Narrowing a Broad Question", "缩小过大的问题"],
      [
        "To narrow a broad question, pick **one part** of the topic and ask **how** or **why** about it. *What are bridges?* becomes *Why do suspension bridges hang from cables?* Be careful not to narrow it so far that it becomes a yes-or-no question, and not to swap it for another broad one.",
        "要缩小过大的问题，就选出主题的**一个方面**，并对它提出 **how** 或 **why** 的问题。*What are bridges?* 可以变成 *Why do suspension bridges hang from cables?* 注意不要缩小到只能用“是”或“否”回答，也不要换成另一个同样宽泛的问题。",
      ],
      ["Which question narrows it best?", "哪个问题把它缩小得最好？"],
      narrowedQuestions,
      (right) => [
        `**${right}** picks one part of the topic and asks how or why about it.`,
        `**${right}** 选出主题的一个方面，并提出了 how 或 why 的问题。`,
      ],
      [
        ["*{wrong}* is still too broad to answer from a few sources.", "*{wrong}* 仍然太宽泛，几个来源回答不了。"],
        ["*{wrong}* is narrow, but yes or no answers it.", "*{wrong}* 范围小了，但用“是”或“否”就能回答。"],
      ],
    ),
  ],
});

/** lowerStart lowers the first word of a sentence unless it is a name. */
const lowerStart = (text: string) =>
  /^(The|A|An|It|Its|They|Their|He|His|She|Her|Some|Every|Each|Many|Most|Children|People|Families) /.test(text)
    ? `${text.charAt(0).toLowerCase()}${text.slice(1)}`
    : text;

// According to a source: source|fact (a paraphrase, starting in lower case)
const sourceFacts = rows(`
  *The Water Atlas*|only about three percent of Earth's water is fresh
  the museum's website|the oldest bridge in the city was built in 1640
  *Ocean Giants*|a blue whale's heart is about the size of a small car
  Dr. Mira Sen, a glacier scientist,|some glaciers move more than a meter a day
  *Life in Ancient Athens*|only free men could vote in the assembly
  the city water department|a dripping tap can waste twenty liters a day
  *The Inca Road*|the Inca built roads that stretched for thousands of kilometers
  the space agency's website|the Hubble telescope was launched in 1990
  *Tiny Life*|a single spoonful of soil holds millions of bacteria
  Professor Ruiz, who studies the Maya,|Maya farmers grew maize, beans and squash together
  *Great Towers of the World*|the Eiffel Tower grows a little taller on hot days
  the National Weather Service|lightning strikes Earth about forty times every second
  *Kitchen Science*|yeast gives off a gas that makes bread dough rise
  a park ranger at Pine Lake|snowy owls hunt during the day as well as at night
  *Mysteries of the Desert*|some desert frogs wait underground for years until rain falls
  the town historian, Ms. Grant,|the first school in town had only one room
  *The Story of Domes*|the dome of the Pantheon has a round opening at its top
  the zoo's guidebook|a giraffe sleeps for less than two hours a day
  *Letters Home, 1850*|letters across the ocean took months to arrive
  Captain Moss, a firefighter,|most kitchen fires start when cooking is left alone
  *The Aztec Capital*|the city of Tenochtitlan was built on an island in a lake
  the encyclopedia|the Nile is one of the longest rivers in the world
  *Survival Skills*|a person can live only about three days without water
  the hospital's report|washing hands for twenty seconds removes most germs
  *Bees and Their World*|a honeybee visits hundreds of flowers on a single trip
  Mr. Diaz, the science teacher,|salt water freezes at a lower temperature than fresh water
  *The Lighthouse Book*|some lighthouse lamps can be seen forty kilometers away
  the newspaper's article|the new library will open in March
  *Our Solar System*|a day on Venus is longer than its year
  an engineer at the bridge company|the new bridge can carry two thousand trucks at once
`);
const signalled = (src: string, fact: string, i: number) => {
  const plain = src.replace(/,$/, "");
  const cap = (x: string) => x.charAt(0).toUpperCase() + x.slice(1);
  switch (i % 3) {
    case 0:
      return `According to ${plain}, ${fact}.`;
    case 1:
      return `${cap(src)} explains that ${fact}.`;
    default:
      return `As ${src} reports, ${fact}.`;
  }
};
const sourcedItems: ChoiceItem[] = sourceFacts.map((r, i): ChoiceItem => {
  const other = sourceFacts[(i + 7) % sourceFacts.length] ?? r;
  const fact = field(r, 1);
  return [
    `A fact you found, from ${field(r, 0).replace(/,$/, "")}: ${fact}.`,
    signalled(field(r, 0), fact, i),
    [`Some people say that ${fact}, so it must be true.`, signalled(field(other, 0), fact, i)],
  ];
});
const punctuatedItems: ChoiceItem[] = sourceFacts.map((r, i): ChoiceItem => {
  const plain = field(r, 0).replace(/,$/, "");
  const fact = field(r, 1);
  return [
    `Your paraphrase from ${plain}: ${fact}.`,
    `According to ${plain}, ${fact}.`,
    i % 2 === 0
      ? [`According to ${plain}, "${fact}."`, `According to ${plain} ${fact}.`]
      : [`"According to ${plain}, ${fact}."`, `${fact.charAt(0).toUpperCase() + fact.slice(1)} according to ${plain}, it says.`],
  ];
});

const accordingToASource = topic("writing", {
  id: "according-to-a-source",
  title: ["According to a Source", "根据某个来源"],
  summary: [
    "A report says where a fact comes from with a signal phrase (According to the Water Atlas, The museum's website explains that).",
    "报告用引导语说明事实的出处（According to the Water Atlas，The museum's website explains that）。",
  ],
  after: ["listing-sources", "paraphrasing-a-sentence"],
  points: [
    choose(
      "a-signal-phrase-that-names-the-source",
      ["A Signal Phrase That Names the Source", "说出来源的引导语"],
      [
        "When a report gives a fact from research, it tells the reader **where the fact comes from**. A **signal phrase** names the source: *According to The Water Atlas*, *The museum's website explains that*, *As Dr. Sen reports*. Vague words such as *some people say* name no source, and naming the wrong source misleads the reader.",
        "报告给出研究得来的事实时，要告诉读者**事实出自哪里**。**引导语**说出来源：*According to The Water Atlas*、*The museum's website explains that*、*As Dr. Sen reports*。*some people say* 这样含糊的话没有说出来源，而说错来源会误导读者。",
      ],
      ["Which sentence names the source of the fact correctly?", "哪个句子正确地说出了事实的来源？"],
      sourcedItems,
      (right) => [`**${right}** names the source the fact really comes from.`, `**${right}** 说出了事实真正的来源。`],
      [
        ["*{wrong}* names no source at all, so the reader cannot check the fact.", "*{wrong}* 根本没有说出来源，读者无法核实这个事实。"],
        ["*{wrong}* names a source the fact did not come from.", "*{wrong}* 说出的来源并不是这个事实的出处。"],
      ],
    ),
    choose(
      "adding-a-signal-phrase-to-a-paraphrase",
      ["Adding a Signal Phrase to a Paraphrase", "给转述加上引导语"],
      [
        "A **paraphrase** gives a source's idea in your own words, so it takes **no quotation marks**: those are only for a source's exact words. Put the signal phrase first and follow it with a **comma**: *According to the zoo's guidebook, a giraffe sleeps for less than two hours a day.*",
        "**转述**用自己的话表达来源的意思，所以**不用引号**：引号只用于来源的原话。把引导语放在前面，后面加**逗号**：*According to the zoo's guidebook, a giraffe sleeps for less than two hours a day.*",
      ],
      ["Which sentence adds the signal phrase correctly?", "哪个句子正确地加上了引导语？"],
      punctuatedItems,
      (right) => [
        `**${right}** puts the signal phrase first, with a comma and no quotation marks around the paraphrase.`,
        `**${right}** 把引导语放在前面，加了逗号，转述部分不用引号。`,
      ],
      [
        [
          "*{wrong}* puts quotation marks around a paraphrase, as if these were the source's exact words.",
          "*{wrong}* 给转述加了引号，好像这是来源的原话。",
        ],
        [
          "*{wrong}* leaves out the comma or muddles the sentence around the signal phrase.",
          "*{wrong}* 漏掉了逗号，或把引导语周围的句子弄乱了。",
        ],
      ],
    ),
  ],
});

// Combining and reducing sentences.
const reduceLines = `
  The bridge was long in length and it stretched across the river.|The long bridge stretched across the river.|The bridge was long in length, and it stretched all the way across.|The bridge was across a river.
  At this point in time, the glacier is melting.|The glacier is melting now.|At this point in time right now, the glacier melts.|The glacier melted long ago.
  The scientist, who was a woman, studied cells.|The woman scientist studied cells.|The scientist, who was a woman scientist, studied cells.|The scientist studied a woman's cells.
  Due to the fact that it rained, the game was canceled.|Because it rained, the game was canceled.|Due to the fact that it rained, they canceled the game off.|It rained after the game.
  The tower is tall and high and rises above the city.|The tall tower rises above the city.|The tower is tall and high and it rises above.|The tower is near the city.
  In my opinion, I think the dome is beautiful.|I think the dome is beautiful.|In my opinion, I personally think the dome is beautiful.|The dome was beautiful once.
  The Maya built cities, and the cities that they built were large.|The Maya built large cities.|The Maya built cities, and the cities were large ones.|The large cities built the Maya.
  The mold was green in color and fuzzy.|The mold was green and fuzzy.|The mold was green in color and was fuzzy in feel.|The mold was not green.
  We returned back to camp before it got dark.|We returned to camp before dark.|We returned back again to camp before dark.|We left camp after dark.
  Each and every student brought a notebook.|Every student brought a notebook.|Each and every single student brought one notebook.|Some students brought a notebook.
  The reason why the ice melted is because the sun came out.|The ice melted because the sun came out.|The reason the ice melted is because of the sun coming out.|The sun melted after the ice.
  She whispered quietly to her friend.|She whispered to her friend.|She whispered quietly and softly to her friend.|She shouted to her friend.
  The two twins looked exactly alike.|The twins looked alike.|The two twins looked exactly and completely alike.|The two twins looked different.
  The end result was a cleaner river.|The result was a cleaner river.|The final end result was a cleaner river.|The river became dirtier.
  In the year 1911, an explorer reached Machu Picchu.|In 1911, an explorer reached Machu Picchu.|In the year of 1911, an explorer reached it there.|In 1911, Machu Picchu reached an explorer.
  The microscope made the cells look bigger in size.|The microscope made the cells look bigger.|The microscope made the cells look bigger and larger.|The cells made the microscope look bigger.
  He made a decision to join the team.|He decided to join the team.|He made the decision to decide to join the team.|He decided to leave the team.
  The detective looked closely and carefully at the footprint.|The detective studied the footprint.|The detective looked closely, carefully and slowly at it.|The footprint looked at the detective.
  It is a fact that bees make honey.|Bees make honey.|It is a true fact that bees make honey.|Bees do not make honey.
  The storm was very strong and very powerful.|The storm was powerful.|The storm was very strong and powerful and mighty.|The storm was weak.
  The diary, which was old, had yellow pages.|The old diary had yellow pages.|The diary, which was an old diary, had yellow pages.|The yellow pages had a diary.
  We will meet together at noon.|We will meet at noon.|We will all meet together at noon time.|We met yesterday morning.
  The water was frozen solid into ice.|The water was frozen solid.|The water was frozen solid into hard ice.|The ice was melting quickly.
  For the purpose of saving water, we fixed the tap.|To save water, we fixed the tap.|For the purpose of saving water, we fixed up the tap.|We broke the tap to save water.
  The puppy was small in size and brown in color.|The puppy was small and brown.|The puppy was small in size and brownish in color.|The puppy was large and white.
  Past history shows that floods return.|History shows that floods return.|Past history from long ago shows floods return.|History shows that floods never return.
  The temple was built by workers who worked hard.|Hard workers built the temple.|The temple was built by workers who worked very hard.|The temple built the workers.
  Despite the fact that it was cold, we swam.|Although it was cold, we swam.|Despite the fact that it was cold out, we swam anyway.|Because it was warm, we swam.
  The answer is completely and totally correct.|The answer is correct.|The answer is completely, totally and wholly correct.|The answer is wrong.
  The ship sank down to the bottom of the sea.|The ship sank to the bottom of the sea.|The ship sank down and down to the very bottom.|The ship floated on the sea.
`;
const combineLines = `
  The bridge is old. The bridge is made of stone. The bridge crosses the river.|The old stone bridge crosses the river.|The bridge is old, the bridge is stone, the bridge crosses the river.|The bridge is old, and the bridge is made of stone, and the bridge crosses the river.
  Maya watched the comet. Her father watched the comet. They stood on the hill.|Maya and her father watched the comet from the hill.|Maya watched the comet, her father watched the comet, they stood on the hill.|Maya watched the comet, and her father watched the comet, and they stood on the hill.
  The cell has a membrane. The membrane is thin. The membrane lets food in.|The cell's thin membrane lets food in.|The cell has a membrane, it is thin, it lets food in.|The cell has a membrane, and the membrane is thin, and the membrane lets food in.
  The Inca built roads. The roads were long. The roads crossed mountains.|The Inca built long roads across the mountains.|The Inca built roads, the roads were long, they crossed mountains.|The Inca built roads, and the roads were long, and the roads crossed mountains.
  The storm hit. It hit at night. It knocked down trees.|The storm hit at night and knocked down trees.|The storm hit, it hit at night, it knocked down trees.|The storm hit, and it hit at night, and it knocked down trees.
  The detective found a clue. The clue was a button. It was under the sofa.|The detective found a button under the sofa.|The detective found a clue, the clue was a button, it was under the sofa.|The detective found a clue, and the clue was a button, and it was under the sofa.
  The tower is tall. The tower is made of steel. It stands in Paris.|The tall steel tower stands in Paris.|The tower is tall, it is steel, it stands in Paris.|The tower is tall, and the tower is made of steel, and it stands in Paris.
  Ana dug a pit. She covered it with a tarp. She sat in the shade.|Ana dug a pit, covered it with a tarp and sat in the shade.|Ana dug a pit, she covered it with a tarp, she sat in the shade.|Ana dug a pit, and she covered it with a tarp, and she sat in the shade.
  The diary is old. The diary belonged to a girl. She lived in 1850.|The old diary belonged to a girl who lived in 1850.|The diary is old, it belonged to a girl, she lived in 1850.|The diary is old, and the diary belonged to a girl, and she lived in 1850.
  The volcano erupted. Ash filled the sky. The town was covered in gray dust.|When the volcano erupted, ash filled the sky and covered the town in gray dust.|The volcano erupted, ash filled the sky, the town was covered in dust.|The volcano erupted, and ash filled the sky, and the town was covered in gray dust.
  Bees visit flowers. They collect nectar. They make honey from it.|Bees visit flowers to collect the nectar they make into honey.|Bees visit flowers, they collect nectar, they make honey from it.|Bees visit flowers, and they collect nectar, and they make honey from it.
  The Greeks held games. The games were at Olympia. They were held every four years.|Every four years, the Greeks held games at Olympia.|The Greeks held games, they were at Olympia, they were every four years.|The Greeks held games, and the games were at Olympia, and they were every four years.
  The lake froze. The ice was thick. Children skated on it.|Children skated on the thick ice of the frozen lake.|The lake froze, the ice was thick, children skated on it.|The lake froze, and the ice was thick, and children skated on it.
  Leo found a puppy. It was lost. It was shivering in the rain.|Leo found a lost puppy shivering in the rain.|Leo found a puppy, it was lost, it was shivering in the rain.|Leo found a puppy, and it was lost, and it was shivering in the rain.
  The dome is huge. It is made of concrete. It has stood for 1,900 years.|The huge concrete dome has stood for 1,900 years.|The dome is huge, it is concrete, it has stood for 1,900 years.|The dome is huge, and it is made of concrete, and it has stood for 1,900 years.
  The fire started in the bakery. It spread to the roof. Firefighters put it out.|The fire started in the bakery and spread to the roof before firefighters put it out.|The fire started in the bakery, it spread to the roof, firefighters put it out.|The fire started in the bakery, and it spread to the roof, and firefighters put it out.
  The yeast was alive. It ate the sugar. It made bubbles.|The live yeast ate the sugar and made bubbles.|The yeast was alive, it ate the sugar, it made bubbles.|The yeast was alive, and it ate the sugar, and it made bubbles.
  The raft drifted. It drifted for a day. The wind had died.|With the wind gone, the raft drifted for a day.|The raft drifted, it drifted for a day, the wind had died.|The raft drifted, and it drifted for a day, and the wind had died.
  Pasteur heated milk. He heated it gently. This killed most germs.|Pasteur heated milk gently to kill most germs.|Pasteur heated milk, he heated it gently, this killed most germs.|Pasteur heated milk, and he heated it gently, and this killed most germs.
  The map was torn. It was very old. It showed an island.|The torn old map showed an island.|The map was torn, it was very old, it showed an island.|The map was torn, and it was very old, and it showed an island.
  The canoe tipped. Maya swam to shore. Leo swam with her.|When the canoe tipped, Maya and Leo swam to shore.|The canoe tipped, Maya swam to shore, Leo swam with her.|The canoe tipped, and Maya swam to shore, and Leo swam with her.
  The river is wide. It is muddy. It flows into the sea.|The wide, muddy river flows into the sea.|The river is wide, it is muddy, it flows into the sea.|The river is wide, and it is muddy, and it flows into the sea.
  Kira sneezed. She covered her mouth. She used her elbow.|Kira sneezed into her elbow.|Kira sneezed, she covered her mouth, she used her elbow.|Kira sneezed, and she covered her mouth, and she used her elbow.
  The owl landed. It landed on a branch. The branch was bare.|The owl landed on a bare branch.|The owl landed, it landed on a branch, the branch was bare.|The owl landed, and it landed on a branch, and the branch was bare.
  The guide spoke. She spoke about the Inca. She spoke for an hour.|The guide spoke about the Inca for an hour.|The guide spoke, she spoke about the Inca, she spoke for an hour.|The guide spoke, and she spoke about the Inca, and she spoke for an hour.
  The letter arrived. It came from Uncle Ed. It had taken three months.|The letter from Uncle Ed arrived after three months.|The letter arrived, it came from Uncle Ed, it had taken three months.|The letter arrived, and it came from Uncle Ed, and it had taken three months.
  The robot broke. Lucy fixed it. She found a loose wire.|Lucy fixed the broken robot by finding a loose wire.|The robot broke, Lucy fixed it, she found a loose wire.|The robot broke, and Lucy fixed it, and she found a loose wire.
  The bus stopped. A tree had fallen. It blocked the road.|The bus stopped because a fallen tree blocked the road.|The bus stopped, a tree had fallen, it blocked the road.|The bus stopped, and a tree had fallen, and it blocked the road.
  The museum is new. It is in the city. It shows Maya art.|The new city museum shows Maya art.|The museum is new, it is in the city, it shows Maya art.|The museum is new, and it is in the city, and it shows Maya art.
  The seed was tiny. It cracked the stone. It grew into a tree.|The tiny seed cracked the stone and grew into a tree.|The seed was tiny, it cracked the stone, it grew into a tree.|The seed was tiny, and it cracked the stone, and it grew into a tree.
`;

const combiningAndReducing = topic("writing", {
  id: "combining-and-reducing-sentences",
  title: ["Combining and Reducing Sentences", "合并与精简句子"],
  summary: [
    "Sentences grow clearer when repeated words are cut and two ideas are joined in one sentence.",
    "删去重复的词语、把两个意思合成一句，句子就会更清楚。",
  ],
  after: ["combining-with-phrases"],
  points: [
    choose(
      "the-version-without-needless-words",
      ["The Version Without Needless Words", "没有多余词语的版本"],
      [
        "Good writers cut **needless words**: words that repeat what another word already says. *Long in length*, *return back* and *whispered quietly* each say one thing twice. Phrases such as *due to the fact that* shrink to *because*. Cut the extra words, but keep the meaning: a shorter sentence that says something different is not better.",
        "好的作者会删去**多余的词语**：重复了其他词已表达的意思的词。*long in length*、*return back* 和 *whispered quietly* 都把一个意思说了两遍。*due to the fact that* 这样的短语可以缩成 *because*。删去多余的词，但要保留原意：更短却意思不同的句子并不更好。",
      ],
      ["Which version cuts the needless words and keeps the meaning?", "哪个版本删去了多余的词语，又保留了原意？"],
      reduceLines,
      (right) => [`**${right}** says the same thing with no word repeated or wasted.`, `**${right}** 意思不变，没有重复或多余的词。`],
      [
        ["*{wrong}* still repeats words that say the same thing.", "*{wrong}* 仍然有意思重复的词。"],
        ["*{wrong}* is shorter but changes the meaning.", "*{wrong}* 虽然更短，却改变了原意。"],
      ],
    ),
    choose(
      "combining-three-short-sentences",
      ["Combining Three Short Sentences", "合并三个短句"],
      [
        "Three short sentences about one thing often read better as **one**. Fold describing words in front of the noun (*the old stone bridge*), join actions with one subject (*dug a pit, covered it and sat*), or use a joining word such as *when* or *because*. Do not just string the sentences together with commas or with *and* after *and*.",
        "关于同一件事的三个短句，合成**一句**往往更好读。把描写词放在名词前面（*the old stone bridge*），把同一主语的几个动作连起来（*dug a pit, covered it and sat*），或用 *when*、*because* 等连接词。不要只用逗号或一个接一个的 *and* 把句子串起来。",
      ],
      ["Which is the best way to combine the three sentences?", "合并这三个句子最好的方式是哪一个？"],
      combineLines,
      (right) => [
        `**${right}** joins the ideas in one smooth sentence with no repeated words.`,
        `**${right}** 把几个意思合成一个流畅的句子，没有重复的词。`,
      ],
      [
        [
          "*{wrong}* joins whole sentences with commas alone, which makes a comma splice.",
          "*{wrong}* 只用逗号连接完整的句子，造成了逗号粘连。",
        ],
        [
          "*{wrong}* strings the sentences together with *and* and keeps every repeated word.",
          "*{wrong}* 用一连串 *and* 把句子串起来，重复的词一个也没删。",
        ],
      ],
    ),
  ],
});

// Quote, paraphrase or summarize: a source, then a quotation, a paraphrase and a summary of it.
const qpsSources = rows(`
  Dr. Sen: "Glaciers are rivers of ice. They move so slowly that you cannot see it, but over a year some travel the length of a soccer field."|Dr. Sen calls glaciers "rivers of ice."|Dr. Sen explains that some glaciers move about a hundred meters a year.|Dr. Sen describes glaciers as slow-moving ice that travels a long way over time.
  Ranger Hale: "The owl needs rest before its long flight north. Every time someone walks too close, it wastes energy it cannot spare."|Ranger Hale says the owl "needs rest before its long flight north."|Ranger Hale explains that people who get too close make the owl use up energy.|Ranger Hale explains that the owl must rest undisturbed before it flies home.
  Ms. Park: "Never eat in the lab. A crumb that touches a slide can carry germs into your mouth."|Ms. Park warns, "Never eat in the lab."|Ms. Park says that food can pick up germs from the slides.|Ms. Park explains why eating in the lab is unsafe.
  Engineer Diaz: "The bridge did not move more than a finger's width under forty trucks. It is ready for the city."|Engineer Diaz said the bridge moved no more than "a finger's width."|Engineer Diaz reported that forty trucks barely bent the bridge.|Engineer Diaz reported that the bridge passed its test and is ready to open.
  The guidebook: "The Inca built more than 30,000 kilometers of roads. Runners carried messages along them, passing them from one to the next."|The guidebook says runners passed messages "from one to the next."|The guidebook states that Inca roads ran for over 30,000 kilometers.|The guidebook describes the huge Inca road system and how messages traveled on it.
  Grandma: "Yeast is alive. Feed it warm water and sugar, and it will wake up and make your bread rise."|Grandma says, "Yeast is alive."|Grandma explains that yeast needs warm water and sugar to become active.|Grandma explains that living yeast, when fed, makes bread rise.
  Captain Moss: "The water was up to the windows. We reached the family just before the porch gave way."|Captain Moss said, "The water was up to the windows."|Captain Moss said the rescuers got there moments before the porch collapsed.|Captain Moss described a dangerous flood rescue that was finished just in time.
  Professor Ruiz: "The Maya planted maize, beans and squash together. The beans fed the soil, and the squash leaves kept weeds away."|Professor Ruiz calls the three crops a team in which the squash leaves "kept weeds away."|Professor Ruiz says the beans made the soil richer.|Professor Ruiz explains how the Maya grew three crops together so that each helped the others.
  The museum sign: "This dome, finished in the year 125, is still the largest dome of plain concrete in the world."|The sign calls it "the largest dome of plain concrete in the world."|The sign says the dome was completed in 125.|The sign explains that the very old dome is still a record-breaker.
  Dr. Grant: "One child in five that we tested needed glasses. Many had never had their eyes checked."|Dr. Grant said, "One child in five that we tested needed glasses."|Dr. Grant said many of the children had never had an eye test before.|Dr. Grant reported that many children needed glasses and had never been tested.
`);
const usesLabels: Record<string, Label> = {
  "a quotation": {
    zh: "引用",
    why: ["It gives the speaker's exact words inside quotation marks.", "它在引号里给出说话人的原话。"],
    not: ["A quotation repeats exact words in quotation marks; this sentence does not.", "引用要在引号里重复原话；这个句子没有。"],
  },
  "a paraphrase": {
    zh: "转述",
    why: ["It gives one idea of the source in new words, with no quotation marks.", "它用新的话表达来源中的一个意思，不用引号。"],
    not: [
      "A paraphrase restates one idea in new words; this sentence does something else.",
      "转述用新的话重述一个意思；这个句子做的是别的事。",
    ],
  },
  "a summary": {
    zh: "概括",
    why: ["It gives the main point of the whole source in a few words of its own.", "它用自己的几句话给出整个来源的要点。"],
    not: ["A summary gives the main point of the whole source; this sentence does not.", "概括给出整个来源的要点；这个句子没有。"],
  },
};
const usesLines = qpsSources
  .flatMap((r) => [
    `${field(r, 0)} Writer: ${field(r, 1)}|a quotation`,
    `${field(r, 0)} Writer: ${field(r, 2)}|a paraphrase`,
    `${field(r, 0)} Writer: ${field(r, 3)}|a summary`,
  ])
  .join("\n");
const purposeLines = `
  You want to share a scientist's vivid words, *rivers of ice*, exactly as she said them.|a quotation
  You want the reader to hear the ranger's own warning, word for word.|a quotation
  The mayor's words were so striking that changing them would spoil them.|a quotation
  You want to prove that the engineer really said the bridge was ready.|a quotation
  A poet's line says it better than you ever could.|a quotation
  You are writing about how a famous speech sounded, so you need its words.|a quotation
  The coach used a memorable phrase that everyone repeated afterward.|a quotation
  You are reporting what a witness said, and every word matters.|a quotation
  The diary writer's own words show her feelings better than yours would.|a quotation
  You want to show the exact rule the teacher gave the class.|a quotation
  You need one fact from a long article, the date the dome was finished, in your own words.|a paraphrase
  You want to explain a single hard sentence from a science book in simpler words.|a paraphrase
  You need one number from the guidebook, and its wording is dull.|a paraphrase
  You want to use one idea from a source but fit it into your own sentence.|a paraphrase
  You are explaining one step of a method that the source describes in difficult words.|a paraphrase
  You want one detail from the interview, but the speaker rambled.|a paraphrase
  You need a fact from a website that was written for adults.|a paraphrase
  You want to restate one sentence of the doctor's report clearly.|a paraphrase
  You want to use the ranger's point about the owl's energy, but not her exact words.|a paraphrase
  You need one fact from a long letter and nothing else from it.|a paraphrase
  You want to give the main point of a whole article in two sentences.|a summary
  You are telling a friend what a long chapter was about, in brief.|a summary
  Your report needs the big idea of a whole interview, not its details.|a summary
  You want to tell the reader what a documentary showed, in one short paragraph.|a summary
  You are writing a note on a long book's main events for a book report.|a summary
  You need to report what a whole speech was mostly about.|a summary
  You want to give the gist of three pages on Inca roads in a few lines.|a summary
  Your teacher asks what the whole museum guide says, briefly.|a summary
  You want to tell what a long diary covers, without its details.|a summary
  You need to sum up the findings of a whole science report.|a summary
`;

const quoteParaphraseSummary = topic("writing", {
  id: "quote-paraphrase-or-summary",
  title: ["Quote, Paraphrase or Summarize", "引用、转述还是概括"],
  summary: [
    "A writer quotes exact words that are striking, paraphrases a single fact and summarizes a whole passage.",
    "作者引用精彩的原话，转述单个事实，概括整段文字。",
  ],
  after: ["paraphrasing-a-sentence", "quotation-marks-for-quotations"],
  points: [
    label(
      "quotation-paraphrase-or-summary",
      ["A Quotation, a Paraphrase or a Summary", "引用、转述还是概括"],
      [
        "A writer can use a source in three ways. A **quotation** gives the source's **exact words** in quotation marks. A **paraphrase** gives **one idea** of the source in the writer's own words, about as long as the original. A **summary** gives the **main point of the whole source** in a few words, leaving out the details.",
        "作者可以用三种方式使用来源。**引用**在引号里给出来源的**原话**。**转述**用作者自己的话表达来源的**一个意思**，长度和原文差不多。**概括**用几句话给出**整个来源的要点**，省略细节。",
      ],
      ["How does the writer use the source here?", "作者在这里是怎样使用来源的？"],
      usesLines,
      usesLabels,
    ),
    label(
      "which-to-use-for-a-purpose",
      ["Which to Use for a Purpose", "按目的选择用法"],
      [
        "Choose the way that fits your **purpose**. **Quote** when the exact words matter: they are vivid, famous, or needed as proof. **Paraphrase** when you need one fact or idea and the source's words are hard or dull. **Summarize** when you need the main point of a whole text without its details.",
        "选择符合你**目的**的用法。原话很重要时就**引用**：它们生动、有名，或需要作为证据。需要一个事实或意思、而原文难懂或平淡时就**转述**。需要整篇文字的要点而不要细节时就**概括**。",
      ],
      ["Which should the writer use?", "作者应该用哪一种？"],
      purposeLines,
      usesLabels,
    ),
  ],
});

// Using a quotation as support: groups of three of point|quotation|explanation|a restatement|an aside
const supportRows = rows(`
  Glaciers change the land.|"Over thousands of years, the ice carved this valley into a deep U shape."|This shows that a glacier is strong enough to reshape whole valleys.|This says that the ice carved the valley into a U shape.|Glaciers are also very beautiful to look at.
  Glaciers are shrinking.|"The glacier's edge has moved back three kilometers since 1870."|This shows that the glacier has grown much smaller over time.|This says the edge moved back three kilometers since 1870.|Many tourists visit glaciers every summer.
  Glaciers store fresh water.|"Most of the world's fresh water is frozen in ice sheets and glaciers."|This shows that glaciers hold more fresh water than anything else.|This says most fresh water is frozen in ice.|Fresh water is important for drinking.
  Pasteur made milk safer.|"He heated milk just enough to kill most of the germs."|This shows that his method removed the germs that made people sick.|This says he heated milk to kill most germs.|Milk is good for growing bones.
  Pasteur's work lasted.|"The word pasteurized is still printed on milk cartons today."|This shows that people still use his method more than a century later.|This says the word is printed on cartons today.|Milk cartons come in many sizes.
  Pasteur was patient.|"He repeated each test hundreds of times before he believed it."|This shows that he checked his results again and again before trusting them.|This says he repeated each test hundreds of times.|Some tests can be done very quickly.
  The Inca were skilled builders.|"Their stone walls fit so tightly that a knife blade cannot slip between the blocks."|This shows that they shaped stone with great care and skill.|This says a knife blade cannot fit between the blocks.|Knives were made of bronze at the time.
  The Inca roads joined the empire.|"Roads linked every corner of the empire, from the coast to the high mountains."|This shows that the roads let people travel across the whole empire.|This says roads went from the coast to the mountains.|Mountains are hard to climb.
  The Inca sent news quickly.|"Relay runners could carry a message 240 kilometers in a single day."|This shows that news crossed long distances faster than one runner could carry it.|This says runners carried messages 240 kilometers a day.|Running is good exercise.
  Bees help farmers.|"About one bite of food in three depends on bees and other pollinators."|This shows that many crops would fail without bees to pollinate them.|This says a third of our food depends on pollinators.|Some people are afraid of bees.
  Bees work together.|"Each bee in the hive has a job, from cleaning cells to guarding the door."|This shows that a hive runs because every bee does its part.|This says each bee has a job in the hive.|Bees can sting when they are scared.
  Bees can share directions.|"A bee dances in a figure eight to show the others where flowers are."|This shows that bees pass on information to each other through movement.|This says the bee dances in a figure eight.|Dancing is fun for people too.
  The bridge was tested carefully.|"Forty loaded trucks crossed the bridge at once, and every bolt was checked."|This shows that engineers made sure the bridge was safe before it opened.|This says forty trucks crossed and bolts were checked.|Trucks carry goods to shops.
  The bridge will help the town.|"Drivers will save twenty minutes on every trip into the city."|This shows that the bridge will make daily travel much faster.|This says drivers will save twenty minutes.|Some drivers like long drives.
  The bridge was hard to build.|"Workers had to sink the pillars forty meters into the soft riverbed."|This shows that building on soft ground was a difficult job.|This says pillars went forty meters into the riverbed.|Rivers are home to many fish.
  Lab safety protects students.|"Goggles keep splashes of vinegar and other liquids out of your eyes."|This shows that wearing goggles prevents eye injuries.|This says goggles keep splashes out of eyes.|Vinegar is used in salad dressing.
  Germs spread easily.|"A single sneeze can send droplets more than two meters across a room."|This shows that germs can reach people who are not even close.|This says a sneeze sends droplets two meters.|Rooms come in many sizes.
  Handwashing works.|"Washing with soap for twenty seconds removes most germs from the skin."|This shows that a short, careful wash is enough to clean hands.|This says washing for twenty seconds removes germs.|Soap comes in many scents.
  The Maya studied the sky.|"Maya astronomers predicted eclipses years before they happened."|This shows that they understood the movements of the sun and moon very well.|This says they predicted eclipses years ahead.|Eclipses are rare events.
  The Maya were great builders.|"The pyramid at Tikal rises more than seventy meters above the forest."|This shows that the Maya could build huge structures without modern machines.|This says the pyramid rises seventy meters.|Forests are full of animals.
  The Maya wrote things down.|"They wrote in books made of bark paper, folded like a fan."|This shows that the Maya kept written records of their knowledge.|This says they wrote in bark paper books.|Fans keep people cool.
  Survival needs a plan.|"The first thing to do when you are lost is to stop, think and look around."|This shows that staying calm and thinking comes before acting.|This says to stop, think and look around.|Being lost is frightening.
  Shelter matters in the cold.|"More people lost in snow suffer from the cold than from hunger."|This shows that staying warm is more urgent than finding food.|This says more people suffer from cold than hunger.|Snow can be fun to play in.
  Water is the first need.|"A person can live three weeks without food, but only three days without water."|This shows that finding water comes before finding food.|This says people live three days without water.|Food tastes better when you are hungry.
  Old letters teach history.|"Every word in the letter cost the sender a penny to post."|This shows that sending letters was costly, so people chose their words carefully.|This says each word cost a penny.|Pennies are made of copper.
  Diaries show daily life.|"We carried water from the well before school every morning."|This shows that children had chores before running water was common.|This says they carried water from the well.|Wells can be very deep.
  Diaries show feelings.|"I read Mother's letter until the paper was soft as cloth."|This shows how much the writer missed her mother.|This says she read the letter until it was soft.|Cloth is softer than paper.
  Domes are strong.|"The curve of a dome pushes its weight down and outward, all the way to the walls."|This shows that a dome's shape spreads its weight so it can stand.|This says the curve pushes weight to the walls.|Walls can be painted many colors.
  Domes have lasted.|"The Pantheon's dome has stood for nearly 1,900 years."|This shows that a well-built dome can last for many centuries.|This says the dome has stood for 1,900 years.|Rome is a busy city today.
  Domes took skill.|"The builders made the concrete lighter near the top by mixing in volcanic stone."|This shows that the builders solved the problem of a dome's heavy top.|This says lighter stone was mixed in near the top.|Volcanoes are found in Italy.
`);
const supportQuoteItems: ChoiceItem[] = supportRows.map((r, i): ChoiceItem => {
  const g = i - (i % 3);
  const others = [g, g + 1, g + 2].filter((k) => k !== i).map((k) => field(supportRows[k] ?? r, 1));
  return [`Point: ${field(r, 0)}`, field(r, 1), [others[0] ?? "", others[1] ?? ""]];
});
const explainItems: ChoiceItem[] = supportRows.map(
  (r): ChoiceItem => [
    `Point: ${field(r, 0)} Quotation: ${field(r, 1)}`,
    field(r, 2),
    [`In other words, ${field(r, 1).replace(/^"|"$/g, "")}`, field(r, 4)],
  ],
);

const quotationAsSupport = topic("writing", {
  id: "using-a-quotation-as-support",
  title: ["Using a Quotation as Support", "用引文作支持"],
  summary: [
    "A quotation supports a point when it is introduced, quoted exactly and followed by a sentence that explains it.",
    "引文要先引出、准确引用，后面再用一句话解释它，才能支持观点。",
  ],
  after: ["quoting-accurately", "facts-definitions-and-examples"],
  points: [
    choose(
      "the-quotation-that-supports-the-point",
      ["The Quotation That Supports the Point", "支持观点的引文"],
      [
        "A quotation earns its place when it gives the reader a **reason to believe** the point. Several quotations may come from the same source and be about the same subject, but only one shows what the point says. For *Glaciers are shrinking*, a quotation about the glacier's edge moving back is evidence; one about the valley's U shape is not.",
        "引文只有在给读者**相信观点的理由**时才有用。几句引文可能出自同一来源、讲同一主题，但只有一句能表明观点所说的事。对于 *Glaciers are shrinking*，讲冰川边缘后退的引文是证据；讲山谷 U 形的引文则不是。",
      ],
      ["Which quotation best supports the point?", "哪句引文最能支持这个观点？"],
      supportQuoteItems,
      (right) => [`${right} gives a reason to believe the point.`, `${right} 为相信这个观点提供了理由。`],
      [
        ["*{wrong}* is about the same subject but supports a different point.", "*{wrong}* 主题相同，但支持的是另一个观点。"],
        ["*{wrong}* does not show what the point says.", "*{wrong}* 并不能表明观点所说的事。"],
      ],
    ),
    choose(
      "the-sentence-that-explains-it",
      ["The Sentence That Explains It", "解释引文的句子"],
      [
        "After a quotation, a writer adds a sentence that **explains** how it supports the point, often beginning *This shows that*. The explanation connects the quotation to the point in new words. It does not just repeat the quotation, and it does not wander off to another idea.",
        "引文之后，作者要加一句话**解释**它如何支持观点，常常以 *This shows that* 开头。解释用新的话把引文和观点联系起来。它不只是重复引文，也不会扯到别的意思上去。",
      ],
      ["Which sentence best explains how the quotation supports the point?", "哪个句子最好地解释了引文如何支持观点？"],
      explainItems,
      (right) => [`**${right}** connects the quotation to the point in new words.`, `**${right}** 用新的话把引文和观点联系起来。`],
      [
        [
          "*{wrong}* only repeats the quotation in the same words and explains nothing.",
          "*{wrong}* 只是用同样的话重复引文，什么也没解释。",
        ],
        ["*{wrong}* wanders off to an idea that has nothing to do with the point.", "*{wrong}* 扯到了与观点无关的意思上。"],
      ],
    ),
  ],
});

// Previewing the topic: report subject|section 1|section 2|section 3|a section the report does not have
const previewRows = rows(`
  Mars|why Mars looks red|what the weather is like on Mars|how rovers explore Mars|how to grow tomatoes
  the Inca|how the Inca built their roads|how they farmed on mountainsides|why their empire fell|how pizza was invented
  glaciers|how glaciers form|how they shape the land|why many are shrinking|how volcanoes erupt
  bees|how bees live in a hive|how they make honey|why farmers need them|how sharks hunt
  the Maya|how the Maya built their cities|how they studied the stars|what they wrote down|how trains were invented
  bridges|how beam bridges work|how arch bridges hold weight|how suspension bridges hang|how cakes are baked
  microbes|what microbes are|how some cause illness|how others help us|how the moon was formed
  ancient Athens|how Athenians voted|what children learned in school|how the city traded by sea|how robots are built
  deserts|how deserts form|how desert animals find water|how people live in deserts|how glaciers carve valleys
  the moon|how the moon formed|why its shape seems to change|what astronauts found there|how bees make honey
  domes|how a dome holds itself up|how the Romans built the Pantheon|which domes stand today|how rivers reach the sea
  volcanoes|how volcanoes form|what happens when they erupt|how scientists warn people|how plants make food
  recycling|what can be recycled|how a recycling plant sorts waste|why recycling saves energy|how the Maya counted
  rain forests|where rain forests grow|what lives in their layers|why they are shrinking|how ice cream is made
  lighthouses|why lighthouses were built|how their lamps work|what keepers did each night|how comets travel
  hurricanes|how hurricanes form|how they are measured|how people prepare for them|how bread rises
  the Olympic Games|how the first Games began|which sports the Greeks played|how the modern Games started|how cells divide
  towers|why towers are built|how they stand up in wind|which towers are tallest|how frogs lay eggs
  yeast|what yeast is|how it makes bread rise|how people have used it in history|how bridges are tested
  the Aztec|how the Aztec built Tenochtitlan|how they farmed floating gardens|what happened when the Spanish came|how penguins swim
  tardigrades|what tardigrades look like|where they live|how they survive extreme conditions|how kites fly
  water on Earth|where Earth's water is found|how the water cycle works|why fresh water is precious|how coins are made
  the human heart|what the heart does|how blood travels round the body|how to keep the heart healthy|how volcanoes form
  the solar system|what the inner planets are like|what the outer planets are like|what lies beyond Neptune|how cheese is made
  lab safety|why goggles matter|how to handle glass|why food is not allowed|how planets orbit
  old letters|how letters were sent long ago|what they cost to post|what they tell historians|how dolphins sleep
  survival in snow|how to stay warm|how to find shelter|how to signal for help|how to bake a pie
  penicillin|how it was discovered|how it fights bacteria|how it changed medicine|how glaciers move
  monarch butterflies|how monarchs change from caterpillars|how they migrate to Mexico|why their numbers are falling|how dams make electricity
  the Nile|where the Nile begins|how it floods each year|how it helped ancient farmers|how stars are born
`);
const preview = (a: string, b: string, c: string) => `This report explains ${a}, ${b} and ${c}.`;
const matchItems: ChoiceItem[] = previewRows.map((r): ChoiceItem => {
  const [s1, s2, s3, x] = [field(r, 1), field(r, 2), field(r, 3), field(r, 4)];
  return [
    `A report on ${field(r, 0)} has three sections: ${s1}; ${s2}; ${s3}.`,
    preview(s1, s2, s3),
    [`This report explains ${s1}, ${s2}, ${s3} and ${x}.`, `This report explains ${s1} and ${s3}.`],
  ];
});
const orderPreviewItems: ChoiceItem[] = previewRows.map((r, i): ChoiceItem => {
  const [s1, s2, s3] = [field(r, 1), field(r, 2), field(r, 3)];
  return [
    `The sections of a report on ${field(r, 0)}, in order: 1. ${s1.charAt(0).toUpperCase() + s1.slice(1)}. 2. ${s2.charAt(0).toUpperCase() + s2.slice(1)}. 3. ${s3.charAt(0).toUpperCase() + s3.slice(1)}.`,
    preview(s1, s2, s3),
    i % 2 === 0 ? [preview(s2, s1, s3), preview(s3, s2, s1)] : [preview(s1, s3, s2), preview(s2, s3, s1)],
  ];
});

const previewingTheTopic = topic("writing", {
  id: "previewing-the-topic",
  title: ["Previewing the Topic", "预告主题"],
  summary: [
    "After its hook, the introduction of a report says what the report will cover, in the order of its sections.",
    "报告的引言在开头吸引读者之后，要按各部分的顺序说明报告将讲哪些内容。",
  ],
  after: ["choosing-a-hook"],
  points: [
    choose(
      "the-preview-that-matches-the-sections",
      ["The Preview That Matches the Sections", "与各部分相符的预告"],
      [
        "After the hook, a report's introduction **previews** what is coming: one sentence that names each section. The preview works like a map for the reader, so it must match the report: it names **every** section and **only** the sections the report has. A preview that promises something the report never covers misleads the reader.",
        "在开头吸引读者之后，报告的引言要**预告**接下来的内容：用一句话说出每个部分。预告就像给读者的指南，所以必须与报告相符：它说出**每一个**部分，而且**只**说报告里有的部分。承诺了报告根本没讲的内容的预告会误导读者。",
      ],
      ["Which preview matches the report's sections?", "哪个预告与报告的各部分相符？"],
      matchItems,
      (right) => [`**${right}** names each section of the report and nothing else.`, `**${right}** 说出了报告的每个部分，没有别的。`],
      [
        ["*{wrong}* promises a section the report never covers.", "*{wrong}* 承诺了报告根本没讲的部分。"],
        ["*{wrong}* leaves out one of the report's sections.", "*{wrong}* 漏掉了报告的一个部分。"],
      ],
    ),
    choose(
      "the-preview-in-the-order-of-the-sections",
      ["The Preview in the Order of the Sections", "按各部分顺序排列的预告"],
      [
        "A preview names the sections **in the order they come**. If the report explains first why Mars looks red, then its weather, then its rovers, the preview names them in that order. Then the reader knows what to expect and when, and each section arrives just where the preview said it would.",
        "预告要**按各部分出现的顺序**说出它们。如果报告先解释火星为什么是红色的，再讲天气，然后讲探测车，预告就按这个顺序说。这样读者就知道会读到什么、什么时候读到，每个部分都正好出现在预告说的位置。",
      ],
      ["Which preview names the sections in the right order?", "哪个预告按正确的顺序说出了各部分？"],
      orderPreviewItems,
      (right) => [`**${right}** names the sections in the order the report gives them.`, `**${right}** 按报告给出的顺序说出了各部分。`],
      [
        ["*{wrong}* names the right sections in the wrong order.", "*{wrong}* 说出的部分对，但顺序错了。"],
        [
          "*{wrong}* mixes up the order, so the reader will expect the wrong section next.",
          "*{wrong}* 打乱了顺序，读者会预期错误的下一部分。",
        ],
      ],
    ),
  ],
});

// Planning a piece of several paragraphs: notes of a body paragraph|its main point|a single detail|the whole topic
const notesRows = rows(`
  Mars has dust storms that cover the planet; winds reach 100 km an hour; storms can last for months.|Mars has huge and powerful storms.|Winds on Mars reach 100 km an hour.|Mars is one of the eight planets that travel around the sun.
  Rovers carry cameras; they drill into rock; they send pictures back to Earth.|Rovers study Mars up close.|Rovers carry cameras.|Mars is the fourth planet from the sun in our solar system.
  Mars's soil is full of iron; the iron rusts; rust is red.|Rusty soil makes Mars look red.|Mars's soil has iron in it.|Mars is a planet that people can see from Earth on clear nights.
  Inca roads crossed mountains; they had rope bridges; runners used them.|The Inca built a great road system.|Some Inca roads had rope bridges.|The Inca were a people who lived long ago in South America.
  The Inca cut terraces into slopes; they grew potatoes high up; they built canals for water.|The Inca farmed the steep mountains cleverly.|The Inca grew potatoes.|The Inca ruled a large empire in the Andes for about a hundred years.
  The Spanish arrived in 1532; they captured the emperor; illness spread among the Inca.|The Inca empire fell quickly when the Spanish came.|The Spanish arrived in 1532.|The Inca were a great people with a long and interesting history.
  Bees collect nectar; they store it in wax cells; they fan it until it thickens.|Bees turn nectar into honey.|Bees store nectar in wax.|Bees are small insects that live in many places all over the world.
  A queen lays eggs; workers clean and feed; guards protect the door.|Every bee in a hive has a job.|The queen lays eggs.|Bees are insects, and there are thousands of different kinds of them.
  Bees carry pollen from flower to flower; apples need bees; so do almonds.|Farmers need bees to pollinate crops.|Almonds need bees.|Bees can be yellow and black, and some of them can sting people.
  Glaciers scrape rock; they carve U-shaped valleys; they leave piles of stones.|Glaciers change the shape of the land.|Glaciers leave piles of stones.|Glaciers are huge sheets of ice found in many cold parts of the world.
  The Aletsch Glacier has shrunk 3 km; Alpine glaciers are thinning; warmer summers melt more ice.|Many glaciers are shrinking.|The Aletsch Glacier has shrunk.|Glaciers are found in cold places such as mountains and the far north.
  Snow falls each winter; it does not melt; layers press into ice.|Glaciers form from snow that builds up.|Snow falls each winter.|Glaciers are interesting things that many scientists like to study.
  Athenian men voted in the assembly; they spoke in turn; they voted by raising hands.|Athenian citizens governed by voting.|Athenians raised their hands to vote.|Athens was a Greek city that grew famous in the ancient world.
  Boys learned music, reading and sport; girls learned at home; slaves had no school.|School in Athens was not for everyone.|Boys learned music.|Athens was a large city with many thousands of people living in it.
  Athens traded olive oil; it bought grain; its ships sailed far.|Athens grew rich through trade by sea.|Athens traded olive oil.|Athens was an ancient city that stood close to the shore of the sea.
  Microbes are tiny; they are everywhere; you need a microscope to see them.|Microbes are tiny living things all around us.|You need a microscope to see microbes.|Science studies many different things, from stars to tiny living things.
  Some bacteria cause colds; some cause stomach illness; germs spread by touch.|Some microbes make us ill.|Germs spread by touch.|Illness is unpleasant, and everyone feels unwell from time to time.
  Yeast makes bread rise; gut bacteria help digest food; some microbes make yogurt.|Many microbes help people.|Yeast makes bread rise.|Microbes are studied by scientists in laboratories all over the world.
  Desert foxes have big ears; camels store fat; lizards hide from heat.|Desert animals are built to survive heat.|Camels store fat.|Deserts are dry places that cover a large part of the land on Earth.
  Cacti store water; they have spines, not leaves; their roots spread wide.|Desert plants save every drop of water.|Cacti have spines.|Plants are living things, and most of them have green leaves and stems.
  Desert people travel at night; they wear loose robes; they dig deep wells.|People have found ways to live in deserts.|Desert people wear loose robes.|Many millions of people live in all kinds of places across the Earth.
  The Pantheon is 1,900 years old; it is still used; its dome is the largest of plain concrete.|The Pantheon's dome is a record that has lasted.|The Pantheon is 1,900 years old.|Rome is an old city in Italy that has a great many famous buildings.
  A dome's curve spreads weight; the walls take the push; a ring at the top holds it.|A dome's shape lets it stand.|A ring sits at the top of some domes.|Domes are round roofs that people have built for thousands of years.
  Builders used lighter stone near the top; they poured concrete in layers; they used wooden frames.|The Romans had clever ways to build domes.|They used wooden frames.|Romans built many things, including roads, bridges, walls and temples.
  Lighthouse lamps burned oil; later they used electric bulbs; lenses made the light carry far.|Lighthouse lamps have changed over time.|Lenses made the light carry far.|Lighthouses are tall towers that stand on rocky coasts by the sea.
  Keepers wound the clockwork; they cleaned the lens; they watched for ships all night.|A lighthouse keeper's night was full of work.|Keepers cleaned the lens.|Lighthouses are tall buildings, and many of them are painted white.
  Ships hit rocks in fog; many sailors drowned; towns built lights to warn them.|Lighthouses were built to save ships.|Many sailors drowned.|Ships have carried people and goods across the oceans for centuries.
  Diaries tell of chores; they describe school; they mention prices of food.|Old diaries show how people lived.|Diaries mention food prices.|People write many things, such as diaries, letters, lists and stories.
  Letters took months by ship; each page cost money; people wrote small to save paper.|Sending letters long ago was slow and costly.|People wrote small to save paper.|Letters are written on paper and sent from one person to another.
  Diaries show fear in wartime; letters show homesickness; both show hope.|Old diaries and letters show people's feelings.|Letters show homesickness.|History is about the past, and it tells us what happened long ago.
`);
const longestNote = (notes: string) => {
  const note = notes
    .split("; ")
    .reduce((a, b) => (b.length > a.length ? b : a))
    .replace(/\.$/, "");
  return `${note.charAt(0).toUpperCase()}${note.slice(1)}.`;
};
const mainPointItems: ChoiceItem[] = notesRows.map(
  (r): ChoiceItem => [`Notes for one body paragraph: ${field(r, 0)}`, field(r, 1), [longestNote(field(r, 0)), field(r, 3)]],
);
const conclusionPlans = rows(`
  Mars|why Mars looks red|its giant storms|how rovers study it|Mars is a red, stormy planet that rovers are still uncovering.|Mars has two small moons named Phobos and Deimos.|Rovers carry cameras and drills on their trips.
  the Inca|their road system|their mountain farms|the fall of their empire|The Inca built and farmed brilliantly before their empire fell.|The Inca also made beautiful woven cloth of llama wool.|The Spanish arrived in Peru in the year 1532.
  bees|how a hive works|how bees make honey|why farmers need bees|Bees work as a team, make honey and keep our crops growing.|Some bees live alone instead of in a hive at all.|Bees fan the nectar until it becomes thick honey.
  glaciers|how they form|how they shape land|why they are shrinking|Glaciers grow from snow and carve the land, but many are now melting away.|Icebergs sometimes break off glaciers into the sea.|The Aletsch Glacier has shrunk by three kilometers.
  ancient Athens|voting|school|trade|Athens was a city of voters, learners and traders.|The Parthenon was painted in bright colors long ago.|Athenian boys learned music, reading and sport.
  microbes|what they are|how some harm us|how others help us|Microbes are tiny, and they can both harm and help us.|Some microbes live in hot springs and deep under the sea.|Germs can spread when people touch each other.
  deserts|desert animals|desert plants|desert people|Animals, plants and people all find clever ways to live in the desert.|The Sahara is the largest hot desert in the world.|Cacti have spines instead of leaves.
  domes|the Pantheon|how domes stand|how the Romans built them|The Pantheon shows how skilled Roman builders made domes that last.|Domes are also found on mosques and on government buildings.|A dome's curve spreads its weight to the walls.
  lighthouses|why they were built|how their lamps worked|what keepers did|Lighthouses, their lamps and their keepers kept sailors safe for centuries.|Some lighthouses are now museums that people can visit.|Keepers wound the clockwork every night.
  old letters and diaries|daily life|the cost of letters|people's feelings|Old letters and diaries let us see the lives and hearts of people long ago.|Some museums keep thousands of old letters in their archives.|Letters took months to cross the ocean by ship.
  volcanoes|how they form|what happens in an eruption|how people are warned|Volcanoes form, erupt and can be watched so that people stay safe.|Mount Fuji is a famous volcano in Japan.|Scientists measure gases to predict eruptions.
  rain forests|where they grow|what lives in them|why they are shrinking|Rain forests are full of life, and they need protecting before more are lost.|Chocolate comes from the seeds of a rain forest tree.|Rain forests grow near the equator.
  the moon|how it formed|why it seems to change shape|what astronauts found|The moon, born long ago, still changes in our sky and still teaches us.|The moon is about 384,000 kilometers away.|Astronauts brought back moon rocks.
  hurricanes|how they form|how they are measured|how people prepare|Hurricanes are powerful storms, but people can measure them and prepare.|Hurricanes in Asia are called typhoons instead.|Hurricanes form over warm ocean water.
  the Maya|their cities|their astronomy|their writing|The Maya were builders, sky-watchers and writers.|The Maya also played a ball game in stone courts.|Maya astronomers predicted eclipses.
  recycling|what can be recycled|how plants sort waste|why it saves energy|Recycling turns waste into new things and saves energy.|Some towns collect food scraps for compost too.|Magnets sort steel cans at recycling plants.
  yeast|what it is|how it makes bread rise|how people have used it|Yeast is a tiny living thing that people have used for thousands of years.|Some bread, such as flatbread, is made without yeast.|Yeast gives off a gas inside the dough.
  the Aztec|Tenochtitlan|floating gardens|the arrival of the Spanish|The Aztec built an island city and clever farms before the Spanish came.|Chocolate was a drink of Aztec nobles.|The Spanish arrived in 1519.
  bridges|beam bridges|arch bridges|suspension bridges|Each kind of bridge carries its load in its own clever way.|The longest bridge in the world is in China.|Suspension bridges hang from cables.
  towers|why they are built|how they stand in wind|which are tallest|Towers are built for many reasons, stand up to wind and reach ever higher.|Some towers have restaurants at the top.|The tallest tower is over 800 meters high.
  tardigrades|what they look like|where they live|how they survive|Tardigrades are tiny, odd-looking and nearly impossible to kill.|Some scientists study tardigrades in space.|Tardigrades live in moss.
  monarch butterflies|their life cycle|their migration|their falling numbers|Monarchs change, travel far and now need our help.|Monarchs taste bitter to birds.|Monarchs fly to Mexico each autumn.
  the Nile|where it begins|how it floods|how it helped farmers|The Nile's floods made farming possible along its long path.|Crocodiles live along the Nile.|The Nile flooded every summer.
  penicillin|its discovery|how it fights germs|how it changed medicine|Penicillin, found by chance, changed medicine for good.|Fleming also studied tears and the germs they kill.|Penicillin was found in 1928.
  lab safety|goggles|glass|food in the lab|Goggles, care with glass and no food keep a lab safe.|Some labs study germs from faraway places.|Broken glass should be swept up by an adult.
  survival in snow|staying warm|finding shelter|signaling for help|Staying warm, sheltering and signaling can save a life in the snow.|Snow can be up to 95 percent air.|A snow cave can be warmer than the air outside.
  the solar system|the inner planets|the outer planets|what lies beyond|Our solar system holds rocky planets, giant planets and much more beyond.|Pluto was found in 1930 by Clyde Tombaugh.|Jupiter is the largest planet.
  water on Earth|where water is found|the water cycle|why fresh water is precious|Earth's water moves in a cycle, but fresh water is rare and precious.|Some lakes are saltier than the sea.|Most fresh water is frozen in ice.
  the heart|what it does|how blood travels|keeping it healthy|The heart pumps blood around the body, and we can help it stay strong.|A blue whale's heart is as big as a small car.|Blood travels through tubes called vessels.
  the Olympic Games|their beginning|the sports of the Greeks|the modern Games|The Games began in Greece and live on in the modern Olympics.|The Olympic flag has five rings of different colors.|The first Games were held at Olympia.
`);
const conclusionItems: ChoiceItem[] = conclusionPlans.map(
  (r): ChoiceItem => [
    `A plan for a report on ${field(r, 0)}: introduction; body paragraph 1, ${field(r, 1)}; body paragraph 2, ${field(r, 2)}; body paragraph 3, ${field(r, 3)}; conclusion.`,
    field(r, 4),
    [field(r, 5), `As the report explained, ${lowerStart(field(r, 6))}`],
  ],
);

const planningSeveralParagraphs = topic("writing", {
  id: "planning-a-multi-paragraph-piece",
  title: ["Planning a Piece of Several Paragraphs", "规划多段文章"],
  summary: [
    "A plan gives the introduction, one body paragraph for each main point and a conclusion.",
    "文章计划包括引言、每个要点各一个主体段落，以及结论。",
  ],
  after: ["outlining-a-report", "ordering-paragraphs"],
  points: [
    choose(
      "the-main-point-of-a-body-paragraph",
      ["The Main Point of a Body Paragraph", "主体段落的要点"],
      [
        "Before writing, group your notes: facts that belong together make **one body paragraph**. Then name the **main point** they share, which becomes the paragraph's topic sentence. The main point is wider than any single fact in the notes but narrower than the subject of the whole report.",
        "写作之前，先把笔记分组：属于一起的事实组成**一个主体段落**。然后说出它们共同的**要点**，作为这一段的主题句。要点比笔记中的任何一个事实都宽，但比整篇报告的主题窄。",
      ],
      ["What is the main point of this body paragraph?", "这个主体段落的要点是什么？"],
      mainPointItems,
      (right) => [
        `**${right}** sums up every note in the group, so it is the paragraph's main point.`,
        `**${right}** 概括了这一组的每条笔记，所以是这一段的要点。`,
      ],
      [
        ["*{wrong}* is only one of the notes, too narrow to cover the others.", "*{wrong}* 只是其中一条笔记，太窄，概括不了其他笔记。"],
        ["*{wrong}* is the subject of the whole report, too broad for one paragraph.", "*{wrong}* 是整篇报告的主题，对一个段落来说太宽。"],
      ],
    ),
    choose(
      "what-the-conclusion-says",
      ["What the Conclusion Says", "结论说什么"],
      [
        "The last paragraph of the plan is the **conclusion**. It pulls the main points of the body paragraphs together into one closing thought, so the reader leaves knowing what the whole piece showed. It does not bring in a new fact, and it does not repeat a detail from just one paragraph.",
        "计划的最后一段是**结论**。它把各主体段落的要点合成一个收尾的想法，让读者读完时知道整篇文章说明了什么。结论不引入新的事实，也不只重复某一段里的细节。",
      ],
      ["Which sentence should the conclusion give?", "结论应该写哪一句？"],
      conclusionItems,
      (right) => [`**${right}** pulls all three main points together.`, `**${right}** 把三个要点合在了一起。`],
      [
        ["*{wrong}* brings in a new fact that no paragraph discussed.", "*{wrong}* 引入了没有哪段讨论过的新事实。"],
        [
          "*{wrong}* repeats a detail from one paragraph instead of pulling them together.",
          "*{wrong}* 只重复了一段里的细节，没有把各段合起来。",
        ],
      ],
    ),
  ],
});

// Ordering reasons: opinion|a weak reason|a middle reason|the strongest reason|a reason off the point
const reasonRows = rows(`
  Our school should plant a garden.|The garden would look nice.|Students could eat the vegetables at lunch.|Students would learn how plants grow by caring for them.|Our school bus is often late.
  Every citizen should vote.|Voting days are a chance to see neighbors.|Leaders listen more to groups that vote.|Voting is how citizens choose the laws they live under.|Some countries have a king.
  Our town should build a bike path.|Bikes come in many bright colors.|Riders would save money on gas.|A path would keep riders safe from cars.|My uncle owns a red car.
  Students should learn to swim at school.|Swimming is fun on a hot day.|Swimming is good exercise for the heart.|Knowing how to swim can save a life.|The pool snack bar sells juice.
  Families should save water.|Saving water makes you feel helpful.|It lowers the water bill.|Fresh water is scarce, and wasting it leaves less for everyone.|Water is wet.
  Our class should visit the museum.|The museum has a nice gift shop.|The bus ride would be short.|We would see real Maya objects we are studying.|My cousin likes art.
  Cities should keep old buildings.|Old buildings are often painted.|Tourists like to visit them.|They show people how the city's history happened.|New cars are fast.
  Schools should have longer recess.|Recess is everyone's favorite time.|Playing outside helps students make friends.|Studies show students focus better after exercise.|My dog likes to play fetch.
  Our town needs a library.|A library would be a quiet place.|It could hold events for families.|Not every family can afford to buy books.|Libraries were invented long ago.
  People should wash their hands often.|Soap smells good.|Clean hands keep food tasting fresh.|Handwashing stops germs from spreading illness.|Hands have five fingers.
  Our school should recycle paper.|The recycling bins are a nice blue.|Recycling would teach students good habits.|It would save hundreds of trees each year.|Paper is thin.
  Children should learn a second language.|It is fun to say new words.|It helps when traveling.|It lets them talk with millions more people.|Some languages use different letters.
  Our town should plant more trees.|Trees are pretty in autumn.|Birds would have more nests.|Trees cool the streets and clean the air.|My bike is green.
  Every home should have a smoke alarm.|Alarms are cheap.|They are easy to put up.|They warn people of a fire in time to escape.|Smoke is gray.
  Students should read every day.|Books have nice covers.|Reading is a good way to relax.|Daily reading makes students stronger at every subject.|Some books are heavy.
  Bridges should be checked every year.|Inspectors enjoy the view.|Checks help repairs cost less.|A weak bridge could collapse and hurt people.|Rivers flow downhill.
  The class should keep a pet fish.|Fish are colorful.|Feeding it would teach responsibility.|Watching it would help us learn about living things.|Cats like fish.
  Schools should teach cooking.|Cooking classes smell nice.|Students could cook for their families.|Knowing how to cook helps people eat healthy food.|Ovens are hot.
  Our town should have a farmers' market.|Markets have music.|Shoppers would meet their neighbors.|Local farmers would earn money, and food would be fresher.|Apples can be red.
  Lab safety rules should be strict.|Goggles look cool.|Rules keep the lab tidy.|They prevent injuries from glass and chemicals.|Labs have windows.
  Our school should start a newspaper.|Newspapers can have comics.|Students would learn to interview people.|Writing for real readers makes students better writers.|Paper is made from trees.
  People should learn first aid.|First aid kits are small.|It helps on camping trips.|It can save someone's life before help arrives.|Bandages come in boxes.
  The park should have more lights.|Lights look pretty at night.|People could play later in the evening.|Lights would make the paths safer after dark.|The moon is bright.
  Our school should have a quiet room.|The room could be painted blue.|Students could read there at lunch.|Some students need a calm place to focus and rest.|Chairs have legs.
  Our class should write to a pen pal class.|Stamps are fun to collect.|We would learn about another country.|Writing real letters improves our writing.|Mail trucks are white.
  Museums should be free for children.|Children like free things.|More families would visit.|Every child would get the chance to learn from them.|Museums are big.
  Students should learn about local history.|History has interesting stories.|It helps them know their town.|It helps them understand why their town is the way it is.|Towns have mayors.
  The town should fix the old dam.|The dam is old.|Fixing it would make the lake nicer.|A broken dam could flood the homes below it.|Lakes have fish.
  Students should help plan school rules.|Planning is interesting.|Students would understand the rules better.|People follow rules they helped make.|Rules are written down.
  Our school should grow a butterfly garden.|Butterflies are pretty.|It would be a good place for drawing.|Monarch butterflies need flowers to survive their migration.|Gardens need water.
`);
const strongestItems: ChoiceItem[] = reasonRows.map(
  (r, i): ChoiceItem => [
    `Opinion: ${field(r, 0)}`,
    field(r, 3),
    [i % 2 === 0 ? `${field(r, 2).replace(/\.$/, "")}, and ${lowerStart(field(r, 1))}` : field(r, 2), field(r, 1)],
  ],
);
const orderReasonItems: ChoiceItem[] = reasonRows.map((r, i): ChoiceItem => {
  const [w, m, s] = [field(r, 1), field(r, 2), field(r, 3)];
  const shown =
    i % 2 === 0 ? `Opinion: ${field(r, 0)} Reasons: A. ${s} B. ${w} C. ${m}` : `Opinion: ${field(r, 0)} Reasons: A. ${m} B. ${s} C. ${w}`;
  return i % 2 === 0
    ? [
        shown,
        "B, C, A, saving the strongest for last",
        ["A, B, C, starting with the strongest", "C, A, B, putting the strongest in the middle"],
      ]
    : [
        shown,
        "C, A, B, saving the strongest for last",
        ["B, A, C, starting with the strongest", "A, B, C, putting the strongest in the middle"],
      ];
});

const orderingReasons = topic("writing", {
  id: "ordering-reasons-logically",
  title: ["Ordering Reasons Logically", "合理安排理由的顺序"],
  summary: [
    "Reasons go in an order the reader can follow, often saving the strongest for last, and each is linked to the opinion.",
    "理由要按读者容易理解的顺序排列，常常把最有力的放在最后，而且每个理由都与观点相联系。",
  ],
  after: ["supporting-reasons-with-facts"],
  points: [
    choose(
      "the-strongest-reason",
      ["The Strongest Reason", "最有力的理由"],
      [
        "Not all reasons are equally strong. The **strongest reason** matters most to the reader: it is about safety, health, fairness or something many people need, and facts can back it up. A reason about looks or liking is weak, and a reason that does not connect to the opinion is no reason at all.",
        "理由并不都一样有力。**最有力的理由**对读者最重要：它关乎安全、健康、公平或许多人的需要，而且有事实支持。关于外观或喜好的理由很弱，而与观点无关的理由根本算不上理由。",
      ],
      ["Which is the strongest reason for the opinion?", "哪个是支持这个观点最有力的理由？"],
      strongestItems,
      (right) => [
        `**${right}** matters most to the reader and can be backed with facts.`,
        `**${right}** 对读者最重要，而且可以用事实支持。`,
      ],
      [
        [
          "*{wrong}* gives a fair reason or two, but they matter less to the reader than the strongest one.",
          "*{wrong}* 给出的理由说得过去，但对读者来说不如最有力的理由重要。",
        ],
        ["*{wrong}* is a weak reason about looks or liking.", "*{wrong}* 是关于外观或喜好的弱理由。"],
      ],
    ),
    choose(
      "putting-reasons-in-order",
      ["Putting Reasons in Order", "给理由排序"],
      [
        "Writers often build from the weakest reason to the **strongest**, saving the best for last so it stays with the reader. Starting with the strongest can work in a short piece, but then the piece trails off; burying it in the middle hides it. In this skill, order the reasons from weakest to strongest.",
        "作者常常从最弱的理由写到**最有力**的理由，把最好的留到最后，让它留在读者心中。在短文里先写最有力的理由也可以，但文章随后就会越来越弱；把它埋在中间会让它被忽略。在这项技能中，要把理由从最弱排到最有力。",
      ],
      ["In what order should the reasons come?", "这些理由应该按什么顺序排列？"],
      orderReasonItems,
      (right) => [
        `**${right}**: the reasons grow stronger, and the best one ends the piece.`,
        `**${right}**：理由越来越有力，最好的一条放在结尾。`,
      ],
      [
        [
          "*{wrong}* puts the strongest reason first, so the piece ends on its weakest.",
          "*{wrong}* 把最有力的理由放在最前，文章以最弱的理由结束。",
        ],
        ["*{wrong}* hides the strongest reason in the middle.", "*{wrong}* 把最有力的理由藏在了中间。"],
      ],
    ),
  ],
});

// One paragraph for each reason: opinion|reason|fact|fact|other reason|a fact for the other reason|an unrelated fact
const paragraphRows = rows(`
  Every citizen should vote.|voting lets citizens choose their leaders|Leaders are chosen by the most votes.|A few votes have decided many elections.|voting teaches young people how government works|Students who watch their parents vote often vote later themselves.|Ballots are counted by hand in some towns.
  Our town should build a bike path.|a bike path would keep riders safe|Most bike accidents happen on busy roads.|Paths separate bikes from cars.|a bike path would cut pollution|Each bike trip instead of a car trip keeps smoke out of the air.|The town hall was built in 1910.
  Our school should plant a garden.|a garden would teach science|Students would see seeds sprout and grow.|They could measure plants each week.|a garden would give us healthy food|The vegetables could be served at lunch.|The school's flag is blue and gold.
  Families should save water.|saving water protects a scarce resource|Only three percent of Earth's water is fresh.|Many towns face droughts.|saving water saves money|A leaking tap can add dollars to the bill each month.|Water boils at 100 degrees.
  Cities should keep old buildings.|old buildings teach history|They show how people lived and worked.|Their styles mark when they were built.|old buildings bring visitors|Tourists spend money in historic towns.|Concrete is made from sand and stone.
  Children should learn to swim.|swimming keeps children safe|Drowning is a leading danger for young children.|Swimmers can reach safety if they fall in.|swimming builds strong bodies|Swimming works every muscle.|Pools are often painted blue.
  Our town needs a library.|a library gives everyone books|Not every family can buy books.|Library cards are free.|a library brings people together|It can hold story times and clubs.|Paper was first made in China.
  Schools should have longer recess.|recess helps students learn|Students focus better after playing.|Exercise sends more blood to the brain.|recess helps students make friends|Games teach students to share and take turns.|The school bell rings at 8:00.
  People should learn first aid.|first aid can save lives|Help may take minutes to arrive.|Quick action can stop bleeding.|first aid builds confidence|People who know first aid stay calmer in emergencies.|Bandages were once made of linen.
  Our school should recycle paper.|recycling saves trees|One ton of recycled paper saves seventeen trees.|Trees take years to grow.|recycling saves space in landfills|Paper makes up a large share of trash.|Pencils are made of wood and graphite.
  Our town should plant more trees.|trees keep streets cool|Shaded streets can be ten degrees cooler.|Cool streets save energy for air conditioning.|trees clean the air|Leaves trap dust and smoke.|The town's mayor has two dogs.
  Museums should be free for children.|free museums help every child learn|Some families cannot pay the fee.|Children learn from real objects.|free museums bring in families|Children rarely visit without their parents.|Museums have guards.
  Schools should teach cooking.|cooking helps students eat well|Students who cook eat more vegetables.|They can read food labels.|cooking teaches math|Recipes use fractions and measuring.|Ovens were once heated with wood.
  Bridges should be checked every year.|checks keep people safe|Cracks can grow in a single winter.|Inspectors find problems early.|checks save money|Small repairs cost less than big ones.|The first iron bridge was built in 1779.
  Every home should have a smoke alarm.|alarms warn people in time|Most fire deaths happen at night.|An alarm wakes sleeping people.|alarms are easy to own|They cost little and run for years.|Smoke rises because it is hot.
  Students should read every day.|reading builds vocabulary|Readers meet thousands of new words.|Words met in books stick in memory.|reading builds imagination|Stories let readers picture new worlds.|Libraries have tall shelves.
  Students should learn a second language.|a second language opens doors|Many jobs need people who speak two languages.|Travelers can talk with more people.|a second language trains the brain|Switching languages helps memory.|The alphabet has twenty-six letters.
  The park should have more lights.|lights make the park safer|Dark paths lead to falls.|People feel safer where they can see.|lights let people use the park longer|Families could play after work.|The park has a duck pond.
  Our town should have a farmers' market.|a market helps local farmers|Farmers keep more of the money.|They sell directly to buyers.|a market brings fresh food|Food is picked the day before.|Markets were held in ancient Greece.
  Lab safety rules should be strict.|rules prevent injuries|Goggles stop splashes reaching eyes.|Gloves protect hands from chemicals.|rules protect experiments|Clean benches keep results accurate.|Microscopes were invented in the 1600s.
  Our school should start a newspaper.|a newspaper builds writing skills|Students write for real readers.|Editors check every word.|a newspaper builds community|Families learn what happens at school.|Newspapers were once sold for a penny.
  The town should fix the old dam.|a broken dam could flood homes|The dam holds back a deep lake.|Homes sit just below it.|a safe dam provides power|The dam can make electricity again.|The lake has trout.
  Our school should have a quiet room.|a quiet room helps students focus|Noise makes it hard to think.|Some students need a calm place.|a quiet room helps students rest|A short rest can ease a headache.|The gym is the biggest room.
  Our class should write to pen pals.|pen pals improve writing|Letters need careful sentences.|Real readers make writers try harder.|pen pals teach about the world|Students learn about life in other countries.|Stamps show famous people.
  Students should help plan school rules.|students follow rules they helped make|People respect rules they understand.|Planning shows why rules matter.|planning teaches citizenship|Students practice voting and debate.|The school was painted last summer.
  Our school should grow a butterfly garden.|a garden helps monarchs survive|Monarchs need milkweed to lay eggs.|Milkweed is disappearing.|a garden teaches science|Students can watch caterpillars change.|Butterflies taste with their feet.
  Students should learn local history.|local history explains the town|Students learn why streets have their names.|They learn who built the first buildings.|local history connects generations|Grandparents can share their memories.|The town has three schools.
  People should wash their hands often.|handwashing stops illness|Germs spread from hands to mouths.|Soap removes most germs.|handwashing protects others|Clean hands do not pass germs to friends.|Soap was made from ash long ago.
  Families should eat dinner together.|family dinners help children talk|Children share their day.|Parents learn what worries them.|family dinners are healthier|Home meals have more vegetables.|Forks were not used in Europe until later.
  Our town should open a swimming pool.|a pool would teach children to swim|Many children cannot swim.|Lessons need a safe place.|a pool would keep people cool|Summers are getting hotter.|Pools need chlorine.
`);
const topicSentenceItems: ChoiceItem[] = paragraphRows.map((r): ChoiceItem => {
  const reason = field(r, 1);
  return [
    `Opinion: ${field(r, 0)} Facts for one paragraph: ${field(r, 2)} ${field(r, 3)}`,
    `One reason is that ${reason}.`,
    [field(r, 0).replace(/\.$/, ", and that is my opinion."), field(r, 2)],
  ];
});
const moveFactItems: ChoiceItem[] = paragraphRows.map((r, i): ChoiceItem => {
  const [first, second] = [field(r, 1), field(r, 4)];
  const fact = i % 2 === 0 ? field(r, 5) : field(r, 2);
  const [right, other] = i % 2 === 0 ? [second, first] : [first, second];
  return [
    `Opinion: ${field(r, 0)} Paragraph 1: One reason is that ${first}. Paragraph 2: Another reason is that ${second}. Fact: ${fact}`,
    `the paragraph about how ${right}`,
    [`the paragraph about how ${other}`, "neither paragraph, because it fits no reason"],
  ];
});

const onePerReason = topic("writing", {
  id: "one-paragraph-per-reason",
  title: ["One Paragraph for Each Reason", "每个理由一个段落"],
  summary: [
    "In an opinion piece each body paragraph opens with one reason and gives the facts that support it.",
    "在观点文章中，每个主体段落以一个理由开头，并给出支持它的事实。",
  ],
  after: ["ordering-reasons-logically", "planning-a-multi-paragraph-piece"],
  points: [
    choose(
      "the-topic-sentence-of-a-reason-paragraph",
      ["The Topic Sentence of a Reason Paragraph", "理由段落的主题句"],
      [
        "In an opinion piece of several paragraphs, each body paragraph is about **one reason**. Its first sentence, the **topic sentence**, states that reason (*One reason is that…*, *Another reason is that…*). The facts that follow support it. The topic sentence is not the opinion itself and not one of the facts.",
        "在多段的观点文章中，每个主体段落讲**一个理由**。它的第一句，也就是**主题句**，说出这个理由（*One reason is that…*、*Another reason is that…*）。后面的事实支持它。主题句不是观点本身，也不是其中一个事实。",
      ],
      ["Which sentence should open this paragraph?", "哪个句子应该作为这个段落的开头？"],
      topicSentenceItems,
      (right) => [
        `**${right}** states the reason that the facts of the paragraph support.`,
        `**${right}** 说出了这一段的事实所支持的理由。`,
      ],
      [
        ["*{wrong}* repeats the opinion instead of giving a reason for it.", "*{wrong}* 重复了观点，而没有给出理由。"],
        ["*{wrong}* is one of the facts, which belong after the topic sentence.", "*{wrong}* 是其中一个事实，事实应放在主题句之后。"],
      ],
    ),
    choose(
      "moving-a-fact-to-its-paragraph",
      ["Moving a Fact to Its Paragraph", "把事实移到它所属的段落"],
      [
        "Each fact belongs in the paragraph of the **reason it supports**. When you revise, check every fact: does it show this paragraph's reason? A fact about cost belongs with the reason about saving money, not with the reason about safety. Move it to the paragraph where it does its work.",
        "每个事实都属于它**所支持的理由**的那一段。修改时，要检查每个事实：它能说明这一段的理由吗？关于花费的事实属于讲省钱的理由那一段，而不属于讲安全的那一段。把它移到能发挥作用的段落去。",
      ],
      ["Where does the fact belong?", "这个事实应该放在哪里？"],
      moveFactItems,
      (right) => [`The fact shows that reason, so it goes in **${right}**.`, `这个事实能说明那个理由，所以应该放在 **${right}**。`],
      [
        ["*{wrong}* has a different reason, which this fact does not show.", "*{wrong}* 讲的是另一个理由，这个事实不能说明它。"],
        ["*{wrong}* is not right: the fact does support one of the reasons.", "*{wrong}* 不对：这个事实确实支持其中一个理由。"],
      ],
    ),
  ],
});

// Linking words.
const linkLabels: Record<string, Label> = {
  "a result": {
    zh: "结果",
    why: ["The second idea follows from the first.", "第二个意思是第一个意思的结果。"],
    not: ["The linking word does not show that one idea follows from the other.", "这个连接词并不表示一个意思是另一个的结果。"],
  },
  "a contrast": {
    zh: "对比",
    why: ["The second idea differs from or goes against the first.", "第二个意思与第一个不同或相反。"],
    not: ["The linking word does not set the ideas against each other.", "这个连接词并没有把两个意思对立起来。"],
  },
  "a likeness": {
    zh: "相似",
    why: ["The second idea is like the first.", "第二个意思与第一个相似。"],
    not: ["The linking word does not show that the ideas are alike.", "这个连接词并不表示两个意思相似。"],
  },
  "an example or detail": {
    zh: "例子或细节",
    why: ["The second idea gives a specific example or detail of the first.", "第二个意思给出第一个意思的具体例子或细节。"],
    not: ["The linking word does not introduce an example or detail.", "这个连接词并没有引出例子或细节。"],
  },
};
const linkLines = `
  The river flooded. *Consequently*, the road was closed.|a result
  The ice was thin. *As a result*, no one skated.|a result
  The dam was old. *Therefore*, the town repaired it.|a result
  Bees were disappearing. *Consequently*, the farmers' crops were small.|a result
  The bridge passed its test. *As a result*, it opened on Monday.|a result
  It had not rained for months. *Therefore*, the wells ran dry.|a result
  The lab was messy. *Consequently*, the results were wrong.|a result
  Mars has thin air. *As a result*, its nights are very cold.|a result
  Athens let citizens vote. *In contrast*, Sparta had kings.|a contrast
  Comets are icy. *On the other hand*, asteroids are rocky.|a contrast
  The old bridge was narrow. *However*, the new one has four lanes.|a contrast
  Some microbes cause illness. *On the other hand*, many help us.|a contrast
  The desert is dry by day. *In contrast*, its nights are cold.|a contrast
  The soldier praised the city. *However*, the Aztec writer feared the visitors.|a contrast
  Venus is hot. *In contrast*, Mars is freezing.|a contrast
  Leo shouted. *However*, Maya stayed calm.|a contrast
  The Greeks built temples with columns. *Similarly*, the Romans used columns.|a likeness
  Bees work as a team. *Likewise*, ants share the jobs of the nest.|a likeness
  The Inca built roads across mountains. *Similarly*, the Romans built roads across their empire.|a likeness
  Glaciers carve valleys. *In the same way*, rivers wear down rock.|a likeness
  Pasteur repeated every test. *Similarly*, Fleming studied his dish for weeks.|a likeness
  Earth has seasons. *Likewise*, Mars has seasons.|a likeness
  The diary shows fear. *In the same way*, the letters show worry.|a likeness
  Detectives look for clues. *Similarly*, scientists look for evidence.|a likeness
  Some materials are brittle. *Specifically*, glass shatters when dropped.|an example or detail
  The Maya studied the sky. *For example*, they predicted eclipses.|an example or detail
  The bridge was tested hard. *Specifically*, forty loaded trucks crossed it at once.|an example or detail
  Desert animals save water. *For instance*, camels can go days without drinking.|an example or detail
  Many microbes help us. *For example*, yeast makes bread rise.|an example or detail
  Old letters were costly. *Specifically*, each page cost a penny to post.|an example or detail
  The storm did damage. *For instance*, it tore the roof off the barn.|an example or detail
  Domes are strong. *Specifically*, the Pantheon's dome has stood for 1,900 years.|an example or detail
`;
const joinLines = `
  End of paragraph 1: ...so the town's old bridge was too narrow for trucks. Start of paragraph 2: ___, the new bridge has four wide lanes.|In contrast|Similarly|For example
  End of paragraph 1: ...the dam had cracked in many places. Start of paragraph 2: ___, the town voted to repair it.|Consequently|In contrast|Likewise
  End of paragraph 1: ...Athenian boys learned music and poetry. Start of paragraph 2: ___, Spartan boys trained only to be soldiers.|On the other hand|Consequently|Specifically
  End of paragraph 1: ...the Greeks held games to honor their gods. Start of paragraph 2: ___, the Maya played a ball game as a religious ceremony.|Similarly|Consequently|However
  End of paragraph 1: ...many microbes are helpful to people. Start of paragraph 2: ___, yeast makes bread rise and bacteria help us digest food.|Specifically|In contrast|Consequently
  End of paragraph 1: ...the glacier has shrunk by three kilometers. Start of paragraph 2: ___, the valley below now floods each spring.|As a result|Similarly|For example
  End of paragraph 1: ...the explorer called it a lost city. Start of paragraph 2: ___, the farmers who lived there called it home.|However|Consequently|For instance
  End of paragraph 1: ...bees pollinate apples and almonds. Start of paragraph 2: ___, butterflies carry pollen from flower to flower.|Likewise|Consequently|However
  End of paragraph 1: ...desert animals must save water. Start of paragraph 2: ___, a desert fox gets most of its water from its food.|For example|In contrast|Consequently
  End of paragraph 1: ...the Inca had no written alphabet. Start of paragraph 2: ___, they recorded numbers with knotted strings.|However|Similarly|As a result
  End of paragraph 1: ...the bakery's oven was left on overnight. Start of paragraph 2: ___, a fire broke out before dawn.|As a result|Likewise|Specifically
  End of paragraph 1: ...Mars has huge dust storms. Start of paragraph 2: ___, Jupiter has a storm larger than Earth.|Similarly|Consequently|For instance
  End of paragraph 1: ...the first lighthouse lamps burned oil. Start of paragraph 2: ___, modern lighthouses use electric bulbs.|In contrast|Likewise|As a result
  End of paragraph 1: ...the students washed their hands carefully. Start of paragraph 2: ___, fewer of them caught colds that winter.|Consequently|In contrast|For example
  End of paragraph 1: ...old letters tell us about daily life. Start of paragraph 2: ___, one letter from 1850 describes walking twelve miles to buy salt.|For instance|However|Consequently
  End of paragraph 1: ...the Romans built domes of concrete. Start of paragraph 2: ___, later builders in Florence built a dome of brick.|Similarly|Consequently|Specifically
  End of paragraph 1: ...the comet's tail points away from the sun. Start of paragraph 2: ___, it can lead the comet as it moves outward.|As a result|Similarly|For instance
  End of paragraph 1: ...the soldier described a warm welcome. Start of paragraph 2: ___, the Aztec writer described fear.|In contrast|Likewise|Consequently
  End of paragraph 1: ...many people saved metal during the war. Start of paragraph 2: ___, children collected old pots and pans.|Specifically|However|As a result
  End of paragraph 1: ...the river carried sand to the sea. Start of paragraph 2: ___, a wide delta formed at its mouth.|Consequently|Similarly|For example
  End of paragraph 1: ...Maya and Leo were stranded far from camp. Start of paragraph 2: ___, Maya stayed calm while Leo panicked.|However|Similarly|Consequently
  End of paragraph 1: ...the heat wave lasted a week. Start of paragraph 2: ___, the town's reservoir fell to half its level.|As a result|In contrast|Likewise
  End of paragraph 1: ...glaciers carve valleys over thousands of years. Start of paragraph 2: ___, rivers slowly wear canyons into rock.|Likewise|Consequently|For instance
  End of paragraph 1: ...the robot had many problems. Start of paragraph 2: ___, a loose wire stopped its arm from moving.|Specifically|In contrast|Similarly
  End of paragraph 1: ...the new library is open late. Start of paragraph 2: ___, more students now study there after school.|Consequently|Likewise|However
  End of paragraph 1: ...the shop owner lost customers. Start of paragraph 2: ___, the mayor said the bridge was a success.|On the other hand|As a result|For example
  End of paragraph 1: ...Pasteur proved that germs spoil milk. Start of paragraph 2: ___, Lister used the idea to keep wounds clean.|Similarly|In contrast|Specifically
  End of paragraph 1: ...deserts get very little rain. Start of paragraph 2: ___, some get less than a millimeter a year.|In fact|In contrast|Likewise
  End of paragraph 1: ...the wetlands were drained for farms. Start of paragraph 2: ___, floods in the town grew worse.|As a result|Similarly|For instance
  End of paragraph 1: ...the first rocket failed. Start of paragraph 2: ___, the second one reached orbit.|However|Likewise|Consequently
`;

const linkingWords = topic("writing", {
  id: "linking-words-for-reasons-and-contrast",
  title: ["Linking Words for Reasons and Contrast", "表示原因和对比的连接词"],
  summary: [
    "Linking words join ideas within and across paragraphs: consequently, specifically, in contrast, on the other hand, similarly, however.",
    "连接词在段落内和段落间连接意思：consequently、specifically、in contrast、on the other hand、similarly、however。",
  ],
  after: ["linking-words-for-information"],
  points: [
    label(
      "what-a-linking-word-shows",
      ["What a Linking Word Shows", "连接词表示什么"],
      [
        "A **linking word** tells the reader how two ideas connect. *Consequently*, *as a result* and *therefore* show **a result**. *However*, *in contrast* and *on the other hand* show **a contrast**. *Similarly*, *likewise* and *in the same way* show **a likeness**. *Specifically*, *for example* and *for instance* bring in **an example or detail**.",
        "**连接词**告诉读者两个意思怎样联系。*Consequently*、*as a result* 和 *therefore* 表示**结果**。*However*、*in contrast* 和 *on the other hand* 表示**对比**。*Similarly*、*likewise* 和 *in the same way* 表示**相似**。*Specifically*、*for example* 和 *for instance* 引出**例子或细节**。",
      ],
      ["What does the linking word show?", "这个连接词表示什么？"],
      linkLines,
      linkLabels,
    ),
    choose(
      "the-word-that-joins-two-paragraphs",
      ["The Word That Joins Two Paragraphs", "连接两个段落的词"],
      [
        "A linking word at the start of a paragraph tells the reader how it connects to the one before. Read the end of the first paragraph and the start of the second, decide how the ideas connect (a result, a contrast, a likeness or an example), and choose the word that shows it.",
        "段落开头的连接词告诉读者这一段与上一段怎样联系。读第一段的结尾和第二段的开头，判断两个意思是什么关系（结果、对比、相似还是例子），再选出表示这种关系的词。",
      ],
      ["Which linking word best fills the blank?", "哪个连接词最适合填空？"],
      joinLines,
      (right) => [`**${right}** shows how the second paragraph connects to the first.`, `**${right}** 表明了第二段与第一段的关系。`],
      [
        ["*{wrong}* shows a different connection from the one between these ideas.", "*{wrong}* 表示的关系与这两个意思之间的关系不同。"],
        ["*{wrong}* does not fit how the two paragraphs connect.", "*{wrong}* 与两个段落之间的联系不符。"],
      ],
    ),
  ],
});

// Formal style: subject|formal|informal|with an exclamation or the writer's own feelings
const formalLines = `
  A report on bridges.|The bridge can carry two thousand trucks at once.|The bridge can carry like a ton of trucks, no joke.|I think the bridge is totally awesome!
  A report on glaciers.|Many glaciers have shrunk over the past century.|Tons of glaciers are kinda shrinking these days.|Glaciers are shrinking and it makes me so sad!
  A news article on a fire.|Firefighters stopped the fire before it reached other shops.|The firefighters were super fast and saved the day, big time.|Wow, what an amazing rescue it was!
  A report on bees.|Bees pollinate about one third of the crops people eat.|Bees do loads of work for, like, all our food.|I love bees so much, they are the best!
  A report on Mars.|Mars has the largest volcano in the solar system.|Mars has this crazy huge volcano that's way big.|You will not believe how big it is!
  A report on the Inca.|The Inca built roads that crossed the Andes Mountains.|The Inca made some pretty cool roads over the mountains.|I would love to walk those roads someday!
  A news article on a flood.|The river rose two meters overnight.|The river went up a whole bunch overnight, yikes.|It was the scariest flood ever!
  A report on microbes.|Some bacteria help the body digest food.|Some bugs in your gut are good guys, actually.|Isn't it gross that bacteria live in us?
  A report on the Maya.|Maya astronomers predicted eclipses with great accuracy.|The Maya were really good at, like, guessing eclipses.|The Maya were so smart, it's amazing!
  A report on domes.|The Pantheon's dome has stood for nearly 1,900 years.|The Pantheon's dome has been hanging around forever.|I can't believe it is still standing!
  A news article on a science fair.|Forty students entered projects in this year's fair.|A bunch of kids showed off their stuff at the fair.|The fair was so much fun this year!
  A report on deserts.|Some deserts receive less than one millimeter of rain a year.|Some deserts get basically zero rain, for real.|I would hate to live in a desert!
  A report on yeast.|Yeast gives off a gas that makes dough rise.|Yeast kinda burps out gas and the dough puffs up.|Yeast is my favorite thing to learn about!
  A news article on a bridge opening.|The mayor opened the new bridge on Saturday.|The mayor cut the ribbon on the new bridge thing Saturday.|What a great day for our town it was!
  A report on lighthouses.|Lighthouse keepers cleaned the lenses every night.|The keepers had to scrub the lenses all the time, ugh.|Being a keeper must have been so cool!
  A report on ancient Athens.|Citizens of Athens voted in an assembly.|Folks in Athens got together and voted on stuff.|I think Athens was the best city ever!
  A report on storms.|Hurricanes form over warm ocean water.|Hurricanes start up when the ocean gets all warm and stuff.|Hurricanes are so terrifying!
  A report on tardigrades.|Tardigrades can survive being frozen for years.|Water bears can chill in the freezer for ages, no problem.|Tardigrades are the cutest animals ever!
  A news article on a rescue.|Rangers found the two hikers on Sunday morning.|The rangers tracked down the lost hikers super early Sunday.|Thank goodness they were found!
  A report on recycling.|Recycling one ton of paper saves about seventeen trees.|Recycling a bunch of paper saves a whole lot of trees.|Everyone should recycle, it's so important!
  A report on volcanoes.|Scientists measure gases to predict eruptions.|Scientists sniff out gas to guess when stuff's gonna blow.|Volcanoes are so exciting to me!
  A report on the moon.|The moon has no air and no weather.|The moon's got zero air and no weather or anything.|I wish I could go to the moon!
  A news article on a museum.|The museum will open its new Maya hall in May.|The museum's gonna open its new Maya room in May.|You should definitely go see it!
  A report on penicillin.|Penicillin was discovered by Alexander Fleming in 1928.|This guy Fleming found penicillin back in 1928.|Penicillin is the best medicine ever!
  A report on the heart.|The heart beats about one hundred thousand times a day.|Your heart thumps like a gazillion times a day.|Hearts are amazing!
  A report on rain forests.|Rain forests cover about six percent of the land on Earth.|Rain forests take up a little bit of the land, sorta.|Rain forests are my favorite places!
  A news article on a market.|The market will open every Saturday starting in June.|The market's gonna be open Saturdays from June on.|It will be the best market ever!
  A report on old letters.|Letters across the ocean once took months to arrive.|Letters took forever and ever to show up back then.|I would hate to wait that long!
  A report on bridges of the world.|The longest bridge in the world is in China.|The longest bridge is in China, and it's crazy long.|That bridge must be so cool to drive on!
  A report on survival.|A person can survive only about three days without water.|You can only go like three days with no water.|That is so scary to think about!
`;
const rewriteLines = `
  The test was a total disaster.|The test went very badly.|The test was a total mess, honestly.|The test went very well.
  Tons of people showed up to the opening.|Hundreds of people attended the opening.|Tons and tons of folks came to the opening.|Few people attended the opening.
  The glacier is getting way smaller.|The glacier is shrinking.|The glacier is getting super smaller.|The glacier is growing.
  The scientists were super excited about the results.|The scientists were pleased with the results.|The scientists were really pumped about the results.|The scientists were upset about the results.
  The bridge cost a ton of money.|The bridge cost forty million dollars.|The bridge cost a whole bunch of cash.|The bridge cost very little.
  The kids freaked out when the lights went off.|The students were frightened when the lights went out.|The kids totally lost it when the lights went off.|The students were calm when the lights went out.
  Mars is really, really cold.|Mars is extremely cold.|Mars is crazy cold, like really.|Mars is warm.
  The Inca were pretty awesome builders.|The Inca were skilled builders.|The Inca were seriously awesome at building.|The Inca were poor builders.
  The storm wrecked a bunch of houses.|The storm damaged dozens of houses.|The storm trashed a whole lot of houses.|The storm missed every house.
  The firefighters got there super fast.|The firefighters arrived within minutes.|The firefighters zoomed there in no time.|The firefighters arrived hours later.
  Bees are a big deal for farmers.|Bees are important to farmers.|Bees are, like, a huge deal for farmers.|Bees do not matter to farmers.
  The museum's new hall is gonna open soon.|The museum's new hall will open soon.|The museum's new hall is gonna open real soon.|The museum's new hall has closed.
  The river got way too high.|The river rose dangerously high.|The river got crazy high, way too high.|The river stayed low.
  The detective figured out the whole thing.|The detective solved the case.|The detective totally cracked the whole thing.|The detective gave up on the case.
  Yeast makes bread puff up like crazy.|Yeast makes bread rise.|Yeast makes bread puff up a bunch.|Yeast makes bread flat.
  Lots of kids got sick that winter.|Many students became ill that winter.|A whole lot of kids got sick that winter.|No students became ill that winter.
  The volcano kinda blew up in 1980.|The volcano erupted in 1980.|The volcano sorta blew its top in 1980.|The volcano stayed quiet in 1980.
  The tower is super tall.|The tower is 330 meters tall.|The tower is mega tall.|The tower is short.
  The old dam was falling apart.|The old dam was in poor repair.|The old dam was totally falling to bits.|The old dam was in perfect repair.
  The hikers were lost for, like, two days.|The hikers were lost for two days.|The hikers were lost for, like, a couple of days.|The hikers were lost for two weeks.
  The library is jam-packed after school.|The library is crowded after school.|The library is packed out after school, big time.|The library is empty after school.
  Penicillin was a huge game changer.|Penicillin changed medicine greatly.|Penicillin was a massive game changer.|Penicillin made little difference.
  Recycling saves loads of trees.|Recycling saves many trees.|Recycling saves heaps and heaps of trees.|Recycling saves no trees.
  The deserts are crazy hot.|Deserts can be extremely hot.|The deserts are hot as anything.|Deserts are always cold.
  The bridge opening was a blast.|Many people enjoyed the bridge opening.|The bridge opening was a total blast.|No one enjoyed the bridge opening.
  The moon rocks were super old.|The moon rocks were billions of years old.|The moon rocks were ancient, like, super old.|The moon rocks were new.
  Heaps of fish died in the dirty river.|Many fish died in the polluted river.|A ton of fish croaked in the dirty river.|The fish thrived in the polluted river.
  The new market is pretty cool.|The new market is popular.|The new market is kinda cool.|The new market is unpopular.
  The lab was a total mess.|The lab was untidy.|The lab was a complete pigsty.|The lab was spotless.
  The test bridge was rock solid.|The test bridge proved very strong.|The test bridge was solid as a rock, for real.|The test bridge proved weak.
`;

const formalStyle = topic("writing", {
  id: "formal-style",
  title: ["Formal Style", "正式文体"],
  summary: [
    "Reports and news articles use a formal style: the third person, exact words, no slang and no exclamations.",
    "报告和新闻报道使用正式文体：用第三人称、用词准确、不用俚语、不用感叹句。",
  ],
  after: ["formal-and-informal-english"],
  points: [
    choose(
      "the-sentence-in-a-formal-style",
      ["The Sentence in a Formal Style", "正式文体的句子"],
      [
        "Reports and news articles keep a **formal style**. They use the **third person** (not *I think*), **exact words** and numbers instead of *tons* or *like*, and **no slang**. They state facts calmly, without exclamations about how the writer feels. Save *awesome* and *wow* for talking with friends.",
        "报告和新闻报道使用**正式文体**。它们用**第三人称**（不用 *I think*），用**准确的词语**和数字代替 *tons* 或 *like*，**不用俚语**。它们平静地陈述事实，不用感叹句表达作者的感受。*awesome* 和 *wow* 留到和朋友聊天时再用。",
      ],
      ["Which sentence keeps a formal style?", "哪个句子保持了正式文体？"],
      formalLines,
      (right) => [`**${right}** uses exact words, with no slang and no exclamation.`, `**${right}** 用词准确，没有俚语，也没有感叹。`],
      [
        ["*{wrong}* uses slang and vague words such as *like* or *tons*.", "*{wrong}* 用了俚语和 *like*、*tons* 这类含糊的词。"],
        ["*{wrong}* shouts the writer's own feelings with an exclamation.", "*{wrong}* 用感叹句喊出了作者自己的感受。"],
      ],
    ),
    choose(
      "rewriting-a-sentence-formally",
      ["Rewriting a Sentence Formally", "把句子改写成正式文体"],
      [
        "To make an informal sentence formal, replace each slang word with an **exact** one: *a ton of money* becomes *forty million dollars* or *a great deal of money*, *super excited* becomes *pleased*. Keep the meaning the same: the formal sentence must still say what the informal one said.",
        "要把非正式的句子改成正式的，就把每个俚语换成**准确**的词：*a ton of money* 改成 *forty million dollars* 或 *a great deal of money*，*super excited* 改成 *pleased*。意思要保持不变：正式的句子仍要说出原句的意思。",
      ],
      ["Which is the best formal version of the sentence?", "哪个是这个句子最好的正式版本？"],
      rewriteLines,
      (right) => [`**${right}** says the same thing in exact, formal words.`, `**${right}** 用准确、正式的词语说出了同样的意思。`],
      [
        ["*{wrong}* still uses slang.", "*{wrong}* 仍然用了俚语。"],
        ["*{wrong}* is formal but changes the meaning.", "*{wrong}* 虽然正式，却改变了原意。"],
      ],
    ),
  ],
});

// Planning a story arc.
const arcLabels: Record<string, Label> = {
  "the beginning": {
    zh: "开头",
    why: ["It introduces the character and sets up the problem.", "它介绍人物并引出问题。"],
    not: ["The beginning sets up the problem; this event comes later.", "开头引出问题；这件事发生得更晚。"],
  },
  "a rising event": {
    zh: "发展事件",
    why: ["It makes the problem harder and raises the stakes.", "它让问题更难，提高了风险。"],
    not: ["Rising events make the problem harder; this event does not.", "发展事件让问题更难；这件事没有。"],
  },
  "the turning point": {
    zh: "转折点",
    why: ["It is the moment the character acts, and the problem begins to be solved.", "这是人物采取行动、问题开始得到解决的时刻。"],
    not: [
      "The turning point is where the character acts to solve the problem; this is not it.",
      "转折点是人物采取行动解决问题的地方；这不是。",
    ],
  },
  "the ending": {
    zh: "结局",
    why: ["It shows how things turn out after the problem is solved.", "它表明问题解决后事情的结果。"],
    not: ["The ending comes after the problem is solved; this event comes before.", "结局在问题解决之后；这件事发生在之前。"],
  },
};
const arcPlans = rows(`
  Nina and the kite contest|Nina wants to win the town's kite contest, but her kite keeps crashing.|The wind on contest day is twice as strong as usual.|Nina adds a longer tail to steady her kite and launches it into the gale.|Her kite flies highest of all, and the judges give her the ribbon.
  Ezra's camping trip|Ezra is afraid of the dark, and his family is going camping.|On the first night, his flashlight batteries die.|Ezra follows the sound of the stream back to camp by starlight.|He sits by the fire, proud, and stops needing a nightlight.
  the village well|A village's only well is going dry in a hot summer.|The animals begin to sicken, and some families leave.|Two children find a spring in a cave and lead the elders to it.|The villagers pipe water from the spring and celebrate.
  Rosa and her grandmother|Rosa's grandmother is losing her memory and forgets Rosa's name.|Grandma grows more confused and stops talking at all.|Rosa plays Grandma's old favorite song on the piano, and Grandma sings along.|Rosa visits each week with a new song, and they share the music.
  the lost dog|A lost dog wanders far from home in the city.|It is chased by traffic and loses its collar.|The dog follows the smell of its family's bakery down a familiar street.|The family finds it on their doorstep and hugs it tightly.
  Omar and the soccer team|Omar wants to join the soccer team but is the smallest boy.|He is cut at the first tryout and his friends laugh.|Omar practices every evening and shows the coach how fast he has become.|The coach puts him on the team, and he scores in the first game.
  the lighthouse in the storm|The lighthouse keeper falls ill on the night of a big storm.|The wind blows out the lamp, and a ship is heading for the rocks.|His daughter climbs the tower and lights the old backup lantern.|The ship passes safely, and the town gives her a medal.
  the girl in a new country|A girl moves to a new country and speaks none of the language.|She sits alone at lunch for weeks and stops raising her hand.|She teaches her class a game from her home country, and they play together.|By spring she has friends and speaks the language with ease.
  the broken robot|A team's robot breaks the day before a contest.|They cannot find the problem, and the team captain wants to quit.|Lucy finds the loose wire with a flashlight and fixes it.|The team wins second place and is invited back next year.
  the old oak in the square|A town plans to cut down the old oak in the square.|The workers arrive with saws on Monday morning.|The children hold hands in a ring around the tree and ask the mayor to listen.|The mayor changes the plan, and the oak still stands.
`);
const arcLines = arcPlans
  .flatMap((r) => [
    `A story about ${field(r, 0)}: ${field(r, 1)}|the beginning`,
    `A story about ${field(r, 0)}: ${field(r, 2)}|a rising event`,
    `A story about ${field(r, 0)}: ${field(r, 3)}|the turning point`,
    `A story about ${field(r, 0)}: ${field(r, 4)}|the ending`,
  ])
  .join("\n");
const turnRows = rows(`
  Problem: Mia's grandfather's boat is stuck on a sandbar as the tide goes out.|Mia ties a rope to the boat and rows it free as the tide turns.|The tide goes out farther, and the boat tips on its side.|Mia and Grandpa eat supper on the dock that evening.
  Problem: Ben has stage fright and must sing a solo at the concert.|Ben fixes his eyes on his mother in the front row and begins to sing.|Ben's voice cracks during the last practice.|Ben's music teacher gives him a gold star afterward.
  Problem: A storm traps Lena and her brother in a mountain hut.|Lena uses the hut's old radio to call the rangers.|The snow piles up against the door, and the stove runs out of wood.|The rangers bring them hot cocoa on the way down.
  Problem: Theo breaks his neighbor's window with a baseball.|Theo knocks on the door and tells his neighbor the truth.|Theo hides the ball and pretends nothing happened.|Theo and his neighbor fix the window together on Saturday.
  Problem: The class pet rabbit escapes before the school fair.|Ava lays a trail of carrots that leads the rabbit back to its cage.|The rabbit is spotted near the busy road.|The rabbit wins a ribbon at the fair.
  Problem: Sam's kite gets stuck high in a tree.|Sam borrows a long pole and gently frees the kite.|The wind tangles the string around another branch.|Sam flies the kite again the next day.
  Problem: Kai's family's bakery is losing customers to a new shop.|Kai invents a new sweet bun, and the line out the door returns.|The new shop starts selling cheaper bread.|The bakery throws a party for its twentieth year.
  Problem: Two friends quarrel before a school trip.|Jada sits beside Lily on the bus and apologizes.|They refuse to speak during the first day of the trip.|They share a tent on the last night of the trip.
  Problem: A fox keeps raiding the farm's henhouse.|Rosa builds a stronger fence with a buried wire edge.|The fox takes the best laying hen.|The hens lay a record number of eggs that spring.
  Problem: The town's old bridge is closed, and the school bus cannot cross.|The parents set up a ferry with their boats to carry the children.|Rain swells the river, and the detour floods.|The new bridge opens in the autumn.
  Problem: Lucy loses her voice before the debate.|Lucy writes her arguments on cards, and her partner reads them aloud.|Her partner forgets his own notes at home.|Lucy's team receives a trophy.
  Problem: A heron is eating the fish in the pond.|Leo strings a net above the water so the heron cannot reach the fish.|The heron returns each dawn and takes another fish.|The pond fills with young fish by summer.
  Problem: Aisha cannot read the old letters written in her great-grandfather's language.|Aisha asks her grandmother to teach her the old alphabet.|The letters are fading and some pages crumble.|Aisha writes a book about her great-grandfather.
  Problem: The hikers' map blows away in the wind.|Nora uses the sun and her watch to find south and leads them down.|Fog rolls in and hides the trail markers.|The hikers reach the lodge by evening.
  Problem: A family's cat climbs onto the roof and will not come down.|Dad opens a can of tuna at the attic window, and the cat creeps inside.|The cat climbs even higher onto the chimney.|The cat sleeps by the fire that night.
  Problem: The school garden is wilting in a heat wave.|The students set up a rota to water the garden every morning.|The hose breaks, and the tomatoes droop.|The students serve the vegetables at a harvest lunch.
  Problem: Marco has to cross a rope bridge but fears heights.|Marco fixes his eyes on his sister on the far side and steps forward.|The bridge sways, and Marco freezes halfway across.|Marco and his sister picnic beside the waterfall.
  Problem: The village's only road is blocked by a landslide.|The villagers form a chain and pass the rocks from hand to hand.|A second slide buries the road deeper.|The road reopens with a new stone wall.
  Problem: A girl's science project fails the night before the fair.|She changes her question and writes up why the first test failed.|Her model collapses as she tries to fix it.|She wins a prize for honest science.
  Problem: Felix's grandmother's ring goes missing.|Felix checks the dog's bed and finds the ring among the toys.|His sister is blamed and runs to her room crying.|Grandma wears the ring to Sunday dinner.
  Problem: A ship's engine fails in a storm.|Captain Rosa finds the leak and patches it with tape.|The radio crackles and goes dead.|The ship docks safely the next morning.
  Problem: A dog is afraid of water and must cross a stream to get home.|The dog sees its owner across the stream and leaps in.|The stream rises after the rain.|The dog shakes itself dry on the porch.
  Problem: The town's library is going to close.|The children write letters and fill the town meeting to speak.|The council votes to cut its hours.|The library holds a party for its hundredth year.
  Problem: Jun breaks his arm before the swimming race.|Jun coaches his younger brother to swim the race in his place.|Jun's team has no other swimmer for the race.|Jun swims again the next summer.
  Problem: A family is lost driving at night.|Mom stops at a farmhouse and asks the way.|The phone signal disappears in the hills.|The family arrives at Grandma's house for breakfast.
  Problem: A young bird falls from its nest.|Ella places the bird back in a basket tied high in the tree.|The cat circles the tree, watching the bird.|The bird learns to fly a week later.
  Problem: Grace forgets her lines in the school play.|Grace makes up new lines in character, and the audience laughs.|The prompter has lost her place in the script.|The class cheers for Grace after the show.
  Problem: A farmer's cow gets stuck in the mud.|The neighbors tie ropes to the cow and pull together.|The rain keeps falling, and the mud gets deeper.|The cow is milked in the barn that evening.
  Problem: The bakers run out of flour before the festival.|Kemi rides to the next town and buys flour from the mill.|Customers start lining up outside the bakery.|The festival is the bakery's busiest day.
  Problem: A boy finds a stray kitten during a snowstorm.|He wraps the kitten in his scarf and carries it home.|The snow gets deeper, and the kitten stops mewing.|The kitten curls up on his bed that night.
`);
const turnItems: ChoiceItem[] = turnRows.map(
  (r): ChoiceItem => [field(r, 0), field(r, 1), [field(r, 2), `Once it is all over, ${lowerStart(field(r, 3))}`]],
);

const storyArc = topic("writing", {
  id: "planning-a-story-arc",
  title: ["Planning a Story Arc", "规划故事的情节线"],
  summary: [
    "A story goes from a beginning that sets up the problem, through events that raise the stakes, to a turning point and an ending.",
    "故事从引出问题的开头开始，经过不断加大风险的事件，到达转折点和结局。",
  ],
  after: ["ending-a-story"],
  points: [
    label(
      "placing-events-in-the-story-plan",
      ["Placing Events in the Story Plan", "把事件放进故事计划"],
      [
        "A story plan has four parts. **The beginning** introduces the character and the problem. **Rising events** make the problem harder, raising the stakes. **The turning point** is the moment the character acts, and the problem starts to be solved. **The ending** shows how things turn out. Placing each event tells you what it must do.",
        "故事计划有四个部分。**开头**介绍人物和问题。**发展事件**让问题更难，提高风险。**转折点**是人物采取行动、问题开始得到解决的时刻。**结局**表明事情的结果。确定每件事的位置，就知道它要起什么作用。",
      ],
      ["Where does this event belong in the story plan?", "这件事在故事计划中属于哪一部分？"],
      arcLines,
      arcLabels,
    ),
    choose(
      "the-event-that-should-be-the-turning-point",
      ["The Event That Should Be the Turning Point", "应该作为转折点的事件"],
      [
        "The **turning point** is the most important moment of a story: the character **acts**, and that action begins to solve the problem. An event that makes the problem worse belongs before it, and an event that shows how things end belongs after it. Look for the moment of choice and action.",
        "**转折点**是故事最重要的时刻：人物**采取行动**，这一行动开始解决问题。让问题变糟的事件应放在它之前，表明结局的事件应放在它之后。要寻找人物做出选择并行动的那一刻。",
      ],
      ["Which event should be the turning point of the story?", "哪件事应该是故事的转折点？"],
      turnItems,
      (right) => [`**${right}** is the moment the character acts to solve the problem.`, `**${right}** 是人物采取行动解决问题的时刻。`],
      [
        ["*{wrong}* makes the problem worse, so it comes before the turning point.", "*{wrong}* 让问题更糟，所以在转折点之前。"],
        ["*{wrong}* shows how things end, so it comes after the turning point.", "*{wrong}* 表明结局，所以在转折点之后。"],
      ],
    ),
  ],
});

// Pacing a story: story|the moment to slow down|a dull stretch|a dull stretch
const pacingRows = rows(`
  A story about Mia's first swim across the lake.|the moment Mia's foot slips off the last rock and she must swim alone|the drive to the lake that morning|packing the towels and sandwiches
  A story about a lost dog finding its way home.|the moment the dog recognizes its family's street|the dog's nap under a bench|the many blocks of ordinary sidewalk
  A story about a spelling bee.|the moment Leo hears his final, hardest word|the bus ride to the school hall|the hour of waiting for other contestants
  A story about a camping trip in a storm.|the moment the tent pole snaps in the wind|setting the table for breakfast|the long, quiet hike to the campsite
  A story about a girl's first day at a new school.|the moment she walks into the classroom and every head turns|brushing her teeth that morning|the walk past rows of houses
  A story about a soccer final.|the last penalty kick that decides the game|the warm-up stretches|the team's bus trip to the stadium
  A story about finding a treasure map.|the moment the old key turns in the lock of the chest|the week of rainy days before the search|eating lunch on the way
  A story about a rescue at sea.|the moment the rope is thrown to the struggling swimmer|the hours of calm sailing earlier|cleaning the deck that morning
  A story about a science fair.|the moment the judge looks up from Ana's notes to ask a question|setting up the tables in the gym|the days of copying notes neatly
  A story about climbing a mountain.|the moment Jun reaches the summit as the sun rises|the drive to the trailhead|the hours of steady walking through forest
  A story about baking a birthday cake.|the moment the cake slides off the plate just before the party|measuring the flour|the hour it bakes in the oven
  A story about a school play.|the moment Amir steps on stage for the first time|the weeks of rehearsals|painting the scenery
  A story about a long train trip.|the moment the train stops suddenly in a dark tunnel|the hours of fields passing by|eating snacks from the bag
  A story about meeting a grandparent for the first time.|the moment Grandma opens the door and holds out her arms|the long flight across the ocean|waiting for the luggage
  A story about a bike race.|the moment Sam's chain slips on the final hill|riding to the starting line|pumping up the tires the night before
  A story about a power cut.|the moment a strange noise comes from the dark basement|the afternoon of homework before it|dinner on an ordinary plate
  A story about a lost hiker.|the moment she hears a ranger's whistle through the fog|the days of planning the trip|the drive to the park
  A story about a talent show.|the moment Kemi's microphone cuts out halfway through her song|signing up for the show|the week of practicing scales
  A story about a fishing trip.|the moment the huge fish leaps out of the water on the line|rowing out to the middle of the lake|the hours of waiting with no bites
  A story about a family moving house.|the moment Ben looks back at his empty bedroom for the last time|packing the boxes|the long drive on the highway
  A story about a snow day.|the moment the sled hurtles toward the frozen pond|putting on boots and coats|the walk to the hill
  A story about a puppy's first night home.|the moment the puppy crawls into Ava's bed and stops crying|shopping for a dog bowl|filling in the adoption forms
  A story about a lighthouse in a storm.|the moment the girl lights the lantern as the ship nears the rocks|the days of fine weather before|polishing the brass that afternoon
  A story about a museum visit.|the moment Tom realizes he is alone in the hall of mummies|buying the tickets|the bus ride to the city
  A story about a debate.|the moment Lucy stands to answer the hardest question|choosing a topic weeks before|the lunch break
  A story about a volcano erupting near a village.|the moment the ground shakes and ash begins to fall|the ordinary market day before|the farmers tending fields all summer
  A story about a spelling test.|the moment Maria sees the word she practiced all week|sharpening her pencil|the class's morning announcements
  A story about a kite contest.|the moment Nina's kite rises above all the others|walking to the field|tying the string to the spool at home
  A story about a lost ring.|the moment Felix spots a glint of gold in the dog's bed|eating breakfast|the afternoon of chores
  A story about a hospital visit.|the moment the doctor says the surgery went well|filling in forms at the desk|reading magazines in the waiting room
`);
const slowItems: ChoiceItem[] = pacingRows.map(
  (r): ChoiceItem => [
    field(r, 0),
    field(r, 1),
    [`the part of the story about ${field(r, 2)}`, `the stretch of the story about ${field(r, 3)}`],
  ],
);
const speedLines = `
  The writer needs to get through the week before the big race.|The next five days passed in a blur of practice.|On Monday morning I woke at seven, ate oatmeal with raisins and then brushed my teeth.|The race began with a loud bang.
  The writer needs to skip the long drive to Grandma's house.|Four hours later, we pulled into Grandma's driveway.|We passed a red barn, then a blue barn, then a gas station with a broken sign.|Grandma opened the door and hugged me tightly.
  The writer needs to get past the boring months of winter.|Winter dragged on, and at last the snow melted.|In December the snow fell; in January it fell more; in February it fell again.|The first robin landed on the fence.
  The writer needs to skip the hours of waiting at the airport.|After a long wait, our flight was finally called.|I counted ninety-two chairs, read three signs and watched a man eat a sandwich.|The plane lifted off into the clouds.
  The writer needs to get past the practice sessions.|Weeks of practice later, the concert night arrived.|On the first day we practiced scales, and on the second day we practiced scales too.|The curtain rose on the stage.
  The writer needs to skip the long hike up the trail.|We climbed for three hours before we saw the lake.|First there was a pine tree, then another pine tree, then a rock shaped like a shoe.|The lake shone like glass below us.
  The writer needs to get past the summer holidays.|The summer flew by, and soon school began again.|In June I swam, in July I swam, and in August I swam every afternoon too.|The school bell rang.
  The writer needs to skip the days of rain.|It rained for a week, and we stayed inside.|On Monday it rained, so we played cards, and on Tuesday it rained, so we played cards.|At last the sun came out.
  The writer needs to skip the hours of baking.|By the time the cakes cooled, it was evening.|I cracked the first egg, then the second egg, then the third, and stirred slowly.|The guests rang the doorbell.
  The writer needs to get past the long voyage.|Forty days at sea went by before land appeared.|On day one the sea was gray, and on day two the sea was gray as well.|Someone shouted from the mast.
  The writer needs to skip the bus ride to the museum.|Soon we stood at the museum's tall doors.|The bus stopped at a light, then another light, then a third light on Main Street.|The guide led us inside.
  The writer needs to get past the weeks of building the robot.|After a month of work, the robot was ready.|We cut one wire, then another wire, then we screwed in a small bolt.|The contest began at noon.
  The writer needs to skip the morning routine.|By eight, I was out the door.|I woke, yawned, stretched my left arm, stretched my right arm and sat up.|The bus was waiting at the corner.
  The writer needs to skip the wait for test results.|Three long days later, the letter came.|On the first day I checked the mailbox, and on the second day I checked it again.|I tore the envelope open.
  The writer needs to get past the trip to the campsite.|By evening we had pitched our tent by the river.|We drove past a mall, a school, a park and a bakery, and then a second mall.|An owl hooted in the dark.
  The writer needs to skip the many rounds of the spelling bee.|Round after round passed until only two of us were left.|The first boy spelled cat, the second girl spelled dog, the third boy spelled hat.|The judge read the final word.
  The writer needs to skip months of a garden growing.|By August, the vines were heavy with tomatoes.|In May I watered the seeds, and in June I watered the seeds, and in July I watered again.|I picked the first ripe tomato.
  The writer needs to get past the long wait in the hospital.|Hours passed before the doctor came out.|I counted the floor tiles, then counted them again, then counted the ceiling tiles.|The doctor smiled.
  The writer needs to skip the walk to school.|Ten minutes later, I reached the school gate.|I passed a lamppost, a mailbox, another lamppost and then a crack in the sidewalk.|The bell was ringing.
  The writer needs to skip years of growing up.|Years went by, and the little girl became a sailor.|When she was six she grew, when she was seven she grew more, when she was eight she grew.|She stood at the ship's wheel.
  The writer needs to get past the tryouts.|After two days of tryouts, the coach posted the list.|First we ran a lap, then we ran another lap, then we did ten jumping jacks.|My name was on the list.
  The writer needs to skip the days of the storm.|The storm raged for three days.|The first hour was windy, the second hour was windy, the third hour was windy too.|When it stopped, the yard was full of branches.
  The writer needs to skip the trip home from the beach.|Soon we were home, sandy and tired.|We folded the first towel, then the second towel, then shook out the third towel.|I fell asleep on the sofa.
  The writer needs to get past the long winter in the cabin.|The winter passed slowly, and spring finally came.|Each morning we lit the stove; each morning we ate porridge; each morning it snowed.|The ice on the river cracked.
  The writer needs to skip the many miles of the bike ride.|Twenty miles later, the lighthouse came into view.|I pedaled past one field, then another field, then a field that looked the same.|I leaned my bike against the fence.
  The writer needs to get past the long flight.|After a night in the air, we landed in Lima.|They served chicken, then they served bread, then they served a small cup of juice.|The guide waited with a sign.
  The writer needs to skip the hours of cleaning.|By lunchtime, the house was spotless.|I swept the kitchen, then the hall, then the kitchen again because I missed a crumb.|The doorbell rang.
  The writer needs to skip the weeks before the move.|The weeks rushed by, and moving day arrived.|On Monday I packed books, on Tuesday I packed books, on Wednesday I packed more books.|The truck pulled up outside.
  The writer needs to skip the wait for the bus.|The bus finally came twenty minutes late.|A car passed, then a truck, then a blue car, then a man with a dog.|I climbed aboard.
  The writer needs to get past the quiet days at the lighthouse.|The calm weeks of summer slipped away.|On Monday the sea was calm, and on Tuesday the sea was calm, and on Wednesday it was calm.|Then, in September, the storm came.
`;

const pacingAStory = topic("writing", {
  id: "pacing-a-story",
  title: ["Pacing a Story", "控制故事的节奏"],
  summary: [
    "A writer slows down at the moments that matter, with detail and dialogue, and speeds up the rest with a summary (Three days passed).",
    "作者在重要的时刻放慢节奏，加入细节和对话；在其他地方用概括加快节奏（Three days passed）。",
  ],
  after: ["planning-a-story-arc", "showing-not-telling"],
  points: [
    choose(
      "the-moment-to-slow-down",
      ["The Moment to Slow Down", "该放慢的时刻"],
      [
        "**Pacing** is how fast a story moves. A writer **slows down** at the moment that matters most, the moment of danger, choice or discovery, telling it second by second with detail, thoughts and dialogue. Ordinary stretches such as drives, chores and waiting get only a sentence or are skipped.",
        "**节奏**是故事推进的快慢。作者在最重要的时刻**放慢节奏**，也就是危险、抉择或发现的时刻，用细节、想法和对话一秒一秒地写出来。开车、做家务、等待这样的普通过程只用一句话带过，或干脆略去。",
      ],
      ["Which moment should the writer slow down for?", "作者应该在哪个时刻放慢节奏？"],
      slowItems,
      (right) => [
        `**${right}** is the moment that matters most, so it deserves detail and dialogue.`,
        `**${right}** 是最重要的时刻，所以值得写入细节和对话。`,
      ],
      [
        ["*{wrong}* is an ordinary stretch the reader does not need in detail.", "*{wrong}* 是读者不需要详细了解的普通过程。"],
        ["*{wrong}* is a dull part best covered in a sentence.", "*{wrong}* 是平淡的部分，用一句话带过最好。"],
      ],
    ),
    choose(
      "the-sentence-that-speeds-past",
      ["The Sentence That Speeds Past", "快速带过的句子"],
      [
        "To **speed up**, a writer sums up a dull stretch in one sentence: *Three days passed*, *Four hours later, we arrived*, *The summer flew by*. Listing every step of the stretch slows the story down when nothing is happening. And a sentence that jumps to the next event without covering the gap leaves the reader lost.",
        "要**加快节奏**，作者就用一句话概括平淡的过程：*Three days passed*、*Four hours later, we arrived*、*The summer flew by*。把这段过程的每一步都列出来，会在什么都没发生时拖慢故事。而直接跳到下一件事、不交代中间过程的句子会让读者摸不着头脑。",
      ],
      ["Which sentence speeds past the dull stretch?", "哪个句子快速带过了平淡的过程？"],
      speedLines,
      (right) => [
        `**${right}** sums up the whole stretch in one sentence and moves on.`,
        `**${right}** 用一句话概括了整个过程，然后继续往下讲。`,
      ],
      [
        ["*{wrong}* lists every dull step, which slows the story down.", "*{wrong}* 列出了每一个平淡的步骤，拖慢了故事。"],
        ["*{wrong}* jumps to the next event without covering the time between.", "*{wrong}* 直接跳到下一件事，没有交代中间的时间。"],
      ],
    ),
  ],
});

// Proofreading: paragraphs with three marked errors of three different kinds, each written [kind:wrong>right], with
// kind c (capital letter), e (end mark), m (comma), s (spelling) or w (confused word).
const proofParagraphs = [
  "Last summer we visited [c:grandma's>Grandma's] farm. The barn was [e:huge, it>huge. It] smelled of hay and [s:horsses>horses].",
  "The bridge opened on [c:saturday>Saturday]. Hundreds of people came to see [w:it's>its] new towers. The mayor gave a short [s:speach>speech].",
  "Our class studied the [c:inca>Inca]. They built [m:roads bridges>roads, bridges] and stone cities. Their walls still stand [w:their>there] today.",
  "Glaciers move very [s:slowely>slowly]. Some travel a [e:meter a day, others>meter a day. Others] barely move. [c:in>In] winter, snow piles up on them.",
  "The detective found a [s:mudy>muddy] glove. [c:she>She] knew at once who had dropped it. The thief had been [w:to>too] slow to escape.",
  "Bees visit [m:apples pears>apples, pears] and almonds. They make honey in [w:there>their] hives. [c:farmers>Farmers] need bees.",
  "We hiked to the lake on [c:monday>Monday]. The water was [w:to>too] cold for swimming. We ate [m:sandwiches apples>sandwiches, apples] and cookies.",
  "The storm knocked down three [s:trese>trees]. Our power [e:went out, we>went out. We] lit candles and played cards until [c:mom>Mom] came home.",
  "Mars has red [m:soil dust>soil, dust] storms and two moons. It is colder [w:then>than] Earth. Rovers explore its [s:surfase>surface].",
  "My sister and I wrote to our pen pal in [c:peru>Peru]. She told us about [w:hear>her] school. We sent her a [s:freindly>friendly] letter.",
  "The museum has a new Maya hall. [c:it>It] opens in May. You can see [m:masks pots>masks, pots] and old [s:bookes>books].",
  "Yeast is a living thing. When you feed it [s:suger>sugar], it makes [e:gas, the>gas. The] gas makes the loaf grow [w:taller then>taller than] before.",
  "The firefighters arrived [w:quick>quickly]. They saved the [e:bakery, the>bakery. The] baker, [c:mrs.>Mrs.] Ortiz, thanked them.",
  "In 1928 [c:alexander>Alexander] Fleming found a mold. It killed [s:bactiria>bacteria]. The [w:affect>effect] on medicine was huge.",
  "We packed [m:tents food>tents, food] and water. The trail was [s:steap>steep]. [c:at>At] the top we saw the whole valley.",
  "The lighthouse keeper climbed the stairs. [w:Their>There] were one hundred [e:steps, he>steps. He] lit the lamp at [s:dusck>dusk].",
  "Our town has a new library. It has [m:books computers>books, computers] and a reading room. [c:the>The] librarian is very [s:frendly>friendly].",
  "Rosa entered the science fair. Her project was about mold on [s:bred>bread]. She won first [e:prize, her>prize. Her] parents [w:clapped there>clapped their] hands.",
  "The Aztec built a city on a lake. [w:It's>Its] name was [e:Tenochtitlan, it>Tenochtitlan. It] grew rich. Soldiers from Spain arrived in [c:november>November] 1519.",
  "Old letters tell us about the [w:passed>past]. People wrote with [m:pens ink>pens, ink] and paper. A letter could take months to [s:arive>arrive].",
  "The volcano [w:through>threw] ash into the sky. Families left their homes on [c:tuesday>Tuesday]. They took [m:food water>food, water] and blankets.",
  "Leo's kite got stuck in a [s:tre>tree]. He climbed up [e:carefully, the>carefully. The] branch bent but did not break. [c:his>His] sister cheered.",
  "The Inca used knotted strings to keep [s:recordes>records]. [c:the>The] strings were called quipu. They recorded [m:crops llamas>crops, llamas] and people.",
  "We visited [c:lake>Lake] Louise in winter. The ice was [s:thik>thick] enough to skate on. My brother fell more [w:then>than] once.",
  "The ship left port in [c:april>April]. It sailed for forty [e:days, the>days. The] sailors were tired and [s:hungrey>hungry].",
  "Bridges must carry heavy [s:lodes>loads]. Engineers test them with [m:trucks buses>trucks, buses] and trains. [w:Their>They're] careful with every bolt.",
  "Grandpa told us about the old [s:mil>mill]. It [w:use to>used to] grind wheat. [c:every>Every] farmer in town brought grain there.",
  "The class planted a garden in [c:may>May]. We grew [m:beans peas>beans, peas] and squash. By August we had [w:to>too] many beans to eat.",
  "The owl hunted at [s:nite>night]. It flew without a [e:sound, mice>sound. Mice] never heard it coming. [c:my>My] father photographed it.",
  "Our team built a robot. It could [m:walk turn>walk, turn] and wave. [w:It's>Its] arm broke once, and [c:ms.>Ms.] Grant fixed it.",
];
const kindNames: Record<string, Pair> = {
  c: ["capital letter", "大写字母"],
  e: ["end mark", "句末标点"],
  m: ["comma", "逗号"],
  s: ["spelling", "拼写"],
  w: ["confused word", "易混词"],
};
const kindRules: Record<string, string> = {
  c: "names, days, months, titles and the first word of a sentence take a capital letter",
  e: "two sentences need an end mark between them, not a comma",
  m: "the items of a list are separated by commas",
  s: "the word must be spelled correctly",
  w: "words that sound alike, such as their, there and they're, must not be swapped",
};
const proofMark = /\[([cemsw]):([^>\]]*)>([^\]]*)\]/g;
const proofErrors = (p: string) => [...p.matchAll(proofMark)].map((m) => ({ kind: m[1] ?? "", wrong: m[2] ?? "", right: m[3] ?? "" }));
/** fixedExcept writes the paragraph with every error corrected except the one at index keep (-1 corrects all). */
const fixedExcept = (p: string, keep: number) => {
  let k = 0;
  return p.replace(proofMark, (_, _kind: string, wrong: string, right: string) => (k++ === keep ? wrong : right));
};
const proofShown = (p: string) => p.replace(proofMark, (_, _kind: string, wrong: string) => wrong);
const findItems: ChoiceItem[] = proofParagraphs.flatMap((p) => {
  const errors = proofErrors(p);
  return errors.map((e, i): ChoiceItem => {
    const others = errors.filter((_, k) => k !== i).map((o) => `*${o.wrong}*`);
    return [`${proofShown(p)}\n\nFind the ${kindNames[e.kind]?.[0] ?? ""} error.`, `*${e.wrong}*`, [others[0] ?? "", others[1] ?? ""]];
  });
});
const everyItems: ChoiceItem[] = proofParagraphs.map(
  (p, i): ChoiceItem => [proofShown(p), fixedExcept(p, -1), [fixedExcept(p, i % 3), fixedExcept(p, (i + 1) % 3)]],
);
const kindOfFind = (shown: string) => Object.keys(kindNames).find((k) => shown.endsWith(`Find the ${kindNames[k]?.[0]} error.`)) ?? "s";

const proofreading = topic("writing", {
  id: "proofreading",
  title: ["Proofreading", "校对"],
  summary: [
    "Before a piece is finished, the writer checks it for one kind of error at a time: capitals, end marks, commas, spelling, confused words.",
    "文章完成之前，作者要一次检查一种错误：大写、句末标点、逗号、拼写、易混词。",
  ],
  after: ["commas-in-a-series", "commonly-confused-words"],
  points: [
    choose(
      "an-error-of-one-kind",
      ["An Error of One Kind", "某一类错误"],
      [
        "Proofreaders read a piece **several times**, looking for **one kind of error** each time: first **capital letters** (names, days, months, titles, the first word of a sentence), then **end marks** (two sentences joined by a comma need a period), then **commas** between the items of a list, then **spelling**, then **confused words** such as *their*, *there* and *they're*. Looking for one kind at a time keeps errors from slipping past.",
        "校对的人要把文章读**好几遍**，每遍只找**一种错误**：先找**大写字母**（名字、星期、月份、称谓、句首单词），然后是**句末标点**（用逗号连起来的两个句子需要句号），再是列举项之间的**逗号**，接着是**拼写**，最后是 *their*、*there* 和 *they're* 这样的**易混词**。一次只找一种，错误就不容易漏掉。",
      ],
      ["Find the error of the kind named.", "找出所说的那一类错误。"],
      findItems,
      (right, shown) => {
        const k = kindOfFind(shown);
        return [`${right} is the ${kindNames[k]?.[0]} error: ${kindRules[k]}.`, `${right} 是${kindNames[k]?.[1]}错误。`];
      },
      [
        ["{wrong} is an error too, but of a different kind.", "{wrong} 也是错误，但属于另一类。"],
        ["{wrong} is an error of another kind; check only for the kind named.", "{wrong} 是另一类错误；只检查所说的那一类。"],
      ],
    ),
    choose(
      "every-error-corrected",
      ["Every Error Corrected", "改正所有错误"],
      [
        "A finished piece has **no errors left**. After checking each kind in turn, the proofreader reads once more to make sure every error has been found and fixed. A version that fixes two errors but leaves the third is not finished yet, so compare each version with the original, error by error.",
        "完成的文章**不再有错误**。逐一检查每类错误之后，校对的人还要再读一遍，确认每个错误都已找到并改正。改了两处却留下第三处的版本还没有完成，所以要把每个版本和原文逐个错误地对照。",
      ],
      ["Which version corrects every error in the paragraph?", "哪个版本改正了这一段中的所有错误？"],
      everyItems,
      (right) => [`**${right}** fixes all three errors, with none left behind.`, `**${right}** 改正了全部三个错误，一个也没有留下。`],
      [
        ["*{wrong}* fixes two errors but leaves one behind.", "*{wrong}* 改正了两个错误，却留下了一个。"],
        ["*{wrong}* still has one error that was not corrected.", "*{wrong}* 仍有一个错误没有改正。"],
      ],
    ),
  ],
});

/** writingTopics5 are the writing skills of grade 5 that rules can check. */
export const writingTopics5: readonly TopicDef[] = [
  researchQuestion,
  accordingToASource,
  combiningAndReducing,
  quoteParaphraseSummary,
  quotationAsSupport,
  previewingTheTopic,
  planningSeveralParagraphs,
  orderingReasons,
  onePerReason,
  linkingWords,
  formalStyle,
  storyArc,
  pacingAStory,
  proofreading,
];
