// A2, unit 8: The Natural World. Land and water, storms and ice, space, plants and little words; the present perfect
// with ever and never; an experience judged by a model.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, interleave, vocabularyTopic, word } from "../words.ts";
import { fill, judgedTopic } from "./kit.ts";
import { presentPerfectWithEverAndNeverWriteNot } from "./mistakes.ts";

const landscape = vocabularyTopic({
  id: "a2-words-landscape",
  title: t("Land and Water", "陆地和水"),
  summary: t(
    "The earth, land and ground; stones, rocks and sand; woods and jungles; ponds, waterfalls and streams; paths.",
    "地球、陆地和地面；石头、岩石和沙子；树林和丛林；池塘、瀑布和小溪；小路。",
  ),
  intro: t(
    "On our walk we followed a narrow **path** through the **woods**, crossed a little **stream** on some stones and swam in the **pond** under a **waterfall**. These words help you describe the land, the water and what the countryside is made of.",
    "散步时，我们沿着一条窄窄的 **path**（小路）穿过 **woods**（树林），踩着石头跨过一条 **stream**（小溪），又在 **waterfall**（瀑布）下面的 **pond**（水潭）里游了泳。这些词帮你描述陆地、水，以及乡间由什么构成。",
  ),
  prerequisites: ["a1-words-nature"],
  words: [
    word(
      "earth",
      "the world we live on; the soil that plants grow in",
      "地球；泥土",
      "The {earth} goes around the sun. | Plant the seeds in the soft brown {earth} of the garden and water them. | The moon is smaller than the {earth}.",
      "land sand",
    ),
    word(
      "land lands",
      "the part of the world that is not sea",
      "陆地；土地",
      "After ten days at sea, the sailors finally saw {land}: an island with trees. | My grandparents have a small piece of {land} with a garden. | Frogs live on {land} and in water.",
      "sea sand",
      "ground",
    ),
    word(
      "ground grounds",
      "the surface of the earth that you walk on",
      "地面",
      "The apple fell from the tree to the {ground}. | We sat on the {ground} under the trees: there were no chairs in the park. | The {ground} in the garden is wet after the rain.",
      "floor sky",
      "land",
    ),
    word(
      "stone stones",
      "a small hard piece of rock",
      "石头",
      "He threw a heavy {stone} into the river, and it sank with a big splash. | The old house has thick grey {stone} walls. | There's a hard little {stone} from the path in my shoe!",
      "leaf seed",
      "rock",
    ),
    word(
      "rock rocks",
      "the hard material of mountains; a big stone",
      "岩石",
      "The castle is built on hard {rock}, high above the sea. | Mountains are made of {rock}. | They cut through the hard {rock} to make a road through the mountain.",
      "sand wood",
      "stone",
    ),
    word(
      "wood woods",
      "what trees are made of; a small forest",
      "木头；树林",
      "The table is made of {wood} from an old tree. | We went for a walk in the {woods} near our village.|jungles stones | Put some more {wood} on the fire.",
      "jungle stone",
    ),
    word(
      "jungle jungles",
      "a thick hot wet forest with many plants and animals",
      "丛林",
      "Tigers and monkeys live in the hot wet {jungle}. | It rains almost every day in the {jungle}. | The explorers cut their way through the hot, thick {jungle} for days.",
      "wood desert",
    ),
    word(
      "pond ponds",
      "a small area of water, smaller than a lake",
      "池塘",
      "There are fish and frogs in the little round {pond} in our garden. | The children threw bread to the ducks on the tiny {pond}. | In winter our small garden {pond} freezes.",
      "stream lake",
    ),
    word(
      "waterfall waterfalls",
      "water that falls down from a high place",
      "瀑布",
      "Niagara Falls is a famous {waterfall}. | We heard the {waterfall} roaring before we saw the water falling. | You can swim under the {waterfall} in summer, where the water comes down.",
      "stream pond",
    ),
    word(
      "stream streams",
      "a small, narrow river",
      "小溪",
      "We crossed the {stream} on some stones. | Fresh water runs slowly down the hill in a little {stream}. | The narrow {stream} goes into the big river.",
      "pond waterfall",
    ),
    word(
      "sand",
      "the very small pieces of rock on a beach or in a desert",
      "沙子",
      "The children are building a castle in the {sand} on the beach. | There's {sand} in my shoes after the beach. | The desert is full of {sand}.",
      "stone earth",
    ),
    word(
      "path paths",
      "a narrow way for walking",
      "小路",
      "Follow the narrow {path} through the woods on foot. | Walk on the {path}, not on the grass: it's only for people on foot. | A narrow {path}, too small for cars, goes up to the top of the hill.",
      "stream road",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Pond*, *stream* and *waterfall* are all water: a *pond* is small and still, a *stream* is a narrow river that runs along, and a *waterfall* falls down from a high place. Ask whether the water in the sentence stays, runs or falls.",
        "*pond*、*stream* 和 *waterfall* 都是水：*pond* 小而平静，*stream* 是流动的窄窄小河，*waterfall* 从高处落下。想想句子里的水是静止、流动还是落下。",
      ),
      meaning: t(
        "*Earth* has two meanings: the world we live on, as in *the earth goes around the sun*, and the soil that plants grow in. *Land* is the part of the world that is not sea.",
        "*earth* 有两个意思：我们生活的地球，如 *the earth goes around the sun*；以及种植物的泥土。*land* 是世界上不是海的那部分，即陆地。",
      ),
      spell: t(
        "*Jungle* ends in -gle, not -gel, and *waterfall* is water + fall, one word with a double l.",
        "*jungle* 以 -gle 结尾，不是 -gel；*waterfall* 是 water + fall，合成一个词，结尾双写 l。",
      ),
    },
    notes: `
      earth|going around the sun;seeds in a garden;the moon being smaller|the earth is our world, or the soil in a garden; land is the part that is not sea|earth 是地球或园子里的泥土；land 是不是海的陆地|land=land is the part of the world that is not sea, not the whole planet or soft soil for seeds=land 是不是海的陆地，不是整个地球，也不是种子种进去的软土;sand=sand is very small pieces of rock on a beach, not the planet or garden soil=sand 是海滩上的细沙，不是地球，也不是园子里的泥土|the earth · in the earth|ear said like *er*, and -th at the end|ear 读作 *er*，结尾是 -th
      land|sailors seeing an island;a piece with a garden;frogs out of water|land is the part of the world that is not sea; the sea is the salt water|land 是陆地；sea 是海|sea=sea is the salt water that covers much of the world, the opposite of land=sea 是覆盖大片地球的咸水，和陆地正相反;sand=sand is very small pieces of rock on a beach, not all the dry part of the world=sand 是海滩上的细沙，不是世界上所有的陆地|on land · a piece of land|-nd at the end|结尾是 -nd
      ground|an apple falling from a tree;sitting under trees in a park;a wet garden|the ground is the earth outside that you walk on; the floor is inside a room|ground 是户外的地面；floor 是屋里的地板|floor=floor is the flat part you walk on inside a room, not the earth outside under trees=floor 是屋里的地板，不是树下户外的地面;sky=sky is high above you, not the earth you walk on=sky 是头顶上的天空，不是脚下走的地面|on the ground · fall to the ground|ou said like *ow*, as in *round*|ou 和 *round* 里的一样
      stone|a heavy splash in a river;thick grey walls;something hard from the path in a shoe|a stone is a small hard piece of rock; a leaf is soft and grows on a tree|stone 是小块硬石头；leaf 是长在树上的软叶子|leaf=leaf is a soft, light, green part of a tree, not a hard heavy piece of rock=leaf 是树上又软又轻的绿叶，不是又硬又重的石块;seed=seed is the small thing a plant grows from, not a piece of rock to build walls with=seed 是植物从中长出来的种子，不是可以砌墙的石块|stone walls · a stone in my shoe|o that says its name before the silent e|不发音的 e 前面，o 读字母本音
      rock|a castle high above the sea;mountains;a road through a mountain|rock is the hard material of mountains; sand is very small soft pieces of it|rock 是构成山的坚硬岩石；sand 是细小松软的沙|sand=sand is very small soft pieces of rock on a beach, too soft to build a castle on or cut a road through=sand 是海滩上细小松软的沙，太软，不能在上面建城堡，也不用凿开修路;wood=wood is what trees are made of, not the hard material of mountains=wood 是树木的材料，不是构成山的坚硬岩石|made of rock · hard rock|ck at the end|结尾是 ck
      wood|a table from an old tree;a walk near a village;a fire|wood is what trees are made of, and *woods* is a small forest; a jungle is a thick hot wet forest|wood 是木头，*woods* 是小树林；jungle 是又热又湿的茂密丛林|jungle/jungles=jungle is a thick hot wet forest far from towns, not a table, a small forest near a village or something for a fire=jungle 是远离城镇、又热又湿的茂密丛林，不是桌子的材料、村边的小树林或烧火的柴;stone/stones=stone is a hard piece of rock, which does not grow on trees or burn on a fire=stone 是硬石块，不长在树上，也不能烧火|made of wood · in the woods|oo said like short u, as in *good*|oo 读短元音，和 *good* 一样
      jungle|tigers and monkeys;rain almost every day;cutting through thick plants|a jungle is a thick hot wet forest; a desert is very dry with few plants|jungle 是茂密湿热的丛林；desert 是干燥少植物的沙漠|wood=wood is what trees are made of, or a small cool forest, not a hot wet place full of tigers=wood 是木头或凉爽的小树林，不是满是老虎的湿热之地;desert=desert is a very dry place with almost no rain or plants, the opposite of a jungle=desert 是几乎没有雨水和植物的干燥地方，和丛林正相反|in the jungle|-gle at the end, said like *gl*|结尾是 -gle，读作 *gl*
      pond|a little round pool in a garden;ducks on tiny water;a garden in winter|a pond is small still water; a lake is much bigger|pond 是小而平静的水塘；lake 大得多|stream=stream is a narrow river that runs along, not small round water that stays in one place=stream 是流动的窄窄小河，不是待在原地的小圆水塘;lake=lake is a large area of water, too big to be tiny or to fit in a garden=lake 是大片水域，不会很小，也装不进园子|a garden pond · ducks on the pond|-nd at the end|结尾是 -nd
      waterfall|Niagara Falls;roaring falling water;swimming under falling water|a waterfall falls from a high place; a stream runs along the ground|waterfall 从高处落下；stream 沿地面流淌|stream=stream is a narrow river that runs along the ground, not water falling down from a high place=stream 是沿地面流的小河，不是从高处落下的水;pond=pond is small still water, not water falling from a high place=pond 是平静的小水塘，不是从高处落下的水|a famous waterfall|water + fall, one word with the double l|water + fall，合成一个词，双写 l
      stream|crossing on stones;water running slowly down a hill;joining a big river|a stream is a small narrow river; a pond is still water|stream 是窄窄的小河；pond 是平静的水塘|pond=pond is small still water that stays in one place, not water that runs along=pond 是待在原地的平静水塘，不是流动的水;waterfall=waterfall is water falling down from a high place, not a narrow river running slowly along=waterfall 是从高处落下的水，不是慢慢流淌的小河|a little stream|ea for the long e: str · eam|ea 发长 e 音：str · eam
      sand|a castle on a beach;shoes after the beach;a desert|sand is very small pieces of rock; a stone is one hard piece|sand 是细沙；stone 是一块硬石头|stone=stone is one hard piece of rock, not very small soft pieces you build a castle in=stone 是一块硬石头，不是可以堆城堡的细沙;earth=earth is the soil plants grow in, not the very small pieces of rock on a beach or in a desert=earth 是种植物的泥土，不是海滩或沙漠里的细沙|in the sand|-nd at the end, and no plural|结尾是 -nd，没有复数
      path|walking through woods;only for people on foot;too small for cars|a path is a narrow way for walking; a road is for cars|path 是步行的小路；road 是走车的路|stream=stream is a narrow river of water, not a way you walk on=stream 是窄窄的小河，不是可以走的路;road=road is a wide way for cars, not a narrow way only for people on foot=road 是走车的宽路，不是只给行人走的小路|follow the path · stay on the path|a short a, and th at the end|短元音 a，结尾是 th
    `,
  },
});

const weather2 = vocabularyTopic({
  id: "a2-words-weather-2",
  title: t("Storms and Ice", "风暴和冰"),
  summary: t(
    "Storms, thunder and lightning; fog; freezing and melting; the sun shining; degrees; wet and dry.",
    "风暴、雷和闪电；雾；结冰和融化；阳光照耀；度数；湿的和干的。",
  ),
  intro: t(
    "During the **storm**, **lightning** lit up the sky and **thunder** shook the windows; the next morning it was **foggy**, and the puddles began to **freeze**. These words help you describe the weather, from hot days to icy nights.",
    "**storm**（暴风雨）中，**lightning**（闪电）照亮天空，**thunder**（雷声）震得窗户直响；第二天早上 **foggy**（有雾的），水坑开始 **freeze**（结冰）。这些词帮你描述各种天气，从炎热的白天到结冰的夜晚。",
  ),
  prerequisites: ["a2-words-landscape"],
  words: [
    word(
      "storm storms",
      "very bad weather with strong winds and heavy rain",
      "暴风雨",
      "A big {storm} with strong winds broke the windows of the school. | The ships stayed in the port because of the {storm}: the wind and waves were too strong. | After the {storm}, with its heavy rain and wind, the sky was clear.",
      "fog thunder",
    ),
    word(
      "thunder",
      "the loud noise in the sky during a storm",
      "雷",
      "My dog is scared of the loud noise of {thunder}. | We heard {thunder} in the distance. | First you see the lightning, then you hear the {thunder}.",
      "lightning storm",
    ),
    word(
      "lightning",
      "the bright flash of light in the sky during a storm",
      "闪电",
      "The tree was hit by a flash of {lightning} and burned. | A flash of {lightning} lit up the sky. | Don't stand under a tree when there is {lightning}: it can hit tall things.",
      "thunder storm",
    ),
    word(
      "fog",
      "thick cloud near the ground that makes it hard to see",
      "雾",
      "We couldn't see the road because of the thick white {fog}. | The quiet grey {fog} came in from the sea in the morning. | The plane couldn't land in the thick {fog}.",
      "storm thunder",
    ),
    word(
      "foggy foggier foggiest",
      "with a lot of fog",
      "有雾的",
      "It's very {foggy} this morning: I can't see the end of the street. | London is famous for its grey {foggy} weather, when you can't see far. | On {foggy} days, the ships stay in the port because they can't see.",
      "wet dry",
    ),
    word(
      "freeze freezes froze frozen freezing",
      "to become ice because it is very cold",
      "结冰；冻",
      "Water {freezes} at zero degrees.|melts shines | The lake {froze} last winter, and we skated on it.|melted shone | It's {freezing} outside! Wear a hat.|melting shining",
      "melt shine",
    ),
    word(
      "melt melts melted melting",
      "to change from ice to water because it gets warm",
      "融化",
      "The ice cream {melted} in the sun and ran down my hand.|froze shone | When the snow {melts}, the rivers get bigger.|freezes shines | Put the chocolate in a bowl over hot water and let it {melt}.",
      "freeze shine",
    ),
    word(
      "shine shines shone shining",
      "to give out bright light",
      "照耀；发光",
      "The sun is {shining}. Let's go out!|melting freezing | The stars {shone} in the dark sky.|melted froze | Her eyes {shine} when she talks about horses.",
      "melt freeze",
    ),
    word(
      "degree degrees",
      "a unit for measuring how hot or cold something is",
      "度",
      "It's thirty {degrees} today. It's very hot!|meters kilometers | Water boils at a hundred {degrees}.|meters kilometers | The temperature fell to minus ten {degrees}.|meters kilometers",
      "meter kilometer",
    ),
    word(
      "wet wetter wettest",
      "covered with water; not dry",
      "湿的",
      "I forgot my umbrella and got very {wet}. | Don't sit there. The paint is still {wet}. | Take off your {wet} shoes: you walked through the rain.",
      "dry foggy",
    ),
    word(
      "dry dries dried drying drier driest",
      "with no water; to make something dry",
      "干的；弄干",
      "The ground is very {dry}. It hasn't rained for weeks. | Hang the wet clothes in the sun to {dry}.|melt freeze | {Dry} your hands on this towel.|Melt Freeze",
      "wet foggy",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Thunder* and *lightning* come together in a storm: *lightning* is the flash you see, and *thunder* is the noise you hear after it. Look for *see*, *flash*, *hear* or *noise* in the sentence.",
        "*thunder* 和 *lightning* 在暴风雨中一起出现：*lightning* 是看到的闪光，*thunder* 是随后听到的响声。在句子里找 *see*、*flash*、*hear* 或 *noise*。",
      ),
      meaning: t(
        "*Freeze* and *melt* are opposites: water *freezes* into ice when it is very cold, and ice, snow or chocolate *melts* when it gets warm.",
        "*freeze* 和 *melt* 意思相反：天很冷时水 *freezes*（结成冰），变暖时冰、雪或巧克力 *melts*（融化）。",
      ),
      spell: t(
        "*Lightning* has no e in the middle: light · ning, not *lightening*. *Freeze* has a double e, and its past is *froze*.",
        "*lightning* 中间没有 e：light · ning，不是 *lightening*。*freeze* 有两个 e，过去式是 *froze*。",
      ),
    },
    notes: `
      storm|strong winds and windows;strong wind and waves;heavy rain and wind|a storm is very bad weather with wind and rain; fog is thick cloud near the ground|storm 是狂风暴雨；fog 是贴近地面的浓雾|fog=fog is thick quiet cloud near the ground, with no strong wind or heavy rain=fog 是贴近地面的安静浓雾，没有大风，也没有大雨;thunder=thunder is only the noise in the sky, not the wind and rain=thunder 只是天上的雷声，不是风和雨|a big storm · after the storm|or said like *aw*, and -m at the end|or 读作 *aw*，结尾是 -m
      thunder|a loud noise that scares a dog;a sound far away;hearing after seeing lightning|thunder is the noise you hear; lightning is the flash you see|thunder 是听到的雷声；lightning 是看到的闪电|lightning=lightning is the bright flash you see, not a noise you hear=lightning 是看到的亮光，不是听到的声音;storm=storm is the whole bad weather with wind and rain, not only the noise in the sky=storm 是整场风雨，不只是天上的响声|hear thunder|th at the start, and -er at the end|开头是 th，结尾是 -er
      lightning|a burned tree;a flash in the sky;hitting tall things|lightning is the bright flash in a storm; thunder is the noise after it|lightning 是闪电；thunder 是随后的雷声|thunder=thunder is the noise in the sky, and a noise cannot flash, burn or hit a tree=thunder 是天上的响声，声音不会闪光，也不会烧着或击中树;storm=storm is the whole bad weather, not the one bright flash that hits things=storm 是整场坏天气，不是击中东西的那一道闪光|a flash of lightning · hit by lightning|no e: light · ning|没有 e：light · ning
      fog|thick white air hiding a road;quiet grey cloud from the sea;a plane that couldn't land|fog is thick cloud near the ground; a storm has strong wind and rain|fog 是浓雾；storm 是狂风暴雨|storm=storm is bad weather with strong wind and heavy rain, not quiet white or grey cloud=storm 是狂风暴雨，不是安静的白色或灰色的雾;thunder=thunder is a noise in the sky, and you cannot see it or fail to see through it=thunder 是天上的响声，看不见，也谈不上挡住视线|thick fog|one g, and -og at the end|只有一个 g，结尾是 -og
      foggy|not seeing the end of the street;not seeing far in London;ships that can't see|foggy means with a lot of fog; wet means covered with water|foggy 是有雾的；wet 是湿的|wet=wet means covered with water, and it does not stop you from seeing far=wet 是被水打湿，不会让你看不远;dry=dry means with no water, and it does not stop you from seeing far=dry 是干的，不会让你看不远|a foggy morning|the g doubles: fog + g + -y|g 要双写：fog + g + -y
      freeze|water at zero degrees;a lake for skating;a hat for very cold weather|freeze means to become ice; melt means to change from ice to water|freeze 是结冰；melt 是融化|melt=melt means changing from ice to water when it gets warm, the opposite of freeze=melt 是变暖时冰化成水，和 freeze 意思相反;shine=shine means giving out bright light, not becoming ice=shine 是发出亮光，不是结冰|freeze at zero · It's freezing!|ee, and the past *froze*|拼作 ee，过去式是 *froze*
      melt|ice cream running down a hand;rivers getting bigger;chocolate over hot water|melt means to change from ice to water when it gets warm; freeze is the opposite|melt 是遇热融化；freeze 意思相反|freeze=freeze means becoming ice when it is very cold, the opposite of melt=freeze 是很冷时结冰，和 melt 意思相反;shine=shine means giving out bright light, not changing into water=shine 是发出亮光，不是化成水|the snow melts|-lt at the end|结尾是 -lt
      shine|a sunny day to go out;stars in a dark sky;eyes talking about horses|shine means to give out bright light; melt means to change into water|shine 是发光；melt 是融化|melt=melt means changing from ice to water, not giving out bright light=melt 是冰化成水，不是发出亮光;freeze=freeze means becoming ice, not giving out bright light=freeze 是结冰，不是发出亮光|the sun is shining|the past is *shone*, and drop the e in *shining*|过去式是 *shone*，*shining* 去掉 e
      degree|thirty and very hot;water boiling at a hundred;minus ten|a degree measures how hot or cold something is; a meter measures length|degree 量冷热；meter 量长度|meter/meters=meter measures how long or high something is, not how hot or cold=meter 量长度或高度，不量冷热;kilometer/kilometers=kilometer measures how far something is, not how hot or cold=kilometer 量距离，不量冷热|thirty degrees|de · gree, with the double e|de · gree，两个 e
      wet|no umbrella;fresh paint;walking through rain|wet means covered with water; dry means with no water|wet 是湿的；dry 是干的|dry=dry means with no water, the opposite of wet=dry 是没有水，和 wet 意思相反;foggy=foggy describes weather with thick cloud near the ground, not shoes, paint or a person=foggy 形容雾天，不形容鞋、油漆或人|get wet|the t doubles: wetter, wettest|t 要双写：wetter、wettest
      dry|no rain for weeks;wet clothes in the sun;a towel|dry means with no water, or to take the water away; wet is the opposite|dry 是干的或弄干；wet 意思相反|wet=wet means covered with water, the opposite of dry=wet 是湿的，和 dry 意思相反;foggy=foggy describes weather with thick cloud near the ground, not ground with no rain=foggy 形容雾天，不形容不下雨的地面;melt=melt means ice changing into water, not taking water away from clothes or hands=melt 是冰化成水，不是把衣服或手弄干;freeze=freeze means water becoming ice, not taking water away=freeze 是水结成冰，不是把水弄掉|dry your hands · hang the clothes to dry|y becomes ie: dries, dried|y 变 ie：dries、dried
    `,
  },
});

const space = vocabularyTopic({
  id: "a2-words-space",
  title: t("Space", "太空"),
  summary: t(
    "Space, stars, moons and planets; the world; light and dark; rockets and spaceships; sunrise; air; millions.",
    "太空、星星、卫星和行星；世界；光明和黑暗；火箭和宇宙飞船；日出；空气；百万。",
  ),
  intro: t(
    "On a clear night we lay in the garden and looked at the **moon**, the **stars** and one bright **planet**, and we talked about flying a **rocket** into **space**. These words help you talk about the sky, the planets and the world around us.",
    "一个晴朗的夜晚，我们躺在花园里看 **moon**（月亮）、**stars**（星星）和一颗明亮的 **planet**（行星），聊着坐 **rocket**（火箭）飞向 **space**（太空）。这些词帮你谈论天空、行星和我们周围的世界。",
  ),
  prerequisites: ["a2-words-weather-2"],
  words: [
    word(
      "space",
      "the area outside the earth, where the stars and planets are; room to put things",
      "太空；空间",
      "The rocket flew up through the air and out into {space}. | There's no {space} in my suitcase for these shoes. | From {space}, the earth looks blue.",
      "air world",
    ),
    word(
      "star stars",
      "a very far sun that you see as a small light in the sky at night",
      "星星",
      "Look at all the little {stars} shining in the sky tonight!|planets moons | The sun is a {star}. | At night, thousands of {stars} shine like small lights.|planets moons",
      "planet moon",
    ),
    word(
      "moon moons",
      "the round thing that goes around the earth and shines at night",
      "月亮；卫星",
      "The {moon} is full tonight. It's very bright. | People first walked on the {moon} in 1969. | Jupiter has many {moons}.|stars planets",
      "star planet",
    ),
    word(
      "planet planets",
      "a large round thing in space that goes around a star",
      "行星",
      "The earth is a {planet}. | Mars is called the red {planet}. | There are eight {planets} around our sun.|stars moons",
      "star moon",
    ),
    word(
      "world worlds",
      "the earth and all the people and places on it",
      "世界",
      "Mount Everest is the highest mountain in the {world}. | She wants to travel around the {world} and visit every country. | There are about two hundred countries in the {world}.",
      "space sky",
    ),
    word(
      "light lights",
      "what makes it possible to see; a lamp",
      "光；灯",
      "Plants need {light} from the sun and water to grow. | Turn off the {light} when you leave the room, so it's dark. | The {light} from the city lamps is beautiful at night.",
      "dark air",
    ),
    word(
      "dark darker darkest",
      "with little or no light",
      "黑暗的；深色的",
      "It gets {dark} early in winter, so we turn on the lights at five. | I'm scared of the {dark}, so I sleep with a lamp on. | She has {dark} brown hair, almost black.",
      "light bright",
    ),
    word(
      "rocket rockets",
      "a long thin machine that flies into space",
      "火箭",
      "The {rocket} took off with a loud noise. | China sent a {rocket} to the moon. | We made a small paper {rocket} in class.",
      "planet star",
    ),
    word(
      "spaceship spaceships",
      "a vehicle that carries people through space",
      "宇宙飞船",
      "In the film, a {spaceship} full of people from another planet lands in the desert. | The crew lived in the {spaceship} for six months. | Can a {spaceship} fly to another star?",
      "planet star",
    ),
    word(
      "sunrise sunrises",
      "the time in the morning when the sun comes up",
      "日出",
      "We got up early to watch the {sunrise}. | The farmers start work at {sunrise}, when the sun comes up. | The {sunrise} over the sea at six in the morning was beautiful.",
      "midnight evening",
    ),
    word(
      "air",
      "what you breathe; the space above the ground",
      "空气",
      "Open the window and let in some fresh {air}. | There is no {air} to breathe on the moon. | The bird flew up into the {air}.",
      "space light",
    ),
    word(
      "million millions",
      "1,000,000",
      "百万",
      "About ten {million} people live in this huge city: it's one of the biggest in the world. | The sun is about 150 {million} kilometers from the earth. | {Millions} of people all over the world watched the match on TV.|Thousands Hundreds",
      "thousand hundred",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Star*, *planet* and *moon* are all in the night sky: a *star* is a far sun that shines with its own light, a *planet* goes around a star, and a *moon* goes around a planet.",
        "*star*、*planet* 和 *moon* 都在夜空中：*star* 是远方自己发光的太阳，*planet* 绕着恒星转，*moon* 绕着行星转。",
      ),
      meaning: t(
        "*Space* has two meanings: the area outside the earth where the stars are, and room to put things, as in *no space in my suitcase*. *Air* is what you breathe, close to the ground.",
        "*space* 有两个意思：地球外面星星所在的太空；以及放东西的空间，如 *no space in my suitcase*。*air* 是我们呼吸的、靠近地面的空气。",
      ),
      spell: t(
        "*Spaceship* is space + ship, one word, and *million* has a double l: mil · lion.",
        "*spaceship* 是 space + ship，合成一个词；*million* 双写 l：mil · lion。",
      ),
    },
    notes: `
      space|a rocket out past the air;a full suitcase;the earth looking blue|space is outside the earth, or room to put things; air is what you breathe|space 是太空或空间；air 是呼吸的空气|air=air is what you breathe close to the earth, not the area far outside it or room in a suitcase=air 是地球表面附近我们呼吸的空气，不是地球外的太空，也不是箱子里的空间;world=world is the earth and the people on it, not the area outside the earth or room in a suitcase=world 是地球和上面的人，不是地球外的太空，也不是箱子里的空间|into space · no space for|-ace at the end, said like *ace*|结尾是 -ace，读作 *ace*
      star|many shining in tonight's sky;the sun;thousands of small lights at night|a star is a far sun that shines with its own light; a planet goes around a star|star 是自己发光的恒星；planet 绕恒星转|planet=planet goes around a star and has no light of its own, and there are only eight around our sun=planet 绕恒星转，自己不发光，绕太阳转的只有八颗;moon=moon goes around a planet, and our sky has only one of it=moon 绕行星转，我们的天上只有一个|the stars in the sky|-ar at the end|结尾是 -ar
      moon|a full bright one tonight;walking there in 1969;many around Jupiter|the moon goes around the earth; a star is a far sun|moon 绕地球转；star 是遥远的太阳|star=star is a far sun with its own light, not the round thing close to us that people walked on=star 是自己发光的遥远太阳，不是离我们很近、人类走上去过的圆球;planet=planet goes around the sun, not around the earth or around Jupiter=planet 绕太阳转，不绕地球或木星转|a full moon · on the moon|the double o: m-o-o-n|两个 o：m-o-o-n
      planet|the earth;Mars, the red one;eight around our sun|a planet goes around a star; a moon goes around a planet|planet 绕恒星转；moon 绕行星转|star=star is a far sun with its own light, not the earth or Mars=star 是自己发光的遥远太阳，不是地球或火星;moon=moon goes around a planet, not around the sun like the earth and Mars=moon 绕行星转，不像地球和火星那样绕太阳转|the red planet|plan + et, with a short a|plan + et，短元音 a
      world|the highest mountain;visiting every country;two hundred countries|the world is the earth and its people and places; space is outside it|world 是地球和上面的人与地方；space 是外面的太空|space=space is the area outside the earth, with no mountains or countries in it=space 是地球外面的太空，那里没有山，也没有国家;sky=sky is the space above you, with no mountains or countries in it=sky 是头顶的天空，那里没有山，也没有国家|in the world · around the world|or said like *er*: w-o-r-l-d|or 读作 *er*：w-o-r-l-d
      light|the sun helping plants;a room going dark;city lamps at night|light is what makes it possible to see, or a lamp; dark is no light|light 是光或灯；dark 是黑暗|dark=dark means little or no light, the opposite of light=dark 是没有光，和 light 意思相反;air=air is what you breathe, and you cannot see it or turn it off=air 是呼吸的空气，看不见，也不能关掉|turn off the light|a silent gh: l-i-g-h-t|gh 不发音：l-i-g-h-t
      dark|lights on at five in winter;sleeping with a lamp on;hair that is almost black|dark means with little or no light; light is the opposite|dark 是暗；light 意思相反|light=light means with a lot of light or pale in color, the opposite of dark=light 是明亮或浅色，和 dark 意思相反;bright=bright means full of light or strong in color, the opposite of dark=bright 是明亮或鲜艳，和 dark 意思相反|get dark · dark hair|ar, and -k at the end|ar 组合，结尾是 -k
      rocket|taking off with a loud noise;being sent to the moon;something made of paper in class|a rocket is a machine that flies into space; a planet is a large round thing in space|rocket 是飞向太空的机器；planet 是太空中的大球体|planet=planet is a huge round thing in space, which no one can send, make or see take off=planet 是太空中巨大的球体，没人能发射、制作，也不会起飞;star=star is a far sun, which no one can send, make or see take off=star 是遥远的太阳，没人能发射、制作，也不会起飞|send a rocket|ck before -et: rock · et|-et 前面是 ck：rock · et
      spaceship|people from another planet landing;a crew living inside;flying to another star|a spaceship carries people through space; a planet is a place in space|spaceship 载人穿越太空；planet 是太空中的星球|planet=planet is a huge round thing in space, not something people ride in or that lands=planet 是太空中巨大的球体，不是人乘坐的、会降落的东西;star=star is a far sun, not something people ride in=star 是遥远的太阳，不是人乘坐的东西|in a spaceship|space + ship, one word|space + ship，合成一个词
      sunrise|getting up early to watch;the sun coming up for farmers;six in the morning over the sea|sunrise is when the sun comes up; evening is the end of the day|sunrise 是日出；evening 是傍晚|midnight=midnight is twelve o'clock at night, when the sun is not up=midnight 是夜里十二点，那时没有太阳;evening=evening is the end of the day, not the early morning when the sun comes up=evening 是一天的末尾，不是太阳升起的清晨|watch the sunrise · at sunrise|sun + rise, one word|sun + rise，合成一个词
      air|a window and fresh breath;the moon having none to breathe;a bird flying up|air is what you breathe; space is outside the earth|air 是呼吸的空气；space 是地球外的太空|space=space is the area outside the earth, where there is nothing to breathe=space 是地球外面的太空，那里没有可呼吸的东西;light=light is what makes it possible to see, not what you breathe or fly in=light 让人看得见，不是呼吸的东西，也不是飞翔的地方|fresh air · into the air|air, said like *where*|air 读音和 *where* 押韵
      million|a huge city;the distance to the sun;people all over the world on TV|a million is 1,000,000; a thousand is 1,000|million 是一百万；thousand 是一千|thousand/thousands=thousand is only 1,000, too small for a huge city, the distance to the sun or the whole world=thousand 只是一千，对大城市、到太阳的距离或全世界来说太小;hundred/hundreds=hundred is only 100, much too small for a huge city, the sun or the whole world=hundred 只是一百，对大城市、太阳或全世界来说小得多|ten million · millions of people|the double l: mil · lion|双写 l：mil · lion
    `,
  },
});

const plants = vocabularyTopic({
  id: "a2-words-plants",
  title: t("Plants", "植物"),
  summary: t(
    "Seeds, roots, branches and bushes; roses and sunflowers; picking; nature and natural; rainbows; bamboo.",
    "种子、根、树枝和灌木；玫瑰和向日葵；采摘；大自然和自然的；彩虹；竹子。",
  ),
  intro: t(
    "In Grandma's garden, a tall **sunflower** stands next to the red **roses**, and birds sit on the **branches** of the apple tree, waiting for us to **pick** the fruit. These words help you name the parts of plants and talk about the natural world.",
    "奶奶的花园里，一株高高的 **sunflower**（向日葵）立在红 **roses**（玫瑰）旁边，鸟儿停在苹果树的 **branches**（树枝）上，等着我们 **pick**（摘）果子。这些词帮你说出植物的各个部分，谈论大自然。",
  ),
  prerequisites: ["a2-words-space"],
  words: [
    word(
      "seed seeds",
      "the small thing that a new plant grows from",
      "种子",
      "Plant the tiny {seeds} in spring, and new plants will grow from them.|roots branches | A sunflower {seed} is black and white. | Birds eat small {seeds} from the feeder in winter.|roots branches",
      "root branch",
    ),
    word(
      "root roots",
      "the part of a plant that grows under the ground",
      "根",
      "The {roots} of the tree go very deep under the ground.|seeds branches | Plants drink water through their {roots}.|seeds branches | This {root} is good to eat. It's a carrot!",
      "seed branch",
    ),
    word(
      "branch branches",
      "a part of a tree that grows out from the middle",
      "树枝",
      "A bird is sitting on the {branch}. | The wind broke some {branches} off the tree.|roots seeds | The monkey jumped from one {branch} to another.",
      "root seed",
    ),
    word(
      "bush bushes",
      "a plant like a small tree with many branches",
      "灌木",
      "The cat is hiding behind the {bush}. | There are rose {bushes} in front of the house.|seeds roots | We picked berries from the {bushes}.|seeds roots",
      "seed root",
    ),
    word(
      "rose roses",
      "a flower with a sweet smell and sharp parts on its stem",
      "玫瑰",
      "He gave her a red {rose} for her birthday. | {Roses} smell sweet, but be careful of the sharp parts on their stems.|Sunflowers Bamboos | My grandma grows red and pink {roses} in her garden.|sunflowers bamboos",
      "sunflower bamboo",
    ),
    word(
      "pick picks picked picking",
      "to take a flower or fruit from a plant; to choose",
      "采摘；挑选",
      "We {picked} apples from the trees and put them in baskets.|grew planted | Please don't {pick} the flowers in the park. | {Pick} a card, any card.",
      "grow plant",
    ),
    word(
      "nature",
      "all the plants, animals and things in the world that people did not make",
      "大自然",
      "I love walking in {nature}, among the trees, rivers and wild animals. | We watched a {nature} program about whales. | The leaves change color: {nature} is beautiful in autumn.",
      "world space",
      "natural",
    ),
    word(
      "natural",
      "made by nature, not by people",
      "自然的；天然的",
      "This juice is {natural}: it comes from fruit, and no sugar was added. | Is your hair color {natural}, or did you color it? | Floods and storms are {natural} problems that people do not cause.",
      "modern special",
      "nature",
    ),
    word(
      "rainbow rainbows",
      "a curve of colors in the sky after rain",
      "彩虹",
      "After the rain, there was a {rainbow} of colors in the sky. | A {rainbow} has seven colors. | Look! A double {rainbow} in the sky after the rain!",
      "sunflower sunrise",
    ),
    word(
      "sunflower sunflowers",
      "a very tall plant with a big yellow flower",
      "向日葵",
      "{Sunflowers} turn to face the sun.|Roses Rainbows | The {sunflower} in our garden is taller than my dad. | We eat {sunflower} seeds as a snack.",
      "rose rainbow",
    ),
    word(
      "bamboo bamboos",
      "a tall plant with hard hollow stems",
      "竹子",
      "Pandas eat {bamboo}.|roses bushes | These chopsticks are made of {bamboo}.|roses bushes | The {bamboo} in the park grows very quickly, and its tall stems are empty inside.",
      "rose bush",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Root*, *branch* and *seed* are parts of a plant: the *root* is under the ground and drinks water, a *branch* grows out from the middle of a tree, and a *seed* is the small thing a new plant grows from.",
        "*root*、*branch* 和 *seed* 都是植物的部分：*root* 长在地下、吸收水分，*branch* 从树干上长出来，*seed* 是长出新植物的小东西。",
      ),
      meaning: t(
        "*Nature* is a noun meaning all the plants, animals and things people did not make, and *natural* is the adjective: *natural juice* comes from fruit, with nothing added by people.",
        "*nature* 是名词，指人类没有制造的一切植物、动物和事物；*natural* 是形容词：*natural juice* 来自水果，没有人为添加的东西。",
      ),
      spell: t(
        "*Branch* and *bush* add -es in the plural: *branches*, *bushes*. *Bamboo* ends in a double o.",
        "*branch* 和 *bush* 的复数加 -es：*branches*、*bushes*。*bamboo* 结尾是两个 o。",
      ),
    },
    notes: `
      seed|new plants growing from tiny things;a sunflower;a bird feeder in winter|a seed is what a new plant grows from; a root is the part under the ground|seed 是长出新植物的种子；root 是地下的根|root/roots=root is the part of a plant under the ground, not the small thing a new plant grows from=root 是植物长在地下的部分，不是长出新植物的种子;branch/branches=branch is a part of a tree growing out from the middle, much too big for a bird feeder or a sunflower=branch 是从树干上长出来的部分，对鸟食盒或向日葵来说太大了|plant the seeds|the double e: s-e-e-d|两个 e：s-e-e-d
      root|deep under the ground;drinking water;a carrot|a root grows under the ground; a branch grows out from a tree|root 长在地下；branch 从树上长出|seed/seeds=seed is the small thing a new plant grows from, not the part that goes deep and drinks water=seed 是种子，不是扎得深、吸水的根;branch/branches=branch grows up in the air from a tree, not under the ground=branch 长在空中的树上，不在地下|the roots of a tree|oo said like long u: r-o-o-t|oo 读长元音 u：r-o-o-t
      branch|a bird sitting;wind breaking some off a tree;a monkey jumping|a branch grows out from the middle of a tree; a root is under the ground|branch 从树干上长出来；root 在地下|root/roots=root is the part of a plant under the ground, not a part growing out from a tree into the air=root 是植物在地下的部分，不是从树上伸向空中的部分;seed/seeds=seed is the small thing a new plant grows from, not a part growing out from a tree=seed 是长出新植物的种子，不是从树上长出来的部分|on the branch|-nch at the end, and -es for *branches*|结尾是 -nch，复数是 *branches*
      bush|a cat hiding;rose plants in front of a house;berries picked|a bush is a plant like a small tree; a seed is what plants grow from|bush 是像小树的灌木；seed 是种子|seed/seeds=seed is the small thing a new plant grows from, not a whole plant like a small tree=seed 是长出新植物的种子，不是像小树一样的整株植物;root/roots=root is the part of a plant under the ground, not a whole plant like a small tree=root 是植物在地下的部分，不是像小树一样的整株植物|behind the bush · rose bushes|u said like *oo* in *push*|u 和 *push* 里的一样
      rose|a red flower given as a gift;a sweet smell and sharp stems;red and pink flowers|a rose is a sweet flower with sharp parts; a sunflower is tall and yellow|rose 是有刺的香花；sunflower 又高又黄|sunflower/sunflowers=sunflower is a very tall yellow flower, not a red or pink flower with sharp parts on its stem=sunflower 是很高的黄花，不是茎上有刺的红花或粉花;bamboo/bamboos=bamboo is a tall plant with hard hollow stems and no sweet flowers=bamboo 是茎又硬又空的高大植物，没有香花|a red rose|o that says its name, and s said like z|o 读字母本音，s 读作 z
      pick|apples into baskets;flowers in a park;choosing a card|you pick fruit or flowers from a plant, or choose something; you grow a plant|pick 是摘或挑；grow 是种植、生长|grow/grew=grow means making a plant get bigger or getting bigger, not taking fruit or flowers off it or choosing=grow 是种植或生长，不是摘果子、摘花，也不是挑选;plant/planted=plant means putting seeds or plants in the ground, not taking fruit off or choosing a card=plant 是把种子或植物种进地里，不是摘果子，也不是挑牌|pick apples · pick a card|ck at the end|结尾是 ck
      nature|trees, rivers and wild animals;a program about whales;leaves changing color in autumn|nature is all the plants and animals people did not make; the world is the earth and all its people|nature 是大自然；world 是地球和所有的人|world=world is the earth with all its people, cities and countries, not only the plants and animals people did not make=world 是有人、城市和国家的地球，不只是人类没造的动植物;space=space is the area outside the earth, far from trees, whales and leaves=space 是地球外的太空，离树、鲸和树叶都很远|in nature · a nature program|-ture at the end, said like *cher*|结尾 -ture 读作 *cher*
      natural|juice from fruit with nothing added;hair color that is not dyed;floods and storms people do not cause|natural means made by nature, not by people; modern means new and of today|natural 是天然的；modern 是现代的|modern=modern means new and of today, not made by nature with nothing added by people=modern 是新式的、现在的，不是大自然造的、没有人为添加;special=special means different from usual and important, not made by nature=special 是与众不同、重要，不是大自然造的|natural juice · a natural problem|nature + -al, dropping the e|nature 去掉 e 加 -al
      rainbow|colors in the sky after rain;seven colors;a double one in the sky|a rainbow is a curve of colors after rain; a sunrise is when the sun comes up|rainbow 是雨后的彩虹；sunrise 是日出|sunflower=sunflower is a tall yellow plant in the ground, not a curve of colors in the sky=sunflower 是长在地上的高大黄花，不是天上的彩色弧线;sunrise=sunrise is the sun coming up in the morning, not a curve of seven colors after rain=sunrise 是早上太阳升起，不是雨后七种颜色的弧线|a rainbow in the sky|rain + bow, one word|rain + bow，合成一个词
      sunflower|turning to face the sun;taller than my dad;seeds as a snack|a sunflower is a very tall yellow plant; a rose is a smaller sweet flower|sunflower 是高大的黄花；rose 是较小的香花|rose/roses=rose is a red or pink flower with a sweet smell, not a very tall plant that turns to the sun or has seeds to eat=rose 是红色或粉色的香花，不是转向太阳、结可吃种子的高大植物;rainbow/rainbows=rainbow is colors in the sky, not a plant in a garden=rainbow 是天上的彩虹，不是园子里的植物|sunflower seeds|sun + flower, one word|sun + flower，合成一个词
      bamboo|pandas;chopsticks;tall stems that are empty inside|bamboo is a tall plant with hard hollow stems; a rose is a flower|bamboo 是茎中空的高大植物；rose 是花|rose/roses=rose is a sweet flower with soft petals, not food for pandas or hard wood for chopsticks=rose 是花瓣柔软的香花，不是熊猫的食物，也不能做筷子;bush/bushes=bush is a small plant with many branches, not one with tall hard hollow stems=bush 是枝条很多的矮小灌木，不是茎又高又硬又空的植物|made of bamboo|the double o at the end|结尾两个 o
    `,
  },
});

const littleWords3 = vocabularyTopic({
  id: "a2-words-little-words-3",
  title: t("Little Words 4", "小词 4"),
  summary: t(
    "Could, ever, even, still and else; around, across, through and along; above, below and without.",
    "could、ever、even、still 和 else；around、across、through 和 along；above、below 和 without。",
  ),
  intro: t(
    "We walked **along** the river, went **through** a dark forest and swam **across** a lake; it was **even** colder than we thought, but we were **still** smiling. These little words help you say where things go, when they happen and what is surprising.",
    "我们 **along**（沿着）河边走，**through**（穿过）一片幽暗的森林，又游 **across**（横渡）一个湖；天 **even**（甚至）比我们想的还冷，可我们 **still**（仍然）笑着。这些小词帮你说出东西往哪儿去、事情什么时候发生，以及什么让人吃惊。",
  ),
  prerequisites: ["a2-words-plants"],
  words: [
    word(
      "could couldn't",
      "the past of can; a polite way to ask",
      "能（can 的过去式）；可以",
      "When I was five, I {could} swim. | {Could} you open the window, please?|Must Should | We {couldn't} see the stars because of the clouds.|mustn't shouldn't",
      "must should",
    ),
    word(
      "ever",
      "at any time",
      "曾经；在任何时候",
      "Have you {ever} seen a whale? — Yes, once, in Canada. | Nothing {ever} happens in this quiet town, day after day. | It's the best film I've {ever} seen.",
      "never even",
    ),
    word(
      "even",
      "a word that shows something is surprising",
      "甚至",
      "It's so cold that it's {even} snowing in the south, where it never snows! | Everyone came, {even} my grandpa. | He doesn't {even} know my name.",
      "ever still",
    ),
    word(
      "still",
      "continuing until now",
      "仍然；还",
      "It's ten in the morning, and he is {still} in bed: he hasn't got up yet. | You ate two bowls of rice. Are you {still} hungry? | I {still} remember my first day at school, many years later.",
      "already even",
    ),
    word(
      "else",
      "other; more",
      "别的；其他",
      "Do you want anything {else}? | Everyone {else} has gone home, and I'm the only one here. | Let's go somewhere {else}. It's too crowded here.",
      "still even",
    ),
    word(
      "around",
      "in a circle; in different places",
      "围绕；到处",
      "The earth goes {around} the sun. | We walked {around} the lake in a big circle. | There were trees all {around} the house.",
      "across through",
    ),
    word(
      "across",
      "from one side to the other",
      "穿过；横过",
      "We swam {across} the river from one side to the other. | Look both ways before you walk {across} the road. | There is a bridge {across} the stream.",
      "through along",
    ),
    word(
      "through",
      "in at one side and out at the other",
      "穿过；通过",
      "The train went {through} a long tunnel. | We walked {through} the thick forest, in one side and out the other. | The cat came in {through} the window.",
      "across along",
    ),
    word(
      "along",
      "from one end toward the other end of something long",
      "沿着",
      "We walked {along} the beach, next to the water, for an hour. | There are shops all {along} the street. | Drive {along} this road for two kilometers.",
      "across through",
    ),
    word(
      "above",
      "higher than",
      "在……上方",
      "The plane flew high {above} the clouds, in the blue sky. | There's a picture on the wall {above} the bed. | It's very hot: the temperature is {above} thirty degrees.",
      "below under",
    ),
    word(
      "below",
      "lower than",
      "在……下方",
      "From the plane, we saw the city {below} us. | The temperature fell {below} zero, and the lake froze. | The sun went down {below} the hills, and it got dark.",
      "above over",
    ),
    word(
      "without",
      "not having; not with",
      "没有；不带",
      "I can't see {without} my glasses. | Plants die {without} water. | He left {without} saying goodbye.",
      "with along",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Across*, *through* and *along* all show a way: *across* goes from one side to the other, *through* goes in at one side and out at the other, and *along* follows something long, like a beach or a street.",
        "*across*、*through* 和 *along* 都表示路线：*across* 是从一边到另一边，*through* 是从一头进去、另一头出来，*along* 是顺着海滩、街道这类长长的东西走。",
      ),
      meaning: t(
        "*Still* and *even* are easy to mix up: *still* means something has not stopped yet, as in *still in bed*, and *even* shows that something is surprising, as in *even my grandpa came*.",
        "*still* 和 *even* 容易混：*still* 表示事情还没停，如 *still in bed*；*even* 表示出人意料，如 *even my grandpa came*。",
      ),
      spell: t(
        "*Could* has a silent l: c-o-u-l-d, and *through* ends in -ough said like *oo*: t-h-r-o-u-g-h.",
        "*could* 里的 l 不发音：c-o-u-l-d；*through* 以 -ough 结尾，读作 *oo*：t-h-r-o-u-g-h。",
      ),
    },
    notes: `
      could|swimming at five;opening a window politely;stars behind clouds|could is the past of can, or a polite way to ask; must says something has to be done|could 是 can 的过去式，或用来客气地请求；must 表示必须|must/mustn't=must says something has to be done now, so it does not tell what someone was able to do in the past or ask politely=must 表示现在必须做，不表示过去能做什么，也不用来客气地请求;should/shouldn't=should gives advice, so it does not tell what someone was able to do or ask politely for help=should 是给建议，不表示能做什么，也不用来客气地请人帮忙|Could you…? · couldn't see|a silent l: c-o-u-l-d|l 不发音：c-o-u-l-d
      ever|a whale once in Canada;a quiet town day after day;the best film|ever means at any time; never means at no time|ever 是在任何时候；never 是从不|never=never means at no time, so it does not fit a yes answer, *nothing* or *the best I've seen*=never 是从不，不配 yes 的回答，也不和 *nothing*、*the best I've seen* 连用;even=even shows something is surprising, not at any time=even 表示出人意料，不是在任何时候|Have you ever…? · the best I've ever seen|e · ver, with -er at the end|e · ver，结尾是 -er
      even|snow in the south;everyone including grandpa;not knowing a name|even shows that something is surprising; still means not stopped yet|even 表示出人意料；still 是仍然|ever=ever means at any time, as in *Have you ever…?*, not that something is surprising=ever 是在任何时候，如 *Have you ever…?*，不表示出人意料;still=still means something has not stopped yet, not that something is surprising=still 是还没停，不表示出人意料|even my grandpa · doesn't even know|e · ven, with e that says its name first|e · ven，第一个 e 读字母本音
      still|being in bed at ten in the morning;being hungry after two bowls;remembering many years later|still means something has not stopped yet; already means sooner than expected|still 是仍然；already 是已经|already=already means something happened sooner than expected, not that it has not stopped yet=already 是比预想的早就发生了，不是还没停;even=even shows that something is surprising, not that it goes on=even 表示出人意料，不是持续着|still in bed · still remember|the double l at the end|结尾双写 l
      else|wanting anything more;being the only one left;going to another place|else means other or more; still means not stopped yet|else 是别的、另外的；still 是仍然|still=still means something has not stopped yet, and it never comes after *anything*, *everyone* or *somewhere*=still 是仍然，不放在 *anything*、*everyone*、*somewhere* 后面;even=even shows that something is surprising, and it never comes after *anything*, *everyone* or *somewhere*=even 表示出人意料，不放在 *anything*、*everyone*、*somewhere* 后面|anything else · somewhere else|-se at the end, said like s|结尾 -se 读作 s
      around|the earth and the sun;a big circle round a lake;trees on every side of a house|around means in a circle or on every side; across means from one side to the other|around 是围绕；across 是从一边到另一边|across=across means from one side to the other, not in a circle or on every side=across 是从一边到另一边，不是绕圈或四周;through=through means in at one side and out at the other, not in a circle or on every side=through 是从一头进、另一头出，不是绕圈或四周|around the sun · all around|a · round, with ou as in *round*|a · round，ou 和 *round* 里的一样
      across|swimming from side to side;a road after looking both ways;a bridge over a stream|across means from one side to the other; along means following something long|across 是从一边到另一边；along 是沿着|through=through means in at one side and out at the other, as in a tunnel or a forest, not over a river or a road from side to side=through 是像穿过隧道或森林那样从一头进另一头出，不是横过河或马路;along=along means following something long from one end toward the other, not going from one side to the other=along 是沿着长长的东西走，不是从一边到另一边|walk across the road|a · cross, with the double s|a · cross，双写 s
      through|a long tunnel;in one side of a forest and out the other;a cat and a window|through means in at one side and out at the other; across means from one side to the other|through 是穿过；across 是横过|across=across means from one side to the other over something flat, not in at one side and out at the other=across 是在平面上从一边到另一边，不是从一头进另一头出;along=along means following something long, not going in at one side and out at the other=along 是沿着长东西走，不是从一头进另一头出|through a tunnel · through the window|-ough at the end, said like *oo*|结尾 -ough 读作 *oo*
      along|walking next to the water;shops by a long street;two kilometers of road|along means following something long; across means from one side to the other|along 是沿着；across 是横过|across=across means going from one side to the other, not following something long for a long way=across 是从一边到另一边，不是顺着长东西走很远;through=through means going in at one side and out at the other, not following something long=through 是从一头进另一头出，不是顺着长东西走|along the beach · all along the street|a · long, with a said like *uh*|a · long，a 读作 *uh*
      above|a plane high in the blue sky;a picture on the wall;a hot thirty degrees|above means higher than; below means lower than|above 是在……上方；below 是在……下方|below=below means lower than, the opposite of above=below 是在……下方，和 above 意思相反;under=under means lower than and often covered by something, the opposite of above=under 是在……下面，常被盖住，和 above 意思相反|above the clouds · above thirty degrees|a · bove, with o said like short u|a · bove，o 读短元音 u
      below|a city seen from a plane;a temperature under zero;the sun going down behind hills|below means lower than; above means higher than|below 是在……下方；above 是在……上方|above=above means higher than, the opposite of below=above 是在……上方，和 below 意思相反;over=over means higher than or covering, the opposite of below=over 是在……上方或覆盖，和 below 意思相反|below zero · below us|be · low, with -ow said like *oh*|be · low，-ow 读作 *oh*
      without|not seeing without glasses;plants and no water;leaving with no goodbye|without means not having; with means having|without 是没有；with 是有|with=with means having something, the opposite of without=with 是有、带着，和 without 意思相反;along=along means following something long, not not having something=along 是沿着，不是没有|without water · without saying goodbye|with + out, one word|with + out，合成一个词
    `,
  },
});

// The present perfect with ever and never.

/** experiences are a verb, its past simple, its past participle and the rest of the experience. */
const experiences: readonly (readonly [string, string, string, string])[] = [
  ["see", "saw", "seen", "a waterfall"],
  ["eat", "ate", "eaten", "raw fish"],
  ["swim", "swam", "swum", "in the ocean"],
  ["fly", "flew", "flown", "in a helicopter"],
  ["ride", "rode", "ridden", "a horse"],
  ["take", "took", "taken", "a night train"],
  ["write", "wrote", "written", "a poem"],
  ["be", "was", "been", "to a desert"],
  ["break", "broke", "broken", "a bone"],
  ["drink", "drank", "drunk", "coconut water"],
  ["climb", "climbed", "climbed", "a mountain"],
  ["sleep", "slept", "slept", "in a tent"],
  ["visit", "visited", "visited", "a cave"],
  ["meet", "met", "met", "a famous person"],
  ["win", "won", "won", "a prize"],
  ["do", "did", "done", "a bungee jump"],
  ["sing", "sang", "sung", "on a stage"],
  ["drive", "drove", "driven", "a car"],
  ["give", "gave", "given", "a speech"],
  ["fall", "fell", "fallen", "off a bike"],
  ["throw", "threw", "thrown", "a snowball"],
  ["wear", "wore", "worn", "a costume"],
  ["grow", "grew", "grown", "vegetables"],
  ["speak", "spoke", "spoken", "on the radio"],
  ["forget", "forgot", "forgotten", "a friend's birthday"],
];

/** ppSubjects are a subject, its form of have, the short form, and whether it keeps its capital inside a sentence. */
const ppSubjects: readonly (readonly [string, string, string, boolean])[] = [
  ["I", "have", "I've", true],
  ["You", "have", "You've", false],
  ["My brother", "has", "", false],
  ["We", "have", "We've", false],
  ["She", "has", "She's", false],
  ["My parents", "have", "", false],
  ["Tom", "has", "", true],
];

const irregular = experiences.filter(([, past, participle]) => past !== participle);

const participleFrames: readonly ((rest: string) => string)[] = [
  (rest) => `Have you ever ___ ${rest}?`,
  (rest) => `I have never ___ ${rest}.`,
  (rest) => `My sister has ___ ${rest} twice.`,
  (rest) => `She has never ___ ${rest}.`,
  (rest) => `Have your parents ever ___ ${rest}?`,
  (rest) => `We have ___ ${rest} once.`,
  (rest) => `Has Tom ever ___ ${rest}?`,
];

/** regularized is the -ed form a learner might give an irregular verb: swimmed, flied, rided. */
const regularized = (verb: string): string =>
  verb.endsWith("e")
    ? `${verb}d`
    : /[^aeiou]y$/u.test(verb)
      ? `${verb.slice(0, -1)}ied`
      : /^[^aeiou]*[aeiou][^aeiouwy]$/u.test(verb)
        ? `${verb}${verb.slice(-1)}ed`
        : `${verb}ed`;

const participleBank: readonly ChoiceItem[] = interleave(
  participleFrames.map((frame) =>
    irregular.map(
      ([verb, past, participle, rest]): ChoiceItem => [
        `${frame(rest)} (${verb})`,
        participle,
        verb === "be" ? [past, verb] : [past, verb, regularized(verb)],
      ],
    ),
  ),
);

const ppIn = (s: readonly [string, string, string, boolean]) => (s[3] ? s[0] : s[0].toLowerCase());
const other = (have: string) => (have === "have" ? "has" : "have");
const beFor = (subject: string) => (subject === "I" ? "am" : /^(My brother|She|Tom)$/u.test(subject) ? "is" : "are");

const ppRows = everyPair(ppSubjects, experiences);

const haveBank: readonly ChoiceItem[] = interleave([
  ppRows
    .filter((_, k) => k % 2 === 0)
    .map(([s, [, , participle, rest]]): ChoiceItem => [`${s[0]} ___ never ${participle} ${rest}.`, s[1], [other(s[1]), beFor(s[0])]]),
  ppRows
    .filter(([s], k) => k % 2 === 1 && s[0] !== "I" && s[0] !== "We")
    .map(([s, [, , participle, rest]]): ChoiceItem => {
      const have = s[0] === "You" ? "Have" : s[1] === "has" ? "Has" : "Have";
      return [`___ ${ppIn(s)} ever ${participle} ${rest}?`, have, [have === "Have" ? "Has" : "Have", "Did"]];
    }),
]);

const ppTypedBank: readonly TypedItem[] = everyPair(ppSubjects, experiences).flatMap(([s, [, past, participle, rest]], k): TypedItem[] => {
  if (k % 2 === 0) {
    const [subject, have, short] = s;
    const start = short ? `[${subject} ${have}|${short}]` : `${subject} ${have}`;
    return [
      {
        shown: `${subject} / never / ${experiences.find((e) => e[2] === participle)?.[0]} ${rest}`,
        accepted: [`${start} never ${participle} ${rest}.`],
        canonical: `${subject} ${have} never ${participle} ${rest}.`,
        wrong: [
          `${subject} ${other(have)} never ${participle} ${rest}.`,
          `${subject} ${have} never ${past === participle ? `${past}s` : past} ${rest}.`,
        ],
      },
    ];
  }
  if (s[0] === "I" || s[0] === "We") return [];
  const have = s[0] === "You" ? "Have" : s[1] === "has" ? "Has" : "Have";
  return [
    {
      shown: `${ppIn(s)} / ever / ${experiences.find((e) => e[2] === participle)?.[0]} ${rest}`,
      accepted: [`${have} ${ppIn(s)} ever ${participle} ${rest}?`],
      wrong: [`Did ${ppIn(s)} ever ${participle} ${rest}?`, `${have} ${ppIn(s)} ever ${past === participle ? `${past}s` : past} ${rest}?`],
    },
  ];
});

/** formsOf lists the three forms of a verb of the experiences, as see – saw – seen. */
const formsOf = (verb: string): string => {
  const found = experiences.find(([v]) => v === verb);
  return found ? `${found[0]} – ${found[1]} – ${found[2]}` : verb;
};

/** participleWhy explains the past participle in the gap of shown. */
const participleWhy = (right: string, shown: string): Text => {
  const verb = /\((\w+)\)$/u.exec(shown)?.[1] ?? "";
  return t(
    `*have* or *has* takes the past participle, and the past participle of *${verb}* is *${right}* (*${formsOf(verb)}*): ${fill(shown, right)}\n\n**Check.** Trace the three forms (*${formsOf(verb)}*): after *have/has*, always pick the third form (*${right}*).`,
    `*have* 或 *has* 后面用过去分词，*${verb}* 的过去分词是 *${right}*（*${formsOf(verb)}*）：${fill(shown, right)}\n\n**检验。** 默念三态（*${formsOf(verb)}*）：在 *have/has* 后面一律选第三个形式（*${right}*）。`,
  );
};

/** whyNotParticiple explains the past simple or the plain verb after have or has. */
const whyNotParticiple = (wrong: string, _right: string, _shown: string, position: number): Text =>
  position === 0
    ? t(
        `*${wrong}* is the past simple (second form), not the past participle needed after *have* or *has*.`,
        `*${wrong}* 是一般过去式（第二态），不是 *have* 或 *has* 后面需要的过去分词。`,
      )
    : position === 1
      ? t(
          `*${wrong}* is the plain base form, not the past participle needed after *have* or *has*.`,
          `*${wrong}* 是动词原形，不是 *have* 或 *has* 后面需要的过去分词。`,
        )
      : t(
          `*${wrong}* adds *-ed* like a regular verb, but this verb is irregular and has its own past participle.`,
          `*${wrong}* 像规则动词那样加了 *-ed*，可这个动词是不规则动词，有专门的过去分词。`,
        );

/** haveSubject is the subject of a gapped sentence with have or has. */
const haveSubject = (shown: string): string =>
  shown.startsWith("___") ? (/^___ (.+?) ever /u.exec(shown)?.[1] ?? "") : (shown.split(" ___")[0] ?? "");

/** haveRule says why a subject takes have or has. */
const haveRule = (have: string, subject: string): Text =>
  /^has$/iu.test(have)
    ? t(`*${subject}* is one person or thing, so it takes *has*`, `*${subject}* 是单个的人或物，所以用 *has*`)
    : t(
        `*${subject}* is *I*, *you*, *we*, *they* or more than one, so it takes *have*`,
        `*${subject}* 是 *I*、*you*、*we*、*they* 或多个人，所以用 *have*`,
      );

/** whyNotHave explains the wrong form of have, a form of be, or did. */
const whyNotHave = (wrong: string, _right: string, shown: string): Text => {
  if (wrong === "Did")
    return t(
      "*Did* asks in the past simple and takes a plain verb, not *ever* with a past participle.",
      "*Did* 用于一般过去时疑问句，后面接动词原形，不能搭配 *ever* 和过去分词。",
    );
  if (/^(am|is|are)$/u.test(wrong))
    return t(
      `*${wrong}* is a form of *be*. The present perfect is made with *have* or *has* plus the past participle.`,
      `*${wrong}* 是 *be* 动词的形式。现在完成时由 *have* 或 *has* 加过去分词构成。`,
    );
  const subject = haveSubject(shown);
  return t(
    `*${wrong}* does not agree with the subject *${subject}* in the present perfect.`,
    `*${wrong}* 与现在完成时的主语 *${subject}* 单复数不一致。`,
  );
};

const presentPerfectEverNever: TopicDef = {
  id: "present-perfect-with-ever-and-never",
  title: t("Have You Ever...?", "Have you ever...? 现在完成时谈经历"),
  summary: t(
    "Have you ever seen a waterfall? I have never climbed a mountain. Have with a past participle, for experiences at any time up to now.",
    "Have you ever seen a waterfall? I have never climbed a mountain. have 加过去分词，表示到现在为止的经历。",
  ),
  intro: t(
    "To ask about life experience without naming a specific time, English pairs *have / has* with the third form of the verb: *Have you ever slept in a tent?* *She has never flown on a plane.*",
    "不提具体时间、只问“有没有过某种经历”时，英语用 *have / has* 加动词第三态（过去分词）：*Have you ever slept in a tent?* *She has never flown on a plane.*",
  ),
  prerequisites: ["past-simple-irregular", "have-and-has"],
  encompasses: [
    { topic: "past-simple-irregular", weight: 0.3 },
    { topic: "have-and-has", weight: 0.2 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "participle",
      t("The past participle", "过去分词"),
      t(
        "The present perfect is *have* or *has* with the past participle. For regular verbs the past participle is the same as the past simple: *climbed*, *visited*. Many common verbs have their own third form:\n\n- *see – saw – seen*\n- *eat – ate – eaten*\n- *swim – swam – swum*\n- *fly – flew – flown*\n- *ride – rode – ridden*\n- *be – was – been*\n\n> **Watch out.** Do not use the past simple (second form) after *have/has* (*Have you ever saw a whale?* is wrong—use the third form, *seen*).",
        "现在完成时由 *have / has* 加过去分词构成。规则动词的过去分词和过去式一样：*climbed*、*visited*。很多常用动词有自己的第三态：\n\n- *see – saw – seen*\n- *eat – ate – eaten*\n- *swim – swam – swum*\n- *fly – flew – flown*\n- *ride – rode – ridden*\n- *be – was – been*\n\n> **注意。** 不要在 *have/has* 后面用一般过去式（第二态）：*Have you ever saw a whale?* 是错的，要用第三态 *seen*。",
      ),
      choiceGenerator(t("Choose the word for the gap.", "选出填入空白处的词。"), participleBank, participleWhy, whyNotParticiple),
    ),
    point(
      "have-has",
      t("Have or has", "have 还是 has"),
      t(
        "Use *has* with *he*, *she*, *it* and one person, and *have* with *I*, *you*, *we*, *they* and more than one: *My brother has never flown. My parents have never flown.*\n\nIn questions, *have* or *has* comes first: *Has Tom ever ridden a horse?* *ever* goes in questions (*at any time*); *never* goes in statements (*not at any time*).\n\n> **Watch out.** Never use *Did* or *am/is/are* to build a present-perfect sentence with a past participle (*Did you ever seen...?* is wrong).",
        "*he*、*she*、*it* 和单个人用 *has*；*I*、*you*、*we*、*they* 和多个人用 *have*：*My brother has never flown. My parents have never flown.*\n\n疑问句把 *have / has* 放在最前面：*Has Tom ever ridden a horse?* *ever*（曾经）用于疑问句，*never*（从未）用于陈述句。\n\n> **注意。** 不要用 *Did* 或 *am/is/are* 搭配过去分词（*Did you ever seen...?* 是错的），并核对主语该配 *have* 还是 *has*。",
      ),
      choiceGenerator(
        t("Choose the word for the gap.", "选出填入空白处的词。"),
        haveBank,
        (right, shown) => {
          const subject = haveSubject(shown);
          const rule = haveRule(right, subject);
          return t(
            `${rule.en}: ${fill(shown, right)}\n\n**Check.** Verify two clues: the past participle later in the sentence requires *have/has* (not *did* or *be*), and the subject *${subject}* pairs with *${right}*.`,
            `${rule["zh-CN"]}：${fill(shown, right)}\n\n**检验。** 核对两条线索：句中的过去分词要求用 *have/has*（不用 *did* 或 *be*），且主语 *${subject}* 搭配 *${right}*。`,
          );
        },
        whyNotHave,
      ),
    ),
    point(
      "write",
      t("Writing about experiences", "写经历"),
      t(
        "Write the sentence from the note. *never* makes a statement: *My brother has never ridden a horse.* *ever* makes a question: *Have you ever ridden a horse?* Use the past participle of the verb.\n\n> **Watch out.** Put *ever* or *never* right before the past participle (not at the end of the sentence), and match *have/has* to the subject.",
        "根据笔记写句子。有 *never* 就写陈述句：*My brother has never ridden a horse.* 有 *ever* 就写疑问句：*Have you ever ridden a horse?* 动词用过去分词。\n\n> **注意。** *ever* 或 *never* 放在过去分词前面（不要放到句末），同时核对 *have/has* 与主语一致。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Write a sentence from the note.", "根据笔记写一个句子。"),
        ppTypedBank,
        (right) => {
          const found = experiences.find(([, , participle, rest]) => right.includes(` ${participle} ${rest}`));
          const forms = found ? formsOf(found[0]) : "";
          return right.endsWith("?")
            ? t(
                `The note has *ever*, so it is a question: *Have* or *Has* first, then the subject, *ever* and the past participle (*${forms}*): ${right}\n\n**Check.** Confirm the order (*Have/Has* + subject + *ever* + past participle) and the closing question mark.`,
                `笔记里有 *ever*，所以写疑问句：先写 *Have* 或 *Has*，再写主语、*ever* 和过去分词（*${forms}*）：${right}\n\n**检验。** 核对语序（*Have/Has* + 主语 + *ever* + 过去分词）和句末问号。`,
              )
            : t(
                `The note has *never*, so it is a statement: the subject, *have* or *has*, *never* and the past participle (*${forms}*): ${right}\n\n**Check.** Confirm the order (subject + *have/has* + *never* + past participle) with no extra *not*.`,
                `笔记里有 *never*，所以写陈述句：主语、*have* 或 *has*、*never* 和过去分词（*${forms}*）：${right}\n\n**检验。** 核对语序（主语 + *have/has* + *never* + 过去分词），且没有多余的 *not*。`,
              );
        },
        presentPerfectWithEverAndNeverWriteNot,
      ),
    ),
  ],
};

/** been and the short forms of have are the word forms this topic teaches. */
const been: WordBatch = {
  topic: "present-perfect-with-ever-and-never",
  words: ["been", "i've", "you've", "we've", "they've"],
};

// Writing about an experience.

const experienceBank: readonly WritingItem[] = [
  {
    task: "Write about a time you have seen a waterfall or a big river.",
    model:
      "I have seen a big waterfall once. It was two years ago, on a trip to Guizhou with my family. We walked along a path through the woods for an hour. Then we heard a loud noise. Suddenly we saw the waterfall in front of us. It was huge, and the water was white. We walked behind it, and we got very wet! I have never forgotten that day.",
  },
  {
    task: "Write about a time you have climbed a mountain or a big hill.",
    model:
      "I have climbed a mountain only once. Last October, my dad and I climbed Mount Tai. We started at night because we wanted to see the sunrise from the top. The path was steep, and there were thousands of stone steps. My legs hurt, but I didn't stop. We reached the top at five in the morning. The sunrise was beautiful. I have never been so tired and so happy.",
  },
  {
    task: "Write about a time you have slept outside or in a tent.",
    model:
      "I have slept in a tent three times. The best time was last summer at a lake in the mountains. My cousins and I put up the tent near the water. In the evening we cooked fish on a fire. At night there was no light, so we could see millions of stars. Then a storm came, and there was thunder and lightning. We were scared, but the tent stayed dry.",
  },
  {
    task: "Write about a time you have swum in the sea, a lake or a river.",
    model:
      "I have swum in the sea many times, but one day was special. Last August we went to a small island. The water was clear and blue, and I could see fish below me. I swam along the coast with my mom. Suddenly a big turtle swam past us! It moved slowly and didn't look scared. I have never seen a turtle so close before.",
  },
  {
    task: "Write about a time you have seen snow or ice.",
    model:
      "I live in the south, so I have seen snow only once. It was last January, when we visited my aunt in Harbin. It was minus twenty degrees, and the river was frozen. We walked across the ice! We also saw huge ice statues in a park. At night, lights shone inside them in all the colors of the rainbow. I have never been so cold, but it was amazing.",
  },
  {
    task: "Write about a time you have seen a wild animal.",
    model:
      "Have you ever seen a wild fox? I have seen one. It was last spring, in the woods near my grandparents' village. I was walking along a path early in the morning. Suddenly a fox came out of the bushes. It had red fur and a long tail. It looked at me for a few seconds. Then it ran away through the trees. I didn't have time to take a photo.",
  },
  {
    task: "Write about a time you have planted something or grown a plant.",
    model:
      "I have grown sunflowers twice. Last year I planted ten seeds in our garden in April. I watered them every evening after school. After two weeks, small green plants came out of the ground. By August, the sunflowers were taller than my dad! Their big yellow flowers turned to the sun every day. In autumn we picked the seeds and ate them.",
  },
  {
    task: "Write about a time you have been in a storm.",
    model:
      "I have been in a big storm once. It was last summer, on a holiday by the sea. In the afternoon the sky became very dark. Then the wind started to blow hard, and it rained heavily. We ran back to the hotel. There was loud thunder and lightning all night, and the lights went out. In the morning the sun was shining again, and there were branches all over the beach.",
  },
  {
    task: "Write about a time you have watched the stars or the moon.",
    model:
      "I have watched the stars from the desert. Two years ago my family went on a trip to Inner Mongolia. We stayed in a tent far from the city. At night it was very dark, and the sky was full of stars. My dad showed me some planets. We even saw a shooting star! It was cold, so we drank hot milk. I have never seen so many stars.",
  },
  {
    task: "Write about a time you have visited a cave or a forest.",
    model:
      "I have visited a big cave once. Last winter we went to a famous cave in Guilin. A guide took us through it. Inside it was dark and wet, and the air was cool. There were strange rocks of every shape, with colored lights on them. One rock looked like an elephant! We walked for about an hour. I have never been in such a strange place.",
  },
  {
    task: "Write about a time you have seen a rainbow or a sunrise.",
    model:
      "I have seen a double rainbow once. It was last May, after a storm. My sister and I were looking out of the window. The rain stopped, and the sun came out. Suddenly we saw two rainbows above the hills. All the colors were very bright. We ran outside to take photos. A few minutes later the rainbows were gone. I have never seen one again.",
  },
  {
    task: "Write about something in nature that you have never done but want to do.",
    model:
      "I have never seen a whale, but I really want to. I have read many books about them. They are the biggest animals in the world, and they sing to each other. My uncle has seen whales near Iceland, and he showed me his photos. Someday I'm going to take a boat into the ocean to see them. I hope I will hear them sing.",
  },
];

const writingAboutAnExperience = judgedTopic({
  id: "writing-about-an-experience",
  title: t("Writing About an Experience", "写一次经历"),
  summary: t(
    "Write six to eight sentences about something you have done in nature: say that you have done it, then tell when and what happened.",
    "写六到八句话，讲你在大自然中做过的一件事：先说你做过，再讲是什么时候、发生了什么。",
  ),
  intro: t(
    "When you share a memorable experience, you open in the present perfect (*I have camped in the desert once*) and then zoom into the past simple for the story (*Two years ago we put up our tent...*). That tense shift tells the reader the story has begun.",
    "分享难忘经历时，先用现在完成时点题（*I have camped in the desert once*），再切到一般过去时讲细节（*Two years ago we put up our tent...*）。这种时态切换让读者立刻进入故事。",
  ),
  prerequisites: ["present-perfect-with-ever-and-never", "writing-about-your-weekend"],
  encompasses: [
    { topic: "present-perfect-with-ever-and-never", weight: 0.3 },
    { topic: "writing-about-your-weekend", weight: 0.3 },
  ],
  criteria: ["a2-present-perfect", "a2-past-simple", "a1-sentences"],
  point: {
    id: "experience",
    title: t("Have done, then what happened", "做过什么，然后发生了什么"),
    explanation: t(
      "Start with the present perfect to say that you have had the experience, at some time up to now: *I have seen a big waterfall once.*\n\nThen change to the past simple to tell when it was and what happened: *It was two years ago. We walked along a path. Suddenly we saw the waterfall.*\n\n> **Watch out.** Never pair a finished past time like *two years ago* or *last summer* with the present perfect (*I have seen it two years ago* is wrong—say *I saw it two years ago*).",
      "先用现在完成时说你有过这样的经历：*I have seen a big waterfall once.*\n\n然后改用一般过去时讲是什么时候、发生了什么：*It was two years ago. We walked along a path. Suddenly we saw the waterfall.*\n\n> **注意。** 现在完成时不能和 *two years ago*、*last summer* 这类明确的过去时间连用（*I have seen it two years ago* 是错的，要说 *I saw it two years ago*）。",
    ),
  },
  question: t(
    "Write six to eight sentences in English about the experience the task names: say that you have done it, then tell when and what happened.",
    "根据题目用英语写六到八句话：先说你做过这件事，再讲是什么时候、发生了什么。",
  ),
  bank: experienceBank,
  limits: { minWords: 45, maxChars: 900 },
  what: t("story", "记叙"),
});

/** topics are the topics of the unit The Natural World. */
export const topics: readonly TopicDef[] = [
  landscape.topic,
  weather2.topic,
  space.topic,
  plants.topic,
  littleWords3.topic,
  presentPerfectEverNever,
  writingAboutAnExperience,
];

/** vocabulary are the words the unit The Natural World teaches. */
export const vocabulary: readonly WordBatch[] = [landscape.batch, weather2.batch, space.batch, plants.batch, littleWords3.batch, been];
