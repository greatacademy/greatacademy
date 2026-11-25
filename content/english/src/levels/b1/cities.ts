// B1, unit 9: Cities and Transport. City life, getting around, city problems, location, buildings and city services;
// so and such; may, might and could. Its how-to paragraph reuses the native writing topic.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { fill } from "../a2/kit.ts";
import { everyPair, interleave, vocabularyTopic, word } from "../words.ts";

const cityLife = vocabularyTopic({
  id: "b1-words-city-life",
  title: t("City Life", "城市生活"),
  summary: t(
    "Urban and rural; suburbs and downtown; skyscrapers and residents; housing, rent and property; districts, facilities and sidewalks.",
    "城市的和农村的；郊区和市中心；摩天大楼和居民；住房、租金和房产；城区、设施和人行道。",
  ),
  intro: t(
    "Ana left a **rural** village for the city: now she **rents** a tiny flat in a busy **district**, with a **skyscraper** on one side and a crowded **sidewalk** below. These words help you talk about where people live in and around a city.",
    "安娜离开 **rural**（乡村的）村子来到城市：如今她在一个热闹的 **district**（城区）**rent**（租）了一套小公寓，一边是 **skyscraper**（摩天大楼），楼下是拥挤的 **sidewalk**（人行道）。这些词帮你谈论人们在城市内外居住的地方。",
  ),
  prerequisites: ["a2-words-neighborhood"],
  words: [
    word(
      "urban",
      "of a town or a city",
      "城市的",
      "More than half of the world's people now live in {urban} areas, in towns and cities rather than the countryside. | {Urban} life, with its traffic, noise and crowds of people, can be stressful. | The government wants to reduce {urban} traffic, so it is building more subway lines in the city.",
      "rural royal",
      "downtown",
    ),
    word(
      "rural",
      "of the countryside",
      "农村的；乡村的",
      "My grandparents live in a small {rural} village far from the city. | Life in {rural} areas is quieter than in the city. | Farming is the main work in this {rural} area.",
      "urban royal",
    ),
    word(
      "suburb suburbs",
      "an area where people live outside the center of a city",
      "郊区",
      "We moved from the city center to a quiet {suburb} with gardens and parks. | Most families with children live in the {suburbs}, outside the city center, where houses are bigger.|skyscrapers sidewalks | The train takes forty minutes from the {suburbs} to the center.|skyscrapers sidewalks",
      "skyscraper sidewalk",
    ),
    word(
      "downtown",
      "in or to the center of a city, where the shops and offices are",
      "市中心；在市中心",
      "Let's take the bus to the {downtown} area, where the big shops are. | She works in a {downtown} office, right in the city center. | The {downtown} area is full of restaurants, offices and big shops.",
      "rural suburban",
      "urban",
    ),
    word(
      "skyscraper skyscrapers",
      "a very tall building in a city",
      "摩天大楼",
      "Shanghai has many {skyscrapers} more than four hundred meters tall.|cottages suburbs | The office is on the fiftieth floor of a {skyscraper}. | New York is famous for its {skyscrapers}, which seem to touch the sky.|cottages suburbs",
      "cottage suburb",
    ),
    word(
      "resident residents",
      "a person who lives in a particular place",
      "居民",
      "The {residents} of this street, who have lived here for years, are angry about the noise.|visitors tourists | Parking here is only for {residents} who live in these houses.|visitors tourists | She has been a {resident} of Paris for ten years.",
      "visitor tourist",
    ),
    word(
      "housing",
      "buildings for people to live in",
      "住房",
      "There isn't enough cheap {housing} in the city: many young people can't find a place to live. | The government plans to build more {housing} for young families: new apartments near the subway. | {Housing} is very expensive in London: a small flat costs a fortune.",
      "facility transport",
    ),
    word(
      "rent rents rented renting",
      "to pay money to use a home or a thing that belongs to someone else; the money you pay",
      "租用；租金",
      "We {rent} a small apartment near the university and pay the owner every month. | Students often {rent} rooms together because buying a flat costs too much. | They {rented} bikes and rode around the lake.|lent sold",
      "lend sell",
    ),
    word(
      "property properties",
      "a building or land that someone owns",
      "房产；地产；财产",
      "{Property} prices have doubled in ten years. | They own several {properties} in the city: two houses and a shop.|facilities districts | This house and garden are private {property}, so please don't come in.",
      "facility district",
    ),
    word(
      "district districts",
      "an area of a town or a country",
      "城区；地区",
      "Our school is in the city's university {district}, where there are five universities close together. | The business {district} is full of skyscrapers. | Beijing is divided into sixteen {districts}.|suburbs facilities",
      "suburb facility",
    ),
    word(
      "facility facilities",
      "a building or a room for a particular use, such as a sports center or a toilet",
      "设施",
      "The school has excellent sports {facilities}.|properties districts | The hotel has good {facilities} for children, such as a pool and a playroom.|properties districts | There are no washing {facilities} at the campsite.|properties districts",
      "property district",
    ),
    word(
      "sidewalk sidewalks",
      "the path at the side of a street for people to walk on",
      "人行道",
      "Don't ride your bike on the {sidewalk}; it's for people walking. | The {sidewalks} were covered in snow, so people walking had to be careful.|highways districts | People sat at tables on the {sidewalk} outside the café.",
      "highway district",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Urban* and *rural* are opposites: *urban* is about towns and cities, and *rural* is about the countryside, farms and villages. Look for traffic and subways, or for farms and fields.",
        "*urban* 和 *rural* 是反义词：*urban* 和城镇有关，*rural* 和乡村、农场有关。找找句子里是交通和地铁，还是农场和田野。",
      ),
      meaning: t(
        "*Housing* and *property* both name buildings, but *housing* is homes for people to live in, and *property* is a building or land that someone owns. Check whether the meaning says living in or owning.",
        "*housing* 和 *property* 都指建筑，但 *housing* 是供人居住的住房，*property* 是某人拥有的房产或土地。看清释义说的是居住还是拥有。",
      ),
      spell: t(
        "*Facility* changes y to -ies for more than one, *facilities*, and *sidewalk* hides a silent l: side-**walk**.",
        "*facility* 的复数把 y 变成 -ies：*facilities*；*sidewalk* 里藏着不发音的 l：side-**walk**。",
      ),
    },
    notes: `
      urban|towns and cities rather than the countryside;traffic, noise and crowds;subway lines in the city|urban is about towns and cities; rural is about the countryside|urban 与城市有关；rural 与乡村有关|rural=rural means of the countryside, the opposite of towns, cities and subways=rural 是乡村的，正与城镇和地铁相反;royal=royal means of a king or a queen, not of a town or a city=royal 是国王或王后的，不是城市的|ur · ban|ur said like *er*, as in *turn*|ur 读作 *er*，和 *turn* 一样
      rural|a village far from the city;quieter areas than the city;farming as the main work|rural is about the countryside; urban is about cities|rural 与乡村有关；urban 与城市有关|urban=urban means of a town or a city, not of villages, fields and farms=urban 是城市的，不是村庄、田野和农场的;royal=royal means of a king or a queen, nothing to do with the countryside=royal 是国王或王后的，与乡村无关|ru · ral|ru-ral: r at the start of both parts|两块都以 r 开头：ru-ral
      suburb|a quiet place with gardens and parks;families with bigger houses outside the center;forty minutes by train to the center|a suburb is where people live outside the city center; a skyscraper is one tall building|suburb 是市中心外的居住区；skyscraper 是一栋高楼|skyscraper/skyscrapers=skyscraper is one very tall building, not a whole area of homes and gardens=skyscraper 是一栋很高的楼，不是有房子和花园的整片地区;sidewalk/sidewalks=sidewalk is the path beside a street, not an area where families live=sidewalk 是街边的人行道，不是家庭居住的地区|sub · urb|sub- (under, near) + urb, as in *urban*|sub-（靠近）加 urb，和 *urban* 一样
      downtown|big shops reached by bus;an office right in the city center;restaurants, offices and big shops|downtown is the center of a city; a suburb is outside it|downtown 是市中心；suburb 在市中心以外|rural=rural means of the countryside, not the busy center of a city=rural 是乡村的，不是城市的繁华中心;suburban=suburban means of the quiet areas outside the center, not the center itself=suburban 是市中心外安静地区的，不是市中心本身|down · town|down + town joined, with ow said the same in both|down 和 town 连写，两个 ow 读音相同
      skyscraper|buildings more than four hundred meters tall;the fiftieth floor of an office;New York buildings that seem to touch the sky|a skyscraper is a very tall building; a cottage is a small house in the country|skyscraper 是摩天大楼；cottage 是乡间小屋|cottage/cottages=cottage is a small house in the countryside, not a very tall building with many floors=cottage 是乡下的小房子，不是很多层的高楼;suburb/suburbs=suburb is an area outside the city center, not one tall building=suburb 是市中心外的地区，不是一栋高楼|sky · scrap · er|sky + scraper: it scrapes the sky|sky 加 scraper：刮着天空
      resident|people who have lived on a street for years;parking for people who live in these houses;ten years living in Paris|a resident lives in a place; a visitor only comes for a short time|resident 住在某地；visitor 只是短暂来访|visitor/visitors=visitor comes to a place for a short time and does not live there=visitor 只是短暂来访，并不住在那里;tourist/tourists=tourist travels to a place for a holiday, not someone who lives there=tourist 是来度假的游客，不是住在那里的人|res · i · dent|-ent at the end, not -ant|结尾是 -ent，不是 -ant
      housing|young people unable to find a place to live;new apartments for young families;a small, very expensive flat in London|housing is homes for people to live in; property is a building or land someone owns|housing 是供人住的房子；property 是某人拥有的房产|facility=facility is a building or a room for a special use, such as a gym, not homes to live in=facility 是有特殊用途的设施，比如健身房，不是住的房子;transport=transport is a way of carrying people or goods, not homes to live in=transport 是运送人或货物的方式，不是住的房子|hous · ing|house drops its e before -ing|house 去掉 e 再加 -ing
      rent|paying the owner of an apartment every month;students sharing rooms because buying costs too much;bikes for a ride around a lake|you rent something by paying to use it; you lend something by letting someone use it|rent 是付钱使用别人的东西；lend 是把自己的东西借给别人|lend/lent=lend means to give something of yours to someone for a while, not to pay to use something of theirs=lend 是把自己的东西借出，不是付钱用别人的东西;sell/sold=sell means to give something to someone for money for ever, not to pay to use it for a time=sell 是卖掉东西，不是付钱用一段时间|rent|nt at the end; the past is *rented*|结尾是 nt；过去式是 *rented*
      property|prices that have doubled in ten years;two houses and a shop someone owns;a private house and garden|property is a building or land that someone owns; a facility is a place for a special use|property 是某人拥有的房产或土地；facility 是有特定用途的设施|facility/facilities=facility is a room or a building for a special use, such as a pool, not something that has a price as a home or land=facility 是有特定用途的场所，比如泳池，不是作为房产或土地标价的东西;district/districts=district is a whole area of a town, not a building or land that one person owns=district 是城市的一整片地区，不是个人拥有的房产|prop · er · ty|proper + -ty, and -ies for more than one|proper 加 -ty，复数为 -ies
      district|five universities close together;a business area full of skyscrapers;Beijing's sixteen areas|a district is any area of a town or country; a suburb is a living area outside the center|district 是城市或国家的任何一片区域；suburb 是市中心外的居住区|suburb/suburbs=suburb is a quiet living area outside the city center, not a busy business or university area inside it=suburb 是市中心外安静的居住区，不是城里繁忙的商业或大学区;facility/facilities=facility is a building or room for a special use, not a large area of a city=facility 是有特殊用途的建筑或房间，不是城市的一大片区域|dis · trict|str in the middle, and -ict at the end|中间是 str，结尾是 -ict
      facility|excellent sports places at a school;a pool and a playroom for children;nowhere to wash at a campsite|a facility is a building or a room for a special use; a property is a building someone owns|facility 是有特定用途的建筑或房间；property 是某人拥有的房产|property/properties=property is a building or land someone owns, not a pool, a gym or a washroom for people to use=property 是某人拥有的房产，不是供人使用的泳池、健身房或盥洗室;district/districts=district is a whole area of a town, not a room or a building for one use=district 是城市的一片区域，不是有特定用途的房间或建筑|fa · cil · i · ty|c said like s, and y to -ies for more than one|c 读 s，复数把 y 变成 -ies
      sidewalk|a bike ride where people walk;snow where people walking must be careful;tables outside a café|a sidewalk is the path for walking beside a street; a highway is a fast road for cars|sidewalk 是街边供人走的路；highway 是汽车走的快速公路|highway/highways=highway is a big, fast road for cars between cities, not a path for people walking=highway 是城市之间供汽车行驶的快速公路，不是供人走的小路;district/districts=district is a whole area of a town, not the path beside one street=district 是城市的一片区域，不是一条街边的小路|side · walk|side + walk, with a silent l in walk|side 加 walk，walk 里的 l 不发音
    `,
  },
});

const gettingAround = vocabularyTopic({
  id: "b1-words-getting-around",
  title: t("Getting Around", "出行"),
  summary: t(
    "Commuting; transport, transportation and vehicles; pedestrians and cyclists; lanes and jams; the rush; parking, fares and highways.",
    "通勤；交通、运输和车辆；行人和骑自行车的人；车道和堵车；匆忙；停车、车费和公路。",
  ),
  intro: t(
    "Every morning Tom **commutes** downtown by bus; in the **rush** hour the bus sits in a traffic **jam** while **cyclists** speed past in their own **lane**. These words help you talk about how people travel around a city.",
    "每天早上汤姆坐公交 **commute**（通勤）到市中心；**rush**（高峰）时段公交车堵在 **jam**（堵车）里，**cyclists**（骑车的人）却在自己的 **lane**（车道）上飞驰而过。这些词帮你谈论人们怎样在城市里出行。",
  ),
  prerequisites: ["a2-words-transport"],
  words: [
    word(
      "commute commutes commuted commuting",
      "to travel regularly between your home and your work or school",
      "通勤；上下班往返",
      "I {commute} between my home in the suburbs and my office every day by train. | She {commutes} two hours each way.|rushes parks | {Commuting} to work and back by bike is good for your health.|rushing parking",
      "rush park",
    ),
    word(
      "transport transports",
      "a way of carrying people or goods from one place to another",
      "交通工具；运输",
      "Public {transport} in this city is cheap and fast. | The bike is the cheapest form of {transport}. | {Transport} by ship is the cheapest way to move goods around the world.",
      "fare traffic",
      "transportation vehicle",
    ),
    word(
      "transportation",
      "a system or a way of moving people or goods",
      "交通运输",
      "The city needs better {transportation}: more buses and trains. | Is {transportation} included in the price of the trip? | Buses are the main {transportation} for students here.",
      "traffic highway",
      "transport vehicle",
    ),
    word(
      "vehicle vehicles",
      "a machine such as a car, a bus or a truck that carries people or things",
      "车辆；交通工具",
      "No {vehicles} are allowed in the old town; cars, buses and trucks must stay outside.|pedestrians cyclists | Electric {vehicles} are becoming more popular.|pedestrians cyclists | The police stopped the {vehicle} and asked the driver to open its doors.",
      "pedestrian cyclist",
      "transport transportation",
    ),
    word(
      "pedestrian pedestrians",
      "a person who is walking in a street",
      "行人",
      "This street is only for {pedestrians}: no cars or bikes, just people on foot.|cyclists drivers | The driver didn't see the {pedestrian} walking across the road. | {Pedestrians} walking to the station should use the bridge to cross the highway.|cyclists drivers",
      "cyclist driver",
    ),
    word(
      "cyclist cyclists",
      "a person who rides a bike",
      "骑自行车的人",
      "{Cyclists} should always wear a helmet when they ride.|pedestrians drivers | The new lane is only for {cyclists} on bikes.|pedestrians drivers | A {cyclist} was hurt in the accident when a car hit his bike.",
      "pedestrian driver",
    ),
    word(
      "lane lanes",
      "a part of a road for one line of traffic; a narrow road in the country",
      "车道；小路",
      "The city has built new bike {lanes}.|jams fares | The bus was in the wrong {lane} of the road and had to move left. | We walked down a quiet country {lane}.",
      "jam fare",
    ),
    word(
      "jam jams",
      "a long line of cars that cannot move",
      "堵车",
      "We were stuck in a traffic {jam} for an hour. | There are always {jams} on this road in the morning, and cars don't move for twenty minutes.|lanes fares | The accident caused a huge {jam}.",
      "lane fare",
    ),
    word(
      "rush rushes rushed rushing",
      "to move or do something very quickly; a time when many people are hurrying",
      "匆忙；高峰",
      "I had to {rush} to catch the bus. | Don't travel during the {rush} hour if you can. | She {rushed} out of the house without breakfast.|commuted parked",
      "commute park",
    ),
    word(
      "parking",
      "leaving a car somewhere for a time; a place to do this",
      "停车；停车位",
      "{Parking} your car downtown is very expensive. | There's free {parking} behind the supermarket. | You'll get a ticket for {parking} here.",
      "fare traffic",
    ),
    word(
      "fare fares",
      "the money you pay to travel by bus, train, taxi or plane",
      "车费；票价",
      "The bus {fare} is two yuan. | Taxi {fares} go up at night.|lanes jams | Students pay half {fare} on the subway.",
      "lane jam",
    ),
    word(
      "highway highways",
      "a big, fast road between cities",
      "公路；高速公路",
      "We drove along the {highway} to Hangzhou at 120 kilometers an hour. | The new {highway} will cut the journey by an hour. | Accidents on {highways} are often serious because cars go so fast.|sidewalks lanes",
      "sidewalk lane",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Pedestrian* and *cyclist* are both people on the street without a car, but a *pedestrian* walks and a *cyclist* rides a bike. Look for on foot and walking, or for bikes, helmets and riding.",
        "*pedestrian* 和 *cyclist* 都是街上不开车的人，但 *pedestrian* 步行，*cyclist* 骑自行车。找找句子里是步行，还是自行车、头盔和骑行。",
      ),
      meaning: t(
        "*Fare* and *parking* both cost money when you travel, but a *fare* is what you pay to ride a bus, train, taxi or plane, and *parking* is leaving your own car somewhere. Check whether the meaning says riding or leaving a car.",
        "*fare* 和 *parking* 都是出行时要花的钱，但 *fare* 是乘公交、火车、出租车或飞机的车费，*parking* 是把自己的车停在某处。看清释义说的是乘车还是停车。",
      ),
      spell: t(
        "*Vehicle* has a silent h, said *vee-ikl*, and *pedestrian* starts with *ped-*, the Latin word for foot.",
        "*vehicle* 里的 h 不发音，读作 *vee-ikl*；*pedestrian* 以 *ped-* 开头，在拉丁语里是“脚”。",
      ),
    },
    notes: `
      commute|a daily train between a home in the suburbs and an office;two hours each way;going to work and back by bike|to commute is to travel the same way to work or school every day; to rush is to go very fast once|commute 是每天往返上班或上学；rush 是某一次匆忙赶路|rush/rushes/rushing=rush means to go or do something very fast, not to make the same trip to work every day=rush 是匆忙赶路，不是每天固定往返上班;park/parks/parking=park means to leave a car somewhere, not to travel between home and work=park 是停车，不是在家和单位之间往返|com · mute|com- + mute, with u-e said like *you*|com- 加 mute，u-e 读作 *you*
      transport|cheap and fast buses and trains in a city;a bike as the cheapest way to travel;ships moving goods around the world|transport is a way of carrying people or goods; traffic is the cars on a road|transport 是运送人或货物的方式；traffic 是路上的车流|fare=fare is the money you pay for one trip, not a way of carrying people or goods=fare 是一次乘车付的钱，不是运送人或货物的方式;traffic=traffic is the cars and buses on the roads at one time, not a way of travelling=traffic 是某时路上的车流，不是出行的方式|trans · port|trans- (across) + port (carry)|trans-（跨越）加 port（运送）
      transportation|more buses and trains in a city;travel included in the price of a trip;buses as students' main way to travel|transportation is the system of moving people or goods; a highway is one road|transportation 是运送人或货物的系统；highway 只是一条路|traffic=traffic is the cars on a road at one time, not a system of buses and trains=traffic 是某时路上的车流，不是公交和火车组成的系统;highway=highway is one big road, not the whole way of moving people=highway 只是一条大路，不是整个运送人的方式|trans · por · ta · tion|transport + -ation|transport 加 -ation
      vehicle|cars, buses and trucks kept out of an old town;electric machines becoming more popular;a driver opening its doors for the police|a vehicle is a machine that carries people or things; a pedestrian is a person walking|vehicle 是运载人或物的机器；pedestrian 是步行的人|pedestrian/pedestrians=pedestrian is a person walking, not a machine such as a car or a truck=pedestrian 是步行的人，不是汽车或卡车这样的机器;cyclist/cyclists=cyclist is a person riding a bike, not a machine with an engine=cyclist 是骑车的人，不是有发动机的机器|ve · hi · cle|a silent h: said *vee-ikl*|h 不发音：读作 *vee-ikl*
      pedestrian|a street for people on foot;someone walking across the road;people walking to a station over a bridge|a pedestrian walks; a cyclist rides a bike|pedestrian 步行；cyclist 骑自行车|cyclist/cyclists=cyclist rides a bike, not someone who goes on foot=cyclist 是骑自行车的人，不是步行的人;driver/drivers=driver drives a car, not someone who walks=driver 是开车的人，不是步行的人|pe · des · tri · an|*ped-* means foot, and -ian at the end|*ped-* 意为“脚”，结尾是 -ian
      cyclist|a helmet when riding;a lane for people on bikes;a car hitting a bike|a cyclist rides a bike; a pedestrian walks|cyclist 骑自行车；pedestrian 步行|pedestrian/pedestrians=pedestrian walks on foot and does not ride a bike or need a bike lane=pedestrian 是步行的人，不骑车，也不用自行车道;driver/drivers=driver drives a car, not a person riding a bike=driver 是开车的人，不是骑车的人|cy · clist|cy said like *sigh*, and y is the vowel|cy 读作 *sigh*，y 当元音
      lane|new parts of the road for bikes;a bus in the wrong part of the road;a quiet country road|a lane is one part of a road or a small country road; a jam is cars that cannot move|lane 是车道或乡间小路；jam 是动不了的车流|jam/jams=jam is a long line of cars that cannot move, not a part of the road or a small road you walk down=jam 是动不了的长长车队，不是车道或可以走的小路;fare/fares=fare is the money you pay to travel, not a part of a road=fare 是车费，不是道路的一部分|lane|a-e says its name; *line*, which looks alike, is any long mark|a-e 读字母本音；长得像的 *line* 是线条
      jam|an hour stuck in traffic;cars not moving for twenty minutes every morning;a huge line of cars after an accident|a jam is cars that cannot move; a lane is one part of a road|jam 是堵住的车流；lane 是一条车道|lane/lanes=lane is one part of a road for one line of cars, not cars stuck and not moving=lane 是一条车道，不是堵住不动的车;fare/fares=fare is the money you pay for a trip, not cars stuck on a road=fare 是车费，不是堵在路上的车|jam|short a, as in *man*|短元音 a，和 *man* 一样
      rush|hurrying to catch a bus;the busy hour to avoid;running out without breakfast|to rush is to hurry; to commute is to travel to work every day|rush 是匆忙；commute 是每天通勤|commute/commuted=commute means to make the same trip to work or school every day, not to hurry once=commute 是每天固定往返，不是某一次赶时间;park/parked=park means to leave a car somewhere, not to move very fast=park 是停车，不是快速移动|rush|sh at the end, as in *brush*|结尾是 sh，和 *brush* 一样
      parking|an expensive place to leave a car downtown;free space behind a supermarket;a ticket for leaving a car here|parking is leaving a car somewhere; a fare is what you pay to ride|parking 是停车；fare 是乘车付的钱|fare=fare is the money you pay to ride a bus, train or taxi, not leaving your own car somewhere=fare 是乘公交、火车或出租车的钱，不是把自己的车停在某处;traffic=traffic is the cars moving on a road, not leaving a car in one place=traffic 是路上行驶的车，不是把车停在一处|park · ing|park + -ing|park 加 -ing
      fare|two yuan for a bus;taxi prices going up at night;students paying half on the subway|a fare is the money for a trip; a lane is a part of a road|fare 是车费；lane 是一条车道|lane/lanes=lane is a part of a road, not money you pay for a trip=lane 是车道，不是乘车付的钱;jam/jams=jam is cars that cannot move, not money you pay for a ride=jam 是堵住的车，不是乘车的钱|fare|a-r-e said like *air*; *fair*, which sounds the same, is a market or means just|are 读作 *air*；同音的 *fair* 是集市或公平的意思
      highway|driving at 120 kilometers an hour to Hangzhou;a new road cutting a journey by an hour;serious accidents where cars go fast|a highway is a big, fast road between cities; a lane is one part of a road|highway 是城市间的快速公路；lane 是道路中的一条车道|sidewalk/sidewalks=sidewalk is a path for people walking, not a fast road for cars between cities=sidewalk 是供人走的路，不是城市间的快速公路;lane/lanes=lane is one part of a road, or a small country road, not a big road between cities=lane 是一条车道或乡间小路，不是城市之间的大路|high · way|high + way, with a silent gh|high 加 way，gh 不发音
    `,
  },
});

const cityProblems = vocabularyTopic({
  id: "b1-words-city-problems",
  title: t("City Problems", "城市问题"),
  summary: t(
    "Vandalism and graffiti; homeless people and poverty; shortages and overcrowding; smog and congestion; unemployment; lacking; growth and pressure.",
    "故意破坏和涂鸦；无家可归者和贫困；短缺和过度拥挤；雾霾和拥堵；失业；缺乏；增长和压力。",
  ),
  intro: t(
    "The city's fast **growth** has brought **congestion** on the roads, **smog** in the air and a **shortage** of cheap homes, so some families are now **homeless**. These words help you talk about the problems of big cities and their causes.",
    "这座城市的快速 **growth**（增长）带来了道路 **congestion**（拥堵）、空气中的 **smog**（雾霾）和廉价住房的 **shortage**（短缺），一些家庭因此 **homeless**（无家可归）。这些词帮你谈论大城市的问题及其原因。",
  ),
  prerequisites: ["b1-words-city-life"],
  words: [
    word(
      "vandalism",
      "damaging public buildings or things on purpose",
      "故意破坏公物",
      "Someone broke all the windows of the bus stop; it was an act of {vandalism}. | The town has cameras to stop {vandalism}: people breaking benches and lights in the park. | {Vandalism}, such as smashed windows and broken benches, costs the city a lot of money every year.",
      "graffiti poverty",
    ),
    word(
      "homeless",
      "having no home",
      "无家可归的",
      "There are many {homeless} people sleeping in the station. | She works at a shelter for {homeless} families. | After the flood, a thousand people were {homeless}.",
      "overcrowded urban",
    ),
    word(
      "poverty",
      "being very poor",
      "贫困",
      "Millions of children live in {poverty}. | Many families in {poverty} cannot pay for food, clothes or a doctor. | The government promised to end {poverty}, so that no family would be too poor to eat.",
      "unemployment growth",
    ),
    word(
      "shortage shortages",
      "a situation in which there is not enough of something",
      "短缺",
      "There is a {shortage} of doctors in rural areas: one doctor for ten villages. | Water {shortages} are common in summer when it doesn't rain.|growths congestions | The city faces a serious housing {shortage}: there are not enough homes for everyone.",
      "growth congestion",
      "lack",
    ),
    word(
      "overcrowded",
      "with too many people in a place",
      "过度拥挤的",
      "The trains are {overcrowded} at rush hour, and people stand pressed together. | Many families live in small, {overcrowded} apartments where six people share two rooms. | The beach was so {overcrowded} that we couldn't find a place to sit.",
      "homeless urban",
    ),
    word(
      "smog",
      "dirty air, made of smoke and fog, over a city",
      "雾霾；烟雾",
      "On some days, the {smog} is so bad that you can't see the mountains. | Smoke from cars and factories mixes with fog to make {smog}. | People wear masks because of the {smog}.",
      "graffiti congestion",
    ),
    word(
      "graffiti",
      "words or pictures painted on walls in public places",
      "涂鸦",
      "The wall was covered in {graffiti}. | Some people think {graffiti} is art. | Students spent Saturday cleaning {graffiti} off the school walls.",
      "vandalism smog",
    ),
    word(
      "unemployment",
      "the number of people who do not have a job; not having a job",
      "失业；失业率",
      "{Unemployment} is high among young people: one in five can't find a job. | When the factory closed, {unemployment} rose quickly as hundreds of workers lost their jobs. | The government is trying to reduce {unemployment} by creating new jobs.",
      "poverty congestion",
    ),
    word(
      "congestion",
      "too much traffic on the roads",
      "拥堵；交通堵塞",
      "The new subway line has reduced {congestion} on the roads downtown, so cars move faster. | Traffic {congestion} is the city's biggest problem. | Drivers pay a fee to enter the center, which cuts {congestion}: fewer cars, fewer jams.",
      "smog unemployment",
    ),
    word(
      "lack lacks lacked lacking",
      "to not have enough of something; not having enough",
      "缺乏；缺少",
      "The city {lacks} good public transport, so most people drive.|grows causes | Many old people {lack} exercise and sit at home all day. | What the school {lacked} was money.|grew caused",
      "grow cause",
      "shortage",
    ),
    word(
      "growth",
      "getting bigger or increasing",
      "增长；发展",
      "The rapid {growth} of the city has caused many problems. | There has been a {growth} in the number of cars, from one million to three million. | Children need good food for healthy {growth}.",
      "shortage pressure",
    ),
    word(
      "pressure pressures",
      "a feeling of worry because of the things you must do; strong force",
      "压力",
      "Students are under a lot of {pressure} before exams. | Rising rents are putting {pressure} on young families. | Living in a big city brings {pressure}: long hours, high rents and always being in a hurry.",
      "growth shortage",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Vandalism* and *graffiti* both hurt public places, but *vandalism* is breaking or damaging things on purpose, and *graffiti* is words or pictures painted on walls. Look for broken and smashed, or for painted walls.",
        "*vandalism* 和 *graffiti* 都会损害公共场所，但 *vandalism* 是故意砸坏东西，*graffiti* 是在墙上涂写的字或画。找找句子里是打碎砸坏，还是墙上的涂画。",
      ),
      meaning: t(
        "*Poverty* and *unemployment* often go together, but *poverty* is being very poor, and *unemployment* is not having a job. Check whether the meaning says poor or without work.",
        "*poverty* 和 *unemployment* 常一起出现，但 *poverty* 是非常贫穷，*unemployment* 是没有工作。看清释义说的是贫穷还是失业。",
      ),
      spell: t(
        "*Graffiti* has a double f and a double t, and *overcrowded* is *over* + *crowded* written as one word.",
        "*graffiti* 的 f 和 t 都要双写；*overcrowded* 是 *over* 加 *crowded*，连写成一个词。",
      ),
    },
    notes: `
      vandalism|broken windows at a bus stop;people breaking benches and lights in a park;smashed windows and broken benches that cost money|vandalism is breaking things on purpose; graffiti is painting on walls|vandalism 是故意砸坏东西；graffiti 是在墙上涂画|graffiti=graffiti is words or pictures painted on walls, not breaking windows or benches=graffiti 是在墙上涂写字或画，不是砸坏窗户或长椅;poverty=poverty is being very poor, not damaging things on purpose=poverty 是非常贫穷，不是故意破坏东西|van · dal · ism|-ism at the end, as in *tourism*|结尾是 -ism，和 *tourism* 一样
      homeless|people sleeping in a station;a shelter for families;a thousand people after a flood|homeless means having no home; overcrowded means with too many people|homeless 是无家可归；overcrowded 是人太多|overcrowded=overcrowded means a place has too many people in it, not that people have nowhere to live=overcrowded 是某地人太多，不是人们无处可住;urban=urban means of a town or a city, not having no home=urban 是城市的，不是没有家|home · less|home + -less (without)|home 加 -less（没有）
      poverty|millions of children;families unable to pay for food, clothes or a doctor;no family too poor to eat|poverty is being very poor; unemployment is having no job|poverty 是非常贫穷；unemployment 是没有工作|unemployment=unemployment is not having a job, not being too poor to eat or pay for things=unemployment 是没有工作，不是穷得吃不上饭、付不起钱;growth=growth is getting bigger or more, not being very poor=growth 是变大或增多，不是非常贫穷|pov · er · ty|-er- in the middle and -ty at the end|中间是 -er-，结尾是 -ty
      shortage|one doctor for ten villages;water in summer when it doesn't rain;not enough homes for everyone|a shortage is not having enough; growth is getting more|shortage 是不够；growth 是增加|growth/growths=growth is getting bigger or more, the opposite of not having enough=growth 是变大或增多，正好和不够相反;congestion/congestions=congestion is too much traffic, not too few doctors, homes or water=congestion 是车太多，不是医生、住房或水太少|short · age|short + -age|short 加 -age
      overcrowded|people pressed together on rush-hour trains;six people sharing two rooms;no place to sit on a beach|overcrowded means with too many people; homeless means with no home|overcrowded 是人太多；homeless 是没有家|homeless=homeless means having no home, not a place with too many people in it=homeless 是没有家，不是某地人太多;urban=urban means of a city, not full of too many people=urban 是城市的，不是人太多|o · ver · crowd · ed|over + crowded, written as one word|over 加 crowded，连写成一个词
      smog|mountains you cannot see;smoke from cars and factories mixed with fog;masks people wear|smog is dirty air over a city; congestion is too much traffic|smog 是城市上空的脏空气；congestion 是交通拥堵|graffiti=graffiti is paint on walls, not dirty air you breathe or cannot see through=graffiti 是墙上的涂鸦，不是吸进去、看不透的脏空气;congestion=congestion is too many cars on the roads, not smoke and fog in the air=congestion 是路上车太多，不是空气中的烟和雾|smog|*smoke* + *fog* joined into one short word|*smoke* 和 *fog* 合成的短词
      graffiti|a wall covered in words and pictures;something some people call art;cleaning paint off school walls|graffiti is painting on walls; vandalism is breaking things|graffiti 是墙上涂鸦；vandalism 是故意破坏|vandalism=vandalism is breaking or damaging things, not words and pictures painted on walls=vandalism 是砸坏东西，不是在墙上涂写的字和画;smog=smog is dirty air over a city, not paint on walls=smog 是城市上空的脏空气，不是墙上的颜料|graf · fi · ti|a double f and a double t|f 和 t 都双写
      unemployment|one in five young people unable to find a job;hundreds of workers losing their jobs;creating new jobs|unemployment is not having a job; poverty is being very poor|unemployment 是没有工作；poverty 是非常贫穷|poverty=poverty is being very poor, not the number of people without a job=poverty 是非常贫穷，不是没有工作的人数;congestion=congestion is too much traffic, not people without jobs=congestion 是交通拥堵，不是没有工作的人|un · em · ploy · ment|un- + employ + -ment|un- 加 employ 再加 -ment
      congestion|cars moving faster after a new subway line;the city's biggest traffic problem;fewer cars and fewer jams|congestion is too much traffic; smog is dirty air|congestion 是交通拥堵；smog 是脏空气|smog=smog is dirty air, not too many cars on the roads=smog 是脏空气，不是路上车太多;unemployment=unemployment is people without jobs, not too much traffic=unemployment 是失业，不是交通太多|con · ges · tion|g said like j, and -tion said like *chun*|g 读 j，-tion 读作 *chun*
      lack|a city where most people drive;old people sitting at home all day;a school without money|to lack something is not to have enough of it; to grow is to get bigger|lack 是缺少；grow 是增长|grow/grows/grew=grow means to get bigger or to make plants come up, not to be without something=grow 是增长或种植，不是缺少;cause/causes/caused=cause means to make something happen, not to be without it=cause 是导致某事发生，不是缺少某物|lack|ck at the end, as in *back*|结尾是 ck，和 *back* 一样
      growth|a city getting bigger fast;cars going from one million to three million;good food for healthy children|growth is getting bigger; a shortage is not having enough|growth 是变大；shortage 是不够|shortage=shortage is not having enough of something, not getting bigger=shortage 是不够，不是变大;pressure=pressure is worry about things you must do, not getting bigger=pressure 是要做的事带来的压力，不是变大|growth|grow + -th, with ow as in *grow*|grow 加 -th，ow 和 *grow* 一样
      pressure|students before exams;rising rents and young families;long hours, high rents and always hurrying|pressure is worry from things you must do; growth is getting bigger|pressure 是要做的事带来的压力；growth 是变大|growth=growth is getting bigger, not the worry of exams, rents and long hours=growth 是变大，不是考试、房租和长时间工作带来的担忧;shortage=shortage is not having enough of something, not the feeling of worry=shortage 是某物不够，不是担忧的感觉|pres · sure|press + -ure, with ss said like *sh*|press 加 -ure，ss 读作 *sh*
    `,
  },
});

const location = vocabularyTopic({
  id: "b1-words-directions-2",
  title: t("Location", "方位"),
  summary: t(
    "Opposite, beside and beyond; north, south, east and west; directions and distance; blocks and locations; nearby.",
    "在对面、在旁边和在那边；北、南、东和西；方向和距离；街区和位置；附近的。",
  ),
  intro: t(
    "The museum is two **blocks** from the station: walk **north**, and you'll find it **opposite** the bank, **beside** a small park. These words help you ask the way and say where places are.",
    "博物馆离车站两个 **block**（街区）：往 **north**（北）走，你会在银行 **opposite**（对面）、一个小公园 **beside**（旁边）找到它。这些词帮你问路，说出地方在哪里。",
  ),
  prerequisites: ["a1-words-directions"],
  words: [
    word(
      "opposite",
      "on the other side of a street or a room, facing something",
      "在……对面",
      "The bank is {opposite} the post office: they face each other across the street. | She sat {opposite} me at dinner, so we could look at each other across the table. | The bus stop is {opposite} our school, right across the road.",
      "beside beyond",
    ),
    word(
      "beside",
      "next to; at the side of",
      "在……旁边",
      "Come and sit {beside} me on the sofa; there's room next to me. | There's a small café right {beside} the river, so close you can touch the water. | He stood {beside} his father in the photo, shoulder to shoulder.",
      "opposite beyond",
      "nearby",
    ),
    word(
      "beyond",
      "on the far side of something; further than",
      "在……那边；超出",
      "The village is just {beyond} the hills, so you can't see it from here. | Look past the trees: the sea is far away, {beyond} them. | The town has grown {beyond} its old walls and now spreads far outside them.",
      "beside opposite",
    ),
    word(
      "north",
      "the direction to your left when you face the sunrise; toward the top of a map",
      "北；北方",
      "Harbin is in the {north} of China, at the top of the map, and it's very cold in winter. | In spring, birds fly {north} from warm Africa to cooler Europe. | The North Pole is as far {north} as you can go.",
      "south east",
    ),
    word(
      "south",
      "the direction to your right when you face the sunrise; toward the bottom of a map",
      "南；南方",
      "Hainan is an island in the far {south} of China, where it is warm all year. | Many birds fly {south} to warmer places for the winter. | Australia is {south} of the equator.",
      "north west",
    ),
    word(
      "east",
      "the direction where the sun rises",
      "东；东方",
      "The sun rises in the {east}. | Shanghai is on the {east} coast of China, facing the Pacific Ocean. | Japan is to the {east} of China, across the sea, where the sun rises first.",
      "west north",
    ),
    word(
      "west",
      "the direction where the sun goes down",
      "西；西方",
      "The sun sets in the {west}. | Xinjiang and Tibet are in the {west} of China, on the left of the map. | We drove {west} toward the setting sun.",
      "east north",
    ),
    word(
      "direction directions",
      "the way something is moving or pointing; instructions on how to get somewhere",
      "方向；指路",
      "Which {direction} is the station: left or right? | We walked in the wrong {direction} for half an hour. | Can you give me {directions} to the museum?|distances locations",
      "distance location",
    ),
    word(
      "distance distances",
      "how far it is from one place to another",
      "距离",
      "What's the {distance} from here to the airport in kilometers? | The hotel is a short {distance} from the beach. | We could see the mountains in the {distance}.",
      "direction location",
    ),
    word(
      "block blocks",
      "a group of buildings with streets on all sides; a large building of flats or offices",
      "街区；大楼",
      "The library is two {blocks} from here: cross two streets and it's on the left.|districts locations | Walk around the {block} and you'll see it. | They live in a tall apartment {block}.",
      "district location",
    ),
    word(
      "location locations",
      "the place where something is",
      "位置；地点",
      "The hotel is in a great {location}, near the beach. | The film was shot in several {locations} in Morocco.|directions distances | Can you send me your {location} on your phone, so I can find where you are?",
      "direction distance",
    ),
    word(
      "nearby",
      "not far away",
      "附近的；在附近",
      "Is there a supermarket {nearby}, within walking distance? | We stayed in the {nearby} hotel, so the beach was only two minutes away. | My grandparents live {nearby}, just a five-minute walk away, so we see them often.",
      "opposite beyond",
      "beside",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Opposite*, *beside* and *beyond* all say where something is: *opposite* is facing it from the other side, *beside* is right next to it, and *beyond* is on its far side. Ask whether the two things face each other, touch sides or are far apart.",
        "*opposite*、*beside* 和 *beyond* 都表示位置：*opposite* 是隔着东西相对，*beside* 是紧挨着，*beyond* 是在更远的另一边。想想两样东西是面对面、肩并肩，还是隔得很远。",
      ),
      meaning: t(
        "*Direction* and *distance* both help you find a place, but a *direction* is which way to go, and a *distance* is how far it is. Check whether the meaning says which way or how far.",
        "*direction* 和 *distance* 都能帮你找地方，但 *direction* 是朝哪个方向走，*distance* 是有多远。看清释义说的是方向还是远近。",
      ),
      spell: t(
        "*Beside* has no s at the end (*besides* means as well), and *distance* ends in -ance, not -ence.",
        "*beside* 结尾没有 s（*besides* 是“此外”）；*distance* 结尾是 -ance，不是 -ence。",
      ),
    },
    notes: `
      opposite|two buildings facing each other across a street;looking at each other across a dinner table;a bus stop right across the road|opposite means facing something from the other side; beside means right next to it|opposite 是隔着东西面对面；beside 是紧挨着|beside=beside means right next to something, side by side, not facing it from the other side=beside 是紧挨着、肩并肩，不是隔着东西相对;beyond=beyond means far away on the other side, not facing something across a street or a table=beyond 是在远处的另一边，不是隔着街道或桌子面对面|op · po · site|the double p, and -site at the end|双写 p，结尾是 -site
      beside|room next to someone on a sofa;a café so close you can touch the water;shoulder to shoulder in a photo|beside means right next to; besides, with an s, means as well|beside 是在旁边；带 s 的 besides 是“此外”|opposite=opposite means facing something from the other side, not touching it side by side=opposite 是隔着东西相对，不是紧挨着;beyond=beyond means far away on the other side, not right next to something=beyond 是在远处的另一边，不是紧挨着|be · side|be- + side, with no s at the end|be- 加 side，结尾没有 s
      beyond|a village you can't see behind the hills;the sea far away past the trees;a town spreading far outside its walls|beyond means on the far side; beside means right next to|beyond 是在更远的另一边；beside 是紧挨着|beside=beside means right next to something, not far away on its other side=beside 是紧挨着，不是在远处的另一边;opposite=opposite means facing something across a street or a room, not far past it=opposite 是隔着街道或房间相对，不是远远在它后面|be · yond|y in the middle, and -ond at the end|中间是 y，结尾是 -ond
      north|Harbin at the top of the map;birds flying from Africa to Europe;the North Pole|north is toward the top of a map; south is toward the bottom|north 指地图的上方；south 指下方|south=south is toward the bottom of the map, where it is warmer, the opposite way from the cold top=south 指地图下方、更暖的方向，与寒冷的上方相反;east=east is where the sun rises, to the right of the map, not toward the top=east 是日出的方向，在地图右边，不是上方|north|or said like *or*, and th at the end|or 读作 *or*，结尾是 th
      south|an island warm all year;birds going to warmer places for the winter;Australia below the equator|south is toward the bottom of a map; north is toward the top|south 指地图下方；north 指上方|north=north is toward the top of the map and the cold North Pole, not toward warm places=north 指地图上方和寒冷的北极，不是温暖的方向;west=west is where the sun goes down, to the left of the map, not toward the bottom=west 是日落的方向，在地图左边，不是下方|south|ou said like *ow*, and th at the end|ou 读作 *ow*，结尾是 th
      east|where the sun rises;Shanghai's coast facing the Pacific;Japan across the sea where the sun rises first|east is where the sun rises; west is where it goes down|east 是日出的方向；west 是日落的方向|west=west is where the sun goes down, not where it comes up=west 是太阳落下的方向，不是升起的方向;north=north is toward the top of the map and the North Pole, not where the sun rises=north 指地图上方和北极，不是日出的方向|east|ea said like long e, as in *eat*|ea 读长音 e，和 *eat* 一样
      west|where the sun sets;Xinjiang and Tibet on the left of the map;driving toward the setting sun|west is where the sun goes down; east is where it comes up|west 是日落的方向；east 是日出的方向|east=east is where the sun comes up in the morning, not where it sets=east 是早上太阳升起的方向，不是落下的方向;north=north is toward the top of the map, not where the sun goes down=north 指地图上方，不是日落的方向|west|short e, and st at the end|短元音 e，结尾是 st
      direction|left or right to the station;walking the wrong way for half an hour;the way to the museum|a direction is which way to go; a distance is how far|direction 是朝哪个方向；distance 是多远|distance/distances=distance is how far a place is, not which way to go=distance 是有多远，不是朝哪个方向;location/locations=location is the place where something is, not the way to move toward it=location 是东西所在的地方，不是朝它走的方向|di · rec · tion|direct + -ion|direct 加 -ion
      distance|kilometers from here to the airport;a short way from the beach;mountains far away|a distance is how far; a direction is which way|distance 是多远；direction 是朝哪个方向|direction=direction is which way to go, not how many kilometers away a place is=direction 是方向，不是相隔多少公里;location=location is where a place is, not how far it is from you=location 是地点在哪儿，不是离你多远|dis · tance|-ance at the end, not -ence|结尾是 -ance，不是 -ence
      block|two streets to cross before the library;walking around a group of buildings;a tall building of flats|a block is a group of buildings with streets around it; a district is a whole area of a town|block 是四面有街道的一片楼；district 是城市的一整个区|district/districts=district is a whole large area of a town, not the buildings between two streets=district 是城市的一大片区域，不是两条街之间的一片楼;location/locations=location is any place where something is, not a group of buildings with streets around it=location 是任何东西所在的地方，不是被街道围起来的一片楼|block|ck at the end, as in *clock*|结尾是 ck，和 *clock* 一样
      location|a great place near the beach;places in Morocco where a film was shot;where you are on your phone|a location is where something is; a direction is which way to go|location 是东西所在的位置；direction 是朝哪走|direction/directions=direction is which way to go, not the place where something is=direction 是方向，不是所在的地方;distance/distances=distance is how far apart two places are, not the place itself=distance 是两地之间的距离，不是地点本身|lo · ca · tion|local + -tion, with ca said like *kay*|local 变来，ca 读作 *kay*
      nearby|a supermarket within walking distance;a hotel two minutes from the beach;grandparents a five-minute walk away|nearby means not far away; opposite means facing on the other side|nearby 是在不远处；opposite 是在对面|opposite=opposite means facing something on the other side of a street, not just not far away=opposite 是在街道对面，不只是在不远处;beyond=beyond means on the far side of something, not close by=beyond 是在更远的另一边，不是就在附近|near · by|near + by, written as one word|near 加 by，连写成一个词
    `,
  },
});

const buildings = vocabularyTopic({
  id: "b1-words-buildings",
  title: t("Buildings", "建筑"),
  summary: t(
    "Architecture and structures; tunnels; construction and constructing; concrete, steel and bricks; historic buildings and monuments; elevators and entrances.",
    "建筑学和结构；隧道；建造和施工；混凝土、钢和砖；历史悠久的建筑和纪念碑；电梯和入口。",
  ),
  intro: t(
    "The new museum is a **structure** of **steel** and glass, but its main **entrance** is through a **historic** red **brick** building more than a hundred years old. These words help you talk about how buildings are designed and made.",
    "新博物馆是一座钢和玻璃的 **structure**（建筑物），用的是 **steel**（钢），但它的主 **entrance**（入口）穿过一栋一百多年的 **historic**（有历史意义的）红 **brick**（砖）楼。这些词帮你谈论建筑怎样设计、怎样建造。",
  ),
  prerequisites: ["a2-words-materials"],
  words: [
    word(
      "architecture",
      "the design of buildings, or the style of buildings",
      "建筑学；建筑风格",
      "I love the old {architecture} of this city: its beautiful buildings and their style. | She is studying {architecture} at university because she wants to design buildings. | The {architecture} of the new museum, with its glass walls and curved roof, is a style nobody has seen before.",
      "construction structure",
    ),
    word(
      "structure structures",
      "something that has been built, such as a bridge or a building; the way parts are put together",
      "建筑物；结构",
      "The Eiffel Tower is a {structure} made of iron. | The bridge is the tallest {structure} in the city. | The bridge is a {structure} of steel and concrete.",
      "tunnel brick",
    ),
    word(
      "tunnel tunnels",
      "a passage under the ground or through a mountain",
      "隧道",
      "The train goes through a long {tunnel} under the sea. | They are digging a long {tunnel} through the mountain for the new railway. | The new road {tunnel} under the river cuts the journey by twenty minutes.",
      "bridge elevator",
    ),
    word(
      "construction",
      "building something, such as a house or a road",
      "建造；施工",
      "The new stadium is still under {construction}. | {Construction} of the bridge took five years. | My uncle works in {construction}, building houses and roads.",
      "architecture structure",
    ),
    word(
      "construct constructs constructed constructing",
      "to build something",
      "建造；修建",
      "The bridge was {constructed} in 1937 by two thousand workers using steel and stone.|designed destroyed | They plan to {construct} a new airport, and the building work starts next year. | The company {constructs} houses and schools with its own builders and machines.|designs destroys",
      "design destroy",
    ),
    word(
      "concrete",
      "a hard building material made from cement, sand, stones and water",
      "混凝土",
      "The wall is made of {concrete}, poured in wet and left to go hard. | They poured {concrete} for the floor of the garage. | The city is full of gray {concrete} buildings, made of cement, sand and stones.",
      "steel brick",
    ),
    word(
      "steel",
      "a very strong metal made from iron",
      "钢",
      "The bridge is made of {steel}, a metal so strong it can hold a hundred trucks. | Modern skyscrapers have a frame of {steel} beams, the strongest metal for building. | This knife is made of {steel}, so it doesn't break.",
      "concrete brick",
    ),
    word(
      "brick bricks",
      "a small hard block of baked clay, used to build walls",
      "砖",
      "The old school is built of red {bricks} made from baked clay.|stones concrete | The builder put one more {brick} of baked clay on top of the wall. | They built a {brick} wall around the garden, laying the small clay blocks one by one.",
      "stone concrete",
    ),
    word(
      "historic",
      "important in history",
      "历史上著名的；有历史意义的",
      "The old town has many {historic} buildings, some more than five hundred years old and made of wood and stone. | The day the first man walked on the moon was {historic}: people will read about it in history books for ever. | We visited a {historic} castle by the sea where kings lived eight hundred years ago.",
      "modern concrete",
    ),
    word(
      "monument monuments",
      "a building or a statue built to remember a person or an event",
      "纪念碑；纪念馆",
      "In the main square stands a {monument} to remember the soldiers who died in the war. | The city is full of ancient {monuments}, built to remember kings and battles.|structures tunnels | We took photos in front of the {monument} to the heroes of the war.",
      "structure tunnel",
    ),
    word(
      "elevator elevators",
      "a machine that carries people up and down in a building",
      "电梯",
      "Press the button, wait for the doors to open, and take the {elevator} to the tenth floor. | The {elevator} doors closed, and we went up to the top floor in a small metal box. | Our hotel has four {elevators}, so you never wait long for the doors to open.|escalators exits",
      "escalator exit",
    ),
    word(
      "entrance entrances",
      "a door or a gate where you go into a place",
      "入口",
      "Meet me at the main {entrance} of the park, where everyone goes in. | The {entrance} to the museum is a big glass door, and you go in there. | Please use the side {entrance} to come in; the front door is closed.",
      "exit monument",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Concrete*, *steel* and *brick* are all building materials: *concrete* is poured wet and goes hard, *steel* is a strong metal, and a *brick* is a small block of baked clay. Look for wet and gray, metal, or small red blocks.",
        "*concrete*、*steel* 和 *brick* 都是建筑材料：*concrete* 是湿的时候浇筑、后来变硬的混凝土，*steel* 是坚固的金属，*brick* 是烧制的小黏土块。找找句子里是湿的灰色材料、金属，还是红色小块。",
      ),
      meaning: t(
        "*Architecture* and *construction* are both about buildings, but *architecture* is how buildings are designed and the style they have, and *construction* is the work of building them. Check whether the meaning says design or building work.",
        "*architecture* 和 *construction* 都和建筑有关，但 *architecture* 是建筑的设计和风格，*construction* 是建造的施工。看清释义说的是设计还是施工。",
      ),
      spell: t(
        "*Architecture* starts with arch- said like *ark*, and *steel* has a double e (*steal*, with ea, means to take).",
        "*architecture* 开头的 arch- 读作 *ark*；*steel* 是双写 e（写成 ea 的 *steal* 是“偷”）。",
      ),
    },
    notes: `
      architecture|beautiful old buildings and their style;wanting to design buildings;glass walls and a curved roof in a new style|architecture is how buildings are designed; construction is the work of building them|architecture 是建筑的设计和风格；construction 是建造施工|construction=construction is the work of building, not the design or the style of buildings=construction 是建造施工，不是建筑的设计或风格;structure=structure is one thing that has been built, not the design and style of a city's buildings=structure 是一座建好的建筑物，不是建筑的设计和风格|ar · chi · tec · ture|arch- said like *ark*, and -ture at the end|arch- 读作 *ark*，结尾是 -ture
      structure|the Eiffel Tower made of iron;the tallest built thing in a city;a bridge of steel and concrete|a structure is anything built, such as a tower or a bridge; a tunnel is a passage under the ground|structure 是任何建成物，如塔或桥；tunnel 是地下通道|tunnel=tunnel is a passage under the ground or through a mountain, not a tower or a bridge that stands up high=tunnel 是地下或穿山的通道，不是高高立着的塔或桥;brick=brick is one small block of clay, not a whole tower or bridge=brick 是一块小黏土砖，不是整座塔或桥|struc · ture|str at the start, and -ture said like *cher*|开头 str，结尾 -ture 读作 *cher*
      tunnel|a train under the sea;digging through a mountain for a railway;a road under a river|a tunnel goes under or through something; a bridge goes over it|tunnel 从下面或里面穿过；bridge 从上面跨过|bridge=bridge goes over a river or a road, not under the sea or through a mountain=bridge 是从河或路上面跨过，不是从海底或山里穿过;elevator=elevator carries people up and down inside a building, not along a passage under the ground=elevator 在楼里上下运送人，不是地下通道|tun · nel|the double n, and -el at the end|双写 n，结尾是 -el
      construction|a stadium still being built;five years building a bridge;building houses and roads as a job|construction is building; architecture is the design of buildings|construction 是建造；architecture 是建筑设计|architecture=architecture is the design and style of buildings, not the work of building them=architecture 是建筑的设计和风格，不是建造的施工;structure=structure is a building or a bridge itself, not the work of making it=structure 是建筑物本身，不是建造它的过程|con · struc · tion|construct + -ion|construct 加 -ion
      construct|a bridge built in 1937 by two thousand workers;building work on a new airport;houses and schools built by a company's own builders|to construct is to build; to design is to draw the plan first|construct 是建造；design 是先画出设计|design/designed/designs=design means to draw the plan of something, not to put it up with workers and machines=design 是画出设计图，不是用工人和机器把它建起来;destroy/destroyed/destroys=destroy means to break something so it no longer exists, the opposite of building it=destroy 是把东西毁掉，正好和建造相反|con · struct|con- + struct, with str in the middle|con- 加 struct，中间是 str
      concrete|a wall poured wet and left to go hard;the floor of a garage;gray buildings of cement, sand and stones|concrete is poured wet and goes hard; steel is a metal|concrete 浇筑时是湿的，后来变硬；steel 是金属|steel=steel is a strong metal made from iron, not something poured wet from cement, sand and stones=steel 是铁炼成的坚固金属，不是水泥沙石浇筑的;brick=brick is a block of baked clay, not something poured in wet=brick 是烧制的黏土块，不是湿着浇筑的|con · crete|cr in the middle, and -ete at the end|中间是 cr，结尾是 -ete
      steel|a bridge that can hold a hundred trucks;beams for the frames of skyscrapers;a knife that doesn't break|steel is a strong metal; concrete is made from cement, sand and stones|steel 是坚固的金属；concrete 由水泥、沙和石头制成|concrete=concrete is made from cement, sand and stones, not a metal=concrete 由水泥、沙和石头做成，不是金属;brick=brick is baked clay, not a metal=brick 是烧过的黏土，不是金属|steel|ee, not ea: *steal* means to take|是 ee，不是 ea：*steal* 是偷
      brick|a school of baked red clay;one more block on top of a wall;small clay blocks laid one by one|a brick is a small block of baked clay; stone comes from the ground as it is|brick 是烧制的黏土块；stone 是天然的石头|stone/stones=stone comes from the ground as rock, not baked clay=stone 是天然岩石，不是烧过的黏土;concrete=concrete is poured wet and goes hard, not small blocks of baked clay laid one by one=concrete 是湿着浇筑后变硬的，不是一块块砌的烧黏土|brick|ck at the end, as in *trick*|结尾是 ck，和 *trick* 一样
      historic|buildings of wood and stone five hundred years old;the first man on the moon in history books;a castle where kings lived eight hundred years ago|historic means important in history; modern means new and of today|historic 是有历史意义的；modern 是现代的|modern=modern means new and of today, not old and important in history=modern 是新的、当代的，不是古老而有历史意义的;concrete=concrete describes a gray building material, not something important in history=concrete 指灰色的建筑材料，不是有历史意义|his · tor · ic|history drops its y: histor-**ic**|history 去掉 y：histor-**ic**
      monument|a stone to remember soldiers who died;ancient things built to remember kings and battles;photos in front of something for war heroes|a monument is built to remember a person or an event; a structure is anything built|monument 是为纪念人或事件而建的；structure 是任何建成物|structure/structures=structure is anything built, such as a bridge, not something built to remember people or events=structure 是任何建成物，比如桥，不是为纪念人或事件而建的;tunnel/tunnels=tunnel is a passage under the ground, not something you stand in front of to remember heroes=tunnel 是地下通道，不是用来纪念英雄的|mon · u · ment|u in the middle, and -ment at the end|中间是 u，结尾是 -ment
      elevator|doors opening and a ride to the tenth floor;a small metal box going up to the top;never waiting long for the doors|an elevator is a box that carries you up and down; an escalator is moving stairs|elevator 是上下运送人的厢；escalator 是自动扶梯|escalator/escalators=escalator is a moving staircase with no doors or button, not a closed box=escalator 是没有门和按钮的自动扶梯，不是封闭的厢;exit/exits=exit is the door you go out through, not a machine that carries you up=exit 是出去的门，不是把人运上楼的机器|el · e · va · tor|-or at the end, not -er|结尾是 -or，不是 -er
      entrance|a park gate where everyone goes in;a big glass door into a museum;a side door to come in|an entrance is where you go in; an exit is where you go out|entrance 是进去的地方；exit 是出去的地方|exit=exit is the door where you go out, not where you come in=exit 是出去的门，不是进来的门;monument=monument is built to remember someone, not a door you go in through=monument 是纪念建筑，不是进去的门|en · trance|enter loses its e: entr-**ance**|enter 去掉 e：entr-**ance**
    `,
  },
});

const services = vocabularyTopic({
  id: "b1-words-city-services",
  title: t("City Services", "城市服务"),
  summary: t(
    "Councils and mayors; garbage; halls, stadiums and aquariums; pools, plazas and benches; streetlights and trams; cycling.",
    "市政委员会和市长；垃圾；大厅、体育场和水族馆；游泳池、广场和长椅；路灯和有轨电车；骑自行车。",
  ),
  intro: t(
    "The **mayor** opened the new **aquarium** in the **plaza**, and the city **council** promised more **benches** and **streetlights** along the river. These words help you talk about the places and services a city gives its people.",
    "**mayor**（市长）为 **plaza**（广场）上新建的 **aquarium**（水族馆）剪彩，市 **council**（议会）还承诺沿河增设 **bench**（长椅）和 **streetlight**（路灯）。这些词帮你谈论城市为市民提供的场所和服务。",
  ),
  prerequisites: ["a2-words-neighborhood"],
  words: [
    word(
      "council councils",
      "a group of people chosen to make decisions for a town or a city",
      "市政委员会；议会",
      "The city {council} voted, and its forty members decided to build a new library. | You should write to the {council} members about the broken streetlight. | Local {councils} collect the garbage.|mayors plazas",
      "mayor plaza",
    ),
    word(
      "mayor mayors",
      "the person chosen to lead a town or a city",
      "市长",
      "The {mayor} cut the ribbon with a pair of scissors and opened the new bridge. | She was elected {mayor} of the city. | In her speech, the {mayor} promised to clean the river.",
      "council resident",
    ),
    word(
      "garbage",
      "things you throw away, such as old food and packaging",
      "垃圾",
      "The {garbage} is collected every Tuesday. | Please put the {garbage} in the bin outside. | The streets were full of {garbage} after the festival.",
      "garage bench",
    ),
    word(
      "hall halls",
      "a large room or building for meetings, concerts or events",
      "大厅；礼堂",
      "The concert will be in the town {hall}, a large room with a stage and five hundred seats. | The exams take place in the main {hall}. | We rented a {hall} for the wedding party.|stadiums plazas",
      "stadium plaza",
    ),
    word(
      "stadium stadiums",
      "a large place with seats around a field, for sports or concerts",
      "体育场",
      "The new {stadium} has seats for 80,000 people. | Thousands of fans filled the {stadium} to watch the football match. | The concert is at the {stadium} on Saturday, with seats all around the football field.",
      "hall pool",
    ),
    word(
      "aquarium aquariums",
      "a building where people can look at fish and other animals that live in water",
      "水族馆",
      "We saw sharks at the {aquarium}. | The city {aquarium} has a tunnel under the water where fish swim above you. | My little brother loves going to {aquariums} to watch the fish and turtles.|stadiums pools",
      "stadium pool",
    ),
    word(
      "pool pools",
      "a place filled with water for swimming",
      "游泳池",
      "Let's go to the swimming {pool} after school. | The hotel has an outdoor {pool} where guests can swim. | The city has five public {pools} for swimming.|plazas aquariums",
      "plaza aquarium",
    ),
    word(
      "plaza plazas",
      "an open public square in a city or a town",
      "广场",
      "People meet in the open-air {plaza} in the evening to dance. | The old church stands on one side of the {plaza}. | Many Spanish towns have a main {plaza} with cafés.",
      "hall pool",
    ),
    word(
      "bench benches",
      "a long seat for several people, often in a park",
      "长椅",
      "We sat on a park {bench} and ate our sandwiches. | The city put new {benches} along the river.|streetlights plazas | An old man was sleeping on a {bench}.",
      "streetlight plaza",
    ),
    word(
      "streetlight streetlights",
      "a lamp on a tall post that lights a street",
      "路灯",
      "The {streetlights} come on when it gets dark.|benches trams | A {streetlight} is broken outside our house, so the street is dark at night. | The council replaced the old {streetlights} with new ones that use less energy.|benches trams",
      "bench tram",
    ),
    word(
      "tram trams",
      "a long vehicle that runs on rails in the street and uses electricity",
      "有轨电车",
      "We took a {tram} along the rails in the middle of the street to the city center. | The {tram} stops right outside my house, where its rails end. | Melbourne is famous for its {trams}, green and gold cars running on rails through the streets.|taxis buses",
      "taxi bus",
    ),
    word(
      "cycle cycles cycled cycling",
      "to ride a bike",
      "骑自行车",
      "I {cycle} to school on my bike every day. | We went {cycling} in the mountains on our new bikes.|driving walking | She {cycled} twenty kilometers on her racing bike on Sunday.|drove walked",
      "drive walk",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Hall*, *stadium* and *plaza* are all public places for crowds: a *hall* is a large room indoors, a *stadium* has seats around a sports field, and a *plaza* is an open square. Look for a roof and a stage, a field and fans, or open air.",
        "*hall*、*stadium* 和 *plaza* 都是人群聚集的公共场所：*hall* 是室内的大厅，*stadium* 是围着运动场的看台，*plaza* 是露天广场。找找句子里是屋顶和舞台、球场和球迷，还是露天。",
      ),
      meaning: t(
        "*Council* and *mayor* both run a city, but a *council* is a group of people, and the *mayor* is one person who leads it. Check whether the meaning says a group or one person.",
        "*council* 和 *mayor* 都管理城市，但 *council* 是一群人，*mayor* 是领导城市的一个人。看清释义说的是一群人还是一个人。",
      ),
      spell: t(
        "*Aquarium* starts with aqua-, water, said *a-kwair*, and *garbage* ends in -age, said like *ij*.",
        "*aquarium* 以 aqua-（水）开头，读作 *a-kwair*；*garbage* 结尾是 -age，读作 *ij*。",
      ),
    },
    notes: `
      council|forty members voting for a library;members to write to about a streetlight;local groups that collect the garbage|a council is a group that runs a town; the mayor is the one person who leads it|council 是管理城镇的一群人；mayor 是领导城市的那个人|mayor/mayors=mayor is one person who leads a city, not a group with many members=mayor 是领导城市的一个人，不是有很多成员的团体;plaza/plazas=plaza is an open square in a town, not people who make decisions=plaza 是城里的露天广场，不是做决定的人|coun · cil|ou said like *ow*, and c said like s: coun-**s**il|ou 读作 *ow*，c 读 s
      mayor|cutting a ribbon to open a bridge;being elected to lead a city;a speech promising to clean the river|the mayor is one person who leads a city; the council is the group around him or her|mayor 是领导城市的一个人；council 是他或她周围的那群人|council=council is a group of people, not one person who cuts a ribbon or gives a speech=council 是一群人，不是剪彩或演讲的某一个人;resident=resident is anyone who lives in a city, not the person chosen to lead it=resident 是住在城里的任何人，不是被选出来领导城市的人|may · or|may + or|may 加 or
      garbage|collection every Tuesday;a bin outside;streets after a festival|garbage is things you throw away; a garage, which looks alike, is where you keep a car|garbage 是扔掉的东西；长得像的 garage 是车库|garage=garage is a building where you keep a car, not old food and packaging you throw away=garage 是停车的车库，不是扔掉的剩饭和包装;bench=bench is a long seat in a park, not things you throw away=bench 是公园长椅，不是扔掉的东西|gar · bage|-age at the end, said like *ij*|结尾 -age 读作 *ij*
      hall|a large room with a stage and five hundred seats;exams in the main room;a big room for a wedding party|a hall is a large room indoors; a plaza is an open square outside|hall 是室内大厅；plaza 是露天广场|stadium/stadiums=stadium is a huge place with seats around a sports field, not a large room with a stage=stadium 是围着运动场的大看台，不是有舞台的大厅;plaza/plazas=plaza is an open square outside, not a room with seats for exams or parties=plaza 是露天广场，不是能考试、办宴会的大厅|hall|the double l at the end|结尾双写 l
      stadium|seats for 80,000 people;thousands of fans and a football match;seats all around a football field|a stadium has seats around a sports field; a hall is a large room|stadium 围着运动场有看台；hall 是大厅|hall=hall is a large room indoors, much too small for a football field and thousands of fans=hall 是室内大厅，容不下足球场和成千上万的球迷;pool=pool is water for swimming, not seats around a field=pool 是游泳的水池，不是围着球场的看台|sta · di · um|-ium at the end, as in *aquarium*|结尾是 -ium，和 *aquarium* 一样
      aquarium|sharks;a tunnel under the water with fish above;fish and turtles|an aquarium is where you look at animals living in water; a pool is water for swimming|aquarium 是观看水生动物的地方；pool 是游泳的水池|stadium/stadiums=stadium is a place for sports or concerts, not one for looking at fish and sharks=stadium 是体育或演唱会的场地，不是看鱼和鲨鱼的地方;pool/pools=pool is water for people to swim in, not a building to look at sharks and fish=pool 是给人游泳的水池，不是观赏鲨鱼和鱼的建筑|a · quar · i · um|aqua- said *a-kwair*, and -ium at the end|aqua- 读作 *a-kwair*，结尾是 -ium
      pool|a swim after school;an outdoor place for guests to swim;five public places for swimming|a pool is water for swimming; an aquarium is for looking at fish|pool 是游泳池；aquarium 是看鱼的地方|plaza/plazas=plaza is an open square with no water to swim in=plaza 是露天广场，没有可以游泳的水;aquarium/aquariums=aquarium is a building where you look at fish, not water for people to swim in=aquarium 是看鱼的建筑，不是人游泳的水|pool|oo said long, as in *cool*|oo 读长音，和 *cool* 一样
      plaza|an open-air place to dance in the evening;an old church on one side;Spanish towns with cafés around|a plaza is an open square; a hall is a room indoors|plaza 是露天广场；hall 是室内大厅|hall=hall is a large room with a roof, not an open-air square=hall 是有屋顶的大厅，不是露天广场;pool=pool is water for swimming, not a square where people meet=pool 是游泳的水，不是人们聚会的广场|pla · za|z in the middle, said like *z*|中间是 z
      bench|a park seat for eating sandwiches;new seats along the river;an old man sleeping|a bench is a long seat; a streetlight is a lamp on a post|bench 是长椅；streetlight 是路灯|streetlight/streetlights=streetlight is a lamp on a tall post, not a seat to sit or sleep on=streetlight 是高杆上的路灯，不是能坐、能睡的椅子;plaza/plazas=plaza is a whole square, not a long seat=plaza 是整个广场，不是一条长椅|bench|nch at the end|结尾是 nch
      streetlight|lamps coming on when it gets dark;a dark street at night;new lamps that use less energy|a streetlight lights a street; a bench is a seat|streetlight 照亮街道；bench 是长椅|bench/benches=bench is a long seat, not a lamp that comes on when it gets dark=bench 是长椅，不是天黑就亮的灯;tram/trams=tram is a vehicle on rails, not a lamp on a post=tram 是有轨电车，不是杆子上的灯|street · light|street + light, with a silent gh|street 加 light，gh 不发音
      tram|rails in the middle of the street;a stop where its rails end;Melbourne's green and gold cars on rails|a tram runs on rails in the street; a bus runs on the road with no rails|tram 在街上的轨道上行驶；bus 在路上跑，没有轨道|taxi/taxis=taxi is a car you pay to take you anywhere, not one that runs on rails=taxi 是付钱载你去任何地方的车，不在轨道上跑;bus/buses=bus drives on the road with no rails=bus 在马路上跑，没有轨道|tram|tr at the start and m at the end|开头 tr，结尾 m
      cycle|going to school on a bike;the mountains on new bikes;twenty kilometers on a racing bike|to cycle is to ride a bike; to drive is to go by car|cycle 是骑自行车；drive 是开车|drive/driving/drove=drive means to go in a car, not on a bike=drive 是开车，不是骑自行车;walk/walking/walked=walk means to go on foot, not to ride a bike=walk 是步行，不是骑自行车|cy · cle|cy said like *sigh*, and -cle at the end|cy 读作 *sigh*，结尾是 -cle
    `,
  },
});

// So and such.

/** soSuchPairs are sentences with so before an adjective or adverb alone, and the same idea with such a before a noun. */
const soSuchPairs: readonly (readonly [string, string])[] = [
  ["The city is ___ crowded.", "It is ___ crowded city."],
  ["The film was ___ boring.", "It was ___ boring film."],
  ["Your apartment is ___ big.", "You have ___ big apartment."],
  ["The test was ___ easy.", "It was ___ easy test."],
  ["The view is ___ beautiful.", "It's ___ beautiful view."],
  ["Our teacher is ___ patient.", "She is ___ patient teacher."],
  ["The journey was ___ long.", "It was ___ long journey."],
  ["Your dog is ___ friendly.", "He's ___ friendly dog."],
  ["The tunnel is ___ dark.", "It's ___ dark tunnel."],
  ["The meal was ___ expensive.", "It was ___ expensive meal."],
  ["The street is ___ noisy.", "It's ___ noisy street."],
  ["Her idea was ___ interesting.", "She had ___ interesting idea."],
  ["The skyscraper is ___ tall.", "It's ___ tall skyscraper."],
  ["The game was ___ exciting.", "It was ___ exciting game."],
  ["My cousin is ___ kind.", "He is ___ kind person."],
  ["The day was ___ hot.", "It was ___ hot day."],
  ["The bus ride was ___ uncomfortable.", "It was ___ uncomfortable bus ride."],
  ["This town is ___ quiet.", "It's ___ quiet town."],
];

/** placeNouns and placeAdjectives cross into sentences with so before an adjective and such a before the noun. */
const placeNouns = ["city", "town", "street", "park", "museum", "hotel", "station", "market"] as const;
const placeAdjectives = [
  "crowded",
  "noisy",
  "quiet",
  "beautiful",
  "busy",
  "old",
  "modern",
  "clean",
  "expensive",
  "famous",
  "interesting",
  "ugly",
] as const;

/** soSuchAll are the hand-written pairs and a pair for every place and adjective, in the present and the past. */
const soSuchAll: readonly (readonly [string, string])[] = [
  ...soSuchPairs,
  ...everyPair(placeNouns, placeAdjectives).map(([noun, adjective], k): readonly [string, string] =>
    k % 2 === 0
      ? [`The ${noun} is ___ ${adjective}.`, `It's ___ ${adjective} ${noun}.`]
      : [`The ${noun} was ___ ${adjective}.`, `It was ___ ${adjective} ${noun}.`],
  ),
];

const aBefore = (rest: string) => (/^[aeiou]/u.test(rest) ? "such an" : "such a");
/** firstWordAfterGap is the word that follows the gap. */
const afterGap = (s: string) => s.split("___ ")[1] ?? "";

const soOrSuchA: readonly ChoiceItem[] = interleave([
  soSuchAll.map(([so]): ChoiceItem => [so, "so", [aBefore(afterGap(so)), "such"]]),
  soSuchAll.map(([, such]): ChoiceItem => [such, aBefore(afterGap(such)), ["so", "so a"]]),
]);

/** suchItems are sentences with such before a plural or an uncountable noun, such a before a singular one, or so with many and much. */
const handSuchItems: readonly (readonly [string, string])[] = [
  ["They are ___ nice people.", "such"],
  ["It was ___ good weather that we ate outside.", "such"],
  ["She gives ___ good advice.", "such"],
  ["There were ___ many people that we couldn't move.", "so"],
  ["He has ___ interesting job.", "such an"],
  ["We had ___ fun at the party!", "such"],
  ["I've never seen ___ big crowds.", "such"],
  ["There is ___ much traffic in the morning.", "so"],
  ["It's ___ old building that it needs repairs.", "such an"],
  ["These are ___ beautiful flowers.", "such"],
  ["She made ___ few mistakes that she got full marks.", "so"],
  ["The city has ___ good public transport.", "such"],
  ["I had ___ terrible headache that I went home.", "such a"],
  ["They make ___ delicious bread here.", "such"],
  ["There was ___ little time that we took a taxi.", "so"],
  ["He tells ___ funny stories.", "such"],
  ["It was ___ lovely evening.", "such a"],
  ["You've got ___ many books!", "so"],
  ["They live in ___ small apartment.", "such a"],
  ["Rents are ___ high that young people can't live downtown.", "so"],
  ["Don't eat ___ much sugar.", "so"],
  ["The children have ___ lovely manners.", "such"],
  ["It was ___ ugly building that the city knocked it down.", "such an"],
  ["We've had ___ cold winters recently.", "such"],
  ["This is ___ useful map.", "such a"],
  ["My grandmother has ___ much energy for a woman of eighty.", "so"],
  ["They sell ___ cheap clothes in that market.", "such"],
  ["I didn't know you had ___ many cousins.", "so"],
  ["She has ___ beautiful voice.", "such a"],
  ["The parks here have ___ green grass.", "such"],
  ["It took ___ long time to find a parking space.", "such a"],
  ["The hotel offers ___ good service.", "such"],
];

/** placePlurals and plainAdjectives cross into sentences with such before a plural noun. */
const placePlurals = ["streets", "parks", "buildings", "shops", "buses", "museums", "restaurants", "bridges"] as const;
const plainAdjectives = [
  "beautiful",
  "old",
  "modern",
  "clean",
  "busy",
  "famous",
  "new",
  "lovely",
  "small",
  "crowded",
  "nice",
  "big",
] as const;
/** uncountables are nouns with no plural, for so much. */
const uncountables = ["traffic", "noise", "pollution", "rain", "snow", "litter", "smoke", "dust"] as const;

/** suchItems are the hand-written items and items made from places, adjectives and amounts. */
const suchItems: readonly (readonly [string, string])[] = [
  ...handSuchItems,
  ...everyPair(placePlurals, plainAdjectives).map(([plural, adjective], k): readonly [string, string] =>
    k % 2 === 0 ? [`The city has ___ ${adjective} ${plural}.`, "such"] : [`They have ___ ${adjective} ${plural} here.`, "such"],
  ),
  ...placePlurals.map((plural): readonly [string, string] => [`There are ___ many ${plural} in this town.`, "so"]),
  ...placePlurals.map((plural): readonly [string, string] => [`There were ___ few ${plural} in the old city.`, "so"]),
  ...uncountables.map((noun): readonly [string, string] => [`There is ___ much ${noun} today.`, "so"]),
  ...uncountables.map((noun): readonly [string, string] => [`There was ___ little ${noun} last year.`, "so"]),
];

const suchChoice: readonly ChoiceItem[] = suchItems.map(([shown, right]): ChoiceItem => {
  const all = ["so", "such", right === "such an" || right === "such a" ? right : aBefore(afterGap(shown))];
  const options = [...new Set([right, ...all])].filter((o) => o !== right);
  return [shown, right, options.slice(0, 2)];
});

/** resultItems are two sentences, the word to join them with, and the joined sentence without that. */
const handResultItems: readonly (readonly [string, string, "so" | "such", string, string])[] = [
  ["The coffee was very hot.", "I couldn't drink it.", "so", "The coffee was so hot", "I couldn't drink it"],
  ["It was a very good film.", "We watched it twice.", "such", "It was such a good film", "we watched it twice"],
  ["The traffic was very bad.", "We missed the train.", "so", "The traffic was so bad", "we missed the train"],
  [
    "They are very kind neighbors.",
    "They feed our cat when we're away.",
    "such",
    "They are such kind neighbors",
    "they feed our cat when we're away",
  ],
  ["The bag was very heavy.", "I couldn't lift it.", "so", "The bag was so heavy", "I couldn't lift it"],
  ["It was a very cold night.", "The lake froze.", "such", "It was such a cold night", "the lake froze"],
  ["The music was very loud.", "We couldn't hear each other.", "so", "The music was so loud", "we couldn't hear each other"],
  ["She is a very fast runner.", "Nobody can beat her.", "such", "She is such a fast runner", "nobody can beat her"],
  ["The book was very interesting.", "I read it in one day.", "so", "The book was so interesting", "I read it in one day"],
  ["It was a very long meeting.", "Everyone fell asleep.", "such", "It was such a long meeting", "everyone fell asleep"],
  ["The bus was very crowded.", "I had to stand.", "so", "The bus was so crowded", "I had to stand"],
  ["It's a very small apartment.", "We can't have a party there.", "such", "It's such a small apartment", "we can't have a party there"],
  ["The question was very difficult.", "Nobody answered it.", "so", "The question was so difficult", "nobody answered it"],
  [
    "He is a very good cook.",
    "His friends always ask him to cook.",
    "such",
    "He is such a good cook",
    "his friends always ask him to cook",
  ],
  ["The weather was very nice.", "We had lunch in the park.", "so", "The weather was so nice", "we had lunch in the park"],
  ["It was a very funny joke.", "I couldn't stop laughing.", "such", "It was such a funny joke", "I couldn't stop laughing"],
  ["I was very tired.", "I went to bed at eight.", "so", "I was so tired", "I went to bed at eight"],
  ["They were very expensive shoes.", "I didn't buy them.", "such", "They were such expensive shoes", "I didn't buy them"],
  ["The city is very big.", "You need a map.", "so", "The city is so big", "you need a map"],
  ["It was a very busy day.", "I didn't have time for lunch.", "such", "It was such a busy day", "I didn't have time for lunch"],
  ["The rent is very high.", "We're looking for a new apartment.", "so", "The rent is so high", "we're looking for a new apartment"],
  [
    "It's a very beautiful beach.",
    "Thousands of tourists visit it.",
    "such",
    "It's such a beautiful beach",
    "thousands of tourists visit it",
  ],
  ["The street was very dark.", "I didn't see the step.", "so", "The street was so dark", "I didn't see the step"],
  ["They are very good friends.", "They talk every day.", "such", "They are such good friends", "they talk every day"],
  ["The soup was very salty.", "Nobody ate it.", "so", "The soup was so salty", "nobody ate it"],
  ["It was a very strong wind.", "Some trees fell down.", "such", "It was such a strong wind", "some trees fell down"],
  ["The museum was very popular.", "We waited an hour to get in.", "so", "The museum was so popular", "we waited an hour to get in"],
  ["She has a very loud voice.", "Everyone can hear her.", "such", "She has such a loud voice", "everyone can hear her"],
  ["The water was very cold.", "Nobody went swimming.", "so", "The water was so cold", "nobody went swimming"],
  ["It was a very boring lesson.", "Half the class fell asleep.", "such", "It was such a boring lesson", "half the class fell asleep"],
  ["The road was very icy.", "Many cars slid off it.", "so", "The road was so icy", "many cars slid off it"],
  ["It was a very difficult exam.", "Only a few students passed.", "such", "It was such a difficult exam", "only a few students passed"],
];

/** resultPeople are a person with the pronouns that stand for them: subject, object and possessive. */
const resultPeople: readonly (readonly [string, string, string, string])[] = [
  ["Tom", "he", "him", "his"],
  ["Anna", "she", "her", "her"],
  ["My uncle", "he", "him", "his"],
  ["My grandmother", "she", "her", "her"],
  ["Our teacher", "she", "her", "her"],
  ["Leo", "he", "him", "his"],
  ["Mia", "she", "her", "her"],
];

/** soStates are how a person felt and what they did because of it, with {he}, {him} and {his} for the pronouns. */
const soStates: readonly (readonly [string, string])[] = [
  ["tired", "{he} went to bed at eight"],
  ["hungry", "{he} ate three sandwiches"],
  ["nervous", "{he} couldn't speak"],
  ["happy", "{he} started to sing"],
  ["excited", "{he} couldn't sleep"],
  ["cold", "{he} put on two coats"],
  ["busy", "{he} forgot to eat lunch"],
  ["late", "{he} missed the train"],
  ["angry", "{he} left the room"],
];

/** suchKinds are what kind of person someone is and what follows from it, with {he}, {him} and {his} for the pronouns. */
const suchKinds: readonly (readonly [string, string])[] = [
  ["good singer", "everyone wants to hear {him}"],
  ["fast runner", "nobody can catch {him}"],
  ["kind person", "everyone likes {him}"],
  ["careful driver", "{he} has never had an accident"],
  ["funny storyteller", "everyone laughs at {his} stories"],
  ["hard worker", "{he} always finishes early"],
  ["good cook", "{his} friends always ask {him} to cook"],
];

/** withPronouns puts a person's pronouns into a sentence. */
const withPronouns = (text: string, [, he, him, his]: readonly [string, string, string, string]) =>
  text.replaceAll("{he}", he).replaceAll("{him}", him).replaceAll("{his}", his);
const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** resultItems are the hand-written items and items for every person with every feeling and kind. */
const resultItems: readonly (readonly [string, string, "so" | "such", string, string])[] = [
  ...handResultItems,
  ...everyPair(resultPeople, soStates).map(([person, [adjective, then]]) => {
    const result = withPronouns(then, person);
    return [`${person[0]} was very ${adjective}.`, `${capital(result)}.`, "so", `${person[0]} was so ${adjective}`, result] as const;
  }),
  ...everyPair(resultPeople, suchKinds).map(([person, [kind, then]]) => {
    const result = withPronouns(then, person);
    const a = /^[aeiou]/u.test(kind) ? "an" : "a";
    return [`${person[0]} is ${a} very ${kind}.`, `${capital(result)}.`, "such", `${person[0]} is such ${a} ${kind}`, result] as const;
  }),
];

const resultTyped: readonly TypedItem[] = resultItems.map(
  ([first, second, joiner, main, result]): TypedItem => ({
    shown: `${first} ${second} (${joiner})`,
    accepted: [`${main} (that )${result}.`],
    canonical: `${main} that ${result}.`,
    wrong: [
      `${main.replace(/ (so|such a|such)( |$)/u, " very ")} that ${result}.`,
      `${main.replace(/so |such a |such /u, joiner === "so" ? "such " : "so ")} that ${result}.`,
    ],
  }),
);

/** soRule names the rule that picks so, such or such a for the words after the gap of shown. */
function soRule(right: string, shown: string): Text {
  const next = (afterGap(shown).split(" ")[0] ?? "").replace(/[.,!?]+$/u, "");

  if (right === "so")
    return /^(many|much|few|little)$/u.test(next)
      ? t(`*${next}* takes *so*, not *such*`, `*${next}* 前面用 *so*，不用 *such*`)
      : t(`*${next}* stands alone here, with no noun after it, so it takes *so*`, `这里 *${next}* 单独使用，后面没有名词，所以用 *so*`);
  if (right === "such")
    return t("A plural or uncountable noun follows, so it takes *such* with no *a*", "后面是复数名词或不可数名词，所以用 *such*，不加 *a*");
  return t(
    `A singular noun follows, so it takes *${right}*${right === "such an" ? ", with *an* before the vowel sound" : ""}`,
    `后面是单数名词，所以用 *${right}*${right === "such an" ? "，元音音素前用 *an*" : ""}`,
  );
}

/** soWhy explains so, such or such a in the gap of shown. */
const soWhy = (right: string, shown: string): Text => {
  const rule = soRule(right, shown);
  return t(
    `${rule.en}: ${fill(shown, right)}\n\n**Check.** Look at what follows the gap: adjective alone or *many/much/few/little* → *so*; singular noun phrase → *such a/an*; plural or uncountable noun phrase → *such*.`,
    `${rule["zh-CN"]}：${fill(shown, right)}\n\n**检验。** 看空白后面的结构：单独形容词或 *many/much/few/little* → *so*；单数名词短语 → *such a/an*；复数或不可数名词短语 → *such*。`,
  );
};

/** whyNotSo explains a wrong choice among so, such, such a and such an. */
const whyNotSo = (wrong: string, right: string): Text => {
  if (wrong === "so a")
    return t(
      "*so a* is never grammatical in English before an adjective and a singular noun.",
      "英语里绝不能在形容词和单数名词前用 *so a*。",
    );
  if (/^such an?$/u.test(wrong) && /^such an?$/u.test(right))
    return t(
      "*an* goes before a vowel sound and *a* before a consonant sound—check the first sound of the next word.",
      "*an* 用在元音音素前，*a* 用在辅音音素前——看紧跟在后面的词的开头发音。",
    );
  const use: Record<string, Text> = {
    so: t(
      "*so* goes before an adjective alone (or *many, much, few, little*), not before an adjective + noun phrase.",
      "*so* 用在单独的形容词前（或 *many、much、few、little* 前），不用于“形容词 + 名词”短语前。",
    ),
    such: t(
      "*such* without *a/an* goes before a plural or uncountable noun phrase, not here.",
      "不带 *a/an* 的 *such* 用于复数或不可数名词短语前，不适合这里。",
    ),
    "such a": t(
      "*such a* requires a singular countable noun phrase, which does not match what follows the gap.",
      "*such a* 后面必须接单数可数名词短语，与这里空白后的结构不符。",
    ),
    "such an": t(
      "*such an* requires a singular countable noun phrase starting with a vowel sound, which does not match here.",
      "*such an* 后面必须接以元音音素开头的单数可数名词短语，与这里不符。",
    ),
  };
  return use[wrong] ?? t(`*${wrong}* does not match the words after the gap.`, `*${wrong}* 与空白后面的词不匹配。`);
};

const soAndSuch: TopicDef = {
  id: "so-and-such",
  title: t("So and Such", "so 和 such"),
  summary: t(
    "The city is so crowded. It is such a crowded city. So goes before an adjective alone, such a before an adjective with a singular noun, such before plural and uncountable nouns; so... that and such... that give a result.",
    "The city is so crowded. It is such a crowded city. so 用在单独的形容词前，such a 用在形容词加单数名词前，such 用在复数和不可数名词前；so... that 和 such... that 表示结果。",
  ),
  intro: t(
    "Compare *The subway is so fast* with *It is such a fast subway*. Both intensify the description, but *so* attaches to a standalone adjective while *such (a/an)* attaches to a noun phrase.",
    "比较 *The subway is so fast* 和 *It is such a fast subway*。两者都在加强语气，但 *so* 修饰单独的形容词，*such (a/an)* 修饰带名词的短语。",
  ),
  prerequisites: ["too-and-enough"],
  encompasses: [{ topic: "too-and-enough", weight: 0.2 }],
  xp: 25,
  strand: "grammar",
  knowledgePoints: [
    point(
      "so-or-such-a",
      t("So crowded, such a crowded city", "so crowded 和 such a crowded city"),
      t(
        "*So* and *such* both make a word stronger, like *very*. Which one you use depends on what comes after:\n\n- *so* + an adjective alone: *The city is **so** crowded.*\n- *such a* (or *such an*) + adjective + a singular noun: *It is **such a** crowded city.* *It was **such an** easy test.*\n\n> **Watch out.** Never write *so a crowded city* or *such crowded*—check whether a noun follows the adjective.",
        "*so* 和 *such* 都像 *very* 一样加强语气，用哪个要看后面跟什么：\n\n- *so* + 单独的形容词：*The city is **so** crowded.*\n- *such a*（或 *such an*）+ 形容词 + 单数名词：*It is **such a** crowded city.* *It was **such an** easy test.*\n\n> **注意。** 不能说 *so a crowded city*，也不能说 *such crowded*——先看形容词后面有没有名词。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), soOrSuchA, soWhy, whyNotSo),
    ),
    point(
      "such",
      t("Such, such a and so many", "such、such a 和 so many"),
      t(
        "With **plural** or **uncountable** nouns, use *such* without *a*: *They are **such** nice people.* *We had **such** good weather.* With a **singular** noun, use *such a*: *She has **such a** beautiful voice.*\n\nBefore *many, much, few* and *little*, use *so*: ***so** many people*, ***so** much traffic*.\n\n> **Watch out.** Do not put *a* before plural or uncountable nouns (*such a good weather* is wrong), and always use *so*—not *such*—before *many, much, few, little*.",
        "**复数**名词或**不可数**名词前用 *such*，不加 *a*：*They are **such** nice people.* *We had **such** good weather.* **单数**名词前用 *such a*：*She has **such a** beautiful voice.*\n\n*many、much、few、little* 前面用 *so*：***so** many people*，***so** much traffic*。\n\n> **注意。** 复数或不可数名词前不要加 *a*（*such a good weather* 是错的），且 *many、much、few、little* 前一律用 *so* 而不用 *such*。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), suchChoice, soWhy, whyNotSo),
    ),
    point(
      "that",
      t("So... that and such... that", "so... that 和 such... that"),
      t(
        "Join two sentences to show a result with *so... that* or *such... that*. Replace *very* with the word in brackets: *The coffee was very hot. I couldn't drink it. (so)* → *The coffee was **so** hot **that** I couldn't drink it.* *It was a very good film. We watched it twice. (such)* → *It was **such a** good film **that** we watched it twice.* You may leave out *that*.\n\n> **Watch out.** With *such*, move *a/an* after *such* (*such a good film*, never *a such good film*), and drop *very* completely.",
        "用 *so... that* 或 *such... that* 把两个句子连起来，表示结果。用括号里的词替换 *very*：*The coffee was very hot. I couldn't drink it. (so)* → *The coffee was **so** hot **that** I couldn't drink it.* *It was a very good film. We watched it twice. (such)* → *It was **such a** good film **that** we watched it twice.* *that* 可以省略。\n\n> **注意。** 用 *such* 时把 *a/an* 放在 *such* 后面（*such a good film*，不要写成 *a such good film*），并且把原来的 *very* 彻底删掉。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Join the two sentences with the word in brackets and that.", "用括号里的词和 that 把两个句子连起来。"),
        resultTyped,
        (right, shown) =>
          shown.endsWith("(so)")
            ? t(
                `*so* replaces *very* before the adjective alone, and *that* brings in the result: ${right}\n\n**Check.** Verify that *very* is gone, *so* precedes the adjective, and the result clause follows smoothly.`,
                `用 *so* 替换单独形容词前的 *very*，再用 *that* 引出结果：${right}\n\n**检验。** 确认 *very* 已删去、*so* 在形容词前，且结果分句自然衔接。`,
              )
            : t(
                `*such* replaces *very* before an adjective with a noun, keeping *a* for a singular noun, and *that* brings in the result: ${right}\n\n**Check.** Verify that *very* is gone, *such (a/an)* precedes the noun phrase in the right order, and the result clause follows.`,
                `用 *such* 替换“形容词加名词”前的 *very*，单数名词保留 *a*，再用 *that* 引出结果：${right}\n\n**检验。** 确认 *very* 已删去、*such (a/an)* 语序正确，且结果分句自然衔接。`,
              ),
      ),
    ),
  ],
};

// May, might and could.

/**
 * maybes are a sentence with perhaps, its subject, the verb phrase in the base form, that verb with -s or the wrong
 * form a learner writes, the sentence said as certain, and whether it is negative.
 */
const handMaybes: readonly (readonly [string, string, string, string, string, boolean])[] = [
  ["Perhaps it will rain later.", "It", "rain later", "rains later", "It will rain later.", false],
  ["Perhaps the bus is late.", "The bus", "be late", "is late", "The bus is late.", false],
  ["Perhaps Tom is at home.", "Tom", "be at home", "is at home", "Tom is at home.", false],
  ["Perhaps they will move to Shanghai.", "They", "move to Shanghai", "moving to Shanghai", "They will move to Shanghai.", false],
  ["Perhaps the shop is closed.", "The shop", "be closed", "is closed", "The shop is closed.", false],
  ["Perhaps she knows the answer.", "She", "know the answer", "knows the answer", "She knows the answer.", false],
  ["Perhaps we will need a taxi.", "We", "need a taxi", "needing a taxi", "We will need a taxi.", false],
  ["Perhaps the keys are in the car.", "The keys", "be in the car", "are in the car", "The keys are in the car.", false],
  ["Perhaps he will get the job.", "He", "get the job", "gets the job", "He will get the job.", false],
  ["Perhaps the road is busy.", "The road", "be busy", "is busy", "The road is busy.", false],
  ["Perhaps Anna will call tonight.", "Anna", "call tonight", "calls tonight", "Anna will call tonight.", false],
  ["Perhaps the tickets are sold out.", "The tickets", "be sold out", "are sold out", "The tickets are sold out.", false],
  ["Perhaps it will snow tomorrow.", "It", "snow tomorrow", "snows tomorrow", "It will snow tomorrow.", false],
  ["Perhaps the train is delayed.", "The train", "be delayed", "is delayed", "The train is delayed.", false],
  ["Perhaps I will visit you in June.", "I", "visit you in June", "visiting you in June", "I will visit you in June.", false],
  [
    "Perhaps the museum is free on Sundays.",
    "The museum",
    "be free on Sundays",
    "is free on Sundays",
    "The museum is free on Sundays.",
    false,
  ],
  ["Perhaps they live near the station.", "They", "live near the station", "living near the station", "They live near the station.", false],
  ["Perhaps the café has wifi.", "The café", "have wifi", "has wifi", "The café has wifi.", false],
  ["Perhaps we will be late.", "We", "be late", "are late", "We will be late.", false],
  ["Perhaps the parcel will arrive today.", "The parcel", "arrive today", "arrives today", "The parcel will arrive today.", false],
  ["Perhaps your phone is in your bag.", "Your phone", "be in your bag", "is in your bag", "Your phone is in your bag.", false],
  [
    "Perhaps the new bridge will open next year.",
    "The new bridge",
    "open next year",
    "opens next year",
    "The new bridge will open next year.",
    false,
  ],
  ["Perhaps Max is ill.", "Max", "be ill", "is ill", "Max is ill.", false],
  [
    "Perhaps the city will build a new tram line.",
    "The city",
    "build a new tram line",
    "builds a new tram line",
    "The city will build a new tram line.",
    false,
  ],
  ["Perhaps she won't come.", "She", "come", "comes", "She won't come.", true],
  ["Perhaps the bus doesn't stop here.", "The bus", "stop here", "stops here", "The bus doesn't stop here.", true],
  ["Perhaps they won't agree.", "They", "agree", "agreeing", "They won't agree.", true],
  ["Perhaps he isn't at work today.", "He", "be at work today", "is at work today", "He isn't at work today.", true],
  ["Perhaps it won't rain.", "It", "rain", "rains", "It won't rain.", true],
  ["Perhaps the restaurant isn't open yet.", "The restaurant", "be open yet", "is open yet", "The restaurant isn't open yet.", true],
  ["Perhaps we won't have time.", "We", "have time", "having time", "We won't have time.", true],
  ["Perhaps the lift isn't working.", "The lift", "be working", "is working", "The lift isn't working.", true],
  ["Perhaps Lucy doesn't know.", "Lucy", "know", "knows", "Lucy doesn't know.", true],
  ["Perhaps the plan won't work.", "The plan", "work", "works", "The plan won't work.", true],
  ["Perhaps I won't finish today.", "I", "finish today", "finishing today", "I won't finish today.", true],
  [
    "Perhaps the shops aren't open on Sunday.",
    "The shops",
    "be open on Sunday",
    "are open on Sunday",
    "The shops aren't open on Sunday.",
    true,
  ],
];

/** maybeSubjects are a subject, and its form of be: am, is or are. */
const maybeSubjects: readonly (readonly [string, string])[] = [
  ["Tom", "is"],
  ["My parents", "are"],
  ["We", "are"],
  ["She", "is"],
  ["The teacher", "is"],
  ["They", "are"],
  ["Our team", "is"],
  ["I", "am"],
];

/** maybeActs are a verb phrase in the base form and with -s. */
const maybeActs: readonly (readonly [string, string])[] = [
  ["win the match", "wins the match"],
  ["be late", "is late"],
  ["go to the beach", "goes to the beach"],
  ["buy a new car", "buys a new car"],
  ["come to the party", "comes to the party"],
  ["move to a new city", "moves to a new city"],
  ["take the bus", "takes the bus"],
  ["stay at home", "stays at home"],
  ["visit the museum", "visits the museum"],
  ["need some help", "needs some help"],
  ["forget the tickets", "forgets the tickets"],
  ["change the plan", "changes the plan"],
  ["get lost", "gets lost"],
];

/** maybeNegatives are verb phrases for sentences with won't. */
const maybeNegatives: readonly (readonly [string, string])[] = [
  ["agree", "agrees"],
  ["come", "comes"],
  ["have time", "has time"],
  ["finish today", "finishes today"],
  ["win", "wins"],
  ["be ready", "is ready"],
];

/** wrongFormOf is the form a learner may write after the modal: with -s after a singular subject, or with -ing. */
const wrongFormOf = ([, be]: readonly [string, string], [base, third]: readonly [string, string]) => {
  if (base.startsWith("be ")) return `${be} ${base.slice(3)}`;
  if (be === "is") return third;
  const [verb = "", ...rest] = base.split(" ");
  const ing = verb.endsWith("e") && verb !== "be" && verb !== "see" ? `${verb.slice(0, -1)}ing` : `${verb}ing`;
  return [ing, ...rest].join(" ");
};

/** maybes are the hand-written sentences and one for every subject with every act, said with will or won't. */
const maybes: readonly (readonly [string, string, string, string, string, boolean])[] = [
  ...handMaybes,
  ...everyPair(maybeSubjects, maybeActs).map(([subject, act]) => {
    const [who] = subject;
    const lowerWho = who === "I" ? who : who.charAt(0).toLowerCase() + who.slice(1);
    return [`Perhaps ${lowerWho} will ${act[0]}.`, who, act[0], wrongFormOf(subject, act), `${who} will ${act[0]}.`, false] as const;
  }),
  ...everyPair(maybeSubjects, maybeNegatives).map(([subject, act]) => {
    const [who] = subject;
    const lowerWho = who === "I" ? who : who.charAt(0).toLowerCase() + who.slice(1);
    return [`Perhaps ${lowerWho} won't ${act[0]}.`, who, act[0], wrongFormOf(subject, act), `${who} won't ${act[0]}.`, true] as const;
  }),
];

const positiveModals = ["might", "may", "could"] as const;
const negativeModals = ["might", "may"] as const;
const modalAt = (k: number, negative: boolean) =>
  negative ? negativeModals[k % negativeModals.length]! : positiveModals[k % positiveModals.length]!;

const lower = (s: string) => (s === "I" ? s : s.charAt(0).toLowerCase() + s.slice(1));
const splitVerb = (vp: string) => {
  const [verb = "", ...rest] = vp.split(" ");
  return [verb, rest.join(" ")] as const;
};

const modalForm: readonly ChoiceItem[] = maybes.map(([, subject, vp, wrongForm, , negative], k): ChoiceItem => {
  const m = modalAt(k, negative);
  const [verb, rest] = splitVerb(vp);
  const [wrongVerb] = splitVerb(wrongForm);
  const tail = rest === "" ? "." : ` ${rest}.`;
  const right = negative ? `${m} not ${verb}` : `${m} ${verb}`;
  const wrong = negative ? [`doesn't ${m} ${verb}`, `${m} not to ${verb}`] : [`${m} to ${verb}`, `${m} ${wrongVerb}`];
  return [`${subject} ___${tail} (= ${lower(maybes[k]![0])})`, right, wrong];
});

const modalMeaning: readonly ChoiceItem[] = maybes.map(([perhaps, subject, vp, , certain, negative], k): ChoiceItem => {
  const m = modalAt(k, negative);
  const right = negative ? `${subject} ${m} not ${vp}.` : `${subject} ${m} ${vp}.`;
  const sure = negative ? `${subject} can't ${vp}.` : `${subject} must ${vp}.`;
  const certainly = negative ? `${subject} will certainly not ${vp}.` : `${subject} will certainly ${vp}.`;
  return [perhaps, right, k % 2 === 0 ? [certain, sure, certainly] : [certain, sure]];
});

const modalTyped: readonly TypedItem[] = maybes.map(([perhaps, subject, vp, , certain, negative], k): TypedItem => {
  const m = modalAt(k, negative);
  return {
    shown: perhaps,
    accepted: [negative ? `${subject} [might|may] not ${vp}.` : `${subject} [might|may|could] ${vp}.`],
    canonical: negative ? `${subject} ${m} not ${vp}.` : `${subject} ${m} ${vp}.`,
    wrong: [certain, negative ? `${subject} doesn't ${m} ${vp}.` : `${subject} ${m} to ${vp}.`],
  };
});

/** modalRule names how may, might and could say that something is possible. */
function modalRule(right: string): Text {
  if (/ not /u.test(` ${right} `))
    return t(
      "*Perhaps* with a negative becomes *might not* or *may not* with the base form, never *doesn't*",
      "带否定的 *perhaps* 句改为 *might not* 或 *may not* 加动词原形，不用 *doesn't*",
    );
  return t(
    "*Perhaps* means it is possible, so it becomes *may*, *might* or *could* with the base form, with no *to* and no *-s*",
    "*perhaps* 表示有可能，所以改为 *may*、*might* 或 *could* 加动词原形，不加 *to*，也不加 *-s*",
  );
}

/** modalWhyText puts the rule of may, might and could before a sentence. */
const modalWhyText = (right: string, sentence: string): Text => {
  const rule = modalRule(right);
  const neg = / not /u.test(` ${right} `);
  return t(
    `${rule.en}: ${sentence}\n\n**Check.** Verify the modal pattern: ${neg ? "*might not / may not* + plain verb (no *doesn't* and no *to*)" : "*may / might / could* + plain verb (no *to* and no *-s*)"}, expressing possibility rather than certainty.`,
    `${rule["zh-CN"]}：${sentence}\n\n**检验。** 核对情态动词结构：${neg ? "*might not / may not* + 动词原形（不用 *doesn't*，不加 *to*）" : "*may / might / could* + 动词原形（不加 *to*，不加 *-s*）"}，表达“可能”而非“确定”。`,
  );
};

/** whyNotModalForm explains doesn't with might, to after it, or a verb that is not the base form. */
const whyNotModalForm = (wrong: string, right: string): Text => {
  const modal = right.split(" ")[0] ?? "";
  if (wrong.startsWith("doesn't"))
    return t(
      `*${modal}* makes its negative with *not* after it, never with *doesn't*.`,
      `*${modal}* 的否定是在后面加 *not*，不用 *doesn't*。`,
    );
  if (/ to /u.test(wrong))
    return t(`*${modal}* takes the base form straight after it, with no *to*.`, `*${modal}* 后面直接接动词原形，不加 *to*。`);
  return t(
    `*${wrong.split(" ").pop() ?? ""}* is not the base form—after *${modal}*, the verb must stay in its plain base form.`,
    `*${wrong.split(" ").pop() ?? ""}* 不是动词原形——*${modal}* 后面必须接动词原形。`,
  );
};

/** whyNotModalMeaning explains a sentence that is certain instead of possible. */
const whyNotModalMeaning = (wrong: string): Text =>
  /\b(must|can't|certainly)\b/u.test(wrong)
    ? t(`*${wrong}* says you are sure, but *perhaps* says it is only possible.`, `*${wrong}* 表示你很肯定，但 *perhaps* 只表示有可能。`)
    : t(`*${wrong}* says it as a fact, but *perhaps* says it is only possible.`, `*${wrong}* 把它说成了事实，但 *perhaps* 只表示有可能。`);

const mayMightCould: TopicDef = {
  id: "may-might-and-could",
  title: t("May, Might and Could", "may、might 和 could"),
  summary: t(
    "The bus might be late. It could rain. May, might and could with the base form say that something is possible but not certain; may not and might not say it is possibly not true.",
    "The bus might be late. It could rain. may、might、could 加动词原形表示有可能但不确定；may not 和 might not 表示可能不。",
  ),
  intro: t(
    "When you are not sure—*Perhaps the tram is delayed*—English can say the same thing more naturally with *may*, *might* or *could*: *The tram might be delayed.* All three take the plain base verb directly.",
    "不太确定时（*Perhaps the tram is delayed*），英语常改用 *may*、*might* 或 *could* 表达得更自然：*The tram might be delayed.* 三者后面都直接接动词原形。",
  ),
  prerequisites: ["should-and-must", "b1-words-little-words-4"],
  encompasses: [
    { topic: "should-and-must", weight: 0.2 },
    { topic: "b1-words-little-words-4", weight: 0.1 },
  ],
  xp: 25,
  strand: "grammar",
  knowledgePoints: [
    point(
      "form",
      t("Might be, may not come", "might be 和 may not come"),
      t(
        "*May*, *might* and *could* are followed by the **base form** of the verb, with no *to* and no *-s*:\n\n- *The bus **might be** late.*\n- *She **may know** the answer.*\n- *It **could rain** later.*\n\nFor the negative, put *not* after *may* or *might*: *She **might not come**.* *He **may not be** at work.*\n\n> **Watch out.** Never write *doesn't might* or *might to come*, and do not use *could not* for possibility (*couldn't* means “impossible / was not able to”; use *might not* or *may not* instead).",
        "*may*、*might* 和 *could* 后面接**动词原形**，不加 *to*，也不加 *-s*：\n\n- *The bus **might be** late.*\n- *She **may know** the answer.*\n- *It **could rain** later.*\n\n否定句在 *may* 或 *might* 后面加 *not*：*She **might not come**.* *He **may not be** at work.*\n\n> **注意。** 不能写 *doesn't might* 或 *might to come*，也不要用 *could not* 表示“可能不”（*could not* 表示“不可能/没能”，要用 *might not* 或 *may not*）。",
      ),
      choiceGenerator(
        t("Choose the words for the gap.", "选出填入空白处的词。"),
        modalForm,
        (right, shown) => modalWhyText(right, fill(shown, right)),
        whyNotModalForm,
      ),
    ),
    point(
      "meaning",
      t("Possible, not certain", "可能，不确定"),
      t(
        "Use *may*, *might* or *could* when you think something is **possible**, but you are not sure. They mean the same as *perhaps*:\n\n- *Perhaps the bus is late.* = *The bus **might be** late.*\n- *Perhaps she won't come.* = *She **might not** come.*\n\nCompare: *The bus **is** late* and *It **will** rain* say you are sure; *must* says almost sure; *can't* says impossible.\n\n> **Watch out.** Do not equate *perhaps* with *must*, *can't*, or *will certainly*—those express certainty, whereas *may/might/could* express possibility.",
        "认为某事**有可能**但不确定时，用 *may*、*might* 或 *could*，意思和 *perhaps* 一样：\n\n- *Perhaps the bus is late.* = *The bus **might be** late.*\n- *Perhaps she won't come.* = *She **might not** come.*\n\n比较：*The bus **is** late* 和 *It **will** rain* 表示确定；*must* 表示几乎肯定；*can't* 表示不可能。\n\n> **注意。** 不要把 *perhaps* 换成 *must*、*can't* 或 *will certainly*——它们表达“肯定/不可能”，而 *may/might/could* 表达“有可能”。",
      ),
      choiceGenerator(
        t("Choose the sentence that means the same.", "选出意思相同的句子。"),
        modalMeaning,
        (right, shown) => modalWhyText(right, `${shown} = ${right}`),
        whyNotModalMeaning,
      ),
    ),
    point(
      "write",
      t("Writing with may, might and could", "用 may、might、could 写句子"),
      t(
        "Write the sentence again without *perhaps*, using *might*, *may* or *could*: *Perhaps the bus is late.* → *The bus might be late.* For a negative sentence, use *might not* or *may not*: *Perhaps she won't come.* → *She might not come.*\n\n> **Watch out.** Drop *perhaps* and *will/won't/is/are* cleanly and put the plain base verb right after the modal (*is late* → *might be late*).",
        "去掉 *perhaps*，用 *might*、*may* 或 *could* 改写句子：*Perhaps the bus is late.* → *The bus might be late.* 否定句用 *might not* 或 *may not*：*Perhaps she won't come.* → *She might not come.*\n\n> **注意。** 去掉 *perhaps* 以及原来的 *will/won't/is/are*，在情态动词后面接动词原形（*is late* → *might be late*）。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Write the sentence again with might, may or could instead of perhaps.", "用 might、may 或 could 代替 perhaps 改写句子。"),
        modalTyped,
        (right) => modalWhyText(right, right),
      ),
    ),
  ],
};

/** suchBatch is the word that the topic So and Such teaches. */
const suchBatch: WordBatch = { topic: "so-and-such", words: ["such"] };

/** topics are the topics of the unit Cities and Transport. */
export const topics: readonly TopicDef[] = [
  cityLife.topic,
  gettingAround.topic,
  cityProblems.topic,
  location.topic,
  buildings.topic,
  services.topic,
  soAndSuch,
  mayMightCould,
];

/** vocabulary are the words the unit Cities and Transport teaches. */
export const vocabulary: readonly WordBatch[] = [
  cityLife.batch,
  gettingAround.batch,
  cityProblems.batch,
  location.batch,
  buildings.batch,
  services.batch,
  suchBatch,
];
