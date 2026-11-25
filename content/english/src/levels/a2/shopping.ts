// A2, unit 9: Shopping and Money. Money, shops, things we buy and what they are made of; too and enough, one and ones;
// a message to a shop judged by a model.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, interleave, vocabularyTopic, word } from "../words.ts";
import { fill, judgedTopic } from "./kit.ts";

const money = vocabularyTopic({
  id: "a2-words-money",
  title: t("Money", "钱"),
  summary: t(
    "Cash, coins, cents and credit cards; change and wallets; saving and lending; rich and poor; what things cost; thousands.",
    "现金、硬币、分和信用卡；找零和钱包；存钱和借出；富有和贫穷；东西的价格；千。",
  ),
  intro: t(
    "Leo opened his **wallet**: no **cash**, just three **coins** and a card, but he had **saved** enough on the card for the new game. These words help you pay, save and talk about how much things cost.",
    "利奥打开 **wallet**（钱包）：没有 **cash**（现金），只有三枚 **coins**（硬币）和一张卡，不过他已经在卡里 **saved**（存）够了买新游戏的钱。这些词帮你付钱、存钱，以及谈论东西多少钱。",
  ),
  prerequisites: ["a1-words-shopping"],
  words: [
    word(
      "cash",
      "money in coins and paper notes",
      "现金",
      "Do you want to pay by card or in {cash}, with notes and coins? | This small shop only takes {cash}: notes and coins, not cards.|credit wallets | I don't have any {cash} on me, not one note or coin. Can I pay with my phone?|credit wallets",
      "credit wallet",
    ),
    word(
      "coin coins",
      "a small round piece of metal money",
      "硬币",
      "I found a small round one-yuan {coin} under the sofa. | My grandpa collects old metal {coins} from different countries.|notes bills | Drop a metal {coin} into the machine and press the button.",
      "note bill",
    ),
    word(
      "credit",
      "a way of buying something now and paying for it later",
      "信用；赊账",
      "Can I pay by {credit} card and pay the bank back next month? | They bought the car on {credit} and paid for it over three years. | My {credit} card lets me buy things now and pay for them later.",
      "cash change",
    ),
    word(
      "change changes changed changing",
      "the money you get back when you pay more than the price; to make or become different",
      "零钱；找零；改变",
      "You gave me ten yuan for an eight-yuan cake, so here's your {change}: two yuan. | The town has {changed} a lot in ten years: it looks very different now.|saved lent | Can I {change} this small shirt for a bigger one in the same color?|save lend",
      "cash credit",
    ),
    word(
      "cent cents",
      "a small coin; there are a hundred cents in a dollar or a euro",
      "分（货币单位）",
      "This pen costs ninety-nine {cents}, just one cent less than a dollar.|dollars coins | There are a hundred {cents} in a dollar.|dollars coins | The apples are fifty {cents} each, so two apples cost one dollar.|dollars coins",
      "dollar coin",
    ),
    word(
      "wallet wallets",
      "a small flat case for money and cards",
      "钱包",
      "I keep my money and cards in my {wallet}, a small flat case in my pocket. | Oh no, I've lost my {wallet}, and all my money and cards were in that small case! | He took a twenty-yuan note out of his {wallet} and put the small leather case back in his pocket.",
      "bag pocket",
    ),
    word(
      "save saves saved saving",
      "to keep money to use later; to spend less; to keep someone from danger",
      "存钱；节省；救",
      "I'm {saving} money for a new bike: I keep ten yuan in a box every week.|lending costing | If you take the bus, you'll {save} ten yuan. | The firefighter {saved} the boy from the river.|lent cost",
      "lend cost",
    ),
    word(
      "lend lends lent lending",
      "to give something to someone for a short time",
      "借出；借给",
      "Can you {lend} me ten yuan? I'll pay you back tomorrow. | My brother {lent} me his bike for the weekend.|borrowed saved | I never {lend} my books to people who lose things.",
      "borrow save",
    ),
    word(
      "rich richer richest",
      "having a lot of money",
      "富有的",
      "He was {rich}, so he bought a big house by the sea. | Bill is the {richest} man in our town. He has five cars.|poorest cheapest | Ten years ago they had nothing, but now they are {rich}.",
      "poor cheap",
    ),
    word(
      "poor poorer poorest",
      "having very little money",
      "贫穷的",
      "His family was very {poor}, so he couldn't go to school. | We should give food to {poor} families who can't buy enough to eat. | She grew up in a {poor} village with no electricity.",
      "rich cheap",
    ),
    word(
      "cost costs costing",
      "to have a price; the money you need to pay for something",
      "花费；价格",
      "How much does this jacket {cost}? | The tickets {cost} two hundred yuan each.|spend pay | The {cost} of food is going up.",
      "spend pay",
    ),
    word(
      "thousand thousands",
      "the number 1,000",
      "千",
      "A new laptop costs about five {thousand} yuan: 5,000 yuan. | {Thousands} of people, more than 4,000, came to see the parade.|Hundreds Millions | There are a {thousand} meters in a kilometer.",
      "hundred million",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Lend* and *borrow* go in opposite directions: you *lend* something to someone, and you *borrow* something from someone. Say *Can you lend me ten yuan?*, never *Can you borrow me ten yuan?*",
        "*lend* 和 *borrow* 方向相反：*lend* 是把东西借给别人，*borrow* 是向别人借东西。要说 *Can you lend me ten yuan?*，不能说 *Can you borrow me ten yuan?*",
      ),
      meaning: t(
        "*Change* has two meanings here: the money you get back when you pay more than the price, and to make or become different. A *cent* is a hundredth of a dollar or a euro, while a *coin* is any round piece of metal money.",
        "*change* 在这里有两个意思：付钱多于价钱时找回的零钱，以及改变。*cent* 是一美元或一欧元的百分之一，而 *coin* 是任何一枚圆形金属钱币。",
      ),
      spell: t(
        "*Lend* has the irregular past *lent*, not *lended*; *cost* stays *cost* in the past; *thousand* has ou, as in *house*.",
        "*lend* 的过去式是不规则的 *lent*，不是 *lended*；*cost* 的过去式还是 *cost*；*thousand* 里的 ou 和 *house* 一样。",
      ),
    },
    notes: `
      cash|paying with notes and coins instead of a card;a small shop that takes no cards;having not one note or coin to pay with|cash is money in notes and coins; credit is a way to pay later|cash 是纸币和硬币；credit 是先买后付的方式|credit=credit is a way to buy now and pay later, not notes and coins=credit 是先买后付的方式，不是纸币和硬币;wallet/wallets=wallet is a small case you keep money in, not the money itself=wallet 是装钱的小夹子，不是钱本身|cash|a short a, and sh at the end|短元音 a，结尾是 sh
      coin|a small round one-yuan piece under the sofa;old metal money a grandpa collects;metal money for a machine|a coin is round metal money; a note is paper money|coin 是圆形金属钱币；note 是纸币|note/notes=note here is paper money, not round metal money=note 在这里是纸币，不是圆形金属钱币;bill/bills=bill is the American word for paper money, not round metal money=bill 是美式英语里的纸币，不是圆形金属钱币|coin|oi, as in *boy*|oi 和 *boy* 里的一样
      credit|a card for paying the bank back next month;a car paid for over three years;a card for buying now and paying later|credit means buying now and paying later; cash means paying now with notes and coins|credit 是先买后付；cash 是当场用纸币硬币付钱|cash=cash is notes and coins you pay with now, not a way to pay later=cash 是当场付的纸币和硬币，不是之后再付的方式;change=change is the money you get back after paying, not a way to pay later=change 是付钱后找回的零钱，不是之后再付的方式|cred · it|-it at the end|结尾是 -it
      change|two yuan back after paying for a cake;a town that looks very different;a shirt swapped for a bigger one|change is money you get back, or to make something different; cash is any money in notes and coins|change 是找回的零钱，或改变；cash 是任何纸币硬币|cash=cash is any money in notes and coins, not the money you get back after paying more than the price=cash 是任何纸币和硬币，不是付多了以后找回的钱;credit=credit is a way to buy now and pay later, not money you get back=credit 是先买后付的方式，不是找回的钱;save/saved=save means keeping money for later or keeping someone safe, not making something different=save 是存钱或救人，不是改变;lend/lent=lend means giving something to someone for a short time, not making something different=lend 是把东西借给别人，不是改变|change|-nge at the end, said like *nj*|结尾 -nge 读作 *nj*
      cent|a pen one cent less than a dollar;a hundred in a dollar;apples where two cost one dollar|a cent is a hundredth of a dollar; a dollar is a hundred cents|cent 是一美元的百分之一；dollar 是一百美分|dollar/dollars=dollar is a hundred cents, much more than these small amounts=dollar 是一百美分，比这些小数目大得多;coin/coins=coin is a piece of metal money, not a unit for saying a price=coin 是一枚金属钱币，不是表示价钱的单位|cent|c said like s|c 读作 s
      wallet|a small flat case in a pocket;a lost small case with money and cards;a leather case a note came out of|a wallet is a small flat case for money and cards; a pocket is part of your clothes|wallet 是装钱和卡的扁平小夹子；pocket 是衣服上的口袋|bag=bag is bigger and you carry it, not a small flat case that goes in your pocket=bag 更大，是拎着的，不是放进口袋的扁平小夹子;pocket=pocket is part of your clothes, and here the wallet goes into the pocket=pocket 是衣服上的口袋，这里是钱包放进口袋里|wal · let|the double l, and -et at the end|双写 l，结尾是 -et
      save|keeping ten yuan in a box every week;taking the bus to pay less;a firefighter and a boy in a river|save means keeping money for later or keeping someone safe; lend means giving something for a short time|save 是存钱或救人；lend 是借给别人|lend/lending/lent=lend means giving something to someone for a short time, not keeping money for yourself or keeping someone safe=lend 是把东西借给别人，不是自己存钱或救人;cost/costing=cost is the price of a thing, and a person does not cost money for a bike or cost a boy from a river=cost 是东西的价钱，人不会“花费”钱买车，也不会“花费”河里的男孩|save|a that says its name before the silent e|不发音的 e 前面，a 读字母本音
      lend|ten yuan to be paid back tomorrow;a bike given for the weekend;books not given to people who lose things|you lend something to someone; you borrow something from someone|lend 是借给别人；borrow 是向别人借|borrow/borrowed=borrow means taking something from someone, so you cannot borrow something to someone or borrow someone a thing=borrow 是向别人借，不能“borrow 给别人”;save/saved=save means keeping money for later, not giving something to someone for a short time=save 是存钱，不是把东西暂时借给别人|lend|past: lent, not *lended*|过去式是 lent，不是 *lended*
      rich|someone who bought a big house by the sea;the man in town with five cars;people who had nothing ten years ago|rich means having a lot of money; poor means having very little|rich 是有钱；poor 是没钱|poor/poorest=poor means having very little money, the opposite of rich=poor 是钱很少，和 rich 意思相反;cheap/cheapest=cheap describes things with a low price, not people with a lot of money=cheap 形容价钱低的东西，不形容有很多钱的人|rich|ch at the end, and -er, -est after it|结尾是 ch，比较级 -er，最高级 -est
      poor|a family who couldn't pay for school;families who can't buy enough to eat;a village with no electricity|poor means having very little money; cheap means with a low price|poor 是贫穷；cheap 是便宜|rich=rich means having a lot of money, the opposite of poor=rich 是有很多钱，和 poor 意思相反;cheap=cheap describes things with a low price, not families or villages with little money=cheap 形容价钱低的东西，不形容没钱的家庭或村子|poor|oo said like *or*|oo 读作 *or*
      cost|the price of a jacket;tickets at two hundred yuan each;food that is going up|a thing costs money; a person spends or pays money|东西 cost（值）多少钱；人 spend 或 pay 钱|spend=spend is what a person does with money, so a jacket or a ticket does not spend, and the noun for a price is *cost*=spend 是人花钱，夹克或门票不会 spend，表示价钱的名词是 *cost*;pay=pay is what a person does, so a jacket or a ticket does not pay, and food has a cost, not a pay=pay 是人付钱，夹克或门票不会 pay，食物说 cost 不说 pay|cost|the past is also *cost*|过去式也是 *cost*
      thousand|a laptop at 5,000 yuan;more than 4,000 people at a parade;meters in a kilometer|a thousand is 1,000; a hundred is 100|thousand 是 1000；hundred 是 100|hundred/Hundreds=hundred is 100, ten times smaller than a thousand=hundred 是 100，比一千小十倍;million/Millions=million is 1,000,000, a thousand times more than a thousand=million 是 1,000,000，是一千的一千倍|thou · sand|ou, as in *house*, and no -s after a number: *five thousand*|ou 和 *house* 里的一样；数字后面不加 -s：*five thousand*
    `,
  },
});

const shops = vocabularyTopic({
  id: "a2-words-shops",
  title: t("Shops", "商店"),
  summary: t(
    "Supermarkets, malls and bookstores; customers and cashiers; receipts, discounts, sales and bargains; choices, choosing, ordering and delivering.",
    "超市、商场和书店；顾客和收银员；小票、折扣、促销和便宜货；选择、挑选、订购和送货。",
  ),
  intro: t(
    "In the **sale** at the **mall**, Mom found a coat at a 30% **discount**, and the **cashier** gave her a **receipt**. These words help you shop, pay and talk about good prices.",
    "在 **mall**（商场）的 **sale**（促销）里，妈妈找到一件打 30% **discount**（折扣）的外套，**cashier**（收银员）给了她一张 **receipt**（小票）。这些词帮你购物、付钱，以及谈论划算的价钱。",
  ),
  prerequisites: ["a2-words-money"],
  words: [
    word(
      "supermarket supermarkets",
      "a big shop that sells food and things for the home",
      "超市",
      "We buy milk, bread and fruit at the {supermarket}, the big food shop near our flat. | The {supermarket} near our flat sells food and things for the home, and it is open until ten. | Mom pushed the cart full of food around the {supermarket}.",
      "bookstore mall",
    ),
    word(
      "mall malls",
      "a big building with many shops inside",
      "商场；购物中心",
      "There's a cinema on the top floor of the {mall}. | Let's meet at the {mall} and go shopping in its many shops. | The new {mall} has more than two hundred shops.",
      "supermarket market",
    ),
    word(
      "bookstore bookstores",
      "a shop that sells books",
      "书店",
      "I bought this dictionary at the {bookstore}. | The {bookstore} sells new books, and it has a quiet corner where you can read before you buy. | She works in a {bookstore}, selling new novels to customers.",
      "library supermarket",
    ),
    word(
      "customer customers",
      "a person who buys things in a shop",
      "顾客",
      "The shop was full of {customers} buying presents on Saturday.|cashiers guests | The cashier smiled at the {customer} who was paying for her bread. | Our {customers} can return things they bought within seven days.|cashiers guests",
      "cashier guest",
    ),
    word(
      "cashier cashiers",
      "a person who takes the money in a shop",
      "收银员",
      "Pay the {cashier} at the front of the shop. | The {cashier} at the supermarket gave me my change and a receipt. | My cousin works as a {cashier} at the supermarket.",
      "customer waiter",
    ),
    word(
      "receipt receipts",
      "a piece of paper that shows what you paid",
      "收据；小票",
      "Keep the {receipt} that shows what you paid if you want to return the shirt. | The {receipt} shows that I paid 45 yuan. | I've paid, so can I have a {receipt} for the taxi, please?",
      "bill ticket",
    ),
    word(
      "discount discounts",
      "an amount of money taken off a price",
      "折扣",
      "Students get a 10% {discount}, so they pay less at the cinema. | Can you give me a {discount} and take some money off if I buy two? | There are big {discounts} on winter coats this week: 30% off every coat.|prices receipts",
      "price receipt",
    ),
    word(
      "sale sales",
      "a time when a shop sells things for less; the selling of something",
      "促销；出售",
      "I bought these boots in the {sale}, a week when the shop sold everything for half price. | The house next to ours is for {sale}. | The summer {sales} are a time when many shops sell things for less.|discounts bargains",
      "discount bargain",
    ),
    word(
      "bargain bargains",
      "something you buy for less than its usual price",
      "便宜货；划算的东西",
      "Only 20 yuan for this good jacket? It's a {bargain}: I'm buying it! | You can buy {bargains} at the night market: good things for very little money.|discounts sales | This bike was a real {bargain}: I bought it for half its usual price.",
      "discount sale",
    ),
    word(
      "choose chooses chose chosen choosing",
      "to decide which one you want",
      "选择；挑选",
      "I can't {choose} between the red dress and the blue one. | She looked at ten phones and {chose} the cheapest one, because she didn't have much money.|delivered lent | Have you {chosen} which present to buy for Dad yet?|delivered lent",
      "deliver lend",
    ),
    word(
      "order orders ordered ordering",
      "to ask for food in a restaurant, or for goods to be sent to you",
      "点（菜）；订购",
      "Are you ready to {order}? Tell the waiter what you want to eat. | I {ordered} a new phone online last week.|delivered lent | Your {order} of two books from the online shop will arrive at your door on Friday.|choice receipt",
      "deliver lend",
    ),
    word(
      "deliver delivers delivered delivering",
      "to take goods or letters to a person's home",
      "递送；送货",
      "The shop will {deliver} the sofa to our home on Monday. | A man on a motorbike {delivers} our pizza to our door.|orders chooses | The postman {delivered} a big box to our door this morning.|ordered chose",
      "order choose",
    ),
    word(
      "choice choices",
      "the act of choosing, or the things you can choose from",
      "选择",
      "You have a {choice} of tea or coffee. | It was a difficult {choice}, but I chose the red dress. | We had no {choice} but to walk home: the last bus had left. | The shop has lots of {choices} for lunch: you can pick from ten dishes.|voices ideas",
      "voice idea",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Customer* and *cashier* are the two people at the till: the *customer* buys and pays, and the *cashier* works in the shop and takes the money. Ask who is buying and who is working.",
        "*customer* 和 *cashier* 是收银台前的两个人：*customer*（顾客）买东西付钱，*cashier*（收银员）在店里工作、收钱。想想谁在买，谁在工作。",
      ),
      meaning: t(
        "A *discount*, a *sale* and a *bargain* are all about paying less: a *discount* is the money taken off, a *sale* is the time when shops sell things for less, and a *bargain* is the thing you buy cheaply.",
        "*discount*、*sale* 和 *bargain* 都和少花钱有关：*discount* 是减掉的钱，*sale* 是商店减价出售的时间，*bargain* 是你便宜买到的东西。",
      ),
      spell: t(
        "*Receipt* has a silent p: re · ceipt, said like *ree-seet*, with ei after c. *Choose* has a double o, but its past *chose* has one.",
        "*receipt* 里的 p 不发音：re · ceipt，读作 *ree-seet*，c 后面是 ei。*choose* 有两个 o，过去式 *chose* 只有一个。",
      ),
    },
    notes: `
      supermarket|the big food shop near our flat;a shop open until ten that sells food and things for the home;a cart full of food|a supermarket is a big shop for food; a mall is a building with many shops|supermarket 是卖食物的大商店；mall 是有许多商店的大楼|bookstore=bookstore is a shop that sells books, not food=bookstore 是卖书的店，不卖食物;mall=mall is a big building with many shops inside, not one shop that sells food=mall 是里面有许多商店的大楼，不是一家卖食物的店|su · per · mar · ket|super + market, one word|super + market，合成一个词
      mall|a cinema on the top floor;going shopping in many shops;more than two hundred shops|a mall is a building with many shops; a supermarket is one big food shop|mall 是有许多商店的大楼；supermarket 是一家卖食物的大店|supermarket=supermarket is one big shop that sells food, not a building with many shops and a cinema inside=supermarket 是一家卖食物的大店，不是里面有许多商店和电影院的大楼;market=market is sellers at tables, often outside, not a building with floors and many shops=market 是常在露天摆摊的卖家，不是有楼层和许多商店的大楼|mall|a said like *or*, and the double l|a 读作 *or*，双写 l
      bookstore|buying a dictionary;new books and a corner to read before buying;selling new novels to customers|a bookstore sells books; a library lends them for free|bookstore 卖书；library 免费借书|library=library lends books for free, and you do not buy or sell them there=library 免费借书，不在那里买卖书;supermarket=supermarket sells food and things for the home, not dictionaries and novels=supermarket 卖食物和家居用品，不卖词典和小说|book · store|book + store, one word; British English says *bookshop*|book + store，合成一个词；英式英语说 *bookshop*
      customer|a shop full of people buying presents;someone paying for her bread;people returning what they bought|a customer buys things in a shop; a cashier takes the money|customer 是在店里买东西的人；cashier 是收钱的人|cashier/cashiers=cashier works in the shop and takes the money, not a person who buys things=cashier 在店里工作、收钱，不是买东西的人;guest/guests=guest is a person you invite to your home or a party, not a person who buys things in a shop=guest 是你请到家里或派对的人，不是在店里买东西的人|cus · tom · er|cust- with a u, and -er at the end|cust- 里是 u，结尾是 -er
      cashier|paying at the front of a shop;getting change and a receipt at a supermarket;a cousin's job at a supermarket|a cashier takes the money in a shop; a customer pays it|cashier 在店里收钱；customer 付钱|customer=customer buys things and pays, not the person who takes the money=customer 是买东西付钱的人，不是收钱的人;waiter=waiter brings food to tables in a restaurant, not the person who takes money in a shop=waiter 在餐馆给桌子送菜，不是在商店收钱的人|cash · ier|cash + -ier, said like *ka-sheer*|cash 加 -ier，读作 *ka-sheer*
      receipt|paper that shows what you paid for a shirt;paper showing 45 yuan paid;paper for a taxi after paying|a receipt shows what you have paid; a bill shows what you must pay|receipt 显示你已付的钱；bill 显示你要付的钱|bill=bill shows what you must pay before you pay, not paper that shows what you have already paid=bill 是付钱前告诉你要付多少的单子，不是证明已付钱的小票;ticket=ticket lets you get on a train or into a show, not paper that shows what you paid=ticket 是乘车或进场用的票，不是证明付了钱的小票|re · ceipt|a silent p, and ei after c|p 不发音，c 后面是 ei
      discount|students paying less at the cinema;money taken off for buying two;30% off every winter coat|a discount is money taken off a price; the price is the whole amount|discount 是从价钱里减掉的钱；price 是全部价钱|price/prices=price is the whole amount you pay, not money taken off it=price 是你付的全部价钱，不是减掉的钱;receipt/receipts=receipt is paper that shows what you paid, not money taken off a price=receipt 是证明付了多少钱的小票，不是减掉的钱|dis · count|dis- + count|dis- + count
      sale|a week when boots were half price;a house next to ours;a time when shops sell things for less|a sale is a time when shops sell things for less; a discount is the money taken off|sale 是商店减价出售的时间；discount 是减掉的钱|discount/discounts=discount is an amount of money taken off a price, not a time when shops sell things for less or the selling of a house=discount 是减掉的钱，不是减价出售的时间，也不是房子出售;bargain/bargains=bargain is one thing bought for less, not a time or the selling of something=bargain 是便宜买到的东西，不是一段时间，也不是出售|sale|a that says its name; *for sale* means someone wants to sell it|a 读字母本音；*for sale* 表示有人想卖
      bargain|a good jacket for only 20 yuan;good things for very little money at a night market;a bike bought for half its usual price|a bargain is a thing you buy for less than usual; a discount is the money taken off|bargain 是便宜买到的东西；discount 是减掉的钱|discount/discounts=discount is the money taken off a price, not the thing you buy=discount 是减掉的钱，不是你买到的东西;sale/sales=sale is a time when shops sell things for less, not the thing you buy=sale 是减价出售的时间，不是你买到的东西|bar · gain|-gain at the end, said like *gin*|结尾 -gain 读作 *gin*
      choose|a red dress or a blue one;the cheapest of ten phones;which present to buy for Dad|choose means deciding which one you want; deliver means taking goods to a home|choose 是挑选；deliver 是送货上门|deliver/delivered=deliver means taking goods to someone's home, not deciding which one you want=deliver 是送货上门，不是决定要哪一个;lend/lent=lend means giving something to someone for a short time, not deciding which one you want=lend 是把东西暂时借给别人，不是决定要哪一个|choose|choose, chose, chosen: double o only in *choose*|choose、chose、chosen：只有 *choose* 有两个 o
      order|telling the waiter what to eat;a new phone bought online;two books arriving at the door on Friday|order means asking for food or goods; deliver means taking goods to a home|order 是点菜或订购；deliver 是送货上门|deliver/delivered=deliver is what the shop does when it takes goods to your home, not what you do when you ask for them=deliver 是商店把货送到你家，不是你下单;lend/lent=lend means giving something for a short time, not asking for food or goods=lend 是暂时借给别人，不是点菜或订购;choice=choice is choosing or the things you can choose from, and it does not arrive at your door=choice 是选择或可选的东西，不会送到你家门口;receipt=receipt is paper that shows what you paid, not books that arrive at your door=receipt 是证明付了钱的小票，不是送到家门口的书|or · der|or + -der|or + -der
      deliver|a sofa brought to our home;pizza brought to our door by motorbike;a big box brought to our door|deliver means taking goods to a home; order means asking for them|deliver 是送货上门；order 是订购|order/orders/ordered=order means asking for goods to be sent to you, not taking them to someone's door=order 是请人把货送来，不是把货送到别人门口;choose/chooses/chose=choose means deciding which one you want, not taking goods to a home=choose 是挑选，不是送货上门|de · liv · er|de- + liver|de- + liver
      choice|tea or coffee;the red dress chosen after a hard time;walking home after the last bus;ten dishes for lunch|a choice is choosing or the things you can choose from; choose is the verb|choice 是选择（名词）；choose 是动词|voice/voices=voice is the sound you make when you speak or sing, not things you choose from=voice 是说话或唱歌的声音，不是可选的东西;idea/ideas=idea is a thought, not the act of choosing or the things you can choose from=idea 是想法，不是选择或可选的东西|choice|oi, as in *voice*, and -ce at the end|oi 和 *voice* 里的一样，结尾是 -ce
    `,
  },
});

const thingsWeBuy = vocabularyTopic({
  id: "a2-words-things-we-buy",
  title: t("Things We Buy", "我们买的东西"),
  summary: t(
    "Rings and necklaces; gloves, scarves, boots and belts; sunglasses, uniforms, jeans and sweaters; pockets.",
    "戒指和项链；手套、围巾、靴子和腰带；太阳镜、制服、牛仔裤和毛衣；口袋。",
  ),
  intro: t(
    "For the winter trip, Sam bought a warm **sweater**, a pair of **gloves**, a long **scarf** and leather **boots**. These words help you name the clothes and things you wear, buy and give as presents.",
    "为了冬天的旅行，萨姆买了一件暖和的 **sweater**（毛衣）、一副 **gloves**（手套）、一条长长的 **scarf**（围巾）和一双皮 **boots**（靴子）。这些词帮你说出你穿戴、购买和送人的衣物。",
  ),
  prerequisites: ["a2-words-shops"],
  words: [
    word(
      "ring rings",
      "a round piece of jewelry that you wear on your finger",
      "戒指",
      "He put a gold {ring} on her finger when they got married. | She wears a {ring} on her finger. | I took the {ring} off my finger to wash my hands, and then I lost it.",
      "necklace glove",
    ),
    word(
      "necklace necklaces",
      "jewelry that you wear around your neck",
      "项链",
      "She wore a silver {necklace} of tiny chains around her neck. | This {necklace}, made of small white stones, hangs around my neck. | Grandma gave me her old pearl {necklace} to wear around my neck.",
      "ring scarf",
    ),
    word(
      "glove gloves",
      "a thing you wear on your hand to keep it warm",
      "手套",
      "It's cold. Put on your {gloves} to keep your hands warm.|socks rings | I can't type with thick {gloves} on my hands.|socks rings | I lost one {glove} on the bus, so now one hand is cold.",
      "sock ring",
    ),
    word(
      "scarf scarves",
      "a long piece of cloth that you wear around your neck",
      "围巾",
      "Wear a warm {scarf} around your neck. | My aunt knitted me a long wool {scarf} to wear around my neck. | She has lots of colorful {scarves} to wear around her neck.|belts gloves",
      "belt glove",
    ),
    word(
      "boot boots",
      "a shoe that covers your foot and part of your leg",
      "靴子",
      "Wear your tall rubber {boots}: it's muddy outside.|gloves socks | These leather {boots} keep my feet warm.|gloves socks | She bought a pair of tall black leather {boots} that come up to her knees.|gloves socks",
      "glove sock",
    ),
    word(
      "belt belts",
      "a long thin piece of leather or cloth that you wear around your middle",
      "腰带",
      "These jeans are too big around my middle, so I need a {belt}. | He wears a brown leather {belt} around his middle with his jeans. | Fasten your seat {belt}, please.",
      "scarf ring",
    ),
    word(
      "sunglasses",
      "dark glasses that keep the sun out of your eyes",
      "太阳镜；墨镜",
      "It's very sunny. Put on your dark {sunglasses} to keep the sun out of your eyes. | He was wearing {sunglasses}, so I couldn't see his eyes. | I sat on my {sunglasses} on the sunny beach and broke the dark lenses.",
      "glasses gloves",
    ),
    word(
      "uniform uniforms",
      "special clothes that people wear at school or at work",
      "制服；校服",
      "At our school, all students wear the same {uniform} every day. | Police officers wear a blue {uniform} at work, so everyone knows they are police. | Our school {uniform} is a white shirt and black trousers.",
      "costume sweater",
    ),
    word(
      "jeans",
      "trousers made of strong blue cotton",
      "牛仔裤",
      "I usually wear blue {jeans} on my legs and a T-shirt. | These {jeans} are too long for my legs. | My blue {jeans} have a hole in the knee.",
      "sweater belt",
    ),
    word(
      "sweater sweaters",
      "a warm piece of clothing with long arms, often made of wool",
      "毛衣",
      "Put on a {sweater} with long arms. It's cold. | Grandma knitted me a red {sweater} with long arms. | This wool {sweater} keeps my arms and body warm in winter.",
      "scarf jeans",
    ),
    word(
      "pocket pockets",
      "a small bag sewn into clothes for keeping things in",
      "口袋；衣兜",
      "I put my keys in the {pocket} of my jeans. | This jacket has four {pockets}.|wallets bags | There's a hole in the {pocket} of my coat, so I lost my coins.",
      "wallet bag",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Jeans* and *sunglasses* are always plural, even for one thing: say *my jeans are*, *these sunglasses*, and *a pair of jeans*, never *a jean*.",
        "*jeans* 和 *sunglasses* 总用复数，即使只有一件：说 *my jeans are*、*these sunglasses*、*a pair of jeans*，不能说 *a jean*。",
      ),
      meaning: t(
        "Each thing has its own place on the body: a *ring* on a finger, a *necklace* and a *scarf* around the neck, *gloves* on the hands, a *belt* around the middle and *boots* on the feet.",
        "每样东西都有自己在身上的位置：*ring* 戴在手指上，*necklace* 和 *scarf* 围在脖子上，*gloves* 戴在手上，*belt* 系在腰间，*boots* 穿在脚上。",
      ),
      spell: t(
        "*Scarf* becomes *scarves* in the plural: f changes to v. *Necklace* is neck + lace, with a silent e at the end.",
        "*scarf* 的复数是 *scarves*：f 变成 v。*necklace* 是 neck + lace，结尾的 e 不发音。",
      ),
    },
    notes: `
      ring|a gold one put on a finger at a wedding;something worn on a finger;something taken off a finger to wash hands|a ring goes on your finger; a necklace goes around your neck|ring 戴在手指上；necklace 戴在脖子上|necklace=necklace goes around your neck, not on your finger=necklace 戴在脖子上，不戴在手指上;glove=glove covers your whole hand to keep it warm, not one finger=glove 套住整只手保暖，不是只戴在一根手指上|ring|-ing, as in *sing*|-ing 和 *sing* 里的一样
      necklace|tiny silver chains around a neck;small white stones hanging around a neck;Grandma's old pearls|a necklace is jewelry around your neck; a scarf is cloth around your neck|necklace 是戴在脖子上的首饰；scarf 是围在脖子上的布|ring=ring goes on your finger, not around your neck=ring 戴在手指上，不戴在脖子上;scarf=scarf is a long piece of cloth, not jewelry made of chains, stones or pearls=scarf 是长长的布，不是链子、石头或珍珠做的首饰|neck · lace|neck + lace, one word|neck + lace，合成一个词
      glove|keeping hands warm in the cold;typing with something thick on the hands;one cold hand after losing something on a bus|a glove goes on your hand; a sock goes on your foot|glove 戴在手上；sock 穿在脚上|sock/socks=sock goes on your foot, not your hand=sock 穿在脚上，不戴在手上;ring/rings=ring is jewelry on one finger, and it does not keep your hand warm=ring 是戴在一根手指上的首饰，不能给手保暖|glove|o said like u, as in *love*|o 读作 u，和 *love* 一样
      scarf|something warm around a neck;a long wool thing an aunt knitted;colorful things for a neck|a scarf goes around your neck; a belt goes around your middle|scarf 围在脖子上；belt 系在腰间|belt/belts=belt goes around your middle, not around your neck=belt 系在腰间，不围在脖子上;glove/gloves=glove goes on your hand, not around your neck=glove 戴在手上，不围在脖子上|scarf|plural *scarves*, with f changed to v|复数是 *scarves*，f 改成 v
      boot|tall rubber things for mud outside;leather things that keep feet warm;tall black leather things up to the knees|a boot covers your foot and part of your leg; a glove is for your hand|boot 包住脚和一部分腿；glove 是戴在手上的|glove/gloves=gloves go on your hands, not on your feet and legs=gloves 戴在手上，不穿在脚上和腿上;sock/socks=socks are soft cloth, not rubber or leather=socks 是软布做的，不是橡胶或皮革做的|boot|oo, as in *food*|oo 和 *food* 里的一样
      belt|jeans too big around the middle;brown leather around the middle with jeans;something for a seat in a car|a belt goes around your middle; a scarf goes around your neck|belt 系在腰间；scarf 围在脖子上|scarf=scarf goes around your neck, not around your middle or a car seat=scarf 围在脖子上，不系在腰间，也不是座椅上的;ring=ring is jewelry on your finger, not something around your middle=ring 是戴在手指上的首饰，不是系在腰间的|belt|-lt at the end|结尾是 -lt
      sunglasses|dark glasses that keep out the sun;eyes no one could see;dark lenses broken on a sunny beach|sunglasses are dark and keep the sun out; glasses help you see better|sunglasses 是深色的，挡住阳光；glasses 帮你看得更清楚|glasses=glasses are clear and help you see better, and they do not keep out the sun or hide your eyes=glasses 是透明的，帮你看清楚，不挡阳光，也不遮住眼睛;gloves=gloves are worn on your hands, not over your eyes=gloves 戴在手上，不戴在眼睛上|sun · glass · es|sun + glasses, one word, always plural|sun + glasses 合成一个词，总用复数
      uniform|the same clothes for all students every day;blue clothes that show someone is police;a white shirt and black trousers for school|a uniform is the same clothes for a school or a job; a costume is for a play or a party|uniform 是学校或工作的统一服装；costume 是演出或派对的装扮服|costume=costume is clothes for a play or a party that make you look like someone else, not clothes worn every day for school or work=costume 是演出或派对时装扮成别人的服装，不是上学或工作天天穿的;sweater=sweater is one warm piece of clothing, not the special clothes everyone at a school or job wears=sweater 是一件保暖的衣服，不是学校或工作里人人都穿的统一服装|u · ni · form|uni- with u that says its name|uni- 里的 u 读字母本音
      jeans|blue things on the legs with a T-shirt;something too long for the legs;blue things with a hole in the knee|jeans are blue cotton trousers; a sweater is warm with long arms|jeans 是蓝色棉布裤；sweater 是有长袖的保暖衣|sweater=sweater is warm clothing with long arms for your body, not trousers for your legs=sweater 是有长袖、穿在身上的保暖衣，不是穿在腿上的裤子;belt=belt goes around your middle, and it has no legs or knees=belt 系在腰间，没有裤腿，也没有膝盖|jeans|always plural: *my jeans are*|总用复数：*my jeans are*
      sweater|something with long arms to put on in the cold;a red thing with long arms Grandma knitted;wool that keeps arms and body warm|a sweater is warm with long arms; a scarf goes around your neck|sweater 是有长袖的保暖衣；scarf 围在脖子上|scarf=scarf goes around your neck and has no arms=scarf 围在脖子上，没有袖子;jeans=jeans are trousers you wear on your legs, not something with long arms for your body=jeans 是穿在腿上的裤子，不是有长袖、穿在身上的衣服|sweat · er|ea said like short e, as in *sweat*|ea 读短元音 e，和 *sweat* 一样
      pocket|keys in a part of jeans;four of them on a jacket;a hole in a part of a coat|a pocket is part of your clothes; a wallet is a small case you carry|pocket 是衣服的一部分；wallet 是随身带的小钱夹|wallet/wallets=wallet is a small case for money and cards, not part of your clothes=wallet 是装钱和卡的小夹子，不是衣服的一部分;bag/bags=bag is something you carry, not part of your clothes=bag 是拎着的包，不是衣服的一部分|pock · et|ck in the middle, and -et at the end|中间是 ck，结尾是 -et
    `,
  },
});

const materials = vocabularyTopic({
  id: "a2-words-materials",
  title: t("Materials", "材料"),
  summary: t(
    "Cotton, wool and leather; plastic, metal, gold and silver; wooden things; heavy, thick and thin.",
    "棉、羊毛和皮革；塑料、金属、金和银；木制的东西；重、厚和薄。",
  ),
  intro: t(
    "My grandfather's **wooden** box holds a **leather** belt, a **wool** hat and a **silver** watch, and it is so **heavy** I can't lift it. These words help you say what things are made of and how they feel.",
    "爷爷的 **wooden**（木制的）箱子里装着一条 **leather**（皮革）腰带、一顶 **wool**（羊毛）帽子和一块 **silver**（银）手表，箱子 **heavy**（重）得我搬不动。这些词帮你说出东西是什么材料做的，摸起来怎么样。",
  ),
  prerequisites: ["a2-words-things-we-buy"],
  words: [
    word(
      "cotton",
      "a soft cloth made from a plant",
      "棉；棉布",
      "This light summer T-shirt is made of {cotton}, from a plant. | {Cotton} shirts are cool in summer.|Wool Leather | {Cotton} grows on a plant in hot places.|Wool Leather",
      "wool leather",
    ),
    word(
      "wool",
      "the soft hair of sheep, made into cloth",
      "羊毛",
      "A {wool} sweater, made from sheep's hair, is very warm. | Sheep give us {wool}. | Grandma knits warm hats from the {wool} of her sheep.",
      "cotton leather",
    ),
    word(
      "leather",
      "the skin of an animal made into a material for shoes and bags",
      "皮革",
      "These shoes are made of {leather}, the skin of a cow. | {Leather} comes from the skin of cows.|Wool Plastic | He has a brown {leather} jacket made from cow skin.",
      "wool plastic",
    ),
    word(
      "plastic",
      "a light material made in factories, used for bottles and bags",
      "塑料",
      "Water bottles from the shop are usually made of {plastic}, a light material that factories make from oil. | Bring your own bag. {Plastic} bags are bad for the ocean.|Metal Glass | The toy is soft {plastic}, so it won't break or hurt you if you drop it.",
      "metal glass",
    ),
    word(
      "metal metals",
      "a hard material such as iron, gold or silver",
      "金属",
      "The gate is made of {metal}, like iron, so it is very strong. | Gold and silver are {metals}.|plastics woods | {Metal}, like iron or gold, gets hot quickly in the sun.|Plastic Wood",
      "plastic wood",
    ),
    word(
      "gold",
      "a yellow metal that costs a lot of money",
      "金子；金色的",
      "Her ring is made of yellow {gold}, which costs a lot. | The winner gets a {gold} medal, and second place gets silver. | {Gold}, the yellow metal, costs much more than plastic.|Silver Plastic",
      "silver plastic",
    ),
    word(
      "silver",
      "a shiny white-gray metal",
      "银；银色的",
      "She won a {silver} medal for coming second. | Grandma's shiny white-gray {silver} necklace is very old. | Grandma's old forks and spoons are made of shiny white-gray {silver}.",
      "gold plastic",
    ),
    word(
      "wooden",
      "made of wood",
      "木制的",
      "We sat at a big {wooden} table that Dad made from an old tree. | The {wooden} house was built by my grandfather from trees in the forest. | The children played with {wooden} blocks cut from trees.",
      "metal plastic",
    ),
    word(
      "material materials",
      "what something is made of; cloth",
      "材料；布料",
      "What {material} is this coat made of? — Wool. | Plastic is a cheap {material}. | You need paper, glue and other {materials} for this project.|metals plastics",
      "metal plastic",
    ),
    word(
      "heavy heavier heaviest",
      "weighing a lot; hard to lift",
      "重的",
      "This box is too {heavy} for me to carry. | Metal is {heavier} than plastic.|lighter thicker | The elephant is the {heaviest} animal on land.|lightest thickest",
      "light thick",
    ),
    word(
      "thick thicker thickest",
      "big from one side to the other; not thin",
      "厚的",
      "This book is very {thick} from cover to cover: it has 800 pages. | In winter I wear a {thick} wool sweater, not a thin one, but it weighs very little. | The walls of the castle are two meters {thick}.",
      "thin heavy",
    ),
    word(
      "thin thinner thinnest",
      "not thick; not fat",
      "薄的；瘦的",
      "This paper is so {thin} that you can see through it. | He's very {thin} because he doesn't eat much. | Cut the bread into {thin} slices, each only half a centimeter from side to side.",
      "thick fat",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Wood* is the material and *wooden* describes a thing made of it: say *made of wood*, but *a wooden table*. Most other materials stay the same before a noun: *a gold ring*, *a cotton shirt*.",
        "*wood* 是材料，*wooden* 形容用它做的东西：说 *made of wood*，但说 *a wooden table*。大多数其他材料放在名词前不变：*a gold ring*、*a cotton shirt*。",
      ),
      meaning: t(
        "*Cotton* comes from a plant, *wool* from the hair of sheep and *leather* from the skin of animals, while *plastic* is made in factories. Ask where the material comes from.",
        "*cotton* 来自植物，*wool* 来自羊毛，*leather* 来自动物的皮，而 *plastic* 是工厂里制造的。想想这种材料从哪里来。",
      ),
      spell: t(
        "*Leather* has ea said like short e and -ther at the end: lea · ther. *Wool* has a double o said short, as in *good*.",
        "*leather* 的 ea 读短元音 e，结尾是 -ther：lea · ther。*wool* 的两个 o 读短音，和 *good* 一样。",
      ),
    },
    notes: `
      cotton|a light summer T-shirt from a plant;shirts that are cool in summer;something growing on a plant in hot places|cotton comes from a plant; wool comes from sheep|cotton 来自植物；wool 来自羊|wool/Wool=wool comes from sheep, not from a plant, and it is warm, not cool=wool 来自羊，不来自植物，而且它暖和，不凉快;leather/Leather=leather is made from animal skin, not from a plant=leather 是动物的皮做的，不来自植物|cot · ton|the double t, and -on at the end|双写 t，结尾是 -on
      wool|a warm sweater from sheep's hair;what sheep give us;warm hats from Grandma's sheep|wool is the hair of sheep; cotton comes from a plant|wool 是羊毛；cotton 来自植物|cotton=cotton comes from a plant, not from sheep=cotton 来自植物，不来自羊;leather=leather is animal skin, not soft sheep's hair=leather 是动物的皮，不是软软的羊毛|wool|oo said short, as in *good*|oo 读短音，和 *good* 一样
      leather|shoes from the skin of a cow;what comes from cow skin;a brown jacket from cow skin|leather is made from animal skin; wool is sheep's hair|leather 是动物皮做的；wool 是羊毛|wool/Wool=wool is the soft hair of sheep, not animal skin=wool 是软软的羊毛，不是动物的皮;plastic/Plastic=plastic is made in factories, not from an animal's skin=plastic 是工厂制造的，不是动物的皮|lea · ther|ea said like short e, and -ther at the end|ea 读短元音 e，结尾是 -ther
      plastic|light water bottles made from oil;bags that are bad for the ocean;a soft toy that won't break|plastic is a light material made in factories; metal is hard and heavy|plastic 是工厂制造的轻材料；metal 又硬又重|metal/Metal=metal is hard and heavy, like iron or gold, so it is not used for light shopping bags, light bottles or soft toys=metal 又硬又重，如铁和金，不用来做轻便的购物袋、瓶子或软玩具;glass/Glass=glass breaks easily and is not made from oil, so it is not used for shopping bags or soft toys=glass 容易碎，也不是用油做的，不用来做购物袋或软玩具|plas · tic|-ic at the end|结尾是 -ic
      metal|a strong gate like iron;gold and silver;something like iron that gets hot in the sun|metal is a hard material like iron or gold; plastic is light and made in factories|metal 是像铁和金那样的硬材料；plastic 轻，由工厂制造|plastic/plastics/Plastic=plastic is a light material made in factories, not iron, gold or silver=plastic 是工厂制造的轻材料，不是铁、金或银;wood/woods/Wood=wood comes from trees, not iron, gold or silver=wood 来自树木，不是铁、金或银|met · al|-al at the end, not *medal*|结尾是 -al，别和 *medal* 弄混
      gold|a yellow ring that costs a lot;the medal for the winner;the yellow metal that costs more than plastic|gold is a yellow metal; silver is white-gray|gold 是黄色的金属；silver 是银白色的|silver/Silver=silver is white-gray, not yellow, and a silver medal is for coming second=silver 是银白色的，不是黄色，银牌是第二名的;plastic/Plastic=plastic is cheap and made in factories, not a yellow metal that costs a lot or a winner's medal=plastic 便宜，由工厂制造，不是昂贵的黄色金属，也不是冠军的奖牌|gold|-old, as in *old*|-old 和 *old* 一样
      silver|the medal for coming second;Grandma's old shiny white-gray necklace;shiny white-gray forks and spoons|silver is a white-gray metal; gold is yellow|silver 是银白色的金属；gold 是黄色的|gold=gold is yellow and its medal is for first place, not white-gray or for second=gold 是黄色的，金牌是第一名的，不是银白色，也不是第二名的;plastic=plastic is cheap and made in factories, not a shiny metal or a medal for second place=plastic 便宜，由工厂制造，不是闪亮的金属，也不是第二名的奖牌|sil · ver|-er at the end|结尾是 -er
      wooden|a big table Dad made from an old tree;a house built from forest trees;blocks cut from trees|wooden means made of wood; metal is iron, gold or silver|wooden 是木制的；metal 是铁、金、银之类|metal=metal is iron, gold or silver, not made from trees=metal 是铁、金、银之类，不是用树做的;plastic=plastic is made in factories, not from trees=plastic 是工厂制造的，不是用树做的|wood · en|wood + -en|wood 加 -en
      material|what a coat is made of;plastic being cheap;paper, glue and other things for a project|material is what something is made of; metal and plastic are kinds of material|material 是东西的材料；metal 和 plastic 是材料的种类|metal/metals=metal is one kind of material, like iron, not every kind, and paper, glue or wool are not metals=metal 只是一种材料，如铁，不是所有材料，纸、胶水和羊毛都不是金属;plastic/plastics=plastic is one kind of material, and paper, glue or wool are not plastic=plastic 只是一种材料，纸、胶水和羊毛都不是塑料|ma · te · ri · al|-ial at the end|结尾是 -ial
      heavy|a box too hard to carry;metal and plastic;the elephant on land|heavy means weighing a lot; light means weighing little|heavy 是重；light 是轻|light/lighter/lightest=light means weighing little, the opposite of heavy=light 是轻，和 heavy 意思相反;thick/thicker/thickest=thick means big from one side to the other, not weighing a lot=thick 是厚，不是重|heav · y|ea said like short e, and y changes to i: *heavier*|ea 读短元音 e，y 改 i：*heavier*
      thick|a book of 800 pages from cover to cover;a warm wool sweater that weighs little;castle walls two meters across|thick means big from one side to the other; thin means not thick|thick 是厚；thin 是薄|thin=thin means not thick, the opposite of big from one side to the other=thin 是薄，和厚正相反;heavy=heavy means weighing a lot, not big from one side to the other=heavy 是重，不是厚|thick|th at the start, and ck at the end|开头是 th，结尾是 ck
      thin|paper you can see through;someone who doesn't eat much;bread slices half a centimeter across|thin means not thick or not fat; thick means big from one side to the other|thin 是薄或瘦；thick 是厚|thick=thick means big from one side to the other, the opposite of thin=thick 是厚，和 thin 意思相反;fat=fat means having a big round body, the opposite of thin=fat 是胖，和 thin 意思相反|thin|double the n: *thinner*, *thinnest*|双写 n：*thinner*、*thinnest*
    `,
  },
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

/** sizeThings are a thing, its pronoun, its forms of be, what you do with it, adjectives that make it too much and ones that make it enough. */
const sizeThings: readonly (readonly [string, string, string, string, string, readonly string[], readonly string[]])[] = [
  ["this jacket", "It", "'s", " isn't", "wear", ["small", "big", "tight", "short", "thin"], ["big", "warm", "long", "thick"]],
  ["these boots", "They", "'re", " aren't", "wear", ["small", "big", "tight", "heavy"], ["big", "warm", "strong", "light"]],
  ["this box", "It", "'s", " isn't", "carry", ["heavy", "big", "wide"], ["light", "small"]],
  ["this bag", "It", "'s", " isn't", "take on the plane", ["big", "heavy", "long"], ["small", "light"]],
  ["the ladder", "It", "'s", " isn't", "use to reach the roof", ["short", "old"], ["long", "tall", "strong"]],
  ["this rope", "It", "'s", " isn't", "use to climb the tree", ["short", "thin", "old"], ["long", "strong", "thick"]],
  ["the room", "It", "'s", " isn't", "use for the party", ["small", "dark", "cold"], ["big", "warm"]],
  ["the soup", "It", "'s", " isn't", "eat", ["hot", "salty", "spicy"], ["warm", "hot"]],
  ["the water", "It", "'s", " isn't", "swim in", ["cold", "dirty", "deep"], ["warm", "clean"]],
  ["this phone", "It", "'s", " isn't", "buy", ["expensive", "old"], ["cheap", "good"]],
];

const sizeChoiceBank: readonly ChoiceItem[] = [
  ...sizeItems.map(([shown, adjective, word]): ChoiceItem => {
    const right = word === "too" ? `too ${adjective}` : `${adjective} enough`;
    const wrong = word === "too" ? [`${adjective} enough`, `enough ${adjective}`] : [`too ${adjective}`, `enough ${adjective}`];
    return [`${shown} (${adjective})`, right, wrong];
  }),
  ...sizeThings.flatMap(([thing, it, be, not, verb, tooAdjectives, enoughAdjectives]): ChoiceItem[] => [
    ...tooAdjectives.map(
      (adjective): ChoiceItem => [
        `I can't ${verb} ${thing}. ${it}${be} ___. (${adjective})`,
        `too ${adjective}`,
        [`${adjective} enough`, `enough ${adjective}`],
      ],
    ),
    ...enoughAdjectives.flatMap((adjective): ChoiceItem[] => [
      [`I can't ${verb} ${thing}. ${it}${not} ___. (${adjective})`, `${adjective} enough`, [`too ${adjective}`, `enough ${adjective}`]],
      [`Good, I can ${verb} ${thing}. ${it}${be} ___. (${adjective})`, `${adjective} enough`, [`too ${adjective}`, `enough ${adjective}`]],
    ]),
  ]),
];

/** tooThings are a thing, its form of be and its negative. */
const tooThings: readonly (readonly [string, string, string])[] = [
  ["The jacket", "is", "isn't"],
  ["These boots", "are", "aren't"],
  ["My bag", "is", "isn't"],
  ["The table", "is", "isn't"],
  ["The gloves", "are", "aren't"],
  ["This box", "is", "isn't"],
  ["The sweater", "is", "isn't"],
  ["The shelves", "are", "aren't"],
  ["My suitcase", "is", "isn't"],
  ["The trousers", "are", "aren't"],
];
const tooAdjectives: readonly string[] = ["small", "big", "long", "heavy", "thin", "thick", "short", "wide"];

const tooTypedBank: readonly TypedItem[] = everyPair(tooThings, tooAdjectives).flatMap(([[thing, be, not], adjective]): TypedItem[] =>
  [0, 1].map((k): TypedItem => {
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
  }),
);

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

/** countables are nouns you can count, and uncountables nouns you cannot, for too many, too much and enough. */
const countables: readonly string[] = ["people", "cars", "apps", "mistakes", "tourists", "messages", "shoes", "books", "chairs", "eggs"];
const uncountables: readonly string[] = ["sugar", "noise", "traffic", "water", "milk", "salt", "homework", "luggage", "coffee", "bread"];

const amountFrames: readonly ChoiceItem[] = [
  ...everyPair(["There are ___ {n} here.", "There were ___ {n} today.", "Why are there ___ {n}?"], countables).map(
    ([frame, noun]): ChoiceItem => [frame.replace("{n}", noun), "too many", ["too much", "very much"]],
  ),
  ...everyPair(["There is ___ {n} here.", "There was ___ {n} today.", "Why is there ___ {n}?"], uncountables).map(
    ([frame, noun]): ChoiceItem => [frame.replace("{n}", noun), "too much", ["too many", "very many"]],
  ),
  ...everyPair(["Do we have ___?", "We didn't have ___."], [...countables, ...uncountables]).map(
    ([frame, noun]): ChoiceItem => [
      frame,
      `enough ${noun}`,
      [`${noun} enough`, `${countables.includes(noun) ? "too much" : "too many"} ${noun}`],
    ],
  ),
];

/** sizeWhy explains too before an adjective or enough after it. */
const sizeWhy = (right: string, shown: string): Text =>
  right.startsWith("too ")
    ? t(
        `The sentence shows a problem, more than you want, so *too* goes before the adjective: ${fill(shown, right)}\n\n**Check.** Verify both meaning and order: the sentence describes a problem (excess), and *too* sits directly in front of the adjective.`,
        `句子说的是一个问题，超过了需要，所以 *too* 放在形容词前面：${fill(shown, right)}\n\n**检验。** 核对意思和语序：句子描述“过头了”的问题，且 *too* 紧放在形容词前面。`,
      )
    : t(
        `The sentence is about having as much as you need, or not, so *enough* goes after the adjective: ${fill(shown, right)}\n\n**Check.** Verify both meaning and order: the sentence asks or states whether it meets the need, and *enough* comes after the adjective.`,
        `句子说的是够不够，所以 *enough* 放在形容词后面：${fill(shown, right)}\n\n**检验。** 核对意思和语序：句子说的是够不够，且 *enough* 紧放在形容词后面。`,
      );

/** whyNotSize explains enough before an adjective, or too and enough mixed up. */
const whyNotSize = (wrong: string): Text => {
  if (wrong.startsWith("enough "))
    return t("*enough* goes after an adjective, never before it.", "*enough* 必须放在形容词后面，不能放在形容词前面。");
  return wrong.startsWith("too ")
    ? t(
        `*${wrong}* means “more than you want” (a problem), but this sentence is about having as much as you need.`,
        `*${wrong}* 表示“太……”（是个问题），可这句说的是够不够。`,
      )
    : t(
        `*${wrong}* means “as much as you need”, but this sentence describes a problem—more than you want.`,
        `*${wrong}* 表示“足够”，可这句说的是超过了需要、成了问题。`,
      );
};

/** amountNoun is the noun of a sentence with too much, too many or enough. */
const amountNoun = (right: string, shown: string): string =>
  right.startsWith("enough ") ? (right.split(" ")[1] ?? "") : (/___ (\w+)/u.exec(shown)?.[1] ?? "");

/** amountWhy explains too many, too much or enough before a noun. */
const amountWhy = (right: string, shown: string): Text => {
  const noun = amountNoun(right, shown);
  const done = fill(shown, right);
  if (right === "too many")
    return t(
      `You can count *${noun}*, and there are more than you want, so it takes *too many*: ${done}\n\n**Check.** Test *${noun}* with *two*: it is countable plural, and the sentence describes an excess → *too many*.`,
      `*${noun}* 可以数，而且超过了需要，所以用 *too many*：${done}\n\n**检验。** 用 *two* 测 *${noun}*：可数复数且表示“过多” → 用 *too many*。`,
    );
  if (right === "too much")
    return t(
      `You cannot count *${noun}*, and there is more than you want, so it takes *too much*: ${done}\n\n**Check.** Test *${noun}* with *two*: it is uncountable, and the sentence describes an excess → *too much*.`,
      `*${noun}* 不能数，而且超过了需要，所以用 *too much*：${done}\n\n**检验。** 用 *two* 测 *${noun}*：不可数且表示“过多” → 用 *too much*。`,
    );
  return t(
    `The sentence is about having as much as you need, and *enough* goes before a noun: ${done}\n\n**Check.** Look at the noun *${noun}*: with a noun, *enough* comes right in front of it.`,
    `句子说的是够不够，而 *enough* 放在名词前面：${done}\n\n**检验。** 看名词 *${noun}*：修饰名词时，*enough* 必须放在名词前面。`,
  );
};

/** whyNotAmount explains a wrong word for an amount before a noun. */
const whyNotAmount = (wrong: string, right: string, shown: string): Text => {
  const noun = amountNoun(right, shown);
  if (wrong.startsWith("very "))
    return t(
      "*very* only makes a word stronger; it does not express “more than you want” as *too* does.",
      "*very* 只是加强语气，不表示“超过需要”的问题，不能代替 *too*。",
    );
  if (wrong.endsWith(" enough"))
    return t("*enough* goes before a noun, not after it.", "*enough* 修饰名词时要放在名词前面，不能放在后面。");
  if (right.startsWith("enough "))
    return t(
      `*${wrong}* means “more than you want”, but this sentence is about whether you have as much as you need.`,
      `*${wrong}* 表示“太多”，可这句说的是够不够。`,
    );
  return wrong === "too much"
    ? t(`*too much* is for things you cannot count, but you can count *${noun}*.`, `*too much* 用于不可数名词，但 *${noun}* 可以数。`)
    : t(`*too many* is for things you can count, but you cannot count *${noun}*.`, `*too many* 用于可数名词，但 *${noun}* 不能数。`);
};

const tooAndEnough: TopicDef = {
  id: "too-and-enough",
  title: t("Too and Enough", "too 和 enough"),
  summary: t(
    "It's too big. It isn't big enough. We don't have enough money. Too goes before an adjective, enough after it and before a noun.",
    "It's too big. It isn't big enough. We don't have enough money. too 放在形容词前面，enough 放在形容词后面、名词前面。",
  ),
  intro: t(
    "Compare *This coat is too tight* (a problem—more than wanted) with *This coat isn't warm enough* (not meeting the need). Notice how *too* sits before an adjective, while *enough* flips position: after an adjective, but before a noun (*enough money*).",
    "比较 *This coat is too tight*（太紧了，成了问题）和 *This coat isn't warm enough*（不够暖和）。留意语序：*too* 在形容词前，而 *enough* 在形容词后、名词前（*enough money*）。",
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
        "*too* means *more than you want*: it is a problem. It goes **before** the adjective: *These shoes are too small. I can't wear them.*\n\n*enough* means *as much as you need*. It goes **after** the adjective: *The room is big enough for all of us. I'm not tall enough.*\n\n> **Watch out.** Never put *enough* before an adjective (*enough big* is wrong), and do not confuse *too* (“too much—a problem”) with *very*.",
        "*too* 的意思是“太……”，超过了需要，是个问题。它放在形容词**前面**：*These shoes are too small. I can't wear them.*\n\n*enough* 的意思是“足够”，正好满足需要。它放在形容词**后面**：*The room is big enough for all of us. I'm not tall enough.*\n\n> **注意。** 中文说“足够大”，英语却要说 *big enough*（不能说 *enough big*）；而且 *too* 表示“过头了”，不是中性的“很（*very*）”。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), sizeChoiceBank, sizeWhy, whyNotSize),
    ),
    point(
      "write",
      t("Writing with too and enough", "用 too 和 enough 写句子"),
      t(
        "Write the sentence from the note. *too* goes before the adjective: *The jacket is too small.* *not ... enough* puts *not* after *is* or *are* and *enough* after the adjective: *The bag isn't big enough.*\n\n> **Watch out.** Check both the verb (*is* vs. *are* for plural clothes like *shoes* or *jeans*) and the placement of *enough* after the adjective.",
        "根据笔记写句子。*too* 放在形容词前面：*The jacket is too small.* *not ... enough* 把 *not* 放在 *is / are* 后面，*enough* 放在形容词后面：*The bag isn't big enough.*\n\n> **注意。** 既要核对 *is* 与 *are*（如 *shoes*、*jeans* 用 *are*），也要确认 *enough* 放在形容词后面。",
      ),
      typedGenerator("sentence-pattern", t("Write a sentence from the note.", "根据笔记写一个句子。"), tooTypedBank, (right) =>
        / too /u.test(right)
          ? t(
              `The note says *too*, so it goes after *is* or *are* and before the adjective: ${right}\n\n**Check.** Verify the order: subject + *is/are* + *too* + adjective.`,
              `笔记里是 *too*，所以放在 *is / are* 后面、形容词前面：${right}\n\n**检验。** 核对语序：主语 + *is/are* + *too* + 形容词。`,
            )
          : t(
              `The note says *not enough*, so *not* goes with *is* or *are* and *enough* goes after the adjective: ${right}\n\n**Check.** Verify the order: subject + *isn't/aren't* (or *is/are not*) + adjective + *enough*.`,
              `笔记里是 *not enough*，所以 *not* 跟在 *is / are* 后面，*enough* 放在形容词后面：${right}\n\n**检验。** 核对语序：主语 + *isn't/aren't*（或 *is/are not*）+ 形容词 + *enough*。`,
            ),
      ),
    ),
    point(
      "nouns",
      t("Too much, too many and enough with nouns", "too much、too many 和 enough 加名词"),
      t(
        "With nouns, use *too many* for things you can count and *too much* for things you cannot count:\n\n- *There are too many cars.*\n- *There is too much traffic.*\n\n*enough* goes **before** a noun: *We don't have enough money.*\n\n> **Watch out.** Unlike with adjectives, *enough* comes **before** a noun (*enough money*, never *money enough*), and do not use *very many/much* to mean “excessive”.",
        "和名词连用时，可数名词用 *too many*，不可数名词用 *too much*：\n\n- *There are too many cars.*\n- *There is too much traffic.*\n\n*enough* 放在名词**前面**：*We don't have enough money.*\n\n> **注意。** 和修饰形容词正好相反，修饰名词时 *enough* 在**前面**（*enough money*，不说 *money enough*）；也不要用 *very many/much* 表达“过多”。",
      ),
      choiceGenerator(
        t("Choose the words for the gap.", "选出填入空白处的词。"),
        [...amountItems, ...amountFrames],
        amountWhy,
        whyNotAmount,
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
  ["bag", "bags", "leather", "plastic"],
  ["hat", "hats", "black", "brown"],
  ["cup", "cups", "big", "small"],
];

const an = (next: string) => (/^[aeiou]/u.test(next) ? "an" : "a");

/** oneRows are the nouns with their two adjectives in both orders. */
const oneRows = oneNouns.flatMap(([noun, nouns, a, b]) => [[noun, nouns, a, b] as const, [noun, nouns, b, a] as const]);

const oneFrames: readonly ((n: readonly [string, string, string, string]) => ChoiceItem)[] = [
  ([noun, , a, b]) => [`I don't like the ${a} ${noun}. I like the ${b} ___.`, "one", ["ones", "it"]],
  ([, nouns, a, b]) => [`I don't like the ${a} ${nouns}. I like the ${b} ___.`, "ones", ["one", "them"]],
  ([noun, , , b]) => [`Which ${noun} do you want? — The ${b} ___, please.`, "one", ["ones", "it"]],
  ([, nouns, a]) => [`These ${nouns} are nice, but I prefer the ${a} ___.`, "ones", ["one", "them"]],
  ([, nouns, a]) => [`Which ${nouns} do you like? — The ${a} ___.`, "ones", ["one", "them"]],
  ([noun, , a, b]) => [`My ${noun} is ${b}, but I want ${an(a)} ${a} ___.`, "one", ["ones", "it"]],
];

const oneChoiceBank: readonly ChoiceItem[] = interleave(oneFrames.map((frame) => oneRows.map(frame)));

const oneTypedBank: readonly TypedItem[] = interleave([
  oneRows.map(
    ([noun, , a, b]): TypedItem => ({
      shown: `This ${a} ${noun} isn't right for me. Can I see the ${b} ${noun}?`,
      accepted: [`Can I see the ${b} one?`],
      wrong: [`Can I see the ${b} ones?`, `Can I see the ${b}?`],
    }),
  ),
  oneRows.map(
    ([, nouns, a, b]): TypedItem => ({
      shown: `I don't want the ${a} ${nouns}. I want the ${b} ${nouns}.`,
      accepted: [`I want the ${b} ones.`],
      wrong: [`I want the ${b} one.`, `I want the ${b} them.`],
    }),
  ),
  oneRows.map(
    ([noun, , a, b]): TypedItem => ({
      shown: `Your ${a} ${noun} is nice. I'd like ${an(b)} ${b} ${noun} too.`,
      accepted: [`I'd like ${an(b)} ${b} one too.`],
      wrong: [`I'd like ${an(b)} ${b} too.`, `I'd like ${an(b)} ${b} it too.`],
    }),
  ),
  oneRows.map(
    ([, nouns, a]): TypedItem => ({
      shown: `Do you have any ${a} ${nouns}? I like ${a} ${nouns}.`,
      accepted: [`I like ${a} ones.`],
      wrong: [`I like ${a} one.`, `I like ${a} them.`],
    }),
  ),
]);

/** oneNoun is the noun that one or ones stands for in a sentence, and whether it is plural. */
const oneNoun = (sentence: string): readonly [noun: string, plural: boolean] => {
  const plural = oneNouns.find(([, nouns]) => new RegExp(`\\b${nouns}\\b`, "u").test(sentence));
  if (plural) return [plural[1], true];
  const single = oneNouns.find(([noun]) => new RegExp(`\\b${noun}\\b`, "u").test(sentence));
  return [single?.[0] ?? "", false];
};

/** oneWhy explains one or ones for a noun already said. */
const oneWhy = (word: string, noun: string, done: string): Text =>
  word === "ones"
    ? t(
        `*${noun}* has already been said and means more than one, so *ones* stands for it: ${done}\n\n**Check.** Match the number to the earlier noun *${noun}* (plural → *ones*) and confirm it follows the adjective directly.`,
        `*${noun}* 前面已经说过，而且是复数，所以用 *ones* 代替：${done}\n\n**检验。** 核对前面名词 *${noun}* 的单复数（复数 → *ones*），且紧跟在形容词后面。`,
      )
    : t(
        `*${noun}* has already been said and means one thing, so *one* stands for it: ${done}\n\n**Check.** Match the number to the earlier noun *${noun}* (singular → *one*) and confirm it follows the adjective directly.`,
        `*${noun}* 前面已经说过，而且是单数，所以用 *one* 代替：${done}\n\n**检验。** 核对前面名词 *${noun}* 的单复数（单数 → *one*），且紧跟在形容词后面。`,
      );

/** whyNotOne explains the wrong number, or it or them after an adjective. */
const whyNotOne = (wrong: string, _right: string, shown: string): Text => {
  const [noun] = oneNoun(shown);
  if (wrong === "it" || wrong === "them")
    return t(
      `*${wrong}* cannot follow an adjective. After an adjective, English uses *one* or *ones* to stand for *${noun}*.`,
      `*${wrong}* 不能放在形容词后面。形容词后面要用 *one* 或 *ones* 来代替 *${noun}*。`,
    );
  return wrong === "ones"
    ? t(`*ones* is for more than one, but *${noun}* means one thing.`, `*ones* 代替复数名词，但 *${noun}* 是单数。`)
    : t(`*one* is for one thing, but *${noun}* means more than one.`, `*one* 代替单数名词，但 *${noun}* 是复数。`);
};

const oneAndOnes: TopicDef = {
  id: "one-and-ones",
  title: t("This One and the Red Ones", "this one 和 the red ones"),
  summary: t(
    "I like the blue one. These ones are cheaper. One stands for a noun already said, so you do not say it again.",
    "I like the blue one. These ones are cheaper. one 代替前面说过的名词，避免重复。",
  ),
  intro: t(
    "Instead of repeating the noun in *Which cup do you want? — The small cup*, English replaces it with *one* (*The small one*)—or *ones* for plural nouns (*the silver ones*).",
    "不必在 *Which cup do you want? — The small cup* 里重复名词，英语用 *one* 代替单数名词（*The small one*），用 *ones* 代替复数名词（*the silver ones*）。",
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
        "When you have already said a noun, you can use *one* instead of saying it again: *I don't like the black bag. I like the brown one.* (*one* = *bag*)\n\nFor more than one, use *ones*: *I don't like the black shoes. I like the brown ones.*\n\n> **Watch out.** Never put *it* or *them* after an adjective (*the brown it* is wrong), and do not leave the adjective hanging without *one/ones* (*I like the brown* is wrong).",
        "前面已经说过的名词，可以用 *one* 代替，不再重复：*I don't like the black bag. I like the brown one.*（*one* = *bag*）\n\n复数用 *ones*：*I don't like the black shoes. I like the brown ones.*\n\n> **注意。** 形容词后面不能用 *it/them*（*the brown it* 是错的），也不能像中文“我喜欢棕色的”那样省掉 *one/ones*。",
      ),
      choiceGenerator(
        t("Choose the word for the gap.", "选出填入空白处的词。"),
        oneChoiceBank,
        (right, shown) => oneWhy(right, oneNoun(shown)[0], fill(shown, right)),
        whyNotOne,
      ),
    ),
    point(
      "write",
      t("Saying it with one", "用 one 来说"),
      t(
        "Write the second sentence again without saying the noun twice: use *one* for one thing and *ones* for more than one. *I need a new bag.* → *I need a new one.*\n\n> **Watch out.** Check whether the replaced noun is singular (*one*) or plural (*ones*), and keep the rest of the second sentence (including *a/an/the* and the end punctuation) intact.",
        "把第二句重写一遍，不要重复名词：一个东西用 *one*，多个用 *ones*。*I need a new bag.* → *I need a new one.*\n\n> **注意。** 核对被替换的名词是单数（*one*）还是复数（*ones*），并保留第二句的其余部分（包括冠词和句末标点）。",
      ),
      typedGenerator(
        "sentence",
        t("Write the second sentence again with one or ones.", "用 one 或 ones 重写第二句。"),
        oneTypedBank,
        (right, shown) => {
          const [noun, plural] = oneNoun(shown);
          return oneWhy(plural ? "ones" : "one", noun, right);
        },
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
  intro: t(
    "When an order arrives broken or in the wrong size, a clear, polite message gets it fixed fast: *Dear Sir or Madam, I bought a jacket on Tuesday, but the zip is broken. Could I exchange it for a new one, please? Thank you, Mei.*",
    "买到的东西坏了或尺码不对时，一封礼貌清晰的短信最容易解决问题：*Dear Sir or Madam, I bought a jacket on Tuesday, but the zip is broken. Could I exchange it for a new one, please? Thank you, Mei.*",
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
      "A message to a shop is polite and clear:\n\n- Begin with *Dear Sir or Madam* or *Hello*.\n- Say what you bought and when: *Last week I bought a blue sweater on your website.*\n- Say what is wrong: *It is too small. It doesn't work.*\n- Say what you would like: *I would like to change it, please. Could you send me a new one?*\n- End with *Thank you* and your name.\n\n> **Watch out.** Use polite requests like *I would like...* or *Could you...?* (not blunt orders like *Give me my money back!*), and include both a greeting and your name.",
      "给商店的信要礼貌、清楚：\n\n- 开头写 *Dear Sir or Madam* 或 *Hello*。\n- 说你买了什么、什么时候买的：*Last week I bought a blue sweater on your website.*\n- 说出问题：*It is too small. It doesn't work.*\n- 说出你的要求：*I would like to change it, please. Could you send me a new one?*\n- 结尾写 *Thank you* 和你的名字。\n\n> **注意。** 提要求时用 *I would like ...* 或 *Could you ...?*（不要用生硬的 *Give me ...*），并写全开头称呼和结尾署名。",
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
