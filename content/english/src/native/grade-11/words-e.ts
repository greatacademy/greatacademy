// Grade 11: the batches of words of company and candor, of leanings and whims, of the relentless and the calm, of
// trimming and padding writing, of means that work, of yielding and resisting, of dark times and of the everyday.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const company = batch(
  "words-of-company-and-candor",
  ["Words of Company and Candor", "相处与坦率的词"],
  ["getting along, falling out and speaking plainly", "相处融洽、闹翻与直言"],
  `
  camaraderie|mutual trust and friendship among people who spend time together|友情，同志情谊|There was great ___ among the soldiers.|The team's ___ helped them win.|She missed the ___ of the office.|squabble,contentious|
  rapport|a close relationship in which people understand each other|融洽的关系|The teacher has a good ___ with her class.|He quickly built a ___ with the clients.|There was no ___ between them.|squabble,candor|
  squabble|a noisy quarrel about something trivial; to quarrel in this way|口角，争吵|The children began to ___ over the toy.|It was a silly ___ about money.|Neighbors often ___ about parking.|contentious,rapport|squabbled,squabbling
  contentious|causing or likely to cause an argument|有争议的；好争论的|Abortion is a ___ issue.|The meeting was ___.|He is a ___ man who loves to argue.|squabble,demure|contentiously
  antagonize|to make someone hostile|使对立，惹恼|Don't ___ the neighbors.|His remarks will ___ the voters.|She did not want to ___ her boss.|condone,contentious|antagonized
  decorum|behavior in keeping with good taste and propriety|礼仪，端庄得体|The judge asked for ___ in the court.|They behaved with ___ at the funeral.|He ignored all ___ and shouted.|demure,candor|decorous
  demure|reserved, modest and shy, especially of a woman|端庄的，娴静的|She gave a ___ smile.|The ___ girl sat quietly.|Her ___ dress suited the occasion.|decorum,facetious|demurely
  candor|the quality of being open and honest|坦率，坦诚|I appreciate your ___.|She spoke with surprising ___.|His ___ won the voters' trust.|rapport,condone|
  condone|to accept or allow behavior that is wrong|宽恕，纵容|The school will not ___ bullying.|I cannot ___ such rudeness.|Silence may seem to ___ the crime.|antagonize,candor|condoned
  facetious|treating serious issues with inappropriate humor|不合时宜地开玩笑的|Don't be ___; this is serious.|He made a ___ remark at the funeral.|Her ___ answer annoyed the teacher.|demure,contentious|facetiously
  `,
);

const leanings = batch(
  "words-of-leanings-and-whims",
  ["Words of Leanings and Whims", "倾向与心血来潮的词"],
  ["tastes, tendencies and sudden choices", "爱好、倾向与突然的选择"],
  `
  penchant|a strong liking for something|爱好，嗜好|She has a ___ for spicy food.|He had a ___ for telling long stories.|Her ___ for bright colors showed in her clothes.|eclectic,emulate|
  predilection|a preference or special liking|偏爱|He has a ___ for old films.|Her ___ for detective novels was well known.|They share a ___ for jazz.|eclectic,emulate|predilections
  propensity|a natural tendency to behave in a particular way|倾向，习性|He has a ___ to exaggerate.|Some people have a ___ for violence.|The ___ of the soil to flood was known.|intuitive,emulate|propensities
  spontaneous|done without planning, from a sudden impulse|自发的，即兴的|The crowd burst into ___ applause.|They took a ___ trip to the coast.|Her ___ laugh made everyone smile.|intuitive,frivolous|spontaneously,spontaneity
  intuitive|based on feelings rather than reasoning; easy to use|直觉的；易懂的|She has an ___ grasp of music.|The app has an ___ design.|His ___ guess was right.|eclectic,emulate|intuitively,intuition
  indulgent|allowing someone too much freedom or pleasure|放纵的，纵容的|The ___ parents bought him everything.|It was an ___ dessert.|She gave an ___ smile.|frivolous,preposterous|indulge,indulgence
  frivolous|not having any serious purpose or value|轻浮的，琐碎的|Don't waste money on ___ things.|He made a ___ complaint.|Her ___ remarks annoyed the panel.|indulgent,eclectic|frivolously,frivolity
  preposterous|contrary to reason or common sense; absurd|荒谬的|That is a ___ idea.|The price was ___.|He told a ___ story about aliens.|intuitive,eclectic|preposterously
  eclectic|deriving ideas or taste from a broad range of sources|兼收并蓄的|She has ___ tastes in music.|The room had an ___ mix of furniture.|His ___ reading included poetry and physics.|predilection,emulate|
  emulate|to try to match or surpass someone, usually by imitation|模仿，效法|Young players ___ their heroes.|She hopes to ___ her mother's success.|Other cities tried to ___ the plan.|intuitive,penchant|emulated,emulation
  `,
);

const relentless = batch(
  "words-of-the-relentless-and-the-calm",
  ["Words of the Relentless and the Calm", "无休止与平静的词"],
  ["things that never stop, storms, calm and watchfulness", "永不停歇之物、风暴、平静与警觉"],
  `
  incessant|continuing without pause or interruption|不停的|The ___ rain flooded the roads.|Her ___ chatter annoyed him.|The dog's ___ barking kept us awake.|tranquil,sedentary|incessantly
  relentless|oppressively constant; never stopping or weakening|不懈的，无情的|The ___ heat made us tired.|She was ___ in her pursuit of the truth.|They faced ___ pressure.|innocuous,sedentary|relentlessly
  inexorable|impossible to stop or prevent|无法阻止的|The ___ rise of prices worried families.|Time moves in an ___ way.|The ___ tide swept over the sand.|sedentary,vigilant|inexorably
  unprecedented|never done or known before|前所未有的|The flood was ___.|They won an ___ fifth title.|The crisis is ___ in our history.|sedentary,vigilant|
  turbulent|full of conflict or confusion; moving unsteadily|动荡的；湍急的|The plane hit ___ air.|They lived through ___ times of war and riots.|The ___ river was dangerous.|tranquil,sedentary|
  tranquil|free from disturbance; calm|安静的，平静的|They spent a ___ week by the still lake.|The garden was ___.|Her ___ voice soothed the child.|turbulent,vigilant|tranquility
  vigilant|keeping careful watch for possible danger|警惕的|Be ___ when walking at night.|The ___ guard saw the thief.|Parents must be ___ online.|impervious,innocuous|vigilantly,vigilance
  impervious|not allowing fluid to pass through; unable to be affected|不透水的；不受影响的|The coat is ___ to rain.|He seemed ___ to criticism.|She was ___ to the cold.|vigilant,incessant|
  innocuous|not harmful or offensive|无害的|The question seemed ___.|Most spiders are ___.|It was an ___ remark.|impervious,relentless|innocuously
  sedentary|involving much sitting and little exercise|久坐的|A ___ lifestyle is bad for the heart.|She has a ___ job.|Office work is ___.|tranquil,turbulent|
  `,
);

const trimming = batch(
  "words-for-trimming-and-padding-writing",
  ["Words for Trimming and Padding Writing", "精简与充数文字的词"],
  ["cutting writing down and filling it out", "删减文字与填塞文字"],
  `
  wordy|using too many words|啰嗦的，冗长的|Her ___ email took ten minutes to read.|Cut the ___ opening paragraph.|His style is ___ and dull.|elicit,embellish|wordiness
  brevity|concise and exact use of words; shortness of time|简洁；短暂|___ is the soul of wit.|The ___ of his visit surprised us.|Her report was praised for its ___.|concise,redundant|
  concise|giving a lot of information clearly in a few words|简明的|Write a ___ summary.|Her answer was ___.|The ___ guide fits in a pocket.|embellish,verbiage|concisely
  embellish|to make more attractive by adding details, often untrue ones|装饰；润色|He likes to ___ his stories.|She chose to ___ the dress with beads.|Don't ___ the facts.|wordy,elicit|embellished,embellishment
  extraneous|irrelevant or unrelated to the subject|无关的|Remove any ___ details.|The essay had ___ material.|Turn off ___ noise.|elicit,embellish|
  redundant|not needed; no longer employed because a job is unnecessary|多余的；被裁员的|Cut the ___ words.|Hundreds of workers were made ___.|The second sentence is ___.|elicit,brevity|redundancy
  incisive|intelligently analytical and clear-thinking|深刻的，尖锐的|She gave an ___ analysis of the poem.|His ___ questions exposed the lie.|The critic made ___ comments.|concise,superficial|incisively
  elicit|to draw out a response or answer|引出，探出|The teacher tried to ___ answers from the class.|Her joke failed to ___ a laugh.|The survey will ___ opinions.|embellish,wordy|elicited
  superficial|existing or occurring on the surface; shallow|表面的，肤浅的|The cut was only ___.|His knowledge of history is ___.|They made ___ changes.|incisive,verbiage|superficially
  verbiage|speech or writing that uses too many words|冗词，废话|Strip away the ___ and the idea is simple.|The report was full of legal ___.|Cut the ___ from your essay.|extraneous,wordy|
  `,
);

const means = batch(
  "words-of-means-that-work",
  ["Words of Means That Work", "可行办法的词"],
  ["ways to get things done, fairly or by a trick", "做成事情的办法，正当的或取巧的"],
  `
  circumvent|to find a way around an obstacle or rule|规避，绕过|They tried to ___ the law.|We must ___ the traffic jam.|He found a way to ___ the ban.|expedite,loophole|circumvented
  expedient|convenient and practical, though perhaps not right; a means to an end|权宜的；权宜之计|It would be ___ to agree.|They chose the ___ option.|Lying was a cheap ___.|viable,makeshift|expediency
  viable|capable of working successfully|可行的|The plan is not ___.|Is the business ___?|They need a ___ alternative.|ploy,expedite|viability
  conducive|making a certain outcome likely or possible|有助于…的|Noise is not ___ to sleep.|The quiet room was ___ to study.|Warm weather is ___ to growth.|viable,practicable|
  workable|able to be used or operated successfully|可行的，切实可行的|They reached a ___ deal.|We need a ___ plan.|The clay is ___ when wet.|ploy,expedite|
  practicable|able to be done or put into practice|能实行的|It is not ___ to drive there in snow.|They chose the most ___ route.|Is the idea ___?|ploy,loophole|
  makeshift|serving as a temporary substitute|临时凑合的|They built a ___ shelter.|A box served as a ___ table.|The ___ bridge held for a day.|expedient,ploy|
  ploy|a cunning plan or action designed to gain an advantage|策略，花招|It was just a ___ to get attention.|The sale was a marketing ___.|His tears were a ___.|loophole,circumvent|ploys
  loophole|a gap in a law or contract that lets someone avoid it|漏洞|They used a tax ___.|Lawyers found a ___ in the contract.|The new law closes the ___.|ploy,expedite|loopholes
  expedite|to make an action happen sooner|加快，促进|We can ___ your order.|The new rules will ___ the process.|Can you ___ my visa?|circumvent,conducive|expedited
  `,
);

const yielding = batch(
  "words-of-yielding-and-resisting",
  ["Words of Yielding and Resisting", "屈服与抵抗的词"],
  ["giving in, breaking promises, blocking and urging", "让步、毁约、阻挠与催促"],
  `
  acquiesce|to accept something reluctantly but without protest|默许|She would not ___ to his demands.|The board chose to ___ in the plan.|They had to ___ to the change.|flout,garner|acquiesced,acquiescence
  capitulate|to stop resisting; to surrender|投降，屈服|The city was forced to ___.|The union refused to ___.|He would never ___ to bullies.|garner,espouse|capitulated,capitulation
  renege|to go back on a promise or deal|违约，食言|They tried to ___ on the deal.|Don't ___ on your word.|The company may ___ on the pay rise.|capitulate,espouse|reneged
  flout|to openly disregard a rule or custom|藐视，无视|Drivers ___ the speed limit.|She liked to ___ convention.|They ___ the ban on fishing.|acquiesce,forestall|flouted
  forestall|to prevent by taking action ahead of time|预先阻止|They acted fast to ___ a strike.|The rules aim to ___ fraud.|He tried to ___ any questions.|goad,garner|forestalled
  stymie|to prevent the progress of|阻碍，妨碍|Red tape may ___ the project.|Lack of money will ___ research.|Injuries ___ the team's hopes.|forestall,entreat|stymied
  goad|to provoke or annoy someone into action|刺激，激励|They tried to ___ him into fighting.|Fear may ___ her into acting.|Don't let them ___ you.|entreat,stymie|goaded
  entreat|to ask someone earnestly or anxiously|恳求|She would ___ him to stay.|They ___ the king for mercy.|I ___ you to listen.|goad,garner|entreated,entreaty
  espouse|to adopt or support a cause or belief|支持，拥护|She chose to ___ the cause of women's rights.|He would ___ free trade.|They ___ simple living.|renege,garner|espoused
  garner|to gather or collect, especially support or information|获得，收集|The film will ___ great reviews.|She hopes to ___ support for the plan.|They ___ votes from young people.|espouse,entreat|garnered
  `,
);

const darkTimes = batch(
  "words-of-dark-times",
  ["Words of Dark Times", "黑暗时期的词"],
  ["bad luck, deadlocks, chaos and the hated", "厄运、僵局、混乱与被憎恶者"],
  `
  hapless|unfortunate|不幸的，倒霉的|The ___ tourist lost his passport twice.|Our ___ team lost again.|The ___ driver ran out of fuel.|odious,virulent|haplessly
  harbinger|a person or thing that signals what is coming|先兆，预兆|The robin is a ___ of spring.|The strike was a ___ of worse to come.|Dark clouds are a ___ of rain.|nadir,impasse|harbingers
  impasse|a situation in which no progress is possible|僵局|The talks reached an ___.|They broke the ___ with a new offer.|The ___ lasted for weeks.|morass,maelstrom|
  maelstrom|a powerful whirlpool; a situation of confused turmoil|大漩涡；动乱|The ship was caught in a ___.|She was drawn into a ___ of rumors.|The city was a ___ of noise.|harbinger,nadir|
  morass|an area of muddy ground; a complicated situation|沼泽；困境|The army was stuck in a ___ of mud.|They got lost in a ___ of rules.|The project sank into a ___ of debt.|harbinger,nadir|
  nadir|the lowest point|最低点|The defeat was the ___ of his career.|Morale reached its ___ in winter.|Sales hit their ___ in May.|harbinger,pariah|
  pariah|an outcast|被排斥的人，贱民|He became a ___ after the scandal.|The country was treated as a ___.|She felt like a ___ at school.|odious,hapless|pariahs
  odious|extremely unpleasant; hateful|可憎的|It was an ___ task.|The ___ man insulted everyone.|They found the idea ___.|inimical,virulent|odiously
  inimical|tending to obstruct or harm; hostile|有害的，敌意的|Smoke is ___ to health.|The policy is ___ to growth.|He was ___ toward strangers.|odious,hapless|
  virulent|extremely severe or harmful; bitterly hostile|剧毒的；恶毒的|A ___ strain of flu spread fast.|He gave a ___ attack on the plan.|The ___ disease killed thousands.|inimical,pariah|virulence
  `,
);

const everyday = batch(
  "words-of-the-commonplace-and-the-spreading",
  ["Words of the Commonplace and the Spreading", "寻常与蔓延的词"],
  ["the daily, the widespread, the growing and the trite", "日常、普遍、增长与陈词"],
  `
  quotidian|of or occurring every day; ordinary|日常的，平凡的|The novel shows the ___ life of a farmer.|She tired of ___ chores.|The film turns ___ events into drama.|milieu,rife|
  rife|of something bad, widespread|充斥的，普遍的|The city was ___ with crime.|Rumors were ___.|The essay is ___ with errors.|pervade,burgeon|
  pervade|to spread through and be noticeable in every part|弥漫，遍及|The smell of bread began to ___ the house.|A sense of fear may ___ the town.|Humor should ___ the book.|rife,burgeon|pervaded
  burgeon|to begin to grow or increase rapidly|迅速发展|Cities ___ as people move from farms.|Trade began to ___ after the war.|Her career will ___.|pervade,seminal|burgeoned,burgeoning
  seminal|strongly influencing later developments|影响深远的，开创性的|It was a ___ book on economics.|She wrote a ___ paper on genes.|The film was a ___ work.|burgeon,panacea|
  panacea|a solution for all difficulties or diseases|万灵药|Money is not a ___ for every problem.|There is no ___ for sadness.|Some saw technology as a ___.|platitude,modicum|
  platitude|a remark used too often to be interesting|陈词滥调|He ended his speech with a tired ___.|"Every cloud has a silver lining" is a ___.|She offered a ___ instead of help.|panacea,motley|platitudes
  modicum|a small quantity of something|少量|He showed a ___ of respect.|With a ___ of luck, we will win.|She had not a ___ of doubt.|platitude,motley|
  motley|made up of different people or things that do not go well together|混杂的|A ___ crew of sailors joined the ship.|They wore a ___ collection of clothes.|A ___ crowd gathered in the square.|milieu,modicum|
  milieu|a person's social environment|社会环境|She grew up in an artistic ___.|He felt out of place in that ___.|The novel captures the ___ of 1920s Paris.|quotidian,motley|
  `,
);

/** batchesE are the batches of company, leanings, the relentless, trimming writing, means, yielding, dark times and the commonplace. */
export const batchesE: readonly BatchSpec[] = [company, leanings, relentless, trimming, means, yielding, darkTimes, everyday];
