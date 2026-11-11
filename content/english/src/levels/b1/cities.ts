// B1, unit 9: Cities and Transport. City life, getting around, city problems, location, buildings and city services;
// so and such; may, might and could. Its how-to paragraph reuses the native writing topic.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { fill } from "../a2/kit.ts";
import { interleave, vocabularyTopic, word } from "../words.ts";

const cityLife = vocabularyTopic({
  id: "b1-words-city-life",
  title: t("City Life", "城市生活"),
  summary: t(
    "Urban and rural; suburbs and downtown; skyscrapers and residents; housing, rent and property; districts, facilities and sidewalks.",
    "城市的和农村的；郊区和市中心；摩天大楼和居民；住房、租金和房产；城区、设施和人行道。",
  ),
  prerequisites: ["a2-words-neighborhood"],
  words: [
    word(
      "urban",
      "of a town or a city",
      "城市的",
      "More than half of the world's people live in {urban} areas.|residents housing | {Urban} life can be stressful.|Resident Property | The government wants to reduce {urban} traffic.|sidewalk district",
      "rural modern",
      "downtown",
    ),
    word(
      "rural",
      "of the countryside",
      "农村的；乡村的",
      "My grandparents live in a {rural} village far from the city.|urban downtown | Life in {rural} areas is quieter than in the city.|urban downtown | Farming is the main work in this {rural} area.|urban downtown",
      "royal urban",
    ),
    word(
      "suburb suburbs",
      "an area where people live outside the center of a city",
      "郊区",
      "We moved from the city center to a quiet {suburb}.|skyscraper sidewalk | Most families with children live in the {suburbs}.|skyscrapers sidewalks | The train takes forty minutes from the {suburbs} to the center.|skyscrapers sidewalks",
      "subway village",
    ),
    word(
      "downtown",
      "in or to the center of a city, where the shops and offices are",
      "市中心；在市中心",
      "Let's take the bus {downtown}.|rural suburb | She works in an office {downtown}.|rural suburb | The {downtown} area is full of restaurants.|rural housing",
      "download countryside",
      "urban",
    ),
    word(
      "skyscraper skyscrapers",
      "a very tall building in a city",
      "摩天大楼",
      "Shanghai has many {skyscrapers}.|sidewalks suburbs | The office is on the fiftieth floor of a {skyscraper}.|sidewalk suburb | New York is famous for its {skyscrapers}.|sidewalks residents",
      "cottage garage",
    ),
    word(
      "resident residents",
      "a person who lives in a particular place",
      "居民",
      "The {residents} of this street are angry about the noise.|properties facilities | Parking is only for {residents}.|properties sidewalks | She has been a {resident} of Paris for ten years.|property facility",
      "president visitor",
    ),
    word(
      "housing",
      "buildings for people to live in",
      "住房",
      "There isn't enough cheap {housing} in the city.|sidewalk rent | The government plans to build more {housing} for young families.|sidewalk district | {Housing} is very expensive in London.|Sidewalk Facility",
      "household hosting",
    ),
    word(
      "rent rents rented renting",
      "to pay money to use a home or a thing that belongs to someone else; the money you pay",
      "租用；租金",
      "We {rent} a small apartment near the university.|reside district | The {rent} is due on the first of every month.|resident suburb | They {rented} bikes and rode around the lake.|resided housed",
      "lend sell",
    ),
    word(
      "property properties",
      "a building or land that someone owns",
      "房产；地产；财产",
      "{Property} prices have doubled in ten years.|Sidewalk Suburb | They own several {properties} in the city.|sidewalks suburbs | This house is private {property}.|sidewalk downtown",
      "proper poverty",
    ),
    word(
      "district districts",
      "an area of a town or a country",
      "城区；地区",
      "We live in a quiet {district} in the north of the city.|resident facility | The business {district} is full of skyscrapers.|resident sidewalk | Beijing is divided into sixteen {districts}.|residents facilities",
      "distance distinct",
    ),
    word(
      "facility facilities",
      "a building or a room for a particular use, such as a sports center or a toilet",
      "设施",
      "The school has excellent sports {facilities}.|residents suburbs | The hotel has good {facilities} for children.|residents districts | There are no washing {facilities} at the campsite.|residents districts",
      "faculty factory",
    ),
    word(
      "sidewalk sidewalks",
      "the path at the side of a street for people to walk on",
      "人行道",
      "Don't ride your bike on the {sidewalk}.|suburb district | The {sidewalks} were covered in snow.|suburbs districts | People sat at tables on the {sidewalk} outside the café.|suburb resident",
      "sideways crosswalk",
    ),
  ],
});

const gettingAround = vocabularyTopic({
  id: "b1-words-getting-around",
  title: t("Getting Around", "出行"),
  summary: t(
    "Commuting; transport, transportation and vehicles; pedestrians and cyclists; lanes and jams; the rush; parking, fares and highways.",
    "通勤；交通、运输和车辆；行人和骑自行车的人；车道和堵车；匆忙；停车、车费和公路。",
  ),
  prerequisites: ["a2-words-transport"],
  words: [
    word(
      "commute commutes commuted commuting",
      "to travel regularly between your home and your work or school",
      "通勤；上下班往返",
      "I {commute} to work by train every day.|park rush | She {commutes} two hours each way.|parks fares | {Commuting} by bike is good for your health.|Parking Fare",
      "compute communicate",
    ),
    word(
      "transport transports",
      "a way of carrying people or goods from one place to another",
      "交通工具；运输",
      "Public {transport} in this city is cheap and fast.|pedestrian fare | The bike is the cheapest form of {transport}.|pedestrian lane | Trucks {transport} food to the supermarkets.|pedestrian park",
      "transfer translate",
      "transportation vehicle",
    ),
    word(
      "transportation",
      "a system or a way of moving people or goods",
      "交通运输",
      "The city needs better {transportation}.|pedestrian highway | Is {transportation} included in the price of the trip?|pedestrian cyclist | Buses are the main {transportation} for students here.|pedestrian cyclist",
      "translation transformation",
      "transport vehicle",
    ),
    word(
      "vehicle vehicles",
      "a machine such as a car, a bus or a truck that carries people or things",
      "车辆；交通工具",
      "No {vehicles} are allowed in the old town.|pedestrians cyclists | Electric {vehicles} are becoming more popular.|pedestrians fares | The police stopped the {vehicle} at the border.|pedestrian fare",
      "vessel engine",
      "transport transportation",
    ),
    word(
      "pedestrian pedestrians",
      "a person who is walking in a street",
      "行人",
      "This street is only for {pedestrians}; cars can't go here.|vehicles highways | The driver didn't see the {pedestrian} crossing the road.|highway lane | {Pedestrians} should use the bridge to cross the highway.|Vehicles Fares",
      "passenger driver",
    ),
    word(
      "cyclist cyclists",
      "a person who rides a bike",
      "骑自行车的人",
      "{Cyclists} should always wear a helmet.|Vehicles Fares | The new lane is only for {cyclists}.|vehicles fares | A {cyclist} was hurt in the accident.|vehicle fare",
      "cycle driver",
    ),
    word(
      "lane lanes",
      "a part of a road for one line of traffic; a narrow road in the country",
      "车道；小路",
      "The city has built new bike {lanes}.|jams fares | The bus was in the wrong {lane}.|jam fare | We walked down a quiet country {lane}.|jam fare",
      "line plane",
    ),
    word(
      "jam jams",
      "a long line of cars that cannot move",
      "堵车",
      "We were stuck in a traffic {jam} for an hour.|lane fare | There are always {jams} on this road in the morning.|fares lanes | The accident caused a huge {jam}.|fare commute",
      "jar crash",
    ),
    word(
      "rush rushes rushed rushing",
      "to move or do something very quickly; a time when many people are hurrying",
      "匆忙；高峰",
      "I had to {rush} to catch the bus.|commute park | Don't travel during the {rush} hour if you can.|fare lane | She {rushed} out of the house without breakfast.|commuted parked",
      "rest brush",
    ),
    word(
      "parking",
      "leaving a car somewhere for a time; a place to do this",
      "停车；停车位",
      "{Parking} is very expensive downtown.|Rushing Lane | There's free {parking} behind the supermarket.|fare highway | You'll get a ticket for {parking} here.|commuting rushing",
      "packing parting",
    ),
    word(
      "fare fares",
      "the money you pay to travel by bus, train, taxi or plane",
      "车费；票价",
      "The bus {fare} is two yuan.|lane jam | Taxi {fares} go up at night.|lanes jams | Students pay half {fare} on the subway.|lane jam",
      "fair fee",
    ),
    word(
      "highway highways",
      "a big, fast road between cities",
      "公路；高速公路",
      "We drove along the {highway} to Hangzhou.|sidewalk pedestrian | The new {highway} will cut the journey by an hour.|pedestrian fare | Accidents on {highways} are often serious.|pedestrians fares",
      "hallway path",
    ),
  ],
});

const cityProblems = vocabularyTopic({
  id: "b1-words-city-problems",
  title: t("City Problems", "城市问题"),
  summary: t(
    "Vandalism and graffiti; homeless people and poverty; shortages and overcrowding; smog and congestion; unemployment; lacking; growth and pressure.",
    "故意破坏和涂鸦；无家可归者和贫困；短缺和过度拥挤；雾霾和拥堵；失业；缺乏；增长和压力。",
  ),
  prerequisites: ["b1-words-city-life"],
  words: [
    word(
      "vandalism",
      "damaging public buildings or things on purpose",
      "故意破坏公物",
      "Someone broke all the windows of the bus stop; it was an act of {vandalism}.|growth pressure | The town has cameras to stop {vandalism} in the park.|growth shortage | {Vandalism} costs the city a lot of money every year.|Growth Pressure",
      "volleyball criminal",
    ),
    word(
      "homeless",
      "having no home",
      "无家可归的",
      "There are many {homeless} people sleeping in the station.|overcrowded congested | She works at a shelter for {homeless} families.|overcrowded urban | After the flood, a thousand people were {homeless}.|overcrowded poverty",
      "helpless hopeless",
    ),
    word(
      "poverty",
      "being very poor",
      "贫困",
      "Millions of children live in {poverty}.|smog graffiti | Education is the best way out of {poverty}.|smog graffiti | The government promised to end {poverty}.|smog graffiti",
      "property honesty",
    ),
    word(
      "shortage shortages",
      "a situation in which there is not enough of something",
      "短缺",
      "There is a {shortage} of doctors in rural areas.|growth graffiti | Water {shortages} are common in summer.|growths graffitis | The city faces a serious housing {shortage}.|graffiti vandalism",
      "shortcut storage",
      "lack",
    ),
    word(
      "overcrowded",
      "with too many people in a place",
      "过度拥挤的",
      "The trains are {overcrowded} at rush hour.|homeless rural | Many families live in small, {overcrowded} apartments.|homeless rural | The beach was so {overcrowded} that we couldn't find a place to sit.|homeless rural",
      "overgrown empty",
    ),
    word(
      "smog",
      "dirty air, made of smoke and fog, over a city",
      "雾霾；烟雾",
      "On some days, the {smog} is so bad that you can't see the mountains.|poverty growth | Cars and factories cause {smog}.|poverty unemployment | People wear masks because of the {smog}.|poverty graffiti",
      "smoke snow",
    ),
    word(
      "graffiti",
      "words or pictures painted on walls in public places",
      "涂鸦",
      "The wall was covered in {graffiti}.|smog poverty | Some people think {graffiti} is art.|smog poverty | Students spent Saturday cleaning {graffiti} off the school walls.|smog poverty",
      "painting graphics",
    ),
    word(
      "unemployment",
      "the number of people who do not have a job; not having a job",
      "失业；失业率",
      "{Unemployment} is high among young people.|Smog Graffiti | When the factory closed, {unemployment} rose quickly.|smog graffiti | The government is trying to reduce {unemployment}.|smog graffiti",
      "employment entertainment",
    ),
    word(
      "congestion",
      "too much traffic on the roads",
      "拥堵；交通堵塞",
      "The new subway line has reduced {congestion} downtown.|poverty graffiti | Traffic {congestion} is the city's biggest problem.|poverty graffiti | Drivers pay a fee to enter the center, which cuts {congestion}.|poverty graffiti",
      "connection suggestion",
    ),
    word(
      "lack lacks lacked lacking",
      "to not have enough of something; not having enough",
      "缺乏；缺少",
      "The city {lacks} good public transport.|pressures grows | Many old people suffer from a {lack} of exercise.|growth smog | What the school {lacked} was money.|pressured grew",
      "lake luck",
      "shortage",
    ),
    word(
      "growth",
      "getting bigger or increasing",
      "增长；发展",
      "The rapid {growth} of the city has caused many problems.|poverty smog | There has been a {growth} in the number of cars.|smog poverty | Children need good food for healthy {growth}.|smog graffiti",
      "grown growl",
    ),
    word(
      "pressure pressures",
      "a feeling of worry because of the things you must do; strong force",
      "压力",
      "Students are under a lot of {pressure} before exams.|growth smog | Rising rents are putting {pressure} on young families.|graffiti smog | Living in a big city has its {pressures}.|graffitis smogs",
      "pleasure president",
    ),
  ],
});

const location = vocabularyTopic({
  id: "b1-words-directions-2",
  title: t("Location", "方位"),
  summary: t(
    "Opposite, beside and beyond; north, south, east and west; directions and distance; blocks and locations; nearby.",
    "在对面、在旁边和在那边；北、南、东和西；方向和距离；街区和位置；附近的。",
  ),
  prerequisites: ["a1-words-directions"],
  words: [
    word(
      "opposite",
      "on the other side of a street or a room, facing something",
      "在……对面",
      "The bank is {opposite} the post office.|north east | She sat {opposite} me at dinner.|beyond north | The bus stop is on the {opposite} side of the road.|beyond nearby",
      "opposed apposite",
    ),
    word(
      "beside",
      "next to; at the side of",
      "在……旁边",
      "Come and sit {beside} me.|beyond south | There's a small café {beside} the river.|north west | He stood {beside} his father in the photo.|beyond north",
      "besides behind",
      "nearby",
    ),
    word(
      "beyond",
      "on the far side of something; further than",
      "在……那边；超出",
      "The village is just {beyond} the hills.|nearby north | You can see the sea {beyond} the trees.|north nearby | The town has grown {beyond} its old walls.|beside nearby",
      "behind below",
    ),
    word(
      "north",
      "the direction to your left when you face the sunrise; toward the top of a map",
      "北；北方",
      "Harbin is in the {north} of China; it's very cold in winter.|south beside | Birds fly {north} in spring after the winter in Africa.|beside nearby | The North Pole is as far {north} as you can go.|south beside",
      "nose northern",
    ),
    word(
      "south",
      "the direction to your right when you face the sunrise; toward the bottom of a map",
      "南；南方",
      "Hainan is an island in the far {south} of China.|north beside | Many birds fly {south} for the winter.|beside nearby | Australia is {south} of the equator.|north beside",
      "mouth southern",
    ),
    word(
      "east",
      "the direction where the sun rises",
      "东；东方",
      "The sun rises in the {east}.|west beside | Shanghai is on the {east} coast of China.|west opposite | The wind is blowing from the {east}.|beyond nearby",
      "easy eastern",
    ),
    word(
      "west",
      "the direction where the sun goes down",
      "西；西方",
      "The sun sets in the {west}.|east beside | Tibet is in the {west} of China.|east opposite | We drove {west} toward the setting sun.|beside nearby",
      "rest western",
    ),
    word(
      "direction directions",
      "the way something is moving or pointing; instructions on how to get somewhere",
      "方向；指路",
      "Which {direction} is the station?|distance block | We walked in the wrong {direction} for half an hour.|distance location | Can you give me {directions} to the museum?|distances blocks",
      "destination decision",
    ),
    word(
      "distance distances",
      "how far it is from one place to another",
      "距离",
      "What's the {distance} from here to the airport?|direction block | The hotel is a short {distance} from the beach.|direction location | We could see the mountains in the {distance}.|direction block",
      "difference instance",
    ),
    word(
      "block blocks",
      "a group of buildings with streets on all sides; a large building of flats or offices",
      "街区；大楼",
      "The library is two {blocks} from here.|directions distances | Walk around the {block} and you'll see it.|direction distance | They live in a tall apartment {block}.|direction distance",
      "black lock",
    ),
    word(
      "location locations",
      "the place where something is",
      "位置；地点",
      "The hotel is in a great {location}, near the beach.|direction distance | The film was shot in several {locations} in Morocco.|directions blocks | Can you send me your {location} on your phone?|distance block",
      "local relation",
    ),
    word(
      "nearby",
      "not far away",
      "附近的；在附近",
      "Is there a supermarket {nearby}?|opposite beside | We stayed in a {nearby} hotel.|beside opposite | My grandparents live {nearby}, so we see them often.|beside opposite",
      "nearly faraway",
      "beside",
    ),
  ],
});

const buildings = vocabularyTopic({
  id: "b1-words-buildings",
  title: t("Buildings", "建筑"),
  summary: t(
    "Architecture and structures; tunnels; construction and constructing; concrete, steel and bricks; historic buildings and monuments; elevators and entrances.",
    "建筑学和结构；隧道；建造和施工；混凝土、钢和砖；历史悠久的建筑和纪念碑；电梯和入口。",
  ),
  prerequisites: ["a2-words-materials"],
  words: [
    word(
      "architecture",
      "the design of buildings, or the style of buildings",
      "建筑学；建筑风格",
      "I love the old {architecture} of this city.|entrance monument | She is studying {architecture} at university.|concrete entrance | The {architecture} of the new museum is very modern.|concrete steel",
      "agriculture literature",
    ),
    word(
      "structure structures",
      "something that has been built, such as a bridge or a building; the way parts are put together",
      "建筑物；结构",
      "The Eiffel Tower is a {structure} made of iron.|entrance elevator | The bridge is the tallest {structure} in the city.|entrance tunnel | The bridge is a {structure} of steel and concrete.|entrance elevator",
      "instruction culture",
    ),
    word(
      "tunnel tunnels",
      "a passage under the ground or through a mountain",
      "隧道",
      "The train goes through a long {tunnel} under the sea.|monument elevator | They are digging a {tunnel} through the mountain.|monument entrance | The new road {tunnel} cuts the journey by twenty minutes.|monument elevator",
      "channel bridge",
    ),
    word(
      "construction",
      "building something, such as a house or a road",
      "建造；施工",
      "The new stadium is still under {construction}.|architecture concrete | {Construction} of the bridge took five years.|Architecture Concrete | My uncle works in {construction}.|brick monument",
      "instruction destruction",
    ),
    word(
      "construct constructs constructed constructing",
      "to build something",
      "建造；修建",
      "The bridge was {constructed} in 1937.|concreted entranced | They plan to {construct} a new airport.|concrete brick | The company {constructs} houses and schools.|concretes bricks",
      "destroy instruct",
    ),
    word(
      "concrete",
      "a hard building material made from cement, sand, stones and water",
      "混凝土",
      "The wall is made of {concrete}.|entrance elevator | They poured {concrete} for the floor of the garage.|entrance monument | The city is full of gray {concrete} buildings.|entrance elevator",
      "concert complete",
    ),
    word(
      "steel",
      "a very strong metal made from iron",
      "钢",
      "The bridge is made of {steel}.|entrance monument | Modern skyscrapers have a {steel} frame.|entrance tunnel | This knife is made of {steel}, so it doesn't break.|tunnel elevator",
      "steal stone",
    ),
    word(
      "brick bricks",
      "a small hard block of baked clay, used to build walls",
      "砖",
      "The old school is built of red {bricks}.|tunnels elevators | He threw a {brick} through the window.|tunnel monument | They built a {brick} wall around the garden.|tunnel elevator",
      "block stick",
    ),
    word(
      "historic",
      "important in history",
      "历史上著名的；有历史意义的",
      "The old town has many {historic} buildings.|concrete steel | It was a {historic} day when the first man walked on the moon.|concrete steel | We visited a {historic} castle by the sea.|concrete steel",
      "hysteric heroic",
    ),
    word(
      "monument monuments",
      "a building or a statue built to remember a person or an event",
      "纪念碑；纪念馆",
      "There is a {monument} to the soldiers in the main square.|elevator entrance | The city is full of ancient {monuments}.|elevators entrances | We took photos in front of the {monument}.|elevator tunnel",
      "moment document",
    ),
    word(
      "elevator elevators",
      "a machine that carries people up and down in a building",
      "电梯",
      "Take the {elevator} to the tenth floor.|entrance monument | The {elevator} is broken, so we'll have to use the stairs.|entrance monument | There are four {elevators} in the hotel.|monuments tunnels",
      "escalator elevation",
    ),
    word(
      "entrance entrances",
      "a door or a gate where you go into a place",
      "入口",
      "Meet me at the main {entrance} of the park.|elevator structure | The {entrance} to the museum is free.|elevator tunnel | Please use the side {entrance}; the front door is closed.|tunnel monument",
      "exit entertainment",
    ),
  ],
});

const services = vocabularyTopic({
  id: "b1-words-city-services",
  title: t("City Services", "城市服务"),
  summary: t(
    "Councils and mayors; garbage; halls, stadiums and aquariums; pools, plazas and benches; streetlights and trams; cycling.",
    "市政委员会和市长；垃圾；大厅、体育场和水族馆；游泳池、广场和长椅；路灯和有轨电车；骑自行车。",
  ),
  prerequisites: ["a2-words-neighborhood"],
  words: [
    word(
      "council councils",
      "a group of people chosen to make decisions for a town or a city",
      "市政委员会；议会",
      "The city {council} has decided to build a new library.|bench tram | You should write to the {council} about the broken streetlight.|bench plaza | Local {councils} collect the garbage.|benches trams",
      "counsel country",
    ),
    word(
      "mayor mayors",
      "the person chosen to lead a town or a city",
      "市长",
      "The {mayor} opened the new bridge.|bench garbage | She was elected {mayor} of the city.|bench garbage | The {mayor} promised to clean the river.|bench stadium",
      "major manager",
    ),
    word(
      "garbage",
      "things you throw away, such as old food and packaging",
      "垃圾",
      "The {garbage} is collected every Tuesday.|council mayor | Please put the {garbage} in the bin outside.|mayor council | The streets were full of {garbage} after the festival.|mayors councils",
      "garage cabbage",
    ),
    word(
      "hall halls",
      "a large room or building for meetings, concerts or events",
      "大厅；礼堂",
      "The concert will be in the town {hall}.|tram bench | The exams take place in the main {hall}.|tram bench | We rented a {hall} for the wedding party.|bench streetlight",
      "hole wall",
    ),
    word(
      "stadium stadiums",
      "a large place with seats around a field, for sports or concerts",
      "体育场",
      "The new {stadium} has seats for 80,000 people.|bench streetlight | Thousands of fans filled the {stadium}.|bench tram | The concert is at the {stadium} on Saturday.|bench garbage",
      "studio station",
    ),
    word(
      "aquarium aquariums",
      "a building where people can look at fish and other animals that live in water",
      "水族馆",
      "We saw sharks at the {aquarium}.|stadium bench | The city {aquarium} has a tunnel under the water where fish swim above you.|stadium bench | My little brother loves going to {aquariums}.|stadiums benches",
      "aquatic zoo",
    ),
    word(
      "pool pools",
      "a place filled with water for swimming",
      "游泳池",
      "Let's go to the swimming {pool} after school.|plaza bench | The hotel has an outdoor {pool}.|plaza bench | The city has five public {pools}.|plazas benches",
      "pole lake",
    ),
    word(
      "plaza plazas",
      "an open public square in a city or a town",
      "广场",
      "People meet in the {plaza} in the evening to dance.|pool tram | The old church stands on one side of the {plaza}.|pool tram | Many Spanish towns have a main {plaza} with cafés.|pool tram",
      "pizza palace",
    ),
    word(
      "bench benches",
      "a long seat for several people, often in a park",
      "长椅",
      "We sat on a park {bench} and ate our sandwiches.|plaza tram | The city put new {benches} along the river.|plazas trams | An old man was sleeping on a {bench}.|plaza tram",
      "branch beach",
    ),
    word(
      "streetlight streetlights",
      "a lamp on a tall post that lights a street",
      "路灯",
      "The {streetlights} come on when it gets dark.|benches plazas | A {streetlight} is broken outside our house.|bench plaza | The council replaced the old {streetlights} with new ones that use less energy.|benches plazas",
      "traffic flashlight",
    ),
    word(
      "tram trams",
      "a long vehicle that runs on rails in the street and uses electricity",
      "有轨电车",
      "We took a {tram} to the city center.|bench plaza | The {tram} stops right outside my house.|bench plaza | Melbourne is famous for its {trams}.|benches plazas",
      "train truck",
    ),
    word(
      "cycle cycles cycled cycling",
      "to ride a bike",
      "骑自行车",
      "I {cycle} to school every day.|tram bench | We went {cycling} in the mountains.|tramming benching | She {cycled} twenty kilometers on Sunday.|trammed benched",
      "circle recycle",
    ),
  ],
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

const aBefore = (rest: string) => (/^[aeiou]/u.test(rest) ? "such an" : "such a");
/** firstWordAfterGap is the word that follows the gap. */
const afterGap = (s: string) => s.split("___ ")[1] ?? "";

const soOrSuchA: readonly ChoiceItem[] = interleave([
  soSuchPairs.map(([so]): ChoiceItem => [so, "so", [aBefore(afterGap(so)), "such"]]),
  soSuchPairs.map(([, such]): ChoiceItem => [such, aBefore(afterGap(such)), ["so", "so a"]]),
]);

/** suchItems are sentences with such before a plural or an uncountable noun, such a before a singular one, or so with many and much. */
const suchItems: readonly (readonly [string, string])[] = [
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

const suchChoice: readonly ChoiceItem[] = suchItems.map(([shown, right]): ChoiceItem => {
  const all = ["so", "such", right === "such an" || right === "such a" ? right : aBefore(afterGap(shown))];
  const options = [...new Set([right, ...all])].filter((o) => o !== right);
  return [shown, right, options.slice(0, 2)];
});

/** resultItems are two sentences, the word to join them with, and the joined sentence without that. */
const resultItems: readonly (readonly [string, string, "so" | "such", string, string])[] = [
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
  return t(`${rule.en}: ${fill(shown, right)}`, `${rule["zh-CN"]}：${fill(shown, right)}`);
};

/** whyNotSo explains a wrong choice among so, such, such a and such an. */
const whyNotSo = (wrong: string, right: string, shown: string): Text => {
  const rule = soRule(right, shown);
  if (wrong === "so a")
    return t(
      "*so a* is never right. Before an adjective and a singular noun, use *such a*.",
      "不能说 *so a*。形容词加单数名词前要用 *such a*。",
    );
  if (/^such an?$/u.test(wrong) && /^such an?$/u.test(right))
    return t(
      "*an* goes before a vowel sound and *a* before a consonant sound, so look at the next word.",
      "*an* 用在元音音素前，*a* 用在辅音音素前，要看后面的词。",
    );
  const use: Record<string, Text> = {
    so: t(
      "*so* goes before an adjective alone, or before *many*, *much*, *few* and *little*",
      "*so* 用在单独的形容词前，或 *many、much、few、little* 前",
    ),
    such: t("*such* goes before a plural or uncountable noun", "*such* 用在复数名词或不可数名词前"),
    "such a": t("*such a* goes before a singular noun", "*such a* 用在单数名词前"),
    "such an": t("*such an* goes before a singular noun that starts with a vowel sound", "*such an* 用在以元音音素开头的单数名词前"),
  };
  const of = use[wrong] ?? t(`*${wrong}*`, `*${wrong}*`);
  return t(`${of.en}. ${rule.en}.`, `${of["zh-CN"]}。${rule["zh-CN"]}。`);
};

const soAndSuch: TopicDef = {
  id: "so-and-such",
  title: t("So and Such", "so 和 such"),
  summary: t(
    "The city is so crowded. It is such a crowded city. So goes before an adjective alone, such a before an adjective with a singular noun, such before plural and uncountable nouns; so... that and such... that give a result.",
    "The city is so crowded. It is such a crowded city. so 用在单独的形容词前，such a 用在形容词加单数名词前，such 用在复数和不可数名词前；so... that 和 such... that 表示结果。",
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
        "*So* and *such* both make a word stronger, like *very*. Which one you use depends on what comes after:\n\n- *so* + an adjective alone: *The city is **so** crowded.*\n- *such a* (or *such an*) + adjective + a singular noun: *It is **such a** crowded city.* *It was **such an** easy test.*\n\nNever say *so a crowded city* or *such crowded*.",
        "*so* 和 *such* 都像 *very* 一样加强语气，用哪个要看后面跟什么：\n\n- *so* + 单独的形容词：*The city is **so** crowded.*\n- *such a*（或 *such an*）+ 形容词 + 单数名词：*It is **such a** crowded city.* *It was **such an** easy test.*\n\n不能说 *so a crowded city*，也不能说 *such crowded*。中文“这么挤”“这么挤的城市”都用“这么”，英语却要分 so 和 such。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), soOrSuchA, soWhy, whyNotSo),
    ),
    point(
      "such",
      t("Such, such a and so many", "such、such a 和 so many"),
      t(
        "With **plural** or **uncountable** nouns, use *such* without *a*: *They are **such** nice people.* *We had **such** good weather.* With a **singular** noun, use *such a*: *She has **such a** beautiful voice.*\n\nBefore *many, much, few* and *little*, use *so*: ***so** many people*, ***so** much traffic*.",
        "**复数**名词或**不可数**名词前用 *such*，不加 *a*：*They are **such** nice people.* *We had **such** good weather.* **单数**名词前用 *such a*：*She has **such a** beautiful voice.*\n\n*many、much、few、little* 前面用 *so*：***so** many people*，***so** much traffic*。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), suchChoice, soWhy, whyNotSo),
    ),
    point(
      "that",
      t("So... that and such... that", "so... that 和 such... that"),
      t(
        "Join two sentences to show a result with *so... that* or *such... that*. Replace *very* with the word in brackets: *The coffee was very hot. I couldn't drink it. (so)* → *The coffee was **so** hot **that** I couldn't drink it.* *It was a very good film. We watched it twice. (such)* → *It was **such a** good film **that** we watched it twice.* You may leave out *that*.",
        "用 *so... that* 或 *such... that* 把两个句子连起来，表示结果。用括号里的词替换 *very*：*The coffee was very hot. I couldn't drink it. (so)* → *The coffee was **so** hot **that** I couldn't drink it.* *It was a very good film. We watched it twice. (such)* → *It was **such a** good film **that** we watched it twice.* *that* 可以省略。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Join the two sentences with the word in brackets and that.", "用括号里的词和 that 把两个句子连起来。"),
        resultTyped,
        (right, shown) =>
          shown.endsWith("(so)")
            ? t(
                `*so* replaces *very* before the adjective alone, and *that* brings in the result: ${right}`,
                `用 *so* 替换单独形容词前的 *very*，再用 *that* 引出结果：${right}`,
              )
            : t(
                `*such* replaces *very* before an adjective with a noun, keeping *a* for a singular noun, and *that* brings in the result: ${right}`,
                `用 *such* 替换“形容词加名词”前的 *very*，单数名词保留 *a*，再用 *that* 引出结果：${right}`,
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
const maybes: readonly (readonly [string, string, string, string, string, boolean])[] = [
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
  return t(`${rule.en}: ${sentence}`, `${rule["zh-CN"]}：${sentence}`);
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
  const base = right.split(" ").pop() ?? "";
  return t(
    `*${wrong.split(" ").pop() ?? ""}* is not the base form. After *${modal}* the verb is *${base}*.`,
    `*${wrong.split(" ").pop() ?? ""}* 不是动词原形。*${modal}* 后面要用 *${base}*。`,
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
        "*May*, *might* and *could* are followed by the **base form** of the verb, with no *to* and no *-s*:\n\n- *The bus **might be** late.*\n- *She **may know** the answer.*\n- *It **could rain** later.*\n\nFor the negative, put *not* after *may* or *might*: *She **might not come**.* *He **may not be** at work.* Do not use *doesn't*: not *She doesn't might come*. (*Could not* means something else, *was not able to*, so use *might not* or *may not* for a possibility.)",
        "*may*、*might* 和 *could* 后面接**动词原形**，不加 *to*，也不加 *-s*：\n\n- *The bus **might be** late.*\n- *She **may know** the answer.*\n- *It **could rain** later.*\n\n否定句在 *may* 或 *might* 后面加 *not*：*She **might not come**.* *He **may not be** at work.* 不能用 *doesn't*：不能说 *She doesn't might come*。（*could not* 意思不同，表示“没能”，所以说可能不时用 *might not* 或 *may not*。）",
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
        "Use *may*, *might* or *could* when you think something is **possible**, but you are not sure. They mean the same as *perhaps*:\n\n- *Perhaps the bus is late.* = *The bus **might be** late.*\n- *Perhaps she won't come.* = *She **might not** come.*\n\nCompare: *The bus **is** late* and *It **will** rain* say you are sure. *The bus **must** be late* says you are almost sure, and *She **can't** come* says it is impossible.",
        "认为某事**有可能**但不确定时，用 *may*、*might* 或 *could*，意思和 *perhaps* 一样：\n\n- *Perhaps the bus is late.* = *The bus **might be** late.*\n- *Perhaps she won't come.* = *She **might not** come.*\n\n比较：*The bus **is** late* 和 *It **will** rain* 表示确定。*The bus **must** be late* 表示几乎肯定，*She **can't** come* 表示不可能。中文“可能”“也许”放在动词前就行，英语用这几个情态动词表达同样的意思。",
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
        "Write the sentence again without *perhaps*, using *might*, *may* or *could*: *Perhaps the bus is late.* → *The bus might be late.* For a negative sentence, use *might not* or *may not*: *Perhaps she won't come.* → *She might not come.*",
        "去掉 *perhaps*，用 *might*、*may* 或 *could* 改写句子：*Perhaps the bus is late.* → *The bus might be late.* 否定句用 *might not* 或 *may not*：*Perhaps she won't come.* → *She might not come.*",
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
