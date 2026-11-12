// Grade 11: the batches of words of the first units, from wealth and class and hope and disillusion to nature and the
// self, solitude, justice and protest, and equality and freedom.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const wealth = batch(
  "words-of-wealth-and-class",
  ["Words of Wealth and Class", "财富与阶层的词"],
  ["wealth, poverty and social class", "财富、贫困与社会阶层"],
  `
  affluent|having a great deal of money; wealthy|富裕的|The ___ suburb had large houses and private pools.|Children from ___ families often travel abroad.|The town grew ___ after the mine opened.|opulent,ostentatious|affluence
  opulent|rich and luxurious in a showy way|豪华的，奢华的|The hotel lobby was ___, with gold mirrors and marble floors.|They held an ___ party with a hundred guests.|The palace's ___ rooms amazed the visitors.|affluent,lavish|opulence
  ostentatious|designed to impress others with wealth or importance|炫耀的，卖弄的|He wore an ___ gold watch to every meeting.|Their ___ car was meant to be noticed.|She disliked ___ displays of money.|lavish,destitute|ostentatiously,ostentation
  destitute|without money, food or a home; extremely poor|赤贫的，一无所有的|The flood left thousands of families ___.|He died ___ in a rented room.|Charities help ___ children find shelter.|affluent,parvenu|destitution
  lavish|spending or giving freely and in great amounts|奢侈的，慷慨的|They threw a ___ wedding for three hundred guests.|The king gave ___ gifts to his favorites.|Critics attacked the ___ spending of the mayor's office.|opulent,ostentatious|lavishly
  parvenu|a person who has recently become rich but is not accepted by the old wealthy class|暴发户|The old families looked down on the ___ and his new mansion.|Gatsby was seen as a ___ by the people of East Egg.|Though rich, the ___ was never invited to the club.|gentry,plutocrat|parvenus
  gentry|people of a high social class, especially old landowning families|绅士阶层，上流社会|The local ___ met at the hunt every autumn.|Austen wrote about the daughters of the country ___.|The land had belonged to the ___ for centuries.|parvenu,plutocrat|
  privileged|having special advantages that most people do not have|有特权的，享有优待的|She grew up in a ___ family with servants and tutors.|Only a ___ few could afford to go to university.|He knew he was ___ and tried to help others.|affluent,gentry|
  plutocrat|a person whose power comes from great wealth|财阀，富豪统治者|The ___ bought newspapers to shape public opinion.|Critics said the city was run by a single ___.|The ___ funded both political parties.|parvenu,gentry|plutocrats,plutocracy
  stratification|the arrangement of a society into levels of class or rank|(社会)分层|Social ___ kept the poor from entering the best schools.|The novel shows the rigid ___ of the village.|Economic ___ has grown over the last fifty years.|destitute,affluent|stratified
  `,
);

const hope = batch(
  "words-of-hope-and-disillusion",
  ["Words of Hope and Disillusion", "希望与幻灭的词"],
  ["dreams and their loss", "梦想及其破灭"],
  `
  yearning|a strong, deep wish for something hard to have|渴望，向往|Her ___ for a better life drove her to leave the village.|The song is full of ___ for home.|He felt a sudden ___ to see the ocean again.|disillusionment,idealism|yearnings
  idealism|the belief that high ideals can be achieved, often without regard for practical facts|理想主义|Her youthful ___ led her to join the volunteer corps.|The politician's ___ faded after years in office.|Critics called his plan pure ___.|cynicism,disillusionment|idealist,idealistic
  disillusionment|the feeling of disappointment when one learns that something is not as good as one believed|幻灭，醒悟|After the war, a deep ___ spread among the young soldiers.|His ___ with politics grew each year.|The novel ends in quiet ___.|yearning,elation|disillusioned
  cynicism|the belief that people act only out of self-interest|愤世嫉俗，犬儒主义|Years of broken promises filled the voters with ___.|Her ___ made her doubt every kind act.|There is a note of ___ in the reporter's questions.|idealism,quixotic|cynic,cynical
  quixotic|hopeful or idealistic in a way that is not practical|不切实际的，空想的|His ___ plan to end hunger alone impressed no one.|It was a ___ attempt to sail around the world in a rowboat.|Her friends thought her campaign was ___.|pragmatic,futile|quixotically
  pragmatic|dealing with problems in a sensible, practical way|务实的|The ___ mayor fixed the roads instead of making speeches.|We need a ___ solution, not a dream.|Her ___ approach saved the company.|quixotic,idealism|pragmatism,pragmatist
  elation|a feeling of great happiness and excitement|兴高采烈，欢欣|The team's ___ after the victory lasted all night.|She felt a rush of ___ when she read the letter.|Their ___ turned to fear when the storm began.|disillusionment,despondent|
  despondent|very unhappy and without hope|沮丧的，失望的|After losing his job, he grew ___.|The ___ refugees waited at the border.|Don't be ___; there will be other chances.|elation,pragmatic|despondency,despondently
  chimera|a hope or dream that can never come true|幻想，妄想|For many settlers, the promise of easy gold was a ___.|Perfect safety is a ___.|He chased the ___ of fame his whole life.|yearning,elation|chimeras,chimerical
  futile|having no useful result; pointless|徒劳的，无效的|Their ___ attempt to save the ship ended at dawn.|It is ___ to argue with him.|She made one last, ___ effort to escape.|quixotic,pragmatic|futility
  `,
);

const nature = batch(
  "words-of-nature-and-the-self",
  ["Words of Nature and the Self", "自然与自我的词"],
  ["nature and the inner life", "自然与内心生活"],
  `
  transcendent|going beyond ordinary limits or experience|超越的，卓越的|Standing on the mountain, she felt a ___ peace.|The music had a ___ beauty.|For the poet, nature offered a ___ truth.|sublime,pastoral|transcendence,transcend
  sublime|so beautiful or grand that it fills one with awe|崇高的，令人敬畏的|The ___ view of the canyon left them silent.|Romantic painters loved ___ scenes of storms and peaks.|There is something ___ about the night sky.|pastoral,rapture|sublimity
  pastoral|showing the life of the countryside in a pleasant, peaceful way|田园的，牧歌式的|The painting shows a ___ scene of sheep and shepherds.|Her poems are ___, full of meadows and streams.|The film opens with a ___ image of a farm at dawn.|sublime,verdant|pastorals
  verdant|green with grass or growing plants|青翠的，翠绿的|The ___ hills turned brown in the dry summer.|They walked through ___ fields after the rain.|The island was ___ and full of birds.|pastoral,primeval
  rapture|a feeling of intense joy or delight|狂喜，欣喜若狂|She gazed at the waterfall in ___.|The poem describes the ___ of a spring morning.|The crowd listened in ___ to the singer.|sublime,communion|rapturous
  communion|a close sharing of thoughts and feelings|心灵交流，融洽|Walking in the forest, he felt a deep ___ with nature.|The friends sat in silent ___.|The writer sought ___ with the wild.|rapture,solace
  solace|comfort or relief in a time of sadness or worry|慰藉，安慰|After her father died, she found ___ in long walks.|Music was his only ___ during the war.|Many people take ___ in the quiet of the woods.|communion,reverie|
  reverie|a pleasant state of being lost in one's thoughts; a daydream|遐想，幻想|The sound of the bell woke her from her ___.|He sat in a ___ by the fire.|The poem describes a summer ___.|solace,rapture|reveries
  primeval|belonging to the earliest ages of the world|原始的，远古的|The ___ forest had never been cut.|They felt a ___ fear in the dark cave.|___ swamps once covered the region.|verdant,pastoral
  ephemeral|lasting only a very short time|短暂的|The beauty of the cherry blossoms is ___.|Fame on the internet is often ___.|The poet wrote of the ___ joys of summer.|primeval,transcendent|ephemerally
  `,
);

const solitude = batch(
  "words-of-solitude-and-simplicity",
  ["Words of Solitude and Simplicity", "独处与简朴的词"],
  ["living alone and living simply", "独居与简朴生活"],
  `
  solitude|the state of being alone, often by choice|独处，孤独|She found ___ in the cabin by the lake.|Some writers need ___ to work.|He enjoyed the ___ of early mornings.|seclusion,monastic
  seclusion|the state of being private and away from other people|隐居，与世隔绝|The singer lived in ___ after her retirement.|The monastery offered ___ from the world.|They spent the winter in ___ on the island.|solitude,hermitage|secluded
  hermitage|a place where a person lives alone, apart from society|隐居处|The monk built a ___ high in the mountains.|The cottage became the writer's ___.|Visitors were not welcome at the ___.|seclusion,monastic|hermit,hermitages
  monastic|like the simple, quiet life of monks, cut off from the world|修道院式的，清苦的|He lived a ___ life in a small room with a bed and a desk.|The writer kept a ___ routine of work and silence.|Her ___ habits puzzled her lively friends.|abstemious,hermitage|
  abstemious|eating and drinking only a little; not taking much pleasure in food or drink|有节制的，饮食有度的|The ___ old man ate only bread and fruit.|She was ___ in all things.|An ___ diet kept him healthy.|ascetic,monastic|abstemiously
  ascetic|avoiding physical pleasures, especially for religious reasons|苦行的，禁欲的|The ___ monk slept on a stone floor.|He lived an ___ life of fasting and prayer.|Her ___ habits impressed her students.|abstemious,hermitage|asceticism
  contemplation|deep, quiet thought about something|沉思，冥想|The garden was a place of ___.|After hours of ___, she reached a decision.|He sat in silent ___ of the sea.|solitude,self-reliance|contemplate,contemplative
  self-reliance|reliance on one's own abilities and judgment|自立，依靠自己|Emerson's essay praised ___ above conformity.|Living on the farm taught them ___.|The program builds ___ in young people.|nonconformity,contemplation
  nonconformity|refusal to follow accepted customs or beliefs|不合规范，不墨守成规|His ___ shocked the quiet town.|The writer was famous for her ___.|In the 1960s, ___ became a kind of fashion.|self-reliance,monastic|
  simplicity|the quality of being plain and uncomplicated|简单，朴素|Thoreau urged readers to choose ___ over wealth.|The ___ of the design is its strength.|She admired the ___ of village life.|monastic,contemplation
  `,
);

const justice = batch(
  "words-of-justice-and-protest",
  ["Words of Justice and Protest", "正义与抗议的词"],
  ["protest and the struggle for justice", "抗议与争取正义的斗争"],
  `
  agitator|a person who stirs up people to protest or demand change|煽动者，鼓动者|The factory owners blamed an outside ___ for the strike.|She was called an ___ for speaking at every rally.|The ___ was arrested for organizing the march.|militant,subversive|agitators
  militant|willing to use strong or aggressive methods to support a cause|激进的，好斗的|A ___ group broke away from the peaceful movement.|Her speeches grew more ___ after the arrests.|The union took a ___ stand against the cuts.|subversive,agitator|militants,militancy
  sit-in|a protest in which people sit in a place and refuse to leave|静坐抗议|Students held a ___ at the lunch counter.|The ___ lasted for six days in the dean's office.|Police arrived to break up the ___.|walkout,civil disobedience|sit-ins
  walkout|a protest in which workers or students leave together|罢工，集体退场|The nurses staged a ___ over unsafe hours.|A ___ by students emptied the classrooms.|The ___ ended when the company agreed to talk.|sit-in,crackdown|walkouts
  injunction|an official order from a court telling someone to do or stop doing something|禁令，法院命令|The company won an ___ to stop the strike.|A judge issued an ___ against the march.|They ignored the ___ and kept protesting.|crackdown,redress|injunctions
  civil disobedience|the peaceful refusal to obey a law that one believes is unjust|公民不服从|Thoreau went to jail for ___.|Gandhi used ___ against British rule.|The sit-ins were acts of ___.|militant,sit-in
  tyrannical|using power in a cruel and unfair way|暴虐的，专横的|The people rose up against the ___ governor.|Her ___ boss punished every small mistake.|The novel describes life under a ___ regime.|subversive,militant|
  crackdown|strong official action to stop an activity or a group|镇压，严厉打击|The government ordered a ___ on protests.|After the ___, many leaders fled the country.|A ___ on dissent followed the election.|injunction,walkout|crackdowns
  redress|the act of setting right a wrong|纠正，补偿|The workers sought ___ for years of unpaid wages.|The court offered no ___.|Citizens may petition for ___ of grievances.|subversive,walkout
  subversive|trying to weaken or overthrow an established system|颠覆性的|The pamphlet was banned as ___.|Officials called the poet's songs ___.|Her ___ humor mocked the people in power.|tyrannical,militant|
  `,
);

const equality = batch(
  "words-of-equality-and-freedom",
  ["Words of Equality and Freedom", "平等与自由的词"],
  ["equality, rights and freedom", "平等、权利与自由"],
  `
  equity|fairness, especially in giving people what they need to have equal chances|公平，公正|The plan aims at ___ in school funding.|Groups pressed for ___ in pay.|___ sometimes means giving more help to those who start with less.|parity,disparity|
  enfranchisement|the giving of the right to vote|赋予选举权|The ___ of women came after decades of struggle.|The law brought ___ to millions.|Universal ___ is a mark of democracy.|disenfranchise,equity
  disenfranchise|to take away someone's right to vote|剥夺选举权|Unfair tests were used to ___ many voters.|The new law would ___ thousands of citizens.|They feared the rules would ___ the poor.|enfranchisement,desegregation|disenfranchised,disenfranchisement
  desegregation|the ending of laws or practices that keep groups apart|废除种族隔离|The ___ of schools began in the 1950s.|Some towns resisted ___ for years.|Court orders forced the ___ of buses.|integration,bigotry|
  integration|the act of bringing people of different groups together as equals|融合，(种族)平等|School ___ was a slow and painful process.|The city worked toward full ___ of its neighborhoods.|___ of the army came in 1948.|desegregation,parity|
  bigotry|strong, unfair dislike of people who are different|偏执，偏见|The speech was full of ___ against immigrants.|She fought ___ in every form.|Education alone cannot end ___.|disparity,egalitarian|
  parity|the state of being equal, especially in pay or position|同等，平等|Women demanded ___ with men in wages.|The league aims for ___ between the teams.|___ between the two groups is still far off.|equity,disparity|
  egalitarian|believing that all people are equal and deserve equal rights|平等主义的|The founders spoke of an ___ society.|Their ___ school had no prizes or ranks.|The village had an ___ tradition.|inalienable,bigotry|egalitarianism
  inalienable|unable to be taken away or given away|不可剥夺的|The Declaration speaks of ___ rights.|Freedom of thought is an ___ right.|Some believe dignity is ___.|egalitarian,disparity
  disparity|a large and unfair difference between things|悬殊，不平等|There is a huge ___ between rich and poor schools.|The report showed a ___ in health care.|The ___ in pay angered the workers.|parity,bigotry|disparities
  `,
);

/** batchesA are the batches of the first units of grade 11. */
export const batchesA: readonly BatchSpec[] = [wealth, hope, nature, solitude, justice, equality];
