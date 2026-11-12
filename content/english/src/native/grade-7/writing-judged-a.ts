// Grade 7: writing judged by a model, part one: an informative essay organized by category, historical fiction, a
// report with data and a cause-and-effect essay.

import { type TopicDef, t } from "@ga/content";
import { point, type WritingItem, writingGenerator } from "@ga/subject-english";
import { after } from "../grade-5/links.ts";
import { criterion, onePiece } from "../grade-5/writing-judged-a.ts";

/** limits are the length limits of a grade 7 essay. */
const limits = { minWords: 120, maxChars: 3600 };

/** informBank gives notes, sorted by category, for an informative essay. */
const informBank: readonly WritingItem[] = [
  {
    task: "Write an informative essay about Iceland from these notes. Land: island near the Arctic Circle; volcanoes and glaciers; hot springs. History: settled by Vikings in 874; one of the oldest parliaments, the Althing, in 930. Daily life: fishing and tourism are big industries; most homes heated by hot water from the ground; long summer days and long winter nights.",
    model:
      "Iceland is a small island country near the Arctic Circle with a fiery landscape, a long history and an unusual way of life. This essay looks at its land, its history and the daily life of its people.\n\nIceland's land is shaped by fire and ice. Active volcanoes rise beside huge glaciers, and hot springs bubble up across the island.\n\nIceland also has a long history. Vikings settled the island in 874, and in 930 they founded the Althing, one of the oldest parliaments in the world.\n\nToday, daily life depends on the island's resources. Fishing and tourism are its largest industries. Because the ground is so hot, most homes are heated by water piped up from below. People also live with extremes of light: summer days are very long, and winter nights are long too.\n\nFrom its volcanoes to its parliament, Iceland shows how a people can build a lasting home in a harsh but beautiful place.",
  },
  {
    task: "Write an informative essay about honeybees from these notes. Body: six legs, four wings; pollen baskets on back legs; stinger only in females. Work: workers collect nectar and pollen; make honey and wax; guard the hive; dance to show where flowers are. Importance: pollinate about a third of the crops people eat; numbers falling because of disease and pesticides.",
    model:
      "Honeybees are small insects with a big job. To understand them, it helps to look at their bodies, the work they do and why they matter to people.\n\nA honeybee's body is built for its work. It has six legs and four wings, and its back legs carry small pollen baskets for bringing pollen home. Only female bees have stingers.\n\nInside and outside the hive, worker bees are always busy. They collect nectar and pollen from flowers, turn nectar into honey and make wax to build the comb. Some workers guard the entrance. When a bee finds good flowers, it performs a dance that shows the others where to fly.\n\nHoneybees matter far beyond the hive. They pollinate about a third of the crops people eat, from apples to almonds. Sadly, their numbers are falling because of disease and pesticides.\n\nHoneybees may be tiny, but our food supply depends on the work of their busy bodies.",
  },
  {
    task: "Write an informative essay about the Great Wall of China from these notes. Building: built over about 2,000 years; earth, stone and brick; workers included soldiers, farmers and prisoners. Purpose: protect against raids from the north; watchtowers sent smoke and fire signals. Today: over 20,000 km including all its parts; millions of visitors; parts crumbling and being repaired.",
    model:
      "The Great Wall of China is one of the largest structures ever built. This essay explains how it was built, why it was built and what has become of it today.\n\nThe wall was not built all at once. Over about 2,000 years, different rulers added sections made of packed earth, stone and brick. Soldiers, farmers and even prisoners did the heavy work.\n\nThe wall had a clear purpose: to protect China from raids by peoples from the north. Watchtowers stood along its length, and guards sent warnings to one another with signals of smoke by day and fire by night.\n\nToday, the wall and all its parts stretch more than 20,000 kilometers. Millions of people visit it each year. However, some sections are crumbling, so workers are repairing them to keep them standing.\n\nBuilt by many hands over many centuries, the Great Wall remains a symbol of China's long history and its effort to defend itself.",
  },
  {
    task: "Write an informative essay about the Amazon rain forest from these notes. Place: northern South America, mostly in Brazil; Amazon River runs through it; rain almost every day. Life: about one in ten known species; jaguars, sloths, river dolphins; tall trees form a canopy. Threats: cleared for farms, cattle and roads; fires; scientists warn it could turn to grassland.",
    model:
      "The Amazon is the largest rain forest on Earth. This essay describes where it is, the life it holds and the dangers it faces.\n\nThe Amazon covers much of northern South America, and most of it lies in Brazil. The mighty Amazon River winds through the forest, and rain falls almost every day, keeping the air hot and wet.\n\nThis wet forest is full of life. About one in ten of all known species live there, including jaguars, slow-moving sloths and pink river dolphins. Tall trees grow so close together that their tops form a roof called the canopy, where many animals spend their lives.\n\nYet the forest is in danger. People clear it for farms, cattle and roads, and fires burn large areas each year. Scientists warn that if too much is lost, parts of the Amazon could turn into dry grassland.\n\nThe Amazon is a treasure of life, and its future depends on the choices people make now.",
  },
  {
    task: "Write an informative essay about the planet Mars from these notes. Surface: red because of iron dust; tallest volcano in the solar system, Olympus Mons; huge canyon. Climate: thin air of carbon dioxide; average about -60°C; dust storms that cover the planet. Exploration: rovers such as Curiosity and Perseverance; found signs of ancient rivers; plans to send people.",
    model:
      "Mars, the fourth planet from the Sun, has fascinated people for centuries. This essay explores its surface, its climate and how humans are exploring it.\n\nThe surface of Mars is red because its soil and rocks are covered in iron dust, much like rust. It is home to Olympus Mons, the tallest volcano in the solar system, and to a canyon far larger than any on Earth.\n\nThe climate of Mars is harsh. Its thin air is made mostly of carbon dioxide, so people could not breathe it. The average temperature is about minus 60 degrees Celsius, and dust storms sometimes grow until they cover the whole planet.\n\nHumans have explored Mars with robot rovers such as Curiosity and Perseverance. These machines have found signs that rivers once flowed there long ago. Space agencies now plan to send people.\n\nCold and dusty today, Mars may hold clues to its watery past and could one day be visited by human explorers.",
  },
  {
    task: "Write an informative essay about ancient Egypt from these notes. Land: desert on both sides of the Nile; yearly flood left rich soil. Government: ruled by pharaohs, seen as gods; officials collected taxes in grain. Beliefs: many gods, such as Ra; life after death; mummies and pyramids built for pharaohs.",
    model:
      "Ancient Egypt was one of the world's first great civilizations. Its story can be told through its land, its government and its beliefs.\n\nThe land of Egypt was mostly desert, but the Nile River ran through it. Each year the river flooded and left behind rich soil, so farmers could grow crops in a narrow green strip along its banks.\n\nEgypt was ruled by pharaohs, kings whom the people believed were gods. Under them, officials collected taxes, which were often paid in grain from the farms.\n\nThe Egyptians' beliefs shaped much of their lives. They worshipped many gods, such as Ra, the sun god. They also believed in a life after death. For this reason, they preserved bodies as mummies and built huge pyramids as tombs for their pharaohs.\n\nThe gift of the Nile, the power of the pharaohs and a deep faith in life after death together made ancient Egypt a civilization that is still remembered today.",
  },
  {
    task: "Write an informative essay about the octopus from these notes. Body: eight arms with suckers; three hearts; blue blood; no bones, can squeeze through tiny gaps. Defense: changes color and texture; squirts ink; can lose an arm and regrow it. Intelligence: solves puzzles; opens jars; recognizes people.",
    model:
      "The octopus is one of the strangest and smartest animals in the sea. This essay looks at its body, how it defends itself and its surprising intelligence.\n\nAn octopus's body is unlike ours. It has eight arms covered in suckers, three hearts and blood that is blue. Because it has no bones, it can squeeze through a gap not much larger than its eye.\n\nThe octopus has many ways to stay safe. It can change the color and even the texture of its skin to match rocks or coral. If a predator comes close, it squirts a cloud of ink and escapes. It can even lose an arm and grow a new one.\n\nMost surprising of all is the octopus's mind. In tests, octopuses solve puzzles and unscrew jars to reach food inside. Some can even tell different people apart.\n\nWith its flexible body, clever defenses and sharp mind, the octopus shows that intelligence can take many forms.",
  },
  {
    task: "Write an informative essay about Japan from these notes. Land: four main islands and thousands of smaller ones; mountains cover most of the land; earthquakes are common. Economy: makes cars and electronics; little farmland, so imports much food. Culture: cherry blossom festivals; sushi and rice; respect for elders and good manners.",
    model:
      "Japan is an island nation in East Asia known for its mountains, its industry and its traditions. This essay describes its land, its economy and its culture.\n\nJapan is made up of four main islands and thousands of smaller ones. Mountains cover most of the land, so cities crowd onto the narrow plains by the sea. Earthquakes are common because the islands sit where plates of the Earth's crust meet.\n\nJapan's economy is one of the largest in the world. Its factories make cars and electronics that are sold everywhere. However, because there is little flat farmland, Japan imports much of its food.\n\nJapanese culture blends old and new. Every spring, people gather for festivals under the cherry blossoms. Meals often include rice and fish, such as sushi. Good manners and respect for elders are important in daily life.\n\nThough small and mountainous, Japan has become a powerful nation that still treasures its traditions.",
  },
  {
    task: "Write an informative essay about volcanoes from these notes. Formation: form where plates meet or over hot spots; magma rises through cracks. Kinds: shield volcanoes with gentle slopes, like in Hawaii; cone volcanoes with steep sides and explosive eruptions. Effects: lava and ash destroy towns; ash makes soil rich for farming; new land forms.",
    model:
      "Volcanoes are openings in the Earth's crust where melted rock escapes. This essay explains how they form, the kinds of volcanoes there are and the effects they have.\n\nVolcanoes form in places where the Earth is especially hot. Many rise where the plates of the crust meet; others sit over hot spots deep below. In both cases, magma, or melted rock, pushes up through cracks until it bursts out.\n\nNot all volcanoes look alike. Shield volcanoes, like those in Hawaii, have wide, gentle slopes built by runny lava. Cone volcanoes have steep sides, and their eruptions are often explosive.\n\nThe effects of volcanoes are both harmful and helpful. Lava and ash can bury roads and destroy whole towns. Yet the ash breaks down into rich soil, so farmers often grow crops on volcanic land. Eruptions can even build new land, as islands rise from the sea.\n\nVolcanoes destroy, but they also create, shaping the planet we live on.",
  },
  {
    task: "Write an informative essay about the Maya from these notes. Cities: in southern Mexico and Central America; stone pyramids and palaces; ball courts. Knowledge: a calendar of 365 days; writing with glyphs; used the number zero. Farming: maize, beans and squash; terraces on hills; many cities left by about 900 CE, possibly due to drought.",
    model:
      "The Maya built one of the great civilizations of the Americas. This essay examines their cities, their knowledge and their farming.\n\nMaya cities rose in what is now southern Mexico and Central America. In them stood tall stone pyramids, royal palaces and courts where people played a ball game with religious meaning.\n\nThe Maya were also skilled thinkers. They made a calendar of 365 days, wrote with picture-like signs called glyphs and used the number zero, an idea many peoples did not have.\n\nAll of this rested on farming. The Maya grew maize, beans and squash, and they cut flat terraces into hillsides to farm steep land. By about 900 CE, however, people had left many of their cities, perhaps because long droughts made farming fail.\n\nThe cities, ideas and fields of the Maya show a people of great skill whose achievements still amaze us today.",
  },
  {
    task: "Write an informative essay about polar bears from these notes. Body: largest land predator; thick fur and fat; black skin absorbs heat. Hunting: wait at holes in the sea ice for seals; can smell a seal from far away; swim long distances. Threats: sea ice melting earlier each year; harder to hunt; fewer cubs survive.",
    model:
      "The polar bear is the king of the Arctic. This essay looks at its body, how it hunts and the threats it now faces.\n\nThe polar bear is the largest predator that lives on land. Its body is built for cold: thick fur and a layer of fat keep it warm, and its black skin soaks up heat from the sun.\n\nPolar bears hunt mainly seals. A bear waits patiently beside a hole in the sea ice where a seal comes up to breathe. Its sense of smell is so strong that it can detect a seal from far away, and it can swim long distances between pieces of ice.\n\nToday, polar bears face a serious problem. The sea ice is melting earlier each year, so bears have less time and space to hunt. Hungry mothers raise fewer cubs, and fewer of them survive.\n\nThe polar bear is perfectly made for the ice, which is why losing that ice puts its future at risk.",
  },
  {
    task: "Write an informative essay about ancient Rome from these notes. Government: began as a kingdom, then a republic with senators, then an empire ruled by emperors. Building: roads, aqueducts and arches; concrete; the Colosseum. Legacy: Latin became Italian, Spanish and French; laws and ideas of a republic still used.",
    model:
      "Ancient Rome grew from a small city into a vast empire. This essay explores its government, its buildings and what it left behind.\n\nRome's government changed over time. It began as a kingdom, then became a republic in which elected senators made decisions. Later, it became an empire ruled by powerful emperors.\n\nThe Romans were brilliant builders. They laid roads that crossed their lands, built aqueducts that carried water to cities and used arches to make strong bridges. They also invented a kind of concrete, which they used in great buildings such as the Colosseum, where crowds watched games.\n\nRome's legacy lives on. The Latin language grew into Italian, Spanish and French. Many countries still follow Roman ideas about law, and the idea of a republic, with leaders chosen by citizens, shapes governments today.\n\nAlthough the empire fell long ago, Rome's government, buildings and language still shape the modern world.",
  },
];

/** historicalBank gives the facts of a moment in history for a story. */
const historicalBank: readonly WritingItem[] = [
  {
    task: "Write a short historical fiction story set in Pompeii in 79 CE. Facts to keep: Mount Vesuvius erupted in August; ash and stones fell for hours; many people fled toward the sea. Invent a young character and show one tense scene.",
    model:
      'Livia was sweeping the bakery floor when the ground shook. Outside, a black cloud climbed above Vesuvius, spreading like a pine tree.\n\n"Father!" she called. He came out from behind the brick oven, his hands white with flour, and stared at the sky.\n\nBy afternoon, ash was falling like gray snow. Small stones rattled on the clay roof tiles. Livia wrapped a wet cloth over her mouth, as her mother had told her, and tied up their few coins in a leather pouch.\n\n"To the sea," her father said. "The boats are our only chance."\n\nThey joined the crowd pushing down the narrow street, past the fountains and the painted shop signs. A cart had overturned, and its donkey brayed in fear. Livia held her little brother\'s hand so tightly her fingers ached.\n\nAt the shore, the water heaved. A fisherman waved them toward his boat. As it pulled away, Livia looked back at the city vanishing into darkness and promised never to forget it.',
  },
  {
    task: "Write a short historical fiction story set on the Oregon Trail in 1846. Facts to keep: families traveled in covered wagons pulled by oxen; river crossings were dangerous; the journey took about five months. Invent a character and show one tense scene.",
    model:
      'The river was wider than any Eliza had ever seen, brown and fast from the spring rains.\n\n"We\'ll float the wagon across," Pa said, tightening the ropes around the canvas cover. The oxen stamped and snorted at the edge of the water.\n\nEliza climbed onto the wagon seat beside her mother, clutching the tin box that held their flour money. For four months they had crossed prairies and hills, and now this river stood between them and Oregon.\n\nPa cracked the whip. The oxen waded in. Cold water swirled around the wheels, and the wagon lurched. Then it began to tilt.\n\n"Hold on!" Ma cried.\n\nA barrel of salted pork slid off the back and spun away. Eliza leaned hard against the high side, her heart pounding. Slowly, the oxen found their footing on the far bank and dragged the wagon out, dripping.\n\nThat night, by the campfire, Pa counted what they had lost. It was only a barrel. Eliza knew they had been lucky.',
  },
  {
    task: "Write a short historical fiction story set in London during the Great Fire of 1666. Facts to keep: the fire began in a bakery on Pudding Lane in September; wooden houses burned quickly; people pulled down houses to stop the fire. Invent a character and show one tense scene.",
    model:
      'Thomas woke to shouting and the smell of smoke. Through the small window, the sky over Pudding Lane glowed orange.\n\n"Fire at the baker\'s!" a man yelled in the street below.\n\nThomas pulled on his breeches and ran down the creaking stairs. The wooden houses leaned so close together that flames leapt easily from roof to roof. People were throwing their belongings into carts: chairs, pewter plates, bundles of clothes.\n\nNear the church, a group of men were swinging hooks and ropes at the front of a house.\n\n"Help us, boy!" one shouted. "If we pull this one down, the fire will have nothing to eat!"\n\nThomas grabbed a rope. Together they heaved. Beams cracked, and the front of the house crashed into the street in a cloud of dust.\n\nThe heat burned his face, but the flames stopped at the gap. For the first time that night, Thomas felt a small spark of hope that his own street might be saved.',
  },
  {
    task: "Write a short historical fiction story set during the first flight of the Wright brothers at Kitty Hawk in December 1903. Facts to keep: the flight lasted 12 seconds; it was cold and windy; only a few people watched. Invent a character who watches and show the scene.",
    model:
      'The wind off the ocean was so cold that Sam\'s fingers had gone numb inside his wool gloves. He was one of only five people standing on the sand that December morning.\n\nThe strange machine sat on its wooden rail, its cloth wings trembling in the wind. Orville Wright lay flat on the lower wing, gripping the controls. His brother Wilbur stood beside it, steadying the tip.\n\n"Do you think it\'ll fly?" Sam whispered to the man next to him.\n\n"Most likely it\'ll crash," the man muttered.\n\nThe engine coughed, then roared. The propellers spun. The machine slid along the rail, faster and faster. Then, suddenly, there was air beneath it.\n\nSam forgot to breathe. The flyer rose, wobbled and moved forward above the sand for twelve long seconds before it bumped back down.\n\nNobody spoke at first. Then Wilbur grinned. Sam knew he had just seen something the world would never forget.',
  },
  {
    task: "Write a short historical fiction story set on the Titanic on the night of April 14, 1912. Facts to keep: the ship hit an iceberg near midnight; there were not enough lifeboats; women and children were put in the boats first. Invent a character and show one tense scene.",
    model:
      'Clara was asleep in the narrow bunk when a long shudder ran through the ship. Then everything went quiet; the engines had stopped.\n\nShe pulled on her coat and climbed to the deck with her mother. The air was freezing, and the stars were brighter than she had ever seen them. Sailors were uncovering the white lifeboats.\n\n"Women and children first!" an officer called.\n\nClara\'s father kissed her forehead. "Go with your mother. I\'ll follow on the next boat."\n\nBut Clara had heard a sailor whisper that there were not enough boats for everyone. She grabbed her father\'s sleeve.\n\n"Come with us," she begged.\n\n"I will find you," he said gently, and lifted her into the boat.\n\nAs the lifeboat was lowered, it swung and scraped against the ship\'s side. Clara watched her father\'s face grow smaller among the crowd at the rail. In the dark water, the lights of the great ship were slowly tilting toward the sea.',
  },
  {
    task: "Write a short historical fiction story set in a Chinese village along the Silk Road around 750 CE. Facts to keep: camel caravans carried silk west and brought glass and horses east; traders rested at oases; travel was dangerous because of deserts and bandits. Invent a character and show one tense scene.",
    model:
      'Mei had waited all spring for the caravan. When the bells of the camels finally sounded at the edge of the oasis, she ran out past the mud-brick walls to see.\n\nThe traders were dusty and thin. One camel was missing its load.\n\n"Bandits," the leader said, lowering himself onto a mat beside the well. "Two days east of here. They took a whole bale of silk."\n\nMei\'s father, who wove the silk, went pale. That bale had been his whole winter\'s work.\n\nThat night, as the oil lamps flickered, a stranger in a fur hat came to their door. He carried a bundle wrapped in cloth.\n\n"I found this in the sand," he said. "The bandits dropped it as they ran from our horses."\n\nIt was the silk, torn at one corner but whole. Mei\'s father bowed low. In return, he gave the stranger a cup of tea and a place by the fire, and Mei listened to tales of the far west until dawn.',
  },
  {
    task: "Write a short historical fiction story set during the California Gold Rush in 1849. Facts to keep: thousands of people rushed to California after gold was found; miners panned for gold in streams; prices in mining towns were very high. Invent a character and show one tense scene.",
    model:
      'For three weeks, Jacob had swirled his tin pan in the icy stream and found nothing but sand.\n\nThat morning, his money ran out. A sack of flour in town cost more than his father had earned in a month back in Ohio. If he found no gold today, he would have to sell his mule.\n\nHe dipped the pan into the water once more and shook it slowly, letting the gravel wash over the edge. Something glinted.\n\nJacob held his breath. He tilted the pan toward the sun. There, caught in the black sand, lay three yellow flakes and one small nugget, no bigger than a pea.\n\n"Gold," he whispered.\n\nBehind him, boots crunched on the stones. A big man with a beard was watching from the bank.\n\n"Find something, boy?"\n\nJacob closed his hand around the nugget. "Just sand," he said, and slipped it into his boot. That night, he slept with the boot under his head.',
  },
  {
    task: "Write a short historical fiction story set in a medieval castle under siege in 1300. Facts to keep: attackers used catapults to throw stones; defenders shot arrows through narrow windows; food ran short during long sieges. Invent a character and show one tense scene.",
    model:
      'On the fortieth day of the siege, Alys counted the sacks in the storeroom by the light of a rush candle. Only six were left.\n\nOutside the walls, the enemy\'s catapult creaked and thudded. A stone smashed into the tower, and dust drifted down from the beams.\n\nAlys climbed the spiral stairs to the wall walk, where her brother Will stood at a narrow window with his bow.\n\n"How long can we last?" she asked.\n\n"Two weeks," he said. "Maybe less."\n\nThat night, Alys noticed something the guards had missed. In the moat below, a small boat was sliding silently toward the water gate. Inside it were sacks.\n\nShe ran for the captain. The gate was opened just wide enough, and a fisherman from the village handed up bread, dried fish and a message: the king\'s army was three days away.\n\nAlys carried the first loaf to the great hall herself, and for the first time in weeks, the castle cheered.',
  },
  {
    task: "Write a short historical fiction story set in Boston on December 16, 1773, the night of the Boston Tea Party. Facts to keep: colonists angry about a tax on tea; men disguised themselves and dumped 342 chests of tea into the harbor; no one was hurt. Invent a character and show one tense scene.",
    model:
      'Hannah peered around the corner of the print shop, her breath steaming in the cold. Down at Griffin\'s Wharf, three ships rocked in the dark water.\n\nShe was supposed to be home by now, but her brother Daniel had slipped out with charcoal on his face and a blanket around his shoulders, and she had followed him.\n\nMen with blackened faces swarmed onto the ships. She heard the splintering of wood as axes split open the chests. Then, one after another, the chests went over the side, and the harbor filled with floating tea.\n\nA soldier\'s lantern swung into the street behind her. Hannah pressed herself into the doorway, her heart racing. If he found her, he might ask whose sister she was.\n\nThe lantern stopped. Then it moved on.\n\nLater, Daniel crept home, smelling of salt and tea leaves. "Three hundred and forty-two chests," he whispered, "and not one person hurt." Hannah never told anyone she had watched.',
  },
  {
    task: "Write a short historical fiction story set in Egypt around 2560 BCE, during the building of the Great Pyramid. Facts to keep: thousands of workers moved huge stone blocks; blocks were dragged on sledges; workers lived in villages near the pyramid and were given bread and beer. Invent a character and show one tense scene.",
    model:
      'Nebi wiped the sweat from his eyes and pulled again. The rope burned his palms. In front of him, the great limestone block sat on its wooden sledge like a sleeping giant.\n\n"Water!" the overseer shouted. A boy poured water onto the sand in front of the sledge, and twenty men heaved together. The block slid forward a little.\n\nThe ramp grew steeper as it rose. Halfway up, one of the ropes snapped with a crack like a whip.\n\nThe sledge jerked sideways. Men leapt out of the way. Nebi threw his weight onto the remaining rope, and others grabbed it beside him. For a long moment, the block hung at the edge of the ramp.\n\nThen, slowly, it settled back.\n\nThat evening, in the workers\' village, Nebi sat with his crew and ate his ration of bread and drank his beer. His hands were raw, but the stone was in its place, and the pyramid had grown one block taller.',
  },
  {
    task: "Write a short historical fiction story set in Paris in July 1789, at the storming of the Bastille. Facts to keep: crowds were angry about hunger and high bread prices; they attacked the Bastille prison to seize gunpowder; the Bastille fell on July 14. Invent a character and show one tense scene.",
    model:
      'For a week, Marie\'s family had eaten nothing but thin soup. Bread cost more than her father earned in a day.\n\nOn the morning of July 14, the streets of Paris filled with people carrying pikes, old muskets and kitchen knives. Marie squeezed through the crowd to find her father.\n\n"To the Bastille!" someone shouted. "They have gunpowder there!"\n\nThe old prison rose ahead, its stone towers dark against the summer sky. Smoke drifted from the walls as the guards fired. The crowd surged forward and fell back, again and again.\n\nThen a cheer rose. Men had cut the chains of the drawbridge. It crashed down, and the crowd poured across.\n\nMarie found her father at last, his face black with smoke but smiling.\n\n"It has fallen," he said, hugging her. "Paris has taken the Bastille."\n\nThat night, Marie wondered whether this meant there would finally be bread.',
  },
  {
    task: "Write a short historical fiction story set during the Underground Railroad in the 1850s. Facts to keep: enslaved people escaped north with help from people who hid them in safe houses; they often traveled at night; the North Star helped them find their way. Invent a character and show one tense scene.",
    model:
      'Ruth lay still in the hidden room beneath the barn floor, listening. Above her, boots thumped across the boards.\n\n"Nobody here but my cows," said Mr. Hale, the farmer who had taken her in.\n\nThe slave catcher\'s voice was rough. "I\'ll be back tomorrow, and I\'ll bring dogs."\n\nRuth did not breathe until the hoofbeats faded. Then the trapdoor creaked open, and Mrs. Hale handed down a bundle of bread and cheese.\n\n"You must go tonight," she whispered. "Follow the creek to the big oak, then keep the North Star ahead of you. A lantern in the window of a white house will mean you are safe."\n\nThat night, Ruth crept out under a sky full of stars. She found the bright one at the end of the Little Dipper\'s handle, just as her mother had taught her long ago.\n\nWhen she saw the lantern glowing in a distant window just before dawn, she cried for the first time in many weeks.',
  },
];

/** dataBank gives data for a short report. */
const dataBank: readonly WritingItem[] = [
  {
    task: "Write a short report on wolves in Yellowstone from these data. Wolves: 1995, 14 brought back; 2000, 119; 2005, 118; 2015, 98. Elk: 1995, 17,000; 2005, 9,500; 2015, 5,000. Note: other things also changed, such as hunting and harsh winters.",
    model:
      "In 1995, scientists brought 14 wolves back to Yellowstone National Park. This report looks at how the number of wolves and elk has changed since then.\n\nThe wolves grew quickly at first. Their number rose from 14 in 1995 to 119 in 2000. After that, it leveled off and then fell slightly, to 98 in 2015.\n\nAt the same time, the number of elk dropped sharply. In 1995, there were about 17,000 elk. By 2015, there were only 5,000, less than a third as many as twenty years before.\n\nThe data show that elk fell as wolves rose, since wolves hunt elk. However, these numbers do not prove that wolves were the only cause. Hunting and harsh winters also changed during these years and may have reduced the elk as well.\n\nIn short, the return of the wolves came with a large drop in elk, but scientists need more evidence to know how much of that drop the wolves caused.",
  },
  {
    task: "Write a short report on screen time from these survey data of 200 students. Average hours of screen time a day: ages 10–11, 3 hours; ages 12–13, 5 hours; ages 14–15, 6 hours. Average hours of sleep: ages 10–11, 9.5; ages 12–13, 8.5; ages 14–15, 7.5.",
    model:
      "A survey of 200 students asked how many hours they spend on screens and how many hours they sleep. This report describes what the answers show.\n\nScreen time rose with age. Students aged 10 and 11 used screens for 3 hours a day. Students aged 12 and 13 used them for 5 hours, and students aged 14 and 15 used them for 6 hours, twice as long as the youngest group.\n\nSleep went the other way. The youngest students slept 9.5 hours a night, but the oldest slept only 7.5 hours, two hours less.\n\nSo, in this survey, older students had more screen time and less sleep. However, the survey does not show that screens caused the loss of sleep. Older students may also have more homework, earlier school start times or different body clocks.\n\nThe data show a clear pattern between age, screens and sleep, but a careful study would be needed to learn whether one causes the other.",
  },
  {
    task: "Write a short report on a town's recycling from these data. Tons recycled: 2019, 400; 2020, 450; 2021, 900; 2022, 950. Tons of trash sent to the dump: 2019, 3,000; 2020, 2,950; 2021, 2,500; 2022, 2,450. Note: new blue bins were given to every home in early 2021.",
    model:
      "This report examines how much the town recycled and how much trash it sent to the dump from 2019 to 2022.\n\nRecycling grew slowly at first, from 400 tons in 2019 to 450 tons in 2020. Then it jumped to 900 tons in 2021, twice as much as the year before, and rose a little more to 950 tons in 2022.\n\nMeanwhile, trash sent to the dump fell. It went from 3,000 tons in 2019 to 2,450 tons in 2022, a drop of 550 tons.\n\nThe biggest change came in 2021, the same year every home received a new blue bin. This timing suggests the bins may have helped people recycle more. Still, the data alone cannot prove it; other changes, such as new rules or school campaigns, might also have played a part.\n\nOverall, the town now recycles more than twice as much as it did in 2019 and sends less trash to the dump, and the new bins are one likely reason.",
  },
  {
    task: "Write a short report on a lake's water level from these data. Water level (meters above a marker): 2010, 12; 2013, 10; 2016, 7; 2019, 5; 2022, 6. Rainfall (cm per year): 2010, 80; 2013, 60; 2016, 45; 2019, 40; 2022, 55.",
    model:
      "This report looks at changes in the water level of the lake and in yearly rainfall from 2010 to 2022.\n\nFrom 2010 to 2019, the lake fell steadily. Its level dropped from 12 meters above the marker to just 5 meters, less than half of what it had been. In 2022, it rose again slightly, to 6 meters.\n\nRainfall followed a similar pattern. It fell from 80 centimeters a year in 2010 to 40 centimeters in 2019, which is half as much. Then it rose to 55 centimeters in 2022.\n\nThe lake was lowest when rain was lowest, and both rose a little in 2022. This pattern suggests that less rain helped lower the lake. However, the data do not include other possible causes, such as people taking more water for farms or hotter summers that dry the lake faster.\n\nThe lake and the rain moved together over these twelve years, but more information is needed to explain the lake's fall completely.",
  },
  {
    task: "Write a short report on a school's lunch survey from these data. Students choosing each lunch in September: pizza 120, salad bar 30, soup 50. In March, after the salad bar added new choices: pizza 90, salad bar 75, soup 35.",
    model:
      "This report compares what students chose for lunch in September and in March, after the salad bar added new choices.\n\nIn September, pizza was by far the most popular lunch. A total of 120 students chose it, four times as many as the 30 who chose the salad bar. Soup was in the middle, with 50 students.\n\nBy March, the picture had changed. The salad bar rose from 30 students to 75, which is two and a half times as many. Pizza fell from 120 to 90, and soup fell from 50 to 35.\n\nThe salad bar grew after it added new choices, so the new choices may have attracted students. However, other things might explain part of the change. For example, students may eat differently in spring, or the pizza may have changed.\n\nIn March, pizza was still the top choice, but the salad bar had more than doubled its share of students, a sign that variety can change what people eat.",
  },
  {
    task: "Write a short report on bicycle use in a city from these data. Daily bike trips: 2015, 2,000; 2017, 2,200; 2019, 5,000; 2021, 6,000. Kilometers of bike lanes: 2015, 10; 2017, 12; 2019, 40; 2021, 50.",
    model:
      "This report describes how daily bike trips and bike lanes in the city changed between 2015 and 2021.\n\nIn 2015, people made about 2,000 bike trips a day. That number grew only slightly by 2017, to 2,200. Then it more than doubled, reaching 5,000 trips in 2019 and 6,000 in 2021, three times the number in 2015.\n\nBike lanes grew in a similar way. The city had 10 kilometers of lanes in 2015 and 12 in 2017. By 2019, it had 40 kilometers, and by 2021, it had 50, five times as many as at the start.\n\nThe largest jump in bike trips came at the same time as the largest jump in bike lanes. This suggests that new lanes encouraged more people to ride. Even so, the data cannot rule out other reasons, such as rising fuel prices or more people moving to the city.\n\nIn short, as the city built more lanes, many more people chose to ride, although the lanes may not be the only reason.",
  },
  {
    task: "Write a short report on a garden experiment from these data. Average tomato harvest per plant (kg): no compost, 2; some compost, 3.5; lots of compost, 4. Number of plants in each group: 5.",
    model:
      "This report describes an experiment that tested whether compost affects the size of a tomato harvest. Three groups of five plants each were given no compost, some compost or lots of compost.\n\nThe plants with no compost produced an average of 2 kilograms of tomatoes each. Plants with some compost produced 3.5 kilograms, which is 1.5 kilograms more. Plants with lots of compost produced 4 kilograms, twice as much as the plants with none.\n\nThe data show that more compost went with a bigger harvest. However, the gain grew smaller as more compost was added: the jump from some compost to lots of compost was only half a kilogram.\n\nBecause each group had only five plants, the results could be affected by chance, such as one plant getting more sun. The experiment should be repeated with more plants before drawing a firm conclusion.\n\nIn this test, compost helped the tomatoes, but adding a lot more did not help much more than adding some.",
  },
  {
    task: "Write a short report on library visits from these data. Monthly visits: January, 3,000; April, 2,500; July, 4,500; October, 2,800. Note: the library runs a summer reading program in July.",
    model:
      "This report looks at how many people visited the library in four months of the year.\n\nVisits were fairly steady for most of the year. The library had 3,000 visits in January, fell to 2,500 in April and had 2,800 in October.\n\nJuly was very different. That month, visits rose to 4,500, which is 2,000 more than in April and almost twice as many.\n\nJuly is also the month of the library's summer reading program, so the program may explain much of the rise. However, the data do not prove this. In July, schools are closed, so children have more free time, and families may visit for other reasons, such as escaping the heat.\n\nTo find out how much the program itself matters, the library could count how many July visitors take part in it.\n\nOverall, July is the busiest month by far, and the reading program is a likely, but not certain, reason.",
  },
  {
    task: "Write a short report on a store's sales of umbrellas from these data. Umbrellas sold: March, 80; April, 150; May, 60; June, 20. Rainy days: March, 8; April, 15; May, 6; June, 2.",
    model:
      "This report compares the number of umbrellas a store sold with the number of rainy days in four spring and summer months.\n\nUmbrella sales were highest in April, when the store sold 150. In March, it sold 80, and in May, 60. June had the fewest sales, only 20, which is less than a seventh of April's.\n\nRainy days followed the same pattern. April had 15 rainy days, the most of the four months. March had 8, May had 6 and June had just 2.\n\nThe store sold the most umbrellas in the wettest month and the fewest in the driest. It makes sense that people buy umbrellas when it rains, so the data suggest a strong link. Still, other things could matter, such as a sale on umbrellas in April or fewer shoppers in June.\n\nIn these four months, umbrella sales rose and fell with the rain, which could help the store plan how many umbrellas to order.",
  },
  {
    task: "Write a short report on a river's fish population from these data. Fish counted in a section of river: 2000, 1,200; 2005, 600; 2010, 300; 2015, 700; 2020, 1,100. Note: a factory upstream closed in 2010.",
    model:
      "This report examines fish counts in one section of the river between 2000 and 2020.\n\nFrom 2000 to 2010, the fish population fell sharply. It dropped from 1,200 to 600 in 2005, half as many, and then to 300 in 2010, only a quarter of the number in 2000.\n\nAfter 2010, the population recovered. It rose to 700 in 2015 and to 1,100 in 2020, almost back to where it started.\n\nA factory upstream closed in 2010, the same year the fish began to return. This timing suggests that the factory may have been harming the river, perhaps with waste. However, the data alone do not prove this. Fishing rules, water temperature or other changes could also have helped the fish recover.\n\nThe fish fell for ten years and then returned after the factory closed, a pattern that scientists could test by checking the water for pollution.",
  },
  {
    task: "Write a short report on a class's reading from these data. Average pages read per week: Term 1, 40; Term 2, 45; Term 3, 90. Note: in Term 3, students could choose their own books.",
    model:
      "This report looks at how many pages students in the class read each week during three terms.\n\nIn Term 1, students read an average of 40 pages a week. In Term 2, this rose only slightly, to 45 pages.\n\nTerm 3 was very different. Students read 90 pages a week, twice as many as in Term 2 and more than twice as many as in Term 1.\n\nTerm 3 was also when students were allowed to choose their own books. The large jump suggests that choosing books may have made students want to read more. However, the data cannot prove this alone. Term 3 might have had more free time, longer days or a reading contest that also encouraged students.\n\nTo be more certain, the class could compare its results with another class that did not get to choose its books.\n\nIn short, reading doubled in the term when students chose their own books, which is a promising sign that choice matters.",
  },
  {
    task: "Write a short report on electricity use in a home from these data. Kilowatt-hours used: January, 900; April, 500; July, 1,000; October, 550. Note: the home has electric heating and air conditioning.",
    model:
      "This report describes how much electricity one home used in four months of the year.\n\nUse was highest in July, at 1,000 kilowatt-hours, and almost as high in January, at 900. In the spring and fall, use was much lower: 500 kilowatt-hours in April and 550 in October.\n\nThis means the home used about twice as much electricity in July as in April.\n\nThe home has both electric heating and air conditioning. The high months are the coldest and hottest times of the year, when the heating or the air conditioning would run the most. This suggests that heating and cooling explain most of the difference. However, the data do not show this directly; the family might also have been home more in those months.\n\nTo learn more, the family could measure how much electricity the heater and the air conditioner use on their own.\n\nOverall, the home used the most electricity in winter and summer, probably because of heating and cooling.",
  },
];

/** causeBank gives the notes of a chain of causes and effects. */
const causeBank: readonly WritingItem[] = [
  {
    task: "Write a cause-and-effect essay from these notes. The invention of the printing press, about 1450: books could be made quickly and cheaply; more people could buy books; more people learned to read; ideas spread faster across Europe; new ideas in science and religion challenged old beliefs.",
    model:
      "Around 1450, Johannes Gutenberg built a printing press. His invention started a chain of effects that changed Europe.\n\nThe first effect was on books themselves. Before the press, every book was copied by hand, which took months. With movable type, a printer could make hundreds of copies in the same time, so books became much cheaper.\n\nBecause books were cheaper, many more people could afford them. This, in turn, gave people a reason to learn to read, and the number of readers grew.\n\nAs more people read, ideas spread faster than ever before. A new idea printed in one city could reach many other cities within weeks.\n\nFinally, this rapid spread of ideas allowed new thinking in science and religion to challenge old beliefs. Scholars could share discoveries, and readers could question what they had been told.\n\nIn this way, one machine led to cheaper books, more readers and faster ideas, and together these helped bring a new age to Europe.",
  },
  {
    task: "Write a cause-and-effect essay from these notes. Cutting down a forest on a hillside: tree roots no longer hold the soil; rain washes soil down the hill; the river below fills with mud; fish lose clean water to lay eggs; fishing villages catch fewer fish.",
    model:
      "Cutting down a forest on a hillside may seem to affect only the trees, but it sets off a chain of effects that reaches far beyond the hill.\n\nThe first change happens underground. Tree roots hold soil in place like a net. When the trees are cut, the roots die, and the soil is left loose.\n\nAs a result, when heavy rain falls, it washes the loose soil down the slope. Without trees to slow the water, the hillside wears away quickly.\n\nThis soil does not disappear. It flows into the river below, which becomes thick with mud.\n\nThe muddy water then harms the fish. Many fish need clean gravel to lay their eggs, and mud covers it, so fewer young fish survive.\n\nFinally, people feel the effect. Fishing villages along the river catch fewer fish, and families lose food and income.\n\nOne decision on a hillside can, link by link, reach the dinner tables of villages miles away.",
  },
  {
    task: "Write a cause-and-effect essay from these notes. A long drought in a farming region: crops fail; food prices rise; families spend more on food and less on other things; local shops sell less; some shops close and workers lose jobs.",
    model:
      "A drought is a long period with little rain. In a farming region, a drought can set off a chain of effects that touches almost everyone.\n\nThe chain begins in the fields. Without enough water, crops wither and fail, and farmers harvest far less than usual.\n\nBecause there is less food to sell, food prices rise. A loaf of bread or a bag of rice suddenly costs more.\n\nFamilies must then spend more of their money on food. As a result, they have less left over for other things, such as clothes, tools or a meal out.\n\nThis drop in spending hurts local shops. With fewer customers, the shops sell less and earn less money.\n\nFinally, some shops cannot survive. They close their doors, and the people who worked there lose their jobs, which means those families have even less to spend.\n\nIn this way, a lack of rain does not stay in the fields; it moves through the whole town, from farm to family to shop.",
  },
  {
    task: "Write a cause-and-effect essay from these notes. The building of the railroad across the United States, finished 1869: travel across the country took days instead of months; goods could be shipped cheaply; towns grew along the tracks; more settlers moved west; Native American lands and buffalo herds were lost.",
    model:
      "In 1869, workers finished the first railroad across the United States. This achievement led to a series of effects that reshaped the country.\n\nThe most direct effect was on travel. Before the railroad, crossing the country by wagon took months. By train, it took only about a week.\n\nBecause trains could carry heavy loads quickly, shipping goods became much cheaper. Farmers could send grain east, and factories could send tools west.\n\nThis trade helped towns spring up along the tracks. Stations became places to buy, sell and store goods, and they grew into busy towns.\n\nThese new towns, along with cheap travel, drew more settlers west. Families who once feared the long journey could now make it easily.\n\nHowever, this flood of settlers had a terrible cost. As settlers moved onto the land and hunters killed the buffalo herds, Native American nations lost their homes and their main source of food.\n\nThe railroad brought speed and growth to the nation, but its chain of effects also brought great loss to the peoples already living in the West.",
  },
  {
    task: "Write a cause-and-effect essay from these notes. Removing sea otters from a coast by hunting: sea urchins, which otters eat, multiply; urchins eat the kelp forests; kelp disappears; fish that live in the kelp lose their homes; the coast has fewer kinds of life.",
    model:
      "Sea otters may look like playful animals, but along some coasts they hold an entire ecosystem together. When hunters removed them, a chain of effects followed.\n\nThe first effect was on the sea urchins. Sea otters eat urchins, so when the otters were gone, nothing kept the urchins in check, and their numbers grew quickly.\n\nThe urchins then turned to their favorite food: kelp, the tall seaweed that forms underwater forests. Huge numbers of urchins chewed through the kelp at its base.\n\nAs a result, the kelp forests disappeared. Where tall forests once swayed, there were now bare rocks covered in urchins.\n\nThis loss harmed many other creatures. Fish, crabs and snails that had lived and hidden in the kelp lost their homes and food.\n\nIn the end, the coast had far fewer kinds of life than before.\n\nThe story of the sea otter shows how losing one animal can, step by step, empty a whole underwater forest.",
  },
  {
    task: "Write a cause-and-effect essay from these notes. A new highway built around a small town: drivers no longer pass through the town center; fewer people stop at the diner and gas station; these businesses earn less; some close; the town center becomes quiet and empty.",
    model:
      "When a new highway was built around a small town, it was meant to make travel faster. It did, but it also started a chain of effects in the town itself.\n\nFirst, the flow of traffic changed. Drivers who once had to drive through the town center now sped past it on the highway.\n\nBecause fewer cars came through, fewer people stopped. The diner that had been busy with travelers at lunchtime now had empty tables, and the gas station saw far fewer customers.\n\nThese businesses soon began to earn less money. They had to cut their hours and let some workers go.\n\nEventually, some of them could not stay open. The diner closed, and the gas station shut its pumps.\n\nAs one business after another closed, the town center became quiet and empty, with fewer reasons for anyone to visit.\n\nThe highway saved drivers a few minutes, but by sending them around the town, it slowly drained the life from its center.",
  },
  {
    task: "Write a cause-and-effect essay from these notes. The arrival of smartphones: people could get news anywhere, anytime; fewer people bought printed newspapers; newspapers earned less from sales and ads; many newspapers cut reporters or closed; some towns had no local news reporting.",
    model:
      "Smartphones changed the way people get information, and one of the biggest effects was on newspapers.\n\nThe chain began with convenience. With a smartphone, people could read the news anywhere and at any time, often for free.\n\nAs a result, fewer people bought printed newspapers. Why pay for yesterday's paper when today's news was already in your pocket?\n\nThis drop in readers led to a drop in money. Newspapers earned less from selling copies, and businesses paid less to place ads in them, since fewer people would see the ads.\n\nWith less money coming in, many newspapers had to cut costs. They let reporters go, and some newspapers closed altogether.\n\nThe final effect was felt in many towns. Without a local paper, no one was reporting on the town council, the schools or local events, so people knew less about their own community.\n\nThe smartphone gave people more news than ever before, yet its chain of effects left some towns with no news of their own.",
  },
  {
    task: "Write a cause-and-effect essay from these notes. The Black Death in Europe, 1347–1351: about a third of people died; there were fewer workers; workers could ask for higher wages; peasants gained more freedom; the old system of lords and peasants weakened.",
    model:
      "The Black Death was a terrible disease that swept across Europe between 1347 and 1351. Beyond its huge death toll, it set off a chain of effects that changed society.\n\nThe first effect was the loss of life. About a third of Europe's people died, and whole villages were left nearly empty.\n\nWith so many dead, there were far fewer workers. Fields went unplowed, and lords could not find enough people to farm their land.\n\nBecause workers were now scarce, those who survived could ask for higher wages. If one lord refused to pay, a peasant could often find another who would.\n\nThis new bargaining power gave peasants more freedom. Many left the lands they had been tied to and moved where pay was better.\n\nOver time, these changes weakened the old system in which peasants worked for lords in return for protection.\n\nIn this way, a disease that brought death and fear also helped loosen the ties that had held peasants in place for centuries.",
  },
  {
    task: "Write a cause-and-effect essay from these notes. A city plants many trees along its streets: streets become shadier; pavement and buildings stay cooler in summer; people use less air conditioning; electricity bills fall; the city produces less pollution from power plants.",
    model:
      "When a city plants many trees along its streets, the benefits go far beyond beauty. The trees start a chain of effects that reaches all the way to the air.\n\nThe first effect is shade. As the trees grow, their leaves block the summer sun from the sidewalks and roads.\n\nBecause of this shade, the pavement and buildings stay cooler. Dark streets that once soaked up heat all day now stay several degrees cooler.\n\nIn cooler homes and offices, people do not need to run their air conditioning as much. They can open windows or turn the air conditioning down.\n\nAs a result, people use less electricity, and their electricity bills fall.\n\nFinally, when the whole city uses less electricity, power plants burn less fuel. This means they release less pollution into the air.\n\nPlanting a tree seems like a small act, but across a whole city, it can lead, step by step, to lower bills and cleaner air.",
  },
  {
    task: "Write a cause-and-effect essay from these notes. A school moves its start time an hour later: students get more sleep; they are more alert in class; grades improve; fewer students are late or absent; after-school activities end later, which some families find harder.",
    model:
      "When a school moved its start time one hour later, it started a chain of effects, most of them good, but not all.\n\nThe first effect was on sleep. Teenagers' bodies tend to fall asleep late, so starting an hour later let students sleep longer in the morning.\n\nWith more sleep, students were more alert in class. They could pay attention and remember more of what they heard.\n\nBecause they were learning better, their grades improved over the year.\n\nThe later start also meant fewer students were late or absent. Getting out of bed was simply easier at the new time.\n\nHowever, the change had a cost too. Since school ended later, sports and clubs also ended later, and some families found it harder to fit in work, dinner and homework.\n\nMoving the bell one hour set off a chain of better sleep, sharper minds and higher grades, though families had to adjust their evenings to make it work.",
  },
  {
    task: "Write a cause-and-effect essay from these notes. The Dust Bowl in the 1930s: farmers plowed up the prairie grass; a long drought began; dry soil blew away in huge dust storms; crops and farms were ruined; thousands of families moved west to California.",
    model:
      "In the 1930s, the southern Great Plains of the United States became known as the Dust Bowl. A chain of causes and effects turned rich farmland into a land of dust.\n\nThe chain began with farming. Farmers plowed up the deep-rooted prairie grass to plant wheat. That grass had held the soil in place for thousands of years.\n\nThen a long drought began. Without rain, the wheat died, and the plowed land was left bare and dry.\n\nBecause nothing held it down, the dry soil was picked up by the strong winds of the plains. Huge dust storms rolled across the land, sometimes turning day into night.\n\nThese storms ruined crops and buried fences, machines and even houses. Many farms became worthless, and families could no longer earn a living.\n\nAs a result, thousands of families packed what they could and moved west to California, hoping to find work.\n\nThe Dust Bowl shows how removing the grass, combined with drought, could drive a whole region from its land.",
  },
  {
    task: "Write a cause-and-effect essay from these notes. Rabbits brought to Australia in 1859: they had no natural predators; they bred very quickly; they ate grass and crops; farmers lost crops and sheep had less food; soil wore away where plants were eaten.",
    model:
      "In 1859, a farmer released a few dozen rabbits in Australia for hunting. That small act began a chain of effects that became one of the country's worst environmental problems.\n\nThe chain began with a lack of enemies. In Australia, the rabbits had no natural predators like the foxes and hawks of Europe, so almost nothing killed them.\n\nBecause they were safe, and because rabbits breed very quickly, their numbers exploded. Within decades, there were millions of them.\n\nThese millions of rabbits ate huge amounts of grass and crops. Fields that farmers had planted were stripped bare.\n\nAs a result, farmers lost their harvests, and sheep had far less grass to eat.\n\nThe damage did not stop at the farms. Where the rabbits ate every plant, nothing held the soil, so it wore away in wind and rain.\n\nA few rabbits, released without thought, led step by step to empty fields, hungry sheep and damaged land across a continent.",
  },
];

/** writingJudgedTopics7a are the first writing topics of grade 7 judged by a model. */
export const writingJudgedTopics7a: readonly TopicDef[] = [
  {
    id: "writing-an-informative-essay",
    title: t("Writing an Informative Essay", "写说明性文章"),
    summary: t(
      "Write an informative essay from notes sorted by category: an introduction that previews the categories, a paragraph for each one and a conclusion that ties them together.",
      "根据按类别整理的笔记写一篇说明性文章：引言预告各个类别，每个类别一段，结论把它们联系在一起。",
    ),
    prerequisites: after("organizing-by-category", "writing-an-informative-paragraph"),
    encompasses: [{ topic: "organizing-by-category", weight: 0.2 }],
    xp: 22,
    strand: "writing",
    criteria: ["g7-inform-preview", "g7-inform-categories", "g6-facts-from-notes", "w4-concludes"].map(criterion),
    knowledgePoints: [
      point(
        "previewing-the-categories",
        t("Previewing the Categories", "预告各个类别"),
        t(
          "An informative essay begins by naming its topic and **previewing its categories**, so the reader knows the plan: *This essay looks at its land, its history and the daily life of its people.* Then each body paragraph takes one category in that same order and opens with a sentence that names it.",
          "说明性文章开头要说出主题并**预告各个类别**，让读者了解文章的安排：*This essay looks at its land, its history and the daily life of its people.* 然后每个主体段落按同样的顺序写一个类别，并以点明这个类别的句子开头。",
        ),
        writingGenerator(
          t(
            "Write an informative essay in English from the notes, with an introduction that previews the categories and a paragraph for each.",
            "根据笔记用英语写一篇说明性文章，引言要预告各个类别，每个类别写一段。",
          ),
          informBank,
          ["g7-inform-preview", "g7-inform-categories", "g6-facts-from-notes"],
          limits,
          onePiece,
        ),
      ),
      point(
        "keeping-each-paragraph-focused",
        t("Keeping Each Paragraph Focused", "让每一段集中于一点"),
        t(
          "Each body paragraph holds only the facts of its own category: a fact about history does not belong in the paragraph about the land. Use the facts from the notes accurately, in your own words. End with a conclusion that ties the categories together into one idea about the topic.",
          "每个主体段落只写属于自己类别的事实：关于历史的事实不应出现在写地理的段落里。准确地使用笔记中的事实，并用自己的话表达。结尾用结论把各个类别联系起来，形成对主题的一个整体看法。",
        ),
        writingGenerator(
          t(
            "Write an informative essay in English from the notes, keeping each paragraph to one category and ending with a conclusion.",
            "根据笔记用英语写一篇说明性文章，每段只写一个类别，并以结论结束。",
          ),
          informBank,
          ["g7-inform-categories", "g6-facts-from-notes", "w4-concludes"],
          limits,
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-historical-fiction",
    title: t("Writing Historical Fiction", "写历史小说"),
    summary: t(
      "Write a short story set at a real moment in history: an invented character facing a problem in a scene, with details true to the period and the real events kept accurate.",
      "写一个以真实历史时刻为背景的短篇故事：一个虚构人物在一个场景中面对问题，细节符合那个时代，真实事件保持准确。",
    ),
    prerequisites: after("using-period-details", "pacing-a-story"),
    encompasses: [{ topic: "using-period-details", weight: 0.2 }],
    xp: 22,
    strand: "writing",
    criteria: ["g7-hist-period", "g7-hist-facts", "g7-hist-scene"].map(criterion),
    knowledgePoints: [
      point(
        "a-character-in-a-real-moment",
        t("A Character in a Real Moment", "真实时刻中的人物"),
        t(
          "Historical fiction places an **invented character** inside a **real event**. Keep the real facts exactly as they happened, such as the date, the place and what happened, and invent only the character, their family and what they say and feel. Show one tense **scene** with action and dialogue, and let the character face a problem that comes to a turning point.",
          "历史小说把一个**虚构人物**放进一个**真实事件**中。真实的事实，如日期、地点和发生的事，要完全按历史来写；只虚构人物、他的家人以及他说的话和感受。写出一个紧张的**场景**，有动作和对话，让人物面对一个问题并走到一个转折点。",
        ),
        writingGenerator(
          t(
            "Write a short historical fiction story in English, keeping the facts given and showing a character facing a problem in one scene.",
            "用英语写一篇历史小说短篇，保留所给的事实，并在一个场景中展现一个面对问题的人物。",
          ),
          historicalBank,
          ["g7-hist-facts", "g7-hist-scene", "g7-hist-period"],
          limits,
          onePiece,
        ),
      ),
      point(
        "bringing-the-period-to-life",
        t("Bringing the Period to Life", "让时代鲜活起来"),
        t(
          "Fill the scene with **details of the period**: the clothes, tools, food, buildings, light and transport people really had. A girl in Pompeii sweeps beside a brick oven and wraps her coins in a leather pouch; she does not check a clock. Check every object against the time and leave out anything from later.",
          "在场景中写入**时代细节**：人们真正拥有的衣服、工具、食物、建筑、照明和交通工具。庞贝城的女孩在砖砌的烤炉旁扫地，把钱币包在皮袋里；她不会去看钟。要对照那个时代检查每一件物品，删去任何后来才有的东西。",
        ),
        writingGenerator(
          t(
            "Write a short historical fiction story in English, using at least three details that fit the period.",
            "用英语写一篇历史小说短篇，至少使用三个符合那个时代的细节。",
          ),
          historicalBank,
          ["g7-hist-period", "g7-hist-scene", "g7-hist-facts"],
          limits,
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-a-report-with-data",
    title: t("Writing a Report with Data", "写数据报告"),
    summary: t(
      "Write a short report from data: the trends with exact numbers, comparisons between amounts and a conclusion that claims no more than the data show.",
      "根据数据写一篇简短的报告：用精确数字说明趋势，比较不同的数量，结论不超出数据所能证明的范围。",
    ),
    prerequisites: after("reporting-numbers-from-a-graph", "correlation-or-cause"),
    encompasses: [{ topic: "reporting-numbers-from-a-graph", weight: 0.2 }],
    xp: 22,
    strand: "writing",
    criteria: ["g7-data-accurate", "g7-data-compares", "g7-data-limits"].map(criterion),
    knowledgePoints: [
      point(
        "reporting-the-numbers",
        t("Reporting the Numbers", "报告数字"),
        t(
          "A data report tells the reader what the numbers say. Name each **trend** and back it with the **exact values**: *The number of wolves rose from 14 in 1995 to 119 in 2000.* Then **compare** amounts with careful words such as *twice as many*, *half* or *2,000 more*, and check your arithmetic before you write.",
          "数据报告告诉读者数字说明了什么。说出每个**趋势**，并用**精确数值**支持它：*The number of wolves rose from 14 in 1995 to 119 in 2000.* 然后用 *twice as many*、*half*、*2,000 more* 等准确的词**比较**数量，写之前先检查计算。",
        ),
        writingGenerator(
          t(
            "Write a short report in English from the data, naming the trends with exact numbers and comparing amounts.",
            "根据数据用英语写一篇简短的报告，用精确数字说出趋势并比较数量。",
          ),
          dataBank,
          ["g7-data-accurate", "g7-data-compares", "g7-data-limits"],
          limits,
          onePiece,
        ),
      ),
      point(
        "what-the-data-can-and-cannot-show",
        t("What the Data Can and Cannot Show", "数据能说明什么、不能说明什么"),
        t(
          "When two things change together, a report can say they are linked, but it must be careful about **cause**. Say what the data suggest, then name another thing that could explain the pattern: *The data show that elk fell as wolves rose; however, hunting and harsh winters also changed.* End with a conclusion that stays within the evidence.",
          "当两件事一起变化时，报告可以说它们有联系，但谈到**因果**时必须谨慎。先说出数据暗示了什么，再指出另一个可能解释这种规律的因素：*The data show that elk fell as wolves rose; however, hunting and harsh winters also changed.* 结论不要超出证据。",
        ),
        writingGenerator(
          t(
            "Write a short report in English from the data, with a conclusion that says what the data suggest and what they cannot prove.",
            "根据数据用英语写一篇简短的报告，结论要说明数据暗示了什么、不能证明什么。",
          ),
          dataBank,
          ["g7-data-limits", "g7-data-accurate", "g7-data-compares"],
          limits,
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-a-cause-and-effect-essay",
    title: t("Writing a Cause-and-Effect Essay", "写因果文章"),
    summary: t(
      "Write an essay that traces a chain of causes and effects, each link supported with a fact and joined by words that show how one thing led to the next.",
      "写一篇追溯因果链的文章，每个环节都有事实支持，并用表示前因后果的词连接起来。",
    ),
    prerequisites: after("writing-a-cause-and-effect-paragraph", "cause-and-effect-in-history"),
    encompasses: [{ topic: "writing-a-cause-and-effect-paragraph", weight: 0.2 }],
    xp: 22,
    strand: "writing",
    criteria: ["g7-cause-chain", "g7-cause-evidence", "g35-cause-signals", "w4-concludes"].map(criterion),
    knowledgePoints: [
      point(
        "tracing-the-chain",
        t("Tracing the Chain", "追溯因果链"),
        t(
          "Many events do not have one cause and one effect; they set off a **chain**, in which each effect becomes the cause of the next. Trace the chain in order, one link per paragraph or a few sentences, and join the links with words such as *as a result*, *because of this*, *this, in turn,* and *finally*.",
          "许多事件不只有一个原因和一个结果；它们引发一条**因果链**，每个结果又成为下一个结果的原因。按顺序追溯这条链，每个环节写一段或几句话，并用 *as a result*、*because of this*、*this, in turn,*、*finally* 等词把各环节连接起来。",
        ),
        writingGenerator(
          t(
            "Write a cause-and-effect essay in English from the notes, tracing the chain of events link by link.",
            "根据笔记用英语写一篇因果文章，逐个环节追溯事件的因果链。",
          ),
          causeBank,
          ["g7-cause-chain", "g35-cause-signals", "g7-cause-evidence"],
          limits,
          onePiece,
        ),
      ),
      point(
        "explaining-each-link",
        t("Explaining Each Link", "解释每个环节"),
        t(
          "Each link needs more than a name; explain **how** the cause produced the effect, using a fact from the notes: *Tree roots hold soil in place like a net. When the trees are cut, the roots die, and the soil is left loose.* End with a conclusion that looks back over the whole chain, from the first cause to the last effect.",
          "每个环节不只是点出名字，还要用笔记中的事实解释原因**如何**产生了结果：*Tree roots hold soil in place like a net. When the trees are cut, the roots die, and the soil is left loose.* 最后用结论回顾整条链，从第一个原因到最后一个结果。",
        ),
        writingGenerator(
          t(
            "Write a cause-and-effect essay in English from the notes, explaining how each cause led to its effect and ending with a conclusion.",
            "根据笔记用英语写一篇因果文章，解释每个原因如何导致其结果，并以结论结束。",
          ),
          causeBank,
          ["g7-cause-evidence", "g7-cause-chain", "w4-concludes"],
          limits,
          onePiece,
        ),
      ),
    ],
  },
];
