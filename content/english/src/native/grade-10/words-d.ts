// Grade 10: the batches of words of eating, of looking, of tiredness, of the odd and the dull, of danger, of
// natural disasters, of wrecking and of blunders.

import { t } from "@ga/content";
import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const eating = batch(
  "words-of-eating-and-hunger",
  ["Words of Eating and Hunger", "进食与饥饿的词"],
  ["eating fast or slowly, enjoying food and being hungry", "狼吞虎咽或细嚼慢咽、享受食物与饥饿"],
  `
  devour|to eat hungrily or quickly; to read eagerly|吞食；如饥似渴地读|The hungry lions began to ___ their prey, tearing it apart in minutes.|She would ___ every book she found, racing through each one late into the night.|Watch the starving boys ___ the whole pizza in two minutes.|nibble,savor|devoured
  gobble|to eat hurriedly and noisily|狼吞虎咽|Don't ___ your food; slow down and chew it properly.|The hungry kids began to ___ the cake, stuffing it into their mouths.|The puppy will ___ its dinner in seconds, gulping noisily.|nibble,savor|gobbled
  munch|to eat steadily and often noisily|大声咀嚼|The horse began to ___ the hay, chewing steadily with a crunching sound.|They ___ popcorn at the movies, crunching away noisily all through the film.|She likes to ___ on crunchy carrots while she does her homework.|savor,devour|munched
  nibble|to take small bites|小口咬|The mouse began to ___ the cheese, taking tiny bites from the edge.|Not very hungry, she would only ___ at her lunch, taking a small bite now and then.|Fish ___ at the bait with tiny bites before they swallow it.|gobble,devour|nibbled
  savor|to enjoy food or an experience slowly|品味|Eat slowly and ___ every bite of this fine meal.|She paused to ___ the moment, enjoying it slowly before it passed.|He liked to ___ the smell of fresh coffee, breathing it in slowly.|gobble,devour|savored
  relish|to enjoy greatly|享受|She would ___ a good argument, enjoying every minute of the challenge.|He seemed to ___ the chance to prove them wrong, enjoying it greatly.|Few people ___ the idea of getting up at five, but she loves it.|nourish,devour|relished
  appetite|a natural desire to eat; a strong wish|食欲；欲望|Exercise gives you a big ___, so you're ready to eat a lot.|She has a huge ___ for adventure, always wanting more.|Illness may spoil your ___, so you don't feel like eating.|morsel,fatigue|appetites
  famished|extremely hungry|饿极了的|After skipping breakfast and lunch, we were ___ and starving for food.|The ___ dogs wolfed down their food, hungrier than they had been for days.|I'm ___; I haven't eaten all day, so what's for dinner?|drowsy,groggy|
  nourish|to provide food needed for growth; to keep a feeling alive|滋养；怀有|Milk will ___ the calf, giving it the food it needs to grow.|Good books ___ the mind, feeding it and helping it grow.|Rich soil will ___ the young plants, feeding them as they grow.|devour,relish|nourished,nourishing,nourishment
  morsel|a small piece of food|一小块(食物)|He gave the dog a tiny ___ of meat to eat from his plate.|Not one ___ of food was left; the guests had eaten every bite.|She chewed each ___ of bread slowly, making the small piece last.|appetite,glimpse|morsels
  `,
  "context-clues",
  {
    intro: t(
      "The **famished** campers would **devour** anything, but Grandma told them to sit down and **savor** her stew, one slow spoonful at a time. These ten words help you describe hunger and the many ways of eating.",
      "饿坏了（**famished**）的露营者什么都能狼吞虎咽（**devour**），可奶奶让他们坐下来，一勺一勺慢慢品味（**savor**）她炖的菜。这十个词帮你描述饥饿和各种吃法。",
    ),
    watchOut: {
      meanings: t(
        "To **devour** or **gobble** is to eat *fast*; to **nibble** is to take *tiny bites*; to **munch** is to chew *steadily and noisily*; to **savor** is to eat *slowly, enjoying* every taste.",
        "**devour** 和 **gobble** 是吃得快；**nibble** 是小口咬；**munch** 是一直嘎吱嘎吱地嚼；**savor** 是慢慢吃、细细品。",
      ),
      use: t(
        "You can **relish** or **savor** things that are not food, such as a challenge or a moment, and you can **devour** a book; an **appetite** can be *for* adventure as well as for food.",
        "**relish** 和 **savor** 也可用于食物以外的事，如挑战或某一刻；**devour** 可以用于书；**appetite** 也可以是对冒险的渴望（appetite for）。",
      ),
      spelling: t(
        "**Savor** is the American spelling (British *savour*); **famished** has one *m*; **nourish** has *-our-*.",
        "**savor** 是美式拼法（英式 savour）；**famished** 只有一个 m；**nourish** 中间是 -our-。",
      ),
    },
    notes: `
      devour|lions tearing prey apart in minutes|racing through books late into the night|starving boys eating a whole pizza in two minutes|devour eats fast and hungrily; nibble takes tiny bites|devour 狼吞虎咽；nibble 小口咬|nibble means to take tiny bites, not to tear through something in minutes|nibble 指小口咬，不是几分钟就吃光|savor means to enjoy slowly, not to race through something|savor 指慢慢品味，不是飞快地吃完或读完|de · vour|the -vour ending|结尾是 -vour
      gobble|being told to slow down and chew properly|kids stuffing cake into their mouths|a puppy gulping its dinner in seconds|gobble eats hurriedly; nibble takes tiny bites|gobble 匆忙大吃；nibble 小口咬|nibble means to take tiny bites, not to stuff food in or gulp it|nibble 指小口咬，不是塞满嘴或大口吞|savor means to eat slowly, the opposite of rushing|savor 指慢慢吃，与匆忙正相反|gob · ble|the double b and the -le ending|双写 b，结尾是 -le
      munch|a horse chewing hay with a crunching sound|crunching popcorn noisily through a film|crunching carrots during homework|munch chews steadily and noisily; savor enjoys slowly and quietly|munch 一直嘎吱地嚼；savor 静静地慢慢品|savor means to enjoy slowly, not to crunch noisily, and it is never followed by on|savor 指慢慢品味，不是嘎吱作响，也不跟 on|devour means to eat fast, not steadily, and it is never followed by on|devour 指吃得快，不是一直嚼，也不跟 on|munch|the -unch ending, as in lunch|结尾 -unch，同 lunch
      nibble|a mouse taking tiny bites from cheese|a bite now and then when not hungry|fish taking tiny bites at bait|nibble takes tiny bites; gobble eats in a rush|nibble 小口咬；gobble 匆忙大吃|gobble means to eat in a hurry, not to take tiny bites|gobble 指匆忙大吃，不是小口咬|devour means to eat hungrily, not to take a small bite now and then|devour 指如饥似渴地吃，不是偶尔咬一小口|nib · ble|the double b and the -le ending|双写 b，结尾是 -le
      savor|eating a fine meal slowly|enjoying a moment slowly before it passes|slowly breathing in the smell of coffee|savor enjoys slowly; gobble rushes|savor 慢慢品味；gobble 匆忙大吃|gobble means to eat in a hurry, not to enjoy something slowly|gobble 指匆忙大吃，不是慢慢享受|devour means to eat fast and hungrily, not slowly|devour 指吃得快，不是慢慢吃|sa · vor|-or in American spelling, -our in British|美式 -or，英式 -our
      relish|enjoying every minute of a challenge|greatly enjoying a chance to prove people wrong|loving getting up at five|relish enjoys something greatly; nourish feeds it|relish 尽情享受；nourish 滋养|nourish means to feed something so it grows, not to enjoy an argument or a chance|nourish 指滋养使其生长，不是享受争论或机会|devour means to eat or read fast, not to enjoy a challenge|devour 指快吃或快读，不是享受挑战|rel · ish|the -ish ending|结尾是 -ish
      appetite|exercise making you ready to eat a lot|always wanting more adventure|illness making you not feel like eating|an appetite is a desire to eat; a morsel is a bit of food|appetite 是食欲；morsel 是一小块食物|morsel is a small piece of food, not a wish to eat|morsel 是一小块食物，不是想吃的欲望|fatigue is tiredness, not a desire for food or adventure|fatigue 是疲劳，不是对食物或冒险的渴望|ap · pe · tite|the double p and the -tite ending|双写 p，结尾是 -tite
      famished|skipping breakfast and lunch and starving|dogs hungrier than they had been for days|not having eaten all day|famished is extremely hungry; drowsy is sleepy|famished 饿极了；drowsy 困倦|drowsy means sleepy, not hungry for food|drowsy 指困倦，不是饥饿|groggy means dazed and weak after sleep, not starving|groggy 指睡后头昏无力，不是饿得慌|fam · ished|one m, then -ished|一个 m，结尾 -ished
      nourish|milk giving a calf the food it needs to grow|books feeding the mind|soil feeding young plants|nourish feeds something so it grows; devour eats it up|nourish 喂养使其成长；devour 吃光|devour means to eat something up, the opposite of feeding it so it grows|devour 指吃光，与喂养它长大正相反|relish means to enjoy greatly, but milk, books and soil feed things rather than enjoy them|relish 指尽情享受，而牛奶、书和土壤是在滋养，不是享受|nour · ish|the -our- in the middle|中间是 -our-
      morsel|a tiny piece of meat from a plate|not a bit of food left after every bite was eaten|a small piece of bread made to last|a morsel is a small piece of food; an appetite is the wish to eat|morsel 是一小块食物；appetite 是食欲|appetite is a desire to eat, not a small piece you can give or chew|appetite 是食欲，不是能递给别人或嚼的一小块|glimpse is a brief look, not a piece of food|glimpse 是一瞥，不是一块食物|mor · sel|the -sel ending, not -cel|结尾是 -sel，不是 -cel
    `,
  },
);

const looking = batch(
  "words-of-looking",
  ["Words of Looking", "看的词"],
  ["quick looks, long looks, narrowed eyes and bright lights", "瞥一眼、凝视、眯眼与耀眼的光"],
  `
  glimpse|a brief look; to see briefly|一瞥；瞥见|From the speeding train, she managed to ___ the sea for a second between the hills.|I could only ___ the famous actor for a moment as his car rushed past.|If you're lucky, you may ___ a whale for an instant before it dives.|gaze,stare|glimpsed
  glance|to take a brief look; a brief look|扫视；一瞥|She would ___ at the clock every few seconds, looking up only briefly.|He would ___ over his shoulder now and then, just for a second.|Please ___ at this note quickly; it will only take a moment.|gaze,stare|glanced
  gaze|to look steadily for a long time; a steady look|凝视|On summer nights they lie on the grass and ___ at the stars for hours.|She would ___ out of the window for hours, looking dreamily at the sea.|He loved to ___ into the fire, watching it calmly for a long time.|glance,squint|gazed
  stare|to look fixedly with wide eyes|盯着看|The kids began to ___ at the clown, their eyes wide and fixed on him.|Don't ___ at me with those wide, fixed eyes for so long; it's rude.|People on the bus would ___ at his bright green hair, their eyes fixed on it for minutes.|glance,twinkle|stared
  gape|to stare with the mouth open in surprise|目瞪口呆|Tourists ___ at the huge tower, their mouths hanging open in surprise.|Don't just stand there and ___ with your mouth open; help me!|Children ___ in amazement, mouths wide open, as the magician vanished.|glance,squint|gaped,gaping
  peer|to look closely or with difficulty|仔细看|She had to ___ into the dark, straining her eyes to see.|They had to ___ through the thick fog, looking hard to make out the road.|The old man would ___ closely at the tiny print, trying hard to read it.|glance,gape|peered,peers
  squint|to look with partly closed eyes|眯眼看|The bright sun made us ___, half closing our eyes against the glare.|She had to ___ to read the far-off sign, narrowing her eyes into slits.|Don't ___ with your eyes half shut; put on your glasses.|gaze,gape|squinted
  blink|to shut and open the eyes quickly|眨眼|In the sudden bright light, he began to ___, shutting and opening his eyes quickly.|Try not to ___ when the camera flashes, or your eyes will be shut in the photo.|The baby would ___ each time a drop of water hit her eyelids.|stare,gape|blinked
  twinkle|to shine with a flickering light|闪烁|On clear nights the stars ___ above us, their light flickering softly.|Far below, the city lights ___, flickering gently in the dark.|Her eyes would ___ with mischief, sparkling whenever she was about to joke.|dazzle,squint|twinkled,twinkling
  dazzle|to blind with bright light; to amaze|使目眩；使惊叹|Oncoming headlights may ___ drivers, blinding them for a moment.|Her amazing skill will ___ the judges, leaving them full of wonder.|The bright snow seemed to ___ us, its glare almost blinding.|twinkle,glimpse|dazzled
  `,
  "context-clues",
  {
    intro: t(
      "From the plane I could only **glimpse** the coast, but once we landed we would **gaze** at the sea for hours and **squint** against the bright afternoon sun. These ten words help you say exactly how someone looks at something.",
      "在飞机上我只能瞥见（**glimpse**）海岸，可一落地，我们就望着（**gaze**）大海看上好几个小时，在午后的强光下眯着眼（**squint**）。这十个词帮你准确地说出一个人是怎样看东西的。",
    ),
    watchOut: {
      meanings: t(
        "To **glance** is to look *quickly*; to **gaze** is to look *long and calmly*; to **stare** is to look *long with fixed, wide eyes*; to **peer** is to look *hard* because it is difficult to see.",
        "**glance** 是匆匆看一眼；**gaze** 是长时间平静地看；**stare** 是睁大眼睛久久盯着；**peer** 是因看不清而使劲看。",
      ),
      use: t(
        "You **glance** *at* something on purpose, but you **glimpse** something with no *at*, often by chance (*I glimpsed the sea*); you **gaze**, **stare** and **gape** *at* things.",
        "**glance** 后面接 at，是有意看一眼；**glimpse** 直接带宾语，不加 at，常是偶然瞥见（I glimpsed the sea）；**gaze**、**stare**、**gape** 都接 at。",
      ),
      spelling: t(
        "**Glimpse** has *-mpse*; **squint** has *qu*; **dazzle** has a double *z*.",
        "**glimpse** 有 -mpse；**squint** 有 qu；**dazzle** 双写 z。",
      ),
    },
    notes: `
      glimpse|seeing the sea for a second from a speeding train|seeing an actor for a moment as his car rushes past|seeing a whale for an instant before it dives|glimpse sees briefly, often by chance; gaze looks for a long time|glimpse 偶然瞥见；gaze 久久凝视|gaze means to look for a long time and needs at, but here the sight lasts only a moment|gaze 指久看且要接 at，而这里只看到一瞬间|stare means to look fixedly for a long time and needs at, not to see something for a moment|stare 指久久盯着且要接 at，不是一瞬间看到|glimpse|the -mpse ending|结尾是 -mpse
      glance|looking up only briefly at a clock|looking over a shoulder for a second|reading a note quickly|glance looks quickly; gaze looks for a long time|glance 匆匆一看；gaze 久久凝视|gaze means to look for a long time, not briefly or for a second|gaze 指久看，不是匆匆一看|stare means to look fixedly for a long time, not quickly|stare 指久久盯着，不是快速一看|glance|the -ance ending|结尾是 -ance
      gaze|lying on the grass looking at stars for hours|looking dreamily out of a window for hours|watching a fire calmly for a long time|gaze looks long and calmly; glance looks quickly|gaze 久久平静地看；glance 匆匆一看|glance means to look quickly, not for hours|glance 指匆匆一看，不是看上几个小时|squint means to look with half-closed eyes against light, not to look calmly and dreamily|squint 指眯眼看，不是平静出神地看|gaze|the -aze ending, as in maze|结尾 -aze，同 maze
      stare|kids with wide eyes fixed on a clown|wide, fixed eyes looking too long|eyes fixed for minutes on bright green hair|stare looks fixedly with wide eyes; glance looks quickly|stare 睁大眼睛盯着；glance 匆匆一看|glance means to look quickly, not with eyes fixed for a long time|glance 指匆匆一看，不是久久盯着|twinkle means to shine and flicker, not to look at something|twinkle 指闪烁，不是看|stare|the -are ending|结尾是 -are
      gape|tourists' mouths hanging open at a tower|standing with your mouth open instead of helping|children's mouths wide open at a magic trick|gape stares with the mouth open; glance takes a quick look|gape 张着嘴看呆；glance 匆匆一看|glance means a quick look, not staring with the mouth hanging open|glance 指匆匆一看，不是张嘴看呆|squint means to narrow the eyes, not to open the mouth in surprise|squint 指眯眼，不是惊得张嘴|gape|the -ape ending, as in tape|结尾 -ape，同 tape
      peer|straining the eyes to see into the dark|looking hard through thick fog|trying hard to read tiny print|peer looks hard because it is difficult to see; glance looks quickly|peer 因看不清而使劲看；glance 匆匆一看|glance means a quick, easy look, not straining to see|glance 指轻松地匆匆一看，不是使劲看|gape means to stare with the mouth open in surprise, not to look hard to make something out|gape 指惊得张嘴，不是使劲辨认|peer|the double e, as in deer|双写 e，同 deer
      squint|half closing the eyes against the sun's glare|narrowing the eyes into slits to read a sign|eyes half shut instead of wearing glasses|squint narrows the eyes; gaze looks calmly for a long time|squint 眯眼；gaze 平静久看|gaze means to look calmly for a long time, not with half-closed eyes|gaze 指平静久看，不是半闭着眼看|gape means to stare with the mouth open, not to narrow the eyes|gape 指张嘴看呆，不是眯眼|squint|the qu and the -int ending|有 qu，结尾 -int
      blink|shutting and opening the eyes quickly in sudden light|eyes shut in a photo at a camera flash|water drops hitting a baby's eyelids|blink shuts and opens the eyes quickly; stare keeps them wide open|blink 快速眨眼；stare 睁大眼睛盯着|stare means to keep the eyes wide open and fixed, the opposite of shutting them quickly|stare 指睁大眼睛盯着，与快速闭眼正相反|gape means to stare with the mouth open, not to shut the eyes|gape 指张嘴看呆，不是闭眼|blink|the -ink ending, as in wink|结尾 -ink，同 wink
      twinkle|stars flickering softly on clear nights|city lights flickering gently far below|eyes sparkling before a joke|twinkle shines softly and flickers; dazzle blinds with bright light|twinkle 柔和地闪烁；dazzle 强光刺眼|dazzle means to blind someone with strong light, but here the light flickers softly and gently|dazzle 指强光使人目眩，而这里的光是柔和闪烁的|squint means to narrow the eyes, not to shine|squint 指眯眼，不是发光|twin · kle|twin followed by -kle|twin 加 -kle
      dazzle|headlights blinding drivers for a moment|skill leaving judges full of wonder|snow's glare almost blinding us|dazzle blinds or amazes someone; twinkle just shines softly|dazzle 使人目眩或惊叹；twinkle 只是柔和闪烁|twinkle means to shine softly, and it does not take drivers, judges or us as its object|twinkle 指柔和闪烁，不能带司机、评委或我们作宾语|glimpse means to see something briefly, not to blind or amaze someone|glimpse 指瞥见，不是使人目眩或惊叹|daz · zle|the double z and the -le ending|双写 z，结尾是 -le
    `,
  },
);

const tiredness = batch(
  "words-of-tiredness-and-sleep",
  ["Words of Tiredness and Sleep", "疲倦与睡眠的词"],
  ["being sleepy, worn out, half awake and asleep", "困倦、疲惫、半醒与熟睡"],
  `
  drowsy|sleepy and lethargic|昏昏欲睡的|The cold pills may make you ___, so don't drive if you feel sleepy.|A warm, quiet room makes me ___, and soon my eyes start to close.|The ___ child yawned and rubbed her sleepy eyes.|haggard,famished|drowsiness
  groggy|dazed and weak, especially after sleep or illness|头昏眼花的|I felt ___ after the long flight, dazed and unsteady on my feet.|She woke up ___ and confused, stumbling to the kitchen half dazed.|The drug left him ___, so dazed and weak he could barely stand.|famished,vibrant|
  weary|feeling or showing extreme tiredness|疲倦的|The ___ travelers sat down at last, worn out after the long road.|She grew ___ of his excuses, tired of hearing the same ones again and again.|He gave a ___ smile, too tired to say anything more.|vibrant,famished|wearily,weariness
  exhausted|very tired; completely used up|筋疲力尽的；耗尽的|We were ___ after the marathon, completely worn out.|Our supplies were ___, with nothing left at all.|The ___ runner fell to the ground, every ounce of her strength used up.|vibrant,famished|exhausting,exhaustion
  fatigue|extreme tiredness|疲劳|Long hours at work cause ___, leaving staff tired and slow.|She was suffering from ___ and felt tired all the time.|Metal ___ caused the crash: the wing had weakened after years of stress.|slumber,appetite|
  haggard|looking exhausted and unwell|憔悴的|He looked ___ after the night shift, pale, thin and worn.|Her face was ___ with worry, lined and hollow-cheeked.|The ___ soldiers marched home, thin and hollow-eyed.|vibrant,quaint|
  doze|to sleep lightly|打瞌睡|Grandpa began to ___ in his chair, sleeping lightly with his head nodding.|I tend to ___ off in boring lessons, my eyes slowly closing.|She would ___ in the sun, drifting in and out of light sleep.|fret,linger|dozed
  snooze|to sleep briefly|小睡|The cat likes to ___ in the sun, taking short naps all afternoon.|He likes to ___ for twenty minutes after lunch, a short nap before work.|If you ___ through the alarm and keep sleeping, you'll miss the bus.|fret,gape|snoozed
  slumber|sleep|睡眠|The town lay in deep ___, every house dark and every person asleep.|She fell into a deep ___ and slept soundly until morning.|The baby's peaceful ___ lasted all night without a cry.|fatigue,appetite|slumbered
  lull|a quiet period|间歇|There was a ___ in the storm, a short quiet spell before the wind returned.|During a ___ in the fighting, the soldiers rested for an hour in the quiet.|After a busy morning, the shop had a quiet ___ around three, when few customers came.|slumber,commotion|lulled
  `,
  "context-clues",
  {
    intro: t(
      "After the night shift the nurse felt **weary** and looked **haggard**; on the bus home she began to **doze**, and she woke up **groggy** at the last stop. These ten words help you describe tiredness and sleep, from a light nap to a deep sleep.",
      "夜班后，护士觉得疲倦（**weary**），看上去很憔悴（**haggard**）；在回家的公交车上她开始打瞌睡（**doze**），到终点站醒来时头昏脑涨（**groggy**）。这十个词帮你描述疲倦与睡眠，从小睡到熟睡。",
    ),
    watchOut: {
      meanings: t(
        "**Drowsy** means *sleepy*, about to fall asleep; **groggy** means *dazed and weak*, usually just after waking or an illness; **haggard** describes how tired someone *looks*.",
        "**drowsy** 是困得快睡着；**groggy** 是头昏无力，常在刚醒或病后；**haggard** 描述人看上去的憔悴。",
      ),
      use: t(
        "**Fatigue** and **slumber** are nouns (*suffering from fatigue*, *a deep slumber*), while **doze** and **snooze** are verbs here (*doze off*, *snooze in the sun*); a **lull** is a quiet *break* in something busy or noisy.",
        "**fatigue** 和 **slumber** 是名词（suffering from fatigue、a deep slumber）；**doze** 和 **snooze** 在这里是动词（doze off、snooze in the sun）；**lull** 是热闹或喧嚣中的平静间歇。",
      ),
      spelling: t(
        "**Exhausted** has a silent *h* after the *x*; **fatigue** ends in *-gue*; **drowsy** has *-ow-*.",
        "**exhausted** 的 x 后有一个不发音的 h；**fatigue** 以 -gue 结尾；**drowsy** 中间是 -ow-。",
      ),
    },
    notes: `
      drowsy|cold pills making you feel sleepy|a warm, quiet room making eyes close|a yawning child rubbing her sleepy eyes|drowsy is sleepy; groggy is dazed after waking|drowsy 困倦欲睡；groggy 醒后头昏|haggard describes a worn, unwell look, not feeling sleepy|haggard 指面容憔悴，不是困倦|famished means extremely hungry, not sleepy|famished 指饿极了，不是困|drow · sy|the -ow- in the middle|中间是 -ow-
      groggy|feeling dazed and unsteady after a flight|stumbling to a kitchen half dazed after waking|a drug leaving a man too weak to stand|groggy is dazed and weak; drowsy is about to fall asleep|groggy 头昏无力；drowsy 快要睡着|famished means extremely hungry, not dazed and unsteady|famished 指饿极了，不是头昏腿软|vibrant means full of energy, the opposite of dazed and weak|vibrant 指充满活力，与头昏无力正相反|grog · gy|the double g before -y|-y 前双写 g
      weary|travelers worn out after a long road|being tired of the same excuses|a smile too tired to say more|weary is deeply tired; exhausted is completely used up|weary 疲倦；exhausted 精疲力竭、耗尽|vibrant means full of energy, the opposite of worn out|vibrant 指充满活力，与疲惫正相反|famished means extremely hungry, not tired of excuses|famished 指饿极了，不是厌倦借口|wea · ry|the -ea- in the middle|中间是 -ea-
      exhausted|being completely worn out after a marathon|supplies with nothing left|a runner with every ounce of strength used up|exhausted is completely used up; weary is deeply tired|exhausted 完全耗尽；weary 疲倦|vibrant means full of energy, the opposite of completely worn out|vibrant 指充满活力，与精疲力竭正相反|famished means extremely hungry, and supplies cannot be hungry|famished 指饿极了，补给不会饿|ex · haust · ed|the silent h after the x|x 后有不发音的 h
      fatigue|long hours leaving staff tired and slow|feeling tired all the time|a wing weakened after years of stress|fatigue is tiredness; slumber is sleep|fatigue 是疲劳；slumber 是睡眠|slumber is sleep, not the tiredness that long hours or stress cause|slumber 是睡眠，不是长时间工作或压力造成的疲劳|appetite is a desire to eat, not tiredness or weakness|appetite 是食欲，不是疲劳或衰弱|fa · tigue|the -gue ending|结尾是 -gue
      haggard|looking pale, thin and worn after a night shift|a face lined and hollow-cheeked with worry|thin, hollow-eyed soldiers|haggard looks worn and unwell; vibrant looks full of life|haggard 憔悴；vibrant 生气勃勃|vibrant means full of life, the opposite of pale, thin and worn|vibrant 指生气勃勃，与苍白消瘦正相反|quaint means charmingly old-fashioned, not worn and unwell|quaint 指古雅可爱，不是憔悴|hag · gard|the double g|双写 g
      doze|sleeping lightly in a chair with a nodding head|eyes slowly closing in boring lessons|drifting in and out of light sleep in the sun|doze sleeps lightly; fret worries|doze 打盹；fret 担忧|fret means to worry, not to sleep lightly|fret 指担忧，不是打盹|linger means to stay on in a place, not to fall into light sleep|linger 指逗留，不是浅睡|doze|the -oze ending|结尾是 -oze
      snooze|a cat taking short naps all afternoon|a short nap after lunch|sleeping on through an alarm|snooze takes a short nap; fret worries|snooze 小睡；fret 担忧|fret means to worry, not to take a nap|fret 指担忧，不是小睡|gape means to stare with the mouth open, not to sleep|gape 指张嘴看呆，不是睡觉|snooze|the double o and -ze|双写 o，结尾 -ze
      slumber|a dark town where everyone is asleep|sleeping soundly until morning|a baby sleeping peacefully all night|slumber is sleep; fatigue is tiredness|slumber 是睡眠；fatigue 是疲劳|fatigue is tiredness, not the sleep that people fall into|fatigue 是疲劳，不是人们沉入的睡眠|appetite is a desire to eat, not sleep|appetite 是食欲，不是睡眠|slum · ber|the -ber ending|结尾是 -ber
      lull|a short quiet spell in a storm|an hour of quiet in the fighting|a quiet time in a shop when few customers came|a lull is a quiet break; slumber is sleep|lull 是平静间歇；slumber 是睡眠|slumber is sleep, but a storm, a battle and a shop do not sleep|slumber 是睡眠，而风暴、战事和商店不会睡觉|commotion is noisy confusion, the opposite of a quiet spell|commotion 是吵闹的混乱，与平静间歇正相反|lull|the double l at the end|结尾双写 l
    `,
  },
);

const odd = batch(
  "words-of-the-odd-and-the-dull",
  ["Words of the Odd and the Dull", "怪异与乏味的词"],
  ["strange people and things, boring days and bright life", "奇人奇事、乏味的日子与生气勃勃"],
  `
  odd|strange or unusual; not even|奇怪的；奇数的|Three and five are ___ numbers, since neither can be divided evenly by two.|The houses with ___ numbers, like 1, 3 and 5, are on the left side of the street.|If you add two ___ numbers, such as 3 and 5, you always get an even number.|bizarre,eccentric|oddly,oddity
  bizarre|very strange or unusual|离奇的|It was a ___ dream in which fish flew and trees talked.|She wore a ___ hat shaped like a giant shoe, the strangest anyone had seen.|The ___ story about a pig flying to the moon made no sense at all.|quaint,drab|bizarrely
  eccentric|unconventional and slightly strange|古怪的|My uncle is a bit ___: he wears a cape and keeps forty cats.|The ___ painter lived alone in a lighthouse and worked only at midnight.|He had ___ habits, such as eating breakfast standing on one leg.|quaint,drab|eccentricity
  quaint|attractively unusual or old-fashioned|古色古香的|We stayed in a ___ village with crooked old cottages and charming little lanes.|What a ___ old shop, full of charming antique clocks!|They kept a ___ old custom, a charming spring dance from centuries ago.|bizarre,dismal|
  lofty|of imposing height; noble; proud|高耸的；崇高的；傲慢的|Snowy, ___ mountains rose high above the little village.|She had ___ ideals, hoping to end hunger and bring peace to the world.|He spoke in a proud, ___ tone, as if he were better than all of us.|quaint,drab|
  vibrant|full of energy and life; bright|充满活力的；鲜艳的|The city has a ___ night life, full of music, dancing and energy.|She wore ___ colors, bright reds and yellows that caught every eye.|He is a ___ young man, bursting with energy and ideas.|drab,dreary|vibrancy
  drab|dull and lacking color|单调的|The room was ___ and gray, with no color anywhere.|She wore a ___ brown coat that no one would ever notice.|After the bright city, life in the dull gray town seemed ___.|vibrant,quaint|
  dreary|dull, bleak and lifeless|沉闷的|It was a cold, ___ winter day, gray and gloomy from start to finish.|He gave a long, ___ speech that bored everyone half to sleep.|The town looked ___ in the rain, its streets empty and gloomy.|vibrant,quaint|
  dismal|depressing; very bad|阴郁的；差劲的|The weather was ___, with cold rain and dark skies all week.|The team gave a ___ performance, losing every game badly.|Sales were ___ this year, the worst the shop has ever had.|vibrant,lofty|dismally
  monotonous|dull, tedious and repetitious|单调乏味的|The work was ___: the same task again and again, all day long.|He spoke in a flat, ___ voice that never rose or fell.|The ___ road went on for miles, straight and unchanging.|vibrant,bizarre|monotony
  `,
  "context-clues",
  {
    intro: t(
      "Our **drab** little town had **dreary** gray winters, until an **eccentric** painter moved in and covered the walls with **vibrant** murals. These ten words help you describe what is strange, what is dull and what is full of life.",
      "我们那座单调（**drab**）的小镇，冬天灰暗沉闷（**dreary**），直到一位古怪（**eccentric**）的画家搬来，在墙上画满了鲜艳生动（**vibrant**）的壁画。这十个词帮你描述奇怪的、乏味的和充满生气的东西。",
    ),
    watchOut: {
      meanings: t(
        "**Bizarre** is *very* strange, often shockingly so; **eccentric** describes a *person* or habit that is unusual but harmless; **quaint** is strange in a *charming, old-fashioned* way.",
        "**bizarre** 是非常离奇，常让人吃惊；**eccentric** 形容人或习惯与众不同但无害；**quaint** 是古雅可爱的那种别致。",
      ),
      use: t(
        "**Drab** is about a lack of *color*; **monotonous** is about *sameness*, the same thing again and again; **dismal** can also mean *very bad*, as in *dismal sales*.",
        "**drab** 着重缺少色彩；**monotonous** 着重千篇一律；**dismal** 还可以指很差，如 dismal sales。",
      ),
      spelling: t(
        "**Bizarre** has one *z* and a double *r* (not *bazaar*, a market); **eccentric** has a double *c*; **monotonous** has *-ous* at the end.",
        "**bizarre** 一个 z、两个 r（不同于集市 bazaar）；**eccentric** 双写 c；**monotonous** 以 -ous 结尾。",
      ),
    },
    notes: `
      odd|numbers that cannot be divided evenly by two|house numbers like 1, 3 and 5|two numbers such as 3 and 5 adding to an even number|odd here means not even; bizarre only means very strange|odd 这里指奇数；bizarre 只指非常离奇|bizarre means very strange, and it cannot describe numbers that are not even|bizarre 指离奇，不能形容奇数|eccentric describes a strange person or habit, not a number that is not even|eccentric 形容古怪的人或习惯，不是奇数|odd|the double d|双写 d
      bizarre|a dream where fish fly and trees talk|a hat shaped like a giant shoe|a story about a pig flying to the moon|bizarre is shockingly strange; quaint is charmingly old-fashioned|bizarre 离奇；quaint 古雅可爱|quaint means charmingly old-fashioned, not shockingly strange|quaint 指古雅可爱，不是离奇古怪|drab means dull and colorless, not strange|drab 指单调无色，不是奇怪|bi · zarre|one z and a double r|一个 z、两个 r
      eccentric|an uncle in a cape with forty cats|a painter living in a lighthouse and working at midnight|eating breakfast standing on one leg|eccentric is strange but harmless in a person; quaint is charmingly old-fashioned|eccentric 指人古怪无害；quaint 古雅可爱|quaint means charmingly old-fashioned, not unusual behavior like a cape and forty cats|quaint 指古雅可爱，不是披斗篷养四十只猫这类怪行为|drab means dull and colorless, the opposite of these unusual ways|drab 指单调无色，与这些怪异举止正相反|ec · cen · tric|the double c at the start|开头双写 c
      quaint|a village of crooked old cottages and charming lanes|a charming old shop full of antique clocks|a charming spring dance from centuries ago|quaint is charmingly old-fashioned; bizarre is shockingly strange|quaint 古雅可爱；bizarre 离奇|bizarre means shockingly strange, not charming and old-fashioned|bizarre 指离奇得令人吃惊，不是古雅可爱|dismal means gloomy and depressing, not charming|dismal 指阴郁沉闷，不是可爱|quaint|the qu and the -aint ending|有 qu，结尾 -aint
      lofty|snowy mountains rising high above a village|ideals of ending hunger and bringing peace|a proud tone of someone who thinks he is better|lofty is high or noble; quaint is charmingly old-fashioned|lofty 高耸或崇高；quaint 古雅可爱|quaint means charmingly old-fashioned, not high, noble or proud|quaint 指古雅可爱，不是高耸、崇高或傲慢|drab means dull and colorless, not high or noble|drab 指单调无色，不是高耸或崇高|lof · ty|the -fty ending|结尾是 -fty
      vibrant|a night life full of music, dancing and energy|bright reds and yellows catching every eye|a young man bursting with energy and ideas|vibrant is full of life; drab is dull and colorless|vibrant 生机勃勃；drab 单调无色|drab means dull and colorless, the opposite of bright and full of energy|drab 指单调无色，与鲜艳活跃正相反|dreary means bleak and lifeless, the opposite of bursting with energy|dreary 指沉闷无生气，与充满活力正相反|vi · brant|the -ant ending|结尾是 -ant
      drab|a gray room with no color anywhere|a brown coat no one would notice|life in a dull gray town after a bright city|drab lacks color; vibrant is bright and lively|drab 缺少色彩；vibrant 鲜艳活跃|vibrant means bright and full of life, the opposite of gray and colorless|vibrant 指鲜艳有活力，与灰暗无色正相反|quaint means charmingly old-fashioned, not dull and gray|quaint 指古雅可爱，不是灰暗乏味|drab|d-r-a-b, with no e|没有 e
      dreary|a cold winter day gray and gloomy from start to finish|a long speech that bored everyone|empty, gloomy streets in the rain|dreary is bleak and dull; vibrant is full of life|dreary 沉闷；vibrant 充满活力|vibrant means full of life and energy, the opposite of gloomy and boring|vibrant 指充满活力，与阴沉无聊正相反|quaint means charmingly old-fashioned, not gloomy and boring|quaint 指古雅可爱，不是阴沉无聊|drea · ry|the -ea- in the middle|中间是 -ea-
      dismal|a week of cold rain and dark skies|a team losing every game badly|the worst sales a shop has ever had|dismal is gloomy or very bad; vibrant is lively and bright|dismal 阴郁或很差；vibrant 鲜活明亮|vibrant means bright and lively, the opposite of dark, gloomy and bad|vibrant 指鲜活明亮，与阴暗糟糕正相反|lofty means high or noble, not gloomy or very bad|lofty 指高耸或崇高，不是阴郁或很差|dis · mal|the -mal ending|结尾是 -mal
      monotonous|the same task again and again all day|a flat voice that never rose or fell|a straight road unchanging for miles|monotonous is dull through sameness; vibrant is varied and lively|monotonous 千篇一律；vibrant 丰富活跃|vibrant means full of life and energy, the opposite of the same thing again and again|vibrant 指充满活力，与千篇一律正相反|bizarre means shockingly strange, not dull and unchanging|bizarre 指离奇，不是单调不变|mo · not · o · nous|three o's and the -ous ending|三个 o，结尾 -ous
    `,
  },
);

const danger = batch(
  "words-of-danger-and-threats",
  ["Words of Danger and Threats", "危险与威胁的词"],
  ["risk, harm about to happen and hard spots", "风险、迫在眉睫的伤害与困境"],
  `
  imminent|about to happen|迫在眉睫的|Dark clouds gathered, and we knew a storm was ___, only minutes away.|The soldiers were in ___ danger, with the enemy just a few steps away.|With the guests' ___ arrival only an hour off, we rushed to clean.|hazardous,risky|
  brink|the edge of a steep place; the point at which something is about to happen|边缘|She stood on the ___ of the cliff, one step from falling.|The firm is on the ___ of ruin, just days from closing.|The two nations were on the ___ of war, about to start fighting.|plight,jeopardy|
  jeopardy|danger of loss or harm|危险|Lives were in ___ as the fire spread through the building.|The deal is in ___ now that the main buyer has pulled out.|His job is in ___ after the mistake, and he may lose it.|plight,menace|jeopardize
  menace|a person or thing that is likely to cause harm; a threat|威胁，祸害|That dog is a ___ to the neighborhood, biting anyone who passes.|There was ___ in his voice, a quiet threat that frightened us.|Litter is a ___ to wildlife, harming the birds that swallow it.|jeopardy,plight|menaced,menacing
  plight|a dangerous, difficult or unfortunate situation|困境|The ___ of the refugees, with no food or shelter, moved everyone.|We read of their terrible ___: lost at sea for weeks with no water.|Few noticed the ___ of the poor, who struggled through the winter without heat.|jeopardy,brink|
  threaten|to say one will cause harm; to be likely to harm|威胁|The robber tried to ___ the clerk, saying he would shoot unless she opened the safe.|The bully would ___ smaller kids, warning them he would hit them.|Don't ___ me; saying you'll hurt me won't make me give in.|endanger,salvage|threatening
  endanger|to put someone or something at risk|危及|Smoking will ___ your health, putting it at serious risk.|Driving too fast will ___ the lives of others, putting them at risk.|Pollution may ___ the rare fish, putting the species at risk of dying out.|eradicate,nourish|
  hazardous|risky; dangerous|有危险的|Smoking is ___ to health, causing serious disease.|Icy roads are ___, causing many accidents each winter.|You must store ___ waste, like poisons and acids, with great care.|imminent,lofty|
  risky|full of the possibility of danger or failure|有风险的|It is ___ to put all your savings in one company; you could lose everything.|Climbing alone is ___, since there's no one to help if you fall.|That ___ move could easily have failed and cost us the game.|imminent,quaint|riskier,riskiest
  unsafe|not safe; dangerous|不安全的|The old bridge is ___, so no one is allowed to cross it.|It is ___ to swim here because of the strong currents.|The house was declared ___ after the earthquake cracked its walls.|imminent,vibrant|
  `,
  "context-clues",
  {
    intro: t(
      "When the river rose, the town was on the **brink** of disaster: a flood was **imminent**, the old bridge was **unsafe**, and hundreds of homes were in **jeopardy**. These ten words help you talk about danger, from a small risk to harm that is about to happen.",
      "河水上涨时，小镇站在灾难的边缘（**brink**）：洪水迫在眉睫（**imminent**），老桥已不安全（**unsafe**），数百户人家岌岌可危（in **jeopardy**）。这十个词帮你谈论危险，从小风险到即将发生的伤害。",
    ),
    watchOut: {
      meanings: t(
        "**Imminent** means *about to happen*, soon, not necessarily dangerous; **hazardous**, **risky** and **unsafe** mean *dangerous*; a **plight** is a bad situation someone is *already in*.",
        "**imminent** 是即将发生，不一定危险；**hazardous**、**risky**、**unsafe** 是危险的；**plight** 是某人已经身处的困境。",
      ),
      use: t(
        "Things are *in* **jeopardy** but *on the* **brink** *of* something; you **threaten** someone by *saying* you will harm them, but you **endanger** them by *putting them at risk*.",
        "说 in **jeopardy**，但说 on the **brink** of；**threaten** 是扬言要伤害某人，**endanger** 是让某人陷入危险。",
      ),
      spelling: t(
        "**Jeopardy** has a silent *o* after the *e*; **imminent** has a double *m* (not *eminent*); **hazardous** has one *z*.",
        "**jeopardy** 的 e 后有不发音的 o；**imminent** 双写 m（不同于 eminent）；**hazardous** 只有一个 z。",
      ),
    },
    notes: `
      imminent|a storm only minutes away|danger with the enemy just a few steps away|guests arriving only an hour off|imminent is about to happen; hazardous is dangerous|imminent 即将发生；hazardous 有危险|hazardous means dangerous, but these sentences are about how soon something will happen|hazardous 指危险，而这些句子讲的是事情多快到来|risky means full of risk, not about to happen any minute|risky 指有风险，不是马上就要发生|im · mi · nent|the double m, not eminent|双写 m，不是 eminent
      brink|standing one step from falling off a cliff|a firm just days from closing|nations about to start fighting|on the brink of means at the edge of; a plight is a bad situation you are in|on the brink of 指在边缘；plight 是身处的困境|plight is a bad situation, and no one stands on the plight of a cliff or of war|plight 指困境，不能说站在悬崖或战争的 plight 上|jeopardy is danger of loss, and things are in jeopardy, never on the jeopardy of something|jeopardy 指危险，只说 in jeopardy，不说 on the jeopardy of|brink|the -ink ending, as in sink|结尾 -ink，同 sink
      jeopardy|lives at risk as a fire spreads|a deal at risk after a buyer pulls out|a job that may be lost after a mistake|in jeopardy means at risk of loss; a plight is an unhappy situation|in jeopardy 指有失去的危险；plight 是不幸的处境|plight is a bad situation someone is in, and we never say in plight|plight 指困境，不说 in plight|menace is a thing that causes harm, not the state of being at risk|menace 指带来危害的东西，不是处于危险的状态|jeop · ar · dy|the silent o after the e|e 后有不发音的 o
      menace|a dog biting anyone who passes|a quiet threat in a voice|litter harming birds that swallow it|a menace causes harm; jeopardy is the state of being at risk|menace 是祸害；jeopardy 是处于危险|jeopardy is the state of being at risk, not a dog, a voice or litter that causes harm|jeopardy 是处于危险，不是带来危害的狗、声音或垃圾|plight is a bad situation someone is in, not something that causes harm|plight 指困境，不是带来危害的东西|men · ace|men followed by -ace|men 加 -ace
      plight|refugees with no food or shelter|people lost at sea for weeks with no water|the poor struggling through winter without heat|a plight is a bad situation; jeopardy is a risk of loss|plight 是困境；jeopardy 是有失去的危险|jeopardy is the risk of losing something, not the hard situation of refugees or the poor|jeopardy 指有失去的危险，不是难民或穷人的艰难处境|brink is the edge just before something happens, not a hard situation people are already in|brink 指即将发生前的边缘，不是已身处的困境|plight|the silent gh, as in night|gh 不发音，同 night
      threaten|a robber saying he would shoot|a bully warning he would hit smaller kids|saying you'll hurt someone to make them give in|threaten says you will cause harm; endanger puts at risk|threaten 扬言要伤害；endanger 使陷入危险|endanger means to put at risk, not to say that you will cause harm|endanger 指使陷入危险，不是扬言伤害|salvage means to rescue from loss, the opposite of warning that you will hurt|salvage 指抢救，与扬言伤害正相反|threat · en|threat followed by -en|threat 加 -en
      endanger|smoking putting health at serious risk|fast driving putting others' lives at risk|pollution putting a rare fish at risk of dying out|endanger puts at risk; eradicate wipes out completely|endanger 使陷入危险；eradicate 彻底根除|eradicate means to destroy completely, not just to put at risk|eradicate 指彻底消灭，不只是使陷入危险|nourish means to feed and help grow, the opposite of putting at risk|nourish 指滋养，与使陷入危险正相反|en · dan · ger|en- followed by danger|en- 加 danger
      hazardous|smoking causing serious disease|icy roads causing many accidents|poisons and acids stored with great care|hazardous is dangerous; imminent is about to happen|hazardous 有危险；imminent 即将发生|imminent means about to happen, not dangerous to health or causing accidents|imminent 指即将发生，不是危害健康或引发事故|lofty means high or noble, not dangerous|lofty 指高耸或崇高，不是危险|haz · ard · ous|one z and the -ous ending|一个 z，结尾 -ous
      risky|savings that could all be lost|climbing with no one to help if you fall|a move that could easily have failed|risky could go wrong; imminent is about to happen|risky 可能出错；imminent 即将发生|imminent means about to happen, not something that could fail or go wrong|imminent 指即将发生，不是可能失败|quaint means charmingly old-fashioned, not dangerous|quaint 指古雅可爱，不是危险|ris · ky|the -sky ending|结尾是 -sky
      unsafe|a bridge no one is allowed to cross|strong currents where swimming is dangerous|a house with walls cracked by an earthquake|unsafe is not safe; imminent is about to happen|unsafe 不安全；imminent 即将发生|imminent means about to happen, not dangerous to cross, swim in or live in|imminent 指即将发生，不是过桥、游泳或居住有危险|vibrant means full of life, not dangerous|vibrant 指充满活力，不是危险|un · safe|un- followed by safe|un- 加 safe
    `,
  },
);

const disasters = batch(
  "words-of-natural-disasters",
  ["Words of Natural Disasters", "自然灾害的词"],
  ["storms, floods, sliding earth, volcanoes and drowning", "风暴、洪水、山体滑坡、火山与溺水"],
  `
  hurricane|a violent storm with very strong wind|飓风|The ___ hit the coast with winds of over 150 miles an hour.|Shops boarded up their windows before the ___ and its fierce winds arrived.|This ___ season, several violent storms with strong winds are expected.|avalanche,mudslide|
  avalanche|a mass of snow falling down a mountain; a sudden large amount|雪崩；大量涌来|Tons of snow fell in the ___, burying the skiers on the slope.|After the show, we got a huge ___ of letters, thousands in a single day.|The ___ blocked the mountain pass with deep snow.|landslide,mudslide|avalanches
  landslide|a collapse of a mass of earth or rock|山体滑坡|The ___ of rock and earth closed the mountain road for a week.|Heavy rain loosened the hillside, and a huge ___ of rocks crashed onto the road.|The quarry wall gave way in a sudden ___, sending boulders and dirt down the slope.|mudslide,avalanche|landslides
  mudslide|a mass of mud sliding down a slope|泥石流|The ___ swept away homes in a river of wet mud.|Heavy rains turned the hillside to mud and caused a deadly ___.|A thick ___ of wet mud blocked the river.|landslide,avalanche|mudslides
  torrent|a strong and fast stream of water; an outpouring|激流；连续不断|After the storm, the gentle stream became a raging ___, rushing fast between the rocks.|She let out a ___ of angry words, one after another, as fast as rushing water.|Water poured down the gutter in a fast, foaming ___.|hurricane,mudslide|torrents
  deluge|a severe flood; a great quantity of something arriving at once|洪水；大量|The ___ flooded the valley, ruining every crop under the water.|After the advert we had a ___ of calls, hundreds all at once.|A ___ of rain fell from the sky, flooding the streets in minutes.|hurricane,mudslide|deluged
  engulf|to sweep over so as to surround or swallow completely|吞没|Flames began to ___ the house, swallowing it completely.|Huge waves may ___ the little boat, swallowing it whole.|Panic seemed to ___ the crowd, sweeping over everyone at once.|drown,erupt|engulfed
  drown|to die under water|淹死|Many people ___ in the flood, unable to stay above the water.|She was afraid she would ___ if she fell into the deep water.|Without a life jacket, a weak swimmer can ___ in minutes.|engulf,erupt|drowned,drowning
  erupt|to burst out suddenly, as a volcano or violence|喷发；爆发|The volcano may ___ again, shooting lava and ash into the sky.|Fighting began to ___ in the streets, bursting out suddenly at night.|The crowd will ___ in cheers, bursting into noise when the team scores.|quake,drown|erupted
  quake|to shake or tremble|颤抖|She began to ___ with fear, her whole body trembling.|The old house would ___ whenever a heavy truck passed, its walls shaking.|His knees began to ___, shaking so hard he had to sit down.|erupt,drown|quaked
  `,
  "context-clues",
  {
    intro: t(
      "First the **hurricane** brought days of rain; then the swollen river became a **torrent**, and a **mudslide** poured down the hill and buried the road. These ten words help you describe the disasters that nature brings.",
      "先是飓风（**hurricane**）带来了连日暴雨；接着涨水的河变成了激流（**torrent**），一场泥石流（**mudslide**）从山上冲下来，埋住了公路。这十个词帮你描述大自然带来的灾害。",
    ),
    watchOut: {
      meanings: t(
        "An **avalanche** is falling *snow*; a **landslide** is falling *earth and rock*; a **mudslide** is sliding *wet mud*; a **torrent** is a *fast stream*, while a **deluge** is a *flood* that covers everything.",
        "**avalanche** 是雪崩；**landslide** 是土石滑落；**mudslide** 是泥浆滑下；**torrent** 是湍急的水流，**deluge** 是淹没一切的洪水。",
      ),
      use: t(
        "**Torrent**, **deluge** and **avalanche** can also mean a sudden *huge amount* of something: *a torrent of words*, *a deluge of calls*, *an avalanche of fan mail*.",
        "**torrent**、**deluge**、**avalanche** 也可指突然涌来的大量东西：a torrent of words、a deluge of calls、an avalanche of fan mail。",
      ),
      spelling: t(
        "**Hurricane** has a double *r*; **engulf** has *-gulf*, like the sea; **deluge** ends in *-uge*.",
        "**hurricane** 双写 r；**engulf** 里有 gulf（海湾）；**deluge** 以 -uge 结尾。",
      ),
    },
    notes: `
      hurricane|winds of over 150 miles an hour hitting a coast|shops boarding up windows before fierce winds|a season of violent storms with strong winds|a hurricane is a violent windstorm; an avalanche is falling snow|hurricane 是狂风暴雨；avalanche 是雪崩|avalanche is a mass of falling snow, not a storm of fierce winds on a coast|avalanche 是雪崩，不是沿海的狂风|mudslide is sliding mud, not a storm of strong winds|mudslide 是泥石流，不是狂风暴雨|hur · ri · cane|the double r|双写 r
      avalanche|tons of snow burying skiers|thousands of letters in a single day|deep snow blocking a mountain pass|an avalanche is falling snow; a landslide is falling earth and rock|avalanche 是雪崩；landslide 是土石滑落|landslide is falling earth and rock, not snow, and it is not used for a flood of letters|landslide 是土石滑落，不是雪，也不用于大量来信|mudslide is sliding mud, not snow or a flood of letters|mudslide 是泥浆滑落，不是雪或大量来信|av · a · lanche|the -lanche ending|结尾是 -lanche
      landslide|rock and earth closing a mountain road|a loosened hillside sending rocks onto a road|a quarry wall sending boulders and dirt down a slope|a landslide is falling earth and rock; a mudslide is wet mud|landslide 是土石滑落；mudslide 是泥浆|mudslide is wet mud flowing, not rocks and boulders crashing down|mudslide 是泥浆流动，不是岩石巨砾滚落|avalanche is falling snow, not earth and rock|avalanche 是雪崩，不是土石|land · slide|land followed by slide|land 加 slide
      mudslide|homes swept away in a river of wet mud|a hillside turned to mud by heavy rain|thick wet mud blocking a river|a mudslide is wet mud; a landslide is mostly rock and earth|mudslide 是泥浆；landslide 主要是土石|landslide is mostly dry rock and earth, but here everything is wet mud|landslide 主要是土石，而这里全是湿泥|avalanche is falling snow, not mud|avalanche 是雪崩，不是泥浆|mud · slide|mud followed by slide|mud 加 slide
      torrent|a stream rushing fast between rocks after a storm|angry words pouring out as fast as rushing water|water foaming fast down a gutter|a torrent is a fast stream; a hurricane is a windstorm|torrent 是湍流；hurricane 是飓风|hurricane is a windstorm, not a fast stream of water or words|hurricane 是飓风，不是湍急的水流或滔滔话语|mudslide is sliding mud, not rushing water or words|mudslide 是泥浆滑落，不是奔流的水或话语|tor · rent|the double r|双写 r
      deluge|a flood ruining every crop in a valley|hundreds of calls all at once|rain flooding the streets in minutes|a deluge is a great flood; a hurricane is a windstorm|deluge 是大洪水；hurricane 是飓风|hurricane is a windstorm, not a flood or hundreds of calls|hurricane 是飓风，不是洪水或大量来电|mudslide is sliding mud, not a flood of rain or calls|mudslide 是泥浆滑落，不是大雨或大量来电|de · luge|the -uge ending|结尾是 -uge
      engulf|flames swallowing a house|waves swallowing a little boat|panic sweeping over a crowd|engulf swallows something completely; drown kills under water|engulf 完全吞没；drown 淹死|drown means to die under water, not to swallow a house or sweep over a crowd|drown 指淹死，不是吞没房屋或席卷人群|erupt means to burst out, and it does not take a house, a boat or a crowd as its object|erupt 指喷发，不能带房屋、船或人群作宾语|en · gulf|en- followed by gulf|en- 加 gulf
      drown|people unable to stay above flood water|falling into deep water|a weak swimmer without a life jacket|drown dies under water; engulf swallows something up|drown 淹死；engulf 吞没|engulf needs something to swallow and cannot stand alone like this|engulf 需要宾语，不能这样单独使用|erupt means to burst out, not to die under water|erupt 指喷发，不是淹死|drown|the -own ending, as in town|结尾 -own，同 town
      erupt|a volcano shooting lava and ash|fighting bursting out suddenly at night|a crowd bursting into cheers|erupt bursts out; quake shakes|erupt 爆发；quake 颤抖|quake means to shake, not to shoot out lava or burst into cheers|quake 指颤抖，不是喷出岩浆或爆发欢呼|drown means to die under water, not to burst out|drown 指淹死，不是爆发|e · rupt|the root rupt, meaning break|词根 rupt 意为破裂
      quake|a whole body trembling with fear|walls shaking when a heavy truck passes|knees shaking so hard he had to sit|quake shakes; erupt bursts out|quake 颤抖；erupt 爆发|erupt means to burst out suddenly, not to tremble|erupt 指突然爆发，不是颤抖|drown means to die under water, not to shake|drown 指淹死，不是颤抖|quake|the qu and the -ake ending|有 qu，结尾 -ake
    `,
  },
);

const wrecking = batch(
  "words-of-wrecking-and-remains",
  ["Words of Wrecking and Remains", "毁坏与残余的词"],
  ["breaking down, wiping out and what is left", "拆毁、根除与残留物"],
  `
  demolish|to pull or knock down a building; to destroy|拆除；推翻|They will ___ the old school with a wrecking ball and build a new one.|Bulldozers will ___ the empty factory, knocking it to the ground.|The city plans to ___ the crumbling tower, knocking it down with explosives.|dismantle,salvage|demolished,demolition
  dismantle|to take apart|拆开|He chose to ___ the engine, taking it apart piece by piece to clean it.|We had to ___ the tent, taking down the poles and folding it away.|The kids love to ___ old clocks, taking them apart to see how they work.|demolish,shatter|dismantled
  shatter|to break suddenly into pieces; to damage badly|粉碎|A stone can ___ the window, breaking it into a thousand pieces.|The glass will ___ into tiny pieces if you drop it on the floor.|The bad news may ___ her hopes, breaking them suddenly.|dismantle,salvage|shattered,shattering
  ruin|to destroy or spoil|毁坏|Heavy rain may ___ the picnic, spoiling the whole day.|Don't ___ your new shoes by wearing them in the mud.|One bad decision can ___ a whole career, destroying years of work.|salvage,dismantle|ruined,ruinous
  eradicate|to destroy completely; to put an end to|根除|Doctors hope to ___ the disease completely, so no one ever catches it again.|They tried to ___ poverty, ending it for good.|Some weeds are hard to ___, because their roots grow back no matter what you do.|dismantle,salvage|eradicated,eradication
  rubble|broken fragments of stone or brick|瓦砾|The house was reduced to ___, a heap of broken bricks and stone.|Rescuers dug through the ___ of broken bricks and stones, looking for survivors.|Piles of ___, broken stone and brick, lay in the street after the bombing.|remnant,menace|
  wreckage|the remains of something badly damaged|残骸|They searched the ___ of the crashed plane for survivors.|The twisted ___ of the car lay in the field, crushed beyond repair.|Pieces of ___ from the sunken ship washed ashore.|rubble,remnant|
  remnant|a small remaining quantity|残余|A small ___ of the army escaped, the last few soldiers left.|She bought a ___ of cloth, the last small piece left on the roll.|The old wall is a ___ of the ancient city, all that is left of it.|rubble,wreckage|remnants
  scrap|a small piece; waste metal|碎片；废料|Write the number on a ___ of paper; any small torn piece will do.|The old car was sold for ___, crushed for its metal.|He kept every ___ of metal in his shed to make tools from it.|rubble,morsel|scrapped,scraps
  salvage|to rescue from loss or wreck|抢救|Divers tried to ___ the sunken ship's cargo, rescuing what they could.|She managed to ___ her reputation after the scandal, saving it from disaster.|After the fire, we tried to ___ whatever we could from the house.|ruin,eradicate|salvaged
  `,
  "context-clues",
  {
    intro: t(
      "After the earthquake, workers had to **demolish** the cracked hospital, dig through the **rubble** for survivors and **salvage** whatever equipment they could. These ten words help you describe things being destroyed and what is left behind.",
      "地震过后，工人们不得不拆除（**demolish**）开裂的医院，在瓦砾（**rubble**）中寻找幸存者，并抢救（**salvage**）尽可能多的设备。这十个词帮你描述东西被毁以及留下的残余。",
    ),
    watchOut: {
      meanings: t(
        "To **demolish** is to *knock down* a building; to **dismantle** is to *take apart* piece by piece, often carefully; to **eradicate** is to *wipe out completely*, so it never comes back.",
        "**demolish** 是推倒建筑；**dismantle** 是一件件拆开，常是小心地拆；**eradicate** 是彻底根除，不再出现。",
      ),
      use: t(
        "**Rubble** is broken *stone and brick* from buildings; **wreckage** is what is left of a crashed *vehicle* such as a car, plane or ship; a **remnant** is a small part that *remains*.",
        "**rubble** 是建筑留下的碎砖石；**wreckage** 是撞毁的车、飞机或船的残骸；**remnant** 是剩下的一小部分。",
      ),
      spelling: t(
        "**Wreckage** begins with a silent *w*; **rubble** has a double *b*; **eradicate** has one *r* after the *e*.",
        "**wreckage** 开头的 w 不发音；**rubble** 双写 b；**eradicate** 的 e 后只有一个 r。",
      ),
    },
    notes: `
      demolish|a wrecking ball knocking down an old school|bulldozers knocking a factory to the ground|explosives knocking down a crumbling tower|demolish knocks down; dismantle takes apart carefully|demolish 推倒；dismantle 小心拆开|dismantle means to take apart piece by piece, not to knock down with a wrecking ball, bulldozers or explosives|dismantle 指一件件拆开，不是用铁球、推土机或炸药推倒|salvage means to rescue something from loss, the opposite of knocking it down|salvage 指抢救，与推倒正相反|de · mol · ish|the -mol- in the middle|中间是 -mol-
      dismantle|taking an engine apart piece by piece to clean it|taking down a tent's poles and folding it|taking clocks apart to see how they work|dismantle takes apart; demolish knocks down|dismantle 拆开；demolish 推倒|demolish means to knock something down, not to take it apart so it can be cleaned or packed|demolish 指推倒，不是拆开清洗或收好|shatter means to break into pieces, not to take apart carefully|shatter 指打碎，不是小心拆开|dis · man · tle|dis- followed by mantle|dis- 加 mantle
      shatter|a stone breaking a window into a thousand pieces|glass breaking into tiny pieces when dropped|bad news suddenly breaking hopes|shatter breaks suddenly into pieces; dismantle takes apart|shatter 突然打碎；dismantle 拆开|dismantle means to take apart carefully, not to break suddenly into pieces|dismantle 指小心拆开，不是突然碎成片|salvage means to rescue something, the opposite of breaking it|salvage 指抢救，与打碎正相反|shat · ter|the double t|双写 t
      ruin|rain spoiling a whole day's picnic|mud spoiling new shoes|one decision destroying years of work|ruin spoils or destroys; salvage rescues|ruin 毁掉；salvage 抢救|salvage means to rescue something, the opposite of spoiling it|salvage 指抢救，与毁掉正相反|dismantle means to take apart carefully, not to spoil a picnic, shoes or a career|dismantle 指拆开，不是毁掉野餐、鞋或事业|ru · in|two syllables, ru and in|两个音节 ru 和 in
      eradicate|a disease that no one ever catches again|ending poverty for good|weeds whose roots grow back|eradicate wipes out completely; dismantle takes apart|eradicate 彻底根除；dismantle 拆开|dismantle means to take something apart, not to end a disease or poverty for good|dismantle 指拆开，不是永远消灭疾病或贫困|salvage means to rescue something, the opposite of wiping it out|salvage 指抢救，与根除正相反|e · rad · i · cate|one r after the e|e 后只有一个 r
      rubble|a heap of broken bricks and stone from a house|rescuers digging through broken bricks for survivors|piles of broken stone and brick after a bombing|rubble is broken stone and brick; a remnant is a small part left over|rubble 是碎砖石；remnant 是剩下的一小部分|remnant is a small remaining part, not heaps of broken bricks and stone|remnant 是剩下的一小部分，不是成堆的碎砖石|menace is a threat, not broken stone and brick|menace 是威胁，不是碎砖石|rub · ble|the double b and the -le ending|双写 b，结尾是 -le
      wreckage|searching a crashed plane for survivors|the crushed, twisted remains of a car|pieces of a sunken ship washing ashore|wreckage is what is left of a crashed vehicle; rubble is broken stone and brick|wreckage 是车船飞机的残骸；rubble 是碎砖石|rubble is broken stone and brick from buildings, not the remains of a plane, a car or a ship|rubble 是建筑的碎砖石，不是飞机、汽车或船的残骸|remnant is a small part left over, not twisted, crushed pieces of a vehicle|remnant 是剩下的一小部分，不是扭曲压碎的车船残片|wreck · age|the silent w and the -age ending|w 不发音，结尾是 -age
      remnant|the last few soldiers of an army|the last small piece of cloth on a roll|a wall that is all that is left of a city|a remnant is a small part that remains; rubble is broken stone|remnant 是剩下的一小部分；rubble 是碎石|rubble is broken stone and brick, not the last few soldiers or a piece of cloth|rubble 是碎砖石，不是最后几个士兵或一块布|wreckage is the remains of a crashed vehicle, not what remains of an army or a roll of cloth|wreckage 是车船飞机的残骸，不是军队或布匹剩下的部分|rem · nant|the -nant ending|结尾是 -nant
      scrap|any small torn piece of paper|an old car crushed for its metal|metal kept to make tools|a scrap is a small piece or waste metal; rubble is broken stone|scrap 是碎片或废金属；rubble 是碎石|rubble is broken stone and brick, not a piece of paper or waste metal|rubble 是碎砖石，不是纸片或废金属|morsel is a small piece of food, not paper or metal|morsel 是一小块食物，不是纸或金属|scrap|the scr- at the start|开头是 scr-
      salvage|divers rescuing a sunken ship's cargo|saving a reputation from disaster after a scandal|saving whatever could be saved from a burned house|salvage rescues from loss; ruin destroys|salvage 抢救；ruin 毁掉|ruin means to destroy or spoil, the opposite of rescuing|ruin 指毁掉，与抢救正相反|eradicate means to wipe out completely, the opposite of rescuing|eradicate 指彻底根除，与抢救正相反|sal · vage|the -vage ending|结尾是 -vage
    `,
  },
);

const blunders = batch(
  "words-of-blunders-and-snags",
  ["Words of Blunders and Snags", "失误与障碍的词"],
  ["big and small mistakes and things that go wrong", "大小错误与出岔子的事"],
  `
  blunder|a stupid or careless mistake|大错|Calling the guest by the wrong name was a big ___ that embarrassed everyone.|He made a terrible political ___, insulting the very voters he needed.|Sending the secret email to the whole office was a careless ___ she deeply regretted.|defect,hiccup|blundered
  bungle|to carry out a task clumsily|搞砸|The clumsy thieves managed to ___ the robbery, setting off every alarm in the bank.|Don't ___ this chance by doing it carelessly; you won't get another one.|Officials managed to ___ the rescue, clumsily sending the boats to the wrong town.|salvage,thwart|bungled
  botch|to do badly or carelessly|弄糟|The careless builder managed to ___ the roof, and now it leaks everywhere.|Don't ___ the repair by rushing it; do it carefully.|The cook would ___ every meal, burning the meat and over-salting the soup.|salvage,savor|botched
  fumble|to use the hands clumsily; to drop a ball|笨手笨脚地摸索；漏接|She began to ___ with her keys, her cold fingers too clumsy to find the right one.|If you ___ the ball near the goal line, the other team may grab it.|Nervous, he would ___ his words, stumbling over every line.|salvage,dazzle|fumbled
  fiasco|a complete and humiliating failure|惨败|The party was a complete ___: the cake fell, the lights failed and everyone left early.|The launch turned into a ___, a total and embarrassing failure.|The school play was a ___, so bad that the audience walked out.|lapse,hiccup|
  misstep|a badly judged act; a wrong step|失策；失足|One ___ on the icy stairs and she fell, twisting her ankle.|A single ___ on the narrow ledge could send the climber falling.|Raising prices was a ___, a badly judged move that drove customers away.|lapse,defect|missteps
  lapse|a brief failure of attention or memory; the passing of time|疏忽；流逝|It was a ___ of memory; for a moment she simply forgot his name.|A brief ___ of attention at the wheel caused the crash.|After a ___ of ten years, the old friends met again.|misstep,defect|lapsed,lapses
  defect|a fault|缺陷|The car has a ___ in its brakes, a fault from the factory.|He was born with a heart ___, a fault in one of its valves.|Every phone with this ___ in its battery, a fault in the design, will be replaced.|lapse,snag|defective,defected,defector
  snag|an unexpected problem|意外障碍|The plan is good; there's just one ___: we have no money.|We hit an unexpected ___ when we found the hall was double booked.|The only ___ was that the shop had closed early, a small problem we hadn't foreseen.|defect,fiasco|snagged
  hiccup|a small problem|小问题|There was a small ___ in the plan when the bus came late, but we still arrived on time.|Apart from a brief ___ with the sound, the show went smoothly.|A minor ___ delayed us for ten minutes, nothing more.|fiasco,defect|hiccups
  `,
  "context-clues",
  {
    intro: t(
      "The school concert began with a small **hiccup** when the microphone failed, but then the stage manager would **fumble** every cue and **botch** the lights, and the night ended as a **fiasco**. These ten words help you describe mistakes and things that go wrong, from tiny slips to complete failures.",
      "学校音乐会开场时出了个小问题（**hiccup**）——话筒坏了；接着舞台监督手忙脚乱（**fumble**），把每个提示都弄错，灯光也弄糟（**botch**）了，整晚以一场惨败（**fiasco**）收场。这十个词帮你描述各种失误和出岔子的事，从小差错到彻底失败。",
    ),
    watchOut: {
      meanings: t(
        "A **hiccup** or **snag** is a *small* problem; a **blunder** is a *stupid mistake* someone makes; a **fiasco** is a *complete*, embarrassing failure; a **lapse** is a *brief* failure of memory or attention.",
        "**hiccup** 和 **snag** 是小问题；**blunder** 是人犯的愚蠢错误；**fiasco** 是彻底而丢脸的失败；**lapse** 是一时的记忆或注意力失误。",
      ),
      use: t(
        "You **bungle** or **botch** a *task* by doing it badly, but you **fumble** with your *hands*, for keys or a ball, or with your words; a **defect** is a fault *in a thing*, not a mistake a person makes.",
        "**bungle** 和 **botch** 是把一件事办砸；**fumble** 是手上笨拙，摸钥匙、接球，或说话结巴；**defect** 是物品本身的缺陷，不是人犯的错。",
      ),
      spelling: t(
        "**Misstep** has a double *s* (*mis* + *step*); **hiccup** has a double *c*; **fiasco** ends in *-sco*.",
        "**misstep** 双写 s（mis + step）；**hiccup** 双写 c；**fiasco** 以 -sco 结尾。",
      ),
    },
    notes: `
      blunder|calling a guest by the wrong name|insulting the very voters he needed|a secret email sent to the whole office|a blunder is a stupid mistake someone makes; a hiccup is a small problem that happens|blunder 是人犯的愚蠢错误；hiccup 是发生的小问题|defect is a fault in a thing, not a careless mistake a person makes|defect 是物品的缺陷，不是人犯的粗心错误|hiccup is a small problem, not a big, embarrassing mistake|hiccup 是小问题，不是令人难堪的大错|blun · der|the -der ending|结尾是 -der
      bungle|thieves setting off every alarm in a bank|a chance ruined by doing it carelessly|officials clumsily sending boats to the wrong town|bungle does a task clumsily; thwart stops someone else's plan|bungle 自己办砸；thwart 挫败他人的计划|salvage means to rescue something, the opposite of doing it clumsily|salvage 指抢救，与办砸正相反|thwart means to stop someone else's plan, but here people spoil their own task|thwart 指挫败他人的计划，而这里是人们搞砸自己的事|bun · gle|the -gle ending|结尾是 -gle
      botch|a roof that now leaks everywhere|a repair rushed instead of done carefully|meals with burned meat and over-salted soup|botch does something badly; salvage rescues it|botch 弄糟；salvage 抢救|salvage means to rescue something, the opposite of doing it badly|salvage 指抢救，与弄糟正相反|savor means to enjoy food slowly, not to cook it badly or rush a repair|savor 指慢慢品味，不是把饭做糟或草草修理|botch|the -tch ending|结尾是 -tch
      fumble|cold fingers too clumsy to find the right key|a dropped ball near a goal line|stumbling over every line when nervous|fumble handles something clumsily; salvage rescues it|fumble 手忙脚乱；salvage 抢救|salvage means to rescue something, not to handle keys, a ball or words clumsily|salvage 指抢救，不是笨拙地摸钥匙、接球或说话|dazzle means to blind or amaze, not to handle something clumsily|dazzle 指使目眩或惊叹，不是手忙脚乱|fum · ble|the -ble ending|结尾是 -ble
      fiasco|a party where the cake fell and the lights failed|a launch that was a total, embarrassing failure|a play so bad the audience walked out|a fiasco is a complete failure; a hiccup is a small problem|fiasco 是彻底失败；hiccup 是小问题|lapse is a brief slip of memory or attention, not a complete failure|lapse 是一时疏忽，不是彻底失败|hiccup is a small problem, not a total, embarrassing failure|hiccup 是小问题，不是彻底而丢脸的失败|fi · as · co|the -sco ending|结尾是 -sco
      misstep|a wrong step on icy stairs|a wrong step on a narrow ledge|a badly judged move on prices|a misstep is a wrong step or move; a lapse is a slip of memory or attention|misstep 是走错一步或失策；lapse 是一时疏忽|lapse is a brief failure of memory or attention, not a wrong step with the feet or a bad business move|lapse 是一时的疏忽，不是脚下踩错或经营失策|defect is a fault in a thing, not a wrong step or move|defect 是物品的缺陷，不是走错一步|mis · step|the double s, mis plus step|双写 s，mis 加 step
      lapse|forgetting a name for a moment|a brief failure of attention at the wheel|ten years passing before friends meet again|a lapse is a brief slip or a passing of time; a misstep is a badly judged act|lapse 是一时疏忽或时间流逝；misstep 是失策|misstep is a badly judged act, not a moment of forgetting or a period of time|misstep 指失策，不是一时忘记或一段时间|defect is a fault in a thing, not a slip of memory or a period of time|defect 是物品的缺陷，不是一时忘记或一段时间|lapse|the -pse ending|结尾是 -pse
      defect|a factory fault in a car's brakes|a fault in one of the heart's valves|a design fault in a phone battery|a defect is a fault in a thing; a lapse is a person's brief slip|defect 是物品的缺陷；lapse 是人的一时疏忽|lapse is a brief slip of a person's memory or attention, not a fault in brakes, a heart or a battery|lapse 是人的一时疏忽，不是刹车、心脏或电池的缺陷|snag is an unexpected problem with a plan, not a fault built into a thing|snag 是计划中的意外问题，不是物品本身的缺陷|de · fect|de- followed by fect|de- 加 fect
      snag|a plan with one problem: no money|a hall that turns out to be double booked|a shop that closed early, a problem no one foresaw|a snag is an unexpected problem; a defect is a fault in a thing|snag 是意外问题；defect 是物品的缺陷|defect is a fault built into a thing, not an unexpected problem with a plan|defect 是物品本身的缺陷，不是计划中的意外问题|fiasco is a complete failure, not one small problem|fiasco 是彻底失败，不是一个小问题|snag|s-n-a-g, doubled g in snagged|snagged 双写 g
      hiccup|a late bus that still let us arrive on time|a brief problem with the sound in a smooth show|a minor delay of ten minutes|a hiccup is a small, brief problem; a fiasco is a complete failure|hiccup 是短暂的小问题；fiasco 是彻底失败|fiasco is a complete failure, but here things still go smoothly or on time|fiasco 指彻底失败，而这里事情仍顺利或准时|defect is a fault built into a thing, not a brief delay|defect 是物品的缺陷，不是短暂的耽搁|hic · cup|the double c|双写 c
    `,
  },
);

/** batchesD are the batches of eating, looking, tiredness, the odd and dull, danger, disasters, wrecking and blunders. */
export const batchesD: readonly BatchSpec[] = [eating, looking, tiredness, odd, danger, disasters, wrecking, blunders];
