// Grade 5: the batches of words of the last five units, from the Maya, Aztec and Inca to letters and diaries.

import { t } from "@ga/content";
import type { BatchSpec } from "../batch.ts";
import { batch } from "./batches.ts";

const americas = batch(
  "words-of-the-maya-aztec-and-inca",
  ["Words of the Maya, Aztec and Inca", "玛雅、阿兹特克与印加的词"],
  ["the Maya, the Aztec and the Inca", "玛雅人、阿兹特克人和印加人"],
  `
  terrace|a flat step cut into a hillside for farming|梯田|Farmers grew potatoes on each flat ___ cut into the steep hill.|Every stone ___ held the soil in place on the slope.|Water ran down from one hillside ___ to the next.|plaza,causeway|terraces
  maize|corn|玉米|The Maya ground ___ to make flatbread.|Fields of golden corn, or ___, grew all around the city.|An old story says the first people were made from ___ dough.|cacao,llama
  causeway|a raised road built across water or wet ground|堤道|A long ___ joined the island city to the shore.|Soldiers marched along the raised ___ over the lake.|Builders raised the ___ above the water with earth and stone.|terrace,plaza|causeways
  cacao|the beans that chocolate is made from|可可（豆）|The Aztec made a bitter chocolate drink from ___ beans.|Beans of ___ were so valuable that people used them as money.|The ___ tree grows in the warm, wet rainforest.|maize,quipu
  quipu|a set of knotted strings the Inca used to keep records|奇普（结绳记事）|The Inca kept records on a ___ of knotted strings.|Each knot of the ___ stood for a number.|A trained reader could count the taxes on a knotted ___.|codex,cacao
  codex|a folding book of pictures and writing|古抄本|Maya writers painted their history in a ___ made of bark paper.|The folding bark-paper ___ opened out like a fan.|Only a few old Maya books survive, and each such ___ is a treasure.|quipu,ruins
  ruins|what is left of buildings that have fallen apart|遗迹，废墟|Tourists explore the broken stone ___ of the ancient city.|Jungle vines covered the fallen ___ of the temple.|Among the fallen ___, archaeologists found pieces of pottery.|plaza,terrace
  plaza|an open square in a town|广场|Markets were held in the big open ___ in front of the temple.|Crowds gathered in the town ___ for the festival.|The open town ___ was paved with flat stones.|terrace,causeway|plazas
  llama|a woolly animal of the Andes used to carry loads|美洲驼|A ___ can carry a load along steep mountain paths.|The Inca used the wool of the ___ for warm clothes.|The woolly ___ spat at the tourist who came too close.|maize,cacao|llamas
  highland|high, hilly or mountainous land|高地|The cold mountainous ___ was good for growing potatoes.|Villages dotted the mountainous ___ far above the coast.|In the cold mountain ___, the air is thin and cool.|causeway,terrace|highlands
  `,
  "context-clues",
  {
    intro: t(
      "Across the Andes **highland**, an Inca farmer tends potatoes on a stone **terrace** while a woolly **llama** carries goods and an official counts taxes on a knotted **quipu**; farther north, Maya scribes fold a painted **codex** beside an open town **plaza** and a lake **causeway**. These ten words bring the Americas' great civilizations to life.",
      "在安第斯高地（**highland**）上，印加农夫在石砌梯田（**terrace**）里种土豆，美洲驼（**llama**）驮着货物，官员用结绳奇普（**quipu**）记账；更北方的玛雅书吏则在广场（**plaza**）与湖上堤道（**causeway**）旁翻看古抄本（**codex**）。这十个词讲述美洲古文明。",
    ),
    watchOut: {
      meanings: t(
        "Tell **quipu** (knotted strings used by the Inca to record numbers) apart from **codex** (a folding bark-paper book of pictures and writing used by the Maya and Aztec).",
        "分清 **quipu**（印加人用来记数的结绳奇普）和 **codex**（玛雅与阿兹特克人用树皮纸折叠写画的古抄本）。",
      ),
      use: t(
        "Tell **terrace** (a flat farming step cut into a hillside) apart from **causeway** (a raised road across water or wet ground) and **plaza** (an open paved square inside a town).",
        "分清 **terrace**（山坡上开垦的梯田）、**causeway**（架在水面或湿地上方的堤道）和 **plaza**（城中开阔的广场）。",
      ),
      spelling: t(
        "Watch **llama** (double *l* at the start), **quipu** (*qui-* + *-pu*), and **maize** (*ai* + *ze*, not *maze*).",
        "注意 **llama** 开头的双写 **l**、**quipu** 的拼写，以及 **maize**（玉米，别写成迷宫 *maze*）。",
      ),
    },
    notes: `
      terrace|flat farming steps cut into a steep hillside|stone steps holding soil in place on a slope|hillside steps letting water run from one to the next|terrace is a hillside farming step; plaza is a flat town square|terrace 是山坡梯田；plaza 是城镇广场|plaza is an open paved square in a town, not a flat farming step cut into a steep hillside|plaza 是城里的开阔广场，不是开垦在陡坡上种庄稼的梯田|causeway is a raised road built across water, not a hillside step holding soil on a slope|causeway 是跨水堤道，不是山坡上保土种土豆的梯田|ter · race|short e, double r, and soft c in -race|短 e、双写 r 加读 /s/ 的 -race
      maize|grain ground by the Maya to make flatbread|fields of golden corn growing around a city|grain turned into dough in an origin story|maize is corn; cacao is chocolate beans|maize 是玉米；cacao 是可可豆|cacao is the bitter bean used to make chocolate, not golden corn ground into flatbread dough|cacao 是做巧克力的可可豆，不是磨成面饼面团的金黄玉米|llama is a woolly mountain animal, not a grain grown in fields or ground into dough|llama 是美洲驼动物，不是种在田里磨面做饼的粮食|maize|ai saying long a + ze (not maze)|发长 a 的 ai 加 ze（别写成迷宫 maze）
      causeway|a long raised road joining an island city to shore|a raised road marched along over a lake|earth and stone built up above water as a road|causeway is a raised road over water; terrace is a hillside farming step|causeway 是跨水堤道；terrace 是山坡梯田|terrace is a flat farming step cut into a hillside, not a raised road crossing a lake to an island|terrace 是山坡梯田，不是连接湖中岛城与岸边的跨水高架路|plaza is an open town square, not a raised road built above water|plaza 是城中广场，不是架在水面上的堤道|cause · way|compound word: cause (au) + way|合成词：cause（au）加 way
      cacao|beans used by the Aztec for a bitter chocolate drink|valuable beans once used as money|a tropical rainforest tree bearing chocolate beans|cacao is the chocolate bean; maize is corn|cacao 是可可豆；maize 是玉米|maize is corn used for flatbread and dough, not the tropical rainforest bean that makes chocolate|maize 是做面饼的玉米，不是雨林里结出做巧克力豆子的可可|quipu is a set of knotted Inca strings for records, not a bean or rainforest tree|quipu 是结绳记事绳串，不是豆子或雨林树木|ca · cao|ca + cao saying /kaʊ/|ca 加读 /kaʊ/ 的 cao
      quipu|knotted Inca strings used to keep records|knotted cords where each knot stands for a number|knotted strings read by trained tax counters|quipu is knotted record strings; codex is a folding bark-paper book|quipu 是结绳记事绳串；codex 是折叠古抄本|codex is a folding book painted on bark paper, not a set of knotted strings where knots stand for numbers|codex 是树皮纸折叠书，不是打结记数的奇普绳串|cacao is the bean chocolate is made from, not knotted strings used for Inca records|cacao 是可可豆，不是印加人打结计税的记录工具|qui · pu|qu + i saying /iː/ + pu|qu 加读长 e 的 i 和 pu
      codex|a bark-paper book painted with Maya history|a folding bark-paper book opening like a fan|a surviving ancient Maya book treasured today|codex is a folding book of writing and pictures; quipu is knotted strings|codex 是折叠古抄本；quipu 是结绳奇普|quipu is a set of knotted Inca strings, not a bark-paper book that folds out like a fan|quipu 是打结绳串，不是用树皮纸画成、像扇子一样展开的古书|ruins are fallen ancient buildings, not a painted bark-paper book|ruins 是倒塌的建筑遗迹，不是绘有文字图画的折叠抄本|co · dex|long o in co + -dex|co 读长 o 加 -dex
      ruins|broken stone remains of an ancient city|fallen temple remains covered in jungle vines|fallen building remains holding pieces of pottery|ruins are what remains of fallen buildings; plaza is an open town square|ruins 是倒塌建筑的遗迹废墟；plaza 是开阔广场|plaza is an open paved square for markets and festivals, not fallen broken buildings overgrown with vines|plaza 是铺石的开阔广场，不是藤蔓缠绕的残垣断壁|terrace is a flat hillside farming step, not the broken remains of an ancient temple or city|terrace 是农耕梯田，不是古代神庙或城市的残破废墟|ru · ins|long u in ru + -ins plural|ru 读长 u 加复数 -ins
      plaza|a big open market square in front of a temple|a town square where crowds gather for festivals|an open town square paved with flat stones|plaza is an open town square; causeway is a raised road over water|plaza 是城中开阔广场；causeway 是跨水堤道|terrace is a flat farming step on a hillside, not a paved town square for markets and festivals|terrace 是山坡梯田，不是城镇中心办集市庆典的石板广场|causeway is a raised road built across water, not an open square in front of a temple|causeway 是跨水堤道，不是神庙前聚众庆典的开阔广场|pla · za|pl blend + broad a + -za|pl 连缀加 a 和 -za
      llama|a mountain animal carrying loads on steep paths|a woolly Andean animal providing warm wool|a woolly animal spitting at a close tourist|llama is a woolly Andean pack animal; maize and cacao are plants|llama 是安第斯山驮货产毛的美洲驼；maize 和 cacao 是植物|maize is corn, not a woolly mountain animal that carries loads or spits|maize 是玉米作物，不是驮货产毛的动物|cacao is chocolate beans, not a woolly animal walking mountain paths|cacao 是可可豆，不是安第斯山区的驮畜|lla · ma|double l at the start + -ama|词首双写 l 加 -ama
      highland|cold mountainous land suited to growing potatoes|mountainous region dotted with villages above the coast|high mountain area with thin cool air|highland is high mountainous land; terrace is one small hillside step|highland 是大片山地高地；terrace 是单级梯田|causeway is a raised road across water, not a whole mountainous region with thin cool air|causeway 是跨水堤道，不是空气稀薄的高原山地|terrace is one narrow farming step cut into a slope, not an entire mountainous region dotted with villages|terrace 只是山坡上的单级农田，不是遍布村庄、空气稀薄的整片高地|high · land|compound word: high (igh) + land|合成词：含 igh 的 high 加 land
    `,
  },
);

const heights = batch(
  "words-of-heights-and-depths",
  ["Words of Heights and Depths", "高处与深处的词"],
  ["mountains, valleys and the shape of the land", "山脉、山谷和地形"],
  `
  altitude|how high something is above the sea, especially something in the air|海拔，高度|At high ___, the air has less oxygen.|The plane climbed to a cruising ___ of ten kilometers.|Climbers often get headaches from the thin air at high ___.|terrain,foothills
  elevation|the height of a piece of land above the sea|（地面的）海拔|The map shows the height, or ___, of each hill with colored bands.|Snow stays all year above a certain ___ on the mountain.|The town's ___ is 2,400 meters, so water boils there at a lower heat.|gorge,foothills
  peak|the pointed top of a mountain|山峰|Snow covered the pointed ___ of the mountain all year.|The climbers reached the mountain's highest ___ at noon.|From the high pointed ___, we could see three valleys below us.|gorge,sinkhole|peaks
  gorge|a deep, narrow valley with steep, rocky sides|峡谷|The river cut a deep, narrow ___ through the rock.|A rope bridge crossed the steep rocky ___.|Far below us, at the bottom of the narrow ___, the water roared.|peak,foothills
  terrain|the land and what it is like|地形|The rocky ___ made the hike slow.|A jeep can drive over rough ___.|The map shows the ___: hills, rivers and forests.|altitude,lowland
  lowland|low, flat land|低地|Rivers flood the flat ___ every spring.|Rice grows well in the wet, flat ___ near the coast.|They moved down from the mountains to the warm, flat ___.|foothills,peak|lowlands
  steep|rising or falling sharply|陡峭的|The path up the hill rose so sharply and was so ___ that we had to use our hands.|A ___ cliff dropped straight down to the sea.|Farmers cut steps into the sharply rising ___ slope.|rugged,porous
  rugged|rough and uneven, with many rocks|崎岖的|The ___ coast was full of jagged, uneven rocks.|Only sure-footed goats could cross the rough, rocky ___ hills.|The rough ___ trail was covered with jagged stones and twisted roots.|steep,flexible
  foothills|low hills at the bottom of a mountain range|山麓小丘|The village sits in the ___ below the high peaks.|We hiked through the green ___ at the base of the mountains before the real climb began.|Farms covered the gentle ___ at the foot of the mountain range.|lowland,gorge
  sinkhole|a hole that opens when the ground falls in|天坑，落水洞|A ___ opened in the road and swallowed a car.|Water dissolved the rock below until the ground fell into a ___.|The Maya drew water from a deep ___ where the ground had collapsed.|gorge,peak|sinkholes
  `,
  "context-clues",
  {
    intro: t(
      "Leaving the wet coastal **lowland**, hikers cross the gentle **foothills** onto **rugged**, rocky **terrain**, climb a **steep** path above a roaring **gorge**, and finally stand on the snowy **peak** where thin air shows the high **altitude**. These ten words describe landforms from deep sinkholes to mountain summits.",
      "离开潮湿低地（**lowland**），徒步者穿过平缓的山麓小丘（**foothills**），踏上崎岖（**rugged**）地形（**terrain**），沿陡峭（**steep**）山路越过深邃峡谷（**gorge**），最终登上白雪皑皑的山峰（**peak**），在高海拔（**altitude**）稀薄空气中远眺。这十个词描绘山地与地貌。",
    ),
    watchOut: {
      meanings: t(
        "Tell **steep** (rising or falling at a sharp angle, like a cliff dropping straight down) apart from **rugged** (rough, rocky, and uneven underfoot, even on a flat coast or low trail).",
        "分清 **steep**（坡度极陡、直上直下）和 **rugged**（地面粗糙多石、崎岖不平）。",
      ),
      use: t(
        "Tell **altitude** (height above sea level, especially in the air for planes or thin mountain air) apart from **elevation** (the mapped height of a piece of land or town above sea level).",
        "分清 **altitude**（尤指飞机或高空稀薄空气的海拔高度）和 **elevation**（地图上标示的某块地面或城镇的海拔高度）。",
      ),
      spelling: t(
        "Watch **terrain** (*ter-* + double *r* + *ain*), **gorge** (first *g* hard /g/, second *g* soft /dʒ/ before *e*), and **rugged** (double *g* + *-ed*).",
        "注意 **terrain** 的双写 **r** 与 **-ain**、**gorge** 末尾读 /dʒ/ 的 **ge**，以及 **rugged** 的双写 **g**。",
      ),
    },
    notes: `
      altitude|thin oxygen-poor air high above sea level|a plane's ten-kilometer cruising height in the air|thin mountain air giving climbers headaches|altitude is height above sea level; terrain is what the land surface is like|altitude 是海拔高度；terrain 是地表地形|terrain is the surface features of land like rocks or hills, not height above sea level or where a plane cruises|terrain 指地表地貌，不是飞机巡航或高空缺氧的海拔高度|foothills are low hills at the base of a mountain range, not a measurement of height above sea level|foothills 是山麓小丘，不是衡量高空的“海拔”|al · ti · tude|al + ti + -tude with silent e|al、ti 加带 e 的 -tude
      elevation|colored map bands showing each hill's height|the mountain height above which snow stays all year|a town's 2,400-meter height above sea level|elevation is land height above sea level; gorge is a deep narrow valley|elevation 是地面海拔高度；gorge 是深窄峡谷|gorge is a deep, narrow rocky valley, not a numerical height of a hill or town above sea level|gorge 是深窄峡谷，不是地图上用米标出的海拔高度|foothills are low hills at a mountain range's base, not the measured height of a town or snow line|foothills 是山麓小丘，不是城镇或雪线的海拔数值|el · e · va · tion|el + e + va + -tion ending|el、e、va 加结尾 -tion
      peak|the snow-covered pointed top of a mountain|the highest mountain top reached by climbers at noon|a high pointed summit overlooking three valleys|peak is a mountain's pointed top; gorge is a deep narrow valley|peak 是尖耸的山峰顶点；gorge 是深窄峡谷|gorge is a deep, narrow valley cut between cliffs, the exact opposite of a mountain's highest pointed top|gorge 是低陷深窄的峡谷，与高耸山峰正相反|sinkhole is a collapsed hole in the ground, the opposite of a mountain summit|sinkhole 是地面塌陷的天坑，与高山顶峰正相反|peak|ea saying long e + k (not peek)|发长 e 的 ea 加 k（别写成偷看 peek）
      gorge|a deep narrow valley cut through rock by a river|a steep rocky valley spanned by a rope bridge|a narrow chasm with roaring water far below|gorge is a deep narrow rocky valley; peak is a mountain top|gorge 是深窄岩石峡谷；peak 是山峰顶|peak is the pointed top of a mountain, the exact opposite of a deep narrow valley with roaring water below|peak 是高耸山峰，与脚下水声轰鸣的深谷正相反|foothills are gentle low hills at a mountain range's base, not a deep narrow rocky chasm|foothills 是平缓山麓小丘，不是需要架索桥跨越的深窄峡谷|gorge|first g hard (/g/), second g soft (/dʒ/) + silent e|首 g 读 /g/，尾 ge 读 /dʒ/
      terrain|rocky ground slowing down a hike|rough ground crossed by a jeep|mapped hills, rivers, and forests across the land|terrain is what the land surface is like; altitude is height above sea level|terrain 是地表地形状况；altitude 是海拔高度|altitude is height above sea level in meters or kilometers, not rocky or rough ground under boots or jeep tires|altitude 是海拔高度，不是脚下或吉普车驶过的崎岖地表地形|lowland is specifically low flat land, not rocky ground or a map showing hills, rivers, and forests|lowland 特指低洼平地，不能涵盖多石山地或山河森林的综合地形|ter · rain|double r + ai saying long a + n|双写 r 加发长 a 的 ai 和 n
      lowland|flat low land flooded by rivers each spring|wet flat coastal land suited to rice|warm flat land below the mountains|lowland is low flat land; foothills are low hills at a mountain's base|lowland 是低洼平地；foothills 是山麓小丘|foothills are rolling hills at the bottom of a mountain range, not low flat ground flooded by rivers or growing rice|foothills 是山脚丘陵，不是春季易被河水淹没或沿海种水稻的低洼平地|peak is the pointed top of a high mountain, the exact opposite of low flat land|peak 是高山顶峰，与低洼平地正相反|low · land|compound word: low (ow) + land|合成词：low 加 land
      steep|a sharply rising path requiring hands to climb|a cliff dropping straight down to the sea|a sharply rising slope cut into farming steps|steep rises or falls sharply; rugged is rough and rocky|steep 指坡度陡峭；rugged 指地面粗糙多石|rugged means rough and uneven with jagged rocks, not specifically dropping straight down or rising at a sharp angle|rugged 强调多石凹凸不平，不专门指直上直下的陡峭坡度|porous means full of tiny holes letting water pass through, not rising or falling at a sharp angle|porous 指多孔透水，不指坡度陡峭直上直下|steep|st blend, double e, and p|st 连缀、双写 e 加 p
      rugged|a jagged, uneven rocky coastline|rough rocky hills crossed only by sure-footed goats|a rough trail covered in jagged stones and roots|rugged is rough and rocky underfoot; steep rises or falls sharply|rugged 指多石崎岖不平；steep 指坡度陡峭|steep means rising or falling at a sharp angle, not specifically uneven and covered with jagged stones and roots|steep 只强调坡度很陡，不专门指布满尖石和树根的崎岖表面|flexible means bending easily without breaking, not rough, rocky, and uneven underfoot|flexible 指柔韧易弯，不能形容布满乱石树根的崎岖地面|rug · ged|short u, double g, and -ed|短 u、双写 g 加 -ed
      foothills|low hills sitting directly below high mountain peaks|green low hills hiked before the real mountain climb|gentle hills at the foot of a mountain range|foothills are low hills at a mountain's base; lowland is flat low land|foothills 是山麓小丘；lowland 是低洼平地|lowland is flat ground with no hills, not rolling hills at the base of high mountain peaks|lowland 是平坦低地，不是紧挨高山脚下的起伏小丘|gorge is a deep narrow rocky valley, not gentle green hills covered with farms below mountain peaks|gorge 是深窄峡谷，不是高山脚下平缓的农田丘陵|foot · hills|compound word: foot (oo) + hills (double l)|合成词：foot 加双写 l 的 hills
      sinkhole|a collapsed road hole swallowing a car|a ground collapse after water dissolved rock below|a deep water-filled hole formed by collapsed ground|sinkhole opens when ground collapses; gorge is a river-cut valley|sinkhole 是地面塌陷形成的天坑；gorge 是河流切出的峡谷|gorge is a long narrow valley cut by a river, not a hole opening suddenly when rock dissolves and ground collapses|gorge 是河流冲刷的长峡谷，不是地下溶蚀突然塌陷吞没汽车的天坑|peak is a pointed mountain top, the exact opposite of a collapsed hole in the ground|peak 是高耸山峰，与塌陷深坑正相反|sink · hole|compound word: sink + hole with silent e|合成词：sink 加 hole
    `,
  },
);

const riseAndFall = batch(
  "words-for-rise-and-fall",
  ["Words for Rise and Fall", "兴衰的词"],
  ["how peoples and cities grow and decline", "民族和城市的兴衰"],
  `
  decline|to become weaker or smaller|衰落，减少|When the rains stopped, the cities began to shrink and ___.|Sales of ice cream ___ sharply in freezing winter weather.|The town's numbers began to ___ after the mine closed.|prosper,endure|declined
  prosper|to do well and grow rich|繁荣|Trade helped the city grow rich and ___.|Farms grow rich and ___ when the rain comes on time.|The family's business grew rich and began to ___.|decline,unite|prospered
  abandon|to leave and not come back|抛弃，离弃|The people had to ___ the city and never return when the wells dried up.|Never ___ a pet and leave it behind.|The crew had to ___ the sinking ship.|isolate,endure|abandoned
  endure|to last for a long time, or to put up with something hard|持久；忍受|Stone buildings can ___ for centuries without crumbling.|The travelers had to ___ the freezing cold all night.|Their old stories still last and ___ today.|abandon,prosper
  population|the number of people who live in a place|人口|The city's ___ grew to two hundred thousand people.|A census counts the whole ___ of a country.|As food ran short, the city's ___ fell.|settlement,rival
  settlement|a place where people have come to live|定居点|The first ___ was just a few huts by the river.|Over the years, the tiny ___ grew into a bustling town.|Explorers found an ancient ___ of stone houses beside the lake.|population,rival|settlements
  isolate|to keep apart from others|隔离，孤立|High mountains ___ the valley from the rest of the world.|Doctors ___ sick patients so that others do not catch the illness.|The flood will ___ the village and cut it off for days.|unite,abandon|isolated
  unite|to join together|联合，团结|The leader managed to ___ the tribes into one empire.|The disaster helped ___ the whole town as one.|The two rivers ___ here and flow on as one.|isolate,decline|united
  rival|someone you compete with|对手|Each city was a competing ___ of the city next to it.|My fastest ___ won the race by one second.|The team finally beat its old ___ in the championship.|settlement,population|rivals
  advanced|far ahead in skill or knowledge|先进的|The Maya had ___ knowledge of the stars.|Their ___ roads were better than any in Europe at the time.|She is in the ___ math class.|bygone,rural
  `,
  "context-clues",
  {
    intro: t(
      "A tiny riverside **settlement** can grow in **population**, **unite** with neighbors, and **prosper** with **advanced** roads—or face drought, **decline**, and force people to **abandon** stone walls that still **endure** for centuries. These ten words trace how cities and peoples rise and fall.",
      "河畔小小的定居点（**settlement**）可以人口（**population**）壮大、与邻邦联合（**unite**）、凭借先进（**advanced**）道路走向繁荣（**prosper**）；也可能因干旱衰落（**decline**），人们被迫离弃（**abandon**）却仍屹立（**endure**）百年的石墙。这十个词讲述文明兴衰。",
    ),
    watchOut: {
      meanings: t(
        "Tell **prosper** (do well and grow rich) apart from **endure** (last for a long time or put up with hardship without giving up) and **decline** (grow weaker or smaller).",
        "分清 **prosper**（兴旺富裕、繁荣）、**endure**（经久不衰或咬牙忍受艰难）和 **decline**（逐渐衰弱或减少）。",
      ),
      use: t(
        "Tell **population** (the *number of people* living in a place) apart from **settlement** (the *physical place*—huts, village, or town—where people come to live).",
        "分清 **population**（某地居住的人口数量）和 **settlement**（人们建屋居住的定居点本身）。",
      ),
      spelling: t(
        "Watch **abandon** (single *b*, single *n* at the end), **settlement** (*settle* + *-ment*, keep the silent *e*), and **population** (*pop-u-la-tion*).",
        "注意 **abandon** 的单 **b** 单 **n**、**settlement** 中保留词尾 **e** 再加 **-ment**，以及 **population** 的音节拼写。",
      ),
    },
    notes: `
      decline|cities shrinking when rains stop|ice-cream sales dropping in freezing winter|town numbers shrinking after a mine closes|decline becomes weaker or smaller; prosper does well and grows rich|decline 是衰落减少；prosper 是繁荣兴旺|prosper means doing well and growing rich, the exact opposite of shrinking or dropping|prosper 是兴旺发达，与缺水衰落、销量锐减或人口流失正相反|endure means lasting a long time or bearing hardship, not growing weaker or smaller|endure 指经久不衰或忍耐坚持，与缩减衰落相反|de · cline|de- + cl blend + silent e making long i|de-、cl 连缀加发长 i 的 line
      prosper|a city growing rich through trade|farms growing rich when rains arrive on time|a family business growing rich and doing well|prosper grows rich and succeeds; decline becomes weaker|prosper 是繁荣富裕；decline 是衰落减弱|decline means growing weaker or smaller, the exact opposite of growing rich and thriving|decline 是衰弱萎缩，与繁荣致富正相反|unite means joining separate parts into one, not doing well and growing rich|unite 是合并团结，不表示生意兴隆、农业丰收或城市致富|pros · per|pr blend, short o, and -per ending|pr 连缀、短 o 加 -per
      abandon|leaving a dry city never to return|leaving a pet behind permanently|a crew leaving a sinking ship|abandon leaves permanently; endure stays through hardship|abandon 是彻底离弃；endure 是坚持忍受|isolate means keeping someone apart from others, not leaving a city, pet, or sinking ship behind|isolate 是隔离孤立，不是弃城、弃宠或弃船逃生|endure means putting up with hardship or lasting long, the exact opposite of walking away and never coming back|endure 是咬牙忍受或长久留存，与彻底放弃离去正相反|a · ban · don|a + ban + -don ending|a、ban 加 -don
      endure|stone buildings lasting for centuries|travelers putting up with freezing cold|old stories still lasting today|endure lasts long or bears hardship; abandon walks away|endure 是经久留存或忍受艰苦；abandon 是抛弃离开|abandon means leaving and not coming back, the exact opposite of lasting for centuries or bearing cold|abandon 是放弃离去，与屹立百年或忍受严寒正相反|prosper means growing rich and successful, not putting up with freezing cold or buildings lasting centuries|prosper 指繁荣致富，不能表示建筑屹立百年或忍受严寒|en · dure|en- + long u + silent e|en- 加发长 u 的 dure
      population|two hundred thousand people living in a city|the total headcount recorded by a census|a city's number of residents falling during food shortages|population is the count of residents; settlement is the place where they live|population 是人口数量；settlement 是居住定居点|settlement is the physical place of huts or houses where people live, not a headcount of two hundred thousand|settlement 是实体聚落地点，不是用人口普查统计的居民总数|rival is a person or city you compete with, not the number of people living in a place|rival 是竞争对手，不是一个地方的居民人口数|pop · u · la · tion|short o + u + -lation ending|短 o、u 加结尾 -lation
      settlement|a few riverside huts where people first lived|a tiny village growing into a bustling town|ancient stone houses found beside a lake|settlement is a place people live; population is the number of residents|settlement 是人们居住的定居点；population 是人口数量|population is the count of people, not a physical cluster of huts or stone houses beside a river|population 是人口数字，不是河边几间茅屋或湖畔古石屋构成的聚落|rival is a competitor, not a place where people build huts and live|rival 是竞争对手，不是人们安家定居的村镇|set · tle · ment|double t + keep e in settle + -ment|双写 t，保留 settle 词尾 e 再加 -ment
      isolate|high mountains cutting a valley off from the world|doctors keeping sick patients apart from others|floodwaters cutting a village off for days|isolate keeps apart from others; unite joins together|isolate 是隔离隔绝；unite 是联合团结|unite means joining together as one, the exact opposite of cutting off or keeping apart|unite 是合而为一，与隔绝山谷、隔离病人正相反|abandon means leaving behind forever, not cutting a valley off or separating sick patients|abandon 是彻底抛弃，不是地理隔绝或医疗隔离|i · so · late|long i + so + -late with silent e|长 i、so 加带 e 的 -late
      unite|joining separate tribes into one empire|bringing a whole town together as one|two rivers joining to flow on as one|unite joins together; isolate keeps apart|unite 是联合团结；isolate 是隔离孤立|isolate means keeping apart from others, the exact opposite of joining tribes, towns, or rivers into one|isolate 是孤立隔开，与合为一体正相反|decline means becoming weaker or smaller, not joining tribes or rivers together|decline 是衰弱减少，与团结联合无关|u · nite|long u + long i + silent e|长 u 加发长 i 的 nite
      rival|a neighboring city competing for power|a fast competitor winning a race by one second|an old competing team finally beaten|rival is a competitor; settlement is a place people live|rival 是竞争对手；settlement 是定居点|settlement is a place where people live, not a competitor you race or beat in a championship|settlement 是定居村镇，不是赛跑或球赛中击败的对手|population is the number of people living in a place, not a single competitor you race against|population 是人口总数，不是竞争对手|ri · val|long i in ri + -val ending|ri 读长 i 加 -val
      advanced|far-ahead Maya knowledge of the stars|superior roads better than others of the era|a high-level math class far ahead in skill|advanced means far ahead in skill or knowledge; bygone means from a time long past|advanced 指技术或水平领先；bygone 指过去往昔|bygone means belonging to a time long past, not far ahead in skill, engineering, or class level|bygone 指久远往昔，不表示知识、道路或课程水平遥遥领先|rural means of the countryside, not far ahead in skill or knowledge|rural 指乡村的，不表示先进高阶|ad · vanced|ad- + soft c (/s/) + -ed|ad- 加读 /s/ 的 c 和 -ed
    `,
  },
);

const calendars = batch(
  "words-of-calendars-and-counting",
  ["Words of Calendars and Counting", "历法与计数的词"],
  ["calendars, numbers and counting", "历法、数字和计数"],
  `
  calendar|a chart that shows the days, weeks and months of a year|日历，历法|I marked my birthday on the wall ___.|The Maya ___ had a year of 365 days.|Our school ___ shows every holiday on its monthly chart.|almanac,cycle|calendars
  numeral|a symbol that stands for a number|数字符号|The Roman ___ for five is V.|A dot was the Maya ___ for one.|Write each number symbol, or ___, clearly so that nobody misreads it.|tally,interval|numerals
  zero|the number that means none|零|The Maya used a shell symbol to mean ___.|Any number times ___ is nothing.|The temperature dropped below ___ last night.|digit,interval
  digit|one of the ten symbols, 0 to 9, used to write numbers|数位，数字|The number 4 is written with a single ___.|My locker code has one more ___ than yours.|Each ___ of a phone number matters.|tally,almanac|digits
  tally|a count kept with marks|计数，记录|Keep a ___ of how many birds you see.|We made a ___ with a mark for every car that passed.|The final ___ of marks showed twelve votes for the park.|interval,calendar|tallies
  solstice|the longest or the shortest day of the year|至日（夏至、冬至）|The summer ___ is the longest day of the year.|On the winter ___, the sun sets very early.|Crowds watch the sun rise behind the stones on the longest day, the summer ___.|equinox,interval
  equinox|a day when day and night are the same length|春分，秋分|On the ___, day and night each last about twelve hours.|The spring ___ comes in March when day and night are equal.|At the ___, day and night match and the sun rises due east.|solstice,cycle
  almanac|a book printed each year with dates, weather and facts|年鉴，历书|The farmer's annual book, or ___, said when to plant the beans.|Look in the annual fact book, or ___, to find when the moon will be full.|Our annual ___ lists the weather and tides for every day of the year.|calendar,tally
  interval|the time or space between two things|间隔|The ___ between the flash and the thunder tells how far away the storm is.|There was a short ___ between the two acts of the play.|Plant the seeds with an ___ of ten centimeters between them.|cycle,tally|intervals
  cycle|a set of events that happens again and again in the same order|周期，循环|The ___ of the seasons repeats every year.|The moon goes through a ___ of phases every month.|Water moves through a ___ from sea to cloud to rain.|interval,calendar|cycles
  `,
  "context-clues",
  {
    intro: t(
      "Long before a wall **calendar** or printed farmer's **almanac** existed, Maya astronomers tracked the repeating **cycle** of the seasons from summer **solstice** to spring **equinox**, writing every count with a dot **numeral** and a shell for **zero**. These ten words connect time, calendars, and counting.",
      "早在墙上挂历（**calendar**）和农民年鉴（**almanac**）问世前，玛雅天文学家就追踪着从夏至（**solstice**）到春分（**equinox**）的季节周期（**cycle**），并用圆点数字符号（**numeral**）与贝壳零（**zero**）来计数。这十个词讲述历法与计数。",
    ),
    watchOut: {
      meanings: t(
        "Tell **solstice** (the *longest* day in summer or *shortest* day in winter) apart from **equinox** (the spring or autumn day when day and night are *equal* in length).",
        "分清 **solstice**（白天最长或最短的夏至/冬至）和 **equinox**（昼夜等长的春分/秋分）。",
      ),
      use: t(
        "Tell **calendar** (a chart of days, weeks, and months) apart from **almanac** (a yearly book packed with weather, tides, planting dates, and facts) and **cycle** (any repeating order of events).",
        "分清 **calendar**（标示年月日的日历表）、**almanac**（每年出版、汇集气象潮汐与农事资料的年鉴历书）和 **cycle**（按固定顺序反复循环的周期）。",
      ),
      spelling: t(
        "Watch **calendar** (ends in *-dar*, not *-der*), **solstice** (soft *c* in *-stice*), and **equinox** (*equi-* for equal + *-nox* for night).",
        "注意 **calendar** 结尾是 **-dar**（不是 *-der*）、**solstice** 结尾的 **-stice**，以及 **equinox**（*equi* 等长 + *nox* 夜晚）。",
      ),
    },
    notes: `
      calendar|a wall chart where you mark your birthday|the Maya 365-day yearly system|a school monthly chart listing every holiday|calendar is a chart of days and months; almanac is an annual fact book|calendar 是日历历法表；almanac 是含气象资料的年鉴|almanac is a printed yearly book of weather, tides, and facts, not a wall or monthly chart of days and holidays|almanac 是每年出版的气象农事年鉴，不是墙上标生日或学校月历表|cycle is a repeating order of events like seasons, not a 365-day chart of days and holidays|cycle 是反复循环的事件周期，不是记录日期假期的日历表|cal · en · dar|short a + en + -dar (not -der)|短 a、en 加结尾 -dar（别写成 -der）
      numeral|the Roman symbol V standing for five|a Maya dot symbol standing for one|any written number symbol drawn clearly|numeral is a symbol standing for a number; tally is a count made with marks|numeral 是代表数字的符号；tally 是画杠记数|tally is a running count kept with marks, not a specific written symbol like V or a Maya dot|tally 是逐笔累计的计数，不是像罗马数字 V 或玛雅圆点这样的数字符号|interval is the time or space between two things, not a written symbol for a number|interval 是两件事之间的间隔，不是代表数字的符号|nu · mer · al|long u in nu + mer + -al|nu 读长 u 加 mer 和 -al
      zero|a Maya shell symbol meaning none|the number whose product with any number is nothing|the freezing-scale mark temperature drops below|zero is the specific number meaning none; digit is any symbol 0 through 9|zero 特指表示“无”的数字零；digit 泛指 0 到 9 任意数位|digit is any of the ten symbols 0 to 9, not specifically the number meaning none or nothing|digit 泛指 0 到 9 任意一个数字，不特指表示“零、无”的数值|interval is a gap of time or space between two things, not the number meaning none|interval 是时间或空间间隔，不是表示“没有”的数字零|ze · ro|long e in ze + long o in ro|ze 读长 e，ro 读长 o
      digit|one single symbol 0 to 9 writing the number 4|one extra symbol in a locker code|each single 0-to-9 symbol in a phone number|digit is one symbol 0 to 9; tally is a count made with marks|digit 是 0 到 9 中的单个数字位；tally 是画杠计数|tally is a count kept with marks, not one of the ten symbols 0 to 9 in a locker code or phone number|tally 是画记号统计总数，不是密码锁或电话号码里的单个数字位|almanac is an annual book of weather and facts, not a single numeral in a code or phone number|almanac 是年鉴历书，不是数字 0 到 9 中的一位|dig · it|short i + soft g (/dʒ/) + -it|短 i、读 /dʒ/ 的 g 加 -it
      tally|a running mark count of birds spotted|a mark-by-mark count of passing cars|a final count of marks showing twelve votes|tally is a count kept with marks; interval is a gap of time or space|tally 是画记号统计计数；interval 是间隔|interval is the time or space between two events, not a running count of marks for birds, cars, or votes|interval 是两次事件之间的空隙间隔，不是数鸟、数车或计票的记录|calendar is a chart of days and months, not a running mark count of birds, cars, or votes|calendar 是年月日历表，不是逐个画杠的计数记录|tal · ly|short a, double l, and -y ending|短 a、双写 l 加 -y
      solstice|the longest summer day of the year|the winter day when sunset comes earliest|the longest summer day watched at sunrise|solstice is the longest or shortest day; equinox has equal day and night|solstice 是昼最长或最短的至日；equinox 是昼夜等长的分日|equinox is a day when day and night are equal in length, not the longest summer day or earliest winter sunset|equinox 是昼夜平分的春分或秋分，不是白昼最长或日落最早的至日|interval is a stretch of time or space between two things, not the longest or shortest day of the year|interval 是两件事之间的间隔，不是一年中最长或最短的那一天|sol · stice|short o + l + soft c (/s/) in -stice|短 o、l 加读 /s/ 的 -stice
      equinox|the day when day and night each last twelve hours|the March day when day and night are equal|the equal-day-and-night date when sunrise is due east|equinox has equal day and night; solstice is the longest or shortest day|equinox 是昼夜等长的春分秋分；solstice 是昼最长或最短的至日|solstice is the longest or shortest day of the year, the opposite of a day with equal twelve-hour day and night|solstice 是昼夜差距最大的夏至冬至，与昼夜各十二小时等长正相反|cycle is a whole repeating sequence of events, not one specific March or September date when day equals night|cycle 是循环周期，不是昼夜等长的那一天|e · qui · nox|long e + qui (equal) + -nox (night)|长 e、表示等的 qui 加表示夜的 -nox
      almanac|a farmer's annual book advising when to plant|an annual fact book listing full-moon dates|an annual book listing weather and tides daily|almanac is a yearly book of weather and facts; calendar is a chart of dates|almanac 是含气象潮汐的年鉴历书；calendar 是日历表|calendar is a simple chart of days, weeks, and months, not a yearly book filled with planting advice, weather, and tide tables|calendar 只是日期表，不是汇集种植时令、气象和每日潮汐表的年鉴书|tally is a mark count, not a printed annual book of weather and tide tables|tally 是计数记录，不是每年出版的年鉴历书|al · ma · nac|al + ma + -nac ending in c|al、ma 加以 c 结尾的 -nac
      interval|the time gap between lightning and thunder|a short break between two acts of a play|ten-centimeter spacing between planted seeds|interval is the gap between two things; cycle is a repeating sequence|interval 是两者之间的时间或空间间隔；cycle 是反复循环的周期|cycle is a full repeating sequence like the seasons, not the gap of seconds or centimeters between two things|cycle 是循环往复的周期，不是闪电与雷声、两幕之间或种子之间的间隔|tally is a running count with marks, not the space or time between two events or seeds|tally 是画杠计数，不是时间或距离间隔|in · ter · val|in- + ter + -val ending|in-、ter 加 -val
      cycle|the seasons repeating in order every year|monthly moon phases repeating in order|water repeating from sea to cloud to rain|cycle is a repeating sequence; interval is one gap between two events|cycle 是按顺序反复循环的周期；interval 是两事之间的单次间隔|interval is a single gap of time or space between two things, not a repeating loop like seasons or the water cycle|interval 是两个点之间的空隙，不是四季、月相或水循环这样周而复始的循环|calendar is a chart of days and months, not a repeating natural loop like water moving from sea to cloud to rain|calendar 是日历表，不是海—云—雨或月相变化的自然循环|cy · cle|soft c (/s/) + long i sound in cy + -cle|读 /s/ 的 c、长 i 音 y 加 -cle
    `,
  },
);

const engineering = batch(
  "words-of-building-and-engineering",
  ["Words of Building and Engineering", "建筑与工程的词"],
  ["building and engineering", "建筑和工程"],
  `
  engineer|a person who designs and builds machines, bridges or buildings|工程师|The ___ checked her drawings before the bridge was built.|Each ___ on the team designed a different part of the tower.|The ___ worked out how much weight the beam could hold.|blueprint,girder|engineers
  blueprint|a detailed plan of a building or a machine|蓝图|The builders followed the detailed ___ line by line.|The ___ showed where every door would go.|Before building, the architect drew a detailed ___.|foundation,truss|blueprints
  arch|a curved structure over an opening|拱|The curved stone ___ over the gate has stood for centuries.|Water flowed under the bridge's single curved ___.|Each curved ___ carries its weight down to its sides.|dome,span|arches
  dome|a round roof shaped like half a ball|穹顶|The round ___ of the church can be seen from across the city.|Light shone through a hole at the top of the round ___.|The huge half-ball ___ covered the whole hall without a single column.|arch,truss|domes
  foundation|the solid base a building stands on|地基|Workers poured a deep ___ before building the walls.|A cracked ___ can make a whole house lean.|The tower's ___ goes forty meters down into the ground.|girder,concrete|foundations
  concrete|a hard building material made of cement, sand, stones and water|混凝土|The workers poured wet ___ into the wooden frame.|The sidewalk is made of hardened ___.|Once the wet ___ dries, it is as hard as rock.|foundation,cable
  girder|a long, strong beam of steel or iron|大梁|A crane lifted a long steel ___ to the top of the frame.|Each long steel ___ was bolted to the next.|Workers walked along a narrow steel beam, or ___, high above the street.|cable,truss|girders
  truss|a frame of short beams joined in three-sided shapes|桁架|The roof is held up by a wooden ___ of triangles.|Its triangles make a ___ strong for its weight.|The old railway bridge is built from a triangular steel ___.|girder,arch
  span|the distance a bridge stretches between its supports|跨度|The bridge has a ___ of one kilometer between its towers.|No bridge of that time had a longer ___ between supports.|The main ___ crosses the river in one leap between the towers.|arch,cable
  cable|a thick, strong rope made of wire|缆索|Each thick steel wire ___ holds up part of the road.|The bridge hangs from a thick wire ___ between two towers.|The elevator is lifted by a strong steel ___.|girder,span|cables
  `,
  "context-clues",
  {
    intro: t(
      "Standing beside a rolled **blueprint**, the lead **engineer** checks the deep **foundation** of hardened **concrete**, watches a crane hoist a steel **girder** into a triangular **truss**, and measures the wide **span** hanging from a braided wire **cable**. These ten words name the craft of building and engineering.",
      "站在摊开的蓝图（**blueprint**）旁，总工程师（**engineer**）检查浇筑在混凝土（**concrete**）里的深厚地基（**foundation**），看吊车把钢大梁（**girder**）吊入三角形桁架（**truss**），再丈量悬在钢缆索（**cable**）下的桥梁跨度（**span**）。这十个词讲述建筑与工程。",
    ),
    watchOut: {
      meanings: t(
        "Tell **arch** (a curved structure over a gate or bridge opening) apart from **dome** (a round roof shaped like *half a ball* covering a hall) and **truss** (a frame of *triangles* made from short beams).",
        "分清 **arch**（跨在门洞或桥洞上的弧形拱）、**dome**（像半球一样罩住大厅的圆穹顶）和 **truss**（由短梁拼成三角形的桁架）。",
      ),
      use: t(
        "Tell **girder** (a single long, strong beam of steel or iron) apart from **cable** (a thick, flexible rope twisted from steel wires) and **span** (the *distance* a bridge stretches between supports).",
        "分清 **girder**（单根坚硬的钢制大梁）、**cable**（钢丝拧成的粗缆索）和 **span**（桥墩之间的跨度距离）。",
      ),
      spelling: t(
        "Watch **concrete** (*con-* + *cr* + *-ete* with silent *e*), **girder** (*ir* saying /ɜːr/ + *-der*), and **truss** (short *u* + double *s*).",
        "注意 **concrete** 结尾的 **-crete**、**girder** 中读 /ɜːr/ 的 **ir**，以及 **truss** 结尾的双写 **s**。",
      ),
    },
    notes: `
      engineer|a designer checking drawings before building a bridge|each team designer planning part of a tower|a specialist calculating how much weight a beam holds|engineer is a person who designs structures; blueprint is the drawing|engineer 是工程师（人）；blueprint 是图纸蓝图|blueprint is a detailed drawing or plan, not a person who checks drawings or calculates weight|blueprint 是图纸，不是核对图纸、设计塔楼或计算承重的工程师|girder is a long steel beam, not a person who designs bridges and towers|girder 是钢大梁，不是设计建筑的人|en · gi · neer|en + soft g (/dʒ/) + double e in -neer|en、读 /dʒ/ 的 g 加含 ee 的 -neer
      blueprint|a detailed plan followed line by line by builders|a drawing showing where every door goes|a detailed building plan drawn by an architect|blueprint is a detailed plan; foundation is the physical base under a building|blueprint 是施工蓝图；foundation 是实体地基|foundation is the solid physical base under a building, not a paper plan followed line by line|foundation 是建筑物底下的实体地基，不是画门洞位置、逐行照做的图纸|truss is a triangular frame of beams, not a detailed architectural plan|truss 是三角形桁架，不是建筑师画的设计蓝图|blue · print|compound word: blue + print|合成词：blue 加 print
      arch|a curved stone structure standing over a gate|a bridge's single curved opening over water|a curved structure carrying weight down to its sides|arch is a curved opening structure; dome is a half-ball roof|arch 是弧形拱洞；dome 是半球形穹顶|dome is a round half-ball roof covering a whole hall, not a curved arch over a gate or bridge opening|dome 是覆盖整座大厅的半球屋顶，不是门洞或桥洞上的单道弧拱|span is the horizontal distance between bridge supports, not a curved stone structure carrying weight down its sides|span 是桥墩之间的水平跨度距离，不是把重量导向两侧的石拱|arch|ar saying /ɑːr/ + ch|ar 加结尾 ch
      dome|a round church roof visible across a city|a round roof with a light hole at the top|a half-ball roof covering a hall with no columns|dome is a round half-ball roof; arch is a curved opening structure|dome 是半球形圆屋顶；arch 是弧形拱门拱桥|arch is a curved structure over a doorway or bridge opening, not a round half-ball roof covering an entire hall|arch 是门洞或桥洞上的弧拱，不是罩住整座大厅的半球穹顶|truss is a frame made of triangular beams, not a smooth round half-ball roof|truss 是三角形梁架，不是圆滑的半球形屋顶|dome|long o + m + silent e|长音 o 加 m 和词尾 e
      foundation|a deep solid base poured before building walls|a cracked building base making a house lean|a tower base extending forty meters underground|foundation is the solid base under a building; concrete is the building material|foundation 是建筑物地基；concrete 是混凝土材料|girder is a steel beam high in a frame, not the deep base poured underground before walls go up|girder 是高空骨架上的钢大梁，不是深埋地下四十米的地基|concrete is the uncountable building material itself, not a countable structural base that can crack and make a house lean|concrete 是不可数的混凝土材料本身，不是能接 a 或 deep 的建筑物地基|foun · da · tion|ou saying /aʊ/ + da + -tion|发 /aʊ/ 的 ou 加 da 和 -tion
      concrete|wet building mix poured into a wooden frame|a hardened sidewalk building material|a wet mix drying as hard as rock|concrete is the cement-and-stone material; foundation is the structural base|concrete 是混凝土材料；foundation 是地基结构|foundation is the structural base of a building, not the wet uncountable mix poured for a sidewalk|foundation 是建筑物地基，不是浇筑人行道的湿混凝土材料|cable is a thick wire rope, not a wet mix that dries as hard as rock|cable 是钢丝缆索，不是干后会像岩石一样坚硬的建筑材料|con · crete|con- + cr blend + long e + silent e|con-、cr 连缀加发长 e 的 ete
      girder|a long steel beam lifted by crane to a frame top|long steel beams bolted one to the next|a narrow steel beam walked high above a street|girder is a rigid steel beam; cable is a thick wire rope|girder 是坚硬的钢大梁；cable 是钢丝缆索|cable is a thick wire rope that hangs and bends, not a rigid steel beam bolted end to end|cable 是柔韧悬挂的钢丝缆索，不是彼此用螺栓拼接、能走人的硬钢大梁|truss is an entire triangular frame of many short beams, not one single narrow steel beam|truss 是由许多短梁拼成的三角形框架，不是单根长钢梁|gir · der|hard g (/g/) + ir saying /ɜːr/ + -der|硬音 g、读 /ɜːr/ 的 ir 加 -der
      truss|a wooden triangular frame holding up a roof|a triangular frame strong for its light weight|a railway bridge built from a triangular steel frame|truss is a triangular beam frame; girder is one straight steel beam|truss 是三角形桁架；girder 是单根直钢梁|girder is one single straight beam of steel, not a frame of short beams joined into triangles|girder 是单根直钢梁，不是由短梁拼成多个三角形的桁架|arch is a curved structure, not a frame made of straight three-sided triangles|arch 是弧形拱，不是由三角形组成的直梁桁架|truss|tr blend, short u, and double s|tr 连缀、短 u 和双写 s
      span|a one-kilometer stretch between bridge towers|the longest distance between bridge supports|a main river crossing leaping between towers|span is the distance between supports; arch is a curved structure|span 是支撑点之间的跨度；arch 是弧形拱|arch is a curved stone or steel structure, not a measured distance of one kilometer between bridge towers|arch 是弧形拱结构，不是两座桥塔之间一公里的跨度距离|cable is a thick wire rope holding a bridge up, not the distance measured between supports|cable 是吊起桥面的钢缆，不是桥墩之间的跨度距离|span|sp blend, short a, and n|sp 连缀、短 a 加 n
      cable|thick steel wire rope holding up a bridge road|a thick wire rope hanging between two towers|a strong steel wire rope lifting an elevator|cable is a thick wire rope; girder is a rigid steel beam|cable 是钢丝缆索；girder 是硬钢大梁|girder is a rigid straight steel beam, not a thick wire rope lifting an elevator or hanging between towers|girder 是坚硬直钢梁，不能像钢缆一样吊起电梯或在两塔间悬垂|span is the horizontal distance between bridge supports, not a thick wire rope lifting an elevator|span 是桥梁跨度距离，不是拉动电梯的钢丝绳|ca · ble|long a in ca + -ble ending|ca 读长 a 加结尾 -ble
    `,
  },
);

const forces = batch(
  "words-of-forces-on-structures",
  ["Words of Forces on Structures", "结构受力的词"],
  ["the forces that push and pull on buildings and bridges", "推拉建筑和桥梁的力"],
  `
  tension|a pulling force that stretches something|拉力|The hanging cables are under pulling ___ because the road hangs from them.|A rope pulled in a tug of war is under ___.|Too much pulling ___ will snap the wire.|compression,load
  compression|a pushing force that squeezes something|压力|The columns are under squeezing ___ from the heavy roof.|Stone is strong under squeezing ___ but weak when it is pulled.|Squeezing a sponge puts it under ___.|tension,brace
  load|the weight that a structure must carry|荷载|The bridge can carry a weight, or ___, of a hundred trucks.|Heavy snow on the roof added to its ___.|Each beam shares part of the weight, or ___.|tension,brace|loads
  stable|steady and not likely to fall|稳定的|A wide base makes a tower steady and more ___ so it will not tip over.|The ladder stood steady and ___ on the flat floor.|Triangles keep the frame steady and ___ so it will not topple.|flexible,rigid
  brace|a support that holds something steady|支撑物|A wooden ___ kept the wall from falling while the glue dried.|Workers added a diagonal ___ that ran from corner to corner of the frame.|The fence leaned until we nailed a supporting ___ to it.|load,tension|braces
  reinforce|to make stronger by adding support|加固|Steel rods ___ the concrete and make it stronger.|We had to ___ the weak shelf with brackets before putting books on it.|Builders ___ old bridges with extra steel so that they can carry modern trucks.|withstand,sway|reinforced
  withstand|to stand up against something without breaking|承受|The building was designed to ___ earthquakes without breaking.|Can the tent ___ strong winds without tearing?|These walls can ___ a flood without giving way.|reinforce,sway
  sway|to swing gently from side to side|摇摆|Tall towers ___ gently from side to side in strong wind.|The rope bridge began to ___ back and forth as we crossed it.|Trees ___ gently in the breeze.|reinforce,withstand|swayed
  flexible|able to bend without breaking|柔韧的，灵活的|A ___ tower bends in the wind instead of cracking.|The bendable ruler is made of ___ plastic.|Bamboo bends easily; it is ___ yet strong.|rigid,stable
  rigid|stiff and not able to bend|刚性的，僵硬的|A stiff, ___ frame does not bend at all.|The thick steel beam is completely ___ and will not bend.|Dry spaghetti is stiff and ___ and snaps when you bend it.|flexible,stable
  `,
  "context-clues",
  {
    intro: t(
      "Every bridge balances invisible pushes and pulls: hanging cables stretch under **tension**, stone pillars squeeze under **compression**, and builders **reinforce** a **stable** frame with a diagonal **brace** so it can carry a heavy **load** and **withstand** fierce winds. These ten words explain structural forces.",
      "每座桥梁都在平衡无形的推力与拉力：悬索承受拉力（**tension**），石柱承受压力（**compression**），建造者用斜撑（**brace**）加固（**reinforce**）稳固（**stable**）的框架，使它能承担重荷载（**load**）并承受（**withstand**）狂风。这十个词讲述结构受力。",
    ),
    watchOut: {
      meanings: t(
        "Tell **tension** (a *pulling* force that stretches cables or ropes) apart from **compression** (a *pushing* force that squeezes columns or sponges).",
        "分清 **tension**（把缆索或绳子拉长的拉力）和 **compression**（把柱子或海绵压扁的压力）。",
      ),
      use: t(
        "Tell **flexible** (bends without breaking, like bamboo) apart from **rigid** (stiff and unable to bend at all, like dry spaghetti) and **stable** (steady and unlikely to tip over).",
        "分清 **flexible**（能弯不断、柔韧灵活）、**rigid**（僵硬不可弯的刚性）和 **stable**（稳固不易倾倒）。",
      ),
      spelling: t(
        "Watch **compression** (double *s* + *-ion*), **reinforce** (*re-* + *in-* + *force*), and **rigid** (soft *g* /dʒ/ before *-id*).",
        "注意 **compression** 的双写 **s**、**reinforce**（*re- + in- + force*），以及 **rigid** 中读 /dʒ/ 的 **g**。",
      ),
    },
    notes: `
      tension|hanging cables stretched by a heavy road|a tug-of-war rope pulled from both ends|pulling force threatening to snap a wire|tension pulls and stretches; compression pushes and squeezes|tension 是拉长的拉力；compression 是挤压的压力|compression is a pushing force that squeezes, the exact opposite of pulling and stretching a cable or rope|compression 是挤压的压力，与拉紧缆索或拔河绳的拉力正相反|load is the total weight a structure carries, not specifically the pulling force stretching a rope or wire|load 指结构承受的总重量荷载，不特指拉紧绳索或电线的拉力|ten · sion|short e + -sion ending saying /ʃən/|短 e 加读 /ʃən/ 的 -sion
      compression|columns squeezed by a heavy roof above|stone strong when squeezed yet weak when pulled|a sponge squeezed tightly in a hand|compression pushes and squeezes; tension pulls and stretches|compression 是挤压的压力；tension 是拉长的拉力|tension is a pulling force that stretches, the exact opposite of squeezing a column, stone, or sponge|tension 是拉长的拉力，与重压石柱或捏扁海绵的压力正相反|brace is a physical support holding something steady, not the squeezing force pressing on it|brace 是实体支撑物，不是挤压物体的压力|com · pres · sion|com- + pr blend + double s + -ion|com-、pr 连缀加双写 s 和 -ion
      load|the weight of a hundred trucks carried by a bridge|extra weight added to a roof by heavy snow|shared weight supported by each beam|load is the weight carried; tension is a pulling force|load 是承担的重量荷载；tension 是拉力|tension is a stretching pulling force, not the weight of trucks or snow resting on a structure|tension 是拉伸的拉力，不是压在桥面或屋顶上的卡车或积雪重量|brace is a physical support holding a frame steady, not the weight of trucks or snow being carried|brace 是支撑杆件，不是结构承载的重量荷载|load|oa saying long o + d (not lode)|发长 o 的 oa 加 d
      stable|a wide-based tower staying steady without tipping|a ladder standing steady on a flat floor|a triangular frame staying steady without toppling|stable is steady and unlikely to fall; flexible bends easily|stable 是稳固不易倒；flexible 是可弯曲|flexible means bending without breaking, not standing steady so a ladder or tower will not tip over|flexible 指柔韧能弯，不表示梯子或高塔站得稳不倾倒|rigid means stiff and unable to bend, not specifically steady and balanced against tipping over|rigid 指僵硬不能弯，不特指站得稳、不倾倒的稳定性|sta · ble|st blend, long a, and -ble ending|st 连缀、长 a 加 -ble
      brace|a wooden support holding a wall while glue dries|a diagonal support running corner to corner|a supporting strip nailed to a leaning fence|brace is a physical support holding something steady; load is the weight carried|brace 是稳住结构的实体支撑物；load 是承重荷载|load is the weight a structure carries, not a wooden or diagonal support nailed onto a wall or fence|load 是承受的重量，不是钉在篱笆或框架上起固定作用的支撑物|tension is an invisible pulling force, not a physical piece of wood or metal nailed on for support|tension 是无形拉力，不是钉上去防倾倒的实体支撑件|brace|br blend + soft c (/s/) + silent e|br 连缀、读 /s/ 的 c 和词尾 e
      reinforce|steel rods strengthening concrete|brackets strengthening a weak bookshelf|extra steel strengthening old bridges for modern trucks|reinforce adds support to make stronger; withstand resists without breaking|reinforce 是加装支撑使其更坚固；withstand 是抵挡承受住|withstand means surviving a force like an earthquake or wind without breaking, not adding rods or brackets to strengthen something|withstand 是抵御地震狂风而不坏，不是加钢筋或支架去加固|sway means swinging gently side to side, not adding support to strengthen concrete, shelves, or bridges|sway 是左右轻摇，不是加固结构|re · in · force|re- + in- + force (soft c + silent e)|前缀 re-、in- 加 force
      withstand|a building standing up against earthquakes|a tent surviving strong winds without tearing|walls holding firm against a flood|withstand stands up against force without breaking; reinforce adds support|withstand 是经受住外力不损坏；reinforce 是加固|reinforce means adding extra support to strengthen a structure, not surviving an earthquake, wind, or flood without breaking|reinforce 是添加支撑加固，不是直接抵挡地震、强风或洪水|sway means swinging gently side to side, not standing up against an earthquake or flood without breaking|sway 是左右摇晃，不是抵御地震或洪水不垮塌|with · stand|compound word: with + stand|合成词：with 加 stand
      sway|tall towers swinging gently in strong wind|a rope bridge swinging back and forth under feet|trees swinging gently in a breeze|sway swings gently side to side; withstand stands firm without breaking|sway 是左右轻摇；withstand 是抵挡住不坏|reinforce means adding support to make something stronger, not swinging gently side to side in the wind|reinforce 是加固增强，不是在风中左右摇摆|withstand means resisting a force without breaking (taking a direct object), not swinging gently in the breeze|withstand 需接宾语表示“承受抵御”，不是在微风中轻轻摇曳|sway|sw blend + ay saying long a|sw 连缀加发长 a 的 ay
      flexible|a tower bending safely in the wind without cracking|a ruler made of bendable plastic|bamboo bending easily while staying strong|flexible bends without breaking; rigid is stiff and cannot bend|flexible 是柔韧能弯不断；rigid 是僵硬不可弯|rigid means stiff and unable to bend at all, the exact opposite of bending safely without cracking|rigid 僵硬不能弯，与能随风弯曲不断裂正相反|stable means steady and unlikely to fall, not able to bend easily like plastic or bamboo|stable 指稳固不倒，不指塑料尺或竹子那样容易弯曲|flex · i · ble|fl blend + x + -ible ending|fl 连缀、x 加结尾 -ible
      rigid|a stiff frame refusing to bend at all|a thick steel beam that will not bend|stiff dry spaghetti snapping when bent|rigid is stiff and cannot bend; flexible bends without breaking|rigid 是僵硬不能弯；flexible 是柔韧可弯|flexible means able to bend without breaking, the exact opposite of a stiff frame or dry spaghetti that snaps|flexible 柔韧易弯，与纹丝不动或一弯就断正相反|stable means steady and unlikely to tip over, not specifically stiff and unable to bend|stable 指稳固不倾倒，不特指坚硬僵直、无法弯曲|rig · id|short i + soft g (/dʒ/) + -id|短 i、读 /dʒ/ 的 g 加 -id
    `,
  },
);

const planning = batch(
  "words-for-planning-and-solving",
  ["Words for Planning and Solving", "规划与解决问题的词"],
  ["planning a design and solving problems", "规划设计和解决问题"],
  `
  criteria|the standards a design must meet|标准|The design ___ said that the bridge must hold ten kilograms.|Our design met all the required ___ except the one about cost.|Before you build, list the ___ for success.|constraint,goal
  constraint|a limit you must work within|限制条件|Our strict ___ was that we could use only twenty straws.|Time was the biggest ___, because we had only one hour.|A tight budget of money is a ___ on most projects.|criteria,option|constraints
  revise|to change something to make it better|修改|After the test, we had to ___ our design to make it better.|Writers ___ their drafts many times to improve them.|Please ___ your plan to make it stronger and try again.|confirm,abandon|revised
  alternative|another choice instead of the first one|替代方案|If the bridge is closed, take the ___ route instead.|Glue did not work, so we tried tape as our replacement ___.|The farmers needed an ___ to the dry well, so they dug a new one.|approach,strategy|alternatives
  option|one of the things you can choose|选项|One choice, or ___, is to build the tower out of paper.|Each ___ we could pick had good and bad points.|Walking is the cheapest ___ we can choose.|goal,constraint|options
  approach|a way of dealing with a problem|方法|Our first ___ to the problem failed, so we tried a new way.|Her ___ to the challenge was to test small models first.|A careful ___ saves time in the end.|goal,criteria
  strategy|a plan for reaching a goal|策略|Our winning ___ was to build the base first and test it.|The team used a clever game ___ to win.|A good ___ for spelling a long word is to break it into parts.|option,constraint|strategies
  modify|to change a part of something|修改，改动|We had to ___ the wheels so that the car rolled straight.|You can ___ the recipe by adding less sugar.|Engineers ___ the plane's wings to make it faster.|abandon,preserve|modified
  durable|lasting a long time without wearing out|耐用的|Steel is more ___ than wood and lasts far longer.|These ___ boots last for years without wearing out.|The bridge must be ___ enough to last a century.|brittle,porous
  goal|what you want to reach or do|目标|Our ___ was to build the tallest tower.|The main ___ of the project is to clean the river.|She finally reached her ___ of reading fifty books.|criteria,strategy|goals
  `,
  "context-clues",
  {
    intro: t(
      "Every design challenge starts with a clear **goal**, a list of **criteria** your bridge must meet, and a strict **constraint** like a twenty-straw limit—so teams compare every **option**, pick a clever **strategy**, and **revise** or **modify** parts until the build is **durable**. These ten words power problem-solving.",
      "每项设计挑战都从明确目标（**goal**）开始，要满足各项标准（**criteria**），还要遵守限制条件（**constraint**）；团队权衡每个选项（**option**）、制定策略（**strategy**），反复修改（**revise**）和局部改动（**modify**），直到作品耐用（**durable**）。这十个词是工程规划与解题的常用词。",
    ),
    watchOut: {
      meanings: t(
        "Tell **criteria** (the *standards* a design must meet to succeed, such as holding ten kilograms) apart from **constraint** (a *limit* you must work inside, such as only one hour or twenty straws).",
        "分清 **criteria**（作品必须达到的成功标准，如承重十公斤）和 **constraint**（必须遵守的限制条件，如时间或材料上限）。",
      ),
      use: t(
        "Tell **revise** (rework a whole draft or plan to improve it) apart from **modify** (adjust one specific part—like the wheels, wings, or sugar amount—without redoing everything).",
        "分清 **revise**（整体修订完善草稿或方案）和 **modify**（调整改动某个局部部件或配方细节）。",
      ),
      spelling: t(
        "Watch **criteria** (plural noun ending in *-ia*), **constraint** (*con-* + *str* + *ai* + *nt*), and **strategy** (*strat-e-gy*, keep the *e* before *-gy*).",
        "注意 **criteria** 的复数结尾 **-ia**、**constraint** 中的 **ai**，以及 **strategy** 中 **-gy** 前的 **e**。",
      ),
    },
    notes: `
      criteria|required standards saying a bridge must hold ten kilograms|all required standards met except cost|a checklist of standards for success written before building|criteria are standards to meet; constraint is a limit to stay within|criteria 是要达到的标准；constraint 是不能超出的限制|constraint is a limit like twenty straws or one hour, not the plural list of standards a design must meet|constraint 是单数限制条件，不是必须全部满足的各项复数标准|goal is one overall target you aim for, not a plural checklist of required standards|goal 是单个总体目标，不是逐项核对的多条标准|cri · te · ri · a|cr blend, long i, and -ia plural ending|cr 连缀、长 i 加复数结尾 -ia
      constraint|a strict limit of only twenty straws|a one-hour time limit on a build|a tight money limit on a project|constraint is a limit you must stay within; criteria are standards to meet|constraint 是限制条件；criteria 是成功标准|criteria is a plural noun for standards a design must meet, not one singular limit like twenty straws or one hour|criteria 是复数标准，不能接在 a 或 was 后面指单条限制|option is one choice you can pick, not a strict limit restricting time, money, or materials|option 是可选方案，不是卡住时间、预算或材料的限制条件|con · straint|con- + str blend + ai saying long a + nt|con-、str 连缀加发长 a 的 ai 和 nt
      revise|improving a design after testing it|reworking drafts many times to make them better|improving a plan before trying again|revise changes a draft or plan to improve it; abandon gives it up completely|revise 是修订完善；abandon 是彻底放弃|confirm means proving something is true, not changing a design, draft, or plan to improve it|confirm 是证实属实，不是修改草稿或方案使其更好|abandon means leaving something behind and giving up on it, not reworking it to make it stronger|abandon 是彻底抛弃，不是动手修改让设计或计划变得更好|re · vise|re- + long i + silent e|re- 加发长 i 的 vise
      alternative|a second route taken when a bridge is closed|tape tried as a replacement when glue fails|digging a new well instead of a dry one|alternative is a replacement choice instead of the first one; strategy is an overall plan|alternative 是替换原方案的替代选择；strategy 是整体策略|approach is a general way of dealing with a problem, not a backup route or replacement item like tape for glue|approach 是处理问题的一般方法，不是绕行替代路线或代替胶水的胶带|strategy is an overall plan to reach a goal, not a direct replacement route or substitute for a dry well|strategy 是达成目标的整体策略，不是封桥后的替代路线或替换品|al · ter · na · tive|al + ter + na + -tive|al、ter、na 加 -tive
      option|building from paper as one possible choice|each choice having good and bad points|walking as the cheapest choice to pick|option is one available choice; constraint is a restriction|option 是可选方案之一；constraint 是限制条件|goal is the final target you want to reach, not one of several choices like paper or walking|goal 是最终目标，不是可供挑选的几个备选项之一|constraint is a limit restricting what you can do, not a choice you freely pick|constraint 是限制条件，不是供人挑选的选项|op · tion|short o + p + -tion ending|短 o、p 加结尾 -tion
      approach|a first problem-solving way that failed|testing small models first as a problem-solving way|a careful way of handling a task that saves time|approach is a way of dealing with a problem; goal is the target|approach 是处理问题的方法；goal 是最终目标|goal is the target you want to reach, not the method you try when solving a problem|goal 是想要达成的目标，不是解决问题时采取的方法路径|criteria is a plural list of standards to meet, not a singular way of tackling a problem|criteria 是复数标准，不能接 a 或 first 指单种解题方法|ap · proach|double p + oa saying long o + ch|双写 p 加发长 o 的 oa 和 ch
      strategy|a winning plan of building and testing the base first|a clever game plan helping a team win|a plan of breaking long words into parts to spell them|strategy is a plan to reach a goal; constraint is a limit|strategy 是达成目标的策略计划；constraint 是限制条件|option is just one single choice among others, not a clever step-by-step plan for winning or spelling|option 只是单个备选项，不是步步推进的制胜或拼词策略|constraint is a limit restricting what you can do, not a clever plan for winning or spelling|constraint 是限制条件，不是达成目标的策略方法|strat · e · gy|str blend + e + soft g (/dʒ/) in -gy|str 连缀、e 加读 /dʒ/ 的 -gy
      modify|adjusting car wheels so the car rolls straight|changing a recipe by using less sugar|adjusting airplane wings to increase speed|modify changes a specific part; preserve keeps something unchanged|modify 是局部改动调整；preserve 是保持原样不变|abandon means giving up and leaving something behind, not adjusting wheels, a recipe, or wings to work better|abandon 是彻底放弃，不是调整局部零件或配方|preserve means keeping something unchanged and safe from decay, the exact opposite of altering a part|preserve 是原封不动地保存，与改动零件或配方正相反|mod · i · fy|short o + i + -fy ending saying long i|短 o、i 加发长 i 的动词后缀 -fy
      durable|steel lasting far longer than wood|boots lasting for years without wearing out|a bridge lasting a whole century|durable lasts a long time without wearing out; brittle breaks easily|durable 是经久耐用；brittle 是易碎折断|brittle means hard but easily cracked or shattered, the exact opposite of lasting for years or a century|brittle 易碎易裂，与经久耐用正相反|porous means full of tiny holes letting water pass through, not lasting long without wearing out|porous 指多孔透水，不表示耐用长久|du · ra · ble|long u in du + ra + -ble|du 读长 u 加 ra 和 -ble
      goal|building the tallest tower as the target|cleaning the river as a project's main target|reading fifty books as a target finally reached|goal is what you aim to achieve; strategy is the plan to get there|goal 是要达到的目标；strategy 是实现目标的策略|criteria is a plural list of standards a design must meet, not one singular target like reading fifty books|criteria 是复数标准，不能接 Our ___ was 或 her ___ 指单个目标|strategy is the method or plan used to reach a target, not the finished target itself like reading fifty books|strategy 是达成目标的手段计划，不是“读完五十本书”这个目标本身|goal|oa saying long o + l|发长 o 的 oa 加 l
    `,
  },
);

const cities = batch(
  "words-of-cities",
  ["Words of Cities", "城市的词"],
  ["cities and the land around them", "城市及其周边"],
  `
  skyscraper|a very tall building|摩天大楼|The ___ has more than a hundred floors.|From the top of the hundred-story ___, the cars looked like ants.|A crane stood on the roof of the half-built ___.|tunnel,district|skyscrapers
  suburb|an area of homes at the edge of a city|郊区|We live in a quiet residential ___ outside the city.|Every morning, trains carry workers from the outer ___ into the city.|The new ___ at the edge of the city has houses with gardens.|district,skyline|suburbs
  urban|of a city|城市的|Crowded ___ areas have many apartments.|Noise is a problem in crowded ___ life.|Many ___ city schools have no big grass fields.|rural,steep
  rural|of the countryside|乡村的|In quiet ___ countryside areas, houses are far apart.|My grandparents live on a ___ countryside farm.|The bus runs only twice a day in this ___ farm area.|urban,dense
  skyline|the outline of buildings against the sky|天际线|The city's ___ of tall towers glowed at sunset.|A new hundred-story tower changed the city's ___.|From the boat we could see the whole city's ___ against the sky.|skyscraper,intersection
  district|an area of a city with something special about it|区|The city's theater ___ is full of bright lights.|Banks fill the city's business ___.|Our school is inside the city's northern ___.|suburb,traffic|districts
  pedestrian|a person who is walking|行人|A ___ on foot must wait for the green light to cross.|The bridge has a walkway lane for each ___ and one for bikes.|The car stopped at the crosswalk to let a walking ___ cross.|traffic,skyline|pedestrians
  tunnel|a passage under the ground or under water|隧道|The train went into a ___ under the river.|Workers dug a ___ right through the mountain.|Cars drive through the dark underground ___ with their lights on.|intersection,skyscraper|tunnels
  traffic|cars and other vehicles moving on roads|交通，车流|Rush-hour ___ was so heavy that we were late.|Police directed cars and ___ around the accident.|There is less road ___ on Sundays.|pedestrian,district
  intersection|a place where roads cross|十字路口|Turn left at the next ___ where the two streets meet.|Traffic lights control the busy ___ where four roads cross.|Two cars crashed at the busy ___.|tunnel,district|intersections
  `,
  "context-clues",
  {
    intro: t(
      "From a quiet **suburb** outside town, commuters ride trains through a river **tunnel** into the busy **urban** business **district**, where **traffic** pauses at every **intersection** for each **pedestrian** beneath a glowing **skyline** of glass **skyscrapers**. These ten words map city life and its surroundings.",
      "通勤者从城外宁静的郊区（**suburb**）乘列车穿过水底隧道（**tunnel**）驶入繁华的城市（**urban**）商业区（**district**）；十字路口（**intersection**）的车流（**traffic**）礼让行人（**pedestrian**），头顶是摩天大楼（**skyscraper**）勾勒出的天际线（**skyline**）。这十个词描绘城市与周边。",
    ),
    watchOut: {
      meanings: t(
        "Tell **skyscraper** (one single very tall building) apart from **skyline** (the whole *outline* of all the city's buildings seen against the sky).",
        "分清 **skyscraper**（单栋高耸的摩天大楼）和 **skyline**（整片城市建筑群在天空映衬下形成的轮廓线——天际线）。",
      ),
      use: t(
        "Tell **urban** (of the city) apart from **rural** (of the countryside) and **suburb** (a residential town area on the *edge* of a city, unlike a **district** *inside* the city).",
        "分清 **urban**（城市的）、**rural**（乡村的）、**suburb**（城市边缘的居住郊区）和 **district**（城市内部按功能划分的区域）。",
      ),
      spelling: t(
        "Watch **pedestrian** (*ped-* for foot + *-estrian*), **tunnel** (double *n* + *-el*), and **intersection** (*inter-* + *section*).",
        "注意 **pedestrian** 中的 **ped-**（脚）和 **-estrian**、**tunnel** 的双写 **n**，以及 **intersection**（*inter- + section*）。",
      ),
    },
    notes: `
      skyscraper|a tall building with more than a hundred floors|a hundred-story tower making cars below look like ants|a half-built tall tower with a crane on its roof|skyscraper is one very tall building; district is a whole city area|skyscraper 是单栋摩天大楼；district 是整片城区|tunnel is an underground or underwater passage, not a hundred-story building rising into the sky|tunnel 是地下或水底隧道，不是高逾百层的摩天大楼|district is an area of a city, not one single tall building with a roof and crane|district 是整片城区，不是带有屋顶和塔吊的单栋高楼|sky · scrap · er|compound word: sky + scrap(e) + -er|合成词：sky 加去 e 的 scrape 和 -er
      suburb|a quiet residential area outside the city|an outer home area sending morning train commuters into town|a residential area with gardens at the city's edge|suburb is a home area at a city's edge; district is an area inside a city|suburb 是城市边缘的居住郊区；district 是城内功能区|district is an area inside a city known for theaters or banks, not a quiet home area outside the city|district 是城市内部的功能分区，不是城外边缘的居住郊区|skyline is the outline of buildings against the sky, not a residential area of houses and gardens|skyline 是城市建筑轮廓线，不是有花园住宅的郊区|sub · urb|sub- (under/near) + urb (city)|前缀 sub-（靠近）加 urb（城市）
      urban|crowded city areas full of apartments|noisy city life|city schools without large grass fields|urban means of the city; rural means of the countryside|urban 是城市的；rural 是乡村的|rural means of the countryside with farms and spaced-out houses, the exact opposite of crowded city life|rural 指地广人稀的乡村，与高楼林立的繁华都市正相反|steep means rising or falling sharply like a cliff, not belonging to a crowded city|steep 指坡度陡峭，不表示“城市的”|ur · ban|ur saying /ɜːr/ + -ban|发 /ɜːr/ 的 ur 加 -ban
      rural|countryside areas where houses sit far apart|a grandparents' countryside farm|a farm area with only two buses a day|rural means of the countryside; urban means of the city|rural 是乡村的；urban 是城市的|urban means of a crowded city, the exact opposite of quiet countryside and farms|urban 指拥挤的城市，与宁静乡村和农田正相反|dense means tightly packed together, the opposite of countryside areas where houses sit far apart|dense 指致密拥挤，与房屋相距甚远的乡村正相反|ru · ral|long u in ru + -ral ending|ru 读长 u 加结尾 -ral
      skyline|the glowing outline of tall city towers at sunset|the city silhouette changed by a new tower|the city's building outline viewed from a boat|skyline is the whole outline of buildings against the sky; skyscraper is one tall building|skyline 是整片建筑轮廓天际线；skyscraper 是单栋高楼|skyscraper is one single tall building, not the whole outline of all the city's buildings against the sky|skyscraper 只是单栋大楼，不是从船上望见的整座城市天际轮廓|intersection is a place where roads cross, not the silhouette of buildings glowing against the sky|intersection 是道路十字路口，不是映衬在天空中的建筑轮廓|sky · line|compound word: sky + line|合成词：sky 加 line
      district|a city's bright theater area|a city's business area filled with banks|the northern section inside a city|district is an area inside a city; suburb is a home area at the city's edge|district 是城内区域；suburb 是城外郊区|suburb is a residential area outside the city edge, not a downtown theater, business, or inner city area|suburb 是城外居住郊区，不是城里的剧院区或商业金融区|traffic is vehicles moving on roads, not a specialized area of a city|traffic 是路面车流，不是城市里的功能分区|dis · trict|short i + tr blend + ct|短 i、tr 连缀加 ct
      pedestrian|a walker waiting for a green light to cross|a walker using a bridge's foot walkway|a person on foot crossing at a crosswalk|pedestrian is a person walking; traffic is vehicles on roads|pedestrian 是步行行人；traffic 是行驶车流|traffic is cars and vehicles moving on roads, not a single person walking on foot|traffic 是道路上的车辆车流，不是等绿灯过马路的步行者|skyline is the outline of city buildings against the sky, not a person walking across a street|skyline 是城市天际线，不是过马路的行人|pe · des · tri · an|pe + des + tr blend + -ian|pe、des、tr 连缀加 -ian
      tunnel|an underwater passage carrying a train under a river|a dug passage going right through a mountain|a dark underground passage where cars use headlights|tunnel goes under ground or water; intersection is where surface roads cross|tunnel 是地下或水底隧道；intersection 是地面交叉路口|intersection is a surface spot where roads cross, not a dark passage dug through a mountain or under a river|intersection 是地面十字路口，不是穿山越河的地下通道|skyscraper is a tall building rising into the sky, the opposite of an underground or underwater passage|skyscraper 是高耸入云的大楼，与地下或水底隧道正相反|tun · nel|short u, double n, and -el ending|短 u、双写 n 加 -el
      traffic|heavy rush-hour vehicles making travelers late|cars directed by police around an accident|lighter vehicle flow on Sunday roads|traffic is vehicles moving on roads; pedestrian is a person walking|traffic 是路面车流；pedestrian 是行人|pedestrian is a single person walking on foot, not uncountable heavy cars and vehicles during rush hour|pedestrian 是单个步行者，不是高峰期拥堵的不可数车流|district is an area of a city, not vehicles directed by police around an accident|district 是城市分区，不是交警在事故现场疏导的车流|traf · fic|tr blend, short a, double f, and -ic|tr 连缀、短 a、双写 f 加 -ic
      intersection|the crossing point where two streets meet|a busy four-road crossing run by traffic lights|a road crossing where two cars collided|intersection is where roads cross; tunnel is an underground passage|intersection 是道路十字路口；tunnel 是地下隧道|tunnel is a passage under ground or water, not a surface spot where streets meet and traffic lights stand|tunnel 是地下或水底通道，不是装有红绿灯、两条街道交汇的十字路口|district is a large city area, not one specific corner where two roads cross|district 是一大片城区，不是转弯或装红绿灯的具体路口|in · ter · sec · tion|inter- (between) + section|前缀 inter-（在……之间）加 section
    `,
  },
);

const detectives = batch(
  "words-of-mysteries-and-detectives",
  ["Words of Mysteries and Detectives", "推理与侦探的词"],
  ["mysteries and detectives", "推理故事和侦探"],
  `
  detective|a person whose job is to solve crimes|侦探|The ___ looked for footprints by the window to solve the crime.|A famous ___ solved the case in a single day.|The ___ questioned everyone about where they had been at midnight.|witness,culprit|detectives
  suspect|a person who is thought to have done a crime|嫌疑人|Each ___ claimed to be innocent, so the detective had three people to check.|The police let the ___ go when they learned he had been at home.|The main ___ was seen near the shop just before the theft.|witness,culprit|suspects
  witness|a person who saw something happen|目击者|A ___ saw a man run out of the bakery.|The ___ told the judge what she had seen.|Was there any ___ who saw the accident happen?|suspect,detective|witnesses
  alibi|proof that you were somewhere else when a crime happened|不在场证明|His ___ was that he had been at the cinema all evening.|The cinema ticket stub proved her ___.|The suspect had no ___ for the hour of the theft.|motive,clue
  clue|a sign that helps to solve a mystery|线索|A muddy boot print was the first ___ to solving the mystery.|The detective found a helpful ___ under the table.|Each ___ led closer to the answer.|alibi,fingerprint|clues
  motive|the reason someone does something|动机|Jealousy was the thief's ___ for stealing.|What ___ could anyone have for stealing a cake?|The detective searched for a ___—a reason why someone would steal the ring.|alibi,clue|motives
  culprit|the person who did something wrong|罪魁祸首，犯人|The guilty ___ who knocked over the vase turned out to be the cat.|We never caught the guilty ___ who actually broke the window.|In the end, the real ___ confessed to the crime.|suspect,witness
  fingerprint|the mark a fingertip leaves on something|指纹|The thief left a greasy ___ on the glass.|Dusting powder made the fingertip mark, or ___, show up.|No two people have the exact same ___ on their fingers.|clue,alibi|fingerprints
  deduce|to work out from clues|推断|From the mud on his shoes, she could ___ that he had been in the garden.|Can you ___ from these clues who took the cookies?|Detectives ___ answers from small details.|accuse,deny|deduced
  accuse|to say that someone did something wrong|指控，指责|Do not ___ him of stealing without proof.|The shopkeeper began to ___ the boy of stealing.|It is unfair to ___ someone of a crime just because they were nearby.|deduce,consider|accused
  `,
  "context-clues",
  {
    intro: t(
      "A sharp **detective** dusts a glass for a **fingerprint**, listens to a **witness**, checks each **suspect** for a **motive** and an **alibi**, and waits to **deduce** the real **culprit** before daring to **accuse** anyone. These ten words belong to classic mystery stories.",
      "敏锐的侦探（**detective**）在玻璃上提取指纹（**fingerprint**），询问目击者（**witness**），核查每位嫌疑人（**suspect**）的动机（**motive**）和不在场证明（**alibi**），直到推断（**deduce**）出真正罪犯（**culprit**）才敢指控（**accuse**）。这十个词是推理侦探故事的核心词。",
    ),
    watchOut: {
      meanings: t(
        "Tell **suspect** (someone *thought* to be involved who might turn out innocent) apart from **culprit** (the person who *actually did* the wrong deed) and **witness** (someone who merely *saw* it happen).",
        "分清 **suspect**（有作案嫌疑、可能清白的嫌疑人）、**culprit**（真正干坏事的罪魁祸首）和 **witness**（亲眼看见经过的目击者）。",
      ),
      use: t(
        "Tell **alibi** (proof that you were *somewhere else* at the time of the crime) apart from **motive** (the *reason* someone would commit a crime, like jealousy) and **clue** (any helpful sign pointing toward the answer).",
        "分清 **alibi**（案发时人在别处的不在场证明）、**motive**（作案原因动机）和 **clue**（帮助破案的任何线索）。",
      ),
      spelling: t(
        "Watch **alibi** (*al-i-bi*, ends in *-i*), **culprit** (*cul-* + *-prit*), and **accuse** (double *c* + *-use* with silent *e*).",
        "注意 **alibi** 结尾的 **i**、**culprit** 中的 **pr**，以及 **accuse** 的双写 **c**。",
      ),
    },
    notes: `
      detective|a crime-solver checking footprints by a window|a famous investigator solving a case in one day|an investigator questioning everyone about midnight|detective solves crimes; witness only saw what happened|detective 是负责破案的侦探；witness 只是目击者|witness is someone who saw an event happen, not the investigator questioning everyone and solving the case|witness 是亲眼看到事情经过的目击者，不是查脚印、审问众人并破案的侦探|culprit is the guilty person who committed the crime, not the investigator solving it|culprit 是作案的罪魁祸首，不是破案的侦探|de · tec · tive|de- + tec + -tive ending|de-、tec 加 -tive
      suspect|one of three people checked who claims innocence|someone released by police after being proved home|a person seen nearby who is thought to be involved|suspect is only thought guilty so far; culprit actually did it|suspect 是尚未定罪的嫌疑人；culprit 是真正的罪犯|witness is someone who saw a crime happen, not someone claiming innocence or being held and released by police|witness 是目击证人，不是自称清白、被警方排查或释放的嫌疑人|culprit is the proven guilty wrongdoer, not someone who turns out innocent and is let go by police|culprit 是确凿的作案者，不会像嫌疑人那样因证实清白而被警方释放|sus · pect|sus- + short e + ct blend|sus- 加短 e 和 ct
      witness|someone who saw a man run from a bakery|someone telling a judge what she saw|anyone who saw an accident happen|witness saw what happened; suspect is thought to have done it|witness 是亲眼所见的目击者；suspect 是嫌疑人|suspect is someone thought to have committed a crime, not an onlooker telling a judge what she saw|suspect 是嫌疑人，不是向法官陈述亲眼所见经过的目击者|detective is the professional crime-solver, not a bystander who happened to see an accident or bakery thief|detective 是破案侦探，不是碰巧撞见现场的目击者|wit · ness|short i + t + -ness (double s)|短 i、t 加双写 s 的 -ness
      alibi|proof of being at the cinema all evening|a cinema ticket stub proving where someone was|missing proof of whereabouts during a theft|alibi proves you were elsewhere; motive is the reason for a crime|alibi 是不在场证明；motive 是作案动机|motive is the reason why someone commits a crime, not a cinema ticket stub proving you were elsewhere|motive 是作案动机原因，不是证明案发时人在电影院的不在场证明|clue is any sign helping solve a mystery, not specifically proof that a suspect was somewhere else|clue 泛指破案线索，不特指证明嫌疑人案发时在别处的不在场证明|al · i · bi|short a + i + long i in -bi|短 a、i 加读长 i 的 -bi
      clue|a muddy boot print helping solve a mystery|a helpful sign found under a table|each sign leading closer to the answer|clue is any helpful sign; alibi proves you were elsewhere|clue 是破案线索；alibi 是不在场证明|alibi is proof that a suspect was somewhere else, not a muddy boot print or sign found under a table|alibi 是不在场证明，不是泥脚印或桌下发现的线索|fingerprint is specifically a fingertip mark, not a muddy boot print or general sign leading to an answer|fingerprint 专指指纹印，不能涵盖泥靴印或各类破案线索|clue|cl blend + ue saying /uː/|cl 连缀加读 /uː/ 的 ue
      motive|jealousy explaining why a thief stole|a reason anyone would steal a cake|a reason explaining why someone stole a ring|motive is the reason for an action; alibi proves you were elsewhere|motive 是做事的原因动机；alibi 是不在场证明|alibi is proof that you were somewhere else during a crime, not a reason like jealousy for stealing|alibi 是不在场证明，不是嫉妒之类的作案动机|clue is a physical sign or hint, not the inner reason why someone wanted to steal|clue 是破案迹象线索，不是促使人行窃的内心原因动机|mo · tive|long o in mo + -tive ending|mo 读长 o 加 -tive
      culprit|the guilty cat that knocked over the vase|the guilty wrongdoer who actually broke the window|the real wrongdoer who finally confessed|culprit actually did the wrong deed; suspect is only suspected|culprit 是真正的肇事罪犯；suspect 只是有嫌疑的人|suspect is someone only thought to be guilty who may be innocent, not the proven wrongdoer who confessed|suspect 只是尚未定案的嫌疑人，不是最终认罪或确凿闯祸的罪魁祸首|witness is someone who saw an event happen, not the guilty wrongdoer who broke a window or confessed|witness 是目击者，不是闯祸认罪的罪魁祸首|cul · prit|short u + l + pr blend + it|短 u、l、pr 连缀加 it
      fingerprint|a greasy mark left by a fingertip on glass|a fingertip mark revealed by dusting powder|a unique finger pattern different for every person|fingerprint is a fingertip mark; clue is any mystery sign|fingerprint 专指指纹；clue 泛指各类线索|clue is any general hint in a mystery, not specifically the unique skin-ridge mark on every person's fingertips|clue 泛指任何线索，不特指人人各不相同的手指指纹|alibi is proof of being somewhere else, not a greasy mark dusted on glass|alibi 是不在场证明，不是玻璃上洒粉显影的指纹|fin · ger · print|compound word: finger + print|合成词：finger 加 print
      deduce|working out from shoe mud that he was in the garden|figuring out from clues who took the cookies|working out answers from small details|deduce works out an answer from clues; accuse blames someone|deduce 是根据线索推断；accuse 是指责指控|accuse means blaming someone for wrongdoing (with "of"), not logically working out an answer from mud or small details|accuse 是指控某人犯罪（常配 of），不是从鞋泥和细节里推理得出结论|deny means saying something is not true, not working out a logical answer from clues|deny 是否认某事属实，不是根据线索推理得出答案|de · duce|de- + long u + soft c (/s/) + silent e|de- 加发长 u、读 /s/ 的 duce
      accuse|blaming someone for stealing without proof|a shopkeeper blaming a boy for stealing|unfairly blaming someone for a crime just for being nearby|accuse blames someone of wrongdoing; deduce reasons from clues|accuse 是指控某人做错事；deduce 是推理得出结论|deduce means working out a conclusion from clues, not directly blaming someone of stealing or a crime|deduce 是根据线索推断，不搭配人加 of 表示“指控某人偷窃”|consider means thinking carefully about something, not blaming someone of a crime|consider 是仔细权衡考虑，不搭配 of 表示“指控某人犯罪”|ac · cuse|double c (/k/) + long u + s saying /z/ + silent e|双写 c 加长 u 和读 /z/ 的 se
    `,
  },
);

const suspense = batch(
  "words-for-suspense-and-puzzles",
  ["Words for Suspense and Puzzles", "悬念与谜团的词"],
  ["suspense, puzzles and strange events", "悬念、谜团和怪事"],
  `
  suspicious|thinking that something is wrong, or making people think so|可疑的；起疑心的|The guard grew ___ and thought a theft was planned when the man kept eyeing the safe.|A ___ unattended package made the guard call the police.|Her distrustful, ___ glance made him nervous.|peculiar,uneasy
  puzzling|hard to understand|令人费解的|The missing key was ___, because the door was still locked.|It was ___ that the dog did not bark.|The instructions were so ___ that nobody could follow them.|baffled,eerie
  baffled|completely confused|困惑的|The detective was completely ___ by the locked empty room.|We were completely ___ and confused by the strange riddle in the attic.|Even the teacher looked ___ and confused by the tricky question.|puzzling,startled
  mysterious|strange and hard to explain|神秘的|A ___ stranger whose past nobody could explain arrived in town.|The ___ letter had no name or return address on it.|Unexplained lights appeared in the ___ house at night.|baffled,uneasy
  eerie|strange and frightening|怪异吓人的|The empty house felt spooky and ___ at night.|The fog made the old graveyard look spooky and ___.|The wind made spooky, ___ whistling sounds in the chimney.|peculiar,startled
  peculiar|strange or unusual|古怪的|There was an odd, ___ smell of burnt cinnamon in the kitchen.|He had an odd, ___ habit of whistling backward.|It is ___ and unusual that the clock stopped at midnight.|suspicious,baffled
  uneasy|worried and not comfortable|不安的|She felt worried and ___ walking home alone in the dark.|The long silence made everyone feel worried and ___.|The horses grew restless and ___ before the storm.|startled,sinister
  startled|suddenly surprised or frightened|受惊的|The ___ deer leaped suddenly into the woods when a twig snapped.|I was suddenly ___ by the loud bang and jumped.|The ___ cat jumped onto the shelf at the sudden clap.|uneasy,baffled
  conceal|to hide|隐藏|The thief tried to ___ the jewels in a flowerpot.|She could not ___ her smile.|A rug was used to ___ the trapdoor.|confirm,abandon|concealed
  sinister|seeming evil or dangerous|阴险的，不祥的|The evil villain gave a wicked, ___ smile.|An evil, ___ shadow crept behind the curtain.|The threatening, ___ note warned the shopkeeper of danger.|mysterious,peculiar
  `,
  "context-clues",
  {
    intro: t(
      "On a foggy night, a **puzzling** unsigned letter leaves the detective **baffled**, an **eerie** draft whistles through the empty hall, and the guard grows **suspicious** when a **sinister** figure tries to **conceal** a box behind the curtain. These ten words build mystery and suspense.",
      "雾夜里，一封令人费解（**puzzling**）的无名信让侦探困惑（**baffled**），怪异吓人（**eerie**）的穿堂风吹过空厅；当一个阴险（**sinister**）身影试图把盒子隐藏（**conceal**）在帘后时，守卫立刻起了疑心（**suspicious**）。这十个词营造悬念氛围。",
    ),
    watchOut: {
      meanings: t(
        "Tell **puzzling** (describes a *thing* or *problem* that is hard to understand, like confusing instructions) apart from **baffled** (describes a *person* who feels completely confused by it).",
        "分清 **puzzling**（修饰令人费解的“事物或问题”）和 **baffled**（修饰感到完全困惑的“人”）。",
      ),
      use: t(
        "Tell **uneasy** (a lingering, worried discomfort before a storm or in the dark) apart from **startled** (a *sudden* jump of surprise from a loud bang or snapping twig).",
        "分清 **uneasy**（持续忐忑不安的情绪）和 **startled**（被巨响或突然动静吓一跳的瞬间受惊）。",
      ),
      spelling: t(
        "Watch **eerie** (double *e* + *ie*), **suspicious** (*sus-pi-cious* with *-cious*), and **conceal** (*con-* + *ea* saying long *e* + *l*).",
        "注意 **eerie** 的双 **e** 加 **ie**、**suspicious** 结尾的 **-cious**，以及 **conceal** 中发长 e 的 **ea**。",
      ),
    },
    notes: `
      suspicious|a guard suspecting theft as a man eyes a safe|an unattended package prompting a police call|a distrustful glance making someone nervous|suspicious senses wrongdoing; uneasy feels worried|suspicious 是怀疑不对劲或惹人起疑；uneasy 是心里忐忑不安|peculiar simply means odd or unusual, not distrustful or suggesting a crime or danger|peculiar 只指古怪奇特，不带有怀疑行窃或惹警觉的“可疑”意味|uneasy means worried and uncomfortable inside a person, not distrusting a thief or describing an unattended package|uneasy 指内心不安，不能形容无人看管的包裹，也不特指怀疑有人作案|sus · pi · cious|sus- + pi + -cious ending|sus-、pi 加 -cious
      puzzling|a missing key when the door is still locked|a dog strangely failing to bark|instructions too confusing for anyone to follow|puzzling describes a confusing thing; baffled describes a confused person|puzzling 修饰令人费解的事物；baffled 修饰困惑的人|baffled describes a person who feels confused, not an inanimate key, event, or set of instructions|baffled 用来形容感到困惑的人，不能形容钥匙、事情或说明书|eerie means spooky and frightening, not simply hard to understand like confusing instructions|eerie 指怪异吓人，不指说明书或锁门谜题那样令人费解|puz · zling|short u, double z, and -ling|短 u、双写 z 加 -ling
      baffled|a detective completely confused by a locked room|people completely confused by an attic riddle|a teacher looking confused by a tricky question|baffled describes a confused person; puzzling describes a confusing thing|baffled 形容困惑的人；puzzling 形容费解的事|puzzling describes a hard-to-understand problem, not a person feeling confused|puzzling 用来形容令人费解的问题，不形容人本身感到困惑|startled means suddenly frightened by a loud noise or shock, not deeply confused by a riddle or question|startled 是突然受惊，不是面对谜题或难题时的困惑不解|baf · fled|short a, double f, and -led|短 a、双写 f 加 -led
      mysterious|a stranger whose past nobody can explain|an unsigned letter with no return address|a house showing unexplained lights at night|mysterious is strange and hard to explain; baffled is a confused person|mysterious 是神秘难解的；baffled 是感到困惑的|baffled means a person is confused, not an unexplained stranger, letter, or house|baffled 形容人的困惑状态，不能修饰来历不明的人、无名信或房子|uneasy means worried and uncomfortable inside, not hard to explain like an unsigned letter or night lights|uneasy 形容内心不安，不能修饰无名信或夜间发光的房子|mys · te · ri · ous|y saying short i + te + -rious|y 读短 i，加 te 和 -rious
      eerie|a spooky empty house at night|a foggy graveyard looking spooky|spooky wind whistling in a chimney|eerie is strange and frightening; peculiar is merely odd|eerie 是怪异吓人的；peculiar 只是古怪特别|peculiar means odd or unusual without being spooky or frightening|peculiar 只表示与众不同或古怪，不带毛骨悚然的吓人感|startled describes a person or animal suddenly surprised, not a house, graveyard, or wind sound|startled 形容人或动物受惊，不能形容空屋、墓地或风声|ee · rie|double e + r + ie|双写 e 加 r 和 ie
      peculiar|an odd smell of burnt cinnamon in a kitchen|an odd habit of whistling backward|the unusual fact of a clock stopping at midnight|peculiar is odd or unusual; suspicious suggests wrongdoing|peculiar 只是奇特古怪；suspicious 带有怀疑或危险意味|suspicious means suggesting wrongdoing or danger, not a harmlessly odd smell or whistling habit|suspicious 指怀疑有问题或危险，不适合形容无害的烤肉桂味或倒吹口哨习惯|baffled describes a confused person, not an odd smell, habit, or clock stopping|baffled 形容人困惑，不能修饰气味、习惯或时钟停摆|pe · cu · liar|pe + long u + -liar ending|pe、长 u 加结尾 -liar
      uneasy|feeling worried walking home alone in the dark|a long silence making everyone feel uncomfortable|horses growing restless before a storm|uneasy is lingering worried discomfort; startled is a sudden shock|uneasy 是持续的不安；startled 是瞬间的受惊|startled means suddenly shocked by a quick noise or movement, not a lingering worried feeling before a storm or in silence|startled 指被突发响动吓一跳，不是风暴前或长久沉默中慢慢涌起的不安|sinister means seeming evil or dangerous, not feeling worried and uncomfortable yourself|sinister 指阴险不祥，不是自己内心感到忐忑不安|un · eas · y|un- + easy (ea saying long e)|前缀 un- 加 easy
      startled|a deer leaping suddenly when a twig snaps|jumping suddenly at a loud bang|a cat jumping onto a shelf at a sudden clap|startled is a sudden fright; uneasy is lingering worry|startled 是突然受惊吓一跳；uneasy 是持续不安|uneasy is a slow, worried discomfort rather than an instant jump from a bang, clap, or snapping twig|uneasy 是持续的隐隐不安，不是听到巨响或拍手声瞬间惊跳|baffled means completely confused by a puzzle, not jumping suddenly at a loud noise|baffled 是完全困惑，不是被突如其来的声音吓一跳|star · tled|st blend + ar + -tled|st 连缀、ar 加 -tled
      conceal|a thief hiding jewels in a flowerpot|trying unsuccessfully to hide a smile|a rug hiding a trapdoor|conceal hides something from view; confirm proves something true|conceal 是隐藏遮掩；confirm 是证实属实|confirm means proving something is true, not hiding jewels, a smile, or a trapdoor from sight|confirm 是证实属实，不是把珠宝、微笑或活板门藏起来|abandon means leaving something behind forever, not hiding it out of sight|abandon 是彻底抛弃，不是悄悄隐藏遮盖|con · ceal|con- + soft c (/s/) + ea saying long e + l|con-、读 /s/ 的 c 加发长 e 的 ea 和 l
      sinister|a villain's wicked, evil smile|an evil shadow creeping behind a curtain|a threatening note warning of danger|sinister seems evil or dangerous; mysterious is merely hard to explain|sinister 带有邪恶危险的不祥感；mysterious 只是神秘难解|mysterious simply means strange and hard to explain, without the evil, threatening sense of a villain or danger|mysterious 只指神秘难解，不带有反派邪恶、威胁恐吓的阴险意味|peculiar simply means odd or unusual, not wicked, evil, or threatening|peculiar 只指古怪奇特，不表示邪恶威胁|sin · is · ter|short i + is + -ter ending|短 i、is 加结尾 -ter
    `,
  },
);

const reasoning = batch(
  "words-for-reasoning",
  ["Words for Reasoning", "推理的词"],
  ["thinking through clues and claims", "推敲线索和说法"],
  `
  doubt|a feeling of not being sure|怀疑|I have no ___ that she will win.|There is some uncertainty and ___ about whether his story is true.|The new clue raised a questioning ___ in the detective's mind.|motive,possibility|doubts
  certain|completely sure|确定的|I am completely sure and ___ that I locked the door.|Are you completely sure and ___ that this is the right answer?|Nothing is completely sure and ___ until we test it.|likely,obvious
  likely|probably going to happen or be true|很可能的|It is ___ to rain this afternoon, though not completely sure.|The most probable, or ___, answer is that the wind blew the door shut.|Judging by his habits, he is probably going—or ___—to be late again.|certain,obvious
  contradict|to say the opposite of|与……矛盾|Her two stories say the opposite and ___ each other.|The hard facts ___ his claim.|Do not say the opposite and ___ your teacher rudely.|deny,admit|contradicts
  consider|to think carefully about|考虑|Please ___ all the facts carefully before you decide.|We will think over and ___ your idea at the next meeting.|The jury had to weigh and ___ every clue carefully.|claim,deny
  claim|to say that something is true, without proof|声称|Many people ___ without proof to have seen the ghost.|Did he ___ without proof that he was home all night?|They ___ without proof that the dog ate their homework.|admit,consider|claimed
  deny|to say that something is not true|否认|The boy will ___ that he broke the vase, saying he did not do it.|She did not ___ eating the last cookie.|Do not ___ it and say it is false; we saw you.|admit,contradict|denied
  admit|to say that something is true, often unwillingly|承认|He had to ___ unwillingly that he was wrong.|She will ___ she took the pen once she sees the photo.|I reluctantly ___ that the test was harder than I expected.|deny,claim|admitted
  obvious|easy to see or understand|明显的|The answer was plain and ___ once we saw the muddy prints.|It was plain and ___ to everyone that he was tired.|The mistake was so plain and ___ that everyone saw it at once.|likely,certain
  possibility|something that might happen or be true|可能性|There is a ___ of snow tonight.|One chance, or ___, is that the cat knocked it over.|We cannot rule out any chance or ___ yet.|doubt,outcome
  `,
  "context-clues",
  {
    intro: t(
      "When two witnesses **contradict** each other, a careful thinker will **consider** every **possibility** with healthy **doubt**, test any unproven **claim**, and wait until the truth is **obvious** before feeling **certain**—until the culprit stops trying to **deny** it and has to **admit** what happened. These ten words sharpen reasoning.",
      "当两名证人的说法互相矛盾（**contradict**）时，冷静的思考者会带着怀疑（**doubt**）仔细考虑（**consider**）每种可能性（**possibility**），核查毫无证据的声称（**claim**），等到真相明显（**obvious**）才敢确定（**certain**），让犯人无法再否认（**deny**）而只能承认（**admit**）。这十个词训练严谨推理。",
    ),
    watchOut: {
      meanings: t(
        "Tell **claim** (state something as true *without proof*) apart from **admit** (say something is true *unwillingly*, often when caught) and **deny** (say something is *not* true).",
        "分清 **claim**（毫无证据地声称）、**admit**（往往不太情愿地承认事实）和 **deny**（矢口否认某事不属实）。",
      ),
      use: t(
        "Tell **certain** (100% completely sure) apart from **likely** (probably true, though not guaranteed) and **obvious** (easy for everyone to see at once).",
        "分清 **certain**（百分之百确定）、**likely**（很可能但不保证）和 **obvious**（显而易见、一目了然）。",
      ),
      spelling: t(
        "Watch **obvious** (*ob-* + *vi* + *-ous*), **contradict** (*contra-* for against + *dict* for say), and **doubt** (silent *b* before *t*).",
        "注意 **obvious** 结尾的 **-vious**、**contradict**（*contra-* 反对 + *dict* 说），以及 **doubt** 里不发音的 **b**。",
      ),
    },
    notes: `
      doubt|having zero uncertainty that she will win|uncertainty about whether a story is true|a questioning feeling raised by a new clue|doubt is not being sure; possibility is something that might happen|doubt 是心存怀疑不确定；possibility 是某种可能性|motive is the reason someone commits an act, not an inner feeling of uncertainty|motive 是做事的原因动机，不是心里拿不准的怀疑感|possibility is something that might happen, not a feeling of being unsure whether a story is true|possibility 指可能发生的情况，不是对某说法是否属实的怀疑|doubt|ou saying /aʊ/ + silent b before t|发 /aʊ/ 的 ou 加不发音的 b 和 t
      certain|being completely sure the door is locked|being completely sure an answer is right|nothing being completely sure before testing|certain is completely sure; likely is only probable|certain 是百分之百确定；likely 只是很可能|likely means only probably true without being completely sure, weaker than 100% certainty|likely 只表示大概可能，达不到完全确信无误的程度|obvious means easy for everyone to see, not a personal feeling of being completely sure|obvious 指显而易见，不形容人内心“完全确信”|cer · tain|soft c (/s/) + er + -tain|读 /s/ 的 c、er 加 -tain
      likely|probable afternoon rain that is not guaranteed|the most probable answer about a blown-shut door|probable lateness judged from past habits|likely is probable but not guaranteed; certain is completely sure|likely 是很可能但不绝对；certain 是完全确定|certain means 100% guaranteed, stronger than merely probable or not completely sure|certain 表示完全肯定无误，与“大概可能但不确定”程度不符|obvious means easy to see at once, not predicting what will probably happen next|obvious 指一眼看穿的明显，不表示推测某事很可能发生|like · ly|like (silent e) + -ly suffix|like 保留词尾 e 再加 -ly
      contradict|two stories saying the exact opposite of each other|hard facts proving the opposite of a claim|rudely saying the opposite of a teacher|contradict says the opposite of another statement; deny says one thing is untrue|contradict 是与另一说法或事实互相矛盾；deny 是单方面否认|deny means saying a single accusation is untrue, not two stories or facts saying the exact opposite of each other|deny 是否认某件指控，不表示两段陈述或事实彼此抵触矛盾|admit means agreeing something is true, the exact opposite of saying the opposite|admit 是承认属实，与反驳矛盾正相反|con · tra · dict|contra- (against) + dict (say)|前缀 contra-（反对）加词根 dict（说）
      consider|thinking carefully over all facts before deciding|thinking over an idea at the next meeting|a jury weighing every clue carefully|consider thinks carefully about something; claim asserts without proof|consider 是仔细权衡考虑；claim 是无据声称|claim means stating something is true without proof, not thoughtfully weighing facts, ideas, or clues|claim 是无凭无据地断言，不是冷静权衡所有事实和线索|deny means saying something is not true, not thinking carefully about an idea or clue before deciding|deny 是否认不认账，不是仔细考虑斟酌|con · sid · er|con- + short i + -der|con-、短 i 加 -der
      claim|stating without proof to have seen a ghost|stating without proof to have been home all night|stating without proof that a dog ate homework|claim asserts without proof; admit confesses unwillingly|claim 是无据声称；admit 是承认事实|admit means unwillingly confessing a truth, not asserting an unproven story like seeing a ghost or a dog eating homework|admit 是迫不得已承认真相，不是毫无证据地宣称见鬼或作业被狗吃了|consider means thinking carefully about something, not asserting an unproven claim|consider 是仔细考虑，不是对外声称某事属实|claim|cl blend + ai saying long a + m|cl 连缀、发长 a 的 ai 加 m
      deny|saying it is untrue that he broke the vase|not saying it is untrue that she ate the cookie|refusing to call something false when caught|deny says something is untrue; admit says it is true|deny 矢口否认；admit 承认属实|admit means agreeing that something is true, the exact opposite of insisting you did not do it|admit 是承认属实，与矢口否认正相反|contradict means stating the opposite of another statement or person, not simply refusing to own up to eating a cookie|contradict 是与另一说法互相抵触，不接动名词表示否认做过某事|de · ny|de- + -ny saying long i|de- 加发长 i 音的 -ny
      admit|unwillingly acknowledging being wrong|acknowledging taking a pen once shown a photo|reluctantly acknowledging a test was harder|admit acknowledges truth unwillingly; deny says it is untrue|admit 是勉强承认；deny 是矢口否认|deny means insisting something is not true, the exact opposite of reluctantly owning up to a mistake|deny 是拒绝承认，与面对证据勉强认错正相反|claim means asserting something without proof, not reluctantly acknowledging you were wrong or caught on camera|claim 是无据声称，不是面对照片或失误勉强承认|ad · mit|ad- + short i + t|ad- 加短 i 和 t
      obvious|an answer plain to see from muddy prints|tiredness plain for everyone to notice|a mistake plain enough for everyone to see at once|obvious is easy to see at once; likely is merely probable|obvious 是一目了然；likely 只是很可能|likely means probably going to happen, not plainly visible right in front of everyone's eyes|likely 指将来可能发生，不形容眼前一眼就能看出的明显事实|certain means completely sure inside one's mind, not specifically plain and easy for everyone to spot at once|certain 指内心确信无疑，不特指人人一眼就能看穿的明显|ob · vi · ous|ob- + vi + -ous ending|ob-、vi 加形容词后缀 -ous
      possibility|a chance that it might snow tonight|one possible explanation that the cat knocked it over|any chance that cannot be ruled out yet|possibility is something that might be true; doubt is feeling unsure|possibility 是某种可能性；doubt 是怀疑|doubt is a feeling of uncertainty, not a chance of snow or a possible explanation you cannot rule out|doubt 是怀疑情绪，不是今晚下雪或猫咪碰倒的某种可能性|outcome is the final way an event actually turns out, not a mere chance that might or might not happen|outcome 是事件最终尘埃落定的结局，不是尚未确定的某种可能性|pos · si · bil · i · ty|double s + -ibility ending|双写 s 加名词后缀 -ibility
    `,
  },
);

const wilderness = batch(
  "words-of-wilderness-survival",
  ["Words of Wilderness Survival", "野外求生的词"],
  ["staying alive in the wild", "在野外求生"],
  `
  wilderness|wild land where no people live|荒野|They hiked for days in the untamed ___ without seeing a road.|Bears and wolves roam the untamed ___.|The uninhabited ___ stretched for miles in every direction.|trek,raft
  stranded|stuck in a place without a way to leave|被困的|The storm left the hikers ___ on the mountain with no way down.|A ___ whale lay stuck on the beach.|With no fuel, we were ___ on the empty road.|weightless,homesick
  ration|a fixed amount of food or water given to each person|定量配给|Each sailor got a measured daily ___ of bread and water.|We had to make our small ___ of bread last three days.|The daily ___ was one apple and a cup of rice.|canteen,kindling|rations
  flint|a hard stone that makes sparks when it is struck|燧石|Strike the hard ___ with steel to make sparks.|Early people chipped hard ___ stone into sharp knives.|A spark from the struck ___ fell on the dry grass.|kindling,raft
  kindling|small, dry sticks for starting a fire|引火柴|Gather small dry sticks of ___ before you light the fire.|The dry ___ caught fire first, and then the logs.|Wet ___ sticks will not burn.|flint,ration
  canteen|a bottle for carrying water on a trip|水壶|Fill your water ___ at the stream.|The hiker's water ___ was empty by noon.|A metal water ___ hung from his belt.|ration,raft
  raft|a flat boat made of logs tied together|木筏|They tied logs together to build a flat ___.|The log ___ floated slowly down the river.|We paddled the log ___ to the island.|canteen,trek|rafts
  blister|a bubble of skin filled with liquid, often from rubbing|水泡|My new boots rubbed and gave me a painful ___ on my heel.|A ___ formed on her palm where the oar rubbed her hand.|Cover the skin ___ so it does not pop.|kindling,flint|blisters
  dehydrate|to lose too much water from the body|脱水|In the desert, you can ___ quickly if you do not drink water.|Hikers who sweat a lot can ___ on a hot day without water.|Drink water often so that your body does not ___.|evaporate,tremble|dehydrated
  trek|a long, hard walk|艰苦跋涉|The five-day ___ through the mountains tested every hiker.|After a long, hard ___ on foot, we reached the camp.|Their long ___ on foot across the ice was slow and cold.|raft,wilderness
  `,
  "context-clues",
  {
    intro: t(
      "Left **stranded** deep in the **wilderness**, the hikers guard their last **ration** of bread, refill a metal **canteen** so they will not **dehydrate**, strike **flint** over dry **kindling**, and plan a five-day **trek** out to the river. These ten words belong to survival in the wild.",
      "被困（**stranded**）在荒野（**wilderness**）深处，徒步者珍惜仅剩的口粮配给（**ration**），灌满水壶（**canteen**）以防脱水（**dehydrate**），敲击燧石（**flint**）点燃引火柴（**kindling**），准备踏上五天艰苦跋涉（**trek**）。这十个词讲述野外求生。",
    ),
    watchOut: {
      meanings: t(
        "Tell **flint** (a hard *stone* struck with steel to make sparks) apart from **kindling** (small, dry *sticks* that catch those sparks and start a fire).",
        "分清 **flint**（敲击后迸出火花的硬质燧石）和 **kindling**（接住火花、引燃木柴的干燥小树枝引火柴）。",
      ),
      use: t(
        "Tell **ration** (a fixed, measured share of food or water allotted per day) apart from **canteen** (the metal or plastic bottle you carry water in).",
        "分清 **ration**（每人每日定量的食物或饮水配给）和 **canteen**（盛装饮用水随身携带的水壶）。",
      ),
      spelling: t(
        "Watch **wilderness** (*wilder* + *-ness*, double *s*), **dehydrate** (*de-* + *hydr-* for water + *-ate*), and **canteen** (double *e* + *n*).",
        "注意 **wilderness** 结尾的双写 **s**、**dehydrate** 中表示水的词根 **hydr-**，以及 **canteen** 里的双写 **e**。",
      ),
    },
    notes: `
      wilderness|untamed land hiked for days without seeing a road|wild land roamed by bears and wolves|uninhabited land stretching for miles|wilderness is uninhabited wild land; trek is a long hard walk|wilderness 是无人居住的荒野；trek 是艰苦跋涉|trek is a long, hard journey on foot, not the untamed wild land itself where bears and wolves live|trek 是徒步跋涉的行程，不是熊和狼栖息的大片荒野土地|raft is a flat boat of tied logs, not miles of uninhabited wild land|raft 是木筏，不是绵延数英里的无人荒野|wil · der · ness|short i + der + -ness (double s)|短 i、der 加双写 s 的 -ness
      stranded|hikers stuck on a mountain after a storm|a whale stuck helplessly on a beach|travelers stuck on an empty road without fuel|stranded means stuck without a way to leave; homesick means sad to be away from home|stranded 是受困无法离开；homesick 是离家想家|weightless means floating without feeling weight in space, not stuck on a mountain, beach, or empty road|weightless 指太空失重漂浮，不是被困在山上、海滩或荒路|homesick means feeling sad because you are away from home, not physically trapped without a way to leave|homesick 是因离家而想家难过，不是没油或遇风暴而被困无法离开|stran · ded|str three-letter blend, short a, and -ded|str 连缀、短 a 加 -ded
      ration|a measured daily share of bread and water per sailor|a small bread share stretched across three days|a fixed daily share of one apple and rice|ration is a measured food or water share; canteen is a water bottle|ration 是定量配给的口粮或饮水；canteen 是水壶|canteen is a bottle for carrying water, not a measured share of bread, apples, and rice|canteen 是装水的水壶，不是按天分配的面包、苹果或米饭配给|kindling is small dry sticks for starting a fire, not a measured daily share of food or water|kindling 是生火用的引火柴，不是每日定量口粮|ra · tion|short a + -tion saying /ʃən/|短 a 加读 /ʃən/ 的 -tion
      flint|hard stone struck with steel to make sparks|hard stone chipped into sharp early knives|struck stone throwing a spark onto dry grass|flint is spark-making stone; kindling is small dry sticks|flint 是打火燧石；kindling 是引火干树枝|kindling is small dry sticks that burn easily, not a hard stone struck with steel or chipped into knives|kindling 是易燃的干燥细柴，不是能敲出火花或打制石刀的坚硬石头|raft is a flat log boat, not a hard stone that makes sparks when struck|raft 是木筏，不是敲击生火花的硬石|flint|fl blend, short i, and nt blend|fl 连缀、短 i 和结尾 nt
      kindling|small dry sticks gathered before lighting a fire|dry sticks catching fire before larger logs|wet sticks refusing to burn|kindling is small dry sticks for starting a fire; flint is spark-making stone|kindling 是引火干树枝；flint 是打火燧石|flint is a hard stone struck for sparks, not dry sticks that catch fire before the logs|flint 是坚硬的燧石，不是会先着火再引燃大木头的干树枝|ration is a measured share of food or water, not small sticks gathered to start a fire|ration 是食物饮水配给，不是生火用的引火柴|kin · dling|short i + n + dl + -ing|短 i、n、dl 加 -ing
      canteen|a travel water bottle refilled at a stream|a hiker's empty water bottle by noon|a metal water bottle hanging from a belt|canteen is a travel water bottle; ration is a measured share of food|canteen 是随身水壶；ration 是定量配给|ration is a measured share of food or water, not a metal bottle filled at a stream or hung from a belt|ration 是按量分配的口粮，不是能挂在腰带上的金属水壶|raft is a flat log boat for floating on rivers, not a bottle for carrying drinking water|raft 是渡河木筏，不是随身带水的水壶|can · teen|can + double e + n|can 加双写 e 和 n
      raft|a flat boat built by tying logs together|a log boat floating slowly down a river|a log boat paddled to an island|raft is a flat log boat; trek is a long walk on foot|raft 是圆木捆成的木筏；trek 是徒步跋涉|canteen is a small bottle for carrying water, not a flat boat of tied logs you paddle to an island|canteen 是水壶，不是捆木头扎成、划向小岛的木筏|trek is a long hard walk on land, not a flat log boat floating down a river|trek 是陆上艰苦徒步，不是顺流漂行的木筏|raft|short a + ft blend|短音 a 加结尾 ft
      blister|a painful skin bubble rubbed on a heel by new boots|a skin bubble rubbed on a palm by an oar|a skin bubble covered so it will not pop|blister is a liquid-filled skin bubble; flint is a hard stone|blister 是磨出的皮肤水泡；flint 是硬燧石|kindling is dry sticks for starting a fire, not a liquid-filled bubble rubbed on a heel or palm|kindling 是引火细柴，不是新靴子或船桨磨出来的皮肤水泡|flint is a hard spark-making stone, not a bubble of skin that can pop|flint 是燧石，不是皮肤上会弄破的水泡|blis · ter|bl blend, short i, st blend, and -er|bl 连缀、短 i、st 加 -er
      dehydrate|losing too much body water in the desert|losing too much water while sweating on a hot hike|losing body water prevented by drinking often|dehydrate loses too much water from a living body; evaporate turns a puddle into gas|dehydrate 是人体缺水脱水；evaporate 是液体蒸发成气体|evaporate means a liquid itself turning into gas and vanishing, not a hiker's body losing too much water|evaporate 指液体本身蒸发消失，不是人或身体因缺水而脱水|tremble means shaking from cold or fear, not losing too much water from your body in the heat|tremble 是发抖颤抖，不是炎热缺水导致的身体脱水|de · hy · drate|de- (remove) + hydr (water) + -ate|前缀 de-（去除）加 hydr（水）和 -ate
      trek|a five-day hard walk through mountains|a long hard walk on foot ending at camp|a slow cold walk on foot across ice|trek is a long hard walk; wilderness is uninhabited wild land|trek 是长途艰苦步行；wilderness 是荒野土地|raft is a flat log boat for water, not a five-day walk through mountains or across ice|raft 是水上木筏，不是耗时五天的山地或冰原徒步|wilderness is wild uninhabited land itself, not a five-day journey on foot|wilderness 是荒野地带本身，不是持续数天的艰难徒步行程|trek|tr blend, short e, and single k|tr 连缀、短 e 加单 k
    `,
  },
);

const ships = batch(
  "words-of-ships-and-the-sea",
  ["Words of Ships and the Sea", "船与大海的词"],
  ["ships and sailing", "船只和航海"],
  `
  shipwreck|the wreck of a ship, or the sinking of one|沉船，海难|Divers explored the old ___ lying on the seabed.|Only three sailors lived through the sinking ___.|The ___ happened on the jagged rocks near the lighthouse.|castaway,lifeboat
  castaway|a person left alone on an island after a shipwreck|漂流者|The ___ lived alone on coconuts on the island for a year.|A passing ship rescued the stranded ___ from the island.|The ___ wrote SOS in the sand with a stick.|shipwreck,deck|castaways
  lifeboat|a small boat carried on a ship to save people|救生艇|The passengers climbed into the rescue ___.|The small ___ rocked on the huge waves.|Each rescue ___ held twenty people.|hull,anchor|lifeboats
  mast|the tall pole that holds a ship's sails|桅杆|The sail hung from the tall ___.|A sailor climbed the tall wooden ___ to look out.|The storm snapped the tall wooden ___ in two.|oar,rigging
  anchor|a heavy hook dropped to hold a ship in place|锚|Drop the heavy ___ so that the boat does not drift.|The heavy iron ___ caught on the rocks of the seabed.|They pulled up the heavy ___ and sailed away.|mast,oar
  deck|the floor of a ship|甲板|Waves washed over the ship's top floor, the ___.|The sailors scrubbed the wooden floor of the ___ every morning.|Passengers stood on the open ___ to watch the dolphins.|hull,starboard
  hull|the main body of a ship|船体|The rocks tore a hole in the ship's outer ___.|Barnacles grew on the ship's underwater ___ below the waterline.|Water leaked into the ship's main ___ through a crack.|deck,mast
  oar|a long pole with a flat end for rowing|桨|He pulled hard on the rowing ___.|One rowing ___ slipped from his hand and floated away.|The flat end of the ___ splashed in the water as they rowed.|mast,anchor|oars
  rigging|the ropes that hold up and move a ship's sails|索具|Sailors climbed the rope ___ to fix the sail.|The wind whistled through the sail ropes, or ___.|Tangled rope ___ hung from the broken mast.|anchor,hull
  starboard|the right side of a ship as you face forward|右舷|Turn the ship to the right, to ___.|A whale came up on the right, or ___, side of the ship.|The lighthouse was off the right, or ___, side of the boat.|deck,hull
  `,
  "context-clues",
  {
    intro: t(
      "On a tall sailing ship, sailors scrub the wooden **deck**, haul up the iron **anchor**, climb the rope **rigging** up the tall **mast**, and watch off the **starboard** side for rocks that could tear the **hull** and force everyone into a **lifeboat**. These ten words name ships and life at sea.",
      "高大的帆船上，水手刷洗木甲板（**deck**），拉起铁锚（**anchor**），顺着索具（**rigging**）爬上高高的桅杆（**mast**），紧盯右舷（**starboard**）暗礁，以防撞破船体（**hull**）被迫坐上救生艇（**lifeboat**）。这十个词讲述船只与航海。",
    ),
    watchOut: {
      meanings: t(
        "Tell **deck** (the flat wooden *floor* of a ship where sailors walk) apart from **hull** (the main outer *body* of the ship that sits in the water and keeps leaks out).",
        "分清 **deck**（水手行走的船面甲板）和 **hull**（浸在水中挡住海水的船体外壳）。",
      ),
      use: t(
        "Tell **mast** (the tall solid *pole* standing up to hold the sails) apart from **rigging** (the *ropes* that hold up and move those sails) and **oar** (the hand-held rowing pole).",
        "分清 **mast**（立在船上的高大桅杆）、**rigging**（拉紧和操控帆的绳索索具）和 **oar**（手里划水用的船桨）。",
      ),
      spelling: t(
        "Watch **anchor** (*ch* saying /k/ + *-or*), **starboard** (*star* + *board* with *oa*), and **rigging** (double *g* + *-ing*).",
        "注意 **anchor** 中读 /k/ 的 **ch**、**starboard** 中的 **board**，以及 **rigging** 的双写 **g**。",
      ),
    },
    notes: `
      shipwreck|a sunken ship explored by divers on the seabed|a sinking disaster survived by only three sailors|a ship disaster occurring on jagged rocks by a lighthouse|shipwreck is the sinking or sunken ship; castaway is a stranded survivor|shipwreck 是沉船或海难；castaway 是流落孤岛的人|castaway is a person stranded alone on an island, not a sunken vessel on the seabed or the disaster itself|castaway 是遇险漂流到孤岛的人，不是海底沉船或沉船事故|lifeboat is a small rescue boat carried on a ship, not a sunken ship disaster on rocks|lifeboat 是救生小艇，不是触礁沉没的海难或沉船残骸|ship · wreck|compound word: ship + wreck (silent w)|合成词：ship 加开头 w 不发音的 wreck
      castaway|a survivor living alone on island coconuts for a year|a stranded island survivor rescued by a passing ship|a stranded person writing SOS in beach sand|castaway is a stranded island survivor; shipwreck is the sinking|castaway 是流落孤岛的漂流者；shipwreck 是沉船事故|shipwreck is the wrecked ship or sinking event itself, not a living person writing SOS in the sand|shipwreck 是沉船或海难本身，不是在沙滩上写 SOS 求救的人|deck is the floor of a ship, not a stranded survivor rescued from an island|deck 是船的甲板，不是被路过船只救起的漂流者|cast · a · way|compound word: cast + away|合成词：cast 加 away
      lifeboat|a small rescue boat climbed into by passengers|a small rescue boat rocking on huge waves|a rescue boat holding twenty people|lifeboat is a small rescue boat; hull is a ship's main body|lifeboat 是救生小艇；hull 是船体主体|hull is the main outer body of a ship, not a small rescue boat launched to hold twenty passengers|hull 是大船本身的船体外壳，不是能坐二十人的小型救生艇|anchor is a heavy iron hook holding a ship still, not a small boat passengers climb into|anchor 是固定船只的重锚，不是乘客坐进去逃生的救生艇|life · boat|compound word: life + boat (oa)|合成词：life 加含 oa 的 boat
      mast|a tall pole holding up a ship's sail|a tall wooden pole climbed for a lookout|a tall wooden pole snapped in two by a storm|mast is the tall sail-holding pole; rigging is the ropes|mast 是立起船帆的高桅杆；rigging 是绳索索具|oar is a hand-held pole with a flat end for rowing, not a tall pole holding sails that sailors climb|oar 是手里划船的桨，不是挂帆且供水手攀爬的高大桅杆|rigging is the web of ropes around the sails, not a single solid wooden pole that snaps in two|rigging 是成束绳索，不是会被风暴折成两截的单根高大木杆|mast|short a + st blend|短音 a 加结尾 st
      anchor|a heavy hook dropped to stop a boat drifting|a heavy iron hook catching on seabed rocks|a heavy hook pulled up before sailing away|anchor holds a ship in place; oar rows a boat|anchor 是抛下海底固定船的锚；oar 是划船的桨|mast is the tall upright pole holding sails, not a heavy iron hook dropped to the seabed|mast 是船上竖立的桅杆，不是抛入海底勾住岩石的重铁锚|oar is a pole for rowing through water, not a heavy hook dropped to keep a ship from drifting|oar 是划水前进的船桨，不是用来防止船漂走的沉重铁锚|an · chor|an + ch saying /k/ + -or|an 加读 /k/ 的 ch 和 -or
      deck|a ship's top floor washed over by waves|a wooden ship floor scrubbed every morning|an open ship floor where passengers watch dolphins|deck is the ship's floor; hull is its outer body|deck 是船面甲板；hull 是船体外壳|hull is the main outer shell below the waterline, not the flat wooden floor sailors scrub and passengers walk on|hull 是浸在水中的船体外壳，不是水手每天刷洗、乘客站着看海豚的甲板|starboard is the right side of a ship, not the flat floor walked on and scrubbed|starboard 指船的右侧方位，不是用来行走刷洗的平地板|deck|short e + ck|短音 e 加 ck
      hull|a ship's outer shell torn open by rocks|a ship's underwater body coated in barnacles|a ship's main body leaking through a crack|hull is the ship's main body; deck is its walking floor|hull 是船体外壳；deck 是船面甲板|deck is the flat walking floor on top of a ship, not the underwater shell where barnacles grow or rocks tear a hole|deck 是船顶行走的甲板，不是水线以下长满藤壶、被暗礁撞破的船体外壳|mast is the tall upright pole for sails, not the ship's main floating body below the waterline|mast 是竖立挂帆的桅杆，不是浸在水里承载全船的船体|hull|short u + double l|短音 u 加双写 l
      oar|a rowing pole pulled hard through water|a rowing pole slipping from a hand and floating away|a flat-ended pole splashing while rowing|oar is a rowing pole; mast is a tall sail pole|oar 是划船用的桨；mast 是挂帆的桅杆|mast is a tall upright pole fixed to a ship for sails, not a hand-held rowing pole with a flat end|mast 是固定在船上的高大桅杆，不是握在手里划水溅起水花的船桨|anchor is a heavy iron hook dropped to the seabed, not a wooden pole used for rowing|anchor 是沉底的铁锚，不是划船前进的木桨|oar|oa saying /ɔː/ + r (not ore or or)|发 /ɔː/ 音的 oa 加 r（别和矿石 ore 混）
      rigging|sail ropes climbed by sailors to fix a sail|sail ropes making whistling sounds in wind|tangled ropes hanging from a broken mast|rigging is a ship's sail ropes; hull is the ship's body|rigging 是操控船帆的索具绳索；hull 是船体|anchor is a heavy iron hook dropped to the seabed, not ropes climbed to fix sails or hanging from a mast|anchor 是沉入海底的铁锚，不是垂在桅杆上、风吹呼啸的绳索|hull is the solid outer body of a ship, not tangled ropes holding up sails|hull 是坚固的船体外壳，不是纠缠在一起的绳索索具|rig · ging|short i, double g, and -ing|短 i、双写 g 加 -ing
      starboard|turning right toward a ship's right side|a whale surfacing on a ship's right side|a lighthouse spotted off a boat's right side|starboard is a ship's right side; deck is its floor|starboard 是船的右舷方向；deck 是甲板|deck is the flat floor of a ship, not specifically the right-hand side as you face forward|deck 是船面地板，不表示面朝船头时的右侧方向|hull is the ship's main body on both sides, not specifically the right side you turn toward|hull 是整个船体，不特指船的右侧右舷|star · board|compound word: star + board (oa)|合成词：star 加含 oa 的 board
    `,
  },
);

const courage = batch(
  "words-for-courage-and-fear",
  ["Words for Courage and Fear", "勇气与恐惧的词"],
  ["courage and fear", "勇气和恐惧"],
  `
  courage|being brave when you are afraid|勇气|It took great ___ to jump into the freezing water.|She found the ___ to speak up even though she was scared.|The firefighters showed great ___ in the blazing house.|dread,despair
  dread|a strong fear of something to come|恐惧|He felt fearful ___ as the hard test drew near.|The sound of approaching wolves filled her with fearful ___.|They waited in fearful ___ for the storm to hit.|despair,courage
  desperate|in a very bad situation and willing to try anything|绝望的，拼命的|The ___ sailors drank rainwater from the sails to stay alive.|She made a last, ___ leap to reach the safety of the bank.|Without food or water, the lost hikers grew ___.|bold,uneasy
  bold|brave and daring|大胆的|A ___ explorer set out across the uncharted sea.|It was a daring, ___ plan, and it worked.|The brave, ___ girl stood up to the bully.|desperate,uneasy
  despair|the feeling that there is no hope|绝望|After days lost at sea, they lost all hope and fell into ___.|Thinking all was lost, she cried in hopeless ___.|Do not give in to hopeless ___; help is coming.|dread,courage
  hesitate|to stop for a moment because you are unsure|犹豫|Do not ___ to call if you need help.|He paused and began to ___ at the edge of the diving board.|She did not pause or ___; she jumped right in.|tremble,persist|hesitated
  tremble|to shake from fear, cold or excitement|颤抖|My hands began to shake and ___ in the bitter cold.|The puppy would shake and ___ during thunderstorms.|Her voice started to shake and ___ as she spoke.|cower,hesitate|trembled,trembling
  persist|to keep going even when it is hard|坚持|If you keep trying and ___, you will learn to swim.|The climbers chose to ___ and push on despite the fierce wind.|Scientists ___ through failed tests until they find an answer.|hesitate,tremble
  grit|courage and the will to keep going|毅力|It took true ___ to finish the race with a sore ankle.|Her determination and ___ kept her climbing when others turned back.|With ___ and hard work, they rebuilt the farm.|dread,despair
  cower|to crouch down in fear|畏缩|The frightened dog would crouch down and ___ under the table during storms.|Do not shrink back and ___; stand up straight.|The mice crouch low and ___ in the corner when the cat comes in.|tremble,persist
  `,
  "context-clues",
  {
    intro: t(
      "Standing at the edge of a storm-swept ridge, a climber feels **dread** as her hands **tremble**, yet refuses to **cower** or give in to **despair**—summoning **courage** and **grit** to **persist** without letting fear make her **hesitate**. These ten words capture fear and bravery.",
      "站在狂风呼啸的山脊边，登山者心生恐惧（**dread**）、双手颤抖（**tremble**），却拒绝畏缩（**cower**）或陷入绝望（**despair**），鼓起勇气（**courage**）与毅力（**grit**），毫不犹豫（**hesitate**）地坚持（**persist**）前行。这十个词刻画勇气与恐惧。",
    ),
    watchOut: {
      meanings: t(
        "Tell **dread** (strong fear of something bad *about to happen*, like an approaching storm or test) apart from **despair** (the feeling that *all hope is already gone*).",
        "分清 **dread**（对即将来临的坏事心生强烈恐惧）和 **despair**（觉得毫无希望的彻底绝望）。",
      ),
      use: t(
        "Tell **tremble** (shake from cold, fear, or nerves—even a hand or voice can tremble) apart from **cower** (physically *crouch or shrink down* in fear, like a frightened dog under a table).",
        "分清 **tremble**（因冷、怕或紧张而发抖，手或声音都会抖）和 **cower**（害怕得蜷缩低头躲避）。",
      ),
      spelling: t(
        "Watch **courage** (*ou* saying /ɜːr/ + *-age*), **desperate** (*des-per-ate*, *e* in the middle, not *a*), and **hesitate** (*hes-i-tate*, single *s*).",
        "注意 **courage** 中读 /ɜːr/ 的 **our**、**desperate** 中间的 **e**（不是 *a*），以及 **hesitate** 里的单个 **s**。",
      ),
    },
    notes: `
      courage|bravery needed to jump into freezing water|bravery found to speak up while scared|bravery shown by firefighters inside a blazing house|courage is bravery despite fear; dread is strong fear of what is coming|courage 是面对恐惧的勇气；dread 是对未来的强烈恐惧|dread is strong fear of something bad coming, the exact opposite of being brave in danger|dread 是强烈恐惧，与无畏勇气正相反|despair is losing all hope, the opposite of brave action in cold water or a fire|despair 是丧失希望的绝望，与挺身而出的勇气正相反|cour · age|our saying /ɜːr/ + soft g (/dʒ/) in -age|读 /ɜːr/ 的 our 加 -age
      dread|fear felt as a hard test approaches|fear caused by approaching wolves|fear while waiting for a storm to hit|dread fears something about to happen; despair feels all hope is gone|dread 是怕即将到来的厄运；despair 是彻底失去希望|despair is feeling all hope is already lost, not fearful anticipation of an approaching test, wolves, or storm|despair 是已毫无希望的绝望，不是对即将来临的考试、恶狼或暴风雨的恐惧|courage is bravery in facing danger, the exact opposite of strong fear|courage 是迎难而上的勇气，与强烈恐惧正相反|dread|dr blend + ea saying short e + d|dr 连缀、发短 e 的 ea 加 d
      desperate|sailors drinking rainwater from sails to survive|a last-chance leap for the safety of a bank|lost hikers with no food or water growing frantic|desperate is willing to try anything in danger; bold is calmly daring|desperate 是走投无路孤注一掷；bold 是果敢大胆|bold means brave and daring by choice, not driven to last-resort acts by hunger, thirst, or danger|bold 指主动勇敢果断，不指缺水断粮时的走投无路|uneasy means mildly worried and uncomfortable, far weaker than frantic last-resort survival measures|uneasy 只是心里隐隐不安，远不及绝境中拼死求生的极端紧迫|des · per · ate|des + per (with e, not a) + -ate|des 加含 e 的 per 和 -ate
      bold|a daring explorer crossing an uncharted sea|a daring plan that succeeds|a brave girl standing up to a bully|bold is brave and daring; desperate is driven by a dire crisis|bold 是勇敢大胆；desperate 是绝境拼命|desperate means driven to extreme measures by a dire crisis, not confidently daring like an explorer or standing up to a bully|desperate 指绝境中迫不得已的拼命，不是果敢自信的大胆|uneasy means worried and uncomfortable, the opposite of a brave, daring explorer or plan|uneasy 是忐忑不安，与果敢大胆正相反|bold|long o before ld|ld 前读长音的 o
      despair|losing all hope after days lost at sea|crying when believing all is lost|hopelessness to resist because help is coming|despair feels no hope remains; dread fears what is coming next|despair 是彻底绝望；dread 是畏惧将至之事|dread is fear of an upcoming threat, not the hopeless feeling that all is already lost|dread 是对未来威胁的畏惧，不是觉得大势已去、毫无希望的绝望|courage is bravery despite fear, the exact opposite of giving up hope|courage 是迎难而上的勇气，与彻底绝望正相反|de · spair|de- + sp blend + air|de-、sp 连缀加 air
      hesitate|pausing instead of calling right away for help|pausing unsurely at the edge of a diving board|jumping right in without pausing in doubt|hesitate pauses in uncertainty; persist keeps pushing forward|hesitate 是犹豫停顿；persist 是坚持不懈|tremble means shaking physically from fear or cold, not pausing in uncertainty before calling or jumping|tremble 是身体发抖，不是拿不定主意时的停顿犹豫|persist means keeping going through difficulty, the exact opposite of pausing in doubt|persist 是坚持到底，与停步犹豫正相反|hes · i · tate|single s saying /z/ + i + -tate|单写读 /z/ 的 s 加 i 和 -tate
      tremble|hands shaking in bitter cold|a puppy shaking during thunderstorms|a voice shaking while speaking|tremble shakes physically; cower crouches down in fear|tremble 是发抖颤抖；cower 是蜷缩躲避|cower means crouching down low in fear, which hands and voices cannot do|cower 是整个人蜷缩畏缩，手或声音只能发抖，不能“蜷缩”|hesitate means pausing in doubt, not physically shaking in the cold or during a storm|hesitate 是犹豫停顿，不是冻得发抖或声音颤抖|trem · ble|tr blend, short e, and -ble ending|tr 连缀、短 e 加 -ble
      persist|keeping on trying until learning to swim|climbers pushing onward despite fierce wind|scientists continuing through failed tests to find answers|persist keeps going through difficulty; hesitate pauses in doubt|persist 是坚持到底；hesitate 是犹豫停步|hesitate means stopping because you are unsure, the exact opposite of pushing on through wind or failed tests|hesitate 是拿不定主意而停顿，与迎风坚持、反复试验正相反|tremble means shaking from fear or cold, not stubbornly continuing until you succeed|tremble 是发抖，不是克服困难坚持下去|per · sist|per + short i + st blend|per 加短 i 和 st
      grit|willpower to finish a race with a sore ankle|determination keeping a climber going when others quit|stubborn willpower paired with hard work rebuilding a farm|grit is courage and stubborn willpower; dread and despair are fear and hopelessness|grit 是咬牙坚持的毅力；dread 和 despair 是恐惧与绝望|dread is strong fear of something coming, the exact opposite of stubborn willpower|dread 是强烈恐惧，与咬牙完赛、重建农场的坚韧毅力正相反|despair is feeling there is no hope, the exact opposite of determination to keep going|despair 是丧失希望的绝望，与坚持到底的毅力正相反|grit|gr blend, short i, and t|gr 连缀、短 i 加 t
      cower|a frightened dog crouching under a table in storms|shrinking back instead of standing up straight|mice crouching low in a corner before a cat|cower crouches down in fear; tremble shakes|cower 是害怕得蜷缩躲避；tremble 是发抖|tremble means shaking from cold or fear, not crouching low or shrinking back in fear|tremble 指浑身发抖，不指因害怕而蜷缩退避的姿势动作|persist means keeping going bravely despite trouble, the exact opposite of shrinking back in fear|persist 是迎难坚持，与吓得蜷缩躲藏正相反|cow · er|ow saying /aʊ/ + -er ending|发 /aʊ/ 音的 ow 加 -er
    `,
  },
);

const choices = batch(
  "words-for-choices-and-consequences",
  ["Words for Choices and Consequences", "选择与后果的词"],
  ["choices and their consequences", "选择及其后果"],
  `
  consequence|a result of something you do|后果|One ___ of skipping breakfast is feeling tired.|He had to face the ___ of breaking the rule.|Every action brings a result, or ___.|decision,dilemma|consequences
  decision|a choice you make|决定|Turning back before the storm was a hard ___.|The judge's final ___ settled the case.|We must make a ___ by Friday.|consequence,judgment|decisions
  reckless|careless about danger|鲁莽的|Climbing in a lightning storm was a careless, ___ thing to do.|The ___ driver sped dangerously through the red light.|It was careless and ___ to swim beyond the safety flags.|urgent,crucial
  regret|to feel sorry about something you did|后悔|I ___ not bringing a warm coat.|You will ___ it later if you quit now.|He began to ___ his hasty choice.|sacrifice,gamble|regretted
  sacrifice|to give up something for the sake of something else|牺牲|She had to ___ her free time to train for the team.|Parents often ___ their own comfort for their children.|He chose to ___ his own food so the others could eat.|regret,gamble
  dilemma|a hard choice between two things|两难|Her ___ was whether to save the map or the food.|Facing a tough two-way ___, he could not choose between the two paths.|It is a real ___: stay and wait, or leave and search.|consequence,decision
  judgment|the ability to make good decisions|判断力|Use good ___ when you choose a safe path.|The captain trusted her wise ___.|Being very tired can cloud your good ___.|decision,consequence
  urgent|needing to be done right away|紧急的|The message was ___: come right away without waiting.|Getting out of the rising water right away was ___.|The doctor said the operation was ___ and had to be done immediately.|reckless,crucial
  crucial|extremely important|关键的|Water is ___ and essential for survival.|This key step is ___: if you get it wrong, the whole build fails.|The goal in the last minute was ___ to the win.|urgent,reckless
  gamble|to take a risk in the hope of a good result|冒险，赌|They decided to ___ on the short path, though it was dangerous.|Do not ___ with your safety by taking wild risks.|The farmers ___ on the weather, hoping the rain will come.|sacrifice,regret
  `,
  "context-clues",
  {
    intro: t(
      "Faced with a tough **dilemma**—take a **reckless** shortcut or wait out the storm—the captain uses wise **judgment** before making a **crucial** **decision**, knowing every choice carries a **consequence** she does not want to **regret**. These ten words capture hard choices and what follows them.",
      "面对两难困境（**dilemma**）——冒险走鲁莽（**reckless**）的捷径还是原地等风暴过去——船长凭稳健判断力（**judgment**）做出关键（**crucial**）决定（**decision**），深知每个选择都有后果（**consequence**），绝不想事后后悔（**regret**）。这十个词讲述选择与后果。",
    ),
    watchOut: {
      meanings: t(
        "Tell **urgent** (needs to happen *right away* because time is running out) apart from **crucial** (extremely *important* to the outcome, whether fast or slow).",
        "分清 **urgent**（刻不容缓、必须立刻处理的紧急）和 **crucial**（对成败极其重要、决定性的关键）。",
      ),
      use: t(
        "Tell **decision** (one specific choice you make) apart from **dilemma** (a *hard two-way choice* where both options cost something) and **judgment** (your overall *ability* to make wise choices).",
        "分清 **decision**（做出的具体决定）、**dilemma**（左右为难的两难抉择）和 **judgment**（做出明智决定的判断力）。",
      ),
      spelling: t(
        "Watch **dilemma** (single *l*, double *m*), **judgment** (no *e* after *g* in American spelling), and **consequence** (*con-* + *se-* + *-quence*).",
        "注意 **dilemma** 的单 **l** 双 **m**、**judgment** 中 **g** 后不加 **e**，以及 **consequence** 结尾的 **-quence**。",
      ),
    },
    notes: `
      consequence|feeling tired as the result of skipping breakfast|facing the result of breaking a rule|the result brought by every action|consequence is the result after an action; decision is the choice beforehand|consequence 是事后的后果；decision 是事前的决定|decision is the choice you make beforehand, not the result you face afterward like feeling tired|decision 是事前做出的选择，不是不吃早饭犯困或违规后承担的后果|dilemma is a hard choice between two options, not the result that follows an action|dilemma 是做选择前的两难处境，不是行动之后产生的后果|con · se · quence|con- + se + qu + -ence ending|con-、se 加 qu 和 -ence
      decision|a hard choice to turn back before a storm|a judge's final ruling settling a case|a choice that must be made by Friday|decision is one choice you make; consequence is the result afterward|decision 是做出的具体决定；consequence 是事后后果|consequence is the result that happens after an action, not a ruling or choice made by Friday|consequence 是事后产生的结果，不是法官下的裁决或周五前要做出的决定|judgment is your general ability to decide wisely, not one countable choice like a hard ruling or deadline choice|judgment 指抽象判断力，不指单次具体的决定（可数）|de · ci · sion|de- + soft c (/s/) + -sion saying /ʒən/|de-、c 加读 /ʒən/ 的 -sion
      reckless|carelessly climbing in a lightning storm|dangerously speeding through a red light|carelessly swimming beyond safety flags|reckless is careless about danger; urgent needs immediate action|reckless 是不顾危险的鲁莽；urgent 是紧急迫切|urgent means needing to be done immediately, not carelessly courting danger like speeding through a red light|urgent 指必须立刻处理，不是闯红灯或雷雨爬山那样不顾危险的鲁莽|crucial means extremely important, the opposite of careless, dangerous behavior|crucial 指极其重要，不能形容闯红灯或游出安全线的鲁莽举动|reck · less|short e + ck + -less suffix|短 e、ck 加否定后缀 -less
      regret|feeling sorry about not bringing a warm coat|feeling sorry later if you quit now|feeling sorry about a hasty choice|regret feels sorry afterward; sacrifice gives something up willingly|regret 是事后后悔；sacrifice 是主动牺牲放弃|sacrifice means giving up something valuable for another goal, not feeling sorry afterward about a mistake|sacrifice 是为了更大目标主动放弃，不是没带外套或轻率决定后的懊悔|gamble means taking a risky chance for a reward, not feeling sorry about something you already did|gamble 是冒险赌一把，不是对已做之事感到后悔|re · gret|re- + gr blend + short e + t|re-、gr 连缀加短 e 和 t
      sacrifice|giving up free time in order to train|parents giving up their own comfort for children|giving up personal food so others can eat|sacrifice gives something up for a greater sake; regret feels sorry afterward|sacrifice 是为他人或目标主动舍弃；regret 是后悔|regret means feeling sorry about a past mistake, not giving up free time, comfort, or food for others|regret 是为过去的事懊悔，不是主动让出时间或食物成全他人|gamble means taking a risky bet, not giving up something precious so others can benefit|gamble 是冒险碰运气，不是甘愿舍弃自己的利益帮助别人|sac · ri · fice|short a + cr blend + soft c in -fice|短 a、cr 连缀加读 /s/ 的 -fice
      dilemma|a hard two-way choice between map and food|a tough two-way choice leaving him unable to pick|a two-way choice between staying or searching|dilemma is a hard choice between two options; decision is the final choice made|dilemma 是左右为难的两难；decision 是最终敲定的决定|consequence is the result after acting, not being torn between two hard options beforehand|consequence 是事后后果，不是在两个艰难方案间左右为难的困境|decision is a resolved choice you make, not the stuck two-way problem of whether to stay or leave|decision 是已经拍板的决定，不是进退两难的抉择本身|di · lem · ma|short i + single l + double m + a|短 i、单 l、双写 m 加 a
      judgment|wise decision-making ability for picking a safe path|a captain's trusted ability to make good calls|wise decision-making ability clouded by extreme tiredness|judgment is the ability to decide wisely; decision is one single choice|judgment 是做出明智决定的判断力；decision 是单次决定|decision is one single choice you make, not the ongoing mental ability that tiredness can cloud|decision 是单次具体决定，不是过度疲劳时会变模糊的整体判断力|consequence is the result of an action, not the personal wisdom you use to choose a path|consequence 是行为后果，不是用来选路或受船长信赖的判断力|judg · ment|short u + dg (no e before -ment)|短 u、dg 后不加 e 直接接 -ment
      urgent|a message demanding immediate arrival without waiting|needing to escape rising water right away|an operation that must be performed immediately|urgent needs immediate action right away; crucial means extremely important|urgent 强调刻不容缓、必须立刻行动；crucial 强调至关重要|reckless means careless about danger, not needing immediate action right away|reckless 是鲁莽大意，不是刻不容缓、必须立刻处理的紧急|crucial means extremely important overall, without specifically stressing that it must happen immediately right away|crucial 强调重要，不专门强调“刻不容缓、必须马上执行”的紧迫时间|ur · gent|ur saying /ɜːr/ + soft g (/dʒ/) + -ent|发 /ɜːr/ 的 ur、读 /dʒ/ 的 g 加 -ent
      crucial|water being essential for survival|a most important step in a whole build|a last-minute goal deciding the win|crucial is extremely important; urgent needs immediate speed|crucial 是决定性的关键重要；urgent 是时间紧迫|urgent means needing immediate action right away, not being essential to survival or decisive to a win|urgent 强调时间紧迫马上就办，不指水对生存或进球对夺冠那样“至关重要”|reckless means careless about danger, the opposite of an essential or decisive factor|reckless 是鲁莽草率，与决定成败的“关键”无关|cru · cial|cr blend, long u, and -cial saying /ʃəl/|cr 连缀、长 u 加读 /ʃəl/ 的 -cial
      gamble|taking a risky chance on a dangerous short path|taking wild risks with safety|farmers risking their hopes on rain arriving|gamble takes a risky chance; sacrifice gives something up willingly|gamble 是冒险赌一把；sacrifice 是主动舍弃|sacrifice means willingly giving up something valuable for another goal, not taking a risky bet on safety or weather|sacrifice 是甘愿付出舍弃，不是拿安全或天气去碰运气冒险|regret means feeling sorry about something already done, not taking a risky chance for a future hope|regret 是事后懊悔，不是在危险中冒险博取好结果|gam · ble|short a + m + -ble ending|短 a、m 加结尾 -ble
    `,
  },
);

const letters = batch(
  "words-of-letters-and-diaries",
  ["Words of Letters and Diaries", "书信与日记的词"],
  ["letters and diaries", "书信和日记"],
  `
  correspondence|letters sent between people|通信，信件|The two friends kept up their ___ of letters for fifty years.|Her ___ of letters with the scientist filled three boxes.|The museum displays the ___ of letters between the soldier and his family.|memoir,stationery
  envelope|a paper cover for a letter|信封|Write the address on the front of the paper ___.|She tore open the ___ and pulled out the letter.|The ___ had a stamp in the corner.|postmark,parchment|envelopes
  postmark|a mark stamped on a letter to show where and when it was mailed|邮戳|The stamped ___ showed that the letter was mailed in 1923.|Look at the stamped ___ to see what town it came from.|The inked ___ was smudged, so we could not read the mailing date.|envelope,telegram
  recipient|the person who receives something|收件人，接受者|The ___ of the letter lived in another country.|Each ___ of the award gave a short speech.|The letter never reached its ___.|correspondence,entry
  entry|one part of a diary, written at one time|（日记的）一篇|Each ___ in her diary begins with the date.|His last diary ___ was written the night before the storm.|In one diary ___, she describes her first day at school.|memoir,postmark|entries
  memoir|a book a person writes about their own life|回忆录|The old sailor wrote a book, a ___, about his years at sea.|In her published ___, the actress describes growing up poor.|The general's life-story ___ came out after the war.|entry,correspondence
  quill|a pen made from a feather|羽毛笔|He dipped his feather ___ into the ink.|The feather ___ scratched across the paper.|Writers sharpened the tip of the feather ___ with a knife.|parchment,telegram
  parchment|a writing material made from animal skin|羊皮纸|The old medieval map was drawn on animal-skin ___.|The animal-skin ___ had turned yellow with age.|Monks copied books by hand on animal-skin ___.|stationery,envelope
  telegram|a short message sent by wire and delivered on paper|电报|A short wired ___ arrived with the news: COMING HOME STOP.|Sending a wired ___ cost money for every word.|A boy on a bicycle delivered the paper ___ sent by wire.|postmark,quill|telegrams
  stationery|paper and envelopes for writing letters|信纸信封，文具|She wrote on pink ___ with her name printed at the top.|The hotel gave its guests matching ___ for their letters.|He bought a box of ___ to write thank-you notes.|parchment,correspondence
  `,
  "context-clues",
  {
    intro: t(
      "Inside an attic trunk sits fifty years of family **correspondence**: pink **stationery** sealed in an **envelope** bearing a 1923 **postmark**, a short **telegram** sent by wire, and a leather diary whose final **entry** inspired a full-length **memoir**. These ten words capture letters and personal writing.",
      "阁楼旧木箱里藏着五十年的家书往来（**correspondence**）：印着 1923 年邮戳（**postmark**）的信封（**envelope**）里装着粉色信纸（**stationery**），还有一封电报（**telegram**）和一本日记，其中最后一篇（**entry**）后来写成了一本回忆录（**memoir**）。这十个词讲述书信与日记。",
    ),
    watchOut: {
      meanings: t(
        "Tell **entry** (one single dated section inside a diary) apart from **memoir** (a full *book* a person writes about their own life) and **correspondence** (an exchange of letters sent back and forth between people).",
        "分清 **entry**（日记里单日写下的一篇）、**memoir**（本人撰写生平的整本回忆录）和 **correspondence**（两人之间往来的通信信件）。",
      ),
      use: t(
        "Tell **stationery** (paper and envelopes sold for writing letters—spelled with *-ery*) apart from **parchment** (ancient writing sheets made from animal skin).",
        "分清 **stationery**（现代写信用的成套信纸信封，结尾 *-ery*）和 **parchment**（古代用动物皮制成的羊皮纸）。",
      ),
      spelling: t(
        "Watch **stationery** (ends in *-ery* for paper, not *stationary* meaning standing still), **correspondence** (double *r* + *-ence*), and **recipient** (*re-* + *cip-* + *-ient*).",
        "注意 **stationery** 结尾是 **-ery**（信纸文具，别写成静止的 *stationary*）、**correspondence** 的双写 **r**，以及 **recipient** 结尾的 **-ient**。",
      ),
    },
    notes: `
      correspondence|fifty years of letters exchanged between two friends|three boxes of letters exchanged with a scientist|displayed letters sent between a soldier and family|correspondence is letters exchanged between people; memoir is a life-story book|correspondence 是彼此往来的书信；memoir 是个人回忆录|memoir is a book one person writes about their own life, not boxes of letters exchanged between two people|memoir 是某人写自己生平的书，不是两人之间来回寄送的往来信件|stationery is blank writing paper and envelopes, not fifty years of completed letters sent between people|stationery 是空白信纸信封，不是已寄出的往来书信|cor · re · spon · dence|double r + spon + -dence|双写 r、spon 加 -dence
      envelope|a paper letter cover addressed on the front|a paper cover torn open to pull out a letter|a letter cover with a stamp in its corner|envelope is the paper cover holding a letter; postmark is the ink stamp|envelope 是装信的信封；postmark 是邮戳印记|postmark is the ink stamp showing where and when a letter was mailed, not a paper cover you tear open|postmark 是盖在上面的邮戳印记，不是能撕开取出信纸的纸信封|parchment is an ancient writing sheet made of animal skin, not a modern paper cover with a stamp|parchment 是羊皮纸，不是贴邮票装信件的纸信封|en · ve · lope|en- + ve + long o + silent e|en-、ve 加发长 o 的 lope
      postmark|a stamped mark showing a letter was mailed in 1923|a stamped mark showing what town a letter came from|a smudged ink mark hiding the mailing date|postmark is the mailing date-and-town stamp; envelope is the paper cover|postmark 是标明邮寄时间地点的邮戳；envelope 是信封|envelope is the paper cover around a letter, not the inked date-and-town stamp pressed onto it|envelope 是纸信封本身，不是盖在信封上显示年份和城镇的邮戳|telegram is a short message sent by wire, not an inked mailing stamp on a letter|telegram 是有线电报，不是信封上显示邮寄日期的邮戳|post · mark|compound word: post + mark|合成词：post 加 mark
      recipient|the person in another country receiving a letter|each award winner giving a short speech|the intended person a letter never reached|recipient is the person receiving something; correspondence is the letters themselves|recipient 是收件人或领奖者；correspondence 是书信本身|correspondence is the letters exchanged between people, not the living person who receives a letter or award|correspondence 是往来书信本身，不是收信或发表获奖感言的人|entry is one dated piece in a diary, not the person who receives a letter or prize|entry 是日记里的一篇，不是收件人或得奖者|re · cip · i · ent|re- + soft c (/s/) + ip + -ient|re-、读 /s/ 的 c 加 ip 和 -ient
      entry|one dated section inside a diary|a final diary piece written before a storm|one diary piece describing the first day of school|entry is one dated diary piece; memoir is a whole life-story book|entry 是日记里的单篇记录；memoir 是整本回忆录|memoir is an entire published book about a person's life, not one single dated section inside a diary|memoir 是整本自传回忆录，不是日记里按日期写的一篇|postmark is a mailing stamp on a letter, not a dated section written inside a diary|postmark 是信封上的邮戳，不是日记里的单篇记录|en · try|en + tr blend + -y ending|en、tr 连缀加 -y
      memoir|a sailor's book about his years at sea|an actress's published book about growing up poor|a general's life-story book published after a war|memoir is a life-story book; entry is one diary piece|memoir 是整本个人回忆录；entry 是日记单篇|entry is a single dated piece inside a diary, not an entire published book covering years at sea or a war|entry 只是日记里的单篇，不是整本出版的生平回忆录|correspondence is letters sent between people, not a single author's published book about their own life|correspondence 是往来书信，不是作者自己撰写出版的生平回忆录|mem · oir|mem + oir saying /wɑːr/|mem 加读 /wɑːr/ 的 oir
      quill|a feather pen dipped into ink|a feather pen scratching across paper|a feather pen tip sharpened with a knife|quill is a feather pen; parchment is animal-skin writing sheet|quill 是羽毛笔；parchment 是羊皮纸|parchment is animal-skin writing material, not a feather pen dipped in ink or sharpened with a knife|parchment 是供书写的羊皮纸，不是蘸墨水、用小刀削尖的羽毛笔|telegram is a short message sent by wire, not a feather pen scratching across paper|telegram 是电报，不是蘸墨写字的羽毛笔|quill|qu + short i + double l|qu、短 i 加双写 l
      parchment|animal-skin sheet holding an old medieval map|aged yellowed animal-skin writing sheet|animal-skin sheets monks copied books onto by hand|parchment is animal-skin writing material; stationery is modern letter paper|parchment 是动物皮制成的羊皮纸；stationery 是现代信纸信封|stationery is modern paper and envelopes for personal letters, not ancient animal-skin sheets used by monks|stationery 是现代写信用的纸质信纸信封，不是中世纪修道士用的动物皮羊皮纸|envelope is a folded paper cover for a letter, not animal-skin sheets for medieval maps and books|envelope 是装信的信封，不是用来手抄古籍或绘古图的羊皮纸|parch · ment|par + ch + -ment ending|par、ch 加 -ment
      telegram|a short wired paper message reading COMING HOME STOP|a wired message priced by every single word|a wired paper message delivered by a boy on a bicycle|telegram is a short wired message; postmark is a mailing stamp|telegram 是有线传送的纸质电报；postmark 是邮戳|postmark is an ink stamp showing where and when a letter was mailed, not a short wired message delivered on paper|postmark 是邮戳印记，不是按字计费、骑车送达的电报|quill is a feather pen, not a short message sent by wire|quill 是羽毛笔，不是通过电线拍发的短讯电报|tel · e · gram|tele- (far) + gram (written message)|前缀 tele-（远）加词根 gram（文字）
      stationery|pink letter paper printed with a name|matching letter paper and envelopes from a hotel|a box of letter paper bought for thank-you notes|stationery is paper and envelopes for letters; parchment is animal skin|stationery 是写信用的信纸信封；parchment 是羊皮纸|parchment is ancient writing material made from animal skin, not pink printed paper or a box for thank-you notes|parchment 是古代动物皮羊皮纸，不是印名字的粉色信纸或谢卡信纸盒|correspondence is completed letters exchanged between people, not blank paper bought in a box to write on|correspondence 是往来信件本身，不是买来写信用的空白信纸信封|sta · tion · er · y|station + -ery (paper, not -ary still)|station 加 -ery（信纸文具，别写成静止 stationary）
    `,
  },
);

const longAgo = batch(
  "words-of-life-long-ago",
  ["Words of Life Long Ago", "旧时生活的词"],
  ["everyday life long ago", "旧时的日常生活"],
  `
  lantern|a light in a case with a handle|提灯|She carried a glowing ___ to the barn at night.|The carried ___ flickered in the night wind.|Before electricity, a hand-held ___ lit the way home.|hearth,slate|lanterns
  hearth|the floor of a fireplace|炉床，壁炉|The family gathered around the warm fireplace ___ to keep warm.|A pot of soup bubbled over the fireplace ___.|Ashes from the fireplace ___ were swept out each morning.|lantern,homestead
  chore|a small job done regularly at home|家务活|Feeding the chickens was her first daily ___ of the day.|Every child had a household ___ to finish before school.|Washing dishes is my least favorite ___.|textile,slate|chores
  homestead|a house and the farm land around it where a family lives|宅地，家园|The pioneer family built a ___ on the prairie.|The family ___ had a log cabin, fields, and a barn.|They farmed their prairie ___ for forty years.|hearth,textile
  churn|to stir cream hard to make butter|搅（制黄油）|It took an hour to ___ the cream into butter.|Grandma taught me how to ___ butter from cream.|The children took turns to ___ the cream.|dissolve,preserve|churned
  textile|cloth made by weaving or knitting|纺织品|The ___ mill wove cotton cloth.|Wool was the most common woven ___ on the farm.|The museum shows a ___ woven two hundred years ago.|slate,lantern|textiles
  blacksmith|a person who makes things from iron by heating and hammering it|铁匠|The ___ shaped a hot iron horseshoe on his anvil.|Sparks flew as the ___ hammered the hot iron.|Every village needed a ___ to forge and fix its iron tools.|cobbler,peddler
  cobbler|a person who makes and mends shoes|鞋匠|The ___ put new soles on my boots.|The ___ stitched the shoe leather by hand.|Take your torn shoes to the ___.|blacksmith,peddler
  peddler|a person who travels from place to place selling things|小贩，货郎|A traveling ___ came to the farm selling pots and ribbons.|The ___ sold needles and thread from his cart.|Children ran to see what goods the traveling ___ had brought in his cart.|cobbler,blacksmith
  slate|a small board of dark stone that pupils wrote on with chalk|石板|Pupils wrote their chalk sums on a stone ___.|She wiped her chalk ___ clean with a cloth.|Paper cost too much, so each schoolchild wrote on a stone ___.|textile,lantern
  `,
  "context-clues",
  {
    intro: t(
      "On a prairie **homestead**, dawn starts with a daily **chore** by the warm fireplace **hearth**: children **churn** cream into butter, carry a **lantern** to the barn, wipe chalk off a school **slate**, and hurry outside when a traveling **peddler** rolls down the lane past the village **blacksmith** and **cobbler**. These ten words paint everyday life long ago.",
      "草原宅地（**homestead**）的清晨从炉床（**hearth**）边的家务活（**chore**）开始：孩子们搅打（**churn**）奶油做黄油，提着提灯（**lantern**）去谷仓，擦净上课用的石板（**slate**），听到货郎（**peddler**）摇铃经过村里的铁匠（**blacksmith**）和鞋匠（**cobbler**）铺时便跑出门去。这十个词重现旧时生活。",
    ),
    watchOut: {
      meanings: t(
        "Tell **blacksmith** (heats and hammers *iron* on an anvil to make horseshoes and tools) apart from **cobbler** (makes and mends *shoes*) and **peddler** (travels from farm to farm selling small goods from a cart).",
        "分清 **blacksmith**（打铁造马蹄铁和农具的铁匠）、**cobbler**（做鞋修鞋的鞋匠）和 **peddler**（走村串户叫卖杂货的货郎）。",
      ),
      use: t(
        "Tell **lantern** (a portable light in a case with a handle you carry outside) apart from **hearth** (the indoor fireplace floor where a family cooks and warms up).",
        "分清 **lantern**（提在手里照亮夜路的便携提灯）和 **hearth**（屋里生火做饭取暖的壁炉炉床）。",
      ),
      spelling: t(
        "Watch **hearth** (*ear* saying /ɑːr/, like *heart* + *h*), **homestead** (*home* + *stead* with *ea* saying short *e*), and **peddler** (double *d* + *-ler*).",
        "注意 **hearth** 读 /hɑːrθ/（像 *heart* 加 *h*）、**homestead** 中发短 e 的 **ea**，以及 **peddler** 的双写 **d**。",
      ),
    },
    notes: `
      lantern|a glowing carried light taken to the barn at night|a portable light flickering in the night wind|a hand-held light used before electricity|lantern is a portable carried light; hearth is an indoor fireplace floor|lantern 是手提便携提灯；hearth 是室内壁炉炉床|hearth is the built-in floor of an indoor fireplace, not a portable light you carry to a barn in the wind|hearth 是屋里固定的壁炉炉床，不能提着去谷仓或照亮回家夜路|slate is a small dark stone writing board, not a glowing light|slate 是写字用的小石板，不是发光的提灯|lan · tern|short a + n + -tern ending|短 a、n 加结尾 -tern
      hearth|a warm fireplace floor gathered around by a family|a fireplace floor where soup bubbles in a pot|a fireplace floor swept of ashes each morning|hearth is the fireplace floor; homestead is the whole house and farm|hearth 是壁炉炉床；homestead 是整座宅地农庄|lantern is a portable hand-held light, not a fireplace where soup bubbles and ashes are swept|lantern 是手提灯笼，不是煮汤、扫灰的壁炉炉床|homestead is the entire house and surrounding farmland, not just the fireplace floor inside|homestead 是整座房屋与周围农田，不只是屋里扫灰烤火的炉床|hearth|ear saying /ɑːr/ + th (heart + h)|发 /ɑːr/ 的 ear 加 th（heart 加 h）
      chore|feeding chickens as the first daily task|a household job every child finishes before school|washing dishes as an unfavored daily task|chore is a regular household job; textile is woven cloth|chore 是日常家务活；textile 是纺织布料|textile is woven or knitted cloth, not a daily household job like feeding chickens or washing dishes|textile 是织出来的布料纺织品，不是喂鸡、洗碗之类的家务活|slate is a small stone writing board, not a regular task done at home|slate 是写字石板，不是每天要做的家务活|chore|ch + or + silent e|ch、or 加词尾 e
      homestead|a pioneer family's house and prairie farm|a family place with log cabin, fields, and barn|a prairie farm worked for forty years|homestead is a house and surrounding farm; hearth is only the fireplace floor|homestead 是房屋加农田的整片家园；hearth 只是壁炉炉床|hearth is only the floor of a fireplace inside a cabin, not an entire prairie farm with fields and a barn|hearth 只是屋里的壁炉炉床，不是带木屋、谷仓和田地的整片宅地|textile is woven cloth, not a house and surrounding farmland on the prairie|textile 是纺织布料，不是耕作四十年的草原农庄宅地|home · stead|compound word: home + stead (ea saying short e)|合成词：home 加发短 e 的 stead
      churn|stirring cream hard for an hour to make butter|making butter from cream with Grandma|children taking turns stirring cream|churn stirs cream hard into butter; dissolve mixes a solid invisibly into liquid|churn 是用力搅打奶油制黄油；dissolve 是使固体溶解在液体中|dissolve means mixing a solid invisibly into a liquid, not stirring cream hard until it thickens into butter|dissolve 是溶入液体消失，不是用力搅打奶油使其凝成黄油|preserve means keeping food safe from spoiling with salt or storage, not stirring cream hard to make butter|preserve 是用盐等方法保存食物防变质，不是搅打奶油做黄油|churn|ch + ur saying /ɜːr/ + n|ch、发 /ɜːr/ 的 ur 加 n
      textile|cotton cloth woven in a mill|common woven wool made on a farm|historic cloth woven two hundred years ago|textile is woven or knitted cloth; slate is stone|textile 是织造的纺织布料；slate 是石板|slate is a dark stone board for chalk writing, not woven cotton or wool cloth|slate 是写字石板，不是棉花或羊毛织成的布料|lantern is a portable light with a handle, not cloth woven in a mill|lantern 是提灯，不是纺织厂织出的棉布或毛织品|tex · tile|short e + x + -tile with silent e|短 e、x 加带 e 的 -tile
      blacksmith|an ironworker shaping a horseshoe on an anvil|an ironworker hammering hot iron in sparks|a village craftsperson forging and fixing iron tools|blacksmith works hot iron; cobbler mends shoes|blacksmith 是打铁的铁匠；cobbler 是修鞋的鞋匠|cobbler makes and mends shoes from leather, not hot iron horseshoes and tools on an anvil|cobbler 是缝皮革修鞋的鞋匠，不是在铁砧上锻打马蹄铁的铁匠|peddler travels selling small goods from a cart, not hammering hot iron on an anvil|peddler 是推车叫卖的货郎，不是打铁修农具的铁匠|black · smith|compound word: black + smith|合成词：black 加 smith
      cobbler|a shoemaker putting new soles on boots|a shoemaker stitching shoe leather by hand|a craftsperson mending torn shoes|cobbler makes and mends shoes; blacksmith hammers iron|cobbler 是修鞋匠；blacksmith 是铁匠|blacksmith hammers hot iron into horseshoes and tools, not stitching leather or putting soles on boots|blacksmith 是打铁匠，不是缝制皮革、给靴子钉新鞋底的鞋匠|peddler travels selling pots and ribbons, not repairing torn shoes by hand|peddler 是走街串巷的小贩，不是专门修补破鞋的鞋匠|cob · bler|short o, double b, and -ler ending|短 o、双写 b 加 -ler
      peddler|a traveling seller bringing pots and ribbons to a farm|a traveling seller offering needles and thread from a cart|a traveling merchant bringing cartloads of goods|peddler travels selling goods; cobbler mends shoes|peddler 是走村串户的货郎；cobbler 是鞋匠|cobbler makes and mends shoes in a shop, not traveling farm to farm selling pots, ribbons, and needles|cobbler 是修鞋匠，不是推车卖锅具、丝带和针线的游方货郎|blacksmith hammers hot iron in a forge, not traveling with a cart of ribbons and thread|blacksmith 是铁匠，不是拉车沿路售卖杂货的货郎|ped · dler|short e, double d, and -ler ending|短 e、双写 d 加 -ler
      slate|a dark stone board for writing chalk sums|a chalk board wiped clean with a cloth|a stone writing board used when paper cost too much|slate is a stone writing board; textile is woven cloth|slate 是写粉笔字的石板；textile 是纺织布料|textile is woven cloth, not a hard dark stone board written on with chalk|textile 是柔软布料，不是用粉笔写算术题的硬石板|lantern is a portable light, not a stone board wiped clean after writing sums|lantern 是照明提灯，不是代替纸张写字的石板|slate|sl blend + silent e making long a|sl 连缀加发长 a 的 ate
    `,
  },
);

const memory = batch(
  "words-for-memory-and-history",
  ["Words for Memory and History", "记忆与历史的词"],
  ["remembering the past", "铭记过去"],
  `
  recall|to remember|回忆|Can you ___ the name of your first teacher?|My grandfather can still ___ the day the war ended.|I cannot ___ where I put my keys.|preserve,commemorate
  historic|important in history|有历史意义的|The first moon landing was a famous, ___ event.|The famous ___ house where the treaty was signed is now a museum.|It was a famous, ___ day when the great bridge opened.|bygone,peculiar
  heritage|the traditions and history passed down from earlier generations|传统，遗产|Folk music is part of our family's cultural ___.|The festival celebrates the town's traditions and ___.|Learning the old language keeps our cultural ___ alive.|testimony,descendant
  descendant|a person born later in a family, such as a grandchild|后代|She is a ___ of the town's first settlers.|Every ___ of the old farmer still lives nearby.|A royal ___ of the king still lives in the castle.|heritage,anniversary|descendants
  preserve|to keep safe from harm or change|保存，保护|The museum works to ___ old letters from decay.|Long ago, people used salt to ___ meat so it would not spoil.|We must ___ the forest and keep it safe for the future.|recall,commemorate|preserved
  document|an official paper that gives information|文件|The official paper ___ proved that the family owned the land.|This official ___ is signed by the mayor.|Keep each important official ___ in a safe place.|testimony,heritage|documents
  anniversary|the date on which something happened in an earlier year|周年纪念日|Today is the hundredth ___ of the school's founding.|My parents celebrated their twentieth wedding ___.|The town held a parade on the yearly ___ of the flood.|heritage,testimony
  testimony|what a witness says happened|证词|The old woman's spoken ___ told what she saw that day.|In court, his witness ___ helped the judge decide.|The firsthand ___ of the survivors was written down.|document,anniversary
  commemorate|to do something special to remember an event or a person|纪念|A statue was built to honor and ___ the brave firefighters.|The town rings its bells each year to ___ the end of the war.|We planted a tree to honor and ___ our old teacher.|recall,preserve
  bygone|from a time long past|过去的，往昔的|The old photos show a long-past, ___ age of horses and carts.|In long-past, ___ days, everyday people washed clothes by hand.|The museum brings long-past, ___ everyday times back to life.|historic,advanced
  `,
  "context-clues",
  {
    intro: t(
      "On the town's hundredth **anniversary**, a **descendant** of the first settlers donates a signed **document** so the museum can **preserve** it, rings the bell to **commemorate** a **historic** day, and helps visitors **recall** a **bygone** era and treasure their shared **heritage**. These ten words connect memory and history.",
      "建镇百周年纪念日（**anniversary**）上，首批拓荒者的后代（**descendant**）捐出一份官方文件（**document**）交由博物馆保存（**preserve**），敲钟纪念（**commemorate**）这一有历史意义的（**historic**）日子，唤起人们对往昔（**bygone**）岁月的回忆（**recall**）与文化传统（**heritage**）。这十个词讲述记忆与历史。",
    ),
    watchOut: {
      meanings: t(
        "Tell **historic** (famous and *important* in history, like the first moon landing) apart from **bygone** (simply from a *long-past* everyday time, like washing clothes by hand or riding in carts).",
        "分清 **historic**（在历史上具有重大意义的）和 **bygone**（仅指遥远过去、一去不返的往昔时光）。",
      ),
      use: t(
        "Tell **recall** (remember something inside your own mind) apart from **commemorate** (do something *public or special*—build a statue, plant a tree, ring bells—to honor a past event or person) and **preserve** (protect a physical thing from decay or harm).",
        "分清 **recall**（在脑海里回忆想起）、**commemorate**（立碑、种树、鸣钟等公开纪念活动）和 **preserve**（保护实物或森林免遭损坏变质）。",
      ),
      spelling: t(
        "Watch **commemorate** (double *m* + *em* + single *m* + *-orate*), **descendant** (*de-* + *sc* saying /s/ + *-ant*), and **anniversary** (double *n* + *-vers-* + *-ary*).",
        "注意 **commemorate** 前双写 **m** 后单 **m**、**descendant** 中的 **sc** 与 **-ant**，以及 **anniversary** 的双写 **n**。",
      ),
    },
    notes: `
      recall|remembering a first teacher's name|a grandfather remembering the day a war ended|failing to remember where keys were put|recall remembers in your mind; commemorate honors publicly with an event|recall 是在脑中回忆；commemorate 是举行仪式公开纪念|preserve means protecting something physical from decay or harm, not remembering a teacher's name or where keys are|preserve 是保护实物免于损坏，不是想起人名或钥匙放哪儿了|commemorate means holding a special ceremony or building a monument, not simply remembering where you put your keys|commemorate 是立碑鸣钟等专门纪念活动，不是想不起钥匙放哪了|re · call|re- + call (double l)|前缀 re- 加双写 l 的 call
      historic|the first moon landing as a famous history-making event|a famous museum house where a treaty was signed|a famous day when a great bridge opened|historic means important in history; bygone means simply from long ago|historic 指具有重大历史意义；bygone 仅指往昔过去|bygone simply means from a time long past without implying major historical importance like a moon landing or treaty|bygone 只表示年代久远，不强调登月、签条约那样的重大历史意义|peculiar means odd or unusual, not famous and important in history|peculiar 指古怪奇特，不指载入史册的重大历史意义|his · tor · ic|short i + or + -ic ending|短 i、or 加形容词后缀 -ic
      heritage|folk music passed down in a family|town traditions celebrated at a festival|an old language kept alive across generations|heritage is passed-down traditions; descendant is a later-born family member|heritage 是代代相传的传统遗产；descendant 是家族后代|testimony is a witness's spoken statement of what happened, not cultural music, traditions, or an old language|testimony 是目击证人的证词，不是代代相传的民乐、习俗和古语|descendant is a person born later in a family, not cultural traditions or language kept alive|descendant 是具体的家族后人，不是传统与文化本身|her · i · tage|short e + i + soft g (/dʒ/) in -tage|短 e、i 加读 /dʒ/ 的 -tage
      descendant|a later-born family member of the first settlers|each later family member of an old farmer|a royal heir still living in a king's castle|descendant is a later-born person in a family; heritage is passed-down tradition|descendant 是后代子孙（人）；heritage 是传统遗产|heritage is abstract traditions and history, not a living person born later in a family|heritage 是抽象文化传统，不是住在城堡或村里的具体后人|anniversary is a yearly date marking a past event, not a living person in a family line|anniversary 是周年纪念日，不是家族后代|de · scen · dant|de- + sc saying /s/ + -dant ending|de-、读 /s/ 的 sc 加 -dant
      preserve|a museum protecting old letters from decay|using salt to keep meat from spoiling|protecting a forest for future generations|preserve keeps something safe from harm or decay; recall remembers in mind|preserve 是保护保存免遭损毁；recall 是回忆想起|recall means remembering something in your mind, not protecting letters, meat, or a forest from decay|recall 是在脑中回忆，不是用盐腌肉或保护森林与旧信免遭毁坏|commemorate means honoring a past event with a statue or ceremony, not keeping meat from spoiling or protecting a forest|commemorate 是举行纪念仪式，不是腌制食物防变质或保护古信森林|pre · serve|pre- + er saying /ɜːr/ + ve|前缀 pre- 加 serve
      document|an official paper proving family land ownership|an official paper signed by a mayor|an important official paper kept safely|document is an official informative paper; testimony is spoken witness words|document 是官方书面文件；testimony 是证人口述证词|testimony is what a witness says happened, not an official signed paper proving land ownership|testimony 是目击者口述经过，不是市长签署或证明地产归属的官方文件|heritage is passed-down cultural traditions, not a single paper signed by a mayor|heritage 是文化传统，不是市长签字的一纸文件|doc · u · ment|short o + u + -ment ending|短 o、u 加 -ment
      anniversary|the hundredth yearly date of a school's founding|parents celebrating their twentieth wedding date|a town parade on the yearly date of a flood|anniversary is the yearly return of a date; heritage is passed-down tradition|anniversary 是周年纪念日；heritage 是传统遗产|heritage is passed-down culture and traditions, not a specific hundredth or twentieth yearly date|heritage 是代代相传的文化传统，不是建校百年或结婚二十周年的特定日期|testimony is a witness's account of what happened, not a yearly calendar date celebrated with a parade|testimony 是证人证词，不是每年庆祝的周年纪念日|an · ni · ver · sa · ry|double n + i + ver + -sary|双写 n、i、ver 加 -sary
      testimony|an old woman's spoken account of what she saw|a witness's courtroom statement helping a judge decide|survivors' firsthand accounts written down|testimony is a witness's account; document is an official paper|testimony 是目击证人的证词陈述；document 是官方文件|document is an official signed paper like a deed, not a witness's spoken courtroom account of what they saw|document 是官方书面证件，不是目击者在法庭上讲述亲眼所见的证词|anniversary is a yearly commemorative date, not a witness's spoken account in court|anniversary 是周年纪念日，不是证人在法庭上作的证词|tes · ti · mo · ny|tes + ti + long o + -ny|tes、ti、长 o 加 -ny
      commemorate|building a statue to honor brave firefighters|ringing town bells yearly for a war's end|planting a tree to honor an old teacher|commemorate honors with a special act; recall simply remembers in mind|commemorate 是用特别行动公开纪念；recall 只是自己想起|recall means privately remembering in your mind, not building a statue, ringing bells, or planting a tree to honor someone|recall 只是在脑海里回忆，不是立雕像、敲钟或种树来公开纪念|preserve means keeping an object or forest safe from decay, not honoring firefighters or a war's end with bells|preserve 是保护实物免损毁，不是鸣钟立像纪念英雄或战争结束|com · mem · o · rate|double m at start + single m after e + -orate|前双写 m、e 后单写 m 加 -orate
      bygone|a long-past age of horses and carts|long-past days when everyday people washed by hand|long-past everyday times shown in a museum|bygone means from a time long past; historic means famous and important in history|bygone 仅指遥远往昔；historic 指具有重要历史意义|historic means famous and important in history, not ordinary everyday life like washing clothes by hand in long-past days|historic 强调在历史上举足轻重，不指手洗衣服或马车代步这类普通往昔日常|advanced means far ahead in modern skill or knowledge, the opposite of a long-past age of carts and hand-washing|advanced 指领先先进，与马车代步、手洗衣物的遥远往昔正相反|by · gone|compound word: by + gone|合成词：by 加 gone
    `,
  },
);

const longing = batch(
  "words-for-longing-and-affection",
  ["Words for Longing and Affection", "思念与情感的词"],
  ["longing, love and loss", "思念、爱和失去"],
  `
  homesick|sad because you are away from home|想家的|On her first night away at camp, she felt ___.|The sailor far at sea was ___ for his village.|Letters from home made him a little less ___.|fond,sincere
  longing|a strong wish for something you do not have|渴望|He felt a deep wish, or ___, for the open sea.|Her letters were full of wistful ___ to return home.|A strong ___ to see her distant brother kept her awake.|grief,affection
  cherish|to love and care for deeply|珍爱|I ___ the letters my grandmother wrote me.|We ___ our happy memories of that summer.|She will ___ the treasured gift forever.|yearn,reunite
  fond|having a warm liking for someone or something|喜爱的|I am still ___ of my old teddy bear.|She has warm, ___ memories of her grandfather's farm.|He grew ___ of the little town and its friendly people.|sincere,homesick
  sincere|honest and truly meant|真诚的|Please accept my honest, ___ thanks.|His apology was honest and ___, so she forgave him.|She gave an honest, ___ smile.|fond,homesick
  affection|a feeling of love or liking|喜爱，感情|The dog showed its warm ___ by licking my face.|She hugged her brother with great warm ___.|Seeing each other every day, the two old friends felt their warm ___ grow over the years.|longing,grief
  reunite|to bring or come together again after a time apart|重聚|When the war ended, separated families began to ___.|The letter helped ___ two sisters after forty years apart.|We hope to ___ with our cousins next summer.|cherish,yearn|reunited
  farewell|a goodbye|告别|They waved goodbye, or ___, as the ship sailed away.|The class held a goodbye, or ___, party for the leaving teacher.|Her goodbye, or ___, letter made us cry.|grief,longing
  yearn|to want something very much, often something far away|渴望，思念|Sailors ___ for home on long ocean voyages.|She began to ___ for the distant mountains of her childhood.|Prisoners ___ for freedom beyond the walls.|cherish,reunite
  grief|deep sadness, especially after a death|悲痛|The town was filled with deep ___ after the deadly flood.|She wrote about her deep ___ when her beloved dog died.|In time, his deep ___ over the loss turned into happy memories.|affection,farewell
  `,
  "context-clues",
  {
    intro: t(
      "On his first voyage far from shore, a **homesick** sailor waves **farewell**, feels a quiet **longing** to **reunite** with his family, and holds every letter close to **cherish** their **sincere** **affection**. These ten words express love, distance, and loss.",
      "初次远航离岸，想家（**homesick**）的水手挥手告别（**farewell**），心中涌起与家人重聚（**reunite**）的渴望（**longing**），把每封家书珍爱（**cherish**）在怀里，感受那份真诚（**sincere**）的喜爱与深情（**affection**）。这十个词表达思念、爱与失去。",
    ),
    watchOut: {
      meanings: t(
        "Tell **longing** (a *noun* for a deep wish for something far away or missing) apart from **yearn** (a *verb* meaning to miss and want something far away—always paired with *for*).",
        "分清 **longing**（名词，对远方或缺失之物的强烈渴望）和 **yearn**（动词，常配 *for*，深深思念渴望）。",
      ),
      use: t(
        "Tell **fond** (warmly liking someone or something—often *fond of* or *fond memories*) apart from **sincere** (honest and truly meant, like a sincere apology or thanks) and **homesick** (sad specifically because you are away from home).",
        "分清 **fond**（喜爱依恋，常配 *of* 或修饰回忆）、**sincere**（真诚发自内心，修饰道歉或感谢）和 **homesick**（因离家而想家难过）。",
      ),
      spelling: t(
        "Watch **affection** (double *f* + *-ection*), **sincere** (soft *c* /s/ + *-ere*), and **yearn** (*ear* saying /ɜːr/ + *n*).",
        "注意 **affection** 的双写 **f**、**sincere** 中读 /s/ 的 **c**，以及 **yearn** 中读 /ɜːr/ 的 **ear**。",
      ),
    },
    notes: `
      homesick|feeling sad on a first night away at camp|a sailor far at sea missing his village|feeling cheered a little by letters from home|homesick misses home; fond warmly likes something|homesick 是离家想家；fond 是温和喜爱|fond means having a warm liking for something, not feeling sad specifically because you are away from home|fond 指喜爱依恋，不指离家在外时难过想家|sincere means honest and truly meant, not sad from missing home|sincere 是真诚诚恳，不是离家思乡|home · sick|compound word: home + sick|合成词：home 加 sick
      longing|a deep wish for the open sea|letters full of wistful desire to return home|a strong wish to see a distant brother|longing is a deep wish for something absent; affection is warm love|longing 是对未得或远方之物的渴望；affection 是温暖喜爱|grief is deep sadness over a death or loss, not a wistful wish for something far away or absent|grief 是丧亲失落后的深沉悲痛，不是对远方或未得之物的向往渴望|affection is warm love or liking, not a wistful ache for something you do not have or cannot see|affection 是温暖的爱意喜爱，不特指求之不得或远隔重洋的思念渴望|long · ing|long + -ing ending|long 加名词后缀 -ing
      cherish|loving and treasuring grandmother's letters|treasuring happy summer memories|treasuring a special gift forever|cherish loves and treasures deeply; yearn longs for something absent|cherish 是深深珍爱；yearn 是渴望思念远方之物|yearn means wanting something far away (with "for"), not loving and treasuring letters or a gift you already hold|yearn 需配 for 表示渴望未得之物，不能直接接信件或礼物表示珍藏珍爱|reunite means bringing separated people back together, not loving and treasuring letters, memories, or a gift|reunite 是久别重逢，不是珍视信件、回忆或礼物|cher · ish|ch + er + -ish ending|ch、er 加 -ish
      fond|still warmly liking an old teddy bear|warm loving memories of a grandfather's farm|growing warmly attached to a friendly little town|fond has a warm liking; sincere is honest and truly meant|fond 是喜爱依恋；sincere 是真诚诚恳|sincere means honest and truly meant, not warmly liking a teddy bear or a little town (with "of")|sincere 指诚恳真诚，不配 of 表示喜爱泰迪熊或小镇|homesick means sad because you are away from home, not warmly liking a teddy bear or town|homesick 是想家难过，不配 of 表示喜爱某物|fond|short o + nd blend|短音 o 加结尾 nd
      sincere|honest, heartfelt thanks|an honest apology that earns forgiveness|an honest, genuine smile|sincere is honest and truly meant; fond is warmly liking|sincere 是发自内心的真诚；fond 是温和喜爱|fond means warmly liking someone or something, not honest and truly meant like an apology or thanks|fond 指喜爱依恋，不能形容诚恳的道歉或感谢|homesick means sad from being away from home, not honest and genuine|homesick 是想家，不能形容真诚的感谢、道歉或微笑|sin · cere|short i + n + soft c (/s/) + -ere|短 i、n、读 /s/ 的 c 加 -ere
      affection|a dog showing warm love by licking a face|a warm loving hug for a brother|growing warm fondness between people over years|affection is warm love or liking; longing is wishing for what is absent|affection 是温暖喜爱之情；longing 是渴望思念|longing is a wistful wish for something far away or missing, not a dog licking a face or a warm hug|longing 是对远方缺失之物的渴望，不是小狗舔脸或拥抱流露的亲近喜爱|grief is deep sorrow after a loss or death, the opposite of warm love and hugs|grief 是失去后的深沉悲痛，与温暖喜爱正相反|af · fec · tion|double f + short e + -ction|双写 f、短 e 加 -ction
      reunite|separated families coming together after war|two sisters brought together after forty years apart|hoping to meet cousins again next summer|reunite brings separated people back together; cherish treasures deeply|reunite 是久别重聚；cherish 是深深珍爱|cherish means loving and treasuring deeply, not separated families or sisters coming back together after years apart|cherish 是珍爱呵护，不是战后或阔别四十年后重新团聚|yearn means wanting something far away (with "for"), not physically bringing two separated sisters back together|yearn 是渴望思念，不是让失散的姐妹或家人重新相聚|re · u · nite|re- (again) + unite (long u + long i)|前缀 re-（重新）加 unite
      farewell|waving goodbye as a ship sails away|a goodbye party for a departing teacher|a tearful goodbye letter|farewell is a goodbye; grief is deep sadness after death|farewell 是临别告别；grief 是丧亲悲痛|grief is deep sorrow after a death or disaster, not waving goodbye to a ship or throwing a teacher's goodbye party|grief 是深沉悲痛，不是挥手送别船只或为老师办欢送会|longing is a strong wish for something absent, not a goodbye party or wave as a ship leaves|longing 是渴望向往，不是离别时的道别|fare · well|compound word: fare + well (double l)|合成词：fare 加双写 l 的 well
      yearn|sailors missing and longing for home at sea|missing childhood mountains from afar|prisoners deeply wanting freedom beyond walls|yearn longs deeply for something absent; cherish treasures what you value|yearn 配 for 表示深切渴望思念；cherish 是珍爱|cherish means loving and caring for deeply (without "for"), not aching for distant home or freedom|cherish 直接接宾语表示珍爱，不配 for 表示思念远方家园或渴望自由|reunite means coming back together again, not aching for distant mountains or freedom|reunite 是重新团聚，不是隔墙渴望自由或远航思乡|yearn|ear saying /ɜːr/ + n|发 /ɜːr/ 的 ear 加 n
      grief|deep town sadness after a deadly flood|deep sorrow written after a beloved dog died|deep sorrow over a loss softening into memories|grief is deep sadness after a loss or death; affection is warm love|grief 是失落丧亲后的深沉悲痛；affection 是温暖喜爱|affection is a warm feeling of love and liking, the opposite of deep sorrow after a flood or a dog's death|affection 是温暖的喜爱之情，与灾难或爱犬离世后的悲痛正相反|farewell is a goodbye said at parting, not deep sorrow lasting long after a death or disaster|farewell 是临别告别，不是灾难或离世后笼罩全城的深沉悲痛|grief|gr blend + ie saying long e + f|gr 连缀、发长 e 的 ie 加 f
    `,
  },
);

/** batchesB are the vocabulary batches of the last five units. */
export const batchesB: readonly BatchSpec[] = [
  americas,
  heights,
  riseAndFall,
  calendars,
  engineering,
  forces,
  planning,
  cities,
  detectives,
  suspense,
  reasoning,
  wilderness,
  ships,
  courage,
  choices,
  letters,
  longAgo,
  memory,
  longing,
];
