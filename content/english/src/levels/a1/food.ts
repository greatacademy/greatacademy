// A1, unit 4: Food and Drink. Food, drinks, meals and favorite foods, countable and uncountable nouns, some and any,
// and joining sentences with and, but and or.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, interleave, sentenceCase, vocabularyTopic, word } from "../words.ts";

const food = vocabularyTopic({
  id: "a1-words-food",
  title: t("Food", "食物"),
  summary: t("Fruit, vegetables, meat, rice, bread, eggs and more.", "水果、蔬菜、肉、米饭、面包、鸡蛋等。"),
  intro: t(
    "For lunch I have **rice**, **chicken** and some **vegetables**, then an **apple**. These words help you name the food you eat every day.",
    "午饭我吃 **rice**（米饭）、**chicken**（鸡肉）和一些 **vegetables**（蔬菜），然后吃一个 **apple**（苹果）。这些词帮你说出每天吃的食物。",
  ),
  prerequisites: ["a1-words-my-day"],
  words: [
    word(
      "food foods",
      "what people and animals eat",
      "食物",
      "Rice, bread and eggs are {food}. | The dog is hungry. Give him some {food}. | I like Chinese {food}, like dumplings and noodles.",
      "fruit drink",
    ),
    word(
      "fruit fruits",
      "a sweet food that grows on a tree or a plant, like an apple",
      "水果",
      "Apples and bananas are {fruit}. | I eat {fruit} every day: an apple in the morning. | Is a tomato a {fruit} or a vegetable?",
      "vegetable meat",
    ),
    word(
      "vegetable vegetables",
      "a plant you eat, like a potato or a tomato",
      "蔬菜",
      "A potato is a {vegetable}. | Eat your potatoes and other {vegetables}.|fruits meats | We grow potatoes, onions and other {vegetables} in our garden.|fruits meats",
      "fruit meat",
    ),
    word(
      "meat meats",
      "food from an animal, like chicken",
      "肉",
      "Chicken is a kind of {meat}. | My sister doesn't eat {meat}, so no chicken for her. | We cook chicken and other {meat} for dinner.",
      "fruit vegetable",
    ),
    word(
      "chicken chickens",
      "a farm bird; its meat",
      "鸡；鸡肉",
      "A {chicken} lives on a farm and gives us eggs. | We eat {chicken} legs and rice for dinner. | The {chickens} are in the garden. Listen: cluck, cluck!|cows eggs",
      "cow egg",
    ),
    word(
      "rice",
      "small white seeds you cook and eat, a lot in Asia",
      "米；米饭",
      "In China, many people eat a bowl of {rice} with chopsticks every day. | A bowl of {rice}, please. | {Rice} grows in wet fields.",
      "bread egg",
    ),
    word(
      "bread breads",
      "a food made from flour and baked, cut into slices",
      "面包",
      "I have {bread} and butter for breakfast. | Mom buys {bread} at the bakery. | A sandwich is two pieces of {bread}.",
      "rice egg",
    ),
    word(
      "egg eggs",
      "a round thing from a bird, with a hard shell; we cook and eat it",
      "蛋；鸡蛋",
      "The chicken gives us an {egg} every day. | I break two {eggs} into the pan for breakfast.|apples oranges | Birds sit on their {eggs}.|apples oranges",
      "apple orange",
    ),
    word(
      "apple apples",
      "a round fruit, red or green",
      "苹果",
      "An {apple} a day is good for you. | {Apples} are red or green.|Bananas Potatoes | There are six red {apples} on the tree.|bananas potatoes",
      "banana potato",
    ),
    word(
      "banana bananas",
      "a long yellow fruit",
      "香蕉",
      "A {banana} is long and yellow. | Monkeys like {bananas}. They peel off the yellow skin.|apples tomatoes | Peel the {banana} and throw away the yellow skin.",
      "apple tomato",
    ),
    word(
      "potato potatoes",
      "a vegetable that grows under the ground; we cook it",
      "土豆",
      "French fries are made from {potatoes}.|tomatoes bananas | A {potato} grows under the ground. | Dig the {potatoes} out of the ground and cook them.|tomatoes bananas",
      "tomato banana",
    ),
    word(
      "tomato tomatoes",
      "a soft red fruit we use like a vegetable",
      "西红柿",
      "A {tomato} is red and round. | We cut red {tomatoes} for the salad.|potatoes bananas | Ketchup is made from {tomatoes}.|potatoes bananas",
      "potato banana",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "Look at the kind of food in the sentence: *fruit* is sweet like apples, *vegetables* are plants like potatoes, and *meat* comes from animals like chickens.",
        "看句子说的是哪类食物：*fruit* 是苹果那样甜的，*vegetables* 是土豆那样的植物，*meat* 来自鸡这样的动物。",
      ),
      meaning: t(
        "*Chicken* is both the farm bird and its meat; *food* is the word for everything we eat. *Rice* grows in fields, but *bread* is baked.",
        "*chicken* 既是农场里的鸡，也是鸡肉；*food* 是所有吃的东西的总称。*rice* 长在田里，*bread* 是烤出来的。",
      ),
      spell: t(
        "*Potato* and *tomato* add -es in the plural: *potatoes*, *tomatoes*. *Vegetable* hides a silent second e, and *bread* has ea said like the e in *red*.",
        "*potato* 和 *tomato* 的复数加 -es：*potatoes*、*tomatoes*。*vegetable* 中间有个不发音的 e，*bread* 的 ea 读作 *red* 里的 e。",
      ),
    },
    notes: `
      food|rice, bread and eggs;something for a hungry dog;dumplings and noodles|food is everything we eat; fruit is only sweet things like apples|food 是所有吃的东西；fruit 只是苹果这样甜的东西|fruit=fruit is only sweet things like apples, not rice, eggs, dog food or dumplings=fruit 只是苹果这样甜的东西，不包括米饭、鸡蛋、狗粮或饺子;drink=drink is something you drink, like water, not something you eat when you are hungry=drink 是喝的东西，比如水，不是饿了吃的东西|food|oo said like *moon*|oo 读作 *moon* 里的音
      fruit|apples and bananas;an apple in the morning;a tomato|fruit is sweet and grows on trees; a vegetable is a plant like a potato|fruit 甜，长在树上；vegetable 是土豆这样的植物|vegetable=vegetable is a plant like a potato, not apples and bananas, and a tomato cannot be *a vegetable or a vegetable*=vegetable 是土豆这样的植物，不是苹果和香蕉，也不会问“是蔬菜还是蔬菜”;meat=meat is food from an animal, not apples, bananas or a tomato=meat 是动物的肉，不是苹果、香蕉或西红柿|fruit|ui said like *oo*, so not *frut*|ui 读作 *oo*，不是 *frut*
      vegetable|a potato;potatoes on the plate;potatoes and onions in the garden|a vegetable is a plant like a potato; fruit is sweet like an apple|vegetable 是土豆这样的植物；fruit 是苹果这样甜的|fruit/fruits=fruit is sweet like an apple, but a potato and an onion are not fruit=fruit 是苹果那样甜的，可土豆和洋葱不是水果;meat/meats=meat comes from animals, but potatoes and onions are plants=meat 来自动物，可土豆和洋葱是植物|veg · e · ta · ble|a second e that is hardly said, and -ble at the end|中间第二个 e 几乎不发音，结尾是 -ble
      meat|chicken;no chicken for my sister;chicken for dinner|meat comes from animals; fruit is sweet and grows on trees|meat 来自动物；fruit 甜，长在树上|fruit=fruit is sweet like an apple, but chicken is not fruit=fruit 是苹果那样甜的，可鸡肉不是水果;vegetable=vegetable is a plant like a potato, but chicken comes from an animal=vegetable 是土豆这样的植物，可鸡肉来自动物|meat|ea said like *eat*, the same sound as *meet*|ea 读作 *eat*，和 *meet* 同音
      chicken|a farm bird that gives eggs;legs and rice for dinner;birds saying cluck, cluck|a chicken is a farm bird that gives eggs; a cow is a big farm animal that gives milk|chicken 是下蛋的鸡；cow 是产奶的牛|cow/cows=cow is a big farm animal that gives milk, not a bird that gives eggs or says cluck=cow 是产奶的大牲畜，不是下蛋、咯咯叫的鸟;egg/eggs=egg is what a chicken gives, not the bird itself, and it has no legs=egg 是鸡下的蛋，不是鸡本身，也没有腿|chick · en|ck in the middle, then -en, so not *chiken*|中间是 ck，后面是 -en，不是 *chiken*
      rice|a bowl eaten with chopsticks;a bowl to order;wet fields|rice is small white seeds; bread is baked from flour|rice 是白色的小米粒；bread 是用面粉烤的|bread=bread is baked from flour and cut into slices, not eaten from a bowl or grown in fields=bread 是面粉烤的，切成片，不用碗盛，也不长在田里;egg=egg comes from a bird, not in a bowl with chopsticks or from wet fields=egg 是鸟下的，不是用碗和筷子吃的，也不长在田里|rice|c said like s, and a silent e at the end|c 读作 s，词尾 e 不发音
      bread|breakfast with butter;something from the bakery;the two pieces of a sandwich|bread is baked and cut into slices; rice is cooked in water|bread 是烤的，切成片；rice 用水煮|rice=rice is small seeds cooked in water, not something spread with butter, baked or cut into pieces=rice 是用水煮的小米粒，不抹黄油，不是烤的，也不切成片;egg=egg comes from a bird, not baked at a bakery or cut into pieces for a sandwich=egg 是鸟下的，不是面包房烤的，也不切成片做三明治|bread|ea said like the e in *red*|ea 读作 *red* 里的 e
      egg|what a chicken gives every day;two broken into a pan;what birds sit on|an egg comes from a bird; an apple grows on a tree|egg 是鸟下的；apple 长在树上|apple/apples=apple grows on a tree, so a chicken does not give it, and you do not break it into a pan or sit on it=apple 长在树上，鸡不会下，也不会打进锅里或坐在上面孵;orange/oranges=an orange is a round fruit from a tree, so a chicken does not lay it, and you cannot fry it in a pan or sit on it until it hatches=orange 是树上结的圆形水果，鸡不会下，也不能放进锅里煎，更孵不出小鸟|egg|a double g at the end|结尾双写 g
      apple|one a day;red or green;red ones on a tree|an apple is round, red or green; a banana is long and yellow|apple 是圆的，红色或绿色；banana 又长又黄|banana/bananas=banana is long and yellow, not red or green, and it goes with *a*, not *an*=banana 又长又黄，不是红色或绿色，前面用 *a*，不用 *an*;potato/potatoes=potato is a vegetable that grows under the ground, not a red or green fruit on a tree=potato 是长在地下的蔬菜，不是树上红色或绿色的水果|ap · ple|a double p, and -le at the end|双写 p，结尾是 -le
      banana|long and yellow;what monkeys peel;yellow skin to throw away|a banana is long with yellow skin; an apple is round, red or green|banana 长，皮是黄的；apple 圆，红色或绿色|apple/apples=apple is round, red or green, not long with a yellow skin you peel off=apple 圆，红色或绿色，不是要剥掉黄皮的长水果;tomato/tomatoes=tomato is soft, red and round, not long with a yellow skin=tomato 软，又红又圆，不是长长的黄皮水果|ba · na · na|three a sounds: *ba*, *na*, *na*|三个 a 音：*ba*、*na*、*na*
      potato|French fries;something under the ground;digging them up to cook|a potato grows under the ground; a tomato grows above it, red and soft|potato 长在地下；tomato 长在地上，又红又软|tomato/tomatoes=tomato is soft and red and grows above the ground, not dug up or made into fries=tomato 又红又软，长在地上，不用挖，也不做薯条;banana/bananas=banana is a long yellow fruit from a tree, not dug up or made into fries=banana 是树上的长黄色水果，不用挖，也不做薯条|po · ta · to|-es in *potatoes*|复数是 *potatoes*，加 -es
      tomato|red and round;red ones cut for salad;ketchup|a tomato is soft and red; a potato grows under the ground|tomato 软而红；potato 长在地下|potato/potatoes=potato grows under the ground and is brown, not soft, red and used for ketchup=potato 长在地下，是棕色的，不软不红，也不做番茄酱;banana/bananas=banana is long and yellow, not red and round or used for ketchup=banana 又长又黄，不红不圆，也不做番茄酱|to · ma · to|-es in *tomatoes*|复数是 *tomatoes*，加 -es
    `,
  },
});

const drinks = vocabularyTopic({
  id: "a1-words-drinks",
  title: t("Drinks", "饮料"),
  summary: t("Water, milk, juice, tea and coffee, in cups, glasses and bottles.", "水、牛奶、果汁、茶和咖啡，以及杯子和瓶子。"),
  intro: t(
    "I'm **thirsty** after football, so I **drink** a big **glass** of **water**. These words help you ask for drinks and say what you need.",
    "踢完足球我很 **thirsty**（渴），所以 **drink**（喝）了一大 **glass**（杯）**water**（水）。这些词帮你要饮料，说出自己需要什么。",
  ),
  prerequisites: ["a1-words-food"],
  words: [
    word(
      "water",
      "the clear drink that falls as rain",
      "水",
      "Fish live in {water}. | I'm thirsty. Can I have some cold {water}? No milk or juice, please. | We wash our hands with {water}.",
      "milk juice",
    ),
    word(
      "milk",
      "the white drink that comes from cows",
      "牛奶",
      "Cows give us {milk}. | Babies drink {milk} from their mothers. | I put {milk} in my tea. It makes it white.",
      "juice water",
    ),
    word(
      "juice juices",
      "a drink made from fruit",
      "果汁",
      "Orange {juice} is made from oranges. | Do you want apple {juice}? It's made from fresh apples. | This orange {juice} is very sweet.",
      "milk tea",
    ),
    word(
      "tea teas",
      "a hot drink made from leaves and hot water",
      "茶",
      "My grandpa drinks green {tea} every morning. | Would you like a cup of {tea}? I make it with hot water and leaves. | In China, people grow {tea} leaves on hills.",
      "coffee juice",
    ),
    word(
      "coffee coffees",
      "a hot brown drink; many adults drink it in the morning",
      "咖啡",
      "My mom drinks a cup of strong black {coffee} every morning. | {Coffee} is brown and hot. | Children don't usually drink {coffee}.",
      "juice milk",
    ),
    word(
      "cup cups",
      "a small round thing with a handle, for hot drinks",
      "杯子（带把手的）",
      "A {cup} of hot tea, please. | The {cup} has a handle. | Hold the {cup} by its handle. The tea is hot.",
      "glass bottle",
    ),
    word(
      "glass glasses",
      "a clear thing for cold drinks; also what windows are made of",
      "玻璃杯；玻璃",
      "I can see the cold juice through the {glass}. | Windows are made of {glass}. | Pour the cold milk into a clear {glass}.",
      "cup plate",
    ),
    word(
      "bottle bottles",
      "a tall thing with a small top, for water or juice",
      "瓶子",
      "I take a {bottle} of water to school. | Put the top back on the {bottle}. | We need two big {bottles} of milk from the shop.|cups glasses",
      "cup glass",
    ),
    word(
      "drink drinks drank drunk drinking",
      "to take water, milk or juice into your mouth; something you drink",
      "喝；饮料",
      "I {drink} milk every morning. | What would you like to {drink}? — Juice, please. | The cat is {drinking} water.|eating cooking",
      "eat cook",
    ),
    word(
      "hungry hungrier hungriest",
      "wanting to eat",
      "饿的",
      "I'm {hungry}. Can I have a sandwich? | The baby is {hungry}. Give her some food. | After school I'm always {hungry}, so I eat an apple.",
      "thirsty tired",
    ),
    word(
      "thirsty thirstier thirstiest",
      "wanting to drink",
      "渴的",
      "I'm {thirsty}. Can I have some water? | It's hot, and the dog is {thirsty}. Give it some water. | After football, we are always {thirsty}, so we drink a lot.",
      "hungry tired",
    ),
    word(
      "cake cakes",
      "a sweet food you bake, often for a birthday",
      "蛋糕",
      "We have a birthday {cake} with ten candles. | A piece of chocolate {cake}, please. | Mom makes {cakes} on Sundays.|cups bottles",
      "cup bottle",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "A *cup* has a handle for hot drinks, a *glass* is clear for cold drinks, and a *bottle* is tall with a small top. Look at the drink and its heat to pick the right one.",
        "*cup* 有把手，装热饮；*glass* 透明，装冷饮；*bottle* 高高的，口很小。看饮料是什么、冷还是热，再选。",
      ),
      meaning: t(
        "*Hungry* is wanting to eat, *thirsty* is wanting to drink. *Milk* comes from cows, *juice* from fruit, and *tea* from leaves.",
        "*hungry* 是想吃东西，*thirsty* 是想喝水。*milk* 来自奶牛，*juice* 来自水果，*tea* 来自茶叶。",
      ),
      spell: t(
        "*Coffee* doubles both f and e; *bottle* doubles t; *juice* has ui said like *oo*, and *thirsty* has ir said like *er*.",
        "*coffee* 的 f 和 e 都双写；*bottle* 双写 t；*juice* 的 ui 读作 *oo*；*thirsty* 的 ir 读作 *er*。",
      ),
    },
    notes: `
      water|where fish live;something cold that is not milk or juice;washing hands|water is clear and falls as rain; milk is white and comes from cows|water 透明，从天上落下；milk 是白色的，来自奶牛|milk=milk is a white drink from cows, not where fish live, what you wash with, or the drink that is not milk=milk 是奶牛产的白色饮料，鱼不住在里面，不用来洗手，也不是“不要牛奶”时的选择;juice=juice is a sweet drink from fruit, not where fish live, what you wash with, or the drink that is not juice=juice 是水果做的甜饮料，鱼不住在里面，不用来洗手，也不是“不要果汁”时的选择|wa · ter|a said like the o in *hot*, and -ter at the end|a 读作 *hot* 里的 o，结尾是 -ter
      milk|what cows give;what babies get from their mothers;something that makes tea white|milk is white and comes from cows; juice is made from fruit|milk 是白色的，来自奶牛；juice 是水果做的|juice=juice is made from fruit, not given by cows or mothers, and it does not make tea white=juice 是水果做的，不是奶牛或妈妈给的，也不会让茶变白;water=water is clear, so it does not come from cows or mothers, and it cannot make tea white=water 是透明的，不来自奶牛或妈妈，也不会让茶变白|milk|lk at the end, with the l said|结尾是 lk，l 要发音
      juice|made from oranges;made from fresh apples;sweet and orange|juice is made from fruit; milk comes from cows|juice 是水果做的；milk 来自奶牛|milk=milk comes from cows, not from oranges or apples=milk 来自奶牛，不是橙子或苹果做的;tea=tea is made from leaves and hot water, not from oranges or apples=tea 是茶叶和热水泡的，不是橙子或苹果做的|juice|ui said like *oo*, and c said like s|ui 读作 *oo*，c 读作 s
      tea|green every morning;leaves in hot water;leaves grown on hills|tea is made from leaves; coffee is made from brown beans|tea 用茶叶泡；coffee 用咖啡豆做|coffee=coffee is made from brown beans, not from green leaves=coffee 是用棕色咖啡豆做的，不是绿色的叶子;juice=juice is made from fruit, not from leaves and hot water=juice 是水果做的，不是茶叶和热水泡的|tea|ea said like *eat*, the same sound as the letter T|ea 读作 *eat*，和字母 T 同音
      coffee|strong and black every morning;brown and hot;something children don't usually drink|coffee is hot and brown; juice is cold and made from fruit|coffee 热而呈棕色；juice 冷，是水果做的|juice=juice is a sweet fruit drink that children often drink, not black, brown or hot=juice 是孩子常喝的甜果汁，不是黑色、棕色或热的;milk=milk is white and children often drink it, not black or brown=milk 是白色的，孩子常喝，不是黑色或棕色的|cof · fee|a double f and a double e|双写 f，双写 e
      cup|hot tea;a handle;holding it by the handle|a cup has a handle, for hot drinks; a glass is clear, for cold drinks|cup 有把手，装热饮；glass 透明，装冷饮|glass=glass is clear, for cold drinks, and it has no handle=glass 透明，装冷饮，没有把手;bottle=bottle is tall with a small top, for cold drinks, and it has no handle=bottle 高，口小，装冷饮，没有把手|cup|a short u, as in *up*|短元音 u，和 *up* 一样
      glass|juice you can see through;windows;a clear one for cold milk|a glass is clear, for cold drinks; a cup has a handle, for hot drinks|glass 透明，装冷饮；cup 有把手，装热饮|cup=cup is for hot drinks and you cannot see through it, and windows are not made of it=cup 装热饮，看不透，窗户也不是用它做的;plate=plate is flat for food, so you cannot pour milk into it or see juice through it=plate 是平的，装食物，不能倒牛奶，也看不到里面的果汁|glass|a double s at the end, and -es in *glasses*|结尾双写 s，复数是 *glasses*
      bottle|water for school;the top put back on;milk from the shop|a bottle is tall with a small top; a cup is small with a handle|bottle 高，口小；cup 小，有把手|cup/cups=cup is small with a handle, for hot drinks, with no top to put back=cup 小，有把手，装热饮，没有盖子;glass/glasses=glass is open at the top, with no top to put back, and you do not carry it to school or buy milk in it=glass 上面开口，没有盖子，不会带去学校，也不用它买牛奶|bot · tle|a double t, and -le at the end|双写 t，结尾是 -le
      drink|milk every morning;juice;water for the cat|you drink milk or water; you eat food|drink 是喝；eat 是吃|eat/eating=eat is for food, like bread, not for milk, juice or water=eat 用于吃食物，比如面包，不用于牛奶、果汁或水;cook/cooking=cook means to make food hot and ready, not to take a drink into your mouth=cook 是做饭，不是喝|drink|nk at the end, and the past *drank*|结尾是 nk，过去式是 *drank*
      hungry|wanting a sandwich;a baby who needs food;wanting an apple after school|hungry means wanting to eat; thirsty means wanting to drink|hungry 是饿；thirsty 是渴|thirsty=thirsty means wanting to drink, but here the person wants to eat=thirsty 是渴，可这里是想吃东西;tired=tired means needing sleep, not wanting food=tired 是需要睡觉，不是想吃东西|hun · gry|-gry at the end, so not *hungery*|结尾是 -gry，不是 *hungery*
      thirsty|wanting water;a hot dog who needs water;drinking a lot after football|thirsty means wanting to drink; hungry means wanting to eat|thirsty 是渴；hungry 是饿|hungry=hungry means wanting to eat, but here the person or the dog wants water=hungry 是饿，可这里是人或狗想喝水;tired=tired means needing sleep, not wanting water=tired 是需要睡觉，不是想喝水|thirst · y|ir said like *er*, and th at the start|ir 读作 *er*，开头是 th
      cake|a birthday with ten candles;chocolate;something Mom makes on Sundays|a cake is a sweet food you bake; a cup is something you drink from|cake 是烤的甜食；cup 是喝水的杯子|cup/cups=cup is something you drink from, not a sweet food with candles or chocolate=cup 是喝东西的杯子，不是插蜡烛或巧克力的甜食;bottle/bottles=bottle holds a drink, not a sweet food you bake=bottle 装饮料，不是烤的甜食|cake|a silent e that makes the a say its name|词尾 e 不发音，让 a 读字母本音
    `,
  },
});

const meals = vocabularyTopic({
  id: "a1-words-meals",
  title: t("Meals", "餐食"),
  summary: t(
    "Some, any, much and a lot; bowls, plates, spoons, forks and knives; the kitchen.",
    "some、any、much、a lot；碗、盘子、勺子、叉子和刀；厨房。",
  ),
  intro: t(
    "Dad **cooks** noodles in the **kitchen**. I put a **bowl** and a **spoon** for each of us on the **table**. These words help you lay the table and say how much food there is.",
    "爸爸在 **kitchen**（厨房）里 **cooks**（煮）面条。我在 **table**（桌子）上给每人放一个 **bowl**（碗）和一把 **spoon**（勺子）。这些词帮你摆餐桌，说出食物有多少。",
  ),
  prerequisites: ["a1-words-drinks"],
  words: [
    word(
      "some",
      "a number or an amount of something, not saying how much",
      "一些",
      "Can I have {some} water, please? | There are {some} apples on the table. | I'd like {some} rice, please.",
      "any much",
    ),
    word(
      "any",
      "used in questions and negatives for an amount or a number",
      "任何；一些（用于疑问句和否定句）",
      "There isn't {any} milk. The bottle is empty. | There aren't {any} eggs. | No, I don't have {any} bread. There's none.",
      "some much",
    ),
    word(
      "much",
      "a large amount of something; used with things you don't count",
      "很多（修饰不可数名词）",
      "I don't drink {much} coffee. Only one cup a week. | How {much} is this cake? — Two dollars. | There isn't {much} rice, just one small bowl. Let's buy some.",
      "many any",
      "some",
    ),
    word(
      "lot lots",
      "with *a*: many or much",
      "（a lot）许多",
      "There are a {lot} of people here. | I eat a {lot} of fruit. | Thanks a {lot}!",
      "much many",
    ),
    word(
      "bowl bowls",
      "a deep round dish for soup or rice",
      "碗",
      "I eat a {bowl} of noodle soup with a spoon and chopsticks. | Put the soup in a deep {bowl}, not on a flat plate. | We need four deep {bowls} for the noodle soup.|plates cups",
      "plate cup",
    ),
    word(
      "plate plates",
      "a flat round dish you put food on",
      "盘子",
      "Put the cake on a {plate}. | There is nothing on my {plate}. Can I have some more? | Put the fish on the {plates}, and the soup in the bowls.|bowls spoons",
      "bowl spoon",
    ),
    word(
      "spoon spoons",
      "a small thing with a round end, for soup",
      "勺子",
      "I eat soup with a {spoon}. | Put a {spoon} of sugar in my tea. | We need {spoons} for the ice cream.|knives forks",
      "knife fork",
    ),
    word(
      "fork forks",
      "a thing with three or four points, for eating",
      "叉子",
      "Cut the meat with a knife and hold it with a {fork}. | My {fork} has four sharp points. | I pick up my salad with the points of my {fork}.",
      "spoon bowl",
    ),
    word(
      "knife knives",
      "a sharp thing for cutting",
      "刀",
      "Cut the bread with a {knife}. | Be careful! The {knife} is sharp. It can cut you. | Put the forks and {knives} on the table, so we can cut our meat.|forks spoons",
      "fork spoon",
    ),
    word(
      "table tables",
      "a piece of furniture with a flat top and legs",
      "桌子",
      "Dinner is on the {table}. Come and eat! | We sit at the {table} to eat. | Put the plates on the {table}, please.",
      "kitchen chair",
    ),
    word(
      "cook cooks cooked cooking",
      "to make food hot and ready to eat",
      "烹饪；做饭",
      "My dad {cooks} dinner for us every evening.|eats drinks | Can you {cook}? — Yes, I can make noodles. | Mom is {cooking} soup in a big pot.|eating drinking",
      "eat drink",
    ),
    word(
      "kitchen kitchens",
      "the room where you cook",
      "厨房",
      "Mom is cooking in the {kitchen}. | The fridge is in the {kitchen}. | We eat breakfast in the {kitchen}.",
      "chicken table",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Some* is for yes sentences and asking for things; *any* is for *not* and empty places. *Much* goes with things you don't count, like rice, but *a lot of* goes with everything.",
        "*some* 用于肯定句和请求；*any* 用于带 *not* 或什么都没有的句子。*much* 跟 rice 这样不可数的东西，*a lot of* 什么都能跟。",
      ),
      meaning: t(
        "A *bowl* is deep for soup and rice, a *plate* is flat for food, a *spoon* has a round end, a *fork* has points and a *knife* cuts.",
        "*bowl* 深，盛汤和米饭；*plate* 平，放食物；*spoon* 头是圆的；*fork* 有尖齿；*knife* 用来切。",
      ),
      spell: t(
        "*Knife* has a silent k and becomes *knives*. *Kitchen* has tch in the middle; do not mix it up with *chicken*.",
        "*knife* 的 k 不发音，复数是 *knives*。*kitchen* 中间是 tch，别和 *chicken* 弄混。",
      ),
    },
    notes: `
      some|asking for water;apples on the table;asking for rice|some is for yes sentences and asking for things; any is for not and questions|some 用于肯定句和请求；any 用于否定句和疑问句|any=any goes with *not* or a question, not with a yes sentence or a polite request like *Can I have* or *I'd like*=any 用于否定句或疑问句，不用于肯定句，也不用于 *Can I have*、*I'd like* 这样的礼貌请求;much=much goes with things you don't count and mostly with *not*, not with *apples* or a polite request=much 跟不可数名词，多用于否定句，不跟 *apples*，也不用于礼貌请求|some|o said like the u in *up*, and a silent e|o 读作 *up* 里的 u，词尾 e 不发音
      any|an empty milk bottle;no eggs;no bread at all|any is for none in not sentences; some is for yes sentences|any 用于否定句表示一点也没有；some 用于肯定句|some=some is for yes sentences, not after *isn't*, *aren't* or *don't*=some 用于肯定句，不放在 *isn't*、*aren't* 或 *don't* 后面;much=much means a large amount, but here there is none at all, and it does not go with *eggs*=much 是很多，可这里一点也没有，而且不跟 *eggs*|an · y|a said like the e in *any* and *many*, not like *an*|a 读作 *many* 里的 e，不像 *an*
      much|one cup of coffee a week;the cost of a cake;one small bowl of rice|much goes with things you don't count; many goes with things you count|much 跟不可数名词；many 跟可数名词|many=many goes with things you count, like *many cups*, not with coffee, rice or a price=many 跟可数名词，比如 *many cups*，不跟 coffee、rice 或价钱;any=any means even a little, but here there is some, and nobody asks *how any*=any 是哪怕一点，可这里还有一些，也没有 *how any* 的说法|much|ch at the end, and u said like *up*|结尾是 ch，u 读作 *up* 里的 u
      lot|many people;much fruit;big thanks|a lot goes with things you count and don't count; much goes only with things you don't count|a lot 可数不可数都能跟；much 只跟不可数|much=much never comes after *a* in *a ... of* or *thanks a ...*=much 不放在 *a ... of* 或 *thanks a ...* 的 *a* 后面;many=many goes straight before a plural noun and never follows *a* in *a ... of* or *thanks a ...*=many 直接放在复数名词前，从不跟在 *a ... of* 或 *thanks a ...* 的 *a* 后面|lot|a short o, and *a lot* is two words|短元音 o，*a lot* 是两个词
      bowl|noodle soup with a spoon;soup that needs a deep dish;four for noodle soup|a bowl is deep for soup; a plate is flat|bowl 深，盛汤；plate 是平的|plate/plates=plate is flat, so soup runs off it=plate 是平的，汤会流出来;cup/cups=cup has a handle for drinks, not a deep dish to eat noodle soup from with chopsticks=cup 有把手，装饮料，不是用筷子吃汤面的深碗|bowl|ow said like *go*, so it sounds like *bowl*, not *owl*|ow 读作 *go* 里的音，不像 *owl*
      plate|cake on it;nothing on it;fish on it|a plate is flat and food sits on it; a bowl is deep and holds soup|plate 是平的，放食物；bowl 深，盛汤|bowl/bowls=bowl is deep, so food goes in it, not on it, and the soup is in the bowls here=bowl 深，食物放在里面而不是上面，这里汤已经在碗里了;spoon/spoons=spoon is for eating soup, not a dish to put food on=spoon 是喝汤用的，不是放食物的盘子|plate|a silent e that makes the a say its name|词尾 e 不发音，让 a 读字母本音
      spoon|eating soup;sugar in tea;ice cream|a spoon has a round end for soup; a knife is sharp for cutting|spoon 头是圆的，用来喝汤；knife 锋利，用来切|knife/knives=knife is sharp for cutting, not for soup, sugar or ice cream=knife 锋利，用来切东西，不用来喝汤、舀糖或吃冰淇淋;fork/forks=fork has points, so soup, sugar and ice cream fall through it=fork 有尖齿，汤、糖和冰淇淋会漏下去|spoon|a double o, said like *moon*|双写 o，读作 *moon* 里的音
      fork|holding meat while cutting;four sharp points;picking up salad|a fork has points; a spoon has a round end|fork 有尖齿；spoon 头是圆的|spoon=spoon has a round end with no points, so it cannot hold meat still or pick salad up on points=spoon 头是圆的，没有尖齿，不能固定肉，也不能用尖齿叉沙拉;bowl=bowl is a deep dish, not something you hold in your hand to eat with=bowl 是深碗，不是拿在手里吃东西的工具|fork|or said like *for*|or 读作 *for*
      knife|cutting bread;something sharp;cutting meat|a knife is sharp for cutting; a fork has points for holding food|knife 锋利，用来切；fork 有尖齿，用来叉住食物|fork/forks=fork holds food on its points, but it does not cut bread or cut you=fork 用尖齿叉住食物，不能切面包，也不会割伤人;spoon/spoons=spoon has a round end for soup, not a sharp edge for cutting=spoon 头是圆的，喝汤用，没有锋利的刃|knife|a silent k at the start, and f changing to v in *knives*|开头的 k 不发音，复数 *knives* 里 f 变 v
      table|dinner on it;sitting at it to eat;plates on it|a table has a flat top for food; a chair is for sitting on|table 有平面，放食物；chair 是坐的|kitchen=kitchen is a room, so food is *in* it, not *on* it, and you don't sit *at* it=kitchen 是房间，食物在里面而不是上面，也不说 *sit at the kitchen*;chair=chair is for sitting on, not for putting dinner or plates on=chair 是坐的，不放晚饭或盘子|ta · ble|-ble at the end, so not *tabel*|结尾是 -ble，不是 *tabel*
      cook|dinner for us;making noodles;soup in a big pot|you cook food to make it ready; you eat it when it is ready|cook 是做饭；eat 是吃|eat/eats/eating=eat means to put food in your mouth, not to make it ready for others or in a pot=eat 是吃，不是给别人做饭，也不是在锅里做;drink/drinks/drinking=drink is for water or milk, not for making dinner, noodles or soup ready=drink 是喝水或牛奶，不是做晚饭、面条或汤|cook|a double o, said like *book*|双写 o，读作 *book* 里的音
      kitchen|where Mom cooks;where the fridge is;where we eat breakfast|a kitchen is the room for cooking; a chicken is a farm bird|kitchen 是做饭的房间；chicken 是农场的鸡|chicken=chicken is a farm bird or its meat, not a room you cook in or keep a fridge in=chicken 是鸡或鸡肉，不是做饭、放冰箱的房间;table=table is furniture, so the fridge and the cooking are not *in* it=table 是家具，冰箱和做饭都不在它“里面”|kitch · en|tch in the middle, so not *kichen*|中间是 tch，不是 *kichen*
    `,
  },
});

const favoriteFoods = vocabularyTopic({
  id: "a1-words-favorite-foods",
  title: t("Favorite Foods", "喜欢的食物"),
  summary: t("Sandwiches, pizza, noodles, dumplings, soup, ice cream and more.", "三明治、披萨、面条、饺子、汤、冰淇淋等。"),
  intro: t(
    "On Sunday we eat **dumplings** and **noodles**, and then ice **cream** with lots of **sugar**. These words help you talk about the food you love.",
    "星期天我们吃 **dumplings**（饺子）和 **noodles**（面条），然后吃加了很多 **sugar**（糖）的冰 **cream**（淇淋）。这些词帮你说出你爱吃的东西。",
  ),
  prerequisites: ["a1-words-meals"],
  words: [
    word(
      "sandwich sandwiches",
      "two pieces of bread with food between them",
      "三明治",
      "I take a {sandwich} of bread and cheese to school. | Put the chicken between two pieces of bread to make a {sandwich}. | Mom makes egg {sandwiches} with bread for our picnic.|soups salads",
      "soup salad",
    ),
    word(
      "pizza pizzas",
      "a flat round bread with tomato and cheese on top",
      "披萨",
      "Pizza comes from Italy. We love {pizza}! | Let's cut the {pizza} into eight pieces. | A {pizza} is flat and round.",
      "soup salad",
    ),
    word(
      "noodle noodles",
      "a long thin food, cooked in water or soup",
      "面条",
      "I eat {noodles} with chopsticks.|sandwiches soups | Chinese {noodles} are long and thin.|sandwiches soups | We have beef {noodle} soup for lunch.",
      "sandwich soup",
    ),
    word(
      "dumpling dumplings",
      "a small piece of dough with meat or vegetables inside",
      "饺子",
      "In China, families make {dumplings} for the New Year.|cookies pizzas | Each {dumpling} has meat and vegetables inside. | We cook the {dumplings} in hot water.|cookies pizzas",
      "cookie pizza",
    ),
    word(
      "soup soups",
      "a hot food that is mostly water, eaten with a spoon",
      "汤",
      "I eat {soup} with a spoon. | This tomato {soup} is too hot. | When I'm sick, Mom makes hot chicken {soup}, and I eat it with a spoon.",
      "salad sandwich",
    ),
    word(
      "salad salads",
      "cold vegetables, mixed and eaten raw",
      "沙拉",
      "A {salad} is good for you. It's all vegetables! | We put cold tomatoes in the {salad}. | I'd like a fruit {salad}, please.",
      "soup sandwich",
    ),
    word(
      "ice",
      "frozen water",
      "冰",
      "Water turns into {ice} when it is very cold. | Put some {ice} in my juice to make it cold. | Be careful! There is {ice} on the road, so you may fall.",
      "salt sugar",
    ),
    word(
      "cream creams",
      "the thick part of milk; with *ice*, a cold sweet food",
      "奶油；（ice cream）冰淇淋",
      "Ice {cream} is cold and sweet. | I'd like a cake with {cream} on top. | Strawberry ice {cream} is my favorite.",
      "soup salt",
    ),
    word(
      "candy candies",
      "a small sweet food made of sugar",
      "糖果",
      "Don't eat too much {candy}. It's bad for your teeth. | The children get {candies} at the party.|salts soups | This {candy} is very sweet.",
      "salt soup",
    ),
    word(
      "cookie cookies",
      "a small flat sweet cake",
      "饼干；曲奇",
      "Grandma bakes {cookies} for us.|soups salads | Can I have a chocolate {cookie}? | There are six {cookies} in the box.|soups salads",
      "soup salad",
    ),
    word(
      "sugar sugars",
      "a sweet white powder you put in food and drinks",
      "糖",
      "I put {sugar} in my tea to make it sweet. | Candy has a lot of {sugar}. | Cakes are sweet because they have {sugar} in them.",
      "salt ice",
    ),
    word(
      "salt salts",
      "a white powder that makes food taste better; the sea has it",
      "盐",
      "Sea water has {salt} in it. | Put a little {salt} on your eggs. | Potato chips are not sweet: they have a lot of {salt}.",
      "sugar candy",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Salt* and *sugar* are both white powders, so check the taste: *sweet* points to *sugar*, and the sea or chips point to *salt*. *Soup* is hot and eaten with a spoon; a *salad* is cold.",
        "*salt* 和 *sugar* 都是白色粉末，要看味道：*sweet*（甜）指向 *sugar*，大海或薯片指向 *salt*。*soup* 是热的，用勺子喝；*salad* 是凉的。",
      ),
      meaning: t(
        "A *sandwich* is food between two pieces of bread, a *pizza* is flat and round, and a *dumpling* has meat or vegetables inside. *Ice* is frozen water, and *cream* comes from milk.",
        "*sandwich* 是两片面包夹着食物，*pizza* 又平又圆，*dumpling* 里面包着肉或菜。*ice* 是冻住的水，*cream* 来自牛奶。",
      ),
      spell: t(
        "*Pizza* doubles z, *cookie* doubles o, and *candy* changes y to -ies in *candies*. *Sandwich* ends in -wich, as in *which*.",
        "*pizza* 双写 z，*cookie* 双写 o，*candy* 的复数把 y 变成 -ies：*candies*。*sandwich* 结尾是 -wich，和 *which* 一样。",
      ),
    },
    notes: `
      sandwich|bread and cheese for school;chicken between two pieces of bread;egg ones with bread for a picnic|a sandwich is food between two pieces of bread; soup is hot and eaten with a spoon|sandwich 是两片面包夹着食物；soup 是热的，用勺子喝|soup/soups=soup is hot and mostly water, so it cannot go between two pieces of bread=soup 是热的，大部分是水，不能夹在两片面包中间;salad/salads=salad is cold mixed vegetables in a bowl, not food between two pieces of bread=salad 是碗里拌好的凉菜，不是夹在两片面包里的食物|sand · wich|-wich at the end, as in *which*|结尾是 -wich，和 *which* 一样
      pizza|a food from Italy;something cut into eight pieces;flat and round|a pizza is flat and round with cheese on top; soup is hot and mostly water|pizza 又平又圆，上面有奶酪；soup 是热的，大部分是水|soup=soup is mostly water in a bowl, so it does not come from Italy as one flat round food or get cut into pieces=soup 是碗里大部分是水的东西，不是来自意大利、又平又圆、能切成块的食物;salad=salad is cold mixed vegetables, not flat and round or cut into eight pieces=salad 是拌好的凉菜，不是又平又圆、能切成八块的东西|piz · za|a double z, said like *ts*|双写 z，读作 *ts*
      noodle|eaten with chopsticks;long and thin;beef soup|noodles are long and thin; a sandwich is bread with food between it|noodles 又细又长；sandwich 是面包夹着食物|sandwich/sandwiches=sandwich is food between two pieces of bread, not long, thin or eaten with chopsticks in soup=sandwich 是面包夹着食物，不是又细又长、用筷子在汤里吃的东西;soup/soups=soup is the hot water part itself, so *soup soup* makes no sense, and it is not long and thin=soup 本身就是汤，没有 *soup soup* 的说法，也不是又细又长的|noo · dle|a double o, and -dle at the end|双写 o，结尾是 -dle
      dumpling|New Year in China;meat and vegetables inside;cooked in hot water|a dumpling has meat or vegetables inside; a cookie is a small sweet cake|dumpling 里面包着肉或菜；cookie 是小甜饼|cookie/cookies=cookie is a small sweet cake you bake, with no meat or vegetables inside and not cooked in water=cookie 是烤的小甜饼，里面没有肉或菜，也不放水里煮;pizza/pizzas=pizza has cheese on top, not meat inside, and it is baked, not cooked in hot water=pizza 是奶酪铺在上面，不是包着肉，是烤的，不用热水煮|dump · ling|mp in the middle, and -ling at the end|中间是 mp，结尾是 -ling
      soup|eating with a spoon;tomato and too hot;hot chicken for a sick child|soup is hot and eaten with a spoon; a salad is cold|soup 是热的，用勺子喝；salad 是凉的|salad=salad is cold, mixed vegetables, not hot or eaten with a spoon=salad 是凉拌菜，不是热的，也不用勺子吃;sandwich=sandwich is bread with food between it, not hot and eaten with a spoon=sandwich 是面包夹着食物，不是热的、用勺子喝的|soup|ou said like *oo*, so not *sop*|ou 读作 *oo*，不是 *sop*
      salad|all vegetables;cold tomatoes in it;fruit mixed together|a salad is cold, mixed and raw; soup is hot and mostly water|salad 是凉的，生拌；soup 是热的，大部分是水|soup=soup is hot and mostly water, not cold, raw and mixed=soup 是热的，大部分是水，不是生拌的凉菜;sandwich=sandwich is bread with food between it, not a bowl of mixed vegetables or fruit=sandwich 是面包夹着食物，不是一碗拌好的蔬菜或水果|sal · ad|-ad at the end, so not *salat*|结尾是 -ad，不是 *salat*
      ice|very cold water;something to make juice cold;something on the road that makes you fall|ice is frozen water; salt is a white powder that makes food taste better|ice 是冻住的水；salt 是让食物更有味道的白色粉末|salt=salt is a powder that makes food taste of salt, not frozen water or something that makes juice cold=salt 是让食物有咸味的粉末，不是冻住的水，也不会让果汁变凉;sugar=sugar is a sweet powder, not frozen water or something that makes juice cold=sugar 是甜的粉末，不是冻住的水，也不会让果汁变凉|ice|c said like s, and a silent e|c 读作 s，词尾 e 不发音
      cream|ice cream;something thick on a cake;strawberry ice cream|cream is the thick part of milk; soup is hot and mostly water|cream 是牛奶里浓稠的部分；soup 是热的，大部分是水|soup=soup is hot and mostly water, not cold and sweet or thick on a cake=soup 是热的，大部分是水，不是又冷又甜的，也不铺在蛋糕上;salt=salt is a white powder that tastes of the sea, not sweet or thick on a cake=salt 是有咸味的白色粉末，不甜，也不铺在蛋糕上|cream|ea said like *eat*|ea 读作 *eat* 里的音
      candy|bad for teeth;something children get at a party;very sweet|candy is a small sweet made of sugar; salt is not sweet|candy 是糖做的小甜食；salt 不甜|salt/salts=salt is not sweet, and children do not get it at a party=salt 不甜，孩子们在派对上也不会拿到盐;soup/soups=soup is a hot meal eaten with a spoon, not a small sweet thing=soup 是用勺子喝的热汤，不是小小的甜食|can · dy|y changing to -ies in *candies*|复数 *candies* 里 y 变成 -ies
      cookie|baked by grandma;chocolate;six in a box|a cookie is a small sweet cake you bake; soup is hot and eaten with a spoon|cookie 是烤的小甜饼；soup 是用勺子喝的热汤|soup/soups=soup is hot and mostly water, not baked, kept in a box or made with chocolate as a small cake=soup 是热的，大部分是水，不是烤出来、装在盒子里的小巧克力甜饼;salad/salads=salad is cold mixed vegetables, not a small sweet cake=salad 是凉拌菜，不是小甜饼|cook · ie|a double o, and -ie at the end|双写 o，结尾是 -ie
      sugar|something that makes tea sweet;what candy has a lot of;what makes cakes sweet|sugar is sweet; salt is not sweet|sugar 是甜的；salt 不甜|salt=salt makes food taste of the sea, not sweet=salt 让食物有咸味，不会变甜;ice=ice is frozen water, and it does not make tea, candy or cakes sweet=ice 是冻住的水，不会让茶、糖果或蛋糕变甜|su · gar|s said like *sh*, so not *shugar*|s 读作 *sh*，不是 *shugar*
      salt|what sea water has;something for eggs;what chips have a lot of|salt is not sweet; sugar is sweet|salt 不甜；sugar 是甜的|sugar=sugar is sweet, but sea water, eggs and chips are not sweet=sugar 是甜的，可海水、鸡蛋和薯片都不甜;candy=candy is a small sweet thing to eat, not something in sea water or on eggs=candy 是小小的甜食，不在海水里，也不撒在鸡蛋上|salt|-alt at the end, as in *all* with t|结尾是 -alt，像 *all* 加 t
    `,
  },
});

// Countable and uncountable nouns.

/** uncountables are food words that take no a and no -s. */
const uncountables: readonly string[] = ["rice", "bread", "meat", "sugar", "salt", "milk", "soup", "water", "juice"];

/** moreUncountables are uncountables used only in the choice. */
const moreUncountables: readonly string[] = ["coffee"];

/** countables are food words with a plural, and the plural a learner may write instead. */
const countables: readonly (readonly [one: string, many: string, misspelled: string])[] = [
  ["apple", "apples", "apple"],
  ["banana", "bananas", "banana"],
  ["egg", "eggs", "egg"],
  ["potato", "potatoes", "potatos"],
  ["tomato", "tomatoes", "tomatos"],
  ["cookie", "cookies", "cookie"],
  ["sandwich", "sandwiches", "sandwichs"],
  ["dumpling", "dumplings", "dumpling"],
];

/** someFrames take a plural or an uncountable noun. */
const someFrames: readonly string[] = [
  "Can I have some ___, please?",
  "We need some ___ for dinner.",
  "Do you like ___?",
  "I'm buying some ___ today.",
  "We have some ___ at home.",
];

const article = (noun: string) => (/^[aeiou]/u.test(noun) ? `an ${noun}` : `a ${noun}`);

/** countNouns are the nouns of the choice, uncountables and countables in turn. */
const countNouns: readonly (readonly [noun: string, right: string, wrong: readonly string[]])[] = interleave([
  [...uncountables, ...moreUncountables].map((u) => [u, u, [`${u}s`, article(u)]] as const),
  [
    ...countables.map(([one, many]) => [one, many, [one, article(one)]] as const),
    ["noodle", "noodles", ["noodle", "a noodle"]] as const,
    ["vegetable", "vegetables", ["vegetable", "a vegetable"]] as const,
    ["candy", "candies", ["candy", "candys"]] as const,
  ],
]);

const countChoiceBank: readonly ChoiceItem[] = everyPair(countNouns, someFrames).map(
  ([[noun, right, wrong], frame]): ChoiceItem => [`${frame} (${noun})`, right, wrong],
);

/** uncountFixFrames are sentences with an uncountable noun, each with the mistake a learner makes in it. */
const uncountFixFrames: readonly (readonly [right: string, mistake: "s" | "a"])[] = [
  ["We eat ___ every day.", "s"],
  ["Can I have (some )___, please?", "a"],
  ["There is a lot of ___ in the kitchen.", "s"],
  ["I need (some )___ for dinner.", "a"],
  ["Mom buys ___ at the market.", "s"],
  ["We have (some )___ at home.", "a"],
  ["There isn't much ___ here.", "s"],
];

const plain = (pattern: string) => pattern.replace("(some )", "some ");

const countFixBank: readonly TypedItem[] = interleave([
  everyPair(uncountables, uncountFixFrames).map(([u, [pattern, mistake]]): TypedItem => {
    const wrongNoun = mistake === "s" ? `${u}s` : article(u);
    const shown = pattern.replace("(some )", "").replace("___", wrongNoun);
    return {
      shown,
      accepted: [pattern.replace("___", u)],
      canonical: plain(pattern).replace("___", u),
      wrong: [...new Set([shown, plain(pattern).replace("___", `${u}s`)])],
    };
  }),
  everyPair(countables, [
    "I eat two ___ every morning.",
    "There are three ___ on the plate.",
    "Mom buys five ___ at the market.",
    "I can see six ___ in the box.",
    "We have ten ___ at home.",
  ]).map(
    ([[one, many, misspelled], frame]): TypedItem => ({
      shown: frame.replace("___", one),
      accepted: [frame.replace("___", many)],
      wrong: [...new Set([frame.replace("___", one), frame.replace("___", misspelled)])],
    }),
  ),
]);

/** countReason says why a noun takes a plural or stays as it is. */
const countReason = (noun: string, right: string): Text =>
  right === noun
    ? t(`*${noun}* is a noun you do not count, so it takes no *-s* and no *a*`, `*${noun}* 是不可数名词，不加 *-s*，也不用 *a*`)
    : t(
        `*${noun}* is a noun you count, and here it means more than one, so it takes the plural *${right}*`,
        `*${noun}* 是可数名词，这里指不止一个，所以用复数 *${right}*`,
      );

/** whyNotCount says what a wrong form of a food noun shows the learner misread. */
const whyNotCount = (wrong: string, right: string, shown: string): Text => {
  const noun = shown.match(/\((.*)\)$/u)?.[1] ?? "";
  const uncountable = right === noun;
  if (/^an? /u.test(wrong))
    return uncountable
      ? t(
          `*${wrong}* puts *a* before a noun you do not count, but *a* is only for one thing you can count.`,
          `*${wrong}* 在不可数名词前用了 *a*，可 *a* 只用于一个可数的东西。`,
        )
      : t(
          `*${wrong}* is just one, but *some* and *Do you like...?* talk about more than one.`,
          `*${wrong}* 只表示一个，可 *some* 和 *Do you like...?* 说的是不止一个。`,
        );
  if (uncountable)
    return t(
      `*${wrong}* adds *-s*, but *${noun}* is a noun you do not count, so it has no plural.`,
      `*${wrong}* 加了 *-s*，可 *${noun}* 是不可数名词，没有复数。`,
    );
  if (wrong.endsWith("s"))
    return t(
      `*${wrong}* is not how this plural is spelled: after a consonant, *y* becomes *ies*.`,
      `*${wrong}* 拼错了：辅音后面的 *y* 要变成 *ies*。`,
    );
  return t(`*${wrong}* is the form for one, but here the noun means more than one.`, `*${wrong}* 是单数形式，可这里的名词指不止一个。`);
};

const countableAndUncountable: TopicDef = {
  id: "countable-and-uncountable-nouns",
  title: t("Countable and Uncountable Nouns", "可数名词与不可数名词"),
  summary: t(
    "An apple, two apples, but some rice, some water: some nouns are never counted and take no -s and no a.",
    "an apple、two apples，但说 some rice、some water：有些名词不能数，不加 -s，也不用 a。",
  ),
  intro: t(
    "Compare *some bananas* with *some water*: you can count bananas one by one, so after *some* they take *-s*, whereas *water* is a substance you do not count individually, so it never takes *-s* or *a*. In this topic, you sort countable and uncountable food nouns and fix common mistakes like *a bread* or *two cookie*.",
    "比较 *some bananas* 和 *some water*：香蕉可以一根根数，在 *some* 后面要加 *-s*；而 *water* 是不可数物质，既不加 *-s* 也不用 *a*。本主题带你区分可数与不可数食物名词，并改正 *a bread*、*two cookie* 等常见错误。",
  ),
  prerequisites: ["plural-nouns-with-s", "a1-words-food"],
  encompasses: [
    { topic: "plural-nouns-with-s", weight: 0.4 },
    { topic: "a1-words-food", weight: 0.2 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Apples, but rice", "apples，但 rice"),
      t(
        "Some nouns you can count: *an apple, two apples, some eggs*. Others you cannot: *rice, bread, meat, milk, water, juice, sugar, salt, soup*. They have no *-s* and no *a*: *some rice*, not *some rices* or *a rice*.\n\nAfter *some* and in *Do you like...?*, a noun you can count takes *-s*: *some apples*, *Do you like eggs?*\n\n> **Watch out.** Ask “Can I say *two ___s*?” before choosing: if not (like *bread*, *milk*, *rice*, *soup*), keep it bare with no *a* and no *-s*; if yes, make it plural after *some* or *Do you like…*",
        "有些名词可以数：*an apple、two apples、some eggs*。有些不能数：*rice、bread、meat、milk、water、juice、sugar、salt、soup*。它们不加 *-s*，也不用 *a*：说 *some rice*，不说 *some rices* 或 *a rice*。\n\n中文名词不分单复数，所以要记住：在 *some* 后面和 *Do you like...?* 里，可数名词要用复数：*some apples*、*Do you like eggs?*\n\n> **注意。** 选择前先问一句“能不能数两个？”：不能数（如 *bread*、*milk*、*rice*、*soup*）就保持原形、不加 *a* 也不加 *-s*；能数且跟在 *some* 或 *Do you like…* 后就用复数。",
      ),
      choiceGenerator(
        t("Choose the words for the gap.", "选出填入空白处的词。"),
        countChoiceBank,
        (right, shown) => {
          const noun = shown.match(/\((.*)\)$/u)?.[1] ?? "";
          const sentence = shown.replace(/ \(.*\)$/u, "").replace("___", `*${right}*`);
          const reason = countReason(noun, right);
          return t(
            `${reason.en}: ${sentence}\n\n**Check.** Test whether *${noun}* can be counted one by one—${right === noun ? "it cannot, so it stays bare with no *a* and no *-s*" : `it can, so after *some* or *Do you like…* it takes the plural *${right}*`}.`,
            `${reason["zh-CN"]}：${sentence}\n\n**检验。** 想想 *${noun}* 能不能一个个计数——${right === noun ? "不能数，所以保持原形，不加 *a* 也不加 *-s*" : `可以数，所以在 *some* 或 *Do you like…* 后面用复数 *${right}*`}。`,
          );
        },
        whyNotCount,
      ),
    ),
    point(
      "fix",
      t("Fixing the noun", "改正名词"),
      t(
        "Find the noun that is wrong: *rices*, *a bread* and *two apple* are all mistakes. Write the sentence right.\n\n> **Watch out.** For an uncountable noun with *a/an* (like *a bread*), replace *a/an* with *some* or drop it; for a countable noun after a number (*two*, *three*, *five*), add the right plural ending (*-s*, *-es*, or *-ies*).",
        "找出用错的名词：*rices*、*a bread* 和 *two apple* 都是错的。把句子改正。\n\n> **注意。** 不可数名词前误加了 *a/an*（如 *a bread*）时，把 *a/an* 去掉或换成 *some*；数字（*two*、*three*、*five*）后的可数名词则要补上正确的复数词尾（*-s*、*-es* 或 *-ies*）。",
      ),
      typedGenerator("sentence-pattern", t("Fix the sentence.", "改正这个句子。"), countFixBank, (right) => {
        const words = right.replace(/[.,?]/gu, "").split(" ");
        const uncountable = uncountables.find((u) => words.includes(u));
        const counted = countables.find(([, many]) => words.includes(many));
        const reason = uncountable ? countReason(uncountable, uncountable) : countReason(counted?.[0] ?? "", counted?.[1] ?? "");
        return t(
          `${reason.en}: ${right}\n\n**Check.** Verify the noun form in your fixed sentence—no *-s* or *a/an* on an uncountable noun, and the right plural spelling after a number greater than one.`,
          `${reason["zh-CN"]}：${right}\n\n**检验。** 复查改后句子里的名词形式——不可数名词不带 *-s* 或 *a/an*，大于 1 的数字后面的可数名词拼写出正确的复数。`,
        );
      }),
    ),
  ],
};

// Some and any.

const someNouns: readonly (readonly [noun: string, many: boolean])[] = [
  ["milk", false],
  ["eggs", true],
  ["juice", false],
  ["apples", true],
  ["rice", false],
  ["bananas", true],
  ["bread", false],
  ["cookies", true],
  ["water", false],
  ["spoons", true],
  ["soup", false],
  ["forks", true],
  ["plates", true],
];

const somePlaces: readonly string[] = ["in the kitchen", "on the table", "here", "at home"];

type SomeKind = "statement" | "question" | "negative";
const someKinds: readonly SomeKind[] = ["statement", "question", "negative"];

/** someAll are every noun in every kind of sentence at every place. */
const someAll = everyPair(everyPair(someNouns, someKinds), somePlaces);

const someSentence = (k: number) => {
  const [[[noun, many], kind], place] = someAll[k % someAll.length] ?? [[["milk", false], "statement"], "on the table"];
  const be = many ? "are" : "is";
  const sentence =
    kind === "statement"
      ? `There ${be} ___ ${noun} ${place}.`
      : kind === "question"
        ? `${sentenceCase(be)} there ___ ${noun} ${place}?`
        : `There ${be}n't ___ ${noun} ${place}.`;
  return { sentence, right: kind === "statement" ? "some" : "any", wrong: [kind === "statement" ? "any" : "some", "a"] };
};

const someChoiceBank: readonly ChoiceItem[] = Array.from({ length: someAll.length }, (_, k): ChoiceItem => {
  const { sentence, right, wrong } = someSentence(k);
  return [sentence, right, wrong];
});

const someTypedBank: readonly TypedItem[] = Array.from({ length: someAll.length }, (_, k): TypedItem => {
  const { sentence, right, wrong } = someSentence(k + 45);
  return { shown: sentence, accepted: [right], wrong };
});

/** changeAll are every noun at every place, to be made negative or a question in turn. */
const changeAll = everyPair(everyPair(someNouns, ["in the kitchen", "on the table", "at home", "here"]), [true, false]);

const changeBank: readonly TypedItem[] = changeAll.map(([[[noun, many], place], negative]): TypedItem => {
  const be = many ? "are" : "is";
  const statement = `There ${be} some ${noun} ${place}.`;
  if (negative) {
    return {
      shown: statement,
      accepted: [`There [${be}n't|${be} not] any ${noun} ${place}.`],
      canonical: `There ${be}n't any ${noun} ${place}.`,
      wrong: [`There ${be}n't some ${noun} ${place}.`, `There ${be} not some ${noun} ${place}.`],
      instruction: t("Make the sentence negative.", "把句子改成否定句。"),
    };
  }
  return {
    shown: statement,
    accepted: [`${sentenceCase(be)} there any ${noun} ${place}?`],
    wrong: [`${sentenceCase(be)} there some ${noun} ${place}?`, `There ${be} any ${noun} ${place}?`],
    instruction: t("Make the sentence a question.", "把句子改成疑问句。"),
  };
});

/** someReason says what kind of sentence a gap is in and which word that kind takes. */
const someReason = (shown: string): Text =>
  shown.endsWith("?")
    ? t("This is a question, and a question takes *any*", "这是疑问句，疑问句用 *any*")
    : shown.includes("n't")
      ? t("*n't* makes this sentence negative, and a negative takes *any*", "*n't* 使这个句子成为否定句，否定句用 *any*")
      : t("This is a statement that says something is there, so it takes *some*", "这是说明某物存在的肯定句，所以用 *some*");

/** whyNotSome says what a wrong word for a some-or-any gap shows the learner misread. */
const whyNotSome = (wrong: string, _right: string, shown: string): Text => {
  const noun = shown.split("___ ")[1]?.split(" ")[0] ?? "";
  if (wrong === "a")
    return t(
      `*a* goes only with one thing you can count, but *${noun}* is not one thing.`,
      `*a* 只用于一个可数的东西，可 *${noun}* 不是单个的东西。`,
    );
  return wrong === "some"
    ? t("*some* is for statements, but this sentence is a question or a negative.", "*some* 用于肯定句，可这个句子是疑问句或否定句。")
    : t("*any* is for questions and negatives, but this sentence is a statement.", "*any* 用于疑问句和否定句，可这个句子是肯定句。");
};

const someAndAny: TopicDef = {
  id: "some-and-any",
  title: t("Some and Any", "some 和 any"),
  summary: t(
    "There is some milk. Is there any juice? There isn't any bread. Some in statements, any in questions and negatives.",
    "There is some milk. Is there any juice? There isn't any bread. 肯定句用 some，疑问句和否定句用 any。",
  ),
  intro: t(
    "Look at the kitchen table: *There are some bananas on the table.*, *Are there any bananas on the table?*, and *There aren't any bananas on the table.* English switches from *some* in positive statements to *any* in questions and negatives. In this topic, you pick, type, and convert between *some* and *any*.",
    "看看餐桌上的三句话：*There are some bananas on the table.*、*Are there any bananas on the table?* 和 *There aren't any bananas on the table.* 英语在肯定句里用 *some*，一到疑问句和否定句就换成 *any*。本主题带你选择、拼写并在 *some* 与 *any* 之间准确转换。",
  ),
  prerequisites: ["countable-and-uncountable-nouns", "a1-words-meals"],
  encompasses: [
    { topic: "countable-and-uncountable-nouns", weight: 0.3 },
    { topic: "a1-words-meals", weight: 0.3 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Some or any", "some 还是 any"),
      t(
        "*some* in a statement: *There is some milk.* *There are some eggs.*\n\n*any* in a question or after *not*: *Is there any juice?* *There aren't any eggs.*\n\nBoth go with plurals (*eggs*) and with nouns you don't count (*milk*), never with *a*.\n\n> **Watch out.** Check the verb and end mark first: a `?` at the end or *n't*/*not* in the verb immediately calls for *any*, never *some*—and never pick *a* before a plural or uncountable noun.",
        "肯定句用 *some*：*There is some milk.* *There are some eggs.*\n\n疑问句和否定句用 *any*：*Is there any juice?* *There aren't any eggs.*\n\n两者都可以接复数名词（*eggs*）和不可数名词（*milk*）。中文“一些”“什么”不随句型变化，英语却要根据句子是肯定、疑问还是否定来选择。\n\n> **注意。** 先看动词和句末标点：句末有 `?` 或动词带 *n't*/*not* 就立刻用 *any*；同时绝不在复数或不可数名词前选 *a*。",
      ),
      choiceGenerator(
        t("Choose the word for the gap.", "选出填入空白处的词。"),
        someChoiceBank,
        (right, shown) =>
          t(
            `${someReason(shown).en}: ${shown.replace("___", `*${right}*`)}\n\n**Check.** Check two cues—sentence type (positive -> *some*, question/negative -> *any*) and noun type (plural or uncountable, so *a* is ruled out).`,
            `${someReason(shown)["zh-CN"]}：${shown.replace("___", `*${right}*`)}\n\n**检验。** 核对两条线索——句型（肯定用 *some*，疑问/否定用 *any*）和名词（复数或不可数，排除 *a*）。`,
          ),
        whyNotSome,
      ),
    ),
    point(
      "type",
      t("Writing some or any", "写出 some 或 any"),
      t(
        "First see what kind of sentence it is. Type *some* when it is a statement (*There is some soup.*), and *any* when it is a question (*Is there any soup?*) or has *not* or *n't* in it (*There isn't any soup.*).\n\n> **Watch out.** Look closely at *isn't* / *aren't*—it is easy to miss *n't* when reading fast and type *some* by habit.",
        "先看句子是哪一种。肯定句写 *some*（*There is some soup.*）；疑问句（*Is there any soup?*），或者句子里有 *not*、*n't*（*There isn't any soup.*）时，写 *any*。\n\n> **注意。** 留心动词里的 *isn't* / *aren't*——读得太快容易看漏 *n't*，习惯性敲成 *some*。",
      ),
      typedGenerator("word-form", t("Type the word for the gap.", "输入填入空白处的词。"), someTypedBank, (right, shown) =>
        t(
          `${someReason(shown).en}: ${shown.replace("___", `*${right}*`)}\n\n**Check.** Scan for a question mark (?) or *n't*/*not*: if either appears, *any* is required; if neither appears, *some* fits.`,
          `${someReason(shown)["zh-CN"]}：${shown.replace("___", `*${right}*`)}\n\n**检验。** 扫一眼句中有没有问号（?）或 *n't*/*not*：有其一就用 *any*，都没有就用 *some*。`,
        ),
      ),
    ),
    point(
      "change",
      t("From some to any", "从 some 变成 any"),
      t(
        "When a statement becomes a question or a negative, *some* becomes *any*: *There is some milk.* → *Is there any milk?* → *There isn't any milk.*\n\n> **Watch out.** Make *both* changes together: flip *There is/are* to *Is/Are there* (with `?`) or add *n't/not*, AND change *some* to *any*.",
        "肯定句变成疑问句或否定句时，*some* 要变成 *any*：*There is some milk.* → *Is there any milk?* → *There isn't any milk.*\n\n> **注意。** 两处变化要一起做：既要把 *There is/are* 改成 *Is/Are there*（配 `?`）或加上 *n't/not*，又要同时把 *some* 换成 *any*。",
      ),
      typedGenerator("sentence-pattern", t("Change the sentence.", "改写这个句子。"), changeBank, (right) =>
        right.endsWith("?")
          ? t(
              `A question puts *${right.split(" ")[0]}* before *there*, and in a question *some* becomes *any*: ${right}\n\n**Check.** Verify all three marks of the question: *${right.split(" ")[0]} there* at the start, *any* instead of *some*, and a question mark (?) at the end.`,
              `疑问句把 *${right.split(" ")[0]}* 放在 *there* 前面，疑问句里的 *some* 要变成 *any*：${right}\n\n**检验。** 核对问句的三处：句首是 *${right.split(" ")[0]} there*，*some* 已换成 *any*，句末是问号（?）。`,
            )
          : t(
              `A negative adds *n't* to *is* or *are*, and after *not* the word *some* becomes *any*: ${right}\n\n**Check.** Verify both negative changes: *isn't*/*aren't* (or *is/are not*) in the verb, and *any* in place of *some*.`,
              `否定句在 *is* 或 *are* 后加 *n't*，在否定句里 *some* 要变成 *any*：${right}\n\n**检验。** 核对否定句的两处变化：动词里已有 *isn't*/*aren't*（或 *is/are not*），且 *some* 已换成 *any*。`,
            ),
      ),
    ),
  ],
};

// Joining with and, but and or.

/** andPairs are two sentences that add one fact to another; the second is written as it is inside a sentence. */
const andPairs: readonly (readonly [string, string])[] = [
  ["Tom plays football.", "Anna plays the piano."],
  ["I get up at seven.", "I have breakfast at eight."],
  ["My mom is a doctor.", "my dad is a teacher."],
  ["We have rice for lunch.", "we have noodles for dinner."],
  ["The cat is black.", "the dog is white."],
  ["I like music.", "my sister likes art."],
  ["Lily reads a book.", "Ben watches TV."],
  ["My brother is ten.", "my sister is twelve."],
  ["I brush my teeth.", "I go to bed."],
  ["We go to the park.", "we play with our dog."],
  ["Mia speaks English.", "she speaks Chinese."],
  ["The shop opens at nine.", "it closes at six."],
];

/** butPairs are two sentences that differ: one is yes and the other no. */
const butPairs: readonly (readonly [string, string])[] = [
  ["I like tea.", "I don't like coffee."],
  ["Anna likes cats.", "she doesn't like dogs."],
  ["I have a bike.", "I don't have a car."],
  ["I can swim.", "I can't ride a horse."],
  ["It's late.", "I'm not tired."],
  ["Tom is hungry.", "there is no food in the kitchen."],
  ["We have a test today.", "I'm not ready."],
  ["My sister plays the piano.", "she doesn't play the guitar."],
  ["Ben is sick.", "he isn't sad."],
  ["The shop is open.", "the bank isn't open."],
  ["I eat meat.", "my brother doesn't eat meat."],
  ["Lily speaks English.", "she doesn't speak French."],
];

/** orChoices are a question and the two things it offers. */
const orChoices: readonly (readonly [stem: string, a: string, b: string])[] = [
  ["Do you want", "tea", "coffee"],
  ["Is your cat", "black", "white"],
  ["Do you go to school", "by bus", "by bike"],
  ["Is the test", "on Monday", "on Tuesday"],
  ["Do you like", "rice", "noodles"],
  ["Is Tom", "ten", "eleven"],
  ["Do we eat", "at six", "at seven"],
  ["Is your birthday", "in May", "in June"],
  ["Can I have", "an apple", "a banana"],
  ["Is the cake", "for Mom", "for Dad"],
  ["Do you play", "football", "basketball"],
  ["Is the shop open", "on Saturday", "on Sunday"],
];

const stop = (s: string) => s.slice(0, -1);

const joinChoiceBank: readonly ChoiceItem[] = interleave([
  andPairs.map(([a, b]): ChoiceItem => [`${stop(a)}, ___ ${b}`, "and", ["but", "or"]]),
  butPairs.map(([a, b]): ChoiceItem => [`${stop(a)}, ___ ${b}`, "but", ["and", "or"]]),
  orChoices.map(([stem, a, b]): ChoiceItem => [`${stem} ${a} ___ ${b}?`, "or", ["and", "but"]]),
]);

const clauseJoin = (joiner: "and" | "but", pairs: readonly (readonly [string, string])[]): readonly TypedItem[] =>
  pairs.map(
    ([a, b]): TypedItem => ({
      shown: `${a} ${sentenceCase(b)} (${joiner})`,
      accepted: [`${stop(a)}(,) ${joiner} ${b}`],
      canonical: `${stop(a)}, ${joiner} ${b}`,
      wrong: [`${a} ${joiner} ${b}`, `${stop(a)}, ${joiner === "and" ? "but" : "and"} ${b}`],
      instruction: t("Join the two sentences with the word in brackets.", "用括号里的词把两个句子连起来。"),
    }),
  );

const joinTypedBank: readonly TypedItem[] = interleave([
  clauseJoin("and", andPairs),
  clauseJoin("but", butPairs),
  orChoices.map(
    ([stem, a, b]): TypedItem => ({
      shown: `${stem} ${a}? ${stem} ${b}? (or)`,
      accepted: [`${stem} ${a} or ${b}?`],
      wrong: [`${stem} ${a} and ${b}?`, `${stem} ${a}? or ${b}?`],
      instruction: t("Join the two questions into one with *or*.", "用 *or* 把两个问句合成一个。"),
    }),
  ),
]);

/** joinReason says why a sentence takes and, but or or, in every locale. */
const joinReason = (right: string): Text =>
  right === "and"
    ? t("The second part just adds one more fact, so join with *and*", "后半句只是再补充一件事，所以用 *and* 连接")
    : right === "but"
      ? t(
          "The two parts are different, often one yes and one no, so join with *but*",
          "前后两部分不一样，常常一个肯定一个否定，所以用 *but* 连接",
        )
      : t("The question offers a choice between two things, so join them with *or*", "这个问句是在两样东西中选一个，所以用 *or* 连接");

/** whyNotJoin says what a wrong joining word shows the learner misread. */
const whyNotJoin = (wrong: string, right: string): Text => {
  if (wrong === "or") return t("*or* offers a choice, but this sentence states two facts.", "*or* 表示选择，可这个句子说的是两件事实。");
  if (wrong === "and")
    return right === "or"
      ? t("*and* would ask for both together, but the question offers a choice of one.", "*and* 表示两样都要，可这个问句是要选其中一个。")
      : t("*and* just adds a fact, but the two parts here are different.", "*and* 只是补充一件事，可这里前后两部分不一样。");
  return right === "or"
    ? t("*but* shows a difference, but this question offers a choice.", "*but* 表示转折，可这个问句是在提供选择。")
    : t("*but* shows a difference, but the second part just adds a fact.", "*but* 表示转折，可后半句只是补充一件事。");
};

const joiningWithAndButOr: TopicDef = {
  id: "joining-with-and-but-or",
  title: t("Joining with And, But and Or", "用 and、but、or 连接"),
  summary: t(
    "Join two short sentences: and adds, but shows a difference, or gives a choice.",
    "把两个短句连起来：and 表示补充，but 表示转折，or 表示选择。",
  ),
  intro: t(
    "Compare *The shop opens at nine, and it closes at six.*, *The shop is open, but the bank isn't open.*, and *Is the shop open on Saturday or Sunday?* Three tiny joining words—*and* (adding), *but* (contrasting), and *or* (choosing)—turn choppy short sentences into smooth English. In this topic, you pick the right connector and join two sentences cleanly.",
    "比较这三句话：*The shop opens at nine, and it closes at six.*、*The shop is open, but the bank isn't open.* 和 *Is the shop open on Saturday or Sunday?* 三个简短的连接词——*and*（补充）、*but*（转折）和 *or*（选择）——能把零散的短句连成流畅的英语。本主题带你选对连接词并规范地合并句子。",
  ),
  prerequisites: ["writing-words-in-order"],
  encompasses: [{ topic: "writing-words-in-order", weight: 0.3 }],
  xp: 20,
  strand: "writing",
  knowledgePoints: [
    point(
      "choose",
      t("And, but or or", "and、but 还是 or"),
      t(
        "*and* adds one more thing: *Tom plays football, and Anna plays the piano.*\n\n*but* joins two things that are different, often one yes and one no: *I like tea, but I don't like coffee.*\n\n*or* gives a choice: *Do you want tea or coffee?*\n\n> **Watch out.** Check the relationship between the two halves: if one half is positive and the other is negative (or surprising), use *but*; if the sentence asks you to pick one of two options, use *or*.",
        "*and* 表示再加一件事：*Tom plays football, and Anna plays the piano.*\n\n*but* 连接两件不同的事，常常一个肯定一个否定：*I like tea, but I don't like coffee.*\n\n*or* 表示选择：*Do you want tea or coffee?*\n\n中文的“和”只连接名词，连接两个句子时英语要用 *and*；中文常说“虽然……但是……”，英语只用一个 *but*。\n\n> **注意。** 先看前后两半的逻辑关系：一正一反或意思转折用 *but*；在两项里选一个用 *or*；顺承补充用 *and*。",
      ),
      choiceGenerator(
        t("Choose the word that joins the sentence.", "选出连接句子的词。"),
        joinChoiceBank,
        (right, shown) =>
          t(
            `${joinReason(right).en}: ${shown.replace("___", `*${right}*`)}\n\n**Check.** Test the meaning of the two halves together—${right === "and" ? "they simply add up without contrast" : right === "but" ? "they pull in opposite directions" : "they offer two alternatives to choose between"}, confirming *${right}*.`,
            `${joinReason(right)["zh-CN"]}：${shown.replace("___", `*${right}*`)}\n\n**检验。** 合起来体会前后两半的意思——${right === "and" ? "二者只是并列补充、没有转折" : right === "but" ? "前后一正一反形成对比" : "是在两个选项里二选一"}，确认用 *${right}*。`,
          ),
        whyNotJoin,
      ),
    ),
    point(
      "join",
      t("Joining two sentences", "把两个句子连起来"),
      t(
        "Take away the period of the first sentence, put a comma and the joining word, and start the second part with a small letter, unless it begins with *I* or a name: *My mom is a doctor, and my dad is a teacher.*\n\nTwo questions about a choice become one: *Do you want tea or coffee?*\n\n> **Watch out.** Do not keep the first period or question mark in the middle of the joined sentence (*I like tea. but…* and *Do you want tea? or coffee?* are both wrong).",
        "去掉第一个句子的句号，加上逗号和连接词，第二部分以小写字母开头，除非它以 *I* 或名字开头：*My mom is a doctor, and my dad is a teacher.*\n\n两个关于选择的问句合成一个：*Do you want tea or coffee?*\n\n> **注意。** 不要把第一句的句号或问号留在合并后的句子中间（*I like tea. but…* 和 *Do you want tea? or coffee?* 都不对）。",
      ),
      typedGenerator("sentence-pattern", t("Join the sentences.", "把句子连起来。"), joinTypedBank, (right, shown) => {
        const joiner = shown.match(/\((\w+)\)$/u)?.[1] ?? "";
        return joiner === "or"
          ? t(
              `Two questions about a choice become one: keep the first question and add *or* and the other choice: ${right}\n\n**Check.** Verify there is only one question mark at the very end and *or* links the two choices cleanly without repeating the stem.`,
              `两个关于选择的问句合成一个：保留第一个问句，再加 *or* 和另一个选项：${right}\n\n**检验。** 确认句末只有一个问号，且 *or* 直接连接两个选项，没有重复前半截问句。`,
            )
          : t(
              `Drop the period of the first sentence, add a comma and *${joiner}*, and go on with a small letter unless it is *I* or a name: ${right}\n\n**Check.** Check the joint in the middle: the first period is replaced by a comma and *${joiner}*, the second part starts lowercase (unless *I* or a name), and one period closes the sentence.`,
              `去掉第一句的句号，加逗号和 *${joiner}*，后半句以小写字母开头，除非是 *I* 或名字：${right}\n\n**检验。** 检查中间的连接处：第一句的句号已换成逗号加 *${joiner}*，后半句首字母改为小写（*I* 或人名除外），全句以一个句号结尾。`,
            );
      }),
    ),
  ],
};

/** topics are the topics of the unit Food and Drink. */
export const topics: readonly TopicDef[] = [
  food.topic,
  drinks.topic,
  meals.topic,
  favoriteFoods.topic,
  countableAndUncountable,
  someAndAny,
  joiningWithAndButOr,
];

/** vocabulary are the words the unit Food and Drink teaches. */
export const vocabulary: readonly WordBatch[] = [food.batch, drinks.batch, meals.batch, favoriteFoods.batch];
