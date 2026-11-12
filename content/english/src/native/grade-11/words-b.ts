// Grade 11: the batches of words of the later units, from migration and identity and home and exile to industry and
// labor, machines and their ethics, and two sets of academic words.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const migration = batch(
  "words-of-migration-and-identity",
  ["Words of Migration and Identity", "迁徙与身份的词"],
  ["moving to a new country and finding oneself", "移居新国度与寻找自我"],
  `
  expatriate|a person living outside their own country|侨民，旅居国外的人|An American ___ in Paris wrote the novel.|The city has a large ___ community.|As an ___, she missed her family's holidays.|itinerant,sojourner|expatriates
  cosmopolitan|including people and ideas from many countries|世界性的，四海为家的|London is a ___ city of many languages.|Her ___ friends came from six continents.|He had a ___ outlook from years abroad.|multicultural,transnational|
  acculturation|the process of adapting to a new culture while still keeping parts of one's own|文化适应|___ can be hard for older immigrants.|The study looked at the ___ of new arrivals.|Language is a key part of ___.|cosmopolitan,transnational
  transnational|reaching across the borders of two or more countries|跨国的|Many migrants now live ___ lives, at home in two countries.|The family runs a ___ business.|___ ties connect the village with its sons abroad.|cosmopolitan,multicultural|
  itinerant|travelling from place to place, often for work|流动的，巡回的|___ workers followed the harvest across the country.|The ___ preacher rode from town to town.|An ___ life left him no time to settle.|expatriate,sojourner|
  multicultural|including people of many cultures|多元文化的|The school celebrates its ___ student body.|A ___ festival filled the square with music.|Canada calls itself a ___ society.|cosmopolitan,bicultural|
  sojourner|a person who stays somewhere for a time but does not settle|旅居者，过客|He saw himself as a ___, not an immigrant.|Each worker came as a ___ and stayed for life.|The ___ always meant to go home.|expatriate,itinerant|sojourners
  residency|the legal right to live in a country|居住权|She applied for permanent ___.|Years of ___ are needed before citizenship.|His ___ papers arrived after a long wait.|expatriate,transnational|
  hyphenated|describing an identity made of two parts, such as Chinese-American|(身份)带连字符的，双重的|She writes about growing up with a ___ identity.|The poet calls himself a ___ American.|A ___ name can show two heritages.|bicultural,itinerant
  bicultural|belonging to or at home in two cultures|双文化的|Growing up ___, she spoke two languages at home.|The ___ students acted as bridges in the school.|His ___ childhood gave him two ways of seeing.|hyphenated,multicultural|biculturalism
  `,
);

const exile = batch(
  "words-of-home-and-exile",
  ["Words of Home and Exile", "家园与流亡的词"],
  ["home, exile and longing", "家园、流亡与思念"],
  `
  haven|a place of safety and peace|避风港，安全之所|The library was a ___ from the noise of the city.|The port became a ___ for refugees.|Her grandmother's kitchen was a ___.|refuge,homecoming|havens
  refuge|protection from danger or trouble|庇护，避难|Thousands sought ___ across the border.|The church offered ___ to the families.|She found ___ in her books.|haven,expulsion|
  repatriate|to send or bring someone back to their own country|遣返|The government agreed to ___ the prisoners of war.|The museum will ___ the stolen statues.|They hoped to ___ the remains of the soldiers.|refuge,dispossessed|repatriated,repatriation
  dispossessed|having had one's land, home or property taken away|被剥夺财产的，无家可归的|The war left millions ___.|The ___ farmers moved to the cities.|The novel tells the story of a ___ family.|stateless,uprooted|
  uprooted|forced to leave a place where one has lived for a long time|被迫离开家园的|The ___ family had to start again in a new city.|She felt ___ after moving for the third time.|Many villagers were ___ by the new dam.|dispossessed,rootless|uproot
  rootless|having no settled home or sense of belonging|无根的，漂泊的|After years of moving, she felt ___.|The war created a ___ generation.|A ___ life can be free but lonely.|uprooted,outcast|
  homecoming|a return to one's home after a long absence|归乡，回家|The soldier's ___ was full of tears.|Her ___ after twenty years was bittersweet.|The village prepared a feast for his ___.|haven,expulsion|homecomings
  stateless|having no country of citizenship|无国籍的|The ___ man could not get a passport.|Thousands of ___ people live in camps.|Being ___ means having no government's protection.|dispossessed,repatriate|statelessness
  outcast|a person rejected by society or a group|被遗弃者，被排斥的人|He lived as an ___ on the edge of town.|The novel's hero is a social ___.|She felt like an ___ in her new school.|rootless,dispossessed|outcasts
  expulsion|the act of forcing someone to leave a place|驱逐，开除|The ___ of the families shocked the world.|He faced ___ from the school.|After their ___, they never saw their village again.|refuge,repatriate|expulsions
  `,
);

const industry = batch(
  "words-of-industry-and-labor",
  ["Words of Industry and Labor", "工业与劳动的词"],
  ["factories, workers and their struggles", "工厂、工人及其斗争"],
  `
  drudgery|hard, boring work that must be done again and again|苦差事，单调乏味的工作|Machines saved housewives from much ___.|The ___ of the mill wore them down.|She escaped the ___ of the farm by studying.|piecework,lockout|
  piecework|work paid by the amount done, not by the hour|计件工作|Seamstresses did ___ at home for pennies.|___ pushed workers to rush and make mistakes.|Under ___, the fastest earned the most.|drudgery,lockout|
  proletariat|workers who earn wages, especially in industry, considered as a class|无产阶级|Marx wrote of the struggle of the ___.|The ___ of the mill town lived in crowded houses.|The novel shows the life of the urban ___.|bourgeoisie,drudgery
  bourgeoisie|the middle class, especially owners of property and business|资产阶级|The ___ lived in large houses on the hill.|The revolution was aimed at the ___.|Novelists often mocked the habits of the ___.|proletariat,lockout
  lockout|the closing of a workplace by employers to force workers to accept terms|闭厂，停工|The owners declared a ___ when the union refused.|The ___ left thousands without pay.|After a month-long ___, the workers gave in.|strikebreaker,arbitration|lockouts
  magnate|a very rich and powerful person in an industry|巨头，大亨|The steel ___ built a mansion on the hill.|A railroad ___ owned half the town.|The newspaper ___ shaped public opinion.|bourgeoisie,blacklist|magnates
  blacklist|a list of people to be refused work or punished|黑名单|Union leaders were put on a ___.|The ___ kept him from any job in the city.|Studios kept a ___ of suspected writers.|lockout,magnate|blacklists,blacklisted
  arbitration|the settling of a dispute by a neutral person or group whose decision both sides accept|仲裁|The strike ended when both sides agreed to ___.|The case went to ___.|___ can be faster than a court case.|blacklist,collective bargaining|arbitrate,arbitrator
  collective bargaining|talks between an employer and a union about wages and conditions|集体谈判|Through ___, the workers won a shorter week.|The law protected the right to ___.|___ broke down after six months.|arbitration,strikebreaker
  strikebreaker|a person who works while others are on strike, or who is hired to replace strikers|破坏罢工者|A ___ crossed the picket line under police guard.|The company hired a ___ to keep the mill running.|Workers shouted at the ___ as he passed.|magnate,proletariat|strikebreakers
  `,
);

const machines = batch(
  "words-of-machines-and-ethics",
  ["Words of Machines and Ethics", "机器与伦理的词"],
  ["technology and the questions it raises", "技术及其引发的问题"],
  `
  autonomous|able to act or operate without human control|自主的，自动的|___ cars may one day drive without anyone at the wheel.|The drone flew an ___ route.|Engineers tested an ___ robot in the warehouse.|biometric,unregulated|
  biometric|using measurements of the body, such as fingerprints or faces, to identify people|生物识别的|The phone uses ___ data to unlock.|___ scanners checked travelers at the airport.|Critics fear ___ tracking in public spaces.|autonomous,transparency|biometrics
  transparency|openness about how decisions are made|透明度，公开性|Citizens demanded ___ about the program.|The company promised ___ in how its app pays riders.|Without ___, no one can check the system.|oversight,safeguard|
  safeguard|something that protects against harm|保护措施，保障|The law adds a ___ for children's data.|A human review is an important ___.|A strong ___ prevents misuse.|oversight,transparency|safeguards
  dystopian|describing an imagined society that is unjust and frightening|反乌托邦的|Orwell's ___ novel warns of total control.|The film shows a ___ future of endless war.|Some fear a ___ world run by machines.|utopian,oversight|
  utopian|describing an imagined perfect society|乌托邦的|The settlers tried to build a ___ community.|His ___ dream ignored human nature.|___ novels describe a world without poverty.|dystopian,safeguard|
  unintended consequence|a result of an action that was not planned or expected|意外后果|The new road had an ___: more traffic.|One ___ of the law was higher prices.|Every invention brings some ___.|oversight,dystopian|unintended consequences
  oversight|the job of watching over something to make sure it is done properly|监督，监管|The system ran without human ___.|An independent board provides ___.|Lack of ___ allowed the errors to spread.|safeguard,transparency|
  unregulated|not controlled by laws or rules|不受监管的|___ apps collect huge amounts of data.|The market was ___ and chaotic.|Critics warned against ___ use of the technology.|autonomous,biometric|
  luddite|a person who opposes new technology|反对新技术的人|He called himself a ___ and refused to own a phone.|Critics dismissed her as a ___.|Being careful is not the same as being a ___.|utopian,dystopian|luddites
  `,
);

const academic8 = batch(
  "academic-words-8",
  ["Academic Words 8", "学术词汇 8"],
  ["building and weighing arguments", "构建与权衡论证"],
  `
  tenable|able to be defended against attack or criticism|站得住脚的，可辩护的|The theory is no longer ___ after the new data.|Her position was ___ only with more evidence.|The lawyer argued that the claim was not ___.|spurious,plausibility|
  spurious|false, though it may appear true|虚假的，似是而非的|The article made ___ claims about the cure.|A ___ link between the two events misled readers.|He dismissed the charge as ___.|tenable,veracity|
  credence|belief that something is true|相信，信任|The new study gives ___ to her idea.|No one gave ___ to the rumor.|Witnesses lent ___ to his story.|veracity,assertion|
  veracity|truthfulness or accuracy|真实性|Historians questioned the ___ of the diary.|The ___ of his account was never doubted.|Reporters must check the ___ of their sources.|credence,spurious|
  assertion|a strong statement that something is true|断言，主张|Her ___ was not backed by any evidence.|The ___ that crime had fallen was false.|Each ___ in the essay needs support.|credence,presuppose|assertions
  presuppose|to assume something is true before an argument begins|预设，以……为前提|The plan seems to ___ that everyone owns a car.|Such questions ___ a certain answer.|Arguments that ___ their conclusion are weak.|assertion,tacit|presupposes,presupposed
  tacit|understood without being said|心照不宣的，默认的|There was a ___ agreement not to mention the war.|Her silence gave ___ approval.|They had a ___ understanding about the rules.|overt,nuanced|tacitly
  nuanced|showing small but important differences in meaning|细致入微的，有细微差别的|Her ___ reading of the poem impressed the class.|The issue needs a ___ answer, not a slogan.|A ___ argument admits what the other side gets right.|tacit,plausibility|
  overt|done or shown openly; not hidden|公开的，明显的|There was no ___ racism, but the effects were clear.|The threat was ___ and direct.|___ signs of anger appeared in his face.|tacit,spurious|overtly
  plausibility|the quality of seeming reasonable or likely|可信度，似乎合理|The story's ___ depends on one detail.|Scientists tested the ___ of the idea.|The film strains ___ in its last scene.|veracity,tenable
  `,
);

const academic9 = batch(
  "academic-words-9",
  ["Academic Words 9", "学术词汇 9"],
  ["writing about causes, change and evidence", "论述原因、变化与证据"],
  `
  galvanize|to shock or excite people into taking action|激励，激起|The fire helped ___ support for new laws.|Her speech will ___ the students to act.|Leaders hoped the news would ___ the voters.|impetus,precursor|galvanized,galvanizes
  precursor|something that comes before and leads to something else|先驱，前兆|The abacus was a ___ of the calculator.|Small tremors can be a ___ to an earthquake.|The early protests were a ___ to the revolution.|galvanize,dichotomy|precursors
  impetus|a force that makes something happen or happen faster|推动力，动力|The report gave new ___ to the campaign.|Lack of money removed the ___ to finish.|What was the ___ for the change?|galvanize,dichotomy
  dichotomy|a division into two opposite or very different parts|二分法，对立|The essay rejects the ___ between nature and culture.|There is a false ___ between work and play.|The old ___ of good and evil is too simple.|precursor,ramification|dichotomies
  ramification|a result or consequence, often a complicated one|后果，衍生影响|The decision had one ___ nobody expected.|Consider every ___ of the new law.|Every ___ of the ruling took years to appear.|precursor,dichotomy|ramifications
  proliferate|to increase quickly in number|激增，扩散|Fake news stories ___ during elections.|Coffee shops began to ___ across the city.|Weeds ___ in the warm, wet weather.|attenuate,precipitate|proliferated,proliferation
  precipitate|to cause something bad to happen suddenly|促成，引发|The crisis could ___ a war.|His rude remarks could ___ a quarrel.|A small mistake may ___ a disaster.|proliferate,impetus|precipitated
  attenuate|to make something weaker or less in amount or effect|使减弱，使减少|Distance can ___ the sound.|The new law will ___ the power of the courts.|Time did not ___ her grief.|proliferate,undermine|attenuated,attenuation
  undermine|to weaken something gradually|逐渐削弱，破坏|Lies ___ trust between friends.|The scandal began to ___ the government.|Poor sleep can ___ your health.|bolster,attenuate|undermined,undermines
  bolster|to support or strengthen something|支持，加强|New evidence helped ___ her case.|The coach tried to ___ the team's confidence.|The loan will ___ the struggling business.|undermine,precipitate|bolstered,bolsters
  `,
);

/** batchesB are the batches of the later units of grade 11. */
export const batchesB: readonly BatchSpec[] = [migration, exile, industry, machines, academic8, academic9];
