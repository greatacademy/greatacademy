// A1, unit 12: In Town. Places in town, directions and trips, wh- questions, can for requests, and directions to your
// home judged by a model.

import { type CriterionSpec, type Text, type TopicDef, t } from "@ga/content";
import {
  type ChoiceItem,
  choiceGenerator,
  criterionById,
  point,
  type TypedItem,
  typedGenerator,
  type WritingItem,
  writingGenerator,
} from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, interleave, vocabularyTopic, word } from "../words.ts";
import { canForRequestsAskNot, whQuestionsAskNot } from "./mistakes.ts";

const town = vocabularyTopic({
  id: "a1-words-town",
  title: t("In Town", "城镇里"),
  summary: t(
    "Streets and roads, buses, cars and trains, and the places in a town.",
    "街道和马路，公交车、汽车和火车，以及城镇里的各种地方。",
  ),
  intro: t(
    "In our **town**, the **bus** stops at the **station**, and there is a **bank** and a **museum** on Green Street. These words help you find your way around a town.",
    "在我们 **town**（镇上），**bus**（公交车）停在 **station**（车站），绿街上有一家 **bank**（银行）和一座 **museum**（博物馆）。这些词帮你在镇上认路。",
  ),
  prerequisites: ["a1-words-home"],
  words: [
    word(
      "town towns",
      "a place with many houses and shops, smaller than a city",
      "城镇",
      "I live in a small {town} with a hundred streets. | Our {town} has one museum, two schools and many streets. | The {town} has a big market in its main street on Saturdays.",
      "street road",
    ),
    word(
      "street streets",
      "a road in a town, with houses or shops on it",
      "街道",
      "My school is on Green {Street}.|Town Station | Look both ways before you cross the {street}. | There are many shops on this {street}.",
      "town station",
    ),
    word(
      "road roads",
      "a way for cars, buses and bikes to go from one place to another",
      "马路；道路",
      "Don't play on the {road}! Cars go fast here. | Cars and buses take this {road} to the airport. | The {road} is busy with cars in the morning.",
      "path river",
    ),
    word(
      "bus buses",
      "a big car that carries many people along a set way",
      "公共汽车",
      "I go to school by {bus} with thirty other children. It stops at every corner. | The number 5 {bus} goes along our street to the zoo. | We waited at the bus stop for the {bus}.",
      "car train",
    ),
    word(
      "car cars",
      "a machine with four wheels that people drive",
      "汽车",
      "My dad drives a red {car}. It has four seats. | Our family has two {cars} in the garage.|buses trains | Put on your seat belt in the {car}. Dad is driving.",
      "bus train",
    ),
    word(
      "train trains",
      "a line of cars that goes on rails",
      "火车",
      "Our {train} goes along the rails to Shanghai. | The {train} leaves from platform 3. | The fast {train} goes 300 kilometers an hour.",
      "bus car",
    ),
    word(
      "station stations",
      "a place where trains or buses stop for people to get on and off",
      "车站",
      "The train is at the {station}. | Meet me at the bus {station} at four. | The {station} is very busy in the morning, with trains coming and going.",
      "street bank",
    ),
    word(
      "bank banks",
      "a place where people keep their money",
      "银行",
      "Mom gets money from the {bank}. | The {bank} keeps people's money safe. | I want to put my money in the {bank}.",
      "hotel museum",
    ),
    word(
      "restaurant restaurants",
      "a place where people pay to sit and eat a meal",
      "餐馆",
      "We have dinner at a Chinese {restaurant} and then go home to sleep. | This {restaurant} only sells food. It has very good noodles. | The {restaurant} is full. There are no tables.",
      "hotel museum",
    ),
    word(
      "hotel hotels",
      "a building where people pay to sleep when they travel",
      "旅馆；酒店",
      "We stayed in a {hotel} near the beach. | Our {hotel} room has a big bed. | The {hotel} has a hundred bedrooms.",
      "restaurant museum",
    ),
    word(
      "museum museums",
      "a building where you can look at old or important things",
      "博物馆",
      "We saw dinosaur bones at the {museum}. | The art {museum} is open on Sundays. | There are old Chinese bowls in this {museum}.",
      "hotel bank",
    ),
    word(
      "map maps",
      "a picture that shows where streets, towns and countries are",
      "地图",
      "Let's look at the {map}. Where is the museum? | I can't find the hotel. Do you have a {map}? | This {map} shows all the streets in the town.",
      "ticket card",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "Ask what people do there: you keep money in a *bank*, eat in a *restaurant*, sleep in a *hotel* and look at old things in a *museum*. A *town* has many *streets*.",
        "想想人们在那里做什么：在 *bank* 存钱，在 *restaurant* 吃饭，在 *hotel* 住宿，在 *museum* 看古老的东西。一个 *town* 里有很多 *streets*。",
      ),
      meaning: t(
        "A *bus* carries many people along a set way, a *car* has a few seats, and a *train* runs on rails. A *station* is where trains or buses stop.",
        "*bus* 沿固定路线载很多人，*car* 只有几个座位，*train* 在铁轨上跑。*station* 是火车或公交车停靠的地方。",
      ),
      spell: t(
        "*Restaurant* has au in the middle, *museum* has eu, and *bus* doubles nothing but adds -es in *buses*.",
        "*restaurant* 中间是 au，*museum* 中间是 eu，*bus* 的复数是 *buses*，不双写。",
      ),
    },
    notes: `
      town|a hundred streets;one museum and two schools;a market on its main street|a town is a place with many streets and shops; a street is one road in it|town 是有很多街道和商店的地方；street 是其中一条路|street=street is one road, so it does not have a hundred streets, two schools or its own main street=street 只是一条路，不会有一百条街、两所学校或自己的主街;road=road is a way for cars, so it does not have streets, a museum or a market on its main street=road 是车走的路，不会有街道、博物馆或主街上的市场|town|ow said like *now*|ow 读作 *now*
      street|Green Street as a name;crossing it after looking both ways;many shops on it|a street is a road in a town; a town is the whole place|street 是镇里的街；town 是整个城镇|town=town is the whole place, so you do not cross a town after looking both ways or have shops *on* it=town 是整个城镇，不会左右看后穿过一个镇，商店也不是开在镇“上面”;station=station is where trains stop, not a name like Green Street, something you cross or a place with many shops on it=station 是火车停的地方，不是 Green Street 这样的街名，不能穿过，也不是两边开满商店的地方|street|a double e, and str at the start|双写 e，开头是 str
      road|cars going fast;cars and buses to the airport;busy with cars|a road is for cars, buses and bikes; a path is for walking|road 是车走的路；path 是步行的小路|path=path is a small way for walking, not one where cars and buses go fast=path 是步行小路，汽车公交车不在上面飞驰;river=river is water, so cars and buses do not drive on it=river 是河水，汽车公交车不在上面开|road|oa said like *go*|oa 读作 *go*
      bus|thirty other children and every corner;number 5 along our street;the bus stop|a bus carries many people and stops often; a train runs on rails|bus 载很多人、站站停；train 在铁轨上跑|car=car has only a few seats, so it does not carry thirty children, have a number like 5 or come to a bus stop=car 只有几个座位，不会载三十个孩子、没有 5 路这样的编号，也不停在公交站;train=train runs on rails, so it does not stop at every street corner, go along our street or come to a bus stop=train 在铁轨上跑，不会每个街角都停，不沿我们的街开，也不停在公交站|bus|one s, and -es in *buses*|只有一个 s，复数是 *buses*
      car|four seats;two in the garage;a seat belt with Dad driving|a car is small with four wheels; a bus is big and carries many people|car 小，有四个轮子；bus 大，载很多人|bus/buses=bus has many seats and does not fit in a family garage or have Dad as a family driver=bus 座位很多，放不进家里的车库，也不是爸爸开着带全家的;train/trains=train runs on rails, so a family does not keep two in a garage or have four seats=train 在铁轨上跑，家里不会在车库停两列火车，也不止四个座位|car|ar said like *far*|ar 读作 *far*
      train|rails to Shanghai;platform 3;300 kilometers an hour|a train runs on rails; a bus runs on roads|train 在铁轨上跑；bus 在马路上跑|bus=bus goes on roads, not on rails, and it does not leave from platform 3 or go 300 kilometers an hour=bus 在马路上开，不在铁轨上，不从 3 号站台出发，也开不到每小时 300 公里;car=car goes on roads, not on rails, and it does not leave from a platform or go 300 kilometers an hour=car 在马路上开，不在铁轨上，不从站台出发，也开不到每小时 300 公里|train|ai said like the a in *name*|ai 读作 *name* 里的 a
      station|where the train is;the bus station at four;trains coming and going|a station is where trains or buses stop; a street is a road|station 是车站；street 是街|street=street is a road, so trains do not wait at it, and *bus street* is not English=street 是路，火车不在街上停，也没有 *bus street* 的说法;bank=bank keeps money, so trains do not come and go there, and *bus bank* is not English=bank 是存钱的地方，火车不在那里进出，也没有 *bus bank* 的说法|sta · tion|-tion at the end, said like *shun*|结尾是 -tion，读作 *shun*
      bank|getting money;keeping money safe;putting my money in|a bank keeps people's money; a hotel is where people sleep|bank 保管钱；hotel 是住宿的地方|hotel=hotel is where people sleep when they travel, not where you get or keep money=hotel 是旅行时住的地方，不是取钱或存钱的地方;museum=museum shows old things, not where you get or keep money=museum 展出古老的东西，不是取钱或存钱的地方|bank|nk at the end|结尾是 nk
      restaurant|dinner and then home to sleep;only food and good noodles;full with no tables|a restaurant is where you pay to eat; a hotel is where you pay to sleep|restaurant 是吃饭的地方；hotel 是住宿的地方|hotel=hotel is where you sleep, but here you go home to sleep, it only sells food and its tables are full=hotel 是住的地方，可这里吃完回家睡，只卖吃的，桌子都坐满了;museum=museum shows old things, not dinner, noodles or tables for eating=museum 展出古老的东西，不卖晚饭、面条，也没有吃饭的桌子|res · tau · rant|au in the middle, and -ant at the end|中间是 au，结尾是 -ant
      hotel|staying near the beach;a room with a big bed;a hundred bedrooms|a hotel is where you pay to sleep; a restaurant is where you pay to eat|hotel 是住宿的地方；restaurant 是吃饭的地方|restaurant=restaurant is for eating, so you do not stay there for your holiday or sleep in its bedrooms=restaurant 是吃饭的地方，不在那里度假住宿，也没有卧室;museum=museum shows old things, not rooms with beds to stay in=museum 展出古老的东西，没有带床的房间供人住|ho · tel|the stress on *tel*|重音在 *tel*
      museum|dinosaur bones;art open on Sundays;old Chinese bowls|a museum shows old or important things; a hotel is for sleeping|museum 展出古老或重要的东西；hotel 是住宿的地方|hotel=hotel is where people sleep, not where you see dinosaur bones, art or old bowls=hotel 是住宿的地方，不是看恐龙骨头、艺术品或古碗的地方;bank=bank keeps money, not dinosaur bones, art or old bowls=bank 保管钱，不放恐龙骨头、艺术品或古碗|mu · se · um|eu in the middle, said like *you-ZEE-um*|中间是 eu，读作 *you-ZEE-um*
      map|where the museum is;finding the hotel;all the streets in the town|a map shows where places are; a ticket lets you get on a bus or a train|map 显示地方的位置；ticket 让你上车|ticket=ticket lets you get on a bus or a train, but it does not show where the museum, the hotel or the streets are=ticket 让你上车，但不显示博物馆、旅馆或街道在哪里;card=card is a small piece of paper, and it does not show where places are or all the streets in a town=card 是小卡片，不显示地方在哪，也不画出镇上所有街道|map|a short a, and p at the end|短元音 a，结尾是 p
    `,
  },
});

const directions = vocabularyTopic({
  id: "a1-words-directions",
  title: t("Directions", "方向"),
  summary: t(
    "Left, turn, straight, stop, cross and corner, near and far, and getting about.",
    "左、转弯、直走、停、穿过和拐角，远和近，以及出行。",
  ),
  intro: t(
    "Go **straight** on, **cross** the road and **turn** **left** at the **corner**. The station isn't **far**. These words help you ask for and give directions.",
    "一直 **straight**（往前走），**cross**（穿过）马路，在 **corner**（拐角）处 **turn**（转）**left**（向左）。车站不 **far**（远）。这些词帮你问路和指路。",
  ),
  prerequisites: ["a1-words-town"],
  words: [
    word(
      "left",
      "on the side of your body where most people have their heart",
      "左边；向左",
      "Turn {left} at the bank, not right. | I write with my {left} hand, not my right. | The museum is on the {left}, and the bank is on the right.",
      "right straight",
    ),
    word(
      "turn turns turned turning",
      "to go in a new way, left or right",
      "转弯；转动",
      "{Turn} right at the corner. | Don't {turn} left here. Go straight on. | The bus {turned} into Park Road.|crossed stopped",
      "cross stop",
    ),
    word(
      "straight",
      "not turning; in a line",
      "直；直的",
      "Go {straight} on, then turn left. | She has long {straight} hair. | Walk {straight} to the end of the street.",
      "left far",
    ),
    word(
      "stop stops stopped stopping",
      "to not move any more; a place where a bus stops",
      "停下；车站",
      "{Stop}! The light is red. | The bus {stops} outside our school, and we get off.|turns crosses | Get off at the next bus {stop}.",
      "turn cross",
    ),
    word(
      "cross crosses crossed crossing",
      "to go from one side of a road or river to the other",
      "穿过；横过",
      "{Cross} the road at the green light. | We {crossed} the river by boat.|turned stopped | Be careful when you {cross} the street.",
      "turn stop",
    ),
    word(
      "corner corners",
      "the place where two streets meet",
      "拐角",
      "The bank is on the {corner} of Park Road and Green Street. | Turn left at the {corner}. | There's a shop on the {corner}, where the two streets meet.",
      "way left",
    ),
    word(
      "far farther farthest",
      "a long way away",
      "远的；远",
      "Is the station {far} from here? — No, it's near. | My school isn't {far}. I can walk there. | The airport is {farther} than the station, so we take a taxi.|nearer closer",
      "near close",
    ),
    word(
      "way ways",
      "how to get to a place; a road or path",
      "路；方法",
      "Can you tell me the {way} to the station? | Is this the right {way} to the museum? | We lost our {way} in the forest.",
      "corner left",
    ),
    word(
      "ticket tickets",
      "a piece of paper that lets you get on a bus or a train, or go into a place",
      "票",
      "I need a {ticket} to get on the train. | Two {tickets} to Beijing, please. | Show your {ticket} to the driver, and you can get on.",
      "map way",
    ),
    word(
      "travel travels traveled traveling",
      "to go from one place to another, often far away",
      "旅行；出行",
      "I want to {travel} around the world. | They {travel} to work by train. | Last summer we {traveled} to Japan.|visited crossed",
      "visit cross",
    ),
    word(
      "visit visits visited visiting",
      "to go and see a person or a place",
      "拜访；参观",
      "We {visit} Grandma every Sunday. | Let's {visit} the museum tomorrow. | They {visited} the Great Wall last year.|traveled arrived",
      "travel arrive",
    ),
    word(
      "plane planes",
      "a machine with wings that flies people through the sky",
      "飞机",
      "We flew to Sydney by {plane}. | The {plane} lands at the airport at six. | Look! A {plane} is flying over our house.",
      "train ship",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Turn* goes with *left* or *right*, *go straight on* means do not turn, and you *cross* a road or a river from one side to the other. Look at the word after the gap.",
        "*turn* 和 *left*、*right* 连用，*go straight on* 是不拐弯，*cross* 是从路或河的一边到另一边。看空格后面的词。",
      ),
      meaning: t(
        "You *travel* to go from place to place, but you *visit* a person or a place to see them. A *corner* is where two streets meet, and the *way* is how to get somewhere.",
        "*travel* 是从一地到另一地，*visit* 是去看望人或参观地方。*corner* 是两条街相交的地方，*way* 是去某处的路。",
      ),
      spell: t(
        "*Straight* has aigh with a silent gh; *travel* becomes *traveled*, with one l in American English; *far* becomes *farther*.",
        "*straight* 里是 aigh，gh 不发音；*travel* 的过去式是 *traveled*，美式只有一个 l；*far* 的比较级是 *farther*。",
      ),
    },
    notes: `
      left|turning at the bank not right;writing hand not my right;the museum with the bank on the right|left is the side opposite right; straight means not turning|left 是左；straight 是不拐弯|right=right is the other side, but each sentence says *not right* or puts something else on the right=right 是另一边，可每句都说了 *not right*，或者把别的东西放在右边;straight=straight means not turning, and *turn straight*, *straight hand* and *on the straight* are not English=straight 是不拐弯，没有 *turn straight*、*straight hand*、*on the straight* 的说法|left|ft at the end|结尾是 ft
      turn|right at the corner;left here;into Park Road|you turn left or right; you cross from one side to the other|turn 是拐弯；cross 是横过|cross/crossed=cross means to go to the other side, and *cross right*, *cross left* and *crossed into Park Road* are not English=cross 是到另一边，没有 *cross right*、*cross left*、*crossed into Park Road* 的说法;stop/stopped=stop means to not move, and *stop right at the corner* or *stopped into Park Road* does not mean going a new way=stop 是停下，*stop right at the corner*、*stopped into Park Road* 都不是拐向新方向|turn|ur said like *er*|ur 读作 *er*
      straight|going on before turning;long hair with no curls;to the end of the street|straight means in a line with no turns; left means to the left side|straight 是直的；left 是向左|left=left means to the left side, and *go left on, then turn left* or *long left hair* is not English=left 是左边，没有 *go left on, then turn left*、*long left hair* 的说法;far=far means a long way away, and *go far on*, *far hair* and *walk far to the end* are not English=far 是远，没有 *go far on*、*far hair*、*walk far to the end* 的说法|straight|aigh with a silent gh|aigh 里 gh 不发音
      stop|a red light;outside our school to get off;the next bus stop|you stop when you do not move any more; you turn when you go a new way|stop 是停；turn 是转|turn/turns=turn means to go a new way, but a red light and getting off need you to not move, and *bus turn* is not English=turn 是转弯，可红灯和下车都要停下，也没有 *bus turn* 的说法;cross/crosses=cross means to go to the other side, but a red light means do not go, and *bus cross* is not English=cross 是穿过，可红灯表示不能走，也没有 *bus cross* 的说法|stop|a single p, and pp in *stopped*|只有一个 p，*stopped* 双写 p
      cross|the road at the green light;the river by boat;the street with care|you cross from one side to the other; you stop when you do not move|cross 是横过；stop 是停|turn/turned=turn means to go left or right, and *turn the road*, *turned the river* and *turn the street* are not English=turn 是左转或右转，没有 *turn the road*、*turned the river*、*turn the street* 的说法;stop/stopped=stop means to not move, but a green light means go, and you cannot stop a river by boat=stop 是停，可绿灯表示可以走，也不能坐船让河停下|cross|a double s|双写 s
      corner|Park Road and Green Street;turning left there;where two streets meet|a corner is where two streets meet; the way is how to get somewhere|corner 是两条街相交的地方；way 是去某处的路|way=way is how to get somewhere, not the place where two streets meet=way 是去某处的路，不是两条街相交的地方;left=left is a side, and *turn left at the left* or *the left of Park Road and Green Street* does not make sense=left 是一边，*turn left at the left*、*the left of Park Road and Green Street* 都说不通|cor · ner|or said like *for*, and -er at the end|or 读作 *for*，结尾是 -er
      far|not near;walking there;a taxi to the airport|far means a long way away; near means close|far 是远；near 是近|near/nearer=near means close, but *No, it's near*, *isn't* and taking a taxi show the place is a long way away or not=near 是近，可 *No, it's near*、*isn't* 和打车都说明这里讲的是远不远;close/closer=close means not far, but *it's near* answers no, and you take a taxi because it is a long way=close 是近，可回答 *it's near* 是在否定，打车是因为远|far|ar said like *car*, and *farther* with a double r|ar 读作 *car*，*farther* 双写 r
      way|to the station;the right one to the museum;lost in the forest|the way is how to get somewhere; a corner is where two streets meet|way 是去某处的路；corner 是街角|corner=corner is one place where streets meet, and you cannot be told *the corner to the station* or lose your corner=corner 是街道相交处，没人告诉你 *the corner to the station*，也不会丢了街角;left=left is a side, and *the left to the station*, *the right left* and *lost our left* are not English=left 是一边，没有 *the left to the station*、*the right left*、*lost our left* 的说法|way|ay said like *say*|ay 读作 *say*
      ticket|getting on the train;two to Beijing;showing it to the driver|a ticket lets you get on; a map shows where places are|ticket 让你上车；map 显示地方的位置|map=map shows where places are, but it does not let you get on a train or a bus=map 显示地方在哪里，但不能让你上火车或公交车;way=way is how to get somewhere, and you cannot show a way to a driver or buy two ways to Beijing=way 是路，不能把路给司机看，也不能买两条去北京的路|tick · et|ck in the middle|中间是 ck
      travel|around the world;to work by train;to Japan|you travel from place to place; you visit to see someone or something|travel 是出行；visit 是看望或参观|visit/visited=visit goes straight before the person or place, and *visit around the world*, *visit to work* and *visited to Japan* are not English=visit 后面直接接人或地点，没有 *visit around the world*、*visit to work*、*visited to Japan* 的说法;cross/crossed=cross means to go to the other side, and *cross around the world* or *crossed to Japan* is not English=cross 是到另一边，没有 *cross around the world*、*crossed to Japan* 的说法|trav · el|one l in *traveled*|*traveled* 里只有一个 l
      visit|Grandma;the museum;the Great Wall|you visit a person or a place to see them; you travel to get somewhere|visit 是看望或参观；travel 是出行|travel/traveled=travel needs *to*, and *travel Grandma*, *travel the museum* and *traveled the Great Wall* are not English=travel 要加 *to*，没有 *travel Grandma*、*travel the museum*、*traveled the Great Wall* 的说法;arrive/arrived=arrive needs *at* or *in*, and *arrive Grandma* or *arrived the Great Wall* is not English=arrive 要加 *at* 或 *in*，没有 *arrive Grandma*、*arrived the Great Wall* 的说法|vis · it|s said like z|s 读作 z
      plane|flying to Sydney;landing at the airport;flying over our house|a plane flies; a train runs on rails|plane 在天上飞；train 在铁轨上跑|train=train runs on rails, so you do not fly by train, and it does not land at an airport or fly over a house=train 在铁轨上跑，不能坐火车飞，也不会在机场降落或从房子上飞过;ship=ship goes on the sea, so you do not fly by ship, and it does not land at an airport or fly over a house=ship 在海上走，不能坐船飞，也不会在机场降落或从房子上飞过|plane|a silent e, the same sound as *plain*|词尾 e 不发音，和 *plain* 同音
    `,
  },
});

const trips = vocabularyTopic({
  id: "a1-words-trips",
  title: t("Trips", "旅行"),
  summary: t(
    "Trips and holidays, airports and bridges, boats, ships and taxis, arriving and leaving, fast and slow.",
    "旅行和假期，机场和桥，船和出租车，到达和离开，快和慢。",
  ),
  intro: t(
    "On our **holiday**, we take a **taxi** to the **airport**, and the plane **arrives** in the evening. Then we go across the sea by **ship**. These words help you talk about a trip.",
    "**holiday**（假期）里，我们坐 **taxi**（出租车）去 **airport**（机场），飞机傍晚 **arrives**（到达）。然后我们坐 **ship**（轮船）过海。这些词帮你谈论旅行。",
  ),
  prerequisites: ["a1-words-directions"],
  words: [
    word(
      "trip trips",
      "a short journey to a place and back",
      "旅行；出行",
      "We went on a school {trip} to the zoo. | Have a good {trip} to the zoo and back! | The {trip} to the beach takes two hours.",
      "holiday ship",
    ),
    word(
      "holiday holidays",
      "a time with no school or work, often when people travel",
      "假期",
      "We have no school in the summer {holiday}, so we go to the beach. | Today is a {holiday}, so the banks are closed. | Where did you go on {holiday}?",
      "trip airport",
    ),
    word(
      "airport airports",
      "a place where planes take off and land",
      "机场",
      "We take a taxi to the {airport} to catch our plane. | The plane lands at the {airport} at nine. | The {airport} is far from the city, and planes fly in and out all day.",
      "station bridge",
    ),
    word(
      "bridge bridges",
      "a road that goes over a river or another road",
      "桥",
      "We walk across the {bridge} high above the river. | There are three {bridges} over the river.|roads airports | The old stone {bridge} goes over the railway.",
      "road airport",
    ),
    word(
      "boat boats",
      "a small thing that carries people on water",
      "小船",
      "We crossed the small lake in a little {boat}. | My uncle has a small fishing {boat}. | Can you row a {boat}?",
      "ship taxi",
    ),
    word(
      "ship ships",
      "a big boat that goes across the sea",
      "轮船",
      "The big {ship} carries hundreds of cars across the sea. | Big {ships} come into the port every day.|boats planes | We went to the island by {ship}. It took two days on the sea.",
      "boat plane",
    ),
    word(
      "taxi taxis",
      "a car with a driver that you pay to take you somewhere",
      "出租车",
      "Let's take a {taxi} to the hotel. Just us and the driver. | The {taxi} driver takes us right to our door. | Call a {taxi}, please. It's raining.",
      "bus boat",
    ),
    word(
      "arrive arrives arrived arriving",
      "to get to a place",
      "到达",
      "The train {arrives} at the station at ten, and we get off.|leaves comes | We {arrived} at the hotel late at night.|left came | What time do you {arrive} at school?",
      "leave come",
    ),
    word(
      "leave leaving",
      "to go away from a place",
      "离开；出发",
      "We {leave} for school at half past seven. | Don't {leave} your bag on the bus! | We are {leaving} now. Goodbye!|arriving staying",
      "arrive stay",
    ),
    word(
      "fast faster fastest",
      "moving quickly",
      "快的；快",
      "The train is very {fast}. It goes 300 kilometers an hour. | A cheetah can run very {fast}. | The plane is {faster} than the train. It gets there in one hour, not five.|slower later",
      "slow late",
    ),
    word(
      "slow slower slowest",
      "not fast; taking a long time",
      "慢的",
      "The old bus is very {slow}. We walk faster than it. | Turtles are {slow} animals. | Our old computer is {slower} than the new one. It takes ages to start.|faster later",
      "fast late",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "Size and water are the clues: a *boat* is small, as on a lake, but a *ship* is big and crosses the sea. A *taxi* takes just you and the driver, while a *bus* carries many people.",
        "看大小和水面：*boat* 小，比如湖上的小船；*ship* 大，能横渡大海。*taxi* 只载你和司机，*bus* 载很多人。",
      ),
      meaning: t(
        "You *arrive* when you get to a place and *leave* when you go away from it. A *trip* is a short journey there and back; a *holiday* is time with no school or work.",
        "到了一个地方是 *arrive*，从那里走是 *leave*。*trip* 是来回的短途旅行；*holiday* 是不上学不上班的假期。",
      ),
      spell: t(
        "*Arrive* has a double r, *bridge* has dge at the end, and *leave* becomes *leaving* without its e. *Taxi* becomes *taxis*.",
        "*arrive* 双写 r，*bridge* 结尾是 dge，*leave* 变 *leaving* 时去掉 e。*taxi* 的复数是 *taxis*。",
      ),
    },
    notes: `
      trip|a school one to the zoo;to the zoo and back;two hours to the beach|a trip is a short journey there and back; a holiday is time off school or work|trip 是来回的短途出行；holiday 是假期|holiday=holiday is time with no school, so a school holiday is not a visit to the zoo, and a holiday does not take two hours=holiday 是不上学的日子，*school holiday* 不是去动物园，假期也不是两小时;ship=ship is a big boat, and a school ship, a ship to the zoo and back or a two-hour ship to the beach does not fit=ship 是大船，学校的船、去动物园再回来的船、两小时到海滩的船都不合适|trip|a short i, and p at the end|短元音 i，结尾是 p
      holiday|no school in summer;a day the banks close;going away on holiday|a holiday is time with no school or work; a trip is one journey|holiday 是假期；trip 是一次出行|trip=trip is one journey, so it is not a summer with no school or a day the banks close, and *on trip* needs *a*=trip 是一次出行，不是不上学的夏天或银行关门的日子，*on trip* 也要加 *a*;airport=airport is where planes land, not a time with no school or a day banks close=airport 是飞机降落的地方，不是不上学的时间或银行关门的日子|hol · i · day|*holi* + *day*, with one l|*holi* 加 *day*，只有一个 l
      airport|catching our plane;planes landing;planes in and out|an airport is for planes; a station is for trains and buses|airport 给飞机用；station 给火车和公交车用|station=station is for trains and buses, not where you catch a plane or planes land=station 给火车和公交车用，不在那里坐飞机，飞机也不在那里降落;bridge=bridge goes over a river, and planes do not land on it=bridge 架在河上，飞机不在桥上降落|air · port|*air* + *port*, one word|*air* 加 *port*，一个词
      bridge|high above the river;three over the river;stone over the railway|a bridge goes over a river or a road; a road goes along the ground|bridge 架在河或路上方；road 在地面上|road/roads=road goes along the ground, not high above a river or over the railway=road 在地面上，不高架在河上，也不跨过铁路;airport/airports=airport is where planes land, not something you walk across over a river=airport 是飞机降落的地方，不是过河时走过的东西|bridge|dge at the end|结尾是 dge
      boat|a little one on a small lake;a small fishing one;rowing one|a boat is small; a ship is big|boat 小；ship 大|ship=ship is big and goes across the sea, so it is not little, small or rowed by hand=ship 很大，横渡大海，不是小船，也不能用手划;taxi=taxi is a car, so it does not cross a lake, fish or get rowed=taxi 是汽车，不过湖，不打鱼，也不能划|boat|oa said like *go*|oa 读作 *go*
      ship|hundreds of cars across the sea;big ones in the port;two days on the sea|a ship is a big boat for the sea; a boat is small|ship 是海上的大船；boat 是小船|boat/boats=boat is small, so it does not carry hundreds of cars, and *big boats* or two days at sea do not fit a little boat=boat 是小船，不能载几百辆车，大船和海上两天都不适合小船;plane/planes=plane flies, so it does not come into a port or take two days on the sea=plane 在天上飞，不进港口，也不在海上走两天|ship|sh at the start, and a short i|开头是 sh，短元音 i
      taxi|just us and the driver;right to our door;calling one in the rain|a taxi takes you to your door; a bus carries many people on a set way|taxi 送你到门口；bus 沿固定路线载很多人|bus=bus carries many people on a set way, so it is not just us, it does not stop at our door and you do not call one=bus 沿固定路线载很多人，不是只有我们，不停在我们门口，也不能打电话叫;boat=boat goes on water, so it does not take us to a hotel or our door=boat 在水上走，不会把我们送到旅馆或家门口|tax · i|i at the end, and *taxis*|结尾是 i，复数是 *taxis*
      arrive|at the station to get off;at the hotel at night;at school|you arrive when you get to a place; you leave when you go away|arrive 是到达；leave 是离开|leave/leaves/left=leave means to go away, but here we get off, reach the hotel or get to school, and *leave at school* is not right=leave 是离开，可这里是下车、到旅馆、到学校，*leave at school* 也不对;come/comes/came=come is not used with *at* for getting to a place, so *comes at the station* or *came at the hotel* is not English=come 不和 *at* 连用表示到达，没有 *comes at the station*、*came at the hotel* 的说法|ar · rive|a double r, and a silent e|双写 r，词尾 e 不发音
      leave|for school;a bag on the bus;goodbye now|you leave when you go away; you arrive when you get to a place|leave 是离开；arrive 是到达|arrive/arriving=arrive means to get to a place, but *for school*, a forgotten bag and *Goodbye!* are about going away=arrive 是到达，可 *for school*、落下书包和 *Goodbye!* 都是离开;stay/staying=stay means to not go away, but *for school* and *Goodbye!* mean going, and *stay your bag* is not English=stay 是留下，可 *for school* 和 *Goodbye!* 都是要走，也没有 *stay your bag* 的说法|leave|ea said like *see*, and the e dropped in *leaving*|ea 读作 *see*，*leaving* 去掉 e
      fast|300 kilometers an hour;a running cheetah;one hour not five|fast means moving quickly; slow means taking a long time|fast 是快；slow 是慢|slow/slower=slow means taking a long time, but 300 kilometers an hour, a cheetah and one hour not five are quick=slow 是慢，可每小时 300 公里、猎豹和一小时不是五小时都很快;late/later=late means after the right time, not how quickly something moves=late 是迟，不说移动得多快|fast|a said like *car* in British English, like *cat* in American|英式 a 读作 *car*，美式读作 *cat*
      slow|slower than walking;turtles;ages to start|slow means taking a long time; fast means moving quickly|slow 是慢；fast 是快|fast/faster=fast means quick, but we walk faster than the bus, turtles are not quick and the old computer takes ages=fast 是快，可我们走路都比这辆车快，乌龟不快，旧电脑要很久才启动;late/later=late means after the right time, not how quickly a bus, an animal or a computer moves=late 是迟，不说公交车、动物或电脑的快慢|slow|ow said like *go*|ow 读作 *go*
    `,
  },
});

// Wh- questions.

/** WhItem is a question with a wh- word, the statement it asks about, its answer and a wrong way to ask it. */
type WhItem = {
  readonly ask: string;
  readonly question: string;
  readonly statement: string;
  readonly answer: string;
  readonly wrong: string;
};

const whItems: readonly WhItem[] = [
  "Where|Where does Tom live?|Tom lives near the station.|Near the station.|Where Tom lives?",
  "When|When does the train leave?|The train leaves at nine o'clock.|At nine o'clock.|When the train leaves?",
  "What|What does your dad drive?|My dad drives a taxi.|A taxi.|What your dad drives?",
  "Who|Who is your teacher?|Ms. Wang is my teacher.|Ms. Wang.|Who your teacher is?",
  "Where|Where is the bank?|The bank is next to the hotel.|Next to the hotel.|Where the bank is?",
  "How|How do you go to school?|I go to school by bus.|By bus.|How you go to school?",
  "What time|What time does the museum open?|The museum opens at ten.|At ten.|What time the museum opens?",
  "Why|Why are you tired?|I'm tired because I walked a lot.|Because I walked a lot.|Why you are tired?",
  "Where|Where are my keys?|Your keys are on the table.|On the table.|Where my keys are?",
  "Who|Who drives the bus?|Mr. Li drives the bus.|Mr. Li.|Who does drive the bus?",
  "What|What is your address?|My address is 12 Park Road.|12 Park Road.|What your address is?",
  "How old|How old is your brother?|My brother is seven.|He's seven.|How old your brother is?",
  "How many|How many buses go to the airport?|Three buses go to the airport.|Three.|How many buses do go to the airport?",
  "Where|Where do your grandparents live?|My grandparents live on a farm.|On a farm.|Where your grandparents live?",
  "When|When do you visit your grandma?|I visit my grandma on Sundays.|On Sundays.|When you visit your grandma?",
  "What|What do you want for lunch?|I want noodles for lunch.|Noodles.|What you want for lunch?",
  "Who|Who is that man?|That man is my uncle.|My uncle.|Who that man is?",
  "How|How is your mom?|My mom is fine, thanks.|She's fine, thanks.|How your mom is?",
  "Where|Where is the hotel?|The hotel is on Green Street.|On Green Street.|Where the hotel is?",
  "What time|What time do you have dinner?|I have dinner at half past six.|At half past six.|What time you have dinner?",
  "Why|Why do you like trains?|I like trains because they are fast.|Because they are fast.|Why you like trains?",
  "What|What does Lily do on Saturdays?|Lily plays tennis on Saturdays.|She plays tennis.|What Lily does on Saturdays?",
  "Where|Where does this bus go?|This bus goes to the zoo.|To the zoo.|Where this bus goes?",
  "Who|Who lives in that house?|Mrs. Green lives in that house.|Mrs. Green.|Who does live in that house?",
  "How|How does your mom go to work?|My mom goes to work by train.|By train.|How your mom goes to work?",
  "How much|How much is the ticket?|The ticket is five dollars.|Five dollars.|How much the ticket is?",
  "When|When is your birthday?|My birthday is in May.|In May.|When your birthday is?",
  "What|What is in your bag?|My ticket is in my bag.|My ticket.|What in your bag is?",
  "Where|Where are you from?|I'm from China.|From China.|Where you are from?",
  "How old|How old is this bridge?|This bridge is two hundred years old.|Two hundred years old.|How old this bridge is?",
  "Why|Why is the shop closed?|The shop is closed because it's Sunday.|Because it's Sunday.|Why the shop is closed?",
  "Who|Who is your best friend?|Ben is my best friend.|Ben.|Who your best friend is?",
  "What time|What time does the bank close?|The bank closes at five.|At five.|What time the bank closes?",
  "How many|How many people live in your town?|Ten thousand people live in my town.|Ten thousand.|How many people do live in your town?",
  "Where|Where do you play football?|We play football in the park.|In the park.|Where you play football?",
  "What|What does your sister study?|My sister studies math.|Math.|What your sister studies?",
  "When|When do the shops open?|The shops open at nine.|At nine.|When the shops open?",
].map((line): WhItem => {
  const [ask = "", question = "", statement = "", answer = "", wrong = ""] = line.split("|");
  return { ask, question, statement, answer, wrong };
});

/** whPeople are who the made questions ask about: as the statement names them, and as the question does. */
const whPeople: readonly (readonly [said: string, asked: string])[] = [
  ["Tom", "Tom"],
  ["Lily", "Lily"],
  ["My dad", "your dad"],
  ["My sister", "your sister"],
  ["Ben", "Ben"],
  ["Our teacher", "your teacher"],
  ["Anna", "Anna"],
  ["My brother", "your brother"],
];

/** whFacts are a question word, a verb and its -s form with what follows, and the answers that fit. */
const whFacts: readonly (readonly [ask: string, verb: string, third: string, before: string, answers: readonly string[]])[] = [
  ["Where", "live", "lives", "", ["near the station", "on Green Street", "next to the park", "in a small town", "on a farm"]],
  ["When", "play", "plays", " tennis", ["on Sundays", "after school", "on Saturday mornings", "in the summer"]],
  ["What", "study", "studies", "", ["math", "history", "art", "music", "Chinese"]],
  ["How", "go", "goes", " to school", ["by bus", "by train", "by bike", "on foot"]],
  ["What time", "get", "gets", " up", ["at six", "at seven", "at half past six", "at a quarter past seven"]],
  ["What", "eat", "eats", " for lunch", ["noodles", "rice", "sandwiches", "dumplings"]],
];

/** madeWhItems are every person with every fact, so the bank holds well over a hundred questions. */
const madeWhItems: readonly WhItem[] = everyPair(
  whPeople,
  whFacts.flatMap(([ask, verb, third, after, answers]) => answers.map((answer) => [ask, verb, third, after, answer] as const)),
).map(([[said, asked], [ask, verb, third, after, answer]]): WhItem => {
  // What asks for the object, which comes before the rest; the other words ask for what ends the sentence.
  const statement = ask === "What" ? `${said} ${third} ${answer}${after}.` : `${said} ${third}${after} ${answer}.`;
  return {
    ask,
    question: `${ask} does ${asked} ${verb}${after}?`,
    statement,
    answer: `${answer.charAt(0).toUpperCase()}${answer.slice(1)}.`,
    wrong: `${ask} ${asked} ${third}${after}?`,
  };
});

/** whDecoys are two wrong question words for each right one; When and What time never stand against each other. */
const whDecoys: Readonly<Record<string, readonly [string, string]>> = {
  Where: ["When", "What"],
  When: ["Where", "Who"],
  What: ["Where", "Who"],
  Who: ["What", "Where"],
  How: ["What", "Where"],
  Why: ["What", "Where"],
};

const firstWord = (s: string): string => s.slice(0, s.indexOf(" "));

const whChoiceBank: readonly ChoiceItem[] = interleave([whItems, madeWhItems]).map(({ question, answer }): ChoiceItem => {
  const wh = firstWord(question);
  return [`___${question.slice(wh.length)} — ${answer}`, wh, whDecoys[wh] ?? ["Where", "Who"]];
});

/** whPattern accepts the question with is shortened after the wh- word, and When or What time for a clock time. */
const whPattern = ({ question, answer }: WhItem): string => {
  const timed = answer.startsWith("At ") ? question.replace(/^(When|What time) /u, "[When|What time] ") : question;
  return timed.replace(/^(Where|What|Who|How) is /u, "[$1 is|$1's] ");
};

const whAskBank: readonly TypedItem[] = interleave([[...madeWhItems].reverse(), whItems]).map(
  (item): TypedItem => ({
    shown: item.statement,
    instruction: t(`Ask a question with ${item.ask} about this sentence.`, `用 ${item.ask} 对这个句子提问。`),
    accepted: [whPattern(item)],
    canonical: item.question,
    wrong: [item.wrong, `${item.statement.slice(0, -1)}?`],
  }),
);

/** whKind says what a question word asks about, from the gap and what follows it. */
const whKind = (wh: string, after: string): Text => {
  if (wh === "What" && after.startsWith("time")) return t("a time", "时间");
  if (wh === "How" && after.startsWith("old")) return t("an age", "年龄");
  if (wh === "How" && after.startsWith("many")) return t("a number", "数量");
  if (wh === "How" && after.startsWith("much")) return t("a price", "价钱");
  const kinds: Record<string, Text> = {
    Where: t("a place", "地点"),
    When: t("a time", "时间"),
    What: t("a thing", "事物"),
    Who: t("a person", "人"),
    How: t("the way something is done or how someone is", "方式或状况"),
    Why: t("a reason", "原因"),
  };
  return kinds[wh] ?? t("something", "某事");
};

/** whParts splits a gapped question into the words after the gap and the answer. */
const whParts = (shown: string): readonly [after: string, answer: string] => {
  const [question = "", answer = ""] = shown.split(" — ");
  return [question.replace(/^___ /u, ""), answer];
};

/** whWhy explains the question word that an answer calls for. */
const whWhy = (right: string, shown: string): Text => {
  const [after, answer] = whParts(shown);
  const kind = whKind(right, after);
  const full = shown.replace("___", right);
  const phrase = `${right}${after.startsWith("time") || /^(old|many|much)\b/u.test(after) ? ` ${after.split(" ")[0]}` : ""}`;
  return t(
    `The answer *${answer}* gives ${kind.en}, and *${phrase}* asks about ${kind.en}: ${full}\n\n**Check.** Read the completed question and answer together: *${phrase}* directly matches the information in *${answer}*`,
    `回答 *${answer}* 说的是${kind["zh-CN"]}，而 *${phrase}* 问的正是${kind["zh-CN"]}：${full}\n\n**检验。** 把完整的问句和答句连起来读：*${phrase}* 问的正好对应 *${answer}* 给出的信息。`,
  );
};

/** whyNotWh explains a question word that asks about the wrong kind of thing. */
const whyNotWh = (wrong: string, right: string, shown: string): Text => {
  const [after, answer] = whParts(shown);
  const kind = whKind(right, after);
  const wrongKind = whKind(wrong, "");
  return t(
    `*${wrong}* asks about ${wrongKind.en}, but the answer *${answer}* gives ${kind.en}.`,
    `*${wrong}* 问的是${wrongKind["zh-CN"]}，但回答 *${answer}* 说的是${kind["zh-CN"]}。`,
  );
};

/** whAskWhy explains the order of a wh- question. */
const whAskWhy = (right: string, shown: string): Text => {
  const item = whItems.find((it) => it.question === right);
  const ask = item?.ask ?? firstWord(right);
  const next = right.slice(ask.length + 1).split(" ")[0] ?? "";
  return /^(do|does|is|are)$/u.test(next)
    ? t(
        `*${shown}* gives the answer, so put *${ask}* first, then *${next}* before the subject, as in a yes/no question: ${right}\n\n**Check.** Confirm the order at the front (*${ask}* + *${next}* + subject) and make sure the answer piece from the statement is no longer in the question.`,
        `*${shown}* 里有答案，所以把 *${ask}* 放在句首，再像一般疑问句那样把 *${next}* 放在主语前：${right}\n\n**检验。** 核对句首语序（*${ask}* + *${next}* + 主语），并确认陈述句里表示答案的那部分已经从问句里去掉。`,
      )
    : t(
        `Here *${ask}* asks about the subject itself, so the verb comes straight after it with no *do*: ${right}\n\n**Check.** Replace *${ask}* with the subject from the statement—if the original sentence reappears, the verb is in the right place without *do*.`,
        `这里 *${ask}* 问的就是主语，所以动词直接跟在后面，不用 *do*：${right}\n\n**检验。** 把陈述句的主语代回 *${ask}* 的位置——如果能还原成原句，就说明动词位置正确，不需要加 *do*。`,
      );
};

const whQuestions: TopicDef = {
  id: "wh-questions",
  title: t("Wh- Questions", "特殊疑问句"),
  summary: t(
    "Where does Tom live? When is your birthday? Questions with where, when, what, who, how and why.",
    "Where does Tom live? When is your birthday? 用 where、when、what、who、how 和 why 提问。",
  ),
  intro: t(
    "A yes/no question only asks *if* something is true (*Does the train leave at nine?*). A *wh-* question asks for the missing fact itself (*When does the train leave?*), putting the question word at the very front.",
    "一般疑问句只问“是不是”（*Does the train leave at nine?*），而特殊疑问句直接问缺少的信息（*When does the train leave?*），并把疑问词放在句首。",
  ),
  prerequisites: ["present-simple-questions", "questions-with-be"],
  encompasses: [
    { topic: "present-simple-questions", weight: 0.4 },
    { topic: "questions-with-be", weight: 0.4 },
  ],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Which question word", "选哪个疑问词"),
      t(
        "Each question word asks about one thing:\n\n- *where*: a place (*In Beijing.*)\n- *when*, *what time*: a time (*At nine. On Sunday.*)\n- *what*: a thing (*A taxi.*)\n- *who*: a person (*Ms. Wang.*)\n- *how*: the way (*By bus.*); *how old*, *how many*, *how much*\n- *why*: the reason (*Because …*)\n\nLook at the answer to choose the word.\n\n> **Watch out.** Check the word right after the blank—*___ old* takes *How*, *___ time* takes *What*, and *___ many* takes *How*.",
        "每个疑问词问一类东西：\n\n- *where*：地点（*In Beijing.*）\n- *when*、*what time*：时间（*At nine. On Sunday.*）\n- *what*：事物（*A taxi.*）\n- *who*：人（*Ms. Wang.*）\n- *how*：方式（*By bus.*）；还有 *how old*、*how many*、*how much*\n- *why*：原因（*Because …*）\n\n看回答来选疑问词。\n\n> **注意。** 留意空白后面紧跟的词——*___ old* 用 *How*，*___ time* 用 *What*，*___ many* 用 *How*。",
      ),
      choiceGenerator(t("Choose the question word for the answer.", "根据回答选择疑问词。"), whChoiceBank, whWhy, whyNotWh),
    ),
    point(
      "ask",
      t("Making wh- questions", "构成特殊疑问句"),
      t(
        "Put the question word first, then the question order you already know: *Does Tom live near the station?* → *Where does Tom live?* *Is the bank next to the hotel?* → *Where is the bank?*\n\nWhen *who* or *how many people* is the subject itself, there is no *do*: *Who drives the bus?*\n\n> **Watch out.** Do not keep statement order after a question word (*Where Tom lives?* is wrong; say *Where does Tom live?*), and drop the *-s* from the main verb after *does*.",
        "先写疑问词，再接一般疑问句的语序：*Does Tom live near the station?* → *Where does Tom live?* *Is the bank next to the hotel?* → *Where is the bank?*\n\n如果 *who* 或 *how many people* 本身就是主语，就不用 *do*：*Who drives the bus?*\n\n> **注意。** 中文把疑问词留在原位（“汤姆住在哪里？”），英语要把疑问词放句首并倒装（不能写 *Where Tom lives?*，要写 *Where does Tom live?*），且 *does* 后面的实义动词要还原。",
      ),
      typedGenerator("sentence-pattern", t("Write the question.", "写出问句。"), whAskBank, whAskWhy, whQuestionsAskNot),
    ),
  ],
};

// Can for requests.

/** youAsks are things to ask someone to do, after Can you. */
const youAsks: readonly string[] = [
  "show me the way to the station",
  "tell me the time",
  "help me carry this bag",
  "open the door",
  "close the window",
  "wait for me",
  "call a taxi",
  "take a photo of us",
  "draw me a map",
  "say that again",
  "speak more slowly",
  "stop here",
  "buy two tickets",
  "pass me the salt",
  "fix my bike",
  "lend me your pen",
  "meet me at the bus station",
  "keep my seat",
  "turn on the light",
  "spell your name",
  "give me a map",
  "read this sign for me",
  "help me find the museum",
  "take me to the airport",
  "turn left at the corner",
  "carry my bag",
  "turn off the TV",
  "write your address here",
  "drive more slowly",
  "show me your ticket",
  "come to my party",
  "help me with my homework",
  "wait at the corner",
  "show me the bridge on the map",
  "cross the road with me",
  "tell me about the museum",
];

/** iAsks are things to ask to do yourself, after Can I. */
const iAsks: readonly string[] = [
  "sit here",
  "have a map",
  "open the window",
  "use your phone",
  "go to the toilet",
  "buy a ticket",
  "ask a question",
  "come in",
  "take a photo",
  "pay by card",
  "borrow your pen",
  "have a glass of water",
  "leave my bag here",
  "park my bike here",
  "see the menu",
  "watch TV now",
  "try this on",
  "have the bill",
  "close the door",
  "turn on the TV",
  "sit next to you",
  "carry your bag",
  "go out to play",
  "visit you on Sunday",
];

/** pleased are a request without and with please at the end. */
const pleased = ["", ", please"] as const;

const requestChoiceBank: readonly ChoiceItem[] = interleave([
  everyPair(youAsks, pleased).map(
    ([ask, please]): ChoiceItem => ["", `Can you ${ask}${please}?`, [`Can you to ${ask}${please}?`, `You can ${ask}${please}?`]],
  ),
  everyPair(iAsks, pleased).map(
    ([ask, please]): ChoiceItem => ["", `Can I ${ask}${please}?`, [`Can I to ${ask}${please}?`, `I can ${ask}${please}?`]],
  ),
]);

/** wanted are two ways a learner says what they want to do, which the request turns into Can I. */
const wanted = ["I want to", "I'd like to"] as const;

const requestTypedBank: readonly TypedItem[] = interleave([
  everyPair(youAsks, ["", "Please "] as const).map(
    ([ask, please]): TypedItem => ({
      shown: please === "" ? `${ask.charAt(0).toUpperCase()}${ask.slice(1)}.` : `${please}${ask}.`,
      instruction: t("Ask politely with Can you.", "用 Can you 礼貌地请求。"),
      accepted: [`Can you ${ask}(, please)?`, `Please, can you ${ask}?`],
      canonical: `Can you ${ask}, please?`,
      wrong: [`Can you to ${ask}?`, `You can ${ask}?`],
    }),
  ),
  everyPair(iAsks, wanted).map(
    ([ask, want]): TypedItem => ({
      shown: `${want} ${ask}.`,
      instruction: t("Ask politely with Can I.", "用 Can I 礼貌地请求。"),
      accepted: [`Can I ${ask}(, please)?`],
      canonical: `Can I ${ask}, please?`,
      wrong: [`Can I to ${ask}?`, `I can ${ask}?`],
    }),
  ),
]);

/** requestWhy explains how a request with can is built. */
const requestWhy = (right: string): Text =>
  right.startsWith("Can I")
    ? t(
        `To ask if you may do something, put *Can* first, then *I* and the plain verb, with no *to*: ${right}\n\n**Check.** Verify the pattern: *Can* + *I* + plain verb (no *to*), ending with a question mark.`,
        `请求允许自己做事时，*Can* 放在句首，再接 *I* 和动词原形，不加 *to*：${right}\n\n**检验。** 核对结构：*Can* + *I* + 动词原形（不加 *to*），句末用问号。`,
      )
    : t(
        `To ask someone to do something, put *Can* first, then *you* and the plain verb, with no *to*: ${right}\n\n**Check.** Verify the pattern: *Can* + *you* + plain verb (no *to*), ending with a question mark.`,
        `请别人做事时，*Can* 放在句首，再接 *you* 和动词原形，不加 *to*：${right}\n\n**检验。** 核对结构：*Can* + *you* + 动词原形（不加 *to*），句末用问号。`,
      );

/** whyNotRequest explains a wrong request with can. */
const whyNotRequest = (wrong: string, right: string, _shown: string, position: number): Text => {
  const who = right.startsWith("Can I") ? "I" : "you";
  return position === 0
    ? t(
        `*${wrong}* puts *to* after *can*, but *can* is followed straight away by the plain verb.`,
        `*${wrong}* 在 *can* 后面加了 *to*，但 *can* 后面直接跟动词原形。`,
      )
    : t(
        `*${wrong}* keeps the order of a statement. A question puts *Can* before *${who}*.`,
        `*${wrong}* 保留了陈述句的语序。问句要把 *Can* 放在 *${who}* 前面。`,
      );
};

const canForRequests: TopicDef = {
  id: "can-for-requests",
  title: t("Can You Help Me?", "Can you help me? 用 can 提出请求"),
  summary: t(
    "Can you open the door? Can I sit here? Asking people to do things, and asking to do them yourself.",
    "Can you open the door? Can I sit here? 请别人做事，以及请求允许自己做事。",
  ),
  intro: t(
    "You already know *can* for ability (*I can swim*). In everyday talk, *Can you pass the map?* and *Can I borrow a pen?* use the same verb to make polite requests.",
    "你已经学过用 *can* 表示能力（*I can swim*）。日常交流里，*Can you pass the map?* 和 *Can I borrow a pen?* 用同一个词提出礼貌的请求。",
  ),
  prerequisites: ["can-for-ability", "a1-words-directions"],
  encompasses: [
    { topic: "can-for-ability", weight: 0.4 },
    { topic: "a1-words-directions", weight: 0.2 },
  ],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Can you, can I", "Can you 和 Can I"),
      t(
        "To ask someone to do something, say *Can you …?*: *Can you open the door?* To ask if you may do something, say *Can I …?*: *Can I sit here?*\n\n*Can* comes first, and the verb after it has no *to* and no *-s*.\n\n> **Watch out.** Never put *to* after *can* (*Can you to help me?* is wrong) and do not keep statement order (*You can help me?*).",
        "请别人做事，说 *Can you …?*：*Can you open the door?* 请求允许自己做事，说 *Can I …?*：*Can I sit here?*\n\n*Can* 放在句首，后面的动词不加 *to*，也不加 *-s*。\n\n> **注意。** 千万不要在 *can* 后面加 *to*（*Can you to help me?* 是错的），也不要保留陈述句语序（*You can help me?*）。",
      ),
      choiceGenerator(t("Which request is right?", "哪个请求是对的？"), requestChoiceBank, requestWhy, whyNotRequest),
    ),
    point(
      "ask",
      t("Asking politely", "礼貌地请求"),
      t(
        "An order like *Open the door.* can sound rude. Make it a question with *Can you …?* and add *please*: *Can you open the door, please?* For yourself, *I want to sit here.* becomes *Can I sit here, please?*\n\n> **Watch out.** Drop *I want to* or *I'd like to* completely before writing *Can I …?*, and end with a question mark instead of a period.",
        "*Open the door.* 这样的祈使句听起来可能不礼貌。把它改成 *Can you …?* 的问句，再加上 *please*：*Can you open the door, please?* 为自己请求时，*I want to sit here.* 变成 *Can I sit here, please?*\n\n> **注意。** 改写成 *Can I …?* 时要把 *I want to* 或 *I'd like to* 全部去掉，句末用问号而不是句号。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Make it a polite request.", "改成礼貌的请求。"),
        requestTypedBank,
        (right) => {
          const why = requestWhy(right);
          return t(`Add *please* to sound polite. ${why.en}`, `加上 *please* 更礼貌。${why["zh-CN"]}`);
        },
        canForRequestsAskNot,
      ),
    ),
  ],
};

// Writing directions to your home.

const criterion = (id: string): CriterionSpec => {
  const found = criterionById(id);
  if (!found) throw new Error(`unknown criterion ${id}`);
  return found;
};

/** directionsBank asks for directions to the writer's home from a named place. */
const directionsBank: readonly WritingItem[] = [
  {
    task: "Your friend Tom is coming to your house. Write him directions from the bus station.",
    model:
      "Hi Tom,\nGet off the bus at the bus station. Turn left and walk along Park Road. Go past the bank and turn right at the corner. My house is the blue one next to the park.\nSee you soon, Lily",
  },
  {
    task: "Your cousin is coming to visit by train. Write directions from the train station to your home.",
    model:
      "Dear Sam,\nWhen you leave the train station, cross the road. Go straight on for two minutes. Turn right at the hotel. My building is on the left, opposite the museum. I live on the third floor, number 302.\nBen",
  },
  {
    task: "Write directions from your school to your home for a new classmate.",
    model:
      "Hi Mia,\nGo out of the school gate and turn right. Walk to the end of the street. Cross the bridge over the river. My house is the first house on the left. It has a red door.\nAnna",
  },
  {
    task: "Your grandma is coming by taxi, but the driver doesn't know the way. Write directions from the big supermarket.",
    model:
      "Dear Grandma,\nFrom the supermarket, go straight along Green Street. Turn left at the second corner. Go past the school and the park. Our building is next to the restaurant. Ring number 5.\nLove, Jack",
  },
  {
    task: "A friend wants to come to your birthday party. Write directions from the park.",
    model:
      "Hi Emma,\nCome out of the park by the north gate. Turn right and walk to the traffic lights. Cross the road and turn left. My house is the white one with a big tree in front.\nSee you on Saturday, Kate",
  },
  {
    task: "Your friend's dad is driving your friend to your house. Write directions from the hospital.",
    model:
      "Dear Mr. Lee,\nFrom the hospital, drive straight on to the bank. Turn right at the bank and go over the bridge. Take the first road on the left. Our house is at the end of the road. It's yellow.\nThank you, Nora",
  },
  {
    task: "Your teacher is visiting your family. Write directions from the school bus stop.",
    model:
      "Dear Ms. Green,\nGet off at the bus stop near the post office. Walk past the post office and turn left. Go straight on for five minutes. Our flat is above the bakery. The door is green.\nFrom Max",
  },
  {
    task: "A friend is coming to play. Write directions from the library.",
    model:
      "Hi Leo,\nGo out of the library and turn left. Walk past the museum and the café. At the corner, turn right into Hill Street. I live at number 8. There is a bike outside.\nSam",
  },
  {
    task: "Your aunt is coming from the airport by bus. Write directions from the last bus stop.",
    model:
      "Dear Aunt Mary,\nThe bus stops outside the hotel. Walk along the river to the bridge. Don't cross it. Turn left and go up the hill. Our house is the last one on the right, with a small garden.\nLove, Lucy",
  },
  {
    task: "A new neighbor asks how to get to your home from the market. Write the directions.",
    model:
      "Hello Mrs. Wu,\nFrom the market, walk to the traffic lights and turn right. Go past the bank and the restaurant. My building is on the corner, next to the bus stop. We live on the second floor.\nAmy",
  },
  {
    task: "Your friend is coming to study with you. Write directions from the subway station.",
    model:
      "Hi Jun,\nCome out of the subway station at Exit B. Turn left and walk straight on. Turn right at the second street. My building is opposite the park. It's building 6, and I live on the fifth floor.\nBen",
  },
  {
    task: "Your pen friend is visiting your town for the first time. Write directions from the town square.",
    model:
      "Dear Paul,\nStart at the big clock in the town square. Walk down Station Road towards the river. Turn left after the museum. Our house is the third on the right. It has a green gate.\nSee you soon, Mia",
  },
];

const directionsCriteria = ["a1-directions-start", "a1-directions-steps", "a1-directions-arrive", "a1-reader-and-name"];

const writingDirectionsToYourHome: TopicDef = {
  id: "writing-directions-to-your-home",
  title: t("Writing Directions to Your Home", "写去你家的路线"),
  summary: t(
    "Write a note that tells a visitor how to get to your home: where to start, the steps in order and how to know they've arrived.",
    "写一张便条告诉来访者怎么到你家：从哪里出发、按顺序走哪些路、怎样知道到了。",
  ),
  intro: t(
    "Good directions guide a visitor step by step from a landmark they know right to your door: *Start at the station. Walk straight to the bridge and turn left. My building is opposite the bakery.* Clear verbs and landmarks keep the reader from getting lost.",
    "好的路线指引能把客人从熟悉的地标一步步带到家门口：*Start at the station. Walk straight to the bridge and turn left. My building is opposite the bakery.* 清晰的动词加上地标，对方才不会迷路。",
  ),
  prerequisites: ["imperatives", "prepositions-of-place", "a1-words-directions", "writing-a-short-note"],
  encompasses: [
    { topic: "imperatives", weight: 0.3 },
    { topic: "prepositions-of-place", weight: 0.2 },
    { topic: "writing-a-short-note", weight: 0.2 },
  ],
  xp: 25,
  strand: "writing",
  criteria: directionsCriteria.map(criterion),
  knowledgePoints: [
    point(
      "directions",
      t("Start, steps and arriving", "出发点、步骤和到达"),
      t(
        "Directions are orders, so they start with the verb: *Turn left. Go past the bank. Cross the road.*\n\n- Start from the place the reader knows: *Get off the bus at the station.*\n- Give the steps in order, with turns and things to look for: *Turn right at the corner. Go past the park.*\n- Say how they will know your home: *My house is the blue one next to the park.*\n\n> **Watch out.** Put the steps in the real order the visitor walks them, and do not forget a greeting at the start and your name at the end.",
        "指路用祈使句，句子以动词开头：*Turn left. Go past the bank. Cross the road.*\n\n- 从对方知道的地方说起：*Get off the bus at the station.*\n- 按顺序说步骤，写清在哪里转弯、会经过什么：*Turn right at the corner. Go past the park.*\n- 说明怎样认出你家：*My house is the blue one next to the park.*\n\n> **注意。** 按来访者实际行走的先后顺序写步骤，也别忘了开头写称呼、结尾写署名。",
      ),
      writingGenerator(
        t(
          "Write directions in English to your home, from the place in the task, as a short note of four to six sentences.",
          "用英语写一张四到六句话的便条，告诉对方怎样从题目里的地方到你家。",
        ),
        directionsBank,
        directionsCriteria,
        { minWords: 25, maxChars: 700 },
        (model) =>
          t(
            `One good note:\n\n> ${model.replace(/\n/gu, "\n> ")}\n\n**Check.** Trace the route from start to finish: confirm your note has a greeting, names the starting place, gives clear steps in order, tells how to spot your home, and ends with your name.`,
            `一张好的便条：\n\n> ${model.replace(/\n/gu, "\n> ")}\n\n**检验。** 从头到尾顺一遍路线：确认便条有称呼、写明了出发点、按顺序给出了清晰的步骤、说明了怎么认出你家，并在结尾署了名。`,
          ),
      ),
    ),
  ],
};

/** topics are the topics of the unit In Town. */
export const topics: readonly TopicDef[] = [
  town.topic,
  directions.topic,
  trips.topic,
  whQuestions,
  canForRequests,
  writingDirectionsToYourHome,
];

/** vocabulary are the words the unit In Town teaches. */
export const vocabulary: readonly WordBatch[] = [town.batch, directions.batch, trips.batch];
