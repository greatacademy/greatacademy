// Grade 11: the batches of words of stubborn and fickle minds, of how much and how little, of keeping and letting go,
// of dislike and lightness, of doubt and belief, of excellence, of hardship and of the ranks and types of society.

import { t } from "@ga/content";
import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const stubborn = batch(
  "words-of-firm-and-fickle-minds",
  ["Words of Firm and Fickle Minds", "坚定与多变心志的词"],
  ["holding fast, changing often and caring much or little", "坚持、多变与在乎的多少"],
  `
  adamant|refusing to be persuaded or to change one's mind|坚决的，固执的|Though everyone told her she was wrong, she was ___ that she had locked the door and would hear no argument.|He remained ___ in his refusal to sign, and no offer, however generous, could move him.|The coach was ___: whatever the players said, he would not change the team, not today and not ever.|amenable,capricious|adamantly
  obstinate|stubbornly refusing to change one's opinion|固执的，顽固的|The mule was ___, planting its feet and refusing to move no matter how hard we pulled.|He was too ___ to say sorry, clinging to his view long after everyone had shown he was wrong.|My grandfather is ___ about his old car; no reason we give will make him change his mind and sell it.|amenable,capricious|obstinately,obstinacy
  incorrigible|not able to be corrected or reformed|无可救药的|He is ___, still lying every day though he has been punished a hundred times.|The boy was ___, playing the same tricks again after every scolding, warning and punishment.|Years of failed diets showed she was ___ about sweets; nothing could cure her of eating them.|amenable,exemplary|incorrigibly
  inveterate|having a long-standing habit that is unlikely to change|积习难改的|As a gambler my uncle is ___, betting every week for forty years without a break.|As a reader of novels she was ___, keeping a habit she had followed every night since childhood.|His ___ lateness, a habit of thirty years, was something no one expected him to change.|capricious,erratic|
  amenable|open and responsive to suggestion|顺从的，愿意接受的|Once she heard our reasons, she was ___ to the new plan and agreed at once.|The boss is ___ to change; she listens to every suggestion and will try new ideas.|The patient was ___ to treatment, willingly doing whatever the doctors advised.|adamant,obstinate|
  capricious|given to sudden changes of mood or behavior|反复无常的|The ___ queen changed her mind daily, ordering a feast one moment and canceling it the next.|Spring weather is ___, sunny at noon and snowing an hour later without warning.|Working for a boss who is ___, cheerful one minute and furious the next for no reason, is hard.|obstinate,inveterate|capriciously
  erratic|not even or regular in pattern or movement|不稳定的，古怪的|His driving was ___, swerving left and right and speeding up and slowing down without warning.|The patient's pulse was ___, racing one moment and slowing almost to nothing the next.|Her work has been ___ this term, excellent one week and careless the next.|inveterate,stagnant|erratically
  fervent|having or showing passionate intensity|热烈的，强烈的|As a supporter of the team she is ___, cheering with all her heart at every match.|He wept as he prayed, and his prayer was ___, begging with all his soul for his son's recovery.|Their hope of peace was ___, a burning wish that filled every one of their letters.|nonchalant,indifferent|fervently,fervor
  zealous|showing great energy or enthusiasm for a cause|热心的，狂热的|The ___ fans painted their faces and chanted for hours, full of energy for their club.|The ___ officer, eager to enforce every law, stopped and searched every car on the road.|She was ___ in her work for the poor, working day and night with endless energy.|lax,nonchalant|zealously,zeal
  nonchalant|calm and relaxed; seeming not to care|若无其事的，漠不关心的|When told he had failed, he gave a calm, ___ shrug, as though it did not matter at all.|She was relaxed and ___ about the exam, chatting happily without a word of complaint.|His cool, ___ manner hid his nerves; he looked as if he had not a care in the world.|fervent,querulous|nonchalantly,nonchalance
  `,
  "context-clues",
  {
    intro: t(
      "The **adamant** coach would not change his plan, his **capricious** assistant changed hers every hour, and the **nonchalant** star player just shrugged at them both. These ten words help you describe minds that hold fast, minds that keep changing, and how much a person cares.",
      "那位坚决的（**adamant**）教练不肯改变计划，他那反复无常的（**capricious**）助手每小时都改主意，而若无其事的（**nonchalant**）明星球员只是对他俩耸耸肩。这十个词帮你描写坚持己见的心、变来变去的心，以及一个人在乎的程度。",
    ),
    watchOut: {
      meanings: t(
        "**Adamant** and **obstinate** both refuse to change, but **obstinate** suggests unreasonable stubbornness; **incorrigible** means a fault can't be cured; **inveterate** means a habit has lasted so long it is part of a person.",
        "**adamant** 和 **obstinate** 都不肯改变，但 **obstinate** 暗含不讲理的执拗；**incorrigible** 指毛病改不掉；**inveterate** 指习惯由来已久，成了人的一部分。",
      ),
      use: t(
        "**Capricious** describes sudden changes of *mood or mind*; **erratic** describes an *uneven pattern*, such as a pulse, driving or results. **Fervent** is about strong *feeling*, **zealous** about energetic *action* for a cause.",
        "**capricious** 形容*心情或主意*突然改变；**erratic** 形容*节奏或模式*不稳定，如脉搏、驾驶或成绩。**fervent** 重在强烈的*感情*，**zealous** 重在为某事业积极*行动*。",
      ),
      spelling: t(
        "Watch the *-ant* of **adamant** and **nonchalant**, the double *r* of **incorrigible**, the *ci* of **capricious**, and the *-erate* of **inveterate**.",
        "注意 **adamant** 和 **nonchalant** 的 -ant、**incorrigible** 的双写 r、**capricious** 里的 ci，以及 **inveterate** 的 -erate。",
      ),
    },
    notes: `
      adamant|a woman sure she had locked the door who would hear no argument|a refusal to sign that no generous offer could move|a coach who would not change the team whatever the players said|adamant refuses to change; capricious changes all the time|adamant 坚决不改；capricious 反复无常|amenable means open to suggestion, the opposite of refusing every argument and offer|amenable 指愿意接受建议，和拒绝一切劝说正相反|capricious means changing suddenly and often, the opposite of never changing one's mind|capricious 指说变就变，和决不改主意正相反|ad · a · mant|the -mant ending, with a in every syllable|结尾是 -mant，每个音节都是 a
      obstinate|a mule refusing to move however hard it was pulled|a man clinging to his view after being shown he was wrong|a grandfather no reason will persuade to sell his old car|obstinate is stubborn and unreasonable; amenable is open to persuasion|obstinate 顽固；amenable 愿意被说服|amenable means open to suggestion, the opposite of refusing to move or change|amenable 指愿意接受建议，和不肯动、不肯变正相反|capricious means changing on a whim, not clinging to one view|capricious 指随意改变，不是死守一个看法|ob · sti · nate|ob- plus sti- plus -nate|ob- 加 sti- 再加 -nate
      incorrigible|a man still lying daily after a hundred punishments|a boy playing the same tricks after every scolding|a woman nothing could cure of eating sweets|incorrigible cannot be reformed; amenable responds to correction|incorrigible 无可救药；amenable 肯听劝|amenable means willing to accept advice, the opposite of ignoring every punishment|amenable 指肯接受劝告，和屡教不改正相反|exemplary means good enough to be copied, not a person whose faults cannot be cured|exemplary 指可作楷模，不是毛病改不掉的人|in · cor · ri · gi · ble|the double r and the -ible ending|双写 r，结尾是 -ible
      inveterate|a gambler betting every week for forty years|a reader keeping a nightly habit since childhood|lateness that had been a habit for thirty years|inveterate is a long, fixed habit; erratic is irregular|inveterate 积习难改；erratic 不稳定|capricious means changing suddenly, the opposite of a habit kept for decades|capricious 指说变就变，和几十年不变的习惯正相反|erratic means irregular and uneven, the opposite of a steady habit every week or night|erratic 指没有规律，和每周每晚雷打不动的习惯正相反|in · vet · er · ate|in- plus veter- plus -ate, as in veteran|in- 加 veter- 再加 -ate，同 veteran
      amenable|a woman agreeing to a new plan once she heard the reasons|a boss who listens to every suggestion|a patient willingly doing whatever doctors advised|amenable is open to suggestion; obstinate refuses to change|amenable 愿意接受；obstinate 固执|adamant means refusing to be persuaded, the opposite of agreeing once one hears the reasons|adamant 指拒不接受劝说，和听了理由就同意正相反|obstinate means stubbornly refusing to change, the opposite of trying new ideas|obstinate 指顽固不变，和愿意尝试新想法正相反|a · me · na · ble|the -able ending after amen-|amen- 后接 -able
      capricious|a queen ordering a feast and canceling it the next moment|weather sunny at noon and snowing an hour later|a boss cheerful one minute and furious the next|capricious changes suddenly; inveterate never changes|capricious 反复无常；inveterate 积习难改|obstinate means refusing to change, the opposite of changing one's mind daily|obstinate 指顽固不变，和每天改主意正相反|inveterate means fixed by long habit, the opposite of sudden changes|inveterate 指积习已久，和突然改变正相反|ca · pri · cious|the -cious ending after capri-|capri- 后接 -cious
      erratic|driving that swerved and changed speed without warning|a pulse racing one moment and slowing the next|work excellent one week and careless the next|erratic is irregular; stagnant shows no movement|erratic 不稳定；stagnant 停滞不动|inveterate means fixed by long habit, the opposite of uneven and unpredictable|inveterate 指积习已久，和忽高忽低、无法预料正相反|stagnant means showing no movement or change, the opposite of racing and slowing|stagnant 指停滞不动，和忽快忽慢正相反|er · ra · tic|the double r, as in error|双写 r，同 error
      fervent|a supporter cheering with all her heart at every match|a prayer begging with all his soul for a son's recovery|a burning wish for peace that filled every letter|fervent is passionately intense; indifferent does not care|fervent 热烈；indifferent 漠不关心|nonchalant means calm and unconcerned, the opposite of begging with all one's soul|nonchalant 指若无其事，和全心全意地祈求正相反|indifferent means having no interest, the opposite of cheering with all one's heart|indifferent 指漠不关心，和全心全意地加油正相反|fer · vent|fer- plus vent, as in vent|fer- 加 vent
      zealous|fans chanting for hours, full of energy for their club|an officer eager to enforce every law who searched every car|a woman working day and night for the poor|zealous acts with great energy for a cause; lax is not strict enough|zealous 热心积极；lax 松懈|lax means not strict or careful enough, the opposite of stopping and searching every car|lax 指松懈，和每辆车都拦下搜查正相反|nonchalant means calm and unconcerned, the opposite of endless energy for a cause|nonchalant 指漫不经心，和为事业不知疲倦正相反|zeal · ous|zeal plus -ous|zeal 加 -ous
      nonchalant|a calm shrug at news of failure|a woman relaxed and happy about an exam without complaint|a cool manner that looked as if he had no care in the world|nonchalant seems not to care; fervent cares passionately|nonchalant 若无其事；fervent 满怀激情|fervent means passionately intense, the opposite of a calm shrug|fervent 指热烈强烈，和平静地耸耸肩正相反|querulous means complaining and whining, not calm and relaxed without complaint|querulous 指爱抱怨，不是平静放松、毫无怨言|non · cha · lant|the ch said like sh and the -ant ending|ch 读作 sh，结尾是 -ant
    `,
  },
);

const extent = batch(
  "words-of-much-and-little",
  ["Words of Much and Little", "多与少的词"],
  ["great numbers, emptiness and small importance", "大量、空无与无足轻重"],
  `
  myriad|a countless or very great number|无数，大量|On the calm, clear night the sky held a ___ of stars, far too many to count.|The market offers a ___ of choices, thousands of goods laid out quietly in neat rows.|Under the microscope a single drop showed a ___ of tiny creatures, more than anyone could ever count.|modicum,maelstrom|
  replete|filled or well supplied with something|充满的|The book is ___ with jokes, packed with one on every page.|The old house was ___ with furniture, every room crammed with chairs, chests and tables.|History is ___ with wars, its pages filled with battle after battle.|devoid,conspicuous|
  devoid|entirely lacking or free from|完全没有的|After the move, the room was ___ of furniture, without even a single chair.|His voice was ___ of feeling, flat and empty of any warmth at all.|The desert is almost ___ of life; not a plant or animal can be seen for miles.|replete,prolific|
  inundate|to flood; to overwhelm with things to deal with|淹没；使应接不暇|Each spring the river will ___ the fields, covering them in deep water for weeks.|After the show, fans began to ___ the station with calls, thousands of them, until the phones could not keep up.|Readers will ___ the office with letters, so many that the staff cannot open them all.|dissipate,relinquish|inundated
  prolific|producing much fruit, work or offspring|多产的|She is a ___ writer, producing two crime novels every year for thirty years.|Rabbits are ___ breeders, having many litters of young each year.|In his best season he was a ___ scorer, putting the ball in the net almost every game.|stagnant,defunct|prolifically
  diminutive|extremely small|极小的|The ___ dancer, barely taller than a child, leapt into the center of the stage.|A tiny, ___ cottage, hardly bigger than a garden shed, sat at the end of the lane.|The ___ puppy, small enough to fit in a teacup, was the smallest of the litter.|prodigious,peripheral|
  peripheral|on the edge; of secondary importance|外围的；次要的|The new airport was built in a ___ district on the far edge of the city, well away from the center where few people ever notice it.|He played only a ___ role in the plot, standing at the edge of events while others made the decisions.|Such questions are ___ to the main debate, lying at its edges rather than its heart.|conspicuous,palpable|
  inconsequential|not important or significant|无关紧要的|They chatted about ___ things, small matters that made no difference to anyone.|The error was ___, a tiny slip that changed nothing in the final result.|Don't waste time on ___ details that will never matter; focus on what counts.|palpable,prodigious|
  palpable|so intense as to be almost touched or felt; obvious|可感知的；明显的|The tension in the room was ___, so thick that you could almost touch it, and it mattered to everyone there.|Her relief was ___ and very real; you could feel it as she let out a long sigh.|The excitement in the stadium was ___, a real buzz that everyone could feel in the air.|illusory,inconsequential|palpably
  conspicuous|standing out so as to be clearly visible|显眼的，引人注目的|He wore a huge, ___ red hat that everyone could see from across the square.|In her bright yellow dress she felt ___, standing out among the guests in grey.|There was a ___ lack of support: in the middle of the hall, every seat stood plainly and visibly empty.|diminutive,peripheral|conspicuously
  `,
  "context-clues",
  {
    intro: t(
      "The **prolific** author's study was **replete** with books, its desk **inundated** with letters, yet the tiny garden outside was almost **devoid** of flowers. These ten words help you describe great numbers, fullness, emptiness, size and importance.",
      "那位多产的（**prolific**）作家的书房里堆满了（**replete**）书，书桌被信件淹没（**inundated**），而外面的小花园里却几乎没有（**devoid**）花。这十个词帮你描写数量之多、充满与空无、大小和重要程度。",
    ),
    watchOut: {
      meanings: t(
        "**Peripheral** means at the *edge* or of *secondary* importance; **inconsequential** means of *no* importance at all; **palpable** means so strong it can almost be *felt*, while **conspicuous** means easily *seen*.",
        "**peripheral** 指在*边缘*或*次要*；**inconsequential** 指*毫无*重要性；**palpable** 指强烈得几乎能*感觉到*，**conspicuous** 则指*一眼就能看到*。",
      ),
      use: t(
        "**Replete** takes *with* and **devoid** takes *of*: a room is *replete with* furniture or *devoid of* it. **Myriad** is used here as a noun, *a myriad of* stars.",
        "**replete** 后接 with，**devoid** 后接 of：房间 replete with 家具，或 devoid of 家具。这里 **myriad** 作名词用，a myriad of stars。",
      ),
      spelling: t(
        "Watch the *y* of **myriad**, the *-date* of **inundate**, the *-utive* of **diminutive**, and the *-uous* of **conspicuous**.",
        "注意 **myriad** 里的 y、**inundate** 结尾 -date、**diminutive** 的 -utive，以及 **conspicuous** 的 -uous。",
      ),
    },
    notes: `
      myriad|a calm night sky with far too many stars to count|a market of thousands of goods laid out in neat rows|tiny creatures in one drop, more than anyone could count|a myriad is a countless number; a modicum is a small amount|myriad 是无数；modicum 是少量|modicum is a small amount, the opposite of far too many to count|modicum 是少量，和多得数不清正相反|maelstrom is a violent whirlpool or turmoil, not a calm, countless number|maelstrom 是猛烈的漩涡或混乱，不是平静而数不清的数量|myr · i · ad|the y after m and the -iad ending|m 后面是 y，结尾是 -iad
      replete|a book with a joke on every page|a house crammed with chairs, chests and tables|history filled with battle after battle|replete is filled with something; devoid is lacking it|replete 充满；devoid 完全没有|devoid means entirely lacking, the opposite of packed and crammed full|devoid 指完全没有，和塞得满满正相反|conspicuous means easy to see, not filled with something|conspicuous 指显眼，不是充满某物|re · plete|re- plus plete, as in complete|re- 加 plete，同 complete
      devoid|a room without even a single chair|a flat voice empty of warmth|a desert with no plant or animal for miles|devoid is entirely lacking; replete is full|devoid 完全没有；replete 充满|replete means full of something, the opposite of without a single chair or plant|replete 指充满，和连一把椅子、一株植物都没有正相反|prolific means producing a great deal, the opposite of empty of life|prolific 指多产，和毫无生命正相反|de · void|de- plus void|de- 加 void
      inundate|a river covering fields in deep water for weeks|thousands of calls more than a station's phones could handle|letters so many the staff cannot open them all|inundate floods or overwhelms; dissipate scatters and disappears|inundate 淹没；dissipate 消散|dissipate means to scatter and fade away, the opposite of covering fields in water or flooding phones|dissipate 指消散，和淹没田地或打爆电话正相反|relinquish means to give something up, not to flood or overwhelm|relinquish 指放弃，不是淹没或使应接不暇|in · un · date|in- plus un- plus -date|in- 加 un- 再加 -date
      prolific|a writer producing two novels a year for thirty years|rabbits having many litters each year|a scorer putting the ball in the net almost every game|prolific produces much; stagnant shows no growth|prolific 多产；stagnant 停滞|stagnant means showing no activity or growth, the opposite of producing much|stagnant 指停滞不前，和多产正相反|defunct means no longer existing or working, not producing two novels a year|defunct 指已不存在或失效，不是每年写两本小说|pro · lif · ic|pro- plus lif- plus -ic|pro- 加 lif- 再加 -ic
      diminutive|a dancer barely taller than a child at the center of a stage|a cottage hardly bigger than a garden shed|a puppy small enough to fit in a teacup|diminutive is extremely small; prodigious is remarkably great|diminutive 极小；prodigious 巨大|prodigious means remarkably great, the opposite of barely bigger than a shed or a teacup|prodigious 指大得惊人，和比小棚子、茶杯大不了多少正相反|peripheral means at the edge, not small, and a dancer at center stage is not at the edge|peripheral 指在边缘，不是小，而且舞台中央的舞者并不在边缘|di · min · u · tive|the -utive ending, as in minute|结尾是 -utive，同 minute
      peripheral|an airport district on the far edge of a city|a role at the edge of events while others decided|questions at the edges of a debate rather than its heart|peripheral is at the edge; conspicuous stands out to all eyes|peripheral 在边缘；conspicuous 引人注目|conspicuous means easy to see and standing out, the opposite of at the edge where few notice|conspicuous 指显眼，和处在少有人注意的边缘正相反|palpable means so strong it can be felt, not at the edge or secondary|palpable 指强烈得能感觉到，不是边缘或次要|pe · riph · er · al|the ph said like f|ph 读作 f
      inconsequential|small matters that made no difference to anyone|a tiny slip that changed nothing in the result|details that will never matter|inconsequential is of no importance; prodigious is remarkably great|inconsequential 无关紧要；prodigious 巨大|palpable means strong enough to be felt, not small and making no difference|palpable 指强烈可感，不是微小、毫无影响|prodigious means remarkably great, the opposite of tiny and unimportant|prodigious 指大得惊人，和微不足道正相反|in · con · se · quen · tial|in- plus consequential, with the -tial ending|in- 加 consequential，结尾是 -tial
      palpable|tension so thick you could almost touch it|relief you could feel in a long sigh|excitement felt as a buzz in a stadium|palpable can almost be felt; illusory is not real|palpable 可感知；illusory 虚幻|illusory means not real, the opposite of real tension, relief and excitement one could feel|illusory 指虚幻，和真实可感的紧张、宽慰、兴奋正相反|inconsequential means unimportant, the opposite of something that mattered to everyone|inconsequential 指无关紧要，和人人都在意的事正相反|pal · pa · ble|pal- plus -pable, with the -able ending|pal- 加 -pable，结尾是 -able
      conspicuous|a huge red hat seen from across a square|a bright yellow dress standing out among grey|every seat plainly empty in the middle of a hall|conspicuous is clearly visible; peripheral is at the edge|conspicuous 显眼；peripheral 在边缘|diminutive means extremely small, the opposite of a huge hat|diminutive 指极小，和巨大的帽子正相反|peripheral means at the edge, not standing out in the middle|peripheral 指在边缘，不是在中央引人注目|con · spic · u · ous|the -uous ending, with u before -ous|结尾是 -uous，-ous 前有 u
    `,
  },
);

const keeping = batch(
  "words-of-holding-and-letting-go",
  ["Words of Holding and Letting Go", "保持与放弃的词"],
  ["joining, giving up, wasting and fading", "结合、放弃、浪费与衰退"],
  `
  consolidate|to make stronger; to combine into one|巩固；合并|With a third goal, the team hoped to ___ its lead, making it stronger and safer.|The council wants to ___ the two small schools, joining them into one stronger school.|Daily review helps you ___ what you have learned, making it firmer in your memory.|relinquish,squander|consolidated,consolidation
  coalesce|to come together to form one mass or whole|联合，合并|Over the summer the small protest groups began to ___ into a single movement.|On the window, the tiny drops ___ into one large puddle that ran down the glass.|Slowly her scattered ideas started to ___ into one clear plan.|dissipate,languish|coalesced
  relinquish|to give up willingly|放弃，交出|Though offered a fortune, he would not ___ control of the company, handing it to no one.|In the end she agreed to ___ her claim to the land, willingly giving it up to her brother.|The old king refused to ___ the throne and kept ruling until his death.|rescind,consolidate|relinquished
  rescind|to cancel a law, order or agreement|废除，撤销|The council voted to ___ the ban on bicycles, cancelling the rule after one year.|The firm chose to ___ the job offer, cancelling it a day before she was to start.|The school will ___ the rule on phones, so from Monday it will no longer apply.|relinquish,relegate|rescinded
  relegate|to move to a lower rank or position|降级，贬谪|After the argument they tried to ___ her to a small office in the basement, far below her old rank.|One more loss may ___ the team to the second division, a step down from the top league.|Don't ___ this issue to the end of the meeting, as if it were the least important.|rescind,consolidate|relegated,relegation
  squander|to waste money, time or chances in a reckless way|挥霍，浪费|Don't ___ your savings on games you will tire of in a week.|He would ___ every chance he got, wasting each one through laziness.|Through careless play, they managed to ___ a two-goal lead and lose the match.|garner,consolidate|squandered
  languish|to grow weak; to be kept in an unpleasant place or state|衰退；受煎熬|Without water, the plants ___ and droop, growing weaker each day.|Forgotten by the world, he was left to ___ in a cold prison cell for ten years.|The project began to ___ for lack of money, slowing down and losing strength month by month.|burgeon,coalesce|languished
  stagnant|not flowing; showing no activity or growth|不流动的；停滞的|Mosquitoes breed in ___ water, pools that never flow and sit still for months.|Wages have been ___ for years, not rising at all though the companies are still busy.|The economy is ___, showing no growth for a decade, though shops still open every day.|defunct,transient|stagnate
  defunct|no longer existing or working|不再存在的，失效的|The factory, which ran for fifty years, is now ___; it closed for good a decade ago.|He collects stamps from ___ countries, nations that existed for centuries but are gone today.|The old law, which stood for a century, has been ___ for years and no longer has any force.|stagnant,transient|
  transient|lasting only for a short time|短暂的|Fame is often ___, lasting a few months before people forget.|The town's population of students is ___; most stay only a year or two.|The pain was ___, gone within a minute.|defunct,inveterate|transience
  `,
  "context-clues",
  {
    intro: t(
      "The rival firms chose to **consolidate**, but the new owner would not **relinquish** control, began to **squander** the profits, and let the business **languish** until it was **defunct**. These ten words help you describe joining, giving up, wasting and fading away.",
      "两家对手公司决定合并（**consolidate**），可新老板不肯交出（**relinquish**）控制权，开始挥霍（**squander**）利润，任由生意衰退（**languish**），直到公司倒闭（**defunct**）。这十个词帮你描写结合、放弃、浪费和衰亡。",
    ),
    watchOut: {
      meanings: t(
        "You **relinquish** something you *hold*, such as power or a claim; you **rescind** a *rule or decision*, cancelling it; you **relegate** someone to a *lower* place.",
        "**relinquish** 的是*手中*的东西，如权力或权利主张；**rescind** 的是*规定或决定*，即撤销；**relegate** 是把人或事降到*更低*的位置。",
      ),
      use: t(
        "**Coalesce** has no object: drops *coalesce*. **Consolidate** usually takes one: a team *consolidates its lead*. **Stagnant** describes what *still exists* but does not move or grow; **defunct** describes what no longer exists at all.",
        "**coalesce** 不带宾语：水滴 coalesce。**consolidate** 通常带宾语：球队 consolidates its lead。**stagnant** 形容*仍然存在*却不动不长的东西；**defunct** 形容已经完全不存在的东西。",
      ),
      spelling: t(
        "Watch the *-esce* of **coalesce**, the *qu* of **relinquish** and **squander**, the silent *c* of **rescind**, and the *-unct* of **defunct**.",
        "注意 **coalesce** 的 -esce、**relinquish** 和 **squander** 里的 qu、**rescind** 里不发音的 c，以及 **defunct** 的 -unct。",
      ),
    },
    notes: `
      consolidate|a third goal to make a lead stronger and safer|two small schools joined into one stronger school|daily review making learning firmer in memory|consolidate makes stronger; squander wastes|consolidate 巩固；squander 浪费|relinquish means to give something up, the opposite of making a lead or learning stronger|relinquish 指放弃，和使领先或所学更牢固正相反|squander means to waste recklessly, the opposite of making something stronger and safer|squander 指肆意浪费，和使之更牢固安全正相反|con · sol · i · date|con- plus solid- plus -ate|con- 加 solid- 再加 -ate
      coalesce|small protest groups forming a single movement|tiny drops forming one large puddle|scattered ideas forming one clear plan|coalesce comes together into one; dissipate scatters apart|coalesce 合为一体；dissipate 消散|dissipate means to scatter and fade away, the opposite of forming a single whole|dissipate 指消散，和合为一体正相反|languish means to grow weak, not to come together into one|languish 指衰弱，不是汇聚成一体|co · a · lesce|the -esce ending, with sc|结尾是 -esce，中间有 sc
      relinquish|a man who would not hand control of his company to anyone|a woman willingly giving her land claim to her brother|a king who refused to give up the throne|relinquish gives up what one holds; rescind cancels a rule|relinquish 放弃所持之物；rescind 撤销规定|rescind means to cancel a law or decision, not to hand over control, land or a throne|rescind 指撤销法令或决定，不是交出控制权、土地或王位|consolidate means to make stronger, the opposite of giving something up|consolidate 指巩固，和放弃正相反|re · lin · quish|the qu after relin-|relin- 后面是 qu
      rescind|a council cancelling a bicycle ban after a year|a firm cancelling a job offer before the start date|a school phone rule that will no longer apply|rescind cancels a rule or decision; relegate moves something lower|rescind 撤销；relegate 降级|relinquish means to give up something one holds, not to cancel a ban, offer or rule|relinquish 指交出所持之物，不是撤销禁令、录用或规定|relegate means to move to a lower place, not to cancel a decision|relegate 指降到低位，不是撤销决定|re · scind|the silent c after s|s 后面有不发音的 c
      relegate|moving a woman to a basement office below her old rank|a team stepping down to the second division|pushing an issue to the end of a meeting as least important|relegate moves to a lower place; rescind cancels|relegate 降级；rescind 撤销|rescind means to cancel a law or decision, not to move a person or team lower|rescind 指撤销，不是把人或队伍降级|consolidate means to make stronger, not to push down to a lower rank|consolidate 指巩固加强，不是降到更低的位置|rel · e · gate|rel- plus e plus -gate|rel- 加 e 再加 -gate
      squander|savings wasted on games one will tire of in a week|chances wasted through laziness|a two-goal lead thrown away through careless play|squander wastes recklessly; garner gathers|squander 挥霍；garner 收集|garner means to gather or collect, the opposite of wasting savings and chances|garner 指收集积累，和浪费积蓄与机会正相反|consolidate means to make stronger, the opposite of throwing away a lead|consolidate 指巩固，和白白丢掉领先正相反|squan · der|the qu of squ- and the -der ending|squ- 里是 qu，结尾是 -der
      languish|plants drooping and growing weaker without water|a forgotten man left in a cold cell for ten years|a project slowing and losing strength without money|languish grows weak; burgeon grows fast|languish 衰弱；burgeon 迅速成长|burgeon means to grow and spread quickly, the opposite of drooping and weakening|burgeon 指迅速发展，和枯萎衰弱正相反|coalesce means to come together into one, not to weaken or be left forgotten|coalesce 指汇聚成一体，不是衰弱或被遗忘|lan · guish|the gu after lan-, as in language|lan- 后面是 gu，同 language
      stagnant|pools that never flow and sit still for months|wages not rising at all at busy companies|an economy with no growth for a decade though shops still open|stagnant still exists but does not move or grow; defunct no longer exists|stagnant 仍存在却停滞；defunct 已不复存在|defunct means no longer existing, not water, wages and an economy that are still there|defunct 指已不存在，而水、工资和经济都还在|transient means lasting only a short time, not sitting still for months or years|transient 指短暂，不是几个月几年停滞不动|stag · nant|stag- plus -nant, with the -ant ending|stag- 加 -nant，结尾是 -ant
      defunct|a factory that ran fifty years and closed a decade ago|countries that existed for centuries but are gone|a law that stood a century and no longer has force|defunct no longer exists or works; transient lasts only briefly|defunct 已不复存在；transient 短暂|stagnant means still there but not moving or growing, not closed or gone|stagnant 指仍在却停滞，不是已关闭或消失|transient means lasting only a short time, not things that lasted fifty years or centuries|transient 指短暂，不是存在了五十年乃至几百年的东西|de · funct|de- plus funct, as in function|de- 加 funct，同 function
      transient|fame lasting a few months before people forget|students who stay only a year or two|pain gone within a minute|transient lasts only a short time; inveterate has lasted a long time|transient 短暂；inveterate 由来已久|defunct means already gone for good, not lasting for a short time|defunct 指早已彻底消失，不是只持续很短的时间|inveterate means fixed by long habit, the opposite of lasting a short time|inveterate 指积习已久，和短暂正相反|tran · sient|the -sient ending, as in patient|结尾是 -sient，同 patient
    `,
  },
);

const dislike = batch(
  "words-of-dislike-and-levity",
  ["Words of Dislike and Levity", "厌恶与轻松的词"],
  ["annoyance, hatred, coldness and light humor", "恼怒、憎恶、冷漠与轻松幽默"],
  `
  chagrin|annoyance or distress at having failed or been humiliated|懊恼，失望|To his ___, he came second again, annoyed and ashamed to lose by a single point.|She hid her ___ with a smile, though she was deeply embarrassed at being beaten by her little brother.|Much to our ___, we missed the train by one minute, and we groaned at our own failure.|aversion,levity|chagrined
  aversion|a strong dislike|厌恶，反感|She has an ___ to cats, a dislike so strong that she leaves the room whenever one walks in.|He has an ___ to hard work, disliking it so much that he finds any excuse to avoid it.|They share an ___ to risk, strongly disliking any plan that might go wrong.|animosity,apathy|averse
  animosity|strong hostility|仇恨，敌意|Deep ___ divided the rivals, who glared at each other and refused even to shake hands.|Years of ___, bitter quarrels and angry insults, split the family in two.|Her ___ toward him grew so fierce that she would not stay in the same room as her enemy.|camaraderie,rapport|animosities
  apathy|lack of interest, enthusiasm or concern|冷漠，无兴趣|Voter ___ is high this year; most people do not care enough even to vote.|His ___ worried his teachers, who saw that he no longer cared about anything at school.|She fought public ___ toward the poor, trying to make comfortable people care at all.|animosity,levity|apathetic
  abhor|to regard with disgust and hatred|憎恶，厌恶|I ___ cruelty to animals; the very thought of it fills me with disgust.|Gentle by nature, she seemed to ___ violence, turning away in horror from every fight.|They ___ lies and regard every liar with deep disgust.|venerate,condone|abhorred,abhorrent
  levity|humor or lack of seriousness, especially when it is not suitable|轻率，不严肃|A moment of ___, a silly joke that made everyone laugh, eased the tension in the room.|His ___ at the funeral, joking and giggling during the prayers, upset everyone.|The children's ___, laughing and joking through the serious lesson, annoyed the teacher.|chagrin,apathy|
  pensive|engaged in deep or serious thought|沉思的|She sat quietly at the window in a ___ mood, thinking deeply about her future.|He grew silent and ___, lost in serious thought about what his father had said.|The portrait shows a ___ girl, her chin in her hand, deep in quiet thought.|querulous,boisterous|pensively
  querulous|complaining in a whining manner|爱抱怨的，发牢骚的|The ___ old man grumbled and whined about the food at every meal.|A thin, ___ voice called from upstairs, whining that the room was too cold.|The ___ child kept whining and complaining that he wanted more sweets.|pensive,indifferent|querulously
  indifferent|having no particular interest or sympathy; mediocre|漠不关心的；平庸的|She seemed ___ to his pleas, not caring at all whether he stayed or went.|He is ___ to fashion, wearing whatever is clean without a moment's interest or complaint.|The crowd was ___ to the speech, showing no interest and simply drifting away.|fervent,querulous|indifference
  exasperate|to irritate intensely|激怒，使恼火|His constant lateness began to ___ her, irritating her more each day.|Endless delays ___ travelers, who grow more and more irritated with every hour.|The loud music will ___ the neighbors until they bang angrily on the wall.|allay,abhor|exasperating,exasperation
  `,
  "context-clues",
  {
    intro: t(
      "The **querulous** guest complained all evening, his **apathy** toward the host's stories was plain, and only a moment of **levity** saved the dinner from open **animosity**. These ten words help you describe annoyance, hatred, coldness and light humor.",
      "那位爱抱怨的（**querulous**）客人一晚上都在发牢骚，他对主人的故事明显冷漠（**apathy**），只靠片刻的轻松（**levity**）才让晚宴没有闹到公开敌对（**animosity**）的地步。这十个词帮你描写恼怒、憎恶、冷漠和轻松的幽默。",
    ),
    watchOut: {
      meanings: t(
        "**Chagrin** is annoyance at your *own* failure; **aversion** is a strong dislike of a *thing or activity*; **animosity** is hostility toward *people*; **apathy** is not caring at all.",
        "**chagrin** 是对*自己*失败的懊恼；**aversion** 是对*事物或活动*的强烈反感；**animosity** 是对*人*的敌意；**apathy** 是什么都不在乎。",
      ),
      use: t(
        "**Abhor** means *you* hate something; **exasperate** means something irritates *someone else*: you *abhor* cruelty, but noise *exasperates* the neighbors. **Pensive** is quiet, serious thought; **levity** is the opposite, light humor at a serious time.",
        "**abhor** 是*自己*憎恶某事；**exasperate** 是某事激怒*别人*：你 abhor 残忍，噪音 exasperates 邻居。**pensive** 是安静、严肃的沉思；**levity** 正相反，是严肃场合里的轻浮玩笑。",
      ),
      spelling: t(
        "Watch the silent *h* of **abhor**, the *-grin* of **chagrin**, the *qu* and *-ulous* of **querulous**, and the *-perate* of **exasperate**.",
        "注意 **abhor** 里不发音的 h、**chagrin** 结尾的 -grin、**querulous** 里的 qu 和 -ulous，以及 **exasperate** 的 -perate。",
      ),
    },
    notes: `
      chagrin|annoyance and shame at losing by a single point|deep embarrassment at being beaten by a little brother|groaning at missing a train by one minute|chagrin is annoyance at one's own failure; aversion is a strong dislike|chagrin 是因失败而懊恼；aversion 是强烈反感|aversion is a strong dislike of something, not shame at one's own loss|aversion 是对某物的强烈反感，不是为自己的失败而羞愧|levity is light humor, not annoyance and shame at failing|levity 是轻松的玩笑，不是为失败而懊恼|cha · grin|cha plus grin, with ch said like sh|cha 加 grin，ch 读作 sh
      aversion|a dislike of cats so strong she leaves the room|a dislike of hard work that makes him find excuses|a strong dislike of any plan that might go wrong|aversion is a strong dislike of a thing; animosity is hostility toward people|aversion 是对事物的反感；animosity 是对人的敌意|animosity is hostility toward people, not a dislike of cats, work or risk|animosity 是对人的敌意，不是对猫、工作或风险的反感|apathy is not caring at all, the opposite of a dislike strong enough to act on|apathy 是毫不在乎，和强烈到要躲开的反感正相反|a · ver · sion|the -sion ending, as in version|结尾是 -sion，同 version
      animosity|rivals who glared and refused to shake hands|bitter quarrels and insults that split a family|hostility so fierce she would not share a room with her enemy|animosity is strong hostility; camaraderie is friendly trust|animosity 是敌意；camaraderie 是同伴情谊|camaraderie is friendly trust between companions, the opposite of glaring rivals|camaraderie 是伙伴间的友情信任，和怒目相对的对手正相反|rapport is a close, friendly understanding, the opposite of bitter quarrels and insults|rapport 是融洽的关系，和激烈的争吵辱骂正相反|an · i · mos · i · ty|anim- plus -osity|anim- 加 -osity
      apathy|voters who do not care enough even to vote|a student who no longer cared about anything|comfortable people who did not care about the poor|apathy is not caring at all; animosity is strong hostility|apathy 毫不在乎；animosity 强烈敌意|animosity means strong hostility, a fierce feeling, not a lack of caring|animosity 指强烈的敌意，是激烈的情绪，不是缺乏关心|levity means light humor, not a lack of interest or concern|levity 指轻松幽默，不是缺乏兴趣或关心|ap · a · thy|a- meaning without plus -pathy, feeling|表示没有的 a- 加表示感情的 -pathy
      abhor|cruelty to animals that fills a person with disgust|a gentle woman turning away in horror from every fight|lies and liars regarded with deep disgust|abhor hates with disgust; venerate respects deeply|abhor 憎恶；venerate 崇敬|venerate means to respect deeply, the opposite of regarding with disgust|venerate 指深深敬重，和厌恶正相反|condone means to accept or allow wrong behavior, the opposite of turning away from it in horror|condone 指宽容错误行为，和惊恐地避开正相反|ab · hor|ab- plus hor, with a silent h|ab- 加 hor，h 不发音
      levity|a silly joke that made everyone laugh and eased tension|joking and giggling during prayers at a funeral|children laughing through a serious lesson|levity is light humor; chagrin is annoyance at failing|levity 轻松幽默；chagrin 懊恼|chagrin means annoyance at one's own failure, not jokes and laughter|chagrin 指因失败而懊恼，不是玩笑和欢笑|apathy means not caring at all, not laughing and joking|apathy 指毫不在乎，不是嬉笑玩闹|lev · i · ty|lev- as in elevate, light, plus -ity|lev- 同 elevate，表示轻，加 -ity
      pensive|a woman at a window thinking deeply about her future|a man silent and lost in serious thought|a girl with her chin in her hand deep in thought|pensive is deep in quiet thought; boisterous is loud and lively|pensive 沉思；boisterous 喧闹|querulous means whining and complaining, not quietly thinking|querulous 指抱怨发牢骚，不是安静地思考|boisterous means noisy and energetic, the opposite of sitting quietly in thought|boisterous 指喧闹活跃，和静坐沉思正相反|pen · sive|the -sive ending, as in expensive|结尾是 -sive，同 expensive
      querulous|an old man grumbling about the food at every meal|a thin voice whining that the room was too cold|a child whining for more sweets|querulous whines and complains; indifferent does not care|querulous 爱抱怨；indifferent 漠不关心|pensive means deep in quiet thought, not grumbling and whining|pensive 指静静沉思，不是嘟囔抱怨|indifferent means not caring, while a complainer cares a great deal|indifferent 指不在乎，而爱抱怨的人非常在乎|quer · u · lous|qu at the start and the -ulous ending|开头是 qu，结尾是 -ulous
      indifferent|a woman not caring whether he stayed or went|a man wearing whatever is clean without interest or complaint|a crowd drifting away from a speech with no interest|indifferent does not care; fervent cares passionately|indifferent 漠不关心；fervent 满怀热情|fervent means passionately intense, the opposite of showing no interest|fervent 指热烈强烈，和毫无兴趣正相反|querulous means complaining, not quietly uninterested without complaint|querulous 指爱抱怨，不是毫无怨言地漠然|in · dif · fer · ent|in- plus different, with the double f|in- 加 different，双写 f
      exasperate|lateness irritating a woman more each day|delays irritating travelers more each hour|loud music driving neighbors to bang on the wall|exasperate irritates someone; allay calms someone|exasperate 激怒；allay 平息|allay means to calm fears or anger, the opposite of irritating someone more and more|allay 指平息恐惧或怒气，和越来越激怒人正相反|abhor means to hate something oneself, not to irritate other people|abhor 指自己憎恶，不是激怒别人|ex · as · per · ate|ex- plus asper- plus -ate|ex- 加 asper- 再加 -ate
    `,
  },
);

const doubt = batch(
  "words-of-doubt-and-belief",
  ["Words of Doubt and Belief", "怀疑与相信的词"],
  ["what is uncertain, what is false and who believes it", "不确定的、虚假的与谁相信"],
  `
  dubious|hesitating or doubting; not to be relied on|怀疑的；可疑的|I was ___ about the plan, doubting very much that it would ever work.|His reputation is ___, and after so many broken promises few people rely on him.|The claim is ___; the facts behind it are shaky, and no careful reader would trust it.|credulous,infallible|dubiously
  equivocal|open to more than one interpretation; ambiguous|模棱两可的|Her answer was ___, open to two readings, so no one knew whether she meant yes or no.|The evidence is ___: it could point to his guilt or to his innocence.|His reply was ___ on purpose, worded so it could mean either thing and keep him out of trouble.|overt,credulous|
  illusory|based on illusion; not real|虚幻的|The gains proved ___; they were never real and vanished the next day.|Their feeling of safety was ___, a comforting idea with nothing real behind it.|The calm was ___, only seeming peaceful while a storm was already raging underneath.|palpable,elusive|
  elusive|difficult to find, catch or achieve|难以捉摸的，难找到的|Success remained ___; she came close many times but never quite caught it.|The fox was quick and ___, slipping away from the hounds every time they nearly had it.|The answer is ___: it surely exists, but no one has yet managed to find it.|oblivious,illusory|elusively
  infallible|incapable of making mistakes or being wrong|永无过失的，绝对可靠的|No doctor is ___, never making a single mistake; all of them get things wrong sometimes.|His followers believed the leader was ___, certain that he could never be wrong about anything.|There is no ___ test; even the best one sometimes gives the wrong result.|dubious,credulous|infallibility
  credulous|too ready to believe things|轻信的|The ___ tourists believed the seller at once and bought his fake gold.|Only a ___ reader, ready to believe anything in print, would accept that story.|He was ___ and easily fooled, trusting every rumor he heard.|cognizant,dubious|credulity
  cognizant|having knowledge or awareness|认识到的，知晓的|We are fully ___ of the risks, having studied each one in detail.|She was ___ of his feelings, knowing exactly how hurt he was.|Every driver should be ___ of the rules, aware of what the law requires.|oblivious,credulous|cognizance
  oblivious|not aware of what is happening around one|未察觉的，不注意的|Absorbed in his phone, he was ___ to the danger and stepped into the road.|She seemed ___ of the noise, reading calmly as if she could not hear a thing.|They walked on, ___ of the rain, never noticing they were soaked.|cognizant,elusive|obliviously
  construe|to interpret a word or action in a particular way|理解，解释|Some may ___ his silence as consent, reading it as a sign that he agrees.|Don't ___ my words as a threat; I meant them only as a warning between friends.|Readers ___ the poem in many ways, each finding a different meaning in its lines.|elicit,presuppose|construed
  conundrum|a confusing and difficult problem or question|难题，谜语|Where to seat everyone at the wedding was a ___, a puzzling problem with no easy answer.|Whether to tell her the truth was a moral ___, a hard question with no clear right answer.|The riddle was a real ___, so confusing that no one could solve it.|panacea,platitude|conundrums
  `,
  "context-clues",
  {
    intro: t(
      "The **credulous** reader believed every word, the **dubious** one doubted them all, and the careful one was **cognizant** that the writer's **equivocal** answers could be **construed** in two ways. These ten words help you describe doubt, belief, awareness and things that are hard to pin down.",
      "轻信的（**credulous**）读者每个字都信，怀疑的（**dubious**）读者一概不信，而细心的读者则意识到（**cognizant**）作者模棱两可的（**equivocal**）回答可以被理解（**construed**）成两种意思。这十个词帮你描写怀疑、相信、知晓以及难以捉摸的事物。",
    ),
    watchOut: {
      meanings: t(
        "**Illusory** means *not real* at all; **elusive** means real but *hard to catch* or find. **Equivocal** means open to two readings, while **dubious** means doubtful or not to be trusted.",
        "**illusory** 指根本*不真实*；**elusive** 指真实存在却*难以抓住*或找到。**equivocal** 指可作两种解读，**dubious** 则指可疑、靠不住。",
      ),
      use: t(
        "**Cognizant** takes *of* and means aware; **oblivious** takes *of* or *to* and means unaware: *cognizant of the risks*, *oblivious to the danger*. **Credulous** describes a *person* too ready to believe.",
        "**cognizant** 后接 of，意为意识到；**oblivious** 后接 of 或 to，意为没察觉：cognizant of the risks，oblivious to the danger。**credulous** 形容太容易相信别人的*人*。",
      ),
      spelling: t(
        "Watch the *-quiv-* of **equivocal**, the double *l* of **infallible** and its *-ible* ending, the *g* of **cognizant**, and the *-drum* of **conundrum**.",
        "注意 **equivocal** 中间的 -quiv-、**infallible** 的双写 l 和结尾 -ible、**cognizant** 里的 g，以及 **conundrum** 结尾的 -drum。",
      ),
    },
    notes: `
      dubious|a plan that someone doubted would ever work|a reputation few rely on after broken promises|a claim with shaky facts that no careful reader would trust|dubious is doubtful and unreliable; credulous believes too easily|dubious 可疑、怀疑；credulous 轻信|credulous means too ready to believe, the opposite of doubting a plan or a claim|credulous 指太容易相信，和怀疑计划或说法正相反|infallible means never wrong, the opposite of shaky and unreliable|infallible 指永不出错，和靠不住正相反|du · bi · ous|du- plus -bious, with i before -ous|du- 加 -bious，-ous 前有 i
      equivocal|an answer open to two readings, yes or no|evidence that could point to guilt or innocence|a reply worded on purpose to mean either thing|equivocal can mean two things; overt is plain and open|equivocal 模棱两可；overt 公开明白|overt means plain and done openly, the opposite of open to two readings|overt 指公开明白，和可作两种解读正相反|credulous means too ready to believe, which describes a believer, not an answer or evidence|credulous 指轻信，形容相信的人，不形容回答或证据|e · quiv · o · cal|equi- plus voc- plus -al|equi- 加 voc- 再加 -al
      illusory|gains that were never real and vanished the next day|a feeling of safety with nothing real behind it|a calm that only seemed peaceful above a raging storm|illusory is not real; elusive is real but hard to catch|illusory 不真实；elusive 真实但难以抓住|palpable means so real it can almost be touched, the opposite of never real|palpable 指真切可感，和从来不真实正相反|elusive means real but hard to catch, not something that was never real at all|elusive 指真实却难以抓住，不是根本不真实|il · lu · so · ry|the double l and the -sory ending|双写 l，结尾是 -sory
      elusive|success she came close to many times but never caught|a quick fox slipping away from hounds|an answer that exists but no one has found|elusive is hard to catch; illusory is not real|elusive 难以捉摸；illusory 虚幻|oblivious means unaware, which describes a person, not success, a fox or an answer|oblivious 指没察觉，形容人，不形容成功、狐狸或答案|illusory means not real, while these things surely exist|illusory 指不真实，而这些东西确实存在|e · lu · sive|e- plus lu- plus -sive|e- 加 lu- 再加 -sive
      infallible|doctors who all get things wrong sometimes|a leader his followers thought could never be wrong|a test that sometimes gives the wrong result|infallible is never wrong; dubious is doubtful|infallible 永不出错；dubious 可疑|dubious means doubtful and unreliable, the opposite of never making a mistake|dubious 指可疑靠不住，和从不出错正相反|credulous means too ready to believe, not incapable of being wrong|credulous 指轻信，不是不会出错|in · fal · li · ble|the double l and the -ible ending|双写 l，结尾是 -ible
      credulous|tourists who believed a seller and bought fake gold|a reader ready to believe anything in print|a man easily fooled who trusted every rumor|credulous believes too easily; dubious doubts|credulous 轻信；dubious 怀疑|cognizant means aware and well informed, not easily fooled by fake gold and rumors|cognizant 指心中有数，不是被假金子和谣言轻易骗倒|dubious means doubting, the opposite of believing at once|dubious 指心存怀疑，和立刻相信正相反|cred · u · lous|cred- as in credit, plus -ulous|cred- 同 credit，加 -ulous
      cognizant|risks studied in detail|knowing exactly how hurt someone was|drivers aware of what the law requires|cognizant is aware; oblivious is unaware|cognizant 意识到；oblivious 没察觉|oblivious means unaware, the opposite of knowing the risks in detail|oblivious 指浑然不觉，和详细了解风险正相反|credulous means too ready to believe, not well informed and aware|credulous 指轻信，不是清楚了解|cog · ni · zant|the g before n and the -zant ending|n 前有 g，结尾是 -zant
      oblivious|a man absorbed in his phone stepping into the road|a woman reading as if she could not hear the noise|walkers never noticing they were soaked|oblivious is unaware; cognizant is aware|oblivious 没察觉；cognizant 意识到|cognizant means aware, the opposite of never noticing danger, noise or rain|cognizant 指意识到，和对危险、噪音、雨水毫无察觉正相反|elusive means hard to catch, which describes the thing sought, not an unaware person|elusive 指难以抓住，形容被追寻之物，不形容没察觉的人|ob · liv · i · ous|ob- plus liv- plus -ious|ob- 加 liv- 再加 -ious
      construe|reading silence as a sign of agreement|taking words as a threat instead of a warning|finding different meanings in a poem's lines|construe interprets a meaning; elicit draws out a response|construe 解读；elicit 引出|elicit means to draw out a response from someone, not to read silence or words a certain way|elicit 指引出反应，不是把沉默或话语理解成某种意思|presuppose means to assume something beforehand, not to read a meaning into words|presuppose 指预先假定，不是解读话语的含义|con · strue|con- plus strue, as in construct|con- 加 strue，与 construct 同源
      conundrum|a puzzling problem of where to seat wedding guests|a hard moral question with no clear right answer|a riddle so confusing no one could solve it|a conundrum is a puzzling problem; a panacea is a cure for everything|conundrum 是难题；panacea 是万灵药|panacea is a remedy for all troubles, the opposite of a problem with no easy answer|panacea 是万能的解决办法，和没有简单答案的难题正相反|platitude is a dull, overused remark, not a puzzle that no one can solve|platitude 是陈词滥调，不是无人能解的难题|co · nun · drum|co- plus nun plus drum|co- 加 nun 再加 drum
    `,
  },
);

const excellence = batch(
  "words-of-excellence-and-awe",
  ["Words of Excellence and Awe", "卓越与敬畏的词"],
  ["the best of things and the honor they win", "事物的最佳状态及所获敬仰"],
  `
  epitome|a perfect example of a quality or type|典范，缩影|Even in a crisis she stays still and quiet; she is the ___ of calm, its perfect example.|With gold taps and silk sheets, the hotel is the ___ of luxury, luxury in its most perfect form.|Polite, kind and well dressed, he was the ___ of a gentleman, the very model of the type.|charisma,adulation|epitomize
  paragon|a model of excellence or of a particular quality|模范，典范|In her village she was the ___ of virtue, a model of goodness whom everyone tried to copy.|He is no ___ of patience; he loses his temper over the smallest delay.|The school holds him up as its ___, a model student for every newcomer to follow.|pariah,opportunist|paragons
  exemplary|serving as a desirable model; very good|模范的，典范的|Her behavior was ___, a model of good conduct for every student in the school.|His record was ___: twenty years of service without a single complaint.|The firefighters received medals for their ___ courage, an example for everyone.|profound,callous|
  impeccable|in accordance with the highest standards; faultless|无可挑剔的|She has ___ manners, never making a single error of politeness.|His timing was ___, faultless to the very second.|The house was kept in ___ order, without a speck of dust or a thing out of place.|abrasive,inept|impeccably
  pristine|in its original condition; perfectly clean|原始的；崭新的|The old car is in ___ condition, as clean and perfect as the day it was made.|They walked on ___ beaches of untouched white sand, washed fresh by every wave.|The ___ forest, full of life and growth, had never been touched by an axe.|squalid,stagnant|
  profound|very great or intense; showing deep insight|深远的；深刻的|The effect of the war on him was ___, changing him deeply for the rest of his life.|Her remark was ___, showing deep insight into human nature.|The silence after the news was ___, so deep that no one dared to breathe.|inconsequential,superficial|profoundly,profundity
  ineffable|too great or extreme to be expressed in words|难以言喻的|The joy they felt at their son's return was ___, too great for any words to express.|The view from the mountain had a beauty that was ___; no description could do it justice.|The poem tries to speak of ___ things, feelings so deep that language fails them.|mundane,prosaic|
  venerate|to regard with great respect|崇敬，敬重|The villagers ___ their ancestors, honoring them with deep respect at every festival.|Many still ___ the old poet, treating his name with great reverence a century after his death.|Pilgrims come to ___ the saint at this shrine, bowing in deep respect.|abhor,denounce|venerated,veneration
  adulation|excessive admiration or praise|奉承，过度赞扬|The singer basked in the ___ of her fans, their endless, almost excessive praise.|After years of screaming crowds, he grew tired of the ___ and longed for an ordinary life.|The hero's ___ lasted a week: parades, cheers and praise far beyond what he deserved.|animosity,apathy|
  charisma|compelling attractiveness or charm that inspires devotion|魅力，号召力|The leader had great ___, a magnetic charm that made people eager to follow him.|Her ___, warm and compelling, won the voters' hearts the moment she spoke.|He lacked ___ on stage; for all his skill, he could not hold the audience.|adulation,epitome|charismatic
  `,
  "context-clues",
  {
    intro: t(
      "The singer's **charisma** drew huge crowds; fans showered her with **adulation**, critics called her voice **impeccable**, and many came to **venerate** her as the **epitome** of grace. These ten words help you describe excellence, perfection and the honor it wins.",
      "那位歌手的魅力（**charisma**）吸引了大批观众；歌迷对她百般吹捧（**adulation**），评论家称她的嗓音无可挑剔（**impeccable**），许多人把她当作优雅的典范（**epitome**）来崇敬（**venerate**）。这十个词帮你描写卓越、完美以及由此赢得的敬仰。",
    ),
    watchOut: {
      meanings: t(
        "**Epitome** and **paragon** are both perfect examples, but **adulation** is *excessive* praise given by others, and **charisma** is a *charm* that draws them; **venerate** is deep respect, often for the old or holy.",
        "**epitome** 和 **paragon** 都是完美的范例，而 **adulation** 是别人*过度*的吹捧，**charisma** 是吸引人的*魅力*；**venerate** 是深深的敬重，常用于先人或圣贤。",
      ),
      use: t(
        "**Pristine** means untouched or perfectly *clean*; **impeccable** means *faultless* in standard, as in manners or timing; **ineffable** means too great for *words*, and **profound** means very *deep*.",
        "**pristine** 指未经触碰或*一尘不染*；**impeccable** 指在标准上*无可挑剔*，如礼仪或时机；**ineffable** 指*言语*无法表达，**profound** 指非常*深*。",
      ),
      spelling: t(
        "Watch the final *e* of **epitome**, said as a separate syllable, the double *c* of **impeccable**, the double *f* of **ineffable**, and the *ch* of **charisma**, said like *k*.",
        "注意 **epitome** 结尾的 e 要单独发音、**impeccable** 的双写 c、**ineffable** 的双写 f，以及 **charisma** 里读作 k 的 ch。",
      ),
    },
    notes: `
      epitome|a woman who stays still and quiet in a crisis|a hotel with gold taps and silk sheets|a polite, kind, well-dressed man|an epitome is a perfect example; charisma is a charm that draws people|epitome 是完美典范；charisma 是吸引人的魅力|charisma is a charm that draws followers, not a perfect example of a quality|charisma 是吸引追随者的魅力，不是某种品质的完美范例|adulation is excessive praise from others, not a perfect example of calm or luxury|adulation 是别人的过度吹捧，不是镇定或奢华的完美范例|e · pit · o · me|the final e said as its own syllable|结尾的 e 单独成一个音节
      paragon|a model of goodness everyone tried to copy|a man who loses his temper over the smallest delay|a model student for every newcomer to follow|a paragon is a model of excellence; a pariah is shunned by all|paragon 是模范；pariah 是被排斥的人|pariah is someone everyone avoids, the opposite of a model everyone copies|pariah 是人人回避的人，和人人效仿的模范正相反|opportunist is someone who seizes chances without principles, not a model of virtue or patience|opportunist 是不讲原则、见机行事的人，不是美德或耐心的楷模|par · a · gon|par- plus a plus -gon|par- 加 a 再加 -gon
      exemplary|conduct that is a model for every student|twenty years of service without a complaint|courage that earned firefighters medals|exemplary is a model to copy; callous is cruel|exemplary 堪称模范；callous 冷酷|profound means very deep, not a good model of conduct to copy|profound 指深刻，不是值得效仿的好榜样|callous means cruel and unfeeling, the opposite of conduct that wins praise and medals|callous 指冷酷无情，和赢得赞誉与奖章的行为正相反|ex · em · pla · ry|the -plary ending, from example|结尾是 -plary，来自 example
      impeccable|manners without a single error of politeness|timing faultless to the second|a house without a speck of dust|impeccable is faultless; inept is clumsy|impeccable 无可挑剔；inept 笨拙|abrasive means rough and harsh, the opposite of faultless manners|abrasive 指粗鲁生硬，和无可挑剔的礼仪正相反|inept means clumsy and unskilled, the opposite of faultless timing and order|inept 指笨拙，和分秒不差、井井有条正相反|im · pec · ca · ble|the double c and the -able ending|双写 c，结尾是 -able
      pristine|a car as clean as the day it was made|beaches of untouched white sand|a forest full of life never touched by an axe|pristine is clean and untouched; squalid is filthy|pristine 原始洁净；squalid 肮脏|squalid means filthy and unpleasant, the opposite of clean, untouched and fresh|squalid 指肮脏，和洁净如新、未经触碰正相反|stagnant means not flowing or growing, not fresh beaches or a forest full of life|stagnant 指停滞不动，不是清新的海滩或生机勃勃的森林|pris · tine|the -tine ending, said like teen|结尾是 -tine，读作 teen
      profound|a war that changed a man deeply for life|a remark showing deep insight into human nature|a silence so deep no one dared to breathe|profound is very deep; superficial is shallow|profound 深刻；superficial 肤浅|inconsequential means unimportant, the opposite of changing someone for life|inconsequential 指无关紧要，和改变一生正相反|superficial means shallow, the opposite of deep insight and deep silence|superficial 指肤浅，和深刻的洞见与深沉的寂静正相反|pro · found|pro- plus found|pro- 加 found
      ineffable|joy too great for any words to express|beauty no description could do justice|feelings so deep that language fails them|ineffable is beyond words; mundane is ordinary|ineffable 难以言喻；mundane 平凡|mundane means ordinary and everyday, not too great for words|mundane 指平凡日常，不是言语无法表达|prosaic means plain and ordinary, the opposite of beauty beyond description|prosaic 指平淡无奇，和难以描述的美正相反|in · ef · fa · ble|the double f and the -able ending|双写 f，结尾是 -able
      venerate|villagers honoring ancestors with deep respect|a poet's name treated with reverence a century later|pilgrims bowing in respect at a shrine|venerate respects deeply; abhor hates|venerate 崇敬；abhor 憎恶|abhor means to hate with disgust, the opposite of honoring with deep respect|abhor 指憎恶，和深深敬重正相反|denounce means to declare publicly as evil, the opposite of bowing in respect|denounce 指公开谴责，和鞠躬致敬正相反|ven · er · ate|ven- plus er plus -ate|ven- 加 er 再加 -ate
      adulation|fans' endless, almost excessive praise|years of screaming crowds a man grew tired of|parades and cheers far beyond what a hero deserved|adulation is excessive praise; animosity is hostility|adulation 是过度吹捧；animosity 是敌意|animosity means strong hostility, the opposite of endless praise and cheers|animosity 指强烈的敌意，和不断的赞美与欢呼正相反|apathy means lack of interest, the opposite of screaming crowds and parades|apathy 指冷漠，和尖叫的人群与游行正相反|ad · u · la · tion|ad- plus u plus -lation|ad- 加 u 再加 -lation
      charisma|a magnetic charm that made people eager to follow|warm, compelling charm that won voters' hearts|the power to hold an audience that a skilled man lacked|charisma is charm that draws people; adulation is the praise they give|charisma 是吸引人的魅力；adulation 是人们给的吹捧|adulation is excessive praise from others, not a charm a leader himself has|adulation 是别人的过度吹捧，不是领袖自身的魅力|epitome is a perfect example of a type, not a charm that wins hearts|epitome 是某类事物的完美范例，不是赢得人心的魅力|cha · ris · ma|the ch said like k|ch 读作 k
    `,
  },
);

const hardship = batch(
  "words-of-harshness-and-hardship",
  ["Words of Harshness and Hardship", "严厉与艰苦的词"],
  ["strict rules, heavy burdens and misery", "严格的规定、沉重的负担与苦难"],
  `
  stringent|strict, precise and exacting|严格的|To protect the workers, the safety rules are ___, and inspectors check every machine strictly each day.|Pilots face ___ tests, exacting checks that allow not a single error.|The bank set ___ conditions for the loan, demanding exact proof of every payment the family had made.|lax,callous|stringently
  onerous|involving heavy effort and difficulty; burdensome|繁重的|Caring for her sick father was ___, a heavy burden of work that went on for years.|The task fell to her, and it was ___: months of hard, exhausting labor that mattered greatly to the town.|The new rules on paperwork were ___, adding hours of heavy, tiring work to every week, year after year.|transient,inconsequential|
  grievous|very severe or serious|严重的，极严重的|He suffered ___ injuries in the crash, so serious that he nearly died.|The general's mistake was ___, a terrible error that cost thousands of lives.|The blow of her death to the family was ___, a loss so severe they never fully recovered.|inconsequential,innocuous|grievously
  abject|extremely bad or unpleasant; without pride|凄惨的；卑躬屈膝的|They live in ___ poverty, with no food, no home and no hope.|The plan was an ___ failure, total and humiliating from start to finish.|He made an ___ apology, begging on his knees without a shred of pride.|opulent,impeccable|abjectly
  squalid|extremely dirty and unpleasant; morally degraded|肮脏的；卑劣的|The hut they lived in was ___, filthy and full of rubbish.|The prison was ___, its cells dirty, damp and crawling with rats.|The kitchen was ___, with rotting food and grease on every wall.|pristine,opulent|squalor
  acrid|unpleasantly bitter or sharp to the smell or taste|辛辣的，刺鼻的|Thick, ___ smoke filled the room, stinging our noses and throats.|The ___ smell of burning rubber, sharp and bitter, made us cough.|The medicine left an ___ taste in her mouth, so bitter that she gagged.|abrasive,innocuous|
  abrasive|rough and able to wear away; harsh in manner|粗糙的，有研磨作用的；粗鲁的|To scrub the burnt pan, use a rough, ___ cloth that can wear away the dirt.|The ___ paste scratched the glass, wearing away its smooth surface.|Sandpaper is ___, its rough grains wearing down the wood.|acrid,innocuous|abrasively
  callous|showing a cruel disregard for others|冷酷无情的|Quietly and politely, the ___ landlord put the sick family out into the snow without a moment's pity.|The act was ___, done with no thought at all for the suffering of the victims.|His remark about the dead, cruel and utterly without feeling, was ___ and shocked us all.|abrasive,stringent|callously,callousness
  debilitate|to make someone very weak and infirm|使衰弱|The long illness began to ___ him, leaving him too weak to walk.|Months of strikes can ___ an economy, leaving its factories weak and idle.|Extreme heat can ___ older people, sapping their strength until they cannot stand.|bolster,exasperate|debilitated,debilitating
  enervate|to drain of energy or vitality|使衰弱，使无力|The heat began to ___ the runners, draining their energy until they could barely jog.|Long, dull meetings ___ me, leaving me drained and sleepy by noon.|Weeks of illness can ___ the body, leaving it limp and without energy.|galvanize,bolster|enervated,enervating
  `,
  "context-clues",
  {
    intro: t(
      "The workers lived in **squalid** huts, breathed **acrid** smoke all day, obeyed **stringent** rules, and did **onerous** work that began to **debilitate** even the strongest. These ten words help you describe strict rules, heavy burdens, harsh conditions and the weakness they bring.",
      "工人们住在肮脏的（**squalid**）棚屋里，整天呼吸刺鼻的（**acrid**）烟雾，遵守严格的（**stringent**）规定，干着繁重的（**onerous**）活儿，连最强壮的人也开始变得虚弱（**debilitate**）。这十个词帮你描写严格的规定、沉重的负担、恶劣的条件以及由此带来的虚弱。",
    ),
    watchOut: {
      meanings: t(
        "**Stringent** describes strict *rules*, not cruel people; **callous** describes a *person* or act with no feeling for others; **abrasive** describes something *rough* that wears things away.",
        "**stringent** 形容严格的*规定*，不形容残忍的人；**callous** 形容对他人毫无同情的*人*或行为；**abrasive** 形容能磨损东西的*粗糙*之物。",
      ),
      use: t(
        "**Enervate** does not mean to give energy; it means to *drain* it, like **debilitate**. **Squalid** is about *dirt*, **abject** about extreme misery or a total lack of pride.",
        "**enervate** 不是使人充满活力，而是*耗尽*活力，和 **debilitate** 一样。**squalid** 说的是*肮脏*，**abject** 说的是极度凄惨或毫无尊严。",
      ),
      spelling: t(
        "Watch the *-gent* of **stringent**, the *-ous* of **onerous** and **grievous** (not *grievious*), the double *l* of **callous**, and the *-ate* of **enervate**.",
        "注意 **stringent** 的 -gent、**onerous** 和 **grievous** 的 -ous（不是 grievious）、**callous** 的双写 l，以及 **enervate** 的 -ate。",
      ),
    },
    notes: `
      stringent|safety rules checked strictly every day to protect workers|exacting pilot tests that allow no error|loan conditions demanding exact proof of every payment|stringent is strict and exacting; lax is not strict enough|stringent 严格；lax 松懈|lax means not strict enough, the opposite of daily strict checks|lax 指不够严格，和每天严格检查正相反|callous means cruel and unfeeling, not strict rules made to protect workers|callous 指冷酷无情，不是为保护工人而定的严格规定|strin · gent|the -gent ending, with g|结尾是 -gent，用 g
      onerous|caring for a sick father for years|months of exhausting labor that mattered to a town|paperwork rules adding hours of tiring work every week|onerous is a heavy burden; transient lasts only a short time|onerous 繁重；transient 短暂|transient means lasting only a short time, not work that went on for years|transient 指短暂，不是持续多年的工作|inconsequential means unimportant, not heavy work that mattered greatly|inconsequential 指无关紧要，不是意义重大的繁重劳动|on · er · ous|on- plus er plus -ous|on- 加 er 再加 -ous
      grievous|crash injuries so serious a man nearly died|a general's error that cost thousands of lives|a loss so severe a family never recovered|grievous is very severe; innocuous is harmless|grievous 极严重；innocuous 无害|inconsequential means unimportant, the opposite of a mistake costing thousands of lives|inconsequential 指无关紧要，和造成成千上万人死亡的错误正相反|innocuous means harmless, the opposite of injuries that nearly killed a man|innocuous 指无害，和几乎致命的伤正相反|griev · ous|griev- plus -ous, with no i before -ous|griev- 加 -ous，-ous 前没有 i
      abject|poverty with no food, no home and no hope|a total and humiliating failure|an apology made on the knees without pride|abject is extremely miserable; opulent is richly luxurious|abject 极其凄惨；opulent 富丽奢华|opulent means rich and luxurious, the opposite of having no food and no home|opulent 指富丽奢华，和缺衣少食、无家可归正相反|impeccable means faultless, the opposite of a humiliating failure|impeccable 指无可挑剔，和丢脸的失败正相反|ab · ject|ab- plus ject, as in reject|ab- 加 ject，同 reject
      squalid|a filthy hut full of rubbish|prison cells dirty, damp and crawling with rats|a kitchen with rotting food and grease on every wall|squalid is filthy; pristine is perfectly clean|squalid 肮脏；pristine 洁净|pristine means perfectly clean and untouched, the opposite of filthy and full of rubbish|pristine 指洁净如新，和肮脏、满是垃圾正相反|opulent means richly luxurious, not dirty and crawling with rats|opulent 指富丽奢华，不是脏乱、老鼠横行|squal · id|squ- plus al plus -id|squ- 加 al 再加 -id
      acrid|thick smoke stinging noses and throats|a sharp, bitter smell of burning rubber|a medicine taste so bitter she gagged|acrid is sharp and bitter to smell or taste; abrasive is rough to the touch|acrid 刺鼻辛辣；abrasive 粗糙|abrasive means rough enough to wear things away, not sharp and bitter to smell or taste|abrasive 指粗糙能磨损，不是闻起来或尝起来辛辣|innocuous means harmless, not smoke that stings or a taste that makes one gag|innocuous 指无害，不是刺痛喉咙的烟或令人作呕的味道|ac · rid|a single c and the -rid ending|只有一个 c，结尾是 -rid
      abrasive|a rough cloth that wears away the dirt on a burnt pan|a paste that scratched the smooth glass|sandpaper whose rough grains wear down wood|abrasive is rough and wears things away; acrid is bitter to smell|abrasive 粗糙能磨损；acrid 刺鼻|acrid means sharp and bitter to smell or taste, not rough enough to scrape|acrid 指刺鼻辛辣，不是粗糙到能刮擦|innocuous means harmless, not something that scratches glass and wears down wood|innocuous 指无害，不是能划伤玻璃、磨损木头的东西|a · bra · sive|a- plus bra- plus -sive|a- 加 bra- 再加 -sive
      callous|a polite landlord putting a sick family into the snow without pity|an act done with no thought for victims' suffering|a cruel remark about the dead|callous is cruel without feeling; abrasive is rough in manner|callous 冷酷无情；abrasive 粗鲁|abrasive means harsh and rough in manner, not a quiet, polite act of cruelty|abrasive 指态度粗鲁，不是安静有礼却冷酷的行为|stringent means strict about rules, not cruel and without feeling|stringent 指规定严格，不是冷酷无情|cal · lous|the double l and the -ous ending|双写 l，结尾是 -ous
      debilitate|an illness leaving a man too weak to walk|strikes leaving factories weak and idle|heat sapping older people's strength|debilitate makes weak; bolster makes stronger|debilitate 使衰弱；bolster 使增强|bolster means to support and strengthen, the opposite of leaving someone too weak to walk|bolster 指支持加强，和使人虚弱得走不动正相反|exasperate means to irritate, not to make weak and infirm|exasperate 指激怒，不是使人虚弱|de · bil · i · tate|de- plus bili- plus -tate|de- 加 bili- 再加 -tate
      enervate|heat draining runners until they could barely jog|dull meetings leaving a person drained and sleepy|illness leaving a body limp and without energy|enervate drains energy; galvanize fills with energy|enervate 使无力；galvanize 激发|galvanize means to shock into energetic action, the opposite of draining energy|galvanize 指激励行动，和耗尽精力正相反|bolster means to support and strengthen, the opposite of leaving a body limp|bolster 指支持加强，和使身体无力正相反|en · er · vate|en- plus er plus -vate, not energize|en- 加 er 再加 -vate，不是 energize
    `,
  },
);

const society = batch(
  "words-of-ranks-and-types",
  ["Words of Ranks and Types", "等级与类型的词"],
  ["order in society and the kinds of people in it", "社会秩序与其中的各类人"],
  `
  hierarchy|a system in which members are ranked one above another|等级制度|He rose quickly through the company's ___, from clerk to manager to director in five years.|The church has a strict ___, with priests below bishops and bishops below the pope.|In the wolf pack's ___, each animal knows exactly which others rank above it.|dichotomy,milieu|hierarchical,hierarchies
  subordinate|lower in rank or position; a person under another's authority|下级的；下属|The manager praised her ___, the junior clerk who worked under her, for his careful report.|No officer may give an order to someone above him, only to a ___ of lower rank.|A good manager listens to every ___ on her team, even the newest worker under her.|hierarchy,magnate|subordinates
  indigenous|originating or living naturally in a place|本土的，土著的|The kangaroo is ___ to Australia, living there naturally long before anyone brought animals from abroad.|The island's ___ peoples have lived here for thousands of years, long before any settlers arrived.|They planted only ___ trees, kinds that have always grown wild in this valley.|transient,cosmopolitan|
  conventional|based on what is generally done or believed|传统的，常规的|Her dark suit for the interview was ___, just what everyone usually wears.|His advice on money is ___: like most people, he says it is wise to save.|Their wedding was ___, with the usual church, white dress and cake that most couples have.|unprecedented,eclectic|conventionally
  iconoclast|a person who attacks cherished beliefs|打破传统观念的人|As the ___ of the group, he mocked every cherished tradition and called the old beliefs foolish.|The young painter became the art world's leading ___, attacking the ideas its masters held sacred.|Every age needs its ___, someone brave enough to challenge what everyone holds dear.|traditionalist,hedonist|iconoclastic
  hedonist|a person who believes pleasure is the most important thing in life|享乐主义者|The ___ spent all his money on parties, feasts and fine wine, living only for pleasure.|In Paris she lived the life of the true ___, seeking delight in every meal, dance and luxury.|A true ___ believes nothing matters more than enjoying life.|opportunist,iconoclast|hedonism,hedonistic
  opportunist|a person who takes advantage of chances, often without regard for principles|机会主义者|The ___ changed parties twice to win, caring nothing for what either one stood for.|Like any political ___, he will say whatever wins votes, whatever his principles.|Clever and without scruples, he was the kind of ___ who profits from every crisis.|hedonist,traditionalist|opportunistic,opportunism
  pedantic|too concerned with minor details or rules|学究式的，迂腐的|The ___ teacher marked every misplaced comma and corrected tiny rules no other teacher bothered with.|Don't be ___ about grammar; nobody minds a small slip in a friendly note.|His speech was ___ and dull, full of footnotes and fussy points about minor details.|nonchalant,lax|pedant,pedantry
  traditionalist|a person who keeps to old customs and beliefs|传统主义者|Grandfather, the family's strictest ___, refused to use a computer and still writes letters by hand.|At weddings she is the family's ___, insisting on the old customs her grandmother followed.|Every ___ in the village hated the new design, which broke with centuries of custom.|elitist,opportunist|traditionalists
  elitist|a person who believes a small group should lead or be favored; favoring such a group|精英主义者；精英主义的|Her uncle, the worst ___ in town, believed only the rich and well-born should run anything.|Every ___ in the party thought only experts, never ordinary citizens, should be allowed to vote.|To critics the headmaster was the school's chief ___, favoring the clever few over everyone else.|traditionalist,iconoclast|elitism
  `,
  "context-clues",
  {
    intro: t(
      "In the old firm's strict **hierarchy**, the **traditionalist** at the top kept every custom, the **opportunist** below him waited for a chance to rise, and a young **iconoclast** mocked them both. These ten words help you describe ranks in society and the types of people in them.",
      "在那家老公司森严的等级制度（**hierarchy**）中，高层的传统主义者（**traditionalist**）恪守每一条旧规，他下面的机会主义者（**opportunist**）等着往上爬的机会，而一个年轻的叛逆者（**iconoclast**）把他们俩都嘲笑了一番。这十个词帮你描写社会中的等级以及其中的各类人。",
    ),
    watchOut: {
      meanings: t(
        "A **traditionalist** *keeps* old customs; an **iconoclast** *attacks* them; an **elitist** thinks a small group should be *favored*; a **hedonist** lives for *pleasure*; an **opportunist** grabs every *chance*.",
        "**traditionalist** *守护*旧俗；**iconoclast** *抨击*旧俗；**elitist** 认为少数人应受*优待*；**hedonist** 为*享乐*而活；**opportunist** 抓住每个*机会*。",
      ),
      use: t(
        "**Subordinate** here means a *person* under someone else's authority, as in *praised her subordinate*. **Pedantic** describes a person fussy about *minor rules*, which is not the same as **conventional**, doing what *most people* do.",
        "这里 **subordinate** 指受他人领导的*人*，如 praised her subordinate。**pedantic** 形容对*细枝末节的规则*过分讲究的人，不同于 **conventional**，后者指照*大多数人*的做法去做。",
      ),
      spelling: t(
        "Watch the *-archy* of **hierarchy**, the *-enous* of **indigenous**, the *-clast* of **iconoclast**, and the *h* at the start of **hedonist**.",
        "注意 **hierarchy** 的 -archy、**indigenous** 的 -enous、**iconoclast** 的 -clast，以及 **hedonist** 开头的 h。",
      ),
    },
    notes: `
      hierarchy|a rise from clerk to manager to director in a company|priests below bishops and bishops below the pope|a wolf pack where each animal knows who ranks above it|a hierarchy ranks members one above another; a milieu is a social setting|hierarchy 是等级制度；milieu 是社会环境|dichotomy is a division into two opposite parts, not a ladder of many ranks|dichotomy 是一分为二的对立，不是多层级的阶梯|milieu is the social surroundings one lives in, not a system of ranks one rises through|milieu 是生活的社会环境，不是可以逐级晋升的等级体系|hi · er · ar · chy|hier- plus -archy, with ch said like k|hier- 加 -archy，ch 读作 k
      subordinate|a junior clerk who worked under a manager|someone of lower rank who can be given an order|the newest worker under a manager on her team|a subordinate works under someone; a magnate is a powerful business leader|subordinate 是下属；magnate 是商业巨头|hierarchy is a whole system of ranks, not one person working under another|hierarchy 是整个等级体系，不是在别人手下工作的某个人|magnate is a rich, powerful business leader, the opposite of a junior worker of lower rank|magnate 是有钱有势的商业巨头，和地位低的基层员工正相反|sub · or · di · nate|sub- meaning under, plus -ordinate|表示下面的 sub- 加 -ordinate
      indigenous|kangaroos living naturally in Australia before any were brought from abroad|peoples living on an island for thousands of years before settlers|trees that have always grown wild in a valley|indigenous belongs to a place by nature; cosmopolitan belongs to the whole world|indigenous 本土的；cosmopolitan 世界性的|transient means staying only a short time, the opposite of living somewhere for thousands of years|transient 指短暂停留，和生活了几千年正相反|cosmopolitan means drawn from many countries, the opposite of native to one place|cosmopolitan 指来自世界各地，和土生土长正相反|in · dig · e · nous|the -genous ending, with e before -nous|结尾是 -genous，-nous 前有 e
      conventional|a dark suit just like everyone usually wears|advice to save money that most people give|a wedding with the usual church, dress and cake|conventional does what most people do; eclectic mixes many styles|conventional 照常规；eclectic 兼收并蓄|unprecedented means never done before, the opposite of what everyone usually does|unprecedented 指前所未有，和大家通常的做法正相反|eclectic means drawn from many different styles, not the usual choice most people make|eclectic 指博采众长，不是大多数人的常规选择|con · ven · tion · al|convention plus -al|convention 加 -al
      iconoclast|a man who mocked every cherished tradition as foolish|a painter attacking ideas the masters held sacred|someone brave enough to challenge what all hold dear|an iconoclast attacks cherished beliefs; a traditionalist keeps them|iconoclast 抨击传统信念；traditionalist 守护传统|traditionalist is a person who keeps old customs, the opposite of mocking them|traditionalist 是守护旧俗的人，和嘲笑旧俗正相反|hedonist is a person who lives for pleasure, not one who attacks cherished beliefs|hedonist 是为享乐而活的人，不是抨击传统信念的人|i · con · o · clast|icono- plus -clast, meaning breaker|icono- 加表示打破的 -clast
      hedonist|a man spending all his money on parties, feasts and wine|a woman seeking delight in every meal, dance and luxury in Paris|a believer that nothing matters more than enjoying life|a hedonist lives for pleasure; an opportunist lives for advantage|hedonist 追求享乐；opportunist 追逐利益|opportunist is a person who grabs chances for gain, not one who lives for parties and pleasure|opportunist 是见机谋利的人，不是为聚会享乐而活的人|iconoclast is a person who attacks cherished beliefs, not one who seeks delight|iconoclast 是抨击传统信念的人，不是寻欢作乐的人|he · do · nist|the h at the start and the -ist ending|开头是 h，结尾是 -ist
      opportunist|a man who changed parties twice to win|a politician saying whatever wins votes|a clever man without scruples who profits from every crisis|an opportunist grabs chances without principles; a traditionalist keeps old ways|opportunist 投机取巧；traditionalist 守旧|hedonist is a person who lives for pleasure, not one who switches sides to win|hedonist 是为享乐而活的人，不是为了获胜而改换阵营的人|traditionalist is a person loyal to old customs, the opposite of switching parties for gain|traditionalist 是忠于旧俗的人，和为了利益改换党派正相反|op · por · tun · ist|opportune plus -ist, with the double p|opportune 加 -ist，双写 p
      pedantic|a teacher marking every misplaced comma|a warning not to fuss over a small slip in a friendly note|a dull speech full of fussy points about minor details|pedantic fusses over minor rules; nonchalant does not care|pedantic 迂腐挑剔；nonchalant 漫不经心|nonchalant means calm and unconcerned, the opposite of fussing over every comma|nonchalant 指漫不经心，和对每个逗号吹毛求疵正相反|lax means not strict enough, the opposite of correcting tiny rules no one else bothers with|lax 指不够严格，和纠正别人懒得管的细小规则正相反|pe · dan · tic|pedant plus -ic|pedant 加 -ic
      traditionalist|a grandfather who refuses computers and writes by hand|a woman insisting on her grandmother's wedding customs|villagers who hated a design that broke with custom|a traditionalist keeps old customs; an elitist favors a small group|traditionalist 守护旧俗；elitist 偏袒少数精英|elitist is a person who thinks a small group should be favored, not one loyal to old customs|elitist 是认为少数人应受优待的人，不是忠于旧俗的人|opportunist is a person who grabs chances without principles, not one who keeps the old ways|opportunist 是不讲原则、见机行事的人，不是恪守旧习的人|tra · di · tion · al · ist|traditional plus -ist|traditional 加 -ist
      elitist|an uncle believing only the rich and well-born should run things|party members thinking only experts should vote|a headmaster favoring the clever few|an elitist favors a small group; a traditionalist keeps old customs|elitist 偏袒精英；traditionalist 守护旧俗|traditionalist is a person who keeps old customs, not one who believes only the few should rule|traditionalist 是守护旧俗的人，不是认为只该由少数人统治的人|iconoclast is a person who attacks cherished beliefs, not one who favors the rich and clever few|iconoclast 是抨击传统信念的人，不是偏袒有钱人和聪明人的人|e · lit · ist|elite plus -ist, dropping the final e|elite 去掉结尾 e 再加 -ist
    `,
  },
);

/** batchesD are the batches of firm minds, much and little, letting go, dislike, doubt, excellence, hardship and ranks. */
export const batchesD: readonly BatchSpec[] = [stubborn, extent, keeping, dislike, doubt, excellence, hardship, society];
