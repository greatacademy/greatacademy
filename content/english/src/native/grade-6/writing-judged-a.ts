// Grade 6: writing judged by a model, part one: explaining how something worked in history, explaining a natural
// process, a compare-and-contrast essay and a memoir scene.

import { type TopicDef, t } from "@ga/content";
import { point, type WritingItem, writingGenerator } from "@ga/subject-english";
import { after } from "../grade-5/links.ts";
import { criterion, onePiece } from "../grade-5/writing-judged-a.ts";

/** historyBank gives notes on how something worked in an early civilization. */
const historyBank: readonly WritingItem[] = [
  {
    task: "Explain how irrigation worked in Mesopotamia, from these notes. Notes: little rain in summer; Tigris and Euphrates flooded in spring; farmers dug canals from the rivers; gates of mud and reeds opened and closed; water spread over fields; canals cleaned of mud every year; more food, so cities grew.",
    model:
      "Mesopotamian farmers used irrigation to bring river water to fields that got almost no summer rain.\n\nThe system began at the Tigris and Euphrates rivers, which flooded every spring. Farmers dug canals that led from the rivers out to their fields. Gates made of mud and reeds stood along each canal. When a field needed water, a farmer opened the gate, and water flowed out and spread across the crops. When the field had enough, he closed the gate again. Because the rivers carried so much mud, the canals filled up, so every year people had to dig the mud out to keep the water moving.\n\nIrrigation let farmers grow far more food than rain alone allowed. With extra food, more people could live together, and the first cities grew.",
  },
  {
    task: "Explain how cuneiform writing worked, from these notes. Notes: invented in Sumer about 3200 BCE; scribes used a reed stylus cut to a wedge shape; pressed marks into wet clay tablets; tablets dried hard in the sun; at first pictures of things, later signs for sounds; used for records of grain, sheep and taxes; scribes trained for years in schools.",
    model:
      "Cuneiform, one of the first systems of writing, worked by pressing wedge-shaped marks into clay.\n\nIt was invented in Sumer about 3200 BCE. A scribe took a reed and cut its end into a wedge, making a tool called a stylus. He then pressed the stylus into a tablet of wet clay. Each press left a small wedge, and groups of wedges formed signs. When the tablet was finished, it was left in the sun until it dried hard, so the writing lasted. At first the signs were simple pictures of things, such as a sheep or a jar of grain. Later, many signs stood for sounds, so scribes could write names and whole sentences.\n\nBecause learning hundreds of signs took years of school, scribes were respected. Their tablets recorded grain, sheep and taxes, and they let a city keep track of its wealth.",
  },
  {
    task: "Explain how a ziggurat was built and used, from these notes. Notes: a tall temple with stepped levels; core of sun-dried mud bricks; outer layer of baked bricks set in tar to keep out rain; ramps or stairs to the top; small shrine at the top for the city's god; priests climbed to make offerings; the tallest building in the city, seen from far away.",
    model:
      "A ziggurat was a stepped temple tower built to bring a Mesopotamian city closer to its god.\n\nBuilders started with a huge core of mud bricks dried in the sun. Since rain could wash mud bricks away, they covered the outside with a layer of baked bricks, which are much harder, and set them in sticky tar to seal out water. The tower rose in levels, each one smaller than the one below, like giant steps. Long ramps or stairways led up the front. At the very top stood a small shrine for the city's god. Priests climbed the stairs to make offerings there, while ordinary people watched from below.\n\nAs the tallest building in the city, the ziggurat could be seen from far across the plain. It showed that the god, and the priests who served it, were at the center of city life.",
  },
  {
    task: "Explain how trade worked in the first cities, from these notes. Notes: Mesopotamia had good soil but no stone, metal or much wood; traded grain, cloth and pottery; got copper, tin, timber and stone from far away; boats on rivers, donkey caravans on land; clay seals marked who owned goods; silver weighed out as payment.",
    model:
      "Trade let the first cities of Mesopotamia get the things their land could not give them.\n\nThe land between the rivers had rich soil, but it had no stone, no metal and very little wood. People there made what they could: grain, woven cloth and pottery. They traded these goods for copper, tin, timber and stone from distant lands. Goods traveled by boat along the rivers and on long caravans of donkeys over land. To show who owned a bundle, a merchant pressed a carved seal into a lump of clay tied to it, so no one else could claim it. Instead of coins, buyers often paid with silver, which was weighed out on a scale.\n\nIn this way, a city without metal or forests could still build with stone and make bronze tools, because its farms fed a trade that reached far beyond its walls.",
  },
  {
    task: "Explain how Hammurabi's laws worked, from these notes. Notes: King Hammurabi of Babylon, about 1750 BCE; 282 laws carved on a tall stone pillar; set up in public so people could see them; each law said if someone does this, then this happens; punishments often depended on a person's rank; covered trade, farming, families and theft.",
    model:
      "Hammurabi's laws worked by writing down the rules of Babylon for everyone to see.\n\nAbout 1750 BCE, King Hammurabi had 282 laws carved onto a tall stone pillar. The pillar was placed where people gathered, so the rules were public instead of known only to judges. Each law followed the same pattern: if a person does a certain thing, then a certain result follows. For example, if a builder's house fell and killed its owner, the builder could be put to death. The laws covered trade, farming, family life and theft. However, they were not equal for all, because the punishment often depended on whether a person was a noble, a free person or a slave.\n\nBy carving the laws in stone, Hammurabi made them hard to change and easy to check. People could know the rules before they were judged by them.",
  },
  {
    task: "Explain how the Egyptians farmed with the Nile flood, from these notes. Notes: the Nile flooded every year from July to October; flood left black silt on the fields; farmers planted wheat and barley as the water went down; ditches and basins held water; a nilometer measured the flood's height; a good flood meant a good harvest and higher taxes.",
    model:
      "Egyptian farmers depended on the yearly flood of the Nile to water and feed their fields.\n\nFrom about July to October, the river rose and spread over the land along its banks. When the water went down, it left behind a layer of black silt, a rich mud full of food for plants. Farmers then planted wheat and barley in the soft, wet soil. They also dug ditches and built earth walls to make basins that held the floodwater longer. To learn how big the flood was, officials read a nilometer, a set of steps or marks that showed the height of the water.\n\nA high flood meant a good harvest, so officials used the nilometer to decide how much tax each farmer should pay. In this way, the whole kingdom ran on the rhythm of the river.",
  },
  {
    task: "Explain how Roman aqueducts carried water, from these notes. Notes: brought fresh water from hills to cities; water flowed downhill by gravity only; a very gentle slope over many kilometers; mostly underground channels; stone arches carried the channel over valleys; water reached fountains, baths and some homes; Rome had eleven aqueducts.",
    model:
      "Roman aqueducts carried fresh water from the hills to the cities using nothing but gravity.\n\nEngineers began at a spring or lake high in the hills. From there, they built a channel that sloped very gently downhill all the way to the city, sometimes for more than eighty kilometers. Because the slope was so slight, the water flowed steadily without rushing or stopping. Most of the channel ran underground, where it was protected. When it reached a valley, the Romans built tall stone arches to carry the channel across at the right height. In the city, the water filled tanks and then flowed to public fountains, baths and the homes of rich families.\n\nRome itself had eleven aqueducts. They gave the city so much clean water that a million people could live there.",
  },
  {
    task: "Explain how the Silk Road worked, from these notes. Notes: not one road but many routes between China and the Mediterranean; few traders made the whole trip; goods passed from merchant to merchant at towns and oases; silk and paper went west, glass, gold and horses went east; caravans of camels crossed deserts; ideas and religions spread too.",
    model:
      "The Silk Road was a network of trade routes that linked China with the lands around the Mediterranean Sea.\n\nIt was not a single road. Instead, many paths crossed mountains, deserts and grasslands. Very few traders traveled the whole way. A merchant would carry goods for part of the journey and sell them at a busy town or a desert oasis to another merchant, who carried them farther. Caravans of camels, which can go for days without water, crossed the hardest deserts. Silk and paper moved west, while glass, gold and horses moved east, changing hands many times along the way.\n\nGoods were not the only things that traveled. Travelers also carried ideas, inventions and religions, so the Silk Road connected the thinking of many peoples as well as their markets.",
  },
  {
    task: "Explain how the Inca sent messages, from these notes. Notes: Inca empire in the Andes, no horses or wheels for travel; roads over mountains; runners called chasquis; rest houses every few kilometers; each runner ran his part, then passed the message on; quipu, knotted cords, held numbers; a message could travel 240 km in a day.",
    model:
      "The Inca sent messages across their mountain empire with a relay of runners.\n\nThe empire stretched along the Andes, and its people had no horses or wheeled carts for travel. Instead, they built roads over the mountains and placed small rest houses every few kilometers. Runners called chasquis waited at each house. When a message arrived, a fresh runner took it and ran his part of the road at full speed to the next house, where he passed it on and rested. Spoken messages were repeated carefully, while numbers were carried on a quipu, a bundle of knotted cords in which each knot stood for an amount.\n\nBecause no runner had to go far, a message could cover about 240 kilometers in a single day. This let the rulers know quickly what was happening in every part of their land.",
  },
  {
    task: "Explain how the Chinese made paper, from these notes. Notes: credited to Cai Lun about 105 CE; bark, old rags, hemp and fishing nets soaked and beaten into pulp; pulp mixed with water; a screen dipped in and lifted out; thin layer of fibers left on the screen; dried in the sun; cheaper and lighter than bamboo strips or silk.",
    model:
      "The Chinese made paper by turning plant fibers into a thin, flat sheet.\n\nThe method is credited to an official named Cai Lun, about 105 CE. Workers first collected tree bark, hemp, old rags and worn-out fishing nets. They soaked these in water and beat them until they broke down into a soft mush called pulp. Next, they stirred the pulp into a large tub of water. A worker dipped a fine screen into the tub and lifted it out slowly, so the water drained away and left a thin layer of fibers on the screen. Finally, the sheet was dried in the sun until it could be peeled off.\n\nPaper was much cheaper than silk and much lighter than the bamboo strips used before. As a result, books and records became easier to make and to carry.",
  },
  {
    task: "Explain how Mesopotamian schools trained scribes, from these notes. Notes: called the tablet house; mostly sons of rich families; started young, studied for about twelve years; copied signs over and over on practice tablets; teacher wrote a model, student copied it below; learned math and law too; strict, with punishment for mistakes.",
    model:
      "In Mesopotamia, scribes learned to write in a school called the tablet house.\n\nMost students were boys from rich families, because a family had to pay for years of study and do without the boy's work. They started young and often studied for about twelve years. Each day, the teacher wrote a line of signs on one side of a clay tablet. The student then copied it underneath, again and again, until his signs matched the model. When the clay was full, it could be smoothed and used once more. Students learned more than writing: they also studied mathematics, the measuring of land and the words of laws. The teachers were strict, and a careless mistake could earn a beating.\n\nAfter so many years, a scribe could read and write hundreds of signs, a skill few others had.",
  },
  {
    task: "Explain how the Greeks chose their leaders in Athens, from these notes. Notes: democracy, about 500 BCE; only free men born in Athens could vote; the Assembly met about forty times a year; anyone in it could speak; voted by raising hands; many officials chosen by lot, drawing names; ostracism: vote to send a man away for ten years.",
    model:
      "Athens was one of the first cities to be run as a democracy, where citizens made decisions together.\n\nFrom about 500 BCE, the free men who were born in Athens met in a body called the Assembly about forty times a year. Any of them could stand up and speak about a question. Afterward, they voted, usually by raising their hands, and the larger side won. Many officials were not elected but chosen by lot: names were drawn at random, so any citizen might serve. Each year, the Assembly could also hold an ostracism, a vote to send one powerful man away from the city for ten years.\n\nHowever, women, slaves and people born elsewhere could not vote. Athenian democracy gave power to many people, but not to everyone who lived there.",
  },
];

/** processBank gives notes on a natural process to explain. */
const processBank: readonly WritingItem[] = [
  {
    task: "Explain how a volcano erupts, from these notes. Notes: deep underground rock melts into magma; magma is lighter than solid rock, so it rises; collects in a magma chamber; gas in the magma builds pressure; magma pushes up through cracks; bursts out of a vent; called lava above ground; ash and gas thrown into the air.",
    model:
      "A volcano erupts when melted rock from deep underground forces its way to the surface.\n\nFar below the ground, it is so hot that some rock melts into magma, which is melted rock beneath Earth's surface. Because magma is lighter than the solid rock around it, it slowly rises and collects in a space called a magma chamber. The magma holds gases, much as a bottle of soda holds bubbles. As more magma gathers, the gases build up pressure. Eventually, the pressure becomes so great that the magma pushes up through cracks in the rock. It finally bursts out of an opening called a vent. Once it is above ground, the melted rock is called lava, and the eruption may also throw ash and gas high into the air.\n\nIn short, heat makes magma, and pressure drives it out.",
  },
  {
    task: "Explain how an earthquake happens, from these notes. Notes: Earth's crust is broken into plates; plates move slowly; at a fault the rocks are stuck by friction; stress builds over years; rocks suddenly slip; energy travels as seismic waves; the ground shakes; the focus is where it starts underground, the epicenter is above it.",
    model:
      "An earthquake happens when rocks underground suddenly slip and send out waves of energy.\n\nEarth's crust is broken into huge pieces called plates, and they move a few centimeters each year. At a fault, which is a crack where two blocks of rock meet, the rocks try to slide past each other. However, friction holds them stuck. Over many years, stress builds up in the rocks, the way a bent ruler stores energy. Finally, the stress becomes too great, and the rocks slip all at once. The stored energy rushes out as seismic waves, vibrations that travel through the ground and make it shake. The place underground where the slip starts is the focus, and the point on the surface right above it is the epicenter, where the shaking is usually strongest.\n\nSo an earthquake is years of slow stress released in seconds.",
  },
  {
    task: "Explain how a cell divides, from these notes. Notes: cells divide so living things grow and repair; mitosis; first the cell copies its DNA; copies coil into chromosomes; chromosomes line up in the middle; pulled apart to the two ends; a new nucleus forms at each end; the cell pinches in two; two identical cells.",
    model:
      "Cells divide by a process called mitosis, which turns one cell into two identical cells.\n\nLiving things need new cells to grow and to repair damage. Before a cell divides, it first makes a complete copy of its DNA, the instructions that tell the cell how to work. Next, the DNA coils tightly into chromosomes, thick threads that are easy to move. The chromosomes then line up across the middle of the cell. After that, each one is pulled apart, so one copy goes to each end of the cell. A new nucleus, the cell's control center, forms around each set. Finally, the cell pinches in the middle until it splits in two.\n\nBecause each new cell received a full copy of the DNA, the two cells are exactly alike, and each can divide again.",
  },
  {
    task: "Explain the water cycle, from these notes. Notes: sun heats water in oceans, lakes and rivers; evaporation: water becomes vapor and rises; vapor cools high up; condensation: tiny droplets form clouds; droplets join and grow heavy; precipitation: rain, snow or hail; water runs into rivers or soaks into the ground; back to the sea.",
    model:
      "The water cycle is the endless journey of water between the land, the sea and the sky.\n\nIt begins when the sun heats water in oceans, lakes and rivers. Through evaporation, which is the change of liquid water into a gas called water vapor, the water rises into the air. High above the ground, the air is cold, so the vapor cools. It then turns back into tiny drops of liquid by condensation, and millions of these drops together form clouds. Inside a cloud, the drops bump into each other and join until they grow too heavy to float. They fall as precipitation: rain, snow or hail. On the ground, the water runs into rivers or soaks into the soil, and sooner or later it flows back to the sea.\n\nThen the sun warms it again, and the cycle repeats.",
  },
  {
    task: "Explain how a plant makes its food, from these notes. Notes: photosynthesis; leaves contain chlorophyll, a green substance; roots take in water; leaves take in carbon dioxide from the air through tiny holes; chlorophyll captures sunlight; energy turns water and carbon dioxide into sugar; oxygen released.",
    model:
      "Plants make their own food through photosynthesis, using sunlight, water and air.\n\nThe process needs three things. First, the roots take in water from the soil, and it travels up the stem to the leaves. Second, the leaves take in carbon dioxide, a gas in the air, through tiny holes on their surface. Third, the leaves contain chlorophyll, a green substance that captures the energy of sunlight. Inside the leaf, the plant uses this energy to join the water and carbon dioxide together into sugar. The sugar is the plant's food, which it uses to grow or stores for later. As this happens, the plant releases oxygen into the air.\n\nIn other words, a plant turns light into food, and the oxygen it gives off is the air that animals, including people, need to breathe.",
  },
  {
    task: "Explain how a fossil forms, from these notes. Notes: an animal dies near water; body sinks and is covered by mud or sand quickly; soft parts rot, hard parts like bones remain; more layers of sediment pile on top; pressure turns layers into rock; water with minerals soaks into the bones; minerals replace the bone; erosion later uncovers it.",
    model:
      "A fossil forms when the remains of a living thing are slowly turned to stone.\n\nThe process usually starts when an animal dies in or near water. Its body sinks and is quickly buried by mud or sand, which protects it from animals that eat dead things. The soft parts rot away, but the hard parts, such as bones and teeth, remain. Over thousands of years, more layers of sediment, which is sand, mud and bits of rock, pile on top. The great weight presses the lower layers into solid rock. Meanwhile, water full of minerals seeps into the bones, and little by little the minerals take the place of the bone. The bone becomes a copy made of stone.\n\nMillions of years later, wind and water may wear away the rock above, and the fossil finally comes to light.",
  },
  {
    task: "Explain how a cave forms in limestone, from these notes. Notes: rain picks up carbon dioxide and becomes a weak acid; seeps into cracks in limestone; acid slowly dissolves the rock; cracks widen into tunnels; underground streams carry the dissolved rock away; takes thousands of years; dripping water leaves stalactites and stalagmites.",
    model:
      "Caves form in limestone when water slowly dissolves the rock from the inside.\n\nAs rain falls through the air and the soil, it picks up carbon dioxide and becomes a weak acid, like very mild vinegar. This water seeps down into cracks in the limestone. Limestone dissolves in acid, so the water eats away a tiny amount of rock as it passes. Over time, the cracks grow wider and join together into tunnels. Underground streams then carry the dissolved rock away, leaving hollow spaces behind. This happens very slowly, so a large cave can take hundreds of thousands of years to form. Later, water dripping from the ceiling leaves behind bits of rock. They build up into stalactites, which hang down, and stalagmites, which grow up from the floor.\n\nA cave, then, is rock removed one drop at a time.",
  },
  {
    task: "Explain how the body digests food, from these notes. Notes: digestion breaks food into nutrients; teeth chew, saliva softens; esophagus carries food to stomach by squeezing; stomach acid and enzymes break it down; small intestine absorbs nutrients into the blood; large intestine takes back water; waste leaves the body.",
    model:
      "Digestion is the process that breaks food down into nutrients the body can use.\n\nIt begins in the mouth. The teeth chew the food into small pieces, and saliva softens it. When we swallow, the esophagus, a muscular tube, squeezes the food down to the stomach. There, strong acid and enzymes, which are chemicals that break food into smaller parts, turn it into a thick liquid. Next, the food moves into the small intestine, a long, coiled tube. Its walls absorb the nutrients and pass them into the blood, which carries them to every part of the body. What is left moves on to the large intestine, where most of the water is taken back. Finally, the waste leaves the body.\n\nFrom start to finish, each organ does one step, and together they feed every cell.",
  },
  {
    task: "Explain how a tsunami forms and travels, from these notes. Notes: an earthquake under the sea lifts or drops the sea floor; all the water above is pushed; waves spread out in every direction; in deep water they are fast and low; near shore the water gets shallow; waves slow down and grow tall; sea may pull back first; waves flood the land.",
    model:
      "A tsunami is a series of giant waves set off by a sudden movement of the sea floor.\n\nMost tsunamis begin with an earthquake under the ocean. When the sea floor is suddenly lifted or dropped, all the water above it is pushed up or pulled down. That push sends waves racing outward in every direction. In deep water, the waves travel as fast as a jet plane, yet they are so low that ships may not notice them. As the waves reach the coast, the water becomes shallow. The front of each wave slows down while the water behind it keeps coming, so the wave grows taller and taller. Just before it arrives, the sea may pull back and leave the beach bare. Then the wave rushes far onto the land.\n\nThat is why a sea that suddenly pulls back is a warning to run to high ground.",
  },
  {
    task: "Explain how a seed grows into a plant, from these notes. Notes: germination; a seed holds a tiny plant and stored food; needs water, warmth and air; seed takes in water and swells; seed coat splits; root grows down first; then a shoot grows up toward light; first leaves open and begin photosynthesis; stored food used up.",
    model:
      "A seed grows into a plant through a process called germination.\n\nInside every seed is a tiny plant and a store of food, wrapped in a hard seed coat. The seed waits until it has water, warmth and air. When it is planted in damp, warm soil, it takes in water and swells. Soon the seed coat splits open. The first part to come out is the root, which grows downward to anchor the plant and draw in more water. Next, a shoot pushes upward toward the light. Until now, the young plant has lived on the food stored in the seed. When its first leaves open in the sunlight, however, they begin photosynthesis, the way plants make their own food.\n\nBy the time the stored food is used up, the young plant can feed itself and keep growing.",
  },
  {
    task: "Explain how a glacier shapes the land, from these notes. Notes: snow piles up over years and presses into ice; the ice becomes so heavy it flows slowly downhill; rocks freeze into the bottom of the glacier; the glacier scrapes and grinds the ground; carves U-shaped valleys; carries rocks far away; when it melts, it leaves piles of rock called moraines.",
    model:
      "A glacier, a huge mass of ice that moves slowly over land, can reshape whole mountains.\n\nA glacier begins where more snow falls each winter than melts each summer. Year after year, the snow piles up, and its weight presses the lower layers into solid ice. When the ice becomes thick and heavy enough, it starts to flow downhill, very slowly, like cold honey. As it moves, rocks freeze into its bottom. These rocks act like the teeth of a giant file, so the glacier scrapes and grinds the ground beneath it. Over thousands of years, it carves narrow river valleys into wide, U-shaped ones. It also carries rocks for great distances. When the glacier finally melts, it drops them in long piles called moraines.\n\nLong after the ice is gone, these valleys and piles show where it once flowed.",
  },
  {
    task: "Explain how the heart moves blood, from these notes. Notes: the heart is a muscle with four chambers; right side receives blood that has used its oxygen; pumps it to the lungs; lungs add oxygen; left side receives this blood and pumps it to the body; valves keep blood flowing one way; the beat is the heart squeezing.",
    model:
      "The heart is a muscle that pumps blood around the body in two loops.\n\nIt has four hollow spaces called chambers, two on the right side and two on the left. Blood that has already given its oxygen to the body returns to the right side first. When the heart squeezes, the right side pumps this blood to the lungs. In the lungs, the blood picks up fresh oxygen from the air we breathe. It then flows back to the left side of the heart. With the next squeeze, the left side, which is the strongest part, pumps the blood out to the whole body. Between the chambers are valves, small flaps that close behind the blood so it can only flow one way. Each beat you feel is the heart squeezing.\n\nSo every drop of blood visits the lungs and then the body, again and again, all day long.",
  },
];

/** compareBank gives two things to compare with notes on each. */
const compareBank: readonly WritingItem[] = [
  {
    task: "Write a compare-and-contrast essay on plant cells and animal cells, from these notes. Both: a membrane, a nucleus, cytoplasm, use energy. Plant cells: a stiff cell wall, chloroplasts that make food, a large water vacuole, often box-shaped. Animal cells: no cell wall, no chloroplasts, small vacuoles, often round.",
    model:
      "Plant cells and animal cells are the building blocks of two great kingdoms of life. Comparing their parts shows how much they share and how they differ.\n\nThe two kinds of cells are alike in their basic parts. Both are surrounded by a membrane that controls what enters and leaves. Similarly, both have a nucleus that directs the cell's work and cytoplasm, the jelly in which everything floats. Both also use energy to stay alive.\n\nHowever, plant cells have parts that animal cells lack. A plant cell has a stiff cell wall outside its membrane, so it is often shaped like a box, while an animal cell has no wall and is often round. In addition, plant cells contain chloroplasts, which make food from sunlight. Animal cells, in contrast, must get their food by eating. Finally, a plant cell has one large vacuole full of water, whereas an animal cell has only small ones.\n\nIn short, the two share the parts all life needs, but only plant cells are built to stand stiff and make their own food.",
  },
  {
    task: "Write a compare-and-contrast essay on volcanoes and earthquakes, from these notes. Both: caused by moving plates, most happen at plate edges, can destroy towns, studied by scientists. Volcanoes: melted rock reaches the surface, build mountains, often give warnings like rumbling. Earthquakes: rocks slip and shake the ground, no new land, strike with almost no warning.",
    model:
      "Volcanoes and earthquakes are two of the most powerful events on Earth. Looking at their causes and their effects shows that they are related but not the same.\n\nIn their causes, the two are alike. Both are driven by the slow movement of the plates that make up Earth's crust. Likewise, most of them happen along the edges of those plates, where the plates meet or pull apart. Both can destroy whole towns, and scientists study both to protect people.\n\nTheir effects, however, are different. A volcano lets melted rock reach the surface, and over time the lava and ash build new mountains. An earthquake, in contrast, adds no new land; rocks underground simply slip and shake the ground. The warnings differ too. A volcano often rumbles, steams or swells for days before it erupts. On the other hand, an earthquake usually strikes with almost no warning at all.\n\nBoth come from the same restless Earth, but one builds the land while the other only shakes it.",
  },
  {
    task: "Write a compare-and-contrast essay on Mesopotamia and ancient Egypt, from these notes. Both: grew along rivers, farmed with irrigation, built great temples, had writing and kings. Mesopotamia: two rivers with wild, unpredictable floods, many city-states often at war, cuneiform on clay. Egypt: one river with a gentle, regular flood, one kingdom under a pharaoh, hieroglyphs on stone and papyrus.",
    model:
      "Mesopotamia and Egypt were two of the world's first civilizations. Comparing their rivers, their governments and their writing shows both their likenesses and their differences.\n\nThe two had much in common. Both grew up along rivers in dry lands, and both used irrigation to water their crops. Similarly, both built great temples, had powerful kings and invented writing to keep records.\n\nHowever, their rivers were very different. Mesopotamia lay between two rivers, the Tigris and the Euphrates, whose floods were wild and hard to predict. In contrast, Egypt's Nile flooded gently and at the same time each year. Their governments differed too. Mesopotamia was divided into many city-states that often fought one another, whereas Egypt was usually one kingdom under a single pharaoh. Finally, Mesopotamians pressed cuneiform into clay, while Egyptians carved or painted hieroglyphs on stone and papyrus.\n\nBoth civilizations were born of rivers, but Egypt's calmer river may help explain why it stayed united for so long.",
  },
  {
    task: "Write a compare-and-contrast essay on frogs and lizards, from these notes. Both: cold-blooded, have backbones, lay eggs, eat insects. Frogs: amphibians, smooth wet skin, eggs in water with no shell, start life as tadpoles in water. Lizards: reptiles, dry scaly skin, eggs with leathery shells on land, hatch looking like small adults.",
    model:
      "Frogs and lizards are both small animals that many people confuse, but they belong to different groups. Comparing how they live and grow shows why.\n\nIn some ways, they are alike. Both are cold-blooded, which means their body temperature changes with the air around them. Both have backbones, both lay eggs and both feed mainly on insects.\n\nHowever, a frog is an amphibian, while a lizard is a reptile, and this makes a big difference. A frog has smooth, wet skin that must stay damp. A lizard, on the other hand, has dry skin covered in scales, so it can live in hot, dry places. Their eggs differ as well. A frog lays soft eggs with no shell in water, but a lizard lays eggs with leathery shells on land. Finally, a young frog starts life as a tadpole that swims and breathes underwater. In contrast, a baby lizard hatches looking like a small adult.\n\nSo although both are small, cold-blooded egg-layers, the frog needs water all its life, and the lizard does not.",
  },
  {
    task: "Write a compare-and-contrast essay on soccer and basketball, from these notes. Both: two teams, score by putting a ball in a goal, need teamwork, played around the world. Soccer: eleven players, played on grass, mostly feet, low scores, ninety minutes. Basketball: five players, played on a wooden court, hands only, high scores, forty-eight minutes in the NBA.",
    model:
      "Soccer and basketball are two of the most popular sports in the world. Comparing how they are played shows what they share and what makes each one different.\n\nThe two games are alike in their aims. In both, two teams try to put a ball into the other team's goal or basket. Both need passing and teamwork, and both are played and watched in nearly every country.\n\nHowever, the games are played very differently. A soccer team has eleven players on a large grass field, while a basketball team has only five on a small wooden court. In soccer, players mostly use their feet, and only the goalkeeper may use hands. In basketball, in contrast, players use only their hands. The scores differ too. A soccer match often ends 1 to 0 or 2 to 1 after ninety minutes, whereas an NBA game lasts forty-eight minutes and may end with more than 100 points for each team.\n\nBoth games reward teamwork, but soccer is a slow battle for a few goals, and basketball is a fast race of many baskets.",
  },
  {
    task: "Write a compare-and-contrast essay on farming 100 years ago and today, from these notes. Both: grow crops and raise animals, depend on weather and soil, feed people. 100 years ago: horses and hand tools, small family farms, one farmer fed about 10 people. Today: tractors and computers, large farms, one farmer feeds about 150 people, more fertilizer and machines.",
    model:
      "Farming has changed more in the last hundred years than in the thousand years before. Comparing farms then and now shows both what has stayed the same and what has changed.\n\nSome things have not changed at all. Farmers still grow crops and raise animals, and they still feed everyone else. Likewise, they still depend on good soil and the right weather; a drought can ruin a harvest today just as it did a century ago.\n\nHowever, the way the work is done has changed completely. A hundred years ago, farmers plowed with horses and harvested with hand tools. Today, in contrast, they use huge tractors, and some even guide their machines with computers. Farms have changed size too. Most farms used to be small and run by one family, whereas many farms today are very large. As a result, one farmer a century ago fed about ten people, while one farmer today feeds about 150, helped by machines and fertilizer.\n\nFarming still depends on soil and sky, but machines have made each farmer able to feed many more people.",
  },
  {
    task: "Write a compare-and-contrast essay on a story told in a book and in a film, from these notes. Both: same characters and plot, same ending, can make people laugh or cry. Book: words only, the reader imagines faces and places, can tell a character's thoughts, takes hours. Film: pictures and music, the director shows the faces and places, thoughts must be shown by actors, about two hours.",
    model:
      "Many stories are told first in a book and later in a film. Comparing the two shows what each form does well.\n\nThe two share the heart of the story. A good film keeps the same characters, the same plot and usually the same ending as the book. Similarly, both can make an audience laugh, worry or cry.\n\nHowever, they tell the story in different ways. A book uses only words, so the reader must imagine every face and every place. A film, on the other hand, shows them with pictures and music, and the director decides how they look. A book can also tell exactly what a character is thinking. In contrast, a film must show thoughts through an actor's face and voice. Finally, reading a long book can take many hours, whereas most films last about two hours, so some scenes from the book are often cut.\n\nEach form has its own strength: a book lets us inside a character's mind, and a film lets us see and hear the world of the story.",
  },
  {
    task: "Write a compare-and-contrast essay on bees and wasps, from these notes. Both: insects with stingers, black and yellow, live in colonies with a queen, important to nature. Bees: hairy, eat nectar and pollen, pollinate crops, most die after stinging, make honey. Wasps: smooth and thin, eat other insects, control pests, can sting many times, no honey.",
    model:
      "Bees and wasps look so alike that many people cannot tell them apart. Comparing their bodies, their food and their stings shows how different they really are.\n\nThey do have a lot in common. Both are insects with stingers, and many kinds of both are striped black and yellow. Similarly, many bees and wasps live in colonies ruled by a queen, and both are important to nature.\n\nHowever, their bodies differ. A bee is round and covered in fine hairs, while a wasp is smooth and thin, with a narrow waist. Their food differs as well. Bees eat nectar and pollen, and as they fly from flower to flower they pollinate crops. Wasps, in contrast, hunt other insects, so they help farmers by eating pests. Finally, a honeybee usually dies after it stings, but a wasp can sting again and again. Only bees make honey.\n\nBoth are useful to people: bees help our food grow, and wasps protect it from pests.",
  },
  {
    task: "Write a compare-and-contrast essay on city life and country life, from these notes. Both: people work, go to school, have neighbors, need shops and doctors. City: crowded, tall buildings, buses and trains, many shops and jobs close by, noisy. Country: open space, farms and fields, need a car, shops and doctors far away, quiet.",
    model:
      "Some families live in busy cities and others in the quiet countryside. Comparing daily life in the two places shows what they share and how they differ.\n\nIn many ways, life is the same in both. People in cities and in the country go to work and to school. Likewise, they have neighbors, and they need shops, doctors and other services.\n\nHowever, the places themselves are very different. A city is crowded, with tall buildings and streets full of people. The country, in contrast, has open space, farms and fields. Getting around differs too. In a city, people can take buses and trains, and many shops and jobs are a short walk away. In the country, on the other hand, most families need a car, because shops and doctors may be far away. Finally, cities are noisy day and night, whereas the country is usually quiet.\n\nCity life offers everything close at hand, while country life offers space and quiet, so each family must decide which matters more.",
  },
  {
    task: "Write a compare-and-contrast essay on the Olympic Games of ancient Greece and today, from these notes. Both: held every four years, athletes from many places, running and wrestling, winners honored. Ancient: only at Olympia, only free Greek men, an olive wreath as the prize, a religious festival for Zeus. Today: a different city each time, women and men from every country, gold medals, hundreds of sports.",
    model:
      "The Olympic Games began in ancient Greece almost 2,800 years ago, and they are still held today. Comparing the ancient Games with the modern ones shows what has lasted and what has changed.\n\nSome traditions have lasted. Both the ancient and the modern Games are held every four years. Similarly, both bring together athletes from many places, both include running and wrestling, and both honor their winners as heroes.\n\nHowever, much has changed. The ancient Games were always held at Olympia, while the modern Games move to a different city each time. Who could compete was also different. In ancient times, only free Greek men took part, whereas today women and men come from almost every country. The prizes differ too. An ancient winner received a wreath of olive leaves; in contrast, a modern winner receives a gold medal. Finally, the ancient Games were a religious festival for the god Zeus, but the modern Games are a celebration of sport, with hundreds of events.\n\nThe Games have grown from one Greek festival into a meeting of the whole world.",
  },
  {
    task: "Write a compare-and-contrast essay on reading on paper and reading on a screen, from these notes. Both: can hold the same stories and facts, need attention, used at school. Paper: no battery, easy on the eyes, easier to remember what you read, heavy to carry many. Screen: holds thousands of books, can search and change text size, needs power, links and alerts distract.",
    model:
      "Students today read both on paper and on screens. Comparing the two shows what each is good for.\n\nThe two have the same purpose. A printed book and a screen can hold the very same stories and facts. Likewise, both need the reader's full attention, and both are used every day at school.\n\nHowever, they differ in useful ways. A paper book needs no battery and is easy on the eyes. Some studies suggest that readers also remember more of what they read on paper. On the other hand, a pile of books is heavy, while a single tablet can hold thousands of them. A screen also lets readers search for a word or make the text larger. Yet a screen needs power, and in contrast to a quiet page, its links and alerts can pull a reader away from the text.\n\nPaper may be better for careful reading, and screens for carrying and searching, so many readers use both.",
  },
  {
    task: "Write a compare-and-contrast essay on hurricanes and tornadoes, from these notes. Both: spinning storms with powerful winds, can destroy buildings, warnings given by weather services. Hurricanes: form over warm oceans, hundreds of kilometers wide, last for days, tracked a week ahead. Tornadoes: form over land from thunderstorms, usually less than a kilometer wide, last minutes, warning only minutes ahead.",
    model:
      "Hurricanes and tornadoes are both terrifying storms. Comparing where they form, their size and how long they last shows how different they are.\n\nThe two do share some features. Both are spinning storms with winds strong enough to tear roofs off buildings. Similarly, weather services watch for both and warn people to take shelter.\n\nHowever, they form in different places. A hurricane forms over warm ocean water, while a tornado forms over land, usually from a strong thunderstorm. Their size is very different too. A hurricane can be hundreds of kilometers wide. In contrast, most tornadoes are less than a kilometer across. Finally, they last for different lengths of time. A hurricane can last for days, so forecasters can track it a week before it reaches land. A tornado, on the other hand, usually lasts only minutes, and people may get just a few minutes of warning.\n\nA hurricane is a huge, slow storm that people can prepare for, and a tornado is a small, sudden one that gives them almost no time.",
  },
];

/** memoirBank gives a moment to tell as a memoir scene. */
const memoirBank: readonly WritingItem[] = [
  {
    task: "Write a memoir scene about a time you were afraid but did something anyway. Tell one moment as a scene, with what you saw, heard and felt, and end by looking back on what it meant.",
    model:
      'The diving board was higher than it had looked from the ground. I stood at the edge with my toes curled over the rough end, and the water below glittered so brightly that I had to squint. Behind me, a boy shifted on the ladder and sighed loudly.\n\n"Just jump," my sister called from the side of the pool. Her voice sounded far away.\n\nMy heart was pounding so hard that I could feel it in my ears. I looked down at my knees, which were shaking, and then at the clock on the wall. I counted to three. Then I counted to three again. Finally, I took a breath, closed my eyes and stepped off into nothing.\n\nThe cold water closed over my head, and when I came up, my sister was cheering.\n\nLooking back, I see that the jump took only a second, but standing on that board taught me something I still use. Fear does not have to leave before you act. Sometimes you just have to step off while it is still there.',
  },
  {
    task: "Write a memoir scene about a meal you remember with your family. Tell one moment as a scene, with what you saw, smelled, heard and felt, and end by looking back on what it meant to you.",
    model:
      'Grandma\'s kitchen was so full of steam that the windows had turned white. Pots rattled on every burner, and the smell of garlic and ginger filled the whole apartment. My cousins crowded around the small table, elbows bumping, while my uncle squeezed in one more folding chair.\n\n"Wait, wait," Grandma said as my little brother reached for the dumplings. She set down the last dish, a whole fish shining with sauce, and finally sat down herself.\n\nFor a moment, everyone was quiet. Then my uncle told a joke that was not funny at all, and we all laughed anyway. My chopsticks kept slipping, and Grandma reached over without a word and put the best piece of fish in my bowl.\n\nThat was the last New Year before we moved away. I did not know it then, but I know now that the food was never the point. What I miss is the crowded table, the bad jokes and the feeling of being exactly where I belonged.',
  },
  {
    task: "Write a memoir scene about a time you lost something that mattered to you. Tell one moment as a scene, with what you saw, heard and felt, and end by looking back on what it meant.",
    model:
      "I knew the bracelet was gone the second I reached the bus stop. My wrist felt strangely light. I patted my pockets, then my backpack, then my pockets again, as if it might appear the third time.\n\nThe bracelet had been my mother's. It was only a thin silver chain with a tiny blue stone, but she had worn it every day until she gave it to me on my birthday.\n\nI ran back along the street, staring at every crack in the sidewalk. Cars hissed past through the puddles. A man walking his dog asked if I was all right, and I could not answer, because my throat had closed up tight.\n\nI never found it. That evening I told my mother, and I waited for her to be angry. Instead, she held my hand and said, \"It was just a chain. You're the thing I gave you.\"\n\nI still think about that bracelet. But since that day, I have understood that the people who give us things matter far more than the things themselves.",
  },
  {
    task: "Write a memoir scene about your first day in a new place, such as a new school, town or country. Tell one moment as a scene, with what you saw, heard and felt, and end by looking back on what it meant.",
    model:
      'The cafeteria was louder than any room I had ever been in. Hundreds of voices bounced off the walls, and trays clattered as students pushed past me. I stood at the end of the line holding a tray with a slice of pizza on it, searching for one face I knew. There wasn\'t one.\n\nEvery table seemed full. At one, a group of girls was laughing at something on a phone. At another, two boys were arguing about a game. I walked slowly down the middle aisle, pretending to look for someone, while the pizza went cold.\n\nThen a girl with a green backpack moved her bag off the seat next to her. "You can sit here," she said. "I\'m Ana. Are you new?"\n\nI nodded and sat down, and my shoulders finally dropped.\n\nAna and I are still friends. Looking back, I realize how small her act was: she only moved a backpack. Ever since, when I see someone standing alone with a tray, I move my bag.',
  },
  {
    task: "Write a memoir scene about a time you made a mistake and had to own up to it. Tell one moment as a scene, with what you saw, heard and felt, and end by looking back on what it meant.",
    model:
      'The baseball sailed higher than I meant it to, over the fence and straight into Mrs. Ortiz\'s kitchen window. The crash was like a hundred plates falling at once.\n\nFor a second, nobody moved. Then my friends scattered, their sneakers slapping on the sidewalk as they ran. I stood alone in the street holding the bat, staring at the jagged hole in the glass.\n\nI could have run too. Nobody had seen me hit it. Instead, my feet carried me up her front steps, and my hand knocked on the door before I could stop it. My face was burning.\n\nMrs. Ortiz opened the door with a dish towel in her hand. "I broke your window," I said, and my voice cracked. "I\'m sorry. I\'ll pay for it."\n\nShe looked at me for a long moment, and then she smiled a little. "Thank you for knocking," she said.\n\nI spent two months of allowance on that window. Looking back, it was the best money I ever spent, because it taught me that owning up feels hard for a minute and right for much longer.',
  },
  {
    task: "Write a memoir scene about a moment with a grandparent or an older relative. Tell one moment as a scene, with what you saw, heard and felt, and end by looking back on what it meant to you.",
    model:
      'Every Sunday morning, Grandpa and I fished from the old wooden dock behind his house. The boards were gray and creaky, and the lake was so still that it looked like a mirror.\n\nThat Sunday, I had been waiting for an hour, and nothing had happened. "This is boring," I said, kicking my heels against the dock. "There aren\'t any fish."\n\nGrandpa did not look up from his line. He poured coffee from his dented thermos and held out the cup lid to me. It tasted bitter and warm. "The fish don\'t care how bored you are," he said. "They come when they come."\n\nA heron landed on the far shore and stood perfectly still. Grandpa pointed at it with his chin. "Now there\'s a real fisherman," he whispered.\n\nWe caught one small fish that day, and Grandpa let it go. He has been gone for three years now. I realize today that he was never really teaching me to fish. He was teaching me to wait, and to notice the heron while I waited.',
  },
  {
    task: "Write a memoir scene about a time you worked hard for something. Tell one moment as a scene, with what you saw, heard and felt, and end by looking back on what it meant.",
    model:
      'The hall went quiet as I walked to the piano. My shoes squeaked on the polished floor, and the bench felt cold even through my dress. Somewhere in the third row, my father cleared his throat.\n\nFor six months, I had practiced this piece every evening. I had played it so many times that my little brother could hum every note, and he hated it.\n\nI put my hands on the keys. For one terrible second, my mind went white, and I could not remember how the piece began. Then my fingers moved on their own. The first notes came out soft and clear, and the music carried me the rest of the way. When I played the last chord, my hands were trembling, and the audience began to clap.\n\nAfterward, my teacher hugged me and said, "Now you know what all those evenings were for."\n\nI did not win a prize that day. But since then, whenever something feels too hard, I remember that moment when my fingers knew what to do, because I had taught them.',
  },
  {
    task: "Write a memoir scene about a time you helped someone or someone helped you. Tell one moment as a scene, with what you saw, heard and felt, and end by looking back on what it meant.",
    model:
      'The rain started just as I reached the corner, and within a minute it was pouring. I had no umbrella and no coat, and my backpack was full of the poster I had spent all weekend making for my science project.\n\nI pressed myself against the wall of a shop, but the water ran off the roof right onto my shoes. Cars splashed past. The poster was already getting damp at the corners, and I could feel tears coming.\n\nThen an old man in a long gray coat stopped beside me. Without a word, he opened his big black umbrella and held it over me and my backpack. "Where are you going?" he asked. When I told him, he said, "That\'s on my way," and walked me all six blocks to school while the rain drummed on the umbrella.\n\nAt the school gate, he tipped his hat and walked back the way we had come. It had not been on his way at all.\n\nI never learned his name. Even now, whenever I see someone in need, I think of that stranger and his umbrella.',
  },
  {
    task: "Write a memoir scene about a trip or a visit that changed how you saw something. Tell one moment as a scene, with what you saw, heard and felt, and end by looking back on what it meant.",
    model:
      "The village had no taps. I learned this on our first morning, when my aunt handed me a yellow plastic bucket and pointed down the dirt path toward the well.\n\nThe path was steep and rocky, and the sun was already hot. At the well, a line of girls waited, some younger than me, each with a bucket. They laughed and talked as they pulled up the rope, hand over hand. When my turn came, the rope burned my palms, and the full bucket was so heavy that water slopped over my sandals.\n\nOn the way back, I had to stop three times. A girl about my age walked beside me, carrying two buckets without spilling a drop. She smiled and said something I did not understand, and then she took my bucket too, until I could breathe again.\n\nAt home, I had always let the tap run while I brushed my teeth. Since that summer, I have never taken clean water for granted. Every time I turn on a tap, I think of that path and that girl with two buckets.",
  },
  {
    task: "Write a memoir scene about a time you disagreed with a friend or a family member. Tell one moment as a scene, with what you saw, heard and felt, and end by looking back on what it meant.",
    model:
      '"You always get your way!" my sister shouted, and she slammed her bedroom door so hard that a picture fell off the hall wall.\n\nI stood in the hallway with the remote control still in my hand. We had been fighting about which show to watch, but it felt like a much bigger fight than that. The house was suddenly silent except for the television, which was still playing my show to an empty room.\n\nI picked up the picture. It was a photo of the two of us at the beach, years ago, holding up a crab we had caught together. The glass had cracked right between our faces.\n\nI knocked on her door. She did not answer, so I sat down on the floor outside it. After a long time, I said, "You can pick the show." The door opened a few centimeters. "Fine," she said. "But you can stay."\n\nWe watched her show together, and I hardly remember what it was. I realize now that the fight was never about the remote. She just wanted to know that I would choose her over getting my way.',
  },
  {
    task: "Write a memoir scene about a time you tried something new for the first time. Tell one moment as a scene, with what you saw, heard and felt, and end by looking back on what it meant.",
    model:
      'The ice was harder and slipperier than I had imagined. The moment my skates touched it, my feet shot in two different directions, and I grabbed the wall of the rink with both hands.\n\nAll around me, people glided past as if it were easy. A little girl in a pink helmet spun in a circle. Music echoed from the speakers, and the cold air made my nose run.\n\n"Let go of the wall," my cousin said, skating backward in front of me. "I\'ll hold your hands."\n\nI let go. For three wobbly steps, I moved forward. Then my legs folded, and I sat down hard on the ice. It was so cold that it burned through my jeans. My cousin laughed, and then, after a second, so did I. I got up, and I fell again, and I got up again.\n\nBy the end of the afternoon, I could skate halfway around the rink without falling. Looking back, I am proud of those hours, not because I learned to skate, but because I learned that falling down is part of learning anything.',
  },
  {
    task: "Write a memoir scene about a moment with a pet or an animal. Tell one moment as a scene, with what you saw, heard and felt, and end by looking back on what it meant.",
    model:
      'The storm had been raging for an hour when I noticed that the back gate was swinging open. My heart dropped. "Biscuit!" I shouted into the dark yard, but the only answer was the wind.\n\nI pulled on my boots and ran out with a flashlight. Rain stung my face, and the beam of light showed only rain and mud and the bushes thrashing. I called his name until my voice was hoarse. Our street was empty, and every house was dark.\n\nIt was almost midnight when I heard a tiny whimper. I shone the light under the porch next door, and there he was: a small, soaked, shivering dog with mud up to his ears. When he saw me, his tail thumped against the ground.\n\nI crawled in and held him against my chest, and I could feel his heart racing as fast as mine.\n\nThe next morning, my father fixed the latch on the gate. It took him five minutes. Ever since that night, I have known how much the small things matter, like a latch that someone forgot to close.',
  },
];

/** writingJudgedTopics6a are the grade 6 writing topics judged by a model, part one. */
export const writingJudgedTopics6a: readonly TopicDef[] = [
  {
    id: "writing-a-history-explanation",
    title: t("Writing a History Explanation", "写历史说明文"),
    summary: t(
      "Explain from notes how something worked in an early civilization: a topic sentence, the steps or parts in order, the facts in your own words and a conclusion on why it mattered.",
      "根据笔记说明早期文明中某样东西是怎样运作的：主题句、按顺序写出的步骤或组成部分、用自己的话写出的事实，以及说明其意义的结论。",
    ),
    prerequisites: after("writing-a-three-paragraph-report", "paraphrasing-a-source"),
    encompasses: [{ topic: "writing-a-three-paragraph-report", weight: 0.2 }],
    xp: 22,
    strand: "writing",
    criteria: ["w4-topic-sentence", "g6-explains-how", "g6-facts-from-notes", "w4-concludes"].map(criterion),
    knowledgePoints: [
      point(
        "explaining-how-it-worked",
        t("Explaining How It Worked", "说明它是怎样运作的"),
        t(
          "A history explanation does more than say that something existed; it explains **how it worked**. Begin with a topic sentence that names the thing and what it did: *Mesopotamian farmers used irrigation to bring river water to dry fields.* Then take the reader through it step by step or part by part, using words such as *first*, *when*, *then* and *because*, so that the reader could describe the system to someone else.",
          "历史说明文不只是说某样东西存在过，而是要说明**它是怎样运作的**。先写一个主题句，说出这样东西和它的作用：*Mesopotamian farmers used irrigation to bring river water to dry fields.* 然后用 *first*、*when*、*then*、*because* 等词，一步一步或一部分一部分地带读者了解它，让读者能把这个系统讲给别人听。",
        ),
        writingGenerator(
          t(
            "Write a history explanation in English from the notes, with a topic sentence and the steps or parts of how it worked.",
            "根据笔记用英语写一篇历史说明文，包括主题句以及它运作的步骤或组成部分。",
          ),
          historyBank,
          ["g6-explains-how", "w4-topic-sentence", "g6-facts-from-notes"],
          { minWords: 100, maxChars: 3200 },
          onePiece,
        ),
      ),
      point(
        "from-notes-to-an-explanation",
        t("From Notes to an Explanation", "从笔记到说明文"),
        t(
          "Notes are short scraps: *canals from rivers; gates of mud and reeds*. Turn them into full sentences **in your own words**, and keep every fact accurate: do not change a number or add something the notes do not say. Then end with a conclusion that tells why the thing mattered: *With extra food, more people could live together, and the first cities grew.*",
          "笔记只是零碎的片段：*canals from rivers; gates of mud and reeds*。要把它们**用自己的话**写成完整的句子，并保证每个事实都准确：不要改动数字，也不要添加笔记中没有的内容。最后用结论说明这样东西为什么重要：*With extra food, more people could live together, and the first cities grew.*",
        ),
        writingGenerator(
          t(
            "Write a history explanation in English from the notes, using the facts in your own words and ending with why it mattered.",
            "根据笔记用英语写一篇历史说明文，用自己的话写出事实，并以它的意义作结。",
          ),
          historyBank,
          ["g6-facts-from-notes", "w4-concludes", "w4-topic-sentence"],
          { minWords: 100, maxChars: 3200 },
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-an-explanation-of-a-process",
    title: t("Writing an Explanation of a Process", "写过程说明文"),
    summary: t(
      "Explain a natural process from notes: the stages in the order they happen, linked by order and cause words, with each technical term defined the first time it is used.",
      "根据笔记说明一个自然过程：按发生顺序写出各个阶段，用表示顺序和因果的词连接，并在第一次使用技术术语时给出定义。",
    ),
    prerequisites: after("defining-a-term-in-a-sentence", "writing-an-informative-paragraph"),
    encompasses: [{ topic: "defining-a-term-in-a-sentence", weight: 0.2 }],
    xp: 22,
    strand: "writing",
    criteria: ["g6-process-in-order", "g6-defines-terms", "w4-gives-detail", "w4-concludes"].map(criterion),
    knowledgePoints: [
      point(
        "the-stages-in-order",
        t("The Stages in Order", "按顺序写出各个阶段"),
        t(
          "A process happens in **stages**, and an explanation gives them in the order they happen. Link the stages with words that show order (*first*, *next*, *after that*, *finally*) and words that show cause (*because*, *so*, *as a result*), so the reader sees not only what happens next but why. Add a detail or a comparison that makes each stage clear: *the gases build up pressure, much as a bottle of soda holds bubbles.*",
          "过程是分**阶段**进行的，说明文要按发生的顺序写出这些阶段。用表示顺序的词（*first*、*next*、*after that*、*finally*）和表示因果的词（*because*、*so*、*as a result*）把各阶段连接起来，让读者不仅知道接下来发生什么，还知道为什么。为每个阶段补充一个细节或比较，让它更清楚：*the gases build up pressure, much as a bottle of soda holds bubbles.*",
        ),
        writingGenerator(
          t(
            "Explain the process in English from the notes, giving its stages in order with words of order and cause.",
            "根据笔记用英语说明这个过程，用表示顺序和因果的词按顺序写出各个阶段。",
          ),
          processBank,
          ["g6-process-in-order", "w4-gives-detail", "w4-concludes"],
          { minWords: 100, maxChars: 3200 },
          onePiece,
        ),
      ),
      point(
        "defining-the-terms",
        t("Defining the Terms", "给术语下定义"),
        t(
          "An explanation of a process is full of technical words: *magma*, *evaporation*, *chromosome*. A reader who is new to the subject needs each one **defined the first time it appears**, usually right beside it: *magma, which is melted rock beneath Earth's surface*. Once a term is defined, use it the same way every time, and end by summing up the whole process in a sentence.",
          "过程说明文里有很多技术术语：*magma*、*evaporation*、*chromosome*。初学这门学科的读者需要在每个术语**第一次出现时就看到它的定义**，通常紧挨着它：*magma, which is melted rock beneath Earth's surface*。术语一旦定义，之后每次都要以同样的意思使用，最后用一句话概括整个过程。",
        ),
        writingGenerator(
          t(
            "Explain the process in English from the notes, defining each technical term the first time you use it.",
            "根据笔记用英语说明这个过程，在第一次使用每个技术术语时给出定义。",
          ),
          processBank,
          ["g6-defines-terms", "g6-process-in-order", "w4-concludes"],
          { minWords: 100, maxChars: 3200 },
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-a-compare-and-contrast-essay",
    title: t("Writing a Compare-and-Contrast Essay", "写比较对照文"),
    summary: t(
      "Compare two things in an essay of several paragraphs: an opening that names them and the points of comparison, a paragraph of likenesses, a paragraph of differences linked by transitions, and a conclusion.",
      "用几个段落的文章比较两样事物：开头说出两者和比较的方面，一段写相同点，一段用过渡词连接写不同点，最后写结论。",
    ),
    prerequisites: after("writing-a-compare-and-contrast-paragraph", "transitions-between-ideas"),
    encompasses: [{ topic: "writing-a-compare-and-contrast-paragraph", weight: 0.2 }],
    xp: 22,
    strand: "writing",
    criteria: ["g6-compare-basis", "g6-likeness-and-difference", "g6-uses-transitions", "w4-concludes"].map(criterion),
    knowledgePoints: [
      point(
        "the-basis-of-comparison",
        t("The Basis of Comparison", "比较的依据"),
        t(
          "A compare-and-contrast essay opens by naming the **two things** and the **points** on which it will compare them: *Comparing their rivers, their governments and their writing shows both their likenesses and their differences.* Then each body paragraph keeps to those points, and every likeness or difference is about **both** things: not *Egypt had the Nile*, but *Egypt's Nile flooded gently, while Mesopotamia's rivers flooded wildly.*",
          "比较对照文在开头说出要比较的**两样事物**和比较的**方面**：*Comparing their rivers, their governments and their writing shows both their likenesses and their differences.* 然后每个主体段落都围绕这些方面展开，每个相同点或不同点都要涉及**两者**：不是 *Egypt had the Nile*，而是 *Egypt's Nile flooded gently, while Mesopotamia's rivers flooded wildly.*",
        ),
        writingGenerator(
          t(
            "Write a compare-and-contrast essay in English from the notes, naming the two things and the points you will compare in your opening.",
            "根据笔记用英语写一篇比较对照文，在开头说出两样事物和你要比较的方面。",
          ),
          compareBank,
          ["g6-compare-basis", "g6-likeness-and-difference", "w4-concludes"],
          { minWords: 140, maxChars: 4000 },
          onePiece,
        ),
      ),
      point(
        "moving-between-likeness-and-difference",
        t("Moving Between Likeness and Difference", "在相同点和不同点之间转换"),
        t(
          "Transitions tell the reader which way the essay is turning. Words such as *similarly*, *likewise* and *both* signal a likeness; *however*, *in contrast*, *on the other hand*, *whereas* and *while* signal a difference. Put a transition where the essay moves from likenesses to differences, and use them inside the paragraphs too, then end with a conclusion that says what the comparison shows.",
          "过渡词告诉读者文章在往哪个方向转。*similarly*、*likewise*、*both* 等词表示相同点；*however*、*in contrast*、*on the other hand*、*whereas*、*while* 表示不同点。在文章从相同点转向不同点的地方用过渡词，段落内部也要用，最后用结论说明这次比较说明了什么。",
        ),
        writingGenerator(
          t(
            "Write a compare-and-contrast essay in English from the notes, using transitions to move between likenesses and differences.",
            "根据笔记用英语写一篇比较对照文，用过渡词在相同点和不同点之间转换。",
          ),
          compareBank,
          ["g6-uses-transitions", "g6-likeness-and-difference", "w4-concludes"],
          { minWords: 140, maxChars: 4000 },
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-a-memoir-scene",
    title: t("Writing a Memoir Scene", "写回忆录场景"),
    summary: t(
      "Tell one true moment from your own life as a scene, with what you saw, heard and felt, showing rather than telling, and end by looking back on what the moment meant.",
      "把自己生活中一个真实的时刻写成场景，写出你看到、听到和感受到的，用展示而不是告诉的方式，最后回顾这个时刻的意义。",
    ),
    prerequisites: after("writing-a-personal-narrative", "showing-character-through-action"),
    encompasses: [{ topic: "writing-a-personal-narrative", weight: 0.2 }],
    xp: 22,
    strand: "writing",
    criteria: ["g6-scene-in-a-moment", "g35-narrative-shows", "g6-reflects-on-meaning"].map(criterion),
    knowledgePoints: [
      point(
        "one-moment-as-a-scene",
        t("One Moment as a Scene", "把一个时刻写成场景"),
        t(
          "A memoir scene slows down **one moment** instead of summarizing a whole summer. Put the reader there: what you saw (*the water below glittered*), heard (*a boy sighed loudly on the ladder*) and felt (*my heart was pounding in my ears*). Let actions and words show your feelings rather than naming them, and include a line or two of what someone said.",
          "回忆录场景把**一个时刻**放慢来写，而不是概括整个夏天。让读者身临其境：你看到的（*the water below glittered*）、听到的（*a boy sighed loudly on the ladder*）和感受到的（*my heart was pounding in my ears*）。用动作和话语展示你的感受，而不是直接说出来，并写进一两句别人说的话。",
        ),
        writingGenerator(
          t(
            "Write a memoir scene in English, telling one moment with what you saw, heard and felt.",
            "用英语写一个回忆录场景，写出一个时刻里你看到、听到和感受到的。",
          ),
          memoirBank,
          ["g6-scene-in-a-moment", "g35-narrative-shows", "g6-reflects-on-meaning"],
          { minWords: 120, maxChars: 4000 },
          onePiece,
        ),
      ),
      point(
        "looking-back-on-the-moment",
        t("Looking Back on the Moment", "回顾这个时刻"),
        t(
          "What makes a memoir more than a story is the **look back**. After the scene, step out of the moment and speak from today: *Looking back, I see that...*, *Ever since, I have...*, *I realize now that...*. Say what the moment meant or how it changed you, in a sentence or two that grows out of the scene instead of a moral that could end any story.",
          "让回忆录不只是一个故事的，是**回顾**。在场景之后，跳出那个时刻，从今天的角度说话：*Looking back, I see that...*、*Ever since, I have...*、*I realize now that...*。用一两句话说出这个时刻的意义或它如何改变了你，这些话要从场景中自然生发，而不是一句放在任何故事结尾都行的道理。",
        ),
        writingGenerator(
          t(
            "Write a memoir scene in English, and end by looking back on what the moment meant to you.",
            "用英语写一个回忆录场景，最后回顾这个时刻对你的意义。",
          ),
          memoirBank,
          ["g6-reflects-on-meaning", "g6-scene-in-a-moment", "g35-narrative-shows"],
          { minWords: 120, maxChars: 4000 },
          onePiece,
        ),
      ),
    ],
  },
];
