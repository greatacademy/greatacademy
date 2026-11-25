// A1, unit 5: Clothes and Shopping. Clothes, shopping and choosing, the present continuous, how much and how many,
// and sentences about what people are wearing.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, interleave, pairUp, vocabularyTopic, word } from "../words.ts";
import {
  howMuchAndHowManyAskNot,
  presentContinuousSpellNot,
  presentContinuousWriteNot,
  writingWhatPeopleAreWearingWriteNot,
} from "./mistakes.ts";

const clothes = vocabularyTopic({
  id: "a1-words-clothes",
  title: t("Clothes", "衣服"),
  summary: t("Shirts, dresses, pants, shoes, hats and coats, and the verb wear.", "衬衫、连衣裙、裤子、鞋、帽子和外套，以及动词 wear。"),
  intro: t(
    "Today Tom **wears** a blue **shirt**, black **pants** and his new **shoes**. These words help you talk about the clothes you put on.",
    "今天 Tom **wears**（穿）蓝色 **shirt**（衬衫）、黑色 **pants**（裤子）和新 **shoes**（鞋）。这些词帮你说出自己穿的衣服。",
  ),
  prerequisites: ["pre-a1-words-colors"],
  words: [
    word(
      "clothes",
      "the things you wear, like shirts and dresses",
      "衣服",
      "Put your shirts and other {clothes} in the cupboard. | I wear old {clothes}, like an old shirt and old pants, when I paint. | We buy new {clothes} for the New Year: a dress, a shirt and pants.",
      "shoes hats",
    ),
    word(
      "shirt shirts",
      "a piece of clothing for the top of your body, often with buttons",
      "衬衫",
      "Dad wears a white {shirt} and a tie to work. | My {shirt} has long arms and six buttons. | Do up the buttons of your {shirt}, right up to your neck.",
      "skirt T-shirt",
    ),
    word(
      "T-shirt T-shirts",
      "a shirt with short arms and no buttons",
      "T恤",
      "It's hot today, so I'm wearing a {T-shirt}. | In summer I wear a {T-shirt} with short arms. | On hot days, our team plays in blue {T-shirts}.|coats jackets",
      "coat jacket",
    ),
    word(
      "dress dresses",
      "a piece of clothing for a girl or a woman that covers the body and part of the legs",
      "连衣裙",
      "Mia is wearing a pink {dress} that goes from her neck down to her knees. | My sister has a long red {dress}. She doesn't need a shirt or a skirt with it. | Grandma made two {dresses} for me. Each one is a top and a skirt in one piece.|skirts shirts",
      "skirt shirt",
    ),
    word(
      "skirt skirts",
      "a piece of clothing that hangs from the middle of the body",
      "裙子；半身裙",
      "She is wearing a blue {skirt} and a white shirt. | My school {skirt} is gray, and I wear it with a white shirt. | Girls in our school wear gray {skirts} or pants with their white shirts.|shirts dresses",
      "shirt dress",
    ),
    word(
      "pants",
      "a piece of clothing that covers each leg",
      "裤子",
      "I'm wearing black {pants} on my legs and a white shirt. | These {pants} are too long for me. They touch the floor. | Put your legs into your {pants}, then put on your shoes.",
      "shirts socks",
    ),
    word(
      "shoe shoes",
      "a thing you wear on your foot",
      "鞋",
      "Take off your {shoes} at the door, and walk in your socks.|hats coats | I need new {shoes} for running. My old ones have holes under my feet.|hats coats | One {shoe} is under the bed. Where is the other one?",
      "hat coat",
    ),
    word(
      "sock socks",
      "a soft thing you wear on your foot, inside a shoe",
      "袜子",
      "I wear {socks} in my shoes.|hats coats | One {sock} on my foot is red, and the other is blue! | Your feet are cold. Put on warm {socks}.|hats coats",
      "hat coat",
    ),
    word(
      "hat hats",
      "a thing you wear on your head",
      "帽子",
      "It's sunny. Wear a {hat}. | The man has a black {hat} on his head. | We are wearing funny {hats} on our heads at the party.|socks shoes",
      "sock shoe",
    ),
    word(
      "coat coats",
      "a long warm piece of clothing you wear outside",
      "外套；大衣",
      "It's cold outside. Put on your {coat}. | My winter {coat} is long and warm. | Hang your {coats} by the door.|T-shirts socks",
      "T-shirt sock",
    ),
    word(
      "jacket jackets",
      "a short coat",
      "夹克；短外套",
      "Take a {jacket}. It may be cool tonight. | My {jacket} keeps me warm, and it has two pockets. | Leather {jackets} are expensive.|T-shirts socks",
      "T-shirt sock",
    ),
    word(
      "wear wears wore worn wearing",
      "to have clothes on your body",
      "穿；戴",
      "I {wear} a uniform to school. | She is {wearing} a red hat on her head.|buying selling | What are you {wearing} to the party?|buying selling",
      "buy sell",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "Look for the body part: *hat* for the head, *shoes* and *socks* for the feet, *pants* for the legs, *shirt* and *T-shirt* for the top. *Clothes* is the word for all of them together.",
        "找句中的身体部位：头上是 *hat*，脚上是 *shoes* 和 *socks*，腿上是 *pants*，上身是 *shirt* 和 *T-shirt*。*clothes* 是所有这些的总称。",
      ),
      meaning: t(
        "A *coat* is long and warm, a *jacket* is a short coat, and a *T-shirt* has short arms and no buttons. A *dress* is one piece; a *skirt* starts at the middle of the body.",
        "*coat* 又长又暖，*jacket* 是短外套，*T-shirt* 短袖没扣子。*dress* 是连成一件的；*skirt* 从腰部往下。",
      ),
      spell: t(
        "*Clothes* ends in -thes; *pants* always keeps its s, even for one; *T-shirt* has a capital T and a hyphen.",
        "*clothes* 以 -thes 结尾；*pants* 即使指一条也要有 s；*T-shirt* 是大写 T 加连字符。",
      ),
    },
    notes: `
      clothes|shirts in the cupboard;an old shirt and old pants for painting;a dress, a shirt and pants for the New Year|clothes are all the things you wear; shoes are only for your feet|clothes 是所有穿的东西；shoes 只是脚上穿的|shoe/shoes=shoes are only for your feet, not shirts, pants and dresses=shoes 只穿在脚上，不包括衬衫、裤子和连衣裙;hat/hats=hats are only for your head, not shirts, pants and dresses=hats 只戴在头上，不包括衬衫、裤子和连衣裙|clothes|-thes at the end, said like *close*|结尾是 -thes，读音像 *close*
      shirt|a white top with a tie for work;long arms and six buttons;buttons right up to the neck|a shirt is for the top of the body; a skirt hangs from the middle|shirt 穿在上身；skirt 从腰部垂下|skirt/skirts=skirt hangs from the middle of the body, with no arms, no tie and no buttons up to the neck=skirt 从腰部垂下，没有袖子，不配领带，也没有扣到脖子的扣子;t-shirt/t-shirts=T-shirt has short arms and no buttons, and nobody wears it with a tie=T-shirt 是短袖、没有扣子，也没人配领带穿|shirt|ir said like *er*, so not *shert*|ir 读作 *er*，不是 *shert*
      T-shirt|a hot day;short arms in summer;a team on hot days|a T-shirt is thin with short arms; a coat is long and warm|T-shirt 薄而短袖；coat 又长又暖|coat/coats=coat is long and warm, for cold days, not for hot days or short arms=coat 又长又暖，是冷天穿的，不是热天穿的短袖;jacket/jackets=jacket is a short coat for cool weather, not for hot days or short arms=jacket 是凉天穿的短外套，不是热天穿的短袖|T · shirt|a capital T and a hyphen: *T-shirt*|大写 T 加连字符：*T-shirt*
      dress|from the neck down to the knees;no shirt or skirt with it;a top and a skirt in one piece|a dress covers the top and part of the legs in one piece; a skirt starts at the middle|dress 是上身和腿的一部分连成一件；skirt 从腰部开始|skirt/skirts=skirt covers only the body from the middle down, not the top as well=skirt 只遮住腰部以下，不包括上身;shirt/shirts=shirt covers only the top of the body, not the legs as well=shirt 只遮住上身，不包括腿|dress|a double s at the end, and -es in *dresses*|结尾双写 s，复数是 *dresses*
      skirt|blue with a white shirt;a gray school one worn with a white shirt;gray for girls with white shirts|a skirt hangs from the middle of the body; a shirt is for the top|skirt 从腰部垂下；shirt 穿在上身|shirt/shirts=shirt is for the top of the body, but the white shirt is already on top, so the gap is for the part below=shirt 穿在上身，可句中白衬衫已经穿在上身，空格说的是下身;dress/dresses=dress covers the top as well, so it is not worn with a shirt on top=dress 连上身也遮住，不会再在外面配衬衫|skirt|sk at the start and ir in the middle, so not *skert*|开头是 sk，中间是 ir，不是 *skert*
      pants|black on my legs;too long and touching the floor;putting my legs in|pants cover each leg; a shirt is for the top|pants 套住两条腿；shirt 穿在上身|shirt/shirts=shirts are for the top of the body, not for the legs=shirts 穿在上身，不套在腿上;sock/socks=socks are for your feet, too short to cover the legs or touch the floor=socks 穿在脚上，太短，盖不住腿，也碰不到地|pants|always with s, even for one, as in *these pants*|即使一条也要有 s，比如 *these pants*
      shoe|taking them off at the door;new ones for running;one under the bed|shoes go on your feet; a hat goes on your head|shoes 穿在脚上；hat 戴在头上|hat/hats=hats are worn on your head one at a time, not on your feet as a pair=hats 戴在头上，一次一顶，不是脚上成双穿的;coat/coats=coats are long and warm, for the body, not on your feet as a pair=coats 又长又暖，穿在身上，不是脚上成双穿的|shoe|oe said like *oo*: *shoe*, not *shoo*|oe 读作 *oo*：是 *shoe*，不是 *shoo*
      sock|inside my shoes;one red and one blue on my feet;warm ones for cold feet|socks go inside your shoes; a hat goes on your head|socks 穿在鞋里；hat 戴在头上|hat/hats=hats go on your head, not on your feet or inside shoes=hats 戴在头上，不穿在脚上或鞋里;coat/coats=coats go on your body, not on your feet or inside shoes=coats 穿在身上，不穿在脚上或鞋里|sock|ck at the end, so not *sok*|结尾是 ck，不是 *sok*
      hat|a sunny day;something black on his head;funny ones at a party|a hat goes on your head; socks go on your feet|hat 戴在头上；socks 穿在脚上|sock/socks=socks go on your feet, not on your head to keep the sun off=socks 穿在脚上，不戴在头上遮太阳;shoe/shoes=shoes go on your feet, not on your head=shoes 穿在脚上，不戴在头上|hat|a short a, as in *cat*, with no e at the end|短元音 a，和 *cat* 一样，词尾没有 e
      coat|a cold day outside;long and warm for winter;hanging by the door|a coat is long and warm; a T-shirt is thin with short arms|coat 又长又暖；T-shirt 薄而短袖|t-shirt/t-shirts=T-shirt is thin with short arms, for hot days, not long and warm for going out in the cold=T-shirt 薄而短袖，是热天穿的，不是冷天出门穿的又长又暖的衣服;sock/socks=socks are for your feet, not a long warm thing you put on to go out=socks 穿在脚上，不是出门穿的又长又暖的衣服|coat|oa said like *go*|oa 读作 *go* 里的音
      jacket|a cool night;something warm with two pockets;leather ones|a jacket is a short coat; a T-shirt is thin with short arms|jacket 是短外套；T-shirt 薄而短袖|t-shirt/t-shirts=T-shirt is thin with short arms, not a short coat to keep you warm=T-shirt 薄而短袖，不是保暖的短外套;sock/socks=socks go on your feet, not over your body like a short coat=socks 穿在脚上，不像短外套那样穿在身上|jack · et|ck in the middle, then -et|中间是 ck，后面是 -et
      wear|a uniform for school;a red hat on her head;clothes for the party|you wear clothes on your body; you buy them with money|wear 是穿在身上；buy 是花钱买|buy/buying=buy means to get something with money, not to have it on your body=buy 是花钱买，不是穿在身上;sell/selling=sell means to give something for money, not to have it on your body=sell 是卖，不是穿在身上|wear|ear said like *air*, and the past *wore*|ear 读作 *air*，过去式是 *wore*
    `,
  },
});

const shopping = vocabularyTopic({
  id: "a1-words-shopping",
  title: t("Shopping", "购物"),
  summary: t("Buying, selling, paying, prices, sizes, cheap and expensive.", "买、卖、付钱、价格、尺码、便宜和贵。"),
  intro: t(
    "At the **store**, Mom looks at the **price** of a coat. It's too **expensive**, so she **buys** a **cheap** one. These words help you buy things and talk about money.",
    "在 **store**（商店）里，妈妈看了看一件外套的 **price**（价格）。太 **expensive**（贵）了，所以她 **buys**（买）了一件 **cheap**（便宜）的。这些词帮你买东西、谈论钱。",
  ),
  prerequisites: ["a1-words-clothes"],
  words: [
    word(
      "shop shops shopped shopping",
      "to go to stores to buy things; a store",
      "购物；商店",
      "We {shop} for food on Saturday. | Let's go {shopping} for new shoes.|buying selling | The {shop} on the corner sells bread.|price money",
      "buy sell",
    ),
    word(
      "buy buys bought buying",
      "to get something by paying money",
      "买",
      "I want to {buy} a new bike, so I'm saving my money. | Mom {bought} a cake for my birthday.|sold paid | Where can I {buy} a ticket?",
      "sell pay",
    ),
    word(
      "sell sells sold selling",
      "to give something to someone for money",
      "卖",
      "This shop {sells} shoes and bags.|buys pays | The farmer {sells} his eggs to people at the market.|buys pays | Sorry, we don't {sell} newspapers.",
      "buy pay",
    ),
    word(
      "money",
      "the coins and paper you use to buy things",
      "钱",
      "I don't have any {money}. I can't buy it. | How much {money} do you have? | Keep your {money} in your bag.",
      "price size",
    ),
    word(
      "dollar dollars",
      "money used in America, Canada, Australia and other countries",
      "美元；元",
      "This hat is ten {dollars}.|prices sizes | Can I have a {dollar}, please? I want to buy some candy. | It costs five {dollars}.|prices sizes",
      "price size",
    ),
    word(
      "cheap cheaper cheapest",
      "costing little money",
      "便宜的",
      "This T-shirt is only two dollars. It's very {cheap}! | Apples are very {cheap} at the market: only a dollar a bag! | I don't have much money. Is there a {cheap} hotel near here?",
      "expensive rich",
    ),
    word(
      "expensive",
      "costing a lot of money",
      "贵的",
      "This coat is two hundred dollars. It's very {expensive}! | I can't buy it. It's too {expensive}. | Cars are {expensive}. You need a lot of money to buy one.",
      "cheap rich",
    ),
    word(
      "price prices",
      "how much money you pay for something",
      "价格",
      "What is the {price} of this bag? — It's twenty dollars. | The {prices} at this shop are low, so things are cheap.|sizes dollars | Look at the {price} on the label: is it ten dollars or twenty?",
      "size money",
    ),
    word(
      "store stores",
      "a place where you buy things",
      "商店",
      "There's a big {store} next to the station. | The {store} opens at nine. | I bought my shoes at that {store}.",
      "price size",
    ),
    word(
      "pay pays paid paying",
      "to give money for something",
      "付钱",
      "Can I {pay} for the shoes with a card? | I {paid} ten dollars for this book.|bought sold | Please {pay} for your food at the front desk.",
      "buy sell",
    ),
    word(
      "size sizes",
      "how big something is",
      "尺码；大小",
      "These shoes are too small. Do you have a bigger {size}? | What {size} are you? — Small. | The two bags are the same {size}: both are small.",
      "price money",
    ),
    word(
      "try tries tried trying",
      "to do something to see if it is good; with *on*, to put on clothes in a shop to see if they fit",
      "尝试；（try on）试穿",
      "Can I {try} on this dress? | {Try} this soup. It's very good!|Pay Sell | She {tried} on three hats.|bought paid",
      "buy pay",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Buy* is getting something, *sell* is giving it for money, and *pay* is giving the money, so we *pay for* things. Ask who gets the thing and who gets the money.",
        "*buy* 是得到东西，*sell* 是把东西换成钱，*pay* 是付钱，所以说 *pay for* 某物。先想清楚谁拿到东西、谁拿到钱。",
      ),
      meaning: t(
        "The *price* is how much it costs, the *size* is how big it is, and *money* is what you pay with. *Cheap* costs little; *expensive* costs a lot.",
        "*price* 是多少钱，*size* 是多大，*money* 是用来付的钱。*cheap* 花钱少；*expensive* 花钱多。",
      ),
      spell: t(
        "The past forms change: *buy* becomes *bought*, *sell* becomes *sold*, *pay* becomes *paid*, and *shop* doubles its p in *shopping*.",
        "过去式会变：*buy* 变 *bought*，*sell* 变 *sold*，*pay* 变 *paid*；*shop* 在 *shopping* 里双写 p。",
      ),
    },
    notes: `
      shop|food on Saturday;new shoes;a place on the corner that sells bread|to shop is to go out and buy things; to buy is to get one thing with money|shop 是出去购物；buy 是花钱买某样东西|buy/buying=buy needs the thing right after it, as in *buy food*, and nobody says *buy for* or *go buying*=buy 后面直接跟东西，比如 *buy food*，没有 *buy for* 或 *go buying* 的说法;sell/selling=sell means to give things for money, but here people go out to get things=sell 是卖东西，可这里是人们出去买东西;price=price is how much something costs, and it cannot sell bread=price 是价格，不会卖面包;money=money is coins and paper, and it cannot sell bread=money 是硬币和纸币，不会卖面包|shop|a double p in *shopping*|*shopping* 里双写 p
      buy|a new bike to save for;a birthday cake;a ticket|you buy to get something; you sell to give it for money|buy 是买进；sell 是卖出|sell/sold=sell means to give something away for money, the opposite of getting it=sell 是卖出，和买进相反;pay/paid=pay goes with *for* or with the money, as in *pay for a bike*, not straight before the thing you get=pay 要跟 *for* 或钱数，比如 *pay for a bike*，不直接跟买到的东西|buy|uy said like *eye*, and the past *bought*|uy 读作 *eye*，过去式是 *bought*
      sell|shoes and bags in a shop;a farmer's eggs at the market;no newspapers here|you sell to give things for money; you buy to get them|sell 是卖出；buy 是买进|buy/buys=buy means to get something for money, but here the shop or the farmer gives things to people=buy 是买进，可这里是商店或农民把东西卖给别人;pay/pays=pay means to give money, not to give things for money=pay 是付钱，不是卖东西|sell|a double l, and the past *sold*|双写 l，过去式是 *sold*
      money|nothing to buy with;how much someone has;something to keep in a bag|money is the coins and paper you pay with; a price is how much one thing costs|money 是付的钱；price 是某样东西的价格|price=price is how much one thing costs, not coins and paper you have or keep=price 是某样东西的价格，不是你有的、收着的钱;size=size is how big something is, not coins and paper=size 是大小，不是钱|mon · ey|o said like the u in *up*, and -ey at the end|o 读作 *up* 里的 u，结尾是 -ey
      dollar|the cost of a hat;money for candy;the cost of something|a dollar is money; a price is how much something costs|dollar 是钱；price 是价格|price/prices=price is how much something costs, so you say *the price is ten dollars*, not *ten prices*, and you cannot have a price to spend=price 是价格，说 *the price is ten dollars*，不说 *ten prices*，也不能拿价格去花;size/sizes=size is how big something is, not money=size 是大小，不是钱|dol · lar|a double l, and -ar at the end|双写 l，结尾是 -ar
      cheap|a two-dollar T-shirt;apples for a dollar a bag;a hotel for little money|cheap means costing little; expensive means costing a lot|cheap 是便宜；expensive 是贵|expensive=expensive means costing a lot, but here the price is small or the money is little=expensive 是贵，可这里价钱低或钱不多;rich=rich means having a lot of money, and it describes people, not things that cost little=rich 是有钱，形容人，不形容便宜的东西|cheap|ch at the start and ea in the middle|开头是 ch，中间是 ea
      expensive|a two-hundred-dollar coat;something too costly to buy;cars|expensive means costing a lot; cheap means costing little|expensive 是贵；cheap 是便宜|cheap=cheap means costing little, but here the price is big=cheap 是便宜，可这里价钱很高;rich=rich describes a person with a lot of money, not a thing that costs a lot=rich 形容有钱的人，不形容很贵的东西|ex · pen · sive|-sive at the end, with s, not c|结尾是 -sive，用 s，不用 c
      price|the cost of a bag;low costs at a shop;the number on a label|the price is how much it costs; the size is how big it is|price 是价格；size 是大小|size/sizes=size is how big something is, not how much money it costs=size 是大小，不是价钱;money=money is the coins and paper you pay with, not how much one thing costs=money 是用来付的钱，不是某样东西的价格;dollar/dollars=dollars are the money itself, not how much things cost=dollars 是钱本身，不是价格|price|c said like s|c 读作 s
      store|a big one by the station;opening at nine;where I bought my shoes|a store is a place where you buy things; a price is how much they cost|store 是买东西的地方；price 是价格|price=price is how much something costs, not a place you go to=price 是价格，不是去的地方;size=size is how big something is, not a place=size 是大小，不是地方|store|ore at the end, as in *more*|结尾是 ore，和 *more* 一样
      pay|shoes with a card;ten dollars for a book;food at the front desk|you pay money for something; you buy the thing itself|pay 是付钱；buy 是买东西|buy/bought=buy needs the thing right after it, as in *buy shoes*, not *buy for* or *buy ten dollars*=buy 后面直接跟东西，比如 *buy shoes*，不说 *buy for* 或 *buy ten dollars*;sell/sold=sell means to give things for money, but here the person is giving the money=sell 是卖东西，可这里是这个人在付钱|pay|ay at the end, and the past *paid*, not *payed*|结尾是 ay，过去式是 *paid*，不是 *payed*
      size|a bigger one of the shoes;small;two small bags|the size is how big it is; the price is how much it costs|size 是大小；price 是价格|price=price is how much something costs, not how big or small it is=price 是价格，不是大小;money=money is coins and paper, not how big something is=money 是钱，不是大小|size|z in the middle and a silent e|中间是 z，词尾 e 不发音
      try|a dress in a shop;tasting soup;three hats|you try clothes on to see if they fit; you buy them with money|try on 是试穿；buy 是花钱买|buy/bought=buy means to get something with money, and it does not go with *on*=buy 是花钱买，不和 *on* 连用;pay/paid=pay means to give money, not to put on clothes or taste soup=pay 是付钱，不是试穿衣服或尝汤;sell=sell means to give something for money, not to taste it=sell 是卖，不是尝|try|y changing to i in *tries* and *tried*|*tries*、*tried* 里 y 变成 i
    `,
  },
});

const atTheShop = vocabularyTopic({
  id: "a1-words-at-the-shop",
  title: t("Which One?", "哪一个？"),
  summary: t(
    "Want, would, new, another, the same, different, only, all, more and most.",
    "want、would、new、another、same、different、only、all、more 和 most。",
  ),
  intro: t(
    "I **want** a **new** bag. This is the **only** red one, so do you have **another** in a **different** color? These words help you choose between things in a shop.",
    "我 **want**（想要）一个 **new**（新）包。这是 **only**（唯一）一个红色的，你们有 **another**（另一个）**different**（不同）颜色的吗？这些词帮你在商店里挑选东西。",
  ),
  prerequisites: ["a1-words-shopping"],
  words: [
    word(
      "want wants wanted wanting",
      "to wish to have or do something",
      "想要",
      "I {want} a new bike for my birthday. | Do you {want} some juice? | What do you {want} to eat?",
      "went would",
    ),
    word(
      "would I'd wouldn't",
      "with *like*, a kind way to say *want*",
      "（would like）想要（礼貌说法）",
      "I {would} like a cup of tea, please. | {Would} you like some cake? | What {would} you like to buy?",
      "want could",
    ),
    word(
      "new newer newest",
      "not used before; just bought or made",
      "新的",
      "I have a {new} bike. I got it yesterday. | These shoes are {new}. I bought them today. | Happy {New} Year!|Old Same",
      "old same",
    ),
    word(
      "another",
      "one more; a different one",
      "另一个；再一个",
      "Can I have {another} cookie? I'm still hungry. | This shirt is too small. Do you have {another} one? | I'd like {another} glass of water, please.",
      "more all",
    ),
    word(
      "other others",
      "the second of two; not this one",
      "其他的；另一个",
      "One sock is red. The {other} sock is blue. | I like this hat, but not the {other} one. | Where are the {other} children? — In the garden.",
      "more all",
      "another",
    ),
    word(
      "same",
      "not different; exactly like another",
      "相同的",
      "We are in the {same} class, so we sit together every day. | My shoes and your shoes are the {same} color: both are black. | Twins often look the {same}. I can't tell which is which.",
      "different another",
    ),
    word(
      "different",
      "not the same",
      "不同的",
      "A cat and a dog are very {different}. | Do you have this coat in a {different} color? | I speak Chinese and Tom speaks English. We speak {different} languages.",
      "same another",
    ),
    word(
      "only",
      "no more than; just one",
      "只有；仅仅",
      "I have {only} one dollar. I can't buy it. | It's {only} two dollars. It's cheap! | She is the {only} girl in the team.",
      "all more",
    ),
    word(
      "all",
      "every one; the whole",
      "全部；所有",
      "{All} the children are in the classroom. | I ate {all} the cake. There's none left! | Thank you {all} for coming.",
      "each every",
    ),
    word(
      "more",
      "a bigger number or amount",
      "更多的",
      "Can I have some {more} rice, please? | This coat costs {more} than that one. | We have six chairs, but ten people are coming. We need {more} chairs.",
      "most only",
    ),
    word(
      "most",
      "the biggest number or amount",
      "最多的；大多数",
      "Who has the {most} books? — Anna has ten! | {Most} children like ice cream, but a few don't. | This is the {most} expensive shop in town.",
      "more much",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Another* goes with one thing, as in *another cookie*; *more* goes with many things or an amount, as in *more rice*. *The same* and *the other* need *the*, but *another* never takes it.",
        "*another* 跟单个东西，比如 *another cookie*；*more* 跟复数或数量，比如 *more rice*。*the same*、*the other* 要有 *the*，*another* 前面从不加 *the*。",
      ),
      meaning: t(
        "*Want* and *would like* both say what you wish for, but *would like* is kinder. *More* compares two, while *most* is the biggest of all.",
        "*want* 和 *would like* 都表示想要，但 *would like* 更礼貌。*more* 是两者比较，*most* 是所有里最多的。",
      ),
      spell: t(
        "*Would* has a silent l and sounds like *wood*. *Another* is one word, and *different* has a double f.",
        "*would* 里的 l 不发音，读音像 *wood*。*another* 是一个词，*different* 双写 f。",
      ),
    },
    notes: `
      want|a new bike for my birthday;some juice;something to eat|want comes before the thing you wish for; went is the past of go|want 后面跟想要的东西；went 是 go 的过去式|went=went is the past of *go*, and it cannot have a thing right after it or follow *do*=went 是 *go* 的过去式，后面不能直接跟东西，也不能放在 *do* 后面;would=would goes with *like*, as in *would like*, and never comes after *do* or straight before a thing=would 要和 *like* 连用，比如 *would like*，不放在 *do* 后面，也不直接跟东西|want|a said like the o in *hot*|a 读作 *hot* 里的 o
      would|a cup of tea;some cake;something to buy|would like is a kind way to say want; could is about being able to|would like 是礼貌地说想要；could 是能够|want=want comes before a thing or *to*, as in *want tea*, not before *like*=want 后面跟东西或 *to*，比如 *want tea*，不跟 *like*;could=could is about being able to, and nobody says *could like*=could 表示能够，没有 *could like* 的说法|would|a silent l: *would*, said like *wood*|l 不发音：*would* 读作 *wood*
      new|a bike I got yesterday;shoes bought today;the start of a year|new means just bought or made; old means used for a long time|new 是新买或新做的；old 是用了很久的|old=old is the opposite of new, but the thing was just got or bought, and a new year is not old=old 和 new 相反，可东西是刚买的，新年也不旧;same=same needs *the*, as in *the same*, and it does not mean just bought=same 要和 *the* 连用，比如 *the same*，也不是刚买的意思|new|ew said like *oo*|ew 读作 *oo*
      another|one more cookie;a shirt in a bigger size;one more glass of water|another means one more; more goes with many or an amount|another 是再一个；more 跟复数或数量|more=more goes with a plural or an amount, as in *more cookies*, not with one thing like *cookie*, *one* or *glass*=more 跟复数或数量，比如 *more cookies*，不跟单个的 *cookie*、*one* 或 *glass*;all=all means every one or the whole, not one more=all 是全部，不是再一个|an · oth · er|one word: *an* + *other*|是一个词：*an* 加 *other*
      other|the second sock;the hat I don't like;the rest of the children|the other means the second one or the rest; more means a bigger number|the other 是另一个或其余的；more 是更多|more=more means a bigger number, not the second of two or the rest=more 是更多，不是两个中的另一个或其余的;all=all means every one, and it comes before *the*, as in *all the children*, not after it=all 是全部，放在 *the* 前面，比如 *all the children*，不放在 *the* 后面|oth · er|o said like the u in *up*, and th in the middle|o 读作 *up* 里的 u，中间是 th
      same|one class to sit in together;black shoes for both;twins who look alike|the same means alike; different means not alike|same 是相同；different 是不同|different=different means not alike, but here both things match=different 是不同，可这里两样东西一样;another=another means one more, and it never comes after *the*=another 是再一个，前面从不加 *the*|same|a silent e that makes the a say its name|词尾 e 不发音，让 a 读字母本音
      different|a cat and a dog;a coat in a new color;Chinese and English|different means not alike; the same means alike|different 是不同；same 是相同|same=same means alike, but a cat and a dog, a new color, or Chinese and English are not alike=same 是相同，可猫和狗、换个颜色、中文和英语都不一样;another=another goes with one thing, as in *another color*, and it does not come after *very* or *a*, or before a plural=another 跟单个东西，比如 *another color*，不放在 *very* 或 *a* 后面，也不跟复数|dif · fer · ent|a double f, and -ent at the end|双写 f，结尾是 -ent
      only|one dollar;two dollars;one girl in the team|only means just one or no more; all means every one|only 是只有；all 是全部|all=all means every one or the whole, but here there is just one or a small amount=all 是全部，可这里只有一个或很少;more=more means a bigger amount, but here the amount is small=more 是更多，可这里数量很少|on · ly|o said like *go*, and -ly at the end|o 读作 *go* 里的音，结尾是 -ly
      all|the children in the classroom;the whole cake;thanks to everyone|all means every one or the whole; each means one by one|all 是全部；each 是逐个|each=each goes with one thing, as in *each child*, not before *the* or straight after *thank you*=each 跟单个东西，比如 *each child*，不放在 *the* 前面，也不直接跟在 *thank you* 后面;every=every goes with one thing, as in *every child*, not before *the* or after *you*=every 跟单个东西，比如 *every child*，不放在 *the* 前面或 *you* 后面|all|a double l, and a said like *or*|双写 l，a 读作 *or*
      more|extra rice;a coat that costs a lot;chairs for ten people|more means a bigger amount; most means the biggest of all|more 是更多；most 是最多|most=most means the biggest part of all, not extra, and it does not go with *some* or *than*=most 是最多的部分，不是额外的，也不和 *some* 或 *than* 连用;only=only means no more than, but here someone wants or needs extra=only 是只有，可这里是想要或需要更多|more|ore at the end, as in *store*|结尾是 ore，和 *store* 一样
      most|ten books, more than anyone;children who like ice cream;the costliest shop in town|most is the biggest of all; more compares two|most 是最多；more 是两者比较|more=more compares two, as in *more than*, but here it is the biggest of all or the biggest part of a group=more 用于两者比较，比如 *more than*，可这里是所有里最多的或一群里的大部分;much=much goes with things you don't count, like rice, not with *books*, *children* or *expensive*=much 跟不可数的东西，比如 rice，不跟 *books*、*children* 或 *expensive*|most|o said like *go*, then st|o 读作 *go* 里的音，后面是 st
    `,
  },
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

/** pcAll are every subject with every action; each bank starts at its own place in them. */
const pcAll = everyPair(pcSubjects, pcActions).map(([[subject, be, short], [verb, ing, misspelled, rest]]) => ({
  subject,
  be,
  short,
  verb,
  ing,
  misspelled,
  rest,
}));

const pcItems = (skip: number) => [...pcAll.slice(skip), ...pcAll.slice(0, skip)];

/** otherBe is a form of be that does not match the subject that takes the given one. */
const otherBe = (be: string): string => (be === "is" ? "are" : "is");

const pcChoiceBank: readonly ChoiceItem[] = pcItems(0).map(
  ({ subject, be, verb, ing, rest }): ChoiceItem => [
    `${subject} ___ ${rest} now. (${verb})`,
    `${be} ${ing}`,
    [ing, `${be} ${verb}`, `${otherBe(be)} ${ing}`],
  ],
);

const pcSpellBank: readonly TypedItem[] = pcItems(44).map(
  ({ subject, be, verb, ing, misspelled, rest }): TypedItem => ({
    shown: `${subject} ${be} ___ ${rest}. (${verb})`,
    accepted: [ing],
    wrong: [misspelled, verb],
  }),
);

const pcWriteBank: readonly TypedItem[] = pcItems(84).map(({ subject, be, short, verb, ing, rest }): TypedItem => {
  const full = `${subject} ${be} ${ing} ${rest}.`;
  return {
    shown: `${subject} / ${verb} ${rest} / now`,
    accepted: [short === "" ? full : `[${subject} ${be}|${short}] ${ing} ${rest}( now).`, `${subject} ${be} ${ing} ${rest} now.`],
    canonical: full,
    wrong: [`${subject} ${ing} ${rest}.`, `${subject} ${be} ${verb} ${rest}.`],
  };
});

/** ingRule says how a verb makes its -ing form, in every locale. */
const ingRule = (verb: string, ing: string): Text =>
  ing === `${verb}ing`
    ? t(`*${verb}* just adds *-ing*, with no other change to the verb`, `*${verb}* 直接加 *-ing*，动词本身不做其他变化`)
    : ing === `${verb.slice(0, -1)}ing`
      ? t(`*${verb}* ends in *e*, so it drops the *e* before *-ing*`, `*${verb}* 以 *e* 结尾，去掉 *e* 再加 *-ing*`)
      : t(
          `*${verb}* is short and ends in one vowel and one consonant, so it doubles the last letter`,
          `*${verb}* 是以一个元音加一个辅音结尾的短动词，所以双写最后一个字母`,
        );

/** beOf finds the subject and the form of be at the start of a sentence. */
const beOf = (sentence: string) => {
  const [subject = "", be = ""] = sentence.split(/ (am|is|are) /u);
  return { subject, be };
};

const presentContinuous: TopicDef = {
  id: "present-continuous",
  title: t("The Present Continuous", "现在进行时"),
  summary: t(
    "She is wearing a red coat. What is happening now takes am, is or are and a verb with -ing.",
    "She is wearing a red coat. 正在发生的事用 am、is 或 are 加动词的 -ing 形式。",
  ),
  intro: t(
    "Look at what is happening right now: *Tom is cooking dinner.* and *We are buying new shoes.* English marks an action in progress with two pieces working together—*am*, *is*, or *are* plus the *-ing* form of the verb. In this topic, you pick, spell, and write present-continuous sentences.",
    "看看此刻正在发生的事：*Tom is cooking dinner.* 和 *We are buying new shoes.* 英语用两处配合表达正在进行的动作——*am*、*is* 或 *are* 加上动词的 *-ing* 形式。本主题带你选择、拼写并写出准确的现在进行时句子。",
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
        "For what is happening now, use *am*, *is* or *are* and the verb with *-ing*: *I am reading. She is wearing a red coat. They are playing football.*\n\nYou need both parts: not *She wearing*, not *She is wear*.\n\n> **Watch out.** Check both pieces together: the form of *be* must match the subject (*I am*, *he/she/Tom is*, *we/you/they are*), AND the main verb must end in *-ing*.",
        "表示现在正在发生的事，用 *am*、*is* 或 *are* 加动词的 *-ing* 形式：*I am reading. She is wearing a red coat. They are playing football.*\n\n中文说“她正在穿”，只加“正在”，动词不变；英语两部分缺一不可：不能说 *She wearing*，也不能说 *She is wear*。\n\n> **注意。** 两处必须同时核对：*be* 动词要与主语搭配（*I am*、*he/she/Tom is*、*we/you/they are*），而且后面的实义动词必须加 *-ing*。",
      ),
      choiceGenerator(
        t("Choose the words for the gap.", "选出填入空白处的词。"),
        pcChoiceBank,
        (right, shown) => {
          const sentence = shown.replace(/ \(.*\)$/u, "").replace("___", `*${right}*`);
          const subject = shown.split(" ___")[0];
          const be = right.split(" ")[0];
          return t(
            `*now* says it is happening at this moment, so use *${be}*, the form for *${subject}*, and the verb with *-ing*: ${sentence}\n\n**Check.** Verify both parts of *${right}*—*${be}* agrees with *${subject}*, and the action verb carries *-ing* for an action happening now.`,
            `*now* 表示此刻正在发生，所以用跟 *${subject}* 搭配的 *${be}*，再加动词的 *-ing* 形式：${sentence}\n\n**检验。** 核对 *${right}* 的两部分——*${be}* 与主语 *${subject}* 一致，且实义动词带 *-ing* 表示此刻正在进行。`,
          );
        },
        (wrong, _right, shown, position) =>
          position === 0
            ? t(
                `*${wrong}* has no *am*, *is* or *are*, but the *-ing* form cannot be the verb without one.`,
                `*${wrong}* 前面没有 *am*、*is* 或 *are*，可 *-ing* 形式不能单独作动词。`,
              )
            : position === 1
              ? t(
                  `*${wrong}* has the form of *be* but a plain verb; for what is happening now, the verb takes *-ing*.`,
                  `*${wrong}* 有 *be*，动词却用了原形；表示正在发生的事，动词要加 *-ing*。`,
                )
              : t(
                  `*${wrong}* has the *-ing* form, but *${wrong.split(" ")[0]}* is not the form of *be* for *${shown.split(" ___")[0]}*.`,
                  `*${wrong}* 用了 *-ing* 形式，可 *${wrong.split(" ")[0]}* 不是与 *${shown.split(" ___")[0]}* 搭配的 *be*。`,
                ),
      ),
    ),
    point(
      "spell",
      t("Spelling the -ing form", "拼写 -ing 形式"),
      t(
        "Most verbs just add *-ing*: *read → reading*. A verb that ends in *e* loses it: *make → making*. A short verb that ends in one vowel and one consonant doubles it: *run → running*, *swim → swimming*, *sit → sitting*.\n\n> **Watch out.** Only double the final consonant when the verb ends in *one* short vowel + *one* consonant (*run* -> *running*, *get* -> *getting*)—not after two vowels (*read* -> *reading*, *eat* -> *eating*) or two consonants (*drink* -> *drinking*).",
        "大多数动词直接加 *-ing*：*read → reading*。以不发音的 *e* 结尾的去 *e* 再加：*make → making*。以一个元音加一个辅音结尾的短动词，双写辅音再加：*run → running*、*swim → swimming*、*sit → sitting*。\n\n> **注意。** 只有以*一个*短元音加*一个*辅音结尾的短词才双写词尾（*run* -> *running*、*get* -> *getting*）——两个元音（*read* -> *reading*、*eat* -> *eating*）或两个辅音（*drink* -> *drinking*）结尾时绝不双写。",
      ),
      typedGenerator(
        "word-form",
        t("Type the verb with -ing.", "输入动词的 -ing 形式。"),
        pcSpellBank,
        (right, shown) => {
          const verb = shown.match(/\((.*)\)$/u)?.[1] ?? "";
          const sentence = shown.replace(/ \(.*\)$/u, "").replace("___", `*${right}*`);
          const rule = ingRule(verb, right);
          return t(
            `${rule.en}: ${sentence}\n\n**Check.** Inspect the end of *${verb}*—confirm whether it drops a silent *e*, doubles a single final consonant after one short vowel, or simply adds *-ing*.`,
            `${rule["zh-CN"]}：${sentence}\n\n**检验。** 看看原形 *${verb}* 的结尾——确认该去不发音的 *e*、双写单辅音，还是直接加 *-ing*。`,
          );
        },
        presentContinuousSpellNot,
      ),
    ),
    point(
      "write",
      t("Writing what is happening", "写出正在发生的事"),
      t(
        "Write a sentence from the note with *am*, *is* or *are* and the *-ing* form: *We / swim in the sea / now* → *We are swimming in the sea.* Short forms like *She's* are fine.\n\n> **Watch out.** Never drop *am/is/are* before the *-ing* verb, and check the spelling of tricky *-ing* forms like *writing*, *making*, *running*, and *getting*.",
        "根据笔记用 *am*、*is* 或 *are* 加 *-ing* 形式写一个句子：*We / swim in the sea / now* → *We are swimming in the sea.* 也可以用 *She's* 这样的缩写。\n\n> **注意。** 切勿漏掉 *-ing* 动词前的 *am/is/are*，同时核对 *writing*、*making*、*running*、*getting* 等易错拼写。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Write a sentence from the note.", "根据笔记写一个句子。"),
        pcWriteBank,
        (right, shown) => {
          const { subject, be } = beOf(right);
          const verb = shown.split(" / ")[1]?.split(" ")[0] ?? "";
          const ing = right.split(` ${be} `)[1]?.split(" ")[0] ?? "";
          const rule = ingRule(verb, ing);
          return t(
            `The note says *now*, so use *${be}*, the form for *${subject}*, and the *-ing* form; ${rule.en}: ${right}\n\n**Check.** Verify all three checkpoints: *${be}* matches *${subject}*, *${ing}* is spelled right, and the sentence begins with a capital and ends with a period.`,
            `笔记写着 *now*，所以用跟 *${subject}* 搭配的 *${be}* 加 *-ing* 形式；${rule["zh-CN"]}：${right}\n\n**检验。** 核对三处：*${be}* 与主语 *${subject}* 搭配、*${ing}* 拼写准确，且句首大写、句末有句号。`,
          );
        },
        presentContinuousWriteNot,
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
  ["How ___ {n} do you have?", "How ___ {n} do you have?"],
  ["How ___ {n} does she need?", "How ___ {n} does she need?"],
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
  everyPair(manyNouns, howFrames).map(([n, [frame]]): ChoiceItem => [frame.replace("{n}", n), "many", ["much", "lot"]]),
  everyPair(muchNouns, howFrames).map(([n, [, frame]]): ChoiceItem => [frame.replace("{n}", n), "much", ["many", "lot"]]),
  priced.map(([thing, be]): ChoiceItem => [`How ___ ${be} ${thing}?`, "much", ["many", "lot"]]),
]);

const numberWords: readonly string[] = ["three", "six", "ten", "twelve", "five", "eight", "four"];

const howTypedBank: readonly TypedItem[] = interleave([
  everyPair(manyNouns, numberWords).map(
    ([n, number]): TypedItem => ({
      shown: `There are ${number} ${n}.`,
      accepted: [`How many ${n} are there?`],
      wrong: [`How much ${n} are there?`, `How many ${n} is there?`],
      instruction: t("Write the question for this answer.", "写出这个回答对应的问句。"),
    }),
  ),
  everyPair(muchNouns, ["a lot of", "a little"]).map(
    ([n, amount]): TypedItem => ({
      shown: `There is ${amount} ${n}.`,
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

/** howNoun finds the noun after the gap of a how question; a question about a price has none. */
const howNoun = (shown: string) => (/___ (is|are) /u.test(shown) ? "" : (shown.split("___ ")[1]?.split(" ")[0] ?? ""));

/** howReason says why a how question takes much or many. */
const howReason = (shown: string): Text => {
  const noun = howNoun(shown);
  if (noun === "") return t("This asks a price, and a price always takes *how much*", "这里问的是价钱，问价钱总用 *how much*");
  return manyNouns.includes(noun)
    ? t(`*${noun}* are things you count, in the plural, so ask *how many*`, `*${noun}* 是可数名词的复数，所以用 *how many*`)
    : t(`*${noun}* is a thing you do not count, so ask *how much*`, `*${noun}* 是不可数名词，所以用 *how much*`);
};

const howMuchAndHowMany: TopicDef = {
  id: "how-much-and-how-many",
  title: t("How Much and How Many", "how much 和 how many"),
  summary: t(
    "How many apples? How much milk? How much is it? Many for things you count, much for things you do not, and for prices.",
    "How many apples? How much milk? How much is it? 可数的东西用 many，不可数的用 much，问价钱也用 much。",
  ),
  intro: t(
    "Compare *How many books do you have?* with *How much water do we need?* and *How much are these shoes?* English asks *how many* for countable plurals, and *how much* both for uncountable nouns and for every price question. In this topic, you choose between *much* and *many* and write full quantity and price questions.",
    "比较 *How many books do you have?*、*How much water do we need?* 和 *How much are these shoes?* 英语对可数复数问 *how many*，对不可数名词以及所有价格问题都问 *how much*。本主题带你区分 *much* 与 *many*，并写出完整的数量与价格问句。",
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
        "*How many* with things you count, in the plural: *How many apples do you want?*\n\n*How much* with things you don't count: *How much milk is there?* And for a price: *How much is this hat?*\n\n> **Watch out.** Asking about a plural item's *price* still uses *how much* (*How much are these shoes?*), never *how many*—and never write *how lot*.",
        "可数名词用 *how many*，后接复数：*How many apples do you want?*\n\n不可数名词用 *how much*：*How much milk is there?* 问价钱也用 *how much*：*How much is this hat?*\n\n中文都说“多少”，英语却要分 *many* 和 *much*。\n\n> **注意。** 问复数商品的*价钱*时依然用 *how much*（如 *How much are these shoes?*），绝不用 *how many*；也绝不能说 *how lot*。",
      ),
      choiceGenerator(
        t("Choose the word for the gap.", "选出填入空白处的词。"),
        howChoiceBank,
        (right, shown) => {
          const reason = howReason(shown);
          return t(
            `${reason.en}: ${shown.replace("___", `*${right}*`)}\n\n**Check.** Look right after the gap: a price (*is/are [item]*) or an uncountable noun takes *much*, while a countable plural takes *many*.`,
            `${reason["zh-CN"]}：${shown.replace("___", `*${right}*`)}\n\n**检验。** 看空白后面紧接的词：问价钱（*is/are + 商品*）或不可数名词用 *much*，可数复数名词用 *many*。`,
          );
        },
        (wrong, _right, shown) => {
          const noun = howNoun(shown);
          if (wrong === "lot")
            return t(
              "*lot* only goes in *a lot of*; it cannot follow *how* in a question.",
              "*lot* 只用在 *a lot of* 里，不能跟在问句的 *how* 后面。",
            );
          if (wrong === "many")
            return noun === ""
              ? t("*many* asks for a number of things, but this question asks a price.", "*many* 问的是东西的数量，可这个问句问的是价钱。")
              : t(
                  `*many* is for things you count, but *${noun}* is not counted one by one.`,
                  `*many* 用于可数名词，可 *${noun}* 不能一个一个地数。`,
                );
          return t(
            `*much* is for things you do not count, but *${noun}* are counted one by one.`,
            `*much* 用于不可数名词，可 *${noun}* 可以一个一个地数。`,
          );
        },
      ),
    ),
    point(
      "ask",
      t("Asking the question", "提出问题"),
      t(
        "Write the question that the answer replies to. *There are three apples.* → *How many apples are there?* *It's five dollars.* → *How much is it?*\n\n> **Watch out.** Match the verb *is/are* to the noun: *How many [plural] are there?*, *How much [uncountable] is there?*, and for prices *How much is [one item]?* vs. *How much are [plural items]?*",
        "写出与回答对应的问句。*There are three apples.* → *How many apples are there?* *It's five dollars.* → *How much is it?*\n\n> **注意。** 核对动词 *is/are* 与名词的搭配：*How many [复数] are there?*、*How much [不可数] is there?*；问价钱时单数用 *How much is…?*，复数用 *How much are…?*（不要对复数衣物误用 *is*）。",
      ),
      typedGenerator(
        "sentence",
        t("Write the question.", "写出问句。"),
        howTypedBank,
        (right) => {
          const reason = howReason(right.replace(/^How (much|many)/u, "How ___"));
          const be = right.match(/ (is|are) /u)?.[1] ?? "";
          return t(
            `${reason.en}, and *${be}* agrees with what follows: ${right}\n\n**Check.** Verify three things: *How many* vs. *How much*, *is* vs. *are*, and the closing question mark.`,
            `${reason["zh-CN"]}，*${be}* 要与后面的词一致：${right}\n\n**检验。** 核对三处：*How many* 还是 *How much*、*is* 还是 *are*，以及句末问号。`,
          );
        },
        howMuchAndHowManyAskNot,
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
  ({ note, right, who, be, outfit }): ChoiceItem => [
    note,
    right,
    [`${who} wearing ${outfit}.`, `${who} ${be} wear ${outfit}.`, `${who} ${otherBe(be)} wearing ${outfit}.`],
  ],
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
  intro: t(
    "Turn a quick note like `Our teacher / a green hat` into a full sentence: *Our teacher is wearing a green hat.* English uses *am/is/are wearing* for every kind of clothing—hats, shoes, coats, or dresses alike. In this topic, you pick and write complete present-continuous outfit sentences from notes.",
    "把简短笔记 `Our teacher / a green hat` 写成完整句子：*Our teacher is wearing a green hat.* 英语不论帽子、鞋子还是外套，描述正在穿戴时一律用 *am/is/are wearing*。本主题带你根据笔记选出并写出规范的衣着描述句。",
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
        "A note gives a person and the clothes. The sentence adds *is wearing* (or *am* or *are wearing*), a capital letter and a period.\n\n*Mia / a blue dress* → *Mia is wearing a blue dress.* *Tom and Ben / black shoes* → *Tom and Ben are wearing black shoes.*\n\n> **Watch out.** Check both halves of the verb phrase: *am/is/are* must agree with the subject, and *wear* must carry *-ing* (*wearing*, never *wear*).",
        "笔记给出一个人和他穿的衣服。写成句子时加上 *is wearing*（或 *am*、*are wearing*），句首大写，句末加句号。\n\n*Mia / a blue dress* → *Mia is wearing a blue dress.* *Tom and Ben / black shoes* → *Tom and Ben are wearing black shoes.*\n\n注意：中文“穿”和“戴”分开说，英语帽子、鞋、衣服都用 *wear*。\n\n> **注意。** 动词短语的两部分都要核对：*am/is/are* 与主语一致，且 *wear* 必须变成 *wearing*（不能用原形）。",
      ),
      choiceGenerator(
        t("Choose the sentence that matches the note.", "选出与笔记相符的句子。"),
        wearChoiceBank,
        (right) => {
          const { subject, be } = beOf(right);
          return t(
            `The note gives the person and the clothes; add *${be}*, the form for *${subject}*, and *wearing*: ${right}\n\n**Check.** Confirm the frame *[Subject] + ${be} + wearing + [clothes].* with *${be}* matching *${subject}*.`,
            `笔记给出人和衣服；加上跟 *${subject}* 搭配的 *${be}* 和 *wearing*：${right}\n\n**检验。** 核对结构“主语 + *${be}* + *wearing* + 衣物”，确认 *${be}* 与 *${subject}* 搭配。`,
          );
        },
        (_wrong, _right, _shown, position) =>
          position === 0
            ? t(
                "This leaves out *am*, *is* or *are*, but *wearing* cannot be the verb without one.",
                "这句漏了 *am*、*is* 或 *are*，可 *wearing* 不能单独作动词。",
              )
            : position === 1
              ? t(
                  "This uses the plain verb *wear*, but for what someone has on now the verb takes *-ing*.",
                  "这句用了动词原形 *wear*，可说某人现在穿着什么，动词要加 *-ing*。",
                )
              : t(
                  "This has *wearing*, but its form of *be* does not match the person: *I am*, *he* or *she is*, *we* or *they are*.",
                  "这句有 *wearing*，可 *be* 的形式与人不搭配：*I am*，*he*、*she is*，*we*、*they are*。",
                ),
      ),
    ),
    point(
      "write",
      t("Writing the sentence", "写出句子"),
      t(
        "Write a whole sentence for the note: the person, then *am*, *is* or *are* to match, then *wearing* and the clothes—for example, *The girls / red socks* → *The girls are wearing red socks.* Start with a capital letter and end with a period.\n\n> **Watch out.** Do not drop *am/is/are* before *wearing*, and remember to keep the article (*a*/*an*) from the note when there is one.",
        "根据笔记写一个完整的句子：先写人，再写与之搭配的 *am*、*is* 或 *are*，然后是 *wearing* 和衣服，例如 *The girls / red socks* → *The girls are wearing red socks.* 句首大写，句末加句号。\n\n> **注意。** 不要漏掉 *wearing* 前的 *am/is/are*，笔记里若有冠词（*a*/*an*）也要完整保留。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Write a sentence from the note.", "根据笔记写一个句子。"),
        wearTypedBank,
        (right) => {
          const { subject, be } = beOf(right);
          return t(
            `Write the person, *${be}* to match *${subject}*, then *wearing* and the clothes, with a capital and a period: ${right}\n\n**Check.** Check all four items: capital first letter, *${be}* matching *${subject}*, *wearing* spelled with *-ing*, and a closing period.`,
            `先写人，再写与 *${subject}* 搭配的 *${be}*，然后是 *wearing* 和衣服，句首大写，句末加句号：${right}\n\n**检验。** 核对四项：句首大写、*${be}* 与 *${subject}* 搭配、*wearing* 带 *-ing*，以及句末句号。`,
          );
        },
        writingWhatPeopleAreWearingWriteNot,
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
