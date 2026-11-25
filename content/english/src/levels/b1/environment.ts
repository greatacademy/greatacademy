// B1, unit 4: The Environment. Pollution and waste, living things, green living, damage and rescue, taking action,
// weather and climate, and materials. Its grammar and writing reuse the active and passive voice, choosing transitions
// and writing a paragraph.

import type { TopicDef } from "@ga/content";
import { t } from "@ga/content";
import type { WordBatch } from "../../pack.ts";
import { vocabularyTopic, word } from "../words.ts";

const environment = vocabularyTopic({
  id: "b1-words-environment",
  title: t("The Environment", "环境"),
  summary: t(
    "The environment, pollution and polluting; the climate, waste and trash; recycling and litter; global resources, fuel and coal.",
    "环境、污染和造成污染；气候、浪费和垃圾；回收和乱扔的垃圾；全球的资源、燃料和煤。",
  ),
  intro: t(
    "Factories **pollute** the river, people drop **litter** on the beach, and the **climate** keeps getting warmer, so we must **recycle** more and **waste** less. These words help you talk about the problems of the **environment** and what we can do about them.",
    "工厂 **pollute**（污染）河流，人们在海滩上乱扔 **litter**（垃圾），**climate**（气候）越来越暖，所以我们必须多 **recycle**（回收），少 **waste**（浪费）。这些词帮你谈论 **environment**（环境）问题以及我们能做些什么。",
  ),
  prerequisites: ["a2-words-landscape"],
  words: [
    word(
      "environment environments",
      "the air, water and land in which people, animals and plants live",
      "环境",
      "We must keep the air, rivers and forests clean and protect the {environment} for our children. | Plastic bags that end up in rivers and seas are bad for the {environment}. | Animals need a safe {environment} with clean water and land to live in.",
      "climate pollution",
    ),
    word(
      "pollution",
      "dirty or harmful things in the air, water or land",
      "污染",
      "Air {pollution} is a big problem in many cities. | Cars cause a lot of {pollution} that makes the air dirty. | The river is dying because of {pollution}: chemicals have made the water dirty and harmful.",
      "waste environment",
    ),
    word(
      "pollute pollutes polluted polluting",
      "to make air, water or land dirty and harmful",
      "污染",
      "Factories {pollute} the river with chemicals. | The sea is {polluted} with plastic and is dirty everywhere.|recycled wasted | Cars {pollute} the air we breathe with dirty smoke.",
      "recycle waste",
    ),
    word(
      "climate climates",
      "the usual weather of a place",
      "气候",
      "The {climate} here is hot and dry for most of the year, every year. | {Climate} change is making summers hotter.|Weather Environment | Bananas grow only where the {climate} is warm year after year.",
      "weather environment",
    ),
    word(
      "waste wastes wasted wasting",
      "to use more of something than you need; things that are thrown away",
      "浪费；废物",
      "Don't {waste} water. Turn off the tap. | Factories produce a lot of {waste} that they have to throw away.|fuel coal | You're {wasting} your time. He won't change his mind.|recycling polluting",
      "recycle pollute",
    ),
    word(
      "trash",
      "things that you throw away because you do not want them",
      "垃圾",
      "Please take out the {trash}. The bin is full. | We put old food in the {trash} because we don't have a garden. | Don't put glass in the {trash}. Recycle it.",
      "litter compost",
    ),
    word(
      "recycle recycles recycled recycling",
      "to use something again, or to make something new from it",
      "回收利用",
      "We {recycle} paper, glass and plastic so they can be made into new things. | This bag is made of {recycled} bottles.|polluted wasted | {Recycling} old cans saves energy, because making new metal uses more.|Polluting Wasting",
      "pollute waste",
    ),
    word(
      "litter litters",
      "paper, cans and other trash left on the ground in a public place",
      "（公共场所的）垃圾",
      "Please don't drop {litter} such as paper and cans in the park. | The streets were full of {litter}: cans and papers people had dropped after the match. | There's a fine for leaving {litter} such as bottles on the beach.",
      "fuel smoke",
    ),
    word(
      "global",
      "of the whole world",
      "全球的",
      "Pollution is a {global} problem that affects every country in the world. | {Global} temperatures all over the world are rising. | The company has {global} customers in sixty countries.",
      "local national",
    ),
    word(
      "resource resources",
      "something useful that a country or a person has, such as water, oil or money",
      "资源",
      "Water is a precious {resource} that every country needs. | The country is rich in natural {resources} like oil and gold.|fuels environments | We must use our {resources}, such as water, forests and money, carefully.|fuels environments",
      "fuel environment",
    ),
    word(
      "fuel fuels",
      "something that is burned to make heat or power, such as oil, gas or wood",
      "燃料",
      "Cars use a lot of {fuel}. | Wood was the first {fuel} people burned to keep warm. | The car ran out of {fuel}, so we stopped at a gas station.",
      "coal energy",
    ),
    word(
      "coal",
      "a hard black stone that is burned to make heat",
      "煤",
      "Old steam trains ran on {coal}, which men threw into the fire with shovels. | Burning black {coal} from the mines pollutes the air. | This power station burns {coal} dug from the mine nearby.",
      "oil gas",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Trash* and *litter* are both things thrown away, but *trash* goes in a bin or the kitchen, and *litter* is what people drop on the ground in public places. Ask where the thing is: in a bin, or on a street, beach or park.",
        "*trash* 和 *litter* 都是丢弃的东西，但 *trash* 是放进垃圾桶或厨房里的，*litter* 是人们在公共场所乱扔在地上的。想想东西在哪儿：在垃圾桶里，还是在街上、海滩、公园里。",
      ),
      meaning: t(
        "*Climate* is not today's weather: it is the usual weather of a place over many years. Check whether the meaning talks about one day or a long time.",
        "*climate* 不是今天的天气，而是一个地方多年来的通常天气。看清释义说的是一天，还是很长的时间。",
      ),
      spell: t(
        "*Environment* hides an n before -ment: envi-**ron**-ment, and *pollute* has a double l.",
        "*environment* 在 -ment 前藏着一个 n：envi-**ron**-ment；*pollute* 里 l 双写。",
      ),
    },
    notes: `
      environment|clean air, rivers and forests for our children;plastic bags in rivers and seas;clean water and land for animals|the environment is the air, water and land around us; the climate is the usual weather|environment 是周围的空气、水和土地；climate 是通常的天气|climate=climate is the usual weather of a place, not the air, water and land that living things share=climate 是一个地方通常的天气，不是生物共享的空气、水和土地;pollution=pollution is the dirt that harms the air and water, not the world we protect=pollution 是危害空气和水的脏东西，不是要保护的世界|en · vi · ron · ment|-ron- before -ment, with an n|-ment 前有 -ron-，别漏 n
      pollution|dirty air in cities;dirty air from cars;chemicals in a river|pollution is harmful dirt in air, water or land; waste is things thrown away|pollution 是污染；waste 是废物|waste=waste is things that are thrown away, not the harm that makes air and water dirty=waste 是扔掉的东西，不是让空气和水变脏的危害;environment=environment is the air, water and land we live in, not the dirt that harms them=environment 是我们生活的空气、水和土地，不是危害它们的脏东西|pol · lu · tion|double l; no plural|双写 l；没有复数
      pollute|chemicals in a river;plastic in the sea;dirty smoke in the air|to pollute is to make air, water or land dirty; to recycle is to use things again|pollute 是污染；recycle 是回收|recycle/recycled=recycle means to make something new from old things, not to make the air or water dirty=recycle 是回收再造，不是让空气或水变脏;waste/wasted=waste means to use too much of something, not to make it dirty and harmful=waste 是浪费，不是使之变脏有害|pol · lute|pollute something with something|pollute A with B
      climate|hot, dry weather every year;climate change and hotter summers;warm weather year after year|climate is the usual weather over many years; weather is what it is like today|climate 是长期的气候；weather 是当天的天气|weather/Weather=weather is what the sky is like today or this week, not the usual pattern over many years=weather 是今天或这几天的天气，不是多年的规律;environment/Environment=environment is the air, water and land, not the usual weather=environment 是空气、水和土地，不是通常的天气|cli · mate|-ate at the end, said like *it*; climate change|结尾 -ate 读作 *it*
      waste|water from the tap;things factories throw away;time spent for nothing|to waste is to use more than you need; waste is things thrown away|waste 是浪费或废物|recycle/recycling=recycle means to use old things again, the opposite of using too much=recycle 是回收再用，正好和浪费相反;pollute/polluting=pollute means to make dirty, not to use more than you need=pollute 是弄脏，不是用得太多;fuel=fuel is something burned for power, not things thrown away=fuel 是燃烧取能的东西，不是扔掉的东西;coal=coal is a black stone burned for heat, not things thrown away=coal 是烧来取暖的黑石头，不是扔掉的东西|waste|waste time · waste money; *waist* is the middle of your body|*waist* 是“腰”
      trash|a full bin to take out;old food with no garden;glass that should be recycled|trash goes in a bin; litter is dropped on the ground|trash 放进垃圾桶；litter 是扔在地上的|litter=litter is trash dropped on the ground in a public place, not what you put in the kitchen bin=litter 是扔在公共场所地上的垃圾，不是放进厨房垃圾桶的;compost=compost is plant waste that rots in a garden to feed soil, not trash in a bin=compost 是在花园里腐烂肥土的堆肥，不是桶里的垃圾|trash|American English; British English says *rubbish*|美式说法；英式说 *rubbish*
      recycle|paper, glass and plastic made into new things;a bag made of old bottles;cans that save energy|to recycle is to make something new from old things; to reuse is to use the same thing again|recycle 是回收再造；reuse 是重复使用|pollute/polluted/Polluting=pollute means to make dirty, not to make new things from old ones=pollute 是弄脏，不是旧物再造;waste/wasted/Wasting=waste means to use too much, the opposite of making new things from old ones=waste 是浪费，正好和旧物再造相反|re · cy · cle|re- + cycle; y said like *eye*|re- 加 cycle；y 读作 *eye*
      litter|paper and cans in the park;cans and papers dropped after a match;bottles left on the beach|litter is trash left on the ground in public places; trash is anything thrown away|litter 是公共场所地上的垃圾；trash 是扔掉的东西|fuel=fuel is something burned for heat or power, not cans and papers dropped on the ground=fuel 是燃烧取能的东西，不是丢在地上的罐子和纸;smoke=smoke is gray gas from a fire, not trash on the ground=smoke 是火冒出的灰色烟，不是地上的垃圾|lit · ter|double t; no plural for trash: some litter|双写 t；指垃圾时不用复数
      global|a problem for every country;temperatures all over the world;customers in sixty countries|global means of the whole world; local means of one small area|global 是全球的；local 是本地的|local=local means of one small area, the opposite of the whole world=local 是本地的，正好和全世界相反;national=national means of one country, not the whole world=national 是一国的，不是全世界的|glob · al|globe + -al|globe 去 e 加 -al
      resource|water every country needs;oil and gold;water, forests and money used carefully|a resource is something useful a country or person has; fuel is only what you burn|resource 是资源；fuel 只是燃料|fuel/fuels=fuel is something you burn for power, not water, gold or money=fuel 是燃烧取能的东西，不是水、金子或钱;environment/environments=environment is the world around us, not one useful thing we own and use=environment 是周围的世界，不是拥有并使用的某样东西|re · source|natural resources; usually plural|natural resources，常用复数
      fuel|what cars use a lot of;wood burned to keep warm;a stop at a gas station|fuel is anything burned for heat or power; coal is one kind of fuel|fuel 是燃料；coal 是其中一种|coal=coal is one black stone, not wood or what a car runs on=coal 是一种黑石头，不是木头或汽车用的燃料;energy=energy is the power you get, not the thing you burn to get it=energy 是得到的能量，不是为得到能量而烧的东西|fu · el|run out of fuel|run out of fuel 是“燃料用完”
      coal|shovels feeding old steam trains;black stones from the mines;a power station by the mine|coal is a black stone burned for heat; oil is a thick liquid|coal 是煤；oil 是油|oil=oil is a thick liquid, not hard black stones from a mine=oil 是浓稠的液体，不是矿里挖出的黑石头;gas=gas is like air, not hard black stones you can hold=gas 是像空气一样的气体，不是能拿在手里的黑石头|coal|no plural: a lot of coal, a piece of coal|没有复数：a piece of coal
    `,
  },
});

const living = vocabularyTopic({
  id: "b1-words-nature-2",
  title: t("Living Things", "生物"),
  summary: t(
    "Species, habitats and wildlife; rainforests and coral; extinct and endangered animals; ecosystems and creatures; floods, droughts and wildfires.",
    "物种、栖息地和野生动物；雨林和珊瑚；灭绝和濒危的动物；生态系统和生物；洪水、干旱和野火。",
  ),
  intro: t(
    "The **rainforest** is a rich **habitat** for **wildlife**, but **floods**, **droughts** and **wildfires** put many **endangered** **species** at risk of becoming **extinct**. These words help you talk about living things in nature and the dangers they face.",
    "**rainforest**（雨林）是 **wildlife**（野生动植物）丰富的 **habitat**（栖息地），但 **floods**（洪水）、**droughts**（干旱）和 **wildfires**（野火）让许多 **endangered**（濒危的）**species**（物种）面临 **extinct**（灭绝）的危险。这些词帮你谈论大自然中的生物和它们面临的危险。",
  ),
  prerequisites: ["a2-words-wildlife"],
  words: [
    word(
      "species",
      "a group of animals or plants of the same kind",
      "物种",
      "There are more than 10,000 {species}, or kinds, of birds.|creatures habitats | This {species} of frog, a kind with red eyes, lives only in one forest. | Many {species} of animals and plants are in danger of dying out.|creatures habitats",
      "creature habitat",
    ),
    word(
      "habitat habitats",
      "the natural home of an animal or a plant",
      "栖息地",
      "The panda's {habitat}, where it lives, is the bamboo forest. | Many animals are losing their {habitats}, the places where they live.|species ecosystems | Polar bears need a home on the ice: their {habitat} is the Arctic.",
      "species ecosystem",
    ),
    word(
      "wildlife",
      "animals and plants that live in nature",
      "野生动植物",
      "The national park is full of {wildlife}: deer, eagles and bears. | Pollution harms {wildlife} such as birds and fish. | We watched a TV program about African {wildlife} such as lions and elephants.",
      "nature energy",
    ),
    word(
      "rainforest rainforests",
      "a thick forest in a hot place where it rains a lot",
      "雨林",
      "The Amazon {rainforest} is home to millions of species. | {Rainforests} are being cut down for farmland.|Deserts Oceans | Monkeys swing from tree to tree in the {rainforest}.",
      "desert ocean",
    ),
    word(
      "coral corals",
      "a hard, colorful thing in warm seas, made by very small sea animals",
      "珊瑚",
      "Many fish live among the bright {coral}, built by tiny sea animals. | Warm water is killing the {coral} reefs. | The divers swam over bright {corals} that were alive and colorful.|rocks seaweeds",
      "rock seaweed",
    ),
    word(
      "extinct",
      "(of a kind of animal or plant) no longer living anywhere",
      "灭绝的",
      "Dinosaurs have been {extinct} for 66 million years. | The bird became {extinct} in 1900. Nobody has seen one since. | If we don't protect tigers, they may become {extinct} and disappear forever.",
      "endangered wild",
    ),
    word(
      "endangered",
      "(of a kind of animal or plant) in danger of disappearing from the world",
      "濒危的",
      "Pandas are {endangered}: only a few thousand still live in the wild. | There are only a few hundred of these {endangered} gorillas left, so they could soon die out. | This {endangered} turtle is protected by law so that it does not die out.",
      "extinct wild",
    ),
    word(
      "ecosystem ecosystems",
      "all the plants and animals in an area and how they live together",
      "生态系统",
      "A lake is a small {ecosystem}, where fish, plants and insects all depend on each other. | Plastic is damaging ocean {ecosystems}, where every living thing depends on the others.|habitats environments | Every animal has a place in the {ecosystem}, and all of them depend on each other.",
      "habitat environment",
    ),
    word(
      "creature creatures",
      "any living thing that can move, such as an animal or an insect",
      "生物；动物",
      "The octopus is a strange {creature} that moves with eight arms. | Many tiny {creatures} live in the soil.|species plants | Sea {creatures} swim into plastic bags and get caught.|species plants",
      "species plant",
    ),
    word(
      "flood floods",
      "a lot of water that covers land that is usually dry",
      "洪水",
      "The {flood} water destroyed hundreds of homes. | After days of rain, there were {floods} in the south.|droughts wildfires | The town was under water after the {flood}.",
      "drought wildfire",
    ),
    word(
      "drought droughts",
      "a long time with little or no rain",
      "干旱",
      "The plants died in the {drought}, because no rain fell for months. | Farmers lost their crops because of the {drought}: it hadn't rained all summer. | {Droughts} are becoming more common in this area, and the rivers are drying up.|Floods Wildfires",
      "flood wildfire",
    ),
    word(
      "wildfire wildfires",
      "a fire that spreads quickly through forests or grassland",
      "野火",
      "The {wildfire} burned for two weeks. | Hot, dry weather makes {wildfires} that burn through forests more likely.|floods droughts | Firefighters fought the {wildfire} with water from planes.",
      "flood drought",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        '*Extinct* and *endangered* are two steps in one story: an *endangered* animal is still alive but in danger, and an *extinct* one is gone forever. Look for words such as "only a few left" or "nobody has seen one since".',
        "*extinct* 和 *endangered* 是同一个过程的两个阶段：*endangered* 的动物还活着但处境危险，*extinct* 的已经永远消失了。留意 “only a few left” 或 “nobody has seen one since” 这样的词。",
      ),
      meaning: t(
        "A *habitat* and an *ecosystem* are both about nature, but a *habitat* is the home of one animal or plant, and an *ecosystem* is all the living things of an area together. Check whether the meaning is about one kind's home or everything living together.",
        "*habitat* 和 *ecosystem* 都和自然有关，但 *habitat* 是某种动植物的家，*ecosystem* 是一个地区所有生物组成的整体。看清释义说的是某一种的家，还是所有生物共同生活。",
      ),
      spell: t(
        "*Species* is the same for one and many: one species, two species. *Drought* ends in -ought but rhymes with *out*.",
        "*species* 单复数同形：one species, two species。*drought* 以 -ought 结尾，却和 *out* 押韵。",
      ),
    },
    notes: `
      species|10,000 kinds of birds;a kind of frog with red eyes;animals and plants dying out|a species is a group of living things of one kind; a creature is one living animal|species 是物种；creature 是一只动物|creature/creatures=creature is one living animal, not a whole kind or group=creature 是一只动物，不是一整个种类;habitat/habitats=habitat is the home where animals live, not a kind of animal=habitat 是动物生活的家，不是动物的种类|spe · cies|same form for one and many: one species, two species|单复数同形
      habitat|the bamboo forest where pandas live;places where animals live;the Arctic for polar bears|a habitat is the natural home of an animal; a species is a kind of animal|habitat 是栖息地；species 是物种|species=species is a kind of animal, not the place where it lives=species 是动物的种类，不是它生活的地方;ecosystem/ecosystems=ecosystem is all the living things of an area together, not one animal's home=ecosystem 是一个地区所有生物的整体，不是某种动物的家|hab · i · tat|-tat at the end; *habit* is something you do often|结尾是 -tat；*habit* 是“习惯”
      wildlife|deer, eagles and bears in a park;birds and fish;lions and elephants in Africa|wildlife is animals and plants living in nature; nature is everything not made by people|wildlife 是野生动植物；nature 是大自然|nature=nature is everything not made by people, such as hills and rivers, not only the animals and plants=nature 是山川河流等一切非人造的东西，不只是动植物;energy=energy is power for work or heat, not animals and plants=energy 是能量，不是动植物|wild · life|wild + life, no plural|wild 加 life，没有复数
      rainforest|the Amazon with millions of species;forests cut down for farmland;monkeys swinging from tree to tree|a rainforest is a thick, wet forest; a desert is a dry place with few plants|rainforest 是湿润茂密的雨林；desert 是干燥少植物的地方|desert/Deserts=desert is a dry place with sand and few plants, not a thick forest full of trees=desert 是少植物的干燥沙地，不是茂密的森林;ocean/Oceans=ocean is a huge area of sea, not a forest on land=ocean 是大海，不是陆地上的森林|rain · for · est|rain + forest, one word|rain 加 forest，写成一个词
      coral|fish among bright sea-animal homes;warm water killing reefs;divers over living, colorful reefs|coral is built by tiny sea animals and is alive; rock is just hard stone|coral 是小海洋动物造的、活的；rock 只是石头|rock/rocks=rock is hard stone that was never alive, not something built by tiny sea animals=rock 是从未活过的石头，不是小海洋动物造的;seaweed/seaweeds=seaweed is a soft plant that moves in the water, not a hard colorful thing built by animals=seaweed 是在水里摆动的软植物，不是动物造的硬珊瑚|cor · al|coral reef · coral reefs|coral reef 是“珊瑚礁”
      extinct|dinosaurs gone for 66 million years;a bird nobody has seen since 1900;tigers disappearing forever|extinct means gone forever; endangered means still alive but in danger|extinct 是已灭绝；endangered 是濒危|endangered=endangered means still alive but in danger, not gone forever=endangered 是还活着但处境危险，不是永远消失;wild=wild means living in nature, not gone forever=wild 是野生的，不是永远消失|ex · tinct|become extinct · the noun is *extinction*|become extinct；名词 *extinction*
      endangered|a few thousand pandas in the wild;a few hundred gorillas left;a turtle protected by law|endangered means in danger of dying out; extinct means already gone|endangered 是濒危；extinct 是已灭绝|extinct=extinct means already gone forever, not still alive with a few left=extinct 是已经永远消失，不是还剩一些;wild=wild means living free in nature, not in danger of disappearing=wild 是野生自由的，不是面临消失|en · dan · gered|en- + danger + -ed|en- 加 danger 加 -ed
      ecosystem|fish, plants and insects in a lake;ocean life where everything depends on everything;every animal with a place|an ecosystem is all the living things of an area together; a habitat is one animal's home|ecosystem 是生态系统；habitat 是栖息地|habitat/habitats=habitat is the home of one kind of animal, not all living things depending on each other=habitat 是某种动物的家，不是相互依存的所有生物;environment/environments=environment is the air, water and land, not living things and how they depend on each other=environment 是空气、水和土地，不是生物之间的相互依存|e · co · sys · tem|eco- + system; y said like *i*|eco- 加 system
      creature|an octopus moving with eight arms;tiny living things in the soil;sea animals caught in bags|a creature is any living thing that can move; a species is a whole kind|creature 是能动的生物；species 是一个物种|species=species is a whole kind of living thing, not one animal that moves=species 是一整个物种，不是一只会动的动物;plant/plants=plant is a living thing that cannot move, such as a tree=plant 是不能移动的生物，比如树|crea · ture|-ture at the end, said like *cher*|结尾 -ture 读作 *cher*
      flood|water that destroyed hundreds of homes;days of rain in the south;a town under water|a flood is a lot of water on dry land; a drought is a long time without rain|flood 是洪水；drought 是干旱|drought/droughts=drought is a long time with no rain, the opposite of too much water=drought 是长期不下雨，正好和水太多相反;wildfire/wildfires=wildfire is a fire spreading through forests, not water covering the land=wildfire 是在森林中蔓延的火，不是淹没土地的水|flood|oo said like *u* in *mud*|oo 读作 *mud* 里的 u
      drought|months with no rain;a summer without rain;rivers drying up|a drought is a long time with little or no rain; a flood is too much water|drought 是干旱；flood 是洪水|flood/Floods=flood is too much water covering the land, the opposite of no rain=flood 是水淹土地，正好和不下雨相反;wildfire/Wildfires=wildfire is a fire in a forest, not a long time with no rain=wildfire 是森林里的火，不是长期不下雨|drought|-ought said like *out*|-ought 读作 *out*
      wildfire|two weeks of burning;fires through forests in hot weather;water from planes|a wildfire is a fire that spreads through forests or grass; a drought is dry weather that can cause one|wildfire 是野火；drought 是干旱|flood/floods=flood is water covering the land, not fire spreading through forests=flood 是洪水淹地，不是蔓延的火;drought/droughts=drought is a long time with no rain, not a fire that burns=drought 是长期不下雨，不是燃烧的火|wild · fire|wild + fire, one word|wild 加 fire，写成一个词
    `,
  },
});

const green = vocabularyTopic({
  id: "b1-words-green-living",
  title: t("Green Living", "绿色生活"),
  summary: t(
    "Solar and renewable energy, and electricity; bins and containers; reusing; carbon, emissions and gas; footprints; sustainable ways and compost.",
    "太阳能、可再生能源和电；垃圾桶和容器；再利用；碳、排放和气体；足迹；可持续的方式和堆肥。",
  ),
  intro: t(
    "We put **solar** panels on the roof, **reuse** every **container**, make **compost** from old food and try to cut our carbon **footprint**. These words help you talk about living in a way that is kind to the planet.",
    "我们在屋顶装了 **solar**（太阳能）板，**reuse**（重复使用）每一个 **container**（容器），用剩饭菜做 **compost**（堆肥），努力减少碳 **footprint**（足迹）。这些词帮你谈论对地球友好的生活方式。",
  ),
  prerequisites: ["b1-words-environment"],
  words: [
    word(
      "solar",
      "of or from the sun",
      "太阳的",
      "Our house has {solar} panels on the roof that turn sunlight into power. | {Solar} energy, which comes from the sun, is clean and free. | The {solar} system has eight planets.",
      "renewable sustainable",
    ),
    word(
      "renewable",
      "(of energy) coming from the sun, the wind or water, which never runs out",
      "可再生的",
      "Wind and sun are {renewable} sources of energy that never run out. | Coal is not {renewable}. One day it will run out. | The country gets half its electricity from {renewable} energy such as wind, water and sun.",
      "sustainable solar",
    ),
    word(
      "electricity",
      "the power that makes lights and machines work",
      "电",
      "Turn off the lights to save {electricity}. | The storm cut off the {electricity}, so the lights and the fridge didn't work for two days. | Solar panels make {electricity} from sunlight.",
      "gas fuel",
    ),
    word(
      "bin bins",
      "a container for trash",
      "垃圾桶",
      "Put your empty bottles in the recycling {bin} outside, which is emptied every week. | The trash {bins} are emptied every Monday by the trash truck.|containers composts | That's trash: throw it in the {bin}, please.",
      "container compost",
    ),
    word(
      "container containers",
      "a box, bottle or other thing for keeping something in",
      "容器",
      "Keep the rice in a plastic {container} with a lid so it stays dry. | We take our own {containers} to the shop and fill them with food to avoid packaging.|bins composts | This {container} holds two liters of water.",
      "bin compost",
    ),
    word(
      "reuse reuses reused reusing",
      "to use something again",
      "重新使用",
      "{Reuse} your shopping bags: take the same ones back to the shop next time.|Recycle Waste | We {reused} old jam jars, just as they were, to store our pens.|recycled wasted | Instead of throwing away bottles, try {reusing} them as vases or pen holders.|recycling wasting",
      "recycle waste",
    ),
    word(
      "carbon",
      "a chemical found in coal and in all living things; carbon dioxide is a gas that warms the planet",
      "碳",
      "Planes produce a lot of {carbon} dioxide. | Trees take {carbon} out of the air and store it in their wood.|oxygen gases | The city wants to cut its {carbon} emissions by half.",
      "oxygen gas",
    ),
    word(
      "emission emissions",
      "gas or other things sent out into the air",
      "排放；排放物",
      "Cars send carbon {emissions} out of their pipes.|footprints bins | The new law limits the gas {emissions} that factories send into the air.|footprints bins | We must reduce the {emissions} of gas that we send into the air to slow climate change.|footprints bins",
      "footprint bin",
    ),
    word(
      "gas gases",
      "something like air that is not solid or liquid; gas burned for cooking and heating",
      "气体；燃气",
      "Oxygen is a {gas} that we breathe in. | We cook on a stove that burns {gas} from a pipe. | Some {gases} in the air trap heat like a blanket.|liquids coals",
      "liquid coal",
    ),
    word(
      "footprint footprints",
      "a mark left by a foot; (carbon footprint) the amount of carbon that a person's way of life sends into the air",
      "脚印；（碳）足迹",
      "There were {footprints} in the snow where someone had walked.|emissions bins | Flying less is the best way to reduce your carbon {footprint}. | The thief left a muddy {footprint} on the floor.",
      "emission bin",
    ),
    word(
      "sustainable",
      "able to continue for a long time without harming the environment",
      "可持续的",
      "We need {sustainable} ways of farming. | Is this fish from {sustainable} sources that will not run out of fish? | Cycling is a {sustainable} way to travel that we can keep up for years without harm.",
      "renewable toxic",
    ),
    word(
      "compost composts",
      "dead plants and food waste that rot and are used to feed soil",
      "堆肥",
      "We put our vegetable waste on the {compost}, where it rots into food for the soil. | Fruit and vegetable waste makes good {compost}. | My grandma uses {compost} in her garden to feed her plants.",
      "bin landfill",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Reuse* and *recycle* both save things from the trash, but you *reuse* a thing as it is, like a jar for pens, and you *recycle* it so that it is made into something new. Ask whether the thing stays the same or becomes something new.",
        "*reuse* 和 *recycle* 都能让东西免于扔掉，但 *reuse* 是原样再用，比如拿罐子放笔；*recycle* 是回收后再造成新东西。想想东西是保持原样，还是变成新的。",
      ),
      meaning: t(
        "*Renewable* and *sustainable* are close: *renewable* energy comes from the sun, wind or water and never runs out, and *sustainable* means a way of doing things that can go on for a long time without harm. Check whether the meaning is about energy that never runs out.",
        "*renewable* 和 *sustainable* 很接近：*renewable* 指来自太阳、风、水、永不枯竭的能源；*sustainable* 指能长期进行而不造成危害的做法。看清释义说的是不是永不枯竭的能源。",
      ),
      spell: t(
        "*Electricity* ends in -city, said like *sity*, and *emission* has a double s: e-mi-**ss**-ion.",
        "*electricity* 以 -city 结尾，读作 *sity*；*emission* 里 s 双写：e-mi-**ss**-ion。",
      ),
    },
    notes: `
      solar|panels turning sunlight into power;energy from the sun;eight planets around the sun|solar means of or from the sun; renewable means it never runs out|solar 是太阳的；renewable 是可再生的|renewable=renewable means energy that never runs out, from wind or water too, not only of the sun=renewable 是永不枯竭的能源，也包括风和水，不只是太阳;sustainable=sustainable means able to go on without harm, not of or from the sun=sustainable 是能长期持续而无害，不是“太阳的”|so · lar|-ar at the end: solar energy · solar system|结尾是 -ar
      renewable|wind and sun that never run out;coal that will run out one day;wind, water and sun for electricity|renewable energy never runs out; solar energy comes only from the sun|renewable 能源永不枯竭；solar 只来自太阳|sustainable=sustainable is a way of doing things that can go on, not the energy itself that never runs out=sustainable 是能长期进行的做法，不是永不枯竭的能源本身;solar=solar means only from the sun, not from wind and water too=solar 只来自太阳，不包括风和水|re · new · a · ble|renew + -able|renew 加 -able
      electricity|lights turned off to save it;lights and fridge not working after a storm;power from sunlight|electricity is the power that makes lights and machines work; gas is burned for heat|electricity 是电；gas 是燃气|gas=gas is burned for cooking and heat, not the power that makes lights and fridges work=gas 是用来做饭取暖的燃气，不是让灯和冰箱运转的电;fuel=fuel is something burned for power, not the power that comes out of solar panels=fuel 是燃烧的燃料，不是太阳能板发出的电|e · lec · tric · i · ty|electric + -ity; c said like *s*|electric 加 -ity，c 读作 *s*
      bin|bottles in a recycling container emptied every week;a trash truck every Monday;something to throw away|a bin is for trash; a container is for keeping things|bin 是垃圾桶；container 是装东西的容器|container/containers=container is for keeping things such as food, not for throwing trash away=container 是保存食物等东西的，不是扔垃圾的;compost/composts=compost is rotting plant waste for the garden, not a thing you throw trash into=compost 是园子里腐烂的植物废料，不是扔垃圾的桶|bin|a recycling bin · a trash bin · the bins|recycling bin 是“回收箱”
      container|rice kept dry with a lid;food at the shop without packaging;two liters of water|a container is for keeping things in; a bin is for trash|container 是容器；bin 是垃圾桶|bin/bins=bin is for trash you throw away, not for keeping food in=bin 是扔垃圾的，不是保存食物的;compost/composts=compost is rotting plant waste, not something you keep food in=compost 是腐烂的植物废料，不是存放食物的东西|con · tain · er|contain + -er|contain 加 -er
      reuse|the same bags back to the shop;jam jars kept as they were for pens;bottles used as vases|to reuse is to use the same thing again; to recycle is to make it into something new|reuse 是原样再用；recycle 是回收再造|recycle/Recycle/recycled/recycling=recycle means to make old things into new ones, not to use the same thing again as it is=recycle 是把旧物再造成新东西，不是原样再用;waste/Waste/wasted/wasting=waste means to use too much or throw away, the opposite of using again=waste 是浪费、扔掉，正好和再用相反|re · use|re- + use, said *ree-YOOZ*|re- 加 use
      carbon|carbon dioxide from planes;what trees store in their wood;a city's emissions|carbon is a chemical in coal and living things; oxygen is the gas we breathe|carbon 是碳；oxygen 是氧气|oxygen=oxygen is the gas we breathe in, not what trees take out of the air and store=oxygen 是我们吸入的气体，不是树从空气中吸收储存的东西;gas/gases=gas is anything like air, not the one chemical that trees store in wood=gas 是像空气一样的东西，不是树储存在木头里的那种元素|car · bon|carbon dioxide · carbon footprint|carbon dioxide 是二氧化碳
      emission|gas out of car pipes;gas factories send into the air;gas we send into the air|an emission is gas sent out into the air; a footprint is the total your life sends out|emission 是排放物；footprint 是总量足迹|footprint/footprints=footprint is the total carbon a person's life causes, not the gas that comes out of a pipe=footprint 是一个人生活造成的碳总量，不是管子里排出的气体;bin/bins=bin is a container for trash, not gas in the air=bin 是垃圾桶，不是空气中的气体|e · mis · sion|emit + -ssion|emit 变 emission，双写 s
      gas|oxygen that we breathe in;a stove fed from a pipe;heat trapped in the air|a gas is like air, not solid or liquid; coal is a solid stone|gas 是气体；coal 是固体的煤|liquid/liquids=liquid is something like water that you can pour, not something like air=liquid 是能倒的液体，不是像空气的东西;coal/coals=coal is hard black stone, not something like air that we breathe or that comes through a pipe=coal 是坚硬的黑石头，不是像空气那样能呼吸或通过管道输送的东西|gas|gases in British English, gasses also in American English|复数 gases
      footprint|marks in the snow;a carbon footprint from flying;a muddy mark on the floor|a footprint is a mark left by a foot, or the carbon a person's life causes|footprint 是脚印或碳足迹|emission/emissions=emission is gas sent into the air, not a mark left by a foot=emission 是排放的气体，不是脚留下的印子;bin/bins=bin is a container for trash, not a mark on the ground=bin 是垃圾桶，不是地上的印子|foot · print|carbon footprint · leave footprints|carbon footprint 是“碳足迹”
      sustainable|ways of farming;fish that will not run out;years of travel without harm|sustainable means able to go on for a long time without harm; toxic means poisonous|sustainable 是可持续的；toxic 是有毒的|renewable=renewable is energy that never runs out, not a way of farming or travel that goes on without harm=renewable 是永不枯竭的能源，不是无害持续的耕种或出行方式;toxic=toxic means poisonous, the opposite of not harming the environment=toxic 是有毒的，正好和不伤害环境相反|sus · tain · a · ble|sustain + -able|sustain 加 -able
      compost|vegetable waste rotting into soil food;fruit and vegetable waste;grandma's garden plants|compost is rotting plant waste that feeds soil; a landfill is where trash is buried|compost 是堆肥；landfill 是垃圾填埋场|bin=bin is a container for trash, not rotting waste that feeds soil=bin 是垃圾桶，不是喂养土壤的腐烂废物;landfill=landfill is a place where trash is buried, not food for garden plants=landfill 是填埋垃圾的地方，不是园子植物的养料|com · post|*compost* is not a *post*; stress on *COM*|重音在 *COM*
    `,
  },
});

const change = vocabularyTopic({
  id: "b1-words-change",
  title: t("Damage and Rescue", "破坏和救援"),
  summary: t(
    "Rising, appearing, disappearing and decreasing; destroying, burning and spreading; threats, crises and disasters; impact; surviving and rescuing.",
    "上升、出现、消失和减少；摧毁、燃烧和蔓延；威胁、危机和灾难；冲击；幸存和救援。",
  ),
  intro: t(
    "As temperatures **rise**, forests **burn**, ice **disappears** and floods **destroy** towns; the climate **crisis** is a **threat** to us all, but people still work to **rescue** what they can. These words help you talk about how the world changes and the dangers that come with it.",
    "随着气温 **rise**（上升），森林 **burn**（燃烧），冰川 **disappears**（消失），洪水 **destroy**（摧毁）城镇；气候 **crisis**（危机）是对所有人的 **threat**（威胁），但人们仍在努力 **rescue**（营救）能救的一切。这些词帮你谈论世界的变化和随之而来的危险。",
  ),
  prerequisites: ["b1-words-environment"],
  words: [
    word(
      "rise rises risen rising",
      "to go up; to increase",
      "上升；升起",
      "The sun {rises} in the east.|falls drops | Sea levels are {rising} higher every year because the ice is melting.|falling dropping | Prices have {risen} by ten percent this year, so everything costs more.|fallen dropped",
      "fall drop",
    ),
    word(
      "disappear disappears disappeared disappearing",
      "to stop being seen; to stop existing",
      "消失",
      "The sun {disappeared} behind a cloud, and it got dark.|appeared grew | Many forests are {disappearing} as people cut down the trees.|appearing growing | My keys have {disappeared}. Have you seen them?|appeared grown",
      "appear grow",
    ),
    word(
      "destroy destroys destroyed destroying",
      "to damage something so badly that it cannot be used or repaired",
      "摧毁；破坏",
      "The earthquake {destroyed} the old bridge so badly that nothing was left.|rescued built | Pollution is {destroying} the coral reefs, and soon nothing will be left of them.|rescuing building | The fire {destroyed} everything in the house.|rescued built",
      "rescue build",
    ),
    word(
      "burn burns burned burning",
      "to be on fire; to damage or destroy with fire",
      "燃烧；烧毁",
      "The forest {burned} for a week, and the smoke could be seen from far away.|melted destroyed | Don't touch the hot oven. You'll {burn} your hand! | {Burning} coal in a fire releases carbon.|Melting Destroying",
      "melt destroy",
    ),
    word(
      "spread spreads spreading",
      "to move to more places or people",
      "传播；蔓延",
      "The fire {spread} quickly through the dry forest.|rose disappeared | Wash your hands to stop germs from {spreading}.|rising disappearing | News {spreads} fast on the internet, from one person to thousands.|rises disappears",
      "rise disappear",
    ),
    word(
      "decrease decreases decreased decreasing",
      "to become less or smaller",
      "减少；降低",
      "The number of tigers has {decreased} a lot: there are far fewer than before.|risen increased | Prices {decrease} after the holidays, so things get cheaper. | Our energy use is {decreasing} every year, as we use less and less.|rising increasing",
      "rise increase",
    ),
    word(
      "threat threats",
      "something that might cause harm",
      "威胁",
      "Pollution is a {threat} to wildlife that might harm many animals. | Climate change is the biggest {threat} to the planet: it could cause great harm in the future. | Rising seas are a {threat} to coastal towns that could one day flood them.",
      "crisis disaster",
    ),
    word(
      "crisis crises",
      "a very difficult or dangerous time",
      "危机",
      "The country is in an economic {crisis}, a difficult time when many people have lost their jobs. | Leaders met to talk about the climate {crisis}. | The government has dealt with many {crises}, long and difficult times for the country.|disasters threats",
      "disaster threat",
    ),
    word(
      "disaster disasters",
      "something terrible that causes a lot of damage, such as a flood or an earthquake",
      "灾难",
      "The earthquake was a terrible {disaster} that destroyed the city. | Natural {disasters} such as floods and earthquakes kill thousands of people every year.|crises threats | The party was a {disaster}. Nobody came!",
      "crisis threat",
    ),
    word(
      "impact impacts",
      "a strong effect",
      "影响；冲击",
      "Plastic has a terrible {impact} on sea life. | What is the {impact} of tourism on the island? | We studied the {impacts} that climate change has already had.|threats crises",
      "threat crisis",
    ),
    word(
      "survive survives survived surviving",
      "to stay alive after something dangerous",
      "幸存；存活",
      "Only two people {survived} the crash.|rescued disappeared | Camels can {survive} and stay alive for days without water. | Very few trees {survived} the fire.|rescued disappeared",
      "rescue disappear",
    ),
    word(
      "rescue rescues rescued rescuing",
      "to save someone or something from danger",
      "营救；救援",
      "Firefighters {rescued} a family from the burning house.|survived destroyed | The boat's crew was {rescued} by a helicopter after two days at sea.|survived destroyed | They work to {rescue} animals from the floods.",
      "survive destroy",
    ),
    word(
      "appear appears appeared appearing",
      "to start to be seen; to seem",
      "出现；似乎",
      "The sun {appeared} from behind the clouds.|disappeared happened | A strange man suddenly {appeared} at the door, and we all saw him.|disappeared happened | She {appears} to be happy in her new job: she smiles all the time.|disappears happens",
      "disappear happen",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        '*Threat* and *disaster* both bring bad news, but a *threat* is harm that might come later, and a *disaster* is harm that has already happened. Look for "might", "could" or "one day", or for damage that is already done.',
        "*threat* 和 *disaster* 都是坏消息，但 *threat* 是将来可能出现的危害，*disaster* 是已经发生的灾难。留意 “might”“could”“one day”，还是已经造成的破坏。",
      ),
      meaning: t(
        "*Survive* and *rescue* are often mixed up: you *survive* when you stay alive yourself, and you *rescue* someone else by saving them. Check whether the meaning is staying alive or saving another person.",
        "*survive* 和 *rescue* 常被混淆：*survive* 是自己活了下来，*rescue* 是救出别人。看清释义说的是自己存活，还是救别人。",
      ),
      spell: t(
        "*Rise* is irregular: rise, rose, **risen**, with a single s; and *crisis* becomes *crises* for more than one, with -es said like *eez*.",
        "*rise* 是不规则动词：rise, rose, **risen**，只有一个 s；*crisis* 的复数是 *crises*，-es 读作 *eez*。",
      ),
    },
    notes: `
      rise|the sun in the east;sea levels as the ice melts;prices that make everything cost more|to rise is to go up; to fall is to go down|rise 是上升；fall 是下降|fall/falls/falling/fallen=fall means to go down, the opposite of going up=fall 是下降，正好和上升相反;drop/drops/dropping/dropped=drop means to go down or let something fall, not to go up=drop 是下降或掉落，不是上升|rise|rise, rose, risen; *raise* is to lift something up|rise, rose, risen；*raise* 是“举起”
      disappear|the sun behind a cloud;forests where trees are cut down;keys nobody can find|to disappear is to stop being seen or stop existing; to appear is to start being seen|disappear 是消失；appear 是出现|appear/appeared/appearing=appear means to start to be seen, the opposite of stopping being seen=appear 是出现，正好和消失相反;grow/grew/growing/grown=grow means to get bigger, not to stop being seen=grow 是变大，不是消失|dis · ap · pear|dis- + appear: one s, double p|dis- 加 appear：一个 s，双写 p
      destroy|an old bridge with nothing left;coral reefs with nothing left soon;everything in the house|to destroy is to damage something so badly it cannot be repaired; to build is to make it|destroy 是摧毁；build 是建造|rescue/rescued/rescuing=rescue means to save from danger, not to damage something badly=rescue 是救出，不是严重损坏;build/built/building=build means to make something, the opposite of damaging it so nothing is left=build 是建造，正好和摧毁相反|de · stroy|destroy, destroyed: oy keeps the y|oy 保留 y
      burn|a forest with smoke seen from far;a hand on a hot oven;coal in a fire|to burn is to be on fire or hurt with fire; to melt is to turn into liquid with heat|burn 是燃烧、烧伤；melt 是融化|melt/melted/Melting=melt means to turn into liquid with heat, like ice, not to be on fire=melt 是受热化成液体，像冰那样，不是着火;destroy/destroyed/Destroying=destroy means to damage badly in any way, not to be on fire=destroy 是以任何方式严重损坏，不一定是着火|burn|burned or burnt|过去式 burned 或 burnt
      spread|fire through a dry forest;germs stopped by washing hands;news from one person to thousands|to spread is to move to more places or people; to rise is to go up|spread 是蔓延、传播；rise 是上升|rise/rose/rising/rises=rise means to go up, not to move to more places=rise 是上升，不是向更多地方扩散;disappear/disappeared/disappearing/disappears=disappear means to stop being seen, not to reach more places=disappear 是消失，不是传到更多地方|spread|spread, spread, spread: the same in every form|spread 三种形式相同
      decrease|far fewer tigers than before;cheaper things after the holidays;less and less energy every year|to decrease is to become less; to increase is to become more|decrease 是减少；increase 是增加|rise/risen/rising=rise means to go up, the opposite of becoming less=rise 是上升，正好和减少相反;increase/increased/increasing=increase means to become more, the opposite of becoming less=increase 是增加，正好和减少相反|de · crease|de- + crease; *increase* is the opposite|de- 加 crease；反义词 *increase*
      threat|harm that might come to many animals;great harm in the future;seas that could one day flood towns|a threat is harm that might come; a disaster is harm that has already happened|threat 是可能的危害；disaster 是已发生的灾难|crisis=crisis is a difficult time that is happening now, not harm that might come later=crisis 是正在经历的困难时期，不是将来可能的危害;disaster=disaster is terrible damage that has already happened, not something that might happen=disaster 是已经发生的严重破坏，不是可能发生的事|threat|th said as in *think*, ea said like *e*|th 读 *think* 的音，ea 读短 e
      crisis|lost jobs in a difficult time;climate leaders meeting;long and difficult times for a country|a crisis is a difficult or dangerous time; a disaster is one terrible event|crisis 是危机时期；disaster 是一次灾难|disaster/disasters=disaster is one terrible event such as an earthquake, not a long difficult time=disaster 是一次可怕的事件，比如地震，不是一段漫长的困难时期;threat/threats=threat is harm that might come, not a difficult time already here=threat 是可能到来的危害，不是已经到来的困难时期|cri · sis|one crisis, two crises|单数 crisis，复数 crises
      disaster|an earthquake that destroyed a city;floods and earthquakes;a party nobody came to|a disaster is a terrible event that causes damage; a threat is something that might cause harm|disaster 是灾难；threat 是威胁|crisis/crises=crisis is a long difficult time, not one event such as an earthquake=crisis 是漫长的困难时期，不是地震这样的一次事件;threat/threats=threat is harm that might happen, not damage that has already happened=threat 是可能的危害，不是已经造成的破坏|dis · as · ter|-er at the end; natural disasters|结尾是 -er
      impact|plastic and sea life;tourism on the island;climate change already felt|an impact is a strong effect; a threat is something that might cause harm|impact 是强烈的影响；threat 是威胁|threat/threats=threat is something that might cause harm later, not an effect something has had=threat 是将来可能的危害，不是已经产生的影响;crisis/crises=crisis is a difficult time, not the effect one thing has on another=crisis 是困难时期，不是一件事对另一件事的影响|im · pact|have an impact on something|have an impact on…，用 on
      survive|two people from a crash;camels without water;trees after a fire|to survive is to stay alive yourself; to rescue is to save someone else|survive 是幸存；rescue 是救别人|rescue/rescued=rescue means to save someone else from danger, not to stay alive yourself=rescue 是救出别人，不是自己活下来;disappear/disappeared=disappear means to stop being seen, not to stay alive=disappear 是消失，不是活下来|sur · vive|survive something, with no *from*|survive sth，不加 from
      rescue|a family from a burning house;a crew taken by helicopter;animals from floods|to rescue is to save someone from danger; to survive is to stay alive yourself|rescue 是营救；survive 是幸存|survive/survived=survive means to stay alive yourself, not to save someone else=survive 是自己活下来，不是救别人;destroy/destroyed=destroy means to damage badly, the opposite of saving=destroy 是摧毁，正好和拯救相反|res · cue|rescue someone from something|rescue sb from…
      appear|the sun from behind the clouds;a strange man seen at the door;a smiling worker in a new job|to appear is to start to be seen or to seem; to disappear is to stop being seen|appear 是出现或似乎；disappear 是消失|disappear/disappeared/disappears=disappear means to stop being seen, the opposite of starting to be seen=disappear 是消失，正好和出现相反;happen/happened/happens=happen means to take place, not to be seen or to seem=happen 是发生，不是出现或似乎|ap · pear|double p; appear to be…|双写 p；appear to be…
    `,
  },
});

const action = vocabularyTopic({
  id: "b1-words-taking-action",
  title: t("Taking Action", "采取行动"),
  summary: t(
    "Campaigns, protests and petitions; governments and bans; encouraging and persuading; the public and the community; awareness, responsibility and action.",
    "运动、抗议和请愿；政府和禁令；鼓励和说服；公众和社区；意识、责任和行动。",
  ),
  intro: t(
    "Our **community** started a **campaign**: we wrote a **petition**, held a **protest** and **persuaded** the **government** to **ban** plastic bags. These words help you talk about how people work together to change things.",
    "我们 **community**（社区）发起了一场 **campaign**（运动）：我们写了 **petition**（请愿书），举行了 **protest**（抗议），并 **persuaded**（说服）**government**（政府）**ban**（禁止）塑料袋。这些词帮你谈论人们怎样一起努力改变现状。",
  ),
  prerequisites: ["a2-words-community-actions"],
  words: [
    word(
      "campaign campaigns",
      "a planned set of activities to reach a goal, such as changing a law",
      "运动；宣传活动",
      "The students started a {campaign} of posters, talks and meetings to save the old park. | The {campaign} against plastic bags, with months of planned events, was a big success. | She has run several {campaigns} for clean water, each planned over many months.|protests petitions",
      "protest petition",
    ),
    word(
      "protest protests protested protesting",
      "to say or show strongly that you do not agree with something; a public event that does this",
      "抗议",
      "Thousands of people {protested} in the streets against the new airport.|encouraged persuaded | There was a noisy {protest} outside the town hall, with people shouting and holding signs.|petition ban | They are {protesting} in the streets about the cuts to schools.|encouraging persuading",
      "encourage persuade",
    ),
    word(
      "petition petitions",
      "a written request signed by many people, asking someone in power to do something",
      "请愿书",
      "Over 5,000 people signed the {petition}. | We sent a {petition} with 300 names on it to the mayor, asking for a new bike path. | Online {petitions} are easy to start: people just add their names.|campaigns protests",
      "campaign protest",
    ),
    word(
      "government governments",
      "the group of people who rule a country",
      "政府",
      "The {government} of the country has promised to plant a million trees. | The {government} of Kenya has made a law that bans plastic bags. | The {government} plans to build more schools across the country.",
      "community public",
    ),
    word(
      "ban bans banned banning",
      "to say officially that something must not be done or used; an order that does this",
      "禁止；禁令",
      "The city {banned} cars from the center, so now people must walk or cycle.|encouraged allowed | Smoking is {banned} in restaurants: you can get a fine for it.|encouraged allowed | There's a {ban} on fishing in this lake, so nobody may fish here.|protest petition",
      "encourage allow",
    ),
    word(
      "encourage encourages encouraged encouraging",
      "to give someone the confidence to do something; to make something more likely",
      "鼓励",
      "My teacher {encouraged} me to enter the competition and told me I could win.|persuaded banned | The city {encourages} people to use public transport with cheap tickets.|persuades bans | Low prices {encourage} people to buy more and make it more likely that they will.|persuade ban",
      "persuade ban",
    ),
    word(
      "persuade persuades persuaded persuading",
      "to make someone agree to do something by giving reasons",
      "说服",
      "After an hour of good reasons, I {persuaded} my parents to let me go to the concert, though they had said no.|encouraged banned | Can you {persuade} him to come with us? Give him a good reason. | She's trying to {persuade} the school to stop using plastic cups by explaining the harm they do.",
      "encourage ban",
    ),
    word(
      "public",
      "for everyone; people in general",
      "公共的；公众",
      "The library is open to the {public}: anyone can go in. | Take {public} transport, such as buses and trains, instead of driving. | The park is a {public} place where everyone may go.",
      "community government",
    ),
    word(
      "community communities",
      "the people who live in one area, or who share something",
      "社区；群体",
      "The whole {community}, all the people on our island, helped to clean the beach. | We have a strong {community} in our street: neighbors help each other. | A small {community} of people in the mountain villages was cut off by the floods.",
      "public government",
    ),
    word(
      "awareness",
      "knowing about something and thinking it is important",
      "意识；认识",
      "The campaign raised {awareness} of plastic in the ocean. | There is little {awareness} of the problem: most people don't even know about it. | Public {awareness} of climate change is growing: more people know about it.",
      "responsibility action",
    ),
    word(
      "responsibility responsibilities",
      "something that it is your job or your duty to do",
      "责任",
      "It's everyone's {responsibility} to look after the planet. | Taking care of a pet is a big {responsibility}: it's your job to feed it every day. | Parents have many {responsibilities}, such as keeping their children safe.|actions campaigns",
      "awareness action",
    ),
    word(
      "action actions",
      "something that you do, especially to solve a problem",
      "行动",
      "We need to take {action} and do something now, before it's too late. | Stop talking about the problem and start doing something: we need {action}! | The government's {actions}, the things it has done, have reduced pollution.|campaigns responsibilities",
      "campaign responsibility",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        '*Encourage* and *persuade* both move people to act, but you *encourage* someone by giving them confidence, and you *persuade* someone who did not agree by giving reasons. Look for "reasons" and a change of mind, or for words like "you can do it".',
        "*encourage* 和 *persuade* 都让人去做事，但 *encourage* 是给人信心，*persuade* 是用理由说服原本不同意的人。留意 “reasons” 和改变主意，还是 “you can do it” 这类话。",
      ),
      meaning: t(
        "A *petition* is not a *protest*: a *petition* is a written request with many names on it, and a *protest* is people showing in public that they disagree. Check whether the meaning is something written or an event.",
        "*petition* 不是 *protest*：*petition* 是签有许多名字的书面请求，*protest* 是人们公开表示反对的活动。看清释义说的是一份文件，还是一次活动。",
      ),
      spell: t(
        "*Government* keeps the n of *govern* before -ment, gov-er-**n**-ment, and *campaign* ends in a silent g: cam-**paign**.",
        "*government* 在 -ment 前保留 *govern* 的 n：gov-er-**n**-ment；*campaign* 结尾的 g 不发音：cam-**paign**。",
      ),
    },
    notes: `
      campaign|posters, talks and meetings to save a park;months of planned events against plastic bags;clean-water work planned over months|a campaign is a planned set of activities over time; a protest is one public event|campaign 是有计划的系列活动；protest 是一次公开抗议|protest/protests=protest is one event of people showing they disagree, not months of planned activities=protest 是一次表示反对的活动，不是几个月的系列计划;petition/petitions=petition is one written request with names, not a set of events over time=petition 是一份签名请求书，不是长期的一系列活动|cam · paign|a silent g: cam-paign, said like *pain*|g 不发音，-paign 读作 *pain*
      protest|thousands in the streets against an airport;shouting and signs outside the town hall;cuts to schools|to protest is to show in public that you disagree; to persuade is to change someone's mind with reasons|protest 是抗议；persuade 是说服|encourage/encouraged/encouraging=encourage means to give someone confidence, not to show in public that you disagree=encourage 是给人信心，不是公开表示反对;persuade/persuaded/persuading=persuade means to change someone's mind with reasons, not to shout in the streets against something=persuade 是用理由说服人，不是上街反对;petition=petition is a written request with names, not people shouting outside=petition 是签名请求书，不是外面喊口号的人;ban=ban is an order that says something is not allowed, not people shouting in public=ban 是禁令，不是公开喊口号的人群|pro · test|the noun is said *PRO-test*, the verb *pro-TEST*|名词重音在前，动词重音在后
      petition|5,000 names signed;300 names sent to the mayor;names added online|a petition is a written request signed by many people; a protest is people showing anger in public|petition 是请愿书；protest 是抗议活动|campaign/campaigns=campaign is a set of planned activities, not one paper with names on it=campaign 是一系列计划的活动，不是一张签名纸;protest/protests=protest is people showing in public that they disagree, not a paper people sign=protest 是公开表示反对，不是人们签字的纸|pe · ti · tion|sign a petition|sign a petition 是“签请愿书”
      government|a country's promise of a million trees;a law against plastic bags in Kenya;schools across the country|the government is the group that rules a country; a community is the people of one area|government 是政府；community 是社区居民|community=community is the people who live in one area, not the group that rules a country=community 是一个地方的居民，不是治理国家的群体;public=public is ordinary people in general, not the group that makes laws=public 是普通大众，不是制定法律的群体|gov · ern · ment|govern + -ment: keep the n|govern 加 -ment，保留 n
      ban|cars out of the center;a fine for smoking in restaurants;fishing that nobody may do|to ban is to say officially that something must not be done; to allow is to let it happen|ban 是禁止；allow 是允许|encourage/encouraged=encourage means to make something more likely, the opposite of saying it must not be done=encourage 是鼓励，正好和禁止相反;allow/allowed=allow means to let something happen, the opposite of saying it must not happen=allow 是允许，正好和禁止相反;protest=protest is people showing they disagree, not an order that says no=protest 是表示反对的人群，不是禁令;petition=petition is a request with names, not an order that says no=petition 是签名请求，不是禁令|ban|ban, banned, banning: double n|banned、banning 双写 n
      encourage|a teacher saying I could win;cheap tickets for public transport;low prices that make buying more likely|to encourage is to give someone confidence or make something more likely; to ban is to forbid it|encourage 是鼓励；ban 是禁止|persuade/persuaded/persuades=persuade means to change someone's mind with reasons, not to give them confidence=persuade 是用理由改变别人想法，不是给人信心;ban/banned/bans=ban means to say something must not be done, the opposite of making it more likely=ban 是禁止，正好和鼓励相反|en · cour · age|encourage someone to do something|encourage sb to do
      persuade|an hour of reasons for parents who had said no;a good reason to come with us;explaining the harm of plastic cups|to persuade is to change someone's mind with reasons; to encourage is to give them confidence|persuade 是说服；encourage 是鼓励|encourage/encouraged=encourage means to give someone confidence to do what they want, not to change a "no" into a "yes" with reasons=encourage 是给人信心，不是用理由把“不”变成“好”;ban/banned=ban means to say something must not be done, not to get someone to agree=ban 是禁止，不是让人同意|per · suade|ua said like *way*: per-SWADE|ua 读作 *way*
      public|a library anyone can go into;buses and trains;a park where everyone may go|public means for everyone; a community is the people of one place|public 是公共的、公众；community 是社区|community=community is the people of one area, not anyone at all=community 是一个地方的人，不是任何人都包括;government=government is the group that rules, not ordinary people in general=government 是治理者，不是普通大众|pub · lic|the public · public transport · in public|in public 是“公开地”
      community|all the people on our island;neighbors helping each other;villages cut off by floods|a community is the people who live in one area; the public is people in general|community 是社区群体；public 是大众|public=public is all people in general, not the people of one street or island=public 是所有大众，不是某条街或某个岛上的人;government=government rules a country, not the neighbors of one place=government 治理国家，不是一个地方的邻里|com · mu · ni · ty|double m; y to -ies for more than one|双写 m；复数 y 变 -ies
      awareness|plastic in the ocean;people who don't know about a problem;more people knowing about climate change|awareness is knowing about something; responsibility is your duty to do something|awareness 是意识、认识；responsibility 是责任|responsibility=responsibility is your duty to do something, not knowing about a problem=responsibility 是该尽的责任，不是知道某个问题;action=action is doing something, not knowing about it=action 是采取行动，不是知道这件事|a · ware · ness|aware + -ness; raise awareness|aware 加 -ness；raise awareness
      responsibility|looking after the planet;feeding a pet every day;keeping children safe|a responsibility is your job or duty; awareness is knowing about something|responsibility 是责任；awareness 是意识|awareness=awareness is knowing about something, not your duty to do it=awareness 是知道某事，不是你的职责;action/actions=action is something you do, not a duty you have=action 是做的事，不是你承担的职责;campaign/campaigns=campaign is a set of planned events, not a duty=campaign 是系列活动，不是职责|re · spon · si · bil · i · ty|responsible: -ible becomes -ibility|responsible 的 -ible 变 -ibility
      action|doing something before it's too late;doing instead of talking;the things a government has done|action is something you do to solve a problem; responsibility is your duty|action 是行动；responsibility 是责任|campaign/campaigns=campaign is a whole plan of events, not simply doing something now=campaign 是整套计划活动，不是马上做点什么;responsibility/responsibilities=responsibility is a duty you have, not something you do=responsibility 是承担的职责，不是做的事|ac · tion|take action|take action 是“采取行动”
    `,
  },
});

const weather = vocabularyTopic({
  id: "b1-words-weather-and-climate",
  title: t("Weather and Climate", "天气和气候"),
  summary: t(
    "Forecasts; humid and mild days; heatwaves, hurricanes and tornadoes; earthquakes, volcanoes and tsunamis; rainfall, breezes and showers.",
    "天气预报；潮湿和温和的天气；热浪、飓风和龙卷风；地震、火山和海啸；降雨量、微风和阵雨。",
  ),
  intro: t(
    "The **forecast** warned of a **heatwave** and **humid** air, then a **hurricane** off the coast, while news came of an **earthquake** and a **tsunami** far away. These words help you describe weather, from a gentle **breeze** to the strongest storms.",
    "**forecast**（预报）先说有 **heatwave**（热浪）和 **humid**（潮湿的）空气，接着海上来了 **hurricane**（飓风），远方又传来 **earthquake**（地震）和 **tsunami**（海啸）的消息。这些词帮你描述天气，从轻柔的 **breeze**（微风）到最猛烈的风暴。",
  ),
  prerequisites: ["a2-words-weather-2"],
  words: [
    word(
      "forecast forecasts",
      "a statement of what the weather will probably be like",
      "预报",
      "The weather {forecast} says it will rain tomorrow. | Check the {forecast} on TV before you go sailing tomorrow. | The {forecast} was wrong: it said rain, but it was sunny all day.",
      "rainfall shower",
    ),
    word(
      "humid",
      "(of the air) warm and wet",
      "潮湿的",
      "It's hot and {humid} in Hong Kong in summer, and the air feels wet. | {Humid} weather, when the air is warm and wet, makes me feel sticky and tired.|Mild Dry | The air in the rainforest is very {humid}.",
      "mild dry",
    ),
    word(
      "mild milder mildest",
      "not too hot or too cold; not strong",
      "温和的；轻微的",
      "We had a {mild} winter, not too cold, with very little snow. | Winters are {milder} by the sea than in the mountains, so people go there to escape the cold.|colder wetter | I have a {mild} cold, nothing serious.",
      "humid cold",
    ),
    word(
      "heatwave heatwaves",
      "a period of very hot weather",
      "热浪",
      "During the {heatwave}, temperatures reached 40°C. | {Heatwaves} are dangerous for old people because of the great heat.|Droughts Hurricanes | Nobody went out in the {heatwave}: it was far too hot.",
      "drought hurricane",
    ),
    word(
      "hurricane hurricanes",
      "a storm with very strong winds, which starts over the sea",
      "飓风",
      "The {hurricane} came in from the sea with huge winds and destroyed hundreds of houses on the coast. | {Hurricanes}, storms that start over the warm sea, usually hit the area in autumn.|Tornadoes Tsunamis | The {hurricane}, a storm hundreds of kilometers wide that began over the ocean, had winds of 200 kilometers an hour.",
      "tornado tsunami",
    ),
    word(
      "tornado tornadoes",
      "a strong wind that turns very fast in a circle and moves across the land",
      "龙卷风",
      "The {tornado}, a narrow spinning wind, lifted cars into the air. | {Tornadoes} are common in the middle of the USA, far from the sea.|Hurricanes Earthquakes | We hid in the basement when the spinning {tornado} came across the fields.",
      "hurricane earthquake",
    ),
    word(
      "earthquake earthquakes",
      "a sudden shaking of the ground",
      "地震",
      "The {earthquake} shook the whole city. | Japan has many {earthquakes}, when the ground shakes suddenly.|volcanoes tsunamis | When the {earthquake} shakes the ground, strong buildings do not fall down.",
      "volcano tsunami",
    ),
    word(
      "volcano volcanoes",
      "a mountain with a hole at the top that fire and hot rock can come out of",
      "火山",
      "The {volcano} erupted and covered the town in ash. | In Iceland you can see many {volcanoes} with smoke coming out of their tops.|earthquakes tsunamis | We climbed to the top of an old {volcano}.",
      "earthquake tsunami",
    ),
    word(
      "tsunami tsunamis",
      "a very large wave caused by an earthquake under the sea",
      "海啸",
      "The {tsunami}, a huge wave from the sea, washed away whole villages. | Earthquakes under the sea can cause {tsunamis}, huge waves that hit the coast.|hurricanes earthquakes | {Tsunamis}, giant waves, can travel across the ocean very fast.|Hurricanes Earthquakes",
      "hurricane earthquake",
    ),
    word(
      "rainfall",
      "the amount of rain that falls in a place",
      "降雨量",
      "The area gets very little {rainfall}. | {Rainfall} has been low this year: only 200 millimeters of rain.|Shower Forecast | Heavy {rainfall} for a whole month caused floods in the north.",
      "shower forecast",
    ),
    word(
      "breeze breezes",
      "a light, gentle wind",
      "微风",
      "A light, cool {breeze} came from the sea. | The leaves moved gently in the {breeze}. | Gentle {breezes} kept us cool.|hurricanes showers",
      "hurricane shower",
    ),
    word(
      "shower showers",
      "a short period of rain; a wash under water that comes down from above",
      "阵雨；淋浴",
      "There will be short {showers} of rain this afternoon.|rainfalls breezes | I have a {shower} every morning. | We got wet in a sudden {shower}.",
      "rainfall breeze",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Hurricane* and *tornado* are both terrible winds, but a *hurricane* is a huge storm that starts over the sea, and a *tornado* is a narrow spinning wind that moves across the land. Look for the sea and the coast, or for fields and a spinning column.",
        "*hurricane* 和 *tornado* 都是可怕的风，但 *hurricane* 是在海上形成的巨大风暴，*tornado* 是在陆地上移动的狭窄旋转风。留意句中是海和海岸，还是田野和旋转的风柱。",
      ),
      meaning: t(
        "*Rainfall* is not one short rain: that is a *shower*. *Rainfall* is the amount of rain that falls in a place over a time. Check whether the meaning is an amount or one short rain.",
        "*rainfall* 不是一阵短雨，那是 *shower*。*rainfall* 是一个地方一段时间内的降雨量。看清释义说的是数量，还是一阵短雨。",
      ),
      spell: t(
        "*Tornado* and *volcano* add -es for more than one, *tornadoes*, *volcanoes*, but *tsunami* starts with a t that is not said.",
        "*tornado* 和 *volcano* 的复数加 -es：*tornadoes*、*volcanoes*；*tsunami* 开头的 t 不发音。",
      ),
    },
    notes: `
      forecast|rain tomorrow;TV before sailing;a wrong prediction of rain|a forecast says what the weather will probably be; rainfall is how much rain fell|forecast 是预报；rainfall 是降雨量|rainfall=rainfall is the amount of rain that falls, not a statement about what weather will come=rainfall 是降下的雨量，不是对将来天气的说法;shower=shower is a short rain, not what the TV says will happen=shower 是一阵短雨，不是电视上预告的天气|fore · cast|fore- + cast; the weather forecast|fore- 加 cast
      humid|hot, wet air in Hong Kong;warm, wet air that makes you sticky;the rainforest|humid means warm and wet; dry means with no water in the air|humid 是潮湿闷热；dry 是干燥|mild/Mild=mild means not too hot or cold, not warm and wet=mild 是不冷不热，不是湿热;dry/Dry=dry means with little water in the air, the opposite of wet=dry 是干燥的，正好和潮湿相反|hu · mid|the noun is *humidity*|名词是 *humidity*
      mild|a winter that was not too cold;winters by the sea where people escape the cold;a cold that is nothing serious|mild means not too hot, not too cold, or not strong; cold means low in temperature|mild 是温和、轻微；cold 是寒冷|humid=humid means warm and wet, not gentle or not serious=humid 是湿热，不是温和或轻微;cold/colder=cold means low in temperature, not gentle and not too cold=cold 是寒冷，不是温和;wetter=wetter means with more rain, not less cold=wetter 是更潮湿多雨，不是更暖和|mild|mild, milder, mildest|比较级 milder，最高级 mildest
      heatwave|40°C;danger to old people from heat;far too hot to go out|a heatwave is a period of very hot weather; a drought is a long time without rain|heatwave 是热浪；drought 是干旱|drought/Droughts=drought is a long time without rain, not very hot days=drought 是长期无雨，不是酷热的日子;hurricane/Hurricanes=hurricane is a storm with strong winds, not hot weather=hurricane 是强风暴，不是炎热天气|heat · wave|heat + wave; also written *heat wave*|heat 加 wave
      hurricane|huge winds from the sea onto the coast;storms over the warm sea;a storm hundreds of kilometers wide from the ocean|a hurricane starts over the sea and is huge; a tornado is narrow and moves over land|hurricane 在海上形成，范围巨大；tornado 狭窄，在陆地移动|tornado/Tornadoes=tornado is a narrow spinning wind over land, not a huge storm from the sea=tornado 是陆地上狭窄的旋风，不是来自海上的巨大风暴;tsunami/Tsunamis=tsunami is a giant wave, not a storm of wind=tsunami 是巨浪，不是风暴|hur · ri · cane|double r: hur-ri-cane|双写 r
      tornado|a narrow spinning wind lifting cars;the middle of the USA far from the sea;spinning wind across the fields|a tornado is a narrow spinning wind over land; a hurricane is a huge storm from the sea|tornado 是陆上龙卷风；hurricane 是海上飓风|hurricane/Hurricanes=hurricane is a huge storm that starts over the sea, not a narrow spinning wind over fields=hurricane 是海上形成的巨大风暴，不是田野上狭窄的旋风;earthquake/Earthquakes=earthquake is the ground shaking, not a wind=earthquake 是地面震动，不是风|tor · na · do|tornadoes with -es|复数 tornadoes
      earthquake|a whole city shaking;sudden shaking in Japan;strong buildings that stay up|an earthquake is the ground shaking; a volcano is a mountain that throws out fire|earthquake 是地震；volcano 是火山|volcano/volcanoes=volcano is a mountain with fire and rock coming out, not the ground shaking=volcano 是喷出火和岩石的山，不是地面震动;tsunami/tsunamis=tsunami is a giant wave in the sea, not shaking ground=tsunami 是海里的巨浪，不是地面震动|earth · quake|earth + quake, one word|earth 加 quake
      volcano|ash covering a town;smoke from mountaintops in Iceland;a climb to the top of an old one|a volcano is a mountain that fire and hot rock come out of; an earthquake is the ground shaking|volcano 是火山；earthquake 是地震|earthquake/earthquakes=earthquake is the ground shaking, not a mountain with smoke and fire coming out of its top=earthquake 是地面震动，不是顶上冒烟喷火的山;tsunami/tsunamis=tsunami is a giant wave, not a mountain=tsunami 是巨浪，不是山|vol · ca · no|volcanoes with -es|复数 volcanoes
      tsunami|a huge wave washing away villages;a wave caused by an earthquake under the sea;giant waves across the ocean|a tsunami is a giant wave caused by an earthquake; a hurricane is a storm of wind|tsunami 是海啸巨浪；hurricane 是飓风|hurricane/hurricanes/Hurricanes=hurricane is a storm of strong winds, not a giant wave caused by an earthquake=hurricane 是强风暴，不是地震引起的巨浪;earthquake/earthquakes/Earthquakes=earthquake is shaking ground that can cause the wave, not the wave itself=earthquake 是引起巨浪的地震，不是巨浪本身|tsu · na · mi|a silent t at the start: *soo-NAH-mee*|开头 t 不发音
      rainfall|very little in a dry area;200 millimeters of rain this year;a whole month that caused floods|rainfall is the amount of rain in a place; a shower is one short rain|rainfall 是降雨量；shower 是阵雨|shower/Shower=shower is one short rain, not the amount of rain over months=shower 是一阵短雨，不是几个月的雨量;forecast/Forecast=forecast says what weather will come, not how much rain has fallen=forecast 是预报将来的天气，不是已经下了多少雨|rain · fall|rain + fall, no plural|rain 加 fall，没有复数
      breeze|a light, cool wind from the sea;leaves moving gently;gentle winds that kept us cool|a breeze is a light, gentle wind; a hurricane is a terrible storm|breeze 是微风；hurricane 是飓风|hurricane/hurricanes=hurricane is a terrible storm with huge winds, not a light gentle wind=hurricane 是带狂风的可怕风暴，不是轻柔的风;shower/showers=shower is a short rain, not a light wind=shower 是一阵短雨，不是微风|breeze|ee said long, and z said like z|ee 读长音
      shower|short rains this afternoon;a wash every morning;a sudden rain that got us wet|a shower is a short rain or a wash under falling water; rainfall is the amount of rain|shower 是阵雨或淋浴；rainfall 是降雨量|rainfall/rainfalls=rainfall is the amount of rain over a time, not one short rain or a wash=rainfall 是一段时间的雨量，不是一阵雨或淋浴;breeze/breezes=breeze is a light wind, not water falling on you=breeze 是微风，不是落在身上的水|show · er|have a shower · take a shower|have/take a shower
    `,
  },
});

const materials = vocabularyTopic({
  id: "b1-words-waste",
  title: t("Materials and Waste", "材料和废弃物"),
  summary: t(
    "Cardboard, aluminum and rubber; packaging; toxic waste; dumping and landfills; sewage; leaks and spills; poison and smoke.",
    "纸板、铝和橡胶；包装；有毒废物；倾倒和垃圾填埋场；污水；泄漏和溢出；毒药和烟。",
  ),
  intro: t(
    "**Cardboard** boxes, **aluminum** cans and plastic **packaging** can be recycled, but **toxic** waste, **sewage** and oil **spills** **poison** rivers, and most trash still goes to **landfill**. These words help you talk about what we throw away and where it goes.",
    "**cardboard**（硬纸板）箱、**aluminum**（铝）罐和塑料 **packaging**（包装）都能回收，但 **toxic**（有毒的）废物、**sewage**（污水）和石油 **spills**（泄漏）会 **poison**（毒害）河流，大部分垃圾仍被送去 **landfill**（填埋场）。这些词帮你谈论我们扔掉了什么、它们去了哪里。",
  ),
  prerequisites: ["a2-words-materials", "b1-words-environment"],
  words: [
    word(
      "cardboard",
      "thick, stiff paper used for making boxes",
      "硬纸板",
      "We packed the books in brown {cardboard} boxes from the supermarket. | The children cut and glued {cardboard} to make a castle. | {Cardboard}, like paper, is easy to recycle.|Aluminum Rubber",
      "aluminum rubber",
    ),
    word(
      "aluminum",
      "a light, silver-colored metal",
      "铝",
      "Drink cans are made of {aluminum}. | {Aluminum} cans can be melted and recycled again and again.|Rubber Cardboard | Wrap the fish in {aluminum} foil and cook it.",
      "rubber cardboard",
    ),
    word(
      "rubber",
      "a strong material that stretches, used to make tires",
      "橡胶",
      "Car tires are made of {rubber}. | Wear {rubber} boots in the rain to keep your feet dry. | {Rubber} comes from the white liquid of a tree and stretches easily.|Aluminum Cardboard",
      "aluminum cardboard",
    ),
    word(
      "packaging",
      "the boxes, bags and plastic that things are sold in",
      "包装",
      "When we shop, too much {packaging} around the food ends up in the trash. | The shop sells food without plastic {packaging}. | Recycle the {packaging} that the toy came in after you open it.",
      "cardboard litter",
    ),
    word(
      "toxic",
      "poisonous; harmful to people, animals or plants",
      "有毒的",
      "The factory dumped {toxic} waste into the river. | Some plants are {toxic} to cats and can make them very ill. | Don't breathe the smoke: it's {toxic} and can hurt your lungs.",
      "healthy fresh",
    ),
    word(
      "dump dumps dumped dumping",
      "to throw away or leave something somewhere it should not be; a place for trash",
      "倾倒；垃圾场",
      "Someone {dumped} an old sofa in the woods.|spilled leaked | It's against the law to {dump} bags of trash in the river on purpose. | We took the broken fridge to the {dump}.",
      "spill leak",
    ),
    word(
      "landfill landfills",
      "a place where trash is buried under the ground",
      "垃圾填埋场",
      "Most of our trash ends up buried under the ground in {landfill}. | The town's {landfill} is almost full. | Plastic buried in a {landfill} can stay there for hundreds of years.",
      "sewage compost",
    ),
    word(
      "sewage",
      "dirty water and waste from toilets that is carried away in pipes",
      "污水",
      "{Sewage}, dirty water from toilets, was flowing into the sea.|Landfill Poison | The beach was closed because of {sewage} from the town's toilets in the water. | The city built a new {sewage} system of pipes under the streets.",
      "landfill poison",
    ),
    word(
      "leak leaks leaked leaking",
      "(of a liquid or a gas) to come out through a hole; a hole that does this",
      "泄漏；漏",
      "The roof {leaks} through a small hole when it rains.|spills dumps | I can smell a gas {leak} in the kitchen! | Oil was {leaking} from the car through a small hole.|spilling dumping",
      "spill dump",
    ),
    word(
      "spill spills spilled spilling",
      "to let a liquid fall out of its container by accident; an amount that falls out",
      "洒出；溢出",
      "I {spilled} coffee on my homework when I knocked over my cup.|leaked dumped | The oil {spill} from the ship that turned over killed thousands of sea birds. | Be careful not to {spill} the milk.",
      "leak dump",
    ),
    word(
      "poison poisons",
      "something that can kill or harm you if you eat or drink it",
      "毒药；毒物",
      "Some mushrooms contain {poison}. | Keep {poisons} away from children, because they could kill them.|smoke medicines | The farmer used {poison} to kill the rats.",
      "smoke medicine",
    ),
    word(
      "smoke smokes smoked smoking",
      "the gray or black gas that rises from something burning; to breathe in smoke from a cigarette",
      "烟；吸烟",
      "Black {smoke} came out of the factory chimney. | Where there's {smoke}, there's fire. | My uncle {smokes} twenty cigarettes a day.|burns poisons",
      "poison fire",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        '*Leak* and *spill* both let a liquid out, but a *leak* comes slowly through a hole, and a *spill* happens when liquid falls out of its container by accident. Look for "hole" or for a cup or bottle knocked over.',
        "*leak* 和 *spill* 都是液体流出来，但 *leak* 是从洞里慢慢漏出，*spill* 是容器不小心打翻洒出来。留意 “hole”，还是被打翻的杯子或瓶子。",
      ),
      meaning: t(
        "*Toxic* is an adjective and *poison* is a noun: *toxic* describes something as poisonous, and *poison* is the thing itself. Check whether the meaning names a thing or describes one.",
        "*toxic* 是形容词，*poison* 是名词：*toxic* 形容东西有毒，*poison* 是毒物本身。看清释义是在说一样东西，还是在描述它。",
      ),
      spell: t(
        "*Aluminum* is spelled with -num in American English and *aluminium* with -nium in British English; *cardboard* is one word, card + board.",
        "美式拼写 *aluminum* 以 -num 结尾，英式 *aluminium* 以 -nium 结尾；*cardboard* 是一个词：card 加 board。",
      ),
    },
    notes: `
      cardboard|brown boxes from the supermarket;a castle cut and glued;recycling like paper|cardboard is thick, stiff paper; aluminum is a light metal|cardboard 是硬纸板；aluminum 是铝|aluminum/Aluminum=aluminum is a light silver metal, not thick brown paper=aluminum 是轻的银色金属，不是厚的褐色纸;rubber/Rubber=rubber is a material that stretches, not stiff paper=rubber 是有弹性的材料，不是硬纸|card · board|card + board, one word|card 加 board，写成一个词
      aluminum|drink cans;cans melted and recycled;foil around fish|aluminum is a light silver metal; rubber stretches|aluminum 是铝；rubber 是橡胶|rubber/Rubber=rubber is a soft material that stretches, not a light silver metal=rubber 是有弹性的软材料，不是轻的银色金属;cardboard/Cardboard=cardboard is thick paper, not a metal that can be melted=cardboard 是厚纸，不是能熔化的金属|a · lu · mi · num|aluminum in American English, aluminium in British English|美式 aluminum，英式 aluminium
      rubber|car tires;boots that keep feet dry;the white liquid of a tree that stretches|rubber is a material that stretches; aluminum is a metal|rubber 是橡胶；aluminum 是铝|aluminum/Aluminum=aluminum is a hard light metal, not a material that stretches=aluminum 是硬的轻金属，不是有弹性的材料;cardboard/Cardboard=cardboard is stiff paper, not a material that stretches and keeps water out=cardboard 是硬纸，不是有弹性又防水的材料|rub · ber|double b; British *rubber* is also an eraser|双写 b；英式 *rubber* 也指橡皮
      packaging|what surrounds food when we shop;food sold without plastic around it;what a toy came in|packaging is the boxes, bags and plastic things are sold in; cardboard is one material|packaging 是包装；cardboard 是一种材料|cardboard=cardboard is one material, thick paper, not all the plastic and boxes around things you buy=cardboard 是一种材料，即厚纸，不是商品外的所有塑料和盒子;litter=litter is trash dropped on the ground, not what things are sold in=litter 是扔在地上的垃圾，不是商品的包装|pack · ag · ing|package + -ing, dropping the e; no plural|package 去 e 加 -ing；没有复数
      toxic|waste dumped in a river;plants that make cats ill;smoke that hurts your lungs|toxic means poisonous and harmful; healthy means good for you|toxic 是有毒的；healthy 是健康的|healthy=healthy means good for your body, the opposite of poisonous=healthy 是对身体好，正好和有毒相反;fresh=fresh means new and clean, not poisonous and harmful=fresh 是新鲜干净，不是有毒有害|tox · ic|x said like *ks*|x 读作 *ks*
      dump|an old sofa in the woods;bags of trash in a river on purpose;a broken fridge taken away|to dump is to throw something away where it should not be; to spill is to let a liquid fall by accident|dump 是乱倒、丢弃；spill 是不小心洒出|spill/spilled=spill means to let a liquid fall out by accident, not to leave big things somewhere on purpose=spill 是不小心洒出液体，不是故意丢下大件东西;leak/leaked=leak means a liquid comes out through a hole, not throwing things away=leak 是液体从洞里漏出，不是丢弃东西|dump|*dump* is also the place for trash: the dump|*dump* 也可指垃圾场
      landfill|trash buried under the ground;a town site that is almost full;plastic buried for hundreds of years|a landfill is where trash is buried; compost is plant waste that feeds soil|landfill 是垃圾填埋场；compost 是堆肥|sewage=sewage is dirty water from toilets, not a place where trash is buried=sewage 是厕所污水，不是填埋垃圾的地方;compost=compost is rotting plant waste for gardens, not where trash is buried=compost 是园子用的腐烂植物，不是填埋垃圾的地方|land · fill|land + fill, one word|land 加 fill，写成一个词
      sewage|dirty water from toilets in the sea;toilets of a town and a closed beach;pipes under the streets|sewage is dirty water from toilets; poison is something that can kill you|sewage 是污水；poison 是毒物|landfill/Landfill=landfill is a place where trash is buried, not dirty water in pipes=landfill 是填埋垃圾的地方，不是管道里的污水;poison/Poison=poison is something that kills if you eat or drink it, not water from toilets=poison 是吃了会致命的东西，不是厕所污水|sew · age|ew said like *oo*: *SOO-ij*; no plural|ew 读作 *oo*；没有复数
      leak|a roof with a small hole in the rain;gas smelled in the kitchen;oil through a small hole in a car|a leak comes out slowly through a hole; a spill falls out by accident|leak 是从洞里漏出；spill 是不小心洒出|spill/spills/spilling=spill means liquid falling out when a cup or bottle is knocked, not coming through a hole=spill 是杯瓶打翻洒出，不是从洞里漏出;dump/dumps/dumping=dump means to throw things away somewhere wrong, not liquid coming through a hole=dump 是乱丢东西，不是液体从洞里漏出|leak|ea said long; *leek* is a vegetable|ea 读长音；*leek* 是韭葱
      spill|coffee from a knocked-over cup;oil from a ship that turned over;milk when you are not careful|to spill is to let liquid fall out by accident; to leak is for liquid to come through a hole|spill 是洒出；leak 是漏出|leak/leaked=leak means liquid comes slowly through a hole, not falling out when a cup is knocked over=leak 是从洞里慢慢漏出，不是杯子打翻洒出;dump/dumped=dump means to throw away on purpose, not by accident=dump 是故意丢弃，不是不小心|spill|spilled or spilt|过去式 spilled 或 spilt
      poison|mushrooms that contain it;things kept away from children because they could kill;what a farmer used on rats|poison is something that can kill or harm if eaten or drunk; medicine makes you better|poison 是毒药；medicine 是药物|smoke=smoke is gray gas from a fire, not something in mushrooms that kills=smoke 是火冒出的烟，不是蘑菇里的毒;medicine/medicines=medicine makes you better, the opposite of something that kills=medicine 是治病的药，正好和致命的毒药相反|poi · son|oi said like *oy*; the adjective is *poisonous*|oi 读作 *oy*；形容词 *poisonous*
      smoke|black clouds from a factory chimney;the sign of a fire;twenty cigarettes a day|smoke is the gas that rises from burning; fire is the burning itself|smoke 是烟；fire 是火|poison/poisons=poison is something that kills if eaten, not the gray gas from burning=poison 是吃了致命的东西，不是燃烧冒出的灰色气体;fire=fire is the hot flames themselves, not the gray gas that rises from them=fire 是火焰本身，不是升起的灰色烟;burns=burns means is on fire, not breathing in smoke from a cigarette=burns 是着火，不是吸烟|smoke|smoke cigarettes · no smoking|no smoking 是“禁止吸烟”
    `,
  },
});

/** topics are the topics of the unit The Environment. */
export const topics: readonly TopicDef[] = [
  environment.topic,
  living.topic,
  green.topic,
  change.topic,
  action.topic,
  weather.topic,
  materials.topic,
];

/** vocabulary are the words the unit The Environment teaches. */
export const vocabulary: readonly WordBatch[] = [
  environment.batch,
  living.batch,
  green.batch,
  change.batch,
  action.batch,
  weather.batch,
  materials.batch,
];
