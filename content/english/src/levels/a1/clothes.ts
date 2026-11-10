// A1, unit 5: Clothes and Shopping. Clothes, shopping and choosing, the present continuous, how much and how many,
// and sentences about what people are wearing.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { interleave, pairUp, vocabularyTopic, word } from "../words.ts";

const clothes = vocabularyTopic({
  id: "a1-words-clothes",
  title: t("Clothes", "衣服"),
  summary: t("Shirts, dresses, pants, shoes, hats and coats, and the verb wear.", "衬衫、连衣裙、裤子、鞋、帽子和外套，以及动词 wear。"),
  prerequisites: ["pre-a1-words-colors"],
  words: [
    word(
      "clothes",
      "the things you wear, like shirts and dresses",
      "衣服",
      "Put your {clothes} in the cupboard.|hats shoes | I wear old {clothes} when I paint.|hats socks | We buy new {clothes} for the New Year.|hats socks",
      "hats socks",
    ),
    word(
      "shirt shirts",
      "a piece of clothing for the top of your body, often with buttons",
      "衬衫",
      "Dad wears a white {shirt} to work.|skirt sock | My {shirt} has six buttons.|sock shoe | Put on a clean {shirt}, please.|sock hat",
      "skirt sock",
    ),
    word(
      "T-shirt T-shirts",
      "a shirt with short arms and no buttons",
      "T恤",
      "It's hot today, so I'm wearing a {T-shirt}.|coat jacket | My {T-shirt} has a cat on it.|coat sock | Our team has blue {T-shirts}.|coats socks",
      "coat jacket",
    ),
    word(
      "dress dresses",
      "a piece of clothing for a girl or a woman that covers the body and part of the legs",
      "连衣裙",
      "Mia is wearing a pink {dress} to the party.|sock shoe | My sister has a long red {dress}.|sock hat | Grandma made two {dresses} for me.|socks hats",
      "sock pants",
    ),
    word(
      "skirt skirts",
      "a piece of clothing that hangs from the middle of the body",
      "裙子；半身裙",
      "She is wearing a blue {skirt} and a white shirt.|sock hat | My school {skirt} is gray.|sock hat | Girls in our school wear {skirts} or pants.|socks hats",
      "sock shirt",
    ),
    word(
      "pants",
      "a piece of clothing that covers each leg",
      "裤子",
      "I'm wearing black {pants} and a white shirt.|hats socks | These {pants} are too long for me.|hats shirts | Put on your {pants} and your shoes.|hats coats",
      "hats socks",
    ),
    word(
      "shoe shoes",
      "a thing you wear on your foot",
      "鞋",
      "Take off your {shoes} at the door.|hats coats | I need new {shoes} for running.|hats shirts | One {shoe} is under the bed. Where is the other one?|hat coat",
      "hat coat",
    ),
    word(
      "sock socks",
      "a soft thing you wear on your foot, inside a shoe",
      "袜子",
      "I wear {socks} in my shoes.|hats coats | One {sock} is red and one is blue!|hat coat | It's cold. Put on warm {socks}.|shirts hats",
      "hat coat",
    ),
    word(
      "hat hats",
      "a thing you wear on your head",
      "帽子",
      "It's sunny. Wear a {hat}.|sock skirt | The man has a black {hat} on his head.|sock shoe | We are wearing funny {hats} at the party.|socks shoes",
      "sock shoe",
    ),
    word(
      "coat coats",
      "a long warm piece of clothing you wear outside",
      "外套；大衣",
      "It's cold outside. Put on your {coat}.|T-shirt sock | My winter {coat} is long and warm.|T-shirt sock | Hang your {coats} by the door.|T-shirts socks",
      "T-shirt sock",
    ),
    word(
      "jacket jackets",
      "a short coat",
      "夹克；短外套",
      "Take a {jacket}. It may be cool tonight.|sock skirt | My {jacket} has two pockets.|sock dress | Leather {jackets} are expensive.|socks dresses",
      "sock skirt",
    ),
    word(
      "wear wears wore worn wearing",
      "to have clothes on your body",
      "穿；戴",
      "I {wear} a uniform to school.|buy sell | She is {wearing} a red hat.|buying selling | What are you {wearing} to the party?|selling paying",
      "buy sell",
    ),
  ],
});

const shopping = vocabularyTopic({
  id: "a1-words-shopping",
  title: t("Shopping", "购物"),
  summary: t("Buying, selling, paying, prices, sizes, cheap and expensive.", "买、卖、付钱、价格、尺码、便宜和贵。"),
  prerequisites: ["a1-words-clothes"],
  words: [
    word(
      "shop shops shopped shopping",
      "to go to stores to buy things; a store",
      "购物；商店",
      "We {shop} for food on Saturday.|sell pay | Let's go {shopping} for new shoes.|selling paying | The {shop} on the corner sells bread.|price money",
      "sell pay",
    ),
    word(
      "buy buys bought buying",
      "to get something by paying money",
      "买",
      "I want to {buy} a new bike.|sell wear | Mom {bought} a cake for my birthday.|sold wore | Where can I {buy} a ticket?|sell wear",
      "sell wear",
    ),
    word(
      "sell sells sold selling",
      "to give something to someone for money",
      "卖",
      "This shop {sells} shoes and bags.|buys pays | The farmer {sells} eggs at the market.|buys pays | Sorry, we don't {sell} newspapers.|buy pay",
      "buy pay",
    ),
    word(
      "money",
      "the coins and paper you use to buy things",
      "钱",
      "I don't have any {money}. I can't buy it.|price size | How much {money} do you have?|price size | Keep your {money} in your bag.|price store",
      "price size",
    ),
    word(
      "dollar dollars",
      "money used in America, Canada, Australia and other countries",
      "美元；元",
      "This hat is ten {dollars}.|sizes stores | Can I have a {dollar}, please?|size store | It costs five {dollars}.|sizes prices",
      "price size",
    ),
    word(
      "cheap cheaper cheapest",
      "costing little money",
      "便宜的",
      "This T-shirt is only two dollars. It's very {cheap}!|expensive different | The market is {cheaper} than the big store.|more expensive | Is there a {cheap} hotel near here?|expensive same",
      "expensive different",
    ),
    word(
      "expensive",
      "costing a lot of money",
      "贵的",
      "This coat is two hundred dollars. It's very {expensive}!|cheap same | I can't buy it. It's too {expensive}.|cheap new | Cars are {expensive}.|cheap same",
      "cheap same",
    ),
    word(
      "price prices",
      "how much money you pay for something",
      "价格",
      "What is the {price} of this bag? — It's twenty dollars.|size money | The {prices} at this shop are low.|sizes dollars | Look at the {price} on the label before you buy.|size store",
      "size money",
    ),
    word(
      "store stores",
      "a place where you buy things",
      "商店",
      "There's a big {store} next to the station.|price size | The {store} opens at nine.|price size | I bought my shoes at that {store}.|price size",
      "price size",
    ),
    word(
      "pay pays paid paying",
      "to give money for something",
      "付钱",
      "Can I {pay} with a card?|sell wear | I {paid} ten dollars for this book.|sold wore | Please {pay} at the front desk.|sell wear",
      "sell wear",
    ),
    word(
      "size sizes",
      "how big something is",
      "尺码；大小",
      "These shoes are too small. Do you have a bigger {size}?|price money | What {size} are you? — Small.|price money | The two bags are the same {size}.|price money",
      "price money",
    ),
    word(
      "try tries tried trying",
      "to do something to see if it is good; with *on*, to put on clothes in a shop to see if they fit",
      "尝试；（try on）试穿",
      "Can I {try} on this dress?|buy pay | {Try} this soup. It's very good!|Pay Sell | She {tried} on three hats.|bought paid",
      "buy pay",
    ),
  ],
});

const atTheShop = vocabularyTopic({
  id: "a1-words-at-the-shop",
  title: t("Which One?", "哪一个？"),
  summary: t(
    "Want, would, new, another, the same, different, only, all, more and most.",
    "want、would、new、another、same、different、only、all、more 和 most。",
  ),
  prerequisites: ["a1-words-shopping"],
  words: [
    word(
      "want wants wanted wanting",
      "to wish to have or do something",
      "想要",
      "I {want} a new bike for my birthday.|would other | Do you {want} some juice?|would other | What do you {want} to eat?|other would",
      "would other",
    ),
    word(
      "would",
      "with *like*, a kind way to say *want*",
      "（would like）想要（礼貌说法）",
      "I {would} like a cup of tea, please.|want more | {Would} you like some cake?|Want More | What {would} you like to buy?|want more",
      "want more",
    ),
    word(
      "new newer newest",
      "not used before; just bought or made",
      "新的",
      "I have a {new} bike. I got it yesterday.|same other | These shoes are {new}. I bought them today.|same only | Happy {New} Year!|Same Only",
      "same other",
    ),
    word(
      "another",
      "one more; a different one",
      "另一个；再一个",
      "Can I have {another} cookie? I'm still hungry.|same all | This shirt is too small. Do you have {another} one?|all most | I'd like {another} glass of water, please.|all most",
      "same all",
    ),
    word(
      "other others",
      "the second of two; not this one",
      "其他的；另一个",
      "One sock is red. The {other} sock is blue.|another more | I like this hat, but not the {other} one.|another more | Where are the {other} children? — In the garden.|another most",
      "another more",
      "another",
    ),
    word(
      "same",
      "not different; exactly like another",
      "相同的",
      "We are in the {same} class.|different other | My shoes and your shoes are the {same} color.|different another | Twins often wear the {same} clothes.|different another",
      "different other",
    ),
    word(
      "different",
      "not the same",
      "不同的",
      "A cat and a dog are very {different}.|same another | Do you have this coat in a {different} color?|same all | We speak {different} languages.|same all",
      "same another",
    ),
    word(
      "only",
      "no more than; just one",
      "只有；仅仅",
      "I have {only} one dollar. I can't buy it.|all more | It's {only} two dollars. It's cheap!|all more | She is the {only} girl in the team.|all most",
      "all more",
    ),
    word(
      "all",
      "every one; the whole",
      "全部；所有",
      "{All} the children are in the classroom.|Only Another | I ate {all} the cake. There's none left!|another only | Thank you {all} for coming.|only another",
      "only another",
    ),
    word(
      "more",
      "a bigger number or amount",
      "更多的",
      "Can I have some {more} rice, please?|most only | This coat costs {more} than that one.|most only | We need {more} chairs for the party.|most only",
      "most only",
    ),
    word(
      "most",
      "the biggest number or amount",
      "最多的；大多数",
      "Who has the {most} books? — Anna has ten!|more only | {Most} children like ice cream.|More Only | This is the {most} expensive shop in town.|more only",
      "more only",
    ),
  ],
});

// The present continuous.

/** pcSubjects are subjects with their form of be and its short form. */
const pcSubjects: readonly (readonly [subject: string, be: string, short: string])[] = [
  ["I", "am", "I'm"],
  ["She", "is", "She's"],
  ["They", "are", "They're"],
  ["Tom", "is", "Tom's"],
  ["We", "are", "We're"],
  ["My mom", "is", ""],
  ["You", "are", "You're"],
  ["The children", "are", ""],
];

/** pcActions are a verb, its -ing form, a misspelling of it and the rest of a sentence. */
const pcActions: readonly (readonly [verb: string, ing: string, misspelled: string, rest: string])[] = [
  ["wear", "wearing", "wearring", "a red coat"],
  ["read", "reading", "readding", "a book"],
  ["eat", "eating", "eatting", "an apple"],
  ["play", "playing", "plaing", "football"],
  ["run", "running", "runing", "in the park"],
  ["swim", "swimming", "swiming", "in the sea"],
  ["write", "writing", "writeing", "an email"],
  ["sit", "sitting", "siting", "on a chair"],
  ["make", "making", "makeing", "a cake"],
  ["drink", "drinking", "drinkking", "milk"],
  ["watch", "watching", "watchhing", "TV"],
  ["cook", "cooking", "cookking", "dinner"],
  ["buy", "buying", "buing", "new shoes"],
  ["get", "getting", "geting", "dressed"],
  ["try", "trying", "triing", "on a hat"],
];

const pcItems = (n: number, skip: number) =>
  pairUp(n + skip, pcSubjects, pcActions)
    .slice(skip)
    .map(([[subject, be, short], [verb, ing, misspelled, rest]]) => ({ subject, be, short, verb, ing, misspelled, rest }));

const pcChoiceBank: readonly ChoiceItem[] = pcItems(44, 0).map(
  ({ subject, be, verb, ing, rest }): ChoiceItem => [`${subject} ___ ${rest} now. (${verb})`, `${be} ${ing}`, [ing, `${be} ${verb}`]],
);

const pcSpellBank: readonly TypedItem[] = pcItems(40, 44).map(
  ({ subject, be, verb, ing, misspelled, rest }): TypedItem => ({
    shown: `${subject} ${be} ___ ${rest}. (${verb})`,
    accepted: [ing],
    wrong: [misspelled, verb],
  }),
);

const pcWriteBank: readonly TypedItem[] = pcItems(40, 84).map(({ subject, be, short, verb, ing, rest }): TypedItem => {
  const full = `${subject} ${be} ${ing} ${rest}.`;
  return {
    shown: `${subject} / ${verb} ${rest} / now`,
    accepted: [short === "" ? full : `[${subject} ${be}|${short}] ${ing} ${rest}( now).`, `${subject} ${be} ${ing} ${rest} now.`],
    canonical: full,
    wrong: [`${subject} ${ing} ${rest}.`, `${subject} ${be} ${verb} ${rest}.`],
  };
});

const presentContinuous: TopicDef = {
  id: "present-continuous",
  title: t("The Present Continuous", "现在进行时"),
  summary: t(
    "She is wearing a red coat. What is happening now takes am, is or are and a verb with -ing.",
    "She is wearing a red coat. 正在发生的事用 am、is 或 are 加动词的 -ing 形式。",
  ),
  prerequisites: ["the-verb-be", "a1-words-clothes"],
  encompasses: [
    { topic: "the-verb-be", weight: 0.3 },
    { topic: "a1-words-clothes", weight: 0.2 },
  ],
  xp: 25,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Am, is, are and -ing", "am、is、are 加 -ing"),
      t(
        "For what is happening now, use *am*, *is* or *are* and the verb with *-ing*: *I am reading. She is wearing a red coat. They are playing football.*\n\nYou need both parts: not *She wearing*, not *She is wear*.",
        "表示现在正在发生的事，用 *am*、*is* 或 *are* 加动词的 *-ing* 形式：*I am reading. She is wearing a red coat. They are playing football.*\n\n中文说“她正在穿”，只加“正在”，动词不变；英语两部分缺一不可：不能说 *She wearing*，也不能说 *She is wear*。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), pcChoiceBank, (right, shown) => {
        const sentence = shown.replace(/ \(.*\)$/u, "").replace("___", `*${right}*`);
        return t(sentence, `${sentence}（am/is/are + 动词 -ing）`);
      }),
    ),
    point(
      "spell",
      t("Spelling the -ing form", "拼写 -ing 形式"),
      t(
        "Most verbs just add *-ing*: *read → reading*. A verb that ends in *e* loses it: *make → making*. A short verb that ends in one vowel and one consonant doubles it: *run → running*, *swim → swimming*, *sit → sitting*.",
        "大多数动词直接加 *-ing*：*read → reading*。以不发音的 *e* 结尾的去 *e* 再加：*make → making*。以一个元音加一个辅音结尾的短动词，双写辅音再加：*run → running*、*swim → swimming*、*sit → sitting*。",
      ),
      typedGenerator("word-form", t("Type the verb with -ing.", "输入动词的 -ing 形式。"), pcSpellBank, (right, shown) => {
        const sentence = shown.replace(/ \(.*\)$/u, "").replace("___", `*${right}*`);
        return t(sentence, `${sentence}（动词的 -ing 形式是 ${right}）`);
      }),
    ),
    point(
      "write",
      t("Writing what is happening", "写出正在发生的事"),
      t(
        "Write a sentence from the note with *am*, *is* or *are* and the *-ing* form. Short forms like *She's* are fine.",
        "根据笔记用 *am*、*is* 或 *are* 加 *-ing* 形式写一个句子。也可以用 *She's* 这样的缩写。",
      ),
      typedGenerator("sentence-pattern", t("Write a sentence from the note.", "根据笔记写一个句子。"), pcWriteBank, (right) =>
        t(right, `${right}（am/is/are + 动词 -ing）`),
      ),
    ),
  ],
};

// How much and how many.

const manyNouns: readonly string[] = [
  "apples",
  "eggs",
  "books",
  "students",
  "chairs",
  "dollars",
  "bananas",
  "socks",
  "cookies",
  "people",
  "plates",
];
const muchNouns: readonly string[] = ["milk", "money", "water", "rice", "juice", "bread", "sugar", "time"];

const howFrames: readonly (readonly [many: string, much: string])[] = [
  ["How ___ {n} do you want?", "How ___ {n} do you want?"],
  ["How ___ {n} are there?", "How ___ {n} is there?"],
  ["How ___ {n} do we need?", "How ___ {n} do we need?"],
];

/** priced are things a shopper asks the price of. */
const priced: readonly (readonly [thing: string, be: string, answer: string])[] = [
  ["this hat", "is", "It's five dollars."],
  ["these shoes", "are", "They're forty dollars."],
  ["the red dress", "is", "It's thirty dollars."],
  ["these socks", "are", "They're two dollars."],
  ["that coat", "is", "It's ninety dollars."],
  ["the T-shirts", "are", "They're ten dollars each."],
  ["this bag", "is", "It's twenty dollars."],
  ["the pants", "are", "They're fifty dollars."],
];

const howChoiceBank: readonly ChoiceItem[] = interleave([
  pairUp(22, manyNouns, howFrames).map(([n, [frame]]): ChoiceItem => [frame.replace("{n}", n), "many", ["much", "lot"]]),
  pairUp(16, muchNouns, howFrames).map(([n, [, frame]]): ChoiceItem => [frame.replace("{n}", n), "much", ["many", "lot"]]),
  priced.map(([thing, be]): ChoiceItem => [`How ___ ${be} ${thing}?`, "much", ["many", "lot"]]),
]);

const numberWords: readonly string[] = ["three", "six", "ten", "twelve", "five", "eight", "four"];

const howTypedBank: readonly TypedItem[] = interleave([
  pairUp(14, manyNouns, numberWords).map(
    ([n, number]): TypedItem => ({
      shown: `There are ${number} ${n}.`,
      accepted: [`How many ${n} are there?`],
      wrong: [`How much ${n} are there?`, `How many ${n} is there?`],
      instruction: t("Write the question for this answer.", "写出这个回答对应的问句。"),
    }),
  ),
  muchNouns.map(
    (n): TypedItem => ({
      shown: `There is a lot of ${n}.`,
      accepted: [`How much ${n} is there?`],
      wrong: [`How many ${n} is there?`, `How much ${n} are there?`],
      instruction: t("Write the question for this answer.", "写出这个回答对应的问句。"),
    }),
  ),
  priced.map(
    ([thing, be, answer]): TypedItem => ({
      shown: `${answer} (${thing})`,
      accepted: [`How much ${be} ${thing}?`],
      wrong: [`How many ${be} ${thing}?`, `How much ${be === "is" ? "are" : "is"} ${thing}?`],
      instruction: t("Write the question for this answer.", "写出这个回答对应的问句。"),
    }),
  ),
]);

const howMuchAndHowMany: TopicDef = {
  id: "how-much-and-how-many",
  title: t("How Much and How Many", "how much 和 how many"),
  summary: t(
    "How many apples? How much milk? How much is it? Many for things you count, much for things you do not, and for prices.",
    "How many apples? How much milk? How much is it? 可数的东西用 many，不可数的用 much，问价钱也用 much。",
  ),
  prerequisites: ["countable-and-uncountable-nouns", "a1-words-shopping"],
  encompasses: [
    { topic: "countable-and-uncountable-nouns", weight: 0.3 },
    { topic: "a1-words-shopping", weight: 0.2 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Much or many", "much 还是 many"),
      t(
        "*How many* with things you count, in the plural: *How many apples do you want?*\n\n*How much* with things you don't count: *How much milk is there?* And for a price: *How much is this hat?*",
        "可数名词用 *how many*，后接复数：*How many apples do you want?*\n\n不可数名词用 *how much*：*How much milk is there?* 问价钱也用 *how much*：*How much is this hat?*\n\n中文都说“多少”，英语却要分 *many* 和 *much*。",
      ),
      choiceGenerator(t("Choose the word for the gap.", "选出填入空白处的词。"), howChoiceBank, (right, shown) =>
        t(
          shown.replace("___", `*${right}*`),
          `${shown.replace("___", `*${right}*`)}（${right === "many" ? "可数名词用 many" : "不可数名词和价钱用 much"}）`,
        ),
      ),
    ),
    point(
      "ask",
      t("Asking the question", "提出问题"),
      t(
        "Write the question that the answer replies to. *There are three apples.* → *How many apples are there?* *It's five dollars.* → *How much is it?*",
        "写出与回答对应的问句。*There are three apples.* → *How many apples are there?* *It's five dollars.* → *How much is it?*",
      ),
      typedGenerator("sentence", t("Write the question.", "写出问句。"), howTypedBank, (right) =>
        t(right, `${right}（可数名词用 many，不可数名词和价钱用 much）`),
      ),
    ),
  ],
};

// Writing what people are wearing.

const wearers: readonly (readonly [who: string, be: string, short: string])[] = [
  ["Mia", "is", "Mia's"],
  ["Tom", "is", "Tom's"],
  ["I", "am", "I'm"],
  ["Tom and Ben", "are", ""],
  ["My mom", "is", ""],
  ["The girls", "are", ""],
  ["Our teacher", "is", ""],
];

const outfits: readonly string[] = [
  "a blue dress",
  "black shoes",
  "a green hat",
  "a white T-shirt",
  "red socks",
  "a long coat",
  "gray pants",
  "a yellow jacket",
  "a pink skirt",
  "brown shoes",
  "an orange shirt",
];

const wearItems = pairUp(42, wearers, outfits).map(([[who, be, short], outfit]) => ({
  note: `${who} / ${outfit}`,
  right: `${who} ${be} wearing ${outfit}.`,
  pattern: short === "" ? `${who} ${be} wearing ${outfit}.` : `[${who} ${be}|${short}] wearing ${outfit}.`,
  who,
  be,
  outfit,
}));

const wearChoiceBank: readonly ChoiceItem[] = wearItems.map(
  ({ note, right, who, be, outfit }): ChoiceItem => [note, right, [`${who} wearing ${outfit}.`, `${who} ${be} wear ${outfit}.`]],
);

const wearTypedBank: readonly TypedItem[] = wearItems.map(
  ({ note, right, pattern, who, be, outfit }): TypedItem => ({
    shown: note,
    accepted: [pattern],
    canonical: right,
    wrong: [
      `${who} wearing ${outfit}.`,
      `${who} ${be} wear ${outfit}.`,
      `${who.charAt(0).toLowerCase()}${who.slice(1)} ${be} wearing ${outfit}`,
    ],
  }),
);

const whatPeopleAreWearing: TopicDef = {
  id: "writing-what-people-are-wearing",
  title: t("Writing What People Are Wearing", "写人们穿着什么"),
  summary: t(
    "Turn notes into present continuous sentences: Mia / a blue dress becomes Mia is wearing a blue dress.",
    "把笔记写成现在进行时的句子：Mia / a blue dress 写成 Mia is wearing a blue dress.",
  ),
  prerequisites: ["present-continuous", "writing-capitals-and-periods"],
  encompasses: [
    { topic: "present-continuous", weight: 0.3 },
    { topic: "writing-capitals-and-periods", weight: 0.2 },
  ],
  xp: 20,
  strand: "writing",
  knowledgePoints: [
    point(
      "choose",
      t("The sentence for a note", "选出符合笔记的句子"),
      t(
        "A note gives a person and the clothes. The sentence adds *is wearing* (or *am* or *are wearing*), a capital letter and a period.\n\n*Mia / a blue dress* → *Mia is wearing a blue dress.* *Tom and Ben / black shoes* → *Tom and Ben are wearing black shoes.*",
        "笔记给出一个人和他穿的衣服。写成句子时加上 *is wearing*（或 *am*、*are wearing*），句首大写，句末加句号。\n\n*Mia / a blue dress* → *Mia is wearing a blue dress.* *Tom and Ben / black shoes* → *Tom and Ben are wearing black shoes.*\n\n注意：中文“穿”和“戴”分开说，英语帽子、鞋、衣服都用 *wear*。",
      ),
      choiceGenerator(t("Choose the sentence that matches the note.", "选出与笔记相符的句子。"), wearChoiceBank, (right) =>
        t(right, `${right}（谁 + am/is/are wearing + 衣服）`),
      ),
    ),
    point(
      "write",
      t("Writing the sentence", "写出句子"),
      t("Write a whole sentence for the note, with a capital letter and a period.", "根据笔记写一个完整的句子，句首大写，句末加句号。"),
      typedGenerator("sentence-pattern", t("Write a sentence from the note.", "根据笔记写一个句子。"), wearTypedBank, (right) =>
        t(right, `${right}（谁 + am/is/are wearing + 衣服）`),
      ),
    ),
  ],
};

/** topics are the topics of the unit Clothes and Shopping. */
export const topics: readonly TopicDef[] = [
  clothes.topic,
  shopping.topic,
  atTheShop.topic,
  presentContinuous,
  howMuchAndHowMany,
  whatPeopleAreWearing,
];

/** vocabulary are the words the unit Clothes and Shopping teaches. */
export const vocabulary: readonly WordBatch[] = [clothes.batch, shopping.batch, atTheShop.batch];
