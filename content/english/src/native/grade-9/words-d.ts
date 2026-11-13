// Grade 9: the batches of words of computers, of family, of shopping, of the army, of getting around, of moods,
// of how things are and of staying safe.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const computers = batch(
  "words-of-software-and-security",
  ["Words of Software and Security", "软件与安全的词"],
  ["programs, connections and dangers online", "程序、连接与网络危险"],
  `
  software|the programs used by a computer|软件|Install the new ___.|The ___ crashed.|She writes ___ for a living.|server,malware|
  server|a computer that provides data to other computers; a person who serves|服务器；服务员|The ___ is down.|Data is stored on a ___.|The ___ brought our food.|software,cursor|servers
  cursor|a moving mark on a screen showing where you are|光标|Move the ___ to the box.|The ___ is blinking.|Click where the ___ is.|server,charger|cursors
  browse|to look through casually; to look at websites|浏览|I like to ___ in bookshops.|___ the web for ideas.|We ___ the shelves.|update,hack|browsed
  update|to make current; the latest news or version|更新|___ your phone.|Here is an ___ on the storm.|The ___ fixed the bug.|browse,firewall|updated,updates
  charger|a device for charging a battery|充电器|I forgot my phone ___.|Plug in the ___.|The phone ___ is broken, so the battery is dead.|wireless,cursor|chargers
  wireless|without wires; using radio signals|无线的|We have ___ internet.|The ___ speaker is loud.|Use a ___ mouse.|charger,software|
  firewall|a system that protects a computer network from attack|防火墙|The ___ blocked the virus.|Turn on your ___.|A strong ___ keeps out hackers.|malware,update|firewalls
  malware|software designed to damage a computer|恶意软件|The ___ stole passwords.|Scan your laptop for ___.|Don't click links that may hide ___.|firewall,hack|
  hack|to gain unauthorized access to data; a clever trick|侵入(电脑)；妙招|Someone tried to ___ the bank.|Here's a useful kitchen ___.|They ___ into the system.|malware,browse|hacked,hacker,hacking
  `,
);

const family = batch(
  "words-of-family",
  ["Words of Family", "家庭的词"],
  ["relatives, marriage and family loss", "亲戚、婚姻与家庭的失去"],
  `
  cousin|a child of one's aunt or uncle|堂(表)兄弟姐妹|My aunt's son is my ___; he lives in Spain.|She is my second ___.|We played with our ___ Ann, Uncle Tom's daughter.|nephew,in-law|cousins
  nephew|a son of one's brother or sister|侄子；外甥|My sister's son, my ___, is five.|She took her ___ to the zoo.|Her brother's boy, her ___, is tall.|cousin,toddler|nephews
  toddler|a young child who is learning to walk|学步的孩子|The ___ fell over.|Watch the ___; he just learned to walk.|A ___ needs naps.|orphan,nephew|toddlers
  orphan|a child whose parents are dead|孤儿|The ___ was taken in.|He was an ___ at six.|They adopted an ___.|widow,toddler|orphans,orphanage,orphaned
  stepfather|the husband of one's mother who is not one's father|继父|Her ___ is kind.|My ___ taught me to fish.|He met his ___ when his mother remarried.|spouse,fiance|stepfathers
  spouse|a husband or wife|配偶|Married guests may bring their ___.|Her ___ works abroad.|Each ___ signed the form.|fiance,newlywed|spouses
  fiance|a man one is engaged to marry|未婚夫|Her ___, whom she will marry next year, is a doctor.|She met her ___ at school, and now they are engaged.|My ___ and I will marry in May.|spouse,stepfather|fiancee
  newlywed|a person who has recently married|新婚者|The ___ couple went to Paris.|Each ___ got a gift.|The ___ pair smiled.|fiance,widow|newlyweds
  widow|a woman whose husband has died|寡妇|Since her husband died, the ___ lives alone.|Her husband died, and she became a ___ young.|At her husband's funeral the ___ wore black.|orphan,spouse|widowed,widower
  in-law|a relative by marriage|姻亲|My mother-___ is coming.|She gets on with each ___ in her husband's family.|Each ___ was invited.|cousin,newlywed|in-laws
  `,
);

const shopping = batch(
  "words-of-shopping",
  ["Words of Shopping", "购物的词"],
  ["the shop, the people in it and paying", "商店、店里的人与付款"],
  `
  aisle|a passage between rows of seats or shelves|过道|The milk is in ___ five.|Walk down the ___.|She took a seat by the ___.|queue,checkout|aisles
  queue|a line of people waiting; to wait in one|队；排队|Join the ___.|We had to ___ for an hour.|The ___ of people at the till was long.|aisle,trolley|queued,queuing
  trolley|a cart on wheels for carrying shopping|手推车|Push the ___.|The ___ was full.|Return the ___.|shopper,queue|trolleys
  shopper|a person who is shopping|购物者|The ___ paid in cash.|Every ___ got a bag.|A busy ___ filled her cart.|cashier,trolley|shoppers
  cashier|a person who takes payments in a shop|收银员|Pay the ___.|She works as a ___.|The ___ gave me change.|shopper,checkout|cashiers
  checkout|the place where goods are paid for|收银台|Take your items to the ___ to pay.|The ___ line was long.|Pay at the ___.|cashier,aisle|checkouts
  coupon|a ticket giving money off|优惠券|Use this ___ to save money.|She clipped a ___.|The ___ for 20% off ends soon.|warranty,tip|coupons
  warranty|a written promise to repair or replace a product|保修单|The TV has a two-year ___.|Keep the ___ in case it breaks.|Is it under ___?|coupon,stock|warranties
  stock|goods kept for sale; to keep for sale|存货；进货|The shop is out of ___.|We ___ fresh bread.|Check how much ___ is left in the store room.|warranty,shopper|stocked,stocks
  tip|money given for service; a useful hint; the pointed end|小费；提示；尖端|Leave a ___ for the waiter.|Here's a ___: soak the pan first.|The ___ of a pen.|coupon,stock|tipped,tips
  `,
);

const army = batch(
  "words-of-the-army",
  ["Words of the Army", "军队的词"],
  ["soldiers, their ranks, their homes and their weapons", "士兵、军衔、营房与武器"],
  `
  soldier|a person who serves in an army|士兵|The ___ stood guard.|Her son is a ___.|Each ___ carried a pack.|sergeant,recruit|soldiers
  sergeant|a soldier of middle rank; a police officer|中士；警官|The ___ gave orders.|___ Smith shouted.|He was made ___.|soldier,platoon|sergeants
  recruit|a new member of the army; to get new members|新兵；招募|The ___ was nervous.|They ___ young people.|Each ___ trains for weeks.|soldier,infantry|recruited,recruitment
  platoon|a small unit of soldiers|排(部队单位)|The ___ marched off.|He led a ___.|The ___ camped by the river.|sergeant,barracks|platoons
  barracks|buildings where soldiers live|营房|They slept in the ___.|The ___ were cold.|Soldiers returned to ___.|platoon,tank|
  infantry|soldiers who fight on foot|步兵|The ___ advanced on foot.|He served in the ___.|The ___ dug in.|artillery,recruit|
  artillery|large guns used in war|大炮|The ___ fired all night.|They lost their ___.|We heard the ___ boom all night.|infantry,tank|
  tank|a large armored vehicle; a container for liquid|坦克；箱，罐|The ___ rolled into town.|Fill the gas ___.|Fish swim in the ___.|artillery,barracks|tanks
  retreat|to move back from the enemy; a quiet place|撤退；静修处|The army had to ___.|The cabin is our ___.|They began a ___.|medal,infantry|retreated
  medal|a metal disk given as an award|奖牌|She won a gold ___.|He got a ___ for bravery.|They gave each soldier a ___.|retreat,platoon|medals,medalist
  `,
);

const transport = batch(
  "words-of-getting-around",
  ["Words of Getting Around", "出行的词"],
  ["boats, trains, roads and paying to travel", "船、电车、道路与车费"],
  `
  ferry|a boat for carrying people across water; to carry|渡轮；摆渡|We took the ___ across the lake.|The ___ crosses every hour.|They ___ people to the island.|tram,subway|ferried,ferries
  tram|a passenger vehicle running on rails in a street|有轨电车|Take the ___ that runs along the street.|The ___ stopped in the middle of the street.|Ride the old electric ___ down Main Street.|ferry,subway|trams
  subway|an underground railway|地铁|We took the ___ under the city.|The underground ___ is fast.|The ___ station is near.|tram,terminal|subways
  terminal|a building where travelers arrive and leave; fatal|航站楼；晚期的|Meet me at the airport ___.|He has ___ cancer.|The bus ___ is busy.|subway,toll|terminals
  fare|the money paid for a journey|车费|The bus ___ is two dollars.|Pay your ___.|___ will rise.|toll,lane|fares
  toll|a charge to use a road or bridge; the number of deaths|通行费；伤亡人数|Pay the ___ to use the bridge.|The death ___ rose.|The bridge has a ___.|fare,highway|tolls
  highway|a main road|公路|The six-lane ___ was busy.|Take the ___ north.|There was a crash on the ___ between the cities.|lane,detour|highways
  lane|a narrow road; a division of a road|小路；车道|Drive in the left ___.|We walked down the ___.|The ___ was muddy.|highway,roundabout|lanes
  detour|a longer route taken to avoid something|绕道|The road was closed, so we took a ___.|The ___ added an hour.|A ___ was set up around the roadworks.|roundabout,highway|detours
  roundabout|a circular road junction; indirect|环岛；迂回的|Turn left at the ___.|He spoke in a ___ way.|Cars circled the busy ___.|detour,lane|roundabouts
  `,
);

const moods = batch(
  "words-of-moods",
  ["Words of Moods", "情绪的词"],
  ["feeling cheerful, lonely, nervous, shamed, bored or cross", "开心、孤独、紧张、羞愧、无聊或烦躁"],
  `
  cheerful|noticeably happy and optimistic|愉快的|She is always ___ and smiling.|A happy, ___ song.|The bright yellow room is ___.|moody,bored|cheerfully,cheerfulness
  lonely|sad because one has no friends or company|孤独的|He had no friends and felt ___ at the new school.|A ___ road.|She missed him and was ___ after he left.|ashamed,bored|loneliness,lonelier
  nervous|easily worried; anxious|紧张的|I'm ___ about the test tomorrow; my hands shake.|He gave a ___ laugh and bit his nails.|Dogs get ___ in storms.|cheerful,ashamed|nervously,nervousness
  jittery|nervous and unable to relax|心神不宁的|Coffee makes me ___.|The market was ___.|She felt ___ before the race.|cheerful,lonely|
  ashamed|feeling shame|羞愧的|I'm ___ of what I did.|Don't be ___ of your mistakes.|He was ___ of himself for lying.|lonely,nervous|
  bored|tired because one has nothing interesting to do|无聊的|I'm ___; there's nothing to do at home.|The kids got ___.|She looked ___ and yawned.|cheerful,sulky|boredom
  grumpy|bad-tempered|脾气坏的|Dad is ___ in the morning.|The ___ old man shouted.|Don't be so ___.|cheerful,lonely|grumpily
  cranky|irritable, especially from tiredness|易怒的|The baby is ___.|He gets ___ when hungry.|A ___ old car.|cheerful,ashamed|
  moody|having changing moods; often sulky|喜怒无常的|Teenagers can be ___.|She is ___ today.|The film was dark and ___.|cheerful,ashamed|moodily
  sulky|silent and bad-tempered|闷闷不乐的|He was ___ all day and wouldn't speak after we said no.|A ___ child pouts when he can't have his way.|She gave a ___ look and stomped off.|cheerful,nervous|sulk,sulked
  `,
);

const states = batch(
  "words-of-how-things-are",
  ["Words of How Things Are", "事物状态的词"],
  ["clumsy, casual, eager, old, breakable, empty and wet", "笨拙、随意、热切、年长、易碎、空与湿"],
  `
  awkward|causing difficulty; uncomfortable; clumsy|尴尬的；棘手的|There was an ___ silence.|The box is an ___ shape.|He felt ___ at the party.|clumsy,casual|awkwardly
  clumsy|careless and awkward in movement|笨手笨脚的|I'm so ___; I broke the cup.|He made a ___ excuse.|The ___ puppy fell.|awkward,fragile|clumsily
  casual|relaxed; not formal; not regular|随意的；临时的|Wear ___ clothes.|It was a ___ remark.|She has a ___ job.|eager,awkward|casually
  eager|wanting very much to do or have something|渴望的|She was ___ to learn.|___ fans waited.|He is ___ to please.|casual,elderly|eagerly
  elderly|old or aging|上了年纪的|Help the ___ man.|Our ___ neighbor lives alone.|The ___ need care.|eager,vacant|
  fragile|easily broken|易碎的|Handle the box with care; it is ___.|Her health is ___.|The peace was ___.|hollow,clumsy|fragility
  hollow|having an empty space inside; empty of meaning|空心的；空洞的|The tree is ___.|It was a ___ promise.|Owls live in the ___ log.|vacant,fragile|hollowed
  vacant|empty; not occupied|空着的|The house is ___.|He had a ___ look.|Is this seat ___?|hollow,stained|vacancy
  moist|slightly wet|湿润的|The cake is ___.|Keep the soil ___.|Her eyes were ___.|stained,hollow|
  stained|marked with dirt or color that is hard to remove|有污渍的|His shirt was ___.|The ___ glass window glowed.|The cup is ___ with tea.|moist,vacant|stains
  `,
);

const safety = batch(
  "words-of-staying-safe",
  ["Words of Staying Safe", "保持安全的词"],
  ["danger, warnings, pain, getting through unhurt and staying calm", "危险、警告、疼痛、安然无恙与镇定"],
  `
  emergency|a serious, unexpected and dangerous situation|紧急情况|Call 911 in an ___.|This is an ___!|The plane made an ___ landing.|warn,sting|emergencies
  warn|to tell someone of danger|警告|I ___ you; it's hot.|Signs ___ of the cliff.|She tried to ___ him.|emergency,heal|warned,warning
  sting|a sharp pain from an insect or plant; to cause it|刺；蜇|A bee may ___ you.|The ___ hurt.|Smoke made my eyes ___.|sigh,warn|stung,stinging
  heal|to become healthy again|愈合|The cut will ___.|Time can ___.|Doctors ___ the sick.|intact,sting|healed,healing
  unharmed|not hurt or damaged|未受伤的|The child was ___.|All the passengers are ___.|She walked away ___.|sigh,composure|
  unscathed|without suffering any injury or damage|毫发无损的|He escaped ___.|No one came out of the scandal ___.|The town was left ___.|sigh,poise|
  intact|not damaged; whole|完整无损的|The vase was ___.|Her pride stayed ___.|The old wall is still ___.|sigh,composure|
  composure|the state of being calm|镇定|She kept her ___.|He lost his ___.|With great ___, she spoke.|sting,sigh|
  poise|graceful and calm manner; to be ready|镇定；做好准备|She spoke with ___.|She has natural ___.|Her ___ impressed us.|sting,sigh|poised
  sigh|to breathe out long and loudly in sadness or relief|叹气|She gave a ___ of relief.|He began to ___.|"Oh well," she would ___.|sting,composure|sighed
  `,
);

/** batchesD are the batches of computers, family, shopping, the army, transport, moods, states and safety. */
export const batchesD: readonly BatchSpec[] = [computers, family, shopping, army, transport, moods, states, safety];
