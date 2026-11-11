// Grade 5: the batches of words of the last five units, from the Maya, Aztec and Inca to letters and diaries.

import type { BatchSpec } from "../batch.ts";
import { batch } from "./batches.ts";

const americas = batch(
  "words-of-the-maya-aztec-and-inca",
  ["Words of the Maya, Aztec and Inca", "玛雅、阿兹特克与印加的词"],
  ["the Maya, the Aztec and the Inca", "玛雅人、阿兹特克人和印加人"],
  `
  terrace|a flat step cut into a hillside for farming|梯田|Farmers grew potatoes on each ___ of the steep hill.|Every stone ___ held the soil in place on the slope.|Water ran down from one ___ to the next.|plaza,causeway|terraces
  maize|corn|玉米|The Maya ground ___ to make flatbread.|Fields of ___ grew all around the city.|An old story says the first people were made from ___ dough.|cacao,llama
  causeway|a raised road built across water or wet ground|堤道|A long ___ joined the island city to the shore.|Soldiers marched along the ___ over the lake.|Builders raised the ___ above the water with earth and stone.|terrace,plaza|causeways
  cacao|the beans that chocolate is made from|可可（豆）|The Aztec made a bitter drink from ___ beans.|Beans of ___ were so valuable that people used them as money.|The ___ tree grows in the warm, wet rainforest.|maize,quipu
  quipu|a set of knotted strings the Inca used to keep records|奇普（结绳记事）|The Inca kept records on a ___ of knotted strings.|Each knot of the ___ stood for a number.|A trained reader could count the taxes on a ___.|codex,cacao
  codex|a folding book of pictures and writing|古抄本|Maya writers painted their history in a ___ made of bark paper.|The ___ folded out like a fan.|Only a few old Maya books survive, and each such ___ is a treasure.|quipu,ruins
  ruins|what is left of buildings that have fallen apart|遗迹，废墟|Tourists explore the ___ of the ancient city.|Jungle vines covered the ___ of the temple.|Among the ___, archaeologists found pieces of pottery.|plaza,terrace
  plaza|an open square in a town|广场|Markets were held in the big ___ in front of the temple.|Crowds gathered in the ___ for the festival.|The ___ was paved with flat stones.|terrace,causeway|plazas
  llama|a woolly animal of the Andes used to carry loads|美洲驼|A ___ can carry a load along steep mountain paths.|The Inca used the wool of the ___ for warm clothes.|The ___ spat at the tourist who came too close.|maize,cacao|llamas
  highland|high, hilly or mountainous land|高地|The cold ___ was good for growing potatoes.|Villages dotted the ___ far above the coast.|In the ___, the air is thin and cool.|causeway,terrace|highlands
  `,
);

const heights = batch(
  "words-of-heights-and-depths",
  ["Words of Heights and Depths", "高处与深处的词"],
  ["mountains, valleys and the shape of the land", "山脉、山谷和地形"],
  `
  altitude|how high something is above the sea, especially something in the air|海拔，高度|At high ___, the air has less oxygen.|The plane climbed to a cruising ___ of ten kilometers.|Climbers often get headaches from the high ___.|terrain,foothills
  elevation|the height of a piece of land above the sea|（地面的）海拔|The map shows the ___ of each hill with colored bands.|Snow stays all year above a certain ___ on the mountain.|The town's ___ is 2,400 meters, so water boils there at a lower heat.|gorge,foothills
  peak|the pointed top of a mountain|山峰|Snow covered the ___ of the mountain all year.|The climbers reached the ___ at noon.|From the ___, we could see three valleys below us.|gorge,sinkhole|peaks
  gorge|a deep, narrow valley with steep, rocky sides|峡谷|The river cut a deep ___ through the rock.|A rope bridge crossed the ___.|Far below us, at the bottom of the ___, the water roared.|peak,foothills
  terrain|the land and what it is like|地形|The rocky ___ made the hike slow.|A jeep can drive over rough ___.|The map shows the ___: hills, rivers and forests.|altitude,lowland
  lowland|low, flat land|低地|Rivers flood the ___ every spring.|Rice grows well in the wet ___ near the coast.|They moved down from the mountains to the warm ___.|foothills,peak|lowlands
  steep|rising or falling sharply|陡峭的|The path up the hill was so ___ that we had to use our hands.|A ___ cliff dropped straight down to the sea.|Farmers cut steps into the ___ slope.|rugged,lowland
  rugged|rough and uneven, with many rocks|崎岖的|The ___ coast was full of jagged rocks.|Only goats could cross the ___ hills.|The ___ trail was covered with stones and roots.|steep,terrain
  foothills|low hills at the bottom of a mountain range|山麓小丘|The village sits in the ___ below the high peaks.|We hiked through the green ___ before the real climb began.|Farms covered the gentle ___.|lowland,gorge
  sinkhole|a hole that opens when the ground falls in|天坑，落水洞|A ___ opened in the road and swallowed a car.|Water dissolved the rock below until the ground fell into a ___.|The Maya drew water from a deep ___ filled with water.|gorge,peak|sinkholes
  `,
);

const riseAndFall = batch(
  "words-for-rise-and-fall",
  ["Words for Rise and Fall", "兴衰的词"],
  ["how peoples and cities grow and decline", "民族和城市的兴衰"],
  `
  decline|to become weaker or smaller|衰落，减少|When the rains stopped, the cities began to ___.|Sales of ice cream ___ in winter.|The town's numbers began to ___ after the mine closed.|prosper,endure|declined
  prosper|to do well and grow rich|繁荣|Trade helped the city ___.|Farms ___ when the rain comes on time.|The family's business began to ___.|decline,unite|prospered
  abandon|to leave and not come back|抛弃，离弃|The people had to ___ the city when the wells dried up.|Never ___ a pet.|The crew had to ___ the sinking ship.|isolate,endure|abandoned
  endure|to last for a long time, or to put up with something hard|持久；忍受|Stone buildings can ___ for centuries.|The travelers had to ___ the freezing cold.|Their old stories still ___ today.|abandon,prosper
  population|the number of people who live in a place|人口|The city's ___ grew to two hundred thousand.|A census counts the ___.|As food ran short, the ___ fell.|settlement,rival
  settlement|a place where people have come to live|定居点|The first ___ was just a few huts by the river.|Over the years, the ___ grew into a town.|Explorers found an ancient ___ beside the lake.|population,rival|settlements
  isolate|to keep apart from others|隔离，孤立|Mountains ___ the valley from the rest of the world.|Doctors ___ sick patients so that others do not catch the illness.|The flood will ___ the village for days.|unite,abandon|isolated
  unite|to join together|联合，团结|The leader managed to ___ the tribes into one empire.|The disaster helped ___ the whole town.|The two rivers ___ here and flow on as one.|isolate,decline|united
  rival|someone you compete with|对手|Each city was a ___ of the city next to it.|My ___ won the race by one second.|The team finally beat its old ___.|settlement,population|rivals
  advanced|far ahead in skill or knowledge|先进的|The Maya had ___ knowledge of the stars.|Their ___ roads were better than any in Europe at the time.|She is in the ___ math class.|rival,settlement
  `,
);

const calendars = batch(
  "words-of-calendars-and-counting",
  ["Words of Calendars and Counting", "历法与计数的词"],
  ["calendars, numbers and counting", "历法、数字和计数"],
  `
  calendar|a chart that shows the days, weeks and months of a year|日历，历法|I marked my birthday on the ___.|The Maya ___ had a year of 365 days.|Our school ___ shows every holiday.|almanac,cycle|calendars
  numeral|a symbol that stands for a number|数字符号|The Roman ___ for five is V.|A dot was the Maya ___ for one.|Write each ___ clearly so that nobody misreads it.|tally,interval|numerals
  zero|the number that means none|零|The Maya used a shell to mean ___.|Any number times ___ is nothing.|The temperature dropped below ___ last night.|digit,interval
  digit|one of the ten symbols, 0 to 9, used to write numbers|数位，数字|The number 4 is written with a single ___.|My locker code has one more ___ than yours.|Each ___ of a phone number matters.|tally,almanac|digits
  tally|a count kept with marks|计数，记录|Keep a ___ of how many birds you see.|We made a ___ with a mark for every car that passed.|The final ___ showed twelve votes for the park.|interval,calendar|tallies
  solstice|the longest or the shortest day of the year|至日（夏至、冬至）|The summer ___ is the longest day of the year.|On the winter ___, the sun sets very early.|Crowds watch the sun rise behind the stones on the ___.|equinox,interval
  equinox|a day when day and night are the same length|春分，秋分|On the ___, day and night each last about twelve hours.|The spring ___ comes in March.|At the ___, the sun rises due east.|solstice,cycle
  almanac|a book printed each year with dates, weather and facts|年鉴，历书|The farmer's ___ said when to plant the beans.|Look in the ___ to find when the moon will be full.|Our ___ lists the tides for every day of the year.|calendar,tally
  interval|the time or space between two things|间隔|The ___ between the flash and the thunder tells how far away the storm is.|There was a short ___ between the two acts of the play.|Plant the seeds with an ___ of ten centimeters between them.|cycle,tally|intervals
  cycle|a set of events that happens again and again in the same order|周期，循环|The ___ of the seasons repeats every year.|The moon goes through a ___ of phases every month.|Water moves through a ___ from sea to cloud to rain.|interval,calendar|cycles
  `,
);

const engineering = batch(
  "words-of-building-and-engineering",
  ["Words of Building and Engineering", "建筑与工程的词"],
  ["building and engineering", "建筑和工程"],
  `
  engineer|a person who designs and builds machines, bridges or buildings|工程师|The ___ checked her drawings before the bridge was built.|Each ___ on the team designed a different part of the tower.|The ___ worked out how much weight the beam could hold.|blueprint,girder|engineers
  blueprint|a detailed plan of a building or a machine|蓝图|The builders followed the ___ line by line.|The ___ showed where every door would go.|Before building, the architect drew a ___.|foundation,truss|blueprints
  arch|a curved structure over an opening|拱|The stone ___ over the gate has stood for centuries.|Water flowed under the bridge's single ___.|Each ___ carries its weight down to its sides.|dome,span|arches
  dome|a round roof shaped like half a ball|穹顶|The ___ of the church can be seen from across the city.|Light shone through a hole at the top of the ___.|The huge ___ covered the whole hall without a single column.|arch,truss|domes
  foundation|the solid base a building stands on|地基|Workers poured a deep ___ before building the walls.|A cracked ___ can make a whole house lean.|The tower's ___ goes forty meters down into the ground.|girder,concrete|foundations
  concrete|a hard building material made of cement, sand, stones and water|混凝土|The workers poured wet ___ into the wooden frame.|The sidewalk is made of ___.|Once the ___ dries, it is as hard as rock.|foundation,cable
  girder|a long, strong beam of steel or iron|大梁|A crane lifted a steel ___ to the top of the frame.|Each ___ was bolted to the next.|Workers walked along a narrow ___ high above the street.|cable,truss|girders
  truss|a frame of short beams joined in three-sided shapes|桁架|The roof is held up by a wooden ___ of triangles.|Its triangles make a ___ strong for its weight.|The old railway bridge is a steel ___.|girder,arch
  span|the distance a bridge stretches between its supports|跨度|The bridge has a ___ of one kilometer between its towers.|No bridge of that time had a longer ___.|The main ___ crosses the river in one leap.|arch,cable
  cable|a thick, strong rope made of wire|缆索|Each steel ___ holds up part of the road.|The bridge hangs from a thick ___ between two towers.|The elevator is lifted by a ___.|girder,span|cables
  `,
);

const forces = batch(
  "words-of-forces-on-structures",
  ["Words of Forces on Structures", "结构受力的词"],
  ["the forces that push and pull on buildings and bridges", "推拉建筑和桥梁的力"],
  `
  tension|a pulling force that stretches something|拉力|The cables are under ___ because the road hangs from them.|A rope in a tug of war is under ___.|Too much ___ will snap the wire.|compression,load
  compression|a pushing force that squeezes something|压力|The columns are under ___ from the heavy roof.|Stone is strong under ___ but weak when it is pulled.|Squeezing a sponge puts it under ___.|tension,brace
  load|the weight that a structure must carry|荷载|The bridge can carry a ___ of a hundred trucks.|Snow on the roof added to its ___.|Each beam shares part of the ___.|tension,sway|loads
  stable|steady and not likely to fall|稳定的|A wide base makes a tower more ___.|The ladder was ___ on the flat floor.|Triangles keep the frame ___.|flexible,sway
  brace|a support that holds something steady|支撑物|A wooden ___ kept the wall from falling while the glue dried.|Workers added a ___ that ran from corner to corner of the frame.|The fence leaned until we nailed a ___ to it.|load,reinforce|braces
  reinforce|to make stronger by adding support|加固|Steel rods ___ the concrete.|We had to ___ the shelf before putting books on it.|Builders ___ old bridges so that they can carry modern trucks.|withstand,sway|reinforced
  withstand|to stand up against something without breaking|承受|The building was designed to ___ earthquakes.|Can the tent ___ strong winds?|These walls can ___ a flood.|reinforce,sway
  sway|to swing gently from side to side|摇摆|Tall towers ___ a little in strong wind.|The rope bridge began to ___ as we crossed it.|Trees ___ in the breeze.|brace,withstand|swayed
  flexible|able to bend without breaking|柔韧的，灵活的|A ___ tower bends in the wind instead of cracking.|The ruler is made of ___ plastic.|Bamboo is ___ but strong.|rigid,stable
  rigid|stiff and not able to bend|刚性的，僵硬的|A ___ frame does not bend at all.|The steel beam is completely ___.|Dry spaghetti is ___ and snaps when you bend it.|flexible,stable
  `,
);

const planning = batch(
  "words-for-planning-and-solving",
  ["Words for Planning and Solving", "规划与解决问题的词"],
  ["planning a design and solving problems", "规划设计和解决问题"],
  `
  criteria|the standards a design must meet|标准|The ___ said that the bridge must hold ten kilograms.|Our design met all the ___ except the one about cost.|Before you build, list the ___ for success.|constraint,goal
  constraint|a limit you must work within|限制条件|Our ___ was that we could use only twenty straws.|Time was the biggest ___, because we had only one hour.|Money is a ___ on most projects.|criteria,option|constraints
  revise|to change something to make it better|修改|After the test, we had to ___ our design.|Writers ___ their drafts many times.|Please ___ your plan and try again.|approach,goal|revised
  alternative|another choice instead of the first one|替代方案|If the bridge is closed, take the ___ route.|Glue did not work, so we tried tape as the ___.|The farmers needed an ___ to the dry well, so they dug a new one.|approach,strategy|alternatives
  option|one of the things you can choose|选项|One ___ is to build the tower out of paper.|Each ___ had good and bad points.|Walking is the cheapest ___.|goal,constraint|options
  approach|a way of dealing with a problem|方法|Our first ___ failed, so we tried a new one.|Her ___ was to test small models first.|A careful ___ saves time in the end.|goal,criteria
  strategy|a plan for reaching a goal|策略|Our ___ was to build the base first and test it.|The team used a clever ___ to win.|A good ___ for spelling a long word is to break it into parts.|option,constraint|strategies
  modify|to change a part of something|修改，改动|We had to ___ the wheels so that the car rolled straight.|You can ___ the recipe by adding less sugar.|Engineers ___ the plane's wings to make it faster.|durable,option|modified
  durable|lasting a long time without wearing out|耐用的|Steel is more ___ than wood.|These ___ boots last for years.|The bridge must be ___ enough to last a century.|alternative,option
  goal|what you want to reach or do|目标|Our ___ was to build the tallest tower.|The ___ of the project is to clean the river.|She reached her ___ of reading fifty books.|criteria,strategy|goals
  `,
);

const cities = batch(
  "words-of-cities",
  ["Words of Cities", "城市的词"],
  ["cities and the land around them", "城市及其周边"],
  `
  skyscraper|a very tall building|摩天大楼|The ___ has more than a hundred floors.|From the top of the ___, the cars looked like ants.|A crane stood on the roof of the half-built ___.|tunnel,district|skyscrapers
  suburb|an area of homes at the edge of a city|郊区|We live in a quiet ___ outside the city.|Every morning, trains carry workers from the ___ into the city.|The new ___ has houses with gardens.|district,rural|suburbs
  urban|of a city|城市的|Crowded ___ areas have many apartments.|Noise is a problem in ___ life.|Many ___ schools have no big fields.|rural,pedestrian
  rural|of the countryside|乡村的|In ___ areas, houses are far apart.|My grandparents live on a ___ farm.|The bus runs only twice a day in this ___ area.|urban,suburb
  skyline|the outline of buildings against the sky|天际线|The city's ___ glowed at sunset.|A new tower changed the ___.|From the boat we could see the whole ___.|skyscraper,intersection
  district|an area of a city with something special about it|区|The theater ___ is full of bright lights.|Banks fill the business ___.|Our school is in the northern ___.|suburb,traffic|districts
  pedestrian|a person who is walking|行人|A ___ must wait for the green light to cross.|The bridge has a lane for each ___ and one for bikes.|The car stopped to let a ___ cross.|traffic,skyline|pedestrians
  tunnel|a passage under the ground or under water|隧道|The train went into a ___ under the river.|Workers dug a ___ through the mountain.|Cars drive through the ___ with their lights on.|intersection,skyscraper|tunnels
  traffic|cars and other vehicles moving on roads|交通，车流|Rush-hour ___ was so heavy that we were late.|Police directed ___ around the accident.|There is less ___ on Sundays.|pedestrian,district
  intersection|a place where roads cross|十字路口|Turn left at the next ___.|Traffic lights control the busy ___.|Two cars crashed at the ___.|tunnel,district|intersections
  `,
);

const detectives = batch(
  "words-of-mysteries-and-detectives",
  ["Words of Mysteries and Detectives", "推理与侦探的词"],
  ["mysteries and detectives", "推理故事和侦探"],
  `
  detective|a person whose job is to solve crimes|侦探|The ___ looked for footprints by the window.|A famous ___ solved the case in a single day.|The ___ asked everyone where they had been at midnight.|witness,culprit|detectives
  suspect|a person who is thought to have done a crime|嫌疑人|Each ___ claimed to be innocent, so the detective had three people to check.|The police let the ___ go when they learned he had been at home.|The main ___ was seen near the shop just before the theft.|witness,culprit|suspects
  witness|a person who saw something happen|目击者|A ___ saw a man run out of the bakery.|The ___ told the judge what she had seen.|Was there any ___ to the accident?|suspect,detective|witnesses
  alibi|proof that you were somewhere else when a crime happened|不在场证明|His ___ was that he had been at the cinema all evening.|The ticket stub proved her ___.|The suspect had no ___ for the hour of the theft.|motive,clue
  clue|a sign that helps to solve a mystery|线索|A muddy boot print was the first ___.|The detective found a ___ under the table.|Each ___ led closer to the answer.|alibi,fingerprint|clues
  motive|the reason someone does something|动机|Jealousy was the thief's ___.|What ___ could anyone have for stealing a cake?|The detective searched for a ___.|alibi,clue|motives
  culprit|the person who did something wrong|罪魁祸首，犯人|The ___ turned out to be the cat.|We never found the ___ who broke the window.|In the end, the ___ confessed.|suspect,witness
  fingerprint|the mark a fingertip leaves on something|指纹|The thief left a ___ on the glass.|Dusting powder made the ___ show up.|No two people have the same ___.|clue,alibi|fingerprints
  deduce|to work out from clues|推断|From the mud on his shoes, she could ___ that he had been in the garden.|Can you ___ who took the cookies?|Detectives ___ answers from small details.|accuse,witness|deduced
  accuse|to say that someone did something wrong|指控，指责|Do not ___ him without proof.|The shopkeeper began to ___ the boy of stealing.|It is unfair to ___ someone just because they were nearby.|deduce,suspect|accused
  `,
);

const suspense = batch(
  "words-for-suspense-and-puzzles",
  ["Words for Suspense and Puzzles", "悬念与谜团的词"],
  ["suspense, puzzles and strange events", "悬念、谜团和怪事"],
  `
  suspicious|thinking that something is wrong, or making people think so|可疑的；起疑心的|The guard grew ___ when the man kept looking at the safe.|A ___ package sat alone on the platform.|Her ___ glance made him nervous.|peculiar,uneasy
  puzzling|hard to understand|令人费解的|The missing key was ___, because the door was still locked.|It was ___ that the dog did not bark.|The instructions were so ___ that nobody could follow them.|baffled,eerie
  baffled|completely confused|困惑的|The detective was ___ by the empty room.|We were ___ by the strange noise in the attic.|Even the teacher looked ___ by the question.|puzzling,startled
  mysterious|strange and hard to explain|神秘的|A ___ stranger arrived in town.|The ___ letter had no name on it.|Lights appeared in the ___ house at night.|baffled,uneasy
  eerie|strange and frightening|怪异吓人的|The empty house was ___ at night.|The fog made the old graveyard look ___.|The wind made ___ whistling sounds in the chimney.|peculiar,startled
  peculiar|strange or unusual|古怪的|There was a ___ smell in the kitchen.|He had a ___ habit of whistling backward.|It is ___ that the clock stopped at midnight.|suspicious,baffled
  uneasy|worried and not comfortable|不安的|She felt ___ walking home alone in the dark.|The long silence made everyone ___.|The horses grew ___ before the storm.|startled,sinister
  startled|suddenly surprised or frightened|受惊的|The ___ deer ran into the woods.|I was ___ by the loud bang.|The ___ cat jumped onto the shelf.|uneasy,baffled
  conceal|to hide|隐藏|The thief tried to ___ the jewels in a flowerpot.|She could not ___ her smile.|A rug was used to ___ the trapdoor.|sinister,puzzling|concealed
  sinister|seeming evil or dangerous|阴险的，不祥的|The villain gave a ___ smile.|A ___ shadow moved behind the curtain.|The ___ note threatened the shopkeeper.|mysterious,peculiar
  `,
);

const reasoning = batch(
  "words-for-reasoning",
  ["Words for Reasoning", "推理的词"],
  ["thinking through clues and claims", "推敲线索和说法"],
  `
  doubt|a feeling of not being sure|怀疑|I have no ___ that she will win.|There is some ___ about whether his story is true.|The new clue raised a ___ in the detective's mind.|claim,possibility|doubts
  certain|completely sure|确定的|I am ___ that I locked the door.|Are you ___ that this is the right answer?|Nothing is ___ until we test it.|likely,obvious
  likely|probably going to happen or be true|很可能的|It is ___ to rain this afternoon.|The ___ answer is that the wind blew the door shut.|He is ___ to be late again.|certain,obvious
  contradict|to say the opposite of|与……矛盾|Her two stories ___ each other.|The facts ___ his claim.|Do not ___ your teacher rudely.|deny,admit|contradicts
  consider|to think carefully about|考虑|Please ___ all the facts before you decide.|We will ___ your idea at the next meeting.|The jury had to ___ every clue.|claim,deny
  claim|to say that something is true, without proof|声称|Many people ___ to have seen the ghost.|Did he ___ that he was home all night?|They ___ that the dog ate their homework.|admit,consider|claimed
  deny|to say that something is not true|否认|The boy will ___ that he broke the vase.|She did not ___ eating the last cookie.|Do not ___ it; we saw you.|admit,contradict|denied
  admit|to say that something is true, often unwillingly|承认|He had to ___ that he was wrong.|She will ___ she took the pen when she sees the photo.|I ___ the test was harder than I expected.|deny,claim|admitted
  obvious|easy to see or understand|明显的|The answer was ___ once we saw the muddy prints.|It was ___ that he was tired.|The mistake was so ___ that everyone saw it.|likely,certain
  possibility|something that might happen or be true|可能性|There is a ___ of snow tonight.|One ___ is that the cat knocked it over.|We cannot rule out any ___ yet.|doubt,claim
  `,
);

const wilderness = batch(
  "words-of-wilderness-survival",
  ["Words of Wilderness Survival", "野外求生的词"],
  ["staying alive in the wild", "在野外求生"],
  `
  wilderness|wild land where no people live|荒野|They hiked for days in the ___ without seeing a road.|Bears and wolves roam the ___.|The ___ stretched for miles in every direction.|trek,raft
  stranded|stuck in a place without a way to leave|被困的|The storm left the hikers ___ on the mountain.|A ___ whale lay on the beach.|With no fuel, we were ___ on the empty road.|trek,blister
  ration|a fixed amount of food or water given to each person|定量配给|Each sailor got a small ___ of water a day.|We had to make our ___ of bread last three days.|The daily ___ was one apple and a cup of rice.|canteen,kindling|rations
  flint|a hard stone that makes sparks when it is struck|燧石|Strike the ___ with steel to make sparks.|Early people chipped ___ into sharp knives.|A spark from the ___ fell on the dry grass.|kindling,raft
  kindling|small, dry sticks for starting a fire|引火柴|Gather dry ___ before you light the fire.|The ___ caught fire first, and then the logs.|Wet ___ will not burn.|flint,ration
  canteen|a bottle for carrying water on a trip|水壶|Fill your ___ at the stream.|The hiker's ___ was empty by noon.|A metal ___ hung from his belt.|ration,raft
  raft|a flat boat made of logs tied together|木筏|They tied logs together to build a ___.|The ___ floated slowly down the river.|We paddled the ___ to the island.|canteen,trek|rafts
  blister|a bubble of skin filled with liquid, often from rubbing|水泡|My new boots gave me a ___ on my heel.|A ___ formed where the oar rubbed her hand.|Cover the ___ so it does not pop.|kindling,flint|blisters
  dehydrate|to lose too much water from the body|脱水|In the desert, you can ___ quickly if you do not drink.|Hikers who sweat a lot can ___ on a hot day.|Drink water often so that you do not ___.|trek,stranded|dehydrated
  trek|a long, hard walk|艰苦跋涉|The ___ through the mountains took five days.|After a long ___, we reached the camp.|Their ___ across the ice was slow and cold.|raft,wilderness
  `,
);

const ships = batch(
  "words-of-ships-and-the-sea",
  ["Words of Ships and the Sea", "船与大海的词"],
  ["ships and sailing", "船只和航海"],
  `
  shipwreck|the wreck of a ship, or the sinking of one|沉船，海难|Divers explored the old ___ on the seabed.|Only three sailors lived through the ___.|The ___ happened on the rocks near the lighthouse.|castaway,lifeboat
  castaway|a person left alone on an island after a shipwreck|漂流者|The ___ lived on coconuts for a year.|A passing ship rescued the ___.|The ___ wrote SOS in the sand with a stick.|shipwreck,deck|castaways
  lifeboat|a small boat carried on a ship to save people|救生艇|The passengers climbed into the ___.|The ___ rocked on the huge waves.|Each ___ held twenty people.|hull,anchor|lifeboats
  mast|the tall pole that holds a ship's sails|桅杆|The sail hung from the tall ___.|A sailor climbed the ___ to look out.|The storm snapped the ___ in two.|oar,rigging
  anchor|a heavy hook dropped to hold a ship in place|锚|Drop the ___ so that the boat does not drift.|The ___ caught on the rocks of the seabed.|They pulled up the ___ and sailed away.|mast,oar
  deck|the floor of a ship|甲板|Waves washed over the ___.|The sailors scrubbed the ___ every morning.|Passengers stood on the ___ to watch the dolphins.|hull,starboard
  hull|the main body of a ship|船体|The rocks tore a hole in the ___.|Barnacles grew on the ship's ___ below the water.|Water leaked into the ___ through a crack.|deck,mast
  oar|a long pole with a flat end for rowing|桨|He pulled hard on the ___.|One ___ slipped from his hand and floated away.|The ___ splashed in the water as they rowed.|mast,anchor|oars
  rigging|the ropes that hold up and move a ship's sails|索具|Sailors climbed the ___ to fix the sail.|The wind whistled through the ___.|Tangled ___ hung from the broken mast.|anchor,hull
  starboard|the right side of a ship as you face forward|右舷|Turn the ship to ___.|A whale came up on the ___ side.|The lighthouse was off the ___ side of the boat.|deck,hull
  `,
);

const courage = batch(
  "words-for-courage-and-fear",
  ["Words for Courage and Fear", "勇气与恐惧的词"],
  ["courage and fear", "勇气和恐惧"],
  `
  courage|being brave when you are afraid|勇气|It took ___ to jump into the cold water.|She found the ___ to speak up.|The firefighters showed great ___.|dread,despair
  dread|a strong fear of something to come|恐惧|He felt ___ as the test drew near.|The sound of the wolves filled her with ___.|They waited in ___ for the storm.|despair,courage
  desperate|in a very bad situation and willing to try anything|绝望的，拼命的|The ___ sailors drank rainwater from the sails.|She made a ___ leap to the bank.|Without food, they grew ___.|bold,cower
  bold|brave and daring|大胆的|A ___ explorer set out across the sea.|It was a ___ plan, but it worked.|The ___ girl stood up to the bully.|desperate,grit
  despair|the feeling that there is no hope|绝望|After days lost at sea, they fell into ___.|She cried in ___.|Do not give in to ___; help is coming.|dread,courage
  hesitate|to stop for a moment because you are unsure|犹豫|Do not ___ to call if you need help.|He began to ___ at the edge of the diving board.|She did not ___; she jumped right in.|tremble,persist|hesitated
  tremble|to shake from fear, cold or excitement|颤抖|My hands began to ___ in the cold.|The puppy would ___ during thunderstorms.|Her voice started to ___ as she spoke.|cower,hesitate|trembled,trembling
  persist|to keep going even when it is hard|坚持|If you ___, you will learn to swim.|The climbers chose to ___ despite the wind.|Scientists ___ until they find an answer.|hesitate,tremble
  grit|courage and the will to keep going|毅力|It took ___ to finish the race with a sore ankle.|Her ___ kept her climbing when others turned back.|With ___ and hard work, they rebuilt the farm.|dread,despair
  cower|to crouch down in fear|畏缩|The dog would ___ under the table during storms.|Do not ___; stand up straight.|The mice ___ in the corner when the cat comes in.|tremble,persist
  `,
);

const choices = batch(
  "words-for-choices-and-consequences",
  ["Words for Choices and Consequences", "选择与后果的词"],
  ["choices and their consequences", "选择及其后果"],
  `
  consequence|a result of something you do|后果|One ___ of skipping breakfast is feeling tired.|He had to face the ___ of breaking the rule.|Every choice has a ___.|decision,dilemma|consequences
  decision|a choice you make|决定|Turning back was a hard ___.|The judge's ___ was final.|We must make a ___ by Friday.|consequence,judgment|decisions
  reckless|careless about danger|鲁莽的|Climbing in a storm was a ___ thing to do.|The ___ driver sped through the red light.|It was ___ to swim beyond the flags.|urgent,crucial
  regret|to feel sorry about something you did|后悔|I ___ not bringing a coat.|You will ___ it if you quit now.|He began to ___ his choice.|sacrifice,gamble|regretted
  sacrifice|to give up something for the sake of something else|牺牲|She had to ___ her free time to train.|Parents often ___ a lot for their children.|He chose to ___ his own food so the others could eat.|regret,gamble
  dilemma|a hard choice between two things|两难|Her ___ was whether to save the map or the food.|Facing a ___, he could not decide.|It is a ___: stay and wait, or leave and search.|consequence,decision
  judgment|the ability to make good decisions|判断力|Use good ___ when you choose a path.|The captain trusted her ___.|Being very tired can cloud your ___.|decision,consequence
  urgent|needing to be done right away|紧急的|The message was ___: come at once.|Getting out of the rising water was ___.|The doctor said the operation was ___.|reckless,crucial
  crucial|extremely important|关键的|Water is ___ for survival.|The next step is ___, so pay attention.|The goal in the last minute was ___ to the win.|urgent,reckless
  gamble|to take a risk in the hope of a good result|冒险，赌|They decided to ___ on the short path, though it was dangerous.|Do not ___ with your safety.|The farmers ___ that the rain will come.|sacrifice,regret
  `,
);

const letters = batch(
  "words-of-letters-and-diaries",
  ["Words of Letters and Diaries", "书信与日记的词"],
  ["letters and diaries", "书信和日记"],
  `
  correspondence|letters sent between people|通信，信件|The two friends kept up their ___ for fifty years.|Her ___ with the scientist filled three boxes.|The museum shows the ___ between the soldier and his family.|memoir,stationery
  envelope|a paper cover for a letter|信封|Write the address on the front of the ___.|She tore open the ___ and pulled out the letter.|The ___ had a stamp in the corner.|postmark,parchment|envelopes
  postmark|a mark stamped on a letter to show where and when it was mailed|邮戳|The ___ showed that the letter was mailed in 1923.|Look at the ___ to see what town it came from.|The ___ was smudged, so we could not read the date.|envelope,telegram
  recipient|the person who receives something|收件人，接受者|The ___ of the letter lived in another country.|Each ___ of the award gave a short speech.|The letter never reached its ___.|correspondence,entry
  entry|one part of a diary, written at one time|（日记的）一篇|Each ___ in her diary begins with the date.|His last ___ was written the night before the storm.|In one ___, she describes her first day at school.|memoir,postmark|entries
  memoir|a book a person writes about their own life|回忆录|The old sailor wrote a ___ about his years at sea.|In her ___, the actress describes growing up poor.|The general's ___ came out after the war.|entry,correspondence
  quill|a pen made from a feather|羽毛笔|He dipped his ___ into the ink.|The ___ scratched across the paper.|Writers sharpened the tip of the ___ with a knife.|parchment,telegram
  parchment|a writing material made from animal skin|羊皮纸|The old map was drawn on ___.|The ___ had turned yellow with age.|Monks copied books by hand on ___.|stationery,envelope
  telegram|a short message sent by wire and delivered on paper|电报|A ___ arrived with the news: COMING HOME STOP.|Sending a ___ cost money for every word.|A boy on a bicycle delivered the ___.|postmark,quill|telegrams
  stationery|paper and envelopes for writing letters|信纸信封，文具|She wrote on pink ___ with her name at the top.|The hotel gave its guests ___ for their letters.|He bought a box of ___ to write thank-you notes.|parchment,correspondence
  `,
);

const longAgo = batch(
  "words-of-life-long-ago",
  ["Words of Life Long Ago", "旧时生活的词"],
  ["everyday life long ago", "旧时的日常生活"],
  `
  lantern|a light in a case with a handle|提灯|She carried a ___ to the barn at night.|The ___ flickered in the wind.|Before electricity, a ___ lit the way home.|hearth,slate|lanterns
  hearth|the floor of a fireplace|炉床，壁炉|The family gathered around the ___ to keep warm.|A pot of soup bubbled over the ___.|Ashes from the ___ were swept out each morning.|lantern,homestead
  chore|a small job done regularly at home|家务活|Feeding the chickens was her first ___ of the day.|Every child had a ___ to finish before school.|Washing dishes is my least favorite ___.|textile,slate|chores
  homestead|a house and the farm land around it where a family lives|宅地，家园|The family built a ___ on the prairie.|The ___ had a log cabin and a barn.|They farmed the ___ for forty years.|hearth,textile
  churn|to stir cream hard to make butter|搅（制黄油）|It took an hour to ___ the cream into butter.|Grandma taught me how to ___ butter.|The children took turns to ___ the cream.|chore,slate|churned
  textile|cloth made by weaving or knitting|纺织品|The ___ mill made cotton cloth.|Wool was the most common ___ on the farm.|The museum shows a ___ woven two hundred years ago.|slate,lantern|textiles
  blacksmith|a person who makes things from iron by heating and hammering it|铁匠|The ___ shaped a horseshoe on his anvil.|Sparks flew as the ___ hammered the hot iron.|Every village needed a ___ to fix its tools.|cobbler,peddler
  cobbler|a person who makes and mends shoes|鞋匠|The ___ put new soles on my boots.|The ___ stitched the leather by hand.|Take your torn shoes to the ___.|blacksmith,peddler
  peddler|a person who travels from place to place selling things|小贩，货郎|A ___ came to the farm with pots and ribbons.|The ___ sold needles and thread from his cart.|Children ran to see what the ___ had brought.|cobbler,blacksmith
  slate|a small board of dark stone that pupils wrote on with chalk|石板|Pupils wrote their sums on a ___.|She wiped her ___ clean with a cloth.|Paper cost too much, so each child had a ___.|textile,lantern
  `,
);

const memory = batch(
  "words-for-memory-and-history",
  ["Words for Memory and History", "记忆与历史的词"],
  ["remembering the past", "铭记过去"],
  `
  recall|to remember|回忆|Can you ___ the name of your first teacher?|My grandfather can ___ the day the war ended.|I cannot ___ where I put my keys.|preserve,commemorate
  historic|important in history|有历史意义的|The first moon landing was a ___ event.|The ___ house is now a museum.|It was a ___ day when the bridge opened.|bygone,heritage
  heritage|the traditions and history passed down from earlier generations|传统，遗产|Music is part of our family's ___.|The festival celebrates the town's ___.|Learning the old language keeps the ___ alive.|testimony,descendant
  descendant|a person born later in a family, such as a grandchild|后代|She is a ___ of the town's first settlers.|Every ___ of the old farmer still lives nearby.|A ___ of the king still lives in the castle.|heritage,anniversary|descendants
  preserve|to keep safe from harm or change|保存，保护|The museum works to ___ old letters.|Long ago, people used salt to ___ meat.|We must ___ the forest for the future.|recall,commemorate|preserved
  document|an official paper that gives information|文件|The ___ proved that the family owned the land.|This ___ is signed by the mayor.|Keep each important ___ in a safe place.|testimony,heritage|documents
  anniversary|the date on which something happened in an earlier year|周年纪念日|Today is the hundredth ___ of the school's founding.|My parents celebrated their wedding ___.|The town held a parade on the ___ of the flood.|heritage,testimony
  testimony|what a witness says happened|证词|The old woman's ___ told what she saw that day.|In court, his ___ helped the judge decide.|The ___ of the survivors was written down.|document,anniversary
  commemorate|to do something special to remember an event or a person|纪念|A statue was built to ___ the brave firefighters.|The town rings its bells each year to ___ the end of the war.|We planted a tree to ___ our old teacher.|recall,preserve
  bygone|from a time long past|过去的，往昔的|The old photos show a ___ age of horses and carts.|In ___ days, people washed clothes by hand.|The museum brings ___ times to life.|historic,heritage
  `,
);

const longing = batch(
  "words-for-longing-and-affection",
  ["Words for Longing and Affection", "思念与情感的词"],
  ["longing, love and loss", "思念、爱和失去"],
  `
  homesick|sad because you are away from home|想家的|On her first night at camp, she felt ___.|The sailor was ___ for his village.|Letters from home made him a little less ___.|fond,sincere
  longing|a strong wish for something you do not have|渴望|He felt a deep ___ for the sea.|Her letters were full of ___ for home.|A ___ to see her brother kept her awake.|grief,affection
  cherish|to love and care for deeply|珍爱|I ___ the letters my grandmother wrote me.|We ___ our memories of that summer.|She will ___ the gift forever.|yearn,reunite
  fond|having a warm liking for someone or something|喜爱的|I am still ___ of my old teddy bear.|She has ___ memories of her grandfather's farm.|He grew ___ of the little town.|sincere,homesick
  sincere|honest and truly meant|真诚的|Please accept my ___ thanks.|His apology was ___, and she forgave him.|She gave a warm and ___ smile.|fond,homesick
  affection|a feeling of love or liking|喜爱，感情|The dog showed its ___ by licking my face.|She hugged her brother with great ___.|Their ___ for each other grew over the years.|longing,grief
  reunite|to bring or come together again after a time apart|重聚|When the war ended, families began to ___.|The letter helped ___ two sisters after forty years.|We hope to ___ with our cousins next summer.|cherish,yearn|reunited
  farewell|a goodbye|告别|They waved ___ as the ship sailed away.|The class held a ___ party for the teacher.|Her ___ letter made us cry.|grief,longing
  yearn|to want something very much, often something far away|渴望，思念|Sailors ___ for home on long voyages.|She began to ___ for the mountains of her childhood.|Prisoners ___ for freedom.|cherish,reunite
  grief|deep sadness, especially after a death|悲痛|The town was filled with ___ after the flood.|She wrote about her ___ when her dog died.|In time, his ___ turned into happy memories.|affection,farewell
  `,
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
