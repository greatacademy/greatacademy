// Grade 10: the batches of words of eating, of looking, of tiredness, of the odd and the dull, of danger, of
// natural disasters, of wrecking and of blunders.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const eating = batch(
  "words-of-eating-and-hunger",
  ["Words of Eating and Hunger", "进食与饥饿的词"],
  ["eating fast or slowly, enjoying food and being hungry", "狼吞虎咽或细嚼慢咽、享受食物与饥饿"],
  `
  devour|to eat hungrily or quickly; to read eagerly|吞食；如饥似渴地读|The lions began to ___ their prey.|She would ___ every book she found.|Watch the boys ___ the pizza.|gobble,savor|devoured
  gobble|to eat hurriedly and noisily|狼吞虎咽|Don't ___ your food.|The kids began to ___ the cake.|Turkeys ___ loudly.|munch,nibble|gobbled
  munch|to eat steadily and often noisily|大声咀嚼|The horse began to ___ the hay.|They ___ popcorn at the movies.|She likes to ___ on carrots.|gobble,nibble|munched
  nibble|to take small bites|小口咬|The mouse began to ___ the cheese.|She would only ___ at her lunch.|Fish ___ the bait.|munch,morsel|nibbled
  savor|to enjoy food or an experience slowly|品味|___ every bite.|She paused to ___ the moment.|He liked to ___ the smell of coffee.|relish,devour|savored
  relish|great enjoyment; to enjoy greatly; a sauce|享受；佐料|She would ___ a good fight.|He ate with ___.|Put some ___ on your hot dog.|savor,appetite|relished
  appetite|a natural desire to eat; a strong wish|食欲；欲望|Exercise gives you an ___.|She has an ___ for adventure.|Illness may spoil your ___.|relish,famished|appetites
  famished|extremely hungry|饿极了的|After the hike we were ___.|The ___ dogs ate fast.|I'm ___; what's for dinner?|appetite,nourish|
  nourish|to provide food needed for growth; to keep a feeling alive|滋养；怀有|Milk will ___ the calf.|Good books ___ the mind.|She would ___ a hope of return.|famished,morsel|nourished,nourishing,nourishment
  morsel|a small piece of food|一小块(食物)|He gave the dog a ___ of meat.|Not a ___ was left.|She ate every ___.|nibble,nourish|morsels
  `,
);

const looking = batch(
  "words-of-looking",
  ["Words of Looking", "看的词"],
  ["quick looks, long looks, narrowed eyes and bright lights", "瞥一眼、凝视、眯眼与耀眼的光"],
  `
  glimpse|a brief look; to see briefly|一瞥；瞥见|I caught a ___ of the star.|She managed to ___ the sea from the train.|We had a ___ of the future.|glance,gaze|glimpsed
  glance|to take a brief look; a brief look|扫视；一瞥|___ at the clock.|She gave him a quick ___.|He would ___ over his shoulder.|glimpse,stare|glanced
  gaze|to look steadily for a long time; a steady look|凝视|They ___ at the stars.|She met his ___.|He would ___ out of the window.|stare,peer|gazed
  stare|to look fixedly with wide eyes|盯着看|Don't ___ at strangers.|She gave him a cold ___.|The kids began to ___ at the clown.|gaze,gape|stared
  gape|to stare with the mouth open in surprise; to be wide open|目瞪口呆；裂开|Tourists ___ at the huge tower.|Don't just stand and ___.|A wound may ___ open.|stare,squint|gaped,gaping
  peer|to look closely or with difficulty; a person of the same age or status|仔细看；同龄人|She had to ___ into the dark.|He was liked by his ___ group.|They ___ through the fog.|squint,gaze|peered,peers
  squint|to look with partly closed eyes|眯眼看|The sun made us ___.|She had to ___ to read the sign.|Don't ___; wear your glasses.|peer,blink|squinted
  blink|to shut and open the eyes quickly|眨眼|Try not to ___.|In the bright light he began to ___.|It was over in the ___ of an eye.|squint,twinkle|blinked
  twinkle|to shine with a flickering light; a bright sparkle in the eye|闪烁|Stars ___ at night.|There was a ___ in her eye.|City lights ___ below.|dazzle,blink|twinkled,twinkling
  dazzle|to blind with bright light; to amaze|使目眩；使惊叹|Headlights may ___ drivers.|Her skill will ___ the judges.|The snow seemed to ___ us.|twinkle,glimpse|dazzled
  `,
);

const tiredness = batch(
  "words-of-tiredness-and-sleep",
  ["Words of Tiredness and Sleep", "疲倦与睡眠的词"],
  ["being sleepy, worn out, half awake and asleep", "困倦、疲惫、半醒与熟睡"],
  `
  drowsy|sleepy and lethargic|昏昏欲睡的|The pills may make you ___.|A warm room makes me ___.|The ___ child yawned.|groggy,weary|drowsiness
  groggy|dazed and weak, especially after sleep or illness|头昏眼花的|I felt ___ after the flight.|She woke up ___.|The drug left him ___.|drowsy,haggard|
  weary|feeling or showing extreme tiredness|疲倦的|The ___ travelers sat down.|She grew ___ of his excuses.|He gave a ___ smile.|exhausted,drowsy|wearily,weariness
  exhausted|very tired; completely used up|筋疲力尽的；耗尽的|We were ___ after the race.|Our supplies were ___.|The ___ runner fell.|weary,fatigue|exhausting,exhaustion
  fatigue|extreme tiredness|疲劳|Long hours cause ___.|She was suffering from ___.|Metal ___ caused the crash.|exhausted,lull|
  haggard|looking exhausted and unwell|憔悴的|He looked ___ after the night shift.|Her face was ___ with worry.|The ___ soldiers marched home.|groggy,weary|
  doze|to sleep lightly|打瞌睡|Grandpa began to ___ in his chair.|I tend to ___ off in class.|She had a short ___.|snooze,slumber|dozed
  snooze|a short light sleep; to sleep briefly|小睡|Hit the ___ button.|The cat likes to ___ in the sun.|He took a ___ after lunch.|doze,lull|snoozed
  slumber|sleep; to sleep|睡眠|The town lay in ___.|The baby continued to ___.|She fell into a deep ___.|doze,fatigue|slumbered
  lull|a quiet period; to calm or send to sleep|间歇；使入睡|There was a ___ in the storm.|Music may ___ the baby.|Don't let the calm ___ you.|slumber,snooze|lulled
  `,
);

const odd = batch(
  "words-of-the-odd-and-the-dull",
  ["Words of the Odd and the Dull", "怪异与乏味的词"],
  ["strange people and things, boring days and bright life", "奇人奇事、乏味的日子与生气勃勃"],
  `
  odd|strange or unusual; not even|奇怪的；奇数的|That's an ___ thing to say.|Three is an ___ number.|He had an ___ habit.|bizarre,quaint|oddly,oddity
  bizarre|very strange or unusual|离奇的|It was a ___ dream.|She wore a ___ hat.|The story was ___.|odd,eccentric|bizarrely
  eccentric|unconventional and slightly strange|古怪的|My uncle is a bit ___.|The ___ artist lived alone.|He had ___ habits.|bizarre,quaint|eccentricity
  quaint|attractively unusual or old-fashioned|古色古香的|We stayed in a ___ village.|What a ___ old shop.|They had a ___ custom.|eccentric,lofty|
  lofty|of imposing height; noble; proud|高耸的；崇高的；傲慢的|___ mountains rose above us.|She had ___ ideals.|He spoke in a ___ tone.|vibrant,quaint|
  vibrant|full of energy and life; bright|充满活力的；鲜艳的|The city has a ___ night life.|She wore ___ colors.|He is a ___ young man.|lofty,drab|vibrancy
  drab|dull and lacking color|单调的|The room was ___ and gray.|She wore a ___ coat.|Life seemed ___.|dreary,vibrant|
  dreary|dull, bleak and lifeless|沉闷的|It was a ___ winter day.|He gave a ___ speech.|The town looked ___.|drab,dismal|
  dismal|depressing; very bad|阴郁的；差劲的|The weather was ___.|The team gave a ___ show.|Sales were ___.|dreary,monotonous|dismally
  monotonous|dull, tedious and repetitious|单调乏味的|The work was ___.|He spoke in a ___ voice.|The ___ road went on.|dismal,drab|monotony
  `,
);

const danger = batch(
  "words-of-danger-and-threats",
  ["Words of Danger and Threats", "危险与威胁的词"],
  ["risk, harm about to happen and hard spots", "风险、迫在眉睫的伤害与困境"],
  `
  imminent|about to happen|迫在眉睫的|A storm is ___.|They were in ___ danger.|The ___ arrival of guests.|brink,menace|
  brink|the edge of a steep place; the point at which something is about to happen|边缘|The nation was on the ___ of war.|She stood on the ___ of the cliff.|The firm is on the ___ of ruin.|imminent,plight|
  jeopardy|danger of loss or harm|危险|Lives were in ___.|The deal is in ___.|His job is now in ___.|plight,menace|jeopardize
  menace|a person or thing that is likely to cause harm; a threat|威胁，祸害|That dog is a ___.|There was ___ in his voice.|Litter is a ___ to wildlife.|jeopardy,threaten|menaced,menacing
  plight|a dangerous, difficult or unfortunate situation|困境|The ___ of the refugees.|We read of their ___.|Few noticed the ___ of the poor.|jeopardy,brink|
  threaten|to say one will cause harm; to be likely to harm|威胁|Don't ___ me.|Floods ___ the town.|Rain may ___ the match.|endanger,menace|threatening
  endanger|to put someone or something at risk|危及|Smoking will ___ your health.|Don't ___ the lives of others.|Pollution may ___ the fish.|threaten,unsafe|
  hazardous|risky; dangerous|有危险的|Smoking is ___ to health.|The roads are ___.|Store ___ waste carefully.|risky,unsafe|
  risky|full of the possibility of danger or failure|有风险的|It is ___ to invest it all.|That was a ___ move.|Climbing alone is ___.|hazardous,imminent|riskier,riskiest
  unsafe|not safe; dangerous|不安全的|The bridge is ___.|It is ___ to swim here.|The house was declared ___.|risky,endanger|
  `,
);

const disasters = batch(
  "words-of-natural-disasters",
  ["Words of Natural Disasters", "自然灾害的词"],
  ["storms, floods, sliding earth, volcanoes and drowning", "风暴、洪水、山体滑坡、火山与溺水"],
  `
  hurricane|a violent storm with very strong wind|飓风|The ___ hit the coast.|Shops closed before the ___.|A ___ season is coming.|avalanche,torrent|
  avalanche|a mass of snow falling down a mountain; a sudden large amount|雪崩；大量涌来|An ___ buried the skiers.|We got an ___ of letters.|The ___ blocked the pass.|landslide,deluge|avalanches
  landslide|a collapse of a mass of earth or rock; an overwhelming victory|山体滑坡；压倒性胜利|A ___ closed the road.|She won by a ___.|Rain caused a ___.|mudslide,avalanche|landslides
  mudslide|a mass of mud sliding down a slope|泥石流|The ___ swept away homes.|Heavy rains cause a ___.|A ___ blocked the river.|landslide,torrent|mudslides
  torrent|a strong and fast stream of water; an outpouring|激流；连续不断|The river became a ___.|She let out a ___ of abuse.|Rain fell in a ___.|deluge,hurricane|torrents
  deluge|a severe flood; a great quantity of something arriving at once|洪水；大量|The ___ ruined the crops.|We had a ___ of calls.|A ___ fell from the sky.|torrent,engulf|deluged
  engulf|to sweep over so as to surround or swallow completely|吞没|Flames began to ___ the house.|Waves may ___ the boat.|Panic seemed to ___ the crowd.|drown,deluge|engulfed
  drown|to die under water; to make a sound inaudible|淹死；淹没|Many people ___ in the flood.|Music may ___ out the noise.|She was afraid she would ___.|engulf,erupt|drowned,drowning
  erupt|to burst out suddenly, as a volcano or violence|喷发；爆发|The volcano may ___ again.|Fighting began to ___.|The crowd will ___ in cheers.|quake,drown|erupted
  quake|an earthquake; to shake or tremble|地震；颤抖|The ___ shook the city.|She began to ___ with fear.|Buildings fell in the ___.|erupt,landslide|quaked
  `,
);

const wrecking = batch(
  "words-of-wrecking-and-remains",
  ["Words of Wrecking and Remains", "毁坏与残余的词"],
  ["breaking down, wiping out and what is left", "拆毁、根除与残留物"],
  `
  demolish|to pull or knock down a building; to destroy|拆除；推翻|They will ___ the old school.|She managed to ___ his argument.|Workers ___ the bridge.|dismantle,shatter|demolished,demolition
  dismantle|to take apart|拆开|He chose to ___ the engine.|We had to ___ the tent.|The state tried to ___ the union.|demolish,salvage|dismantled
  shatter|to break suddenly into pieces; to damage badly|粉碎|The glass will ___.|The news may ___ her hopes.|A stone can ___ the window.|demolish,ruin|shattered,shattering
  ruin|to destroy; the remains of a building|毁坏；废墟|Rain may ___ the picnic.|The castle is now a ___.|Don't ___ your shoes.|shatter,wreckage|ruined,ruinous
  eradicate|to destroy completely; to put an end to|根除|We must ___ the disease.|They tried to ___ poverty.|Weeds are hard to ___.|demolish,dismantle|eradicated,eradication
  rubble|broken fragments of stone or brick|瓦砾|The house was reduced to ___.|They dug through the ___.|Piles of ___ lay in the street.|wreckage,remnant|
  wreckage|the remains of something badly damaged|残骸|They searched the ___ for survivors.|The ___ of the plane lay in the field.|Pieces of ___ washed ashore.|rubble,scrap|
  remnant|a small remaining quantity|残余|A ___ of the army escaped.|She bought a ___ of cloth.|The wall is a ___ of the old city.|scrap,rubble|remnants
  scrap|a small piece; waste metal; to discard|碎片；废料；放弃|Write it on a ___ of paper.|The car was sold for ___.|We may ___ the plan.|remnant,salvage|scrapped,scraps
  salvage|to rescue from loss or wreck|抢救|Divers tried to ___ the ship.|She managed to ___ her reputation.|We ___ what we could.|scrap,ruin|salvaged
  `,
);

const blunders = batch(
  "words-of-blunders-and-snags",
  ["Words of Blunders and Snags", "失误与障碍的词"],
  ["big and small mistakes and things that go wrong", "大小错误与出岔子的事"],
  `
  blunder|a stupid or careless mistake; to make one|大错；犯大错|It was a terrible ___.|Don't ___ into the room.|He made a political ___.|bungle,fiasco|blundered
  bungle|to carry out a task clumsily|搞砸|The thieves managed to ___ the job.|Don't ___ this chance.|Officials ___ the rescue.|botch,fumble|bungled
  botch|to do badly or carelessly|弄糟|The builder managed to ___ the roof.|Don't ___ the repair.|He made a ___ of it.|bungle,misstep|botched
  fumble|to use the hands clumsily; to drop a ball|笨手笨脚地摸索；漏接|She began to ___ for her keys.|Don't ___ the ball.|He would ___ his words.|botch,lapse|fumbled
  fiasco|a complete and humiliating failure|惨败|The party was a ___.|The launch turned into a ___.|What a ___!|blunder,hiccup|
  misstep|a badly judged act; a wrong step|失策；失足|One ___ could cost the election.|A ___ on the ice hurt her ankle.|The firm made a ___.|lapse,blunder|missteps
  lapse|a brief failure of attention or memory; the passing of time|疏忽；流逝|It was a ___ of memory.|After a ___ of a year we met again.|Don't let the policy ___.|misstep,defect|lapsed,lapses
  defect|a fault; to leave one's country or side|缺陷；叛逃|The car has a ___.|The spy tried to ___ to the West.|He was born with a heart ___.|snag,lapse|defective,defected,defector
  snag|an unexpected problem; to catch on something sharp|意外障碍；钩住|There's just one ___.|Her sweater may ___ on the nail.|We hit a ___ in the plan.|hiccup,defect|snagged
  hiccup|a sudden noise in the throat; a small problem|打嗝；小问题|She had the ___.|There was a ___ in the plan.|A brief ___ delayed us.|snag,fiasco|hiccups
  `,
);

/** batchesD are the batches of eating, looking, tiredness, the odd and dull, danger, disasters, wrecking and blunders. */
export const batchesD: readonly BatchSpec[] = [eating, looking, tiredness, odd, danger, disasters, wrecking, blunders];
