// B2, unit 4: Climate and Sustainability. Climate change, energy, ecosystems, sustainability, farming and food, policy
// and action, natural disasters, water, cause and effect, the future of the earth, and materials; the future continuous
// and the future perfect; writing an opinion essay.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { fill, judgedTopic } from "../a2/kit.ts";
import { interleave, vocabularyTopic, word } from "../words.ts";

const climate = vocabularyTopic({
  id: "b2-words-climate-change",
  title: t("Climate Change", "气候变化"),
  summary: t(
    "Greenhouse gases and fossil fuels; the atmosphere and the ozone layer; deforestation and biodiversity; glaciers and the polar ice; methane; warming; carbon neutral; emitting gases.",
    "温室气体和化石燃料；大气层和臭氧层；森林砍伐和生物多样性；冰川和极地冰层；甲烷；变暖；碳中和；排放气体。",
  ),
  prerequisites: ["b1-words-weather-and-climate"],
  words: [
    word(
      "greenhouse",
      "describing gases, such as carbon dioxide, that trap heat around the earth; a glass building for growing plants",
      "温室（的）",
      "Carbon dioxide is a {greenhouse} gas.|glacier biodiversity | {Greenhouse} gases trap heat in the atmosphere.|Glacier Deforestation | She grows tomatoes in a {greenhouse} behind her house.|glacier fossil",
      "greenery warehouse",
    ),
    word(
      "fossil fossils",
      "the remains of a very old animal or plant kept in rock; fossil fuels are coal, oil and gas",
      "化石",
      "Coal, oil and gas are {fossil} fuels.|glacier polar | Burning {fossil} fuels releases carbon dioxide.|glacier ozone | The children found the {fossil} of a fish in the rock.|glacier methane",
      "fuel fragile",
    ),
    word(
      "atmosphere atmospheres",
      "the layer of gases around the earth; the feeling that a place gives you",
      "大气层；气氛",
      "Carbon dioxide traps heat in the {atmosphere}.|glacier deforestation | The restaurant has a relaxed {atmosphere}.|biodiversity methane | Mars has a very thin {atmosphere}.|deforestation biodiversity",
      "hemisphere asphalt",
    ),
    word(
      "deforestation",
      "the cutting down of forests over a large area",
      "森林砍伐；毁林",
      "{Deforestation} destroys the homes of many animals.|Methane Ozone | {Deforestation} in the Amazon has slowed in recent years.|Methane Atmosphere | Clearing land for cattle is a major cause of {deforestation}.|ozone glaciers",
      "reforestation deformation",
    ),
    word(
      "glacier glaciers",
      "a large mass of ice that moves slowly down a mountain or across land",
      "冰川",
      "The {glacier} has shrunk by a kilometer since 1950.|ozone methane | Melting {glaciers} raise the level of the sea.|fossils greenhouses | We walked across the {glacier} in special boots.|ozone atmosphere",
      "glazier galaxy",
    ),
    word(
      "methane",
      "a gas with no color or smell, given off by cows and rotting waste, that traps heat",
      "甲烷；沼气",
      "Cows produce large amounts of {methane}.|ozone glaciers | {Methane} traps more heat than carbon dioxide.|Glacier Biodiversity | Rotting waste in landfills gives off {methane}.|glaciers biodiversity",
      "methanol medicine",
    ),
    word(
      "warming",
      "the process of becoming warmer, especially of the earth's climate",
      "变暖",
      "Global {warming} is melting the polar ice.|ozone methane | Scientists measure the {warming} of the oceans.|glacier deforestation | The {warming} of the planet is happening faster than expected.|ozone biodiversity",
      "warning swarming",
    ),
    word(
      "biodiversity",
      "the variety of plants and animals that live in a place",
      "生物多样性",
      "Rainforests have very high {biodiversity}.|glaciers ozone | Pollution is reducing the {biodiversity} of the river.|ozone glacier | Protecting {biodiversity} means protecting many species.|methane warming",
      "biography diversion",
    ),
    word(
      "neutral",
      "adding nothing overall, so that the total effect is zero; not supporting either side",
      "中和的；中立的",
      "The company plans to become carbon {neutral} by 2040.|polar fossil | Switzerland stayed {neutral} during the war.|polar fossil | A carbon {neutral} building produces as much energy as it uses.|greenhouse polar",
      "natural neural",
    ),
    word(
      "ozone",
      "a form of oxygen; the ozone layer high above the earth protects it from the sun's harmful rays",
      "臭氧",
      "The {ozone} layer protects us from the sun's rays.|methane glacier | Some chemicals made a hole in the {ozone} layer.|glacier fossil | The {ozone} hole over Antarctica is slowly closing.|methane biodiversity",
      "zone oven",
    ),
    word(
      "emit emits emitted emitting",
      "to send out gas, heat, light or sound",
      "排放；发出",
      "Cars {emit} carbon dioxide.|omit admit | The factory {emitted} black smoke all day.|omitted admitted | The country is {emitting} more gas than ever.|omitting admitting",
      "omit admit",
    ),
    word(
      "polar",
      "near the North Pole or the South Pole",
      "极地的；两极的",
      "{Polar} bears depend on sea ice.|Neutral Fossil | The {polar} ice is melting fast.|neutral ozone | Few people live in the {polar} regions.|neutral greenhouse",
      "solar popular",
    ),
  ],
});

const energy = vocabularyTopic({
  id: "b2-words-energy",
  title: t("Energy", "能源"),
  summary: t(
    "Nuclear power and reactors; wind turbines; generating power and generators; the grid; efficiency and insulation; gasoline, diesel, hydrogen and biofuels.",
    "核能和反应堆；风力涡轮机；发电和发电机；电网；效率和隔热；汽油、柴油、氢和生物燃料。",
  ),
  prerequisites: ["b1-words-green-living"],
  words: [
    word(
      "nuclear",
      "using the energy made when atoms are split or joined",
      "核的；核能的",
      "France gets most of its electricity from {nuclear} power.|insulation efficiency | A {nuclear} power station produces no smoke.|grid insulation | Some people fear {nuclear} accidents.|grid insulation",
      "unclear nuclei",
    ),
    word(
      "turbine turbines",
      "a machine with blades that turn to produce power, for example in wind",
      "涡轮机",
      "A wind {turbine} turns even in a light wind.|reactor grid | The hills are covered with tall white {turbines}.|reactors grids | Water from the dam turns the {turbines}.|grids insulation",
      "turban turbulence",
    ),
    word(
      "generate generates generated generating",
      "to produce energy, such as electricity or heat; to cause something to exist",
      "产生；发（电）",
      "Solar panels {generate} electricity from sunlight.|generator insulate | The wind farm {generates} enough power for 5,000 homes.|generators insulation | The plan has {generated} a lot of debate.|generator insulated",
      "generalize germinate",
    ),
    word(
      "generator generators",
      "a machine that produces electricity",
      "发电机",
      "The hospital has a {generator} in case the power fails.|turbine grid | We used a small {generator} at the campsite.|reactor grid | Diesel {generators} are noisy and dirty.|grids reactors",
      "generation generous",
      "turbine",
    ),
    word(
      "grid grids",
      "the network of wires that carries electricity to homes and businesses",
      "电网；网格",
      "The new wind farm is connected to the national {grid}.|turbine reactor | Homes can sell extra solar power to the {grid}.|reactor generator | The storm damaged the electricity {grid}.|insulation efficiency",
      "grit grind",
    ),
    word(
      "reactor reactors",
      "the large machine in which nuclear energy is produced",
      "反应堆",
      "The power station has two nuclear {reactors}.|grids insulations | Engineers shut down the {reactor} after the earthquake.|grid efficiency | The {reactor} is cooled with seawater.|grid insulation",
      "reaction actor",
    ),
    word(
      "efficiency",
      "the quality of producing good results without wasting energy, time or money",
      "效率；效能",
      "LED bulbs have a much higher {efficiency} than old bulbs.|insulation hydrogen | The new engine improves fuel {efficiency} by 20%.|grid turbine | Energy {efficiency} saves money and cuts emissions.|turbine diesel",
      "efficient sufficiency",
    ),
    word(
      "insulation",
      "material that stops heat from escaping, for example from a building",
      "隔热（材料）；绝缘",
      "Good {insulation} keeps the house warm in winter.|efficiency hydrogen | They put {insulation} in the roof.|efficiency grid | Without {insulation}, heat escapes through the walls.|efficiency diesel",
      "isolation installation",
    ),
    word(
      "gasoline",
      "the liquid fuel made from oil that most cars use; petrol",
      "汽油",
      "The price of {gasoline} rose again this month.|insulation turbine | Electric cars don't run on {gasoline}.|efficiency insulation | He filled the tank with {gasoline}.|insulation efficiency",
      "gasp vaseline",
      "diesel",
    ),
    word(
      "diesel",
      "a heavy fuel used in trucks, buses and some cars; an engine that uses it",
      "柴油；柴油机",
      "Most trucks run on {diesel}.|insulation grid | {Diesel} engines produce more harmful particles.|Insulation Efficiency | The city plans to ban old {diesel} cars.|insulation efficiency",
      "decimal dizzy",
      "gasoline",
    ),
    word(
      "hydrogen",
      "the lightest gas, which can be burned as a clean fuel",
      "氢；氢气",
      "Water is made of {hydrogen} and oxygen.|insulation efficiency | The bus runs on {hydrogen} and emits only water.|insulation grids | {Hydrogen} is the lightest gas.|Insulation Diesel",
      "hydrant halogen",
    ),
    word(
      "biofuel biofuels",
      "fuel made from plants or animal waste",
      "生物燃料",
      "Some planes now fly partly on {biofuel}.|insulation grid | {Biofuels} are made from crops such as corn.|Reactors Grids | Growing crops for {biofuels} uses a lot of land.|turbines grids",
      "biology refuel",
    ),
  ],
});

const ecosystems = vocabularyTopic({
  id: "b2-words-ecosystems",
  title: t("Ecosystems", "生态系统"),
  summary: t(
    "Ecology; wetlands and marshes; reefs; the tundra and the savanna; the forest canopy; erosion; fertile and barren land; vegetation.",
    "生态学；湿地和沼泽；礁；冻原和稀树草原；森林树冠层；侵蚀；肥沃和贫瘠的土地；植被。",
  ),
  prerequisites: ["b1-words-nature-2"],
  words: [
    word(
      "ecology",
      "the study of how plants, animals and their surroundings affect each other; the balance between them",
      "生态学；生态",
      "She is studying {ecology} at university.|vegetation erosion | The new road could harm the {ecology} of the valley.|erosion tundra | {Ecology} teaches us how species depend on each other.|Erosion Vegetation",
      "economy geology",
      "ecological",
    ),
    word(
      "ecological",
      "connected with the balance of plants, animals and their surroundings",
      "生态的",
      "The oil spill was an {ecological} disaster.|fertile barren | Wetlands have great {ecological} value.|barren fertile | Scientists studied the {ecological} effects of the dam.|barren fertile",
      "economical logical",
      "ecology",
    ),
    word(
      "wetland wetlands",
      "an area of land that is mostly covered with water, such as a marsh",
      "湿地",
      "Many birds stop in the {wetlands} on their way south.|canopies savannas | The {wetland} was drained to build houses.|canopy reef | {Wetlands} soak up water and reduce flooding.|Canopies Savannas",
      "wasteland westland",
      "marsh",
    ),
    word(
      "marsh marshes",
      "an area of soft, wet land where tall grass grows",
      "沼泽",
      "Frogs and herons live in the {marsh}.|canopy savanna | Salt {marshes} protect the coast from storms.|canopies reefs | The path crosses the {marsh} on wooden boards.|canopy erosion",
      "march mash",
      "wetland",
    ),
    word(
      "reef reefs",
      "a line of rock or coral just below the surface of the sea",
      "礁；暗礁",
      "Coral {reefs} are home to thousands of species.|Canopies Marshes | Warmer water is killing the {reef}.|canopy tundra | Divers swam along the {reef}.|tundra canopy",
      "reed relief",
    ),
    word(
      "tundra",
      "the large, flat, cold area of land in the far north where no trees grow",
      "冻原；苔原",
      "Reindeer live on the Arctic {tundra}.|reef canopy | The ground of the {tundra} is frozen for most of the year.|reef canopy | Only moss and small plants grow on the {tundra}.|canopy reef",
      "thunder tundras",
    ),
    word(
      "savanna savannas",
      "a large area of flat grassland with few trees in a hot region",
      "稀树草原；热带草原",
      "Lions hunt on the African {savanna}.|reef marsh | The {savanna} turns green after the rains.|reef erosion | Elephants cross the {savannas} in search of water.|reefs canopies",
      "sauna banana",
      "tundra",
    ),
    word(
      "canopy canopies",
      "the top layer of branches and leaves in a forest; a cover above something",
      "树冠层；顶篷",
      "Monkeys live high in the forest {canopy}.|tundra erosion | The thick {canopy} keeps the forest floor dark.|tundra erosion | We sat under a {canopy} to keep out of the sun.|tundra reef",
      "cannery canoe",
    ),
    word(
      "erosion",
      "the slow wearing away of land by water, wind or ice",
      "侵蚀；腐蚀",
      "Trees protect the soil from {erosion}.|vegetation canopy | Coastal {erosion} is destroying the cliffs.|vegetation canopy | {Erosion} by the river created a deep valley.|Vegetation Ecology",
      "eruption corrosion",
    ),
    word(
      "fertile",
      "able to produce many good crops (of land)",
      "肥沃的；能生育的",
      "The valley has rich, {fertile} soil.|barren ecological | Rivers make the land along them {fertile}.|barren ecological | The {fertile} plains feed millions of people.|barren ecological",
      "futile fertilizer",
    ),
    word(
      "barren",
      "too poor to produce plants or crops (of land)",
      "贫瘠的；荒芜的",
      "The land was {barren} after years of drought.|fertile ecological | Nothing grows on the {barren} hills.|fertile ecological | Overgrazing turned the grassland into {barren} desert.|fertile ecological",
      "baron barrel",
    ),
    word(
      "vegetation",
      "plants in general, especially those of a particular area",
      "植被；植物",
      "The island is covered in thick {vegetation}.|erosion ecology | Goats ate all the {vegetation} on the hill.|erosion tundra | {Vegetation} grows quickly after the rains.|Erosion Ecology",
      "vegetarian vacation",
    ),
  ],
});

const sustainability = vocabularyTopic({
  id: "b2-words-sustainability",
  title: t("Sustainability", "可持续性"),
  summary: t(
    "Sustainability; recyclable, biodegradable, disposable and reusable things; eco-friendly products; consumerism; upcycling; durable goods; being wasteful, thrifty or frugal.",
    "可持续性；可回收、可生物降解、一次性和可重复使用的东西；环保产品；消费主义；升级再造；耐用品；浪费、节俭。",
  ),
  prerequisites: ["b1-words-waste"],
  words: [
    word(
      "sustainability",
      "the use of resources in a way that does not harm the environment and can continue for a long time",
      "可持续性",
      "The company has made {sustainability} its main goal.|consumerism durable | {Sustainability} means meeting our needs without harming the future.|Consumerism Disposable | Experts doubt the {sustainability} of cheap fashion.|consumerism wasteful",
      "suitability availability",
    ),
    word(
      "recyclable",
      "able to be processed and used again as material",
      "可回收利用的",
      "This bottle is made of {recyclable} plastic.|wasteful thrifty | Not all paper cups are {recyclable}.|thrifty frugal | Put {recyclable} waste in the blue bin.|thrifty frugal",
      "recycled reliable",
    ),
    word(
      "biodegradable",
      "able to be broken down naturally by bacteria",
      "可生物降解的",
      "These bags are {biodegradable} and break down in weeks.|durable thrifty | Food waste is {biodegradable}.|thrifty durable | Normal plastic is not {biodegradable}.|thrifty frugal",
      "biological degrading",
    ),
    word(
      "disposable",
      "made to be used once and then thrown away",
      "一次性的",
      "{Disposable} cups are a huge source of waste.|Durable Thrifty | Many parents use {disposable} diapers.|durable thrifty | The café has stopped selling {disposable} plastic forks.|durable frugal",
      "disposal dispensable",
      "wasteful",
    ),
    word(
      "eco-friendly",
      "not harmful to the environment",
      "环保的；对环境无害的",
      "They only buy {eco-friendly} cleaning products.|wasteful thrifty | Cycling is the most {eco-friendly} way to travel.|durable recyclable | The hotel is proud of its {eco-friendly} design.|wasteful disposable",
      "economic ecology",
    ),
    word(
      "consumerism",
      "the belief that buying more and more things is good; the buying of goods",
      "消费主义",
      "Black Friday is a symbol of modern {consumerism}.|sustainability durable | Some people reject {consumerism} and live simply.|sustainability thrifty | {Consumerism} creates mountains of waste.|Sustainability Frugal",
      "consumption communism",
    ),
    word(
      "upcycle upcycles upcycled upcycling",
      "to make an old or unwanted object into something new of better quality",
      "升级再造；变废为宝",
      "She {upcycles} old jeans into bags.|disposes wastes | He {upcycled} an old door into a table.|disposed wasted | {Upcycling} gives old furniture a new life.|Disposing Wasting",
      "upgrade uphold",
    ),
    word(
      "durable",
      "lasting a long time without breaking",
      "耐用的；持久的",
      "These boots are {durable} enough to last ten years.|disposable wasteful | Buy {durable} goods instead of cheap ones.|disposable wasteful | Glass is a very {durable} material.|disposable wasteful",
      "curable dutiful",
    ),
    word(
      "reusable",
      "able to be used again",
      "可重复使用的",
      "Bring a {reusable} bag when you go shopping.|disposable wasteful | She drinks from a {reusable} water bottle.|disposable wasteful | {Reusable} cups can be washed and used for years.|Disposable Wasteful",
      "refusable reasonable",
    ),
    word(
      "wasteful",
      "using more of something than is needed",
      "浪费的",
      "Leaving the lights on all night is {wasteful}.|thrifty frugal | It is {wasteful} to throw away good food.|thrifty durable | We live in a very {wasteful} society.|frugal thrifty",
      "wistful tasteful",
    ),
    word(
      "thrifty",
      "careful to spend little money and to waste nothing",
      "节俭的；节约的",
      "My {thrifty} grandmother never threw anything away.|wasteful disposable | Students have to be {thrifty}.|wasteful disposable | Being {thrifty}, they repair their clothes instead of buying new ones.|wasteful disposable",
      "thirsty shifty",
      "frugal",
    ),
    word(
      "frugal",
      "using only as much money or food as is needed",
      "节俭的；简朴的",
      "They live a {frugal} life in the country.|wasteful disposable | We had a {frugal} meal of bread and soup.|wasteful disposable | {Frugal} habits help families save money.|Wasteful Disposable",
      "fragile frigid",
      "thrifty",
    ),
  ],
});

const farming = vocabularyTopic({
  id: "b2-words-farming",
  title: t("Farming and Food", "农业与粮食"),
  summary: t(
    "Agriculture; crops and the harvest; irrigation; pesticides and fertilizers; livestock and cattle; dairy farming; the yield of a field; famine.",
    "农业；庄稼和收成；灌溉；杀虫剂和化肥；牲畜和牛；乳制品业；产量；饥荒。",
  ),
  prerequisites: ["b1-words-environment"],
  words: [
    word(
      "agriculture",
      "the science or work of farming",
      "农业",
      "{Agriculture} uses about 70% of the world's fresh water.|Irrigation Famine | Most people in the region work in {agriculture}.|irrigation dairy | Modern {agriculture} depends on machines.|irrigation famine",
      "agricultural architecture",
      "agricultural",
    ),
    word(
      "agricultural",
      "connected with farming",
      "农业的",
      "The country exports {agricultural} products such as rice.|dairy fertile | Much {agricultural} land is lost to cities every year.|dairy fertilizer | She studied at an {agricultural} college.|irrigation livestock",
      "agriculture architectural",
      "agriculture",
    ),
    word(
      "crop crops",
      "a plant, such as wheat or rice, that is grown in large amounts",
      "庄稼；作物",
      "Rice is the main {crop} in this region.|famine livestock | The drought destroyed the {crops}.|famines livestock | Farmers grow two {crops} a year here.|famines dairies",
      "drop corp",
    ),
    word(
      "harvest harvests harvested harvesting",
      "the time when crops are gathered; to gather crops",
      "收获；收割",
      "The rice {harvest} begins in October.|famine pesticide | Farmers {harvested} the wheat before the rain.|famined yielded | Apples are {harvested} by hand.|famined yielded",
      "harass vest",
      "yield",
    ),
    word(
      "irrigation",
      "the supply of water to land through pipes or channels so that crops can grow",
      "灌溉",
      "Without {irrigation}, nothing would grow in the desert.|famine livestock | {Irrigation} uses huge amounts of river water.|Famine Cattle | Modern {irrigation} drips water onto each plant.|famine dairy",
      "irritation migration",
    ),
    word(
      "pesticide pesticides",
      "a chemical used to kill insects that damage crops",
      "杀虫剂；农药",
      "{Pesticides} can harm bees as well as pests.|Fertilizers Famines | The farmer sprays the fruit with {pesticide}.|famine irrigation | Organic food is grown without chemical {pesticides}.|famines cattle",
      "pessimist pesticidal",
      "fertilizer",
    ),
    word(
      "fertilizer fertilizers",
      "a substance added to soil to help plants grow",
      "肥料；化肥",
      "Too much {fertilizer} pollutes rivers.|famine harvest | Animal waste can be used as {fertilizer}.|famine livestock | Chemical {fertilizers} increased crop yields.|famines cattle",
      "fertility fertile",
      "pesticide",
    ),
    word(
      "livestock",
      "farm animals, such as cows, sheep and pigs",
      "牲畜；家畜",
      "The farm keeps {livestock} and grows vegetables.|irrigation agriculture | The drought killed much of the {livestock}.|irrigation dairy | {Livestock} produce a large share of greenhouse gases.|Irrigation Famine",
      "lifestyle livelihood",
      "cattle",
    ),
    word(
      "cattle",
      "cows and bulls kept on a farm",
      "牛（总称）",
      "The {cattle} graze in the fields all summer.|crops irrigation | He raises {cattle} for beef.|crops fertilizer | A herd of {cattle} blocked the road.|crops famine",
      "castle kettle",
      "livestock dairy",
    ),
    word(
      "dairy",
      "connected with milk or food made from milk; a farm or company that produces it",
      "乳制品（的）；奶牛场",
      "Cheese and yogurt are {dairy} products.|cattle irrigation | She can't eat {dairy} because of an allergy.|cattle irrigation | The {dairy} farm has two hundred cows.|irrigation famine",
      "diary daily",
      "cattle",
    ),
    word(
      "yield yields yielded yielding",
      "the amount of crops a field produces; to produce crops or results",
      "产量；产出",
      "New seeds have doubled the rice {yield}.|famine irrigation | The field {yields} three tons of wheat a year.|irrigates harvests | The research {yielded} surprising results.|irrigated famined",
      "yell field",
      "harvest",
    ),
    word(
      "famine famines",
      "a lack of food over a long period, causing many people to go hungry or die",
      "饥荒",
      "Millions died in the {famine}.|harvest irrigation | Drought and war can cause {famine}.|irrigation dairy | The country has not had a {famine} for fifty years.|pesticide irrigation",
      "feminine fame",
    ),
  ],
});

const action = vocabularyTopic({
  id: "b2-words-environmental-action",
  title: t("Policy and Action", "政策与行动"),
  summary: t(
    "Regulations and regulating; enforcing and imposing rules; incentives and initiatives; pledges, commitments and committing; agreements and summits; activists.",
    "法规和监管；执行和强加规定；激励措施和倡议；承诺和保证；协议和峰会；活动人士。",
  ),
  prerequisites: ["b1-words-taking-action"],
  words: [
    word(
      "regulation regulations",
      "an official rule; the control of something by rules",
      "规章；法规；监管",
      "New {regulations} limit the pollution from factories.|summits activists | The {regulation} of fishing protects the stocks.|summit activist | EU {regulations} ban some pesticides.|summits incentives",
      "regularity relegation",
      "agreement",
    ),
    word(
      "regulate regulates regulated regulating",
      "to control something by rules",
      "管理；调控；监管",
      "The government {regulates} the use of water.|pledges summits | Laws {regulate} how much smoke a factory may emit.|pledge summit | The industry is poorly {regulated}.|pledged summited",
      "regular circulate",
      "enforce",
    ),
    word(
      "enforce enforces enforced enforcing",
      "to make sure that people obey a law or rule",
      "执行；强制实施",
      "The police {enforce} the speed limit with cameras.|pledge commit | The ban on fishing is hard to {enforce}.|pledge commit | The rules were never {enforced}.|pledged committed",
      "reinforce endorse",
      "regulate impose",
    ),
    word(
      "impose imposes imposed imposing",
      "to introduce a rule, tax or punishment that people must accept",
      "强制推行；征（税）",
      "The government {imposed} a tax on plastic bags.|committed regulated | The city {imposes} fines on drivers who pollute.|pledges commits | Rich countries should not {impose} their rules on poor ones.|pledge commit",
      "propose suppose",
      "enforce",
    ),
    word(
      "incentive incentives",
      "something that encourages people to do something, such as money",
      "激励；鼓励措施",
      "Tax {incentives} encourage people to buy electric cars.|summits activists | There is little {incentive} to save energy when it is cheap.|summit activist | The grant is an {incentive} for farmers to plant trees.|activist summit",
      "incense intensive",
      "initiative",
    ),
    word(
      "initiative initiatives",
      "a new plan or action to deal with a problem",
      "倡议；新方案；主动性",
      "The city launched an {initiative} to plant a million trees.|activist agreement | Local {initiatives} have cleaned up the river.|activists summits | She took the {initiative} and organized a beach clean-up.|summit activist",
      "initial inactive",
      "incentive",
    ),
    word(
      "pledge pledges pledged pledging",
      "a serious promise; to promise seriously",
      "保证；誓言；承诺",
      "Leaders {pledged} to cut emissions by half.|imposed enforced | The company made a {pledge} to stop using plastic.|summit activist | Twenty countries signed the {pledge}.|summit activist",
      "plead sledge",
      "commitment commit",
    ),
    word(
      "commitment commitments",
      "a promise to do something; being willing to give time and energy to something",
      "承诺；投入；献身",
      "The country made a {commitment} to protect its forests.|activist summit | Her {commitment} to the cause is impressive.|summit incentive | We need real {commitments}, not just words.|summits activists",
      "commission comment",
      "pledge",
    ),
    word(
      "commit commits committed committing",
      "to promise to do something; to do something wrong or illegal",
      "承诺；致力于；犯（罪）",
      "The government has {committed} to closing coal plants.|imposed regulated | Both sides {committed} to the plan.|imposed enforced | He {committed} a crime.|imposed regulated",
      "comment admit",
      "pledge",
    ),
    word(
      "agreement agreements",
      "an arrangement or promise between people or countries",
      "协议；一致",
      "The Paris {Agreement} was signed in 2015.|Activist Incentive | The two countries reached an {agreement} on fishing.|activist incentive | We are in {agreement} about the main points.|incentive summit",
      "argument agreeable",
      "regulation",
    ),
    word(
      "summit summits",
      "an important meeting between the leaders of countries",
      "峰会；顶峰",
      "World leaders met at a climate {summit}.|incentive regulation | The {summit} ended without an agreement.|incentive activist | We climbed to the {summit} of the mountain.|incentive initiative",
      "submit summary",
    ),
    word(
      "activist activists",
      "a person who works to bring about political or social change",
      "活动人士；积极分子",
      "Climate {activists} marched through the city.|summits regulations | The young {activist} spoke at the conference.|summit incentive | {Activists} blocked the road to the mine.|Summits Incentives",
      "active actress",
    ),
  ],
});

const disasters = vocabularyTopic({
  id: "b2-words-disasters",
  title: t("Natural Disasters", "自然灾害"),
  summary: t(
    "Catastrophes and catastrophic events; devastating storms; shelters, evacuating and evacuation; the aftermath; casualties and debris; landslides, avalanches and cyclones.",
    "大灾难和灾难性事件；毁灭性的风暴；避难所、撤离；灾后余波；伤亡和残骸；山体滑坡、雪崩和气旋。",
  ),
  prerequisites: ["b1-words-weather-and-climate"],
  words: [
    word(
      "catastrophe catastrophes",
      "a sudden event that causes great damage or suffering",
      "大灾难；灾祸",
      "The flood was a {catastrophe} for the region.|debris shelter | Scientists warn of a climate {catastrophe}.|debris shelter | The war was a human {catastrophe}.|debris aftermath",
      "catalogue apostrophe",
      "catastrophic",
    ),
    word(
      "catastrophic",
      "causing great damage or suffering",
      "灾难性的",
      "The earthquake had {catastrophic} effects.|evacuated devastated | Rising seas could be {catastrophic} for island nations.|evacuated sheltered | The fire caused {catastrophic} damage.|evacuated sheltered",
      "catastrophe acrobatic",
      "catastrophe",
    ),
    word(
      "devastate devastates devastated devastating",
      "to destroy or damage something badly; to make someone very sad",
      "摧毁；使极度悲伤",
      "The hurricane {devastated} the coast.|evacuated sheltered | A {devastating} fire destroyed the forest.|evacuating sheltering | She was {devastated} by the news.|evacuated sheltered",
      "decorate deviate",
    ),
    word(
      "shelter shelters",
      "a place that protects people from bad weather or danger",
      "避难所；庇护",
      "Families slept in a {shelter} during the storm.|debris casualty | The school became a {shelter} for flood victims.|debris casualty | We took {shelter} under a bridge.|debris aftermath",
      "shutter smelter",
    ),
    word(
      "evacuate evacuates evacuated evacuating",
      "to move people from a dangerous place to a safe one",
      "疏散；撤离",
      "Thousands of people were {evacuated} before the cyclone.|devastated sheltered | Police {evacuated} the building.|devastated sheltered | The town must {evacuate} if the river rises.|devastate casualty",
      "evaporate evaluate",
      "evacuation",
    ),
    word(
      "evacuation evacuations",
      "the act of moving people from a dangerous place",
      "疏散；撤离",
      "The {evacuation} of the island took two days.|aftermath debris | The mayor ordered an {evacuation}.|aftermath debris | {Evacuation} routes are marked in green.|Aftermath Debris",
      "evaporation evaluation",
      "evacuate",
    ),
    word(
      "aftermath",
      "the period after a bad event, and its effects",
      "后果；余波",
      "In the {aftermath} of the flood, disease spread.|debris shelter | The country is still dealing with the {aftermath} of the war.|debris shelter | Many people lost their jobs in the {aftermath} of the storm.|debris casualty",
      "afterward mathematics",
    ),
    word(
      "casualty casualties",
      "a person who is hurt or killed in an accident, a disaster or a war",
      "伤亡人员",
      "There were no {casualties} in the landslide.|debris aftermaths | The earthquake caused hundreds of {casualties}.|debris shelters | Doctors treated the {casualties} at the scene.|debris aftermaths",
      "casual causality",
    ),
    word(
      "debris",
      "broken pieces left after something has been destroyed",
      "残骸；碎片",
      "The streets were covered in {debris} after the storm.|casualties shelters | Workers cleared the {debris} from the road.|aftermath cyclones | {Debris} from the building fell onto cars.|Casualties Shelters",
      "debit derby",
    ),
    word(
      "landslide landslides",
      "a mass of earth and rock that falls down a hill or mountain",
      "山体滑坡；压倒性胜利",
      "Heavy rain caused a {landslide} that blocked the road.|cyclone casualty | The village was buried by a {landslide}.|cyclone shelter | Cutting down trees makes {landslides} more likely.|cyclones shelters",
      "landscape landmark",
      "avalanche",
    ),
    word(
      "avalanche avalanches",
      "a large mass of snow that falls down a mountain",
      "雪崩",
      "Two skiers were caught in an {avalanche}.|cyclone aftermath | The {avalanche} buried the mountain hut.|cyclone shelter | Warm weather increases the risk of {avalanches} in spring.|cyclones shelters",
      "avenue ambulance",
      "landslide",
    ),
    word(
      "cyclone cyclones",
      "a violent tropical storm with very strong circular winds",
      "气旋；热带风暴",
      "The {cyclone} hit the coast with winds of 200 km/h.|landslide avalanche | {Cyclones} are common in the Bay of Bengal.|Landslides Avalanches | Fishermen stayed in port as the {cyclone} approached.|landslide avalanche",
      "cycle cylinder",
    ),
  ],
});

const water = vocabularyTopic({
  id: "b2-words-water",
  title: t("Water", "水资源"),
  summary: t(
    "Freshwater and groundwater; reservoirs and dams; flooding; water scarcity; drinkable water; purifying and filtering it; sanitation; desalination; tides.",
    "淡水和地下水；水库和水坝；洪水；水资源短缺；可饮用的水；净化和过滤；卫生设施；海水淡化；潮汐。",
  ),
  prerequisites: ["b1-words-nature-2"],
  words: [
    word(
      "freshwater",
      "water that is not salty, in rivers and lakes; living in such water",
      "淡水（的）",
      "Only 3% of the earth's water is {freshwater}.|sanitation scarcity | Trout are {freshwater} fish.|drinkable tide | The {freshwater} lakes are drying up.|scarcity tide",
      "freshman saltwater",
      "groundwater",
    ),
    word(
      "groundwater",
      "water that is held under the ground in soil and rock",
      "地下水",
      "Wells pump {groundwater} to the surface.|sanitation desalination | Farms are using {groundwater} faster than rain can replace it.|sanitation scarcity | Chemicals have polluted the {groundwater}.|sanitation scarcity",
      "background undergrowth",
      "freshwater",
    ),
    word(
      "reservoir reservoirs",
      "a large lake, often made by people, where water is stored",
      "水库；蓄水池",
      "The {reservoir} supplies water to the whole city.|tide sanitation | After the dry summer, the {reservoirs} are half empty.|tides sanitations | They built a {reservoir} in the valley.|tide scarcity",
      "reserve receiver",
      "dam",
    ),
    word(
      "dam dams",
      "a wall built across a river to hold back water",
      "水坝；堤坝",
      "The {dam} produces electricity for millions.|tide scarcity | They built a {dam} across the river.|tide sanitation | Old {dams} are being removed so that fish can swim upstream.|tides scarcities",
      "damn damp",
      "reservoir",
    ),
    word(
      "flooding",
      "the covering of land by water",
      "洪水泛滥；淹没",
      "Heavy rain caused {flooding} in the valley.|sanitation desalination | The town has new walls to prevent {flooding}.|sanitation desalination | Coastal {flooding} will become more common.|sanitation desalination",
      "floating flowing",
    ),
    word(
      "scarcity",
      "a lack of something that people need",
      "缺乏；短缺",
      "Water {scarcity} affects a third of the world.|sanitation flooding | The {scarcity} of food led to high prices.|sanitation tide | Some regions face severe {scarcity} of clean water.|tide reservoir",
      "scariness security",
    ),
    word(
      "drinkable",
      "clean and safe enough to drink",
      "可饮用的",
      "Is the tap water here {drinkable}?|sanitation desalination | After the flood, the water was no longer {drinkable}.|scarcity sanitation | The machine makes seawater {drinkable}.|scarcity sanitation",
      "drinking drunken",
    ),
    word(
      "purify purifies purified purifying",
      "to make something clean by removing harmful substances",
      "净化；提纯",
      "Plants in the wetland {purify} the water.|flood tide | The water is {purified} before it reaches your tap.|flooded dammed | Boiling helps to {purify} water.|flood dam",
      "pacify putrefy",
      "filter",
    ),
    word(
      "filter filters filtered filtering",
      "a device that removes dirt from liquid or air; to pass something through one",
      "过滤器；过滤",
      "We {filter} the water before we drink it.|flood dam | The {filter} removes bacteria and dirt.|dam tide | Rain is {filtered} through layers of rock.|flooded dammed",
      "fillet fitter",
      "purify",
    ),
    word(
      "sanitation",
      "systems for keeping places clean, especially for removing human waste",
      "卫生设施；环境卫生",
      "Poor {sanitation} spreads disease.|scarcity flooding | Billions of people lack basic {sanitation}.|flooding desalination | The city invested in clean water and {sanitation}.|flooding scarcity",
      "sanity salutation",
    ),
    word(
      "desalination",
      "the process of removing salt from seawater",
      "海水淡化",
      "{Desalination} turns seawater into drinking water.|Sanitation Flooding | {Desalination} plants use a lot of energy.|Sanitation Scarcity | The country gets most of its water from {desalination}.|sanitation flooding",
      "destination designation",
    ),
    word(
      "tide tides",
      "the regular rise and fall of the level of the sea",
      "潮汐；潮流",
      "At low {tide} you can walk to the island.|dam reservoir | The {tide} comes in twice a day.|dam reservoir | Strong {tides} can be used to produce electricity.|dams reservoirs",
      "tidy tile",
    ),
  ],
});

const causes = vocabularyTopic({
  id: "b2-words-cause-and-effect",
  title: t("Words of Cause and Effect", "表示因果的词"),
  summary: t(
    "Contributing to something and contributions; triggering and deriving; consequences and implications; influencing; accelerating, intensifying and worsening; diminishing and alleviating.",
    "促成和贡献；引发和来源；后果和影响；影响；加速、加剧和恶化；减少和缓解。",
  ),
  prerequisites: ["b1-words-describing-change"],
  words: [
    word(
      "contribute contributes contributed contributing",
      "to be one of the causes of something; to give something to help",
      "促成；贡献；捐献",
      "Cars {contribute} to air pollution.|derive alleviate | Many factors {contributed} to the flood.|derived alleviated | Everyone {contributed} money for the new well.|derived diminished",
      "distribute constitute",
    ),
    word(
      "contribution contributions",
      "something you give or do to help; a part in causing something",
      "贡献；捐款；促成作用",
      "Farming makes a large {contribution} to emissions.|implication consequence | Thank you for your {contribution} to the project.|implication consequence | Small {contributions} add up.|implications consequences",
      "distribution construction",
    ),
    word(
      "trigger triggers triggered triggering",
      "to make something start to happen, often suddenly",
      "引发；触发",
      "The earthquake {triggered} a landslide.|derived diminished | Heat can {trigger} a headache.|derive contribute | The price rise {triggered} protests.|derived contributed",
      "tiger trickle",
    ),
    word(
      "derive derives derived deriving",
      "to get something from something else; to come from it",
      "获得；源自",
      'Much of the country\'s energy is {derived} from coal.|triggered accelerated | We {derive} great pleasure from the garden.|trigger worsen | The word "ecology" {derives} from Greek.|triggers worsens',
      "drive deprive",
    ),
    word(
      "consequence consequences",
      "a result of something, often a bad one",
      "后果；结果",
      "Rising seas are a {consequence} of global warming.|contribution trigger | He acted without thinking of the {consequences}.|contributions triggers | The decision had serious {consequences} for farmers.|contributions triggers",
      "sequence confidence",
      "implication",
    ),
    word(
      "implication implications",
      "a possible effect of an action or decision; something suggested without being said",
      "可能的影响；含意",
      "The new law has important {implications} for farmers.|contributions triggers | Have you thought about the {implications} of this plan?|contributions triggers | The study has {implications} for the whole industry.|contributions triggers",
      "application complication",
      "consequence",
    ),
    word(
      "influence influences influenced influencing",
      "to have an effect on what someone does or what happens; the effect itself",
      "影响",
      "The ocean {influences} the weather on land.|derives diminishes | Her parents {influenced} her choice of career.|derived alleviated | Advertising has a strong {influence} on children.|derive trigger",
      "influenza affluence",
    ),
    word(
      "accelerate accelerates accelerated accelerating",
      "to happen or make something happen faster",
      "加速；加快",
      "Warming has {accelerated} the melting of the ice.|derived alleviated | The car {accelerated} onto the highway.|derived alleviated | The government wants to {accelerate} the switch to clean energy.|derive alleviate",
      "accumulate exaggerate",
      "intensify",
    ),
    word(
      "intensify intensifies intensified intensifying",
      "to become or make something stronger or more extreme",
      "加剧；增强",
      "The storm {intensified} as it moved toward the coast.|derived alleviated | Police {intensified} the search.|derived alleviated | The drought has {intensified} the conflict over water.|derived alleviated",
      "identify intend",
      "worsen accelerate",
    ),
    word(
      "worsen worsens worsened worsening",
      "to become or make something worse",
      "恶化；使更糟",
      "The air quality {worsened} during the heatwave.|derived alleviated | Cutting trees will {worsen} the flooding.|derive alleviate | His health is {worsening}.|deriving contributing",
      "worship loosen",
      "intensify",
    ),
    word(
      "diminish diminishes diminished diminishing",
      "to become or make something smaller or weaker",
      "减少；减弱",
      "The supply of fresh water is {diminishing}.|accelerating triggering | The pain {diminished} after a few days.|accelerated triggered | Nothing can {diminish} her achievement.|accelerate trigger",
      "diminutive finish",
      "alleviate",
    ),
    word(
      "alleviate alleviates alleviated alleviating",
      "to make pain or a problem less severe",
      "缓解；减轻",
      "The new dam will {alleviate} water shortages.|accelerate derive | The medicine {alleviated} her pain.|accelerated triggered | Trees in cities {alleviate} the effects of heat.|derive contribute",
      "elevate alienate",
      "diminish",
    ),
  ],
});

const future = vocabularyTopic({
  id: "b2-words-the-future",
  title: t("The Future of the Earth", "地球的未来"),
  summary: t(
    "Inevitable, irreversible and unprecedented change; the foreseeable future; long-term and short-term effects; potential and potentially; projected figures; scenarios, prospects and the outlook.",
    "不可避免、不可逆转和前所未有的变化；可预见的将来；长期和短期影响；潜在的；预计的数字；情景、前景和展望。",
  ),
  prerequisites: ["b1-words-change"],
  words: [
    word(
      "inevitable",
      "certain to happen; impossible to avoid",
      "不可避免的",
      "Some warming is now {inevitable}.|potentially scenario | Change is {inevitable}, so we must prepare for it.|potentially outlook | It was {inevitable} that prices would rise.|potentially scenario",
      "invisible inedible",
      "irreversible",
    ),
    word(
      "irreversible",
      "impossible to change back to how it was before",
      "不可逆转的",
      "The damage to the reef may be {irreversible}.|potentially outlook | Extinction is {irreversible}.|potentially prospect | Some changes to the climate are already {irreversible}.|potentially scenario",
      "irresistible reversible",
      "inevitable",
    ),
    word(
      "unprecedented",
      "never having happened before",
      "前所未有的；空前的",
      "The heat this summer was {unprecedented}.|potentially outlook | The city is growing at an {unprecedented} rate.|outlook potentially | The crisis led to {unprecedented} cooperation.|potentially outlook",
      "unpresented unrepresented",
    ),
    word(
      "foreseeable",
      "that can be known or planned for in advance",
      "可预见的",
      "Prices will stay high for the {foreseeable} future.|unprecedented irreversible | The risks were {foreseeable}, but nobody acted.|potentially scenario | In the {foreseeable} future, coal will still be used.|unprecedented irreversible",
      "forgettable forcible",
    ),
    word(
      "long-term",
      "lasting or having an effect over a long time",
      "长期的",
      "We need a {long-term} plan for water.|outlook potentially | The {long-term} effects of the drug are unknown.|outlook potentially | Planting trees is a {long-term} investment.|potentially scenario",
      "longing long-lost",
    ),
    word(
      "short-term",
      "lasting or having an effect for a short time",
      "短期的",
      "Cheap energy is only a {short-term} solution.|potentially outlook | The company cares only about {short-term} profits.|potentially scenario | Rain brought {short-term} relief from the drought.|potentially outlook",
      "shortage short-lived",
    ),
    word(
      "potential",
      "possible in the future; the possibility of developing",
      "潜在的；潜力",
      "Wind farms have the {potential} to supply all our power.|scenario outlook | The scheme has {potential} risks.|potentially outlook | She has great {potential} as a scientist.|scenario projected",
      "potent potion",
      "potentially",
    ),
    word(
      "potentially",
      "possibly, in the future",
      "潜在地；可能地",
      "The new virus is {potentially} dangerous.|inevitable projected | This could {potentially} save millions of lives.|inevitable foreseeable | Rising seas are {potentially} a disaster for coastal cities.|unprecedented foreseeable",
      "partially potently",
      "potential",
    ),
    word(
      "projected",
      "planned or expected for the future, based on present figures",
      "预计的；规划的",
      "The {projected} rise in sea level is one meter.|potentially scenario | The city's population is {projected} to double.|inevitable foreseeable | {Projected} costs have risen sharply.|Potentially Scenario",
      "protected rejected",
    ),
    word(
      "scenario scenarios",
      "a description of what could possibly happen",
      "情景；设想；方案",
      "In the worst {scenario}, the city would flood.|outlook prospect | Scientists modeled three {scenarios} for 2100.|outlooks prospects | The best-case {scenario} is that temperatures stabilize.|outlook prospect",
      "scenery sanctuary",
    ),
    word(
      "prospect prospects",
      "the possibility that something will happen; chances of success in the future",
      "前景；可能性",
      "There is little {prospect} of rain this week.|scenario outlook | The {prospect} of losing their homes frightened people.|outlook foreseeable | Young people's job {prospects} are improving.|scenarios potentially",
      "prospectus respect",
      "outlook",
    ),
    word(
      "outlook outlooks",
      "what is likely to happen in the future; a way of thinking about life",
      "前景；展望；观点",
      "The economic {outlook} is good.|scenario projected | The weather {outlook} for the weekend is dry.|scenario prospect | She has a positive {outlook} on life.|scenario prospect",
      "outlet lookout",
      "prospect",
    ),
  ],
});

const materials = vocabularyTopic({
  id: "b2-words-materials-2",
  title: t("Raw Materials and Fabrics", "原料和织物"),
  summary: t(
    "Timber; fabrics and textiles; synthetic materials and polyester; ceramics; minerals and ores; iron, copper and alloys; crude oil.",
    "木材；织物和纺织品；合成材料和聚酯纤维；陶瓷；矿物和矿石；铁、铜和合金；原油。",
  ),
  prerequisites: ["a2-words-materials"],
  words: [
    word(
      "timber",
      "wood used for building or making things",
      "木材；木料",
      "The house is built of {timber} from local forests.|ore alloy | {Timber} is a renewable material if forests are replanted.|Ore Copper | Illegal {timber} is cut from protected forests.|ore copper",
      "timer limber",
    ),
    word(
      "fabric fabrics",
      "cloth, or a type of cloth",
      "织物；布料",
      "The dress is made of a light {fabric}.|ore alloy | Cotton is a natural {fabric}.|ore alloy | She chose a blue {fabric} for the curtains.|ore mineral",
      "fabricate fabulous",
      "textile polyester",
    ),
    word(
      "textile textiles",
      "cloth made by weaving or knitting; the industry that makes cloth",
      "纺织品；纺织业",
      "The {textile} industry makes cloth from cotton and wool.|timber ore | The town's factories once produced fine cotton {textiles}.|ores alloys | {Textile} waste fills many landfills.|Ore Alloy",
      "texture textbook",
      "fabric",
    ),
    word(
      "synthetic",
      "made by people from chemicals, not natural",
      "合成的；人造的",
      "Nylon is a {synthetic} material.|crude ceramic | {Synthetic} fibers release tiny pieces of plastic in the wash.|Crude Ceramic | The rubber is {synthetic}, not natural.|crude ceramic",
      "sympathetic synthesis",
    ),
    word(
      "ceramic ceramics",
      "made of clay that has been baked hard; objects made in this way",
      "陶瓷（的）",
      "The kitchen floor has {ceramic} tiles.|crude polyester | She makes {ceramics} in her studio.|alloys ores | {Ceramic} plates last for years.|Polyester Crude",
      "cinematic cereal",
    ),
    word(
      "mineral minerals",
      "a natural substance, such as gold or salt, found in the earth; a substance the body needs",
      "矿物；矿物质",
      "The mountains are rich in {minerals}.|fabrics textiles | Milk contains {minerals} such as calcium.|fabrics alloys | {Mineral} water comes from underground springs.|Fabric Textile",
      "miner general",
      "ore",
    ),
    word(
      "ore ores",
      "rock from which metal can be taken",
      "矿石",
      "Iron {ore} is shipped to China.|fabric timber | The mine produces copper {ore}.|fabric textile | The {ore} is crushed and heated to get the metal.|fabric timber",
      "oar core",
      "mineral",
    ),
    word(
      "iron",
      "a hard grey metal used to make steel",
      "铁",
      "Steel is made from {iron}.|fabric timber | The old bridge is made of {iron}.|fabric textile | Spinach contains a lot of {iron}.|timber polyester",
      "irony icon",
      "copper",
    ),
    word(
      "copper",
      "a soft reddish-brown metal used for electric wires and pipes",
      "铜",
      "Electric wires are made of {copper}.|timber fabric | {Copper} pipes carry water through the house.|Timber Fabric | The statue is covered in {copper}, which has turned green.|timber fabric",
      "cooper chopper",
      "iron",
    ),
    word(
      "alloy alloys",
      "a metal made by mixing two or more metals",
      "合金",
      "Bronze is an {alloy} of copper and tin.|iron timber | The bike frame is made of a light {alloy}.|ore fabric | Steel is an {alloy} of iron and carbon.|iron fabric",
      "ally allow",
    ),
    word(
      "crude",
      "in its natural state, before being processed (crude oil); simple and rough",
      "天然的；未加工的；粗糙的",
      "The price of {crude} oil fell last month.|synthetic ceramic | The tanker spilled thousands of tons of {crude} oil.|ceramic synthetic | They built a {crude} shelter from branches.|synthetic ceramic",
      "cruel rude",
    ),
    word(
      "polyester",
      "a synthetic fabric made from oil",
      "聚酯纤维；涤纶",
      "The shirt is 50% cotton and 50% {polyester}.|timber copper | {Polyester} is cheap but takes centuries to break down.|Timber Copper | Many cheap clothes are made of {polyester}.|timber ore",
      "polystyrene polish",
      "fabric",
    ),
  ],
});

// The future continuous and the future perfect.

const joinWords = (...parts: readonly string[]) => parts.filter((p) => p !== "").join(" ");
const pronouns = new Set(["I", "you", "he", "she", "it", "we", "they"]);
const willOf = (subject: string) => (pronouns.has(subject) ? `[${subject} will|${subject}'ll]` : `${subject} will`);

type Aspect = "perfect" | "continuous";

const cueOfAspect: Readonly<Record<Aspect, string>> = {
  perfect: "(It will be finished before then.)",
  continuous: "(It will be in progress at that time.)",
};

/** futures are a time, the subject, the base form, the -ing form and the past participle of the verb, the rest, the aspect and has or have. */
const futures: readonly (readonly [string, string, string, string, string, string, Aspect, string])[] = [
  ["By 2050", "most glaciers in the Alps", "melt", "melting", "melted", "", "perfect", "have"],
  ["By 2030", "the city", "ban", "banning", "banned", "petrol cars", "perfect", "has"],
  ["By the end of the year", "we", "install", "installing", "installed", "solar panels on every school", "perfect", "have"],
  ["By next summer", "the company", "cut", "cutting", "cut", "its emissions by half", "perfect", "has"],
  ["By the time you arrive", "the meeting", "finish", "finishing", "finished", "", "perfect", "has"],
  ["By 2040", "the country", "close", "closing", "closed", "all its coal power stations", "perfect", "has"],
  ["By Friday", "I", "write", "writing", "written", "the report", "perfect", "have"],
  ["By the end of the century", "sea levels", "rise", "rising", "risen", "by at least half a meter", "perfect", "have"],
  ["By next month", "the volunteers", "plant", "planting", "planted", "ten thousand trees", "perfect", "have"],
  ["By the time the law changes", "many species", "disappear", "disappearing", "disappeared", "", "perfect", "have"],
  ["By 2035", "electric cars", "replace", "replacing", "replaced", "most petrol cars", "perfect", "have"],
  ["By tomorrow evening", "the storm", "pass", "passing", "passed", "", "perfect", "has"],
  ["By the end of the decade", "the town", "build", "building", "built", "a new wind farm", "perfect", "has"],
  ["By the time she retires", "she", "teach", "teaching", "taught", "for forty years", "perfect", "has"],
  ["By the end of this week", "we", "collect", "collecting", "collected", "two tons of plastic from the beach", "perfect", "have"],
  ["By 2045", "the government", "spend", "spending", "spent", "billions on flood defenses", "perfect", "has"],
  ["By the time the summit begins", "the ministers", "agree", "agreeing", "agreed", "on a plan", "perfect", "have"],
  ["By next spring", "the river", "recover", "recovering", "recovered", "from the pollution", "perfect", "has"],
  ["By the end of the trip", "they", "see", "seeing", "seen", "three glaciers", "perfect", "have"],
  ["By midnight", "the firefighters", "put", "putting", "put", "out the fire", "perfect", "have"],
  ["By 2060", "the population of the city", "double", "doubling", "doubled", "", "perfect", "has"],
  ["This time next year", "we", "live", "living", "lived", "on solar power", "continuous", "are"],
  ["At eight o'clock tomorrow", "I", "fly", "flying", "flown", "to Oslo", "continuous", "am"],
  ["This time next week", "the students", "take", "taking", "taken", "their exams", "continuous", "are"],
  ["At noon on Saturday", "the activists", "march", "marching", "marched", "through the city", "continuous", "are"],
  ["When you arrive", "we", "have", "having", "had", "dinner", "continuous", "are"],
  ["This time tomorrow", "the delegates", "discuss", "discussing", "discussed", "the new treaty", "continuous", "are"],
  ["At midnight", "the team", "watch", "watching", "watched", "the river levels", "continuous", "is"],
  ["In July", "she", "work", "working", "worked", "on a farm in Kenya", "continuous", "is"],
  ["Next winter", "they", "study", "studying", "studied", "glaciers in Iceland", "continuous", "are"],
  ["This time on Monday", "I", "sit", "sitting", "sat", "in a meeting about the budget", "continuous", "am"],
  ["From nine to five tomorrow", "the engineers", "test", "testing", "tested", "the new turbine", "continuous", "are"],
  ["When the summit opens", "protesters", "wait", "waiting", "waited", "outside", "continuous", "are"],
  ["This time next month", "the farmers", "harvest", "harvesting", "harvested", "the rice", "continuous", "are"],
  ["Tomorrow afternoon", "he", "give", "giving", "given", "a talk on climate change", "continuous", "is"],
  ["This time next year", "you", "travel", "traveling", "traveled", "around South America", "continuous", "are"],
  ["At ten tonight", "the scientists", "measure", "measuring", "measured", "the ozone", "continuous", "are"],
  ["In 2030", "many cities", "run", "running", "run", "on clean energy", "continuous", "are"],
  ["On Sunday morning", "I", "play", "playing", "played", "tennis", "continuous", "am"],
  ["When the plane lands", "it", "rain", "raining", "rained", "in Beijing", "continuous", "is"],
  ["This time next week", "we", "swim", "swimming", "swum", "in the sea", "continuous", "are"],
];

const pastOf: Readonly<Record<string, string>> = {
  write: "wrote",
  rise: "rose",
  see: "saw",
  fly: "flew",
  take: "took",
  give: "gave",
  swim: "swam",
  run: "ran",
};

const futureOf = (aspect: Aspect, ing: string, pp: string) => (aspect === "perfect" ? `will have ${pp}` : `will be ${ing}`);

const aspectChoice: readonly ChoiceItem[] = interleave([
  futures.filter((f) => f[6] === "perfect"),
  futures.filter((f) => f[6] === "continuous"),
]).map(([time, s, , ing, pp, rest, aspect, now]): ChoiceItem => {
  const wrong = aspect === "perfect" ? [`will be ${ing}`, `${now} ${pp}`] : [`will have ${pp}`, `will ${ing}`];
  return [`${time}, ${joinWords(s, "___", rest)}. ${cueOfAspect[aspect]}`, futureOf(aspect, ing, pp), wrong];
});

const formChoice: readonly ChoiceItem[] = interleave([
  futures.filter((f) => f[6] === "continuous"),
  futures.filter((f) => f[6] === "perfect"),
]).map(([time, s, base, ing, pp, rest, aspect]): ChoiceItem => {
  const past = pastOf[base] ?? pp;
  const wrong =
    aspect === "perfect"
      ? [`will had ${pp}`, past !== pp ? `will have ${past}` : `will have ${base === pp ? `${pp}ed` : base}`]
      : [`will be ${base}`, `will ${ing}`];
  return [`${time}, ${joinWords(s, "___", rest)}.`, futureOf(aspect, ing, pp), wrong];
});

const futureTyped: readonly TypedItem[] = interleave([
  futures.filter((f) => f[6] === "perfect"),
  futures.filter((f) => f[6] === "continuous"),
]).map(([time, s, base, ing, pp, rest, aspect]): TypedItem => {
  const verb = aspect === "perfect" ? `have ${pp}` : `be ${ing}`;
  return {
    shown: `${time} / ${s} / ${joinWords(base, rest)} ${cueOfAspect[aspect]}`,
    accepted: [`${time}(,) ${joinWords(willOf(s), verb, rest)}.`],
    canonical: `${time}, ${joinWords(s, "will", verb, rest)}.`,
    wrong: [
      `${time}, ${joinWords(s, "will", aspect === "perfect" ? `be ${ing}` : `have ${pp}`, rest)}.`,
      `${time}, ${joinWords(s, "will", base, rest)}.`,
    ],
  };
});

/** futureRule names the future form of right, with the time at the start of the sentence. */
function futureRule(right: string, sentence: string): Text {
  const time = sentence.split(",")[0] ?? "";
  return right.includes(" have ")
    ? t(
        `The action will be finished by then (*${time}*), so use the future perfect, *will have* and the past participle`,
        `到那时（*${time}*）动作已经完成，所以用将来完成时，即 *will have* 加过去分词`,
      )
    : t(
        `The action will be in progress then (*${time}*), so use the future continuous, *will be* and the *-ing* form`,
        `那时（*${time}*）动作正在进行，所以用将来进行时，即 *will be* 加 *-ing*`,
      );
}

/** futureWhy puts the rule of the future form before a sentence. */
const futureWhy = (right: string, shown: string, sentence: string): Text => {
  const rule = futureRule(right, shown);
  return t(`${rule.en}: ${sentence}`, `${rule["zh-CN"]}：${sentence}`);
};

/** whyNotFuture explains the other future form, or a form of will that is not made right. */
const whyNotFuture = (wrong: string, right: string, shown: string): Text => {
  const rule = futureRule(right, shown);
  const [w0, w1 = "", w2 = ""] = wrong.split(" ");
  const perfect = right.includes(" have ");
  let first: Text;
  if (w0 !== "will") first = t(`*${wrong}* has no *will*, but the time is in the future.`, `*${wrong}* 没有 *will*，但说的是将来的时间。`);
  else if (w1 === "had")
    first = t("After *will* the verb is in its base form: *have*, not *had*.", "*will* 后面的动词用原形：用 *have*，不用 *had*。");
  else if (w1.endsWith("ing")) first = t("*will* needs *be* before the *-ing* form.", "*will* 和 *-ing* 之间要有 *be*。");
  else if (w1 === "be" && !w2.endsWith("ing"))
    first = t(`*be* is followed by the *-ing* form, not *${w2}*.`, `*be* 后面接 *-ing* 形式，不接 *${w2}*。`);
  else if (w1 === "be" && perfect)
    first = t(
      `*${wrong}* is the future continuous, for an action still in progress then.`,
      `*${wrong}* 是将来进行时，表示那时动作还在进行。`,
    );
  else if (w1 === "have" && !perfect)
    first = t(
      `*${wrong}* is the future perfect, for an action already finished by then.`,
      `*${wrong}* 是将来完成时，表示那时动作已经完成。`,
    );
  else first = t(`*${w2}* is not the past participle.`, `*${w2}* 不是过去分词。`);
  return t(`${first.en} ${rule.en}.`, `${first["zh-CN"]}${rule["zh-CN"]}。`);
};

const futureForms: TopicDef = {
  id: "future-continuous-and-future-perfect",
  title: t("Will Be Doing, Will Have Done", "will be doing 和 will have done"),
  summary: t(
    "By 2050 the glacier will have melted. This time next year we will be living on solar power. The future perfect says what will be finished by a time; the future continuous says what will be in progress at a time.",
    "By 2050 the glacier will have melted. This time next year we will be living on solar power。将来完成时说到某时已经完成的事，将来进行时说某时正在进行的事。",
  ),
  prerequisites: ["will-for-the-future", "present-perfect-or-past-simple"],
  encompasses: [
    { topic: "will-for-the-future", weight: 0.3 },
    { topic: "present-perfect-or-past-simple", weight: 0.2 },
  ],
  xp: 30,
  strand: "grammar",
  knowledgePoints: [
    point(
      "meaning",
      t("Finished or in progress", "已完成还是正在进行"),
      t(
        "Both forms look at one moment in the future:\n\n- **will have + past participle** (the future perfect): the action will be **finished before** that moment. It often comes with *by*: *By 2050 most glaciers **will have melted**. By Friday I **will have written** the report.*\n- **will be + -ing** (the future continuous): the action will be **in progress at** that moment: *This time next year we **will be living** on solar power. At eight tomorrow I **will be flying** to Oslo.*\n\nA future time needs *will*: not *By 2050 most glaciers have melted*.",
        "两种形式都着眼于将来的某一时刻：\n\n- **will have + 过去分词**（将来完成时）：动作在那一刻**之前已经完成**，常和 *by*（到……为止）连用：*By 2050 most glaciers **will have melted**. By Friday I **will have written** the report.*\n- **will be + -ing**（将来进行时）：动作在那一刻**正在进行**：*This time next year we **will be living** on solar power. At eight tomorrow I **will be flying** to Oslo.*\n\n中文说“到 2050 年冰川就已经融化了”“明天八点我正在飞往奥斯陆”，靠“已经”“正在”表示；英语要靠动词形式。说将来的时间一定要用 *will*，不能说 *By 2050 most glaciers have melted*。",
      ),
      choiceGenerator(
        t(
          "The words in brackets say what the action will be like then. Choose the words for the gap.",
          "括号里的话说明那时动作的状态。选出填入空白处的词。",
        ),
        aspectChoice,
        (right, shown) => futureWhy(right, shown, fill(shown, right)),
        whyNotFuture,
      ),
    ),
    point(
      "form",
      t("Forming the two futures", "两种将来时的构成"),
      t(
        "After *will* the verb is always in its base form, so the forms are fixed:\n\n- **will have** + past participle: *will have **gone***, *will have **written***, not *will had gone* or *will have went*.\n- **will be** + -ing: *will be **working***, not *will be work* or *will working*.\n\nThe same forms are used with every subject: *she will have finished*, not *she will has finished*.",
        "*will* 后面的动词永远用原形，所以形式是固定的：\n\n- **will have** + 过去分词：*will have **gone***、*will have **written***，不是 *will had gone*，也不是 *will have went*。\n- **will be** + -ing：*will be **working***，不是 *will be work*，也不是 *will working*。\n\n所有主语都用同样的形式：*she will have finished*，不是 *she will has finished*。",
      ),
      choiceGenerator(
        t("Choose the words for the gap.", "选出填入空白处的词。"),
        formChoice,
        (right, shown) => futureWhy(right, shown, fill(shown, right)),
        whyNotFuture,
      ),
    ),
    point(
      "write",
      t("Writing about the future", "写将来的事"),
      t(
        "Write the sentence from its parts. The words in brackets say whether the action will be finished or in progress: *By 2030 / the city / ban petrol cars (It will be finished before then.)* becomes *By 2030, the city will have banned petrol cars.* *This time next year / we / live on solar power (It will be in progress at that time.)* becomes *This time next year, we will be living on solar power.* The comma after the time is optional, and you may write *we'll* for *we will*.",
        "根据各部分写句子。括号里的话说明动作那时是已完成还是正在进行：*By 2030 / the city / ban petrol cars (It will be finished before then.)* 写成 *By 2030, the city will have banned petrol cars.* *This time next year / we / live on solar power (It will be in progress at that time.)* 写成 *This time next year, we will be living on solar power.* 时间后面的逗号可有可无，*we will* 也可以写成 *we'll*。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Write the sentence with will have or will be.", "用 will have 或 will be 写出句子。"),
        futureTyped,
        (right) => futureWhy(right, right, right),
      ),
    ),
  ],
};

// Writing an opinion essay.

const opinionBank: readonly WritingItem[] = [
  {
    task: "Air travel produces a large share of greenhouse gases. Should governments make flying much more expensive to reduce it?",
    model:
      "Flying has become so cheap that many people now take several flights a year, often for short holidays. Since planes emit large amounts of carbon dioxide, some people argue that governments should raise the price of flying. In my opinion, this would be a fair and effective policy, provided that it is designed carefully.\n\nFirstly, higher prices would reduce the number of unnecessary flights. At present, a ticket to another country can cost less than a train journey within one's own country, which encourages people to fly when other options exist. If a tax made flights more expensive, many travelers would choose trains for short journeys, as they already do in parts of Europe where fast rail lines are available.\n\nSecondly, the money raised could be used to make cleaner travel possible. For example, it could pay for new railway lines or for research into planes that run on hydrogen or biofuels. In this way, the tax would not only discourage pollution but also help to build the alternatives that people need.\n\nAdmittedly, a simple tax might be unfair to poorer families, who would no longer be able to afford a holiday abroad, while the rich would continue to fly as often as before. However, this problem could be solved by taxing frequent flyers more heavily, so that a family's one flight a year would remain cheap.\n\nIn conclusion, I believe that governments should make flying more expensive. As long as the tax falls mainly on those who fly most, it would cut emissions and pay for cleaner ways to travel.",
  },
  {
    task: "Some people say that individuals can do little about climate change and that only governments and large companies can solve it. To what extent do you agree?",
    model:
      "It is often said that recycling a bottle or switching off a light makes no difference when power stations and factories produce most of the world's emissions. I partly agree with this view: governments and companies have the greatest power to change things, but individuals still have an important role to play.\n\nThere is no doubt that the biggest decisions are made by governments and businesses. A single law that closes coal power stations or sets strict rules for car engines can reduce emissions far more than millions of people changing their habits. Similarly, when a large company decides to use renewable energy in all its factories, the effect is enormous.\n\nOn the other hand, the choices of individuals add up. If millions of people eat less meat, travel by train instead of by plane or insulate their homes, the total reduction is significant. Moreover, these choices send a message to companies, which follow what their customers want. The rapid growth of electric cars, for instance, has been driven partly by consumer demand.\n\nFurthermore, individuals are also citizens. They vote, sign petitions and join campaigns, and politicians are unlikely to pass difficult laws unless voters support them. In this sense, the actions of governments depend on the people they represent.\n\nIn conclusion, although governments and large companies are responsible for the most important changes, individuals are far from powerless. Through their daily choices and their votes, ordinary people both reduce emissions directly and push those in power to act.",
  },
  {
    task: "Should all single-use plastic, such as bags, cups and straws, be banned completely?",
    model:
      "Every year millions of tons of plastic end up in the oceans, where they harm fish, birds and other wildlife. Much of this waste comes from items that are used for a few minutes and then thrown away. In my view, most single-use plastic should be banned, although a few exceptions are necessary.\n\nThe main argument for a ban is that these products are rarely needed. Shoppers can carry reusable bags, coffee can be served in washable cups, and most people can drink without a straw. When some countries introduced a charge for plastic bags, their use fell by more than 80 per cent within a year, which shows how easily people can change their habits.\n\nIn addition, recycling has not solved the problem. Only a small proportion of plastic is actually recycled, and much of the rest is burned or sent to landfill, where it takes hundreds of years to break down. Reducing the amount we produce is therefore more effective than trying to deal with it afterwards.\n\nNevertheless, a complete ban on every item would go too far. In hospitals, for example, disposable plastic equipment keeps patients safe from infection. Similarly, some disabled people depend on plastic straws because alternatives such as paper ones are difficult for them to use.\n\nTo conclude, I believe that governments should ban single-use plastic items that can easily be replaced, such as bags and cutlery, while allowing them where they are genuinely needed for health or safety. This would greatly reduce plastic waste without causing unnecessary hardship.",
  },
  {
    task: "Many city centers are crowded with traffic. Should cars be banned from the centers of large cities?",
    model:
      "In many large cities, the center is full of cars from morning until night, causing noise, pollution and long delays. Several cities have already closed their central streets to private cars, and I am convinced that others should follow their example.\n\nThe most important reason is health. Exhaust fumes are one of the main causes of poor air quality in cities, and they are linked to asthma and heart disease. When cars are removed from a city center, the air becomes noticeably cleaner within months, and the risk of accidents involving pedestrians and cyclists falls sharply.\n\nA second reason is that car-free centers are more pleasant places to live and work. Streets that were once used for parking can become squares, gardens and cycle lanes. Contrary to what many shop owners fear, studies have shown that people who walk or cycle tend to visit local shops more often than drivers, so businesses usually benefit rather than suffer.\n\nOf course, a ban must be introduced carefully. Elderly and disabled people need to be able to reach the center, and deliveries must still be possible. These needs can be met by allowing special permits, delivery hours in the early morning and better public transport, such as frequent electric buses.\n\nIn conclusion, banning cars from city centers would make cities healthier, safer and more attractive. Provided that good public transport is available and the needs of certain groups are respected, the advantages clearly outweigh the disadvantages.",
  },
  {
    task: "Some people believe that nuclear power is the best way to replace fossil fuels. Do you agree?",
    model:
      "As countries try to stop burning coal, oil and gas, they must decide what will replace them. Some experts argue that nuclear power is the best solution. In my opinion, nuclear energy can be useful, but it is not the best way forward; renewable energy such as wind and solar power offers a better future.\n\nIt is true that nuclear power has some clear advantages. A nuclear power station emits almost no carbon dioxide, and unlike wind turbines or solar panels, it produces electricity day and night in all weather. For this reason, it can provide a steady supply while other sources vary.\n\nHowever, nuclear power stations are extremely expensive and slow to build. A new reactor can take more than ten years to complete and often costs far more than planned. By contrast, a wind farm or a solar park can be built in a year or two, and the cost of both has fallen dramatically over the last decade. Since the climate crisis demands rapid action, speed is crucial.\n\nMoreover, nuclear energy creates waste that remains dangerous for thousands of years, and no country has yet found a completely safe way to store it. Accidents are rare, but when they happen, as in Chernobyl and Fukushima, the consequences are catastrophic and long-lasting.\n\nTo sum up, although nuclear power produces clean electricity, its high cost, slow construction and dangerous waste make it a poor choice for most countries. Investing in renewable energy and better storage is a faster and safer way to replace fossil fuels.",
  },
  {
    task: "Producing meat creates large amounts of greenhouse gases. Should people eat less meat to protect the environment?",
    model:
      "Meat has always been an important part of many people's diet, but its production has a heavy environmental cost. Livestock farming produces large amounts of methane and uses vast areas of land. I strongly believe that people, especially in wealthy countries, should eat less meat.\n\nTo begin with, reducing meat consumption is one of the most effective changes an individual can make. Cattle in particular release methane, a gas that traps far more heat than carbon dioxide. According to many studies, a diet with little red meat can cut a person's food-related emissions by half or more.\n\nIn addition, meat production is a major cause of deforestation. Large areas of rainforest in South America have been cleared to create grazing land for cattle or to grow soya to feed animals. If demand for meat fell, less forest would need to be destroyed, which would protect biodiversity as well as the climate.\n\nSome people argue that meat is necessary for a healthy diet and that farmers would lose their jobs. While it is true that meat is a good source of protein, beans, eggs and dairy products can provide the same nutrients. Furthermore, eating less meat does not mean eating none: farmers could produce smaller amounts of high-quality meat and be paid more for it.\n\nIn conclusion, eating less meat would reduce greenhouse gases and help to save forests without harming people's health. It is a simple step that everyone who has the choice should consider.",
  },
  {
    task: "Cheap clothes are now bought and thrown away very quickly. Should governments put a tax on fast fashion?",
    model:
      "Clothes have never been as cheap as they are today. Many people buy new items every month and throw them away after wearing them only a few times. This fast fashion has serious environmental costs, and in my view, a tax on it would be a sensible way to reduce them.\n\nThe first reason is the enormous amount of waste the industry creates. Most cheap clothes are made of polyester, which is produced from oil and does not break down. Every year, millions of tons of textiles are burned or buried, and only a tiny proportion is recycled into new clothing. A tax would make people think twice before buying something they will hardly use.\n\nThe second reason is that the price of cheap clothes does not include the damage they cause. Producing cotton uses huge quantities of water, and dyeing fabric pollutes rivers in the countries where clothes are made. A tax would make the price more honest, and the money raised could support repair services and recycling schemes.\n\nCritics claim that such a tax would hurt poorer families most, since they depend on cheap clothes. This is a fair point, but the tax could be applied only to brands that produce very large quantities, and children's clothes could be excluded. Moreover, durable clothes often save money in the long term because they last for years.\n\nIn conclusion, I believe that governments should tax fast fashion. If it is designed fairly, such a tax would reduce waste and pollution and encourage a more thoughtful attitude to what we wear.",
  },
  {
    task: "Should rich countries pay poorer countries to protect their forests?",
    model:
      "Tropical forests such as the Amazon absorb huge amounts of carbon dioxide and are home to a large part of the world's species. However, many of the countries where these forests are found are poor, and cutting down trees for farming or timber brings them much-needed income. I believe that rich countries should pay them to protect their forests.\n\nFirstly, everyone benefits from these forests, so it is fair that the costs should be shared. The carbon that a rainforest stores affects the climate of the whole planet, not only the country in which it grows. It seems unjust to expect a poor country to give up valuable land and jobs for the benefit of people in wealthy nations who give nothing in return.\n\nSecondly, rich countries became wealthy partly by cutting down their own forests and burning fossil fuels for two centuries. As a result, they are responsible for most of the greenhouse gases already in the atmosphere. Paying to protect forests elsewhere is one way of accepting this responsibility.\n\nIt might be argued that the money could be wasted or stolen by corrupt officials. This risk is real, but it can be reduced by paying only for results, measured by satellite images that show whether the forest is still standing. Some programs of this kind have already slowed deforestation successfully.\n\nIn conclusion, paying poorer countries to protect their forests is both fair and practical. Provided that payments depend on clear results, it is one of the most effective ways for rich nations to fight climate change.",
  },
  {
    task: "Is it better to buy expensive products that last a long time than cheap products that must soon be replaced?",
    model:
      "When we shop for shoes, furniture or electronic devices, we often have to choose between a cheap product and a more expensive one of better quality. In my opinion, it is usually better to spend more on durable goods, both for our own finances and for the environment.\n\nThe first advantage is that durable products often save money over time. A pair of well-made boots may cost three times as much as a cheap pair, but if it lasts ten years instead of two, it is actually the cheaper choice. The same is true of washing machines, tools and many other goods that people use every day.\n\nIn addition, buying fewer, better things produces much less waste. Cheap products are frequently designed in a way that makes them impossible to repair, so they are thrown away as soon as a small part breaks. Since making any product uses energy and raw materials, keeping it for longer reduces pollution and the use of resources.\n\nNevertheless, I accept that this choice is not always possible. People with low incomes may simply not have enough money to pay more at once, even if it would be cheaper in the long run. Furthermore, a high price does not always guarantee quality, so buyers need to read reviews and check guarantees carefully.\n\nTo conclude, although expensive goods are not always better, choosing products that last is generally the wiser decision. It saves money in the long term and helps to reduce the waste that our consumer society creates.",
  },
  {
    task: "Many companies now let staff work from home. Should companies encourage working from home to help the environment?",
    model:
      "Since the pandemic, millions of office workers have discovered that they can do their jobs from home. Some people argue that companies should encourage this because it is good for the environment. I agree that working from home has clear environmental benefits, and I think companies should support it for at least part of the week.\n\nThe most obvious benefit is that it reduces travel. Every day, huge numbers of people drive to work, often alone, and sit in traffic for an hour or more. When they stay at home, emissions from cars fall, and the roads and trains become less crowded for those who still need to travel.\n\nWorking from home can also reduce the energy used by offices. If fewer staff come in each day, a company can rent a smaller building, which needs less heating, cooling and lighting. Some businesses have already halved their office space without any loss of productivity.\n\nHowever, the benefits are not as simple as they seem. Heating many separate homes during the day can use more energy than heating one office, especially in cold countries. Moreover, some employees feel lonely and find it harder to work as a team when they rarely see their colleagues.\n\nFor these reasons, I believe the best solution is a mixture: staff could work from home two or three days a week and meet in the office on the others. In conclusion, companies should encourage working from home, but in a balanced way that keeps both the environmental benefits and the advantages of working together.",
  },
  {
    task: "Popular natural sites, such as national parks, are visited by millions of tourists. Should tourists have to pay a fee to visit them?",
    model:
      "National parks and other natural wonders attract millions of visitors every year. While tourism brings money and helps people to appreciate nature, it also causes erosion, litter and disturbance to wildlife. I believe that charging visitors a fee is a reasonable way to protect these places.\n\nThe main argument in favor of a fee is that protecting nature costs money. Paths must be repaired, rubbish must be collected and rangers must be employed to look after wildlife and help visitors. At present, these costs are often paid by local taxpayers, many of whom rarely visit the park. It seems fairer that the people who enjoy the site should contribute to its care.\n\nA fee can also help to control the number of visitors. Some famous places have become so crowded that the plants and animals are suffering and the experience is spoiled for everyone. A higher price at the busiest times of year, or a limited number of tickets each day, would spread visitors more evenly and reduce the damage.\n\nOn the other hand, some people worry that fees would turn nature into something only the rich can enjoy. This concern is understandable, but it can be addressed. Local residents and school groups could enter for free, and the fee could be kept low for most visitors while foreign tourists pay a little more.\n\nIn conclusion, a fee for visiting popular natural sites would raise money for their protection and prevent overcrowding. With free entry for local people and students, it need not be unfair to anyone.",
  },
  {
    task: "Some people think that every school should have regular lessons about the environment and climate change. Do you agree?",
    model:
      "Climate change and the loss of nature are among the greatest challenges of our time, and today's students will live with their consequences. For this reason, I strongly agree that every school should teach regular lessons about the environment.\n\nFirstly, young people need accurate knowledge to understand the world around them. They hear about climate change on the news and on social media, where false information spreads quickly. Lessons based on scientific evidence would help them to understand the causes and effects of global warming and to distinguish facts from rumors.\n\nSecondly, environmental education can change behavior. Students who learn how much energy and water their school uses, or where their food comes from, often start to make different choices. They may also share what they have learned with their families, so the lessons can influence a whole community.\n\nFurthermore, many future jobs will be connected with the environment, from engineering wind turbines to designing sustainable buildings. Schools that teach these subjects well will prepare their students for careers that are likely to grow in importance.\n\nSome people argue that the timetable is already full and that schools should concentrate on core subjects such as mathematics and languages. However, environmental topics do not always need separate lessons: they can be included in science, geography and even mathematics, for instance by analyzing real data on temperatures.\n\nIn conclusion, regular teaching about the environment would give young people knowledge, good habits and useful skills. Since they will have to deal with the effects of climate change, schools have a duty to prepare them.",
  },
];

const opinionEssay = judgedTopic({
  id: "writing-an-opinion-essay",
  title: t("Writing an Opinion Essay", "写观点类议论文"),
  summary: t(
    "Write an essay of 250 to 300 words that states a clear opinion on a question, supports it in two or more body paragraphs, deals with an opposing view, and concludes.",
    "写一篇 250 到 300 词的议论文：对问题表明清楚的观点，用两个或更多主体段落支持它，回应一个相反的看法，并得出结论。",
  ),
  prerequisites: ["introductions-and-conclusions"],
  encompasses: [
    { topic: "writing-a-thesis-statement", weight: 0.3 },
    { topic: "introductions-and-conclusions", weight: 0.3 },
  ],
  criteria: ["b2-essay-opinion", "b2-essay-body", "b2-essay-conclusion", "b2-essay-linking", "b2-neutral-register"],
  point: {
    id: "opinion-essay",
    title: t("Opinion, reasons, conclusion", "观点、理由、结论"),
    explanation: t(
      "An opinion essay answers a question with your own view and gives reasons for it. Plan four or five paragraphs:\n\n1. **Introduction**: introduce the subject in a sentence or two, then state your opinion clearly: *In my opinion, ... / I strongly believe that ...*\n2. **Two body paragraphs**: each gives **one** reason. Begin with a topic sentence (*Firstly, ... / The main reason is that ...*), then explain it and give an example or a fact.\n3. **An opposing view** (often a short paragraph): show that you know what the other side thinks, then answer it: *Some people argue that ... However, ...*\n4. **Conclusion**: say your opinion again in different words and sum up your reasons: *In conclusion, ...* Do not add a new reason here.\n\nLink your ideas with words such as *Firstly, In addition, Moreover, However, For example, As a result*. Keep a neutral, formal tone: no contractions (*do not*, not *don't*) and no very emotional words.",
      "观点类议论文就一个问题给出自己的看法并说明理由。安排四到五段：\n\n1. **引言**：用一两句话引出话题，然后清楚地表明观点：*In my opinion, ... / I strongly believe that ...*\n2. **两个主体段**：每段只讲**一个**理由。用主题句开头（*Firstly, ... / The main reason is that ...*），然后解释，并举一个例子或事实。\n3. **相反的观点**（常是较短的一段）：说明你了解对方的想法，然后回应：*Some people argue that ... However, ...*\n4. **结论**：换一种说法重申观点并概括理由：*In conclusion, ...* 不要在这里加新的理由。\n\n用 *Firstly, In addition, Moreover, However, For example, As a result* 等词连接观点。语气中立、正式：不用缩写（写 *do not*，不写 *don't*），也不用过于情绪化的词。中文议论文常在结尾才亮出观点，或者先铺垫很多背景；英语议论文要在引言末尾就明确表态，后面每段都为它服务。",
    ),
  },
  question: t(
    "Write an opinion essay of 250 to 300 words in English. State your opinion in the introduction, support it in body paragraphs, answer an opposing view, and end with a conclusion.",
    "用英语写一篇 250 到 300 词的观点类议论文。在引言中表明观点，在主体段中支持它，回应一个相反的看法，最后写结论。",
  ),
  bank: opinionBank,
  limits: { minWords: 220, maxChars: 3200 },
  what: t("opinion essay", "观点类议论文"),
});

/** topics are the topics of the unit Climate and Sustainability. */
export const topics: readonly TopicDef[] = [
  climate.topic,
  energy.topic,
  ecosystems.topic,
  sustainability.topic,
  farming.topic,
  action.topic,
  disasters.topic,
  water.topic,
  causes.topic,
  future.topic,
  materials.topic,
  futureForms,
  opinionEssay,
];

/** vocabulary are the words the unit Climate and Sustainability teaches. */
export const vocabulary: readonly WordBatch[] = [
  climate.batch,
  energy.batch,
  ecosystems.batch,
  sustainability.batch,
  farming.batch,
  action.batch,
  disasters.batch,
  water.batch,
  causes.batch,
  future.batch,
  materials.batch,
];
