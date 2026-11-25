// A1, unit 10: Weather and Nature. Weather, seasons, nature and wild animals, it for the weather and the time, and
// postcards judged by a model.

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
import { itForWeatherFixNot } from "./mistakes.ts";

const weather = vocabularyTopic({
  id: "a1-words-weather",
  title: t("Weather", "天气"),
  summary: t("Sun, rain, snow, wind and clouds, and the words for days like them.", "太阳、雨、雪、风和云，以及描述这些天气的词。"),
  intro: t(
    "This morning it was **sunny**, but now it's **cloudy** and **windy**, and the **rain** is coming. These words help you say what the **weather** is like.",
    "今天早上还 **sunny**（晴朗），现在却 **cloudy**（多云）又 **windy**（刮风），**rain**（雨）要来了。这些词帮你说 **weather**（天气）怎么样。",
  ),
  prerequisites: ["a1-words-times-of-day"],
  words: [
    word(
      "weather",
      "how hot, cold, wet or windy it is outside",
      "天气",
      "What's the {weather} like today? — It's sunny. | The {weather} is bad: rain, wind and snow. Let's stay at home. | I like hot {weather}, with lots of sun.",
      "wind cloud",
    ),
    word(
      "sun suns",
      "the big star in the sky that gives us light and heat",
      "太阳",
      "The {sun} is hot and bright today. | The {sun} comes up in the morning. | Don't look at the {sun}! It's bad for your eyes.",
      "cloud wind",
    ),
    word(
      "sunny sunnier sunniest",
      "with a lot of sun",
      "晴朗的",
      "It's {sunny} today. Let's go to the beach! | Take your hat. It's very {sunny}. | Spain is a {sunny} country, with blue skies most days.",
      "rainy cloudy",
    ),
    word(
      "rain rains rained raining",
      "water that falls from clouds; to fall like this",
      "雨；下雨",
      "Summer {rain} is warm water from the clouds. | The {rain} is very heavy today. Look at all the water in the street! | There was a lot of {rain} yesterday, and the river is full of water.",
      "snow wind",
    ),
    word(
      "rainy rainier rainiest",
      "with a lot of rain",
      "多雨的",
      "It's a {rainy} day, so we need an umbrella to go out. | London is often {rainy}, so people carry umbrellas. | I don't like {rainy} weather. The rain makes my shoes wet.",
      "sunny snowy",
    ),
    word(
      "snow snows snowed snowing",
      "soft white pieces of frozen water that fall from the sky; to fall like this",
      "雪；下雪",
      "There is a lot of {snow}! Let's make a snowman! | In winter there is white {snow} on the mountains. | {Snow} is white and cold, and it covers the ground in winter.",
      "rain wind",
    ),
    word(
      "snowy snowier snowiest",
      "with a lot of snow",
      "多雪的",
      "It's {snowy} today. Everything is white! | We had a {snowy} winter, and we made a snowman every week. | Wear warm boots on {snowy} days, when the ground is white.",
      "rainy sunny",
    ),
    word(
      "wind winds",
      "air that moves fast",
      "风",
      "The {wind} is very strong today. Hold your hat! | The {wind} blows the leaves off the trees. | There is no {wind}, so our kite won't fly.",
      "sun cloud",
    ),
    word(
      "windy windier windiest",
      "with a lot of wind",
      "有风的",
      "Our kite flies high because it's {windy}. | It's too {windy} to use an umbrella. | The beach is {windy} today, and the sand is flying.",
      "sunny snowy",
    ),
    word(
      "cloud clouds",
      "a white or gray shape in the sky, made of water",
      "云",
      "Look at that big {cloud}! It looks like a rabbit. | Gray {clouds} often bring rain.|suns winds | There isn't a {cloud} in the sky today.",
      "sun wind",
    ),
    word(
      "cloudy cloudier cloudiest",
      "with a lot of clouds",
      "多云的",
      "It's {cloudy} today. There are clouds all over the sky. | The sky is {cloudy} and gray. | On {cloudy} days, we can't see the sun.",
      "sunny windy",
    ),
    word(
      "cold colder coldest",
      "not warm; with a low temperature",
      "冷的",
      "It's {cold} today. Wear your coat. | Ice is very {cold}. | I have a {cold}. I can't stop sneezing.",
      "hot sunny",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "Each clue points to one kind of weather: an umbrella or wet shoes to *rain*, a snowman or white ground to *snow*, a kite or a flying hat to *wind*, and a gray sky with no sun to *clouds*.",
        "每条线索指向一种天气：雨伞、湿鞋是 *rain*；雪人、白茫茫的地面是 *snow*；风筝、被吹走的帽子是 *wind*；灰色的天、看不见太阳是 *clouds*。",
      ),
      meaning: t(
        "Add -y to describe the day: *sun* to *sunny*, *rain* to *rainy*, *wind* to *windy*. *It's sunny* describes the day, but *the sun* is the star itself.",
        "加 -y 来描述天气：*sun* 变 *sunny*，*rain* 变 *rainy*，*wind* 变 *windy*。*It's sunny* 描述天气，*the sun* 是太阳本身。",
      ),
      spell: t(
        "*Sunny* doubles the n of *sun*, but *rainy*, *snowy*, *windy* and *cloudy* just add -y. *Weather* has ea, so not *wether*.",
        "*sunny* 要双写 *sun* 的 n，*rainy*、*snowy*、*windy*、*cloudy* 直接加 -y。*weather* 里是 ea，不是 *wether*。",
      ),
    },
    notes: `
      weather|what it's like today;rain, wind and snow;hot with lots of sun|weather is how it is outside; wind is moving air|weather 是外面的天气；wind 是流动的空气|wind=wind is only moving air, so it is not sunny, it is not rain and snow, and *hot wind with lots of sun* is not what you like=wind 只是流动的空气，不会是晴天，也不包括雨和雪;cloud=cloud is one shape in the sky, not how sunny, bad or hot it is outside=cloud 是天上的一团云，不说外面晴不晴、好不好或热不热|weath · er|ea in the middle, so not *wether*|中间是 ea，不是 *wether*
      sun|hot and bright;up in the morning;bad for your eyes|the sun is the star that gives light and heat; a cloud is water in the sky|sun 是发光发热的恒星；cloud 是天上的水汽|cloud=cloud is not bright or hot, it does not come up in the morning and looking at it does not hurt your eyes=cloud 不亮也不热，早上不会升起，看它也不伤眼;wind=wind is moving air, so you cannot see it come up or look at it=wind 是流动的空气，看不见它升起，也没法看着它|sun|u said like the u in *up*|u 读作 *up* 里的 u
      sunny|going to the beach;a hat for the sun;blue skies|sunny means with a lot of sun; cloudy means with a lot of clouds|sunny 是晴朗；cloudy 是多云|rainy=rainy means with a lot of rain, not a beach day, a sun hat or blue skies=rainy 是下雨多，不是去海滩的日子，不戴遮阳帽，也没有蓝天;cloudy=cloudy means the sun is behind clouds, so you do not need a sun hat and the skies are not blue=cloudy 是太阳被云遮住，不用遮阳帽，天也不蓝|sun · ny|a double n|双写 n
      rain|warm summer water from clouds;water in the street;a full river|rain is water from the clouds; snow is white and frozen|rain 是从云里落下的水；snow 是白色的冰|snow=snow is white, cold and frozen, not warm summer water, and it does not run in the street or fill a river with water at once=snow 是白色冰冷的，不是夏天暖暖的水，不会马上在街上流成水或灌满河;wind=wind is moving air, not water in the street or in a river=wind 是流动的空气，不是街上或河里的水|rain|ai said like the a in *name*|ai 读作 *name* 里的 a
      rainy|an umbrella to go out;people with umbrellas;rain and wet shoes|rainy means with a lot of rain; snowy means with a lot of snow|rainy 是多雨；snowy 是多雪|sunny=sunny means with a lot of sun, but umbrellas and wet shoes are for rain=sunny 是阳光多，可雨伞和湿鞋都是因为下雨;snowy=snowy means with a lot of snow, but the sentences talk about rain and umbrellas=snowy 是雪多，可句子说的是雨和雨伞|rain · y|*rain* + *-y*|*rain* 加 *-y*
      snow|making a snowman;white on mountains;white and cold on the ground|snow is white and frozen; rain is water|snow 是白色的冰；rain 是水|rain=rain is water, so it is not white, you cannot make a snowman with it and it does not cover the ground=rain 是水，不是白色的，不能堆雪人，也不会盖住地面;wind=wind is moving air, so it is not white and you cannot make anything with it=wind 是流动的空气，不是白色的，也不能用来堆东西|snow|ow said like *go*|ow 读作 *go*
      snowy|everything white;a snowman every week;white ground|snowy means with a lot of snow; rainy means with a lot of rain|snowy 是多雪；rainy 是多雨|rainy=rainy means with a lot of rain, but white ground and snowmen come from snow=rainy 是雨多，可白茫茫的地面和雪人都来自雪;sunny=sunny means with a lot of sun, but white ground, snowmen and warm boots mean snow=sunny 是阳光多，可白色的地面、雪人和保暖靴都说明有雪|snow · y|*snow* + *-y*|*snow* 加 *-y*
      wind|holding your hat;blowing leaves;flying a kite|wind is moving air; the sun gives light and heat|wind 是流动的空气；sun 发光发热|sun=sun gives light and heat, but it does not blow hats or leaves or lift a kite=sun 发光发热，但不会吹走帽子和树叶，也不会让风筝飞起来;cloud=cloud is water in the sky, and it does not blow hats or leaves or lift a kite=cloud 是天上的水汽，不会吹走帽子和树叶，也不会让风筝飞起来|wind|i said like the i in *sit*|i 读作 *sit* 里的 i
      windy|a high kite;no umbrella;sand flying|windy means with a lot of wind; sunny means with a lot of sun|windy 是风大；sunny 是阳光多|sunny=sunny means with a lot of sun, but kites, umbrellas and flying sand need moving air=sunny 是阳光多，可风筝、伞和飞沙都要靠风;snowy=snowy means with a lot of snow, not air that lifts kites or blows sand=snowy 是雪多，不是能托起风筝或吹起沙子的风|wind · y|*wind* + *-y*|*wind* 加 *-y*
      cloud|looking like a rabbit;gray and bringing rain;none in the sky|a cloud is a shape in the sky; the sun is a star|cloud 是天上的云；sun 是恒星|sun/suns=sun is a round star, not a shape like a rabbit, and it is not gray and does not bring rain=sun 是圆圆的恒星，不像兔子，不是灰色的，也不带来雨;wind/winds=wind cannot be seen, so it does not look like a rabbit or be gray in the sky=wind 看不见，不会像兔子，也不是天上灰色的一团|cloud|ou said like *out*|ou 读作 *out*
      cloudy|clouds all over the sky;a gray sky;no sun to see|cloudy means with a lot of clouds; sunny means with a lot of sun|cloudy 是多云；sunny 是晴朗|sunny=sunny means you can see the sun, but here clouds cover the sky and hide it=sunny 是能看到太阳，可这里云盖满了天，挡住了太阳;windy=windy means with a lot of wind, not a sky full of gray clouds that hide the sun=windy 是风大，不是满天遮住太阳的灰云|cloud · y|*cloud* + *-y*|*cloud* 加 *-y*
      cold|a coat;ice;sneezing|cold means not warm, and *a cold* is an illness; hot means very warm|cold 是冷，*a cold* 是感冒；hot 是热|hot=hot means very warm, but you wear a coat, ice is not hot and *I have a hot* is not English=hot 是热，可要穿外套，冰不热，也没有 *I have a hot* 的说法;sunny=sunny means with a lot of sun, but ice is not sunny and *I have a sunny* is not English=sunny 是阳光多，可冰不说晴朗，也没有 *I have a sunny* 的说法|cold|ld at the end|结尾是 ld
    `,
  },
});

const seasons = vocabularyTopic({
  id: "a1-words-seasons",
  title: t("Seasons", "季节"),
  summary: t("Spring, summer, fall and winter, hot, warm, cool, the sky and umbrellas.", "春夏秋冬，热、暖、凉爽，天空和雨伞。"),
  intro: t(
    "In **spring** it's **warm** and flowers come out, in **summer** it's **hot**, and in **winter** we play in the snow. These words help you talk about the four seasons.",
    "**spring**（春天）很 **warm**（暖和），花开了；**summer**（夏天）很 **hot**（热）；**winter**（冬天）我们在雪里玩。这些词帮你谈论四季。",
  ),
  prerequisites: ["a1-words-weather"],
  words: [
    word(
      "hot hotter hottest",
      "very warm",
      "热的",
      "It's very {hot} in summer. Let's go swimming! | Be careful! The soup is {hot}. | July is the {hottest} month here, so we go swimming every day.|coolest coldest",
      "cool cold",
    ),
    word(
      "warm warmer warmest",
      "a little hot, in a nice way",
      "温暖的",
      "It's {warm} in spring: a little hot, but not too hot. | This coat is very {warm}. | Drink some {warm} milk before bed. Heat it first.",
      "cool cold",
    ),
    word(
      "cool cooler coolest",
      "a little cold, in a nice way",
      "凉爽的",
      "In fall, the evenings are {cool}. Bring a jacket. | It's hot outside, but it's {cool} under the trees. | Wait for the hot soup to get {cooler} before you eat it.|hotter warmer",
      "hot warm",
    ),
    word(
      "season seasons",
      "one of the four parts of the year: spring, summer, fall and winter",
      "季节",
      "There are four {seasons} in a year.|skies umbrellas | My favorite {season} is summer. | Winter is the coldest {season}.",
      "sky umbrella",
    ),
    word(
      "spring springs",
      "the season after winter, when plants start to grow",
      "春天",
      "In {spring}, the flowers come out. | {Spring} comes after winter. | Birds build nests in {spring}.",
      "winter fall",
    ),
    word(
      "summer summers",
      "the hottest season of the year",
      "夏天",
      "In {summer}, we swim in the sea. | {Summer} is the hottest season. | We have a long {summer} holiday, and we swim every day.",
      "winter fall",
    ),
    word(
      "fall falls fell fallen falling",
      "the season after summer, when leaves come down; to come down",
      "秋天；落下",
      "In {fall}, the leaves turn red and yellow. | Be careful! Don't {fall}!|stay rain | The apple {fell} from the tree.|stayed rained",
      "summer spring",
    ),
    word(
      "winter winters",
      "the coldest season of the year",
      "冬天",
      "It snows in {winter}. | {Winter} is cold here. | Bears sleep in {winter}.",
      "summer spring",
    ),
    word(
      "sky skies",
      "the space above the earth, blue on a sunny day",
      "天空",
      "The {sky} is blue today. | Birds fly in the {sky}. | At night, the {sky} is dark.",
      "season umbrella",
    ),
    word(
      "umbrella umbrellas",
      "a thing you hold over your head when it rains",
      "雨伞",
      "It's raining. Take an {umbrella}. | My {umbrella} is red with white spots. | Open your {umbrella}. You're getting wet!",
      "sky season",
    ),
    word(
      "outside",
      "not in a building",
      "在外面",
      "It's sunny. Let's play {outside} in the sun! | It's cold {outside}. Wear your coat. | The dog is {outside} in the garden.",
      "inside away",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "Each season has its own clue: flowers and nests in *spring*, swimming in *summer*, red and yellow leaves in *fall*, and snow and sleeping bears in *winter*.",
        "每个季节都有线索：花和鸟巢是 *spring*，游泳是 *summer*，红叶黄叶是 *fall*，下雪和熊冬眠是 *winter*。",
      ),
      meaning: t(
        "From hot to cold: *hot*, *warm*, *cool*, *cold*. *Warm* is a little hot in a nice way, and *cool* is a little cold in a nice way. *Fall* is also a verb: to come down.",
        "从热到冷：*hot*、*warm*、*cool*、*cold*。*warm* 是舒服的暖，*cool* 是舒服的凉。*fall* 还是动词，意思是落下。",
      ),
      spell: t(
        "*Hot* doubles the t in *hotter* and *hottest*; *fall* has the past *fell*; *umbrella* has a double l, and *sky* becomes *skies*.",
        "*hot* 的比较级和最高级 *hotter*、*hottest* 双写 t；*fall* 的过去式是 *fell*；*umbrella* 双写 l，*sky* 的复数是 *skies*。",
      ),
    },
    notes: `
      hot|summer swimming;soup to be careful with;the month for swimming every day|hot means very warm; cool means a little cold|hot 是热；cool 是凉|cool/coolest=cool means a little cold, but swimming weather and soup you must be careful with are very warm=cool 是有点凉，可游泳的天气和要小心的汤都很热;cold/coldest=cold means not warm, but you do not swim every day in the coldest month or need care with cold soup=cold 是冷，最冷的月份不会天天游泳，冷汤也不用小心烫|hot|tt in *hotter* and *hottest*|*hotter*、*hottest* 双写 t
      warm|a little hot in spring;a coat;milk you heat|warm means a little hot in a nice way; cool means a little cold|warm 是舒服的暖；cool 是舒服的凉|cool=cool means a little cold, but *a little hot*, a good coat and heated milk are warm=cool 是有点凉，可 *a little hot*、好外套和热过的牛奶都是暖的;cold=cold means not warm, but here it is a little hot, a coat keeps you warm and the milk is heated=cold 是冷，可这里是有点热，外套让人暖和，牛奶也热过了|warm|ar said like *or*|ar 读作 *or*
      cool|fall evenings with a jacket;under the trees on a hot day;soup before you eat it|cool means a little cold in a nice way; warm means a little hot|cool 是凉爽；warm 是暖和|hot/hotter=hot means very warm, but you need a jacket, the shade is the opposite of hot outside and hot soup must get less hot=hot 是热，可要带外套，树荫和外面的热相反，热汤要变得没那么烫;warm/warmer=warm means a little hot, but you bring a jacket, *but* shows it is different from hot and the soup must not get warmer=warm 是暖，可要带外套，*but* 说明和热不同，汤也不该变得更热|cool|a double o|双写 o
      season|four in a year;summer as my favorite;winter as the coldest|a season is one of the four parts of the year; the sky is above us|season 是四季之一；sky 是头顶的天空|sky/skies=sky is the space above us, so a year does not have four skies and summer or winter is not a sky=sky 是头顶的空间，一年没有四个天空，夏天冬天也不是天空;umbrella/umbrellas=umbrella is a thing you hold, so a year does not have four umbrellas and summer is not one=umbrella 是手拿的东西，一年没有四把伞，夏天也不是伞|sea · son|ea said like *see*, and -son at the end|ea 读作 *see*，结尾是 -son
      spring|flowers coming out;after winter;nests|spring comes after winter, when plants grow; winter is the cold season|spring 在冬天之后，万物生长；winter 是寒冷的季节|winter=winter is the cold season before spring, not when flowers come out or birds build nests, and it does not come after winter=winter 是春天之前的寒冷季节，不开花、鸟不筑巢，也不在冬天之后;fall=fall is when leaves come down, not when flowers come out, and it comes after summer, not winter=fall 是落叶的季节，不开花，在夏天之后，不在冬天之后|spring|spr at the start, and ng at the end|开头是 spr，结尾是 ng
      summer|swimming in the sea;the hottest season;a long holiday with swimming|summer is the hottest season; winter is the coldest|summer 最热；winter 最冷|winter=winter is the coldest season, not for swimming in the sea every day=winter 是最冷的季节，不会天天下海游泳;fall=fall is cooler, with leaves coming down, not the hottest season for swimming=fall 比较凉，树叶飘落，不是最热的游泳季节|sum · mer|a double m|双写 m
      fall|red and yellow leaves;not coming down;an apple coming down|fall is the season after summer and also means to come down; summer is the hot season|fall 是秋天，也指落下；summer 是夏天|summer=summer is the hot season, not when leaves turn red, and *Don't summer* is not English=summer 是热的季节，不是叶子变红的时候，也没有 *Don't summer* 的说法;spring=spring is when plants start to grow, not when leaves turn red and yellow=spring 是植物开始生长的时候，不是叶子变红变黄的时候;stay/stayed=stay means to not go away, but *Be careful!* warns about coming down, and an apple does not *stay from* a tree=stay 是留下，可 *Be careful!* 是提醒别摔，苹果也不会 *stay from* 树;rain/rained=rain is water from clouds, so a person or an apple does not rain=rain 是云里落下的水，人和苹果不会“下雨”|fall|a double l, and the past *fell*|双写 l，过去式是 *fell*
      winter|snow;cold;sleeping bears|winter is the coldest season; summer is the hottest|winter 最冷；summer 最热|summer=summer is the hottest season, so it does not snow, it is not cold and bears do not sleep through it=summer 是最热的季节，不下雪，不冷，熊也不在夏天冬眠;spring=spring is when plants grow and it gets warm, not the time of snow and sleeping bears=spring 是天气变暖、植物生长的时候，不是下雪、熊冬眠的时候|win · ter|-ter at the end|结尾是 -ter
      sky|blue today;where birds fly;dark at night|the sky is the space above us; a season is part of the year|sky 是头顶的天空；season 是一年中的一部分|season=season is a part of the year, so it is not blue or dark and birds do not fly in it=season 是一年中的一段时间，不是蓝的或黑的，鸟也不在里面飞;umbrella=umbrella is a thing you hold, and birds do not fly in it=umbrella 是手拿的东西，鸟不在伞里飞|sky|y said like *eye*, and y changing to -ies|y 读作 *eye*，复数 y 变 -ies
      umbrella|taking one in the rain;red with white spots;opening one when wet|an umbrella keeps rain off you; the sky is above you|umbrella 帮你挡雨；sky 在头顶|sky=sky is above everyone, so you cannot take one, own a red one or open it=sky 在所有人头顶，不能带着、不能是你的红天空，也不能打开;season=season is a part of the year, so you cannot take one, own a red one or open it=season 是一年中的一段时间，不能带着、不能是红色的，也不能打开|um · brel · la|a double l|双写 l
      outside|playing in the sun;cold air with a coat;the garden|outside means not in a building; inside means in a building|outside 是在外面；inside 是在里面|inside=inside means in a building, but the sun, coat weather and the garden are out of doors=inside 是在屋里，可阳光、要穿外套的天气和花园都在户外;away=away means to another place, and *play away in the sun*, *cold away* and *away in the garden* are not English=away 是去别处，没有 *play away in the sun*、*cold away*、*away in the garden* 的说法|out · side|*out* + *side*, one word|*out* 加 *side*，一个词
    `,
  },
});

const nature = vocabularyTopic({
  id: "a1-words-nature",
  title: t("Nature", "自然"),
  summary: t(
    "Trees, flowers, grass, rivers, mountains, the sea, lakes, hills, beaches, islands and forests.",
    "树、花、草、河流、山、海、湖、小山、海滩、岛屿和森林。",
  ),
  intro: t(
    "From the **mountain**, we can see a **river**, a big **forest** and an **island** in the **sea**. These words help you talk about the land and the water around you.",
    "从 **mountain**（山）上，我们能看到一条 **river**（河）、一大片 **forest**（森林），还有 **sea**（海）里的一座 **island**（岛）。这些词帮你谈论身边的山水。",
  ),
  prerequisites: ["a1-words-seasons"],
  words: [
    word(
      "tree trees",
      "a tall plant with a wooden trunk and branches",
      "树",
      "The bird is high up in the {tree}. | Apples grow on {trees}.|flowers grasses | We sit under a big {tree} for lunch.",
      "flower grass",
    ),
    word(
      "flower flowers",
      "the colored part of a plant",
      "花",
      "I give my mom {flowers} for her birthday.|trees grasses | This {flower} has red petals and smells nice. | There are red {flowers} in the garden.|trees grasses",
      "tree grass",
    ),
    word(
      "grass grasses",
      "a low green plant that covers the ground",
      "草",
      "The cows are eating {grass} in the field all day. | Don't walk on the {grass}. | The {grass} is short and green, and it covers the ground.",
      "tree flower",
    ),
    word(
      "river rivers",
      "water that moves across the land to the sea",
      "河流",
      "The Yangtze is a long {river} in China. | We swim in the {river}, and the water carries us along. | The {river} goes from the mountains to the sea.",
      "lake sea",
    ),
    word(
      "mountain mountains",
      "a very high hill",
      "山",
      "There is snow on top of the very high {mountain}. | Everest is the highest {mountain} in the world. | We walked up the {mountain} for five hours.",
      "hill beach",
    ),
    word(
      "sea seas",
      "the big area of salt water that covers much of the earth",
      "海",
      "Fish and whales live in the {sea}. | We swim in the {sea}, and the water is salty. | Ships cross the {sea} to other countries.",
      "lake river",
    ),
    word(
      "lake lakes",
      "a big area of water with land all around it",
      "湖",
      "The {lake} has land all around it. | There are ducks on the {lake} in the middle of the park. | West {Lake} is in Hangzhou.|Sea River",
      "sea river",
    ),
    word(
      "hill hills",
      "high land, not as high as a mountain",
      "小山；山丘",
      "Our school is on a small {hill}. | Let's ride our bikes down the {hill}! | From the top of this low {hill}, we can see the town.",
      "mountain lake",
    ),
    word(
      "leaf leaves",
      "one of the flat green parts of a tree or a plant",
      "叶子",
      "In fall, the {leaves} turn yellow.|flowers grasses | A dry brown {leaf} fell from the tree in fall. | Caterpillars eat the green {leaves} of trees.|flowers grasses",
      "flower grass",
    ),
    word(
      "beach beaches",
      "the land with sand next to the sea",
      "海滩",
      "We play in the sand on the {beach}. | Let's go to the {beach} and swim! | This island has white {beaches}.",
      "forest hill",
    ),
    word(
      "island islands",
      "land with water all around it",
      "岛",
      "Hainan is an {island} in the south of China. | We took a boat to the {island}, with water all around it. | Japan is made of many {islands}.",
      "forest beach",
    ),
    word(
      "forest forests",
      "a big area with many trees",
      "森林",
      "Bears live in the {forest}. | It's dark in the {forest} because of the trees. | We walked in the {forest} and saw a deer.",
      "beach island",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "Water words differ in salt and shape: the *sea* is big and salty, a *river* moves to the sea, and a *lake* has land all around it. Land words differ in height: a *hill* is low, a *mountain* is very high.",
        "水的词看咸淡和形状：*sea* 大而咸，*river* 流向大海，*lake* 四周是陆地。陆地的词看高度：*hill* 较低，*mountain* 很高。",
      ),
      meaning: t(
        "An *island* is land with water all around it, but a *beach* is the sand next to the sea. A *forest* is a big area full of trees.",
        "*island* 是四面环水的陆地，*beach* 是海边的沙滩。*forest* 是长满树的一大片地方。",
      ),
      spell: t(
        "*Island* has a silent s; *leaf* becomes *leaves*; *mountain* ends in -ain, and *beach* becomes *beaches*.",
        "*island* 里的 s 不发音；*leaf* 的复数是 *leaves*；*mountain* 以 -ain 结尾，*beach* 的复数是 *beaches*。",
      ),
    },
    notes: `
      tree|a bird high up;apples growing;shade for lunch|a tree is tall with a trunk; grass is low and covers the ground|tree 高大有树干；grass 矮矮地铺满地面|flower/flowers=flower is the small colored part of a plant, so a bird is not high up in one, apples do not grow on one and you cannot sit under one=flower 是植物上小小的彩色部分，鸟不会高高待在花里，苹果不长在花上，人也不能坐在花下;grass/grasses=grass is low on the ground, so a bird is not high up in it, apples do not grow on it and you cannot sit under it=grass 低低地长在地上，鸟不会高高待在草里，苹果不长在草上，人也不能坐在草下|tree|a double e|双写 e
      flower|a birthday gift for Mom;red petals;red ones in the garden|a flower is the colored part of a plant; a tree is a tall plant|flower 是花；tree 是树|tree/trees=tree is a tall plant, so you do not give trees as a gift, and it has no petals=tree 是高大的植物，不会送树当礼物，树也没有花瓣;grass/grasses=grass is green, so it has no red petals and is not a birthday gift=grass 是绿色的，没有红色的花瓣，也不当生日礼物|flow · er|ow said like *now*|ow 读作 *now*
      grass|cows eating it all day;walking on it;short and green on the ground|grass is low and green and covers the ground; a tree is tall|grass 矮而绿，铺满地面；tree 很高|tree=tree is tall, so cows do not eat it all day, you do not walk on it and it does not cover the ground=tree 很高，牛不会整天吃它，人也不在上面走，它也不铺满地面;flower=flower is the colored part of a plant, not the short green plant that covers a field or the ground=flower 是彩色的花，不是铺满田野和地面的矮绿草|grass|a double s|双写 s
      river|the long Yangtze;water that carries us along;from the mountains to the sea|a river moves across the land; a lake stays still with land around it|river 流动；lake 不动，四周是陆地|lake=lake has land all around it, so it does not carry you along or run to the sea, and the Yangtze is not a lake=lake 四周是陆地，不会带着你漂，也不流向大海，长江也不是湖;sea=sea is the big salt water, so the Yangtze is not one and a sea does not run from the mountains to the sea=sea 是大咸水，长江不是海，海也不会从山里流向大海|riv · er|one v, and -er at the end|只有一个 v，结尾是 -er
      mountain|snow on its very high top;Everest;five hours to walk up|a mountain is very high; a hill is low|mountain 很高；hill 较低|hill=hill is low, so it is not very high, Everest is not a hill and you do not need five hours to walk up one=hill 较低，不是很高，珠峰不是小山，爬小山也不用五小时;beach=beach is flat sand by the sea, so it has no high top and you do not walk up it=beach 是海边平平的沙滩，没有高高的山顶，也不用往上爬|moun · tain|-ain at the end, said like *tin*|结尾是 -ain，读作 *tin*
      sea|fish and whales;salty water;ships to other countries|the sea is big salt water; a lake is smaller with land around it|sea 是大咸水；lake 小一些，四周是陆地|lake=lake has fresh water with land all around it, so whales do not live in it, it is not salty and ships do not cross it to other countries=lake 是淡水，四周是陆地，鲸鱼不住在湖里，湖水不咸，船也不经湖去别的国家;river=river is fresh water moving to the sea, so whales do not live in it and it is not salty=river 是流向大海的淡水，鲸鱼不住在河里，河水也不咸|sea|ea said like *see*, the same sound as *see*|ea 读作 *see*，和 *see* 同音
      lake|land all around it;ducks in the park;West Lake|a lake has land all around it; a river moves to the sea|lake 四周是陆地；river 流向大海|sea=sea is big salt water, so it does not have land all around it or sit in a park, and *West Sea* is not in Hangzhou=sea 是大咸水，四周不是陆地，也不在公园里，*West Sea* 也不在杭州;river=river moves to the sea, so it does not have land all around it, and *West River* is not in Hangzhou=river 流向大海，四周不是陆地，*West River* 也不在杭州|lake|a silent e that makes the a say its name|词尾 e 不发音，让 a 读字母本音
      hill|a small one for the school;riding bikes down;a low one to see the town|a hill is low; a mountain is very high|hill 较低；mountain 很高|mountain=mountain is very high, so it is not small or low=mountain 很高，不是小的或低的;lake=lake is water, so a school is not on it, you do not ride bikes down it and it has no top=lake 是水，学校不建在湖上，不能骑车冲下湖，湖也没有顶|hill|a double l|双写 l
      leaf|yellow in fall;dry and brown from a tree;green ones of trees|a leaf is a flat green part of a tree; a flower is the colored part|leaf 是叶子；flower 是花|flower/flowers=flower is the colored part of a plant, not the flat part of a tree that turns yellow, dries and falls in fall=flower 是植物的花，不是秋天变黄、变干、落下的树叶;grass/grasses=grass grows on the ground, not on trees, so it does not fall from a tree=grass 长在地上，不长在树上，也不会从树上落下|leaf|ea said like *see*, and f changing to -ves|ea 读作 *see*，复数 f 变 -ves
      beach|sand to play in;swimming;white ones on an island|a beach is sand next to the sea; a forest is full of trees|beach 是海边沙滩；forest 是森林|forest=forest is full of trees, so it has no sand to play in, you do not swim there and it is not white=forest 长满树，没有沙子玩，不能游泳，也不是白色的;hill=hill is high land, so it has no sand by the sea for swimming=hill 是高地，没有海边可以游泳的沙滩|beach|ea said like *see*, and ch at the end|ea 读作 *see*，结尾是 ch
      island|Hainan;water all around it;Japan|an island is land with water all around it; a beach is the sand next to the sea|island 是四面环水的陆地；beach 是沙滩|forest=forest is an area of trees, so Hainan and Japan are not forests and a forest does not have water all around it=forest 是一片树林，海南和日本不是森林，森林四周也不是水;beach=beach is only the sand by the sea, so Hainan is not *a beach*, and Japan is not made of beaches=beach 只是海边的沙滩，海南不是一片沙滩，日本也不是由沙滩组成的|is · land|a silent s|s 不发音
      forest|bears;dark because of the trees;a deer|a forest is a big area of trees; a beach is sand by the sea|forest 是森林；beach 是沙滩|beach=beach is open sand by the sea, so it is not dark because of trees and bears and deer do not live there=beach 是开阔的海边沙滩，不会因为树多而黑，熊和鹿也不住在那里;island=island is land in the water, not an area that is dark because of trees=island 是水中的陆地，不是因为树多而黑的地方|for · est|-est at the end|结尾是 -est
    `,
  },
});

const wildAnimals = vocabularyTopic({
  id: "a1-words-wild-animals",
  title: t("Wild Animals", "野生动物"),
  summary: t(
    "Lions, tigers, elephants, monkeys, bears, snakes, pandas and giraffes, the zoo, and insects.",
    "狮子、老虎、大象、猴子、熊、蛇、熊猫和长颈鹿，动物园和昆虫。",
  ),
  intro: t(
    "At the **zoo**, a **giraffe** eats leaves, a **monkey** swings from a tree, and two **pandas** eat bamboo. These words help you name animals that live in the **wild**.",
    "在 **zoo**（动物园）里，**giraffe**（长颈鹿）吃树叶，**monkey**（猴子）在树上荡来荡去，两只 **pandas**（熊猫）吃竹子。这些词帮你说出 **wild**（野外）的动物。",
  ),
  prerequisites: ["pre-a1-words-animals"],
  words: [
    word(
      "lion lions",
      "a big wild cat; the male has long hair around its head",
      "狮子",
      "The {lion} is called the king of the animals. | {Lions} live in Africa. | A male {lion} has long hair around its head.",
      "tiger bear",
    ),
    word(
      "tiger tigers",
      "a big wild cat, orange with black stripes",
      "老虎",
      "A {tiger} is orange with black stripes. | {Tigers} hunt deer in the forests of Asia. | The {tiger} is a big cat that can swim.",
      "lion panda",
    ),
    word(
      "elephant elephants",
      "a very big gray animal with a long nose",
      "大象",
      "An {elephant} has a very long nose. | {Elephants} are the biggest animals on land. | The baby {elephant} drinks with its trunk.",
      "giraffe insect",
    ),
    word(
      "monkey monkeys",
      "an animal with a long tail that climbs trees",
      "猴子",
      "The {monkey} is eating a banana in the tree. | {Monkeys} swing from tree to tree. | A {monkey} has hands like ours.",
      "bear snake",
    ),
    word(
      "bear bears",
      "a big heavy wild animal with thick fur",
      "熊",
      "A {bear} sleeps all winter. | Polar {bears} are white. | The {bear} caught a fish in the river.",
      "panda lion",
    ),
    word(
      "snake snakes",
      "a long thin animal with no legs",
      "蛇",
      "A {snake} has no legs. | Some {snakes} are as long as a bus. | The {snake} moves along the grass.",
      "insect monkey",
    ),
    word(
      "sheep",
      "a farm animal with thick white wool",
      "羊；绵羊",
      'We get white wool from {sheep}. | Our {sheep} have thick wool, so we cut it in spring.|goats cows | A {sheep} says "baa".',
      "goat cow",
    ),
    word(
      "zoo zoos",
      "a place where people can see wild animals",
      "动物园",
      "We bought tickets and saw lions and tigers at the {zoo}. | The {zoo} keeps two pandas for people to see. | Let's go to the {zoo} and see the animals in their cages!",
      "forest insect",
    ),
    word(
      "panda pandas",
      "a black and white bear from China that eats bamboo",
      "熊猫",
      "{Pandas} eat bamboo. | The {panda} is black and white. | Giant {pandas} live in China.",
      "bear tiger",
    ),
    word(
      "giraffe giraffes",
      "a very tall African animal with a long neck",
      "长颈鹿",
      "A {giraffe} has a very long neck. | {Giraffes} eat leaves from tall trees. | The {giraffe} is the tallest animal.",
      "elephant monkey",
    ),
    word(
      "wild wilder wildest",
      "living free in nature, not with people",
      "野生的",
      "Lions are {wild} animals. | {Wild} birds live free in the forest. | This cat is not a pet. It's {wild}.",
      "tame friendly",
    ),
    word(
      "insect insects",
      "a small animal with six legs, like a bee",
      "昆虫",
      "A bee is an {insect}. | {Insects} have six legs. | There are many tiny {insects} in the grass.",
      "snake elephant",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "Use the body clue: stripes for a *tiger*, long hair around the head for a *lion*, a trunk for an *elephant*, a long neck for a *giraffe*, no legs for a *snake* and six legs for an *insect*.",
        "看身体特征：条纹是 *tiger*，头上一圈长毛是 *lion*，长鼻子是 *elephant*，长脖子是 *giraffe*，没有腿是 *snake*，六条腿是 *insect*。",
      ),
      meaning: t(
        "A *panda* is a black and white bear that eats bamboo, but other *bears* eat fish and sleep all winter. A *wild* animal lives free in nature, while a *zoo* keeps animals for people to see.",
        "*panda* 是吃竹子的黑白熊，其他 *bears* 吃鱼、冬眠。*wild* 动物在大自然里自由生活，*zoo* 把动物养起来给人看。",
      ),
      spell: t(
        "*Giraffe* has a double f, *monkey* becomes *monkeys* with no change to the y, and *sheep* stays *sheep* for one or many.",
        "*giraffe* 双写 f，*monkey* 的复数 *monkeys* 不变 y，*sheep* 单复数同形。",
      ),
    },
    notes: `
      lion|king of the animals;Africa;long hair around the head|a lion has long hair around its head; a tiger has stripes|lion 头上一圈长毛；tiger 身上有条纹|tiger/tigers=tiger has stripes and lives in Asia, not long hair around its head or the name king of the animals=tiger 有条纹，生活在亚洲，头上没有一圈长毛，也不叫百兽之王;bear/bears=bear has thick fur all over and does not live in Africa or have a mane around its head=bear 全身厚毛，不生活在非洲，头上也没有鬃毛|li · on|i said like *eye*|i 读作 *eye*
      tiger|orange with black stripes;hunting in Asian forests;a swimming big cat|a tiger has stripes; a lion has long hair around its head|tiger 有条纹；lion 头上有长毛|lion/lions=lion has no stripes and lives in Africa, not the forests of Asia, and it does not like to swim=lion 没有条纹，生活在非洲而不是亚洲森林，也不爱游泳;panda/pandas=panda is black and white and eats bamboo, so it has no orange stripes, does not hunt deer and is not a cat=panda 是黑白的、吃竹子，没有橙色条纹，不捕鹿，也不是猫科动物|ti · ger|i said like *eye*, and -er at the end|i 读作 *eye*，结尾是 -er
      elephant|a very long nose;biggest on land;a trunk to drink with|an elephant has a long trunk; a giraffe has a long neck|elephant 有长鼻子；giraffe 有长脖子|giraffe/giraffes=giraffe has a long neck, not a long nose or trunk, and it is not the biggest animal on land=giraffe 有长脖子，没有长鼻子，也不是陆地上最大的动物;insect/insects=insect is very small with six legs, not big and has no trunk=insect 很小，有六条腿，不大，也没有象鼻|el · e · phant|ph said like f|ph 读作 f
      monkey|a banana in a tree;swinging from tree to tree;hands like ours|a monkey climbs and has hands like ours; a bear is big and heavy|monkey 会爬树，手像人；bear 又大又重|bear/bears=bear is big and heavy, so it does not swing from tree to tree, eat bananas up there or have hands like ours=bear 又大又重，不在树间荡来荡去，不在树上吃香蕉，也没有像人的手;snake/snakes=snake has no arms or legs, so it has no hands and cannot swing or hold a banana=snake 没有手脚，不能荡秋千，也不能拿香蕉|mon · key|o said like the u in *up*, and ey at the end|o 读作 *up* 里的 u，结尾是 ey
      bear|sleeping all winter;polar and white;catching fish|a bear is big with thick fur; a panda is a black and white bear that eats bamboo|bear 大而毛厚；panda 是吃竹子的黑白熊|panda/pandas=panda is black and white and eats bamboo, so it is not a polar bear, it does not sleep all winter and it does not catch fish=panda 是黑白的、吃竹子，不是北极熊，不冬眠，也不抓鱼;lion/lions=lion is a big cat in hot Africa, not white, and it does not sleep all winter or catch fish=lion 是炎热非洲的大猫，不是白色的，不冬眠，也不抓鱼|bear|ear said like *air*|ear 读作 *air*
      snake|no legs;as long as a bus;moving along the grass|a snake is long with no legs; an insect is small with six legs|snake 长，没有腿；insect 小，有六条腿|insect/insects=insect has six legs and is tiny, so it does not have no legs or grow as long as a bus=insect 有六条腿，很小，不会没有腿，也不会像公交车那么长;monkey/monkeys=monkey has legs and arms, and it is not as long as a bus=monkey 有手有脚，也没有公交车那么长|snake|a silent e that makes the a say its name|词尾 e 不发音，让 a 读字母本音
      sheep|white wool;thick wool to cut;baa|a sheep has wool and says baa; a cow gives milk and says moo|sheep 有羊毛，叫声 baa；cow 产奶，叫声 moo|goat/goats=goat has short hair, not thick white wool, and it does not say *baa* the way a sheep does=goat 毛短，没有厚厚的白羊毛，叫声也和绵羊的 *baa* 不同;cow/cows=cow gives milk and says *moo*, and it has no wool to cut=cow 产奶，叫 *moo*，也没有可剪的羊毛|sheep|a double e, and the same word for one or many|双写 e，单复数同形
      zoo|tickets to see lions and tigers;pandas kept for people;animals in cages|a zoo keeps animals for people to see; a forest is where animals live free|zoo 把动物养起来给人看；forest 是动物自由生活的地方|forest=forest is wild, so you do not buy tickets to it, it does not keep pandas for people and it has no cages=forest 是野外，不用买票，不为人养熊猫，也没有笼子;insect=insect is a small animal, not a place with tickets, pandas and cages=insect 是小动物，不是要买票、有熊猫和笼子的地方|zoo|a double o, said like *two*|双写 o，读音和 *two* 押韵
      panda|bamboo;black and white;giant ones in China|a panda is a black and white bear that eats bamboo; a bear eats fish and meat|panda 是吃竹子的黑白熊；bear 吃鱼和肉|bear/bears=bear is brown, black or white, not black and white, and it does not eat bamboo or come only from China=bear 是棕色、黑色或白色的，不是黑白相间，不吃竹子，也不只生活在中国;tiger/tigers=tiger is orange with stripes and eats meat, not bamboo, and it is not black and white=tiger 是橙色带条纹的，吃肉不吃竹子，也不是黑白的|pan · da|a short a in *pan*|*pan* 里是短元音 a
      giraffe|a very long neck;leaves from tall trees;the tallest animal|a giraffe is the tallest animal, with a long neck; an elephant is the biggest, with a trunk|giraffe 最高，有长脖子；elephant 最大，有长鼻子|elephant/elephants=elephant has a trunk, not a very long neck, and it is the biggest, not the tallest=elephant 有长鼻子，没有很长的脖子，它最大而不是最高;monkey/monkeys=monkey is small with a long tail, not the tallest animal with a long neck=monkey 小小的，尾巴长，不是脖子很长的最高的动物|gi · raffe|g said like j, and a double f|g 读作 j，双写 f
      wild|lions;birds living free;a cat that is not a pet|wild means living free in nature; tame means used to living with people|wild 是野生的；tame 是驯服的|tame=tame means used to living with people, but lions, free birds and a cat that is not a pet live in nature=tame 是被驯服、习惯和人一起生活，可狮子、自由的鸟和不是宠物的猫都生活在野外;friendly=friendly means kind and happy with people, but here the point is living free, not how kind an animal is=friendly 是友好，可这里说的是自由生活，不是动物友不友好|wild|i said like *eye*|i 读作 *eye*
      insect|a bee;six legs;tiny ones in the grass|an insect is small with six legs; a snake has no legs|insect 小，有六条腿；snake 没有腿|snake/snakes=snake has no legs and is not a bee, and it is not tiny=snake 没有腿，不是蜜蜂，也不算很小;elephant/elephants=elephant is huge with four legs, not a bee or tiny in the grass=elephant 很大，有四条腿，不是蜜蜂，也不会小小地藏在草里|in · sect|ct at the end|结尾是 ct
    `,
  },
});

// It is raining.

/** weatherStates are what it is: the weather words that follow It's. */
const weatherStates: readonly string[] = [
  "sunny",
  "raining",
  "very cold",
  "windy",
  "snowing",
  "cloudy",
  "hot",
  "warm",
  "rainy",
  "cool",
  "snowy",
  "very windy",
];

const weatherTimes: readonly string[] = [
  "today",
  "now",
  "this morning",
  "in Beijing",
  "outside",
  "this afternoon",
  "in London",
  "in the north",
  "here",
];

/** clockStates are the time and the day, which also take It's. */
const clockStates: readonly string[] = [
  "seven o'clock",
  "half past four",
  "late",
  "Monday today",
  "my birthday today",
  "a quarter past nine",
  "ten o'clock",
  "early",
  "Saturday today",
  "half past eight",
  "nine o'clock",
  "June 1st today",
];

/** itRests are what follows It's: every weather state at every time and place, and the twelve about the time, each bank
 * starting at its own place. */
const weatherRests = everyPair(weatherStates, weatherTimes).map(([state, when]) => `${state} ${when}`);
const itRests = (half: 0 | 1): readonly string[] =>
  interleave([
    [...weatherRests.slice(half * 54), ...weatherRests.slice(0, half * 54)],
    [...clockStates.slice(half * 6), ...clockStates.slice(0, half * 6)],
  ]);

const itChoiceBank: readonly ChoiceItem[] = itRests(0).map(
  (rest, k): ChoiceItem => [
    "",
    `It's ${rest}.`,
    k % 2 === 0 ? [`Is ${rest}.`, `It ${rest}.`, `There is ${rest}.`] : [`Is ${rest}.`, `It ${rest}.`],
  ],
);

const itFixBank: readonly TypedItem[] = itRests(1).map((rest, k): TypedItem => {
  const shown = k % 2 === 0 ? `Is ${rest}.` : `${rest.charAt(0).toUpperCase()}${rest.slice(1)}.`;
  const day = clockStates.includes(rest) && rest.endsWith(" today") ? [`Today is ${rest.slice(0, -" today".length)}.`] : [];
  return { shown, accepted: [`[It is|It's] ${rest}.`, ...day], canonical: `It's ${rest}.`, wrong: [shown, `It ${rest}.`] };
});

/** itTalksAbout says whether a sentence with it is about the weather or the time and day. */
const itTalksAbout = (sentence: string): Text =>
  clockStates.some((state) => sentence.includes(state)) ? t("the time or the day", "时间或日期") : t("the weather", "天气");

/** itWhy explains why a sentence about the weather or the time needs it. */
const itWhy = (right: string): Text => {
  const about = itTalksAbout(right);
  return t(
    `This sentence is about ${about.en}. An English sentence needs a subject, and for ${about.en} the subject is *it*, with *is* or *'s* after it: ${right}\n\n**Check.** Find both parts at the start of the sentence: the subject (*It*) and the verb (*is* / *'s*). Both are present, so the sentence is complete.`,
    `这句说的是${about["zh-CN"]}。英语句子必须有主语，谈${about["zh-CN"]}时主语用 *it*，后面接 *is* 或 *'s*：${right}\n\n**检验。** 看句首的两个部分：主语（*It*）和动词（*is* / *'s*）都在，句子才完整。`,
  );
};

/** whyNotIt explains a sentence that leaves out it or is, or puts there is in place of it. */
const whyNotIt = (wrong: string, right: string, _shown: string, position: number): Text =>
  position === 0
    ? t(
        `*${wrong}* has a verb but no subject. English cannot leave out *it* at the start.`,
        `*${wrong}* 有动词却没有主语。英语句首不能省略 *it*。`,
      )
    : position === 1
      ? t(
          `*${wrong}* has a subject but no verb. *It* needs *is* or *'s* after it.`,
          `*${wrong}* 有主语却没有动词。*It* 后面要有 *is* 或 *'s*。`,
        )
      : t(
          `*${wrong}* uses *there is*, which says that something exists. For ${itTalksAbout(right).en}, the subject is *it*.`,
          `*${wrong}* 用了 *there is*，它表示某物存在。谈${itTalksAbout(right)["zh-CN"]}时主语要用 *it*。`,
        );

const itForWeather: TopicDef = {
  id: "it-for-weather",
  title: t("It Is Raining", "It is raining：用 it 谈天气和时间"),
  summary: t(
    "It is cold. It's raining. English needs it for the weather and the time.",
    "It is cold. It's raining. 英语谈天气和时间时需要 it。",
  ),
  intro: t(
    "In *It's windy outside* and *It's three o'clock*, the word *it* does not point to any object—it holds the subject slot that every English sentence requires.",
    "在 *It's windy outside* 和 *It's three o'clock* 里，*it* 并不指代某个具体物体，它只是占住英语句子必须有的主语位置。",
  ),
  prerequisites: ["present-continuous", "a1-words-weather"],
  encompasses: [
    { topic: "present-continuous", weight: 0.2 },
    { topic: "a1-words-weather", weight: 0.3 },
  ],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("It for the weather", "用 it 谈天气"),
      t(
        "An English sentence needs a subject. For the weather, the time and the day, the subject is *it*: *It's sunny. It's raining. It's seven o'clock. It's Monday today.*\n\n> **Watch out.** Do not drop *it* (*Is cold*) or drop *is* (*It cold*), and do not use *there is* for weather adjectives (*There is sunny* is wrong).",
        "英语句子必须有主语。谈天气、时间和日期时，主语用 *it*：*It's sunny. It's raining. It's seven o'clock. It's Monday today.*\n\n> **注意。** 中文说“下雨了”“很冷”“七点了”不需要主语，但英语既不能省掉 *it*（*Is cold*），也不能省掉 *is*（*It cold*），更不能用 *there is* 配天气形容词（*There is sunny* 是错的）。",
      ),
      choiceGenerator(t("Which sentence is right?", "哪个句子是对的？"), itChoiceBank, itWhy, whyNotIt),
    ),
    point(
      "fix",
      t("Putting in it", "补上 it"),
      t(
        "Each sentence leaves out the subject (or both subject and verb). Write it again with *It is* or *It's* at the start: *Is cold today.* → *It's cold today.* *Raining now.* → *It's raining now.*\n\n> **Watch out.** When you add *It's*, change the old first word to lowercase (unless it is a day or month like *Monday* or *June*) and keep the period at the end.",
        "每个句子都漏掉了主语（甚至连动词一起漏掉了）。在句首补上 *It is* 或 *It's* 重写句子：*Is cold today.* → *It's cold today.* *Raining now.* → *It's raining now.*\n\n> **注意。** 补上 *It's* 后，原来句首的词要改成小写（除非是 *Monday*、*June* 这样的专有名词），句末保留句号。",
      ),
      typedGenerator("sentence-pattern", t("Fix the sentence.", "改正这个句子。"), itFixBank, itWhy, itForWeatherFixNot),
    ),
  ],
};

// Writing a postcard.

const criterion = (id: string): CriterionSpec => {
  const found = criterionById(id);
  if (!found) throw new Error(`unknown criterion ${id}`);
  return found;
};

/** postcardBank asks for a postcard from a place, in a season or on a trip. */
const postcardBank: readonly WritingItem[] = [
  {
    task: "You are on holiday at the beach. Write a postcard to your grandma.",
    model:
      "Dear Grandma,\nI'm at the beach with Mom and Dad. It's sunny and hot every day. We are swimming in the sea and playing in the sand. I'm having a great time!\nLove, Lily",
  },
  {
    task: "You are visiting your aunt in the mountains in winter. Write a postcard to your friend.",
    model:
      "Hi Tom,\nI'm at my aunt's house in the mountains. It's snowing, and it's very cold. Today we are making a big snowman. See you next week!\nBen",
  },
  {
    task: "You are on a school trip to a big city. Write a postcard to your parents.",
    model:
      "Dear Mom and Dad,\nI'm in Shanghai with my class. It's cloudy today, but it's warm. We are visiting a museum this morning. I love this city!\nLove, Mia",
  },
  {
    task: "You are camping in a forest. Write a postcard to your brother.",
    model:
      "Hi Leo,\nI'm camping in the forest with Dad. It's raining, so we are sitting in our tent and playing cards. Tomorrow we will walk to the lake.\nSam",
  },
  {
    task: "You are on an island in summer. Write a postcard to your teacher.",
    model:
      "Dear Ms. Green,\nI'm on Hainan Island with my family. It's very hot and sunny here. Every day I swim in the sea and eat a lot of fruit. See you in September!\nFrom Anna",
  },
  {
    task: "You are at a farm in spring. Write a postcard to your friend.",
    model:
      "Hi Emma,\nI'm at my uncle's farm. It's spring, and it's warm. There are baby sheep and lots of flowers. I'm helping my uncle feed the chickens every morning.\nLove, Kate",
  },
  {
    task: "You are by a lake in fall. Write a postcard to your grandpa.",
    model:
      "Dear Grandpa,\nI'm at the lake with Mom. It's fall, and the leaves are red and yellow. It's cool and windy, so we are flying a kite. I miss you!\nLove, Jack",
  },
  {
    task: "You are visiting a zoo in another city. Write a postcard to your sister.",
    model:
      "Hi Amy,\nI'm in Chengdu with Dad. It's cloudy and a little rainy today. We are at the zoo, and I'm watching the pandas. They are eating bamboo!\nNora",
  },
  {
    task: "You are on a skiing holiday. Write a postcard to your class.",
    model:
      "Dear class,\nI'm in the mountains with my family. It's snowy and very cold, but the sun is out. I'm learning to ski. It's difficult, but it's fun!\nFrom Max",
  },
  {
    task: "You are staying with your cousin by the sea in winter. Write a postcard to your mom.",
    model:
      "Dear Mom,\nI'm at Cousin Ana's house by the sea. It's windy and cold today. We are walking on the beach and looking for shells. Ana's dog is very funny.\nLove, Lucy",
  },
  {
    task: "You are on a trip to the countryside in summer. Write a postcard to your friend.",
    model:
      "Hi Jun,\nI'm in the countryside with my grandparents. It's hot and sunny. In the afternoon we swim in the river. At night we look at the stars.\nYour friend, Ben",
  },
  {
    task: "You are on a rainy holiday in London. Write a postcard to your dad.",
    model:
      "Dear Dad,\nI'm in London with Mom. It's raining again! We have umbrellas, so we are walking by the river. Tomorrow we are visiting a big museum.\nLove, Mia",
  },
];

const postcardCriteria = ["a1-postcard-place", "a1-postcard-weather", "a1-postcard-doing", "a1-reader-and-name", "a1-sentences"];

const writingAPostcard: TopicDef = {
  id: "writing-a-postcard",
  title: t("Writing a Postcard", "写明信片"),
  summary: t(
    "Write a postcard of three to five sentences: where you are, what the weather is like and what you are doing.",
    "写一张三到五句话的明信片：你在哪里、天气怎么样、你正在做什么。",
  ),
  intro: t(
    "A postcard shares a snapshot of a trip in a few lines: *Hi Maya, I'm in Kyoto with my aunt. It's cool and cloudy today. We are walking past old temples. Love, Noah.* Three details—place, weather and activity—bring the trip to life.",
    "明信片用短短几行分享旅途片段：*Hi Maya, I'm in Kyoto with my aunt. It's cool and cloudy today. We are walking past old temples. Love, Noah.* 地点、天气、正在做的事三个细节一写，画面就活起来了。",
  ),
  prerequisites: ["it-for-weather", "writing-a-short-note"],
  encompasses: [
    { topic: "it-for-weather", weight: 0.3 },
    { topic: "writing-a-short-note", weight: 0.3 },
  ],
  xp: 25,
  strand: "writing",
  criteria: postcardCriteria.map(criterion),
  knowledgePoints: [
    point(
      "postcard",
      t("Where, the weather and what you are doing", "在哪里、天气、在做什么"),
      t(
        "A postcard is a short note from a trip. Start with the reader's name (*Dear Grandma,*) and end with yours. In between, say three things:\n\n- where you are: *I'm at the beach with Mom and Dad.*\n- the weather: *It's sunny and hot.*\n- what you are doing: *We are swimming in the sea.*\n\n> **Watch out.** Use *It's* for the weather (*It's sunny*, not *Is sunny*) and *be + -ing* for what you are doing (*We are swimming*, not *We swimming*).",
        "明信片是旅途中写的短信。开头写收信人的称呼（*Dear Grandma,*），结尾写自己的名字。中间写三件事：\n\n- 你在哪里：*I'm at the beach with Mom and Dad.*\n- 天气怎么样：*It's sunny and hot.*\n- 你正在做什么：*We are swimming in the sea.*\n\n> **注意。** 写天气别漏掉 *It's*（要写 *It's sunny*，不要写 *Is sunny*），写正在做的事别漏掉 *be*（要写 *We are swimming*，不要写 *We swimming*）。",
      ),
      writingGenerator(
        t(
          "Write a postcard in English of three to five sentences: say where you are, what the weather is like and what you are doing.",
          "用英语写一张三到五句话的明信片：说出你在哪里、天气怎么样、你正在做什么。",
        ),
        postcardBank,
        postcardCriteria,
        { minWords: 20, maxChars: 600 },
        (model) =>
          t(
            `One good postcard:\n\n> ${model.replace(/\n/gu, "\n> ")}\n\n**Check.** Verify all five parts in your postcard: a greeting, your location, the weather with *It's*, what you are doing, and your name at the end.`,
            `一张好的明信片：\n\n> ${model.replace(/\n/gu, "\n> ")}\n\n**检验。** 对照检查明信片的五个要素：开头称呼、所在地点、带 *It's* 的天气描述、正在做的事，以及结尾署名。`,
          ),
      ),
    ),
  ],
};

/** topics are the topics of the unit Weather and Nature. */
export const topics: readonly TopicDef[] = [weather.topic, seasons.topic, nature.topic, wildAnimals.topic, itForWeather, writingAPostcard];

/** vocabulary are the words the unit Weather and Nature teaches. */
export const vocabulary: readonly WordBatch[] = [weather.batch, seasons.batch, nature.batch, wildAnimals.batch];
