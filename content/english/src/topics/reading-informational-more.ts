// More texts for the topics of reading informational texts: one shared set of short passages that several knowledge
// points ask about, and short items for the knowledge points of a single structure.

import type { ChoiceItem } from "@ga/subject-english";

/** Structure names how an informational text is organized. */
export type Structure = "sequence" | "problem and solution" | "cause and effect" | "compare and contrast" | "description";

/** InfoRecord is a short informational text with what several knowledge points ask about it. */
export interface InfoRecord {
  readonly text: string;
  readonly structure: Structure;
  /** main is its main idea. */
  readonly main: string;
  /** detail is one detail of the text that supports the main idea. */
  readonly detail: string;
  /** general is a broad fact the text does not explain. */
  readonly general: string;
  /** aside is true of the subject but gives no reason to believe the main idea. */
  readonly aside: string;
  readonly title: string;
  /** badTitles each fit a word or two of the text at most. */
  readonly badTitles: readonly [string, string];
  readonly summary: string;
  /** opinion is a summary that adds an opinion the text does not give, or leaves out its main points. */
  readonly opinion: string;
}

/** infoRecords are the shared texts. */
export const infoRecords: readonly InfoRecord[] = [
  {
    text: "The giant panda lives in the mountain forests of China. Its thick black-and-white fur keeps it warm in the cold, wet air. It spends up to fourteen hours a day eating bamboo, which grows all around it, holding the stalks in its front paws.",
    structure: "description",
    main: "Giant pandas are well suited to their mountain forest home.",
    detail: "Thick fur keeps pandas warm in the cold, wet air.",
    general: "Many different kinds of animals and plants live in the mountains and forests of China.",
    aside: "Pandas are popular with visitors to zoos.",
    title: "The Panda's Mountain Home",
    badTitles: ["Bamboo Furniture", "Black and White Photographs"],
    summary: "Giant pandas live in China's mountain forests, where thick fur keeps them warm and bamboo gives them food.",
    opinion: "Pandas are the cutest animals in the world, and it is wonderful to watch them munch on bamboo all day long.",
  },
  {
    text: "Making a clay pot takes patience. First, the potter kneads the clay to push out air bubbles. Next, she shapes it on a spinning wheel. Finally, she bakes it in a very hot oven called a kiln so that it hardens.",
    structure: "sequence",
    main: "Making a clay pot takes several careful steps.",
    detail: "The potter kneads the clay to push out air bubbles.",
    general: "Clay is found in the ground in many parts of the world, often near rivers.",
    aside: "Clay pots come in many colors.",
    title: "How a Clay Pot Is Made",
    badTitles: ["Spinning Toys", "Ovens in the Kitchen"],
    summary: "A potter kneads the clay, shapes it on a wheel and bakes it in a kiln.",
    opinion: "Potters make the most beautiful things in the world, and a pot made by hand is always better than one from a factory.",
  },
  {
    text: "In the 1930s, years of dry weather struck the American plains. Farmers had plowed up the grasses whose roots held the soil in place. When strong winds blew, the loose soil rose into huge dust storms. As a result, many families lost their farms and moved away.",
    structure: "cause and effect",
    main: "Dry weather and plowing led to dust storms that drove families from their farms.",
    detail: "Strong winds lifted the loose soil into dust storms.",
    general: "In every part of the world, the weather changes from one year to the next, sometimes a great deal.",
    aside: "Some of the farmers grew wheat.",
    title: "How the Dust Storms Began",
    badTitles: ["Life in a Big City", "Grasses and Flowers"],
    summary: "Dry weather and plowed fields let winds blow the soil away, and many farm families had to leave.",
    opinion: "The farmers foolishly plowed up the grass, and the dust storms that followed were the worst disaster America ever saw.",
  },
  {
    text: "Butterflies and moths are both insects with wings covered in tiny scales. Butterflies usually fly by day, while most moths fly at night. Butterflies rest with their wings folded up, but moths often rest with their wings spread flat.",
    structure: "compare and contrast",
    main: "Butterflies and moths are alike in some ways and different in others.",
    detail: "Most moths fly at night.",
    general: "There are many kinds of insects.",
    aside: "Some people collect butterflies.",
    title: "Butterflies and Moths Compared",
    badTitles: ["Insects That Bite", "How Scales Are Made"],
    summary: "Butterflies and moths both have scaly wings, but they differ in when they fly and how they rest.",
    opinion: "Butterflies are much prettier than moths.",
  },
  {
    text: "Every winter, the steps in front of the town hall froze, and people slipped. The town tried spreading salt, but the salt killed the plants nearby. Finally, workers laid heating pipes under the steps. Now the snow melts as soon as it lands.",
    structure: "problem and solution",
    main: "The town found a way to keep its steps free of ice.",
    detail: "Salt killed the plants near the steps.",
    general: "Winters are cold in many towns, and snow and ice can make streets and sidewalks slippery.",
    aside: "The town hall is over a hundred years old.",
    title: "Warm Steps for a Cold Town",
    badTitles: ["The Plants of Our Town", "Cooking With Salt"],
    summary: "To stop people slipping on the icy steps, the town laid heating pipes under them after salt harmed the plants.",
    opinion: "The town wasted its money on heating pipes when it could simply have asked people to walk more carefully on the steps.",
  },
  {
    text: "The Sahara is the largest hot desert on Earth. It stretches across much of North Africa. Sand dunes cover part of it, but much of it is bare rock and gravel. In summer, the daytime heat can pass 45 degrees Celsius.",
    structure: "description",
    main: "The Sahara is a huge, very hot desert of sand, rock and gravel.",
    detail: "Sand dunes cover part of the Sahara.",
    general: "Africa is a large continent.",
    aside: "Many films have been made in deserts.",
    title: "Inside the Sahara",
    badTitles: ["Building Sandcastles", "Rocks for Collectors"],
    summary: "The Sahara is a vast, very hot desert in North Africa, made of dunes, rock and gravel.",
    opinion: "The Sahara is the most frightening place on Earth.",
  },
  {
    text: "A bill becomes a law in several steps. First, a member of the lawmaking body writes it. Then the members debate it and vote. If most of them vote yes, it goes to the leader to sign. Once it is signed, it becomes a law.",
    structure: "sequence",
    main: "A bill must pass through several steps to become a law.",
    detail: "The members debate the bill and vote on it.",
    general: "Every country has laws, and people are expected to follow them whether or not they agree.",
    aside: "Some lawmakers give very long speeches.",
    title: "From Bill to Law",
    badTitles: ["Paying the Bills", "Famous Leaders"],
    summary: "A bill is written, debated, voted on and signed before it becomes a law.",
    opinion: "Making laws takes far too long, because lawmakers waste time debating and voting on every bill.",
  },
  {
    text: "Sea otters eat sea urchins, and sea urchins eat kelp. When hunters killed most of the otters along one coast, the urchins multiplied. They ate whole forests of kelp, and the fish that had lived among the kelp disappeared too.",
    structure: "cause and effect",
    main: "Losing the sea otters harmed the whole kelp forest.",
    detail: "The urchins multiplied when the otters were gone.",
    general: "Many animals live in the ocean.",
    aside: "Sea otters have very thick fur that keeps them warm in the cold water.",
    title: "When the Otters Disappeared",
    badTitles: ["Going Fishing", "Warm Fur Coats"],
    summary: "When hunters killed the otters, the urchins grew in number and ate the kelp, and the fish left.",
    opinion: "Hunting otters was cruel and wrong.",
  },
  {
    text: "Hurricanes and tornadoes are both storms with powerful spinning winds. A hurricane forms over warm ocean water and can be hundreds of miles wide. A tornado, in contrast, forms over land and is usually less than a mile wide, but its winds can be even faster.",
    structure: "compare and contrast",
    main: "Hurricanes and tornadoes both spin, but they differ in where they form and how big they are.",
    detail: "A hurricane forms over warm ocean water.",
    general: "Weather can be dangerous, and storms of many kinds damage homes and towns around the world every year.",
    aside: "Some people chase tornadoes to film them.",
    title: "Two Kinds of Spinning Storms",
    badTitles: ["Warm Ocean Beaches", "Making Storm Films"],
    summary:
      "Hurricanes and tornadoes both have spinning winds, but hurricanes form over the ocean and are huge, while tornadoes form over land and are small.",
    opinion: "Tornadoes are much scarier than hurricanes.",
  },
  {
    text: "Ms. Ito's students kept losing their pencils, and every morning class started late while they borrowed new ones. So Ms. Ito set out a cup of numbered pencils. Each student now takes the pencil with his or her number and puts it back at the end of the day.",
    structure: "problem and solution",
    main: "Ms. Ito found a way to solve the problem of lost pencils.",
    detail: "Class started late while students borrowed pencils.",
    general: "Students use many school supplies.",
    aside: "Ms. Ito teaches the fourth grade.",
    title: "The Numbered Pencil Plan",
    badTitles: ["Mornings at Home", "How Pencils Are Made"],
    summary: "Because her students kept losing pencils, Ms. Ito set out numbered pencils that they borrow and return each day.",
    opinion: "Ms. Ito's students are careless.",
  },
  {
    text: "The blue whale is the largest animal that has ever lived. It can grow longer than three buses parked end to end. Its heart alone is about the size of a small car. Even so, it eats only tiny shrimp-like animals called krill.",
    structure: "description",
    main: "The blue whale is the largest animal ever, though its food is tiny.",
    detail: "A blue whale's heart is about the size of a small car.",
    general: "Whales live in every ocean on Earth, from the warm waters near the equator to the icy seas near the poles.",
    aside: "Whale watching is popular in summer.",
    title: "The Biggest Animal of All",
    badTitles: ["Riding the Bus", "Shrimp for Dinner"],
    summary: "The blue whale is the largest animal ever, with a huge body and heart, yet it eats tiny krill.",
    opinion: "The blue whale is the most amazing animal there is, and everyone should see one swimming in the ocean.",
  },
  {
    text: "Paper money goes through many steps before it reaches a wallet. Artists first design each bill. The designs are then printed on large sheets of special paper. Next, machines cut the sheets into single bills. Finally, the bills are checked and sent to banks.",
    structure: "sequence",
    main: "Paper money is made in a series of steps.",
    detail: "Machines cut the printed sheets into single bills.",
    general: "People use money to buy things.",
    aside: "Some people collect old coins and keep them in special books or cases.",
    title: "How Paper Money Is Made",
    badTitles: ["Saving in a Piggy Bank", "Famous Artists"],
    summary: "Bills are designed, printed on sheets, cut apart, checked and sent to banks.",
    opinion: "Money is the most important thing in the world.",
  },
  {
    text: "Our school added ten minutes to recess last fall. Since then, teachers have noticed that students sit still more easily in class. Fewer students visit the nurse with headaches, and test scores have risen a little.",
    structure: "cause and effect",
    main: "A longer recess has brought good changes at our school.",
    detail: "Fewer students visit the nurse with headaches.",
    general: "Schools have many rules about when students may eat, play, talk and leave the classroom.",
    aside: "The playground has two slides.",
    title: "What a Longer Recess Did",
    badTitles: ["A Visit to the Nurse", "Slides and Swings"],
    summary: "Since recess grew by ten minutes, students focus better, feel better and score a little higher.",
    opinion: "Recess is the best part of the school day, and schools should make it even longer than ten extra minutes.",
  },
  {
    text: "Reading a paper book and reading an e-book are alike in many ways. Both tell the same story in the same words. A paper book, however, needs no battery, while an e-book reader can hold thousands of books at once.",
    structure: "compare and contrast",
    main: "Paper books and e-books tell the same stories but differ in how they work.",
    detail: "An e-book reader can hold thousands of books.",
    general: "Many people enjoy reading.",
    aside: "Libraries are usually quiet places where people can read, study and borrow books for free.",
    title: "Paper or Screen?",
    badTitles: ["Charging Batteries", "Quiet Libraries"],
    summary: "Paper books and e-books tell the same stories, but only an e-reader needs power and holds many books.",
    opinion: "Paper books are better than e-books.",
  },
  {
    text: "Elephants often broke into farms in parts of Kenya and ate the crops. Farmers learned that elephants avoid bees. They hung beehives along their fences. Now the elephants stay away, and the farmers sell honey too.",
    structure: "problem and solution",
    main: "Farmers used beehives to keep elephants away from their crops.",
    detail: "Elephants avoid bees.",
    general: "Farmers in many countries grow different kinds of crops, such as corn, beans, wheat and rice.",
    aside: "Elephants can live for seventy years.",
    title: "Bees Guard the Farm",
    badTitles: ["How Long Elephants Live", "Selling at the Market"],
    summary: "To stop elephants eating their crops, Kenyan farmers hung beehives on their fences, which also gave them honey.",
    opinion: "Elephants are nothing but pests, and farmers should be allowed to do whatever it takes to keep them off their land.",
  },
  {
    text: "A rain forest has several layers. At the top, a few giant trees rise above the rest. Below them, the leaves of most trees form a thick roof called the canopy. Near the dark forest floor, only plants that need little light can grow.",
    structure: "description",
    main: "A rain forest is made up of layers from the treetops to the floor.",
    detail: "Only plants that need little light grow near the forest floor.",
    general: "Forests have many trees.",
    aside: "Rain forests get a great deal of rain, often more than two hundred centimeters in a year.",
    title: "The Layers of a Rain Forest",
    badTitles: ["Roofs of Houses", "Lights in the Dark"],
    summary: "A rain forest has layers: giant trees at the top, a thick canopy below them and a dark floor.",
    opinion: "The canopy is the most interesting part of the rain forest.",
  },
  {
    text: "When a factory upstream began pouring hot water into the river, the river grew warmer. Warm water holds less oxygen than cold water. Soon many trout, which need plenty of oxygen, died.",
    structure: "cause and effect",
    main: "Hot water from the factory caused the trout to die.",
    detail: "Warm water holds less oxygen than cold water.",
    general: "Rivers flow downhill from mountains and hills until they reach a lake or the sea.",
    aside: "Trout are popular with people who fish.",
    title: "Too Warm for Trout",
    badTitles: ["Making Hot Tea", "Fishing Gear"],
    summary: "The factory's hot water warmed the river, so it held less oxygen, and many trout died.",
    opinion: "The factory owners should be punished for killing the trout, and the factory should be shut down for good.",
  },
  {
    text: "The Olympic torch travels far before each Games. It is lit by the sun's rays in Greece, using a curved mirror. Runners then carry it from city to city. At the opening ceremony, the last runner lights a great flame that burns until the Games end.",
    structure: "sequence",
    main: "The Olympic flame makes a long journey from Greece to the Games.",
    detail: "The torch is lit with a curved mirror in Greece.",
    general: "Many sports are played around the world.",
    aside: "Some Olympic runners win gold medals.",
    title: "The Journey of the Olympic Torch",
    badTitles: ["Mirrors in the Bathroom", "Famous Runners"],
    summary: "The Olympic torch is lit in Greece, carried by runners and used to light a flame at the opening of the Games.",
    opinion: "The torch relay is the most exciting part of the Olympics.",
  },
  {
    text: "Pet dogs and wolves are close relatives. Both live in groups and talk to one another with barks and body language. A wolf, however, must hunt for every meal, while a pet dog is fed by its owner. Wolves also avoid people, but most dogs enjoy them.",
    structure: "compare and contrast",
    main: "Pet dogs and wolves are related but live very differently.",
    detail: "A wolf must hunt for every meal.",
    general: "There are many kinds of animals in the world, and scientists sort them into groups by how they are related.",
    aside: "Some dogs wear bright collars.",
    title: "Wolves and Dogs Side by Side",
    badTitles: ["Choosing a Dog Collar", "Body Language"],
    summary: "Dogs and wolves are related and both live in groups, but wolves hunt and avoid people while dogs are fed and enjoy people.",
    opinion:
      "Dogs make much better friends than wolves, because wolves are wild hunters that avoid people while dogs love to be with them.",
  },
  {
    text: "The town pool was so crowded on hot days that people waited an hour to get in. The town council voted to open the pool earlier, at seven in the morning. It also built a splash pad in the park for small children. Now the lines are short.",
    structure: "problem and solution",
    main: "The town solved the problem of long lines at the pool.",
    detail: "A splash pad was built in the park for small children.",
    general: "Swimming is good exercise.",
    aside: "The pool has a high diving board that older swimmers like to use in the afternoon.",
    title: "Shorter Lines at the Pool",
    badTitles: ["High Diving Boards", "Parks in Winter"],
    summary: "To cut the long lines at the crowded pool, the town opened it earlier and built a splash pad.",
    opinion: "The pool is the best place in town.",
  },
  {
    text: "Saturn is the second-largest planet in our solar system. It is made mostly of gas. Its famous rings are made of countless pieces of ice and rock. Saturn also has more than a hundred moons.",
    structure: "description",
    main: "Saturn is a large gas planet with rings and many moons.",
    detail: "Saturn's rings are made of ice and rock.",
    general: "The night sky is full of stars, planets and moons that people have watched for thousands of years.",
    aside: "Some telescopes are very expensive.",
    title: "A Look at Saturn",
    badTitles: ["Collecting Rocks", "Buying a Telescope"],
    summary: "Saturn is a huge gas planet with rings of ice and rock and more than a hundred moons.",
    opinion: "Saturn is the most beautiful planet, with its rings of ice and rock, and everyone should look at it through a telescope.",
  },
  {
    text: "A cold, wet spring kept the flowers in our valley from opening until late. Because the flowers opened late, the bees had little food. The weak bees made less honey, and the beekeepers' sales fell by half.",
    structure: "cause and effect",
    main: "A cold spring caused a chain of problems for bees and beekeepers.",
    detail: "The bees had little food because the flowers opened late.",
    general: "The seasons change every year.",
    aside: "Honey can be used in baking.",
    title: "A Late Spring for the Bees",
    badTitles: ["Baking With Honey", "Valleys and Hills"],
    summary: "The cold spring made the flowers open late, so the bees went hungry, made less honey and sales fell.",
    opinion: "Keeping bees is too hard a job.",
  },
];

/** CauseRecord is a sentence of cause and effect, with a detail that caused nothing and the opposite of the effect. */
export type CauseRecord = readonly [text: string, cause: string, effect: string, detail: string, opposite: string];

/** causeRecords feed both the knowledge point of causes and that of effects. */
export const causeRecords: readonly CauseRecord[] = [
  [
    "The ice on the pond grew thin, so the park closed it to skaters.",
    "The ice grew thin.",
    "The park closed the pond to skaters.",
    "The pond is in a park.",
    "More skaters came to the pond.",
  ],
  [
    "Because the bakery's oven broke, there was no fresh bread on Tuesday.",
    "The bakery's oven broke.",
    "There was no fresh bread on Tuesday.",
    "The bakery sells bread.",
    "The bakery baked extra bread.",
  ],
  [
    "Mia stayed up late reading a mystery, and she fell asleep in class the next day.",
    "Mia stayed up late.",
    "Mia fell asleep in class.",
    "The book was a mystery.",
    "Mia was wide awake in class.",
  ],
  [
    "Heavy snow fell overnight. As a result, the airport canceled all its morning flights.",
    "Heavy snow fell overnight.",
    "The airport canceled its morning flights.",
    "The flights were in the morning.",
    "More flights left that morning.",
  ],
  [
    "The new puppy chewed through the lamp's cord, so the lamp stopped working.",
    "The puppy chewed through the cord.",
    "The lamp stopped working.",
    "The puppy is new.",
    "The lamp grew brighter.",
  ],
  [
    "Since the old stone bridge was being repaired, the bus took a longer road.",
    "The bridge was being repaired.",
    "The bus took a longer road.",
    "The bridge is made of stone.",
    "The bus took a shorter road.",
  ],
  [
    "After weeks of daily practice on the muddy field, the team's passing improved greatly.",
    "The team practiced every day for weeks.",
    "The team's passing improved.",
    "The field was muddy.",
    "The team's passing got worse.",
  ],
  [
    "The tall oak shaded the garden, so the tomatoes grew slowly.",
    "The oak shaded the garden.",
    "The tomatoes grew slowly.",
    "The oak was tall.",
    "The tomatoes grew quickly.",
  ],
  [
    "Due to a power failure at the stadium, the concert started two hours late.",
    "The stadium lost power.",
    "The concert started two hours late.",
    "The concert was held at a stadium.",
    "The concert started early.",
  ],
  [
    "Leo left the red gate open, and the goats wandered into the road.",
    "Leo left the gate open.",
    "The goats wandered into the road.",
    "The gate is red.",
    "The goats stayed in their pen.",
  ],
  [
    "The price of apples rose sharply because a late frost killed many blossoms.",
    "A late frost killed many blossoms.",
    "The price of apples rose.",
    "Apples grow from blossoms.",
    "Apples became cheaper.",
  ],
  [
    "The new streetlights on Park Road made it safer to walk there at night.",
    "New streetlights were put up.",
    "Walking there at night became safer.",
    "The road is called Park Road.",
    "Walking there at night became more dangerous.",
  ],
  [
    "Because the river stayed low all summer, the ferry could not run.",
    "The river stayed low.",
    "The ferry could not run.",
    "It was summer.",
    "The ferry ran more often.",
  ],
  [
    "Ravi forgot to charge his laptop, so it died in the middle of his science class.",
    "Ravi forgot to charge his laptop.",
    "The laptop died in class.",
    "The class was science.",
    "The laptop worked all day.",
  ],
  [
    "A strong wind blew the kite into the oak tree, where it stayed stuck for a week.",
    "A strong wind blew.",
    "The kite got stuck in the tree.",
    "The tree was an oak.",
    "The kite flew higher than ever.",
  ],
  [
    "The road crew painted bright green lines along the bike lane, and accidents there dropped.",
    "The crew painted lines along the bike lane.",
    "Accidents in the bike lane dropped.",
    "The lines were green.",
    "Accidents in the bike lane rose.",
  ],
  [
    "Because Grandma added too much salt, nobody finished the soup at Sunday dinner.",
    "Grandma added too much salt.",
    "Nobody finished the soup.",
    "The dinner was on Sunday.",
    "Everyone asked for more soup.",
  ],
  [
    "The new dam held back the spring floods, so the town stayed dry.",
    "The dam held back the floods.",
    "The town stayed dry.",
    "The floods came in spring.",
    "The town was flooded.",
  ],
  [
    "The teacher played calm music during the math test, and the students felt less nervous.",
    "The teacher played calm music.",
    "The students felt less nervous.",
    "The test was in math.",
    "The students grew more nervous.",
  ],
  [
    "The hot sun dried the blue paint quickly, so we could hang the sign by noon.",
    "The sun dried the paint quickly.",
    "We could hang the sign by noon.",
    "The paint was blue.",
    "The sign could not be hung for days.",
  ],
  [
    "As a result of the long drought, the mountain lake shrank to half its size.",
    "There was a long drought.",
    "The lake shrank to half its size.",
    "The lake is in the mountains.",
    "The lake grew larger.",
  ],
  [
    "Our gray cat knocked a glass off the table, and it shattered.",
    "The cat knocked the glass off the table.",
    "The glass shattered.",
    "The cat is gray.",
    "The glass bounced without breaking.",
  ],
];

/** moreFirstBank asks what happened first in texts that do not tell events in order. */
export const moreFirstBank: readonly ChoiceItem[] = [
  [
    "Tom ate breakfast after he had walked the dog. Then he left for school.",
    "Tom walked the dog.",
    ["Tom ate breakfast.", "Tom left for school."],
  ],
  [
    "The movie started at seven. Before it began, we had bought popcorn. Earlier still, we had waited in a long line for tickets.",
    "We waited in line for tickets.",
    ["We bought popcorn.", "The movie started."],
  ],
  [
    "Lucy planted the tulip bulbs in October. She had dug the flower bed in September. The flowers opened in April.",
    "Lucy dug the flower bed.",
    ["Lucy planted the bulbs.", "The flowers opened."],
  ],
  [
    "The plane landed in Tokyo at noon. It had taken off from Sydney the night before, after a delay of two hours.",
    "The flight was delayed.",
    ["The plane took off from Sydney.", "The plane landed in Tokyo."],
  ],
  [
    "When Dad got home, the soup was ready. Mom had chopped the vegetables an hour before and then let the soup simmer.",
    "Mom chopped the vegetables.",
    ["The soup simmered.", "Dad got home."],
  ],
  [
    "The bridge opened in 1937. Building it had taken four years, and planning it had taken many years before that.",
    "The bridge was planned.",
    ["The bridge was built.", "The bridge opened."],
  ],
  [
    "Jada won the race on Saturday. Two months earlier, she had started training every morning. A week before the race, she had hurt her knee, but it healed quickly.",
    "Jada started training.",
    ["Jada hurt her knee.", "Jada won the race."],
  ],
  [
    "Before you paint the fence, scrape off the old paint. But first of all, wash the fence with soap and water.",
    "Wash the fence.",
    ["Scrape off the old paint.", "Paint the fence."],
  ],
  [
    "The baby giraffe stood up an hour after it was born. Soon after that, it took its first drink of milk.",
    "The giraffe was born.",
    ["The giraffe stood up.", "The giraffe drank milk."],
  ],
  [
    "By the time the firefighters arrived, the neighbors had already led everyone out of the building. The smoke alarm had warned them minutes before.",
    "The smoke alarm went off.",
    ["The neighbors led everyone out.", "The firefighters arrived."],
  ],
  [
    "Omar handed in his book report on Monday. He had written it on Sunday, after finishing the book on Saturday.",
    "Omar finished the book.",
    ["Omar wrote the report.", "Omar handed in the report."],
  ],
  [
    "The town held a parade to celebrate the new school. The school had opened a week before, after two years of building.",
    "The school was built.",
    ["The school opened.", "The town held a parade."],
  ],
  [
    "Grandpa told us that he met Grandma at a dance. Years later, they moved to the city. Before the dance, he had seen her once at the library.",
    "Grandpa saw Grandma at the library.",
    ["Grandpa met Grandma at a dance.", "They moved to the city."],
  ],
  [
    "The ship reached the island in May. It had left port in March and stopped for supplies in April.",
    "The ship left port.",
    ["The ship stopped for supplies.", "The ship reached the island."],
  ],
  [
    "After the storm passed, the farmers checked their fields. During the storm, they had waited in the barn. Before it hit, they had led the cows inside.",
    "The farmers led the cows inside.",
    ["The farmers waited in the barn.", "The farmers checked their fields."],
  ],
  [
    "Rosa mailed the thank-you card on Friday. She had opened the gift on her birthday, Tuesday, and written the card on Thursday.",
    "Rosa opened the gift.",
    ["Rosa wrote the card.", "Rosa mailed the card."],
  ],
  [
    "The class performed its play in June. Rehearsals had begun in April, two weeks after the parts were given out.",
    "The parts were given out.",
    ["Rehearsals began.", "The class performed the play."],
  ],
  [
    "The scientist announced her discovery at a meeting in the fall. She had spent the summer checking her results. The first clue had appeared in the spring.",
    "The first clue appeared.",
    ["She checked her results.", "She announced her discovery."],
  ],
  [
    "We reached the campsite at dusk. Earlier, we had hiked for six hours, and before that we had driven to the trailhead.",
    "We drove to the trailhead.",
    ["We hiked for six hours.", "We reached the campsite."],
  ],
  [
    "The bread came out of the oven golden brown. It had risen for an hour before baking, and the dough had been kneaded before it rose.",
    "The dough was kneaded.",
    ["The dough rose.", "The bread came out of the oven."],
  ],
  [
    "Mr. Lee retired last year. He had taught at the school for thirty years, and before that he had worked as a pilot.",
    "Mr. Lee worked as a pilot.",
    ["Mr. Lee taught at the school.", "Mr. Lee retired."],
  ],
  [
    "The city built a new park where the old factory had stood. The factory had closed ten years earlier and had been torn down last spring.",
    "The factory closed.",
    ["The factory was torn down.", "The city built a park."],
  ],
];

/** moreDifferenceBank asks how two things differ, with ways in which they are alike as the wrong options. */
export const moreDifferenceBank: readonly ChoiceItem[] = [
  [
    "Both bees and wasps can sting, and both live in colonies. Bees eat nectar and pollen, while most wasps hunt other insects.",
    "what they eat",
    ["whether they can sting", "whether they live in colonies"],
  ],
  [
    "Violins and cellos both have four strings and are played with a bow. A violin is held under the chin, while a cello stands on the floor between the player's knees.",
    "how they are held",
    ["the number of strings", "whether they are played with a bow"],
  ],
  [
    "Both the Arctic and the Antarctic are icy and cold all year. The Arctic is an ocean surrounded by land, but the Antarctic is land surrounded by ocean.",
    "whether they are mostly land or ocean",
    ["how cold they are", "whether they are icy"],
  ],
  [
    "Both hockey and soccer have two teams that try to score goals. Hockey is played on ice with sticks, while soccer is played on grass with the feet.",
    "where and how they are played",
    ["the number of teams", "the aim of the game"],
  ],
  [
    "Emails and letters both carry written messages to other people. A letter takes days to arrive, but an email arrives in seconds.",
    "how fast they arrive",
    ["what they carry", "who receives them"],
  ],
  [
    "Both apes and monkeys are primates that live in groups. Most monkeys have tails, but apes do not.",
    "whether they have tails",
    ["whether they are primates", "whether they live in groups"],
  ],
  [
    "Venus and Earth are nearly the same size, and both are rocky planets. Earth has mild weather, while Venus is hot enough to melt lead.",
    "how hot they are",
    ["their size", "whether they are rocky"],
  ],
  [
    "Both the guitar and the piano can play many notes at once, and both are popular with beginners. The guitar is easy to carry, but the piano is too heavy to move without help.",
    "how easy they are to carry",
    ["whether they play many notes at once", "whether beginners like them"],
  ],
  [
    "Both sharks and dolphins are fast swimmers with fins. Dolphins breathe air at the surface, while sharks take oxygen from the water through their gills.",
    "how they breathe",
    ["how fast they swim", "whether they have fins"],
  ],
  [
    "Ms. Ruiz and Mr. Hall both teach science at our school. Ms. Ruiz teaches in the morning, but Mr. Hall teaches in the afternoon.",
    "when they teach",
    ["what subject they teach", "where they teach"],
  ],
  [
    "Both cotton and wool are natural materials used to make clothes. Cotton comes from a plant, while wool comes from sheep.",
    "where they come from",
    ["whether they are natural", "what they are used for"],
  ],
  [
    "Mount Everest and K2 are both in Asia, and both are among the tallest mountains in the world. Everest is the taller of the two, but K2 is harder and more dangerous to climb.",
    "how hard they are to climb",
    ["where they are", "whether they are among the tallest"],
  ],
  [
    "Both the Nile and the Amazon are among the longest rivers on Earth, and both end at the sea. The Nile flows through desert, while the Amazon flows through rain forest.",
    "the land they flow through",
    ["their length", "where they end"],
  ],
  [
    "Both owls and hawks are hunting birds with sharp claws. Owls hunt mostly at night, but hawks hunt during the day.",
    "when they hunt",
    ["whether they hunt", "whether they have sharp claws"],
  ],
  [
    "Trains and buses both carry many passengers and stop along the way. Buses drive on roads, but trains run on tracks.",
    "what they travel on",
    ["how many passengers they carry", "whether they stop along the way"],
  ],
  [
    "Lemons and limes are both sour citrus fruits. Lemons are yellow, while limes are green.",
    "their color",
    ["how they taste", "the kind of fruit they are"],
  ],
  [
    "Both twins love music and play in the school band. Ella plays the drums, but Emma plays the trumpet.",
    "the instruments they play",
    ["whether they love music", "whether they are in the band"],
  ],
  [
    "Both deserts and the polar regions get very little rain or snow, and few plants grow in either. Deserts are often hot, while the polar regions are freezing all year.",
    "their temperature",
    ["how much rain or snow they get", "how many plants grow there"],
  ],
  [
    "Both bats and birds can fly, and both use wings. Birds' wings are covered with feathers, but bats' wings are made of thin skin.",
    "what their wings are made of",
    ["whether they can fly", "whether they have wings"],
  ],
  [
    "Both the old library and the new one have many books and quiet places to read. The new library has computers for everyone, while the old one had only two.",
    "how many computers they have",
    ["whether they have many books", "whether they have quiet places to read"],
  ],
  [
    "Both Mars and Earth have seasons and ice at their poles. A year on Mars, however, lasts almost twice as long as a year on Earth.",
    "how long a year lasts",
    ["whether they have seasons", "whether they have ice at their poles"],
  ],
  [
    "Both bicycles and scooters have two wheels and handlebars. A bicycle is moved by pedals, but a scooter is pushed along by the rider's foot.",
    "how they are moved",
    ["the number of wheels", "whether they have handlebars"],
  ],
];

/** moreSolutionBank asks what solved a problem. */
export const moreSolutionBank: readonly ChoiceItem[] = [
  [
    "The school's lost-and-found box overflowed with jackets. The student council posted photos of each item online, and most items went home within a week.",
    "Posting photos of the items online",
    ["Buying a bigger box", "Giving the jackets away to a store at the end of each month"],
  ],
  [
    "Squirrels kept stealing seeds from Ms. Gray's bird feeder. She hung the feeder from a long wire far from any branch, and the squirrels could not reach it.",
    "Hanging the feeder from a long wire",
    ["Buying more seeds", "Feeding the squirrels"],
  ],
  [
    "The soccer team had no money for new uniforms. The players washed cars every Saturday for a month and earned enough to buy them.",
    "Washing cars to earn the money",
    ["Wearing their old uniforms", "Asking the coach to pay"],
  ],
  [
    "The stairwell was so dim that students tripped on the stairs. The school painted the edge of each step bright yellow.",
    "Painting the edges of the steps yellow",
    ["Closing the stairs", "Telling students to hurry so they reach class before the bell"],
  ],
  [
    "Ben could never find his keys in the morning. He put a hook by the door and hung his keys on it as soon as he came home.",
    "Hanging his keys on a hook by the door",
    ["Buying new keys", "Leaving the door unlocked"],
  ],
  [
    "The water from the town's only well was making people sick. Engineers built a filter that cleaned the water before anyone drank it.",
    "Building a filter to clean the water",
    ["Digging the well deeper", "Drinking less water"],
  ],
  [
    "Customers complained that the line at the café moved too slowly. The owner added a second register and hired another worker.",
    "Adding a register and another worker",
    ["Closing the café early", "Raising the prices so that fewer people come in each morning"],
  ],
  [
    "The class hamster escaped from its cage every night. The students found a gap by the cage door and closed it with a clip.",
    "Closing the gap with a clip",
    ["Getting a new hamster", "Leaving the classroom light on"],
  ],
  [
    "Rain kept washing the soil off a farm on a steep hillside. The farmers cut flat steps into the hill and planted their crops on them.",
    "Cutting flat steps into the hill",
    ["Moving the farm", "Planting fewer crops"],
  ],
  [
    "Many older people in the town felt lonely. Students began visiting them every Friday to play games and talk.",
    "Visiting them every Friday",
    ["Building a new park", "Sending them letters and photos from the family every week"],
  ],
  [
    "Raccoons knocked over the park's trash cans every night. The city replaced them with cans that have locking lids.",
    "Putting in cans with locking lids",
    ["Catching the raccoons", "Taking the trash cans away"],
  ],
  [
    "Cars sped past the school every morning. The town put up flashing signs and painted a crosswalk, and drivers slowed down.",
    "Putting up flashing signs and painting a crosswalk",
    ["Closing the school", "Building a new road that goes around the school and the park"],
  ],
  [
    "Nina kept running out of time on tests. Her teacher showed her how to skip hard questions and come back to them at the end.",
    "Skipping hard questions and coming back to them",
    ["Studying less", "Writing faster"],
  ],
  [
    "Pigeons nested on the station roof and dirtied the benches below. Workers put up thin wires that the birds could not land on.",
    "Putting up wires the birds could not land on",
    ["Feeding the pigeons", "Moving the benches to the other side of the square"],
  ],
  [
    "The wind kept blowing over the music stands at the band's outdoor concerts. The players clipped small weights to the bottom of each stand.",
    "Clipping weights to the stands",
    ["Playing only indoors", "Buying new music"],
  ],
  [
    "Many students missed breakfast because their buses arrived late. The school began serving breakfast in classrooms during the first ten minutes of the day.",
    "Serving breakfast in the classrooms",
    ["Making the buses later", "Shortening the school day"],
  ],
  [
    "The village was cut off whenever the river flooded its only road. The villagers built a footbridge high above the water.",
    "Building a high footbridge",
    ["Waiting for the floods to end", "Moving the village"],
  ],
  [
    "Our garden hose kept tangling. Dad fixed a reel to the wall and wound the hose onto it after each use.",
    "Winding the hose onto a reel",
    ["Buying a longer hose", "Watering the garden less often, only on cool mornings"],
  ],
  [
    "The library's study room was always full. The librarians set up a sign-up sheet so that each group could book an hour.",
    "Setting up a sign-up sheet",
    ["Closing the study room", "Removing the tables"],
  ],
  [
    "Ships kept running aground on a hidden sandbar. The harbor placed a bright buoy above the sandbar.",
    "Placing a buoy above the sandbar",
    ["Building bigger ships", "Closing the harbor"],
  ],
  [
    "Students forgot much of what they had learned over the summer. The school sent home a reading list with prizes for finishing it.",
    "Sending home a reading list with prizes",
    ["Making the summer shorter", "Giving harder tests in reading on the first day of school"],
  ],
  [
    "Moths were eating the wool sweaters in the closet. Grandma stored them in sealed boxes with blocks of cedar.",
    "Storing the sweaters in sealed boxes with cedar",
    ["Throwing the sweaters away", "Buying cotton sweaters"],
  ],
];

/** moreSignalBank asks for a word of time order. */
export const moreSignalBank: readonly ChoiceItem[] = [
  ["Wash the brushes. ___, put them in the jar to dry.", "Then", ["Because", "For example"]],
  ["___ the movie ended, the lights came on.", "When", ["Unless", "However"]],
  ["The ice cream melted ___ we got it home.", "before", ["because", "unlike"]],
  ["We waited inside ___ the rain stopped.", "until", ["although", "unlike"]],
  ["First, boil the water. ___, add the pasta.", "Second", ["Similarly", "Because"]],
  ["The seeds were planted in May. ___, the first sprouts appeared.", "Two weeks later", ["For example", "Instead"]],
  ["___ dinner, we washed the dishes.", "After", ["Unlike", "Although"]],
  ["The baby was asleep ___ we finished the story.", "by the time", ["because", "unlike"]],
  ["Turn off the lights ___ you leave the room.", "when", ["because", "unlike"]],
  ["The leaves turned red. ___, they fell to the ground.", "Later", ["However", "For example"]],
  ["___ the paint dries, add a second coat.", "Once", ["Although", "Unlike"]],
  ["The runners lined up. ___, the whistle blew.", "Then", ["Because", "Instead"]],
  ["The tadpole grew back legs. ___, its tail began to shrink.", "Soon after", ["For example", "However"]],
  ["___, the farmer feeds the hens. Then she collects the eggs.", "Every morning", ["However", "Because"]],
  ["The guests arrived ___ the cake was ready.", "after", ["unless", "unlike"]],
  ["Mix the paint well. ___, test the color on paper.", "Next", ["Although", "Similarly"]],
  ["___ the sun rose, the birds began to sing.", "As soon as", ["Unless", "However"]],
  ["He studied for weeks. ___, he passed the exam.", "In the end", ["For example", "Instead"]],
  ["Stir the soup ___ it heats.", "while", ["unlike", "because"]],
  ["Clean up your desk ___ the bell rings.", "before", ["although", "unlike"]],
  ["The power came back on. ___, the clocks started blinking.", "Right away", ["For example", "Similarly"]],
  ["We lived in Ohio for five years. ___, we moved to Texas.", "After that", ["Because", "Instead"]],
];

/** CompareItem is a gap for a word of likeness or difference, marked by which it needs. */
export type CompareItem = readonly [item: ChoiceItem, alike: boolean];

/** moreCompareWords ask for a word that shows likeness or difference. */
export const moreCompareWords: readonly CompareItem[] = [
  [["Owls hunt at night. ___, bats look for food after dark.", "Similarly", ["However", "Next"]], true],
  [["Whales live in the ocean, ___ they breathe air as we do.", "but", ["so", "also"]], false],
  [["___ a car, a bicycle needs no fuel.", "Unlike", ["Because of", "After"]], false],
  [["Ana likes math. Her brother ___ likes math.", "also", ["instead", "next"]], true],
  [["The desert is dry, ___ the rain forest is wet.", "while", ["so", "and then"]], false],
  [["Both lions ___ tigers are big cats.", "and", ["but", "so"]], true],
  [["Sam enjoys hiking. His sister, ___, prefers to stay home and read.", "on the other hand", ["in the same way", "as a result"]], false],
  [["Some frogs are green. ___, many lizards are green to hide among leaves.", "Likewise", ["However", "First"]], true],
  [["A tablet is light. A laptop, ___, is heavier but has a keyboard.", "however", ["also", "next"]], false],
  [["Just ___ birds, many insects have wings.", "like", ["unlike", "because"]], true],
  [["Our old house was small. ___, our new house has five bedrooms.", "In contrast", ["Similarly", "Next"]], false],
  [["Mia plays the violin, and her cousin plays it ___.", "too", ["instead", "first"]], true],
  [["Paper is made from wood. Cardboard is made from wood ___.", "as well", ["instead", "next"]], true],
  [["Rain falls as drops of water, ___ snow falls as crystals of ice.", "whereas", ["so", "and then"]], false],
  [["___ a key opens a lock, a password opens an account.", "Just as", ["Because of", "After"]], true],
  [["Most birds can fly. Penguins, ___, cannot.", "however", ["also", "first"]], false],
  [["Cats clean their fur with their tongues. Rabbits ___ keep their fur clean by licking it.", "also", ["instead", "next"]], true],
  [["Trains run on tracks, ___ buses can go almost anywhere there is a road.", "but", ["so", "also"]], false],
  [["___ her sister, Lily is very tall.", "Like", ["Because of", "After"]], true],
  [["The first book was funny. The second book was ___ funny.", "equally", ["instead", "next"]], true],
  [["Spiders have eight legs. Insects, ___, have six.", "in contrast", ["also", "as a result"]], false],
  [["My phone is new, ___ my brother's is three years old.", "while", ["so", "also"]], false],
];

/** Subject is a subject of a book, with a word of its glossary, a topic of its index, a photo and a section. */
interface Subject {
  readonly name: string;
  readonly word: string;
  readonly topic: string;
  readonly photo: string;
  readonly section: string;
}

const subjects: readonly Subject[] = [
  { name: "volcanoes", word: "magma", topic: "ash clouds", photo: "lava flowing into the sea", section: "how volcanoes form" },
  {
    name: "the human heart",
    word: "artery",
    topic: "heartbeats",
    photo: "a doctor listening to a heartbeat",
    section: "keeping your heart healthy",
  },
  { name: "ancient Rome", word: "aqueduct", topic: "Roman roads", photo: "the ruins of a stone arena", section: "daily life in Rome" },
  {
    name: "rain forests",
    word: "canopy",
    topic: "tree frogs",
    photo: "a jaguar resting on a branch",
    section: "the animals of the forest floor",
  },
  {
    name: "the ocean",
    word: "plankton",
    topic: "coral reefs",
    photo: "a diver beside a sea turtle",
    section: "the deepest parts of the sea",
  },
  { name: "weather", word: "humidity", topic: "lightning", photo: "a funnel cloud over a field", section: "how clouds form" },
  { name: "insects", word: "antenna", topic: "honeybees", photo: "an ant carrying a leaf", section: "how insects grow" },
  { name: "space", word: "orbit", topic: "Saturn", photo: "astronauts on the space station", section: "the life of a star" },
];

/** moreFeatureBank asks which feature of a book answers a question. */
export const moreFeatureBank: readonly ChoiceItem[] = subjects.flatMap((s): ChoiceItem[] => [
  [`In a book about ${s.name}, you want to know what the word *${s.word}* means.`, "the glossary", ["the index", "a caption"]],
  [`In a book about ${s.name}, you want to find the page that tells about ${s.topic}.`, "the index", ["the glossary", "a caption"]],
  [
    `In an article about ${s.name}, you want to know what a photo of ${s.photo} shows.`,
    "the caption",
    ["the glossary", "the table of contents"],
  ],
  [
    `You want to see the names of all the chapters of a book about ${s.name}, in order.`,
    "the table of contents",
    ["the index", "a caption"],
  ],
]);

/** moreFeatureJobBank asks what each feature of a book does, in the words of that book. */
export const moreFeatureJobBank: readonly ChoiceItem[] = subjects.flatMap((s, i): ChoiceItem[] => {
  const jobs: readonly (readonly [string, string])[] = [
    ["the glossary", `It explains special words of the book, such as *${s.word}*.`],
    ["the index", `It lists topics such as ${s.topic} in alphabetical order, with their pages.`],
    ["the table of contents", "It lists every chapter in order, with the page where each begins."],
    ["a heading", `It tells what the section below it, such as one on ${s.section}, is about.`],
    ["a caption", `It explains what a picture, such as one of ${s.photo}, shows.`],
  ];
  return jobs.map(([feature, job], j): ChoiceItem => {
    const others = jobs.filter((_, k) => k !== j);
    const a = others[(i + j) % others.length]![1];
    const b = others[(i + j + 2) % others.length]![1];
    return [`${feature}, in a book about ${s.name}`, job, [a, b]];
  });
});
