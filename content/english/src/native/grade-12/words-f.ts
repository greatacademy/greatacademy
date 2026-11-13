// Grade 12: the last academic words, and the batches of words of building, of praise and blame, of fame and of secrets.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const academic12 = batch(
  "academic-words-12",
  ["Academic Words 12", "学术词汇 12"],
  ["spreading ideas and what they imply", "传播观点及其含义"],
  `
  disseminate|to spread information or ideas widely|传播，散布|The charity will ___ the results to every school.|Social media can ___ rumors in minutes.|The study will ___ its findings in three journals.|codify,obviate|disseminated,dissemination
  promulgate|to make a law or idea known officially and publicly|颁布，宣传|The king will ___ a new code of law.|The church tried to ___ its teachings.|The ministry must ___ the rules in the official gazette.|obviate,conflate|promulgated,promulgation
  codify|to arrange laws or rules into a written system|编纂，使成法典|Napoleon set out to ___ the laws of France.|The guide tries to ___ good practice.|No one bothered to ___ the rules in writing.|conflate,connote|codified,codification
  conflate|to combine two or more ideas into one, often wrongly|混为一谈|Do not ___ wealth with happiness.|The article seems to ___ two different studies.|Critics tend to ___ the singer with her songs.|denote,connote|conflated,conflation
  connote|to suggest a feeling or idea beyond the basic meaning|暗示，意味着|"Home" can ___ warmth as well as a building.|The word "cheap" can ___ poor quality.|Red may ___ danger or love.|denote,entail|connoted
  denote|to mean or refer to something directly|表示，指代|The symbol π is used to ___ a number.|On the map, a red cross will ___ a hospital.|In this map, blue lines ___ rivers.|connote,conflate|denoted
  entail|to involve something as a necessary part or result|牵涉，需要|The job will ___ a lot of travel.|What does the plan ___?|Freedom may ___ risk.|obviate,codify|entailed,entails
  necessitate|to make something necessary|使成为必需|The injury will ___ surgery.|Rising costs ___ a change in plan.|The storm may ___ closing the school.|obviate,denote|necessitated,necessitates
  obviate|to remove a need or difficulty|排除，消除(需要)|The new bridge will ___ the long detour.|A vaccine would ___ the need for treatment.|Good planning can ___ most problems.|necessitate,engender|obviated
  engender|to cause a feeling or situation to exist|产生，引起|Unfair rules ___ anger.|The teacher tried to ___ a love of reading.|Poverty can ___ crime.|obviate,denote|engendered,engenders
  `,
);

const academic13 = batch(
  "academic-words-13",
  ["Academic Words 13", "学术词汇 13"],
  ["helping, hindering and replacing", "促进、阻碍与取代"],
  `
  foster|to help something develop; to look after a child that is not one's own|促进，培养；寄养|Good teachers ___ curiosity.|The family agreed to ___ two children.|The program aims to ___ trade between the towns.|negate,supplant|fostered,fostering
  catalyze|to cause or speed up a change|促进，催化|The protest helped ___ reform.|Enzymes ___ reactions in the body.|One small grant can ___ a whole project.|supersede,negate|catalyzed
  impede|to slow down or block progress|妨碍，阻碍|Fallen trees ___ the rescue teams.|Poor roads ___ trade.|Nothing should ___ the investigation.|augment,underscore|impeded,impediment
  hinder|to make it harder for something to happen|阻碍，妨碍|Bad weather may ___ the search.|Shyness can ___ a student's progress.|The lack of funds will ___ the work.|augment,foster|hindered,hindrance
  underpin|to support from below; to form the basis of|支撑，构成基础|Strong evidence must ___ every claim.|Trust must ___ every good friendship.|Steel beams ___ the old building.|underscore,augment|underpinned,underpinning
  underscore|to emphasize; to draw a line under|强调；在…下划线|The report seeks to ___ the need for action.|She paused to ___ her point.|The accident served to ___ the danger of the road.|underpin,negate|underscored,underscores
  augment|to make something larger by adding to it|增加，增强|She took a second job to ___ her income.|A string section will ___ the band.|New data will ___ the study.|foster,negate|augmented,augmentation
  supplant|to take the place of something or someone|取代|Email has come to ___ the letter.|The young player hoped to ___ the captain.|Machines may ___ many jobs.|impede,underpin|supplanted
  supersede|to replace something older or less good|替代，取代|This version will ___ the old rules.|New laws ___ the old ones.|The phone may ___ the camera for most people.|foster,hinder|superseded,supersedes
  negate|to make something have no effect; to deny|使无效；否定|Late fees can ___ the savings.|One mistake may ___ hours of work.|You cannot ___ the facts by ignoring them.|augment,underscore|negated,negation
  `,
);

const academic14 = batch(
  "academic-words-14",
  ["Academic Words 14", "学术词汇 14"],
  ["kinds, standards and hidden qualities", "类型、标准与潜在特质"],
  `
  nullify|to make something legally void or without effect|使无效，取消|The court may ___ the contract.|A single error can ___ the result.|They tried to ___ the election.|manifest,schema|nullified,nullification
  invalidate|to show that something is false or no longer valid|使无效，证明…错误|New evidence may ___ the theory.|A missing signature will ___ the form.|The judge chose to ___ the will.|innate,manifest|invalidated
  schema|an outline or model that organizes ideas|图式，纲要|The ___ shows how the database is arranged.|Children build a ___ for what a dog is.|Her ___ for the report had five parts.|typology,criterion|schemas,schemata
  typology|a system for dividing things into types|类型学，分类|The ___ sorts novels into four kinds.|Her ___ of leaders is widely used.|The museum uses a ___ of ancient pots.|schema,criterion|typologies
  criterion|a standard by which something is judged|标准，准则|Price was the main ___ for choosing the hotel.|Each essay is marked on one ___ at a time.|Speed is not the only ___ of success.|schema,typology|
  prevalent|common at a particular time or place|流行的，普遍的|The disease is ___ in hot countries.|This view was ___ in the 1950s.|Cheating is more ___ than we think.|latent,innate|prevalence
  endemic|regularly found in a place or group; native to one area|地方性的；特有的|Malaria is ___ in the region.|Corruption was ___ in the old government.|The bird is ___ to the island.|innate,latent|
  innate|present from birth, not learned|天生的|She has an ___ sense of rhythm.|Some fears seem ___.|His ___ kindness won everyone.|latent,endemic|innately
  latent|existing but not yet developed or visible|潜在的，潜伏的|The virus can stay ___ for years.|Her ___ talent appeared at college.|There was ___ anger in the room.|manifest,prevalent|latency
  manifest|clear and easy to see; to show clearly|明显的；表现|His fear was ___ in his face.|The illness may ___ itself in a rash.|It was a ___ error.|latent,prevalent|manifested,manifestation
  `,
);

const building = batch(
  "words-of-architecture",
  ["Words of Architecture", "建筑的词"],
  ["the parts of great buildings", "宏伟建筑的组成部分"],
  `
  buttress|a support built against a wall; to support or strengthen|扶壁；支持|A flying ___ holds up the cathedral wall.|New data may ___ her argument.|A stone ___ kept the wall from falling.|parapet,colonnade|buttresses,buttressed
  facade|the front of a building; a false appearance|正面，外观；假象|The ___ of the palace faces the square.|Her smile was a ___ hiding her fear.|They repainted the ___ but not the rooms.|portico,cupola|facades
  cornice|a decorative band along the top of a wall or building|檐口，飞檐|Pigeons nested on the ___.|The ___ was carved with leaves.|A piece of the ___ fell into the street.|lintel,gable|cornices
  gable|the triangle of wall between the two slopes of a roof|山墙|Ivy covered the ___ of the cottage.|A small window sat in the ___.|The house had a steep ___.|cornice,cupola|gables
  lintel|a beam across the top of a door or window|门楣，过梁|He hit his head on the low ___.|A stone ___ spanned the doorway.|The date was carved in the ___.|gable,parapet|lintels
  parapet|a low wall along the edge of a roof, bridge or balcony|护墙，栏杆|She leaned over the ___ to look at the river.|Soldiers fired from behind the ___.|The bridge's ___ was low and old.|buttress,lintel|parapets
  colonnade|a row of columns supporting a roof|柱廊|We walked in the shade of the ___.|The temple's ___ faced the sea.|A long ___ joined the two halls.|atrium,cupola|colonnades
  portico|a porch with a roof held up by columns at the entrance of a building|门廊|Guests waited under the ___.|The museum's ___ has six columns.|A grand ___ led to the doors.|lintel,gable|porticoes
  cupola|a small dome on top of a roof|圆顶，穹顶|A golden ___ crowned the town hall.|The bell hangs in the ___.|Light poured through the windows of the ___.|gable,atrium|cupolas
  atrium|a central hall or open court, often with a glass roof|中庭|Trees grew in the ___ of the office.|The hotel's ___ was ten floors high.|They met for lunch in the ___.|colonnade,cupola|atria,atriums
  `,
);

const praise = batch(
  "words-of-praise",
  ["Words of Praise", "赞扬的词"],
  ["speaking well of people and deeds", "称赞人和事"],
  `
  commend|to praise someone formally or officially|称赞，表扬|The mayor rose to ___ the firefighters for their bravery.|I ___ your honesty.|The report goes out of its way to ___ the hospital's care.|accolade,luminary|commended,commendable
  laud|to praise highly, especially in public|赞美，称颂|Critics ___ the novel as a masterpiece.|The whole town came out to ___ its young champion.|Few people ___ a leader after he retires.|prestige,laurels|lauded,laudable
  extol|to praise enthusiastically|赞美，颂扬|The ad goes on to ___ the car's safety.|He liked to ___ his mother's cooking.|Poets ___ the beauty of the valley.|luminary,prestige|extolled,extolling
  acclaim|enthusiastic public praise|喝彩，称赞|The film won wide ___.|Her first book met with ___.|The singer returned to great ___.|luminary,glorify|acclaimed
  accolade|an award or expression of praise|荣誉，赞誉|The prize is the highest ___ in science.|She received every ___ a writer could want.|The best ___ is a reader's thanks.|acclaim,laurels|accolades
  exalt|to praise highly; to raise in rank or power|赞扬；提升|Hymns ___ the glory of God.|The king will ___ his loyal general.|The film tends to ___ violence.|luminary,prestige|exalted,exaltation
  glorify|to praise or make something seem better than it is|美化，颂扬|Some films ___ war.|The statue was built to ___ the emperor.|Don't ___ cheating.|laurels,luminary|glorified,glorification
  prestige|respect and admiration that comes from success or quality|声望，威信|The university enjoys great ___.|A medal brings ___ to the whole town.|The job has more ___ than pay.|luminary,commend|prestigious
  laurels|honor won for great achievement|荣誉，殊荣|She won her ___ in the Olympic pool.|Don't rest on your ___.|The ___ went to the youngest team.|accolade,prestige|
  luminary|a person who inspires others or is famous in a field|杰出人物，名人|Each ___ at the dinner had won a prize.|He was a ___ of modern dance.|Every ___ of the art world came.|accolade,laurels|luminaries
  `,
);

const blame = batch(
  "words-of-blame",
  ["Words of Blame", "责备的词"],
  ["speaking ill of people and scolding them", "说人坏话和斥责他人"],
  `
  vilify|to speak or write about someone in a very unpleasant, unfair way|诋毁，污蔑|The papers tried to ___ the striking workers.|It is easy to ___ people you have never met.|His enemies set out to ___ him.|admonish,censure|vilified
  disparage|to speak of someone or something as unimportant or bad|贬低，轻视|Don't ___ the work of others.|Critics liked to ___ her early films.|He would ___ any idea that was not his.|admonish,censure|disparaged,disparaging
  denigrate|to criticize unfairly and make seem worthless|诋毁，贬低|The ad tried to ___ its rival's product.|We should not ___ the efforts of volunteers.|Some writers ___ popular music.|admonish,berate|denigrated,denigration
  deride|to laugh at with contempt|嘲笑，嘲弄|Critics will ___ the plan as foolish.|The class began to ___ his accent.|They ___ what they don't understand.|admonish,berate|derided,derision
  belittle|to make someone or something seem unimportant|轻视，贬低|Don't ___ your own achievements.|He tended to ___ his sister's success.|The boss would ___ every new idea.|admonish,censure|belittled,belittling
  castigate|to criticize or punish severely|严厉批评，惩罚|The report went on to ___ the police for their failures.|She will ___ herself for the mistake.|The judge began to ___ the lawyers for their delays.|belittle,disparage|castigated
  censure|formal, strong disapproval; to express it|谴责，责难|The senator faced a vote of ___.|The council voted to ___ the mayor.|The company drew public ___.|belittle,denigrate|censured
  rebuke|to speak sharply to someone because of what they have done|指责，训斥|The coach went over to ___ the player for arguing.|Her quiet ___ silenced the room.|The teacher had to ___ the class.|denigrate,belittle|rebuked
  admonish|to warn or scold someone firmly|告诫，责备|The guard came to ___ the boys for climbing the fence.|She will ___ him gently for being late.|Doctors ___ patients to rest.|belittle,denigrate|admonished,admonition
  berate|to scold or criticize angrily at length|严厉指责，痛骂|The manager liked to ___ his staff, shouting at them in public.|She began to ___ the driver for his speed.|Don't ___ the waiter for the cook's mistake.|denigrate,admonish|berated
  `,
);

const fame = batch(
  "words-of-fame-and-obscurity",
  ["Words of Fame and Obscurity", "声名与默默无闻的词"],
  ["being known, well or badly, and being unknown", "出名、恶名与无名"],
  `
  renowned|famous and admired|著名的|The city is ___ for its bridges.|A ___ chef opened the restaurant.|She is ___ as a teacher.|obscure,anonymous|
  illustrious|famous and admired for past achievements|杰出的，著名的|The school has an ___ history.|He came from an ___ family of scientists.|Her ___ career brought her every great prize.|obscure,unsung|
  eminent|famous and respected within a particular field|卓越的，著名的|An ___ surgeon, respected across the country, led the team.|She is an ___ historian of China.|The prize went to an ___ scholar whom everyone respected.|infamous,anonymous|eminence,eminently
  celebrated|famous and praised|著名的，被称颂的|The ___ actor arrived in a small car.|His ___ novel was made into a film.|The town's ___ cheese is sold worldwide.|anonymous,obscure|
  notorious|famous for something bad|臭名昭著的|The road is ___ for accidents.|A ___ thief escaped from prison.|The city was ___ for its smog.|celebrated,eminent|notoriety,notoriously
  infamous|well known for being bad or evil|声名狼藉的|The ___ dictator ruled for thirty years.|It was the site of an ___ massacre.|He made an ___ remark about the poor.|eminent,celebrated|infamy
  obscure|not well known; hard to understand|鲜为人知的；晦涩的|The poem is by an ___ writer whom few have heard of.|The village is ___ even to locals.|His meaning was ___.|illustrious,celebrated|obscurity
  unsung|not praised or famous, though deserving to be|未被赞颂的，无名的|Nurses are the ___ heroes of the hospital.|The film honors an ___ inventor.|Many ___ workers built the railway.|renowned,celebrated|
  anonymous|of unknown name|匿名的|An ___ donor, who gave no name, paid for the new roof.|The letter was ___.|She prefers to remain ___.|celebrated,eminent|anonymity,anonymously
  celebrity|a famous person, especially in entertainment|名人；名声|A ___ opened the new mall.|He enjoyed his brief ___.|Every ___ in town came to the party.|anonymous,unsung|celebrities
  `,
);

const secrets = batch(
  "words-of-secrets",
  ["Words of Secrets", "秘密的词"],
  ["hiding things and revealing them", "隐藏与揭露"],
  `
  surreptitious|done secretly, because it would not be approved of|偷偷摸摸的|She took a ___ look at her phone.|The ___ recording was played in court.|He made ___ visits to the casino.|confidential,esoteric|surreptitiously
  furtive|trying to avoid notice, as if guilty|鬼鬼祟祟的|The boys exchanged ___ glances.|A ___ figure slipped through the gate.|He made a ___ phone call.|esoteric,arcane|furtively
  stealthy|moving quietly and carefully so as not to be noticed|悄悄的，隐秘的|The cat made a ___ approach.|___ steps crossed the attic.|The ___ plane avoided radar.|inscrutable,arcane|stealth,stealthily
  confidential|meant to be kept secret|机密的|The file is strictly ___.|Your answers are ___.|She told me in a ___ tone.|surreptitious,esoteric|confidentiality,confidentially
  cryptic|having a hidden or unclear meaning|隐秘的，晦涩的|He left a ___ note on the door.|Her ___ reply puzzled us.|The crossword's clues are ___.|stealthy,divulge|cryptically
  enigmatic|mysterious and difficult to understand|谜一般的|The Mona Lisa has an ___ smile.|He is an ___ figure in history.|Her ___ remark started rumors.|stealthy,divulge|enigma,enigmatically
  inscrutable|impossible to understand or read|不可理解的，难以捉摸的|The judge's face was ___.|The ___ ways of the market confused him.|Her ___ expression gave nothing away.|stealthy,confidential|
  arcane|known or understood by very few people|神秘的，晦涩难懂的|The tax code is full of ___ rules.|He studied ___ texts on magic.|The ___ rituals of the club amused us.|stealthy,furtive|
  esoteric|intended for or understood by only a small group|深奥的，小圈子的|The lecture was too ___ for most students.|She has ___ tastes in music.|The book explores ___ ideas about time.|stealthy,furtive|
  divulge|to make known something private or secret|泄露，透露|The reporter refused to ___ her source.|Doctors must not ___ patients' records.|He would ___ nothing about the deal.|surreptitious,furtive|divulged
  `,
);

/** batchesF are the last academic words and the batches of building, praise and blame, fame and secrets. */
export const batchesF: readonly BatchSpec[] = [academic12, academic13, academic14, building, praise, blame, fame, secrets];
