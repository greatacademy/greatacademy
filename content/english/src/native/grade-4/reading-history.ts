// Grade 4: the reading skills of texts about the past and about lives: facts and inventions in historical fiction,
// how setting shapes a story, firsthand and secondhand accounts, and biography and autobiography.

import { type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { fields, type Item, itemGenerator, type Kind, nameKind } from "./kit.ts";
import { after } from "./prior.ts";

// Facts and inventions in historical fiction.

const historyKinds: Readonly<Record<string, Kind>> = {
  "a historical fact": {
    zh: "历史事实",
    is: ["It names a real person, place, date or event that history books record.", "它说的是历史书记载的真实人物、地点、日期或事件。"],
  },
  "an invented detail": {
    zh: "虚构的细节",
    is: [
      "It is something the author made up, such as a character's name, thoughts or words, that fits the time but is not recorded anywhere.",
      "它是作者编出来的，比如角色的名字、想法或话语，符合那个时代，但没有任何记载。",
    ],
  },
  "a detail from the wrong time": {
    zh: "时代错误的细节",
    is: [
      "It names something that did not exist yet in that time and place, so it is a mistake in a historical story.",
      "它提到了那个时代和地方还不存在的东西，所以是历史故事中的错误。",
    ],
  },
};

const historyLines = `
  In 1271, Marco Polo set out from Venice for China with his father and uncle.|a historical fact
  Marco's best friend on the ship, a boy named Tito, sang to the sailors every night.|an invented detail
  Marco checked the time on his wristwatch before the caravan left.|a detail from the wrong time
  The Great Wall of China was built to keep out raiders from the north.|a historical fact
  Li Wei, a young builder, dreamed of the plum trees in his village as he carried stones.|an invented detail
  The wall builders listened to music on their radios as they worked.|a detail from the wrong time
  In the Middle Ages, knights wore suits of armor made of metal.|a historical fact
  Sir Roland's squire, Hugo, was afraid of horses but never told anyone.|an invented detail
  The knight switched on an electric light to read his letters.|a detail from the wrong time
  The Black Death swept across Europe in the 1340s.|a historical fact
  Anna whispered a prayer for her little brother as she shut the shutters.|an invented detail
  The doctor took Anna's temperature with a digital thermometer.|a detail from the wrong time
  Silk from China was carried west along the Silk Road.|a historical fact
  The merchant's daughter, Mina, counted the bales of silk twice every morning.|an invented detail
  The merchant sent a text message to tell his wife he would be late.|a detail from the wrong time
  The ancient Egyptians built the pyramids as tombs for their kings.|a historical fact
  Nefer, a stone cutter's son, hoped one day to carve a statue of his own.|an invented detail
  The workers lifted the stones with a crane powered by a diesel engine.|a detail from the wrong time
  Gutenberg built a printing press in Germany around 1450.|a historical fact
  Gutenberg's helper, Klaus, spilled ink on his apron on the very first day.|an invented detail
  Gutenberg printed his Bible on a laser printer.|a detail from the wrong time
  Zheng He led great fleets of Chinese ships across the Indian Ocean in the 1400s.|a historical fact
  A cabin boy named Bao kept a pet monkey hidden in a basket below deck.|an invented detail
  Zheng He's sailors used GPS to find their way home.|a detail from the wrong time
  Monks in the Middle Ages copied books by hand.|a historical fact
  Brother Thomas hummed a little tune as he painted gold letters on the page.|an invented detail
  The monk typed the last page of the book on a computer.|a detail from the wrong time
  Roman soldiers built straight stone roads across their empire.|a historical fact
  A soldier named Marcus missed his mother's honey cakes on the long march.|an invented detail
  The Roman soldiers rode bicycles along the road to the next town.|a detail from the wrong time
  The Vikings sailed in long wooden ships with square sails.|a historical fact
  Astrid, the youngest rower, sang loudly to keep the others' spirits up.|an invented detail
  The Viking ship had a motor to push it through the waves.|a detail from the wrong time
`;

/** checkGroups are short informational texts, each with details of a story checked against it. */
const checkGroups = [
  {
    text: "Castles of the Middle Ages were built of stone. Many had a moat, a deep ditch of water around the walls. A drawbridge crossed the moat and could be raised in an attack. Most castles had a great hall, where the lord's family ate.",
    details: [
      ["The guards raised the drawbridge as the enemy army came near.", "confirms"],
      ["The family ate their dinner in the great hall.", "confirms"],
      ["The castle was built of wood and straw.", "contradicts"],
      ["The castle had no water around it at all.", "contradicts"],
      ["The lord's cook made the best onion soup in the land.", "does not say"],
      ["The castle cat caught three mice every night.", "does not say"],
    ],
  },
  {
    text: "Caravans on the Silk Road crossed deserts and mountains. Camels carried the goods, because they could go many days without water. Traders rested at inns called caravanserais. A trip from China to the Mediterranean could take more than a year.",
    details: [
      ["The camels walked for days across the desert without drinking.", "confirms"],
      ["That night the traders rested at a caravanserai.", "confirms"],
      ["They reached the Mediterranean from China in only a week.", "contradicts"],
      ["The goods were carried by trucks across the mountains.", "contradicts"],
      ["The youngest trader had a red scarf from his grandmother.", "does not say"],
      ["One camel was named Sandy and loved to eat dates.", "does not say"],
    ],
  },
  {
    text: "Paper was invented in China about two thousand years ago. It was made from tree bark, old rags and plants, soaked and pressed into thin sheets. For hundreds of years the Chinese kept the method secret. Paper reached the Middle East in the 700s.",
    details: [
      ["The papermaker soaked old rags and bark in a big tub.", "confirms"],
      ["She pressed the soaked pulp into thin sheets.", "confirms"],
      ["The papermaker taught the secret to everyone who asked.", "contradicts"],
      ["The first paper was made from plastic.", "contradicts"],
      ["The papermaker's son hated the smell of the wet pulp.", "does not say"],
      ["Each sheet took her a whole morning to dry.", "does not say"],
    ],
  },
  {
    text: "In the Middle Ages most people were peasants who farmed the land of a lord. They worked from sunrise to sunset. In return, the lord protected them. Peasants lived in small houses with one room, and their animals often slept inside with them.",
    details: [
      ["The peasants worked in the lord's fields until the sun went down.", "confirms"],
      ["At night the goat slept in the same room as the family.", "confirms"],
      ["The peasant family lived in a house with twelve rooms.", "contradicts"],
      ["The lord did nothing to protect the peasants.", "contradicts"],
      ["Little Elsa named every one of the hens.", "does not say"],
      ["Her father sang while he plowed the field.", "does not say"],
    ],
  },
  {
    text: "Zhang Heng made the first earthquake detector in China in the year 132. It was a bronze jar with eight dragons around it. When the ground shook, a ball dropped from a dragon's mouth into the mouth of a toad below, showing the direction of the quake.",
    details: [
      ["A ball fell from a dragon's mouth into a toad's mouth.", "confirms"],
      ["The detector was a jar made of bronze.", "confirms"],
      ["The detector was made of glass and had four dragons.", "contradicts"],
      ["Zhang Heng built it in the year 1900.", "contradicts"],
      ["Zhang Heng's student loved to polish the dragons.", "does not say"],
      ["The emperor laughed when he first saw the jar.", "does not say"],
    ],
  },
  {
    text: "Before printing, books in Europe were copied by hand, often by monks. Copying one book could take a year. The pages were made of animal skin, called parchment, and some were decorated with gold.",
    details: [
      ["The monk wrote on a page of parchment.", "confirms"],
      ["He decorated the first letter with gold.", "confirms"],
      ["The monk copied the whole book in a single afternoon.", "contradicts"],
      ["The pages were made of thin sheets of metal.", "contradicts"],
      ["The monk's favorite color was deep blue.", "does not say"],
      ["A robin sang outside the window every morning.", "does not say"],
    ],
  },
] as const;

const verdicts = ["confirms", "contradicts", "does not say"] as const;

const verdictWhy: Readonly<Record<(typeof verdicts)[number], readonly [string, string]>> = {
  confirms: ["The informational text says the same thing, so the detail is accurate.", "信息类文章说的是同一件事，所以这个细节是准确的。"],
  contradicts: [
    "The informational text says something different, so the detail is not accurate.",
    "信息类文章说的不一样，所以这个细节不准确。",
  ],
  "does not say": [
    "The informational text says nothing about it, so it may be invented by the author; the text cannot check it.",
    "信息类文章完全没提到这一点，所以它可能是作者虚构的；这篇文章无法核对它。",
  ],
};

const verdictNot: Readonly<Record<(typeof verdicts)[number], readonly [string, string]>> = {
  confirms: [
    "The text does not say the same thing as the detail, so it does not confirm it.",
    "文章说的和这个细节不一样，所以没有证实它。",
  ],
  contradicts: [
    "Nothing in the text says the opposite of the detail, so it does not contradict it.",
    "文章中没有与这个细节相反的内容，所以并不矛盾。",
  ],
  "does not say": [
    "The text does talk about this, so it is not true that it does not mention it.",
    "文章确实谈到了这一点，所以不能说它没有提到。",
  ],
};

const verdictZh: Readonly<Record<(typeof verdicts)[number], string>> = {
  confirms: "证实了它",
  contradicts: "与它矛盾",
  "does not say": "没有提到",
};

/** checkBank asks whether an informational text confirms, contradicts or says nothing of a story's detail. */
const checkBank: readonly Item[] = checkGroups.flatMap((group) =>
  group.details.map(([detail, verdict]) => {
    const wrong = verdicts.filter((v) => v !== verdict);
    return {
      question: t(
        `A historical story says: “${detail}” What does the informational text do with this detail?`,
        `一个历史故事写道：“${detail}”信息类文章对这个细节怎么样？`,
      ),
      shown: group.text,
      right: `It ${verdict === "does not say" ? "does not mention it" : `${verdict} it`}`,
      wrong: wrong.map((w) => `It ${w === "does not say" ? "does not mention it" : `${w} it`}`),
      why: t(
        `The text **${verdict === "does not say" ? "does not mention it" : `${verdict} it`}**. ${verdictWhy[verdict][0]}`,
        `文章**${verdictZh[verdict]}**。${verdictWhy[verdict][1]}`,
      ),
      whyNot: wrong.map((w) =>
        t(`${verdictNot[w][0]} Read the text again and look for this detail.`, `${verdictNot[w][1]} 再读一遍文章，找找这个细节。`),
      ),
    };
  }),
);

// How setting shapes a story.

const settingProblemLines = `
  A girl lives on a farm on the prairie in 1880. A blizzard is coming, and her father is in town.|She must get the animals into the barn alone.|She must charge her phone before the power goes out.|She must finish her math homework before school tomorrow.
  A boy lives on a tiny island where the ferry comes once a week. He falls and breaks his arm.|He must wait days for a boat to a doctor.|He cannot decide which video game to play.|He has to walk to the hospital across the street.
  A family crosses the Sahara with a camel caravan. Their water bags begin to leak.|They might run out of water.|They might miss their train to the city.|They might get wet in a sudden rain shower.
  A knight's son lives in a castle under siege. Food is running low.|They must make the food last until help comes.|The family must choose a new color to paint the castle.|The family must decide which restaurant to order from.
  A girl lives in a city in Ancient Rome. The great volcano nearby begins to rumble.|She must warn her family and flee.|She must decide what to wear to the shopping mall.|She must find the video game she lost last week.
  Two friends are on a research ship near Antarctica. The ice closes in around the ship.|The ship could be trapped until spring.|The friends could be late for soccer practice.|The friends could get sunburned at the beach.
  A boy in a mountain village is sent to fetch the doctor. The only bridge has been washed away.|He must find another way across.|He must find a taxi to drive him there.|He must buy a ticket for the subway.
  A trader travels the Silk Road with his goods. Bandits are said to wait in the mountain pass.|He must choose the pass or the long way.|He must decide whether to fly or take a train.|He must decide which store to shop in.
  A girl lives in a lighthouse on a rocky coast. On a stormy night, the lamp goes out.|Ships could crash on the rocks in the dark.|She cannot watch her favorite television show.|She cannot find her slippers in the dark.
  A boy in the Middle Ages wants to learn to read. Only monks and the rich own books.|He has no book to learn from.|He cannot decide which library app to use.|He has too many books on his shelf.
  A family lives in the desert, where it has not rained in a year. Their well is nearly dry.|They must find water for the animals.|They must find a pool to swim in.|They must buy a bigger umbrella for the rain.
  A girl's family moves to a big, noisy city from a quiet farm. She has never ridden a bus.|She must learn her way around the streets.|She must learn to milk the cows by herself.|She must learn to sail a boat on the lake.
  A boy lives in a rainforest village. A tall tree has fallen across the only path to the river.|He must find another way to the water.|He must clear the snow off the path.|He must wait for the bus to come.
  An astronaut lives on a space station. A small rock hits the station and makes a leak.|She must fix the leak before the air escapes.|She must fix the leaky kitchen tap in her house.|She must find her umbrella before it rains.
  A family lives on a houseboat. The river floods after days of rain.|They must tie down the boat in the flood.|They must water the garden because it is dry.|They must shovel snow off their roof.
  A girl lives in a village in the Arctic. The sea ice melts early this spring.|The hunters cannot cross the ice to hunt.|The farmers cannot plant their rice.|The children cannot go to the beach to swim.
  Two children are lost in a big forest at night. Their flashlight has run out.|They must find their way in the dark.|They must find a store to buy a new phone.|They must find a seat on the crowded train.
  A boy lives in a city in 1900. His family has no electricity.|He must study by an oil lamp.|He must charge his laptop before class.|He must turn down the air conditioner.
  A girl lives on a sheep farm in the hills. A fog rolls in while the sheep are far away.|She cannot see to bring the sheep home.|She cannot hear the music on her radio.|She cannot find the door of the supermarket.
  A family travels west in a covered wagon in 1850. They reach a wide, fast river.|They must find a safe place to cross.|They must find a gas station for the car.|They must find a hotel with a swimming pool.
  A boy lives in a castle town. The town's gates close at sunset, and he is still outside.|He must sleep outside the walls.|He must call a taxi to take him home.|He must wait for the elevator to come down.
  A girl lives in a village in Japan. An earthquake shakes the houses, and the sea pulls back from the shore.|She must warn everyone to run uphill.|She must find her shoes for the party.|She must buy more milk at the shop.
  A pioneer family settles in a dry valley. Grasshoppers eat all their crops.|They may not have food for winter.|They may not be able to watch the game.|They may not find a parking space.
  A boy works on a sailing ship in 1700. There is no wind for many days.|The ship is stuck as food runs low.|The ship's engine has broken down at sea.|The ship's computer has crashed.
  A girl lives near a volcano in Iceland. Ash begins to fall on the fields.|The sheep cannot graze in the fields.|She cannot go to the beach to swim.|She cannot find her bus ticket.
  A boy lives in a town under a dam. Cracks appear in the dam after heavy rain.|The town may flood.|The town may run out of sand.|The town may be too dry for crops.
  A girl lives on a mountain where a road has just been built. Strangers start arriving with cars and noise.|Her quiet village begins to change.|She has to learn to swim in the sea.|She can no longer find snow anywhere.
  Two sisters live in a desert town. A sandstorm blows in while they walk home from school.|They can hardly see in the sand.|They get soaked by the heavy rain.|They slip on the ice.
  A boy lives in a fishing village. A storm keeps the boats in the harbor for a week.|The families have no fish.|The boy cannot play on his computer.|The families have too many fish to store.
  A girl in a medieval town wants to be a painter. Only boys may learn in the painters' guild.|She must find another way to learn to paint.|She must buy paints on the internet.|She must choose which art school to drive to.
`;

const settingChangeLines = `
  A girl is lost in a snowstorm on the prairie and finds her way home by following a fence.|a city with streetlights|She could follow the streetlights or ask someone for help, so the danger would be much smaller.|The setting would not matter, so she would still have to follow the fence through the snow.|The story would end in exactly the same way.
  A boy on a tiny island waits a week for the ferry to take him to a doctor.|a big city with a hospital nearby|He could reach a doctor in minutes, so there would be no long, worried wait.|The setting would not matter, so he would still have to wait a week for the ferry.|He would have to swim to the doctor.
  A trader crosses the desert and nearly runs out of water.|a land of rivers and lakes|He could easily find water, so the main problem of the story would disappear.|The setting would not matter, so he would still nearly run out of water.|He would have to carry more sand.
  A family in a castle under siege tries to make their food last.|a farm in peaceful times|They could grow or buy food freely, so there would be no siege to survive.|The setting would not matter, so they would still be trapped behind the walls.|They would have to fight the same army.
  A girl in 1880 studies by candlelight because there is no electricity.|today's world|She could switch on a lamp, so studying at night would be easy.|The setting would not matter, so she would still need a candle to see.|She would have no homework at all.
  A boy in the Middle Ages cannot find a book to learn to read from.|a town with a public library|He could borrow books for free, so learning to read would be far easier.|The setting would not matter, so he would still have no books.|He would have to write the books himself.
  A pioneer family crosses a wide river in a wagon.|a land with bridges and roads|They could drive across a bridge, so the dangerous crossing would not happen.|The setting would not matter, so they would still have to float the wagon across.|They would have to cross the ocean.
  Sailors on a ship with no wind drift for weeks with little food.|a ship with an engine|The engine could move the ship, so they would not be stuck waiting for wind.|The setting would not matter, so they would still drift for weeks.|They would have more wind than they needed.
  Children in a rainforest village fetch water from the river every morning.|a city apartment with taps|They could fill a glass at the tap, so fetching water would not be a daily task.|The setting would not matter, so they would still walk to the river each day.|They would have to dig a well.
  A girl in an Arctic village cannot hunt when the sea ice melts early.|a farming village in a warm valley|Her family would grow food instead, so melting ice would not be a problem.|The setting would not matter, so she would still depend on the ice for hunting.|She would have to hunt seals in the fields.
  A family's wagon is stuck in mud on the trail west.|a modern highway|Their car would drive on the smooth road, so getting stuck would be unlikely.|The setting would not matter, so they would still be stuck in the mud.|They would have to pull the car with oxen.
  A boy outside the castle walls is locked out when the gates close at sunset.|a modern town with no walls|He could simply walk home, so there would be no locked gates to keep him out.|The setting would not matter, so he would still be locked out for the night.|He would have to climb a wall.
  A girl warns her village of a great wave after an earthquake.|a town far from the sea|There would be no wave to warn of, so the danger would have to come from something else.|The setting would not matter, so she would still have to warn of the wave.|The wave would be even bigger.
  A boy in a fishing village has no fish to eat during a week of storms.|a town with shops and markets|His family could buy food at a shop, so the storm would not leave them hungry.|The setting would not matter, so they would still have no food for a week.|They would catch more fish in the storm.
  Lost children in a dark forest have no flashlight.|a park in the middle of a city|They could follow the lights and noise to a street, so they would soon be found.|The setting would not matter, so they would still be lost in the dark forest.|They would have to sleep in a tree.
  A girl in a medieval town is not allowed to join the painters' guild.|a modern school with art classes for all|She could take art classes like anyone else, so the rule against her would not exist.|The setting would not matter, so she would still be shut out of the guild.|She would have to join a guild of builders.
  A shepherd girl cannot find her sheep in thick fog.|a clear, sunny day|She could see the sheep across the hills, so finding them would be easy.|The setting would not matter, so she would still be lost in the fog.|The sheep would be harder to find.
  An astronaut must fix a leak before the air escapes from the station.|a house on Earth|A small leak would not be dangerous, because there is air all around.|The setting would not matter, so the air would still escape from the house.|She would have to fix the leak in space.
  A boy in 1900 carries a message across town on foot because there are no phones.|today's world|He could send a text message, so the long run across town would not be needed.|The setting would not matter, so he would still have to run across town.|He would have to send the message by ship.
  A family on a houseboat ties down the boat as the river floods.|a house on a high hill|The flood would not reach them, so they would not fear being swept away.|The setting would not matter, so they would still be swept down the river.|They would have to tie down the house.
  A caravan waits out a sandstorm in the desert.|a snowy mountain pass|The danger would be a snowstorm instead, with cold and ice in place of sand.|The setting would not matter, so the caravan would still wait out a sandstorm.|There would be no weather at all.
  A girl in Rome flees from the eruption of a volcano.|a city on a flat plain far from volcanoes|There would be no eruption, so the story would need a different danger.|The setting would not matter, so she would still flee from the volcano.|The volcano would be even closer.
  A lighthouse keeper's daughter relights the lamp so ships do not crash.|a coast with modern electric lights and radios|The light would be automatic and ships would have radios, so her brave act would not be needed.|The setting would not matter, so she would still have to climb up and light the lamp.|Ships would crash more often.
  A boy in a mountain village must cross a river after the bridge washes away.|a flat town with many bridges|He could use another bridge, so his journey would be short and safe.|The setting would not matter, so he would still have no way across.|He would have to climb the mountain.
  A family in a dry valley loses their crops to grasshoppers.|a valley with many shops and markets|They could buy food from the market, so losing the crops would hurt less.|The setting would not matter, so they would still have no food for winter.|There would be more grasshoppers.
  Two sisters walk home through a sandstorm.|a rainy city with buses|They would face rain instead and could take a bus home.|The setting would not matter, so they would still walk through the sandstorm.|They would walk through a snowstorm.
  A trader chooses between a dangerous mountain pass and a long road around.|a land of flat plains|There would be no mountains, so the hard choice would not exist.|The setting would not matter, so he would still have to choose the pass.|He would have to cross two mountains.
  Pioneers in a covered wagon run low on food on the trail.|a road with towns and shops along the way|They could stop in a town to buy food, so hunger would not be a danger.|The setting would not matter, so they would still have no food.|They would have to hunt for food in the towns.
  A girl's quiet mountain village changes as a new road brings strangers.|a village that no road reaches|Strangers would not arrive, so her village would stay quiet and the story's problem would not begin.|The setting would not matter, so strangers would still arrive by road.|More roads would be built.
  A boy on a ship in 1700 is the first to spot land from the top of the mast.|a ship of today with radar|The radar would find the land first, so his moment on the mast would not matter as much.|The setting would not matter, so he would still be the first to spot land.|He would never see land at all.
`;

const settingProblems = fields(settingProblemLines).map(([shown, right, w1, w2]) => {
  if (!shown || !right || !w1 || !w2) throw new Error(`a setting line needs four fields: ${shown}`);
  return { shown, right, wrong: [w1, w2] as const };
});

const settingChanges = fields(settingChangeLines).map(([story, setting, right, w1, w2]) => {
  if (!story || !setting || !right || !w1 || !w2) throw new Error(`a setting change needs five fields: ${story}`);
  return { story, setting, right, wrong: [w1, w2] as const };
});

/** settingProblemBank asks how the setting causes a story's problem. */
const settingProblemBank: readonly Item[] = settingProblems.map((s) => ({
  question: t("What problem does the setting of this story cause?", "这个故事的背景引起了什么问题？"),
  shown: s.shown,
  right: s.right,
  wrong: [...s.wrong],
  why: t(
    `${s.right} The time and place decide what the characters have and do not have, and so what can go wrong.`,
    `${s.right} 时间和地点决定了角色拥有什么、缺少什么，也就决定了会出什么问题。`,
  ),
  whyNot: s.wrong.map((w) =>
    t(
      `“${w}” does not fit this time and place: it belongs to a different setting, or has nothing to do with this one.`,
      `“${w}”不符合这个时间和地点：它属于另一种背景，或者与这个背景毫无关系。`,
    ),
  ),
}));

/** settingChangeBank asks how a story would change in another setting. */
const settingChangeBank: readonly Item[] = settingChanges.map((s) => ({
  question: t(
    `How would this story change if it were set in ${s.setting}?`,
    `如果这个故事发生在另一个背景（${s.setting}），会有什么变化？`,
  ),
  shown: s.story,
  right: s.right,
  wrong: [...s.wrong],
  why: t(
    `${s.right} A new setting changes what the characters can do, so the problem changes too.`,
    `${s.right} 新的背景改变了角色能做的事，所以问题也随之改变。`,
  ),
  whyNot: s.wrong.map((w) =>
    t(
      `“${w}” ignores the new setting. Ask what the characters could do in ${s.setting} that they could not do before.`,
      `“${w}”忽略了新的背景。问问角色在新的背景里能做什么以前做不到的事。`,
    ),
  ),
}));

// Firsthand and secondhand accounts.

const accountKinds: Readonly<Record<string, Kind>> = {
  "a firsthand account": {
    zh: "第一手记述",
    is: [
      "It is written by someone who was really there, using I and we, about a real event.",
      "它是由真正在场的人用 I 和 we 写的，讲的是真实事件。",
    ],
  },
  "a secondhand account": {
    zh: "第二手记述",
    is: [
      "It is written later by someone who was not there and learned about the real event from others, using he, she and they.",
      "它是后来由不在场的人写的，作者从别人那里了解这个真实事件，用 he、she 和 they。",
    ],
  },
  "a made-up story told with I": {
    zh: "用“我”讲的虚构故事",
    is: [
      "It uses I, but the events are invented: talking animals, magic or a character who never lived.",
      "它用了 I，但事件是虚构的：会说话的动物、魔法，或者从未存在过的人物。",
    ],
  },
};

const accountLines = `
  I stood on the dock in 1912 and watched the great ship sail away. I never dreamed it would not come back.|a firsthand account
  In 1912, crowds gathered on the docks as the great ship set sail. Few of them knew of the danger ahead.|a secondhand account
  I am a dragon, and yesterday I flew over the castle and sneezed fire on the king's hat.|a made-up story told with I
  We felt the ground shake under our feet. I grabbed my sister's hand, and we ran out into the street.|a firsthand account
  The earthquake struck at five in the morning. Thousands of people ran into the streets as buildings shook.|a secondhand account
  I am the wind, and I have blown across every ocean and whispered to every tree.|a made-up story told with I
  I was nine when the first man walked on the Moon. We crowded around the television, and my father cried.|a firsthand account
  In 1969, about six hundred million people watched on television as the first man walked on the Moon.|a secondhand account
  When I opened the magic box, a tiny elephant jumped out and asked me for a peanut.|a made-up story told with I
  We marched for hours in the hot sun. My feet hurt, but I sang with everyone else.|a firsthand account
  Thousands of people marched through the city that day. Historians say it changed the laws of the country.|a secondhand account
  I shrank to the size of an ant and rode on a ladybug all the way to the garden gate.|a made-up story told with I
  The snow was so deep that we climbed out of our upstairs window. I had never seen anything like it.|a firsthand account
  The great blizzard of that winter buried the town. Records show the snow reached the second floor of many houses.|a secondhand account
  I am the oldest tree in the forest, and I remember when the mountains were young.|a made-up story told with I
  I saw the flames from my bedroom window. We filled buckets from the well and passed them along the line.|a firsthand account
  The fire began in a bakery and spread through the city for four days. Over thirteen thousand houses burned.|a secondhand account
  My pet goldfish told me a secret last night: she used to be a mermaid princess.|a made-up story told with I
  I held my breath as the doctor took off the bandages. For the first time in years, I could see my mother's face.|a firsthand account
  After the operation, the girl could see again. Her doctors wrote about the case in a famous paper.|a secondhand account
  I am a robot from the year 3000, and I came back in time to fix my grandmother's toaster.|a made-up story told with I
  We heard the bells ring out across the city. I jumped up and down, because the war was over at last.|a firsthand account
  When the war ended, bells rang in cities all across the country, and people danced in the streets.|a secondhand account
  I can talk to cats, and they have told me where the neighbor's lost cheese is hidden.|a made-up story told with I
  I was the first in my family to go to school. On the first day, I was so excited I could not eat my breakfast.|a firsthand account
  In those years, few children in the village went to school. She was the first in her family to do so.|a secondhand account
  I sailed my bathtub across the sea and landed on an island made of candy.|a made-up story told with I
  We watched the comet every night for a week. I drew it in my notebook, with its long, bright tail.|a firsthand account
  The comet was seen across the world that spring. Astronomers measured its tail at millions of kilometers long.|a secondhand account
  I woke up one morning and found that I could fly, so I flew to school above the traffic.|a made-up story told with I
  I ran the last mile with my legs burning. When I crossed the line, I could hardly believe I had won.|a firsthand account
  She won the race by only two seconds. Newspapers called it one of the closest finishes in history.|a secondhand account
  My shadow ran away from me today and went to play in the park without me.|a made-up story told with I
`;

const accountPairLines = `
  the great flood|I watched the water creep up our front steps, and I was so frightened I could not speak.|The flood covered three towns and forced ten thousand people from their homes.|how frightening it felt to watch the water rise|how many towns and people the flood affected|that there was a flood
  the first train in the town|The engine hissed and roared, and I hid behind my mother's skirt.|The railway reached the town in 1870 and doubled its trade within ten years.|how loud and scary the engine seemed to a child|how the railway changed the town's trade over ten years|that a train came to the town
  a total eclipse of the sun|When the sky went dark at noon, I felt a shiver run down my back.|The eclipse could be seen across five countries and lasted for four minutes.|the shiver the writer felt when the sky went dark|how many countries saw it and how long it lasted|that the sun went dark
  the opening of a great bridge|I walked across the new bridge with my grandfather, and he squeezed my hand and laughed.|The bridge took eight years to build and was the longest in the world when it opened.|the happy moment the writer shared with a grandfather|how long the bridge took to build and how long it was|that the bridge opened
  a volcano erupting|We felt the heat on our faces and heard a roar like a thousand drums.|The eruption buried two villages and sent ash as far as three hundred kilometers away.|the heat and noise the writer felt and heard|how far the ash traveled and how many villages were buried|that the volcano erupted
  the first day of a new school|My hands were shaking as I opened the door to the new classroom.|The new school opened with two hundred students and twelve teachers.|how nervous the writer felt walking in|how many students and teachers the school had|that a new school opened
  a famous concert|The music was so beautiful that I closed my eyes and forgot where I was.|Over fifty thousand people attended the concert, which raised money for hospitals.|how the music made the writer feel|how many people came and what the money was for|that a concert took place
  a great storm at sea|The waves tossed our ship like a toy, and I clung to the rail and prayed.|The storm sank eleven ships and was the worst the coast had seen in a century.|how terrified the writer was on the tossing ship|how many ships sank and how rare the storm was|that there was a storm at sea
  a parade for returning heroes|I waved my flag until my arm ached, and I shouted until my voice was gone.|The parade stretched for five kilometers and welcomed home three thousand soldiers.|how excited and tired the writer was from cheering|how long the parade was and how many soldiers returned|that there was a parade
  the first airplane flight seen in a town|My heart pounded as the plane bumped along the field and then rose into the air.|The flight lasted twelve minutes, and it led the town to build its first airfield.|how the writer's heart pounded at the sight|how long the flight lasted and what it led to|that an airplane flew over the town
  a fire in the market|I smelled the smoke first, and then I saw people running past me with their arms full of cloth.|The fire destroyed forty shops, but the market was rebuilt within a year.|what the writer smelled and saw in the first moments|how many shops burned and how soon they were rebuilt|that there was a fire in the market
  a long drought|Every morning I looked at the sky and hoped, but it stayed hard and blue.|The drought lasted three years and caused food prices across the country to double.|how the writer hoped for rain each morning|how long the drought lasted and what it did to prices|that it did not rain for a long time
  the arrival of the first ship of the year|We ran down to the harbor, laughing, because the ship would bring letters and oranges.|The first ship arrived each April, after the ice melted, carrying food and mail for the winter-long wait.|the joy the writer felt running to the harbor|when the ship came each year and what it carried|that the first ship arrived
  a solar-powered car race|I could hardly breathe as our little car crossed the finish line first.|Thirty teams from twelve countries raced cars powered only by sunlight across the desert.|how the writer felt at the finish line|how many teams and countries took part|that there was a race of solar cars
  a great snowfall|I stuck out my tongue to catch the flakes, and they tasted like cold air.|The snowfall closed every road in the region for a week.|how the snowflakes tasted to the writer|how long the roads in the region were closed|that a lot of snow fell
  the opening of a library|I held my very first library card and felt as rich as a king.|The library opened with ten thousand books and was paid for by the whole town.|how rich the writer felt holding a library card|how many books it had and who paid for it|that a library opened
`;

const accountPairs = fields(accountPairLines).map(([event, first, second, feeling, wider, both]) => {
  if (!event || !first || !second || !feeling || !wider || !both) throw new Error(`an account pair needs six fields: ${event}`);
  return { event, first, second, feeling, wider, both };
});

const accountPairText = (a: (typeof accountPairs)[number]) => `Account 1: ${a.first}\n\nAccount 2: ${a.second}`;

/** accountShowsBank asks what one kind of account shows that the other does not. */
const accountShowsBank: readonly Item[] = accountPairs.flatMap((a) => [
  {
    question: t(
      `Both accounts are about ${a.event}. What does the firsthand account (1) show that the secondhand account (2) does not?`,
      `两篇记述都和“${a.event}”有关。第一手记述（1）表现出了什么第二手记述（2）没有的内容？`,
    ),
    shown: accountPairText(a),
    right: a.feeling,
    wrong: [a.wider, a.both],
    why: t(
      `A firsthand account shows ${a.feeling}: only someone who was there can tell how it felt, sounded and looked to them.`,
      `第一手记述表现出了亲身感受：只有在场的人才能讲出那一刻对自己来说是什么感觉、什么声音、什么样子。`,
    ),
    whyNot: [
      t(
        "This comes from the secondhand account, which gives the wider view: numbers, causes and what happened later.",
        "这来自第二手记述，它提供的是更广的视角：数字、原因和后来发生的事。",
      ),
      t(
        "Both accounts tell this, so it is not something only the firsthand account shows.",
        "两篇记述都说了这一点，所以这不是只有第一手记述才有的。",
      ),
    ],
  },
  {
    question: t(
      `Both accounts are about ${a.event}. What does the secondhand account (2) show that the firsthand account (1) does not?`,
      `两篇记述都和“${a.event}”有关。第二手记述（2）表现出了什么第一手记述（1）没有的内容？`,
    ),
    shown: accountPairText(a),
    right: a.wider,
    wrong: [a.feeling, a.both],
    why: t(
      `A secondhand account shows ${a.wider}: written later from many sources, it can give the wider view that one person on the spot could not see.`,
      `第二手记述提供了更广的视角：它是后来根据许多资料写的，能看到现场一个人看不到的全貌。`,
    ),
    whyNot: [
      t(
        "This comes from the firsthand account: only the person who was there could tell how it felt.",
        "这来自第一手记述：只有在场的人才能讲出当时的感受。",
      ),
      t(
        "Both accounts tell this, so it is not something only the secondhand account shows.",
        "两篇记述都说了这一点，所以这不是只有第二手记述才有的。",
      ),
    ],
  },
]);

// Biography and autobiography.

const lifeKinds: Readonly<Record<string, Kind>> = {
  "a biography": {
    zh: "传记",
    is: [
      "Someone else tells a real person's life, in the third person: he, she, they.",
      "由别人用第三人称（he、she、they）讲述一个真实人物的一生。",
    ],
  },
  "an autobiography": {
    zh: "自传",
    is: ["A real person tells their own life, in the first person: I, me, my.", "由真实人物自己用第一人称（I、me、my）讲述自己的一生。"],
  },
  "a made-up story": {
    zh: "虚构故事",
    is: ["It tells of an invented character, with events that never happened.", "它讲的是虚构的人物，事件从未发生过。"],
  },
};

const lifeLines = `
  Marie Curie was born in Warsaw in 1867. As a girl she studied in secret, because women could not go to university there.|a biography
  I was born in Warsaw in 1867. As a girl I studied in secret, because women could not go to university there.|an autobiography
  Princess Glimmer was born in a castle made of clouds and could talk to every star in the sky.|a made-up story
  Louis Braille lost his sight when he was three years old. At twelve, he began to invent an alphabet of raised dots.|a biography
  I lost my sight when I was three. When I was twelve, I began to invent an alphabet of raised dots that I could feel.|an autobiography
  Tilly the talking tortoise decided one morning to race the wind all the way to the sea.|a made-up story
  Wangari Maathai grew up in Kenya, where she watched the forests near her home being cut down.|a biography
  When I was a girl in Kenya, I watched the forests near my home being cut down, and I felt my heart break.|an autobiography
  Captain Pip sailed a ship of paper across the bathtub ocean and fought a giant rubber duck.|a made-up story
  Zhang Heng was a scientist of the Han dynasty. In the year 132 he built a machine that could sense earthquakes.|a biography
  In the year 132, I finished the machine I had worked on for years: a jar that could sense earthquakes far away.|an autobiography
  The wizard Ozzle mixed a potion that turned every cloud in the kingdom into cotton candy.|a made-up story
  Mary Anning found her first great fossil on the beach at Lyme Regis when she was only twelve.|a biography
  I was only twelve when my brother and I found the great skull in the cliffs above the beach.|an autobiography
  Benny the bear opened a bakery in the forest and baked honey pies for every animal.|a made-up story
  Katherine Johnson worked out the paths of spacecraft by hand. Astronauts trusted her numbers with their lives.|a biography
  I checked the numbers again and again. I knew the astronauts were trusting me with their lives.|an autobiography
  The robot Clink could fold himself into a tiny box and mail himself to his friends.|a made-up story
  Tu Youyou studied old Chinese medicine books to find a cure for malaria.|a biography
  I read hundreds of old medicine books, looking for a single clue about how to cure malaria.|an autobiography
  The girl with the silver shoes could jump over houses, trees and even mountains.|a made-up story
  Ibn al-Haytham lived in Cairo a thousand years ago. He proved that we see because light enters our eyes.|a biography
  For years I studied light in a dark room. At last I understood that we see because light enters our eyes.|an autobiography
  A small cloud named Puff wanted more than anything to become a rainbow.|a made-up story
  Helen Keller could not see or hear, but her teacher taught her to spell words into her hand.|a biography
  I could not see or hear. Then one day my teacher spelled the word water into my hand, and the world opened up.|an autobiography
  The king's cat wore a golden crown and ruled the castle every night while the king slept.|a made-up story
  Nelson Mandela spent twenty-seven years in prison before he became the president of South Africa.|a biography
  I spent twenty-seven years in prison, but I never gave up hope that my country would be free.|an autobiography
  A pencil named Scribble drew a door on the wall and walked through it into another world.|a made-up story
  Frida Kahlo began to paint while she was in bed for months after a terrible accident.|a biography
  After the accident, I lay in bed for months. My mother hung a mirror above me, and I began to paint myself.|an autobiography
  The snowman Frost decided to take a holiday in the desert and wore sunglasses to the beach.|a made-up story
`;

const lifePairLines = `
  Louis Braille|how lonely he felt at school before he could read|how many countries use his alphabet today|that he invented an alphabet of raised dots
  Marie Curie|what she was thinking the night she first saw her glowing samples|how scientists honored her after she died|that she studied radium
  Wangari Maathai|how planting her first tree made her feel|how many millions of trees were planted after her death|that she started a movement to plant trees
  Mary Anning|what she dreamed about as she walked the beach each morning|how scientists of later years judged her finds|that she found fossils on the beach
  Katherine Johnson|how nervous she felt while she checked the numbers|what other people at NASA said about her work|that she worked out the paths of spacecraft
  Tu Youyou|what went through her mind when the cure first worked|how many lives her cure has saved since|that she found a cure for malaria
  Zhang Heng|why he decided to build the earthquake detector|how later inventors improved on his idea|that he built an earthquake detector
  Helen Keller|what the moment of first understanding a word felt like|how her life inspired other people after she died|that she learned to spell words with her hands
  Nelson Mandela|what he hoped for during his long nights in prison|how the world remembered him after he died|that he spent many years in prison
  Frida Kahlo|why she chose to paint herself again and again|how much her paintings are worth today|that she painted many pictures of herself
  Ibn al-Haytham|the doubts he had before his experiments worked|how scientists in Europe used his books centuries later|that he studied light
  Jane Goodall|the excitement she felt when a chimpanzee first came close|what other scientists said about her methods|that she studied chimpanzees in Africa
  Isaac Newton|what he was thinking when the idea of gravity came to him|how his ideas changed science after he died|that he wrote about gravity
  Rosa Parks|how afraid she felt as she refused to give up her seat|how her act changed the laws of her country|that she refused to give up her seat on a bus
  Zheng He|how he felt standing on the deck of his great ship|what historians later wrote about his voyages|that he led great voyages across the ocean
  Ada Lovelace|what she imagined computers might one day do|how a computer language was named after her|that she wrote about a calculating machine
`;

const lifePairs = fields(lifePairLines).map(([person, inner, later, both]) => {
  if (!person || !inner || !later || !both) throw new Error(`a life line needs four fields: ${person}`);
  return { person, inner, later, both };
});

/** lifeTellsBank asks what an autobiography can tell that a biography cannot, and the other way round. */
const lifeTellsBank: readonly Item[] = lifePairs.flatMap((p) => [
  {
    question: t(
      `What could ${p.person}'s autobiography tell that a biography could not?`,
      `${p.person} 的自传能讲出什么传记讲不出的内容？`,
    ),
    shown: "",
    right: p.inner,
    wrong: [p.later, p.both],
    why: t(
      `An autobiography could tell ${p.inner}. Only the person can tell their own thoughts and feelings from the inside.`,
      `自传能讲出人物内心的想法和感受。只有本人才能从内心讲出自己的思想和感觉。`,
    ),
    whyNot: [
      t(
        "The person could not write about this, because it happened after they died or after their own story was written. Only a biography can tell it.",
        "本人写不了这个，因为它发生在本人去世之后，或者在自传写完之后。只有传记才能讲。",
      ),
      t(
        "Both kinds can tell this basic fact, so it is not something only an autobiography can tell.",
        "两种都能讲出这个基本事实，所以这不是只有自传才能讲的。",
      ),
    ],
  },
  {
    question: t(
      `What could a biography of ${p.person} tell that the autobiography could not?`,
      `一本关于 ${p.person} 的传记能讲出什么自传讲不出的内容？`,
    ),
    shown: "",
    right: p.later,
    wrong: [p.inner, p.both],
    why: t(
      `A biography could tell ${p.later}. Written by someone else, often years later, it can show how others saw the person and what happened after their life.`,
      `传记能讲出别人怎样看待这个人，以及他们去世后发生的事。它由别人写，常常在多年以后。`,
    ),
    whyNot: [
      t(
        "This is the person's own inner feeling. A biographer can only guess at it, but the person could tell it in an autobiography.",
        "这是本人内心的感受。传记作者只能猜测，而本人可以在自传里讲出来。",
      ),
      t(
        "Both kinds can tell this basic fact, so it is not something only a biography can tell.",
        "两种都能讲出这个基本事实，所以这不是只有传记才能讲的。",
      ),
    ],
  },
]);

/** historyTopics4 are the reading topics of grade 4 about the past and about lives. */
export const historyTopics4: readonly TopicDef[] = [
  {
    id: "historical-fiction-facts-and-inventions",
    title: t("Facts and Inventions in Historical Fiction", "历史小说中的事实与虚构"),
    summary: t("A historical story puts invented characters in a real time and place.", "历史故事把虚构的人物放在真实的时代和地点中。"),
    prerequisites: after("fiction-and-nonfiction"),
    encompasses: [],
    xp: 14,
    strand: "reading",
    knowledgePoints: [
      point(
        "facts-and-invented-details",
        t("Facts and Invented Details", "事实和虚构的细节"),
        t(
          "**Historical fiction** is a story set in a real time and place. Some details are **facts** that history records: Marco Polo set out for China in 1271. Others are **invented** to make the story live: a friend named Tito who sang to the sailors. A careful author never puts in a thing that did not exist yet, such as a wristwatch in the 1200s.",
          "**历史小说**是以真实时代和地点为背景的故事。有些细节是历史记载的**事实**：马可·波罗 1271 年出发去中国。有些是为了让故事生动而**虚构**的：一个叫 Tito、给水手唱歌的朋友。细心的作者绝不会写进当时还不存在的东西，比如 13 世纪的手表。",
        ),
        nameKind({
          lines: historyLines,
          kinds: historyKinds,
          name: ["This sentence is from a historical story. What is it?", "这个句子出自一个历史故事。它属于哪一种？"],
          find: (en, zh) => [`Which sentence of a historical story is ${en}?`, `历史故事中的哪个句子是${zh}？`],
        }),
      ),
      point(
        "checking-a-detail-against-a-text",
        t("Checking a Detail Against a Text", "用文章核对细节"),
        t(
          "To check a detail of a historical story, read an informational text about the same time. If the text says the same thing, it **confirms** the detail. If it says something different, it **contradicts** it. If it says nothing about it, the detail may be the author's invention, and the text **does not mention** it.",
          "要核对历史故事中的一个细节，就读一篇关于同一时代的信息类文章。如果文章说的一样，就**证实**了这个细节；如果说的不一样，就**与它矛盾**；如果完全没提到，这个细节可能是作者虚构的，文章**没有提到**它。",
        ),
        itemGenerator(checkBank),
      ),
    ],
  },
  {
    id: "how-setting-shapes-a-story",
    title: t("How Setting Shapes a Story", "背景如何塑造故事"),
    summary: t(
      "The time and place of a story decide what its characters can do and what problems they face.",
      "故事的时间和地点决定了角色能做什么、会遇到什么问题。",
    ),
    prerequisites: after("setting-problem-and-solution"),
    encompasses: [],
    xp: 14,
    strand: "reading",
    knowledgePoints: [
      point(
        "how-a-setting-causes-a-problem",
        t("How a Setting Causes a Problem", "背景怎样引起问题"),
        t(
          "The **setting** is when and where a story happens, and it is more than a background. A blizzard on the prairie in 1880, with no phones and no neighbors near, gives a girl a problem she could not have in a city today. Ask what the time and place give the characters, and what they take away.",
          "**背景**是故事发生的时间和地点，它不只是陪衬。1880 年草原上的暴风雪，没有电话，附近也没有邻居，给女孩带来的问题在今天的城市里不会有。问问时间和地点给了角色什么，又让他们缺少什么。",
        ),
        itemGenerator(settingProblemBank),
      ),
      point(
        "the-story-in-another-setting",
        t("The Story in Another Setting", "换一个背景的故事"),
        t(
          "To see how much a setting matters, imagine the story somewhere else or at another time. If the island boy lived next to a hospital, his long wait for the ferry would vanish. When the setting changes, the problem and the events change with it.",
          "要看出背景有多重要，就想象故事发生在别的地方或别的时代。如果岛上的男孩住在医院旁边，他漫长地等渡船的事就不会发生。背景一变，问题和情节也跟着变。",
        ),
        itemGenerator(settingChangeBank),
      ),
    ],
  },
  {
    id: "firsthand-and-secondhand-accounts",
    title: t("Firsthand and Secondhand Accounts", "第一手和第二手记述"),
    summary: t(
      "A firsthand account is written by someone who was there; a secondhand account is written later by someone who learned about it.",
      "第一手记述由在场的人写；第二手记述由后来了解此事的人写。",
    ),
    prerequisites: ["point-of-view"],
    encompasses: [{ topic: "point-of-view", weight: 0.2 }],
    xp: 14,
    strand: "reading",
    knowledgePoints: [
      point(
        "which-kind-of-account",
        t("Which Kind of Account", "哪一种记述"),
        t(
          "A **firsthand account** of a real event is written by someone who was there, so it uses *I* and *we*: *We felt the ground shake.* A **secondhand account** is written later by someone who learned about it from others, using *he*, *she* and *they*. Careful: a made-up story can use *I* too, but its events are invented.",
          "真实事件的**第一手记述**由在场的人写，所以用 *I* 和 *we*：*We felt the ground shake.* **第二手记述**由后来从别人那里了解此事的人写，用 *he*、*she* 和 *they*。注意：虚构故事也可以用 *I*，但它的事件是编造的。",
        ),
        nameKind({
          lines: accountLines,
          kinds: accountKinds,
          name: ["What kind of text is this?", "这是哪一种文字？"],
          find: (en, zh) => [`Which of these is ${en}?`, `下面哪一段是${zh}？`],
        }),
      ),
      point(
        "what-each-account-shows",
        t("What Each Account Shows", "每种记述表现的内容"),
        t(
          "Each kind of account shows what the other cannot. A firsthand account gives the **feelings** and the sights and sounds of one person on the spot. A secondhand account gives the **wider view**: numbers, causes and what happened afterward, gathered from many sources.",
          "每种记述都能表现另一种表现不了的内容。第一手记述给出在场者的**感受**和所见所闻。第二手记述给出**更广的视角**：从许多资料中收集到的数字、原因和后来发生的事。",
        ),
        itemGenerator(accountShowsBank),
      ),
    ],
  },
  {
    id: "biography-or-autobiography",
    title: t("Lives Told by Others and by Themselves", "他人讲述的人生与自己讲述的人生"),
    summary: t(
      "A biography tells a person's life in the third person; an autobiography is told by the person in the first person.",
      "传记用第三人称讲述一个人的一生；自传由本人用第一人称讲述。",
    ),
    prerequisites: after("point-of-view", "fiction-and-nonfiction"),
    encompasses: [],
    xp: 14,
    strand: "reading",
    knowledgePoints: [
      point(
        "telling-which-life-story-it-is",
        t("Telling Which Life Story It Is", "分辨是哪一种人生故事"),
        t(
          "A **biography** is the true story of a person's life written by someone else, in the third person: *Louis Braille lost his sight when he was three.* An **autobiography** is written by the person themselves, in the first person: *I lost my sight when I was three.* A made-up story may look like either, but its character never lived.",
          "**传记**是由别人写的一个人真实的生平，用第三人称：*Louis Braille lost his sight when he was three.* **自传**由本人自己写，用第一人称：*I lost my sight when I was three.* 虚构故事可能看起来像这两种之一，但其中的人物从未存在过。",
        ),
        nameKind({
          lines: lifeLines,
          kinds: lifeKinds,
          name: ["What is this passage?", "这段文字属于哪一种？"],
          find: (en, zh) => [`Which passage is ${en}?`, `哪段文字是${zh}？`],
        }),
      ),
      point(
        "what-each-life-story-can-tell",
        t("What Each Life Story Can Tell", "每种人生故事能讲什么"),
        t(
          "An autobiography can tell what only the person knows: their own thoughts, feelings and memories. A biography, written by someone else and often later, can tell what the person could not: how others saw them, and what happened after they died. Both can tell the main facts of the life.",
          "自传能讲出只有本人知道的东西：自己的想法、感受和回忆。传记由别人写，常常在后来才写，能讲出本人讲不了的东西：别人怎样看待他们，以及他们去世后发生的事。两者都能讲出生平的主要事实。",
        ),
        itemGenerator(lifeTellsBank),
      ),
    ],
  },
];
