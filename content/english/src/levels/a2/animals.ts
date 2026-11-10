// A2, unit 6: Animals and Pets. Pets, wildlife, how animals live, farm animals and care; the past continuous. The
// conjunctions and the writing of the unit are existing topics.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { vocabularyTopic, word } from "../words.ts";
import { combos, fill } from "./kit.ts";

const pets = vocabularyTopic({
  id: "a2-words-pets",
  title: t("Pets", "宠物"),
  summary: t(
    "Pets: hamsters, parrots, turtles, puppies and kittens; cages and feeding; tails, fur, wings and beaks.",
    "宠物：仓鼠、鹦鹉、乌龟、小狗和小猫；笼子和喂食；尾巴、皮毛、翅膀和喙。",
  ),
  prerequisites: ["pre-a1-words-animals"],
  words: [
    word(
      "pet pets",
      "an animal that lives with you at home",
      "宠物",
      "Do you have a {pet}? — Yes, a cat.|cage beak | Dogs and cats are popular {pets}.|cages tails | My {pet} rabbit is called Snowy.|cage fur",
      "cage puppy",
    ),
    word(
      "hamster hamsters",
      "a small furry animal like a big mouse, kept as a pet",
      "仓鼠",
      "My {hamster} sleeps all day and runs on its wheel at night.|parrot turtle | A {hamster} keeps food in its cheeks.|parrot turtle | We keep our {hamsters} in a cage in my room.|parrots turtles",
      "parrot kitten",
    ),
    word(
      "parrot parrots",
      "a bird with bright feathers that can learn to say words",
      "鹦鹉",
      'Our {parrot} can say "Hello" and "Good morning".|hamster turtle | {Parrots} have green, red and blue feathers.|Hamsters Turtles | The {parrot} flew out of its cage.|hamster turtle',
      "hamster turtle",
    ),
    word(
      "turtle turtles",
      "an animal with a hard shell that moves slowly",
      "乌龟；海龟",
      "A {turtle} carries its house on its back.|parrot kitten | Sea {turtles} lay their eggs on the beach.|parrots kittens | My {turtle} is fifty years old!|kitten puppy",
      "hamster parrot",
    ),
    word(
      "puppy puppies",
      "a young dog",
      "小狗",
      "Our dog had five {puppies}.|kittens parrots | The {puppy} chewed my shoe!|kitten parrot | A {puppy} needs a lot of sleep and a lot of play.|parrot turtle",
      "kitten pet",
    ),
    word(
      "kitten kittens",
      "a young cat",
      "小猫",
      "The {kitten} is playing with a ball of wool.|puppy parrot | Our cat had three {kittens}: two black and one white.|puppies parrots | Be gentle with the {kitten}. She's very small.|puppy turtle",
      "puppy pet",
    ),
    word(
      "cage cages",
      "a box made of metal bars to keep a bird or an animal in",
      "笼子",
      "The bird is singing in its {cage}.|tail beak | Close the {cage} door, or the hamster will run away!|tail fur | Lions in old zoos lived in small {cages}.|tails beaks",
      "pet tail",
    ),
    word(
      "feed feeds fed feeding",
      "to give food to a person or an animal",
      "喂养",
      "Don't forget to {feed} the fish.|cage tail | I {fed} the cat at seven o'clock.|caged tailed | Please don't {feed} the animals at the zoo.|cage tail",
      "eat give",
    ),
    word(
      "tail tails",
      "the long part at the back of an animal's body",
      "尾巴",
      "The dog is wagging its {tail}.|beak fur | Monkeys can hold branches with their {tails}.|beaks wings | A mouse has a long thin {tail}.|beak wing",
      "wing beak",
    ),
    word(
      "fur",
      "the soft hair on an animal's body",
      "毛皮",
      "My cat has soft white {fur}.|beak wing | In winter, the fox grows thick {fur}.|wings beaks | The dog's {fur} is wet from the rain.|beak cage",
      "tail wing",
    ),
    word(
      "wing wings",
      "one of the two parts a bird or an insect uses to fly",
      "翅膀",
      "The bird opened its {wings} and flew away.|tails cages | A butterfly has beautiful {wings}.|tails cages | The chicken hurt its {wing}, so it couldn't fly.|tail cage",
      "tail beak",
    ),
    word(
      "beak beaks",
      "the hard pointed mouth of a bird",
      "喙；鸟嘴",
      "The bird picked up the seed with its {beak}.|tail fur | Parrots have strong curved {beaks}.|tails cages | A duck's {beak} is flat and yellow.|tail fur",
      "wing tail",
    ),
  ],
});

const wildlife = vocabularyTopic({
  id: "a2-words-wildlife",
  title: t("Wildlife", "野生动物"),
  summary: t(
    "Wolves, foxes, deer, whales, dolphins, sharks, eagles, owls, bees, butterflies, spiders and ants.",
    "狼、狐狸、鹿、鲸、海豚、鲨鱼、鹰、猫头鹰、蜜蜂、蝴蝶、蜘蛛和蚂蚁。",
  ),
  prerequisites: ["a1-words-wild-animals", "a2-words-pets"],
  words: [
    word(
      "wolf wolves",
      "a wild animal like a big dog that lives and hunts in a group",
      "狼",
      "The {wolves} howled at the moon.|owls eagles | In the story, the big bad {wolf} eats Grandma.|owl eagle | A {wolf} looks like a big gray dog.|whale shark",
      "fox deer",
    ),
    word(
      "fox foxes",
      "a wild animal like a small dog, with red fur and a long tail",
      "狐狸",
      "A {fox} has red fur and a long tail.|whale shark | The {fox} took a chicken from the farm.|whale dolphin | {Foxes} often come into cities at night.|Whales Sharks",
      "wolf deer",
    ),
    word(
      "deer",
      "a wild animal with long thin legs; the male has antlers",
      "鹿",
      "We saw three {deer} in the forest.|sharks whales | A baby {deer} is called a fawn.|shark whale | The {deer} ran away when it heard us.|shark dolphin",
      "fox wolf",
    ),
    word(
      "whale whales",
      "the biggest animal in the sea",
      "鲸",
      "The blue {whale} is the biggest animal in the world.|ant bee | We went on a boat to see the {whales}.|ants spiders | {Whales} come up to breathe air.|Ants Spiders",
      "dolphin shark",
    ),
    word(
      "dolphin dolphins",
      "a clever sea animal that is friendly to people",
      "海豚",
      "{Dolphins} are very clever and friendly.|Spiders Ants | A {dolphin} jumped out of the water next to our boat.|spider bee | {Dolphins} talk to each other with clicks and whistles.|Ants Spiders",
      "whale shark",
    ),
    word(
      "shark sharks",
      "a big fish with sharp teeth",
      "鲨鱼",
      "Don't swim here! I saw a {shark}!|deer owl | A {shark} has many rows of sharp teeth.|deer owl | Some {sharks} are as long as a bus.|owls bees",
      "whale dolphin",
    ),
    word(
      "eagle eagles",
      "a big bird that hunts small animals and can see very far",
      "鹰",
      "The {eagle} flew high above the mountains.|ant spider | An {eagle} can see a rabbit from very far away.|ant shark | {Eagles} build their nests on high rocks.|Ants Sharks",
      "owl parrot",
    ),
    word(
      "owl owls",
      "a bird with big eyes that hunts at night",
      "猫头鹰",
      'An {owl} hunts at night.|ant whale | {Owls} have very big eyes.|Ants Sharks | We heard an {owl} in the trees: "Hoo, hoo!"|ant eagle',
      "eagle parrot",
    ),
    word(
      "bee bees",
      "a flying insect that makes honey",
      "蜜蜂",
      "{Bees} make honey.|Spiders Sharks | A {bee} stung me on the arm!|spider fox | The {bees} are flying from flower to flower.|spiders wolves",
      "ant butterfly",
    ),
    word(
      "butterfly butterflies",
      "an insect with big colorful wings",
      "蝴蝶",
      "A {butterfly} has four colorful wings.|spider ant | The garden is full of {butterflies} in summer.|spiders ants | A caterpillar turns into a {butterfly}.|spider bee",
      "bee spider",
    ),
    word(
      "spider spiders",
      "a small animal with eight legs that makes webs",
      "蜘蛛",
      "A {spider} has eight legs.|bee butterfly | There's a big {spider} in the bath!|bee whale | {Spiders} catch flies in their webs.|Bees Butterflies",
      "ant bee",
    ),
    word(
      "ant ants",
      "a very small insect that lives in big groups",
      "蚂蚁",
      "{Ants} can carry things much heavier than they are.|Whales Owls | There are {ants} on the cake!|whales owls | An {ant} is very small, but it is very strong.|owl eagle",
      "bee spider",
    ),
  ],
});

const animalLife = vocabularyTopic({
  id: "a2-words-animal-life",
  title: t("How Animals Live", "动物怎样生活"),
  summary: t(
    "Hunting, hiding, nests, laying eggs, digging, chasing and biting; scared, huge, tiny, sharp and soft.",
    "捕猎、躲藏、巢、下蛋、挖、追赶和咬；害怕的、巨大的、极小的、锋利的和柔软的。",
  ),
  prerequisites: ["a2-words-wildlife"],
  words: [
    word(
      "hunt hunts hunted hunting",
      "to chase and catch animals for food",
      "捕猎",
      "Lions {hunt} in groups.|lay dig | Owls go {hunting} at night.|laying digging | The fox {hunted} for mice in the field.|laid dug",
      "chase hide",
    ),
    word(
      "hide hides hid hidden hiding",
      "to go where no one can see you; to put something where no one can find it",
      "躲藏；藏",
      "The cat {hid} under the bed.|laid hunted | Where did you {hide} the chocolate?|hunt dig | The rabbit is {hiding} in its hole.|laying hunting",
      "hunt dig",
    ),
    word(
      "nest nests",
      "a home that a bird builds for its eggs",
      "巢；窝",
      "There are three eggs in the bird's {nest}.|tail fur | Birds build their {nests} with sticks and grass.|tails beaks | The eagle's {nest} is high on a rock.|tail fur",
      "cage wing",
    ),
    word(
      "lay lays laid laying",
      "to put an egg out of the body",
      "下（蛋）；放",
      "Our hens {lay} an egg every day.|hunt dig | The turtle {laid} a hundred eggs in the sand.|hunted hid | Please {lay} the baby on the bed.|hunt dig",
      "dig hide",
    ),
    word(
      "dig digs dug digging",
      "to make a hole in the ground",
      "挖",
      "The dog {dug} a hole in the garden.|hunted bit | Rabbits {dig} holes to live in.|bite chase | We're {digging} for treasure on the beach!|biting chasing",
      "hide lay",
    ),
    word(
      "chase chases chased chasing",
      "to run after someone or something to catch them",
      "追赶",
      "The dog {chased} the cat up a tree.|laid dug | Cats like to {chase} mice.|lay dig | The children are {chasing} each other in the park.|laying digging",
      "hunt bite",
    ),
    word(
      "bite bites bitten biting",
      "to cut something with your teeth",
      "咬",
      "Be careful! That dog {bites}.|lays digs | I was {bitten} by a mosquito.|laid dug | Don't {bite} your nails.|lay dig",
      "chase hunt",
    ),
    word(
      "scared",
      "afraid",
      "害怕的",
      "I'm {scared} of spiders.|huge sharp | The little boy was {scared} of the dark.|huge sharp | Don't be {scared}. The dog is friendly.|huge tiny",
      "huge sharp",
    ),
    word(
      "huge",
      "very, very big",
      "巨大的",
      "An elephant is {huge}.|tiny scared | They live in a {huge} house with twenty rooms.|tiny scared | A {huge} wave hit the boat.|tiny soft",
      "tiny soft",
    ),
    word(
      "tiny tinier tiniest",
      "very, very small",
      "极小的",
      "An ant is {tiny}.|huge scared | The baby has {tiny} hands.|huge sharp | We stayed in a {tiny} room. There was only space for a bed.|huge scared",
      "huge sharp",
    ),
    word(
      "sharp sharper sharpest",
      "with a thin edge or point that cuts easily",
      "锋利的；尖的",
      "Sharks have {sharp} teeth.|soft scared | Be careful! That knife is very {sharp}.|soft scared | Cats have {sharp} claws.|soft scared",
      "soft huge",
    ),
    word(
      "soft softer softest",
      "not hard; nice to touch",
      "柔软的",
      "The kitten's fur is very {soft}.|sharp huge | I like a {soft} pillow.|sharp scared | This bread is fresh and {soft}.|sharp scared",
      "sharp tiny",
    ),
  ],
});

const farmAndCare = vocabularyTopic({
  id: "a2-words-farm-and-care",
  title: t("Farm Animals and Care", "农场动物和照料"),
  summary: t(
    "Goats, hens, donkeys and lambs; fields and fences; vets and caring; alive, dead and dying.",
    "山羊、母鸡、驴和小羊；田野和篱笆；兽医和照顾；活着的、死的和死去。",
  ),
  prerequisites: ["a2-words-animal-life"],
  words: [
    word(
      "goat goats",
      "a farm animal with horns that gives milk",
      "山羊",
      "The {goat} ate my hat!|fence field | We make cheese from {goat} milk.|fence vet | {Goats} can climb very steep rocks.|Fences Fields",
      "lamb donkey",
    ),
    word(
      "hen hens",
      "a female chicken",
      "母鸡",
      'Our {hens} lay eggs every morning.|fences vets | The {hen} is sitting on her eggs.|fence field | A {hen} says "cluck, cluck".|fence field',
      "goat lamb",
    ),
    word(
      "donkey donkeys",
      "an animal like a small horse with long ears",
      "驴",
      'The {donkey} carried our bags up the mountain.|fence field | A {donkey} has long ears and says "hee-haw".|fence vet | The children rode {donkeys} on the beach.|fences fields',
      "goat hen",
    ),
    word(
      "field fields",
      "an area of land where crops grow or animals eat grass",
      "田野；牧场",
      "The cows are eating grass in the {field}.|vet hen | There are {fields} of rice near the village.|vets hens | Farmers work in the {fields} all day.|vets lambs",
      "fence farm",
    ),
    word(
      "vet vets",
      "a doctor for animals",
      "兽医",
      "Our dog is sick. Let's take him to the {vet}.|field fence | I want to be a {vet} because I love animals.|field fence | The {vet} gave the cat some medicine.|field fence",
      "nurse farmer",
    ),
    word(
      "care cares cared caring",
      "to look after someone; to think something is important",
      "照顾；在乎",
      "Who will {care} for the dog when we're away?|die fence | Nurses take {care} of sick people.|fence field | I don't {care} what they say.|die fence",
      "die feed",
    ),
    word(
      "fence fences",
      "a wall of wood or wire around a field or a garden",
      "篱笆；栅栏",
      "The horse jumped over the {fence}.|vet hen | There is a high {fence} around the farm.|vet lamb | Paint the {fence} white.|vet lamb",
      "field cage",
    ),
    word(
      "alive",
      "living, not dead",
      "活着的",
      "The fish is still {alive}! Put it back in the water.|dead dying | My great-grandma is still {alive}. She's ninety-eight.|dead dying | Plants need water to stay {alive}.|dead dying",
      "dead die",
    ),
    word(
      "dead",
      "not living any more",
      "死的",
      "The plant is {dead}. It's brown and dry.|alive dying | We found a {dead} bird in the garden.|alive caring | The battery is {dead}. I need a new one.|alive caring",
      "alive die",
    ),
    word(
      "die dies died dying",
      "to stop living",
      "死亡",
      "Plants {die} without water.|care fence | My old dog {died} last year. I miss him.|cared fenced | The flowers are {dying}. Give them some water.|caring feeding",
      "care feed",
    ),
    word(
      "lamb lambs",
      "a young sheep",
      "小羊；羔羊",
      "A {lamb} is a baby sheep.|goat hen | The {lambs} are playing in the field.|vets fences | Mary had a little {lamb}.|vet fence",
      "goat hen",
    ),
  ],
});

// The past continuous.

/** pcSubjects are a subject, its form of be, the other form, and whether it keeps its capital inside a sentence. */
const pcSubjects: readonly (readonly [string, string, string, boolean])[] = [
  ["I", "was", "were", true],
  ["We", "were", "was", false],
  ["Tom", "was", "were", true],
  ["My parents", "were", "was", false],
  ["Lily", "was", "were", true],
  ["The children", "were", "was", false],
  ["She", "was", "were", false],
];

/** pcActions are a verb, its -ing form, its past simple and the rest of the action. */
const pcActions: readonly (readonly [string, string, string, string])[] = [
  ["walk", "walking", "walked", "in the park"],
  ["read", "reading", "read", "a book"],
  ["have", "having", "had", "dinner"],
  ["watch", "watching", "watched", "TV"],
  ["play", "playing", "played", "in the garden"],
  ["cook", "cooking", "cooked", "noodles"],
  ["wait", "waiting", "waited", "for the bus"],
  ["feed", "feeding", "fed", "the hamster"],
];

/** pcEvents are the subject of a short event, its verb in the past simple, in the past continuous, in its first form, and the rest. */
const pcEvents: readonly (readonly [string, string, string, string, string])[] = [
  ["the phone", "rang", "was ringing", "ring", ""],
  ["the lights", "went", "were going", "go", " out"],
  ["someone", "knocked", "was knocking", "knock", " on the door"],
  ["a fox", "ran", "was running", "run", " past"],
  ["it", "started", "was starting", "start", " to rain"],
];

const inside = ([subject, , , keep]: readonly [string, string, string, boolean]) => (keep ? subject : subject.toLowerCase());

const pcRows = combos(120, pcSubjects, pcActions, pcEvents);

const pcFormBank: readonly ChoiceItem[] = pcRows
  .slice(0, 40)
  .map(
    ([s, [verb, ing, , rest], [es, past, , , after]]): ChoiceItem => [
      `When ${es} ${past}${after}, ${inside(s)} ___ ${rest}. (${verb})`,
      `${s[1]} ${ing}`,
      [`${s[2]} ${ing}`, `${s[1]} ${verb}`],
    ],
  );

const pcWhichBank: readonly ChoiceItem[] = pcRows
  .slice(40, 80)
  .map(
    ([s, [verb, ing, simple, rest], [es, past, cont, base, after]]): ChoiceItem => [
      `${s[0]} ___ (${verb}) ${rest} when ${es} ___ (${base})${after}.`,
      `${s[1]} ${ing} … ${past}`,
      [`${simple} … ${cont}`, `${s[1]} ${ing} … ${cont}`],
    ],
  );

const pcTypedBank: readonly TypedItem[] = pcRows
  .slice(80, 120)
  .map(([s, [verb, ing, , rest], [es, past, cont, base, after]]): TypedItem => {
    const long = `${s[1]} ${ing} ${rest}`;
    const short = `${es} ${past}${after}`;
    return {
      shown: `${s[0]} / ${verb} ${rest} / when / ${es} ${base}${after}`,
      accepted: [`${s[0]} ${long} when ${short}.`, `When ${short}, ${inside(s)} ${long}.`],
      canonical: `${s[0]} ${long} when ${short}.`,
      wrong: [`${s[0]} ${s[2]} ${ing} ${rest} when ${short}.`, `${s[0]} ${long} when ${es} ${cont}${after}.`],
    };
  });

const pastContinuous: TopicDef = {
  id: "past-continuous",
  title: t("The Past Continuous", "过去进行时"),
  summary: t(
    "I was walking home when I saw the fox. Was or were with -ing for something in progress when something else happened.",
    "I was walking home when I saw the fox. was / were 加 -ing 表示另一件事发生时正在进行的动作。",
  ),
  prerequisites: ["past-simple-irregular", "present-continuous"],
  encompasses: [
    { topic: "present-continuous", weight: 0.3 },
    { topic: "past-simple-irregular", weight: 0.2 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "form",
      t("Was or were with -ing", "was 或 were 加 -ing"),
      t(
        "The past continuous is *was* or *were* with the *-ing* form of a verb:\n\n- *I*, *he*, *she*, *it* and one person: *was* — *I was reading. Tom was cooking.*\n- *we*, *you*, *they* and more than one: *were* — *We were walking. My parents were watching TV.*\n\nIt is for something that was going on at a time in the past: *When the phone rang, I was having dinner.*",
        "过去进行时由 *was* 或 *were* 加动词的 *-ing* 形式构成：\n\n- *I*、*he*、*she*、*it* 和单个人用 *was*：*I was reading. Tom was cooking.*\n- *we*、*you*、*they* 和多个人用 *were*：*We were walking. My parents were watching TV.*\n\n它表示过去某个时候正在进行的事：*When the phone rang, I was having dinner.*\n\n中文用“正在……的时候”表达，英语要用 *was / were* 加 *-ing*，不能只写 *was walk*。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), pcFormBank, (right, shown) =>
        t(fill(shown, right), `${fill(shown, right)}（正在进行的动作用 was / were + -ing）`),
      ),
    ),
    point(
      "which",
      t("The long action and the short one", "长动作和短动作"),
      t(
        "When two things happen in the past, the longer one that was already going on takes the past continuous, and the short one that happened in the middle of it takes the past simple:\n\n*I was walking home* (long) *when I saw the fox* (short).\n\nThe short one usually comes after *when*.",
        "过去的两件事同时出现时，已经在进行的、较长的动作用过去进行时，中途突然发生的、较短的动作用一般过去时：\n\n*I was walking home*（长）*when I saw the fox*（短）。\n\n短动作通常放在 *when* 后面。",
      ),
      choiceGenerator(t("Choose the verbs for the two gaps.", "选出填入两个空白处的动词。"), pcWhichBank, (right, shown) => {
        const [first, second] = right.split(" … ");
        const done = shown.replace(/___ \([^)]*\)/u, `*${first}*`).replace(/___ \([^)]*\)/u, `*${second}*`);
        return t(done, `${done}（长动作用过去进行时，短动作用一般过去时）`);
      }),
    ),
    point(
      "write",
      t("Writing a sentence with when", "用 when 写句子"),
      t(
        "Write one sentence from the note. The first action was going on, so it takes *was* or *were* with *-ing*; the action after *when* takes the past simple. You may also start with *When*: *When the phone rang, I was reading a book.*",
        "根据笔记写一个句子。第一个动作当时正在进行，用 *was / were* 加 *-ing*；*when* 后面的动作用一般过去时。也可以用 *When* 开头：*When the phone rang, I was reading a book.*",
      ),
      typedGenerator("sentence", t("Write a sentence from the note.", "根据笔记写一个句子。"), pcTypedBank, (right) =>
        t(right, `${right}（正在进行的动作 + when + 一般过去时）`),
      ),
    ),
  ],
};

/** topics are the topics of the unit Animals and Pets. */
export const topics: readonly TopicDef[] = [pets.topic, wildlife.topic, animalLife.topic, farmAndCare.topic, pastContinuous];

/** vocabulary are the words the unit Animals and Pets teaches. */
export const vocabulary: readonly WordBatch[] = [pets.batch, wildlife.batch, animalLife.batch, farmAndCare.batch];
