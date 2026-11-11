// Grade 5: writing judged by a model, part one: a write-up of an experiment, an answer with evidence from a text, a
// report of three paragraphs, an opinion piece and writing about two texts.

import { type CriterionSpec, type TopicDef, t } from "@ga/content";
import { criterionById, point, type WritingItem, writingGenerator } from "@ga/subject-english";
import { after } from "./links.ts";

/** criterion finds a criterion by its id, failing when there is none. */
export const criterion = (id: string): CriterionSpec => {
  const found = criterionById(id);
  if (!found) throw new Error(`unknown criterion ${id}`);
  return found;
};

/** quoted quotes every line of a model, so that a model of several paragraphs stays one quotation. */
const quoted = (model: string) =>
  model
    .split("\n")
    .map((line) => (line ? `> ${line}` : ">"))
    .join("\n");

/** onePiece shows the model of a task after a verdict. */
export const onePiece = (model: string) => t(`One good answer:\n\n${quoted(model)}`, `一个好的答案：\n\n${quoted(model)}`);

/** labBank gives the notes of a kitchen experiment to write up. */
const labBank: readonly WritingItem[] = [
  {
    task: "Write up this experiment from the notes. Notes: question, does salt make ice melt faster? Two ice cubes on two plates, salt sprinkled on one. Checked every 5 minutes. Salted cube gone at 20 minutes, plain cube gone at 35 minutes.",
    model:
      "Question: Does salt make ice melt faster?\n\nMethod: First, we put two ice cubes of the same size on two plates. Next, we sprinkled a spoonful of salt on one cube and left the other plain. Then we checked both cubes every five minutes.\n\nResults: The salted cube had melted completely after 20 minutes. The plain cube took 35 minutes to melt.\n\nConclusion: Salt makes ice melt faster, because the salted cube melted 15 minutes sooner than the plain one.",
  },
  {
    task: "Write up this experiment from the notes. Notes: question, does yeast need sugar to make gas? Two bottles of warm water with yeast, sugar in one. Balloon over each neck. After 30 minutes, the sugar balloon was the size of a fist, the other stayed flat.",
    model:
      "Question: Does yeast need sugar to make gas?\n\nMethod: We filled two bottles with the same amount of warm water and added a spoonful of yeast to each. We stirred two spoonfuls of sugar into only one bottle. Then we stretched a balloon over the neck of each bottle and waited 30 minutes.\n\nResults: The balloon on the bottle with sugar grew to the size of a fist. The balloon on the other bottle stayed flat.\n\nConclusion: Yeast needs sugar to make gas. Only the yeast that was fed sugar filled its balloon.",
  },
  {
    task: "Write up this experiment from the notes. Notes: question, which dissolves faster in water, sugar or salt? One spoonful each in two glasses of room-temperature water, stirred ten times. Sugar dissolved in 40 seconds, salt in 65 seconds.",
    model:
      "Question: Which dissolves faster in water, sugar or salt?\n\nMethod: We poured the same amount of room-temperature water into two glasses. We added one spoonful of sugar to the first glass and one spoonful of salt to the second. We stirred each glass ten times and timed how long it took until we could see no grains.\n\nResults: The sugar dissolved in 40 seconds. The salt took 65 seconds.\n\nConclusion: In our test, sugar dissolved faster than salt, by 25 seconds.",
  },
  {
    task: "Write up this experiment from the notes. Notes: question, does bread grow mold faster when it is damp? Two slices in sealed bags, one sprinkled with water. Checked each day. Mold on damp slice on day 3, on dry slice on day 8.",
    model:
      "Question: Does bread grow mold faster when it is damp?\n\nMethod: We put two slices of the same bread into two sealed bags. Before sealing one bag, we sprinkled its slice with a little water. We kept both bags in the same cupboard and checked them every day.\n\nResults: Green spots of mold appeared on the damp slice on day 3. The dry slice showed no mold until day 8.\n\nConclusion: Damp bread grows mold faster, since mold appeared on it five days before it appeared on the dry bread.",
  },
  {
    task: "Write up this experiment from the notes. Notes: question, does an egg float in salt water? Egg in a glass of tap water: sank. Stirred in salt a spoonful at a time. After 6 spoonfuls the egg floated.",
    model:
      "Question: Does an egg float in salt water?\n\nMethod: First, we placed a raw egg in a glass of tap water. Then we took the egg out, stirred in one spoonful of salt, and put the egg back. We repeated this, one spoonful at a time, until something changed.\n\nResults: In plain tap water, the egg sank to the bottom. After we had added six spoonfuls of salt, the egg floated.\n\nConclusion: An egg floats in salt water if the water is salty enough. Adding salt changed the sinking egg into a floating one.",
  },
  {
    task: "Write up this experiment from the notes. Notes: question, does ice melt faster in water or in air? One cube in a glass of water, one cube in an empty glass, same room. Cube in water gone at 12 minutes, cube in air at 40 minutes.",
    model:
      "Question: Does ice melt faster in water or in air?\n\nMethod: We took two ice cubes of the same size. We dropped one into a glass of room-temperature water and put the other into an empty glass. We left both glasses side by side in the same room and checked them often.\n\nResults: The cube in water had melted after 12 minutes. The cube in the empty glass took 40 minutes.\n\nConclusion: Ice melts faster in water than in air, because the cube in water melted in less than a third of the time.",
  },
  {
    task: "Write up this experiment from the notes. Notes: question, which keeps a drink cold longer, a foil wrap or a wool sock? Three cans of cold water: one in foil, one in a sock, one bare. Temperature after one hour: foil 14°C, sock 10°C, bare 17°C.",
    model:
      "Question: Which keeps a drink cold longer, a foil wrap or a wool sock?\n\nMethod: We filled three cans with water from the fridge. We wrapped one can in foil, pulled a wool sock over the second, and left the third bare. After one hour, we measured the temperature of the water in each can.\n\nResults: The water in the sock was 10°C, the water in foil was 14°C, and the water in the bare can was 17°C.\n\nConclusion: The wool sock kept the drink cold longest, and both wrappings worked better than nothing.",
  },
  {
    task: "Write up this experiment from the notes. Notes: question, does vinegar make a chicken bone bendy? One bone in a jar of vinegar, one bone in a jar of water. Left for 3 days. Vinegar bone bent easily, water bone stayed hard.",
    model:
      "Question: Does vinegar make a chicken bone bendy?\n\nMethod: We cleaned two chicken bones. We put one bone into a jar of vinegar and the other into a jar of water, and we closed both jars. After three days, we took out the bones, rinsed them and tried to bend each one gently.\n\nResults: The bone from the vinegar bent easily, like rubber. The bone from the water stayed hard and would not bend.\n\nConclusion: Vinegar makes a chicken bone bendy, since only the bone left in vinegar changed.",
  },
  {
    task: "Write up this experiment from the notes. Notes: question, do raisins rise in fizzy water? Five raisins in plain water, five in fizzy water. Plain: all stayed at the bottom. Fizzy: bubbles stuck to them, they rose and sank again and again for 10 minutes.",
    model:
      "Question: Do raisins rise in fizzy water?\n\nMethod: We poured plain water into one glass and fizzy water into another. Then we dropped five raisins into each glass and watched them for ten minutes.\n\nResults: In the plain water, all five raisins stayed at the bottom. In the fizzy water, bubbles stuck to the raisins, and they rose to the top, dropped back down and rose again for the whole ten minutes.\n\nConclusion: Raisins rise in fizzy water, because the bubbles that cling to them carry them up.",
  },
  {
    task: "Write up this experiment from the notes. Notes: question, does a paper towel soak up more water than a cloth? Each dipped in a bowl for 10 seconds, squeezed into a measuring cup. Paper towel: 30 mL. Cloth: 55 mL.",
    model:
      "Question: Does a paper towel soak up more water than a cloth?\n\nMethod: We cut a paper towel and a kitchen cloth to the same size. We dipped each one into a bowl of water for ten seconds. Then we squeezed each one out into a measuring cup and read the amount.\n\nResults: The paper towel gave 30 mL of water. The cloth gave 55 mL.\n\nConclusion: No, the paper towel did not soak up more. The cloth held almost twice as much water.",
  },
  {
    task: "Write up this experiment from the notes. Notes: question, do warm water and cold water mix food coloring at the same speed? A drop of blue in a glass of hot tap water and in a glass of cold water. Hot: whole glass blue in 1 minute. Cold: 6 minutes.",
    model:
      "Question: Does food coloring spread at the same speed in warm water and in cold water?\n\nMethod: We filled one glass with hot tap water and another with cold water from the fridge. At the same moment, we dropped one drop of blue food coloring into each glass. We did not stir, and we timed how long it took for each glass to turn blue all through.\n\nResults: The hot water turned blue in 1 minute. The cold water took 6 minutes.\n\nConclusion: No, food coloring spreads much faster in warm water than in cold water.",
  },
  {
    task: "Write up this experiment from the notes. Notes: question, does a candle burn longer under a big jar or a small jar? Same candles, lit, covered at once. Small jar: flame out at 8 seconds. Big jar: 21 seconds.",
    model:
      "Question: Does a candle burn longer under a big jar or a small jar?\n\nMethod: With an adult's help, we lit two candles of the same size. At the same moment, we covered one with a small jar and the other with a big jar. We timed how long each flame lasted.\n\nResults: The flame under the small jar went out after 8 seconds. The flame under the big jar lasted 21 seconds.\n\nConclusion: A candle burns longer under a big jar. The big jar holds more air, so the flame had more air to use.",
  },
];

/** responseBank asks a question about a passage, to be answered with evidence from it. */
const responseBank: readonly WritingItem[] = [
  {
    task: "Why did Anna's grandfather keep the old map? Answer in three to five sentences with evidence from the passage.",
    source:
      'Anna found the map in a tin box under Grandpa\'s bed. It was torn at the folds, and someone had drawn a small red cross beside a river. "That was the farm where I grew up," Grandpa said, touching the cross. "The river took it in the flood of 1952. Nothing is left there now but fields." He folded the map carefully along its old creases. "When I look at it, I can still hear my mother calling us in for supper."',
    model:
      'Grandpa kept the old map because it helped him remember his childhood home. He says the red cross marks "the farm where I grew up," which a flood destroyed in 1952. Since the farm is gone, the map is the only way he can still see it. He even says that looking at it lets him "still hear my mother calling us in for supper," so the map keeps his memories alive.',
  },
  {
    task: "How does Leo feel about the swimming race at the end of the passage? Answer in three to five sentences with evidence from the passage.",
    source:
      "Leo touched the wall and looked up at the board. Fourth. His shoulders sank for a moment. Then he saw the time beside his name: 1:12, three whole seconds faster than he had ever swum. Coach Rivera was waving from the side of the pool. Leo pulled off his goggles and grinned so wide that his cheeks hurt.",
    model:
      'At the end of the passage, Leo feels proud and happy about the race, even though he did not win. At first he is disappointed, because "his shoulders sank" when he saw he came fourth. Then he sees that his time was "three whole seconds faster" than ever. He "grinned so wide that his cheeks hurt," which shows that beating his own best time matters more to him than his place.',
  },
  {
    task: "Why were the Inca roads important to the empire? Answer in three to five sentences with evidence from the passage.",
    source:
      "The Inca built more than 30,000 kilometers of roads through the Andes Mountains. Rope bridges hung across deep gorges, and stone steps climbed the steepest slopes. Every few kilometers stood a small rest house. There, relay runners waited to carry messages to the next house, so news could travel 240 kilometers in a single day. Armies marched along the roads, and llamas carried food from the farms to the cities.",
    model:
      'The Inca roads were important because they held the huge empire together. They let news travel quickly: relay runners could carry a message "240 kilometers in a single day." The roads also moved armies and food, since "llamas carried food from the farms to the cities." Without the roads, the rulers could not have sent orders, soldiers or supplies across such steep mountains.',
  },
  {
    task: "What is the main lesson that Mr. Okafor teaches Sam? Answer in three to five sentences with evidence from the passage.",
    source:
      'Sam threw down the hammer. "The birdhouse is crooked. I\'ll never get it right." Mr. Okafor picked up the hammer and turned it over in his hands. "My first birdhouse fell apart in the rain," he said. "My second one leaned like a tired old man." He smiled. "The third one is still on my porch, twenty years later. Shall we take this one apart and try again?" Sam looked at the wood for a long time. Then he reached for the pliers.',
    model:
      'Mr. Okafor teaches Sam that making mistakes is part of learning to do something well. He tells Sam that his first birdhouse "fell apart in the rain" and his second one leaned. Only his third one lasted, and it is still on his porch after twenty years. By sharing his own failures, he shows Sam that trying again is how people improve, and Sam reaches for the pliers to start over.',
  },
  {
    task: "How did the people of Tenochtitlan grow enough food on a lake? Answer in three to five sentences with evidence from the passage.",
    source:
      "Tenochtitlan, the capital of the Aztec, was built on an island in Lake Texcoco. There was little dry land for farms, so the Aztec made their own. They wove reeds into large mats, anchored them in the shallow water and piled mud from the lake bottom on top. These floating gardens were called chinampas. Their soil stayed wet and rich, and farmers could harvest crops of maize, beans and flowers up to seven times a year.",
    model:
      'The people of Tenochtitlan grew food by building their own farmland on the lake. They made "floating gardens" called chinampas by weaving reeds into mats and piling mud on top. The passage says the soil "stayed wet and rich," which means the plants always had water. Because of this, farmers could harvest crops "up to seven times a year," which was enough to feed a large city.',
  },
  {
    task: "What does the passage suggest about why Pasteur's work was trusted? Answer in three to five sentences with evidence from the passage.",
    source:
      "Louis Pasteur did not believe a result until he had seen it many times. When he tested whether germs in the air spoiled broth, he boiled flasks of broth and left some open and some sealed. He repeated the test in his lab, in the countryside and even high on a mountain. Every time, only the open flasks spoiled. Other scientists could repeat his tests and get the same results, and in the end even those who had doubted him agreed.",
    model:
      'The passage suggests that Pasteur\'s work was trusted because he tested his ideas again and again. He repeated his broth test in his lab, in the countryside and "even high on a mountain," and the result was always the same. Also, "other scientists could repeat his tests and get the same results." When anyone can repeat an experiment and see the same thing, people have good reason to believe it.',
  },
  {
    task: "Why does Maya decide to stay with the canoe? Answer in three to five sentences with evidence from the passage.",
    source:
      'The canoe had tipped over in the middle of the lake. Maya clung to its side, gasping. The shore looked close, but she remembered what the ranger had said: "The shore is always farther than it looks, and cold water steals your strength." The canoe floated high, and her life jacket held her up. She could see the orange flag of the ranger station. Maya wrapped her arms around the canoe and began to kick slowly toward it.',
    model:
      'Maya decides to stay with the canoe because she remembers the ranger\'s warning. The ranger had said that "the shore is always farther than it looks, and cold water steals your strength." This tells her that swimming alone could leave her too tired to reach land. The canoe "floated high" and could hold her up, so staying with it was the safer way to get to the ranger station.',
  },
  {
    task: "What does the diary entry show about school in 1850? Answer in three to five sentences with evidence from the passage.",
    source:
      "March 3, 1850. Walked the two miles to school through the mud. Teacher had me carry in wood for the stove, as it is my week. There are twenty-two of us in the one room, from little Ada, who is five, to Tom Hale, who is fourteen. We have only six readers, so we share. I recited my lesson on the rivers of the country and did not miss one. Home by four to help with the milking.",
    model:
      'The diary entry shows that school in 1850 was simple and children worked hard. The writer "walked the two miles to school through the mud" and carried wood for the stove. All the students were in "the one room," from age five to fourteen, so children of every age learned together. They had "only six readers," which means books were scarce and had to be shared.',
  },
  {
    task: "Why did the town choose to build a suspension bridge? Answer in three to five sentences with evidence from the passage.",
    source:
      "The river at Millbrook is 600 meters wide and runs fast and deep. Engineers said that a beam bridge would need many pillars in the water, and the strong current would wear them away. An arch bridge could not stretch that far. A suspension bridge, they explained, hangs its road from cables strung between two tall towers, one on each bank. It needs no pillars in the middle of the river at all. The town council voted for the suspension bridge.",
    model:
      'The town chose a suspension bridge because it was the only kind that suited the wide, fast river. A beam bridge would need many pillars, and the engineers said the current would "wear them away." An arch bridge "could not stretch that far." A suspension bridge "needs no pillars in the middle of the river at all," so it avoided both problems.',
  },
  {
    task: "What is the most important clue the detective notices, and why? Answer in three to five sentences with evidence from the passage.",
    source:
      "The cake had vanished from the kitchen table. Inspector Lin looked around. The window was shut and locked from the inside. The cook said she had been in the garden all morning, yet her shoes were dry, though the grass was wet with rain. On the floor, a trail of crumbs led not to the window but to the pantry door. Lin smiled and opened the pantry. There sat the cook's dog, licking frosting from its nose.",
    model:
      'The most important clue is the trail of crumbs that leads to the pantry door. The window was "shut and locked from the inside," so no thief came in from outside. The crumbs went "not to the window but to the pantry door," which shows the cake was carried somewhere inside the house. That clue leads Inspector Lin straight to the dog, which is the real thief.',
  },
  {
    task: "How does the author show that tardigrades are tough? Answer in three to five sentences with evidence from the passage.",
    source:
      "Tardigrades are tiny animals, less than a millimeter long, that live in moss and wet soil. They may be small, but they are among the toughest creatures on Earth. When their home dries out, they curl into a ball and almost stop living. In that state they can survive being frozen to minus 270 degrees, heated past the boiling point of water and even sent into space. Add a drop of water, and they uncurl and walk away.",
    model:
      'The author shows that tardigrades are tough by listing the extreme dangers they can survive. The passage says they can live through being "frozen to minus 270 degrees" and "heated past the boiling point of water." They even survived being "sent into space," where almost nothing can live. These examples prove that, although tardigrades are tiny, they can survive almost anything.',
  },
  {
    task: "Why did the lighthouse keeper's daughter climb the tower? Answer in three to five sentences with evidence from the passage.",
    source:
      "The storm had blown out the great lamp, and Father lay in bed with a fever. Through the window, Ida saw the lights of a ship moving toward the rocks. No one else was there. She took the old oil lantern from its hook, wrapped her shawl around it against the wind and climbed the hundred steps. At the top she lit the lantern and held it high in the window. Slowly, the ship's lights turned away from the rocks.",
    model:
      'Ida climbed the tower to warn a ship that was heading for the rocks. The storm "had blown out the great lamp," and her father was too ill to help, so "no one else was there." She knew the ship needed a light to see the danger. When she held up the lantern, "the ship\'s lights turned away from the rocks," which shows her climb saved it.',
  },
];

/** reportBank asks for a report of three paragraphs on a planet or a mission, from given notes. */
const reportBank: readonly WritingItem[] = [
  {
    task: "Write a report of three paragraphs on Mars: an introduction that hooks and previews, a body paragraph for each main point, and a conclusion. Use these notes: Mars looks red because its soil holds rusty iron; dust storms can cover the whole planet; Olympus Mons is the tallest volcano in the solar system; rovers such as Perseverance drill rocks and look for signs of ancient life.",
    model:
      "Imagine a planet where a single dust storm can swallow the whole world. That planet is Mars. This report explains what Mars is like and how rovers are exploring it.\n\nMars is a cold, dusty planet. It looks red because its soil is full of iron that has rusted. Its dust storms can grow until they cover the entire planet for weeks. Mars also has Olympus Mons, the tallest volcano in the solar system, nearly three times as high as Mount Everest.\n\nScientists study Mars with rovers, robots that drive across its surface. The rover Perseverance drills into rocks and collects samples. It is looking for signs that tiny living things existed on Mars long ago.\n\nMars is a red, stormy world with giant volcanoes, and rovers are slowly uncovering its secrets.",
  },
  {
    task: "Write a report of three paragraphs on the Apollo 11 mission: an introduction that hooks and previews, a body paragraph for each main point, and a conclusion. Use these notes: launched July 16, 1969; crew Neil Armstrong, Buzz Aldrin, Michael Collins; Armstrong and Aldrin landed in the Eagle on July 20; they collected 21.5 kg of moon rock; they returned safely on July 24.",
    model:
      "On July 20, 1969, about 600 million people watched a fuzzy picture on their televisions as a man stepped onto the moon. This report explains the Apollo 11 journey and what the astronauts did on the moon.\n\nApollo 11 launched from Florida on July 16, 1969. Its crew was Neil Armstrong, Buzz Aldrin and Michael Collins. Four days later, Armstrong and Aldrin flew a small lander called the Eagle down to the moon's surface, while Collins circled above.\n\nOn the moon, the two astronauts walked, planted a flag and set up experiments. They collected 21.5 kilograms of moon rock for scientists to study. Then they rejoined Collins, and all three splashed down safely on July 24.\n\nApollo 11 carried three men to the moon and back and brought home rocks that scientists still study today.",
  },
  {
    task: "Write a report of three paragraphs on Jupiter: an introduction that hooks and previews, a body paragraph for each main point, and a conclusion. Use these notes: largest planet, more than 1,300 Earths could fit inside; made mostly of gas; the Great Red Spot is a storm bigger than Earth; at least 95 moons; Europa may have an ocean under its ice.",
    model:
      "If Jupiter were a hollow ball, more than 1,300 Earths could fit inside it. This report describes the giant planet itself and then its many moons.\n\nJupiter is the largest planet in the solar system. Unlike Earth, it has no solid ground, because it is made mostly of gas. Its most famous feature is the Great Red Spot, a storm so wide that Earth could fit inside it, and it has raged for hundreds of years.\n\nJupiter also has at least 95 moons. One of them, Europa, is covered in ice. Scientists think a salty ocean may lie under that ice, which makes Europa one of the best places to search for life beyond Earth.\n\nJupiter is a giant of gas and storms, and its moons may hold some of the solar system's greatest surprises.",
  },
  {
    task: "Write a report of three paragraphs on the Hubble Space Telescope: an introduction that hooks and previews, a body paragraph for each main point, and a conclusion. Use these notes: launched in 1990; orbits above the air, so its pictures are sharp; first pictures were blurry because of a faulty mirror; astronauts repaired it in 1993; it helped measure the age of the universe, about 13.8 billion years.",
    model:
      "When the Hubble Space Telescope sent back its first pictures, scientists were horrified: they were blurry. This report tells how Hubble was rescued and what it has discovered.\n\nHubble was launched in 1990. It orbits Earth above the air, which blurs the view of telescopes on the ground. But a mirror inside it had been shaped wrongly, so its first pictures were out of focus. In 1993, astronauts flew up to the telescope and fitted new parts that corrected the fault.\n\nSince then, Hubble has taken some of the sharpest pictures of space ever made. It photographed galaxies far beyond our own. Its measurements helped scientists work out that the universe is about 13.8 billion years old.\n\nHubble began with a serious mistake, but once it was repaired, it changed what we know about the universe.",
  },
  {
    task: "Write a report of three paragraphs on Saturn: an introduction that hooks and previews, a body paragraph for each main point, and a conclusion. Use these notes: sixth planet from the sun; its rings are made of ice and rock, some pieces as small as dust, some as big as houses; it is so light it would float in a giant bathtub; the Cassini spacecraft studied it from 2004 to 2017.",
    model:
      "Saturn is so light for its size that, in a bathtub big enough, it would float. This report looks at Saturn's famous rings and at the spacecraft that studied them.\n\nSaturn is the sixth planet from the sun, and its rings make it easy to recognize. The rings are not solid. They are made of countless pieces of ice and rock, some as small as specks of dust and some as large as houses, all circling the planet.\n\nFrom 2004 to 2017, the Cassini spacecraft orbited Saturn. It took close pictures of the rings and of Saturn's moons. At the end of its mission, Cassini dived into Saturn's clouds, sending back information until the very last moment.\n\nSaturn's icy rings are one of the wonders of the solar system, and Cassini showed them to us as never before.",
  },
  {
    task: "Write a report of three paragraphs on the International Space Station: an introduction that hooks and previews, a body paragraph for each main point, and a conclusion. Use these notes: astronauts have lived on it since 2000; it circles Earth every 90 minutes, about 16 sunrises a day; built by 15 countries; astronauts exercise two hours a day because muscles weaken without gravity; they grow plants to learn about farming in space.",
    model:
      "Astronauts on the International Space Station see about sixteen sunrises every day. This report explains what the station is and what daily life is like on board.\n\nThe International Space Station is a laboratory that circles Earth every 90 minutes. Fifteen countries worked together to build it, and astronauts have lived on it without a break since the year 2000.\n\nLife on the station is very different from life on Earth. Without gravity, muscles and bones grow weak, so astronauts exercise for two hours every day. They also run experiments, such as growing plants, to learn how people might one day farm in space.\n\nThe space station shows what countries can build together, and it teaches us how humans can live away from Earth.",
  },
  {
    task: "Write a report of three paragraphs on Venus: an introduction that hooks and previews, a body paragraph for each main point, and a conclusion. Use these notes: hottest planet, about 465°C; thick clouds of acid trap heat; a day on Venus is longer than its year; it spins backward, so the sun rises in the west; the Soviet Venera 7 was the first craft to land there, in 1970.",
    model:
      "On Venus, the sun rises in the west, and a single day lasts longer than a whole year. This report explains why Venus is so strange and how spacecraft have explored it.\n\nVenus is the hottest planet, with a surface of about 465°C, hot enough to melt lead. Thick clouds of acid trap the sun's heat like a blanket. Venus also spins backward and very slowly, so its day is longer than its year, and the sun rises in the west.\n\nBecause of the heat, landing on Venus is very hard. In 1970, the Soviet spacecraft Venera 7 became the first craft to land there. It sent back information for only about twenty minutes before the heat destroyed it.\n\nVenus is a hot, backward-spinning world, and only a few brave machines have ever survived on its surface.",
  },
  {
    task: "Write a report of three paragraphs on the Voyager missions: an introduction that hooks and previews, a body paragraph for each main point, and a conclusion. Use these notes: two spacecraft launched in 1977; flew past Jupiter and Saturn, and Voyager 2 past Uranus and Neptune; each carries a golden record of sounds and greetings from Earth; Voyager 1 left the solar system in 2012 and is the farthest human-made object.",
    model:
      "The farthest object people have ever made is still traveling, more than 24 billion kilometers from home. It is Voyager 1. This report explains the journey of the two Voyager spacecraft and the message they carry.\n\nThe Voyagers were launched in 1977. Both flew past Jupiter and Saturn and sent back the first close pictures of their moons. Voyager 2 then visited Uranus and Neptune, and it is still the only spacecraft to have done so. In 2012, Voyager 1 left the solar system.\n\nEach Voyager carries a golden record. It holds sounds of Earth, music and greetings in 55 languages, in case another civilization ever finds it.\n\nThe Voyagers explored the outer planets and now carry a message from Earth into deep space.",
  },
  {
    task: "Write a report of three paragraphs on the moon: an introduction that hooks and previews, a body paragraph for each main point, and a conclusion. Use these notes: probably formed when a planet-sized object hit Earth 4.5 billion years ago; no air, so craters last for millions of years; its pull causes the tides; it seems to change shape because we see different parts of its sunlit side.",
    model:
      "The moon may have been born in a crash. This report explains where the moon came from and how it affects Earth.\n\nMost scientists think the moon formed about 4.5 billion years ago, when an object the size of a planet smashed into the young Earth. Rock thrown into space gathered into the moon. Because the moon has no air or weather, the craters made by meteorites are not worn away, and they last for millions of years.\n\nThe moon also affects Earth. Its pull on the oceans causes the tides. And although it seems to change shape each night, it does not: we simply see different amounts of its sunlit side as it travels around Earth.\n\nThe moon began in a great collision, and it still shapes our tides and our night sky.",
  },
  {
    task: "Write a report of three paragraphs on Neptune: an introduction that hooks and previews, a body paragraph for each main point, and a conclusion. Use these notes: farthest planet from the sun; found in 1846 by math before it was seen through a telescope; strongest winds in the solar system, over 2,000 km an hour; a year lasts 165 Earth years; blue because of methane gas.",
    model:
      "Neptune was found with a pencil before anyone saw it through a telescope. This report explains how Neptune was discovered and what the planet is like.\n\nIn the 1840s, astronomers noticed that Uranus was being pulled slightly off its path. Using math, they worked out where another planet must be. In 1846, they pointed a telescope at that spot, and there was Neptune.\n\nNeptune is the farthest planet from the sun. Methane gas in its air makes it look deep blue. It has the strongest winds in the solar system, faster than 2,000 kilometers an hour. It is so far away that one Neptune year lasts 165 Earth years.\n\nNeptune is a cold, windy, blue world, and its discovery shows how powerful math can be.",
  },
  {
    task: "Write a report of three paragraphs on comets: an introduction that hooks and previews, a body paragraph for each main point, and a conclusion. Use these notes: balls of ice, dust and rock; a tail forms when the sun heats the comet, and it points away from the sun; Halley's Comet returns every 76 years, next in 2061; the Rosetta mission landed a probe on a comet in 2014.",
    model:
      "A comet's tail can stretch for millions of kilometers, yet it always points away from the sun. This report explains what comets are and how scientists have studied them up close.\n\nComets are balls of ice, dust and rock, sometimes called dirty snowballs. Most of the time they are frozen and dark. When a comet nears the sun, the heat turns some of its ice into gas, and a glowing tail forms. Some comets return again and again; Halley's Comet comes back every 76 years and will next appear in 2061.\n\nIn 2014, the Rosetta mission sent a small probe, Philae, to land on a comet. It was the first landing on a comet ever, and it showed that the surface was harder than expected.\n\nComets are icy travelers, and missions like Rosetta are helping us learn their secrets.",
  },
  {
    task: "Write a report of three paragraphs on Mercury: an introduction that hooks and previews, a body paragraph for each main point, and a conclusion. Use these notes: closest planet to the sun, and the smallest; no air to hold heat, so days reach 430°C and nights fall to minus 180°C; a year lasts 88 Earth days; the MESSENGER spacecraft found ice in deep craters at its poles.",
    model:
      "On Mercury, the same ground can be hot enough to melt tin by day and colder than Antarctica by night. This report describes Mercury's wild temperatures and a surprising discovery about the planet.\n\nMercury is the smallest planet and the closest to the sun, and it races around the sun in only 88 Earth days. Because it has almost no air to hold heat, its temperature swings wildly. Days reach 430°C, while nights drop to minus 180°C.\n\nYou might expect no ice on a planet so close to the sun. But the MESSENGER spacecraft found ice hidden in deep craters at Mercury's poles, where sunlight never reaches.\n\nMercury is a small world of extreme heat and cold, and it even hides ice in its darkest craters.",
  },
];

/** opinionBank asks for an opinion piece of three or four paragraphs on a question of civics. */
const opinionBank: readonly WritingItem[] = [
  {
    task: "Should every citizen have to vote? Write an opinion piece of three or four paragraphs: your opinion, a paragraph for each reason in a logical order with facts, and a conclusion.",
    model:
      "I believe every citizen should have to vote.\n\nOne reason is that voting is a duty, like paying taxes or serving on a jury. In Australia, voting has been required since 1924, and people there see it as a normal part of being a citizen.\n\nThe most important reason is that leaders should be chosen by everyone, not just by some. In many countries, fewer than two thirds of citizens vote, so a small group decides for everyone. When voting is required, as in Australia, more than nine out of ten citizens vote.\n\nIn conclusion, requiring everyone to vote would make voting a shared duty and give every citizen a voice in choosing leaders.",
  },
  {
    task: "Should students have a say in their school's rules? Write an opinion piece of three or four paragraphs: your opinion, a paragraph for each reason in a logical order with facts, and a conclusion.",
    model:
      "In my opinion, students should help make their school's rules.\n\nFirst, students know which rules work. They are the ones who follow the rules every day. For example, at our school, students pointed out that the rule against talking at lunch made the cafeteria tense, and the rule was changed.\n\nMost importantly, people follow rules they helped make. One school in Oregon let a student council write its rules about phones, and the number of phone problems fell by half in a year. When students understand why a rule exists, they are more likely to respect it.\n\nFor these reasons, giving students a voice would make school rules both better and better followed.",
  },
  {
    task: "Should children be allowed to vote in town elections at age sixteen? Write an opinion piece of three or four paragraphs: your opinion, a paragraph for each reason in a logical order with facts, and a conclusion.",
    model:
      "I think sixteen-year-olds should be allowed to vote in town elections.\n\nOne reason is that town decisions affect young people directly. Towns decide about parks, buses, libraries and sports fields, which teenagers use every day.\n\nAn even stronger reason is that voting early builds a habit. In Austria, sixteen-year-olds have voted since 2007, and studies there found that people who start voting young are more likely to keep voting as adults. A habit that starts at sixteen can last a lifetime.\n\nIn short, letting sixteen-year-olds vote in town elections would give them a say in things that matter to them and help create lifelong voters.",
  },
  {
    task: "Should our town hold a meeting each month where any citizen can speak? Write an opinion piece of three or four paragraphs: your opinion, a paragraph for each reason in a logical order with facts, and a conclusion.",
    model:
      "Our town should hold a monthly meeting where any citizen can speak.\n\nTo begin with, such a meeting would help leaders hear about problems early. Last year, a broken streetlight on Elm Road stayed dark for four months because no one knew whom to tell.\n\nThe strongest reason is that it would let every citizen take part, as in ancient Athens. There, thousands of citizens met in the assembly about forty times a year, and any of them could stand and speak. People who can speak up feel that their town belongs to them.\n\nIn conclusion, a monthly meeting would help our leaders solve problems sooner and give every citizen a real voice.",
  },
  {
    task: "Should students learn about how their government works in every year of school? Write an opinion piece of three or four paragraphs: your opinion, a paragraph for each reason in a logical order with facts, and a conclusion.",
    model:
      "I believe students should learn how their government works in every year of school.\n\nOne reason is that government is complicated. There are councils, courts, elections and laws, and it takes time to understand how they fit together. One short course is not enough.\n\nThe most important reason is that citizens who understand government take part in it. A survey in the United States found that young people who had studied government were much more likely to vote. If we want active citizens, we have to teach them early and often.\n\nTo sum up, learning about government every year would help students understand it fully and make them more likely to take part as adults.",
  },
  {
    task: "Should every town have a youth council of students who advise the mayor? Write an opinion piece of three or four paragraphs: your opinion, a paragraph for each reason in a logical order with facts, and a conclusion.",
    model:
      "Every town should have a youth council to advise the mayor.\n\nFirst, a youth council teaches students how government works. Members learn to hold meetings, listen to others and vote on ideas.\n\nMore importantly, young people bring ideas that adults may miss. In one Canadian town, the youth council noticed that there was nowhere safe to skateboard, and the town built a skate park that hundreds of teenagers now use. Without the council, the mayor might never have known about the need.\n\nIn conclusion, a youth council helps students learn about government and helps towns serve their young people better.",
  },
  {
    task: "Should people be allowed to vote online instead of at a polling place? Write an opinion piece of three or four paragraphs: your opinion, a paragraph for each reason in a logical order with facts, and a conclusion.",
    model:
      "I think people should be able to vote online as well as at a polling place.\n\nOne reason is convenience. Some people work long hours, care for young children or live far from a polling place. Online voting would let them vote from home.\n\nThe strongest reason is that more people would vote. Estonia has allowed online voting since 2005, and in recent elections about half of all votes were cast online. When voting is easier, more citizens take part.\n\nFor these reasons, online voting, if it is kept safe, would make voting easier and help more citizens have their say.",
  },
  {
    task: "Should students elect their class representatives instead of having teachers choose them? Write an opinion piece of three or four paragraphs: your opinion, a paragraph for each reason in a logical order with facts, and a conclusion.",
    model:
      "In my opinion, students should elect their class representatives.\n\nFirst, an election is fair. Every student gets one vote, and the person most students trust wins. Last year in our class, the election winner was someone the teacher had not expected, but almost everyone agreed with the choice.\n\nMost importantly, elections teach students how democracy works. Students learn to make speeches, compare candidates and accept results. These are the same skills adults use in real elections.\n\nIn conclusion, electing class representatives is fairer than choosing them and gives students practice in democracy.",
  },
  {
    task: "Should our town ask citizens to vote on how to spend part of its budget? Write an opinion piece of three or four paragraphs: your opinion, a paragraph for each reason in a logical order with facts, and a conclusion.",
    model:
      "Our town should let citizens vote on how to spend part of its budget.\n\nTo begin with, citizens know what their neighborhoods need. They walk the sidewalks, use the parks and ride the buses every day.\n\nThe most important reason is that it works. In 1989, the city of Porto Alegre in Brazil began letting citizens vote on part of its budget. Within a few years, many more homes had clean water and sewers, because citizens voted to pay for them. When people choose, money goes where it is needed.\n\nIn short, letting citizens vote on part of the budget would use their knowledge and help spend the town's money where it does the most good.",
  },
  {
    task: "Should students take turns doing jobs that keep their school running, such as recycling and gardening? Write an opinion piece of three or four paragraphs: your opinion, a paragraph for each reason in a logical order with facts, and a conclusion.",
    model:
      "I believe students should take turns doing jobs that keep the school running.\n\nOne reason is that it would save money. Our school spends money each year on cleaning and gardening that students could help with. That money could buy books instead.\n\nAn even stronger reason is that it teaches responsibility. In Japan, students clean their own classrooms every day, and teachers say they learn to respect their school and work together. Students who care for a place are less likely to damage it.\n\nIn conclusion, sharing school jobs would save money and teach students to take care of their community.",
  },
  {
    task: "Should all citizens serve on a jury when they are called? Write an opinion piece of three or four paragraphs: your opinion, a paragraph for each reason in a logical order with facts, and a conclusion.",
    model:
      "I think all citizens should serve on a jury when they are called.\n\nFirst, jury service teaches people how courts work. Jurors listen to evidence, weigh it and make a decision together, which few people ever see otherwise.\n\nThe most important reason is fairness. A jury is supposed to be a group of ordinary citizens, not a small group of experts. If many people refuse to serve, juries no longer represent the whole community. In ancient Athens, juries had hundreds of citizens chosen by lot so that no one could control them.\n\nTo sum up, jury service teaches citizens about the courts and keeps trials fair for everyone.",
  },
  {
    task: "Should our school hold a mock election every time there is a real national election? Write an opinion piece of three or four paragraphs: your opinion, a paragraph for each reason in a logical order with facts, and a conclusion.",
    model:
      "Our school should hold a mock election whenever there is a real national election.\n\nTo begin with, a mock election is exciting. Students would make posters, give speeches and count ballots, which makes learning about elections fun.\n\nThe strongest reason is that it prepares students to vote for real. In Canada, a program called Student Vote has held mock elections in schools since 2003, and a study found that families of students who took part were more likely to vote too. A mock election teaches the steps of voting before students are old enough to do it.\n\nIn conclusion, mock elections would make learning about voting exciting and prepare students to vote as adults.",
  },
];

/** twoTextsBank gives two short texts on one topic to write about together. */
const twoTextsBank: readonly WritingItem[] = [
  {
    task: "Write a paragraph or two that joins what both texts say about the Greek Olympic Games. Show how the texts connect or differ, and give a detail from each.",
    source:
      "Text A: The first Olympic Games were held at Olympia in 776 BCE. At first there was only one event, a footrace of about 190 meters. Over time, wrestling, boxing and chariot racing were added. Winners received a crown of olive leaves.\n\nText B: Today's Olympic Games began in Athens in 1896. They are held every four years in a different city and include hundreds of events. Winners receive gold medals, and athletes come from more than 200 countries.",
    model:
      'Both texts describe the Olympic Games, but Text A tells about the ancient Games and Text B about the modern ones. Text A explains that the first Games, at Olympia in 776 BCE, had only one footrace, while Text B says that today\'s Games include hundreds of events.\n\nThe prizes changed too. In ancient times, winners received "a crown of olive leaves," but today they receive gold medals. The ancient Games grew slowly by adding sports such as wrestling, and the modern Games continue that growth, with athletes from more than 200 countries.',
  },
  {
    task: "Write a paragraph or two that joins what both texts say about Machu Picchu. Show how the texts connect or differ, and give a detail from each.",
    source:
      "Text A: Machu Picchu was built by the Inca around 1450, high in the Andes Mountains of Peru. Its stone walls were cut so precisely that they fit together without mortar. The city was abandoned about a hundred years later.\n\nText B: In 1911, the explorer Hiram Bingham was led to Machu Picchu by local farmers who already knew it well. His photographs made the city famous around the world. Today about a million tourists visit each year.",
    model:
      'Together, the two texts tell the story of Machu Picchu from its building to today. Text A explains that the Inca built it around 1450 and that its stones "fit together without mortar," which shows their great skill. Text B picks up the story centuries later, when Hiram Bingham came there in 1911.\n\nThe texts connect in an interesting way. Text A says the city was abandoned, but Text B shows it was never truly lost, since local farmers "already knew it well." Bingham\'s photographs made it famous, and now about a million tourists visit every year.',
  },
  {
    task: "Write a paragraph or two that joins what both texts say about germs and handwashing. Show how the texts connect or differ, and give a detail from each.",
    source:
      "Text A: In the 1840s, the doctor Ignaz Semmelweis noticed that many mothers died after giving birth in his hospital. He asked doctors to wash their hands in a special solution, and the deaths dropped sharply. Yet many doctors refused to believe him.\n\nText B: Germs can live on hands for hours. Washing with soap and water for at least twenty seconds removes most of them. Health experts say handwashing is one of the best ways to prevent illness.",
    model:
      'Both texts show that washing hands protects people from illness. Text A gives a historical example: when Ignaz Semmelweis had doctors wash their hands, the deaths of mothers "dropped sharply." Text B explains the reason, since germs "can live on hands for hours" and soap removes most of them.\n\nThe texts differ in how people responded. In Text A, many doctors refused to believe Semmelweis, but in Text B, today\'s health experts call handwashing one of the best ways to prevent illness. What was once doubted is now common knowledge.',
  },
  {
    task: "Write a paragraph or two that joins what both texts say about the Maya calendar. Show how the texts connect or differ, and give a detail from each.",
    source:
      "Text A: The Maya watched the sky closely. They tracked the movements of the sun, the moon and the planet Venus, and their priests predicted eclipses years in advance.\n\nText B: The Maya used several calendars at once. One had 365 days, like ours, and another had 260 days and was used to plan ceremonies. The two calendars together made a cycle of 52 years.",
    model:
      'The two texts connect because the Maya calendars described in Text B depended on the sky-watching described in Text A. Text A says the Maya tracked the sun, the moon and Venus, and their priests "predicted eclipses years in advance."\n\nText B shows how they used this knowledge to measure time. They had a 365-day calendar, like ours, and a 260-day calendar for ceremonies. Together, these made a cycle of 52 years. Their careful study of the sky made such exact calendars possible.',
  },
  {
    task: "Write a paragraph or two that joins what both texts say about the Golden Gate Bridge. Show how the texts connect or differ, and give a detail from each.",
    source:
      "Text A: Many engineers said a bridge across the Golden Gate strait could not be built. The water was deep, the currents were strong and fog and wind swept in from the ocean.\n\nText B: The Golden Gate Bridge opened in 1937. Its main span is 1,280 meters long, held up by two cables, each almost a meter thick. On opening day, about 200,000 people walked across it.",
    model:
      'Text A explains why the Golden Gate Bridge seemed impossible, and Text B shows that it was built anyway. According to Text A, the strait had deep water, strong currents, and fog and wind from the ocean.\n\nIn contrast, Text B describes the finished bridge in 1937, with a main span of 1,280 meters held up by cables "almost a meter thick." On opening day, about 200,000 people walked across. Read together, the texts show how engineers overcame problems that many thought could not be solved.',
  },
  {
    task: "Write a paragraph or two that joins what both texts say about penicillin. Show how the texts connect or differ, and give a detail from each.",
    source:
      "Text A: In 1928, Alexander Fleming returned from a holiday to find mold growing on one of his dishes of bacteria. Around the mold, the bacteria had died. He named the substance the mold made penicillin.\n\nText B: For years, penicillin was too hard to make in large amounts. In the 1940s, Howard Florey and Ernst Chain found a way to produce it. By 1944, it was saving the lives of thousands of wounded soldiers.",
    model:
      'Both texts are about penicillin, but they tell different parts of its story. Text A describes its discovery: in 1928, Alexander Fleming noticed that bacteria had died around a mold on his dish.\n\nText B explains what happened next. Penicillin was "too hard to make in large amounts" until Howard Florey and Ernst Chain found a way in the 1940s. Fleming\'s lucky discovery mattered only because later scientists worked out how to produce it, and by 1944 it was saving thousands of soldiers.',
  },
  {
    task: "Write a paragraph or two that joins what both texts say about the Pantheon in Rome. Show how the texts connect or differ, and give a detail from each.",
    source:
      "Text A: The Pantheon was finished around the year 125. Its dome is 43 meters across, and at its top is a round opening called the oculus, which lets in light and rain.\n\nText B: Roman builders made the dome lighter near the top by mixing light volcanic stone into the concrete. The walls at the bottom are six meters thick to hold the weight. The dome has stood for nearly 1,900 years.",
    model:
      'Text A describes what the Pantheon\'s dome looks like, and Text B explains how it was built to last. Text A says the dome is 43 meters across, with a round opening at the top called the oculus.\n\nText B tells the secret of its strength: builders mixed "light volcanic stone" into the concrete near the top and made the bottom walls six meters thick. These two ideas connect, because a dome so wide needed a light top and heavy walls, which is why it has stood for nearly 1,900 years.',
  },
  {
    task: "Write a paragraph or two that joins what both texts say about the eruption of Mount Vesuvius in the year 79. Show how the texts connect or differ, and give a detail from each.",
    source:
      'Text A: Pliny the Younger watched the eruption from across the bay. In a letter, he described a cloud shaped like a pine tree rising from the mountain, and later a darkness "like a room with the lamp put out."\n\nText B: Archaeologists digging at Pompeii have found bread still in ovens and paintings on walls. The ash that buried the town kept it almost exactly as it was on the day of the eruption.',
    model:
      'The two texts show the eruption of Vesuvius in two different ways. Text A is a firsthand account by Pliny the Younger, who saw a cloud "shaped like a pine tree" and then terrible darkness.\n\nText B tells what scientists found centuries later. Archaeologists at Pompeii discovered bread still in ovens, because the ash buried the town so quickly. Pliny\'s letter shows how frightening the eruption felt, while the ruins prove how suddenly it ended everyday life.',
  },
  {
    task: "Write a paragraph or two that joins what both texts say about tardigrades. Show how the texts connect or differ, and give a detail from each.",
    source:
      "Text A: Tardigrades are tiny animals less than a millimeter long. They have eight stubby legs with claws and live in moss, soil and even deep-sea mud.\n\nText B: In 2007, scientists sent tardigrades into space on the outside of a satellite. After ten days, many of them were still alive, and some even laid eggs that hatched.",
    model:
      'Text A describes what tardigrades are like, while Text B tells about an experiment that tested how tough they are. According to Text A, they are less than a millimeter long, with eight stubby legs, and they live in moss and soil.\n\nText B shows that these tiny creatures can survive in space. In 2007, after ten days outside a satellite, many were "still alive." Together, the texts show that an animal small enough to live in a patch of moss is also one of the toughest on Earth.',
  },
  {
    task: "Write a paragraph or two that joins what both texts say about lighthouses. Show how the texts connect or differ, and give a detail from each.",
    source:
      "Text A: Long ago, lighthouse keepers had to stay awake all night. They wound the clockwork that turned the lamp, trimmed the wicks and cleaned soot off the glass.\n\nText B: Today, almost all lighthouses run automatically. Electric lamps switch on at dusk by themselves, and many lighthouses also send radio signals that ships can pick up.",
    model:
      'Both texts describe how lighthouses work, but they show a big change over time. Text A explains that keepers long ago had to stay awake all night to wind the clockwork and clean "soot off the glass."\n\nIn contrast, Text B says that lighthouses today run by themselves, with electric lamps that switch on at dusk. Some also send radio signals to ships. The jobs that once needed a keeper are now done by machines.',
  },
  {
    task: "Write a paragraph or two that joins what both texts say about Athenian democracy. Show how the texts connect or differ, and give a detail from each.",
    source:
      "Text A: In ancient Athens, citizens met on a hill called the Pnyx to debate and vote on laws. Any citizen could speak, and decisions were made by a show of hands.\n\nText B: Only free men born in Athens counted as citizens. Women, enslaved people and people from other cities could not vote, so only a small part of the people living in Athens took part.",
    model:
      'Text A shows how open Athenian democracy was, while Text B shows its limits. According to Text A, citizens met on the Pnyx, where "any citizen could speak," and they voted by a show of hands.\n\nHowever, Text B explains that not everyone was a citizen. Women, enslaved people and people from other cities could not vote, so only a small part of the people took part. Read together, the texts show that Athens gave great power to its citizens but left most people out.',
  },
  {
    task: "Write a paragraph or two that joins what both texts say about bees and farming. Show how the texts connect or differ, and give a detail from each.",
    source:
      "Text A: When a bee visits a flower, pollen sticks to its hairy body. At the next flower, some of the pollen rubs off, and the plant can make seeds and fruit.\n\nText B: Each spring, almond farmers in California rent more than a million beehives. Without bees, their trees would produce very few almonds.",
    model:
      'The two texts connect because Text A explains how bees pollinate, and Text B shows why farmers depend on it. Text A says pollen sticks to a bee\'s "hairy body" and rubs off at the next flower, so the plant can make fruit.\n\nText B gives a real example: almond farmers in California rent more than a million beehives every spring. Without the pollination described in Text A, their trees "would produce very few almonds."',
  },
];

/** judgedTopics5a are the first judged writing topics of grade 5. */
export const judgedTopics5a: readonly TopicDef[] = [
  {
    id: "writing-up-an-experiment",
    title: t("Writing Up an Experiment", "写实验报告"),
    summary: t(
      "Write up a kitchen experiment from notes: the question, the method in order, the results and a conclusion the results support.",
      "根据笔记写一份厨房实验报告：问题、按顺序写出的方法、结果，以及有结果支持的结论。",
    ),
    prerequisites: after("reading-about-an-experiment", "writing-a-how-to-paragraph"),
    encompasses: [{ topic: "writing-a-how-to-paragraph", weight: 0.2 }],
    xp: 22,
    strand: "writing",
    criteria: ["g5-lab-question", "g5-lab-method", "g5-lab-result", "g5-lab-conclusion"].map(criterion),
    knowledgePoints: [
      point(
        "question-and-method",
        t("The Question and the Method", "问题与方法"),
        t(
          "A write-up of an experiment begins with the **question** it set out to answer: *Does salt make ice melt faster?* Then it gives the **method**: what was done, step by step, in order, with words such as *first*, *next* and *then*. The method must be clear enough for someone else to repeat the experiment exactly.",
          "实验报告以实验要回答的**问题**开头：*Does salt make ice melt faster?* 然后写出**方法**：按顺序一步一步写出做了什么，用 *first*、*next*、*then* 等词连接。方法要写得足够清楚，让别人能完全照着重复这个实验。",
        ),
        writingGenerator(
          t(
            "Write up the experiment in English, with its question and its method in order.",
            "用英语写出这份实验报告，包括问题和按顺序写出的方法。",
          ),
          labBank,
          ["g5-lab-question", "g5-lab-method", "g5-lab-conclusion"],
          { minWords: 60, maxChars: 2000 },
          onePiece,
        ),
      ),
      point(
        "results-and-conclusion",
        t("Results and a Conclusion", "结果与结论"),
        t(
          "The **results** report only what was seen or measured: *The salted cube melted after 20 minutes; the plain one after 35.* The **conclusion** then answers the question, and it must follow from the results: *Salt makes ice melt faster, because the salted cube melted 15 minutes sooner.* Keep the two apart, and never claim more than the results show.",
          "**结果**只报告看到或测量到的东西：*The salted cube melted after 20 minutes; the plain one after 35.* 然后**结论**回答问题，而且必须从结果中得出：*Salt makes ice melt faster, because the salted cube melted 15 minutes sooner.* 把两者分开写，结论不要超出结果所能说明的范围。",
        ),
        writingGenerator(
          t(
            "Write up the experiment in English, with its results and a conclusion they support.",
            "用英语写出这份实验报告，包括结果和有结果支持的结论。",
          ),
          labBank,
          ["g5-lab-result", "g5-lab-conclusion", "g5-lab-question"],
          { minWords: 60, maxChars: 2000 },
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "answering-with-text-evidence",
    title: t("Answering with Evidence from a Text", "用文本证据回答问题"),
    summary: t(
      "Answer a question about a passage in three to five sentences: a clear answer, a detail or short quotation from the passage, and a sentence that explains how it supports the answer.",
      "用三到五句话回答关于一段文字的问题：清楚的答案、文中的细节或简短引文，以及一句解释它如何支持答案的话。",
    ),
    prerequisites: after("answering-a-question-in-sentences", "quoting-accurately"),
    encompasses: [{ topic: "quoting-accurately", weight: 0.2 }],
    xp: 22,
    strand: "writing",
    criteria: ["g5-response-answer", "g5-response-evidence", "g5-response-explains"].map(criterion),
    knowledgePoints: [
      point(
        "a-clear-answer-with-evidence",
        t("A Clear Answer with Evidence", "清楚的答案和证据"),
        t(
          "Begin with a **clear answer** that turns the question into a statement: *Grandpa kept the map because it helped him remember his home.* Then give **evidence**: a specific detail from the passage, or a few of its exact words in quotation marks. Evidence shows the reader that the answer comes from the text, not from a guess.",
          "先用一个**清楚的答案**开头，把问题变成陈述句：*Grandpa kept the map because it helped him remember his home.* 然后给出**证据**：文中的一个具体细节，或放在引号里的几个原词。证据让读者看到答案来自文本，而不是猜测。",
        ),
        writingGenerator(
          t(
            "Answer the question in English, in three to five sentences, with evidence from the passage.",
            "用英语回答问题，写三到五句话，并给出文中的证据。",
          ),
          responseBank,
          ["g5-response-answer", "g5-response-evidence"],
          { minWords: 40, maxChars: 1200 },
          onePiece,
        ),
      ),
      point(
        "explaining-the-evidence",
        t("Explaining the Evidence", "解释证据"),
        t(
          "Evidence does not speak for itself. After it, add a sentence that **explains** how it supports the answer, in your own words: *Since the farm is gone, the map is the only way he can still see it.* An answer that only strings quotations together leaves the reader to do the thinking.",
          "证据不会自己说话。在证据之后，要用自己的话加一句**解释**，说明它如何支持答案：*Since the farm is gone, the map is the only way he can still see it.* 只把引文串在一起的回答，是把思考留给了读者。",
        ),
        writingGenerator(
          t(
            "Answer the question in English, and explain how your evidence supports your answer.",
            "用英语回答问题，并解释你的证据如何支持你的答案。",
          ),
          responseBank,
          ["g5-response-explains", "g5-response-evidence", "g5-response-answer"],
          { minWords: 40, maxChars: 1200 },
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-a-three-paragraph-report",
    title: t("Writing a Report of Three Paragraphs", "写三段式报告"),
    summary: t(
      "Write a report on a planet or a mission: an introduction that hooks and previews, a body paragraph for each main point with facts from given notes, and a conclusion.",
      "写一篇关于某颗行星或某次太空任务的报告：能吸引读者并预告内容的引言、每个要点一个含有笔记中事实的主体段落，以及结论。",
    ),
    prerequisites: after("writing-a-two-paragraph-report", "planning-a-multi-paragraph-piece", "previewing-the-topic"),
    encompasses: [
      { topic: "writing-a-two-paragraph-report", weight: 0.3 },
      { topic: "previewing-the-topic", weight: 0.2 },
    ],
    xp: 22,
    strand: "writing",
    criteria: ["g5-report-preview", "g5-report-sections", "g5-report-evidence", "g5-report-conclusion"].map(criterion),
    knowledgePoints: [
      point(
        "an-introduction-that-previews",
        t("An Introduction That Previews", "预告内容的引言"),
        t(
          "A longer report opens with a **hook**, a surprising fact or question, and then a **preview** that tells the reader what the report will cover, in order: *This report explains what Mars is like and how rovers are exploring it.* Each body paragraph then keeps the promise of the preview, one main point at a time.",
          "较长的报告以一个**吸引读者的开头**开始，比如一个出人意料的事实或问题，然后用**预告**告诉读者报告将按什么顺序讲哪些内容：*This report explains what Mars is like and how rovers are exploring it.* 接下来每个主体段落兑现预告的承诺，一次讲一个要点。",
        ),
        writingGenerator(
          t("Write the report in English, with an introduction that hooks and previews.", "用英语写这篇报告，引言要吸引读者并预告内容。"),
          reportBank,
          ["g5-report-preview", "g5-report-sections", "g5-report-conclusion"],
          { minWords: 110, maxChars: 3200 },
          onePiece,
        ),
      ),
      point(
        "body-paragraphs-built-from-notes",
        t("Body Paragraphs Built from Notes", "用笔记写主体段落"),
        t(
          "Sort the notes by main point before you write: each group becomes one **body paragraph**. Open it with its main point and support that point with **specific facts** from the notes: names, numbers and dates. Then close the report with a **conclusion** that pulls the main points together, without adding a new fact.",
          "动笔之前，先按要点把笔记分组：每一组成为一个**主体段落**。段落以要点开头，用笔记中的**具体事实**支持它：名称、数字和日期。最后用**结论**收束报告，把各个要点合在一起，不再加入新的事实。",
        ),
        writingGenerator(
          t(
            "Write the report in English, with body paragraphs built from the notes and a conclusion.",
            "用英语写这篇报告，用笔记写出主体段落，并写一个结论。",
          ),
          reportBank,
          ["g5-report-evidence", "g5-report-sections", "g5-report-conclusion"],
          { minWords: 110, maxChars: 3200 },
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-an-opinion-piece",
    title: t("Writing an Opinion Piece", "写观点文章"),
    summary: t(
      "Write an opinion piece of three or four paragraphs on a question of civics: the opinion, a paragraph for each reason in a logical order with facts, and a conclusion.",
      "就一个公民问题写一篇三到四段的观点文章：观点、按合理顺序排列并有事实支持的每个理由各一段，以及结论。",
    ),
    prerequisites: after("writing-an-opinion-paragraph", "one-paragraph-per-reason"),
    encompasses: [
      { topic: "writing-an-opinion-paragraph", weight: 0.3 },
      { topic: "one-paragraph-per-reason", weight: 0.2 },
    ],
    xp: 22,
    strand: "writing",
    criteria: ["w4-states-opinion", "g5-opinion-reasons-ordered", "g5-opinion-evidence", "g5-opinion-conclusion"].map(criterion),
    knowledgePoints: [
      point(
        "a-paragraph-for-each-reason",
        t("A Paragraph for Each Reason", "每个理由一段"),
        t(
          "An opinion piece of several paragraphs states its **opinion** in the first paragraph. Each body paragraph then gives **one reason**, opening with it (*One reason is that…*), in an order the reader can follow; saving the strongest for last leaves it in the reader's mind. Linking words such as *first*, *more importantly* and *in conclusion* guide the reader through.",
          "多段的观点文章在第一段说出**观点**。然后每个主体段落给出**一个理由**，并以它开头（*One reason is that…*），理由要按读者容易理解的顺序排列；把最有力的留到最后，能让它留在读者心中。*first*、*more importantly*、*in conclusion* 等连接词引导读者读下去。",
        ),
        writingGenerator(
          t("Write the opinion piece in English, with a paragraph for each reason.", "用英语写这篇观点文章，每个理由写一段。"),
          opinionBank,
          ["w4-states-opinion", "g5-opinion-reasons-ordered", "g5-opinion-conclusion"],
          { minWords: 90, maxChars: 3200 },
          onePiece,
        ),
      ),
      point(
        "facts-for-every-reason",
        t("Facts for Every Reason", "每个理由都有事实"),
        t(
          "A reason persuades when **facts** stand behind it: a number, an example from a real place, or what happened when someone tried the idea. *In Australia, more than nine out of ten citizens vote* persuades more than *lots of people would vote*. End with a **conclusion** that restates the opinion in new words and sums up the reasons.",
          "有**事实**支撑的理由才有说服力：一个数字、一个真实地方的例子，或有人尝试这个想法后发生的事。*In Australia, more than nine out of ten citizens vote* 比 *lots of people would vote* 更有说服力。最后用**结论**换一种说法重申观点，并总结理由。",
        ),
        writingGenerator(
          t("Write the opinion piece in English, backing every reason with facts.", "用英语写这篇观点文章，每个理由都用事实支持。"),
          opinionBank,
          ["g5-opinion-evidence", "g5-opinion-conclusion", "w4-states-opinion"],
          { minWords: 90, maxChars: 3200 },
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-about-two-texts",
    title: t("Writing About Two Texts", "就两篇文本写作"),
    summary: t(
      "Write a paragraph or two that joins what two short texts say about one topic, showing how their information connects or differs, with a detail from each.",
      "写一到两段话，把两篇短文关于同一主题的内容结合起来，说明它们的信息如何联系或不同，并各给出一个细节。",
    ),
    prerequisites: after("combining-information-from-two-texts", "writing-a-compare-and-contrast-paragraph"),
    encompasses: [{ topic: "writing-a-compare-and-contrast-paragraph", weight: 0.3 }],
    xp: 22,
    strand: "writing",
    criteria: ["g5-twotexts-both", "g5-twotexts-connects", "g5-twotexts-evidence"].map(criterion),
    knowledgePoints: [
      point(
        "using-both-texts",
        t("Using Both Texts", "使用两篇文本"),
        t(
          "When you write about two texts, use **both**, and name each one: *Text A explains…, while Text B shows…* Take at least one **specific detail** from each, accurately, as a few exact words or in your own words. A piece that leans on only one text has not done the job.",
          "就两篇文本写作时，要**两篇都用**，并说出每一篇：*Text A explains…, while Text B shows…* 从每篇中至少准确地取一个**具体细节**，可以引用几个原词，也可以用自己的话。只依靠一篇文本的文章没有完成任务。",
        ),
        writingGenerator(
          t("Write in English about both texts, with a detail from each.", "用英语就两篇文本写作，每篇各给出一个细节。"),
          twoTextsBank,
          ["g5-twotexts-both", "g5-twotexts-evidence"],
          { minWords: 60, maxChars: 2000 },
          onePiece,
        ),
      ),
      point(
        "how-the-texts-connect",
        t("How the Texts Connect", "两篇文本的联系"),
        t(
          "Do not just summarize one text and then the other. Say **how they connect**: one may explain why something in the other happened, give a later part of the same story, or show the opposite side. Linking words such as *in contrast*, *similarly* and *together, the texts show* make the connection clear.",
          "不要先概括一篇、再概括另一篇。要说出**它们怎样联系**：一篇可能解释另一篇中某件事发生的原因，讲同一个故事后来的部分，或展示相反的一面。*in contrast*、*similarly*、*together, the texts show* 等连接词能把这种联系说清楚。",
        ),
        writingGenerator(
          t(
            "Write in English about the two texts, showing how their information connects or differs.",
            "用英语就两篇文本写作，说明它们的信息如何联系或不同。",
          ),
          twoTextsBank,
          ["g5-twotexts-connects", "g5-twotexts-both", "g5-twotexts-evidence"],
          { minWords: 60, maxChars: 2000 },
          onePiece,
        ),
      ),
    ],
  },
];
