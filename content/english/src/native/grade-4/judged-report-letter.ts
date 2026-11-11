// Grade 4: writing judged by a model, a report of two paragraphs on a biome and a persuasive letter about saving energy.

import { type TopicDef, t } from "@ga/content";
import { point, type WritingItem, writingGenerator } from "@ga/subject-english";
import { criterion, onePiece } from "./judged-kit.ts";
import { after } from "./prior.ts";

/** reportBank asks for a report of two paragraphs under headings, each paragraph on one part of a biome. */
const reportBank: readonly WritingItem[] = [
  {
    task: "Write a report of two paragraphs about the desert. Give the first paragraph the heading Desert Plants and the second the heading Desert Animals.",
    model:
      "Desert Plants\nThe desert is one of the driest places on Earth, but many plants live there. A cactus stores water in its thick stem, and its sharp spines protect it from thirsty animals. Some desert plants have roots that spread wide just under the ground to catch every drop of rain.\n\nDesert Animals\nDesert animals have their own ways to survive the heat. Many are nocturnal, which means they are active at night. For example, the fennec fox sleeps in a cool burrow all day and hunts after sunset. Plants and animals alike have found clever ways to live where water is scarce.",
  },
  {
    task: "Write a report of two paragraphs about the rainforest. Give the first paragraph the heading The Canopy and the second the heading The Forest Floor.",
    model:
      "The Canopy\nThe rainforest has several layers, and the busiest is the canopy. The canopy is the thick roof of leaves formed by the treetops. Monkeys, parrots and tree frogs live here, and many of them never touch the ground.\n\nThe Forest Floor\nFar below, the forest floor is dark and damp, because the canopy blocks most of the sunlight. Fallen leaves rot quickly and feed the soil. Ants, beetles and large animals such as tapirs search for food among the roots. From top to bottom, every layer of the rainforest is full of life.",
  },
  {
    task: "Write a report of two paragraphs about the tundra. Give the first paragraph the heading Land and Weather and the second the heading Life on the Tundra.",
    model:
      "Land and Weather\nThe tundra is a cold, treeless land near the Arctic. Its winters are long and dark, and its summers last only about two months. Under the surface lies permafrost, ground that stays frozen all year, so tall trees cannot put down deep roots.\n\nLife on the Tundra\nEven so, many living things make the tundra their home. Low plants such as mosses and lichens grow close to the ground, out of the wind. Caribou travel across the tundra in huge herds, and arctic foxes grow thick white fur for winter. Life on the tundra is hard, but it is never empty.",
  },
  {
    task: "Write a report of two paragraphs about the polar oceans. Give the first paragraph the heading Ice and Water and the second the heading Animals of the Ice.",
    model:
      "Ice and Water\nThe polar oceans lie at the top and the bottom of the Earth. Much of their surface freezes into sea ice in winter. Huge icebergs, which are mountains of ice that break off glaciers, float in the water, and most of each iceberg is hidden below the surface.\n\nAnimals of the Ice\nMany animals depend on the ice. Seals rest on floating ice and dive for fish. Polar bears hunt the seals, and a layer of blubber, or thick fat, keeps them warm. Without the ice, these animals would lose their home.",
  },
  {
    task: "Write a report of two paragraphs about the savanna. Give the first paragraph the heading Wet and Dry Seasons and the second the heading Grazers and Hunters.",
    model:
      "Wet and Dry Seasons\nThe savanna is a wide grassland with only a few trees, found in places such as East Africa. It has two seasons. In the wet season, heavy rain makes the grass grow tall and green. In the dry season, there is almost no rain for months, and the rivers shrink.\n\nGrazers and Hunters\nThe grass feeds huge herds of grazers, animals that eat grass, such as zebras and wildebeest. Lions and cheetahs hunt these grazers. When the dry season comes, many herds travel hundreds of kilometers to find water. The seasons shape every part of life on the savanna.",
  },
  {
    task: "Write a report of two paragraphs about mountains. Give the first paragraph the heading Climbing Higher and the second the heading Living Up High.",
    model:
      "Climbing Higher\nThe higher you climb a mountain, the colder it gets. Forests grow on the lower slopes, but above a certain height, called the tree line, trees cannot grow. Near the top there is only rock, snow and thin air with less oxygen.\n\nLiving Up High\nAnimals that live high in the mountains are built for the cold. Mountain goats have hooves that grip steep rock, and snow leopards have thick fur and wide paws that work like snowshoes. From the forests below to the icy peaks, a mountain holds many different worlds.",
  },
  {
    task: "Write a report of two paragraphs about coral reefs. Give the first paragraph the heading What a Reef Is and the second the heading Life on the Reef.",
    model:
      "What a Reef Is\nA coral reef looks like rock, but it is built by tiny animals called corals. Each coral makes a hard skeleton, and over thousands of years these skeletons pile up into a reef. Reefs grow in warm, clear, shallow seas, such as the waters off Australia.\n\nLife on the Reef\nReefs cover only a small part of the ocean, yet about a quarter of all sea creatures live on them. Clownfish hide in sea anemones, and sea turtles feed on the sponges. A healthy reef is one of the most crowded places on the planet.",
  },
  {
    task: "Write a report of two paragraphs about temperate forests. Give the first paragraph the heading Four Seasons and the second the heading Getting Ready for Winter.",
    model:
      "Four Seasons\nTemperate forests grow in places with four seasons, such as much of Europe and North America. Many of their trees are deciduous, which means they lose their leaves in autumn. In spring, new leaves grow, and the forest turns green again.\n\nGetting Ready for Winter\nWhen winter comes, the animals of the forest find ways to survive. Squirrels bury nuts to eat later, some birds fly south, and bears sleep through the coldest months. Each season brings changes, and the forest and its animals change with it.",
  },
  {
    task: "Write a report of two paragraphs about wetlands. Give the first paragraph the heading What Wetlands Are and the second the heading Why Wetlands Matter.",
    model:
      "What Wetlands Are\nA wetland is land that is covered with shallow water for at least part of the year. Marshes, swamps and bogs are all kinds of wetlands. Reeds, grasses and water lilies grow there, and frogs, herons and turtles find food among them.\n\nWhy Wetlands Matter\nWetlands help people too. They soak up heavy rain like a sponge, which helps to stop floods. They also clean water as it slowly flows through their plants. For example, one wetland in Florida cleans water for thousands of homes. Protecting wetlands protects the animals and the towns around them.",
  },
  {
    task: "Write a report of two paragraphs about the taiga, the great northern forest. Give the first paragraph the heading Trees of the Taiga and the second the heading Animals of the Taiga.",
    model:
      "Trees of the Taiga\nThe taiga is the largest forest on land, stretching across Russia, Canada and Scandinavia. Most of its trees are conifers, such as pines and spruces, which keep their needles all year. Their cone shape lets heavy snow slide off without breaking the branches.\n\nAnimals of the Taiga\nThe animals of the taiga must survive long, snowy winters. Moose wade through deep snow on their long legs, and lynx hunt snowshoe hares, which turn white in winter to hide. The taiga is cold and quiet, but it is home to many hardy animals.",
  },
  {
    task: "Write a report of two paragraphs about the Sahara. Give the first paragraph the heading Sand and Sun and the second the heading People of the Sahara.",
    model:
      "Sand and Sun\nThe Sahara is the largest hot desert in the world, about the size of the United States. In the day, the temperature can climb above forty degrees. Some of its sand dunes are taller than a forty-story building, and they slowly move with the wind.\n\nPeople of the Sahara\nPeople have lived in the Sahara for thousands of years. Some are herders who move with their camels and goats from one oasis to the next. An oasis is a place in the desert where water comes up from under the ground. Life in the Sahara depends on finding water.",
  },
  {
    task: "Write a report of two paragraphs about grasslands. Give the first paragraph the heading A Sea of Grass and the second the heading Animals of the Grasslands.",
    model:
      "A Sea of Grass\nGrasslands are wide, flat lands where grass grows instead of trees. They get more rain than deserts but not enough for forests. The prairies of North America and the steppes of Asia are both grasslands, and in summer their grass can grow taller than a child.\n\nAnimals of the Grasslands\nMany animals live among the grass. Prairie dogs dig long tunnels under the ground, and hawks circle above, watching for them. Long ago, millions of bison grazed the prairies. Grasslands may look empty, but they are full of life.",
  },
];

/** reportFactsBank asks for a report of two paragraphs that develops its points with facts and a definition or an example. */
const reportFactsBank: readonly WritingItem[] = [
  {
    task: "Write a report of two paragraphs about how animals survive in the Arctic, each under a heading. Use at least one definition or example.",
    model:
      "Staying Warm\nThe Arctic is one of the coldest places on Earth, and its animals have special ways to keep warm. Polar bears have blubber, a thick layer of fat under the skin, and fur that traps heat. Arctic foxes curl their bushy tails over their noses when they sleep.\n\nFinding Food\nFood is hard to find in the long Arctic winter. Polar bears wait beside holes in the ice for seals to come up to breathe. Some animals, such as snow geese, fly south when winter comes. Every Arctic animal has a plan for surviving the cold.",
  },
  {
    task: "Write a report of two paragraphs about rainforest plants, each under a heading. Use at least one definition or example.",
    model:
      "Reaching for Light\nIn the rainforest, plants compete for sunlight. Tall trees grow up to sixty meters to reach it. Vines climb up their trunks, and epiphytes, which are plants that grow on other plants, sit high on the branches. Orchids, for example, cling to tree bark.\n\nPlants That Help People\nMany rainforest plants are useful to people. Chocolate comes from the seeds of the cacao tree, and rubber comes from the sap of the rubber tree. Some medicines are also made from rainforest plants. When rainforests are cut down, these useful plants are lost too.",
  },
  {
    task: "Write a report of two paragraphs about how desert animals find water, each under a heading. Use at least one definition or example.",
    model:
      "Water from Food\nIn the desert, rain may not fall for months, so animals must find water in other ways. Many get it from their food. The kangaroo rat, for example, almost never drinks; it gets nearly all its water from the seeds it eats.\n\nSaving Water\nDesert animals are also good at saving water. Camels can lose a lot of water without getting sick and then drink more than a hundred liters at once. Many animals are nocturnal, which means they come out at night, when it is cooler and they lose less water. Saving water keeps them alive.",
  },
  {
    task: "Write a report of two paragraphs about life in the ocean's deep sea, each under a heading. Use at least one definition or example.",
    model:
      "A Dark, Cold World\nThe deep sea begins about two hundred meters below the surface, where sunlight cannot reach. The water is very cold, and the weight of the water above presses down hard. No plants can grow there because there is no light.\n\nMaking Their Own Light\nMany deep-sea animals make their own light. This is called bioluminescence. The anglerfish, for example, has a glowing lure on its head that attracts smaller fish close enough to eat. In a world without sunlight, light is a powerful tool.",
  },
  {
    task: "Write a report of two paragraphs about why the rainforest is important, each under a heading. Use at least one definition or example.",
    model:
      "A Home for Living Things\nRainforests cover a small part of the Earth, but about half of the world's plants and animals live in them. A single tree in the Amazon can be home to hundreds of kinds of insects. Many animals, such as jaguars and sloths, live nowhere else.\n\nHelping the Whole Planet\nRainforests also help everyone on Earth. Their trees take in carbon dioxide and give out oxygen, the gas we need to breathe. They also make rain that falls far away. Protecting rainforests helps to protect the whole planet.",
  },
  {
    task: "Write a report of two paragraphs about how cactuses survive, each under a heading. Use at least one definition or example.",
    model:
      "Storing Water\nA cactus is a plant that is built to store water. When it rains, its roots soak up as much water as they can, and the cactus stores it in its thick, swollen stem. The giant saguaro, for example, can hold hundreds of liters.\n\nProtecting Itself\nA cactus also protects the water it has saved. Instead of leaves, it has spines, which are sharp, thin needles that lose very little water and keep thirsty animals away. A waxy skin keeps the water inside. With these tricks, a cactus can live for years in the dry desert.",
  },
  {
    task: "Write a report of two paragraphs about animals that migrate, each under a heading. Use at least one definition or example.",
    model:
      "What Migration Is\nTo migrate means to travel from one place to another as the seasons change. Many animals migrate to find food, warmth or a safe place to have their young. Some journeys are short, but others cross whole oceans.\n\nAmazing Journeys\nSome migrations are very long. The arctic tern, for example, flies from the Arctic to the Antarctic and back every year, about seventy thousand kilometers. Wildebeest on the savanna travel in huge herds following the rain. These journeys are some of the greatest in the animal world.",
  },
  {
    task: "Write a report of two paragraphs about how a desert changes between day and night, each under a heading. Use at least one definition or example.",
    model:
      "The Burning Day\nIn the day, the desert sun beats down on the sand. With no clouds to block it, the ground can grow hot enough to burn bare feet. Most animals hide in burrows or in the shade of rocks until the heat passes.\n\nThe Cold Night\nAt night, the desert cools quickly, because there are no clouds to hold in the heat. In some deserts, the temperature drops below freezing. This is when nocturnal animals, animals that are active at night, come out. Scorpions, owls and foxes hunt under the stars.",
  },
  {
    task: "Write a report of two paragraphs about how people live in cold climates, each under a heading. Use at least one definition or example.",
    model:
      "Homes for the Cold\nPeople who live in cold places build homes that keep the heat in. In the Arctic, the Inuit once built igloos, which are domes made of blocks of snow. Snow traps air, so an igloo stays much warmer inside than outside.\n\nClothes and Food\nWarm clothes are just as important. Coats of animal fur and boots of sealskin keep out the wind and the wet. People also eat foods rich in fat, such as fish and seal meat, which give the body energy to stay warm. In every way, life is shaped by the cold.",
  },
  {
    task: "Write a report of two paragraphs about the animals of the rainforest canopy, each under a heading. Use at least one definition or example.",
    model:
      "Moving Through the Trees\nThe canopy is the thick layer of treetops in a rainforest, and many animals never leave it. Spider monkeys swing from branch to branch using their long tails like an extra arm. Flying frogs glide between trees on wide, webbed feet.\n\nFinding Food High Up\nThe canopy is full of food. Fruit, nuts and flowers grow in the sunlight at the top of the trees. Toucans use their huge, light beaks to pick fruit, and sloths chew leaves slowly all day. For these animals, the treetops are both a home and a pantry.",
  },
  {
    task: "Write a report of two paragraphs about permafrost, each under a heading. Use at least one definition or example.",
    model:
      "Frozen Ground\nPermafrost is ground that stays frozen for at least two years in a row. It lies under much of the tundra in places such as Alaska, Canada and Siberia. In summer, only the top layer of soil thaws, and the ground below stays as hard as stone.\n\nWhy Permafrost Matters\nPermafrost holds ancient things. Scientists have found the frozen bodies of woolly mammoths in it, kept for thousands of years. As the Earth grows warmer, some permafrost is melting, and roads and houses built on it can crack and sink. What happens to permafrost affects people and the whole planet.",
  },
  {
    task: "Write a report of two paragraphs about how plants of the tundra survive, each under a heading. Use at least one definition or example.",
    model:
      "Staying Small\nThe tundra is cold and windy, so its plants stay small. Most grow close to the ground, out of the strongest wind. Lichens, which are made of a fungus and a tiny plant living together, cover the rocks like crusts of paint.\n\nA Short Summer\nTundra plants must grow quickly in the short summer. For about two months, the sun shines almost all day and night. Flowers such as the arctic poppy bloom fast and turn to follow the sun. By the time the snow returns, their seeds are ready for the next year.",
  },
];

/** letterBank asks for a persuasive letter asking for one change that saves energy. */
const letterBank: readonly WritingItem[] = [
  {
    task: "Write a letter to your principal asking the school to turn off computers at the end of every school day.",
    model:
      "Dear Principal Lee,\n\nI am writing to ask that our school turn off all its computers at the end of every school day. Right now, many computers in the library stay on all night. First, this wastes energy: one school in our town saved four hundred dollars a year by switching its computers off. Second, the saved money could buy new books. Our class would be happy to make reminder signs.\n\nThank you for considering my idea.\n\nYours sincerely,\nMaya Chen",
  },
  {
    task: "Write a letter to your town council asking it to replace the old streetlights with LED lights.",
    model:
      "Dear Members of the Town Council,\n\nI am writing to ask you to replace the old streetlights on Main Street with LED lights. LED lights use much less electricity than old bulbs, so the town would spend less on its energy bill. They also last about twenty-five times longer, so workers would not need to change them so often. That money could be used for our parks.\n\nThank you for reading my letter. I hope you will vote for this change.\n\nSincerely,\nLeo Martins",
  },
  {
    task: "Write a letter to your principal asking for solar panels on the school roof.",
    model:
      "Dear Mrs. Okafor,\n\nI would like to ask you to put solar panels on our school roof. Our roof is large and flat, and it gets sun all day. Solar panels turn sunlight into electricity without making any smoke, so our school would be cleaner. A school near ours saved a third of its electricity bill after it added panels. Students could also learn about energy by watching how much power the panels make.\n\nThank you for your time.\n\nYours sincerely,\nAisha Patel",
  },
  {
    task: "Write a letter to your principal asking the school to keep classroom doors and windows closed when the heating is on.",
    model:
      "Dear Principal Garcia,\n\nI am writing to ask that every class keep its doors and windows closed when the heating is on. In our building, many windows stay open on cold days, and the warm air escapes outside. This means the heaters must work harder and use more energy. If we kept the windows shut, the school would save money and our rooms would stay warmer. My class could check the windows at the end of each day.\n\nThank you for listening.\n\nSincerely,\nTom Becker",
  },
  {
    task: "Write a letter to your town council asking for a safe bike path to the school, so fewer families drive.",
    model:
      "Dear Town Council,\n\nI am asking you to build a safe bike path from the park to our school. Every morning, about two hundred cars drive children to school, and each one burns fuel. Many families have told our class they would cycle if there were a safe path. A bike path would save fuel, cut down on smoke near the school and help children get exercise.\n\nThank you for thinking about my request. I hope to ride my bike to school soon.\n\nSincerely,\nNina Kowalski",
  },
  {
    task: "Write a letter to your principal asking the school to switch off the lights in empty classrooms.",
    model:
      "Dear Mr. Thompson,\n\nI am writing to ask that we switch off the lights whenever a classroom is empty. During lunch and recess, many rooms stay lit with no one inside. Lights left on in empty rooms can waste about a tenth of a school's electricity. If every class chose one student to turn off the lights, we could save energy and money without any cost at all. My class would be glad to start first.\n\nThank you for your help.\n\nYours sincerely,\nSam Ito",
  },
  {
    task: "Write a letter to your town council asking it to put timers on the lights of the town library.",
    model:
      "Dear Members of the Council,\n\nI would like to ask you to put timers on the lights of our town library. When I walk past at night, the lights are often still on long after the library has closed. A timer would turn them off automatically at closing time. This would save electricity every night of the year and lower the library's bills, so there would be more money for new books.\n\nThank you for reading my idea.\n\nSincerely,\nGrace Mbeki",
  },
  {
    task: "Write a letter to your principal asking for a school recycling program for cans and paper.",
    model:
      "Dear Principal Novak,\n\nI am writing to ask you to start a recycling program for cans and paper at our school. Right now, all our cans and paper go into the trash. Making a can from recycled metal uses far less energy than making a new one. Our cafeteria throws away about a hundred cans every day, so recycling them would save a lot of energy. My class could collect the bins every Friday.\n\nThank you for considering my request.\n\nYours sincerely,\nOmar Haddad",
  },
  {
    task: "Write a letter to your principal asking the school to replace old light bulbs with LED bulbs.",
    model:
      "Dear Mrs. Fischer,\n\nI am writing to ask that our school replace its old light bulbs with LED bulbs. Old bulbs turn most of their energy into heat instead of light, which wastes electricity. LED bulbs use much less energy and last many years longer. Although they cost a little more at first, they save money over time. Changing the bulbs in just our hallway would make a real difference.\n\nThank you for your time and attention.\n\nSincerely,\nBen Adeyemi",
  },
  {
    task: "Write a letter to your town council asking it to plant trees around the town's buildings to keep them cool in summer.",
    model:
      "Dear Town Council,\n\nI am writing to ask you to plant trees around the town hall and the library. In summer, these buildings run their air conditioners all day, which uses a lot of electricity. Trees give shade, and the ground under a tree can be ten degrees cooler than in the sun. With more shade, the buildings would need less cooling and the town would save energy.\n\nThank you for considering my idea. Our class would love to help plant the trees.\n\nSincerely,\nLily Ramos",
  },
  {
    task: "Write a letter to your principal asking students to walk or cycle to school one day each week.",
    model:
      "Dear Principal Wright,\n\nI am writing to ask that our school hold a Walk to School Day every Wednesday. Many families drive to school, even when they live only a few blocks away. Each car trip burns fuel and adds smoke to the air near our gate. If even half the families walked one day a week, we would save hundreds of car trips every month. Walking is also good exercise for students.\n\nThank you for reading my letter.\n\nYours sincerely,\nKai Andersen",
  },
  {
    task: "Write a letter to your town council asking it to add insulation to the old community center.",
    model:
      "Dear Members of the Town Council,\n\nI am asking you to add insulation to the walls and roof of the community center. In winter, the building is always cold, even with the heaters on all day. Insulation keeps heat inside a building, so the heaters would not have to work so hard. A house with good insulation can use about half as much energy for heating. This change would save money and make the center warmer for everyone.\n\nThank you for your time.\n\nSincerely,\nRosa Lindqvist",
  },
];

/** letterFactsBank asks for a persuasive letter whose reasons are backed by facts, written for its reader. */
const letterFactsBank: readonly WritingItem[] = [
  {
    task: "Write a letter to your principal asking the school to unplug machines such as printers and chargers over the weekend. Back your reasons with facts.",
    model:
      "Dear Principal Brown,\n\nI am writing to ask that our school unplug its printers, chargers and other machines every Friday afternoon. Many machines use electricity even when they are switched off but still plugged in. Our class counted forty such machines in the school. Unplugging them for the weekend would save energy for two whole days each week, and the money saved could pay for art supplies.\n\nThank you for considering my request.\n\nYours sincerely,\nEmma Laurent",
  },
  {
    task: "Write a letter to your town council asking it to build wind turbines on the hill outside town. Back your reasons with facts.",
    model:
      "Dear Town Council,\n\nI am writing to ask you to build wind turbines on Windy Hill. The hill is the windiest place in our area, which makes it a good place for turbines. One large turbine can make enough electricity for about a thousand homes, and it makes no smoke. Our town could make its own clean energy instead of buying it from far away.\n\nThank you for reading my letter. I hope you will think about this idea.\n\nSincerely,\nDiego Silva",
  },
  {
    task: "Write a letter to your principal asking the school to set the heating one degree lower in winter. Back your reasons with facts.",
    model:
      "Dear Mr. Kim,\n\nI would like to ask that our school set the heating one degree lower this winter. Many classrooms are so warm that students take off their sweaters. Turning the heat down by just one degree can cut heating costs by about a tenth. That would save a lot of energy over a whole winter, and we would still be comfortable in our sweaters.\n\nThank you for thinking about my suggestion.\n\nYours sincerely,\nHana Sato",
  },
  {
    task: "Write a letter to your town council asking for more buses on the route to the school. Back your reasons with facts.",
    model:
      "Dear Members of the Council,\n\nI am writing to ask for more buses on Route 4, which goes past our school. The buses now come only once an hour, so most families drive instead. Our class did a survey and found that sixty families would take the bus if it came every twenty minutes. One full bus can take about forty cars off the road, which saves fuel and keeps the air cleaner.\n\nThank you for your time.\n\nSincerely,\nAva Johnson",
  },
  {
    task: "Write a letter to your principal asking the school to use natural light in classrooms on sunny days. Back your reasons with facts.",
    model:
      "Dear Principal Diaz,\n\nI am writing to ask that classrooms open their blinds and switch off the lights on sunny days. Our classrooms have big windows, but the blinds are usually closed and the lights are on. Lighting can use about a quarter of a school's electricity. Using sunlight instead would save energy, and some studies show that students feel more awake in natural light.\n\nThank you for reading my letter.\n\nYours sincerely,\nEli Cohen",
  },
  {
    task: "Write a letter to your town council asking it to fix the leaking pipes at the town pool, which waste heated water. Back your reasons with facts.",
    model:
      "Dear Town Council,\n\nI am writing to ask you to fix the leaking pipes at the town pool. The pool's water is heated, so every leak wastes both water and the energy used to warm it. A lifeguard told our class that the pool loses about a thousand liters a day. Fixing the pipes would save energy and money, and the pool could stay open longer.\n\nThank you for considering this. I hope the repairs can happen soon.\n\nSincerely,\nLucas Moreau",
  },
  {
    task: "Write a letter to your principal asking the school to start an energy team of students. Back your reasons with facts.",
    model:
      "Dear Mrs. Hughes,\n\nI am writing to ask you to start an energy team of students at our school. The team could check that lights, computers and heaters are turned off when they are not needed. In a school in our city, an energy team like this cut the electricity bill by nearly a fifth in one year. Our team would also teach other students how to save energy at home.\n\nThank you for your time.\n\nYours sincerely,\nZara Ahmed",
  },
  {
    task: "Write a letter to your town council asking it to turn off the fountain lights in the park after midnight. Back your reasons with facts.",
    model:
      "Dear Members of the Town Council,\n\nI am writing to ask that the lights of the park fountain be turned off after midnight. The park closes at ten o'clock, so no one is there to see them. Yet the lights stay on until morning, every night of the year. That is more than two thousand hours of wasted light each year. A simple timer would fix this and save the town money.\n\nThank you for reading my letter.\n\nSincerely,\nPriya Sharma",
  },
  {
    task: "Write a letter to your principal asking the school to install water-saving taps that turn off by themselves. Back your reasons with facts.",
    model:
      "Dear Principal Evans,\n\nI am writing to ask that our school install taps that turn off by themselves. Many taps in our washrooms are left running, and the hot water also uses energy to heat. A tap that runs for one minute can waste about ten liters of water. Taps that shut off on their own would save water and the energy needed to warm it.\n\nThank you for considering my request.\n\nYours sincerely,\nMax Weber",
  },
  {
    task: "Write a letter to your town council asking it to put solar panels on the roof of the town library. Back your reasons with facts.",
    model:
      "Dear Town Council,\n\nI am writing to ask you to put solar panels on the roof of the town library. The library has a large, sunny roof that faces south, which is the best direction for panels. Solar panels make clean electricity from sunlight and cost almost nothing to run once they are in place. The library could also use the panels to teach visitors about clean energy.\n\nThank you for your time. I hope you will consider my idea.\n\nSincerely,\nOlivia Park",
  },
  {
    task: "Write a letter to your principal asking the school to use a clothesline instead of the dryer for the sports team's towels. Back your reasons with facts.",
    model:
      "Dear Mr. Ali,\n\nI am writing to ask that our school dry the sports team's towels on a clothesline instead of in the dryer. The dryer runs for hours every week, and dryers are among the machines that use the most electricity. On sunny days, towels dry outside in about two hours for free. A clothesline behind the gym would save energy and money all spring and summer.\n\nThank you for reading my letter.\n\nYours sincerely,\nJada Wilson",
  },
  {
    task: "Write a letter to your town council asking it to hold a yearly Energy Saving Week in town. Back your reasons with facts.",
    model:
      "Dear Members of the Council,\n\nI am writing to ask you to hold an Energy Saving Week in our town every spring. During the week, families could try to turn off lights, walk instead of drive and unplug machines. In another town, an event like this helped families cut their energy use by about a tenth that week, and many kept the habits afterward. It would also bring the town together.\n\nThank you for considering my idea.\n\nSincerely,\nNoah Bennett",
  },
];

/** reportLetterTopics4 are the judged writing topics of grade 4 for a report and a persuasive letter. */
export const reportLetterTopics4: readonly TopicDef[] = [
  {
    id: "writing-a-two-paragraph-report",
    title: t("Writing a Report of Two Paragraphs", "写两段式报告"),
    summary: t(
      "Write a report of two paragraphs on a biome, each under a heading, with facts grouped by paragraph, a definition or an example, and a closing sentence.",
      "写一篇关于某种生物群落的两段式报告：每段有小标题，事实按段落分组，包含一个定义或例子，并有结尾句。",
    ),
    prerequisites: after("writing-a-fact-paragraph", "choosing-headings", "ordering-paragraphs"),
    encompasses: [
      { topic: "choosing-headings", weight: 0.2 },
      { topic: "ordering-paragraphs", weight: 0.2 },
    ],
    xp: 22,
    strand: "writing",
    criteria: ["g4-report-topic", "g4-report-grouped", "g4-report-facts", "g4-report-close"].map(criterion),
    knowledgePoints: [
      point(
        "two-paragraphs-under-headings",
        t("Two Paragraphs Under Headings", "小标题下的两个段落"),
        t(
          "A report of two paragraphs splits its topic into two parts. Each paragraph gets a **heading** that names its part, *Desert Plants* and *Desert Animals*, and keeps to it: a fact about animals does not belong in the paragraph about plants. The report opens by naming its topic and ends with a sentence that closes it.",
          "两段式报告把话题分成两部分。每一段都有一个说明这一部分内容的**小标题**，比如 *Desert Plants* 和 *Desert Animals*，并且只讲这一部分：关于动物的事实不应该放在讲植物的那一段。报告开头点明话题，结尾用一个句子收束。",
        ),
        writingGenerator(
          t("Write a report of two paragraphs in English, each under its heading.", "用英语写一篇两段式报告，每段都写在小标题下面。"),
          reportBank,
          ["g4-report-topic", "g4-report-grouped", "g4-report-close"],
          { minWords: 80, maxChars: 2400 },
          onePiece,
        ),
      ),
      point(
        "facts-definitions-and-examples-in-a-report",
        t("Facts, Definitions and Examples in a Report", "报告中的事实、定义和例子"),
        t(
          "A report teaches. It gives **specific facts**, such as names and numbers, instead of only general statements. When it uses a word the reader may not know, it gives a **definition**: *Permafrost is ground that stays frozen all year.* When a point needs to be clear, it gives an **example**: *The arctic tern, for example, flies seventy thousand kilometers a year.*",
          "报告是用来传授知识的。它给出**具体的事实**，比如名称和数字，而不只是笼统的说法。用到读者可能不认识的词时，要给出**定义**：*Permafrost is ground that stays frozen all year.* 需要把观点说清楚时，要举**例子**：*The arctic tern, for example, flies seventy thousand kilometers a year.*",
        ),
        writingGenerator(
          t(
            "Write a report of two paragraphs in English, each under a heading of your own, with facts and at least one definition or example.",
            "用英语写一篇两段式报告，每段有你自己拟的小标题，包含事实和至少一个定义或例子。",
          ),
          reportFactsBank,
          ["g4-report-facts", "g4-report-grouped", "g4-report-close"],
          { minWords: 80, maxChars: 2400 },
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-a-persuasive-letter",
    title: t("Writing a Persuasive Letter", "写说服信"),
    summary: t(
      "Write a letter to a principal or a town council asking for one change that saves energy, with the request stated clearly, reasons backed by facts and a tone that suits the reader.",
      "给校长或镇议会写一封信，请求做出一项节约能源的改变：清楚地提出请求，用事实支持理由，语气适合读信的人。",
    ),
    prerequisites: after("writing-a-friendly-letter", "writing-an-opinion-paragraph", "supporting-reasons-with-facts"),
    encompasses: [
      { topic: "writing-an-opinion-paragraph", weight: 0.3 },
      { topic: "supporting-reasons-with-facts", weight: 0.2 },
    ],
    xp: 22,
    strand: "writing",
    criteria: ["g4-letter-request", "w4-gives-reasons", "g4-letter-facts", "g4-letter-audience"].map(criterion),
    knowledgePoints: [
      point(
        "asking-for-one-change",
        t("Asking for One Change", "请求一项改变"),
        t(
          "A persuasive letter asks its reader to **do one thing**. Say it near the start, plainly: *I am writing to ask that our school turn off its computers every night.* Then give at least two reasons. Write as a letter, with a greeting (*Dear Principal Lee,*) and a closing (*Yours sincerely,*), and keep a polite tone: you are asking, not ordering.",
          "说服信请求读信的人**做一件事**。在开头附近直截了当地说出来：*I am writing to ask that our school turn off its computers every night.* 然后给出至少两个理由。要写成信的样子，有称呼（*Dear Principal Lee,*）和结尾敬语（*Yours sincerely,*），语气要礼貌：你是在请求，不是在命令。",
        ),
        writingGenerator(
          t(
            "Write a persuasive letter in English that asks for one change and gives your reasons.",
            "用英语写一封说服信，请求一项改变并给出理由。",
          ),
          letterBank,
          ["g4-letter-request", "w4-gives-reasons", "g4-letter-audience"],
          { minWords: 70, maxChars: 2000 },
          onePiece,
        ),
      ),
      point(
        "reasons-backed-by-facts",
        t("Reasons Backed by Facts", "用事实支持的理由"),
        t(
          "A principal or a council is persuaded by **facts**, not by how strongly you feel. Back a reason with a number, a fact or an example: *One school in our town saved four hundred dollars a year by switching off its computers.* Even a fact you found yourself, such as a count your class made, makes a reason stronger.",
          "校长或议会是被**事实**说服的，而不是被你的感受有多强烈说服的。用数字、事实或例子支持理由：*One school in our town saved four hundred dollars a year by switching off its computers.* 哪怕是你自己找到的事实，比如全班做的一次统计，也能让理由更有力。",
        ),
        writingGenerator(
          t("Write a persuasive letter in English that backs its reasons with facts.", "用英语写一封说服信，用事实支持你的理由。"),
          letterFactsBank,
          ["g4-letter-facts", "g4-letter-request", "g4-letter-audience"],
          { minWords: 70, maxChars: 2000 },
          onePiece,
        ),
      ),
    ],
  },
];
