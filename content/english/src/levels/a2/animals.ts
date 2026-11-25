// A2, unit 6: Animals and Pets. Pets, wildlife, how animals live, farm animals and care; the past continuous. The
// conjunctions and the writing of the unit are existing topics.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { vocabularyTopic, word } from "../words.ts";
import { combos, fill } from "./kit.ts";
import { pastContinuousWriteNot } from "./mistakes.ts";

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
  intro: t(
    "On our trip we saw a **fox** run into the trees, a **dolphin** jump next to the boat and an **eagle** fly over the mountains. These words help you name the wild animals of forests, seas and skies and say what each one does.",
    "旅行中我们看见一只 **fox**（狐狸）跑进树林，一只 **dolphin**（海豚）在船边跃起，一只 **eagle**（鹰）飞过山顶。这些词帮你说出森林、大海和天空中的野生动物，并说说它们各自做什么。",
  ),
  prerequisites: ["a1-words-wild-animals", "a2-words-pets"],
  words: [
    word(
      "wolf wolves",
      "a wild animal like a big dog that lives and hunts in a group",
      "狼",
      "The {wolves} howled at the moon.|foxes deer | In the story, the big bad {wolf} eats Grandma. | A {wolf} looks like a big gray dog.",
      "fox deer",
    ),
    word(
      "fox foxes",
      "a wild animal like a small dog, with red fur and a long tail",
      "狐狸",
      "A {fox} has red fur and a long tail. | The little red {fox} took a chicken from the farm. | Little red {foxes} often look for food in city bins at night.|wolves deer",
      "wolf deer",
    ),
    word(
      "deer",
      "a wild animal with long thin legs; the male has antlers",
      "鹿",
      "We saw three {deer} eating grass in the forest.|foxes wolves | A male {deer} has big antlers on its head. | The {deer} stopped eating leaves and ran away when it heard us.",
      "fox wolf",
    ),
    word(
      "whale whales",
      "the biggest animal in the sea",
      "鲸",
      "The blue {whale} is the biggest animal in the world. | From our boat, we saw the huge {whales} blow water high into the air.|dolphins sharks | {Whales} are bigger than any other animal in the sea.|Dolphins Sharks",
      "dolphin shark",
    ),
    word(
      "dolphin dolphins",
      "a clever sea animal that is friendly to people",
      "海豚",
      "{Dolphins} are clever, friendly and much smaller than whales.|Whales Sharks | A small, friendly {dolphin} swam next to our boat. | Small, friendly {dolphins} talk to each other with clicks and whistles.|Whales Sharks",
      "whale shark",
    ),
    word(
      "shark sharks",
      "a big fish with sharp teeth",
      "鲨鱼",
      "Don't swim here! I saw a {shark}! | A {shark} has many rows of sharp teeth. | Some {sharks} are as long as a bus, and they are dangerous fish.|whales dolphins",
      "whale dolphin",
    ),
    word(
      "eagle eagles",
      "a big bird that hunts small animals and can see very far",
      "鹰",
      "The {eagle} flew high above the mountains in the bright sun, looking for rabbits. | In the daytime, {eagles} can see a rabbit from very far away.|owls parrots | {Eagles} build huge nests of sticks on high mountain rocks.|Owls Parrots",
      "owl parrot",
    ),
    word(
      "owl owls",
      "a bird with big eyes that hunts at night",
      "猫头鹰",
      '{Owls} hunt at night.|eagles parrots | {Owls} have very big eyes to see in the dark.|Eagles Parrots | We heard the {owl} in the trees: "Hoo, hoo!"',
      "eagle parrot",
    ),
    word(
      "bee bees",
      "a flying insect that makes honey",
      "蜜蜂",
      "{Bees} make honey.|Ants Butterflies | The {bee} flew onto my arm and stung me! | The {bees} are flying from flower to flower to make honey.|ants butterflies",
      "ant butterfly",
    ),
    word(
      "butterfly butterflies",
      "an insect with big colorful wings",
      "蝴蝶",
      "A {butterfly} has four colorful wings. | The garden is full of colorful {butterflies} in summer.|bees spiders | A caterpillar turns into a {butterfly}.",
      "bee spider",
    ),
    word(
      "spider spiders",
      "a small animal with eight legs that makes webs",
      "蜘蛛",
      "{Spiders} have eight legs.|ants bees | There's a big {spider} with eight hairy legs in the bath! | {Spiders} catch flies in their webs.|Ants Bees",
      "ant bee",
    ),
    word(
      "ant ants",
      "a very small insect that lives in big groups",
      "蚂蚁",
      "{Ants} walk in long lines and carry things much heavier than they are.|Bees Spiders | Hundreds of tiny {ants} are walking in a line across the cake!|bees spiders | {Ants} are tiny insects with six legs and no wings.|bees spiders",
      "bee spider",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Bee*, *butterfly*, *spider* and *ant* are all small creatures. Look for what the sentence says it does: honey for a bee, colorful wings for a butterfly, eight legs and a web for a spider, long lines on the ground for an ant.",
        "*bee*、*butterfly*、*spider* 和 *ant* 都是小动物。看句子说它做什么：酿蜜的是 bee，有彩色翅膀的是 butterfly，八条腿会结网的是 spider，在地上排成长队的是 ant。",
      ),
      meaning: t(
        "*Whale*, *dolphin* and *shark* all live in the sea: a whale is the biggest, a dolphin is small and friendly, and a shark is a fish with sharp teeth.",
        "*whale*、*dolphin* 和 *shark* 都生活在海里：whale 最大，dolphin 小而友好，shark 是长着尖牙的鱼。",
      ),
      spell: t(
        "Some of these animals change in the plural: wol**f** becomes wol**ves**, fo**x** becomes fox**es**, and *deer* stays *deer*.",
        "有些动物词的复数会变：wol**f** 变成 wol**ves**，fo**x** 变成 fox**es**，*deer* 的复数还是 *deer*。",
      ),
    },
    notes: `
      wolf|wild animals howling at the moon;the big bad animal of the story that eats Grandma;an animal that looks like a big gray dog|a wolf is big and gray and hunts in a group; a fox is small and red|wolf 体型大、毛灰、成群捕猎；fox 体型小、毛红|fox=fox is a small red animal that lives alone, not a big gray animal like a large dog=fox 是独自生活的红色小动物，不是像大狗那样的灰色大动物;deer=deer eats grass and leaves and is never a hunter that howls or eats people=deer 吃草和树叶，不会嚎叫，也不会吃人|wolf|the plural *wolves*: f changes to v and adds -es|复数 *wolves*：f 变成 v 再加 -es
      fox|an animal with red fur and a long tail;a little red animal taking a chicken from a farm;little red animals looking in city bins at night|a fox is small and red; a wolf is big and gray|fox 体型小、毛红；wolf 体型大、毛灰|wolf=wolf is a big gray animal like a large dog, not a little red one=wolf 是像大狗那样的灰色大动物，不是红色的小动物;deer=deer has a short tail and eats only plants, so it does not catch chickens or look for food in bins=deer 尾巴短、只吃植物，不会抓鸡，也不会翻垃圾桶找吃的|fox|the x at the end, and the plural *foxes* with -es|词尾是 x，复数 *foxes* 要加 -es
      deer|three animals eating grass in a forest;a male animal with big antlers on its head;an animal that stopped eating leaves and ran away|a deer eats plants and has long thin legs; a fox hunts small animals|deer 吃植物、腿细长；fox 捕食小动物|fox=fox is a small red hunter that eats meat, not grass or leaves, and has no antlers=fox 是吃肉的红色小猎手，不吃草和树叶，也没有鹿角;wolf=wolf is a hunter that eats meat, not grass or leaves, and has no antlers=wolf 是吃肉的猎手，不吃草和树叶，也没有鹿角|deer|the double e, and the plural is also *deer*, with no -s|两个 e；复数也是 *deer*，不加 -s
      whale|the biggest animal in the world;huge animals blowing water high into the air;the animal bigger than any other in the sea|a whale is the biggest animal in the sea; a dolphin is much smaller|whale 是海里最大的动物；dolphin 小得多|dolphin=dolphin is a clever sea animal much smaller than a whale, not the biggest animal in the sea=dolphin 是比鲸小得多的聪明海洋动物，不是海里最大的动物;shark=shark is a fish with sharp teeth, smaller than a whale, and it does not blow water into the air=shark 是长着尖牙的鱼，比鲸小，也不会向空中喷水|whale|the silent h after w, and the silent e at the end|w 后面的 h 不发音，词尾的 e 也不发音
      dolphin|clever, friendly sea animals much smaller than whales;a small, friendly animal swimming next to a boat;small, friendly animals talking with clicks and whistles|a dolphin is small, clever and friendly; a whale is huge|dolphin 体型小、聪明友好；whale 体型巨大|whale=whale is the biggest animal in the sea, not a small one=whale 是海里最大的动物，不是小动物;shark=shark is a fish with sharp teeth that people fear, not a clever, friendly animal=shark 是让人害怕的尖牙鱼，不是聪明友好的动物|dol · phin|ph, which sounds like f|ph 读作 f
      shark|an animal that makes it dangerous to swim;an animal with many rows of sharp teeth;dangerous fish as long as a bus|a shark is a dangerous fish with sharp teeth; a dolphin is friendly|shark 是长着尖牙的危险的鱼；dolphin 很友好|whale=whale is a huge, gentle animal that breathes air, not a dangerous fish with rows of sharp teeth=whale 是呼吸空气、性情温和的巨大动物，不是长着一排排尖牙的危险的鱼;dolphin=dolphin is a friendly animal that breathes air, not a dangerous fish=dolphin 是呼吸空气、很友好的动物，不是危险的鱼|shark|ar, as in *car*, and k at the end|ar 和 *car* 里的一样，词尾是 k
      eagle|a bird flying above mountains in the bright sun, looking for rabbits;birds seeing a rabbit far away in the daytime;birds building huge nests on mountain rocks|an eagle is a big bird that hunts in the day; an owl hunts at night|eagle 是白天捕猎的大鸟；owl 夜里捕猎|owl=owl is a bird that hunts at night, not a big bird hunting in the sun over the mountains=owl 是夜里捕猎的鸟，不是白天在山上空捕猎的大鸟;parrot=parrot is a colorful bird that eats seeds and fruit and learns words, not a big hunter of rabbits=parrot 是吃种子和水果、会学说话的彩色鸟，不是捕兔子的大鸟|ea · gle|ea for the long e sound, and -gle at the end|ea 发长 e 音，结尾是 -gle
      owl|birds that hunt at night;birds with very big eyes to see in the dark;a bird in the trees saying "Hoo, hoo!"|an owl hunts at night and says "hoo"; an eagle hunts in the day|owl 夜里捕猎、叫声“呜呜”；eagle 白天捕猎|eagle=eagle is a big bird that hunts in the daytime, not at night, and it does not say "hoo"=eagle 是白天捕猎的大鸟，不在夜里捕猎，也不会“呜呜”叫;parrot=parrot is a colorful bird that learns words, not a night hunter that says "hoo"=parrot 是会学说话的彩色鸟，不是夜里捕猎、“呜呜”叫的鸟|owl|ow, as in *cow*, not ou|ow 和 *cow* 里的一样，不是 ou
      bee|insects that make honey;an insect flying onto an arm and stinging;insects flying from flower to flower to make honey|a bee flies and makes honey; an ant walks on the ground|bee 会飞、会酿蜜；ant 在地上爬|ant=ant is a tiny insect that walks on the ground with no wings and makes no honey=ant 是在地上爬的小昆虫，没有翅膀，也不酿蜜;butterfly=butterfly has big colorful wings and does not make honey or sting=butterfly 有彩色的大翅膀，不酿蜜，也不蜇人|bee|the double e at the end|词尾双写 e
      butterfly|an insect with four colorful wings;colorful insects filling a garden in summer;what a caterpillar turns into|a butterfly has big colorful wings; a bee makes honey|butterfly 有彩色的大翅膀；bee 会酿蜜|bee=bee is a small yellow and black insect that makes honey, not one with big colorful wings=bee 是酿蜜的黄黑色小昆虫，没有彩色的大翅膀;spider=spider has eight legs and no wings at all=spider 有八条腿，根本没有翅膀|but · ter · fly|the double t, and y changing to -ies for more than one|双写 t，复数要把 y 变成 -ies
      spider|animals with eight legs;a big animal with eight hairy legs in the bath;animals catching flies in their webs|a spider has eight legs and makes webs; an ant has six legs|spider 八条腿、会结网；ant 六条腿|ant=ant is an insect with six legs that does not make webs=ant 是六条腿的昆虫，不会结网;bee=bee is an insect with six legs and wings, and it makes honey, not webs=bee 是六条腿、有翅膀的昆虫，酿的是蜜，不是网|spi · der|i that says its name, as in *ice*, and -er at the end|i 读字母本音，和 *ice* 一样，结尾是 -er
      ant|insects walking in long lines with heavy things;hundreds of tiny insects walking across a cake;tiny insects with six legs and no wings|an ant is a tiny insect with no wings; a bee can fly|ant 是没有翅膀的小昆虫；bee 会飞|bee=bee is an insect with wings that flies and makes honey, not one that walks in lines=bee 是有翅膀、会飞会酿蜜的昆虫，不是排队爬行的;spider=spider has eight legs and lives alone in its web, not in long lines=spider 有八条腿，独自住在网上，不会排成长队|ant|a short a, not *aunt*, the word for your mother's sister|短元音 a，别写成表示姑姨的 *aunt*
    `,
  },
});

const animalLife = vocabularyTopic({
  id: "a2-words-animal-life",
  title: t("How Animals Live", "动物怎样生活"),
  summary: t(
    "Hunting, hiding, nests, laying eggs, digging, chasing and biting; scared, huge, tiny, sharp and soft.",
    "捕猎、躲藏、巢、下蛋、挖、追赶和咬；害怕的、巨大的、极小的、锋利的和柔软的。",
  ),
  intro: t(
    "A fox **hunts** at night, a rabbit **hides** in its hole, and a bird keeps its eggs in a **nest**. These words help you say how animals find food, stay safe and look after their babies.",
    "狐狸在夜里 **hunts**（捕猎），兔子 **hides**（躲）在洞里，鸟把蛋放在 **nest**（巢）里。这些词帮你说说动物怎样找食物、保护自己、照顾幼崽。",
  ),
  prerequisites: ["a2-words-wildlife"],
  words: [
    word(
      "hunt hunts hunted hunting",
      "to chase and catch animals for food",
      "捕猎",
      "Lions {hunt} in groups. | Owls go {hunting} at night.|chasing hiding | The fox {hunted} for mice in the field.|chased hid",
      "chase hide",
    ),
    word(
      "hide hides hid hidden hiding",
      "to go where no one can see you; to put something where no one can find it",
      "躲藏；藏",
      "The cat {hid} under the bed.|hunted dug | Where did you {hide} the chocolate? | The rabbit is {hiding} from the fox in its hole.|hunting digging",
      "hunt dig",
    ),
    word(
      "nest nests",
      "a home that a bird builds for its eggs",
      "巢；窝",
      "There are three eggs in the bird's {nest} in the tree. | Birds build their {nests} with sticks and grass.|cages wings | The eagle's {nest} is high on a rock.",
      "cage wing",
    ),
    word(
      "lay lays laid laying",
      "to put an egg out of the body",
      "下（蛋）；放",
      "Our hens {lay} an egg every day. | The turtle {laid} a hundred eggs in the sand.|dug hunted | Please {lay} the baby on the bed.",
      "dig hunt",
    ),
    word(
      "dig digs dug digging",
      "to make a hole in the ground",
      "挖",
      "The dog {dug} a hole in the garden.|hid laid | Rabbits {dig} holes to live in. | We're {digging} for treasure on the beach!|hiding laying",
      "hide lay",
    ),
    word(
      "chase chases chased chasing",
      "to run after someone or something to catch them",
      "追赶",
      "The dog {chased} the cat up a tree.|hunted bit | Cats like to {chase} balls of wool around the room. | The children are {chasing} each other around the park.|hunting biting",
      "hunt bite",
    ),
    word(
      "bite bites bitten biting",
      "to cut something with your teeth",
      "咬",
      "Be careful! That dog {bites}. Don't put your hand near its mouth.|chases hunts | I was {bitten} by a mosquito, and now my arm itches.|chased hunted | Don't {bite} your nails.",
      "chase hunt",
    ),
    word(
      "scared",
      "afraid",
      "害怕的",
      "I'm {scared} of spiders. | The little boy was {scared} of the dark. | Don't be {scared}. The dog is friendly.",
      "huge tiny",
    ),
    word(
      "huge",
      "very, very big",
      "巨大的",
      "An elephant is {huge}. | They live in a {huge} house with twenty rooms. | A {huge} wave hit the boat and nearly turned it over.",
      "tiny soft",
    ),
    word(
      "tiny tinier tiniest",
      "very, very small",
      "极小的",
      "An ant is {tiny}. | The baby's {tiny} hand can only hold one of my fingers. | We stayed in a {tiny} room. There was only space for a bed.",
      "huge soft",
    ),
    word(
      "sharp sharper sharpest",
      "with a thin edge or point that cuts easily",
      "锋利的；尖的",
      "Sharks have {sharp} teeth that cut like knives. | Be careful! That knife is very {sharp}. | Cats have {sharp} claws that can scratch you.",
      "soft huge",
    ),
    word(
      "soft softer softest",
      "not hard; nice to touch",
      "柔软的",
      "The kitten's fur is very {soft}. | My pillow is {soft}, so my head sinks into it. | This bread is fresh and {soft}, not hard and dry.",
      "sharp huge",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Hunt* and *chase* both mean going after an animal: you *chase* something you can see, as in *chase the cat*, but you *hunt* or go *hunting* to find and catch food.",
        "*hunt* 和 *chase* 都有“追”的意思：*chase* 是追看得见的东西，如 *chase the cat*；*hunt* 或 go *hunting* 是为了找食物、抓猎物。",
      ),
      meaning: t(
        "*Huge* and *tiny* are opposites, and both are stronger than *big* and *small*: *huge* is very, very big and *tiny* is very, very small.",
        "*huge* 和 *tiny* 是反义词，而且比 *big*、*small* 程度更深：*huge* 是非常非常大，*tiny* 是非常非常小。",
      ),
      spell: t(
        "Several of these verbs change in the past: *hide* becomes *hid*, *lay* becomes *laid*, *dig* becomes *dug*, and *bite* becomes *bitten*.",
        "这些动词里有几个过去式会变形：*hide* 变 *hid*，*lay* 变 *laid*，*dig* 变 *dug*，*bite* 变 *bitten*。",
      ),
    },
    notes: `
      hunt|lions catching food in groups;owls going out to catch food at night;a fox looking for mice in a field|you hunt to find and catch food; you chase something you can already see|hunt 是为了找食物而捕猎；chase 是追赶已经看见的东西|chase=chase means running after one thing you can see, and it needs that thing right after it, as in *chase a cat*=chase 是追赶看得见的某个东西，后面要直接跟追的对象，如 *chase a cat*;hide=hide means going where no one can see you, not looking for animals to catch=hide 是躲到别人看不见的地方，不是寻找猎物|hunt|u as in *sun*, and the past *hunted* with -ed|u 和 *sun* 里的一样，过去式 *hunted* 加 -ed
      hide|a cat going under a bed so no one sees it;a place where someone put the chocolate so no one finds it;a rabbit keeping away from a fox in its hole|you hide to stay out of sight; you hunt to catch food|hide 是躲起来不让人看见；hunt 是捕猎|hunt=hunt means chasing and catching animals for food, not staying where no one can see you=hunt 是追捕动物当食物，不是躲在别人看不见的地方;dig=dig means making a hole in the ground, not keeping someone or something out of sight=dig 是在地上挖洞，不是把人或东西藏起来|hide|the silent e, and the past forms *hid* and *hidden* with no e|词尾 e 不发音；过去式 *hid* 和过去分词 *hidden* 没有 e
      nest|three eggs of a bird in a tree;the homes birds build with sticks and grass;an eagle's home high on a rock|a nest is a home a wild bird builds; a cage is a box of bars people make|nest 是野鸟自己筑的窝；cage 是人做的金属笼子|cage=cage is a box of metal bars that people keep a bird in, not a home a bird builds itself=cage 是人用来关鸟的金属笼子，不是鸟自己筑的家;wing=wing is the part of a bird it flies with, not a home for its eggs=wing 是鸟用来飞的部位，不是放蛋的家|nest|a short e, as in *bed*, and -st at the end|短元音 e，和 *bed* 一样，结尾是 -st
      lay|hens giving an egg every day;a turtle putting a hundred eggs in the sand;putting a baby down on a bed|a bird lays an egg out of its body; an animal digs a hole in the ground|鸟 lay（下）蛋；动物 dig（挖）洞|dig=dig means making a hole in the ground, not putting an egg out of the body or putting something down=dig 是在地上挖洞，不是下蛋，也不是把东西放下;hunt=hunt means chasing and catching animals for food, not putting an egg out or setting something down gently=hunt 是追捕动物当食物，不是下蛋，也不是轻轻放下东西|lay|the past *laid* with ai, not *layed*|过去式 *laid* 拼作 ai，不是 *layed*
      dig|a dog making a hole in a garden;rabbits making holes to live in;looking for treasure under the sand of a beach|you dig a hole in the ground; you hide something so no one finds it|dig 是在地上挖洞；hide 是把东西藏起来|hide=hide means putting yourself or something out of sight, not making a hole in the ground=hide 是把自己或东西藏起来，不是在地上挖洞;lay=lay means putting an egg out of the body or putting something down, not making a hole=lay 是下蛋或把东西放下，不是挖洞|dig|the past *dug*, and the double g in *digging*|过去式 *dug*；*digging* 要双写 g
      chase|a dog running after a cat up a tree;cats running after balls of wool;children running after each other in a park|you chase something you can see; you bite with your teeth|chase 是追赶看得见的东西；bite 是用牙咬|hunt=hunt means looking for animals to catch and eat, not running after a cat, a ball or friends in a game=hunt 是寻找动物来捕食，不是追赶猫、毛线球或玩伴;bite/bit=bite means cutting something with your teeth, not running after it=bite 是用牙咬，不是追赶|chase|the silent e that drops before -ing: *chasing*|词尾 e 不发音，加 -ing 时去掉：*chasing*
      bite|a dog that may hurt your hand with its mouth;a mosquito that made an arm itch;nails a person should not put in the mouth|you bite with your teeth; you chase by running after something|bite 用牙咬；chase 是跑着追|chase=chase means running after someone, not using your teeth or mouth=chase 是追赶，不是用牙或嘴;hunt=hunt means looking for animals to catch and eat, not cutting with your teeth=hunt 是寻找动物来捕食，不是用牙咬|bite|i that says its name, and the double t in *bitten*|i 读字母本音；*bitten* 要双写 t
      scared|a feeling about spiders;a little boy's feeling about the dark;a feeling the friendly dog should not give you|scared is a feeling of fear; huge describes size|scared 是害怕的感觉；huge 描述大小|huge=huge describes something very, very big, not a feeling of fear=huge 形容东西非常大，不是害怕的感觉;tiny=tiny describes something very, very small, not a feeling of fear=tiny 形容东西非常小，不是害怕的感觉|scared|one r: *scarred* with two r's means marked by a cut|只有一个 r；双写 r 的 *scarred* 是“留下伤疤的”
      huge|the size of an elephant;a house with twenty rooms;a wave that nearly turned a boat over|huge is very, very big; tiny is very, very small|huge 是非常大；tiny 是非常小|tiny=tiny means very, very small, the opposite of huge=tiny 是非常小，和 huge 意思相反;soft=soft means not hard and nice to touch, and it says nothing about how big something is=soft 是柔软、摸着舒服，与大小无关|huge|u that says its name, and g said like j before the e|u 读字母本音，e 前面的 g 读作 j
      tiny|the size of an ant;a baby's hand that can only hold one finger;a room with space only for a bed|tiny is very, very small; huge is very, very big|tiny 是非常小；huge 是非常大|huge=huge means very, very big, the opposite of tiny=huge 是非常大，和 tiny 意思相反;soft=soft means not hard and nice to touch, and it says nothing about how small something is=soft 是柔软、摸着舒服，与大小无关|ti · ny|the y at the end that changes to i in *tinier* and *tiniest*|词尾 y 在 *tinier*、*tiniest* 里变成 i
      sharp|shark teeth that cut like knives;a knife to be careful with;cat claws that can scratch|sharp things cut or scratch; soft things are nice to touch|sharp 的东西能割伤或抓伤；soft 的东西摸着舒服|soft=soft means not hard and nice to touch, so it cannot cut or scratch=soft 是柔软、摸着舒服，不会割伤或抓伤;huge=huge means very, very big, and big things do not cut because of their size=huge 是非常大，东西大不等于能割东西|sharp|sh at the start and ar as in *car*|开头是 sh，ar 和 *car* 里的一样
      soft|a kitten's fur;a pillow a head sinks into;fresh bread that is not hard and dry|soft is not hard and nice to touch; sharp can cut|soft 是柔软；sharp 是锋利能割|sharp=sharp means having an edge that cuts, not being nice and gentle to touch=sharp 是有能割东西的刃，不是柔软舒服;huge=huge means very, very big, not gentle and not hard to touch=huge 是非常大，与软硬无关|soft|o as in *hot*, and -ft at the end|o 和 *hot* 里的一样，结尾是 -ft
    `,
  },
});

const farmAndCare = vocabularyTopic({
  id: "a2-words-farm-and-care",
  title: t("Farm Animals and Care", "农场动物和照料"),
  summary: t(
    "Goats, hens, donkeys and lambs; fields and fences; vets and caring; alive, dead and dying.",
    "山羊、母鸡、驴和小羊；田野和篱笆；兽医和照顾；活着的、死的和死去。",
  ),
  intro: t(
    "On Grandpa's farm, a **goat** eats grass in the **field**, a **hen** sits on her eggs, and a **vet** comes when an animal is sick. These words help you talk about farm animals, the places they live and how people care for them.",
    "在爷爷的农场里，一只 **goat**（山羊）在 **field**（牧场）上吃草，一只 **hen**（母鸡）在孵蛋，动物生病时 **vet**（兽医）就会来。这些词帮你谈论农场动物、它们生活的地方，以及人们怎样照顾它们。",
  ),
  prerequisites: ["a2-words-animal-life"],
  words: [
    word(
      "goat goats",
      "a farm animal with horns that gives milk",
      "山羊",
      "The {goat} with long horns ate my hat! | We make cheese from {goat} milk. | {Goats} can climb very steep rocks.|lambs donkeys",
      "lamb donkey",
    ),
    word(
      "hen hens",
      "a female chicken",
      "母鸡",
      'Our {hens} lay eggs every morning.|goats lambs | The {hen} is sitting on her eggs. | A {hen} says "cluck, cluck".',
      "goat lamb",
    ),
    word(
      "donkey donkeys",
      "an animal like a small horse with long ears",
      "驴",
      'The {donkey} carried our bags up the mountain. | A {donkey} has long ears and says "hee-haw". | The children rode {donkeys} on the beach.|goats hens',
      "goat hen",
    ),
    word(
      "field fields",
      "an area of land where crops grow or animals eat grass",
      "田野；牧场",
      "The cows are eating grass in the {field} next to the farm. | There are {fields} of rice near the village.|fences farms | On the farm, the farmers work in the {fields} all day.|fences farms",
      "fence farm",
    ),
    word(
      "vet vets",
      "a doctor for animals",
      "兽医",
      "Our dog is sick. Let's take him to the {vet}. | I want to be a {vet} because I want to help sick animals. | The {vet} gave the cat some medicine.",
      "nurse farmer",
    ),
    word(
      "care cares cared caring",
      "to look after someone; to think something is important",
      "照顾；在乎",
      "Who will {care} for the dog when we're away? | Nurses take {care} of sick people. | I don't {care} what they say.",
      "die feed",
    ),
    word(
      "fence fences",
      "a wall of wood or wire around a field or a garden",
      "篱笆；栅栏",
      "The horse jumped over the wooden {fence} around the field. | There is a high {fence} around the farm. | Dad will paint the wooden {fence} around our garden white.",
      "field cage",
    ),
    word(
      "alive",
      "living, not dead",
      "活着的",
      "The fish is still {alive} and healthy! Put it back in the water. | My great-grandma is still {alive} and well at ninety-eight. | Plants need water to stay {alive}.",
      "dead dying",
    ),
    word(
      "dead",
      "not living any more",
      "死的",
      "The plant is completely {dead}. It's brown and dry. | The bird we found in the garden was {dead}. It wasn't moving or breathing. | The battery is {dead}, so the phone won't turn on at all.",
      "alive dying",
    ),
    word(
      "die dies died dying",
      "to stop living",
      "死亡",
      "Plants {die} without water. | My old dog {died} last year. I miss him.|cared fed | The flowers are {dying}. Give them some water.|caring feeding",
      "care feed",
    ),
    word(
      "lamb lambs",
      "a young sheep",
      "小羊；羔羊",
      "A {lamb} is a baby sheep. | The young {lambs} are playing next to their mother sheep.|goats hens | Mary had a little {lamb} with wool as white as snow.",
      "goat hen",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Alive*, *dead* and *dying* all talk about life: *alive* means still living, *dead* means no longer living, and *dying* means about to stop living. Read whether the sentence says the life is still there.",
        "*alive*、*dead* 和 *dying* 都和生命有关：*alive* 是还活着，*dead* 是已经死了，*dying* 是快要死了。看句子说的是生命还在不在。",
      ),
      meaning: t(
        "*Goat*, *lamb* and *hen* are all farm animals: a *lamb* is a young sheep, a *goat* has horns and gives milk, and a *hen* is a female chicken that lays eggs.",
        "*goat*、*lamb* 和 *hen* 都是农场动物：*lamb* 是小羊（绵羊的幼崽），*goat* 有角、能产奶，*hen* 是下蛋的母鸡。",
      ),
      spell: t(
        "*Lamb* has a silent b at the end, and *die* changes ie to y before -ing: *dying*.",
        "*lamb* 词尾的 b 不发音；*die* 加 -ing 时 ie 要变成 y：*dying*。",
      ),
    },
    notes: `
      goat|an animal with long horns that ate a hat;the milk used to make cheese;animals climbing very steep rocks|a goat has horns and gives milk; a lamb is a young sheep|goat 有角、能产奶；lamb 是小绵羊|lamb=lamb is a young sheep with no horns, too young to give milk=lamb 是没有角的小绵羊，还太小，不产奶;donkey=donkey is an animal like a small horse with long ears, and it has no horns=donkey 是像小马一样的长耳朵动物，没有角|goat|oa for the long o sound, as in *boat*|oa 发长 o 音，和 *boat* 一样
      hen|birds laying eggs every morning;a bird sitting on her eggs;a bird that says "cluck, cluck"|a hen is a female chicken that lays eggs; a goat gives milk|hen 是下蛋的母鸡；goat 产奶|goat=goat is an animal with horns that gives milk, not a bird that lays eggs=goat 是有角、产奶的动物，不是下蛋的鸟;lamb=lamb is a young sheep with wool, not a bird that lays eggs=lamb 是长着羊毛的小羊，不是下蛋的鸟|hen|a short e, as in *ten*|短元音 e，和 *ten* 一样
      donkey|an animal carrying bags up a mountain;an animal with long ears that says "hee-haw";animals children rode on a beach|a donkey is like a small horse with long ears; a goat has horns|donkey 像小马、耳朵长；goat 有角|goat=goat is a small animal with horns, too small to carry bags or children=goat 是有角的小动物，太小，驮不了包，也骑不了;hen=hen is a female chicken, a bird far too small to carry anything=hen 是母鸡，是一种太小、驮不了东西的鸟|don · key|o said like u in *sun*, and -ey at the end|o 读作 *sun* 里的 u，结尾是 -ey
      field|grass for cows next to a farm;land growing rice near a village;the land where farmers work all day|a field is open land for crops or grass; a fence goes around it|field 是种庄稼或长草的开阔土地；fence 是围在四周的篱笆|fence=fence is a wall of wood or wire around the land, not the land where grass and crops grow=fence 是围着土地的木头或铁丝篱笆，不是长草种庄稼的土地;farm=farm is the whole place with its houses, animals and land, and the fields are only parts of it=farm 是包括房子、动物和土地的整个农场，field 只是其中的田地|field|ie for the long e sound: i before e|ie 发长 e 音：i 在 e 前面
      vet|a sick dog that needs a doctor;a job helping sick animals;someone giving a cat medicine|a vet is a doctor for animals; a nurse looks after sick people|vet 是给动物看病的医生；nurse 照顾生病的人|nurse=nurse is someone who looks after sick people in a hospital, not a doctor for animals=nurse 是在医院照顾病人的人，不是给动物看病的医生;farmer=farmer grows crops and keeps animals on a farm but does not give them medicine as a doctor=farmer 在农场种庄稼、养动物，但不像医生那样给动物看病开药|vet|a short e, and it is short for *veterinarian*|短元音 e；它是 *veterinarian* 的简写
      care|looking after a dog while the family is away;nurses looking after sick people;not thinking what other people say is important|you care for someone by looking after them; you feed them when you give them food|care for 是照顾；feed 是喂食物|die=die means to stop living, not to look after someone=die 是死去，不是照顾别人;feed=feed means only giving food, and it is never used in *take ___ of* or *don't ___ what*=feed 只是喂食物，不能用在 *take ___ of* 或 *don't ___ what* 里|care|are said like air, with the silent e at the end|are 读作 air，词尾 e 不发音
      fence|a wooden wall a horse jumped over;a high wall around a farm;the wooden wall around a garden that Dad will paint|a fence goes around a field or garden; a field is the land inside|fence 围在田地或花园四周；field 是里面的土地|field=field is the open land itself, not the wall around it=field 是开阔的土地本身，不是围在四周的墙;cage=cage is a small box of metal bars an animal is kept in, not a wall around a field or garden=cage 是关动物的小铁笼子，不是围着田地或花园的篱笆|fence|-ce at the end, said like s|结尾 -ce 读作 s
      alive|a fish still living and healthy;a great-grandma still living at ninety-eight;what plants need water to stay|alive means still living; dead means no longer living|alive 是还活着；dead 是已经死了|dead=dead means no longer living, the opposite of alive=dead 是已经死了，和 alive 意思相反;die=dying means close to death, not living and healthy=dying 是快要死了，不是活得好好的|a · live|a at the start, and i that says its name, as in *five*|开头是 a，i 读字母本音，和 *five* 一样
      dead|a brown, dry plant;a bird in the garden that was not moving or breathing;a battery that cannot turn the phone on|dead means no longer living; dying means it has not stopped living yet|dead 是已经死了；dying 是还没死、快死了|alive=alive means still living, the opposite of dead=alive 是还活着，和 dead 意思相反;die=dying means still living but close to death, not completely without life=dying 是还活着但快要死了，不是已经完全没有生命|dead|ea said like short e, as in *bread*|ea 读短元音 e，和 *bread* 一样
      die|plants without water;an old dog that stopped living last year;flowers that need water now|die means to stop living; care means to look after|die 是死去；care 是照顾|care=care means looking after someone, not stopping living=care 是照顾别人，不是死去;feed=feed means giving food to someone, not stopping living=feed 是给别人食物，不是死去|die|ie at the end, which changes to y in *dying*|词尾是 ie，*dying* 里要变成 y
      lamb|a baby sheep;young animals playing next to their mother sheep;Mary's little animal with snow-white wool|a lamb is a young sheep; a goat is a grown animal with horns|lamb 是小绵羊；goat 是长着角的成年动物|goat=goat is an animal with horns and hair, not a baby sheep with wool=goat 是有角、长毛发的动物，不是长羊毛的小绵羊;hen=hen is a female chicken, a bird, not a baby sheep=hen 是母鸡，是一种鸟，不是小绵羊|lamb|the silent b at the end|词尾的 b 不发音
    `,
  },
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
      typedGenerator(
        "sentence",
        t("Write a sentence from the note.", "根据笔记写一个句子。"),
        pcTypedBank,
        (right) => {
          const rule = beRule(right.replace(/^\S+ (\S+ )?(?=was|were)/u, ""));
          return t(
            `The first action was going on, so it takes *was* or *were* with *-ing* (${rule.en}); the short action after *when* takes the past simple: ${right}\n\n**Check.** Check both clauses: the ongoing clause has *was/were + -ing*, and the *when* clause has a past-simple verb.`,
            `第一个动作当时正在进行，用 *was* 或 *were* 加 *-ing*（${rule["zh-CN"]}）；*when* 后面的短动作用一般过去时：${right}\n\n**检验。** 检查两个分句：背景句是 *was/were + -ing*，*when* 从句是一般过去时。`,
          );
        },
        pastContinuousWriteNot,
      ),
    ),
  ],
};

/** topics are the topics of the unit Animals and Pets. */
export const topics: readonly TopicDef[] = [pets.topic, wildlife.topic, animalLife.topic, farmAndCare.topic, pastContinuous];

/** vocabulary are the words the unit Animals and Pets teaches. */
export const vocabulary: readonly WordBatch[] = [pets.batch, wildlife.batch, animalLife.batch, farmAndCare.batch];
