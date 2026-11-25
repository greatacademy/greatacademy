// Grade 12: the batches of words of change and decay, order and chaos, plenty and want, manners, effort and idleness,
// and the ages of life.

import { t } from "@ga/content";
import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const change = batch(
  "words-of-change-and-constancy",
  ["Words of Change and Constancy", "变化与恒常的词"],
  ["things that change and things that do not", "变化之物与不变之物"],
  `
  metamorphosis|a complete change of form, as from caterpillar to butterfly|变形，蜕变|The ___ of a tadpole into a frog, a complete change of body and form, takes several weeks.|After the factory opened, the sleepy village went through a total ___, its whole form changing into that of a busy town.|Kafka's story begins with a strange ___: a man wakes to find his body changed completely into an insect's.|vicissitude,flux|metamorphoses
  transmute|to change something completely into something else|使变形，使嬗变|Alchemists tried to ___ lead into gold, changing one metal completely into another.|The artist tried to ___ her pain into beauty, turning it wholly into paintings full of light.|Over the years his grief began to ___ into anger, changing from one feeling entirely into the other.|oscillate,fluctuate|transmuted,transmutation
  mutable|able or likely to change|易变的|Fashion is highly ___, changing so often that last year's coat already looks old.|Our plans are still ___ until Friday; we may change them several times before then.|In spring the weather is ___, likely to change from sun to rain within an hour.|immutable,inert|mutability
  immutable|never changing; unable to be changed|不可改变的|The laws of physics seem ___, the same today as billions of years ago and impossible to alter.|Her opinion on the matter was ___; nothing anyone said could ever change it.|Some think the rules of grammar are ___, but in fact they have shifted greatly over the centuries.|mutable,volatile|immutability
  flux|continuous change|不断的变化|The market is in a state of ___, with prices changing continuously from hour to hour.|After the election the country was in ___, its laws and leaders changing week after week without pause.|Language is always in ___, its words and meanings shifting constantly from one generation to the next.|metamorphosis,vicissitude|
  vicissitude|a change of circumstances, especially an unwelcome one|变迁，兴衰|She survived every ___ of fortune, from losing her job to losing her home, with courage.|The family faced each ___ of life together: the floods, the illness and the hard years of war.|The book follows every ___ of the war, each sudden turn for the worse in the soldiers' fortunes.|flux,metamorphosis|vicissitudes
  fluctuate|to rise and fall irregularly|波动|Vegetable prices ___ from week to week, rising after a frost and falling again when the harvest comes in.|In the desert, temperatures ___ wildly, rising to fifty degrees by day and dropping below freezing at night.|The number of visitors tends to ___ through the year, rising in summer and dropping in winter.|transmute,vacillate|fluctuated,fluctuating,fluctuation,fluctuations
  oscillate|to swing back and forth; to move between two states|摆动；动摇|The pendulum began to ___, swinging steadily back and forth from left to right.|The fan's head is built to ___, turning smoothly from side to side to cool the whole room.|A plucked guitar string will ___ back and forth hundreds of times each second, which is what makes its sound.|transmute,fluctuate|oscillated,oscillating,oscillation
  vacillate|to keep changing one's mind|犹豫不决，摇摆|He tends to ___ between the two job offers, choosing one in the morning and the other by night.|Don't ___ any longer; make up your mind and choose one today.|The council began to ___ on the plan, voting for it one week and changing its mind the next.|transmute,fluctuate|vacillated,vacillating,vacillation
  waver|to become unsteady or uncertain|动摇；摇曳|Her voice did not ___ once as she told the court what she had seen; it stayed steady and firm.|The candle flame began to ___ in the draft, flickering unsteadily before it went out.|His courage began to ___ as the cliff edge came nearer, and his legs grew unsteady beneath him.|transmute,vacillate|wavered,wavering
  `,
  "context-clues",
  {
    intro: t(
      "Life is in constant **flux**: a quiet village may undergo a **metamorphosis**, prices **fluctuate** from week to week, and even firm opinions can **waver**. These ten words help you describe things that change, swing back and forth or never change at all.",
      "生活总在不断变化（**flux**）：安静的村庄可能彻底蜕变（**metamorphosis**），物价每周都在波动（**fluctuate**），连坚定的看法也会动摇（**waver**）。这十个词帮你描写不断变化的、来回摆动的和永远不变的事物。",
    ),
    watchOut: {
      meanings: t(
        "**Flux** is *continuous* change; a **metamorphosis** is one *complete* change of form; a **vicissitude** is a change of *fortune*, usually for the worse.",
        "**flux** 是*持续不断*的变化；**metamorphosis** 是一次*彻底*的形态改变；**vicissitude** 是*命运*的变迁，通常是变坏。",
      ),
      use: t(
        "**Fluctuate** is for prices and levels that rise and fall; **oscillate** is to swing *back and forth* like a pendulum; **vacillate** is for a *person* who keeps changing his mind.",
        "**fluctuate** 用于价格、数值的起伏；**oscillate** 指像钟摆一样*来回*摆动；**vacillate** 用于不断改变主意的*人*。",
      ),
      spelling: t(
        "**Vicissitude** has *-ciss-* in the middle; **vacillate** has one *c* and a double *l*; **oscillate** has *sc* and a double *l*; **fluctuate** has *-ctu-*.",
        "**vicissitude** 中间是 -ciss-；**vacillate** 一个 c、双写 l；**oscillate** 含 sc，并双写 l；**fluctuate** 中间是 -ctu-。",
      ),
    },
    notes: `
      metamorphosis|a tadpole's complete change of body and form into a frog|a sleepy village whose whole form changed into a busy town|a man whose body changed completely into an insect's|a metamorphosis is one complete change of form; flux is change that never stops|metamorphosis 是一次彻底的形态改变；flux 是从不停止的变化|vicissitude is a change of fortune, usually unwelcome, not a complete change of body or form|vicissitude 是命运的变迁，多为不幸，不是身体或形态的彻底改变|flux is continuous change with no end point, not one complete change from one form into another|flux 是没有终点的持续变化，不是从一种形态彻底变成另一种|met · a · mor · pho · sis|the ph that sounds like f, and the -osis ending|ph 读作 f，结尾是 -osis
      transmute|alchemists changing one metal completely into another|an artist turning her pain wholly into paintings full of light|grief changing entirely into anger over the years|transmute changes one thing wholly into another; oscillate swings back and forth|transmute 把一物彻底变成另一物；oscillate 来回摆动|oscillate means to swing back and forth between two points, not to change one thing completely into another|oscillate 指在两点之间来回摆动，不是把一物彻底变成另一物|fluctuate means to rise and fall irregularly, not to turn wholly into something new|fluctuate 指不规则地起伏，不是彻底变成新的东西|trans · mute|trans- plus mute|trans- 加 mute
      mutable|fashion changing so often that last year's coat looks old|plans that may change several times before Friday|spring weather likely to turn from sun to rain within an hour|mutable means likely to change; immutable means never changing|mutable 易变；immutable 永不改变|immutable means never changing, the opposite of likely to change|immutable 指永不改变，和容易改变正相反|inert means not moving or not reacting, the opposite of changing often|inert 指静止不动或不起反应，和经常变化正相反|mu · ta · ble|mute drops its e before -able|mute 去掉 e，再接 -able
      immutable|laws of physics the same as billions of years ago|an opinion that nothing anyone said could change|grammar rules some think fixed, though they have shifted|immutable means unable to change; mutable means likely to change|immutable 不可改变；mutable 易变|mutable means able or likely to change, the opposite of never changing|mutable 指可能改变，和永不改变正相反|volatile means likely to change suddenly, the opposite of staying the same forever|volatile 指容易突然变化，和永远不变正相反|im · mu · ta · ble|the double m of im- plus mutable|im- 加 mutable，双写 m
      flux|a market with prices changing continuously hour to hour|a country whose laws and leaders changed week after week|language whose words and meanings shift constantly|flux is continuous change; a vicissitude is one turn of fortune|flux 是持续变化；vicissitude 是一次命运的转折|metamorphosis is one complete change of form, not change that goes on and on without stopping|metamorphosis 是一次彻底的形态改变，不是持续不停的变化|vicissitude is a single change of fortune, usually for the worse, not a state of constant change|vicissitude 是一次命运的变化，多为变坏，不是持续变化的状态|flux|the -ux ending, as in deluxe|结尾是 -ux，同 deluxe
      vicissitude|losing a job and then a home, survived with courage|floods, illness and years of war faced together by a family|each sudden turn for the worse in soldiers' fortunes|a vicissitude is one change of fortune; flux is continuous change|vicissitude 是一次命运的变化；flux 是持续的变化|flux is a state of continuous change, not one unwelcome change in someone's fortune|flux 是持续变化的状态，不是某人命运中的一次不幸变化|metamorphosis is a complete change of form, not a change of fortune or circumstances|metamorphosis 是形态的彻底改变，不是命运或处境的变化|vi · cis · si · tude|-ciss- in the middle, then -itude|中间是 -ciss-，结尾 -itude
      fluctuate|vegetable prices rising after a frost and falling at harvest|desert temperatures rising by day and dropping at night|visitor numbers rising in summer and dropping in winter|fluctuate rises and falls; vacillate keeps changing one's mind|fluctuate 起伏不定；vacillate 不断改变主意|transmute means to change something completely into something else, not to rise and fall|transmute 指彻底变成另一物，不是起伏涨落|vacillate means a person keeps changing his mind, not that numbers rise and fall|vacillate 指人拿不定主意，不是数值起伏|fluc · tu · ate|-ctu- in the middle, then -ate|中间是 -ctu-，结尾 -ate
      oscillate|a pendulum swinging steadily back and forth|a fan's head turning smoothly from side to side|a guitar string swinging back and forth hundreds of times a second|oscillate swings back and forth regularly; fluctuate rises and falls irregularly|oscillate 有规律地来回摆动；fluctuate 不规则地起伏|transmute means to change something wholly into something else, not to swing back and forth|transmute 指彻底变成另一物，不是来回摆动|fluctuate means to rise and fall irregularly, not to swing steadily from side to side|fluctuate 指不规则地起伏，不是稳定地左右摆动|os · cil · late|the sc and the double l|含 sc，并双写 l
      vacillate|a man choosing one job offer in the morning and the other at night|a plea to make up one's mind and choose today|a council voting for a plan and then changing its mind|vacillate keeps changing one's mind; fluctuate rises and falls|vacillate 拿不定主意；fluctuate 起伏|transmute means to change something completely into something else, not to keep changing one's mind|transmute 指彻底变成另一物，不是一再改变主意|fluctuate means to rise and fall, as prices do, not to keep changing one's decision|fluctuate 指像价格那样起伏，不是一再改变决定|vac · il · late|one c and a double l|一个 c，双写 l
      waver|a voice that stayed steady and firm in court|a candle flame flickering unsteadily in a draft|courage growing unsteady near a cliff edge|waver means to become unsteady; vacillate means to keep changing one's mind|waver 变得不稳；vacillate 拿不定主意|transmute means to change something completely into something else, not to become unsteady|transmute 指彻底变成另一物，不是变得不稳|vacillate means to keep changing one's mind between choices, not to flicker or grow unsteady|vacillate 指在选择之间摇摆不定，不是摇曳或变得不稳|wa · ver|the -er ending, with one v|只有一个 v，结尾 -er
    `,
  },
);

const decay = batch(
  "words-of-decay-and-ruin",
  ["Words of Decay and Ruin", "衰败与毁坏的词"],
  ["things that rot, wear out and fall apart", "腐烂、磨损和崩塌之物"],
  `
  dilapidated|in a state of disrepair because of age or neglect|破旧的，失修的|They bought a ___ farmhouse, its roof sagging and its windows broken after fifty years of neglect, and rebuilt it.|The ___ old bus, its seats torn and its doors held shut with wire, barely made it up the hill.|A ___ fence, its boards cracked and leaning after years without repair, surrounded the yard.|rancid,moribund|dilapidation
  ramshackle|badly made and likely to fall apart|摇摇欲坠的|A ___ hut of scrap wood and tin, nailed together in a hurry, stood by the river.|The team's ___ defense, thrown together at the last minute, fell apart and let in five goals.|They lived in a ___ old caravan, so badly patched together that it shook in every wind.|rancid,moribund|
  derelict|abandoned and in very poor condition|废弃的，荒废的|A ___ factory, abandoned twenty years ago, stood empty and crumbling at the edge of town.|The ___ ship, left behind by its owners, rusted alone in the harbor.|Rows of ___ houses, deserted by their owners and falling apart, lined the street.|rancid,moribund|
  decrepit|old and in poor condition|衰老的，破旧的|A ___ old horse, weak and bony with age, pulled the cart slowly up the lane.|The ___ hotel, worn out by a century of use, had no hot water and creaking floors.|His ___ uncle, frail and bent with great age, walked with two sticks.|putrid,rancid|decrepitude
  moribund|close to death; no longer active|垂死的，停滞不前的|The ___ industry, losing money and workers every year, seemed close to dying altogether.|The patient was ___, so close to death that the family was called to his bedside.|The ___ town, its life slowly ending, lost its last shop and then its last school.|rancid,ramshackle|
  putrid|rotting and smelling very bad|腐烂发臭的|A ___ smell of rotting food came from the blocked drain.|Left in the sun for a week, the meat had turned ___, rotting and stinking.|They held their noses at the ___ pond, where dead fish lay rotting in the mud.|derelict,decrepit|
  rancid|smelling or tasting unpleasant because it is no longer fresh, especially of fat or oil|(油脂)变质的，腐臭的|The butter had gone ___, its fat no longer fresh and tasting sour.|A ___ smell of old frying oil filled the kitchen.|Nuts kept too long can taste ___, because the oil in them goes stale.|moribund,derelict|
  decompose|to rot or break down into simpler parts|腐烂，分解|Fallen leaves ___ on the forest floor, rotting and breaking down to feed the soil.|Plastic takes centuries to ___, because tiny creatures cannot break it down into simpler parts.|Dead plants slowly ___ in the compost heap, breaking down into rich, dark earth.|atrophy,fester|decomposed,decomposition
  atrophy|to waste away from lack of use; a wasting away|萎缩|Muscles ___ if they are not used, wasting away until they grow weak and thin.|Skills ___ when you stop practicing them, slowly wasting away through lack of use.|After weeks in a cast, the muscles of his leg had begun to ___, shrinking from lack of exercise.|fester,decompose|atrophied
  fester|to become infected; to grow worse over time|化脓；恶化|The cut on his foot began to ___, turning red, swollen and full of pus.|Old grudges ___ in small towns, growing more bitter year after year.|Don't let the problem ___; if you ignore it, it will only grow worse.|atrophy,decompose|festered,festering
  `,
  "context-clues",
  {
    intro: t(
      "At the edge of town a **derelict** factory stood beside a **ramshackle** hut, its **dilapidated** walls crumbling, while a **putrid** smell rose from the blocked drain. These ten words help you describe buildings that fall apart, food that rots and bodies and problems that waste away or grow worse.",
      "镇子边上，一座废弃的（**derelict**）工厂旁立着一间摇摇欲坠的（**ramshackle**）小屋，失修的（**dilapidated**）墙壁正在崩塌，堵塞的下水道里冒出腐臭的（**putrid**）气味。这十个词帮你描写倒塌的建筑、腐烂的食物，以及日渐萎缩或不断恶化的身体和问题。",
    ),
    watchOut: {
      meanings: t(
        "**Derelict** means *abandoned*; **dilapidated** means fallen into disrepair through age or neglect; **ramshackle** means badly *built* in the first place.",
        "**derelict** 指被*遗弃*；**dilapidated** 指因年久或疏于维护而失修；**ramshackle** 指当初就*建得*粗糙。",
      ),
      use: t(
        "**Putrid** is for anything rotting and stinking; **rancid** is for *fat or oil* gone off, like butter. **Atrophy** is wasting away from *lack of use*; **fester** is a wound or a problem growing *worse*.",
        "**putrid** 用于任何腐烂发臭的东西；**rancid** 用于变质的*油脂*，比如黄油。**atrophy** 是因*不用*而萎缩；**fester** 是伤口或问题不断*恶化*。",
      ),
      spelling: t(
        "**Dilapidated** has *-lapid-* in the middle; **decrepit** ends in *-it*, not *-id*; **moribund** ends in *-und*; **atrophy** spells its last sound *-phy*.",
        "**dilapidated** 中间是 -lapid-；**decrepit** 结尾是 -it，不是 -id；**moribund** 结尾是 -und；**atrophy** 的尾音拼作 -phy。",
      ),
    },
    notes: `
      dilapidated|a farmhouse with a sagging roof and broken windows after fifty years of neglect|an old bus with torn seats and doors held shut with wire|a fence of cracked, leaning boards left for years without repair|dilapidated means fallen into disrepair; moribund means close to death|dilapidated 失修破败；moribund 垂死|rancid means tasting sour because fat or oil is no longer fresh, not fallen into disrepair|rancid 指油脂变质发臭，不是年久失修|moribund means close to death or no longer active, not broken and sagging from neglect|moribund 指濒临死亡或停滞，不是因疏于维护而破损塌陷|di · lap · i · dat · ed|-lapid- in the middle, then -ated|中间是 -lapid-，结尾 -ated
      ramshackle|a hut of scrap wood and tin nailed together in a hurry|a defense thrown together at the last minute that fell apart|a caravan so badly patched together that it shook in the wind|ramshackle means badly built and likely to fall apart; moribund means close to death|ramshackle 粗制滥造、摇摇欲坠；moribund 垂死|rancid means sour-tasting because fat or oil has gone off, not badly built and likely to fall apart|rancid 指油脂变质发臭，不是粗制滥造、摇摇欲坠|moribund means close to death, not thrown together badly in a hurry|moribund 指濒临死亡，不是匆忙中胡乱拼凑|ram · shack · le|ram- plus shack plus -le|ram- 加 shack 再加 -le
      derelict|a factory abandoned twenty years ago, empty and crumbling|a ship left behind by its owners, rusting alone|houses deserted by their owners and falling apart|derelict means abandoned and falling apart; decrepit means worn out by age|derelict 被遗弃而破败；decrepit 年老破旧|rancid means sour because fat or oil is no longer fresh, not abandoned by its owners|rancid 指油脂变质，不是被主人遗弃|moribund means close to death, not already abandoned and left empty|moribund 指濒临死亡，不是已被遗弃、空无一人|der · e · lict|der- plus -e- plus -lict|der- 加 -e- 再加 -lict
      decrepit|a weak, bony old horse pulling a cart|a hotel worn out by a century of use|an uncle frail and bent with great age|decrepit means worn out by age; putrid means rotting and stinking|decrepit 年老破旧；putrid 腐烂发臭|putrid means rotting and smelling very bad, not weak and worn out with age|putrid 指腐烂发臭，不是年老体衰、破旧|rancid means sour because fat or oil has gone off, not worn out by age|rancid 指油脂变质，不是因年老而破旧|de · crep · it|the -it ending, not -id|结尾是 -it，不是 -id
      moribund|an industry losing money and workers every year|a patient so close to death that the family was called|a town whose life was ending as it lost its last shop and school|moribund means close to death; ramshackle means badly built|moribund 垂死；ramshackle 粗制滥造|rancid means sour because fat or oil is no longer fresh, not close to death|rancid 指油脂变质，不是濒临死亡|ramshackle means badly made and likely to fall apart, not slowly dying|ramshackle 指粗制滥造、摇摇欲坠，不是慢慢走向死亡|mor · i · bund|the -und ending|结尾是 -und
      putrid|a smell of rotting food from a blocked drain|meat rotting and stinking after a week in the sun|a pond with dead fish rotting in the mud|putrid means rotting and stinking; decrepit means worn out by age|putrid 腐烂发臭；decrepit 年老破旧|derelict means abandoned by its owners, not rotting and stinking|derelict 指被遗弃，不是腐烂发臭|decrepit means old and worn out, not rotting with a bad smell|decrepit 指年老破旧，不是腐烂发出恶臭|pu · trid|the -id ending, as in horrid|结尾是 -id，同 horrid
      rancid|butter whose fat had gone sour|a smell of old frying oil in a kitchen|nuts whose oil had gone stale|rancid is for fat or oil gone off; putrid is for anything rotting|rancid 指油脂变质；putrid 指任何东西腐烂|moribund means close to death, not butter or oil that has gone sour|moribund 指濒临死亡，不是黄油或油变酸变质|derelict means abandoned and falling apart, not stale-tasting fat or oil|derelict 指被遗弃而破败，不是油脂变味|ran · cid|the c that sounds like s, and the -id ending|c 读作 s，结尾 -id
      decompose|fallen leaves rotting and breaking down to feed the soil|plastic that tiny creatures cannot break down|dead plants breaking down into rich earth in a compost heap|decompose rots and breaks down; atrophy wastes away from lack of use|decompose 腐烂分解；atrophy 因不用而萎缩|atrophy means to waste away from lack of use, not to rot and break down into simpler parts|atrophy 指因不用而萎缩，不是腐烂分解成更简单的成分|fester means to become infected or grow worse, not to break down into soil|fester 指化脓或恶化，不是分解成泥土|de · com · pose|de- plus compose|de- 加 compose
      atrophy|muscles wasting away until weak and thin when not used|skills slowly wasting away when practice stops|leg muscles shrinking after weeks in a cast|atrophy wastes away from lack of use; fester grows infected or worse|atrophy 因不用而萎缩；fester 化脓或恶化|fester means to become infected or grow worse, not to shrink away from lack of use|fester 指化脓或恶化，不是因不用而萎缩|decompose means to rot and break down after death, not to waste away from lack of exercise|decompose 指死后腐烂分解，不是因缺乏锻炼而萎缩|at · ro · phy|the ph that sounds like f, then -y|ph 读作 f，结尾 -y
      fester|a cut turning red, swollen and full of pus|old grudges growing more bitter year after year|an ignored problem that only grows worse|fester grows infected or worse; atrophy wastes away from lack of use|fester 化脓或恶化；atrophy 因不用而萎缩|atrophy means to waste away from lack of use, not to grow infected or more bitter|atrophy 指因不用而萎缩，不是化脓或越发怨恨|decompose means to rot and break down into simpler parts, not to grow worse over time|decompose 指腐烂分解，不是随时间不断恶化|fes · ter|fes- plus -ter, with one s|fes- 加 -ter，只有一个 s
    `,
  },
);

const order = batch(
  "words-of-order-and-chaos",
  ["Words of Order and Chaos", "秩序与混乱的词"],
  ["calm arrangement and wild confusion", "井然有序与一片混乱"],
  `
  pandemonium|wild and noisy disorder|大混乱，喧闹|When the lights went out at the concert, ___ broke out, with people screaming and running in every direction.|The last-minute goal caused ___ in the stands, as thousands of fans shouted, jumped and hugged in wild disorder.|There was ___ in the classroom after the bell, with children yelling and chairs crashing to the floor.|equanimity,truce|
  tumult|a loud, confused noise of a crowd; a state of great confusion|喧哗，骚动|The ___ of the market, a roar of voices from the shouting crowd, woke him early.|After the news her mind was in ___, her thoughts crowding and colliding in confusion.|The speech ended amid the ___ of the crowd, thousands of voices shouting at once.|equanimity,truce|tumultuous
  disarray|a state of untidiness or confusion|混乱，凌乱|The room was in complete ___ after the party, with clothes, plates and cushions scattered everywhere.|The beaten army retreated in ___, its soldiers scattered and its lines broken.|The party fell into ___ after its leader resigned, with no one sure who was in charge or what came next.|equanimity,containment|
  mayhem|violent or damaging disorder|混乱，骚乱|The storm caused ___ on the roads, smashing cars and blocking highways with fallen trees.|Two escaped goats caused ___ in the garden, trampling the flowers and knocking over every pot.|Rioting fans caused ___ in the city center, breaking windows and setting cars on fire.|truce,containment|
  bedlam|a scene of uproar and confusion|混乱嘈杂的场面|It was ___ in the kitchen before the wedding dinner, with cooks shouting and pans clattering everywhere.|The station was ___ during the strike, crowded with angry, shouting passengers and no trains.|Twenty toddlers soon turned the room into ___, a scene of screaming, running and spilled juice.|equanimity,truce|
  anarchy|a state with no government or order at all|无政府状态，混乱|The country fell into ___ after the war, with no government, no police and no law at all.|Without any rules or referee, the game soon became ___, every player doing just as he pleased.|Some feared ___ if the police went on strike, leaving the city with no one at all to keep order.|monarchy,theocracy|anarchic,anarchist
  methodical|done in a careful, orderly way, step by step|有条不紊的|She is a ___ worker who follows every step in order and never skips one.|The detective made a ___ search of the house, room by room and drawer by drawer.|A careful, ___ approach, checking each item in turn, saved them hours.|haphazard,slapdash|methodically
  systematic|done according to a fixed plan or system|系统的，有计划的|The scientists made a ___ study of the river, testing the water at the same twenty points every month by a fixed plan.|The office needs a ___ way of filing papers, one fixed system that everyone follows.|The army carried out a ___ search of the forest, combing it square by square according to a set plan.|haphazard,sporadic|systematically
  regimented|very strictly organized and controlled|受严格管制的|Life at the boarding school was ___: bells told the pupils exactly when to wake, eat, study and sleep.|He hated the ___ routine of the army, where every minute of the day was strictly controlled.|The palace garden had ___ rows of tulips, each flower planted in a strict, perfectly straight line.|haphazard,slapdash|regimentation
  haphazard|having no order or plan; random|杂乱无章的，随意的|The books were piled in a ___ way, with no order of size, subject or author.|Their ___ planning, done with no order or method, led to chaos on the day.|The town grew in a ___ fashion, its streets added at random wherever someone wanted to build.|methodical,regimented|haphazardly
  `,
  "context-clues",
  {
    intro: t(
      "The kitchen was **bedlam** before the dinner, but the **methodical** chef worked calmly through the **mayhem**, and soon the **haphazard** piles of plates stood in neat rows. These ten words help you describe calm, careful order and wild, noisy confusion.",
      "晚宴开始前，厨房里一片混乱嘈杂（**bedlam**），可有条不紊的（**methodical**）主厨在这场混乱（**mayhem**）中从容工作，很快，杂乱无章的（**haphazard**）一摞摞盘子就排得整整齐齐。这十个词帮你描写冷静细致的秩序和喧闹疯狂的混乱。",
    ),
    watchOut: {
      meanings: t(
        "**Anarchy** is the absence of any *government* or rule; **mayhem** is *violent, damaging* disorder; **disarray** is plain *untidiness* or confusion, with nothing broken.",
        "**anarchy** 指没有任何*政府*或规则；**mayhem** 是*暴力、破坏性*的混乱；**disarray** 只是*凌乱*或混乱，并没有东西被毁。",
      ),
      use: t(
        "**Methodical** describes a careful *step-by-step* way of working; **systematic** follows one fixed *plan or system*; **regimented** means *strictly controlled* by rules from above.",
        "**methodical** 形容细致的*按部就班*的做事方式；**systematic** 指遵循一套固定的*计划或体系*；**regimented** 指受上面规则的*严格管控*。",
      ),
      spelling: t(
        "**Pandemonium** ends in *-onium*; in **haphazard** the *p* and *h* are said separately, hap-hazard; **tumult** ends in *-ult*; **disarray** has a double *r*.",
        "**pandemonium** 结尾是 -onium；**haphazard** 里的 p 和 h 分开读，hap-hazard；**tumult** 结尾是 -ult；**disarray** 双写 r。",
      ),
    },
    notes: `
      pandemonium|people screaming and running in every direction when the lights went out|thousands of fans shouting, jumping and hugging in wild disorder|children yelling and chairs crashing to the floor after the bell|pandemonium is wild, noisy disorder; equanimity is calm|pandemonium 是喧闹的大混乱；equanimity 是镇定|equanimity means calmness in a difficult moment, the opposite of wild, noisy disorder|equanimity 指困境中的镇定，和喧闹的大混乱正相反|truce is an agreement to stop fighting for a time, not wild and noisy disorder|truce 是暂时停战的协议，不是喧闹的混乱|pan · de · mo · ni · um|the -onium ending|结尾是 -onium
      tumult|a roar of voices from a shouting market crowd|thoughts crowding and colliding in confusion after bad news|thousands of voices in a crowd shouting at once|tumult is the loud confusion of a crowd or a mind; equanimity is calm|tumult 是人群或内心的喧嚣混乱；equanimity 是镇定|equanimity means calmness, the opposite of loud confusion in a crowd or a mind|equanimity 指镇定，和人群或内心的喧嚣混乱正相反|truce is an agreement to stop fighting, not the roar and confusion of many voices|truce 是停战协议，不是众声喧哗的混乱|tu · mult|the -ult ending, as in result|结尾是 -ult，同 result
      disarray|clothes, plates and cushions scattered after a party|a beaten army retreating with soldiers scattered and lines broken|a party with no one sure who was in charge after its leader resigned|disarray is untidiness or confusion; equanimity is calm order of mind|disarray 是凌乱或混乱；equanimity 是内心的镇定|equanimity means calmness of mind, the opposite of a state of mess and confusion|equanimity 指内心镇定，和凌乱混乱正相反|containment means keeping something harmful under control, the opposite of things falling into confusion|containment 指控制住有害之物，和陷入混乱正相反|dis · ar · ray|dis- plus array, with a double r|dis- 加 array，双写 r
      mayhem|a storm smashing cars and blocking highways with trees|escaped goats trampling flowers and knocking over pots|rioting fans breaking windows and setting cars on fire|mayhem is violent, damaging disorder; a truce is an agreement to stop fighting|mayhem 是暴力破坏性的混乱；truce 是停战协议|truce is an agreement to stop fighting, the opposite of violent, damaging disorder|truce 是停战协议，和暴力破坏的混乱正相反|containment means keeping something harmful under control, the opposite of smashing and breaking things|containment 指控制住有害之物，和砸坏、毁坏东西正相反|may · hem|may plus -hem|may 加 -hem
      bedlam|cooks shouting and pans clattering before a wedding dinner|a station crowded with angry, shouting passengers during a strike|twenty toddlers screaming, running and spilling juice|bedlam is a scene of uproar; equanimity is calm|bedlam 是吵闹混乱的场面；equanimity 是镇定|equanimity means calmness, the opposite of a scene full of shouting and uproar|equanimity 指镇定，和吵吵嚷嚷的场面正相反|truce is an agreement to stop fighting, not a noisy, crowded scene of confusion|truce 是停战协议，不是嘈杂拥挤的混乱场面|bed · lam|bed plus lam, from the old London hospital Bethlem|bed 加 lam，源自伦敦旧医院 Bethlem
      anarchy|a country with no government, police or law after a war|a game with no rules or referee where each player did as he pleased|a city with no one to keep order during a police strike|anarchy is a state with no government; a monarchy is ruled by a king or queen|anarchy 是无政府状态；monarchy 由君主统治|monarchy is a country ruled by a king or queen, not a state with no government at all|monarchy 是由国王或女王统治的国家，不是完全没有政府的状态|theocracy is a country ruled by religious leaders, not one with no rulers at all|theocracy 是由宗教领袖统治的国家，不是没有任何统治者|an · ar · chy|an- plus -archy, as in monarchy|an- 加 -archy，同 monarchy
      methodical|a worker who follows every step in order|a detective searching room by room and drawer by drawer|an approach checking each item in turn|methodical means careful and step by step; haphazard means without order|methodical 有条不紊；haphazard 杂乱无章|haphazard means having no order or plan, the opposite of careful step-by-step work|haphazard 指毫无次序或计划，和按部就班的细致工作正相反|slapdash means done too hastily and carelessly, the opposite of careful and orderly|slapdash 指草率马虎，和细致有序正相反|me · thod · i · cal|method plus -ical|method 加 -ical
      systematic|a river tested at the same twenty points every month by a fixed plan|one fixed filing system that everyone follows|a forest combed square by square according to a set plan|systematic follows a fixed plan; sporadic happens at irregular times|systematic 按固定计划进行；sporadic 时断时续|haphazard means having no plan at all, the opposite of following a fixed system|haphazard 指毫无计划，和遵循固定体系正相反|sporadic means happening at irregular intervals, the opposite of a fixed, regular plan|sporadic 指不定时、零星发生，和固定有规律的计划正相反|sys · te · mat · ic|system plus -atic|system 加 -atic
      regimented|a school where bells told pupils exactly when to wake, eat, study and sleep|an army routine with every minute strictly controlled|tulips planted in strict, perfectly straight lines|regimented means strictly controlled; haphazard means random|regimented 严格管控；haphazard 随意杂乱|haphazard means random and without order, the opposite of strictly organized and controlled|haphazard 指随意杂乱，和严格有序的管控正相反|slapdash means hasty and careless, the opposite of strict, exact control|slapdash 指草率马虎，和严格精确的管控正相反|reg · i · ment · ed|regiment plus -ed|regiment 加 -ed
      haphazard|books piled with no order of size, subject or author|planning done with no order or method|a town whose streets were added at random|haphazard means random; methodical means step by step|haphazard 随意杂乱；methodical 按部就班|methodical means careful and orderly, step by step, the opposite of random|methodical 指细致有序、按部就班，和随意杂乱正相反|regimented means strictly organized and controlled, the opposite of having no order or plan|regimented 指严格组织管控，和毫无次序计划正相反|hap · haz · ard|hap- plus hazard, with p and h said apart|hap- 加 hazard，p 和 h 分开读
    `,
  },
);

const plenty = batch(
  "words-of-plenty-and-want",
  ["Words of Plenty and Want", "富足与匮乏的词"],
  ["too much, enough and too little", "过多、足够与太少"],
  `
  surfeit|an amount that is too large, more than is needed|过量|A ___ of sugar, far more than the body needs, is bad for your teeth.|There was a ___ of advice but no help: everyone told us far too much and did nothing.|After a ___ of cake at the party, eating much more than he should have, he felt sick.|dearth,paucity|
  glut|a supply of goods that is far greater than demand|供过于求|A ___ of apples, far more than shoppers wanted to buy, drove the price down.|The oil ___, with far more oil on sale than anyone needed, hurt producers.|There is a ___ of law graduates, so many more than there are jobs that many cannot find work.|paucity,dearth|
  plethora|a very large amount, often more than needed|过多，大量|The hotel offers a ___ of activities, from tennis and golf to painting, yoga and boat trips.|We faced a ___ of problems, far too many to solve in one week.|There is a ___ of apps for learning languages, too many to try them all.|dearth,paucity|
  superfluity|an amount beyond what is needed or useful|过剩，多余|A ___ of needless words weakens the essay; cut what is not needed.|The house had a ___ of chairs, far more than any family could use.|The report suffered from a ___ of detail, page after page of facts no reader needed.|paucity,dearth|superfluous
  dearth|a lack or shortage of something|缺乏，短缺|There is a ___ of good housing in the city, so families wait years for a flat.|The ___ of rain all summer left the fields dry and ruined the crops.|A ___ of evidence, with almost nothing to prove the charge, ended the case.|glut,surfeit|
  paucity|the presence of something in very small amounts|稀少，不足|The ___ of data, only a handful of cases, made the study weak.|The ___ of women in the field surprised her: only two in a department of fifty.|There is a ___ of shops in the village; the nearest supermarket is twenty miles away.|surfeit,plethora|
  sparse|thinly spread; small in number|稀疏的，稀少的|The desert has ___ vegetation, a few thin bushes scattered far apart.|His hair was ___ on top, just a few thin strands across his head.|The crowd was ___ on the rainy day, only a few people spread thinly around the stadium.|copious,ample|sparsely
  meager|lacking in quantity or quality|微薄的，贫乏的|They lived on ___ wages, barely enough to pay for food and rent.|The soldiers' ___ meal of dry bread and a little water left them hungry.|The results were ___ after a year of work: two small findings and nothing more.|ample,copious|meagerly
  ample|enough or more than enough|充足的，大量的|There is ___ room for three cars in the garage, with space to spare.|You will have ___ time to finish the test; two hours is more than enough.|The hotel has ___ parking, more than enough spaces for every guest.|meager,sparse|amply
  copious|abundant; in large amounts|大量的，丰富的|She took ___ notes in class, filling twenty pages in a single lecture.|Rain fell in ___ amounts during the night, flooding the streets by dawn.|The guests drank ___ cups of tea, pot after pot, all afternoon.|sparse,meager|copiously
  `,
  "context-clues",
  {
    intro: t(
      "After a **glut** of tomatoes in August came a **dearth** in winter, and the market stall that once had **ample** supplies now offered only a few **meager** baskets. These ten words help you describe too much, enough and too little.",
      "八月番茄供过于求（**glut**），到了冬天却严重短缺（**dearth**）；那个曾经货源充足（**ample**）的摊位，如今只剩几篮少得可怜的（**meager**）番茄。这十个词帮你描述太多、足够和太少。",
    ),
    watchOut: {
      meanings: t(
        "**Dearth** and **paucity** mean *too little*; **surfeit**, **glut**, **plethora** and **superfluity** mean *too much*. A **glut** is usually of goods for sale, more than buyers want.",
        "**dearth** 和 **paucity** 指*太少*；**surfeit**、**glut**、**plethora** 和 **superfluity** 指*太多*。**glut** 通常指待售商品多于买主所需。",
      ),
      use: t(
        "**Ample** means *enough or more*, as in ample time; **copious** describes large amounts *produced or poured out*, as in copious notes; **sparse** means thinly *spread*.",
        "**ample** 指*足够甚至有余*，如 ample time；**copious** 形容大量*产出或倾泻*的东西，如 copious notes；**sparse** 指*稀疏分散*。",
      ),
      spelling: t(
        "**Meager** is spelled *meagre* in British English; **plethora** has *-thora*; **paucity** begins *pau-*; **surfeit** ends in *-feit*, as in counterfeit.",
        "**meager** 在英式英语中拼作 meagre；**plethora** 含 -thora；**paucity** 以 pau- 开头；**surfeit** 结尾是 -feit，同 counterfeit。",
      ),
    },
    notes: `
      surfeit|far more sugar than the body needs|far too much advice and no help|eating much more cake than one should|surfeit is too much of something; dearth is too little|surfeit 是过量；dearth 是匮乏|dearth means a lack or shortage, the opposite of far more than is needed|dearth 指缺乏、短缺，和远超所需正相反|paucity means a very small amount, the opposite of too large an amount|paucity 指数量极少，和数量过多正相反|sur · feit|the -feit ending, as in counterfeit|结尾是 -feit，同 counterfeit
      glut|far more apples than shoppers wanted, driving the price down|far more oil on sale than anyone needed|many more law graduates than there are jobs|a glut is a supply far greater than demand; paucity is a very small amount|glut 是供过于求；paucity 是数量极少|paucity means a very small amount, the opposite of far more than buyers want|paucity 指数量极少，和远多于买主所需正相反|dearth means a shortage, the opposite of a supply far greater than demand|dearth 指短缺，和供过于求正相反|glut|one t, and the u as in cut|只有一个 t，u 读音同 cut
      plethora|a hotel's activities from tennis and golf to yoga and boat trips|far too many problems to solve in a week|too many language apps to try them all|plethora is a very large amount; dearth is a lack|plethora 是大量过多；dearth 是缺乏|dearth means a lack of something, the opposite of a very large amount|dearth 指缺乏，和数量极多正相反|paucity means a very small amount, the opposite of too many to try|paucity 指数量极少，和多得试不过来正相反|pleth · o · ra|the th and the -ora ending|含 th，结尾 -ora
      superfluity|needless words that weaken an essay|far more chairs than any family could use|pages of facts no reader needed|superfluity is more than is needed or useful; paucity is too little|superfluity 是多余过剩；paucity 是太少|paucity means a very small amount, the opposite of more than is needed|paucity 指数量极少，和多于所需正相反|dearth means a shortage, the opposite of a supply beyond what is useful|dearth 指短缺，和多得用不完正相反|su · per · flu · i · ty|super- plus flu plus -ity|super- 加 flu 再加 -ity
      dearth|families waiting years for a flat because good housing is lacking|no rain all summer, leaving fields dry|almost nothing to prove a charge|dearth is a shortage; a glut is a supply far greater than demand|dearth 是短缺；glut 是供过于求|glut means a supply far greater than demand, the opposite of a shortage|glut 指供过于求，和短缺正相反|surfeit means too large an amount, the opposite of a lack|surfeit 指过量，和缺乏正相反|dearth|the ear, as in earth|中间是 ear，同 earth
      paucity|a study with only a handful of cases|only two women in a department of fifty|a village whose nearest supermarket is twenty miles away|paucity is a very small amount; a plethora is a very large one|paucity 是数量极少；plethora 是数量极多|surfeit means too large an amount, the opposite of a very small one|surfeit 指过量，和极少正相反|plethora means a very large amount, the opposite of only a handful|plethora 指数量极多，和寥寥无几正相反|pau · ci · ty|pau- at the start, then -city|以 pau- 开头，再接 -city
      sparse|a few thin desert bushes scattered far apart|a few thin strands of hair across the top of a head|a few people spread thinly around a stadium in the rain|sparse means thinly spread; copious means in large amounts|sparse 稀疏；copious 大量|copious means abundant and in large amounts, the opposite of thinly spread|copious 指大量丰富，和稀稀拉拉正相反|ample means enough or more than enough, the opposite of only a few scattered things|ample 指充足有余，和寥寥几个、零星分散正相反|sparse|the -arse ending, with one s at the start|结尾是 -arse
      meager|wages barely enough for food and rent|a meal of dry bread and a little water that left soldiers hungry|a year of work giving two small findings and nothing more|meager means too small in amount; ample means enough or more|meager 微薄不足；ample 充足|ample means enough or more than enough, the opposite of barely enough|ample 指充足有余，和勉强够用正相反|copious means abundant, the opposite of too little to satisfy|copious 指大量丰富，和少得不够正相反|mea · ger|the ea, and -er; British meagre|中间是 ea，结尾 -er；英式拼作 meagre
      ample|room for three cars with space to spare|two hours, more than enough to finish a test|more than enough parking spaces for every guest|ample means enough or more; meager means too little|ample 充足；meager 微薄|meager means lacking in quantity, the opposite of enough with some to spare|meager 指数量不足，和绰绰有余正相反|sparse means thinly spread and few, the opposite of more than enough|sparse 指稀少分散，和绰绰有余正相反|am · ple|am- plus -ple, as in simple|am- 加 -ple，同 simple
      copious|twenty pages of notes in a single lecture|rain flooding the streets by dawn|pot after pot of tea drunk all afternoon|copious means in large amounts; sparse means thinly spread|copious 大量；sparse 稀疏|sparse means thin and few, the opposite of large amounts poured out|sparse 指稀少稀疏，和大量倾泻正相反|meager means too small in amount, the opposite of abundant|meager 指数量不足，和大量丰富正相反|co · pi · ous|the -ious ending|结尾是 -ious
    `,
  },
);

const manners = batch(
  "words-of-manners-good-and-bad",
  ["Words of Manners Good and Bad", "礼貌与粗鲁的词"],
  ["polite and rude behavior", "有礼与无礼的举止"],
  `
  courteous|polite and respectful|有礼貌的|The waiter was ___ and patient, politely answering every question with a smile.|Please send a ___ reply, thanking them politely for the invitation even if you cannot go.|A ___ driver stopped and politely waved us across the road.|curt,boorish|courteously,courtesy
  gracious|kind, warm and polite, especially to people of lower rank|亲切的，和蔼的|The queen smiled in her warm, ___ way at the nervous young servant, putting her at ease.|She was ___ in defeat, warmly congratulating the winner and thanking the crowd.|Our ___ hosts, warm and kind from the moment we arrived, made us feel at home.|curt,uncouth|graciously
  suave|charming, confident and elegant, especially of a man|温文尔雅的，圆滑的|The ___ spy, elegant in his dark suit and full of easy charm, won over everyone at the party.|His speech was ___, smooth, confident and charming from start to finish, though he used no notes.|The ___ salesman, smooth-talking and elegantly dressed, charmed them into buying the car.|boorish,uncouth|suavely
  impudent|rude and lacking respect|无礼的，放肆的|The ___ boy laughed at the teacher and stuck out his tongue.|It was ___ of him to ask the guest how much she earned, a cheeky, disrespectful question.|With a cheeky, ___ grin, he told the head teacher that her rules were silly.|courteous,gracious|impudence
  insolent|rude and disrespectful, especially to someone in authority|傲慢无礼的|The ___ clerk rolled his eyes at his manager and refused to help.|Her ___ tone, sneering at every one of the judge's questions, angered the court.|He was fired for being ___ to the manager, openly mocking her orders in front of the staff.|courteous,gracious|insolence
  brusque|abrupt or offhand in speech or manner|唐突的，生硬的|The doctor was ___ but kind, saying only a few quick words before hurrying to the next patient.|He gave a ___ nod, abrupt and offhand, and left without a word.|Her ___ manner, quick, blunt and short with everyone, put people off.|gracious,suave|brusquely
  curt|rudely short in speech|简短无礼的|He gave a ___ reply of one rude word and turned away.|Her email was ___ and cold: just "No," with no greeting and no thanks.|"Not now," came the ___ answer, and the door slammed shut.|gracious,courteous|curtly
  churlish|rude in a mean-spirited and surly way|粗暴的，没礼貌的|It would be ___ to refuse his gift, a mean and ungrateful thing to do.|The ___ guard, surly and sour, ignored our questions and scowled.|Don't be ___ about her success; congratulate her instead of sulking.|gracious,courteous|churlishly
  boorish|rough and bad-mannered|粗鲁的，粗野的|His ___ jokes, loud and crude, upset the guests at dinner.|The ___ fans shouted rough insults at the players and threw food onto the field.|Talking loudly and belching during the play was ___, rough behavior that ruined the evening.|suave,gracious|boor
  uncouth|lacking good manners or refinement|粗俗的，没教养的|Eating with your mouth open is ___, a sign of no manners at all.|The ___ young man spat on the floor and wiped his nose on his sleeve.|They found his speech ___, full of crude words and rough, unrefined manners.|courteous,suave|
  `,
  "context-clues",
  {
    intro: t(
      "The **suave** host greeted every guest in his **gracious** way, but his **boorish** cousin gave a **curt** nod and turned his back. These ten words help you describe polite, charming behavior and many kinds of rudeness.",
      "温文尔雅的（**suave**）主人以亲切的（**gracious**）态度迎接每位客人，可他那粗鲁的（**boorish**）表弟只是简短无礼地（**curt**）点了下头就转过身去。这十个词帮你描写有礼、迷人的举止和各种粗鲁无礼。",
    ),
    watchOut: {
      meanings: t(
        "**Insolent** rudeness is aimed at someone in *authority*; **impudent** is cheeky disrespect; **churlish** is *mean-spirited*, ungrateful rudeness.",
        "**insolent** 的无礼针对的是有*权威*的人；**impudent** 是放肆、没大没小；**churlish** 是*小气*、不领情的粗鲁。",
      ),
      use: t(
        "**Curt** and **brusque** both mean *short* in speech, but curt is ruder; **boorish** and **uncouth** mean *rough* and unrefined in manners, not short.",
        "**curt** 和 **brusque** 都指说话*简短*，但 curt 更无礼；**boorish** 和 **uncouth** 指举止*粗野*、没教养，而不是说话简短。",
      ),
      spelling: t(
        "**Courteous** ends in *-eous*; **brusque** ends in *-que*; **uncouth** has *-outh*, as in mouth, though said un-KOOTH; **suave** has *ua*, said SWAHV.",
        "**courteous** 结尾是 -eous；**brusque** 结尾是 -que；**uncouth** 拼作 -outh（同 mouth），读作 un-KOOTH；**suave** 含 ua，读作 SWAHV。",
      ),
    },
    notes: `
      courteous|a waiter politely answering every question with a smile|a reply politely thanking someone for an invitation|a driver politely waving people across the road|courteous means polite and respectful; curt means rudely short|courteous 礼貌恭敬；curt 简短无礼|curt means rudely short in speech, the opposite of polite and patient|curt 指说话简短无礼，和礼貌耐心正相反|boorish means rough and bad-mannered, the opposite of polite and respectful|boorish 指粗鲁无礼，和礼貌恭敬正相反|cour · te · ous|court plus -eous|court 加 -eous
      gracious|a queen warmly putting a nervous servant at ease|a loser warmly congratulating the winner|hosts warm and kind from the moment guests arrived|gracious means warm and kind; curt means rudely short|gracious 亲切和蔼；curt 简短无礼|curt means rudely short with people, the opposite of warm, kind politeness|curt 指对人简短无礼，和温暖友善的礼貌正相反|uncouth means lacking manners and refinement, the opposite of warm, polite kindness|uncouth 指粗俗没教养，和亲切有礼正相反|gra · cious|grace drops its e before -cious|grace 去掉 e，再接 -cious
      suave|a spy elegant in a dark suit and full of easy charm|a smooth, confident, charming speech given without notes|a smooth-talking, elegantly dressed salesman|suave means smoothly charming and elegant; boorish means rough|suave 温文尔雅；boorish 粗鲁|boorish means rough and bad-mannered, the opposite of smooth, elegant charm|boorish 指粗鲁无礼，和优雅迷人正相反|uncouth means crude and unrefined, the opposite of elegant and confident|uncouth 指粗俗没教养，和优雅自信正相反|suave|the ua, said SWAHV|含 ua，读作 SWAHV
      impudent|a boy laughing at his teacher and sticking out his tongue|a cheeky question asking a guest how much she earned|a cheeky grin while telling the head teacher her rules were silly|impudent means cheeky and disrespectful; courteous means polite|impudent 放肆无礼；courteous 礼貌|courteous means polite and respectful, the opposite of cheeky disrespect|courteous 指礼貌恭敬，和放肆无礼正相反|gracious means warm and polite, the opposite of laughing at or mocking someone|gracious 指亲切有礼，和嘲笑捉弄别人正相反|im · pu · dent|im- plus pu- plus -dent|im- 加 pu- 再加 -dent
      insolent|a clerk rolling his eyes at his manager and refusing to help|a tone sneering at a judge's questions|openly mocking a manager's orders in front of the staff|insolent is rude to authority; courteous is polite|insolent 对上级傲慢无礼；courteous 礼貌|courteous means polite and respectful, the opposite of sneering at someone in authority|courteous 指礼貌恭敬，和嘲讽上级正相反|gracious means warm and kind, the opposite of mocking and disrespectful|gracious 指亲切和蔼，和嘲弄、不敬正相反|in · so · lent|in- plus so- plus -lent|in- 加 so- 再加 -lent
      brusque|a doctor saying only a few quick words before hurrying off|an abrupt, offhand nod before leaving without a word|a quick, blunt manner short with everyone|brusque means abrupt and offhand; gracious means warm and kind|brusque 唐突生硬；gracious 亲切和蔼|gracious means warm and kind, the opposite of quick, blunt and offhand|gracious 指亲切和蔼，和匆忙、生硬、敷衍正相反|suave means smoothly charming, the opposite of blunt and abrupt|suave 指圆滑迷人，和生硬唐突正相反|brusque|the -que ending, said BRUSK|结尾是 -que，读作 BRUSK
      curt|a reply of one rude word before turning away|an email of just "No," with no greeting or thanks|a short answer before a door slammed shut|curt means rudely short; courteous means polite|curt 简短无礼；courteous 礼貌|gracious means warm and kind, the opposite of a rude, cold word or two|gracious 指亲切和蔼，和冷冰冰、无礼的寥寥数语正相反|courteous means polite and respectful, the opposite of rudely short|courteous 指礼貌恭敬，和简短无礼正相反|curt|one r and one t|一个 r，一个 t
      churlish|refusing a gift, a mean and ungrateful act|a surly, sour guard ignoring questions and scowling|sulking at someone else's success instead of congratulating her|churlish means mean-spirited and surly; gracious means warm and generous|churlish 小气粗暴；gracious 亲切大度|gracious means warm and kind, the opposite of mean-spirited sulking|gracious 指亲切大度，和小气赌气正相反|courteous means polite and respectful, the opposite of surly and ungrateful|courteous 指礼貌恭敬，和粗暴、不领情正相反|chur · lish|churl plus -ish|churl 加 -ish
      boorish|loud, crude jokes that upset dinner guests|fans shouting rough insults and throwing food|talking loudly and belching during a play|boorish means rough and bad-mannered; suave means smoothly charming|boorish 粗鲁；suave 温文尔雅|suave means charming and elegant, the opposite of loud, crude and rough|suave 指优雅迷人，和吵闹粗俗正相反|gracious means warm and polite, the opposite of rough insults|gracious 指亲切有礼，和粗野的辱骂正相反|boor · ish|boor plus -ish, with a double o|boor 加 -ish，双写 o
      uncouth|eating with one's mouth open|a young man spitting on the floor and wiping his nose on his sleeve|speech full of crude words and rough manners|uncouth means lacking refinement; suave means elegant|uncouth 粗俗没教养；suave 优雅|courteous means polite and respectful, the opposite of having no manners at all|courteous 指礼貌恭敬，和毫无教养正相反|suave means elegant and charming, the opposite of crude and unrefined|suave 指优雅迷人，和粗俗没教养正相反|un · couth|-outh as in mouth, though said KOOTH|拼作 -outh，同 mouth，读作 KOOTH
    `,
  },
);

const diligence = batch(
  "words-of-diligence-and-sloth",
  ["Words of Diligence and Sloth", "勤奋与懒惰的词"],
  ["working hard and avoiding work", "努力工作与逃避工作"],
  `
  diligent|showing care and effort in one's work|勤奋的|The ___ student checks every answer twice and never hands in work late.|The ___ clerk, working carefully through every page, found the mistake.|She was ___ in her research, spending long, careful hours in the library each day.|indolent,lethargic|diligently,diligence
  industrious|hard-working and busy|勤劳的|The ___ ants gathered food busily all summer long.|They are a hard-working, ___ family of farmers, busy from dawn to dusk.|Her ___ grandfather, always busy with some job, rarely sat down to rest.|slothful,languid|industriously
  assiduous|showing great care and steady attention|刻苦的，一丝不苟的|Her ___ practice, three careful hours at the piano every single day, made her a fine pianist.|The ___ nurse checked on him every hour through the night, never missing a visit.|He was ___ in keeping records, writing down every sale with great care.|lethargic,indolent|assiduously
  sedulous|showing careful, constant effort|孜孜不倦的|She paid ___ attention to every detail, checking each one carefully again and again.|The scholar made a ___ study of the letters, reading them with constant care for ten years.|With ___ care, working steadily for months, he copied the old map line by line.|languid,slothful|sedulously
  indefatigable|never tiring or giving up|不知疲倦的|The ___ volunteer worked through the night without tiring, then started again at dawn.|She was ___ in her campaign for clean water, never tiring or giving up in thirty years.|His ___ energy, which never seemed to run out, amazed us all.|lethargic,slothful|
  tireless|working hard without becoming tired|不知疲倦的|Thank you for your ___ work on the project, hour after hour without a rest.|She has been ___ in her work for the poor, helping them day after day without ever growing weary.|The ___ dog searched the snow all day, never slowing down until it found the climber.|indolent,languid|tirelessly
  indolent|wanting to avoid activity or effort; lazy|懒惰的|The ___ student never did his homework, preferring to lie on the sofa all evening.|Their summer by the pool was ___: long, lazy days of doing nothing at all.|The ___ manager, too lazy to check anything, let the work slide.|diligent,assiduous|indolence
  slothful|lazy and slow to act|怠惰的|The ___ guard, too lazy to stay awake, slept at his post.|It is ___ to leave dirty dishes in the sink for days because you can't be bothered.|His ___ habits, lying in bed until noon and never lifting a finger, were hard to break.|industrious,diligent|sloth
  lethargic|sluggish and lacking energy|没精打采的，昏睡的|The heat made everyone ___, too tired and sluggish to move.|He felt ___ after the big lunch, heavy, sleepy and without energy.|The ___ economy, slow and lacking energy, grew by only half a percent.|indefatigable,diligent|lethargy
  languid|relaxed and slow, without energy or effort|慵懒的，无精打采的|From the hammock she waved a slow, ___ hand, without lifting her head.|The afternoon was hot and ___, and everyone moved slowly, without energy.|His voice was ___, slow and relaxed, as if speaking were too much effort.|assiduous,industrious|languidly
  `,
  "context-clues",
  {
    intro: t(
      "The **diligent** ants worked all summer while the **indolent** grasshopper sang; by winter the **industrious** ants had food, and the **lethargic** grasshopper was too weak to look for any. These ten words help you describe hard, careful work and laziness.",
      "勤奋的（**diligent**）蚂蚁整个夏天都在劳作，懒惰的（**indolent**）蚱蜢却只顾唱歌；到了冬天，勤劳的（**industrious**）蚂蚁有吃的，没精打采的（**lethargic**）蚱蜢却虚弱得连找食物都没力气。这十个词帮你描写辛勤细致的工作和懒散。",
    ),
    watchOut: {
      meanings: t(
        "**Indolent** and **slothful** mean *lazy*, unwilling to work; **lethargic** and **languid** mean *low in energy*, which may come from heat, illness or tiredness rather than laziness.",
        "**indolent** 和 **slothful** 指*懒惰*、不愿干活；**lethargic** 和 **languid** 指*缺乏精力*，可能是因为炎热、生病或疲倦，而不一定是懒。",
      ),
      use: t(
        "**Assiduous** and **sedulous** stress *careful, steady attention* to a task; **indefatigable** and **tireless** stress *never growing tired*.",
        "**assiduous** 和 **sedulous** 强调对工作*细致、持续的专注*；**indefatigable** 和 **tireless** 强调*从不疲倦*。",
      ),
      spelling: t(
        "**Indefatigable** hides *-fatig-*, as in fatigue; **assiduous** has a double *s*; **lethargic** has *-thar-*; **sedulous** has *-dul-*.",
        "**indefatigable** 里藏着 -fatig-，同 fatigue；**assiduous** 双写 s；**lethargic** 中间是 -thar-；**sedulous** 中间是 -dul-。",
      ),
    },
    notes: `
      diligent|a student who checks every answer twice and is never late|a clerk working carefully through every page|long, careful hours of research in a library|diligent means careful and hard-working; indolent means lazy|diligent 勤奋细心；indolent 懒惰|indolent means lazy and avoiding effort, the opposite of careful, hard work|indolent 指懒惰、逃避努力，和细心勤奋正相反|lethargic means lacking energy, the opposite of long hours of careful effort|lethargic 指无精打采，和长时间的细心努力正相反|dil · i · gent|the -gent ending, with a soft g|结尾是 -gent，g 读软音
      industrious|ants gathering food busily all summer|a family of farmers busy from dawn to dusk|a grandfather always busy with some job|industrious means busy and hard-working; slothful means lazy|industrious 勤劳忙碌；slothful 怠惰|slothful means lazy and slow to act, the opposite of busy all day|slothful 指懒惰迟缓，和整天忙碌正相反|languid means slow and without energy, the opposite of busy and hard-working|languid 指慵懒无力，和勤劳忙碌正相反|in · dus · tri · ous|industry drops its y before -ious|industry 去掉 y，再接 -ious
      assiduous|three careful hours at the piano every day|a nurse checking every hour through the night|every sale written down with great care|assiduous means steadily careful; lethargic means lacking energy|assiduous 一丝不苟；lethargic 无精打采|lethargic means sluggish and lacking energy, the opposite of steady, careful effort|lethargic 指无精打采，和持续细致的努力正相反|indolent means lazy, the opposite of never missing a task|indolent 指懒惰，和从不落下任何工作正相反|as · sid · u · ous|the double s and the -uous ending|双写 s，结尾 -uous
      sedulous|attention checking every detail again and again|ten years of constant, careful study of letters|months of steady work copying a map line by line|sedulous means careful and constant; languid means slow and without effort|sedulous 孜孜不倦；languid 慵懒无力|languid means relaxed and without effort, the opposite of careful, constant work|languid 指慵懒、不费力，和细致持续的工作正相反|slothful means lazy, the opposite of steady effort over months|slothful 指懒惰，和数月的持续努力正相反|sed · u · lous|-dul- in the middle, then -ous|中间是 -dul-，结尾 -ous
      indefatigable|a volunteer working through the night and starting again at dawn|a campaigner who never tired or gave up in thirty years|energy that never seemed to run out|indefatigable means never tiring; lethargic means always tired|indefatigable 不知疲倦；lethargic 无精打采|lethargic means sluggish and lacking energy, the opposite of never tiring|lethargic 指无精打采，和从不疲倦正相反|slothful means lazy and slow, the opposite of never giving up|slothful 指懒惰迟缓，和从不放弃正相反|in · de · fat · i · ga · ble|-fatig- as in fatigue, then -able|中间是 -fatig-，同 fatigue，结尾 -able
      tireless|hours of work on a project without a rest|day after day of work for the poor without weariness|a dog searching the snow all day without slowing|tireless means never growing tired; indolent means lazy|tireless 不知疲倦；indolent 懒惰|indolent means lazy and avoiding effort, the opposite of working without rest|indolent 指懒惰、逃避努力，和不停地工作正相反|languid means slow and without energy, the opposite of never slowing down|languid 指慵懒无力，和从不放慢正相反|tire · less|tire plus -less, keeping the e|tire 加 -less，保留 e
      indolent|a student lying on the sofa instead of doing homework|lazy days by a pool doing nothing at all|a manager too lazy to check anything|indolent means lazy; diligent means hard-working|indolent 懒惰；diligent 勤奋|diligent means careful and hard-working, the opposite of lazy and idle|diligent 指勤奋细心，和懒散无所事事正相反|assiduous means steadily careful, the opposite of too lazy to check anything|assiduous 指一丝不苟，和懒得检查正相反|in · do · lent|in- plus do- plus -lent|in- 加 do- 再加 -lent
      slothful|a guard too lazy to stay awake at his post|dishes left in the sink for days|habits of lying in bed until noon and never lifting a finger|slothful means lazy; industrious means busy and hard-working|slothful 怠惰；industrious 勤劳|industrious means hard-working and busy, the opposite of too lazy to act|industrious 指勤劳忙碌，和懒得动正相反|diligent means careful and hard-working, the opposite of never lifting a finger|diligent 指勤奋细心，和一根手指都不动正相反|sloth · ful|sloth plus -ful, with one l|sloth 加 -ful，只有一个 l
      lethargic|heat leaving everyone too tired to move|a heavy, sleepy feeling after a big lunch|an economy that grew by only half a percent|lethargic means lacking energy; indefatigable means never tiring|lethargic 无精打采；indefatigable 不知疲倦|indefatigable means never tiring, the opposite of too tired and sluggish to move|indefatigable 指从不疲倦，和累得动不了正相反|diligent means hard-working and careful, the opposite of heavy and sluggish|diligent 指勤奋细心，和昏沉迟缓正相反|le · thar · gic|-thar- in the middle, then -gic|中间是 -thar-，结尾 -gic
      languid|a slow wave from a hammock without lifting one's head|a hot afternoon when everyone moved slowly|a slow, relaxed voice as if speaking were too much effort|languid means slow and relaxed; industrious means busy|languid 慵懒；industrious 勤劳|assiduous means steadily careful and attentive, the opposite of slow and effortless|assiduous 指一丝不苟、专注，和慵懒随意正相反|industrious means busy and hard-working, the opposite of slow and without energy|industrious 指勤劳忙碌，和慵懒无力正相反|lan · guid|the -guid ending, with u after g|结尾是 -guid，g 后面有 u
    `,
  },
);

const idleness = batch(
  "words-of-delay-and-idleness",
  ["Words of Delay and Idleness", "拖延与闲散的词"],
  ["slowness, putting things off and doing things carelessly", "迟缓、拖延和马虎"],
  `
  sluggish|moving or responding slowly|缓慢的，迟钝的|The ___ river barely moved, creeping slowly through the flat fields.|My old laptop is ___ today, taking a full minute to open each file.|The ___ engine responded slowly, coughing for a long time before the car would move.|sporadic,slapdash|sluggishly
  torpid|inactive and sleepy, as an animal in winter|麻木的，蛰伏的|The ___ lizard lay still in the cold, too sleepy to move until the sun warmed it.|The summer heat left the town ___, its people dozing and its streets still.|Bears are ___ in winter, sleeping for months in their dens.|sporadic,slapdash|torpor
  listless|lacking energy or interest|倦怠的，无精打采的|The sick child was ___, lying on the sofa with no interest in her toys.|The team gave a ___ display, playing without energy or interest.|He stared out of the window, ___ and bored, with no wish to do anything.|sporadic,slapdash|listlessly
  loiter|to stand or wait around with no purpose|闲逛，游荡|Teenagers ___ outside the shop in the evenings, standing around with nothing to do.|Do not ___ near the gates; move along if you have no business here.|He liked to ___ in the park after school, hanging about with no purpose until dark.|shirk,procrastinate|loitered,loitering
  dawdle|to waste time; to move slowly|磨蹭，闲荡|Don't ___ on the way home; walk quickly so you are back before dark.|The children ___ over breakfast, eating so slowly that they missed the bus.|We can't ___ over our coffee; the train leaves in ten minutes.|shirk,procrastinate|dawdled,dawdling
  procrastinate|to delay doing something one should do|拖延|Students often ___, putting off revision day after day until the night before the exam.|Stop putting off your tax forms; if you ___ again, you will miss the deadline.|He tends to ___, putting off every task until the last possible minute.|dawdle,shirk|procrastinated,procrastination
  sporadic|happening at irregular intervals; scattered|零星的，偶尔的|There was ___ gunfire in the night, a few shots now and then with long silences between.|Only ___ showers are expected, brief bursts of rain at scattered times through the day.|Her visits became ___: once in March, twice in June, then not again until Christmas.|systematic,sluggish|sporadically
  desultory|lacking a plan, purpose or enthusiasm|随意的，散漫的|Waiting for the bus, they made ___ conversation, chatting half-heartedly about nothing in particular.|He made a ___ attempt to tidy up, moving a few things around without any plan or interest.|The talks were ___, wandering from topic to topic without purpose and going nowhere.|methodical,systematic|desultorily
  slapdash|done too hastily and carelessly|马虎的，草率的|The ___ repairs, done in a hurry with no care at all, soon failed.|Her ___ essay, dashed off in ten minutes, was full of careless errors.|He did a ___ job of painting the fence, rushing it and splashing paint on the grass.|methodical,meticulous|
  shirk|to avoid a duty or work|逃避，推卸|Don't ___ your share of the chores; everyone must do their part.|A good leader will never ___ responsibility, even when it means taking the blame.|Soldiers who ___ their duty, slipping away whenever there is work to be done, are punished.|loiter,procrastinate|shirked,shirking,shirker
  `,
  "context-clues",
  {
    intro: t(
      "Instead of studying, he would **procrastinate**, **loiter** in the park and **dawdle** on the way home, and his **slapdash** homework showed it. These ten words help you describe slowness, idleness, putting things off and careless work.",
      "他不去学习，而是一拖再拖（**procrastinate**），在公园里闲逛（**loiter**），回家路上磨磨蹭蹭（**dawdle**），他那马虎的（**slapdash**）作业就是证明。这十个词帮你描写迟缓、闲散、拖延和草率。",
    ),
    watchOut: {
      meanings: t(
        "**Loiter** is to hang about *in one place* with no purpose; **dawdle** is to *move or act too slowly*; **procrastinate** is to *put off* a task until later; **shirk** is to *avoid* a duty altogether.",
        "**loiter** 是在*一个地方*无所事事地闲荡；**dawdle** 是*动作太慢*、磨蹭；**procrastinate** 是把任务*拖到*以后；**shirk** 是干脆*逃避*责任。",
      ),
      use: t(
        "**Sporadic** means happening at *irregular times*; **desultory** means done *without plan or enthusiasm*; **slapdash** means done *hastily and carelessly*.",
        "**sporadic** 指*时断时续*地发生；**desultory** 指做事*没有计划、提不起劲*；**slapdash** 指*匆忙马虎*。",
      ),
      spelling: t(
        "**Procrastinate** has *-cras-*, from the Latin for tomorrow; **desultory** has *-sult-*; **listless** ends with a double *s*; **torpid** ends in *-id*.",
        "**procrastinate** 中间是 -cras-，源自拉丁语的“明天”；**desultory** 中间是 -sult-；**listless** 结尾双写 s；**torpid** 结尾是 -id。",
      ),
    },
    notes: `
      sluggish|a river creeping slowly through flat fields|an old laptop taking a minute to open each file|an engine coughing for a long time before the car would move|sluggish means moving or responding slowly; sporadic means happening now and then|sluggish 迟缓；sporadic 零星偶发|sporadic means happening at irregular intervals, not moving or responding slowly|sporadic 指时断时续，不是移动或反应迟缓|slapdash means done hastily and carelessly, the opposite of slow to move or respond|slapdash 指匆忙草率，和迟缓正相反|slug · gish|slug plus -gish, with a double g|slug 加 -gish，双写 g
      torpid|a lizard too sleepy to move until the sun warmed it|a town dozing in the summer heat|bears sleeping for months in their dens|torpid means sleepy and inactive; slapdash means hasty and careless|torpid 昏睡不动；slapdash 匆忙马虎|sporadic means happening at irregular times, not sleepy and still|sporadic 指时断时续，不是昏昏欲睡、静止不动|slapdash means done in a careless hurry, the opposite of lying still and sleepy|slapdash 指匆忙草率，和昏睡不动正相反|tor · pid|the -id ending, as in rapid|结尾是 -id，同 rapid
      listless|a sick child with no interest in her toys|a team playing without energy or interest|a bored man with no wish to do anything|listless means lacking energy and interest; sporadic means irregular|listless 无精打采；sporadic 零星|sporadic means happening at irregular intervals, not lacking energy or interest|sporadic 指时断时续，不是缺乏精力和兴趣|slapdash means done in a careless hurry, not without energy or interest|slapdash 指匆忙草率，不是没精神、没兴趣|list · less|list plus -less, with a double s|list 加 -less，结尾双写 s
      loiter|teenagers standing around outside a shop with nothing to do|people with no business hanging about near the gates|a boy hanging about in a park with no purpose until dark|loiter hangs about with no purpose; procrastinate puts a task off|loiter 无所事事地闲荡；procrastinate 拖延任务|shirk means to avoid a duty, not to stand around in one place with no purpose|shirk 指逃避责任，不是在某处无所事事地闲荡|procrastinate means to put off a task, not to hang about in a place|procrastinate 指拖延任务，不是在某处闲荡|loi · ter|the oi, as in boil|中间是 oi，同 boil
      dawdle|walking home too slowly before dark|children eating breakfast so slowly they missed the bus|lingering over coffee when a train leaves in ten minutes|dawdle means to move or act too slowly; procrastinate means to put a task off|dawdle 磨蹭；procrastinate 拖延任务|shirk means to avoid a duty, not to move or eat too slowly|shirk 指逃避责任，不是走路或吃饭太慢|procrastinate means to put off a task until later, not to walk or eat too slowly|procrastinate 指把任务拖到以后，不是走路或吃饭太慢|daw · dle|the aw, then -dle|中间是 aw，结尾 -dle
      procrastinate|putting off revision until the night before an exam|tax forms put off again until the deadline is missed|every task put off until the last possible minute|procrastinate puts a task off; dawdle moves too slowly|procrastinate 拖延任务；dawdle 磨蹭|dawdle means to move or act too slowly, not to put a task off until later|dawdle 指动作太慢，不是把任务拖到以后|shirk means to avoid a duty completely, not to keep delaying it|shirk 指完全逃避责任，不是一再拖延|pro · cras · ti · nate|-cras- in the middle, then -tinate|中间是 -cras-，结尾 -tinate
      sporadic|a few shots now and then with long silences between|brief bursts of rain at scattered times|visits once in March, twice in June and then at Christmas|sporadic means happening at irregular times; systematic means following a fixed plan|sporadic 零星不定；systematic 按固定计划|systematic means following a fixed plan, the opposite of happening at scattered, irregular times|systematic 指按固定计划进行，和零星不定正相反|sluggish means moving slowly, not happening now and then|sluggish 指迟缓，不是时断时续|spo · rad · ic|spor- plus -adic|spor- 加 -adic
      desultory|half-hearted chat about nothing while waiting for a bus|a few things moved around without any plan or interest|talks wandering from topic to topic without purpose|desultory means without plan or enthusiasm; methodical means careful and step by step|desultory 散漫随意；methodical 有条不紊|methodical means careful and orderly, the opposite of aimless and half-hearted|methodical 指细致有序，和漫无目的、敷衍了事正相反|systematic means following a fixed plan, the opposite of wandering without purpose|systematic 指按固定计划进行，和漫无目的正相反|des · ul · to · ry|-sult- in the middle, then -ory|中间是 -sult-，结尾 -ory
      slapdash|repairs done in a hurry with no care that soon failed|an essay dashed off in ten minutes full of careless errors|a fence painted in a rush with paint splashed on the grass|slapdash means hasty and careless; meticulous means careful about every detail|slapdash 匆忙马虎；meticulous 一丝不苟|methodical means careful and step by step, the opposite of hasty and careless|methodical 指按部就班、细致有序，和匆忙马虎正相反|meticulous means very careful about small details, the opposite of rushed and careless|meticulous 指对细节一丝不苟，和匆忙马虎正相反|slap · dash|slap plus dash|slap 加 dash
      shirk|a share of the chores that everyone must do|a leader who takes responsibility even when it means blame|soldiers slipping away whenever there is work to be done|shirk avoids a duty; procrastinate only delays it|shirk 逃避责任；procrastinate 只是拖延|loiter means to hang about with no purpose, not to avoid a duty or task|loiter 指无所事事地闲荡，不是逃避责任或任务|procrastinate means to put off a task until later, not to avoid it altogether|procrastinate 指把任务拖到以后，不是完全逃避|shirk|the ir, as in bird|中间是 ir，同 bird
    `,
  },
);

const age = batch(
  "words-of-youth-and-old-age",
  ["Words of Youth and Old Age", "青年与老年的词"],
  ["the young, the old and their ways", "年少、年老及其特点"],
  `
  puerile|childishly silly|幼稚的，愚蠢的|His ___ jokes, the silly kind a seven-year-old might tell, annoyed the adults at dinner.|The film's humor was ___, full of childish pranks and silly faces.|Stop this ___ behavior; you are twenty, not a silly little child.|senile,geriatric|
  infantile|of or like a baby; very childish|婴儿的；幼稚的|The grown man's tantrum was ___: he screamed and kicked like a baby.|Doctors count measles among the ___ diseases, those that strike babies and very young children.|His reply, sticking out his tongue like a baby, was simply ___.|geriatric,venerable|
  senile|weak in mind because of old age|老糊涂的，衰老的|Her ___ grandmother, her mind weakened by great age, no longer remembered her name.|As he grew ___, he began to forget where he lived and to call his son by his brother's name.|Patients who are ___, confused and forgetful in extreme old age, need gentle care.|infantile,sprightly|senility
  venerable|respected because of age, wisdom or character|德高望重的，古老而受尊敬的|The ___ professor, respected by all for his wisdom, still taught at ninety.|The ___ oak in the square, five hundred years old and honored by the town, was never cut down.|They visited a ___ temple, an ancient shrine respected by pilgrims for a thousand years.|sprightly,senile|
  geriatric|relating to old people and their care|老年的，老年病的|She works on the ___ ward, caring for elderly patients.|The ___ unit, which treats only the elderly, needs more nurses.|Doctors who study ___ medicine learn how to treat the diseases of old age.|infantile,venerable|
  octogenarian|a person aged between eighty and eighty-nine|八旬老人|Aged eighty-two, he was the only ___ in the marathon; every other runner was under sixty.|Now eighty-five, my grandmother is a proud ___ who still drives herself to the shops.|The village's oldest ___ was eighty-nine, still a few months short of ninety.|centenarian,geriatric|octogenarians
  centenarian|a person a hundred or more years old|百岁老人|The ___ blew out the candles on her hundred-and-first birthday cake.|Born in 1920, the ___ had lived through more than a hundred years of history.|The ___, aged one hundred and three, remembered the old king's coronation.|octogenarian,venerable|centenarians
  sprightly|lively and full of energy, especially of an old person|活泼的，精力充沛的|The ___ old man climbed the hill faster than his grandchildren, full of energy.|She was ___ at seventy, dancing and cycling with the energy of a girl.|A ___ tune, lively and bouncing, played on the radio.|doddering,senile|
  spry|active and lively, especially for one's age|(老人)矫健的|My ___ grandfather, still active at ninety, swims a mile every morning.|She is ___ for her age, hopping on and off buses as easily as a teenager.|The ___ widow, quick and lively at eighty, gardened every morning.|senile,doddering|
  doddering|weak and unsteady from old age|老态龙钟的，蹒跚的|A ___ old man shuffled down the road, weak and unsteady on his feet.|The ___ king, frail and shaky with age, could barely stand.|He was too ___ to drive, his hands trembling and his steps unsteady.|spry,sprightly|
  `,
  "context-clues",
  {
    intro: t(
      "The **venerable** professor, a **spry** **octogenarian**, only laughed at the **puerile** jokes of his students and went on teaching. These ten words help you describe the young and the old, their energy and their weakness, and the respect that age can bring.",
      "那位德高望重的（**venerable**）教授是个矫健的（**spry**）八旬老人（**octogenarian**），对学生们幼稚的（**puerile**）玩笑只是一笑置之，照样讲课。这十个词帮你描写年少与年老、活力与衰弱，以及年岁带来的尊敬。",
    ),
    watchOut: {
      meanings: t(
        "**Puerile** and **infantile** describe *childish* behavior; **senile** is weakness of the *mind* in old age, **doddering** weakness of the *body*; **venerable** means *respected* because of age.",
        "**puerile** 和 **infantile** 形容*幼稚*的行为；**senile** 是老年*头脑*衰退，**doddering** 是老年*身体*衰弱；**venerable** 指因年高而*受人尊敬*。",
      ),
      use: t(
        "An **octogenarian** is in their *eighties*; a **centenarian** is a *hundred* or older. **Geriatric** describes the *care* of old people, as in a geriatric ward, not a person's character.",
        "**octogenarian** 是*八十多岁*的人；**centenarian** 是*一百岁*及以上的人。**geriatric** 形容对老人的*医护*，如 geriatric ward（老年病房），不形容人的性格。",
      ),
      spelling: t(
        "**Octogenarian** has *octo-*, eight, and **centenarian** has *cent-*, a hundred, both ending in *-arian*; **sprightly** has *-ight-*; **puerile** has *ue*.",
        "**octogenarian** 以表示“八”的 octo- 开头，**centenarian** 以表示“百”的 cent- 开头，两词都以 -arian 结尾；**sprightly** 中间是 -ight-；**puerile** 含 ue。",
      ),
    },
    notes: `
      puerile|silly jokes of the kind a seven-year-old might tell|film humor full of childish pranks and silly faces|silly behavior from a twenty-year-old|puerile means childishly silly; senile means weak in mind from old age|puerile 幼稚愚蠢；senile 年老糊涂|senile means weak in mind because of old age, not childishly silly|senile 指因年老而头脑衰退，不是幼稚愚蠢|geriatric means relating to the care of old people, not silly in a childish way|geriatric 指与老人医护有关，不是幼稚可笑|pu · er · ile|the ue, then -ile|含 ue，结尾 -ile
      infantile|a grown man screaming and kicking like a baby|diseases that strike babies and very young children|a reply of sticking out one's tongue like a baby|infantile means like a baby; geriatric means relating to old people|infantile 像婴儿般；geriatric 与老人有关|geriatric means relating to old people and their care, the opposite of like a baby|geriatric 指与老人及其医护有关，和像婴儿一样正相反|venerable means respected for age and wisdom, the opposite of behaving like a baby|venerable 指因年高德劭受人尊敬，和像婴儿般胡闹正相反|in · fan · tile|infant plus -ile|infant 加 -ile
      senile|a grandmother whose mind was so weakened by age she forgot a name|an old man forgetting where he lived and calling his son by the wrong name|patients confused and forgetful in extreme old age|senile means weak in mind from age; sprightly means lively|senile 年老糊涂；sprightly 精神矍铄|infantile means like a baby, not weak in mind from old age|infantile 指像婴儿，不是年老糊涂|sprightly means lively and full of energy, the opposite of confused and forgetful in old age|sprightly 指精力充沛，和年老糊涂健忘正相反|se · nile|se- plus -nile, as in Nile|se- 加 -nile，同 Nile
      venerable|a professor respected by all for his wisdom at ninety|a five-hundred-year-old oak honored by the town|an ancient temple respected by pilgrims for a thousand years|venerable means respected for age; senile means weak in mind from age|venerable 因年高而受人尊敬；senile 年老糊涂|sprightly means lively and full of energy, not respected for age and wisdom|sprightly 指精力充沛，不是因年高德劭受人尊敬|senile means weak in mind from old age, not honored and respected|senile 指年老糊涂，不是受人尊敬|ven · er · a · ble|venerate drops its e before -able|venerate 去掉 e，再接 -able
      geriatric|a hospital ward caring for elderly patients|a unit that treats only the elderly|medicine for the diseases of old age|geriatric means relating to the care of old people; infantile means relating to babies|geriatric 与老人医护有关；infantile 与婴儿有关|infantile means relating to babies, the opposite of caring for the elderly|infantile 指与婴儿有关，和照料老人正相反|venerable means respected for age, not relating to medical care of the old|venerable 指因年高受人尊敬，不是与老人医护有关|ger · i · at · ric|ger- plus -iatric, as in pediatric|ger- 加 -iatric，同 pediatric
      octogenarian|an eighty-two-year-old running a marathon among runners under sixty|a grandmother of eighty-five who still drives to the shops|a villager of eighty-nine just short of ninety|an octogenarian is in his eighties; a centenarian is a hundred or more|octogenarian 八十多岁；centenarian 百岁以上|centenarian is a person a hundred or more years old, not one in their eighties|centenarian 指一百岁及以上的人，不是八十多岁的人|geriatric describes the medical care of old people, not a person aged between eighty and eighty-nine|geriatric 形容老人的医护，不是指八十到八十九岁的人|oc · to · ge · nar · i · an|octo- for eight, then -genarian|octo- 表示“八”，再接 -genarian
      centenarian|a woman blowing out candles on her hundred-and-first birthday|a person born in 1920 who lived through more than a hundred years|a man of one hundred and three remembering a coronation|a centenarian is a hundred or more; an octogenarian is in his eighties|centenarian 百岁以上；octogenarian 八十多岁|octogenarian is a person in their eighties, not one who has lived a hundred years or more|octogenarian 指八十多岁的人，不是活过一百岁的人|venerable describes someone respected for age, not a person aged a hundred or more|venerable 形容因年高受人尊敬，不是指一百岁以上的人|cen · te · nar · i · an|cent- for a hundred, then -enarian|cent- 表示“百”，再接 -enarian
      sprightly|an old man climbing a hill faster than his grandchildren|a woman of seventy dancing and cycling like a girl|a lively, bouncing tune on the radio|sprightly means lively and full of energy; doddering means weak and unsteady|sprightly 精神矍铄；doddering 步履蹒跚|doddering means weak and unsteady from age, the opposite of lively and full of energy|doddering 指老态龙钟、步履不稳，和精力充沛正相反|senile means weak in mind from age, the opposite of lively and energetic|senile 指年老糊涂，和活泼有精神正相反|spright · ly|-ight- in the middle, then -ly|中间是 -ight-，结尾 -ly
      spry|a grandfather of ninety who swims a mile every morning|a woman hopping on and off buses like a teenager|a widow quick and lively at eighty|spry means active for one's age; doddering means unsteady with age|spry 老当益壮；doddering 老态龙钟|senile means weak in mind from old age, the opposite of active and lively|senile 指年老糊涂，和矫健活跃正相反|doddering means weak and unsteady, the opposite of quick and active|doddering 指虚弱不稳，和敏捷矫健正相反|spry|the y at the end, as in shy|结尾是 y，同 shy
      doddering|an old man shuffling weak and unsteady down a road|a king so frail and shaky he could barely stand|trembling hands and unsteady steps that stopped a man driving|doddering means weak and unsteady; spry means active for one's age|doddering 老态龙钟；spry 老当益壮|spry means active and lively for one's age, the opposite of weak and unsteady|spry 指老当益壮，和虚弱不稳正相反|sprightly means full of energy, the opposite of frail and shaky|sprightly 指精力充沛，和虚弱颤抖正相反|dod · der · ing|the double d of dodder, then -ing|dodder 双写 d，再加 -ing
    `,
  },
);

/** batchesG are the batches of change and decay, order and chaos, plenty and want, manners, effort and idleness, and age. */
export const batchesG: readonly BatchSpec[] = [change, decay, order, plenty, manners, diligence, idleness, age];
