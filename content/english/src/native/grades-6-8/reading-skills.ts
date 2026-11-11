// Grades 6 to 8: reading skills the skill courses lacked: telling primary sources from secondary ones and choosing a
// source for a question, and comparing two texts on one topic.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point } from "@ga/subject-english";

const rows = (lines: string): string[][] =>
  lines
    .trim()
    .split("\n")
    .map((line) => line.trim().split("|"));

const primary = "a primary source";
const secondary = "a secondary source";

/** sourceKindBank describes a source about an event and asks whether it is primary or secondary. */
const sourceKindBank: readonly ChoiceItem[] = rows(`
  A letter a sailor wrote to his wife during Magellan's voyage, describing the hunger on board|p
  A textbook chapter on Magellan's voyage, written in 2015|s
  A diary kept by a girl in Pompeii in the weeks before the eruption|p
  A documentary about Pompeii made by historians in 2010|s
  A photograph taken on the moon by an astronaut in 1969|p
  A magazine article written fifty years later about the first moon landing|s
  The speech a mayor gave on the day the new bridge opened|p
  An encyclopedia entry about the history of the bridge|s
  A soldier's notebook from a Roman fort in Britain|p
  A modern book that explains daily life in the Roman army|s
  A recording of a radio broadcast made during a famous storm|p
  A website that sums up what scientists now know about the storm|s
  A map drawn by an explorer as he traveled up the river|p
  A biography of the explorer written by a historian a century later|s
  An interview with a nurse, recorded the day after the flood|p
  A report written by a student who read several accounts of the flood|s
  The patent Thomas Edison filed for his light bulb|p
  A video that explains how Edison's light bulb worked, made last year|s
  A poster printed in 1920 to tell workers about a strike|p
  A history book chapter that discusses why the strike of 1920 failed|s
  A coin made during the reign of the emperor Augustus|p
  A museum sign that explains what the coins of Augustus tell us|s
  A newspaper story written by a reporter who watched the race|p
  A sports website's list of the greatest races of all time|s
  The ship's log kept by the captain on Zheng He's fleet|p
  A novel set aboard one of Zheng He's ships, written in 2005|s
  A telegram sent from the Titanic as it was sinking|p
  An article in a science magazine about why the Titanic sank|s
  A scientist's notes written while she studied whales in Antarctica|p
  A children's book about whales based on many scientists' work|s
  Your grandmother's memories of her first day at school, told to you by her|p
  An essay that compares schools of the 1950s with schools of today|s
`).map(([shown, kind]): ChoiceItem => (kind === "p" ? [shown!, primary, [secondary]] : [shown!, secondary, [primary]]));

/** bestSourceBank asks which of three sources would best answer a question. */
const bestSourceBank: readonly ChoiceItem[] = rows(`
  What did the sailors on Magellan's voyage eat when their food ran out?|the diary of one of the sailors on the voyage|a movie about Magellan's voyage made in 2019, with famous actors as the sailors|a poster of a sailing ship
  What did the people of Pompeii see on the day of the eruption?|a letter written by a man who watched the eruption from across the bay|a cartoon about volcanoes|a modern travel guide to Pompeii with photos of the ruins and the volcano
  How many people live in our town today?|this year's census report from the town hall|a letter written by the town's founder about the first families who settled there|a novel set in our town
  What did the first astronauts feel when they stepped onto the moon?|an interview the astronauts gave after their return|a science-fiction story about astronauts who land on the moon|a chart of the moon's craters
  How do scientists explain why the dinosaurs died out?|a recent science book that sums up many studies|a dinosaur toy's packaging|a single fossil hunter's diary from 1890
  What was the weather like in our city on the day of the great fire?|a newspaper printed the next morning|a painting of the fire made fifty years later by an artist who had heard about it|a website about fire safety
  What do most historians now think caused the fall of Rome?|a modern history book that compares many historians' views|a letter from one Roman farmer complaining about taxes in the years before the fall|a movie about gladiators
  What did a factory worker's day look like in 1910?|the diary of a worker in a 1910 factory|an advertisement for a modern factory|a song written about factory workers last year by a popular band
  How did the telegraph change the way news traveled?|a history article that compares news before and after the telegraph|a single telegram sent in 1890 to wish a cousin a happy birthday|a photo of a telegraph pole
  How did ordinary soldiers feel before the battle?|letters the soldiers sent home the night before|a general's statue in the city square|a modern video game that lets players fight in the battle
  How does a coral reef form?|a marine biologist's book on reefs|a diver's vacation photo of a colorful reef|an ad for a beach hotel
  What did the inventor say when her machine first worked?|the inventor's own notebook from that day|a cartoon about inventors|a toy model of her machine sold in the museum gift shop
  How long did the Lewis and Clark expedition take?|a history book that uses the expedition's journals|a painting of the river|a hiking trail map from today
  What did the students think of the new lunch rules?|a survey of the students taken last month|the menu of the school cafeteria|the principal's guess about how students feel about the rules
  What happened at the town council meeting last night?|the official notes of the meeting|a rumor shared on a website|a poster for the next meeting
  How have the oceans warmed over the past century?|a scientific report that collects a hundred years of measurements|a fisherman's memory of one hot summer|a postcard of a beach
  What were the rules of a Roman election?|a modern book that explains Roman government using ancient sources|a costume from a play about Rome|a single coin with a consul's name
  What did Matthew Henson see when he reached the far north?|Henson's own book about his journeys|a map of the Arctic printed this year, showing the routes of many explorers|a story about a polar bear
  How did the steam engine change life in factory towns?|a history book that studies many factory towns|a single train ticket from 1850|a toy steam engine
  What did the crowd do when the first airplane flew?|a reporter's story written on the day of the flight|a modern drawing of the airplane in a children's book about famous flights|a pilot's training manual from today
  What was school like for my grandfather?|an interview with my grandfather|a website about what schools were like in other countries long ago|a modern school's timetable
  How do whales find their way across the ocean?|a scientific article on whale migration|a whale-watching ticket|a poem about the sea
  What words did the mayor use in her speech on Monday?|a video recording of the speech|a summary of the speech by someone who missed it|a photo of the mayor's office
  How common were shipwrecks in the 1700s?|a study that counts shipwrecks from the records of many ports|one sailor's story of a single wreck off the coast of Spain in 1754|a painting of a storm at sea
  How did Ibn Battuta describe the cities he visited?|the book of travels he dictated after returning home|a modern map of North Africa|a video game set in the desert
  Is the new bridge safe?|an engineer's inspection report|a neighbor's opinion of the bridge|a photo of the bridge at sunset
  What did the people of the town think when the factory closed?|interviews with townspeople recorded that week|the factory's old logo|a history of factories around the world from 1800 to today
  How did the printing press spread across Europe?|a history book that traces where printers set up shops|a single page printed in 1460|a modern printer's instruction booklet
  What did the explorer write when she reached the summit?|the explorer's journal from the climb|a mountain-shaped trophy|a travel ad for the mountain
  Which species live in the kelp forest near our coast?|a survey of the forest by marine scientists|a seafood restaurant's menu|a surfer's description of the waves and the fish he saw while surfing near the forest
`).map(([shown, right, ...wrong]): ChoiceItem => [shown!, right!, wrong]);

const agree = "they agree";
const conflict = "they conflict";
const different = "they give different details that do not conflict";

const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

const zhRelation: Readonly<Record<string, string>> = {
  [agree]: "两者一致",
  [conflict]: "两者矛盾",
  [different]: "两者给出不矛盾的不同细节",
};

/** agreementBank shows two statements on one topic and asks how they relate. */
const agreementBank: readonly ChoiceItem[] = rows(`
  Text A: The Colosseum could hold about fifty thousand people. Text B: Around fifty thousand spectators fit in the Colosseum.|a
  Text A: The bridge opened in 1932. Text B: The bridge was not finished until 1937.|c
  Text A: Whales migrate thousands of miles each year. Text B: Some whales sing songs that last for hours.|d
  Text A: The storm destroyed forty homes. Text B: Forty houses were lost in the storm.|a
  Text A: The telephone was first shown to the public in 1876. Text B: The public first saw the telephone in 1880.|c
  Text A: Coral reefs are home to many fish. Text B: Coral reefs protect coasts from waves.|d
  Text A: The expedition reached the pole in December. Text B: The team arrived at the pole in January.|c
  Text A: Plankton drifts with the ocean currents. Text B: Plankton cannot swim against the currents and is carried by them.|a
  Text A: The library was built with money from the town. Text B: The library was paid for by a single wealthy family.|c
  Text A: The steam engine burned coal. Text B: The first steam engines were used to pump water out of mines.|d
  Text A: Most students liked the new schedule. Text B: Only a few students were happy with the new schedule.|c
  Text A: The first airplane flight lasted twelve seconds. Text B: The plane stayed in the air for just twelve seconds on its first flight.|a
  Text A: Roman roads were built of layers of stone and gravel. Text B: Roman roads helped armies move quickly.|d
  Text A: The lake froze over in early January. Text B: By the first week of January, ice covered the lake.|a
  Text A: The volcano erupted without warning. Text B: For days before the eruption, the ground shook and wells dried up.|c
  Text A: The inventor worked alone in her garage. Text B: The inventor used parts from old radios.|d
  Text A: The new park cost two million dollars. Text B: The city spent two million dollars on the park.|a
  Text A: Kelp grows up to two feet a day. Text B: Sea otters wrap themselves in kelp while they sleep.|d
  Text A: The ship sank in calm weather. Text B: The ship went down in a violent storm.|c
  Text A: Zheng He's largest ships had nine masts. Text B: Zheng He's fleet visited ports in India and Africa.|d
  Text A: Aqueducts carried water into Roman cities. Text B: Roman cities got fresh water through long channels called aqueducts.|a
  Text A: The game was canceled because of rain. Text B: The game went ahead despite the rain.|c
  Text A: The printing press made books cheaper. Text B: The printing press used movable metal letters.|d
  Text A: The town's population has doubled since 1990. Text B: Twice as many people live in the town now as in 1990.|a
  Text A: The museum is free on Sundays. Text B: The museum charges ten dollars every day of the week.|c
  Text A: The marathon runner trained for two years. Text B: The runner grew up in a small mountain village.|d
  Text A: The factory closed in 2008. Text B: The factory shut its doors in 2008.|a
  Text A: Penguins live only in cold places. Text B: One kind of penguin lives near the equator.|c
  Text A: The smartphone combined a phone and a computer. Text B: The first smartphones had small keyboards.|d
  Text A: The explorers ran out of food. Text B: The explorers had plenty of food for the whole journey.|c
`).map(([shown, kind]): ChoiceItem => {
  const right = kind === "a" ? agree : kind === "c" ? conflict : different;
  return [shown!, right, [agree, conflict, different].filter((k) => k !== right)];
});

/** focusBank shows two texts on one topic and asks how their authors present it differently. */
const focusBank: readonly ChoiceItem[] = rows(`
  Text A: The new highway cuts the trip to the city to twenty minutes. Text B: The new highway cut through the old forest where families once picnicked.|A stresses what the highway gained; B stresses what it destroyed.|A and B both stress what the highway destroyed.|A and B disagree about how long the trip to the city now takes on the new highway.
  Text A: The steam engine let factories make goods faster than ever. Text B: In the new factories, children worked fourteen-hour days beside the steam engines.|A focuses on the engine's speed; B focuses on the people who worked beside it.|A and B both focus on children's work.|B says the steam engine made goods more slowly.
  Text A: Columbus's voyage opened a new route between Europe and the Americas. Text B: For the people already living in the Americas, Columbus's arrival brought disease and war.|A tells the voyage from Europe's side; B tells it from the side of the people already there.|A and B both tell the story of the voyage from the side of the sailors who came from Europe.|A and B disagree about when the voyage happened.
  Text A: Gladiator fights drew huge, cheering crowds to the Colosseum. Text B: Most gladiators were slaves who had no choice but to fight.|A describes the crowds' excitement; B describes the gladiators' lack of freedom.|A and B both praise the gladiators' skill.|B says that no one in Rome ever came to watch the gladiator fights in the Colosseum.
  Text A: The smartphone puts the world's knowledge in your pocket. Text B: Many teenagers say their phones keep them up at night.|A stresses the phone's benefits; B stresses one of its costs.|A and B both stress the costs of phones.|A and B disagree about whether phones exist.
  Text A: The dam provides electricity for a million homes. Text B: The dam flooded three villages and forced their people to move.|A presents what the dam provides; B presents what it cost the villagers.|A and B both describe how much electricity the dam provides and how many homes it serves.|B says the dam produces no electricity.
  Text A: Scientists praise the new telescope for its sharp pictures. Text B: The new telescope cost twice what was planned and opened five years late.|A focuses on what the telescope can do; B focuses on its cost and delay.|A and B both focus on its pictures.|A says the telescope opened early.
  Text A: The aqueducts were a marvel of Roman engineering. Text B: Thousands of workers, many of them enslaved, built the aqueducts by hand.|A admires the engineering; B points to the people who did the labor.|A and B both describe how water flowed through the aqueducts into the city.|B says the aqueducts were never built.
  Text A: The town's new skate park is always full of happy kids. Text B: Neighbors of the skate park complain about noise late at night.|A reports the park's popularity; B reports a problem it causes.|A and B both report that neighbors complain about the noise from the park late at night.|B says no one uses the park.
  Text A: The moon landing was a triumph of science and courage. Text B: The moon program cost so much that some people asked whether the money should help the poor instead.|A celebrates the landing; B raises a question about its cost.|A and B both describe the astronauts' training.|B says the landing never happened.
  Text A: The factory brought five hundred jobs to the town. Text B: Since the factory opened, the river below it has turned brown.|A stresses the jobs; B stresses the harm to the river.|A and B both stress the jobs.|A says the factory took jobs away.
  Text A: Ibn Battuta wrote that the markets of Cairo were the richest he had seen. Text B: A modern historian notes that Ibn Battuta's book was written years after his travels, from memory.|A gives the traveler's own impression; B questions how exact his account can be.|A and B both describe the markets of Cairo as the richest the traveler had seen on his journeys.|B says Ibn Battuta never left home.
  Text A: Plastic packaging keeps food fresh for longer. Text B: Much plastic packaging ends up in the sea, where it harms turtles and birds.|A focuses on what plastic does for food; B focuses on what it does to sea life.|A and B both focus on fresh food.|A says plastic spoils food.
  Text A: The coach's speech says the team lost because of bad luck. Text B: The newspaper says the team lost because it missed six easy shots.|A blames luck; B blames the team's own mistakes.|A and B blame the same thing for the loss: the bad luck the team had during the game.|A and B disagree about who won.
  Text A: A tourist guide calls the old quarter charming and full of history. Text B: People who live in the old quarter say the crowds of tourists make it hard to live there.|A presents it as visitors see it; B presents it as residents live it.|A and B both speak for the residents who live in the old quarter and put up with the crowds.|B says no tourists visit the quarter.
  Text A: The new school schedule gives students an hour more sleep. Text B: Under the new schedule, sports practice ends after dark.|A presents a benefit of the schedule; B presents a drawback.|A and B both present drawbacks.|A says students sleep less.
  Text A: The explorer's diary says the river journey was easy. Text B: The guide who led the explorer wrote that they nearly drowned twice.|A plays down the danger; B shows how dangerous it was.|A and B describe the journey the same way, as an easy trip down a calm and gentle river.|B says they never reached the river.
  Text A: The ad says the electric car never needs fuel. Text B: A consumer magazine points out that the car's battery must be charged every two hundred miles.|A leaves out a limit that B points out.|A and B both point out the limit.|B says the car runs on gasoline.
  Text A: The printing press spread new ideas across Europe. Text B: Some rulers feared the printing press and burned books they disliked.|A shows how the press spread ideas; B shows how some tried to stop them.|A and B both describe the books that rulers burned because they feared the new ideas.|A says the press slowed down new ideas.
  Text A: The team's website says the stadium will make the city rich. Text B: An economist says most cities lose money on new stadiums.|A is hopeful about the stadium; B doubts it will pay off.|A and B are equally doubtful.|B says the city has no stadium.
  Text A: A fisherman says the bay has fewer fish every year. Text B: Government counts show the number of fish in the bay rising for five years.|A relies on one person's experience; B relies on official counts.|A and B both rely on official counts of the fish that the government made in the bay.|A and B both say the number is rising.
  Text A: The governor's speech calls the new law a victory for families. Text B: A news report explains what the law changes and who will pay for it.|A praises the law; B explains it without taking a side.|A and B both praise the law.|B says the law was not passed.
  Text A: The poem describes the sea as a gentle cradle. Text B: The poem describes the sea as a hungry beast.|A presents the sea as safe and soothing; B presents it as dangerous.|A and B both present the sea as a dangerous, hungry beast that swallows sailors.|A and B are about different subjects.
  Text A: The company says its new phone is the fastest ever made. Text B: A product tester found the phone fast, but its battery died within a day.|A gives only praise; B gives a fuller picture with a weakness.|A and B both point to the battery.|B says the phone is slow.
  Text A: The museum label says the statue was a gift from a foreign king. Text B: A newspaper reports that the statue was taken from its country during a war.|A presents the statue as a gift; B says it was taken.|A and B agree on how the museum got the statue: as a gift sent by a foreign king.|A and B disagree about the statue's size.
  Text A: Supporters say the new bike lanes make streets safer. Text B: Shop owners say the bike lanes took away parking their customers need.|A focuses on safety; B focuses on the cost to shops.|A and B both focus on parking.|B says there are no bike lanes.
  Text A: The textbook says Rome fell in the year 476. Text B: A historian argues that Rome's fall was a slow change over two hundred years.|A gives a single date; B describes a long process.|A and B both describe the fall of Rome as a slow change that took two hundred years.|B says Rome never fell.
  Text A: The headline reads: "Hero Dog Saves Family From Fire." Text B: The fire department's report says the smoke alarm woke the family, and the dog barked too.|A makes the dog the whole story; B gives the alarm the main credit.|A and B give the dog the same credit.|B says there was no fire.
  Text A: The travel blog calls the island a perfect paradise. Text B: A scientist writes that rising seas may cover the island within fifty years.|A shows only its beauty; B warns of a threat to it.|A and B both warn of a threat.|B says the island is not beautiful.
  Text A: The inventor's biography says she worked alone. Text B: Her assistant's letters show that he built many of the parts.|A gives her all the credit; B shows that someone else helped.|A and B give the assistant the same credit.|B says she never invented anything.
`).map(([shown, right, ...wrong]): ChoiceItem => [shown!, right!, wrong]);

/** readingSkillTopics68 are the topics of reading added for grades 6 to 8. */
export const readingSkillTopics68: readonly TopicDef[] = [
  {
    id: "primary-and-secondary-sources",
    title: t("Primary and Secondary Sources", "一手资料和二手资料"),
    summary: t(
      "Who wrote a source, when, and how close they were to the events: and which source fits a question.",
      "资料由谁、在何时写成，作者离事件有多近，以及哪种资料适合回答一个问题。",
    ),
    prerequisites: ["authors-purpose"],
    encompasses: [
      { topic: "authors-purpose", weight: 0.2 },
      { topic: "fact-and-opinion", weight: 0.2 },
    ],
    xp: 10,
    strand: "reading",
    knowledgePoints: [
      point(
        "primary-or-secondary",
        t("Primary or Secondary", "一手还是二手"),
        t(
          "A **primary source** was made by someone who was there, at the time: a diary, a letter, a photograph, a speech, a map drawn on the journey, an object from the period, an interview with a witness. A **secondary source** was made later by someone who studied primary sources: a textbook, an encyclopedia, a documentary, a biography, a history article.\n\nAsk two questions: who made it, and when? A source made at the time by someone involved is primary, even if it is short or simple. A source made afterward to explain the events is secondary, even if it is excellent.",
          "**一手资料**由亲历者在当时制作：日记、信件、照片、演讲、旅途中画的地图、那个时代的物品、对目击者的采访。**二手资料**由研究过一手资料的人后来制作：课本、百科全书、纪录片、传记、历史文章。\n\n问两个问题：谁制作的？什么时候制作的？由当事人在当时制作的资料是一手资料，即使它很短或很简单。事后为解释事件而制作的资料是二手资料，即使它非常出色。",
        ),
        choiceGenerator(
          t("Is this a primary or a secondary source about the event?", "关于这个事件，这是一手资料还是二手资料？"),
          sourceKindBank,
          (right) =>
            t(
              `It is **${right}**. Ask who made it and when: ${right === primary ? "it was made at the time by someone involved." : "it was made later, to explain the events."}`,
              `它是**${right === primary ? "一手资料" : "二手资料"}**。问一问谁在什么时候制作了它：${right === primary ? "它由当事人在当时制作。" : "它是事后为解释事件而制作的。"}`,
            ),
          (wrong) =>
            t(
              `It is not ${wrong}. Look at who made it and when, not at how good or how long it is.`,
              `它不是${wrong === primary ? "一手资料" : "二手资料"}。要看谁在什么时候制作了它，而不是看它好不好、长不长。`,
            ),
        ),
      ),
      point(
        "the-best-source",
        t("The Best Source for a Question", "最适合回答问题的资料"),
        t(
          "Which source is best depends on the question. To learn what something was like for the people there, how they felt or what they saw, a primary source from a witness is best. To learn the big picture, such as why something happened or how common it was, a secondary source that brings together many primary sources is often better than any one of them.\n\nA source made for another purpose, such as an advertisement, a toy or a story made up later, rarely answers a question about what really happened.",
          "哪种资料最好取决于问题。要了解当事人的经历、感受或所见，目击者留下的一手资料最好。要了解全局，比如某事为什么发生、有多普遍，综合了许多一手资料的二手资料往往比其中任何一份都更好。\n\n为其他目的而制作的东西，比如广告、玩具或后来编的故事，很少能回答真实发生了什么的问题。",
        ),
        choiceGenerator(
          t("Which source would best answer the question?", "哪份资料最能回答这个问题？"),
          bestSourceBank,
          (right) =>
            t(
              `**${right}** fits the question: it was made by someone in a position to know the answer.`,
              `**${right}** 适合这个问题：它的作者能够知道答案。`,
            ),
          (wrong) =>
            t(
              `“${wrong}” was made for another purpose, too far from the events, or by someone with no way to know the answer.`,
              `“${wrong}” 是为别的目的制作的，离事件太远，或者作者无从知道答案。`,
            ),
        ),
      ),
    ],
  },
  {
    id: "comparing-texts-on-a-topic",
    title: t("Comparing Texts on One Topic", "比较同一话题的不同文本"),
    summary: t(
      "How two authors present the same events or facts differently: what they agree on, where they conflict, and what each stresses.",
      "两位作者怎样以不同方式呈现同样的事件或事实：哪里一致，哪里矛盾，各自强调什么。",
    ),
    prerequisites: ["citing-textual-evidence", "compare-and-contrast-in-texts"],
    encompasses: [
      { topic: "compare-and-contrast-in-texts", weight: 0.3 },
      { topic: "citing-textual-evidence", weight: 0.2 },
    ],
    xp: 12,
    strand: "reading",
    knowledgePoints: [
      point(
        "agree-or-conflict",
        t("Agree or Conflict", "一致还是矛盾"),
        t(
          "When two texts treat the same topic, compare what each says on the same point. They **agree** when they say the same thing, perhaps in different words. They **conflict** when both cannot be true: one says 1932, the other 1937. Often they simply give **different details** that can both be true: one tells how whales travel, the other how they sing.\n\nA conflict tells you to check a third source, or to ask which of the two is more credible.",
          "两篇文本谈论同一话题时，要比较它们在同一点上说了什么。如果它们说的是同一件事（也许措辞不同），就是**一致**。如果两者不可能同时为真，就是**矛盾**：一个说 1932 年，另一个说 1937 年。它们也常常只是给出**不同的细节**，而这些细节可以同时成立：一个讲鲸怎样迁徙，另一个讲鲸怎样唱歌。\n\n遇到矛盾时，就要查找第三份资料，或者判断两者中哪一个更可信。",
        ),
        choiceGenerator(
          t("How do the two texts relate?", "这两篇文本是什么关系？"),
          agreementBank,
          (right) =>
            t(
              `**${capitalize(right)}.** Compare what each text says on the same point.`,
              `**${zhRelation[right]}**。比较两篇文本在同一点上说了什么。`,
            ),
          (wrong) =>
            t(
              `Not “${wrong}”. Ask whether the texts make the same claim, claims that cannot both be true, or claims about different things.`,
              `不是“${zhRelation[wrong]}”。问一问：两篇文本说的是同一件事、不能同时为真的事，还是不同方面的事？`,
            ),
        ),
      ),
      point(
        "what-each-author-stresses",
        t("What Each Author Stresses", "每位作者强调什么"),
        t(
          "Two authors can report true facts about the same subject and still give readers very different impressions, because each chooses what to include and what to leave out. One account of a new highway tells of the time it saves; another tells of the forest it cut down.\n\nTo compare them, ask of each text: what does it focus on, whose side or experience does it present, and what does it leave out that the other includes?",
          "两位作者可以就同一话题报道真实的事实，却给读者留下截然不同的印象，因为每个人都在选择写什么、不写什么。关于一条新公路，一篇报道讲它节省的时间，另一篇讲它砍掉的森林。\n\n比较时，对每篇文本问：它关注什么？它呈现了谁的立场或经历？它省略了什么，而另一篇写到了？",
        ),
        choiceGenerator(
          t("How do the two authors present the topic differently?", "两位作者呈现这个话题的方式有什么不同？"),
          focusBank,
          (right) => t(`${right} Each author chose different facts to put first.`, `${right} 每位作者选择突出的事实不同。`),
          (wrong) =>
            t(
              `“${wrong}” does not match the texts. Read each one again and ask what it focuses on and what it leaves out.`,
              `“${wrong}” 与两篇文本不符。再读一遍，问问每篇关注什么、省略了什么。`,
            ),
        ),
      ),
    ],
  },
];
