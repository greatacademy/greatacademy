// Grade 11: the batches of words of stubborn and fickle minds, of how much and how little, of keeping and letting go,
// of dislike and lightness, of doubt and belief, of excellence, of hardship and of the ranks and types of society.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const stubborn = batch(
  "words-of-firm-and-fickle-minds",
  ["Words of Firm and Fickle Minds", "坚定与多变心志的词"],
  ["holding fast, changing often and caring much or little", "坚持、多变与在乎的多少"],
  `
  adamant|refusing to be persuaded or to change one's mind|坚决的，固执的|She was ___ that she had locked the door.|He remained ___ in his refusal.|The ___ coach would not change the team.|obstinate,amenable|adamantly
  obstinate|stubbornly refusing to change one's opinion|固执的，顽固的|The ___ mule would not move.|He was too ___ to say sorry.|An ___ cough kept her awake.|adamant,capricious|obstinately,obstinacy
  incorrigible|not able to be corrected or reformed|无可救药的|He is an ___ liar.|The ___ boy kept playing tricks.|She is an ___ optimist.|inveterate,amenable|incorrigibly
  inveterate|having a long-standing habit that is unlikely to change|积习难改的|He is an ___ gambler.|She was an ___ reader of novels.|Her ___ lateness annoyed us.|incorrigible,erratic|
  amenable|open and responsive to suggestion|顺从的，愿意接受的|She was ___ to the new plan.|The boss is ___ to change.|The patient was ___ to treatment.|adamant,obstinate|
  capricious|given to sudden changes of mood or behavior|反复无常的|The ___ queen changed her mind daily.|Spring weather is ___.|A ___ boss is hard to work for.|erratic,obstinate|capriciously
  erratic|not even or regular in pattern or movement|不稳定的，古怪的|His ___ driving alarmed us.|The patient's pulse was ___.|Her work has been ___ this term.|capricious,inveterate|erratically
  fervent|having or showing passionate intensity|热烈的，强烈的|She is a ___ supporter of the team.|He said a ___ prayer.|They had a ___ hope of peace.|zealous,nonchalant|fervently,fervor
  zealous|showing great energy or enthusiasm for a cause|热心的，狂热的|The ___ fans painted their faces.|A ___ officer stopped every car.|She was ___ in her work for the poor.|fervent,nonchalant|zealously,zeal
  nonchalant|calm and relaxed; seeming not to care|若无其事的，漠不关心的|He gave a ___ shrug.|She was ___ about the exam.|His ___ manner hid his nerves.|zealous,adamant|nonchalantly,nonchalance
  `,
);

const extent = batch(
  "words-of-much-and-little",
  ["Words of Much and Little", "多与少的词"],
  ["great numbers, emptiness and small importance", "大量、空无与无足轻重"],
  `
  myriad|a countless or very great number|无数，大量|The sky was full of a ___ of stars.|There are ___ ways to cook rice.|The city offers a ___ of choices.|replete,diminutive|
  replete|filled or well supplied with something|充满的|The book is ___ with jokes.|The house was ___ with old furniture.|History is ___ with wars.|devoid,inundate|
  devoid|entirely lacking or free from|完全没有的|The room was ___ of furniture.|His voice was ___ of feeling.|The desert is ___ of life.|replete,prolific|
  inundate|to flood; to overwhelm with things to deal with|淹没；使应接不暇|The river will ___ the fields.|Fans ___ the station with calls.|We were about to ___ the office with letters.|replete,palpable|inundated
  prolific|producing much fruit, work or offspring|多产的|She is a ___ writer of crime novels.|Rabbits are ___ breeders.|He was a ___ scorer.|myriad,devoid|prolifically
  diminutive|extremely small|极小的|The ___ dancer leapt across the stage.|A ___ house sat at the end of the lane.|"Bill" is a ___ of "William."|peripheral,conspicuous|
  peripheral|on the edge; of secondary importance|外围的；次要的|The town sits on the ___ area of the city.|That issue is ___ to the debate.|He played a ___ role.|inconsequential,conspicuous|
  inconsequential|not important or significant|无关紧要的|They chatted about ___ things.|The error was ___.|It is an ___ detail.|peripheral,palpable|
  palpable|so intense as to be almost touched or felt; obvious|可感知的；明显的|The tension in the room was ___.|There was ___ relief in her voice.|It was a ___ lie.|conspicuous,inconsequential|palpably
  conspicuous|standing out so as to be clearly visible|显眼的，引人注目的|He wore a ___ red hat.|There was a ___ lack of support.|She felt ___ in her bright dress.|palpable,diminutive|conspicuously
  `,
);

const keeping = batch(
  "words-of-holding-and-letting-go",
  ["Words of Holding and Letting Go", "保持与放弃的词"],
  ["joining, giving up, wasting and fading", "结合、放弃、浪费与衰退"],
  `
  consolidate|to make stronger; to combine into one|巩固；合并|The team will ___ its lead.|They want to ___ the two schools.|Review helps ___ what you have learned.|coalesce,relinquish|consolidated,consolidation
  coalesce|to come together to form one mass or whole|联合，合并|Small groups began to ___ into a movement.|The drops ___ into a puddle.|Ideas slowly ___ into a plan.|consolidate,languish|coalesced
  relinquish|to give up willingly|放弃，交出|He would not ___ control of the company.|She had to ___ her claim.|The king refused to ___ the throne.|rescind,squander|relinquished
  rescind|to cancel a law, order or agreement|废除，撤销|The council voted to ___ the ban.|They chose to ___ the offer.|The school will ___ the rule.|relinquish,relegate|rescinded
  relegate|to move to a lower rank or position|降级，贬谪|They tried to ___ her to a small office.|The loss may ___ the team to the second division.|Don't ___ this issue to the end of the meeting.|rescind,consolidate|relegated,relegation
  squander|to waste money, time or chances in a reckless way|挥霍，浪费|Don't ___ your savings on games.|He would ___ every chance he got.|They ___ a two-goal lead.|relinquish,languish|squandered
  languish|to grow weak; to be kept in an unpleasant place or state|衰退；受煎熬|Plants ___ without water.|He was left to ___ in prison.|The project began to ___ for lack of money.|stagnant,squander|languished
  stagnant|not flowing; showing no activity or growth|不流动的；停滞的|Mosquitoes breed in ___ water.|Wages have been ___ for years.|The economy is ___.|defunct,transient|stagnate
  defunct|no longer existing or working|不再存在的，失效的|The factory is now ___.|He collects stamps of ___ countries.|The law has been ___ for years.|stagnant,transient|
  transient|lasting only for a short time|短暂的|Fame can be ___.|The town has a ___ population of students.|The pain was ___.|defunct,coalesce|transience
  `,
);

const dislike = batch(
  "words-of-dislike-and-levity",
  ["Words of Dislike and Levity", "厌恶与轻松的词"],
  ["annoyance, hatred, coldness and light humor", "恼怒、憎恶、冷漠与轻松幽默"],
  `
  chagrin|annoyance or distress at having failed or been humiliated|懊恼，失望|To his ___, he came second again.|She hid her ___ with a smile.|Much to our ___, it rained.|aversion,levity|chagrined
  aversion|a strong dislike|厌恶，反感|She has an ___ to cats.|He has an ___ to hard work.|They share an ___ to risk.|animosity,apathy|averse
  animosity|strong hostility|仇恨，敌意|There was no ___ between the rivals.|Years of ___ split the family.|Her ___ toward him grew.|aversion,chagrin|animosities
  apathy|lack of interest, enthusiasm or concern|冷漠，无兴趣|Voter ___ is high this year.|His ___ worried his teachers.|She fought public ___ toward the poor.|indifferent,levity|apathetic
  abhor|to regard with disgust and hatred|憎恶，厌恶|I ___ cruelty to animals.|She seemed to ___ violence.|They ___ lies.|exasperate,aversion|abhorred,abhorrent
  levity|humor or lack of seriousness, especially when it is not suitable|轻率，不严肃|A moment of ___ eased the tension.|His ___ at the funeral upset everyone.|There was no ___ in her voice.|apathy,pensive|
  pensive|engaged in deep or serious thought|沉思的|She looked out the window in a ___ mood.|He grew quiet and ___.|The portrait shows a ___ girl.|querulous,levity|pensively
  querulous|complaining in a whining manner|爱抱怨的，发牢骚的|The ___ old man grumbled about the food.|A ___ voice called from upstairs.|The ___ child wanted more sweets.|pensive,indifferent|querulously
  indifferent|having no particular interest or sympathy; mediocre|漠不关心的；平庸的|She seemed ___ to his pleas.|He is ___ to fashion.|The food was ___.|apathy,querulous|indifference
  exasperate|to irritate intensely|激怒，使恼火|His constant lateness began to ___ her.|Delays ___ travelers.|The noise will ___ the neighbors.|abhor,chagrin|exasperating,exasperation
  `,
);

const doubt = batch(
  "words-of-doubt-and-belief",
  ["Words of Doubt and Belief", "怀疑与相信的词"],
  ["what is uncertain, what is false and who believes it", "不确定的、虚假的与谁相信"],
  `
  dubious|hesitating or doubting; not to be relied on|怀疑的；可疑的|I was ___ about the plan.|He has a ___ reputation.|The claim is ___.|equivocal,credulous|dubiously
  equivocal|open to more than one interpretation; ambiguous|模棱两可的|Her answer was ___.|The evidence is ___.|He gave an ___ reply to avoid trouble.|dubious,infallible|
  illusory|based on illusion; not real|虚幻的|The gains proved ___.|Their safety was ___.|The calm was ___.|elusive,infallible|
  elusive|difficult to find, catch or achieve|难以捉摸的，难找到的|Success remained ___.|The ___ fox escaped the hounds.|The answer is ___.|illusory,oblivious|elusively
  infallible|incapable of making mistakes or being wrong|永无过失的，绝对可靠的|No doctor is ___.|They believed the leader was ___.|There is no ___ test.|equivocal,credulous|infallibility
  credulous|too ready to believe things|轻信的|The ___ tourists bought the fake gold.|Only a ___ reader would believe that.|He was ___ and easily fooled.|cognizant,dubious|credulity
  cognizant|having knowledge or awareness|认识到的，知晓的|We are ___ of the risks.|She was ___ of his feelings.|Be ___ of the rules.|oblivious,credulous|cognizance
  oblivious|not aware of what is happening around one|未察觉的，不注意的|He was ___ to the danger.|She seemed ___ of the noise.|They walked on, ___ of the rain.|cognizant,elusive|obliviously
  construe|to interpret a word or action in a particular way|理解，解释|Some may ___ his silence as consent.|Don't ___ my words as a threat.|How should we ___ this remark?|conundrum,illusory|construed
  conundrum|a confusing and difficult problem or question|难题，谜语|Where to put everyone was a ___.|It is a moral ___.|The riddle was a real ___.|construe,illusory|conundrums
  `,
);

const excellence = batch(
  "words-of-excellence-and-awe",
  ["Words of Excellence and Awe", "卓越与敬畏的词"],
  ["the best of things and the honor they win", "事物的最佳状态及所获敬仰"],
  `
  epitome|a perfect example of a quality or type|典范，缩影|She is the ___ of calm.|The hotel is the ___ of luxury.|He was the ___ of a gentleman.|paragon,charisma|epitomize
  paragon|a model of excellence or of a particular quality|模范，典范|She was a ___ of virtue.|He is no ___ of patience.|The school sees him as a ___.|epitome,adulation|paragons
  exemplary|serving as a desirable model; very good|模范的，典范的|Her behavior was ___.|He has an ___ record.|They received ___ punishment as a warning.|impeccable,profound|
  impeccable|in accordance with the highest standards; faultless|无可挑剔的|She has ___ manners.|His timing was ___.|The house was kept in ___ order.|exemplary,pristine|impeccably
  pristine|in its original condition; perfectly clean|原始的；崭新的|The car is in ___ condition.|They walked on ___ beaches.|The ___ forest had never been logged.|impeccable,ineffable|
  profound|very great or intense; showing deep insight|深远的；深刻的|The war had a ___ effect on him.|She made a ___ remark.|There was a ___ silence.|ineffable,exemplary|profoundly,profundity
  ineffable|too great or extreme to be expressed in words|难以言喻的|They felt an ___ joy.|The view had an ___ beauty.|The poem speaks of ___ things.|profound,venerate|
  venerate|to regard with great respect|崇敬，敬重|The people ___ their ancestors.|Many ___ the old poet.|They ___ the saint at this shrine.|adulation,paragon|venerated,veneration
  adulation|excessive admiration or praise|奉承，过度赞扬|The singer basked in the ___ of her fans.|He grew tired of the ___.|The hero's ___ lasted a week.|venerate,charisma|
  charisma|compelling attractiveness or charm that inspires devotion|魅力，号召力|The leader had great ___.|Her ___ won the voters.|He lacked ___ on stage.|adulation,epitome|charismatic
  `,
);

const hardship = batch(
  "words-of-harshness-and-hardship",
  ["Words of Harshness and Hardship", "严厉与艰苦的词"],
  ["strict rules, heavy burdens and misery", "严格的规定、沉重的负担与苦难"],
  `
  stringent|strict, precise and exacting|严格的|The rules on safety are ___.|They face ___ tests.|The bank set ___ conditions for the loan.|onerous,callous|stringently
  onerous|involving heavy effort and difficulty; burdensome|繁重的|It was an ___ duty.|The ___ task fell to her.|The new rules were ___.|stringent,grievous|
  grievous|very severe or serious|严重的，极严重的|He suffered ___ injuries.|It was a ___ error.|The loss was a ___ blow.|abject,onerous|grievously
  abject|extremely bad or unpleasant; without pride|凄惨的；卑躬屈膝的|They live in ___ poverty.|The plan was an ___ failure.|He made an ___ apology.|squalid,grievous|abjectly
  squalid|extremely dirty and unpleasant; morally degraded|肮脏的；卑劣的|They lived in a ___ hut.|The prison was ___.|It was a ___ affair.|abject,acrid|squalor
  acrid|unpleasantly bitter or sharp to the smell or taste|辛辣的，刺鼻的|___ smoke filled the room.|The ___ smell of burning rubber made us cough.|He gave an ___ reply.|abrasive,squalid|
  abrasive|rough and able to wear away; harsh in manner|粗糙的，有研磨作用的；粗鲁的|Use an ___ cloth to clean the pan.|His ___ manner upset the staff.|The ___ paste scratched the glass.|acrid,callous|abrasively
  callous|showing a cruel disregard for others|冷酷无情的|It was a ___ act.|The ___ landlord evicted the family.|His ___ remark shocked us.|abrasive,stringent|callously,callousness
  debilitate|to make someone very weak and infirm|使衰弱|The illness began to ___ him.|Long strikes ___ the economy.|Heat can ___ older people.|enervate,grievous|debilitated,debilitating
  enervate|to drain of energy or vitality|使衰弱，使无力|The heat began to ___ the runners.|Long meetings ___ me.|Illness can ___ the body.|debilitate,onerous|enervated,enervating
  `,
);

const society = batch(
  "words-of-ranks-and-types",
  ["Words of Ranks and Types", "等级与类型的词"],
  ["order in society and the kinds of people in it", "社会秩序与其中的各类人"],
  `
  hierarchy|a system in which members are ranked one above another|等级制度|He rose quickly through the ___.|The church has a strict ___.|There is a ___ of needs.|subordinate,conventional|hierarchical,hierarchies
  subordinate|lower in rank or position; a person under another's authority|下级的；下属|She praised her ___ for his work.|His needs are ___ to the team's.|A good manager listens to every ___.|hierarchy,indigenous|subordinates
  indigenous|originating or living naturally in a place|本土的，土著的|The kangaroo is ___ to Australia.|___ peoples have lived here for centuries.|They planted ___ trees.|conventional,iconoclast|
  conventional|based on what is generally done or believed|传统的，常规的|She wore a ___ suit to the interview.|___ wisdom says to save money.|They use ___ weapons.|traditionalist,iconoclast|conventionally
  iconoclast|a person who attacks cherished beliefs|打破传统观念的人|The ___ mocked the old traditions.|She was an ___ in the art world.|Every age needs an ___.|elitist,hedonist|iconoclastic
  hedonist|a person who believes pleasure is the most important thing in life|享乐主义者|The ___ spent his money on parties.|She lived like a ___ in Paris.|A true ___ avoids pain.|opportunist,pedantic|hedonism,hedonistic
  opportunist|a person who takes advantage of chances, often without regard for principles|机会主义者|The ___ changed parties to win.|A political ___ will say anything.|He was a clever ___.|hedonist,traditionalist|opportunistic,opportunism
  pedantic|too concerned with minor details or rules|学究式的，迂腐的|The ___ teacher marked every comma.|Don't be ___ about grammar.|His ___ speech bored the guests.|conventional,hedonist|pedant,pedantry
  traditionalist|a person who keeps to old customs and beliefs|传统主义者|The ___ refused to use a computer.|She is a ___ about weddings.|Every ___ hated the new design.|elitist,opportunist|traditionalists
  elitist|a person who believes a small group should lead or be favored; favoring such a group|精英主义者；精英主义的|The club was accused of being ___.|An ___ thinks only experts should vote.|They called the school ___.|traditionalist,iconoclast|elitism
  `,
);

/** batchesD are the batches of firm minds, much and little, letting go, dislike, doubt, excellence, hardship and ranks. */
export const batchesD: readonly BatchSpec[] = [stubborn, extent, keeping, dislike, doubt, excellence, hardship, society];
