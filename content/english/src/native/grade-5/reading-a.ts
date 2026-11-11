// Grade 5: the reading skills of the first six units: main ideas, sources, experiments, evidence, comparisons,
// quotations, legend and history, connected events, the structures of two texts and several accounts of one event.

import type { TopicDef } from "@ga/content";
import type { ChoiceItem } from "@ga/subject-english";
import { choose, field, type Label, label, rows, topic } from "./kit.ts";

const nth = ["first", "second", "third"] as const;

// Two or more main ideas: ideaA|ideaB|fake|topic sentence A|a1|a2|topic sentence B|b1|b2
const mainIdeaCores = rows(`
  how glaciers form|how glaciers shape the land|why glaciers are good for skiing|Glaciers begin as snow that never melts.|Each winter new snow falls on top of the old snow.|The weight presses the lower layers into hard blue ice.|Once a glacier moves, it changes the land beneath it.|It scrapes valleys into deep U shapes.|It drops piles of rock where its edge melts.
  what an aquifer is|why aquifers can run low|how rivers reach the sea|An aquifer is a layer of rock that holds water underground.|The water fills tiny spaces between grains of sand and gravel.|Wells reach down into these layers to bring the water up.|Aquifers can run low when people take water faster than rain refills them.|Some farms pump water day and night in dry summers.|Rain may need hundreds of years to soak down that far.
  what causes tides|how tides affect life on the shore|how the wind makes waves|Tides are caused mostly by the pull of the moon.|The moon's pull lifts the ocean into a bulge on the side facing it.|As Earth turns, each shore passes through the bulge and the water rises.|Tides shape the lives of plants and animals on the shore.|Crabs hide under wet rocks when the water goes out.|Barnacles close their shells tightly until the tide returns.
  what an estuary is|why estuaries matter to young fish|how ocean water turns into rain|An estuary is a place where a river meets the sea.|There, fresh river water mixes with salty ocean water.|The water is partly salty, which scientists call brackish.|Estuaries are important nurseries for young fish.|Many ocean fish lay their eggs in the calm, shallow water.|Tall grasses hide the young fish from hungry birds.
  what a watershed is|how pollution travels through a watershed|why some rivers freeze in winter|A watershed is all the land that drains into one river.|Rain that falls on a hillside runs downhill into streams.|The streams join and flow into the same river.|Pollution on any part of a watershed can reach the river.|Oil spilled in a parking lot washes into a storm drain.|Fertilizer from a far-off farm can flow down a small creek.
  why the ocean is salty|how salt water helps things float|why fresh water is safe to drink|The ocean is salty because rivers carry salt into it.|Rain wears away rocks and picks up tiny bits of salt.|When ocean water evaporates, the salt stays behind.|Salty water helps things float more easily.|Swimmers float higher in the sea than in a lake.|In the very salty Dead Sea, people can float while reading.
  how little of Earth's water is fresh|where most fresh water is stored|how much water a family uses|Only a small share of Earth's water is fresh.|About ninety-seven percent of it is salty ocean water.|Less than three percent is fresh water.|Most fresh water is locked away where people cannot easily use it.|Much of it is frozen in the ice of Antarctica and Greenland.|Much of the rest lies deep underground.
  how rivers carry soil and sand|how rivers build new land|why rivers flood after storms|Rivers carry huge amounts of soil and sand.|Fast water picks up sand from the riverbed.|After a storm, a river can turn brown with mud.|Rivers also build new land where they slow down.|Where a river reaches the sea, it drops its sand in a fan called a delta.|Floods spread rich mud across fields beside the river.
  how a city cleans its water|why clean water matters for health|how dams make electricity|Before it reaches a faucet, a city's water is cleaned in several steps.|First, the water passes through layers of sand that trap dirt.|Then a small amount of chlorine kills germs.|Clean water keeps people healthy.|Dirty water can carry germs that cause stomach illness.|Since cities began cleaning their water, far fewer people catch cholera.
  how icebergs form|why icebergs are dangerous to ships|how penguins find their food|Icebergs form when large pieces break off glaciers.|Where a glacier reaches the sea, cracks grow in its edge.|Huge blocks split off and crash into the water.|Icebergs can be dangerous to ships.|Most of an iceberg is hidden below the waterline.|In 1912 the Titanic sank after striking one at night.
  what causes a drought|how people save water in a drought|how rain clouds form|A drought happens when an area gets far less rain than usual.|Sometimes winds push storms away from a region for months.|Hot weather dries the soil even faster.|In a drought, people find ways to save water.|Families take shorter showers and fix leaking taps.|Towns ask people not to water their lawns.
  how wetlands soak up floods|how wetlands clean water|why deserts get little rain|Wetlands act like sponges during floods.|Their soft soil and plants soak up extra rainwater.|They then let the water go slowly over many days.|Wetlands also help clean water.|Plant roots trap mud and some kinds of pollution.|Water that flows out of a marsh is often clearer than water that flows in.
  how much of the body is water|how the body loses water|why plants need sunlight|Much of the human body is made of water.|Water makes up more than half of an adult's weight.|Blood is mostly water.|The body loses water all day long.|People sweat when they are hot or busy.|Each breath out carries a little water vapor.
  how mountain snow stores water|how melting snow fills rivers|how avalanches start|Mountain snow stores water through the winter.|Layer after layer of snow builds up on high slopes.|The cold keeps the water frozen for months.|In spring, the melting snow fills the rivers below.|Streams swell as the sun warms the slopes.|Cities downstream rely on this water in summer.
  how springs form|why spring water is often clean|how geysers shoot out steam|A spring forms where groundwater flows out of the ground.|Water seeps down until it reaches a layer of solid rock.|It then moves sideways and comes out on a hillside.|Spring water is often clean.|On its way down, it passes through sand and gravel that filter it.|It is kept away from the dirt and germs at the surface.
`);
const twoParagraphs = (r: readonly string[], flip: boolean) => {
  const a = `${field(r, 3)} ${field(r, 4)} ${field(r, 5)}`;
  const b = `${field(r, 6)} ${field(r, 7)} ${field(r, 8)}`;
  return flip ? `${b}\n\n${a}` : `${a}\n\n${b}`;
};
const mainIdeaItems: ChoiceItem[] = mainIdeaCores.flatMap((r) =>
  [false, true].map((flip): ChoiceItem => {
    const [a, b, fake] = [field(r, 0), field(r, 1), field(r, 2)];
    return [twoParagraphs(r, flip), `${a} and ${b}`, [`${a} and ${fake}`, `${fake} and ${b}`]];
  }),
);
const detailItems: ChoiceItem[] = mainIdeaCores.flatMap((r) => {
  const text = twoParagraphs(r, false);
  const [a, b, fake] = [field(r, 0), field(r, 1), field(r, 2)];
  return [
    [`${text}\n\nWhich main idea does this detail support? *${field(r, 4)}*`, a, [b, fake]],
    [`${text}\n\nWhich main idea does this detail support? *${field(r, 5)}*`, a, [b, fake]],
    [`${text}\n\nWhich main idea does this detail support? *${field(r, 7)}*`, b, [a, fake]],
    [`${text}\n\nWhich main idea does this detail support? *${field(r, 8)}*`, b, [a, fake]],
  ];
});

const twoMainIdeas = topic("reading", {
  id: "two-main-ideas",
  title: ["Two or More Main Ideas", "两个或更多的主要观点"],
  summary: [
    "A longer text can have two or more main ideas, each with its own key details.",
    "较长的文章可以有两个或更多的主要观点，每个观点都有自己的关键细节。",
  ],
  after: ["supporting-details"],
  points: [
    choose(
      "choosing-the-main-ideas",
      ["Choosing the Main Ideas", "选出主要观点"],
      [
        "A short paragraph often has one main idea, but a longer text can have **two or more**. Each main idea usually gets its own paragraph or part, with key details that explain it. To find them, ask what each part is mostly about. A main idea that no part of the text explains is not one of its main ideas, however interesting it sounds.",
        "一个短段落通常只有一个主要观点，但较长的文章可以有**两个或更多**。每个主要观点通常有自己的段落或部分，并有解释它的关键细节。要找出它们，就问问每一部分主要讲什么。文章中没有任何部分解释的观点，不管听起来多有趣，都不是它的主要观点。",
      ],
      ["What are the two main ideas of this text?", "这篇文章的两个主要观点是什么？"],
      mainIdeaItems,
      (right) => [
        `Each paragraph explains one idea with its details, so the main ideas are **${right}**.`,
        `每个段落用细节解释一个观点，所以主要观点是 **${right}**。`,
      ],
      [
        ["*{wrong}* includes an idea that no paragraph of the text explains.", "*{wrong}* 包含了一个文章中没有段落解释的观点。"],
        [
          "*{wrong}* includes an idea the text never discusses, and leaves out one it does.",
          "*{wrong}* 包含了文章没有讨论的观点，又漏掉了文章讨论的观点。",
        ],
      ],
    ),
    choose(
      "matching-details-to-main-ideas",
      ["Matching Details to Main Ideas", "把细节与主要观点对应"],
      [
        "Every key detail supports one of the main ideas. To match a detail, ask which idea it helps explain: a detail about snow pressing into ice explains how glaciers form, not how they shape the land. Details that sit in one paragraph usually support that paragraph's main idea.",
        "每个关键细节都支持其中一个主要观点。要对应细节，就问它帮助解释的是哪个观点：雪被压成冰的细节解释的是冰川如何形成，而不是冰川如何塑造地貌。同一段落里的细节通常支持那个段落的主要观点。",
      ],
      ["Which main idea does the detail support?", "这个细节支持哪个主要观点？"],
      detailItems,
      (right) => [
        `The detail helps explain **${right}**, the main idea of the paragraph it belongs to.`,
        `这个细节帮助解释 **${right}**，也就是它所在段落的主要观点。`,
      ],
      [
        [
          "*{wrong}* is the other main idea; this detail sits with and explains **{right}**.",
          "*{wrong}* 是另一个主要观点；这个细节解释的是 **{right}**。",
        ],
        ["*{wrong}* is not a main idea of the text at all.", "*{wrong}* 根本不是这篇文章的主要观点。"],
      ],
    ),
  ],
});

// Finding answers in several sources: three sources, then three questions for one source and three for two.
const sourceSets = rows(`
  Great Lakes Facts (a reference book)|Lake Superior is 406 meters deep at its deepest point. It holds about ten percent of the world's fresh surface water.|Lakes of Asia (a website)|Lake Baikal is 1,642 meters deep. It is more than 25 million years old.|Africa's Waters (a magazine article)|Lake Victoria is only 84 meters deep. Fishers there catch tilapia and Nile perch.|What share of the world's fresh surface water is in Lake Superior?|How old is Lake Baikal?|What fish are caught in Lake Victoria?|Is Lake Baikal deeper than Lake Superior?|How much deeper is Lake Baikal than Lake Victoria?|Which is deeper, Lake Superior or Lake Victoria?
  Rivers of the World (a reference book)|The Nile is about 6,650 kilometers long. It flows north into the Mediterranean Sea.|The Amazon Basin (a website)|The Amazon is about 6,400 kilometers long. Pink river dolphins live in its waters.|China's Great Rivers (a magazine article)|The Yangtze is about 6,300 kilometers long. The Three Gorges Dam crosses it.|Which sea does the Nile flow into?|What dolphins live in the Amazon?|What dam crosses the Yangtze?|Which is longer, the Nile or the Amazon?|Which is longer, the Amazon or the Yangtze?|How much longer is the Nile than the Yangtze?
  Falls of Venezuela (a travel guide)|Angel Falls drops 979 meters. Visitors reach it by boat and on foot.|Niagara Today (a website)|Niagara Falls drops about 51 meters. Millions of tourists visit it each year.|Wonders of Africa (a book)|Victoria Falls drops about 108 meters. Its spray can be seen from 50 kilometers away.|How do visitors reach Angel Falls?|How many tourists visit Niagara Falls each year?|How far away can the spray of Victoria Falls be seen?|Which drops farther, Angel Falls or Niagara Falls?|Which drops farther, Niagara Falls or Victoria Falls?|Which drops farther, Angel Falls or Victoria Falls?
  Saving Water at Home (a booklet)|A five-minute shower uses about 40 liters of water. A leaking tap can waste 20 liters a day.|Water Around the World (a website)|A person in Canada uses about 330 liters of water a day at home. A person in Kenya uses about 50 liters.|Our School's Water Audit (a class survey)|Our school uses about 9,000 liters of water a day. Most of it flushes toilets.|How much water does a leaking tap waste in a day?|How much water does a person in Kenya use at home each day?|What uses most of the school's water?|Does a person in Kenya use more water in a day than a five-minute shower uses?|Does our school use more water in a day than 25 people in Canada use at home?|How many five-minute showers equal the water our school uses in a day?
  The Pacific (an encyclopedia entry)|The Pacific is the largest ocean. Its deepest point, the Challenger Deep, is about 10,900 meters down.|The Atlantic (a website)|The Atlantic is the second largest ocean. Its deepest point is about 8,400 meters down.|The Arctic (a magazine article)|The Arctic's deepest point is about 5,500 meters down. Much of it is covered with sea ice all year.|What is the deepest point of the Pacific called?|Which ocean is the second largest?|What covers much of the Arctic all year?|How much deeper is the deepest point of the Pacific than that of the Atlantic?|Which goes deeper, the Atlantic or the Arctic?|Is the Arctic's deepest point deeper than the Pacific's?
  Rain Around the World (a reference book)|Mawsynram in India gets about 11,800 millimeters of rain a year. Most of it falls in the summer monsoon.|Desert Lands (a website)|Arica in Chile gets less than 1 millimeter of rain a year. Some years no rain falls there at all.|Our Town's Weather (a newspaper page)|Our town gets about 900 millimeters of rain a year. The wettest month is October.|When does most of Mawsynram's rain fall?|Are there years with no rain at all in Arica?|What is our town's wettest month?|Which place gets more rain, Mawsynram or Arica?|Does our town get more rain than Arica?|About how many times more rain does Mawsynram get than our town?
  Antarctica (an encyclopedia entry)|The ice sheet of Antarctica is up to 4,800 meters thick. It holds most of the world's fresh water.|Greenland (a website)|Greenland's ice sheet is up to 3,000 meters thick. Some of it melts into the sea each summer.|Glaciers of the Alps (a magazine article)|The Aletsch Glacier is about 900 meters thick at its deepest. It has shrunk by more than three kilometers since 1870.|What does Antarctica's ice sheet hold most of?|What happens to some of Greenland's ice each summer?|How much has the Aletsch Glacier shrunk since 1870?|Which ice sheet is thicker, Antarctica's or Greenland's?|Which is thicker, Greenland's ice sheet or the Aletsch Glacier?|Which is thicker, Antarctica's ice sheet or the Aletsch Glacier?
  Plastic and the Sea (a website)|About eight million tons of plastic enter the ocean each year. A plastic bottle can last 450 years in the sea.|Recycling Facts (a booklet)|Recycling one bottle saves enough energy to light a bulb for three hours. Only about one bottle in three is recycled.|Beach Cleanup Report (a club newsletter)|Our club picked up 1,200 bottles on the beach in May. Bottle caps were the most common thing we found.|How long can a plastic bottle last in the sea?|What share of bottles is recycled?|What was the most common thing found at the cleanup?|How long could a bottle that is not recycled last in the sea?|For how many hours could the energy saved by recycling the club's bottles light a bulb?|How long could the bottles the club found have lasted in the sea?
  Ocean Giants (a book)|The blue whale can grow to 30 meters long. It eats tiny shrimp called krill.|Sharks (a website)|The whale shark can grow to 18 meters long. It is a fish, not a whale.|River Giants (a television guide)|The beluga sturgeon can grow to 7 meters long. It lives in the Caspian Sea and the rivers that flow into it.|What does the blue whale eat?|Is the whale shark a fish or a whale?|Where does the beluga sturgeon live?|Which grows longer, the blue whale or the whale shark?|Which grows longer, the whale shark or the beluga sturgeon?|How much longer can a blue whale grow than a beluga sturgeon?
  The Flood of 1993 (a newspaper from 1993)|The Mississippi River flooded parts of nine states that summer. About 50,000 homes were damaged.|Levees (a website)|A levee is a wall of earth built along a river to hold back floods. More than 1,000 levees failed in 1993.|Grandpa's Flood Story (an interview)|Grandpa says the water reached the top of his porch in July 1993. His family stayed with neighbors for a month.|How many states flooded in 1993?|What is a levee?|How long did Grandpa's family stay with neighbors?|How many levees failed in the flood that damaged about 50,000 homes?|How many levees failed in the summer the water reached Grandpa's porch?|Which river probably reached the top of Grandpa's porch?
`);
const sourcesText = (r: readonly string[]) =>
  [0, 1, 2].map((i) => `Source ${i + 1}, *${field(r, i * 2).replace(" (", "* (")}: ${field(r, i * 2 + 1)}`).join("\n\n");
const sourceNames = ["Source 1", "Source 2", "Source 3"];
const pairNames = ["Sources 1 and 2", "Sources 2 and 3", "Sources 1 and 3"];
const oneSourceItems: ChoiceItem[] = sourceSets.flatMap((r) =>
  [0, 1, 2].map((i): ChoiceItem => {
    const others = sourceNames.filter((_, k) => k !== i);
    return [`${sourcesText(r)}\n\nQuestion: ${field(r, 6 + i)}`, sourceNames[i] ?? "", [others[0] ?? "", others[1] ?? ""]];
  }),
);
const twoSourceItems: ChoiceItem[] = sourceSets.flatMap((r) =>
  [0, 1, 2].map((i): ChoiceItem => {
    const others = pairNames.filter((_, k) => k !== i);
    return [`${sourcesText(r)}\n\nQuestion: ${field(r, 9 + i)}`, pairNames[i] ?? "", [others[0] ?? "", others[1] ?? ""]];
  }),
);

const severalSources = topic("reading", {
  id: "finding-answers-in-several-sources",
  title: ["Finding Answers in Several Sources", "在多个来源中寻找答案"],
  summary: [
    "A research question is answered by scanning several short sources and picking the one that holds each fact.",
    "研究问题的答案要通过浏览多个简短的来源，并找出每个事实所在的来源来获得。",
  ],
  after: ["skimming-and-scanning", "combining-information-from-two-texts"],
  points: [
    choose(
      "the-source-that-answers",
      ["The Source That Answers", "能回答问题的来源"],
      [
        "When you research, you rarely read every source from start to end. First pick out the **key words** of your question, such as *Lake Baikal* or *how old*. Then scan each source for those words and stop at the one that holds the fact. A source about the right subject may still not hold the fact you need.",
        "做研究时，你很少把每个来源从头读到尾。先找出问题中的**关键词**，例如 *Lake Baikal* 或 *how old*。然后在每个来源中寻找这些词，停在包含所需事实的那一个。一个主题相关的来源，也不一定包含你需要的事实。",
      ],
      ["Which source answers the question?", "哪个来源能回答这个问题？"],
      oneSourceItems,
      (right) => [
        `The key words of the question appear in **${right}**, and it holds the fact that answers it.`,
        `问题的关键词出现在 **${right}** 中，它包含了回答问题的事实。`,
      ],
      [
        ["*{wrong}* is about another subject, so it does not hold this fact.", "*{wrong}* 讲的是另一个主题，所以不包含这个事实。"],
        ["*{wrong}* does not hold the fact; scan for the key words of the question.", "*{wrong}* 不包含这个事实；要寻找问题中的关键词。"],
      ],
    ),
    choose(
      "an-answer-that-needs-two-sources",
      ["An Answer That Needs Two Sources", "需要两个来源的答案"],
      [
        "Some questions need facts from **two sources** put together. To compare the depths of two lakes, you need the depth of each, and each may be in a different source. Find the two things the question names, find the source for each, and then combine the facts to answer.",
        "有些问题需要把**两个来源**的事实结合起来。要比较两个湖的深度，你需要每个湖的深度，而它们可能在不同的来源中。找出问题提到的两样东西，分别找到它们的来源，再把事实结合起来回答。",
      ],
      ["Which sources together answer the question?", "哪两个来源合起来能回答这个问题？"],
      twoSourceItems,
      (right) => [
        `The question names two things, and their facts are in **${right}**: the answer combines them.`,
        `问题提到两样东西，它们的事实分别在 **${right}** 中：答案要把它们结合起来。`,
      ],
      [
        ["*{wrong}* includes a source that holds neither fact the question needs.", "*{wrong}* 包含了一个与问题所需事实都无关的来源。"],
        ["*{wrong}* leaves out one of the sources the answer needs.", "*{wrong}* 漏掉了答案需要的一个来源。"],
      ],
    ),
  ],
});

// Reading about an experiment.
const partLabels: Record<string, Label> = {
  "the question": {
    zh: "问题",
    why: ["It asks what the experiment sets out to find out.", "它提出实验要弄清楚的事情。"],
    not: [
      "The question asks what the experiment wants to find out; this sentence does not ask that.",
      "问题提出实验想弄清楚的事；这个句子不是在问这个。",
    ],
  },
  "the method": {
    zh: "方法",
    why: ["It tells a step of what the scientist did, and how.", "它讲述科学家做了什么、怎么做的一个步骤。"],
    not: [
      "The method tells the steps that were followed; this sentence tells something else.",
      "方法讲述所遵循的步骤；这个句子讲的是别的。",
    ],
  },
  "the results": {
    zh: "结果",
    why: ["It tells what happened or what was measured.", "它讲述发生了什么或测量到了什么。"],
    not: ["The results tell what was observed or measured; this sentence does not.", "结果讲述观察或测量到的情况；这个句子不是。"],
  },
  "the conclusion": {
    zh: "结论",
    why: ["It tells what the results show, answering the question.", "它说明结果表明了什么，回答了问题。"],
    not: [
      "The conclusion explains what the results mean; this sentence does not explain that.",
      "结论解释结果意味着什么；这个句子没有解释这一点。",
    ],
  },
};
const partLines = `
  Does salt make ice melt faster?|the question
  We put two ice cubes on two plates and sprinkled salt on one.|the method
  The salted cube melted in 12 minutes and the plain one in 25.|the results
  Salt does make ice melt faster.|the conclusion
  Which dissolves faster in water, sugar or salt?|the question
  We stirred one spoonful of each into cups of water at the same temperature.|the method
  The sugar was gone after 40 seconds, but some salt was still visible after a minute.|the results
  Sugar dissolves faster than salt in water.|the conclusion
  Does a ball bounce higher on wood or on carpet?|the question
  We dropped the same ball from one meter onto each floor five times.|the method
  On wood it bounced an average of 62 centimeters; on carpet, 31.|the results
  A ball bounces higher on a hard floor than on a soft one.|the conclusion
  Does warm water freeze faster than cold water?|the question
  We filled two cups, one with warm water and one with cold, and set them in the freezer.|the method
  The cold water froze first, about twenty minutes before the warm water.|the results
  In our test, cold water froze faster than warm water.|the conclusion
  Do seeds sprout faster in light or in the dark?|the question
  We planted ten bean seeds in each of two trays, one by the window and one in a cupboard.|the method
  After a week, eight seeds had sprouted in the cupboard and seven by the window.|the results
  Light made little difference to how quickly these seeds sprouted.|the conclusion
  Which paper towel soaks up the most water?|the question
  We dipped a square of each brand into a measured cup of water for ten seconds.|the method
  Brand A soaked up 18 milliliters, Brand B 11 and Brand C 15.|the results
  Brand A soaks up the most water of the three.|the conclusion
  Does the shape of a boat change how much it can carry?|the question
  We made a flat boat and a ball from the same amount of clay and added coins one at a time.|the method
  The flat boat held 22 coins, but the ball sank at once.|the results
  A wide, hollow shape helps a boat carry more.|the conclusion
  Does vinegar react with all kinds of rocks?|the question
  We dropped vinegar onto chalk, granite and marble with a dropper.|the method
  The chalk and marble fizzed, but the granite did not change.|the results
  Vinegar reacts with some rocks but not with others.|the conclusion
`;
const conclusionLines = `
  Results: Ice with salt melted in 12 minutes; plain ice melted in 25.|Salt made the ice melt faster.|Salt melts any frozen thing instantly.|Salt slowed the ice down.
  Results: The plant in sunlight grew 9 cm; the plant in the dark grew 2 cm.|This plant grew more in sunlight.|Plants cannot grow at all in the dark.|Darkness helped the plant grow.
  Results: The steel nail rusted in salty water in 3 days and in fresh water in 6.|Salty water made the nail rust faster.|Fresh water stops iron from rusting.|Salt water slowed the rusting down.
  Results: The ball bounced 62 cm on wood and 31 cm on carpet.|The ball bounced higher on wood.|Every ball bounces twice as high on wood.|The carpet made the ball bounce higher.
  Results: Sugar dissolved in 20 seconds in hot water and in 90 seconds in cold water.|Sugar dissolved faster in hot water.|Cold water cannot dissolve sugar.|Cold water dissolved the sugar faster.
  Results: The bread kept in the fridge grew mold after 12 days; the bread on the counter after 5.|Bread molded faster on the counter.|Bread in a fridge never grows mold.|The fridge made the bread mold sooner.
  Results: Seeds watered daily sprouted in 4 days; seeds never watered did not sprout.|These seeds needed water to sprout.|Seeds sprout faster the more water they get.|The dry seeds sprouted first.
  Results: Brand A towel held 18 mL of water, Brand B held 11 mL and Brand C held 15 mL.|Brand A soaked up the most water.|Brand A is the best towel for every job.|Brand B soaked up the most water.
  Results: The clay ball sank at once; the flat clay boat held 22 coins.|The flat shape let the clay float and carry coins.|Any flat object will float on water.|The ball shape helped the clay float.
  Results: Chalk and marble fizzed in vinegar; granite did not change.|Vinegar reacts with chalk and marble but not granite.|Vinegar reacts with every kind of rock.|Granite reacted the most with vinegar.
  Results: A metal spoon in hot water felt hot in 30 seconds; a wooden spoon stayed cool.|Metal carried the heat faster than wood.|Wood can never get hot at all.|The wooden spoon heated up faster.
  Results: The balloon on the warm bottle grew larger; the one on the cold bottle shrank.|Warming made the air in the bottle expand.|Cold air always disappears completely.|Cooling made the air expand.
  Results: Paper airplanes with wide wings flew 6 meters; those with narrow wings flew 4.|The wide-winged planes flew farther.|Wide wings make every plane fly forever.|The narrow-winged planes flew farther.
  Results: The ice cube on black paper melted in 8 minutes; the one on white paper took 14.|The ice melted faster on black paper.|White paper keeps ice frozen for good.|The ice melted faster on white paper.
  Results: Yeast in sugar water made a tall foam; yeast in plain water made almost none.|The yeast made more gas when it had sugar.|Yeast cannot live without sugar at all.|Plain water made the yeast foam more.
  Results: An egg sank in tap water but floated after six spoons of salt were stirred in.|Adding salt made the egg float.|Salt makes everything float.|The salt made the egg sink faster.
  Results: Pennies cleaned in lemon juice shone; pennies in plain water stayed dull.|Lemon juice cleaned the pennies.|Lemon juice cleans every metal perfectly.|Plain water cleaned the pennies best.
  Results: The covered cup lost 2 mL of water in a week; the open cup lost 30 mL.|Covering the cup slowed evaporation.|Covered water never evaporates at all.|Covering the cup sped up evaporation.
  Results: A magnet picked up the steel paper clips but not the aluminum foil.|The magnet attracted steel but not aluminum.|Magnets attract every kind of metal.|The magnet attracted the aluminum best.
  Results: The rubber band stretched 3 cm with one weight and 6 cm with two.|More weight stretched the band farther.|Rubber bands stretch without end.|More weight made the band shorter.
  Results: Milk left out for a day smelled sour; milk kept cold smelled fresh.|Milk spoiled faster when it was warm.|Cold milk can be kept forever.|Cold made the milk spoil faster.
  Results: The candle under a small jar went out in 8 seconds; under a big jar, in 20.|The candle burned longer with more air.|A candle needs no air to burn.|The small jar kept the candle lit longer.
  Results: Water in the dark cup was 18°C; water in the sunny cup reached 27°C.|Sunlight warmed the water.|Sunlight boils water within a day.|The dark cup warmed the water more.
  Results: The soil with worms drained a cup of water in 2 minutes; soil without worms took 6.|Water drained faster through the soil with worms.|Worms make all soil dry out completely.|Water drained faster without worms.
  Results: Celery in blue water had blue streaks after a day; celery in plain water did not.|The celery drew the colored water up its stems.|Celery turns blue in any water.|The plain water turned the celery blue.
  Results: The bike tire at full pressure rolled 40 m; the soft tire rolled 25 m.|The full tire rolled farther.|Soft tires can never roll at all.|The soft tire rolled farther.
  Results: Salt water boiled at 102°C; fresh water boiled at 100°C.|Salt raised the boiling point a little.|Salt water can never boil.|Salt made the water boil cooler.
  Results: The ice in the foam box lasted 5 hours; the ice in a paper bag lasted 1.|The foam box kept the ice cold longer.|Foam keeps ice frozen for a year.|The paper bag kept the ice cold longer.
  Results: Bubbles blown with soap and sugar lasted 40 seconds; plain soap bubbles lasted 10.|Adding sugar made the bubbles last longer.|Sugar makes bubbles that never pop.|Plain soap bubbles lasted longer.
  Results: The seedling turned toward the window within three days.|The seedling grew toward the light.|Plants can see the window clearly.|The seedling grew away from the light.
`;

const readingAnExperiment = topic("reading", {
  id: "reading-about-an-experiment",
  title: ["Reading About an Experiment", "阅读实验报告"],
  summary: ["A report of an experiment gives a question, a method, results and a conclusion.", "实验报告包括问题、方法、结果和结论。"],
  after: ["steps-in-a-procedure", "cause-and-effect-in-texts"],
  points: [
    label(
      "parts-of-an-experiment-report",
      ["The Parts of a Report", "报告的组成部分"],
      [
        "A report of an experiment has four parts. The **question** says what the scientist wants to find out. The **method** tells the steps that were followed. The **results** tell what happened or what was measured, often with numbers. The **conclusion** says what the results show, and it answers the question.",
        "实验报告有四个部分。**问题**说明科学家想弄清楚什么。**方法**讲述所遵循的步骤。**结果**讲述发生了什么或测量到了什么，常常带有数字。**结论**说明结果表明了什么，并回答问题。",
      ],
      ["Which part of an experiment report is this sentence?", "这个句子属于实验报告的哪一部分？"],
      partLines,
      partLabels,
    ),
    choose(
      "the-conclusion-the-results-support",
      ["The Conclusion the Results Support", "结果支持的结论"],
      [
        "A good conclusion says only what the results show. It does not go further than the test: one plant that grew more in sunlight does not prove that no plant grows in the dark. And it never says the opposite of what was measured. Check each conclusion against the numbers.",
        "好的结论只说结果所表明的事。它不会超出实验的范围：一株植物在阳光下长得更好，并不能证明植物在黑暗中都不能生长。结论也绝不会与测量结果相反。要用数字检验每个结论。",
      ],
      ["Which conclusion do these results support?", "这些结果支持哪个结论？"],
      conclusionLines,
      (right) => [
        `**${right}** says just what the measurements show, no more and no less.`,
        `**${right}** 恰好说出了测量结果所表明的事，不多也不少。`,
      ],
      [
        [
          "*{wrong}* goes further than the results: one small test cannot prove something so big.",
          "*{wrong}* 超出了结果的范围：一个小实验无法证明这么大的结论。",
        ],
        ["*{wrong}* says the opposite of what the results show.", "*{wrong}* 说的与结果正好相反。"],
      ],
    ),
  ],
});

// Matching points and evidence: topic|P1|e|e|P2|e|e|P3|e|e
const pointCores = rows(`
  Ice|Water expands when it freezes.|A full glass bottle of water cracked in the freezer.|Ice in a tray filled to the brim rises above the top.|Ice floats on liquid water.|Ice cubes bob at the top of a drink.|In winter, lakes freeze from the top down.|Salt makes ice melt faster.|Salted roads clear of ice sooner than other roads.|In a test, salted ice melted in ten minutes and plain ice in twenty.
  Air|Air has mass.|A ball weighs more after it is pumped full of air.|A balloon full of air tips a balance down.|Air takes up space.|A cup pushed upside down into water stays dry inside.|A balloon grows bigger as air is blown into it.|Warm air rises.|Hot-air balloons float when their air is heated.|The top of a room is warmer than the floor.
  Metals|Metals carry heat well.|A metal spoon in hot soup soon feels hot.|Pots are made of metal so that food cooks evenly.|Metals can be bent without breaking.|A blacksmith hammers iron into horseshoes.|Copper is drawn out into thin wires.|Many metals rust or tarnish in air.|An iron gate left outside turns orange-brown.|Silver spoons slowly turn dark.
  Mixtures|A mixture can be separated by the sizes of its parts.|A sieve catches pebbles while the sand falls through.|A filter holds back coffee grounds and lets the coffee pass.|Some mixtures can be separated with a magnet.|A magnet pulls iron filings out of sand.|Recycling plants use magnets to sort steel cans.|Evaporation separates a dissolved solid from water.|Salt is left in the dish when salty water dries.|Sea salt is made by letting seawater dry in shallow pools.
  Changes of state|Heat turns solids into liquids.|Butter melts in a warm pan.|Chocolate softens in a hot car.|Cooling turns a gas into a liquid.|Drops form on a cold glass on a humid day.|A mirror fogs up after a hot shower.|Boiling turns a liquid into a gas.|A pot left boiling slowly empties.|Steam rises from a kettle.
  Floating and sinking|Oil is less dense than water.|Salad oil floats on top of vinegar.|Oil from a spill spreads across the surface of the sea.|Salt water is denser than fresh water.|An egg sinks in tap water but floats in very salty water.|Swimmers float more easily in the sea.|Objects of the same size can have very different masses.|A cup of sand weighs more than a cup of popcorn.|A brick and a sponge of the same size feel very different in your hand.
  Chemical changes|Cooking can cause a chemical change.|A raw egg turns solid and white in a hot pan.|Toast turns brown and smells different from bread.|Some chemical changes give off a gas.|Baking soda and vinegar fizz when they are mixed.|Bubbles form when an antacid tablet drops into water.|Many chemical changes cannot be undone.|Ash cannot be turned back into wood.|A baked cake cannot be turned back into flour and eggs.
  Dissolving|Sugar dissolves faster in hot water.|Sugar vanished in hot tea in seconds but took minutes in iced tea.|Syrup is made by stirring sugar into boiling water.|Stirring helps things dissolve.|Salt left unstirred sat at the bottom of the glass.|Drink powder mixes quickly when it is shaken in a bottle.|Some things do not dissolve in water.|Sand stays at the bottom however long you stir.|Oil forms drops instead of mixing in.
  Materials|Rubber is elastic.|A rubber band snaps back after it is stretched.|A squeezed rubber ball springs back into shape.|Glass is brittle.|A dropped glass shatters into sharp pieces.|Glass cracks if it is bent even a little.|Wood floats because it is light for its size.|Logs drift down rivers to sawmills.|Wooden rafts carried early sailors.
  Mass|Mass stays the same when ice melts.|A cup of ice weighed 200 grams frozen and 200 grams melted.|A frozen juice pop weighs the same after it thaws in its sealed wrapper.|Dissolved salt is still in the water.|Salty water tastes salty even when the salt cannot be seen.|The water weighs more after the salt is stirred in.|An escaping gas can make mass seem to vanish.|An open bottle of fizzing soda weighs less after an hour.|A sealed bag of baking soda and vinegar weighs the same before and after they fizz.
`);
const pointsOf = (r: readonly string[]) => [field(r, 1), field(r, 4), field(r, 7)];
const evidenceItems: ChoiceItem[] = pointCores.flatMap((r) => {
  const ps = pointsOf(r);
  const intro = `A text about ${field(r, 0).toLowerCase()} makes three points: ${ps.map((p) => `*${p}*`).join(" ")}`;
  return [0, 1, 2].flatMap((p) =>
    [0, 1].map((e): ChoiceItem => {
      const others = ps.filter((_, k) => k !== p);
      return [`${intro}\n\nEvidence: ${field(r, 2 + p * 3 + e)}`, ps[p] ?? "", [others[0] ?? "", others[1] ?? ""]];
    }),
  );
});
const thinItems: ChoiceItem[] = pointCores.flatMap((r) => {
  const ps = pointsOf(r);
  return [0, 1, 2].map((bare): ChoiceItem => {
    const text = ps.map((p, k) => (k === bare ? p : `${p} ${field(r, 2 + k * 3)} ${field(r, 3 + k * 3)}`)).join("\n\n");
    const others = ps.filter((_, k) => k !== bare);
    return [text, ps[bare] ?? "", [others[0] ?? "", others[1] ?? ""]];
  });
});

const pointsAndEvidence = topic("reading", {
  id: "matching-points-and-evidence",
  title: ["Matching Points and Evidence", "把观点与证据对应"],
  summary: [
    "In a longer text each point has its own reasons and evidence, and some evidence supports no point at all.",
    "在较长的文章中，每个观点都有自己的理由和证据，而有些证据并不支持任何观点。",
  ],
  after: ["how-authors-support-points"],
  points: [
    choose(
      "evidence-for-each-point",
      ["Evidence for Each Point", "每个观点的证据"],
      [
        "An author who makes several **points** backs each one with its own **evidence**: facts, examples or results of tests. To match evidence to a point, ask what the evidence shows. A cracked bottle in the freezer shows that water expands when it freezes; it says nothing about whether ice floats. Evidence that shows none of the points does not support the text at all.",
        "提出几个**观点**的作者会用各自的**证据**支持每个观点：事实、例子或实验结果。要把证据和观点对应，就问证据表明了什么。冰箱里冻裂的瓶子表明水结冰时会膨胀，但它与冰是否漂浮毫无关系。不能表明任何观点的证据，对文章根本没有支持作用。",
      ],
      ["Which point does this evidence support?", "这条证据支持哪个观点？"],
      evidenceItems,
      (right) => [`The evidence shows that this is true: **${right}**`, `这条证据表明这一点是正确的：**${right}**`],
      [
        ["The evidence does not show *{wrong}*; it is about something else.", "这条证据并不能表明 *{wrong}*；它讲的是别的事。"],
        ["*{wrong}* is a different point, with evidence of its own.", "*{wrong}* 是另一个观点，有自己的证据。"],
      ],
    ),
    choose(
      "the-point-with-too-little-evidence",
      ["The Point with Too Little Evidence", "证据不足的观点"],
      [
        "As you read, check that every point has evidence behind it. A point that stands alone, with no facts or examples after it, asks the reader to take it on trust. It may be true, but the text has not shown it. A careful reader notices such a point; a careful writer adds evidence to it.",
        "阅读时，要检查每个观点后面是否都有证据。一个孤零零的观点，后面没有任何事实或例子，就是要读者凭信任接受它。它也许是对的，但文章并没有证明它。细心的读者会注意到这样的观点；细心的作者会为它补充证据。",
      ],
      ["Which point of this text has too little evidence?", "这篇文章的哪个观点证据不足？"],
      thinItems,
      (right) => [
        `**${right}** stands alone: no fact or example follows it, while the other points each have two.`,
        `**${right}** 孤零零地出现：后面没有任何事实或例子，而其他观点各有两条。`,
      ],
      [
        ["*{wrong}* is followed by two pieces of evidence.", "*{wrong}* 后面跟着两条证据。"],
        ["*{wrong}* has evidence after it; look for the point with none.", "*{wrong}* 后面有证据；要找没有证据的观点。"],
      ],
    ),
  ],
});

// Comparisons that explain: comparison|what it explains|taken too far|where it stops|another likeness
const comparisonCores = rows(`
  A cell is like a tiny factory.|A cell makes the things it needs.|A cell is run by workers and machines.|A cell grows on its own; no one builds it.|Both take in materials and send out goods.
  The cell membrane is like a guard at a gate.|The membrane lets some things in and keeps others out.|The membrane chooses its friends and enemies.|A guard thinks; the membrane does not.|Both stand at the edge and control what passes.
  The nucleus is like the control room of a cell.|The nucleus directs what the cell does.|The nucleus has buttons and screens inside it.|A control room holds people; a nucleus does not.|Both send out the orders that others follow.
  Bacteria multiply the way a rumor races through a school.|Bacteria can multiply very quickly.|Bacteria pass messages to each other by talking.|A rumor is made of words; bacteria are living cells.|Both start small and soon reach a huge number.
  A virus is like a pirate that takes over a ship.|A virus takes over a cell to make copies of itself.|A virus steals gold from the cells it attacks.|A pirate is alive on its own; a virus is not.|Both seize something that belongs to another.
  White blood cells are like soldiers that defend the body.|White blood cells attack germs that enter the body.|White blood cells wear armor and carry weapons.|Soldiers plan battles; white blood cells do not plan.|Both fight off invaders to protect their home.
  A microscope is like a window into a hidden world.|A microscope lets us see things too small for our eyes.|A microscope can be opened to let in fresh air.|A window shows things as they are; a microscope enlarges them.|Both let us look at something we could not see.
  Yeast is like a tiny baker inside the dough.|Yeast makes the gas that helps bread rise.|Yeast mixes the flour and shapes the loaf.|A baker chooses what to bake; yeast only feeds.|Both play a part in making bread rise.
  Mold spreads across bread like a carpet being rolled out.|Mold covers the surface of bread as it grows.|Mold can be lifted off in one piece and cleaned.|A carpet is laid by someone; mold grows by itself.|Both spread outward until they cover a surface.
  A plant's cell wall is like the walls of a house.|A cell wall gives a plant cell a firm shape.|A cell wall has doors, windows and a roof.|House walls stay put; cell walls grow with the plant.|Both hold their shape and protect what is inside.
  Gut bacteria are like a crew of helpers in a kitchen.|Gut bacteria help break down the food we eat.|Gut bacteria wash the dishes after each meal.|A kitchen crew chooses to help; bacteria do not choose.|Both help turn food into something useful.
  A germ on your hand is like a passenger waiting for a ride.|Germs travel to new places on people's hands.|Germs buy tickets before they travel anywhere.|A passenger chooses a trip; a germ is just carried.|Both are carried from one place to another.
  A vaccine is like a wanted poster for a germ.|A vaccine teaches the body to recognize a germ.|A vaccine shows the body a photograph of the germ.|A poster is read by people; the body learns by itself.|Both help someone spot a danger before it strikes.
  Mitochondria are like batteries that power the cell.|Mitochondria give the cell the energy it uses.|Mitochondria can be taken out and recharged.|A battery runs down; mitochondria keep making energy.|Both supply the power that something else uses.
  A drop of pond water is like a crowded city.|A single drop holds a great many living things.|The creatures in the drop live in tall buildings.|A city is planned; the life in a drop is not.|Both are full of many different living things.
`);
const comparedItems: ChoiceItem[] = rows(`
  A cell is like a tiny factory.|a cell and a factory|a factory and the workers inside it|a cell and the nucleus inside it
  The cell membrane is like a guard at a gate.|the cell membrane and a guard|a guard and the gate he stands at|the membrane and the rest of the cell
  The nucleus is like the control room of a cell.|the nucleus and a control room|a control room and the whole cell|the nucleus and the cell around it
  Bacteria multiply the way a rumor races through a school.|bacteria and a rumor|a rumor and the school it races through|bacteria and the school they live in
  A virus is like a pirate that takes over a ship.|a virus and a pirate|a pirate and the ship he takes over|a virus and the ship it reaches
  White blood cells are like soldiers that defend the body.|white blood cells and soldiers|soldiers and the body they defend|white blood cells and the germs they meet
  A microscope is like a window into a hidden world.|a microscope and a window|a window and the hidden world behind it|a microscope and the eye that looks in
  Yeast is like a tiny baker inside the dough.|yeast and a baker|a baker and the dough he works with|yeast and the dough around it
  Mold spreads across bread like a carpet being rolled out.|mold and a carpet|a carpet and the bread it is rolled on|mold and the bread it covers
  A plant's cell wall is like the walls of a house.|a cell wall and the walls of a house|a house and the plant beside it|a cell wall and the whole plant it holds up
  Gut bacteria are like a crew of helpers in a kitchen.|gut bacteria and a kitchen crew|a kitchen and the food cooked in it|gut bacteria and the food they break down
  A germ on your hand is like a passenger waiting for a ride.|a germ and a passenger|a passenger and the ride he waits for|a germ and the hand it sits on
  A vaccine is like a wanted poster for a germ.|a vaccine and a wanted poster|a poster and the germ shown on it|a vaccine and the germ it teaches about
  Mitochondria are like batteries that power the cell.|mitochondria and batteries|batteries and the cell they power|mitochondria and the cell around them
  A drop of pond water is like a crowded city.|a drop of pond water and a city|a city and the crowds of people in it|a drop and the pond it came from
  The heart pumps blood like a fire engine pumps water through a hose.|the heart and a fire engine|a hose and the water it carries|the heart and the blood it pumps
  A seed is like a packed lunch for a baby plant.|a seed and a packed lunch|a lunch and the baby who eats it|a seed and the plant it grows into
  Roots soak up water like a sponge.|roots and a sponge|a sponge and the water it soaks up|roots and the water in the soil
  The skin is like a raincoat for the body.|the skin and a raincoat|a raincoat and the rain it keeps off|the skin and the body it covers
  A lens bends light the way a slide bends a sledder's path.|a lens and a slide|a slide and the sledder on it|a lens and the light it bends
  Antibodies fit germs like keys fit locks.|antibodies and keys|keys and the locks they fit|antibodies and the germs they fit
  Spores drift on the wind like the seeds of a dandelion.|spores and dandelion seeds|the wind and a dandelion in a field|spores and the wind that carries them
  A sponge's body is full of holes, like a sieve.|a sponge's body and a sieve|a sieve and the holes it is full of|a sponge and the water it lives in
  An amoeba moves like a blob of jelly flowing forward.|an amoeba and a blob of jelly|jelly and the plate it flows across|an amoeba and the water it moves in
  A chloroplast is like a solar panel for a leaf.|a chloroplast and a solar panel|a panel and the sun that shines on it|a chloroplast and the leaf it sits in
  Germs spread through a class like paint drops on a busy floor.|germs and paint drops|paint and the busy floor it drips on|germs and the class they spread through
  A colony of bacteria grows like a town that keeps adding houses.|a colony of bacteria and a town|a town and the houses it keeps adding|bacteria and the houses of a town
  The lungs are like two balloons that fill and empty.|the lungs and balloons|balloons and the air that fills them|the lungs and the chest around them
  A tardigrade is like a tiny tank on eight legs.|a tardigrade and a tank|a tank and the eight legs it rolls on|a tardigrade and the moss it lives in
  Brain cells pass signals like runners in a relay race.|brain cells and relay runners|a race and the runners who run it|brain cells and the signals they pass
`).map((r): ChoiceItem => [field(r, 0), field(r, 1), [field(r, 2), field(r, 3)]]);
const explainItems: ChoiceItem[] = comparisonCores.flatMap((r): ChoiceItem[] => [
  [`${field(r, 0)}\n\nWhat fact does this comparison help explain?`, field(r, 1), [field(r, 3), field(r, 2)]],
  [`${field(r, 0)}\n\nWhere does this comparison stop being true?`, field(r, 3), [field(r, 1), field(r, 4)]],
]);

const comparisonsThatExplain = topic("reading", {
  id: "comparisons-that-explain",
  title: ["Comparisons That Explain", "用来解释的比较"],
  summary: [
    "Science writers explain the very small or the very large by comparing it with something familiar (a cell is like a factory).",
    "科学作者把极小或极大的事物与熟悉的东西相比较来解释它（细胞就像一座工厂）。",
  ],
  after: ["similes-and-metaphors", "compare-and-contrast-in-texts"],
  points: [
    choose(
      "what-is-compared-with-what",
      ["What Is Compared with What", "把什么与什么相比"],
      [
        "Science writers often explain something unfamiliar by comparing it with something the reader knows. The comparison has two sides: the **thing being explained** (a cell, a virus, a vaccine) and the **familiar thing** it is compared with (a factory, a pirate, a poster). Other words in the sentence only fill in the picture.",
        "科学作者常常把陌生的事物与读者熟悉的事物相比较来解释它。比较有两方：**被解释的事物**（细胞、病毒、疫苗）和与之相比的**熟悉事物**（工厂、海盗、海报）。句子中的其他词只是让形象更完整。",
      ],
      ["What two things does this sentence compare?", "这个句子把哪两样东西相比？"],
      comparedItems,
      (right) => [
        `The sentence explains one thing by likening it to a familiar one: it compares **${right}**.`,
        `这个句子把一样东西比作熟悉的事物来解释它：比较的是 **${right}**。`,
      ],
      [
        [
          "*{wrong}* pairs the familiar thing with a detail from its own side, not with the thing being explained.",
          "*{wrong}* 把熟悉的事物与它自己一方的细节配对，而不是与被解释的事物配对。",
        ],
        [
          "*{wrong}* pairs the thing being explained with a detail of its own and leaves out the familiar thing.",
          "*{wrong}* 把被解释的事物与它自己的细节配对，漏掉了作者用来比较的熟悉事物。",
        ],
      ],
    ),
    choose(
      "what-the-comparison-explains-and-its-limits",
      ["What a Comparison Explains, and Its Limits", "比较能解释什么，以及它的局限"],
      [
        "A comparison explains **one likeness**: a cell is like a factory because it makes the things it needs. Pushed too far, a comparison misleads: a cell has no workers or machines. Every comparison **stops being true** somewhere, where the two things differ, and a good reader notices where that is.",
        "比较解释的是**一个相似之处**：细胞像工厂，因为它能制造自己所需的东西。比较推得太远就会误导人：细胞里没有工人和机器。每个比较都会在两样东西不同的地方**不再成立**，好的读者会注意到这一点。",
      ],
      ["Read the comparison and answer the question.", "读这个比较，回答问题。"],
      explainItems,
      (right, shown) =>
        shown.includes("stop being true")
          ? [
              `The two things differ here, so the comparison stops being true: **${right}**`,
              `两样东西在这里不同，所以比较不再成立：**${right}**`,
            ]
          : [`The likeness the comparison points to is this fact: **${right}**`, `这个比较所指的相似之处就是这个事实：**${right}**`],
      [
        [
          "*{wrong}* tells the other side of the comparison: where it holds or where it fails, not what was asked.",
          "*{wrong}* 讲的是比较的另一面，不是问题所问的。",
        ],
        [
          "*{wrong}* takes the comparison too far, or names a likeness rather than a difference.",
          "*{wrong}* 把比较推得太远，或说的是相似之处而不是不同之处。",
        ],
      ],
    ),
  ],
});

// Quoting accurately: intro|q1|q2|q3|inference1|inference2|inference3, then misquotations of each quotation.
const quotePassages = rows(`
  In the 1670s a Dutch cloth seller became one of the first people to see microbes.|Antonie van Leeuwenhoek ground his own lenses, some no bigger than a pinhead.|He wrote that a drop of water was alive with tiny animals, more than he could count.|For fifty years he sent letters about what he saw to scientists in London.|He was patient and skilled with his hands.|He was amazed by how much life the water held.|He wanted other scientists to know about his discoveries.
  Lena slid the glass slide under the lens and held her breath.|She turned the knob slowly, a hair at a time, until the blur sharpened.|"Mr. Diaz, they're moving!" she shouted, nearly knocking over her stool.|Afterward she drew every creature in her notebook and labeled each one.|Lena is careful when she uses the microscope.|Lena is excited by what she sees.|Lena wants to remember exactly what she saw.
  In the 1840s, Dr. Ignaz Semmelweis worked at a hospital in Vienna.|He noticed that more mothers fell ill in the ward where doctors came straight from other work.|He ordered the doctors to wash their hands in a strong solution before every visit.|Even after the deaths fell sharply, many doctors refused to believe him.|Semmelweis looked closely for patterns in who got sick.|Semmelweis believed that something on the doctors' hands spread illness.|Other doctors were slow to accept a new idea.
  Omar left two slices of bread in sealed bags, one on the counter and one in the fridge.|Every morning he checked them before breakfast and wrote down the date.|By day five the counter slice wore a fuzzy green coat, while the cold slice looked almost new.|"So that's why Mom keeps the bread in the fridge," he said.|Omar was careful to record what he saw.|Mold grows faster in warm places than in cold ones.|Omar connected his results to everyday life.
  Louis Pasteur studied why wine and milk went sour.|He showed that tiny living things in the air caused the change.|He heated milk just enough to kill most of them without spoiling the taste.|Today the word "pasteurized" is printed on milk cartons around the world.|Pasteur found that microbes made food go bad.|Pasteur found a way to make milk safer to drink.|Pasteur's work is still used today.
  Grandma opened the packet of yeast and sprinkled it into warm water.|"Not too hot," she warned, "or you'll kill them before they start."|Ten minutes later, a foam of tiny bubbles covered the top of the bowl.|Mia leaned close and sniffed, then wrinkled her nose at the sour smell.|Yeast is alive and can be harmed by heat.|The yeast is giving off a gas.|Mia does not like the smell of the yeast.
  Tardigrades, or water bears, are tiny animals found in moss and pond water.|They can survive being frozen, dried out or even sent into space.|When their home dries up, they curl into a tight ball and wait, sometimes for years.|Under a microscope, they look like chubby bears with eight stubby legs.|Tardigrades are extremely tough.|Tardigrades can stay alive without water for a long time.|Tardigrades got their nickname from the way they look.
  Before the class touched anything, Ms. Park handed out goggles and gloves.|"We never eat or drink in here," she said, pointing to a sign by the door.|When Ben dropped a slide, she swept up the glass herself and wiped the bench twice.|At the end, everyone scrubbed their hands at the sink for twenty seconds.|Ms. Park thinks food in the lab could become contaminated.|Ms. Park treats broken glass as a real danger.|Germs may be left on the students' hands after the lesson.
  In 1928 Alexander Fleming came back from a holiday to a messy lab bench.|On one dish, a blue-green mold had grown, and the bacteria around it had vanished.|Instead of throwing the dish away, he studied it for weeks.|Years later, the mold's juice became penicillin, a medicine that has saved millions of lives.|Something in the mold killed bacteria.|Fleming was curious about the unexpected result.|Fleming's discovery became very important to medicine.
  Kira sneezed into her elbow and pushed the tissue box across the table.|"Don't sit too close," she told her little brother, "or you'll catch it."|She had already washed her hands three times since lunch.|Still, she grinned when he slid a get-well card under her door.|Kira knows that colds spread from person to person.|Kira is trying hard not to spread germs.|Kira is cheered up by her brother's kindness.
`);
const misquotes = rows(`
  Antonie van Leeuwenhoek ground his own lenses, some no bigger than a pea.|Antonie van Leeuwenhoek ground his lenses, some no bigger than a pinhead.
  He wrote that a drop of water was alive with tiny animals, more than he could see.|He wrote that a drop of water was full of tiny animals, more than he could count.
  For forty years he sent letters about what he saw to scientists in London.|For fifty years he sent letters about what he saw to scientists in Paris.
  She turned the knob quickly, a hair at a time, until the blur sharpened.|She turned the knob slowly, bit by bit, until the blur sharpened.
  "Mr. Diaz, they're alive!" she shouted, nearly knocking over her stool.|"Mr. Diaz, they're moving!" she said, nearly knocking over her stool.
  Afterward she drew every creature in her notebook and named each one.|Afterward she drew each creature in her notebook and labeled them all.
  He noticed that more mothers fell ill in the ward where nurses came straight from other work.|He noticed that more mothers fell ill in the ward where doctors came from other work.
  He asked the doctors to wash their hands in a strong solution before every visit.|He ordered the doctors to wash their hands in soap before every visit.
  Even after the deaths fell sharply, most doctors refused to believe him.|Even after the deaths fell, many doctors refused to listen to him.
  Every morning he checked them after breakfast and wrote down the date.|Every morning he checked them before breakfast and wrote down the time.
  By day five the counter slice wore a fuzzy gray coat, while the cold slice looked almost new.|By day four the counter slice wore a fuzzy green coat, while the cold slice looked new.
  "So that's why Dad keeps the bread in the fridge," he said.|"So that's why Mom keeps bread in the fridge," he whispered.
  He showed that tiny living things in the water caused the change.|He proved that tiny living things in the air caused the change.
  He heated milk just enough to kill all of them without spoiling the taste.|He boiled milk just enough to kill most of them without spoiling the taste.
  Today the word "pasteurized" is printed on milk bottles around the world.|Today the word "pasteurized" is printed on milk cartons in many countries.
  "Not too cold," she warned, "or you'll kill them before they start."|"Not too hot," she said, "or you'll hurt them before they start."
  Ten minutes later, a foam of tiny bubbles covered the whole bowl.|Five minutes later, a foam of tiny bubbles covered the top of the bowl.
  Mia leaned close and sniffed, then wrinkled her nose at the sweet smell.|Mia leaned close and sniffed, then held her nose at the sour smell.
  They can survive being frozen, boiled or even sent into space.|They can survive being frozen, dried out or even sent to the moon.
  When their home dries up, they curl into a tight ball and sleep, sometimes for years.|When their home dries up, they curl into a ball and wait, sometimes for months.
  Under a microscope, they look like chubby bears with six stubby legs.|Under a microscope, they look like little bears with eight stubby legs.
  "We never eat or drink in here," she said, pointing to a poster by the door.|"We never eat in here," she said, pointing to a sign by the door.
  When Ben dropped a slide, she swept up the glass herself and wiped the bench once.|When Ben broke a slide, she swept up the glass and wiped the bench twice.
  At the end, everyone washed their hands at the sink for ten seconds.|At the end, everyone scrubbed their hands at the sink for a minute.
  On one dish, a green mold had grown, and the bacteria around it had multiplied.|On one dish, a blue-green mold had grown, and the bacteria near it had died.
  Instead of throwing the dish away, he studied it for days.|Instead of cleaning the dish, he studied it for weeks.
  Years later, the mold's juice became penicillin, a medicine that has saved thousands of lives.|Years later, the mold became penicillin, a medicine that has saved millions of lives.
  "Don't sit so close," she told her little sister, "or you'll catch it."|"Don't sit too close," she told her brother, "or you'll get it."
  She had already washed her hands twice since lunch.|She had already washed her hands three times since breakfast.
  Still, she grinned when he slid a get-well note under her door.|Still, she smiled when he slid a get-well card under the door.
`);
const quote = (s: string) => `"${s.replaceAll('"', "'")}"`;
const passageText = (r: readonly string[]) => [0, 1, 2, 3].map((i) => field(r, i)).join(" ");
const supportItems: ChoiceItem[] = quotePassages.flatMap((r) =>
  [0, 1, 2].map((i): ChoiceItem => {
    const others = [1, 2, 3].filter((k) => k !== i + 1).map((k) => quote(field(r, k)));
    return [`${passageText(r)}\n\nInference: ${field(r, 4 + i)}`, quote(field(r, i + 1)), [others[0] ?? "", others[1] ?? ""]];
  }),
);
const exactItems: ChoiceItem[] = quotePassages.flatMap((r, p) =>
  [0, 1, 2].map((i): ChoiceItem => {
    const m = misquotes[p * 3 + i] ?? [];
    return [
      `${passageText(r)}\n\nWhich quotes the ${nth[i]} sentence after the opening one exactly?`,
      quote(field(r, i + 1)),
      [quote(field(m, 0)), quote(field(m, 1))],
    ];
  }),
);

const quotingAccurately = topic("reading", {
  id: "quoting-accurately",
  title: ["Quoting Accurately", "准确地引用"],
  summary: [
    "To explain what a text says or to support an inference, a reader quotes its exact words.",
    "为了解释文章说了什么或支持一个推断，读者要引用文章的原话。",
  ],
  after: ["making-inferences", "quotation-marks-for-quotations"],
  points: [
    choose(
      "the-quotation-that-supports-an-inference",
      ["The Quotation That Supports an Inference", "支持推断的引文"],
      [
        "An **inference** is something a reader works out from clues in a text. To show that it is fair, the reader **quotes** the words that led to it. The right quotation is the one that gives a reason to believe the inference: *She turned the knob slowly, a hair at a time* shows that Lena is careful; a sentence about her shout does not.",
        "**推断**是读者根据文章中的线索推想出来的结论。为了表明推断合理，读者要**引用**导出这个推断的话。正确的引文要能为相信这个推断提供理由：*She turned the knob slowly, a hair at a time* 表明 Lena 很细心；而讲她大喊的句子则不能。",
      ],
      ["Which quotation best supports the inference?", "哪句引文最能支持这个推断？"],
      supportItems,
      (right) => [
        `The words ${right} give the reason to believe the inference, so they are the quotation to use.`,
        `${right} 这些话为相信这个推断提供了理由，所以应该引用它。`,
      ],
      [
        ["*{wrong}* is from the text but gives no reason to believe this inference.", "*{wrong}* 出自文章，但不能为这个推断提供理由。"],
        ["*{wrong}* supports a different inference about the text.", "*{wrong}* 支持的是关于文章的另一个推断。"],
      ],
    ),
    choose(
      "an-exact-quotation",
      ["An Exact Quotation", "准确的引文"],
      [
        "Words inside quotation marks must be **exactly** the words of the text: every word, in the same order. Changing one word (*slowly* to *quickly*), dropping one or adding one turns a quotation into a **misquotation**, and it may change the meaning. Before you quote, check your words against the text one by one.",
        "引号里的话必须**完全**是原文的话：每个词都一样，顺序也一样。改动一个词（把 *slowly* 改成 *quickly*）、删掉一个词或加上一个词，都会让引文变成**错误引用**，还可能改变意思。引用之前，要把你写的话与原文逐词核对。",
      ],
      ["Which is an exact quotation of the text?", "哪一句准确地引用了原文？"],
      exactItems,
      (right) => [`Word for word, ${right} matches the text.`, `${right} 与原文逐字相符。`],
      [
        ["*{wrong}* changes a word of the text, so it is a misquotation.", "*{wrong}* 改动了原文的一个词，所以是错误引用。"],
        ["*{wrong}* changes, drops or adds a word, so it is not exact.", "*{wrong}* 改动、删掉或加上了词，所以不准确。"],
      ],
    ),
  ],
});

// Legend or history.
const sourceLabels: Record<string, Label> = {
  "a legend": {
    zh: "传说",
    why: [
      "It is a story people told about the past, with gods, heroes or wonders no evidence can show.",
      "这是人们讲述的关于过去的故事，其中的神、英雄或奇迹没有证据能证明。",
    ],
    not: [
      "A legend is a story with gods, heroes or wonders; this statement rests on evidence.",
      "传说是有神、英雄或奇迹的故事；这个说法有证据支持。",
    ],
  },
  "evidence from objects or ruins": {
    zh: "来自实物或遗迹的证据",
    why: ["It rests on things people made that we can still find and study.", "它基于人们制造的、我们至今仍能找到和研究的东西。"],
    not: ["This statement does not rest on objects or ruins that can be studied.", "这个说法并不基于可以研究的实物或遗迹。"],
  },
  "evidence from old writing": {
    zh: "来自古代文字的证据",
    why: ["It rests on words written at the time that we can still read.", "它基于当时写下、我们至今仍能读到的文字。"],
    not: ["This statement does not rest on words written at the time.", "这个说法并不基于当时写下的文字。"],
  },
};
const legendLines = `
  The goddess Athena won the city of Athens by giving it the first olive tree.|a legend
  Zeus threw thunderbolts from the top of Mount Olympus.|a legend
  The hero Theseus killed the Minotaur in a maze on Crete.|a legend
  Hercules held up the sky for the giant Atlas.|a legend
  A winged horse named Pegasus sprang from the blood of Medusa.|a legend
  The god Poseidon struck a rock and made a spring of salt water.|a legend
  Achilles could be hurt only on his heel.|a legend
  The Trojans pulled a giant wooden horse full of soldiers into their city.|a legend
  King Midas turned everything he touched into gold.|a legend
  Prometheus stole fire from the gods and gave it to people.|a legend
  Pandora opened a jar and let every trouble out into the world.|a legend
  Archaeologists found the stone seats of a theater that held 17,000 people.|evidence from objects or ruins
  Painted pots show athletes running and throwing the discus.|evidence from objects or ruins
  Bronze helmets dug up near Marathon match those worn by Greek soldiers.|evidence from objects or ruins
  Broken pieces of pottery scratched with names were used to vote a leader out of Athens.|evidence from objects or ruins
  The columns of the Parthenon still stand on the Acropolis.|evidence from objects or ruins
  Coins stamped with an owl show that Athens made its own money.|evidence from objects or ruins
  Divers found a Greek shipwreck carrying hundreds of jars of wine.|evidence from objects or ruins
  A stone track at Olympia shows where the footraces were run.|evidence from objects or ruins
  Ruins of houses at Olynthus show rooms built around open courtyards.|evidence from objects or ruins
  A bronze gear box found in a shipwreck tracked the movements of the moon.|evidence from objects or ruins
  The historian Herodotus wrote down what Persians and Greeks told him about their war.|evidence from old writing
  Plato's books record the questions his teacher Socrates asked.|evidence from old writing
  Lists carved in stone name the winners of the Olympic Games.|evidence from old writing
  Laws carved on a wall at Gortyn tell how property was divided.|evidence from old writing
  Thucydides wrote a history of the war between Athens and Sparta, in which he fought.|evidence from old writing
  A letter on papyrus tells a Greek soldier's mother that he is well.|evidence from old writing
  The speeches of Demosthenes warned Athens about the king of Macedon.|evidence from old writing
  Aristotle wrote notes on hundreds of animals he studied.|evidence from old writing
  Plays by Sophocles were written down and are still performed.|evidence from old writing
  Records carved in stone list how much the Parthenon's builders were paid.|evidence from old writing
`;
const historianLines = `
  A historian wants to know what Greek houses looked like.|the ruins of houses dug up at Olynthus|a myth about a god who built a palace|a modern film set in ancient Greece
  A historian wants to know who won the Olympic footrace in 480 BCE.|a list of winners carved at Olympia|a legend that Hercules founded the Games|a poem written last year about the Games
  A historian wants to know how Athenians voted a leader out.|pieces of pottery scratched with names|a story about Athena choosing a ruler|a cartoon about Greek elections
  A historian wants to know what Greek soldiers wore.|bronze helmets and armor found in graves|the tale of Achilles and his magic armor|a costume from a school play
  A historian wants to know what Greek children played.|toys and painted pots found in houses|a myth about the childhood of Zeus|a modern novel about a Greek child
  A historian wants to know how big Athens's theater was.|the stone seats still found on the hillside|a legend about Dionysus at the theater|a tourist's guess written in a blog
  A historian wants to know what the Greeks traded by sea.|jars and goods found in a shipwreck|the story of Jason and the Golden Fleece|a painting made in the 1800s
  A historian wants to know what Socrates taught.|the books written by his student Plato|a fable about a wise talking owl|a television show about philosophers
  A historian wants to know what Athenian money looked like.|silver coins stamped with an owl|a myth about the treasure of King Midas|a toy coin from a museum shop
  A historian wants to know how the war with Persia began.|the history Herodotus wrote from what people told him|the legend of the gods taking sides|a video game set in ancient Persia
  A historian wants to know what food the Greeks ate.|seeds and bones found in old kitchens|a story about the food of the gods|a modern Greek cookbook
  A historian wants to know when the Parthenon was built.|stone records of payments to its builders|a legend of Athena guarding the hill|a postcard sold in Athens today
  A historian wants to know how Greek ships were built.|the wreck of a Greek ship on the sea floor|the tale of the ship Argo that could speak|a model ship in a toy shop
  A historian wants to know what laws a Greek city had.|laws carved on a wall at Gortyn|a myth about Zeus giving laws from the sky|a play written about Greek judges last year
  A historian wants to know how the Greeks measured time.|a sundial found in a Greek city|the tale of the god who drives the sun|a modern clock with Greek numbers
  A historian wants to know what Spartan boys learned.|writings by Greeks who visited Sparta|the legend of a Spartan boy and a fox|a comic book about Spartan warriors
  A historian wants to know what Greek temples were painted with.|traces of paint found on old stone|a story about the gods' golden halls|a modern drawing of a white temple
  A historian wants to know how Greeks treated the sick.|the notes of the doctor Hippocrates|a myth about a healing god's snake|an advertisement for a modern clinic
  A historian wants to know what Greek women wore.|painted pots and statues showing their clothes|the tale of the goddess Hera's robes|a costume in a recent film
  A historian wants to know where the Olympic athletes trained.|the ruins of the training ground at Olympia|a legend that heroes trained with gods|a sports magazine article from today
  A historian wants to know how Greeks wrote numbers.|tablets of accounts scratched with numerals|a myth about the god who invented counting|a math textbook printed this year
  A historian wants to know what music the Greeks played.|lyres found in graves and pots showing musicians|the tale of Orpheus charming the rocks|a song about Greece on the radio
  A historian wants to know what the Athenian assembly decided.|decrees carved in stone and set up in the city|a story about Zeus calling the gods together|a movie scene of a noisy meeting
  A historian wants to know how far Greek traders sailed.|Greek pots found in faraway lands|the story of Odysseus's ten-year voyage|a modern map of tourist cruises
  A historian wants to know how the Greeks built columns.|unfinished columns left in old quarries|the legend of a giant who stacked the stones|a drawing in a children's coloring book
  A historian wants to know what Greek schoolchildren wrote.|wax tablets and papyrus with school lessons|a myth about the Muses teaching children|a story written by a student today
  A historian wants to know how the Greeks fought at sea.|the remains of a bronze ram from a warship|the tale of sea monsters fighting ships|a picture book about pirates
  A historian wants to know what Greeks thought about the stars.|the writings of Greek astronomers|the myth of the hunter Orion in the sky|a fortune teller's horoscope
  A historian wants to know how Greek plays were staged.|the ruins of a stage and scripts written down|a legend of a god who loved plays|a school's poster for a play
  A historian wants to know what Greek farmers grew.|old jars that held olive oil and grain|the story of Demeter and the seasons|a farm calendar from this year
`;

const legendOrHistory = topic("reading", {
  id: "legend-or-history",
  title: ["Legend or History", "传说还是历史"],
  summary: [
    "Myths and legends tell stories people believed or told about the past; history uses evidence such as ruins and writing.",
    "神话和传说讲述人们相信或流传的关于过去的故事；历史则使用遗迹和文字等证据。",
  ],
  after: ["historical-fiction-facts-and-inventions"],
  points: [
    label(
      "a-legend-or-evidence",
      ["A Legend or Evidence", "传说还是证据"],
      [
        "The Greeks told **legends** and myths: stories of gods, heroes and wonders that explained their world. These stories tell us what people believed, but not what happened. **History** rests on **evidence**: things people made, such as ruins, coins and pots, and words written at the time, such as laws, letters and histories.",
        "希腊人讲述**传说**和神话：关于神、英雄和奇迹的故事，用来解释他们的世界。这些故事告诉我们人们相信什么，却不能告诉我们发生了什么。**历史**建立在**证据**之上：人们制造的东西，例如遗迹、钱币和陶罐；以及当时写下的文字，例如法律、书信和史书。",
      ],
      ["Where does this statement come from?", "这个说法来自哪里？"],
      legendLines,
      sourceLabels,
    ),
    choose(
      "the-evidence-a-historian-uses",
      ["The Evidence a Historian Uses", "历史学家使用的证据"],
      [
        "A historian answers a question about the past with **evidence from the time**: objects and ruins that survive, and writing from people who lived then. A myth tells what people believed, not what happened; a modern film, book or guess was made long afterward by people who were not there.",
        "历史学家用**当时的证据**回答关于过去的问题：保存下来的实物和遗迹，以及当时的人写下的文字。神话讲的是人们相信什么，而不是发生了什么；现代的电影、书或猜测是很久以后由不在场的人制作的。",
      ],
      ["Which would be the best evidence?", "哪一项是最好的证据？"],
      historianLines,
      (right) => [
        `**${right}** comes from the time itself, so it can show what really happened.`,
        `**${right}** 来自那个时代本身，所以能表明真实发生了什么。`,
      ],
      [
        [
          "*{wrong}* is a legend: it tells what people believed, not what happened.",
          "*{wrong}* 是传说：它讲的是人们相信什么，而不是发生了什么。",
        ],
        ["*{wrong}* was made long afterward by people who were not there.", "*{wrong}* 是很久以后由不在场的人制作的。"],
      ],
    ),
  ],
});

// Connecting events in history.
const linkLabels: Record<string, Label> = {
  "a cause of the first": {
    zh: "第一件事的原因",
    why: ["The second event happened earlier and made the first happen.", "第二件事发生得更早，并导致了第一件事。"],
    not: ["The second event did not make the first one happen.", "第二件事并没有导致第一件事。"],
  },
  "a result of the first": {
    zh: "第一件事的结果",
    why: ["The second event happened because of the first.", "第二件事是因为第一件事才发生的。"],
    not: ["The second event did not happen because of the first.", "第二件事并不是因为第一件事才发生的。"],
  },
  "a comparison with the first": {
    zh: "与第一件事的比较",
    why: [
      "The second event is set beside the first to show how they are alike or different, not that one caused the other.",
      "第二件事与第一件事并列，是为了说明它们的异同，而不是说一件导致了另一件。",
    ],
    not: [
      "The second event is linked to the first by cause, not set beside it for comparison.",
      "第二件事与第一件事是因果关系，而不是并列比较。",
    ],
  },
};
const linkLines = `
  First: Greece had little flat land for farming. Second: Many Greeks became sailors and traders because of it.|a result of the first
  First: Athens built a large fleet. Second: Its ships defeated the Persians at Salamis as a result.|a result of the first
  First: Athens let every citizen vote. Second: Sparta, by contrast, was ruled by two kings and a council.|a comparison with the first
  First: The Greeks founded new cities around the Mediterranean. Second: They did so because their home cities grew crowded.|a cause of the first
  First: The Persian army landed at Marathon. Second: As a result, the Athenians marched out to meet it.|a result of the first
  First: Athenian boys went to school to learn music and letters. Second: Spartan boys, on the other hand, trained to be soldiers from age seven.|a comparison with the first
  First: Athens grew rich and powerful. Second: Its wealth came from silver mines and trade.|a cause of the first
  First: Sparta feared the growing power of Athens. Second: This fear led to a long war between them.|a result of the first
  First: Plague broke out in Athens in 430 BCE. Second: It struck because crowds were packed inside the city walls.|a cause of the first
  First: The Greeks borrowed letters from the Phoenicians. Second: Because of this, they could write down their laws and poems.|a result of the first
  First: Greek cities were often at war with one another. Second: Like them, the cities of the Maya also fought their neighbors.|a comparison with the first
  First: Alexander conquered lands as far as India. Second: Greek ideas spread across Asia as a result.|a result of the first
  First: The Olympic Games stopped wars for a month. Second: The truce existed so that athletes could travel safely.|a cause of the first
  First: Athens was a democracy. Second: Similarly, the Roman Republic let some citizens vote.|a comparison with the first
  First: Athens's silver mines made the city rich. Second: That wealth paid for the Parthenon.|a result of the first
  First: Greek doctors studied the body closely. Second: As a result, they learned that illness had natural causes.|a result of the first
  First: Socrates was put on trial. Second: He was tried because leaders said he was turning the young against the gods.|a cause of the first
  First: Greek temples had rows of columns. Second: Roman temples, in the same way, were built with columns.|a comparison with the first
  First: The Persians burned Athens. Second: The Athenians then rebuilt the Acropolis more grandly than before.|a result of the first
  First: Greece is crossed by mountains. Second: As a result, its cities grew up apart and became separate city-states.|a result of the first
  First: Many Greeks left the mainland to live in Italy. Second: They left because there was not enough farmland at home.|a cause of the first
  First: Athenian women could not vote. Second: Spartan women, unlike them, could own land and run farms.|a comparison with the first
  First: Sparta won the long war in 404 BCE. Second: As a result, Athens lost its fleet and its walls.|a result of the first
  First: Greek scholars wrote down their ideas. Second: Because of that, later peoples could read and build on them.|a result of the first
  First: The Greeks built a great library at Alexandria. Second: It was built because the rulers wanted to collect all the world's books.|a cause of the first
  First: Greek plays were performed outdoors. Second: Plays in China, by comparison, were often performed in temple courtyards.|a comparison with the first
  First: The city-states joined together against Persia. Second: They joined because a huge Persian army had invaded.|a cause of the first
  First: The Romans conquered Greece. Second: Even so, Greek art and ideas spread through the Roman world as a result of the contact.|a result of the first
  First: Athens had an assembly of citizens. Second: Iceland, much later, also had an assembly that met in the open air.|a comparison with the first
  First: The Greeks traded olive oil for grain. Second: They traded because their rocky land grew olives better than wheat.|a cause of the first
`;
const chains = rows(`
  Greece's mountains kept cities apart|each city made its own laws|cities often quarreled with their neighbors|small wars broke out again and again
  Persia invaded Greece|Athens built a great fleet|the fleet won the battle of Salamis|Athens became the leader of many cities
  Athens found rich silver mines|the city grew wealthy|it paid for new temples|the Parthenon rose on the Acropolis
  Greek farmland grew crowded|families sailed off to find new land|Greek cities were founded around the Mediterranean|Greek ideas spread to new lands
  Athens grew powerful|Sparta began to fear it|war broke out between them|both cities were weakened
  plague struck crowded Athens|thousands of people died|the city's army grew smaller|Athens lost battles it might have won
  the Greeks borrowed the Phoenician letters|they added letters for vowels|they began to write down their poems and laws|later peoples could read Greek ideas
  Alexander became king of Macedon|he led his army into Persia|he conquered lands as far as India|Greek language and ideas spread across Asia
  the leader Cleisthenes changed the laws of Athens|ordinary citizens could vote in the assembly|more people took part in decisions|democracy took root in Athens
  the Romans conquered Greece|Romans came to admire Greek art|Roman builders copied Greek temples|Greek styles spread across the Roman world
`);
const chainText = (r: readonly string[]) => {
  const [a, b, c, d] = [field(r, 0), field(r, 1), field(r, 2), field(r, 3)];
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  return `${cap(a)}. Because of this, ${b}. That in turn meant that ${c}. In the end, ${d}.`;
};
const ledItems: ChoiceItem[] = chains.flatMap((r) =>
  [1, 2, 3].map((k): ChoiceItem => {
    const events = [0, 1, 2, 3].map((i) => field(r, i));
    const right = events[k - 1] ?? "";
    const wrongs =
      k === 1 ? [events[2] ?? "", events[3] ?? ""] : k === 2 ? [events[0] ?? "", events[3] ?? ""] : [events[0] ?? "", events[1] ?? ""];
    return [`${chainText(r)}\n\nAccording to the text, what led directly to this: *${events[k]}*?`, right, wrongs];
  }),
);

const connectingEvents = topic("reading", {
  id: "connecting-events-in-history",
  title: ["Connecting Events in History", "把历史事件联系起来"],
  summary: [
    "A history text explains how one event led to another and how ideas spread.",
    "历史文章解释一件事如何导致另一件事，以及思想如何传播。",
  ],
  after: ["cause-and-effect-chains", "reading-a-timeline"],
  points: [
    label(
      "how-two-events-connect",
      ["How Two Events Connect", "两件事如何联系"],
      [
        "A history text does more than list events: it shows how they **connect**. One event can be a **cause** of another (*because*, *since*), a **result** of it (*as a result*, *so*, *led to*), or a **comparison** that sets two events side by side (*similarly*, *by contrast*, *unlike*). The signal words help, but always check which event came first and what made what happen.",
        "历史文章不只是罗列事件，还要说明它们如何**联系**。一件事可以是另一件事的**原因**（*because*、*since*），也可以是它的**结果**（*as a result*、*so*、*led to*），或者是把两件事并列的**比较**（*similarly*、*by contrast*、*unlike*）。信号词有帮助，但一定要检查哪件事先发生、是什么导致了什么。",
      ],
      ["How is the second event connected to the first?", "第二件事与第一件事是什么关系？"],
      linkLines,
      linkLabels,
    ),
    choose(
      "the-event-that-led-to-another",
      ["The Event That Led to Another", "导致另一件事的事件"],
      [
        "Many history texts describe a **chain** of events, each one leading to the next. To find what led to an event, look at the step just before it in the chain, where the text says *because of this*, *so* or *in turn*. An earlier step began the chain but did not lead to it directly; a later step is a result, not a cause.",
        "许多历史文章描述一**连串**事件，每件事导致下一件事。要找出导致某件事的原因，就看链条中紧挨在它前面的那一步，也就是文章说 *because of this*、*so* 或 *in turn* 的地方。更早的一步开启了这个链条，但并不是直接原因；后面的一步是结果，不是原因。",
      ],
      ["Which event led directly to it?", "哪件事直接导致了它？"],
      ledItems,
      (right) => [
        `In the chain, the step just before it is **${right}**, so that is what led to it.`,
        `在这个链条中，紧挨在它前面的一步是 **${right}**，所以是它导致了这件事。`,
      ],
      [
        [
          "*{wrong}* is another step of the chain, but not the one just before it.",
          "*{wrong}* 是链条中的另一步，但不是紧挨在它前面的那一步。",
        ],
        [
          "*{wrong}* comes elsewhere in the chain, so it did not lead directly to this event.",
          "*{wrong}* 在链条的其他位置，所以并没有直接导致这件事。",
        ],
      ],
    ),
  ],
});

// Comparing the structures of two texts.
const structureLabels: Record<string, Label> = {
  "time order": {
    zh: "时间顺序",
    why: [
      "It tells events in the order they happened, with dates or words such as first and then.",
      "它按事件发生的先后讲述，用到日期或 first、then 等词。",
    ],
    not: ["The text does not tell events in the order they happened.", "这段文字不是按事件发生的先后讲述的。"],
  },
  "problem and solution": {
    zh: "问题与解决",
    why: ["It names a problem and then tells how it was or could be solved.", "它提出一个问题，再讲述问题是如何或可以如何解决的。"],
    not: ["The text does not set out a problem and how it was solved.", "这段文字并没有提出问题和解决办法。"],
  },
  comparison: {
    zh: "比较",
    why: ["It sets two things side by side to show how they are alike and different.", "它把两样东西并列，说明它们的异同。"],
    not: ["The text does not set two things side by side.", "这段文字没有把两样东西并列比较。"],
  },
};
const structureLines = `
  In 1957 the first satellite circled Earth. Four years later, Yuri Gagarin became the first person in space. In 1969 people walked on the moon.|time order
  Astronauts' bones grow weak in space. To keep them strong, crews exercise on treadmills for two hours a day.|problem and solution
  Mars and Earth both have seasons and polar ice. But Mars is colder, smaller and has a thin, dusty air.|comparison
  First the rocket's engines roar to life. Then the clamps let go. Two minutes later, the side boosters fall away.|time order
  A spacecraft gets very hot as it returns through the air. Engineers solved this with a heat shield that slowly burns away.|problem and solution
  Venus is about the same size as Earth. Unlike Earth, it is wrapped in thick clouds and is hot enough to melt lead.|comparison
  Galileo first looked at Jupiter through a telescope in 1610. Over the next nights, he saw four moons circling it.|time order
  Water is heavy to launch into space. So the space station recycles its water, even cleaning the crew's sweat.|problem and solution
  The moon has no air and no weather, while Earth is wrapped in air that brings wind and rain.|comparison
  The probe Voyager 1 left Earth in 1977. It passed Jupiter in 1979 and Saturn in 1980, and it is still traveling.|time order
  Rovers on Mars can get stuck in soft sand. Engineers now test their wheels in sandpits before each mission.|problem and solution
  Jupiter and Saturn are both giant planets made mostly of gas, but Saturn has wide, bright rings and Jupiter's are faint.|comparison
  In the morning the crew wakes at six. After breakfast they check the experiments, and in the afternoon they repair equipment.|time order
  Radio signals take minutes to reach Mars, too long to steer a rover live. The solution is to program the rover to drive itself.|problem and solution
  Comets are made of ice and dust, whereas asteroids are mostly rock and metal.|comparison
  Long ago, people tracked the moon to make calendars. Later, astronomers used telescopes. Today, probes visit the planets.|time order
  Space junk can crash into satellites. Scientists are testing nets and magnets to catch old pieces and pull them down.|problem and solution
  The inner planets are small and rocky. The outer planets, by contrast, are huge balls of gas and ice.|comparison
  The countdown reaches zero. The rocket lifts off. Eight minutes later, it reaches orbit.|time order
  Astronauts on long trips need fresh food. One answer is to grow lettuce under special lights on board.|problem and solution
  A star makes its own light, but a planet only reflects the light of a star.|comparison
  In 1930 Clyde Tombaugh found Pluto. In 2006 scientists voted to call it a dwarf planet. In 2015 a probe flew past it.|time order
  Sunlight is too weak far from the sun to power a probe. So probes to the outer planets carry a different kind of power source.|problem and solution
  Mercury and the moon both have cratered gray surfaces, but Mercury is much closer to the sun.|comparison
  The Hubble telescope was launched in 1990. Its first pictures were blurry. In 1993 astronauts fixed its mirror.|time order
  Dust storms on Mars can cover a rover's solar panels. On one rover, gusts of wind sometimes blew the panels clean again.|problem and solution
  Earth has one moon, while Mars has two tiny ones shaped like potatoes.|comparison
  At sunset the first stars appear. An hour later the planets shine brightly. By midnight the whole sky is full.|time order
  Light from cities hides the stars. Some towns fix this by using streetlights that shine only downward.|problem and solution
  Neptune and Uranus are both icy blue giants, but Neptune has the fastest winds in the solar system.|comparison
`;
const structureTopics = rows(`
  the first moon landing|the steps that led to the landing, in order|how the crew overcame the dangers of the trip|how the moon landing differed from earlier flights
  life on the space station|what the crew does through a day, in order|how the crew deals with the troubles of living in space|how life on the station differs from life on Earth
  the planet Mars|how people learned about Mars over the years|what makes living on Mars hard and how it might be done|how Mars and Earth are alike and different
  comets|what happens as a comet travels around the sun|how scientists solved the puzzle of where comets come from|how comets and asteroids are alike and different
  telescopes|how telescopes changed over the centuries|how astronomers solved the problem of blurry views|how telescopes on the ground and in space differ
  the rings of Saturn|how the rings were discovered, step by step|how scientists worked out what the rings are made of|how Saturn's rings differ from those of the other giants
  rockets|what happens to a rocket from launch to orbit|how engineers solved the problem of heavy fuel|how old rockets and new rockets are alike and different
  the moon|how the moon's shape seems to change through a month|how astronauts solved the problems of walking on the moon|how the moon and Earth are alike and different
  space suits|how space suits changed from the first flights to today|how a suit protects an astronaut from heat and cold|how a space suit differs from a diver's suit
  the sun|what happens to the sun over its long life|how scientists study the sun without being burned|how the sun differs from other stars
`);
const structureNames = ["time order", "problem and solution", "comparison"] as const;
const helpsItems: ChoiceItem[] = structureTopics.flatMap((r) =>
  [0, 1, 2].map((k): ChoiceItem => {
    const answers = [field(r, 1), field(r, 2), field(r, 3)];
    const others = answers.filter((_, i) => i !== k);
    return [`A text about ${field(r, 0)} is organized by ${structureNames[k]}.`, answers[k] ?? "", [others[0] ?? "", others[1] ?? ""]];
  }),
);

const structuresOfTwoTexts = topic("reading", {
  id: "comparing-structures-of-two-texts",
  title: ["Comparing the Structures of Two Texts", "比较两篇文章的结构"],
  summary: [
    "Two texts on one topic can be built differently: one in time order, one as problem and solution, one as comparison.",
    "同一主题的两篇文章可以有不同的结构：一篇按时间顺序，一篇按问题与解决，一篇按比较。",
  ],
  after: ["text-structures"],
  points: [
    label(
      "naming-the-structure-of-a-text",
      ["Naming the Structure of a Text", "说出文章的结构"],
      [
        "Two texts about space can be built in different ways. **Time order** tells events as they happened, with dates and words like *first* and *later*. **Problem and solution** names a difficulty and tells how it was solved. **Comparison** sets two things side by side with words like *both*, *but* and *unlike*. Naming the structure tells you how to read the text.",
        "两篇关于太空的文章可以用不同的方式组织。**时间顺序**按事件发生的先后讲述，用到日期和 *first*、*later* 等词。**问题与解决**提出一个难题并讲述它是如何解决的。**比较**用 *both*、*but*、*unlike* 等词把两样东西并列。说出文章的结构，就知道该怎样读它。",
      ],
      ["How is this text organized?", "这段文字是怎样组织的？"],
      structureLines,
      structureLabels,
    ),
    choose(
      "what-a-structure-helps-you-understand",
      ["What a Structure Helps You Understand", "结构帮助你理解什么"],
      [
        "Each structure helps the reader understand something different about the same topic. **Time order** shows what happened when and how things changed. **Problem and solution** shows what was hard and how people dealt with it. **Comparison** shows how two things are alike and different. Two texts on one topic, built differently, teach different things.",
        "每种结构帮助读者理解同一主题的不同方面。**时间顺序**表明什么时候发生了什么、事物如何变化。**问题与解决**表明什么是难题、人们如何应对。**比较**表明两样东西的异同。同一主题、结构不同的两篇文章，教给读者的东西也不同。",
      ],
      ["What does this structure help the reader understand?", "这种结构帮助读者理解什么？"],
      helpsItems,
      (right, shown) => [
        `${shown.replace(/^A text about .* is organized by /, "A structure of ").replace(/\.$/, "")} helps the reader understand ${right}.`,
        `这种结构帮助读者理解：${right}。`,
      ],
      [
        [
          "*{wrong}* is what a text with a different structure would help the reader understand.",
          "*{wrong}* 是另一种结构的文章能帮助读者理解的。",
        ],
        [
          "*{wrong}* belongs to another structure; match the structure to what it shows.",
          "*{wrong}* 属于另一种结构；要把结构与它所表明的内容对应。",
        ],
      ],
    ),
  ],
});

// Several accounts of one event: event|writer A|account A|writer B|account B|agree1|agree2|agree3|only A|only B, then
// three differences of each pair: difference|reason.
const accountPairs = rows(`
  the meeting of Moctezuma and the Spanish in 1519|a Spanish soldier who came with Cortés|We came along the great causeway and saw the city rising from the lake, its towers shining white. Moctezuma came out to greet our captain and gave him gifts of gold and fine cloth. We were led into the city as honored guests.|an Aztec writer who recorded what the elders remembered|The strangers came along the causeway with horses and weapons of metal. Moctezuma went out to meet them and gave them gifts of gold and feathers. The strangers seized the gold eagerly, and the people watched them with fear.|Moctezuma came out to meet the visitors.|The visitors came along the causeway.|Moctezuma gave the visitors gifts of gold.|The towers of the city shone white.|The people watched the strangers with fear.
  the finding of Machu Picchu in 1911|the explorer who wrote about it for a magazine|In July 1911 I climbed a steep slope with a local guide and found a lost city of stone hidden by forest. No one had seen these ruins in centuries. It was the greatest discovery of my life.|a farmer whose family lived on the mountain|In July 1911 a foreign man came up the slope with a guide from the valley. My family had farmed the old terraces for years, and we drank from the ancient channels. We showed him the walls the forest covered.|The visit happened in July 1911.|The explorer climbed with a guide.|Forest covered many of the stone walls.|It was the greatest discovery of his life.|The family had farmed the old terraces for years.
  the opening of the new bridge|the mayor who cut the ribbon|Today our town opened its fine new bridge across the river. Hundreds of people cheered as I cut the ribbon. The bridge will save drivers twenty minutes each day.|a shop owner whose shop stood on the old road|Today the town opened its new bridge across the river. A crowd watched the mayor cut the ribbon. Now drivers skip the old road, and my shop has been empty all afternoon.|The bridge opened today.|The mayor cut the ribbon.|A crowd watched the opening.|The bridge will save drivers twenty minutes a day.|The shop has been empty all afternoon.
  the school soccer final|a player on the winning team|We won the final 2 to 1! It rained the whole game, but our team kept passing well. Our winning goal came in the last minute, a perfect shot into the corner.|the goalkeeper of the losing team|We lost the final 2 to 1. It rained the whole game, and the ball was slippery. Their winning goal came in the last minute, when I slipped in the mud.|The final ended 2 to 1.|It rained the whole game.|The winning goal came in the last minute.|The winning goal was a perfect shot.|The goalkeeper slipped in the mud.
  the storm at the fishing village|a fisherman who was out at sea|The storm struck at noon while we were far from shore. Waves crashed over the deck, and we fought for hours to keep the boat afloat. We reached the harbor at dark, soaked and tired.|the fisherman's daughter, waiting on the shore|The storm struck at noon while Father's boat was still out. I stood on the pier for hours, staring at the gray sea. At dark his boat finally came into the harbor.|The storm struck at noon.|The boat was out at sea when it struck.|The boat reached the harbor at dark.|Waves crashed over the deck.|She stood on the pier for hours.
  the fire at the market|a firefighter who put it out|We were called to the market at three in the morning. Flames had reached the roof of the bakery. Our crew stopped the fire before it spread to the other shops.|the baker whose shop burned|At three in the morning, a neighbor woke me: my bakery was burning. By the time I arrived, the roof was gone. Thirty years of work were lost in one night.|The fire was at three in the morning.|The bakery was the building that burned.|The fire reached the bakery's roof.|The crew stopped the fire from spreading.|Thirty years of work were lost.
  the class trip to the museum|the teacher who led the trip|Our class visited the history museum on Friday. The students studied the Inca exhibit closely. One student wandered off briefly, but we found him within minutes.|the student who got lost|On Friday our class went to the history museum. I was looking at the Inca gold and suddenly everyone was gone. I searched three rooms before my teacher found me.|The trip was on Friday.|The class visited the history museum.|One student was separated from the class.|The students studied the exhibit closely.|He searched three rooms before he was found.
  the building of the dam|an engineer who designed it|The new dam took four years to build. It holds back the river and makes electricity for 50,000 homes. It is the largest project our company has finished.|a farmer whose fields were flooded by the lake behind it|The dam took four years to build. When the river was held back, the water rose over the valley. My family's fields now lie at the bottom of the new lake.|The dam took four years to build.|The dam holds back the river.|A lake formed behind the dam.|The dam makes electricity for 50,000 homes.|The farmer's fields lie under the new lake.
  the science fair|the student who won first prize|My project on bread mold won first prize at the science fair! The judges asked me about my method, and I explained every step. It was the best day of the year.|a judge at the fair|The fair had forty projects this year. A study of bread mold won first prize because its method was so careful. Several other projects came very close.|A project on bread mold won first prize.|The judges looked at the method.|The winner explained the project to the judges.|It was the best day of the year.|Several other projects came very close.
  the arrival of the Spanish at Cusco in 1533|a Spanish writer traveling with the army|We entered Cusco, the Inca capital, in November 1533. Its walls of fitted stone were finer than any in Spain. Our captain took the city's gold for the king.|an Inca noble who lived in the city|In November 1533 the strangers entered Cusco, our capital. They stripped the gold from the walls of our temples. Our holy places were left bare.|The Spanish entered Cusco in November 1533.|Cusco was the Inca capital.|The Spanish took gold from the city.|The walls of the city were finer than any in Spain.|The holy places were left bare.
`);
const differenceLines = rows(`
  The soldier calls the visitors honored guests, but the Aztec writer says the people watched them with fear.|The soldier saw it from the visitors' side; the writer, from the side of the people visited.
  The soldier calls the gold a gift of welcome, but the Aztec writer says the strangers seized it eagerly.|The Aztec writer saw how the visitors acted; the soldier wanted his side to seem honorable.
  The soldier describes the shining city, but the Aztec writer describes the horses and metal weapons.|Each writer noticed what was new and strange to his own people.
  The explorer says no one had seen the ruins in centuries, but the farmer says his family farmed there for years.|The explorer saw the place as unknown because it was unknown to the outside world.
  The explorer calls it a lost city, but the farmer talks about terraces and water channels his family used.|To the explorer it was a find; to the farmer it was home.
  The explorer says he found the city, but the farmer says his family showed him the walls.|Each writer tells the part he played; the explorer leaves out the help he had.
  The mayor says the bridge saves drivers time, but the shop owner says drivers now skip the old road.|The mayor sees the benefit to the town; the shop owner sees her own loss.
  The mayor tells of hundreds cheering, but the shop owner tells of an empty shop.|Each writer tells what mattered most to them that day.
  The mayor calls the bridge fine, but the shop owner does not praise it at all.|The mayor built the bridge and is proud of it; the shop owner was hurt by it.
  The player calls the last goal a perfect shot, but the goalkeeper says she slipped in the mud.|Each player explains the goal in a way that suits her own team.
  The player says her team passed well in the rain, but the goalkeeper says the ball was slippery.|The winner remembers what went right; the loser remembers what made it hard.
  The player sounds joyful, but the goalkeeper sounds disappointed.|One was on the winning side and one on the losing side.
  The fisherman describes waves on the deck, but his daughter describes the gray sea from the pier.|Each saw the storm from a different place: one on the boat, one on shore.
  The fisherman tells of fighting to stay afloat, but his daughter tells of waiting and watching.|He was busy saving the boat; she could only wait for news.
  The fisherman says they came in soaked and tired, but his daughter says his boat finally came in.|He felt the trip in his body; she felt relief at seeing the boat return.
  The firefighter says the crew stopped the fire, but the baker says thirty years of work were lost.|The firefighter sees what the crew saved; the baker sees what she lost.
  The firefighter says flames reached the roof, but the baker says the roof was gone when she arrived.|They arrived at different times and saw the fire at different stages.
  The firefighter sounds calm, but the baker sounds heartbroken.|For the firefighter it was one call of many; for the baker it was her life's work.
  The teacher says the student wandered off briefly, but the student says he searched three rooms.|The teacher knew he was safe all along; to the boy, the minutes felt long.
  The teacher says the class studied the exhibit closely, but the student says everyone was suddenly gone.|The teacher watched the whole class; the student saw only what happened to him.
  The teacher says they found him within minutes, but the student says he searched before he was found.|The teacher wants to show the trip was well run; the boy remembers being afraid.
  The engineer says the dam powers 50,000 homes, but the farmer says his fields lie under the lake.|The engineer sees what the dam gives; the farmer sees what it took from him.
  The engineer calls the dam the largest project his company finished, but the farmer calls it the end of his fields.|The engineer is proud of his work; the farmer lost his land to it.
  The engineer says the dam holds back the river, but the farmer says the water rose over the valley.|Both tell one fact from their own side: one sees control, the other sees flooding.
  The student says the judges asked about every step, but the judge says forty projects were judged.|The student remembers her own interview; the judge remembers the whole fair.
  The student calls it the best day of the year, but the judge says other projects came close.|The winner feels joy; the judge must be fair to everyone.
  The student says the method was explained step by step, but the judge says the method was careful.|Each describes the method from their own side: one explained it, one weighed it.
  The Spanish writer praises the walls of fitted stone, but the Inca noble mourns the bare holy places.|The visitor admired the city; the noble grieved for what his people lost.
  The Spanish writer says the gold was taken for the king, but the Inca noble says it was stripped from the temples.|The writer served the king; to the noble, the gold belonged to holy places.
  The Spanish writer calls Cusco the Inca capital, but the noble calls it our capital.|The writer is an outsider describing it; the noble belongs to the city.
`);
const accountsOf = (r: readonly string[]) => `Account A, by ${field(r, 1)}: ${field(r, 2)}\n\nAccount B, by ${field(r, 3)}: ${field(r, 4)}`;
const agreeItems: ChoiceItem[] = accountPairs.flatMap((r) =>
  [5, 6, 7].map(
    (k): ChoiceItem => [`${accountsOf(r)}\n\nWhat do both accounts of ${field(r, 0)} agree on?`, field(r, k), [field(r, 8), field(r, 9)]],
  ),
);
const misreadings = [
  "The two writers were really telling about two different events that happened at different times.",
  "One of the writers must have made the whole event up, since they do not tell it the same way.",
  "The two writers lived hundreds of years apart and could only guess at what took place.",
  "One of the writers was not paying attention at all and missed most of what happened.",
  "The two writers did not speak the same language, so neither understood what was going on.",
  "The event was far too small for anyone to remember clearly, so both writers are mostly guessing.",
] as const;
const differItems: ChoiceItem[] = accountPairs.flatMap((r, p) =>
  [0, 1, 2].map((k): ChoiceItem => {
    const d = differenceLines[p * 3 + k] ?? [];
    return [
      `${accountsOf(r)}\n\n${field(d, 0)} Why do the accounts differ?`,
      field(d, 1),
      [misreadings[(p + k) % 6] ?? "", misreadings[(p + k + 3) % 6] ?? ""],
    ];
  }),
);

const severalAccounts = topic("reading", {
  id: "multiple-accounts-of-one-event",
  title: ["Several Accounts of One Event", "同一事件的多种记述"],
  summary: [
    "People who saw an event from different sides tell it differently, such as the meeting of the Aztec and the Spanish.",
    "从不同角度看到同一事件的人，讲述方式也不同，例如阿兹特克人与西班牙人的会面。",
  ],
  after: ["firsthand-and-secondhand-accounts"],
  points: [
    choose(
      "what-two-accounts-agree-on",
      ["What Two Accounts Agree On", "两种记述的共同之处"],
      [
        "When two people tell about the same event, compare their accounts fact by fact. The facts that **both** accounts give are the ones a reader can trust most: two people from different sides would not both invent them. A fact that only one account gives may be true, but it rests on one person's word.",
        "两个人讲述同一事件时，要逐条比较他们的记述。**两种**记述都提到的事实最值得读者相信：来自不同立场的两个人不会都编造它。只有一种记述提到的事实也许是真的，但它只凭一个人的说法。",
      ],
      ["What do both accounts agree on?", "两种记述在哪一点上一致？"],
      agreeItems,
      (right) => [`Both accounts tell this fact: **${right}**`, `两种记述都讲到了这个事实：**${right}**`],
      [
        ["*{wrong}* appears only in Account A.", "*{wrong}* 只出现在记述 A 中。"],
        ["*{wrong}* appears only in Account B.", "*{wrong}* 只出现在记述 B 中。"],
      ],
    ),
    choose(
      "why-accounts-differ",
      ["Why Accounts Differ", "记述为什么不同"],
      [
        "Accounts of one event differ because each writer has a **position**: where they stood, which side they were on, what they had to gain or lose. A soldier on the visitors' side and a writer on the side of the people visited notice different things and feel differently about them. Their differences do not mean that one invented the event.",
        "同一事件的记述之所以不同，是因为每个作者都有自己的**立场**：他们站在哪里、属于哪一方、会得到或失去什么。来访一方的士兵和被访一方的作者注意到的东西不同，感受也不同。他们的差异并不意味着有人编造了这件事。",
      ],
      ["Why do the accounts differ?", "这两种记述为什么不同？"],
      differItems,
      (right) => [`The writers' positions explain the difference: ${right}`, `作者的立场解释了这种差异：${right}`],
      [
        [
          "*{wrong}* cannot be right: the accounts agree on the main facts, so the writers tell one event.",
          "*{wrong}* 不可能对：两种记述在主要事实上一致，说明讲的是同一件事。",
        ],
        [
          "*{wrong}* does not fit the accounts; the difference comes from each writer's position.",
          "*{wrong}* 与记述不符；差异来自每个作者的立场。",
        ],
      ],
    ),
  ],
});

/** readingTopics5a are the reading skills of the first six units of grade 5. */
export const readingTopics5a: readonly TopicDef[] = [
  twoMainIdeas,
  severalSources,
  readingAnExperiment,
  pointsAndEvidence,
  comparisonsThatExplain,
  quotingAccurately,
  legendOrHistory,
  connectingEvents,
  structuresOfTwoTexts,
  severalAccounts,
];
