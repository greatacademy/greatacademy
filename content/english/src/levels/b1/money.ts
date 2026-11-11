// B1, unit 11: Money and Consumers. Personal finance, consumers, value, giving and sharing, and shopping online;
// gerunds and infinitives; writing a letter of complaint.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { fill, judgedTopic } from "../a2/kit.ts";
import { interleave, vocabularyTopic, word } from "../words.ts";

const finance = vocabularyTopic({
  id: "b1-words-personal-finance",
  title: t("Personal Finance", "个人理财"),
  summary: t(
    "Wages, loans and debts; interest; depositing and withdrawing; affording; expenses, pensions and fees; the economy and financial.",
    "工资、贷款和债务；利息；存钱和取钱；负担得起；开支、养老金和费用；经济和财务的。",
  ),
  prerequisites: ["a2-words-money"],
  words: [
    word(
      "wage wages",
      "the money you get every week or month for your work",
      "工资",
      "He earns a good {wage} as an electrician.|debt loan | The workers asked for higher {wages}.|debts economies | The minimum {wage} went up this year.|debt loan",
      "wake wave",
      "pension",
    ),
    word(
      "loan loans",
      "money that a bank or a person lends you and that you must pay back",
      "贷款；借款",
      "They took out a {loan} to buy a house.|wage pension | She is still paying back her student {loan}.|wage pension | The bank refused to give him a {loan}.|wage pension",
      "lone lawn",
      "debt",
    ),
    word(
      "debt debts",
      "money that you owe to someone",
      "债务；欠款",
      "He is in {debt} because he spent too much on his credit card.|wage pension | It took them ten years to pay off their {debts}.|wages pensions | Try not to get into {debt}.|wage pension",
      "death dent",
      "loan",
    ),
    word(
      "interest interests",
      "extra money that you pay when you borrow money, or that a bank pays you when you save",
      "利息；兴趣",
      "The bank pays three percent {interest} on savings.|wage fee | You have to pay {interest} on the loan.|wage pension | Her {interests} include music and painting.|wages pensions",
      "interested interview",
    ),
    word(
      "deposit deposits deposited depositing",
      "to put money into a bank account; money you pay first, to keep something for you",
      "存入；押金；定金",
      "I {deposited} my wages in the bank.|withdrew afforded | You must pay a {deposit} to rent the flat.|pension wage | She {deposits} a little money every month.|affords economies",
      "depart desert",
    ),
    word(
      "withdraw withdraws withdrew withdrawn withdrawing",
      "to take money out of a bank account",
      "取（钱）；撤回",
      "I {withdrew} 200 dollars from the cash machine.|deposited afforded | You can {withdraw} money at any branch.|afford economy | She has {withdrawn} all her savings.|afforded owed",
      "withhold draw",
    ),
    word(
      "afford affords afforded affording",
      "to have enough money to pay for something",
      "买得起；负担得起",
      "We can't {afford} a new car this year.|withdraw deposit | Can you {afford} to go on holiday?|withdraw deposit | Few young people can {afford} to buy a flat in the city.|withdraw deposit",
      "offer effort",
    ),
    word(
      "expense expenses",
      "money that you spend on something",
      "开支；费用",
      "Food is our biggest {expense}.|economy pension | The company pays my travel {expenses}.|economies pensions | Having a car is a big {expense}.|economy wage",
      "expensive experience",
      "fee",
    ),
    word(
      "pension pensions",
      "money that old people get regularly after they stop working",
      "养老金；退休金",
      "My grandfather lives on his {pension}.|economy fee | She gets a small {pension} from the state.|loan debt | Start saving for your {pension} while you are young.|loan debt",
      "tension mansion",
      "wage",
    ),
    word(
      "fee fees",
      "money you pay to a professional person or for a service",
      "费用；（服务）费",
      "The bank charges a {fee} for sending money abroad.|debt pension | University {fees} have gone up again.|debts pensions | There is no entrance {fee} for children.|debt pension",
      "free fine",
      "expense",
    ),
    word(
      "economy economies",
      "the system by which a country makes and uses money, goods and services",
      "经济",
      "The {economy} is growing fast.|pension financial | Tourism is important to the local {economy}.|expense pension | Many {economies} were hit by the crisis.|pensions fees",
      "ecology economics",
    ),
    word(
      "financial",
      "connected with money",
      "财务的；金融的",
      "The company is in {financial} trouble.|economy debt | She works as a {financial} adviser.|economy debt | London is a big {financial} center.|economy debt",
      "official final",
    ),
  ],
});

const consumers = vocabularyTopic({
  id: "b1-words-consumers",
  title: t("Consumers", "消费者"),
  summary: t(
    "Consumers and purchases; refunds, guarantees and warranties; complaints and faulty goods; quality; advertising and labels; offers.",
    "消费者和购买；退款、保证和保修；投诉和有缺陷的商品；质量；广告和标签；优惠。",
  ),
  prerequisites: ["a2-words-shops"],
  words: [
    word(
      "consumer consumers",
      "a person who buys things or uses services",
      "消费者",
      "{Consumers} are spending less this year.|Labels Warranties | The law protects {consumers} from faulty goods.|labels warranties | China has more than a billion {consumers}.|labels warranties",
      "customer costume",
    ),
    word(
      "purchase purchases purchased purchasing",
      "to buy something; something that you buy",
      "购买；购买的东西",
      "Tickets can be {purchased} online.|labeled faulty | Keep the receipt for your {purchase}.|label quality | A house is the biggest {purchase} most people make.|label warranty",
      "purpose pursue",
    ),
    word(
      "refund refunds",
      "money that is given back to you when you return something",
      "退款",
      "The phone didn't work, so I asked for a {refund}.|label quality | You can get a full {refund} within thirty days.|label consumer | The airline gave us a {refund} for the canceled flight.|label quality",
      "return refuse",
    ),
    word(
      "guarantee guarantees",
      "a promise that something will be done or will happen; a promise to repair a product",
      "保证；保修单",
      "The watch has a two-year {guarantee}.|label complaint | There's no {guarantee} that the weather will be good.|label complaint | We {guarantee} delivery within 24 hours.|label consume",
      "guard grant",
      "warranty",
    ),
    word(
      "warranty warranties",
      "a written promise to repair or replace a product if it breaks",
      "保修；保修单",
      "The laptop is still under {warranty}, so they will fix it for free.|label complaint | The {warranty} lasts for one year.|label complaint | Read the {warranty} before you buy.|label consumer",
      "warning wardrobe",
      "guarantee",
    ),
    word(
      "complaint complaints",
      "a statement that something is wrong or not good enough",
      "投诉；抱怨",
      "I want to make a {complaint} about the service.|warranty label | The hotel received many {complaints} about the noise.|labels warranties | Write your {complaint} in a polite letter.|label warranty",
      "complain compliment",
    ),
    word(
      "faulty",
      "not working properly",
      "有缺陷的；有故障的",
      "I took the {faulty} heater back to the shop.|valuable available | The fire was caused by {faulty} wiring.|valuable available | If the goods are {faulty}, you can get your money back.|valuable available",
      "fatty fault",
    ),
    word(
      "quality qualities",
      "how good or bad something is; a good part of someone's character",
      "质量；品质",
      "These shoes are cheap, but the {quality} is poor.|label refund | We only use high-{quality} fruit.|label refund | Honesty is one of her best {qualities}.|labels refunds",
      "quantity equality",
    ),
    word(
      "advertise advertises advertised advertising",
      "to tell people about a product or a job in newspapers, on TV or online so that they will buy it or apply",
      "做广告；登广告",
      "The new phone is {advertised} everywhere.|refunded labeled | They {advertised} the job online.|refunded guaranteed | Companies spend billions on {advertising}.|refunding labeling",
      "advise adventure",
    ),
    word(
      "label labels",
      "a piece of paper or cloth on a product that gives information about it",
      "标签",
      "Read the {label} to see what's in the food.|refund complaint | The {label} says the shirt should be washed in cold water.|refund complaint | Check the price {label} before you buy.|refund warranty",
      "level table",
    ),
    word(
      "goods",
      "things that are made to be sold",
      "商品；货物",
      "The shop sells electrical {goods}.|refunds complaints | {Goods} are carried across the country by train.|Refunds Complaints | We sell sports {goods} and clothes.|refunds complaints",
      "goodness foods",
    ),
    word(
      "offer offers offered offering",
      "to ask if someone would like something; a cheap price for a short time",
      "提供；主动提出；优惠",
      "The shop has a special {offer} on shoes this week.|warranty refund | She {offered} me a cup of tea.|advertised refunded | They {offered} him the job.|advertised refunded",
      "order often",
    ),
  ],
});

const value = vocabularyTopic({
  id: "b1-words-value",
  title: t("Value", "价值"),
  summary: t(
    "Value, valuable and worth; luxuries; necessary and essential; affordable and reasonable; worthless and priceless; fortune and wealth.",
    "价值、贵重的和值得；奢侈品；必要的和必不可少的；买得起的和合理的；毫无价值的和无价的；财富。",
  ),
  prerequisites: ["b1-words-personal-finance"],
  words: [
    word(
      "value values",
      "how much something is worth; the beliefs that are important to you",
      "价值；价值观",
      "The {value} of the house has doubled.|luxury wealth | This meal is good {value} for money.|luxury wealth | Honesty is one of our family {values}.|luxuries fortunes",
      "valley volume",
      "worth",
    ),
    word(
      "valuable",
      "worth a lot of money, or very useful",
      "贵重的；宝贵的",
      "Keep your {valuable} things in the hotel safe.|worthless wealth | Thank you for your {valuable} advice.|worthless affordable | The ring is very {valuable}.|worthless wealth",
      "variable available",
      "priceless",
    ),
    word(
      "worth",
      "having a certain value; good enough to do",
      "值……钱；值得",
      "This old coin is {worth} a thousand dollars.|value luxury | The museum is {worth} visiting.|valuable necessary | Is it {worth} paying more for a better phone?|valuable reasonable",
      "worse worst",
      "value",
    ),
    word(
      "luxury luxuries",
      "something expensive that you enjoy but do not need",
      "奢侈品；奢华",
      "They stayed in a {luxury} hotel.|wealth worth | A car is a {luxury} for many families.|wealth worth | We can't afford {luxuries} like holidays abroad.|wealths fortunes",
      "lucky flexibility",
    ),
    word(
      "necessary",
      "needed in order to do something",
      "必要的；必需的",
      "Is it {necessary} to book in advance?|valuable worthless | Take only what is {necessary}.|worthless priceless | Don't spend more than {necessary}.|worthless valuable",
      "necklace unnecessary",
      "essential",
    ),
    word(
      "essential",
      "completely necessary; very important",
      "必不可少的；极其重要的",
      "Water is {essential} for life.|worthless priceless | Warm clothes are {essential} in winter.|worthless priceless | It's {essential} to keep your password secret.|worthless priceless",
      "eventual potential",
      "necessary",
    ),
    word(
      "affordable",
      "cheap enough for most people to buy",
      "买得起的；价格合理的",
      "The city needs more {affordable} housing.|worthless priceless | They sell good clothes at {affordable} prices.|worthless priceless | Phones are now {affordable} for almost everyone.|priceless worthless",
      "available comfortable",
      "reasonable",
    ),
    word(
      "reasonable",
      "fair and sensible; not too expensive",
      "合理的；公道的",
      "The food is good and the prices are {reasonable}.|priceless worthless | That sounds like a {reasonable} idea.|priceless worthless | Be {reasonable}! You can't finish all that work today.|Priceless Worthless",
      "seasonal reliable",
      "affordable",
    ),
    word(
      "worthless",
      "having no value",
      "毫无价值的",
      "The painting turned out to be {worthless}.|essential necessary | The old money became {worthless}.|essential affordable | Without batteries, the toy is {worthless}.|essential affordable",
      "worthy wireless",
      "priceless",
    ),
    word(
      "priceless",
      "so valuable that its value cannot be measured",
      "无价的；极其宝贵的",
      "The museum has a {priceless} collection of old vases.|essential affordable | Her friendship is {priceless} to me.|affordable reasonable | These family photos are {priceless}.|affordable reasonable",
      "pricey cheap",
      "valuable worthless",
    ),
    word(
      "fortune fortunes",
      "a very large amount of money; luck",
      "一大笔钱；运气",
      "He made a {fortune} selling phones.|luxury value | That dress must have cost a {fortune}.|luxury value | She had the good {fortune} to meet a great teacher.|luxury value",
      "fortnight future",
      "wealth",
    ),
    word(
      "wealth",
      "a large amount of money or valuable things",
      "财富",
      "The family's {wealth} came from oil.|luxury value | Health is more important than {wealth}.|luxury value | The {wealth} of the country is not shared equally.|luxury value",
      "health welfare",
      "fortune",
    ),
  ],
});

const giving = vocabularyTopic({
  id: "b1-words-money-verbs",
  title: t("Giving and Sharing", "给予和分享"),
  summary: t(
    "Owing, donating, betting and gambling; counting, dividing and splitting; rewards; spare; charities; supply and demand.",
    "欠钱、捐赠、打赌和赌博；数钱、分和平分；奖励；多余的；慈善机构；供应和需求。",
  ),
  prerequisites: ["a2-words-money"],
  words: [
    word(
      "owe owes owed owing",
      "to have to pay back money that someone lent you",
      "欠（钱）",
      "I {owe} my brother fifty dollars.|donate divide | How much do I {owe} you for the tickets?|donate divide | She still {owes} the bank a lot of money.|donates divides",
      "own owl",
    ),
    word(
      "donate donates donated donating",
      "to give money or things to help people",
      "捐赠；捐献",
      "We {donated} our old clothes to charity.|owed bet | He {donates} blood every six months.|owes bets | Would you like to {donate} to the children's hospital?|owe bet",
      "dominate decorate",
    ),
    word(
      "bet bets betting",
      "to risk money on what will happen, for example who will win a game; to be sure",
      "打赌；敢说",
      "He {bet} 20 dollars that his team would win.|owed divided | I {bet} you can't guess my age.|owe divide | {Betting} on football is illegal in some countries.|Owing Dividing",
      "beat get",
      "gamble",
    ),
    word(
      "gamble gambles gambled gambling",
      "to try to win money by playing games of chance",
      "赌博",
      "He lost all his money {gambling}.|counting dividing | Some people {gamble} at casinos every weekend.|count divide | She never {gambles}.|counts divides",
      "grumble gable",
      "bet",
    ),
    word(
      "count counts counted counting",
      "to find the total number of things; to say numbers in order",
      "数；计算",
      "The shop assistant {counted} the money twice.|gambled supplied | Can your little sister {count} to ten?|donate gamble | I'm {counting} the days until the holidays.|donating gambling",
      "court country",
    ),
    word(
      "divide divides divided dividing",
      "to separate something into parts or groups",
      "分；分开",
      "The teacher {divided} the class into four groups.|owed gambled | We {divided} the money equally among us.|owed gambled | Ten {divided} by two is five.|owed donated",
      "decide provide",
      "split",
    ),
    word(
      "split splits splitting",
      "to divide something between people; to break into two parts",
      "分摊；裂开",
      "Let's {split} the bill.|owe gamble | The wood {split} in two.|owed gambled | They are {splitting} the cost of the taxi.|owing gambling",
      "spill slip",
      "divide",
    ),
    word(
      "reward rewards",
      "something that you get for doing something good",
      "奖励；报酬",
      "The police offered a {reward} for information.|charity supply | As a {reward} for passing, his parents bought him a bike.|charity demand | The {rewards} of hard work come later.|charities supplies",
      "record award",
    ),
    word(
      "spare sparer sparest",
      "extra, kept in case it is needed; free, not being used",
      "备用的；空闲的",
      "Do you have a {spare} pen?|charity reward | We keep a {spare} key under the plant pot.|charity reward | What do you do in your {spare} time?|charity reward",
      "spear sparkle",
    ),
    word(
      "charity charities",
      "an organization that collects money to help people in need",
      "慈善机构；慈善",
      "She works for a {charity} that helps homeless people.|reward supply | We raised 500 dollars for {charity}.|reward supply | Many {charities} need volunteers.|rewards supplies",
      "chart clarity",
    ),
    word(
      "supply supplies supplied supplying",
      "to give people what they need; an amount of something that is available",
      "供应；提供",
      "The farm {supplies} milk to local shops.|demands rewards | The town has a good {supply} of fresh water.|demand reward | The school {supplied} the books for free.|demanded rewarded",
      "apply simply",
    ),
    word(
      "demand demands",
      "a strong request; the need that people have for something",
      "需求；要求",
      "There is a big {demand} for electric cars.|supply reward | The workers' {demands} were for better pay.|supplies rewards | Prices rise when {demand} is high and supply is low.|reward charity",
      "command depend",
    ),
  ],
});

const online = vocabularyTopic({
  id: "b1-words-online-shopping",
  title: t("Shopping Online", "网上购物"),
  summary: t(
    "Carts and checkouts; delivery and tracking; parcels, packages and couriers; stock and available; payments; secure; vouchers.",
    "购物车和结账；送货和追踪；包裹和快递员；库存和有货的；付款；安全的；代金券。",
  ),
  prerequisites: ["b1-words-consumers"],
  words: [
    word(
      "cart carts",
      "the place on a shopping website where you keep what you want to buy; a container on wheels in a supermarket",
      "购物车",
      "Add the shoes to your {cart} and pay.|courier voucher | My shopping {cart} is full, but I haven't paid yet.|courier voucher | He pushed the {cart} around the supermarket.|courier voucher",
      "card car",
    ),
    word(
      "checkout checkouts",
      "the place where you pay in a shop or on a website",
      "结账处；结账",
      "Go to the {checkout} to pay for your order.|parcel courier | There was a long line at the {checkout}.|parcel courier | Enter the voucher code at {checkout}.|parcel courier",
      "checkup check-in",
    ),
    word(
      "delivery deliveries",
      "bringing goods to someone's home or office",
      "送货；递送",
      "{Delivery} is free for orders over 50 dollars.|Stock Voucher | We are waiting for a {delivery} of new books.|stock courier | There are no {deliveries} on Sundays.|stocks vouchers",
      "discovery recovery",
    ),
    word(
      "track tracks tracked tracking",
      "to follow the progress of something, such as a parcel",
      "追踪；跟踪",
      "You can {track} your parcel online.|stock secure | The app {tracks} how far you run.|stocks secures | Enter your {tracking} number here.|stocking securing",
      "truck trick",
    ),
    word(
      "parcel parcels",
      "something wrapped in paper or in a box to be sent by post",
      "包裹",
      "The {parcel} arrived two days late.|checkout voucher | I need to send a {parcel} to my aunt.|checkout voucher | The courier left the {parcel} with my neighbor.|checkout voucher",
      "partial pencil",
      "package",
    ),
    word(
      "package packages",
      "a box or a parcel that is sent or delivered",
      "包裹；包装",
      "A {package} came for you this morning.|checkout stock | The {package} was too big for the letterbox.|checkout stock | We've had three {packages} this week.|checkouts stocks",
      "passage packet",
      "parcel",
    ),
    word(
      "courier couriers",
      "a person or a company that takes parcels to people",
      "快递员；快递公司",
      "The {courier} will deliver your order tomorrow.|voucher cart | I had to sign for the parcel when the {courier} came.|voucher cart | {Couriers} work very long hours.|Vouchers Carts",
      "career curious",
    ),
    word(
      "stock stocks",
      "the goods that a shop has available to sell",
      "库存；存货",
      "Sorry, this size is out of {stock}.|delivery cart | We have plenty of rice in {stock}.|delivery courier | The shop is selling its old {stock} cheaply.|delivery cart",
      "sock stick",
    ),
    word(
      "available",
      "able to be bought, used or found",
      "可获得的；有货的",
      "This phone is {available} in three colors.|secure faulty | Are there any tickets still {available}?|secure faulty | The doctor isn't {available} until Friday.|secure faulty",
      "valuable avoidable",
    ),
    word(
      "payment payments",
      "an amount of money that you pay",
      "付款；支付",
      "We accept {payment} by card or by phone.|stock delivery | She makes monthly {payments} on her loan.|stocks couriers | {Payment} must be made before delivery.|Stock Voucher",
      "pavement placement",
    ),
    word(
      "secure securer securest",
      "safe, protected from danger or theft",
      "安全的；牢固的",
      "Only shop on {secure} websites.|available faulty | Keep your passport in a {secure} place.|available faulty | Is the ladder {secure}?|courier voucher",
      "cure obscure",
    ),
    word(
      "voucher vouchers",
      "a piece of paper or a code that you can use instead of money",
      "代金券；优惠券",
      "I got a 20-dollar {voucher} for my birthday.|courier checkout | Use this {voucher} to get 10 percent off.|courier checkout | The shop gave us {vouchers} instead of a refund.|couriers checkouts",
      "voter vulture",
    ),
  ],
});

// Gerunds and infinitives.

/** ingVerbs are verbs followed by the -ing form, each with a sentence, the verb in brackets and the -ing form. */
const ingVerbs: readonly (readonly [string, string, string])[] = [
  ["I enjoy ___ for clothes online.", "shop", "shopping"],
  ["Try to avoid ___ money on things you don't need.", "spend", "spending"],
  ["Have you finished ___ the report?", "write", "writing"],
  ["Do you mind ___ the window?", "close", "closing"],
  ["She suggested ___ the bill.", "split", "splitting"],
  ["He keeps ___ the same mistake.", "make", "making"],
  ["You should practice ___ English every day.", "speak", "speaking"],
  ["I can't imagine ___ without my phone.", "live", "living"],
  ["We are considering ___ a new car.", "buy", "buying"],
  ["I miss ___ my grandparents every weekend.", "see", "seeing"],
  ["He gave up ___ last year.", "smoke", "smoking"],
  ["They enjoyed ___ to the beach.", "go", "going"],
  ["She avoided ___ at me.", "look", "looking"],
  ["I don't mind ___ for a few minutes.", "wait", "waiting"],
  ["Have you finished ___ your room?", "clean", "cleaning"],
  ["My teacher suggested ___ a dictionary.", "use", "using"],
  ["Keep ___ until you reach the bridge.", "walk", "walking"],
  ["I'm thinking of ___ a part-time job.", "get", "getting"],
  ["She is good at ___ money.", "save", "saving"],
  ["Thank you for ___ me.", "help", "helping"],
  ["He left without ___ goodbye.", "say", "saying"],
  ["I'm looking forward to ___ you.", "meet", "meeting"],
  ["We're interested in ___ a house.", "rent", "renting"],
  ["She's afraid of ___ alone at night.", "be", "being"],
  ["Instead of ___ a taxi, we walked.", "take", "taking"],
  ["After ___ dinner, we watched a film.", "eat", "eating"],
  ["He's tired of ___ the same food every day.", "cook", "cooking"],
  ["Before ___ the contract, read it carefully.", "sign", "signing"],
];

/** toVerbs are verbs followed by to and the base form, each with a sentence, the verb in brackets, the answer and the wrong -ing form. */
const toVerbs: readonly (readonly [string, string, string, string])[] = [
  ["I can't afford ___ a new phone.", "buy", "to buy", "buying"],
  ["We decided ___ at home this summer.", "stay", "to stay", "staying"],
  ["I hope ___ you again soon.", "see", "to see", "seeing"],
  ["They are planning ___ to Japan.", "travel", "to travel", "traveling"],
  ["He agreed ___ me with my homework.", "help", "to help", "helping"],
  ["She refused ___ for the broken plate.", "pay", "to pay", "paying"],
  ["I promise ___ the money back on Friday.", "give", "to give", "giving"],
  ["Did you manage ___ the tickets?", "get", "to get", "getting"],
  ["My neighbor offered ___ my plants.", "water", "to water", "watering"],
  ["I'm learning ___ the guitar.", "play", "to play", "playing"],
  ["We expect ___ by six o'clock.", "arrive", "to arrive", "arriving"],
  ["He pretended ___ asleep.", "be", "to be", "being"],
  ["She wants ___ a doctor.", "become", "to become", "becoming"],
  ["They need ___ more money.", "save", "to save", "saving"],
  ["I'd like ___ a complaint.", "make", "to make", "making"],
  ["We hope ___ the house next year.", "sell", "to sell", "selling"],
  ["She tends ___ late.", "be", "to be", "being"],
  ["She decided ___ the job.", "accept", "to accept", "accepting"],
  ["The shop agreed ___ my money.", "refund", "to refund", "refunding"],
  ["I can't afford ___ a car.", "run", "to run", "running"],
  ["He refused ___ the question.", "answer", "to answer", "answering"],
  ["He failed ___ the bill on time.", "pay", "to pay", "paying"],
  ["They promised ___ the parcel today.", "deliver", "to deliver", "delivering"],
  ["We managed ___ a cheap flight.", "find", "to find", "finding"],
  ["She has arranged ___ abroad.", "study", "to study", "studying"],
  ["He seems ___ the city.", "like", "to like", "liking"],
  ["I chose ___ the train.", "take", "to take", "taking"],
  ["They threatened ___ the police.", "call", "to call", "calling"],
];

const gerundChoice: readonly ChoiceItem[] = interleave([
  ingVerbs.map(([s, verb, ing]): ChoiceItem => [`${s} (${verb})`, ing, [`to ${verb}`, verb]]),
  toVerbs.map(([s, verb, inf, ing]): ChoiceItem => [`${s} (${verb})`, inf, [ing, verb]]),
]);

const gerundTyped: readonly TypedItem[] = interleave([
  ingVerbs.map(([s, verb, ing]): TypedItem => ({ shown: `${s} (${verb})`, accepted: [ing], wrong: [`to ${verb}`, verb] })),
  toVerbs.map(([s, verb, inf, ing]): TypedItem => ({ shown: `${s} (${verb})`, accepted: [inf], wrong: [ing, verb] })),
]);

/** afterPreposition are the -ing items whose verb follows a preposition. */
const afterPreposition = ingVerbs.slice(17);

const prepositionChoice: readonly ChoiceItem[] = [
  ...afterPreposition.map(([s, verb, ing]): ChoiceItem => [`${s} (${verb})`, ing, [`to ${verb}`, verb]]),
  ["I'm good at ___ problems. (solve)", "solving", ["to solve", "solve"]],
  ["She's worried about ___ her exam. (fail)", "failing", ["to fail", "fail"]],
  ["We talked about ___ a party. (have)", "having", ["to have", "have"]],
  ["He apologized for ___ late. (be)", "being", ["to be", "be"]],
  ["I'm bored with ___ at home. (sit)", "sitting", ["to sit", "sit"]],
  ["You can save money by ___ your own lunch. (bring)", "bringing", ["to bring", "bring"]],
  ["She's excited about ___ to university. (go)", "going", ["to go", "go"]],
  ["He's proud of ___ the race. (win)", "winning", ["to win", "win"]],
  ["I'm sorry for ___ your birthday. (forget)", "forgetting", ["to forget", "forget"]],
  ["They succeeded in ___ the bank loan. (get)", "getting", ["to get", "get"]],
  ["How about ___ a film tonight? (watch)", "watching", ["to watch", "watch"]],
  ["She insisted on ___ for dinner. (pay)", "paying", ["to pay", "pay"]],
  ["We're keen on ___ new places. (explore)", "exploring", ["to explore", "explore"]],
  ["Wash your hands before ___ food. (touch)", "touching", ["to touch", "touch"]],
  ["He got the job by ___ hard. (work)", "working", ["to work", "work"]],
  ["I'm used to ___ up early. (get)", "getting", ["to get", "get"]],
  ["She left the shop without ___ anything. (buy)", "buying", ["to buy", "buy"]],
  ["We're tired of ___ for the bus. (wait)", "waiting", ["to wait", "wait"]],
  ["Are you interested in ___ the club? (join)", "joining", ["to join", "join"]],
  ["He's nervous about ___ in public. (speak)", "speaking", ["to speak", "speak"]],
  ["Thanks for ___ me the money. (lend)", "lending", ["to lend", "lend"]],
  ["She dreams of ___ a famous singer. (become)", "becoming", ["to become", "become"]],
];

const prepositions = new Set(["at", "of", "in", "about", "for", "by", "without", "before", "after", "on", "with", "to"]);

/** formTrigger finds the word before the gap that decides the form, and whether it is a preposition. */
function formTrigger(shown: string): readonly [string, boolean] {
  const words = (shown.split("___")[0] ?? "").trim().split(" ");
  const last = (words.at(-1) ?? "").toLowerCase();
  const before = (words.at(-2) ?? "").toLowerCase();
  if (last === "up") return [`${before} up`, false];
  if (last === "to") return [before === "forward" ? "look forward to" : before === "used" ? "be used to" : `${before} to`, true];

  if (last === "of" && before === "instead") return ["instead of", true];
  return [last, prepositions.has(last)];
}

/** formRule names the rule that picks -ing or to after the word before the gap. */
function formRule(right: string, shown: string): Text {
  const [word, preposition] = formTrigger(shown);
  if (preposition)
    return word.endsWith(" to")
      ? t(
          `In *${word}*, *to* is a preposition, and a verb after a preposition takes *-ing*`,
          `*${word}* 里的 *to* 是介词，介词后的动词用 *-ing*`,
        )
      : t(`*${word}* is a preposition, and a verb after a preposition takes *-ing*`, `*${word}* 是介词，介词后的动词用 *-ing*`);
  return right.startsWith("to ")
    ? t(`*${word}* is a verb that takes *to* and the base form`, `*${word}* 后面接 *to* 加动词原形`)
    : t(`*${word}* is a verb that takes the *-ing* form`, `*${word}* 后面接动词的 *-ing* 形式`);
}

/** gerundWhy explains -ing or to in the gap of shown. */
const gerundWhy = (right: string, shown: string): Text => {
  const rule = formRule(right, shown);
  return t(`${rule.en}: ${fill(shown, right)}`, `${rule["zh-CN"]}：${fill(shown, right)}`);
};

/** whyNotGerund explains a wrong form: to where -ing belongs, -ing where to belongs, or the base form. */
const whyNotGerund = (wrong: string, right: string, shown: string): Text => {
  const rule = formRule(right, shown);
  const [word, preposition] = formTrigger(shown);
  let first: Text;
  if (wrong.startsWith("to "))
    first = preposition
      ? t(`*to* and the base form never follow a preposition.`, "介词后面不能接 *to* 加动词原形。")
      : t(`*${word}* does not take *to*.`, `*${word}* 后面不接 *to*。`);
  else if (wrong.endsWith("ing")) first = t(`*${word}* does not take the *-ing* form.`, `*${word}* 后面不接 *-ing* 形式。`);
  else
    first = t(
      `*${wrong}* is the base form alone, which cannot follow *${word}*.`,
      `*${wrong}* 只是动词原形，不能直接跟在 *${word}* 后面。`,
    );
  return t(`${first.en} ${rule.en}.`, `${first["zh-CN"]}${rule["zh-CN"]}。`);
};

const gerundsAndInfinitives: TopicDef = {
  id: "gerunds-and-infinitives",
  title: t("Gerunds and Infinitives", "动名词和不定式"),
  summary: t(
    "I enjoy shopping, but I can't afford to buy much. Some verbs take -ing (enjoy, avoid, finish), others to (afford, decide, hope); after a preposition, use -ing.",
    "I enjoy shopping, but I can't afford to buy much. 有些动词后接 -ing（enjoy、avoid、finish），有些接 to（afford、decide、hope）；介词后用 -ing。",
  ),
  prerequisites: ["verbs-followed-by-to", "like-and-love-with-ing"],
  encompasses: [
    { topic: "verbs-followed-by-to", weight: 0.3 },
    { topic: "like-and-love-with-ing", weight: 0.2 },
  ],
  xp: 25,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("-ing or to after a verb", "动词后接 -ing 还是 to"),
      t(
        "When one verb follows another, the first verb decides the form of the second:\n\n- **-ing** after *enjoy, avoid, finish, mind, suggest, keep, practice, imagine, consider, miss, give up*: *I enjoy **shopping**. Do you mind **closing** the window?*\n- **to** + base form after *afford, decide, hope, plan, agree, refuse, promise, manage, offer, learn, expect, pretend, want, need, would like*: *I can't afford **to buy** it. We decided **to stay**.*\n\nThere is no rule that tells you which: learn each verb with its form. A useful hint: many *to* verbs look forward to a future action (*hope, plan, decide, promise*).",
        "一个动词后面接另一个动词时，由第一个动词决定第二个的形式：\n\n- *enjoy, avoid, finish, mind, suggest, keep, practice, imagine, consider, miss, give up* 后接 **-ing**：*I enjoy **shopping**. Do you mind **closing** the window?*\n- *afford, decide, hope, plan, agree, refuse, promise, manage, offer, learn, expect, pretend, want, need, would like* 后接 **to** + 原形：*I can't afford **to buy** it. We decided **to stay**.*\n\n没有规则能告诉你用哪一种，要把每个动词和它的形式一起记。一个有用的提示：许多接 *to* 的动词指向将来的动作（*hope, plan, decide, promise*）。中文“喜欢买东西”“决定留下”里动词不变形，英语的第二个动词要变成 -ing 或 to + 原形。",
      ),
      choiceGenerator(
        t("Choose the right form of the verb in brackets.", "选出括号中动词的正确形式。"),
        gerundChoice,
        gerundWhy,
        whyNotGerund,
      ),
    ),
    point(
      "preposition",
      t("-ing after a preposition", "介词后用 -ing"),
      t(
        "After a preposition (*at, of, in, about, for, by, without, before, after, instead of*), a verb is always in the **-ing** form:\n\n- *She is good **at saving** money.*\n- *Thank you **for helping** me.*\n- *He left **without saying** goodbye.*\n\nThis is also true for *to* when it is a preposition, as in *look forward to* and *be used to*: *I'm looking forward to **meeting** you*, not *to meet*.",
        "介词（*at, of, in, about, for, by, without, before, after, instead of*）后面的动词总是用 **-ing** 形式：\n\n- *She is good **at saving** money.*\n- *Thank you **for helping** me.*\n- *He left **without saying** goodbye.*\n\n*to* 作介词时也一样，比如 *look forward to* 和 *be used to*：*I'm looking forward to **meeting** you*，不说 *to meet*。",
      ),
      choiceGenerator(
        t("Choose the right form of the verb in brackets.", "选出括号中动词的正确形式。"),
        prepositionChoice,
        gerundWhy,
        whyNotGerund,
      ),
    ),
    point(
      "write",
      t("Writing -ing or to", "写出 -ing 或 to"),
      t(
        "Type the right form of the verb in brackets: the **-ing** form (*shopping, making, splitting*) or ***to*** + the base form (*to buy, to stay*).\n\nRemember the spelling of -ing: drop a final *-e* (*make → making*), and double a final consonant after one short vowel (*split → splitting, get → getting*).",
        "输入括号中动词的正确形式：**-ing** 形式（*shopping, making, splitting*）或 ***to*** + 原形（*to buy, to stay*）。\n\n注意 -ing 的拼写：去掉词尾的 *-e*（*make → making*），单个短元音后的词尾辅音要双写（*split → splitting, get → getting*）。",
      ),
      typedGenerator("word-form", t("Type the right form of the verb in brackets.", "输入括号中动词的正确形式。"), gerundTyped, gerundWhy),
    ),
  ],
};

// Writing a letter of complaint.

const complaintBank: readonly WritingItem[] = [
  {
    task: "You bought a laptop online. When it arrived, the screen was cracked. Write a letter of complaint to the shop.",
    model:
      "Dear Sir or Madam,\n\nI am writing to complain about a laptop that I ordered from your website on 3 March (order number 48213).\n\nWhen the parcel arrived on 6 March, I found that the screen was cracked across the middle. The box was not damaged, so I believe the laptop was already broken when it was packed. I cannot use it for my university work, which is a serious problem because I have exams next month.\n\nI telephoned your customer service twice, but nobody has replied to my messages. I would therefore like you to collect the faulty laptop and send me a new one within a week. If this is not possible, I would like a full refund.\n\nI have attached a photo of the screen and a copy of the receipt. I look forward to hearing from you soon.\n\nYours faithfully,\nLi Ming",
  },
  {
    task: "You stayed in a hotel for three nights. Your room was dirty and noisy, and the air conditioning did not work. Write a letter of complaint to the hotel manager.",
    model:
      "Dear Manager,\n\nI am writing to complain about my stay at your hotel from 10 to 13 July.\n\nWhen I arrived, my room had not been cleaned: there were used towels in the bathroom and the bin was full. In addition, the air conditioning did not work, and as the temperature was over 35 degrees, I could hardly sleep. The room was also next to the kitchen, so it was very noisy from early in the morning.\n\nI reported these problems at the reception desk on the first evening, but I was told that no other rooms were available, and nothing was repaired.\n\nI paid a high price for a comfortable stay, and I did not receive one. I would therefore be grateful if you could refund the cost of at least two nights.\n\nI look forward to your reply.\n\nYours sincerely,\nAnna Lopez",
  },
  {
    task: "You ordered a birthday present for your mother online, but it arrived two weeks late, after her birthday. Write a letter of complaint to the online shop.",
    model:
      "Dear Sir or Madam,\n\nI am writing to complain about the late delivery of my order (number 77105), a silk scarf that I bought as a birthday present for my mother.\n\nWhen I placed the order on 1 May, your website promised delivery within three days, and I paid an extra fee for fast delivery. However, the parcel did not arrive until 17 May, a week after my mother's birthday. I tracked the parcel every day, but the website did not explain the delay.\n\nThis was very disappointing, as I had nothing to give my mother on her special day.\n\nI would like you to refund the delivery fee of 15 dollars, and I would also appreciate an explanation of what went wrong. I hope that you will improve your service so that other customers do not have the same experience.\n\nYours faithfully,\nZhang Wei",
  },
  {
    task: "You joined a gym, but the classes you were promised are often canceled and the machines are often broken. Write a letter of complaint to the gym manager.",
    model:
      "Dear Mr. Brown,\n\nI am writing to complain about the service at your gym, which I joined in January.\n\nWhen I signed up, I was told that there would be yoga classes every evening. However, in the last month, eight classes were canceled without any warning, and I traveled to the gym for nothing. In addition, two of the running machines have been broken since February, so members often have to wait to use the others.\n\nI pay 60 dollars a month, which is not a small amount for me, and I am not getting the service I was promised. I spoke to a member of staff about this, but nothing has changed.\n\nI would like you to repair the machines and publish the class timetable a week in advance. I would also like a discount of 50 percent for this month.\n\nI look forward to hearing from you.\n\nYours sincerely,\nSara Khan",
  },
  {
    task: "You bought a pair of running shoes. After two weeks, the sole came off one of them. The shop refused to give you a refund. Write a letter of complaint to the company that makes the shoes.",
    model:
      "Dear Sir or Madam,\n\nI am writing to complain about a pair of your running shoes, which I bought from a sports shop in Shanghai on 2 April.\n\nAfter only two weeks of normal use, the sole came off the left shoe while I was running. I took the shoes back to the shop with my receipt, but the assistant refused to give me a refund. She said that I must have damaged them myself, which is not true.\n\nThe shoes cost 120 dollars, and the box says that they have a one-year guarantee. I am therefore very disappointed with both the quality of the product and the way I was treated.\n\nI would like you to replace the shoes or refund the full price. I have enclosed a copy of the receipt and a photo of the damaged shoe.\n\nI look forward to your reply.\n\nYours faithfully,\nChen Yu",
  },
  {
    task: "Your new washing machine was installed last week. It leaks water onto the kitchen floor every time you use it. Write a letter of complaint to the store where you bought it.",
    model:
      "Dear Customer Service Manager,\n\nI am writing to complain about a washing machine that I bought from your store on 15 September. It was delivered and installed on 20 September.\n\nSince then, the machine has leaked water onto the kitchen floor every time I have used it. On one occasion, the water reached the hall and damaged a rug. As I have two small children, I need to wash clothes every day, so this is a serious problem.\n\nI called your store on 22 September, and I was promised that an engineer would come within two days. Unfortunately, nobody came and nobody called me back.\n\nThe machine is still under warranty. I would therefore like you to replace it with a new one as soon as possible, and to pay for the damaged rug.\n\nI look forward to hearing from you soon.\n\nYours faithfully,\nMaria Silva",
  },
  {
    task: "You went to a restaurant for a family celebration. You waited an hour for your food, and some dishes were cold. Write a letter of complaint to the restaurant manager.",
    model:
      "Dear Manager,\n\nI am writing to complain about the meal my family had at your restaurant on Saturday 8 June to celebrate my grandmother's eightieth birthday.\n\nAlthough we had booked a table two weeks in advance, we had to wait over an hour for our food. When it finally arrived, two of the dishes were cold, and one was not what we had ordered. When I mentioned this to the waiter, he was rude and did not apologize.\n\nThis was a very special day for our family, and the evening was spoiled. We paid 250 dollars for the meal, and I do not feel that we received the service we deserved.\n\nI would like you to refund part of the cost of the meal. I would also be grateful if you could speak to your staff about how they treat customers.\n\nI look forward to your reply.\n\nYours sincerely,\nTom Walker",
  },
  {
    task: "You signed up for an online English course, but the videos often do not load and the teacher never answers your questions. Write a letter of complaint to the company.",
    model:
      "Dear Sir or Madam,\n\nI am writing to complain about the online English course that I paid for on 1 October.\n\nYour website promised weekly video lessons and answers from a teacher within 24 hours. However, since I started, about half of the videos have not loaded, even though my internet connection is fast. I have also sent the teacher five questions, and I have not received a single answer.\n\nI chose your course because I need to pass an English exam in December, and I am now worried that I will not be ready. I have emailed your help desk twice, but I have only received automatic replies.\n\nI would like you either to fix the problems with the videos and make sure that my questions are answered, or to give me a full refund of 180 dollars.\n\nI look forward to hearing from you soon.\n\nYours faithfully,\nYuki Tanaka",
  },
  {
    task: "You bought tickets for a concert, but when you arrived, your seats had been sold to other people. Write a letter of complaint to the ticket company.",
    model:
      "Dear Sir or Madam,\n\nI am writing to complain about what happened at the concert in the City Arena on Friday 14 February.\n\nI bought two tickets on your website in December, for seats in row C. When my friend and I arrived, we found two other people in our seats who had exactly the same tickets. The staff at the arena could not help us, and we had to stand at the back for the whole concert.\n\nThe tickets cost 90 dollars each, and we had been looking forward to the concert for months. It was very disappointing, and standing for three hours was tiring.\n\nI have attached copies of our tickets and the email that confirmed our booking. I would like a full refund of 180 dollars, and I would also like to know how this mistake happened.\n\nI look forward to your reply.\n\nYours faithfully,\nDavid Park",
  },
  {
    task: "The bus company in your town changed its timetable. Buses are now often late and very crowded, and you are late for school or work. Write a letter of complaint to the bus company.",
    model:
      "Dear Sir or Madam,\n\nI am writing to complain about the number 12 bus service since the new timetable started on 1 March.\n\nBefore the change, there was a bus every ten minutes in the morning. Now there is only one every twenty minutes, and the buses are often late. As a result, they are so crowded that they sometimes do not stop because there is no space. In the last two weeks, I have been late for school four times, and my teacher has warned me.\n\nMany other passengers on my route have the same problem, especially older people who cannot stand for long.\n\nI would therefore like to ask you to put more buses on the route between seven and nine in the morning. I would also be grateful if you could explain why the timetable was changed.\n\nI look forward to hearing from you.\n\nYours faithfully,\nNina Rossi",
  },
  {
    task: "You booked a holiday apartment through a website. When you arrived, it was much smaller than in the photos and far from the beach. Write a letter of complaint to the website.",
    model:
      "Dear Sir or Madam,\n\nI am writing to complain about an apartment in Sanya that I booked through your website for the week of 5 to 12 August (booking number 55920).\n\nThe advertisement described a large apartment with two bedrooms, five minutes from the beach. In fact, it had only one small bedroom, and the beach was a thirty-minute walk away. The photos on your website were clearly of a different, much nicer apartment.\n\nAs there were four of us, two people had to sleep on the sofa, and we spent a lot of money on taxis to the beach. I contacted the owner, but he refused to help.\n\nI believe your website is responsible for the information it advertises. I would therefore like a refund of at least half the price, and I would ask you to remove the false photos.\n\nI look forward to your reply.\n\nYours faithfully,\nLiu Fang",
  },
  {
    task: "Your mobile phone company charged you for calls and data that you did not use. Write a letter of complaint to the company.",
    model:
      "Dear Customer Service Team,\n\nI am writing to complain about my phone bill for April (account number 3305-118).\n\nI have a monthly plan that includes unlimited calls and 20 gigabytes of data for 30 dollars. However, my April bill was 95 dollars. It includes charges for international calls that I did not make and for extra data, although the app on my phone shows that I used only 12 gigabytes.\n\nI called your help line on 5 May, and the assistant agreed that there was a mistake. She promised that the bill would be corrected, but I have just received a reminder asking me to pay the full amount.\n\nI would like you to correct the bill and refund the extra 65 dollars, which has already been taken from my bank account. Please also confirm in writing that the problem has been solved.\n\nI look forward to hearing from you soon.\n\nYours faithfully,\nAhmed Hassan",
  },
];

const complaintLetter = judgedTopic({
  id: "writing-a-letter-of-complaint",
  title: t("Writing a Letter of Complaint", "写投诉信"),
  summary: t(
    "Write a formal letter of 120 to 180 words about a product or a service: what happened, why it is a problem, and what you want done, firmly but politely.",
    "写一封 120 到 180 词的正式信，投诉一件商品或一项服务：发生了什么，为什么是个问题，你希望怎么解决，态度坚定而有礼貌。",
  ),
  prerequisites: ["writing-a-formal-email"],
  encompasses: [{ topic: "writing-a-formal-email", weight: 0.3 }],
  criteria: ["b1-complaint-what-happened", "b1-complaint-why-a-problem", "b1-complaint-what-you-want", "b1-formal-register"],
  point: {
    id: "complaint",
    title: t("What happened, why it matters, what you want", "发生了什么，为什么重要，你想要什么"),
    explanation: t(
      "A letter of complaint is formal. Plan it in four short paragraphs:\n\n1. **Why you are writing**: *I am writing to complain about the laptop that I ordered on 3 March (order number 48213).*\n2. **What happened**, with facts: dates, places, prices and what you have already done: *When the parcel arrived, the screen was cracked. I telephoned your customer service twice, but...*\n3. **Why it is a problem** for you: *I cannot use it for my university work.*\n4. **What you want** them to do, clearly: *I would like you to send me a new one within a week. If this is not possible, I would like a full refund.*\n\nBe **firm but polite**: no rude words, no contractions (*I am*, not *I'm*), and formal phrases such as *I would be grateful if you could...*, *I look forward to hearing from you*. Begin with *Dear Sir or Madam* and end with *Yours faithfully*, or begin with a name and end with *Yours sincerely*.",
      "投诉信是正式的信。分四个短段落来写：\n\n1. **写信的原因**：*I am writing to complain about the laptop that I ordered on 3 March (order number 48213).*\n2. **发生了什么**，写事实：日期、地点、价格，以及你已经做了什么：*When the parcel arrived, the screen was cracked. I telephoned your customer service twice, but...*\n3. **为什么对你是个问题**：*I cannot use it for my university work.*\n4. **你希望对方怎么做**，说清楚：*I would like you to send me a new one within a week. If this is not possible, I would like a full refund.*\n\n要**坚定而有礼貌**：不用粗鲁的话，不用缩写（写 *I am*，不写 *I'm*），用正式的说法，比如 *I would be grateful if you could...*、*I look forward to hearing from you*。以 *Dear Sir or Madam* 开头就以 *Yours faithfully* 结尾，以对方的名字开头就以 *Yours sincerely* 结尾。中文投诉常先讲情绪，英语的投诉信先讲事实，再明确提出要求。",
    ),
  },
  question: t(
    "Write a formal letter of complaint of 120 to 180 words in English. Say what happened, why it is a problem and what you want the reader to do, firmly but politely.",
    "用英语写一封 120 到 180 词的正式投诉信。说明发生了什么，为什么是个问题，你希望对方怎么做，态度坚定而有礼貌。",
  ),
  bank: complaintBank,
  limits: { minWords: 100, maxChars: 1600 },
  what: t("letter of complaint", "投诉信"),
});

/** topics are the topics of the unit Money and Consumers. */
export const topics: readonly TopicDef[] = [
  finance.topic,
  consumers.topic,
  value.topic,
  giving.topic,
  online.topic,
  gerundsAndInfinitives,
  complaintLetter,
];

/** vocabulary are the words the unit Money and Consumers teaches. */
export const vocabulary: readonly WordBatch[] = [finance.batch, consumers.batch, value.batch, giving.batch, online.batch];
