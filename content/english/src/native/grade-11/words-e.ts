// Grade 11: the batches of words of company and candor, of leanings and whims, of the relentless and the calm, of
// trimming and padding writing, of means that work, of yielding and resisting, of dark times and of the everyday.

import { t } from "@ga/content";
import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const company = batch(
  "words-of-company-and-candor",
  ["Words of Company and Candor", "相处与坦率的词"],
  ["getting along, falling out and speaking plainly", "相处融洽、闹翻与直言"],
  `
  camaraderie|mutual trust and friendship among people who spend time together|友情，同志情谊|There was great ___ among the soldiers, who trusted and protected one another after months together.|The team's ___, the warm friendship built over long seasons, helped them win.|After she retired, she missed the ___ of the office, the jokes and loyalty she shared with her colleagues.|animosity,squabble|
  rapport|a close relationship in which people understand each other|融洽的关系|The teacher has a warm ___ with her class, understanding each pupil and being understood in return.|With the clients he quickly built the kind of ___ that made them feel he truly understood what they wanted.|Though they worked side by side, there was no ___ between them; neither ever understood the other.|animosity,candor|
  squabble|a noisy quarrel about something trivial; to quarrel in this way|口角，争吵|The children began to ___ over the toy, bickering noisily about who had it first.|The two brothers still ___ about silly things, such as who gets the front seat.|Neighbors often ___ about parking, shouting over a few feet of street.|antagonize,condone|squabbled,squabbling
  contentious|causing or likely to cause an argument|有争议的；好争论的|The issue of the new road is ___, sure to start a heated argument at any town meeting.|The meeting was ___, full of angry debate from start to finish.|By nature he is ___, a man who loves to argue and picks a fight over every point.|demure,amicable|contentiously
  antagonize|to make someone hostile|使对立，惹恼|Don't ___ the neighbors by playing loud music at night; you will turn them against us.|His rude remarks will ___ the voters, making them hostile to his whole party.|She did not want to ___ her boss, so she kept her angry thoughts to herself.|allay,condone|antagonized
  decorum|behavior in keeping with good taste and propriety|礼仪，端庄得体|The judge demanded ___ in the court: silence, respect and proper behavior from all.|They behaved with ___ at the funeral, dressed in black and speaking softly as was proper.|He ignored all ___, shouting and laughing during the solemn ceremony.|candor,levity|decorous
  demure|reserved, modest and shy, especially of a woman|端庄的，娴静的|She gave a shy, ___ smile and lowered her eyes when they praised her.|The ___ girl sat quietly in the corner, too modest to speak unless asked.|Her quiet, ___ dress, plain and modest, suited the solemn occasion.|boisterous,brazen|demurely
  candor|the quality of being open and honest|坦率，坦诚|I appreciate your ___; thank you for telling me honestly what you think.|She spoke with surprising ___, openly admitting every mistake she had made.|His ___, his plain and honest answers, won the voters' trust.|chicanery,levity|
  condone|to accept or allow behavior that is wrong|宽恕，纵容|Some parents ___ cheating, quietly letting their children copy homework without a word of blame.|By saying nothing, the manager seemed to ___ the rudeness, allowing it to go on.|No decent person can ___ cruelty, accepting it as if it were fine.|antagonize,denounce|condoned
  facetious|treating serious issues with inappropriate humor|不合时宜地开玩笑的|Don't be ___; this is serious, so stop making jokes.|His ___ remark at the funeral, a joke about the dead man's debts, shocked the mourners.|Her ___ answer, a silly joke in reply to a serious question, annoyed the teacher.|demure,contentious|facetiously
  `,
  "context-clues",
  {
    intro: t(
      "The friends had a close **rapport**, but one **contentious** question started a **squabble**; a **facetious** joke made it worse, and only her **candor** in saying sorry restored their **camaraderie**. These ten words help you describe getting along, falling out and speaking plainly.",
      "这几个朋友关系一向融洽（**rapport**），但一个有争议的（**contentious**）问题引发了一场口角（**squabble**）；一个不合时宜的（**facetious**）玩笑让情况更糟，直到她坦率地（**candor**）道歉，大家的友情（**camaraderie**）才得以恢复。这十个词帮你描写相处、闹翻与直言。",
    ),
    watchOut: {
      meanings: t(
        "**Camaraderie** is the trust and friendship of a *group*; **rapport** is mutual *understanding* between people; **candor** is honesty, which can be *rude* as well as kind.",
        "**camaraderie** 是一个*群体*的信任与友情；**rapport** 是人与人之间的相互*理解*；**candor** 是坦诚，可能*刺耳*也可能友善。",
      ),
      use: t(
        "**Condone** means to *allow* wrong behavior, not to forgive a person; **antagonize** means to *make* someone hostile. **Decorum** is proper behavior; **demure** describes a *person* who is quiet and modest.",
        "**condone** 是*纵容*错误行为，不是原谅某人；**antagonize** 是*使*某人产生敌意。**decorum** 是得体的举止；**demure** 形容安静端庄的*人*。",
      ),
      spelling: t(
        "Watch the *-erie* of **camaraderie**, the silent *t* of **rapport**, the double *b* of **squabble**, and the *-cetious* of **facetious**.",
        "注意 **camaraderie** 的 -erie、**rapport** 里不发音的 t、**squabble** 的双写 b，以及 **facetious** 的 -cetious。",
      ),
    },
    notes: `
      camaraderie|soldiers who trusted and protected one another after months together|warm friendship built over long seasons|jokes and loyalty shared with colleagues|camaraderie is group friendship; animosity is hostility|camaraderie 是同伴情谊；animosity 是敌意|animosity means strong hostility, the opposite of trust and protection|animosity 指强烈的敌意，和相互信任保护正相反|squabble is a noisy quarrel, not warm friendship and loyalty|squabble 是吵闹的口角，不是温暖的友情与忠诚|cam · a · ra · de · rie|camarade plus -rie, with the -erie ending|camarade 加 -rie，结尾是 -erie
      rapport|a teacher understanding each pupil and being understood|clients who felt a man truly understood them|two coworkers who never understood each other|rapport is mutual understanding; candor is honest speech|rapport 是相互理解；candor 是坦诚直言|animosity means strong hostility, not mutual understanding|animosity 指强烈的敌意，不是相互理解|candor is honest, open speech, not a relationship of understanding|candor 是坦率的话语，不是彼此理解的关系|rap · port|the double p and a silent final t|双写 p，结尾 t 不发音
      squabble|children bickering noisily over a toy|brothers quarreling about the front seat|neighbors shouting over a few feet of street|squabble quarrels over small things; antagonize makes someone hostile|squabble 为小事争吵；antagonize 使人敌对|antagonize means to make someone hostile, not to bicker together over a toy or a seat|antagonize 指使人产生敌意，不是一起为玩具或座位争吵|condone means to allow wrong behavior, not to quarrel noisily|condone 指纵容错误，不是吵闹争执|squab · ble|the double b and the -ble ending|双写 b，结尾是 -ble
      contentious|a road issue sure to start heated argument|a meeting full of angry debate|a man who picks a fight over every point|contentious causes argument; amicable is friendly|contentious 引起争论；amicable 友好|demure means quiet and modest, the opposite of a man who picks fights|demure 指安静端庄，和爱挑事的人正相反|amicable means friendly and without quarrel, the opposite of angry debate|amicable 指友好和睦，和愤怒的争论正相反|con · ten · tious|the -tious ending, as in ambitious|结尾是 -tious，同 ambitious
      antagonize|loud music at night turning neighbors against us|rude remarks making voters hostile to a party|keeping angry thoughts to oneself so as not to anger a boss|antagonize makes someone hostile; allay calms them|antagonize 使人敌对；allay 安抚|allay means to calm fears or anger, the opposite of turning people against you|allay 指平息恐惧或怒气，和使人与你作对正相反|condone means to allow wrong behavior, not to make someone hostile|condone 指纵容错误，不是使人产生敌意|an · tag · o · nize|antagon- plus -ize|antagon- 加 -ize
      decorum|silence, respect and proper behavior demanded by a judge|black clothes and soft voices at a funeral|shouting and laughing during a solemn ceremony|decorum is proper behavior; levity is unsuitable humor|decorum 是得体的举止；levity 是不合时宜的轻浮|candor is honest speech, not silence and proper behavior|candor 是坦率直言，不是安静和得体的举止|levity means joking at a serious time, the opposite of proper, solemn behavior|levity 指在严肃场合开玩笑，和庄重得体正相反|de · co · rum|de- plus cor- plus -um|de- 加 cor- 再加 -um
      demure|a shy smile with lowered eyes|a girl too modest to speak unless asked|a plain, modest dress for a solemn occasion|demure is quiet and modest; brazen is bold and shameless|demure 端庄腼腆；brazen 厚颜无耻|boisterous means noisy and energetic, the opposite of sitting quietly in a corner|boisterous 指喧闹活跃，和安静地坐在角落正相反|brazen means bold without shame, the opposite of shy and modest|brazen 指厚颜无耻，和腼腆端庄正相反|de · mure|de- plus mure, as in pure|de- 加 mure，同 pure
      candor|thanks for honestly saying what one thinks|a woman openly admitting every mistake|plain, honest answers that won voters' trust|candor is open honesty; chicanery is trickery|candor 坦诚；chicanery 诡计|chicanery means tricks to deceive, the opposite of honest answers|chicanery 指欺骗的诡计，和诚实的回答正相反|levity means joking at a serious time, not plain honesty|levity 指不合时宜的玩笑，不是坦诚直率|can · dor|can- plus -dor, with the -or ending|can- 加 -dor，结尾是 -or
      condone|parents letting children copy homework without blame|a manager allowing rudeness by saying nothing|accepting cruelty as if it were fine|condone allows wrong behavior; denounce condemns it publicly|condone 纵容；denounce 公开谴责|antagonize means to make someone hostile, not to quietly allow wrong behavior|antagonize 指使人敌对，不是默许错误行为|denounce means to condemn publicly, the opposite of allowing without a word of blame|denounce 指公开谴责，和不加责备地默许正相反|con · done|con- plus done|con- 加 done
      facetious|a request to stop making jokes about something serious|a joke about a dead man's debts at his funeral|a silly joke in reply to a serious question|facetious jokes at serious things; demure is quiet and modest|facetious 不合时宜地开玩笑；demure 端庄安静|demure means quiet and modest, not making silly jokes|demure 指安静端庄，不是乱开玩笑|contentious means causing argument, not joking about serious things|contentious 指引起争论，不是拿严肃的事开玩笑|fa · ce · tious|the -cetious ending, with ce|结尾是 -cetious，中间是 ce
    `,
  },
);

const leanings = batch(
  "words-of-leanings-and-whims",
  ["Words of Leanings and Whims", "倾向与心血来潮的词"],
  ["tastes, tendencies and sudden choices", "爱好、倾向与突然的选择"],
  `
  penchant|a strong liking for something|爱好，嗜好|Her ___ for spicy food shows at every meal; she always orders the hottest dish and loves every bite.|His ___ for telling long stories was famous, and he enjoyed nothing more than a patient listener.|Her ___ for bright colors showed in her clothes; she loved yellow and orange above all.|aversion,apathy|
  predilection|a preference or special liking|偏爱|His ___ for old films is plain; he prefers black-and-white classics to anything new.|Her ___ for detective novels was well known; she chose them over every other kind of book.|Their shared ___ for jazz shows in their record shelves; they like it better than any other music.|animosity,apathy|predilections
  propensity|a natural tendency to behave in a particular way|倾向，习性|His ___ to exaggerate is well known; he does it naturally and constantly, turning every small fish into a whale.|Every cat in the house shows the same ___ to sleep in the sun, a natural habit they follow every day.|Engineers knew of the ___ of this soil to flood, a natural tendency it showed every spring.|aversion,decorum|propensities
  spontaneous|done without planning, from a sudden impulse|自发的，即兴的|The crowd burst into ___ applause, sudden and unplanned, the moment the singer appeared.|They took a ___ trip to the coast, deciding on a sudden impulse that very morning.|Her ___ laugh, bursting out before she could stop it, made everyone smile.|conventional,painstaking|spontaneously,spontaneity
  intuitive|based on feelings rather than reasoning; easy to use|直觉的；易懂的|Her grasp of music is ___; she understands it by feeling without ever studying theory.|The app's design is ___, so natural that anyone can use it at once without studying a manual.|His guess was ___, based on a feeling rather than any reasoning, and it turned out right.|pedantic,erudite|intuitively,intuition
  indulgent|allowing someone too much freedom or pleasure|放纵的，纵容的|The ___ parents bought him everything he asked for and never once said no.|Their ___ grandmother let the children stay up till midnight eating sweets.|Her teacher was ___, letting her hand in work late again and again without any penalty.|stringent,callous|indulge,indulgence
  frivolous|not having any serious purpose or value|轻浮的，琐碎的|Don't waste money on ___ things like plastic toys that serve no real purpose.|The judge threw out the ___ complaint, a silly case with no serious basis.|Her ___ remarks, silly jokes with no serious point, annoyed the panel.|seminal,profound|frivolously,frivolity
  preposterous|contrary to reason or common sense; absurd|荒谬的|The idea that the moon is made of cheese is ___, against all reason.|The price was ___: a thousand dollars for a cup of coffee is simply absurd.|His story about aliens stealing his homework was ___, and no sensible person believed it.|tenable,viable|preposterously
  eclectic|deriving ideas or taste from a broad range of sources|兼收并蓄的|She has ___ tastes in music, enjoying opera, rap, folk and jazz alike.|The furniture in the room was ___, a mix of styles from many countries and centuries.|His ___ reading ranged widely, from poetry and physics to cookbooks and history.|conventional,insular|
  emulate|to try to match or surpass someone, usually by imitation|模仿，效法|Young players ___ their heroes, copying the way they kick and hoping to be as good one day.|She hopes to ___ her mother's success by following the same path and matching what she achieved.|Other cities tried to ___ the plan, copying it in the hope of doing even better.|flout,repudiate|emulated,emulation
  `,
  "context-clues",
  {
    intro: t(
      "With her **eclectic** tastes and a **penchant** for adventure, she had a **propensity** to make **spontaneous** plans, while her brother, who had a **predilection** for routine, found them **preposterous**. These ten words help you describe tastes, natural tendencies and sudden choices.",
      "她口味兼收并蓄（**eclectic**），又爱冒险（**penchant**），常常（**propensity**）心血来潮地（**spontaneous**）做计划；而她偏爱（**predilection**）按部就班的哥哥却觉得这些计划荒谬（**preposterous**）。这十个词帮你描写爱好、天性倾向和突然的选择。",
    ),
    watchOut: {
      meanings: t(
        "A **penchant** and a **predilection** are *likings*; a **propensity** is a natural *tendency*, often to do something bad, as in *a propensity to exaggerate*. **Emulate** means to copy in order to *match*, not just to admire.",
        "**penchant** 和 **predilection** 是*喜好*；**propensity** 是天生的*倾向*，常指坏毛病，如 a propensity to exaggerate。**emulate** 是为了*赶上*而效仿，不只是钦佩。",
      ),
      use: t(
        "**Frivolous** means silly and without serious *purpose*; **preposterous** means *against reason*; **indulgent** describes someone who gives others too much freedom or pleasure.",
        "**frivolous** 指轻浮、没有正经*目的*；**preposterous** 指*违背常理*；**indulgent** 形容给别人太多自由或享受的人。",
      ),
      spelling: t(
        "Watch the *-chant* of **penchant**, the *-ilection* of **predilection**, the *-aneous* of **spontaneous**, and the *-ost-* of **preposterous**.",
        "注意 **penchant** 的 -chant、**predilection** 的 -ilection、**spontaneous** 的 -aneous，以及 **preposterous** 中间的 -ost-。",
      ),
    },
    notes: `
      penchant|always ordering the hottest dish and loving every bite|enjoying nothing more than telling long stories|loving yellow and orange above all|a penchant is a strong liking; an aversion is a strong dislike|penchant 是强烈的爱好；aversion 是强烈的反感|aversion means a strong dislike, the opposite of loving every bite|aversion 指强烈的反感，和吃得津津有味正相反|apathy means lack of interest, the opposite of enjoying and loving something|apathy 指毫无兴趣，和喜爱享受正相反|pen · chant|pen plus chant|pen 加 chant
      predilection|preferring black-and-white classics to anything new|choosing detective novels over every other book|liking jazz better than any other music|a predilection is a preference; animosity is hostility|predilection 是偏爱；animosity 是敌意|animosity means strong hostility toward people, not a preference for films or books|animosity 指对人的强烈敌意，不是对电影或书的偏爱|apathy means lack of interest, the opposite of liking one thing better than all others|apathy 指毫无兴趣，和格外偏爱某物正相反|pre · di · lec · tion|pre- plus dilection, with the -ilection ending|pre- 加 dilection，结尾是 -ilection
      propensity|a man who naturally and constantly exaggerates|cats that sleep in the sun every day|soil that tends to flood every spring|a propensity is a natural tendency; an aversion is a dislike|propensity 是天生倾向；aversion 是反感|aversion means a strong dislike, the opposite of doing something naturally and constantly|aversion 指强烈的反感，和天生经常做某事正相反|decorum means proper behavior, not a natural tendency of people, cats or soil|decorum 指得体的举止，不是人、猫或土壤的天生倾向|pro · pen · si · ty|pro- plus pens- plus -ity|pro- 加 pens- 再加 -ity
      spontaneous|sudden, unplanned applause the moment a singer appeared|a trip decided on a sudden impulse that morning|a laugh bursting out before she could stop it|spontaneous is sudden and unplanned; painstaking is careful and slow|spontaneous 自发即兴；painstaking 煞费苦心|conventional means what is usually done, not sudden and unplanned|conventional 指通常的做法，不是突如其来、毫无计划|painstaking means done with great care, the opposite of decided on a sudden impulse|painstaking 指煞费苦心，和一时冲动决定正相反|spon · ta · ne · ous|the -aneous ending, as in instantaneous|结尾是 -aneous，同 instantaneous
      intuitive|a grasp of music by feeling without studying theory|an app anyone can use without studying a manual|a guess based on feeling rather than reasoning|intuitive works by feeling; erudite comes from long study|intuitive 凭直觉；erudite 来自苦读|pedantic means fussy about minor rules, not understanding something by feeling|pedantic 指拘泥于细枝末节，不是凭感觉理解|erudite means learned from long study, the opposite of understanding without study|erudite 指饱读诗书，和不经学习就懂正相反|in · tu · i · tive|in- plus tuit- plus -ive, as in intuition|in- 加 tuit- 再加 -ive，同 intuition
      indulgent|parents who never once said no|a grandmother letting children eat sweets till midnight|a teacher accepting late work without any penalty|indulgent allows too much; stringent is strict|indulgent 放纵；stringent 严格|stringent means strict and exacting, the opposite of never saying no|stringent 指严格苛刻，和从不说不正相反|callous means cruel and unfeeling, not kind and too generous|callous 指冷酷无情，不是过分宽厚|in · dul · gent|in- plus dul- plus -gent|in- 加 dul- 再加 -gent
      frivolous|plastic toys that serve no real purpose|a silly complaint with no serious basis|silly jokes with no serious point|frivolous has no serious purpose; profound is deeply serious|frivolous 轻浮；profound 深刻|seminal means hugely influential, the opposite of silly and without purpose|seminal 指影响深远，和琐碎无意义正相反|profound means deep and serious, the opposite of silly jokes|profound 指深刻严肃，和无聊的玩笑正相反|friv · o · lous|friv- plus -olous|friv- 加 -olous
      preposterous|the idea that the moon is made of cheese|a thousand dollars for a cup of coffee|a story about aliens stealing homework|preposterous is absurd; tenable can be defended|preposterous 荒谬；tenable 站得住脚|tenable means reasonable enough to defend, the opposite of against all reason|tenable 指站得住脚，和违背常理正相反|viable means workable and practical, the opposite of absurd|viable 指切实可行，和荒谬正相反|pre · pos · ter · ous|pre- plus post- plus -erous|pre- 加 post- 再加 -erous
      eclectic|tastes in music ranging from opera to rap to folk|furniture mixing styles from many countries and centuries|reading from poetry and physics to cookbooks|eclectic draws on many sources; insular keeps to one small circle|eclectic 兼收并蓄；insular 狭隘封闭|conventional means doing the usual thing, not mixing many styles|conventional 指照常规做事，不是融合多种风格|insular means interested only in one's own small group, the opposite of ranging widely|insular 指只关心自己的小圈子，和涉猎广泛正相反|ec · lec · tic|ec- plus lect- plus -ic|ec- 加 lect- 再加 -ic
      emulate|young players copying their heroes to be as good one day|following a mother's path to match her success|cities copying a plan to do even better|emulate copies in order to match; flout openly ignores|emulate 效法；flout 公然藐视|flout means to openly disregard a rule, the opposite of copying a hero|flout 指公然无视规则，和效仿英雄正相反|repudiate means to refuse to accept, the opposite of copying a plan|repudiate 指拒绝接受，和照搬计划正相反|em · u · late|em- plus u plus -late|em- 加 u 再加 -late
    `,
  },
);

const relentless = batch(
  "words-of-the-relentless-and-the-calm",
  ["Words of the Relentless and the Calm", "无休止与平静的词"],
  ["things that never stop, storms, calm and watchfulness", "永不停歇之物、风暴、平静与警觉"],
  `
  incessant|continuing without pause or interruption|不停的|The ___ rain, falling for ten days without a single pause, flooded the roads.|Her ___ chatter, going on all afternoon without a break, wore him out.|The dog's ___ barking, which never stopped for a moment all night, kept us awake.|transient,tranquil|incessantly
  relentless|oppressively constant; never stopping or weakening|不懈的，无情的|The ___ heat, week after week without relief, wore us all out.|She was ___ in her pursuit of the truth, never stopping or weakening for a moment.|They faced ___ pressure from their bosses, day and night, and it never once eased.|transient,innocuous|relentlessly
  inexorable|impossible to stop or prevent|无法阻止的|The ___ rise of prices, which no government could stop, worried families.|The march of time is ___: nothing can stop it or turn it back.|The ___ tide swept over the sand, steadily, and nothing could hold it back.|erratic,innocuous|inexorably
  unprecedented|never done or known before|前所未有的|The flood was ___, bigger than any in the town's recorded history.|Their fifth title in a row was ___; no team had ever done it before.|The crisis is ___ in our history, unlike anything the country has known.|conventional,hackneyed|
  turbulent|full of conflict or confusion; moving unsteadily|动荡的；湍急的|The plane shook as it flew through ___ air, bumping and dropping without warning.|They lived through ___ times of war and riots, when nothing was calm or settled.|The ___ river, churning and foaming over the rocks, was too dangerous to cross.|tranquil,stagnant|
  tranquil|free from disturbance; calm|安静的，平静的|They spent a ___ week by the still lake, where nothing broke the quiet.|The garden was ___, calm and silent except for the soft hum of bees.|Her ___ voice, soft and calm, soothed the frightened child.|turbulent,boisterous|tranquility
  vigilant|keeping careful watch for possible danger|警惕的|Be ___ when walking home at night, watching every shadow for danger.|The ___ guard, watching the doors closely all night, spotted the thief at once.|Parents must be ___ online, keeping a careful eye on what their children see.|negligent,oblivious|vigilantly,vigilance
  impervious|not allowing fluid to pass through; unable to be affected|不透水的；不受影响的|The coat is ___ to rain, keeping its wearer completely dry in any storm.|He read every angry letter but seemed ___ to criticism, not affected by a word.|She felt the bitter wind yet was ___ to the cold, which did not trouble her at all.|amenable,oblivious|
  innocuous|not harmful or offensive|无害的|The question seemed ___, harmless and polite, so she answered it at once.|Most spiders are ___ to people; their bites do no harm at all.|He meant his remark to be ___, a harmless comment that would offend nobody.|pernicious,virulent|innocuously
  sedentary|involving much sitting and little exercise|久坐的|Her desk job is ___, keeping her seated all day with almost no exercise.|Office work is ___, keeping you in a chair for hours with little movement.|After he retired, his life grew ___, spent mostly sitting in his armchair.|itinerant,boisterous|
  `,
  "context-clues",
  {
    intro: t(
      "After a **turbulent** voyage through **incessant** storms and **relentless** winds, the sailors reached a **tranquil** bay, though the **vigilant** captain still watched the sky. These ten words help you describe things that never stop, storms and calm, watchfulness and what cannot harm or move us.",
      "经历了一段在不停的（**incessant**）暴风雨和无情的（**relentless**）狂风中颠簸的（**turbulent**）航程后，水手们终于抵达一个平静的（**tranquil**）海湾，而警惕的（**vigilant**）船长仍在观察天空。这十个词帮你描写永不停歇之物、风暴与平静、警觉以及不能伤害或打动我们的事物。",
    ),
    watchOut: {
      meanings: t(
        "**Incessant** means never *pausing*; **relentless** means never *weakening*, often in a harsh way; **inexorable** means impossible to *stop*. **Unprecedented** means never *happened before*.",
        "**incessant** 指从不*停顿*；**relentless** 指从不*减弱*，常带严酷之意；**inexorable** 指无法*阻止*。**unprecedented** 指以前从未*发生过*。",
      ),
      use: t(
        "**Impervious** takes *to* and means *not affected*, even when you notice something; **oblivious** means not *noticing* at all. **Innocuous** means *harmless*, the opposite of **pernicious**.",
        "**impervious** 后接 to，意为*不受影响*，即使你注意到了；**oblivious** 则是根本没*注意到*。**innocuous** 指*无害*，和 **pernicious** 相反。",
      ),
      spelling: t(
        "Watch the double *s* of **incessant**, the *-orable* of **inexorable**, the *-cedented* of **unprecedented**, and the double *n* of **innocuous**.",
        "注意 **incessant** 的双写 s、**inexorable** 的 -orable、**unprecedented** 的 -cedented，以及 **innocuous** 的双写 n。",
      ),
    },
    notes: `
      incessant|rain falling for ten days without a pause|chatter going on all afternoon without a break|barking that never stopped all night|incessant never pauses; transient lasts only a short time|incessant 不停；transient 短暂|transient means lasting only a short time, the opposite of ten days without a pause|transient 指短暂，和连续十天不停正相反|tranquil means calm and quiet, the opposite of chatter or barking that never stops|tranquil 指安静平和，和不停的唠叨或狗叫正相反|in · ces · sant|in- plus cess- plus -ant, with the double s|in- 加 cess- 再加 -ant，双写 s
      relentless|heat week after week without relief|a pursuit of the truth that never weakened|pressure from bosses that never once eased|relentless never weakens; transient soon passes|relentless 毫不减弱；transient 转瞬即逝|transient means lasting only a short time, the opposite of week after week without relief|transient 指短暂，和一周又一周毫不缓解正相反|innocuous means harmless, not heat or pressure that wears people out|innocuous 指无害，不是把人折磨得筋疲力尽的酷热或压力|re · lent · less|relent plus -less|relent 加 -less
      inexorable|a rise in prices that no government could stop|the march of time that nothing can turn back|a tide that nothing could hold back|inexorable cannot be stopped; erratic is irregular|inexorable 无法阻挡；erratic 不稳定|erratic means irregular and uneven, the opposite of a steady march that cannot be stopped|erratic 指没有规律，和稳步推进、无法阻挡正相反|innocuous means harmless, not something that worries families and cannot be stopped|innocuous 指无害，不是让家庭担忧、无法阻止的东西|in · ex · o · ra · ble|in- plus ex- plus -orable|in- 加 ex- 再加 -orable
      unprecedented|a flood bigger than any in recorded history|a fifth title no team had ever won before|a crisis unlike anything a country has known|unprecedented has never happened before; conventional is what usually happens|unprecedented 前所未有；conventional 常规的|conventional means what is usually done, the opposite of never happened before|conventional 指常规的，和前所未有正相反|hackneyed means used so often it has lost its effect, the opposite of never known before|hackneyed 指用滥了的，和从未有过正相反|un · prec · e · dent · ed|un- plus precedent plus -ed|un- 加 precedent 再加 -ed
      turbulent|air that made a plane bump and drop|times of war and riots when nothing was settled|a river churning and foaming over rocks|turbulent is rough and unsettled; tranquil is calm|turbulent 动荡湍急；tranquil 平静|tranquil means calm and peaceful, the opposite of bumping air and a churning river|tranquil 指平静安宁，和颠簸的气流与翻滚的河水正相反|stagnant means not flowing or moving, the opposite of churning and foaming|stagnant 指停滞不流，和翻腾起沫正相反|tur · bu · lent|tur- plus -bulent|tur- 加 -bulent
      tranquil|a week by a still lake where nothing broke the quiet|a garden calm and silent except for bees|a soft, calm voice that soothed a child|tranquil is calm and quiet; boisterous is noisy and lively|tranquil 平静；boisterous 喧闹|turbulent means rough and unsettled, the opposite of a still lake and a calm garden|turbulent 指动荡不安，和平静的湖面与安静的花园正相反|boisterous means noisy and energetic, the opposite of soft and calm|boisterous 指喧闹活跃，和轻柔平静正相反|tran · quil|the qu in the middle|中间是 qu
      vigilant|watching every shadow for danger at night|a guard watching the doors closely who spotted a thief|parents keeping a careful eye on what children see online|vigilant keeps careful watch; oblivious notices nothing|vigilant 警惕；oblivious 浑然不觉|negligent means failing to take proper care, the opposite of watching every shadow|negligent 指疏忽大意，和留意每个暗影正相反|oblivious means unaware, the opposite of spotting a thief at once|oblivious 指浑然不觉，和立刻发现小偷正相反|vig · i · lant|vigil plus -ant|vigil 加 -ant
      impervious|a coat keeping its wearer dry in any storm|a man who read every angry letter but was not affected|a woman who felt the bitter wind but was not troubled|impervious is not affected; oblivious does not notice|impervious 不受影响；oblivious 没注意到|amenable means open to persuasion and influence, the opposite of not affected by a word|amenable 指愿意接受影响，和一字不为所动正相反|oblivious means not noticing, but these people read every letter and felt the wind|oblivious 指没有察觉，而这些人读了每封信、也感觉到了寒风|im · per · vi · ous|im- plus per- plus -vious, as in obvious|im- 加 per- 再加 -vious，同 obvious
      innocuous|a harmless, polite question answered at once|spiders whose bites do no harm|a remark meant to offend nobody|innocuous is harmless; pernicious is deeply harmful|innocuous 无害；pernicious 有害|pernicious means harmful, especially slowly, the opposite of harmless and polite|pernicious 指有害，和无害、礼貌正相反|virulent means extremely harmful or bitterly hostile, the opposite of doing no harm|virulent 指剧毒或充满敌意，和毫无害处正相反|in · noc · u · ous|the double n and the -uous ending|双写 n，结尾是 -uous
      sedentary|a desk job giving almost no exercise|office work keeping you in a chair for hours|a retired life spent mostly in an armchair|sedentary involves much sitting; itinerant keeps traveling|sedentary 久坐；itinerant 四处奔走|itinerant means traveling from place to place, the opposite of sitting in a chair all day|itinerant 指四处奔走，和整天坐着正相反|boisterous means noisy and energetic, not quiet and seated|boisterous 指喧闹活跃，不是安静地坐着|sed · en · tar · y|sed- plus -entary, as in sedan|sed- 加 -entary
    `,
  },
);

const trimming = batch(
  "words-for-trimming-and-padding-writing",
  ["Words for Trimming and Padding Writing", "精简与充数文字的词"],
  ["cutting writing down and filling it out", "删减文字与填塞文字"],
  `
  wordy|using too many words|啰嗦的，冗长的|Her ___ email took ten minutes to read, saying in a page what needed only one line.|Cut the ___ opening paragraph; it uses fifty words where five would do.|His style is ___ and dull, piling up long phrases that say very little.|concise,incisive|wordiness
  brevity|concise and exact use of words; shortness of time|简洁；短暂|The teacher praised the ___ of her report, which made every point in a single page.|The ___ of his visit surprised us; he stayed only ten minutes.|In a short speech, ___ matters most, so say what you mean in as few words as you can.|verbiage,levity|
  concise|giving a lot of information clearly in a few words|简明的|Keep your summary of the book ___, covering its main points clearly in a few sentences.|Her answer was ___, clear and complete in just two lines.|The guide is ___, packing all the key facts into a booklet that fits in a pocket.|wordy,extraneous|concisely
  embellish|to make more attractive by adding details, often untrue ones|装饰；润色|He likes to ___ his stories, adding exciting details that never happened.|She chose to ___ the plain dress with beads and lace to make it prettier.|Don't ___ the facts in your report; describe only what really happened.|elicit,curtail|embellished,embellishment
  extraneous|irrelevant or unrelated to the subject|无关的|Remove any ___ details that have nothing to do with the topic of the essay.|Her report contained ___ material, pages about her holiday in a study of local rivers.|To focus on the test, the students turned off every ___ noise that had nothing to do with their work.|concise,incisive|
  redundant|not needed; no longer employed because a job is unnecessary|多余的；被裁员的|Cut the ___ words; "free gift" says the same thing twice.|When the factory bought robots, hundreds of workers were made ___, their jobs no longer needed.|The second sentence is ___, since it only repeats what the first already says.|concise,incisive|redundancy
  incisive|intelligently analytical and clear-thinking|深刻的，尖锐的|Her analysis of the poem was ___, cutting straight to its deepest meaning with clear, sharp thinking.|His ___ questions, sharp and to the point, quickly exposed the lie.|The critic's comments were ___, going straight to the heart of the film's weaknesses.|superficial,wordy|incisively
  elicit|to draw out a response or answer|引出，探出|The teacher tried to ___ answers from the shy class, drawing them out with patient questions.|Her joke failed to ___ a single laugh from the audience, which sat in silence.|The survey is meant to ___ opinions from every family, drawing out what people really think.|embellish,forestall|elicited
  superficial|existing or occurring on the surface; shallow|表面的，肤浅的|The cut was only ___, a scratch on the surface of the skin.|His knowledge of history is ___; he knows a few dates but nothing deeper.|They made only ___ changes, painting the walls but leaving the broken heating as it was.|profound,exhaustive|superficially
  verbiage|speech or writing that uses too many words|冗词，废话|Strip away the ___, all those extra words, and the idea is simple.|The report was full of legal ___, long empty phrases that hid its few real points.|Cut the ___ from your essay so that every word does some work.|brevity,candor|
  `,
  "context-clues",
  {
    intro: t(
      "The editor cut the **verbiage** from the **wordy** draft, removed every **extraneous** detail and **redundant** phrase, and praised the writer's final, **concise** version for its **brevity**. These ten words help you talk about trimming writing down, filling it out and thinking sharply.",
      "编辑删掉了啰嗦的（**wordy**）初稿里的冗词（**verbiage**），去掉每一个无关的（**extraneous**）细节和多余的（**redundant**）短语，并称赞作者最终那版简明的（**concise**）文稿言简意赅（**brevity**）。这十个词帮你谈论精简文字、充实文字和敏锐的思考。",
    ),
    watchOut: {
      meanings: t(
        "**Extraneous** material is *off the topic*; **redundant** words *repeat* what is already said; **verbiage** is the whole mass of *extra words*. **Incisive** means sharp thinking, not just a short text.",
        "**extraneous** 的内容是*离题*的；**redundant** 的词*重复*了已说过的话；**verbiage** 指整堆*多余的词*。**incisive** 指思考敏锐，不只是文字短。",
      ),
      use: t(
        "**Elicit** means to *draw out* a response, as in *elicit answers*; **embellish** means to *add* details, true or not. **Brevity** is a noun and **concise** an adjective: a *concise* report is praised for its *brevity*.",
        "**elicit** 是*引出*回应，如 elicit answers；**embellish** 是*添加*细节，不论真假。**brevity** 是名词，**concise** 是形容词：a concise report 因 brevity 受到称赞。",
      ),
      spelling: t(
        "Watch the *e* at the start of **elicit**, not *i* as in *illicit*; the double *l* of **embellish**; the *-neous* of **extraneous**; and the *-iage* of **verbiage**.",
        "注意 **elicit** 开头是 e，不是 illicit 的 i；**embellish** 的双写 l；**extraneous** 的 -neous；以及 **verbiage** 的 -iage。",
      ),
    },
    notes: `
      wordy|an email saying in a page what needed one line|an opening paragraph using fifty words where five would do|a style piling up long phrases that say little|wordy uses too many words; concise uses few|wordy 啰嗦；concise 简明|concise means clear in few words, the opposite of a page for one line|concise 指言简意赅，和一句话写满一页正相反|incisive means sharp and clear-thinking, not long phrases that say little|incisive 指思考敏锐，不是说不出什么的长句|word · y|word plus -y|word 加 -y
      brevity|a report making every point in one page|a visit of only ten minutes|a short speech saying things in as few words as possible|brevity is shortness; verbiage is too many words|brevity 简短；verbiage 冗词|verbiage means too many words, the opposite of every point in one page|verbiage 指冗词赘句，和一页说清所有要点正相反|levity means joking at a serious time, not shortness of words or time|levity 指不合时宜的玩笑，不是文字或时间的简短|brev · i · ty|brev- as in brief, plus -ity|brev- 同 brief，加 -ity
      concise|a summary covering main points in a few sentences|an answer clear and complete in two lines|a pocket guide packing all the key facts|concise is clear in few words; wordy uses too many|concise 简明；wordy 啰嗦|wordy means using too many words, the opposite of two clear lines|wordy 指啰嗦，和两行说清正相反|extraneous means off the topic, not packing in all the key facts|extraneous 指离题，不是包含所有要点|con · cise|con- plus -cise, as in precise|con- 加 -cise，同 precise
      embellish|stories with exciting details that never happened|a plain dress decorated with beads and lace|facts that should not be dressed up in a report|embellish adds details; curtail cuts things short|embellish 添枝加叶；curtail 削减|elicit means to draw out a response, not to add details or decoration|elicit 指引出回应，不是添加细节或装饰|curtail means to cut short, the opposite of adding beads and details|curtail 指削减，和添加装饰与细节正相反|em · bel · lish|em- plus bell- plus -ish, with the double l|em- 加 bell- 再加 -ish，双写 l
      extraneous|details that have nothing to do with an essay's topic|holiday pages in a study of local rivers|noise that had nothing to do with students' work|extraneous is off the topic; concise is short and to the point|extraneous 离题；concise 简明扼要|concise means short and clear, not off the topic|concise 指简明，不是离题|incisive means sharp and to the point, the opposite of unrelated material|incisive 指一针见血，和无关的材料正相反|ex · tra · ne · ous|extra- plus -neous|extra- 加 -neous
      redundant|free gift saying the same thing twice|workers whose jobs were no longer needed after robots arrived|a sentence repeating what the first already says|redundant is not needed; concise says only what is needed|redundant 多余；concise 只说必要的|concise means saying much in few words, not repeating something unnecessarily|concise 指言简意赅，不是不必要的重复|incisive means sharp and clear-thinking, not unneeded or repeated|incisive 指思考敏锐，不是多余或重复|re · dun · dant|re- plus dund- plus -ant|re- 加 dund- 再加 -ant
      incisive|an analysis cutting straight to a poem's deepest meaning|sharp questions that exposed a lie|comments going straight to the heart of a film's weaknesses|incisive is sharp and deep; superficial is shallow|incisive 深刻尖锐；superficial 肤浅|superficial means shallow and on the surface, the opposite of cutting straight to the deepest meaning|superficial 指浮于表面，和直达最深含义正相反|wordy means using too many words, not sharp and to the point|wordy 指啰嗦，不是一针见血|in · ci · sive|in- plus cis- plus -ive, as in incision|in- 加 cis- 再加 -ive，同 incision
      elicit|answers drawn out of a shy class with patient questions|a joke that drew not a single laugh|a survey drawing out what families really think|elicit draws out a response; forestall prevents it|elicit 引出；forestall 预先阻止|embellish means to add details, not to draw out answers or laughs|embellish 指添加细节，不是引出回答或笑声|forestall means to prevent something before it happens, the opposite of drawing it out|forestall 指事先阻止，和引出正相反|e · lic · it|e- at the start, not il- as in illicit|开头是 e-，不是 illicit 的 il-
      superficial|a cut that was only a scratch on the skin's surface|knowledge of a few dates and nothing deeper|painting walls while leaving the broken heating|superficial is on the surface; profound is deep|superficial 表面的；profound 深刻|profound means very deep, the opposite of a scratch on the surface|profound 指深刻，和表皮划伤正相反|exhaustive means covering everything, the opposite of a few dates or a coat of paint|exhaustive 指面面俱到，和只知几个年份、只刷一层漆正相反|su · per · fi · cial|super- plus -ficial, with the -cial ending|super- 加 -ficial，结尾是 -cial
      verbiage|extra words hiding a simple idea|long empty legal phrases that hid a few real points|words in an essay that do no work|verbiage is too many words; brevity is the use of few|verbiage 冗词；brevity 简洁|brevity means using few words, the opposite of long empty phrases|brevity 指简洁，和冗长空洞的语句正相反|candor means honesty, not a mass of extra words|candor 指坦诚，不是一大堆多余的词|ver · bi · age|verb- plus -iage|verb- 加 -iage
    `,
  },
);

const means = batch(
  "words-of-means-that-work",
  ["Words of Means That Work", "可行办法的词"],
  ["ways to get things done, fairly or by a trick", "做成事情的办法，正当的或取巧的"],
  `
  circumvent|to find a way around an obstacle or rule|规避，绕过|They tried to ___ the law, finding a clever way around it without openly breaking it.|To ___ the traffic jam, we turned onto the back roads and drove around it.|He found a quiet way to ___ the ban, selling his goods through a friend's shop instead.|flout,expedite|circumvented
  expedient|convenient and practical, though perhaps not right; a means to an end|权宜的；权宜之计|It would be ___ to agree with the boss, convenient for now though perhaps not right.|They chose the ___ option, the quick and easy fix, though they knew it was not the best.|Lying was ___ but wrong, a convenient way out that he later regretted.|exemplary,stringent|expediency
  viable|capable of working successfully|可行的|With so little money, the plan is not ___; it simply cannot work.|The bank asked whether the business was ___, able to earn enough to survive.|They need a ___ alternative, one that will actually work in practice.|preposterous,defunct|viability
  conducive|making a certain outcome likely or possible|有助于…的|A dark, quiet room is ___ to sleep, helping you drift off quickly.|The calm library was ___ to study, making it easy to concentrate.|Warm, wet weather is ___ to growth, helping the crops shoot up.|inimical,deleterious|
  workable|able to be used or operated successfully|可行的，切实可行的|After long talks they reached the kind of ___ deal that both sides could actually carry out.|Any plan we choose must be ___, one that will really function with the people and money we have.|When wet, the clay is soft and ___, easy to shape into bowls and cups.|illusory,preposterous|
  practicable|able to be done or put into practice|能实行的|In the deep snow only one route was ___: the road the plows had cleared.|The engineers chose the most ___ design, the one their workers could actually build.|Before spending money, ask whether the idea is ___, something that can really be done.|onerous,illusory|
  makeshift|serving as a temporary substitute|临时凑合的|Their shelter for the night was ___, built from branches and a sheet to last just one night.|Until the real table arrived, a cardboard box served as our ___ one.|The ___ bridge of planks and rope held for a day until the army built a proper one.|pristine,opulent|
  ploy|a cunning plan or action designed to gain an advantage|策略，花招|His fainting was just a ___ to get attention, a cunning trick to make everyone look at him.|The free gift was a marketing ___, a clever trick to make people buy more.|His tears were a ___, a clever act to win our sympathy and get his way.|loophole,candor|ploys
  loophole|a gap in a law or contract that lets someone avoid it|漏洞|They used a tax ___, a gap in the law that let them avoid paying.|Lawyers found a ___ in the contract, a missing clause that let their client walk away.|The new law closes the ___ that let firms escape the old rules.|ploy,panacea|loopholes
  expedite|to make an action happen sooner|加快，促进|For a small fee we can ___ your order, sending it today instead of next week.|The new rules will ___ the process, cutting the wait from a month to a week.|Can you ___ my visa, so that it is ready before my flight on Monday?|circumvent,stymie|expedited
  `,
  "context-clues",
  {
    intro: t(
      "Instead of a **viable** plan, the firm used a **makeshift** fix: a clever **ploy** and a tax **loophole** that helped it **circumvent** the rules, an **expedient** choice it later regretted. These ten words help you describe ways of getting things done, fairly or by a trick.",
      "这家公司没有拿出可行的（**viable**）方案，而是用了个临时凑合的（**makeshift**）办法：一个巧妙的花招（**ploy**）加上一个税务漏洞（**loophole**），帮它规避（**circumvent**）了规定——这是个权宜的（**expedient**）选择，后来公司为此后悔不已。这十个词帮你描写做成事情的办法，正当的或取巧的。",
    ),
    watchOut: {
      meanings: t(
        "**Expedient** means convenient for now, though *perhaps not right*; **viable**, **workable** and **practicable** simply mean it *can work* or *can be done*. **Makeshift** means used only *until* something better comes.",
        "**expedient** 指眼下方便，*未必正当*；**viable**、**workable** 和 **practicable** 只是说*行得通*、*做得到*。**makeshift** 指只是在更好的东西到来*之前*临时凑合。",
      ),
      use: t(
        "To **circumvent** a rule is to go *around* it quietly; to **flout** it is to break it *openly*. **Expedite** means to *speed up*, not to excuse. **Conducive** takes *to*: *conducive to sleep*.",
        "**circumvent** 规则是悄悄*绕过*；**flout** 规则是*公然*违反。**expedite** 是*加快*，不是开脱。**conducive** 后接 to：conducive to sleep。",
      ),
      spelling: t(
        "Watch the *-vent* of **circumvent**, the *-ient* of **expedient** against the *-ite* of **expedite**, the *-cive* of **conducive**, and the double *o* of **loophole**.",
        "注意 **circumvent** 的 -vent、**expedient** 的 -ient 和 **expedite** 的 -ite、**conducive** 的 -cive，以及 **loophole** 的双写 o。",
      ),
    },
    notes: `
      circumvent|a clever way around a law without openly breaking it|back roads taken to drive around a traffic jam|selling goods through a friend's shop to get around a ban|circumvent goes around a rule; flout breaks it openly|circumvent 绕过规则；flout 公然违反|flout means to break a rule openly, not to find a quiet way around it|flout 指公然违反，不是悄悄绕过|expedite means to speed something up, not to get around a law or a jam|expedite 指加快，不是绕过法律或堵车|cir · cum · vent|circum- meaning around, plus vent|表示环绕的 circum- 加 vent
      expedient|agreeing with a boss because it is convenient though perhaps not right|a quick, easy fix chosen though not the best|a convenient lie that was later regretted|expedient is convenient but perhaps wrong; exemplary is a model of what is right|expedient 权宜但未必正当；exemplary 堪称楷模|exemplary means a good model to copy, the opposite of convenient but not right|exemplary 指值得效仿，和方便却不正当正相反|stringent means strict and exacting, not quick, easy and convenient|stringent 指严格苛刻，不是快捷方便|ex · pe · di · ent|the -ient ending, not -ite|结尾是 -ient，不是 -ite
      viable|a plan that cannot work with so little money|a business able to earn enough to survive|an alternative that will actually work|viable can work; preposterous is absurd|viable 可行；preposterous 荒谬|preposterous means absurd, while the plan here simply lacks money to work|preposterous 指荒谬，而这里的计划只是缺钱而行不通|defunct means no longer existing, not able or unable to work in the future|defunct 指已不复存在，不是将来能否行得通|vi · a · ble|vi- plus -able|vi- 加 -able
      conducive|a dark, quiet room that helps you drift off|a calm library that makes it easy to concentrate|warm, wet weather that helps crops shoot up|conducive helps something happen; inimical works against it|conducive 有助于；inimical 有害于|inimical means harmful or hostile to something, the opposite of helping sleep or study|inimical 指对……有害，和有助于睡眠或学习正相反|deleterious means causing harm, the opposite of helping crops grow|deleterious 指有害，和帮助庄稼生长正相反|con · du · cive|con- plus duc- plus -ive|con- 加 duc- 再加 -ive
      workable|a deal both sides could actually carry out|a plan that will really function with the people and money we have|wet clay easy to shape into bowls|workable can be used successfully; illusory is not real|workable 切实可行；illusory 虚幻|illusory means not real, not a deal two sides can carry out|illusory 指虚幻不实，不是双方能执行的协议|preposterous means absurd, the opposite of a sensible plan that will function|preposterous 指荒谬，和切实可行的计划正相反|work · a · ble|work plus -able|work 加 -able
      practicable|the one road the plows had cleared in deep snow|a design workers could actually build|an idea that can really be done|practicable can be done; onerous is a heavy burden|practicable 能实行；onerous 繁重|onerous means burdensome and hard, not the cleared, easy route|onerous 指繁重艰难，不是那条已清理好的路|illusory means not real, the opposite of something that can really be done|illusory 指虚幻，和真能办到的事正相反|prac · ti · ca · ble|practic- plus -able|practic- 加 -able
      makeshift|a shelter of branches and a sheet for one night|a cardboard box used as a table until the real one came|a bridge of planks and rope until a proper one was built|makeshift is temporary; pristine is perfect and untouched|makeshift 临时凑合；pristine 完好如初|pristine means perfectly clean and in its original state, not branches and a sheet|pristine 指洁净完好，不是树枝加床单|opulent means rich and luxurious, the opposite of a cardboard box or planks and rope|opulent 指奢华富丽，和纸箱或木板绳索正相反|make · shift|make plus shift|make 加 shift
      ploy|a fake faint to make everyone look at him|a free gift to make people buy more|tears acted to win sympathy|a ploy is a cunning trick; candor is honesty|ploy 是花招；candor 是坦诚|loophole is a gap in a law or contract, not a trick to win attention or sympathy|loophole 是法律或合同的漏洞，不是博取关注或同情的花招|candor means honesty, the opposite of a clever act|candor 指坦诚，和刻意表演正相反|ploy|pl plus oy, as in toy|pl 加 oy，同 toy
      loophole|a gap in the law that let people avoid tax|a missing clause that let a client walk away|a gap that let firms escape old rules|a loophole is a gap in a rule; a ploy is a trick|loophole 是规则漏洞；ploy 是花招|ploy is a cunning trick, not a gap in a law or contract|ploy 是计谋，不是法律或合同的漏洞|panacea is a cure for every problem, not a gap in the law|panacea 是万灵药，不是法律漏洞|loop · hole|loop plus hole|loop 加 hole
      expedite|sending an order today instead of next week|cutting a wait from a month to a week|getting a visa ready before Monday|expedite speeds things up; stymie blocks them|expedite 加快；stymie 阻碍|circumvent means to go around a rule, not to make something happen sooner|circumvent 指绕过规则，不是让事情提早发生|stymie means to block progress, the opposite of speeding it up|stymie 指阻碍进展，和加快正相反|ex · pe · dite|the -dite ending, not -dient|结尾是 -dite，不是 -dient
    `,
  },
);

const yielding = batch(
  "words-of-yielding-and-resisting",
  ["Words of Yielding and Resisting", "屈服与抵抗的词"],
  ["giving in, breaking promises, blocking and urging", "让步、毁约、阻挠与催促"],
  `
  acquiesce|to accept something reluctantly but without protest|默许|In the end she chose to ___ to his demands, accepting them quietly though she did not like them.|Too tired to argue, the board decided to ___ in the plan, letting it pass without a word of protest.|They had no choice but to ___ to the change, going along with it silently though they disliked it.|flout,renege|acquiesced,acquiescence
  capitulate|to stop resisting; to surrender|投降，屈服|After a long siege, the starving city was forced to ___, opening its gates to the enemy.|After months of strikes, the union had to ___, giving up the fight and accepting the bosses' terms.|Weak and outnumbered, the army chose to ___ rather than fight on.|flout,espouse|capitulated,capitulation
  renege|to go back on a promise or deal|违约，食言|They tried to ___ on the deal, backing out of what they had promised.|Don't ___ on your word; if you promise to come, come.|The company may ___ on the pay rise it promised in spring, breaking its word to the staff.|garner,espouse|reneged
  flout|to openly disregard a rule or custom|藐视，无视|Some drivers ___ the speed limit, openly racing past the police.|She liked to ___ convention, openly wearing jeans to formal dinners.|The fishermen ___ the ban, casting their nets in plain sight of the guards.|acquiesce,forestall|flouted
  forestall|to prevent by taking action ahead of time|预先阻止|The managers acted fast to ___ a strike, settling the dispute before workers could walk out.|The new checks aim to ___ fraud, stopping it before it can happen.|He tried to ___ any questions, answering them all before anyone could ask.|goad,garner|forestalled
  stymie|to prevent the progress of|阻碍，妨碍|Red tape may ___ the project, holding it up for months with forms and permits.|Lack of money will ___ the research, bringing it to a halt.|A string of injuries seemed to ___ the team's hopes, blocking every step toward the title.|expedite,garner|stymied
  goad|to provoke or annoy someone into action|刺激，激励|They tried to ___ him into fighting, mocking and insulting him until he lost his temper.|Her rivals' sneers may ___ her into acting, stinging her pride until she moves.|Don't let them ___ you with their taunts into doing something foolish.|entreat,cajole|goaded
  entreat|to ask someone earnestly or anxiously|恳求|With tears in her eyes she would ___ him to stay, begging him again and again not to leave.|On their knees, the prisoners ___ the king for mercy, pleading for their lives.|I ___ you to listen, please, before it is too late.|goad,flout|entreated,entreaty
  espouse|to adopt or support a cause or belief|支持，拥护|As a young woman she chose to ___ the cause of women's rights, supporting it all her life.|He would ___ free trade in every speech, arguing for it with conviction.|They ___ simple living, adopting it as their way of life and urging others to follow.|repudiate,flout|espoused
  garner|to gather or collect, especially support or information|获得，收集|The film is likely to ___ great reviews, collecting praise from critics everywhere.|She hopes to ___ support for the plan, gathering signatures from every neighbor.|The candidate set out to ___ votes from young people, winning them one by one.|squander,relinquish|garnered
  `,
  "context-clues",
  {
    intro: t(
      "The rebels **espoused** a cause, began to **garner** support, and refused to **capitulate**; the king tried to **forestall** a revolt and **stymie** their plans, but in the end he had to **acquiesce**. These ten words help you describe giving in, breaking promises, blocking and urging.",
      "起义者拥护（**espouse**）一项事业，开始赢得（**garner**）支持，拒不投降（**capitulate**）；国王想预先阻止（**forestall**）叛乱、阻挠（**stymie**）他们的计划，但最终不得不默许（**acquiesce**）。这十个词帮你描写让步、毁约、阻挠和催促。",
    ),
    watchOut: {
      meanings: t(
        "To **acquiesce** is to *accept quietly* though unwilling; to **capitulate** is to *surrender* after resisting; to **renege** is to *break* a promise one already made.",
        "**acquiesce** 是不情愿却*默默接受*；**capitulate** 是抵抗之后*投降*；**renege** 是*违背*已经做出的承诺。",
      ),
      use: t(
        "**Forestall** stops something *before* it starts; **stymie** blocks something already *in progress*. **Goad** pushes by *provoking*, while **entreat** pushes by *begging*.",
        "**forestall** 是在事情*开始前*阻止；**stymie** 是阻挠*正在进行*的事。**goad** 靠*刺激*来逼人行动，**entreat** 则靠*恳求*。",
      ),
      spelling: t(
        "Watch the *-quiesce* of **acquiesce** with its *c* before *q*, the *-ege* of **renege**, the *y* and *-ie* of **stymie**, and the *-ouse* of **espouse**.",
        "注意 **acquiesce** 的 -quiesce 以及 q 前面的 c、**renege** 的 -ege、**stymie** 里的 y 和结尾 -ie，以及 **espouse** 的 -ouse。",
      ),
    },
    notes: `
      acquiesce|quietly accepting demands one did not like|letting a plan pass without a word of protest|going along with a disliked change silently|acquiesce accepts quietly; flout openly disregards|acquiesce 默许；flout 公然藐视|flout means to openly disregard a rule, the opposite of accepting quietly|flout 指公然无视，和默默接受正相反|renege means to go back on a promise, not to accept something without protest|renege 指食言，不是不加抗议地接受|ac · qui · esce|the c before qu and the -esce ending|qu 前面有 c，结尾是 -esce
      capitulate|a starving city opening its gates to the enemy|a union giving up and accepting the bosses' terms|an outnumbered army choosing not to fight on|capitulate surrenders; flout defies openly|capitulate 投降；flout 公然对抗|flout means to openly disregard a rule, the opposite of giving up and accepting terms|flout 指公然藐视，和放弃抵抗、接受条件正相反|espouse means to adopt and support a cause, not to stop resisting|espouse 指拥护某事业，不是停止抵抗|ca · pit · u · late|capit- plus -ulate|capit- 加 -ulate
      renege|backing out of what was promised in a deal|breaking a promise to come|a company breaking its word on a promised pay rise|renege breaks a promise; garner gathers|renege 食言；garner 收集|garner means to gather or collect, not to back out of a promise|garner 指收集，不是违背承诺|espouse means to adopt and support a cause, not to break one's word|espouse 指拥护，不是背弃诺言|re · nege|re- plus nege, with the -ege ending|re- 加 nege，结尾是 -ege
      flout|drivers openly racing past the police|wearing jeans openly to formal dinners|casting nets in plain sight of the guards|flout openly disregards; acquiesce quietly accepts|flout 公然无视；acquiesce 默许|acquiesce means to accept quietly, the opposite of breaking a rule in plain sight|acquiesce 指默默接受，和当众违反规则正相反|forestall means to prevent something ahead of time, not to break a rule openly|forestall 指事先阻止，不是公然违规|flout|fl plus out|fl 加 out
      forestall|settling a dispute before workers could walk out|stopping fraud before it can happen|answering questions before anyone could ask|forestall prevents ahead of time; goad provokes into action|forestall 预先阻止；goad 刺激行动|goad means to provoke someone into action, the opposite of stopping a strike before it starts|goad 指刺激人行动，和在罢工开始前阻止它正相反|garner means to gather or collect, not to prevent something before it happens|garner 指收集，不是事先阻止|fore · stall|fore- plus stall|fore- 加 stall
      stymie|red tape holding up a project for months|lack of money bringing research to a halt|injuries blocking every step toward a title|stymie blocks progress; expedite speeds it up|stymie 阻碍；expedite 加快|expedite means to speed up, the opposite of holding up a project or halting research|expedite 指加快，和拖延项目或使研究停顿正相反|garner means to gather support, not to block progress|garner 指收集支持，不是阻碍进展|sty · mie|the y after st and the -ie ending|st 后面是 y，结尾是 -ie
      goad|mocking and insulting a man until he lost his temper|sneers stinging a woman's pride until she moves|taunts pushing someone to do something foolish|goad provokes into action; cajole persuades with flattery|goad 刺激；cajole 哄劝|entreat means to beg earnestly, not to push with mocking and insults|entreat 指恳求，不是用嘲弄侮辱去激人|cajole means to persuade with flattery, the opposite of mocking and taunting|cajole 指用奉承劝诱，和嘲讽挑衅正相反|goad|g plus oad, as in road|g 加 oad，同 road
      entreat|begging someone again and again not to leave|prisoners on their knees pleading for their lives|a plea to listen before it is too late|entreat begs earnestly; goad provokes|entreat 恳求；goad 刺激|goad means to provoke or annoy into action, not to beg with tears|goad 指激怒刺激，不是含泪恳求|flout means to openly disregard, not to plead for mercy|flout 指公然藐视，不是乞求宽恕|en · treat|en- plus treat|en- 加 treat
      espouse|supporting women's rights all her life|arguing for free trade with conviction|adopting simple living and urging others to follow|espouse adopts and supports a cause; repudiate rejects it|espouse 拥护；repudiate 拒绝接受|repudiate means to refuse to accept, the opposite of supporting a cause all one's life|repudiate 指拒绝接受，和终生支持某事业正相反|flout means to openly disregard a rule, not to adopt and argue for a belief|flout 指公然无视规则，不是信奉并倡导某种理念|es · pouse|es- plus pouse, with the -ouse ending|es- 加 pouse，结尾是 -ouse
      garner|collecting praise from critics everywhere|gathering signatures from every neighbor|winning young people's votes one by one|garner gathers; squander wastes|garner 收集；squander 浪费|squander means to waste recklessly, the opposite of gathering praise and votes|squander 指挥霍浪费，和收集赞誉与选票正相反|relinquish means to give up, the opposite of collecting support|relinquish 指放弃，和争取支持正相反|gar · ner|gar- plus -ner|gar- 加 -ner
    `,
  },
);

const darkTimes = batch(
  "words-of-dark-times",
  ["Words of Dark Times", "黑暗时期的词"],
  ["bad luck, deadlocks, chaos and the hated", "厄运、僵局、混乱与被憎恶者"],
  `
  hapless|unfortunate|不幸的，倒霉的|The ___ tourist, liked by everyone he met, lost his passport twice and then missed his flight.|Our ___ team, through no fault of its own, lost again when the rain washed out its winning lead.|The ___ driver, a kind old man, ran out of fuel in a storm miles from any town.|odious,virulent|haplessly
  harbinger|a person or thing that signals what is coming|先兆，预兆|The first robin is a ___ of spring, a sign that warmer days are coming.|The strike was a ___ of worse to come, an early sign of the riots that followed.|Dark clouds on the horizon are a ___ of rain later in the day.|nadir,maelstrom|harbingers
  impasse|a situation in which no progress is possible|僵局|The talks were at a total ___: neither side would move an inch, and no progress was possible.|They finally broke the ___ with a new offer after months of standstill.|The ___ lasted for weeks, a silent deadlock in which nothing moved at all.|maelstrom,harbinger|
  maelstrom|a powerful whirlpool; a situation of confused turmoil|大漩涡；动乱|The ship was caught in the ___, a huge whirlpool that spun it round and round.|She was drawn into the ___ of rumors, a wild whirl of gossip that spun out of control.|During the riots the city was caught in the ___ of noise, fire and running crowds.|impasse,milieu|
  morass|an area of muddy ground; a complicated situation|沼泽；困境|The army was stuck in a ___ of mud, its trucks sinking deeper with every step.|They got lost in a ___ of rules, a tangled swamp of forms that slowed everything down.|The project sank slowly into a ___ of debt, each loan pulling it deeper.|maelstrom,milieu|
  nadir|the lowest point|最低点|The defeat was the ___ of his career, the lowest point he ever reached.|Morale reached its ___ in the dark winter, sinking lower than ever before.|Sales hit their ___ in May, the worst month in the company's history.|epitome,harbinger|
  pariah|an outcast|被排斥的人，贱民|After the scandal he became a ___, shunned by every friend and colleague.|For years the country was treated as a ___, cut off by every other nation.|At her new school she felt like a ___, left out and avoided by everyone.|paragon,magnate|pariahs
  odious|extremely unpleasant; hateful|可憎的|Cleaning the sewers was ___, a disgusting, hateful job that no one wanted.|The man was ___, insulting everyone and hated by all who knew him.|They found the idea ___, so hateful that they refused even to discuss it.|amiable,innocuous|odiously
  inimical|tending to obstruct or harm; hostile|有害的，敌意的|Smoke is ___ to health, harming the lungs with every breath.|The new tax is ___ to growth, holding back businesses that want to expand.|He was ___ toward strangers, treating every visitor with open hostility.|conducive,innocuous|
  virulent|extremely severe or harmful; bitterly hostile|剧毒的；恶毒的|This strain of flu is ___, spreading fast for months and killing thousands.|His attack on the plan was ___, full of bitter, hostile fury.|The disease was ___, so severe that it killed thousands within weeks.|innocuous,transient|virulence
  `,
  "context-clues",
  {
    intro: t(
      "The war was a **harbinger** of hard years: talks reached an **impasse**, the nation sank into a **morass** of debt, and the **hapless** leader who signed the treaty became a **pariah**. These ten words help you describe bad luck, deadlocks, chaos and the hated.",
      "战争预示（**harbinger**）着艰难岁月的到来：谈判陷入僵局（**impasse**），国家陷入债务的泥潭（**morass**），签下条约的那位倒霉的（**hapless**）领导人成了人人唾弃的人（**pariah**）。这十个词帮你描写厄运、僵局、混乱和被憎恶的人。",
    ),
    watchOut: {
      meanings: t(
        "An **impasse** is a *standstill* where nothing moves; a **maelstrom** is a *whirl* of wild movement; a **morass** is a muddy *swamp* that slowly drags you down. The **nadir** is the *lowest* point.",
        "**impasse** 是一切*停滞*的僵局；**maelstrom** 是狂乱的*漩涡*；**morass** 是慢慢把人拖下去的*泥沼*。**nadir** 是*最低点*。",
      ),
      use: t(
        "**Hapless** means *unlucky*, not bad; **odious** means *hateful*. **Inimical** takes *to*, as in *inimical to health*; **virulent** describes a disease or an attack that is *fierce*.",
        "**hapless** 指*倒霉*，不是坏；**odious** 指*可憎*。**inimical** 后接 to，如 inimical to health；**virulent** 形容*猛烈*的疾病或攻击。",
      ),
      spelling: t(
        "Watch the *ae* of **maelstrom**, the double *s* of **morass**, the *-inger* of **harbinger**, and the *-ious* of **odious**.",
        "注意 **maelstrom** 里的 ae、**morass** 的双写 s、**harbinger** 的 -inger，以及 **odious** 的 -ious。",
      ),
    },
    notes: `
      hapless|a well-liked tourist who lost his passport twice and missed his flight|a team losing through no fault of its own when rain washed out its lead|a kind old driver out of fuel in a storm|hapless is unlucky; odious is hateful|hapless 倒霉；odious 可憎|odious means hateful, but these people were liked, kind and not at fault|odious 指可憎，而这些人受人喜爱、善良、并无过错|virulent means fiercely harmful or hostile, not unlucky|virulent 指剧烈有害或充满敌意，不是倒霉|hap · less|hap meaning luck, plus -less|表示运气的 hap 加 -less
      harbinger|a first robin as a sign that warmer days are coming|a strike as an early sign of riots|dark clouds as a sign of rain later|a harbinger signals what is coming; a nadir is the lowest point|harbinger 是预兆；nadir 是最低点|nadir is the lowest point, not a sign of what is coming|nadir 是最低点，不是预示未来的迹象|maelstrom is a whirl of turmoil, not an early sign|maelstrom 是混乱的漩涡，不是预兆|har · bin · ger|harbin- plus -ger, with the -inger ending|harbin- 加 -ger，结尾是 -inger
      impasse|talks where neither side would move an inch|a standstill broken after months by a new offer|a silent deadlock in which nothing moved|an impasse is a standstill; a maelstrom is wild movement|impasse 是僵局；maelstrom 是狂乱的漩涡|maelstrom is a whirl of wild turmoil, the opposite of a silent standstill|maelstrom 是狂乱的漩涡，和寂静的僵持正相反|harbinger is a sign of what is coming, not a deadlock where nothing moves|harbinger 是预兆，不是毫无进展的僵局|im · passe|im- plus passe, with the double s|im- 加 passe，双写 s
      maelstrom|a huge whirlpool spinning a ship round and round|a wild whirl of gossip spinning out of control|a city of noise, fire and running crowds|a maelstrom is a whirl of turmoil; an impasse is a standstill|maelstrom 是漩涡乱局；impasse 是僵局|impasse is a standstill where nothing moves, the opposite of spinning round and round|impasse 是毫无进展的僵局，和不停旋转正相反|milieu is a person's social setting, not a wild whirl of noise and fire|milieu 是社会环境，不是喧嚣与火光的狂乱漩涡|mael · strom|the ae of mael- and the -strom ending|mael- 里是 ae，结尾是 -strom
      morass|trucks sinking deeper in mud with every step|a tangled swamp of forms that slowed everything|a project pulled deeper by each loan|a morass slowly drags one down; a maelstrom spins wildly|morass 是慢慢陷下去的泥沼；maelstrom 是狂乱的漩涡|maelstrom is a fast, wild whirl, not a slow swamp that drags one deeper|maelstrom 是快速狂乱的漩涡，不是慢慢把人拖下去的泥沼|milieu is a social setting, not mud, rules or debt that trap one|milieu 是社会环境，不是困住人的泥浆、规定或债务|mo · rass|mor- plus -ass, with the double s|mor- 加 -ass，双写 s
      nadir|the lowest point of a man's career|morale sinking lower than ever in winter|the worst month in a company's history|the nadir is the lowest point; the epitome is the perfect example|nadir 是最低点；epitome 是完美典范|epitome is a perfect example of a quality, not the lowest point|epitome 是某种品质的完美范例，不是最低点|harbinger is a sign of what is coming, not the lowest point reached|harbinger 是预兆，不是所到达的最低点|na · dir|na plus dir, with the -ir ending|na 加 dir，结尾是 -ir
      pariah|a man shunned by every friend after a scandal|a country cut off by every other nation|a new girl left out and avoided by everyone|a pariah is shunned by all; a paragon is admired by all|pariah 被所有人排斥；paragon 受所有人敬仰|paragon is a model everyone admires, the opposite of someone everyone shuns|paragon 是人人敬仰的楷模，和人人回避的人正相反|magnate is a rich, powerful business leader, not someone left out and avoided|magnate 是有钱有势的商业巨头，不是被冷落回避的人|pa · ri · ah|the -iah ending|结尾是 -iah
      odious|a disgusting, hateful job cleaning sewers|a man who insulted everyone and was hated by all|an idea so hateful it would not be discussed|odious is hateful; amiable is friendly|odious 可憎；amiable 和蔼|amiable means friendly and pleasant, the opposite of insulting everyone|amiable 指和蔼可亲，和侮辱所有人正相反|innocuous means harmless and inoffensive, the opposite of disgusting and hateful|innocuous 指无害、不冒犯人，和令人厌恶憎恨正相反|o · di · ous|odi- plus -ous, as in odium|odi- 加 -ous
      inimical|smoke harming the lungs with every breath|a tax holding back businesses that want to expand|a man treating every visitor with open hostility|inimical is harmful or hostile; conducive is helpful|inimical 有害或敌对；conducive 有利|conducive means helping something happen, the opposite of holding businesses back|conducive 指有助于，和阻碍企业发展正相反|innocuous means harmless, the opposite of smoke harming the lungs|innocuous 指无害，和损害肺部的烟雾正相反|in · im · i · cal|in- plus imic- plus -al|in- 加 imic- 再加 -al
      virulent|a flu spreading fast for months and killing thousands|an attack full of bitter, hostile fury|a disease so severe it killed thousands in weeks|virulent is fiercely harmful; innocuous is harmless|virulent 剧烈有害；innocuous 无害|innocuous means harmless, the opposite of killing thousands|innocuous 指无害，和造成数千人死亡正相反|transient means lasting only a short time, not a flu that spread for months|transient 指短暂，不是蔓延数月的流感|vir · u · lent|vir- as in virus, plus -ulent|vir- 同 virus，加 -ulent
    `,
  },
);

const everyday = batch(
  "words-of-the-commonplace-and-the-spreading",
  ["Words of the Commonplace and the Spreading", "寻常与蔓延的词"],
  ["the daily, the widespread, the growing and the trite", "日常、普遍、增长与陈词"],
  `
  quotidian|of or occurring every day; ordinary|日常的，平凡的|The novel shows the ___ life of a farmer, the ordinary round of milking, feeding and mending he does every day.|She tired of ___ chores, the same small jobs of washing and sweeping repeated daily.|The film turns ___ events, such as breakfast and the bus ride to work, into drama.|prodigious,unprecedented|
  rife|of something bad, widespread|充斥的，普遍的|The city was ___ with crime, with robberies reported on almost every street.|Rumors were ___ in the village, spreading from house to house and doing real harm.|The essay is ___ with errors, with mistakes on nearly every line.|devoid,innocuous|
  pervade|to spread through and be noticeable in every part|弥漫，遍及|The smell of fresh bread began to ___ the house, drifting into every room.|After the attack, a sense of fear seemed to ___ the town, felt in every street and home.|Gentle humor should ___ the whole book, showing up on every page.|dissipate,curtail|pervaded
  burgeon|to begin to grow or increase rapidly|迅速发展|Cities ___ as people move from farms, swelling quickly with new homes and roads.|After the war, trade began to ___, growing faster every year.|Her young career seemed set to ___, rising fast after her first success.|languish,abate|burgeoned,burgeoning
  seminal|strongly influencing later developments|影响深远的，开创性的|Her book on economics was ___, shaping how every later scholar thought about money.|The paper on genes she wrote was ___, the starting point for decades of later research.|The film proved ___, influencing a whole generation of directors who followed.|frivolous,inconsequential|
  panacea|a solution for all difficulties or diseases|万灵药|The man in the old tale sold a ___, a potion he claimed would cure every disease.|Some saw technology as a ___ that would solve all the world's troubles at once.|There is no ___ for sadness; nothing cures every sorrow at once.|platitude,modicum|
  platitude|a remark used too often to be interesting|陈词滥调|He ended his speech with a tired ___, "Every cloud has a silver lining," that no one even heard anymore.|"Things happen for a reason" is a worn ___, repeated so often it means almost nothing.|Instead of real help, she offered a dull ___, the same old saying everyone had heard.|panacea,tirade|platitudes
  modicum|a small quantity of something|少量|He showed only a ___ of respect, just a little, and then turned away.|With a ___ of luck, just a small amount, we might still win.|Even a ___ of effort, just a little each day, will help.|myriad,platitude|
  motley|made up of different people or things that do not go well together|混杂的|The crew of sailors who joined the ship was ___: old and young, from twenty countries, with little in common.|Their clothes were ___, odd hats, torn coats and bright scarves that did not match.|The crowd that gathered in the square was ___, bankers beside beggars and children beside soldiers.|conventional,insular|
  milieu|a person's social environment|社会环境|She grew up in the artistic ___ of the city, surrounded by painters and poets.|Shy and plain, he felt out of place in that glittering ___ of the rich and famous.|The novel captures the ___ of 1920s Paris, its cafés, artists and parties.|hierarchy,harbinger|
  `,
  "context-clues",
  {
    intro: t(
      "In the **quotidian** life of the town, rumors were **rife**, worry seemed to **pervade** every street, and the mayor offered only a tired **platitude** instead of a real plan. These ten words help you describe the everyday, the widespread, the growing and the worn out.",
      "在这个小镇的日常（**quotidian**）生活中，谣言四起（**rife**），忧虑似乎弥漫（**pervade**）在每条街道，而镇长只给出一句陈词滥调（**platitude**），拿不出真正的计划。这十个词帮你描写日常、普遍、增长和陈旧的事物。",
    ),
    watchOut: {
      meanings: t(
        "**Rife** is used for *bad* things that are widespread, as in *rife with crime*; **pervade** means to *spread through* every part. A **panacea** is a cure for *everything*; a **platitude** is a remark used *too often*.",
        "**rife** 用于普遍存在的*坏*事，如 rife with crime；**pervade** 指*弥漫*到每个部分。**panacea** 是包治*百病*的万灵药；**platitude** 是*用滥了*的话。",
      ),
      use: t(
        "**Burgeon** means to *grow fast*; **seminal** describes a work that *influences* what comes after. A **modicum** is a *small* amount, while a **motley** group is made of people who *do not match*.",
        "**burgeon** 指*迅速发展*；**seminal** 形容对后世*影响深远*的作品。**modicum** 是*少量*，而 **motley** 的群体由*彼此不搭*的人组成。",
      ),
      spelling: t(
        "Watch the *qu* and *-idian* of **quotidian**, the *-geon* of **burgeon**, the *-acea* of **panacea**, and the *-ieu* of **milieu**.",
        "注意 **quotidian** 的 qu 和 -idian、**burgeon** 的 -geon、**panacea** 的 -acea，以及 **milieu** 的 -ieu。",
      ),
    },
    notes: `
      quotidian|a farmer's ordinary round of milking, feeding and mending|small jobs of washing and sweeping repeated daily|breakfast and the bus ride to work turned into drama|quotidian is ordinary and daily; unprecedented has never happened before|quotidian 日常平凡；unprecedented 前所未有|prodigious means remarkably great, the opposite of small, ordinary daily jobs|prodigious 指大得惊人，和平凡的日常小事正相反|unprecedented means never known before, the opposite of repeated every day|unprecedented 指前所未有，和每天重复正相反|quo · tid · i · an|qu at the start and the -idian ending|开头是 qu，结尾是 -idian
      rife|robberies reported on almost every street|rumors spreading from house to house and doing harm|mistakes on nearly every line of an essay|rife is widespread, of bad things; devoid is entirely lacking|rife 充斥（坏事）；devoid 完全没有|devoid means entirely lacking, the opposite of robberies on almost every street|devoid 指完全没有，和几乎每条街都有抢劫正相反|innocuous means harmless, not crime, harmful rumors and errors|innocuous 指无害，不是犯罪、有害的谣言或错误|rife|r plus ife, as in life|r 加 ife，同 life
      pervade|a smell of bread drifting into every room|fear felt in every street and home|humor showing up on every page|pervade spreads through every part; dissipate scatters away|pervade 弥漫；dissipate 消散|dissipate means to scatter and fade away, the opposite of drifting into every room|dissipate 指消散，和飘进每个房间正相反|curtail means to cut short, the opposite of spreading through every part|curtail 指削减，和遍布每个部分正相反|per · vade|per- plus vade, as in invade|per- 加 vade，同 invade
      burgeon|cities swelling quickly with new homes and roads|trade growing faster every year|a career rising fast after a first success|burgeon grows fast; languish grows weak|burgeon 迅速发展；languish 衰弱|languish means to grow weak, the opposite of swelling and growing quickly|languish 指衰弱，和迅速壮大正相反|abate means to become less strong, the opposite of growing faster every year|abate 指减弱，和逐年加快增长正相反|bur · geon|bur- plus -geon, as in surgeon|bur- 加 -geon，同 surgeon
      seminal|a book shaping how every later scholar thought about money|a paper that started decades of later research|a film influencing a generation of directors|seminal strongly influences what follows; inconsequential has no effect|seminal 影响深远；inconsequential 无足轻重|frivolous means silly and without serious purpose, not shaping later scholars|frivolous 指轻浮无聊，不是影响后来的学者|inconsequential means unimportant, the opposite of starting decades of research|inconsequential 指无关紧要，和开启数十年研究正相反|sem · i · nal|semin- plus -al, as in seminar|semin- 加 -al，同 seminar
      panacea|a potion claimed to cure every disease|technology seen as solving all the world's troubles|a cure for every sorrow that does not exist|a panacea cures everything; a platitude is an overused remark|panacea 是万灵药；platitude 是陈词滥调|platitude is a dull, overused remark, not a cure for every disease or trouble|platitude 是陈腐的套话，不是包治百病的良方|modicum is a small amount, not a cure for all troubles|modicum 是少量，不是解决一切问题的办法|pan · a · ce · a|pan- meaning all, plus -acea|表示全部的 pan- 加 -acea
      platitude|an overused saying about silver linings no one heard anymore|things happen for a reason repeated so often it means nothing|the same old saying offered instead of help|a platitude is an overused remark; a tirade is a long, angry speech|platitude 是陈词滥调；tirade 是长篇怒斥|panacea is a cure for everything, not a worn saying no one hears|panacea 是万灵药，不是没人再听的老话|tirade is a long, angry speech, not a short, dull saying|tirade 是长篇怒斥，不是简短乏味的套话|plat · i · tude|plat- plus -itude, as in attitude|plat- 加 -itude，同 attitude
      modicum|just a little respect shown before turning away|just a small amount of luck|just a little effort each day|a modicum is a small amount; a myriad is a countless number|modicum 是少量；myriad 是无数|myriad means a countless number, the opposite of just a little|myriad 指无数，和一点点正相反|platitude is an overused remark, not a small amount of respect, luck or effort|platitude 是陈词滥调，不是少量的尊重、运气或努力|mod · i · cum|mod- plus -icum|mod- 加 -icum
      motley|sailors old and young from twenty countries with little in common|odd hats, torn coats and bright scarves that did not match|bankers beside beggars and children beside soldiers|motley is mixed and mismatched; conventional is the usual and uniform|motley 混杂；conventional 常规|conventional means the usual thing most people do, not a mismatched mix|conventional 指常规做法，不是杂乱的混合|insular means keeping to one's own small group, the opposite of a crowd from every walk of life|insular 指只守着自己的小圈子，和来自各行各业的人群正相反|mot · ley|mot- plus -ley|mot- 加 -ley
      milieu|a childhood among painters and poets|a glittering world of the rich and famous|the cafés, artists and parties of 1920s Paris|a milieu is a social setting; a hierarchy is a system of ranks|milieu 是社会环境；hierarchy 是等级制度|hierarchy is a ladder of ranks, not a world of painters, cafés and parties|hierarchy 是等级阶梯，不是画家、咖啡馆和聚会组成的世界|harbinger is a sign of what is coming, not the social world a person lives in|harbinger 是预兆，不是一个人生活的社会环境|mi · lieu|mil- plus -ieu, from French|mil- 加 -ieu，来自法语
    `,
  },
);

/** batchesE are the batches of company, leanings, the relentless, trimming writing, means, yielding, dark times and the commonplace. */
export const batchesE: readonly BatchSpec[] = [company, leanings, relentless, trimming, means, yielding, darkTimes, everyday];
