// Grade 11: the batches of words of hazy and sharp thinking, of characters in company, of the passing and the pungent,
// and of the academic words for beginning and ending, for more and less, for joining and for limiting.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const hazy = batch(
  "words-of-hazy-and-sharp-thinking",
  ["Words of Hazy and Sharp Thinking", "模糊与敏锐思维的词"],
  ["narrow views, empty heads, sharp tongues and loud voices", "短视、空洞、犀利与喧嚣"],
  `
  myopic|nearsighted; lacking foresight|近视的；目光短浅的|It was a ___ decision to cut the budget.|She is ___ and wears glasses.|The ___ plan ignored the future.|vacuous,trenchant|myopia
  obfuscate|to make unclear or hard to understand|使模糊，使困惑|The report seems to ___ the facts.|Don't ___ the issue with jargon.|He tried to ___ his role in the affair.|propitious,pliant|obfuscated,obfuscation
  vacuous|having or showing a lack of thought or intelligence|空洞的，愚蠢的|He gave a ___ grin.|The show was ___ and silly.|Her ___ remarks annoyed us.|myopic,vociferous|vacuously
  trenchant|vigorous or incisive in expression|尖锐的，犀利的|She made a ___ criticism of the plan.|His ___ wit made him famous.|The editor wrote a ___ reply.|vociferous,vacuous|trenchantly
  vociferous|expressing opinions in a loud and forceful way|大声疾呼的，喧嚷的|She is a ___ critic of the war.|The crowd was ___.|There was ___ opposition to the plan.|trenchant,umbrage|vociferously
  umbrage|offense or annoyance|不快，生气|She took ___ at his remark.|He took ___ at being left out.|Don't take ___; it was a joke.|vicarious,veneer|
  vicarious|experienced in the imagination through another person|间接感受的|She took ___ pleasure in her son's success.|Films give us ___ thrills.|He lived a ___ life through books.|umbrage,pliant|vicariously
  veneer|a thin decorative layer; an attractive appearance that hides something|饰面；虚饰|The table has an oak ___.|Beneath his ___ of calm, he was afraid.|A ___ of politeness hid her anger.|vicarious,obfuscate|
  pliant|easily bent; easily influenced|柔韧的；易受影响的|The willow is ___.|The king wanted a ___ minister.|Leather becomes ___ when oiled.|propitious,myopic|pliancy
  propitious|giving or indicating a good chance of success|有利的，吉利的|It is a ___ time to buy.|The weather was ___ for sailing.|The signs were not ___.|pliant,umbrage|propitiously
  `,
);

const characters = batch(
  "words-for-characters-in-company",
  ["Words for Characters in Company", "社交中人物的词"],
  ["the famous and the new, the clever and the gloomy, the fooled and the fooling", "名人与新手、聪明人与忧郁者、受骗者"],
  `
  juggernaut|a huge, powerful force or institution that is hard to stop|不可阻挡的力量|The company became a retail ___.|The campaign was a ___.|The team rolled on like a ___.|savant,raconteur|juggernauts
  lionize|to treat someone as a celebrity|把…捧为名人|The press began to ___ the young singer.|They ___ him as a hero.|Fans ___ every rock star.|dupe,histrionic|lionized
  neophyte|a person who is new to a subject or activity|新手，初学者|The course is designed for the ___.|He is a ___ in politics.|Even a ___ can make good bread.|savant,misanthrope|neophytes
  savant|a learned person, especially a distinguished scientist|博学之士|The ___ solved the puzzle in minutes.|She was a ___ of ancient languages.|The ___ lectured on stars.|neophyte,raconteur|savants
  raconteur|a person who tells stories in a skillful and amusing way|善讲故事的人|Her uncle was a fine ___.|The ___ kept the guests laughing.|As a ___, he had no equal.|savant,jocular|raconteurs
  misanthrope|a person who dislikes humankind|厌恶人类者|The old ___ lived alone.|He became a ___ after the war.|Only a ___ could hate this party.|neophyte,juggernaut|misanthropic,misanthropy
  jocular|fond of or characterized by joking|诙谐的|He was in a ___ mood.|She gave a ___ reply.|The ___ host teased his guests.|maudlin,histrionic|jocularly
  histrionic|overly theatrical or dramatic in character or style|做作的，演戏似的|Her ___ sobs fooled no one.|He made a ___ display of grief.|The actor's style was ___.|maudlin,jocular|histrionics
  maudlin|sentimental in a self-pitying way|伤感的，自怜的|He became ___ after a few drinks.|The song is ___.|Her ___ speech made us cringe.|histrionic,lionize|
  dupe|a victim of deception; to deceive|受骗者；欺骗|He was the ___ of a clever trick.|Scammers try to ___ old people.|Don't be a ___.|lionize,neophyte|duped
  `,
);

const passing = batch(
  "words-of-the-fleeting-and-the-sharp",
  ["Words of the Fleeting and the Sharp", "短暂与刺激之物的词"],
  ["brief things, plenty, health, strong smells and restless moods", "短暂之物、充裕、健康、强烈气味与不安情绪"],
  `
  transitory|not permanent|短暂的|Fame is ___.|The pain was ___.|They live a ___ life on the road.|profuse,foible|
  profuse|abundant; plentiful|大量的；毛发的|She offered ___ apologies.|He was bleeding ___.|The roses gave a ___ bloom.|transitory,salubrious|profusely,profusion
  salubrious|health-giving; healthy; pleasant|有益健康的|They moved to a more ___ climate.|The ___ air of the mountains helped her.|It was not a ___ neighborhood.|pungent,profuse|
  pungent|having a sharply strong taste or smell|刺鼻的，辛辣的|The ___ smell of garlic filled the room.|Some cheeses are very ___.|He made ___ remarks about the government.|salubrious,fractious|pungency
  fractious|irritable and quarrelsome; hard to control|易怒的；难以控制的|The ___ child refused to sleep.|The party is ___ and divided.|A ___ horse threw its rider.|restive,pungent|fractiously
  restive|unable to keep still; restless and impatient|焦躁不安的|The crowd grew ___ as the delay went on.|The ___ horse stamped its feet.|Voters are ___.|fractious,alacrity|restiveness
  alacrity|brisk and cheerful readiness|乐意，欣然|She accepted the invitation with ___.|He moved with ___.|They agreed with surprising ___.|restive,antipathy|
  foible|a minor weakness or eccentricity in someone's character|小缺点|We forgive a friend's every ___.|His one ___ is being late.|She laughed at her own small ___.|antipathy,apocryphal|foibles
  apocryphal|of doubtful authenticity, although widely circulated as being true|可疑的，杜撰的|The story is probably ___.|An ___ tale says he never slept.|Many quotes are ___.|foible,transitory|
  antipathy|a deep-seated feeling of dislike|反感，憎恶|She felt ___ toward her rival.|There is a long ___ between the clans.|His ___ to change is well known.|foible,alacrity|antipathies
  `,
);

const startEnd = batch(
  "words-for-starting-and-finishing",
  ["Words for Starting and Finishing", "开始与完成的词"],
  ["academic words for beginnings, steps and endings", "表示开端、步骤和结束的学术词"],
  `
  commence|to begin|开始|The ceremony will ___ at noon.|Work will ___ next week.|Let the games ___.|cease,precede|commenced,commencement
  initiate|to cause a process or action to begin|发起，开始|They will ___ talks next month.|Who will ___ the project?|The club will ___ new members tonight.|undertake,terminate|initiated,initiation,initiative
  cease|to come to an end; to stop|停止|The firing must ___ at once.|The rain did not ___ all day.|The company will ___ trading.|terminate,commence|ceased,ceaseless
  terminate|to bring to an end|终止|They decided to ___ the contract.|The train will ___ at the next station.|The boss may ___ his employment.|cease,proceed|terminated,termination
  proceed|to begin or continue a course of action|继续进行|Please ___ to gate five.|We will ___ with the plan.|Let's ___ with caution.|precede,undertake|proceeded,proceedings
  precede|to come before in time or order|在…之前|A short film will ___ the main feature.|Thunder will ___ the storm.|A speech will ___ the dinner.|proceed,commence|preceded,preceding
  undertake|to commit oneself to and begin a task|承担，着手|She agreed to ___ the research.|He will ___ the journey alone.|We ___ to finish by Friday.|initiate,precede|undertook,undertaken,undertaking
  eventual|occurring at the end of a process|最终的|The ___ winner was a young skater.|Her ___ goal is to be a doctor.|The ___ cost was huge.|ultimate,preliminary|eventually
  ultimate|being the best or most extreme; final|最终的；极致的|Their ___ aim is peace.|It is the ___ sports car.|Who bears ___ responsibility?|eventual,preliminary|ultimately
  preliminary|coming before a more important action or event|初步的，预备的|The ___ results look good.|They held ___ talks.|After a few ___ remarks, she began.|ultimate,eventual|preliminaries
  `,
);

const moreLess = batch(
  "words-for-more-and-less",
  ["Words for More and Less", "增多与减少的词"],
  ["academic words for growing, shrinking and being enough", "表示增长、缩小和足够的学术词"],
  `
  accumulate|to gather or build up over time|积累|Dust will ___ on the shelves.|She managed to ___ a fortune.|Snow began to ___ on the roads.|exceed,diminish|accumulated,accumulation
  exceed|to be greater than; to go beyond a limit|超过|The cost may ___ our budget.|Don't ___ the speed limit.|Her results ___ our hopes.|accumulate,minimize|exceeded,exceedingly
  maximize|to make as large or great as possible|最大化|Firms try to ___ profits.|She tried to ___ her chances.|Open the curtains to ___ the light.|minimize,enhance|maximized
  minimize|to reduce to the smallest possible amount|最小化；轻视|Wash your hands to ___ the risk.|He tried to ___ his mistakes.|Close the window to ___ the noise.|maximize,accentuate|minimized
  diminish|to make or become less|减少，减弱|The pain will ___ over time.|Nothing can ___ her success.|Supplies began to ___.|accumulate,enhance|diminished,diminishing
  enhance|to improve the quality, value or extent of|提高，增强|Good lighting can ___ a room.|The scandal did not ___ his reputation.|Spices ___ the flavor.|accentuate,diminish|enhanced,enhancement
  accentuate|to make more noticeable|强调，使突出|The dress will ___ her waist.|The music seemed to ___ the sadness.|Bold lines ___ the shape.|enhance,minimize|accentuated
  appreciable|large or important enough to be noticed|可观的，明显的|There was an ___ drop in crime.|The change made no ___ difference.|An ___ number of people agreed.|minimal,sufficient|appreciably
  minimal|of a minimum amount, quantity or degree|最小的，极少的|The damage was ___.|They live on ___ income.|The work needs ___ effort.|appreciable,sufficient|minimally
  sufficient|enough; adequate|足够的|Do we have ___ food for the trip?|One example is ___.|There was not ___ evidence.|minimal,appreciable|sufficiently,sufficiency
  `,
);

const joining = batch(
  "words-for-joining-and-matching",
  ["Words for Joining and Matching", "结合与相合的词"],
  ["academic words for putting together and running side by side", "表示组合与并行的学术词"],
  `
  assemble|to gather together; to fit together the parts of|集合；装配|The crowd began to ___ in the square.|It takes an hour to ___ the desk.|She will ___ a team.|compile,unify|assembled
  compile|to produce something by collecting information|编纂，汇编|They will ___ a list of names.|She took years to ___ the dictionary.|We must ___ the data.|assemble,incorporate|compiled,compilation
  incorporate|to take in as part of a whole|包含，并入|The design will ___ your ideas.|The new law will ___ older rules.|They hope to ___ music into the lesson.|integral,compile|incorporated,incorporation
  integral|necessary to make a whole complete|不可或缺的|Music is ___ to the film.|She is an ___ part of the team.|Exercise is ___ to good health.|incorporate,concurrent|integrally
  unify|to make or become united|统一|The war helped ___ the country.|A common enemy can ___ rivals.|They tried to ___ the two systems.|assemble,coincide|unified,unification
  coincide|to happen at the same time; to agree|同时发生；一致|My birthday will ___ with the holiday.|Our views ___ on most issues.|The two events ___.|overlap,parallel|coincided,coincidence
  concurrent|existing or happening at the same time|同时发生的|He is serving two ___ sentences.|There were ___ strikes in three cities.|The ___ events confused reporters.|consecutive,integral|concurrently
  consecutive|following continuously, one after another|连续的|It rained for five ___ days.|They won three ___ titles.|Number the pages in ___ order.|concurrent,parallel|consecutively
  overlap|to extend over and cover part of; to have things in common|重叠|The two roles ___ a great deal.|Lay the tiles so they ___.|Our holidays ___ by a week.|coincide,consecutive|overlapped,overlapping
  parallel|side by side and having the same distance between; similar|平行的；相似的|Draw two ___ lines.|The road runs ___ to the river.|There are ___ features in the two cases.|overlap,unify|parallels
  `,
);

const limiting = batch(
  "words-for-limiting-and-keeping",
  ["Words for Limiting and Keeping", "限制与保留的词"],
  ["academic words for holding back, leaving out and keeping", "表示约束、排除和保留的学术词"],
  `
  constrain|to compel or force; to limit severely|约束；强迫|Lack of money may ___ our plans.|Laws ___ what companies can do.|She felt ___ to agree.|restrain,impose|constrained
  restrain|to prevent from doing something; to hold back|抑制，阻止|Police had to ___ the angry fans.|She could barely ___ her laughter.|Try to ___ your spending.|constrain,inhibit|restrained,restraint
  restrict|to put a limit on|限制|The new rules ___ parking.|They ___ the number of visitors.|Don't ___ yourself to one idea.|inhibit,exclude|restricted,restriction,restrictive
  inhibit|to hinder or prevent an action or process|抑制，阻碍|Fear can ___ learning.|The drug may ___ growth.|Shyness can ___ a child.|restrain,retain|inhibited,inhibition
  exclude|to keep out or leave out|排除|The club tries to ___ new members.|Don't ___ anyone from the game.|Some old clubs ___ women.|eliminate,restrict|excluded,exclusion,exclusive
  eliminate|to remove completely; to knock out of a competition|消除；淘汰|We aim to ___ waste.|The team may ___ the champions.|The new test will ___ errors.|exclude,reject|eliminated,elimination
  impose|to force something unwelcome on; to take advantage of|强加；占便宜|The state will ___ a new tax.|I don't want to ___ on you.|They tried to ___ their views.|constrain,retain|imposed,imposition
  retain|to keep possession of; to continue to have|保留，保持|The house will ___ its old charm.|She managed to ___ her title.|Clay soil tends to ___ water.|reject,impose|retained,retention
  reject|to refuse to accept|拒绝|They might ___ the offer.|The body may ___ the new kidney.|Voters will ___ the plan.|retain,eliminate|rejected,rejection
  withhold|to refuse to give something that is due or wanted|扣留，拒给|The firm may ___ his pay.|She chose to ___ her name.|Don't ___ information from the police.|retain,restrain|withheld
  `,
);

/** batchesF are the batches of hazy thinking, characters, the fleeting, starting and finishing, more and less, joining and limiting. */
export const batchesF: readonly BatchSpec[] = [hazy, characters, passing, startEnd, moreLess, joining, limiting];
