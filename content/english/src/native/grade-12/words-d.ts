// Grade 12: the batches of words of rhetoric and logic, temperament and character, and belief and worship.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const rhetoric = batch(
  "words-of-rhetoric-and-oratory",
  ["Words of Rhetoric and Oratory", "修辞与演说的词"],
  ["the art of moving an audience", "打动听众的艺术"],
  `
  ethos|the appeal a speaker makes through his or her character and trustworthiness|人格诉求，信誉|The doctor's ___ came from thirty years of practice.|A speaker with no ___ is hard to believe.|She built her ___ by admitting her own mistakes.|pathos,oratory|
  pathos|the quality in a speech or story that makes people feel pity or sadness|感染力，哀婉|The ___ of the last scene made the audience cry.|His speech relied on ___ more than on facts.|There is real ___ in her letters from the war.|ethos,eulogy|
  antithesis|the placing of opposite ideas side by side; the exact opposite|对照，对偶；对立面|"Ask not what your country can do for you" is a famous ___.|Hate is the ___ of love.|The speech was built on ___: war and peace, fear and hope.|litotes,invective|antitheses,antithetical
  litotes|understatement that says something by denying its opposite, as in "not bad"|曲言法，反叙法|"She is no fool" is an example of ___.|The British love ___: "not the worst day".|By ___, "not small" means very large.|antithesis,harangue|
  invective|harsh, insulting language|谩骂，抨击|The letter was full of ___ against the judge.|He met criticism with a stream of ___.|Her ___ shocked even her supporters.|diatribe,eulogy|
  diatribe|a long, angry attack in speech or writing|长篇抨击|The column was a ___ against modern art.|He launched into a ___ about taxes.|The angry ___ attacked everyone in the room.|litotes,panegyric|diatribes
  harangue|a long, loud, scolding speech|长篇训斥|The coach gave the team a ___ at half time.|We sat through a ___ about manners.|The angry general's ___ at the troops lasted an hour.|eulogy,litotes|harangued
  eulogy|a speech that praises someone, especially one who has died|颂词，悼词|Her son gave the ___ at the funeral.|The ___ recalled his kindness to strangers.|The article was a ___ to the old cinema.|invective,litotes|eulogies
  panegyric|a speech or piece of writing full of praise|颂文，赞词|The biography is a ___, not an honest study.|The poet wrote a ___ to the emperor.|The review was close to a ___.|litotes,antithesis|
  oratory|the art of public speaking, or speaking of great skill|演说术，雄辩|Churchill's ___ lifted the nation.|She studied ___ at college.|The debate was won by ___, not by evidence.|ethos,harangue|
  `,
);

const logic = batch(
  "words-of-logic-and-error",
  ["Words of Logic and Error", "逻辑与谬误的词"],
  ["good and bad reasoning", "好的推理与坏的推理"],
  `
  fallacy|a mistaken belief, or a mistake in reasoning that makes an argument invalid|谬误，谬论|It is a ___ that money buys happiness.|The argument rests on a simple ___.|She spotted the ___ in his reasoning.|tautology,paradox|fallacies
  tautology|saying the same thing twice in different words, so that nothing is added|同义反复|"A free gift" is a ___.|"It is what it is" is a kind of ___.|The definition was a ___ and explained nothing.|fallacy,contradiction|tautological
  sophistry|clever but false reasoning meant to deceive|诡辩|The lawyer's ___ confused the jury.|His defense was pure ___.|Students learned to spot ___ in advertising.|tautology,counterexample|sophist
  casuistry|clever but dishonest reasoning about moral questions|诡辩(尤指道德问题)|By some ___, he decided that stealing from the rich was fair.|Her excuses were pure ___.|The essay exposes the ___ of the tobacco firms.|counterexample,tautology|
  counterexample|a single case that shows a general claim is false|反例|One black swan is a ___ to "all swans are white".|To disprove "all primes are odd", give the ___ 2.|A single ___ was enough to sink the theory.|contradiction,non sequitur|counterexamples
  contradiction|a statement that says the opposite of another, or of itself|矛盾|"A round square" is a ___.|There is a ___ between what he says and what he does.|Her two answers were in ___.|tautology,counterexample|contradictions,contradictory
  paradox|a statement that seems absurd or self-contradictory but may be true|悖论，似非而是的说法|It is a ___ that the more we know, the more we know we don't know.|The ___ of thrift says saving can make everyone poorer.|Zeno's ___ is about a race that can never end.|contradiction,fallacy|paradoxes,paradoxical
  plausible|seeming reasonable or likely to be true|貌似合理的|His excuse was ___ but false.|The theory is ___, but it needs testing.|She gave a ___ account of the night.|ad hominem,tautology|plausibly
  non sequitur|a statement that does not follow from what was said before|不合逻辑的推论|"It's raining, so I must be right" is a ___.|His answer was a ___ that nobody understood.|Every answer in the debate was a ___.|ad hominem,counterexample|non sequiturs
  ad hominem|attacking the person who makes an argument rather than the argument itself|人身攻击的|His attack was ___: it was about her, not her ideas.|The debate sank into ___ insults.|Keep personal and ___ remarks out of your essay.|plausible,non sequitur|
  `,
);

const temperament = batch(
  "words-of-the-four-temperaments",
  ["Words of the Four Temperaments", "四种气质的词"],
  ["moods and dispositions", "情绪与性情"],
  `
  phlegmatic|calm and not easily excited or upset|冷静的，迟钝的|The ___ captain did not panic in the storm.|Even the ___ judge raised an eyebrow.|He has a ___ nature and rarely shows anger.|sanguine,mercurial|
  choleric|easily made angry|易怒的|The ___ old man shouted at the children.|Her ___ temper scared her staff.|A ___ customer demanded to see the manager.|placid,sanguine|
  sanguine|cheerful and hopeful, even in a difficult situation|乐观的|She is ___ about her chances of winning.|The minister gave a ___ view of the economy.|Despite the bad news, he remained ___.|melancholic,petulant|
  melancholic|sad and gloomy by nature|忧郁的|The ___ poet wrote mostly about death.|A ___ tune drifted from the window.|He grew ___ as winter came.|sanguine,petulant|
  mercurial|changing mood or mind quickly and without warning|善变的，反复无常的|The ___ singer canceled the show at the last minute.|Her ___ moods made her hard to work with.|The ___ weather of the mountains can kill.|equable,stolid|
  placid|calm and peaceful, not easily disturbed|平静的，温和的|The ___ lake mirrored the trees.|The ___ cow chewed while the dogs barked.|He has a ___ temper.|choleric,mercurial|placidly
  stolid|calm and showing little emotion or interest|迟钝的，不易激动的|The ___ guard stared straight ahead.|Her ___ face gave nothing away.|The ___ farmers did not join the protest.|mercurial,irascible|stolidly
  equable|calm and even-tempered; steady, not extreme|平和的；稳定的|Her ___ manner calmed the angry crowd.|The island has an ___ climate.|He remained ___ through the long trial.|mercurial,choleric|
  irascible|quick to lose one's temper over small things|易怒的，暴躁的|The ___ editor tore up the article.|He became ___ when he was tired.|An ___ neighbor complained about every noise.|stolid,sanguine|
  petulant|childishly bad-tempered and sulky|任性的，闹脾气的|The ___ child refused to eat.|He gave a ___ reply and left the room.|The star's ___ demands annoyed the crew.|phlegmatic,equable|petulance,petulantly
  `,
);

const sociability = batch(
  "words-of-company-and-solitude",
  ["Words of Company and Solitude", "合群与孤僻的词"],
  ["how people behave with others", "人与他人相处的方式"],
  `
  gregarious|enjoying the company of others|爱交际的，合群的|The ___ host knew every guest by name.|Sheep are ___ animals.|She is ___ and never eats alone.|taciturn,reticent|
  affable|friendly and easy to talk to|和蔼可亲的|The ___ waiter remembered our order.|He was ___ even to his rivals.|An ___ manner helped her win votes.|dour,morose|affably
  genial|friendly and cheerful|亲切的，友好的|Our ___ landlord brought us a cake.|The ___ old doctor joked with every patient.|The meeting was ___ and short.|dour,diffident|genially
  jovial|cheerful and full of good humor|快活的，愉快的|The ___ uncle told jokes all evening.|The party was in a ___ mood.|His ___ laugh filled the room.|morose,taciturn|
  congenial|pleasant because suited to one's tastes; friendly|意气相投的；宜人的|She found the village a ___ place to write.|The work was not ___ to him.|The team was a ___ group.|dour,reticent|
  taciturn|saying very little|沉默寡言的|The ___ farmer answered with a nod.|He was ___ at dinner and left early.|A ___ man, he wrote long letters.|gregarious,jovial|
  reticent|not willing to say much about one's feelings or private life|沉默寡言的，有保留的|She was ___ about her past.|The ___ witness had to be pressed for details.|He is ___ in public but warm at home.|gregarious,affable|reticence
  diffident|shy and lacking confidence|羞怯的，缺乏自信的|The ___ student rarely spoke in class.|He gave a ___ smile.|Her ___ manner hid a sharp mind.|genial,jovial|diffidence
  morose|gloomy and bad-tempered|闷闷不乐的，阴郁的|He sat ___ in the corner.|The ___ guard ignored our questions.|After the loss, the team was ___.|jovial,affable|morosely
  dour|stern, gloomy and unfriendly|冷峻的，阴沉的|The ___ landlady never smiled.|The ___ gray town matched his mood.|A ___ judge read the sentence.|genial,congenial|
  `,
);

const pride = batch(
  "words-of-pride-and-humility",
  ["Words of Pride and Humility", "骄傲与谦卑的词"],
  ["thinking too much or too little of oneself", "自视过高或过低"],
  `
  haughty|proud and unfriendly, looking down on others|傲慢的|The ___ duchess ignored the servants.|She gave him a ___ look.|His ___ manner lost him friends.|unassuming,deferential|haughtily
  supercilious|behaving as if one is better than others|目中无人的，傲慢的|The ___ waiter sneered at our clothes.|She raised a ___ eyebrow.|His ___ tone annoyed the panel.|deferential,self-effacing|
  condescending|showing that one thinks oneself better or cleverer than others|居高临下的|His ___ explanation insulted the experts.|Don't be ___ to new members.|She spoke in a ___ voice.|self-effacing,unassuming|condescend,condescension
  conceited|too proud of oneself and one's abilities|自负的|The ___ actor talked only about himself.|He is clever but ___.|A ___ letter listed all her prizes.|unassuming,self-effacing|conceit
  arrogant|proud in an unpleasant way, thinking one is more important than others|傲慢的，自大的|The ___ manager never listened to his staff.|It was ___ to ignore the warnings.|Her ___ reply ended the talks.|servile,self-effacing|arrogance,arrogantly
  self-effacing|not drawing attention to oneself|谦逊的，不出风头的|The ___ scientist gave credit to her team.|His ___ humor charmed the audience.|She is ___ about her medals.|haughty,conceited|
  unassuming|modest and not wanting to be noticed|谦逊的，不装腔作势的|The ___ hero refused all interviews.|The restaurant is ___ but excellent.|He lived an ___ life in a small town.|conceited,arrogant|
  deferential|showing respect, especially by accepting another's opinion|恭敬的，顺从的|The young clerk bowed and was always ___ to the manager.|She spoke in a ___ tone.|His ___ manner hid his own views.|arrogant,haughty|deference
  servile|too eager to please or obey others|奴性的，卑躬屈膝的|The ___ courtiers praised every word of the king.|He hated the ___ tone of his letters.|The press was ___ to the government.|arrogant,haughty|servility
  fawning|trying to please someone by flattering them too much|奉承的，巴结的|___ reporters crowded around the star.|Her ___ praise embarrassed the author.|He wrote a ___ letter to the boss.|supercilious,haughty|fawn
  `,
);

const giving = batch(
  "words-of-generosity-and-greed",
  ["Words of Generosity and Greed", "慷慨与贪婪的词"],
  ["giving, keeping and wasting money", "给予、守财和挥霍"],
  `
  munificent|extremely generous|慷慨的，大方的|A ___ gift from a former student paid for the library.|The ___ king gave land to every soldier.|Her ___ support kept the theater open.|parsimonious,avaricious|munificence
  philanthropic|helping people, especially by giving money to good causes|慈善的|The ___ foundation built three hospitals.|He spent his last years on ___ work.|___ giving rose after the earthquake.|avaricious,miserly|philanthropist,philanthropy
  altruistic|caring about others' welfare more than one's own|利他的，无私的|Her ___ act saved a stranger's life.|Not every gift is ___.|Some animals show ___ behavior.|miserly,avaricious|
  avaricious|having an extreme desire for wealth|贪婪的|The ___ landlord raised the rent every year.|___ traders hoarded the grain.|He was ___ and never satisfied.|munificent,altruistic|avarice
  miserly|hating to spend money|吝啬的|The ___ old man lived in one cold room.|A ___ tip of ten cents insulted the waiter.|The company is ___ with pay rises.|prodigal,munificent|miser
  parsimonious|unwilling to spend money or use resources|过度节俭的，吝啬的|The ___ council cut every budget.|He was ___ with praise as well as money.|A ___ use of words made the poem sharp.|profligate,munificent|parsimony
  stingy|unwilling to give or spend|小气的|Don't be ___ with the sugar.|The ___ boss gave no bonuses.|The airline is ___ with legroom.|munificent,prodigal|stinginess
  prodigal|spending money or resources too freely; a person who does so|挥霍的；浪子|The ___ son spent his whole inheritance.|___ use of water dried up the lake.|The ___ returned home poor and sorry.|parsimonious,stingy|
  profligate|wildly and shamelessly wasteful|挥霍无度的|The ___ government ran up huge debts.|His ___ lifestyle ended in ruin.|___ spending on parties emptied the fund.|stingy,parsimonious|profligacy
  spendthrift|a person who spends money carelessly|挥霍者，败家子|The ___ had spent his salary by the fifth of the month.|She married a charming ___.|The ___ borrowed from every friend.|miserly,altruistic|spendthrifts
  `,
);

const temper = batch(
  "words-of-anger-and-calm",
  ["Words of Anger and Calm", "愤怒与平静的词"],
  ["losing one's temper and keeping it", "发脾气和保持冷静"],
  `
  irate|very angry|极其愤怒的|An ___ passenger shouted at the pilot.|The phone rang with ___ calls all day.|The ___ parents demanded a meeting.|unflappable,imperturbable|
  incensed|very angry because of something unfair|被激怒的|Villagers were ___ by the new tax.|She was ___ at the insult.|The ___ crowd marched to the town hall.|imperturbable,unflappable|incense
  livid|extremely angry; dark bluish in color|大怒的；青紫色的|Dad was ___ when he saw the car.|A ___ bruise covered his arm.|She was ___ with herself for forgetting.|unflappable,imperturbable|
  wrathful|full of great anger|愤怒的，暴怒的|The ___ gods sent a flood.|He gave her a ___ look.|A ___ letter arrived the next day.|unflappable,imperturbable|
  vexed|annoyed or worried; much discussed and difficult|恼火的；棘手的|She was ___ by the constant noise.|The ___ question of the border remains.|He sounded ___ on the phone.|imperturbable,unflappable|vex,vexing,vexation
  unflappable|staying calm in a crisis|处变不惊的|The ___ pilot landed the plane on one engine.|Our ___ teacher ignored the fire alarm prank.|She stayed ___ and calm under questioning.|livid,irate|
  imperturbable|unable to be upset or excited|沉着的，泰然自若的|The butler remained ___ as the guests fought.|His ___ calm annoyed his rivals.|An ___ face is useful at cards.|irate,livid|
  equanimity|calmness, especially in a difficult situation|镇定，沉着|She accepted the bad news with ___.|Meditation helped him keep his ___.|They faced the storm with ___.|placate,mollify|
  placate|to make someone less angry by doing or giving something|安抚|The manager offered a free meal to ___ the customer.|Nothing could ___ the angry fans.|He bought flowers to ___ his wife.|equanimity,vexed|placated,placating
  mollify|to calm someone's anger or reduce their worry|平息，缓和|The apology did not ___ her.|They tried to ___ the strikers with a small raise.|A gentle word may ___ a quarrel.|vexed,equanimity|mollified
  `,
);

const candor = batch(
  "words-of-deceit-and-candor",
  ["Words of Deceit and Candor", "欺骗与坦率的词"],
  ["lying, cheating and honesty", "说谎、欺骗与诚实"],
  `
  mendacious|not telling the truth; lying|撒谎的，虚假的|The ___ report hid the losses.|He was a ___ witness.|The ad made ___ claims about health.|ingenuous,guileless|mendacity
  disingenuous|pretending to know less or to be more honest than one really is|不真诚的，虚伪的|It is ___ to say you never saw the email.|Her surprise seemed ___.|The ___ apology fooled nobody.|artless,guileless|disingenuously
  guileful|clever in a sly way that tricks people|狡诈的|The ___ fox tricked the crow.|A ___ salesman sold him the broken car.|Her ___ smile hid her plan.|guileless,ingenuous|guile
  wily|skilled at gaining an advantage by cunning|诡计多端的|The ___ old general fooled the enemy.|A ___ lawyer found a loophole.|The ___ cat stole the fish.|ingenuous,artless|
  deceitful|trying to make people believe what is not true|欺骗的，欺诈的|The ___ servant stole from his master.|It was ___ to hide the damage.|A ___ friend is worse than an enemy.|guileless,artless|deceit
  ingenuous|innocent, trusting and open, sometimes too much so|天真的，坦率的|The ___ girl believed every story.|His ___ question made the room laugh.|Her ___ face showed every feeling.|disingenuous,wily|
  guileless|without any wish to trick or deceive|不狡诈的，天真无邪的|The ___ child told the truth.|He had a ___ smile.|Her ___ letters charmed the judges.|guileful,deceitful|
  artless|natural and simple, not trying to deceive|天真自然的，朴实的|Her ___ charm won everyone.|The child's ___ drawing was moving.|His ___ manner put people at ease.|disingenuous,guileful|artlessly
  impostor|a person who pretends to be someone else to trick others|冒名顶替者|An ___ claimed to be a doctor.|The prince turned out to be an ___.|She felt like an ___ in her new job.|fraud,wily|impostors
  fraud|the crime of deceiving people to get money; a person who does this|欺诈；骗子|He went to prison for ___.|The famous psychic was a ___.|Banks use software to detect ___.|impostor,deceitful|frauds,fraudulent
  `,
);

const worship = batch(
  "words-of-worship-and-belief",
  ["Words of Worship and Belief", "崇拜与信仰的词"],
  ["religion and the sacred", "宗教与神圣之物"],
  `
  sacred|holy, or connected with a god; deeply respected|神圣的|The river is ___ to the people of the valley.|A promise was ___ to her.|___ music was played in the temple.|profane,secular|
  profane|not holy; showing disrespect for holy things|世俗的；亵渎的|___ language is not allowed in the hall.|The novel mixes the sacred and the ___.|They saw the dance as ___.|sacred,pious|profanity
  secular|not connected with religion|世俗的，非宗教的|France is a ___ state.|The school teaches ___ subjects.|Love songs and other ___ music grew popular at the court.|sacred,pious|secularism
  pious|deeply religious|虔诚的|The ___ woman prayed every morning.|He made ___ speeches but cheated his workers.|___ pilgrims walked to the temple.|secular,heretic|piety,piously
  pilgrim|a person who travels to a holy place|朝圣者|Each ___ carried a staff and a small bag.|The ___ walked for three months.|Every ___ visits the shrine at least once.|heretic,clergy|pilgrims
  shrine|a holy place connected with a saint or god; a place honoring someone|圣地，神龛|Flowers covered the ___ by the road.|The house became a ___ to the poet.|The ___ is visited by millions every year.|sect,doctrine|shrines
  heretic|a person whose beliefs go against those of a church or group|异教徒，持异端者|The church burned the ___ at the stake.|In art, she was a ___ who broke every rule.|He was called a ___ for doubting the theory.|pilgrim,sect|heretics,heretical
  doctrine|a belief or set of beliefs taught by a church, party or school|教义，学说|The ___ of the church forbade divorce.|The president announced a new ___.|They argued over ___ for centuries.|sect,shrine|doctrines
  sect|a small group with beliefs that differ from those of a larger group|教派，派别|The ___ lived apart in the hills.|A new ___ broke away from the church.|Members of the ___ dressed in white.|doctrine,clergy|sects
  clergy|the people trained for religious duties, such as priests|神职人员|The ___ led the march for peace.|Members of the ___ do not pay the tax.|Priests and other ___ wore black robes.|sect,pilgrim|clerical
  `,
);

/** batchesD are the batches of rhetoric and logic, temperament and character, and belief. */
export const batchesD: readonly BatchSpec[] = [rhetoric, logic, temperament, sociability, pride, giving, temper, candor, worship];
