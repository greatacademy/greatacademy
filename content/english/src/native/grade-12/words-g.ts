// Grade 12: the batches of words of change and decay, order and chaos, plenty and want, manners, effort and idleness,
// and the ages of life.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const change = batch(
  "words-of-change-and-constancy",
  ["Words of Change and Constancy", "变化与恒常的词"],
  ["things that change and things that do not", "变化之物与不变之物"],
  `
  metamorphosis|a complete change of form, as from caterpillar to butterfly|变形，蜕变|The ___ of a tadpole into a frog takes weeks.|The town underwent a ___ after the factory opened.|Kafka's story begins with a strange ___.|vicissitude,flux|metamorphoses
  transmute|to change something completely into something else|使变形，使嬗变|Alchemists tried to ___ lead into gold.|Grief can ___ into anger.|The artist tried to ___ pain into beauty.|oscillate,fluctuate|transmuted,transmutation
  mutable|able or likely to change|易变的|Fashion is highly ___.|Our plans are ___ until Friday.|The ___ weather of spring ruined the picnic.|immutable,flux|mutability
  immutable|never changing; unable to be changed|不可改变的|The laws of physics seem ___.|Her opinion was ___.|No rule is ___ forever.|mutable,flux|immutability
  flux|continuous change|不断的变化|The market is in a state of ___.|The country was in ___ after the election.|Language is always in ___.|metamorphosis,vicissitude|
  vicissitude|a change of circumstances, especially an unwelcome one|变迁，兴衰|She survived every ___ of fortune.|The family faced each ___ with courage.|The book follows each ___ of the war.|flux,metamorphosis|vicissitudes
  fluctuate|to rise and fall irregularly|波动|Prices ___ from week to week.|His mood tends to ___.|Temperatures ___ in the desert.|oscillate,waver|fluctuated,fluctuating,fluctuation,fluctuations
  oscillate|to swing back and forth; to move between two states|摆动；动摇|The pendulum began to ___.|Her feelings ___ between hope and fear.|The signal seemed to ___ wildly.|fluctuate,transmute|oscillated,oscillating,oscillation
  vacillate|to keep changing one's mind|犹豫不决，摇摆|He tends to ___ between the two offers.|Don't ___; decide now.|The council began to ___ on the plan.|waver,oscillate|vacillated,vacillating,vacillation
  waver|to become unsteady or uncertain|动摇；摇曳|Her voice did not ___.|Support for the plan began to ___.|The candle flame seemed to ___ in the draft.|vacillate,fluctuate|wavered,wavering
  `,
);

const decay = batch(
  "words-of-decay-and-ruin",
  ["Words of Decay and Ruin", "衰败与毁坏的词"],
  ["things that rot, wear out and fall apart", "腐烂、磨损和崩塌之物"],
  `
  dilapidated|in a state of disrepair because of age or neglect|破旧的，失修的|They bought a ___ farmhouse and rebuilt it.|The ___ bus barely made it up the hill.|A ___ fence surrounded the yard.|ramshackle,putrid|dilapidation
  ramshackle|badly made and likely to fall apart|摇摇欲坠的|A ___ hut stood by the river.|The team's ___ defense let in five goals.|They lived in a ___ old caravan.|dilapidated,moribund|
  derelict|abandoned and in very poor condition|废弃的，荒废的|A ___ factory stood at the edge of town.|The ___ ship rusted in the harbor.|___ houses lined the street.|decrepit,rancid|
  decrepit|old and in poor condition|衰老的，破旧的|A ___ old horse pulled the cart.|The ___ hotel had no hot water.|His ___ uncle walked with two sticks.|derelict,putrid|decrepitude
  moribund|close to death; no longer active|垂死的，停滞不前的|The ___ industry needed new ideas.|The patient was ___.|The ___ town lost its last shop.|decrepit,ramshackle|
  putrid|rotting and smelling very bad|腐烂发臭的|A ___ smell came from the drain.|The meat had turned ___.|They held their noses at the ___ pond.|rancid,derelict|
  rancid|smelling or tasting unpleasant because it is no longer fresh, especially of fat or oil|(油脂)变质的，腐臭的|The butter had gone ___.|A ___ smell filled the kitchen.|Old nuts can taste ___.|putrid,moribund|
  decompose|to rot or break down into simpler parts|腐烂，分解|Leaves ___ and feed the soil.|Plastic takes centuries to ___.|The body had begun to ___.|atrophy,fester|decomposed,decomposition
  atrophy|to waste away from lack of use; a wasting away|萎缩|Muscles ___ if they are not used.|Skills ___ when you stop practicing.|The disease causes ___ of the nerves.|fester,decompose|atrophied
  fester|to become infected; to grow worse over time|化脓；恶化|The cut began to ___.|Old grudges ___ in small towns.|Don't let the problem ___.|atrophy,decompose|festered,festering
  `,
);

const order = batch(
  "words-of-order-and-chaos",
  ["Words of Order and Chaos", "秩序与混乱的词"],
  ["calm arrangement and wild confusion", "井然有序与一片混乱"],
  `
  pandemonium|wild and noisy disorder|大混乱，喧闹|___ broke out when the lights went off.|The goal caused ___ in the stands.|There was ___ in the classroom after the bell.|bedlam,tumult|
  tumult|a loud, confused noise of a crowd; a state of great confusion|喧哗，骚动|The ___ of the market woke him early.|Her mind was in a ___ after the news.|The speech ended in a ___ of cheers.|pandemonium,mayhem|tumultuous
  disarray|a state of untidiness or confusion|混乱，凌乱|The room was in complete ___ after the party.|The army retreated in ___.|The party fell into ___ after its leader resigned.|anarchy,mayhem|
  mayhem|violent or damaging disorder|混乱，骚乱|The storm caused ___ on the roads.|Two goats caused ___ in the garden.|Fans caused ___ in the city center.|pandemonium,disarray|
  bedlam|a scene of uproar and confusion|混乱嘈杂的场面|It was ___ in the kitchen before dinner.|The station was ___ during the strike.|Twenty toddlers turned the room into ___.|pandemonium,tumult|
  anarchy|a state with no government or order at all|无政府状态，混乱|The country fell into ___ after the war.|Without rules, the game became ___.|Some feared ___ if the police went on strike.|disarray,mayhem|anarchic,anarchist
  methodical|done in a careful, orderly way, step by step|有条不紊的|She is a ___ worker who never skips a step.|The detective made a ___ search of the house.|A ___ approach saved them time.|systematic,haphazard|methodically
  systematic|done according to a fixed plan or system|系统的，有计划的|The scientists made a ___ study of the river.|They need a ___ way of filing papers.|There was ___ abuse of power.|methodical,regimented|systematically
  regimented|very strictly organized and controlled|受严格管制的|Life at the boarding school was ___.|He hated the ___ routine of the army.|The garden had ___ rows of tulips.|systematic,haphazard|regimentation
  haphazard|having no order or plan; random|杂乱无章的，随意的|The books were piled in a ___ way.|Their ___ planning led to chaos.|The town grew in a ___ fashion.|methodical,regimented|haphazardly
  `,
);

const plenty = batch(
  "words-of-plenty-and-want",
  ["Words of Plenty and Want", "富足与匮乏的词"],
  ["too much, enough and too little", "过多、足够与太少"],
  `
  surfeit|an amount that is too large, more than is needed|过量|A ___ of sugar is bad for your teeth.|There was a ___ of advice but no help.|After a ___ of cake, he felt sick.|glut,dearth|
  glut|a supply of goods that is far greater than demand|供过于求|A ___ of apples lowered the price.|The oil ___ hurt producers.|There is a ___ of graduates in law.|surfeit,paucity|
  plethora|a very large amount, often more than needed|过多，大量|The hotel offers a ___ of activities.|We faced a ___ of problems.|There is a ___ of apps for learning languages.|superfluity,dearth|
  superfluity|an amount beyond what is needed or useful|过剩，多余|A ___ of words weakens the essay.|The house had a ___ of chairs.|The report suffered from a ___ of detail.|plethora,paucity|superfluous
  dearth|a lack or shortage of something|缺乏，短缺|There is a ___ of good housing in the city.|The ___ of rain ruined the crops.|A ___ of evidence ended the case.|paucity,glut|
  paucity|the presence of something in very small amounts|稀少，不足|The ___ of data made the study weak.|The ___ of women in the field surprised her.|There is a ___ of shops in the village.|dearth,surfeit|
  sparse|thinly spread; small in number|稀疏的，稀少的|The desert has ___ vegetation.|His hair was ___ on top.|The crowd was ___ on a rainy day.|meager,copious|sparsely
  meager|lacking in quantity or quality|微薄的，贫乏的|They lived on a ___ income.|The soldiers ate a ___ meal of bread.|The results were ___ after a year of work.|sparse,ample|meagerly
  ample|enough or more than enough|充足的，大量的|There is ___ room for three cars.|You will have ___ time to finish.|The hotel has ___ parking.|copious,meager|amply
  copious|abundant; in large amounts|大量的，丰富的|She took ___ notes in class.|___ rain fell during the night.|The guests drank ___ cups of tea.|ample,sparse|copiously
  `,
);

const manners = batch(
  "words-of-manners-good-and-bad",
  ["Words of Manners Good and Bad", "礼貌与粗鲁的词"],
  ["polite and rude behavior", "有礼与无礼的举止"],
  `
  courteous|polite and respectful|有礼貌的|The waiter was ___ and patient.|Please send a ___ reply.|A ___ driver let us cross.|gracious,curt|courteously,courtesy
  gracious|kind, warm and polite, especially to people of lower rank|亲切的，和蔼的|The queen gave a ___ smile.|She was ___ in defeat.|Our ___ hosts made us feel at home.|courteous,suave|graciously
  suave|charming, confident and elegant, especially of a man|温文尔雅的，圆滑的|The ___ spy charmed everyone at the party.|He gave a ___ speech without notes.|A ___ salesman sold them the car.|gracious,boorish|suavely
  impudent|rude and lacking respect|无礼的，放肆的|The ___ boy laughed at the teacher.|What an ___ question!|He gave an ___ grin.|insolent,courteous|impudence
  insolent|rude and disrespectful, especially to someone in authority|傲慢无礼的|The ___ clerk refused to help.|Her ___ tone angered the judge.|He was fired for being ___ to the manager.|impudent,brusque|insolence
  brusque|abrupt or offhand in speech or manner|唐突的，生硬的|The doctor was ___ but kind.|He gave a ___ nod and left.|Her ___ manner put people off.|curt,churlish|brusquely
  curt|rudely short in speech|简短无礼的|He gave a ___ reply.|Her email was ___ and cold.|"No," came the ___ answer.|brusque,gracious|curtly
  churlish|rude in a mean-spirited and surly way|粗暴的，没礼貌的|It would be ___ to refuse his gift.|The ___ guard ignored our questions.|Don't be ___ about her success.|boorish,insolent|churlishly
  boorish|rough and bad-mannered|粗鲁的，粗野的|His ___ jokes upset the guests.|The ___ fans shouted at the players.|Talking during the play was ___.|uncouth,suave|boor
  uncouth|lacking good manners or refinement|粗俗的，没教养的|Eating with your mouth open is ___.|The ___ young man spat on the floor.|They found his speech ___.|boorish,courteous|
  `,
);

const diligence = batch(
  "words-of-diligence-and-sloth",
  ["Words of Diligence and Sloth", "勤奋与懒惰的词"],
  ["working hard and avoiding work", "努力工作与逃避工作"],
  `
  diligent|showing care and effort in one's work|勤奋的|A ___ student checks every answer.|The ___ clerk found the mistake.|She was ___ in her research.|industrious,indolent|diligently,diligence
  industrious|hard-working and busy|勤劳的|The ___ ants gathered food all summer.|They are an ___ family of farmers.|An ___ worker rarely rests.|diligent,slothful|industriously
  assiduous|showing great care and steady attention|刻苦的，一丝不苟的|Her ___ practice made her a fine pianist.|The ___ nurse checked on him every hour.|He was ___ in keeping records.|sedulous,lethargic|assiduously
  sedulous|showing careful, constant effort|孜孜不倦的|She paid ___ attention to every detail.|The scholar made a ___ study of the letters.|With ___ care, he copied the map.|assiduous,languid|sedulously
  indefatigable|never tiring or giving up|不知疲倦的|The ___ volunteer worked through the night.|She was an ___ campaigner for clean water.|His ___ energy amazed us.|tireless,lethargic|
  tireless|working hard without becoming tired|不知疲倦的|Thanks for your ___ work on the project.|She is a ___ friend to the poor.|The ___ dog searched all day.|indefatigable,indolent|tirelessly
  indolent|wanting to avoid activity or effort; lazy|懒惰的|The ___ student never did homework.|They spent an ___ summer by the pool.|An ___ manager let things slide.|slothful,diligent|indolence
  slothful|lazy and slow to act|怠惰的|The ___ guard slept at his post.|It is ___ to leave dishes for days.|A ___ habit is hard to break.|indolent,industrious|sloth
  lethargic|sluggish and lacking energy|没精打采的，昏睡的|The heat made everyone ___.|He felt ___ after the big lunch.|The ___ economy grew slowly.|languid,indefatigable|lethargy
  languid|relaxed and slow, without energy or effort|慵懒的，无精打采的|She gave a ___ wave from the hammock.|The afternoon was hot and ___.|He spoke in a ___ voice.|lethargic,assiduous|languidly
  `,
);

const idleness = batch(
  "words-of-delay-and-idleness",
  ["Words of Delay and Idleness", "拖延与闲散的词"],
  ["slowness, putting things off and doing things carelessly", "迟缓、拖延和马虎"],
  `
  sluggish|moving or responding slowly|缓慢的，迟钝的|The ___ river barely moved.|My laptop is ___ today.|Sales were ___ in winter.|torpid,sporadic|sluggishly
  torpid|inactive and sleepy, as an animal in winter|麻木的，蛰伏的|The ___ lizard lay in the cold.|The heat left the town ___.|Bears are ___ in winter.|listless,sluggish|torpor
  listless|lacking energy or interest|倦怠的，无精打采的|The sick child was ___.|The team gave a ___ display.|He stared out the window, ___ and bored.|torpid,desultory|listlessly
  loiter|to stand or wait around with no purpose|闲逛，游荡|Teenagers ___ outside the shop.|Do not ___ near the gates.|He liked to ___ in the park after school.|dawdle,shirk|loitered,loitering
  dawdle|to waste time; to move slowly|磨蹭，闲荡|Don't ___ on the way home.|The children ___ over breakfast.|We can't ___; the train leaves soon.|loiter,procrastinate|dawdled,dawdling
  procrastinate|to delay doing something one should do|拖延|Students often ___ before exams.|Stop putting it off; don't ___.|He tends to ___ until the last minute.|dawdle,shirk|procrastinated,procrastination
  sporadic|happening at irregular intervals; scattered|零星的，偶尔的|There was ___ gunfire in the night.|___ showers are expected.|Her visits became ___.|desultory,sluggish|sporadically
  desultory|lacking a plan, purpose or enthusiasm|随意的，散漫的|They made ___ conversation while waiting.|He made a ___ attempt to tidy up.|The talks were ___ and went nowhere.|sporadic,slapdash|desultorily
  slapdash|done too hastily and carelessly|马虎的，草率的|The ___ repairs soon failed.|Her ___ essay was full of errors.|He did a ___ job of painting the fence.|desultory,listless|
  shirk|to avoid a duty or work|逃避，推卸|Don't ___ your share of the chores.|He would never ___ responsibility.|Soldiers who ___ their duty are punished.|loiter,procrastinate|shirked,shirking,shirker
  `,
);

const age = batch(
  "words-of-youth-and-old-age",
  ["Words of Youth and Old Age", "青年与老年的词"],
  ["the young, the old and their ways", "年少、年老及其特点"],
  `
  puerile|childishly silly|幼稚的，愚蠢的|His ___ jokes annoyed the class.|The film's humor was ___.|Stop this ___ behavior.|infantile,senile|
  infantile|of or like a baby; very childish|婴儿的；幼稚的|The ___ tantrum embarrassed his parents.|___ diseases include measles.|His reply was ___.|puerile,geriatric|
  senile|weak in mind because of old age|老糊涂的，衰老的|Her ___ grandmother forgot her name.|He is old but not ___.|___ patients need patient care.|doddering,infantile|senility
  venerable|respected because of age, wisdom or character|德高望重的，古老而受尊敬的|The ___ professor still taught at ninety.|The ___ oak stood in the square.|They visited a ___ temple.|sprightly,senile|
  geriatric|relating to old people and their care|老年的，老年病的|She works in a ___ hospital.|The ___ ward needs more nurses.|Doctors study ___ medicine.|infantile,venerable|
  octogenarian|a person aged between eighty and eighty-nine|八旬老人|The ___ ran his first marathon.|A spry ___ led the dance.|The village's oldest ___ was eighty-nine.|centenarian,geriatric|octogenarians
  centenarian|a person a hundred or more years old|百岁老人|The ___ blew out her candles.|Japan has many a ___.|The ___ remembered the old king.|octogenarian,venerable|centenarians
  sprightly|lively and full of energy, especially of an old person|活泼的，精力充沛的|The ___ old man climbed the hill.|She was ___ at seventy.|A ___ tune played on the radio.|spry,doddering|
  spry|active and lively, especially for one's age|(老人)矫健的|My ___ grandfather still swims daily.|She is ___ for her age.|The ___ widow gardened every morning.|sprightly,senile|
  doddering|weak and unsteady from old age|老态龙钟的，蹒跚的|A ___ old man shuffled down the road.|The ___ king could barely stand.|He was too ___ to drive.|senile,spry|
  `,
);

/** batchesG are the batches of change and decay, order and chaos, plenty and want, manners, effort and idleness, and age. */
export const batchesG: readonly BatchSpec[] = [change, decay, order, plenty, manners, diligence, idleness, age];
