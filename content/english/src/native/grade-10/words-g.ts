// Grade 10: the batches of words of fights and squabbles, of schemes and tricks, of cruelty, of mess and dirt,
// of cleaning, of rich and poor, of pay and bills and academic words of sources and steps.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const fights = batch(
  "words-of-fights-and-squabbles",
  ["Words of Fights and Squabbles", "打斗与争吵的词"],
  ["small quarrels, street fights, conflict and stirring people up", "小争吵、街头斗殴、冲突与煽动"],
  `
  bicker|to argue about petty things|斗嘴|The twins ___ all day.|Stop it; don't ___.|They ___ over the remote.|tiff,spat|bickered,bickering
  tiff|a petty quarrel between friends or lovers|小口角|They had a ___ over dinner.|It was just a lovers' ___.|After the ___ they made up.|spat,bicker|tiffs
  spat|a short quarrel about something unimportant|小争吵|The couple had a ___.|A ___ broke out between the clubs.|It was a minor ___.|tiff,scuffle|spats
  scuffle|a short confused fight; to take part in one|扭打|A ___ broke out at the gate.|Fans began to ___ with police.|He was hurt in the ___.|brawl,spat|scuffled
  brawl|a rough noisy fight|斗殴|A ___ started in the bar.|Police broke up the ___.|They began to ___ in the street.|scuffle,clash|brawled,brawls
  clash|a violent meeting; a disagreement; to look bad together|冲突；不协调|There was a ___ between the armies.|Those colors ___.|A ___ of views.|brawl,strife|clashed,clashes
  fray|a fight or battle; to wear thin at the edges|争斗；磨损|He joined the ___.|Jeans ___ at the knees.|Nerves began to ___.|strife,clash|frayed
  strife|angry or bitter disagreement|冲突|The land was torn by ___.|Family ___ ended the firm.|Years of ___ followed.|fray,agitate|
  agitate|to make someone troubled; to campaign for change; to shake|使焦虑；鼓动；搅动|Don't ___ the patient.|Workers ___ for better pay.|___ the mixture well.|vehement,bicker|agitated,agitation
  vehement|showing strong feeling; forceful|激烈的|She made a ___ protest.|He was ___ in his denial.|There was ___ opposition.|agitate,clash|vehemently
  `,
);

const schemes = batch(
  "words-of-schemes-and-tricks",
  ["Words of Schemes and Tricks", "计谋与把戏的词"],
  ["making things up, clever plans and tricks to fool or distract", "编造、巧妙计划与骗人或转移注意的把戏"],
  `
  invent|to create something new; to make up a false story|发明；编造|Who chose to ___ the phone?|Don't ___ excuses.|She liked to ___ games.|devise,concoct|invented
  devise|to plan or invent by careful thought|设计，想出|We must ___ a plan.|He tried to ___ a new tool.|They ___ a test.|contrive,invent|devised
  concoct|to make a dish by mixing; to invent a story|调制；编造|She would ___ a soup from leftovers.|He tried to ___ an excuse.|They ___ a wild plan.|brew,devise|concocted,concoction
  brew|to make beer or tea; to begin to develop|酿造；酝酿|___ a pot of tea.|A storm began to ___.|Trouble may ___.|concoct,conjure|brewed,brewery
  conjure|to make something appear as if by magic|变魔术；想象出|The magician can ___ a rabbit.|The smell will ___ up memories.|She tried to ___ a meal from nothing.|brew,contrive|conjured,conjurer
  contrive|to bring about by clever planning; to manage something difficult|设法；策划|She managed to ___ a meeting.|They tried to ___ an escape.|He would ___ to be late.|devise,ruse|contrived
  ruse|an action meant to deceive|诡计|The call was a ___.|It was a ___ to get in.|She saw through his ___.|gimmick,tactic|ruses
  gimmick|a trick meant to attract attention|噱头|The sale is just a ___.|It's a marketing ___.|The show relied on a ___.|ruse,tactic|gimmicks,gimmicky
  tactic|an action planned to achieve a goal|策略|It was a clever ___.|They changed ___ at half time.|Delay is a common ___.|gimmick,divert|tactics,tactical
  divert|to change the direction of; to distract|使转向；转移注意|Police had to ___ traffic.|She tried to ___ his attention.|They ___ the river.|tactic,conjure|diverted,diversion
  `,
);

const cruelty = batch(
  "words-of-cruelty",
  ["Words of Cruelty", "残忍的词"],
  ["fierce, violent, unkind and unpleasant", "凶猛、暴力、无情与讨厌"],
  `
  cruel|willfully causing pain or suffering|残忍的|Don't be ___ to animals.|It was a ___ joke.|Fate can be ___.|brutal,heartless|cruelly,cruelty
  brutal|savagely violent; harsh|残暴的；严酷的|It was a ___ attack.|The winter was ___.|She gave a ___ answer.|savage,cruel|brutally,brutality
  savage|fierce and violent; uncivilized|野蛮的|A ___ dog bit him.|The book got a ___ review.|They made a ___ attack.|vicious,brutal|savagely
  vicious|deliberately cruel or violent; dangerous|恶毒的；凶残的|A ___ rumor spread.|The ___ dog was chained.|He has a ___ temper.|savage,sadistic|viciously
  ferocious|savagely fierce or violent|凶猛的|A ___ lion roared.|The wind was ___.|They fought a ___ battle.|vicious,merciless|ferociously,ferocity
  heartless|showing no pity or kindness|无情的|How ___ of you!|He was a ___ boss.|It was a ___ act.|merciless,cruel|
  merciless|showing no mercy|毫不留情的|The sun was ___.|They were ___ to the enemy.|A ___ critic.|heartless,ferocious|mercilessly
  sadistic|getting pleasure from hurting others|虐待狂的|He had a ___ streak.|The guard was ___.|It was a ___ game.|vicious,obnoxious|sadist,sadism
  inflict|to cause something unpleasant to be suffered|施加(痛苦)|Storms can ___ great damage.|Don't ___ pain on others.|They tried to ___ a defeat.|sadistic,savage|inflicted
  obnoxious|extremely unpleasant or rude|讨厌的|He was loud and ___.|An ___ smell filled the room.|Stop being ___.|heartless,sadistic|
  `,
);

const mess = batch(
  "words-of-mess-and-dirt",
  ["Words of Mess and Dirt", "凌乱与肮脏的词"],
  ["untidy people and places, careless work and filth", "不整洁的人和地方、马虎的工作与污秽"],
  `
  messy|untidy or dirty|凌乱的|His room is ___.|Painting is ___ work.|It was a ___ divorce.|untidy,sloppy|messier,messiest
  untidy|not neat or in order|不整洁的|Her desk is ___.|He has ___ hair.|The garden looks ___.|messy,scruffy|
  sloppy|careless and messy; too loose|马虎的；松垮的|That's ___ work.|She wore a ___ sweater.|Don't be ___ with your writing.|messy,grubby|sloppily
  scruffy|shabby and untidy|邋遢的|He looked ___ in old jeans.|A ___ dog came to the door.|The ___ hotel was cheap.|unkempt,untidy|
  unkempt|having an untidy appearance; not cared for|蓬乱的|His hair was ___.|The ___ garden was full of weeds.|He had an ___ beard.|disheveled,scruffy|
  disheveled|untidy in hair or clothes|衣衫不整的|She arrived ___ and late.|His hair was ___.|The ___ man asked for money.|unkempt,grimy|
  grimy|covered with dirt|满是污垢的|The windows were ___.|He wiped his ___ hands.|The ___ streets were dark.|grubby,filthy|grime
  grubby|dirty, especially from neglect|脏兮兮的|Wash your ___ hands.|The kids had ___ faces.|A ___ little café.|grimy,sloppy|
  filthy|disgustingly dirty; obscene|肮脏的；下流的|The floor was ___.|Don't use ___ words.|His clothes were ___.|sordid,grimy|filth
  sordid|involving immoral actions; dirty|卑鄙的；肮脏的|It was a ___ affair.|They lived in ___ rooms.|The ___ details came out.|filthy,disheveled|
  `,
);

const cleaning = batch(
  "words-of-cleaning-and-order",
  ["Words of Cleaning and Order", "清洁与整齐的词"],
  ["being neat and spotless and the jobs that make it so", "整洁一尘不染以及做到这点的活儿"],
  `
  tidy|neat and in order; to make so|整洁的；整理|Keep your room ___.|___ up the kitchen.|She has ___ handwriting.|neat,orderly|tidied,tidier,tidiness
  neat|arranged in an orderly way; clever|整齐的；巧妙的|Her notes are ___.|That's a ___ trick.|Keep the desk ___.|tidy,immaculate|neatly,neater
  orderly|neatly arranged; well behaved|有序的|The kids left in an ___ line.|She has an ___ mind.|An ___ room.|tidy,sanitary|
  spotless|perfectly clean|一尘不染的|The kitchen was ___.|He has a ___ record.|Keep the floor ___.|immaculate,neat|
  immaculate|perfectly clean, neat or tidy; free from flaws|整洁无瑕的|Her uniform was ___.|He gave an ___ display.|The house was ___.|spotless,hygienic|immaculately
  hygienic|clean and likely to keep away disease|卫生的|The kitchen must be ___.|It is not ___ to share cups.|Use ___ methods.|sanitary,spotless|
  sanitary|relating to health and cleanliness; clean|卫生的|Poor ___ conditions spread disease.|The camp was not ___.|___ workers collect trash.|hygienic,orderly|
  wipe|to clean or dry by rubbing|擦|___ your feet on the mat.|She had to ___ the table.|___ the tears from your eyes.|scrub,rinse|wiped
  rinse|to wash with clean water to remove soap or dirt|冲洗|___ the cup after use.|___ your mouth with water.|Give it a ___.|wipe,scrub|rinsed
  scrub|to rub hard to clean|擦洗|___ the floor with a brush.|She had to ___ the pots.|Give your hands a good ___.|rinse,wipe|scrubbed
  `,
);

const wealth = batch(
  "words-of-rich-and-poor",
  ["Words of Rich and Poor", "贫富的词"],
  ["having money, making money, saving it and spending a lot", "有钱、赚钱、省钱与大手大脚"],
  `
  wealthy|having a great deal of money|富有的|She married a ___ man.|The ___ pay more tax.|It is a ___ town.|prosperous,lucrative|wealthier
  prosperous|successful in material terms; thriving|繁荣的|It was a ___ year.|The ___ town grew.|We wish you a ___ new year.|wealthy,profitable|
  profitable|yielding profit|有利可图的|The shop is ___.|It was a ___ deal.|Farming is no longer ___.|lucrative,affordable|profitably
  lucrative|producing a great deal of profit|赚钱的|She has a ___ job.|Oil is a ___ trade.|The ___ market drew investors.|profitable,costly|
  thrifty|careful with money|节俭的|My ___ aunt saves everything.|Be ___ with your pocket money.|A ___ family wastes little.|broke,extravagant|thrift
  extravagant|spending too much; excessive|奢侈的|He had ___ tastes.|It was an ___ party.|Don't be ___.|thrifty,pricey|extravagance
  pricey|expensive|昂贵的|That shop is ___.|The ___ meal was good.|Tickets are ___.|costly,affordable|pricier
  costly|costing a lot; causing loss|昂贵的；代价大的|It was a ___ mistake.|Repairs are ___.|The war was ___.|pricey,lucrative|costlier
  affordable|inexpensive; reasonably priced|买得起的|We need ___ homes.|The car is ___.|Make it ___.|pricey,broke|
  broke|having no money|身无分文的|I'm ___ until payday.|The firm went ___.|Students are often ___.|thrifty,wealthy|
  `,
);

const pay = batch(
  "words-of-pay-and-bills",
  ["Words of Pay and Bills", "薪酬与账单的词"],
  ["money earned, money owed, money back and money off", "挣的钱、欠的钱、退款与优惠"],
  `
  wage|money paid for work, usually by the hour or week|工资|The ___ is ten dollars an hour.|Workers want a fair ___.|The minimum ___ rose.|salary,earnings|
  salary|a fixed regular payment, usually monthly|薪水|Her ___ is good.|He got a ___ rise.|The job pays a ___ of 50,000.|wage,bonus|salaries
  earnings|money earned|收入|His ___ rose this year.|She saved her ___.|The firm's ___ fell.|wage,pension|
  bonus|an extra sum of money; an extra benefit|奖金；额外好处|Staff got a Christmas ___.|The view is a ___.|She earned a ___.|salary,voucher|bonuses
  pension|regular money paid to a retired person|养老金|He lives on his ___.|Pay into a ___.|The state ___ is small.|earnings,installment|pensions,pensioner
  fee|a payment for a service|费用|The entry ___ is five dollars.|Lawyers charge a ___.|The school ___ is high.|invoice,refund|fees
  invoice|a list of goods sent or work done, with the amount due|发票|Send me an ___.|The ___ is due in 30 days.|Pay the ___.|fee,refund|invoices,invoiced
  refund|money paid back; to pay back|退款|Can I get a ___?|They will ___ your money.|Keep your receipt for a ___.|invoice,voucher|refunded,refundable
  voucher|a printed piece of paper worth a certain amount of money off|代金券|Use this ___ for a free meal.|She won a travel ___.|The ___ ends in May.|refund,bonus|vouchers
  installment|one of several payments over time; one part of a series|分期付款；一集|We paid the next ___ today.|The last ___ of the series aired.|We paid the first ___.|pension,fee|installments
  `,
);

const sources = batch(
  "academic-words-of-sources-and-steps",
  ["Academic Words of Sources and Steps", "来源与步骤的学术词"],
  ["choosing, recording, places, continuing and depending", "选择、登记、地点、持续与依赖"],
  `
  select|to choose carefully from a group|挑选|___ one answer.|Please ___ a seat.|They ___ players for the team.|register,input|selected,selective
  register|an official list; to put on a list; to show|登记册；登记；显示|___ to vote.|Sign the ___.|Her face did not ___ surprise.|select,trace|registered,registration
  input|what is put into a system; to put in|输入；投入|We need your ___.|___ the data.|Ideas came from staff ___.|emit,select|inputs
  emit|to send out light, heat, sound or gas|发出|Cars ___ gases.|The radio may ___ a beep.|The sun can ___ light.|input,offset|emitted
  offset|to counteract something by having an opposite effect|抵消|Gains may ___ losses.|Plant trees to ___ carbon.|Higher prices ___ the cost.|emit,rely|
  trace|a mark or sign left behind; to find by searching|痕迹；追查|There was no ___ of him.|Police tried to ___ the call.|___ the map onto paper.|register,site|traced,traces
  site|a place where something is or happens|地点；网站|This is the ___ of the battle.|They visited the building ___.|Check the web ___.|trace,ongoing|sites
  ongoing|continuing; still in progress|进行中的|The talks are ___.|It is an ___ problem.|The ___ study ends soon.|site,reluctance|
  rely|to depend on with full trust|依赖|You can ___ on me.|Many ___ on cars.|Don't ___ on luck.|offset,reluctance|relied,reliance
  reluctance|unwillingness to do something|不情愿|She showed ___ to leave.|With ___, he agreed.|Their ___ was clear.|rely,ongoing|reluctantly
  `,
);

/** batchesG are the batches of fights, schemes, cruelty, mess, cleaning, rich and poor, pay and sources. */
export const batchesG: readonly BatchSpec[] = [fights, schemes, cruelty, mess, cleaning, wealth, pay, sources];
