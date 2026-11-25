// Grade 12: the batches of words of war and peacemaking, of talk, of joy and gloom, of memory, of courage and fear,
// of beginnings and ends, of cunning and of likeness.

import { t } from "@ga/content";
import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const war = batch(
  "words-of-battle-and-siege",
  ["Words of Battle and Siege", "战斗与围攻的词"],
  ["fighting, attacks and pauses in war", "战斗、进攻和战事的停歇"],
  `
  bellicose|eager to fight or start a war|好战的|The ___ general wanted to invade at once, eager to start a war with every neighbor.|His ___ speech, threatening to send the army across the border, alarmed the neighboring countries.|The ___ tone of the letter, full of threats of war, shocked the ambassadors.|timorous,placid|
  pugnacious|eager to argue or fight|好斗的，爱争吵的|The ___ boxer insulted his rival and tried to start a fight at the press conference.|Her style of debate is ___: she attacks every point her opponents make, eager for a fight.|The ___ little terrier barked at every dog and tried to pick a fight with each one.|affable,timorous|pugnacity
  ceasefire|an agreement to stop fighting|停火|The two sides agreed to a ___ for the holiday, stopping all fighting for three days.|The ___ lasted only a week before the guns began firing again.|Both armies broke the ___, their agreement to stop fighting, within hours.|hostilities,sortie|ceasefires
  hostilities|acts of fighting in a war|战事，交战|Along the border, ___ broke out at dawn, and the fighting spread for weeks.|Both sides agreed to end ___ and sign a peace treaty after years of fighting.|After months of ___, battle after battle in the streets, the city lay in ruins.|ceasefire,onslaught|
  skirmish|a short, small fight between small groups|小规模战斗，小冲突|A brief ___ broke out near the bridge between two small patrols, and it was over in minutes.|Outside the stadium a few fans fought in a short ___ before the police arrived.|Only three soldiers were hurt in the ___, a small clash between scouts.|foray,onslaught|skirmishes
  onslaught|a fierce or violent attack|猛攻|The fort could not survive the ___, a fierce attack by ten thousand men.|In the second half the team faced a fierce ___ of shots, wave after wave of them.|The ___ of angry emails, hundreds arriving in a fierce flood, began the moment the news broke.|skirmish,sortie|
  besiege|to surround a place with an army to force it to give up; to crowd around|围攻；包围|The army began to ___ the castle, surrounding it for months so that no food could get in until it gave up.|Fans ___ the star at the airport, crowding around her on every side.|Reporters will ___ the minister with questions, crowding around him the moment he steps outside.|ransack,maraud|besieged,besieging
  mercenary|a soldier paid to fight for a foreign army; interested only in money|雇佣兵；唯利是图的|The king hired a ___ from abroad, a foreign soldier who fought for him only for pay.|Each ___ in the army fought only for gold, caring nothing for the country he served.|When the pay stopped, every ___ in the foreign legion laid down his arms and went home.|buccaneer,corsair|mercenaries
  sortie|an attack made by troops coming out from a place under siege|(被围部队的)突围出击|At dawn the besieged defenders launched their ___, rushing out of the gates to attack the enemy camp.|A night ___ from the surrounded town surprised the enemy, who had thought the defenders too weak to come out.|Trapped inside the fortress, the knights planned one last ___ to break out through the enemy lines.|onslaught,skirmish|sorties
  foray|a sudden attack or raid into enemy land; a brief first try at something new|突袭；初次尝试|The raiders made a ___ across the river, a sudden raid deep into enemy land.|Her first ___ into politics, a brief try at running for mayor, failed.|The company's ___ into films, its first attempt at something new, lost money.|skirmish,ceasefire|forays
  `,
  "context-clues",
  {
    intro: t(
      "After a small **skirmish** near the river, the enemy began to **besiege** the town; the defenders made a daring **sortie**, but only a **ceasefire** ended the **hostilities**. These ten words help you describe fighting, attacks and the pauses between them.",
      "河边一场小规模冲突（**skirmish**）之后，敌军开始围攻（**besiege**）小镇；守军大胆地突围出击（**sortie**），但最终只有停火（**ceasefire**）才结束了战事（**hostilities**）。这十个词帮你描写战斗、进攻以及战事的停歇。",
    ),
    watchOut: {
      meanings: t(
        "A **skirmish** is a *small, short* fight; an **onslaught** is a *fierce, heavy* attack; a **sortie** is an attack by troops *breaking out* of a place under siege; a **foray** is a sudden raid *into* enemy land.",
        "**skirmish** 是*小规模、短暂*的交火；**onslaught** 是*猛烈*的进攻；**sortie** 是被围部队*冲出*城去的出击；**foray** 是*深入*敌境的突袭。",
      ),
      use: t(
        "**Bellicose** describes a person or nation eager for *war*; **pugnacious** describes someone eager to *argue or fight*, in a quarrel, a debate or a boxing ring.",
        "**bellicose** 形容渴望*战争*的人或国家；**pugnacious** 形容爱*争吵、打斗*的人，用于吵架、辩论或拳击场上。",
      ),
      spelling: t(
        "**Besiege** follows *i before e*: *-siege*; **hostilities** ends in *-ies*; **mercenary** ends in *-ary*; **pugnacious** ends in *-acious*; **sortie** ends in *-ie*.",
        "**besiege** 遵循 i 在 e 前：-siege；**hostilities** 结尾是 -ies；**mercenary** 结尾是 -ary；**pugnacious** 结尾是 -acious；**sortie** 结尾是 -ie。",
      ),
    },
    notes: `
      bellicose|a general eager to start a war with every neighbor|a speech threatening to send the army across the border|a letter full of threats of war|bellicose means eager for war; placid means calm and peaceful|bellicose 好战；placid 平和安静|timorous means nervous and lacking courage, the opposite of eager to start a war|timorous 指胆小怯懦，和急于开战正相反|placid means calm and not easily disturbed, the opposite of threatening war|placid 指平和、不易激动，和以战争相威胁正相反|bel · li · cose|the double l and the -cose ending|双写 l，结尾 -cose
      pugnacious|a boxer insulting his rival and trying to start a fight|a debater attacking every point, eager for a fight|a terrier picking a fight with every dog|pugnacious means eager to fight or argue; affable means friendly|pugnacious 好斗；affable 和蔼可亲|affable means friendly and easy to talk to, the opposite of eager to pick a fight|affable 指友好随和，和爱挑衅正相反|timorous means nervous and timid, the opposite of attacking eagerly|timorous 指胆小怯懦，和积极进攻正相反|pug · na · cious|pug- plus -nacious, with -acious|pug- 加 -nacious，结尾 -acious
      ceasefire|three days of no fighting agreed for a holiday|a pause lasting a week before the guns fired again|an agreement to stop fighting broken within hours|a ceasefire stops the fighting; hostilities are the fighting itself|ceasefire 是停火；hostilities 是战事本身|hostilities are acts of fighting, the opposite of an agreement to stop fighting|hostilities 指交战行为，和停火协议正相反|sortie is an attack by troops breaking out of a siege, the opposite of agreeing to stop fighting|sortie 指被围部队的突围出击，和同意停火正相反|cease · fire|cease plus fire|cease 加 fire
      hostilities|fighting that broke out along a border and spread for weeks|years of fighting ended by a peace treaty|months of battles in the streets that left a city in ruins|hostilities are the fighting of a war; a ceasefire stops them|hostilities 是交战；ceasefire 使之停止|ceasefire is an agreement to stop fighting, not the fighting itself|ceasefire 是停火协议，不是交战本身|onslaught is one fierce attack, not a whole war's fighting over weeks or years|onslaught 是一次猛攻，不是持续数周或数年的战事|hos · til · i · ties|hostile drops its e, then -ities|hostile 去掉 e，再接 -ities
      skirmish|a brief clash between two small patrols near a bridge|a few fans fighting briefly outside a stadium|a small clash between scouts with three hurt|a skirmish is a small, short fight; an onslaught is a fierce, heavy attack|skirmish 是小规模短暂交火；onslaught 是猛烈的大进攻|foray is a sudden raid into enemy land, not a small clash between two groups that meet|foray 是深入敌境的突袭，不是两支小队相遇时的交火|onslaught is a fierce, heavy attack, the opposite of a small fight over in minutes|onslaught 指猛烈的进攻，和几分钟就结束的小冲突正相反|skir · mish|skir- plus -mish|skir- 加 -mish
      onslaught|a fierce attack by ten thousand men on a fort|wave after wave of shots against a team|hundreds of angry emails arriving in a fierce flood|an onslaught is a fierce, heavy attack; a skirmish is a small, short one|onslaught 是猛烈的进攻；skirmish 是小规模交火|skirmish is a small, short fight, the opposite of a fierce attack by thousands|skirmish 指小规模的短暂交火，和成千上万人的猛攻正相反|sortie is a breakout by troops under siege, not a heavy attack pouring in|sortie 是被围部队冲出去的出击，不是如潮水般涌来的猛攻|on · slaught|on- plus slaught, as in slaughter|on- 加 slaught，同 slaughter
      besiege|an army surrounding a castle for months until it gave up|fans crowding around a star at an airport|reporters crowding around a minister with questions|besiege surrounds a place or person; ransack searches roughly and steals|besiege 围攻、围住；ransack 洗劫|ransack means to search a place roughly and steal from it, not to surround it and wait|ransack 指粗暴地搜查洗劫，不是包围等待|maraud means to roam about looking for things to steal, not to surround and crowd in on one place|maraud 指四处游荡劫掠，不是围住某处|be · siege|-siege, with i before e|结尾 -siege，i 在 e 前
      mercenary|a foreign soldier hired by a king who fought only for pay|soldiers fighting only for gold, caring nothing for the country|soldiers of a foreign legion going home when the pay stopped|a mercenary is a soldier paid to fight; a buccaneer is a pirate|mercenary 是雇佣兵；buccaneer 是海盗|buccaneer is a pirate who robs ships at sea, not a soldier paid to fight in an army|buccaneer 是在海上劫船的海盗，不是受雇参军的士兵|corsair is a pirate of the North African coast, not a hired soldier in a foreign army|corsair 是北非沿岸的海盗，不是外国军队雇来的士兵|mer · ce · nar · y|the c that sounds like s, and the -ary ending|c 读作 s，结尾 -ary
      sortie|besieged defenders rushing out of the gates at dawn|a night attack from a surrounded town|knights trapped in a fortress planning to break out|a sortie is a breakout attack from a siege; an onslaught is a heavy attack on it|sortie 是从被围处冲出的出击；onslaught 是对它发起的猛攻|onslaught is a fierce attack against a place, not a rush out of a place under siege|onslaught 是对某地的猛攻，不是从被围之地冲出来|skirmish is a small fight between groups that meet, not a breakout from a siege|skirmish 是两队相遇时的小冲突，不是突围|sor · tie|the -ie ending, said SOR-tee|结尾是 -ie，读作 SOR-tee
      foray|raiders making a sudden raid across a river into enemy land|a first, brief try at politics by running for mayor|a company's first attempt at making films|a foray is a sudden raid or a first try; a skirmish is a small fight|foray 是突袭或初次尝试；skirmish 是小冲突|skirmish is a small fight between two groups, not a raid into enemy land or a first try at something|skirmish 是两队之间的小冲突，不是深入敌境的突袭或初次尝试|ceasefire is an agreement to stop fighting, the opposite of a sudden raid|ceasefire 指停火协议，和突然袭击正相反|for · ay|for- plus -ay|for- 加 -ay
    `,
  },
);

const peace = batch(
  "words-of-calming-and-defiance",
  ["Words of Calming and Defiance", "安抚与固执的词"],
  ["soothing anger and refusing to yield", "平息怒气与拒不让步"],
  `
  conciliate|to stop someone being angry; to bring together|安抚；调解|He tried to ___ the angry neighbors, apologizing and offering to fix the fence until their anger faded.|The judge hoped to ___ the two quarreling parties, bringing them together to settle their dispute.|A gift and a sincere apology may ___ her, turning her anger back into friendship.|escalate,berate|conciliated,conciliation,conciliatory
  assuage|to make an unpleasant feeling less intense|缓和，减轻(痛苦、忧虑等)|Time slowly helped to ___ her grief, making the sharp sorrow a little easier to bear each year.|A long cold drink will ___ your thirst after the hike, making it far less painful.|The minister tried to ___ public fears, explaining calmly why the water was safe so that the worry would lessen.|escalate,castigate|assuaged
  appease|to calm someone by giving them what they demand|姑息，满足要求以平息|Leaders who ___ a bully by giving him whatever he demands only encourage him to ask for more.|The company gave in to the strikers' demands to ___ them, raising wages so that they would stop protesting.|To ___ his angry wife, he gave her exactly what she had asked for: a week by the sea.|berate,escalate|appeased,appeasement
  soothe|to gently calm someone or ease pain|安慰；缓解|A soft lullaby will ___ the crying baby, gently calming her to sleep.|This cool cream will ___ the burn, easing the pain within minutes.|She stroked the frightened horse's neck to ___ it, speaking gently until it stopped trembling.|escalate,berate|soothed
  pacify|to make calm or peaceful; to bring a region under control|使平静；平定|The nurse tried to ___ the frightened patient, speaking softly until he lay calm.|The army struggled to ___ the rebel region, bringing it under control and restoring peace after years of fighting.|A warm bottle will usually ___ a fretful baby, making him quiet and calm.|escalate,pillage|pacified,pacifier
  propitiate|to win the favor of a god or person by doing something to please them|讨好，抚慰(神灵等)|The villagers made offerings of rice and fruit to ___ the gods, hoping to win back their favor.|He bought expensive gifts to ___ his boss, trying to win back his good will after the mistake.|They sang and danced to ___ the angry spirits, pleasing them so that the rains would come.|vilify,berate|propitiated,propitiation
  intransigent|refusing to change one's views or to agree|不妥协的|The ___ union rejected every offer and refused to give up a single demand.|Both sides remained ___, neither willing to change its position in the slightest.|Her ___ stance, refusing any compromise at all, ended the talks.|tractable,meek|intransigence
  obdurate|stubbornly refusing to change one's opinion or course|顽固的，执拗的|The ___ old man would not move from his house, however much the council offered him.|She was ___ in her refusal; no argument could change her mind.|No plea for mercy could move the ___ judge, who refused to change the sentence.|docile,tractable|
  recalcitrant|stubbornly refusing to obey rules or authority|不服管教的，桀骜不驯的|The teacher sent the ___ pupil to the head, since he refused every instruction she gave.|The ___ mule refused to cross the stream, digging in its hooves however hard they pulled.|The ___ prisoners refused to obey the guards' orders and would not eat.|submissive,docile|recalcitrance
  implacable|unable to be calmed or satisfied|难以平息的，毫不留情的|He remained the king's most ___ enemy, his hatred never calmed by any gift or apology.|Her ___ anger lasted for years; nothing anyone said could soften it.|The ___ storm battered the coast for days, raging on without any pause.|placid,tractable|implacably
  `,
  "context-clues",
  {
    intro: t(
      "Diplomats tried to **conciliate** the two sides and **assuage** their fears, but the **intransigent** leaders, full of **implacable** anger, would not move an inch. These ten words help you describe calming anger and fear, and refusing to give way.",
      "外交官们努力调解（**conciliate**）双方，缓和（**assuage**）他们的恐惧；可那些毫不妥协的（**intransigent**）领导人满怀难以平息的（**implacable**）怒火，寸步不让。这十个词帮你描写平息怒气与恐惧，以及拒不让步。",
    ),
    watchOut: {
      meanings: t(
        "**Appease** calms someone by *giving them what they demand*; **propitiate** wins the *favor* of a god or a powerful person; **assuage** *lessens* a feeling such as grief, fear or thirst.",
        "**appease** 是靠*满足对方要求*来平息；**propitiate** 是讨得神灵或有权者的*欢心*；**assuage** 是*减轻*悲伤、恐惧或口渴等感受。",
      ),
      use: t(
        "**Intransigent** and **obdurate** describe refusing to *change one's mind*; **recalcitrant** describes refusing to *obey*; **implacable** describes anger or an enemy that *cannot be calmed*.",
        "**intransigent** 和 **obdurate** 指拒不*改变主意*；**recalcitrant** 指拒不*服从*；**implacable** 形容*无法平息*的怒火或敌人。",
      ),
      spelling: t(
        "**Assuage** has a double *s* and ends in *-uage*; **propitiate** has *-pitiate*; **recalcitrant** has *-calc-*; **soothe** ends in *-the*, not *-th*.",
        "**assuage** 双写 s，结尾是 -uage；**propitiate** 中间是 -pitiate；**recalcitrant** 中间是 -calc-；**soothe** 结尾是 -the，不是 -th。",
      ),
    },
    notes: `
      conciliate|apologizing to angry neighbors until their anger faded|a judge bringing two quarreling parties together|a gift and apology turning anger back into friendship|conciliate ends anger or brings people together; escalate makes a quarrel worse|conciliate 平息怒气或调解；escalate 使争端升级|escalate means to make a quarrel greater or worse, the opposite of ending anger|escalate 指使争端升级恶化，和平息怒气正相反|berate means to scold someone angrily, the opposite of calming their anger|berate 指愤怒地痛骂，和平息对方怒气正相反|con · cil · i · ate|-cil- in the middle, then -iate|中间是 -cil-，结尾 -iate
      assuage|time making sharp grief easier to bear|a cold drink making thirst far less painful|a calm explanation that lessened public worry|assuage lessens an unpleasant feeling; escalate makes things worse|assuage 减轻不快的感受；escalate 使事态加剧|escalate means to make something greater or worse, the opposite of making a feeling easier to bear|escalate 指使事态加剧，和让感受更易承受正相反|castigate means to criticize someone severely, not to lessen grief, thirst or fear|castigate 指严厉批评，不是减轻悲伤、口渴或恐惧|as · suage|the double s and the -uage ending|双写 s，结尾 -uage
      appease|giving a bully whatever he demands|raising wages to meet strikers' demands|giving an angry wife exactly what she asked for|appease calms by giving what is demanded; berate scolds angrily|appease 以满足要求来平息；berate 愤怒地斥责|berate means to scold someone angrily at length, not to calm them by giving in|berate 指长时间愤怒地斥责，不是通过让步来平息|escalate means to make a conflict worse, the opposite of calming someone by giving in|escalate 指使冲突升级，和让步平息正相反|ap · pease|the double p, then -ease|双写 p，再接 -ease
      soothe|a lullaby gently calming a crying baby to sleep|a cool cream easing the pain of a burn|gentle stroking and words until a frightened horse stopped trembling|soothe gently calms; berate scolds angrily|soothe 温和地抚慰；berate 愤怒地斥责|escalate means to make something worse or more intense, the opposite of easing pain or fear|escalate 指使事情加剧，和缓解痛苦或恐惧正相反|berate means to scold angrily, the opposite of calming gently|berate 指愤怒地斥责，和温和安抚正相反|soothe|the double o and the -the ending|双写 o，结尾 -the
      pacify|a nurse speaking softly until a frightened patient lay calm|an army bringing a rebel region under control and restoring peace|a warm bottle making a fretful baby quiet|pacify makes calm or brings under control; escalate makes worse|pacify 使平静或平定；escalate 使升级|escalate means to make a conflict greater or worse, the opposite of restoring calm and peace|escalate 指使冲突升级，和恢复平静与和平正相反|pillage means to rob a place violently, not to calm it and restore peace|pillage 指暴力洗劫，不是使之平静、恢复和平|pac · i · fy|pac- as in peace, then -ify|pac- 同 peace，再接 -ify
      propitiate|offerings of rice and fruit to win back the gods' favor|expensive gifts to win back a boss's good will|singing and dancing to please angry spirits so rain would come|propitiate wins favor by pleasing; vilify speaks of someone in an ugly way|propitiate 讨好以求宠；vilify 恶意中伤|vilify means to speak about someone in an ugly, unfair way, the opposite of pleasing them to win favor|vilify 指恶意中伤，和讨好求宠正相反|berate means to scold angrily, the opposite of trying to win someone's good will|berate 指愤怒地斥责，和设法博得好感正相反|pro · pi · ti · ate|pro- plus -pitiate|pro- 加 -pitiate
      intransigent|a union rejecting every offer and every compromise|two sides neither willing to change its position|a stance refusing any compromise that ended talks|intransigent means refusing to change or agree; tractable means easily influenced|intransigent 拒不妥协；tractable 易于说服|tractable means easy to influence or control, the opposite of refusing every offer|tractable 指易于驾驭、说服，和拒绝一切提议正相反|meek means quiet and easily imposed on, the opposite of refusing to give up anything|meek 指温顺、逆来顺受，和寸步不让正相反|in · tran · si · gent|in- plus transigent, with a soft g|in- 加 transigent，g 读软音
      obdurate|an old man who would not leave his house whatever he was offered|a refusal no argument could change|a judge no plea for mercy could move|obdurate means stubbornly unmoved; docile means easily controlled|obdurate 顽固不化；docile 温顺|docile means ready to accept control, the opposite of stubbornly refusing to change|docile 指温顺听话，和顽固不改正相反|tractable means easy to influence, the opposite of unmoved by every plea|tractable 指易于说服，和怎么求都不为所动正相反|ob · du · rate|ob- plus du- plus -rate|ob- 加 du- 再加 -rate
      recalcitrant|a pupil refusing every instruction his teacher gave|a mule refusing to cross a stream however hard it was pulled|prisoners refusing the guards' orders and refusing to eat|recalcitrant means refusing to obey; submissive means ready to obey|recalcitrant 不服管教；submissive 顺从|submissive means ready to obey without arguing, the opposite of refusing every order|submissive 指顺从不争，和拒绝一切命令正相反|docile means ready to accept control, the opposite of stubbornly refusing to obey|docile 指温顺听从，和执意不服从正相反|re · cal · ci · trant|-calc- in the middle, then -itrant|中间是 -calc-，结尾 -itrant
      implacable|an enemy whose hatred no gift or apology could calm|anger that nothing could soften for years|a storm raging on for days without pause|implacable means impossible to calm; placid means calm|implacable 无法平息；placid 平静|placid means calm and not easily disturbed, the opposite of raging and impossible to calm|placid 指平静、不易激动，和无法平息的怒火正相反|tractable means easy to deal with or control, the opposite of something no one can calm|tractable 指容易驾驭，和谁也平息不了正相反|im · plac · a · ble|im- plus placate's plac- plus -able|im- 加 placate 的 plac- 再加 -able
    `,
  },
);

const talk = batch(
  "words-for-talkers-and-the-silent",
  ["Words for Talkers and the Silent", "健谈与沉默的词"],
  ["how much and how people talk", "人说话的多少和方式"],
  `
  terse|using few words, sometimes rudely|简短生硬的|His ___ reply was just two words: "Not now."|Her ___ note said only "No," with no greeting and no explanation.|The general gave ___ orders, short and sharp, wasting no words.|prolix,effusive|tersely
  loquacious|tending to talk a great deal|话多的|The ___ barber told us his whole life story while he cut our hair, never pausing for breath.|She grew ___ after a glass of wine, talking for hours to anyone who would listen.|Our ___ guide never stopped talking, from the first stop of the tour to the last.|uncommunicative,reserved|loquacity
  garrulous|excessively talkative, especially about trivial things|喋喋不休的|My ___ neighbor kept us at the gate for an hour, chattering about her cat's diet and the weather.|He became ___ in old age, talking endlessly about small, unimportant things.|The ___ passenger annoyed everyone, chattering for the whole flight about his socks and his lunch.|reserved,terse|
  uncommunicative|unwilling to talk or share information|不爱说话的，不愿交流的|The ___ teenager answered every question with a grunt and went straight to his room.|The company was ___ about the delay, refusing to tell customers anything at all.|He grew ___ after the accident, hardly speaking to anyone for weeks.|voluble,chatty
  reserved|slow to show feelings or give opinions|矜持的，内敛的|She is ___ with people she doesn't know, keeping her feelings and opinions to herself.|He was a quiet, ___ man who rarely showed what he felt.|Her ___ manner, cool and careful with her feelings, hid a warm heart.|effusive,garrulous
  prolix|using too many words; long and tedious|冗长的|The ___ report ran to six hundred pages, using ten words wherever one would do.|His ___ speech went on for two tedious hours, saying the same thing again and again.|Cut the ___ sentences; each one uses far too many words.|terse,uncommunicative|prolixity
  voluble|speaking fluently and at length|健谈的，滔滔不绝的|The ___ host told joke after joke all evening, words pouring out of him.|She was ___ in defense of her plan, talking fluently and at length for half an hour.|His ___ protests, a long, unbroken stream of words, filled the room.|uncommunicative,terse|volubly
  chatty|fond of friendly, informal talk|爱闲聊的|The ___ hairdresser talked happily the whole time, sharing all the gossip of the town.|She wrote a long, ___ letter about her trip, full of friendly news and little stories.|He was in a ___ mood after lunch, happy to talk about anything with anyone.|terse,reserved|chattily
  effusive|expressing feelings in an unrestrained, gushing way|热情洋溢的，过分的|He welcomed every guest with ___ hugs and loud cries of delight.|Her ___ praise, gushing on and on about his genius, embarrassed him.|The critics were ___, pouring out praise with no restraint at all.|reserved,terse|effusively
  glib|fluent but insincere and shallow|油嘴滑舌的，随便的|The salesman was ___, with a smooth, easy answer for every question, though none of it was sincere.|Don't give me that ___ excuse, so smooth and quick that you clearly haven't thought about it.|His ___ charm, all easy smooth talk and no real feeling, hid his lies.|uncommunicative,reserved|glibly
  `,
  "context-clues",
  {
    intro: t(
      "At the party the **loquacious** host talked for hours and his **effusive** wife gushed over every guest, while their **reserved** son gave only **terse** answers. These ten words help you describe how much people talk and the way they do it.",
      "聚会上，话多的（**loquacious**）主人一聊就是几个小时，他热情洋溢的（**effusive**）妻子对每位客人都赞不绝口，而他们内敛的（**reserved**）儿子只给出简短生硬的（**terse**）回答。这十个词帮你描写人说话的多少和方式。",
    ),
    watchOut: {
      meanings: t(
        "**Loquacious**, **voluble** and **chatty** describe people who *talk a lot*; **garrulous** adds talk about *trivial* things; **prolix** describes speech or writing with *too many words*; **glib** describes talk that is smooth but *insincere*.",
        "**loquacious**、**voluble** 和 **chatty** 形容*话多*的人；**garrulous** 还带有絮叨*琐事*的意思；**prolix** 形容话语或文章*用词过多*；**glib** 形容说话流利却*不真诚*。",
      ),
      use: t(
        "**Terse** describes a *reply or order* that is short; **uncommunicative** describes someone who will *not share* information; **reserved** describes someone who keeps *feelings* to themselves.",
        "**terse** 形容*回答或命令*简短；**uncommunicative** 形容*不肯透露*信息的人；**reserved** 形容把*感情*藏在心里的人。",
      ),
      spelling: t(
        "**Loquacious** ends in *-acious*; **garrulous** has a double *r*; **voluble** ends in *-uble*; **effusive** has a double *f*; **prolix** ends in *x*.",
        "**loquacious** 结尾是 -acious；**garrulous** 双写 r；**voluble** 结尾是 -uble；**effusive** 双写 f；**prolix** 以 x 结尾。",
      ),
    },
    notes: `
      terse|a reply of just two words|a note saying only "No" with no greeting|short, sharp orders wasting no words|terse means using few words; prolix means using far too many|terse 言简生硬；prolix 冗长啰唆|prolix means using too many words, the opposite of just a word or two|prolix 指用词过多，和只说一两个词正相反|effusive means gushing with feeling, the opposite of short and sharp with no greeting|effusive 指感情奔放、滔滔不绝，和简短生硬、连招呼都不打正相反|terse|the -erse ending, as in verse|结尾是 -erse，同 verse
      loquacious|a barber telling his whole life story without pausing|a woman talking for hours after a glass of wine|a guide who never stopped talking|loquacious means talking a great deal; uncommunicative means unwilling to talk|loquacious 话多；uncommunicative 不爱说话|uncommunicative means unwilling to talk, the opposite of never stopping talking|uncommunicative 指不愿说话，和说个不停正相反|reserved means slow to share feelings or opinions, the opposite of telling one's whole life story|reserved 指矜持内敛，和把一生经历都讲出来正相反|lo · qua · cious|loqu- as in eloquent, then -acious|loqu- 同 eloquent，结尾 -acious
      garrulous|an hour at the gate hearing about a cat's diet|endless talk about small, unimportant things|a whole flight of chatter about socks and lunch|garrulous means talking too much about trivial things; terse means using few words|garrulous 喋喋不休；terse 言简生硬|reserved means slow to share feelings or opinions, the opposite of chattering endlessly|reserved 指矜持内敛，和喋喋不休正相反|terse means using very few words, the opposite of talking for an hour|terse 指言简意赅，和一说就是一小时正相反|gar · ru · lous|the double r, then -ulous|双写 r，结尾 -ulous
      uncommunicative|a teenager answering with a grunt|a company refusing to tell customers anything|a man hardly speaking to anyone for weeks|uncommunicative means unwilling to talk or share; voluble means talking at length|uncommunicative 不愿交流；voluble 滔滔不绝|voluble means speaking fluently and at length, the opposite of answering with a grunt|voluble 指滔滔不绝，和只哼一声作答正相反|chatty means fond of friendly talk, the opposite of hardly speaking to anyone|chatty 指爱闲聊，和几乎不跟人说话正相反|un · com · mu · ni · ca · tive|un- plus communicate, which drops its e before -ive|un- 加 communicate，去掉 e 再接 -ive
      reserved|a woman keeping her feelings and opinions to herself with strangers|a quiet man who rarely showed what he felt|a cool, careful manner hiding a warm heart|reserved means slow to show feelings; effusive means gushing with feeling|reserved 矜持内敛；effusive 热情洋溢|effusive means pouring out feelings without restraint, the opposite of keeping them to oneself|effusive 指毫无保留地流露感情，和把感情藏在心里正相反|garrulous means talking endlessly about small things, the opposite of quiet and rarely sharing|garrulous 指喋喋不休，和安静寡言正相反|re · served|re- plus serve plus -d|re- 加 serve 再加 -d
      prolix|a report using ten words wherever one would do|a two-hour speech saying the same thing again and again|sentences that each use far too many words|prolix means using too many words; terse means using few|prolix 冗长；terse 简短|terse means using very few words, the opposite of ten words where one would do|terse 指用词极少，和一个词能说清却用十个正相反|uncommunicative means unwilling to share information, not pouring out too many words|uncommunicative 指不愿透露信息，不是用词过多|pro · lix|pro- plus -lix, ending in x|pro- 加 -lix，以 x 结尾
      voluble|a host telling joke after joke all evening|half an hour of fluent talk in defense of a plan|protests in a long, unbroken stream of words|voluble means speaking fluently and at length; terse means using few words|voluble 滔滔不绝；terse 言简|uncommunicative means unwilling to talk, the opposite of words pouring out all evening|uncommunicative 指不愿说话，和整晚滔滔不绝正相反|terse means using very few words, the opposite of a long, unbroken stream of words|terse 指用词极少，和长篇大论正相反|vol · u · ble|vol- plus -uble|vol- 加 -uble
      chatty|a hairdresser happily sharing the gossip of the town|a long letter full of friendly news and little stories|a mood of being happy to talk about anything|chatty means fond of friendly talk; reserved means keeping feelings to oneself|chatty 爱闲聊；reserved 矜持|terse means using few words, the opposite of a long letter full of news|terse 指言简，和写满新鲜事的长信正相反|reserved means slow to share feelings or opinions, the opposite of happy to talk about anything|reserved 指矜持内敛，和什么都乐意聊正相反|chat · ty|chat plus a double t, then -y|chat 双写 t，再加 -y
      effusive|hugs and loud cries of delight for every guest|praise gushing on and on about someone's genius|critics pouring out praise with no restraint|effusive means gushing with feeling; reserved means keeping feelings in|effusive 感情奔放；reserved 内敛|reserved means slow to show feelings, the opposite of hugs and loud cries of delight|reserved 指不轻易流露感情，和拥抱欢呼正相反|terse means using few words, the opposite of praise gushing on and on|terse 指言简，和赞美之词滔滔不绝正相反|ef · fu · sive|the double f, then -usive|双写 f，结尾 -usive
      glib|a salesman with a smooth answer for every question but no sincerity|a quick, smooth excuse that shows no thought|easy smooth talk with no real feeling hiding lies|glib means smooth but insincere; uncommunicative means unwilling to talk|glib 油嘴滑舌；uncommunicative 不爱说话|uncommunicative means unwilling to talk, the opposite of a ready answer for every question|uncommunicative 指不愿说话，和每个问题都对答如流正相反|reserved means slow to give opinions, the opposite of easy, smooth talk|reserved 指不轻易表态，和随口侃侃而谈正相反|glib|gl- plus -ib, as in crib|gl- 加 -ib，同 crib
    `,
  },
);

const joy = batch(
  "words-of-rapture-and-gloom",
  ["Words of Rapture and Gloom", "狂喜与忧郁的词"],
  ["great happiness and deep sadness", "极度的快乐与深深的悲伤"],
  `
  euphoria|a feeling of intense excitement and happiness|欣快，狂喜|The ___ of victory lasted for days, the whole team wild with excitement and joy.|A wave of ___ swept the city, and strangers hugged and danced in the streets for joy.|Runners speak of the ___ near the finish, a sudden rush of intense, excited happiness.|misgiving,equanimity|euphoric
  ecstatic|feeling overwhelming happiness|狂喜的|The fans were ___ after the win, screaming and hugging with overwhelming joy.|She was ___ about the job, so happy that she danced around the kitchen.|The ___ crowd danced in the street, wild with happiness.|doleful,dejected|ecstatically,ecstasy
  exultant|feeling or showing triumphant joy|欢欣鼓舞的|The ___ team lifted the cup high, shouting in triumph.|She gave a loud, ___ shout of triumph as she crossed the line first.|The square filled with ___ voters, cheering the triumph of their candidate.|disconsolate,dejected|exultantly
  blithe|cheerful and carefree, sometimes too carefree|快乐的，无忧无虑的|She has a ___ spirit, always cheerful and never worried about anything.|His ___ disregard for danger, cheerfully ignoring every warning, worried us.|They walked on in ___ ignorance, cheerful and carefree, not knowing the bridge had fallen.|lugubrious,doleful|blithely
  forlorn|lonely and sad; nearly hopeless|孤苦伶仃的；无望的|The ___ puppy waited alone at the gate, lonely and sad, for an owner who never came.|With two minutes left and five goals behind, they made one last ___ attempt to save the game, with almost no hope.|The ___ village stood empty and lonely, its last people long gone.|exultant,ecstatic|forlornly
  disconsolate|very unhappy and unable to be comforted|郁郁寡欢的，无法安慰的|The ___ child cried for her lost cat, and nothing anyone said could comfort her.|He sat ___ after the loss, so unhappy that no kind word could cheer him.|The ___ fans wandered home in silence, too miserable to be comforted.|exultant,ecstatic|disconsolately
  doleful|expressing sorrow; mournful|悲哀的|The dog gave me a long, ___ look, its sad eyes full of sorrow.|The ___ tune on the violin, slow and mournful, made us all feel sad.|Her ___ eyes filled with tears of sorrow.|ecstatic,blithe|dolefully
  lugubrious|looking or sounding sad and dismal, often too much|悲哀的，阴郁的|The ___ music, slow and dismal, made the film feel far too sad and long.|He wore a long, ___ expression, as gloomy as a man at a funeral.|Their ___ tone, sad and dismal, dampened the whole party.|blithe,exultant|lugubriously
  dejected|sad and depressed; dispirited|沮丧的|The ___ players left the field with their heads down after the defeat.|She felt ___ after the rejection, sad and low in spirit.|He sat ___ on the steps, his spirits crushed by the bad news.|exultant,ecstatic|dejectedly,dejection
  woebegone|looking sad or miserable|愁眉苦脸的|The ___ child, who had lost her balloon, looked utterly miserable.|He let out a deep, ___ sigh, looking the picture of misery.|A pale, ___ face, sad and miserable, peered through the window.|ecstatic,exultant|
  `,
  "context-clues",
  {
    intro: t(
      "After the final, the **exultant** winners danced in a wave of **euphoria**, while the **dejected** losers sat **disconsolate** in the changing room. These ten words help you describe great joy and deep sadness.",
      "决赛之后，欢欣鼓舞的（**exultant**）冠军们在一片狂喜（**euphoria**）中跳起舞来，而沮丧的（**dejected**）败者却郁郁寡欢地（**disconsolate**）坐在更衣室里。这十个词帮你描写极度的快乐和深深的悲伤。",
    ),
    watchOut: {
      meanings: t(
        "**Exultant** joy comes from *triumph*; **ecstatic** joy is *overwhelming*; **blithe** cheer is *carefree*, sometimes too carefree; **euphoria** is the *noun*, the feeling itself.",
        "**exultant** 的喜悦来自*胜利*；**ecstatic** 的喜悦*无法抑制*；**blithe** 的快乐是*无忧无虑*，有时过于轻率；**euphoria** 是*名词*，指这种感觉本身。",
      ),
      use: t(
        "**Disconsolate** means sad and *unable to be comforted*; **forlorn** adds *loneliness* or *hopelessness*; **lugubrious** often means sad *to excess*; **woebegone** describes a sad *look*.",
        "**disconsolate** 指伤心得*无法安慰*；**forlorn** 还带有*孤单*或*无望*的意味；**lugubrious** 常指悲伤得*过了头*；**woebegone** 形容愁苦的*样子*。",
      ),
      spelling: t(
        "**Euphoria** begins with *eu-*; **lugubrious** has *-gub-*; **woebegone** is *woe* plus *begone*; **disconsolate** has *-sol-*, as in console.",
        "**euphoria** 以 eu- 开头；**lugubrious** 中间是 -gub-；**woebegone** 是 woe 加 begone；**disconsolate** 中间是 -sol-，同 console。",
      ),
    },
    notes: `
      euphoria|a team wild with excitement and joy for days|strangers hugging and dancing in the streets for joy|a sudden rush of intense, excited happiness near a finish line|euphoria is intense excited happiness; equanimity is calmness|euphoria 欣快狂喜；equanimity 镇定|misgiving is a feeling of doubt or worry, the opposite of wild joy|misgiving 指疑虑担忧，和狂喜正相反|equanimity is calmness, the opposite of wild excitement|equanimity 指镇定沉着，和激动狂喜正相反|eu · pho · ri · a|eu- plus -phoria, ending in -ia|eu- 加 -phoria，结尾 -ia
      ecstatic|fans screaming and hugging with overwhelming joy|a woman so happy she danced around the kitchen|a crowd dancing in the street wild with happiness|ecstatic means overwhelmingly happy; dejected means sad and low|ecstatic 狂喜；dejected 沮丧|doleful means sorrowful and mournful, the opposite of screaming with joy|doleful 指悲哀，和欢呼雀跃正相反|dejected means sad and low in spirit, the opposite of dancing with happiness|dejected 指沮丧消沉，和高兴得跳舞正相反|ec · stat · ic|ec- plus -static|ec- 加 -static
      exultant|a team lifting a cup and shouting in triumph|a loud shout of triumph at crossing the line first|voters cheering the triumph of their candidate|exultant means triumphantly joyful; disconsolate means unable to be comforted|exultant 欢欣鼓舞；disconsolate 郁郁寡欢|disconsolate means very unhappy and unable to be comforted, the opposite of shouting in triumph|disconsolate 指伤心得无法安慰，和欢呼胜利正相反|dejected means sad and dispirited, the opposite of cheering a triumph|dejected 指沮丧消沉，和庆祝胜利正相反|ex · ult · ant|exult plus -ant|exult 加 -ant
      blithe|a spirit always cheerful and never worried|cheerfully ignoring every warning of danger|walking on cheerful and carefree, not knowing a bridge had fallen|blithe means cheerful and carefree; lugubrious means gloomy|blithe 无忧无虑；lugubrious 阴郁|lugubrious means sad and dismal, the opposite of cheerful and carefree|lugubrious 指悲哀阴郁，和快乐无忧正相反|doleful means full of sorrow, the opposite of never worried about anything|doleful 指满怀悲伤，和什么都不担心正相反|blithe|bl- plus -ithe, as in lithe|bl- 加 -ithe，同 lithe
      forlorn|a lonely puppy waiting for an owner who never came|one last attempt with almost no hope of saving a game|a village standing empty and lonely|forlorn means lonely, sad or hopeless; ecstatic means overwhelmingly happy|forlorn 孤苦无望；ecstatic 狂喜|exultant means full of triumphant joy, the opposite of lonely and sad|exultant 指因胜利而欢欣，和孤单悲伤正相反|ecstatic means overwhelmingly happy, the opposite of almost without hope|ecstatic 指狂喜，和几乎不抱希望正相反|for · lorn|for- plus -lorn|for- 加 -lorn
      disconsolate|a child crying for a lost cat whom nothing could comfort|a man so unhappy no kind word could cheer him|fans too miserable to be comforted|disconsolate means unable to be comforted; exultant means triumphant|disconsolate 无法安慰；exultant 欢欣鼓舞|exultant means full of triumphant joy, the opposite of crying and unable to be comforted|exultant 指因胜利而欢欣，和哭得无法安慰正相反|ecstatic means overwhelmingly happy, the opposite of too miserable to be cheered|ecstatic 指狂喜，和难过得无法开怀正相反|dis · con · so · late|dis- plus con- plus -solate, as in console|dis- 加 con- 再加 -solate，同 console
      doleful|a dog's long look with sad eyes full of sorrow|a slow, mournful tune on a violin|eyes filling with tears of sorrow|doleful means full of sorrow; blithe means carefree|doleful 悲哀；blithe 无忧无虑|ecstatic means overwhelmingly happy, the opposite of eyes full of sorrow|ecstatic 指狂喜，和满眼悲伤正相反|blithe means cheerful and carefree, the opposite of slow and mournful|blithe 指快乐无忧，和缓慢哀伤正相反|dole · ful|dole plus -ful, with one l|dole 加 -ful，只有一个 l
      lugubrious|slow, dismal music that made a film feel too sad|a face as gloomy as a man at a funeral|a sad, dismal tone that dampened a party|lugubrious means dismally sad; blithe means cheerful and carefree|lugubrious 阴郁；blithe 快乐无忧|blithe means cheerful and carefree, the opposite of gloomy as a funeral|blithe 指快乐无忧，和葬礼般阴郁正相反|exultant means full of triumphant joy, the opposite of dismal and sad|exultant 指欢欣鼓舞，和阴沉悲伤正相反|lu · gu · bri · ous|-gub- in the middle, then -rious|中间是 -gub-，结尾 -rious
      dejected|players leaving the field with heads down after defeat|a woman sad and low after a rejection|a man whose spirits were crushed by bad news|dejected means sad and dispirited; exultant means triumphant|dejected 沮丧；exultant 欢欣鼓舞|exultant means full of triumphant joy, the opposite of heads down after defeat|exultant 指因胜利而欢欣，和战败后垂头丧气正相反|ecstatic means overwhelmingly happy, the opposite of low in spirit|ecstatic 指狂喜，和情绪低落正相反|de · ject · ed|de- plus ject plus -ed|de- 加 ject 再加 -ed
      woebegone|a child who had lost her balloon looking utterly miserable|a deep sigh from the picture of misery|a pale, sad face at a window|woebegone means looking miserable; ecstatic means overwhelmingly happy|woebegone 愁眉苦脸；ecstatic 狂喜|ecstatic means overwhelmingly happy, the opposite of looking utterly miserable|ecstatic 指狂喜，和一脸愁苦正相反|exultant means full of triumphant joy, the opposite of the picture of misery|exultant 指因胜利而欢欣，和一副愁苦样正相反|woe · be · gone|woe plus begone|woe 加 begone
    `,
  },
);

const memory = batch(
  "words-of-remembering-and-forgetting",
  ["Words of Remembering and Forgetting", "记忆与遗忘的词"],
  ["memory, its loss and what helps it", "记忆、失忆以及帮助记忆的东西"],
  `
  amnesia|a loss of memory|健忘症，失忆|After the crash he suffered from ___, unable to remember his own name or his wife's face.|The film's hero wakes with ___, his memory of his whole past gone.|Doctors hoped the ___ was temporary and that her lost memories would return.|hindsight,memorabilia|amnesiac
  mnemonic|a device such as a rhyme that helps one remember|助记符，记忆术|"Every good boy deserves fruit" is the ___ that helps pupils remember the musical notes.|She made up her own ___, a little rhyme, to remember the order of the planets.|This short ___, a silly sentence built from the first letters, helps with spelling "because".|amnesia,memorabilia|mnemonics
  recollect|to remember something, often with effort|回忆起|Now in his nineties, he could still ___ the day the war ended, remembering every detail from eighty years before.|She closed her eyes and tried to ___ the address of her childhood home, searching her memory for the number.|I can't ___ his name, though I knew it well at school; it has slipped from my memory.|ascertain,divulge|recollected
  evocative|bringing strong images, memories or feelings to mind|唤起回忆的，令人回味的|The ___ photo brought her whole childhood flooding back to mind.|This piece of music is wonderfully ___, calling up pictures of the sea and memories of summer.|The smell of pine was ___ of the holidays, bringing back memories of Christmas mornings.|forgetful,indelible|evoke,evoked
  indelible|unable to be removed or forgotten|无法消除的，难忘的|The war left its ___ mark on him, one that could never be removed.|Write your name in ___ ink, which no washing can take out.|Her kindness left an impression so ___ that nothing in fifty years could wipe it away.|forgetful,reminiscent|indelibly
  reminiscent|tending to remind one of something|使人联想起的|The tune is ___ of an old folk song, reminding everyone of their grandparents' village.|Her style is ___ of the painters of Paris, calling them to mind in every brushstroke.|The smell was ___ of his grandmother's kitchen, bringing it back to him at once.|indelible,forgetful|
  forgetful|apt to forget things|健忘的|My ___ uncle loses his keys every day and never remembers where he parked.|She grows more ___ with age, leaving the oven on and missing appointments.|The ___ waiter, who never remembered an order, brought the wrong soup.|reminiscent,unforgettable|forgetfulness
  unforgettable|impossible to forget|难忘的|The trip was ___, a week we will remember all our lives.|Her voice is ___; hear it once and you remember it for ever.|That night under the stars was ___, and none of us will ever lose the memory of it.|forgetful,reminiscent|
  hindsight|understanding of a situation only after it has happened|事后的认识|With ___, now that we know the storm came, we should have left earlier.|Looking back, ___ makes every mistake look obvious, though nobody saw them at the time.|In ___, the plan was foolish, but it seemed wise before it failed.|amnesia,mnemonic|
  memorabilia|objects kept or collected because of their connection with people or events|纪念品，收藏品|He collects football ___: old shirts, signed balls and match tickets.|The museum shows war ___, medals, letters and helmets kept from the battles.|The shop sold film ___, posters and props from famous movies.|mnemonic,hindsight|
  `,
  "context-clues",
  {
    intro: t(
      "Years after the accident left her with **amnesia**, an **evocative** smell of the sea helped her **recollect** her childhood, and a box of family **memorabilia** did the rest. These ten words help you talk about remembering, forgetting and the things that help memory.",
      "那场事故让她患上失忆症（**amnesia**）多年之后，一股唤起回忆的（**evocative**）海水气味帮她回忆起（**recollect**）童年，一盒家族纪念品（**memorabilia**）则让她想起了其余的一切。这十个词帮你谈论记忆、遗忘和帮助记忆的东西。",
    ),
    watchOut: {
      meanings: t(
        "A **mnemonic** is a *trick* for remembering, such as a rhyme; **memorabilia** are *objects* kept as souvenirs; **hindsight** is understanding *after* the event; **amnesia** is a *loss* of memory.",
        "**mnemonic** 是帮助记忆的*小窍门*，比如顺口溜；**memorabilia** 是留作纪念的*物品*；**hindsight** 是事情*过后*才有的认识；**amnesia** 是记忆的*丧失*。",
      ),
      use: t(
        "**Reminiscent** and **evocative** are followed by *of*: reminiscent of a song; **indelible** describes a mark or memory that *cannot be removed*; **forgetful** describes a *person*.",
        "**reminiscent** 和 **evocative** 后面接 *of*，如 reminiscent of a song；**indelible** 形容*抹不掉*的痕迹或记忆；**forgetful** 形容*人*。",
      ),
      spelling: t(
        "**Mnemonic** begins with a silent *m*; **amnesia** has *-mnes-*; **reminiscent** has *-sc-*; **indelible** ends in *-ible*, not *-able*; **unforgettable** doubles the *t*.",
        "**mnemonic** 开头的 m 不发音；**amnesia** 中间是 -mnes-；**reminiscent** 中有 -sc-；**indelible** 结尾是 -ible，不是 -able；**unforgettable** 双写 t。",
      ),
    },
    notes: `
      amnesia|a man unable to remember his own name or his wife's face|a hero whose memory of his whole past is gone|lost memories that doctors hoped would return|amnesia is a loss of memory; hindsight is understanding after the event|amnesia 失忆；hindsight 事后的认识|hindsight is understanding that comes after an event, not a loss of memory|hindsight 指事后才有的认识，不是记忆丧失|memorabilia are objects kept as souvenirs, not a loss of memory|memorabilia 指纪念品，不是记忆丧失|am · ne · si · a|-mnes- in the middle, ending in -ia|中间是 -mnes-，结尾 -ia
      mnemonic|a sentence that helps pupils remember the musical notes|a little rhyme made up to remember the planets|a silly sentence from first letters that helps spelling|a mnemonic is a trick for remembering; amnesia is a loss of memory|mnemonic 助记方法；amnesia 失忆|amnesia is a loss of memory, the opposite of a trick that helps one remember|amnesia 指失忆，和帮助记忆的方法正相反|memorabilia are objects collected as souvenirs, not a rhyme or sentence for remembering|memorabilia 指收藏的纪念品，不是帮助记忆的顺口溜或句子|mne · mon · ic|the silent m at the start, then -nemonic|开头的 m 不发音，再接 -nemonic
      recollect|a man in his nineties remembering the day a war ended|searching one's memory for the number of a childhood home|a name known well at school that has slipped from memory|recollect means to remember with effort; ascertain means to find out|recollect 回忆起；ascertain 查明|ascertain means to find out something new for certain, not to bring back what one once knew|ascertain 指查明新的事实，不是想起曾经知道的东西|divulge means to reveal a secret to others, not to bring something back from one's own memory|divulge 指向别人泄露秘密，不是从自己的记忆中想起|rec · ol · lect|re- plus collect|re- 加 collect
      evocative|a photo that brought a whole childhood flooding back|music calling up pictures of the sea and memories of summer|the smell of pine bringing back memories of Christmas|evocative means bringing memories or feelings to mind; forgetful means apt to forget|evocative 唤起回忆的；forgetful 健忘的|forgetful means apt to forget, the opposite of bringing memories flooding back|forgetful 指健忘，和让回忆涌上心头正相反|indelible means impossible to remove, not calling up pictures and memories|indelible 指无法抹去，不是唤起画面和回忆|e · voc · a · tive|evoke changes k to c, then -ative|evoke 的 k 变成 c，再接 -ative
      indelible|a mark left by war that could never be removed|ink that no washing can take out|an impression nothing in fifty years could wipe away|indelible means impossible to remove; forgetful means apt to forget|indelible 无法抹去；forgetful 健忘|forgetful means apt to forget things, the opposite of a mark that can never be removed|forgetful 指健忘，和永远抹不掉的痕迹正相反|reminiscent means reminding one of something and is followed by of, not unable to be washed out|reminiscent 指使人联想起，后接 of，不是洗不掉|in · del · i · ble|in- plus del- plus -ible|in- 加 del- 再加 -ible
      reminiscent|a tune reminding everyone of their grandparents' village|a style calling the painters of Paris to mind|a smell bringing back a grandmother's kitchen|reminiscent means reminding one of something; indelible means impossible to remove|reminiscent 使人联想起；indelible 无法抹去|indelible means impossible to remove, and it is never followed by of|indelible 指无法抹去，后面从不接 of|forgetful means apt to forget, the opposite of reminding someone of something|forgetful 指健忘，和让人想起某事正相反|rem · i · nis · cent|-nisc- in the middle, then -ent|中间是 -nisc-，结尾 -ent
      forgetful|an uncle who loses his keys and never remembers where he parked|leaving the oven on and missing appointments|a waiter who never remembered an order|forgetful means apt to forget; unforgettable means impossible to forget|forgetful 健忘；unforgettable 难忘|reminiscent means reminding one of something, not a person who loses keys and misses appointments|reminiscent 指使人联想起，不是丢钥匙、误约的人|unforgettable means impossible to forget, the opposite of never remembering|unforgettable 指令人难忘，和从来记不住正相反|for · get · ful|forget plus -ful, with one l|forget 加 -ful，只有一个 l
      unforgettable|a week we will remember all our lives|a voice remembered for ever after one hearing|a night whose memory none of us will ever lose|unforgettable means impossible to forget; forgetful means apt to forget|unforgettable 难忘；forgetful 健忘|forgetful means apt to forget, the opposite of remembered all our lives|forgetful 指健忘，和终生难忘正相反|reminiscent means reminding one of something else and is followed by of, not remembered for ever|reminiscent 指使人联想起别的东西，后接 of，不是永远记得|un · for · get · ta · ble|un- plus forget, which doubles its t before -able|un- 加 forget，双写 t 再接 -able
      hindsight|knowing after a storm came that we should have left earlier|looking back, mistakes that seemed hidden at the time|a plan that seemed wise until it failed|hindsight is understanding after the event; amnesia is loss of memory|hindsight 事后的认识；amnesia 失忆|amnesia is a loss of memory, not the clearer understanding that comes later|amnesia 指失忆，不是事后才有的清醒认识|mnemonic is a trick for remembering, not understanding gained after an event|mnemonic 指助记方法，不是事后获得的认识|hind · sight|hind plus sight|hind 加 sight
      memorabilia|old shirts, signed balls and match tickets collected by a fan|medals, letters and helmets kept from battles|posters and props from famous movies|memorabilia are objects kept as souvenirs; a mnemonic is a trick for remembering|memorabilia 纪念品；mnemonic 助记方法|mnemonic is a rhyme or trick for remembering, not objects one collects|mnemonic 指帮助记忆的顺口溜或窍门，不是收藏的物品|hindsight is understanding after an event, not shirts, medals or posters|hindsight 指事后的认识，不是球衣、勋章或海报|mem · o · ra · bil · i · a|memorable drops its -le, then -ilia|memorable 去掉 -le，再接 -ilia
    `,
  },
);

const courage = batch(
  "words-of-daring-and-timidity",
  ["Words of Daring and Timidity", "勇敢与胆怯的词"],
  ["courage, recklessness and fear", "勇气、鲁莽和胆怯"],
  `
  dauntless|showing fearlessness and determination|无畏的，不屈不挠的|The ___ explorers crossed the ice for months, never afraid and never giving up.|She was a ___ fighter for justice, fearless and determined through years of threats.|With ___ courage, nothing able to frighten or stop him, he went back into the burning house.|timorous,cowardly|
  fearless|without fear|无所畏惧的|The ___ child climbed the tallest tree in the park without any fear at all.|She is a ___ reporter who walks into war zones without a trace of fear.|A ___ little dog, afraid of nothing, chased the bear away.|cowardly,timorous|fearlessly,fearlessness
  plucky|having courage and spirit, especially in a hard situation|有胆量的，勇敢的|The ___ little team, small and outmatched, bravely beat the champions.|A ___ girl, half his size, bravely stood up to the bully.|The ___ climber, full of spirit, kept going despite her injury.|spineless,fainthearted|pluck
  gutsy|showing courage and determination|有胆识的，勇敢的|It was a ___ decision to quit a safe job and start again, and it took real courage.|She gave a ___ performance, bravely playing on with an injured ankle.|The coach's ___ move, a brave gamble in the last minute, won them the game.|fainthearted,spineless|
  daring|willing to take bold risks|大胆的|The ___ rescue, a bold climb down the cliff in the dark, saved six lives.|She wore a ___ red dress, boldly breaking every rule of the formal dinner.|The thieves made a ___ escape, leaping boldly from the roof onto a moving train.|timorous,cowardly|daringly
  foolhardy|recklessly bold|有勇无谋的，鲁莽的|It was ___ to swim out in the storm, a reckless risk that nearly drowned him.|Their ___ plan, to cross the desert with no water or map, put everyone at risk.|Only a ___ climber would go up the mountain alone in winter, so reckless is the danger.|cowardly,timorous|
  timorous|showing or suffering from nervousness or lack of confidence|胆小的，羞怯的|A ___ voice, small and nervous, answered the door.|The ___ deer, nervous at every sound, fled into the trees.|She gave a ___ smile, too nervous and shy to say hello.|dauntless,gutsy|timorously
  fainthearted|lacking courage; timid|胆怯的|This horror film is not for the ___; timid viewers should stay away.|He was too ___ to complain, lacking the courage to speak to the manager.|On election day the ___ voters, timid and afraid of trouble, stayed at home.|gutsy,plucky|
  cowardly|lacking courage|怯懦的|It was a ___ attack, three armed men against one unarmed man from behind.|The ___ guard ran away the moment danger came, leaving the gate open.|He was ashamed of his ___ silence; he had lacked the courage to speak up.|fearless,plucky|coward,cowardice
  spineless|weak and lacking courage or determination|没骨气的，懦弱的|The ___ manager agreed with everyone, too weak to take a stand on anything.|They called the council ___ for giving in to every threat without a fight.|A ___ leader, lacking all backbone, won't stand up to bullies.|plucky,dauntless|
  `,
  "context-clues",
  {
    intro: t(
      "The **dauntless** captain led the rescue, the **plucky** cabin boy followed, and only the **cowardly** cook hid below, too **fainthearted** to help. These ten words help you describe courage, recklessness and fear.",
      "无畏的（**dauntless**）船长带头救援，有胆量的（**plucky**）小水手紧随其后，只有怯懦的（**cowardly**）厨子躲在舱底，胆小得（**fainthearted**）不敢帮忙。这十个词帮你描写勇气、鲁莽和胆怯。",
    ),
    watchOut: {
      meanings: t(
        "**Daring** is *bold*, often admired; **foolhardy** is bold in a *stupid, reckless* way; **plucky** is brave when *small or outmatched*; **dauntless** is brave and *never gives up*.",
        "**daring** 指*大胆*，常带赞许；**foolhardy** 指*愚蠢鲁莽*的大胆；**plucky** 指*弱小*却勇敢；**dauntless** 指勇敢且*永不放弃*。",
      ),
      use: t(
        "**Timorous** describes a *nervous, shy* manner, as in a timorous voice; **cowardly** describes *shameful* fear; **spineless** describes someone too weak to *take a stand*.",
        "**timorous** 形容*紧张羞怯*的样子，如 timorous voice；**cowardly** 形容*可耻*的怯懦；**spineless** 形容软弱得*不敢表态*的人。",
      ),
      spelling: t(
        "**Dauntless** has *aun*, as in daunt; **foolhardy** is *fool* plus *hardy*; **timorous** has *-mor-*; **fainthearted** is *faint* plus *hearted*.",
        "**dauntless** 中有 aun，同 daunt；**foolhardy** 是 fool 加 hardy；**timorous** 中间是 -mor-；**fainthearted** 是 faint 加 hearted。",
      ),
    },
    notes: `
      dauntless|explorers crossing the ice for months, never afraid and never giving up|a fighter for justice fearless through years of threats|courage that let a man go back into a burning house|dauntless means fearless and determined; timorous means nervous|dauntless 无畏坚定；timorous 胆小|timorous means nervous and lacking confidence, the opposite of never afraid|timorous 指胆小不自信，和从不害怕正相反|cowardly means lacking courage, the opposite of going back into a burning house|cowardly 指怯懦，和重返火场正相反|daunt · less|daunt plus -less, with a double s|daunt 加 -less，结尾双写 s
      fearless|a child climbing the tallest tree without any fear|a reporter walking into war zones without a trace of fear|a little dog afraid of nothing chasing a bear|fearless means without fear; cowardly means lacking courage|fearless 无所畏惧；cowardly 怯懦|cowardly means lacking courage, the opposite of afraid of nothing|cowardly 指怯懦，和无所畏惧正相反|timorous means nervous and timid, the opposite of without any fear|timorous 指胆小，和毫无畏惧正相反|fear · less|fear plus -less|fear 加 -less
      plucky|a small, outmatched team bravely beating the champions|a girl half the bully's size standing up to him|a climber full of spirit going on despite injury|plucky means brave when small or outmatched; spineless means weak and lacking courage|plucky 弱小却勇敢；spineless 没骨气|spineless means lacking courage, the opposite of bravely standing up to a bully|spineless 指没骨气，和勇敢地对抗恶霸正相反|fainthearted means timid, the opposite of full of spirit|fainthearted 指胆怯，和充满勇气正相反|pluck · y|pluck plus -y|pluck 加 -y
      gutsy|quitting a safe job to start again|playing on bravely with an injured ankle|a brave gamble in the last minute that won a game|gutsy means brave and determined; fainthearted means timid|gutsy 有胆识；fainthearted 胆怯|fainthearted means lacking courage, the opposite of a decision that took real courage|fainthearted 指胆怯，和需要真正勇气的决定正相反|spineless means weak and lacking courage, the opposite of a brave gamble|spineless 指懦弱，和勇敢地冒险一搏正相反|guts · y|guts plus -y|guts 加 -y
      daring|a bold climb down a cliff in the dark to rescue six people|a red dress boldly breaking the rules of a formal dinner|a bold leap from a roof onto a moving train|daring means boldly taking risks; timorous means nervous|daring 大胆；timorous 胆小|timorous means nervous and lacking confidence, the opposite of bold risks|timorous 指胆小不自信，和大胆冒险正相反|cowardly means lacking courage, the opposite of a bold leap onto a moving train|cowardly 指怯懦，和大胆跳上行驶的火车正相反|dar · ing|dare drops its e before -ing|dare 去掉 e 再加 -ing
      foolhardy|a reckless swim in a storm that nearly drowned a man|a plan to cross a desert with no water or map|a lone winter climb up a mountain|foolhardy means recklessly bold; cowardly means lacking courage|foolhardy 鲁莽；cowardly 怯懦|cowardly means lacking courage, the opposite of taking reckless risks|cowardly 指怯懦，和鲁莽冒险正相反|timorous means nervous and timid, the opposite of going up a mountain alone in winter|timorous 指胆小，和冬天独自登山正相反|fool · har · dy|fool plus hardy|fool 加 hardy
      timorous|a small, nervous voice answering a door|a deer nervous at every sound fleeing|a smile too nervous and shy to say hello|timorous means nervous and timid; dauntless means fearless|timorous 胆小；dauntless 无畏|dauntless means fearless and determined, the opposite of small and nervous|dauntless 指无畏坚定，和怯生生正相反|gutsy means brave and determined, the opposite of too nervous to say hello|gutsy 指有胆识，和紧张得不敢打招呼正相反|tim · or · ous|-mor- in the middle, then -ous|中间是 -mor-，结尾 -ous
      fainthearted|timid viewers warned away from a horror film|a man lacking the courage to complain to a manager|timid voters staying at home on election day|fainthearted means lacking courage; gutsy means brave|fainthearted 胆怯；gutsy 有胆识|gutsy means brave and determined, the opposite of timid and afraid of trouble|gutsy 指有胆识，和胆小怕事正相反|plucky means brave and full of spirit, the opposite of lacking courage to complain|plucky 指有胆量，和不敢投诉正相反|faint · heart · ed|faint plus hearted|faint 加 hearted
      cowardly|three armed men attacking one unarmed man from behind|a guard running away the moment danger came|a silence kept for lack of courage to speak up|cowardly means lacking courage; fearless means without fear|cowardly 怯懦；fearless 无所畏惧|fearless means without fear, the opposite of running away from danger|fearless 指无所畏惧，和一遇危险就逃正相反|plucky means brave and spirited, the opposite of attacking an unarmed man from behind|plucky 指有胆量，和从背后偷袭手无寸铁的人正相反|cow · ard · ly|coward plus -ly|coward 加 -ly
      spineless|a manager agreeing with everyone and taking no stand|a council giving in to every threat without a fight|a leader lacking backbone who won't face bullies|spineless means weak and lacking courage; plucky means brave|spineless 没骨气；plucky 有胆量|plucky means brave and spirited, the opposite of giving in without a fight|plucky 指有胆量，和不战而降正相反|dauntless means fearless and determined, the opposite of too weak to take a stand|dauntless 指无畏坚定，和软弱得不敢表态正相反|spine · less|spine plus -less, keeping the e|spine 加 -less，保留 e
    `,
  },
);

const beginnings = batch(
  "words-of-beginnings-and-endings",
  ["Words of Beginnings and Endings", "开端与终结的词"],
  ["how things start, peak and stop", "事物如何开始、达到顶点和停止"],
  `
  inception|the establishment or starting point of something|开端，创立|The club has grown from ten members to a thousand since its ___, when it was founded in 1990.|She has led the project from its ___, the very day it was set up.|At its ___, when it was first founded, the company had just two workers.|cessation,demise|
  genesis|the origin or creation of something|起源，创始|The ___ of the idea, where it first came from, was a chat at a dinner party.|The book traces the ___ of the war, explaining how and where it first began.|Few know the ___ of the song, which was born on a train journey in 1962.|demise,cessation|
  nascent|just beginning to exist and develop|新生的，初期的|The ___ industry, only two years old, needed support to grow.|Her ___ career, just starting out, was full of promise.|They backed the ___ democracy, born only months before, as it began to develop.|moribund,decrepit|
  incipient|in an early stage; beginning to happen|初期的，刚出现的|Doctors caught the ___ disease in its earliest stage, just as it began.|There were signs of ___ panic, fear just beginning to spread through the crowd.|A thin, ___ crack, only just starting to form, ran across the new wall.|moribund,decrepit|
  embryonic|in a very early stage of development|萌芽的，初期的|The plan is still at the ___ stage, little more than a first rough idea.|Her ___ idea, only a rough first sketch on a napkin, later grew into a business.|The ___ chick, still only half-formed, moved inside the egg.|moribund,decrepit|embryo
  outset|the start or beginning of something|开始，开端|She made her aims clear from the ___, on the very first day.|At the ___ of the season, nobody expected the team to win; by the end they were champions.|Problems arose at the ___, in the first hour of the journey.|advent,cessation|
  advent|the arrival of a notable person, thing or event|到来，出现|The ___ of the internet, arriving in every home, changed everything.|Before the ___ of cars, when they had not yet arrived, people rode horses.|The ___ of spring, arriving at last in April, brought flowers to the hills.|outset,demise|
  culminate|to reach a highest point or climax|达到顶点，以…告终|The tour will ___ in a grand concert in Rome, its highest point at the very end.|Years of hard work will ___ in this prize, the peak of her career.|Months of quarreling may ___ in a fight, the climax of all their anger.|atrophy,fluctuate|culminated,culmination
  cessation|the fact or process of ending|停止|They called for the ___ of fighting, an end to the war at last.|The ___ of rain, when it finally stopped after a week, brought relief.|Giving up smoking is good for you: the ___ of the habit, ending it for good, improves health at once.|inception,genesis|
  demise|the end of something; death|终结；死亡|The ___ of the local shop, closing after ninety years, saddened us all.|The king's ___, his death at sixty, led to war over the throne.|Online sales led to the ___ of many stores, which closed for good.|inception,advent|
  `,
  "context-clues",
  {
    intro: t(
      "From its **inception** in a garage, the **nascent** company grew fast; its success would **culminate** in a world-famous product, and only the **advent** of cheaper rivals brought its **demise**. These ten words help you describe how things start, reach their peak and come to an end.",
      "这家新生的（**nascent**）公司自从在车库里创立（**inception**）起就飞速成长；它的成功最终达到顶点（**culminate**），推出了一款享誉世界的产品，直到更便宜的对手出现（**advent**），它才走向终结（**demise**）。这十个词帮你描写事物如何开始、达到顶点和走向结束。",
    ),
    watchOut: {
      meanings: t(
        "**Inception** is when something is *founded*; **genesis** is where it *came from*; **outset** is simply *the start*; **advent** is the *arrival* of something important.",
        "**inception** 指某事物*创立*之时；**genesis** 指它*从何而来*；**outset** 就是*开头*；**advent** 指重要事物的*到来*。",
      ),
      use: t(
        "**Culminate** is followed by *in*: it culminated in a prize. **Cessation** is the *stopping* of an activity; **demise** is the *death* or end of a person or business.",
        "**culminate** 后接 *in*：culminated in a prize。**cessation** 指某种活动的*停止*；**demise** 指人或企业的*死亡*、终结。",
      ),
      spelling: t(
        "**Nascent** has *-sc-*; **incipient** has *-cip-*; **cessation** has a double *s*; **embryonic** has *-bry-*; **demise** ends in *-ise*.",
        "**nascent** 中有 -sc-；**incipient** 中间是 -cip-；**cessation** 双写 s；**embryonic** 中间是 -bry-；**demise** 结尾是 -ise。",
      ),
    },
    notes: `
      inception|a club founded in 1990 that grew to a thousand members|a project led from the very day it was set up|a company with just two workers when first founded|inception is the founding of something; cessation is its stopping|inception 创立；cessation 停止|cessation means ending or stopping, the opposite of being founded|cessation 指停止，和创立正相反|demise means the end or death of something, the opposite of the day it was set up|demise 指终结或死亡，和创立之日正相反|in · cep · tion|in- plus -ception, as in reception|in- 加 -ception，同 reception
      genesis|a dinner-party chat where an idea first came from|how and where a war first began|a song born on a train journey|genesis is the origin of something; demise is its end|genesis 起源；demise 终结|demise means the end of something, the opposite of where it first came from|demise 指终结，和起源正相反|cessation means stopping, the opposite of how something first began|cessation 指停止，和最初怎样开始正相反|gen · e · sis|gen- as in generate, then -esis|gen- 同 generate，结尾 -esis
      nascent|an industry only two years old needing support to grow|a career just starting out|a democracy born months before and beginning to develop|nascent means just beginning to develop; moribund means close to death|nascent 新生的；moribund 垂死的|moribund means close to death, the opposite of just starting out|moribund 指垂死、衰败，和刚刚起步正相反|decrepit means old and in poor condition, the opposite of only two years old|decrepit 指老朽破败，和才两岁正相反|na · scent|na- plus -scent, as in scent|na- 加 -scent，同 scent
      incipient|a disease caught in its earliest stage|fear just beginning to spread through a crowd|a crack just starting to form on a new wall|incipient means just beginning to happen; moribund means close to its end|incipient 刚出现的；moribund 垂死的|moribund means close to death or ending, the opposite of just beginning|moribund 指濒临终结，和刚刚开始正相反|decrepit means old and worn out, the opposite of just starting on a new wall|decrepit 指老旧破败，和新墙上刚出现的裂缝正相反|in · cip · i · ent|-cip- in the middle, then -ient|中间是 -cip-，结尾 -ient
      embryonic|a plan that is little more than a first rough idea|a rough first sketch on a napkin that grew into a business|a half-formed chick inside an egg|embryonic means at a very early stage; decrepit means old and worn out|embryonic 萌芽的；decrepit 老朽的|moribund means close to death, the opposite of only a first rough idea|moribund 指垂死，和刚有雏形正相反|decrepit means old and worn out, the opposite of still half-formed|decrepit 指老朽破败，和尚未成形正相反|em · bry · on · ic|embryo plus -nic|embryo 加 -nic
      outset|aims made clear on the very first day|a season nobody expected the team to win at its start|problems in the first hour of a journey|the outset is the start; cessation is the stopping|outset 开头；cessation 停止|advent is the arrival of something important, not the start of one's own task or journey|advent 指重要事物的到来，不是自己做事或旅程的开头|cessation means stopping, the opposite of the very first day|cessation 指停止，和第一天正相反|out · set|out plus set|out 加 set
      advent|the internet arriving in every home|the time before cars had arrived|spring arriving at last in April|advent is the arrival of something; demise is its end|advent 到来；demise 终结|outset is the start of an activity, not the arrival of a new invention or season|outset 指某项活动的开头，不是新发明或新季节的到来|demise means the end or death of something, the opposite of its arrival|demise 指终结，和到来正相反|ad · vent|ad- plus vent|ad- 加 vent
      culminate|a tour ending with a grand concert as its highest point|years of work reaching their peak in a prize|months of quarreling reaching their climax in a fight|culminate means to reach a peak; atrophy means to waste away|culminate 达到顶点；atrophy 萎缩|atrophy means to waste away from lack of use, the opposite of reaching a peak|atrophy 指因不用而萎缩，和达到顶点正相反|fluctuate means to rise and fall irregularly, not to reach a final highest point|fluctuate 指起伏不定，不是达到最终的顶点|cul · mi · nate|cul- plus -minate|cul- 加 -minate
      cessation|an end to a war at last|rain finally stopping after a week|giving up smoking for good|cessation is the stopping of something; inception is its founding|cessation 停止；inception 创立|inception means the founding or start of something, the opposite of its ending|inception 指创立、开端，和终止正相反|genesis means the origin of something, the opposite of its stopping|genesis 指起源，和停止正相反|ces · sa · tion|cease drops -ase, then a double s and -ation|cease 变成 cess-，双写 s 再接 -ation
      demise|a local shop closing after ninety years|a king's death at sixty that led to war|stores closing for good because of online sales|demise is the end or death of something; inception is its founding|demise 终结；inception 创立|inception means the founding of something, the opposite of closing after ninety years|inception 指创立，和九十年后关门正相反|advent means the arrival of something, the opposite of its death or closing|advent 指到来，和死亡或关闭正相反|de · mise|de- plus -mise, ending in -ise|de- 加 -mise，结尾 -ise
    `,
  },
);

const cunning = batch(
  "words-of-wit-and-wiles",
  ["Words of Wit and Wiles", "智慧与诡计的词"],
  ["wise judgment and dishonest cunning", "明智的判断与不诚实的狡诈"],
  `
  conniving|secretly planning to do something harmful or illegal|暗中策划的，纵容的|The ___ servant secretly plotted for months and then stole the old man's will.|Her ___ cousin, plotting in secret, schemed to cheat her out of the farm.|He was a ___ and greedy man, always secretly planning some harmful trick.|sagacious,judicious|connive,connived
  astute|good at judging situations and turning them to one's advantage|精明的，敏锐的|She is a shrewd, ___ investor who judges every market well and always profits honestly.|His comment was ___, a sharp, accurate judgment of what was really going on.|The ___ lawyer judged the situation quickly, saw the trap and turned it to her client's advantage, all within the rules.|devious,conniving|astutely
  judicious|having or showing good judgment|明智的，审慎的|The cook's ___ use of salt, just the right amount, improved the dish.|She made a ___ choice of words, wise and careful, so that no one was offended.|It would be ___ to wait for the storm to pass; that is the sensible course.|conniving,devious|judiciously
  crafty|clever at getting what one wants, often by deceit|狡猾的|The ___ thief tricked the guard with a false uniform and walked out with the jewels.|That was a ___ trick, cleverly deceiving the guard to get past him.|The ___ old fox lied about where he had hidden the money, fooling everyone.|judicious,sagacious|craftily
  artful|clever in a cunning way; skillfully done|狡诈的；巧妙的|The ___ dodger slipped away through the crowd, cunningly tricking his way past the police.|The flowers were set out in an arrangement so ___, so skillfully made, that it looked like a painting.|He gave an answer that was ___, cunningly worded so that it told us nothing at all.|sagacious,judicious|artfully
  canny|shrewd and careful, especially in money or business|精明谨慎的|The ___ shopper waits for the sales, careful and shrewd with every penny, and buys honestly at the lowest price.|The ___ farmer, careful with money, saved in good years for the hard ones.|She made a ___ choice of business partner, shrewd and careful, picking an honest man with money.|conniving,devious|
  devious|showing a skillful use of underhanded tactics|不光明正大的，迂回的|He had a ___ plan to get rich, using lies and tricks behind everyone's back.|She used ___ means to win, cheating in secret and blaming others.|They took a ___ route, winding through back streets in an underhanded attempt to avoid the police.|sagacious,judicious|deviously
  scheming|making secret, dishonest plans|诡计多端的，阴险的|The ___ uncle made secret, dishonest plans to steal the throne from his nephew.|Her ___ cousin lied to everyone, plotting in secret to get the house.|They were sick of his ___ ways, his endless dishonest plots behind their backs.|canny,judicious|schemer
  perspicacious|having a ready insight into things; quick to understand|敏锐的，有洞察力的|The ___ critic saw the flaw at once, quick to understand what others had missed.|A ___ teacher, quick to see what lay beneath the surface, noticed her hidden talent.|The report was ___, showing sharp, honest insight into the causes of the crisis.|devious,conniving|perspicacity
  sagacious|having keen judgment and wisdom|睿智的，有远见的|The ___ elder settled the dispute fairly, with the wisdom of long years.|It was a ___ decision, wise and far-sighted, and it saved the company.|A ___ owl in the story gives honest, wise advice to all the other animals.|conniving,scheming|sagacity
  `,
  "context-clues",
  {
    intro: t(
      "The **sagacious** queen saw through the **scheming** duke at once; her **astute** adviser exposed his **devious** plot, and his **crafty** lies came to nothing. These ten words help you describe wise judgment and dishonest cunning.",
      "睿智的（**sagacious**）女王一眼就看穿了诡计多端的（**scheming**）公爵；她精明的（**astute**）谋士揭穿了他不光明正大的（**devious**）阴谋，他狡猾的（**crafty**）谎言也就落了空。这十个词帮你描写明智的判断和不诚实的狡诈。",
    ),
    watchOut: {
      meanings: t(
        "**Astute**, **canny**, **judicious**, **perspicacious** and **sagacious** praise *good judgment*; **conniving**, **crafty**, **devious** and **scheming** describe *dishonest* cleverness.",
        "**astute**、**canny**、**judicious**、**perspicacious** 和 **sagacious** 赞扬*判断力强*；**conniving**、**crafty**、**devious** 和 **scheming** 形容*不诚实*的聪明。",
      ),
      use: t(
        "**Artful** can blame or praise: an artful dodger is *cunning*, an artful arrangement is *skillful*. **Devious** can also describe a route that is *winding*, not direct.",
        "**artful** 可褒可贬：artful dodger 是*狡猾*的，artful arrangement 是*巧妙*的。**devious** 还可形容*迂回曲折*、不直接的路线。",
      ),
      spelling: t(
        "**Perspicacious** ends in *-acious*, with *-spic-* in the middle; **sagacious** has *-gac-*; **conniving** has a double *n*; **judicious** has *-dic-*.",
        "**perspicacious** 结尾是 -acious，中间是 -spic-；**sagacious** 中间是 -gac-；**conniving** 双写 n；**judicious** 中间是 -dic-。",
      ),
    },
    notes: `
      conniving|a servant plotting for months and then stealing a will|a cousin scheming in secret to cheat her out of a farm|a greedy man always secretly planning harmful tricks|conniving means secretly planning harm; sagacious means wise|conniving 暗中算计；sagacious 睿智|sagacious means wise and fair in judgment, the opposite of secretly plotting harm|sagacious 指睿智公正，和暗中谋害正相反|judicious means showing good, sensible judgment, the opposite of stealing a will|judicious 指明智审慎，和偷遗嘱正相反|con · niv · ing|the double n, then -iving|双写 n，再接 -iving
      astute|an investor who judges every market well and profits honestly|a sharp, accurate judgment of what was really going on|a lawyer who saw a trap and turned it to her client's advantage within the rules|astute means shrewd and good at judging; devious means underhanded|astute 精明敏锐；devious 不光明正大|devious means using underhanded tricks, the opposite of profiting honestly within the rules|devious 指使用不正当手段，和正当获利、守规矩正相反|conniving means secretly plotting harm, the opposite of an accurate, honest judgment|conniving 指暗中算计害人，和准确诚实的判断正相反|as · tute|as- plus -tute|as- 加 -tute
      judicious|just the right amount of salt improving a dish|a wise, careful choice of words that offended no one|the sensible course of waiting for a storm to pass|judicious means showing good judgment; conniving means plotting harm|judicious 明智审慎；conniving 暗中算计|conniving means secretly plotting harm, the opposite of a wise, careful choice|conniving 指暗中算计害人，和明智慎重的选择正相反|devious means underhanded, the opposite of the sensible course|devious 指不光明正大，和明智的做法正相反|ju · di · cious|-dic- in the middle, then -ious|中间是 -dic-，结尾 -ious
      crafty|a thief tricking a guard with a false uniform|a trick cleverly deceiving a guard to get past him|an old fox lying about where he hid the money|crafty means clever by deceit; judicious means showing good judgment|crafty 狡猾；judicious 明智|judicious means wise and sensible, not clever by deceiving a guard|judicious 指明智审慎，不是靠骗过守卫耍聪明|sagacious means wise and fair, the opposite of lying and fooling everyone|sagacious 指睿智公正，和撒谎骗人正相反|craft · y|craft plus -y|craft 加 -y
      artful|a dodger cunningly tricking his way past the police|flowers so skillfully arranged they looked like a painting|a cunningly worded answer that told us nothing|artful means cunning or skillful; sagacious means wise|artful 狡诈或巧妙；sagacious 睿智|sagacious means wise and far-sighted, not cunningly tricking or skillfully arranging|sagacious 指睿智有远见，不是狡猾地耍花招或巧妙地布置|judicious means showing good judgment, not cunning wording that tells nothing|judicious 指明智审慎，不是用狡猾的措辞什么都不透露|art · ful|art plus -ful, with one l|art 加 -ful，只有一个 l
      canny|a shopper careful with every penny buying honestly at the lowest price|a farmer saving in good years for hard ones|a shrewd choice of an honest business partner|canny means shrewd and careful with money; devious means underhanded|canny 精明谨慎；devious 不光明正大|conniving means secretly plotting harm, the opposite of buying honestly|conniving 指暗中算计害人，和诚实购物正相反|devious means using lies and tricks, the opposite of picking an honest partner carefully|devious 指耍诡计，和谨慎地挑选诚实的伙伴正相反|can · ny|can plus a double n, then -y|can 双写 n，再加 -y
      devious|a plan to get rich using lies and tricks behind everyone's back|winning by cheating in secret and blaming others|a winding route through back streets to dodge the police|devious means underhanded; sagacious means wise|devious 不光明正大；sagacious 睿智|sagacious means wise and fair, the opposite of lies and tricks|sagacious 指睿智公正，和耍诡计正相反|judicious means showing good judgment, the opposite of cheating in secret|judicious 指明智审慎，和暗中作弊正相反|de · vi · ous|de- plus via plus -ous|de- 加 via 再加 -ous
      scheming|an uncle making secret, dishonest plans to steal a throne|a cousin lying and plotting in secret for a house|endless dishonest plots behind people's backs|scheming means making dishonest plans; canny means shrewd and careful|scheming 诡计多端；canny 精明谨慎|canny means shrewd and careful, especially with money, not plotting to steal a throne|canny 指精明谨慎，尤其在钱财上，不是密谋篡位|judicious means showing good judgment, the opposite of lying to everyone|judicious 指明智审慎，和对所有人撒谎正相反|schem · ing|scheme drops its e before -ing|scheme 去掉 e 再加 -ing
      perspicacious|a critic seeing at once a flaw others had missed|a teacher noticing a hidden talent beneath the surface|a report with sharp, honest insight into a crisis|perspicacious means quick to see and understand; devious means underhanded|perspicacious 敏锐有洞察力；devious 不光明正大|devious means using underhanded tricks, not quick to see what others missed|devious 指使用不正当手段，不是能看出别人没看出的东西|conniving means secretly plotting harm, the opposite of noticing a talent and helping it|conniving 指暗中算计害人，和发现并欣赏才华正相反|per · spi · ca · cious|per- plus -spic- plus -acious|per- 加 -spic- 再加 -acious
      sagacious|an elder settling a dispute fairly with long years of wisdom|a wise, far-sighted decision that saved a company|an owl giving honest, wise advice to other animals|sagacious means wise and far-sighted; scheming means plotting dishonestly|sagacious 睿智；scheming 诡计多端|conniving means secretly plotting harm, the opposite of settling a dispute fairly|conniving 指暗中算计害人，和公正地调解纠纷正相反|scheming means making dishonest plans, the opposite of giving honest, wise advice|scheming 指搞阴谋诡计，和给出诚恳明智的建议正相反|sa · ga · cious|-gac- in the middle, then -ious|中间是 -gac-，结尾 -ious
    `,
  },
);

const likeness = batch(
  "words-of-likeness-and-difference",
  ["Words of Likeness and Difference", "相似与差异的词"],
  ["how alike or how different things are", "事物有多相似或多不同"],
  `
  analogous|comparable in certain respects|类似的|The heart is ___ to a pump, working in much the same way to push fluid around.|The two cases are ___, alike in almost every important respect.|A problem ___ to ours, much the same in its causes, arose in Spain last year.|disparate,divergent|
  akin|of similar character; related|类似的，同族的|Her feeling was ___ to fear, very like it though not quite the same.|Music is ___ to language, sharing many of its features.|What he did was ___ to theft, so close to it that the difference hardly mattered.|divergent,disparate|
  disparate|essentially different in kind; not able to be compared|迥然不同的|The book joins ___ ideas from physics, poetry and cooking, which have nothing in common.|They come from ___ backgrounds, one a prince and the other a fisherman's son.|The team was made of ___ groups, farmers, bankers and poets with nothing in common.|homogeneous,congruent|
  homogeneous|of the same kind; alike throughout|同质的，均匀的|The village was a ___ community, its people all of the same faith, trade and family.|Mix the paint until it is ___, the same color all the way through.|The class is a ___ group: all the same age, all from the same street.|heterogeneous,dissimilar|homogeneity
  heterogeneous|made up of different kinds|异质的，混杂的|The city has a ___ population, made up of people from a hundred different countries.|It is a ___ collection of essays on many different subjects, from war to gardening.|The rock is ___ in texture, a mixture of many different minerals.|homogeneous,kindred|heterogeneity
  divergent|tending to be different or develop in different directions|分歧的，不同的|They hold ___ views on the matter, which move further apart every year.|Over the centuries the two languages became ___, developing in different directions from one parent.|Their ___ paths led them apart, one to the city and the other to the sea.|congruent,akin|
  congruent|in agreement or harmony; identical in shape and size|一致的；全等的|The two triangles are ___, exactly the same in shape and size.|His actions were ___ with his words; he did exactly what he said.|Our goals are ___, in perfect agreement, so we can work together.|divergent,disparate|congruence
  dissimilar|not alike; different|不同的，不相似的|The twins are quite ___, one tall and loud, the other short and quiet.|We had ___ tastes in music: she loved opera and I loved rock.|The two plans are ___ in every way, sharing neither aims nor methods.|homogeneous,analogous|dissimilarity
  kindred|similar in kind; related|相似的；有亲缘关系的|They were ___ spirits, liking the same books and laughing at the same jokes.|Physics and chemistry are ___ subjects, closely related and alike in many ways.|She felt a ___ bond with the poet, as if they shared the same heart.|disparate,divergent|
  semblance|the outward appearance of something, often hiding something else|外观，表象|After the flood the town had only the ___ of normal life: shops open, but nothing really as before.|There was not the slightest ___ of order, not even the outward look of it.|He tried to keep up the ___ of calm, an outward show, though inside he was terrified.|pandemonium,bedlam|
  `,
  "context-clues",
  {
    intro: t(
      "The two villages looked **analogous** from the road, but one was a **homogeneous** farming town while the other had a **heterogeneous** crowd from many lands, with **divergent** customs. These ten words help you describe how alike or how different things are.",
      "从路上看，两个村子颇为类似（**analogous**），可一个是同质的（**homogeneous**）农庄，另一个却住着来自各地、成分混杂的（**heterogeneous**）人群，风俗各不相同（**divergent**）。这十个词帮你描写事物有多相似或多不同。",
    ),
    watchOut: {
      meanings: t(
        "**Homogeneous** means *all the same kind*; **heterogeneous** means *made of many kinds*; **disparate** means so different they *cannot be compared*; **divergent** means *moving apart*.",
        "**homogeneous** 指*全是同一类*；**heterogeneous** 指*由多种成分组成*；**disparate** 指差别大到*无法比较*；**divergent** 指*越走越远*、分歧扩大。",
      ),
      use: t(
        "**Analogous** and **akin** are followed by *to*: akin to fear; **congruent** is followed by *with*. A **semblance** is only an *outward appearance*, often hiding the truth.",
        "**analogous** 和 **akin** 后接 *to*：akin to fear；**congruent** 后接 *with*。**semblance** 只是*表面样子*，常常掩盖着真相。",
      ),
      spelling: t(
        "**Homogeneous** and **heterogeneous** end in *-eous*; **disparate** has *-par-*; **dissimilar** has a double *s*; **semblance** ends in *-ance*.",
        "**homogeneous** 和 **heterogeneous** 结尾都是 -eous；**disparate** 中间是 -par-；**dissimilar** 双写 s；**semblance** 结尾是 -ance。",
      ),
    },
    notes: `
      analogous|a heart working in much the same way as a pump|two cases alike in almost every important respect|a problem in Spain much the same in its causes|analogous means comparable; disparate means utterly different|analogous 类似；disparate 迥然不同|disparate means completely different in kind, the opposite of working in much the same way|disparate 指本质上完全不同，和运作方式大致相同正相反|divergent means moving apart and becoming different, the opposite of alike in almost every respect|divergent 指分歧、越走越远，和几乎方方面面都相似正相反|a · nal · o · gous|analogy changes -gy to -gous|analogy 的 -gy 变成 -gous
      akin|a feeling very like fear though not quite the same|music sharing many features of language|an act so close to theft the difference hardly mattered|akin means similar or related; divergent means moving apart|akin 类似；divergent 分歧|divergent means developing in different directions, the opposite of very like something|divergent 指朝不同方向发展，和非常相似正相反|disparate means completely different in kind, the opposite of sharing many features|disparate 指截然不同，和有许多共同点正相反|a · kin|a- plus kin, as in kinship|a- 加 kin，同 kinship
      disparate|ideas from physics, poetry and cooking with nothing in common|a prince and a fisherman's son|a team of farmers, bankers and poets with nothing in common|disparate means utterly different; homogeneous means all the same kind|disparate 迥然不同；homogeneous 同质|homogeneous means all of the same kind, the opposite of having nothing in common|homogeneous 指全是同一类，和毫无共同之处正相反|congruent means in agreement or identical, the opposite of a prince and a fisherman's son|congruent 指一致或全等，和王子与渔夫之子正相反|dis · par · ate|dis- plus -par- plus -ate|dis- 加 -par- 再加 -ate
      homogeneous|a village of people all of the same faith, trade and family|paint the same color all the way through|a class all the same age and from the same street|homogeneous means all the same kind; heterogeneous means made of many kinds|homogeneous 同质；heterogeneous 异质混杂|heterogeneous means made up of many different kinds, the opposite of all the same|heterogeneous 指由多种成分组成，和全都一样正相反|dissimilar means not alike, the opposite of the same color all the way through|dissimilar 指不相似，和从里到外颜色一致正相反|ho · mo · ge · ne · ous|homo- for same, then -geneous|homo- 表示“相同”，再接 -geneous
      heterogeneous|a city of people from a hundred different countries|essays on many different subjects from war to gardening|rock made of a mixture of many different minerals|heterogeneous means made of many kinds; homogeneous means all one kind|heterogeneous 异质混杂；homogeneous 同质|homogeneous means all of the same kind, the opposite of a hundred different countries|homogeneous 指全是同一类，和来自上百个国家正相反|kindred means similar and related, the opposite of a mixture of many different things|kindred 指相似、相关，和多种不同成分的混合正相反|het · er · o · ge · ne · ous|hetero- for different, then -geneous|hetero- 表示“不同”，再接 -geneous
      divergent|views moving further apart every year|two languages developing in different directions from one parent|paths leading two people apart to the city and the sea|divergent means moving apart; congruent means in agreement|divergent 分歧；congruent 一致|congruent means in agreement or identical, the opposite of moving further apart|congruent 指一致或全等，和越来越远正相反|akin means similar or related, the opposite of developing in different directions|akin 指相似、相关，和朝不同方向发展正相反|di · ver · gent|di- plus verge plus -nt, with a soft g|di- 加 verge 再加 -nt，g 读软音
      congruent|two triangles exactly the same in shape and size|actions matching words exactly|goals in perfect agreement|congruent means in agreement or identical; divergent means moving apart|congruent 一致或全等；divergent 分歧|divergent means moving apart and becoming different, the opposite of perfect agreement|divergent 指分歧，和完全一致正相反|disparate means utterly different in kind, the opposite of exactly the same shape and size|disparate 指截然不同，和形状大小完全相同正相反|con · gru · ent|con- plus -gru- plus -ent|con- 加 -gru- 再加 -ent
      dissimilar|twins, one tall and loud, the other short and quiet|a love of opera against a love of rock|two plans sharing neither aims nor methods|dissimilar means not alike; analogous means comparable|dissimilar 不相似；analogous 类似|homogeneous means all of the same kind, the opposite of one tall and one short|homogeneous 指全是同一类，和一高一矮正相反|analogous means comparable in some respects, the opposite of sharing nothing|analogous 指在某些方面相似，和毫无共同之处正相反|dis · sim · i · lar|dis- plus similar, with a double s|dis- 加 similar，双写 s
      kindred|two people liking the same books and laughing at the same jokes|physics and chemistry closely related and alike|a bond with a poet as if sharing the same heart|kindred means similar or related; disparate means utterly different|kindred 相似、相关；disparate 迥然不同|disparate means completely different in kind, the opposite of liking the same books|disparate 指截然不同，和喜欢同样的书正相反|divergent means moving apart, the opposite of closely related and alike|divergent 指分歧，和密切相关、彼此相似正相反|kin · dred|kin plus -dred|kin 加 -dred
      semblance|a town with only the outward look of normal life after a flood|not even the outward look of order|an outward show of calm hiding terror|a semblance is an outward appearance; pandemonium is wild chaos|semblance 外表、表象；pandemonium 一片混乱|pandemonium is wild and noisy chaos, not an outward appearance of order or calm|pandemonium 指喧闹的大混乱，不是秩序或平静的表象|bedlam is a scene of uproar and confusion, not an outward look that hides something|bedlam 指喧嚣混乱的场面，不是掩盖真相的外表|sem · blance|sem- plus -blance, ending in -ance|sem- 加 -blance，结尾 -ance
    `,
  },
);

/** batchesH are the batches of battle, calming and defiance, talk, rapture and gloom, memory, daring, beginnings, wiles and likeness. */
export const batchesH: readonly BatchSpec[] = [war, peace, talk, joy, memory, courage, beginnings, cunning, likeness];
