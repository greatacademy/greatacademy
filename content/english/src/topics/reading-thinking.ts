// Reading: thinking about a text, from inferences and the author's purpose to characters, lessons and figurative language.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point } from "@ga/subject-english";

const inferenceBank: readonly ChoiceItem[] = [
  [
    "Mia shook the water off her umbrella and left her muddy boots by the door.",
    "It was raining outside.",
    ["Mia had been swimming.", "Mia bought new boots."],
  ],
  [
    "Carlos stared at the clock, tapped his foot and checked the door every few seconds.",
    "Carlos was waiting for someone and growing impatient.",
    ["Carlos was asleep.", "Carlos was fixing the clock."],
  ],
  [
    "The cookies were gone, the jar lid was on the floor, and the dog had crumbs on its nose.",
    "The dog ate the cookies.",
    ["The cookies were never baked.", "Someone gave the cookies away."],
  ],
  [
    "When the teacher handed back the tests, Priya smiled, hugged her paper and ran to show her friend.",
    "Priya did well on her test.",
    ["Priya failed her test.", "Priya lost her test."],
  ],
  [
    "The leaves had turned red and gold, and Grandpa pulled on his thick sweater before going out to rake.",
    "It was autumn and cool outside.",
    ["It was the middle of summer.", "Grandpa was going swimming."],
  ],
  [
    "The stadium lights were on, the crowd was roaring, and both teams ran onto the field.",
    "A game was about to begin.",
    ["The stadium was closed.", "The game had already ended."],
  ],
  [
    "Leo yawned, rubbed his eyes and read the same page three times.",
    "Leo was very tired.",
    ["Leo was excited about the book.", "Leo had just woken up refreshed."],
  ],
  [
    "The baby's face was red, she pushed the spoon away and cried for her bottle.",
    "The baby did not want the food on the spoon.",
    ["The baby was hungry for the spoon's food.", "The baby was asleep."],
  ],
  [
    "Smoke rose from the kitchen, the alarm beeped, and Dad rushed to open the window.",
    "Something on the stove was burning.",
    ["Dad was baking a perfect cake.", "The alarm was being tested."],
  ],
];

const evidenceBank: readonly ChoiceItem[] = [
  [
    "Inference: The family was going on a long trip.",
    "They loaded four suitcases into the car and filled the tank with gas.",
    ["They ate breakfast at the table.", "The car was painted blue."],
  ],
  [
    "Inference: Ana was nervous about her speech.",
    "Her hands shook as she held her notes.",
    ["She wore her favorite shirt.", "The room had twenty chairs."],
  ],
  [
    "Inference: The garden had not been cared for in a long time.",
    "Weeds grew taller than the fence, and the flowers were brown and dry.",
    ["The garden was behind the house.", "The garden had a stone path."],
  ],
  [
    "Inference: The puppy was new to the house.",
    "It sniffed every corner and hid under the bed whenever someone came in.",
    ["The puppy had brown spots.", "The puppy ate dog food."],
  ],
  [
    "Inference: It was very cold that morning.",
    "Frost covered the car windows, and everyone's breath made clouds.",
    ["The bus came at seven.", "The children walked to school."],
  ],
  [
    "Inference: Sam had practiced the song many times.",
    "He played it from memory without looking at his music.",
    ["He sat on a wooden bench.", "The piano was in the living room."],
  ],
  [
    "Inference: The store was about to close.",
    "Workers were turning off lights and stacking chairs in the cafe.",
    ["The store sold shoes and shirts.", "The store had large windows."],
  ],
  [
    "Inference: The river had flooded recently.",
    "Mud lines ran along the walls of the houses, high above the ground.",
    ["The river had many fish.", "A bridge crossed the river."],
  ],
];

const factBank: readonly ChoiceItem[] = [
  ["", "The Pacific is the largest ocean on Earth.", ["The ocean is the most beautiful place to visit.", "Everyone should learn to surf."]],
  ["", "Spiders have eight legs.", ["Spiders are the creepiest animals.", "Spiders are more interesting than ants."]],
  ["", "Water freezes at zero degrees Celsius.", ["Winter is the best season.", "Snow is more fun than rain."]],
  ["", "Our school has twelve classrooms.", ["Our school has the nicest teachers.", "School should start later."]],
  [
    "",
    "George Washington was the first president of the United States.",
    ["Washington was the greatest president.", "Every child should read about Washington."],
  ],
  ["", "A week has seven days.", ["Friday is the best day of the week.", "Mondays are boring."]],
  ["", "Bananas grow in warm places.", ["Bananas taste better than apples.", "Everyone should eat a banana a day."]],
  [
    "",
    "The library opens at nine in the morning.",
    ["The library is the most peaceful place in town.", "The library should open earlier."],
  ],
];

const opinionBank: readonly ChoiceItem[] = [
  ["", "Pizza is the tastiest food in the world.", ["Pizza was first made in Italy.", "Many pizzas are baked in ovens."]],
  ["", "Soccer is more exciting than baseball.", ["A soccer team has eleven players on the field.", "Baseball is played with a bat."]],
  ["", "Cats make better pets than dogs.", ["Cats can see well in dim light.", "Dogs have a strong sense of smell."]],
  ["", "The new library is far too small.", ["The new library opened in May.", "The new library has two floors."]],
  ["", "Summer vacation should be longer.", ["Summer vacation begins in June.", "Some students go to camp in summer."]],
  ["", "Painting is the most relaxing hobby.", ["Paint can be mixed to make new colors.", "Some paints are made with water."]],
  ["", "The movie was much too long.", ["The movie lasted two hours.", "The movie was shown at seven."]],
  ["", "Math is the hardest subject in school.", ["Students study math five days a week.", "Math class starts at ten."]],
];

const purposeBank: readonly ChoiceItem[] = [
  ["An article explains how volcanoes form and why they erupt.", "to inform", ["to persuade", "to entertain"]],
  ['A poster says, "Vote for Kim! She will get us longer recess!"', "to persuade", ["to inform", "to entertain"]],
  ["A story tells about a talking pencil that goes on adventures in a desk.", "to entertain", ["to inform", "to persuade"]],
  ["A letter to the mayor argues that the town needs a new skate park.", "to persuade", ["to entertain", "to inform"]],
  ["A page of a science book lists the planets and their distances from the sun.", "to inform", ["to persuade", "to entertain"]],
  ["A funny poem tells about a cat who wants to become a chef.", "to entertain", ["to persuade", "to inform"]],
  ["An advertisement says this cereal is the best way to start your day.", "to persuade", ["to inform", "to entertain"]],
  ["A set of directions tells how to put together a bookshelf.", "to inform", ["to entertain", "to persuade"]],
  ["A comic strip shows a dog trying to catch its own tail.", "to entertain", ["to inform", "to persuade"]],
];

const purposeWhy = new Map([
  ["to inform", ["It gives facts or explains something.", "它提供事实或解释某事。"]],
  ["to persuade", ["It tries to get the reader to think or do something.", "它试图让读者相信或去做某事。"]],
  ["to entertain", ["It tells a story or something funny for the reader to enjoy.", "它讲一个故事或有趣的事，让读者获得乐趣。"]],
]);

const pointOfViewBank: readonly ChoiceItem[] = [
  ["I grabbed my backpack and ran to catch the bus, but I was too late.", "first person", ["third person", "second person"]],
  ["Jada grabbed her backpack and ran to catch the bus, but she was too late.", "third person", ["first person", "second person"]],
  ["We set up our tent by the lake and watched the stars until midnight.", "first person", ["third person", "second person"]],
  ["The brothers set up their tent by the lake and watched the stars until midnight.", "third person", ["first person", "second person"]],
  ["My grandmother taught me to bake bread when I was six.", "first person", ["third person", "second person"]],
  ["Omar's grandmother taught him to bake bread when he was six.", "third person", ["first person", "second person"]],
  ["When the lights went out, I held my breath and listened.", "first person", ["second person", "third person"]],
  ["When the lights went out, the twins held their breath and listened.", "third person", ["second person", "first person"]],
  ["Our dog dug a hole under the fence and escaped again.", "first person", ["third person", "second person"]],
];

const narratorBank: readonly ChoiceItem[] = [
  [
    "I never liked spiders until the day one saved my tomatoes from the beetles.",
    'a character in the story, telling it as "I"',
    ["someone outside the story", "the spider"],
  ],
  [
    "Kenji did not like spiders until the day one saved his tomatoes from the beetles.",
    "someone outside the story",
    ['Kenji, telling it as "I"', "the spider"],
  ],
  [
    "Lucy whispered to her brother. Neither of them knew that their mother was listening at the door.",
    "someone outside the story who knows more than the characters",
    ['Lucy, telling it as "I"', 'the mother, telling it as "I"'],
  ],
  [
    "My sister and I found an old map in the attic, and we decided to follow it.",
    'one of the sisters, telling it as "I"',
    ["someone outside the story", "the map"],
  ],
  [
    "The old man fed the pigeons every morning. He did not know that the girl across the street watched him each day.",
    "someone outside the story who knows more than the characters",
    ['the old man, telling it as "I"', 'the girl, telling it as "I"'],
  ],
  [
    "I am a lighthouse, and for a hundred years I have watched the ships go by.",
    'the lighthouse, telling it as "I"',
    ["someone outside the story", "a sailor on a ship"],
  ],
  [
    "When Max saw the broken vase, his heart sank. He knew he would have to tell his dad.",
    "someone outside the story",
    ['Max, telling it as "I"', 'Max\'s dad, telling it as "I"'],
  ],
  [
    "I wanted to win the race more than anything, but I stopped to help a runner who had fallen.",
    'a character in the story, telling it as "I"',
    ["someone outside the story", "the runner who fell"],
  ],
];

const traitBank: readonly ChoiceItem[] = [
  ["Rosa found a wallet on the sidewalk and walked six blocks to return it to its owner.", "honest", ["lazy", "rude"]],
  ["Even after falling off his bike ten times, Theo got back on and kept trying.", "determined", ["careless", "shy"]],
  ["Nadia gave half of her lunch to a new student who had forgotten his.", "generous", ["selfish", "bossy"]],
  ["Ben hid behind his mother and would not say hello to the visitors.", "shy", ["brave", "rude"]],
  ["Ava climbed the tall tree to rescue the kitten while everyone else stayed back.", "brave", ["timid", "lazy"]],
  ["Jamal always grabs the biggest piece of cake and never shares his toys.", "selfish", ["generous", "kind"]],
  ["Lily checked her math three times and kept her desk perfectly neat.", "careful", ["careless", "silly"]],
  ["Max asked his teacher question after question about how rockets work.", "curious", ["bored", "angry"]],
  ["Ella told everyone where to sit, what to play and when to stop.", "bossy", ["shy", "gentle"]],
];

const feelingBank: readonly ChoiceItem[] = [
  ["Hana slammed the door, crossed her arms and refused to speak.", "angry", ["calm", "proud"]],
  ["Diego's eyes filled with tears as he waved goodbye to his best friend.", "sad", ["excited", "bored"]],
  ["Zoe jumped up and down, clapping, when she saw the puppy.", "excited", ["worried", "tired"]],
  ["Owen bit his nails and kept glancing at the dark window.", "nervous", ["proud", "cheerful"]],
  ["Grace held up her ribbon and grinned at her parents in the crowd.", "proud", ["embarrassed", "angry"]],
  ["Felix's cheeks turned red when he tripped in front of the whole class.", "embarrassed", ["proud", "calm"]],
  ["Maya sighed, stared out the window and drew circles on her paper.", "bored", ["thrilled", "frightened"]],
  ["Isaac gasped and grabbed his sister's arm when the floor creaked behind him.", "frightened", ["bored", "proud"]],
  ["After the long hike, Ruby sank into a chair, closed her eyes and smiled.", "relaxed and content", ["furious", "nervous"]],
];

const lessonBank: readonly ChoiceItem[] = [
  [
    "A rabbit made fun of a slow turtle and challenged it to a race. Sure of winning, the rabbit stopped to nap. The turtle kept going step by step and crossed the finish line first.",
    "Slow and steady effort can beat speed and pride.",
    ["Rabbits are faster than turtles.", "Naps are good for you."],
  ],
  [
    "A boy kept shouting that a wolf was coming, just to watch the villagers run. When a wolf really came, no one believed him.",
    "If you lie, people may not believe you even when you tell the truth.",
    ["Wolves are dangerous.", "Villagers should stay indoors."],
  ],
  [
    "Two friends found a melon. Each wanted it all, and while they argued, a crow flew off with it.",
    "When people fight over something, they may both lose it.",
    ["Crows like melons.", "Melons grow in summer."],
  ],
  [
    "An ant worked all summer storing food. A grasshopper sang and played. When winter came, the grasshopper was hungry, and the ant was fed.",
    "It is wise to prepare for the future.",
    ["Grasshoppers sing well.", "Ants live underground."],
  ],
  [
    "Lena was afraid to join the soccer team because she had never played. She tried anyway, and by the end of the season she was the team's best defender.",
    "Trying something new can lead to success.",
    ["Soccer is a hard sport.", "Defenders never score."],
  ],
  [
    "A lion spared a tiny mouse. Later, the lion was caught in a net, and the mouse chewed through the ropes to set it free.",
    "Even small friends can be a great help.",
    ["Lions are stronger than mice.", "Nets are made of rope."],
  ],
  [
    "Jack teased the new girl about her accent. Later, when Jack moved to a new town, others laughed at the way he talked, and he finally understood how she had felt.",
    "Treat others the way you would want to be treated.",
    ["Moving to a new town is exciting.", "Everyone has an accent."],
  ],
  [
    "A dog with a bone saw its reflection in a stream and thought it saw another dog with a bigger bone. It snapped at it and dropped its own bone into the water.",
    "Being greedy can make you lose what you already have.",
    ["Dogs like bones.", "Streams can show reflections."],
  ],
];

const simileBank: readonly ChoiceItem[] = [
  ["The baby's skin was as soft as a flower petal.", "very soft", ["covered in flowers", "pink"]],
  ["After the race, Tim was as hungry as a bear.", "very hungry", ["big and furry", "sleepy"]],
  ["The lake was like a mirror in the still morning.", "very smooth and reflecting", ["made of glass", "broken"]],
  ["Her voice was as sweet as honey.", "pleasant to hear", ["sticky", "made of sugar"]],
  ["The classroom was as quiet as a mouse during the test.", "very quiet", ["full of mice", "small"]],
  ["The old car ran like a tired turtle.", "very slowly", ["very quickly", "on water"]],
  ["His hands were as cold as ice after the snowball fight.", "very cold", ["wet", "made of ice"]],
  ["The fireworks burst like giant flowers in the sky.", "opening wide in bright colors", ["growing in a garden", "falling slowly"]],
  ["The runner shot off the line like a rocket.", "very fast", ["very loudly", "upward into space"]],
];

const metaphorBank: readonly ChoiceItem[] = [
  ["The classroom was a zoo after the fire drill.", "wild and noisy", ["full of animals", "very clean"]],
  ["Grandpa's beard is a snowy forest.", "thick and white", ["full of trees", "cold"]],
  ["Her smile was sunshine on a gray day.", "warm and cheering", ["very bright to look at", "only seen in summer"]],
  ["Time is a thief that steals our summer days.", "it makes summer pass too quickly", ["someone stole a calendar", "summer is dangerous"]],
  ["The stars were diamonds scattered across the sky.", "bright and sparkling", ["expensive", "falling down"]],
  ["My little brother is a tornado when he plays.", "he moves wildly and makes a mess", ["he is a storm", "he spins in circles"]],
  ["The road was a ribbon winding through the hills.", "long, thin and curving", ["made of cloth", "tied in a bow"]],
  ["Dad was a bear before his morning coffee.", "grumpy", ["hairy", "hungry for fish"]],
  ["The blanket of snow covered the town.", "a thick, even layer", ["a warm cover for beds", "a soft cloth"]],
];

const idiomBank: readonly ChoiceItem[] = [
  ["Ana was under the weather, so she stayed home.", "feeling sick", ["standing in the rain", "outside in a storm"]],
  ["The test was a piece of cake.", "very easy", ["a kind of dessert", "very hard"]],
  ["Stop beating around the bush and tell me what happened.", "avoiding the main point", ["hitting a plant", "walking in the garden"]],
  ["Break a leg in the play tonight!", "good luck", ["get hurt", "dance well"]],
  ["Leo let the cat out of the bag about the surprise party.", "told the secret", ["opened a bag", "lost his pet"]],
  ["It's raining cats and dogs outside.", "raining very hard", ["animals are falling", "barely raining"]],
  ["Mom said we should hit the hay early tonight.", "go to bed", ["work on a farm", "play a game"]],
  ["Priya was on cloud nine after winning the contest.", "very happy", ["flying on a plane", "very tired"]],
  ["The new bike cost an arm and a leg.", "very expensive", ["dangerous to ride", "very cheap"]],
];

const persuadeBank: readonly ChoiceItem[] = [
  [
    "",
    "You should join the art club, because it is the most fun you will have all week!",
    ["The art club meets on Tuesdays after school.", "The art club painted a mural last year."],
  ],
  ["", "Don't miss the best sale of the year at Green's Shoes!", ["Green's Shoes is on Main Street.", "Green's Shoes opened in 1990."]],
  [
    "",
    "Our town needs a new pool, so please sign our letter to the mayor.",
    ["The old pool was built forty years ago.", "The pool is open from June to August."],
  ],
  [
    "",
    "Every family should plant a tree this spring to make our city greener.",
    ["Trees take in carbon dioxide.", "Oak trees can live for hundreds of years."],
  ],
  ["", "Choose Fresh Farms milk for the strongest bones in town!", ["Milk contains calcium.", "Fresh Farms has sixty cows."]],
  [
    "",
    "Turn off the lights when you leave a room; it is the right thing to do for the planet.",
    ["Lights use electricity.", "Most rooms have a light switch."],
  ],
  [
    "",
    "Vote for Sam for class president, the only candidate who will really listen to you!",
    ["Sam is in the fourth grade.", "The vote will be held on Friday."],
  ],
  [
    "",
    "You will love this book so much that you will not be able to put it down.",
    ["This book has twelve chapters.", "This book was written in 2019."],
  ],
];

const storyForLessonBank: readonly ChoiceItem[] = [
  [
    "Lesson: Honesty is the best policy.",
    "A girl breaks a window, tells her neighbor the truth, and the neighbor thanks her and lets her help fix it.",
    ["A girl breaks a window and runs away before anyone sees.", "A girl wins a prize for the best painting at school."],
  ],
  [
    "Lesson: Hard work pays off.",
    "A boy practices his free throws every day after school, and at last he makes the winning shot.",
    ["A boy finds money on the street and buys a ball.", "A boy goes to watch a basketball game with his uncle."],
  ],
  [
    "Lesson: True friends help each other.",
    "When a fox falls into a hole, a goat lowers a rope, and later the fox shares its berries with the goat.",
    ["A fox and a goat race to the river, and the goat wins.", "A fox hides its berries so the goat will not find them."],
  ],
  [
    "Lesson: Do not judge others by how they look.",
    "The children avoid an old man with a scary face, until he saves their kite from a tree and shows them how to fly it.",
    ["The children fly their kite in the park on a windy day.", "An old man buys a new kite at the store."],
  ],
  [
    "Lesson: Think before you act.",
    "A crow drops its cheese while cawing at a fox, then wishes it had kept its beak shut.",
    ["A crow finds a piece of cheese and carries it to a tree.", "A crow and a fox become friends after a storm."],
  ],
  [
    "Lesson: Sharing makes everyone happier.",
    "Mia brings her new game to recess and lets everyone play, and soon she has more friends than ever.",
    ["Mia gets a new game for her birthday.", "Mia keeps her new game in her bag all day."],
  ],
  [
    "Lesson: Keep trying, even when things are hard.",
    "A spider's web is torn by the wind six times, and the spider rebuilds it each time until it holds.",
    ["A spider spins a web in the corner of a barn.", "A spider leaves its web when the wind blows."],
  ],
  [
    "Lesson: Be happy with what you have.",
    "A mouse trades its cozy home for a fancy one, but finds it full of cats and runs back home, glad of its own.",
    ["A mouse finds cheese in a fancy kitchen.", "A mouse moves to a fancy house and stays there forever."],
  ],
];

const chooseIdiomBank: readonly ChoiceItem[] = [
  ['Meaning: very easy. "Riding a bike is ___ once you learn."', "a piece of cake", ["under the weather", "on cloud nine"]],
  ['Meaning: feeling sick. "Grandma is ___, so we will visit tomorrow."', "under the weather", ["a piece of cake", "on cloud nine"]],
  ['Meaning: very happy. "When she got the puppy, Lily was ___."', "on cloud nine", ["under the weather", "in hot water"]],
  ['Meaning: in trouble. "Jake was ___ after he broke the lamp."', "in hot water", ["on cloud nine", "a piece of cake"]],
  ['Meaning: to go to bed. "It is late, so let\'s ___."', "hit the hay", ["break the ice", "spill the beans"]],
  ['Meaning: to tell a secret. "Do not ___ about the surprise!"', "spill the beans", ["hit the hay", "break the ice"]],
  [
    'Meaning: to make people feel comfortable when they first meet. "The teacher told a joke to ___."',
    "break the ice",
    ["spill the beans", "hit the hay"],
  ],
  ['Meaning: very expensive. "That new phone costs ___."', "an arm and a leg", ["a piece of cake", "in hot water"]],
  [
    'Meaning: to do something exactly right. "You ___ when you said the answer was ten."',
    "hit the nail on the head",
    ["spilled the beans", "hit the hay"],
  ],
];

const pick = (question: [string, string], bank: readonly ChoiceItem[], en: (right: string) => string, zh: (right: string) => string) =>
  choiceGenerator(t(question[0], question[1]), bank, (right) => t(en(right), zh(right)));

/** thinkingReadingTopics are the topics of thinking about a text: inferences, facts and opinions, purpose, narrators, characters, lessons and figurative language. */
export const thinkingReadingTopics: readonly TopicDef[] = [
  {
    id: "making-inferences",
    title: t("Making Inferences", "推断"),
    summary: t(
      "Working out what a text does not say from clues it gives, and finding the clues.",
      "根据文中给出的线索推断它没有直接说的内容，并找出这些线索。",
    ),
    prerequisites: [],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      point(
        "inferring-from-clues",
        t("Inferring from Clues", "根据线索推断"),
        t(
          "Writers do not tell you everything. An **inference** puts the clues in the text together with what you already know: wet umbrellas and muddy boots, plus what you know about weather, tell you that it rained. A good inference fits every clue; a guess that ignores the clues, or goes against them, is not an inference.",
          "作者不会把一切都告诉你。**推断**是把文中的线索和你已有的知识结合起来：湿雨伞和沾满泥的靴子，加上你对天气的了解，告诉你下过雨。好的推断与每条线索都相符；忽视线索或与之矛盾的猜测不是推断。",
        ),
        pick(
          ["What can you infer from this text?", "从这段文字中你能推断出什么？"],
          inferenceBank,
          (right) => `*${right}* fits every clue in the text. The other choices ignore the clues or go against them.`,
          (right) => `*${right}* 与文中的每条线索都相符。其他选项忽视了线索或与之矛盾。`,
        ),
      ),
      point(
        "finding-evidence",
        t("Finding the Evidence", "找出依据"),
        t(
          "An inference needs **evidence**: a detail in the text that points to it. When you choose evidence, ask whether the detail would make the inference more likely. A true detail that has nothing to do with the inference is not evidence for it.",
          "推断需要**依据**：文中指向这个推断的细节。选择依据时，问一问这个细节是否让推断更可信。一个真实却与推断无关的细节不能作为依据。",
        ),
        pick(
          ["Which detail is the best evidence for the inference?", "哪个细节是这个推断最好的依据？"],
          evidenceBank,
          (right) => `*${right}* points to the inference. The other details may be true, but they say nothing about it.`,
          (right) => `*${right}* 指向这个推断。其他细节也许是真的，却与推断无关。`,
        ),
      ),
    ],
  },
  {
    id: "fact-and-opinion",
    title: t("Fact and Opinion", "事实与观点"),
    summary: t(
      "Telling statements that can be checked from statements of what someone thinks.",
      "区分可以核实的陈述和表达个人想法的陈述。",
    ),
    prerequisites: [],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      point(
        "spotting-facts",
        t("Spotting Facts", "找出事实"),
        t(
          "A **fact** can be checked and shown to be true, by measuring, counting or looking it up. An **opinion** tells what someone thinks or feels, and people can disagree with it. Words such as *best, worst, beautiful, should* and *more fun* usually signal an opinion.",
          "**事实**可以通过测量、计数或查证来核实。**观点**表达某人的想法或感受，别人可以不同意。*best, worst, beautiful, should, more fun* 这样的词通常表示观点。",
        ),
        pick(
          ["Which sentence states a fact?", "哪个句子陈述的是事实？"],
          factBank,
          (right) =>
            `*${right}* can be checked by measuring, counting or looking it up, so it is a fact. The other sentences tell what someone thinks.`,
          (right) => `*${right}* 可以通过测量、计数或查证来核实，所以是事实。其他句子表达的是个人想法。`,
        ),
      ),
      point(
        "spotting-opinions",
        t("Spotting Opinions", "找出观点"),
        t(
          "To test a sentence, ask: could someone prove this, or could someone reasonably disagree? *The movie lasted two hours* can be checked with a clock. *The movie was much too long* is a judgment, and another viewer might think it was just right.",
          "检验一个句子时，问一问：有人能证明它吗？还是有人可以合理地不同意？*The movie lasted two hours* 可以用钟表核实。*The movie was much too long* 是一种评判，另一位观众也许觉得刚刚好。",
        ),
        pick(
          ["Which sentence states an opinion?", "哪个句子表达的是观点？"],
          opinionBank,
          (right) =>
            `*${right}* tells what someone thinks, and others could disagree, so it is an opinion. The other sentences can be checked.`,
          (right) => `*${right}* 表达的是个人想法，别人可能不同意，所以是观点。其他句子可以核实。`,
        ),
      ),
    ],
  },
  {
    id: "authors-purpose",
    title: t("Author's Purpose", "作者的目的"),
    summary: t("Whether a text is written to inform, to persuade or to entertain.", "文本是为了告知、说服还是娱乐。"),
    prerequisites: ["fact-and-opinion"],
    encompasses: [{ topic: "fact-and-opinion", weight: 0.2 }],
    xp: 10,
    knowledgePoints: [
      point(
        "inform-persuade-entertain",
        t("Inform, Persuade or Entertain", "告知、说服还是娱乐"),
        t(
          "Authors write for a reason. To **inform** is to give facts or explain, as a science book does. To **persuade** is to try to get the reader to think or do something, as an advertisement does, often with opinions. To **entertain** is to give the reader enjoyment, as a story, poem or joke does.",
          "作者写作总有原因。**告知**是提供事实或进行解释，像科学书那样。**说服**是设法让读者相信或去做某事，像广告那样，常常带有观点。**娱乐**是让读者获得乐趣，像故事、诗歌或笑话那样。",
        ),
        choiceGenerator(t("What is the author's main purpose?", "作者的主要目的是什么？"), purposeBank, (right) => {
          const [en, zh] = purposeWhy.get(right) ?? ["", ""];
          return t(`The purpose is **${right}**. ${en}`, `目的是 **${right}**。${zh}`);
        }),
      ),
      point(
        "spotting-persuasion",
        t("Spotting Persuasion", "识别说服"),
        t(
          "A writer who wants to persuade tells the reader what to think or do, often with words such as *should, must, best, don't miss* and *you will love*. A sentence that only gives information, however useful, is not trying to persuade.",
          "想要说服的作者会告诉读者该怎么想或怎么做，常用 *should, must, best, don't miss, you will love* 这样的词。只提供信息的句子，不论多有用，都不是在说服。",
        ),
        pick(
          ["Which sentence is trying to persuade the reader?", "哪个句子在试图说服读者？"],
          persuadeBank,
          (right) => `*${right}* tells the reader what to think or do. The other sentences only give information.`,
          (right) => `*${right}* 告诉读者该怎么想或怎么做。其他句子只是提供信息。`,
        ),
      ),
    ],
  },
  {
    id: "point-of-view",
    title: t("Point of View", "叙述视角"),
    summary: t("First- and third-person narrators, and who is telling a story.", "第一人称和第三人称叙述者，以及是谁在讲故事。"),
    prerequisites: ["nouns-and-pronouns"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      point(
        "first-or-third-person",
        t("First or Third Person", "第一人称还是第三人称"),
        t(
          "In **first person**, the narrator is in the story and uses *I, me, my, we* and *our*. In **third person**, the narrator is outside the story and uses names and *he, she* and *they*. Look at the pronouns outside of what characters say aloud.",
          "**第一人称**叙述者在故事之中，使用 *I, me, my, we, our*。**第三人称**叙述者在故事之外，使用人名以及 *he, she, they*。看人物说话以外的代词。",
        ),
        pick(
          ["What point of view is this sentence told in?", "这句话是用哪种视角叙述的？"],
          pointOfViewBank,
          (right) =>
            right === "first person"
              ? "It is **first person**: the narrator uses *I, me, my, we* or *our* and is part of the story."
              : "It is **third person**: the narrator uses names and *he, she* or *they* and stands outside the story.",
          (right) =>
            right === "first person"
              ? "这是**第一人称**：叙述者使用 *I, me, my, we* 或 *our*，是故事中的一员。"
              : "这是**第三人称**：叙述者使用人名以及 *he, she* 或 *they*，置身故事之外。",
        ),
      ),
      point(
        "who-tells-the-story",
        t("Who Tells the Story", "谁在讲故事"),
        t(
          "A first-person narrator can tell only what that one character sees, thinks and feels. A third-person narrator may know more than any character, even what each one is thinking. The narrator does not have to be a person: an animal or even a thing can tell its own story as *I*.",
          "第一人称叙述者只能讲述这个人物看到、想到和感受到的。第三人称叙述者可能比任何人物知道得都多，甚至知道每个人物在想什么。叙述者不一定是人：动物甚至物体也可以用 *I* 讲自己的故事。",
        ),
        pick(
          ["Who is telling this story?", "是谁在讲这个故事？"],
          narratorBank,
          (right) => `The story is told by **${right}**. The pronouns and what the narrator knows show this.`,
          (right) => `讲故事的是 **${right}**。代词和叙述者所知道的内容说明了这一点。`,
        ),
      ),
    ],
  },
  {
    id: "characters",
    title: t("Characters", "人物"),
    summary: t("Inferring what characters are like and how they feel from what they do.", "从人物的言行推断他们的性格和感受。"),
    prerequisites: ["making-inferences"],
    encompasses: [{ topic: "making-inferences", weight: 0.3 }],
    xp: 12,
    knowledgePoints: [
      point(
        "character-traits",
        t("Character Traits", "性格特点"),
        t(
          "A **trait** is what a character is like most of the time: honest, brave, selfish, curious. Writers often show traits through actions instead of naming them, so ask what kind of person would do what the character does.",
          "**性格特点**是人物通常的样子：诚实、勇敢、自私、好奇。作者常常通过行动而不是直接点明来表现性格，所以要问：什么样的人会做出这个人物所做的事？",
        ),
        pick(
          ["Which word best describes the character?", "哪个词最能描述这个人物？"],
          traitBank,
          (right) => `**${right}** fits what the character does. The other words describe a person who would act differently.`,
          (right) => `**${right}** 与人物的行为相符。其他词描述的是会有不同行为的人。`,
        ),
      ),
      point(
        "character-feelings",
        t("Character Feelings", "人物的感受"),
        t(
          "A **feeling** is how a character is at one moment: angry, nervous, proud. Writers show feelings through faces, bodies and actions: tears, a grin, shaking hands, a slammed door. Picture the character, and name the feeling those details show.",
          "**感受**是人物在某一刻的状态：生气、紧张、自豪。作者通过表情、身体和动作来表现感受：眼泪、咧嘴笑、发抖的手、摔门。想象人物的样子，说出这些细节所表现的感受。",
        ),
        pick(
          ["How does the character most likely feel?", "这个人物最可能有什么感受？"],
          feelingBank,
          (right) => `The details show that the character feels **${right}**. The other feelings would show in different ways.`,
          (right) => `这些细节表明人物感到 **${right}**。其他感受会以不同的方式表现出来。`,
        ),
      ),
    ],
  },
  {
    id: "lesson-of-a-story",
    title: t("The Lesson of a Story", "故事的寓意"),
    summary: t("The lesson or message a story teaches, beyond what happens in it.", "故事所传达的道理，而不只是故事中发生了什么。"),
    prerequisites: ["characters"],
    encompasses: [{ topic: "characters", weight: 0.2 }],
    xp: 12,
    knowledgePoints: [
      point(
        "finding-the-lesson",
        t("Finding the Lesson", "找出寓意"),
        t(
          "Many stories, especially fables, teach a **lesson** about life. The lesson is not what happens in the story but what it teaches about how to act, and it applies to people outside the story too. Look at what a character learns or how a mistake turns out.",
          "许多故事，尤其是寓言，会讲一个人生**道理**。道理不是故事里发生了什么，而是它教人怎样做事，并且对故事以外的人也适用。看看人物学到了什么，或者一个错误带来了什么结果。",
        ),
        pick(
          ["What lesson does this story teach?", "这个故事讲了什么道理？"],
          lessonBank,
          (right) =>
            `*${right}* That is what the story teaches about how to act. The other choices are facts from or about the story, not lessons for the reader.`,
          (right) => `*${right}* 这是故事教人如何做事的道理。其他选项只是关于故事的事实，而不是给读者的道理。`,
        ),
      ),
      point(
        "story-for-a-lesson",
        t("A Story for a Lesson", "符合寓意的故事"),
        t(
          "A lesson comes from what happens because of a character's choice. To match a story to a lesson, look for a choice and its result that show the lesson is true. A story where nothing turns on a choice, or where the result goes against the lesson, does not teach it.",
          "道理来自人物的选择所带来的结果。要把故事和道理对应起来，就找能证明这个道理的选择及其结果。一个没有关键选择的故事，或者结果与道理相反的故事，都不能传达这个道理。",
        ),
        pick(
          ["Which story teaches this lesson?", "哪个故事传达了这个道理？"],
          storyForLessonBank,
          (right) =>
            `*${right}* The character's choice and its result show the lesson. The other stories have no such choice, or their result points the other way.`,
          (right) => `*${right}* 人物的选择及其结果体现了这个道理。其他故事没有这样的选择，或者结果恰恰相反。`,
        ),
      ),
    ],
  },
  {
    id: "similes-and-metaphors",
    title: t("Similes and Metaphors", "明喻和暗喻"),
    summary: t("Comparisons with and without *like* or *as*, and what they mean.", "带或不带 *like*、*as* 的比喻，以及它们的意思。"),
    prerequisites: [],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      point(
        "similes",
        t("Similes", "明喻"),
        t(
          "A **simile** compares two different things using *like* or *as*: *as hungry as a bear*. It is not meant literally. Ask what the two things have in common: a bear is known for eating a lot, so the person is very hungry, not big or furry.",
          "**明喻**用 *like* 或 *as* 比较两种不同的事物：*as hungry as a bear*。它不是字面意思。问一问两者有什么共同点：熊以食量大著称，所以这个人非常饿，而不是又大又毛茸茸。",
        ),
        pick(
          ["What does the simile mean?", "这个明喻是什么意思？"],
          simileBank,
          (right) =>
            `It means **${right}**, the quality the two things share. The other choices take the words literally or pick a quality the comparison is not about.`,
          (right) => `意思是 **${right}**，即两者的共同特点。其他选项是按字面理解，或者选了比喻并不针对的特点。`,
        ),
      ),
      point(
        "metaphors",
        t("Metaphors", "暗喻"),
        t(
          "A **metaphor** says that one thing **is** another, without *like* or *as*: *The classroom was a zoo*. The classroom has no animals; it was wild and noisy, as a zoo is. Find the quality the writer wants you to carry over from one thing to the other.",
          "**暗喻**直接说一样东西**是**另一样东西，不用 *like* 或 *as*：*The classroom was a zoo*。教室里没有动物，而是像动物园一样乱哄哄的。找出作者想让你从一样东西转移到另一样东西上的特点。",
        ),
        pick(
          ["What does the metaphor mean?", "这个暗喻是什么意思？"],
          metaphorBank,
          (right) => `It means **${right}**. The other choices take the metaphor literally or miss the quality it carries over.`,
          (right) => `意思是 **${right}**。其他选项按字面理解了暗喻，或者没抓住它所转移的特点。`,
        ),
      ),
    ],
  },
  {
    id: "idioms",
    title: t("Idioms", "习语"),
    summary: t("Common phrases whose meaning is not the meaning of their words.", "意思不等于字面意思的常用短语。"),
    prerequisites: ["similes-and-metaphors"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      point(
        "what-idioms-mean",
        t("What Idioms Mean", "习语的意思"),
        t(
          "An **idiom** is a phrase that means something different from its words: *a piece of cake* means something easy, not dessert. Idioms must be learned one by one, but the rest of the sentence often helps: if a test was *a piece of cake*, the writer is talking about the test, not food.",
          "**习语**是意思与字面不同的短语：*a piece of cake* 表示很容易，而不是甜点。习语需要一个一个地学，但句子的其余部分常常有帮助：如果考试是 *a piece of cake*，作者说的是考试，而不是食物。",
        ),
        pick(
          ["What does the idiom in this sentence mean?", "这句话中的习语是什么意思？"],
          idiomBank,
          (right) => `It means **${right}**. Taken word by word, the idiom would not make sense in the sentence.`,
          (right) => `意思是 **${right}**。逐字理解的话，这个习语在句中讲不通。`,
        ),
      ),
      point(
        "choosing-an-idiom",
        t("Choosing an Idiom", "选择习语"),
        t(
          "Using an idiom means knowing what it means as a whole. Match the meaning you need to the idiom, then check that the sentence still makes sense: *Grandma is under the weather* says she is sick, while *Grandma is on cloud nine* says she is very happy.",
          "使用习语要知道它的整体意思。把需要的意思和习语对应起来，再检查句子是否通顺：*Grandma is under the weather* 是说她病了，而 *Grandma is on cloud nine* 是说她非常高兴。",
        ),
        pick(
          ["Which idiom completes the sentence with this meaning?", "哪个习语能以这个意思补全句子？"],
          chooseIdiomBank,
          (right) => `**${right}** has this meaning. The other idioms mean something else, so the sentence would say the wrong thing.`,
          (right) => `**${right}** 就是这个意思。其他习语意思不同，句子就会表达错误的意思。`,
        ),
      ),
    ],
  },
];
