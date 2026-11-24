// Grade 5: the batches of words of the first five units, from water on Earth to ancient Greece.

import { t } from "@ga/content";
import type { BatchSpec } from "../batch.ts";
import { batch } from "./batches.ts";

const oceansAndIce = batch(
  "words-of-oceans-and-ice",
  ["Words of Rivers, Oceans and Ice", "江河、海洋与冰的词"],
  ["rivers, oceans and ice", "江河、海洋与冰"],
  `
  glacier|a huge, slow river of ice|冰川|The ___ crept down the mountain valley by only a few centimeters each day.|Over thousands of years, the ___ carved a deep valley as its ice slid toward the sea.|Climbers crossed the frozen ___ roped together in case of hidden cracks in the ice.|basin,estuary|glaciers
  aquifer|a layer of rock or sand under the ground that holds water|含水层|The town's wells pump drinking water up from the underground rock ___ that lies deep below the farms.|Rain that seeps through the soil slowly refills the water-holding rock layer of the ___ below.|If farmers pump too much water, the underground rock ___ under the valley can run dry.|groundwater,watershed|aquifers
  groundwater|water held under the ground in soil and rock|地下水|The well reaches down to ___ held in soil and rock about thirty meters below the surface.|During the drought, the farmers pumped ___ from beneath the soil because the streams had dried up.|Chemicals spilled on the soil can seep down and spoil the ___ that people drink.|aquifer,salinity
  tide|the rise and fall of the sea twice a day|潮汐|At low ___, we walked out on the wet sand to look for crabs.|The ___ comes in twice a day and covers the rocks where we were sitting.|Fishing boats wait in the harbor until the high ___ lifts them off the mud.|estuary,basin|tides
  estuary|the wide mouth of a river, where it meets the sea|河口|In the ___, river water mixes with salty seawater.|Many young fish grow up in the calm, shallow ___ where the river meets the salty sea.|The river widens into a muddy ___ just before it reaches the ocean.|tributary,basin|estuaries
  freshwater|water that is not salty, as in rivers and most lakes|淡水|Only a tiny part of Earth's water is ___; most of it is salty.|Trout are ___ fish that live in cool rivers and lakes.|The island had no river, so the sailors collected unsalty rain as their only ___.|groundwater,salinity
  salinity|how salty water is|盐度|Scientists measured the ___ of the sea to see how much salt it held.|The Dead Sea's ___ is so high that swimmers float easily.|As river water flows into the bay, the ___ of the bay drops.|freshwater,tide
  watershed|all the land whose water drains into one river or lake|流域|Rain that falls anywhere in this ___ ends up in the same river.|Every town across the land of the ___ shares the lake that its streams flow into.|A factory upstream can pollute the whole land area of the ___ below it.|tributary,aquifer|watersheds
  tributary|a smaller river that flows into a larger one|支流|The creek behind our school is a ___ of the big river.|Each smaller stream or ___ adds more water to the main river as it flows to the sea.|We canoed up a narrow ___ until it joined the wide river.|estuary,watershed|tributaries
  basin|a low, bowl-shaped area of land|盆地|The city sits in a bowl-shaped ___ surrounded by mountains, so smoke gets trapped over it.|Water from the hills drains down into the low, bowl-shaped ___ below.|Long ago, a lake filled the whole low ___, but now it is a dry, flat plain.|glacier,estuary|basins
  `,
  "context-clues",
  {
    intro: t(
      "Meltwater from a slow mountain **glacier** feeds a narrow **tributary**, drains across a wide **watershed**, and reaches the muddy **estuary** where river water meets the rising **tide**. These ten words map Earth's waters from mountain ice to the sea.",
      "高山冰川（**glacier**）的融水汇入狭窄支流（**tributary**），流经广阔流域（**watershed**），最终抵达河海交汇的河口（**estuary**），迎上每日涨落的潮汐（**tide**）。这十个词勾勒出地球上的水系。",
    ),
    watchOut: {
      meanings: t(
        "Tell **aquifer** (the underground *layer of rock or sand* that holds water) apart from **groundwater** (the *water itself* stored inside that underground soil and rock).",
        "分清 **aquifer**（地下蓄水的岩石或沙砾层——含水层）和 **groundwater**（储存在地下岩土中的水本身——地下水）。",
      ),
      use: t(
        "Tell **tributary** (a smaller river flowing *into* a larger river) apart from **estuary** (the wide river mouth where a river meets the salty sea) and **watershed** (all the land draining into one river).",
        "分清 **tributary**（汇入大河的小支流）、**estuary**（大河入海的宽阔河口）和 **watershed**（雨水都汇入同一条河的整片流域土地）。",
      ),
      spelling: t(
        "Watch **glacier** (*-cier*, not *-sher*), **aquifer** (*aqui-* + *-fer*), and **estuary** (*estu-* + *-ary*).",
        "注意 **glacier** 结尾的 **-cier**、**aquifer** 中的 **qui**，以及 **estuary** 结尾的 **-ary**。",
      ),
    },
    notes: `
      glacier|a slow river of ice creeping down a mountain valley|sliding ice carving a deep valley over thousands of years|frozen ice crossed by roped climbers watching for cracks|glacier is a huge slow river of ice; basin is a low bowl-shaped area of land|glacier 是缓慢移动的冰川；basin 是低洼盆地|basin is a low, bowl-shaped area of land, not a moving river of ice|basin 是低洼盆地地形，不是沿山谷滑动的巨型冰川|estuary is the wide mouth where a river meets the sea, not a frozen river of ice|estuary 是江河入海口，不是覆盖山谷的冰川|gla · cier|gl blend, long a, and -cier saying /ʃər/|gl 连缀、长 a 加读 /ʃər/ 的 -cier
      aquifer|an underground rock layer supplying drinking water to wells|a water-holding rock layer refilled by seeping rain|an underground rock layer that can run dry when overpumped|aquifer is the underground rock layer holding water; groundwater is the water itself|aquifer 是地下含水岩层；groundwater 是里面的地下水|groundwater is the water itself rather than the underground layer of rock or sand that holds it|groundwater 指地下水本身，不是储存水的地下岩层|watershed is surface land draining into a river or lake, not a water-holding layer of rock underground|watershed 是地表汇水流域，不是地底下的含水岩层|aq · ui · fer|aq + ui saying /wɪ/ + -fer|aq 加读 /wɪ/ 的 ui 和 -fer
      groundwater|water held in soil and rock thirty meters below the surface|underground water pumped when surface streams dry up|underground drinking water spoiled by spilled chemicals|groundwater is water held underground; aquifer is the rock layer holding it|groundwater 是地下水本身；aquifer 是地下含水岩层|aquifer is a countable rock layer holding water, not the uncountable water pumped or drunk directly|aquifer 是可数的含水岩层，不是直接抽上来饮用的不可数地下水|salinity is a measure of how salty water is, not water stored beneath soil and rock|salinity 指水的盐度，不是埋藏在地下岩土里的水|ground · wa · ter|compound word: ground + water|合成词：ground 加 water
      tide|low sea level letting walkers search wet sand for crabs|the sea rising twice a day to cover coastal rocks|high sea water lifting fishing boats off harbor mud|tide is the sea's twice-daily rise and fall; estuary is a river's wide mouth|tide 是海水的每日涨落潮汐；estuary 是河口|estuary is the wide mouth where a river meets the sea, not the twice-daily rise and fall of sea level|estuary 是固定地貌“河口”，不是每天涨落两次的潮汐|basin is a low bowl-shaped area of land, not the rising and falling sea|basin 是低洼盆地，不是每天涨落的海水潮汐|tide|silent e making long i (not tied)|词尾 e 让 i 读长音（别写成系 tied）
      estuary|a river mouth where river water mixes with salty seawater|calm shallow water where a river meets the salty sea|a river widening into a muddy mouth before the ocean|estuary is where a river meets the sea; tributary flows into a larger river|estuary 是河流汇入大海的河口；tributary 是汇入大河的支流|tributary is a smaller river joining a larger river inland, not a wide mouth mixing with salty seawater|tributary 是汇入大河的支流，不是与咸海水交汇的入海口|basin is a bowl-shaped area of land, not a river mouth meeting the ocean|basin 是碗状盆地，不是江河汇入大海的河口|es · tu · ar · y|short e + stu + -ary ending|短 e 加 stu 和结尾 -ary
      freshwater|Earth's small supply of unsalty water|unsalty river and lake water where trout live|unsalty rain collected on an island with no river|freshwater is unsalty water; salinity is how salty water is|freshwater 是不咸的淡水；salinity 是水的含盐度|groundwater is water stored beneath soil and rock, not rain or surface rivers and lakes|groundwater 特指地下水，不能用来指收集的雨水或江河湖泊里的淡水|salinity is how salty water is, the opposite of unsalty drinking water|salinity 指水的盐度，与不含盐的淡水正相反|fresh · wa · ter|compound word: fresh + water|合成词：fresh 加 water
      salinity|measuring how much salt seawater holds|extreme saltiness letting swimmers float in the Dead Sea|bay saltiness dropping as river water flows in|salinity is how salty water is; freshwater is unsalty water|salinity 是盐度；freshwater 是淡水|freshwater is unsalty water itself, not a measurement of how much salt water holds|freshwater 指淡水本身，不是衡量含盐高低的“盐度”|tide is the sea's twice-daily rise and fall, not how salty water is|tide 是海水潮汐，不是水的含盐量|sa · lin · i · ty|sa + lin + -ity ending|sa 加 lin 和名词后缀 -ity
      watershed|all the land whose rain drains into one river|land shared by towns whose streams feed one lake|a whole land area polluted by an upstream factory|watershed is all the land draining into one river; tributary is one smaller stream|watershed 是整片汇水流域土地；tributary 是单条支流|tributary is a single smaller river, not the whole area of land whose rain drains into a river or lake|tributary 只是单条支流，不是涵盖整个汇水区的流域土地|aquifer is an underground rock layer holding water, not the surface land area feeding a river|aquifer 是地下含水岩层，不是地表汇水流域|wa · ter · shed|compound word: water + shed|合成词：water 加 shed
      tributary|a school creek feeding into a big river|each smaller stream adding water to the main river|a narrow stream canoed up until it joins a wide river|tributary is a smaller river joining a larger one; estuary is where a river meets the sea|tributary 是汇入大河的小支流；estuary 是入海河口|estuary is the wide mouth where a river meets the ocean, not a narrow inland stream joining a bigger river|estuary 是河流尽头的入海口，不是汇入主河道的狭窄支流|watershed is the entire land area draining into a river, not a single narrow stream you can canoe up|watershed 是整片流域土地，不是能划独木舟进入的单条小支流|trib · u · tar · y|tr blend + u + -tary ending|tr 连缀、u 和结尾 -tary
      basin|a bowl-shaped low area surrounded by mountains|low bowl-shaped land receiving water from surrounding hills|a dry flat depression once filled by a lake|basin is a low bowl-shaped area of land; glacier is a river of ice|basin 是低洼碗状盆地；glacier 是冰川|glacier is a slow-moving river of ice, not a low bowl-shaped area of land|glacier 是缓慢移动的冰川，不是四周环山的低洼盆地|estuary is a river mouth meeting the sea, not a bowl-shaped inland area surrounded by hills|estuary 是江河入海口，不是四周环山的低洼盆地|ba · sin|long a in ba + -sin (not -son)|ba 读长 a 加结尾 -sin
    `,
  },
);

const amounts = batch(
  "words-for-amounts-and-distribution",
  ["Words for Amounts and Shares", "表示数量与份额的词"],
  ["amounts and how things are shared out", "数量与分配"],
  `
  percent|out of every hundred|百分之……|About seventy ___ of Earth's surface is covered by water.|Only three ___ of the world's water is fresh.|The store gave us twenty ___ off the price of the bikes.|fraction,portion
  portion|a part or share of something|一部分，一份|Each child got an equal ___ of the pie, and nobody's slice was bigger.|Each neighborhood receives its own ___ of the city's water supply from the mountains.|She saved a small ___ of her pocket money every week before spending the rest.|remainder,majority|portions
  fraction|a part of a whole written as one number over another, such as one half|分数|Write three quarters as a ___ with a 3 on top and a 4 below.|One half is the ___ that means one of two equal parts.|To show one slice of a pizza cut into eight, write the ___ one eighth.|percent,minority|fractions
  majority|more than half of a group|大多数|More than half of the class—the ___—voted for a trip to the aquarium.|Since more than half agreed, the ___ won and the plan went ahead.|More than half—a ___—of the world's fresh water is frozen in ice.|minority,remainder
  minority|less than half of a group|少数|Only a ___ of the students walk to school; most ride the bus.|A small ___ of the voters wanted to change the rule, so it stayed the same.|Left-handed people are a ___; most people are right-handed.|majority,fraction
  abundant|more than enough; plentiful|丰富的，充足的|Water is ___ and plentiful in the rainforest, where it rains almost every day.|Fish were so ___ in the bay that the nets came up overflowing.|After the wet spring, berries were plentiful and ___ on every bush.|available,entire
  available|ready to be used or had|可用的，可获得的|Is there any clean water ___ for us to use at the campsite?|The tickets will be ___ to buy online next Monday.|No seats were ___ to sit in, so we stood at the back.|abundant,entire
  approximately|about; close to, but not exactly|大约|The lake is ___ two kilometers wide.|We walked for ___ an hour before we found the waterfall.|The trip takes ___ three hours, give or take a few minutes.|entire,available
  entire|whole, with no part left out|整个的|It rained for the ___ weekend, from Friday night to Monday morning.|The flood covered the ___ village, so not one street was dry.|He ate the ___ pizza by himself and left none for us.|abundant,available
  remainder|the part that is left over|剩余部分|We ate half of the cake and saved the leftover ___ for tomorrow.|Ninety-seven percent of Earth's water is salty; the leftover ___ is fresh.|After paying for lunch, she put the leftover ___ of her money back in her pocket.|portion,minority
  `,
  "context-clues",
  {
    intro: t(
      "About seventy **percent** of Earth is covered by water, yet only a tiny **fraction** is fresh—and the **majority** of that fresh water is locked in ice, leaving a much smaller **remainder** **available** in rivers and lakes. These ten words help you describe shares and quantities clearly.",
      "地球表面约百分之（**percent**）七十被水覆盖，但其中只有极小一部分分数（**fraction**）是淡水，且大多数（**majority**）封存在冰川里，剩下的（**remainder**）可供使用（**available**）的淡水很少。这十个词帮你准确表达数量与份额。",
    ),
    watchOut: {
      meanings: t(
        "Tell **portion** (any share or part allotted to someone) apart from **remainder** (specifically the leftover part remaining *after* another part has been used or taken).",
        "分清 **portion**（分给某人或某处的一份份额）和 **remainder**（用掉或拿走一部分后留下的剩余部分）。",
      ),
      use: t(
        "Tell **abundant** (plentiful, more than enough) apart from **available** (simply ready to be used or bought, whether plentiful or scarce).",
        "分清 **abundant**（数量丰沛充足）和 **available**（可供使用或购买，不强调数量极多）。",
      ),
      spelling: t(
        "Watch **approximately** (*ap-prox-i-mate-ly*, double *p* and keep the *e* before *-ly*), **available** (*a-vail-a-ble* with *ai*), and **majority** (*major* + *-ity*).",
        "注意 **approximately** 的双写 **p** 和 **-ly** 前的 **e**、**available** 中的 **ai**，以及 **majority**（*major* 加 *-ity*）。",
      ),
    },
    notes: `
      percent|seventy out of every hundred parts of Earth's surface|three out of every hundred parts of world water|twenty out of every hundred off a bike price|percent means out of every hundred; fraction writes one number over another|percent 是百分之几；fraction 是上下写的分数|fraction is a part written as one number over another, not a count out of every hundred following a bare number|fraction 是写成几分之几的分数，不直接跟在数字后面表示“百分之……”|portion is a general share or slice, not a unit meaning out of every hundred|portion 指一般意义的一份份额，不是跟在数字后的“百分之……”|per · cent|per + cent (soft c saying /s/)|per 加表示百的 cent
      portion|an equal share of pie given to each child|each neighborhood's allotted share of city water|a small share of pocket money saved before spending the rest|portion is an allotted share; remainder is what is left over afterward|portion 是分得的一份份额；remainder 是用完后剩下的部分|remainder is specifically what is left over after something is taken, not an equal share allotted from the start|remainder 特指用去后剩余的部分，不是一开始按份分配的份额|majority means more than half of a group, not an individual equal or small share|majority 指超过一半的大多数，不能指每人均分或存下的一小份|por · tion|por + -tion ending saying /ʃən/|por 加读 /ʃən/ 的 -tion
      fraction|three quarters written with 3 on top and 4 below|one half representing one of two equal parts|one eighth written to show one slice of eight|fraction writes one number over another; percent counts out of every hundred|fraction 是分子分母形式的分数；percent 是百分之几|percent counts parts out of every hundred, not a number written with a top and bottom like 3 over 4|percent 是按每百份计算的百分比，不是上下写分子分母的分数|minority means less than half of a group, not a mathematical number with a numerator and denominator|minority 指群体中的少数，不是数学里的分数形式|frac · tion|fr blend, short a, and -tion ending|fr 连缀、短 a 加结尾 -tion
      majority|more than half of a class voting for a trip|more than half agreeing so their side wins|more than half of Earth's fresh water frozen in ice|majority is more than half; minority is less than half|majority 是超过半数的大多数；minority 是不足半数的少数|minority means less than half of a group, the exact opposite of more than half|minority 指不到一半的少数，与超过半数正相反|remainder is what is left over after something is removed, not specifically more than half of a whole|remainder 指扣除后剩下的余量，不特指超过一半的大多数|ma · jor · i · ty|major + -ity ending|major 加名词后缀 -ity
      minority|fewer than half of students walking while most take the bus|a small losing group of voters wanting a rule change|left-handed people outnumbered by right-handed people|minority is less than half; majority is more than half|minority 是不足半数的少数；majority 是超过半数的大多数|majority means more than half of a group, the exact opposite of a smaller side outnumbered by most|majority 指超过半数的大多数，与被多数压过的少数正相反|fraction is a math ratio like one half, not specifically the smaller side of a group of people|fraction 是数学分数，不特指人群中占比较小的一方|mi · nor · i · ty|minor + -ity ending|minor 加名词后缀 -ity
      abundant|plentiful water in a rainy rainforest|so many fish that nets come up overflowing|plentiful berries covering every bush after rain|abundant means plentiful and more than enough; available means ready to use|abundant 指丰沛充足；available 只指可供使用|available simply means ready to be used or had, without saying there is a huge, overflowing supply|available 只表示可以获得，不强调像雨林雨水或满网鱼群那样极其丰沛|entire means whole with no part left out, not plentiful in supply|entire 指完整无缺的“整个”，不表示数量丰沛|a · bun · dant|a + bun + -dant ending|a 加 bun 和形容词后缀 -dant
      available|clean water ready for campers to use|tickets ready to be bought online next Monday|open seats ready for people to sit in|available means ready to be used or had; abundant means plentiful|available 指可供使用或获取；abundant 指数量丰沛|abundant means more than enough in quantity, not simply open or ready to be used or bought|abundant 指数量极多，不表示车票开售或有空座可用|entire means whole with nothing left out, not ready to be used or obtained|entire 指完整的整个，不表示可供使用或购买|a · vail · a · ble|a + vail (ai) + -able ending|a 加含 ai 的 vail 和结尾 -able
      approximately|a lake width given as about two kilometers|a walk lasting about an hour|a trip taking about three hours give or take minutes|approximately is an adverb meaning about; entire and available are adjectives|approximately 是副词“大约”；entire 和 available 是形容词|entire is an adjective meaning whole, not an adverb modifying a measurement to mean roughly|entire 是形容词“整个的”，不能修饰数量表示“大约”|available is an adjective meaning ready to use, not an adverb meaning close to but not exact|available 是形容词“可用的”，不能修饰时间或距离表示“大约”|ap · prox · i · mate · ly|double p + x + keep silent e before -ly|双写 p 加 x，-ly 前保留 e
      entire|a whole weekend of rain from Friday to Monday|a whole village flooded with not one dry street|a whole pizza eaten with none left|entire means whole with no part left out; abundant means plentiful|entire 是整个无遗漏的；abundant 是丰富的|abundant means plentiful in number, not a single whole weekend, village, or pizza with no part left out|abundant 指数量众多，不能修饰单个“整个周末/整张披萨”|available means ready to use, not whole with every single part included|available 指可用的，不表示丝毫未留的“整个”|en · tire|en- + tire with silent e making long i|en- 加发长 i 音的 tire
      remainder|leftover cake saved for tomorrow after eating half|leftover fresh water after ninety-seven percent is salty|leftover money put back in a pocket after paying for lunch|remainder is the leftover part; portion is any allotted share|remainder 是用完后留下的剩余部分；portion 是一般份额|portion is any part or share allotted, not specifically the leftover amount remaining after the rest is used|portion 泛指分出的一份，不特指吃掉或花掉之后剩下的余量|minority means less than half of a group, not the leftover part after something has been used or spent|minority 指群体中的少数，不指付完钱或吃完后剩下的余量|re · main · der|re- + main (ai) + -der|re- 加含 ai 的 main 和 -der
    `,
  },
);

const cleanWater = batch(
  "words-of-clean-water",
  ["Words of Clean Water", "清洁用水的词"],
  ["keeping water clean and bringing it to homes", "保持水的清洁并把水送到家中"],
  `
  pollution|harmful waste that makes air, water or land dirty|污染|Oil leaking from the ships caused ___ that killed many seabirds.|The river's chemical ___ came from a factory that dumped its waste into it.|Picking up litter on the beach helps to reduce ___.|sewage,drainage
  filter|to pass something through a material that catches the dirt in it|过滤|We used sand and charcoal to ___ out the mud from the muddy water.|This machine can ___ out bits of dirt too small to see.|Campers ___ stream water through a cloth to catch dirt before they boil it.|purify,dissolve|filters,filtered
  purify|to make completely clean and safe|净化|Boiling water for one minute will ___ it by killing the germs in it.|The water plant uses sunlight and special chemicals to ___ the city's water by killing germs.|Chemical tablets that ___ water by killing germs are useful on long hikes.|filter,contaminate|purifies,purified
  sewage|dirty water and waste from toilets and drains|污水|Pipes carry ___ away from homes to a treatment plant.|After the storm, toilet and drain ___ overflowed into the streets and made people sick.|Workers clean the ___ from home drains before the water goes back into the river.|pollution,plumbing
  pipeline|a long line of pipes that carries water, oil or gas a great distance|管道|A long ___ carries water from the mountain lake to the city, a hundred kilometers away.|Workers dug a long trench across the plains for the new oil ___.|The ___ crossed the desert to bring water to the town.|plumbing,faucet|pipelines
  toxic|poisonous; harmful to living things|有毒的|Do not drink that water, because it is ___.|The old paint gave off ___ fumes that made us cough.|Some mushrooms are ___ and can make you very ill.|sterile,soluble
  desalination|taking the salt out of seawater so people can drink it|海水淡化|Some dry countries use ___ to turn seawater into drinking water.|The new ___ plant on the coast takes the salt out of seawater.|Removing salt from seawater by ___ takes a lot of energy.|drainage,pollution
  plumbing|the pipes and taps inside a building|（建筑内的）管道系统|The old ___ in the house leaked, so we called a plumber.|The school's indoor ___ was so old that the pipes burst in winter.|Before indoor ___, people carried water from a well.|pipeline,sewage
  faucet|a tap that turns water on and off|水龙头|Turn off the ___ while you brush your teeth.|The kitchen ___ dripped all night.|Hot water came out of the ___ marked with a red dot.|plumbing,pipeline|faucets
  drainage|the way water flows away from a place|排水|Good ___ stops rain from flooding the field.|The ___ ditches beside the road carried the rainwater away.|Plants rot in pots with poor ___ because the water cannot escape.|sewage,plumbing
  `,
  "context-clues",
  {
    intro: t(
      "Before fresh water ever flows from your kitchen **faucet**, a long **pipeline** brings it to a plant that can **filter** out grit and **purify** away invisible germs, while separate pipes carry **sewage** safely away. These ten words trace how towns keep water clean and moving.",
      "清水从厨房水龙头（**faucet**）流出之前，长途管道（**pipeline**）先将它送往水厂过滤（**filter**）泥沙并净化（**purify**）病菌，另一套管网则将污水（**sewage**）安全排走。这十个词讲述清洁用水的工程。",
    ),
    watchOut: {
      meanings: t(
        "Tell **filter** (pass water *through* cloth, sand, or a screen to trap physical dirt) apart from **purify** (kill germs with boiling, sunlight, or chemicals so water is completely safe to drink).",
        "分清 **filter**（用布、沙子或滤网截留物理泥沙杂质）和 **purify**（靠煮沸、阳光或化学药剂杀菌，让水彻底安全可饮）。",
      ),
      use: t(
        "Tell **pipeline** (a long-distance line of pipes crossing mountains or deserts) apart from **plumbing** (the indoor pipes and taps inside a house or school) and **faucet** (the single tap you turn on and off).",
        "分清 **pipeline**（跨越长距离的输水输油管道）、**plumbing**（建筑内部的整套管网）和 **faucet**（单个开关水龙头）。",
      ),
      spelling: t(
        "Watch **faucet** (*au* saying /ɔː/ + soft *c* in *-cet*), **sewage** (*sew-* + *-age*), and **desalination** (*de-* + *salin-* + *-ation*).",
        "注意 **faucet** 中读 /ɔː/ 的 **au** 和 **-cet**、**sewage** 的 **sew-**，以及 **desalination**（*de- + salin- + -ation*）。",
      ),
    },
    notes: `
      pollution|leaking ship oil harming seabirds|factory chemical waste dumped into a river|beach litter reduced by cleanup|pollution is general harmful waste in air, water, or land; sewage is toilet and drain waste|pollution 是广义的环境污染；sewage 专指下水道生活污水|sewage is specifically dirty water from toilets and household drains, not oil spills, factory chemicals, or beach litter|sewage 专指厕所和下水道排出的生活污水，不指原油泄漏、工厂废液或海滩垃圾|drainage is the way water flows away from a place, not harmful waste that dirties nature|drainage 指排水去向，不是弄脏环境的有害污染物|pol · lu · tion|pol + double l + -tion|pol 加双写 l 和 -tion
      filter|using sand and charcoal to trap mud from water|a machine catching tiny bits of dirt|pouring stream water through cloth to catch dirt|filter traps physical dirt through a material; purify kills germs completely|filter 是靠滤材物理过滤杂质；purify 是杀菌彻底净化|purify means making water completely germ-free by boiling or chemicals, not straining physical dirt out through cloth or sand|purify 指靠煮沸或药剂杀菌净化，不搭配 out 或 through a cloth 表示筛滤泥沙|dissolve means mixing a solid invisibly into a liquid, the opposite of straining dirt out of water|dissolve 是让固体溶入液体消失，与把泥沙从水中滤出正相反|fil · ter|short i + lt blend + -er|短 i 加 lt 和结尾 -er
      purify|boiling water to kill germs inside it|a water plant using sunlight and chemicals to kill germs|chemical tablets killing germs in hiking water|purify kills germs to make water safe; filter strains out solid dirt|purify 是杀菌彻底净化；filter 是过滤泥沙杂质|filter only strains solid particles through a material, rather than killing germs with heat, sunlight, or tablets|filter 只是用滤材拦住固体杂质，不能靠煮沸、阳光或药片杀灭病菌|contaminate means making water dirty or unsafe with germs, the exact opposite of purifying it|contaminate 是把水弄脏污染，与杀菌净化正相反|pu · ri · fy|long u in pu + ri + -fy|pu 读长 u 加 ri 和动词后缀 -fy
      sewage|dirty home wastewater piped to a treatment plant|toilet and drain waste overflowing into streets|household drain wastewater cleaned before re-entering a river|sewage is dirty waste from toilets and drains; pollution is any harmful waste|sewage 是厕所下水道污水；pollution 泛指各类环境污染|pollution is general environmental waste, not specifically wastewater from toilets and home drains sent to a treatment plant|pollution 泛指各类污染，不特指由排污管送去处理的厕所和家庭下水道污水|plumbing is the system of pipes and taps inside a building, not the dirty wastewater itself|plumbing 指建筑内的管道系统，不是流动在里面的污水本身|sew · age|sew saying /suː/ + -age|sew 读 /suː/ 加 -age
      pipeline|a hundred-kilometer line of pipes from a mountain lake|a long trench dug across plains for carrying oil|a long line of pipes crossing a desert with water|pipeline carries water or oil long distances; plumbing is pipes inside a building|pipeline 是长距离输水输油管道；plumbing 是室内管道系统|plumbing is the system of pipes and taps inside a building, not a long-distance line crossing deserts or plains|plumbing 只指房屋建筑内部的管路，不跨越沙漠、山谷或平原|faucet is a single tap you turn on and off, not a long line of pipes carrying water or oil for kilometers|faucet 是单个水龙头，不是绵延百公里的输送管道|pipe · line|compound word: pipe + line|合成词：pipe 加 line
      toxic|poisonous water unsafe to drink|poisonous old-paint fumes causing coughing|poisonous mushrooms causing severe illness|toxic means poisonous and harmful; sterile means completely free of germs|toxic 是有毒有害的；sterile 是完全无菌的|sterile means completely free of germs and safe, the exact opposite of poisonous water, fumes, or mushrooms|sterile 指完全无菌安全，与有毒有害正相反|soluble means able to dissolve in a liquid, not poisonous or able to make living things ill|soluble 指能溶于液体，不表示有毒害人|tox · ic|short o + x + -ic ending|短 o 加 x 和结尾 -ic
      desalination|turning seawater into drinking water in dry countries|a coastal plant removing salt from seawater|energy-heavy process of taking salt out of seawater|desalination removes salt from seawater; drainage lets water flow away|desalination 是海水淡化除盐；drainage 是排水|drainage is the way water flows off land or out of pots, not removing salt from seawater|drainage 是让水流走的排水方式，不是把海水里的盐去掉|pollution is harmful waste dirtying water, not the process of turning seawater into drinking water|pollution 是污染，不是把海水淡化成饮用水的工艺|de · sal · i · na · tion|de- + salin (salt) + -ation|de-（去除）加 salin（盐）和 -ation
      plumbing|leaking house pipes fixed by a plumber|old indoor school pipes bursting in winter|indoor pipes and taps replacing trips to a well|plumbing is indoor pipes and taps; pipeline is a long-distance line|plumbing 是室内管道系统；pipeline 是长途输水输油管道|pipeline is a long-distance line across deserts or plains, not the indoor pipes inside a house or school|pipeline 是跨地区长途管道，不是请水管工修理的室内管路|sewage is dirty drain wastewater itself, not the pipes and taps inside a building|sewage 是下水道污水，不是房子里的水管与水龙头系统|plumb · ing|pl blend, silent b in plumb + -ing|pl 连缀，plumb 中 b 不发音，加 -ing
      faucet|a tap turned off while brushing teeth|a kitchen tap dripping all night|a tap marked with a red dot for hot water|faucet is a single tap you turn on and off; plumbing is the whole indoor pipe system|faucet 是单个水龙头；plumbing 是整套室内管道|plumbing is the whole network of pipes inside a building, not a single tap you turn off or see a red dot on|plumbing 是整套室内管路，不是刷牙时随手关掉或标着红点的单个水龙头|pipeline is a long-distance pipe crossing land, not a kitchen or sink tap|pipeline 是长途输送管道，不是厨房或洗手池上的水龙头|fau · cet|au saying /ɔː/ + soft c (/s/) in -cet|发 /ɔː/ 音的 au 加读 /s/ 的 -cet
      drainage|water flowing off a field to prevent flooding|roadside ditches carrying rainwater away|water escaping from flower pots so roots do not rot|drainage is how water flows away; sewage is dirty drain waste|drainage 是水流排走的方式；sewage 是厕所下水道污水|sewage is dirty waste from toilets and drains, not how rainwater flows off fields, roads, or flower pots|sewage 是生活污水，不是农田、路边或花盆排走雨水的排水能力|plumbing is pipes and taps inside a building, not rainwater flowing off fields or out of flower pots|plumbing 是室内管网，不是农田、路沟或花盆的排水系统|drain · age|dr blend + ai + -age ending|dr 连缀、ai 加结尾 -age
    `,
  },
);

const matter = batch(
  "words-of-matter",
  ["Words of Matter", "物质的词"],
  ["matter and what it is made of", "物质及其构成"],
  `
  particle|a very tiny piece of matter|微粒|Every ___ of dust in the sunbeam was far too small to pick up.|In a gas, each ___ moves fast and far from the others.|A single ___ of soot floated up from the candle.|substance,mass|particles
  mass|how much matter something holds|质量|A bowling ball has more ___ than a beach ball of the same size.|We measured the ___ of the rock on a balance.|The ___ of an object stays the same on the moon, even though it weighs less there.|volume,property
  volume|how much space something takes up|体积|We poured the water into a measuring cup to find its ___.|A balloon's ___ grows as you blow air into it.|The box had a ___ of one thousand cubic centimeters.|mass,particle
  property|a quality that describes a material, such as its color or hardness|性质，特性|Hardness is a ___ that tells how easily a material scratches.|One ___ of metal is that it lets heat pass through it quickly.|A shiny yellow color is one ___ of gold.|substance,mixture|properties
  dissolve|to mix into a liquid until you cannot see it any more|溶解|Stir the sugar until it begins to ___ in the tea.|Salt will ___ in warm water faster than in cold water.|Sand does not ___ in water; it sinks to the bottom.|evaporate,filter|dissolves,dissolved
  mixture|two or more things put together that can be separated again|混合物|Trail mix is a ___ of nuts, raisins and seeds.|We separated the ___ of sand and iron filings with a magnet.|A salad is a ___, since you can pick out each vegetable.|solution,substance|mixtures
  solution|a liquid with something dissolved evenly through it|溶液|Salt water is a liquid ___ because the salt has dissolved evenly through the water.|The nurse cleaned the cut with a weak liquid ___ of dissolved salt and water.|When the sugar dissolved and disappeared, the water and sugar had formed a ___.|mixture,particle|solutions
  substance|a particular kind of matter|物质|Water is a ___ that can be solid, liquid or gas.|The sticky ___ on the floor turned out to be honey.|Scientists tested the white ___ to find out whether it was salt or sugar.|property,particle|substances
  evaporate|to change from a liquid into a gas|蒸发|Puddles ___ on a hot day and leave the road dry.|If you leave a glass of water in the sun, some of it will ___.|Wet clothes dry because the water in them begins to ___.|dissolve,purify
  dense|tightly packed, with a lot of mass in a small space|密度大的|A rock is more ___ than a sponge, so it sinks.|Gold is so ___ that even a small bar of it is very heavy.|Oil floats on water because it is less ___.|porous,brittle|denser
  `,
  "context-clues",
  {
    intro: t(
      "Drop a pinch of salt into warm water and every tiny **particle** seems to vanish as it begins to **dissolve**, turning the cup into a clear **solution** whose **mass** and **volume** you can still measure. These ten words describe what matter is made of and how it behaves.",
      "往温水里撒一撮盐，每一颗微粒（**particle**）都会在溶解（**dissolve**）后消失不见，整杯水变成清澈的溶液（**solution**），但你依然能测出它的质量（**mass**）和体积（**volume**）。这十个词讲述物质的构成与性质。",
    ),
    watchOut: {
      meanings: t(
        "Tell **mass** (how much matter an object holds, measured on a balance) apart from **volume** (how much space an object takes up, measured in cups or cubic centimeters).",
        "分清 **mass**（物体含有多少物质——质量，用天平测量）和 **volume**（物体占据多大空间——体积，用量杯或立方厘米测量）。",
      ),
      use: t(
        "Tell **mixture** (items combined so you can still separate them, like trail mix or sand and iron filings) apart from **solution** (a liquid in which a substance has dissolved evenly until it disappears).",
        "分清 **mixture**（拼合在一起但仍可分开的混合物，如坚果干果或沙铁混合）和 **solution**（某物质均匀溶解在液体中看不见的溶液）。",
      ),
      spelling: t(
        "Watch **dissolve** (double *s* + *-olve*), **particle** (*-cle*, not *-cal*), and **evaporate** (*e-vap-o-rate* with *o* after *p*).",
        "注意 **dissolve** 的双写 **s**、**particle** 结尾的 **-cle**，以及 **evaporate** 中 **p** 后面的 **o**。",
      ),
    },
    notes: `
      particle|one tiny piece of dust floating in a sunbeam|a tiny piece of gas moving fast and far apart|one tiny speck of soot floating up from a candle|particle is one tiny piece of matter; substance is a whole kind of matter|particle 是单个微粒；substance 是某一类物质|substance is a particular kind of matter like water or honey, not one tiny countable speck|substance 指某种物质，不是一粒一粒可数的微小颗粒|mass is how much matter an object holds, not one tiny floating piece|mass 是物体的质量，不是漂浮在空气中的单个微粒|par · ti · cle|par + ti + -cle ending|par 加 ti 和结尾 -cle
      mass|more matter packed in a bowling ball than a same-size beach ball|how much matter a rock holds measured on a balance|the amount of matter staying constant even on the moon|mass is how much matter something holds; volume is how much space it takes up|mass 是含有的物质量（质量）；volume 是占据的空间大小（体积）|volume is how much space an object takes up, not the amount of matter measured on a balance or compared between same-size balls|volume 指占据的空间体积，不是用天平称量或同尺寸球体对比的质量|property is any descriptive quality like color or hardness, not specifically the amount of matter measured on a balance|property 泛指颜色硬度等一般特性，不特指天平测出的质量|mass|short a + double s|短音 a 加双写 s
      volume|liquid space measured in a measuring cup|growing space inside a balloon as air is blown in|a box's interior space measured in cubic centimeters|volume is how much space something takes up; mass is how much matter it holds|volume 是占据的空间体积；mass 是含有的质量|mass is how much matter something holds, not space measured in cubic centimeters or a measuring cup|mass 是质量，不是用量杯或立方厘米测量的空间体积|particle is a tiny piece of matter, not the total space inside a box or balloon|particle 是微小颗粒，不是容器或气球占据的空间大小|vol · ume|short o + long u + silent e|短 o 加长 u 和词尾 e
      property|hardness describing how easily a material scratches|letting heat pass quickly as a trait of metal|shiny yellow color as a trait of gold|property is a quality describing a material; substance is the material itself|property 是描述材料的特性；substance 是物质本身|substance is a kind of matter itself, not a descriptive quality like hardness or color|substance 指物质本身，不是硬度、颜色或导热性等特性|mixture is two or more things combined together, not a single quality describing a material|mixture 是多种东西混合在一起，不是描述材料特点的性质|prop · er · ty|pr blend, short o, and -erty ending|pr 连缀、短 o 加结尾 -erty
      dissolve|sugar mixing invisibly into warm tea|salt vanishing faster in warm water than cold|sand sinking instead of vanishing into water|dissolve mixes invisibly into a liquid; evaporate turns a liquid into a gas|dissolve 是固体溶入液体看不见；evaporate 是液体变成气体蒸发|evaporate means a liquid changing into a gas in the air, not sugar or salt mixing into water|evaporate 是液体蒸发成气体，不是糖或盐溶入水中|filter means straining dirt out through cloth or sand, not mixing invisibly into a liquid|filter 是把杂质从水中滤出来，不是溶进液体里看不见|dis · solve|dis- + double s + -olve|前缀 dis- 加双写 s 和 -olve
      mixture|nuts, raisins, and seeds combined as trail mix|sand and iron filings separated with a magnet|salad vegetables combined yet easy to pick apart|mixture can be physically separated; solution has something dissolved evenly in liquid|mixture 是可分开的混合物；solution 是均匀溶解的溶液|solution is a liquid with something dissolved evenly so you cannot pick it out, not separable solids like nuts, iron filings, or salad|solution 是物质均匀溶解的液体，不是能挑出坚果、磁吸铁屑或挑蔬菜的混合物|substance is one particular kind of matter, not several different items combined together|substance 指单一物质，不是多种东西混在一起的混合物|mix · ture|short i + x + -ture ending|短 i 加 x 和结尾 -ture
      solution|salt dissolved evenly through liquid water|weak liquid of dissolved salt cleaning a cut|water and dissolved sugar forming one clear liquid|solution has something dissolved evenly in liquid; mixture keeps separable parts|solution 是均匀溶解的溶液；mixture 保留可分离的各部分|mixture is a general combination of separable items, not specifically a liquid formed when something dissolves evenly|mixture 泛指可物理分离的混合物，不特指溶质均匀溶解后形成的溶液|particle is a single tiny speck of matter, not a whole liquid with something dissolved through it|particle 是单个微粒，不是整杯溶解均匀的溶液|so · lu · tion|so + lu + -tion ending|so 加 lu 和结尾 -tion
      substance|matter like water existing as solid, liquid, or gas|sticky matter on a floor turning out to be honey|white matter tested to see if it is salt or sugar|substance is a particular kind of matter; property is a quality of it|substance 是某种特定物质；property 是它的特性|property is a descriptive quality like color or hardness, not the physical matter itself like honey or water|property 是颜色硬度等抽象特性，不是地板上的蜂蜜或待测的白色物质|particle is one tiny speck, not a whole kind of matter like water, honey, or salt|particle 只是单个微粒，不是水、蜂蜜或盐这类物质|sub · stance|sub- + st blend + soft c in -stance|sub- 加 st 连缀和读 /s/ 的 -stance
      evaporate|hot-day puddles turning into gas and leaving roads dry|water in a sunlit glass turning into invisible gas|water in wet clothes turning to gas so clothes dry|evaporate turns liquid into gas; dissolve mixes something into a liquid|evaporate 是液体变成气体；dissolve 是溶入液体中|dissolve means mixing a solid invisibly into a liquid, not liquid water turning into gas in the air|dissolve 是溶进液体里，不是水坑、杯中水或湿衣服里的水分变成气体散到空中|purify means killing germs to make water safe to drink, not liquid turning into invisible gas|purify 是杀菌净化，不是液态水蒸发变成气体|e · vap · o · rate|e + vap + o + -rate with silent e|e 加 vap、o 和带 e 的 -rate
      dense|a rock tightly packed enough to sink unlike a sponge|gold packed so tightly that a small bar feels heavy|oil floating because it is less tightly packed than water|dense means tightly packed with heavy mass; porous is full of tiny holes|dense 是紧密沉重、密度大的；porous 是多孔疏松的|porous means full of tiny holes like a sponge, the exact opposite of tightly packed heavy matter|porous 指像海绵一样布满小孔，与紧密沉重的“密度大”正相反|brittle means hard and easily shattered, not tightly packed with heavy mass in a small space|brittle 指易碎折断，不表示单位空间里质量很重|dense|short e + ns + silent e|短 e 加 ns 和词尾 e
    `,
  },
);

const chemicalChange = batch(
  "words-of-chemical-change",
  ["Words of Chemical Change", "化学变化的词"],
  ["changes that make new substances", "产生新物质的变化"],
  `
  reaction|a change in which substances turn into new ones|反应|Mixing baking soda and vinegar causes a ___ that makes bubbles.|Burning wood is a ___ that turns it into ash and smoke.|The ___ between the two liquids turned the water purple.|compound,residue|reactions
  chemical|having to do with how substances change into new ones|化学的|Burning is a ___ change because new substances form.|A ___ change made new substances and turned the bread golden brown in the toaster.|Rust forms through a slow ___ process between iron, water and air.|physical,soluble|chemicals
  physical|having to do with a change of shape or form, not of the substance itself|物理的|Cutting paper is a ___ change, because the pieces are still paper.|Melting ice is a ___ change, since the water can freeze again.|Crushing a can is a ___ change to its shape, not to the metal itself.|chemical,soluble
  rust|the reddish-brown coating that forms on iron in damp air|铁锈|The old bike left in the rain was covered in orange ___.|A coat of paint protects the iron gate from ___.|Wet nails turn red-brown when ___ forms on them.|residue,odor|rusted,rusty
  ingredient|one of the things mixed together to make something|成分，配料|Flour is the main ___ in bread.|Each ___ must be measured carefully for the cake to rise.|The recipe lists eggs as its first ___.|compound,residue|ingredients
  fizz|to make many small bubbles with a hissing sound|冒泡，嘶嘶作响|The drink began to ___ with tiny hissing bubbles as soon as we opened the bottle.|Drop the tablet in water and watch it ___ with bubbles.|Baking soda will ___ and bubble when you pour vinegar on it.|evaporate,magnify|fizzed,fizzing
  residue|what is left behind after something is used up or taken away|残留物|After the water evaporated, a white ___ of salt was left in the dish.|The burned pan had a black ___ left on the bottom.|Sticky ___ from the tape stayed behind on the window.|rust,compound
  compound|a substance made of two or more elements joined together|化合物|Water is a ___ of hydrogen and oxygen.|Table salt is a ___ made of sodium and chlorine.|Scientists made a new ___ by joining two elements.|ingredient,reaction|compounds
  odor|a smell, often a strong one|气味|The rotten eggs gave off a terrible ___.|A sharp ___ filled the room when the milk went sour.|Gas companies add a strong ___ to gas so that people can smell a leak.|residue,rust
  irreversible|impossible to undo|不可逆的|Burning paper is ___, because you cannot turn the ash back into paper.|Once the cake is baked, the change is ___ and the batter is gone for good.|Some of the damage to the coral reef may be ___ and impossible to undo.|chemical,physical
  `,
  "context-clues",
  {
    intro: t(
      "Pour vinegar onto baking soda and the cup starts to **fizz** in a fast **chemical** **reaction** that leaves a chalky **residue** behind—an **irreversible** change you cannot undo the way you can refreeze melted ice. These ten words describe how new substances form.",
      "把醋倒在小苏打上，杯子里立刻嘶嘶冒泡（**fizz**），发生剧烈的化学（**chemical**）反应（**reaction**），留下白色残留物（**residue**）——这是无法复原的不可逆（**irreversible**）变化。这十个词讲述化学变化。",
    ),
    watchOut: {
      meanings: t(
        "Tell **chemical** change (turns substances into *new* ones, like burning wood or rusting iron) apart from **physical** change (alters only shape or state, like cutting paper or melting ice).",
        "分清 **chemical**（化学变化，生成了新物质，如燃烧或生锈）和 **physical**（物理变化，只改变形状或状态，如剪纸或冰融化）。",
      ),
      use: t(
        "Tell **compound** (elements chemically joined into one new substance, like water or salt) apart from **ingredient** (one separate food or item mixed into a recipe) and **residue** (what stays behind afterward).",
        "分清 **compound**（元素化合而成的新物质——化合物）、**ingredient**（食谱配方中的原料配料）和 **residue**（事后遗留的残留物）。",
      ),
      spelling: t(
        "Watch **chemical** (*ch* saying /k/ + *-ical*), **irreversible** (*ir-* + *revers-* + *-ible*), and **ingredient** (*in-gre-di-ent* with *-ient*).",
        "注意 **chemical** 中读 /k/ 的 **ch**、**irreversible** 结尾的 **-ible**，以及 **ingredient** 结尾的 **-ient**。",
      ),
    },
    notes: `
      reaction|baking soda and vinegar making bubbles together|burning wood turning into ash and smoke|two liquids turning water purple when mixed|reaction is a substance-changing process; compound is the joined substance itself|reaction 是产生新物质的化学反应过程；compound 是化合物本身|compound is a single joined substance like water or salt, not the process of two substances changing into new ones|compound 指由元素组成的化合物本身，不是物质互相作用产生新变化的反应过程|residue is what is left behind afterward, not the chemical process that turns substances into new ones|residue 是事后留下的残留物，不是正在发生的化学反应|re · ac · tion|re- + act + -ion ending|re- 加 act 和名词后缀 -ion
      chemical|burning forming brand-new substances|bread toasting golden brown as new substances form|iron, water, and air slowly forming rust|chemical change forms new substances; physical change alters only shape or state|chemical 变化生成新物质；physical 变化只改外形状态|physical describes a change of shape or state where no new substance forms, not burning, toasting, or rusting|physical 指不生成新物质的物理变化，与燃烧、烤焦或生锈正相反|soluble means able to dissolve in a liquid, not describing a process that forms new substances|soluble 指能溶于液体，不表示生成新物质的化学变化|chem · i · cal|ch saying /k/ + -ical ending|发 /k/ 音的 ch 加结尾 -ical
      physical|cutting paper while the pieces stay paper|melting ice that can simply refreeze|crushing a can's shape without changing the metal|physical alters shape or form only; chemical makes new substances|physical 只改变形状或状态；chemical 生成新物质|chemical describes a change that makes brand-new substances, not cutting paper, melting ice, or crushing a can|chemical 会生成新物质，与剪纸、融冰、压扁罐子这些物质不变的物理变化正相反|soluble means able to dissolve in a liquid, not a change of shape or form like cutting or crushing|soluble 指可溶于液体，不指剪纸、融冰或压扁罐子这类物理变化|phys · i · cal|ph saying /f/ + y + -ical|发 /f/ 音的 ph 加 y 和 -ical
      rust|orange coating covering an old bike left in rain|iron-gate damage prevented by paint|red-brown coating forming on wet iron nails|rust is reddish-brown iron oxide; residue is any leftover film|rust 特指铁在潮湿空气中生成的红褐色铁锈；residue 泛指任何残留物|residue is any leftover material after evaporation or burning, not specifically the reddish-brown coating on wet iron|residue 泛指各类残留物，不特指潮湿铁器上生出的红褐色铁锈|odor is a smell in the air, not an orange coating covering wet iron|odor 是气味，不是覆盖在铁门或铁钉上的红褐色锈层|rust|short u + st blend|短音 u 加结尾 st
      ingredient|flour as the main item mixed into bread|each measured item needed for a cake to rise|eggs listed first in a recipe|ingredient is one item mixed into a recipe; compound is chemically joined elements|ingredient 是配方里的单种原料；compound 是元素化合而成的化合物|compound is a substance formed by chemically joining elements, not a food item listed in a baking recipe|compound 是化学元素结合的化合物，不是食谱里称量加入的面粉或鸡蛋|residue is what is left behind at the end, not an item you mix in from a recipe|residue 是用完后留下的残渣，不是做面包或蛋糕时加入的配料|in · gre · di · ent|in- + gr blend + -dient ending|in- 加 gr 连缀和结尾 -dient
      fizz|a soda making tiny hissing bubbles when opened|a tablet bubbling and hissing in water|baking soda bubbling when vinegar is poured on it|fizz makes hissing bubbles; evaporate quietly turns liquid into gas|fizz 是发出嘶嘶声冒泡；evaporate 是液体无声蒸发成气体|evaporate means quietly turning from liquid to gas in the air, not making tiny hissing bubbles|evaporate 是液体慢慢蒸发成气体，不是发出嘶嘶声冒出许多小气泡|magnify means making something look bigger through a lens, not bubbling with a hissing sound|magnify 是通过镜片放大物体，不是嘶嘶冒泡|fizz|short i + double z|短音 i 加双写 z
      residue|white salt left in a dish after water evaporates|black film left on a burned pan bottom|sticky film staying behind on glass after tape|residue is what stays behind afterward; rust is reddish-brown iron coating|residue 是事后留下的残留物；rust 专指铁锈|rust is specifically reddish-brown iron oxide on damp iron, not white salt, black soot, or sticky tape film|rust 专指铁器上的红褐色铁锈，不是蒸发后剩下的白盐或胶带留下的黏胶|compound is a substance of joined elements, not specifically leftover traces remaining in a pan or on glass|compound 是化合物，不特指蒸发、烧焦或撕胶带后残留的痕迹|res · i · due|s saying /z/ + i + -due|s 读 /z/ 加 i 和结尾 -due
      compound|water formed by joining hydrogen and oxygen|table salt formed from sodium and chlorine|a new substance made by joining two elements|compound is chemically joined elements; ingredient is a recipe item|compound 是元素化合而成的化合物；ingredient 是食谱配料|ingredient is a food or item mixed into a recipe, not elements chemically bonded like hydrogen and oxygen|ingredient 是食谱配料，不是氢氧或钠氯等元素化合而成的化合物|reaction is the process of substances changing, not the resulting substance made of joined elements|reaction 是化学反应过程，不是由两种元素组成的物质本身|com · pound|com- + ou saying /aʊ/ + nd|com- 加读 /aʊ/ 的 ou 和 nd
      odor|a terrible smell coming from rotten eggs|a sharp smell filling a room from sour milk|a strong smell added to gas to warn of leaks|odor is a strong smell; residue is a leftover solid or film|odor 是气味；residue 是残留物|residue is physical matter left behind on a surface, not a smell floating in the air|residue 是留在表面的实体残留物，不是飘散在空气中的刺鼻气味|rust is reddish-brown coating on damp iron, not a smell from eggs, milk, or gas|rust 是铁锈，不是臭鸡蛋、酸牛奶或燃气里的气味|o · dor|long o + -dor (not -der)|长音 o 加结尾 -dor
      irreversible|burning paper that can never become paper again|a baked cake whose batter is gone for good|coral reef damage that cannot be undone|irreversible means impossible to undo; physical changes can often be reversed|irreversible 指不可逆转、无法复原；physical 变化常可复原|chemical describes how substances form new ones, not specifically the quality of being impossible to undo|chemical 指化学性质，不专门指“无法复原、不可逆转”|physical describes changes of shape or form, not damage or change that is impossible to undo|physical 指物理形态变化，不表示“无法挽回、不可逆”|ir · re · ver · si · ble|ir- + double r + -ible ending|前缀 ir- 加双写 r 和结尾 -ible
    `,
  },
);

const materials = batch(
  "words-for-describing-materials",
  ["Words for Describing Materials", "描述材料的词"],
  ["what materials are like", "材料的特性"],
  `
  brittle|hard but easily broken or cracked|易碎的|Thin glass is ___ and shatters if you drop it.|Old leaves become dry and ___ and crumble in your hand.|The ___ cookie snapped in half as soon as I picked it up.|pliable,coarse
  soluble|able to dissolve in a liquid|可溶的|Sugar is ___ in water, but sand is not.|The medicine comes as a ___ powder that you stir into juice.|We tested which powders were ___ by stirring each one into water.|porous,waterproof
  elastic|able to stretch and then go back to its shape|有弹性的|A rubber band is ___, so it snaps back after you stretch it.|The ___ waist of the pants stretches when you sit down.|Balloons are made of thin, stretchy ___ rubber that springs back.|malleable,brittle
  porous|full of tiny holes that let water or air pass through|多孔的|A sponge is ___ and soaks up water.|Water drains through ___ rock into the ground below.|Clay pots are ___ with tiny holes, so plants in them dry out quickly.|soluble,coarse
  flammable|able to catch fire easily|易燃的|Keep ___ liquids such as gasoline away from flames.|Dry grass is very ___ and catches fire easily in summer.|The warning label showed a flame because the spray was ___.|brittle,waterproof
  malleable|able to be hammered or pressed into a new shape without breaking|有延展性的|Gold is so ___ that it can be beaten into thin sheets.|Warm clay is ___ and easy to press into new shapes in your hands.|The blacksmith heated the iron until it was ___ enough to hammer and bend.|elastic,brittle
  coarse|rough, with large grains or thick threads|粗糙的|The beach was covered in ___ sand that scratched our feet.|Sandpaper feels ___ when you rub your finger across it.|She knitted the scarf with a ___ wool that itched.|porous,pliable
  waterproof|not letting water through|防水的|My ___ boots kept my feet dry in the puddles.|The tent is ___, so the rain runs off it.|A coat of wax makes the paper ___ so water cannot soak through.|soluble,porous
  luster|the way a surface shines in the light|光泽|Polishing gave the silver spoon a bright ___.|Pearls have a soft ___ that glows in the light.|Most metals have a ___ that makes them shine.|residue,property
  pliable|easy to bend without breaking|柔韧的，易弯的|Willow branches are ___ enough to weave into baskets.|Soak the reeds in water so they stay ___ and bend easily.|The young twig is ___, but the old branch snaps.|brittle,coarse
  `,
  "context-clues",
  {
    intro: t(
      "A workshop table shows how differently materials behave: thin glass is **brittle** and snaps, willow twigs are **pliable** enough to weave, rubber bands are **elastic** and spring back, and waxed canvas stays **waterproof** in the rain. These ten words describe what materials can do.",
      "工作台上的材料各有脾气：薄玻璃易碎（**brittle**），柳条柔韧（**pliable**）能编筐，橡皮筋有弹性（**elastic**）能回弹，打蜡帆布能防水（**waterproof**）。这十个词教你准确描述材料特性。",
    ),
    watchOut: {
      meanings: t(
        "Tell **elastic** (stretches and *snaps back* to its original shape, like a rubber band) apart from **malleable** (can be hammered or pressed into a *new* shape that stays, like gold or clay) and **pliable** (bends easily without breaking, like wet reeds).",
        "分清 **elastic**（拉伸后能弹回原状的弹性）、**malleable**（能锤打或捏成新形状且保持住的延展性）和 **pliable**（容易弯曲不断裂的柔韧性）。",
      ),
      use: t(
        "Tell **porous** (full of tiny holes that let water or air pass through, like a sponge or clay pot) apart from **waterproof** (blocks water completely) and **soluble** (dissolves into a liquid).",
        "分清 **porous**（布满小孔、透水透气的多孔性）、**waterproof**（完全不透水的防水性）和 **soluble**（能溶解在液体里的可溶性）。",
      ),
      spelling: t(
        "Watch **malleable** (double *l* + *-eable*), **flammable** (double *m* + *-able*), and **brittle** (double *t* + *-le*).",
        "注意 **malleable** 的双写 **l** 和 **-eable**、**flammable** 的双写 **m**，以及 **brittle** 的双写 **t**。",
      ),
    },
    notes: `
      brittle|thin glass shattering when dropped|dry old leaves crumbling in a hand|a cookie snapping in half as soon as it is picked up|brittle snaps or shatters easily; pliable bends easily without breaking|brittle 是硬而易碎；pliable 是柔韧易弯|pliable means bending easily without breaking, the exact opposite of snapping or shattering|pliable 指柔韧不易折断，与一碰就碎裂正相反|coarse means rough in texture with large grains, not snapping or shattering easily|coarse 指表面粗糙，不指一摔就碎或一掰就断|brit · tle|br blend, short i, double t, and -le|br 连缀、短 i、双写 t 加 -le
      soluble|sugar dissolving in water unlike sand|powdered medicine stirred into juice to dissolve|powders tested by stirring them into water|soluble dissolves in liquid; porous has tiny holes letting liquid pass through|soluble 是可溶于液体的；porous 是多孔透水的|porous describes a solid with tiny holes that water passes through, not a powder that dissolves away in liquid|porous 指固体布满小孔能透水，不是在液体中化开的可溶性粉末|waterproof blocks water completely, the opposite of dissolving into water or juice|waterproof 是完全防水，与溶入液体正相反|sol · u · ble|short o + u + -ble ending|短 o 加 u 和结尾 -ble
      elastic|a rubber band snapping back after stretching|a waistband stretching when you sit down|stretchy balloon rubber springing back|elastic stretches and snaps back; malleable stays in a new hammered shape|elastic 是能弹回原形的弹性；malleable 是可锤打塑形的延展性|malleable means able to be hammered or pressed into a new shape that stays, not springing back after stretching|malleable 指锤打压成新形状后保持不变，不是像橡皮筋或气球那样回弹|brittle means hard and easily broken, the opposite of stretchy rubber|brittle 是硬而易碎，与能拉长回弹正相反|e · las · tic|e + las + -tic ending|e 加 las 和结尾 -tic
      porous|a sponge soaking up water through tiny holes|rock letting rainwater drain through into the ground|clay pots with tiny holes drying out quickly|porous has tiny holes letting water pass through; soluble dissolves in liquid|porous 是多孔透水的；soluble 是能溶解在液体里的|soluble means dissolving away in a liquid, not a solid sponge, rock, or clay pot full of tiny holes|soluble 指溶入液体消失，不是布满微孔透水的海绵、岩石或陶盆|coarse means rough and grainy on the surface, not full of tiny holes letting water drain through|coarse 指质地粗糙颗粒大，不指内部多孔透水|po · rous|por + -ous adjective ending|por 加形容词后缀 -ous
      flammable|gasoline kept away from open flames|dry summer grass catching fire easily|a spray carrying a flame warning label|flammable catches fire easily; waterproof blocks water|flammable 是易燃的；waterproof 是防水的|brittle means snapping or cracking easily, not catching fire near flames|brittle 指易碎折断，不是遇火容易燃烧|waterproof means keeping water out, not catching fire easily|waterproof 指防水，与遇火易燃无关|flam · ma · ble|fl blend, double m, and -able|fl 连缀、双写 m 和结尾 -able
      malleable|gold beaten into thin sheets without breaking|warm clay pressed easily into new shapes|heated iron hammered and bent by a blacksmith|malleable can be hammered or pressed into new shapes; elastic springs back|malleable 是可锤打压塑成新形的；elastic 是拉完会弹回的|elastic means stretching and springing back to its old shape, not staying in a new hammered or pressed shape|elastic 拉完会弹回原状，不像黄金、黏土或烧红的铁那样压成新形|brittle means snapping or shattering under force, the exact opposite of hammering without breaking|brittle 一敲就碎，与能锤打延展不断裂正相反|mal · le · a · ble|mal + double l + -eable|mal 加双写 l 和 -eable
      coarse|rough beach sand scratching bare feet|rough sandpaper felt under a finger|thick scratchy wool itching the skin|coarse is rough with large grains or thick threads; porous has tiny holes|coarse 是颗粒粗或表面粗糙；porous 是多孔的|porous means full of tiny holes letting water pass through, not rough or scratchy to the touch|porous 指布满透水小孔，不指摸起来扎手粗糙|pliable means easy to bend without breaking, not rough, grainy, or scratchy|pliable 指柔软易弯，不指粗糙扎人|coarse|oa saying /ɔː/ + rse (not course)|发 /ɔː/ 的 oa 加 rse（别写成课程 course）
      waterproof|boots keeping feet dry in puddles|a tent shedding rain so water runs off|waxed paper stopping water from soaking through|waterproof blocks water completely; porous lets water pass through|waterproof 是不透水的；porous 是多孔透水的|soluble means dissolving in water, the exact opposite of blocking water out|soluble 指遇水溶解，与防水正相反|porous means full of tiny holes letting water pass through, the exact opposite of keeping water out|porous 指多孔透水，与挡水防水正相反|wa · ter · proof|compound word: water + proof (double o)|合成词：water 加含 oo 的 proof
      luster|bright shine polished onto a silver spoon|soft glowing shine on pearls|bright metallic shine in the light|luster is surface shine; residue is leftover film on a surface|luster 是表面光泽；residue 是残留物|residue is leftover matter remaining after burning or drying, not the bright glowing shine of polished silver or pearls|residue 是残留物，不是抛光银勺、珍珠或金属表面发出的柔和光泽|property is any general trait of a material, not specifically the way a polished surface shines in light|property 泛指材料特性，不特指表面反光发亮的光泽|lus · ter|short u + st blend + -er|短 u、st 连缀加 -er
      pliable|willow branches bending smoothly to weave baskets|soaked reeds staying easy to bend|a young twig bending while an old branch snaps|pliable bends easily without breaking; brittle snaps easily|pliable 是柔韧易弯；brittle 是干硬易折|brittle means snapping or breaking easily, the exact opposite of bending smoothly to weave|brittle 干硬易断，与柔韧易弯正相反|coarse means rough with large grains or thick threads, not easy to bend without snapping|coarse 指表面粗糙，不指枝条柔韧耐弯|pli · a · ble|pl blend, long i, and -able ending|pl 连缀、长音 i 和结尾 -able
    `,
  },
);

const investigating = batch(
  "words-for-investigating",
  ["Words for Investigating", "探究的词"],
  ["doing experiments and tests", "做实验和测试"],
  `
  procedure|a set of steps for doing something|步骤，程序|Follow the ___ one step at a time, in order.|The ___ said to heat the water before adding the salt.|Every group used the same step-by-step ___ so their results could be compared.|trial,category|procedures
  trial|one run of a test in an experiment|（一次）试验|We dropped the ball from the same height in each ___.|In the first ___, the ice melted in ten minutes.|The second ___ gave the same answer as the first, so we trusted it.|procedure,outcome|trials
  result|what you find or measure at the end of a test|结果|Record each ___ in the table: how long the ice took to melt.|The ___ of our test showed that salt water froze more slowly.|Her ___ surprised the class: the heavy ball did not fall faster.|category,procedure|results
  outcome|the way something ends or turns out|结局，结果|Nobody could guess the ___ of the close election.|The ___ of the game was a tie, so both teams shared the cup.|We waited nervously to learn the ___ of the vote.|trial,category|outcomes
  confirm|to show that something is true|证实|A second test will ___ our first result and prove it was right.|The photos ___ that the owls nest in this barn.|Please call to ___ that you will come to the party.|determine,classify|confirmed,confirms
  precise|exact and careful|精确的|Use a ruler to take a ___ measurement.|The recipe needs a ___ amount of salt: exactly five grams.|Her map was so ___ that every path on it matched the real ones.|consistent,durable
  classify|to sort things into groups|分类|Scientists ___ animals by features such as fur or feathers.|We had to ___ the rocks into groups by their color.|Can you ___ these leaves into two piles?|confirm,determine
  category|a group of things that are alike|类别|Whales belong in the mammal ___, not the fish one.|Put each word in the right ___.|Which ___ does a tomato belong to, fruit or vegetable?|procedure,result|categories
  determine|to find out by studying or measuring|确定，查明|We used a thermometer to ___ how hot the water was.|Tests will ___ what caused the illness.|It is hard to ___ how old the rock is without special tools.|classify,confirm
  consistent|the same each time|一致的|The results were ___: every trial took ten minutes.|To keep the test fair, keep the amount of water ___ in each trial.|She is a ___ player who scores steadily in every game.|precise,available
  `,
  "context-clues",
  {
    intro: t(
      "Before a lab test begins, scientists write a clear **procedure**, run more than one **trial** with **precise** tools, and check whether each **result** stays **consistent** enough to **confirm** their idea. These ten words belong to careful investigation.",
      "实验开始前，科学家先写清步骤（**procedure**），用精确（**precise**）工具做多次试验（**trial**），再看每次结果（**result**）是否一致（**consistent**），能否证实（**confirm**）猜想。这十个词是科学探究的核心词。",
    ),
    watchOut: {
      meanings: t(
        "Tell **determine** (find out an *unknown* answer by measuring or testing, such as *how hot* or *what caused*) apart from **confirm** (prove that a claim or earlier result is *already true*).",
        "分清 **determine**（通过测量或检验查明未知答案，如温度多少、原因何在）和 **confirm**（证实已知猜想或既有结果确实属实）。",
      ),
      use: t(
        "Tell **precise** (exact and careful in a single measurement) apart from **consistent** (staying the same *each time* across repeated trials or games).",
        "分清 **precise**（单次测量精确无误）和 **consistent**（多次试验或每次表现始终一致）。",
      ),
      spelling: t(
        "Watch **procedure** (*pro-* + *-ced-* + *-ure*, no double *e* like *proceed*), **precise** (soft *c* + *-ise*), and **category** (*cat-e-go-ry*, keep the *e* and *o*).",
        "注意 **procedure** 中间只有一个 **e**（别和 *proceed* 混）、**precise** 结尾的 **-cise**，以及 **category** 中间的 **e** 和 **o**。",
      ),
    },
    notes: `
      procedure|following ordered steps one at a time|instructions saying to heat water before adding salt|the same step-by-step method shared by every group|procedure is a set of ordered steps; trial is one run of a test|procedure 是整套操作步骤；trial 是单次试验|trial is one single run of a test, not the written set of ordered steps you follow|trial 是实验中的某一次运行，不是按顺序执行的一整套步骤|category is a group of alike things, not a step-by-step set of instructions|category 是同类事物的类别，不是按步骤执行的程序|pro · ce · dure|pro- + single e in ce + -dure|pro- 加单个 e 的 ce 和 -dure
      trial|one ball-drop run from the same height|the first test run where ice melted in ten minutes|a second test run matching the first answer|trial is one test run; procedure is the set of steps|trial 是单次测试运行；procedure 是操作步骤|procedure is the written set of steps for an experiment, not one numbered run like a first or second test|procedure 是整套操作规程，不是第一次、第二次这样的单次试验|outcome is the final way an event ends, not one repeated run in an experiment|outcome 是最终结局，不是实验里重复做的单次试验|tri · al|tr blend, long i, and -al ending|tr 连缀、长音 i 和结尾 -al
      result|a recorded melting-time measurement in a table|a test finding showing salt water froze slower|a surprising test finding about a heavy ball|result is what a test measures or finds; procedure is the steps used|result 是实验测得的结果；procedure 是实验步骤|category is a group of similar things, not a measurement recorded at the end of a test|category 是类别分组，不是实验测出的结果数据|procedure is the step-by-step method followed before the test ends, not the final finding recorded in a table|procedure 是实验前的步骤方法，不是实验结束后记录的结果|re · sult|re- + s saying /z/ + ult|re- 加读 /z/ 的 s 和 ult
      outcome|the unpredictable final result of a close election|a tie ending where both teams share the cup|the final result of a vote waited on nervously|outcome is how a contest or vote turns out; trial is one test run|outcome 是比赛或投票的最终结局；trial 是单次试验|trial is one run of a scientific test, not the final ending of an election, game, or vote|trial 是科学实验的一次试测，不是选举、比赛或投票的最终结局|category is a group of alike items, not the way a close contest turns out|category 是分类类别，不是事件最终的结果结局|out · come|compound word: out + come|合成词：out 加 come
      confirm|a second test proving an earlier result was right|photos proving that owls nest in a barn|calling to verify attendance at a party|confirm proves something is true; determine finds out an unknown fact|confirm 是证实已有说法属实；determine 是查明未知事实|determine means finding out an unknown answer by measuring, not verifying an existing result, claim, or plan|determine 是测出未知答案，不是再次证实已有结果或赴约|classify means sorting items into groups, not proving a claim or verifying plans|classify 是把事物分类归组，不是证实真假|con · firm|con- + ir saying /ɜːr/ + m|con- 加读 /ɜːr/ 的 ir 和 m
      precise|an exact ruler measurement|an exact five-gram amount of salt|a map matching every real path accurately|precise is exact in detail; consistent is the same each time|precise 是细节精确；consistent 是每次一致|consistent means staying the same across repeated times, not measuring an exact five grams or matching real paths|consistent 指每次重复都保持不变，不指单次测量精确到五克|durable means lasting a long time without wearing out, not exact and careful in measurement or detail|durable 指经久耐用，不指测量或地图细节精确无误|pre · cise|pre- + soft c (/s/) + silent e making long i|pre- 加读 /s/ 的 c 和词尾 e
      classify|sorting animals by fur or feathers|sorting rocks into groups by color|sorting leaves into two separate piles|classify sorts items into groups; determine finds out a fact|classify 是归类分组；determine 是查明测定|confirm means proving a statement is true, not sorting animals, rocks, or leaves into groups|confirm 是证实属实，不是把动物、岩石或树叶分门别类|determine means finding out an answer by measuring, not sorting objects into piles or groups|determine 是测定查明，不是把物品分成几堆类别|clas · si · fy|cl blend, double s, and -ify ending|cl 连缀、双写 s 和动词后缀 -ify
      category|the mammal group rather than the fish group|the right group for sorting each word|the fruit or vegetable group a tomato belongs to|category is a group of alike things; result is a test finding|category 是同类归属的类别；result 是实验结果|procedure is a set of ordered steps, not a group like mammals, fruit, or vegetables|procedure 是操作步骤，不是哺乳动物或水果蔬菜这样的类别|result is what a test measures at the end, not a group that similar items belong to|result 是实验结果，不是事物所属的分类类别|cat · e · go · ry|cat + e + go + -ry|cat 加 e、go 和 -ry
      determine|using a thermometer to find water temperature|tests finding out what caused an illness|finding out how old a rock is with special tools|determine finds out an unknown fact; confirm proves a known claim|determine 是查明未知答案；confirm 是证实已有说法|classify means sorting items into groups, not measuring temperature, cause, or rock age|classify 是分类归组，不是用温度计或工具测定数值与原因|confirm means verifying an existing claim is true, not discovering an unknown temperature, cause, or age|confirm 是证实已知猜想，不能搭配 how hot、what caused 或 how old 表示查明未知|de · ter · mine|de- + ter + -mine ending|de- 加 ter 和结尾 -mine
      consistent|every trial taking the exact same ten minutes|keeping water amounts identical across every trial|a player scoring steadily in every single game|consistent stays the same each time; precise is exact in one measurement|consistent 是每次都保持一致；precise 是单次测量精确|precise means exact in a single detail, not repeating the same result across every trial or game|precise 指单次精确，不强调每次试验或每场比赛都稳定一致|available means ready to be used or had, not staying the same across repeated trials or games|available 指可供使用，不表示每次试验或比赛结果始终一致|con · sis · tent|con- + sist + -ent ending|con- 加 sist 和结尾 -ent
    `,
  },
);

const cellsAndMicrobes = batch(
  "words-of-cells-and-microbes",
  ["Words of Cells and Microbes", "细胞与微生物的词"],
  ["cells and living things too small to see", "细胞和小得看不见的生物"],
  `
  cell|the smallest living part of a plant or an animal|细胞|Every living thing is made of at least one ___.|Under the microscope, each onion ___ looked like a tiny brick.|Your body makes a new skin ___ to replace one that wears away.|nucleus,membrane
  microbe|a living thing too small to see without a microscope|微生物|A ___ is a tiny living thing so small that thousands of them could fit on the head of a pin.|Not every ___ makes you sick; many of these tiny organisms are helpful.|The scientist found a new microscopic ___ living in the hot spring.|cell,nucleus|microbes
  bacteria|tiny living things of one cell found almost everywhere|细菌|Some ___ in your stomach help you digest food.|Wash your hands to remove one-celled ___ before you eat.|Milk turns sour when one-celled ___ grow in it.|virus,yeast
  fungus|a living thing, such as a mushroom, that feeds on dead or living matter|真菌|A mushroom is a ___ that grows on rotting logs.|The ___ spread across the dead tree in white threads.|Athlete's foot is caused by a ___ that feeds on skin between the toes.|yeast,membrane|fungi
  yeast|a tiny fungus that makes bread rise|酵母|Bakers add ___ to dough so that it puffs up.|The ___ fed on the sugar and made bubbles of gas in the dough.|Without ___, the bread stayed flat and hard.|mold,bacteria
  mold|a fuzzy fungus that grows on old food or in damp places|霉菌|Green, fuzzy ___ grew on the bread we forgot in the cupboard.|Damp bathroom walls can grow black ___.|Throw away cheese with fuzzy ___ on it.|yeast,membrane|molds,moldy
  virus|a tiny germ that can grow only inside living cells and causes illness|病毒|The flu is caused by a ___ that spreads when people sneeze.|A ___ cannot grow on its own; it must get inside a cell.|Doctors gave a vaccine to protect people from the flu ___.|bacteria,nucleus|viruses
  membrane|a thin, soft layer that covers or separates|膜|A thin ___ around each cell lets food in and waste out.|The thin ___ of an egg lies just inside the shell.|The cell's outer ___ holds everything inside it like a bag.|nucleus,cell
  nucleus|the center of a cell, which controls it|细胞核|The ___ is the control center of the cell.|When stained, the ___ at the center of each cell showed as a dark spot.|The ___ holds the instructions that tell the cell what to do.|membrane,microbe
  germ|a tiny living thing that causes illness|病菌|Cover your mouth when you cough so you do not spread a ___.|A single illness-causing ___ on the doorknob can pass to many hands.|The nurse cleaned the cut so that no ___ could get into it.|yeast,cell|germs
  `,
  "context-clues",
  {
    intro: t(
      "Slip an onion skin under a microscope and each tiny **cell** appears like a brick wrapped in a thin **membrane** with a dark **nucleus** inside—while out of sight on bread, soil, and skin live **bacteria**, **yeast**, and **mold**. These ten words open up the microscopic world.",
      "把洋葱表皮放进显微镜下，每个微小细胞（**cell**）像一块块小砖，外裹薄膜（**membrane**）、内藏细胞核（**nucleus**）；肉眼看不见的地方还生活着细菌（**bacteria**）、酵母（**yeast**）和霉菌（**mold**）。这十个词带你走进微观世界。",
    ),
    watchOut: {
      meanings: t(
        "Tell **bacteria** (one-celled living things found almost everywhere, many helpful like those in your stomach) apart from a **virus** (not a cell at all; it can grow only by invading a living cell).",
        "分清 **bacteria**（随处可见的单细胞细菌，不少对人体有益）和 **virus**（不是细胞，必须侵入活细胞才能繁殖的病毒）。",
      ),
      use: t(
        "Tell **yeast** (the tiny fungus bakers add to dough to make bread rise) apart from **mold** (the fuzzy fungus that spoils old food or grows on damp walls).",
        "分清 **yeast**（让面团发起来的烘焙酵母）和 **mold**（在旧食物或潮湿墙面长出的毛茸茸霉菌）。",
      ),
      spelling: t(
        "Watch **bacteria** (*-ia* plural ending), **nucleus** (*nu-cle-us* with *-eus*), and **membrane** (*mem-* + *brane*, not *brain*).",
        "注意 **bacteria** 结尾的 **-ia**、**nucleus** 结尾的 **-eus**，以及 **membrane** 结尾的 **-brane**（别写成 *brain*）。",
      ),
    },
    notes: `
      cell|the smallest living unit building every organism|onion units looking like tiny bricks under a microscope|a new skin unit replacing one that wears away|cell is the whole smallest living unit; nucleus is its control center inside|cell 是完整的最小生命单元；nucleus 是细胞内部的细胞核|nucleus is the control center inside a cell, not the whole brick-like living unit making up skin or an onion|nucleus 只是细胞里的控制中心，不是构成生物体或洋葱表皮的完整细胞单元|membrane is only the thin outer layer around a cell, not the whole living building block|membrane 只是包裹细胞的一层薄膜，不是构成生命体的完整细胞|cell|soft c (/s/) + short e + double l (not sell)|读 /s/ 的 c 加短 e 和双写 l（别写成卖 sell）
      microbe|a tiny organism so small thousands fit on a pinhead|a tiny organism that is often helpful rather than harmful|a newly found microscopic organism living in a hot spring|microbe is an independent microscopic organism; cell is a building unit of a body|microbe 是独立的微小生物体；cell 是构成生物的细胞单元|cell is one building block of a plant or animal body, not an independent organism living in a hot spring or making people sick|cell 是动植物身体的组成单位，不是单独生活在温泉中或致病的微生物|nucleus is the control center inside a cell, not a whole living organism|nucleus 是细胞内部的细胞核，不是独立的微小生物|mi · crobe|long i + cr blend + silent e making long o|长 i、cr 连缀加发长 o 的 robe
      bacteria|helpful stomach microbes aiding digestion|one-celled organisms washed off hands before eating|one-celled organisms growing in milk and turning it sour|bacteria are one-celled organisms; virus must invade a living cell to grow|bacteria 是单细胞细菌；virus 必须侵入细胞才能繁殖|virus is a singular non-cellular germ that cannot digest food or live on its own as a one-celled organism|virus 是非细胞病毒且为单数，不能帮胃消化或作为单细胞生物在牛奶中生长|yeast is a fungus used to make bread rise, not one-celled organisms in your stomach or souring milk|yeast 是发酵面包的真菌，不是帮助消化或使牛奶变酸的细菌|bac · te · ri · a|bac + te + ri + -a plural ending|bac 加 te、ri 和复数结尾 -a
      fungus|a mushroom growing on rotting logs|white threads spreading across a dead tree|a skin-feeding organism causing athlete's foot|fungus is the whole group including mushrooms and molds; yeast is one tiny baking fungus|fungus 是包含蘑菇与霉菌的真菌大类；yeast 专指发面酵母|yeast is only the tiny fungus that makes bread dough rise, not a mushroom on a log or athlete's foot|yeast 专指让面包发酵的微小酵母，不是烂木上的蘑菇或引起脚气的真菌|membrane is a thin covering layer, not a living organism feeding on dead logs or skin|membrane 是一层薄膜，不是靠枯木或皮肤生存的真菌生物|fun · gus|short u + ng + -gus ending|短 u 加 ng 和结尾 -gus
      yeast|a tiny fungus added to dough to make bread puff up|a dough fungus feeding on sugar to make gas bubbles|a missing ingredient leaving bread flat and hard|yeast makes bread rise; mold spoils old food with fuzz|yeast 用来发面做面包；mold 是让食物发霉长毛的霉菌|mold is a fuzzy fungus that spoils old food or grows on damp walls, not what bakers add to make bread rise|mold 是让食物变质发霉的霉菌，不是面包师用来发面的酵母|bacteria are one-celled organisms rather than the tiny baking fungus added to bread dough|bacteria 是细菌，不是用来让面团发酵蓬松的酵母|yeast|ea saying long e + st blend|发长 e 的 ea 加结尾 st
      mold|green fuzzy growth on forgotten bread|black growth spreading on damp bathroom walls|fuzzy growth forcing you to throw away cheese|mold is fuzzy spoiling fungus; yeast is baking fungus|mold 是毛茸茸的霉菌；yeast 是发面酵母|yeast is a baking fungus that makes dough rise, not green or black fuzz spoiling cheese or walls|yeast 是发面酵母，不是长在潮湿墙壁、旧面包或奶酪上的毛茸茸霉菌|membrane is a thin biological layer around a cell or egg, not fuzzy growth on old food|membrane 是细胞或鸡蛋里的薄膜，不是旧食物上长出的霉菌|mold|long o before ld|ld 前读长音的 o
      virus|a sneezing-spread germ causing the flu|a tiny germ that must get inside a cell to grow|the flu germ targeted by a protective vaccine|virus must invade a living cell to grow; bacteria are independent one-celled organisms|virus 必须侵入细胞才能繁殖；bacteria 是独立单细胞细菌|bacteria is a plural noun for one-celled organisms that can grow on their own, not a singular germ needing to invade a cell|bacteria 是复数且能独立生长，不能填入单数 a ___ 且不符合“必须进入细胞才能繁殖”|nucleus is the control center of a cell, not an illness-causing germ spread by sneezing|nucleus 是细胞核，不是引起流感、靠打喷嚏传播的病毒|vi · rus|long i in vi + -rus ending|vi 读长 i 加结尾 -rus
      membrane|a thin outer layer letting food in and waste out|the thin soft layer just inside an eggshell|a bag-like outer layer holding cell parts inside|membrane is the thin outer covering; nucleus is the inner control center|membrane 是外层薄膜；nucleus 是内部的细胞核|nucleus is the control center inside a cell, not the thin outer layer around a cell or inside an eggshell|nucleus 是细胞内部的控制中心，不是包在细胞外围或蛋壳内侧的薄膜|cell is the whole living unit, not just the thin outer skin wrapping around it|cell 是整个细胞，不只是外面包裹的那层薄膜|mem · brane|mem + br blend + silent e making long a|mem 加 br 连缀和发长 a 的 brane
      nucleus|the control center inside a cell|a stained dark spot at the center of each cell|the cell center holding operating instructions|nucleus is the cell's control center; membrane is its outer covering|nucleus 是细胞内的控制中心；membrane 是外层细胞膜|membrane is the thin outer covering around a cell, not the dark control center holding instructions inside|membrane 是细胞外层薄膜，不是细胞中央发号施令的控制中心|microbe is an entire tiny organism, not the control center inside a cell|microbe 是独立的微生物个体，不是细胞内部的细胞核|nu · cle · us|long u + cl blend + -eus ending|长 u、cl 连缀加结尾 -eus
      germ|an illness-causing microbe spread by coughing|an illness-causing microbe passed from a doorknob|an illness-causing microbe cleaned away from a cut|germ is any illness-causing microbe; yeast is a helpful baking fungus|germ 指致病微生物；yeast 是有益的发面酵母|yeast is a helpful baking fungus that makes bread rise, not an illness-causing microbe on doorknobs or cuts|yeast 是发面用的有益酵母，不是咳嗽传播或感染伤口的病菌|cell is a normal building block of a living body, not an illness-causing microbe spread by coughing|cell 是构成生物体的正常细胞，不是门把手上传播疾病的病菌|germ|soft g (/dʒ/) + er saying /ɜːr/ + m|读 /dʒ/ 的 g 加 er 和 m
    `,
  },
);

const lab = batch(
  "words-of-the-lab",
  ["Words of the Laboratory", "实验室的词"],
  ["the tools and rules of a laboratory", "实验室的工具和规则"],
  `
  magnify|to make something look bigger than it is|放大|A hand lens will ___ the ant so that you can see its legs.|This microscope can ___ a cell four hundred times.|A drop of water on a leaf can ___ the veins beneath it.|contaminate,classify|magnifies,magnified
  beaker|a wide glass cup with a lip for pouring, used in a lab|烧杯|Pour fifty milliliters of water into the wide-mouthed glass ___.|The wide glass ___ has a pouring lip and lines on its side to measure the liquid.|She heated the wide-lipped ___ of water over the flame.|flask,dropper
  dropper|a small tube with a rubber bulb for adding liquid one drop at a time|滴管|Use the ___ to add one drop of iodine at a time.|Squeeze the bulb of the ___ gently.|With a ___, he placed a single drop of pond water on the glass.|tweezers,beaker
  stain|a dye that colors parts of a cell so they are easier to see|染色剂|Add a drop of blue ___ so that the cells show up.|The ___ turned each nucleus dark purple.|Without a coloring ___, the clear cells were almost impossible to see.|slide,dropper
  sterile|completely free of germs|无菌的|Doctors use ___ tools during an operation.|Keep the bandage in its wrapper so it stays ___.|The lab dishes were heated to make them ___.|toxic,porous
  goggles|glasses that fit tightly to protect the eyes|护目镜|Wear safety ___ when you mix chemicals.|The ___ kept the splashes out of her eyes.|He pushed his ___ up onto his forehead after the experiment.|tweezers,slide
  contaminate|to make something dirty or unsafe by adding germs or poison|污染，弄脏|Touching the sample with bare hands can ___ it.|A leaking pipe can ___ the drinking water.|Do not let a sneeze ___ the dish.|magnify,purify|contaminated
  tweezers|a small tool with two arms for picking up tiny things|镊子|Pick up the leaf with ___ so you do not tear it.|She used ___ to pull out the splinter.|The scientist held the tiny seed in a pair of ___.|dropper,goggles
  flask|a glass bottle with a narrow neck, used in a lab|烧瓶|Swirl the liquid in the ___ so that it does not spill out of the narrow neck.|The ___ had a cork stuck in its thin neck.|He heated the liquid in a narrow-necked round glass ___.|beaker,slide
  slide|a thin piece of glass that holds a sample under a microscope|载玻片|Place a drop of pond water on the glass ___.|Slip the ___ under the microscope's lens.|Each glass ___ was labeled with the name of its sample.|stain,flask|slides
  `,
  "context-clues",
  {
    intro: t(
      "Before stepping up to the lab bench, pull on safety **goggles**, keep every dish **sterile** so stray germs cannot **contaminate** it, use a **dropper** to add one bead of **stain** onto a glass **slide**, and **magnify** the cells underneath. These ten words name the tools and safety rules of a lab.",
      "走近实验台前，先戴好护目镜（**goggles**），保持器皿无菌（**sterile**）以免病菌污染（**contaminate**），再用滴管（**dropper**）把染色剂（**stain**）滴到载玻片（**slide**）上，放进显微镜放大（**magnify**）观察。这十个词介绍实验室工具与规范。",
    ),
    watchOut: {
      meanings: t(
        "Tell **beaker** (a wide, straight-sided glass cup with a pouring lip) apart from **flask** (a glass bottle with a *narrow neck* you can swirl or plug with a cork).",
        "分清 **beaker**（敞口带倾倒嘴的烧杯）和 **flask**（窄口、便于摇晃或塞软木塞的烧瓶）。",
      ),
      use: t(
        "Tell **sterile** (an adjective meaning completely free of germs) apart from **contaminate** (a verb meaning to spoil something by introducing germs or poison).",
        "分清 **sterile**（形容词，完全无菌）和 **contaminate**（动词，引入病菌或毒物使其受污染）。",
      ),
      spelling: t(
        "Watch **tweezers** (*tw* + *ee* + *-zers*, always plural), **goggles** (double *g* + *-les*), and **contaminate** (*con-tam-i-nate* with *i* before *-nate*).",
        "注意 **tweezers** 的 **ee** 和复数形式、**goggles** 的双写 **g**，以及 **contaminate** 中 **-nate** 前的 **i**。",
      ),
    },
    notes: `
      magnify|a hand lens making an ant look larger|a microscope enlarging a cell four hundred times|a water drop enlarging leaf veins beneath it|magnify makes things look bigger; contaminate makes them dirty or unsafe|magnify 是把物体放大；contaminate 是弄脏污染|contaminate means spoiling something with germs or poison, not making it look larger|contaminate 是用病菌或毒物污染，不是放大视野|classify means sorting things into groups, not making tiny details look larger through a lens|classify 是把事物分类归组，不是用镜片放大细节|mag · ni · fy|short a + ni + -fy ending|短 a 加 ni 和动词后缀 -fy
      beaker|a wide-mouthed glass cup holding fifty milliliters|a wide glass cup with a pouring lip and measurement lines|a wide-lipped glass cup heated over a flame|beaker is a wide cup with a pouring lip; flask has a narrow neck|beaker 是敞口带嘴的烧杯；flask 是窄口烧瓶|flask is a glass bottle with a narrow neck, not a wide-mouthed cup with a pouring lip|flask 是瓶颈狭窄的烧瓶，不是敞口带倾倒嘴的烧杯|dropper is a tiny tube with a rubber bulb for single drops, not a wide cup holding fifty milliliters|dropper 是逐滴加液的滴管，不是能盛五十毫升液体并加热的烧杯|beak · er|ea saying long e + k + -er|发长 e 的 ea 加 k 和 -er
      dropper|a tube adding iodine one drop at a time|a tool with a rubber bulb squeezed gently|a small tube placing one drop of pond water on glass|dropper adds one drop at a time; tweezers pick up tiny solids|dropper 用来逐滴加液体；tweezers 用来夹取微小固体|tweezers is a two-armed tool for picking up solid bits, not a bulb tube for single liquid drops|tweezers 是夹取微小固体的镊子，不是挤橡胶头逐滴加液体的滴管|beaker is a wide glass cup for pouring, not a small bulb tube for single drops|beaker 是宽口烧杯，不是逐滴加碘液或池水的滴管|drop · per|dr blend, short o, double p, and -er|dr 连缀、短 o、双写 p 加 -er
      stain|blue dye making clear cells visible|coloring dye turning each nucleus dark purple|coloring dye making transparent cells stand out|stain colors clear cells; slide is the glass sheet holding them|stain 是给细胞上色的染色剂；slide 是托住样本的载玻片|slide is a thin glass sheet holding a sample, not a drop of coloring dye|slide 是玻璃载玻片，不是滴上去让细胞显色的染料|dropper is the bulb tube used to add drops, not the colored dye itself|dropper 是滴加液体的工具滴管，不是让细胞核变紫的染色剂本身|stain|st blend + ai saying long a + n|st 连缀加发长 a 的 ai 和 n
      sterile|germ-free surgical tools used in an operation|a wrapped bandage kept completely free of germs|lab dishes heated to eliminate every germ|sterile means completely free of germs; toxic means poisonous and harmful|sterile 是完全无菌安全；toxic 是有毒有害|toxic means poisonous and harmful to living things, the exact opposite of clean, germ-free medical tools or bandages|toxic 指有毒有害，与彻底无菌安全的医用工具或绷带正相反|porous means full of tiny holes letting liquid pass through, not completely free of germs|porous 指布满透水小孔，不表示完全无菌|ster · ile|st blend + er + -ile ending|st 连缀、er 加结尾 -ile
      goggles|tight-fitting safety glasses worn when mixing chemicals|tight eye protection keeping splashes out|protective glasses pushed up onto a forehead|goggles protect the eyes; tweezers pick up tiny objects|goggles 是保护眼睛的护目镜；tweezers 是夹微小物体的镊子|tweezers is a small tool for picking up tiny things, not tight glasses protecting eyes from splashes|tweezers 是夹微小物体的镊子，不是戴在脸上防飞溅的护目镜|slide is a thin piece of glass under a microscope, not protective glasses worn over the eyes|slide 是显微镜载玻片，不是戴在眼前的安全护目镜|gog · gles|short o + double g + -les|短 o、双写 g 加 -les
      contaminate|bare hands introducing germs to a sample|a leaking pipe making drinking water unsafe|a sneeze adding germs to a lab dish|contaminate adds germs or poison; purify removes germs to make safe|contaminate 是引入病菌污染；purify 是杀菌净化|magnify means making something look bigger, not making a sample or water dirty and unsafe|magnify 是放大图像，不是把样本或饮用水弄脏污染|purify means making something completely clean and germ-free, the exact opposite of dirtying it with germs|purify 是彻底净化杀菌，与带入病菌污染正相反|con · tam · i · nate|con- + tam + i + -nate with silent e|con- 加 tam、i 和带 e 的 -nate
      tweezers|a two-armed tool lifting a leaf without tearing it|a tiny pinching tool pulling out a splinter|a fine gripping tool holding a tiny seed|tweezers pick up tiny solid objects; dropper moves liquid drops|tweezers 用来夹取微小固体；dropper 用来吸滴液体|dropper is a bulb tube for liquid drops, not a two-armed pinching tool for splinters or seeds|dropper 是滴加液体的滴管，不是拔木刺或夹种子的镊子|goggles are protective glasses for the eyes, not a small pinching tool held in your fingers|goggles 是护目镜，不是夹取树叶或种子的工具|twee · zers|tw blend + double e + -zers|tw 连缀、双写 e 加 -zers
      flask|a narrow-necked glass bottle for swirling liquids|a glass bottle with a cork stuck in its thin neck|a narrow-necked round glass bottle heated in a lab|flask has a narrow neck; beaker is a wide cup with a pouring lip|flask 是窄口烧瓶；beaker 是宽口烧杯|beaker is a wide, straight-sided glass cup with a pouring lip, not a bottle with a thin neck you can cork or swirl|beaker 是宽口烧杯，没有细窄瓶颈可塞软木塞或摇晃液体|slide is a flat thin sheet of glass, not a round narrow-necked bottle holding liquid|slide 是扁平玻璃载玻片，不是装液体加热的窄口瓶|flask|fl blend, short a, and sk blend|fl 连缀、短 a 和结尾 sk
      slide|a thin glass sheet holding a drop of pond water|a flat glass holder slipped under a microscope lens|a labeled glass sheet holding a microscope sample|slide is the flat glass holder; stain is the coloring dye|slide 是托住样本的玻璃载玻片；stain 是染色剂|stain is a coloring dye added to a sample, not the thin piece of glass slipped under a microscope lens|stain 是染色剂液体，不是推到显微镜镜头下的薄玻璃片|flask is a narrow-necked glass bottle, not a flat thin glass sheet holding a drop under a lens|flask 是窄口玻璃瓶，不是放在显微镜镜头下的载玻片|slide|sl blend + silent e making long i|sl 连缀加让 i 读长音的词尾 e
    `,
  },
);

const livingThings = batch(
  "words-for-how-living-things-work",
  ["Words for How Living Things Work", "描述生物如何生存的词"],
  ["how living things grow, feed and stay healthy", "生物如何生长、获取养分和保持健康"],
  `
  benefit|something good that helps|益处|One ___ of exercise is a stronger heart.|Bees are a great ___ to farmers because they help crops grow.|The new park is a ___ to the whole town.|dilemma,constraint|benefits
  harmful|causing damage or hurt|有害的|Some bacteria are ___ and cause sickness.|Smoke is ___ to your lungs.|Too much sun is ___ to your skin.|sterile,abundant
  infect|to pass a germ into a body or a wound|感染|A dirty needle can ___ a cut.|Cover the wound so that germs do not ___ it.|The virus can ___ many people in a crowded room.|multiply,resist|infected
  multiply|to grow quickly in number|大量繁殖，成倍增加|Bacteria ___ quickly in number in warm, wet places.|In one night, the spots of mold seemed to ___ across the bread.|If you leave food out, the germs on it will ___ rapidly.|consist,obtain|multiplies
  consist|to be made up of (used with of)|由……组成|Our bodies ___ of trillions of cells.|Bread dough can ___ of just flour, water, salt and yeast.|The team will ___ of five players and a coach.|obtain,divide|consists
  reproduce|to make young of the same kind|繁殖|Plants ___ by making seeds for new plants.|Some animals ___ and have young only once a year.|Yeast can ___ by budding off a small new cell.|thrive,consist|reproduces
  divide|to split into parts|分裂，分开|One cell can ___ into two new cells.|We had to ___ the class into four teams.|The river will ___ into two streams at the big rock.|multiply,consist|divides
  resist|to fight off, or not be harmed by|抵抗|A healthy body can ___ many germs.|Some kinds of wheat ___ disease better than others.|Washing helps your skin ___ infection.|infect,obtain
  thrive|to grow strong and healthy|茁壮成长|Cactuses ___ in hot, dry places.|The puppy began to ___ once it had good food.|Mold will ___ in a damp, dark cupboard.|resist,divide|thrives
  obtain|to get|获得|Plants ___ water through their roots.|You must ___ permission before you visit the lab.|Animals ___ energy from the food they eat.|consist,resist
  `,
  "context-clues",
  {
    intro: t(
      "Living things **consist** of tiny cells that **obtain** food, **divide** to make new cells, and **reproduce** so a species continues—while healthy bodies **resist** **harmful** germs before they can **infect** a wound and **multiply**. These ten words describe how organisms grow and survive.",
      "生物体由无数细胞组成（**consist**），它们获取（**obtain**）养分、分裂（**divide**）增殖并繁殖（**reproduce**）后代，同时健康的身体会抵抗（**resist**）有害（**harmful**）病菌，防止其感染（**infect**）伤口并大量繁殖（**multiply**）。这十个词讲述生命的运转。",
    ),
    watchOut: {
      meanings: t(
        "Tell **reproduce** (create new young of the same kind, through seeds, babies, or budding) apart from **thrive** (grow strong and healthy yourself) and **multiply** (increase rapidly in number).",
        "分清 **reproduce**（繁育同种后代）、**thrive**（自身茁壮成长）和 **multiply**（数量迅速成倍增加）。",
      ),
      use: t(
        "Remember that **consist** always pairs with *of* (*consist of cells*), while **divide** pairs with *into* (*divide into two parts*) and **obtain** takes a direct object (*obtain water*).",
        "注意搭配：**consist** 必须接 *of*（由……组成），**divide** 常接 *into*（分成……），而 **obtain** 直接接宾语（获得……）。",
      ),
      spelling: t(
        "Watch **benefit** (*ben-e-fit*, single *t*), **multiply** (*mul-ti-ply* with *-ply*), and **thrive** (*thr* blend + silent *e* making long *i*).",
        "注意 **benefit** 结尾单个 **t**、**multiply** 结尾的 **-ply**，以及 **thrive** 开头三字母连缀 **thr**。",
      ),
    },
    notes: `
      benefit|a stronger heart as a good result of exercise|bees helping farmers by pollinating crops|a new park helping the whole town|benefit is something helpful; constraint is a limit|benefit 是有益的好处；constraint 是限制条件|dilemma is a hard choice between two tough options, not a helpful advantage|dilemma 是左右为难的困境，不是带来好处的益处|constraint is a limit restricting what you can do, the opposite of a helpful advantage|constraint 是限制条件，与带来助益的好处相反|ben · e · fit|short e + e + fit (single t)|短 e 加 e 和单 t 的 fit
      harmful|bacteria that cause sickness|smoke damaging the lungs|too much sun damaging skin|harmful causes damage or hurt; sterile means completely germ-free|harmful 是有害伤人的；sterile 是无菌安全的|sterile means completely free of germs and safe, the opposite of causing sickness or damage|sterile 指无菌安全，与致病伤人正相反|abundant means plentiful in supply, not causing damage or hurt|abundant 指丰沛充足，不表示造成伤害|harm · ful|harm + -ful (single l)|harm 加单 l 后缀 -ful
      infect|a dirty needle passing germs into a cut|germs entering an uncovered wound|a virus spreading into people in a crowded room|infect passes germs into a body; resist fights germs off|infect 是病菌侵入感染；resist 是抵抗病菌|multiply means increasing in number (intransitive), not passing a germ into a wound or person|multiply 指数量增加（不及物），不接伤口或人作宾语表示“感染”|resist means fighting off disease, the exact opposite of passing germs into a body|resist 是抵御抗拒病菌，与病菌侵入感染正相反|in · fect|in- + short e + ct blend|in- 加短 e 和 ct
      multiply|bacteria growing rapidly in number in warm damp spots|mold spots increasing rapidly overnight on bread|germs increasing rapidly on food left out|multiply grows rapidly in number; obtain gets something|multiply 是数量迅速成倍增长；obtain 是获得某物|consist means being made up of parts (with "of"), not increasing quickly in number|consist 必须搭配 of 表示“由……组成”，不是数量迅速翻倍|obtain means getting a needed item (taking a direct object), not growing quickly in number|obtain 需要接宾语表示“获得某物”，不是细菌霉菌数量暴增|mul · ti · ply|short u + ti + -ply saying long i|短 u、ti 加读长 i 的 -ply
      consist|bodies made up of trillions of cells|bread dough made up of four basic ingredients|a team made up of five players and a coach|consist pairs with "of" to name parts; divide splits into parts|consist 配 of 表示“由……组成”；divide 是分裂分开|obtain means getting something directly (without "of"), not being made up of parts|obtain 直接接宾语表示“获得”，不配 of 表示“由……组成”|divide means splitting into pieces (with "into"), not being made up of parts (with "of")|divide 配 into 表示“分成几份”，不配 of 表示“由……构成”|con · sist|con- + short i + st blend|con- 加短 i 和 st
      reproduce|plants making seeds for new plants|animals having young once a year|yeast budding off a small new cell|reproduce creates new young; thrive grows strong yourself|reproduce 是繁殖后代；thrive 是自身茁壮成长|thrive means growing strong and healthy yourself, not making seeds, having young, or budding off a new cell|thrive 指自身长得健壮，不特指结籽、产崽或出芽繁殖后代|consist means being made up of parts (with "of"), not creating young of the same kind|consist 需配 of 表示“由……组成”，不是生物繁殖后代|re · pro · duce|re- + pro + soft c (/s/) + silent e|re-、pro 加读 /s/ 的 c 和词尾 e
      divide|one cell splitting into two new cells|splitting a class into four teams|a river splitting into two streams at a rock|divide splits into parts; multiply grows in number|divide 是把整体分成几份；multiply 是数量倍增|multiply means growing rapidly in number, not splitting one whole into two or four parts with "into"|multiply 是数量增加，不配 into 表示把一个整体拆分成几份|consist means being made up of parts (with "of"), not splitting into separate groups or streams|consist 配 of 表示“由……组成”，不配 into 表示“分裂/分开”|di · vide|di + long i + silent e|di 加长 i 和词尾 e
      resist|a healthy body fighting off germs|wheat varieties fighting off disease|skin kept safe from infection by washing|resist fights off harm; infect passes germs in|resist 是抵抗击退病菌；infect 是被病菌感染|infect means passing germs into a body, the exact opposite of fighting off germs or disease|infect 是让病菌侵入感染，与抵抗抵御正相反|obtain means getting something you want, the opposite of fighting off germs or infection|obtain 是获取想要的东西，与抵抗疾病和感染正相反|re · sist|re- + s saying /z/ + ist|re- 加读 /z/ 的 s 和 ist
      thrive|cactuses growing strong in hot dry deserts|a puppy growing healthy on good food|mold growing strongly in a damp dark cupboard|thrive grows strong and healthy; resist fights off harm|thrive 是茁壮成长；resist 是抵抗|resist means fighting off a threat (taking a direct object), not growing strong in a habitat|resist 需接宾语表示“抵抗某物”，不是在适宜环境中茁壮生长|divide means splitting into parts, not growing strong and healthy|divide 是分裂分开，不是长得健壮茂盛|thrive|thr three-letter blend + silent e making long i|三字母连缀 thr 加长 i 和词尾 e
      obtain|plants getting water through their roots|getting permission before visiting a lab|animals getting energy from food|obtain means to get something; resist fights something off|obtain 是取得获得；resist 是抵御抗拒|consist means being made up of parts (with "of"), not getting water, permission, or energy|consist 需配 of 表示“由……组成”，不能直接接水、许可或能量表示“获得”|resist means fighting off harm, the opposite of getting needed water, permission, or energy|resist 是抵御抗拒，与获取水分、许可或能量正相反|ob · tain|ob- + ai saying long a + n|ob- 加发长 a 的 ai 和 n
    `,
  },
);

const starsAndSky = batch(
  "words-of-stars-and-the-sky",
  ["Words of Stars and the Sky", "星星与天空的词"],
  ["the stars, the moon and the night sky", "星星、月亮和夜空"],
  `
  meteor|a streak of light made by a rock burning up in the air|流星|We saw a ___ flash across the sky and disappear.|Make a wish when you see a fiery ___ streak across the night sky.|A ___ burns up high above the ground before it can land.|satellite,nebula|meteors
  satellite|an object that travels around a planet|卫星|The moon is Earth's natural ___.|A weather ___ sends pictures of the clouds back to Earth.|The ___ goes around Earth every ninety minutes.|meteor,twilight|satellites
  eclipse|a time when one object in space blocks the light of another|食（日食、月食）|During a solar ___, the moon blocks the sun.|The sky went dark at noon during the ___.|People gathered to watch the moon slide in front of the sun in the ___.|phase,crescent
  lunar|of the moon|月球的|The astronauts walked on the dusty ___ surface.|A ___ calendar follows the changing moon.|The ___ rover drove across the moon's gray dust.|rural,dense
  crescent|the curved shape of a thin slice of moon|新月形|Tonight the moon is only a thin ___.|The ___ moon looked like a curved fingernail in the sky.|Her necklace was shaped like a silver ___.|phase,twilight
  horizon|the line where the sky seems to meet the land or sea|地平线|The sun sank slowly below the ___.|A ship appeared on the ___ and sailed toward us.|Mountains rose along the ___ to the west.|twilight,eclipse
  phase|one of the shapes the moon seems to have as it changes|月相|The full moon is the ___ when we see its whole face.|Each changing shape, or ___, of the moon lasts a few days.|In its new ___, the moon cannot be seen at all.|crescent,eclipse|phases
  twilight|the dim light just after sunset or before sunrise|暮光，曙光|In the dim ___, the first stars began to appear.|Bats fly out of the cave at evening ___.|The sky turned purple in the dim evening ___.|crescent,horizon
  observatory|a building with a large telescope for studying the sky|天文台|The ___ on the mountain has a dome that opens at night.|Scientists at the ___ watched the comet for weeks.|We visited the ___ to look through its giant telescope.|satellite,nebula
  nebula|a cloud of gas and dust in space where stars can form|星云|New stars are born inside a glowing ___.|The telescope showed a pink ___ of gas and dust.|That ___ of gas and dust is so big that our whole solar system could fit inside it.|meteor,observatory
  `,
  "context-clues",
  {
    intro: t(
      "At evening **twilight**, the roof of the mountain **observatory** rolls open above the western **horizon** so astronomers can watch a thin **crescent** moon, catch a brief **meteor** streaking overhead, and photograph a distant glowing **nebula**. These ten words describe the night sky.",
      "傍晚暮光（**twilight**）降临时，山顶天文台（**observatory**）的圆顶在西边地平线（**horizon**）上方缓缓打开，天文学家观测细弯的新月（**crescent**）、划过的流星（**meteor**）和遥远发光的星云（**nebula**）。这十个词描绘夜空奇观。",
    ),
    watchOut: {
      meanings: t(
        "Tell **eclipse** (a rare event when one body blocks the light of another, like the moon blocking the sun) apart from **phase** (one of the regular monthly shapes the moon cycles through, like full or new).",
        "分清 **eclipse**（一个天体挡住另一个天体光线的日食或月食）和 **phase**（月亮每月规律循环的盈亏月相）。",
      ),
      use: t(
        "Tell **meteor** (a rock burning up briefly in Earth's air as a flash of light) apart from **satellite** (an object orbiting a planet again and again, like the moon or a weather spacecraft).",
        "分清 **meteor**（在大气层中瞬间燃烧划过的流星）和 **satellite**（长期绕行星运行的天然或人造卫星）。",
      ),
      spelling: t(
        "Watch **satellite** (single *t*, double *l* + *-ite*), **crescent** (*sc* saying /s/ + *-ent*), and **eclipse** (*e-* + *cl* + *-ipse*).",
        "注意 **satellite** 的单 **t** 双 **l**、**crescent** 中发 /s/ 的 **sc**，以及 **eclipse** 结尾的 **-ipse**。",
      ),
    },
    notes: `
      meteor|a brief flash of light streaking across the sky|a fiery streak crossing the night sky for a wish|a space rock burning up high in the air before landing|meteor burns up briefly in Earth's air; satellite orbits a planet|meteor 是在大气层燃烧划过的流星；satellite 是绕行星运行的卫星|satellite is an object orbiting a planet steadily, not a rock burning up in a quick flash across the sky|satellite 是持续绕行星运行的卫星，不是划过天空瞬间烧尽的流星|nebula is a vast cloud of gas and dust in deep space, not a burning streak in Earth's atmosphere|nebula 是深空中的庞大气体尘埃星云，不是在大气层燃烧的流星|me · te · or|long e in me + te + -or|me 读长 e 加 te 和 -or
      satellite|the moon traveling naturally around Earth|a weather craft sending cloud pictures from orbit|an object circling Earth every ninety minutes|satellite orbits a planet; meteor burns up in a flash|satellite 是绕行星公转的卫星；meteor 是瞬间划过的流星|meteor is a rock burning up briefly in the air, not an object circling Earth every ninety minutes or sending weather photos|meteor 是一闪而逝的流星，不是长期绕地球运行或传回气象照片的卫星|twilight is the dim light around sunset or sunrise, not an object orbiting a planet|twilight 是日出日落时的微光，不是绕行星运行的物体|sat · el · lite|single t, double l, and silent e in -lite|单写 t、双写 l 加带 e 的 -lite
      eclipse|the moon blocking the sun during a solar event|the sky going dark at noon when sunlight is blocked|people watching the moon slide in front of the sun|eclipse blocks another body's light; phase is a regular moon shape|eclipse 是天体遮挡光线的日食月食；phase 是月亮常规的月相|phase is one of the moon's regular monthly shapes, not an event where the moon blocks the sun and darkens noon|phase 是月亮每月的正常月相变化，不是正午遮住太阳让天空变暗的日食|crescent is the thin curved shape of a slice of moon, not the event of blocking the sun's light|crescent 是弯月形状，不是遮蔽阳光的食现象|e · clipse|e + cl blend + -ipse with silent e|e 加 cl 连缀和带 e 的 -ipse
      lunar|the dusty surface of the moon walked by astronauts|a calendar tracking the changing moon|a moon rover driving across gray dust|lunar means of the moon; rural means of the countryside|lunar 是月球的；rural 是乡村的|rural means of the countryside on Earth, not belonging to the moon|rural 指地球上的乡村，不指月球|dense means tightly packed with heavy mass, not belonging to the moon|dense 指密度大，不表示“月球的”|lu · nar|long u in lu + -nar ending|lu 读长 u 加结尾 -nar
      crescent|a thin curved slice of moon tonight|a moon shaped like a curved fingernail|a silver necklace shaped like a thin curved moon|crescent is specifically a thin curved slice; phase is any moon shape|crescent 特指细弯的新月形；phase 泛指任何月相|phase refers to any of the moon's shapes including full or half, not specifically a thin curved fingernail shape|phase 泛指满月新月等所有月相，不特指细弯如指甲的新月形状|twilight is dim light after sunset or before sunrise, not a curved shape of the moon or a necklace|twilight 是晨昏微光，不是弯月形状|cres · cent|cr blend + sc saying /s/ + -ent|cr 连缀、读 /s/ 的 sc 加 -ent
      horizon|the line below which the sun sinks slowly|the distant sea line where an approaching ship appears|the western skyline along which mountains rise|horizon is the sky-meets-earth line; twilight is dim dusk or dawn light|horizon 是天地交界的地平线；twilight 是暮光曙光|twilight is dim light in the air at dusk or dawn, not the line where ships appear or the sun sinks below|twilight 是昏暗的天光，不是太阳沉落或船只出现的地平线|eclipse is one space body blocking another's light, not the line where sky meets land or sea|eclipse 是日食月食，不是天地相接的地平线|ho · ri · zon|ho + long i in ri + -zon|ho 加读长 i 的 ri 和 -zon
      phase|the full-moon stage showing the whole face|each changing monthly shape lasting a few days|the new-moon stage when the moon cannot be seen|phase is any regular stage of the moon's shape; crescent is one curved slice|phase 泛指月亮盈亏的各个月相阶段；crescent 只指弯月形|crescent is only one thin curved shape, not the full moon, new moon, or general term for every changing stage|crescent 只指细弯新月，不能用来指满月或完全看不见的新月阶段|eclipse is an event where one body blocks another's light, not the moon's regular cycle of shapes|eclipse 是天体遮光的食现象，不是月亮常规的盈亏周期阶段|phase|ph saying /f/ + silent e making long a|发 /f/ 的 ph 加发长 a 的 ase
      twilight|dim dusk light as the first stars appear|dim evening light when bats fly from caves|dim evening light turning the sky purple|twilight is dim light after sunset or before sunrise; horizon is the sky-earth line|twilight 是晨昏微光；horizon 是地平线|crescent is a curved slice shape of the moon, not the dim light of dusk or dawn|crescent 是弯月形状，不是日落后的微暗天光|horizon is the distant line where sky meets land, not the dim evening light when bats fly out|horizon 是远处的地平线，不是蝙蝠飞出洞穴时的傍晚暮光|twi · light|tw blend, long i, and igh saying long i|tw 连缀、长 i 加发长 i 的 igh
      observatory|a mountain dome opening at night for sky study|a research building where scientists track a comet|a building housing a giant telescope for visitors|observatory is a telescope building; nebula is a space cloud|observatory 是装有望远镜的天文台建筑；nebula 是星云|satellite is an object orbiting a planet in space, not a domed building on a mountain you can visit|satellite 是太空中的卫星，不是山顶上带圆顶、可参观的天文台建筑|nebula is a giant cloud of gas and dust in space, not a building housing a telescope|nebula 是宇宙中的气体尘埃云，不是科学家观测彗星的建筑|ob · ser · va · to · ry|ob- + ser + va + -tory|ob- 加 ser、va 和 -tory
      nebula|a glowing space cloud where new stars are born|a pink space cloud of gas and dust seen by telescope|a vast gas-and-dust cloud larger than our solar system|nebula is a vast space cloud of gas and dust; meteor is a tiny burning rock|nebula 是孕育恒星的庞大星云；meteor 是微小流星|meteor is a small rock burning up briefly in Earth's air, not a vast space cloud of gas and dust where stars form|meteor 是划过大气层的小流星，不是孕育恒星的庞大气体尘埃云|observatory is a building with a telescope on Earth, not a glowing cloud of gas and dust in space|observatory 是地球上的天文台建筑，不是望远镜里看到的粉色星云|neb · u · la|short e + u + -la ending|短 e 加 u 和结尾 -la
    `,
  },
);

const spaceExploration = batch(
  "words-of-space-exploration",
  ["Words of Space Exploration", "太空探索的词"],
  ["exploring space", "太空探索"],
  `
  launch|to send a rocket or spacecraft into the air|发射|They will ___ the rocket at dawn if the weather is clear.|Engineers waited for calm winds to ___ the satellite.|The crew watched the team ___ the probe toward Mars.|reinforce,withstand|launched
  rocket|a vehicle pushed upward by burning fuel|火箭|The ___ roared into the sky on a column of fire.|Its fuel burned for two minutes and pushed the ___ high above the clouds.|A tall ___ stood on the launch pad, ready to fly.|capsule,rover
  spacecraft|any vehicle built to travel in space|航天器|The ___ carried three astronauts all the way to the moon.|A ___ needs a heat shield to survive the fall back to Earth.|No person was aboard the ___ that flew past Pluto.|module,rover
  mission|a special job or trip with a goal|任务|The ___ of the trip was to bring moon rocks back to Earth.|The crew trained for two years for their ___.|Each ___ to Mars takes months of travel.|probe,countdown|missions
  probe|a spacecraft with no crew, sent to explore|探测器|An unmanned ___ sent back close-up pictures of Saturn's rings.|The crewless ___ flew past Jupiter and kept going out of the solar system.|Scientists sent a robot ___ to fly past and study the comet.|rover,capsule|probes
  rover|a robot vehicle that drives across another planet or moon|漫游车，巡视器|The ___ rolled across the red dust of Mars on six wheels.|The wheeled ___ drove up to a Martian rock and drilled into it.|Engineers on Earth steered the wheeled ___ around a crater.|probe,rocket
  capsule|the small part of a spacecraft where the crew rides|太空舱|The ___ splashed down in the ocean with the astronauts inside.|Three astronauts squeezed into the tiny crew ___.|A parachute slowed the crew ___ as it fell toward the sea.|module,rocket
  module|one section of a spacecraft or space station that can be joined to others|舱段，模块|A new ___ was joined to the space station.|The lunar ___ landed on the moon while the other part stayed in orbit.|Each separate ___ of the station has its own job, such as sleeping or science.|capsule,mission|modules
  countdown|counting backward to the moment of a launch|倒计时|The ___ reached zero, and the engines fired.|The ___ was stopped at five seconds because of a problem.|Crowds on the beach joined in the ___: three, two, one!|capsule,mission
  weightless|floating, without feeling any weight|失重的|In orbit, astronauts are ___ and float around the cabin.|Being ___ makes it hard to drink from a cup.|The ___ astronaut floated and tied her sleeping bag to the wall.|dense,rigid
  `,
  "context-clues",
  {
    intro: t(
      "As the **countdown** hits zero, engineers **launch** a tall **rocket** carrying a **spacecraft** whose crew rides inside a tiny **capsule**, soon floating **weightless** in orbit while a robot **rover** explores Mars far away. These ten words trace how humans explore space.",
      "倒计时（**countdown**）归零之际，工程师发射（**launch**）高大火箭（**rocket**），将航天器（**spacecraft**）送入太空；宇航员坐在狭小的太空舱（**capsule**）里失重（**weightless**）漂浮，远方的漫游车（**rover**）则在火星表面巡视。这十个词讲述太空探索。",
    ),
    watchOut: {
      meanings: t(
        "Tell **probe** (an uncrewed spacecraft that *flies* through space past planets or comets) apart from **rover** (a wheeled robot vehicle that *drives* across a planet's or moon's surface).",
        "分清 **probe**（飞越行星或彗星的无人太空探测器）和 **rover**（带轮子、在星球表面行驶的巡视漫游车）。",
      ),
      use: t(
        "Tell **capsule** (the small crew cabin that splashes down by parachute) apart from **module** (one joinable section of a larger spacecraft or space station, such as a sleeping or science section).",
        "分清 **capsule**（载人并靠降落伞溅落返回的太空舱）和 **module**（可拼接到空间站或飞船上的功能舱段模块）。",
      ),
      spelling: t(
        "Watch **weightless** (*ei* saying long *a* + silent *gh* + *-less*), **capsule** (*cap-* + *-sule* with silent *e*), and **satellite / spacecraft** (closed compound *space + craft*, no space).",
        "注意 **weightless** 中含 **eigh** 的 *weight*、**capsule** 结尾的 **-sule**，以及合写复合词 **spacecraft**。",
      ),
    },
    notes: `
      launch|sending a rocket into the air at dawn|sending a satellite up in calm winds|sending a probe upward toward Mars|launch sends a craft into space; reinforce makes a structure stronger|launch 是发射升空；reinforce 是加固增强|reinforce means strengthening a structure with extra support, not sending a rocket or satellite skyward|reinforce 是加装支撑加固，不是把火箭或卫星发射升空|withstand means resisting a force without breaking, not sending a craft into the air|withstand 是抵御承受外力，不是发射航天器|launch|au saying /ɔː/ + nch|发 /ɔː/ 音的 au 加 nch
      rocket|a vehicle roaring skyward on a column of fire|a fuel-burning vehicle pushed high above clouds|a tall launch-pad vehicle ready to lift off|rocket is pushed upward by burning fuel; capsule is the small crew cabin|rocket 是靠燃料推升的火箭；capsule 是载人太空舱|capsule is only the small compartment where astronauts ride, not the tall fuel-burning vehicle roaring off a launch pad|capsule 只是宇航员乘坐的小太空舱，不是喷火升空的整枚火箭|rover is a wheeled robot driving on another planet, not a tall vehicle burning fuel on a launch pad|rover 是星球表面行驶的漫游车，不是发射台上的火箭|rock · et|short o + ck + -et ending|短 o、ck 加结尾 -et
      spacecraft|a vehicle carrying three astronauts to the moon|a space vehicle needing a heat shield for reentry|an uncrewed vehicle flying past Pluto|spacecraft is any space-traveling vehicle; module is one joinable section|spacecraft 泛指各类航天器；module 是其中一个可拼接舱段|module is only one joinable section of a larger craft or station, not the whole vehicle flying to the moon or Pluto|module 只是可拼接的单个舱段，不是往返月球或飞掠冥王星的整艘航天器|rover is a wheeled robot that drives on ground, not a vehicle flying to the moon, Pluto, or back through Earth's air|rover 是在地面行驶的漫游车，不能飞往月球、飞掠冥王星或再入大气层|space · craft|compound word: space + craft|合成词：space 加 craft
      mission|a special goal of bringing moon rocks back|a crew's special trip trained for two years|a months-long goal-driven trip to Mars|mission is a goal-driven trip or job; countdown is counting backward to launch|mission 是有明确目标的太空任务；countdown 是发射倒计时|probe is a physical uncrewed spacecraft, not a special goal or trip a crew trains two years for|probe 是实体无人探测器，不是宇航员训练两年去执行的太空任务|countdown is counting backward to zero before launch, not a months-long trip or goal|countdown 是发射前的倒计时，不是耗时数月的火星任务|mis · sion|short i + double s + -ion|短 i、双写 s 加 -ion
      probe|an uncrewed craft photographing Saturn's rings|a crewless craft flying past Jupiter out of the solar system|a robot craft flying past a comet to study it|probe flies uncrewed through space; rover drives on wheels over a planet|probe 是在太空飞行的无人探测器；rover 是在星球表面行驶的漫游车|rover is a wheeled robot that drives across land, not a flying craft passing Saturn's rings, Jupiter, or a comet|rover 是带轮子在地面开的漫游车，不能飞越土星光环、木星或彗星|capsule is a small crew cabin for astronauts, not an uncrewed robot spacecraft flying past distant planets|capsule 是载人太空舱，不是无人深空探测器|probe|pr blend + silent e making long o|pr 连缀加发长 o 的 obe
      rover|a six-wheeled robot rolling across Mars dust|a wheeled robot driving up to drill a Martian rock|a wheeled robot steered around a crater from Earth|rover drives on wheels over a surface; probe flies through space|rover 是带轮子在表面行驶的漫游车；probe 是在太空飞行的探测器|probe is an uncrewed flying spacecraft, not a six-wheeled robot driving across dust and around craters|probe 是飞行探测器，不是靠轮子在火星尘土和陨石坑间行驶的漫游车|rocket is a tall launch vehicle burning fuel, not a wheeled robot steered around craters|rocket 是喷火升空的火箭，不是在火星表面钻岩行驶的轮式车|ro · ver|long o in ro + -ver ending|ro 读长 o 加结尾 -ver
      capsule|a crew cabin splashing down in the ocean|a tiny cabin holding three squeezed astronauts|a crew cabin slowed by a parachute over the sea|capsule is the small crew cabin; module is a joinable station section|capsule 是载人返回的太空舱；module 是空间站拼接舱段|module is a joinable section of a larger station or ship, not the small parachute-slowed crew cabin splashing down|module 是拼接在空间站上的舱段，不是靠降落伞落海的载人太空舱|rocket is the tall fuel-burning booster, not the tiny cabin three astronauts squeeze into|rocket 是巨大的火箭主体，不是三名宇航员挤在里面的小型载人舱|cap · sule|short a + p + -sule with silent e|短 a、p 加带 e 的 -sule
      module|a new section joined to a space station|a lunar landing section separating from the orbiter|one station section dedicated to sleeping or science|module is a joinable spacecraft section; capsule is the small crew cabin|module 是可拼接的功能舱段；capsule 是小型载人返回舱|capsule is specifically the small crew-carrying cabin, not any joinable station section built for sleeping or science|capsule 专指载人返回的小舱，不泛指空间站里分工明确的各拼接舱段|mission is a special trip or goal, not a physical section joined to a space station|mission 是太空任务，不是连接到空间站上的实体舱段|mod · ule|short o + d + -ule with silent e|短 o、d 加带 e 的 -ule
      countdown|counting backward to zero before engines fire|backward seconds halted at five over a problem|beach crowds chanting three, two, one|countdown counts backward to launch; mission is the space trip itself|countdown 是发射倒计时；mission 是太空任务|capsule is the small crew cabin of a spacecraft, not counting backward from five or three to zero|capsule 是太空舱，不是从三、二、一数到零的倒计时|mission is the overall goal-driven space trip, not counting backward in seconds right before ignition|mission 是整趟太空任务，不是点火前按秒倒数|count · down|compound word: count (ou) + down (ow)|合成词：count（ou）加 down（ow）
      weightless|orbiting astronauts floating freely in the cabin|floating without gravity making cup-drinking hard|a floating astronaut tying a sleeping bag to a wall|weightless feels no weight and floats; dense is tightly packed and heavy|weightless 是漂浮失重的；dense 是致密沉重的|dense means tightly packed and heavy for its size, the opposite of floating without feeling weight|dense 指致密沉重，与失重漂浮正相反|rigid means stiff and unable to bend, not floating freely without gravity|rigid 指僵硬不可弯，不是在太空中失重漂浮|weight · less|eigh saying long a + -less|发长 a 的 eigh 加后缀 -less
    `,
  },
);

const ancientGreece = batch(
  "words-of-ancient-greece",
  ["Words of Ancient Greece", "古希腊的词"],
  ["ancient Greece", "古希腊"],
  `
  democracy|government by the people, who vote|民主|In a ___, citizens vote for their leaders.|Athens is famous as the first ___, ruled by voting citizens.|A ___ lets the people decide how they are ruled.|tyrant,assembly
  assembly|a meeting of many people to make decisions|公民大会，议会|Thousands of citizens met in the ___ to vote.|Any citizen could stand up and speak in the lawmaking ___ of Athens.|The ___ voted to build a hundred new ships.|agora,ballot
  acropolis|a high hill in a Greek city with temples on top|卫城|The temples stood on the ___, high above the city.|From the high hilltop ___, you could see the whole city and the sea.|Soldiers could defend the ___ because it sat on a steep hill.|agora,amphitheater
  agora|the open market and meeting place of a Greek city|（古希腊的）广场集市|Farmers sold olives and cheese in the ___.|People met their friends and shared news in the busy open-air market ___.|Shops lined the ___ in the center of town.|acropolis,assembly
  oracle|a priestess people believed spoke for the gods|神谕者，女祭司|The king asked the ___ whether the gods wanted him to go to war.|Travelers climbed the mountain to ask the ___ about the future.|The priestess ___ gave mysterious answers about the future that were hard to understand.|tyrant,athlete
  athlete|a person trained in sports|运动员|Each ___ trained for months before the Olympic Games.|The winning ___ received a crown of olive leaves.|The fastest ___ won the race by a step.|tyrant,oracle|athletes
  column|a tall stone post that holds up a roof|柱子|Each ___ of the temple was carved from white marble.|A broken stone ___ lay on the ground among the ruins.|The tall ___ held up the heavy stone roof.|agora,amphitheater|columns
  amphitheater|a round theater open to the sky, with rows of seats|圆形剧场|The audience sat in the open-air ___ to watch the play.|Rows of stone seats rose around the stage of the ___.|Even a whisper on stage could be heard at the top of the ___.|acropolis,agora
  ballot|a way of voting in secret, or the thing a vote is marked on|选票，投票|Each citizen dropped a ___ into the voting box.|In Athens, a ___ might be a pebble or a piece of pottery.|The secret ___ meant that no one knew how you had voted.|assembly,column|ballots
  tyrant|a ruler who takes all the power and rules cruelly|暴君|The people drove out the ___ who had seized power.|A ___ makes laws without asking anyone.|The cruel ___ punished anyone who spoke against him.|democracy,athlete|tyrants
  `,
  "context-clues",
  {
    intro: t(
      "Below the marble temples of the **acropolis**, shoppers trade olives in the open **agora** before citizens gather in the **assembly** to drop a secret **ballot**—living out Athens's new **democracy** instead of obeying a cruel **tyrant**. These ten words bring ancient Greece to life.",
      "卫城（**acropolis**）大理石神庙下方，人们在露天集市（**agora**）买卖橄榄，随后走进公民大会（**assembly**）投下秘密选票（**ballot**），亲身实践雅典的民主（**democracy**），拒绝受暴君（**tyrant**）奴役。这十个词带你走进古希腊。",
    ),
    watchOut: {
      meanings: t(
        "Tell **acropolis** (the high fortified hilltop topped with temples) apart from **agora** (the open-air market square down in the town center) and **amphitheater** (the round, open-air theater with rising rows of seats).",
        "分清 **acropolis**（城中高处建满神庙的卫城山丘）、**agora**（城中心买卖议事的广场集市）和 **amphitheater**（阶梯式露天圆形剧场）。",
      ),
      use: t(
        "Tell **democracy** (the system of government by voting citizens) apart from **assembly** (the actual meeting where citizens gather to vote) and **ballot** (the pebble, shard, or paper used to cast a secret vote).",
        "分清 **democracy**（公民投票的民主制度）、**assembly**（公民聚在一起表决的大会）和 **ballot**（秘密投票用的选票或石子陶片）。",
      ),
      spelling: t(
        "Watch **amphitheater** (*amphi-* + *ph* saying /f/ + *theater*), **column** (silent *n* after *m*), and **acropolis** (*a-crop-o-lis*, single *c*, single *p*).",
        "注意 **amphitheater** 中的 **ph**、**column** 末尾不发音的 **n**，以及 **acropolis** 的单 **c** 单 **p**。",
      ),
    },
    notes: `
      democracy|a system where citizens vote for leaders|Athens's famous citizen-voted government|government letting people decide how they are ruled|democracy is rule by voting citizens; tyrant is a cruel sole ruler|democracy 是公民投票的民主制；tyrant 是独裁暴君|tyrant is a single cruel ruler who seizes all power, the exact opposite of government by voting citizens|tyrant 是独揽大权、残暴统治的暴君，与公民投票的民主制正相反|assembly is one gathering of citizens to vote, not the whole system of government by the people|assembly 是一次公民表决大会，不是“由人民投票统治”的整套政治制度|de · moc · ra · cy|de + moc + ra + soft c in -cy|de、moc、ra 加读 /s/ 的 -cy
      assembly|thousands of citizens meeting together to vote|a lawmaking gathering where any citizen may speak|a citizen body voting to build a hundred ships|assembly is a decision-making meeting; agora is an open market square|assembly 是表决事务的公民大会；agora 是露天广场集市|agora is the open market square where farmers sell olives and shops stand, not a lawmaking body voting to build ships|agora 是买卖货物的露天市场，不是投票决定造百艘战船的立法大会|ballot is a voting pebble, shard, or slip, not the gathering of thousands of citizens itself|ballot 是投票用的选票或陶片，不是成千上万公民聚集的大会|as · sem · bly|short a, double s, and -bly ending|短 a、双写 s 加结尾 -bly
      acropolis|a high hilltop topped with temples above the city|a high lookout showing the whole city and sea|a steep defensive hilltop inside a Greek city|acropolis is a high temple-topped hill; agora is a town-center market|acropolis 是高踞城上的神庙卫城；agora 是城中集市广场|agora is the flat open market square in town, not a steep high hill topped with temples|agora 是城中心的露天集市，不是建有神庙的险峻山顶|amphitheater is a round open-air theater for plays, not a steep hilltop defended by soldiers|amphitheater 是看戏的圆形剧场，不是居高临下易守难攻的卫城山丘|a · crop · o · lis|a + cr blend + short o + -olis|a、cr 连缀加短 o 和 -olis
      agora|an open market where farmers sell olives and cheese|a busy open-air market where people share news|a town-center square lined with shops|agora is an open market square; acropolis is a high temple hill|agora 是广场集市；acropolis 是高处卫城|acropolis is a steep hilltop with temples high above town, not a shop-lined market selling olives and cheese|acropolis 是山顶卫城，不是摆满商铺、卖橄榄奶酪的露天集市|assembly is a formal voting meeting of citizens, not a shop-lined market square|assembly 是正式表决的公民大会，不是两旁林立商铺的集市|a · go · ra|a + long o in go + -ra|a 加读长 o 的 go 和 -ra
      oracle|a priestess asked whether the gods favor war|a mountain priestess consulted about the future|a priestess giving hard-to-understand prophecies|oracle is a priestess speaking for the gods; tyrant is a cruel ruler|oracle 是传达神谕的女祭司；tyrant 是残暴独裁者|tyrant is a cruel political ruler who seizes power, not a priestess people visit to hear the gods' message|tyrant 是独裁暴君，不是人们爬山求问未来与神意的女祭司|athlete is a person trained in sports, not a priestess giving prophecies about war and the future|athlete 是运动员，不是替神明预言未来的神谕者|or · a · cle|or + a + -cle ending|or 加 a 和结尾 -cle
      athlete|a sports competitor training for the Olympic Games|a victorious sports competitor crowned with olive leaves|the fastest runner winning a race by a step|athlete is a sports competitor; oracle is a priestess|athlete 是运动员；oracle 是神谕者|tyrant is a cruel ruler who seizes power, not a runner or Olympic sports competitor|tyrant 是残暴统治者，不是参加奥运会赛跑的运动员|oracle is a priestess speaking for the gods, not a sports competitor winning a race|oracle 是女祭司，不是参加竞技夺冠的运动员|ath · lete|th digraph + long e + silent e|th 组合加发长 e 的 lete
      column|a tall white-marble temple post|a broken stone post lying among ruins|a tall post holding up a heavy stone roof|column is a tall roof-supporting stone post; amphitheater is a round theater|column 是撑起屋顶的高大石柱；amphitheater 是圆形剧场|agora is an open market square, not a carved marble post holding up a roof|agora 是露天市场，不是雕有纹饰、撑起石顶的柱子|amphitheater is a round open-air theater, not a single stone post carved from marble|amphitheater 是整座圆形剧场，不是单根大理石柱子|col · umn|short o + um + silent n at the end|短 o、um 加末尾不发音的 n
      amphitheater|an open-air round theater where audiences watch plays|a theater with rising rows of stone seats around a stage|a round theater whose stage acoustics carry a whisper|amphitheater is a round open-air theater; acropolis is a temple hilltop|amphitheater 是露天圆形剧场；acropolis 是神庙卫城|acropolis is a high hilltop topped with temples, not a round theater with rising rows of seats around a stage|acropolis 是山顶卫城，不是围绕舞台层层升起石座的剧场|agora is an open market square for shops, not a round theater built for audiences to hear plays|agora 是集市广场，不是供观众看戏、声音能传到最高排的圆形剧场|am · phi · the · a · ter|am + ph saying /f/ + theater|am 加发 /f/ 的 ph 和 theater
      ballot|a vote dropped into a voting box|an Athenian pebble or pottery shard used to vote|a secret vote hiding how each person chose|ballot is the vote token or secret voting method; assembly is the meeting|ballot 是选票或秘密投票方式；assembly 是公民大会|assembly is the whole gathering of citizens meeting together, not a pebble or slip dropped into a box|assembly 是整场公民集会，不是投进投票箱里的选票、石子或陶片|column is a tall stone post supporting a roof, not a secret vote cast by citizens|column 是撑起屋顶的石柱，不是公民投下的秘密选票|bal · lot|short a + double l + -ot ending|短 a、双写 l 加 -ot
      tyrant|a power-seizing ruler driven out by the people|an unchecked ruler making laws without asking anyone|a cruel ruler punishing anyone who speaks out|tyrant is a cruel absolute ruler; democracy is rule by voting citizens|tyrant 是独裁暴君；democracy 是公民民主制|democracy is government by voting citizens, the exact opposite of one cruel ruler who asks no one|democracy 是公民投票治理的民主制，与独断专行的暴君正相反|athlete is a person trained in sports, not a cruel ruler who seizes power and punishes critics|athlete 是运动员，不是夺权专制的暴君|ty · rant|long i sound in ty + -rant ending|ty 读长 i 加结尾 -rant
    `,
  },
);

const greekIdeas = batch(
  "words-of-greek-ideas-and-learning",
  ["Words of Greek Ideas and Learning", "古希腊思想与学问的词"],
  ["the ideas and learning of the Greeks", "古希腊人的思想和学问"],
  `
  logic|careful thinking that follows reasons step by step|逻辑|Using step-by-step ___, she worked out that the thief must have left by the window.|Each step of his ___ followed from the one before it.|The puzzle can be solved with ___, not with luck.|principle,inquiry
  debate|a discussion in which people argue for different sides|辩论|The class held a ___ about whether homework should be banned.|Each side had three minutes to speak in the ___.|After both sides argued in a long ___, the council voted.|lecture,inquiry|debates
  geometry|the math of shapes, lines and spaces|几何|In ___, we learned how to measure the corners of shapes.|Builders used ___ to make the temple's corners square.|Triangles and circles are part of ___.|logic,principle
  academy|a school for higher learning|学院|Students came from far away to study at Plato's ___.|The ___ taught math, music and science.|She studied dance at a famous ___ in the city.|lecture,debate
  lecture|a talk given to teach a group|讲座，讲课|The professor gave a ___ about the stars.|Students took notes during the teacher's long ___.|The teaching ___ lasted an hour, and then we asked questions.|debate,academy|lectures
  mathematician|a person who is an expert in math|数学家|Pythagoras was a ___ who studied triangles.|The ___ solved the hard problem with nothing but numbers.|A ___ might spend years proving one idea about numbers.|physician,astronomer
  physician|a doctor|医生|Hippocrates was a Greek ___ who studied illness.|The ___ listened to the patient's heart.|If your fever gets worse, call a ___.|mathematician,astronomer
  astronomer|a scientist who studies the stars and planets|天文学家|The ___ watched the planets through a telescope.|A Greek ___ worked out the size of Earth from shadows.|The ___ made a map of the stars.|physician,mathematician|astronomers
  inquiry|a careful search for facts or answers|探究，调查|Science begins with ___: asking questions and looking for answers.|Her careful ___ into the old coins took months.|The official ___ found out what had caused the fire.|debate,logic
  principle|a basic rule or truth that other ideas are built on|原理，原则|A basic ___ of science is that results must be tested.|Fairness is a basic ___ of democracy.|The ___ of the lever explains how a small push can lift a heavy load.|logic,lecture|principles
  `,
  "context-clues",
  {
    intro: t(
      "At Plato's **academy**, students listened to a morning **lecture**, joined a lively afternoon **debate**, and used step-by-step **logic** and **geometry** alongside the **inquiry** of a **physician** or **astronomer**. These ten words trace the ideas and scholarship of ancient Greece.",
      "在柏拉图的学院（**academy**）里，学生上午听讲课（**lecture**），下午展开辩论（**debate**），用严密的逻辑（**logic**）与几何（**geometry**）思考问题，也像医生（**physician**）和天文学家（**astronomer**）一样潜心探究（**inquiry**）。这十个词讲述古希腊学问。",
    ),
    watchOut: {
      meanings: t(
        "Tell **debate** (two sides arguing *against* each other on an issue) apart from **lecture** (one teacher giving an educational talk to a group) and **inquiry** (a careful search for facts or causes).",
        "分清 **debate**（双方各执一词的辩论）、**lecture**（老师面向听众的单向讲课或讲座）和 **inquiry**（追问事实与原因的探究调查）。",
      ),
      use: t(
        "Tell **physician** (a medical doctor who treats illness) apart from **mathematician** (a numbers and shapes expert) and **astronomer** (a scientist studying stars and planets).",
        "分清 **physician**（治病救人的医生）、**mathematician**（数学家）和 **astronomer**（研究星辰行星的天文学家）。",
      ),
      spelling: t(
        "Watch **physician** (*ph* saying /f/ + *-cian*), **principle** (ends in *-ple* for a rule, not *principal* for a school head), and **geometry** (*geo-* + *-metry*).",
        "注意 **physician** 中的 **ph** 与 **-cian**、**principle** 结尾的 **-ple**（别写成校长 *principal*），以及 **geometry**（*geo* 加 *metry*）。",
      ),
    },
    notes: `
      logic|step-by-step reasoning solving how a thief left|reasoning where each step follows the last|solving a puzzle by reasoning instead of luck|logic is step-by-step reasoning; principle is one basic rule|logic 是步步推导的逻辑推理；principle 是单条基本原则|principle is one countable basic rule or truth, not uncountable step-by-step reasoning|principle 是单条基本原则或原理，不是不可数的逻辑推理过程|inquiry is a search for facts or answers, not the step-by-step reasoning linking clues together|inquiry 是收集事实的调查探究，不是环环相扣的逻辑推演|log · ic|short o + soft g (/dʒ/) + -ic|短 o、读 /dʒ/ 的 g 加 -ic
      debate|a class discussion arguing both sides of banning homework|a timed discussion where each side gets three minutes|two sides arguing at length before a council votes|debate has opposing sides arguing; lecture is one teacher speaking|debate 是双方辩论；lecture 是单人讲授讲座|lecture is a teaching talk given by one speaker, not two opposing sides arguing before a vote|lecture 是主讲人单向授课，不是正反双方轮流辩论|inquiry is a fact-finding search, not a structured argument between two opposing sides|inquiry 是查明事实的调查，不是正反两方各自发言的辩论|de · bate|de- + long a + silent e|de- 加发长 a 的 bate
      geometry|math measuring corners of shapes|math used to make temple corners square|the branch of math studying triangles and circles|geometry is math of shapes and spaces; logic is general reasoning|geometry 是研究图形与空间的几何学；logic 是一般逻辑推理|logic is step-by-step reasoning in any field, not specifically the math of triangles, circles, and square corners|logic 是通用逻辑思维，不特指研究三角形、圆形和直角的几何学|principle is a basic rule or truth, not the school math subject of shapes, lines, and corners|principle 指基本原理原则，不是研究形状与线条的几何学科|ge · om · e · try|soft g (/dʒ/) + geo- (earth) + -metry|读 /dʒ/ 的 g 加 geo- 和 -metry
      academy|Plato's famous school for higher learning|a school teaching math, music, and science|a famous city school for studying dance|academy is a school for higher learning; lecture is one teaching talk|academy 是高等学院学校；lecture 是单场讲座|lecture is a single spoken teaching talk, not a school building or institution where students study many subjects|lecture 是一场讲课，不是学生远道而来求学的学院机构|debate is an argument between sides, not a school that teaches math, music, or dance|debate 是一场辩论，不是教授数学、音乐或舞蹈的学院|a · cad · e · my|a + cad + e + -my|a 加 cad、e 和 -my
      lecture|a professor's teaching talk about stars|a long teaching talk where students take notes|an hour-long teaching talk followed by questions|lecture is a teaching talk by one speaker; debate is two sides arguing|lecture 是单人主讲的讲座；debate 是双方辩论|debate is an argument between opposing sides, not a single professor's teaching talk with note-taking|debate 是正反双方辩论，不是教授面向听众讲授并记笔记的讲座|academy is the school itself, not a one-hour talk given by a professor|academy 是学院机构本身，不是持续一小时的课堂讲座|lec · ture|short e + c + -ture ending|短 e、c 加结尾 -ture
      mathematician|Pythagoras studying triangles|an expert solving hard problems with numbers alone|an expert spending years proving a number idea|mathematician is a math expert; astronomer studies stars and planets|mathematician 是数学家；astronomer 是天文学家|physician is a medical doctor treating illness, not an expert in triangles and numbers|physician 是治病救人的医生，不是研究三角形和数字的数学家|astronomer is a scientist studying stars and planets, not someone solving pure number problems|astronomer 是研究星辰的天文学家，不是专攻纯数字证明的数学家|math · e · ma · ti · cian|math + e + ma + -tician|math 加 e、ma 和 -tician
      physician|Hippocrates studying illness in Greece|a medical doctor listening to a patient's heart|a medical doctor called when a fever worsens|physician is a medical doctor; astronomer studies stars|physician 是医生；astronomer 是天文学家|mathematician is an expert in numbers and shapes, not a doctor treating fever or listening to hearts|mathematician 是数学家，不是听诊心脏、看发烧的医生|astronomer is a scientist studying stars and planets, not a medical doctor|astronomer 是天文学家，不是研究疾病、给病人看病的医生|phy · si · cian|ph saying /f/ + y + -cian ending|发 /f/ 的 ph 加 y 和 -cian
      astronomer|a scientist watching planets through a telescope|a Greek scholar calculating Earth's size from shadows|a scientist mapping the stars|astronomer studies stars and planets; physician is a doctor|astronomer 是天文学家；physician 是医生|physician is a medical doctor treating illness, not a scientist peering through a telescope to map stars|physician 是医生，不是用望远镜观测行星、绘制星图的天文学家|mathematician is a math expert, not specifically a scientist observing planets and mapping stars|mathematician 是数学家，不特指用望远镜观测星辰行星的天文学家|as · tron · o · mer|astro- (star) + -nomer|astro-（星）加 -nomer
      inquiry|science starting by asking questions and seeking answers|a months-long careful investigation of old coins|an official investigation finding what caused a fire|inquiry is a careful search for facts; debate is arguing opposing sides|inquiry 是追寻真相的探究调查；debate 是双方辩论|debate is two sides arguing different opinions, not an investigation uncovering what caused a fire or studying old coins|debate 是双方观点辩论，不是查明火灾原因或考证古币的调查探究|logic is step-by-step reasoning, not an organized fact-finding investigation into coins or a fire|logic 是推理方法，不是历时数月查明真相的专项调查|in · qui · ry|in- + qu + i + -ry|in- 加 qu、i 和 -ry
      principle|the basic science rule that results must be tested|fairness as a basic rule of democracy|the basic physical rule explaining how a lever works|principle is a basic rule or truth; logic is step-by-step reasoning|principle 是基本原则或原理；logic 是逻辑推理|logic is step-by-step thinking, not a countable basic rule or truth like fairness or how a lever works|logic 是不可数的逻辑思维，不是像“公平”或“杠杆原理”这样的单条基本原则|lecture is a spoken teaching talk, not a basic rule or physical law|lecture 是口头讲座，不是科学、民主或杠杆的基本原理|prin · ci · ple|pr blend + soft c (/s/) + -ple (rule, not -pal)|pr 连缀、读 /s/ 的 c 加 -ple（别写成校长 principal）
    `,
  },
);

const government = batch(
  "words-for-government-and-choices",
  ["Words for Government and Choices", "政府与选择的词"],
  ["government and the choices citizens make", "政府和公民所做的选择"],
  `
  elect|to choose someone by voting|选举|Citizens ___ a new mayor every four years.|The class will ___ a president next week.|We ___ leaders to speak for us.|isolate,deny|elected
  candidate|a person who wants to be chosen in a vote|候选人|Each ___ gave a speech before the vote.|The ___ with the most votes won.|She was the youngest ___ for class president.|official,council|candidates
  council|a group of people chosen to make decisions for a town or group|委员会，议会|The town ___ voted to build a new library.|Members of the student ___ meet every Friday.|The ___ makes the rules for the park.|candidate,policy
  freedom|the right to act, speak or think as you choose|自由|Every citizen has the basic ___ to choose their religion.|Under the new law, everyone had the ___ to speak their mind.|The caged bird finally flew off to its ___.|privilege,responsibility
  responsibility|a duty you are trusted to do|责任|Feeding the fish is my duty and ___ this week.|Voting is a duty and ___ of every citizen.|With great power comes great ___.|privilege,policy|responsibilities
  privilege|a special right that not everyone has|特权|Staying up late is a special ___ for the older children only.|In Athens, voting was a ___ of male citizens only.|It was a rare ___ to meet the famous writer.|responsibility,consent
  consent|permission or agreement|同意|You need a parent's ___ to go on the trip.|The king could not tax the people without their ___.|She gave her ___ for the photo to be printed.|policy,privilege
  liberty|being free from control by others|自由|The prisoners won their ___ after ten years.|People fought for their ___ against the cruel king.|Under the tyrant, the people had no ___ to speak.|council,official
  official|a person who holds a job in government|官员|A city ___ checked the building for safety.|The border ___ stamped our passports at the gate.|In Athens, each government ___ was chosen by drawing lots.|candidate,council|officials
  policy|a plan or rule that a group follows|政策|The school's ___ is that phones stay in lockers.|The new ___ lowered the speed limit near schools.|The council changed its ___ on recycling.|consent,council
  `,
  "context-clues",
  {
    intro: t(
      "Before citizens **elect** a new mayor, every **candidate** explains what **policy** they will bring to the town **council**—balancing each person's **freedom** with civic **responsibility**, and never taxing without the people's **consent**. These ten words name the building blocks of self-government.",
      "公民选举（**elect**）新市长前，每位候选人（**candidate**）都要说明自己将在市议会（**council**）推行的政策（**policy**），平衡个人自由（**freedom**）与公民责任（**responsibility**），并征得民众同意（**consent**）。这十个词讲述政府与公民选择。",
    ),
    watchOut: {
      meanings: t(
        "Tell **freedom** (a basic right belonging to everyone, like speaking your mind) apart from **privilege** (a *special* right granted only to some people, like staying up late for older kids) and **responsibility** (a *duty* you are trusted to carry out).",
        "分清 **freedom**（人人享有的基本自由权利）、**privilege**（仅少数人享有的特殊特权）和 **responsibility**（受托必须履行的责任义务）。",
      ),
      use: t(
        "Tell **candidate** (someone *running* in an election who hopes to be chosen) apart from **official** (someone *already holding* a government job, like a building inspector or passport officer).",
        "分清 **candidate**（竞选参选、争取当选的候选人）和 **official**（已经在政府任职履职的官员）。",
      ),
      spelling: t(
        "Watch **privilege** (*priv-i-lege*, ends in *-lege*, not *-ledge*), **council** (*-cil* for a decision group, not *counsel* for advice), and **responsibility** (*respons-* + *-ibility*).",
        "注意 **privilege** 结尾的 **-lege**（无 *d*）、**council** 结尾的 **-cil**（别和建议 *counsel* 混），以及 **responsibility** 中的 **-ibility**。",
      ),
    },
    notes: `
      elect|citizens choosing a new mayor by voting|a class choosing a president next week|voters choosing leaders to speak for them|elect chooses leaders by voting; isolate keeps someone apart|elect 是投票选举领导人；isolate 是隔离孤立|isolate means keeping someone apart from others, not choosing a mayor, president, or leader by voting|isolate 是把人隔离开，不是投票选出市长或代表|deny means saying something is untrue, not choosing a leader by voting|deny 是否认某事，不是投票选举|e · lect|e + short e + ct blend|e 加短 e 和 ct
      candidate|a person giving a speech before a vote|the election runner who wins the most votes|the youngest person running for class president|candidate hopes to win a vote; official already holds a government job|candidate 是竞选的候选人；official 是已在职的政府官员|official is someone already holding a government job, not someone giving a speech to win a vote|official 是已任职的政府官员，不是选前发表竞选演说的候选人|council is a whole group chosen to make decisions, not one person running for class president|council 是决策委员会整体，不是参选班长的单个人|can · di · date|can + di + -date with silent e|can、di 加带 e 的 -date
      council|a town decision group voting to build a library|a student group meeting every Friday|a local governing group making park rules|council is a decision-making group; policy is a rule it follows|council 是决策委员会；policy 是制定的政策规则|candidate is one person running in an election, not a group of members meeting every Friday to make rules|candidate 是单个参选人，不是每周五开会定规则的委员会集体|policy is a rule or plan itself, not the group of people who vote to build a library|policy 是具体规章政策，不是投票建图书馆的人员机构|coun · cil|ou saying /aʊ/ + soft c in -cil (group, not -sel)|发 /aʊ/ 的 ou 加 -cil（委员会，别写成建议 counsel）
      freedom|every citizen's basic right to choose religion|everyone's legal right to speak their mind|a caged bird flying off into open liberty|freedom is a basic right for everyone; privilege is a special right only for some|freedom 是人人拥有的基本自由；privilege 是仅部分人享有的特权|privilege is a special right limited to a few, not a basic right for every citizen or a bird escaping a cage|privilege 是少数人才有的特权，不是所有公民的基本权利或小鸟飞向的自由|responsibility is a duty you must carry out, not the right to choose freely or escape a cage|responsibility 是必须履行的义务责任，不是自由选择或脱离牢笼的自由|free · dom|fr blend, double e, and -dom ending|fr 连缀、双写 e 加 -dom
      responsibility|a weekly duty to feed the fish|every citizen's civic duty to vote|the heavy duty that comes with great power|responsibility is a duty you are trusted to do; privilege is a special right|responsibility 是受托履行的责任；privilege 是特殊权利|privilege is a special right enjoyed by a few, not a duty you are trusted to carry out|privilege 是享有的特权，不是每周喂鱼或伴随权力而来的责任义务|policy is a group's official rule or plan, not a personal duty like feeding fish|policy 是团体政策规定，不是个人承担的责任义务|re · spon · si · bil · i · ty|re- + spon + si + -bility|re-、spon、si 加 -bility
      privilege|a special right to stay up late for older kids only|a right restricted to male citizens in Athens|a rare honor of meeting a famous writer|privilege is a special right not everyone has; responsibility is a duty|privilege 是少数人享有的特权；responsibility 是必须承担的责任|responsibility is a duty you are trusted to do, not a special perk reserved for older kids or a rare honor|responsibility 是应尽的职责，不是仅限大孩子的特权或难得荣幸|consent is permission or agreement, not a special right restricted to one group|consent 是许可同意，不是仅限特定群体享有的特权|priv · i · lege|pr blend + i + -lege (no d)|pr 连缀、i 加 -lege（注意无 d）
      consent|a parent's permission to go on a trip|citizens' agreement needed before taxing them|permission given to print a photo|consent is permission or agreement; policy is a group rule|consent 是许可同意；policy 是团体政策|policy is an organization's standing rule or plan, not a parent's or person's permission for a trip or photo|policy 是机构规章政策，不是家长签字同意去郊游或允许印照片的许可|privilege is a special right only some have, not agreement or permission to tax or print a photo|privilege 是特殊权利，不是允许征税或印刷照片的同意许可|con · sent|con- + short e + nt blend|con- 加短 e 和 nt
      liberty|freedom from captivity won by prisoners|freedom from a cruel king fought for by people|freedom to speak denied under a tyrant|liberty is being free from others' control; council and official are government bodies or workers|liberty 是不受他人奴役控制的自由；council 和 official 是政府机构或人员|council is a group chosen to make decisions, not the state of being free from prison or a cruel king|council 是议会委员会，不是囚犯赢得或民众争取的自由|official is a person with a government job, not freedom from control by a tyrant|official 是政府官员，不是摆脱暴君控制的自由|lib · er · ty|short i + er + -ty ending|短 i、er 加 -ty
      official|a city worker inspecting a building for safety|a border worker stamping passports at a gate|an Athenian government worker chosen by lot|official holds a government job; candidate is still running for one|official 是已在职的政府官员；candidate 是参选候选人|candidate is someone running in an election to be chosen, not a worker already inspecting buildings or stamping passports|candidate 是尚未当选的候选人，不是已上岗检查安全或盖护照章的官员|council is a whole group making decisions, not one single person stamping passports or inspecting a building|council 是集体委员会，不是单个盖章或安检的政府人员|of · fi · cial|double f + -cial saying /ʃəl/|双写 f 加读 /ʃəl/ 的 -cial
      policy|a school rule keeping phones in lockers|a new rule lowering speed limits near schools|a council's standing plan on recycling|policy is a group's plan or rule; consent is permission|policy 是团体遵循的政策规定；consent 是许可同意|consent is individual permission or agreement, not a school's or council's standing rule on phones, speed limits, or recycling|consent 是个人同意许可，不是学校或议会制定的手机、限速或回收政策|council is the group of decision-makers, not the rule itself that lowers speed limits|council 是制定规则的委员会，不是政策规则本身|pol · i · cy|short o + i + soft c in -cy|短 o、i 加读 /s/ 的 -cy
    `,
  },
);

/** batchesA are the vocabulary batches of the first five units. */
export const batchesA: readonly BatchSpec[] = [
  oceansAndIce,
  amounts,
  cleanWater,
  matter,
  chemicalChange,
  materials,
  investigating,
  cellsAndMicrobes,
  lab,
  livingThings,
  starsAndSky,
  spaceExploration,
  ancientGreece,
  greekIdeas,
  government,
];
