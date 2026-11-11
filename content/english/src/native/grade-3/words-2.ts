// Grade 3: the words of the last five themes, ten to a batch: a river kingdom and ancient life, time long ago,
// ancient China and its walls, thinking, forces, magnets and explaining how, music, its instruments and performing,
// and poetry, the seasons and the words for sounds and light.

import { t } from "@ga/content";
import type { Grade3Batch } from "./batches.ts";

const riverKingdom: Grade3Batch = {
  id: "words-of-a-river-kingdom",
  title: t("Words of a River Kingdom", "河流王国的词汇"),
  summary: t(
    "Ten words of life along the Nile: silt, delta, cataract, barge, granary, reed, sickle, chariot and more.",
    "十个尼罗河沿岸生活的词：silt、delta、cataract、barge、granary、reed、sickle、chariot 等。",
  ),
  domain: ["life along a great river long ago", "古代大河沿岸的生活"],
  lines: `
    silt|-|fine, rich mud carried and left behind by a river|淤泥，河水带来并留下的肥沃细泥|When the flood went down, a layer of black ___ covered the fields.|Farmers planted their seeds in the soft ___ left by the river.|The river water was brown because it carried so much ___.|reed,linen
    delta|deltas|flat land where a river splits into many streams before it reaches the sea|三角洲|The Nile splits into many small streams in its ___ near the sea.|Birds nest in the wet, green ___ where the river meets the sea.|Seen from above, the river's ___ looks like a fan.|cataract,granary
    cataract|cataracts|a place where a river rushes over rocks in fast, rough water|（河流的）大瀑布，急流险滩|Boats could not sail past the ___, where the water crashed over rocks.|The sailors carried their boat around the dangerous ___.|We heard the roar of the ___ before we saw the white water.|delta,barge
    barge|barges|a long, flat boat for carrying heavy loads on a river|驳船|A ___ carried huge blocks of stone down the river.|The workers loaded sacks of grain onto the ___.|The flat ___ floated slowly with the current.|chariot,sphinx
    granary|granaries|a building where grain is stored|粮仓|After the harvest, the wheat was stored in the ___.|The king's ___ held enough grain to feed the city for a year.|Mice tried to sneak into the ___ to eat the grain.|delta,sickle
    reed|reeds|a tall, thin grass that grows in water|芦苇|The ___ by the river grew taller than a man.|Egyptians wove baskets and mats from the river ___.|A duck hid behind a tall green ___ beside the pond.|silt,linen
    sickle|sickles|a tool with a curved blade for cutting grain|镰刀|The farmer cut the wheat with a sharp ___.|Each worker carried a ___ into the field at harvest time.|The curved blade of the ___ flashed in the sun.|chariot,barge
    chariot|chariots|a two-wheeled cart pulled by horses, used long ago in battles and races|（古代）战车|The king rode into battle in a golden ___.|Two horses pulled the ___ around the track.|Soldiers fought from the back of a fast ___.|barge,sickle
    sphinx|sphinxes|a stone statue with the body of a lion and the head of a person|狮身人面像|The great ___ lies in the sand near the pyramids.|The ___ has a lion's body and a king's face.|Long ago, sand covered the ___ up to its neck.|granary,chariot
    linen|-|a cool, light cloth made from the flax plant|亚麻布|Egyptians wore clothes made of white ___ in the hot sun.|The mummy was wrapped in strips of ___.|This ___ shirt keeps me cool on summer days.|silt,reed
  `,
};

const ancientLife: Grade3Batch = {
  id: "words-of-ancient-life",
  title: t("Words of Ancient Life", "古代生活的词汇"),
  summary: t(
    "Ten words for how people lived in ancient times: civilization, kingdom, temple, merchant, artisan and more.",
    "十个描述古人生活的词：civilization、kingdom、temple、merchant、artisan 等。",
  ),
  domain: ["how people lived long ago", "古人的生活"],
  lines: `
    civilization|civilizations|a large group of people with cities, laws, writing and a shared way of life|文明|Ancient Egypt was a great ___ that lasted for thousands of years.|The ___ along the river built cities, wrote laws and traded goods.|Every ___ has its own way of building, writing and worshipping.|monument,temple
    kingdom|kingdoms|a land ruled by a king or queen|王国|The king ruled his ___ from a palace by the river.|The two lands joined to make one large ___.|Soldiers guarded the borders of the ___.|temple,merchant
    temple|temples|a building where people go to worship a god or gods|神庙，寺庙|People brought gifts of food to the ___ of the sun god.|People went inside the ___ to pray to the cat goddess.|Priests lit lamps inside the ___ every evening.|monument,pyramid
    noble|nobles|a rich person of high rank, close to the king|贵族|The ___ lived in a big house with servants and a garden.|Each ___ wore gold rings and fine clothes at the feast.|The king chose a ___ to rule the city for him.|merchant,artisan
    merchant|merchants|a person who buys and sells goods|商人|The ___ sold cloth and spices at the market.|A ___ sailed up the river with jars of oil to trade.|The ___ counted his coins after a busy day of selling.|artisan,noble
    trade|traded,trades|to swap goods with other people|交易，以物易物|Farmers would ___ grain for cloth and pots.|Egypt began to ___ gold for wood from other lands.|I will ___ you my apple for your orange.|worship,monument
    artisan|artisans|a skilled worker who makes things by hand|工匠|The ___ carved a beautiful cat out of stone.|The ___ spent weeks making a gold necklace for the queen.|Each ___ in the workshop had a special skill, like making pots or jewelry.|merchant,noble
    worship|worshipped,worships|to show love and respect to a god|崇拜，敬拜|People went to the temple to ___ the gods.|Ancient Egyptians would ___ the sun god every morning.|Many people still ___ in old temples today.|trade,monument
    monument|monuments|a building or statue made to remember a person or event|纪念碑，纪念性建筑|The city built a stone ___ to honor the brave king.|A tall ___ stands in the square to remember the battle.|This ___ was built to help people remember the day the war ended.|temple,kingdom
    pyramid|pyramids|a huge stone building with a square base and four sloping sides that meet at a point|金字塔|The king was buried inside a giant ___.|Thousands of workers built the ___ block by block.|The ___ has four sides that meet at a point at the top.|temple,monument
  `,
};

const timeLongAgo: Grade3Batch = {
  id: "words-for-time-long-ago",
  title: t("Words for Time Long Ago", "表达久远时间的词"),
  summary: t(
    "Ten words for talking about time and history: century, decade, era, ancient, modern, generation and more.",
    "十个谈论时间和历史的词：century、decade、era、ancient、modern、generation 等。",
  ),
  domain: ["time and history", "时间和历史"],
  lines: `
    century|centuries|a hundred years|世纪，一百年|This house was built over a ___ ago, more than a hundred years back.|A ___ is ten times as long as a decade.|The old oak tree has stood here for more than a ___.|decade,generation
    decade|decades|ten years|十年|My big brother is ten, so he has lived for a ___.|In the past ___, the town has grown a lot.|The ten years from 2010 to 2019 make up one ___.|century,era
    era|eras|a long period of history known for something special|时代，纪元|The age of the pharaohs was the ___ of great building.|Dinosaurs lived in the ___ long before people.|The invention of the car began a new ___ of travel.|decade,period
    ancient|-|from a very long time ago|古代的，古老的|We saw ___ pots that were five thousand years old.|The ___ Egyptians wrote with pictures.|Archaeologists found the ruins of the ___ city buried under the sand.|modern,recent
    period|periods|a length of time|时期，一段时间|There was a long ___ with no rain, and the crops dried up.|The museum has toys from each ___ of history.|For a short ___, the town had no school.|era,century
    former|-|from before, but not now|以前的，前任的|The ___ king handed his crown to his son.|Our ___ teacher moved to another city.|The old mill is now a library, but its ___ owner made flour there.|modern,recent
    recent|-|happening a short time ago|最近的|In ___ years, more people have started riding bikes.|The ___ storm knocked down two trees last week.|A ___ photo shows how much my sister has grown since spring.|ancient,former
    modern|-|of the present time, new and up to date|现代的|A ___ kitchen has a fridge and a microwave.|Most ___ ships are made of steel, not wood.|My grandparents' farm is old, but the tractor is ___.|ancient,previous
    previous|-|the one just before|上一个的，先前的|The ___ day was sunny, but today it is raining.|I read the ___ chapter again before starting a new one.|The new owners painted over the ___ owner's green walls.|recent,generation
    generation|generations|all the people born around the same time, such as parents or grandparents|一代人|My grandmother's ___ grew up without computers.|My mother's ___ was the first to grow up with mobile phones.|Each ___ of the family has lived in this house.|century,decade
  `,
};

const ancientChina: Grade3Batch = {
  id: "words-of-ancient-china",
  title: t("Words of Ancient China", "中国古代的词汇"),
  summary: t(
    "Ten words of life along the Yellow River long ago: millet, paddy, levee, canal, bronze, calligraphy, jade and more.",
    "十个古代黄河沿岸生活的词：millet、paddy、levee、canal、bronze、calligraphy、jade 等。",
  ),
  domain: ["ancient China", "中国古代"],
  lines: `
    millet|-|a grain with small round seeds that grows well in dry places|小米，粟|Farmers in the north grew ___ in the dry yellow soil.|Bowls of ___ porridge were a common breakfast long ago.|The tiny round seeds of ___ can be cooked like rice.|jade,bronze
    paddy|paddies|a flooded field where rice is grown|稻田|The farmer waded through the muddy ___ to plant rice.|Water covered the ___ so the young rice could grow.|Frogs croaked in the green rice ___ at night.|canal,levee
    levee|levees|a high bank of earth built to keep a river from flooding|堤坝|The villagers piled up earth to build a ___ along the river.|When the ___ broke, water poured into the fields.|People walked along the top of the ___ to check for cracks.|canal,paddy
    canal|canals|a long waterway dug by people for boats or for watering fields|运河，水渠|Boats carried rice along the ___ to the city.|Workers dug a ___ to bring river water to the dry farms.|The Grand ___ in China is over a thousand miles long.|levee,paddy
    bronze|-|a hard, golden-brown metal made by melting copper and tin together|青铜|Ancient Chinese artisans cast bells and pots in ___.|The ___ vessel had faces carved on its sides.|Mixed with tin, copper becomes ___, which is much harder.|jade,scroll
    calligraphy|-|the art of beautiful handwriting, often with a brush and ink|书法|My uncle practices ___ with a brush and black ink.|Each stroke of ___ must be smooth and careful.|The scroll on the wall shows a poem written in ___.|scroll,bronze
    jade|-|a hard green stone used to make jewelry and carvings|玉|The emperor wore a ring carved from green ___.|The ___ bracelet felt cool and smooth on her wrist.|Artisans spent months carving a dragon out of ___.|bronze,millet
    ancestor|ancestors|a family member who lived long before you|祖先|My great-great-grandfather is the ___ who came from a small village.|Families honored each ___ with gifts and prayers.|We found the name of one ___ in an old family book.|philosopher,scroll
    philosopher|philosophers|a person who thinks deeply about how people should live|哲学家，思想家|Confucius was a ___ who taught people to be kind and respectful.|The old ___ spent his days thinking about what makes a good ruler.|Students came from far away to learn from the wise ___.|ancestor,calligraphy
    scroll|scrolls|a long roll of paper or silk with writing or pictures on it|卷轴|The emperor unrolled a ___ covered with a map.|A long ___ showed a painting of mountains and rivers.|Each poem was written on its own silk ___.|canal,jade
  `,
};

const walls: Grade3Batch = {
  id: "words-of-walls-and-watchtowers",
  title: t("Words of Walls and Watchtowers", "城墙与烽火台的词汇"),
  summary: t(
    "Ten words of walls built to guard a land: fortress, beacon, watchtower, rampart, invader, patrol and more.",
    "十个守卫国土的城墙的词：fortress、beacon、watchtower、rampart、invader、patrol 等。",
  ),
  domain: ["walls and how people guarded them", "城墙及其守卫"],
  lines: `
    fortress|fortresses|a large, strong building with walls, built to keep enemies out|要塞，堡垒|The soldiers hid inside the stone ___ when the enemy came.|The ___ on the hill had thick walls and a heavy gate.|No army could break into the mighty ___.|beacon,barrier
    beacon|beacons|a fire lit on a high place as a warning signal|烽火，信号火|When guards saw the enemy, they lit a ___ on the tower.|The ___ blazed on the hilltop so the next tower could see it.|One ___ after another was lit, all the way to the capital.|garrison,rampart
    watchtower|watchtowers|a tall tower where guards stand to look out for danger|瞭望塔，烽火台|A guard climbed the ___ to look across the desert.|From the top of the ___, you could see for miles.|Each ___ stood on a hill along the wall.|fortress,laborer
    rampart|ramparts|the wide top of a wall where soldiers can walk and fight|城墙，壁垒|Soldiers marched along the ___ of the city wall.|Archers stood on the ___ and looked down at the enemy.|The ___ was wide enough for five horses to walk side by side.|beacon,patrol
    laborer|laborers|a worker who does hard work with their hands|劳工，体力劳动者|Each ___ carried heavy stones up the mountain.|Every ___ on the wall worked from sunrise to sunset.|The tired ___ rested in the shade after a long day of digging.|invader,garrison
    invader|invaders|an enemy who comes into a land to take it|侵略者|The wall was built to keep out any ___ from the north.|One ___ tried to climb the wall at night.|The guards drove the ___ away from the gate.|laborer,patrol
    barrier|barriers|something that blocks the way|屏障，障碍物|The river was a natural ___ that the enemy could not cross.|A ___ of rocks blocked the road.|The wall made a long ___ across the mountains.|fortress,signal
    garrison|garrisons|a group of soldiers who live in a place to guard it|驻军，卫戍部队|A ___ of fifty soldiers lived at the fort.|The ___ guarded the gate day and night.|When the beacon was lit, the whole ___ ran to the wall.|barrier,watchtower
    signal|signals|a sound, light or sign that sends a message|信号|Smoke in the day was a ___ that the enemy was coming.|The guard waved a flag as a ___ to open the gate.|A loud drum was the ___ for the soldiers to gather.|barrier,rampart
    patrol|patrolled,patrols|to walk or ride around a place to guard it|巡逻|Soldiers would ___ the wall every night.|Guards on horses ___ along the border.|Two guards ___ the gate from dusk until dawn.|signal,invader
  `,
};

const thinking: Grade3Batch = {
  id: "words-for-thinking-and-wondering",
  title: t("Words for Thinking and Wondering", "表达思考与好奇的词"),
  summary: t(
    "Ten words for how we think: wonder, notice, imagine, suppose, puzzle, reason, wisdom and more.",
    "十个描述思考的词：wonder、notice、imagine、suppose、puzzle、reason、wisdom 等。",
  ),
  domain: ["thinking and wondering", "思考和好奇"],
  lines: `
    wonder|wondered,wonders|to ask yourself about something you want to know|想知道，好奇|I ___ why the sky is blue.|Do you ever ___ what is at the bottom of the sea?|The children began to ___ who had left the box on the step.|notice,respect
    notice|noticed,notices|to see or become aware of something|注意到|Did you ___ that the leaves are turning red?|I did not ___ the cat sitting on the roof until it meowed.|Good scientists ___ small changes.|imagine,decide
    imagine|imagined,imagines|to make a picture of something in your mind|想象|Close your eyes and ___ you are flying over the clouds.|Can you ___ life without electricity?|I like to ___ what my town looked like long ago.|notice,suppose
    explore|explored,explores|to travel around a place to learn about it|探索|We used flashlights to ___ the dark cave.|The children wanted to ___ every corner of the old castle.|Astronauts ___ space to learn about other planets.|decide,wonder
    suppose|supposed,supposes|to think that something is probably true|猜想，认为|I ___ the bus is late because of the snow.|Let us ___ that we had a million dollars; what would we buy?|I ___ you are hungry after that long walk.|explore,respect
    puzzle|puzzled,puzzles|to confuse someone and make them think hard|使困惑|Riddles ___ me, but I love trying to solve them.|The strange tracks in the snow began to ___ the hunters.|Does this math problem ___ you too?|reason,imagine
    reason|reasons|why something happens or why someone does something|原因，理由|The ___ the road is wet is that it rained last night.|Give one ___ why you like your favorite book.|What was the ___ for building the wall?|wisdom,puzzle
    decide|decided,decides|to make up your mind about something|决定|I cannot ___ whether to have pizza or pasta.|Let us flip a coin to ___ who goes first.|You must ___ which book you want to borrow.|wonder,explore
    wisdom|-|good sense and knowledge that come from experience|智慧|The old owl was known for its ___.|My grandmother has the ___ to give good advice.|People traveled far to hear the ___ of the teacher.|reason,respect
    respect|respected,respects|to think highly of someone and treat them well|尊重|We should ___ our elders and listen to them.|The players ___ their coach because she is fair.|I ___ people who tell the truth even when it is hard.|suppose,notice
  `,
};

const forces: Grade3Batch = {
  id: "words-of-forces-and-motion",
  title: t("Words of Forces and Motion", "力与运动的词汇"),
  summary: t(
    "Ten words for how things move: force, friction, motion, speed, direction, slope, ramp and more.",
    "十个描述物体运动的词：force、friction、motion、speed、direction、slope、ramp 等。",
  ),
  domain: ["forces and how things move", "力和物体的运动"],
  lines: `
    force|forces|a push or a pull|力|It takes a big ___ to push a heavy box across the floor.|Kicking a ball gives it a ___ that sends it flying.|Gravity is the ___ that pulls things down to the ground.|friction,weight
    friction|-|a force that slows things down when two surfaces rub together|摩擦力|The rough carpet makes ___ that slows the toy car.|There is less ___ on smooth ice, so we slide.|Rub your hands together, and ___ makes them warm.|motion,speed
    motion|-|the act of moving|运动，移动|The ball stayed in ___ until it hit the wall.|A push puts a swing in ___.|Everything on the busy street was in ___.|position,force
    speed|-|how fast something moves|速度|The car's ___ was very high on the steep hill.|A cheetah can run at great ___.|The wind's ___ grew stronger before the storm.|direction,weight
    direction|directions|the way something moves or points|方向|The wind changed ___ and blew from the north.|Push the cart in the ___ of the door.|The ball rolled in the ___ of the slope.|speed,position
    balanced|-|equal on both sides, so nothing moves|平衡的|When two teams pull a rope equally hard, the forces are ___.|The seesaw stayed still because it was ___.|The book on the table does not move because the forces on it are ___.|weight,motion
    weight|-|how heavy something is|重量|The ___ of the bag made my arms tired.|A scale shows the ___ of the apples.|The bridge can hold the ___ of ten trucks.|speed,force
    slope|slopes|a surface that is higher at one end than the other|斜坡|The sled raced down the snowy ___.|The ball rolled faster on a steep ___.|We pushed our bikes up the gentle ___.|position,motion
    ramp|ramps|a flat surface that goes up or down, used to move things between levels|坡道|The movers rolled the piano up a ___ into the truck.|We built a ___ from a board and some books to race toy cars.|A wheelchair can go up the ___ at the side of the building.|position,motion
    position|positions|the place where something is|位置|Mark the car's starting ___ with tape.|Move the magnet to a new ___ and see what happens.|After the ball rolled, its ___ was two meters from the start.|direction,motion
  `,
};

const magnets: Grade3Batch = {
  id: "words-of-magnets",
  title: t("Words of Magnets", "磁铁的词汇"),
  summary: t(
    "Ten words of magnets and what they do: magnet, attract, repel, pole, iron, steel, field, static and more.",
    "十个关于磁铁的词：magnet、attract、repel、pole、iron、steel、field、static 等。",
  ),
  domain: ["magnets", "磁铁"],
  lines: `
    magnet|magnets|a piece of metal that pulls iron and steel toward it|磁铁|The ___ picked up a pile of paper clips.|We stuck our drawing to the fridge with a ___.|A ___ has a north end and a south end.|steel,pole
    magnetic|-|able to be pulled by a magnet, or able to pull like one|有磁性的|Iron nails are ___, so the magnet pulls them.|Wood is not ___, so the magnet does nothing to it.|The fridge door is ___, so magnets stick to it.|invisible,static
    attract|attracted,attracts|to pull something toward itself|吸引|A magnet will ___ an iron nail.|Opposite poles of two magnets ___ each other.|Flowers ___ bees with their bright colors.|repel,field
    repel|repels|to push something away|排斥|Two north poles of magnets ___ each other.|If you turn one magnet around, they will ___ instead of stick.|These two magnets ___, so I cannot push them together.|attract,pole
    pole|poles|one of the two ends of a magnet, where its pull is strongest|磁极|The magnet's pull is strongest at each ___, its two ends.|The paper clips gathered at each ___ of the magnet.|Paint the north ___ of the magnet red and the south end blue.|field,iron
    iron|-|a strong gray metal that magnets attract|铁|A magnet picks up nails made of ___.|The old gate was made of ___ and had turned rusty.|Not all metals are like ___; magnets do not pull copper.|steel,magnet
    steel|-|a very strong metal made mostly from iron|钢|Cars and bridges are made of ___.|The ___ spoon stuck to the magnet.|A ___ beam holds up the roof of the building.|iron,pole
    field|fields|the space around a magnet where you can feel its push or pull|磁场|The magnet's ___ is strongest close to its ends.|Iron dust lines up in the ___ around a magnet.|You cannot see a magnet's ___, but you can see what it does.|pole,steel
    static|-|electricity that builds up when things rub together|静电|After I rubbed the balloon on my hair, ___ made it stick to the wall.|When I took off my wool hat, ___ made my hair stand up.|You can hear the crackle of ___ when you pull off a sweater.|magnetic,invisible
    invisible|-|not able to be seen|看不见的|Air is ___, but you can feel it when the wind blows.|The pull of a magnet is ___.|The spy wrote a message in ___ ink.|static,magnetic
  `,
};

const explaining: Grade3Batch = {
  id: "words-for-explaining-how",
  title: t("Words for Explaining How", "解释原理的词"),
  summary: t(
    "Ten words for explaining how things work: depend, connect, contain, combine, prevent, release, observe and more.",
    "十个用来解释事物原理的词：depend、connect、contain、combine、prevent、release、observe 等。",
  ),
  domain: ["explaining how things work", "解释事物的原理"],
  lines: `
    depend|depended,depends|to need something in order to work or happen|依靠，取决于|Plants ___ on sunlight to make their food.|Whether we play outside will ___ on the weather.|Baby birds ___ on their parents for food.|contain,observe
    connect|connected,connects|to join two things together|连接|If you ___ the wire to the battery, the bulb lights up.|A bridge will ___ the two sides of the river.|Use tape to ___ the two pieces of the track.|separate,release
    contain|contained,contains|to have something inside|包含，容纳|This box will ___ all of our toys.|Oranges ___ a lot of juice.|Rain clouds ___ tiny drops of water.|combine,prevent
    combine|combined,combines|to mix or join things together into one|结合，混合|We ___ flour, eggs and milk to make pancake batter.|When you ___ blue and yellow paint, you get green.|The two classes will ___ for the school play.|separate,depend
    separate|separated,separates|to move things apart from each other|分开|Use a magnet to ___ the nails from the sand.|A fence will ___ the sheep from the goats.|Always ___ the white clothes from the dark ones before washing.|combine,connect
    prevent|prevented,prevents|to stop something from happening|防止，阻止|A helmet can ___ injuries when you fall off a bike.|Brushing your teeth helps ___ holes in them.|Put a lid on the pot to ___ the soup from spilling.|allow,release
    allow|allowed,allows|to let something happen|允许|Our teacher will ___ us to play outside if it is sunny.|The gate is open to ___ the cows into the field.|Big windows ___ more light into the room.|prevent,contain
    release|released,releases|to let something go free|释放，放开|If you ___ the balloon, it will float up into the sky.|The zookeepers will ___ the healed bird back into the wild.|When you ___ the spring, the toy jumps.|connect,prevent
    pattern|patterns|something that happens again and again in the same way|规律，模式|Day and night follow a ___ that never changes.|Do you see the ___ in these numbers: 2, 4, 6, 8?|The stripes on a zebra make a black-and-white ___.|observe,depend
    observe|observed,observes|to watch something carefully to learn about it|观察|Scientists ___ the birds to learn how they build nests.|Sit quietly and ___ the ice cube as it melts.|We will ___ the moon every night for a month.|pattern,allow
  `,
};

const music: Grade3Batch = {
  id: "words-of-music",
  title: t("Words of Music", "音乐的词汇"),
  summary: t(
    "Ten words of making music: rhythm, melody, tempo, pitch, orchestra, conductor, composer, harmony and more.",
    "十个关于音乐的词：rhythm、melody、tempo、pitch、orchestra、conductor、composer、harmony 等。",
  ),
  domain: ["music", "音乐"],
  lines: `
    rhythm|rhythms|the pattern of long and short sounds and beats in music|节奏|Clap your hands to the ___ of the song.|The drums kept a steady ___ for the dancers.|The drums tapped out a ___ of long and short beats.|melody,pitch
    melody|melodies|the tune of a song, the notes you can hum|旋律|I can hum the ___ but I cannot remember the words.|The violin played a sweet ___.|The ___ goes up and down like a bird flying.|rhythm,harmony
    tempo|-|how fast or slow music is played|速度，节拍快慢|The song starts slow, then the ___ speeds up.|A lullaby has a slow ___.|The conductor waved her arms faster to change the ___.|pitch,duet
    pitch|-|how high or low a sound is|音高|A tiny bird sings at a very high ___.|The tuba plays notes of a low ___.|When you tighten a guitar string, its ___ goes up.|tempo,rhythm
    orchestra|orchestras|a large group of musicians who play together, with many kinds of instruments|管弦乐队|The ___ had violins, flutes, drums and trumpets.|We went to hear the city ___ play on Saturday night.|More than eighty musicians play in the ___.|composer,duet
    conductor|conductors|the person who leads a group of musicians by moving their hands or a stick|指挥|The ___ raised her stick, and the music began.|Every musician watched the ___ to know when to play.|The ___ stood in front of the musicians and waved a thin stick.|composer,orchestra
    composer|composers|a person who writes music|作曲家|Mozart was a ___ who wrote his first music at age five.|The ___ wrote a new song for the school's birthday.|A ___ writes notes on paper for musicians to play.|conductor,percussion
    harmony|harmonies|different notes sung or played together in a way that sounds good|和声，和谐|The choir sang in beautiful ___.|When my sister sings the high part and I sing the low part, we make ___.|Two singers sang the song in ___.|melody,tempo
    percussion|-|instruments you hit or shake to make sound, such as drums|打击乐器|Drums, bells and maracas are ___ instruments.|Tom plays in the ___ section of the band.|The ___ players kept the beat with their drums.|harmony,orchestra
    duet|duets|music for two people to play or sing together|二重奏，二重唱|My sister and I played a ___ on the piano.|The two friends sang a ___ at the talent show.|A ___ needs two singers or players.|orchestra,melody
  `,
};

const instruments: Grade3Batch = {
  id: "words-of-instrument-families",
  title: t("Words of Instrument Families", "乐器家族的词汇"),
  summary: t(
    "Ten words of instruments and their families: string, brass, woodwind, violin, cello, flute, trumpet, harp and more.",
    "十个乐器及其家族的词：string、brass、woodwind、violin、cello、flute、trumpet、harp 等。",
  ),
  domain: ["musical instruments", "乐器"],
  lines: `
    string|strings|a thin wire or cord on an instrument that makes sound when plucked or played with a bow|（乐器的）弦|Guitars and violins belong to the ___ family.|When you pluck a guitar ___, it shakes and makes a sound.|My violin has a broken ___, so I cannot play it today.|brass,woodwind
    brass|-|the family of metal instruments you blow into, such as trumpets|铜管乐器|The trumpet and the tuba are ___ instruments.|The ___ players puffed out their cheeks to play the loud march.|Shiny ___ instruments are made of metal.|string,keyboard
    woodwind|woodwinds|the family of instruments you blow into that use a small hole or a reed, such as the flute|木管乐器|The flute and the clarinet are ___ instruments.|The ___ section sits in front of the brass in the orchestra.|A ___ instrument makes sound when you blow air across a hole or a reed.|brass,string
    keyboard|keyboards|a row of keys that you press to play an instrument such as a piano|键盘（乐器）|A piano has a ___ of black and white keys.|I play songs on the ___ in my bedroom.|Press a key on the ___ to hear a note.|string,harp
    violin|violins|a small wooden string instrument held under the chin and played with a bow|小提琴|She held the ___ under her chin and moved the bow.|The ___ is the smallest string instrument in the orchestra.|Grandpa tucked his ___ under his chin and began to play a jig.|cello,flute
    cello|cellos|a large string instrument that you play sitting down, with it between your knees|大提琴|The ___ is too big to hold under your chin, so you sit to play it.|The deep, warm notes of the ___ filled the room.|She rested the ___ between her knees and drew the bow across it.|violin,trumpet
    flute|flutes|a long, thin woodwind instrument held sideways that you blow across|长笛|She blew across the hole of the silver ___ to play a high note.|The thin, silver ___ played a soft, high tune like a bird.|You hold a ___ sideways when you play it.|trumpet,cello
    trumpet|trumpets|a brass instrument with three buttons that makes a loud, bright sound|小号|The ___ played a loud call to wake the soldiers.|He pressed the three buttons of the ___ to change the notes.|A bright ___ blast began the parade.|flute,violin
    xylophone|xylophones|an instrument with wooden bars that you hit with small hammers|木琴|She hit the wooden bars of the ___ with two little hammers.|The ___ made a bright, plinking sound.|Each bar on the ___ plays a different note.|harp,keyboard
    harp|harps|a large instrument with many strings in a tall frame that you pluck with your fingers|竖琴|The ___ has more than forty strings in a tall frame.|Her fingers plucked the strings of the ___ gently.|She sat beside the tall ___ and plucked its strings.|xylophone,keyboard
  `,
};

const describingMusic: Grade3Batch = {
  id: "words-for-describing-music",
  title: t("Words for Describing Music", "描述音乐的词"),
  summary: t(
    "Ten words for how music sounds and feels: lively, graceful, mournful, booming, soothing, shrill, delicate and more.",
    "十个描述音乐声音和感觉的词：lively、graceful、mournful、booming、soothing、shrill、delicate 等。",
  ),
  domain: ["how music sounds and feels", "音乐的声音和感觉"],
  lines: `
    lively|-|full of energy and fun|活泼的，轻快的|The band played a ___ tune that made everyone dance.|The party music was fast and ___.|A ___ song is perfect for a sunny morning.|mournful,peaceful
    graceful|-|moving or sounding smooth and beautiful|优雅的|The ballet music was soft and ___.|The swan glided across the lake in a ___ way.|The dancer's ___ steps matched the gentle music.|shrill,booming
    mournful|-|very sad|悲伤的，哀伤的|The ___ song made my grandmother cry.|The ___ tune was so sad that everyone looked at the floor.|The wolf gave a long, ___ howl at the moon.|lively,dramatic
    booming|-|very loud and deep|轰鸣的，低沉响亮的|The ___ drums shook the floor of the hall.|We heard the ___ voice of the giant from far away.|The ___ thunder made the windows rattle.|delicate,soothing
    soothing|-|making you feel calm and relaxed|舒缓的，抚慰的|Mom sang a ___ song to help the baby sleep.|The sound of rain on the roof is ___.|A warm bath and ___ music help me relax.|shrill,dramatic
    steady|-|staying the same, without stopping or changing|稳定的，平稳的|The drummer kept a ___ beat all through the song.|My heart beat in a slow, ___ rhythm.|The clock made a ___ tick-tock all night.|dramatic,graceful
    dramatic|-|exciting and full of strong feeling|戏剧性的，激动人心的|The music grew loud and ___ as the hero raced to the castle.|There was a ___ crash of cymbals at the end.|The movie had ___ music during the chase.|steady,peaceful
    peaceful|-|quiet and calm|宁静的，平和的|The ___ music sounded like a quiet lake at dawn.|After the storm, the forest was ___ again.|We sat by the river on a ___ afternoon.|lively,booming
    shrill|-|very high and sharp in a way that hurts your ears|尖锐刺耳的|The ___ whistle made the dogs bark.|The baby let out a ___ cry.|A ___ alarm rang through the school.|soothing,graceful
    delicate|-|light, soft and easily broken|轻柔的，精致的|The harp played a ___ tune that was almost a whisper.|A ___ snowflake melted on my glove.|The ___ notes of the music box tinkled softly.|booming,mournful
  `,
};

const performing: Grade3Batch = {
  id: "words-for-performing",
  title: t("Words for Performing", "表达表演的词"),
  summary: t(
    "Ten words for being on stage: perform, audience, applaud, talent, confident, solo, festival and more.",
    "十个关于登台表演的词：perform、audience、applaud、talent、confident、solo、festival 等。",
  ),
  domain: ["performing for others", "为他人表演"],
  lines: `
    perform|performed,performs|to sing, dance, act or play music for people to watch|表演|Our class will ___ a play for the parents on Friday.|The band will ___ three songs at the fair.|Clowns ___ tricks in the circus ring.|applaud,admire
    audience|audiences|the people who watch or listen to a show|观众，听众|The ___ laughed at the funny puppet show.|There were three hundred people in the ___.|The singer waved to the ___ before she began.|talent,festival
    applaud|applauded,applauds|to clap your hands to show you liked something|鼓掌|The crowd will ___ loudly at the end of the show.|Please ___ for our wonderful dancers!|We stood up to ___ the orchestra.|perform,entertain
    talent|talents|a natural skill at doing something well|天赋，才能|Maya has a ___ for drawing animals.|The school is holding a ___ show next week.|Singing is his special ___.|effort,audience
    confident|-|sure that you can do something well|自信的|After weeks of practice, Leo felt ___ about his speech.|The ___ dancer smiled as she walked on stage.|Be ___ and speak loudly so everyone can hear you.|solo,talent
    solo|solos|a song or piece of music performed by one person alone|独唱，独奏|Mei sang a ___ while the rest of the choir listened.|In the middle of the song, the guitarist played a ___.|He was nervous because the ___ meant he would be alone on stage.|talent,festival
    admire|admired,admires|to like and respect someone or something very much|钦佩，欣赏|I ___ my sister because she practices piano every day.|People ___ the painting for its bright colors.|We ___ how brave the firefighters are.|applaud,entertain
    entertain|entertained,entertains|to keep people happy and interested with a show or game|使娱乐，招待|The magician will ___ the children at the party.|Grandpa likes to ___ us with funny stories.|Street musicians ___ people walking in the park.|perform,admire
    festival|festivals|a special time or event with music, food and fun|节日，庆典，音乐节|Our town holds a music ___ every summer in the park.|At the spring ___, there were dancers, food stalls and fireworks.|The kite ___ fills the sky with colors every April.|audience,solo
    effort|efforts|hard work you put into trying to do something|努力|She practiced every day, and her hard ___ paid off.|She made a great ___ to finish the race.|The play was a success because of everyone's ___.|talent,confident
  `,
};

const poetry: Grade3Batch = {
  id: "words-of-poetry",
  title: t("Words of Poetry", "诗歌的词汇"),
  summary: t(
    "Ten words of poems and their sounds: rhyme, verse, poet, limerick, syllable, repetition, riddle and more.",
    "十个关于诗歌及其声音的词：rhyme、verse、poet、limerick、syllable、repetition、riddle 等。",
  ),
  domain: ["poems and their sounds", "诗歌及其声音"],
  lines: `
    rhyme|rhymes|a word that ends with the same sound as another, like "cat" and "hat"|押韵的词|"Moon" is a ___ for "spoon."|Can you think of a ___ for "tree"?|The poet chose "night" as a ___ for "bright."|verse,syllable
    verse|verses|a group of lines in a song or poem|（诗或歌的）节，段|We sang the first ___ of the song and then the chorus.|Each ___ of the poem tells about a different season.|The last ___ of the song is the saddest part.|rhyme,chant
    poet|poets|a person who writes poems|诗人|The ___ wrote a poem about the sea.|Our class met a ___ who read her poems aloud.|A ___ chooses each word carefully.|riddle,lullaby
    limerick|limericks|a funny poem of five lines with a bouncy rhythm|五行打油诗|A ___ is a funny poem with five lines.|"There was an old man with a beard" is the start of a famous ___.|We laughed at the silly ___ about a cat who could fly.|lullaby,riddle
    syllable|syllables|one beat of a word, a part you can clap|音节|"Cat" has one ___, but "kitten" has two.|Clap once for each ___ when you say your name.|The word "but" is just one ___.|rhyme,verse
    repetition|-|saying the same word or line again and again|重复|The ___ of "Rain, rain, rain" makes the poem sound like falling drops.|Poets use ___ to make important words stand out.|There is ___ in the song because every verse ends with "Go to sleep."|syllable,chant
    recite|recited,recites|to say a poem or text aloud from memory|背诵|Each child will ___ a poem in front of the class.|Can you ___ the poem without looking at the page?|Grandpa can still ___ the poems he learned at school.|riddle,verse
    riddle|riddles|a question or poem with a tricky answer you have to guess|谜语|Here is a ___: what has hands but cannot clap? A clock!|The ___ was so hard that nobody could guess the answer.|My brother told me a ___ about an egg.|limerick,poet
    lullaby|lullabies|a soft, gentle song sung to help a baby sleep|摇篮曲|Mom sang a ___ to the baby at bedtime.|The soft ___ made the baby close her eyes.|"Rock-a-bye Baby" is a famous ___.|limerick,chant
    chant|chants|words said or sung together again and again with a strong beat|有节奏的反复吟唱|The fans shouted a ___ to cheer on their team.|The children clapped as they said the jump-rope ___.|"We will win! We will win!" was the team's ___.|lullaby,verse
  `,
};

const seasons: Grade3Batch = {
  id: "words-for-seasons-and-senses",
  title: t("Words for Seasons and Senses", "表达季节与感官的词"),
  summary: t(
    "Ten words for what we see, hear and feel through the year: autumn, blossom, thaw, dew, wither, rustle, crisp and more.",
    "十个描述一年中所见所闻所感的词：autumn、blossom、thaw、dew、wither、rustle、crisp 等。",
  ),
  domain: ["the seasons and the senses", "季节和感官"],
  lines: `
    autumn|-|the season after summer when leaves fall; also called fall|秋天|In ___, the leaves turn red and gold.|We pick apples in ___, after the hot summer is over.|The days get shorter in ___.|blossom,thaw
    blossom|blossoms|a flower, especially on a fruit tree|（果树的）花|A pink ___ opened on the cherry tree.|Each apple ___ will become an apple in the fall.|The bee landed on a white ___.|dew,autumn
    thaw|thawed,thaws|to melt and become soft after being frozen|融化，解冻|In spring, the frozen lake begins to ___.|Leave the frozen bread out to ___ before lunch.|When the snow starts to ___, the streets are full of slush.|wither,drift
    dew|-|small drops of water that form on grass at night|露水|In the morning, ___ covered the grass in tiny drops.|My shoes got wet from the ___ on the lawn.|A spider's web sparkled with ___ at sunrise.|blossom,bloom
    bloom|bloomed,blooms|to open into flowers|开花|Tulips ___ in early spring.|The roses will ___ in June.|The cactus will ___ only once a year.|wither,thaw
    wither|withered,withers|to dry up and die|枯萎|Flowers will ___ if you forget to water them.|In the hot summer, the grass began to ___.|The leaves ___ and turn brown in the fall.|bloom,glisten
    glisten|glistened,glistens|to shine because it is wet|（湿物）闪光，闪亮|The wet streets ___ under the lights.|After the rain, the leaves ___ in the sun.|Drops of dew ___ on the spider's web.|rustle,drift
    rustle|rustled,rustles|to make soft, dry sounds like leaves moving|沙沙作响|The dry leaves ___ under our feet.|We heard something ___ in the bushes.|Papers ___ when the wind blows through the window.|glisten,crisp
    crisp|-|cool and fresh, or dry and easy to break with a snap|清新凉爽的，脆的|We went for a walk in the ___ autumn air.|The ___ leaves crunched under my boots.|A ___ apple makes a loud crunch when you bite it.|drift,dew
    drift|drifted,drifts|to move slowly, carried by wind or water|漂流，飘|Snowflakes ___ slowly to the ground.|The little boat began to ___ down the river.|Clouds ___ across the sky on a windy day.|rustle,thaw
  `,
};

const soundsAndLight: Grade3Batch = {
  id: "sensory-words",
  title: t("Words for Sounds and Light", "表达声音与光亮的词"),
  summary: t(
    "Ten words that help readers hear and see: shimmer, gleam, crackle, murmur, whisper, rumble, flicker and more.",
    "十个让读者听到、看到的词：shimmer、gleam、crackle、murmur、whisper、rumble、flicker 等。",
  ),
  domain: ["sounds and light", "声音和光亮"],
  lines: `
    shimmer|shimmered,shimmers|to shine with a soft light that seems to shake|闪烁，发出微光|The lake will ___ in the moonlight.|Heat made the road ___ on the summer day.|Her silver dress seemed to ___ as she danced.|crackle,murmur
    gleam|gleamed,gleams|to shine brightly, often because something is clean or polished|闪闪发光|The new car will ___ in the sunlight.|Polish the spoons until they ___.|The cat's eyes ___ in the dark.|rumble,whisper
    crackle|crackled,crackles|to make lots of small, sharp snapping sounds|噼啪作响|The logs ___ in the fireplace.|The radio began to ___ and buzz.|Dry twigs ___ when you step on them.|shimmer,glow
    murmur|murmured,murmurs|to make a soft, low sound that is hard to hear clearly|低语，潺潺声|We could hear the stream ___ over the stones.|The crowd began to ___ when the lights went out.|Bees ___ softly in the clover.|rattle,gleam
    whisper|whispered,whispers|to speak very quietly|低声说，耳语|Please ___ in the library so others can read.|I heard my friend ___ a secret in my ear.|The wind seemed to ___ through the pine trees.|rumble,sparkle
    sparkle|sparkled,sparkles|to shine with many small flashes of light|闪耀，发光|Stars ___ in the night sky.|The snow will ___ in the sun tomorrow.|Diamonds ___ when light shines on them.|rattle,murmur
    rumble|rumbled,rumbles|to make a long, low, deep sound|隆隆作响|We heard the thunder ___ far away.|My stomach began to ___ before lunch.|Trucks ___ past our house all night.|whisper,flicker
    glow|glowed,glows|to give off a steady, soft light|发出柔和的光|The night-light will ___ softly in the dark.|Fireflies ___ in the summer evening.|Hot coals ___ red in the fire.|crackle,rattle
    flicker|flickered,flickers|to shine on and off in a quick, unsteady way|闪烁不定，忽明忽暗|The candle will ___ in the breeze.|The lights began to ___ during the storm.|Shadows ___ on the walls by the campfire.|gleam,whisper
    rattle|rattled,rattles|to make quick knocking sounds when shaken|发出咔嗒声|The windows ___ when the wind blows hard.|Shake the box and listen to the beads ___.|The old car will ___ over the bumpy road.|glow,shimmer
  `,
};

/** batchesB are the vocabulary batches of the last five units of grade 3. */
export const batchesB: readonly Grade3Batch[] = [
  riverKingdom,
  ancientLife,
  timeLongAgo,
  ancientChina,
  walls,
  thinking,
  forces,
  magnets,
  explaining,
  music,
  instruments,
  describingMusic,
  performing,
  poetry,
  seasons,
  soundsAndLight,
];
