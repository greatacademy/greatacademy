// Grade 10: the batches of words of puzzling and pondering, of rough handling, of fire and heat, of crowds, of
// blocking and breaking, of urging, of flinching and of strong dislike.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const puzzling = batch(
  "words-of-puzzling-and-pondering",
  ["Words of Puzzling and Pondering", "困惑与思考的词"],
  ["being confused, thinking hard and asking", "困惑、苦思与提问"],
  `
  baffle|to confuse someone completely|使困惑|The riddle will ___ you.|Her silence seemed to ___ him.|The case continues to ___ the police.|garble,ponder|baffling
  bewilder|to cause someone to become perplexed and confused|使迷惑|The new rules ___ many drivers.|The maze is meant to ___ visitors.|Big cities can ___ newcomers.|garble,ponder|bewildering,bewilderment
  perplex|to make someone feel completely puzzled|使困惑|Her strange answer seemed to ___ him.|Such questions ___ even experts.|The problem will ___ you at first.|garble,surmise|perplexing
  fluster|to make someone agitated or confused; a nervous state|使慌乱|Don't let the crowd ___ you.|Questions from the press tend to ___ her.|He arrived in a ___.|dazed,garble|flustered
  dazed|unable to think clearly, especially after a shock or blow|恍惚的，晕眩的|He looked ___ after the fall.|She walked out of the crash ___.|The ___ boxer sat on the floor.|fluster,surmise|
  garble|to mix up words or a message so that it is hard to understand|歪曲，混淆(信息)|Bad lines can ___ a phone call.|Don't ___ the instructions.|He tends to ___ his words when nervous.|dazed,baffle|garbled
  ponder|to think about something carefully|仔细考虑|Take time to ___ your choice.|She sat down to ___ the problem.|He liked to ___ the stars at night.|garble,fluster|pondered
  surmise|to suppose something without having evidence|推测|We can only ___ what happened.|I ___ that she left early.|From his face, I ___ the news was bad.|garble,fluster|surmised
  comprehend|to understand fully|理解|She could not ___ his anger.|It is hard to ___ the size of space.|Read the text slowly to ___ it.|garble,fluster|comprehended,comprehension
  query|a question, especially one addressed to an official; to ask|疑问；询问|If you have a ___, call us.|She chose to ___ the bill.|The clerk answered every ___.|garble,comprehend|queried,queries
  `,
);

const handling = batch(
  "words-of-rough-handling",
  ["Words of Rough Handling", "粗暴动作的词"],
  ["waving, pushing, throwing, searching and twisting", "挥舞、推挤、投掷、翻找与扭曲"],
  `
  brandish|to wave something as a threat or in excitement|挥舞|The robber began to ___ a knife.|Fans ___ their scarves.|She would ___ the letter in his face.|hurl,lunge|brandished
  grope|to search blindly with the hands|摸索|She had to ___ for the light switch.|He began to ___ in the dark for his keys.|They ___ for answers.|douse,scrawl|groped
  jostle|to push against people in a crowd|推挤|Fans began to ___ for a better view.|Don't ___ the old lady.|Shoppers ___ at the sale.|lunge,contort|jostled,jostling
  lunge|a sudden forward movement; to make one|猛冲|The dog made a ___ at the cat.|He had to ___ to catch the ball.|She made a ___ for the door.|jostle,hurl|lunged
  hurl|to throw with great force|猛投|He chose to ___ the stone into the lake.|Protesters began to ___ bottles.|She would ___ insults at him.|brandish,douse|hurled
  rummage|to search untidily through a mass of things|翻找|She began to ___ in her bag for a pen.|They ___ through old boxes.|Don't ___ in my drawers.|douse,contort|rummaged
  scour|to clean by hard rubbing; to search thoroughly|擦洗；搜寻|___ the pan with a brush.|Police will ___ the woods.|She would ___ the papers for jobs.|rummage,scrawl|scoured
  scrawl|to write in a hurried, careless way; such writing|潦草地写；潦草的字迹|He began to ___ his name on the wall.|I can't read your ___.|Don't ___ in your books.|scour,contort|scrawled
  douse|to pour a liquid over; to put out a fire|浇水；熄灭|Firemen had to ___ the flames.|She would ___ the salad with oil.|___ the campfire before you leave.|hurl,grope|doused
  contort|to twist or bend out of normal shape|扭曲|Pain made his face ___.|Acrobats ___ their bodies.|Don't ___ the facts.|jostle,scrawl|contorted,contortion
  `,
);

const heat = batch(
  "words-of-fire-and-heat",
  ["Words of Fire and Heat", "火与热的词"],
  ["lighting, burning, boiling and thirst", "点燃、燃烧、沸腾与口渴"],
  `
  ignite|to catch fire or cause to catch fire; to arouse|点燃；激起|A spark may ___ the gas.|Her speech helped ___ the protest.|The dry grass began to ___.|quench,scald|ignited,ignition
  kindle|to light a fire; to arouse an emotion|点燃；激起|We used twigs to ___ the fire.|The book helped ___ her love of history.|A teacher can ___ curiosity.|quench,parch|kindled
  smolder|to burn slowly with smoke but no flame; to feel suppressed anger|闷烧；郁积|The ashes began to ___.|Anger continued to ___ inside him.|The fire may ___ for days.|scald,parch|smoldered,smoldering
  scald|to burn with very hot liquid or steam|烫伤|Be careful not to ___ your hand.|Steam can ___ your skin.|Hot tea may ___ the baby.|smolder,swelter|scalded,scalding
  simmer|to stay just below boiling; to be in a state of suppressed anger|慢炖；即将爆发|Let the soup ___ for an hour.|Tension continued to ___ in the town.|___ the rice until soft.|parch,scald|simmered
  seethe|to be filled with intense but unexpressed anger; to bubble as if boiling|怒火中烧；沸腾|She began to ___ with rage.|The sea seemed to ___ in the storm.|He would ___ in silence.|parch,quench|seethed,seething
  swelter|to be uncomfortably hot|热得难受|We ___ in the summer heat.|Workers ___ in the factory.|Tourists ___ in the crowds.|scald,parch|sweltered,sweltering
  parch|to make or become dry through intense heat|烤干|The sun will ___ the fields.|Drought began to ___ the land.|Heat can ___ your throat.|quench,swelter|parched
  quench|to satisfy thirst; to put out a fire|解渴；熄灭|Water will ___ your thirst.|They tried to ___ the flames.|Nothing could ___ her desire to learn.|kindle,illuminate|quenched
  illuminate|to light up; to help to explain|照亮；阐明|Lamps ___ the street.|The book helps ___ the past.|Fireworks ___ the sky.|ignite,kindle|illuminated,illumination
  `,
);

const crowds = batch(
  "words-of-crowds-and-gatherings",
  ["Words of Crowds and Gatherings", "人群与聚集的词"],
  ["coming together, mixing, scattering and plotting", "聚集、交往、散开与密谋"],
  `
  congregate|to gather into a crowd|聚集|People ___ in the square at night.|Birds ___ by the lake.|Fans began to ___ outside the hotel.|ally,conspire|congregated,congregation
  throng|a large, densely packed crowd; to fill a place|人群；挤满|A ___ of fans waited at the gate.|Shoppers ___ the streets at Christmas.|She pushed through the ___.|ally,merge|thronged
  mingle|to mix together; to move around and talk at a party|混合；交往|The host began to ___ with her guests.|The smells of food ___ in the air.|Don't just stand there; ___.|conspire,ally|mingled
  merge|to combine into a single thing|合并|The two firms will ___.|Traffic must ___ into one lane.|The rivers ___ near the city.|commotion,uproar|merged,merger
  converge|to come together from different directions|汇聚|The roads ___ at the bridge.|Fans began to ___ on the stadium.|Their views began to ___.|disperse,uproar|converged
  disperse|to scatter in different directions|驱散，散开|Police tried to ___ the crowd.|The fog will ___ by noon.|Seeds ___ in the wind.|converge,congregate|dispersed
  ally|a person or country that cooperates with another; to join with|盟友；结盟|Britain was a close ___.|She found an ___ in her teacher.|The two nations chose to ___ against the threat.|throng,commotion|allied
  conspire|to make secret plans to do something wrong|密谋|They tried to ___ against the king.|Events seemed to ___ against us.|The men ___ to rob the bank.|commotion,mingle|conspired,conspiracy,conspirator
  commotion|a state of confused and noisy disturbance|骚动|There was a ___ in the street.|What's all the ___ about?|The fight caused a ___.|ally,conspire|
  uproar|a loud and impassioned noise or disturbance; public outrage|喧闹；公愤|The decision caused an ___.|The room was in ___.|There was public ___ over the price.|conspire,ally|
  `,
);

const blocking = batch(
  "words-of-blocking-and-breaking",
  ["Words of Blocking and Breaking", "阻挠与破坏的词"],
  ["getting in the way, damaging, cutting and knocking over", "妨碍、损坏、切断与推倒"],
  `
  hamper|to hinder or impede the movement or progress of|妨碍|Snow began to ___ the rescue.|Injuries may ___ the team.|Lack of money will ___ research.|sever,topple|hampered
  thwart|to prevent someone from accomplishing something|挫败|Police managed to ___ the robbery.|Bad weather may ___ our plans.|They tried to ___ his escape.|sever,rupture|thwarted
  foil|to prevent something wrong from succeeding; a thin metal sheet|挫败；箔纸|A guard was able to ___ the theft.|Wrap the fish in ___.|The hero tried to ___ the plot.|sever,rupture|foiled
  obstruct|to block a path or progress|阻塞，妨碍|A fallen tree may ___ the road.|Don't ___ the police.|The pillar will ___ your view.|rupture,sever|obstructed,obstruction
  impair|to weaken or damage|损害|Loud music can ___ your hearing.|Alcohol will ___ your judgment.|The injury may ___ his sight.|disrupt,sever|impaired,impairment
  disrupt|to interrupt by causing a disturbance|扰乱|Protesters tried to ___ the meeting.|Strikes may ___ train services.|Don't ___ the class.|impair,topple|disrupted,disruption,disruptive
  stifle|to suffocate; to restrain a reaction or stop something happening|使窒息；压制|She tried to ___ a yawn.|Heavy rules ___ new ideas.|The heat seemed to ___ us.|obstruct,rupture|stifled,stifling
  sever|to cut off; to put an end to a connection|切断|The blade can ___ a finger.|The two nations chose to ___ ties.|The storm may ___ the power line.|rupture,topple|severed
  rupture|to break or burst suddenly; a breach|破裂|The pipe may ___ in the frost.|He had a ___ in his knee.|The quarrel caused a ___ in the family.|sever,stifle|ruptured
  topple|to overbalance and fall; to remove from power|倒下；推翻|The tower may ___ in the wind.|Rebels tried to ___ the government.|Don't let the vase ___.|disrupt,sever|toppled
  `,
);

const urging = batch(
  "words-of-coaxing-and-urging",
  ["Words of Coaxing and Urging", "劝诱与催促的词"],
  ["persuading gently, tempting, begging, stirring up and forcing", "温和劝说、引诱、恳求、激起与强迫"],
  `
  coax|to gently persuade someone to do something|哄劝|She had to ___ the cat out of the tree.|He tried to ___ a smile from her.|We ___ the engine into life.|incite,arouse|coaxed
  entice|to attract or tempt by offering pleasure|诱惑|Free food will ___ students.|Shops ___ buyers with sales.|They tried to ___ him away.|implore,incite|enticed,enticing
  lure|to tempt a person or animal to do something; a thing that attracts|引诱；诱惑物|Bright lights ___ moths.|The ___ of money was strong.|The fisherman used a ___.|prod,oblige|lured
  implore|to beg someone earnestly or desperately|恳求|I ___ you to stay.|She began to ___ them for help.|They ___ the judge for mercy.|incite,coax|implored
  incite|to encourage violent or unlawful behavior; to stir up|煽动|He was jailed for trying to ___ a riot.|Don't ___ hatred.|The speech may ___ the crowd.|implore,oblige|incited,incitement
  compel|to force someone to do something|强迫|The law will ___ firms to pay.|Nobody can ___ you to speak.|Illness may ___ him to retire.|lure,arouse|compelled,compelling
  prod|to poke with a finger or stick; to urge someone to act|戳；督促|She gave him a ___ in the ribs.|Parents ___ their children to study.|Don't ___ the dog.|lure,rouse|prodded
  rouse|to wake from sleep; to stir up feelings|唤醒；激起|Try to ___ him; it's late.|The speech will ___ the troops.|Nothing could ___ her interest.|oblige,lure|roused,rousing
  arouse|to evoke a feeling or response|引起|The noise may ___ suspicion.|The story will ___ your curiosity.|His words ___ anger.|compel,oblige|aroused
  oblige|to make someone legally or morally bound to do something; to do someone a favor|迫使；帮忙|The law will ___ you to vote.|I'd be happy to ___.|Rules ___ us to wear masks.|lure,entice|obliged,obligatory
  `,
);

const flinching = batch(
  "words-of-flinching-and-fretting",
  ["Words of Flinching and Fretting", "退缩与焦虑的词"],
  ["dodging, pulling back, making faces and worrying", "躲避、退缩、做鬼脸与担忧"],
  `
  elude|to escape from cleverly; to fail to be understood|躲避；难倒|The thief managed to ___ the police.|Sleep began to ___ her.|The answer may ___ you.|linger,fret|eluded
  evade|to escape or avoid, especially by guile|逃避|He tried to ___ the question.|She would ___ paying tax.|The fox managed to ___ the hounds.|recoil,brood|evaded,evasion,evasive
  recoil|to suddenly spring back in fear or disgust|退缩|She began to ___ at the sight of the snake.|The gun will ___ when fired.|People ___ from violence.|startle,brood|recoiled
  cringe|to bend one's head and body in fear; to feel embarrassment|畏缩；尴尬|I ___ when I hear my old songs.|The dog began to ___ at the shout.|Parents ___ at their children's jokes.|brood,linger|cringed,cringing
  wince|to make a slight involuntary grimace from pain or distress|皱眉蹙额|She began to ___ when the nurse gave the shot.|He would ___ at bad jokes.|I ___ at the memory.|brood,linger|winced
  grimace|an ugly, twisted expression of disgust or pain|鬼脸，痛苦的表情|He made a ___ as he tasted the medicine.|Her face twisted into a ___.|With a ___, he lifted the box.|wince,brood|grimaces
  startle|to cause to feel sudden shock or alarm|惊吓|Don't ___ the baby.|The noise will ___ the horses.|Loud bangs ___ me.|recoil,fret|startling
  fret|to be constantly or visibly anxious|烦躁，发愁|Don't ___; it will be fine.|She tends to ___ about money.|Parents ___ over exams.|startle,elude|fretted,fretful
  brood|to think deeply about something that makes one unhappy; a family of young birds|沉思，忧思；一窝(雏鸟)|He tends to ___ over his mistakes.|The hen sat on her ___.|Don't ___; go out and play.|elude,startle|brooded,brooding
  linger|to stay in a place longer than necessary; to be slow to disappear|逗留；挥之不去|Don't ___ after school.|The smell may ___ for days.|Her words continued to ___ in my mind.|elude,brood|lingered,lingering
  `,
);

const loathing = batch(
  "words-of-loathing-and-bullying",
  ["Words of Loathing and Bullying", "憎恶与欺凌的词"],
  ["hating, shocking, annoying, shaming and frightening", "憎恨、震惊、恼怒、羞辱与恐吓"],
  `
  despise|to feel contempt or a deep repugnance for|鄙视|They ___ cowards and admire the brave.|She came to ___ her old job.|Don't ___ people who are poor.|appall,intimidate|despised
  detest|to dislike intensely|厌恶|I ___ cold weather.|She seemed to ___ her cousin.|Cats ___ water.|harass,intimidate|detested
  loathe|to feel intense dislike or disgust for|极讨厌|I ___ washing dishes.|They ___ each other.|He would ___ the sight of her.|harass,appall|loathed,loathing,loathsome
  resent|to feel bitterness at having been treated unfairly|怨恨|She would ___ being called a child.|Many ___ the new tax.|Don't ___ your brother's success.|appall,harass|resented
  appall|to greatly dismay or horrify|使震惊|The news will ___ you.|Such cruelty must ___ anyone.|The waste seemed to ___ her.|resent,humiliate|appalled,appalling
  irk|to irritate; to annoy|使厌烦|His laziness began to ___ her.|Small noises ___ me.|It may ___ you to wait.|harass,loathe|irked,irksome
  harass|to subject to aggressive pressure or intimidation|骚扰|Reporters began to ___ the family.|It is illegal to ___ workers.|Don't ___ the animals.|detest,loathe|harassed,harassment
  humiliate|to make someone feel ashamed and foolish|羞辱|The coach tried not to ___ the player.|They wanted to ___ him in public.|Don't ___ your sister by laughing at her in front of everyone.|alienate,appall|humiliated,humiliating,humiliation
  intimidate|to frighten someone, especially to make them do what one wants|恐吓|Gangs try to ___ witnesses.|Don't let the size of the task ___ you.|He would ___ smaller boys.|detest,alienate|intimidated,intimidating,intimidation
  alienate|to cause someone to feel isolated or hostile|疏远|Rudeness may ___ customers.|The policy will ___ young voters.|He tried not to ___ his friends.|humiliate,intimidate|
  `,
);

/** batchesC are the batches of puzzling, rough handling, heat, crowds, blocking, urging, flinching and loathing. */
export const batchesC: readonly BatchSpec[] = [puzzling, handling, heat, crowds, blocking, urging, flinching, loathing];
