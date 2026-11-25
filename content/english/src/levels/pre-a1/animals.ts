// Pre-A1, unit 5: Animals. Animals, what they can do, little words, can and can't, and questions with be.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, interleave, sentenceCase, vocabularyTopic, word } from "../words.ts";

const animals = vocabularyTopic({
  id: "pre-a1-words-animals",
  title: t("Animals", "动物"),
  summary: t("Pets and farm animals.", "宠物和农场动物。"),
  intro: t(
    "On the farm, a **cow** says moo, a **pig** rolls in the mud and a **duck** swims on the pond. These words help you name the animals you see at home and on a farm.",
    "农场上，**cow**（奶牛）哞哞叫，**pig**（猪）在泥里打滚，**duck**（鸭子）在池塘里游。这些词帮你说出家里和农场上的动物。",
  ),
  prerequisites: [],
  words: [
    word(
      "animal animals",
      "a living thing that can move, like a dog or a bird",
      "动物",
      "A cat is an {animal}. | Cats, dogs and birds are all {animals}.|birds fish | What is your best {animal}? The panda!",
      "bird fish",
    ),
    word(
      "cat cats",
      "a small animal with soft fur that says meow",
      "猫",
      "My {cat} says meow. | The {cat} likes to climb trees and catch mice. | Our {cat} sleeps on my bed and purrs.",
      "dog cow",
    ),
    word(
      "dog dogs",
      "an animal that says woof and is a good friend to people",
      "狗",
      "My {dog} says woof. | I walk my {dog} in the park every day. | The {dog} wags its tail. It is happy.",
      "cat cow",
    ),
    word(
      "bird birds",
      "an animal with wings and feathers that can usually fly",
      "鸟",
      "A {bird} can fly in the sky. | The {bird} sings in the tree. | {Birds} make nests in trees.|Fish Pigs",
      "fish pig",
    ),
    word(
      "fish",
      "an animal that lives and swims in water",
      "鱼",
      "A {fish} lives in water. | {Fish} can swim, but they can't walk.|Birds Horses | Three little {fish} swim under the water.|birds horses",
      "bird horse",
    ),
    word(
      "horse horses",
      "a big animal that people can ride",
      "马",
      "I can ride a {horse}. | A {horse} can run very fast. | The {horse} can jump over the fence.",
      "cow pig",
    ),
    word(
      "cow cows",
      "a big farm animal that gives us milk",
      "奶牛；母牛",
      "We get milk from a {cow}. | The {cow} says moo. | There are ten {cows} on the farm. They give us milk.|pigs ducks",
      "pig duck",
    ),
    word(
      "pig pigs",
      "a pink farm animal with a short nose and a curly tail",
      "猪",
      "A {pig} is pink and fat. | The {pig} says oink. | {Pigs} like to roll in mud.|Cows Frogs",
      "cow frog",
    ),
    word(
      "duck ducks",
      "a bird that swims and says quack",
      "鸭子",
      "The {duck} says quack. | A {duck} can swim and fly. | The {ducks} swim on the lake.|cows pigs",
      "cow pig",
    ),
    word(
      "rabbit rabbits",
      "a small animal with long ears that jumps",
      "兔子",
      "A {rabbit} has long ears. | My {rabbit} eats carrots. | The {rabbit} with long ears jumps across the grass.",
      "frog cat",
    ),
    word(
      "mouse mice",
      "a very small gray animal with a long tail",
      "老鼠",
      "A {mouse} is small and gray. | The cat runs after the {mouse}. | Two little {mice} live under the floor.|horses cows",
      "horse cow",
    ),
    word(
      "frog frogs",
      "a small green animal that jumps and lives near water",
      "青蛙",
      "A {frog} is green and jumps. | The {frog} says ribbit. | {Frogs} live near ponds and eat flies.|Pigs Cows",
      "pig cow",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "Listen for the animal's sound or what it does: *meow* is a cat, *woof* a dog, *moo* a cow, *oink* a pig and *quack* a duck.",
        "留意句子里动物的叫声或动作：*meow* 是猫，*woof* 是狗，*moo* 是奶牛，*oink* 是猪，*quack* 是鸭子。",
      ),
      meaning: t(
        "*Animal* is the word for all of them; *cat*, *cow* or *bird* names one kind. If the meaning says milk, it is a *cow*; if it says wings and feathers, a *bird*.",
        "*animal* 是所有动物的总称；*cat*、*cow*、*bird* 是某一种动物。释义说到牛奶就是 *cow*，说到翅膀和羽毛就是 *bird*。",
      ),
      spell: t(
        "Two animal words do not add -s for more than one: one *mouse*, two *mice*; one *fish*, three *fish*.",
        "有两个动物词表示多个时不加 -s：one *mouse*，two *mice*；one *fish*，three *fish*。",
      ),
    },
    notes: `
      animal|a cat as one kind of living thing;cats, dogs and birds all together;a favorite living thing, the panda|animal is the word for every kind; a bird is one kind with wings|animal 是所有动物的总称；bird 只是长翅膀的一种|bird=bird is one kind of animal with wings and feathers, not the word for every living thing that moves=bird 只是长翅膀和羽毛的一种动物，不是所有动物的总称;fish=fish is one kind of animal that lives in water, not the word for every living thing that moves=fish 只是生活在水里的一种动物，不是所有动物的总称|an · i · mal|the i in the middle, not an a: an-i-mal|中间是 i，不是 a：an-i-mal
      cat|a pet that says meow;a pet that climbs trees and catches mice;a pet that sleeps on a bed and purrs|a cat says meow; a dog says woof|cat 喵喵叫；dog 汪汪叫|dog=dog says woof and cannot climb trees or purr, so it is not the small pet that says meow=dog 汪汪叫，不会爬树也不会打呼噜，不是喵喵叫的小动物;cow=cow is a big farm animal that says moo, not a small pet that says meow=cow 是哞哞叫的大农场动物，不是喵喵叫的小宠物|cat|c at the start, not k|开头是 c，不是 k
      dog|a pet that says woof;a pet you walk in the park;a happy pet wagging its tail|a dog says woof; a cat says meow|dog 汪汪叫；cat 喵喵叫|cat=cat says meow and does not go for walks or wag its tail when it is happy=cat 喵喵叫，不会被牵着散步，高兴时也不摇尾巴;cow=cow is a big farm animal that says moo, not a pet that says woof=cow 是哞哞叫的大农场动物，不是汪汪叫的宠物|dog|the short o, and just -s for more than one: dogs|短元音 o，复数只加 -s：dogs
      bird|an animal flying in the sky;an animal singing in a tree;animals making nests in trees|a bird has wings and flies; a fish swims in water|bird 有翅膀会飞；fish 在水里游|fish=fish lives and swims in water and has no wings to fly=fish 生活在水里游，没有翅膀，不会飞;pig=pig is a pink farm animal with no wings, so it cannot fly or sing in trees=pig 是粉色的农场动物，没有翅膀，不会飞也不会在树上唱歌|bird|ir for the sound in the middle, not ur or er|中间的音拼作 ir，不是 ur 或 er
      fish|an animal living in water;animals that swim but cannot walk;little animals swimming under the water|a fish lives in water; a bird flies in the sky|fish 生活在水里；bird 在天上飞|bird=bird has wings and lives in the air and in trees, not under the water=bird 有翅膀，生活在空中和树上，不在水下;horse=horse is a big animal that walks and runs on land, not one that lives in water=horse 是在陆地上走和跑的大动物，不生活在水里|fish|sh at the end, and the same word for more than one: three fish|结尾是 sh，表示多条时还是 fish
      horse|an animal people ride;an animal running very fast;an animal jumping over a fence|a horse is big and fast and people ride it; a cow is slow and gives milk|horse 高大、跑得快，人可以骑；cow 走得慢，产奶|cow=cow is a slow farm animal that gives milk, not one that people ride or that runs and jumps fast=cow 是产奶、走得慢的农场动物，不是人骑的、跑跳很快的动物;pig=pig is a short, fat farm animal, too small to ride and not fast=pig 是又矮又胖的农场动物，不能骑，也跑不快|horse|or in the middle and a silent e at the end|中间是 or，词尾的 e 不发音
      cow|the animal we get milk from;an animal that says moo;ten farm animals that give us milk|a cow gives milk and says moo; a pig says oink|cow 产奶、哞哞叫；pig 哼哼叫|pig=pig says oink and does not give us milk=pig 哼哼叫，不给我们产奶;duck=duck is a bird that says quack and swims, not the big animal that gives milk=duck 是嘎嘎叫、会游泳的鸟，不是产奶的大动物|cow|ow, said as in *now*|ow 的读音和 *now* 一样
      pig|a pink, fat farm animal;an animal that says oink;animals rolling in mud|a pig is pink and says oink; a cow says moo and gives milk|pig 是粉色的，哼哼叫；cow 哞哞叫，产奶|cow=cow is a big black and white animal that says moo, not a pink one that says oink=cow 是哞哞叫的黑白大动物，不是哼哼叫的粉色动物;frog=frog is a small green animal that jumps, not a pink, fat one that rolls in mud=frog 是会跳的绿色小动物，不是在泥里打滚的粉色胖动物|pig|the short i; just -s for more than one: pigs|短元音 i，复数只加 -s：pigs
      duck|a bird that says quack;a bird that can swim and fly;birds swimming on a lake|a duck is a bird that swims and flies; a cow is a big animal on land|duck 是会游泳也会飞的鸟；cow 是陆地上的大动物|cow=cow says moo and cannot swim or fly=cow 哞哞叫，不会游泳也不会飞;pig=pig says oink and has no wings, so it cannot fly=pig 哼哼叫，没有翅膀，不会飞|duck|ck at the end, not k|结尾是 ck，不只是 k
      rabbit|an animal with long ears;a pet eating carrots;an animal with long ears jumping across the grass|a rabbit has long ears; a frog is green and has no ears you can see|rabbit 耳朵长；frog 是绿色的，看不到耳朵|frog=frog is a small green animal with no long ears, and it eats flies, not carrots=frog 是绿色小动物，没有长耳朵，吃苍蝇不吃胡萝卜;cat=cat has short ears and says meow, and it does not eat carrots=cat 耳朵短、喵喵叫，不吃胡萝卜|rab · bit|the double b in the middle|中间双写 b
      mouse|a small, gray animal;the animal a cat runs after;two little animals living under the floor|a mouse is very small; a horse is very big|mouse 很小；horse 很大|horse=horse is a very big animal that people ride, too big to live under a floor or be small and gray=horse 是人骑的大动物，太大了，不会是灰色小动物，也住不到地板下;cow=cow is a very big farm animal that gives milk, not a tiny one a cat runs after=cow 是产奶的大农场动物，不是猫追的小动物|mouse|ou in the middle, and *mice*, not *mouses*, for more than one|中间是 ou，复数是 *mice*，不是 *mouses*
      frog|a small green animal that jumps;an animal that says ribbit;animals living near ponds and eating flies|a frog is green and lives near water; a pig is pink and lives on a farm|frog 是绿色的，生活在水边；pig 是粉色的，生活在农场|pig=pig is a pink, fat farm animal that says oink, not a small green one that jumps=pig 是哼哼叫的粉色胖动物，不是会跳的绿色小动物;cow=cow is a big farm animal that says moo, not a small green one near water=cow 是哞哞叫的大农场动物，不是水边的绿色小动物|frog|fr at the start|开头是 fr
    `,
  },
});

const canAndLike = vocabularyTopic({
  id: "pre-a1-words-can-and-like",
  title: t("Can, Like and Actions", "can、like 和动作"),
  summary: t("What animals and people can do, what they like, and big and small.", "动物和人能做什么、喜欢什么，以及 big 和 small。"),
  intro: t(
    "A fish can **swim**, a bird can **fly** and a horse can **run** very fast. These words help you say what animals and people can do and what they **like**.",
    "鱼会 **swim**（游泳），鸟会 **fly**（飞），马 **run**（跑）得很快。这些词帮你说出动物和人能做什么、**like**（喜欢）什么。",
  ),
  prerequisites: ["pre-a1-words-animals"],
  words: [
    word(
      "can can't cannot",
      "to be able to",
      "能；会",
      "Birds {can} fly, but fish can't. | {Can} you swim? Yes, I can.|Do Will | Can a fish walk? No, it {can't}.|doesn't won't",
      "do will",
    ),
    word(
      "like likes liked liking",
      "to think something is good or nice",
      "喜欢",
      "I {like} cats very much. They are nice. | Do you {like} the color red? Yes, I love it. | She {likes} her new bag very much.|sees eats",
      "see eat",
    ),
    word(
      "see sees saw seen seeing",
      "to notice something with your eyes",
      "看见",
      "I can {see} a bird in the tree. | Close your eyes. Now you can't {see} anything. | I {saw} a big dog in the park yesterday.|ate swam",
      "eat swim",
    ),
    word(
      "run runs ran running",
      "to move fast on your feet",
      "跑",
      "Horses can {run} very fast. | Don't {run} in the classroom. | The dog {ran} after the ball.|swam flew",
      "swim fly",
    ),
    word(
      "jump jumps jumped jumping",
      "to push yourself up into the air with your legs",
      "跳",
      "Rabbits {jump} with their long back legs. | {Jump} up and down on the bed! | The cat {jumped} onto the table.|swam flew",
      "fly swim",
    ),
    word(
      "swim swims swam swum swimming",
      "to move through water",
      "游泳",
      "Fish {swim} in the water. | Can you {swim}? Yes, I go to the pool every week. | We are {swimming} like fish in the sea.|flying walking",
      "fly walk",
    ),
    word(
      "fly flies flew flown flying",
      "to move through the air",
      "飞",
      "Birds {fly} in the sky. | A plane can {fly}. | The bird {flew} up into the sky.|swam walked",
      "swim walk",
    ),
    word(
      "walk walks walked walking",
      "to move on your feet, not fast",
      "走；步行",
      "I {walk} to school with my friend. | Babies can't {walk} yet. They are too small to stand. | Let's {walk} in the park.",
      "fly swim",
    ),
    word(
      "eat eats ate eaten eating",
      "to put food in your mouth",
      "吃",
      "I {eat} rice for lunch. | Cows {eat} grass with their big mouths. | Don't talk when you are {eating} your food.|seeing flying",
      "see fly",
    ),
    word(
      "big bigger biggest",
      "large; not small",
      "大的",
      "An elephant is very {big}. | A horse is {bigger} than a dog.|smaller sadder | Our house is {big}. It has ten rooms.",
      "small sad",
    ),
    word(
      "small smaller smallest",
      "little; not big",
      "小的",
      "A mouse is very {small}. | A mouse is {smaller} than a cat.|bigger longer | My room is {small}. It has one bed and one chair.",
      "big long",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Swim*, *fly*, *walk* and *run* all mean moving, so look for the place or the speed: water for *swim*, the sky for *fly*, slow feet for *walk*, fast feet for *run*.",
        "*swim*、*fly*、*walk*、*run* 都表示移动，所以要看地点或快慢：水里是 *swim*，天上是 *fly*，慢慢走是 *walk*，跑得快是 *run*。",
      ),
      meaning: t(
        "*Can* says what you are able to do; *like* says what you think is nice. *Big* and *small* are opposites, so read whether the meaning says large or little.",
        "*can* 说的是能做什么；*like* 说的是觉得什么好。*big* 和 *small* 意思相反，看清释义说的是大还是小。",
      ),
      spell: t(
        "Many action words change in the past: *ran*, *swam*, *flew*, *saw*, *ate*, not *runned* or *flyed*. *Swimming* and *running* double the last consonant.",
        "不少动作词的过去式不规则：*ran*、*swam*、*flew*、*saw*、*ate*，不是 *runned* 或 *flyed*。*swimming*、*running* 要双写词尾辅音。",
      ),
    },
    notes: `
      can|birds that fly and fish that can't;a question about swimming answered with I can;a question about a fish walking answered with it can't|can is about being able to; do asks what you usually do|can 说的是能不能；do 问的是平常做不做|do/does/doesn't=do asks or tells what you usually do, not what you are able to do, so it does not match can or can't next to it=do 问或说的是平常做不做，不是能不能，和旁边的 can 或 can't 对不上;will/won't=will talks about the future, not about what you are able to do, so it does not match can or can't next to it=will 说的是将来，不是能不能，和旁边的 can 或 can't 对不上|can|a for the short sound, and *can't* with an apostrophe for *cannot*|a 发短音；*can't* 是 *cannot* 的缩写，要加撇号
      like|cats that are nice;the color red you love;a new bag she thinks is nice|you like what you think is nice; you see what is in front of your eyes|like 是觉得好；see 是眼睛看到|see=see means to notice with your eyes, not to think something is nice=see 是用眼睛看到，不是觉得某样东西好;eat=eat means to put food in your mouth, not to think something is nice=eat 是把食物放进嘴里，不是觉得某样东西好|like|the silent e at the end that makes i say its name|词尾不发音的 e 让 i 读字母本音
      see|a bird in a tree that your eyes find;closed eyes that notice nothing;a big dog in the park yesterday|you see with your eyes; you eat with your mouth|see 用眼睛；eat 用嘴巴|eat=eat means to put food in your mouth, not to notice something with your eyes=eat 是把食物放进嘴里，不是用眼睛看到;swim=swim means to move through water, not to notice something with your eyes=swim 是在水里游，不是用眼睛看到|see|the double e, and the past *saw*, not *seed*|两个 e；过去式是 *saw*，不是 *seed*
      run|horses moving very fast;moving fast in the classroom;a dog going fast after a ball|you run fast on your feet; you swim in water|run 是用脚快跑；swim 是在水里游|swim=swim means to move through water, not to move fast on your feet=swim 是在水里游，不是用脚快跑;fly=fly means to move through the air, not to move fast on your feet=fly 是在空中飞，不是用脚快跑|run|the past *ran*, not *runned*, and the double n in *running*|过去式是 *ran*，不是 *runned*；*running* 双写 n
      jump|rabbits with long back legs;going up and down on the bed;a cat going onto a table|you jump up into the air with your legs; you fly with wings|jump 是用腿跳起来；fly 是用翅膀飞|fly=fly means to move through the air with wings, not to push up with your legs=fly 是用翅膀在空中飞，不是用腿跳起来;swim=swim means to move through water, not to push up into the air with your legs=swim 是在水里游，不是用腿跳到空中|jump|u for the short sound, then mp|u 发短音，后面是 mp
      swim|fish in the water;going to the pool every week;moving like fish in the sea|you swim in water; you fly in the air|swim 在水里；fly 在空中|fly=fly means to move through the air, not through water=fly 是在空中飞，不是在水里;walk=walk means to move on your feet on land, not through water=walk 是在陆地上用脚走，不是在水里|swim|sw at the start, the past *swam*, and the double m in *swimming*|开头是 sw，过去式是 *swam*，*swimming* 双写 m
      fly|birds in the sky;a plane;a bird going up into the sky|you fly through the air; you swim through water|fly 在空中；swim 在水里|swim=swim means to move through water, not through the air=swim 是在水里游，不是在空中;walk=walk means to move on your feet on the ground, not through the air=walk 是在地上用脚走，不是在空中|fly|y at the end, which changes in *flies* and *flew*|词尾是 y，在 *flies* 和 *flew* 中会变化
      walk|going to school with a friend;babies too small to stand;going to the park together|you walk on your feet, not fast; you fly in the air|walk 是用脚慢慢走；fly 在空中|fly=fly means to move through the air, not on your feet=fly 是在空中飞，不是用脚走;swim=swim means to move through water, not on your feet=swim 是在水里游，不是用脚走|walk|the silent l: walk sounds like *wok*|l 不发音：walk 读起来像 *wok*
      eat|rice for lunch;cows and grass;talking while you have your food|you eat food with your mouth; you see with your eyes|eat 是用嘴吃东西；see 是用眼睛看|see=see means to notice with your eyes, not to put food in your mouth=see 是用眼睛看，不是把食物放进嘴里;fly=fly means to move through the air, not to put food in your mouth=fly 是在空中飞，不是把食物放进嘴里|eat|ea for the long e sound, and the past *ate*|ea 发长 e 音，过去式是 *ate*
      big|a very large elephant;a horse and a dog;a house with ten rooms|big means large; small means little|big 是大；small 是小|small/smaller=small means little, the opposite of big=small 是小，和 big 意思相反;sad/sadder=sad means feeling bad, not large in size=sad 是难过，不是个头大|big|the double g in *bigger* and *biggest*|*bigger*、*biggest* 双写 g
      small|a very little mouse;a mouse and a cat;a room with one bed and one chair|small means little; big means large|small 是小；big 是大|big/bigger=big means large, the opposite of small=big 是大，和 small 意思相反;long/longer=long means big from one end to the other, not little in size=long 是长，不是小|small|the double l at the end|结尾双写 l
    `,
  },
});

const littleWords = vocabularyTopic({
  id: "pre-a1-words-little-words",
  title: t("Little Words", "小词"),
  summary: t(
    "But, or, very, to, at and of, and good, bad, happy, sad and long.",
    "but、or、very、to、at、of，以及 good、bad、happy、sad、long。",
  ),
  intro: t(
    "It is Lily's birthday, and she is **very** **happy**. She can have cake **or** ice cream, **but** not both! These little words help you join ideas and say how things and people are.",
    "今天是莉莉的生日，她 **very**（非常）**happy**（开心）。她可以吃蛋糕 **or**（或者）冰激凌，**but**（但是）不能两样都要！这些小词帮你把意思连起来，说出东西和人怎么样。",
  ),
  prerequisites: ["pre-a1-words-how-many"],
  words: [
    word(
      "but",
      "a word that joins two different ideas",
      "但是",
      "I like cats, {but} I don't like dogs. | Birds can fly, {but} fish can't. | The box is small, {but} it is very heavy.",
      "or so",
    ),
    word(
      "or",
      "a word that gives a choice",
      "或者；还是",
      "Is it a cat {or} a dog? It's a dog. | Do you want milk {or} water? Milk, please. | Is your bag red {or} blue? It's blue.",
      "and but",
    ),
    word(
      "very",
      "more than usual",
      "很；非常",
      "The elephant is {very} big. | Thank you {very} much! | I am {very} happy today.",
      "much many",
    ),
    word(
      "to",
      "in the direction of; toward",
      "到；去；向",
      "I go {to} school by bus. | Say hello {to} your mom. | Give the book {to} me.",
      "at of",
    ),
    word(
      "at",
      "in or near a place; at a time",
      "在（某地或某时）",
      "I am {at} school. | Look {at} me! | We eat lunch {at} twelve.",
      "to of",
    ),
    word(
      "of",
      "that belongs to; that is part of",
      "……的",
      "This is a picture {of} my family. | A cup {of} tea, please. | One {of} my friends is from China.",
      "at to",
    ),
    word(
      "good better best",
      "nice, or done well",
      "好的",
      "Well done! You are very {good} at drawing. | Lily is my {best} friend. I love playing with her.|worst saddest | Have a {good} day!",
      "bad sad",
    ),
    word(
      "bad worse worst",
      "not good",
      "坏的；糟糕的",
      "Oh no! The milk is {bad}. Don't drink it. | It's a {bad} day. It is raining and I am sick. | Oh no! This is the {worst} day ever!|best happiest",
      "good happy",
    ),
    word(
      "happy happier happiest",
      "feeling good and glad",
      "快乐的；高兴的",
      "It's my birthday! I am very {happy}. | The children are {happy}. They are laughing. | {Happy} birthday, Tom!",
      "sad bad",
    ),
    word(
      "sad sadder saddest",
      "feeling bad, maybe crying",
      "难过的；伤心的",
      "My dog is sick. I am {sad}. | Why are you crying? Are you {sad}? | The girl is {sad}, so she is crying.",
      "happy good",
    ),
    word(
      "long longer longest",
      "big from one end to the other",
      "长的",
      "A giraffe has a {long} neck. | My sister's hair is so {long} that it touches the floor. | The train is very {long}. It has twenty cars.",
      "short small",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*But* joins two ideas that go against each other; *or* gives a choice, so it often sits in a question with two things and an answer that picks one.",
        "*but* 连接意思相反的两件事；*or* 表示选择，常用在问两样东西、回答只选一样的问句里。",
      ),
      meaning: t(
        "*Good* and *bad* say how nice something is; *happy* and *sad* say how a person feels. Check whether the meaning talks about a thing or a feeling.",
        "*good* 和 *bad* 说东西好不好；*happy* 和 *sad* 说人的心情。看清释义说的是东西还是感受。",
      ),
      spell: t(
        "*Good* and *bad* change completely: *better*, *best* and *worse*, *worst*. *Sad* doubles its d in *sadder*, and *happy* changes y to i in *happier*.",
        "*good* 和 *bad* 的变化完全不规则：*better*、*best*，*worse*、*worst*。*sad* 变 *sadder* 要双写 d，*happy* 变 *happier* 要把 y 改成 i。",
      ),
    },
    notes: `
      but|liking cats and not liking dogs;birds that fly and fish that can't;a small box that is very heavy|but joins two ideas that go against each other; or gives a choice|but 连接相反的两件事；or 表示选择|or=or gives a choice between two things, not two ideas that go against each other=or 表示在两样东西中选一个，不是连接相反的两件事;so=so tells what happens because of the first idea, not an idea that goes against it=so 说的是因为前一件事而产生的结果，不是相反的事|but|the short u, as in *bus*|u 发短音，和 *bus* 一样
      or|a cat or a dog, answered with a dog;milk or water, answered with milk;a red or blue bag, answered with blue|or gives a choice; and puts two things together|or 表示选一个；and 是两个都要|and=and puts two things together, but the answer picks only one=and 是把两样东西放在一起，可回答只选了一样;but=but joins two ideas that go against each other, not a choice between two things=but 连接相反的两件事，不是在两样东西中选择|or|just o and r, said like *oar*|只有 o 和 r，读音像 *oar*
      very|a big elephant;saying thank you;a happy day|very goes before a describing word like *big*; much goes after *thank you* or a verb|very 放在 *big* 这类形容词前面；much 放在 *thank you* 或动词后面|much=much tells how much of something, and it cannot go straight before a describing word like big or happy=much 说的是数量多少，不能直接放在 big、happy 这类形容词前面;many=many tells how many things there are, and it needs a noun like *cats* after it=many 说的是东西有多少个，后面要跟 *cats* 这样的名词|ve · ry|one r and y at the end|只有一个 r，词尾是 y
      to|going to school by bus;saying hello to mom;giving a book to me|to shows where something goes; at shows where something is|to 表示去向；at 表示在哪里|at=at tells where something is or when, not where it goes=at 说的是在哪里或在什么时候，不是去向哪里;of=of tells what something belongs to or is part of, not where it goes=of 说的是属于或属于其中的一部分，不是去向|to|just t and o, not *too* or *two*|只有 t 和 o，不是 *too* 或 *two*
      at|being in a place called school;looking at me;the time for lunch|at shows where or when; to shows where something goes|at 表示在哪里或什么时候；to 表示去向|to=to tells where something goes, not where it is or at what time=to 说的是去向，不是在哪里或在几点;of=of tells what something belongs to, not a place or a time=of 说的是属于什么，不是地点或时间|at|just a and t|只有 a 和 t
      of|a picture of a family;a cup of tea;one of my friends|of shows what something belongs to or is part of; at shows a place or a time|of 表示属于或其中一部分；at 表示地点或时间|at=at tells a place or a time, not what something belongs to or is part of=at 说的是地点或时间，不是属于什么;to=to tells where something goes, not what something belongs to or is part of=to 说的是去向，不是属于什么|of|f said like v: *of* sounds like *ov*|f 读作 v：*of* 读起来像 *ov*
      good|being very good at drawing;my best friend I love playing with;wishing someone a nice day|good means nice or done well; bad means not good|good 是好；bad 是不好|bad/worst=bad means not good, the opposite of good=bad 是不好，和 good 意思相反;sad/saddest=sad means feeling bad and maybe crying, not nice or done well=sad 是难过、想哭，不是好或做得好|good|the double o, and the forms *better* and *best*|两个 o；比较级和最高级是 *better*、*best*
      bad|milk you must not drink;a day of rain and being sick;the worst day ever|bad means not good; good means nice|bad 是不好；good 是好|good/best=good means nice or done well, the opposite of bad=good 是好，和 bad 意思相反;happy/happiest=happy means feeling glad, not something that is not good=happy 是开心，不是糟糕|bad|the forms *worse* and *worst*, not *badder*|比较级和最高级是 *worse*、*worst*，不是 *badder*
      happy|a birthday that makes me glad;children laughing;a birthday wish for Tom|happy means feeling glad; sad means feeling bad|happy 是开心；sad 是难过|sad=sad means feeling bad and maybe crying, the opposite of happy=sad 是难过、想哭，和 happy 意思相反;bad=bad means not good, and it describes things, not a glad feeling=bad 是不好，多用来说东西，不是开心的心情|hap · py|the double p, and y changing to i in *happier*|双写 p；*happier* 要把 y 改成 i
      sad|a sick dog and how I feel;crying and how you feel;a girl crying|sad means feeling bad; happy means feeling glad|sad 是难过；happy 是开心|happy=happy means feeling glad, the opposite of sad, so it does not go with crying=happy 是开心，和 sad 意思相反，跟哭对不上;good=good means nice or done well, not feeling bad and crying=good 是好或做得好，不是难过想哭|sad|the double d in *sadder* and *saddest*|*sadder*、*saddest* 双写 d
      long|a giraffe's neck;hair that touches the floor;a train with twenty cars|long means big from one end to the other; short means the opposite|long 是长；short 是短|short=short means not long, the opposite of long=short 是短，和 long 意思相反;small=small means little all over, not big from one end to the other=small 是整体小，不是从一头到另一头很长|long|ng at the end, said together|结尾的 ng 连在一起读
    `,
  },
});

// Can and can't.

/** profiles say, for animals and people, what each can and can't do; every sentence they make is true. */
const profiles: readonly (readonly [subject: string, can: readonly string[], cannot: readonly string[]])[] = [
  ["A bird", ["fly", "sing", "walk"], ["swim under the water"]],
  ["A fish", ["swim"], ["walk", "run", "fly", "climb a tree"]],
  ["A horse", ["run fast", "jump", "eat grass"], ["fly", "climb a tree"]],
  ["A rabbit", ["jump", "run fast", "eat carrots"], ["fly", "climb a tree"]],
  ["A cow", ["eat grass", "walk"], ["fly", "jump very high", "climb a tree"]],
  ["A duck", ["swim", "fly", "walk"], ["climb a tree"]],
  ["A pig", ["eat a lot", "run"], ["fly", "climb a tree"]],
  ["A frog", ["jump", "swim"], ["fly"]],
  ["A cat", ["see at night", "jump", "climb a tree", "run"], ["fly", "talk"]],
  ["A dog", ["run", "swim", "jump"], ["fly", "talk"]],
  ["A mouse", ["run very fast", "climb"], ["fly", "talk"]],
  ["A baby", ["eat", "sleep a lot"], ["walk", "run fast", "ride a bike"]],
  ["My dad", ["swim", "read", "ride a bike", "run fast"], ["fly"]],
  ["I", ["draw a cat", "read", "write", "sing"], ["fly"]],
  ["We", ["read and write", "run", "jump", "swim"], ["fly"]],
  ["They", ["jump very high", "ride a horse", "sing"], ["fly"]],
  ["You", ["open the door", "sing", "read"], ["fly"]],
  ["Tom", ["run very fast", "swim", "read"], ["fly"]],
  ["She", ["sing very well", "ride a horse", "swim"], ["fly"]],
];

/** animalsCannot are what no animal can do, said of every animal in the profiles. */
const animalsCannot: readonly string[] = ["read", "write", "ride a bike"];

/** abilities are true facts about what animals and people can and can't do, each verb split from the rest. */
const abilities: readonly (readonly [subject: string, can: boolean, verb: string, rest: string])[] = interleave(
  profiles.map(([subject, can, cannot]) => {
    const isAnimal = subject.startsWith("A ") && subject !== "A baby";
    const facts = [
      ...can.map((v) => [true, v] as const),
      ...cannot.map((v) => [false, v] as const),
      ...(isAnimal ? animalsCannot.map((v) => [false, v] as const) : []),
    ];
    return facts.map(([yes, phrase]) => {
      const [verb = "", ...rest] = phrase.split(" ");
      return [subject, yes, verb, rest.length > 0 ? ` ${rest.join(" ")}` : ""] as const;
    });
  }),
);

const third = (verb: string) => (verb.endsWith("y") ? `${verb.slice(0, -1)}ies` : `${verb}s`);

const canChoiceBank: readonly ChoiceItem[] = abilities.map(([subject, can, verb, rest]): ChoiceItem => {
  const modal = can ? "can" : "can't";
  return [
    "",
    `${subject} ${modal} ${verb}${rest}.`,
    [`${subject} ${modal} ${third(verb)}${rest}.`, `${subject} ${modal} to ${verb}${rest}.`],
  ];
});

const canTypedBank: readonly TypedItem[] = abilities.map(([subject, can, verb, rest]): TypedItem => {
  const lower = /^(A|My|We|They|You|She|He)\b/u.test(subject) ? subject.charAt(0).toLowerCase() + subject.slice(1) : subject;
  return {
    shown: `${lower} / ${verb}${rest} (${can ? "yes" : "no"})`,
    accepted: [can ? `${subject} can ${verb}${rest}.` : `${subject} [can't|cannot] ${verb}${rest}.`],
    canonical: `${subject} ${can ? "can" : "can't"} ${verb}${rest}.`,
    wrong: [
      `${subject} ${can ? "can" : "can't"} ${third(verb)}${rest}.`,
      `${subject} ${can ? "can" : "can't"} to ${verb}${rest}.`,
      ...(can ? [] : [`${subject} don't can ${verb}${rest}.`, `${subject} not can ${verb}${rest}.`]),
    ],
  };
});

const canForAbility: TopicDef = {
  id: "can-for-ability",
  title: t("Can and Can't", "can 和 can't"),
  summary: t(
    "A bird can fly. A fish can't walk. After can the verb has no -s and no to.",
    "A bird can fly. A fish can't walk. can 后面的动词不加 -s，也不加 to。",
  ),
  intro: t(
    "Look at *A duck can swim.* and *A duck can't climb a tree.* Whether the subject is *I*, *she*, or *a duck*, *can* and *can't* never change, and the verb right after them stays completely plain—no *-s* and no *to*. In this topic, you spot and write accurate *can* / *can't* sentences.",
    "看看 *A duck can swim.* 和 *A duck can't climb a tree.* 无论主语是 *I*、*she* 还是 *a duck*，*can* 和 *can't* 从不变化，后面的动词也一律用原形——不加 *-s*，也不加 *to*。本主题带你辨认并写出准确的 *can* / *can't* 句子。",
  ),
  prerequisites: ["pre-a1-words-can-and-like"],
  encompasses: [{ topic: "pre-a1-words-can-and-like", weight: 0.4 }],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("The verb after can", "can 后面的动词"),
      t(
        "After *can* and *can't*, the verb stays plain: no *-s* and no *to*.\n\n*A bird can fly.* Not *A bird can flies.* or *A bird can to fly.*\n\n> **Watch out.** Even after *he*, *she*, *Tom*, or *a bird*, never add *-s* to the verb after *can* or *can't*, and never insert *to* between them.",
        "*can* 和 *can't* 后面的动词用原形：不加 *-s*，也不加 *to*。\n\n说 *A bird can fly.*，不说 *A bird can flies.* 或 *A bird can to fly.*\n\n> **注意。** 即使主语是 *he*、*she*、*Tom* 或 *a bird*，*can* / *can't* 后面的动词也绝不加 *-s*，中间也绝不加 *to*。",
      ),
      choiceGenerator(
        t("Which sentence is right?", "哪个句子是对的？"),
        canChoiceBank,
        (right) =>
          t(
            `${right} After *can* and *can't*, the verb stays plain, with no *-s* and no *to*.\n\n**Check.** Look right after *can* / *can't*—there is no *to* in between and no *-s* on the verb.`,
            `${right} *can* 和 *can't* 后面的动词用原形，不加 *-s*，也不加 *to*。\n\n**检验。** 紧盯着 *can* / *can't* 后面的词——中间没有 *to*，动词词尾也没有 *-s*。`,
          ),
        (_wrong, _right, _shown, position) =>
          position === 0
            ? t(
                "This adds *-s* to the verb after *can*, but the verb after *can* always stays plain.",
                "这句给 *can* 后面的动词加了 *-s*，可 *can* 后面的动词总是用原形。",
              )
            : t(
                "This puts *to* after *can*, but *can* is followed by the verb straight away.",
                "这句在 *can* 后面加了 *to*，可 *can* 后面直接跟动词。",
              ),
      ),
    ),
    point(
      "write",
      t("Writing can and can't", "写 can 和 can't 的句子"),
      t(
        "Write *can* for yes and *can't* for no. *Can't* is the short form of *cannot*. Never say *don't can*.\n\n*fish / swim (yes)* → *A fish can swim.*\n*fish / walk (no)* → *A fish can't walk.*\n\n> **Watch out.** For negative ability, write *can't* (or *cannot*)—never *don't can* or *not can*—and keep the verb right after it plain.",
        "“是”用 *can*，“不是”用 *can't*。*can't* 是 *cannot* 的缩写。中文说“不会”，但英语不能说 *don't can*。\n\n*fish / swim (yes)* → *A fish can swim.*\n*fish / walk (no)* → *A fish can't walk.*\n\n> **注意。** 表达“不会/不能”时用 *can't*（或 *cannot*）——切勿写 *don't can* 或 *not can*——后面的动词保持原形。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Write a sentence with can or can't.", "用 can 或 can't 写一个句子。"),
        canTypedBank,
        (right, shown) =>
          shown.endsWith("(yes)")
            ? t(
                `The note says yes, so write *can*, and the verb after it stays plain: ${right}\n\n**Check.** Verify the pattern *[Subject] + can + [plain verb]* with a capital letter at the start and a period at the end.`,
                `提示是 yes，所以用 *can*，后面的动词用原形：${right}\n\n**检验。** 核对结构“主语 + *can* + 动词原形”，确认句首大写、句末有句号。`,
              )
            : t(
                `The note says no, so write *can't*, never *don't can*, and the verb after it stays plain: ${right}\n\n**Check.** Verify the pattern *[Subject] + can't + [plain verb]* (not *don't can* or *not can*) with no *-s* or *to*.`,
                `提示是 no，所以用 *can't*，不能说 *don't can*，后面的动词用原形：${right}\n\n**检验。** 核对结构“主语 + *can't* + 动词原形”（不是 *don't can* 或 *not can*），且没有 *-s* 或 *to*。`,
              ),
      ),
    ),
  ],
};

// Questions with be.

/** statementGroups pair subjects with the rests that fit them, in sentences with be. */
const statementGroups: readonly (readonly [subjects: readonly string[], be: "am" | "is" | "are", rests: readonly string[]])[] = [
  [["it"], "is", ["a cat", "a frog", "a pig", "an egg", "a fish", "a horse", "a mouse", "blue", "red", "big", "small", "a book", "a pen"]],
  [
    ["Tom", "Anna", "he", "she", "Ben", "Lily", "your mom"],
    "is",
    ["happy", "sad", "at school", "at home", "in the classroom", "here", "your friend"],
  ],
  [["you"], "are", ["a student", "sad", "happy", "at home", "late", "ten"]],
  [["we"], "are", ["late", "here", "at school", "happy"]],
  [["they", "the cats", "the birds", "the frogs", "the ducks"], "are", ["black", "green", "in the tree", "here", "big", "small"]],
  [["the dog", "the horse", "the mouse", "the cow", "the duck"], "is", ["big", "small", "here", "black", "fast", "at home"]],
];

/** statements are sentences with be, each with its subject and the rest. */
const statements: readonly (readonly [subject: string, be: "am" | "is" | "are", rest: string])[] = interleave(
  statementGroups.map(([subjects, be, rests]) => everyPair(subjects, rests).map(([subject, rest]) => [subject, be, rest] as const)),
);

const asStatement = (subject: string, be: string, rest: string) => `${sentenceCase(subject)} ${be} ${rest}.`;
const asQuestion = (subject: string, be: string, rest: string) => `${sentenceCase(be)} ${subject} ${rest}?`;

const questionChoiceBank: readonly ChoiceItem[] = statements.map(
  ([subject, be, rest]): ChoiceItem => [
    "",
    asQuestion(subject, be, rest),
    [`${sentenceCase(subject)} ${be} ${rest}?`, `${sentenceCase(be)} ${subject} ${rest}.`],
  ],
);

/** answerPronoun is the word a short answer uses for the subject of a question. */
const answerPronoun: Readonly<Record<string, string>> = {
  you: "I",
  Tom: "he",
  Ben: "he",
  Anna: "she",
  Lily: "she",
  "your mom": "she",
};

const shortAnswerOf = (subject: string, be: string): string => {
  const pronoun =
    answerPronoun[subject] ?? (["it", "he", "she", "they", "we"].includes(subject) ? subject : /s$/u.test(subject) ? "they" : "it");
  return `${pronoun} ${pronoun === "I" ? "am" : be}`;
};

const shortAnswerBank: readonly ChoiceItem[] = statements.map(([subject, be, rest], k): ChoiceItem => {
  const yes = k % 2 === 0;
  const [pronoun = "it", verb = "is"] = shortAnswerOf(subject, be).split(" ");
  const negative = verb === "am" ? "am not" : `${verb}n't`;
  const right = yes ? `Yes, ${pronoun} ${verb}.` : `No, ${pronoun} ${negative}.`;
  const contracted = pronoun === "I" ? "I'm" : pronoun === "they" || pronoun === "we" ? `${pronoun}'re` : `${pronoun}'s`;
  return [
    `${asQuestion(subject, be, rest)} (${yes ? "yes" : "no"})`,
    right,
    yes ? [`Yes, ${contracted}.`, `Yes, ${pronoun} ${negative}.`] : [`No, ${pronoun} ${verb}.`, `No, ${pronoun} not.`],
  ];
});

const questionTypedBank: readonly TypedItem[] = statements.map(
  ([subject, be, rest]): TypedItem => ({
    shown: asStatement(subject, be, rest),
    accepted: [asQuestion(subject, be, rest)],
    wrong: [`${sentenceCase(subject)} ${be} ${rest}?`, `${sentenceCase(subject)} ${be} ${rest} ma?`],
  }),
);

const questionsWithBe: TopicDef = {
  id: "questions-with-be",
  title: t("Questions with Be", "用 be 提问"),
  summary: t("Is it a cat? Yes, it is. The verb moves to the front.", "Is it a cat? Yes, it is. 动词移到句首。"),
  intro: t(
    "Turn *She is at home.* into a question by moving *is* to the front: *Is she at home?* Then answer cleanly with *Yes, she is.* or *No, she isn't.* In this topic, you form yes/no questions with *be* and choose natural short answers.",
    "把 *She is at home.* 变成问句，要把 *is* 移到句首：*Is she at home?* 简略回答则是 *Yes, she is.* 或 *No, she isn't.* 本主题带你用 *be* 构成一般疑问句，并掌握规范的简略回答。",
  ),
  prerequisites: ["the-verb-be", "pre-a1-words-animals"],
  encompasses: [{ topic: "the-verb-be", weight: 0.4 }],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("The order of a question", "问句的语序"),
      t(
        "To ask a yes-or-no question, move *am*, *is* or *are* to the front and end with a question mark.\n\n*It is a cat.* → *Is it a cat?*\n*They are ducks.* → *Are they ducks?*\n\n> **Watch out.** Check *both* ends of the question: the verb (*Is/Are*) must sit before the subject, and the sentence must end with `?`, not `.`",
        "中文把陈述句变成问句，只要在句末加“吗”：“它是猫吗？”英语却要把 *am*、*is* 或 *are* 移到句首，句末用问号。\n\n*It is a cat.* → *Is it a cat?*\n*They are ducks.* → *Are they ducks?*\n\n> **注意。** 同时检查句首和句尾：动词（*Is/Are*）必须在主语前面，句末必须是 `?`，不能是句号。",
      ),
      choiceGenerator(
        t("Which one is a right question?", "哪一个是正确的问句？"),
        questionChoiceBank,
        (right) =>
          t(
            `${right} A yes-or-no question puts *${right.split(" ")[0]?.toLowerCase()}* before the subject and ends with a question mark.\n\n**Check.** Verify both marks of a *be*-question: *${right.split(" ")[0]}* comes first before the subject, and a question mark (?) closes the sentence.`,
            `${right} 一般疑问句把 *${right.split(" ")[0]?.toLowerCase()}* 放在主语前面，句末用问号。\n\n**检验。** 确认 *be* 问句的两个标志：*${right.split(" ")[0]}* 位于主语前，且句末以问号（?）结尾。`,
          ),
        (_wrong, _right, _shown, position) =>
          position === 0
            ? t(
                "This keeps the order of a statement and only adds a question mark, the way Chinese adds 吗; English moves the verb to the front.",
                "这句保留了陈述句的语序，只加了问号，就像中文只加“吗”；英语要把动词移到句首。",
              )
            : t(
                "This has the order of a question but ends with a period; a question ends with a question mark.",
                "这句语序对了，句末却用了句号；问句要以问号结尾。",
              ),
      ),
    ),
    point(
      "short-answers",
      t("Short answers", "简略回答"),
      t(
        "Answer with *Yes* or *No*, the word for who or what, and the verb: *Is it a cat? Yes, it is.* / *No, it isn't.* A question with *you* gets an answer with *I*: *Are you sad? No, I am not.*\n\nIn a short yes answer, do not use a short form: say *Yes, it is.*, not *Yes, it's.*\n\n> **Watch out.** Never contract a *Yes* short answer (*Yes, it's.* is wrong), and make sure *Yes* pairs with a positive verb while *No* pairs with *not* / *-n't*.",
        "用 *Yes* 或 *No*、代词和动词来回答：*Is it a cat? Yes, it is.* / *No, it isn't.* 问句中是 *you*，回答用 *I*：*Are you sad? No, I am not.*\n\n肯定的简略回答不能用缩写：说 *Yes, it is.*，不说 *Yes, it's.*\n\n> **注意。** 肯定简略回答绝不能缩写（不能说 *Yes, it's.*），而且 *Yes* 后面用肯定动词，*No* 后面必须带 *not* 或 *-n't*。",
      ),
      choiceGenerator(
        t("Choose the short answer.", "选出简略回答。"),
        shortAnswerBank,
        (right, shown) =>
          t(
            `A short answer is *${right.split(",")[0]}*, the word for who or what, and the verb of the question${right.startsWith("No") ? " with *not*" : ""}: ${shown.replace(/ \((yes|no)\)$/u, "")} ${right}\n\n**Check.** Confirm that *Yes/No* matches the verb's polarity (no contraction after *Yes*, *not/n't* included after *No*) and that the pronoun matches the question's subject.`,
            `简略回答由 *${right.split(",")[0]}*、代词和问句里的动词${right.startsWith("No") ? "加 *not*" : ""}组成：${shown.replace(/ \((yes|no)\)$/u, "")} ${right}\n\n**检验。** 确认 *Yes/No* 与动词的肯定或否定一致（*Yes* 后不缩写，*No* 后必有 *not/n't*），且代词与问句主语对应。`,
          ),
        (_wrong, right, _shown, position) =>
          right.startsWith("Yes")
            ? position === 0
              ? t(
                  "A short yes answer ends with the full verb, never a short form like *it's*.",
                  "肯定的简略回答以完整的动词结尾，不能用 *it's* 这样的缩写。",
                )
              : t(
                  "This starts with *Yes* but then says *not*, so it says yes and no at once.",
                  "这句以 *Yes* 开头，后面却有否定，等于同时说“是”和“不是”。",
                )
            : position === 0
              ? t(
                  "This starts with *No* but then says the verb without *not*, so it says no and yes at once.",
                  "这句以 *No* 开头，后面的动词却没有 *not*，等于同时说“不是”和“是”。",
                )
              : t("This leaves out the verb; a short answer needs it before *not*.", "这句漏了动词；简略回答在 *not* 前面要有动词。"),
      ),
    ),
    point(
      "write",
      t("Writing questions", "写问句"),
      t(
        "Turn the sentence into a question: the verb goes first, and the end is a question mark. For example: *Tom is at school.* → *Is Tom at school?*\n\n> **Watch out.** Remember to capitalize the moved verb (*Is* / *Are*), lower-case the subject unless it is *I* or a name (*The dog* -> *the dog*, but *Tom* stays *Tom*), and end with `?`.",
        "把陈述句改成问句：动词放在最前面，句末用问号。例如：*Tom is at school.* → *Is Tom at school?*\n\n> **注意。** 移到句首的动词要大写（*Is* / *Are*），原主语除 *I* 和人名外改为小写（如 *The dog* -> *the dog*，但 *Tom* 仍大写），句末加 `?`。",
      ),
      typedGenerator("sentence", t("Write the sentence as a question.", "把这个句子改成问句。"), questionTypedBank, (right, shown) =>
        t(
          `Move *${right.split(" ")[0]?.toLowerCase()}* to the front, before the subject, and end with a question mark: ${shown} → ${right}\n\n**Check.** Swap the first two blocks back mentally (*${right}* -> *${shown}*)—you should recover the original statement cleanly, with the question mark replaced by a period.`,
          `把 *${right.split(" ")[0]?.toLowerCase()}* 移到句首、主语前面，句末用问号：${shown} → ${right}\n\n**检验。** 在心里把句首动词和主语换回原位，应能完整还原原陈述句，并把句末的问号换回句号。`,
        ),
      ),
    ),
  ],
};

/** topics are the topics of the unit Animals. */
export const topics: readonly TopicDef[] = [animals.topic, canAndLike.topic, littleWords.topic, canForAbility, questionsWithBe];

/** vocabulary are the words the unit Animals teaches. */
export const vocabulary: readonly WordBatch[] = [animals.batch, canAndLike.batch, littleWords.batch];
