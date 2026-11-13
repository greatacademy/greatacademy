// Grade 10: the batches of words of hard effort, of gathering and throwing away, of skill and showing off, of
// copying and zest, of grief, of moaning and mumbling, of chatter and of rules.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const effort = batch(
  "words-of-hard-effort",
  ["Words of Hard Effort", "艰苦努力的词"],
  ["working hard, trying, pulling and lifting heavy things", "辛勤工作、尽力、拖拉与举起重物"],
  `
  strive|to make great efforts to achieve something|努力|We ___ to do our best.|She would ___ for perfection.|Many ___ to be free.|haul,lug|strove,striven,striving
  endeavor|an attempt to achieve a goal; to try hard|努力；尽力|We will ___ to help.|It was a bold ___.|Every ___ failed.|lug,grapple|endeavored,endeavors
  toil|to work extremely hard; exhausting work|辛劳|Farmers ___ in the fields.|Years of ___ paid off.|They ___ all day.|lug,exert|toiled
  labor|work, especially hard physical work; to work hard|劳动；苦干|Manual ___ is tiring.|They ___ in the mines.|The cost of ___ is rising.|exert,lug|labored,laborious
  slog|to work hard over a period; a long tiring walk or task|苦干；艰难跋涉|It was a long ___ up the hill.|Students ___ through exams.|We had to ___ through the mud.|exert,grapple|slogged
  exert|to apply force or influence; to make a great effort|施加；努力|Don't ___ yourself.|She tried to ___ pressure on him.|The moon can ___ a pull on the sea.|grapple,endeavor|exerted,exertion
  grapple|to struggle physically; to work hard to deal with a problem|扭打；努力解决|Police had to ___ with the thief.|We ___ with hard questions.|The nation must ___ with debt.|exert,heave|grappled
  haul|to pull or drag with effort; an amount gained|拖运；收获|They had to ___ the boat ashore.|Thieves made off with a big ___.|Trucks ___ goods.|exert,strive|hauled
  lug|to carry or drag with great effort|费力地拖|I had to ___ my bags upstairs.|Don't ___ that heavy box.|She would ___ her books to school.|strive,endeavor|lugged
  heave|to lift or pull with great effort; to rise and fall|举起；起伏|We had to ___ the sofa into the van.|Her chest began to ___.|___ on the rope!|strive,toil|heaved
  `,
);

const gathering = batch(
  "words-of-gathering-and-discarding",
  ["Words of Gathering and Discarding", "收集与丢弃的词"],
  ["collecting, storing, piling up and throwing away", "收集、储存、堆积与扔掉"],
  `
  amass|to gather a large amount over time|积累|He managed to ___ a fortune.|They ___ evidence.|She began to ___ stamps.|forage,scavenge|amassed
  stockpile|a large stock of goods kept for future use; to build one|储备|They kept a ___ of food.|Nations ___ weapons.|We had to ___ fuel.|forage,discard|stockpiled
  stash|to store safely in a hidden place; a secret store|藏匿；秘藏|She chose to ___ the money under the bed.|They found his ___ of sweets.|Don't ___ food in your room.|forage,scavenge|stashed
  glean|to gather information or material bit by bit|搜集|We ___ facts from many sources.|Little can be ___ from it.|Try to ___ what you can.|dump,pile|gleaned
  forage|to search widely for food|觅食|Deer ___ in the woods.|Pigs ___ for roots.|They had to ___ for supplies.|heap,pile|foraged
  scavenge|to search for and collect anything usable from waste|捡破烂，觅食腐肉|Gulls ___ at the dump.|Children ___ for scraps.|Foxes ___ in the bins.|heap,stash|scavenged
  heap|an untidy pile; to pile up|堆|Clothes lay in a ___.|___ the plates with food.|There is a ___ of work to do.|forage,glean|heaped,heaps
  pile|a neat stack of things; to place things one on another|摞；堆放|A ___ of books sat on the desk.|___ the boxes in the corner.|She has a ___ of homework.|forage,glean|piled,piles
  discard|to get rid of as no longer useful|丢弃|___ any old food.|She chose to ___ the letter.|Don't ___ the receipt.|forage,glean|discarded
  dump|to drop or throw away carelessly; a place for rubbish|倾倒；垃圾场|Don't ___ rubbish in the river.|They took the junk to the ___.|She would ___ her bag on the floor.|forage,glean|dumped,dumping
  `,
);

const skill = batch(
  "words-of-skill-and-showing-off",
  ["Words of Skill and Showing Off", "才能与炫耀的词"],
  ["talent, quick bodies and boasting about them", "天赋、敏捷与吹嘘"],
  `
  gifted|having exceptional talent|有天赋的|She is a ___ singer.|The school is for ___ children.|He is ___ in math.|flaunt,boast|
  knack|an acquired or natural skill at doing something|诀窍|She has a ___ for languages.|There's a ___ to it.|He had the ___ of making friends.|prowess,gifted|
  prowess|skill or expertise in a particular activity|高超技艺|His ___ at chess is famous.|She showed great ___.|Their military ___ was feared.|knack,flaunt|
  versatile|able to adapt to many different functions|多才多艺的；多功能的|She is a ___ actress.|Eggs are ___.|A ___ tool is useful.|flaunt,boast|versatility
  agile|able to move quickly and easily|敏捷的|Cats are ___.|An ___ mind solves problems.|The ___ player dodged.|boast,flaunt|
  nimble|quick and light in movement; quick to understand|灵巧的|Her ___ fingers flew over the keys.|He has a ___ mind.|Goats are ___ climbers.|boast,flaunt|nimbly
  boast|to talk with too much pride about oneself|自夸|He likes to ___ about his car.|Don't ___.|The town can ___ a fine park.|prowess,knack|boasted
  flaunt|to display something ostentatiously|炫耀|She liked to ___ her wealth.|Don't ___ your grades.|They ___ their new phones.|knack,gifted|flaunted
  showoff|a person who acts to attract attention|爱炫耀的人|Don't be such a ___.|He's a real ___ on the court.|Nobody likes a ___.|boast,flamboyant|
  flamboyant|tending to attract attention by confidence and stylishness|艳丽的；张扬的|He wore a ___ suit.|She is a ___ dancer.|His ___ style drew crowds.|showoff,nimble|flamboyance
  `,
);

const copying = batch(
  "words-of-copying-and-zest",
  ["Words of Copying and Zest", "模仿与热情的词"],
  ["imitating others and doing things with energy", "模仿他人与充满活力地做事"],
  `
  mimic|to imitate someone, often to make fun of them|模仿|He likes to ___ the teacher.|Parrots ___ human speech.|Some insects ___ leaves.|zest,gusto|mimicked,mimicry
  impersonate|to pretend to be another person|假冒|It is a crime to ___ a police officer.|He can ___ the president.|She tried to ___ her sister on the phone.|zest,verve|impersonated,impersonation
  parrot|a bright tropical bird; to repeat without understanding|鹦鹉；鹦鹉学舌|The ___ can say hello.|Don't just ___ what the book says.|Students ___ the answers.|zest,vigor|parrots
  copycat|a person who copies another|模仿者|Don't be a ___.|Police feared a ___ crime.|My little brother is a ___.|zest,gusto|copycats
  zest|great enthusiasm and energy; the outer skin of citrus|热情；柑橘皮|She has a ___ for life.|Add the ___ of a lemon.|He ate with ___.|mimic,parrot|
  gusto|enjoyment and vigor in doing something|兴致勃勃|They sang with ___.|He ate with great ___.|She told the story with ___.|mimic,copycat|
  verve|vigor and spirit or enthusiasm|活力，神韵|The band played with ___.|Her painting has ___.|He spoke with ___.|mimic,impersonate|
  vigor|physical strength and good health; effort and energy|活力|He was full of ___.|They worked with ___.|She ran with youthful ___.|parrot,mimic|vigorous,vigorously
  eagerness|strong desire to do or have something|渴望|Her ___ to learn was clear.|In his ___ he fell.|They showed great ___.|copycat,mimic|
  enthusiasm|intense and eager enjoyment or interest|热情|She has ___ for music.|The plan met with ___.|His ___ was catching.|copycat,impersonate|enthusiastic,enthusiast
  `,
);

const grief = batch(
  "words-of-grief-and-comfort",
  ["Words of Grief and Comfort", "悲伤与安慰的词"],
  ["deep pain, sadness, crying and comforting", "深切的痛苦、悲伤、哭泣与安慰"],
  `
  anguish|severe mental or physical pain|极度痛苦|She cried out in ___.|He felt ___ at the loss.|Their ___ was clear.|weep,console|anguished
  agony|extreme physical or mental suffering|剧痛|He was in ___ with his leg.|The wait was ___.|She screamed in ___.|weep,console|agonizing
  torment|severe suffering; to cause it|折磨|The pain was a ___.|Bullies ___ him daily.|She lived in ___.|console,sob|tormented,tormentor
  distress|extreme anxiety, sorrow or pain; to cause it|苦恼；使痛苦|The news caused ___.|The ship sent a ___ call.|Don't ___ yourself.|weep,sob|distressed,distressing
  sorrow|a feeling of deep sadness|悲伤|She felt ___ at his death.|They shared their ___.|To my ___, he left.|weep,console|sorrowful,sorrows
  woe|great sorrow; troubles|悲哀；困难|Tales of ___ filled the book.|Money ___ plagued them.|___ is me!|console,sob|woes,woeful
  heartache|emotional anguish or grief|心痛|The breakup caused much ___.|She suffered years of ___.|Love can bring ___.|weep,console|
  weep|to shed tears|哭泣|She began to ___ at the news.|Don't ___ for me.|He would ___ in private.|console,anguish|wept,weeping
  sob|to cry noisily with gasps|啜泣|The child began to ___.|I heard a ___ from the room.|She would ___ into her pillow.|console,woe|sobbed
  console|to comfort someone at a time of grief|安慰|Friends tried to ___ her.|Nothing could ___ him.|She managed to ___ the child.|weep,distress|consoled,consolation
  `,
);

const noises = batch(
  "words-of-moaning-and-mumbling",
  ["Words of Moaning and Mumbling", "呻吟与嘟囔的词"],
  ["sounds of pain and complaint, and unclear speech", "痛苦与抱怨的声音以及含糊的话"],
  `
  moan|a long low sound of pain; to complain|呻吟；抱怨|He let out a ___ of pain.|Listen to the wind ___ in the trees.|They ___ about the weather.|stammer,holler|moaned
  groan|a deep sound of pain or despair; to make one|呻吟|The class let out a ___.|The old floor began to ___.|He would ___ when he stood.|stammer,mutter|groaned
  whine|a high complaining cry; to complain in a childish way|哀鸣；发牢骚|The dog began to ___.|Don't ___ about homework.|We heard the ___ of an engine.|stammer,mumble|whined,whiny
  howl|a long loud cry, as of a dog or wolf; to make one|嚎叫|Wolves ___ at the moon.|The wind began to ___.|A ___ of laughter came from the room.|mumble,stammer|howled
  yell|to shout loudly; a loud cry|大喊|Don't ___ at me.|She gave a ___ of joy.|He had to ___ to be heard.|mumble,stammer|yelled
  holler|to shout or call loudly|喊叫|___ if you need me.|Kids ___ in the park.|She gave a ___ from the porch.|mumble,stammer|hollered
  grunt|a low short sound like that of a pig; to make one|咕哝|He gave a ___ of agreement.|Pigs ___ in the mud.|She would ___ as she lifted the box.|howl,stammer|grunted
  mutter|to say something in a low voice, often in complaint|嘀咕|He began to ___ under his breath.|I heard her ___ something.|They ___ about the rules.|howl,holler|muttered
  mumble|to say something indistinctly|含糊地说|Don't ___; speak up.|He tends to ___ his answers.|She gave a ___ of thanks.|howl,yell|mumbled
  stammer|to speak with sudden pauses and repeated sounds; this habit|结巴|Fear made him ___: "I-I-I don't know."|She tried to ___ an excuse.|He has a slight ___.|howl,holler|stammered
  `,
);

const chatter = batch(
  "words-of-chatter-and-gossip",
  ["Words of Chatter and Gossip", "闲聊与八卦的词"],
  ["light talk, idle talk, quick replies and angry speeches", "轻松谈话、闲扯、机智回答与激烈言辞"],
  `
  chatter|to talk rapidly about unimportant matters|喋喋不休|The kids ___ all the way home.|Stop the ___.|Birds ___ in the trees.|quip,retort|chattered
  prattle|to talk at length in a foolish way|胡扯|He likes to ___ about nothing.|I'm tired of his ___.|They ___ on for hours.|quip,retort|prattled
  babble|to talk rapidly in a confused way; the sound of a stream|含糊不清地说；潺潺声|Babies ___ before they talk.|We heard the ___ of a brook.|Don't ___; slow down.|quip,banter|babbled
  jabber|to talk rapidly in a way hard to understand|急促不清地说|Tourists ___ in many languages.|Stop your ___.|They ___ on their phones.|quip,banter|jabbered
  gossip|casual talk about other people's private lives; to engage in it|闲话；说长道短|Don't listen to ___.|They like to ___ about the neighbors.|She is a terrible ___.|quip,retort|gossiped,gossips
  blab|to reveal secrets by careless talk|泄密|Don't ___ to the teacher.|He may ___ the news.|Someone chose to ___.|banter,quip|blabbed
  banter|playful teasing talk|打趣|They traded friendly ___.|The ___ in the office was fun.|We enjoyed his ___.|rant,blab|
  quip|a witty remark; to make one|俏皮话|He made a clever ___.|"Nice hat," she was quick to ___.|His ___ made us laugh.|babble,jabber|quipped,quips
  retort|to answer sharply or wittily; such an answer|反驳|She was quick to ___.|He gave an angry ___.|"Not likely," he would ___.|babble,jabber|retorted
  rant|to speak at length in an angry way; such a speech|大声斥责|He began to ___ about taxes.|We heard a long ___.|Don't ___ at me.|babble,quip|ranted
  `,
);

const rules = batch(
  "words-of-rules-and-orders",
  ["Words of Rules and Orders", "规则与命令的词"],
  ["keeping or breaking rules, calling people and letting them off", "遵守或违反规则、召唤与免除"],
  `
  adhere|to stick fast; to follow a rule or belief closely|黏附；遵守|Please ___ to the rules.|The label will not ___.|We ___ to our plan.|abide,heed|adhered,adherence,adherent
  abide|to accept or act in agreement with; to tolerate|遵守；忍受|You must ___ by the law.|I can't ___ rudeness.|They agreed to ___ by the vote.|adhere,obedient|abided
  heed|to pay attention to; careful attention|留心|___ my warning.|They took no ___ of the danger.|Few chose to ___ the advice.|adhere,summon|heeded
  obedient|willing to do what one is told|顺从的|The dog is very ___.|She was an ___ child.|___ soldiers follow orders.|abide,truant|obediently
  forbid|to refuse to allow|禁止|I ___ you to go.|The rules ___ phones in class.|Her parents ___ the trip.|waive,breach|forbade,forbidden
  breach|an act of breaking a rule or agreement; a gap made in a wall; to break|违反；缺口|That is a ___ of contract.|The army made a ___ in the wall.|Water may ___ the dam.|forbid,waive|breached
  waive|to choose not to insist on a right or rule|放弃，免除|The school will ___ the fee.|She chose to ___ her right to a lawyer.|They ___ the rules for him.|forbid,allowance|waived,waiver
  allowance|money given regularly; the amount allowed|零用钱；限额|She gets a weekly ___.|The baggage ___ is 20 kilos.|Make ___ for delays.|waive,summon|allowances
  summon|to order someone to come; to gather one's strength|召唤；鼓起|The king chose to ___ his knights.|She tried to ___ her courage.|They ___ a doctor.|heed,obedient|summoned,summons
  truant|a pupil who stays away from school without leave|旷课者|The ___ was caught at the mall.|He played ___ often.|Police brought back the ___.|obedient,breach|truancy,truants
  `,
);

/** batchesE are the batches of effort, gathering, skill, copying, grief, noises, chatter and rules. */
export const batchesE: readonly BatchSpec[] = [effort, gathering, skill, copying, grief, noises, chatter, rules];
