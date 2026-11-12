// B1, unit 7: Travel and Culture. Culture, planning a trip, adventure, food and culture, nations and languages, travel
// problems and describing places; the article with things in general and with places; writing a story.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { fill, judgedTopic } from "../a2/kit.ts";
import { everyPair, interleave, vocabularyTopic, word } from "../words.ts";

const culture = vocabularyTopic({
  id: "b1-words-culture",
  title: t("Culture", "文化"),
  summary: t(
    "Culture, customs and beliefs; religion, heritage and ceremonies; foreigners and natives; manners, behavior and respect; accents.",
    "文化、习俗和信念；宗教、遗产和仪式；外国人和本地人；礼貌、行为和尊重；口音。",
  ),
  prerequisites: ["a2-words-festivals"],
  words: [
    word(
      "culture cultures",
      "the way of life, customs and ideas of a group of people",
      "文化",
      "I love learning about Japanese {culture}.|foreigner native | Music is an important part of Irish {culture}.|foreigner accent | When you live abroad, you learn a lot about other {cultures}.|native respected",
      "nature country",
    ),
    word(
      "custom customs",
      "something that the people of a place have done in the same way for a long time",
      "习俗；风俗",
      "It is a {custom} in China to give red envelopes at New Year.|heritage religion | Shaking hands is a Western {custom}.|accent foreigner | The {custom} of drinking tea goes back thousands of years.|accent foreigner",
      "costume uniform",
    ),
    word(
      "belief beliefs",
      "an idea that you feel sure is true",
      "信念；信仰",
      "People of different {beliefs} live together in this city.|ceremonies foreigners | It is my {belief} that everyone deserves a second chance.|custom accent | She has a strong {belief} in hard work.|accent heritage",
      "believe brief",
    ),
    word(
      "religion religions",
      "believing in a god or gods, and the ways of showing it",
      "宗教",
      "Buddhism is one of the oldest {religions} in the world.|accents foreigners | Christmas is a holiday of the Christian {religion}.|accent manners | In some countries, {religion} is a part of daily life.|foreigner native",
      "region relation",
    ),
    word(
      "heritage",
      "the history, traditions and old buildings that a country has had for a long time",
      "遗产；传统",
      "The old town is part of our national {heritage}.|accent foreigner | These temples are an important part of the country's cultural {heritage}.|accent foreigner | We must protect our {heritage} for our children.|accent foreigner",
      "harvest village",
    ),
    word(
      "ceremony ceremonies",
      "a formal event with special actions or words, such as a wedding",
      "仪式；典礼",
      "The wedding {ceremony} took place in a small church.|custom heritage | There is a {ceremony} every year to remember the soldiers.|heritage belief | The opening {ceremony} of the Olympics was amazing.|heritage behavior",
      "cemetery celebrity",
    ),
    word(
      "foreigner foreigners",
      "a person from another country",
      "外国人",
      "As a {foreigner}, I found the language hard at first.|native heritage | Many {foreigners} come to study in Beijing.|customs beliefs | The shopkeeper was very friendly to {foreigners}.|customs beliefs",
      "stranger neighbor",
    ),
    word(
      "native",
      "born in a place, or belonging to it naturally",
      "本地的；本土的；母语的",
      "Chinese is my {native} language.|heritage custom | Our teacher is a {native} speaker of English.|foreigner heritage | Pandas are {native} to China.|foreigner respected",
      "national nature",
    ),
    word(
      "manners",
      "polite ways of behaving with other people",
      "礼貌；规矩",
      "It is bad {manners} to talk with your mouth full.|heritage religion | My grandmother taught me good table {manners}.|beliefs heritage | Where are your {manners}? Say thank you!|heritage religion",
      "matters habits",
    ),
    word(
      "behavior",
      "the way someone acts",
      "行为；举止",
      "The teacher was angry about the students' {behavior}.|heritage religion | Scientists study the {behavior} of animals.|heritage ceremony | His {behavior} at the party was very rude.|heritage religion",
      "behave character",
    ),
    word(
      "respect respects respected respecting",
      "to think well of someone, or to treat people and their ideas politely",
      "尊重；尊敬",
      "You should {respect} the customs of the country you visit.|behavior manners | Everyone {respects} her because she is fair.|cultures manners | Children should show {respect} to older people.|heritage accent",
      "expect inspect",
    ),
    word(
      "accent accents",
      "the way people from a place or a group say words",
      "口音",
      "He speaks English with a French {accent}.|custom heritage | I can't understand his strong {accent}.|heritage ceremony | People from the north speak with different {accents}.|manners respected",
      "access ascent",
    ),
  ],
});

const travel = vocabularyTopic({
  id: "b1-words-travel-2",
  title: t("Planning a Trip", "计划旅行"),
  summary: t(
    "Destinations, accommodation and hostels; reservations and itineraries; backpacks; borders, visas and currency; exchanging money; tours and cruises.",
    "目的地、住宿和青年旅舍；预订和行程；背包；边境、签证和货币；兑换钱；观光和乘船游览。",
  ),
  prerequisites: ["a2-words-holidays"],
  words: [
    word(
      "destination destinations",
      "the place where someone is going",
      "目的地",
      "Paris is a popular tourist {destination}.|currency visa | We reached our {destination} after ten hours on the road.|currency visa | Thailand is one of the top {destinations} for young travelers.|currencies visas",
      "direction distance",
    ),
    word(
      "accommodation",
      "a place to stay or live, such as a hotel room",
      "住宿；住处",
      "The price includes flights and {accommodation}.|currency border | It's hard to find cheap {accommodation} in the city center.|currency itinerary | Is breakfast included in the {accommodation}?|border visa",
      "recommendation accomplishment",
    ),
    word(
      "hostel hostels",
      "a cheap place to stay, often with shared rooms, for travelers",
      "青年旅舍；招待所",
      "We stayed in a {hostel} with eight beds in one room.|visa currency | Youth {hostels} are a cheap way to travel.|visas borders | The {hostel} has a kitchen where guests can cook.|visa border",
      "hotel hospital",
    ),
    word(
      "reservation reservations",
      "an arrangement to keep a room, a table or a seat for you",
      "预订",
      "I'd like to make a {reservation} for two people at eight o'clock.|border currency | Do you have a {reservation}, sir?|border currency | We canceled our {reservations} because of the storm.|borders currencies",
      "receipt permission",
    ),
    word(
      "itinerary itineraries",
      "a plan of a trip, with the places and the times",
      "行程；旅行计划",
      "Our {itinerary} includes three days in Rome.|currency visa | The travel agent sent us a detailed {itinerary}.|currency border | Let's change the {itinerary} and spend more time by the sea.|currency visa",
      "ticket diary",
    ),
    word(
      "backpack backpacks",
      "a bag that you carry on your back",
      "双肩包；背包",
      "I packed everything I needed in one {backpack}.|currency visa | The students carried heavy {backpacks} up the hill.|currencies visas | She put a bottle of water in her {backpack}.|currency border",
      "suitcase pocket",
    ),
    word(
      "border borders",
      "the line between two countries",
      "边境；国界",
      "We crossed the {border} into Mexico.|backpack itinerary | You need a passport to cross the {border}.|backpack accommodation | The town is close to the French {border}.|backpack accommodation",
      "boarder corner",
    ),
    word(
      "visa visas",
      "an official mark in your passport that lets you enter a country",
      "签证",
      "Do I need a {visa} to visit Canada?|hostel border | She applied for a student {visa}.|hostel border | My {visa} runs out next month.|hostel backpack",
      "ticket passport",
    ),
    word(
      "currency currencies",
      "the kind of money a country uses",
      "货币",
      "The {currency} of Japan is the yen.|border visa | You can pay in local {currency} or in dollars.|border hostel | Some {currencies} are worth more than others.|borders hostels",
      "coin current",
    ),
    word(
      "exchange exchanges exchanged exchanging",
      "to give something and get something else for it",
      "交换；兑换",
      "Where can I {exchange} dollars for euros?|reserve book | We {exchanged} phone numbers before we said goodbye.|reserved toured | Can I {exchange} this shirt for a bigger size?|cruise tour",
      "challenge charge",
    ),
    word(
      "tour tours",
      "a trip to see the sights of a place",
      "观光；游览",
      "We went on a {tour} of the old city.|visa currency | The bus {tour} takes two hours.|visa border | The museum offers free {tours} every morning.|visas currencies",
      "tower turn",
    ),
    word(
      "cruise cruises",
      "a holiday on a large ship that visits several places",
      "乘船游览；邮轮旅行",
      "My grandparents went on a {cruise} around the Mediterranean.|visa hostel | The {cruise} ship stopped at five islands.|visa hostel | {Cruises} are popular with older travelers.|Visas Borders",
      "crew flight",
    ),
  ],
});

const adventure = vocabularyTopic({
  id: "b1-words-adventure",
  title: t("Adventure", "探险"),
  summary: t(
    "Adventures and exploring; unforgettable and breathtaking; homesick; translating; guidebooks, landmarks, scenery and routes; admiring and wandering.",
    "探险和探索；难忘的和壮观的；想家的；翻译；旅行指南、地标、风景和路线；欣赏和闲逛。",
  ),
  prerequisites: ["b1-words-travel-2"],
  words: [
    word(
      "adventure adventures",
      "an exciting experience, often a little dangerous",
      "冒险；奇遇",
      "Our trip to the jungle was a real {adventure}.|scenery guidebook | He told us about his {adventures} in Africa.|sceneries routes | Children love stories full of {adventure}.|homesick unforgettable",
      "advantage advertisement",
    ),
    word(
      "explore explores explored exploring",
      "to travel around a place to find out what it is like",
      "探索；探险",
      "We spent the afternoon {exploring} the old town.|translating breathtaking | Let's {explore} the island tomorrow.|translate homesick | Divers {explore} the bottom of the sea.|translate homesick",
      "explain explode",
    ),
    word(
      "unforgettable",
      "so special that you will always remember it",
      "难忘的",
      "Seeing the Great Wall was an {unforgettable} experience.|homesick lively | We had an {unforgettable} night under the stars.|homesick explored | The concert was {unforgettable}.|homesick translated",
      "forgetful unbelievable",
    ),
    word(
      "breathtaking",
      "so beautiful or surprising that it takes your breath away",
      "壮观的；惊人的",
      "The view from the top of the mountain was {breathtaking}.|homesick translated | The dancers gave a {breathtaking} performance.|homesick explored | We drove along a road with {breathtaking} views of the coast.|homesick translated",
      "breathless boring",
      "unforgettable",
    ),
    word(
      "homesick",
      "sad because you are far from home and miss it",
      "想家的",
      "On my first night at university, I felt very {homesick}.|breathtaking unforgettable | She was {homesick} for her mother's cooking.|breathtaking explored | It's normal to get {homesick} when you live abroad.|breathtaking unforgettable",
      "seasick homeless",
    ),
    word(
      "translate translates translated translating",
      "to change words from one language into another",
      "翻译",
      "Can you {translate} this menu into English?|explore admire | The book has been {translated} into thirty languages.|explored wandered | She {translates} letters for a law firm.|explores wanders",
      "transport transfer",
    ),
    word(
      "guidebook guidebooks",
      "a book for travelers about a place",
      "旅行指南",
      "According to the {guidebook}, the museum opens at nine.|scenery route | I bought a {guidebook} to Vietnam before the trip.|scenery landmark | Our {guidebook} recommended a little restaurant by the river.|scenery adventure",
      "notebook textbook",
    ),
    word(
      "landmark landmarks",
      "a famous building or place that is easy to see and recognize",
      "地标",
      "The Eiffel Tower is the most famous {landmark} in Paris.|scenery route | Big Ben is one of London's best-known {landmarks}.|sceneries guidebooks | The tall church is a useful {landmark} if you get lost.|scenery adventure",
      "landscape bookmark",
    ),
    word(
      "scenery",
      "the natural things you see in a place, such as hills, trees and rivers",
      "风景；景色",
      "The {scenery} in the mountains is wonderful.|landmark route | We stopped the car to enjoy the {scenery}.|route homesick | The train goes through some beautiful {scenery}.|landmark route",
      "scene scenario",
    ),
    word(
      "route routes",
      "the way you go from one place to another",
      "路线",
      "Which is the quickest {route} to the airport?|scenery landmark | We took the long {route} along the coast.|scenery guidebook | This bus {route} goes through the city center.|scenery adventure",
      "root roof",
    ),
    word(
      "admire admires admired admiring",
      "to look at something with pleasure, or to respect someone very much",
      "欣赏；钦佩",
      "We stood on the bridge, {admiring} the view.|translating wandering | I really {admire} people who help others.|translate wander | Everyone {admired} her new painting.|translated wandered",
      "admit advise",
    ),
    word(
      "wander wanders wandered wandering",
      "to walk around slowly without a special plan",
      "闲逛；漫步",
      "We {wandered} through the narrow streets of the old town.|admired translated | I love {wandering} around markets on holiday.|translating admiring | The children {wandered} off and got lost.|admired translated",
      "wonder hurry",
    ),
  ],
});

const food = vocabularyTopic({
  id: "b1-words-food-culture",
  title: t("Food and Culture", "饮食与文化"),
  summary: t(
    "Cuisines, ingredients, flavors and spices; chopsticks, seafood and desserts; menus, tips and bills; serving; appetite.",
    "菜系、食材、味道和香料；筷子、海鲜和甜点；菜单、小费和账单；上菜；胃口。",
  ),
  prerequisites: ["a2-words-cooking"],
  words: [
    word(
      "cuisine cuisines",
      "a style of cooking of a country or a region",
      "菜系；烹饪风格",
      "Sichuan {cuisine} is famous for being hot and spicy.|appetite chopsticks | I love Italian {cuisine}, especially pasta.|appetite chopsticks | The restaurant serves {cuisines} from all over Asia.|appetites tips",
      "kitchen cousin",
    ),
    word(
      "ingredient ingredients",
      "one of the foods that you put together to make a dish",
      "原料；食材",
      "Flour, eggs and milk are the main {ingredients} of pancakes.|appetites tips | You only need four {ingredients} to make this cake.|appetites bills | Fresh {ingredients} make the food taste better.|Appetites Tips",
      "instrument recipe",
    ),
    word(
      "flavor flavors",
      "the taste of a food or a drink",
      "味道；风味",
      "What {flavor} of ice cream would you like?|appetite tip | Lemon gives the fish a fresh {flavor}.|appetite tip | Add some salt to bring out the {flavor}.|appetite bill",
      "favor smell",
    ),
    word(
      "spice spices",
      "a powder or seed from a plant that gives food a strong taste",
      "香料；调味品",
      "Indian food uses a lot of {spices}.|appetites tips | Pepper is the most common {spice} in the world.|appetite tip | This soup needs a little more {spice}.|appetite menu",
      "sauce spicy",
    ),
    word(
      "chopsticks",
      "a pair of thin sticks used for eating, especially in East Asia",
      "筷子",
      "It took me a week to learn to eat with {chopsticks}.|spices desserts | In China, you should never stand your {chopsticks} up in your rice.|spices desserts | Could I have a fork instead of {chopsticks}, please?|spices menus",
      "spoons drumsticks",
    ),
    word(
      "seafood",
      "fish and other animals from the sea that people eat, such as shrimp",
      "海鲜",
      "The town is famous for its fresh {seafood}.|dessert appetite | I'm allergic to {seafood}, so I can't eat shrimp.|dessert appetite | We had a {seafood} dinner by the harbor.|dessert spice",
      "seaweed meat",
    ),
    word(
      "dessert desserts",
      "sweet food that you eat at the end of a meal",
      "甜点",
      "For {dessert}, we had chocolate cake.|seafood appetite | Would you like to see the {dessert} menu?|appetite tip | French bakeries make wonderful {desserts}.|appetites tips",
      "desert starter",
    ),
    word(
      "menu menus",
      "a list of the food you can order in a restaurant",
      "菜单",
      "Can we see the {menu}, please?|appetite flavor | There are no vegetarian dishes on the {menu}.|appetite bill | Prices on the {menu} include tax.|appetite flavor",
      "recipe receipt",
    ),
    word(
      "tip tips",
      "extra money you give to a waiter or a driver to thank them",
      "小费",
      "In the US, people usually leave a {tip} of fifteen to twenty percent.|menu flavor | We gave the taxi driver a big {tip}.|menu flavor | In Japan, {tips} are not expected.|menus spices",
      "fee change",
    ),
    word(
      "bill bills",
      "a piece of paper that shows how much you must pay for a meal or a service",
      "账单",
      "Could we have the {bill}, please?|menu tip | My dad always pays the {bill} when we eat out.|menu flavor | The {bill} for the dinner was over a hundred dollars.|menu flavor",
      "ticket bell",
    ),
    word(
      "serve serves served serving",
      "to give food or drinks to people at a meal",
      "上菜；供应",
      "Breakfast is {served} from seven to ten.|tipped flavored | The waiter {served} us quickly.|tipped spiced | This café {serves} the best coffee in town.|tips menus",
      "save order",
    ),
    word(
      "appetite appetites",
      "the feeling that you want to eat",
      "胃口；食欲",
      "Swimming always gives me a big {appetite}.|cuisine flavor | When I'm ill, I lose my {appetite}.|cuisine menu | Don't eat cookies now, or you'll spoil your {appetite}.|cuisine menu",
      "appetizer attitude",
    ),
  ],
});

const nations = vocabularyTopic({
  id: "b1-words-nations",
  title: t("Nations and Languages", "国家与语言"),
  summary: t(
    "Nations, citizens and populations; capitals, continents and regions; foreign, bilingual and fluent; dialects and nationality; immigrants.",
    "国家、公民和人口；首都、大洲和地区；外国的、双语的和流利的；方言和国籍；移民。",
  ),
  prerequisites: ["b1-words-culture"],
  words: [
    word(
      "nation nations",
      "a country and the people who live in it",
      "国家；民族",
      "The whole {nation} watched the final on TV.|dialect nationality | The United {Nations} was set up in 1945.|Regions Dialects | Leaders from many {nations} met in Geneva.|dialects populations",
      "nature station",
    ),
    word(
      "citizen citizens",
      "a person who belongs to a country and has rights there",
      "公民",
      "She was born in Spain, but she is a French {citizen}.|nationality population | Every {citizen} has the right to vote.|nationality region | The city asked its {citizens} to save water.|nationalities populations",
      "city cousin",
    ),
    word(
      "population populations",
      "the number of people who live in a place",
      "人口",
      "China has a {population} of over 1.4 billion.|nation citizen | The {population} of the town has doubled in ten years.|citizen dialect | Many countries have aging {populations}.|citizens dialects",
      "popularity pollution",
    ),
    word(
      "capital capitals",
      "the city where a country's government is",
      "首都",
      "Canberra is the {capital} of Australia.|continent region | Rome is one of the oldest {capitals} in Europe.|continents dialects | We spent two days in the {capital} before going north.|dialect nationality",
      "village county",
    ),
    word(
      "continent continents",
      "one of the very large areas of land in the world, such as Africa or Asia",
      "大洲；大陆",
      "Asia is the largest {continent}.|capital nation | There are seven {continents} on Earth.|capitals regions | Africa is a {continent} of more than fifty countries.|capital dialect",
      "content country",
    ),
    word(
      "region regions",
      "a large area of a country or of the world",
      "地区；区域",
      "This {region} is famous for its wine.|nationality population | It rains a lot in the northern {regions} of the country.|continents capitals | Snow is common in this {region} in winter.|dialect nationality",
      "religion reason",
    ),
    word(
      "foreign",
      "from or in another country",
      "外国的",
      "Can you speak a {foreign} language?|fluent bilingual | I've never lived in a {foreign} country.|fluent bilingual | I always exchange money before I travel to a {foreign} country.|fluent bilingual",
      "forward strange",
    ),
    word(
      "bilingual",
      "able to speak two languages very well",
      "双语的",
      "Their children are {bilingual} in English and Chinese.|foreign native | She grew up in a {bilingual} family.|fluent foreigner | The museum signs are {bilingual}, so tourists can read them.|fluent homesick",
      "biological double",
      "fluent",
    ),
    word(
      "fluent",
      "able to speak a language easily and well",
      "流利的",
      "He is {fluent} in three languages.|foreign bilingual | After a year in Madrid, her Spanish was {fluent}.|foreign native | You don't need to be {fluent} to enjoy the trip.|foreign dialect",
      "fluid frequent",
      "bilingual",
    ),
    word(
      "dialect dialects",
      "a form of a language spoken in one area",
      "方言",
      "Cantonese is spoken in Guangdong, but every village has its own {dialect}.|nation nationality | My grandparents speak a local {dialect} that I don't understand.|nation population | There are many {dialects} of Arabic.|nations populations",
      "dialogue accent",
    ),
    word(
      "nationality nationalities",
      "the country that a person legally belongs to",
      "国籍",
      "What {nationality} is your new teacher?|continent dialect | Please write your name and {nationality} on the form.|continent population | People of twenty {nationalities} work at our company.|continents populations",
      "nation personality",
    ),
    word(
      "immigrant immigrants",
      "a person who comes to live in a country from another country",
      "移民",
      "His parents were {immigrants} from Italy.|capitals continents | Many {immigrants} work hard to learn the new language.|capitals continents | New York was built by {immigrants} from all over the world.|capitals continents",
      "tourist native",
    ),
  ],
});

const problems = vocabularyTopic({
  id: "b1-words-travel-problems",
  title: t("Travel Problems", "旅途中的问题"),
  summary: t(
    "Canceling; queues and lines; stuck; strikes; check-in, departures and arrivals; baggage, terminals and boarding; jets.",
    "取消；队伍和排队；被困的；罢工；登机手续、出发和到达；行李、航站楼和登机；喷气式飞机。",
  ),
  prerequisites: ["a2-words-transport"],
  words: [
    word(
      "cancel cancels canceled canceling",
      "to decide that something planned will not happen",
      "取消",
      "Our flight was {canceled} because of the snow.|boarded stuck | We had to {cancel} the trip when my mother got ill.|board queue | If you {cancel} less than a day before, you can't get your money back.|board queue",
      "cancer close",
    ),
    word(
      "queue queues",
      "a line of people waiting for something",
      "队伍；排队",
      "There was a long {queue} at passport control.|terminal departure | Please wait in the {queue} like everyone else.|baggage jet | The {queues} at the airport were terrible this morning.|jets arrivals",
      "crowd group",
      "line",
    ),
    word(
      "stuck",
      "not able to move or to leave a place",
      "被困住的；卡住的",
      "We were {stuck} in traffic for two hours.|boarding canceled | The plane was late, so we were {stuck} at the airport all night.|boarding departure | The door is {stuck}. I can't open it.|boarding arrival",
      "stopped struck",
    ),
    word(
      "strike strikes",
      "a time when workers stop working because they want better pay or conditions",
      "罢工",
      "The train drivers are on {strike} today.|queue baggage | Hundreds of flights were canceled because of the {strike}.|baggage terminal | There have been three {strikes} at the airport this year.|terminals queues",
      "storm stroke",
    ),
    word(
      "line lines",
      "a row of people or things, one behind another",
      "队伍；行",
      "We stood in {line} for an hour to buy tickets.|baggage arrival | There's a long {line} outside the new restaurant.|baggage boarding | Please form two {lines}: one for adults and one for children.|jets baggage",
      "lane wire",
      "queue",
    ),
    word(
      "check-in check-ins",
      "the place or the moment where you show your ticket at an airport or a hotel",
      "登机手续；入住登记",
      "{Check-in} closes forty minutes before the flight.|Baggage Strike | We went straight to the {check-in} desk.|strike queue | Online {check-in} saves a lot of time.|strike jet",
      "checkout check-up",
    ),
    word(
      "departure departures",
      "leaving a place, especially on a plane, a train or a bus",
      "离开；出发",
      "Please arrive two hours before {departure}.|baggage arrival | Look at the {departures} board to find your gate.|baggages strikes | The {departure} of the train was delayed.|baggage line",
      "department arrival",
    ),
    word(
      "arrival arrivals",
      "reaching a place at the end of a trip",
      "到达；抵达",
      "On {arrival}, please show your passport.|baggage stuck | I'll meet you in the {arrivals} hall.|strikes queues | The {arrival} of the flight was delayed by an hour.|baggage line",
      "survival departure",
    ),
    word(
      "baggage",
      "the bags and suitcases you take on a trip",
      "行李",
      "Each passenger may take one piece of {baggage} on the plane.|queue terminal | We waited forty minutes to collect our {baggage}.|queue strike | Don't leave your {baggage} alone in the station.|arrival strike",
      "package garbage",
    ),
    word(
      "terminal terminals",
      "a building at an airport where passengers start or end a flight",
      "航站楼；终点站",
      "Our flight leaves from {Terminal} 2.|Baggage Boarding | The airport has three {terminals}.|baggages lines | A free train runs between the {terminals}.|baggages boarding",
      "gate tunnel",
    ),
    word(
      "boarding",
      "getting onto a plane, a ship or a train",
      "登机；上船；上车",
      "{Boarding} starts thirty minutes before the plane leaves.|Baggage Stuck | Show your {boarding} pass at the gate.|baggage stuck | The captain announced that {boarding} was complete.|baggage stuck",
      "boarder landing",
    ),
    word(
      "jet jets",
      "a fast plane with engines that push it forward",
      "喷气式飞机",
      "A {jet} flew low over the city.|queue strike | Private {jets} are very expensive to fly.|queues strikes | After the long flight, I had terrible {jet} lag.|queue strike",
      "net helicopter",
    ),
  ],
});

const places = vocabularyTopic({
  id: "b1-words-describing-places-2",
  title: t("Adjectives for Places", "描述地方的形容词"),
  summary: t(
    "Ancient and medieval; magnificent, spectacular and picturesque; lively and charming; industrial and isolated; coastal, tropical and vast.",
    "古代的和中世纪的；宏伟的、壮观的和风景如画的；热闹的和迷人的；工业的和偏僻的；沿海的、热带的和广阔的。",
  ),
  prerequisites: ["a2-words-describing-places"],
  words: [
    word(
      "ancient",
      "very old; from a time thousands of years ago",
      "古代的；古老的",
      "The museum has a collection of {ancient} Egyptian art.|coastal tropical | Some of these {ancient} trees are two thousand years old.|industrial lively | The {ancient} Greeks built many temples.|tropical coastal",
      "modern recent",
      "medieval",
    ),
    word(
      "medieval",
      "from the period between about 500 and 1500 in Europe",
      "中世纪的",
      "We walked around the {medieval} castle.|tropical industrial | The town still has its {medieval} walls.|tropical lively | Life in {medieval} times was hard for most people.|tropical vast",
      "modern magical",
      "ancient",
    ),
    word(
      "magnificent",
      "very beautiful and impressive",
      "宏伟的；壮丽的",
      "The palace was {magnificent}, with gold everywhere.|isolated industrial | We had a {magnificent} view of the lake from our room.|isolated industrial | The cathedral is a {magnificent} building.|tropical isolated",
      "magnetic ordinary",
      "spectacular picturesque",
    ),
    word(
      "spectacular",
      "very exciting to look at",
      "壮观的；惊人的",
      "The fireworks were {spectacular}.|isolated medieval | There are {spectacular} waterfalls in this park.|industrial medieval | The team won with a {spectacular} goal.|isolated coastal",
      "spectator ordinary",
      "magnificent",
    ),
    word(
      "picturesque",
      "pretty, like a picture",
      "风景如画的",
      "We stayed in a {picturesque} village by a lake.|industrial vast | The old harbor is very {picturesque}.|vast homesick | It's a {picturesque} little town with narrow streets.|industrial vast",
      "ugly plain",
      "charming magnificent",
    ),
    word(
      "lively",
      "full of life, people and activity",
      "热闹的；活跃的",
      "The market is {lively} and colorful.|isolated homesick | We stayed in a {lively} area full of bars and cafés.|isolated vast | The streets are {lively} until late at night.|isolated ancient",
      "lonely lovely",
    ),
    word(
      "charming",
      "pleasant and attractive",
      "迷人的；可爱的",
      "We found a {charming} little hotel near the old town.|industrial vast | The village is {charming}, with flowers on every window.|industrial vast | Our guide was a {charming} old man who told funny stories.|industrial tropical",
      "charging boring",
      "picturesque",
    ),
    word(
      "industrial",
      "having many factories",
      "工业的",
      "Manchester was an important {industrial} city.|tropical homesick | The river is polluted by {industrial} waste.|picturesque charming | The town has changed from {industrial} to modern and green.|tropical homesick",
      "industrious natural",
    ),
    word(
      "isolated",
      "far away from other places or people",
      "偏僻的；孤立的",
      "They live on an {isolated} farm in the mountains.|lively charming | The island is very {isolated}; the boat comes once a week.|lively industrial | Old people can feel {isolated} if they live alone.|lively coastal",
      "crowded included",
    ),
    word(
      "coastal",
      "on or near the sea",
      "沿海的",
      "Qingdao is a {coastal} city in the east of China.|isolated medieval | {Coastal} areas often have strong winds.|Medieval Ancient | The {coastal} road has wonderful views of the sea.|medieval ancient",
      "central costly",
    ),
    word(
      "tropical",
      "from or in the hottest parts of the world",
      "热带的",
      "Bananas and mangoes are {tropical} fruits.|medieval industrial | The island has a {tropical} climate.|medieval industrial | We saw colorful birds in the {tropical} forest.|medieval industrial",
      "topical typical",
    ),
    word(
      "vast",
      "very large",
      "巨大的；辽阔的",
      "The Sahara is a {vast} desert.|charming lively | A {vast} crowd watched the parade.|picturesque charming | Russia is a {vast} country.|charming picturesque",
      "fast tiny",
    ),
  ],
});

// The article with things in general, with particular things, and with places.

/** generalPairs are a noun said in general and the same noun with the, said of particular things, each with its sentence. */
const handGeneralPairs: readonly (readonly [string, string, string, string])[] = [
  ["tea", "___ is popular in China.", "the tea", "___ in this cup is cold."],
  ["cats", "___ sleep for about fifteen hours a day.", "the cats", "Both of ___ next door are black."],
  ["music", "I love ___. It makes me happy.", "the music", "I love ___ of this film."],
  ["money", "___ can't buy happiness.", "the money", "___ in my wallet is all I have."],
  ["children", "___ need plenty of sleep.", "the children", "Two of ___ in my class are twins."],
  ["coffee", "Many people drink ___ in the morning.", "the coffee", "___ you made this morning was delicious."],
  ["history", "___ is my favorite subject.", "the history", "___ of this city is very interesting."],
  ["books", "I enjoy reading ___ about space.", "the books", "___ on that shelf are mine."],
  ["dogs", "___ are loyal animals.", "the dogs", "Both of ___ in our street bark all night."],
  ["rice", "In the south of China, people eat ___ every day.", "the rice", "Some of ___ in this bowl is still hot."],
  ["people", "___ often feel tired in winter.", "the people", "Most of ___ at the party were my mother's friends."],
  ["water", "Plants need ___ to grow.", "the water", "___ in this river is very clean."],
  ["sugar", "___ is bad for your teeth.", "the sugar", "Where did you put ___ I bought?"],
  ["cars", "My little brother loves ___.", "the cars", "Two of ___ in the car park are white."],
  ["life", "___ is too short to be unhappy.", "the life", "___ of a farmer was hard a hundred years ago."],
  ["art", "She is interested in modern ___.", "the art", "Most of ___ in the new gallery is modern."],
  ["milk", "___ is good for your bones.", "the milk", "Who drank all of ___ I bought?"],
  ["vegetables", "Doctors say we should eat more ___.", "the vegetables", "Some of ___ we bought were bad."],
  ["football", "___ is the most popular sport in the world.", "the football", "___ we bought yesterday is already flat."],
  ["teachers", "Good ___ make learning fun.", "the teachers", "Most of ___ at my school know my name."],
  ["bread", "___ is cheap in this country.", "the bread", "___ we bought this morning is already dry."],
  ["fruit", "___ is good for you.", "the fruit", "All of ___ in this bowl is from our garden."],
  ["exercise", "___ keeps you healthy.", "the exercises", "Some of ___ on page ten are hard."],
  ["animals", "Some ___ sleep all winter.", "the animals", "One of ___ at the farm was a baby goat."],
];

/** foodNouns and thingNouns are an uncountable and a plural noun, crossed with sentences about them in general and in particular. */
const foodNouns = ["tea", "coffee", "milk", "rice", "bread", "cheese", "chocolate", "juice", "soup", "honey"] as const;
const foodFrames: readonly (readonly [string, string])[] = [
  ["___ is popular in many countries.", "___ on the table is for you."],
  ["My grandfather loves ___.", "Who finished ___ I bought?"],
  ["I don't like ___ very much.", "___ we had at lunch was delicious."],
  ["Many children like ___.", "I put ___ from the market in the kitchen."],
];
const thingNouns = ["books", "cats", "dogs", "flowers", "apples", "cars", "phones", "songs", "games", "films"] as const;
const thingFrames: readonly (readonly [string, string])[] = [
  ["I really like ___.", "___ on the table are mine."],
  ["My brother is interested in ___.", "Where are ___ I bought yesterday?"],
  ["Some people don't like ___.", "Most of ___ in this shop are new."],
  ["My aunt has always loved ___.", "I gave away ___ we didn't need."],
];

/** generalPairs are the hand-written pairs and a pair for every noun with every pair of sentences. */
const generalPairs: readonly (readonly [string, string, string, string])[] = [
  ...handGeneralPairs,
  ...[...everyPair(foodNouns, foodFrames), ...everyPair(thingNouns, thingFrames)].map(
    ([noun, [general, particular]]) => [noun, general, `the ${noun}`, particular] as const,
  ),
];

const capitalFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
/** atStartOf capitalizes words that fill a gap at the start of a sentence. */
const atStartOf = (sentence: string) => (s: string) => (sentence.startsWith("___") ? capitalFirst(s) : s);
/** aOf is a or an before a word. */
const aOf = (w: string) => (/^[aeiou]/u.test(w) ? `an ${w}` : `a ${w}`);

/** generalChoice are items of the and no article, in general and of particular things. */
const generalChoice: readonly ChoiceItem[] = interleave([
  generalPairs.map(([plain, general]): ChoiceItem => {
    const c = atStartOf(general);
    return [`${general} (in general)`, c(plain), [c(`the ${plain}`), c(aOf(plain))]];
  }),
  generalPairs.map(([, , the, particular]): ChoiceItem => {
    const c = atStartOf(particular);
    const bare = the.replace(/^the /u, "");
    return [particular, c(the), [c(bare), c(aOf(bare))]];
  }),
]);

/** placeItems are sentences with the name of a place, and whether the name takes the. */
const handPlaceItems: readonly (readonly [string, string, boolean])[] = [
  ["We flew to ___ last summer.", "Japan", false],
  ["The longest river in China is ___.", "Yangtze", true],
  ["___ is the capital of France.", "Paris", false],
  ["She swam in ___ on her holiday.", "Mediterranean", true],
  ["My uncle lives in ___.", "Canada", false],
  ["We went skiing in ___.", "Alps", true],
  ["___ is the largest continent.", "Asia", false],
  ["They sailed across ___.", "Atlantic", true],
  ["I've always wanted to visit ___.", "Brazil", false],
  ["___ flows through Egypt.", "Nile", true],
  ["My cousin studies in ___.", "Shanghai", false],
  ["Mount Everest is in ___.", "Himalayas", true],
  ["___ is a city with many old buildings.", "Rome", false],
  ["Her family moved to ___ ten years ago.", "United States", true],
  ["We drove across ___ in a week.", "Australia", false],
  ["The camels walked across ___.", "Sahara", true],
  ["___ has a lot of beautiful lakes.", "Finland", false],
  ["London is the capital of ___.", "United Kingdom", true],
  ["Many lions live in ___.", "Africa", false],
  ["We took a boat trip on ___ in London.", "Thames", true],
  ["He climbed ___ last year.", "Mount Fuji", false],
  ["Amsterdam is in ___.", "Netherlands", true],
  ["___ is in the north of Italy.", "Milan", false],
  ["Manila is the capital of ___.", "Philippines", true],
  ["Tourists love the shops on ___.", "Oxford Street", false],
  ["___ is the biggest ocean in the world.", "Pacific", true],
  ["We spent a week in ___.", "Egypt", false],
  ["We took a boat down ___ through the rainforest.", "Amazon", true],
  ["My pen friend lives in ___.", "Mexico", false],
  ["They walked along ___ for three days.", "Great Wall", true],
  ["___ is a big country in South America.", "Argentina", false],
  ["Llamas live high in ___.", "Andes", true],
];

/** travelFrames, riverFrames and rangeFrames are sentences for the names of countries and cities, rivers, and mountain ranges. */
const travelFrames = [
  "We flew to ___ last summer.",
  "My uncle lives in ___.",
  "I've always wanted to visit ___.",
  "She is going to ___ next month.",
  "They spent a week in ___.",
  "Have you ever been to ___?",
] as const;
const plainPlaces = [
  "Japan",
  "Canada",
  "Brazil",
  "Egypt",
  "Mexico",
  "Finland",
  "Spain",
  "India",
  "Kenya",
  "Paris",
  "Rome",
  "Shanghai",
  "Tokyo",
  "Sydney",
] as const;
const thePlaces = ["United States", "United Kingdom", "Netherlands", "Philippines"] as const;
const riverFrames = [
  "We took a boat trip on ___.",
  "There are many bridges over ___.",
  "___ flows into the sea.",
  "We had a picnic by ___.",
] as const;
const rivers = ["Yangtze", "Nile", "Thames", "Amazon", "Danube", "Mississippi", "Rhine"] as const;
const rangeFrames = ["We went skiing in ___.", "They went hiking in ___.", "There is snow in ___ all year."] as const;
const ranges = ["Alps", "Himalayas", "Andes", "Rockies"] as const;

/** placeItems are the hand-written items and an item for every place with every sentence that fits it. */
const placeItems: readonly (readonly [string, string, boolean])[] = [
  ...handPlaceItems,
  ...everyPair(plainPlaces, travelFrames).map(([name, frame]) => [frame, name, false] as const),
  ...everyPair(thePlaces, travelFrames).map(([name, frame]) => [frame, name, true] as const),
  ...everyPair(rivers, riverFrames).map(([name, frame]) => [frame, name, true] as const),
  ...everyPair(ranges, rangeFrames).map(([name, frame]) => [frame, name, true] as const),
];

const placeChoice: readonly ChoiceItem[] = placeItems.map(([sentence, name, the]): ChoiceItem => {
  const c = atStartOf(sentence);
  const withThe = c(`the ${name}`);
  const withA = c(aOf(name));
  return the ? [sentence, withThe, [name, withA]] : [sentence, name, [withThe, withA]];
});

/** articleTyped are sentences with one wrong article, built from the choices, to write correctly. */
const articleTyped: readonly TypedItem[] = interleave([generalChoice, placeChoice]).map(([shown, right, wrong]): TypedItem => {
  const note = shown.endsWith(" (in general)") ? " (in general)" : "";
  const bare = shown.replace(/ \(in general\)$/u, "");
  const mistake = bare.replace("___", wrong[0] ?? "");
  return { shown: `${mistake}${note}`, accepted: [bare.replace("___", right)], wrong: [mistake] };
});

/** placeKinds name what kind of place each name is, in English and Chinese. */
const placeKinds: Readonly<Record<string, readonly [string, string]>> = {
  Yangtze: ["a river", "河流"],
  Nile: ["a river", "河流"],
  Thames: ["a river", "河流"],
  Amazon: ["a river", "河流"],
  Danube: ["a river", "河流"],
  Mississippi: ["a river", "河流"],
  Rhine: ["a river", "河流"],
  Rockies: ["a mountain range", "山脉"],
  Tokyo: ["a city", "城市"],
  Sydney: ["a city", "城市"],
  Mediterranean: ["a sea", "海"],
  Atlantic: ["an ocean", "大洋"],
  Pacific: ["an ocean", "大洋"],
  Alps: ["a mountain range", "山脉"],
  Himalayas: ["a mountain range", "山脉"],
  Andes: ["a mountain range", "山脉"],
  Sahara: ["a desert", "沙漠"],
  "United States": ["a country with *United* in its name", "名字里有 United 的国家"],
  "United Kingdom": ["a country with *United* in its name", "名字里有 United 的国家"],
  Netherlands: ["a country with a plural name", "名字是复数形式的国家"],
  Philippines: ["a country with a plural name", "名字是复数形式的国家"],
  "Great Wall": ["a famous place that takes *the*", "带 the 的著名地方"],
  Paris: ["a city", "城市"],
  Shanghai: ["a city", "城市"],
  Rome: ["a city", "城市"],
  Milan: ["a city", "城市"],
  Asia: ["a continent", "大洲"],
  Africa: ["a continent", "大洲"],
  "Mount Fuji": ["a single mountain", "单座山峰"],
  "Oxford Street": ["a street", "街道"],
};

/** placeName finds the name of a place in an option, without its article. */
const placeName = (option: string) => option.replace(/^(the|The|an?|An?) /u, "");

/** nounIn is the noun of an option: a name of a place as it is, any other noun in small letters. */
const nounIn = (option: string, shown: string) =>
  placeItems.some(([s]) => s === shown) ? placeName(option) : placeName(option).toLowerCase();

/** articleRule names the rule of the article for the right option in the gap of shown. */
function articleRule(right: string, shown: string): Text {
  const noun = nounIn(right, shown);
  if (shown.endsWith("(in general)"))
    return t(`The sentence is about ${noun} in general, so the noun takes no article`, `句子泛指 ${noun} 这一类事物，所以名词前不加冠词`);
  if (placeItems.some(([s]) => s === shown)) {
    const [en, zh] = placeKinds[noun] ?? ["a country", "国家"];
    return /^the /iu.test(right)
      ? t(`*${noun}* is ${en}, so it takes *the*`, `*${noun}* 是${zh}，所以要加 *the*`)
      : t(`*${noun}* is ${en}, so it takes no article`, `*${noun}* 是${zh}，所以不加冠词`);
  }
  return t(`The sentence tells you which ${noun} it means, so it takes *the*`, `句子说明了是哪些 ${noun}，是特指，所以要加 *the*`);
}

/** articleWhy explains the article in the gap of shown. */
const articleWhy = (right: string, shown: string): Text => {
  const rule = articleRule(right, shown);
  const sentence = fill(shown.replace(/ \(in general\)$/u, ""), right);
  return t(`${rule.en}: ${sentence}`, `${rule["zh-CN"]}：${sentence}`);
};

/** whyNotArticle explains a wrong option with the, a or no article. */
const whyNotArticle = (wrong: string, right: string, shown: string): Text => {
  const rule = articleRule(right, shown);
  const noun = nounIn(right, shown);
  let first: Text;
  if (/^an? /iu.test(wrong))
    first = placeItems.some(([s]) => s === shown)
      ? t("*a* and *an* never go before the name of a place.", "地名前不能用 *a* 或 *an*。")
      : t(
          `*a* and *an* mean just one of something, not ${shown.endsWith("(in general)") ? `${noun} in general` : `the particular ${noun} the sentence tells you about`}.`,
          `*a* 和 *an* 只表示“某一个”，不是${shown.endsWith("(in general)") ? "泛指这一类事物" : "句子说明的那些特定事物"}。`,
        );
  else if (/^the /iu.test(wrong))
    first = shown.endsWith("(in general)")
      ? t(`*${wrong}* would mean particular ${noun}, not ${noun} in general.`, `*${wrong}* 表示特指某些 ${noun}，不是泛指。`)
      : t(`*${noun}* does not take *the*.`, `*${noun}* 前面不加 *the*。`);
  else
    first = placeItems.some(([s]) => s === shown)
      ? t(`*${noun}* cannot go without *the*.`, `*${noun}* 前面不能不加 *the*。`)
      : t(`With no article, *${wrong}* would mean ${noun} in general.`, `不加冠词，*${wrong}* 就成了泛指。`);
  return t(`${first.en} ${rule.en}.`, `${first["zh-CN"]}${rule["zh-CN"]}。`);
};

/** articleFixWhy explains the corrected article in a sentence to write again. */
const articleFixWhy = (right: string, shown: string): Text => {
  const bare = shown.replace(/ \(in general\)$/u, "");
  const item = interleave([generalChoice, placeChoice]).find(
    ([s, r, w]) =>
      bare === s.replace(/ \(in general\)$/u, "").replace("___", w[0] ?? "") &&
      right === s.replace(/ \(in general\)$/u, "").replace("___", r),
  );
  if (!item) return t(right, right);
  const rule = articleRule(item[1], item[0]);
  return t(`${rule.en}: ${right}`, `${rule["zh-CN"]}：${right}`);
};

const articles: TopicDef = {
  id: "articles-in-general-and-specific",
  title: t("The or No Article", "用 the 还是不用冠词"),
  summary: t(
    "Tea is popular in China, but the tea in this cup is cold. Things in general take no article; particular things take the; most countries and cities take none.",
    "Tea is popular in China，但 the tea in this cup is cold。泛指事物不用冠词，特指用 the；大多数国名和城市名前不用冠词。",
  ),
  prerequisites: ["the-article-the", "countable-and-uncountable-nouns"],
  encompasses: [
    { topic: "the-article-the", weight: 0.3 },
    { topic: "countable-and-uncountable-nouns", weight: 0.1 },
  ],
  xp: 25,
  strand: "grammar",
  knowledgePoints: [
    point(
      "general",
      t("Things in general and particular things", "泛指和特指"),
      t(
        "When you talk about a kind of thing **in general**, use a plural noun or an uncountable noun with **no article**:\n\n- *Cats sleep a lot.* (all cats)\n- *Tea is popular in China.* (tea in general)\n\nWhen you mean **particular** things, the ones you can point to or that the sentence tells you about, use *the*:\n\n- *The cats next door are noisy.* (those cats)\n- *The tea in this cup is cold.* (this tea)\n\nWords such as *in this cup*, *next door* or *we bought* often show that you mean particular things. Do not use *a* with an uncountable noun or a plural noun.",
        "泛指**一类事物**时，用复数名词或不可数名词，**不加冠词**：\n\n- *Cats sleep a lot.*（所有的猫）\n- *Tea is popular in China.*（泛指茶）\n\n指**特定的**事物，也就是能指出来的、或者句子里说明了是哪些的事物，用 *the*：\n\n- *The cats next door are noisy.*（隔壁那几只猫）\n- *The tea in this cup is cold.*（这杯茶）\n\n*in this cup*、*next door*、*we bought* 这样的词常常表明是特指。中文没有冠词，“茶很受欢迎”和“这杯茶凉了”都只说“茶”；英语泛指时不能加 the，说成 *The tea is popular in China* 就变成了某一种茶。*a* 不能用在不可数名词或复数名词前。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), generalChoice, articleWhy, whyNotArticle),
    ),
    point(
      "places",
      t("The with names of places", "地名前的 the"),
      t(
        "Most names of places take **no article**: countries (*China, Japan*), cities (*Paris*), continents (*Asia*), streets (*Oxford Street*) and single mountains (*Mount Fuji*).\n\nThese take ***the***:\n\n- rivers, seas and oceans: *the Yangtze, the Mediterranean, the Pacific*\n- mountain ranges and deserts: *the Alps, the Himalayas, the Sahara*\n- countries with *United* or a plural name: *the United States, the United Kingdom, the Netherlands, the Philippines*\n- some famous places: *the Great Wall, the Amazon*",
        "大多数地名前**不加冠词**：国家（*China, Japan*）、城市（*Paris*）、大洲（*Asia*）、街道（*Oxford Street*）和单座山峰（*Mount Fuji*）。\n\n下面这些要加 ***the***：\n\n- 河流、海和大洋：*the Yangtze, the Mediterranean, the Pacific*\n- 山脉和沙漠：*the Alps, the Himalayas, the Sahara*\n- 名字里有 *United* 或是复数形式的国家：*the United States, the United Kingdom, the Netherlands, the Philippines*\n- 一些著名的地方：*the Great Wall, the Amazon*\n\n中文说“长江”“美国”都不需要冠词，英语却要分清哪些地名带 the。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), placeChoice, articleWhy, whyNotArticle),
    ),
    point(
      "correct",
      t("Correcting the article", "改正冠词"),
      t(
        "Each sentence has one mistake with *the*: it is there when the sentence is about things in general or a country or city, or it is missing before particular things or a river, a sea or a mountain range. Write the sentence correctly. *(in general)* tells you that the sentence is about things in general; do not copy it.",
        "每个句子都有一处 *the* 用错了：要么泛指事物、国名或城市名前多了 the，要么特指的事物或河流、海洋、山脉前少了 the。把句子改正写出来。*(in general)* 表示句子是泛指，不要抄写它。",
      ),
      typedGenerator(
        "sentence",
        t("Correct the mistake with the article and write the sentence.", "改正冠词的错误，写出句子。"),
        articleTyped,
        articleFixWhy,
      ),
    ),
  ],
};

// Writing a story.

const storyBank: readonly WritingItem[] = [
  {
    task: 'Write a story that begins with this sentence: "When I opened the door, I couldn\'t believe my eyes."',
    model:
      "When I opened the door, I couldn't believe my eyes. My little apartment, which I had left clean that morning, was full of balloons. There were hundreds of them, red, yellow and blue, and they covered the floor, the sofa and even the kitchen table.\n\nFor a moment I was frightened. Who had been in my home? Then I heard a laugh from behind the sofa. My sister Lin jumped up, followed by five of my friends.\n\n\"Happy birthday!\" they shouted.\n\nI had completely forgotten that it was my birthday. I had been working so hard that week that I hadn't even looked at the calendar. My sister had borrowed my spare key from our mother and had spent the whole afternoon blowing up balloons with my friends.\n\nWe ordered pizza and played music until midnight. Later, when everyone had gone home, I sat on the floor among the balloons and smiled. It was the best birthday I had ever had, and it was one I nearly missed.",
  },
  {
    task: 'Write a story that begins with this sentence: "The train stopped suddenly in the middle of nowhere."',
    model:
      'The train stopped suddenly in the middle of nowhere. Outside, there was nothing but snow and dark trees. The lights flickered, and then they went out.\n\nI was traveling alone to visit my grandmother in the north. It was Christmas Eve, and I had promised to arrive before dinner. Now I wasn\'t sure I would arrive at all.\n\nAfter twenty minutes, a man walked through the carriage with a torch. "A tree has fallen across the line," he explained. "We have to wait for help."\n\nPeople started to complain, but an old woman opposite me opened her bag and took out a box of homemade cookies. She offered them to everyone. Soon a young man was playing the guitar, and the whole carriage was singing.\n\nThree hours later, the train finally started moving again. When I reached my grandmother\'s house, it was nearly midnight, and dinner was cold. But I told her all about the strangers who had become friends in the dark, and she said it was the best Christmas story she had heard in years.',
  },
  {
    task: 'Write a story that begins with this sentence: "It was the last day of the holiday, and it was raining."',
    model:
      "It was the last day of the holiday, and it was raining. My brother and I were sitting in our small hotel room by the sea, bored and a little sad. We had planned to go to the beach one last time, but now that was impossible.\n\n\"Let's explore the hotel,\" my brother suggested. We wandered along the old corridors until we found a narrow staircase that went up to the roof. At the top, there was a door with a sign: PRIVATE.\n\nWe knew we shouldn't open it, but we did. Behind the door was a tiny room full of old photographs. They showed the hotel a hundred years ago, with ladies in long dresses and men in hats.\n\nJust then, the owner appeared behind us. We were sure she would be angry. Instead, she smiled and told us the story of every photograph. Her great-grandfather had built the hotel.\n\nWhen we left the next morning, the sun was shining. But I didn't mind about the beach anymore. That rainy afternoon had been the best part of the holiday.",
  },
  {
    task: 'Write a story that begins with this sentence: "Nobody believed me when I said I had seen a wolf."',
    model:
      'Nobody believed me when I said I had seen a wolf. I was twelve, and I was spending the summer at my uncle\'s farm in the mountains.\n\nIt happened one evening while I was walking back from the river. In the trees beside the path, I saw two yellow eyes watching me. Then a large gray animal stepped out, looked at me for a few seconds and disappeared. I ran all the way home.\n\n"It was probably a dog," said my uncle, laughing. My cousins laughed too. For the rest of the week they called me "Wolf Boy."\n\nI was angry, so I decided to prove it. Every evening I went back to the path with my uncle\'s old camera. For six days, I saw nothing.\n\nOn the seventh evening, I was about to go home when I heard a branch break. The wolf was standing on a rock above the river. My hands were shaking, but I took three photographs.\n\nWhen I showed them to my uncle, he stopped laughing. The next week, a man from the national park came to the farm to see the pictures. Nobody called me Wolf Boy again.',
  },
  {
    task: 'Write a story that begins with this sentence: "I found the old letter at the bottom of a box in the attic."',
    model:
      'I found the old letter at the bottom of a box in the attic. The envelope was yellow, and the stamp was from 1965. It was addressed to my grandmother, but it had never been opened.\n\nI took it downstairs and gave it to her. She looked at the handwriting for a long time without saying anything. Then her eyes filled with tears.\n\n"This is from Wei," she said quietly. "He was my best friend at school. His family moved to another city, and we lost touch. I always thought he had forgotten me."\n\nWith shaking hands, she opened the envelope. In the letter, Wei had written his new address and asked her to write back. The letter had arrived while she was away, and somebody had put it in a box and forgotten about it.\n\nThat evening, we searched for Wei\'s name online. To our surprise, we found him. He was eighty years old and lived only two hours away.\n\nA month later, they met in a tea house. They talked for five hours, and they have met every month since then.',
  },
  {
    task: 'Write a story that begins with this sentence: "The phone rang at three o\'clock in the morning."',
    model:
      "The phone rang at three o'clock in the morning. I picked it up, half asleep, and heard my friend Tom's voice. He sounded terrified.\n\n\"I'm lost,\" he said. \"I went for a walk in the hills after dinner, and now it's dark and I can't find the path.\"\n\nI was wide awake at once. Tom was visiting from London and didn't know the area at all. I told him to stay where he was and to describe everything he could see. He said he could hear water and see the lights of a tower far away.\n\nI knew where that was. I got dressed, took a torch and drove to the bottom of the hills. Then I started climbing, shouting his name every few minutes. My phone battery was getting low, and I was beginning to worry.\n\nAt last I heard a voice answering me. Tom was sitting on a rock next to a small stream, cold and tired but safe.\n\nWe walked down together as the sun was coming up. Tom was quiet for a long time. Then he said, \"Next time, I'll buy a map.\"",
  },
  {
    task: 'Write a story that begins with this sentence: "I had never been so nervous in my life."',
    model:
      "I had never been so nervous in my life. In five minutes, I had to walk onto the stage and play the piano in front of six hundred people.\n\nI had practiced the piece every day for a year. My teacher said I was ready. But while I was waiting behind the curtain, my hands started shaking, and I suddenly couldn't remember how the music began.\n\nThen I noticed a little girl standing next to me. She was about eight and was holding a violin. She was going on after me, and she was crying.\n\nI forgot my own fear for a moment. I knelt down and told her a secret my teacher had told me: \"Don't play for the audience. Play for one person you love.\" She stopped crying and nodded.\n\nWhen my name was called, I walked out and looked for my mother in the third row. I played only for her. I made two small mistakes, but nobody seemed to notice, and the applause was loud and long.\n\nAs I came off the stage, the little girl gave me a huge smile. Ten minutes later, she played beautifully.",
  },
  {
    task: 'Write a story that begins with this sentence: "As soon as we got off the bus, I knew something was wrong."',
    model:
      "As soon as we got off the bus, I knew something was wrong. The village square, which was usually full of people and noise, was completely empty. The shops were closed, and nobody was sitting outside the café.\n\nMy friend Sara and I had come for the famous Saturday market. We had traveled for two hours, and now there was no market at all.\n\nWe were walking back to the bus stop, feeling disappointed, when we heard music from behind the church. We followed it and found a narrow street full of flowers. At the end, hundreds of people were dancing in a field.\n\nAn old man explained that it was a wedding. The whole village had been invited, and the market had been canceled for the day. Before we could say anything, he took us by the arm and led us to a long table covered with food.\n\nWe stayed until the evening. We ate, we danced and we even made a speech for the bride and groom in our terrible local dialect. Everyone laughed and clapped.\n\nWe never saw the famous market, but we didn't mind at all.",
  },
  {
    task: 'Write a story that begins with this sentence: "The dog appeared at our door one cold winter evening."',
    model:
      'The dog appeared at our door one cold winter evening. It was small and brown, and it was shaking. It had no collar, and it looked as if it hadn\'t eaten for days.\n\nMy mother didn\'t like dogs. "We can keep it for one night," she said, "and tomorrow we\'ll find its owner."\n\nWe gave the dog some chicken and a blanket by the fire. It ate everything and fell asleep at once. My little brother sat next to it all evening and decided to call it Biscuit.\n\nThe next day, we put up posters all over the town and asked the neighbors. Nobody knew anything about a small brown dog. A week passed, and then another. Every evening, Biscuit waited by the door for my mother to come home from work.\n\nOne evening, I found my mother on the sofa with Biscuit on her lap. She was reading a book and gently stroking his ears. She looked up and saw me smiling.\n\n"Don\'t say anything," she said. But we all knew that Biscuit had found his home.',
  },
  {
    task: 'Write a story that begins with this sentence: "I was halfway up the mountain when the weather changed."',
    model:
      'I was halfway up the mountain when the weather changed. One moment the sky was blue; the next, thick clouds were rolling down from the top, and it started to snow.\n\nI was climbing with my father, who had climbed this mountain many times before. He stopped and looked at the sky. "We\'re going back," he said.\n\nI was disappointed. We had started at five in the morning, and the top was only an hour away. "Please, just one more hour," I begged. But my father shook his head.\n\nWe turned around and walked carefully down the path. Soon we could only see a few meters in front of us. The wind was so strong that we had to hold on to the rocks. My father went first and called back to me every few steps.\n\nIt took us four hours to reach the hut at the bottom. As we were drinking hot tea, a rescue team came in. They told us that two other climbers had been trapped near the top.\n\nLater, I understood that turning back had been the bravest decision of the day.',
  },
  {
    task: 'Write a story that begins with this sentence: "Everyone in the class turned to look at the new student."',
    model:
      "Everyone in the class turned to look at the new student. She was standing at the door with a large bag and a nervous smile. The teacher introduced her as Ana, from Brazil. She had arrived in our city only three days before.\n\nAna sat next to me because it was the only empty seat. During the first lesson, she didn't say a word. At lunch, she sat alone and ate her sandwich while she looked at her phone.\n\nI remembered my own first day at the school, two years earlier, when nobody had talked to me. So I took my tray and sat down opposite her. \"Do you like football?\" I asked. It was the only thing I could think of.\n\nHer face lit up. It turned out that she had played for a girls' team in São Paulo. That afternoon, she joined our game in the yard, and she scored three goals.\n\nBy the end of the week, everyone wanted to sit next to Ana. But she still sat next to me, and today she is my best friend.",
  },
  {
    task: 'Write a story that begins with this sentence: "I had only been in the city for an hour when I lost my bag."',
    model:
      "I had only been in the city for an hour when I lost my bag. I had put it down on a bench while I was taking a photo of the river, and when I turned around, it was gone. My passport, my money and my phone were all inside.\n\nI felt sick. I didn't speak the language, and I didn't know anyone. I sat down on the bench and tried not to cry.\n\nAfter a few minutes, an old woman who was selling flowers nearby came over. She didn't speak English, but she could see that something was wrong. Using her hands, she asked me to follow her.\n\nShe took me to a small police station around the corner. To my surprise, a police officer was sitting at the desk with my bag in front of him. A boy had found it and brought it in only ten minutes earlier. Nothing was missing.\n\nI wanted to thank the old woman, but when I turned around, she had already gone back to her flowers. The next morning, I went to her stall and bought the biggest bunch she had.",
  },
];

const writingAStory = judgedTopic({
  id: "writing-a-story",
  title: t("Writing a Story", "写故事"),
  summary: t(
    "Write a story of 150 to 200 words from a first line the task gives, with a beginning, a problem and an ending, in the past tenses.",
    "根据任务给出的第一句写一个 150 到 200 词的故事：有开头、有问题、有结尾，用过去的时态。",
  ),
  prerequisites: ["writing-about-a-past-event", "past-continuous"],
  encompasses: [
    { topic: "writing-about-a-past-event", weight: 0.3 },
    { topic: "past-continuous", weight: 0.1 },
  ],
  criteria: ["b1-story-shape", "b1-story-past-tenses", "b1-story-details"],
  point: {
    id: "story",
    title: t("Beginning, problem and ending", "开头、问题和结尾"),
    explanation: t(
      "A good short story has a shape:\n\n- **A beginning** that starts from the first line you are given and tells the reader who, where and when.\n- **A problem** or a surprise in the middle: something goes wrong or something unexpected happens.\n- **An ending** that tells how the problem was solved or what the people learned.\n\nTell the story in the **past**: the past simple for the main events (*I opened the door*), the past continuous for the background (*It was raining*), and the past perfect for something earlier (*I had left my key at home*). Make it come alive with details: what people saw and felt, and a line or two of what they said, in quotation marks.",
      "一个好的短故事要有结构：\n\n- **开头**：从给出的第一句接着写，交代人物、地点和时间。\n- **中间有问题**或意外：出了差错，或者发生了没想到的事。\n- **结尾**：说明问题怎样解决了，或者人物明白了什么。\n\n故事用**过去的时态**讲：主要事件用一般过去时（*I opened the door*），背景用过去进行时（*It was raining*），更早发生的事用过去完成时（*I had left my key at home*）。中文讲故事常用“了”“过”或者不变动词，英语却每个动词都要选对时态，并且不要中途跳到现在时。加上细节让故事生动：人物看到什么、有什么感受，再加一两句用引号写出的对话。",
    ),
  },
  question: t(
    "Read the task. Write a story of 150 to 200 words in English that begins with the sentence given, with a beginning, a problem and an ending, told in the past.",
    "阅读任务，用英语写一个 150 到 200 词的故事：以给出的句子开头，有开头、问题和结尾，用过去的时态讲述。",
  ),
  bank: storyBank,
  limits: { minWords: 120, maxChars: 1800 },
  what: t("story", "故事"),
});

/** topics are the topics of the unit Travel and Culture. */
export const topics: readonly TopicDef[] = [
  culture.topic,
  travel.topic,
  adventure.topic,
  food.topic,
  nations.topic,
  problems.topic,
  places.topic,
  articles,
  writingAStory,
];

/** vocabulary are the words the unit Travel and Culture teaches. */
export const vocabulary: readonly WordBatch[] = [
  culture.batch,
  travel.batch,
  adventure.batch,
  food.batch,
  nations.batch,
  problems.batch,
  places.batch,
];
