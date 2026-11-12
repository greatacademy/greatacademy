// Grade 11: the batches of words of easing and stopping, of sociable and solitary people, of nerve and rudeness, of
// skill, of dullness, of scolding, of harm and trickery, and of care and carelessness.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const easing = batch(
  "words-of-easing-and-stopping",
  ["Words of Easing and Stopping", "缓解与制止的词"],
  ["making troubles smaller or ending them", "让麻烦变小或结束"],
  `
  abate|to become less strong or intense|减弱，减轻|We waited for the storm to ___.|The pain began to ___ after an hour.|His anger did not ___.|allay,curtail|abated
  allay|to make a fear or doubt less|减轻(恐惧、疑虑)|The doctor tried to ___ her fears.|The report should ___ our doubts.|Nothing could ___ his suspicion.|alleviate,dispel|allayed
  alleviate|to make pain or a problem less severe|缓解，减轻|The drug will ___ the pain.|New roads may ___ traffic jams.|Aid will ___ hunger in the region.|allay,rectify|alleviated,alleviation
  quell|to put an end to a rebellion or a feeling, usually by force|镇压；平息|Troops were sent to ___ the riot.|She tried to ___ her nerves.|The coach tried to ___ the rumors.|deter,dissipate|quelled
  dispel|to make a doubt, feeling or belief go away|驱散，消除|The sun will soon ___ the fog.|His words did little to ___ our fears.|The study helped ___ an old myth.|allay,dissipate|dispelled
  dissipate|to disappear or scatter; to waste|消散；浪费|The crowd began to ___.|The mist will ___ by noon.|He would ___ his fortune on cards.|dispel,curtail|dissipated,dissipation
  curtail|to cut short or reduce|削减，缩短|The rain forced us to ___ our trip.|The law aims to ___ smoking.|They had to ___ spending.|abate,facilitate|curtailed
  deter|to discourage someone from doing something|阻止，威慑|High fines ___ people from littering.|Nothing would ___ her from trying.|Cameras ___ thieves.|quell,facilitate|deterred,deterrent
  rectify|to put right; to correct|纠正，矫正|We must ___ the error at once.|The firm promised to ___ the fault.|Can you ___ the situation?|alleviate,deter|rectified
  facilitate|to make an action or process easier|促进，使便利|A good map will ___ the search.|The new software will ___ online sales.|She was hired to ___ the talks.|rectify,curtail|facilitated,facilitator
  `,
);

const sociable = batch(
  "words-of-sociable-and-solitary-people",
  ["Words of Sociable and Solitary People", "合群者与孤僻者的词"],
  ["people who enjoy company and people who avoid it", "喜欢交往的人与回避交往的人"],
  `
  amiable|friendly and pleasant|和蔼可亲的|Our ___ neighbor waved every morning.|He was an ___ host.|They had an ___ chat.|amicable,standoffish|amiably
  amicable|having a spirit of friendliness; without quarrel|友好的，和睦的|They reached an ___ agreement.|The divorce was ___.|Relations between the towns are ___.|amiable,convivial|amicably
  convivial|friendly, lively and enjoyable|欢乐的，好交际的|It was a ___ evening of food and songs.|The ___ host poured more wine.|The pub had a ___ atmosphere.|ebullient,reclusive|
  ebullient|cheerful and full of energy|热情洋溢的|The ___ coach hugged every player.|She was in an ___ mood.|His ___ laugh filled the room.|vivacious,reclusive|ebullience
  vivacious|attractively lively and animated|活泼的|The ___ girl was the life of the party.|She has a ___ personality.|A ___ dancer led the parade.|ebullient,boisterous|vivacity
  boisterous|noisy, energetic and cheerful|喧闹的，活跃的|The ___ boys raced down the hall.|A ___ crowd cheered the band.|The party grew ___ after midnight.|vivacious,standoffish|boisterously
  reclusive|avoiding the company of other people|隐居的，孤独的|The ___ writer never gave interviews.|He became ___ after his wife died.|A ___ billionaire lived on the island.|insular,convivial|recluse
  insular|interested only in one's own small group; isolated|狭隘的；孤立的|The village was ___ and suspicious of strangers.|Their ___ views shocked us.|An ___ team rarely shares ideas.|provincial,amiable|insularity
  provincial|of the regions outside the capital; narrow-minded|外省的；狭隘的|He worked for the ___ government.|Her ___ attitudes annoyed her city cousins.|They ran a ___ newspaper.|insular,standoffish|
  standoffish|distant and cold in manner; unfriendly|冷淡的，不友好的|The new boss seemed ___ at first.|She is ___ with people she doesn't know.|His ___ manner kept people away.|reclusive,amiable|standoffishness
  `,
);

const nerve = batch(
  "words-of-nerve-and-offense",
  ["Words of Nerve and Offense", "胆大妄为与冒犯的词"],
  ["shameless boldness and open wrongs", "厚颜无耻与公然的错误"],
  `
  brazen|bold and without shame|厚颜无耻的|It was a ___ lie.|The thieves made a ___ raid in daylight.|She gave a ___ smile.|blatant,impetuous|brazenly
  effrontery|insolent or shameless boldness|厚颜无耻，放肆|He had the ___ to ask for more money.|Her ___ shocked the committee.|The ___ of the demand was breathtaking.|temerity,impertinent|
  temerity|excessive confidence or boldness; nerve|鲁莽，冒失|Nobody had the ___ to question the boss.|She had the ___ to correct the professor.|What ___ to ask for a raise on your first day!|effrontery,rash|
  impertinent|not showing proper respect; rude|无礼的，冒失的|The child asked an ___ question.|Don't be ___ to your grandmother.|His ___ remarks offended her.|brazen,gratuitous|impertinence
  impetuous|acting quickly without thought or care|冲动的，鲁莽的|An ___ decision cost him his job.|The ___ youth jumped into the river.|Her ___ nature led to trouble.|rash,flagrant|impetuously
  rash|acting without careful thought; a red patch on the skin|轻率的；皮疹|It was ___ to quit without a plan.|Don't make a ___ promise.|The baby had a ___ on her arm.|impetuous,presumptuous|rashly
  blatant|done openly and unashamedly; very obvious|公然的，明目张胆的|It was a ___ attempt to cheat.|The report shows ___ bias.|He told a ___ lie.|flagrant,brazen|blatantly
  flagrant|conspicuously and shockingly wrong|公然的，恶劣的|It was a ___ breach of the rules.|The referee punished the ___ foul.|They showed a ___ disregard for safety.|blatant,presumptuous|flagrantly
  presumptuous|failing to observe the limits of what is proper; too bold|放肆的，冒昧的|It would be ___ to call him by his first name.|Her ___ question annoyed the host.|It was ___ of him to assume he had won.|impertinent,flagrant|presumptuously
  gratuitous|done without good reason; uncalled for|无端的，不必要的|The film had ___ violence.|His ___ insults hurt her.|That was a ___ remark.|presumptuous,impertinent|gratuitously
  `,
);

const skill = batch(
  "words-of-skill-and-clumsiness",
  ["Words of Skill and Clumsiness", "技艺与笨拙的词"],
  ["doing things well and doing them badly", "做得好与做得差"],
  `
  adept|very skilled or proficient|熟练的，内行的|She is ___ at solving puzzles.|He became ___ in three languages.|An ___ cook works quickly.|adroit,inept|
  adroit|clever or skillful in using the hands or mind|灵巧的，机敏的|The ___ lawyer won the case.|She made an ___ move in the game.|His ___ fingers fixed the watch.|deft,rudimentary|adroitly
  deft|neatly skillful and quick|灵巧的，熟练的|With a ___ flick, she tied the knot.|His ___ touch calmed the horse.|The ___ editor cut the story.|adroit,novice|deftly
  dexterity|skill in using one's hands or mind|灵巧，敏捷|Juggling requires great ___.|She showed ___ with the scissors.|His mental ___ impressed the panel.|acumen,novice|dexterous
  acumen|the ability to make good judgments and quick decisions|敏锐，聪明|Her business ___ made her rich.|He lacked political ___.|Investors admire her ___.|erudite,dexterity|
  erudite|having or showing great knowledge from study|博学的|The ___ professor quoted Latin poets.|It is an ___ book.|Her ___ lecture impressed us.|prodigious,inept|erudition
  novice|a person new to an activity|新手|The course is for every ___.|A ___ climber should not go alone.|He is a ___ at chess.|adept,prodigious|novices
  inept|having no skill; clumsy|笨拙的，无能的|The ___ thief dropped the jewels.|They hired an ___ manager.|His ___ apology made things worse.|adept,deft|ineptly,ineptitude
  rudimentary|involving only basic principles; undeveloped|基础的，初步的|He has a ___ knowledge of French.|The hut had ___ furniture.|They used ___ tools.|prodigious,adroit|
  prodigious|remarkably great in size, amount or degree|巨大的，惊人的|She has a ___ memory.|The boy showed ___ talent.|They ate a ___ amount of food.|erudite,rudimentary|prodigiously,prodigy
  `,
);

const dullness = batch(
  "words-of-dull-and-stale-things",
  ["Words of Dull and Stale Things", "乏味与陈腐之物的词"],
  ["the boring, the bland and the worn out", "无聊、平淡与陈旧"],
  `
  banal|so lacking in originality as to be boring|陈腐的，平庸的|The song had ___ lyrics.|He made a ___ remark about the weather.|The plot was ___.|trite,bland|banality
  bland|lacking strong features; without much flavor|平淡的；无味的|The soup was ___ without salt.|He gave a ___ answer.|The hotel had ___ walls.|vapid,soporific|blandly
  hackneyed|used so often that it has lost its effect|陈词滥调的|The speech was full of ___ phrases.|It is a ___ story of love and war.|Avoid ___ images in your poem.|trite,prosaic|
  trite|overused and lacking original thought|陈腐的|"Time heals all wounds" sounds ___.|Her advice was ___.|The film ends with a ___ twist.|hackneyed,mundane|
  prosaic|lacking poetic beauty; ordinary|平凡的，乏味的|The reason was ___: he missed the bus.|Their ___ lives seemed dull to him.|The poem's ___ style disappointed us.|mundane,tedious|
  mundane|lacking interest; of this world|单调的；世俗的|He hated ___ chores like ironing.|Her job was ___.|The ___ details of life bore him.|prosaic,jaded|
  vapid|offering nothing interesting or challenging|乏味的，空洞的|The film's ___ dialogue bored us.|He gave a ___ smile.|The show was ___ and silly.|bland,banal|
  tedious|too long, slow or dull; tiresome|冗长乏味的|Filling in forms is ___.|It was a ___ journey.|The lecture was ___.|soporific,vapid|tediously,tedium
  soporific|tending to cause sleep|催眠的|The ___ hum of the engine made him drowsy.|The speech was ___.|This tea has a ___ effect.|tedious,bland|
  jaded|tired and bored after having too much of something|厌倦的，腻烦的|The ___ critic had seen too many films.|He felt ___ after years of travel.|Nothing could please her ___ taste.|mundane,hackneyed|
  `,
);

const scolding = batch(
  "words-of-scolding-and-scorn",
  ["Words of Scolding and Scorn", "斥责与蔑视的词"],
  ["harsh words and cold rejection", "严厉的言辞与冷漠的排斥"],
  `
  chastise|to scold or punish severely|斥责，惩罚|The coach will ___ the late players.|She would ___ her son for lying.|Critics ___ the minister for his silence.|upbraid,ostracize|chastised
  upbraid|to scold or criticize someone sharply|严厉批评|His mother began to ___ him for his rudeness.|The judge will ___ the lawyer.|Do not ___ her in public.|chastise,repudiate|upbraided
  denounce|to publicly declare to be wrong or evil|谴责，公开指责|Leaders rushed to ___ the attack.|He would ___ his former friends.|The bishop will ___ the new law.|deplore,disdain|denounced,denunciation
  deplore|to feel or express strong disapproval of|强烈反对，谴责|We ___ violence of every kind.|Many ___ the decision to close the library.|Teachers ___ the cuts.|denounce,tirade|deplored,deplorable
  tirade|a long, angry speech of criticism|长篇激烈的指责|He launched into a ___ against the referee.|Her ___ lasted ten minutes.|The ___ ended in tears.|vitriolic,disdain|tirades
  vitriolic|filled with bitter criticism or malice|尖刻的，恶毒的|She wrote a ___ review of the play.|The debate became ___.|His ___ letters upset the staff.|truculent,tirade|
  disdain|the feeling that someone is unworthy of respect; to feel this|鄙视，蔑视|She looked at the mess with ___.|He seemed to ___ ordinary people.|They treated the rules with ___.|repudiate,deplore|disdained,disdainful
  repudiate|to refuse to accept or be associated with|否认；拒绝接受|The party will ___ the extremists.|She chose to ___ the claims.|He would ___ the debt.|denounce,ostracize|repudiated,repudiation
  ostracize|to exclude from a society or group|排斥，放逐|The village chose to ___ the family.|Children often ___ those who are different.|They would ___ anyone who spoke out.|chastise,repudiate|ostracized,ostracism
  truculent|eager to argue or fight; aggressively defiant|好斗的，粗暴的|The ___ teenager refused to apologize.|He gave a ___ reply.|A ___ customer shouted at the staff.|vitriolic,disdain|truculence
  `,
);

const harm = batch(
  "words-of-harm-and-trickery",
  ["Words of Harm and Trickery", "伤害与欺诈的词"],
  ["coaxing, cheating, stirring up and slowly hurting", "哄骗、欺诈、煽动和慢慢伤害"],
  `
  cajole|to persuade by flattery or gentle urging|哄骗，劝诱|She tried to ___ her father into buying a dog.|He managed to ___ them into helping.|Don't try to ___ me.|instigate,foment|cajoled
  chicanery|the use of tricks to deceive|诡计，欺骗|The election was full of ___.|They won the case by legal ___.|He was accused of financial ___.|nefarious,illicit|
  nefarious|wicked or criminal|邪恶的，不法的|The gang had ___ plans.|He was involved in ___ activities.|A ___ plot was uncovered.|unscrupulous,insidious|
  unscrupulous|having no moral principles; not honest or fair|不讲道德的，无耻的|An ___ landlord raised the rent.|___ dealers cheated the tourists.|He was ___ in business.|nefarious,deleterious|unscrupulously
  insidious|proceeding in a gradual, subtle way but with harmful effects|暗中为害的，潜伏的|The disease is ___ and slow.|Rumors had an ___ effect on morale.|It is an ___ form of control.|pernicious,illicit|insidiously
  pernicious|having a harmful effect, especially in a gradual way|有害的|Lies have a ___ effect on trust.|The ___ influence of gambling spread.|It is a ___ myth.|insidious,deleterious|
  deleterious|causing harm or damage|有害的|Smoking has ___ effects on health.|The drought had a ___ impact on crops.|Noise is ___ to sleep.|pernicious,nefarious|
  illicit|forbidden by law, rules or custom|非法的，违禁的|Police seized ___ drugs.|They ran an ___ trade in ivory.|The affair was ___.|nefarious,chicanery|illicitly
  foment|to stir up trouble or violence|煽动，挑起|Agents tried to ___ unrest.|He was accused of trying to ___ a strike.|Rumors can ___ hatred.|instigate,cajole|fomented
  instigate|to bring about or start an action or event|发起，煽动|Who will ___ the inquiry?|They tried to ___ a rebellion.|She would ___ the change.|foment,cajole|instigated,instigator
  `,
);

const care = batch(
  "words-of-care-and-carelessness",
  ["Words of Care and Carelessness", "细心与粗心的词"],
  ["working with great care and working with too little", "非常仔细与不够仔细"],
  `
  fastidious|very attentive to detail; hard to please|一丝不苟的；挑剔的|He is ___ about his clothes.|The ___ cook weighed every gram.|She was too ___ to eat there.|punctilious,lax|fastidiously
  punctilious|showing great attention to detail or correct behavior|拘泥细节的，一丝不苟的|The ___ butler served the tea.|She was ___ about paying debts.|He was ___ in keeping records.|fastidious,perfunctory|punctiliously
  painstaking|done with great care and thoroughness|煞费苦心的，仔细的|The restoration was ___ work.|They made a ___ search of the area.|___ research proved her right.|exhaustive,negligent|painstakingly
  exhaustive|including all elements or aspects; thorough|详尽的，彻底的|The police made an ___ search.|It is an ___ list.|They ran ___ tests.|painstaking,perfunctory|exhaustively
  circumspect|wary and unwilling to take risks|谨慎的，小心的|She was ___ in her remarks to the press.|Investors are ___ now.|Be ___ about whom you trust.|fastidious,inadvertent|circumspection
  negligent|failing to take proper care|疏忽的，玩忽职守的|The ___ driver caused the crash.|The school was found ___.|A ___ guard let him escape.|lax,officious|negligently,negligence
  lax|not strict or careful enough|松懈的，不严格的|Security at the gate was ___.|They have ___ rules on parking.|He was ___ about checking facts.|negligent,punctilious|laxity
  perfunctory|carried out with minimum effort|敷衍的|He gave a ___ nod.|The guard made a ___ check of our bags.|Her ___ apology fooled nobody.|lax,exhaustive|perfunctorily
  inadvertent|not resulting from or achieved through deliberate planning|无意的，疏忽的|It was an ___ mistake.|The leak was ___.|An ___ remark caused offense.|negligent,circumspect|inadvertently
  officious|too eager to tell people what to do; interfering|爱管闲事的，好发号施令的|An ___ guard ordered us to move.|The ___ clerk read every rule aloud.|She found him ___ and rude.|fastidious,negligent|officiously
  `,
);

/** batchesC are the batches of easing, sociable people, nerve, skill, dullness, scolding, harm and care. */
export const batchesC: readonly BatchSpec[] = [easing, sociable, nerve, skill, dullness, scolding, harm, care];
