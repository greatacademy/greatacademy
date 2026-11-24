// A2, unit 6: Animals and Pets. Pets, wildlife, how animals live, farm animals and care; the past continuous. The
// conjunctions and the writing of the unit are existing topics.

import { type Text, type TopicDef, t } from "@ga/content";
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
  intro: t(
    'Mia has a **hamster** that runs on its wheel all night, and her brother has a **parrot** that says "Hi!" from its **cage**. These words help you talk about the animals people keep and how to look after them.',
    "米娅养了一只整夜在跑轮上跑的 **hamster**（仓鼠），她哥哥养了一只在 **cage**（笼子）里说“Hi!”的 **parrot**（鹦鹉）。这些词帮你谈论人们养的动物以及怎样照顾它们。",
  ),
  prerequisites: ["pre-a1-words-animals"],
  words: [
    word(
      "pet pets",
      "an animal that lives with you at home",
      "宠物",
      "A {pet} can be a dog, a cat, a bird or even a fish. | Dogs and cats are the most popular {pets} in our town.|kittens cages | My {pet} rabbit lives with us in the house.",
      "kitten cage",
    ),
    word(
      "hamster hamsters",
      "a small furry animal like a big mouse, kept as a pet",
      "仓鼠",
      "My {hamster} sleeps all day and runs on its wheel at night. | A {hamster} keeps food in its soft, furry cheeks. | Our two {hamsters} dig tunnels in their bedding, like little mice.|parrots turtles",
      "parrot turtle",
    ),
    word(
      "parrot parrots",
      "a bird with bright feathers that can learn to say words",
      "鹦鹉",
      'Our {parrot} can say "Hello" and "Good morning". | {Parrots} have bright green, red and blue feathers.|Hamsters Turtles | The {parrot} opened its wings and flew out of its cage.',
      "hamster turtle",
    ),
    word(
      "turtle turtles",
      "an animal with a hard shell that moves slowly",
      "乌龟；海龟",
      "A {turtle} carries its hard shell on its back. | Sea {turtles} swim to the beach to lay their eggs.|hamsters parrots | My {turtle} moves so slowly that it takes ten minutes to cross the garden.",
      "hamster parrot",
    ),
    word(
      "puppy puppies",
      "a young dog",
      "小狗",
      "Our dog had five {puppies}.|kittens parrots | The {puppy} chewed my shoe and then barked at it! | A {puppy} grows into a big dog in about a year.",
      "kitten parrot",
    ),
    word(
      "kitten kittens",
      "a young cat",
      "小猫",
      "The {kitten} is purring as it plays with a ball of wool. | Our cat had three {kittens}: two black and one white.|puppies parrots | The little {kitten} will grow into a big cat.",
      "puppy parrot",
    ),
    word(
      "cage cages",
      "a box made of metal bars to keep a bird or an animal in",
      "笼子",
      "The bird sings in its {cage} behind the metal bars. | Lock the {cage}, or the hamster will squeeze out between the bars! | Lions in old zoos lived in small {cages} made of iron bars.|pets tails",
      "pet tail",
    ),
    word(
      "feed feeds fed feeding",
      "to give food to a person or an animal",
      "喂养",
      "Please don't {feed} the animals at the zoo; the keepers give them the right food. | I {fed} the cat a bowl of fish at seven o'clock.|ate washed | We {feed} our dog meat and rice twice a day.",
      "eat wash",
    ),
    word(
      "tail tails",
      "the long part at the back of an animal's body",
      "尾巴",
      "The happy dog is wagging its {tail}. | Monkeys can hold branches with their long {tails}.|wings beaks | A mouse has a long, thin {tail} at the back of its body.",
      "wing beak",
    ),
    word(
      "fur",
      "the soft hair on an animal's body",
      "毛皮",
      "My cat has soft white {fur} that I love to stroke. | In winter, the fox grows thick {fur} to keep warm. | The dog's {fur} is wet and muddy from the rain.",
      "feathers shell",
    ),
    word(
      "wing wings",
      "one of the two parts a bird or an insect uses to fly",
      "翅膀",
      "The bird opened its {wings} and flew away.|tails beaks | A butterfly has four bright {wings}.|tails beaks | The chicken hurt its {wing}, so it couldn't fly.",
      "tail beak",
    ),
    word(
      "beak beaks",
      "the hard pointed mouth of a bird",
      "喙；鸟嘴",
      "The bird picked up the seed with its {beak}. | Parrots crack nuts with their strong, curved {beaks}.|tails wings | A duck's {beak} is flat and yellow, and it opens wide to eat.",
      "tail wing",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "Some of these words name a whole animal (*pet*, *hamster*), some a thing for it (*cage*) and some a part of its body (*tail*, *beak*). First ask whether the gap needs an animal, a thing or a body part.",
        "这些词有的指整只动物（*pet*、*hamster*），有的指给动物用的东西（*cage*），有的指身体部位（*tail*、*beak*）。先判断空格需要的是动物、东西还是身体部位。",
      ),
      meaning: t(
        "*Puppy* and *kitten* are both young animals: check whether the meaning says a young dog or a young cat.",
        "*puppy* 和 *kitten* 都是幼小的动物：看清释义说的是小狗还是小猫。",
      ),
      spell: t(
        "Many pet words double a letter in the middle: par**r**ot, pup**p**y, kit**t**en.",
        "不少宠物词中间有双写字母：par**r**ot、pup**p**y、kit**t**en。",
      ),
    },
    notes: `
      pet|animals of many kinds, from dogs to fish;the dogs and cats people like to keep;a rabbit living with a family in the house|a pet is any animal you keep at home; a kitten is only a young cat|pet 指在家里养的任何动物；kitten 只是小猫|kitten=kitten is a young cat, one kind of animal, not any animal you keep at home=kitten 是小猫，只是一种动物，不是在家养的任何动物;cage=cage is a box of metal bars an animal is kept in, not the animal itself=cage 是关动物的金属笼子，不是动物本身|pet|the short e, as in *wet*|短元音 e，和 *wet* 一样
      hamster|a small pet running on its wheel at night;a furry pet keeping food in its cheeks;two little pets digging tunnels like mice|a hamster is a furry pet like a big mouse; a parrot is a bird|hamster 是像大老鼠的毛茸茸宠物；parrot 是鸟|parrot=parrot is a bird with feathers and wings, not a small furry animal like a mouse=parrot 是长羽毛和翅膀的鸟，不是像老鼠的毛茸茸小动物;turtle=turtle has a hard shell and no fur, not a small furry animal like a mouse=turtle 有硬壳、没有毛，不是像老鼠的毛茸茸小动物|ham · ster|the ending -ster, not -sta|结尾是 -ster，不是 -sta
      parrot|a pet that can say words;bright green, red and blue feathers;a pet flying out of its cage|a parrot is a bird that can learn words; a hamster is furry and cannot fly|parrot 是会学说话的鸟；hamster 毛茸茸，不会飞|hamster=hamster is a small furry animal with no feathers or wings, not a bird=hamster 是没有羽毛和翅膀的毛茸茸小动物，不是鸟;turtle=turtle is a slow animal with a hard shell, not a bird with bright feathers=turtle 是背着硬壳慢慢爬的动物，不是羽毛鲜艳的鸟|par · rot|the double r in the middle|中间双写 r
      turtle|an animal carrying a hard shell on its back;sea animals laying their eggs on the beach;a pet so slow it takes ten minutes to cross a garden|a turtle has a hard shell and moves slowly; a hamster is soft and quick|turtle 有硬壳、爬得慢；hamster 毛软、动作快|hamster=hamster is a quick, furry little animal with no shell=hamster 是动作敏捷、毛茸茸的小动物，没有硬壳;parrot=parrot is a bird that flies, not a slow animal with a shell=parrot 是会飞的鸟，不是背着壳慢慢爬的动物|tur · tle|the ending -tle, said like -tl|结尾是 -tle，读作 -tl
      puppy|the five babies of a dog;a young animal that chewed a shoe and barked;a young animal that grows into a big dog|a puppy is a young dog; a kitten is a young cat|puppy 是小狗；kitten 是小猫|kitten=kitten is a young cat, so it never barks or grows into a dog=kitten 是小猫，不会汪汪叫，也不会长成狗;parrot=parrot is a bird, not a young dog=parrot 是鸟，不是小狗|pup · py|the double p, and y changing to -ies for more than one|双写 p，复数要把 y 变成 -ies
      kitten|a young animal purring as it plays with wool;the three babies of a cat;a young animal that grows into a big cat|a kitten is a young cat; a puppy is a young dog|kitten 是小猫；puppy 是小狗|puppy=puppy is a young dog, so it barks and grows into a dog, not a cat=puppy 是小狗，会汪汪叫，长大是狗，不是猫;parrot=parrot is a bird with feathers, not a baby cat=parrot 是长羽毛的鸟，不是小猫|kit · ten|the double t in the middle|中间双写 t
      cage|a bird singing behind metal bars;a box a hamster could squeeze out of between the bars;small boxes of iron bars for lions|a cage is the box of bars; a pet is the animal kept in it|cage 是金属笼子；pet 是关在里面的动物|pet=pet is the animal you keep, not the box of bars it is kept in=pet 是养的动物，不是关它的笼子;tail=tail is a part of an animal's body, not a box an animal lives in=tail 是动物身体的一部分，不是动物住的笼子|cage|the silent e at the end that makes a say its name|词尾不发音的 e 让 a 读字母本音
      feed|keepers giving zoo animals the right food;a bowl of fish given to a cat;meat and rice given to a dog twice a day|you feed an animal; the animal eats the food|人 feed（喂）动物，动物自己 eat（吃）|eat/ate=eat means to put food in your own mouth, not to give food to an animal=eat 是自己把食物吃进嘴里，不是给动物喂食;wash/washed=wash means to clean something with water, not to give it food=wash 是用水清洗，不是给食物|feed|the double e, and the past *fed*, not *feeded*|两个 e；过去式是 *fed*，不是 *feeded*
      tail|a happy dog wagging something;the long parts monkeys hold branches with;the long, thin part at the back of a mouse|a tail is the long part at the back; a wing is for flying|tail 是身后长长的部分；wing 用来飞|wing=wing is the part a bird or an insect flies with, not the long part at the back of an animal=wing 是鸟或昆虫用来飞的部分，不是动物身后长长的部分;beak=beak is a bird's hard mouth at the front, not a part at the back of the body=beak 是鸟前面坚硬的嘴，不是身体后面的部分|tail|ai for the long a sound, not *tale*, the word for a story|ai 发长 a 音，别写成表示故事的 *tale*
      fur|soft white hair on a cat;thick winter hair that keeps a fox warm;a dog's hair wet and muddy from rain|fur is soft hair on animals; feathers cover birds|fur 是动物身上的软毛；feathers 是鸟的羽毛|feathers=feathers are what cover a bird, not the soft hair of animals like cats and dogs=feathers 是鸟身上的羽毛，不是猫狗这类动物的软毛;shell=shell is a hard cover like a turtle's, not soft hair=shell 是乌龟那样的硬壳，不是柔软的毛|fur|ur, not er or ir|拼作 ur，不是 er 或 ir
      wing|the parts a bird opened to fly away;the four bright parts of a butterfly;the part a hurt chicken could not fly with|wings are for flying; a tail is at the back of the body|wing 用来飞；tail 在身体后面|tail=tail is the part at the back of the body, not the part used for flying=tail 是身体后面的部分，不是用来飞的部分;beak=beak is a bird's hard mouth, not the part it flies with=beak 是鸟坚硬的嘴，不是用来飞的部分|wing|the letters -ing belong to the word itself here; it is not a verb ending|这里的 -ing 是单词本身，不是动词词尾
      beak|the part a bird picks up seeds with;the strong, curved parts parrots crack nuts with;a duck's flat yellow mouth|a beak is a bird's mouth; wings are for flying|beak 是鸟的嘴；wing 用来飞|tail=tail is at the back of the body and cannot pick up or crack food=tail 长在身体后面，不能啄起或咬开食物;wing=wing is used for flying, not for eating=wing 是用来飞的，不是用来吃东西的|beak|ea for the long e sound, as in *speak*|ea 发长 e 音，和 *speak* 一样
    `,
  },
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

// Seven subjects, eight actions and five events have no common factor, so 280 rows give every combination once.
const pcRows = combos(280, pcSubjects, pcActions, pcEvents);

const pcFormBank: readonly ChoiceItem[] = pcRows.map(
  ([s, [verb, ing, , rest], [es, past, , , after]]): ChoiceItem => [
    `When ${es} ${past}${after}, ${inside(s)} ___ ${rest}. (${verb})`,
    `${s[1]} ${ing}`,
    [`${s[2]} ${ing}`, `${s[1]} ${verb}`],
  ],
);

const pcWhichBank: readonly ChoiceItem[] = pcRows.map(
  ([s, [verb, ing, simple, rest], [es, past, cont, base, after]]): ChoiceItem => [
    `${s[0]} ___ (${verb}) ${rest} when ${es} ___ (${base})${after}.`,
    `${s[1]} ${ing} … ${past}`,
    [`${simple} … ${cont}`, `${s[1]} ${ing} … ${cont}`],
  ],
);

const pcTypedBank: readonly TypedItem[] = pcRows.map(([s, [verb, ing, , rest], [es, past, cont, base, after]]): TypedItem => {
  const long = `${s[1]} ${ing} ${rest}`;
  const short = `${es} ${past}${after}`;
  return {
    shown: `${s[0]} / ${verb} ${rest} / when / ${es} ${base}${after}`,
    accepted: [`${s[0]} ${long} when ${short}.`, `When ${short}, ${inside(s)} ${long}.`],
    canonical: `${s[0]} ${long} when ${short}.`,
    wrong: [`${s[0]} ${s[2]} ${ing} ${rest} when ${short}.`, `${s[0]} ${long} when ${es} ${cont}${after}.`],
  };
});

/** beRule says which subjects take the form of be in words. */
const beRule = (words: string): Text =>
  words.startsWith("was")
    ? t("*I* and one person or thing take *was*", "*I* 和单个的人或物用 *was*")
    : t("*we*, *you*, *they* and more than one take *were*", "*we*、*you*、*they* 和多个人或物用 *were*");

/** whyNotForm explains a wrong past continuous in a gap. */
const whyNotForm = (wrong: string, _right: string, _shown: string, position: number): Text => {
  if (position === 0)
    return t(
      `*${wrong}* uses the wrong form of *be* for this subject—check whether the subject is singular (*was*) or plural (*were*).`,
      `*${wrong}* 里的 *be* 动词与主语单复数不匹配——请核对主语该用 *was* 还是 *were*。`,
    );
  return t(
    `*${wrong}* has no *-ing*. An action that was in progress needs *was* or *were* plus the *-ing* form.`,
    `*${wrong}* 少了 *-ing*。过去正在进行的动作需要用 *was / were* 加动词的 *-ing* 形式。`,
  );
};

/** whyNotWhich explains a wrong pair of verbs for the long and the short action. */
const whyNotWhich = (wrong: string, _right: string, _shown: string, position: number): Text =>
  position === 0
    ? t(
        `*${wrong}* swaps the tenses. The longer action already in progress takes the past continuous, and the short interrupting action after *when* takes the past simple.`,
        `*${wrong}* 把两个时态弄反了。已经在进行的较长动作用过去进行时，*when* 后面的短动作用一般过去时。`,
      )
    : t(
        `*${wrong}* puts both actions in the past continuous. The short action after *when* happened at one moment, so it takes the past simple.`,
        `*${wrong}* 把两个动作都用了过去进行时。*when* 后面的短动作发生在一瞬间，要用一般过去时。`,
      );

const pastContinuous: TopicDef = {
  id: "past-continuous",
  title: t("The Past Continuous", "过去进行时"),
  summary: t(
    "I was walking home when I saw the fox. Was or were with -ing for something in progress when something else happened.",
    "I was walking home when I saw the fox. was / were 加 -ing 表示另一件事发生时正在进行的动作。",
  ),
  intro: t(
    "Picture *We were feeding the ducks when it started to rain*. One longer action was already underway (*were feeding*), and a shorter event interrupted it (*started*). The past continuous (*was/were + -ing*) sets that background scene.",
    "想象这个画面：*We were feeding the ducks when it started to rain.* 一个较长的动作已经在进行（*were feeding*），另一个短动作突然打断了它（*started*）。过去进行时（*was/were + -ing*）专门用来铺设这个背景场景。",
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
        "The past continuous is *was* or *were* with the *-ing* form of a verb:\n\n- *I*, *he*, *she*, *it* and one person: *was* — *I was reading. Tom was cooking.*\n- *we*, *you*, *they* and more than one: *were* — *We were walking. My parents were watching TV.*\n\nIt is for something that was going on at a time in the past: *When the phone rang, I was having dinner.*\n\n> **Watch out.** Never drop *-ing* after *was/were* (*I was walk* is wrong), and match *was* vs. *were* to the subject.",
        "过去进行时由 *was* 或 *were* 加动词的 *-ing* 形式构成：\n\n- *I*、*he*、*she*、*it* 和单个人用 *was*：*I was reading. Tom was cooking.*\n- *we*、*you*、*they* 和多个人用 *were*：*We were walking. My parents were watching TV.*\n\n它表示过去某个时候正在进行的事：*When the phone rang, I was having dinner.*\n\n> **注意。** 不要在 *was / were* 后面漏掉 *-ing*（*I was walk* 是错的），同时核对主语该配 *was* 还是 *were*。",
      ),
      choiceGenerator(
        t("Choose the words for the gap.", "选出填入空白处的词。"),
        pcFormBank,
        (right, shown) => {
          const rule = beRule(right);
          return t(
            `The action was going on when something else happened, so it takes *was* or *were* with *-ing*, and ${rule.en}: ${fill(shown, right)}\n\n**Check.** Verify both parts of *${right}*: the *be* form agrees with the subject, and the main verb ends in *-ing*.`,
            `这个动作在另一件事发生时正在进行，所以用 *was* 或 *were* 加 *-ing*；${rule["zh-CN"]}：${fill(shown, right)}\n\n**检验。** 核对 *${right}* 的两部分：*be* 动词与主语一致，且实义动词带 *-ing*。`,
          );
        },
        whyNotForm,
      ),
    ),
    point(
      "which",
      t("The long action and the short one", "长动作和短动作"),
      t(
        "When two things happen in the past, the longer one that was already going on takes the past continuous, and the short one that happened in the middle of it takes the past simple:\n\n*I was walking home* (long) *when I saw the fox* (short).\n\nThe short one usually comes after *when*.\n\n> **Watch out.** Do not put both verbs in the past continuous when one action interrupts the other—the interrupting verb after *when* stays in the past simple.",
        "过去的两件事同时出现时，已经在进行的、较长的动作用过去进行时，中途突然发生的、较短的动作用一般过去时：\n\n*I was walking home*（长）*when I saw the fox*（短）。\n\n短动作通常放在 *when* 后面。\n\n> **注意。** 一个动作打断另一个动作时，不要把两个动词都写成过去进行时——*when* 后面的瞬间动作用一般过去时。",
      ),
      choiceGenerator(
        t("Choose the verbs for the two gaps.", "选出填入两个空白处的动词。"),
        pcWhichBank,
        (right, shown) => {
          const [first, second] = right.split(" … ");
          const done = shown.replace(/___ \([^)]*\)/u, `*${first}*`).replace(/___ \([^)]*\)/u, `*${second}*`);
          return t(
            `The longer action was already going on, so it takes the past continuous (*${first}*); the short one after *when* happened in the middle of it, so it takes the past simple (*${second}*): ${done}\n\n**Check.** Confirm the roles: background action → *was/were + -ing* (*${first}*), interrupting event after *when* → past simple (*${second}*).`,
            `较长的动作当时已在进行，用过去进行时（*${first}*）；*when* 后面的短动作在中途发生，用一般过去时（*${second}*）：${done}\n\n**检验。** 核对分工：背景长动作 → 过去进行时（*${first}*），*when* 后的打断事件 → 一般过去时（*${second}*）。`,
          );
        },
        whyNotWhich,
      ),
    ),
    point(
      "write",
      t("Writing a sentence with when", "用 when 写句子"),
      t(
        "Write one sentence from the note. The first action was going on, so it takes *was* or *were* with *-ing*; the action after *when* takes the past simple. You may also start with *When*: *When the phone rang, I was reading a book.*\n\n> **Watch out.** Double-check the *-ing* spelling (*run* → *running*, *make* → *making*) and use the past simple (not *was/were + -ing*) after *when*.",
        "根据笔记写一个句子。第一个动作当时正在进行，用 *was / were* 加 *-ing*；*when* 后面的动作用一般过去时。也可以用 *When* 开头：*When the phone rang, I was reading a book.*\n\n> **注意。** 核对 *-ing* 拼写（如 *run* → *running*、*make* → *making*），并且 *when* 后面用一般过去时，不要也写成过去进行时。",
      ),
      typedGenerator("sentence", t("Write a sentence from the note.", "根据笔记写一个句子。"), pcTypedBank, (right) => {
        const rule = beRule(right.replace(/^\S+ (\S+ )?(?=was|were)/u, ""));
        return t(
          `The first action was going on, so it takes *was* or *were* with *-ing* (${rule.en}); the short action after *when* takes the past simple: ${right}\n\n**Check.** Check both clauses: the ongoing clause has *was/were + -ing*, and the *when* clause has a past-simple verb.`,
          `第一个动作当时正在进行，用 *was* 或 *were* 加 *-ing*（${rule["zh-CN"]}）；*when* 后面的短动作用一般过去时：${right}\n\n**检验。** 检查两个分句：背景句是 *was/were + -ing*，*when* 从句是一般过去时。`,
        );
      }),
    ),
  ],
};

/** topics are the topics of the unit Animals and Pets. */
export const topics: readonly TopicDef[] = [pets.topic, wildlife.topic, animalLife.topic, farmAndCare.topic, pastContinuous];

/** vocabulary are the words the unit Animals and Pets teaches. */
export const vocabulary: readonly WordBatch[] = [pets.batch, wildlife.batch, animalLife.batch, farmAndCare.batch];
