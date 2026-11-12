// Grade 11: the batches of words of attack and defense, of fakes and lies, of arrest and mercy, of mockery, of decline
// and prevailing, of the senses, of truth and denial, of energy and inertia, of money and greed, of praise and blame,
// of awkward fixes and of hard and costly tasks.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const attack = batch(
  "words-of-attack-and-defense",
  ["Words of Attack and Defense", "进攻与防御的词"],
  ["assaults, walls, revenge and destruction", "攻击、壁垒、报复与毁灭"],
  `
  assail|to attack violently; to criticize strongly|猛烈攻击；抨击|Critics began to ___ the new law.|Doubts started to ___ her.|The troops will ___ the fort at dawn.|barrage,oust|assailed,assailant
  barrage|a heavy, continuous attack of guns; a great number of questions or complaints|弹幕；连珠炮|The army opened a ___ of fire.|She faced a ___ of questions.|A ___ of complaints followed.|barricade,assail|barrages
  barricade|a barrier put up to block a road or entrance; to block|路障；设障阻挡|Protesters built a ___ across the street.|They had to ___ the door.|Police removed the ___.|fortify,barrage|barricaded,barricades
  fortify|to strengthen against attack; to make stronger|设防；加强|They chose to ___ the town with walls.|A good breakfast will ___ you.|Some cereals ___ the diet with iron.|barricade,subdue|fortified,fortification
  subdue|to overcome and bring under control|制服；抑制|The police had to ___ the man.|She tried to ___ her anger.|The army was sent to ___ the rebels.|oust,retaliate|subdued
  retaliate|to make an attack in return|报复|If you hit him, he will ___.|The army was quick to ___.|Don't ___ when insulted.|avenge,subdue|retaliated,retaliation
  avenge|to inflict harm in return for a wrong|为…报仇|He swore to ___ his father's death.|The hero sets out to ___ his family.|They sought to ___ the insult.|retaliate,raze|avenged,avenger
  oust|to drive out from a position|驱逐，罢免|Voters tried to ___ the mayor.|Rebels hoped to ___ the king.|The board will ___ the chairman.|assail,ravage|ousted
  raze|to completely destroy a building or town|夷为平地|The army chose to ___ the village.|They will ___ the old factory.|Fire did ___ the forest.|ravage,fortify|razed
  ravage|to cause severe damage to|毁坏，破坏|Storms ___ the coast each winter.|War will ___ the land.|Disease began to ___ the city.|raze,avenge|ravaged
  `,
);

const fakes = batch(
  "words-of-fakes-and-lies",
  ["Words of Fakes and Lies", "伪造与谎言的词"],
  ["false things, pretending and traps", "假货、假装与圈套"],
  `
  counterfeit|made in exact imitation of something valuable in order to deceive|伪造的；假冒品|The police found ___ money.|The bag was a ___.|They sold ___ watches.|fabricate,hoax|counterfeiter
  fabricate|to invent in order to deceive; to make or build|捏造；制造|He chose to ___ the evidence.|They ___ steel parts.|She would never ___ a story.|feign,delude|fabricated,fabrication
  feign|to pretend to be affected by a feeling or illness|假装|He tried to ___ illness.|She would ___ surprise.|Don't ___ interest.|fabricate,insinuate|feigned
  hoax|a trick or deception|骗局，恶作剧|The bomb threat was a ___.|The photo of the monster was a ___.|Thousands fell for the ___.|swindle,pretext|hoaxes
  swindle|to cheat someone out of money; a scheme to cheat|诈骗|They tried to ___ old people out of their savings.|The deal was a ___.|He was jailed for the ___.|hoax,snare|swindled,swindler
  delude|to make someone believe something false|欺骗，迷惑|Don't ___ yourself that it will be easy.|He tried to ___ the voters.|We ___ ourselves if we ignore the facts.|feign,covert|deluded,delusion
  covert|not openly acknowledged; secret|秘密的，隐蔽的|They ran a ___ operation.|She gave him a ___ glance.|The ___ plan was discovered.|insinuate,counterfeit|covertly
  insinuate|to suggest something bad in an indirect way|暗示，含沙射影地说|Are you trying to ___ that I lied?|He would ___ that she cheated.|The article seems to ___ fraud.|feign,delude|insinuated,insinuation
  pretext|a false reason given to hide the real one|借口|He came round on the ___ of borrowing a book.|They used the riot as a ___ to close the border.|She called on some ___.|hoax,snare|pretexts
  snare|a trap for catching animals; to catch in a trap|陷阱；诱捕|The hunter set a ___ for rabbits.|They tried to ___ him into a confession.|The bird was caught in a ___.|swindle,pretext|snared
  `,
);

const arrest = batch(
  "words-of-arrest-and-mercy",
  ["Words of Arrest and Mercy", "逮捕与宽恕的词"],
  ["catching, questioning, sentencing and pardoning", "抓捕、审讯、判决与宽恕"],
  `
  accomplice|a person who helps another commit a crime|共犯|The thief's ___ waited in the car.|She was charged as an ___.|He named his ___ to the police.|convict,apprehend|accomplices
  apprehend|to arrest; to understand|逮捕；领会|Police will soon ___ the suspect.|She did not ___ the danger.|They managed to ___ the thief.|detain,interrogate|apprehended,apprehension
  convict|to declare someone guilty; a person in prison|判…有罪；囚犯|The jury may ___ him of murder.|The ___ escaped from prison.|There was not enough evidence to ___ her.|accomplice,attest|convicted
  detain|to keep someone in custody; to delay|拘留；耽搁|Police can ___ a suspect for a day.|I won't ___ you long.|They chose to ___ him at the airport.|apprehend,confiscate|detained,detention,detainee
  interrogate|to question closely, often aggressively|审问|Police began to ___ the suspect.|The spy was taken away so they could ___ him.|She would ___ her son about his day.|detain,attest|interrogated,interrogation
  confiscate|to take away someone's property with authority|没收|Teachers will ___ phones in class.|Customs may ___ the goods.|Police chose to ___ his car.|detain,exempt|confiscated,confiscation
  attest|to provide or serve as clear evidence of|证明，证实|Many people can ___ to her honesty.|The ruins ___ to the city's past.|I can ___ that he was here.|convict,clemency|attested
  clemency|mercy, especially in punishing|宽恕，仁慈|The judge showed ___.|They begged the king for ___.|He was granted ___.|lenient,attest|
  lenient|more merciful or tolerant than expected|宽大的|The judge gave a ___ sentence.|Her parents are too ___.|The teacher was ___ about late work.|clemency,exempt|leniency
  exempt|free from a duty or payment; to free from|免除的；豁免|Food is ___ from tax.|Students are ___ from the fee.|They chose to ___ him from service.|lenient,confiscate|
  `,
);

const mockery = batch(
  "words-of-mockery-and-rebuke",
  ["Words of Mockery and Rebuke", "嘲笑与责备的词"],
  ["laughing at others, turning them away and telling them off", "嘲笑他人、拒人于外与训斥"],
  `
  scoff|to speak about something in a scornfully mocking way|嘲笑|Experts used to ___ at the idea.|Don't ___ at her dreams.|They will ___ at our plan.|sneer,taunt|scoffed
  sneer|a scornful smile or remark; to make one|冷笑；嘲笑|He said "loser" with a ___.|Don't ___ at the poor.|Her ___ made him angry.|scoff,gloat|sneered,sneering
  taunt|a remark made to anger or provoke; to make such remarks|嘲弄|The bullies began to ___ him.|She ignored their ___.|Fans will ___ the referee.|mock,scoff|taunted,taunts
  gloat|to dwell on one's own success or another's misfortune with smug pleasure|幸灾乐祸，沾沾自喜|Don't ___ over your rival's defeat.|He began to ___ about winning.|It's rude to ___.|sneer,spurn|gloated,gloating
  mock|to tease or laugh at in a scornful way; not authentic|嘲笑；模拟的|Don't ___ his accent.|We took a ___ exam.|They ___ his old car.|taunt,scorn|mocked,mockery
  scorn|the feeling that something is worthless; to reject with contempt|蔑视；鄙视|She looked at him with ___.|They ___ the idea of working for free.|He poured ___ on the plan.|spurn,mock|scorned,scornful
  spurn|to reject with disdain|轻蔑地拒绝|She chose to ___ his offer.|They ___ every attempt at peace.|Don't ___ good advice.|shun,scorn|spurned
  shun|to persistently avoid|避开，回避|Many ___ the man after the scandal.|She tends to ___ publicity.|Cats ___ water.|spurn,reproach|shunned
  reproach|an expression of disapproval; to express disapproval to|责备|She gave him a look of ___.|Don't ___ yourself.|His conduct is beyond ___.|reprimand,gloat|reproached
  reprimand|a formal expression of disapproval; to give one|训斥|He got a ___ for being late.|The boss had to ___ her.|The officer received a written ___.|reproach,taunt|reprimanded
  `,
);

const decline = batch(
  "words-of-decline-and-prevailing",
  ["Words of Decline and Prevailing", "衰退与胜出的词"],
  ["things that shrink and fade, give in, and win out", "缩小、消退、屈服与胜出之物"],
  `
  deteriorate|to become progressively worse|恶化|His health began to ___.|Relations may ___.|The road will ___ without repairs.|dwindle,surpass|deteriorated,deterioration
  dwindle|to diminish gradually|逐渐减少|Our savings began to ___.|The crowd will ___ as night falls.|Support for him may ___.|wane,teem|dwindled,dwindling
  wane|of the moon, to show less light; to decrease in strength|(月)亏；衰落|The moon will ___ after the full moon.|Interest in the game began to ___.|His power is on the ___.|dwindle,prevail|waned,waning
  recede|to go or move back; to become more distant|后退；减弱|The floods began to ___.|His hairline started to ___.|The danger will ___.|subside,surpass|receded
  subside|to become less intense or severe|减弱，平息|The pain will ___.|Wait for the storm to ___.|The flood waters began to ___.|recede,relent|subsided
  succumb|to fail to resist pressure or temptation; to die from|屈服；死于|She did not ___ to the pressure.|He may ___ to his injuries.|Don't ___ to temptation.|relent,prevail|succumbed
  relent|to abandon a harsh intention; to become less severe|变温和；减弱|Her parents finally began to ___.|The rain did not ___ all day.|The judge would not ___.|succumb,subside|relented
  prevail|to prove more powerful; to be widespread|胜过；盛行|Justice will ___.|Calm will ___ in the end.|Old customs still ___ here.|surpass,succumb|prevailed,prevailing
  surpass|to exceed; to be greater or better than|超过|Sales will ___ last year's.|She hopes to ___ her rivals.|The results ___ all hopes.|prevail,teem|surpassed
  teem|to be full of or swarming with|充满|The river seems to ___ with fish.|The streets ___ with tourists.|Ideas ___ in her head.|dwindle,surpass|teemed,teeming
  `,
);

const senses = batch(
  "words-of-smell-taste-and-touch",
  ["Words of Smell, Taste and Touch", "嗅觉、味觉与触觉的词"],
  ["appetites, soothing, sweetness and stench", "胃口、舒缓、甜腻与恶臭"],
  `
  whet|to sharpen; to stimulate an appetite or interest|磨快；激起|The trailer was made to ___ our appetite.|A taste will ___ your interest.|He would ___ the knife on a stone.|satiate,palliate|whetted
  satiate|to satisfy fully|使饱足|Nothing could ___ his hunger for fame.|The meal did ___ us.|Her curiosity was hard to ___.|whet,cloying|satiated,satiety
  palliate|to make a disease less severe without curing it; to make an offense seem less serious|减轻(病痛)；掩饰|Drugs may ___ the symptoms.|He tried to ___ his crime.|The nurse worked to ___ her pain.|emollient,satiate|
  emollient|having the quality of softening the skin; calming|润肤的；缓和的|Use an ___ cream.|She spoke in ___ tones.|The ___ oil soothed his hands.|palliate,viscous|
  cloying|unpleasantly sweet or sentimental|甜腻的|The cake was ___.|The film has a ___ ending.|Her ___ perfume filled the car.|redolent,fetid|cloyingly
  redolent|strongly reminiscent; smelling strongly of|使人联想的；有…气味的|The kitchen was ___ of garlic.|The town is ___ of the past.|The air was ___ with pine.|cloying,noisome|
  fetid|smelling extremely unpleasant|恶臭的|A ___ smell rose from the swamp.|The ___ water was full of flies.|They lived in a ___ room.|noisome,variegated|
  noisome|having an extremely offensive smell; disagreeable|恶臭的；令人讨厌的|A ___ odor came from the bin.|The ___ fumes made us sick.|It was a ___ task.|fetid,emollient|
  viscous|thick and sticky, between solid and liquid|黏稠的|Honey is ___.|The oil became ___ in the cold.|A ___ liquid oozed out.|emollient,variegated|viscosity
  variegated|having patches or streaks of different colors|杂色的|The plant has ___ leaves.|The ___ cloth was striped.|A ___ butterfly landed on the rose.|viscous,redolent|
  `,
);

const truth = batch(
  "words-of-truth-and-denial",
  ["Words of Truth and Denial", "真相与否认的词"],
  ["claiming, contradicting, dodging and clearing names", "主张、反驳、回避与澄清"],
  `
  belie|to fail to give a true idea of; to show something to be false|掩饰；证明…为假|Her smile seemed to ___ her fear.|His calm did ___ the danger.|The facts ___ his claims.|aver,impugn|belied
  aver|to state or assert to be the case|断言|He will ___ that he is innocent.|Witnesses ___ that they saw him.|She went on to ___ her love.|belie,gainsay|averred
  gainsay|to deny or contradict|否认，反驳|No one can ___ her talent.|It is hard to ___ the facts.|Who would ___ him?|aver,demur|
  impugn|to dispute the truth or honesty of|对…表示怀疑，质疑|They tried to ___ her motives.|Don't ___ my honesty.|The lawyer will ___ the witness.|gainsay,exculpate|impugned
  prevaricate|to speak or act evasively|支吾其词|Stop trying to ___ and answer.|He began to ___ when asked about money.|Politicians often ___.|dissemble,remonstrate|prevaricated,prevarication
  dissemble|to hide one's true motives or feelings|掩饰|She was unable to ___.|He tried to ___ his anger.|Spies must ___.|prevaricate,disabuse|dissembled
  disabuse|to persuade someone that an idea is mistaken|纠正，使省悟|Let me ___ you of that notion.|We must ___ them of the myth.|She tried to ___ him of his hopes.|exculpate,belie|disabused
  exculpate|to show that someone is not guilty|开脱，证明无罪|The evidence will ___ him.|New facts may ___ her.|The letter helped ___ the driver.|disabuse,impugn|exculpated
  remonstrate|to make a forcefully reproachful protest|抗议，规劝|She began to ___ with the referee.|He would ___ against the plan.|They tried to ___ with the guard.|demur,prevaricate|remonstrated
  demur|to raise doubts or objections|表示异议|She did not ___ when asked to help.|He began to ___ at the cost.|They accepted without ___.|remonstrate,gainsay|demurred
  `,
);

const energy = batch(
  "words-of-drive-and-inertia",
  ["Words of Drive and Inertia", "干劲与惰性的词"],
  ["the persistent, the useless, the rigid, the changeable and the sleepy", "坚持者、无能者、僵化者、多变者与昏沉者"],
  `
  dogged|showing tenacity and grim persistence|顽强的|Her ___ effort paid off.|The ___ detective never gave up.|They put up a ___ defense.|pertinacious,feckless|doggedly
  pertinacious|holding firmly to a purpose; persistent|执着的，坚持的|The ___ reporter kept calling.|She is ___ in her research.|A ___ salesman would not leave.|dogged,protean|pertinacity
  feckless|lacking initiative or strength of character; irresponsible|无能的，不负责任的|Her ___ brother never kept a job.|The ___ government did nothing.|A ___ young man wasted his chances.|fatuous,dogged|
  fatuous|silly and pointless|愚蠢的|He made a ___ remark.|The film has a ___ plot.|Her ___ grin annoyed him.|feckless,hidebound|fatuously
  hidebound|unwilling or unable to change because of tradition|墨守成规的|The ___ school refused to change.|He has ___ views.|A ___ committee rejected the idea.|protean,quiescent|
  protean|tending or able to change frequently or easily|多变的|She is a ___ actress.|The virus is ___.|His ___ talents amazed us.|hidebound,peripatetic|
  peripatetic|traveling from place to place, especially for work|巡回的，流动的|She led a ___ life.|He is a ___ music teacher.|The ___ circus never stayed long.|protean,somnolent|
  somnolent|sleepy; drowsy|昏昏欲睡的|The ___ town woke at noon.|The heat made us ___.|A ___ cat lay by the fire.|lassitude,quiescent|
  lassitude|a state of physical or mental weariness; lack of energy|倦怠|Heat brought on a feeling of ___.|She fought her ___ and went out.|A general ___ settled on the office.|somnolent,quiescent|
  quiescent|in a state of inactivity or dormancy|静止的，沉寂的|The volcano is ___.|The disease was ___ for years.|The market was ___.|somnolent,hidebound|quiescence
  `,
);

const greed = batch(
  "words-of-money-and-greed",
  ["Words of Money and Greed", "金钱与贪婪的词"],
  ["the poor, the bribed, the greedy and the generous", "贫者、受贿者、贪婪者与慷慨者"],
  `
  impecunious|having little or no money|身无分文的|The ___ student lived on noodles.|He was an ___ artist.|Her ___ uncle borrowed again.|mendicant,venal|
  pecuniary|relating to money|金钱的|He had no ___ interest in the deal.|She faced ___ penalties.|The ___ rewards were small.|lucre,venal|
  lucre|money, especially when gained dishonestly|钱财，不义之财|He did it for filthy ___.|They chased ___ over honor.|The ___ corrupted him.|pecuniary,largesse|
  venal|open to bribery|唯利是图的，贪赃的|The ___ judge took the money.|___ officials sold the licenses.|It was a ___ system.|cupidity,impecunious|venality
  cupidity|greed for money or possessions|贪婪|The ___ of the bankers caused the crash.|His ___ knew no limits.|They played on her ___.|venal,largesse|
  largesse|generosity in giving money or gifts|慷慨的赠予|The town lived on the ___ of its lord.|She was known for her ___.|They relied on state ___.|cupidity,lucre|
  mendicant|a beggar; living by begging|乞丐；行乞的|A ___ sat by the gate.|They were ___ monks.|The ___ asked for bread.|impecunious,bilk|mendicants
  bilk|to obtain money fraudulently from; to cheat|诈骗|They tried to ___ the investors.|He would ___ his customers.|Don't let them ___ you.|abscond,aggrandize|bilked
  abscond|to leave hurriedly and secretly, often to avoid arrest|潜逃|The cashier tried to ___ with the money.|He chose to ___ before trial.|The prisoner managed to ___.|bilk,aggrandize|absconded
  aggrandize|to increase the power, status or wealth of|扩大，增强(权势)|He used his office to ___ himself.|They tried to ___ their family.|Don't ___ your role.|abscond,largesse|aggrandized,aggrandizement
  `,
);

const praiseBlame = batch(
  "words-of-acclaim-and-abuse",
  ["Words of Acclaim and Abuse", "赞誉与辱骂的词"],
  ["approval and honor, insult and public shame", "赞许与荣誉、侮辱与公开羞辱"],
  `
  approbation|approval or praise|认可，赞许|The plan won the ___ of the council.|She smiled with ___.|He sought his father's ___.|plaudit,obloquy|
  plaudit|an expression of praise or approval|赞扬，喝彩|The film earned a ___ from every critic.|She deserves every ___.|Her speech won a ___ from the crowd.|encomium,calumny|plaudits
  encomium|a speech or piece of writing that praises highly|赞词|He delivered an ___ for the dead hero.|The book is an ___ to the city.|Her ___ moved the crowd.|plaudit,laudatory|encomiums
  laudatory|expressing praise and commendation|赞美的|The review was ___.|He gave a ___ speech.|___ letters poured in.|approbation,opprobrium|
  obloquy|strong public criticism or verbal abuse|辱骂，恶名|He faced public ___ after the scandal.|She endured years of ___.|The ___ broke his spirit.|opprobrium,approbation|
  opprobrium|harsh criticism or censure; public disgrace|斥责；耻辱|The decision drew international ___.|He faced ___ for his lies.|The ___ was deserved.|obloquy,calumny|
  calumny|the making of false statements to damage someone's reputation|诽谤|She sued him for ___.|It was pure ___.|They spread ___ about their rivals.|obloquy,pillory|calumnies
  pillory|to attack or ridicule publicly|公开羞辱|The press began to ___ the minister.|Critics ___ the film.|Don't ___ her for one mistake.|vituperate,fulminate|pilloried
  vituperate|to blame or insult in strong or violent language|辱骂|He began to ___ his rivals.|She would ___ the referee.|Don't ___ your staff.|fulminate,pillory|vituperative,vituperation
  fulminate|to express vehement protest|大声斥责|He began to ___ against the new tax.|Critics ___ about the waste.|She would ___ at the council.|vituperate,encomium|fulminated
  `,
);

const awkward = batch(
  "words-of-awkward-fixes",
  ["Words of Awkward Fixes", "尴尬处境的词"],
  ["dilemmas, blunders, shame and anxious care", "两难、笨拙、可耻与焦虑的关切"],
  `
  adverse|preventing success; harmful|不利的|The drug has ___ effects.|They faced ___ weather.|The news had an ___ effect on sales.|reprehensible,obtuse|adversely
  obtuse|slow to understand; of an angle, more than 90 degrees|迟钝的；钝角的|He was too ___ to see the joke.|Draw an ___ angle.|Don't be ___; you know what I mean.|adverse,ignoble|obtuseness
  quandary|a state of uncertainty about what to do|困惑，窘境|She was in a ___ about which job to take.|The vote put them in a ___.|It's a real ___.|imbroglio,stupor|quandaries
  reprehensible|deserving censure or condemnation|应受谴责的|His conduct was ___.|It is ___ to lie to children.|They called the attack ___.|ignoble,turpitude|
  solicitous|showing interest or concern|关切的|The nurse was ___ of his comfort.|He was ___ toward his guests.|She asked in a ___ voice.|discomfit,obtuse|solicitously,solicitude
  stupor|a state of near-unconsciousness|昏迷，恍惚|He lay in a drunken ___.|She woke from her ___.|The heat left us in a ___.|quandary,imbroglio|
  imbroglio|an extremely confused or embarrassing situation|纠葛，尴尬局面|The party was caught up in a political ___.|She did not want to join the ___.|The ___ dragged on for months.|quandary,discomfit|imbroglios
  discomfit|to make someone feel uneasy or embarrassed|使困惑，使难堪|The question seemed to ___ the minister.|Her stare will ___ anyone.|He tried to ___ his rival.|solicitous,imbroglio|discomfited,discomfiture
  ignoble|not honorable in character or purpose|卑鄙的，不光彩的|It was an ___ defeat.|He had ___ motives.|They used ___ tactics.|reprehensible,adverse|ignobly
  turpitude|depraved or wicked behavior|卑鄙，邪恶|He was fired for moral ___.|The novel shows the ___ of the court.|Such ___ shocked the town.|reprehensible,ignoble|
  `,
);

const hardTasks = batch(
  "words-of-hard-and-costly-tasks",
  ["Words of Hard and Costly Tasks", "艰巨与昂贵任务的词"],
  ["the complex, the heavy, the exhausting and the overpriced", "复杂、笨重、累人与昂贵"],
  `
  intricate|very complicated or detailed|错综复杂的|The rug has an ___ pattern.|The plot is ___.|She made an ___ model.|elaborate,cumbersome|intricately,intricacy
  cumbersome|large or heavy and therefore difficult to carry or use|笨重的；繁琐的|The ___ box would not fit in the car.|The rules are ___.|He wore a ___ coat.|intricate,paltry|
  elaborate|involving many carefully arranged parts; to add more detail|精心制作的；详细阐述|They planned an ___ party.|Please ___ on your answer.|She wore an ___ dress.|intricate,outlandish|elaborately,elaboration
  grueling|extremely tiring and demanding|累人的|It was a ___ climb.|They faced a ___ schedule.|The race was ___.|strenuous,formidable|
  strenuous|requiring or using great effort|费力的|Avoid ___ exercise after eating.|They made ___ efforts.|The hike is ___.|grueling,stupendous|strenuously
  formidable|inspiring fear or respect through power or size|令人敬畏的；艰巨的|She is a ___ opponent.|They faced a ___ task.|The castle walls were ___.|stupendous,grueling|formidably
  stupendous|extremely impressive|惊人的|The view was ___.|They made a ___ effort.|It was a ___ achievement.|formidable,exorbitant|stupendously
  outlandish|looking or sounding bizarre or unfamiliar|稀奇古怪的|She wore an ___ hat.|His ideas seemed ___.|They told an ___ story.|elaborate,exorbitant|
  exorbitant|unreasonably high, of a price|过高的|The hotel charges ___ prices.|The rent was ___.|They paid an ___ fee.|paltry,outlandish|exorbitantly
  paltry|small or meaningless|微不足道的|They pay a ___ wage.|He gave a ___ excuse.|The prize was a ___ ten dollars.|exorbitant,cumbersome|
  `,
);

/** batchesI are the batches of attack, fakes, arrest, mockery, decline, the senses, truth, drive, greed, acclaim, awkward fixes and hard tasks. */
export const batchesI: readonly BatchSpec[] = [
  attack,
  fakes,
  arrest,
  mockery,
  decline,
  senses,
  truth,
  energy,
  greed,
  praiseBlame,
  awkward,
  hardTasks,
];
