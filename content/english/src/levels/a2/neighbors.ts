// A2, unit 3: Neighbors and Community. The neighborhood, helping out, people around us, describing places, and mine
// and myself; possessive pronouns; comparisons judged by rules and a place described for a model.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, interleave, pairUp, vocabularyTopic, word } from "../words.ts";
import { fill, judgedTopic } from "./kit.ts";
import { possessivePronounsFixNot, writingComparisonsMostNot, writingComparisonsWriteNot } from "./mistakes.ts";

const neighborhood = vocabularyTopic({
  id: "a2-words-neighborhood",
  title: t("The Neighborhood", "街区"),
  summary: t(
    "Neighbors and neighborhoods, areas, villages and centers, squares, markets, fountains, churches, bakeries and playgrounds.",
    "邻居和街区、地区、村庄和中心、广场、市场、喷泉、教堂、面包店和游乐场。",
  ),
  intro: t(
    "Our **neighborhood** has a small **square** with a **fountain**, a **bakery** that opens at six and a **playground** for the children. These words help you describe the place where you live and the people around you.",
    "我们的 **neighborhood**（街区）有一个带 **fountain**（喷泉）的小 **square**（广场），一家六点开门的 **bakery**（面包店），还有一个给孩子们玩的 **playground**（游乐场）。这些词帮你描述自己住的地方和身边的人。",
  ),
  prerequisites: ["a1-words-town"],
  words: [
    word(
      "neighbor neighbors",
      "a person who lives next to you or near you",
      "邻居",
      "Our {neighbor} Mrs. Lee lives in the house next to ours and has a big garden. | The {neighbors} who live on our street are very friendly: we have known them for years.|strangers guests | I borrowed some eggs from my {neighbor}, who lives next door.",
      "stranger guest",
    ),
    word(
      "neighborhood neighborhoods",
      "the area around your home, and the people who live there",
      "街区；社区",
      "There's a nice park in our {neighborhood}, two streets from our flat in the city. | This is a quiet {neighborhood} of the city, with lots of trees. | Everyone in our {neighborhood} knows Mr. Green, who has lived on our city street for fifty years.",
      "neighbor village",
      "area",
    ),
    word(
      "area areas",
      "a part of a town, a country or a place",
      "地区；区域",
      "We live in a quiet {area} of the city, far from the busy center. | The north {area} of the city has many shops and cafes. | There's a play {area} for children in one corner of the park.",
      "center village",
      "neighborhood",
    ),
    word(
      "village villages",
      "a very small town in the country",
      "村庄",
      "My grandparents live in a tiny {village} in the mountains with only twenty houses. | There is only one shop in the whole {village}, and the nearest town is far away. | There are only 200 people in our {village}.",
      "town city",
    ),
    word(
      "center centers",
      "the middle of something; the main part of a town",
      "中心",
      "We live right in the {center} of the city, the busy main part with all the big shops. | The table is in the {center} of the room, with chairs all around it. | The new sports {center} is a big building with a pool and a gym.",
      "corner side",
    ),
    word(
      "local",
      "of the place near you",
      "当地的",
      "We buy fruit from the {local} market, just down the street. | She works at the {local} hospital, five minutes from her home. | The {local} people, who were born in this town, are very friendly.",
      "foreign national",
    ),
    word(
      "square squares",
      "an open area with buildings around it in a town",
      "广场",
      "There's a big Christmas tree in the town {square}, which has old buildings on all four sides. | People dance in the {square} in the middle of the town, with buildings all around it. | Let's meet by the fountain in the {square}, the open place where four streets meet.",
      "village street",
    ),
    word(
      "market markets",
      "a place where people buy and sell food and other things, often outside",
      "市场",
      "We buy fresh vegetables from farmers at the outdoor {market}. | Every Saturday morning, farmers sell food from their tables at the open-air {market} in the square. | There's an outdoor fish {market} by the sea, where fishermen sell fish from their boats.",
      "shop supermarket",
    ),
    word(
      "fountain fountains",
      "a thing that sends water up into the air, often in a square or a park",
      "喷泉",
      "The children are playing in the water that jumps up from the {fountain}. | There's a beautiful {fountain} in the middle of the square, sending water high into the air. | People throw coins into the {fountain}, and its water shoots up into the air.",
      "pool lake",
    ),
    word(
      "church churches",
      "a building where Christians pray",
      "教堂",
      "They got married in an old {church}, where Christians pray every Sunday. | On Sunday, many Christians go to {church} to pray. | We heard the {church} bells ringing, calling Christians to pray.",
      "temple museum",
    ),
    word(
      "bakery bakeries",
      "a shop that makes and sells bread and cakes",
      "面包店",
      "I bought some bread at the {bakery}, the shop that makes it fresh every morning. | The {bakery} on our street sells only bread and cakes, and it opens at six. | My aunt works in a {bakery}, a shop where she makes cakes to sell.",
      "restaurant kitchen",
    ),
    word(
      "playground playgrounds",
      "a place outside where children play",
      "游乐场；操场",
      "The children are on the swings and slides in the school {playground}. | At break time, we run outside and play in the school {playground}. | There's a new {playground} with swings in the park.",
      "park classroom",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Neighbor* is a person and *neighborhood* is a place: you borrow eggs from a *neighbor*, but there is a park in your *neighborhood*. Ask whether the gap is someone who lives near you or the area itself.",
        "*neighbor* 是人，*neighborhood* 是地方：你向 *neighbor*（邻居）借鸡蛋，而公园在你的 *neighborhood*（街区）里。看空格说的是住在附近的人，还是那片地方本身。",
      ),
      meaning: t(
        "A *market* and a *square* are both open places in a town, but at a *market* people sell food from tables, and a *square* is the open place itself, with buildings all around it.",
        "*market* 和 *square* 都是镇上的露天场所，但 *market* 是人们摆摊卖食物的地方，*square* 是四周有建筑的空地本身。",
      ),
      spell: t(
        "*Neighbor* has a silent gh: n · e · i · g · h · b · o · r, and British English writes *neighbour*. *Bakery* keeps the e of *bake*: bak · er · y.",
        "*neighbor* 里的 gh 不发音：n · e · i · g · h · b · o · r，英式英语写作 *neighbour*。*bakery* 保留 *bake* 的 e：bak · er · y。",
      ),
    },
    notes: `
      neighbor|Mrs. Lee in the house next to ours;people on our street known for years;someone next door who lent some eggs|a neighbor is a person who lives near you; a stranger is a person you do not know|neighbor 是住在你附近的人；stranger 是你不认识的人|stranger/strangers=stranger is a person you do not know, not someone you know who lives near you=stranger 是你不认识的人，不是你认识、住在附近的人;guest/guests=guest is a person who visits your home for a short time, not someone who lives near you=guest 是来你家短暂做客的人，不是住在你附近的人|neigh · bor|neigh said like *nay*, with a silent gh|neigh 读作 *nay*，gh 不发音
      neighborhood|a park two streets from a city flat;a quiet part of a city with trees;everyone around a city street where Mr. Green has lived|a neighborhood is the area around your home; a neighbor is one person who lives near you|neighborhood 是你家周围的那片地方；neighbor 是住在附近的某个人|neighbor=neighbor is one person who lives near you, not the area around your home=neighbor 是住在附近的某个人，不是你家周围的那片地方;village=village is a small place in the country, not a part of a city=village 是乡下的小地方，不是城市的一部分|neigh · bor · hood|neighbor + -hood, one word|neighbor 加 -hood，合成一个词
      area|a quiet part of a city far from the center;the north part of a city with shops and cafes;a place to play in one corner of a park|an area is any part of a place; the center is its middle or main part|area 是某地的任何一部分；center 是它的中间或主要部分|center=center is the middle or main part of a place, not any part of it=center 是某地的中间或主要部分，不是随便哪一部分;village=village is a small place in the country, not a part of a city or a park=village 是乡下的小地方，不是城市或公园的一部分|ar · e · a|three parts, and a at both ends|分三个音节，两头都是 a
      village|a tiny place in the mountains with twenty houses;a place with one shop far from a town;a place with only 200 people|a village is a very small place in the country; a town is bigger|village 是乡下很小的地方；town 比它大|town=town is bigger than a village, with many shops and streets=town 比村庄大，有许多商店和街道;city=city is a very big place with thousands of people and many shops=city 是很大的地方，有成千上万的人和许多商店|vil · lage|the double l, and -age said like *idge*|双写 l，结尾 -age 读作 *idge*
      center|the busy main part of a city with big shops;a place in a room with chairs all around it;a big sports building with a pool and a gym|the center is the middle or main part; a corner is where two sides meet|center 是中间或主要部分；corner 是两边相交的地方|corner=corner is where two sides or streets meet, not the middle or main part of something=corner 是两边或两条街相交的地方，不是中间或主要部分;side=side is the edge or one part of something, not its middle or main part=side 是某物的边或一侧，不是中间或主要部分|cen · ter|-er at the end; British English writes *centre*|结尾是 -er；英式英语写作 *centre*
      local|a market just down the street;a hospital five minutes from home;people born in this town|local means of the place near you; foreign means from another country|local 是本地的；foreign 是外国的|foreign=foreign means from another country, not from the place near you=foreign 是来自别的国家的，不是你附近这个地方的;national=national means of the whole country, not of one small place near you=national 是整个国家的，不是你附近某个小地方的|lo · cal|-al at the end|结尾是 -al
      square|a Christmas tree in a town place with buildings on four sides;dancing in the middle of a town with buildings all around;meeting where four streets meet|a square is an open place in a town with buildings all around; a street is a road with buildings on two sides|square 是城镇里四周有建筑的空地；street 是两边有房子的路|village=village is a small place in the country, not an open place in a town=village 是乡下的小地方，不是城镇里的空地;street=street is a road with buildings on two sides, not an open place with buildings all around=street 是两边有房子的路，不是四周有建筑的空地|square|qu said like kw, and -are at the end|qu 读作 kw，结尾是 -are
      market|vegetables from farmers outside;food sold from tables in a square on Saturday;fish sold from boats by the sea|a market is many sellers outside; a shop is one store inside a building|market 是露天的许多摊位；shop 是建筑里的一家店|shop=shop is one store inside a building, not many sellers outside=shop 是建筑里的一家店，不是露天的许多卖家;supermarket=supermarket is one big store inside a building, not sellers at tables outside=supermarket 是建筑里的一家大店，不是在露天摆摊的卖家|mar · ket|-et at the end|结尾是 -et
      fountain|water jumping up where children play;something in a square sending water into the air;coins thrown into water that shoots up|a fountain sends water up into the air; a pool is water you swim in|fountain 把水喷向空中；pool 是游泳的水池|pool=pool is water you swim in, and it does not send water up into the air=pool 是游泳的水池，不会把水喷向空中;lake=lake is a big area of still water, and it does not send water up into the air=lake 是一大片平静的水，不会把水喷向空中|foun · tain|ou as in *out*, and -ain said like *in*|ou 和 *out* 里的一样，-ain 读作 *in*
      church|an old building where a couple married and Christians pray;where Christians go to pray on Sunday;bells calling Christians to pray|a church is where Christians pray; a temple is where Buddhists and others pray|church 是基督徒祈祷的地方；temple 是佛教徒等祈祷的庙宇|temple=temple is a building where Buddhists and some others pray, not where Christians go=temple 是佛教徒等人祈祷的庙宇，不是基督徒去的地方;museum=museum is a building where you look at old and famous things, not where people pray=museum 是参观古老名贵物品的地方，不是人们祈祷的地方|church|ch at both ends|开头和结尾都是 ch
      bakery|a shop that makes bread fresh every morning;a shop on our street selling only bread and cakes;a shop where an aunt makes cakes to sell|a bakery is a shop that makes and sells bread and cakes; a restaurant is where you sit and eat meals|bakery 是做面包和蛋糕来卖的店；restaurant 是坐下吃饭的地方|restaurant=restaurant is a place where you sit and eat meals, not a shop that sells only bread and cakes=restaurant 是坐下吃饭的地方，不是只卖面包和蛋糕的店;kitchen=kitchen is a room in a home where you cook, not a shop on a street=kitchen 是家里做饭的房间，不是街上的店|bak · er · y|bake + -ery, with the e of *bake* kept|bake 加 -ry，保留 *bake* 的 e
      playground|swings and slides at a school;playing outside at break time;a new place with swings in a park|a playground is a place outside where children play; a park is a big green place in a town|playground 是孩子们在户外玩的地方；park 是城里的大片绿地|park=park is a big green public place in a town, not a small place to play inside a school or a park=park 是城里的大片公共绿地，不是学校或公园里的小游乐区;classroom=classroom is a room indoors where you have lessons, not a place outside to play=classroom 是上课的室内房间，不是户外玩耍的地方|play · ground|play + ground, one word|play + ground，合成一个词
    `,
  },
});

const helping = vocabularyTopic({
  id: "a2-words-community-actions",
  title: t("Helping Out", "互相帮助"),
  summary: t(
    "Sharing, joining, volunteering, collecting, planting, repairing, organizing, raising, protecting and noticing.",
    "分享、加入、做志愿者、收集、种植、修理、组织、募集、保护和注意。",
  ),
  intro: t(
    "On Saturday our class will **organize** a clean-up in the park: **volunteers** will **collect** old bottles and **plant** young trees. These words help you talk about working together and helping the people around you.",
    "星期六我们班要在公园 **organize**（组织）一次大扫除：**volunteers**（志愿者）会 **collect**（收集）旧瓶子，还会 **plant**（种）小树。这些词帮你谈论一起做事、帮助身边的人。",
  ),
  prerequisites: ["a2-words-neighborhood"],
  words: [
    word(
      "share shares shared sharing",
      "to have or use something with other people",
      "分享",
      "Let's {share} the cake: one piece for each of us. | I {share} a room with my brother. | Thanks for {sharing} your lunch with me.|borrowing lending",
      "borrow lend",
    ),
    word(
      "join joins joined joining",
      "to become a member of a group; to come together with",
      "加入",
      "I want to {join} the football club. | Would you like to {join} us for dinner? | She {joined} the school band last year.|repaired protected",
      "repair protect",
    ),
    word(
      "volunteer volunteers volunteered volunteering",
      "to offer to do work for no money; a person who does this",
      "志愿者；自愿做",
      "My mom is a {volunteer} at the library: she works there for no money. | We need {volunteers} to clean the park; nobody will get paid.|members leaders | As a {volunteer} at the hospital, he helps for free.|member leader",
      "member leader",
    ),
    word(
      "collect collects collected collecting",
      "to bring things together from different places; to go and get someone",
      "收集；接（人）",
      "My brother {collects} stamps.|raises plants | We {collected} old bottles on the beach.|raised planted | Mom {collects} me from school at four.|raises plants",
      "raise plant",
    ),
    word(
      "plant plants planted planting",
      "to put a seed or a young tree in the ground; a living thing that grows in the ground",
      "种植；植物",
      "We {planted} young trees in the ground in the park.|repaired collected | Water the {plants} every day.|notices volunteers | Let's {plant} these seeds in the ground.|repair collect",
      "repair notice",
    ),
    word(
      "repair repairs repaired repairing",
      "to make something that is broken work again",
      "修理",
      "Dad {repaired} my broken bike, and now it works again.|protected planted | My watch is broken. Can you {repair} it? | The road is closed because workers are {repairing} it.|protecting planting",
      "protect plant",
    ),
    word(
      "organize organizes organized organizing",
      "to plan and get ready for something",
      "组织",
      "Our class {organized} a party for the teacher.|repaired protected | Who is {organizing} the trip?|repairing protecting | Let's {organize} a game in the park.",
      "repair protect",
    ),
    word(
      "raise raises raised raising",
      "to lift up; to collect money for something",
      "举起；募集",
      "{Raise} your hand if you know the answer.|Plant Repair | We sold cakes to {raise} money for the school. | She {raised} her arm to wave.|planted repaired",
      "plant repair",
    ),
    word(
      "protect protects protected protecting",
      "to keep someone or something safe",
      "保护",
      "Sunglasses {protect} your eyes from the sun. | We must {protect} wild animals. | The dog {protects} the house at night.|repairs plants",
      "repair plant",
    ),
    word(
      "notice notices noticed noticing",
      "to see something and pay attention to it; a piece of paper with information on a wall",
      "注意到；通知",
      "Did you {notice} his new haircut? | I didn't {notice} the rain. | Read the {notice} on the door.|volunteer plant",
      "raise protect",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Share* is often followed by *with*: *I share a room with my brother*. *Join* needs no *with*: say *join the club*, not *join with the club*.",
        "*share* 后面常接 *with*：*I share a room with my brother*。*join* 不需要 *with*：说 *join the club*，不说 *join with the club*。",
      ),
      meaning: t(
        "*Protect* keeps someone or something safe, *repair* makes something broken work again, and *plant* puts a seed or a young tree into the ground.",
        "*protect* 是保护人或东西的安全，*repair* 是把坏了的东西修好，*plant* 是把种子或小树种进土里。",
      ),
      spell: t(
        "*Volunteer* ends in -eer, like *engineer*, and *repair* has ai after the p: re · pair.",
        "*volunteer* 以 -eer 结尾，和 *engineer* 一样；*repair* 的 p 后面是 ai：re · pair。",
      ),
    },
    notes: `
      share|one piece of cake for each of us;a room used with a brother;a lunch someone gave part of|you share something with others; you lend something for a short time|share 是和别人一起用；lend 是暂时借给别人|borrow/borrowing=borrow means taking something for a short time and giving it back, and you do not borrow a cake, a room or a lunch with someone=borrow 是借来用一段时间再还，不会和别人一起“借”蛋糕、房间或午饭;lend/lending=lend means giving something for a short time to get it back, and you do not lend a cake, a room or a lunch with someone=lend 是借出去再收回，不会和别人一起“借出”蛋糕、房间或午饭|share|sh at the start, and -are at the end|开头是 sh，结尾是 -are
      join|becoming part of a football club;coming to dinner with some people;becoming part of the school band|you join a group to become part of it; you repair something broken|join 是加入一个群体；repair 是修理坏了的东西|repair/repaired=repair means making something broken work again, not becoming part of a club, a band or a dinner=repair 是把坏了的东西修好，不是加入俱乐部、乐队或晚饭;protect/protected=protect means keeping someone or something safe, not becoming part of a group=protect 是保护安全，不是加入一个群体|join|oi, as in *coin*|oi 和 *coin* 里的一样
      volunteer|a mom who works at a library for no money;people to clean a park when nobody gets paid;someone helping at a hospital for free|a volunteer works for no money; a member is a person in a group or a club|volunteer 是不拿报酬做事的人；member 是群体或俱乐部的成员|member/members=a member is a person in a group or a club, and the word does not say they work for no money=member 是群体或俱乐部的成员，这个词不表示不拿报酬做事;leader/leaders=a leader is the person in charge of a group, and the word does not say they work for no money=leader 是负责带领群体的人，这个词不表示不拿报酬做事|vol · un · teer|-eer at the end|结尾是 -eer
      collect|a brother who keeps many stamps;old bottles picked up on a beach;getting a child from school at four|you collect things from different places or go and get someone; you raise your hand or money|collect 是收集东西或去接人；raise 是举手或募捐|raise/raises/raised=raise means lifting something up or getting money for something, not keeping stamps, picking up bottles or getting a child from school=raise 是举起或募钱，不是集邮、捡瓶子或去学校接孩子;plant/plants/planted=plant means putting seeds or young trees into the ground, not keeping stamps, picking up bottles or getting a child from school=plant 是把种子或小树种进土里，不是集邮、捡瓶子或接孩子|col · lect|the double l, and -ct at the end|双写 l，结尾是 -ct
      plant|young trees put in the ground in a park;green things to water every day;seeds put in the ground|you plant seeds and trees in the ground; you repair something broken|plant 是把种子和树种进土里；repair 是修理坏的东西|repair/repaired=repair means fixing something broken, not putting trees or seeds into the ground=repair 是修理坏的东西，不是把树或种子种进土里;collect/collected=collect means bringing things together from different places, not putting trees or seeds into the ground=collect 是把各处的东西收集到一起，不是把树或种子种进土里;notice/notices=a notice is a paper with information on a wall, and you do not water it=notice 是贴在墙上的通知，不用浇水;volunteer/volunteers=volunteers are people who work for no money, and you do not water them=volunteer 是不拿报酬做事的人，不用给他们浇水|plant|-ant at the end|结尾是 -ant
      repair|a broken bike that works again;a broken watch to fix;workers fixing a closed road|you repair something broken; you protect something to keep it safe|repair 是把坏的东西修好；protect 是保护它的安全|protect/protected/protecting=protect means keeping someone or something safe, not making something broken work again=protect 是保护安全，不是把坏的东西修好;plant/planted/planting=plant means putting seeds or trees into the ground, not fixing something broken=plant 是把种子或树种进土里，不是修理坏的东西|re · pair|ai after the p|p 后面是 ai
      organize|a class planning a party for the teacher;planning a trip;getting a game ready in the park|you organize a party, a trip or a game by planning it; you repair something broken|organize 是计划、筹备聚会、旅行或游戏；repair 是修理坏的东西|repair/repaired/repairing=repair means fixing something broken, and a party, a trip or a game is not broken=repair 是修理坏的东西，聚会、旅行或游戏都不会“坏”;protect/protected/protecting=protect means keeping someone or something safe, not planning a party, a trip or a game=protect 是保护安全，不是筹备聚会、旅行或游戏|or · gan · ize|-ize at the end in American English, -ise in British English|美式结尾 -ize，英式结尾 -ise
      raise|a hand up to answer;money from selling cakes for a school;an arm up to wave|you raise a hand or money; you plant a seed|raise 是举起或募钱；plant 是种下种子|plant/planted=plant means putting seeds into the ground, not lifting a hand or an arm or getting money=plant 是把种子种进土里，不是举手、抬胳膊或募钱;repair/repaired=repair means fixing something broken, not lifting a hand or an arm or getting money=repair 是修理坏的东西，不是举手、抬胳膊或募钱|raise|ai for the long a, and s said like z|ai 发长 a 音，s 读作 z
      protect|sunglasses and eyes in the sun;keeping wild animals safe;a dog keeping a house safe at night|you protect someone or something to keep them safe; you repair something broken|protect 是保护安全；repair 是修理坏的东西|repair/repairs=repair means fixing something broken, not keeping eyes, animals or a house safe=repair 是修理坏的东西，不是保护眼睛、动物或房子的安全;plant/plants=plant means putting seeds into the ground, not keeping something safe=plant 是把种子种进土里，不是保护安全|pro · tect|pro- at the start, and -ct at the end|开头是 pro-，结尾是 -ct
      notice|seeing a new haircut;not seeing that it rained;a paper on the door to read|you notice something when you see it and pay attention; you raise your hand|notice 是注意到；raise 是举起|raise=raise means lifting something up or getting money, not seeing something=raise 是举起或募钱，不是看到、注意到;protect=protect means keeping someone or something safe, not seeing something=protect 是保护安全，不是注意到;volunteer=a volunteer is a person who works for no money, and you cannot read one on a door=volunteer 是不拿报酬做事的人，不能贴在门上读;plant=a plant is a living thing that grows, and you cannot read it=plant 是会生长的植物，不能读|no · tice|-ice at the end, said like *iss*|结尾 -ice 读作 *iss*
    `,
  },
});

const people = vocabularyTopic({
  id: "a2-words-people-around",
  title: t("People Around Us", "身边的人"),
  summary: t(
    "Strangers, guests, members, groups, leaders, owners and bakers, the mail, and people who are polite, rude, helpful or lonely.",
    "陌生人、客人、成员、小组、领队、主人和面包师，邮件，以及有礼貌、粗鲁、乐于助人或孤独的人。",
  ),
  intro: t(
    "At the chess club party, a **guest** came in whom nobody knew, but she wasn't a **stranger** for long: the club **leader** said she was our newest **member**. These words help you talk about the people around you and how they behave.",
    "象棋俱乐部聚会上，来了一位谁都不认识的 **guest**（客人），可她没当多久 **stranger**（陌生人）：俱乐部的 **leader**（领队）介绍说，她是我们最新的 **member**（成员）。这些词帮你谈论身边的人，以及他们的言行举止。",
  ),
  prerequisites: ["a2-words-community-actions"],
  words: [
    word(
      "stranger strangers",
      "a person you do not know",
      "陌生人",
      "Don't open the door to {strangers}.|friends guests | I didn't know him. He was a {stranger}. | I'm a {stranger} here, so I don't know the way.|friend member",
      "friend guest",
    ),
    word(
      "guest guests",
      "a person you invite to your home or to a party",
      "客人",
      "We have {guests} for dinner tonight.|strangers members | The hotel has rooms for 200 {guests} who stay the night.|strangers members | Be polite to our {guests}: we invited them to dinner.|strangers members",
      "stranger member",
    ),
    word(
      "member members",
      "a person who is in a group or club",
      "成员",
      "I'm a {member} of the chess club: I go every week and pay each year. | All the {members} of my family like music.|guests strangers | You need to be a {member} to use the pool.|leader stranger",
      "guest stranger",
    ),
    word(
      "group groups",
      "some people or things together",
      "组；群",
      "We worked in {groups} of four.|members leaders | A {group} of children is playing football in the park. | Our {group} of ten students is going to the museum.",
      "member leader",
    ),
    word(
      "leader leaders",
      "a person who is in charge of a group",
      "领导者；领队",
      "She is the {leader} of our team. | Follow the {leader}: she knows the way and is in charge. | The group {leader} has the tickets.",
      "stranger guest",
    ),
    word(
      "owner owners",
      "the person something belongs to",
      "主人；所有者",
      "Who is the {owner} of this bag? | The dog ran back to its {owner}. | The shop {owner} opens the door at nine.",
      "leader guest",
    ),
    word(
      "baker bakers",
      "a person who makes bread and cakes to sell",
      "面包师",
      "The {baker} gets up at four to make bread. | My uncle is a {baker}. His bread is great. | Ask the {baker} how he makes his bread so soft.",
      "waiter cashier",
    ),
    word(
      "mail",
      "letters and packages that are sent and brought to your home",
      "邮件",
      "Is there any {mail} in the box by the door? I'm waiting for a letter. | I check the {mail} in our box by the gate every morning. | I sent Grandma a birthday card by {mail}, with a stamp on it.",
      "news email",
    ),
    word(
      "polite",
      "speaking and acting in a kind way, with good manners",
      "有礼貌的",
      "Say please and thank you. Be {polite}! | He is always {polite} to his teachers: he says please and thank you. | It's {polite} to say thank you.",
      "rude lonely",
    ),
    word(
      "rude",
      "not polite",
      "粗鲁的",
      "Don't be {rude}. Say sorry! | It's {rude} to talk with food in your mouth. | The man was {rude}. He shouted at me and didn't say sorry.",
      "polite helpful",
    ),
    word(
      "helpful",
      "ready to help; useful",
      "乐于助人的；有用的",
      "The man at the station was very {helpful}. He showed us the way. | Thanks, that's very {helpful}! | This map is {helpful}.",
      "rude lonely",
    ),
    word(
      "lonely",
      "sad because you are alone",
      "孤独的",
      "My grandma lives alone, and she feels {lonely}. | I was {lonely} at my new school because I had no friends. | The old dog looks {lonely} without its friend.",
      "helpful polite",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Lonely* ends in -ly but is an adjective, not an adverb: say *she feels lonely* and *a lonely dog*, just as you say *a polite boy* or *a rude man*.",
        "*lonely* 虽然以 -ly 结尾，却是形容词，不是副词：说 *she feels lonely*、*a lonely dog*，就像说 *a polite boy*、*a rude man* 一样。",
      ),
      meaning: t(
        "A *stranger* is someone you do not know, a *guest* is someone you invite, and a *member* belongs to a group; the *leader* is the one in charge of it.",
        "*stranger* 是你不认识的人，*guest* 是你请来的人，*member* 是属于某个群体的人，*leader* 是负责带领这个群体的人。",
      ),
      spell: t(
        "*Stranger* keeps the e of *strange*: strang · er, and *guest* has a silent u after the g.",
        "*stranger* 保留了 *strange* 的 e：strang · er；*guest* 的 g 后面有个不发音的 u。",
      ),
    },
    notes: `
      stranger|someone not to open the door to;a man nobody knew;someone who does not know the way here|a stranger is a person you do not know; a friend is someone you know and like|stranger 是不认识的人；friend 是认识并喜欢的人|friend/friends=a friend is someone you know and like, not a person you do not know=friend 是你认识并喜欢的人，不是陌生人;guest/guests=a guest is someone invited to your home or a party, so you know them and open the door to them=guest 是请到家里或聚会上的人，你认识他们，也会给他们开门;member=a member belongs to a group or a club, and being one does not mean you do not know the way=member 是属于某个群体或俱乐部的人，这并不表示你不认识路|stran · ger|strange + -r, keeping the e|strange 加 -r，保留 e
      guest|people coming for dinner tonight;people staying the night in a hotel;people invited to dinner|a guest is someone you invite or who stays at a hotel; a stranger is someone you do not know|guest 是请来的客人或住酒店的人；stranger 是陌生人|stranger/strangers=a stranger is a person you do not know, not someone invited to your home or staying at a hotel=stranger 是不认识的人，不是请到家里或住酒店的人;member/members=a member is a person in a group or a club, not someone invited to your home or staying at a hotel=member 是群体或俱乐部的成员，不是请到家里或住酒店的人|guest|a silent u after the g|g 后面的 u 不发音
      member|someone who goes to a chess club every week and pays each year;all the people of a family;someone allowed to use a pool|a member belongs to a group, a club or a family; a guest is invited for a short time|member 是群体、俱乐部或家庭的一员；guest 是短期请来的客人|guest/guests=a guest is someone invited for a short time, not someone who belongs to a club or a family=guest 是短期请来的人，不是俱乐部或家庭的一员;stranger/strangers=a stranger is someone you do not know, not someone who belongs to a club or a family=stranger 是不认识的人，不是俱乐部或家庭的一员;leader=a leader is in charge of a group, and you do not need to be in charge to use a pool=leader 是负责带领群体的人，用游泳池并不需要当带领者|mem · ber|-ber at the end|结尾是 -ber
      group|working in fours;children playing football together;ten students going to a museum|a group is some people or things together; a member is one person in a group|group 是聚在一起的一些人或东西；member 是其中的一个人|member/members=a member is one person in a group, not several people together=member 是群体中的一个人，不是一群人;leader/leaders=a leader is the one person in charge of a group, not several people together=leader 是负责带领的那一个人，不是一群人|group|ou said like *oo*|ou 读作 *oo*
      leader|the person in charge of a team;someone in charge who knows the way;the person with the group's tickets|a leader is in charge of a group; a stranger is someone you do not know|leader 是带领群体的人；stranger 是陌生人|stranger=a stranger is a person you do not know, not someone in charge of a team or a group=stranger 是不认识的人，不是负责带领队伍或群体的人;guest=a guest is someone invited to your home or a party, not someone in charge of a group=guest 是请到家里或聚会上的人，不是负责带领群体的人|lead · er|ea for the long e|ea 发长 e 音
      owner|the person a bag belongs to;someone a dog ran back to;the person a shop belongs to|an owner is the person something belongs to; a leader is in charge of a group of people|owner 是东西的主人；leader 是带领一群人的人|leader=a leader is in charge of a group of people, not the person a bag, a dog or a shop belongs to=leader 是带领一群人的人，不是包、狗或商店的主人;guest=a guest is someone invited to your home or a party, not the person a bag, a dog or a shop belongs to=guest 是请来的客人，不是包、狗或商店的主人|own · er|ow said like the o in *go*|ow 读作 *go* 里的 o
      baker|someone who gets up at four to make bread;an uncle with great bread;someone who knows how to make bread soft|a baker makes bread and cakes to sell; a waiter brings food to your table|baker 是做面包和蛋糕卖的人；waiter 是给你上菜的人|waiter=a waiter brings food to your table in a restaurant, not someone who makes bread=waiter 是在餐馆给你上菜的人，不是做面包的人;cashier=a cashier takes your money in a shop, not someone who makes bread=cashier 是在商店收钱的人，不是做面包的人|ba · ker|bake + -r|bake 加 -r
      mail|something in the box by the door while waiting for a letter;something in the box by the gate every morning;a birthday card sent with a stamp|mail is letters and packages brought to your home; email is sent on a computer or phone|mail 是寄到家里的信件和包裹；email 是用电脑或手机发的|news=news is new information about what happened, not letters you get in a box or send with a stamp=news 是关于发生了什么的新消息，不是信箱里的信，也不是贴邮票寄的东西;email=email is a message sent on a computer or a phone, not letters in a box or a card with a stamp=email 是用电脑或手机发的消息，不是信箱里的信，也不是贴邮票的卡片|mail|ai for the long a|ai 发长 a 音
      polite|saying please and thank you;someone who says please and thank you to teachers;saying thank you|polite means with good manners; rude means not polite|polite 是有礼貌；rude 是没礼貌|rude=rude means not polite, the opposite of saying please and thank you=rude 是没礼貌，和说“请”和“谢谢”正相反;lonely=lonely means sad because you are alone, not saying please and thank you=lonely 是因独自一人而难过，和说“请”和“谢谢”无关|po · lite|i that says its name before the silent e|不发音的 e 前面，i 读字母本音
      rude|someone who should say sorry;talking with food in your mouth;a man who shouted and didn't say sorry|rude means not polite; polite means with good manners|rude 是没礼貌；polite 是有礼貌|polite=polite means with good manners, the opposite of shouting or talking with food in your mouth=polite 是有礼貌，和大喊大叫或满嘴食物说话正相反;helpful=helpful means ready to help, not shouting or talking with food in your mouth=helpful 是乐于助人，不是大喊大叫或满嘴食物说话|rude|u that says its name, and a silent e|u 读字母本音，词尾 e 不发音
      helpful|a man at the station who showed the way;thanks for something useful;a useful map|helpful means ready to help or useful; rude means not polite|helpful 是乐于助人或有用；rude 是没礼貌|rude=rude means not polite, and you do not say thanks for it or use it like a map=rude 是没礼貌，不会为此道谢，也不像地图那样有用;lonely=lonely means sad because you are alone, not useful or ready to help=lonely 是因独自一人而难过，不是有用或乐于助人|help · ful|help + -ful with one l|help 加 -ful，只有一个 l
      lonely|a grandma who lives alone;a new school with no friends;an old dog without its friend|lonely means sad because you are alone; helpful means ready to help|lonely 是因独自一人而难过；helpful 是乐于助人|helpful=helpful means ready to help, not sad because you are alone=helpful 是乐于助人，不是因独自一人而难过;polite=polite means with good manners, not sad because you are alone=polite 是有礼貌，不是因独自一人而难过|lone · ly|lone + -ly, keeping the e|lone 加 -ly，保留 e
    `,
  },
});

const describing = vocabularyTopic({
  id: "a2-words-describing-places",
  title: t("Describing Places", "描述地方"),
  summary: t(
    "Noisy, crowded, peaceful, modern, empty, full, safe, dangerous, pretty, ugly and famous; danger.",
    "吵闹的、拥挤的、宁静的、现代的、空的、满的、安全的、危险的、漂亮的、丑的和著名的；危险。",
  ),
  intro: t(
    "The market in the old town is **crowded** and **noisy** at noon, but the streets are **empty** and **peaceful** early in the morning. These words help you say what a place is like and whether it is safe, pretty or famous.",
    "老城区的市场中午 **crowded**（拥挤）又 **noisy**（吵闹），可清早街道 **empty**（空荡荡）又 **peaceful**（宁静）。这些词帮你说出一个地方是什么样子，安不安全，漂不漂亮，有没有名。",
  ),
  prerequisites: ["a2-words-people-around"],
  words: [
    word(
      "noisy noisier noisiest",
      "making a lot of loud sounds",
      "吵闹的",
      "Our street is very {noisy} because of the cars. | The classroom was {noisy}, so the teacher shouted. | I can't sleep. The neighbors are too {noisy}.",
      "peaceful quiet",
    ),
    word(
      "crowded",
      "full of people",
      "拥挤的",
      "The bus was so {crowded} that I couldn't sit down. | The beach is very {crowded} in summer, with thousands of people on the sand. | We left the {crowded} market, full of pushing people, and found a quiet cafe.",
      "empty peaceful",
      "full",
    ),
    word(
      "peaceful",
      "quiet and calm",
      "宁静的",
      "The village is {peaceful}. You can only hear the birds. | We had a {peaceful} walk in the forest, with no one else around and no sound but the wind. | It's {peaceful} here early in the morning, before the people and cars arrive.",
      "noisy crowded",
    ),
    word(
      "modern",
      "new, of the present time",
      "现代的",
      "This phone is very {modern}. It came out last month. | Our school is {modern}: it was built two years ago. | Grandma's kitchen is old, but ours is {modern}.",
      "old traditional",
    ),
    word(
      "empty emptier emptiest",
      "with nothing or no one inside",
      "空的",
      "The fridge is {empty}. Let's go shopping. | The streets were {empty} at five in the morning: there was nobody outside. | Please put the {empty} bottles, with nothing left in them, in the bin.",
      "full crowded",
    ),
    word(
      "full fuller fullest",
      "with no more space inside",
      "满的",
      "The bus is {full}: every seat has someone on it, and there is no room for one more person. | The box is {full} of old toys. | I can't eat any more. I'm {full}!|empty hungry",
      "empty busy",
      "crowded",
    ),
    word(
      "safe safer safest",
      "not in danger; not dangerous",
      "安全的",
      "Keep your money in a {safe} place where nobody can take it. | The children are {safe} at home now, away from the storm. | This quiet street is {safe} at night: it has lots of lights, and nobody gets hurt here.",
      "dangerous crowded",
    ),
    word(
      "dangerous",
      "that can hurt you",
      "危险的",
      "It's {dangerous} to play near the road because cars go fast. | Sharks are {dangerous}: they can bite and kill people. | Driving fast is {dangerous} because you can crash and get hurt.",
      "safe careful",
    ),
    word(
      "pretty prettier prettiest",
      "nice to look at",
      "漂亮的",
      "What a {pretty} dress! I love its colors. | The village is very {pretty}, with clean streets and flowers everywhere. | She has a {pretty} smile that everyone loves.",
      "ugly dirty",
    ),
    word(
      "ugly uglier ugliest",
      "not nice to look at",
      "丑的",
      "That new building is {ugly}: it's clean, but I don't like how it looks. | I think this clean old sofa is {ugly} to look at, but Dad loves it. | This hat is {ugly}! It's new and clean, but nobody likes how it looks.",
      "pretty dirty",
    ),
    word(
      "famous",
      "known by many people",
      "著名的",
      "The Great Wall is {famous}: people all over the world know its name. | He's a {famous} singer. Everyone knows his songs. | Paris is {famous} for its food: people everywhere know about it.",
      "important rich",
    ),
    word(
      "danger dangers",
      "the chance that something bad or harmful will happen",
      "危险",
      "The doctor says the boy is out of {danger} now. | Firefighters often put their lives in {danger}. | Too much sugar is a {danger} to your health. | Children must learn about the {dangers} of the road: fast cars and busy crossings.|dancers strangers",
      "dancer stranger",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Danger* is a noun and *dangerous* is an adjective: a boy is *out of danger*, but sharks are *dangerous*. Look for *in*, *out of* or *a* before the gap.",
        "*danger* 是名词，*dangerous* 是形容词：男孩 *out of danger*（脱离危险），而鲨鱼是 *dangerous*（危险的）。看空格前有没有 *in*、*out of* 或 *a*。",
      ),
      meaning: t(
        "*Crowded* and *full* are close but not the same: a place is *crowded* when it is full of people, and a box, a bag or your stomach can be *full* with no people at all.",
        "*crowded* 和 *full* 很接近但不一样：地方挤满了人才叫 *crowded*，而盒子、包或肚子没有人也可以是 *full*。",
      ),
      spell: t(
        "Adjectives that end in -y change y to i before -er and -est: *noisy, noisier, noisiest*; *pretty, prettier*; *ugly, uglier*; *empty, emptier*.",
        "以 -y 结尾的形容词加 -er、-est 时，把 y 改成 i：*noisy, noisier, noisiest*；*pretty, prettier*；*ugly, uglier*；*empty, emptier*。",
      ),
    },
    notes: `
      noisy|a street full of car sounds;a classroom where the teacher had to shout;neighbors too loud for sleep|noisy means making a lot of loud sounds; quiet means with little sound|noisy 是很吵；quiet 是安静|peaceful=peaceful means quiet and calm, the opposite of loud cars, shouting or neighbors who stop you sleeping=peaceful 是安静祥和，和吵闹的汽车、喊叫或吵得人睡不着正相反;quiet=quiet means with little sound, the opposite of noisy=quiet 是声音很小，和 noisy 意思相反|nois · y|oi, as in *boy*, and y at the end|oi 和 *boy* 里的一样，结尾是 y
      crowded|a bus with no seat left;a beach with thousands of people;a market full of pushing people|crowded means full of people; empty means with no one inside|crowded 是挤满了人；empty 是空无一人|empty=empty means with no one inside, the opposite of full of people=empty 是里面没人，和挤满了人正相反;peaceful=peaceful means quiet and calm, not full of pushing people=peaceful 是安静祥和，不是挤满了推来推去的人|crowd · ed|crowd + -ed|crowd 加 -ed
      peaceful|a village where you only hear birds;a forest walk with no sound but the wind;the early morning before people and cars arrive|peaceful means quiet and calm; noisy means loud|peaceful 是安静祥和；noisy 是吵闹|noisy=noisy means making a lot of loud sounds, the opposite of quiet and calm=noisy 是很吵，和安静祥和正相反;crowded=crowded means full of people, not quiet with no one around=crowded 是挤满了人，不是安静无人|peace · ful|peace + -ful with one l|peace 加 -ful，只有一个 l
      modern|a phone that came out last month;a school built two years ago;a kitchen newer than Grandma's old one|modern means new and of today; old means made long ago|modern 是新式的；old 是很久以前的|old=old means made long ago, the opposite of new and of today=old 是很久以前的，和新式的正相反;traditional=traditional means done the same way for a long time, not new and of today=traditional 是沿袭已久的，不是新式的|mod · ern|-ern at the end, not -en|结尾是 -ern，不是 -en
      empty|a fridge that needs shopping;streets with nobody outside at five in the morning;bottles with nothing left in them|empty means with nothing inside; full means with no more space|empty 是空的；full 是满的|full=full means with no more space inside, the opposite of empty=full 是装满了，和 empty 意思相反;crowded=crowded means full of people, the opposite of with nobody or nothing inside=crowded 是挤满了人，和空无一人正相反|emp · ty|a p after the m: e-m-p-t-y|m 后面有 p：e-m-p-t-y
      full|a bus with no room for one more;a box of old toys;having no room to eat any more|full means with no more space inside; empty means with nothing inside|full 是装满了；empty 是空的|empty=empty means with nothing inside, the opposite of having no more room=empty 是空的，和没有空间了正相反;busy=busy means having a lot to do, not having no room inside=busy 是很忙，不是装满了;hungry=hungry means wanting to eat, the opposite of having no room to eat more=hungry 是想吃东西，和吃不下了正相反|full|-ll at the end, but *-ful* has one l|结尾是 -ll，但后缀 *-ful* 只有一个 l
      safe|a place where nobody can take money;children at home away from a storm;a quiet street with lights where nobody gets hurt|safe means not in danger; dangerous means it can hurt you|safe 是安全；dangerous 是会伤到人|dangerous=dangerous means it can hurt you, the opposite of safe=dangerous 是会伤到人，和 safe 意思相反;crowded=crowded means full of people, not out of danger=crowded 是挤满了人，不是没有危险|safe|a that says its name before the silent e|不发音的 e 前面，a 读字母本音
      dangerous|playing near fast cars;sharks that can bite and kill;crashing because of fast driving|dangerous means it can hurt you; safe means not in danger|dangerous 是会伤到人；safe 是安全|safe=safe means not in danger, the opposite of something that can hurt you=safe 是没有危险，和会伤到人正相反;careful=careful describes a person who takes care, not a thing that can hurt you=careful 形容小心的人，不形容会伤到人的东西|dan · ger · ous|danger + -ous|danger 加 -ous
      pretty|a dress with lovely colors;a village with clean streets and flowers;a smile everyone loves|pretty means nice to look at; ugly means not nice to look at|pretty 是好看；ugly 是难看|ugly=ugly means not nice to look at, the opposite of pretty=ugly 是难看，和 pretty 意思相反;dirty=dirty means not clean, which is not about being nice to look at=dirty 是不干净，和好不好看无关|pret · ty|the double t, and y at the end|双写 t，结尾是 y
      ugly|a clean new building someone dislikes;a clean old sofa Dad loves;a new clean hat nobody likes|ugly means not nice to look at; dirty means not clean|ugly 是难看；dirty 是不干净|pretty=pretty means nice to look at, the opposite of ugly=pretty 是好看，和 ugly 意思相反;dirty=dirty means not clean, and a clean new thing can still be ugly=dirty 是不干净，而又新又干净的东西也可能难看|ug · ly|-ly at the end, with no e|结尾是 -ly，没有 e
      famous|the Great Wall known all over the world;a singer whose songs everyone knows;Paris known everywhere for its food|famous means known by many people; important means that matters a lot|famous 是有名；important 是重要|important=important means that matters a lot, not known by many people=important 是重要，不是很多人都知道;rich=rich means having a lot of money, not known by many people=rich 是有很多钱，不是很多人都知道|fa · mous|-ous at the end|结尾是 -ous
      danger|a boy the doctor talks about;the lives of firefighters;too much sugar and your health;fast cars and busy crossings|danger is the chance that something bad will happen; dangerous is the adjective|danger 是危险（名词）；dangerous 是形容词|dancer/dancers=dancer is a person who dances, not the chance that something bad will happen=dancer 是跳舞的人，不是可能发生坏事的危险;stranger/strangers=stranger is a person you do not know, not the chance that something bad will happen=stranger 是不认识的人，不是可能发生坏事的危险|dan · ger|g said like j, not *dancer* with c|g 读作 j，别和用 c 的 *dancer* 弄混
    `,
  },
});

const pronouns = vocabularyTopic({
  id: "a2-words-pronouns",
  title: t("Mine, Yours and Myself", "mine、yours 和 myself"),
  summary: t(
    "Mine, yours, hers, ours and theirs; myself, yourself, himself, herself, itself, ourselves and themselves.",
    "mine、yours、hers、ours、theirs；myself、yourself、himself、herself、itself、ourselves、themselves。",
  ),
  intro: t(
    '"Is this bag **yours**?" "No, it\'s not **mine**. I think it\'s **hers**: she packed it **herself** this morning." These words help you say who something belongs to and who does something to themselves.',
    "“这个包是 **yours**（你的）吗？”“不，不是 **mine**（我的）。我觉得是 **hers**（她的）：今天早上她 **herself**（自己）收拾的。”这些词帮你说出东西属于谁，以及谁对自己做了什么。",
  ),
  prerequisites: ["pre-a1-words-my-and-your"],
  words: [
    word(
      "mine",
      "the one that belongs to me",
      "我的（东西）",
      "This bag isn't yours. It's {mine}.|myself me | Is this pen yours or {mine}?|myself me | Your bike is red, and {mine} is blue.|myself me",
      "myself me",
    ),
    word(
      "yours",
      "the one that belongs to you",
      "你的（东西）",
      "Is this coat {yours}?|yourself your | My room is small, but {yours} is big.|yourself your | Here's my phone number. What's {yours}?|yourself your",
      "yourself your",
    ),
    word(
      "hers",
      "the one that belongs to her",
      "她的（东西）",
      "That's not Anna's bag. {Hers} is green.|Herself Her | Lily says the book is {hers}.|herself her | My hair is short, and {hers} is long.|herself her",
      "herself her",
    ),
    word(
      "ours",
      "the one that belongs to us",
      "我们的（东西）",
      "That car isn't {ours}. We don't have a car.|ourselves our | Their house is big, but {ours} is small.|ourselves our | Is this table {ours}? — Yes, we asked for it.|ourselves our",
      "ourselves our",
    ),
    word(
      "theirs",
      "the one that belongs to them",
      "他们的（东西）",
      "These bikes are Tom and Ben's. They're {theirs}.|themselves their | Our garden is small, and {theirs} is big.|themselves their | We have our tickets. Do they have {theirs}?|themselves their",
      "themselves their",
    ),
    word(
      "myself",
      "me, when I do something to me or alone",
      "我自己",
      "I hurt {myself} when I fell.|mine me | I made this cake {myself}.|mine me | I looked at {myself} in the mirror.|mine me",
      "mine me",
    ),
    word(
      "yourself",
      "you, when you do something to you or alone",
      "你自己",
      "Be careful! Don't cut {yourself}.|yours you | Did you make this {yourself}?|yours you | Help {yourself} to some cake.|yours you",
      "yours you",
    ),
    word(
      "himself",
      "him, when he does something to him or alone",
      "他自己",
      "Tom taught {himself} to play the guitar. | Tom was alone, so he looked at {himself} in the dark window. | The boy fell and hurt {himself}: his own knee was bleeding.",
      "his him",
    ),
    word(
      "herself",
      "her, when she does something to her or alone",
      "她自己",
      "Anna made the dress {herself}. | Anna looked at {herself} in the mirror: she was the only person in the room. | My little sister can dress {herself} now: she puts on her own clothes.",
      "hers her",
    ),
    word(
      "itself",
      "it, when it does something to it",
      "它自己",
      "The cat is washing {itself}, licking its own fur. | The door opened by {itself}! | The machine turns {itself} off at night: nobody has to touch it.",
      "its it",
    ),
    word(
      "ourselves",
      "us, when we do something to us or alone",
      "我们自己",
      "We painted the house {ourselves}.|ours us | We enjoyed {ourselves} at the party.|ours us | We made dinner {ourselves} tonight.|ours us",
      "ours us",
    ),
    word(
      "themselves",
      "them, when they do something to them or alone",
      "他们自己",
      "The children made the cards {themselves}. | They fell off their bikes and hurt {themselves}, but nobody else was hurt. | My grandparents built the house {themselves}.",
      "theirs them",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*My*, *your* and *our* need a noun after them, but *mine*, *yours* and *ours* stand alone: *my bike*, but *the bike is mine*. If the gap ends the phrase with no noun after it, use the -s form.",
        "*my*、*your*、*our* 后面要跟名词，*mine*、*yours*、*ours* 则单独使用：*my bike*，但 *the bike is mine*。空格后面没有名词时，用 -s 那一类词。",
      ),
      meaning: t(
        "A word with *-self* points back to the same person who does the action: in *Tom hurt himself*, Tom is hurt, but in *Tom hurt him*, someone else is. *By herself* or *made it herself* also means alone, with no help.",
        "带 *-self* 的词指回做动作的同一个人：*Tom hurt himself* 是汤姆自己受伤，*Tom hurt him* 则是别人受伤。*made it herself* 也表示独自完成，没人帮忙。",
      ),
      spell: t(
        "Use *-self* for one and *-selves* for more than one: *myself*, *herself*, but *ourselves*, *themselves*. *Yours*, *hers*, *ours* and *theirs* never take an apostrophe.",
        "一个人用 *-self*，多个人用 *-selves*：*myself*、*herself*，但 *ourselves*、*themselves*。*yours*、*hers*、*ours*、*theirs* 从不加撇号。",
      ),
    },
    notes: `
      mine|a bag that is not yours;a pen that is yours or the speaker's;a blue bike after a red one|mine stands alone for something that belongs to me; myself is me doing something to me|mine 单独使用，指我的东西；myself 是我自己|myself=myself is used when I do something to me, not to say who something belongs to=myself 用于我对自己做事，不表示东西属于谁;me=me is the person, not the thing that belongs to me=me 指人本身，不指属于我的东西|mine|i that says its name before the silent e|不发音的 e 前面，i 读字母本音
      yours|a coat someone asks about;a big room after a small one;a phone number someone asks for|yours stands alone; your needs a noun after it|yours 单独使用；your 后面要跟名词|yourself=yourself is used when you do something to you, not to say who something belongs to=yourself 用于你对自己做事，不表示东西属于谁;your=your needs a noun after it, as in *your coat*, and cannot stand alone=your 后面要跟名词，如 *your coat*，不能单独使用|yours|no apostrophe: not *your's*|没有撇号：不是 *your's*
      hers|a green bag that is not Anna's;a book Lily says is hers;long hair after short hair|hers stands alone; her needs a noun after it|hers 单独使用；her 后面要跟名词|herself=herself is used when she does something to her, not to say who something belongs to=herself 用于她对自己做事，不表示东西属于谁;her=her needs a noun after it to show what is hers, as in *her bag*=her 表示所属时后面要跟名词，如 *her bag*|hers|no apostrophe: not *her's*|没有撇号：不是 *her's*
      ours|a car we do not have;a small house after a big one;a table we asked for|ours stands alone; our needs a noun after it|ours 单独使用；our 后面要跟名词|ourselves=ourselves is used when we do something to us, not to say who something belongs to=ourselves 用于我们对自己做事，不表示东西属于谁;our=our needs a noun after it, as in *our car*, and cannot stand alone=our 后面要跟名词，如 *our car*，不能单独使用|ours|no apostrophe: not *our's*|没有撇号：不是 *our's*
      theirs|bikes that are Tom and Ben's;a big garden after a small one;tickets they may have|theirs stands alone; their needs a noun after it|theirs 单独使用；their 后面要跟名词|themselves=themselves is used when they do something to them, not to say who something belongs to=themselves 用于他们对自己做事，不表示东西属于谁;their=their needs a noun after it, as in *their bikes*, and cannot stand alone=their 后面要跟名词，如 *their bikes*，不能单独使用|theirs|e before i, as in *their*, and no apostrophe|和 *their* 一样 e 在 i 前，没有撇号
      myself|getting hurt in a fall;a cake made with no help;looking in a mirror|myself is me doing something to me; mine is something that belongs to me|myself 是我自己；mine 是我的东西|mine=mine means a thing that belongs to me, not me doing something to me or alone=mine 指我的东西，不是我对自己做事或独自做事;me=me is not used for the same person who does the action, so we say *I hurt myself*, not *I hurt me*=做动作的人和对象是同一个人时不用 me，要说 *I hurt myself*，不说 *I hurt me*|my · self|my + self, one word|my + self，合成一个词
      yourself|not cutting your own hand;something made with no help;taking some cake|yourself is you doing something to you; yours is something that belongs to you|yourself 是你自己；yours 是你的东西|yours=yours means a thing that belongs to you, not you doing something to you or alone=yours 指你的东西，不是你对自己做事或独自做事;you=you is not used for the same person who does the action, so we say *help yourself*, not *help you*=做动作的人和对象是同一个人时不用 you，要说 *help yourself*|your · self|your + self, one word|your + self，合成一个词
      himself|learning the guitar with no teacher;a boy alone looking in a dark window;a boy whose own knee was bleeding|himself is the same boy or man again; him is someone else|himself 是他自己；him 是另一个人|his=his shows what belongs to him, as in *his knee*, not the same person who does the action=his 表示他的东西，如 *his knee*，不是做动作的那个人自己;him=him is another person, not the same boy or man who does the action=him 是另一个人，不是做动作的那个人自己|him · self|him + self, one word|him + self，合成一个词
      herself|a dress made with no help;a woman alone in a room with a mirror;a little girl putting on her own clothes|herself is the same girl or woman again; her is someone else|herself 是她自己；her 是另一个人|hers=hers means a thing that belongs to her, not her doing something to her or alone=hers 指她的东西，不是她对自己做事或独自做事;her=her is another person, not the same girl or woman who does the action=her 是另一个人，不是做动作的那个人自己|her · self|her + self, one word|her + self，合成一个词
      itself|a cat licking its own fur;a door that opened with no one there;a machine nobody has to touch|itself is the same animal or thing again; it is something else|itself 是它自己；it 是别的东西|its=its shows what belongs to it, as in *its fur*, and needs a noun after it=its 表示它的东西，如 *its fur*，后面要跟名词;it=it is used for another thing, not the same animal or thing that does the action=it 指别的东西，不是做动作的那个自己|it · self|it + self, not *its* + self: one s|是 it + self，不是 its + self：只有一个 s
      ourselves|painting a house with no help;having a good time at a party;cooking dinner with no help tonight|ourselves is us doing something to us or alone; ours is something that belongs to us|ourselves 是我们自己；ours 是我们的东西|ours=ours means a thing that belongs to us, not us doing something to us or alone=ours 指我们的东西，不是我们对自己做事或独自做事;us=us is not used for the same people who do the action, so we say *we enjoyed ourselves*=做动作的人和对象相同时不用 us，要说 *we enjoyed ourselves*|our · selves|-selves for more than one, with v|多个人用 -selves，写作 v
      themselves|cards made by children with no help;people who fell off their bikes;grandparents who built a house with no help|themselves is them doing something to them or alone; theirs is something that belongs to them|themselves 是他们自己；theirs 是他们的东西|theirs=theirs means a thing that belongs to them, not them doing something to them or alone=theirs 指他们的东西，不是他们对自己做事或独自做事;them=them is other people, not the same people who do the action=them 是别的人，不是做动作的那些人自己|them · selves|them + selves, with v for more than one|them + selves，多个人写作 v
    `,
  },
});

// Mine, yours and theirs.

/** owners are a person in brackets, the word that stands alone for them, the word before a noun, and a wrong word. */
const owners: readonly (readonly [who: string, alone: string, before: string, other: string])[] = [
  ["I", "mine", "my", "me"],
  ["you", "yours", "your", "yourself"],
  ["she", "hers", "her", "herself"],
  ["we", "ours", "our", "us"],
  ["they", "theirs", "their", "them"],
  ["he", "his", "him", "he"],
];

const things: readonly string[] = ["bag", "pen", "coat", "bike", "umbrella", "ticket", "phone", "ball", "book", "cup", "key"];

const ownerRows = everyPair(owners, things);

/** aloneFrames are sentences with a gap for a word that stands alone. */
const aloneFrames: readonly ((thing: string) => string)[] = [
  (thing) => `This ${thing} is ___.`,
  (thing) => `Is this ${thing} ___?`,
  (thing) => `The ${thing} on the table is ___.`,
  (thing) => `That ${thing} isn't ___.`,
];

const possessiveChoiceBank: readonly ChoiceItem[] = ownerRows.flatMap(([[who, alone, before, other], thing], k): ChoiceItem[] =>
  [aloneFrames[k % 4]!, aloneFrames[(k + 2) % 4]!].map((frame): ChoiceItem => [`${frame(thing)} (${who})`, alone, [before, other]]),
);

/** beforeNoun is the word that goes before a noun: his for he. */
const beforeNoun = (who: string, before: string) => (who === "he" ? "his" : before);
/** wrongAlone is the word a learner wrongly writes alone: him for he. */
const wrongAlone = (who: string, before: string) => (who === "he" ? "him" : before);

const possessiveFixBank: readonly TypedItem[] = interleave([
  ownerRows.map(([[who, alone, before], thing]): TypedItem => {
    const shown = `This ${thing} is ${wrongAlone(who, before)}.`;
    return { shown, accepted: [`This ${thing} is ${alone}.`], wrong: [shown] };
  }),
  ownerRows.map(([[who, alone, before], thing]): TypedItem => {
    const shown = `Is this ${who === "he" ? "him" : alone} ${thing}?`;
    return { shown, accepted: [`Is this ${beforeNoun(who, before)} ${thing}?`], wrong: [shown] };
  }),
  ownerRows.map(([[who, alone, before], thing]): TypedItem => {
    const shown = `The ${thing} on the table is ${wrongAlone(who, before)}.`;
    return { shown, accepted: [`The ${thing} on the table is ${alone}.`], wrong: [shown] };
  }),
]);

/** ownerOf finds the row of owners for a word that stands alone or goes before a noun. */
const ownerOf = (word: string) => owners.find(([, alone, before]) => alone === word || before === word);

/** possessiveWhy explains the word that stands alone in the gap of shown. */
const possessiveWhy = (right: string, shown: string): Text => {
  const who = /\((\w+)\)$/u.exec(shown)?.[1] ?? "";
  return t(
    `No noun follows the gap, so it needs the word that stands alone; for *${who}* that is *${right}*: ${fill(shown, right)}\n\n**Check.** Look directly after the gap: there is no noun, so the standalone possessive pronoun *${right}* fits.`,
    `空白后面没有名词，所以要用单独使用的词；*${who}* 对应的是 *${right}*：${fill(shown, right)}\n\n**检验。** 看空白后面：没有名词，所以用独立使用的名词性物主代词 *${right}*。`,
  );
};

/** whyNotPossessive explains a word before a noun, or a word that does not show an owner. */
const whyNotPossessive = (wrong: string): Text => {
  if (/^(me|us|them|him)$/u.test(wrong))
    return t(
      `*${wrong}* is an object pronoun for someone an action is done to, not a word that shows who owns something.`,
      `*${wrong}* 是宾格，表示动作的对象，不表示东西属于谁。`,
    );
  if (wrong.endsWith("self"))
    return t(
      `*${wrong}* is a reflexive pronoun (as in *She hurt herself*), not a word that shows who owns something.`,
      `*${wrong}* 是反身代词（如 *She hurt herself*），不表示东西属于谁。`,
    );
  if (wrong === "he")
    return t(
      "*he* is a subject pronoun for the one who does something, not a word that shows ownership.",
      "*he* 是主格，表示动作的发出者，不表示所属关系。",
    );
  return t(
    `*${wrong}* must come before a noun, as in *${wrong} bag*. No noun follows here, so it cannot stand alone.`,
    `*${wrong}* 必须放在名词前，如 *${wrong} bag*。这里后面没有名词，不能单独使用。`,
  );
};

const possessivePronouns: TopicDef = {
  id: "possessive-pronouns",
  title: t("Mine, Yours and Theirs", "mine、yours 和 theirs"),
  summary: t(
    "This bag is mine. Is that yours? A word like mine stands alone, without a noun after it.",
    "This bag is mine. Is that yours? mine 这样的词单独使用，后面不接名词。",
  ),
  intro: t(
    "Compare *That is our house* with *That house is ours*. When the noun comes right after the possessive word, use *my, your, her, our, their*; when no noun follows, switch to *mine, yours, hers, ours, theirs*.",
    "比较 *That is our house* 和 *That house is ours*。后面紧跟名词时用 *my、your、her、our、their*；后面没有名词时，换用独立形式 *mine、yours、hers、ours、theirs*。",
  ),
  prerequisites: ["my-your-his-her", "a2-words-pronouns"],
  encompasses: [
    { topic: "my-your-his-her", weight: 0.3 },
    { topic: "a2-words-pronouns", weight: 0.2 },
  ],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Mine or my", "mine 还是 my"),
      t(
        "*My*, *your*, *her*, *our* and *their* come before a noun: *my bag*. *Mine*, *yours*, *hers*, *ours* and *theirs* stand alone, with no noun after them: *This bag is mine.*\n\n| before a noun | alone |\n| :--- | :--- |\n| my | mine |\n| your | yours |\n| his | his |\n| her | hers |\n| our | ours |\n| their | theirs |\n\n> **Watch out.** Never add an apostrophe to *yours*, *hers*, *ours* or *theirs* (*your's* is wrong), and do not use *my/our/their* with no noun after it.",
        "*my*、*your*、*her*、*our*、*their* 放在名词前：*my bag*。*mine*、*yours*、*hers*、*ours*、*theirs* 单独使用，后面不接名词：*This bag is mine.*\n\n| 名词前 | 单独使用 |\n| :--- | :--- |\n| my | mine |\n| your | yours |\n| his | his |\n| her | hers |\n| our | ours |\n| their | theirs |\n\n> **注意。** 中文“我的”既能说“我的包”也能说“这包是我的”，英语要分清两套词；另外 *yours、hers、ours、theirs* 都不加撇号。",
      ),
      choiceGenerator(t("Choose the word for the gap.", "选出填入空白处的词。"), possessiveChoiceBank, possessiveWhy, whyNotPossessive),
    ),
    point(
      "fix",
      t("Fixing mine and my", "改正 mine 和 my"),
      t(
        "Each sentence uses the wrong form: *This bag is my.* → *This bag is mine.* *Is this mine bag?* → *Is this my bag?* Check whether a noun follows the possessive word.\n\n> **Watch out.** For *he*, *his* works in both places (*his bag* and *This bag is his*), never *him*.",
        "每个句子都用错了词：*This bag is my.* → *This bag is mine.* *Is this mine bag?* → *Is this my bag?* 看物主词后面有没有名词来判断。\n\n> **注意。** *he* 对应的物主词在两个位置都是 *his*（*his bag* 和 *This bag is his*），不要写成 *him*。",
      ),
      typedGenerator(
        "sentence",
        t("Fix the sentence.", "改正这个句子。"),
        possessiveFixBank,
        (right) => {
          if (right.startsWith("Is this")) {
            const word = right.split(" ")[2] ?? "";
            const alone = ownerOf(word)?.[1] ?? word;
            return t(
              `A noun follows, so it needs the word that goes before a noun: *${word}*, not *${alone}*: ${right}\n\n**Check.** Spot the noun right after *${word}*—because a noun follows, the before-noun form is required.`,
              `后面有名词，所以要用放在名词前的词：*${word}*，不用 *${alone}*：${right}\n\n**检验。** 看 *${word}* 后面紧跟着一个名词——有名词时必须用名词前的形式。`,
            );
          }
          const word = /(\w+)\.$/u.exec(right)?.[1] ?? "";
          return t(
            `No noun follows, so it needs the word that stands alone: *${word}*: ${right}\n\n**Check.** Look after *${word}*: the sentence ends right there with no noun, so the standalone possessive form fits.`,
            `后面没有名词，所以要用单独使用的词 *${word}*：${right}\n\n**检验。** 看 *${word}* 后面：句子直接结束、没有名词，所以要用独立使用的物主代词。`,
          );
        },
        possessivePronounsFixNot,
      ),
    ),
  ],
};

// Writing comparisons.

/** adjectives are an adjective, its comparative and superlative, and a wrong comparative a learner writes. */
const adjectives: readonly (readonly [adjective: string, more: string, most: string, bad: string])[] = [
  ["big", "bigger", "biggest", "more big"],
  ["busy", "busier", "busiest", "busyer"],
  ["noisy", "noisier", "noisiest", "noisyer"],
  ["old", "older", "oldest", "more old"],
  ["pretty", "prettier", "prettiest", "prettyer"],
  ["crowded", "more crowded", "most crowded", "crowdeder"],
  ["modern", "more modern", "most modern", "moderner"],
  ["peaceful", "more peaceful", "most peaceful", "peacefuller"],
  ["safe", "safer", "safest", "safeer"],
  ["small", "smaller", "smallest", "more small"],
  ["good", "better", "best", "gooder"],
  ["bad", "worse", "worst", "badder"],
  ["famous", "more famous", "most famous", "famouser"],
  ["dangerous", "more dangerous", "most dangerous", "dangerouser"],
];

const placePairs: readonly (readonly [a: string, b: string])[] = [
  ["the park", "the square"],
  ["the market", "the mall"],
  ["our street", "your street"],
  ["the village", "the town"],
  ["the new playground", "the old one"],
  ["the bakery", "the cafe"],
  ["this beach", "that one"],
  ["the library", "the bookshop"],
  ["the city center", "our area"],
];

/** where are what a superlative is the most of. */
const where: readonly string[] = ["in our town", "in the city", "in the village", "in our neighborhood", "in the area"];

const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const comparisonRows = pairUp(126, adjectives, placePairs);

const comparisonChoiceBank: readonly ChoiceItem[] = comparisonRows.slice(0, 40).map(([[adjective, more, , bad], [a, b]]): ChoiceItem => {
  const right = `${capital(a)} is ${more} than ${b}.`;
  const double = more.startsWith("more ") ? `${capital(a)} is ${adjective} than ${b}.` : `${capital(a)} is more ${more} than ${b}.`;
  return [`${a} / ${b} / ${adjective}`, right, [`${capital(a)} is ${bad} than ${b}.`, double]];
});

const comparisonTypedBank: readonly TypedItem[] = comparisonRows.slice(40, 80).map(
  ([[adjective, more, , bad], [a, b]]): TypedItem => ({
    shown: `${a} / ${b} / ${adjective}`,
    accepted: [`${capital(a)} is ${more} than ${b}.`],
    wrong: [`${capital(a)} is ${bad} than ${b}.`, `${capital(a)} is ${more} ${b}.`],
  }),
);

/** best are the places a superlative is about. */
const best: readonly string[] = [
  "the market",
  "the park",
  "the bakery",
  "the library",
  "the church",
  "the playground",
  "the square",
  "the cafe",
  "the school",
];

const superlativeTypedBank: readonly TypedItem[] = pairUp(70, adjectives, where)
  .slice(0, 40)
  .map(([[adjective, , most], place], k): TypedItem => {
    const a = capital(best[k % best.length] ?? "the park");
    const right = `${a} is the ${most} ${place}.`;
    return {
      shown: `${best[k % best.length]} / ${adjective} / ${place}`,
      accepted: [right, `${a} is the ${most} place ${place}.`],
      canonical: right,
      wrong: [`${a} is ${most} ${place}.`, `${a} is the most ${adjective} ${place}.`].filter((w) => w !== right),
    };
  });

/** compareRule names the rule that makes the comparative or the superlative of an adjective. */
const compareRule = (adjective: string, form: string, most: boolean): Text => {
  const end = most ? "-est" : "-er";
  const long = most ? "most" : "more";
  if (form.startsWith(`${long} `))
    return t(`*${adjective}* is a long word, so it takes *${long}* before it`, `*${adjective}* 是长词，前面加 *${long}*`);
  if (adjective === "good" || adjective === "bad")
    return t(`*${adjective}* has a form of its own: *${form}*`, `*${adjective}* 有自己的形式：*${form}*`);
  if (adjective.endsWith("y"))
    return t(
      `*${adjective}* ends in a consonant and *y*, so the *y* becomes *i* before *${end}*`,
      `*${adjective}* 以辅音字母加 *y* 结尾，把 *y* 变成 *i* 再加 *${end}*`,
    );
  if (adjective.endsWith("e")) {
    const add = most ? "-st" : "-r";
    return t(`*${adjective}* ends in *e*, so it adds only *${add}*`, `*${adjective}* 以 *e* 结尾，只加 *${add}*`);
  }

  if (form.length === adjective.length + end.length - 1)
    return t(`*${adjective}* is a short word, so it adds *${end}*`, `*${adjective}* 是短词，直接加 *${end}*`);
  return t(
    `*${adjective}* ends in one vowel and one consonant, so the consonant doubles before *${end}*`,
    `*${adjective}* 以一个元音字母加一个辅音字母结尾，双写辅音字母再加 *${end}*`,
  );
};

/** comparisonWhy explains a comparison written from notes. */
const comparisonWhy = (right: string, shown: string): Text => {
  const adjective = shown.split(" / ")[2] ?? "";
  const form = adjectives.find(([a]) => a === adjective)?.[1] ?? "";
  const rule = compareRule(adjective, form, false);
  return t(
    `The first place comes first, then *is*, the comparative and *than*; ${rule.en}: ${right}\n\n**Check.** Verify the pattern: Place 1 + *is* + comparative (*${form}*) + *than* + Place 2, with never both *more* and *-er*.`,
    `先写第一个地方，再写 *is*、比较级和 *than*；${rule["zh-CN"]}：${right}\n\n**检验。** 核对句型：地点一 + *is* + 比较级（*${form}*）+ *than* + 地点二，且没有同时用 *more* 和 *-er*。`,
  );
};

/** whyNotComparison explains a misspelt comparative or one that uses more and -er together, or neither. */
const whyNotComparison = (wrong: string, _right: string, shown: string, position: number): Text => {
  const adjective = shown.split(" / ")[2] ?? "";
  const form = adjectives.find(([a]) => a === adjective)?.[1] ?? "";
  const rule = compareRule(adjective, form, false);
  if (position === 0)
    return t(`*${wrong}* gets the comparative form wrong: ${rule.en}.`, `*${wrong}* 的比较级形式不对：${rule["zh-CN"]}。`);
  return form.startsWith("more ")
    ? t(
        `*${wrong}* leaves the adjective unchanged, without turning it into a comparative.`,
        `*${wrong}* 没有把形容词变成比较级，还是原形。`,
      )
    : t(
        `*${wrong}* uses both *more* and *-er*. A comparative takes one or the other, never both.`,
        `*${wrong}* 同时用了 *more* 和 *-er*。比较级只能用其中一种，不能叠加。`,
      );
};

const writingComparisons: TopicDef = {
  id: "writing-comparisons",
  title: t("Writing Comparisons", "写比较句"),
  summary: t(
    "Turn notes into comparisons: the park / the square / noisy becomes The park is noisier than the square.",
    "把笔记写成比较句：the park / the square / noisy 写成 The park is noisier than the square.",
  ),
  intro: t(
    "When you compare two places (*The bakery is smaller than the market*) or single out the top one (*The library is the quietest in our town*), the adjective changes form and links to *than* or *the*.",
    "比较两个地方（*The bakery is smaller than the market*）或指出“最……”（*The library is the quietest in our town*）时，形容词要变形，并分别搭配 *than* 或 *the*。",
  ),
  prerequisites: ["comparatives-and-superlatives", "writing-capitals-and-periods"],
  encompasses: [
    { topic: "comparatives-and-superlatives", weight: 0.4 },
    { topic: "writing-capitals-and-periods", weight: 0.1 },
  ],
  xp: 20,
  strand: "writing",
  knowledgePoints: [
    point(
      "choose",
      t("The comparison for the notes", "选出符合笔记的比较句"),
      t(
        "The notes give two places and an adjective. The sentence puts the first place first, then *is*, the comparative and *than*:\n\n*the park / the square / noisy* → *The park is noisier than the square.*\n\nShort words add *-er* (*bigger*, *busier*); long words take *more* (*more crowded*); *good* and *bad* become *better* and *worse*.\n\n> **Watch out.** Never combine *more* and *-er* (*more bigger* is wrong), and never leave a long adjective unchanged before *than* (*crowded than* is wrong).",
        "笔记给出两个地方和一个形容词。句子先写第一个地方，再写 *is*、比较级和 *than*：\n\n*the park / the square / noisy* → *The park is noisier than the square.*\n\n短词加 *-er*（*bigger*、*busier*）；长词前加 *more*（*more crowded*）；*good* 和 *bad* 变成 *better* 和 *worse*。\n\n> **注意。** 中文说“公园比广场吵”形容词不变，英语不能留原形，也不能把 *more* 和 *-er* 叠着用（*more bigger* 是错的）。",
      ),
      choiceGenerator(
        t("Choose the sentence that matches the notes.", "选出与笔记相符的句子。"),
        comparisonChoiceBank,
        comparisonWhy,
        whyNotComparison,
      ),
    ),
    point(
      "write",
      t("Writing the comparison", "写出比较句"),
      t(
        "Write the sentence for the notes: the first place, *is*, the comparative of the adjective and *than*, then the second place. For example: *the market / the mall / crowded* → *The market is more crowded than the mall.*\n\n> **Watch out.** Do not forget *than* between the comparative and the second place, and watch spelling changes like *big* → *bigger* and *busy* → *busier*.",
        "根据笔记写出比较句：第一个地方、*is*、形容词的比较级和 *than*，再写第二个地方。例如：*the market / the mall / crowded* → *The market is more crowded than the mall.*\n\n> **注意。** 比较级和第二个地方之间别漏掉 *than*，并留意拼写变化（*big* → *bigger*、*busy* → *busier*）。",
      ),
      typedGenerator(
        "sentence",
        t("Write a sentence from the notes.", "根据笔记写一个句子。"),
        comparisonTypedBank,
        comparisonWhy,
        writingComparisonsWriteNot,
      ),
    ),
    point(
      "most",
      t("Writing the superlative", "写出最高级"),
      t(
        "To say a place is more than all the others, use *the* and the superlative, then where: *The market is the busiest in our town.* Short words add *-est*; long words take *most*; *good* and *bad* become *best* and *worst*.\n\n> **Watch out.** Always put *the* before a superlative (*the busiest*, not *busiest*), and never mix *most* with *-est* (*the most busiest* is wrong).",
        "说一个地方在所有地方中“最……”，用 *the* 加最高级，再说范围：*The market is the busiest in our town.* 短词加 *-est*；长词前加 *most*；*good* 和 *bad* 变成 *best* 和 *worst*。\n\n> **注意。** 最高级前面不能漏掉 *the*（要写 *the busiest*，不要只写 *busiest*），也不要把 *most* 和 *-est* 叠着用。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Write a sentence from the notes.", "根据笔记写一个句子。"),
        superlativeTypedBank,
        (right, shown) => {
          const adjective = shown.split(" / ")[1] ?? "";
          const form = adjectives.find(([a]) => a === adjective)?.[2] ?? "";
          const rule = compareRule(adjective, form, true);
          return t(
            `The place goes beyond all the others in its area, so it takes *the* and the superlative, then where; ${rule.en}: ${right}\n\n**Check.** Verify all three marks: *the* before *${form}*, the right superlative spelling, and the area phrase at the end.`,
            `这个地方在所有地方中“最……”，所以用 *the* 加最高级，再说范围；${rule["zh-CN"]}：${right}\n\n**检验。** 核对三处：*${form}* 前有 *the*、最高级拼写正确、句末写明了范围。`,
          );
        },
        writingComparisonsMostNot,
      ),
    ),
  ],
};

// Describing a place.

const placeBank: readonly WritingItem[] = [
  {
    task: "Describe your neighborhood for a new classmate.",
    model:
      "I live in a quiet neighborhood in the north of the city. There are tall buildings and a small park with a playground. There is a bakery on the corner, and it sells great bread. The streets are clean and safe. It is quieter than the city center, but it is not boring. I like living here.",
  },
  {
    task: "Describe a village you know.",
    model:
      "My grandparents live in a small village in the mountains. It is two hours from my city by bus. There are about fifty houses, a shop and an old school. There is a river near the village, and the water is very clean. The village is peaceful and pretty. In summer it is cooler than the city.",
  },
  {
    task: "Describe a market in your town.",
    model:
      "There is a big market in the center of my town. It is open every morning. You can buy fruit, vegetables, fish and meat there. There are also some small cafes. The market is always noisy and crowded, but the food is fresh and cheap. It is the busiest place in our town on Saturdays.",
  },
  {
    task: "Describe a park near your home.",
    model:
      "There is a park near my home, next to the river. It has a lake, lots of trees and a playground for children. There is also a small cafe. In the morning, old people do exercises there. The park is green and peaceful. It is my favorite place to read on Sundays.",
  },
  {
    task: "Describe your street.",
    model:
      "I live on Green Street. It is a long street near the station. There are shops, two cafes and a pharmacy. There are many cars, so it is quite noisy in the day. At night it is quieter. My neighbors are friendly and helpful. I think it is a good street to live on.",
  },
  {
    task: "Describe a famous place in your country.",
    model:
      "The Great Wall is in the north of China. It is very long, and it goes over many mountains. There are old towers along the wall. Every year, millions of people visit it. It is very crowded on holidays, so it is better to go early. The view from the top is beautiful.",
  },
  {
    task: "Describe your school for a visitor.",
    model:
      "My school is in the east of the city, near a big park. It has three buildings, a library and a sports field. There is also a new playground. The classrooms are big and modern. The library is the quietest place in the school. I think it is a good school.",
  },
  {
    task: "Describe a square in a town you know.",
    model:
      "There is a beautiful square in the center of my town. In the middle there is a fountain, and children play near it. There are cafes and a bakery around the square. On Sunday evenings, people dance there. The square is crowded at the weekend, but it is safe and friendly.",
  },
  {
    task: "Describe the area where your grandparents live.",
    model:
      "My grandparents live in a small town by the sea. Their house is near the beach. There is a fish market, a church and a few small shops. The streets are narrow and old. The town is much quieter than my city. I love the sound of the sea at night.",
  },
  {
    task: "Describe a beach you have been to.",
    model:
      "Last summer I went to a beach in the south of the island. It is twenty minutes from the town by bus. The sand is white, and the water is very blue. There are a few cafes and a small shop. In the morning it is empty and peaceful. In the afternoon it is more crowded.",
  },
  {
    task: "Describe a shopping street in your city.",
    model:
      "The busiest shopping street in my city is near the main station. It is very long. There are big shops, restaurants and cinemas on both sides. At night there are lights everywhere. It is exciting, but it is very crowded and noisy. I like going there with my friends.",
  },
  {
    task: "Describe a quiet place where you like to go.",
    model:
      "My favorite quiet place is the library in my neighborhood. It is on the second floor of an old building next to the bank. There are thousands of books and big windows. There is a small garden behind it. It is more peaceful than my home. I go there to study after school.",
  },
];

const describingAPlace = judgedTopic({
  id: "writing-a-description-of-a-place",
  title: t("Describing a Place", "描述一个地方"),
  summary: t(
    "Write six to eight sentences about your neighborhood or a place the task names: where it is, what is there and what it is like.",
    "用六到八句话描述你的街区或题目给出的地方：它在哪里、那里有什么、它是什么样的。",
  ),
  intro: t(
    "A vivid description places the reader on the map, lists what stands there, and gives the feel of the area: *My town sits by a quiet bay. There is a small harbor and a busy fish market. It is cooler than the big city.*",
    "生动的地点描写会先交代位置，再写出那里有什么，最后点出氛围：*My town sits by a quiet bay. There is a small harbor and a busy fish market. It is cooler than the big city.*",
  ),
  prerequisites: ["writing-comparisons", "writing-about-a-room"],
  encompasses: [
    { topic: "writing-comparisons", weight: 0.3 },
    { topic: "writing-about-a-room", weight: 0.3 },
  ],
  criteria: ["a2-place-where", "a2-place-what", "a2-place-like", "a1-sentences"],
  point: {
    id: "place",
    title: t("Where, what is there and what it is like", "在哪里、有什么、什么样"),
    explanation: t(
      "A description of a place answers three questions:\n\n- Where is it? *It is in the north of the city, near the river.*\n- What is there? Use *there is* and *there are*: *There is a bakery. There are two cafes.*\n- What is it like? Use adjectives and a comparison: *It is peaceful. It is quieter than the city center.*\n\nYou can end with what you think of it: *I like living here.*\n\n> **Watch out.** Use *There is / There are* (not *Have* or repeated *It has*) to introduce what is in a place, and make sure you cover all three questions.",
      "描述一个地方要回答三个问题：\n\n- 它在哪里？*It is in the north of the city, near the river.*\n- 那里有什么？用 *there is* 和 *there are*：*There is a bakery. There are two cafes.*\n- 它是什么样的？用形容词和比较句：*It is peaceful. It is quieter than the city center.*\n\n最后可以说说你的看法：*I like living here.*\n\n> **注意。** 介绍某地有什么时用 *There is / There are*（不要总用 *It has* 代替“有”），并确保三个问题都写到。",
    ),
  },
  question: t(
    "Write six to eight sentences in English about the place the task names: where it is, what is there and what it is like.",
    "根据题目用英语写六到八句话，描述这个地方：它在哪里、那里有什么、它是什么样的。",
  ),
  bank: placeBank,
  limits: { minWords: 40, maxChars: 900 },
  what: t("description", "描述"),
});

/** topics are the topics of the unit Neighbors and Community. */
export const topics: readonly TopicDef[] = [
  neighborhood.topic,
  helping.topic,
  people.topic,
  describing.topic,
  pronouns.topic,
  possessivePronouns,
  writingComparisons,
  describingAPlace,
];

/** vocabulary are the words the unit Neighbors and Community teaches. */
export const vocabulary: readonly WordBatch[] = [neighborhood.batch, helping.batch, people.batch, describing.batch, pronouns.batch];
