// Grade 6: the batches of words of the first five units, from myths and poetry to Rome, the first cities and the
// restless Earth.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const heroes = batch(
  "words-of-heroes-and-quests",
  ["Words of Heroes and Quests", "英雄与远征的词"],
  ["heroes and their quests", "英雄与远征"],
  `
  quest|a long search or journey to find or win something|探寻，远征|The young prince set out on a ___ to find the magic spring.|After a ___ of ten years, the hero finally carried the golden fleece home.|Her ___ for the lost city took her across three deserts.|ordeal,exile|quests
  valor|great courage, especially in battle|英勇|The soldiers were given medals for their ___ in the battle.|Songs were sung about the ___ of the warrior who held the bridge alone.|It took real ___ to step into the dragon's cave.|renown,peril
  ordeal|a hard and painful experience|严峻的考验，苦难|Crossing the frozen mountains was an ___ that left the travelers weak.|The sailors survived the ___ of twelve days lost at sea.|After the ___ was over, she slept for two whole days.|quest,peril|ordeals
  exile|being forced to live away from your home country|流放|The king sent his rebellious brother into ___ on a distant island.|After twenty years in ___, the hero finally sailed home.|She lived in ___ because the new rulers had banned her from the city.|ordeal,adversary|exiled
  vanquish|to defeat an enemy completely|彻底击败|The hero swore to ___ the monster that terrorized the village.|With one last blow, she managed to ___ her rival.|No army had ever been able to ___ the mountain tribes.|adversary,gallant|vanquished
  peril|great danger|危险|The ship was in ___ as the storm drove it toward the rocks.|Heroes in myths often face ___ on every step of their journey.|The climbers knew the ___ of crossing the glacier in the dark.|ordeal,valor|perils
  steadfast|firm and loyal; not giving up|坚定的，忠诚的|Her ___ friend stayed by her side through every danger.|Odysseus remained ___ in his wish to return home.|The guards were ___ and refused to leave their posts.|gallant,renown
  gallant|brave and noble, often polite toward others|英勇而有风度的|The ___ knight helped the old woman across the river.|In a ___ effort, the young sailor dived in to save the child.|Everyone cheered the ___ rider who had warned the town.|steadfast,valor
  renown|fame earned for doing something great|名声，声望|The poet's ___ spread far beyond her small village.|He won great ___ as the fastest runner in all of Greece.|The healer's ___ brought sick people to her door from distant lands.|valor,quest
  adversary|an enemy or opponent|对手，敌手|The hero's oldest ___ was a sea monster with six heads.|She shook hands with her ___ before the match began.|A clever ___ is harder to beat than a strong one.|exile,peril|adversaries
  `,
);

const fate = batch(
  "words-of-fate-and-prophecy",
  ["Words of Fate and Prophecy", "命运与预言的词"],
  ["fate and prophecy", "命运与预言"],
  `
  fate|a power that some believe decides what will happen|命运|In the old story, no one could escape the ___ the gods had chosen.|The sailors left their ___ in the hands of the sea.|It seemed like ___ that the two friends met again after so many years.|destiny,doom|fates
  omen|a sign that something good or bad will happen|预兆，征兆|The king saw the eclipse as an ___ that war was coming.|A flock of white birds was taken as a good ___ for the voyage.|She laughed at the idea that a black cat was an ___ of bad luck.|seer,prophecy|omens
  destiny|what will happen to someone in the future, as if already decided|命运，天命|The girl believed it was her ___ to lead her people.|He felt that becoming a doctor was his ___.|The oracle told the young man about his ___.|fate,doom|destinies
  prophecy|a statement about what will happen in the future|预言|The ___ said that a child of the king would one day rule the world.|Everyone feared the old ___ about a flood.|The ___ came true when the city fell exactly as foretold.|omen,vengeance|prophecies
  doom|death or a terrible ending that cannot be avoided|厄运，劫数|The sailors sailed toward their ___ without knowing it.|The crack in the dam warned of the town's coming ___.|In the myth, the giant laughed, unaware of his ___.|fate,wrath
  foretell|to say what will happen before it happens|预言，预示|The wise woman could ___ storms by watching the birds.|No one can ___ the future for certain.|The old songs ___ the return of a great king.|prophecy,seer|foretold,foretells
  vengeance|harm done to someone to pay them back for a wrong|复仇|The angry god swore ___ on the man who had stolen his fire.|She wanted justice, not ___.|Driven by ___, he hunted the thief for years.|wrath,doom
  seer|a person who is believed to see the future|预言者，先知|The king traveled for days to ask the ___ about the coming war.|The blind ___ warned the hero not to sail.|People came to the ___ with questions about love and money.|omen,prophecy|seers
  wrath|very great anger|愤怒，暴怒|The ___ of the sea god sent huge waves against the ship.|The farmer feared his father's ___ after he lost the cow.|Nobody wanted to face the queen's ___.|vengeance,doom
  inevitable|certain to happen; impossible to avoid|不可避免的|With dark clouds overhead, rain seemed ___.|After so many losses, the team's defeat was ___.|Change is ___, so it is better to prepare for it.|fate,doom
  `,
);

const kingdoms = batch(
  "words-of-kingdoms-and-courts",
  ["Words of Kingdoms and Courts", "王国与宫廷的词"],
  ["kingdoms, rulers and their courts", "王国、统治者与宫廷"],
  `
  realm|a kingdom, or the land a ruler controls|王国，领域|The king rode to every corner of his ___ to meet his people.|Dragons were said to live at the edge of the ___.|Peace returned to the ___ after the long war.|throne,sovereign|realms
  throne|the special chair of a king or queen; also their power|王位，宝座|The young queen sat on a golden ___ in the great hall.|When the old king died, his daughter took the ___.|Three cousins fought for the ___.|scepter,realm|thrones
  heir|the person who will receive a title or property when its owner dies|继承人|The prince was the only ___ to the throne.|She was named ___ to her grandmother's farm.|Without an ___, the kingdom feared a war over who would rule.|monarch,herald|heirs
  monarch|a king, queen or emperor|君主|The ___ ruled the country for forty years.|In some countries, the ___ has little real power.|A crown was placed on the new ___'s head.|heir,sovereign|monarchs
  banquet|a large, formal meal for many guests|宴会|The king held a ___ to celebrate his daughter's wedding.|Long tables were set for the ___ in the castle hall.|After the victory, the soldiers were invited to a grand ___.|tribute,decree|banquets
  decree|an official order given by a ruler|法令，敕令|The queen issued a ___ that every child must learn to read.|By royal ___, no one could hunt in the king's forest.|The ___ was read aloud in the market square.|tribute,herald|decrees,decreed
  herald|a messenger who announces important news; also to announce|传令官；预示|A ___ rode into the town to announce the king's visit.|The first flowers ___ the start of spring.|The ___ blew a trumpet before reading the message.|heir,monarch|heralds,heralded
  tribute|a payment made to a ruler; also something done to show respect|贡品；致敬|The conquered cities had to pay ___ in gold every year.|The concert was a ___ to the singer who had died.|Each village sent grain as ___ to the emperor.|decree,banquet|tributes
  sovereign|having the highest power; also a ruler|拥有主权的；君主|The country became a ___ nation, free from foreign rule.|The ___ of the land had the final word on every law.|Each ___ state makes its own laws.|monarch,realm|sovereigns
  scepter|a decorated rod held by a ruler as a sign of power|权杖|The king raised his golden ___ to silence the crowd.|At the crowning, the queen was handed a crown and a ___.|The jewels on the ___ sparkled in the candlelight.|throne,tribute|scepters
  `,
);

const light = batch(
  "words-for-light-and-shadow",
  ["Words for Light and Shadow", "光与影的词"],
  ["light, darkness and color", "光、暗与色彩"],
  `
  radiant|shining brightly; also glowing with happiness|光芒四射的；容光焕发的|The ___ sun rose over the hills.|She gave us a ___ smile when she heard the good news.|The bride looked ___ in her white dress.|luminous,dazzling
  glimmer|a faint, wavering light; also a small sign of something|微光；一丝|We saw a ___ of light at the end of the tunnel.|There was still a ___ of hope that the dog would come home.|The candle's ___ barely lit the room.|glint,gloom|glimmers,glimmered
  dusk|the time of evening when it is getting dark|黄昏|The streetlights came on at ___.|Bats fly out of the cave at ___ to hunt.|We hurried home before ___ fell.|gloom,murky
  crimson|a deep red color|深红色（的）|The sky turned ___ as the sun went down.|She wore a ___ scarf against the snow.|___ leaves covered the path in autumn.|radiant,hazy
  luminous|giving off light; glowing|发光的，明亮的|The ___ hands of my watch glow in the dark.|___ jellyfish lit up the dark water.|The moon looked huge and ___ over the sea.|radiant,murky
  murky|dark and dirty, so it is hard to see through|昏暗的，浑浊的|We could not see the bottom of the ___ pond.|The fish disappeared into the ___ water.|A ___ fog hung over the harbor.|hazy,luminous
  dazzling|so bright that it almost blinds you; very impressive|耀眼的；令人赞叹的|The snow was ___ in the morning sun.|The dancer gave a ___ performance.|___ fireworks filled the night sky.|radiant,glint
  glint|a small, quick flash of light|闪光|I saw the ___ of a coin in the grass.|There was a mischievous ___ in his eyes.|The ___ of a knife made the guard turn around.|glimmer,dusk|glints,glinted
  gloom|darkness; also a feeling of sadness|昏暗；忧郁|We could hardly see each other in the ___ of the cave.|A feeling of ___ settled over the team after the loss.|The old house was full of dust and ___.|dusk,murky
  hazy|not clear because of mist or smoke; also not clearly remembered|朦胧的；模糊的|The mountains looked ___ in the summer heat.|My memory of that day is ___.|Smoke from the fires made the sky ___.|murky,crimson
  `,
);

const moving = batch(
  "words-for-ways-of-moving",
  ["Words for Ways of Moving", "各种动作的词"],
  ["ways of moving", "移动的方式"],
  `
  plunge|to jump or fall suddenly into something|跳入，猛冲|The diver will ___ into the pool from the high board.|Prices ___ when nobody wants to buy.|We watched the waterfall ___ into the canyon below.|swoop,hurtle|plunged,plunges
  flutter|to move with small, quick flapping movements|飘动，振翅|The butterfly's wings ___ as it lands on the flower.|Flags ___ in the breeze above the castle.|My heart began to ___ when she called my name.|swoop,scurry|fluttered,flutters
  scurry|to run with short, quick steps|急匆匆地小跑|Mice ___ across the kitchen floor when the light goes on.|The children ___ to their seats when the bell rings.|We watched the crabs ___ sideways into their holes.|saunter,trudge|scurried,scurries
  trudge|to walk slowly and heavily, as if tired|跋涉，步履艰难地走|We had to ___ through deep snow to reach the cabin.|The tired soldiers ___ home after the long march.|After the game, the players ___ back to the bus.|saunter,stagger|trudged,trudges
  lurch|to make a sudden, unsteady movement|突然倾斜，蹒跚|The bus gave a ___ and we all grabbed the rails.|The ship began to ___ from side to side in the storm.|He stood up too fast and started to ___.|stagger,plunge|lurched,lurches
  meander|to follow a winding path; to wander slowly|蜿蜒；漫步|Rivers often ___ slowly across a flat plain.|We let the cows ___ along the lane.|Little paths ___ through the woods to the lake.|saunter,scurry|meandered,meanders
  stagger|to walk unsteadily, almost falling|摇摇晃晃地走|The injured runner began to ___ near the finish line.|Under the heavy load, the donkey started to ___.|After spinning around, the dizzy children ___ across the lawn.|lurch,trudge|staggered,staggers
  hurtle|to move very fast, often out of control|飞驰，猛冲|Rocks began to ___ down the mountainside.|The train will ___ through the tunnel at full speed.|We watched the sled ___ down the icy hill.|plunge,swoop|hurtled,hurtles,hurtling
  saunter|to walk in a slow, relaxed way|闲逛，漫步|We like to ___ along the beach after dinner.|He likes to ___ into class late as if nothing were wrong.|Tourists ___ through the market, looking at the stalls.|meander,trudge|sauntered,saunters
  swoop|to fly down suddenly and quickly|猛扑，俯冲|The eagle will ___ down to catch the fish.|Gulls ___ over the boats, looking for scraps.|The owl made a silent ___ toward the mouse.|plunge,flutter|swooped,swoops
  `,
);

const sounds = batch(
  "words-for-sounds",
  ["Words for Sounds", "声音的词"],
  ["sounds", "声音"],
  `
  screech|a loud, high, harsh sound|尖叫声，刺耳声|The car stopped with a ___ of brakes.|An owl let out a ___ in the dark forest.|The chalk made a ___ on the board.|shriek,wail|screeched,screeches
  clatter|a loud noise of hard things hitting each other|哐啷声|The pots fell to the floor with a ___.|We heard the ___ of hooves on the stone road.|Dishes ___ in the busy kitchen.|clang,thud|clattered
  wail|a long, high cry of pain or sadness|哀号，恸哭|The baby let out a ___ when her toy fell.|We heard the ___ of a siren in the distance.|The wind began to ___ around the house.|whimper,bellow|wailed,wails
  shriek|a short, very high scream|尖叫|She let out a ___ when the spider ran over her hand.|The children ___ with laughter on the swings.|A ___ came from the dark house.|screech,whimper|shrieked,shrieks
  bellow|to shout or roar in a deep, loud voice|吼叫，怒吼|The coach had to ___ to be heard over the crowd.|The bull let out a ___ and charged.|The captain had to ___ his orders over the wind.|wail,hiss|bellowed,bellows
  whimper|a soft, weak cry|呜咽|The puppy began to ___ when its owner left.|A frightened ___ came from under the bed.|The lost child started to ___.|wail,hiss|whimpered,whimpers
  clang|a loud ringing sound of metal hitting metal|叮当声，铛铛声|The prison gate shut with a ___.|We heard the ___ of the blacksmith's hammer.|The bell gave one loud ___.|chime,clatter|clanged,clangs
  hiss|a sound like a long s|嘶嘶声|The snake gave a warning ___.|Steam began to ___ out of the kettle.|Angry fans began to ___ at the referee.|bellow,thud|hissed,hisses
  chime|a ringing sound like a bell; also to ring|钟声；鸣响|The clock began to ___ at midnight.|We heard the soft ___ of wind bells on the porch.|The church bells ___ every hour.|clang,screech|chimed,chimes
  thud|a dull sound of something heavy falling|砰的一声|The book fell to the floor with a ___.|We heard a ___ as the apple hit the roof.|He landed with a ___ on the mat.|clatter,clang|thudded,thuds
  `,
);

const romanLaw = batch(
  "words-of-roman-law-and-power",
  ["Words of Roman Law and Power", "罗马法律与权力的词"],
  ["law and power in ancient Rome", "古罗马的法律与权力"],
  `
  veto|the right to reject a decision or law; also to reject it|否决（权）|A tribune could ___ any law that harmed the common people.|The president used her ___ to stop the new tax.|The council voted for the plan, but the mayor may ___ it.|censor,tribune|vetoed,vetoes
  dictator|a ruler with total power over a country|独裁者|In an emergency, Rome could choose a ___ for six months.|The ___ ruled without any vote of the people.|People were afraid to speak against the ___.|tribune,statesman|dictators
  patrician|a member of the old, rich, noble families of Rome|（古罗马的）贵族|Only a ___ could become a priest in early Rome.|The ___ lived in a large house on the hill.|___ families owned most of the land.|plebeian,magistrate|patricians
  plebeian|an ordinary citizen of Rome, not a noble|（古罗马的）平民|A ___ could be a farmer, a shopkeeper or a soldier.|Each ___ farmer refused to fight until he had more rights.|Over time, even a ___ could become a consul.|patrician,governor|plebeians
  magistrate|an official who enforces the law and judges cases|地方行政官，治安官|The ___ listened to both sides before he gave his ruling.|Every year, Romans elected each ___ for one year only.|The thief was brought before the ___.|censor,tribune|magistrates
  province|an area of land ruled as part of a larger country or empire|行省|Egypt was a rich ___ that sent grain to Rome.|Each ___ was ruled by a governor sent from Rome.|Gaul became a Roman ___ after Caesar's long war.|governor,magistrate|provinces
  governor|the person who runs a province or state|总督，州长|The ___ of the province collected taxes for Rome.|The new ___ built roads and bridges.|The ___ of the state signed the law.|magistrate,dictator|governors
  tribune|an official elected to protect the rights of ordinary Romans|保民官|The ___ spoke for the plebeians in the Senate.|No one was allowed to harm a ___ while he was in office.|The common people trusted the ___ to speak for them.|censor,patrician|tribunes
  statesman|a wise and respected political leader|政治家|Cicero was a famous ___ and speaker.|A true ___ thinks about the future of the country, not just the next election.|The old ___ was asked to end the quarrel.|dictator,governor|statesmen
  censor|a Roman official who counted the citizens; also to remove parts of a text|监察官；审查|The ___ kept a list of every citizen and his property.|The government tried to ___ the newspapers.|A ___ could remove a senator who had behaved badly.|veto,magistrate|censors,censored
  `,
  "words-of-ancient-rome",
);

const romanBuilding = batch(
  "words-of-roman-building",
  ["Words of Roman Building", "罗马建筑的词"],
  ["Roman building", "罗马建筑"],
  `
  villa|a large country house|别墅，庄园|The rich senator spent the summer at his ___ by the sea.|The ___ had gardens, fountains and its own baths.|Workers on the farm lived near the owner's ___.|bathhouse,arena|villas
  bathhouse|a building with public baths|公共浴场|Romans met friends at the ___ to bathe and talk.|The ___ had hot, warm and cold pools.|Every Roman town had at least one ___.|villa,fountain|bathhouses
  paved|covered with a flat, hard surface such as stone|铺砌的|Roman roads were ___ with large, flat stones.|The ___ streets stayed clean even after rain.|We walked along a ___ path through the ruins.|vault,mortar
  mortar|a mixture of lime, sand and water that holds bricks together|灰浆，砂浆|The builders spread ___ between the bricks.|Roman ___ was so strong that walls still stand today.|Mix the ___ well before you lay the stones.|pillar,sewer
  vault|an arched roof or ceiling; also a strong room for valuables|拱顶；保险库|The ___ of the great hall was decorated with stars.|The bank keeps its gold in a locked ___.|Roman builders used the ___ to cover wide spaces.|pillar,arena|vaults
  surveyor|a person who measures land to plan building or roads|测量员|The ___ measured the land before the road was built.|The Roman ___ used a simple tool to keep the road straight.|A ___ marked the edges of the new farm.|pillar,mortar|surveyors
  arena|a large open space with seats around it for sports or shows|竞技场|Crowds filled the ___ to watch the chariot races.|The singer performed in a huge ___.|Gladiators fought in the ___ of the Colosseum.|villa,vault|arenas
  fountain|a structure that sends water up into the air|喷泉|The children threw coins into the ___.|Water from the aqueduct filled every ___ in the city.|A stone ___ stood in the middle of the square.|sewer,bathhouse|fountains
  sewer|an underground pipe that carries away waste water|下水道|Rome's great ___ carried waste into the river.|Rain flows from the street into the ___.|Workers went down to clean the blocked ___.|fountain,vault|sewers
  pillar|a tall, strong column that holds up a roof|柱子|A huge ___ held up the roof of the temple.|She hid behind a ___ so that no one would see her.|Only one ___ of the old building is still standing.|vault,mortar|pillars
  `,
  "words-of-ancient-rome",
);

const revolt = batch(
  "words-of-revolt-and-war",
  ["Words of Revolt and War", "反叛与战争的词"],
  ["revolt and war", "反叛与战争"],
  `
  revolt|a violent fight against a ruler or government|起义，反抗|The farmers began a ___ against the high taxes.|The slaves' ___ spread from town to town.|The army was sent to stop the ___.|surrender,treaty|revolts,revolted
  overthrow|to remove a ruler from power by force|推翻|The rebels planned to ___ the cruel king.|In 509 BCE, the Romans ___ their last king.|The general tried to ___ the government.|invade,surrender|overthrew,overthrown
  treaty|a written agreement between countries|条约|The two kingdoms signed a peace ___.|The ___ set the border between the two lands.|Both sides broke the ___ within a year.|allegiance,conquest|treaties
  rebellion|an organized fight against those in power|叛乱|The ___ lasted three years before it was crushed.|Spartacus led a famous ___ of slaves.|The ___ began when soldiers refused to obey.|treaty,allegiance|rebellions
  uprising|a sudden revolt by many people|起义，暴动|The ___ began in the capital and spread across the country.|Hungry workers joined the ___.|Soldiers quickly put down the ___.|conquest,treaty|uprisings
  invade|to enter a country with an army to take it|入侵|The Gauls tried to ___ Italy from the north.|Ants ___ our kitchen every summer.|The general planned to ___ by sea.|overthrow,surrender|invaded,invades,invasion
  conquest|taking control of a land by force|征服|The ___ of Gaul made Julius Caesar famous.|After the ___, the conquered people had to pay taxes.|Rome grew through ___ and trade.|uprising,betrayal|conquests
  surrender|to stop fighting and accept defeat|投降|The city had to ___ when its food ran out.|The general would rather die than ___.|After the long siege came the ___.|overthrow,invade|surrendered,surrenders
  allegiance|loyalty to a ruler, country or cause|忠诚|The soldiers swore ___ to the emperor.|Her ___ was to her family, not to the king.|The children said the pledge of ___ every morning.|betrayal,treaty
  betrayal|being disloyal to someone who trusted you|背叛|Caesar's death was an act of ___ by his friends.|She felt his lie as a deep ___.|The ___ of the city's secrets led to its fall.|allegiance,conquest|betrayals
  `,
);

const firstCities = batch(
  "words-of-the-first-cities",
  ["Words of the First Cities", "最早城市的词"],
  ["the first cities", "最早的城市"],
  `
  ziggurat|a tall temple tower built in steps, as in Mesopotamia|（古代美索不达米亚的）塔庙|A huge ___ rose above the city of Ur.|Priests climbed the steps of the ___ to reach the shrine at the top.|The ___ was built from millions of mud bricks.|citadel,steward|ziggurats
  nomad|a person who moves from place to place instead of living in one home|游牧者|A ___ follows the herds from one pasture to the next.|Before farming, almost everyone lived like a ___, following the animals.|The ___ packed his tent onto his camel.|steward,priest|nomads,nomadic
  surplus|an amount left over after needs are met|剩余，盈余|Farmers grew a ___ of grain that they could trade.|The town had a ___ of food after the good harvest.|The club used its ___ to buy new books.|specialization,code|surpluses
  citadel|a strong fort on high ground that protects a city|城堡，要塞|The king's palace stood inside the ___.|When enemies came, the people fled to the ___.|Thick walls surrounded the ___ on the hill.|ziggurat,floodplain|citadels
  specialization|focusing on one kind of work|专门化，分工|With ___, some people became potters and others weavers.|Cities grew because ___ let people trade what they made.|Her ___ in medicine is the heart.|surplus,code
  priest|a person who leads religious ceremonies|祭司，神父|The ___ made offerings to the god of the city.|Each temple had a ___ who cared for it.|The ___ read the stars to choose the day of the festival.|steward,nomad|priests
  code|a set of written laws or rules; also a system of signals|法典；代码|Hammurabi's ___ listed nearly three hundred laws.|The school has a dress ___.|They sent the message in a secret ___.|surplus,floodplain|codes
  domesticate|to tame animals or grow plants for people's use|驯化|Early farmers learned to ___ sheep and goats.|People began to ___ wheat thousands of years ago.|Wolves were the first animals that humans managed to ___.|specialization,nomad|domesticated,domestication
  floodplain|the flat land beside a river that floods|洪泛平原|The ___ was rich because each flood left new soil.|Farmers planted their crops on the ___.|Houses built on the ___ are at risk.|citadel,surplus|floodplains
  steward|a person who manages a house, land or goods for someone else|管家，管理者|The king's ___ kept track of the grain in the storehouse.|A good ___ takes care of what belongs to others.|The ___ counted the sheep every spring.|priest,nomad|stewards
  `,
);

const records = batch(
  "words-of-writing-and-records",
  ["Words of Writing and Records", "文字与记录的词"],
  ["writing and records", "文字与记录"],
  `
  tablet|a flat piece of clay or stone with writing on it|（泥、石）板|The scribe pressed marks into a wet clay ___.|A broken ___ told the story of a great flood.|The museum keeps a ___ that lists the king's sheep.|ledger,stylus|tablets
  alphabet|the set of letters used to write a language|字母表|The English ___ has twenty-six letters.|The Phoenicians made an early ___ that spread across the sea.|Children learn the ___ by singing it.|pictograph,inscription|alphabets
  decipher|to work out the meaning of something hard to read|破译，辨认|Scholars spent years trying to ___ the ancient writing.|I could not ___ my doctor's handwriting.|She managed to ___ the secret message.|chronicle,inscription|deciphered
  ledger|a book in which money and goods are recorded|账簿|The merchant wrote every sale in his ___.|The ___ showed how much grain was stored.|She checked the ___ to find the missing money.|tablet,census|ledgers
  inscription|words cut into stone or metal|铭文，碑文|The ___ on the statue named the king.|We read the ___ on the old coin.|An ___ above the door gave the year the temple was built.|pictograph,alphabet|inscriptions
  stylus|a pointed tool for writing on clay or wax|尖笔|The scribe pressed his ___ into the clay.|A reed ___ made wedge-shaped marks.|You can use a ___ to write on this screen.|tablet,ledger|styluses
  pictograph|a picture that stands for a word or idea|象形文字|The earliest writing used a ___ for each object, such as a fish or an ox.|A ___ of a sun might mean "day."|Road signs often use a ___ instead of words.|inscription,alphabet|pictographs
  census|an official count of the people in a place|人口普查|The ___ showed that the city had grown.|Rome took a ___ every five years.|Every family filled in a ___ form.|ledger,chronicle|censuses
  chronicle|a record of events in the order they happened|编年史|The monk kept a ___ of every war and flood.|The ___ tells us when the king was born.|Her diary is a ___ of her school year.|census,decipher|chronicles,chronicled
  literate|able to read and write|识字的|Few people in the ancient world were ___.|Schools helped make the whole country ___.|A ___ person can write letters and read the news.|decipher,chronicle|literacy
  `,
);

const trade = batch(
  "words-of-trade",
  ["Words of Trade", "贸易的词"],
  ["trade and markets", "贸易与市场"],
  `
  export|to send goods to another country to sell; also the goods sent|出口|Egypt used to ___ grain to Rome.|Coffee is the main ___ of the country.|Factories ___ cars all over the world.|tariff,goods|exported,exports
  goods|things that are made to be sold|商品，货物|The ship carried ___ from China to Europe.|The store sells household ___ such as pots and brooms.|Traders swapped ___ at the market.|wares,commerce
  commerce|the buying and selling of goods|商业，贸易|The river was a highway of ___ between the cities.|Banks help ___ by lending money.|The city grew rich from ___.|economy,export
  trader|a person who buys and sells goods|商人|The ___ bought silk in the east and sold it in the west.|Each ___ had a stall at the market.|The fur ___ paddled down the river.|merchandise,port|traders
  port|a town with a harbor where ships load and unload|港口|The ship sailed into ___ at dawn.|Goods from many lands were unloaded at the ___.|The ___ was crowded with boats.|tariff,trader|ports
  tariff|a tax on goods brought into a country|关税|The government put a ___ on imported steel.|A high ___ makes foreign goods more expensive.|The two countries agreed to remove the ___.|export,economy|tariffs
  wares|things that someone is selling|商品，货物|The potter laid out her ___ on a cloth.|Sellers shouted about their ___ in the street.|The peddler carried his ___ in a sack.|goods,merchandise
  haggle|to argue about a price before buying|讨价还价|In the market, people ___ until both sides are happy.|My uncle loves to ___ over the price of a carpet.|The traveler refused to ___ and paid the full price.|export,commerce|haggled,haggling
  merchandise|goods that are bought and sold|商品|The store has new ___ every week.|Please do not touch the ___.|The ___ arrived by truck in the morning.|wares,trader
  economy|the system of money, work and trade in a place|经济|Tourism is important to the island's ___.|When the ___ is strong, more people have jobs.|Trade helped the city's ___ grow.|commerce,tariff|economies
  `,
);

const plates = batch(
  "words-of-plate-tectonics",
  ["Words of Plate Tectonics", "板块构造的词"],
  ["moving plates of the Earth", "地球的移动板块"],
  `
  plate|one of the huge pieces of rock that make up Earth's outer layer|（地壳）板块|The Pacific ___ is the largest on Earth.|Each ___ moves only a few centimeters a year.|India sits on a ___ that is pushing north.|crust,rift|plates
  crust|the thin, solid outer layer of Earth|地壳|The ___ is thinnest under the oceans.|We live on Earth's rocky ___.|The ___ cracked during the earthquake.|mantle,core
  mantle|the thick layer of hot rock between Earth's crust and core|地幔|Rock in the ___ moves very slowly, like thick paste.|The ___ is about 2,900 kilometers thick.|Heat from the ___ helps move the plates.|crust,core
  core|the hot center of Earth; also the most important part|地核；核心|Earth's ___ is made mostly of iron.|The outer ___ is liquid metal.|Honesty is at the ___ of good friendship.|mantle,crust|cores
  collide|to crash into each other|相撞，碰撞|When two plates ___, mountains can rise.|Two cars can ___ at a corner with no lights.|Players ___ when they both run for the ball.|uplift,rift|collided,collides,collision
  boundary|a line where two areas meet|边界|The river forms the ___ between the two countries.|Earthquakes often happen at a plate ___.|The fence marks the ___ of our yard.|trench,core|boundaries
  trench|a long, deep ditch, especially at the bottom of the ocean|海沟；沟渠|The Mariana ___ is the deepest place in the ocean.|Soldiers dug a ___ to hide in.|A ___ forms where one plate sinks under another.|rift,boundary|trenches
  rift|a crack or split; also a break in a friendship|裂谷；裂痕|The East African ___ is slowly splitting the continent.|An argument caused a ___ between the two friends.|Lava can rise up through a ___ in the crust.|trench,plate|rifts
  subduction|the sinking of one plate under another|（板块）俯冲|___ happens where an ocean plate meets a continent.|Volcanoes form along zones of ___.|Deep trenches are made by ___.|uplift,boundary
  uplift|the raising of land by forces inside the Earth; also something that cheers you|隆起；鼓舞|Slow ___ pushed the old seabed high into the mountains.|The good news gave us all an ___.|Fossils of fish were found on the mountain because of ___.|subduction,collide|uplifted
  `,
);

const volcanoes = batch(
  "words-of-volcanoes",
  ["Words of Volcanoes", "火山的词"],
  ["volcanoes", "火山"],
  `
  eruption|the moment when a volcano throws out lava, ash and gas|（火山）爆发|The ___ of Vesuvius buried the town of Pompeii.|Scientists warned that an ___ was coming.|The ___ lasted for three days.|deposit,fissure|eruptions
  ash|the gray powder left after burning; also fine rock dust from a volcano|灰；火山灰|A cloud of ___ rose miles above the volcano.|___ from the fire covered the floor.|Planes could not fly through the volcanic ___.|pumice,basalt
  cone|a shape with a round base and a point; the hill around a volcano's opening|锥体；火山锥|Layers of lava and ash built a steep ___.|The ice cream came in a crisp ___.|The volcano's ___ grew taller after each eruption.|geyser,fissure|cones
  geyser|a hot spring that shoots water and steam into the air|间歇泉|The ___ shoots water high into the air every hour.|Tourists wait to see the famous ___ erupt.|Underground heat makes a ___ boil over.|cone,fissure|geysers
  pumice|a light rock full of holes, formed from lava|浮石|___ is so light that it can float on water.|People use ___ to scrub rough skin.|The beach near the volcano was covered with ___.|basalt,ash
  basalt|a hard, dark rock made from cooled lava|玄武岩|The cliffs are made of black ___.|Most of the ocean floor is ___.|Hot lava cools into hard ___.|pumice,deposit
  fissure|a long, narrow crack|裂缝|Lava poured out of a ___ in the ground.|A ___ opened in the ice.|Steam rose from a ___ in the rock.|cone,eruption|fissures
  evacuate|to move people away from a dangerous place|疏散，撤离|The town had to ___ before the volcano erupted.|Firefighters had to ___ the burning building.|We practice how to ___ the school safely.|deposit,eruption|evacuated,evacuation
  volcanic|made by or coming from a volcano|火山的|The island is made of ___ rock.|___ soil is very rich for farming.|A ___ eruption can change the weather.|basalt,geyser
  deposit|a layer of material left by water, wind or a volcano; also to put down|沉积物；放置|A thick ___ of ash covered the fields.|Rivers ___ sand where they slow down.|She went to the bank to ___ her money.|eruption,ash|deposits,deposited
  `,
);

const measuring = batch(
  "words-of-measuring",
  ["Words of Measuring", "测量的词"],
  ["measuring and data", "测量与数据"],
  `
  estimate|to make a careful guess about an amount; also the guess|估计|Can you ___ how many beans are in the jar?|Her ___ of the room's length was close to the real number.|Scientists ___ that the volcano is ten thousand years old.|calculate,approximate|estimated,estimates
  scale|a set of marks for measuring; also a machine for weighing|刻度；秤|An earthquake's strength is measured on a ___.|Put the apples on the ___ to weigh them.|The map's ___ shows that one centimeter is one kilometer.|instrument,metric|scales
  magnitude|the size or strength of something, such as an earthquake|大小，震级|The earthquake had a ___ of 7.0.|We did not understand the ___ of the problem.|A quake of that ___ can destroy buildings.|scale,data
  data|facts and numbers collected to study something|数据|The scientists collected ___ from the sensors every hour.|Our class put the survey ___ into a table.|The ___ showed that the ground was rising.|error,estimate
  metric|using meters, liters and grams|公制的|Most countries use the ___ system.|A kilogram is a ___ unit of weight.|The ruler has ___ marks on one side.|reliable,scale
  instrument|a tool for measuring or doing careful work; also a tool for music|仪器；乐器|A seismograph is an ___ that records earthquakes.|The doctor used a small ___ to look in my ear.|The violin is a difficult ___ to play.|scale,data|instruments
  calculate|to find an answer by using numbers|计算|Can you ___ how far the car will go in two hours?|Scientists ___ the distance to the epicenter.|Use your phone to ___ the total.|estimate,approximate|calculated,calculation
  error|a mistake|错误，误差|An ___ in the measurement gave the wrong result.|She found an ___ in her math homework.|The machine stopped because of an ___.|data,magnitude|errors
  reliable|able to be trusted; working well every time|可靠的|A ___ instrument gives the same reading each time.|He is a ___ friend who always keeps his promises.|We need ___ data before we decide.|approximate,metric
  approximate|close to the exact amount but not exact|大约的，近似的|The ___ length of the river is 500 kilometers.|Give me an ___ time when you will arrive.|The map shows the ___ location of the old city.|reliable,estimate
  `,
);

/** batchesA are the batches of the first five units of grade 6. */
export const batchesA: readonly BatchSpec[] = [
  heroes,
  fate,
  kingdoms,
  light,
  moving,
  sounds,
  romanLaw,
  romanBuilding,
  revolt,
  firstCities,
  records,
  trade,
  plates,
  volcanoes,
  measuring,
];
