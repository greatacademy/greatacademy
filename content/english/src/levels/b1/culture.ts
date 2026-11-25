// B1, unit 7: Travel and Culture. Culture, planning a trip, adventure, food and culture, nations and languages, travel
// problems and describing places; the article with things in general and with places; writing a story.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { fill, judgedTopic } from "../a2/kit.ts";
import { everyPair, interleave, vocabularyTopic, word } from "../words.ts";
import { articlesInGeneralAndSpecificCorrectNot } from "./mistakes.ts";

const culture = vocabularyTopic({
  id: "b1-words-culture",
  title: t("Culture", "文化"),
  summary: t(
    "Culture, customs and beliefs; religion, heritage and ceremonies; foreigners and natives; manners, behavior and respect; accents.",
    "文化、习俗和信念；宗教、遗产和仪式；外国人和本地人；礼貌、行为和尊重；口音。",
  ),
  intro: t(
    "At the tea **ceremony**, our guide explained an old **custom**, and even with her strong **accent** we understood: every **foreigner** should **respect** the hosts by bowing. These words help you talk about how groups of people live, think and behave.",
    "在茶 **ceremony**（仪式）上，导游讲解了一个古老的 **custom**（习俗）；虽然她 **accent**（口音）很重，我们还是听懂了：每个 **foreigner**（外国人）都应该鞠躬，以 **respect**（尊重）主人。这些词帮你谈论不同群体的生活、想法和举止。",
  ),
  prerequisites: ["a2-words-festivals"],
  words: [
    word(
      "culture cultures",
      "the way of life, customs and ideas of a group of people",
      "文化",
      "I love learning about Japanese {culture}: the food, the art, the festivals and the way people live. | Music, dance and storytelling are all important parts of Irish {culture}. | When you live abroad, you learn a lot about other {cultures}: how people eat, think, dress and celebrate.|customs accents",
      "custom accent",
    ),
    word(
      "custom customs",
      "something that the people of a place have done in the same way for a long time",
      "习俗；风俗",
      "It is a {custom} in China to give red envelopes at New Year. | Shaking hands is a Western {custom}. | The {custom} of drinking tea goes back thousands of years.",
      "religion belief",
    ),
    word(
      "belief beliefs",
      "an idea that you feel sure is true",
      "信念；信仰",
      "He holds the {belief} that the Earth is flat, though everyone tells him it isn't. | It is my {belief} that everyone deserves a second chance. | She has a strong {belief} in hard work.",
      "custom religion",
    ),
    word(
      "religion religions",
      "believing in a god or gods, and the ways of showing it",
      "宗教",
      "Buddhism is one of the oldest {religions} in the world, with temples, monks and prayers.|beliefs customs | Christmas is a holiday of the Christian {religion}. | In some countries, {religion} is part of daily life: people pray to God five times a day.",
      "belief custom",
    ),
    word(
      "heritage",
      "the history, traditions and old buildings that a country has had for a long time",
      "遗产；传统",
      "The old town is part of our national {heritage}. | These temples are an important part of the country's cultural {heritage}. | We must protect our {heritage}, the old buildings and traditions of our country, for our children.",
      "custom ceremony",
    ),
    word(
      "ceremony ceremonies",
      "a formal event with special actions or words, such as a wedding",
      "仪式；典礼",
      "The wedding {ceremony} took place in a small church. | There is a {ceremony} every year to remember the soldiers, with speeches and flowers at ten o'clock. | The opening {ceremony} of the Olympics was amazing.",
      "custom heritage",
    ),
    word(
      "foreigner foreigners",
      "a person from another country",
      "外国人",
      "As a {foreigner}, I found the language hard at first. | Many {foreigners} from other countries come to study in Beijing.|natives strangers | The shopkeeper spoke English and was very friendly to {foreigners} visiting from abroad.|natives strangers",
      "native stranger",
    ),
    word(
      "native",
      "born in a place, or belonging to it naturally",
      "本地的；本土的；母语的",
      "Chinese is my {native} language: I've spoken it since I was born. | Our teacher is a {native} speaker of English who grew up in London. | Pandas are {native} to China: they have always lived in its mountains.",
      "foreign religious",
    ),
    word(
      "manners",
      "polite ways of behaving with other people",
      "礼貌；规矩",
      "It is bad {manners} to talk with your mouth full. | My grandmother taught me good table {manners}. | Where are your {manners}? Say thank you!",
      "customs beliefs",
    ),
    word(
      "behavior",
      "the way someone acts",
      "行为；举止",
      "The teacher was angry about the students' {behavior}. | Scientists study the {behavior} of animals: how they act when they are hungry or afraid. | His {behavior} at the party was very rude.",
      "belief custom",
    ),
    word(
      "respect respects respected respecting",
      "to think well of someone, or to treat people and their ideas politely",
      "尊重；尊敬",
      "You should {respect} the customs of the country you visit and follow them politely. | Everyone {respects} her because she is fair.|ignores expects | Children should {respect} older people and speak to them politely.",
      "ignore expect",
    ),
    word(
      "accent accents",
      "the way people from a place or a group say words",
      "口音",
      "He speaks English with a French {accent}. | I can't understand his strong {accent}: he says many words in a very unusual way. | People from the north speak with different {accents}.|customs beliefs",
      "custom belief",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Custom* and *culture* are close: a *custom* is one thing people have always done, like giving red envelopes, and *culture* is a whole way of life, with food, art, music and ideas. Ask whether the gap names one practice or a whole way of living.",
        "*custom* 和 *culture* 很接近：*custom* 是人们一直沿袭的某件事，比如发红包；*culture* 是整个生活方式，包括饮食、艺术、音乐和思想。想想空格指的是一种做法，还是整体的生活方式。",
      ),
      meaning: t(
        "*Manners* and *behavior* are both about how people act, but *manners* are the polite ways only, and *behavior* is any way someone acts, good or bad. Check whether the meaning says polite or any way.",
        "*manners* 和 *behavior* 都和人的举止有关，但 *manners* 只指礼貌的方式，*behavior* 指任何举止，好坏都算。看清释义说的是礼貌，还是任何方式。",
      ),
      spell: t(
        "*Foreigner* hides a silent g, for-**eig**-ner, and *ceremony* begins with ce- said like *se*.",
        "*foreigner* 里藏着不发音的 g：for-**eig**-ner；*ceremony* 开头的 ce- 读作 *se*。",
      ),
    },
    notes: `
      culture|Japanese food, art, festivals and way of life;music, dance and storytelling in Ireland;how people abroad eat, think, dress and celebrate|culture is a whole way of life; a custom is one thing people have always done|culture 是整体的生活方式；custom 是人们一直沿袭的某种做法|custom/customs=custom is one thing people have always done, such as shaking hands, not a whole way of life with art, food and ideas=custom 是人们一直沿袭的某件事，比如握手，不是包括艺术、饮食和思想的整体生活方式;accent/accents=accent is the way people say words, not their whole way of life=accent 是说话的口音，不是整体的生活方式|cul · ture|-ture at the end, said like *cher*|结尾 -ture 读作 *cher*
      custom|red envelopes at New Year in China;shaking hands in the West;drinking tea for thousands of years|a custom is something done the same way for a long time; a belief is an idea you feel sure is true|custom 是长期沿袭的做法；belief 是坚信为真的想法|religion=religion is believing in a god or gods, not an everyday habit such as shaking hands or giving envelopes=religion 是对神的信仰，不是握手、发红包这样的日常习惯;belief=belief is an idea in your mind, not something people do the same way every year=belief 是心里的想法，不是人们每年照样做的事|cus · tom|-om at the end; *costume*, which looks alike, is clothes|结尾是 -om；长得像的 *costume* 是服装
      belief|a flat Earth everyone says isn't real;everyone deserving a second chance;hard work|a belief is an idea you feel sure is true; a custom is something people do|belief 是坚信的想法；custom 是人们做的事|custom=custom is something people do in the same way for a long time, not an idea you feel sure is true=custom 是长期沿袭的做法，不是你坚信为真的想法;religion=religion is believing in a god and the ways of showing it, not any idea such as hard work=religion 是对神的信仰及其仪式，不是“努力工作”这类任何想法|be · lief|ie after the l, and f at the end (the verb is *believe*)|l 后面是 ie，结尾是 f（动词是 *believe*）
      religion|Buddhism with temples, monks and prayers;Christmas and the Christian faith;praying to God five times a day|a religion is believing in a god or gods; a belief can be any idea you feel sure about|religion 是对神的信仰；belief 可以是任何坚信的想法|belief/beliefs=belief is any idea you feel sure is true, not a whole faith with temples, gods and prayers=belief 是任何坚信的想法，不是有寺庙、神和祷告的完整宗教;custom/customs=custom is something people do the same way, not believing in a god=custom 是沿袭的做法，不是对神的信仰|re · li · gion|g said like j, and -ion at the end|g 读 j，结尾是 -ion
      heritage|an old town belonging to the nation;temples of a country's cultural past;old buildings and traditions protected for children|heritage is the history and old buildings a country has kept; a custom is one way of doing things|heritage 是一个国家保留下来的历史和古建筑；custom 是一种做法|custom=custom is one way of doing something, not old towns, temples and buildings=custom 是一种做法，不是古城、寺庙和建筑;ceremony=ceremony is a formal event on one day, not the history and old buildings a country keeps=ceremony 是某一天的正式活动，不是国家保留的历史和古建筑|her · i · tage|-age at the end, said like *ij*|结尾 -age 读作 *ij*
      ceremony|a wedding in a small church;speeches and flowers to remember soldiers;the opening of the Olympics|a ceremony is a formal event; a custom is a habit of a group|ceremony 是正式的典礼；custom 是群体的习惯|custom=custom is something people always do, not one formal event with speeches on a certain day=custom 是一直沿袭的做法，不是某天有讲话的正式活动;heritage=heritage is a country's history and old buildings, not an event that takes place=heritage 是国家的历史和古建筑，不是举行的活动|cer · e · mo · ny|ce- said like *se*, and y to -ies for more than one|ce- 读作 *se*，复数把 y 变成 -ies
      foreigner|finding the language hard at first;students from other countries in Beijing;visitors from abroad in a shop|a foreigner is from another country; a stranger is anyone you do not know|foreigner 是外国人；stranger 是任何陌生人|native/natives=native is someone born in this place, not a person from another country=native 是本地出生的人，不是外国人;stranger/strangers=stranger is any person you do not know, even from your own town, not someone from another country=stranger 是你不认识的任何人，哪怕是同乡，不一定是外国人|for · eign · er|a silent g: for-**eig**-ner|g 不发音：for-**eig**-ner
      native|a language spoken since birth;a teacher who grew up in London;pandas that have always lived in China's mountains|native means born in a place or belonging to it; foreign means from another country|native 是本地的、与生俱来的；foreign 是外国的|foreign=foreign means from another country, the opposite of born in or belonging to a place=foreign 是外国的，正好和本地的相反;religious=religious means about a god or a religion, not born in a place=religious 是与宗教有关的，不是本地出生的|na · tive|-ive at the end, with a said like *ay*|a 读作 *ay*，结尾是 -ive
      manners|talking with your mouth full;good table habits taught by a grandmother;forgetting to say thank you|manners are polite ways of behaving; customs are what a group has always done|manners 是礼貌的举止；customs 是群体沿袭的做法|customs=customs are what the people of a place have always done, not being polite or rude to the person in front of you=customs 是某地人一直沿袭的做法，不是对眼前的人礼貌或无礼;beliefs=beliefs are ideas you feel sure are true, not polite ways of eating and speaking=beliefs 是坚信的想法，不是吃饭说话的礼貌方式|man · ners|the double n, and always -s|双写 n，总是用复数 -s
      behavior|students a teacher was angry about;how animals act when hungry or afraid;rudeness at a party|behavior is the way someone acts; manners are only the polite ways|behavior 是人的行为举止；manners 只指礼貌的方式|belief=belief is an idea in your mind, not the way you act=belief 是心里的想法，不是举止;custom=custom is what a whole group has always done, not how one person acts at one time=custom 是整个群体沿袭的做法，不是某个人一时的举止|be · hav · ior|behave + -ior, in American English without u|behave 加 -ior，美式拼写没有 u
      respect|following the customs of a country politely;a fair person everyone thinks well of;speaking to older people politely|to respect is to think well of someone or treat them politely; to ignore is to pay no attention|respect 是尊重；ignore 是不理会|ignore/ignores=ignore means to pay no attention to someone, the opposite of treating them politely=ignore 是不理会，正好和礼貌对待相反;expect/expects=expect means to think something will happen, not to think well of someone=expect 是预料会发生，不是尊重某人|re · spect|re- + spect, with sp in the middle|re- 加 spect，中间是 sp
      accent|English with a French sound;words said in an unusual way;different ways of speaking in the north|an accent is the way people say words; a custom is a way of doing things|accent 是说话的口音；custom 是做事的习俗|custom/customs=custom is a way people do things, not the way they say words=custom 是做事的习俗，不是说话的口音;belief/beliefs=belief is an idea you feel sure about, not the way you say words=belief 是坚信的想法，不是说话的口音|ac · cent|the double c: the first said like k, the second like s|双写 c：第一个读 k，第二个读 s
    `,
  },
});

const travel = vocabularyTopic({
  id: "b1-words-travel-2",
  title: t("Planning a Trip", "计划旅行"),
  summary: t(
    "Destinations, accommodation and hostels; reservations and itineraries; backpacks; borders, visas and currency; exchanging money; tours and cruises.",
    "目的地、住宿和青年旅舍；预订和行程；背包；边境、签证和货币；兑换钱；观光和乘船游览。",
  ),
  intro: t(
    "We checked our **itinerary**, crossed the **border** with a new **visa**, and found cheap **accommodation** in a busy **hostel**. These words help you plan a trip abroad and talk about it.",
    "我们核对了 **itinerary**（行程），带着新办的 **visa**（签证）穿过 **border**（边境），又在一家热闹的 **hostel**（青年旅舍）找到了便宜的 **accommodation**（住宿）。这些词帮你计划出国旅行并谈论它。",
  ),
  prerequisites: ["a2-words-holidays"],
  words: [
    word(
      "destination destinations",
      "the place where someone is going",
      "目的地",
      "Paris is a popular tourist {destination}. | We reached our {destination} after ten hours on the road. | Thailand is one of the top {destinations} for young travelers.|itineraries routes",
      "itinerary route",
    ),
    word(
      "accommodation",
      "a place to stay or live, such as a hotel room",
      "住宿；住处",
      "The price includes flights and {accommodation}: a room in a hotel by the beach. | It's hard to find cheap {accommodation} in the city center, as hotel rooms cost a lot. | Our {accommodation} was a small room above a café.",
      "luggage currency",
    ),
    word(
      "hostel hostels",
      "a cheap place to stay, often with shared rooms, for travelers",
      "青年旅舍；招待所",
      "We stayed in a cheap {hostel} and shared one room with six other travelers. | Youth {hostels} are a cheap way to travel.|hotels cruises | The {hostel} near the station is cheap because guests share rooms and cook their own meals.",
      "hotel cruise",
    ),
    word(
      "reservation reservations",
      "an arrangement to keep a room, a table or a seat for you",
      "预订",
      "I'd like to make a {reservation} for two people at eight o'clock. | Do you have a {reservation} for a table tonight, sir? | We canceled our {reservations} at the hotel because of the storm.|receipts visas",
      "receipt visa",
    ),
    word(
      "itinerary itineraries",
      "a plan of a trip, with the places and the times",
      "行程；旅行计划",
      "Our {itinerary} has three days in Rome and then two in Venice. | The travel agent sent us a detailed {itinerary} with the times of every visit. | Let's change the {itinerary} so that we spend two more days by the sea and one less in town.",
      "reservation destination",
    ),
    word(
      "backpack backpacks",
      "a bag that you carry on your back",
      "双肩包；背包",
      "I packed everything I needed in one {backpack} and carried it on my back. | The students carried heavy {backpacks} on their backs up the hill.|suitcases passports | She took the {backpack} off her back and found a bottle of water in it.",
      "suitcase passport",
    ),
    word(
      "border borders",
      "the line between two countries",
      "边境；国界",
      "We crossed the {border} into Mexico. | You need a passport to cross the {border}. | The town is close to the French {border}, so we often drive into France.",
      "visa destination",
    ),
    word(
      "visa visas",
      "an official mark in your passport that lets you enter a country",
      "签证",
      "Before you fly to Canada, you need a {visa} stamped in your passport. | She applied for a student {visa} so that she could study in the country for a year. | My work {visa} lets me stay in the country until next month.",
      "passport ticket",
    ),
    word(
      "currency currencies",
      "the kind of money a country uses",
      "货币",
      "The {currency} of Japan is the yen. | You can pay in local {currency} or in dollars. | Some {currencies}, such as the dollar and the euro, are used all over the world.|coins visas",
      "coin visa",
    ),
    word(
      "exchange exchanges exchanged exchanging",
      "to give something and get something else for it",
      "交换；兑换",
      "Where can I {exchange} dollars for euros? | We {exchanged} phone numbers before we said goodbye.|spent lent | Can I {exchange} this shirt for a bigger size?",
      "spend lend",
    ),
    word(
      "tour tours",
      "a trip to see the sights of a place",
      "观光；游览",
      "We went on a {tour} of the old city on foot. | The bus {tour} takes visitors past all the famous sights in two hours. | The museum offers free {tours} every morning.|cruises flights",
      "cruise flight",
    ),
    word(
      "cruise cruises",
      "a holiday on a large ship that visits several places",
      "乘船游览；邮轮旅行",
      "My grandparents went on a {cruise} and spent two weeks on a huge ship. | The {cruise} stopped at five islands, and every night we slept in our cabin on the ship. | {Cruises} are popular with older travelers who want to see many ports without leaving the ship.|Tours Flights",
      "tour flight",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Destination* and *itinerary* both belong to trip plans, but a *destination* is the one place you are going to, and an *itinerary* is the whole plan with many places and times. If the gap is a single place you reach, it is the *destination*.",
        "*destination* 和 *itinerary* 都和旅行计划有关，但 *destination* 是要去的那一个地方，*itinerary* 是包含多个地点和时间的整个计划。空格如果是到达的某个地方，就是 *destination*。",
      ),
      meaning: t(
        "A *visa* and a *passport* are both travel papers: the *passport* is the small book that shows who you are, and the *visa* is the official mark inside it that lets you enter one country. Read whether the meaning is the book or the permission in it.",
        "*visa* 和 *passport* 都是旅行证件：*passport* 是证明身份的小本子，*visa* 是本子里允许你进入某个国家的正式标记。看清释义说的是本子，还是本子里的许可。",
      ),
      spell: t(
        "*Accommodation* has a double c and a double m, and *itinerary* has three i's said apart: i-tin-er-ar-y.",
        "*accommodation* 里 c 和 m 都双写；*itinerary* 要分开读成 i-tin-er-ar-y。",
      ),
    },
    notes: `
      destination|Paris for tourists;the end of ten hours on the road;Thailand for young travelers|a destination is the place you are going to; a route is the way you take to get there|destination 是要去的地方；route 是去那里的路线|itinerary/itineraries=itinerary is a whole plan of a trip with times, not the one place you are going to=itinerary 是带时间安排的整个行程，不是要去的那一个地方;route/routes=route is the way you travel along, not the place at the end of it=route 是一路走的路线，不是终点那个地方|des · ti · na · tion|-tion at the end, said like *shun*|结尾 -tion 读作 *shun*
      accommodation|a room in a hotel by the beach;expensive hotel rooms in the city center;a small room above a café|accommodation is a place to stay; luggage is the bags you carry|accommodation 是住的地方；luggage 是带的行李|luggage=luggage is the bags and cases you carry on a trip, not a room where you stay=luggage 是旅途中带的包和箱子，不是住的房间;currency=currency is the kind of money a country uses, not a place to sleep=currency 是一个国家用的货币，不是睡觉的地方|ac · com · mo · da · tion|no -s in British and American English for a place to stay|表示住处时一般不加 -s
      hostel|one room shared with six other travelers;youth travel on little money;shared rooms and guests cooking their own meals|a hostel is cheap with shared rooms; a hotel has private rooms and costs more|hostel 便宜，房间合住；hotel 房间独用，价格较高|hotel/hotels=hotel gives each guest a private room at a higher price, not cheap shared rooms=hotel 给每位客人独立房间，价格较高，不是便宜的合住房;cruise/cruises=cruise is a holiday on a ship, not a cheap place in town to sleep=cruise 是乘船度假，不是城里便宜的住处|hos · tel|-tel at the end; *hostile* means unfriendly|结尾是 -tel；*hostile* 是“敌对的”
      reservation|a table for two at eight o'clock;a table tonight;rooms at the hotel during a storm|a reservation keeps a room or table for you; a receipt shows you have paid|reservation 是预订房间或桌子；receipt 是付款收据|receipt/receipts=receipt is a paper that shows you have paid, not a table or room kept for you=receipt 是付款后的收据，不是为你留的桌子或房间;visa/visas=visa is a mark in your passport for entering a country, not a table or room kept for you=visa 是护照上入境的标记，不是为你留的桌子或房间|res · er · va · tion|make a reservation · have a reservation · cancel a reservation|make a reservation，不说 do a reservation
      itinerary|three days in Rome then two in Venice;the times of every visit;more days by the sea and fewer in town|an itinerary is the whole plan of a trip; a reservation keeps one room or seat|itinerary 是整个行程；reservation 只预订一个房间或座位|reservation=reservation keeps one room, table or seat for you, not a plan of places and days=reservation 只为你留一个房间、桌子或座位，不是地点和日程的计划;destination=destination is the one place you are going to, not a plan with many places and times=destination 是要去的那一个地方，不是包含多个地点和时间的计划|i · tin · er · ar · y|-ary at the end, and y to -ies for more than one|结尾是 -ary，复数把 y 变 -ies
      backpack|everything carried on my back;students' heavy loads up the hill;a bag taken off her back|a backpack is carried on your back; a suitcase is carried in your hand or pulled|backpack 背在背上；suitcase 拿在手里或拖着|suitcase/suitcases=suitcase is a case you carry in your hand or pull on wheels, not a bag on your back=suitcase 是手提或拖着走的箱子，不是背在背上的包;passport/passports=passport is a small book that shows who you are, not a bag you carry things in=passport 是证明身份的小本子，不是装东西的包|back · pack|back + pack, with ck in both parts|back 加 pack，两部分都是 ck
      border|crossing into Mexico;a passport check;a town near France|a border is the line between two countries; a visa lets you cross it|border 是两国之间的边界；visa 允许你过境|visa=visa is a mark in your passport, not the line between two countries=visa 是护照上的标记，不是两国之间的界线;destination=destination is the place you are going to, not the line you cross between countries=destination 是要去的地方，不是国家之间跨过的界线|bor · der|*boarder* with an a is a student who sleeps at school|带 a 的 *boarder* 是寄宿生
      visa|a stamp in your passport for Canada;a year of study in a country;permission to stay until next month|a visa is the permission in your passport; the passport is the book itself|visa 是护照里的入境许可；passport 是护照本身|passport=passport is the small book that shows who you are, not the permission stamped inside it for one country=passport 是证明身份的小本子，不是本子里某国的许可;ticket=ticket is a paper that lets you travel on a plane or train, not permission to stay in a country=ticket 是乘飞机或火车的票，不是在某国停留的许可|vi · sa|apply for a visa · a student visa · a work visa|apply for a visa，不说 ask a visa
      currency|the yen in Japan;local money or dollars;the dollar and the euro worldwide|a currency is the kind of money a country uses; a coin is one round piece of money|currency 是一国使用的货币；coin 是一枚硬币|coin/coins=coin is one round metal piece of money, not the kind of money a whole country uses=coin 是一枚金属硬币，不是整个国家使用的货币种类;visa/visas=visa is a mark in your passport, not a kind of money=visa 是护照上的标记，不是一种钱|cur · ren · cy|double r, and -cy at the end|双写 r，结尾是 -cy
      exchange|dollars for euros;phone numbers before goodbye;a shirt for a bigger size|to exchange is to give something and get something else for it; to spend is to give money away for things|exchange 是交换、兑换；spend 是花钱|spend/spent=spend means to give money away and get nothing back in the same kind, not to swap one thing for another=spend 是把钱花出去，不是用一样东西换另一样;lend/lent=lend means to give something for a short time and get the same thing back, not to swap it for something else=lend 是借出后拿回原物，不是换成别的东西|ex · change|exchange A for B · exchange numbers · exchange money|exchange A for B，用 for 不用 to
      tour|the old city on foot;famous sights by bus in two hours;free visits every morning at a museum|a tour is a trip to see the sights; a cruise is a holiday on a ship|tour 是观光游览；cruise 是乘船度假|cruise/cruises=cruise is a holiday on a big ship, not a walk or bus trip around a place=cruise 是坐大船度假，不是步行或乘车游览;flight/flights=flight is a trip on a plane, not a visit to the sights on foot or by bus=flight 是乘飞机出行，不是步行或乘车观光|tour|ou said like *oor*; *tower* is a tall building|ou 读作 *oor*；*tower* 是塔
      cruise|two weeks on a huge ship;a cabin on the ship and five islands;many ports without leaving the ship|a cruise is a holiday on a ship; a tour can be on foot or by bus|cruise 是乘船度假；tour 可以步行或乘车|tour/tours=tour is a trip to see sights on foot or by bus, not two weeks living on a ship=tour 是步行或乘车观光，不是在船上住两周;flight/flights=flight is a trip on a plane, not a holiday on a ship=flight 是乘飞机，不是乘船度假|cruise|ui said like *oo*, and s said like z|ui 读作 *oo*，s 读作 z
    `,
  },
});

const adventure = vocabularyTopic({
  id: "b1-words-adventure",
  title: t("Adventure", "探险"),
  summary: t(
    "Adventures and exploring; unforgettable and breathtaking; homesick; translating; guidebooks, landmarks, scenery and routes; admiring and wandering.",
    "探险和探索；难忘的和壮观的；想家的；翻译；旅行指南、地标、风景和路线；欣赏和闲逛。",
  ),
  intro: t(
    "We **wandered** through the old town, **admired** the **breathtaking** **scenery**, and used the **guidebook** to find each **landmark**. These words help you tell the story of an exciting trip.",
    "我们在古城里 **wandered**（漫步），**admired**（欣赏）**breathtaking**（壮观的）**scenery**（风景），还用 **guidebook**（旅行指南）找到每一处 **landmark**（地标）。这些词帮你讲述一段精彩的旅程。",
  ),
  prerequisites: ["b1-words-travel-2"],
  words: [
    word(
      "adventure adventures",
      "an exciting experience, often a little dangerous",
      "冒险；奇遇",
      "Our trip to the jungle was a real {adventure}, with snakes, storms and a broken boat. | He told us exciting stories about his {adventures} in Africa, like the night a lion came near his tent.|landmarks routes | Children love {adventure} stories about pirates and hidden treasure.",
      "landmark route",
    ),
    word(
      "explore explores explored exploring",
      "to travel around a place to find out what it is like",
      "探索；探险",
      "We spent the afternoon {exploring} the old town to find out what was there.|translating admiring | Let's {explore} the island tomorrow and find out what is on the other side. | Divers {explore} the bottom of the sea to find out what lives there.",
      "translate admire",
    ),
    word(
      "unforgettable",
      "so special that you will always remember it",
      "难忘的",
      "Seeing the Great Wall was {unforgettable}: I will remember it all my life. | Our night under the stars was {unforgettable}, and we still talk about it years later. | That concert was so {unforgettable} that I can still hear every song in my head.",
      "homesick boring",
    ),
    word(
      "breathtaking",
      "so beautiful or surprising that it takes your breath away",
      "壮观的；惊人的",
      "The view from the top of the mountain was {breathtaking}, and we all stopped talking to look at it. | The dancers gave a {breathtaking} performance, and the whole audience stood up and cheered. | We drove along a road with {breathtaking} views of the coast, so we stopped often to take photos.",
      "homesick boring",
      "unforgettable",
    ),
    word(
      "homesick",
      "sad because you are far from home and miss it",
      "想家的",
      "On my first night at university, I missed my family and felt very {homesick}. | She was {homesick} for her mother's cooking. | It's normal to get {homesick} when you live abroad and miss home.",
      "nervous breathtaking",
    ),
    word(
      "translate translates translated translating",
      "to change words from one language into another",
      "翻译",
      "Can you {translate} this menu into English? | The book has been {translated} into thirty languages.|explained copied | She {translates} letters from French into Chinese for a law firm.|explains copies",
      "explain copy",
    ),
    word(
      "guidebook guidebooks",
      "a book for travelers about a place",
      "旅行指南",
      "According to the {guidebook}, the museum opens at nine. | I bought a {guidebook} to Vietnam in a bookshop before the trip. | Our {guidebook} recommended a little restaurant by the river.",
      "landmark route",
    ),
    word(
      "landmark landmarks",
      "a famous building or place that is easy to see and recognize",
      "地标",
      "The Eiffel Tower is the most famous {landmark} in Paris. | Big Ben is one of London's best-known {landmarks}.|guidebooks routes | The tall church is a useful {landmark}: you can see it from anywhere in town if you get lost.",
      "guidebook route",
    ),
    word(
      "scenery",
      "the natural things you see in a place, such as hills, trees and rivers",
      "风景；景色",
      "The {scenery} in the mountains, with its lakes and forests, is wonderful. | We stopped the car to enjoy the {scenery} of green hills and rivers. | From the train we looked out at the {scenery}: fields, rivers and hills.",
      "landmark route",
    ),
    word(
      "route routes",
      "the way you go from one place to another",
      "路线",
      "Which is the quickest {route} to the airport? | We took the long {route} along the coast. | This bus {route} goes through the city center.",
      "scenery landmark",
    ),
    word(
      "admire admires admired admiring",
      "to look at something with pleasure, or to respect someone very much",
      "欣赏；钦佩",
      "We stood on the bridge, {admiring} the view.|exploring wandering | I really {admire} people who help others. | Everyone {admired} her new painting.|explored wandered",
      "explore wander",
    ),
    word(
      "wander wanders wandered wandering",
      "to walk around slowly without a special plan",
      "闲逛；漫步",
      "We {wandered} slowly through the narrow streets of the old town, with no plan and nothing to find.|explored admired | I love {wandering} slowly around markets on holiday with no plan.|exploring admiring | The children {wandered} off and got lost.|explored admired",
      "explore admire",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        '*Wander* and *explore* both mean moving around a place, but you *wander* slowly with no plan, and you *explore* to find out what a place is like. Look for "with no plan" or "to find out" in the sentence.',
        "*wander* 和 *explore* 都是在某地四处走动，但 *wander* 是没有计划地慢慢走，*explore* 是为了弄清某地的样子。留意句中有没有“没有计划”或“去弄清”。",
      ),
      meaning: t(
        "*Scenery* and *landmark* both name things you see on a trip, but *scenery* is the natural view of hills, trees and rivers, and a *landmark* is one famous building or place. Check whether the meaning is a whole view or one famous thing.",
        "*scenery* 和 *landmark* 都是旅途中看到的东西，但 *scenery* 是山、树、河组成的自然景色，*landmark* 是某一座著名的建筑或地点。看清释义说的是整片景色，还是一处著名的东西。",
      ),
      spell: t(
        "*Unforgettable* doubles the t before -able (forget, forgettable), and *scenery* starts with a silent c after the s.",
        "*unforgettable* 在 -able 前双写 t（forget → forgettable）；*scenery* 开头 s 后的 c 不发音。",
      ),
    },
    notes: `
      adventure|snakes, storms and a broken boat in the jungle;a lion near a tent in Africa;stories about pirates and hidden treasure|an adventure is an exciting, often dangerous experience; a route is just the way you go|adventure 是刺激、常带危险的经历；route 只是走的路线|landmark/landmarks=landmark is a famous building you can see, not an exciting experience that happens to you=landmark 是看得见的著名建筑，不是你经历的刺激事情;route/routes=route is the way from one place to another, not an exciting experience=route 是从一处到另一处的路线，不是刺激的经历|ad · ven · ture|-ture at the end; *advantage* means something that helps you|结尾是 -ture；*advantage* 是“优势”
      explore|finding out what is in the old town;the other side of the island;what lives at the bottom of the sea|to explore is to go around a place to find out about it; to admire is to look at it with pleasure|explore 是去探索弄清；admire 是欣赏|translate/translating=translate means to change words into another language, not to travel around a place=translate 是把话译成另一种语言，不是在某地四处探索;admire/admiring=admire means to look at something with pleasure, not to go around a place to find out what is there=admire 是带着喜爱观看，不是四处走动弄清那里有什么|ex · plore|explore a place, with no word after the verb; *explode* means to blow up|explore 后直接跟地点；*explode* 是“爆炸”
      unforgettable|the Great Wall remembered all my life;a night still talked about years later;every song still heard in my head|unforgettable means you will always remember it; boring means dull and not interesting|unforgettable 是难忘的；boring 是无聊的|homesick=homesick is sad because you miss home, not so special you always remember it=homesick 是因想家而难过，不是特别得让人永远记得;boring=boring is dull and soon forgotten, the opposite of something you always remember=boring 是乏味、很快被忘记，正好和永远难忘相反|un · for · get · ta · ble|un + forget + t + able|un 加 forget，再加 t 和 able
      breathtaking|a mountain view that stopped everyone talking;dancers the whole audience cheered;coast views worth stopping for photos|breathtaking means so beautiful it surprises you; boring means not interesting at all|breathtaking 是美得惊人；boring 是一点也不有趣|homesick=homesick is how a person feels when they miss home, not how a view or show looks=homesick 是人想家的感受，不是景色或表演的样子;boring=boring is dull, the opposite of so beautiful it takes your breath away=boring 是乏味，正好和美得令人屏息相反|breath · tak · ing|breath (the noun) + taking; *breathless* means out of breath|breath（名词）加 taking；*breathless* 是“喘不过气的”
      homesick|missing my family on the first night at university;her mother's cooking;missing home when living abroad|homesick is sad because you miss home; nervous is worried about what will happen|homesick 是想家；nervous 是对将来的事紧张|nervous=nervous is worried about something that will happen, not sad because you miss home=nervous 是为将要发生的事紧张，不是因为想家而难过;breathtaking=breathtaking describes a view or show, not how a person feels about home=breathtaking 形容景色或表演，不是人对家的感受|home · sick|homesick for something; *seasick* is feeling ill on a boat|homesick for…；*seasick* 是晕船
      translate|a menu into English;a book in thirty languages;letters from French into Chinese|to translate is to change words into another language; to explain is to make something clear in the same language|translate 是译成另一种语言；explain 是用同一种语言讲清楚|explain/explained/explains=explain means to make something clear in the same language, not to change it into another language=explain 是用同一种语言讲清楚，不是译成另一种语言;copy/copied/copies=copy means to write the same words again, not to put them into another language=copy 是把同样的字再写一遍，不是换成另一种语言|trans · late|translate A into B · translate from French into Chinese|translate into，不用 to
      guidebook|the museum opening at nine;a bookshop before the trip to Vietnam;a little restaurant by the river|a guidebook is a book about a place; a landmark is a famous place itself|guidebook 是介绍地方的书；landmark 是著名的地方本身|landmark=landmark is a famous building or place itself, not a book that tells you about places=landmark 是著名的建筑或地点本身，不是介绍地方的书;route=route is the way you travel, not a book you can read or buy=route 是走的路线，不是可以读或买的书|guide · book|ui said like long *i*: guide + book, one word|ui 读长音 *i*：guide 加 book，写成一个词
      landmark|the Eiffel Tower in Paris;Big Ben in London;a tall church seen from anywhere in town|a landmark is one famous building or place; scenery is the whole natural view|landmark 是一处著名建筑或地点；scenery 是整片自然景色|guidebook/guidebooks=guidebook is a book about a place, not a famous building you can see=guidebook 是介绍地方的书，不是看得见的著名建筑;route/routes=route is the way from one place to another, not a building that stands in one place=route 是从一处到另一处的路线，不是立在某处的建筑|land · mark|land + mark; *bookmark* keeps your page in a book|land 加 mark；*bookmark* 是书签
      scenery|lakes and forests in the mountains;green hills and rivers;fields, rivers and hills from the train|scenery is the whole natural view; a landmark is one famous building|scenery 是整片自然景色；landmark 是一座著名建筑|landmark=landmark is one famous building or place, not a whole view of hills, trees and rivers=landmark 是一处著名的建筑或地点，不是山、树、河组成的整片景色;route=route is the way you travel, not what you see around you=route 是走的路线，不是周围看到的景色|scen · er · y|no plural: the scenery, not sceneries; *scene* is one view or part of a play|没有复数：不说 sceneries；*scene* 是一个场景
      route|the quickest way to the airport;the long way along the coast;a bus through the city center|a route is the way from one place to another; scenery is what you see on the way|route 是路线；scenery 是沿途风景|scenery=scenery is the hills and rivers you see, not the way you travel=scenery 是看到的山和河，不是走的路线;landmark=landmark is a famous building in one place, not a way from one place to another=landmark 是某处的著名建筑，不是从一处到另一处的路|route|ou said like *oo*, like *root*|ou 读作 *oo*，和 *root* 同音
      admire|a view from the bridge;people who help others;her new painting|to admire is to look with pleasure or respect someone; to wander is to walk around slowly|admire 是欣赏、钦佩；wander 是慢慢闲逛|explore/exploring/explored=explore means to go around a place to find out about it, not to look with pleasure or respect someone=explore 是四处探索弄清，不是欣赏或钦佩某人;wander/wandering/wandered=wander means to walk around slowly, not to look at something with pleasure or respect someone=wander 是慢慢闲逛，不是欣赏或钦佩|ad · mire|admire someone for something; *admit* means to say something is true|admire sb for sth；*admit* 是“承认”
      wander|narrow streets with no plan and nothing to find;markets on holiday with no plan;children who got lost|to wander is to walk slowly with no plan; to explore is to go around to find out what a place is like|wander 是没计划地慢慢走；explore 是为了弄清而探索|explore/explored/exploring=explore means to go around a place on purpose to find out about it, not to walk with no plan=explore 是有目的地弄清某地，不是毫无计划地走;admire/admired/admiring=admire means to look at something with pleasure, not to walk around=admire 是带着喜爱观看，不是四处走|wan · der|a said like *o*; *wonder* with o means to ask yourself|a 读作 *o*；带 o 的 *wonder* 是“想知道”
    `,
  },
});

const food = vocabularyTopic({
  id: "b1-words-food-culture",
  title: t("Food and Culture", "饮食与文化"),
  summary: t(
    "Cuisines, ingredients, flavors and spices; chopsticks, seafood and desserts; menus, tips and bills; serving; appetite.",
    "菜系、食材、味道和香料；筷子、海鲜和甜点；菜单、小费和账单；上菜；胃口。",
  ),
  intro: t(
    "In the little restaurant, the **menu** listed dishes full of **spices**, the **seafood** was fresh, and after **dessert** we paid the **bill** and left a **tip**. These words help you order, eat and talk about food from around the world.",
    "在那家小餐馆里，**menu**（菜单）上满是加了 **spices**（香料）的菜，**seafood**（海鲜）很新鲜；吃完 **dessert**（甜点），我们付了 **bill**（账单），还留了 **tip**（小费）。这些词帮你点菜、用餐，谈论世界各地的美食。",
  ),
  prerequisites: ["a2-words-cooking"],
  words: [
    word(
      "cuisine cuisines",
      "a style of cooking of a country or a region",
      "菜系；烹饪风格",
      "Sichuan {cuisine}, the cooking of the whole province, is famous for being hot and spicy. | I love Italian {cuisine}, especially pasta. | The restaurant serves Thai {cuisine}: curries, soups, noodles and salads.",
      "seafood dessert",
    ),
    word(
      "ingredient ingredients",
      "one of the foods that you put together to make a dish",
      "原料；食材",
      "Flour, eggs and milk are the main {ingredients} of pancakes.|spices recipes | You only need four {ingredients} to make this cake: flour, butter, sugar and eggs.|spices recipes | Fresh {ingredients} such as vegetables, fish and herbs from the market make the food taste better.|spices recipes",
      "spice recipe",
    ),
    word(
      "flavor flavors",
      "the taste of a food or a drink",
      "味道；风味",
      "What {flavor} of ice cream would you like: chocolate or strawberry? | Lemon gives the fish a fresh {flavor} that you can taste in every bite. | Add some salt to bring out the {flavor} of the soup.",
      "smell appetite",
    ),
    word(
      "spice spices",
      "a powder or seed from a plant that gives food a strong taste",
      "香料；调味品",
      "Indian cooks grind a lot of dry {spices}, such as cumin and turmeric, into powder.|sauces desserts | Pepper is the most common {spice} in the world. | This soup needs a little more {spice}: add some black pepper.",
      "sauce dessert",
    ),
    word(
      "chopsticks",
      "a pair of thin sticks used for eating, especially in East Asia",
      "筷子",
      "It took me a week to learn to hold two thin {chopsticks} in one hand. | In China, you should never stand your {chopsticks} up in your rice. | In East Asia, most people eat noodles with {chopsticks}, not with a fork.",
      "forks spoons",
    ),
    word(
      "seafood",
      "fish and other animals from the sea that people eat, such as shrimp",
      "海鲜",
      "The town by the harbor is famous for its fresh {seafood}. | I'm allergic to {seafood}, so I can't eat shrimp. | We had a {seafood} dinner of crab and fish by the harbor.",
      "dessert meat",
    ),
    word(
      "dessert desserts",
      "sweet food that you eat at the end of a meal",
      "甜点",
      "For {dessert}, we had chocolate cake. | Would you like to see the {dessert} menu with our cakes and ice creams? | French bakeries make wonderful sweet {desserts} for the end of a meal.|soups snacks",
      "soup snack",
    ),
    word(
      "menu menus",
      "a list of the food you can order in a restaurant",
      "菜单",
      "Can we see the {menu}, please? We'd like to order. | There are no vegetarian dishes on this restaurant's {menu}, so we'll eat somewhere else. | Prices on the {menu} include tax, so you know the cost before you order.",
      "recipe receipt",
    ),
    word(
      "tip tips",
      "extra money you give to a waiter or a driver to thank them",
      "小费",
      "In the US, people usually leave a {tip} of fifteen to twenty percent to thank the waiter. | We gave the taxi driver a big {tip} to thank him for his help. | In Japan, {tips} for waiters are not expected, because good service is normal.|fees bills",
      "fee bill",
    ),
    word(
      "bill bills",
      "a piece of paper that shows how much you must pay for a meal or a service",
      "账单",
      "Could we have the {bill}, please? We'd like to pay. | My dad always pays the whole {bill} for the meal when we eat out. | The {bill} for the dinner, with all the food and drinks, came to over a hundred dollars.",
      "menu tip",
    ),
    word(
      "serve serves served serving",
      "to give food or drinks to people at a meal",
      "上菜；供应",
      "Breakfast is {served} to guests in the dining room from seven to ten.|ordered cooked | The waiter {served} us our soup quickly.|ordered cooked | This café {serves} its customers the best coffee in town.|orders cooks",
      "order cook",
    ),
    word(
      "appetite appetites",
      "the feeling that you want to eat",
      "胃口；食欲",
      "Swimming always gives me a big {appetite}. | When I'm ill, I lose my {appetite} and don't want to eat. | Don't eat cookies now, or you'll spoil your {appetite} for dinner.",
      "flavor menu",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Bill* and *tip* are both money at the end of a meal, but the *bill* is what you must pay for the food, and a *tip* is extra money you choose to give to thank the waiter. Ask whether the gap is what you owe or a thank-you.",
        "*bill* 和 *tip* 都是饭后付的钱，但 *bill* 是饭菜必须付的钱，*tip* 是自愿额外给服务员的谢意。想想空格是欠的钱，还是表示感谢的钱。",
      ),
      meaning: t(
        "*Cuisine* is not the room where you cook: that is the *kitchen*. *Cuisine* is the style of cooking of a whole country or region, such as Sichuan or Italian. Check whether the meaning is a place or a way of cooking.",
        "*cuisine* 不是做饭的房间，那是 *kitchen*。*cuisine* 是一个国家或地区的烹饪风格，比如川菜、意大利菜。看清释义说的是地方，还是烹饪方式。",
      ),
      spell: t(
        "*Dessert*, the sweet food, has a double s; *desert* with one s is sand. And *appetite* has a double p.",
        "甜点 *dessert* 双写 s；只有一个 s 的 *desert* 是沙漠。*appetite* 里 p 双写。",
      ),
    },
    notes: `
      cuisine|the cooking of the whole Sichuan province;Italian cooking with pasta;Thai curries, soups, noodles and salads|cuisine is a style of cooking of a place; a kitchen is the room where you cook|cuisine 是某地的烹饪风格；kitchen 是做饭的房间|seafood=seafood is fish and shellfish only, not a whole style of cooking with many kinds of dishes=seafood 只是鱼虾贝类，不是包含各种菜的整套烹饪风格;dessert=dessert is the sweet food at the end of a meal, not the cooking of a whole country=dessert 是饭后的甜食，不是一个国家的整体烹饪|cui · sine|ui said like *wi*, and -ine said like *een*|ui 读作 *wi*，-ine 读作 *een*
      ingredient|flour, eggs and milk in pancakes;flour, butter, sugar and eggs for a cake;vegetables, fish and herbs from the market|an ingredient is one food you mix into a dish; a recipe is the instructions|ingredient 是做菜的原料；recipe 是做法|spice/spices=spice is a strong-tasting powder or seed, not flour, eggs, vegetables or fish=spice 是味道浓的粉末或种子，不是面粉、鸡蛋、蔬菜或鱼;recipe/recipes=recipe is the instructions for cooking, not a food you put into the dish=recipe 是烹饪的做法说明，不是放进菜里的食物|in · gre · di · ent|-ent at the end, not -ant|结尾是 -ent，不是 -ant
      flavor|chocolate or strawberry ice cream;lemon tasted in every bite of fish;salt in the soup|flavor is how food tastes; smell is what your nose notices|flavor 是吃到的味道；smell 是鼻子闻到的气味|smell=smell is what your nose notices, not the taste in your mouth when you eat=smell 是鼻子闻到的，不是吃进嘴里的味道;appetite=appetite is wanting to eat, not the taste of the food itself=appetite 是想吃东西的感觉，不是食物本身的味道|fla · vor|-or in American English, -our in British English|美式拼写 -or，英式拼写 -our
      spice|cumin and turmeric ground into powder;pepper used around the world;black pepper in the soup|a spice is a dry powder or seed; a sauce is a thick liquid|spice 是干的粉末或种子；sauce 是浓稠的酱汁|sauce/sauces=sauce is a thick liquid poured on food, not a dry powder or seed like pepper=sauce 是浇在食物上的浓汁，不是胡椒这样的干粉或种子;dessert/desserts=dessert is sweet food after a meal, not a powder that gives food a strong taste=dessert 是饭后甜食，不是给菜调味的粉末|spice|the adjective is *spicy*: hot spices make food spicy|形容词是 *spicy*：辣的香料让菜变辣
      chopsticks|two thin sticks held in one hand;a pair stood up in rice in China;noodles eaten in East Asia without a fork|chopsticks are two thin sticks for eating; a fork has points on one handle|chopsticks 是两根细棍；fork 是一个柄上带齿|forks=forks are one handle with points, not a pair of thin sticks held in one hand=fork 是带齿的一个叉子，不是一只手拿的两根细棍;spoons=spoons are small bowls on a handle for soup, not a pair of thin sticks=spoon 是带柄的小勺，不是一对细棍|chop · sticks|always a pair: a pair of chopsticks, one chopstick|总是成双：a pair of chopsticks
      seafood|fresh food from the town's harbor;shrimp that causes an allergy;crab and fish for dinner|seafood is fish and shellfish; meat comes from animals on land|seafood 是海鲜；meat 是陆地动物的肉|dessert=dessert is sweet food after a meal, not fish and shrimp=dessert 是饭后甜食，不是鱼虾;meat=meat is from animals that live on land, such as cows and pigs, not from the sea=meat 是牛、猪等陆地动物的肉，不是海里的|sea · food|one word, and no plural|写成一个词，没有复数
      dessert|chocolate cake;a menu of cakes and ice creams;sweet bakery food for the end of a meal|dessert is sweet food at the end of a meal; a snack is small food between meals|dessert 是饭后的甜食；snack 是两餐之间的小吃|soup/soups=soup is a hot liquid dish, usually at the start of a meal, not sweet cake or ice cream=soup 是常在饭前喝的汤，不是甜蛋糕或冰淇淋;snack/snacks=snack is a little food between meals, not the sweet course at the end of a meal=snack 是两餐之间的小吃，不是饭后的甜点|des · sert|ss in the middle; *desert* with one s is sand|中间是 ss；只有一个 s 的 *desert* 是沙漠
      menu|what to order in a restaurant;the dishes this restaurant offers;prices before you order|a menu lists the food you can order; a receipt shows what you paid|menu 列出可点的菜；receipt 显示已付的钱|recipe=recipe tells you how to cook one dish, not the list of food a restaurant offers=recipe 讲一道菜怎么做，不是餐馆提供的菜单;receipt=receipt is the paper you get after you pay, not a list you read before you order=receipt 是付款后拿到的收据，不是点菜前看的单子|men · u|e said like *eh*; more than one: menus|e 读作 *eh*；复数是 menus
      tip|fifteen to twenty percent to thank the waiter;thanks to a taxi driver;waiters in Japan with good service|a tip is extra money to say thank you; a fee is money you must pay for a service|tip 是表示感谢的额外的钱；fee 是必须付的服务费|fee/fees=fee is money you must pay for a service, not extra money you choose to give as thanks=fee 是必须付的服务费，不是自愿给的谢意;bill/bills=bill is what you must pay for the food, not extra money for thanks=bill 是必须付的饭钱，不是额外的谢意|tip|leave a tip · give someone a tip; a *tip* is also a useful piece of advice|leave a tip；*tip* 还可以指“小建议”
      bill|paying at the end of the meal;the whole cost of eating out;all the food and drinks at a dinner|the bill is what you must pay; the menu is the list you order from|bill 是要付的账单；menu 是点菜的单子|menu=menu is the list of food you order from, not what you must pay at the end=menu 是点菜的单子，不是最后要付的钱;tip=tip is extra money you choose to give, not the whole cost of the food=tip 是自愿多给的钱，不是饭菜的全部费用|bill|double l; Americans also say *check* in a restaurant|双写 l；美国人在餐馆也说 *check*
      serve|breakfast for guests in the dining room;soup from the waiter;the best coffee for a café's customers|to serve is to give food or drinks to people; to cook is to make the food hot and ready|serve 是给人上菜；cook 是做饭|order/ordered/orders=order means to ask for food you want, not to give it to the people eating=order 是点你想吃的，不是把菜端给用餐的人;cook/cooked/cooks=cook means to make food ready with heat, not to bring it to the people at the table=cook 是用火把饭做好，不是把菜端给桌上的人|serve|serve someone something · be served from seven to ten|serve sb sth；被动 be served
      appetite|hunger after swimming;not wanting to eat when ill;wanting dinner after cookies|appetite is wanting to eat; flavor is how food tastes|appetite 是食欲；flavor 是味道|flavor=flavor is how food tastes, not the wish to eat=flavor 是食物的味道，不是想吃的愿望;menu=menu is a list of dishes, not a feeling that you want to eat=menu 是菜的清单，不是想吃东西的感觉|ap · pe · tite|lose your appetite · spoil your appetite · a big appetite|lose your appetite，不说 miss your appetite
    `,
  },
});

const nations = vocabularyTopic({
  id: "b1-words-nations",
  title: t("Nations and Languages", "国家与语言"),
  summary: t(
    "Nations, citizens and populations; capitals, continents and regions; foreign, bilingual and fluent; dialects and nationality; immigrants.",
    "国家、公民和人口；首都、大洲和地区；外国的、双语的和流利的；方言和国籍；移民。",
  ),
  intro: t(
    "As a French **citizen** who is **bilingual** and **fluent** in Arabic, she has lived on three **continents** and visited many **nations**. These words help you talk about countries, the people in them and the languages they speak.",
    "她是 **bilingual**（双语的）法国 **citizen**（公民），阿拉伯语也说得 **fluent**（流利），在三个 **continents**（大洲）生活过，去过许多 **nations**（国家）。这些词帮你谈论国家、国民和他们说的语言。",
  ),
  prerequisites: ["b1-words-culture"],
  words: [
    word(
      "nation nations",
      "a country and the people who live in it",
      "国家；民族",
      "When our country won, the whole {nation} celebrated together. | The United {Nations} was set up in 1945.|Regions Continents | Leaders of many {nations}, from Brazil to Japan, met in Geneva.|regions continents",
      "region continent",
    ),
    word(
      "citizen citizens",
      "a person who belongs to a country and has rights there",
      "公民",
      "She was born in Spain, but she now has a French passport: she is a French {citizen}. | Every {citizen} has the right to vote. | The city asked its {citizens}, the people who live there, to save water.|tourists visitors",
      "tourist visitor",
    ),
    word(
      "population populations",
      "the number of people who live in a place",
      "人口",
      "China has a {population} of over 1.4 billion. | The {population} of the town has doubled in ten years. | In many countries, the {population} is getting older, with more people over sixty.",
      "nation citizen",
    ),
    word(
      "capital capitals",
      "the city where a country's government is",
      "首都",
      "Canberra is the {capital} of Australia. | Rome is one of the oldest {capitals} in Europe, and the Italian government works there.|continents regions | We spent two days in Beijing, the {capital}, before going north.",
      "continent region",
    ),
    word(
      "continent continents",
      "one of the very large areas of land in the world, such as Africa or Asia",
      "大洲；大陆",
      "Asia is the largest {continent}. | There are seven {continents} on Earth.|capitals nations | Africa is a {continent} of more than fifty countries.",
      "capital nation",
    ),
    word(
      "region regions",
      "a large area of a country or of the world",
      "地区；区域",
      "This {region} of France, with its many small villages, is famous for its wine. | It rains a lot in the northern {regions} of the country.|capitals continents | Snow is common in this mountain {region} of the country in winter.",
      "capital continent",
    ),
    word(
      "foreign",
      "from or in another country",
      "外国的",
      "Besides your own, can you speak a {foreign} language? | I've never lived abroad in a {foreign} country. | I always exchange money before I travel to a {foreign} country.",
      "native bilingual",
    ),
    word(
      "bilingual",
      "able to speak two languages very well",
      "双语的",
      "Their children speak English and Chinese equally well: they are {bilingual}. | She grew up in a {bilingual} family, speaking French with her mother and English with her father. | The museum signs are {bilingual}, in Greek and English, so tourists can read them.",
      "foreign native",
      "fluent",
    ),
    word(
      "fluent",
      "able to speak a language easily and well",
      "流利的",
      "He is {fluent} in three languages. | After a year in Madrid, she could speak Spanish easily: she was {fluent}. | You don't need to be {fluent} in Italian to enjoy the trip; a few words are enough.",
      "foreign native",
      "bilingual",
    ),
    word(
      "dialect dialects",
      "a form of a language spoken in one area",
      "方言",
      "Cantonese is spoken in Guangdong, but every village has its own {dialect}, with its own words. | My grandparents speak a local {dialect} with words that I don't understand. | There are many {dialects} of Arabic, each with its own words.|accents nationalities",
      "accent nationality",
    ),
    word(
      "nationality nationalities",
      "the country that a person legally belongs to",
      "国籍",
      "What {nationality} is your new teacher? | Please write your name and {nationality} on the form. | Her passport shows her {nationality}: Brazilian.",
      "citizen nation",
    ),
    word(
      "immigrant immigrants",
      "a person who comes to live in a country from another country",
      "移民",
      "His parents were {immigrants} who left Italy to live in Canada for good.|tourists citizens | Many {immigrants} work hard to learn the language of their new home.|tourists citizens | New York was built by {immigrants} from all over the world who made it their home.|tourists citizens",
      "tourist citizen",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Bilingual* and *fluent* are both about speaking well, but *bilingual* always means two languages, and *fluent* means speaking one language easily. Look for whether the sentence counts two languages or talks about how well you speak one.",
        "*bilingual* 和 *fluent* 都和语言说得好有关，但 *bilingual* 一定是两种语言，*fluent* 是某种语言说得流畅。看句子是在说两种语言，还是在说一种语言说得多好。",
      ),
      meaning: t(
        "*Nationality* is not a country: it is the country a person legally belongs to, the one written in their passport. A *nation* is the country itself with its people. Check whether the meaning is about one person or a whole country.",
        "*nationality* 不是国家本身，而是一个人在法律上所属的国家，也就是护照上写的那个。*nation* 是国家及其人民。看清释义说的是某个人，还是整个国家。",
      ),
      spell: t(
        "*Capital* ends in -al when it means the main city; *capitol* with -ol is one building in the US. *Continent* ends in -ent.",
        "表示首都的 *capital* 以 -al 结尾；以 -ol 结尾的 *capitol* 是美国的一座建筑。*continent* 以 -ent 结尾。",
      ),
    },
    notes: `
      nation|the whole country celebrating;the United Nations of 1945;leaders from Brazil to Japan|a nation is a country and its people; a region is one part of a country|nation 是国家及其人民；region 是国家的一部分|region/regions=region is one part of a country or of the world, not a whole country with its own leaders=region 是国家或世界的一部分，不是有自己领导人的整个国家;continent/continents=continent is a huge area of land such as Asia with many countries, not one country=continent 是亚洲这样包含许多国家的大洲，不是一个国家|na · tion|the adjective is *national*, said with a short a|形容词 *national* 里 a 读短音
      citizen|a French passport;the right to vote;the people who live in a city|a citizen belongs to a country and has rights there; a tourist only visits|citizen 是有权利的国民；tourist 只是游客|tourist/tourists=tourist is someone visiting for a short time, not someone who belongs to the country and votes there=tourist 是短期游玩的人，不是属于这个国家并有投票权的人;visitor/visitors=visitor is someone who comes for a short stay, not someone who belongs to the place=visitor 是短暂来访的人，不是属于这个地方的人|cit · i · zen|-zen at the end, said like *zun*|结尾 -zen 读作 *zun*
      population|over 1.4 billion people in China;a town that doubled in ten years;more people over sixty|population is the number of people in a place; a citizen is one person|population 是人口数量；citizen 是一个公民|nation=nation is a country itself, not the number of people in it=nation 是国家本身，不是那里的人数;citizen=citizen is one person, not the number of all the people in a place=citizen 是一个人，不是一个地方的总人数|pop · u · la · tion|a population of 20 million, with *of* before the number|a population of + 数字
      capital|Canberra in Australia;Rome with the Italian government;Beijing before going north|the capital is the city where the government is; a region is a large area|capital 是政府所在的城市；region 是一大片地区|continent/continents=continent is a huge land with many countries, not one city=continent 是包含许多国家的大陆，不是一座城市;region/regions=region is a large area with many towns, not the one city where the government works=region 是包含许多城镇的地区，不是政府所在的那座城市|cap · i · tal|-al at the end; *Capitol* with -ol is one building in Washington|结尾是 -al；带 -ol 的 *Capitol* 是华盛顿的一座建筑
      continent|Asia, the largest;seven on Earth;Africa with more than fifty countries|a continent is a huge area of land with many countries; a nation is one country|continent 是有很多国家的大洲；nation 是一个国家|capital/capitals=capital is one city, not a huge land with many countries=capital 是一座城市，不是有许多国家的大片陆地;nation/nations=nation is one country, not a huge area that holds many countries=nation 是一个国家，不是包含许多国家的大片地区|con · ti · nent|-ent at the end; *content* means happy or what is inside|结尾是 -ent；*content* 是“满意的”或“内容”
      region|small villages and wine in France;the rainy north of a country;mountains with snow in winter|a region is one large area of a country; a capital is one city|region 是一国的某个地区；capital 是一座城市|capital/capitals=capital is one city where the government works, not a large area with villages and mountains=capital 是政府所在的一座城市，不是有村庄和山的大片地区;continent/continents=continent is a huge land with many countries, not one part of a single country=continent 是有许多国家的大陆，不是一个国家的一部分|re · gion|g said like j; *religion* has an extra -li-|g 读 j；*religion* 多了 -li-
      foreign|a language besides your own;life abroad in another country;exchanging money before travel|foreign means from another country; native means from your own place|foreign 是外国的；native 是本地的、母语的|native=native means from your own place or since birth, the opposite of from another country=native 是本地的、与生俱来的，正好和外国的相反;bilingual=bilingual describes a person who speaks two languages, not a country or a language from abroad=bilingual 形容说两种语言的人，不是形容外国的国家或语言|for · eign|a silent g: for-**eign**|g 不发音：for-**eign**
      bilingual|English and Chinese spoken equally well;French with a mother and English with a father;signs in Greek and English|bilingual means using two languages; fluent means speaking one language easily|bilingual 是双语的；fluent 是某种语言流利|foreign=foreign means from another country, not using two languages=foreign 是外国的，不是使用两种语言;native=native means from where you were born, not using two languages equally=native 是出生地的，不是同样使用两种语言|bi · lin · gual|bi- means two, as in *bicycle*|bi- 表示“二”，和 *bicycle* 一样
      fluent|three languages;Spanish spoken easily after a year in Madrid;a few Italian words that are enough|fluent means speaking a language easily and well; bilingual means having two languages|fluent 是说得流畅；bilingual 是会两种语言|foreign=foreign describes a language or a country from abroad, not how easily a person speaks=foreign 形容外国的语言或国家，不是一个人说得多流畅;native=native is the language you were born with, not how easily you speak one you learned=native 是生来就会的语言，不是学会的语言说得多流畅|flu · ent|fluent in a language, with *in*|be fluent in…，用 in
      dialect|village speech with its own words in Guangdong;grandparents' local words;the many forms of Arabic|a dialect has its own words and grammar; an accent is only a way of saying words|dialect 有自己的词汇和语法；accent 只是发音方式|accent/accents=accent is only the sound of how words are said, not a form of the language with its own words=accent 只是发音的方式，不是有自己词汇的语言变体;nationality/nationalities=nationality is the country you belong to, not a form of a language=nationality 是所属的国家，不是语言的变体|di · a · lect|di-a-lect; *dialogue* is a talk between people|di-a-lect；*dialogue* 是对话
      nationality|a new teacher's country;a form asking for your country;Brazilian in her passport|nationality is the country you legally belong to; a nation is the country itself|nationality 是所属国籍；nation 是国家本身|citizen=citizen is a person, not the country written about that person=citizen 是一个人，不是写在这个人身份上的国家;nation=nation is a country and its people, not one person's legal belonging to it=nation 是国家及其人民，不是一个人在法律上的归属|na · tion · al · i · ty|national + -ity|national 加 -ity
      immigrant|parents who left Italy for Canada for good;learning the language of a new home;people from all over the world building New York|an immigrant comes to live in a new country for good; a tourist only visits|immigrant 是来定居的移民；tourist 只是游客|tourist/tourists=tourist is someone who visits and goes home, not someone who moves to live in a new country=tourist 是来玩然后回家的人，不是移居新国家的人;citizen/citizens=citizen already belongs to the country, not someone who has just come from another one=citizen 本来就属于这个国家，不是刚从别国来的人|im · mi · grant|double m: im- + migrant|双写 m：im- 加 migrant
    `,
  },
});

const problems = vocabularyTopic({
  id: "b1-words-travel-problems",
  title: t("Travel Problems", "旅途中的问题"),
  summary: t(
    "Canceling; queues and lines; stuck; strikes; check-in, departures and arrivals; baggage, terminals and boarding; jets.",
    "取消；队伍和排队；被困的；罢工；登机手续、出发和到达；行李、航站楼和登机；喷气式飞机。",
  ),
  intro: t(
    "A **strike** by airport workers left us **stuck** in a long **queue** at **check-in**, and then our flight was **canceled**. These words help you explain what goes wrong on a trip and ask for help.",
    "机场工人 **strike**（罢工），让我们在 **check-in**（值机）处的长 **queue**（队伍）里 **stuck**（被困住），接着航班又被 **canceled**（取消）。这些词帮你说明旅途中出了什么问题，并寻求帮助。",
  ),
  prerequisites: ["a2-words-transport"],
  words: [
    word(
      "cancel cancels canceled canceling",
      "to decide that something planned will not happen",
      "取消",
      "Our flight was {canceled} because of the snow, so we never left.|delayed boarded | We had to {cancel} the trip when my mother got ill, and we stayed at home. | If you {cancel} your room less than a day before, you can't get your money back.|delay board",
      "delay board",
    ),
    word(
      "queue queues",
      "a line of people waiting for something",
      "队伍；排队",
      "There was a long {queue} at passport control, and we waited our turn. | Please wait your turn in the {queue} like everyone else. | This morning the {queues} at the check-in desks were so long that people waited an hour for their turn.|crowds terminals",
      "crowd terminal",
      "line",
    ),
    word(
      "stuck",
      "not able to move or to leave a place",
      "被困住的；卡住的",
      "We were {stuck} in traffic for two hours, unable to move. | The plane was late, so we were {stuck} at the airport all night with no way to leave. | The door is {stuck}. I can't open it.",
      "lost late",
    ),
    word(
      "strike strikes",
      "a time when workers stop working because they want better pay or conditions",
      "罢工",
      "The train drivers are on {strike} today. | Hundreds of flights were canceled because of the {strike} by airport workers. | Airport workers have stopped work in three {strikes} this year.|storms delays",
      "storm delay",
    ),
    word(
      "line lines",
      "a row of people or things, one behind another",
      "队伍；行",
      "We stood in a long {line} of people for an hour to buy tickets. | There's a long {line} of people outside the new restaurant. | Please form two {lines}: one for adults and one for children.|gates platforms",
      "gate platform",
      "queue",
    ),
    word(
      "check-in check-ins",
      "the place or the moment where you show your ticket at an airport or a hotel",
      "登机手续；入住登记",
      "{Check-in} at the desk, where you show your ticket and leave your bags, closes forty minutes before the flight. | We went straight to the {check-in} desk to show our tickets and drop our bags. | Online {check-in} saves a lot of time.",
      "boarding arrival",
    ),
    word(
      "departure departures",
      "leaving a place, especially on a plane, a train or a bus",
      "离开；出发",
      "Please arrive two hours before {departure}, when the plane leaves. | Look at the {departures} board to find the gate your plane leaves from.|arrivals delays | The {departure} of the train was delayed, so we left the station an hour late.",
      "arrival delay",
    ),
    word(
      "arrival arrivals",
      "reaching a place at the end of a trip",
      "到达；抵达",
      "On {arrival} in the country, after you get off the plane, please show your passport. | I'll meet you in the {arrivals} hall when you land.|departures delays | The {arrival} of the flight was delayed by an hour, so we landed at ten.",
      "departure delay",
    ),
    word(
      "baggage",
      "the bags and suitcases you take on a trip",
      "行李",
      "Each passenger may take one piece of {baggage} on the plane. | We waited forty minutes to collect our {baggage} from the belt. | Don't leave your {baggage} alone in the station: someone could take your bags.",
      "passport ticket",
    ),
    word(
      "terminal terminals",
      "a building at an airport where passengers start or end a flight",
      "航站楼；终点站",
      "Our flight leaves from the new {terminal}, the biggest building at the airport. | The airport has three {terminals}, each a separate building.|gates platforms | A free train runs between the {terminals}, the big buildings of the airport.|gates platforms",
      "gate platform",
    ),
    word(
      "boarding",
      "getting onto a plane, a ship or a train",
      "登机；上船；上车",
      "{Boarding} starts thirty minutes before the plane leaves, when passengers get on. | Show your {boarding} pass at the gate. | The captain announced that {boarding} was complete and the doors were closed.",
      "check-in departure",
    ),
    word(
      "jet jets",
      "a fast plane with engines that push it forward",
      "喷气式飞机",
      "A {jet} with wings and loud engines flew fast over the city. | Private {jets} fly fast and high across oceans.|helicopters ships | After the long flight, I had terrible {jet} lag.",
      "helicopter ship",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        '*Canceled* and *delayed* both bring bad news at the airport, but a *delayed* flight still leaves later, and a *canceled* flight does not leave at all. Look for words such as "never left" or "stayed at home".',
        "*canceled* 和 *delayed* 在机场都是坏消息，但 *delayed* 的航班晚点仍会出发，*canceled* 的航班根本不飞。留意 “never left”“stayed at home” 这样的词。",
      ),
      meaning: t(
        "*Departure* and *arrival* are opposites that learners swap: *departure* is leaving a place at the start of a trip, and *arrival* is reaching a place at the end. Check whether the meaning is about leaving or reaching.",
        "*departure* 和 *arrival* 意思相反，常被弄反：*departure* 是旅程开始时离开，*arrival* 是旅程结束时到达。看清释义说的是离开，还是到达。",
      ),
      spell: t(
        "*Queue* is spelled with ueue after the q, though it is said like *kyoo*; and *canceled* has one l in American English and two in British *cancelled*.",
        "*queue* 在 q 后写 ueue，读音却像 *kyoo*；*canceled* 美式拼写一个 l，英式 *cancelled* 两个 l。",
      ),
    },
    notes: `
      cancel|snow that kept a flight from ever leaving;a trip given up for an ill mother;a room given up less than a day before|to cancel is to stop a plan from happening; to delay is to make it happen later|cancel 是取消；delay 是推迟|delay/delayed=delay means to make something happen later, not to stop it from happening at all=delay 是推迟，不是让它根本不发生;board/boarded=board means to get on a plane or train, not to stop a plan=board 是登上飞机或火车，不是取消计划|can · cel|canceled in American English, cancelled in British English|美式 canceled，英式 cancelled
      queue|waiting our turn at passport control;everyone waiting their turn;an hour's wait at check-in desks|a queue is people waiting one after another; a crowd is many people with no order|queue 是依次排的队；crowd 是没有秩序的人群|crowd/crowds=crowd is many people together in no order, not people waiting their turn one after another=crowd 是没有顺序的一群人，不是依次等候的人;terminal/terminals=terminal is an airport building, not people waiting in a row=terminal 是机场的航站楼，不是排着队等的人|queue|q + ueue, said like *kyoo*; Americans say *line*|q 加 ueue，读作 *kyoo*；美国人说 *line*
      stuck|two hours in traffic unable to move;a night at the airport with no way to leave;a door that won't open|stuck means not able to move or leave; lost means not knowing where you are|stuck 是动不了、出不去；lost 是迷路|lost=lost means not knowing where you are, not being unable to move or leave=lost 是不知道自己在哪儿，不是动不了或离不开;late=late means after the right time, not unable to move=late 是迟到，不是动不了|stuck|be stuck in traffic · get stuck · stuck at the airport|be stuck in…，用 in 或 at
      strike|train drivers on strike;airport workers canceling flights;three stops of work this year|a strike is workers stopping work to get better pay; a storm is bad weather|strike 是罢工；storm 是暴风雨|storm/storms=storm is bad weather with wind and rain, not workers stopping their work=storm 是风雨天气，不是工人停工;delay/delays=delay is waiting longer than planned, not workers who stop working on purpose=delay 是比计划等得久，不是工人故意停工|strike|be on strike · go on strike|be on strike，用 on
      line|tickets after an hour of standing;people outside a new restaurant;one row for adults and one for children|a line is people one behind another; a gate is where you get on a plane|line 是排成的队；gate 是登机口|gate/gates=gate is the door at an airport where you get on a plane, not people standing one behind another=gate 是登机口，不是前后排着的人;platform/platforms=platform is where you wait for a train, not a row of people=platform 是等火车的站台，不是一排人|line|stand in line · wait in line, with no *a*|stand in line，不加 a
      check-in|showing your ticket and leaving bags at the desk;tickets shown and bags dropped;time saved online|check-in is where you show your ticket and leave bags; boarding is getting on the plane|check-in 是值机、托运行李；boarding 是登机|boarding=boarding is getting onto the plane at the gate, not showing your ticket and leaving bags at the desk=boarding 是在登机口上飞机，不是在柜台出示机票托运行李;arrival=arrival is reaching a place at the end of the trip, not the first desk before the flight=arrival 是旅程结束时到达，不是起飞前的值机柜台|check-in|the noun has a hyphen; the verb is *check in* with no hyphen|名词有连字符；动词 *check in* 没有
      departure|when the plane leaves;the board for the gate your plane leaves from;leaving the station an hour late|departure is leaving at the start of a trip; arrival is reaching the end|departure 是出发；arrival 是到达|arrival/arrivals=arrival is reaching a place at the end of a trip, not leaving at the start=arrival 是旅程结束时到达，不是出发时离开;delay/delays=delay is extra waiting time, not the moment you leave=delay 是多等的时间，不是出发的时刻|de · par · ture|depart + -ure|depart 加 -ure
      arrival|after getting off the plane;meeting when you land;landing at ten|arrival is reaching a place; departure is leaving it|arrival 是到达；departure 是离开|departure/departures=departure is leaving at the start of a trip, not getting off the plane at the end=departure 是开始时离开，不是到达后下飞机;delay/delays=delay is waiting longer, not the moment you reach a place=delay 是多等的时间，不是到达的时刻|ar · ri · val|double r: arrive + -al|双写 r：arrive 加 -al
      baggage|one piece on the plane;bags collected from the belt;bags left alone in the station|baggage is all your bags on a trip; a passport is a small book for travel|baggage 是旅途中所有的行李；passport 是护照|passport=passport is a small book that shows who you are, not bags you carry and collect=passport 是证明身份的小本子，不是要提取的包;ticket=ticket is a paper that lets you travel, not bags and cases=ticket 是乘车或乘机的票，不是包和箱子|bag · gage|no plural: two pieces of baggage, not two baggages|没有复数：two pieces of baggage
      terminal|the biggest building at the airport;three separate buildings;a free train between big buildings|a terminal is a whole airport building; a gate is one door inside it|terminal 是整栋航站楼；gate 是楼里的一个登机口|gate/gates=gate is one door inside the building where you get on a plane, not a whole building=gate 是楼里登机的一个口，不是一整栋楼;platform/platforms=platform is where you wait for a train, not an airport building=platform 是等火车的站台，不是机场大楼|ter · mi · nal|-al at the end, as in *final*|结尾是 -al，和 *final* 一样
      boarding|passengers getting on before the plane leaves;a pass shown at the gate;closed doors announced by the captain|boarding is getting onto a plane; check-in is showing your ticket and leaving bags|boarding 是登机；check-in 是值机|check-in=check-in is showing your ticket and leaving bags at a desk, not getting onto the plane=check-in 是在柜台出示机票、托运行李，不是登上飞机;departure=departure is the plane leaving, not passengers getting on it=departure 是飞机起飞离开，不是乘客登机|board · ing|a boarding pass · boarding starts · boarding is complete|a boarding pass，不说 a board pass
      jet|wings and loud engines over the city;fast, high flights across oceans;tiredness after a long flight|a jet is a fast plane with wings; a helicopter goes up with turning blades on top|jet 是有机翼的快速飞机；helicopter 靠顶上的旋翼升空|helicopter/helicopters=helicopter goes up with turning blades on top, not a fast plane with wings that crosses oceans=helicopter 靠顶上的旋翼飞，不是能飞越大洋的有翼快速飞机;ship/ships=ship goes on the sea, not in the air=ship 在海上航行，不在天上飞|jet|jet lag · a private jet|jet lag 是“时差反应”
    `,
  },
});

const places = vocabularyTopic({
  id: "b1-words-describing-places-2",
  title: t("Adjectives for Places", "描述地方的形容词"),
  summary: t(
    "Ancient and medieval; magnificent, spectacular and picturesque; lively and charming; industrial and isolated; coastal, tropical and vast.",
    "古代的和中世纪的；宏伟的、壮观的和风景如画的；热闹的和迷人的；工业的和偏僻的；沿海的、热带的和广阔的。",
  ),
  intro: t(
    "The **ancient** port is now a **lively** **coastal** town, with **medieval** walls, **charming** cafés and a **magnificent** view of the sea. These words help you describe a place so that others can picture it.",
    "这座 **ancient**（古老的）港口如今是一座 **lively**（热闹的）**coastal**（沿海的）小城，有 **medieval**（中世纪的）城墙、**charming**（迷人的）咖啡馆，还能看到 **magnificent**（壮丽的）海景。这些词帮你描述一个地方，让别人能想象出它的样子。",
  ),
  prerequisites: ["a2-words-describing-places"],
  words: [
    word(
      "ancient",
      "very old; from a time thousands of years ago",
      "古代的；古老的",
      "The museum has a collection of {ancient} Egyptian art from thousands of years ago. | Some of these {ancient} trees are two thousand years old. | The {ancient} Greeks built many temples 2,500 years ago.",
      "modern tropical",
      "medieval",
    ),
    word(
      "medieval",
      "from the period between about 500 and 1500 in Europe",
      "中世纪的",
      "We walked around the {medieval} castle, built in the year 1200. | The town still has its {medieval} walls from 800 years ago. | Life in {medieval} times, a thousand years ago, was hard for most people.",
      "modern tropical",
      "ancient",
    ),
    word(
      "magnificent",
      "very beautiful and impressive",
      "宏伟的；壮丽的",
      "The palace was {magnificent}, with gold everywhere. | From our room, the view of the lake and the snowy mountains was {magnificent}. | The cathedral, with its huge golden dome, is {magnificent}.",
      "ordinary industrial",
      "spectacular picturesque",
    ),
    word(
      "spectacular",
      "very exciting to look at",
      "壮观的；惊人的",
      "The fireworks were {spectacular}, filling the whole sky with color. | There are {spectacular} waterfalls, a hundred meters high, in this park. | The goal that won the game was {spectacular}: a kick from the middle of the field.",
      "ordinary medieval",
      "magnificent",
    ),
    word(
      "picturesque",
      "pretty, like a picture",
      "风景如画的",
      "The village by the lake, with its flowers and old houses, is {picturesque}. | The old harbor, with its colorful boats, is very {picturesque}. | The little town with narrow streets looks {picturesque}, like a painting.",
      "industrial ugly",
      "charming magnificent",
    ),
    word(
      "lively",
      "full of life, people and activity",
      "热闹的；活跃的",
      "The market is {lively} and noisy, full of people shouting. | The area where we stayed was {lively}, full of bars and cafés. | The streets are {lively} until late at night, with music and crowds.",
      "isolated peaceful",
    ),
    word(
      "charming",
      "pleasant and attractive",
      "迷人的；可爱的",
      "The little hotel near the old town was {charming}, with flowers on every balcony. | The village is {charming}, and every visitor wants to stay longer. | Our old guide was {charming} and told funny stories all day.",
      "industrial boring",
      "picturesque",
    ),
    word(
      "industrial",
      "having many factories",
      "工业的",
      "Manchester was an important {industrial} city, full of factories. | The river is polluted by {industrial} waste from the factories. | The town has changed: its old {industrial} area, once full of factories, is now a park.",
      "coastal tropical",
    ),
    word(
      "isolated",
      "far away from other places or people",
      "偏僻的；孤立的",
      "Their farm in the mountains is {isolated}: the nearest neighbor is twenty kilometers away. | The island is very {isolated}; the boat comes once a week. | Old people can feel {isolated} if they live alone.",
      "lively crowded",
    ),
    word(
      "coastal",
      "on or near the sea",
      "沿海的",
      "Qingdao, a city in the east of China, is {coastal}: it lies right by the sea. | {Coastal} areas often have strong winds from the sea. | The {coastal} road has wonderful views of the sea.",
      "tropical industrial",
    ),
    word(
      "tropical",
      "from or in the hottest parts of the world",
      "热带的",
      "Bananas and mangoes are {tropical} fruits. | The island has a {tropical} climate, hot and wet all year. | We saw colorful birds in the hot {tropical} forest near the equator.",
      "coastal medieval",
    ),
    word(
      "vast",
      "very large",
      "巨大的；辽阔的",
      "The Sahara is a {vast} desert. | A {vast} crowd of a million people watched the parade. | Russia, the biggest country in the world, is {vast}.",
      "tiny crowded",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Ancient* and *medieval* both mean old, but *ancient* goes back thousands of years, to Egypt or Greece, and *medieval* means the time of castles in Europe, between about 500 and 1500. Look at the dates and the people in the sentence.",
        "*ancient* 和 *medieval* 都是“古老的”，但 *ancient* 可追溯到几千年前的埃及、希腊，*medieval* 指欧洲有城堡的时代，约公元 500 到 1500 年。看句中的年代和人物。",
      ),
      meaning: t(
        "*Isolated* and *lively* are opposites: *isolated* means far from other people and places, and *lively* means full of people and activity. Check whether the meaning is about being alone or busy.",
        "*isolated* 和 *lively* 意思相反：*isolated* 是远离人群和其他地方，*lively* 是满是人和活动。看清释义说的是冷清孤立，还是热闹。",
      ),
      spell: t(
        "*Picturesque* ends in -esque, said like *esk*, and *medieval* has ie then e: med-i-e-val.",
        "*picturesque* 以 -esque 结尾，读作 *esk*；*medieval* 中间是 ie 再接 e：med-i-e-val。",
      ),
    },
    notes: `
      ancient|Egyptian art from thousands of years ago;trees two thousand years old;Greeks building temples 2,500 years ago|ancient means thousands of years old; medieval means from the time of castles in Europe|ancient 是几千年前的；medieval 是欧洲城堡时代的|modern=modern means new and from our own time, the opposite of thousands of years old=modern 是现代的、新的，正好和几千年前相反;tropical=tropical means from the hottest parts of the world, not very old=tropical 是热带的，不是古老的|an · cient|c said like *sh*: *AYN-shent*|c 读作 *sh*：*AYN-shent*
      medieval|a castle built in 1200;walls from 800 years ago;hard lives a thousand years ago|medieval means from about 500 to 1500 in Europe; modern means from our time|medieval 是中世纪的；modern 是现代的|modern=modern means from our own time, not from a thousand years ago=modern 是当代的，不是一千年前的;tropical=tropical means from the hot parts of the world, not from a time in history=tropical 是热带地区的，不是历史上的某个年代|me · di · e · val|ie and then e: med-i-e-val|ie 后再接 e：med-i-e-val
      magnificent|a palace with gold everywhere;a lake below snowy mountains;a cathedral with a huge golden dome|magnificent means very beautiful and grand; ordinary means not special at all|magnificent 是宏伟壮丽的；ordinary 是普通的|ordinary=ordinary means not special at all, the opposite of very grand and beautiful=ordinary 是普通的，正好和宏伟壮丽相反;industrial=industrial means full of factories, not grand and beautiful=industrial 是有很多工厂的，不是宏伟壮丽的|mag · nif · i · cent|-cent at the end, said like *sent*|结尾 -cent 读作 *sent*
      spectacular|fireworks filling the sky with color;waterfalls a hundred meters high;a winning kick from the middle of the field|spectacular means very exciting to watch; magnificent is more about grand beauty|spectacular 侧重壮观刺激；magnificent 侧重宏伟美丽|ordinary=ordinary means not special at all, the opposite of very exciting to look at=ordinary 是普通的，正好和精彩壮观相反;medieval=medieval means from about 500 to 1500, not exciting to look at=medieval 是中世纪的，不是看起来精彩的|spec · tac · u · lar|-ar at the end; *spectator* is a person who watches|结尾是 -ar；*spectator* 是观众
      picturesque|a lake village with flowers and old houses;a harbor with colorful boats;narrow streets like a painting|picturesque means pretty like a painting; ugly means not nice to look at|picturesque 是如画的；ugly 是难看的|industrial=industrial means full of factories, not pretty like a painting=industrial 是满是工厂的，不是美得像画;ugly=ugly means not nice to look at, the opposite of pretty like a picture=ugly 是难看的，正好和如画般美相反|pic · tur · esque|picture + -esque, said like *esk*, with the e of picture dropped|picture 去 e 加 -esque，读作 *esk*
      lively|a noisy market with people shouting;bars and cafés;music and crowds late at night|lively means full of people and activity; peaceful means calm and quiet|lively 是热闹的；peaceful 是安静祥和的|isolated=isolated means far from other people, the opposite of full of people=isolated 是远离人群的，正好和人多热闹相反;peaceful=peaceful means calm and quiet, not noisy and full of activity=peaceful 是安静祥和的，不是喧闹忙碌的|live · ly|i said like *eye*, as in *alive*; *lovely* means beautiful|i 读作 *eye*，和 *alive* 一样；*lovely* 是“可爱的”
      charming|a little hotel with flowers on every balcony;a village every visitor wants to stay longer in;a guide with funny stories|charming means pleasant and attractive; boring means not interesting|charming 是迷人的；boring 是无聊的|industrial=industrial means full of factories, not pleasant and attractive=industrial 是满是工厂的，不是迷人可爱的;boring=boring means not interesting, the opposite of pleasant and attractive=boring 是无聊的，正好和迷人相反|charm · ing|charm + -ing; *charging* means asking for money|charm 加 -ing；*charging* 是“收费”
      industrial|Manchester full of factories;waste from factories in a river;an old factory area turned into a park|industrial means having many factories; coastal means by the sea|industrial 是工业的；coastal 是沿海的|coastal=coastal means by the sea, not full of factories=coastal 是靠海的，不是满是工厂的;tropical=tropical means in the hottest parts of the world, not full of factories=tropical 是热带的，不是满是工厂的|in · dus · tri · al|industry + -al; *industrious* means hard-working|industry 加 -al；*industrious* 是“勤劳的”
      isolated|the nearest neighbor twenty kilometers away;a boat once a week;old people living alone|isolated means far from others; crowded means full of people|isolated 是偏僻孤立的；crowded 是拥挤的|lively=lively means full of people and activity, the opposite of far from others=lively 是热闹的，正好和远离人群相反;crowded=crowded means full of people, the opposite of far away and alone=crowded 是拥挤的，正好和偏僻孤单相反|i · so · lat · ed|i said like *eye*: *EYE-so-late-id*|i 读作 *eye*：*EYE-so-late-id*
      coastal|Qingdao by the sea;strong winds from the sea;a road with views of the sea|coastal means on or near the sea; tropical means in the hottest parts of the world|coastal 是沿海的；tropical 是热带的|tropical=tropical means in the hottest parts of the world, not by the sea=tropical 是热带的，不是靠海的;industrial=industrial means full of factories, not near the sea=industrial 是满是工厂的，不是靠海的|coast · al|coast + -al; *costly* means expensive|coast 加 -al；*costly* 是“昂贵的”
      tropical|bananas and mangoes;hot, wet weather all year;a hot forest near the equator|tropical means from the hottest parts of the world; coastal means near the sea|tropical 是热带的；coastal 是沿海的|coastal=coastal means near the sea, not from the hottest parts of the world=coastal 是沿海的，不是热带的;medieval=medieval means from about 500 to 1500, not from a hot part of the world=medieval 是中世纪的，不是热带的|trop · i · cal|-ical at the end; *typical* means usual|结尾是 -ical；*typical* 是“典型的”
      vast|the Sahara desert;a crowd of a million people;Russia, the biggest country|vast means very large; tiny means very small|vast 是辽阔巨大的；tiny 是很小的|tiny=tiny means very small, the opposite of very large=tiny 是很小的，正好和巨大相反;crowded=crowded means full of people, not very large in size=crowded 是挤满人的，不是面积大的|vast|a said like *ah* in British English and like *a* in *cat* in American English|英式 a 读 *ah*，美式读 *cat* 里的 a
    `,
  },
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
  const takesThe = /^the /iu.test(right);
  return t(
    `${rule.en}: ${sentence}\n\n**Check.** Ask whether the noun is a specific/the-taking place or general: here it ${takesThe ? "takes *the*" : "takes no article"}.`,
    `${rule["zh-CN"]}：${sentence}\n\n**检验。** 判断这里是特指/需加 *the* 的地名，还是泛指/不加冠词的地名：此处${takesThe ? "加 *the*" : "不加冠词"}。`,
  );
};

/** whyNotArticle explains a wrong option with the, a or no article. */
const whyNotArticle = (wrong: string, right: string, shown: string): Text => {
  const noun = nounIn(right, shown);
  if (/^an? /iu.test(wrong))
    return placeItems.some(([s]) => s === shown)
      ? t("*a* and *an* never go before the name of a place.", "地名前不能用 *a* 或 *an*。")
      : t(
          `*a* and *an* mean just one single item, not ${shown.endsWith("(in general)") ? `${noun} in general` : `the particular ${noun} the sentence specifies`}.`,
          `*a* 和 *an* 只表示“某一个”，不是${shown.endsWith("(in general)") ? "泛指这一类事物" : "句子特指的那些事物"}。`,
        );
  if (/^the /iu.test(wrong))
    return shown.endsWith("(in general)")
      ? t(
          `*${wrong}* points to particular ${noun}, but this sentence talks about ${noun} in general.`,
          `*${wrong}* 表示特指某些 ${noun}，而这句是泛指。`,
        )
      : t(`This place name (*${noun}*) belongs to the group that takes no article.`, `地名 *${noun}* 属于不加冠词的类别。`);
  return placeItems.some(([s]) => s === shown)
    ? t(
        `This place name (*${noun}*) belongs to the group (rivers, oceans, ranges, plural countries) that requires an article.`,
        `地名 *${noun}* 属于河流、海洋、山脉或复数国名等必须加冠词的类别。`,
      )
    : t(
        `Without an article, *${wrong}* means ${noun} in general, but the sentence specifies which ${noun} are meant.`,
        `不加冠词的 *${wrong}* 是泛指，可句子已经限定了具体是哪些 ${noun}。`,
      );
};

/** articleFixWhy explains the corrected article in a sentence to write again. */
const articleFixWhy = (right: string, shown: string): Text => {
  const bare = shown.replace(/ \(in general\)$/u, "");
  const item = interleave([generalChoice, placeChoice]).find(
    ([s, r, w]) =>
      bare === s.replace(/ \(in general\)$/u, "").replace("___", w[0] ?? "") &&
      right === s.replace(/ \(in general\)$/u, "").replace("___", r),
  );
  if (!item)
    return t(
      `${right}\n\n**Check.** Verify whether the noun is general or specific, and check capitalization at the start of the sentence.`,
      `${right}\n\n**检验。** 核对名词是泛指还是特指，并检查句首大写。`,
    );
  const rule = articleRule(item[1], item[0]);
  return t(
    `${rule.en}: ${right}\n\n**Check.** Re-read the corrected sentence: the article now matches the meaning/place-name rule, and the rest of the sentence is unchanged.`,
    `${rule["zh-CN"]}：${right}\n\n**检验。** 重读改正后的句子：冠词已符合泛指/特指或地名规则，句子其余部分保持不变。`,
  );
};

const articles: TopicDef = {
  id: "articles-in-general-and-specific",
  title: t("The or No Article", "用 the 还是不用冠词"),
  summary: t(
    "Tea is popular in China, but the tea in this cup is cold. Things in general take no article; particular things take the; most countries and cities take none.",
    "Tea is popular in China，但 the tea in this cup is cold。泛指事物不用冠词，特指用 the；大多数国名和城市名前不用冠词。",
  ),
  intro: t(
    "Compare *Music helps people relax* (music in general—no article) with *The music at that festival was unforgettable* (specific music—*the*). Place names follow their own clear split too: *Japan* and *Mount Fuji*, but *the Pacific* and *the Alps*.",
    "比较 *Music helps people relax*（泛指音乐，不加冠词）和 *The music at that festival was unforgettable*（特指那场音乐节的音乐，加 *the*）。地名也有清晰分界：*Japan*、*Mount Fuji* 不加，而 *the Pacific*、*the Alps* 要加 *the*。",
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
        "When you talk about a kind of thing **in general**, use a plural noun or an uncountable noun with **no article**:\n\n- *Cats sleep a lot.* (all cats)\n- *Tea is popular in China.* (tea in general)\n\nWhen you mean **particular** things, the ones you can point to or that the sentence tells you about, use *the*:\n\n- *The cats next door are noisy.* (those cats)\n- *The tea in this cup is cold.* (this tea)\n\n> **Watch out.** Do not add *the* before a general plural or uncountable noun (*The tea is popular in China* narrows it to one specific tea), and never put *a/an* before a plural or uncountable noun.",
        "泛指**一类事物**时，用复数名词或不可数名词，**不加冠词**：\n\n- *Cats sleep a lot.*（所有的猫）\n- *Tea is popular in China.*（泛指茶）\n\n指**特定的**事物，也就是能指出来的、或者句子里说明了是哪些的事物，用 *the*：\n\n- *The cats next door are noisy.*（隔壁那几只猫）\n- *The tea in this cup is cold.*（这杯茶）\n\n> **注意。** 泛指一类事物时不要多加 *the*（*The tea is popular in China* 会变成特指某一种茶），也不要在复数或不可数名词前用 *a/an*。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), generalChoice, articleWhy, whyNotArticle),
    ),
    point(
      "places",
      t("The with names of places", "地名前的 the"),
      t(
        "Most names of places take **no article**: countries (*China, Japan*), cities (*Paris*), continents (*Asia*), streets (*Oxford Street*) and single mountains (*Mount Fuji*).\n\nThese take ***the***:\n\n- rivers, seas and oceans: *the Yangtze, the Mediterranean, the Pacific*\n- mountain ranges and deserts: *the Alps, the Himalayas, the Sahara*\n- countries with *United* or a plural name: *the United States, the United Kingdom, the Netherlands, the Philippines*\n- some famous places: *the Great Wall, the Amazon*\n\n> **Watch out.** Separate single mountains (*Mount Fuji*—no *the*) from mountain ranges (*the Alps*—with *the*), and plain country names (*Japan*) from plural/union names (*the United States*).",
        "大多数地名前**不加冠词**：国家（*China, Japan*）、城市（*Paris*）、大洲（*Asia*）、街道（*Oxford Street*）和单座山峰（*Mount Fuji*）。\n\n下面这些要加 ***the***：\n\n- 河流、海和大洋：*the Yangtze, the Mediterranean, the Pacific*\n- 山脉和沙漠：*the Alps, the Himalayas, the Sahara*\n- 名字里有 *United* 或是复数形式的国家：*the United States, the United Kingdom, the Netherlands, the Philippines*\n- 一些著名的地方：*the Great Wall, the Amazon*\n\n> **注意。** 分清单座山峰（*Mount Fuji* 不加 *the*）和山脉（*the Alps* 加 *the*），分清普通国名（*Japan*）和复数或带 *United* 的国名（*the United States*）。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), placeChoice, articleWhy, whyNotArticle),
    ),
    point(
      "correct",
      t("Correcting the article", "改正冠词"),
      t(
        "Each sentence has one mistake with *the*: it is there when the sentence is about things in general or a country or city (*The China is huge.* → *China is huge.*), or it is missing before particular things or a river, sea or mountain range (*Yangtze is long.* → *The Yangtze is long.*). *(in general)* is only a cue—do not copy it.\n\n> **Watch out.** When you add or remove *The* at the start of a sentence, adjust capitalization on the first word (*The music* ↔ *Music*, *the Alps* ↔ *The Alps*).",
        "每个句子都有一处 *the* 用错了：泛指事物、普通国名或城市名前多了 *the*（*The China is huge.* → *China is huge.*），或特指事物、河流、海洋、山脉前少了 *the*（*Yangtze is long.* → *The Yangtze is long.*）。*(in general)* 只是提示，不要抄进答案。\n\n> **注意。** 在句首增删 *The* 时，记得同步调整句首字母的大小写（*The music* ↔ *Music*）。",
      ),
      typedGenerator(
        "sentence",
        t("Correct the mistake with the article and write the sentence.", "改正冠词的错误，写出句子。"),
        articleTyped,
        articleFixWhy,
        articlesInGeneralAndSpecificCorrectNot,
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
  intro: t(
    "A memorable short story picks up from the opening line, builds a turning point, and lands a satisfying ending—blending past simple events (*The lights went out*), past continuous atmosphere (*Snow was falling*), and a line of speech.",
    "好故事会顺着开头第一句展开，在中间制造转折或难题，最后给出有力结局——把一般过去时事件（*The lights went out*）、过去进行时氛围（*Snow was falling*）和一两句对话自然融合。",
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
      "A good short story has a shape:\n\n- **A beginning** that starts from the first line you are given and tells the reader who, where and when.\n- **A problem** or a surprise in the middle: something goes wrong or something unexpected happens.\n- **An ending** that tells how the problem was solved or what the people learned.\n\nTell the story in the **past**: the past simple for the main events (*I opened the door*), the past continuous for the background (*It was raining*), and the past perfect for something earlier (*I had left my key at home*). Make it come alive with details and a line or two of dialogue.\n\n> **Watch out.** Do not slip into the present tense mid-story, and make sure your story genuinely continues the given first sentence rather than ignoring it.",
      "一个好的短故事要有结构：\n\n- **开头**：从给出的第一句接着写，交代人物、地点和时间。\n- **中间有问题**或意外：出了差错，或者发生了没想到的事。\n- **结尾**：说明问题怎样解决了，或者人物明白了什么。\n\n故事用**过去的时态**讲：主要事件用一般过去时（*I opened the door*），背景用过去进行时（*It was raining*），更早发生的事用过去完成时（*I had left my key at home*）。加上细节和一两句带引号的对话让故事更生动。\n\n> **注意。** 不要写到一半滑回现在时，并确保情节自然承接题目给出的第一句，而不是另起炉灶。",
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
