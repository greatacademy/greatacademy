// Reading: thinking about a text, from inferences and the author's purpose to characters, lessons and figurative language.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point } from "@ga/subject-english";
import {
  claims,
  fables,
  idioms,
  moreFeelingBank,
  moreMetaphorBank,
  morePurposeBank,
  moreSimileBank,
  moreTraitBank,
  scenes,
  tellings,
} from "./reading-thinking-more.ts";

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
    ["She wore her favorite shirt.", "The room had twenty chairs arranged in four neat rows."],
  ],
  [
    "Inference: The garden had not been cared for in a long time.",
    "Weeds grew taller than the fence, and the flowers were brown and dry.",
    ["The garden was behind the house.", "The garden had a stone path."],
  ],
  [
    "Inference: The puppy was new to the house.",
    "It sniffed every corner and hid under the bed whenever someone came in.",
    ["The puppy had brown spots on its back and a short, curly tail.", "The puppy ate dog food."],
  ],
  [
    "Inference: It was very cold that morning.",
    "Frost covered the car windows, and everyone's breath made clouds.",
    ["The bus came at seven.", "The children walked to school."],
  ],
  [
    "Inference: Sam had practiced the song many times.",
    "He played it from memory without looking at his music.",
    ["He sat on a wooden bench that his grandfather had built years ago.", "The piano was in the living room."],
  ],
  [
    "Inference: The store was about to close.",
    "Workers were turning off lights and stacking chairs in the cafe.",
    ["The store sold shoes and shirts.", "The store had large windows."],
  ],
  [
    "Inference: The river had flooded recently.",
    "Mud lines ran along the walls of the houses, high above the ground.",
    ["The river had many kinds of fish, and people came from far away to catch them.", "A bridge crossed the river."],
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
    ['Kenji, telling it as "I"', 'the spider, telling it as "I"'],
  ],
  [
    "Lucy whispered to her brother. Neither of them knew that their mother was listening at the door.",
    "someone outside the story who knows more than the characters",
    ['Lucy, telling it as "I"', 'the mother, telling it as "I"'],
  ],
  [
    "My sister and I found an old map in the attic, and we decided to follow it.",
    'one of the sisters, telling it as "I"',
    ["someone outside the story who knows more than the characters", "the map"],
  ],
  [
    "The old man fed the pigeons every morning. He did not know that the girl across the street watched him each day.",
    "someone outside the story who knows more than the characters",
    ['the old man, telling it as "I"', 'the girl, telling it as "I"'],
  ],
  [
    "I am a lighthouse, and for a hundred years I have watched the ships go by.",
    'the lighthouse, telling it as "I"',
    ["someone outside the story who knows more than the characters", "a sailor on a ship"],
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
    ["Wolves are dangerous.", "The boy shouted that a wolf was coming just to watch the villagers run."],
  ],
  [
    "Two friends found a melon. Each wanted it all, and while they argued, a crow flew off with it.",
    "When people fight over something, they may both lose it.",
    ["Crows like melons.", "Melons grow in summer."],
  ],
  [
    "An ant worked all summer storing food. A grasshopper sang and played. When winter came, the grasshopper was hungry, and the ant was fed.",
    "It is wise to prepare for the future.",
    ["The grasshopper sang and played all summer while the ant stored food.", "Ants live underground."],
  ],
  [
    "Lena was afraid to join the soccer team because she had never played. She tried anyway, and by the end of the season she was the team's best defender.",
    "Trying something new can lead to success.",
    ["Soccer is a hard sport.", "Defenders never score."],
  ],
  [
    "A lion spared a tiny mouse. Later, the lion was caught in a net, and the mouse chewed through the ropes to set it free.",
    "Even small friends can be a great help.",
    ["Lions are stronger than mice.", "The lion was caught in a net, and the mouse chewed through the ropes."],
  ],
  [
    "Jack teased the new girl about her accent. Later, when Jack moved to a new town, others laughed at the way he talked, and he finally understood how she had felt.",
    "Treat others the way you would want to be treated.",
    ["Moving to a new town is exciting.", "Everyone has an accent."],
  ],
  [
    "A dog with a bone saw its reflection in a stream and thought it saw another dog with a bigger bone. It snapped at it and dropped its own bone into the water.",
    "Being greedy can make you lose what you already have.",
    ["Dogs like bones.", "The dog saw its reflection in a stream and thought it was another dog."],
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
  ["Grandpa's beard is a snowy forest.", "thick and white", ["full of tall trees and wild animals", "cold"]],
  ["Her smile was sunshine on a gray day.", "warm and cheering", ["very bright to look at", "only seen in summer"]],
  ["Time is a thief that steals our summer days.", "it makes summer pass too quickly", ["someone stole a calendar", "summer is dangerous"]],
  ["The stars were diamonds scattered across the sky.", "bright and sparkling", ["expensive enough to buy and sell", "falling down"]],
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
    "Please sign our letter asking for a new pool.",
    ["The old pool was built forty years ago.", "The pool is open from June to August."],
  ],
  ["", "Every family should plant a tree!", ["Trees take in carbon dioxide.", "Oak trees can live for hundreds of years."]],
  ["", "Choose Fresh Farms milk for the strongest bones in town!", ["Milk contains calcium.", "Fresh Farms has sixty cows."]],
  [
    "",
    "Turn off the lights when you leave a room; it is the right thing to do for the planet.",
    ["Lights use electricity.", "Most rooms have a light switch."],
  ],
  ["", "Vote Sam for president!", ["Sam is in the fourth grade.", "The vote will be held on Friday."]],
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

const sceneInference = scenes.map(([scene, inference, misfits]): ChoiceItem => [scene, inference, [...misfits]]);
const sceneEvidence = scenes.map(([, inference, , clue, details]): ChoiceItem => [`Inference: ${inference}`, clue, [...details]]);
const claimFacts = [0, 1].flatMap((i) => claims.map(([facts, opinions]): ChoiceItem => ["", facts[i]!, [...opinions]]));
const claimOpinions = [0, 1].flatMap((i) => claims.map(([facts, opinions]): ChoiceItem => ["", opinions[i]!, [...facts]]));
const claimPersuade = claims.map(([facts, , persuade]): ChoiceItem => ["", persuade, [...facts]]);
const tellingPerson = tellings.flatMap(([first, third], i): ChoiceItem[] => [
  [first, "first person", i % 2 === 0 ? ["third person", "second person"] : ["second person", "third person"]],
  [third, "third person", i % 2 === 0 ? ["second person", "first person"] : ["first person", "second person"]],
]);
const allKnowing = "someone outside the story who knows more than the characters";
const tellingNarrator = tellings.flatMap(([first, third, name, other], i): ChoiceItem[] => [
  [first, 'a character in the story, telling it as "I"', ["someone outside the story", i % 2 === 0 ? allKnowing : other]],
  [third, "someone outside the story", [`${name}, telling it as "I"`, i % 2 === 0 ? `${other}, telling it as "I"` : other]],
]);
const fableLessons = fables.map(([story, lesson, facts]): ChoiceItem => [story, lesson, [...facts]]);
const fableStories = fables.map(
  ([, lesson, , gist], i): ChoiceItem => [
    `Lesson: ${lesson}`,
    gist,
    [fables[(i + 1) % fables.length]![3], fables[(i + 2) % fables.length]![3]],
  ],
);
const idiomMeanings = idioms.map(([, meaning, sentence, misreadings]): ChoiceItem => [sentence, meaning[0], [...misreadings]]);
const idiomChoices = idioms.map(
  ([idiom, meaning, , , gap], i): ChoiceItem => [
    `Meaning: ${meaning[0]}. "${gap}"`,
    idiom,
    [idioms[(i + 5) % idioms.length]![0], idioms[(i + 11) % idioms.length]![0]],
  ],
);

/** Say gives the feedback for a wrong option, in English and Chinese. */
type Say = (wrong: string, right: string, shown: string, position: number) => readonly [string, string];

const pick = (
  question: [string, string],
  bank: readonly ChoiceItem[],
  en: (right: string) => string,
  zh: (right: string) => string,
  not: Say,
) =>
  choiceGenerator(
    t(question[0], question[1]),
    bank,
    (right) => t(en(right), zh(right)),
    (wrong, right, shown, position) => t(...not(wrong, right, shown, position)),
  );

/** meaning looks up the feedback for a wrong label; a label with no entry is a mistake in the bank. */
const meaning =
  (says: Readonly<Record<string, readonly [string, string]>>): Say =>
  (wrong) => {
    const said = says[wrong];
    if (!said) throw new Error(`no feedback for the label ${wrong}`);
    return said;
  };

const inferenceNot: Say = (wrong, _right, _shown, position) =>
  position === 0
    ? [
        `“${wrong}” clashes with the clues in the text—check what the details actually show.`,
        `“${wrong}”和文中的线索矛盾——核对一下细节真正说明了什么。`,
      ]
    : [
        `Nothing in the passage points to “${wrong}”—a good inference must rest on every clue given.`,
        `文中没有任何线索指向“${wrong}”——好的推断必须建立在给出的每条线索之上。`,
      ];

const evidenceNot: Say = (wrong, _right, _shown, position) =>
  position === 0
    ? [
        `“${wrong}” is just a background detail—it could be true even if the inference were false.`,
        `“${wrong}”只是背景细节——就算推断是错的，这句话也照样成立。`,
      ]
    : [
        `“${wrong}” does not make the inference any more likely; look for a clue that points directly to it.`,
        `“${wrong}”并不能让推断更可信；要找直接指向这个推断的线索。`,
      ];

const opinionNot: Say = (wrong) => [
  `*${wrong}* is an opinion: it tells what someone thinks or wants, with words such as *best*, *should* or *more*, and it cannot be proved.`,
  `*${wrong}* 是观点：它说的是某人的想法或愿望，用了 *best*、*should*、*more* 这样的词，无法证明。`,
];

const factNot: Say = (wrong) => [
  `*${wrong}* is a fact: you could check it in a book or by looking. An opinion tells what someone thinks, and others may disagree.`,
  `*${wrong}* 是事实：可以查书或亲眼核实。观点说的是某人的想法，别人可能不同意。`,
];

const purposeNot = meaning({
  "to inform": [
    "A text written **to inform** only gives facts or explains something. This one does more than that, or something else.",
    "**to inform（告知）**的文字只提供事实或解释某事。这段文字不只如此，或者在做别的事。",
  ],
  "to persuade": [
    "A text written **to persuade** tries to get the reader to think or do something. This one asks nothing of the reader.",
    "**to persuade（说服）**的文字试图让读者相信或去做某事。这段文字并没有要求读者什么。",
  ],
  "to entertain": [
    "A text written **to entertain** tells a story or something funny for enjoyment. This one is not a story or a joke.",
    "**to entertain（娱乐）**的文字讲故事或有趣的事让人享受。这段文字不是故事，也不是笑话。",
  ],
});

const persuadeNot: Say = (wrong) => [
  `*${wrong}* only gives information. It does not tell the reader what to think or do.`,
  `*${wrong}* 只提供信息，没有告诉读者该怎么想或怎么做。`,
];

const pointOfViewNot = meaning({
  "first person": [
    "**First person** would be told by a narrator inside the story, using *I*, *me*, *we* or *our*. Look at the pronouns here.",
    "**first person（第一人称）**由故事中的叙述者讲述，用 *I*、*me*、*we*、*our*。看看这里用的代词。",
  ],
  "second person": [
    "**Second person** would speak to the reader as *you*. No sentence here does that.",
    "**second person（第二人称）**会用 *you* 直接对读者说话。这里没有这样的句子。",
  ],
  "third person": [
    "**Third person** would be told by someone outside the story, using names and *he*, *she* or *they*. Look at the pronouns here.",
    "**third person（第三人称）**由故事外的人讲述，用名字和 *he*、*she*、*they*。看看这里用的代词。",
  ],
});

const narratorNot: Say = (wrong) =>
  wrong.includes('telling it as "I"')
    ? [
        `If ${wrong.replace(/, telling it as "I"$/, "")} told the story, the text would say *I* and *my*. Look at the pronouns the narrator uses.`,
        `如果由 ${wrong.replace(/, telling it as "I"$/, "")} 来讲，文中会用 *I* 和 *my*。看看叙述者用的代词。`,
      ]
    : wrong === allKnowing
      ? [
          "An outside narrator who knows more than the characters would use third-person pronouns (*he*, *she*, *they*) and reveal hidden thoughts—here the narrator speaks as *I*.",
          "知晓一切的故事外叙述者会用第三人称（*he*、*she*、*they*）并揭示角色不知情的事——而这里叙述者用的是 *I*。",
        ]
      : wrong.startsWith("someone outside the story")
        ? [
            "A narrator outside the story would call everyone by name or *he*, *she* and *they*. Here the narrator says *I*.",
            "故事外的叙述者会用名字或 *he*、*she*、*they* 称呼每个人。而这里的叙述者说的是 *I*。",
          ]
        : [`*${wrong}* is something the story tells about, not the one telling it.`, `*${wrong}* 是故事讲到的对象，而不是讲故事的人。`];

const traitNot: Say = (wrong, _right, _shown, position) =>
  position === 0
    ? [
        `Nothing the character does here fits someone **${wrong}**—a trait must match the character's actions.`,
        `人物在这里的举动并不符合 **${wrong}**——性格特点必须由行为来体现。`,
      ]
    : [`A **${wrong}** character would act differently from what the passage describes.`, `**${wrong}** 的人物不会像文中这样行事。`];

const feelingNot: Say = (wrong, _right, _shown, position) =>
  position === 0
    ? [
        `The character's face and actions do not show someone feeling **${wrong}**—picture the scene again.`,
        `人物的表情和举动并不像感到 **${wrong}**——再在脑中想象一下这个画面。`,
      ]
    : [
        `Someone feeling **${wrong}** would look and act very differently from the details here.`,
        `感到 **${wrong}** 的人，神情和动作会和这里的细节大不相同。`,
      ];

const lessonNot: Say = (wrong, _right, _shown, position) =>
  position === 0
    ? [
        `“${wrong}” is only a fact about the story, not a lesson people can apply in their own lives.`,
        `“${wrong}”只是关于故事的事实，而不是人们在生活中能用上的道理。`,
      ]
    : [
        `“${wrong}” summarizes a detail rather than stating the lesson the story teaches about how to act.`,
        `“${wrong}”只是复述了某个细节，没有说出故事教人怎样做事的道理。`,
      ];

const storyNot: Say = (wrong, _right, _shown, position) =>
  position === 0
    ? [
        `“${wrong}” does not prove this lesson—its events point to a different idea or none at all.`,
        `“${wrong}”并没有证明这个道理——里面的情节指向别的想法，或者没有体现这个教训。`,
      ]
    : [`In “${wrong}”, no choice and outcome show that this lesson is true.`, `在“${wrong}”中，没有哪个选择和结果能证明这个道理。`];

const figureNot: Say = (wrong) => [
  `*${wrong}* takes the comparison literally, or picks a quality the two things do not share. Ask what the two things have in common.`,
  `*${wrong}* 把比喻按字面理解了，或者选了两样东西并不共有的特点。问一问两者有什么共同之处。`,
];

const idiomNot: Say = (wrong) => [
  `*${wrong}* reads the idiom word for word, or ignores the rest of the sentence. An idiom means something different from its words: let the sentence tell you what fits.`,
  `*${wrong}* 是逐字理解习语，或者忽略了句子的其余部分。习语的意思不同于字面：让句子告诉你什么意思合适。`,
];

const idiomMeaning: Readonly<Record<string, readonly [string, string]>> = {
  "a piece of cake": ["very easy", "非常容易"],
  "under the weather": ["feeling sick", "身体不舒服"],
  "on cloud nine": ["very happy", "非常开心"],
  "in hot water": ["in trouble", "遇到麻烦"],
  "hit the hay": ["to go to bed", "去睡觉"],
  "spill the beans": ["to tell a secret", "泄露秘密"],
  "spilled the beans": ["told a secret", "泄露了秘密"],
  "break the ice": ["to make people comfortable when they first meet", "让初次见面的人放松下来"],
  "an arm and a leg": ["very expensive", "非常昂贵"],
  ...Object.fromEntries(idioms.map(([idiom, meaning]) => [idiom, meaning])),
};

const chooseIdiomNot: Say = (wrong) => {
  const means = idiomMeaning[wrong];
  if (!means) throw new Error(`no meaning for the idiom ${wrong}`);
  return [`*${wrong}* means ${means[0]}, which is not the meaning given.`, `*${wrong}* 的意思是"${means[1]}"，不是题目给出的意思。`];
};

/** thinkingReadingTopics are the topics of thinking about a text: inferences, facts and opinions, purpose, narrators, characters, lessons and figurative language. */
export const thinkingReadingTopics: readonly TopicDef[] = [
  {
    id: "making-inferences",
    title: t("Making Inferences", "推断"),
    summary: t(
      "Working out what a text does not say from clues it gives, and finding the clues.",
      "根据文中给出的线索推断它没有直接说的内容，并找出这些线索。",
    ),
    intro: t(
      "When smoke rises from the kitchen, the alarm beeps, and Dad rushes to open the window, the text never says *something is burning*—yet the clues make it unmistakable. Making inferences means combining text clues with what you know, and backing every inference with evidence.",
      "厨房冒烟、警报器嘀嘀作响、爸爸冲去开窗，文里虽没明说“锅烧糊了”，线索却一清二楚。做推断就是把文中的线索和生活常识结合起来，并用原文依据支撑每个推断。",
    ),
    prerequisites: [],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      point(
        "inferring-from-clues",
        t("Inferring from Clues", "根据线索推断"),
        t(
          "Writers do not tell you everything. An **inference** puts the clues in the text together with what you already know: wet umbrellas and muddy boots, plus what you know about weather, tell you that it rained. A good inference fits every clue; a guess that ignores the clues, or goes against them, is not an inference.\n\n> **Watch out.** Do not invent a wild guess that ignores one of the clues—every single clue in the text should fit your inference.",
          "作者不会把一切都告诉你。**推断**是把文中的线索和你已有的知识结合起来：湿雨伞和沾满泥的靴子，加上你对天气的了解，告诉你下过雨。好的推断与每条线索都相符；忽视线索或与之矛盾的猜测不是推断。\n\n> **注意。**不要凭空猜测或忽略任何一条线索——文里的每一条线索都应该和你的推断吻合。",
        ),
        pick(
          ["What can you infer from this text?", "从这段文字中你能推断出什么？"],
          [...inferenceBank, ...sceneInference],
          (right) =>
            `“${right}” fits every clue in the text.\n\n**Check.** Reread each detail in the passage and ask whether it points to “${right}”—all of them line up with it.`,
          (right) => `“${right}”与文中的每条线索都相符。\n\n**检验。**重读文中的每个细节，看看是不是都指向“${right}”——全部吻合。`,
          inferenceNot,
        ),
      ),
      point(
        "finding-evidence",
        t("Finding the Evidence", "找出依据"),
        t(
          "An inference needs **evidence**: a detail in the text that points to it. When you choose evidence, ask whether the detail would make the inference more likely. A true detail that has nothing to do with the inference is not evidence for it.\n\n> **Watch out.** A background detail (like the color of a car or where a garden sits) may be true, yet it proves nothing about the inference.",
          "推断需要**依据**：文中指向这个推断的细节。选择依据时，问一问这个细节是否让推断更可信。一个真实却与推断无关的细节不能作为依据。\n\n> **注意。**像汽车的颜色、花园的位置这类背景细节也许是真的，却不能证明这个推断。",
        ),
        pick(
          ["Which detail is the best evidence for the inference?", "哪个细节是这个推断最好的依据？"],
          [...evidenceBank, ...sceneEvidence],
          (right) =>
            `“${right}” directly supports the inference.\n\n**Check.** Ask: if you read only “${right}”, would you already suspect this inference? Yes—while the other details say nothing about it.`,
          (right) =>
            `“${right}”直接支持这个推断。\n\n**检验。**问问自己：如果只读到“${right}”，你是不是就已经能联想到这个推断？是的，而其他细节与此无关。`,
          evidenceNot,
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
    intro: t(
      "*The bridge is 420 meters long* can be verified with a tape or record, while *The bridge is the prettiest one in the state* is a personal judgment. Separating facts from opinions helps you read articles and ads critically.",
      "*The bridge is 420 meters long* 可以靠测量或查记录核实，而 *The bridge is the prettiest one in the state* 只是个人评价。分清事实和观点，能帮你更清醒地读文章和广告。",
    ),
    prerequisites: [],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      point(
        "spotting-facts",
        t("Spotting Facts", "找出事实"),
        t(
          "A **fact** can be checked and shown to be true, by measuring, counting or looking it up. An **opinion** tells what someone thinks or feels, and people can disagree with it. Words such as *best, worst, beautiful, should* and *more fun* usually signal an opinion.\n\n> **Watch out.** Even an opinion many people agree with (like *Summer is the best season*) is still an opinion—a fact must be checkable by evidence.",
          "**事实**可以通过测量、计数或查证来核实。**观点**表达某人的想法或感受，别人可以不同意。*best, worst, beautiful, should, more fun* 这样的词通常表示观点。\n\n> **注意。**就算很多人都同意的说法（如 *Summer is the best season*）也依然是观点——事实必须能用证据核实。",
        ),
        pick(
          ["Which sentence states a fact?", "哪个句子陈述的是事实？"],
          [...factBank, ...claimFacts],
          (right) =>
            `*${right}* can be checked by measuring, counting or looking it up, so it is a fact.\n\n**Check.** Ask: could two fair people disagree about *${right}* after checking the evidence? No—it is verifiable, while the other choices express judgments.`,
          (right) =>
            `*${right}* 可以通过测量、计数或查证来核实，所以是事实。\n\n**检验。**问一句：查过证据后，两个理性的人还会对 *${right}* 有分歧吗？不会——它可以核实，而其他选项都在表达评价。`,
          opinionNot,
        ),
      ),
      point(
        "spotting-opinions",
        t("Spotting Opinions", "找出观点"),
        t(
          "To test a sentence, ask: could someone prove this, or could someone reasonably disagree? *The movie lasted two hours* can be checked with a clock. *The movie was much too long* is a judgment, and another viewer might think it was just right.\n\n> **Watch out.** Watch for judgment words like *better, boring, too hard,* or *should*—even when paired with a real topic, they turn a sentence into an opinion.",
          "检验一个句子时，问一问：有人能证明它吗？还是有人可以合理地不同意？*The movie lasted two hours* 可以用钟表核实。*The movie was much too long* 是一种评判，另一位观众也许觉得刚刚好。\n\n> **注意。**留意 *better、boring、too hard、should* 这类评价词——哪怕句子谈的是真实事物，加上它们就成了观点。",
        ),
        pick(
          ["Which sentence states an opinion?", "哪个句子表达的是观点？"],
          [...opinionBank, ...claimOpinions],
          (right) =>
            `*${right}* tells what someone thinks, and others could disagree, so it is an opinion.\n\n**Check.** Imagine someone saying the opposite of *${right}*—that disagreement would be a matter of taste or judgment, not a mistake of fact.`,
          (right) =>
            `*${right}* 表达的是个人想法，别人可能不同意，所以是观点。\n\n**检验。**设想有人说出和 *${right}* 相反的看法——这种分歧属于喜好或评判，而不是事实对错。`,
          factNot,
        ),
      ),
    ],
  },
  {
    id: "authors-purpose",
    title: t("Author's Purpose", "作者的目的"),
    summary: t("Whether a text is written to inform, to persuade or to entertain.", "文本是为了告知、说服还是娱乐。"),
    intro: t(
      "A field guide explains how owls hunt, a poster urges you to recycle, and a comic strip makes you laugh. Spotting whether a writer aims to inform, persuade, or entertain helps you judge what you read.",
      "野外图鉴讲解猫头鹰如何捕猎，海报呼吁大家回收垃圾，漫画让你发笑。判断作者旨在告知、说服还是娱乐，能帮你更准确地看待所读内容。",
    ),
    prerequisites: ["fact-and-opinion"],
    encompasses: [{ topic: "fact-and-opinion", weight: 0.2 }],
    xp: 10,
    knowledgePoints: [
      point(
        "inform-persuade-entertain",
        t("Inform, Persuade or Entertain", "告知、说服还是娱乐"),
        t(
          "Authors write for a reason. To **inform** is to give facts or explain, as a science book does. To **persuade** is to try to get the reader to think or do something, as an advertisement does, often with opinions. To **entertain** is to give the reader enjoyment, as a story, poem or joke does.\n\n> **Watch out.** Do not confuse *inform* with *persuade*—an informative text can be interesting without ever telling the reader what to buy, think, or do.",
          "作者写作总有原因。**告知**是提供事实或进行解释，像科学书那样。**说服**是设法让读者相信或去做某事，像广告那样，常常带有观点。**娱乐**是让读者获得乐趣，像故事、诗歌或笑话那样。\n\n> **注意。** 不要把“告知”和“说服”混为一谈——说明性文章可以很有趣，但不会要求读者去买、去相信或去做某事。",
        ),
        choiceGenerator(
          t("What is the author's main purpose?", "作者的主要目的是什么？"),
          [...purposeBank, ...morePurposeBank],
          (right) => {
            const [en, zh] = purposeWhy.get(right) ?? ["", ""];
            return t(
              `The purpose is **${right}**. ${en}\n\n**Check.** Ask what the writer wants the reader to walk away with—new facts (*to inform*), a changed mind or action (*to persuade*), or enjoyment (*to entertain*).`,
              `目的是 **${right}**。${zh}\n\n**检验。** 问问作者希望读者读完后获得什么——新知识（告知）、改变想法或采取行动（说服），还是享受乐趣（娱乐）。`,
            );
          },
          (wrong, right, shown, position) => t(...purposeNot(wrong, right, shown, position)),
        ),
      ),
      point(
        "spotting-persuasion",
        t("Spotting Persuasion", "识别说服"),
        t(
          "A writer who wants to persuade tells the reader what to think or do, often with words such as *should, must, best, don't miss* and *you will love*. A sentence that only gives information, however useful, is not trying to persuade.\n\n> **Watch out.** Useful facts (*The library opens at nine*) only inform—persuasion pushes the reader toward a choice or opinion.",
          "想要说服的作者会告诉读者该怎么想或怎么做，常用 *should, must, best, don't miss, you will love* 这样的词。只提供信息的句子，不论多有用，都不是在说服。\n\n> **注意。** 有用的事实（如 *The library opens at nine*）只是告知——说服句子会推动读者做出某种选择或接受某种看法。",
        ),
        pick(
          ["Which sentence is trying to persuade the reader?", "哪个句子在试图说服读者？"],
          [...persuadeBank, ...claimPersuade],
          (right) =>
            `*${right}* tells the reader what to think or do.\n\n**Check.** Look for the push in *${right}* (an urging verb, command, or value judgment)—the other choices state neutral facts without urging action.`,
          (right) =>
            `*${right}* 告诉读者该怎么想或怎么做。\n\n**检验。** 找出 *${right}* 里推动读者的词（如建议、祈使或评价词）——其他选项都在平静陈述事实，没有催促读者。`,
          persuadeNot,
        ),
      ),
    ],
  },
  {
    id: "point-of-view",
    title: t("Point of View", "叙述视角"),
    summary: t("First- and third-person narrators, and who is telling a story.", "第一人称和第三人称叙述者，以及是谁在讲故事。"),
    intro: t(
      "Compare *I grabbed my backpack and ran* with *Jada grabbed her backpack and ran*. The pronouns outside quotation marks tell you right away whether a character inside the story or an outside narrator is telling it.",
      "对比 *I grabbed my backpack and ran* 和 *Jada grabbed her backpack and ran*。引号外面的代词能立刻告诉你，讲故事的是故事里的角色还是局外的叙述者。",
    ),
    prerequisites: ["nouns-and-pronouns"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      point(
        "first-or-third-person",
        t("First or Third Person", "第一人称还是第三人称"),
        t(
          "In **first person**, the narrator is in the story and uses *I, me, my, we* and *our*. In **third person**, the narrator is outside the story and uses names and *he, she* and *they*. Look at the pronouns outside of what characters say aloud.\n\n> **Watch out.** Check the narrator's pronouns (*I/we* vs. *he/she/they* and names), and ignore *I* or *you* if it only appears inside dialogue.",
          "**第一人称**叙述者在故事之中，使用 *I, me, my, we, our*。**第三人称**叙述者在故事之外，使用人名以及 *he, she, they*。看人物说话以外的代词。\n\n> **注意。**看叙述者自己用的代词（*I/we* 还是 *he/she/they* 与人名），如果 *I* 或 *you* 只出现在人物对话的引号里，不要算作叙述视角。",
        ),
        pick(
          ["What point of view is this sentence told in?", "这句话是用哪种视角叙述的？"],
          [...pointOfViewBank, ...tellingPerson],
          (right) =>
            right === "first person"
              ? "It is **first person**: the narrator uses *I, me, my, we* or *our* and is part of the story.\n\n**Check.** Spot the first-person pronoun (*I, me, my, we, our*) in the narration—it confirms the storyteller is inside the story."
              : "It is **third person**: the narrator uses names and *he, she* or *they* and stands outside the story.\n\n**Check.** Scan the narration for *I* or *we*—none appears, only names or *he/she/they*, confirming third person.",
          (right) =>
            right === "first person"
              ? "这是**第一人称**：叙述者使用 *I, me, my, we* 或 *our*，是故事中的一员。\n\n**检验。**找出叙述里的第一人称代词（*I, me, my, we, our*）——这证实讲故事的人就在故事之中。"
              : "这是**第三人称**：叙述者使用人名以及 *he, she* 或 *they*，置身故事之外。\n\n**检验。**检查叙述里有没有 *I* 或 *we*——一个也没有，只有人名或 *he/she/they*，证实是第三人称。",
          pointOfViewNot,
        ),
      ),
      point(
        "who-tells-the-story",
        t("Who Tells the Story", "谁在讲故事"),
        t(
          "A first-person narrator can tell only what that one character sees, thinks and feels. A third-person narrator may know more than any character, even what each one is thinking. The narrator does not have to be a person: an animal or even a thing can tell its own story as *I*.\n\n> **Watch out.** Do not pick a character just because the story is about them—if the narrator calls them *he* or *she*, someone outside the story is telling it.",
          "第一人称叙述者只能讲述这个人物看到、想到和感受到的。第三人称叙述者可能比任何人物知道得都多，甚至知道每个人物在想什么。叙述者不一定是人：动物甚至物体也可以用 *I* 讲自己的故事。\n\n> **注意。**不要因为故事写的是某个角色就选他当叙述者——如果叙述者称呼他 *he* 或 *she*，讲故事的就是故事之外的人。",
        ),
        pick(
          ["Who is telling this story?", "是谁在讲这个故事？"],
          [...narratorBank, ...tellingNarrator],
          (right) =>
            `The story is told by **${right}**.\n\n**Check.** Check two clues: the pronouns (*I* vs. names/*he/she*) and whether the narrator knows something a character does not—both point to **${right}**.`,
          (right) =>
            `讲故事的是 **${right}**。\n\n**检验。**核对两条线索：代词（*I* 还是人名/*he/she*）以及叙述者是否知道角色不知道的事——两条都指向 **${right}**。`,
          narratorNot,
        ),
      ),
    ],
  },
  {
    id: "characters",
    title: t("Characters", "人物"),
    summary: t("Inferring what characters are like and how they feel from what they do.", "从人物的言行推断他们的性格和感受。"),
    intro: t(
      "Rosa walks six blocks to return a lost wallet; Hana slams the door and crosses her arms. Stories rarely label a character *honest* or *angry* outright—they show traits and feelings through actions and expressions.",
      "Rosa 走过六个街区归还捡到的钱包；Hana 摔上门、抱起双臂。故事很少直接贴标签说某人“诚实”或“生气”，而是通过举动和表情把性格和感受展现出来。",
    ),
    prerequisites: ["making-inferences"],
    encompasses: [{ topic: "making-inferences", weight: 0.3 }],
    xp: 12,
    knowledgePoints: [
      point(
        "character-traits",
        t("Character Traits", "性格特点"),
        t(
          "A **trait** is what a character is like most of the time: honest, brave, selfish, curious. Writers often show traits through actions instead of naming them, so ask what kind of person would do what the character does.\n\n> **Watch out.** Match the trait to what the character *actually does* in the scene, not to a mood or an unrelated guess.",
          "**性格特点**是人物通常的样子：诚实、勇敢、自私、好奇。作者常常通过行动而不是直接点明来表现性格，所以要问：什么样的人会做出这个人物所做的事？\n\n> **注意。**性格特点必须对应人物在文中*实际做出的举动*，而不是随口猜测。",
        ),
        pick(
          ["Which word best describes the character?", "哪个词最能描述这个人物？"],
          [...traitBank, ...moreTraitBank],
          (right) =>
            `**${right}** fits what the character does.\n\n**Check.** Ask: would a **${right}** person act this exact way? Yes—the character's action directly demonstrates **${right}**.`,
          (right) =>
            `**${right}** 与人物的行为相符。\n\n**检验。**问一句：**${right}** 的人会正好这样做吗？会的——人物的举动直接体现了 **${right}**。`,
          traitNot,
        ),
      ),
      point(
        "character-feelings",
        t("Character Feelings", "人物的感受"),
        t(
          "A **feeling** is how a character is at one moment: angry, nervous, proud. Writers show feelings through faces, bodies and actions: tears, a grin, shaking hands, a slammed door. Picture the character, and name the feeling those details show.\n\n> **Watch out.** Watch body-language clues closely—red cheeks after tripping point to *embarrassed*, while biting nails before a dark window points to *nervous*.",
          "**感受**是人物在某一刻的状态：生气、紧张、自豪。作者通过表情、身体和动作来表现感受：眼泪、咧嘴笑、发抖的手、摔门。想象人物的样子，说出这些细节所表现的感受。\n\n> **注意。**细看肢体和表情线索——绊倒后脸红是 *embarrassed*，咬指甲盯黑窗则是 *nervous*。",
        ),
        pick(
          ["How does the character most likely feel?", "这个人物最可能有什么感受？"],
          [...feelingBank, ...moreFeelingBank],
          (right) =>
            `The details show that the character feels **${right}**.\n\n**Check.** Act out the character's face and body in the sentence—every clue matches feeling **${right}**.`,
          (right) => `这些细节表明人物感到 **${right}**。\n\n**检验。**在脑中比划一下句中人物的表情和动作——每个线索都指向 **${right}**。`,
          feelingNot,
        ),
      ),
    ],
  },
  {
    id: "lesson-of-a-story",
    title: t("The Lesson of a Story", "故事的寓意"),
    summary: t("The lesson or message a story teaches, beyond what happens in it.", "故事所传达的道理，而不只是故事中发生了什么。"),
    intro: t(
      "Two friends argue over a melon until a crow flies off with it—the story is about a melon, yet the lesson is that fighting over something can make everyone lose it. A story's lesson reaches beyond the characters to life itself.",
      "两个朋友为抢一个瓜吵个不停，结果乌鸦把瓜叼走了——故事讲的是抢瓜，道理却是争抢可能让双方两手空空。故事的寓意超越具体情节，指向每个人都能用上的生活道理。",
    ),
    prerequisites: ["characters"],
    encompasses: [{ topic: "characters", weight: 0.2 }],
    xp: 12,
    knowledgePoints: [
      point(
        "finding-the-lesson",
        t("Finding the Lesson", "找出寓意"),
        t(
          "Many stories, especially fables, teach a **lesson** about life. The lesson is not what happens in the story but what it teaches about how to act, and it applies to people outside the story too. Look at what a character learns or how a mistake turns out.\n\n> **Watch out.** Do not pick a sentence that just retells a plot fact (*The lion was caught in a net*)—a true lesson is a general piece of wisdom anyone could use.",
          "许多故事，尤其是寓言，会讲一个人生**道理**。道理不是故事里发生了什么，而是它教人怎样做事，并且对故事以外的人也适用。看看人物学到了什么，或者一个错误带来了什么结果。\n\n> **注意。**不要选只复述情节事实的句子（如 *The lion was caught in a net*）——真正的寓意是人人都能用上的人生道理。",
        ),
        pick(
          ["What lesson does this story teach?", "这个故事讲了什么道理？"],
          [...lessonBank, ...fableLessons],
          (right) =>
            `“${right}” is the lesson the story teaches about how to act.\n\n**Check.** Ask two questions: could someone apply “${right}” in their own life, and did the ending of the story prove it? Yes to both.`,
          (right) =>
            `“${right}”是这个故事教人如何做事的道理。\n\n**检验。**问两个问题：这句话在读者自己的生活中用得上吗？故事的结局证明了它吗？两个都是。`,
          lessonNot,
        ),
      ),
      point(
        "story-for-a-lesson",
        t("A Story for a Lesson", "符合寓意的故事"),
        t(
          "A lesson comes from what happens because of a character's choice. To match a story to a lesson, look for a choice and its result that show the lesson is true. A story where nothing turns on a choice, or where the result goes against the lesson, does not teach it.\n\n> **Watch out.** Check the *ending* of each story—a story with the right topic (like honesty or sharing) still fails if the character never learns or faces the result.",
          "道理来自人物的选择所带来的结果。要把故事和道理对应起来，就找能证明这个道理的选择及其结果。一个没有关键选择的故事，或者结果与道理相反的故事，都不能传达这个道理。\n\n> **注意。**一定要看每个故事的*结局*——就算提到了诚实或分享，如果人物没有做出相应选择并迎来结果，就没有传达这个道理。",
        ),
        pick(
          ["Which story teaches this lesson?", "哪个故事传达了这个道理？"],
          [...storyForLessonBank, ...fableStories],
          (right) =>
            `“${right}” proves the lesson through a character's choice and its outcome.\n\n**Check.** Trace the cause and effect in “${right}”—the character's choice directly leads to the result the lesson warns about or praises.`,
          (right) =>
            `“${right}”通过人物的选择和结果证明了这个道理。\n\n**检验。**梳理“${right}”里的因果——人物的选择直接带来了这个道理所赞扬或告诫的结果。`,
          storyNot,
        ),
      ),
    ],
  },
  {
    id: "similes-and-metaphors",
    title: t("Similes and Metaphors", "明喻和暗喻"),
    summary: t("Comparisons with and without *like* or *as*, and what they mean.", "带或不带 *like*、*as* 的比喻，以及它们的意思。"),
    intro: t(
      "Saying *The runner shot off like an arrow* uses a simile, while saying *The lake was a mirror* uses a metaphor. Both paint a vivid picture by borrowing one key quality from another thing.",
      "说 *The runner shot off like an arrow* 是明喻，说 *The lake was a mirror* 是暗喻。两者都是借用另一种事物的鲜明特点来描绘画面。",
    ),
    prerequisites: [],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      point(
        "similes",
        t("Similes", "明喻"),
        t(
          "A **simile** compares two different things using *like* or *as*: *as hungry as a bear*. It is not meant literally. Ask what the two things have in common: a bear is known for eating a lot, so the person is very hungry, not big or furry.\n\n> **Watch out.** Do not take the comparison word for word—focus on the *one shared quality* that fits the rest of the sentence.",
          "**明喻**用 *like* 或 *as* 比较两种不同的事物：*as hungry as a bear*。它不是字面意思。问一问两者有什么共同点：熊以食量大著称，所以这个人非常饿，而不是又大又毛茸茸。\n\n> **注意。**不要按字面照搬比喻——抓住能融入句意的那个*共同特点*。",
        ),
        pick(
          ["What does the simile mean?", "这个明喻是什么意思？"],
          [...simileBank, ...moreSimileBank],
          (right) =>
            `It means **${right}**, the quality the two things share.\n\n**Check.** Substitute **${right}** for the simile in the sentence—the plain meaning stays accurate without taking the comparison literally.`,
          (right) =>
            `意思是 **${right}**，即两者的共同特点。\n\n**检验。**把句中的明喻换成 **${right}**——句意依然准确自然，不会落入字面理解。`,
          figureNot,
        ),
      ),
      point(
        "metaphors",
        t("Metaphors", "暗喻"),
        t(
          "A **metaphor** says that one thing **is** another, without *like* or *as*: *The classroom was a zoo*. The classroom has no animals; it was wild and noisy, as a zoo is. Find the quality the writer wants you to carry over from one thing to the other.\n\n> **Watch out.** A metaphor uses *is* or *was* directly, so do not get tricked into thinking the first thing literally turned into the second.",
          "**暗喻**直接说一样东西**是**另一样东西，不用 *like* 或 *as*：*The classroom was a zoo*。教室里没有动物，而是像动物园一样乱哄哄的。找出作者想让你从一样东西转移到另一样东西上的特点。\n\n> **注意。**暗喻直接用 *is* 或 *was*，别因此以为第一样东西真的变成了第二样。",
        ),
        pick(
          ["What does the metaphor mean?", "这个暗喻是什么意思？"],
          [...metaphorBank, ...moreMetaphorBank],
          (right) =>
            `It means **${right}**.\n\n**Check.** Replace the metaphor with **${right}** in the sentence—it captures the exact trait being carried over without reading the image literally.`,
          (right) => `意思是 **${right}**。\n\n**检验。**把句中的暗喻换成 **${right}**——准确传达了被借用的特点，而不是照字面去读。`,
          figureNot,
        ),
      ),
    ],
  },
  {
    id: "idioms",
    title: t("Idioms", "习语"),
    summary: t("Common phrases whose meaning is not the meaning of their words.", "意思不等于字面意思的常用短语。"),
    intro: t(
      "If a friend tells you to *break a leg* before a play, they are wishing you good luck—not hoping you get hurt. Idioms carry a special whole-phrase meaning that you read from context.",
      "如果朋友在演出前对你说 *break a leg*，那是在祝你好运，而不是希望你摔伤。习语的整体意思不能按字面拼凑，要结合语境来读。",
    ),
    prerequisites: ["similes-and-metaphors"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      point(
        "what-idioms-mean",
        t("What Idioms Mean", "习语的意思"),
        t(
          "An **idiom** is a phrase that means something different from its words: *a piece of cake* means something easy, not dessert. Idioms must be learned one by one, but the rest of the sentence often helps: if a test was *a piece of cake*, the writer is talking about the test, not food.\n\n> **Watch out.** Reject any option that simply restates the literal words of the idiom—an idiom always means something beyond its individual words.",
          "**习语**是意思与字面不同的短语：*a piece of cake* 表示很容易，而不是甜点。习语需要一个一个地学，但句子的其余部分常常有帮助：如果考试是 *a piece of cake*，作者说的是考试，而不是食物。\n\n> **注意。**凡是直接照搬习语字面意思的选项都可以排除——习语的真正意思总是超越单个词本身。",
        ),
        pick(
          ["What does the idiom in this sentence mean?", "这句话中的习语是什么意思？"],
          [...idiomBank, ...idiomMeanings],
          (right) =>
            `It means **${right}**.\n\n**Check.** Swap the idiom out for **${right}** and reread the sentence—the whole situation now makes clear, realistic sense.`,
          (right) => `意思是 **${right}**。\n\n**检验。**把习语换成 **${right}** 再通读句子——整句话的情境立刻变得清晰合理。`,
          idiomNot,
        ),
      ),
      point(
        "choosing-an-idiom",
        t("Choosing an Idiom", "选择习语"),
        t(
          "Using an idiom means knowing what it means as a whole. Match the meaning you need to the idiom, then check that the sentence still makes sense: *Grandma is under the weather* says she is sick, while *Grandma is on cloud nine* says she is very happy.\n\n> **Watch out.** Do not pick an idiom just because one word in it matches the topic of the sentence—match the *whole idiom's* meaning to the goal.",
          "使用习语要知道它的整体意思。把需要的意思和习语对应起来，再检查句子是否通顺：*Grandma is under the weather* 是说她病了，而 *Grandma is on cloud nine* 是说她非常高兴。\n\n> **注意。**不要因为习语里恰好有个词和句子主题相关就选它——要把*整个习语*的意思和目标含义对上。",
        ),
        pick(
          ["Which idiom completes the sentence with this meaning?", "哪个习语能以这个意思补全句子？"],
          [...chooseIdiomBank, ...idiomChoices],
          (right) =>
            `**${right}** has this meaning.\n\n**Check.** Recall the whole-phrase meaning of **${right}** and plug it into the blank—it delivers the exact message asked for, whereas the other idioms express different ideas.`,
          (right) =>
            `**${right}** 就是这个意思。\n\n**检验。**回想 **${right}** 的整体含义并代入空格——它正好表达出题目要求的意思，而其他习语表达的是别的意思。`,
          chooseIdiomNot,
        ),
      ),
    ],
  },
];
