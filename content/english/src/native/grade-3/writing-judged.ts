// Grade 3: writing judged by a model: a friendly letter, a paragraph of facts from notes, a fable, an answer to a
// question in sentences, and a poem about a season. Each topic has one bank of tasks that its two steps share, each
// step judging the work by its own criteria.

import { type CriterionSpec, type Text, type TopicDef, t } from "@ga/content";
import { criterionById, point, type WritingItem, writingGenerator } from "@ga/subject-english";

/** criterion finds a criterion by its id, failing when there is none. */
const criterion = (id: string): CriterionSpec => {
  const found = criterionById(id);
  if (!found) throw new Error(`unknown criterion ${id}`);
  return found;
};

/** quoted quotes every line of a model, so that a letter or a poem stays one quotation. */
const quoted = (model: string) =>
  model
    .split("\n")
    .map((line) => (line ? `> ${line}` : ">"))
    .join("\n");

const onePiece = (model: string): Text => t(`One good answer:\n\n${quoted(model)}`, `一个好的答案：\n\n${quoted(model)}`);

const letterBank: readonly WritingItem[] = [
  {
    task: "Write a friendly letter to a cousin who lives far away about the park nearest your home. Tell what it looks like and what you do there.",
    model:
      "May 3, 2026\n\nDear Sofia,\n\nI want to tell you about Willow Park, which is just at the end of my street. It has a round pond with ducks and a tall wooden bridge over a stream. In spring the cherry trees turn pink, and the petals float on the water like little boats. After school I ride my scooter on the path around the pond and feed the ducks with my brother. When you visit, I will take you there first.\n\nLove,\nMaya",
  },
  {
    task: "Write a friendly letter to a grandparent about your classroom. Tell what it looks like and what you like best about it.",
    model:
      "October 12, 2026\n\nDear Grandpa,\n\nYou asked me about my new classroom, so here it is. It is on the second floor, and big windows look out over the playground. We have a reading corner with soft green cushions and a shelf full of comics. On the back wall there is a map of the world with a pin for every place our class has visited. My favorite thing is our class hamster, Pepper, who sleeps in a tube all day.\n\nLove,\nOmar",
  },
  {
    task: "Write a friendly letter to a pen pal in another country about a market or a shop in your town that you like to visit.",
    model:
      "June 8, 2026\n\nDear Kenta,\n\nEvery Saturday my mother and I go to the farmers' market in the town square. It is full of white tents, and each one sells something different, like honey, bread or flowers. The best tent belongs to an old man who sells peaches as big as my fist. He always gives me one to taste. I love the smell of fresh bread and the sound of a man playing the fiddle. What markets do you have in Japan?\n\nYour friend,\nLily",
  },
  {
    task: "Write a friendly letter to a friend who moved away about a beach, a lake or a river near your home.",
    model:
      "August 2, 2026\n\nDear Ben,\n\nI miss you, so I want to tell you about Clear Lake, where we went last weekend. The water is so clear that you can see small silver fish swimming over the stones. Tall pine trees grow all around it, and in the morning the lake is covered in mist. We rented a little red boat and rowed to an island with a rope swing. I wish you could have swung into the water with me.\n\nYour friend,\nDiego",
  },
  {
    task: "Write a friendly letter to an aunt or uncle about your favorite room at home. Tell what is in it and why you like it.",
    model:
      "January 20, 2027\n\nDear Aunt Rosa,\n\nMy favorite room in our house is the kitchen. It is small, but it is the warmest room, because the oven is always on. There is a round table by the window where we eat and do homework. On the wall hangs a clock shaped like a cat whose tail swings from side to side. I like the kitchen best because that is where Dad and I bake bread on Sundays and the whole house smells sweet.\n\nLove,\nNina",
  },
  {
    task: "Write a friendly letter to a friend about a library you like to visit. Tell what it looks like and what you do there.",
    model:
      "March 15, 2026\n\nDear Zoe,\n\nYou would love the library on Elm Street. It is an old brick building with stone lions beside the front steps. Inside, the children's room has a ceiling painted like the night sky, with gold stars and a silver moon. I sit on the bean bags under the window and read books about animals. On Fridays a librarian reads stories aloud, and she does a different voice for every character. Could you come with me next time?\n\nYour friend,\nPriya",
  },
  {
    task: "Write a friendly letter to a grandparent about a garden, a farm or a field you know well.",
    model:
      "July 9, 2026\n\nDear Grandma,\n\nOur school garden is growing so well this summer! It is behind the gym, inside a fence painted blue. We have six long beds of vegetables, and my class looks after the tomatoes and the beans. The bean plants have climbed right up their poles, taller than me. Bees buzz around the yellow squash flowers all day long. Next week we will pick our first tomatoes, and I am saving the reddest one for you.\n\nLove,\nSam",
  },
  {
    task: "Write a friendly letter to a friend about a place where you like to play outside in winter.",
    model:
      "December 18, 2026\n\nDear Leo,\n\nWhen it snows, everyone in my town goes to Hilltop Field. It is a big hill behind the fire station, and from the top you can see the whole town. The snow there is deep and soft, and the path down is long and fast. My sister and I race our sleds and then build snow forts at the bottom. When our fingers get cold, a lady sells hot cocoa from a little cart. I hope you can sled there with me.\n\nYour friend,\nElla",
  },
  {
    task: "Write a friendly letter to a cousin about a museum, a zoo or an aquarium you have visited.",
    model:
      "April 25, 2026\n\nDear Mateo,\n\nLast Sunday we went to the city aquarium, and I have to tell you about it. When you walk in, there is a tunnel made of glass, and sharks and rays swim right over your head. The jellyfish room is dark, and the jellyfish glow pink and blue like lamps. My favorite part was the touch pool, where I held a starfish. It felt rough and a bit sticky. You should ask your parents to take you there.\n\nYour cousin,\nAna",
  },
  {
    task: "Write a friendly letter to a teacher from last year about your new school or your new classroom.",
    model:
      "September 20, 2026\n\nDear Ms. Green,\n\nI wanted to tell you about my new school. It is much bigger than our old one, with three floors and a library that has its own fish tank. My classroom is at the very top, and from my desk I can see the river. We have a garden on the roof where we grow herbs and strawberries. I still read every night, just like you taught us. I hope your new class is as noisy as we were!\n\nYour student,\nKenji",
  },
  {
    task: "Write a friendly letter to a friend about a street, a square or a neighborhood in your town that you like.",
    model:
      "November 6, 2026\n\nDear Hana,\n\nMy favorite place in town is Lantern Street, near the river. It is a narrow street with old wooden houses painted red, green and yellow. Strings of paper lanterns hang from one side to the other, and at night they glow orange. There is a noodle shop where the cook throws the dough high in the air before he cuts it. On weekends a man plays music on a bench. Will you visit it with me when you come?\n\nYour friend,\nMei",
  },
  {
    task: "Write a friendly letter to a relative about a place you visited on a trip, such as a mountain, a forest or a city.",
    model:
      "August 30, 2026\n\nDear Uncle Ray,\n\nThis summer we went camping in the Green Mountains, and I want to tell you all about it. Our tent was in a forest of tall pines next to a rushing stream. Every morning we heard woodpeckers tapping on the trees. On the third day we climbed to the top of Eagle Peak, and the clouds were below us like a white sea. At night the stars were so bright that we could see the Milky Way. I can't wait to go back.\n\nYour nephew,\nJamal",
  },
];

const notesBank: readonly WritingItem[] = [
  {
    task: "Write a paragraph of facts about camels, using these notes.",
    source:
      "- live in hot deserts\n- hump stores fat, not water\n- can go many days without drinking\n- long eyelashes keep out sand\n- wide feet do not sink in sand",
    model:
      "Camels are animals that are built for life in hot deserts. A camel's hump is full of fat, not water, and the camel can use it for energy when food is hard to find. Camels can also go for many days without a drink. Their long eyelashes keep blowing sand out of their eyes, and their wide feet stop them from sinking into the sand. All of these parts help camels survive where few other animals can.",
  },
  {
    task: "Write a paragraph of facts about honeybees, using these notes.",
    source:
      "- live in hives, thousands together\n- one queen lays the eggs\n- workers collect nectar from flowers\n- nectar becomes honey\n- carry pollen, help plants make seeds",
    model:
      "Honeybees are busy insects that live and work together. Thousands of bees share one hive, and a single queen lays all the eggs. The worker bees fly from flower to flower to collect nectar, which they turn into honey back at the hive. As they move between flowers, they carry pollen, and this helps the plants make seeds. Without honeybees, many of the fruits and vegetables we eat would be much harder to grow.",
  },
  {
    task: "Write a paragraph of facts about the Nile River, using these notes.",
    source:
      "- longest river in Africa\n- flows north to the sea\n- floods every summer in ancient times\n- flood left rich black soil\n- farmers grew wheat and flax",
    model:
      "The Nile River was the center of life in ancient Egypt. It is the longest river in Africa, and it flows north into the sea. Long ago, the Nile flooded every summer. When the water went down, it left behind rich black soil on the fields. Egyptian farmers planted wheat and flax in this soil and grew plenty of food. Without the river, Egypt would have been only desert.",
  },
  {
    task: "Write a paragraph of facts about the pyramids of Egypt, using these notes.",
    source:
      "- tombs for kings\n- built of huge stone blocks\n- workers dragged blocks on sleds\n- Great Pyramid took about 20 years\n- still standing after 4,500 years",
    model:
      "The pyramids of Egypt are some of the oldest buildings in the world. They were made as tombs for Egypt's kings. Workers cut huge blocks of stone and pulled them on wooden sleds to the building site. Building the Great Pyramid took about twenty years. Even after 4,500 years, the pyramids are still standing, and people from around the world come to see them.",
  },
  {
    task: "Write a paragraph of facts about frogs, using these notes.",
    source:
      "- start life as eggs in water\n- tadpoles have tails and gills\n- grow legs, lose tails\n- adults breathe air\n- catch insects with sticky tongues",
    model:
      "Frogs change a great deal as they grow. A frog starts life as a tiny egg in a pond. The egg hatches into a tadpole, which has a tail and breathes through gills like a fish. Slowly the tadpole grows legs and loses its tail. The grown frog breathes air and catches insects with its long, sticky tongue. From egg to adult, a frog lives two very different lives.",
  },
  {
    task: "Write a paragraph of facts about thunderstorms, using these notes.",
    source:
      "- form in tall dark clouds\n- lightning is a giant spark\n- lightning heats the air, makes thunder\n- see lightning before hearing thunder\n- stay indoors to be safe",
    model:
      "Thunderstorms are powerful storms that form in tall, dark clouds. Lightning is a giant spark of electricity that jumps through the sky. It heats the air so fast that the air bursts outward, and that makes the sound of thunder. Light travels faster than sound, so we see the flash before we hear the boom. The safest place to be during a thunderstorm is inside a building.",
  },
  {
    task: "Write a paragraph of facts about magnets, using these notes.",
    source:
      "- pull iron and steel\n- do not pull wood, paper or plastic\n- two poles, north and south\n- opposite poles attract\n- same poles push apart",
    model:
      "Magnets can pull on some things without even touching them. A magnet pulls objects made of iron or steel, such as nails and paper clips, but it does not pull wood, paper or plastic. Every magnet has two ends called poles, a north pole and a south pole. When you hold two magnets together, opposite poles pull toward each other, but the same poles push apart. That is why a magnet can stick to another magnet one way but not the other.",
  },
  {
    task: "Write a paragraph of facts about the Great Wall of China, using these notes.",
    source:
      "- built to keep out invaders from the north\n- made of earth, stone and brick\n- watchtowers along the top\n- guards lit fires to send signals\n- thousands of miles long",
    model:
      "The Great Wall of China is one of the longest walls ever built. It was made to keep out invaders who came from the north. Workers built it from earth, stone and brick, and it stretches for thousands of miles. Watchtowers stand along the top of the wall. When guards saw an enemy coming, they lit fires on the towers to warn the soldiers farther along.",
  },
  {
    task: "Write a paragraph of facts about penguins, using these notes.",
    source:
      "- birds that cannot fly\n- strong swimmers, wings like flippers\n- thick feathers and fat keep warm\n- most live in the far south\n- eat fish and krill",
    model:
      "Penguins are birds, but they cannot fly. Instead, they use their wings like flippers and are very strong swimmers. Most penguins live in the cold lands of the far south. A thick coat of feathers and a layer of fat keep them warm in the icy water. Penguins dive deep to catch fish and tiny shrimp called krill. They may look clumsy on land, but in the sea they are fast and graceful.",
  },
  {
    task: "Write a paragraph of facts about the violin, using these notes.",
    source: "- string instrument\n- four strings\n- played with a bow\n- player presses strings to change notes\n- high, singing sound",
    model:
      "The violin is a small string instrument with a beautiful voice. It has four strings stretched along a wooden body. A player pulls a bow across the strings to make them shake and sing. To play different notes, the player presses the strings with the fingers of the other hand. The violin has a high, bright sound, and it often plays the melody in an orchestra.",
  },
  {
    task: "Write a paragraph of facts about the seasons, using these notes.",
    source:
      "- four seasons: spring, summer, autumn, winter\n- Earth is tilted\n- side tilted toward the Sun has summer\n- longer days in summer\n- shorter, colder days in winter",
    model:
      "We have four seasons because of the way Earth leans. Earth is tilted, so as it travels around the Sun, first one half and then the other leans toward the Sun. The half that leans toward the Sun has summer, with long, warm days. The half that leans away has winter, with short, cold days. Spring and autumn come in between, as the lean slowly changes.",
  },
  {
    task: "Write a paragraph of facts about silk, using these notes.",
    source:
      "- made by silkworms\n- silkworms eat mulberry leaves\n- spin a cocoon of one long thread\n- first made in China long ago\n- traded along the Silk Road",
    model:
      "Silk is a soft, shiny cloth that comes from a caterpillar. Silkworms eat nothing but mulberry leaves. When a silkworm is ready to change, it spins a cocoon from one very long thread. People in ancient China learned to unwind these threads and weave them into cloth. For a long time, only China knew how to make silk, and traders carried it far to the west along the Silk Road.",
  },
];

const fableBank: readonly WritingItem[] = [
  {
    task: "Write a fable about a proud animal who learns to be humble. End with the moral in one sentence.",
    model:
      'In a green meadow lived a rabbit who boasted that he had the longest ears in the land. "I can hear everything," he told the field mice, "so I never need your help." One day he was so busy admiring his ears in a puddle that he did not hear a fox creeping through the grass. The field mice squeaked a warning, and the rabbit leaped away just in time. Shaking, he thanked the mice and never boasted again. Moral: Even the proudest need help from others.',
  },
  {
    task: "Write a fable about a greedy animal who wants more than it needs. End with the moral in one sentence.",
    model:
      'A squirrel in an oak forest found a tree heavy with nuts. Instead of taking what she needed, she stuffed her cheeks, her nest and every hole in the tree until she could barely move. When a hungry chipmunk asked for one nut, she shouted, "These are all mine!" That night the branch holding her nest cracked under the weight, and all the nuts fell into the river. The next morning the chipmunk shared his small store with her. Moral: Greed can make you lose everything you have.',
  },
  {
    task: "Write a fable about a small animal who uses its brain to beat a bigger one. End with the moral in one sentence.",
    model:
      'By a pond in the jungle, a tiny frog was caught by a hungry snake. "Wait," said the frog. "I am too small to fill you up, but my big brother lives under that log." The greedy snake let the frog go and slid under the log, where it found only a sleeping wasp\'s nest. The wasps chased the snake away, and the frog laughed from his lily pad. Moral: A clever mind is stronger than a big body.',
  },
  {
    task: "Write a fable about two animal friends who quarrel and learn to work together. End with the moral in one sentence.",
    model:
      'A goat and a sheep found a field of sweet grass on the far side of a narrow bridge. Each wanted to cross first, so they pushed and butted in the middle of the bridge until both nearly fell into the river. Then the sheep had an idea. "Let me lie down," she said, "and you can step over me." The goat crossed, and then he held the gate open for her. They ate side by side all afternoon. Moral: Working together gets you farther than fighting.',
  },
  {
    task: "Write a fable about a lazy animal and a hard-working one. End with the moral in one sentence.",
    model:
      "All summer a beaver worked on his dam, cutting branches and packing mud, while a raccoon napped in the sun and laughed at him. \"Why work so hard when the days are warm?\" asked the raccoon. When autumn rains came, the river rose and washed the raccoon's den away. Cold and wet, he knocked at the beaver's lodge. The beaver let him in, and the next spring the raccoon helped build the dam. Moral: Prepare today for the needs of tomorrow.",
  },
  {
    task: "Write a fable about an animal who tells lies and is not believed when it tells the truth. End with the moral in one sentence.",
    model:
      'A young parrot in the forest loved to play tricks. Three times she screamed, "Snake! Snake!" and laughed as the monkeys scrambled up the trees. On the fourth day a real snake slid toward her nest. She screamed as loudly as she could, but the monkeys only rolled their eyes and kept eating. The parrot had to flap away and leave her nest behind. From then on she spoke only the truth. Moral: A liar is not believed even when she tells the truth.',
  },
  {
    task: "Write a fable about an animal who is unhappy with how it looks and learns to value itself. End with the moral in one sentence.",
    model:
      'A brown sparrow sat on a fence and wished she had the bright feathers of the peacock in the garden. "I am so plain," she sighed. One morning a hawk circled over the garden. The peacock\'s shining tail flashed in the sun, and the hawk dived straight at him. The sparrow called a warning and hid in the brown hedge, where the hawk could not see her at all. That evening she fluffed her feathers proudly. Moral: Be glad of what you are, for it may be your greatest gift.',
  },
  {
    task: "Write a fable about a fast animal and a slow but steady one. End with the moral in one sentence.",
    model:
      "A hummingbird and a snail both wanted to reach the flowers at the top of a tall hill. The hummingbird zipped away and stopped at every flower on the way to drink and show off. By noon she was so full and sleepy that she dozed on a branch. The snail kept sliding upward, never stopping. When the hummingbird woke at sunset, the snail was already resting among the flowers at the top. Moral: Slow and steady work wins in the end.",
  },
  {
    task: "Write a fable about an animal who helps another and is helped in return. End with the moral in one sentence.",
    model:
      'On a riverbank, a turtle saw a little bird with its foot caught in a fishing line. The turtle chewed slowly through the line until the bird was free. "I will not forget you," chirped the bird. Weeks later the turtle was flipped onto his back by a falling branch and could not turn over. The bird saw him, called her flock, and together they pushed him back onto his feet. Moral: One good turn deserves another.',
  },
  {
    task: "Write a fable about an animal who will not listen to good advice. End with the moral in one sentence.",
    model:
      'An old owl warned a young mouse, "Do not play in the barn at night. The cat hunts there." The mouse twitched his whiskers and said, "I am too quick for any cat." That night he raced into the barn to find grain. Two green eyes shone in the dark, and the mouse escaped only by squeezing under a door, leaving the tip of his tail behind. The next day he flew to the owl and thanked her for her warning. Moral: Listen to those who are wiser than you.',
  },
  {
    task: "Write a fable about an animal who shares and an animal who will not. End with the moral in one sentence.",
    model:
      "Two bears found two beehives full of honey at the edge of the woods. The first bear ate all of his honey alone and growled at anyone who came near. The second bear shared hers with the birds and the badgers. When winter came, the first bear was hungry and had no friends to help him. The badgers brought the second bear roots, and the birds showed her where to find berries under the snow. Moral: Those who share are never alone.",
  },
  {
    task: "Write a fable about a boastful animal who is tricked because of its pride. End with the moral in one sentence.",
    model:
      'A rooster stood on a fence and crowed that his voice was the finest on the farm. A fox heard him and called up, "Your voice is lovely, but can you sing with your eyes closed, like your father did?" The proud rooster shut his eyes and crowed his loudest. At once the fox grabbed him by the wing. "Sing for me as you run," the rooster gasped, and when the fox opened his mouth to laugh, the rooster flew to the barn roof. Moral: Do not let praise make you careless.',
  },
];

const answerBank: readonly WritingItem[] = [
  {
    task: "Read the passage and answer this question in two or three complete sentences: Why do camels have long eyelashes?",
    source:
      "Camels live in hot deserts where strong winds blow sand through the air. A camel has two rows of long eyelashes on each eye. The lashes catch the blowing sand and keep it out of the camel's eyes. Camels can also close their nostrils to keep the sand out of their noses.",
    model:
      "Camels have long eyelashes to keep sand out of their eyes. In the desert, strong winds blow sand through the air. The camel's two rows of long lashes catch the sand before it gets in.",
  },
  {
    task: "Read the passage and answer this question in two or three complete sentences: How did the Nile help farmers in ancient Egypt?",
    source:
      "In ancient Egypt, the Nile River flooded every summer. When the water went down, it left a layer of rich black mud on the fields. Farmers planted wheat and barley in the mud. Because the soil was so rich, they could grow enough food for the whole country.",
    model:
      "The Nile helped farmers in ancient Egypt by leaving rich soil on their fields. Every summer the river flooded, and when the water went down it left black mud behind. Farmers planted wheat and barley in it and grew enough food for the whole country.",
  },
  {
    task: "Read the passage and answer this question in two or three complete sentences: Why do bears sleep through the winter?",
    source:
      "In winter, snow covers the ground and there is very little food for bears to find. In the autumn, a bear eats as much as it can and grows fat. Then it crawls into a den and sleeps for months. While it sleeps, its body uses the fat for energy, so it does not need to eat.",
    model:
      "Bears sleep through the winter because there is very little food for them to find. Snow covers the ground, so instead of searching for food, a bear sleeps in its den. Its body uses the fat it stored in the autumn for energy.",
  },
  {
    task: "Read the passage and answer this question in two or three complete sentences: What do watchtowers on the Great Wall do?",
    source:
      "The Great Wall of China has thousands of watchtowers along its top. Soldiers lived in the towers and watched the land beyond the wall. When they saw invaders coming, they lit a fire on the tower. The guards in the next tower saw the smoke and lit their own fire, and the warning traveled quickly along the wall.",
    model:
      "Watchtowers on the Great Wall let soldiers watch for invaders and send warnings. When soldiers saw invaders coming, they lit a fire on their tower. The guards in the next tower saw the smoke and lit a fire too, so the warning traveled quickly.",
  },
  {
    task: "Read the passage and answer this question in two or three complete sentences: Why does a ball roll farther on a wood floor than on a carpet?",
    source:
      "When a ball rolls, it rubs against the ground. This rubbing is called friction, and it slows the ball down. A carpet is rough and soft, so it rubs against the ball a lot. A wood floor is smooth and hard, so there is much less friction. That is why a ball keeps rolling for a long time on wood.",
    model:
      "A ball rolls farther on a wood floor because there is less friction. A wood floor is smooth and hard, so it does not rub against the ball much. A carpet is rough and soft, so it slows the ball down quickly.",
  },
  {
    task: "Read the passage and answer this question in two or three complete sentences: How does a magnet pick up a paper clip?",
    source:
      "A magnet has an invisible pull around it called a magnetic field. When a paper clip made of steel comes into the field, the magnet pulls it close. The pull is strongest at the two ends of the magnet, called the poles. A magnet cannot pick up a paper clip made of plastic, because plastic is not pulled by magnets.",
    model:
      "A magnet picks up a paper clip by pulling on it with its magnetic field. When a steel paper clip comes into the invisible field, the magnet pulls it close. The pull is strongest at the magnet's poles.",
  },
  {
    task: "Read the passage and answer this question in two or three complete sentences: How does a drum make its sound?",
    source:
      "A drum has a thin skin stretched tightly over a hollow body. When a player hits the skin, it shakes very fast. These shakes are called vibrations. The vibrations travel through the air to our ears, and we hear a sound. A big drum makes a deep sound, and a small drum makes a higher one.",
    model:
      "A drum makes its sound when its skin vibrates. When a player hits the tight skin, it shakes very fast. Those vibrations travel through the air to our ears, and we hear the beat.",
  },
  {
    task: "Read the passage and answer this question in two or three complete sentences: Why did people in ancient China want silk?",
    source:
      "Silk was first made in China thousands of years ago. It came from the threads of silkworm cocoons. Silk cloth was soft, light and shiny, and it kept people cool in summer and warm in winter. It was also very hard to make, so it was precious. Kings and nobles wore silk to show how rich they were.",
    model:
      "People in ancient China wanted silk because it was soft, light and shiny. It kept people cool in summer and warm in winter. Silk was also hard to make, so kings and nobles wore it to show they were rich.",
  },
  {
    task: "Read the passage and answer this question in two or three complete sentences: What do plants need to grow?",
    source:
      "Plants need four things to grow. They need sunlight, which gives them energy to make food. They need water, which they take in through their roots. They need air, and they need soil that holds the roots in place and gives them minerals. Without any one of these, a plant will wilt.",
    model:
      "Plants need sunlight, water, air and soil to grow. Sunlight gives them the energy to make their food. They take in water through their roots, and the soil holds the roots in place.",
  },
  {
    task: "Read the passage and answer this question in two or three complete sentences: Why does the moon seem to shine at night?",
    source:
      "The moon does not make its own light. Instead, sunlight shines on the moon and bounces off its rocky surface. Some of this light travels to Earth, so the moon looks bright in the dark sky. The moon seems to change shape because we see different amounts of its sunny side as it travels around Earth.",
    model:
      "The moon seems to shine because sunlight bounces off it. The moon does not make its own light. Sunlight hits its rocky surface, and some of that light travels to Earth, so it looks bright at night.",
  },
  {
    task: "Read the passage and answer this question in two or three complete sentences: How do bees help flowers?",
    source:
      "Bees visit flowers to drink a sweet juice called nectar. While a bee drinks, yellow dust called pollen sticks to its fuzzy body. When the bee flies to the next flower, some of the pollen falls off. Flowers need pollen from other flowers to make seeds, so bees help new plants grow.",
    model:
      "Bees help flowers by carrying pollen from one flower to another. When a bee drinks nectar, pollen sticks to its fuzzy body. Some of it falls off at the next flower, and that helps the flower make seeds.",
  },
  {
    task: "Read the passage and answer this question in two or three complete sentences: Why do people use maps?",
    source:
      "A map is a drawing of a place as it looks from above. People use maps to find their way and to plan a trip. A map key shows what the symbols on the map mean, such as a tree for a park or a blue line for a river. A compass rose shows which way is north, south, east and west.",
    model:
      "People use maps to find their way and to plan trips. A map shows a place as it looks from above. Its key explains the symbols, such as a blue line for a river, so people know what they will find.",
  },
];

const poemBank: readonly WritingItem[] = [
  {
    task: "Write a poem of six to ten lines about winter. Use pictures for at least two senses, and repeat a word or a line, or use rhyme.",
    model:
      "Winter is a white blanket,\nsoft on the sleeping hill.\nWinter is a sharp wind\nthat whistles at my window sill.\nWinter is the crunch of boots\nand cocoa, sweet and hot.\nWinter is the quiet snow\nthat hides the garden plot.",
  },
  {
    task: "Write a poem of six to ten lines about spring. Use pictures for at least two senses, and repeat a word or a line, or use rhyme.",
    model:
      "In spring the rain taps on the roof,\nin spring the puddles shine,\nin spring the robins sing at dawn\nfrom every branch of pine.\nIn spring the grass smells fresh and wet,\nthe tulips push up red,\nand spring wakes every sleepy seed\nin every garden bed.",
  },
  {
    task: "Write a poem of six to ten lines about summer. Use pictures for at least two senses, and repeat a word or a line, or use rhyme.",
    model:
      "Hot sand burns my bare feet,\nwaves crash and fizz and roar.\nI taste the salty ocean spray\nand run along the shore.\nHot sun glows on my shoulders,\ncold ice cream drips on my hand.\nSummer, summer, stay with me\nhere on the golden sand.",
  },
  {
    task: "Write a poem of six to ten lines about autumn. Use pictures for at least two senses, and repeat a word or a line, or use rhyme.",
    model:
      "Leaves fall red, leaves fall gold,\nthey crackle under my feet.\nThe air smells of smoke and apples,\ncrisp and cool and sweet.\nLeaves fall slow, leaves fall fast,\nthey dance on the windy street.\nI jump into the biggest pile,\nand autumn is complete.",
  },
  {
    task: "Write a poem of six to ten lines about the first snow of winter. Use pictures for at least two senses, and repeat a word or a line, or use rhyme.",
    model:
      "Quiet, the first snow comes down,\nfeathers drifting on the town.\nQuiet, it lands upon my tongue,\ncold as a bell that has not rung.\nQuiet, it hushes every street,\nsoft and squeaky under feet.\nI hold my breath and watch it fall,\nthe quietest snow of all.",
  },
  {
    task: "Write a poem of six to ten lines about a rainy day in spring. Use pictures for at least two senses, and repeat a word or a line, or use rhyme.",
    model:
      "Pitter-patter on the glass,\npuddles growing in the grass.\nPitter-patter, worms come out,\nwiggling slowly all about.\nThe air smells green and new and clean,\nthe dripping leaves are bright and green.\nPitter-patter, splash and play,\nI love a rainy springtime day.",
  },
  {
    task: "Write a poem of six to ten lines about a hot summer night. Use pictures for at least two senses, and repeat a word or a line, or use rhyme.",
    model:
      "On a summer night the crickets sing,\non a summer night the fireflies glow,\nthey blink like tiny lanterns\nover the grass below.\nOn a summer night the air is warm\nand smells of cut green hay.\nI lie awake and listen\nuntil the sky turns gray.",
  },
  {
    task: "Write a poem of six to ten lines about an autumn wind. Use pictures for at least two senses, and repeat a word or a line, or use rhyme.",
    model:
      "The autumn wind goes whoosh, whoosh,\nit rattles every door.\nIt tugs my scarf and steals my hat\nand sweeps leaves across the floor.\nThe autumn wind goes whoosh, whoosh,\nit's cold upon my nose.\nIt howls all night around the house,\nand off at dawn it goes.",
  },
  {
    task: "Write a poem of six to ten lines about a winter morning. Use pictures for at least two senses, and repeat a word or a line, or use rhyme.",
    model:
      "Frost on the window, white and lacy,\nfrost on the grass, so crisp and bright.\nMy breath puffs out like little clouds\nin the cold blue morning light.\nThe toast smells warm, the kettle sings,\nmy mittens wait beside the door.\nFrost on the window, frost outside,\nwinter morning, I want more.",
  },
  {
    task: "Write a poem of six to ten lines about flowers in spring. Use pictures for at least two senses, and repeat a word or a line, or use rhyme.",
    model:
      "Yellow daffodils nod hello,\npurple crocus peeking through.\nPink blossoms float down from the trees,\nsoft as feathers, wet with dew.\nI smell the lilacs by the gate,\nI hear the buzzing of the bees.\nSpring is painting all the world\nin colors bright as these.",
  },
  {
    task: "Write a poem of six to ten lines about a day at the beach in summer. Use pictures for at least two senses, and repeat a word or a line, or use rhyme.",
    model:
      "Splash! go the waves on the shore,\nsplash! go my feet in the sea.\nSeagulls cry and swoop and dive\nabove my sister and me.\nThe sand is warm, the water cold,\nthe air tastes salty and wet.\nSplash! goes the very last wave,\nthe best summer day yet.",
  },
  {
    task: "Write a poem of six to ten lines about apple picking in autumn. Use pictures for at least two senses, and repeat a word or a line, or use rhyme.",
    model:
      "Up the ladder, reach and pick,\nred apples, round and bright.\nI bite one and the juice runs out,\nsweet and cold, a crunchy bite.\nUp the ladder, reach and pick,\nthe basket fills up high.\nThe orchard smells of apples\nunder the autumn sky.",
  },
];

/** writingJudgedTopics are the grade 3 writing topics judged by a model. */
export const writingJudgedTopics: readonly TopicDef[] = [
  {
    id: "writing-a-friendly-letter",
    title: t("Writing a Friendly Letter", "写一封书信"),
    summary: t(
      "Write a letter to a friend or relative about a place you know, with all its parts, a clear reason and details that help the reader picture the place.",
      "给朋友或亲戚写一封信，介绍你熟悉的一个地方，要有书信的各个部分、明确的写信目的，以及帮助读者想象这个地方的细节。",
    ),
    prerequisites: ["parts-of-a-friendly-letter", "writing-a-paragraph"],
    encompasses: [{ topic: "parts-of-a-friendly-letter", weight: 0.3 }],
    xp: 22,
    strand: "writing",
    criteria: ["g3-letter-parts", "g3-letter-purpose", "w4-gives-detail"].map(criterion),
    knowledgePoints: [
      point(
        "a-letter-with-all-its-parts",
        t("A Letter with All Its Parts", "各部分齐全的书信"),
        t(
          "A friendly letter has five parts, always in the same order. The **date** goes at the top. The **greeting**, such as *Dear Sofia,*, names the reader. The **body** says what you want to tell. The **closing**, such as *Love,* or *Your friend,*, says goodbye, and your **signature**, your name, goes last.\n\nA letter also has a **reason**: here, to tell the reader about a place you know. Keep the body on that reason from start to finish.",
          "书信有五个部分，顺序总是一样的。**日期**写在最上面。**称呼**（比如 *Dear Sofia,*）说出收信人。**正文**写你想告诉对方的事。**结束语**（比如 *Love,* 或 *Your friend,*）用来告别，最后是你的**签名**，也就是你的名字。\n\n书信还有一个**目的**：这里是向收信人介绍你熟悉的一个地方。正文从头到尾都要围绕这个目的。",
        ),
        writingGenerator(
          t(
            "Write a friendly letter in English with a date, a greeting, a body, a closing and a signature.",
            "用英语写一封书信，要有日期、称呼、正文、结束语和签名。",
          ),
          letterBank,
          ["g3-letter-parts", "g3-letter-purpose"],
          { minWords: 50, maxChars: 1800 },
          onePiece,
        ),
      ),
      point(
        "helping-the-reader-picture-it",
        t("Helping the Reader Picture It", "帮助读者想象"),
        t(
          "Your reader has never seen the place, so **details** must show it. Say what is there and what it looks, sounds or smells like: *a round pond with ducks*, *cherry trees that turn pink in spring*. Then tell what you do there.\n\nA letter that only says *the park is nice* gives the reader nothing to picture. Choose two or three details that make the place different from every other place.",
          "收信人从来没见过这个地方，所以要用**细节**把它展现出来。说出那里有什么，它看起来、听起来或闻起来是什么样的：*a round pond with ducks*、*cherry trees that turn pink in spring*。再说说你在那里做什么。\n\n只写 *the park is nice* 的信，什么画面也没有给读者。挑选两三个细节，让这个地方和别的地方都不一样。",
        ),
        writingGenerator(
          t(
            "Write a friendly letter in English about a place you know. Give details that help your reader picture it.",
            "用英语写一封书信，介绍你熟悉的一个地方。写出帮助收信人想象它的细节。",
          ),
          letterBank,
          ["w4-gives-detail", "g3-letter-purpose"],
          { minWords: 50, maxChars: 1800 },
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-a-fact-paragraph",
    title: t("Writing a Paragraph of Facts", "写一段介绍事实的段落"),
    summary: t(
      "Write a paragraph that teaches facts from a set of notes: a topic sentence, the facts in your own words, and a closing.",
      "根据一组笔记写一段介绍事实的段落：一个主题句，用自己的话写出的事实，以及一个结尾句。",
    ),
    prerequisites: ["writing-a-paragraph", "taking-notes-from-a-text", "grouping-related-facts"],
    encompasses: [{ topic: "taking-notes-from-a-text", weight: 0.3 }],
    xp: 22,
    strand: "writing",
    criteria: ["w4-topic-sentence", "g3-facts-from-notes", "w4-supports-point", "w4-concludes"].map(criterion),
    knowledgePoints: [
      point(
        "from-notes-to-sentences",
        t("From Notes to Sentences", "从笔记到句子"),
        t(
          "Notes keep facts in a few words: *hump stores fat, not water*. A paragraph turns each note into a **whole sentence** of your own: *A camel's hump is full of fat, not water.*\n\nStart with a **topic sentence** that tells what the whole paragraph is about, such as *Camels are built for life in hot deserts.* Then use the notes, and only facts that the notes give.",
          "笔记用几个词记下事实：*hump stores fat, not water*。段落要把每条笔记变成你自己的**完整句子**：*A camel's hump is full of fat, not water.*\n\n先写一个**主题句**，说明整段写的是什么，比如 *Camels are built for life in hot deserts.* 然后使用笔记里的内容，只写笔记给出的事实。",
        ),
        writingGenerator(
          t(
            "Read the notes and write a paragraph of facts in English. Begin with a topic sentence.",
            "阅读笔记，用英语写一段介绍事实的段落。以主题句开头。",
          ),
          notesBank,
          ["w4-topic-sentence", "g3-facts-from-notes"],
          { minWords: 45, maxChars: 1500 },
          onePiece,
        ),
      ),
      point(
        "facts-that-support-and-a-closing",
        t("Facts That Support, and a Closing", "支持要点的事实和结尾"),
        t(
          "Every fact in the paragraph should **support** the topic sentence. Group facts that go together, such as the parts of a camel that keep out sand, and put them next to each other.\n\nEnd with a **closing sentence** that sums up the point in new words: *All of these parts help camels survive where few other animals can.*",
          "段落里的每个事实都要**支持**主题句。把相关的事实放在一起，比如骆驼身上防沙的部位，要一个挨着一个写。\n\n最后用一个**结尾句**，换个说法总结要点：*All of these parts help camels survive where few other animals can.*",
        ),
        writingGenerator(
          t(
            "Read the notes and write a paragraph of facts in English. Make every fact support your point, and end with a closing sentence.",
            "阅读笔记，用英语写一段介绍事实的段落。让每个事实都支持你的要点，并以结尾句收尾。",
          ),
          notesBank,
          ["w4-supports-point", "w4-concludes", "g3-facts-from-notes"],
          { minWords: 45, maxChars: 1500 },
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-a-fable",
    title: t("Writing a Fable", "写一则寓言"),
    summary: t(
      "Write a short fable with animal characters: an opening, a problem, a choice that shows each character's nature, an ending and a moral in one sentence.",
      "写一则以动物为角色的短寓言：要有开头、问题、能表现每个角色性格的选择、结尾，以及一句话的寓意。",
    ),
    prerequisites: ["writing-a-paragraph", "lesson-of-a-story", "choosing-a-story-opening"],
    encompasses: [{ topic: "choosing-a-story-opening", weight: 0.2 }],
    xp: 22,
    strand: "writing",
    criteria: ["g3-fable-characters", "g3-fable-problem", "g35-narrative-ending", "g3-fable-moral"].map(criterion),
    knowledgePoints: [
      point(
        "characters-and-a-problem",
        t("Characters and a Problem", "角色和问题"),
        t(
          "A **fable** is a short story with **animal characters** who act like people. Each main character has one strong quality that shows in what it does: a proud rabbit boasts, a greedy squirrel takes everything.\n\nThe opening tells who and where, and soon a **problem** comes: a danger, a quarrel or a choice. The character's quality decides what it does about the problem.",
          "**寓言**是一种短故事，里面的**动物角色**像人一样行事。每个主要角色都有一个鲜明的特点，从它的行为中表现出来：骄傲的兔子爱吹牛，贪心的松鼠什么都想要。\n\n开头说出是谁、在哪里，很快就出现一个**问题**：一个危险、一场争吵或者一个选择。角色的特点决定了它怎样应对这个问题。",
        ),
        writingGenerator(
          t(
            "Write a fable in English with animal characters. Show what each character is like in what it does, and give it a clear problem.",
            "用英语写一则以动物为角色的寓言。通过角色的行为表现它的特点，并给它一个明确的问题。",
          ),
          fableBank,
          ["g3-fable-characters", "g3-fable-problem"],
          { minWords: 60, maxChars: 1800 },
          onePiece,
        ),
      ),
      point(
        "an-ending-and-a-moral",
        t("An Ending and a Moral", "结尾和寓意"),
        t(
          "A fable ends when the problem is settled, and the ending usually shows a character learning something: the proud rabbit is saved by the mice he laughed at.\n\nThen comes the **moral**, the lesson, in one sentence: *Moral: Even the proudest need help from others.* The moral must fit what happened. If the story shows that sharing pays, the moral cannot be about being brave.",
          "问题解决时寓言就结束了，结尾通常会表现某个角色学到了什么：骄傲的兔子被他嘲笑过的老鼠救了。\n\n接着是**寓意**，也就是一句话的道理：*Moral: Even the proudest need help from others.* 寓意必须符合故事里发生的事。如果故事说明分享有好处，寓意就不能是关于勇敢的。",
        ),
        writingGenerator(
          t(
            "Write a fable in English with animal characters. Bring the problem to an end, and finish with the moral in one sentence.",
            "用英语写一则以动物为角色的寓言。让问题得到解决，最后用一句话写出寓意。",
          ),
          fableBank,
          ["g35-narrative-ending", "g3-fable-moral"],
          { minWords: 60, maxChars: 1800 },
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "answering-a-question-in-sentences",
    title: t("Answering a Question in Sentences", "用完整的句子回答问题"),
    summary: t(
      "Answer a question about a passage in two or three complete sentences: turn the question into the start of the answer, answer it correctly and give a detail from the passage.",
      "用两三个完整的句子回答关于一段文字的问题：把问题变成答案的开头，正确地回答，并给出文中的一个细节。",
    ),
    prerequisites: ["answering-questions-from-the-text", "complete-sentences-and-fragments"],
    encompasses: [{ topic: "answering-questions-from-the-text", weight: 0.3 }],
    xp: 22,
    strand: "writing",
    criteria: ["g3-answer-restates", "g3-answer-correct", "g3-answer-detail"].map(criterion),
    knowledgePoints: [
      point(
        "turning-the-question-around",
        t("Turning the Question Around", "把问题变成答案"),
        t(
          "A good written answer starts by **turning the question into a sentence**. For *Why do camels have long eyelashes?* begin: *Camels have long eyelashes to …* A reader then knows what the answer is about without seeing the question.\n\nThen answer what was asked, using the passage. A sentence that is true but answers a different question does not count.",
          "好的书面回答一开头就**把问题变成句子**。对于 *Why do camels have long eyelashes?*，可以这样开头：*Camels have long eyelashes to …* 这样，读者不看问题也知道答案在讲什么。\n\n然后根据文章回答所问的问题。一句话即使是真的，如果回答的是别的问题，也不算数。",
        ),
        writingGenerator(
          t(
            "Read the passage and answer the question in English, in two or three complete sentences. Begin by turning the question into a sentence.",
            "阅读这段文字，用两三个完整的英语句子回答问题。开头先把问题变成一个句子。",
          ),
          answerBank,
          ["g3-answer-restates", "g3-answer-correct"],
          { minWords: 20, maxChars: 900 },
          onePiece,
        ),
      ),
      point(
        "backing-the-answer-with-a-detail",
        t("Backing the Answer with a Detail", "用细节支持答案"),
        t(
          "After the answer, give **a detail from the passage** that shows it is right. If the answer is that camels' lashes keep out sand, the detail might be that *strong winds blow sand through the air*.\n\nThe detail must come from the passage, not from what you guess, and it must support the answer you gave.",
          "回答之后，给出**文中的一个细节**来说明答案是对的。如果答案是骆驼的睫毛能挡住沙子，细节可以是 *strong winds blow sand through the air*。\n\n细节必须来自文章，而不是你的猜测，而且必须支持你给出的答案。",
        ),
        writingGenerator(
          t(
            "Read the passage and answer the question in English, in two or three complete sentences. Give one detail from the passage that supports your answer.",
            "阅读这段文字，用两三个完整的英语句子回答问题。给出文中的一个细节来支持你的答案。",
          ),
          answerBank,
          ["g3-answer-correct", "g3-answer-detail"],
          { minWords: 20, maxChars: 900 },
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-a-seasons-poem",
    title: t("Writing a Poem About a Season", "写一首关于季节的诗"),
    summary: t(
      "Write a poem of six to ten lines about a season, with pictures for at least two senses and a pattern of repetition or rhyme.",
      "写一首六到十行的诗，描写一个季节，至少写出两种感官的画面，并用重复或押韵形成规律。",
    ),
    prerequisites: ["what-a-poem-is-about", "strong-verbs"],
    encompasses: [{ topic: "strong-verbs", weight: 0.2 }],
    xp: 22,
    strand: "writing",
    criteria: ["g3-poem-subject", "g35-describe-senses", "g3-poem-pattern"].map(criterion),
    knowledgePoints: [
      point(
        "pictures-for-the-senses",
        t("Pictures for the Senses", "感官的画面"),
        t(
          "A poem about a season paints **pictures in words**. Choose things that belong to that season only: snow and cocoa for winter, hot sand and ice cream for summer.\n\nUse at least **two senses**. Besides what you see, tell what you hear (*the wind whistles*), feel (*hot sand burns my feet*), smell or taste. Strong verbs such as *crackle* and *drip* make the pictures sharper.",
          "写季节的诗是用**文字描绘画面**。选择只属于那个季节的事物：冬天的雪和热可可，夏天的热沙和冰淇淋。\n\n至少用上**两种感官**。除了看到的，还要写听到的（*the wind whistles*）、感觉到的（*hot sand burns my feet*）、闻到的或尝到的。像 *crackle* 和 *drip* 这样生动的动词能让画面更鲜明。",
        ),
        writingGenerator(
          t(
            "Write a poem in English about a season. Use pictures for at least two senses.",
            "用英语写一首关于季节的诗。至少写出两种感官的画面。",
          ),
          poemBank,
          ["g3-poem-subject", "g35-describe-senses"],
          { minWords: 30, maxChars: 1000 },
          onePiece,
        ),
      ),
      point(
        "a-pattern-of-lines",
        t("A Pattern of Lines", "诗行的规律"),
        t(
          "A poem is written in **lines**, not in a paragraph; start a new line where you want the reader to pause. Six to ten short lines are enough.\n\nGive the lines a **pattern**. You can repeat a word or a line, as in *Winter is a white blanket … Winter is a sharp wind*, or make the ends of lines rhyme, as in *hill* and *sill*.",
          "诗是一行一行写的，而不是写成一段；在想让读者停顿的地方另起一行。六到十个短行就够了。\n\n让诗行有**规律**。你可以重复一个词或一行，比如 *Winter is a white blanket … Winter is a sharp wind*；也可以让行尾押韵，比如 *hill* 和 *sill*。",
        ),
        writingGenerator(
          t(
            "Write a poem of six to ten lines in English about a season. Repeat a word or a line, or use rhyme.",
            "用英语写一首六到十行的诗，描写一个季节。重复一个词或一行，或者使用押韵。",
          ),
          poemBank,
          ["g3-poem-pattern", "g3-poem-subject"],
          { minWords: 30, maxChars: 1000 },
          onePiece,
        ),
      ),
    ],
  },
];
