// Grade 10: the batches of words of fear and wonder, of shame and blame, of pity and mercy, of anger and
// bluntness, of raids and rumors, of slips and scrambles, of spectacle and splendor and of daring and promises.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const fear = batch(
  "words-of-fear-and-wonder",
  ["Words of Fear and Wonder", "恐惧与惊奇的词"],
  ["being scared, shocked, amazed and overcome", "害怕、震惊、惊叹与不知所措"],
  `
  frighten|to make someone afraid|使害怕|Don't ___ the baby.|Loud noises ___ the dog.|The film may ___ young kids.|marvel,gasp|frightening
  horrify|to fill with horror; to shock greatly|使恐惧，使震惊|The news will ___ you.|Pictures of war ___ us.|Her rudeness seemed to ___ him.|marvel,gasp|horrified,horrifying
  terror|extreme fear|恐惧|She screamed in ___.|They lived in ___.|The ___ of the storm kept us awake.|horrify,shiver|terrify,terrified,terrible
  astonish|to surprise greatly|使惊讶|Her skill will ___ you.|The result seemed to ___ everyone.|It may ___ you to learn this.|marvel,shiver|astonished,astonishment
  marvel|to be filled with wonder; a wonderful thing|惊叹；奇迹|We ___ at the view.|The bridge is a ___.|They ___ at her skill.|astonish,paralyze|marveled,marvelous
  gasp|to breathe in suddenly in shock; such a breath|倒吸气|The crowd began to ___.|She gave a ___ of surprise.|He came up to ___ for air.|paralyze,overwhelm|gasped
  shiver|to shake slightly from cold or fear|颤抖|Children began to ___ in the cold.|A ___ ran down my spine.|She would ___ at the thought.|paralyze,overwhelm|shivered,shivery
  faint|to lose consciousness briefly; not clear or strong|昏倒；微弱的|He may ___ in the heat.|There was a ___ smell.|She felt ___.|shiver,paralyze|fainted,faintly
  paralyze|to make unable to move|使瘫痪|Fear may ___ you.|A strike could ___ the city.|The snake's bite can ___ its prey.|faint,marvel|paralyzed,paralysis
  overwhelm|to have a strong emotional effect on; to defeat completely|使不知所措；压倒|The work may ___ her.|The army tried to ___ the town.|Grief can ___ anyone.|faint,marvel|overwhelmed,overwhelming
  `,
);

const shame = batch(
  "words-of-shame-and-blame",
  ["Words of Shame and Blame", "羞愧与责备的词"],
  ["feeling bad, saying sorry, praise, insults and telling off", "愧疚、道歉、恭维、侮辱与训斥"],
  `
  embarrass|to make someone feel awkward or ashamed|使尴尬|Don't ___ me in front of my friends.|His jokes ___ her.|It may ___ the government.|blush,modest|embarrassing,embarrassment
  blush|to become red in the face from shyness or shame|脸红|She began to ___ when he smiled.|Don't make me ___.|A ___ spread over his face.|embarrass,modest|blushed
  guilt|the feeling of having done wrong; the fact of having done wrong|内疚；有罪|She felt ___ for lying.|The jury found no proof of ___.|___ kept him awake.|confess,apologize|
  confess|to admit a wrongdoing|坦白|He chose to ___ to the crime.|I must ___ I was wrong.|She would ___ her fears.|apologize,guilt|confessed,confession
  apologize|to say sorry|道歉|You should ___ to her.|He refused to ___.|I ___ for being late.|flatter,modest|apologized,apology
  modest|not boastful; not large|谦虚的；适度的|She is ___ about her success.|They live in a ___ house.|He got a ___ pay rise.|blush,flatter|modestly,modesty
  flatter|to praise too much in order to please|奉承|Don't try to ___ me.|The photo may ___ you.|He likes to ___ his boss.|modest,blush|flattered,flattery
  tease|to make fun of playfully or unkindly|取笑|Don't ___ your sister.|They ___ him about his hat.|It was just a ___.|modest,guilt|teased,teasing
  insult|to speak to or treat with disrespect; such a remark|侮辱|Don't ___ my mother.|It was a terrible ___.|He took it as an ___.|modest,guilt|insulted,insulting
  scold|to angrily tell someone off|责骂|Mom began to ___ me for being late.|Don't ___ the child.|The teacher would ___ us.|modest,blush|scolded
  `,
);

const pity = batch(
  "words-of-pity-and-mercy",
  ["Words of Pity and Mercy", "怜悯与宽恕的词"],
  ["feeling for others, sadness, begging and being poor", "同情他人、悲伤、恳求与贫穷"],
  `
  pity|sorrow for the suffering of others; to feel this|怜悯|I ___ the poor man who lost his home.|She felt ___ for the dog.|What a ___!|tolerate,deserve|pitied,pitiful
  sympathy|feelings of pity and sorrow for someone's misfortune|同情|We send our ___.|She had no ___ for him.|I have ___ with your view.|grateful,deserve|sympathize
  mercy|kindness shown to someone one could punish|宽恕|The judge showed ___.|They begged for ___.|He was at the ___ of the storm.|tolerate,grateful|merciful
  grateful|feeling thanks|感激的|I'm ___ for your help.|She was ___ to be alive.|We are ___ to you.|sympathy,deserve|gratefully
  deserve|to be worthy of|应得|You ___ a rest.|She did not ___ that.|They ___ to win.|tolerate,plead|deserved,deserving
  plead|to beg; to state in court whether one is guilty|恳求；申辩|I ___ with you to stop.|He will ___ guilty.|She began to ___ for her life.|deserve,mourn|pleaded,plea
  mourn|to feel or show deep sorrow after a death|哀悼|We ___ our grandfather.|The nation will ___ its leader.|They ___ the loss of the forest.|misery,plead|mourned,mourning,mourner
  misery|great suffering of mind or body|痛苦|The war caused great ___.|They lived a life of ___.|He lived in ___.|mourn,plead|
  poverty|the state of being very poor|贫穷|Many live in ___.|They fought ___.|___ leads to crime.|mourn,mercy|
  tolerate|to allow something one dislikes; to endure|容忍|I won't ___ lying.|Some plants ___ cold.|She can't ___ the noise.|deserve,grateful|tolerated,tolerant
  `,
);

const anger = batch(
  "words-of-anger-and-bluntness",
  ["Words of Anger and Bluntness", "愤怒与直率的词"],
  ["fury, stirring it up, facing people, complaining and plain speech", "暴怒、挑起、对质、抱怨与直言"],
  `
  rage|violent anger; to be violently angry|狂怒；肆虐|He flew into a ___.|The storm continued to ___.|She shook with ___.|outrage,disgust|raged,raging
  outrage|extreme anger at something unjust; to cause it|愤慨；激怒|The decision caused ___.|It is an ___!|The plan will ___ voters.|rage,provoke|outraged,outrageous
  provoke|to stir up anger or a reaction|激怒；引起|Don't ___ the dog.|The film may ___ debate.|He tried to ___ a fight.|confront,outrage|provoked,provocative,provocation
  confront|to face someone in a challenging way; to deal with a problem|对质；面对|She chose to ___ the bully.|We must ___ our fears.|Police had to ___ the gang.|provoke,aggressive|confronted
  aggressive|ready to attack; forceful|好斗的；积极进取的|The dog is ___.|She is an ___ player.|They used ___ sales tactics.|abrupt,confront|aggressively,aggression
  grumble|to complain in a bad-tempered way|发牢骚|They ___ about the food.|Don't ___; just help.|My stomach began to ___.|nuisance,frank|grumbled
  nuisance|a person or thing causing annoyance|讨厌的人或事|The flies are a ___.|Don't be a ___.|The noise is a ___.|grumble,disgust|nuisances
  disgust|a strong feeling of dislike; to cause it|厌恶；使厌恶|She looked at the mess in ___.|His cruelty will ___ you.|The smell may ___ you.|rage,nuisance|disgusted,disgusting
  abrupt|sudden and unexpected; rudely brief|突然的；唐突的|The car came to an ___ stop.|He was ___ with me and hung up.|The film had an ___ end.|frank,aggressive|abruptly
  frank|open, honest and direct in speech|坦率的|Let me be ___.|We had a ___ talk.|She gave a ___ answer.|nuisance,grumble|frankly
  `,
);

const raids = batch(
  "words-of-raids-and-rumors",
  ["Words of Raids and Rumors", "突袭与谣言的词"],
  ["attacks, taking people and things, running away and spreading secrets", "袭击、劫掠、逃跑与散布秘密"],
  `
  raid|a sudden attack; to attack suddenly|突袭|Police made a ___ on the house.|Vikings would ___ the coast.|The kids began to ___ the fridge.|ambush,kidnap|raided,raider
  ambush|a surprise attack from a hidden place; to attack this way|伏击|Rebels set an ___.|They tried to ___ the convoy.|The troops fell into an ___.|snatch,flee|ambushed
  kidnap|to take someone away illegally by force|绑架|Gangs ___ rich people.|They tried to ___ the boy.|The ___ shocked the town.|leak,flee|kidnapped,kidnapper
  snatch|to grab quickly; a short part|抢夺；片段|A thief tried to ___ her bag.|I heard a ___ of song.|Don't ___ toys from others.|flee,kidnap|snatched
  flee|to run away from danger|逃离|They had to ___ the city.|Many ___ the war.|The thief tried to ___.|snatch,raid|fled,fleeing
  bribe|money or a gift given to persuade someone to act dishonestly; to give one|贿赂|He tried to ___ the judge.|She refused the ___.|Don't take a ___.|poison,leak|bribed,bribery
  poison|a substance that causes illness or death; to give it|毒药；毒害|Keep ___ away from kids.|Don't ___ the river.|Hate may ___ the mind.|torture,bribe|poisoned,poisonous
  torture|severe pain inflicted as a punishment or to force someone to speak; to inflict it|酷刑；折磨|___ is banned by law.|The wait was ___.|They tried to ___ the prisoner.|poison,ambush|tortured
  leak|a hole letting liquid or gas escape; to reveal secret information|漏洞；泄露|There's a ___ in the roof.|Someone chose to ___ the plan.|Gas may ___ from the pipe.|rumor,bribe|leaked,leakage,leaky
  rumor|a story passed around that may not be true|谣言|Don't spread a ___.|The ___ proved false.|A ___ went round school.|leak,snatch|rumors,rumored
  `,
);

const slips = batch(
  "words-of-slips-and-scrambles",
  ["Words of Slips and Scrambles", "滑倒与攀爬的词"],
  ["falling, climbing, squeezing, spilling, breaking and rushing", "跌倒、攀爬、挤压、洒出、打碎与匆忙"],
  `
  stumble|to trip and nearly fall; to make a mistake|绊倒；结巴|Don't ___ on the stairs.|She began to ___ over her words.|We may ___ upon a clue.|soar,haste|stumbled
  tumble|to fall suddenly and helplessly; to drop fast|跌倒；暴跌|He took a ___ down the stairs.|Prices began to ___, falling fast.|Rocks began to ___ down the hill.|stumble,soar|tumbled
  slippery|hard to hold or stand on because smooth or wet|滑的|The road is ___.|A ___ fish fell from his hands.|Watch out; it's ___.|stumble,haste|
  crouch|to bend low with knees bent|蹲伏|___ behind the wall.|The cat began to ___ low.|They had to ___ to get in.|scramble,squeeze|crouched
  scramble|to climb quickly using hands; to move hurriedly; to mix eggs while cooking|攀爬；争抢；炒(蛋)|We had to ___ up the rocks.|People began to ___ for seats.|___ the eggs.|crouch,haste|scrambled
  soar|to fly high; to rise quickly|翱翔；飞涨|Eagles ___ above the hills.|Prices may ___ to new heights.|Her hopes began to ___.|tumble,smash|soared,soaring
  squeeze|to press firmly; to force into a small space|挤压；挤进|___ the lemon.|We can ___ in one more.|She gave his hand a ___.|crouch,spill|squeezed
  spill|to let liquid run over the edge; an amount spilled|洒出|Don't ___ the milk.|There was an oil ___.|Crowds began to ___ into the street.|squeeze,smash|spilled,spilt
  smash|to break violently; a big hit|打碎；轰动|Don't ___ the glass.|The film was a ___.|Waves ___ against the rocks.|spill,soar|smashed,smashing
  haste|excessive speed or urgency|匆忙|In her ___, she forgot her keys.|More ___, less speed.|He left in ___.|scramble,slippery|hasten,hasty,hastily
  `,
);

const splendor = batch(
  "words-of-spectacle-and-splendor",
  ["Words of Spectacle and Splendor", "壮观与辉煌的词"],
  ["shows, beauty, foreign wonders, legends and excitement", "表演、美丽、异域奇观、传说与兴奋"],
  `
  parade|a public procession; to walk in one|游行|We watched the ___.|Soldiers ___ through the streets.|There was a ___ of floats.|spectacle,gesture|paraded
  spectacle|a visually striking show|壮观场面|The fireworks were a ___.|Don't make a ___ of yourself.|It was a fine ___.|parade,miracle|spectacles,spectacular
  splendid|magnificent; very good|壮丽的；极好的|We had a ___ time.|The palace is ___.|What a ___ idea!|myth,miracle|splendidly,splendor
  gorgeous|beautiful; very attractive|极好看的|What a ___ dress.|The view is ___.|It's a ___ day.|glamour,myth|gorgeously
  glamour|attractive and exciting charm|魅力|The ___ of Hollywood draws many.|She added ___ to the party.|The job has little ___.|gorgeous,thrill|glamorous
  exotic|from or like a distant foreign country|异国的|They sell ___ fruits.|She has an ___ pet.|We visited ___ lands.|myth,thrill|
  myth|a traditional story; a false belief|神话；谬论|It's a ___ that bats are blind.|A Greek ___ tells of gods.|The ___ of the hero lives on.|miracle,exotic|myths,mythical,mythology
  miracle|an amazing event that cannot be explained by nature|奇迹|It was a ___ they lived.|She hoped for a ___.|The cure is a ___.|myth,spectacle|miracles,miraculous
  thrill|a sudden feeling of excitement; to excite|激动；使激动|What a ___!|The news will ___ fans.|Riding fast gives me a ___.|glamour,exotic|thrilling,thriller
  gesture|a movement to express an idea; an action showing feeling|手势；姿态|He made a rude ___.|It was a kind ___.|She would ___ to the door.|thrill,parade|gestured,gestures
  `,
);

const daring = batch(
  "words-of-daring-and-promises",
  ["Words of Daring and Promises", "冒险与承诺的词"],
  ["taking risks, temptation, vows, pretending and managing", "冒险、诱惑、誓言、假装与应对"],
  `
  dare|to have the courage to do something; to challenge|敢；激(某人)做|I ___ you to jump.|How ___ you!|Don't ___ to touch it.|venture,tempt|dared
  venture|a risky journey or business; to go somewhere risky|冒险(事业)；冒险前往|It was a new business ___.|Don't ___ out in the storm.|She chose to ___ into the woods.|dare,impulse|ventured
  tempt|to try to persuade someone to do something wrong or unwise|诱惑|Don't ___ me.|The cake may ___ you.|Ads ___ us to buy.|swap,cope|tempted,tempting
  impulse|a sudden urge to act|冲动|I bought it on ___.|She felt an ___ to scream.|He acted on ___.|tempt,pretend|impulses
  pledge|a solemn promise; to promise|誓言；保证|They made a ___ of support.|I ___ to help.|She signed the ___.|burden,cope|pledged
  swear|to make a solemn promise; to use rude words|发誓；咒骂|I ___ it's true.|Don't ___ at the referee.|They ___ to keep the secret.|cope,burden|swore,sworn,swearing
  pretend|to act as if something is true when it is not|假装|Don't ___ you're sick.|Kids ___ to be pirates.|She tried to ___ not to care.|swear,cope|pretended
  swap|to exchange|交换|Let's ___ seats.|They ___ stamps.|It was a fair ___.|pretend,tempt|swapped
  cope|to deal with something difficult|应对|She learned to ___ with stress.|How do you ___?|He can't ___ alone.|burden,venture|coped
  burden|a heavy load; a duty or worry|负担|Debt is a ___.|Don't be a ___ to others.|She carried the ___ alone.|cope,pledge|burdened,burdensome
  `,
);

/** batchesH are the batches of fear, shame, pity, anger, raids, slips, splendor and daring. */
export const batchesH: readonly BatchSpec[] = [fear, shame, pity, anger, raids, slips, splendor, daring];
