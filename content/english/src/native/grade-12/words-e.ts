// Grade 12: the batches of words of rule and money, of elections, and of the senses: the style of prose, sound, light,
// movement and texture.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const rule = batch(
  "words-of-crowns-and-colonies",
  ["Words of Crowns and Colonies", "王权与殖民地的词"],
  ["kinds of rule and their overthrow", "统治形式及其推翻"],
  `
  coup|a sudden, often violent, seizure of power by a small group|政变|The army staged a ___ and arrested the president.|The ___ failed within a day.|After the ___, tanks filled the streets.|junta,regicide|coups
  junta|a military group that rules a country after taking power by force|军政府|The ___ banned all newspapers.|A ___ of three generals ran the country.|The ___ promised elections but never held them.|coup,theocracy|juntas
  monarchy|a country ruled by a king or queen, or that system of rule|君主制，君主国|Britain is a constitutional ___.|The ___ was abolished in 1946.|Some people want to bring back the ___.|theocracy,fiefdom|monarchies
  theocracy|a country ruled by religious leaders|神权政治，神权国家|The city became a ___ under the priests.|In a ___, religious law is the law of the land.|The rebels wanted to build a ___.|monarchy,junta|theocratic
  regicide|the killing of a king or queen|弑君|The play is about a ___ and its bloody results.|He was tried for ___ after the revolution.|___ was the worst crime in the old kingdom.|coup,serfdom|
  vassal|a person or country that owes loyalty and service to a more powerful one|诸侯，附庸|The ___ swore loyalty to his lord.|The small state became a ___ of its neighbor.|Each ___ sent soldiers in time of war.|serfdom,fiefdom|vassals
  fiefdom|land held by a lord in return for service; an area someone controls as if it were their own|封地；势力范围|The duke ruled his ___ like a king.|The department became the manager's private ___.|The ___ passed from father to son.|vassal,monarchy|fiefdoms
  serfdom|the state of being a serf, a farm worker bound to a lord's land|农奴制|Russia ended ___ in 1861.|___ tied families to the land for centuries.|The novel shows the misery of ___.|vassal,regicide|
  colonial|having to do with a colony or with colonialism|殖民的，殖民地的|The ___ government taxed the farmers heavily.|The town has fine ___ houses.|Many ___ borders cut through tribal lands.|imperialism,vassal|
  imperialism|the policy of extending a country's power by taking control of other countries|帝国主义|The book criticizes European ___ in Africa.|___ led to wars over colonies.|He saw the trade deal as economic ___.|monarchy,serfdom|imperialist
  `,
);

const money = batch(
  "words-of-debt-and-credit",
  ["Words of Debt and Credit", "债务与信贷的词"],
  ["borrowing, owing and accounts", "借贷、欠债与账目"],
  `
  asset|something of value that a person or company owns; a useful quality|资产；有利条件|The house is the family's biggest ___.|Her calm is a great ___ in a crisis.|The company sold every ___ to pay its debts.|liability,collateral|assets
  liability|money owed; legal responsibility; a person or thing that causes problems|负债；责任；累赘|The firm's debts and every other ___ grew faster than its income.|The owner denied any ___ for the accident.|The old car became a ___.|asset,debtor|liabilities
  collateral|property promised to a lender as security for a loan|抵押品|She used her house as ___ for the loan.|Without ___, the bank refused him.|The ship served as ___.|mortgage,asset|
  mortgage|a loan to buy a house, with the house as security|抵押贷款|They took out a ___ to buy the flat.|The ___ will be paid off in twenty years.|Rising rates made every ___ more costly.|collateral,deflation|mortgages,mortgaged
  deflation|a general fall in prices|通货紧缩|___ can make people delay buying.|Japan suffered years of ___.|The bank feared ___ more than inflation.|mortgage,audit|deflationary
  bankrupt|unable to pay one's debts|破产的|The airline went ___ last year.|The ___ farmer sold his land.|The scandal left him morally ___.|arrears,audit|bankruptcy
  arrears|money that is owed and should already have been paid|欠款，拖欠|The tenant was three months in ___ with the rent.|The council chased families in ___.|He paid off his ___ at last.|bankrupt,liability|
  audit|an official check of the financial accounts of a company or person|审计，查账|The ___ found missing money.|Every year the charity has an ___.|The tax office ordered an ___ of his accounts.|deflation,mortgage|audited,auditor
  creditor|a person or company to whom money is owed|债权人|The ___ demanded payment within a week.|The company owed money to every ___.|Each ___ received half of what was owed.|debtor,asset|creditors
  debtor|a person or country that owes money|债务人|The ___ could not pay on time.|The country became a ___ after the war.|Old laws sent every ___ to prison.|creditor,liability|debtors
  `,
);

const elections = batch(
  "words-of-elections-and-office",
  ["Words of Elections and Office", "选举与公职的词"],
  ["winning votes and holding office", "赢得选票和担任公职"],
  `
  municipal|having to do with a town or city and its government|市政的|___ elections are held every four years.|The ___ library is free to all.|___ workers cleared the snow.|constituency,bureaucracy|
  bureaucracy|a system of government with many officials and complicated rules|官僚机构，官僚作风|___ slowed the building of the bridge.|She cut through the ___ in a week.|The ___ employs ten thousand clerks.|constituency,quorum|bureaucracies,bureaucrat,bureaucratic
  constituency|the voters of an area who elect a representative; the area itself|选区，选民|He won the ___ by two hundred votes.|Farmers are her main ___.|Each ___ sends one member to parliament.|municipal,incumbency|constituencies
  lobby|to try to persuade lawmakers to support a cause; a group that does this|游说；游说团体|Teachers came to ___ for smaller classes.|The oil ___ is very powerful.|They hired a firm to ___ the senate.|canvass,gerrymander|lobbied,lobbying
  gerrymander|to draw the borders of voting areas unfairly to help one party|不公正地划分选区|The ruling party tried to ___ the city.|Courts struck down the plan to ___ the state.|Computers make it easy to ___ districts.|lobby,canvass|gerrymandered,gerrymandering
  plebiscite|a direct vote by all the people on an important question|全民公投|A ___ decided the future of the region.|The ___ was held under UN watch.|The king called a ___ on the new constitution.|quorum,hustings|plebiscites
  quorum|the smallest number of members who must be present for a meeting to make decisions|法定人数|Without a ___, the vote could not take place.|We reached a ___ at the last minute.|The rules set the ___ at twelve.|plebiscite,constituency|
  incumbency|the holding of an office, or the period of holding it|在职，任期|Her ___ gave her an advantage in the race.|During his ___, the city grew rich.|Ten years of ___ made him complacent.|constituency,hustings|
  hustings|the campaigning for an election, especially speeches to voters|竞选活动，竞选演说|The candidates were out on the ___ all week.|On the ___, he promised lower taxes.|Life on the ___ is tiring.|incumbency,plebiscite|
  canvass|to visit people to ask for their votes or opinions|游说拉票；调查(意见)|Volunteers will ___ every street.|They ___ voters by telephone.|The team set out to ___ the neighbors.|lobby,gerrymander|canvassed,canvassing
  `,
);

const prose = batch(
  "words-for-the-style-of-prose",
  ["Words for the Style of Prose", "描述文风的词"],
  ["clear and cloudy, plain and showy writing", "清晰与晦涩、朴素与浮华的文字"],
  `
  lucid|clearly expressed and easy to understand|清晰易懂的|Her ___ explanation made the topic simple.|The report is short and ___.|Even sick, he remained ___ to the end.|turgid,stilted|lucidity,lucidly
  limpid|clear and simple in style; completely clear, like water|清澈的；明晰的|The ___ water let us see the stones on the bottom.|We swam in a ___ pool.|Her ___ prose is a joy to read.|turgid,stilted|
  pellucid|extremely clear in meaning or appearance|清晰透彻的|The essay's argument is ___.|___ water ran over the stones.|He had a ___ way of explaining law.|stilted,bombastic|
  turgid|swollen; written in a heavy, complicated style that is hard to read|浮夸的，艰涩的|The ___ report put everyone to sleep.|___ prose hides weak ideas.|The river was ___ after the rain.|lucid,pithy|
  florid|too full of decoration; reddish in color|辞藻华丽的；红润的|The ___ speech was full of long words.|He had a ___ face.|Her early poems were ___ and sentimental.|pithy,austere|
  pithy|short and full of meaning|简练精辟的|She gave a ___ summary of the book.|His ___ remarks were often quoted.|A ___ slogan sold the idea.|turgid,bombastic|pithily
  stilted|stiff and unnatural in style|生硬的，不自然的|The dialogue in the film is ___.|He spoke in ___ English.|Their ___ conversation ended quickly.|pellucid,lucid|
  bombastic|using long and impressive words with little meaning|夸夸其谈的|The ___ speech promised everything and explained nothing.|He was a ___ preacher.|Critics mocked the ___ style of the novel.|pithy,austere|bombast
  grandiloquent|using long or difficult words to impress people|夸张的，浮夸的|The ___ mayor spoke of a golden age.|His letters were ___ and tiresome.|A ___ title hid a simple book.|austere,pithy|grandiloquence
  austere|plain and without decoration; strict|朴素的；严峻的|Her ___ style suits the sad story.|The monks lived in ___ rooms.|An ___ teacher, he rarely smiled.|florid,grandiloquent|
  `,
);

const sound = batch(
  "words-for-sounds-and-voices",
  ["Words for Sounds and Voices", "描述声音和嗓音的词"],
  ["pleasant and unpleasant sounds", "悦耳和刺耳的声音"],
  `
  mellifluous|sweet and smooth to hear|甜美流畅的|Her ___ voice made the news seem gentle.|The radio played ___ music.|He read the poem in ___ tones.|strident,raucous|mellifluously
  euphonious|pleasing to the ear|悦耳的|"Cellar door" is often called a ___ phrase.|The bells made a ___ sound.|The names of the islands are ___.|cacophonous,raucous|
  cacophonous|harsh and unpleasant to hear|刺耳的，不和谐的|The ___ traffic woke us at dawn.|A ___ band played in the square.|The ___ market rang with shouts.|euphonious,dulcet|cacophony
  sonorous|deep, full and loud|洪亮的，响亮的|The ___ bell rang across the valley.|The actor had a deep, rich, ___ voice.|He read the speech in ___ tones.|sibilant,cacophonous|sonority
  strident|loud, harsh and unpleasant; forceful in expressing opinions|刺耳的；强硬的|The ___ alarm woke everyone.|Her ___ critics wanted her to resign.|He spoke in a ___ voice.|mellifluous,dulcet|stridently
  raucous|loud, harsh and disorderly|嘈杂刺耳的|___ laughter came from the bar.|The crows made a ___ noise.|It was a ___ party that lasted till dawn.|dulcet,mellifluous|raucously
  dulcet|sweet and soothing to hear|悦耳的，甜美的|The ___ tones of the harp filled the room.|She answered in her most ___ voice.|The ___ song calmed the baby.|raucous,cacophonous|
  plangent|loud and sad, with a deep ringing sound|悲凉的，回荡的|The ___ bells tolled for the dead.|A ___ guitar ended the film.|Her ___ cry echoed in the hall.|sibilant,raucous|plangency
  stentorian|very loud and powerful|(声音)洪亮的|The sergeant had a ___ voice.|A ___ shout stopped the fight.|He called the names in ___ tones.|dulcet,sibilant|
  sibilant|making or having a hissing sound, like "s" or "sh"|发咝咝声的|The snake made a ___ noise.|"She sells seashells" is full of ___ sounds.|A ___ whisper ran through the crowd.|plangent,stentorian|
  `,
);

const light = batch(
  "words-of-light-and-color",
  ["Words of Light and Color", "光与色的词"],
  ["the look of light and of faces", "光线与面色的样子"],
  `
  incandescent|glowing with heat; full of strong emotion|白炽的；热情洋溢的|___ bulbs waste most of their energy as heat.|She gave an ___ performance.|He was ___ with rage.|iridescent,phosphorescent|incandescence
  iridescent|showing bright colors that seem to change in different light|彩虹色的，闪光的|The ___ wings of the beetle shone green and blue.|Soap bubbles are ___.|The ___ shell glowed in her hand.|lurid,wan|iridescence
  opalescent|showing changing milky colors like an opal|乳白光的|The ___ glass of the lamp softened the light.|An ___ mist hung over the lake.|The pearl had an ___ gleam.|ruddy,sallow|
  phosphorescent|giving off a faint light without heat, as some sea creatures do|磷光的|___ waves glowed on the beach at night.|The watch has ___ hands.|Tiny ___ animals lit up the water.|incandescent,burnished|phosphorescence
  lustrous|shining softly|有光泽的|She had ___ black hair.|The ___ silk caught the light.|The horse's coat was ___ after brushing.|burnished,wan|
  burnished|polished until shiny|擦亮的，光亮的|___ copper pots hung on the wall.|The ___ gold of the sunset filled the sky.|The table was ___ with age.|sallow,wan|burnish
  lurid|unpleasantly bright in color; shocking and sensational|刺眼的；耸人听闻的|The ___ green walls gave me a headache.|The paper printed ___ details of the crime.|A ___ glow lit the sky above the fire.|iridescent,ruddy|luridly
  wan|pale and looking tired or ill|苍白的，憔悴的|She gave a ___ smile from her hospital bed.|His face was ___ after the long night.|A ___ light came through the dirty window.|ruddy,lustrous|wanly
  sallow|having an unhealthy yellowish color|(脸色)蜡黄的|His ___ skin showed months without sun.|The ___ clerk coughed behind his desk.|She looked ___ and thin.|ruddy,lustrous|
  ruddy|having a healthy red color|红润的|The farmer had a ___ face.|Their ___ cheeks glowed in the cold.|A ___ sky promised good weather.|sallow,wan|
  `,
);

const movement = batch(
  "words-of-walking-and-moving",
  ["Words of Walking and Moving", "行走与移动的词"],
  ["the many ways to move", "各种移动方式"],
  `
  amble|to walk slowly in a relaxed way|缓行，漫步|We ___ along the beach after dinner.|The old dog likes to ___ around the garden.|Tourists ___ through the market.|careen,slither|ambled,ambling
  plod|to walk slowly with heavy steps; to work slowly and steadily|沉重地走；埋头苦干|The tired soldiers ___ through the mud.|She will ___ on until the job is done.|Cows ___ home at dusk.|flit,scamper|plodded,plodding
  lumber|to move in a slow, heavy, awkward way|笨重地移动|The bear began to ___ toward the river.|Trucks ___ up the mountain road.|The big man would ___ across the room.|totter,scamper|lumbered,lumbering
  strut|to walk in a proud, stiff way|趾高气扬地走|The rooster likes to ___ around the yard.|Models ___ down the runway.|He would ___ about as if he owned the place.|slither,scamper|strutted,strutting
  swagger|to walk or behave in a very confident, proud way|大摇大摆地走|The champion began to ___ into the gym.|They ___ through town after the win.|His ___ annoyed the other players.|totter,slither|swaggered,swaggering
  totter|to walk or move unsteadily, as if about to fall|蹒跚，摇摇欲坠|The baby began to ___ toward her mother.|Old buildings ___ in the wind.|The government seemed to ___ on the edge of collapse.|lumber,swagger|tottered,tottering
  scamper|to run with quick light steps, like a small animal|蹦蹦跳跳地跑|Mice ___ across the floor.|The children ___ off to play.|A squirrel will ___ up the tree.|lumber,plod|scampered,scampering
  flit|to move quickly and lightly from one place to another|掠过，轻快地飞|Butterflies ___ from flower to flower.|Her eyes ___ around the room.|He likes to ___ from job to job.|plod,lumber|flitted,flitting
  careen|to move fast and out of control|失控地猛冲|The bus began to ___ down the hill.|Cars ___ around the corner.|The boat would ___ wildly in the storm.|amble,slither|careened,careening
  slither|to move smoothly along the ground, twisting like a snake|蜿蜒滑行|Snakes ___ through the grass.|The eel began to ___ out of his hands.|They ___ down the muddy bank.|careen,strut|slithered,slithering
  `,
);

const texture = batch(
  "words-of-surfaces-and-textures",
  ["Words of Surfaces and Textures", "表面与质地的词"],
  ["how things feel and look to the touch", "物体摸起来、看起来的样子"],
  `
  sleek|smooth and shiny; elegant and well-shaped|光滑的；线条流畅的|The seal's ___ fur glistened.|A ___ black car pulled up.|Her ___ new phone fits any pocket.|gnarled,jagged|sleekly
  velvety|soft and smooth like velvet|天鹅绒般柔软的|The peach had ___ skin.|The ___ voice of the singer filled the hall.|Moss made a ___ carpet on the rocks.|sleek,gritty|
  gritty|full of small hard grains; showing the harsh side of life; brave|有沙粒的；写实的；坚韧的|The salad was ___ with sand.|The film is a ___ story of the streets.|A ___ player, she never gave up.|supple,sleek|
  grainy|having a rough surface or look; made of grains; unclear in a photograph|粗粒的；(照片)颗粒粗的|The old photo was ___.|___ bread is good for you.|The video was too ___ to identify the thief.|gritty,serrated|
  supple|bending easily without breaking; moving easily|柔软的；灵活的|Leather becomes ___ with oil.|Dancers have ___ bodies.|The ___ young branches bent in the wind.|taut,jagged|suppleness
  taut|stretched tight; showing worry or stress|绷紧的；紧张的|Pull the rope ___.|Her face was ___ with fear.|The novel is ___ and fast.|supple,corrugated|tautly
  gnarled|twisted and rough, especially from age|多节的，扭曲的|A ___ oak stood by the gate.|The farmer had ___ hands.|___ roots crossed the path.|sleek,velvety|
  jagged|having sharp, uneven points|锯齿状的，参差不齐的|The ___ rocks cut his feet.|A ___ line on the screen showed his heartbeat.|___ glass lay on the floor.|serrated,supple|jaggedly
  serrated|having a row of sharp points along the edge, like a saw|锯齿状的|Use a ___ knife to cut the bread.|The leaf has ___ edges.|A shark's teeth are ___.|corrugated,supple|
  corrugated|shaped into parallel folds or ridges|波纹状的|The shed had a ___ iron roof.|Goods are shipped in ___ cardboard boxes.|The ___ road shook the car.|serrated,taut|
  `,
);

/** batchesE are the batches of rule and money, of elections, and of the senses. */
export const batchesE: readonly BatchSpec[] = [rule, money, elections, prose, sound, light, movement, texture];
