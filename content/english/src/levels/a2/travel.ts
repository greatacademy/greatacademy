// A2, unit 7: Travel and Holidays. Holidays, places to visit, transport and the future; going to and will; plans
// judged by a model.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, interleave, sentenceCase, vocabularyTopic, word } from "../words.ts";
import { combos, fill, judgedTopic } from "./kit.ts";
import { beGoingToQuestionNot, beGoingToWriteNot, willForTheFutureWriteNot } from "./mistakes.ts";

const holidays = vocabularyTopic({
  id: "a2-words-holidays",
  title: t("Holidays", "假期"),
  summary: t(
    "Vacations, tourists and guides; packing a suitcase; passports and going abroad; journeys, flights, luggage, souvenirs and postcards.",
    "假期、游客和导游；收拾行李箱；护照和出国；旅程、航班、行李、纪念品和明信片。",
  ),
  intro: t(
    "Before our **vacation** abroad, I **packed** my **suitcase**, found my **passport** and checked the time of our **flight**. These words help you plan a trip, travel and remember it.",
    "出国 **vacation**（度假）前，我 **packed**（收拾）好 **suitcase**（行李箱），找到 **passport**（护照），又查了 **flight**（航班）的时间。这些词帮你计划旅行、出行，以及留下旅行的回忆。",
  ),
  prerequisites: ["a1-words-trips"],
  words: [
    word(
      "vacation vacations",
      "time away from work or school, often spent traveling",
      "假期",
      "We're going on {vacation} to the beach in July. | How was your {vacation}? — Great! We had two weeks off school on a beach in Thailand. | Dad has two weeks of {vacation} a year.",
      "journey flight",
    ),
    word(
      "tourist tourists",
      "a person who visits a place on vacation",
      "游客",
      "The city is full of {tourists} on vacation in summer.|guides passengers | Many {tourists} on vacation take photos of the Great Wall.|guides passengers | Excuse me, I'm a {tourist} here on vacation. Where is the museum?",
      "guide passenger",
    ),
    word(
      "guide guides",
      "a person who shows visitors around a place",
      "导游",
      "Our {guide} told us the history of the palace. | Follow the {guide}. She has a red flag. | My aunt works as a tour {guide} in Xi'an.",
      "tourist passenger",
    ),
    word(
      "pack packs packed packing",
      "to put things in a bag or a suitcase for a trip",
      "收拾（行李）",
      "Have you {packed} your suitcase yet?|flown traveled | Don't forget to {pack} your toothbrush! | I'm {packing} my bag for the trip. We leave at six.|flying traveling",
      "fly travel",
    ),
    word(
      "suitcase suitcases",
      "a large box-shaped bag with a handle for carrying clothes on a trip",
      "行李箱",
      "My {suitcase} is too heavy to lift. | Put your clothes in the {suitcase}. | Our {suitcases} have wheels.|passports souvenirs",
      "passport souvenir",
    ),
    word(
      "passport passports",
      "a small book that shows who you are when you travel to another country",
      "护照",
      "You need a {passport} to show who you are when you travel abroad. | Can I see your {passport}, please? I need to check who you are. | My {passport} photo looks terrible!",
      "ticket suitcase",
    ),
    word(
      "abroad",
      "in or to another country",
      "在国外；到国外",
      "Have you ever been {abroad}, to a country that is not your own? | My brother is studying {abroad} in Canada. | We usually go {abroad} to another country for our summer vacation.",
      "home outside",
    ),
    word(
      "journey journeys",
      "a trip from one place to another, especially a long one",
      "旅程",
      "The {journey} from Beijing to Shanghai takes about five hours by train. | Have a good {journey} on the bus to Grandma's town! | It was a long {journey} by car and train, and we were very tired.",
      "flight vacation",
    ),
    word(
      "flight flights",
      "a trip on a plane",
      "航班；飞行",
      "Our {flight} to Beijing takes off from the airport at 9 a.m. | The {flight} to London takes eleven hours in the air. | In August, no airline has cheap {flights} to Paris.|journeys vacations",
      "journey vacation",
    ),
    word(
      "luggage",
      "the bags and suitcases you take on a trip",
      "行李",
      "How much {luggage} do you have? — Just one suitcase. | Please don't leave your {luggage}, your bags and suitcases, on the seat. | Our {luggage}, three big bags, got lost at the airport.",
      "passport souvenir",
      "suitcase",
    ),
    word(
      "souvenir souvenirs",
      "something you buy to remember a place you visited",
      "纪念品",
      "I bought a little panda as a {souvenir} of Chengdu. | The shop near the temple sells {souvenirs}, like little statues and key rings, to remember it by.|postcards passports | This key ring is a {souvenir} from Paris.",
      "postcard passport",
    ),
    word(
      "postcard postcards",
      "a card with a picture on one side that you send without an envelope",
      "明信片",
      "Send me a {postcard} with a picture of Rome on it! | The {postcard} I sent has a picture of the Eiffel Tower on one side. | I wrote three {postcards} with pictures on the front and sent them with no envelope.|letters souvenirs",
      "letter souvenir",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Luggage* has no plural: say *a lot of luggage* or *one piece of luggage*, never *luggages*. A *suitcase* is one of the bags, so you can count *two suitcases*.",
        "*luggage* 没有复数：说 *a lot of luggage* 或 *one piece of luggage*，不能说 *luggages*。*suitcase* 是其中一个箱子，所以可以数：*two suitcases*。",
      ),
      meaning: t(
        "A *journey* is the trip from one place to another, a *flight* is that trip on a plane, and a *vacation* is the time away from work or school, wherever you go.",
        "*journey* 是从一个地方到另一个地方的旅程，*flight* 是坐飞机的那段行程，*vacation* 是不上班不上学的假期，不管去哪儿。",
      ),
      spell: t(
        "*Souvenir* comes from French: sou · ve · nir, with ou said like *oo*. *Passport* is pass + port, with a double s.",
        "*souvenir* 来自法语：sou · ve · nir，ou 读作 *oo*。*passport* 是 pass + port，双写 s。",
      ),
    },
    notes: `
      vacation|going to the beach in July;two weeks off school in Thailand;Dad's two weeks a year|a vacation is time away from work or school; a journey is the trip itself|vacation 是不上班不上学的假期；journey 是路上的旅程|journey=journey is the trip from one place to another, not time off work or school, and it needs *a* or *the*=journey 是从一地到另一地的旅程，不是假期，而且前面要加 *a* 或 *the*;flight=flight is a trip on a plane, not time off work or school=flight 是坐飞机的行程，不是假期|va · ca · tion|-tion at the end; British English says *holiday*|结尾是 -tion；英式英语说 *holiday*
      tourist|a city full of visitors in summer;photos of the Great Wall;someone asking the way to a museum|a tourist visits a place on vacation; a guide shows visitors around|tourist 是来度假游览的人；guide 是带游客参观的人|guide/guides=guide shows visitors around and knows the place, not a visitor on vacation=guide 带游客参观、熟悉当地，不是来度假的游客;passenger/passengers=passenger travels in a car, a bus, a train or a plane, not a visitor seeing a city=passenger 是乘车或乘飞机的人，不是游览城市的游客|tour · ist|tour + -ist|tour 加 -ist
      guide|the history of a palace;someone with a red flag to follow;a tour job in Xi'an|a guide shows visitors around; a tourist is a visitor|guide 带游客参观；tourist 是游客|tourist=tourist is a visitor who does not know the place, not the person who shows people around=tourist 是不熟悉当地的游客，不是带人参观的人;passenger=passenger travels in a car, a bus, a train or a plane, not someone who shows visitors around=passenger 是乘客，不是带游客参观的人|guide|u after g, and i that says its name|g 后面有 u，i 读字母本音
      pack|a suitcase;a toothbrush not to forget;a bag for a trip at six|pack means putting things in a bag for a trip; travel means going from place to place|pack 是收拾行李；travel 是出行|fly/flown/flying=fly means going by plane, not putting things in a bag=fly 是坐飞机，不是把东西装进包里;travel/traveled/traveling=travel means going from place to place, not putting things in a bag=travel 是出行，不是把东西装进包里|pack|ck at the end|结尾是 ck
      suitcase|something too heavy to lift;a place to put clothes;things with wheels|a suitcase is a big bag for clothes; a passport is a small book|suitcase 是装衣服的大箱子；passport 是小本子|passport/passports=passport is a small book that shows who you are, too small for clothes and with no wheels=passport 是证明身份的小本子，装不下衣服，也没有轮子;souvenir/souvenirs=souvenir is something small to remember a place, not a big bag for clothes=souvenir 是用来纪念某地的小东西，不是装衣服的大箱子|suit · case|suit + case, one word, with ui said like *oo*|suit + case 合成一个词，ui 读作 *oo*
      passport|showing who you are abroad;someone checking who you are;a terrible photo|a passport shows who you are when you travel; a ticket lets you get on a plane or a train|passport 证明你的身份；ticket 让你上飞机或火车|ticket=ticket lets you get on a plane, a train or into a show, not a small book that shows who you are=ticket 是乘车、乘飞机或入场的票，不是证明身份的小本子;suitcase=suitcase is a big bag for clothes, not something that shows who you are=suitcase 是装衣服的大箱子，不能证明你是谁|pass · port|pass + port, with a double s|pass + port，双写 s
      abroad|a country that is not your own;studying in Canada;a summer vacation in another country|abroad means in or to another country; home is where you live|abroad 是在国外或到国外；home 是你住的地方|home=home is where you live, the opposite of another country=home 是你住的地方，和国外正相反;outside=outside means out of a building, not in another country=outside 是在户外，不是在国外|a · broad|oa said like *or*|oa 读作 *or*
      journey|five hours by train from Beijing to Shanghai;a bus to Grandma's town;a long trip by car and train|a journey is a trip from one place to another; a flight is a trip on a plane|journey 是从一地到另一地的旅程；flight 是坐飞机的行程|flight=flight is a trip on a plane, not a trip by train, bus or car=flight 是坐飞机的行程，不是坐火车、汽车或开车;vacation=vacation is time away from work or school, not the trip from one place to another=vacation 是假期，不是从一地到另一地的旅程|jour · ney|our said like *er*, and -ey at the end|our 读作 *er*，结尾是 -ey
      flight|a plane taking off at 9 a.m.;eleven hours in the air to London;airlines with no cheap ones in August|a flight is a trip on a plane; a journey can be by any way|flight 是坐飞机的行程；journey 可以是任何方式的旅程|journey/journeys=journey is any trip from place to place, not one that takes off from an airport or that airlines sell=journey 是任何方式的旅程，不是从机场起飞、由航空公司出售的航班;vacation/vacations=vacation is time away from work or school, not a trip on a plane=vacation 是假期，不是坐飞机的行程|flight|igh said like *eye*, with a silent gh|igh 读作 *eye*，gh 不发音
      luggage|how much someone has, just one suitcase;bags and suitcases on a seat;three big bags lost at an airport|luggage is all the bags you take; a passport is a small book|luggage 是你带的所有行李；passport 是小本子|passport=passport is a small book that shows who you are, not bags and suitcases=passport 是证明身份的小本子，不是包和箱子;souvenir=souvenir is a small thing to remember a place, not the bags and suitcases you travel with=souvenir 是纪念某地的小东西，不是旅行带的包和箱子|lug · gage|the double g, and no plural|双写 g，没有复数
      souvenir|a little panda from Chengdu;little statues and key rings near a temple;a key ring from Paris|a souvenir is something to remember a place; a postcard is a card you send|souvenir 是纪念某地的东西；postcard 是寄出的卡片|postcard/postcards=postcard is a card with a picture that you send, not a panda, a statue or a key ring=postcard 是寄出的图片卡，不是熊猫、雕像或钥匙扣;passport/passports=passport is a small book that shows who you are, not something you buy to remember a place=passport 是证明身份的小本子，不是买来纪念某地的东西|sou · ve · nir|ou said like *oo*, and -nir at the end|ou 读作 *oo*，结尾是 -nir
      postcard|a picture of Rome to send;a picture of the Eiffel Tower on one side;pictures on the front and no envelope|a postcard has a picture and needs no envelope; a letter goes in an envelope|postcard 一面有图，不用信封；letter 装在信封里|letter/letters=letter is a written message you put in an envelope, with no picture on one side=letter 是装在信封里的信，一面没有图片;souvenir/souvenirs=souvenir is something you buy to keep, not a card you write and send=souvenir 是买来留作纪念的，不是写好寄出的卡片|post · card|post + card, one word|post + card，合成一个词
    `,
  },
});

const placesToVisit = vocabularyTopic({
  id: "a2-words-places-to-visit",
  title: t("Places to Visit", "游览的地方"),
  summary: t(
    "Castles, palaces, towers, temples and statues; views; coasts, deserts, valleys, caves and oceans.",
    "城堡、宫殿、塔、寺庙和雕像；风景；海岸、沙漠、山谷、山洞和海洋。",
  ),
  intro: t(
    "On our trip, we visited an old **castle** on the **coast**, climbed a **tower** for the **view** of the **ocean**, and walked through a dark **cave**. These words help you talk about famous places and beautiful nature you can visit.",
    "旅行时，我们参观了 **coast**（海边）的一座古老 **castle**（城堡），爬上 **tower**（塔）看 **ocean**（大海）的 **view**（景色），还穿过了一个黑黑的 **cave**（山洞）。这些词帮你谈论可以去参观的名胜和美丽的自然风光。",
  ),
  prerequisites: ["a2-words-holidays"],
  words: [
    word(
      "castle castles",
      "a big old building with thick walls and towers, built to keep people safe",
      "城堡",
      "The king and queen lived in a {castle} with thick walls and towers to keep them safe. | There are many old {castles} with thick walls in Scotland. | We walked around the thick stone walls of the {castle}.",
      "palace tower",
    ),
    word(
      "palace palaces",
      "a very big, beautiful house where a king or queen lives",
      "宫殿",
      "The Forbidden City was the {palace} of the emperors. | The queen lives in Buckingham {Palace}.|Castle Temple | The {palace}, where the king lives, has more than nine hundred beautiful rooms.",
      "castle temple",
    ),
    word(
      "tower towers",
      "a tall narrow building or part of a building",
      "塔",
      "We climbed to the top of the {tower} and looked down at the city. | The Eiffel {Tower} is in Paris.|Statue Palace | The clock {tower} is the tallest building in our town.",
      "statue palace",
    ),
    word(
      "temple temples",
      "a building where people pray to a god",
      "寺庙",
      "We visited an old Buddhist {temple} in the mountains. | Take off your shoes before you go into the Buddhist {temple} to pray. | There are many beautiful Buddhist {temples} in Kyoto.|churches palaces",
      "church palace",
    ),
    word(
      "statue statues",
      "a figure of a person or an animal made of stone or metal",
      "雕像",
      "There is a stone {statue} of a famous poet in the square. | The {Statue} of Liberty is in New York.|Tower Photo | The stone {statues} in the museum are two thousand years old.|towers photos",
      "tower photo",
    ),
    word(
      "view views",
      "what you can see from a place",
      "风景；景色",
      "The {view} from the top of the mountain is amazing. | Our hotel room has a {view} of the sea. | Let's stop here and enjoy the {view} of the hills below.",
      "statue temple",
    ),
    word(
      "coast coasts",
      "the land next to the sea",
      "海岸",
      "We drove along the {coast} and stopped at every beach. | Many big cities are on the {coast}, next to the sea. | There's a lighthouse on the west {coast} of the island.",
      "desert valley",
    ),
    word(
      "desert deserts",
      "a large dry area with lots of sand and very little rain",
      "沙漠",
      "It almost never rains in the {desert}. | Camels can walk across the {desert} for days without water. | The Sahara is the biggest hot {desert} in the world.",
      "dessert coast",
    ),
    word(
      "valley valleys",
      "the low land between two hills or mountains",
      "山谷",
      "A river runs through the {valley} between the two hills. | From the hill we could see the green {valley} below. | The village is in a deep {valley} between the mountains.",
      "cave coast",
    ),
    word(
      "cave caves",
      "a big hole in the side of a hill or under the ground",
      "山洞",
      "Bats live in the dark {cave}. | People lived in dark {caves} in the hills thousands of years ago.|valleys deserts | We need a light to go into the {cave}.",
      "valley desert",
    ),
    word(
      "ocean oceans",
      "a very big sea",
      "海洋",
      "The Pacific, a very big sea, is the biggest {ocean} in the world. | Whales live in the salty water of the {ocean}. | More than half of the Earth is covered by {oceans}.|lakes rivers",
      "lake river",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "Famous places take a capital letter when the word is part of the name: *the Eiffel Tower*, *Buckingham Palace*, *the Statue of Liberty*. In other sentences, write *a tower*, *the palace* in small letters.",
        "名胜的名字里含有这个词时要大写：*the Eiffel Tower*、*Buckingham Palace*、*the Statue of Liberty*。在其他句子里写小写的 *a tower*、*the palace*。",
      ),
      meaning: t(
        "A *castle* and a *palace* are both big old buildings, but a *castle* has thick walls and towers to keep people safe, and a *palace* is a very big, beautiful house where a king or queen lives.",
        "*castle* 和 *palace* 都是古老的大建筑，但 *castle* 有厚墙和塔楼，用来保护人们；*palace* 是国王或王后住的又大又漂亮的房子。",
      ),
      spell: t(
        "*Desert* has one s and means sand, while *dessert* with a double s is the sweet food after a meal. *Castle* has a silent t: cas · tle.",
        "*desert* 只有一个 s，指沙漠；*dessert* 双写 s，是饭后甜点。*castle* 里的 t 不发音：cas · tle。",
      ),
    },
    notes: `
      castle|a king and queen behind thick walls and towers;old buildings with thick walls in Scotland;thick stone walls to walk around|a castle has thick walls and towers to keep people safe; a palace is a beautiful house for a king|castle 有厚墙和塔楼保护人们；palace 是国王住的漂亮房子|palace=palace is a very big, beautiful house, not a building with thick walls and towers to keep people safe=palace 是又大又漂亮的房子，不是用厚墙和塔楼保护人的建筑;tower=tower is one tall narrow building, not a place with walls around it where a king and queen live=tower 是一座又高又窄的建筑，不是四周有城墙、国王王后住的地方|cas · tle|a silent t|t 不发音
      palace|the emperors' home in the Forbidden City;where the queen lives in London;nine hundred beautiful rooms for a king|a palace is where a king or queen lives; a temple is where people pray|palace 是国王或王后住的地方；temple 是人们祈祷的地方|castle/Castle=castle is built with thick walls to keep people safe, not a very big, beautiful house of an emperor, a queen or a king=castle 是用厚墙保护人的建筑，不是皇帝、女王或国王住的华丽大房子;temple/Temple=temple is a building where people pray to a god, not where a king or queen lives=temple 是人们向神祈祷的地方，不是国王或王后住的地方|pal · ace|-ace at the end, said like *is*|结尾 -ace 读作 *is*
      tower|the top looking down at a city;the Eiffel one in Paris;a clock on the tallest building in town|a tower is a tall narrow building; a statue is a figure of a person|tower 是又高又窄的建筑；statue 是人像|statue/Statue=statue is a figure of a person or an animal, not a tall building you climb or that has a clock=statue 是人或动物的雕像，不是可以爬上去或带钟的高楼;palace/Palace=palace is a big beautiful house for a king, not a tall narrow building=palace 是国王住的华丽大房子，不是又高又窄的建筑|tow · er|ow, as in *now*|ow 和 *now* 里的一样
      temple|an old Buddhist one in the mountains;taking off shoes to pray inside;beautiful Buddhist buildings in Kyoto|a temple is where Buddhists and others pray; a church is where Christians pray|temple 是佛教徒等人祈祷的地方；church 是基督徒祈祷的地方|church/churches=church is where Christians pray, not a Buddhist building=church 是基督徒祈祷的地方，不是佛教建筑;palace/palaces=palace is where a king or queen lives, not a place to pray=palace 是国王或王后住的地方，不是祈祷的地方|tem · ple|-ple at the end|结尾是 -ple
      statue|a stone poet in a square;Liberty in New York;stone figures two thousand years old|a statue is a figure made of stone or metal; a photo is a picture|statue 是石头或金属做的像；photo 是照片|tower/Tower/towers=tower is a tall narrow building, not a figure of a person=tower 是又高又窄的建筑，不是人像;photo/Photo/photos=photo is a picture on paper or a screen, not a figure made of stone=photo 是纸上或屏幕上的照片，不是石头做的像|stat · ue|-ue at the end|结尾是 -ue
      view|the top of a mountain;a hotel room and the sea;the hills below|a view is what you can see from a place; a statue is a figure you look at|view 是从某处看到的景色；statue 是你看的雕像|statue=statue is one figure of a person, not everything you can see from a place=statue 是一尊人像，不是从某处看到的全部景色;temple=temple is a building where people pray, not what you can see from a place=temple 是祈祷的建筑，不是从某处看到的景色|view|ie, with w at the end|中间是 ie，结尾是 w
      coast|driving and stopping at every beach;big cities next to the sea;a lighthouse on the west of an island|the coast is the land next to the sea; a desert is dry land with sand|coast 是海边的陆地；desert 是干燥的沙地|desert=desert is dry land with sand, far from the sea and with no beaches=desert 是干燥的沙地，远离大海，没有海滩;valley=valley is low land between hills, not land next to the sea=valley 是山与山之间的低地，不是海边的陆地|coast|oa, as in *boat*|oa 和 *boat* 里的一样
      desert|almost never any rain;camels with no water for days;the Sahara|a desert is dry land with sand and little rain; the coast is next to the sea|desert 是少雨的沙地；coast 是海边|dessert=dessert is sweet food after a meal, not a dry place with sand=dessert 是饭后甜点，不是干燥的沙地;coast=coast is the land next to the sea, not a dry place far from water=coast 是海边的陆地，不是远离水的干燥地方|des · ert|one s; *dessert* with ss is the sweet food|一个 s；双写 ss 的 *dessert* 是甜点
      valley|a river between two hills;green land below a hill;a village deep between mountains|a valley is low land between hills; a cave is a hole in a hill|valley 是山间低地；cave 是山上的洞|cave=cave is a dark hole in the side of a hill, not open land between hills=cave 是山边黑黑的洞，不是山间开阔的低地;coast=coast is the land next to the sea, not low land between hills=coast 是海边的陆地，不是山间低地|val · ley|the double l, and -ey at the end|双写 l，结尾是 -ey
      cave|bats in the dark;dark homes in the hills long ago;needing a light to go in|a cave is a big hole in a hill or under the ground; a valley is open land between hills|cave 是山上或地下的大洞；valley 是山间开阔地|valley/valleys=valley is open land between hills, not a dark hole you need a light for=valley 是山间开阔的低地，不是需要照明的黑洞;desert/deserts=desert is open dry land with sand, not a dark hole=desert 是开阔干燥的沙地，不是黑洞|cave|a that says its name before the silent e|不发音的 e 前面，a 读字母本音
      ocean|the Pacific, the biggest in the world;whales in salty water;more than half of the Earth|an ocean is a very big sea; a lake is water with land all around it|ocean 是很大的海；lake 是四周有陆地的水|lake/lakes=lake is water with land all around it, much smaller than the sea and not salty=lake 是四周有陆地的水，比大海小得多，也不咸;river/rivers=river is water that flows across land to the sea, not a very big salty sea=river 是流过陆地、流向大海的水，不是又大又咸的海|o · cean|ce said like *sh*|ce 读作 *sh*
    `,
  },
});

const transport = vocabularyTopic({
  id: "a2-words-transport",
  title: t("Transport", "交通"),
  summary: t(
    "Subways, platforms and seats; ferries, motorbikes and helicopters; traffic; missing a train; delays, gates and passengers.",
    "地铁、站台和座位；渡轮、摩托车和直升机；交通；错过火车；延误、登机口和乘客。",
  ),
  intro: t(
    "At rush hour the **subway** was full, so we took the **ferry** across the river, but the **traffic** on the other side made us **miss** our train. These words help you talk about how you travel and what can go wrong on the way.",
    "高峰时段 **subway**（地铁）挤满了人，所以我们坐 **ferry**（渡轮）过河，可是对岸的 **traffic**（车流）让我们 **miss**（错过）了火车。这些词帮你谈论怎样出行，以及路上可能出什么岔子。",
  ),
  prerequisites: ["a2-words-places-to-visit"],
  words: [
    word(
      "subway subways",
      "a train that runs under the ground in a city",
      "地铁",
      "I take the {subway} to school every day: it runs under the city. | The {subway} runs under the ground, so it is faster than the bus at rush hour. | Line 2 of the {subway} has a station under the airport.",
      "bus taxi",
    ),
    word(
      "platform platforms",
      "the place where you wait for a train in a station",
      "站台",
      "The train to Beijing leaves from {platform} 4. | Wait on the {platform} behind the yellow line. | The {platform} was full of people waiting for the train.",
      "gate seat",
    ),
    word(
      "seat seats",
      "something you sit on in a bus, a train or a plane",
      "座位",
      "Is this {seat} free? — Yes, please sit down. | I gave my {seat} to an old lady. | We had {seats} by the window.|gates platforms",
      "gate platform",
    ),
    word(
      "ferry ferries",
      "a boat that carries people and cars across water",
      "渡轮",
      "We took the {ferry} to the island. | The {ferry} leaves every hour from the port. | Some cars drove onto the {ferry}.",
      "bus subway",
    ),
    word(
      "motorbike motorbikes",
      "a bike with an engine",
      "摩托车",
      "My uncle rides a {motorbike} to work, with a helmet on his head. | Wear a helmet on a {motorbike}! | There are many {motorbikes} in Hanoi, with two wheels and an engine.|cars buses",
      "car bus",
    ),
    word(
      "helicopter helicopters",
      "an aircraft with blades that turn on top, which can go straight up",
      "直升机",
      "A {helicopter} landed next to the hospital with a sick man. | The {helicopter} landed on the roof. | We saw two {helicopters} stop in the air over the city.|planes ferries",
      "plane ferry",
    ),
    word(
      "traffic",
      "the cars and buses on the roads",
      "交通；车流",
      "There's a lot of {traffic} on the roads at eight o'clock: cars and buses everywhere. | We were late because of the {traffic}: there were too many cars on the road. | Turn left at the {traffic} lights.",
      "delay passenger",
    ),
    word(
      "miss misses missed missing",
      "to not catch a bus, a train or a plane; to feel sad that someone is not with you",
      "错过；想念",
      "Hurry up, or we'll {miss} the train! | I {missed} the bus, so I walked to school.|caught lost | I {miss} my grandparents. They live far away.",
      "catch lose",
    ),
    word(
      "delay delays delayed delaying",
      "to make something late; a time when something is late",
      "延误；推迟",
      "Our flight was {delayed} because of the snow.|missed packed | Sorry for the {delay}: the train is late and will leave in ten minutes.|traffic gate | There are long {delays} on the subway today, so you will be late.|gates platforms",
      "miss gate",
    ),
    word(
      "gate gates",
      "the door at an airport where you get on a plane",
      "登机口；大门",
      "Flight CA981 is boarding at {gate} 12. | Please go to the {gate} thirty minutes before your flight. | Close the garden {gate}, or the dog will get out.",
      "platform seat",
    ),
    word(
      "passenger passengers",
      "a person who travels in a car, bus, train or plane but is not driving it",
      "乘客",
      "The bus can carry fifty {passengers}.|drivers pilots | All {passengers} must sit down before the driver starts the bus.|drivers pilots | I sat in the {passenger} seat next to my dad.",
      "driver pilot",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Miss* has two uses: you *miss* a bus when you are too late for it, and you *miss* a person when you feel sad they are far away. *Catch* is the opposite of the first: you *catch* a bus in time.",
        "*miss* 有两种用法：没赶上公交车是 *miss* 了它，想念远方的人也是 *miss*。第一种的反义词是 *catch*：按时赶上公交车。",
      ),
      meaning: t(
        "A *passenger* rides in a car, bus, train or plane, but the *driver* or the *pilot* moves it. A train leaves from a *platform*, but you get on a plane at a *gate*.",
        "*passenger* 是坐在车、火车或飞机上的人，开车的是 *driver*，开飞机的是 *pilot*。火车从 *platform*（站台）出发，上飞机则在 *gate*（登机口）。",
      ),
      spell: t(
        "*Ferry* has a double r and becomes *ferries*; *passenger* has a double s and an n before the g: pas · sen · ger.",
        "*ferry* 双写 r，复数是 *ferries*；*passenger* 双写 s，g 前面有个 n：pas · sen · ger。",
      ),
    },
    notes: `
      subway|a ride to school under the city;something faster than the bus because it runs under the ground;Line 2 with a station under the airport|a subway is a train under the ground in a city; a bus drives on the roads|subway 是城市里在地下跑的火车；bus 在马路上开|bus=a bus drives on the roads, not under the ground or under a city=bus 在马路上开，不在地下或城市下面跑;taxi=a taxi is a car you pay to drive you on the roads, not a train under the ground=taxi 是在马路上载你的付费汽车，不是在地下跑的火车|sub · way|sub + way, one word|sub + way，合成一个词
      platform|where the train to Beijing leaves from, number 4;where you wait behind the yellow line;a place full of people waiting for the train|a platform is where you wait for a train; a gate is where you get on a plane|platform 是等火车的站台；gate 是上飞机的登机口|gate=a gate is the door at an airport where you get on a plane, not where you wait for a train=gate 是机场上飞机的登机口，不是等火车的地方;seat=a seat is something one person sits on, not a place in a station where people stand and wait for a train=seat 是一个人坐的座位，不是车站里大家站着等火车的地方|plat · form|plat + form, one word|plat + form，合成一个词
      seat|something free to sit down on;something given to an old lady;places to sit by the window|a seat is something you sit on; a platform is where you stand and wait for a train|seat 是坐的座位；platform 是站着等火车的站台|gate=a gate is a door at an airport or in a fence, not something you sit on=gate 是机场的登机口或围栏上的门，不是坐的东西;platform=a platform is where you stand and wait for a train, not something you sit on=platform 是站着等火车的地方，不是坐的东西|seat|ea for the long e sound|ea 发长 e 音
      ferry|the way to an island;something leaving every hour from the port;something cars drove onto|a ferry is a boat that carries people and cars across water; a bus drives on the roads|ferry 是载人载车过水的渡轮；bus 在马路上开|bus=a bus drives on the roads, cannot cross water, and cars cannot drive onto it=bus 在马路上开，不能过水，汽车也开不上去;subway=a subway is a train under the ground in a city, not a boat that leaves from a port=subway 是城市地下的火车，不是从港口出发的船|fer · ry|the double r, and -ies for more than one|双写 r，复数是 -ies
      motorbike|something an uncle rides to work with a helmet on;something you wear a helmet on;something with two wheels and an engine in Hanoi|a motorbike has two wheels and an engine; a car has four wheels and you sit inside it|motorbike 有两个轮子和发动机；car 有四个轮子，人坐在里面|car=a car has four wheels and you sit inside it, so you do not ride it with a helmet on=car 有四个轮子，人坐在里面，不用戴头盔骑;bus=a bus is a big car for many people with four or more wheels, and you do not ride it with a helmet on=bus 是载很多人的大车，有四个或更多轮子，不用戴头盔骑|mo · tor · bike|motor + bike, one word|motor + bike，合成一个词
      helicopter|something landing next to a hospital with a sick man;something landing on a roof;something stopping in the air over a city|a helicopter can go straight up and stop in the air; a plane needs a long road at an airport|helicopter 能垂直起降、悬停在空中；plane 需要机场的长跑道|plane=a plane needs a long road at an airport to go up and land, so it cannot land on a roof or stop in the air=plane 需要机场的长跑道起降，不能停在屋顶上，也不能悬停;ferry=a ferry is a boat on the water, and it cannot fly or land=ferry 是水上的船，不能飞，也不能降落|hel · i · cop · ter|one l, and -ter at the end|只有一个 l，结尾是 -ter
      traffic|cars and buses everywhere on the roads at eight;too many cars on the road making people late;the lights where you turn left|traffic is the cars and buses on the roads; a delay is a time when something is late|traffic 是路上的车流；delay 是延误的时间|delay=a delay is a time when something is late, not the cars and buses on the roads=delay 是延误的时间，不是路上的汽车和公交车;passenger=a passenger is one person who rides in a car or a bus, not all the cars on the roads=passenger 是坐车的人，不是路上所有的车|traf · fic|the double f in the middle|中间双写 f
      miss|having to hurry to get the train;walking to school after the bus left;grandparents who live far away|you miss a bus when you are too late; you catch it when you are in time|没赶上车是 miss；赶上车是 catch|catch/caught=catch means getting on a bus or a train in time, the opposite of miss, and it is not feeling sad about people far away=catch 是及时赶上车，和 miss 相反，也不表示想念远方的人;lose/lost=lose means you cannot find something, not being too late for a bus or a train or being sad about people far away=lose 是丢了、找不到，不是没赶上车，也不是想念远方的人|miss|the double s at the end|结尾双写 s
      delay|a flight late because of the snow;a train that is late and will leave in ten minutes;long waits on the subway that make you late|a delay is a time when something is late; traffic is the cars on the roads|delay 是延误；traffic 是路上的车流|miss/missed=miss means being too late for a bus or train yourself, and snow cannot miss a flight=miss 是自己没赶上车，雪不会“错过”航班;pack/packed=pack means putting things into a bag, and snow does not do that to a flight=pack 是往包里装东西，雪不会对航班做这件事;traffic=traffic is the cars and buses on the roads, not a train that is late=traffic 是路上的汽车和公交车，不是晚点的火车;gate/gates=a gate is the door at an airport where you get on a plane, and it does not make a train or the subway late=gate 是机场的登机口，不会让火车或地铁晚点;platform/platforms=a platform is where you wait for a train, and a long one does not make you late=platform 是等火车的站台，站台长不会让你迟到|de · lay|-ay at the end, and -ed for the past|结尾是 -ay，过去式加 -ed
      gate|where Flight CA981 is boarding, number 12;where to go thirty minutes before a flight;a garden door to close so the dog stays in|a gate is a door at an airport or in a fence; a platform is where you wait for a train|gate 是登机口或围栏上的门；platform 是等火车的站台|platform=a platform is where you wait for a train in a station, not a door at an airport or in a garden fence=platform 是火车站里等火车的地方，不是机场的登机口，也不是花园的门;seat=a seat is something you sit on, not a door you go through at an airport or in a garden=seat 是坐的座位，不是机场或花园里要穿过的门|gate|a that says its name before the silent e|不发音的 e 前面，a 读字母本音
      passenger|the fifty people a bus can carry;people who must sit down before the driver starts the bus;the seat next to a dad who drives|a passenger rides in a car, bus, train or plane; the driver drives it|passenger 是乘客；driver 是开车的人|driver/drivers=a driver drives the bus or the car, and there is only one, not the people who ride in it=driver 是开车的人，只有一个，不是坐车的人;pilot/pilots=a pilot flies a plane, not someone who rides in a bus or a car=pilot 是开飞机的人，不是坐公交车或汽车的人|pas · sen · ger|the double s, and an n before the g|双写 s，g 前面有个 n
    `,
  },
});

const future = vocabularyTopic({
  id: "a2-words-future",
  title: t("The Future", "将来"),
  summary: t(
    "Will and won't; tomorrow and the future; probably, maybe and perhaps; expecting, dreaming and promising; someday and forever.",
    "will 和 won't；明天和将来；可能、也许和或许；期待、梦想和承诺；总有一天和永远。",
  ),
  intro: t(
    "**Tomorrow** I will **probably** visit Grandma, and **someday** I want to travel around the world: that is my **dream**. These words help you talk about plans, hopes and what may happen later.",
    "**tomorrow**（明天）我 **probably**（很可能）会去看外婆；**someday**（总有一天）我想环游世界，那是我的 **dream**（梦想）。这些词帮你谈论计划、希望，以及以后可能发生的事。",
  ),
  prerequisites: ["a2-words-transport"],
  words: [
    word(
      "will won't I'll you'll he'll she'll we'll they'll it'll",
      "a word used to talk about the future",
      "将；会",
      "It {will} rain tomorrow, so take an umbrella. | Don't worry. I {won't} tell anyone when I see them tomorrow.|didn't don't | Your bags are heavy. Tomorrow I {will} help you carry them to the station.|did do",
      "did does",
    ),
    word(
      "tomorrow",
      "the day after today",
      "明天",
      "Today is Monday, so {tomorrow} is Tuesday. | Good night! See you {tomorrow} at school at eight. | I'm going to the dentist {tomorrow} morning.",
      "yesterday someday",
    ),
    word(
      "future",
      "the time that will come after now",
      "将来；未来",
      "What do you want to be in the {future}? | Nobody knows what the {future} will bring. | In the {future}, cars will drive themselves.",
      "past history",
    ),
    word(
      "probably",
      "almost certainly",
      "很可能",
      "It's very cloudy. It will {probably} rain. | Her coat and bag are gone, so she's {probably} at school now. | We'll {probably} be late because of the traffic.",
      "never forever",
    ),
    word(
      "maybe",
      "it is possible; not sure",
      "也许；可能",
      "{Maybe} it will snow tomorrow. | Are you coming? — {Maybe}. I'm not sure yet. | {Maybe} we can go to the beach this Sunday, if it is sunny.",
      "Sometimes Someday",
      "perhaps",
    ),
    word(
      "perhaps",
      "possibly; a more formal word for maybe",
      "或许；可能",
      "{Perhaps} he missed the bus this morning; I don't know. | {Perhaps} you're right: I'll check the answer now. | We could {perhaps} meet next week.|sometimes someday",
      "Sometimes Someday",
      "maybe",
    ),
    word(
      "expect expects expected expecting",
      "to think that something will happen",
      "预计；期待",
      "I {expect} it will be cold in the mountains. | We're {expecting} twenty guests at the party.|promising dreaming | The test was easier than I {expected}.|promised decided",
      "promise dream",
    ),
    word(
      "dream dreams dreamed dreaming",
      "pictures in your mind when you sleep; something you really want",
      "梦；梦想",
      "Last night I {dreamed} that I could fly, but then I woke up.|expected promised | My {dream} is to travel around the world.|future promise | Sweet {dreams}! Good night.|futures promises",
      "expect promise",
    ),
    word(
      "someday",
      "at some time in the future",
      "总有一天",
      "{Someday}, when I'm older, I'm going to visit the pyramids. | I don't know when, but I hope I'll meet him {someday}.|yesterday tomorrow | You're too young now, but {someday} you will understand.",
      "Yesterday Tomorrow",
    ),
    word(
      "forever",
      "for all time",
      "永远",
      "I will love you {forever}, every day of my life. | Nothing lasts {forever}. | We waited {forever} for the bus! It came after an hour.",
      "someday tomorrow",
    ),
    word(
      "promise promises promised promising",
      "to say that you will certainly do something",
      "承诺；保证",
      "Mom, I {promise} I'll be home by ten: you can trust me. | You {promised} to help me!|expected dreamed | Don't break your {promise}.|dream future",
      "expect dream",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Maybe* and *perhaps* usually start a sentence, but *probably* goes after *will* or *be*: *It will probably rain*, *She's probably at home*.",
        "*maybe* 和 *perhaps* 通常放在句首，而 *probably* 放在 *will* 或 *be* 后面：*It will probably rain*、*She's probably at home*。",
      ),
      meaning: t(
        "*Someday* is one time in the future that you do not know yet, *forever* means for all time, and *tomorrow* is only the next day.",
        "*someday* 是将来某个还不知道的时候，*forever* 是永远，*tomorrow* 只是第二天。",
      ),
      spell: t(
        "*Probably* ends in -bly, not -bley, and *tomorrow* has one m and a double r: to · mor · row.",
        "*probably* 结尾是 -bly，不是 -bley；*tomorrow* 只有一个 m，双写 r：to · mor · row。",
      ),
    },
    notes: `
      will|rain tomorrow and an umbrella;not telling anyone when you see them tomorrow;helping carry heavy bags tomorrow|will talks about the future; did talks about the past|will 说将来；did 说过去|did/didn't=did and didn't talk about the past, not about tomorrow=did 和 didn't 说的是过去，不说明天;do/does/don't=do, does and don't talk about what usually happens or is true now, not about tomorrow=do、does 和 don't 说的是经常发生的事或现在的事实，不是明天|will · won't|won't is will + not, with the o changed|won't 是 will + not，元音变成了 o
      tomorrow|the day after Monday is Tuesday;seeing someone at school at eight after good night;going to the dentist in the morning|tomorrow is the day after today; yesterday is the day before today|tomorrow 是明天；yesterday 是昨天|yesterday=yesterday is the day before today, not a time still to come=yesterday 是昨天，不是还没到的时间;someday=someday means some time in the future that you do not know, not the very next day at a time you name=someday 是将来不确定的某一天，不是有明确时间的第二天|to · mor · row|one m and a double r|一个 m，双写 r
      future|what someone wants to be;what nobody knows the time to come will bring;cars that will drive themselves|the future is the time after now; the past is the time before now|future 是将来；past 是过去|past=the past is the time before now, not the time that will come=past 是过去，不是将要到来的时间;history=history is what happened long ago, not the time that will come=history 是很久以前发生的事，不是将来|fu · ture|-ture at the end, said like *cher*|结尾 -ture 读作 *cher*
      probably|rain after a very cloudy sky;a coat and bag that are gone;being late because of the traffic|probably means almost certainly, for a good reason; never means at no time|probably 是有理由的“很可能”；never 是从不|never=never means at no time, so it cannot go with a good reason why something is likely=never 是从不，不能和“某事很可能发生”的理由连用;forever=forever means for all time, not one thing that is likely now or soon=forever 是永远，不是现在或不久很可能发生的一件事|prob · a · bly|-bly at the end, not -bley|结尾是 -bly，不是 -bley
      maybe|snow tomorrow;an answer about coming when someone is not sure yet;the beach this Sunday if it is sunny|maybe means it is possible; sometimes means now and then|maybe 是可能；sometimes 是有时候|sometimes=sometimes means now and then, again and again, not one thing that may happen at one time=sometimes 是时不时、一次又一次，不是某一次可能发生的事;someday=someday means at some time in the future you do not know, not tomorrow, now or this Sunday=someday 是将来不确定的某个时候，不是明天、现在或这个星期天|may · be|may + be, one word|may + be，合成一个词
      perhaps|a bus missed this morning;someone being right before the answer is checked;meeting next week|perhaps means it is possible; someday means at some time in the future|perhaps 是或许；someday 是总有一天|sometimes=sometimes means now and then, again and again, not one thing that may be true at one time=sometimes 是时不时、一次又一次，不是某一次可能的事;someday=someday means at some time in the future you do not know, not this morning, now or next week=someday 是将来不确定的某个时候，不是今天早上、现在或下周|per · haps|per + haps, with -ps at the end|per + haps，结尾是 -ps
      expect|thinking it will be cold in the mountains;twenty guests coming to a party;a test easier than someone thought|expect means thinking something will happen; promise means saying you will certainly do something|expect 是预计；promise 是保证|promise/promising/promised=promise means saying you will certainly do something yourself, not thinking what the weather, guests or a test will be like=promise 是保证自己一定会做某事，不是预计天气、客人或考试会怎样;dream/dreaming=dream means pictures in your sleep or something you really want, not thinking something will happen=dream 是睡着时的梦或很想要的东西，不是预计会发生的事;decide/decided=decide means choosing what to do, not thinking how something will be=decide 是决定做什么，不是预计会怎样|ex · pect|ex- at the start, and -ct at the end|开头是 ex-，结尾是 -ct
      dream|flying at night before waking up;traveling around the world one day;good night wishes|a dream is pictures when you sleep or something you really want; a promise is saying you will do something|dream 是梦或梦想；promise 是承诺|expect/expected=expect means thinking something will happen, not seeing pictures while you sleep=expect 是预计会发生，不是睡着时看到的画面;promise/promised/promises=a promise is saying you will certainly do something for someone, not pictures in your sleep or something you only wish for=promise 是向别人保证一定做某事，不是梦，也不是心里的愿望;future/futures=the future is the time after now, not pictures in your sleep or one thing you wish for=future 是将来的时间，不是梦，也不是某个愿望|dream|ea for the long e, and -ed or -t for the past|ea 发长 e 音，过去式是 -ed 或 -t
      someday|visiting the pyramids when older;meeting someone at a time no one knows;understanding when no longer too young|someday means at some time in the future; tomorrow means the next day|someday 是将来某一天；tomorrow 是明天|yesterday=yesterday is the day before today, not a time to come=yesterday 是昨天，不是将要到来的时间;tomorrow=tomorrow is the very next day, not a time far away that you do not know yet=tomorrow 是第二天，不是遥远的、还不知道的时候|some · day|some + day, one word|some + day，合成一个词
      forever|love every day of a life;nothing lasting for all time;a bus that came after an hour|forever means for all time or a very long time; someday means at one time in the future|forever 是永远或很久；someday 是将来某一天|someday=someday means at one time in the future, not for all time or for a very long time=someday 是将来的某一天，不是永远，也不是很久;tomorrow=tomorrow is the day after today, not for all time or for a very long time=tomorrow 是第二天，不是永远，也不是很久|for · ev · er|for + ever, one word|for + ever，合成一个词
      promise|being home by ten so Mom can trust you;help someone said they would give;something you should not break|a promise is saying you will certainly do something; a dream is something you wish for|promise 是保证；dream 是梦想|expect/expected=expect means thinking something will happen, not telling someone they can trust you to do it=expect 是预计会发生，不是让别人相信你一定会做;dream/dreamed=a dream is pictures in your sleep or something you wish for, and you cannot break it like a word you gave=dream 是梦或愿望，不像许下的诺言那样能“打破”;future=the future is the time after now, not words you gave that you should not break=future 是将来的时间，不是许下的、不该违背的话|prom · ise|-ise at the end, said like *is*|结尾 -ise 读作 *is*
    `,
  },
});

// Going to.

/** goSubjects are a subject, its form of be, its short form, and a wrong form of be. */
const goSubjects: readonly (readonly [string, string, string, string])[] = [
  ["I", "am", "I'm", "is"],
  ["We", "are", "We're", "is"],
  ["My sister", "is", "", "are"],
  ["They", "are", "They're", "is"],
  ["Tom", "is", "", "are"],
  ["She", "is", "She's", "are"],
  ["My parents", "are", "", "is"],
];
const goPlans: readonly string[] = [
  "visit the castle",
  "take the night ferry",
  "stay in a hotel by the sea",
  "fly to Beijing",
  "see the old temple",
  "buy some souvenirs",
  "pack a big suitcase",
  "travel by train",
];
const goTimes: readonly string[] = ["next summer", "tomorrow", "on Saturday", "next week", "this weekend"];

// Seven subjects, eight plans and five times have no common factor, so 280 rows give every combination once.
const goRows = combos(280, goSubjects, goPlans, goTimes);

const subjectIn = (subject: string) => (/^(I|Tom)$/u.test(subject) ? subject : subject.toLowerCase());
const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const goChoiceBank: readonly ChoiceItem[] = goRows.map(
  ([[subject, be, , bad], plan, time]): ChoiceItem => [
    `${capital(time)}, ${subjectIn(subject)} ___ ${plan}.`,
    `${be} going to`,
    [`${bad} going to`, `${be} going`],
  ],
);

const goStatement = (subject: string, be: string, short: string) => (short ? `[${subject} ${be}|${short}]` : `${subject} ${be}`);

const goTypedBank: readonly TypedItem[] = goRows.map(
  ([[subject, be, short, bad], plan, time]): TypedItem => ({
    shown: `${subject} / ${plan} / ${time}`,
    accepted: [`${goStatement(subject, be, short)} going to ${plan} ${time}.`],
    canonical: `${subject} ${be} going to ${plan} ${time}.`,
    wrong: [`${subject} ${bad} going to ${plan} ${time}.`, `${subject} ${be} going ${plan} ${time}.`],
  }),
);

const questionSubject = (subject: string) => (subject === "I" ? "you" : subject === "We" ? "you" : subjectIn(subject));
const questionBe = (subject: string, be: string) => (subject === "I" || subject === "We" ? "are" : be);

const goQuestionBank: readonly TypedItem[] = goRows.map(([[subject, be], plan, time]): TypedItem => {
  const qs = questionSubject(subject);
  const qb = questionBe(subject, be);
  const statement = `${subject === "I" || subject === "We" ? "You" : subject} ${qb} going to ${plan} ${time}.`;
  return {
    shown: statement,
    accepted: [`${capital(qb)} ${qs} going to ${plan} ${time}?`],
    wrong: [`${capital(qs)} ${qb} going to ${plan} ${time}?`, `Do ${qs} going to ${plan} ${time}?`],
  };
});

/** goBeRule says which subjects take am, is or are. */
const goBeRule = (be: string): Text =>
  be === "am"
    ? t("*I* takes *am*", "*I* 用 *am*")
    : be === "is"
      ? t("one person or thing takes *is*", "单个的人或物用 *is*")
      : t("*we*, *you*, *they* and more than one take *are*", "*we*、*you*、*they* 和多个人或物用 *are*");

/** goWhy explains a plan with am, is or are going to. */
const goWhy = (sentence: string): Text => {
  const be = /\b(am|is|are)\b/u.exec(sentence)?.[1] ?? (/^I'm/u.test(sentence) ? "am" : "are");
  const rule = goBeRule(be);
  return t(
    `A plan made before takes *am*, *is* or *are* with *going to* and the first form of the verb; ${rule.en}: ${sentence}\n\n**Check.** Verify all three pieces in order: *${be}* (matching the subject) + *going to* + plain verb.`,
    `事先做好的计划用 *am / is / are* 加 *going to* 再加动词原形；${rule["zh-CN"]}：${sentence}\n\n**检验。** 按顺序核对三部分：与主语一致的 *${be}* + *going to* + 动词原形。`,
  );
};

/** whyNotGo explains the wrong form of be, or going without to. */
const whyNotGo = (wrong: string, _right: string, _shown: string, position: number): Text => {
  if (position === 1)
    return t(
      `*${wrong}* leaves out *to*. A plan needs *going to* right before the plain verb.`,
      `*${wrong}* 漏了 *to*。表达计划要用 *going to* 再接动词原形。`,
    );
  return t(
    `*${wrong}* uses the wrong form of *be* for this subject—check whether it needs *am*, *is* or *are*.`,
    `*${wrong}* 里的 *be* 动词与主语不匹配——请核对主语该配 *am*、*is* 还是 *are*。`,
  );
};

const beGoingTo: TopicDef = {
  id: "be-going-to",
  title: t("Going To", "be going to 表示将来"),
  summary: t(
    "We are going to visit the castle. Going to is for plans already made.",
    "We are going to visit the castle. be going to 表示已经做好的计划。",
  ),
  intro: t(
    "When you already have a plan—*I'm going to pack my bag tonight*—English links *am / is / are*, *going to*, and the plain verb to show intention.",
    "说已经定好的计划时（如 *I'm going to pack my bag tonight*），英语用 *am / is / are* + *going to* + 动词原形来表达打算。",
  ),
  prerequisites: ["present-continuous", "a2-words-holidays"],
  encompasses: [
    { topic: "present-continuous", weight: 0.3 },
    { topic: "a2-words-holidays", weight: 0.1 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "form",
      t("Am, is or are going to", "am、is 还是 are going to"),
      t(
        "For a plan you have already made, use *am*, *is* or *are* with *going to* and the first form of a verb:\n\n- *I am going to fly to Beijing.* (*I'm*)\n- *She is going to stay in a hotel.* (*She's*)\n- *We are going to visit the castle.* (*We're*)\n\n> **Watch out.** Never drop *be* (*We going to visit*) and never drop *to* (*We are going visit*).",
        "表示已经做好的计划，用 *am / is / are* 加 *going to* 再加动词原形：\n\n- *I am going to fly to Beijing.*（*I'm*）\n- *She is going to stay in a hotel.*（*She's*）\n- *We are going to visit the castle.*（*We're*）\n\n> **注意。** 既不能漏掉 *be*（*We going to visit*），也不能漏掉 *to*（*We are going visit*）。",
      ),
      choiceGenerator(
        t("Choose the words for the gap.", "选出填入空白处的词。"),
        goChoiceBank,
        (right, shown) => goWhy(fill(shown, right)),
        whyNotGo,
      ),
    ),
    point(
      "write",
      t("Writing a plan", "写出计划"),
      t(
        "Write the plan in the note with *going to*: *We / visit the castle / next Sunday* → *We are going to visit the castle next Sunday.* You may use the short forms *I'm*, *we're*, *they're* and *she's*.\n\n> **Watch out.** Check that *am/is/are* matches the subject and that *going to* is followed by the plain verb.",
        "用 *going to* 写出笔记里的计划：*We / visit the castle / next Sunday* → *We are going to visit the castle next Sunday.* 可以用缩写 *I'm*、*we're*、*they're* 和 *she's*。\n\n> **注意。** 核对 *am/is/are* 与主语一致，并且 *going to* 后面接动词原形。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Write a sentence from the note.", "根据笔记写一个句子。"),
        goTypedBank,
        goWhy,
        beGoingToWriteNot,
      ),
    ),
    point(
      "question",
      t("Asking about plans", "询问计划"),
      t(
        "To ask about a plan, put *am*, *is* or *are* before the subject: *You are going to fly.* → *Are you going to fly?* *Tom is going to stay.* → *Is Tom going to stay?*\n\n> **Watch out.** Do not use *Do* or *Does* (*Do you going to fly?* is wrong)—simply move *am/is/are* to the front and end with a question mark.",
        "询问计划时，把 *am / is / are* 放到主语前面：*You are going to fly.* → *Are you going to fly?* *Tom is going to stay.* → *Is Tom going to stay?*\n\n> **注意。** 不要用 *Do* 或 *Does*（*Do you going to fly?* 是错的）——直接把 *am/is/are* 移到句首，句末加问号。",
      ),
      typedGenerator(
        "sentence",
        t("Make the sentence a question.", "把句子改成疑问句。"),
        goQuestionBank,
        (right) => {
          const be = right.split(" ")[0] ?? "";
          return t(
            `To ask about a plan, move *${be.toLowerCase()}* before the subject and keep *going to* and the verb after it, with no *do*: ${right}\n\n**Check.** Verify the front order (*${be}* + subject + *going to* + verb) and the closing question mark.`,
            `询问计划时，把 *${be.toLowerCase()}* 移到主语前面，后面保留 *going to* 和动词，不用 *do*：${right}\n\n**检验。** 核对句首语序（*${be}* + 主语 + *going to* + 动词）和句末问号。`,
          );
        },
        beGoingToQuestionNot,
      ),
    ),
  ],
};

// Will for the future.

/** willStarts are the openings of a guess about the future and its subject, which may take -s. */
const willStarts: readonly string[] = ["I think", "Don't worry.", "I'm sure", "Maybe", "I bet", "I hope"];
const willWho: readonly string[] = ["you", "we", "they", "she", "he", "our team", "my brother", "the children"];

/** willPredictions are the first form of a verb, its form with -s, and what follows it. */
const willPredictions: readonly (readonly [string, string, string])[] = [
  ["be", "is", "cold in the mountains"],
  ["pass", "passes", "the test easily"],
  ["win", "wins", "the final"],
  ["arrive", "arrives", "late"],
  ["help", "helps", "us with the bags"],
  ["miss", "misses", "the train"],
  ["like", "likes", "the soup"],
  ["love", "loves", "the beach"],
  ["come", "comes", "back in five minutes"],
  ["find", "finds", "a good hotel"],
  ["get", "gets", "there before dark"],
  ["enjoy", "enjoys", "the trip"],
  ["meet", "meets", "us at the airport"],
  ["need", "needs", "a coat"],
  ["learn", "learns", "a lot on the trip"],
];

/** willNegatives are the first form of a verb and what follows it, for won't. */
const willNegatives: readonly (readonly [string, string])[] = [
  ["tell", "anyone the secret"],
  ["take", "long"],
  ["stay", "dry without an umbrella"],
  ["find", "a seat on the train"],
  ["buy", "any souvenirs today"],
  ["go", "to school tomorrow"],
  ["get", "there in time"],
  ["have", "time to help"],
  ["be", "home before ten"],
  ["swim", "in the cold sea"],
  ["make", "the same mistake again"],
  ["visit", "the castle today"],
  ["forget", "the tickets"],
  ["like", "the long journey"],
  ["sleep", "on the night bus"],
];

const willOpenings: readonly string[] = everyPair(willStarts, willWho).map(([start, who]) =>
  start.endsWith(".") ? `${start} ${sentenceCase(who)}` : `${start} ${who}`,
);

const willChoiceBank: readonly ChoiceItem[] = interleave([
  everyPair(willOpenings, willPredictions).map(
    ([open, [verb, third, rest]]): ChoiceItem => [`${open} ___ ${rest}. (${verb})`, `will ${verb}`, [`will ${third}`, `will to ${verb}`]],
  ),
  everyPair([...willOpenings.slice(5), ...willOpenings.slice(0, 5)], willNegatives).map(
    ([open, [verb, rest]]): ChoiceItem => [
      `${open} ___ ${rest}. (not ${verb})`,
      `won't ${verb}`,
      [`don't will ${verb}`, `won't to ${verb}`],
    ],
  ),
]);

/** planPeople are a subject, its form of be, and its form of have. */
const planPeople: readonly (readonly [string, string, string])[] = [
  ["We", "are", "have"],
  ["I", "am", "have"],
  ["She", "is", "has"],
  ["They", "are", "have"],
  ["He", "is", "has"],
  ["My cousins", "are", "have"],
  ["Lin", "is", "has"],
];

/** planEvidence are signs that a plan was made before, after the subject and have. */
const planEvidence: readonly string[] = [
  "already made all the plans",
  "planned it for weeks",
  "booked everything",
  "talked about it for months",
  "already decided",
];

/** planActs are plans for later. */
const planActs: readonly string[] = [
  "fly to Rome on Friday",
  "buy a new bike in June",
  "stay with an aunt in July",
  "visit three castles next week",
  "spend a week by the sea",
  "learn to drive this year",
  "start a new job next Monday",
  "paint the kitchen on Saturday",
  "run five kilometers in May",
  "travel across Canada by train",
  "watch the final on Sunday",
  "take a cooking class in the autumn",
];

/** decisions are something that happens and a decision made at that moment with I. */
const decisions: readonly (readonly [string, string])[] = [
  ["The phone is ringing.", "answer it"],
  ["It's cold in here.", "close the window"],
  ["I'm thirsty.", "get you some water"],
  ["This bag is heavy!", "carry it"],
  ["I don't understand this word.", "explain it to you"],
  ["Oh no, I forgot my wallet!", "pay"],
  ["The bus isn't coming.", "call a taxi"],
  ["Someone is at the door.", "see who it is"],
  ["I can't open this jar.", "do it"],
  ["It's starting to rain!", "get an umbrella"],
  ["The baby is crying.", "go"],
  ["There's no milk.", "buy some on my way home"],
  ["I forgot to call Grandma!", "call her now"],
  ["The printer isn't working.", "fix it"],
  ["My hands are full.", "open the door for you"],
];
const decisionReplies: readonly string[] = ["Don't worry,", "Wait,", "OK,", "Leave it to me.", "No problem,"];

const planChoiceBank: readonly ChoiceItem[] = interleave([
  everyPair(everyPair(planPeople, planEvidence), planActs).map(
    ([[[subject, be, have], evidence], act]): ChoiceItem => [
      `${subject} ${have} ${evidence}. ${subject === "I" ? "I" : subject === "We" ? "We" : /^(She|Lin)$/u.test(subject) ? "She" : subject === "He" ? "He" : "They"} ___ ${act}.`,
      `${be} going to`,
      ["will", be],
    ],
  ),
  everyPair(decisionReplies, decisions).map(
    ([reply, [happens, act]]): ChoiceItem => [`${happens} — ${reply} I ___ ${act}.`, "'ll", ["am going to", "am"]],
  ),
]);

const willSubjects: readonly (readonly [string, string])[] = [
  ["I", "I'll"],
  ["You", "You'll"],
  ["We", "We'll"],
  ["They", "They'll"],
  ["She", "She'll"],
  ["He", "He'll"],
];
const willGuesses: readonly string[] = [
  "enjoy the trip",
  "find the hotel easily",
  "need a map",
  "get lost in the old town",
  "take a lot of photos",
  "want to come back",
  "sleep on the plane",
  "make new friends",
  "learn some Italian",
  "spend too much money",
  "be late",
  "pass the test",
  "love the city",
  "win the match",
  "be tired after the flight",
  "miss the bus",
  "like the food",
];

const willTypedBank: readonly TypedItem[] = everyPair(willSubjects, willGuesses).map(([[subject, short], guess], k): TypedItem => {
  const not = k % 3 === 0;
  return not
    ? {
        shown: `${subject} / probably not / ${guess}`,
        accepted: [`${subject} probably [won't|will not] ${guess}.`],
        canonical: `${subject} probably won't ${guess}.`,
        wrong: [`${subject} don't probably ${guess}.`, `${subject} probably won't to ${guess}.`],
      }
    : {
        shown: `${subject} / probably / ${guess}`,
        accepted: [`[${subject} will|${short}] probably ${guess}.`],
        canonical: `${subject} will probably ${guess}.`,
        wrong: [`${subject} probably ${guess}.`, `${subject} will probably to ${guess}.`],
      };
});

/** willWhy explains will or won't with the first form of a verb. */
const willWhy = (sentence: string): Text =>
  /won't|will not/u.test(sentence)
    ? t(
        `*won't* (*will not*) is the same for every person, and the verb after it stays in its first form: ${sentence}\n\n**Check.** Verify that *won't* is used directly (no *don't*) and is followed by the plain verb with no *to*.`,
        `*won't*（*will not*）对所有人称都一样，后面的动词用原形：${sentence}\n\n**检验。** 确认直接用 *won't* 否定（不加 *don't*），后面紧接不带 *to* 的动词原形。`,
      )
    : t(
        `*will* is the same for every person, and the verb after it stays in its first form: ${sentence}\n\n**Check.** Look right after *will*: there is no *to* and no *-s* on the verb, no matter who the subject is.`,
        `*will* 对所有人称都一样，后面的动词用原形：${sentence}\n\n**检验。** 看 *will* 后面：无论主语是谁，都没有 *to*，动词也不加 *-s*。`,
      );

/** whyNotWill explains -s or to after will, or do with will. */
const whyNotWill = (wrong: string): Text => {
  if (wrong.startsWith("don't"))
    return t(
      "*will* makes its own negative directly and never takes *do* or *don't*.",
      "*will* 自己直接构成否定，从不和 *do* 或 *don't* 连用。",
    );
  if (/ to /u.test(wrong))
    return t(
      `*${wrong}* puts *to* after *${wrong.split(" ")[0]}*, but the plain verb comes straight after it.`,
      `*${wrong}* 在 *${wrong.split(" ")[0]}* 后面加了 *to*，但动词原形应直接跟在后面。`,
    );
  return t(
    `*${wrong}* adds *-s* to the verb. After *will* the verb stays in its first form for every person.`,
    `*${wrong}* 给动词加了 *-s*。*will* 后面的动词对所有人称都用原形。`,
  );
};

/** planWhy explains going to for a plan made before or 'll for a decision made now. */
const planWhy = (right: string, shown: string): Text => {
  const done = fill(shown, right).replace("I *'ll*", "*I'll*");
  return right === "'ll"
    ? t(
        `The speaker decides at the moment of speaking, often to help, so it takes *will* (*'ll*): ${done}\n\n**Check.** Ask when the decision was made: right now, in response to what just happened → *'ll*.`,
        `说话人是当场做出决定，常常是主动帮忙，所以用 *will*（*'ll*）：${done}\n\n**检验。** 判断决定的时间：是刚发生这件事后当场决定的 → 用 *'ll*。`,
      )
    : t(
        `The first sentence shows that the plan was made before speaking, so it takes *going to*: ${done}\n\n**Check.** Look at the first sentence: the speaker already booked or decided earlier → *be going to*.`,
        `第一句说明计划在说话前就已做好，所以用 *going to*：${done}\n\n**检验。** 看第一句：说话前就已订好或决定好 → 用 *be going to*。`,
      );
};

/** whyNotPlan explains will for a plan, going to for a decision now, or be alone before a verb. */
const whyNotPlan = (wrong: string): Text => {
  if (wrong === "will")
    return t(
      "*will* is for a decision made at the moment of speaking, but this plan was already made before.",
      "*will* 用于说话时当场做出的决定，但这个计划是事先做好的。",
    );
  if (wrong.endsWith("going to"))
    return t(
      "*going to* is for a plan made before, but here the speaker decides at the moment of speaking.",
      "*going to* 用于事先做好的计划，但这里说话人是当场做出决定。",
    );
  return t(
    `*${wrong}* alone cannot come straight before the first form of a verb to express the future.`,
    `*${wrong}* 不能单独放在动词原形前面来表示将来。`,
  );
};

const willForTheFuture: TopicDef = {
  id: "will-for-the-future",
  title: t("Will and Won't", "will 和 won't"),
  summary: t(
    "It will probably rain. I'll help you. Will is for predictions and for decisions made now.",
    "It will probably rain. I'll help you. will 用于预测和当下做出的决定。",
  ),
  intro: t(
    "When you guess what will happen (*It will probably snow tonight*) or offer help on the spot (*I'll carry that bag*), English uses *will* (or *'ll* / *won't*) straight before the plain verb.",
    "预测将要发生的事（*It will probably snow tonight*）或当场决定帮忙（*I'll carry that bag*）时，英语用 *will*（或 *'ll* / *won't*）直接接动词原形。",
  ),
  prerequisites: ["a2-words-future", "be-going-to"],
  encompasses: [
    { topic: "be-going-to", weight: 0.3 },
    { topic: "a2-words-future", weight: 0.2 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "form",
      t("Will and won't with a verb", "will 和 won't 加动词"),
      t(
        "*will* and *won't* (*will not*) are the same for every person, and the verb after them stays in its first form:\n\n- *It will be cold. She will help you.*\n- *I won't tell anyone.*\n\n> **Watch out.** Never add *-s* after *will* (*will helps*), never add *to* (*will to pass*), and never use *don't* with *will* (*don't will tell*).",
        "*will* 和 *won't*（*will not*）对所有人称都一样，后面的动词用原形：\n\n- *It will be cold. She will help you.*\n- *I won't tell anyone.*\n\n> **注意。** *will* 后面的动词绝不加 *-s*（不说 *will helps*）、不加 *to*（不说 *will to pass*），也绝不和 *don't* 连用（不说 *don't will tell*）。",
      ),
      choiceGenerator(
        t("Choose the words for the gap.", "选出填入空白处的词。"),
        willChoiceBank,
        (right, shown) => willWhy(fill(shown, right)),
        whyNotWill,
      ),
    ),
    point(
      "plan-or-now",
      t("A plan or a decision now", "计划还是当下的决定"),
      t(
        "Use *going to* for a plan you made before you speak: *We bought the tickets. We are going to fly to Rome.*\n\nUse *will* (*'ll*) for a decision you make at the moment you speak, often to offer help: *The phone is ringing. — I'll answer it.*\n\n> **Watch out.** Look at the first sentence for the clue: if it mentions booking or planning earlier, choose *be going to*; if it describes a sudden situation right now, choose *'ll*.",
        "说话之前就已经做好的计划，用 *going to*：*We bought the tickets. We are going to fly to Rome.*\n\n说话时当场做出的决定，常常是主动提供帮助，用 *will*（*'ll*）：*The phone is ringing. — I'll answer it.*\n\n> **注意。** 看第一句的线索：提到早就订好或计划好，用 *be going to*；描述眼下突然发生的情况、当场回应，用 *'ll*。",
      ),
      choiceGenerator(t("Choose the best words for the gap.", "选出最适合填入空白处的词。"), planChoiceBank, planWhy, whyNotPlan),
    ),
    point(
      "write",
      t("Writing a prediction", "写出预测"),
      t(
        "Write the prediction with *will* and *probably*. *probably* goes after *will* but before *won't*: *We will probably win. We probably won't win.*\n\n> **Watch out.** Watch the position of *probably*: *will probably* (positive) vs. *probably won't* (negative)—do not write *won't probably*.",
        "用 *will* 和 *probably* 写出预测。*probably* 放在 *will* 后面，但放在 *won't* 前面：*We will probably win. We probably won't win.*\n\n> **注意。** 留意 *probably* 的位置：肯定句是 *will probably*，否定句是 *probably won't*——不要写成 *won't probably*。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Write a sentence from the note.", "根据笔记写一个句子。"),
        willTypedBank,
        (right) =>
          /won't/u.test(right)
            ? t(
                `A prediction takes *will*, and its negative is *won't*; *probably* goes before *won't*, and the verb stays in its first form: ${right}\n\n**Check.** Verify the order: subject + *probably won't* + plain verb (no *to*).`,
                `预测用 *will*，否定是 *won't*；*probably* 放在 *won't* 前面，动词用原形：${right}\n\n**检验。** 核对语序：主语 + *probably won't* + 动词原形（不加 *to*）。`,
              )
            : t(
                `A prediction takes *will*; *probably* goes after *will*, and the verb stays in its first form: ${right}\n\n**Check.** Verify the order: subject + *will probably* (or *'ll probably*) + plain verb (no *to*).`,
                `预测用 *will*；*probably* 放在 *will* 后面，动词用原形：${right}\n\n**检验。** 核对语序：主语 + *will probably*（或 *'ll probably*）+ 动词原形（不加 *to*）。`,
              ),
        willForTheFutureWriteNot,
      ),
    ),
  ],
};

// Writing about future plans.

const plansBank: readonly WritingItem[] = [
  {
    task: "Write about a trip to the beach you are going to take.",
    model:
      "Next month my family is going to spend a week at the beach in Sanya. We are going to fly there on the first of August. The flight takes about four hours. We are going to stay in a small hotel near the sea. Every morning I'm going to swim, and in the afternoon we will probably visit some islands by boat. I think it will be very hot. I can't wait!",
  },
  {
    task: "Write about a visit to a big city you are going to make.",
    model:
      "This summer I'm going to visit my uncle in Shanghai. I'm going to take the fast train with my mom on July 10th. The journey is about five hours. We are going to stay at my uncle's flat for two weeks. First we are going to see the Bund at night. Then we will probably go to the science museum. I'm also going to buy some souvenirs for my friends.",
  },
  {
    task: "Write about a camping trip you are going to take.",
    model:
      "Next weekend my class is going to go camping in the mountains. We are going to leave by bus on Saturday morning. We are going to sleep in tents near a lake. In the afternoon we are going to climb to the top of a hill to see the view. At night we will cook dinner on a fire and look at the stars. I think it will be cold, so I'm going to pack a warm sweater.",
  },
  {
    task: "Write about a trip abroad you are going to take.",
    model:
      "In October my parents and I are going to travel to Japan. We are going to fly from Beijing to Tokyo. We already have our passports and our tickets. We are going to stay in Tokyo for four days and then take a fast train to Kyoto. In Kyoto we are going to visit old temples. My mom says we will probably eat sushi every day. I'm going to send postcards to my grandparents.",
  },
  {
    task: "Write about a visit to your grandparents you are going to make.",
    model:
      "During the Spring Festival, we are going to visit my grandparents in their village. We are going to drive there. The journey will probably take six hours because there is always a lot of traffic. We are going to stay for a week. I'm going to help my grandma make dumplings, and my grandpa is going to show me his new chickens. On New Year's Eve, we will watch the fireworks together.",
  },
  {
    task: "Write about a school trip you are going to take.",
    model:
      "Next Friday our class is going to visit the history museum in the city center. We are going to go there by subway with our teacher. The trip will take about forty minutes. At the museum, a guide is going to show us some old statues and coins. After that, we are going to have a picnic in the park. I'm going to take my camera, and I will take lots of photos.",
  },
  {
    task: "Write about a trip to the mountains you are going to take.",
    model:
      "This winter my family is going to go skiing in the mountains in the north. We are going to take a night train on December 28th. We are going to stay in a small wooden hotel for five days. Every day we are going to ski in the morning. My dad is going to teach me, and I will probably fall a lot! In the evenings we are going to sit by the fire and play board games.",
  },
  {
    task: "Write about a boat trip you are going to take.",
    model:
      "On Sunday I'm going to take a ferry to an island with my friend Lisa and her parents. We are going to meet at the port at eight o'clock. The ferry trip is about an hour long. On the island, we are going to walk along the coast and look for a famous cave. Lisa's dad says we will probably see some dolphins from the boat. We are going to come back in the evening.",
  },
  {
    task: "Write about a summer camp you are going to go to.",
    model:
      "This July I'm going to go to a summer camp by a lake. The camp starts on July 15th, and it is two weeks long. My parents are going to drive me there. At the camp, I'm going to learn to sail a boat and to climb. I'm going to share a room with three other children. I think I'll make some new friends. I'm going to call my parents every Sunday.",
  },
  {
    task: "Write about a trip to see a famous place in your country.",
    model:
      "During the October holiday, my family is going to visit the Great Wall. We are going to go there by car, and we are going to leave very early to miss the traffic. First we are going to walk up to the top of a tower and look at the view. Then we are going to have lunch in a village near the wall. It will probably be crowded, but I don't mind.",
  },
  {
    task: "Write about a trip you are going to take with your friends.",
    model:
      "Next Saturday my friends and I are going to ride our bikes to a lake outside the town. We are going to meet in front of the school at nine. It will take about an hour to get there. At the lake, we are going to have a picnic and swim. Tom is going to bring sandwiches, and I'm going to bring fruit and water. We will come home before dark.",
  },
  {
    task: "Write about a trip you dream of taking someday.",
    model:
      "Someday I'm going to travel around the world. First I'm going to fly to Egypt to see the pyramids and the desert. Then I'm going to take a ship across the ocean to South America. In Peru, I'm going to climb to Machu Picchu. I will probably need a lot of money, so I'm going to save every month. I think it will be the best journey of my life.",
  },
];

const writingAboutFuturePlans = judgedTopic({
  id: "writing-about-future-plans",
  title: t("Writing About Plans", "写计划"),
  summary: t(
    "Write six to eight sentences about a trip you are going to take: where, when, how and what you will do there.",
    "写六到八句话，讲一次你将要去的旅行：去哪里、什么时候、怎么去、在那里做什么。",
  ),
  intro: t(
    "A clear travel plan blends settled arrangements (*We are going to take the morning train to Hangzhou*) with predictions (*I think it will be warm*). Covering where, when, how and what makes the plan complete.",
    "清晰的旅行计划会把定好的安排（*We are going to take the morning train to Hangzhou*）和预测（*I think it will be warm*）自然结合起来。写全地点、时间、交通和活动，计划就完整了。",
  ),
  prerequisites: ["be-going-to", "writing-a-postcard"],
  encompasses: [
    { topic: "be-going-to", weight: 0.3 },
    { topic: "writing-a-postcard", weight: 0.2 },
  ],
  criteria: ["a2-future-forms", "a2-trip-details", "a1-sentences"],
  point: {
    id: "plans",
    title: t("Where, when, how and what", "去哪里、什么时候、怎么去、做什么"),
    explanation: t(
      "Talk about the future with *going to* for your plans and *will* for what you think will happen:\n\n- Where and when: *Next month we are going to visit Sanya.*\n- How: *We are going to fly there.*\n- What you will do: *We are going to swim every day. We will probably visit an island.*\n\n> **Watch out.** Do not use the present simple for future plans (*Next month we visit Sanya* is wrong—use *are going to visit* or *will visit*).",
      "用 *going to* 说计划，用 *will* 说你认为会发生的事：\n\n- 去哪里、什么时候：*Next month we are going to visit Sanya.*\n- 怎么去：*We are going to fly there.*\n- 要做什么：*We are going to swim every day. We will probably visit an island.*\n\n> **注意。** 不要把将来的计划写成一般现在时（*Next month we visit Sanya* 是错的，要用 *are going to visit* 或 *will visit*）。",
    ),
  },
  question: t(
    "Write six to eight sentences in English about the trip the task names: where, when, how and what you will do there.",
    "根据题目用英语写六到八句话：去哪里、什么时候、怎么去、在那里做什么。",
  ),
  bank: plansBank,
  limits: { minWords: 45, maxChars: 900 },
  what: t("plan", "计划"),
});

/** topics are the topics of the unit Travel and Holidays. */
export const topics: readonly TopicDef[] = [
  holidays.topic,
  placesToVisit.topic,
  transport.topic,
  future.topic,
  beGoingTo,
  willForTheFuture,
  writingAboutFuturePlans,
];

/** vocabulary are the words the unit Travel and Holidays teaches. */
export const vocabulary: readonly WordBatch[] = [holidays.batch, placesToVisit.batch, transport.batch, future.batch];
