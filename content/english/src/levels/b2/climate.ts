// B2, unit 4: Climate and Sustainability. Climate change, energy, ecosystems, sustainability, farming and food, policy
// and action, natural disasters, water, cause and effect, the future of the earth, and materials; the future continuous
// and the future perfect; writing an opinion essay.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { fill, judgedTopic } from "../a2/kit.ts";
import { everyPair, interleave, vocabularyTopic, word } from "../words.ts";
import { futureContinuousAndFuturePerfectWriteNot } from "./mistakes.ts";

const climate = vocabularyTopic({
  id: "b2-words-climate-change",
  title: t("Climate Change", "气候变化"),
  summary: t(
    "Greenhouse gases and fossil fuels; the atmosphere and the ozone layer; deforestation and biodiversity; glaciers and the polar ice; methane; warming; carbon neutral; emitting gases.",
    "温室气体和化石燃料；大气层和臭氧层；森林砍伐和生物多样性；冰川和极地冰层；甲烷；变暖；碳中和；排放气体。",
  ),
  intro: t(
    "Burning **fossil** fuels sends **greenhouse** gases into the **atmosphere**, and the **warming** that follows is melting the world's **glaciers**. These words help you explain what is changing our climate and what people are doing about it.",
    "燃烧 **fossil**（化石）燃料会把 **greenhouse**（温室）气体送进 **atmosphere**（大气层），随之而来的 **warming**（变暖）正在融化世界各地的 **glaciers**（冰川）。这些词帮你解释是什么在改变气候，以及人们正在怎样应对。",
  ),
  prerequisites: ["b1-words-weather-and-climate"],
  words: [
    word(
      "greenhouse",
      "describing gases, such as carbon dioxide, that trap heat around the earth; a glass building for growing plants",
      "温室（的）",
      "Carbon dioxide is a {greenhouse} gas. | {Greenhouse} gases trap heat in the atmosphere. | She grows tomatoes in a {greenhouse} behind her house.|warehouse glacier",
      "warehouse glacier",
    ),
    word(
      "fossil fossils",
      "the remains of a very old animal or plant kept in rock; fossil fuels are coal, oil and gas",
      "化石",
      "Coal, oil and gas are {fossil} fuels. | Burning {fossil} fuels releases carbon dioxide. | The children found the {fossil} of a fish in the rock.",
      "ozone glacier",
    ),
    word(
      "atmosphere atmospheres",
      "the layer of gases around the earth; the feeling that a place gives you",
      "大气层；气氛",
      "Carbon dioxide traps heat in the {atmosphere}, the layer of air around the whole earth. | The restaurant has a relaxed {atmosphere}. | Mars has a very thin {atmosphere}.",
      "hemisphere glacier",
    ),
    word(
      "deforestation",
      "the cutting down of forests over a large area",
      "森林砍伐；毁林",
      "{Deforestation} destroys the homes of many animals. | Satellite photos show where {deforestation} has turned parts of the Amazon rainforest into bare fields. | Clearing land for cattle is a major cause of {deforestation}.",
      "reforestation biodiversity",
    ),
    word(
      "glacier glaciers",
      "a large mass of ice that moves slowly down a mountain or across land",
      "冰川",
      "The {glacier} has shrunk by a kilometer since 1950. | Melting {glaciers} raise the level of the sea.|fossils atmospheres | We walked across the {glacier} in special boots.",
      "fossil atmosphere",
    ),
    word(
      "methane",
      "a gas with no color or smell, given off by cows and rotting waste, that traps heat",
      "甲烷；沼气",
      "Cows produce large amounts of {methane}. | {Methane} from cows and rice fields traps more heat than carbon dioxide. | Rotting waste in landfills gives off {methane}.",
      "oxygen ozone",
    ),
    word(
      "warming",
      "the process of becoming warmer, especially of the earth's climate",
      "变暖",
      "Global {warming} is melting the polar ice. | Scientists measure the {warming} of the oceans as the water gets hotter each year. | The {warming} of the planet, with each year hotter than the last, is happening faster than expected.",
      "cooling warning",
    ),
    word(
      "biodiversity",
      "the variety of plants and animals that live in a place",
      "生物多样性",
      "Rainforests have very high {biodiversity}: a single tree can hold hundreds of kinds of insects. | Pollution is reducing the {biodiversity} of the river. | Protecting {biodiversity} means protecting many species.",
      "deforestation methane",
    ),
    word(
      "neutral",
      "adding nothing overall, so that the total effect is zero; not supporting either side",
      "中和的；中立的",
      "The company plans to become carbon {neutral} by 2040. | Switzerland stayed {neutral} during the war. | A carbon {neutral} building produces as much energy as it uses.",
      "natural polar",
    ),
    word(
      "ozone",
      "a form of oxygen; the ozone layer high above the earth protects it from the sun's harmful rays",
      "臭氧",
      "The {ozone} layer protects us from the sun's rays. | Some chemicals made a hole in the {ozone} layer. | The {ozone} hole over Antarctica is slowly closing.",
      "oxygen methane",
    ),
    word(
      "emit emits emitted emitting",
      "to send out gas, heat, light or sound",
      "排放；发出",
      "Cars {emit} carbon dioxide. | The factory {emitted} black smoke all day.|omitted admitted | The country is {emitting} more gas than ever.|omitting admitting",
      "omit admit",
    ),
    word(
      "polar",
      "near the North Pole or the South Pole",
      "极地的；两极的",
      "{Polar} bears depend on sea ice. | The {polar} ice is melting fast. | Few people live in the {polar} regions.",
      "solar neutral",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Emit*, *omit* and *admit* look almost the same: a factory *emits* smoke (sends it out), an editor *omits* a line (leaves it out), and you *admit* a mistake. Ask whether the gap is about sending gas, heat or light out.",
        "*emit*、*omit*、*admit* 长得几乎一样：工厂 *emits* 烟（排出去），编辑 *omits* 一行（省掉），而你 *admit* 错误（承认）。想想空格说的是不是往外排放气体、热或光。",
      ),
      meaning: t(
        "*Ozone* and *methane* are both gases in climate news: *ozone* forms the layer high above the earth that shields us from the sun, while *methane* is the heat-trapping gas from cows and rotting waste. Check whether the meaning protects us or traps heat.",
        "*ozone* 和 *methane* 都是气候新闻里的气体：*ozone* 在高空形成保护层，替我们挡住太阳的有害射线；*methane* 是牛和腐烂垃圾放出的吸热气体。看释义说的是保护我们还是吸住热量。",
      ),
      spell: t(
        "Long climate words are built from parts: *de · for · est · a · tion* and *bi · o · di · ver · si · ty*. Build them piece by piece, and notice that *atmosphere* spells its f sound with ph.",
        "气候类长词由几部分拼成：*de · for · est · a · tion*、*bi · o · di · ver · si · ty*。一块一块拼；还要注意 *atmosphere* 里的 f 音写作 ph。",
      ),
    },
    notes: `
      greenhouse|carbon dioxide as a kind of gas;gases trapping heat in the atmosphere;tomatoes grown in a building behind a house|a greenhouse gas traps heat around the earth; a glacier is a mass of ice|greenhouse 气体在地球周围吸住热量；glacier 是一大片冰|warehouse=warehouse is a big building for storing goods, not a glass house for plants or a word for heat-trapping gases=warehouse 是存放货物的大仓库，不是种植物的玻璃房，也不用来形容吸热气体;glacier=glacier is a huge mass of slow-moving ice, not a glass building or a kind of gas=glacier 是缓慢移动的巨大冰体，不是玻璃房，也不是一类气体|green · house|green + house, written as one word|green + house，合写成一个词
      fossil|coal, oil and gas as fuels;burning fuels that release carbon dioxide;a fish found in a rock|a fossil is the remains of something ancient kept in rock; ozone is a gas|fossil 是保存在岩石里的古老生物遗骸；ozone 是一种气体|ozone=ozone is a gas high in the sky, not ancient remains in rock or a kind of fuel=ozone 是高空中的气体，不是岩石里的古老遗骸，也不是一类燃料;glacier=glacier is a mass of ice, not remains in rock or a kind of fuel=glacier 是冰体，不是岩石里的遗骸，也不是一类燃料|fos · sil|the double s, and -il at the end, not -le|双写 s，结尾是 -il，不是 -le
      atmosphere|the layer of air around the whole earth;the relaxed feeling of a restaurant;the very thin layer of gas around Mars|the atmosphere surrounds the whole planet; a hemisphere is only half of it|atmosphere 包围整个星球；hemisphere 只是它的一半|hemisphere=hemisphere is one half of the earth, not the layer of gases around it or the feeling a place gives=hemisphere 是地球的一半，不是包围地球的气体层，也不是一个地方给人的感觉;glacier/glaciers=glacier is a mass of ice on land, not a layer of gases or the feeling a place gives=glacier 是陆地上的冰体，不是气体层，也不是地方给人的感觉|at · mos · phere|ph said like f, and -ere at the end|ph 读作 f，结尾是 -ere
      deforestation|something that destroys animals' homes;the change that turned rainforest into bare fields;clearing land for cattle|deforestation is cutting forests down; reforestation is planting them again|deforestation 是砍伐森林；reforestation 是重新造林|reforestation=reforestation is planting trees again, which builds forests up instead of destroying them=reforestation 是重新种树，是让森林恢复，而不是毁掉森林;biodiversity=biodiversity is the variety of living things, which forests protect, not the cutting down of trees=biodiversity 是生物的多样性，正是森林所保护的，不是砍树|de · for · est · a · tion|de + forest + ation, with -tion said like *shun*|de + forest + ation，-tion 读作 *shun*
      glacier|ice that has shrunk by a kilometer since 1950;melting ice that raises the level of the sea;ice crossed in special boots|a glacier is a moving mass of ice; a fossil is ancient remains in rock|glacier 是移动的冰体；fossil 是岩石里的古老遗骸|fossil/fossils=fossil is the remains of an ancient plant or animal in rock, which cannot melt, shrink or be walked across like ice=fossil 是岩石里的古代动植物遗骸，不会像冰一样融化、缩小，也不能在上面行走;atmosphere/atmospheres=atmosphere is the layer of gases around the earth, not ice on the ground=atmosphere 是地球周围的气体层，不是地上的冰|gla · cier|-cier at the end, said like *see-er* or *sher*|结尾是 -cier，读作 *see-er* 或 *sher*
      methane|large amounts of gas from cows;gas from cows and rice fields trapping heat;rotting waste in landfills|methane traps heat; oxygen is the gas we breathe|methane 会吸住热量；oxygen 是我们呼吸的气体|oxygen=oxygen is the gas we need to breathe, which does not come from rotting waste or trap heat like this=oxygen 是我们呼吸所需的气体，不是腐烂垃圾放出的，也不会这样吸热;ozone=ozone is the gas of the high layer that shields the earth from the sun, not a gas given off by cows or waste=ozone 是高空保护层里替地球挡阳光的气体，不是牛或垃圾放出的气体|meth · ane|th in the middle, and -ane at the end|中间是 th，结尾是 -ane
      warming|global change melting polar ice;oceans getting hotter each year;a planet with each year hotter than the last|warming means getting hotter; cooling means getting colder|warming 是变热；cooling 是变冷|cooling=cooling is becoming colder, the opposite of the hotter years and melting ice here=cooling 是变冷，和这里越来越热、冰在融化的意思正相反;warning=warning is a message telling you about danger, not the process of getting warmer=warning 是提醒危险的警告，不是变暖的过程|warm · ing|ar said like *or*, and no n before -ing: not *warning*|ar 读作 *or*，-ing 前面没有 n，别写成 *warning*
      biodiversity|a single tree holding hundreds of kinds of insects;the variety of life in a polluted river;protecting many species|biodiversity is the variety of living things; deforestation destroys it|biodiversity 是生物的多样性；deforestation 会破坏它|deforestation=deforestation is cutting down forests, not the variety of living things in a place=deforestation 是砍伐森林，不是一个地方生物的多样性;methane=methane is a gas that traps heat, not the variety of plants and animals=methane 是吸热的气体，不是动植物的多样性|bi · o · di · ver · si · ty|bio + diversity, one word|bio + diversity，合成一个词
      neutral|a company becoming carbon free by 2040;a country taking no side in a war;a building making as much energy as it uses|neutral means adding nothing overall or taking no side; natural means from nature|neutral 是总体为零或不偏向任何一方；natural 是天然的|natural=natural means made by nature, not balancing to zero or taking no side=natural 是自然形成的，不是总体抵消为零，也不是不偏不倚;polar=polar means near the North or South Pole, not balancing to zero or taking no side=polar 是靠近南北极的，不是抵消为零，也不是中立|neu · tral|eu said like *you*, and -al at the end|eu 读作 *you*，结尾是 -al
      ozone|the layer protecting us from the sun's rays;a hole made by chemicals in a layer;a hole over Antarctica that is closing|ozone forms the protecting layer high up; oxygen is the gas we breathe|ozone 在高空形成保护层；oxygen 是我们呼吸的气体|oxygen=oxygen is the gas we breathe, not the high layer with a hole that shields us from the sun=oxygen 是我们呼吸的气体，不是高空中替我们挡阳光、出现空洞的那一层;methane=methane is a gas that traps heat, not the layer that protects us from the sun=methane 是吸热的气体，不是保护我们免受阳光伤害的那一层|o · zone|z, not s, in the middle|中间是 z，不是 s
      emit|cars and carbon dioxide;black smoke from a factory all day;a country sending out more gas than ever|to emit is to send gas out; to omit is to leave something out|emit 是排放出去；omit 是省略、漏掉|omit/omitted/omitting=omit means to leave something out of a list or a text, not to send gas or smoke into the air=omit 是在名单或文章里省掉某样东西，不是往空气里排放气体或烟;admit/admitted/admitting=admit means to say something is true or let someone in, not to send out gas or smoke=admit 是承认或准许进入，不是排放气体或烟|e · mit|one m, but a double t in *emitted* and *emitting*|只有一个 m，但 *emitted*、*emitting* 双写 t
      polar|bears that depend on sea ice;ice melting fast near the poles;regions where few people live|polar means near the North or South Pole; solar means of the sun|polar 是靠近南北极的；solar 是太阳的|solar=solar means of the sun, not near the North or South Pole=solar 是太阳的，不是靠近南北极的;neutral=neutral means balancing to zero or taking no side, not near the poles=neutral 是抵消为零或中立的，不是靠近南北极的|po · lar|-ar at the end, not -er|结尾是 -ar，不是 -er
    `,
  },
});

const energy = vocabularyTopic({
  id: "b2-words-energy",
  title: t("Energy", "能源"),
  summary: t(
    "Nuclear power and reactors; wind turbines; generating power and generators; the grid; efficiency and insulation; gasoline, diesel, hydrogen and biofuels.",
    "核能和反应堆；风力涡轮机；发电和发电机；电网；效率和隔热；汽油、柴油、氢和生物燃料。",
  ),
  intro: t(
    "On the hill a wind **turbine** turns, by the coast a **nuclear** **reactor** hums, and both send power into the national **grid**. These words help you talk about how we make, move and save energy.",
    "山上一台风力 **turbine**（涡轮机）在转，海边一座 **nuclear**（核）**reactor**（反应堆）在运转，两者都把电送进国家 **grid**（电网）。这些词帮你谈论我们怎样发电、输电和节能。",
  ),
  prerequisites: ["b1-words-green-living"],
  words: [
    word(
      "nuclear",
      "using the energy made when atoms are split or joined",
      "核的；核能的",
      "France gets most of its electricity from {nuclear} power, made by splitting atoms in reactors. | The {nuclear} power station near our town produces no smoke, but its used uranium stays dangerous for thousands of years. | Some people fear {nuclear} accidents like Chernobyl, where radiation spread across Europe.",
      "solar unclear",
    ),
    word(
      "turbine turbines",
      "a machine with blades that turn to produce power, for example in wind",
      "涡轮机",
      "A wind {turbine} turns even in a light wind. | The hills are covered with tall white {turbines} whose blades turn in the wind.|reactors grids | Water from the dam turns the {turbines}.|reactors grids",
      "reactor grid",
    ),
    word(
      "generate generates generated generating",
      "to produce energy, such as electricity or heat; to cause something to exist",
      "产生；发（电）",
      "Solar panels {generate} electricity from sunlight. | The wind farm {generates} enough power for 5,000 homes.|insulates consumes | The plan has {generated} a lot of debate.|insulated consumed",
      "insulate consume",
    ),
    word(
      "generator generators",
      "a machine that produces electricity",
      "发电机",
      "The hospital has a {generator} in case the power fails. | We used a small {generator} at the campsite. | Diesel {generators} are noisy and dirty.|reactors grids",
      "reactor grid",
      "turbine",
    ),
    word(
      "grid grids",
      "the network of wires that carries electricity to homes and businesses",
      "电网；网格",
      "The new wind farm is connected to the national {grid}. | Homes can sell extra solar power to the {grid}. | The storm damaged the electricity {grid}.",
      "turbine reactor",
    ),
    word(
      "reactor reactors",
      "the large machine in which nuclear energy is produced",
      "反应堆",
      "The power station has two nuclear {reactors}.|grids turbines | Engineers shut down the nuclear {reactor} after the earthquake, before its core could overheat. | The {reactor}, where the uranium atoms split, is cooled with seawater.",
      "grid turbine",
    ),
    word(
      "efficiency",
      "the quality of producing good results without wasting energy, time or money",
      "效率；效能",
      "LED bulbs have a much higher {efficiency} than old bulbs. | The new engine improves fuel {efficiency} by 20%. | Energy {efficiency} saves money and cuts emissions.",
      "insulation hydrogen",
    ),
    word(
      "insulation",
      "material that stops heat from escaping, for example from a building",
      "隔热（材料）；绝缘",
      "Good {insulation} keeps the house warm in winter. | They put {insulation} in the roof. | Without {insulation}, heat escapes through the walls.",
      "isolation efficiency",
    ),
    word(
      "gasoline",
      "the liquid fuel made from oil that most cars use; petrol",
      "汽油",
      "The price of {gasoline} rose again this month, so filling up the car's tank costs more. | Electric cars don't run on {gasoline}. | He filled the tank with {gasoline}.",
      "electricity insulation",
      "diesel",
    ),
    word(
      "diesel",
      "a heavy fuel used in trucks, buses and some cars; an engine that uses it",
      "柴油；柴油机",
      "Most trucks run on {diesel}, a heavy fuel that gives off black smoke. | {Diesel} engines produce more harmful particles. | The city plans to ban old {diesel} cars.",
      "electricity insulation",
      "gasoline",
    ),
    word(
      "hydrogen",
      "the lightest gas, which can be burned as a clean fuel",
      "氢；氢气",
      "Water is made of {hydrogen} and oxygen. | The bus runs on {hydrogen} and emits only water. | {Hydrogen} is the lightest gas.",
      "oxygen methane",
    ),
    word(
      "biofuel biofuels",
      "fuel made from plants or animal waste",
      "生物燃料",
      "Some planes now fly partly on {biofuel} made from used cooking oil. | {Biofuel} can be made from crops such as corn and sugar cane. | Growing crops for {biofuels} uses a lot of land.",
      "gasoline hydrogen",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Turbine*, *generator* and *reactor* are all machines of a power station: a *turbine* has blades that spin, a *generator* makes electricity when the power fails, and a *reactor* is where atoms split. Look for blades, backup power or atoms in the sentence.",
        "*turbine*、*generator*、*reactor* 都是发电站里的机器：*turbine* 有转动的叶片，*generator* 在停电时发电，*reactor* 是原子裂变的地方。看句子里说的是叶片、备用电源还是原子。",
      ),
      meaning: t(
        "*Insulation* is material that keeps heat in a building; it is not *isolation*, which means being alone, and not *efficiency*, which means getting more from less energy. Check whether the meaning is a material or a quality.",
        "*insulation* 是让建筑保温的隔热材料；它不是表示孤立的 *isolation*，也不是表示用更少能源办更多事的 *efficiency*。看释义说的是一种材料还是一种品质。",
      ),
      spell: t(
        "*Gasoline* ends in -ine said like *een*, and *diesel* writes ie for its long e sound: *die · sel*, not *deisel*.",
        "*gasoline* 结尾是 -ine，读作 *een*；*diesel* 的长 e 音写作 ie：*die · sel*，不要写成 *deisel*。",
      ),
    },
    notes: `
      nuclear|electricity made by splitting atoms in reactors;a power station whose used uranium stays dangerous;accidents like Chernobyl that spread radiation|nuclear power comes from atoms; solar power comes from the sun|nuclear 能源来自原子；solar 能源来自太阳|solar=solar means using the energy of the sun, not of atoms, uranium or radiation=solar 是利用太阳能的，与原子、铀或辐射无关;unclear=unclear means hard to understand, not a kind of power, station or accident=unclear 是不清楚的，不能形容能源、电站或事故|nu · cle · ar|-cle- said like *klee*: not *nu · ku · lar*|中间的 -cle- 读作 *klee*，不要读成 *nu · ku · lar*
      turbine|something turning in a light wind;tall white machines with blades on the hills;machines turned by water from a dam|a turbine has blades that are turned by wind or water; a reactor splits atoms|turbine 有被风或水推动的叶片；reactor 用来分裂原子|reactor/reactors=reactor is where atoms split in a nuclear power station, and it has no blades turned by wind or water=reactor 是核电站里原子裂变的设备，没有被风或水推动的叶片;grid/grids=grid is the network of wires that carries power, not a machine that turns=grid 是输电的电线网，不是会转动的机器|tur · bine|ur, and -ine at the end, said like *in* or *ine*|拼作 ur，结尾是 -ine，读作 *in* 或 *ine*
      generate|solar panels and electricity from sunlight;a wind farm and power for 5,000 homes;a plan and a lot of debate|to generate is to produce power or cause something; to consume is to use it up|generate 是产生电力或引发某事；consume 是消耗掉|insulate/insulates/insulated=insulate means to cover something so heat cannot escape, not to produce power or debate=insulate 是包上材料不让热量散失，不是产生电力或引起争论;consume/consumes/consumed=consume means to use up energy, the opposite of making it, and a plan cannot use up debate=consume 是消耗能源，和产生正相反，计划也不会“消耗”争论|gen · er · ate|g said like j, and -ate at the end|g 读作 j，结尾是 -ate
      generator|a machine a hospital keeps for when the power fails;a small machine at a campsite;noisy, dirty diesel machines|a generator is a machine that makes electricity on the spot; a reactor splits atoms in a power station|generator 是就地发电的机器；reactor 是电站里分裂原子的设备|reactor/reactors=reactor is the huge machine of a nuclear power station, not a small diesel machine for a hospital or a campsite=reactor 是核电站里的巨大设备，不是医院或营地用的小型柴油机;grid/grids=grid is the network of wires bringing power from far away, not a machine you keep on the spot when the power fails=grid 是从远处送电的电线网，不是停电时就地使用的机器|gen · er · a · tor|-or at the end, not -er|结尾是 -or，不是 -er
      grid|a wind farm connected to the national network;homes selling extra solar power;electricity lines damaged by a storm|the grid is the network of wires that carries power; a turbine is one machine that makes it|grid 是输电的电线网；turbine 是发电的一台机器|turbine=turbine is one machine with blades, not the national network that carries power to homes=turbine 是一台带叶片的机器，不是把电送到千家万户的全国网络;reactor=reactor is the machine where atoms split, not the network of wires power is sold to=reactor 是原子裂变的设备，不是可以卖电进去的电线网|grid|a short i, and one d at the end|短元音 i，结尾只有一个 d
      reactor|two machines at a power station;a nuclear machine shut down before its core could overheat;the place where uranium atoms split|a reactor is where nuclear energy is made; a turbine is turned by wind, water or steam|reactor 是产生核能的地方；turbine 由风、水或蒸汽推动|grid/grids=grid is the network of wires that carries power, with no core and no atoms splitting inside=grid 是输电的电线网，没有堆芯，里面也没有原子裂变;turbine/turbines=turbine is a machine with spinning blades, not the nuclear core where atoms split=turbine 是有转动叶片的机器，不是原子裂变的核心设备|re · ac · tor|re + act + or, with -or at the end|re + act + or，结尾是 -or
      efficiency|LED bulbs compared with old bulbs;fuel use improved by 20%;energy use that saves money and cuts emissions|efficiency is getting good results without waste; insulation is a material that keeps heat in|efficiency 是不浪费地取得好效果；insulation 是保温的材料|insulation=insulation is a material put in roofs and walls, not a quality a bulb or an engine can have more of=insulation 是装在屋顶和墙里的材料，不是灯泡或发动机可以“更高”的品质;hydrogen=hydrogen is a gas used as fuel, not how well something uses energy=hydrogen 是可作燃料的气体，不是用能的效率|ef · fi · cien · cy|the double f, and -cien- said like *shen*|双写 f，-cien- 读作 *shen*
      insulation|a house kept warm in winter;material put in the roof;walls that let heat escape without it|insulation keeps heat in; isolation is being alone and cut off|insulation 是保温隔热；isolation 是孤立隔绝|isolation=isolation means being alone or cut off from others, not a material that keeps heat in a house=isolation 是孤立、与人隔绝，不是让房子保温的材料;efficiency=efficiency is how well something uses energy, not a material you put in a roof or a wall=efficiency 是用能的效率，不是放进屋顶或墙里的材料|in · su · la · tion|in- at the start, not is-, and -tion said like *shun*|开头是 in-，不是 is-；-tion 读作 *shun*
      gasoline|the fuel for filling up a car's tank;what electric cars do not run on;fuel put in a tank|gasoline is the liquid fuel most cars burn; electricity is what charges an electric car|gasoline 是大多数汽车烧的液体燃料；electricity 是给电动车充的电|electricity=electricity is power from wires and batteries, not a liquid poured into a tank=electricity 是来自电线和电池的电力，不是倒进油箱的液体;insulation=insulation is a material that keeps heat in buildings, not a fuel=insulation 是建筑的保温材料，不是燃料|gas · o · line|gas + oline, with -ine said like *een*|gas + oline，-ine 读作 *een*
      diesel|the heavy fuel of trucks that gives off black smoke;engines producing harmful particles;old cars a city plans to ban|diesel is a heavy fuel for trucks and buses; electricity runs electric cars|diesel 是卡车和公交用的重油；electricity 让电动车运行|electricity=electricity is power from wires and batteries, so it gives off no smoke and needs no fuel engine=electricity 是电线和电池里的电力，不冒烟，也不需要燃油发动机;insulation=insulation is a material that keeps heat in buildings, not a fuel for engines=insulation 是建筑的保温材料，不是发动机的燃料|die · sel|ie for the long e sound, not ei|长 e 音写作 ie，不是 ei
      hydrogen|water made of two elements;a bus that emits only water;the lightest gas|hydrogen is the lightest gas; oxygen is the gas we breathe|hydrogen 是最轻的气体；oxygen 是我们呼吸的气体|oxygen=oxygen is the gas we breathe, which is already in water with hydrogen and is not the lightest gas=oxygen 是我们呼吸的气体，它和氢一起组成水，也不是最轻的气体;methane=methane is a gas from cows and waste that gives off carbon dioxide when burned, not the lightest gas=methane 是牛和垃圾放出的气体，燃烧时会产生二氧化碳，也不是最轻的气体|hy · dro · gen|y said like *eye*, and g said like j|y 读作 *eye*，g 读作 j
      biofuel|planes flying on fuel from used cooking oil;fuel made from corn and sugar cane;crops grown for fuel|biofuel is made from plants or waste; gasoline is made from crude oil|biofuel 由植物或废料制成；gasoline 由原油炼成|gasoline=gasoline is made from oil dug out of the ground, not from crops or cooking oil=gasoline 由地下开采的石油炼成，不是用庄稼或食用油做的;hydrogen=hydrogen is a gas, not a fuel made from crops or cooking oil=hydrogen 是一种气体，不是用庄稼或食用油做成的燃料|bi · o · fu · el|bio + fuel, one word|bio + fuel，合成一个词
    `,
  },
});

const ecosystems = vocabularyTopic({
  id: "b2-words-ecosystems",
  title: t("Ecosystems", "生态系统"),
  summary: t(
    "Ecology; wetlands and marshes; reefs; the tundra and the savanna; the forest canopy; erosion; fertile and barren land; vegetation.",
    "生态学；湿地和沼泽；礁；冻原和稀树草原；森林树冠层；侵蚀；肥沃和贫瘠的土地；植被。",
  ),
  intro: t(
    "Herons wade through the **marsh**, monkeys swing in the forest **canopy**, and fish crowd around the coral **reef**. These words help you describe the places where plants and animals live and how they depend on each other.",
    "苍鹭在 **marsh**（沼泽）里涉水，猴子在森林 **canopy**（树冠层）里荡来荡去，鱼群聚在珊瑚 **reef**（礁）周围。这些词帮你描述动植物生活的地方，以及它们怎样相互依存。",
  ),
  prerequisites: ["b1-words-nature-2"],
  words: [
    word(
      "ecology",
      "the study of how plants, animals and their surroundings affect each other; the balance between them",
      "生态学；生态",
      "She is studying {ecology} at university because she wants to know how wolves, deer and forests affect each other. | The new road could harm the {ecology} of the valley by cutting the frogs off from their ponds. | {Ecology} teaches us how species depend on each other.",
      "economy geology",
      "ecological",
    ),
    word(
      "ecological",
      "connected with the balance of plants, animals and their surroundings",
      "生态的",
      "The oil spill caused {ecological} damage that killed fish and seabirds along the coast. | Wetlands have great {ecological} value as homes for birds, fish and insects. | Scientists studied the {ecological} effects of the dam on the fish and plants of the river.",
      "economical logical",
      "ecology",
    ),
    word(
      "wetland wetlands",
      "an area of land that is mostly covered with water, such as a marsh",
      "湿地",
      "Many birds stop to feed among the muddy pools and reeds of the {wetlands} on their way south.|deserts reefs | The {wetland} was drained to build houses. | {Wetlands} soak up water and reduce flooding.|deserts reefs",
      "desert reef",
      "marsh",
    ),
    word(
      "marsh marshes",
      "an area of soft, wet land where tall grass grows",
      "沼泽",
      "Frogs and herons live in the {marsh}. | Salt {marshes} protect the coast from storms.|marches mashes | The path crosses the {marsh} on wooden boards.",
      "march mash",
      "wetland",
    ),
    word(
      "reef reefs",
      "a line of rock or coral just below the surface of the sea",
      "礁；暗礁",
      "Coral {reefs} are home to thousands of species.|reeds marshes | Warmer sea water is killing the coral of the {reef} and turning it white. | Divers swam along the {reef}.",
      "reed marsh",
    ),
    word(
      "tundra",
      "the large, flat, cold area of land in the far north where no trees grow",
      "冻原；苔原",
      "Reindeer live on the Arctic {tundra}. | The ground of the {tundra} is frozen for most of the year. | Only moss and small plants grow on the {tundra}.",
      "reef canopy",
    ),
    word(
      "savanna savannas",
      "a large area of flat grassland with few trees in a hot region",
      "稀树草原；热带草原",
      "Lions hunt zebras across the dry grass of the African {savanna}. | The dry yellow grass of the {savanna} turns green after the rains. | Elephants cross the {savannas} in search of water.|reefs marshes",
      "reef marsh",
      "tundra",
    ),
    word(
      "canopy canopies",
      "the top layer of branches and leaves in a forest; a cover above something",
      "树冠层；顶篷",
      "Monkeys live high in the forest {canopy}. | The thick {canopy} keeps the forest floor dark. | We sat under a {canopy} to keep out of the sun.",
      "reef marsh",
    ),
    word(
      "erosion",
      "the slow wearing away of land by water, wind or ice",
      "侵蚀；腐蚀",
      "Trees protect the soil from {erosion}. | Coastal {erosion} is destroying the cliffs. | {Erosion} by the river created a deep valley.",
      "eruption vegetation",
    ),
    word(
      "fertile",
      "able to produce many good crops (of land)",
      "肥沃的；能生育的",
      "The valley has rich, {fertile} soil. | Rivers make the land along them {fertile}, so farmers have grown crops there for centuries. | The {fertile} plains feed millions of people.",
      "barren futile",
    ),
    word(
      "barren",
      "too poor to produce plants or crops (of land)",
      "贫瘠的；荒芜的",
      "The land was {barren} after years of drought. | Nothing grows on the {barren} hills. | Overgrazing turned the grassland into {barren} desert.",
      "fertile futile",
    ),
    word(
      "vegetation",
      "plants in general, especially those of a particular area",
      "植被；植物",
      "The island is covered in thick {vegetation}. | Goats ate all the {vegetation} on the hill. | {Vegetation} grows back quickly on the burned hills after the rains.",
      "vegetarian erosion",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Fertile* and *barren* are opposites: *fertile* land grows rich crops, *barren* land grows nothing. Look for clues like *rich*, *crops*, *drought* or *nothing grows* before you choose.",
        "*fertile* 和 *barren* 意思相反：*fertile* 的土地庄稼丰茂，*barren* 的土地寸草不生。选之前先找 *rich*、*crops*、*drought*、*nothing grows* 这样的线索。",
      ),
      meaning: t(
        "*Ecology* and *ecological* are about the balance of plants, animals and their surroundings; *economy* and *economical* look similar but are about money. Check whether the meaning talks about nature or about money.",
        "*ecology* 和 *ecological* 讲的是动植物与环境之间的平衡；*economy* 和 *economical* 长得像，讲的却是钱。看释义说的是自然还是钱。",
      ),
      spell: t(
        "*Savanna* has a double n at the end, *marsh* ends in -sh, not -ch, and *canopy* changes y to -ies in *canopies*.",
        "*savanna* 结尾双写 n；*marsh* 结尾是 -sh，不是 -ch；*canopy* 的复数把 y 变成 -ies：*canopies*。",
      ),
    },
    notes: `
      ecology|how wolves, deer and forests affect each other;the balance of nature in a valley with frogs and ponds;how species depend on each other|ecology is about plants, animals and their surroundings; economy is about money and trade|ecology 讲动植物与环境；economy 讲钱和贸易|economy=economy is the system of money, work and trade, not how animals, plants and their surroundings affect each other=economy 是金钱、工作和贸易的体系，不是动植物与环境之间的相互影响;geology=geology is the study of rocks and the earth's layers, not of how living things depend on each other=geology 研究岩石和地层，不研究生物之间的相互依存|e · col · o · gy|eco- at the start, and -logy for a field of study|开头是 eco-，结尾 -logy 表示一门学科
      ecological|damage that killed fish and seabirds;wetlands as homes for birds, fish and insects;a dam's effects on the fish and plants of a river|ecological is about the balance of nature; economical is about saving money|ecological 关乎自然平衡；economical 关乎省钱|economical=economical means cheap to run or careful with money, not about the balance of plants and animals=economical 是省钱的、经济实惠的，与动植物的平衡无关;logical=logical means following clear reasons, not connected with plants, animals and their surroundings=logical 是合乎逻辑的，与动植物及其环境无关|e · co · log · i · cal|eco + logical, one word|eco + logical，合成一个词
      wetland|muddy pools and reeds where birds feed;land drained to build houses;land that soaks up water and reduces flooding|a wetland is land covered with shallow water; a desert is dry land with little rain|wetland 是浅水覆盖的土地；desert 是少雨的干旱土地|desert/deserts=desert is dry land with almost no water, so it has no muddy pools to drain and soaks up no floods=desert 是几乎没有水的干旱土地，没有可排干的泥塘，也吸不了洪水;reef/reefs=reef is a ridge of rock or coral under the sea, not land with reeds that can be drained for houses=reef 是海底的岩石或珊瑚带，不是长着芦苇、可以排水盖房的土地|wet · land|wet + land, one word|wet + land，合成一个词
      marsh|frogs and herons;salt land that protects the coast from storms;a path on wooden boards across wet ground|a marsh is soft, wet land with tall grass; a march is a long walk or the third month|marsh 是长着高草的松软湿地；march 是行军或三月|march/marches=march is a long organized walk, or the month of March, not wet land where frogs live=march 是有组织的长距离行走，或三月，不是青蛙生活的湿地;mash/mashes=mash is food crushed soft, like mashed potato, not an area of land=mash 是捣成泥的食物，比如土豆泥，不是一片土地|marsh|ar, and -sh at the end, not -ch|拼作 ar，结尾是 -sh，不是 -ch
      reef|coral home to thousands of species;coral killed and turned white by warmer sea water;divers swimming along the sea floor|a reef is a line of rock or coral under the sea; a reed is a tall plant by water|reef 是海底的岩石或珊瑚带；reed 是水边的高秆植物|reed/reeds=reed is a tall grass that grows by rivers and lakes, not coral or rock in the sea=reed 是长在河湖边的高草，不是海里的珊瑚或岩石;marsh/marshes=marsh is soft wet land with grass, not coral under the sea=marsh 是长草的松软湿地，不是海底的珊瑚|reef|ee for the long e sound, and f at the end|ee 发长 e 音，结尾是 f
      tundra|reindeer in the Arctic;ground frozen for most of the year;land where only moss and small plants grow|the tundra is cold, flat land with no trees; a reef is under the sea|tundra 是寒冷平坦、没有树的土地；reef 在海底|reef=reef is a line of coral or rock under the sea, not frozen land in the far north=reef 是海底的珊瑚或岩石带，不是北方的冻土;canopy=canopy is the top layer of a forest, but the tundra is a place where no trees grow at all=canopy 是森林的顶层，而冻原上根本不长树|tun · dra|u as in *sun*, and -dra at the end|u 读作 *sun* 里的音，结尾是 -dra
      savanna|lions hunting zebras across dry grass;dry yellow grass turning green after rain;elephants crossing grassland in search of water|a savanna is hot, dry grassland; a marsh is always wet|savanna 是炎热干燥的草原；marsh 总是湿的|reef/reefs=reef is coral or rock under the sea, not grassland where lions and elephants live=reef 是海底的珊瑚或岩石，不是狮子和大象生活的草原;marsh/marshes=marsh is wet land full of water, not dry grass where animals search for water=marsh 是满是水的湿地，不是动物四处找水的干草原|sa · van · na|a single v, and a double n before the last a|只有一个 v，最后的 a 前面双写 n
      canopy|monkeys living high in a forest;thick leaves keeping the forest floor dark;a cover keeping out the sun|the canopy is the top layer of leaves in a forest; a reef is under the sea|canopy 是森林顶层的枝叶；reef 在海底|reef=reef is coral or rock under the sea, not leaves high above a forest or a cover from the sun=reef 是海底的珊瑚或岩石，不是森林上方的枝叶，也不是遮阳的顶篷;marsh=marsh is wet land on the ground, not branches high above it or a cover to sit under=marsh 是地面上的湿地，不是高处的树枝，也不是可以坐在下面的遮篷|can · o · py|y changing to -ies in *canopies*|复数把 y 变成 -ies：*canopies*
      erosion|trees protecting the soil;cliffs being destroyed on the coast;a river creating a deep valley|erosion is land slowly worn away; an eruption is a volcano suddenly exploding|erosion 是土地被慢慢侵蚀；eruption 是火山突然喷发|eruption=eruption is a volcano suddenly exploding, not land slowly worn away by water or wind=eruption 是火山突然喷发，不是土地被水或风慢慢侵蚀;vegetation=vegetation is the plants of a place, which protect soil instead of wearing it away=vegetation 是一个地方的植物，它们保护土壤，而不是侵蚀土壤|e · ro · sion|-sion said like *zhun*|-sion 读作 *zhun*
      fertile|rich soil in a valley;land along rivers where crops have grown for centuries;plains that feed millions of people|fertile land grows rich crops; barren land grows nothing|fertile 的土地庄稼丰茂；barren 的土地寸草不生|barren=barren means too poor to grow anything, the opposite of rich land that feeds people=barren 是贫瘠得什么都长不出，和养活众人的肥沃土地正相反;futile=futile means useless and having no result, a word for efforts, not for soil or land=futile 是徒劳无功的，用来说努力，不用来说土壤或土地|fer · tile|-ile at the end, said like *tile* or *tl*|结尾是 -ile，读作 *tile* 或 *tl*
      barren|land after years of drought;hills where nothing grows;grassland turned into desert by overgrazing|barren land produces nothing; fertile land produces rich crops|barren 的土地什么都不长；fertile 的土地庄稼丰茂|fertile=fertile means able to grow rich crops, the opposite of land where drought and overgrazing leave nothing=fertile 是能长出好庄稼的，和干旱、过度放牧后寸草不生的土地相反;futile=futile means useless, a word for efforts, not for land or hills=futile 是徒劳的，用来说努力，不用来说土地或山丘|bar · ren|the double r in the middle, and -en at the end|中间双写 r，结尾是 -en
      vegetation|an island covered in thick plants;plants eaten by goats on a hill;plants growing back on burned hills after rain|vegetation means the plants of a place; a vegetarian is a person who eats no meat|vegetation 是一个地方的植物；vegetarian 是不吃肉的人|vegetarian=vegetarian is a person who eats no meat, not the plants that cover an island or a hill=vegetarian 是不吃肉的人，不是覆盖岛屿或山坡的植物;erosion=erosion is land being worn away, not plants that grow or that goats eat=erosion 是土地被侵蚀，不是会生长、会被山羊吃掉的植物|veg · e · ta · tion|g said like j, and -tion said like *shun*|g 读作 j，-tion 读作 *shun*
    `,
  },
});

const sustainability = vocabularyTopic({
  id: "b2-words-sustainability",
  title: t("Sustainability", "可持续性"),
  summary: t(
    "Sustainability; recyclable, biodegradable, disposable and reusable things; eco-friendly products; consumerism; upcycling; durable goods; being wasteful, thrifty or frugal.",
    "可持续性；可回收、可生物降解、一次性和可重复使用的东西；环保产品；消费主义；升级再造；耐用品；浪费、节俭。",
  ),
  intro: t(
    "We take **reusable** bags to the shop, choose **recyclable** bottles and buy **durable** boots that last for years. These words help you talk about living in a way the planet can keep up with.",
    "我们带着 **reusable**（可重复使用的）袋子去购物，挑 **recyclable**（可回收的）瓶子，买能穿好多年的 **durable**（耐用的）靴子。这些词帮你谈论一种地球承受得起的生活方式。",
  ),
  prerequisites: ["b1-words-waste"],
  words: [
    word(
      "sustainability",
      "the use of resources in a way that does not harm the environment and can continue for a long time",
      "可持续性",
      "The company has made {sustainability} its main goal, so it now uses only recycled packaging and solar power. | {Sustainability} means meeting our needs without harming the future. | Experts doubt the {sustainability} of cheap fashion, which uses huge amounts of water and is thrown away after a few wears.",
      "consumerism availability",
    ),
    word(
      "recyclable",
      "able to be processed and used again as material",
      "可回收利用的",
      "This bottle is made of {recyclable} plastic, so it can be melted down and made into a new one. | Not all paper cups are {recyclable}: those with a plastic lining cannot be turned into new paper. | Put {recyclable} waste such as cans and newspapers in the blue bin for the recycling truck.",
      "disposable wasteful",
    ),
    word(
      "biodegradable",
      "able to be broken down naturally by bacteria",
      "可生物降解的",
      "These bags are {biodegradable} and break down in weeks. | Food waste is {biodegradable}: in a compost heap, tiny creatures turn it into soil. | Normal plastic is not {biodegradable}, so a bag thrown away today will still be in the sea in 400 years.",
      "durable reusable",
    ),
    word(
      "disposable",
      "made to be used once and then thrown away",
      "一次性的",
      "{Disposable} cups are a huge source of waste. | Many parents use {disposable} diapers, which go straight into the bin after one use. | The café has stopped selling {disposable} plastic forks that customers throw away after one meal.",
      "reusable durable",
      "wasteful",
    ),
    word(
      "eco-friendly",
      "not harmful to the environment",
      "环保的；对环境无害的",
      "They only buy {eco-friendly} cleaning products that do not harm rivers or fish. | Cycling, which burns no fuel at all, is the most {eco-friendly} way to travel. | The hotel is proud of its {eco-friendly} design.",
      "harmful wasteful",
    ),
    word(
      "consumerism",
      "the belief that buying more and more things is good; the buying of goods",
      "消费主义",
      "Black Friday is a symbol of modern {consumerism}. | Some people reject {consumerism} and live simply. | {Consumerism} creates mountains of waste.",
      "sustainability minimalism",
    ),
    word(
      "upcycle upcycles upcycled upcycling",
      "to make an old or unwanted object into something new of better quality",
      "升级再造；变废为宝",
      "She {upcycles} old jeans by sewing them into stylish bags.|discards upholds | He {upcycled} an old door by turning it into a dining table.|discarded upheld | {Upcycling} gives old furniture a new life.|discarding upholding",
      "discard uphold",
    ),
    word(
      "durable",
      "lasting a long time without breaking",
      "耐用的；持久的",
      "These boots are {durable} enough to last ten years. | Buy {durable} goods instead of cheap ones. | Glass is a very {durable} material.",
      "disposable wasteful",
    ),
    word(
      "reusable",
      "able to be used again",
      "可重复使用的",
      "Bring a {reusable} bag when you go shopping, and use it again week after week. | She drinks from a {reusable} water bottle that she refills every morning. | {Reusable} cups can be washed and used for years.",
      "disposable wasteful",
    ),
    word(
      "wasteful",
      "using more of something than is needed",
      "浪费的",
      "Leaving the lights on all night is {wasteful}. | It is {wasteful} to throw away good food. | We live in a very {wasteful} society that throws away a third of its food.",
      "thrifty frugal",
    ),
    word(
      "thrifty",
      "careful to spend little money and to waste nothing",
      "节俭的；节约的",
      "My {thrifty} grandmother never threw anything away. | Students have to be {thrifty} because they live on very little money. | Being {thrifty}, they repair their clothes instead of buying new ones.",
      "wasteful disposable",
      "frugal",
    ),
    word(
      "frugal",
      "using only as much money or food as is needed",
      "节俭的；简朴的",
      "They live a {frugal} life in the country, growing their own vegetables and buying very little. | We had a {frugal} meal of bread and soup. | {Frugal} habits help families save money.",
      "wasteful disposable",
      "thrifty",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Reusable*, *recyclable* and *biodegradable* are good for the planet in different ways: *reusable* things are used again as they are, *recyclable* ones are made into new material, and *biodegradable* ones rot away naturally. Look for *again*, *made into* or *break down* in the sentence.",
        "*reusable*、*recyclable*、*biodegradable* 对地球有好处的方式各不相同：*reusable* 是原样再用，*recyclable* 是回炉做成新材料，*biodegradable* 是自然腐烂分解。在句子里找 *again*、*made into* 或 *break down*。",
      ),
      meaning: t(
        "*Thrifty* and *frugal* describe people who spend little; *wasteful* is their opposite, and *disposable* describes things you throw away after one use, not people. Check whether the meaning is about a person's habits or about an object.",
        "*thrifty* 和 *frugal* 形容花钱少的人；*wasteful* 和它们相反；*disposable* 形容用一次就扔的东西，不形容人。看释义说的是人的习惯还是物品。",
      ),
      spell: t(
        "*Recyclable*, *reusable*, *disposable* and *biodegradable* all end in -able, and *eco-friendly* keeps its hyphen.",
        "*recyclable*、*reusable*、*disposable*、*biodegradable* 都以 -able 结尾；*eco-friendly* 中间要保留连字符。",
      ),
    },
    notes: `
      sustainability|a company using only recycled packaging and solar power;meeting our needs without harming the future;cheap fashion that uses huge amounts of water|sustainability is using resources so they last; consumerism is buying more and more|sustainability 是让资源能长久使用；consumerism 是越买越多|consumerism=consumerism is the belief that buying more and more is good, the opposite of protecting resources for the future=consumerism 是认为越买越多越好的观念，和为未来保护资源正相反;availability=availability means whether something can be got or used, not whether it can go on without harming the planet=availability 是能否得到或使用，不是能否长久而不伤害地球|sus · tain · a · bil · i · ty|sustain + ability, with -ain- kept in the middle|sustain + ability，中间保留 -ain-
      recyclable|plastic melted down and made into a new bottle;paper cups that can be turned into new paper;cans and newspapers for the recycling truck|recyclable things can be made into new material; disposable things are thrown away after one use|recyclable 的东西可以做成新材料；disposable 的东西用一次就扔|disposable=disposable means made to be thrown away after one use, not able to be made into something new=disposable 是用一次就扔的，不是能再加工成新东西的;wasteful=wasteful describes using too much, a word for people and habits, not for plastic, cups or waste that can be made into new things=wasteful 是浪费的，用来说人和习惯，不用来说能再加工的塑料、杯子或垃圾|re · cy · cla · ble|re + cycle + able, with the e of cycle dropped|re + cycle + able，去掉 cycle 的 e
      biodegradable|bags that break down in weeks;food waste turned into soil in a compost heap;plastic still in the sea after 400 years|biodegradable things rot away naturally; durable things last a long time|biodegradable 的东西会自然分解；durable 的东西经久耐用|durable=durable means lasting a long time without breaking, the opposite of breaking down naturally=durable 是经久耐用的，和自然分解正相反;reusable=reusable means able to be used again as it is, not able to rot away into soil=reusable 是可以原样再用，不是能腐烂成泥土|bi · o · de · grad · a · ble|bio + degrade + able, with the e of degrade dropped|bio + degrade + able，去掉 degrade 的 e
      disposable|cups that are a huge source of waste;diapers going into the bin after one use;plastic forks thrown away after one meal|disposable things are used once and thrown away; reusable things are used again and again|disposable 的东西用一次就扔；reusable 的东西可以反复使用|reusable=reusable means able to be used again and again, the opposite of being thrown away after one use=reusable 是可以反复使用的，和用一次就扔正相反;durable=durable means lasting a long time, not made to be thrown away after one use=durable 是经久耐用的，不是用一次就扔的|dis · pos · a · ble|dispose + able, with the e dropped|dispose + able，去掉 e
      eco-friendly|cleaning products that do not harm rivers or fish;cycling, which burns no fuel;a hotel proud of its design|eco-friendly means not harmful to nature; harmful means causing damage|eco-friendly 是对环境无害的；harmful 是有害的|harmful=harmful means causing damage, the opposite of being kind to rivers, fish and the planet=harmful 是有害的，和对河流、鱼类、地球友好正相反;wasteful=wasteful means using more than is needed, not something good for the planet to be proud of=wasteful 是浪费的，不是值得骄傲的环保之举|e · co · friend · ly|eco + friendly with a hyphen, and ie in *friend*|eco 和 friendly 之间有连字符，*friend* 里是 ie
      consumerism|Black Friday as a symbol;a way of life some people reject to live simply;mountains of waste|consumerism is the love of buying more; minimalism is owning as little as possible|consumerism 是热衷于越买越多；minimalism 是尽量少拥有东西|sustainability=sustainability is using resources so they last, not a love of buying that creates mountains of waste=sustainability 是让资源能长久使用，不是制造垃圾山的购物热;minimalism=minimalism is owning very little and living simply, the opposite of buying more and more=minimalism 是拥有很少、简单生活，和越买越多正相反|con · sum · er · ism|consumer + ism, with -er- kept|consumer + ism，中间保留 -er-
      upcycle|old jeans sewn into stylish bags;an old door turned into a dining table;old furniture given a new life|to upcycle is to make old things into something better; to discard is to throw them away|upcycle 是把旧东西改造成更好的东西；discard 是扔掉|discard/discards/discarded/discarding=discard means to throw something away, the opposite of giving it a new life as something better=discard 是扔掉，和让旧物以更好的样子重获新生正相反;uphold/upholds/upheld/upholding=uphold means to support a law or a decision, not to make old things into new ones=uphold 是维护法律或决定，不是把旧物改造成新东西|up · cy · cle|up + cycle, one word, with y said like *eye*|up + cycle，合成一个词，y 读作 *eye*
      durable|boots that last ten years;goods bought instead of cheap ones;glass as a material|durable things last a long time; disposable things are thrown away after one use|durable 的东西经久耐用；disposable 的东西用一次就扔|disposable=disposable means made to be thrown away after one use, the opposite of lasting for years=disposable 是用一次就扔的，和用很多年正相反;wasteful=wasteful means using more than is needed, a word for habits, not for boots, goods or materials that last=wasteful 是浪费的，用来说习惯，不用来说经久耐用的靴子、商品或材料|du · ra · ble|u said like *you*, and -able at the end|u 读作 *you*，结尾是 -able
      reusable|a shopping bag used week after week;a water bottle refilled every morning;cups washed and used for years|reusable things are used again; disposable things are used once|reusable 的东西可以再用；disposable 的东西只用一次|disposable=disposable means thrown away after one use, the opposite of being used again and again=disposable 是用一次就扔的，和反复使用正相反;wasteful=wasteful means using too much, not a bag, a bottle or a cup that can be used again=wasteful 是浪费的，不能形容能再用的袋子、瓶子或杯子|re · us · a · ble|re + use + able, with the e of use dropped|re + use + able，去掉 use 的 e
      wasteful|lights left on all night;good food thrown away;a society throwing away a third of its food|wasteful means using more than you need; thrifty means wasting nothing|wasteful 是浪费的；thrifty 是什么都不浪费|thrifty=thrifty means careful to waste nothing, the opposite of leaving lights on or throwing food away=thrifty 是节俭、不浪费，和整夜开灯、扔掉食物正相反;frugal=frugal means using only what is needed, the opposite of throwing good things away=frugal 是只用所需，和扔掉好东西正相反|waste · ful|waste + ful, with the e kept and one l|waste + ful，保留 e，结尾只有一个 l
      thrifty|a grandmother who never threw anything away;students living on very little money;people repairing their clothes instead of buying new ones|thrifty means careful with money; wasteful means using too much|thrifty 是精打细算的；wasteful 是浪费的|wasteful=wasteful means using more than is needed, the opposite of saving and repairing things=wasteful 是用得比需要的多，和省钱、修补东西正相反;disposable=disposable describes things thrown away after one use, not a careful person=disposable 形容用一次就扔的东西，不形容精打细算的人|thrif · ty|thrift + y, with th at the start|thrift + y，开头是 th
      frugal|a life in the country growing vegetables and buying little;a meal of bread and soup;habits that help families save money|frugal means using only what you need; wasteful means using too much|frugal 是只用所需；wasteful 是浪费的|wasteful=wasteful means using more than is needed, the opposite of a simple life and saving money=wasteful 是用得比需要的多，和简朴生活、省钱正相反;disposable=disposable describes things thrown away after one use, not a simple life, meal or habit=disposable 形容用一次就扔的东西，不形容简朴的生活、饭菜或习惯|fru · gal|u said like *oo*, and -al at the end|u 读作 *oo*，结尾是 -al
    `,
  },
});

const farming = vocabularyTopic({
  id: "b2-words-farming",
  title: t("Farming and Food", "农业与粮食"),
  summary: t(
    "Agriculture; crops and the harvest; irrigation; pesticides and fertilizers; livestock and cattle; dairy farming; the yield of a field; famine.",
    "农业；庄稼和收成；灌溉；杀虫剂和化肥；牲畜和牛；乳制品业；产量；饥荒。",
  ),
  intro: t(
    "In October the rice **harvest** begins: farmers check their **crops**, move their **cattle** to the hills and hope for a good **yield**. These words help you talk about how food is grown and what happens when it fails.",
    "十月，水稻 **harvest**（收割）开始了：农民查看 **crops**（庄稼），把 **cattle**（牛群）赶上山，盼着有好的 **yield**（产量）。这些词帮你谈论粮食是怎样种出来的，以及歉收时会发生什么。",
  ),
  prerequisites: ["b1-words-environment"],
  words: [
    word(
      "agriculture",
      "the science or work of farming",
      "农业",
      "{Agriculture} uses about 70% of the world's fresh water. | Most people in the region work in {agriculture}, growing rice and keeping pigs. | Modern {agriculture} depends on machines such as tractors and combine harvesters.",
      "famine architecture",
      "agricultural",
    ),
    word(
      "agricultural",
      "connected with farming",
      "农业的",
      "The country exports {agricultural} products such as rice. | Much {agricultural} land, once used for fields of wheat, is lost to cities every year. | She studied at an {agricultural} college to learn how to run her family's farm.",
      "architectural industrial",
      "agriculture",
    ),
    word(
      "crop crops",
      "a plant, such as wheat or rice, that is grown in large amounts",
      "庄稼；作物",
      "Rice is the main {crop} in this region. | The drought dried up the fields and destroyed the {crops} before they could be picked.|livestock weeds | Farmers grow two {crops} a year here.|livestock weeds",
      "livestock weed",
    ),
    word(
      "harvest harvests harvested harvesting",
      "the time when crops are gathered; to gather crops",
      "收获；收割",
      "The rice {harvest} begins in October, when the grain is ripe. | Farmers {harvested} the ripe wheat before the rain could ruin it.|planted watered | Ripe apples are {harvested} by hand and packed into boxes.|planted watered",
      "plant water",
      "yield",
    ),
    word(
      "irrigation",
      "the supply of water to land through pipes or channels so that crops can grow",
      "灌溉",
      "Without {irrigation}, nothing would grow in the desert. | {Irrigation} uses huge amounts of river water. | Modern {irrigation} drips water onto each plant.",
      "irritation famine",
    ),
    word(
      "pesticide pesticides",
      "a chemical used to kill insects that damage crops",
      "杀虫剂；农药",
      "{Pesticides} can harm bees as well as pests.|famines harvests | The farmer sprays the fruit with {pesticide}. | Organic food is grown without chemical {pesticides}.|famines harvests",
      "famine harvest",
      "fertilizer",
    ),
    word(
      "fertilizer fertilizers",
      "a substance added to soil to help plants grow",
      "肥料；化肥",
      "Too much {fertilizer} pollutes rivers. | Animal waste can be used as {fertilizer}. | Chemical {fertilizers} increased crop yields.|famines harvests",
      "famine harvest",
      "pesticide",
    ),
    word(
      "livestock",
      "farm animals, such as cows, sheep and pigs",
      "牲畜；家畜",
      "The farm keeps {livestock} such as pigs and goats, and grows vegetables. | The drought killed much of the {livestock}. | Raising {livestock} such as cows and sheep produces a large share of greenhouse gases.",
      "irrigation agriculture",
      "cattle",
    ),
    word(
      "cattle",
      "cows and bulls kept on a farm",
      "牛（总称）",
      "The {cattle} graze in the fields all summer. | He raises {cattle} for beef. | A herd of {cattle} blocked the road.",
      "crops poultry",
      "livestock dairy",
    ),
    word(
      "dairy",
      "connected with milk or food made from milk; a farm or company that produces it",
      "乳制品（的）；奶牛场",
      "Cheese and yogurt are {dairy} products. | She can't eat {dairy} because milk, butter and cheese make her ill. | The {dairy} farm has two hundred cows.",
      "diary poultry",
      "cattle",
    ),
    word(
      "yield yields yielded yielding",
      "the amount of crops a field produces; to produce crops or results",
      "产量；产出",
      "New seeds have doubled the rice {yield}. | The field {yields} three tons of wheat a year.|plants sprays | The research {yielded} surprising results.|planted sprayed",
      "plant spray",
      "harvest",
    ),
    word(
      "famine famines",
      "a lack of food over a long period, causing many people to go hungry or die",
      "饥荒",
      "Millions died in the {famine}. | Drought and war can cause {famine}. | The country has not had a {famine} for fifty years, because good harvests now feed everyone.",
      "harvest feast",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Crops* are plants grown in fields, while *livestock*, *cattle* and *poultry* are animals: look for verbs like *grow* and *pick* for plants, and *graze*, *raise* or *herd* for animals.",
        "*crops* 是田里种的植物，*livestock*、*cattle*、*poultry* 是动物：植物常和 *grow*、*pick* 搭配，动物常和 *graze*、*raise*、*herd* 搭配。",
      ),
      meaning: t(
        "*Dairy* is about milk and the food made from it, but *diary* is a book where you write about your day. The meaning tells you which one: milk or writing.",
        "*dairy* 和牛奶及奶制品有关，*diary* 却是记录每天生活的日记本。看释义说的是牛奶还是写字。",
      ),
      spell: t(
        "*Pesticide* ends in -cide, the ending that means killing, and *fertilizer* has -ize- in the middle (British English writes *fertiliser*).",
        "*pesticide* 结尾是表示“杀”的 -cide；*fertilizer* 中间是 -ize-（英式英语写作 *fertiliser*）。",
      ),
    },
    notes: `
      agriculture|fresh water used for farming;work growing rice and keeping pigs;tractors and combine harvesters|agriculture is the work of farming; architecture is the design of buildings|agriculture 是农业；architecture 是建筑设计|famine=famine is a long lack of food, not the work of farming that people do or that uses water and machines=famine 是长期缺粮，不是人们从事、需要用水和机器的农业;architecture=architecture is the design of buildings, not growing crops or keeping animals=architecture 是建筑设计，不是种庄稼或养牲口|ag · ri · cul · ture|-ture at the end, said like *cher*|结尾是 -ture，读作 *cher*
      agricultural|products such as rice sold abroad;land once used for fields of wheat;a college for learning to run a farm|agricultural means connected with farming; industrial means connected with factories|agricultural 是和农业有关的；industrial 是和工厂有关的|architectural=architectural means connected with designing buildings, not with rice, wheat fields or running a farm=architectural 是和建筑设计有关的，与大米、麦田或经营农场无关;industrial=industrial means connected with factories, not with rice, wheat fields or farms=industrial 是和工厂有关的，与大米、麦田或农场无关|ag · ri · cul · tur · al|agriculture + al, with the e dropped|agriculture + al，去掉 e
      crop|rice as the main plant of a region;fields destroyed by drought before picking;plants grown twice a year|crops are plants grown for food; livestock are farm animals|crops 是种来吃的植物；livestock 是农场动物|livestock=livestock are farm animals, which are raised, not grown, picked or planted twice a year=livestock 是饲养的农场动物，不是种植、采摘的作物;weed/weeds=weed is a wild plant nobody wants, not the main plant farmers grow and pick=weed 是没人要的野草，不是农民种植和收获的主要作物|crop|a short o, and p doubles in *cropped*|短元音 o，*cropped* 里 p 要双写
      harvest|a time in October when the grain is ripe;ripe wheat gathered before rain;ripe apples gathered by hand|to harvest is to gather ripe crops; to plant is to put seeds in the ground|harvest 是收割成熟的庄稼；plant 是把种子种下去|plant/planted=plant means to put seeds or young plants into the ground, which happens long before anything is ripe=plant 是把种子或幼苗种进地里，远在作物成熟之前;water/watered=water means to give plants water so they grow, not to gather ripe grain, wheat or apples=water 是给植物浇水让它们生长，不是收割成熟的谷物、小麦或苹果|har · vest|har + vest, with ar said like *ah*|har + vest，ar 读作 *ah*
      irrigation|nothing growing in the desert without it;huge amounts of river water;water dripped onto each plant|irrigation brings water to crops; irritation is a feeling of being annoyed or sore|irrigation 是给庄稼引水灌溉；irritation 是恼火或皮肤刺痛|irritation=irritation is a feeling of being annoyed or a sore patch of skin, not water brought to crops=irritation 是恼火或皮肤刺痛，不是给庄稼引的水;famine=famine is a long lack of food, which water for crops helps to prevent=famine 是长期缺粮，而灌溉正是为了防止缺粮|ir · ri · ga · tion|the double r, and g, not t, in the middle|双写 r，中间是 g，不是 t
      pesticide|bees harmed as well as pests;fruit sprayed by a farmer;organic food grown without chemicals|a pesticide kills insects; a fertilizer helps plants grow|pesticide 杀虫；fertilizer 促进植物生长|famine/famines=famine is a long lack of food, not a chemical sprayed on fruit or fields=famine 是长期缺粮，不是喷在水果或田里的化学品;harvest/harvests=harvest is the gathering of crops, not a chemical that kills insects=harvest 是收割庄稼，不是杀虫的化学品|pes · ti · cide|pest + i + cide, with -cide for killing|pest + i + cide，-cide 表示“杀”
      fertilizer|something that pollutes rivers when used too much;animal waste put on soil;chemicals that increased crop yields|fertilizer helps plants grow; a pesticide kills insects|fertilizer 促进植物生长；pesticide 杀虫|famine/famines=famine is a long lack of food, not something put on soil to help plants grow=famine 是长期缺粮，不是施在土里助长的东西;harvest/harvests=harvest is the gathering of crops, not something added to the soil=harvest 是收割庄稼，不是加进土里的东西|fer · ti · liz · er|-ize- in the middle, and -er at the end|中间是 -ize-，结尾是 -er
      livestock|pigs and goats kept on a farm;animals killed by a drought;raising cows and sheep|livestock are farm animals; agriculture is the whole work of farming|livestock 是农场的牲畜；agriculture 是整个农业|irrigation=irrigation is water brought to crops, not animals a farm keeps or a drought kills=irrigation 是给庄稼引的水，不是农场饲养、会被旱灾害死的动物;agriculture=agriculture is the whole work of farming, not the animals themselves=agriculture 是整个农业，不是动物本身|live · stock|live + stock, with *live* said like *alive*|live + stock，*live* 读音同 *alive* 里的 live
      cattle|animals grazing in the fields all summer;animals raised for beef;a herd blocking the road|cattle are cows and bulls; poultry are chickens and ducks|cattle 是牛；poultry 是鸡鸭等家禽|crops=crops are plants grown in fields, which cannot graze, be raised for beef or block a road as a herd=crops 是田里种的植物，不会吃草，不产牛肉，也不会成群挡路;poultry=poultry are chickens and ducks, which are not raised for beef and do not move in herds=poultry 是鸡鸭等家禽，不产牛肉，也不成群结队地走|cat · tle|the double t, and -le at the end|双写 t，结尾是 -le
      dairy|cheese and yogurt as products;milk, butter and cheese making someone ill;a farm with two hundred cows|dairy is about milk; a diary is a book you write in|dairy 和牛奶有关；diary 是写字的日记本|diary=diary is a book where you write about your day, not milk or food made from it=diary 是记录每天生活的本子，不是牛奶或奶制品;poultry=poultry are chickens and ducks, not milk, cheese or a farm of cows=poultry 是鸡鸭等家禽，不是牛奶、奶酪或奶牛场|dair · y|ai before r, not *diary* with ia|r 前面是 ai，别写成 ia 的 *diary*
      yield|rice doubled by new seeds;three tons of wheat a year from a field;surprising results from research|a yield is how much a field produces; to plant is to put seeds in|yield 是田地的产量；plant 是播种|plant/plants/planted=plant means to put seeds in the ground, not the amount a field or research produces=plant 是把种子种进地里，不是田地或研究产出的量;spray/sprays/sprayed=spray means to cover with tiny drops of liquid, not to produce wheat or results=spray 是喷洒液体，不是产出小麦或成果|yield|ie for the long e sound, and -ld at the end|长 e 音写作 ie，结尾是 -ld
      famine|millions dying from hunger;drought and war;fifty years without hunger thanks to good harvests|a famine is a long lack of food; a feast is a big meal|famine 是长期缺粮；feast 是盛宴|harvest=harvest is the gathering of crops, which feeds people instead of killing them=harvest 是收获庄稼，养活人，而不是饿死人;feast=feast is a large, happy meal, the opposite of people going hungry=feast 是丰盛欢乐的大餐，和人们挨饿正相反|fam · ine|-ine at the end, said like *in*|结尾是 -ine，读作 *in*
    `,
  },
});

const action = vocabularyTopic({
  id: "b2-words-environmental-action",
  title: t("Policy and Action", "政策与行动"),
  summary: t(
    "Regulations and regulating; enforcing and imposing rules; incentives and initiatives; pledges, commitments and committing; agreements and summits; activists.",
    "法规和监管；执行和强加规定；激励措施和倡议；承诺和保证；协议和峰会；活动人士。",
  ),
  intro: t(
    "At the climate **summit**, leaders signed an **agreement** and made a **pledge** to cut emissions, while **activists** marched outside. These words help you talk about the rules, promises and campaigns that protect the environment.",
    "在气候 **summit**（峰会）上，各国领导人签署了 **agreement**（协议），作出减排的 **pledge**（承诺），**activists**（活动人士）则在场外游行。这些词帮你谈论保护环境的规则、承诺和行动。",
  ),
  prerequisites: ["b1-words-taking-action"],
  words: [
    word(
      "regulation regulations",
      "an official rule; the control of something by rules",
      "规章；法规；监管",
      "New {regulations} limit the pollution from factories.|incentives summits | The {regulation} of fishing protects the stocks. | EU {regulations} ban some pesticides.|incentives summits",
      "incentive summit",
      "agreement",
    ),
    word(
      "regulate regulates regulated regulating",
      "to control something by rules",
      "管理；调控；监管",
      "The government {regulates} the use of water.|pledges circulates | Laws {regulate} how much smoke a factory may emit. | The industry is poorly {regulated}, so companies can dump waste wherever they like.|pledged circulated",
      "pledge circulate",
      "enforce",
    ),
    word(
      "enforce enforces enforced enforcing",
      "to make sure that people obey a law or rule",
      "执行；强制实施",
      "The police {enforce} the speed limit with cameras. | The ban on fishing is hard to {enforce}, because the coast is too long for the police to watch. | The rules were never {enforced}: no one checked, and no one was ever fined.|endorsed pledged",
      "endorse pledge",
      "regulate impose",
    ),
    word(
      "impose imposes imposed imposing",
      "to introduce a rule, tax or punishment that people must accept",
      "强制推行；征（税）",
      "The government {imposed} a tax on plastic bags, and shops have had to charge it since May.|proposed removed | The city {imposes} fines on drivers who pollute, and they must pay within a month.|proposes removes | The court can {impose} a fine of up to \\$10,000 on companies that pollute.",
      "propose remove",
      "enforce",
    ),
    word(
      "incentive incentives",
      "something that encourages people to do something, such as money",
      "激励；鼓励措施",
      "Tax {incentives} encourage people to buy electric cars.|penalties deterrents | When energy is cheap, people have little {incentive} to switch off their lights. | The government gives farmers a cash {incentive} to plant trees on their land.",
      "penalty deterrent",
      "initiative",
    ),
    word(
      "initiative initiatives",
      "a new plan or action to deal with a problem",
      "倡议；新方案；主动性",
      "The city launched an {initiative} to plant a million trees. | Local {initiatives}, such as monthly clean-up days, have cleaned up the river.|activists agreements | She took the {initiative} and organized a beach clean-up.",
      "activist agreement",
      "incentive",
    ),
    word(
      "pledge pledges pledged pledging",
      "a serious promise; to promise seriously",
      "保证；誓言；承诺",
      "Breaking a {pledge} to voters can cost a leader the next election. | The company made a public {pledge} to stop using plastic by 2030, and it kept its promise. | Twenty countries signed the {pledge}.",
      "summit warning",
      "commitment commit",
    ),
    word(
      "commitment commitments",
      "a promise to do something; being willing to give time and energy to something",
      "承诺；投入；献身",
      "The country made a {commitment} to protect its forests. | Her {commitment} to the cause is impressive. | We need real {commitments} that leaders will keep, not just words.|commissions summits",
      "commission summit",
      "pledge",
    ),
    word(
      "commit commits committed committing",
      "to promise to do something; to do something wrong or illegal",
      "承诺；致力于；犯（罪）",
      "The government has {committed} to closing all coal plants by 2030, and it has set aside the money.|admitted emitted | Both sides {committed} to the plan and promised to follow it.|admitted emitted | Nobody saw him {commit} the crime, and he has never admitted it.",
      "admit emit",
      "pledge",
    ),
    word(
      "agreement agreements",
      "an arrangement or promise between people or countries",
      "协议；一致",
      "The Paris {agreement} on climate was signed in 2015 by almost every country. | The two countries reached an {agreement} on fishing. | We are in {agreement} about the main points.",
      "argument incentive",
      "regulation",
    ),
    word(
      "summit summits",
      "an important meeting between the leaders of countries",
      "峰会；顶峰",
      "World leaders met at a climate {summit}. | The {summit} ended without an agreement. | We climbed to the {summit} of the mountain.",
      "incentive agreement",
    ),
    word(
      "activist activists",
      "a person who works to bring about political or social change",
      "活动人士；积极分子",
      "Climate {activists} marched through the city.|summits incentives | The young {activist} spoke at the conference. | {Activists} blocked the road to the mine.|summits incentives",
      "summit incentive",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Commit* has two uses: you *commit to* a plan (promise it) and you *commit* a crime (do it). Do not mix it up with *admit*, which means saying that something is true. Read what comes after the gap: *to* and a plan, or a crime.",
        "*commit* 有两种用法：*commit to* 一个计划（承诺去做），*commit* 一桩罪行（犯下）。别和 *admit*（承认）混淆。看空格后面接的是 *to* 加计划，还是罪行。",
      ),
      meaning: t(
        "A *summit* is the meeting of leaders itself, an *agreement* is what they may sign at the end of it, and a *regulation* is an official rule. Check whether the meaning is a meeting, an arrangement or a rule.",
        "*summit* 是领导人开的会本身，*agreement* 是会议结束时可能签署的协议，*regulation* 是官方规章。看释义说的是一次会议、一项约定还是一条规定。",
      ),
      spell: t(
        "*Commit* has a double m; it doubles its t in *committed* and *committing*, but *commitment* keeps a single t before -ment.",
        "*commit* 双写 m；*committed*、*committing* 要双写 t，而 *commitment* 在 -ment 前只有一个 t。",
      ),
    },
    notes: `
      regulation|new rules limiting pollution from factories;rules that control fishing to protect stocks;EU rules banning some pesticides|a regulation is an official rule; an incentive is a reward that encourages you|regulation 是官方规章；incentive 是鼓励人的好处|incentive/incentives=incentive is a reward that encourages people, not an official rule that limits, controls or bans=incentive 是鼓励人的好处，不是限制、管控或禁止的官方规章;summit/summits=summit is a meeting of leaders, not a rule that limits or bans something=summit 是领导人会议，不是限制或禁止某事的规章|reg · u · la · tion|regulate + ion, with -tion said like *shun*|regulate + ion，-tion 读作 *shun*
      regulate|the government and the use of water;laws on how much smoke a factory may emit;an industry where companies dump waste where they like|to regulate is to control by rules; to pledge is to promise|regulate 是用规则管控；pledge 是承诺|pledge/pledges/pledged=pledge means to promise seriously, not to control something by rules=pledge 是郑重承诺，不是用规则管控;circulate/circulates/circulated=circulate means to move around or pass from person to person, not to control by rules=circulate 是流通或传阅，不是用规则管控|reg · u · late|g said like the g in *get*, and -ate at the end|g 读作 *get* 里的 g，结尾是 -ate
      enforce|police cameras and the speed limit;a fishing ban on a coast too long to watch;rules nobody checked or fined anyone for|to enforce a rule is to make people obey it; to endorse is to say you support it|enforce 是强制执行；endorse 是表示支持|endorse/endorsed=endorse means to say publicly that you support something, not to check and fine people so they obey=endorse 是公开表示支持，不是检查、罚款让人服从;pledge/pledged=pledge means to promise, not to make people obey a rule=pledge 是承诺，不是强制别人遵守规则|en · force|en + force, with -orce said like *horse*|en + force，-orce 读音同 *horse*
      impose|a tax on plastic bags that shops must charge;fines drivers must pay within a month;a court fining polluting companies|to impose is to bring in a rule or tax people must accept; to propose is only to suggest it|impose 是强制推行；propose 只是提议|propose/proposes/proposed=propose means to suggest an idea, not to bring in a tax or fine that people must already pay=propose 是提议，不是推行人们已经必须缴纳的税或罚款;remove/removes/removed=remove means to take away, the opposite of bringing in a tax or fine=remove 是取消、去掉，和推行税费或罚款正相反|im · pose|im + pose, with the silent e at the end|im + pose，结尾的 e 不发音
      incentive|tax breaks for electric cars;little reason to switch off lights when energy is cheap;cash given to farmers to plant trees|an incentive encourages you to act; a penalty punishes you|incentive 鼓励你行动；penalty 惩罚你|penalty/penalties=penalty is a punishment for doing wrong, the opposite of a reward that encourages people=penalty 是做错事受的惩罚，和鼓励人的好处正相反;deterrent/deterrents=deterrent is something that stops people from acting, the opposite of something that encourages them=deterrent 是让人不敢做的东西，和鼓励人去做正相反|in · cen · tive|c said like s, and -ive at the end|c 读作 s，结尾是 -ive
      initiative|a city plan to plant a million trees;local plans like monthly clean-up days;someone acting first and organizing a beach clean-up|an initiative is a new plan or action; an activist is a person|initiative 是新方案、新行动；activist 是人|activist/activists=activist is a person who campaigns, not a plan a city launches or the first step someone takes=activist 是搞运动的人，不是城市推出的方案，也不是一个人主动迈出的一步;agreement/agreements=agreement is an arrangement between two sides, not a new plan or the act of starting something yourself=agreement 是双方的约定，不是新方案，也不是自己主动做事|i · ni · tia · tive|-tia- said like *sha*|-tia- 读作 *sha*
      pledge|a promise broken to voters;a public promise to stop using plastic;a promise signed by twenty countries|a pledge is a serious promise; a warning tells you about danger|pledge 是郑重承诺；warning 是提醒危险|summit=summit is a meeting of leaders, not a promise that can be signed, kept or broken=summit 是领导人会议，不是可以签署、遵守或违背的承诺;warning=warning tells someone about a danger, not a promise to do something=warning 是提醒危险，不是承诺做某事|pledge|-dge at the end, said like j|结尾是 -dge，读作 j
      commitment|a country promising to protect its forests;someone giving time and energy to a cause;promises that leaders will keep|a commitment is a promise or deep devotion; a commission is a group with a task, or a payment|commitment 是承诺或投入；commission 是委员会或佣金|commission/commissions=commission is an official group given a task, or money paid for a sale, not a promise or devotion to a cause=commission 是被委以任务的官方小组，或销售佣金，不是承诺或对事业的投入;summit/summits=summit is a meeting of leaders, not a promise to keep=summit 是领导人会议，不是要遵守的承诺|com · mit · ment|a double m, and a single t before -ment|双写 m，-ment 前只有一个 t
      commit|a government promising to close coal plants by 2030;two sides promising to follow a plan;a crime someone has never admitted|to commit is to promise or to do something wrong; to admit is to say something is true|commit 是承诺，或犯下错事；admit 是承认|admit/admitted=admit means to say that something is true, not to promise a plan or to do a crime=admit 是承认，不是承诺计划，也不是犯罪;emit/emitted=emit means to send out gas, heat or light, not to promise or to do a crime=emit 是排放气体、热或光，不是承诺或犯罪|com · mit|a double m, and the t doubles in *committed*|双写 m，*committed* 里 t 也要双写
      agreement|a deal on climate signed by almost every country;two countries settling fishing;people sharing a view on the main points|an agreement is an arrangement both sides accept; an argument is a quarrel|agreement 是双方接受的约定；argument 是争吵|argument=argument is a quarrel between people who disagree, the opposite of a deal both sides sign=argument 是意见不合的争吵，和双方签署的协议正相反;incentive=incentive is a reward that encourages people, not a deal between countries or a shared view=incentive 是鼓励人的好处，不是国家之间的协议或一致的看法|a · gree · ment|agree + ment, with the double e kept|agree + ment，保留两个 e
      summit|world leaders meeting about climate;a meeting that ended without an agreement;the top of a mountain|a summit is a meeting of leaders or a mountain top; an agreement is what a meeting may produce|summit 是峰会或山顶；agreement 是会议可能达成的协议|incentive=incentive is a reward that encourages people, not a meeting or the top of a mountain=incentive 是鼓励人的好处，不是会议，也不是山顶;agreement=agreement is the deal a meeting may produce, not the meeting itself or the top of a mountain=agreement 是会议可能达成的协议，不是会议本身，也不是山顶|sum · mit|the double m in the middle|中间双写 m
      activist|people marching through the city for the climate;a young person speaking at a conference;people blocking the road to a mine|an activist is a person who campaigns; a summit is a meeting|activist 是搞运动的人；summit 是会议|summit/summits=summit is a meeting of leaders, which cannot march, speak or block a road=summit 是领导人会议，不会游行、演讲或堵路;incentive/incentives=incentive is a reward that encourages people, not a person who campaigns=incentive 是鼓励人的好处，不是搞运动的人|ac · tiv · ist|active + ist, with the e dropped|active + ist，去掉 e
    `,
  },
});

const disasters = vocabularyTopic({
  id: "b2-words-disasters",
  title: t("Natural Disasters", "自然灾害"),
  summary: t(
    "Catastrophes and catastrophic events; devastating storms; shelters, evacuating and evacuation; the aftermath; casualties and debris; landslides, avalanches and cyclones.",
    "大灾难和灾难性事件；毁灭性的风暴；避难所、撤离；灾后余波；伤亡和残骸；山体滑坡、雪崩和气旋。",
  ),
  intro: t(
    "When the **cyclone** hit, families slept in a school **shelter**; in the **aftermath**, workers cleared **debris** from the streets. These words help you talk about natural disasters and how people survive them.",
    "**cyclone**（热带气旋）来袭时，许多家庭睡在学校改成的 **shelter**（避难所）里；在 **aftermath**（灾后）的日子里，工人们清理街上的 **debris**（残骸）。这些词帮你谈论自然灾害以及人们怎样渡过难关。",
  ),
  prerequisites: ["b1-words-weather-and-climate"],
  words: [
    word(
      "catastrophe catastrophes",
      "a sudden event that causes great damage or suffering",
      "大灾难；灾祸",
      "The flood was a {catastrophe} for the region: thousands of homes were destroyed. | Scientists warn of a climate {catastrophe}. | The war was a human {catastrophe}.",
      "shelter casualty",
      "catastrophic",
    ),
    word(
      "catastrophic",
      "causing great damage or suffering",
      "灾难性的",
      "The earthquake had {catastrophic} effects: whole towns were flattened. | Rising seas could be {catastrophic} for island nations, which may disappear under the water. | The fire caused {catastrophic} damage, burning down half the city.",
      "minor harmless",
      "catastrophe",
    ),
    word(
      "devastate devastates devastated devastating",
      "to destroy or damage something badly; to make someone very sad",
      "摧毁；使极度悲伤",
      "The hurricane {devastated} the coast.|evacuated sheltered | The {devastating} fire destroyed the whole forest.|evacuating sheltering | She was {devastated} by the news.|evacuated sheltered",
      "evacuate shelter",
    ),
    word(
      "shelter shelters",
      "a place that protects people from bad weather or danger",
      "避难所；庇护",
      "Families slept in a {shelter} during the storm. | The school became a {shelter} for flood victims. | We took {shelter} under a bridge.",
      "casualty landslide",
    ),
    word(
      "evacuate evacuates evacuated evacuating",
      "to move people from a dangerous place to a safe one",
      "疏散；撤离",
      "Thousands of people were {evacuated} by bus to safe towns before the cyclone.|evaporated evaluated | Police {evacuated} the building after a bomb threat, and everyone waited outside.|evaporated evaluated | The town must {evacuate} if the river rises, and everyone must move to higher ground.",
      "evaporate evaluate",
      "evacuation",
    ),
    word(
      "evacuation evacuations",
      "the act of moving people from a dangerous place",
      "疏散行动；撤离",
      "The {evacuation} of the island took two days: boats carried everyone to the mainland. | The mayor ordered an {evacuation}, and families left their homes before the flood. | {Evacuation} routes are marked in green.",
      "evaporation evaluation",
      "evacuate",
    ),
    word(
      "aftermath",
      "the period after a bad event, and its effects",
      "后果；余波",
      "In the {aftermath} of the flood, disease spread. | The country is still dealing with the {aftermath} of the war. | Many people lost their jobs in the {aftermath} of the storm.",
      "forecast casualty",
    ),
    word(
      "casualty casualties",
      "a person who is hurt or killed in an accident, a disaster or a war",
      "伤亡人员",
      "There were no {casualties} in the landslide: nobody was hurt or killed.|survivors shelters | The earthquake caused hundreds of {casualties}.|survivors shelters | The army counted the {casualties}: twelve soldiers dead and forty wounded.|survivors shelters",
      "survivor shelter",
    ),
    word(
      "debris",
      "broken pieces left after something has been destroyed",
      "残骸；碎片",
      "The streets were covered in {debris} after the storm. | Workers cleared the {debris} from the road. | {Debris} from the building fell onto cars.",
      "aftermath shelter",
    ),
    word(
      "landslide landslides",
      "a mass of earth and rock that falls down a hill or mountain",
      "山体滑坡；压倒性胜利",
      "Heavy rain loosened the hillside and caused a {landslide} of mud and rocks that blocked the road. | The village was buried by a {landslide}. | Cutting down trees on steep slopes makes {landslides} more likely, because roots hold the soil in place.|cyclones casualties",
      "cyclone casualty",
      "avalanche",
    ),
    word(
      "avalanche avalanches",
      "a large mass of snow that falls down a mountain",
      "雪崩",
      "Two skiers were caught in the {avalanche} when the snow came down the mountain. | The {avalanche} buried the mountain hut. | Warm weather increases the risk of {avalanches} in spring, as the snow on the slopes softens.|cyclones droughts",
      "cyclone drought",
      "landslide",
    ),
    word(
      "cyclone cyclones",
      "a violent tropical storm with very strong circular winds",
      "气旋；热带风暴",
      "The {cyclone} hit the coast with winds of 200 km/h. | {Cyclones} form over the warm water of the Bay of Bengal.|landslides avalanches | Fishermen stayed in port as the {cyclone} approached.",
      "landslide avalanche",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Evacuate* and *evaluate* look alike: you *evacuate* people by moving them out of danger, but you *evaluate* a plan by judging it. If people are being moved to safety, the word is *evacuate*.",
        "*evacuate* 和 *evaluate* 长得像：*evacuate* 是把人撤离危险地带，*evaluate* 是评估一个计划。只要是把人转移到安全地方，就用 *evacuate*。",
      ),
      meaning: t(
        "A *casualty* is a person hurt or killed in a disaster, not a *survivor*, who comes through it, and nothing to do with *casual*. Check whether the meaning is about people who were harmed.",
        "*casualty* 是在灾难中受伤或死亡的人，不是安然渡过的 *survivor*，也和 *casual*（随意的）无关。看释义说的是不是受到伤害的人。",
      ),
      spell: t(
        "*Catastrophe* ends in -phe, said like *fee*, and *debris* has a silent s at the end: *de · bris*, said *deb-ree*.",
        "*catastrophe* 结尾是 -phe，读作 *fee*；*debris* 结尾的 s 不发音：*de · bris*，读作 *deb-ree*。",
      ),
    },
    notes: `
      catastrophe|a flood that destroyed thousands of homes;a disaster for the climate scientists warn of;a war's suffering for people|a catastrophe is a sudden disaster; a shelter is a safe place during one|catastrophe 是突如其来的大灾难；shelter 是灾难中的安全场所|shelter=shelter is a place that keeps people safe, not an event that destroys homes or causes suffering=shelter 是保护人们安全的地方，不是摧毁房屋、造成苦难的事件;casualty=casualty is one person hurt or killed, not a whole disaster for a region, the climate or a war=casualty 是受伤或死亡的人，不是一个地区、气候或战争的整场灾难|ca · tas · tro · phe|-phe at the end, said like *fee*|结尾是 -phe，读作 *fee*
      catastrophic|an earthquake that flattened whole towns;rising seas that may sink island nations;a fire that burned down half a city|catastrophic means causing terrible damage; minor means small and not serious|catastrophic 是灾难性的；minor 是轻微的|minor=minor means small and not serious, which cannot describe flattened towns or a city half burned down=minor 是轻微的，形容不了被夷平的城镇或烧掉一半的城市;harmless=harmless means causing no damage at all, the opposite of towns flattened and islands under water=harmless 是无害的，和城镇被夷平、岛屿被淹没正相反|cat · a · stroph · ic|-phe changes to -phic, with ph said like f|-phe 变成 -phic，ph 读作 f
      devastate|a hurricane wrecking the coast;a fire that destroyed a whole forest;someone very sad because of the news|to devastate is to destroy badly or upset deeply; to evacuate is to move people out of danger|devastate 是严重摧毁或使人极度悲伤；evacuate 是把人撤离危险|evacuate/evacuated/evacuating=evacuate means to move people out of danger, which a storm, a fire or bad news cannot do=evacuate 是把人撤离危险地带，风暴、大火或坏消息做不到;shelter/sheltered/sheltering=shelter means to protect someone from danger, the opposite of destroying or deeply upsetting=shelter 是保护人免受危险，和摧毁或使人伤心正相反|dev · as · tate|dev + as + tate, with -ate at the end|dev + as + tate，结尾是 -ate
      shelter|families sleeping safely during a storm;a school used by flood victims;a safe place under a bridge|a shelter keeps people safe; a casualty is a person who was hurt|shelter 保护人们安全；casualty 是受伤的人|casualty=casualty is a person hurt or killed, not a place where people sleep or hide safely=casualty 是受伤或死亡的人，不是人们安全睡觉或躲避的地方;landslide=landslide is earth and rock falling down a hill, a danger rather than a safe place=landslide 是从山上滑落的泥石，是危险而不是安全的地方|shel · ter|-er at the end|结尾是 -er
      evacuate|thousands of people taken by bus to safe towns;everyone moved out of a building after a bomb threat;a town moving to higher ground|to evacuate is to move people to safety; to evaluate is to judge how good something is|evacuate 是把人撤到安全地带；evaluate 是评估好坏|evaporate/evaporated=evaporate means to turn from liquid into gas, as water does, not to move people to safety=evaporate 是液体变成气体，像水蒸发一样，不是把人转移到安全地方;evaluate/evaluated=evaluate means to judge how good something is, not to move people out of danger=evaluate 是评估好坏，不是把人撤离危险|e · vac · u · ate|-vac- for *vacant*, and -uate at the end|中间是 *vacant* 里的 -vac-，结尾是 -uate
      evacuation|boats carrying everyone from an island;families leaving home on a mayor's order;routes out of danger marked in green|an evacuation moves people out of danger; an evaluation judges something|evacuation 是撤离；evaluation 是评估|evaporation=evaporation is water turning into gas, not people leaving a dangerous place=evaporation 是水变成气体，不是人们离开危险地方;evaluation=evaluation is judging how good something is, not moving families or islands out of danger=evaluation 是评估好坏，不是让家庭或岛民撤离危险|e · vac · u · a · tion|evacuate + ion, with -tion said like *shun*|evacuate + ion，-tion 读作 *shun*
      aftermath|disease spreading after a flood;a country still dealing with a war;jobs lost after a storm|the aftermath is the time and effects after a disaster; a forecast is said before it|aftermath 是灾难之后的时期和影响；forecast 是事前的预报|forecast=forecast is what people say will happen before an event, not the time and effects that come after it=forecast 是事前对会发生什么的预测，不是事后的时期和影响;casualty=casualty is one person hurt or killed, not the whole period after a flood, a war or a storm=casualty 是受伤或死亡的人，不是洪水、战争或风暴之后的整个时期|af · ter · math|after + math, one word|after + math，合成一个词
      casualty|a landslide in which nobody was hurt or killed;hundreds of people hurt in an earthquake;twelve soldiers dead and forty wounded|a casualty is a person hurt or killed; a survivor is a person who lives through a disaster|casualty 是伤亡人员；survivor 是幸存者|survivor/survivors=survivor is a person who lives through a disaster, not someone hurt or killed by it=survivor 是从灾难中活下来的人，不是被灾难伤害或夺去生命的人;shelter/shelters=shelter is a safe place, not a person who was hurt or killed=shelter 是安全的地方，不是受伤或死亡的人|cas · u · al · ty|casual + ty, and y changing to -ies in *casualties*|casual + ty，复数把 y 变成 -ies：*casualties*
      debris|streets covered after a storm;broken pieces cleared from a road;pieces of a building falling onto cars|debris is broken pieces left after damage; the aftermath is the time after a disaster|debris 是损毁后留下的碎片；aftermath 是灾难之后的时期|aftermath=aftermath is the time and effects after a disaster, not broken pieces you can clear from a road=aftermath 是灾难之后的时期和影响，不是能从路上清走的碎片;shelter=shelter is a safe place for people, not broken pieces lying on a street or falling on cars=shelter 是供人避难的安全场所，不是散落街头、砸到汽车的碎片|de · bris|a silent s at the end, said *deb-ree*|结尾的 s 不发音，读作 *deb-ree*
      landslide|mud and rocks falling from a hillside after heavy rain;a village buried under falling earth;tree roots that hold soil on steep slopes|a landslide is earth and rock falling down a hill; a cyclone is a violent storm|landslide 是从山上滑下的泥石；cyclone 是猛烈的风暴|cyclone/cyclones=cyclone is a violent storm of wind and rain, not mud and rocks sliding down a hillside=cyclone 是狂风暴雨，不是从山坡上滑下的泥石;casualty/casualties=casualty is a person hurt or killed, not falling earth that buries a village=casualty 是受伤或死亡的人，不是掩埋村庄的泥土|land · slide|land + slide, one word|land + slide，合成一个词
      avalanche|snow coming down a mountain onto skiers;a mountain hut buried under snow;snow softening on the slopes in spring|an avalanche is snow falling down a mountain; a drought is a long time without rain|avalanche 是雪崩；drought 是长期干旱|cyclone/cyclones=cyclone is a violent storm over the sea, not snow sliding down a mountain=cyclone 是海上形成的猛烈风暴，不是从山上滑下的雪;drought/droughts=drought is a long time without rain, not a mass of snow that buries a hut=drought 是长期不下雨，不是掩埋小屋的大量积雪|av · a · lanche|-lanche at the end, with ch said like sh|结尾是 -lanche，ch 读作 sh
      cyclone|a storm hitting the coast with 200 km/h winds;storms forming over warm sea water;something fishermen wait for in port|a cyclone is a violent tropical storm; a landslide is earth falling down a hill|cyclone 是猛烈的热带风暴；landslide 是山体滑坡|landslide/landslides=landslide is earth and rock falling down a hill, not winds that form over the sea=landslide 是从山上滑落的泥石，不是在海上形成的大风;avalanche/avalanches=avalanche is snow falling down a mountain, not a storm with strong winds over warm water=avalanche 是从山上崩落的雪，不是暖海上的强风暴|cy · clone|y said like *eye*, and the silent e at the end|y 读作 *eye*，结尾的 e 不发音
    `,
  },
});

const water = vocabularyTopic({
  id: "b2-words-water",
  title: t("Water", "水资源"),
  summary: t(
    "Freshwater and groundwater; reservoirs and dams; flooding; water scarcity; drinkable water; purifying and filtering it; sanitation; desalination; tides.",
    "淡水和地下水；水库和水坝；洪水；水资源短缺；可饮用的水；净化和过滤；卫生设施；海水淡化；潮汐。",
  ),
  intro: t(
    "Our city's water comes from a **reservoir** behind a **dam**, and in dry years **groundwater** is pumped up from deep wells. These words help you talk about where water comes from, how we make it safe and what happens when there is too much or too little.",
    "我们城市的水来自一座 **dam**（水坝）后面的 **reservoir**（水库），干旱的年份还要从深井里抽 **groundwater**（地下水）。这些词帮你谈论水从哪里来、怎样让水变得安全，以及水太多或太少时会发生什么。",
  ),
  prerequisites: ["b1-words-nature-2"],
  words: [
    word(
      "freshwater",
      "water that is not salty, in rivers and lakes; living in such water",
      "淡水（的）",
      "Only 3% of the earth's water is {freshwater}; the rest is the salty water of the oceans. | Trout are {freshwater} fish that live in cold rivers and lakes. | The {freshwater} lakes that give the city its drinking water are drying up.",
      "saltwater wastewater",
      "groundwater",
    ),
    word(
      "groundwater",
      "water that is held under the ground in soil and rock",
      "地下水",
      "Wells pump {groundwater} to the surface. | Farms are using {groundwater} faster than rain can replace it. | Chemicals from the factory have soaked deep into the soil and polluted the {groundwater} under the town.",
      "rainwater seawater",
      "freshwater",
    ),
    word(
      "reservoir reservoirs",
      "a large lake, often made by people, where water is stored",
      "水库；蓄水池",
      "The {reservoir} supplies water to the whole city. | After the dry summer, the {reservoirs} in the hills are half empty, and the city may run short of water.|tides fountains | They built a {reservoir} in the valley.",
      "tide fountain",
      "dam",
    ),
    word(
      "dam dams",
      "a wall built across a river to hold back water",
      "水坝；堤坝",
      "The {dam} across the river produces electricity for millions. | They built a {dam} across the river to hold back the water and make a lake. | Old {dams} are being removed so that fish can swim upstream.|tides bridges",
      "tide bridge",
      "reservoir",
    ),
    word(
      "flooding",
      "the covering of land by water",
      "洪水泛滥；淹没",
      "Heavy rain caused {flooding} in the valley. | The town has new walls to prevent {flooding}. | Coastal {flooding} will become more common as sea levels rise.",
      "drought scarcity",
    ),
    word(
      "scarcity",
      "a lack of something that people need",
      "缺乏；短缺",
      "Water {scarcity} affects a third of the world, where people do not have enough to drink. | The {scarcity} of food led to high prices. | Some regions face severe {scarcity} of clean water.",
      "abundance sanitation",
    ),
    word(
      "drinkable",
      "clean and safe enough to drink",
      "可饮用的",
      "The tap water here is {drinkable}, so you don't need to buy bottled water. | After the flood, the well water was dirty and no longer {drinkable}. | The machine makes seawater {drinkable}.",
      "polluted salty",
    ),
    word(
      "purify purifies purified purifying",
      "to make something clean by removing harmful substances",
      "净化；提纯",
      "Plants in the wetland {purify} the water by taking dirt and chemicals out of it. | The water is {purified} before it reaches your tap.|polluted flooded | Boiling helps to {purify} water.",
      "pollute flood",
      "filter",
    ),
    word(
      "filter filters filtered filtering",
      "a device that removes dirt from liquid or air; to pass something through one",
      "过滤器；过滤",
      "We {filter} the water before we drink it. | The {filter} removes bacteria and dirt. | Rain is {filtered} through layers of rock.|flooded dammed",
      "flood dam",
      "purify",
    ),
    word(
      "sanitation",
      "systems for keeping places clean, especially for removing human waste",
      "卫生设施；环境卫生",
      "Poor {sanitation} spreads disease. | Billions of people lack basic {sanitation}. | The city invested in clean water and {sanitation}.",
      "scarcity flooding",
    ),
    word(
      "desalination",
      "the process of removing salt from seawater",
      "海水淡化",
      "{Desalination} turns seawater into drinking water. | {Desalination} plants, which take the salt out of seawater, use a lot of energy. | The country gets most of its water from {desalination}.",
      "sanitation destination",
    ),
    word(
      "tide tides",
      "the regular rise and fall of the level of the sea",
      "潮汐；潮流",
      "At low {tide} you can walk to the island. | The {tide} comes in twice a day. | Strong {tides}, rising and falling with the moon, can be used to produce electricity.|waves dams",
      "wave dam",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Flooding* and *scarcity* are opposite water problems: *flooding* is too much water covering the land, *scarcity* is not having enough. Look for clues such as *heavy rain* or *not enough to drink* around the gap.",
        "*flooding* 和 *scarcity* 是两种相反的水问题：*flooding* 是水太多淹没土地，*scarcity* 是水不够用。在空格附近找 *heavy rain* 或 *not enough to drink* 这样的线索。",
      ),
      meaning: t(
        "*Freshwater* is water without salt in rivers and lakes, *saltwater* is the water of the sea, and *groundwater* is water held under the soil. Check where the meaning says the water is and whether it is salty.",
        "*freshwater* 是江河湖泊里不含盐的水，*saltwater* 是海水，*groundwater* 是存在土壤下面的水。看释义说水在哪里、咸不咸。",
      ),
      spell: t(
        "*Reservoir* ends in French -voir, said like *vwar*, and *desalination* is built as de + salin + ation, with no double letters.",
        "*reservoir* 结尾是法语式的 -voir，读作 *vwar*；*desalination* 由 de + salin + ation 构成，没有双写字母。",
      ),
    },
    notes: `
      freshwater|the small part of the earth's water that is not salty;fish living in cold rivers and lakes;lakes giving a city its drinking water|freshwater has no salt; saltwater is the water of the sea|freshwater 不含盐；saltwater 是海水|saltwater=saltwater is the salty water of the sea, not the water of rivers, lakes and drinking taps=saltwater 是咸的海水，不是江河湖泊和自来水里的水;wastewater=wastewater is dirty water already used in homes and factories, not clean water in lakes and rivers=wastewater 是家庭和工厂用过的脏水，不是湖泊河流里的清水|fresh · wa · ter|fresh + water, one word|fresh + water，合成一个词
      groundwater|water pumped up by wells;water farms use faster than rain replaces it;water under a town polluted through the soil|groundwater is held under the ground; rainwater falls from the sky|groundwater 存在地下；rainwater 从天上落下|rainwater=rainwater is water that falls from the sky, not water pumped up from under the soil=rainwater 是从天上落下的雨水，不是从土壤下面抽上来的水;seawater=seawater is the salty water of the sea, not water held in soil and rock under the land=seawater 是咸的海水，不是陆地下面土壤和岩石里的水|ground · wa · ter|ground + water, one word|ground + water，合成一个词
      reservoir|a lake supplying water to a whole city;lakes in the hills half empty after a dry summer;a lake built in a valley|a reservoir is a large lake where water is stored; a fountain is a small jet of water for decoration|reservoir 是蓄水的大湖；fountain 是装饰用的喷泉|tide/tides=tide is the rise and fall of the sea, not a lake that stores a city's water=tide 是海水的涨落，不是为城市蓄水的湖;fountain/fountains=fountain is a small jet of water for decoration, far too small to supply a city=fountain 是装饰用的小喷泉，太小了，供不了一座城市的水|res · er · voir|-voir at the end, said like *vwar*|结尾是 -voir，读作 *vwar*
      dam|a wall across a river that produces electricity;a wall built to hold back water and make a lake;old walls removed so fish can swim upstream|a dam holds water back; a bridge lets people cross over a river|dam 是拦水的；bridge 是让人过河的|tide/tides=tide is the rise and fall of the sea, not a wall that people build across a river=tide 是海水的涨落，不是人们在河上修的墙;bridge/bridges=bridge lets people cross a river but does not hold back its water or stop fish swimming upstream=bridge 让人过河，但不拦水，也不挡鱼往上游|dam|one m; do not add the n of *damn*|一个 m，别加上 *damn* 的 n
      flooding|heavy rain in a valley;walls built to keep water out of a town;the coast as sea levels rise|flooding is too much water covering land; a drought is too little rain|flooding 是水太多淹没土地；drought 是雨太少|drought=drought is a long time without rain, the opposite of heavy rain and rising water=drought 是长期不下雨，和暴雨、水位上涨正相反;scarcity=scarcity is not having enough of something, the opposite of water covering the land=scarcity 是不够用，和大水淹没土地正相反|flood · ing|oo said like the u in *cut*|oo 读作 *cut* 里的 u
      scarcity|places where people do not have enough to drink;too little food leading to high prices;regions short of clean water|scarcity is not having enough; abundance is having more than enough|scarcity 是短缺；abundance 是充足|abundance=abundance is having more than enough, the opposite of a lack that leaves people short=abundance 是很充足，和让人不够用的短缺正相反;sanitation=sanitation is the system for removing waste, not a lack of water or food=sanitation 是清除污物的卫生设施，不是水或食物的短缺|scar · ci · ty|-ci- with c said like s|-ci- 中的 c 读作 s
      drinkable|tap water so safe there is no need for bottled water;well water too dirty after a flood;seawater made safe by a machine|drinkable water is safe to drink; polluted water is dirty and harmful|drinkable 的水可以安全饮用；polluted 的水又脏又有害|polluted=polluted means dirty and harmful, the opposite of safe enough to drink=polluted 是被污染、有害的，和可以安全饮用正相反;salty=salty means full of salt like seawater, not safe and clean enough to drink=salty 是像海水一样咸，不是可以安全饮用|drink · a · ble|drink + able, with nothing dropped|drink + able，中间不去掉字母
      purify|wetland plants taking dirt and chemicals out of water;water cleaned before it reaches the tap;boiling water|to purify is to make clean; to pollute is to make dirty|purify 是净化；pollute 是污染|pollute/polluted=pollute means to make water dirty, the opposite of taking dirt out of it=pollute 是把水弄脏，和去除水中的污物正相反;flood/flooded=flood means to cover land with too much water, not to make water clean=flood 是用大水淹没，不是让水变干净|pu · ri · fy|y changing to i in *purified* and *purifies*|*purified*、*purifies* 要把 y 变成 i
      filter|water cleaned before drinking;a device that removes bacteria and dirt;rain passing through layers of rock|to filter is to pass something through a device that removes dirt; a flood is too much water|filter 是过滤；flood 是洪水|flood/flooded=flood is water covering the land, not a device or a process that removes dirt=flood 是淹没土地的大水，不是去除污物的装置或过程;dam/dammed=dam is a wall that holds back a river, not something water passes through to be cleaned=dam 是拦住河水的墙，不是让水穿过来净化的东西|fil · ter|one l, and -er at the end|一个 l，结尾是 -er
      sanitation|disease spread by poor systems for waste;billions lacking basic toilets and drains;clean water and waste systems a city invested in|sanitation means systems for removing waste; scarcity means a lack of something|sanitation 是清除污物的卫生设施；scarcity 是短缺|scarcity=scarcity is a lack of something, not the systems that keep a place clean=scarcity 是短缺，不是保持清洁的设施;flooding=flooding is water covering the land, not systems people invest in to remove waste=flooding 是大水淹没土地，不是人们投资建设的排污系统|san · i · ta · tion|sanit- as in *sanitary*, and -tion said like *shun*|sanit- 同 *sanitary*，-tion 读作 *shun*
      desalination|seawater turned into drinking water;plants taking the salt out of seawater;where a country gets most of its water|desalination removes salt from seawater; sanitation removes waste|desalination 是海水淡化；sanitation 是清除污物|sanitation=sanitation is the system for removing human waste, not for taking salt out of seawater=sanitation 是清除人类排泄物的设施，不是去除海水中的盐;destination=destination is the place you are travelling to, not a way of making seawater drinkable=destination 是旅行的目的地，不是让海水能喝的方法|de · sal · i · na · tion|de + salin + ation, with no double letters|de + salin + ation，没有双写字母
      tide|walking to the island when the sea is low;the sea coming in twice a day;the sea rising and falling with the moon|the tide is the regular rise and fall of the sea; a wave is one moving ridge of water|tide 是海水有规律的涨落；wave 是一道浪|wave/waves=wave is one moving ridge of water, not the slow rise and fall of the sea with the moon=wave 是一道移动的浪，不是随月亮缓慢涨落的海水;dam/dams=dam is a wall built across a river, not the movement of the sea=dam 是建在河上的墙，不是海水的运动|tide|the silent e at the end that makes i say its name|结尾不发音的 e 让 i 读字母本音
    `,
  },
});

const causes = vocabularyTopic({
  id: "b2-words-cause-and-effect",
  title: t("Words of Cause and Effect", "表示因果的词"),
  summary: t(
    "Contributing to something and contributions; triggering and deriving; consequences and implications; influencing; accelerating, intensifying and worsening; diminishing and alleviating.",
    "促成和贡献；引发和来源；后果和影响；影响；加速、加剧和恶化；减少和缓解。",
  ),
  intro: t(
    "Cars **contribute** to air pollution, a single spark can **trigger** a forest fire, and warming **accelerates** the melting of the ice. These words help you explain why things happen and what follows from them.",
    "汽车 **contribute**（促成）空气污染，一个火星就能 **trigger**（引发）森林大火，气候变暖 **accelerates**（加速）冰的融化。这些词帮你解释事情为什么发生，以及随之而来的结果。",
  ),
  prerequisites: ["b1-words-describing-change"],
  words: [
    word(
      "contribute contributes contributed contributing",
      "to be one of the causes of something; to give something to help",
      "促成；贡献；捐献",
      "Cars {contribute} to air pollution. | Many factors {contributed} to the flood.|objected reacted | Everyone {contributed} to the cost of the new well, giving what they could.|objected reacted",
      "object react",
    ),
    word(
      "contribution contributions",
      "something you give or do to help; a part in causing something",
      "贡献；捐款；促成作用",
      "Farming makes a large {contribution} to emissions. | Thank you for your {contribution} to the project. | Small {contributions} from many people add up: the fund now has \\$5,000.|consequences implications",
      "consequence implication",
    ),
    word(
      "trigger triggers triggered triggering",
      "to make something start to happen, often suddenly",
      "引发；触发",
      "The earthquake {triggered} a landslide that buried the road within seconds.|prevented diminished | Strong sunlight can {trigger} a headache that lasts all afternoon. | The price rise {triggered} protests, and thousands filled the streets.|prevented diminished",
      "prevent diminish",
    ),
    word(
      "derive derives derived deriving",
      "to get something from something else; to come from it",
      "获得；源自",
      'Much of the country\'s energy is {derived} from coal.|deprived driven | We {derive} great pleasure from the garden. | The word "ecology" {derives} from Greek.|deprives drives',
      "deprive drive",
    ),
    word(
      "consequence consequences",
      "a result of something, often a bad one",
      "后果；结果",
      "Rising seas are a {consequence} of global warming: as the ice melts, the water rises. | He acted without thinking of the {consequences}, and now he has to pay for the damage.|causes contributions | The decision had serious {consequences} for farmers.|causes contributions",
      "cause contribution",
      "implication",
    ),
    word(
      "implication implications",
      "a possible effect of an action or decision; something suggested without being said",
      "可能的影响；含意",
      "The new law has important {implications} for farmers.|causes contributions | Have you thought about the {implications} of this plan for the people who will lose their homes?|causes contributions | The study has {implications} for the whole industry.|causes contributions",
      "cause contribution",
      "consequence",
    ),
    word(
      "influence influences influenced influencing",
      "to have an effect on what someone does or what happens; the effect itself",
      "影响",
      "The ocean {influences} the weather on land, keeping coastal winters mild.|triggers derives | Her parents {influenced} her choice of career, but in the end the decision was hers.|triggered derived | Advertising strongly {influences} children, who want every toy they see.|triggers derives",
      "trigger derive",
    ),
    word(
      "accelerate accelerates accelerated accelerating",
      "to happen or make something happen faster",
      "加速；加快",
      "Warming has {accelerated} the melting of the ice, which now disappears twice as fast.|slowed accumulated | The car {accelerated} onto the highway, going from 0 to 100 km/h in eight seconds.|slowed accumulated | The government wants to {accelerate} the switch to clean energy and finish it ten years earlier.",
      "slow accumulate",
      "intensify",
    ),
    word(
      "intensify intensifies intensified intensifying",
      "to become or make something stronger or more extreme",
      "加剧；增强",
      "The storm {intensified} as it moved toward the coast, and its winds grew stronger every hour.|weakened identified | Police {intensified} the search, sending fifty more officers and two helicopters.|weakened identified | The drought has {intensified} the conflict over water, and the two villages now fight every week.|weakened identified",
      "weaken identify",
      "worsen accelerate",
    ),
    word(
      "worsen worsens worsened worsening",
      "to become or make something worse",
      "恶化；使更糟",
      "The air quality {worsened} during the heatwave, and people with asthma were told to stay indoors.|improved loosened | Cutting down the trees will {worsen} the flooding, because nothing will soak up the rain. | His health is {worsening}, so he is going back into hospital.|improving loosening",
      "improve loosen",
      "intensify",
    ),
    word(
      "diminish diminishes diminished diminishing",
      "to become or make something smaller or weaker",
      "减少；减弱",
      "The supply of fresh water is {diminishing} as rivers dry up and wells run low.|increasing accelerating | The pain {diminished} after a few days, and soon she could walk without help.|increased accelerated | Nothing can {diminish} her achievement: she will always be the first woman to win the race.",
      "increase accelerate",
      "alleviate",
    ),
    word(
      "alleviate alleviates alleviated alleviating",
      "to make pain or a problem less severe",
      "缓解；减轻",
      "The new dam will {alleviate} water shortages by storing rain for the dry months. | The medicine {alleviated} her pain, and she slept well for the first time in days.|aggravated elevated | Trees in cities {alleviate} the effects of heat by giving shade and cooling the air.",
      "aggravate elevate",
      "diminish",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "Many of these verbs have an opposite among the choices: *worsen* and *improve*, *intensify* and *weaken*, *alleviate* and *aggravate*. Decide first whether the sentence describes things getting better or worse.",
        "这些动词在选项里常有反义词：*worsen* 和 *improve*，*intensify* 和 *weaken*，*alleviate* 和 *aggravate*。先判断句子说的是情况变好还是变坏。",
      ),
      meaning: t(
        "A *consequence* and a *cause* point in opposite directions: a cause comes first and makes something happen, while a *consequence* comes after as its result. Check whether the meaning says *result of* or *reason for*.",
        "*consequence* 和 *cause* 方向相反：cause 在前，引起某事；*consequence* 在后，是它的结果。看释义说的是“……的结果”还是“……的原因”。",
      ),
      spell: t(
        "*Alleviate* has a double l, *accelerate* has a double c, and *intensify* changes y to i in *intensified* and *intensifies*.",
        "*alleviate* 双写 l，*accelerate* 双写 c，*intensify* 在 *intensified*、*intensifies* 里要把 y 变成 i。",
      ),
    },
    notes: `
      contribute|cars and air pollution;many factors behind a flood;everyone giving what they could for a new well|to contribute is to be one of the causes or to give something to help; to object is to say you are against it|contribute 是促成或出力；object 是表示反对|object/objected=object means to say you are against something, which cars and factors cannot do and which is the opposite of giving to help=object 是表示反对，汽车和因素不会反对，而且和出力帮忙正相反;react/reacted=react means to respond to something that happens, not to be one of its causes or to give money=react 是对发生的事作出反应，不是成为原因或出钱|con · trib · ute|-ute at the end, said like *yoot*|结尾是 -ute，读作 *yoot*
      contribution|farming's share of emissions;help given to a project;small gifts of money adding up to \\$5,000|a contribution is a part given or played in something; a consequence is a result|contribution 是贡献或促成作用；consequence 是结果|consequence/consequences=consequence is a result that follows something, not a share given or played by farming, a helper or a donor=consequence 是随之而来的结果，不是农业所占的份额，也不是帮忙者或捐款人的付出;implication/implications=implication is a possible effect or a hidden meaning, not something people give to help=implication 是可能的影响或言外之意，不是人们为帮忙而付出的东西|con · tri · bu · tion|contribute + ion, with the e dropped|contribute + ion，去掉 e
      trigger|an earthquake and a landslide within seconds;sunlight and a headache lasting all afternoon;a price rise and protests filling the streets|to trigger is to make something start suddenly; to prevent is to stop it happening|trigger 是突然引发；prevent 是阻止发生|prevent/prevented=prevent means to stop something from happening, but here the landslide, the headache and the protests did happen=prevent 是阻止某事发生，可这里的滑坡、头痛和抗议都发生了;diminish/diminished=diminish means to make something smaller or weaker, not to start it=diminish 是使变小或减弱，不是引发|trig · ger|the double g, and -er at the end|双写 g，结尾是 -er
      derive|a country's energy coming from coal;pleasure got from a garden;a word that comes from Greek|to derive is to get something from a source; to deprive is to take something away from someone|derive 是从来源获得；deprive 是夺走别人的东西|deprive/deprived/deprives=deprive means to take something away from someone, not to get energy, pleasure or a word from a source=deprive 是剥夺别人的东西，不是从来源获得能源、快乐或词语;drive/driven/drives=drive means to make a car or a person move, not to get something from a source=drive 是驾驶或驱使，不是从来源获得某物|de · rive|de + rive, with the silent e that makes i say its name|de + rive，结尾不发音的 e 让 i 读字母本音
      consequence|rising seas as the ice melts;damage someone now has to pay for;serious results for farmers|a consequence is a result; a cause is what makes it happen|consequence 是结果；cause 是导致结果的原因|cause/causes=cause is what makes something happen, so it comes before, not after as a result=cause 是使事情发生的原因，在前面，而不是在后面的结果;contribution/contributions=contribution is help given or a part played, not a result someone has to face=contribution 是给予的帮助或起的作用，不是要承担的后果|con · se · quence|-quence at the end, with qu said like *kw*|结尾是 -quence，qu 读作 *kw*
      implication|a new law's effects on farmers;a plan's effects on people losing their homes;a study's effects on a whole industry|an implication is a possible effect or a hidden meaning; a cause is what makes something happen|implication 是可能的影响或言外之意；cause 是原因|cause/causes=cause is what makes something happen, not an effect that a law, a plan or a study may have=cause 是使事情发生的原因，不是法律、计划或研究可能带来的影响;contribution/contributions=contribution is help given or a part played, not a possible effect on people=contribution 是给予的帮助或起的作用，不是对人可能产生的影响|im · pli · ca · tion|imply + cation, with y changing to i|imply + cation，y 变成 i
      influence|the ocean keeping coastal winters mild;parents and a choice of career;advertising and children wanting every toy|to influence is to have an effect on; to trigger is to make something start suddenly|influence 是产生影响；trigger 是突然引发|trigger/triggers/triggered=trigger means to make something start suddenly, not to have a gentle, lasting effect on weather or choices=trigger 是突然引发，不是对天气或选择产生持续的影响;derive/derives/derived=derive means to get something from a source, not to have an effect on someone=derive 是从来源获得，不是对人产生影响|in · flu · ence|flu in the middle, and -ence at the end|中间是 flu，结尾是 -ence
      accelerate|ice disappearing twice as fast;a car going from 0 to 100 km/h in eight seconds;a switch to clean energy finished ten years earlier|to accelerate is to make faster; to slow is to make slower|accelerate 是加速；slow 是减速|slow/slowed=slow means to make or become slower, the opposite of twice as fast or ten years earlier=slow 是变慢，和快一倍、提前十年正相反;accumulate/accumulated=accumulate means to collect more and more over time, not to go or make something go faster=accumulate 是逐渐积累，不是加速|ac · cel · er · ate|the double c, said k then s|双写 c，先读 k 再读 s
      intensify|a storm with winds stronger every hour;police sending more officers and helicopters;two villages fighting every week over water|to intensify is to make stronger; to weaken is to make less strong|intensify 是加强、加剧；weaken 是削弱|weaken/weakened=weaken means to become less strong, the opposite of stronger winds, more officers and more fighting=weaken 是变弱，和风更大、警力更多、冲突更频繁正相反;identify/identified=identify means to recognize who or what something is, not to make it stronger=identify 是辨认出是谁或是什么，不是加强|in · ten · si · fy|intense + ify, with the e dropped, and y changing to i in *intensified*|intense + ify，去掉 e；*intensified* 里 y 变成 i
      worsen|air so bad that people with asthma stay indoors;flooding with nothing to soak up the rain;health that sends someone back into hospital|to worsen is to become worse; to improve is to become better|worsen 是变得更糟；improve 是变好|improve/improved/improving=improve means to become better, the opposite of air that keeps people indoors or health that needs hospital=improve 是变好，和让人不敢出门的空气、要回医院的身体正相反;loosen/loosened/loosening=loosen means to make something less tight, not to make a problem worse=loosen 是变松，不是让问题更糟|wors · en|worse + n, with the e dropped|worse + n，去掉 e
      diminish|fresh water running low as rivers dry up;pain fading until someone can walk;an achievement nothing can make smaller|to diminish is to become smaller or weaker; to increase is to become larger|diminish 是变少、减弱；increase 是增加|increase/increasing/increased=increase means to become larger, the opposite of rivers drying up and pain fading=increase 是增加，和河流干涸、疼痛消退正相反;accelerate/accelerating/accelerated=accelerate means to go faster, not to become smaller or weaker=accelerate 是加速，不是变小或减弱|di · min · ish|di + min + ish, with -ish at the end|di + min + ish，结尾是 -ish
      alleviate|a dam storing rain for the dry months;medicine helping someone sleep well;trees giving shade and cooling the air|to alleviate is to make a problem less severe; to aggravate is to make it worse|alleviate 是缓解；aggravate 是加重|aggravate/aggravated=aggravate means to make a problem worse, the opposite of easing shortages, pain or heat=aggravate 是使问题更严重，和缓解缺水、疼痛或炎热正相反;elevate/elevated=elevate means to raise something higher, not to make pain or a problem less severe=elevate 是抬高、提升，不是减轻疼痛或问题|al · le · vi · ate|the double l, and -iate at the end|双写 l，结尾是 -iate
    `,
  },
});

const future = vocabularyTopic({
  id: "b2-words-the-future",
  title: t("The Future of the Earth", "地球的未来"),
  summary: t(
    "Inevitable, irreversible and unprecedented change; the foreseeable future; long-term and short-term effects; potential and potentially; projected figures; scenarios, prospects and the outlook.",
    "不可避免、不可逆转和前所未有的变化；可预见的将来；长期和短期影响；潜在的；预计的数字；情景、前景和展望。",
  ),
  intro: t(
    "Scientists describe three **scenarios** for 2100; in the worst one, the **projected** rise in sea level would cause **irreversible** damage. These words help you talk about what may happen next and how sure we can be about it.",
    "科学家为 2100 年描绘了三种 **scenarios**（情景）；在最坏的情况下，**projected**（预计的）海平面上升会造成 **irreversible**（不可逆转的）破坏。这些词帮你谈论接下来可能发生什么，以及我们对此有多大把握。",
  ),
  prerequisites: ["b1-words-change"],
  words: [
    word(
      "inevitable",
      "certain to happen; impossible to avoid",
      "不可避免的",
      "Some warming is now {inevitable}: even if we stopped all emissions today, it would still happen. | Change is {inevitable}, so we must prepare for it. | With oil so scarce, it was {inevitable} that prices would rise.",
      "avoidable invisible",
      "irreversible",
    ),
    word(
      "irreversible",
      "impossible to change back to how it was before",
      "不可逆转的",
      "The damage to the reef may be {irreversible}: the dead coral may never grow back. | Extinction is {irreversible}: once the last animal of a species dies, it is gone forever. | Some changes to the climate are already {irreversible}, and no technology can undo them.",
      "reversible irresistible",
      "inevitable",
    ),
    word(
      "unprecedented",
      "never having happened before",
      "前所未有的；空前的",
      "The heat this summer was {unprecedented}: no thermometer had ever recorded such temperatures. | The city is growing faster than ever before, at an {unprecedented} rate. | The crisis led to {unprecedented} cooperation between countries that had never worked together before.",
      "ordinary average",
    ),
    word(
      "foreseeable",
      "that can be known or planned for in advance",
      "可预见的",
      "Prices will stay high for the {foreseeable} future. | The risks were {foreseeable}: experts had warned about them for years, but nobody acted. | In the {foreseeable} future, coal will still be used.",
      "unforeseen unprecedented",
    ),
    word(
      "long-term",
      "lasting or having an effect over a long time",
      "长期的",
      "We need a {long-term} plan for water that will still work in fifty years. | The {long-term} effects of the drug, after many years of use, are unknown. | Planting trees is a {long-term} investment: the forest will only be ready in forty years.",
      "short-term temporary",
    ),
    word(
      "short-term",
      "lasting or having an effect for a short time",
      "短期的",
      "Cheap energy is only a {short-term} solution: it helps this winter, but not in the years ahead. | The company cares only about {short-term} profits for the next few months, not the future of the planet. | Rain brought {short-term} relief from the drought, but a week later the fields were dry again.",
      "long-term permanent",
    ),
    word(
      "potential",
      "possible in the future; the possibility of developing",
      "潜在的；潜力",
      "Wind farms have the {potential} to supply all our power. | The scheme has {potential} risks. | She has great {potential} as a scientist.",
      "scenario outlook",
      "potentially",
    ),
    word(
      "potentially",
      "possibly, in the future",
      "潜在地；可能地",
      "The new virus is {potentially} dangerous, so scientists are testing whether it can spread. | If it works, this drug could {potentially} save millions of lives. | Rising seas are {potentially} a disaster for coastal cities, if the water keeps climbing.",
      "inevitably partially",
      "potential",
    ),
    word(
      "projected",
      "planned or expected for the future, based on present figures",
      "预计的；规划的",
      "The {projected} rise in sea level is one meter. | The city's population is {projected} to double. | {Projected} costs, based on this year's prices, have risen sharply.",
      "protected rejected",
    ),
    word(
      "scenario scenarios",
      "a description of what could possibly happen",
      "情景；设想；方案",
      "In the worst {scenario}, the city would flood. | Scientists modeled three {scenarios} for 2100.|sceneries prospects | The best-case {scenario} is that temperatures stabilize.",
      "scenery prospect",
    ),
    word(
      "prospect prospects",
      "the possibility that something will happen; chances of success in the future",
      "前景；可能性",
      "There is little {prospect} of rain this week. | The {prospect} of losing their homes frightened people. | Young people's job {prospects} are improving.|respects suspects",
      "respect suspect",
      "outlook",
    ),
    word(
      "outlook outlooks",
      "what is likely to happen in the future; a way of thinking about life",
      "前景；展望；观点",
      "The economic {outlook} is good. | The weather {outlook} for the weekend is dry. | She has a positive {outlook} on life.",
      "outlet lookout",
      "prospect",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Long-term* and *short-term* are opposites, and so are *unprecedented* and *ordinary*. Look for time clues such as *fifty years*, *this winter* or *never before* to decide which one the sentence needs.",
        "*long-term* 和 *short-term* 意思相反，*unprecedented* 和 *ordinary* 也是。找 *fifty years*、*this winter*、*never before* 这样的时间线索，判断句子需要哪一个。",
      ),
      meaning: t(
        "A *scenario* is a description of what could happen, but *scenery* is the land you see around you. Check whether the meaning talks about a possible future or about a view.",
        "*scenario* 是对可能发生之事的描述，*scenery* 却是你看到的周围风景。看释义说的是可能的未来还是眼前的景色。",
      ),
      spell: t(
        "*Unprecedented* is un + precedent + ed, *foreseeable* keeps the e of *fore* in *fore · see · a · ble*, and *long-term* and *short-term* keep their hyphens.",
        "*unprecedented* 由 un + precedent + ed 构成；*foreseeable* 保留 *fore* 的 e：*fore · see · a · ble*；*long-term*、*short-term* 要保留连字符。",
      ),
    },
    notes: `
      inevitable|warming that would happen even if emissions stopped;change we must prepare for;prices rising with oil so scarce|inevitable means certain to happen; avoidable means it can be stopped|inevitable 是不可避免的；avoidable 是可以避免的|avoidable=avoidable means able to be stopped from happening, the opposite of something certain to come=avoidable 是可以避免的，和必然到来正相反;invisible=invisible means impossible to see, not certain to happen=invisible 是看不见的，不是必然发生的|in · ev · i · ta · ble|in + evit + able, with -able at the end|in + evit + able，结尾是 -able
      irreversible|dead coral that may never grow back;a species gone forever;climate changes no technology can undo|irreversible means impossible to undo; reversible means it can be changed back|irreversible 是不可逆转的；reversible 是可以逆转的|reversible=reversible means able to be changed back, the opposite of gone forever or impossible to undo=reversible 是可以逆转的，和永远消失、无法挽回正相反;irresistible=irresistible means too attractive to refuse, not impossible to undo=irresistible 是让人无法抗拒的，不是不可逆转的|ir · re · vers · i · ble|the double r of ir- + reverse, and -ible, not -able|ir- 加 reverse 形成双写 r，结尾是 -ible，不是 -able
      unprecedented|heat no thermometer had ever recorded;a city growing faster than ever before;countries working together for the first time|unprecedented means never having happened before; ordinary means normal and usual|unprecedented 是前所未有的；ordinary 是平常的|ordinary=ordinary means normal and usual, the opposite of never having happened before=ordinary 是平常的，和前所未有正相反;average=average means typical or in the middle, not something that has never happened before=average 是一般水平的，不是前所未有的|un · prec · e · dent · ed|un + precedent + ed, with c said like s|un + precedent + ed，c 读作 s
      foreseeable|prices staying high for the years ahead;risks experts had warned about for years;coal still used in the years ahead|foreseeable means able to be known in advance; unforeseen means nobody expected it|foreseeable 是可预见的；unforeseen 是没人料到的|unforeseen=unforeseen means not expected by anyone, the opposite of risks experts warned about or a future we can plan for=unforeseen 是没人料到的，和专家早有警告、可以规划的未来正相反;unprecedented=unprecedented means never having happened before, not able to be known in advance=unprecedented 是前所未有的，不是可以预见的|fore · see · a · ble|fore + see + able, with both e's of *fore* and *see* kept|fore + see + able，保留 *fore* 和 *see* 的 e
      long-term|a water plan still working in fifty years;the effects of a drug after many years of use;a forest only ready in forty years|long-term means lasting a long time; short-term means lasting a short time|long-term 是长期的；short-term 是短期的|short-term=short-term means lasting only a short time, the opposite of fifty years, many years or forty years=short-term 是短期的，和五十年、多年、四十年正相反;temporary=temporary means lasting only for a while, not over many years=temporary 是暂时的，不是持续多年的|long-term|long + term with a hyphen|long 和 term 之间用连字符
      short-term|a solution that helps this winter only;profits for the next few months;relief that lasted only a week|short-term means lasting a short time; long-term means lasting a long time|short-term 是短期的；long-term 是长期的|long-term=long-term means lasting many years, the opposite of this winter, a few months or a week=long-term 是长期的，和一个冬天、几个月、一周正相反;permanent=permanent means lasting forever, the opposite of help that ends soon=permanent 是永久的，和很快结束的帮助正相反|short-term|short + term with a hyphen|short 和 term 之间用连字符
      potential|wind farms able to supply all our power;possible risks of a scheme;a future scientist's ability to develop|potential is the possibility of developing; an outlook is what is likely to happen|potential 是发展的可能性；outlook 是前景|scenario=scenario is a description of what could happen, not an ability someone has or a possible risk=scenario 是对可能发生之事的描述，不是人的潜力，也不是潜在的风险;outlook=outlook is the general view of the future, not an ability or a possible risk=outlook 是对未来的总体看法，不是潜力，也不是潜在风险|po · ten · tial|-tial said like *shul*|-tial 读作 *shul*
      potentially|a virus scientists are testing;a drug that may save millions if it works;rising seas if the water keeps climbing|potentially means possibly, in the future; inevitably means certainly|potentially 是可能地；inevitably 是必然地|inevitably=inevitably means certainly, which does not fit something still being tested or depending on *if*=inevitably 是必然地，不适合还在检验或带 *if* 条件的事;partially=partially means only in part, not possibly in the future=partially 是部分地，不是将来可能|po · ten · tial · ly|potential + ly, with a double l|potential + ly，双写 l
      projected|an expected rise in sea level of one meter;a population expected to double;costs worked out from this year's prices|projected means expected from present figures; protected means kept safe|projected 是根据现有数据预计的；protected 是受保护的|protected=protected means kept safe from harm, not expected from present figures=protected 是受保护的，不是根据现有数据预计的;rejected=rejected means refused, not expected or planned for the future=rejected 是被拒绝的，不是预计或规划的|pro · ject · ed|project + ed, with j, not t, after *pro*|project + ed，*pro* 后面是 j，不是 t
      scenario|the worst case of a city flooding;three possible futures modeled for 2100;temperatures settling in the best case|a scenario is a description of what could happen; scenery is the land you see around you|scenario 是对可能发生之事的设想；scenery 是周围的风景|scenery/sceneries=scenery is the land, hills and trees you see around you, not a description of a possible future=scenery 是眼前的山川树木，不是对可能未来的描述;prospect/prospects=prospect is the chance that something will happen, not a full description of how it could go=prospect 是某事发生的可能性，不是对事情如何发展的完整描述|sce · nar · i · o|sc said like s, and -ario said like *airy-oh*|sc 读作 s，-ario 读作 *airy-oh*
      prospect|little chance of rain this week;the possibility of losing homes;young people's chances of jobs|a prospect is the chance of something in the future; respect is admiration|prospect 是将来某事的可能性；respect 是尊敬|respect/respects=respect is admiration for someone, not the chance that something will happen=respect 是对人的尊敬，不是某事发生的可能性;suspect/suspects=suspect is a person thought to have done a crime, not a chance of rain or jobs=suspect 是犯罪嫌疑人，不是下雨或找到工作的可能性|pros · pect|pro + spect, with -ct at the end|pro + spect，结尾是 -ct
      outlook|what is likely for the economy;what the weather will probably be at the weekend;a positive way of thinking about life|an outlook is what is likely to happen or a way of seeing life; an outlet is a shop or a way out|outlook 是前景或人生态度；outlet 是商店或出口|outlet=outlet is a shop that sells cheap goods or a way for something to get out, not what is likely to happen=outlet 是折扣商店或出口，不是可能出现的前景;lookout=lookout is a person or place watching for danger, not the likely future or a way of thinking=lookout 是瞭望的人或地方，不是前景，也不是看待人生的态度|out · look|out + look, one word|out + look，合成一个词
    `,
  },
});

const materials = vocabularyTopic({
  id: "b2-words-materials-2",
  title: t("Raw Materials and Fabrics", "原料和织物"),
  summary: t(
    "Timber; fabrics and textiles; synthetic materials and polyester; ceramics; minerals and ores; iron, copper and alloys; crude oil.",
    "木材；织物和纺织品；合成材料和聚酯纤维；陶瓷；矿物和矿石；铁、铜和合金；原油。",
  ),
  intro: t(
    "The old barn is built of **timber**, its roof rests on **iron** beams, and the water runs through **copper** pipes. These words help you talk about what things are made of and where those materials come from.",
    "这座老谷仓用 **timber**（木材）建成，屋顶架在 **iron**（铁）梁上，水从 **copper**（铜）管里流过。这些词帮你谈论东西是用什么做的，以及这些材料从哪里来。",
  ),
  prerequisites: ["a2-words-materials"],
  words: [
    word(
      "timber",
      "wood used for building or making things",
      "木材；木料",
      "The house is built of {timber} from local forests. | {Timber} is a renewable material if forests are replanted. | Illegal {timber} is cut from protected forests.",
      "ore copper",
    ),
    word(
      "fabric fabrics",
      "cloth, or a type of cloth",
      "织物；布料",
      "The dress is made of a light {fabric}. | Cotton is a natural {fabric}. | She chose a blue {fabric} for the curtains.",
      "alloy timber",
      "textile polyester",
    ),
    word(
      "textile textiles",
      "cloth made by weaving or knitting; the industry that makes cloth",
      "纺织品；纺织业",
      "The {textile} industry makes cloth from cotton and wool. | The town's factories once produced fine cotton {textiles}.|timber ores | {Textile} waste, such as old clothes and sheets, fills many landfills.",
      "timber ore",
      "fabric",
    ),
    word(
      "synthetic",
      "made by people from chemicals, not natural",
      "合成的；人造的",
      "Nylon is a {synthetic} material, made in factories from oil. | {Synthetic} fibers release tiny pieces of plastic in the wash. | The rubber is {synthetic}, not natural.",
      "natural sympathetic",
    ),
    word(
      "ceramic ceramics",
      "made of clay that has been baked hard; objects made in this way",
      "陶瓷（的）",
      "The kitchen floor has {ceramic} tiles. | She makes {ceramics} in her studio, baking clay pots and bowls in a hot oven.|polyesters fabrics | {Ceramic} plates last for years.",
      "polyester fabric",
    ),
    word(
      "mineral minerals",
      "a natural substance, such as gold or salt, found in the earth; a substance the body needs",
      "矿物；矿物质",
      "The mountains are rich in {minerals}.|fabrics textiles | Milk contains {minerals} such as calcium.|fabrics textiles | {Mineral} water comes from underground springs.",
      "fabric textile",
      "ore",
    ),
    word(
      "ore ores",
      "rock from which metal can be taken",
      "矿石",
      "Iron {ore} is shipped to China. | The mine produces copper {ore}. | The {ore} is crushed and heated to get the metal.",
      "fabric timber",
      "mineral",
    ),
    word(
      "iron",
      "a hard grey metal used to make steel",
      "铁",
      "Steel is made from {iron}. | The old bridge is made of {iron} and has rusted to a dark red. | Spinach contains a lot of {iron}.",
      "timber fabric",
      "copper",
    ),
    word(
      "copper",
      "a soft reddish-brown metal used for electric wires and pipes",
      "铜",
      "Electric wires are made of {copper}. | {Copper} pipes carry water through the house. | The statue is covered in {copper}, which has turned green.",
      "timber fabric",
      "iron",
    ),
    word(
      "alloy alloys",
      "a metal made by mixing two or more metals",
      "合金",
      "Bronze is an {alloy} of copper and tin. | The bike frame is made of an {alloy} of aluminum and other metals, so it is light. | Steel is an {alloy} of iron and carbon.",
      "iron element",
    ),
    word(
      "crude",
      "in its natural state, before being processed (crude oil); simple and rough",
      "天然的；未加工的；粗糙的",
      "The price of {crude} oil, pumped straight from the ground, fell last month. | The tanker spilled thousands of tons of {crude} oil, still thick and black as it came from the well. | They built a {crude} shelter from branches in a few minutes, with gaps that let the rain in.",
      "refined synthetic",
    ),
    word(
      "polyester",
      "a synthetic fabric made from oil",
      "聚酯纤维；涤纶",
      "The shirt is 50% cotton and 50% {polyester}. | {Polyester}, a fabric made from oil, is cheap but takes centuries to break down. | Many cheap sports clothes are made of {polyester}, a kind of plastic fiber.",
      "cotton timber",
      "fabric",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Ore* is rock dug from a mine with metal still inside it, while *iron*, *copper* and an *alloy* are metals already taken out and made. Ask whether the sentence is about rock from the ground or finished metal.",
        "*ore* 是从矿里挖出、里面还含着金属的岩石；*iron*、*copper* 和 *alloy* 是已经提炼出来的金属。想想句子说的是地下挖出的石头，还是成品金属。",
      ),
      meaning: t(
        "*Synthetic* means made by people from chemicals, *natural* means coming from plants, animals or the earth, and *crude* means not yet processed. Check whether the meaning says made in a factory or taken straight from nature.",
        "*synthetic* 是人用化学品合成的，*natural* 是来自动植物或大地的，*crude* 是还没加工的。看释义说的是工厂造的，还是直接取自自然。",
      ),
      spell: t(
        "*Ceramic* starts with c said like s, *alloy* has a double l, and *polyester* is built as poly + ester.",
        "*ceramic* 开头的 c 读作 s，*alloy* 双写 l，*polyester* 由 poly + ester 构成。",
      ),
    },
    notes: `
      timber|a house built of wood from local forests;a material that grows back if forests are replanted;wood cut illegally from protected forests|timber is wood for building; ore is rock with metal in it|timber 是建筑用的木材；ore 是含金属的岩石|ore=ore is rock dug from a mine, not wood that comes from forests=ore 是从矿里挖出的岩石，不是来自森林的木头;copper=copper is a reddish metal, not wood cut from forests=copper 是红褐色的金属，不是从森林里砍来的木头|tim · ber|-ber at the end, not *timbre*|结尾是 -ber，别写成 *timbre*
      fabric|a light dress;cotton as a natural cloth;blue cloth for curtains|fabric is cloth; an alloy is a mixed metal|fabric 是布料；alloy 是合金|alloy=alloy is a metal made by mixing metals, far too hard to wear as a dress or hang as curtains=alloy 是几种金属混合成的合金，太硬了，不能做裙子或窗帘;timber=timber is wood for building, not cloth for dresses or curtains=timber 是建筑用的木材，不是做裙子或窗帘的布|fab · ric|a short a, and -ic at the end|短元音 a，结尾是 -ic
      textile|an industry making cloth from cotton and wool;fine cotton cloth from a town's factories;old clothes and sheets in landfills|a textile is woven or knitted cloth; timber is wood|textile 是织成的布；timber 是木材|timber=timber is wood for building, not cloth made from cotton and wool or old clothes and sheets=timber 是建筑用的木材，不是棉毛织成的布，也不是旧衣服和床单;ore/ores=ore is rock with metal in it, not cloth or clothes=ore 是含金属的岩石，不是布料或衣物|tex · tile|-tile at the end, said like *tile*|结尾是 -tile，读作 *tile*
      synthetic|nylon made in factories from oil;fibers that release tiny bits of plastic;rubber that is not natural|synthetic means made from chemicals; natural means from nature|synthetic 是人工合成的；natural 是天然的|natural=natural means coming from plants, animals or the earth, the opposite of made in factories from oil or chemicals=natural 是来自动植物或大地的，和工厂用石油或化学品制成正相反;sympathetic=sympathetic means kind to someone who is suffering, a word for people, not materials=sympathetic 是同情别人的，用来说人，不用来说材料|syn · thet · ic|y said like i, and th in the middle|y 读作 i，中间是 th
      ceramic|kitchen floor tiles;clay pots and bowls baked in a hot oven;plates that last for years|ceramic things are made of baked clay; polyester is a cloth made from oil|ceramic 是烧制的黏土制品；polyester 是石油做的布料|polyester/polyesters=polyester is a cloth made from oil, not baked clay for tiles, pots or plates=polyester 是石油做的布料，不是烧制瓷砖、陶罐或盘子的黏土;fabric/fabrics=fabric is cloth, which cannot be baked hard into tiles, bowls or plates=fabric 是布料，不能烧成瓷砖、碗或盘子|ce · ram · ic|c said like s at the start|开头的 c 读作 s
      mineral|mountains rich in natural substances;calcium in milk;water from underground springs|a mineral is a natural substance from the earth; a fabric is cloth|mineral 是来自大地的天然物质；fabric 是布料|fabric/fabrics=fabric is cloth made from threads, not a substance in rocks, milk or spring water=fabric 是线织成的布，不是岩石、牛奶或泉水里的物质;textile/textiles=textile is woven cloth, not a natural substance like calcium=textile 是织成的布，不是钙这样的天然物质|min · er · al|miner + al, with -al at the end|miner + al，结尾是 -al
      ore|rock with iron shipped to China;rock with copper from a mine;rock crushed and heated to get metal|ore is rock that metal is taken from; timber is wood|ore 是用来提炼金属的岩石；timber 是木材|fabric=fabric is cloth, not rock that metal can be taken from=fabric 是布料，不是能提炼金属的岩石;timber=timber is wood, which holds no metal and is never crushed and heated to get it=timber 是木头，里面没有金属，也不会被碾碎加热来提炼金属|ore|-ore said like *or*, with a silent e|-ore 读作 *or*，e 不发音
      iron|the metal steel is made from;an old bridge rusted to dark red;spinach with a lot of a body's metal|iron is a hard grey metal that rusts; timber is wood|iron 是会生锈的灰色硬金属；timber 是木材|timber=timber is wood, which cannot rust or be made into steel=timber 是木头，不会生锈，也不能炼成钢;fabric=fabric is cloth, not a metal for steel, bridges or the body=fabric 是布料，不是炼钢、造桥或人体需要的金属|i · ron|the r is silent in most accents: said *eye-un*|多数口音里 r 不发音，读作 *eye-un*
      copper|metal for electric wires;pipes carrying water through a house;a statue that has turned green|copper is a reddish metal for wires and pipes; timber is wood|copper 是做电线和水管的红褐色金属；timber 是木材|timber=timber is wood, which cannot carry electricity like wire or turn green like an old statue=timber 是木头，不能像电线一样导电，也不会像旧雕像那样变绿;fabric=fabric is cloth, not a metal for wires, pipes or statues=fabric 是布料，不是做电线、水管或雕像的金属|cop · per|the double p, and -er at the end|双写 p，结尾是 -er
      alloy|bronze made of copper and tin;a light bike frame of aluminum and other metals;steel made of iron and carbon|an alloy is a mix of metals; iron is one pure metal|alloy 是混合金属；iron 是一种纯金属|iron=iron is one metal on its own, not a mix of copper and tin or of aluminum and other metals=iron 是单独一种金属，不是铜锡或铝和其他金属的混合物;element=element is one pure substance, such as iron or carbon, not a mix of several=element 是单一的纯物质，比如铁或碳，不是几种物质的混合|al · loy|the double l, and -oy at the end|双写 l，结尾是 -oy
      crude|oil pumped straight from the ground;thick black oil spilled from a tanker;a rough shelter of branches with gaps|crude means unprocessed or rough; refined means cleaned and processed|crude 是未加工的或粗糙的；refined 是精炼过的|refined=refined means cleaned and processed, the opposite of oil straight from the ground or a rough shelter with gaps=refined 是精炼过的，和刚从地下抽出的油或四处漏雨的简陋棚子正相反;synthetic=synthetic means made by people from chemicals, not oil straight from a well or a shelter of branches=synthetic 是人工合成的，不是刚从油井出来的油，也不是树枝搭的棚子|crude|u said like *oo*, with a silent e|u 读作 *oo*，结尾 e 不发音
      polyester|a shirt half cotton and half something else;a fabric made from oil that takes centuries to break down;cheap sports clothes of plastic fiber|polyester is a synthetic cloth from oil; cotton is a natural cloth from plants|polyester 是石油做的合成布料；cotton 是来自植物的天然布料|cotton=cotton is a natural cloth from a plant, not a fabric made from oil or plastic fiber=cotton 是来自植物的天然布料，不是石油或塑料纤维做的;timber=timber is wood, not a cloth for shirts or sports clothes=timber 是木头，不是做衬衫或运动服的布料|pol · y · es · ter|poly + ester, with y said like i|poly + ester，y 读作 i
    `,
  },
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
const handFutures: readonly (readonly [string, string, string, string, string, string, Aspect, string])[] = [
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

/** futurePeople are a subject with its has or have and its am, is or are. */
const futurePeople: readonly (readonly [string, string, string])[] = [
  ["my sister", "has", "is"],
  ["we", "have", "are"],
  ["Tom", "has", "is"],
  ["the workers", "have", "are"],
  ["I", "have", "am"],
  ["our neighbors", "have", "are"],
];
/** perfectActs and continuousActs are a base form, -ing form, past participle and rest, for actions finished by a time or in progress at it. */
const perfectActs: readonly (readonly [string, string, string, string])[] = [
  ["finish", "finishing", "finished", "the project"],
  ["paint", "painting", "painted", "the house"],
  ["read", "reading", "read", "all the books"],
  ["save", "saving", "saved", "enough money"],
  ["pack", "packing", "packed", "the bags"],
  ["write", "writing", "written", "the report"],
  ["clean", "cleaning", "cleaned", "the garage"],
  ["sell", "selling", "sold", "the old car"],
];
const continuousActs: readonly (readonly [string, string, string, string])[] = [
  ["paint", "painting", "painted", "the fence"],
  ["drive", "driving", "driven", "to the coast"],
  ["cook", "cooking", "cooked", "dinner"],
  ["watch", "watching", "watched", "the match"],
  ["work", "working", "worked", "in the garden"],
  ["travel", "traveling", "traveled", "to Rome"],
  ["sleep", "sleeping", "slept", ""],
  ["have", "having", "had", "lunch"],
];
const perfectTimes = ["By Friday", "By the end of the month", "By next summer", "By the time you get back"] as const;
const continuousTimes = ["This time tomorrow", "At nine o'clock tonight", "This time next week", "When you arrive"] as const;

/** futures are the hand-written sentences and one for every person and act, at a time that fits. */
const futures: readonly (readonly [string, string, string, string, string, string, Aspect, string])[] = [
  ...handFutures,
  ...everyPair(futurePeople, perfectActs).map(
    ([[who, have], [base, ing, pp, rest]], k) =>
      [perfectTimes[k % perfectTimes.length]!, who, base, ing, pp, rest, "perfect", have] as const,
  ),
  ...everyPair(futurePeople, continuousActs).map(
    ([[who, , be], [base, ing, pp, rest]], k) =>
      [continuousTimes[k % continuousTimes.length]!, who, base, ing, pp, rest, "continuous", be] as const,
  ),
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
      : [`will be ${base}`, `will ${ing}`, `will have ${pp}`];
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
  const check = right.includes(" have ")
    ? t(
        "**Check.** Look at the deadline (*by* ...): the action finishes **before** that point, so use *will have* + past participle.",
        "**检验。** 看时间截止点（*by*……）：动作在那一刻**之前完成**，所以用 *will have* + 过去分词。",
      )
    : t(
        "**Check.** Look at the future moment: the action is **in progress** right then, so use *will be* + *-ing*.",
        "**检验。** 看将来的那个时刻：动作在那一刻**正在进行**，所以用 *will be* + *-ing*。",
      );
  return t(`${rule.en}: ${sentence}\n\n${check.en}`, `${rule["zh-CN"]}：${sentence}\n\n${check["zh-CN"]}`);
};

/** whyNotFuture explains the other future form, or a form of will that is not made right. */
const whyNotFuture = (wrong: string, right: string): Text => {
  const [w0, w1 = "", w2 = ""] = wrong.split(" ");
  const perfect = right.includes(" have ");
  if (w0 !== "will")
    return t(`*${wrong}* leaves out *will*, so it does not refer to a future time.`, `*${wrong}* 缺少 *will*，不能指将来的时间。`);
  if (w1 === "had")
    return t(
      `After *will* the helper must stay in its base form (*have*), never *had*.`,
      `*will* 后面的助动词必须用原形 *have*，不能用 *had*。`,
    );
  if (w1.endsWith("ing"))
    return t(
      `*will* cannot be followed directly by *-ing*; the future continuous needs *be* in between.`,
      `*will* 后面不能直接接 *-ing*，将来进行时中间必须有 *be*。`,
    );
  if (w1 === "be" && !w2.endsWith("ing"))
    return t(
      `In the future continuous, *will be* is followed by the *-ing* form, not *${w2}*.`,
      `将来进行时里 *will be* 后面要接 *-ing* 形式，不能接 *${w2}*。`,
    );
  if (w1 === "be" && perfect)
    return t(
      `*${wrong}* is the future continuous (in progress at that time), not a completed action.`,
      `*${wrong}* 是将来进行时（那时正在进行），不表示到那时已经完成。`,
    );
  if (w1 === "have" && !perfect)
    return t(
      `*${wrong}* is the future perfect (already finished by then), not an action in progress at that moment.`,
      `*${wrong}* 是将来完成时（到那时已经完成），不表示那一刻正在进行。`,
    );
  return t(`*${w2}* is not the past participle required after *will have*.`, `*${w2}* 不是 *will have* 后面所需的过去分词。`);
};

const futureForms: TopicDef = {
  id: "future-continuous-and-future-perfect",
  title: t("Will Be Doing, Will Have Done", "will be doing 和 will have done"),
  summary: t(
    "By 2050 the glacier will have melted. This time next year we will be living on solar power. The future perfect says what will be finished by a time; the future continuous says what will be in progress at a time.",
    "By 2050 the glacier will have melted. This time next year we will be living on solar power。将来完成时说到某时已经完成的事，将来进行时说某时正在进行的事。",
  ),
  intro: t(
    "Picture 9 a.m. next Monday: *I will be driving to the coast* puts you in the middle of the journey, while *By noon I will have arrived* looks back from noon at a finished trip.",
    "想象下周一上午九点：*I will be driving to the coast* 把你放在路途中，而 *By noon I will have arrived* 则是站在中午回看已经完成的行程。",
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
        "Both forms look at one moment in the future:\n\n- **will have + past participle** (the future perfect): the action will be **finished before** that moment. It often comes with *by*: *By 2050 most glaciers **will have melted**. By Friday I **will have written** the report.*\n- **will be + -ing** (the future continuous): the action will be **in progress at** that moment: *This time next year we **will be living** on solar power. At eight tomorrow I **will be flying** to Oslo.*\n\n> **Watch out.** Never drop *will* with a future deadline—*By 2050 most glaciers have melted* is present perfect, not future perfect.",
        "两种形式都着眼于将来的某一时刻：\n\n- **will have + 过去分词**（将来完成时）：动作在那一刻**之前已经完成**，常和 *by*（到……为止）连用：*By 2050 most glaciers **will have melted**. By Friday I **will have written** the report.*\n- **will be + -ing**（将来进行时）：动作在那一刻**正在进行**：*This time next year we **will be living** on solar power. At eight tomorrow I **will be flying** to Oslo.*\n\n中文说“到 2050 年冰川就已经融化了”“明天八点我正在飞往奥斯陆”，靠“已经”“正在”表示；英语要靠动词形式。\n\n> **注意。** 说将来的截止时间不能漏掉 *will*——*By 2050 most glaciers have melted* 是现在完成时，不是将来完成时。",
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
        "After *will* the verb is always in its base form, so the forms are fixed:\n\n- **will have** + past participle: *will have **gone***, *will have **written***, not *will had gone* or *will have went*.\n- **will be** + -ing: *will be **working***, not *will be work* or *will working*.\n\n> **Watch out.** Keep *will have* and *will be* unchanged for every subject—never write *she will has finished*, *will had*, or *will working*.",
        "*will* 后面的动词永远用原形，所以形式是固定的：\n\n- **will have** + 过去分词：*will have **gone***、*will have **written***，不是 *will had gone*，也不是 *will have went*。\n- **will be** + -ing：*will be **working***，不是 *will be work*，也不是 *will working*。\n\n> **注意。** 所有主语后面都固定用 *will have* 和 *will be*——绝不能写成 *she will has finished*、*will had* 或 *will working*。",
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
        "Write the sentence from its parts. The words in brackets say whether the action will be finished or in progress: *By 2030 / the city / ban petrol cars (It will be finished before then.)* becomes *By 2030, the city will have banned petrol cars.* *This time next year / we / live on solar power (It will be in progress at that time.)* becomes *This time next year, we will be living on solar power.* The comma after the time is optional, and you may write *we'll* for *we will*.\n\n> **Watch out.** Check the verb ending before finishing: *will have* takes the **past participle**, while *will be* takes the **-ing** form.",
        "根据各部分写句子。括号里的话说明动作那时是已完成还是正在进行：*By 2030 / the city / ban petrol cars (It will be finished before then.)* 写成 *By 2030, the city will have banned petrol cars.* *This time next year / we / live on solar power (It will be in progress at that time.)* 写成 *This time next year, we will be living on solar power.* 时间后面的逗号可有可无，*we will* 也可以写成 *we'll*。\n\n> **注意。** 写完检查动词形态：*will have* 后面必须是**过去分词**，*will be* 后面必须是 **-ing** 形式。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Write the sentence with will have or will be.", "用 will have 或 will be 写出句子。"),
        futureTyped,
        (right) => futureWhy(right, right, right),
        futureContinuousAndFuturePerfectWriteNot,
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
  intro: t(
    "Asked whether cities should charge drivers to enter downtown, a strong opinion essay takes a clear stand in the opening paragraph, backs it with two focused reasons, answers a fair counterargument, and sums up without adding new points.",
    "面对“城市中心是否应收取拥堵费”这类问题，好的观点类议论文会在开头明确亮出立场，用两段聚焦的理由展开论证，正面回应一个合理反对意见，并在结尾收束而不另起新论点。",
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
      "An opinion essay answers a question with your own view and gives reasons for it. Plan four or five paragraphs:\n\n1. **Introduction**: introduce the subject in a sentence or two, then state your opinion clearly: *In my opinion, ... / I strongly believe that ...*\n2. **Two body paragraphs**: each gives **one** reason. Begin with a topic sentence (*Firstly, ... / The main reason is that ...*), then explain it and give an example or a fact.\n3. **An opposing view** (often a short paragraph): show that you know what the other side thinks, then answer it: *Some people argue that ... However, ...*\n4. **Conclusion**: say your opinion again in different words and sum up your reasons: *In conclusion, ...* Do not add a new reason here.\n\nLink your ideas with words such as *Firstly, In addition, Moreover, However, For example, As a result*. Keep a neutral, formal tone: no contractions (*do not*, not *don't*).\n\n> **Watch out.** State your position clearly at the end of the introduction—do not save your opinion for the conclusion—and never introduce a brand-new argument in the final paragraph.",
      "观点类议论文就一个问题给出自己的看法并说明理由。安排四到五段：\n\n1. **引言**：用一两句话引出话题，然后清楚地表明观点：*In my opinion, ... / I strongly believe that ...*\n2. **两个主体段**：每段只讲**一个**理由。用主题句开头（*Firstly, ... / The main reason is that ...*），然后解释，并举一个例子或事实。\n3. **相反的观点**（常是较短的一段）：说明你了解对方的想法，然后回应：*Some people argue that ... However, ...*\n4. **结论**：换一种说法重申观点并概括理由：*In conclusion, ...* 不要在这里加新的理由。\n\n用 *Firstly, In addition, Moreover, However, For example, As a result* 等词连接观点。语气中立、正式：不用缩写（写 *do not*，不写 *don't*）。中文议论文常在结尾才亮出观点，或者先铺垫很多背景；英语议论文要在引言末尾就明确表态，后面每段都为它服务。\n\n> **注意。** 务必在引言结尾就明确表明立场，不要留到结尾才亮明观点；结论段只总结，绝不塞进新论点。",
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
