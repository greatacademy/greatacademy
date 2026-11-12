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
  prerequisites: ["a1-words-my-day"],
  words: [
    word(
      "food foods",
      "what people and animals eat",
      "食物",
      "Rice, bread and eggs are {food}.|fruit egg | The dog is hungry. Give him some {food}.|egg rice | I like Chinese {food} a lot.|egg banana",
      "egg fruit",
    ),
    word(
      "fruit fruits",
      "a sweet food that grows on a tree or a plant, like an apple",
      "水果",
      "Apples and bananas are {fruit}.|meat vegetables | I eat {fruit} every day: an apple in the morning.|meat bread | Is a tomato a {fruit} or a vegetable?|meat bread",
      "meat bread",
    ),
    word(
      "vegetable vegetables",
      "a plant you eat, like a potato or a tomato",
      "蔬菜",
      "A potato is a {vegetable}.|fruit meat | Eat your {vegetables}. They are good for you.|eggs breads | We grow {vegetables} in our garden.|eggs meats",
      "fruit meat",
    ),
    word(
      "meat meats",
      "food from an animal, like chicken",
      "肉",
      "Chicken is a kind of {meat}.|fruit rice | My sister doesn't eat {meat}. She eats vegetables.|egg banana | We cook {meat} and rice for dinner.|apple banana",
      "fruit egg",
    ),
    word(
      "chicken chickens",
      "a farm bird; its meat",
      "鸡；鸡肉",
      "A {chicken} lives on a farm and gives us eggs.|potato tomato | We have {chicken} and rice for dinner.|apple banana | The {chickens} are in the garden.|potatoes tomatoes",
      "potato rice",
    ),
    word(
      "rice",
      "small white seeds you cook and eat, a lot in Asia",
      "米；米饭",
      "In China, many people eat {rice} every day.|egg banana | A bowl of {rice}, please.|egg apple | We cook {rice} in water.|apple banana",
      "bread egg",
    ),
    word(
      "bread breads",
      "a food made from flour and baked, cut into slices",
      "面包",
      "I have {bread} and butter for breakfast.|rice egg | Mom buys {bread} at the shop.|egg apple | A sandwich is two pieces of {bread}.|rice egg",
      "rice egg",
    ),
    word(
      "egg eggs",
      "a round thing from a bird, with a hard shell; we cook and eat it",
      "蛋；鸡蛋",
      "The chicken gives us an {egg} every day.|apple banana | I have two {eggs} for breakfast.|breads rices | Birds sit on their {eggs}.|apples potatoes",
      "apple bread",
    ),
    word(
      "apple apples",
      "a round fruit, red or green",
      "苹果",
      "An {apple} a day is good for you.|egg potato | {Apples} are red or green.|Bananas Potatoes | There are six {apples} on the tree.|bananas potatoes",
      "banana potato",
    ),
    word(
      "banana bananas",
      "a long yellow fruit",
      "香蕉",
      "A {banana} is long and yellow.|apple tomato | Monkeys like {bananas}.|apples potatoes | Peel the {banana} before you eat it.|apple tomato",
      "apple tomato",
    ),
    word(
      "potato potatoes",
      "a vegetable that grows under the ground; we cook it",
      "土豆",
      "French fries are made from {potatoes}.|apples bananas | A {potato} grows under the ground.|banana tomato | Cook the {potatoes} in hot water.|bananas apples",
      "tomato banana",
    ),
    word(
      "tomato tomatoes",
      "a soft red fruit we use like a vegetable",
      "西红柿",
      "A {tomato} is red and round.|banana potato | We put {tomatoes} in the salad.|bananas eggs | Ketchup is made from {tomatoes}.|potatoes eggs",
      "potato banana",
    ),
  ],
});

const drinks = vocabularyTopic({
  id: "a1-words-drinks",
  title: t("Drinks", "饮料"),
  summary: t("Water, milk, juice, tea and coffee, in cups, glasses and bottles.", "水、牛奶、果汁、茶和咖啡，以及杯子和瓶子。"),
  prerequisites: ["a1-words-food"],
  words: [
    word(
      "water",
      "the clear drink that falls as rain",
      "水",
      "Fish live in {water}.|milk tea | I'm thirsty. Can I have a glass of {water}?|cake bread | We wash our hands with {water}.|juice milk",
      "milk juice",
    ),
    word(
      "milk",
      "the white drink that comes from cows",
      "牛奶",
      "Cows give us {milk}.|juice water | Babies drink {milk}.|coffee tea | I put {milk} in my tea. It makes it white.|juice coffee",
      "juice water",
    ),
    word(
      "juice juices",
      "a drink made from fruit",
      "果汁",
      "Orange {juice} is made from oranges.|milk tea | Do you want apple {juice} or water?|milk tea | This {juice} is very sweet.|bread coffee",
      "milk tea",
    ),
    word(
      "tea teas",
      "a hot drink made from leaves and hot water",
      "茶",
      "My grandpa drinks green {tea} every morning.|juice milk | Would you like a cup of {tea}?|juice cake | In China, many people drink {tea}.|juice cake",
      "coffee juice",
    ),
    word(
      "coffee coffees",
      "a hot brown drink; many adults drink it in the morning",
      "咖啡",
      "My mom drinks a cup of {coffee} every morning.|juice cake | {Coffee} is brown and hot.|Milk Juice | Children don't usually drink {coffee}.|water milk",
      "tea juice",
    ),
    word(
      "cup cups",
      "a small round thing with a handle, for hot drinks",
      "杯子（带把手的）",
      "A {cup} of tea, please.|bottle plate | The {cup} has a handle.|bottle glass | There are four {cups} on the table.|bottles glasses",
      "glass bottle",
    ),
    word(
      "glass glasses",
      "a clear thing for cold drinks; also what windows are made of",
      "玻璃杯；玻璃",
      "A {glass} of water, please.|bowl plate | Be careful! The {glass} can break.|bottle cake | Windows are made of {glass}.|bottle cup",
      "cup bottle",
    ),
    word(
      "bottle bottles",
      "a tall thing with a small top, for water or juice",
      "瓶子",
      "I take a {bottle} of water to school.|cup plate | Put the top back on the {bottle}.|cup glass | We need two {bottles} of milk.|cups cakes",
      "cup glass",
    ),
    word(
      "drink drinks drank drunk drinking",
      "to take water, milk or juice into your mouth; something you drink",
      "喝；饮料",
      "I {drink} milk every morning.|eat cook | What would you like to {drink}? — Juice, please.|eat cook | The cat is {drinking} water.|eating cooking",
      "eat cook",
    ),
    word(
      "hungry hungrier hungriest",
      "wanting to eat",
      "饿的",
      "I'm {hungry}. Can I have a sandwich?|thirsty tired | The baby is {hungry}. Give her some milk.|thirsty sick | After school I'm always {hungry}, so I eat an apple.|thirsty late",
      "thirsty tired",
    ),
    word(
      "thirsty thirstier thirstiest",
      "wanting to drink",
      "渴的",
      "I'm {thirsty}. Can I have some water?|hungry tired | It's hot, and the dog is {thirsty}.|hungry sick | After football, we are always {thirsty}, so we drink a lot.|hungry late",
      "hungry tired",
    ),
    word(
      "cake cakes",
      "a sweet food you bake, often for a birthday",
      "蛋糕",
      "We have a birthday {cake} with ten candles.|bottle cup | A piece of chocolate {cake}, please.|bottle glass | Mom makes {cakes} on Sundays.|cups bottles",
      "cup bottle",
    ),
  ],
});

const meals = vocabularyTopic({
  id: "a1-words-meals",
  title: t("Meals", "餐食"),
  summary: t(
    "Some, any, much and a lot; bowls, plates, spoons, forks and knives; the kitchen.",
    "some、any、much、a lot；碗、盘子、勺子、叉子和刀；厨房。",
  ),
  prerequisites: ["a1-words-drinks"],
  words: [
    word(
      "some",
      "a number or an amount of something, not saying how much",
      "一些",
      "Can I have {some} water, please?|any much | There are {some} apples on the table.|any much | I'd like {some} rice, please.|any much",
      "any much",
    ),
    word(
      "any",
      "used in questions and negatives for an amount or a number",
      "任何；一些（用于疑问句和否定句）",
      "Is there {any} milk?|some much | There aren't {any} eggs.|some much | Do you have {any} bread?|some lot",
      "some lot",
    ),
    word(
      "much",
      "a large amount of something; used with things you don't count",
      "很多（修饰不可数名词）",
      "I don't drink {much} coffee. Only one cup a week.|lot any | How {much} is this cake? — Two dollars.|lot any | There isn't {much} rice. Let's buy some.|lot some",
      "lot any",
      "some",
    ),
    word(
      "lot lots",
      "with *a*: many or much",
      "（a lot）许多",
      "There are a {lot} of people here.|much any | I eat a {lot} of fruit.|much some | Thanks a {lot}!|much some",
      "much any",
    ),
    word(
      "bowl bowls",
      "a deep round dish for soup or rice",
      "碗",
      "I eat a {bowl} of rice every day.|fork knife | Put the soup in a {bowl}.|fork spoon | We need four {bowls} for the noodles.|forks knives",
      "fork plate",
    ),
    word(
      "plate plates",
      "a flat round dish you put food on",
      "盘子",
      "Put the cake on a {plate}.|spoon fork | My {plate} is empty. Can I have some more?|spoon fork | Wash the {plates} after dinner.|spoons knives",
      "bowl spoon",
    ),
    word(
      "spoon spoons",
      "a small thing with a round end, for soup",
      "勺子",
      "I eat soup with a {spoon}.|knife plate | Put a {spoon} of sugar in my tea.|knife plate | We need {spoons} for the ice cream.|knives plates",
      "knife fork",
    ),
    word(
      "fork forks",
      "a thing with three or four points, for eating",
      "叉子",
      "In the West, people eat with a knife and a {fork}.|bowl cup | Put the {fork} on the left of the plate.|bowl cup | I eat my salad with a {fork}.|bowl cup",
      "spoon bowl",
    ),
    word(
      "knife knives",
      "a sharp thing for cutting",
      "刀",
      "Cut the bread with a {knife}.|spoon bowl | Be careful! The {knife} is sharp.|spoon plate | Put the forks and {knives} on the table.|spoons bowls",
      "fork spoon",
    ),
    word(
      "table tables",
      "a piece of furniture with a flat top and legs",
      "桌子",
      "Dinner is on the {table}. Come and eat!|kitchen plate | We sit at the {table} to eat.|kitchen bowl | Put the plates on the {table}, please.|kitchen fork",
      "kitchen plate",
    ),
    word(
      "cook cooks cooked cooking",
      "to make food hot and ready to eat",
      "烹饪；做饭",
      "My dad {cooks} dinner every evening.|drinks eats | Can you {cook}? — Yes, I can make noodles.|drink eat | Mom is {cooking} in the kitchen.|drinking eating",
      "eat drink",
    ),
    word(
      "kitchen kitchens",
      "the room where you cook",
      "厨房",
      "Mom is cooking in the {kitchen}.|table bowl | The fridge is in the {kitchen}.|table plate | We eat breakfast in the {kitchen}.|bowl plate",
      "table plate",
    ),
  ],
});

const favoriteFoods = vocabularyTopic({
  id: "a1-words-favorite-foods",
  title: t("Favorite Foods", "喜欢的食物"),
  summary: t("Sandwiches, pizza, noodles, dumplings, soup, ice cream and more.", "三明治、披萨、面条、饺子、汤、冰淇淋等。"),
  prerequisites: ["a1-words-meals"],
  words: [
    word(
      "sandwich sandwiches",
      "two pieces of bread with food between them",
      "三明治",
      "I take a {sandwich} to school for lunch.|soup salt | A chicken {sandwich}, please.|soup sugar | Mom makes egg {sandwiches} for our picnic.|soups salts",
      "soup salad",
    ),
    word(
      "pizza pizzas",
      "a flat round bread with tomato and cheese on top",
      "披萨",
      "Pizza comes from Italy. We love {pizza}!|soup salt | Let's cut the {pizza} into eight pieces.|soup sugar | A {pizza} is flat and round.|soup salad",
      "soup salad",
    ),
    word(
      "noodle noodles",
      "a long thin food, cooked in water or soup",
      "面条",
      "I eat {noodles} with chopsticks.|salts sugars | Chinese {noodles} are long and thin.|cookies candies | We have beef {noodle} soup for lunch.|cookie candy",
      "cookie candy",
    ),
    word(
      "dumpling dumplings",
      "a small piece of dough with meat or vegetables inside",
      "饺子",
      "In China, families make {dumplings} for the New Year.|cookies salads | Each {dumpling} has meat and vegetables inside.|cookie salad | We cook the {dumplings} in hot water.|cookies salads",
      "cookie pizza",
    ),
    word(
      "soup soups",
      "a hot food that is mostly water, eaten with a spoon",
      "汤",
      "I eat {soup} with a spoon.|sandwich pizza | This tomato {soup} is too hot.|sandwich cookie | When I'm sick, Mom makes chicken {soup}.|cookie pizza",
      "salad sandwich",
    ),
    word(
      "salad salads",
      "cold vegetables, mixed and eaten raw",
      "沙拉",
      "A {salad} is good for you. It's all vegetables!|soup candy | We put tomatoes in the {salad}.|soup candy | I'd like a fruit {salad}, please.|sugar candy",
      "soup sandwich",
    ),
    word(
      "ice",
      "frozen water",
      "冰",
      "Water turns into {ice} when it is very cold.|salt sugar | Put some {ice} in my juice, please.|salt soup | Be careful! There is {ice} on the road.|salt soup",
      "salt sugar",
    ),
    word(
      "cream creams",
      "the thick part of milk; with *ice*, a cold sweet food",
      "奶油；（ice cream）冰淇淋",
      "Ice {cream} is cold and sweet.|soup salt | I'd like a cake with {cream} on top.|salt soup | Strawberry ice {cream} is my favorite.|soup salad",
      "soup salt",
    ),
    word(
      "candy candies",
      "a small sweet food made of sugar",
      "糖果",
      "Don't eat too much {candy}. It's bad for your teeth.|salt soup | The children get {candies} at the party.|salts soups | This {candy} is very sweet.|salt soup",
      "salt soup",
    ),
    word(
      "cookie cookies",
      "a small flat sweet cake",
      "饼干；曲奇",
      "Grandma bakes {cookies} for us.|soups salads | Can I have a chocolate {cookie}?|soup salad | There are six {cookies} in the box.|soups salads",
      "soup salad",
    ),
    word(
      "sugar sugars",
      "a sweet white powder you put in food and drinks",
      "糖",
      "I put {sugar} in my tea to make it sweet.|salt ice | Candy has a lot of {sugar}.|salt ice | Cakes are made with eggs, milk and {sugar}.|salt ice",
      "salt ice",
    ),
    word(
      "salt salts",
      "a white powder that makes food taste better; the sea has it",
      "盐",
      "Sea water has {salt} in it.|sugar cream | Put a little {salt} in the soup.|sugar candy | Too much {salt} is bad for you.|candy cream",
      "sugar candy",
    ),
  ],
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
        "Some nouns you can count: *an apple, two apples, some eggs*. Others you cannot: *rice, bread, meat, milk, water, juice, sugar, salt, soup*. They have no *-s* and no *a*: *some rice*, not *some rices* or *a rice*.\n\nAfter *some* and in *Do you like...?*, a noun you can count takes *-s*: *some apples*, *Do you like eggs?*",
        "有些名词可以数：*an apple、two apples、some eggs*。有些不能数：*rice、bread、meat、milk、water、juice、sugar、salt、soup*。它们不加 *-s*，也不用 *a*：说 *some rice*，不说 *some rices* 或 *a rice*。\n\n中文名词不分单复数，所以要记住：在 *some* 后面和 *Do you like...?* 里，可数名词要用复数：*some apples*、*Do you like eggs?*",
      ),
      choiceGenerator(
        t("Choose the words for the gap.", "选出填入空白处的词。"),
        countChoiceBank,
        (right, shown) => {
          const sentence = shown.replace(/ \(.*\)$/u, "").replace("___", `*${right}*`);
          const reason = countReason(shown.match(/\((.*)\)$/u)?.[1] ?? "", right);
          return t(`${reason.en}: ${sentence}`, `${reason["zh-CN"]}：${sentence}`);
        },
        whyNotCount,
      ),
    ),
    point(
      "fix",
      t("Fixing the noun", "改正名词"),
      t(
        "Find the noun that is wrong: *rices*, *a bread* and *two apple* are all mistakes. Write the sentence right.",
        "找出用错的名词：*rices*、*a bread* 和 *two apple* 都是错的。把句子改正。",
      ),
      typedGenerator("sentence-pattern", t("Fix the sentence.", "改正这个句子。"), countFixBank, (right) => {
        const words = right.replace(/[.,?]/gu, "").split(" ");
        const uncountable = uncountables.find((u) => words.includes(u));
        const counted = countables.find(([, many]) => words.includes(many));
        const reason = uncountable ? countReason(uncountable, uncountable) : countReason(counted?.[0] ?? "", counted?.[1] ?? "");
        return t(`${reason.en}: ${right}`, `${reason["zh-CN"]}：${right}`);
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
        "*some* in a statement: *There is some milk.* *There are some eggs.*\n\n*any* in a question or after *not*: *Is there any juice?* *There aren't any eggs.*\n\nBoth go with plurals (*eggs*) and with nouns you don't count (*milk*), never with *a*.",
        "肯定句用 *some*：*There is some milk.* *There are some eggs.*\n\n疑问句和否定句用 *any*：*Is there any juice?* *There aren't any eggs.*\n\n两者都可以接复数名词（*eggs*）和不可数名词（*milk*）。中文“一些”“什么”不随句型变化，英语却要根据句子是肯定、疑问还是否定来选择。",
      ),
      choiceGenerator(
        t("Choose the word for the gap.", "选出填入空白处的词。"),
        someChoiceBank,
        (right, shown) =>
          t(
            `${someReason(shown).en}: ${shown.replace("___", `*${right}*`)}`,
            `${someReason(shown)["zh-CN"]}：${shown.replace("___", `*${right}*`)}`,
          ),
        whyNotSome,
      ),
    ),
    point(
      "type",
      t("Writing some or any", "写出 some 或 any"),
      t(
        "First see what kind of sentence it is. Type *some* when it is a statement, and *any* when it is a question or has *not* or *n't* in it.",
        "先看句子是哪一种。肯定句写 *some*；疑问句，或者句子里有 *not*、*n't* 时，写 *any*。",
      ),
      typedGenerator("word-form", t("Type the word for the gap.", "输入填入空白处的词。"), someTypedBank, (right, shown) =>
        t(
          `${someReason(shown).en}: ${shown.replace("___", `*${right}*`)}`,
          `${someReason(shown)["zh-CN"]}：${shown.replace("___", `*${right}*`)}`,
        ),
      ),
    ),
    point(
      "change",
      t("From some to any", "从 some 变成 any"),
      t(
        "When a statement becomes a question or a negative, *some* becomes *any*: *There is some milk.* → *Is there any milk?* → *There isn't any milk.*",
        "肯定句变成疑问句或否定句时，*some* 要变成 *any*：*There is some milk.* → *Is there any milk?* → *There isn't any milk.*",
      ),
      typedGenerator("sentence-pattern", t("Change the sentence.", "改写这个句子。"), changeBank, (right) =>
        right.endsWith("?")
          ? t(
              `A question puts *${right.split(" ")[0]}* before *there*, and in a question *some* becomes *any*: ${right}`,
              `疑问句把 *${right.split(" ")[0]}* 放在 *there* 前面，疑问句里的 *some* 要变成 *any*：${right}`,
            )
          : t(
              `A negative adds *n't* to *is* or *are*, and after *not* the word *some* becomes *any*: ${right}`,
              `否定句在 *is* 或 *are* 后加 *n't*，在否定句里 *some* 要变成 *any*：${right}`,
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
  prerequisites: ["writing-words-in-order"],
  encompasses: [{ topic: "writing-words-in-order", weight: 0.3 }],
  xp: 20,
  strand: "writing",
  knowledgePoints: [
    point(
      "choose",
      t("And, but or or", "and、but 还是 or"),
      t(
        "*and* adds one more thing: *Tom plays football, and Anna plays the piano.*\n\n*but* joins two things that are different, often one yes and one no: *I like tea, but I don't like coffee.*\n\n*or* gives a choice: *Do you want tea or coffee?*",
        "*and* 表示再加一件事：*Tom plays football, and Anna plays the piano.*\n\n*but* 连接两件不同的事，常常一个肯定一个否定：*I like tea, but I don't like coffee.*\n\n*or* 表示选择：*Do you want tea or coffee?*\n\n中文的“和”只连接名词，连接两个句子时英语要用 *and*；中文常说“虽然……但是……”，英语只用一个 *but*。",
      ),
      choiceGenerator(
        t("Choose the word that joins the sentence.", "选出连接句子的词。"),
        joinChoiceBank,
        (right, shown) =>
          t(
            `${joinReason(right).en}: ${shown.replace("___", `*${right}*`)}`,
            `${joinReason(right)["zh-CN"]}：${shown.replace("___", `*${right}*`)}`,
          ),
        whyNotJoin,
      ),
    ),
    point(
      "join",
      t("Joining two sentences", "把两个句子连起来"),
      t(
        "Take away the period of the first sentence, put a comma and the joining word, and start the second part with a small letter, unless it begins with *I* or a name.\n\nTwo questions about a choice become one: *Do you want tea or coffee?*",
        "去掉第一个句子的句号，加上逗号和连接词，第二部分以小写字母开头，除非它以 *I* 或名字开头。\n\n两个关于选择的问句合成一个：*Do you want tea or coffee?*",
      ),
      typedGenerator("sentence-pattern", t("Join the sentences.", "把句子连起来。"), joinTypedBank, (right, shown) => {
        const joiner = shown.match(/\((\w+)\)$/u)?.[1] ?? "";
        return joiner === "or"
          ? t(
              `Two questions about a choice become one: keep the first question and add *or* and the other choice: ${right}`,
              `两个关于选择的问句合成一个：保留第一个问句，再加 *or* 和另一个选项：${right}`,
            )
          : t(
              `Drop the period of the first sentence, add a comma and *${joiner}*, and go on with a small letter unless it is *I* or a name: ${right}`,
              `去掉第一句的句号，加逗号和 *${joiner}*，后半句以小写字母开头，除非是 *I* 或名字：${right}`,
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
