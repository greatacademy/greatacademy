// A2, unit 4: Cooking. Cooking, ingredients, taste and quantities; a few and a little; steps in order judged by rules
// and a recipe judged by a model.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, interleave, vocabularyTopic, word } from "../words.ts";
import { fill, judgedTopic } from "./kit.ts";

const cooking = vocabularyTopic({
  id: "a2-words-cooking",
  title: t("Cooking", "烹饪"),
  summary: t(
    "Recipes; boiling, frying, baking, cutting, mixing, adding, pouring and heating; slices, ovens and pans.",
    "食谱；煮、煎、烤、切、混合、加、倒和加热；片、烤箱和平底锅。",
  ),
  prerequisites: ["a1-words-meals"],
  words: [
    word(
      "recipe recipes",
      "a list of what you need and the steps for cooking a dish",
      "食谱",
      "Can I have the {recipe} for this cake?|oven pan | Grandma's {recipe} for dumplings is the best.|oven pan | Follow the {recipe} step by step.|oven slice",
      "oven pan",
    ),
    word(
      "boil boils boiled boiling",
      "to heat water or food until it bubbles",
      "煮沸；煮",
      "{Boil} the water, then add the noodles.|Fry Bake | Water {boils} at 100 degrees.|fries bakes | The soup is {boiling}. Turn down the heat.|frying pouring",
      "fry bake",
    ),
    word(
      "fry fries fried frying",
      "to cook in hot oil",
      "油炸；煎",
      "{Fry} the onions in a little oil.|Boil Pour | Dad {fried} the fish in a hot pan.|boiled poured | Don't {fry} food every day. It isn't healthy.|pour mix",
      "boil pour",
    ),
    word(
      "bake bakes baked baking",
      "to cook in an oven",
      "烘焙；烤",
      "Mom {baked} a cake for my birthday.|boiled poured | {Bake} the bread for forty minutes.|Boil Pour | I love the smell of {baking} bread.|boiling pouring",
      "boil pour",
    ),
    word(
      "cut cuts cutting",
      "to make something into pieces with a knife",
      "切",
      "{Cut} the apple in half.|Pour Boil | I {cut} my finger with a knife.|poured boiled | Can you {cut} the bread, please?|pour boil",
      "pour boil",
    ),
    word(
      "mix mixes mixed mixing",
      "to put things together and stir them",
      "混合",
      "{Mix} the flour and the eggs.|Boil Fry | Red and yellow {mixed} together make orange.|poured cut | {Mix} everything well in a big bowl.|Boil Fry",
      "boil fry",
    ),
    word(
      "add adds added adding",
      "to put something with something else",
      "加；添加",
      "{Add} a little salt to the soup.|Cut Bake | If you {add} 2 and 3, you get 5.|cut pour | Can you {add} some sugar to my tea?|cut bake",
      "cut bake",
    ),
    word(
      "pour pours poured pouring",
      "to make a liquid flow out of something",
      "倒；倾倒",
      "{Pour} the milk into a glass.|Cut Fry | Can you {pour} me some water?|cut bake | It's {pouring} with rain!|cutting baking",
      "cut fry",
    ),
    word(
      "heat heats heated heating",
      "to make something hot; how hot something is",
      "加热；热",
      "{Heat} the oil in a pan.|Cut Slice | I can't sleep in this {heat}.|oven pan | {Heat} the soup before you eat it.|Cut Pour",
      "cut pour",
    ),
    word(
      "slice slices",
      "a thin flat piece cut from something",
      "片",
      "Can I have a {slice} of cake?|pan oven | I had two {slices} of pizza.|pans ovens | Cut the lemon into thin {slices}.|pans ovens",
      "pan oven",
    ),
    word(
      "oven ovens",
      "a box in a kitchen that you heat to bake food in",
      "烤箱",
      "Put the cake in the {oven} for thirty minutes.|pan recipe | Be careful! The {oven} is hot.|recipe slice | Our {oven} is broken, so we can't bake bread.|recipe slice",
      "pan recipe",
    ),
    word(
      "pan pans",
      "a metal pot with a handle, for cooking",
      "平底锅；锅",
      "Fry the eggs in a {pan}.|oven recipe | Wash the {pans} after dinner.|recipes ovens | Put some oil in the {pan}.|recipe slice",
      "oven recipe",
    ),
  ],
});

const ingredients = vocabularyTopic({
  id: "a2-words-ingredients",
  title: t("Ingredients", "食材"),
  summary: t(
    "Flour, butter, oil, pepper, onions, garlic, carrots, beans, corn, sauce, honey and lemons.",
    "面粉、黄油、油、胡椒、洋葱、大蒜、胡萝卜、豆子、玉米、酱、蜂蜜和柠檬。",
  ),
  prerequisites: ["a2-words-cooking"],
  words: [
    word(
      "flour",
      "a white powder made from wheat, used to make bread and cakes",
      "面粉",
      "You need {flour}, eggs and milk to make pancakes.|garlic pepper | Bread is made from {flour} and water.|butter honey | {Flour} is a white powder. We use it to make bread.|Honey Oil",
      "garlic pepper",
    ),
    word(
      "butter",
      "a yellow food made from milk, that you put on bread",
      "黄油",
      "I like bread with {butter} and jam.|pepper garlic | Melt the {butter} in a pan.|pepper flour | {Butter} is made from milk.|Flour Pepper",
      "pepper garlic",
    ),
    word(
      "oil oils",
      "a thick liquid from plants, used for cooking",
      "油",
      "Fry the fish in hot {oil}.|flour honey | Add a little olive {oil}.|flour honey | This bottle of {oil} is almost empty.|flour pepper",
      "flour honey",
    ),
    word(
      "pepper peppers",
      "a hot powder you put on food; a red, green or yellow vegetable",
      "胡椒；甜椒",
      "Add salt and {pepper} to the soup.|flour honey | I don't like green {peppers}.|flours honeys | This soup has too much {pepper}. It's hot!|flour butter",
      "flour honey",
    ),
    word(
      "onion onions",
      "a round vegetable with a strong smell that makes you cry when you cut it",
      "洋葱",
      "Cutting {onions} makes me cry.|lemons carrots | Fry the {onion} until it is soft.|lemon honey | French {onion} soup is famous.|honey flour",
      "lemon honey",
    ),
    word(
      "garlic",
      "a small white plant with a strong taste, used in cooking",
      "大蒜",
      "Add two pieces of {garlic} to the oil.|honey flour | I can smell {garlic} on your breath.|flour corn | Some people think {garlic} keeps you healthy.|flour butter",
      "honey flour",
    ),
    word(
      "carrot carrots",
      "a long orange vegetable",
      "胡萝卜",
      "Rabbits love {carrots}.|onions lemons | A {carrot} is long and orange.|lemon bean | Cut the {carrots} into slices.|honeys flours",
      "onion lemon",
    ),
    word(
      "bean beans",
      "a seed of a plant that you cook and eat",
      "豆",
      "Tofu is made from {beans}.|carrots lemons | Green {beans} are good for you.|lemons onions | We had rice and {beans} for dinner.|honey flour",
      "carrot lemon",
    ),
    word(
      "corn",
      "a tall plant with yellow seeds that you eat",
      "玉米",
      "Popcorn is made from {corn}.|flour beans | Chickens eat {corn}.|honey garlic | There are fields of {corn} near the village.|honey butter",
      "honey garlic",
    ),
    word(
      "sauce sauces",
      "a thick liquid you eat with food",
      "酱；调味汁",
      "Noodles with tomato {sauce} are my favorite.|flour garlic | Do you want soy {sauce} with your dumplings?|flour corn | The chef makes a special {sauce} for the fish.|flour corn",
      "flour corn",
    ),
    word(
      "honey",
      "a sweet food that bees make",
      "蜂蜜",
      "Bees make {honey}.|butter sauce | I put {honey} in my tea.|garlic onion | This cake is sweet because of the {honey}.|garlic pepper",
      "butter garlic",
    ),
    word(
      "lemon lemons",
      "a yellow fruit with a very sour taste",
      "柠檬",
      "A {lemon} is yellow and sour.|carrot bean | Hot water with {lemon} and honey is good for a cold.|corn flour | I'd like tea with {lemon}, please.|garlic corn",
      "carrot bean",
    ),
  ],
});

const taste = vocabularyTopic({
  id: "a2-words-taste",
  title: t("Taste", "味道"),
  summary: t(
    "Tasting and smelling; delicious, sweet, sour, salty, spicy, fresh, raw and bitter food; meals.",
    "品尝和闻；美味的、甜的、酸的、咸的、辣的、新鲜的、生的和苦的食物；一顿饭。",
  ),
  prerequisites: ["a2-words-ingredients"],
  words: [
    word(
      "taste tastes tasted tasting",
      "what food is like in your mouth; to try a little food",
      "味道；品尝",
      "This soup {tastes} too salty.|fresh raws | {Taste} the sauce before you add more salt.|Fresh Raw | Lemons have a sour {taste}.|meal raw",
      "fresh raw",
    ),
    word(
      "delicious",
      "very good to eat",
      "美味的",
      "Mmm, this cake is {delicious}!|raw bitter | Thank you for the {delicious} meal.|raw bitter | The dumplings were {delicious}. I ate twenty!|raw bitter",
      "raw bitter",
    ),
    word(
      "sweet sweeter sweetest",
      "tasting like sugar",
      "甜的",
      "Sugar and honey are {sweet}.|sour salty | This tea is too {sweet}. You put in too much sugar.|sour salty | I like {sweet} things like cakes and ice cream.|sour salty",
      "sour salty",
    ),
    word(
      "sour sourer sourest",
      "tasting like a lemon",
      "酸的",
      "Lemons are {sour}.|sweet spicy | This milk is old. It tastes {sour}.|sweet spicy | The green apples were very {sour}, so I added sugar.|sweet salty",
      "sweet spicy",
    ),
    word(
      "salty saltier saltiest",
      "with a lot of salt",
      "咸的",
      "Sea water is {salty}.|sweet sour | I'm thirsty. The chips were very {salty}.|sweet sour | This soup is too {salty}. Who put in so much salt?|sweet sour",
      "sweet sour",
    ),
    word(
      "spicy spicier spiciest",
      "with a hot, strong taste",
      "辣的",
      "Sichuan food is very {spicy}.|sweet sour | This curry is too {spicy}. My mouth is on fire!|sweet sour | Do you like {spicy} food? — Yes, I love chilies.|sweet sour",
      "sweet sour",
    ),
    word(
      "fresh fresher freshest",
      "just made or picked, not old",
      "新鲜的",
      "We buy {fresh} fish at the market every morning.|bitter sour | This bread is {fresh}. It's still warm.|raw bitter | Open the window and let in some {fresh} air.|raw sweet",
      "raw bitter",
    ),
    word(
      "raw",
      "not cooked",
      "生的",
      "Sushi is made with {raw} fish.|bitter sweet | Don't eat {raw} meat. Cook it first.|fresh sweet | Carrots are good {raw} or cooked.|bitter sour",
      "fresh bitter",
    ),
    word(
      "smell smells smelled smelling",
      "to notice something with your nose; what you notice with your nose",
      "闻；气味",
      "I love the {smell} of fresh bread.|meal raw | Something {smells} bad. Is the fish old?|meals raws | Dogs can {smell} things from far away.|taste meal",
      "taste meal",
    ),
    word(
      "bitter",
      "with a strong taste that is not sweet, like coffee without sugar",
      "苦的",
      "Coffee without sugar is {bitter}.|sweet salty | Dark chocolate is a little {bitter}.|salty spicy | Black tea is {bitter} if you leave it too long.|salty spicy",
      "sweet salty",
    ),
    word(
      "meal meals",
      "the food you eat at one time, like breakfast or dinner",
      "一顿饭",
      "Breakfast is the first {meal} of the day.|taste smell | We had a big {meal} at Grandma's.|taste smell | Wash your hands before {meals}.|tastes smells",
      "taste smell",
    ),
  ],
});

const quantities = vocabularyTopic({
  id: "a2-words-quantities",
  title: t("Quantities", "数量"),
  summary: t(
    "Pieces, kilos, grams, liters, bits and pairs; few, little, enough, plenty, amounts and extra.",
    "块、千克、克、升、一点和一对；few、little、enough、plenty、数量和额外的。",
  ),
  prerequisites: ["a2-words-taste"],
  words: [
    word(
      "piece pieces",
      "one part of something",
      "一块；一片",
      "Can I have a {piece} of cake?|pair kilo | I need a {piece} of paper.|pair liter | The plate fell and broke into {pieces}.|pairs kilos",
      "pair kilo",
    ),
    word(
      "kilo kilos",
      "a thousand grams",
      "千克；公斤",
      "A {kilo} of apples, please.|liter pair | This bag of rice is five {kilos}.|liters pairs | The baby was three {kilos} when she was born.|liters pieces",
      "liter pair",
    ),
    word(
      "gram grams",
      "a very small amount of weight; there are a thousand in a kilo",
      "克",
      "Add 200 {grams} of flour.|liters pairs | This letter is only 20 {grams}.|liters pieces | A {gram} is very light.|liter pair",
      "liter pair",
    ),
    word(
      "liter liters",
      "an amount of liquid; a big bottle of water holds one or two",
      "升",
      "We need two {liters} of milk.|kilos pairs | Drink about two {liters} of water a day.|grams pieces | This bottle holds one {liter}.|gram pair",
      "kilo pair",
    ),
    word(
      "bit bits",
      "a small piece or amount",
      "一点；小块",
      "I'm a {bit} tired.|few pair | Add a {bit} of salt.|few pair | Can I have a {bit} of your sandwich?|few kilo",
      "few pair",
    ),
    word(
      "few",
      "not many; with a: some",
      "很少；（a few）几个",
      "There are a {few} apples in the bag.|little bit | I have a {few} friends in this town.|little bit | Very {few} people came to the party, so it was quiet.|little plenty",
      "little bit",
    ),
    word(
      "little less least",
      "not much; with a: some",
      "很少；（a little）一点",
      "Add a {little} oil to the pan.|few pair | There's very {little} milk left. Let's buy some.|few plenty | I speak a {little} French.|few pair",
      "few pair",
    ),
    word(
      "enough",
      "as much or as many as you need",
      "足够的",
      "Do we have {enough} chairs for everyone?|plenty amount | I didn't have {enough} money to buy it.|plenty amount | Is there {enough} food for ten people?|plenty amount",
      "plenty amount",
    ),
    word(
      "plenty",
      "a lot, more than enough",
      "大量；充足",
      "Don't hurry. We have {plenty} of time.|enough few | There's {plenty} of food, so invite your friends.|few enough | Drink {plenty} of water when it's hot.|few enough",
      "enough few",
    ),
    word(
      "pair pairs",
      "two things of the same kind used together",
      "一双；一对",
      "I bought a new {pair} of shoes.|piece kilo | A {pair} of glasses costs a lot.|piece kilo | Work in {pairs}: two students in each group.|pieces kilos",
      "piece kilo",
    ),
    word(
      "amount amounts",
      "how much there is of something",
      "数量；数额",
      "Use a small {amount} of salt.|pair few | That's a lot of money! What a large {amount}!|pair few | The {amount} of rain this year is low.|pair piece",
      "pair few",
    ),
    word(
      "extra",
      "more than usual",
      "额外的",
      "Can I have {extra} cheese on my pizza?|few amount | We have an {extra} bed if you want to stay.|enough plenty | There's an {extra} cost for breakfast.|enough plenty",
      "enough plenty",
    ),
  ],
});

// A few and a little.

/** counted are nouns you count, in the plural; uncounted are nouns you do not count. */
const counted: readonly string[] = [
  "onions",
  "eggs",
  "carrots",
  "tomatoes",
  "potatoes",
  "apples",
  "lemons",
  "cookies",
  "oranges",
  "bananas",
  "beans",
];
const uncounted: readonly string[] = ["oil", "salt", "milk", "sugar", "flour", "butter", "honey", "rice", "water", "cheese", "juice"];

/** frames are sentences with a gap before the noun that take either kind. */
const frames: readonly string[] = [
  "Buy ___ {} on your way home.",
  "We only have ___ {} left.",
  "I need ___ {} for the recipe.",
  "Can you give me ___ {}, please?",
  "Put ___ {} in the bowl.",
  "Let's add ___ {}.",
];

const quantRows = (nouns: readonly string[]) => everyPair(nouns, frames).map(([noun, frame]) => frame.replace("{}", noun));

const quantChoiceBank: readonly ChoiceItem[] = interleave([
  quantRows(counted).map((s): ChoiceItem => [s, "a few", ["a little", "a bit"]]),
  quantRows(uncounted).map((s): ChoiceItem => [s, "a little", ["a few", "a bit"]]),
]);

const quantFixBank: readonly TypedItem[] = interleave([
  quantRows(counted).map((s): TypedItem => {
    const shown = s.replace("___", "a little");
    return { shown, accepted: [s.replace("___", "a few")], wrong: [shown] };
  }),
  quantRows(uncounted).map((s): TypedItem => {
    const shown = s.replace("___", "a few");
    return { shown, accepted: [s.replace("___", "a little")], wrong: [shown] };
  }),
]);

const manyMuchBank: readonly ChoiceItem[] = interleave([
  everyPair(counted, [
    "How ___ {} do we need?",
    "There aren't ___ {} in the fridge.",
    "We don't have ___ {}.",
    "Did you buy ___ {}?",
    "How ___ {} are there?",
  ]).map(([noun, frame]): ChoiceItem => [frame.replace("{}", noun), "many", ["much", "a little"]]),
  everyPair(uncounted, [
    "How ___ {} do we need?",
    "There isn't ___ {} in the fridge.",
    "We don't have ___ {}.",
    "Did you buy ___ {}?",
    "How ___ {} is there?",
  ]).map(([noun, frame]): ChoiceItem => [frame.replace("{}", noun), "much", ["many", "a few"]]),
]);

/** quantNoun is the noun after the gap, or after the quantifier, of a sentence. */
const quantNoun = (sentence: string): string => /(?:___|a few|a little|many|much) (\w+)/u.exec(sentence)?.[1] ?? "";

/** countReason says whether noun is counted and so which words it takes. */
const countReason = (noun: string): Text =>
  counted.includes(noun)
    ? t(
        `You can count *${noun}* (*two ${noun}*), so it takes *a few* and *many*`,
        `*${noun}* 可以数（*two ${noun}*），所以用 *a few* 和 *many*`,
      )
    : t(
        `You cannot count *${noun}* (not *two ${noun}s*), so it takes *a little* and *much*`,
        `*${noun}* 不能数（不说 *two ${noun}s*），所以用 *a little* 和 *much*`,
      );

/** quantWhy explains the quantifier in the gap of shown. */
const quantWhy = (right: string, shown: string): Text => {
  const reason = countReason(quantNoun(shown));
  return t(`${reason.en}: ${fill(shown, right)}`, `${reason["zh-CN"]}：${fill(shown, right)}`);
};

/** whyNotQuant explains a quantifier that does not fit the noun after the gap. */
const whyNotQuant = (wrong: string, _right: string, shown: string): Text => {
  const noun = quantNoun(shown);
  const reason = countReason(noun);
  if (wrong === "a bit")
    return t(
      `*a bit* cannot stand straight before a noun; it needs *of*, as in *a bit of salt*. ${reason.en}.`,
      `*a bit* 不能直接放在名词前，要说 *a bit of*，如 *a bit of salt*。${reason["zh-CN"]}。`,
    );
  const use: Record<string, Text> = {
    "a few": t("*a few* is for nouns you count", "*a few* 用于可数名词"),
    many: t("*many* is for nouns you count", "*many* 用于可数名词"),
    "a little": t("*a little* is for nouns you do not count", "*a little* 用于不可数名词"),
    much: t("*much* is for nouns you do not count", "*much* 用于不可数名词"),
  };
  const of = use[wrong] ?? t(`*${wrong}*`, `*${wrong}*`);
  const after = /^(a few|a little)$/u.test(wrong) && /How ___|n't ___/u.test(shown);
  return t(
    `${of.en}${after ? ", and after *How* or *not* English uses *many* or *much*" : ""}. ${reason.en}.`,
    `${of["zh-CN"]}${after ? "，而且在 *How* 或 *not* 后面要用 *many* 或 *much*" : ""}。${reason["zh-CN"]}。`,
  );
};

const quantifiers: TopicDef = {
  id: "quantifiers-a-few-and-a-little",
  title: t("A Few and A Little", "a few 和 a little"),
  summary: t(
    "A few onions, a little oil: few with nouns you count, little with nouns you do not.",
    "a few onions，a little oil：few 用于可数名词，little 用于不可数名词。",
  ),
  prerequisites: ["some-and-any", "a2-words-quantities"],
  encompasses: [
    { topic: "some-and-any", weight: 0.2 },
    { topic: "a2-words-quantities", weight: 0.2 },
  ],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("A few or a little", "a few 还是 a little"),
      t(
        "Both mean *some, but not many* or *not much*.\n\n- *a few* goes with nouns you count, in the plural: *a few onions*, *a few eggs*.\n- *a little* goes with nouns you do not count: *a little oil*, *a little salt*, *a little milk*.\n\nAsk: can I say *two* before it? *Two eggs*: yes, so *a few eggs*. *Two milks*: no, so *a little milk*.",
        "两者都表示“一些、不多”。\n\n- *a few* 用于可数名词复数：*a few onions*、*a few eggs*。\n- *a little* 用于不可数名词：*a little oil*、*a little salt*、*a little milk*。\n\n中文“一点”“几个”都可以说“一些”，英语要先判断名词能不能数：能说 *two eggs*，所以用 *a few eggs*；不能说 *two milks*，所以用 *a little milk*。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), quantChoiceBank, quantWhy, whyNotQuant),
    ),
    point(
      "many-much",
      t("How many or how much", "how many 还是 how much"),
      t(
        "The same rule holds for *many* and *much*: *many* with nouns you count (*How many eggs?*), *much* with nouns you do not (*How much milk?*).",
        "*many* 和 *much* 也一样：可数名词用 *many*（*How many eggs?*），不可数名词用 *much*（*How much milk?*）。",
      ),
      choiceGenerator(t("Choose the word for the gap.", "选出填入空白处的词。"), manyMuchBank, quantWhy, whyNotQuant),
    ),
    point(
      "fix",
      t("Fixing a few and a little", "改正 a few 和 a little"),
      t(
        "Each sentence uses *a few* with a noun you do not count, or *a little* with one you count. Write it again.",
        "每个句子都把 *a few* 用在了不可数名词前，或把 *a little* 用在了可数名词前。改正句子。",
      ),
      typedGenerator("sentence", t("Fix the sentence.", "改正这个句子。"), quantFixBank, (right) => {
        const reason = countReason(quantNoun(right));
        return t(`${reason.en}: ${right}`, `${reason["zh-CN"]}：${right}`);
      }),
    ),
  ],
};

// Writing steps in order.

/** recipes are four steps each, in order, written as instructions. */
const recipes: readonly (readonly [string, string, string, string])[] = [
  ["boil some water", "add the noodles", "cook them for five minutes", "put them in a bowl with some sauce"],
  ["mix the flour, eggs and milk", "heat a little oil in a pan", "pour in some of the mix", "fry the pancake on both sides"],
  ["boil the water", "put a tea bag in a cup", "pour the water into the cup", "add a slice of lemon and a little honey"],
  ["heat a little oil in a pan", "break an egg into the pan", "fry it for two minutes", "put it on a plate"],
  ["wash the fruit", "cut it into small pieces", "put the pieces in a bowl", "add a little honey and mix"],
  ["cut two slices of bread", "put a little butter on them", "add some cheese and tomato", "put the slices together"],
  ["cut the carrots and onions", "fry them in a little oil", "add some water and boil it", "cook the soup for twenty minutes"],
  ["wash the rice", "put it in a pan with water", "boil it for ten minutes", "turn off the heat and wait five minutes"],
  ["mix the butter and sugar", "add the eggs and flour", "pour the mix into a pan", "bake it for forty minutes"],
  ["boil a pan of water", "add the corn", "cook it for ten minutes", "add a little butter and salt"],
  ["cut the lemons in half", "put their juice in a bottle", "add water and a little sugar", "put the bottle in the fridge"],
  ["wash the potatoes", "cut them into thin slices", "fry them in hot oil", "add a little salt"],
];

const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** stepWords are the word before each step, written with the comma it takes. */
const stepWords = ["First,", "Then", "Next,", "Finally,"] as const;
const stepRight = ["First", "Then", "Next", "Finally"] as const;
const stepWrong: readonly (readonly [string, string])[] = [
  ["Finally", "Next"],
  ["First", "Finally"],
  ["First", "Finally"],
  ["First", "Second"],
];

const told = (steps: readonly string[], gapAt: number) =>
  steps.map((step, i) => (i === gapAt ? `___${i === 1 ? "" : ","} ${step}.` : `${stepWords[i]} ${step}.`)).join(" ");

const stepChoiceBank: readonly ChoiceItem[] = interleave(
  [0, 1, 2, 3].map((position) =>
    recipes.map((steps): ChoiceItem => [told(steps, position), stepRight[position] ?? "", stepWrong[position] ?? []]),
  ),
);

const stepTypedBank: readonly TypedItem[] = interleave(
  [0, 2, 1, 3].map((position) =>
    recipes.map((steps): TypedItem => {
      const step = steps[position] ?? "";
      const word = position === 0 ? "First" : position === 3 ? "Finally" : "[Then|Next]";
      const canonical =
        position === 0 ? `First, ${step}.` : position === 3 ? `Finally, ${step}.` : `${position === 1 ? "Then" : "Next,"} ${step}.`;
      return {
        shown: `Step ${position + 1} of 4: ${step}`,
        accepted: [`${word}(,) ${step}.`],
        canonical,
        wrong: [`${capital(step)}.`, `${position === 0 ? "Finally" : "First"}, ${step}.`],
      };
    }),
  ),
);

/** stepPlace says which step a word marks and why it fits there. */
const stepPlace: Readonly<Record<string, Text>> = {
  First: t("This is the first step, so it starts with *First* and a comma", "这是第一步，所以用 *First* 加逗号开头"),
  Then: t("This step comes in the middle, right after the first, so it takes *Then*", "这一步在中间，紧接第一步，所以用 *Then*"),
  Next: t(
    "This step comes in the middle, after another step, so it takes *Next* and a comma",
    "这一步在中间，跟在另一步后面，所以用 *Next* 加逗号",
  ),
  Finally: t("This is the last step, so it starts with *Finally* and a comma", "这是最后一步，所以用 *Finally* 加逗号开头"),
};

/** stepUse says what each order word is for. */
const stepUse: Readonly<Record<string, Text>> = {
  First: t(
    "*First* is only for the first step, and a step already comes before this one",
    "*First* 只用于第一步，而这一步前面已经有步骤了",
  ),
  Finally: t("*Finally* means *last*, so it is only for the last step", "*Finally* 意思是“最后”，只用于最后一步"),
  Next: t("*Next* follows another step, but nothing comes before the first one", "*Next* 要跟在另一步后面，但第一步前面没有步骤"),
  Second: t("*Second* gives a step its number, but the last step takes *Finally*", "*Second* 表示第二步，而最后一步要用 *Finally*"),
};

/** stepWhy explains the order word of a step. */
const stepWhy = (word: string, step: string): Text => {
  const place = stepPlace[word] ?? t(`*${word}*`, `*${word}*`);
  return t(`${place.en}: ${step}`, `${place["zh-CN"]}：${step}`);
};

const writingStepsInOrder: TopicDef = {
  id: "writing-steps-in-order",
  title: t("Writing Steps in Order", "按顺序写步骤"),
  summary: t(
    "Put the steps of a recipe in order and join them with first, then, next and finally.",
    "按顺序写出食谱的步骤，用 first、then、next 和 finally 连接。",
  ),
  prerequisites: ["imperatives", "joining-with-and-but-or"],
  encompasses: [{ topic: "imperatives", weight: 0.3 }],
  xp: 20,
  strand: "writing",
  knowledgePoints: [
    point(
      "choose",
      t("First, then, next, finally", "first、then、next、finally"),
      t(
        "Steps are instructions: they start with the verb, like *Boil the water.* Words before them show the order:\n\n- *First,* for the first step\n- *Then* or *Next,* for the steps in the middle\n- *Finally,* for the last step\n\n*First, boil some water. Then add the noodles. Next, cook them for five minutes. Finally, put them in a bowl.*",
        "步骤是指令，以动词开头，比如 *Boil the water.* 步骤前面的词表示顺序：\n\n- *First,* 用于第一步\n- *Then* 或 *Next,* 用于中间的步骤\n- *Finally,* 用于最后一步\n\n*First, boil some water. Then add the noodles. Next, cook them for five minutes. Finally, put them in a bowl.*\n\n*Finally* 意思是“最后”，不要把它用在中间的步骤上。",
      ),
      choiceGenerator(
        t("Choose the word for the gap.", "选出填入空白处的词。"),
        stepChoiceBank,
        (right, shown) => stepWhy(right, shown.replace("___", `*${right}*`)),
        (wrong) => {
          const use = stepUse[wrong] ?? t(`*${wrong}* does not fit this step`, `*${wrong}* 不适合这一步`);
          return t(`${use.en}.`, `${use["zh-CN"]}。`);
        },
      ),
    ),
    point(
      "write",
      t("Writing a step", "写出一个步骤"),
      t(
        "Write the step as an instruction with the word for its place: *First,* for step 1, *Then* or *Next,* in the middle, *Finally,* for the last one. Start with a capital letter and end with a period.",
        "把这一步写成指令，并加上表示顺序的词：第一步用 *First,*，中间的步骤用 *Then* 或 *Next,*，最后一步用 *Finally,*。句首大写，句末加句号。",
      ),
      typedGenerator("sentence-pattern", t("Write the step.", "写出这个步骤。"), stepTypedBank, (right) => {
        const word = right.split(/[ ,]/u)[0] ?? "";
        const place = stepPlace[word] ?? t(`*${word}*`, `*${word}*`);
        return t(
          `${place.en}, and the step itself is an instruction that starts with the verb: ${right}`,
          `${place["zh-CN"]}，步骤本身是以动词开头的指令：${right}`,
        );
      }),
    ),
  ],
};

// Writing a recipe.

const recipeBank: readonly WritingItem[] = [
  {
    task: "Write a recipe for egg fried rice.",
    model:
      "Egg fried rice\nYou need: a bowl of cooked rice, two eggs, a little oil, a few green onions and a little salt.\nFirst, heat the oil in a pan. Then break the eggs into the pan and mix them. Next, add the rice and fry it for three minutes. Then add the salt and the green onions. Finally, put the rice on a plate and eat it hot.",
  },
  {
    task: "Write a recipe for pancakes.",
    model:
      "Pancakes\nYou need: 200 grams of flour, two eggs, half a liter of milk and a little butter.\nFirst, mix the flour, eggs and milk in a big bowl. Then heat a little butter in a pan. Next, pour in some of the mix. Fry the pancake for one minute on each side. Finally, put it on a plate with some honey or lemon.",
  },
  {
    task: "Write a recipe for a fruit salad.",
    model:
      "Fruit salad\nYou need: two apples, a banana, an orange, a few grapes and a little honey.\nFirst, wash the fruit. Then cut the apples, the banana and the orange into small pieces. Next, put all the fruit in a bowl. Add a little honey and mix it well. Finally, put the bowl in the fridge for half an hour.",
  },
  {
    task: "Write a recipe for tomato and egg soup.",
    model:
      "Tomato and egg soup\nYou need: two tomatoes, two eggs, a liter of water, a little oil and a little salt.\nFirst, cut the tomatoes into pieces. Then fry them in a little oil for two minutes. Next, add the water and boil it. Mix the eggs in a bowl and pour them slowly into the soup. Finally, add the salt and serve it hot.",
  },
  {
    task: "Write a recipe for a cheese sandwich.",
    model:
      "Cheese sandwich\nYou need: two slices of bread, a little butter, two slices of cheese and a tomato.\nFirst, put a little butter on the bread. Then cut the tomato into thin slices. Next, put the cheese and the tomato on one slice of bread. Put the other slice on top. Finally, cut the sandwich in half.",
  },
  {
    task: "Write a recipe for hot lemon and honey.",
    model:
      "Hot lemon and honey\nYou need: half a lemon, a big cup of water and a little honey.\nFirst, boil the water. Then cut the lemon into slices. Next, put two slices of lemon in a cup and pour in the hot water. Wait two minutes. Finally, add a little honey and mix it. It is great when you have a cold.",
  },
  {
    task: "Write a recipe for noodles with vegetables.",
    model:
      "Noodles with vegetables\nYou need: some noodles, a carrot, an onion, a few beans, a little oil and some soy sauce.\nFirst, boil the noodles for five minutes. Then cut the carrot and the onion into thin pieces. Next, fry the vegetables in a little oil. Add the noodles and a little soy sauce, and mix everything. Finally, put the noodles in bowls.",
  },
  {
    task: "Write a recipe for a simple cake.",
    model:
      "Simple cake\nYou need: 200 grams of butter, 200 grams of sugar, four eggs and 200 grams of flour.\nFirst, heat the oven. Then mix the butter and sugar in a bowl. Next, add the eggs and the flour and mix them well. Pour the mix into a cake pan. Finally, bake it for forty minutes.",
  },
  {
    task: "Write a recipe for corn soup.",
    model:
      "Corn soup\nYou need: two cups of corn, an onion, a little butter, half a liter of milk and a little salt and pepper.\nFirst, cut the onion into small pieces. Then fry it in the butter until it is soft. Next, add the corn and the milk. Cook the soup for fifteen minutes. Finally, add salt and pepper.",
  },
  {
    task: "Write a recipe for a dish from your family.",
    model:
      "Grandma's potato pancakes\nYou need: three potatoes, an egg, two spoons of flour, a little oil and a little salt.\nFirst, wash the potatoes and cut them into very thin pieces. Then mix them with the egg, the flour and the salt. Next, heat the oil in a pan. Put a few spoons of the mix in the pan and fry them on both sides. Finally, eat them hot.",
  },
  {
    task: "Write a recipe for a healthy breakfast.",
    model:
      "A healthy breakfast bowl\nYou need: a cup of milk, a few spoons of oats, a banana, a few nuts and a little honey.\nFirst, pour the milk into a pan and heat it. Then add the oats and cook them for three minutes. Next, put them in a bowl. Cut the banana into slices and put it on top. Finally, add the nuts and a little honey.",
  },
  {
    task: "Write a recipe for a cold drink for a hot day.",
    model:
      "Lemon drink\nYou need: three lemons, a liter of cold water, a little sugar and some ice.\nFirst, cut the lemons in half. Then put their juice in a big bottle. Next, add the water and the sugar, and mix them well. Put the bottle in the fridge for an hour. Finally, pour the drink into glasses with some ice.",
  },
];

const writingARecipe = judgedTopic({
  id: "writing-a-recipe",
  title: t("Writing a Recipe", "写食谱"),
  summary: t(
    "Write a recipe for a simple dish: what you need, then five or six steps in order.",
    "为一道简单的菜写食谱：需要什么，然后按顺序写五六个步骤。",
  ),
  prerequisites: ["writing-steps-in-order", "quantifiers-a-few-and-a-little"],
  encompasses: [
    { topic: "writing-steps-in-order", weight: 0.4 },
    { topic: "quantifiers-a-few-and-a-little", weight: 0.2 },
  ],
  criteria: ["a2-recipe-ingredients", "a2-recipe-steps", "a1-sentences"],
  point: {
    id: "recipe",
    title: t("What you need and the steps", "所需材料和步骤"),
    explanation: t(
      "A recipe has two parts:\n\n- What you need, with amounts: *two eggs*, *a little oil*, *a few onions*, *200 grams of flour*.\n- The steps, in order, as instructions that start with a verb: *First, heat the oil in a pan. Then add the eggs. Finally, put the rice on a plate.*",
      "食谱有两部分：\n\n- 需要的材料和用量：*two eggs*、*a little oil*、*a few onions*、*200 grams of flour*。\n- 步骤：按顺序写，每一步都以动词开头：*First, heat the oil in a pan. Then add the eggs. Finally, put the rice on a plate.*\n\n指令句不需要主语，但要用动词原形开头，不要写成 *You heat* 或 *Heating*。",
    ),
  },
  question: t(
    "Write the recipe the task names in English: first what you need, then five or six steps in order.",
    "根据题目用英语写食谱：先写需要的材料，再按顺序写五六个步骤。",
  ),
  bank: recipeBank,
  limits: { minWords: 40, maxChars: 900 },
  what: t("recipe", "食谱"),
});

/** topics are the topics of the unit Cooking. */
export const topics: readonly TopicDef[] = [
  cooking.topic,
  ingredients.topic,
  taste.topic,
  quantities.topic,
  quantifiers,
  writingStepsInOrder,
  writingARecipe,
];

/** vocabulary are the words the unit Cooking teaches. */
export const vocabulary: readonly WordBatch[] = [cooking.batch, ingredients.batch, taste.batch, quantities.batch];
