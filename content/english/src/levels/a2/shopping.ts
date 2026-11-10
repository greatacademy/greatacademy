// A2, unit 9: Shopping and Money. Money, shops, things we buy and what they are made of; too and enough, one and ones;
// a message to a shop judged by a model.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { interleave, pairUp, vocabularyTopic, word } from "../words.ts";
import { fill, judgedTopic } from "./kit.ts";

const money = vocabularyTopic({
  id: "a2-words-money",
  title: t("Money", "钱"),
  summary: t(
    "Cash, coins, cents and credit cards; change and wallets; saving and lending; rich and poor; what things cost; thousands.",
    "现金、硬币、分和信用卡；找零和钱包；存钱和借出；富有和贫穷；东西的价格；千。",
  ),
  prerequisites: ["a1-words-shopping"],
  words: [
    word(
      "cash",
      "money in coins and paper notes",
      "现金",
      "Do you want to pay by card or in {cash}?|wallet cent | This small shop only takes {cash}, not cards.|wallets thousands | I don't have any {cash} on me. Can I pay with my phone?|wallets thousand",
      "credit wallet",
    ),
    word(
      "coin coins",
      "a small round piece of metal money",
      "硬币",
      "I found a one-yuan {coin} under the sofa.|wallet cash | My grandpa collects old {coins} from different countries.|wallets credits | Put a {coin} in the machine and press the button.|wallet thousand",
      "cash wallet",
    ),
    word(
      "credit",
      "a way of buying something now and paying for it later",
      "信用；赊账",
      "Can I pay by {credit} card?|cent wallet | They bought the car on {credit} and paid for it over three years.|cash change | My {credit} card is in my wallet.|change cent",
      "cash change",
    ),
    word(
      "change changes changed changing",
      "the money you get back when you pay more than the price; to make or become different",
      "零钱；找零；改变",
      "Here's your {change}: two yuan.|credit wallet | The town has {changed} a lot in ten years.|saved lent | Can I {change} this shirt for a bigger one?|lend cost",
      "cash save",
    ),
    word(
      "cent cents",
      "a small coin; there are a hundred cents in a dollar or a euro",
      "分（货币单位）",
      "This pen costs ninety-nine {cents}.|wallets thousands | There are a hundred {cents} in a dollar.|wallets thousands | The apples are fifty {cents} each.|wallets credits",
      "coin wallet",
    ),
    word(
      "wallet wallets",
      "a small flat case for money and cards",
      "钱包",
      "I keep my money and my cards in my {wallet}.|cent credit | Oh no, I've lost my {wallet}!|cent thousand | He took a twenty-yuan note out of his {wallet}.|cent credit",
      "coin cash",
    ),
    word(
      "save saves saved saving",
      "to keep money to use later; to spend less; to keep someone from danger",
      "存钱；节省；救",
      "I'm {saving} money for a new bike.|costing richer | If you take the bus, you'll {save} ten yuan.|lend cost | The firefighter {saved} the boy from the river.|lent cost",
      "lend cost",
    ),
    word(
      "lend lends lent lending",
      "to give something to someone for a short time",
      "借出；借给",
      "Can you {lend} me ten yuan? I'll pay you back tomorrow.|borrow cost | My brother {lent} me his bike for the weekend.|borrowed saved | I never {lend} my books to people who lose things.|save cost",
      "borrow save",
    ),
    word(
      "rich richer richest",
      "having a lot of money",
      "富有的",
      "He was {rich}, so he bought a big house by the sea.|poor thin | Bill is the {richest} man in our town. He has five cars.|poorest richer | Ten years ago they had nothing, but now they are {rich}.|poor cheap",
      "poor expensive",
    ),
    word(
      "poor poorer poorest",
      "having very little money",
      "贫穷的",
      "His family was very {poor}, so he couldn't go to school.|rich expensive | We should give food to {poor} families in our city.|cheap thousand | She grew up in a {poor} village with no electricity.|rich expensive",
      "rich cheap",
    ),
    word(
      "cost costs costing",
      "to have a price; the money you need to pay for something",
      "花费；价格",
      "How much does this jacket {cost}?|save lend | The tickets {cost} two hundred yuan each.|lent changed | The {cost} of food is going up.|wallet saving",
      "save lend",
    ),
    word(
      "thousand thousands",
      "the number 1,000",
      "千",
      "A new laptop costs about five {thousand} yuan.|thousands hundreds | {Thousands} of people came to see the parade.|Thousand Cents | There are a {thousand} meters in a kilometer.|hundred cent",
      "hundred million",
    ),
  ],
});

const shops = vocabularyTopic({
  id: "a2-words-shops",
  title: t("Shops", "商店"),
  summary: t(
    "Supermarkets, malls and bookstores; customers and cashiers; receipts, discounts, sales and bargains; choices, choosing, ordering and delivering.",
    "超市、商场和书店；顾客和收银员；小票、折扣、促销和便宜货；选择、挑选、订购和送货。",
  ),
  prerequisites: ["a2-words-money"],
  words: [
    word(
      "supermarket supermarkets",
      "a big shop that sells food and things for the home",
      "超市",
      "We buy milk, bread and fruit at the {supermarket}.|bookstore receipt | The {supermarket} near our flat is open until ten at night.|receipt bargain | Mom pushed the cart around the {supermarket}.|receipt discount",
      "bookstore receipt",
    ),
    word(
      "mall malls",
      "a big building with many shops inside",
      "商场；购物中心",
      "There's a cinema on the top floor of the {mall}.|receipt customer | Let's meet at the {mall} and go shopping.|receipt cashier | The new {mall} has more than two hundred shops.|bookstore receipt",
      "receipt cashier",
    ),
    word(
      "bookstore bookstores",
      "a shop that sells books",
      "书店",
      "I bought this dictionary at the {bookstore}.|receipt cashier | The {bookstore} has a quiet corner where you can read.|receipt discount | She works in a {bookstore}, so she reads a lot of new novels.|receipt bargain",
      "receipt cashier",
    ),
    word(
      "customer customers",
      "a person who buys things in a shop",
      "顾客",
      "The shop was full of {customers} on Saturday.|receipts discounts | The cashier smiled at the {customer}.|receipt bargain | Our {customers} can return things within seven days.|receipts bargains",
      "cashier receipt",
    ),
    word(
      "cashier cashiers",
      "a person who takes the money in a shop",
      "收银员",
      "Pay the {cashier} at the front of the shop.|customer receipt | The {cashier} gave me my change and a receipt.|customer bargain | My cousin works as a {cashier} at the supermarket.|receipt bargain",
      "customer receipt",
    ),
    word(
      "receipt receipts",
      "a piece of paper that shows what you paid",
      "收据；小票",
      "Keep the {receipt} if you want to return it.|bargain cashier | The {receipt} shows that I paid 45 yuan.|bargain customer | Can I have a {receipt} for the taxi, please?|customer mall",
      "bargain discount",
    ),
    word(
      "discount discounts",
      "an amount of money taken off a price",
      "折扣",
      "Students get a 10% {discount} at the cinema.|receipt bargain | Can you give me a {discount} if I buy two?|receipt cashier | There are big {discounts} on winter coats this week.|receipts cashiers",
      "receipt bargain",
    ),
    word(
      "sale sales",
      "a time when a shop sells things for less; the selling of something",
      "促销；出售",
      "I bought these boots in the {sale}. They were half price.|receipt customer | The house next to ours is for {sale}.|discount receipt | The summer {sales} start next week.|receipts customers",
      "receipt bargain",
    ),
    word(
      "bargain bargains",
      "something you buy for less than its usual price",
      "便宜货；划算的东西",
      "Only 20 yuan for this jacket? It's a {bargain}!|receipt cashier | You can find {bargains} at the night market.|receipts cashiers | This bike was a real {bargain}.|receipt customer",
      "receipt discount",
    ),
    word(
      "choose chooses chose chosen choosing",
      "to decide which one you want",
      "选择；挑选",
      "I can't {choose} between the red dress and the blue one.|order deliver | She {chose} the cheapest phone because she didn't have much money.|delivered lent | Have you {chosen} a present for Dad yet?|delivered lent",
      "order deliver",
    ),
    word(
      "order orders ordered ordering",
      "to ask for food in a restaurant, or for goods to be sent to you",
      "点（菜）；订购",
      "Are you ready to {order}? — Yes, I'll have the noodles.|deliver lend | I {ordered} a new phone online last week.|delivered lent | Your {order} will arrive on Friday.|bargain receipt",
      "choose deliver",
    ),
    word(
      "deliver delivers delivered delivering",
      "to take goods or letters to a person's home",
      "递送；送货",
      "The shop will {deliver} the sofa on Monday.|cost choose | A man on a motorbike {delivers} our pizza.|costs chooses | The postman {delivered} a big box this morning.|chose lent",
      "order choose",
    ),
    word(
      "choice choices",
      "the act of choosing, or the things you can choose from",
      "选择",
      "You have a {choice} of tea or coffee.|receipt cashier | It was a difficult {choice}, but I chose the red dress.|receipt customer | We had no {choice}. The last bus had left.|receipt cashier | The shop has lots of {choices} for lunch.|receipts cashiers",
      "choose voice",
    ),
  ],
});

const thingsWeBuy = vocabularyTopic({
  id: "a2-words-things-we-buy",
  title: t("Things We Buy", "我们买的东西"),
  summary: t(
    "Rings and necklaces; gloves, scarves, boots and belts; sunglasses, uniforms, jeans and sweaters; pockets.",
    "戒指和项链；手套、围巾、靴子和腰带；太阳镜、制服、牛仔裤和毛衣；口袋。",
  ),
  prerequisites: ["a2-words-shops"],
  words: [
    word(
      "ring rings",
      "a round piece of jewelry that you wear on your finger",
      "戒指",
      "He gave her a gold {ring} when they got married.|scarf jeans | She wears a {ring} on her finger.|belt necklace | I lost my {ring} while I was washing my hands.|boot jeans",
      "necklace belt",
    ),
    word(
      "necklace necklaces",
      "jewelry that you wear around your neck",
      "项链",
      "She wore a silver {necklace} around her neck.|glove belt | This {necklace} is made of small white stones.|glove sweater | Grandma gave me her old pearl {necklace}.|glove boot",
      "ring scarf",
    ),
    word(
      "glove gloves",
      "a thing you wear on your hand to keep it warm",
      "手套",
      "It's cold. Put on your {gloves}.|rings belts | I can't type with my {gloves} on.|scarves belts | I lost one {glove} on the bus.|sunglasses jeans",
      "ring sock",
    ),
    word(
      "scarf scarves",
      "a long piece of cloth that you wear around your neck",
      "围巾",
      "Wear a warm {scarf} around your neck.|belt ring | My aunt knitted me a wool {scarf}.|ring boot | She has lots of colorful {scarves}.|belt necklace",
      "belt glove",
    ),
    word(
      "boot boots",
      "a shoe that covers your foot and part of your leg",
      "靴子",
      "Wear your {boots}. It's muddy outside.|gloves scarves | These leather {boots} keep my feet warm.|gloves rings | She bought a pair of black {boots}.|scarf ring",
      "glove sock",
    ),
    word(
      "belt belts",
      "a long thin piece of leather or cloth that you wear around your middle",
      "腰带",
      "These jeans are too big. I need a {belt}.|ring necklace | He wears a brown leather {belt} with his jeans.|ring sunglasses | Fasten your seat {belt}, please.|scarf ring",
      "scarf ring",
    ),
    word(
      "sunglasses",
      "dark glasses that keep the sun out of your eyes",
      "太阳镜；墨镜",
      "It's very bright. Put on your {sunglasses} to protect your eyes.|gloves boots | He was wearing {sunglasses}, so I couldn't see his eyes.|gloves jeans | I sat on my {sunglasses} and broke them.|uniform scarf",
      "gloves jeans",
    ),
    word(
      "uniform uniforms",
      "special clothes that people wear at school or at work",
      "制服；校服",
      "At our school, all students wear a {uniform}.|necklace pocket | Police officers wear a blue {uniform}.|pocket ring | Our school {uniform} is a white shirt and black trousers.|pocket belt",
      "pocket sweater",
    ),
    word(
      "jeans",
      "trousers made of strong blue cotton",
      "牛仔裤",
      "I usually wear {jeans} and a T-shirt.|pocket ring | These {jeans} are too long for me.|pocket belt | My blue {jeans} have a hole in the knee.|sweater scarf",
      "sweater belt",
    ),
    word(
      "sweater sweaters",
      "a warm piece of clothing with long arms, often made of wool",
      "毛衣",
      "Put on a {sweater}. It's cold.|ring pocket | Grandma knitted me a red {sweater}.|ring pocket | This wool {sweater} keeps me warm in winter.|ring necklace",
      "scarf jeans",
    ),
    word(
      "pocket pockets",
      "a small bag sewn into clothes for keeping things in",
      "口袋；衣兜",
      "I put my keys in my {pocket}.|ring belt | This jacket has four {pockets}.|rings necklaces | There's a hole in my {pocket}, so I lost my coins.|belt scarf",
      "belt wallet",
    ),
  ],
});

const materials = vocabularyTopic({
  id: "a2-words-materials",
  title: t("Materials", "材料"),
  summary: t(
    "Cotton, wool and leather; plastic, metal, gold and silver; wooden things; heavy, thick and thin.",
    "棉、羊毛和皮革；塑料、金属、金和银；木制的东西；重、厚和薄。",
  ),
  prerequisites: ["a2-words-things-we-buy"],
  words: [
    word(
      "cotton",
      "a soft cloth made from a plant",
      "棉；棉布",
      "This T-shirt is made of {cotton}.|metal wooden | {Cotton} shirts are cool in summer.|Metal Wooden | {Cotton} grows on a plant in hot places.|Leather Plastic",
      "wool leather",
    ),
    word(
      "wool",
      "the soft hair of sheep, made into cloth",
      "羊毛",
      "A {wool} sweater is very warm.|plastic metal | Sheep give us {wool}.|cotton plastic | Grandma knits hats from {wool}.|metal leather",
      "cotton leather",
    ),
    word(
      "leather",
      "the skin of an animal made into a material for shoes and bags",
      "皮革",
      "These shoes are made of {leather}.|wool silver | {Leather} comes from the skin of cows.|Cotton Plastic | He has a brown {leather} jacket.|wooden metal",
      "wool cotton",
    ),
    word(
      "plastic",
      "a light material made in factories, used for bottles and bags",
      "塑料",
      "Water bottles are usually made of {plastic}.|wool leather | Bring your own bag. {Plastic} bags are bad for the ocean.|Wool Wooden | The toy is {plastic}, so it won't break if you drop it.|glass thin",
      "metal wooden",
    ),
    word(
      "metal metals",
      "a hard material such as iron, gold or silver",
      "金属",
      "The gate is made of {metal}, so it is very strong.|cotton wool | Gold and silver are {metals}.|cottons plastics | {Metal} gets hot quickly in the sun.|Wool Cotton",
      "plastic wooden",
    ),
    word(
      "gold",
      "a yellow metal that costs a lot of money",
      "金子；金色的",
      "Her ring is made of {gold}.|cotton wool | The winner gets a {gold} medal.|cotton thick | {Gold} costs much more than plastic.|Wool Cotton",
      "silver metal",
    ),
    word(
      "silver",
      "a shiny white-gray metal",
      "银；银色的",
      "She won a {silver} medal for coming second.|gold plastic | Grandma's {silver} necklace is very old.|thick wool | Some forks and spoons are made of {silver}.|cotton wool",
      "gold metal",
    ),
    word(
      "wooden",
      "made of wood",
      "木制的",
      "We sat at a big {wooden} table.|wool cotton | The {wooden} house was built by my grandfather.|wool leather | The children played with {wooden} blocks.|wool cotton",
      "wool metal",
    ),
    word(
      "material materials",
      "what something is made of; cloth",
      "材料；布料",
      "What {material} is this coat made of? — Wool.|metal gold | Plastic is a cheap {material}.|wooden cotton | You need paper, glue and other {materials} for this project.|golds woodens",
      "metal cotton",
    ),
    word(
      "heavy heavier heaviest",
      "weighing a lot; hard to lift",
      "重的",
      "This box is too {heavy} for me to carry.|thin poor | Metal is {heavier} than plastic.|thinner poorer | The elephant is the {heaviest} animal on land.|thinnest poorest",
      "thick thin",
    ),
    word(
      "thick thicker thickest",
      "big from one side to the other; not thin",
      "厚的",
      "This book is very {thick}. It has 800 pages.|thin poor | In winter I wear a {thick} wool sweater.|poor rich | The walls of the castle are two meters {thick}.|heavy rich",
      "thin heavy",
    ),
    word(
      "thin thinner thinnest",
      "not thick; not fat",
      "薄的；瘦的",
      "This paper is so {thin} that you can see through it.|thick heavy | He's very {thin} because he doesn't eat much.|thick rich | Cut the bread into {thin} slices.|rich poor",
      "thick heavy",
    ),
  ],
});

// Too and enough.

/** sizeItems are a sentence with a gap and its adjective, and whether the sentence needs too, enough or not enough. */
const sizeItems: readonly (readonly [string, string, "too" | "enough"])[] = [
  ["I can't wear these shoes. They're ___.", "small", "too"],
  ["I can't carry this box. It's ___.", "heavy", "too"],
  ["Don't drink the tea yet. It's ___.", "hot", "too"],
  ["I can't buy this phone. It's ___.", "expensive", "too"],
  ["We can't walk there. It's ___.", "far", "too"],
  ["These jeans are ___. I need a belt.", "big", "too"],
  ["The soup is ___. I can't eat it.", "salty", "too"],
  ["My little brother can't ride this bike. He's ___.", "young", "too"],
  ["Turn the music down! It's ___.", "loud", "too"],
  ["I didn't buy the scarf. It was ___.", "short", "too"],
  ["We can't swim today. The water is ___.", "cold", "too"],
  ["I couldn't sleep last night. My room was ___.", "noisy", "too"],
  ["This coat is ___. I can't move my arms.", "tight", "too"],
  ["I can't read this. The writing is ___.", "small", "too"],
  ["The bus was ___, so we couldn't get on.", "full", "too"],
  ["He can't play basketball today. He's ___.", "tired", "too"],
  ["Good news! The room is ___ for all of us.", "big", "enough"],
  ["You can take this bag on the plane. It's ___.", "small", "enough"],
  ["The water is ___ to swim in, so let's go in.", "warm", "enough"],
  ["She's only five, but she's ___ to ride a bike.", "old", "enough"],
  ["The ice is ___ to walk on, so we can cross the lake.", "thick", "enough"],
  ["This phone was ___ for me to buy with my own money.", "cheap", "enough"],
  ["Are you ___ to carry that heavy box?", "strong", "enough"],
  ["He ran ___ to catch the bus.", "fast", "enough"],
  ["I can't reach the top shelf. I'm not ___.", "tall", "enough"],
  ["I can't wear this sweater in winter. It isn't ___.", "warm", "enough"],
  ["We didn't win the race. We weren't ___.", "fast", "enough"],
  ["Don't go out in that jacket. It isn't ___.", "thick", "enough"],
  ["I can't buy a car. I'm not ___.", "rich", "enough"],
  ["My suitcase isn't ___ for all these clothes.", "big", "enough"],
  ["The tea isn't ___. Can I have some sugar?", "sweet", "enough"],
  ["He didn't pass the test. He wasn't ___.", "careful", "enough"],
  ["The rope wasn't ___, so it broke.", "strong", "enough"],
  ["My room is ___ for a desk and a bed, so I'm happy with it.", "big", "enough"],
  ["This box isn't ___ to hold all the books.", "strong", "enough"],
];

const sizeChoiceBank: readonly ChoiceItem[] = sizeItems.map(([shown, adjective, word]): ChoiceItem => {
  const right = word === "too" ? `too ${adjective}` : `${adjective} enough`;
  const wrong = word === "too" ? [`${adjective} enough`, `enough ${adjective}`] : [`too ${adjective}`, `enough ${adjective}`];
  return [`${shown} (${adjective})`, right, wrong];
});

/** tooThings are a thing, its form of be and its negative. */
const tooThings: readonly (readonly [string, string, string])[] = [
  ["The jacket", "is", "isn't"],
  ["These boots", "are", "aren't"],
  ["My bag", "is", "isn't"],
  ["The table", "is", "isn't"],
  ["The gloves", "are", "aren't"],
  ["This box", "is", "isn't"],
  ["The sweater", "is", "isn't"],
];
const tooAdjectives: readonly string[] = ["small", "big", "long", "heavy", "thin", "thick"];

const tooTypedBank: readonly TypedItem[] = pairUp(42, tooThings, tooAdjectives).map(([[thing, be, not], adjective], k): TypedItem => {
  if (k % 2 === 0)
    return {
      shown: `${thing} / ${adjective} / too`,
      accepted: [`${thing} ${be} too ${adjective}.`],
      wrong: [`${thing} ${be} ${adjective} enough.`, `${thing} too ${adjective}.`],
    };
  const full = `${be} not`;
  return {
    shown: `${thing} / ${adjective} / not enough`,
    accepted: [`${thing} [${not}|${full}] ${adjective} enough.`],
    canonical: `${thing} ${not} ${adjective} enough.`,
    wrong: [`${thing} ${not} enough ${adjective}.`, `${thing} ${be} ${adjective} enough.`],
  };
});

/** amountItems are a sentence with a gap, the right words and the wrong ones, for too much, too many and enough with nouns. */
const amountItems: readonly ChoiceItem[] = [
  ["I can't get on the bus. There are ___ people.", "too many", ["too much", "very much"]],
  ["Don't put ___ sugar in my tea. I don't like it very sweet.", "too much", ["too many", "very many"]],
  ["We don't have ___ to buy a car.", "enough money", ["money enough", "too many money"]],
  ["There are ___ cars in the city center. The air is bad.", "too many", ["too much", "very much"]],
  ["You spend ___ time on your phone. Go outside!", "too much", ["too many", "very many"]],
  ["Are there ___ for everyone?", "enough chairs", ["chairs enough", "too much chairs"]],
  ["I can't finish my homework. I have ___ things to do.", "too many", ["too much", "very much"]],
  ["The soup is very salty. You put ___ salt in it.", "too much", ["too many", "very many"]],
  ["We didn't have ___, so we missed the train.", "enough time", ["time enough", "too many time"]],
  ["This shop has ___ shoes. I can't choose!", "too many", ["too much", "very much"]],
  ["Please turn it down. There's ___ noise.", "too much", ["too many", "very many"]],
  ["Is there ___ for ten people?", "enough food", ["food enough", "too many food"]],
  ["She bought ___ clothes in the sale. Now she has no money.", "too many", ["too much", "very much"]],
  ["Don't eat ___ chocolate. It's bad for your teeth.", "too much", ["too many", "very many"]],
  ["I can't make a cake. I don't have ___.", "enough eggs", ["eggs enough", "too much eggs"]],
  ["There were ___ customers in the shop, so we left.", "too many", ["too much", "very much"]],
  ["He drinks ___ coffee. He can't sleep at night.", "too much", ["too many", "very many"]],
  ["Do we have ___ for the picnic?", "enough bread", ["bread enough", "too many bread"]],
  ["I made ___ mistakes in the test. I'm not happy.", "too many", ["too much", "very much"]],
  ["You use ___ water in the shower. Please be quick.", "too much", ["too many", "very many"]],
  ["The plants are dying. They don't get ___.", "enough light", ["light enough", "too many light"]],
  ["There are ___ apps on my phone. It's very slow.", "too many", ["too much", "very much"]],
  ["Don't take ___ luggage. The bags are heavy.", "too much", ["too many", "very many"]],
  ["Have you got ___ to pay for the taxi?", "enough cash", ["cash enough", "too many cash"]],
  ["She has ___ friends to invite. Her flat is too small.", "too many", ["too much", "very much"]],
  ["There's ___ traffic. Let's take the subway.", "too much", ["too many", "very many"]],
  ["We need ___ to carry all the shopping.", "enough bags", ["bags enough", "too much bags"]],
  ["I ate ___ dumplings. Now I feel sick.", "too many", ["too much", "very much"]],
  ["Don't spend ___ money on clothes. Save some!", "too much", ["too many", "very many"]],
  ["There aren't ___ for all the students.", "enough books", ["books enough", "too much books"]],
  ["There were ___ tourists at the castle. We couldn't see anything.", "too many", ["too much", "very much"]],
  ["There's ___ milk in this coffee. It's almost white.", "too much", ["too many", "very many"]],
  ["Do you have ___ to buy lunch?", "enough coins", ["coins enough", "too much coins"]],
  ["He gets ___ messages. He can't answer them all.", "too many", ["too much", "very much"]],
];

const tooAndEnough: TopicDef = {
  id: "too-and-enough",
  title: t("Too and Enough", "too 和 enough"),
  summary: t(
    "It's too big. It isn't big enough. We don't have enough money. Too goes before an adjective, enough after it and before a noun.",
    "It's too big. It isn't big enough. We don't have enough money. too 放在形容词前面，enough 放在形容词后面、名词前面。",
  ),
  prerequisites: ["adjectives-before-nouns", "a2-words-quantities"],
  encompasses: [
    { topic: "adjectives-before-nouns", weight: 0.2 },
    { topic: "a2-words-quantities", weight: 0.2 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "too-or-enough",
      t("Too big or big enough", "too big 还是 big enough"),
      t(
        "*too* means *more than you want*: it is a problem. It goes **before** the adjective: *These shoes are too small. I can't wear them.*\n\n*enough* means *as much as you need*. It goes **after** the adjective: *The room is big enough for all of us. I'm not tall enough.*\n\nNot *enough big*.",
        "*too* 的意思是“太……”，超过了需要，是个问题。它放在形容词**前面**：*These shoes are too small. I can't wear them.*\n\n*enough* 的意思是“足够”，正好满足需要。它放在形容词**后面**：*The room is big enough for all of us. I'm not tall enough.*\n\n中文说“足够大”，英语却说 *big enough*，不说 *enough big*。另外，*too* 不是“很”：*It's very hot* 只是很热，*It's too hot* 是热得受不了。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), sizeChoiceBank, (right, shown) =>
        t(
          fill(shown, right),
          `${fill(shown, right)}（${right.startsWith("too") ? "太……，有问题：too + 形容词" : "足够：形容词 + enough"}）`,
        ),
      ),
    ),
    point(
      "write",
      t("Writing with too and enough", "用 too 和 enough 写句子"),
      t(
        "Write the sentence from the note. *too* goes before the adjective: *The jacket is too small.* *not ... enough* puts *not* after *is* or *are* and *enough* after the adjective: *The bag isn't big enough.*",
        "根据笔记写句子。*too* 放在形容词前面：*The jacket is too small.* *not ... enough* 把 *not* 放在 *is / are* 后面，*enough* 放在形容词后面：*The bag isn't big enough.*",
      ),
      typedGenerator("sentence-pattern", t("Write a sentence from the note.", "根据笔记写一个句子。"), tooTypedBank, (right) =>
        t(right, `${right}（too + 形容词；形容词 + enough）`),
      ),
    ),
    point(
      "nouns",
      t("Too much, too many and enough with nouns", "too much、too many 和 enough 加名词"),
      t(
        "With nouns, use *too many* for things you can count and *too much* for things you cannot count:\n\n- *There are too many cars.*\n- *There is too much traffic.*\n\n*enough* goes **before** a noun: *We don't have enough money*, not *money enough*.",
        "和名词连用时，可数名词用 *too many*，不可数名词用 *too much*：\n\n- *There are too many cars.*\n- *There is too much traffic.*\n\n*enough* 放在名词**前面**：说 *We don't have enough money*，不说 *money enough*。注意：*enough* 在形容词后面，却在名词前面。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), amountItems, (right, shown) =>
        t(
          fill(shown, right),
          `${fill(shown, right)}（${right === "too many" ? "可数名词用 too many" : right === "too much" ? "不可数名词用 too much" : "enough 放在名词前面"}）`,
        ),
      ),
    ),
  ],
};

// One and ones.

/** oneNouns are a noun, its plural, and two adjectives that tell one kind from another. */
const oneNouns: readonly (readonly [string, string, string, string])[] = [
  ["bag", "bags", "black", "brown"],
  ["jacket", "jackets", "cheap", "expensive"],
  ["scarf", "scarves", "wool", "cotton"],
  ["phone", "phones", "old", "new"],
  ["cake", "cakes", "chocolate", "lemon"],
  ["ring", "rings", "gold", "silver"],
  ["sweater", "sweaters", "red", "blue"],
  ["box", "boxes", "big", "small"],
  ["table", "tables", "wooden", "metal"],
  ["umbrella", "umbrellas", "long", "short"],
  ["shirt", "shirts", "white", "green"],
];

const oneFrames: readonly ((n: readonly [string, string, string, string]) => ChoiceItem)[] = [
  ([noun, , a, b]) => [`I don't like the ${a} ${noun}. I like the ${b} ___.`, "one", ["ones", "it"]],
  ([, nouns, a, b]) => [`I don't like the ${a} ${nouns}. I like the ${b} ___.`, "ones", ["one", "them"]],
  ([noun, , , b]) => [`Which ${noun} do you want? — The ${b} ___, please.`, "one", ["ones", "it"]],
  ([, nouns, a]) => [`These ${nouns} are nice, but I prefer the ${a} ___.`, "ones", ["one", "them"]],
];

const oneChoiceBank: readonly ChoiceItem[] = interleave(oneFrames.map((frame) => oneNouns.map(frame)));

const an = (next: string) => (/^[aeiou]/u.test(next) ? "an" : "a");

const oneTypedBank: readonly TypedItem[] = interleave([
  oneNouns.map(
    ([noun, , a, b]): TypedItem => ({
      shown: `This ${a} ${noun} isn't right for me. Can I see the ${b} ${noun}?`,
      accepted: [`Can I see the ${b} one?`],
      wrong: [`Can I see the ${b} ones?`, `Can I see the ${b}?`],
    }),
  ),
  oneNouns.map(
    ([, nouns, a, b]): TypedItem => ({
      shown: `I don't want the ${a} ${nouns}. I want the ${b} ${nouns}.`,
      accepted: [`I want the ${b} ones.`],
      wrong: [`I want the ${b} one.`, `I want the ${b} them.`],
    }),
  ),
  oneNouns.map(
    ([noun, , a, b]): TypedItem => ({
      shown: `Your ${a} ${noun} is nice. I'd like ${an(b)} ${b} ${noun} too.`,
      accepted: [`I'd like ${an(b)} ${b} one too.`],
      wrong: [`I'd like ${an(b)} ${b} too.`, `I'd like ${an(b)} ${b} it too.`],
    }),
  ),
  oneNouns.map(
    ([, nouns, a]): TypedItem => ({
      shown: `Do you have any ${a} ${nouns}? I like ${a} ${nouns}.`,
      accepted: [`I like ${a} ones.`],
      wrong: [`I like ${a} one.`, `I like ${a} them.`],
    }),
  ),
]);

const oneAndOnes: TopicDef = {
  id: "one-and-ones",
  title: t("This One and the Red Ones", "this one 和 the red ones"),
  summary: t(
    "I like the blue one. These ones are cheaper. One stands for a noun already said, so you do not say it again.",
    "I like the blue one. These ones are cheaper. one 代替前面说过的名词，避免重复。",
  ),
  prerequisites: ["too-and-enough"],
  encompasses: [
    { topic: "adjectives-before-nouns", weight: 0.3 },
    { topic: "too-and-enough", weight: 0.1 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "one-or-ones",
      t("One or ones", "one 还是 ones"),
      t(
        "When you have already said a noun, you can use *one* instead of saying it again: *I don't like the black bag. I like the brown one.* (*one* = *bag*)\n\nFor more than one, use *ones*: *I don't like the black shoes. I like the brown ones.*\n\nAfter an adjective, use *one* or *ones*, not *it* or *them*: not *the brown it*.",
        "前面已经说过的名词，可以用 *one* 代替，不再重复：*I don't like the black bag. I like the brown one.*（*one* = *bag*）\n\n复数用 *ones*：*I don't like the black shoes. I like the brown ones.*\n\n形容词后面要用 *one / ones*，不能用 *it / them*：不说 *the brown it*。中文说“我喜欢棕色的”，英语不能只说 *the brown*，要加 *one*。",
      ),
      choiceGenerator(t("Choose the word for the gap.", "选出填入空白处的词。"), oneChoiceBank, (right, shown) =>
        t(fill(shown, right), `${fill(shown, right)}（${right === "one" ? "代替单数名词用 one" : "代替复数名词用 ones"}）`),
      ),
    ),
    point(
      "write",
      t("Saying it with one", "用 one 来说"),
      t(
        "Write the second sentence again without saying the noun twice: use *one* for one thing and *ones* for more than one. *I need a new bag.* → *I need a new one.*",
        "把第二句重写一遍，不要重复名词：一个东西用 *one*，多个用 *ones*。*I need a new bag.* → *I need a new one.*",
      ),
      typedGenerator(
        "sentence",
        t("Write the second sentence again with one or ones.", "用 one 或 ones 重写第二句。"),
        oneTypedBank,
        (right) => t(right, `${right}（用 one / ones 代替前面说过的名词）`),
      ),
    ),
  ],
};

/** ones is the plural of the pronoun one, which one-and-ones teaches. */
const ones: WordBatch = { topic: "one-and-ones", words: ["ones"] };

// A message to a shop.

const shopBank: readonly WritingItem[] = [
  {
    task: "You bought a sweater online, but it is too small. Write to the shop.",
    model:
      "Dear Sir or Madam,\n\nLast week I bought a blue wool sweater on your website. It arrived yesterday, but it is too small for me. I ordered a medium, but I think you sent a small. I would like to change it for a medium, please. Can you tell me how to send it back?\n\nThank you,\nLi Wei",
  },
  {
    task: "You bought a lamp, but it doesn't work. Write to the shop.",
    model:
      "Hello,\n\nOn Saturday I bought a desk lamp at your shop in the mall. When I got home, I tried it, but it doesn't work. The light doesn't come on, and I changed the bulb. I still have the receipt. I would like my money back, please. I can bring the lamp to the shop this weekend.\n\nBest wishes,\nAnna Chen",
  },
  {
    task: "You ordered a pair of boots, but the shop sent the wrong color. Write to the shop.",
    model:
      "Dear Sir or Madam,\n\nI ordered a pair of black leather boots from your website on May 3rd. Today the boots arrived, but they are brown, not black. The size is right, and I like the boots, but I really need black ones for work. Could you send me the black boots, please? I will send the brown ones back.\n\nThank you,\nTom Green",
  },
  {
    task: "You bought a schoolbag, and one of its pockets broke after two days. Write to the shop.",
    model:
      "Hello,\n\nI bought a red schoolbag at your shop last Monday. After two days, the zip on the front pocket broke, and now I can't close it. I only used the bag for school, and I was careful with it. I would like a new bag, please, or my money back. I have the receipt.\n\nThank you,\nZhang Min",
  },
  {
    task: "Your new jeans are too long. Write to the shop to ask for a shorter pair.",
    model:
      "Dear Sir or Madam,\n\nI bought some blue jeans in your sale last week. They were a real bargain, but they are too long for me, and I don't want to cut them. Can I change them for a shorter pair in the same size? I haven't worn them, and I still have the receipt.\n\nBest wishes,\nMaria Lopez",
  },
  {
    task: "You ordered a birthday cake from a bakery, but it didn't arrive. Write to the bakery.",
    model:
      "Hello,\n\nI ordered a chocolate birthday cake from your bakery on Thursday. You said you would deliver it on Saturday at four o'clock, but it didn't arrive. We waited until six, and my daughter's party started without the cake. I was very sad. I would like my money back, please.\n\nThank you,\nSarah Wu",
  },
  {
    task: "A watch you bought has stopped working. Write to the shop.",
    model:
      "Dear Sir or Madam,\n\nThree weeks ago I bought a silver watch at your shop as a present for my father. Yesterday it stopped. I changed the battery, but it still doesn't work. The watch has a one-year guarantee. Can you repair it for me, or give me a new one? I can bring it to the shop on Friday.\n\nThank you,\nKevin Liu",
  },
  {
    task: "The shop charged you twice for one book. Write to the shop.",
    model:
      "Hello,\n\nOn Tuesday I bought a dictionary at your bookstore. It cost 68 yuan. Today I looked at my bank card, and I saw that you took 68 yuan two times. I only bought one book, and the receipt shows one book. Could you give me back the extra money, please?\n\nThank you,\nWang Fang",
  },
  {
    task: "You bought a coat, but it is too thin for winter. Write to the shop to change it.",
    model:
      "Dear Sir or Madam,\n\nLast week I bought a gray coat at your shop. It looked warm, but it is too thin for the winter here. Yesterday I wore it outside, and I was very cold. Do you have a thicker coat in the same size? I would like to change it, please. I have not washed it, and I have the receipt.\n\nBest wishes,\nPeter Zhao",
  },
  {
    task: "You ordered six plates online, but two of them were broken. Write to the shop.",
    model:
      "Hello,\n\nI ordered six white plates from your website, and they arrived this morning. When I opened the box, two of the plates were broken. There wasn't enough paper around them in the box. Could you send me two new plates, please? I have a photo of the broken ones if you need it.\n\nThank you,\nLucy Brown",
  },
  {
    task: "The headphones you bought are not the ones in the picture on the website. Write to the shop.",
    model:
      "Dear Sir or Madam,\n\nI bought some headphones on your website on June 10th. In the picture they were big and black, with a long cable. The ones that arrived are small and white, and they have no cable. They are not the headphones I wanted. I would like to send them back and get my money back, please.\n\nThank you,\nDavid Sun",
  },
  {
    task: "You bought a pair of gloves as a present, but your friend already has the same ones. Write to the shop.",
    model:
      "Hello,\n\nLast Friday I bought some red leather gloves at your shop as a birthday present for my friend. But she already has the same gloves! I haven't used them, and they are still in the box. Can I change them for a scarf of the same price? I have the receipt with me.\n\nThank you very much,\nEmma Lin",
  },
];

const writingAMessageToAShop = judgedTopic({
  id: "writing-a-message-to-a-shop",
  title: t("Writing to a Shop", "给商店写信"),
  summary: t(
    "Write a short message to a shop about something you bought: what it is, what is wrong with it, and what you would like.",
    "给商店写一封短信，说说你买的东西：是什么、有什么问题、你希望怎么处理。",
  ),
  prerequisites: ["writing-a-short-note", "too-and-enough"],
  encompasses: [
    { topic: "writing-a-short-note", weight: 0.3 },
    { topic: "too-and-enough", weight: 0.2 },
  ],
  criteria: ["a2-shop-problem", "a2-shop-request", "a1-reader-and-name", "a1-sentences"],
  point: {
    id: "message",
    title: t("What, what is wrong and what you would like", "买了什么、有什么问题、希望怎么办"),
    explanation: t(
      "A message to a shop is polite and clear:\n\n- Begin with *Dear Sir or Madam* or *Hello*.\n- Say what you bought and when: *Last week I bought a blue sweater on your website.*\n- Say what is wrong: *It is too small. It doesn't work.*\n- Say what you would like: *I would like to change it, please. Could you send me a new one?*\n- End with *Thank you* and your name.",
      "给商店的信要礼貌、清楚：\n\n- 开头写 *Dear Sir or Madam* 或 *Hello*。\n- 说你买了什么、什么时候买的：*Last week I bought a blue sweater on your website.*\n- 说出问题：*It is too small. It doesn't work.*\n- 说出你的要求：*I would like to change it, please. Could you send me a new one?*\n- 结尾写 *Thank you* 和你的名字。\n\n提要求时用 *I would like ...* 或 *Could you ...?*，比 *I want ...* 和 *Give me ...* 礼貌。",
    ),
  },
  question: t(
    "Write a message of five to eight sentences in English to the shop the task names: say what you bought, what is wrong with it, and what you would like.",
    "根据题目用英语给商店写五到八句话：说你买了什么、有什么问题、希望怎么处理。",
  ),
  bank: shopBank,
  limits: { minWords: 40, maxChars: 900 },
  what: t("message", "短信"),
});

/** topics are the topics of the unit Shopping and Money. */
export const topics: readonly TopicDef[] = [
  money.topic,
  shops.topic,
  thingsWeBuy.topic,
  materials.topic,
  tooAndEnough,
  oneAndOnes,
  writingAMessageToAShop,
];

/** vocabulary are the words the unit Shopping and Money teaches. */
export const vocabulary: readonly WordBatch[] = [money.batch, shops.batch, thingsWeBuy.batch, materials.batch, ones];
