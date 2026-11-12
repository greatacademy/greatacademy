// Grade 12: the batches of words of war and peacemaking, of talk, of joy and gloom, of memory, of courage and fear,
// of beginnings and ends, of cunning and of likeness.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const war = batch(
  "words-of-battle-and-siege",
  ["Words of Battle and Siege", "战斗与围攻的词"],
  ["fighting, attacks and pauses in war", "战斗、进攻和战事的停歇"],
  `
  bellicose|eager to fight or start a war|好战的|The ___ general wanted to invade at once.|His ___ speech alarmed the neighbors.|The ___ tone of the letter shocked us.|pugnacious,mercenary|
  pugnacious|eager to argue or fight|好斗的，爱争吵的|The ___ boxer insulted his rival.|She has a ___ style of debate.|A ___ terrier barked at every dog.|bellicose,mercenary|pugnacity
  ceasefire|an agreement to stop fighting|停火|The two sides agreed to a ___ for the holiday.|The ___ lasted only a week.|Both armies broke the ___.|hostilities,sortie|ceasefires
  hostilities|acts of fighting in a war|战事，交战|___ broke out along the border.|Both sides agreed to end ___.|After months of ___, the city lay in ruins.|ceasefire,onslaught|
  skirmish|a short, small fight between small groups|小规模战斗，小冲突|A ___ broke out near the bridge.|There was a ___ between fans outside.|Only three soldiers were hurt in the ___.|foray,onslaught|skirmishes
  onslaught|a fierce or violent attack|猛攻|The fort could not survive the ___.|The team faced an ___ of shots in the second half.|An ___ of emails followed the news.|skirmish,sortie|
  besiege|to surround a place with an army to force it to give up; to crowd around|围攻；包围|The army began to ___ the castle.|Fans ___ the star at the airport.|Reporters will ___ the minister with questions.|foray,ceasefire|besieged,besieging
  mercenary|a soldier paid to fight for a foreign army; interested only in money|雇佣兵；唯利是图的|The king hired a ___ from abroad.|Each ___ fought only for gold.|His motives were purely ___.|bellicose,pugnacious|mercenaries
  sortie|an attack made by troops coming out from a place under siege|(被围部队的)突围出击|The defenders made a ___ at dawn.|A night ___ surprised the enemy camp.|The pilot flew his tenth ___ that week.|foray,onslaught|sorties
  foray|a sudden attack or raid into enemy land; a brief first try at something new|突袭；初次尝试|The raiders made a ___ across the river.|Her first ___ into politics failed.|The company's ___ into films lost money.|sortie,skirmish|forays
  `,
);

const peace = batch(
  "words-of-calming-and-defiance",
  ["Words of Calming and Defiance", "安抚与固执的词"],
  ["soothing anger and refusing to yield", "平息怒气与拒不让步"],
  `
  conciliate|to stop someone being angry; to bring together|安抚；调解|He tried to ___ the angry neighbors.|The judge hoped to ___ the two parties.|A gift may ___ her.|assuage,intransigent|conciliated,conciliation,conciliatory
  assuage|to make an unpleasant feeling less intense|缓和，减轻(痛苦、忧虑等)|Nothing could ___ her grief.|A cold drink will ___ your thirst.|The minister tried to ___ public fears.|soothe,obdurate|assuaged
  appease|to calm someone by giving them what they demand|姑息，满足要求以平息|Leaders who ___ a bully only encourage him.|They gave in to ___ the strikers.|He brought flowers to ___ his wife.|propitiate,recalcitrant|appeased,appeasement
  soothe|to gently calm someone or ease pain|安慰；缓解|A lullaby will ___ the baby.|This cream will ___ the burn.|She tried to ___ her angry father.|assuage,implacable|soothed
  pacify|to make calm or peaceful; to bring a region under control|使平静；平定|The nurse tried to ___ the patient.|The army struggled to ___ the region.|A song can ___ a fretful baby.|conciliate,intransigent|pacified,pacifier
  propitiate|to win the favor of a god or person by doing something to please them|讨好，抚慰(神灵等)|The villagers made offerings to ___ the gods.|He bought gifts to ___ his boss.|They sang to ___ the angry spirits.|appease,obdurate|propitiated,propitiation
  intransigent|refusing to change one's views or to agree|不妥协的|The ___ union rejected every offer.|Both sides remained ___.|Her ___ stance ended the talks.|obdurate,pacify|intransigence
  obdurate|stubbornly refusing to change one's opinion or course|顽固的，执拗的|The ___ old man would not move.|She was ___ in her refusal.|No plea could move the ___ judge.|intransigent,assuage|
  recalcitrant|stubbornly refusing to obey rules or authority|不服管教的，桀骜不驯的|The teacher sent the ___ pupil to the head.|A ___ mule refused to cross.|The ___ prisoners refused to eat.|obdurate,appease|recalcitrance
  implacable|unable to be calmed or satisfied|难以平息的，毫不留情的|He was an ___ enemy of the king.|Her ___ anger lasted for years.|The ___ storm battered the coast.|intransigent,soothe|implacably
  `,
);

const talk = batch(
  "words-for-talkers-and-the-silent",
  ["Words for Talkers and the Silent", "健谈者与寡言者的词"],
  ["how much and how well people speak", "人说话的多少与好坏"],
  `
  terse|using few words, sometimes rudely|简短生硬的|He sent a ___ reply.|Her ___ note said only "No."|The general gave ___ orders.|chatty,prolix|tersely
  loquacious|tending to talk a great deal|话多的|The ___ barber told us his life story.|She grew ___ after a glass of wine.|Our ___ guide never stopped talking.|garrulous,uncommunicative|loquacity
  garrulous|excessively talkative, especially about trivial things|喋喋不休的|A ___ neighbor kept us at the gate for an hour.|He became ___ in old age.|The ___ passenger annoyed everyone.|loquacious,reserved|
  uncommunicative|unwilling to talk or share information|不爱说话的，不愿交流的|The ___ teenager answered in grunts.|The company was ___ about the delay.|He grew ___ after the accident.|reserved,voluble
  reserved|slow to show feelings or give opinions|矜持的，内敛的|She is ___ with people she doesn't know.|He was a quiet, ___ man.|Her ___ manner hid a warm heart.|uncommunicative,effusive
  prolix|using too many words; long and tedious|冗长的|The ___ report ran to six hundred pages.|His ___ speech bored the guests.|Cut the ___ sentences.|terse,chatty|prolixity
  voluble|speaking fluently and at length|健谈的，滔滔不绝的|The ___ host told joke after joke.|She was ___ in defense of her plan.|His ___ protests filled the room.|loquacious,uncommunicative|volubly
  chatty|fond of friendly, informal talk|爱闲聊的|The ___ hairdresser knew all the gossip.|She wrote a ___ letter about her trip.|He was in a ___ mood after lunch.|loquacious,terse|chattily
  effusive|expressing feelings in an unrestrained, gushing way|热情洋溢的，过分的|He gave an ___ welcome to every guest.|Her ___ praise embarrassed him.|The reviews were ___.|voluble,reserved|effusively
  glib|fluent but insincere and shallow|油嘴滑舌的，随便的|The salesman had a ___ answer for everything.|Don't give me a ___ excuse.|His ___ charm hid his lies.|chatty,terse|glibly
  `,
);

const joy = batch(
  "words-of-rapture-and-gloom",
  ["Words of Rapture and Gloom", "狂喜与忧郁的词"],
  ["great happiness and deep sadness", "极度快乐与深深悲伤"],
  `
  euphoria|a feeling of intense excitement and happiness|欣快，狂喜|The ___ of victory lasted for days.|A wave of ___ swept the city.|Runners speak of a ___ near the finish.|blithe,forlorn|euphoric
  ecstatic|feeling overwhelming happiness|狂喜的|The fans were ___ after the win.|She was ___ about the job.|An ___ crowd danced in the street.|exultant,doleful|ecstatically,ecstasy
  exultant|feeling or showing triumphant joy|欢欣鼓舞的|The ___ team lifted the cup.|She gave an ___ shout.|___ voters filled the square.|ecstatic,disconsolate|exultantly
  blithe|cheerful and carefree, sometimes too carefree|快乐的，无忧无虑的|She has a ___ spirit.|His ___ disregard for danger worried us.|They walked on in ___ ignorance.|ecstatic,lugubrious|blithely
  forlorn|lonely and sad; nearly hopeless|孤苦伶仃的；无望的|A ___ puppy waited at the gate.|They made a ___ attempt to save the game.|The ___ village was empty.|woebegone,euphoria|forlornly
  disconsolate|very unhappy and unable to be comforted|郁郁寡欢的，无法安慰的|The ___ child cried for her lost cat.|He sat ___ after the loss.|Fans wandered home ___.|dejected,exultant|disconsolately
  doleful|expressing sorrow; mournful|悲哀的|The dog gave a ___ look.|A ___ tune played on the violin.|Her ___ eyes filled with tears.|lugubrious,ecstatic|dolefully
  lugubrious|looking or sounding sad and dismal, often too much|悲哀的，阴郁的|The ___ music made the film feel long.|He wore a ___ expression.|Their ___ tone dampened the party.|doleful,blithe|lugubriously
  dejected|sad and depressed; dispirited|沮丧的|The ___ players left the field.|She felt ___ after the rejection.|He sat ___ on the steps.|disconsolate,exultant|dejectedly,dejection
  woebegone|looking sad or miserable|愁眉苦脸的|The ___ child had lost her balloon.|He gave a ___ sigh.|A ___ face peered through the window.|forlorn,ecstatic|
  `,
);

const memory = batch(
  "words-of-remembering-and-forgetting",
  ["Words of Remembering and Forgetting", "记忆与遗忘的词"],
  ["what stays in the mind and what fades", "留在心里与淡出脑海的事"],
  `
  amnesia|a loss of memory|健忘症，失忆|After the crash he suffered from ___.|The film's hero wakes with ___.|Doctors hoped the ___ was temporary.|hindsight,memorabilia|amnesiac
  mnemonic|a device such as a rhyme that helps one remember|助记符，记忆术|"Every good boy deserves fruit" is a ___ for musical notes.|She made up a ___ for the planets.|A short ___ helps with spelling.|amnesia,memorabilia|mnemonics
  recollect|to remember something, often with effort|回忆起|I can't ___ his name.|She tried to ___ the address.|As far as I ___, the shop was closed.|reminiscent,forgetful|recollected
  evocative|bringing strong images, memories or feelings to mind|唤起回忆的，令人回味的|The ___ photo brought back her childhood.|It is an ___ piece of music.|The smell of pine was ___ of the holidays.|indelible,forgetful|evoke,evoked
  indelible|unable to be removed or forgotten|无法消除的，难忘的|The war left an ___ mark on him.|Write your name in ___ ink.|Her kindness made an ___ impression.|unforgettable,evocative|indelibly
  reminiscent|tending to remind one of something|使人联想起的|The tune is ___ of an old folk song.|Her style is ___ of the painters of Paris.|The smell was ___ of his grandmother's kitchen.|evocative,indelible|
  forgetful|apt to forget things|健忘的|My ___ uncle loses his keys every day.|She grows more ___ with age.|A ___ waiter brought the wrong soup.|reminiscent,unforgettable|forgetfulness
  unforgettable|impossible to forget|难忘的|The trip was an ___ experience.|Her voice is ___.|They spent an ___ night under the stars.|indelible,forgetful|
  hindsight|understanding of a situation only after it has happened|事后的认识|With ___, we should have left earlier.|___ makes every mistake look obvious.|In ___, the plan was foolish.|amnesia,mnemonic|
  memorabilia|objects kept or collected because of their connection with people or events|纪念品，收藏品|He collects football ___.|The museum shows war ___.|A shop sold film ___.|mnemonic,hindsight|
  `,
);

const courage = batch(
  "words-of-daring-and-timidity",
  ["Words of Daring and Timidity", "大胆与胆怯的词"],
  ["bravery, recklessness and cowardice", "勇敢、鲁莽与怯懦"],
  `
  dauntless|showing fearlessness and determination|无畏的，不屈不挠的|The ___ explorers crossed the ice.|She was a ___ fighter for justice.|With ___ courage, he entered the fire.|fearless,timorous|
  fearless|without fear|无所畏惧的|The ___ child climbed the tallest tree.|She is a ___ reporter.|A ___ dog chased the bear away.|dauntless,cowardly|fearlessly,fearlessness
  plucky|having courage and spirit, especially in a hard situation|有胆量的，勇敢的|The ___ little team beat the champions.|A ___ girl stood up to the bully.|The ___ climber kept going despite her injury.|gutsy,spineless|pluck
  gutsy|showing courage and determination|有胆识的，勇敢的|It was a ___ decision to quit and start again.|She gave a ___ performance on an injured ankle.|A ___ move won them the game.|plucky,fainthearted|
  daring|willing to take bold risks|大胆的|The ___ rescue saved six lives.|She wore a ___ red dress.|The thieves made a ___ escape.|foolhardy,timorous|daringly
  foolhardy|recklessly bold|有勇无谋的，鲁莽的|It was ___ to swim in the storm.|A ___ plan put everyone at risk.|Only a ___ climber goes up alone in winter.|daring,cowardly|
  timorous|showing or suffering from nervousness or lack of confidence|胆小的，羞怯的|A ___ voice answered the door.|The ___ deer fled at the sound.|She gave a ___ smile.|fainthearted,dauntless|timorously
  fainthearted|lacking courage; timid|胆怯的|This film is not for the ___.|He was too ___ to complain.|___ voters stayed home.|timorous,gutsy|
  cowardly|lacking courage|怯懦的|It was a ___ attack on an unarmed man.|The ___ guard ran away.|He was ashamed of his ___ silence.|spineless,fearless|coward,cowardice
  spineless|weak and lacking courage or determination|没骨气的，懦弱的|The ___ manager agreed with everyone.|They called the council ___.|A ___ leader won't stand up to bullies.|cowardly,plucky|
  `,
);

const beginnings = batch(
  "words-of-beginnings-and-endings",
  ["Words of Beginnings and Endings", "开端与终结的词"],
  ["how things start, grow and stop", "事物如何开始、发展和结束"],
  `
  inception|the establishment or starting point of something|开端，创立|The club has grown since its ___ in 1990.|She has led the project from its ___.|At its ___, the company had two workers.|genesis,cessation|
  genesis|the origin or creation of something|起源，创始|The ___ of the idea was a dinner party.|The book traces the ___ of the war.|Few know the ___ of the song.|inception,demise|
  nascent|just beginning to exist and develop|新生的，初期的|The ___ industry needed support.|Her ___ career was full of promise.|They backed the ___ democracy.|incipient,embryonic|
  incipient|in an early stage; beginning to happen|初期的，刚出现的|Doctors caught the ___ disease.|There were signs of ___ panic.|An ___ crack ran across the wall.|nascent,embryonic|
  embryonic|in a very early stage of development|萌芽的，初期的|The plan is still at an ___ stage.|An ___ idea grew into a business.|The ___ chick moved inside the egg.|incipient,nascent|embryo
  outset|the start or beginning of something|开始，开端|She made her aims clear from the ___.|At the ___, nobody expected to win.|Problems arose at the ___.|advent,cessation|
  advent|the arrival of a notable person, thing or event|到来，出现|The ___ of the internet changed everything.|Before the ___ of cars, people rode horses.|The ___ of spring brought flowers.|outset,demise|
  culminate|to reach a highest point or climax|达到顶点，以…告终|The tour will ___ in a concert in Rome.|Years of work ___ in this prize.|The quarrel may ___ in a fight.|cessation,inception|culminated,culmination
  cessation|the fact or process of ending|停止|They called for a ___ of fighting.|The ___ of rain brought relief.|Smoking ___ improves health.|demise,advent|
  demise|the end of something; death|终结；死亡|The ___ of the local shop saddened us.|The king's ___ led to war.|Online sales led to the ___ of many stores.|cessation,genesis|
  `,
);

const cunning = batch(
  "words-of-wit-and-wiles",
  ["Words of Wit and Wiles", "机智与诡计的词"],
  ["cleverness, wisdom and trickery", "聪明、智慧与诡计"],
  `
  conniving|secretly planning to do something harmful or illegal|暗中策划的，纵容的|The ___ servant stole the will.|Her ___ cousin plotted to take the farm.|He was a ___ and greedy man.|crafty,sagacious|connive,connived
  astute|good at judging situations and turning them to one's advantage|精明的，敏锐的|She is an ___ investor.|It was an ___ observation.|The ___ lawyer saw the trap.|perspicacious,devious|astutely
  judicious|having or showing good judgment|明智的，审慎的|A ___ use of salt improves the dish.|She made a ___ choice of words.|It would be ___ to wait.|sagacious,artful|judiciously
  crafty|clever at getting what one wants, often by deceit|狡猾的|A ___ thief tricked the guard.|That was a ___ move.|The ___ old man hid the money well.|conniving,astute|craftily
  artful|clever in a cunning way; skillfully done|狡诈的；巧妙的|The ___ dodger slipped away.|It was an ___ arrangement of flowers.|He gave an ___ answer that told us nothing.|crafty,scheming|artfully
  canny|shrewd and careful, especially in money or business|精明谨慎的|A ___ shopper waits for the sales.|The ___ farmer saved for hard years.|She made a ___ choice of partner.|astute,conniving|
  devious|showing a skillful use of underhanded tactics|不光明正大的，迂回的|He had a ___ plan to get rich.|She used ___ means to win.|They took a ___ route to avoid the police.|scheming,sagacious|deviously
  scheming|making secret, dishonest plans|诡计多端的，阴险的|The ___ uncle wanted the throne.|Her ___ cousin lied to everyone.|They were sick of his ___ ways.|devious,canny|schemer
  perspicacious|having a ready insight into things; quick to understand|敏锐的，有洞察力的|The ___ critic saw the flaw at once.|A ___ teacher noticed her talent.|The report was ___.|astute,judicious|perspicacity
  sagacious|having keen judgment and wisdom|睿智的，有远见的|The ___ elder settled the dispute.|It was a ___ decision.|A ___ owl appears in the story.|perspicacious,conniving|sagacity
  `,
);

const likeness = batch(
  "words-of-likeness-and-difference",
  ["Words of Likeness and Difference", "相似与差异的词"],
  ["things that are alike and things that differ", "相像之物与不同之物"],
  `
  analogous|comparable in certain respects|类似的|The heart is ___ to a pump.|The two cases are ___.|An ___ problem arose in Spain.|akin,disparate|
  akin|of similar character; related|类似的，同族的|Her feeling was ___ to fear.|Music is ___ to language.|What he did was ___ to theft.|analogous,divergent|
  disparate|essentially different in kind; not able to be compared|迥然不同的|The book joins ___ ideas.|They come from ___ backgrounds.|___ groups formed a team.|heterogeneous,homogeneous|
  homogeneous|of the same kind; alike throughout|同质的，均匀的|The village was a ___ community.|Mix the paint until it is ___.|The class is not a ___ group.|heterogeneous,dissimilar|homogeneity
  heterogeneous|made up of different kinds|异质的，混杂的|The city has a ___ population.|It is a ___ collection of essays.|The rock is ___ in texture.|homogeneous,kindred|heterogeneity
  divergent|tending to be different or develop in different directions|分歧的，不同的|They hold ___ views on the matter.|The two languages are ___.|___ paths led them apart.|congruent,akin|
  congruent|in agreement or harmony; identical in shape and size|一致的；全等的|The two triangles are ___.|His actions were ___ with his words.|Our goals are ___.|divergent,disparate|congruence
  dissimilar|not alike; different|不同的，不相似的|The twins are quite ___.|We had ___ tastes in music.|The two plans are not ___.|homogeneous,analogous|dissimilarity
  kindred|similar in kind; related|相似的；有亲缘关系的|They were ___ spirits.|Physics and chemistry are ___ subjects.|She felt a ___ bond with the poet.|akin,semblance|
  semblance|the outward appearance of something, often hiding something else|外观，表象|The town had a ___ of normal life.|There was no ___ of order.|He tried to keep a ___ of calm.|kindred,analogous|
  `,
);

/** batchesH are the batches of battle, calming and defiance, talk, rapture and gloom, memory, daring, beginnings, wiles and likeness. */
export const batchesH: readonly BatchSpec[] = [war, peace, talk, joy, memory, courage, beginnings, cunning, likeness];
