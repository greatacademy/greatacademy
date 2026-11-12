// Grade 9: the batches of words of the first four units, from the tone of a writer and the craft of a story to epics
// and quests, the loves and feuds of tragedy, and growing up.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const tone = batch(
  "words-of-tone-and-attitude",
  ["Words of Tone and Attitude", "语气与态度的词"],
  ["a writer's tone and attitude", "作者的语气与态度"],
  `
  sardonic|grimly mocking, in a way that shows scorn|讥讽的，冷嘲的|He gave a ___ laugh when they called the plan a success.|Her ___ remarks made it clear she thought the meeting was a waste of time.|The narrator's ___ voice mocks the town's proud leaders.|wry,contemptuous|sardonically
  wry|showing dry, quiet humor, often about something disappointing|揶揄的，带苦笑的|She gave a ___ smile when the bus left just as she arrived.|The author's ___ humor makes even the sad chapters enjoyable.|"Well, that went well," he said with a ___ glance at the broken vase.|sardonic,flippant|wryly
  reverent|showing deep respect, often with a sense of awe|恭敬的，虔诚的|The visitors walked through the old cathedral in ___ silence.|He spoke of his teacher in a ___ voice.|The essay takes a ___ tone toward the mountains.|elegiac,didactic|reverently,reverence
  contemptuous|showing that you think someone or something is worthless|轻蔑的，鄙视的|She gave the bribe a ___ glance and walked away.|The critic was ___ of the film's silly ending.|His ___ reply showed how little he thought of their offer.|sardonic,detached|contemptuously,contempt
  detached|not showing feeling or personal involvement; distant|超然的，冷漠的|The reporter described the battle in a cool, ___ voice.|He seemed strangely ___ from the chaos around him.|The narrator's ___ tone makes the tragedy even more chilling.|laconic,contemptuous|detachment
  flippant|not showing the seriousness that a situation deserves|轻率的，不严肃的|His ___ answer to the judge's question angered the court.|It is easy to be ___ about dangers you have never faced.|She regretted her ___ joke about the accident.|wry,jaunty|flippantly
  elegiac|sad and full of sorrow for someone or something lost or past|哀伤的，挽歌式的|The poem's ___ tone mourns the lost village.|He wrote an ___ essay about his late father.|The film ends on an ___ note, with the old ship sinking.|reverent,laconic
  jaunty|lively, cheerful and confident|轻快的，得意洋洋的|He wore his hat at a ___ angle.|A ___ tune played over the opening scene.|Despite the bad news, she walked off with a ___ step.|flippant,didactic|jauntily
  didactic|meant to teach, especially in a way that lectures the reader|说教的，教诲的|The story is too ___; every page has a lesson.|Old children's books were often ___.|Her ___ tone made the audience feel scolded.|reverent,jaunty
  laconic|using very few words|简洁的，言简意赅的|The ___ farmer answered every question with "yep" or "nope."|His ___ letters said only what was necessary.|The hero's ___ replies make him seem calm and strong.|detached,elegiac|laconically
  `,
);

const craft = batch(
  "words-of-narrative-craft",
  ["Words of Narrative Craft", "叙事技艺的词"],
  ["how a story is told", "故事的讲述方式"],
  `
  narrator|the voice or character who tells a story|叙述者|The ___ of the novel is a ten-year-old girl.|We cannot fully trust a ___ who admits he lies.|The ___ speaks directly to the reader in the first chapter.|persona,omniscient|narrators,narration
  omniscient|knowing everything, including what all the characters think and feel|全知的|An ___ narrator can tell us what every character is thinking.|The story shifts from an ___ view to a single character's eyes.|No one is truly ___; we all make mistakes.|narrator,retrospective
  verisimilitude|the quality of seeming true or real|逼真，真实感|Details of real streets give the novel ___.|The dialogue lacks ___; no one talks like that.|Historical novelists research for years to achieve ___.|anachronism,subtext
  digression|a part of a speech or a piece of writing that moves away from the main subject|离题，题外话|After a long ___ about his childhood, the speaker returned to his point.|The novel is full of charming ___.|Forgive the ___; let me get back to the story.|subtext,episodic|digressions,digress
  chronology|the order in which events happened|年表，时间顺序|The story jumps around in time, so readers must piece together its ___.|Historians argue about the ___ of the battle.|She wrote a ___ of her grandfather's life.|digression,episodic|chronologies
  episodic|made of separate events or adventures loosely joined together|插曲式的，由片段组成的|The novel is ___: each chapter is a different adventure.|An ___ plot can feel scattered.|The TV series is ___, so you can watch any part first.|chronology,retrospective
  retrospective|looking back on past events|回顾的|The novel is a ___ account told by an old man.|In a ___ essay, she considers her years at the school.|The museum held a ___ show of the painter's life work.|episodic,omniscient|retrospectively,retrospect
  persona|the character or voice that a writer or speaker takes on, which may differ from the real person|人物角色，人格面具|The poet writes in the ___ of a soldier.|On stage, the shy singer took on a bold ___.|The comic ___ of the narrator hides a sad story.|narrator,subtext|personas
  subtext|a meaning that is not stated directly but lies beneath the words|潜台词，言外之意|The ___ of their polite talk is anger.|Read the ___: she says yes, but she means no.|Good dialogue often has a rich ___.|persona,verisimilitude
  anachronism|something placed in a time where it does not belong, such as a clock in ancient Rome|时代错误|A wristwatch in a film about knights is an ___.|The novel's ___ were deliberate jokes.|Calling the Romans "teenagers" is an ___.|verisimilitude,chronology|anachronisms,anachronistic
  `,
);

const epic = batch(
  "words-of-epic-and-myth",
  ["Words of Epic and Myth", "史诗与神话的词"],
  ["epics and myths", "史诗与神话"],
  `
  epic|a long poem that tells of the deeds of a great hero; or very great in scale|史诗；宏大的|The ___ tells of a king's journey home after a long war.|Crossing the desert on foot was an ___ adventure.|Homer's ___ begins in the middle of the story.|saga,invocation|epics
  invocation|a call for help, as when a poet asks a muse for inspiration at the start of a poem|祈求，祈祷|The poem opens with an ___ to the goddess of memory.|The priest began the ceremony with an ___.|In the ___, the poet asks the gods to sing through him.|epithet,muse|invocations,invoke
  epithet|a descriptive word or phrase used again and again with a name, such as "swift-footed Achilles"|称号，修饰语|"Rosy-fingered Dawn" is a famous ___ from Homer.|The hero's ___, "the cunning one," shows what he is known for.|Each god in the poem has a fixed ___.|invocation,saga|epithets
  saga|a long story of heroic deeds, often over many generations|传奇，长篇故事|The ___ follows one family for three hundred years.|Old Icelandic ___ tell of feuds and voyages.|Their search for the lost dog became a week-long ___.|epic,bard|sagas
  bard|a poet, especially one who sang or recited long poems in ancient times|吟游诗人|The ___ sang of the hero's deeds at the feast.|Shakespeare is often called the ___.|Each village had its own ___ who kept the old stories.|muse,saga|bards
  muse|one of the goddesses believed to inspire poets and artists; or a person who inspires an artist|缪斯；灵感来源|The poet calls on the ___ to help him tell the story.|His wife was his ___ and his greatest critic.|Each ___ ruled over one art, such as music or history.|bard,deity|muses
  pantheon|all the gods of a people or a religion; or a group of very famous people|万神殿，众神；名人群体|Zeus ruled over the Greek ___.|The Norse ___ includes Odin and Thor.|She has joined the ___ of great scientists.|deity,demigod|pantheons
  deity|a god or a goddess|神，神灵|The temple was built to honor a ___ of the sea.|Each ___ had its own feast day.|The ancient people prayed to a ___ of rain.|pantheon,immortal|deities
  demigod|a being who is part god and part human, such as Hercules|半神|Hercules was a ___, the son of Zeus and a mortal woman.|The ___ had great strength but could still die.|Fans treat the singer like a ___.|deity,immortal|demigods
  immortal|living forever, never dying; or a being who lives forever|不朽的；神仙|The gods of Olympus were ___.|Her songs have made her ___.|The hero refused the gift of being ___.|demigod,pantheon|immortality,immortals,mortal,mortals
  `,
);

const quests = batch(
  "words-of-trials-and-quests",
  ["Words of Trials and Quests", "考验与探寻的词"],
  ["quests and the trials of heroes", "英雄的探寻与考验"],
  `
  tribulation|a cause of great trouble or suffering|苦难，磨难|The settlers endured many ___ in their first winter.|The book tells of the trials and ___ of a young doctor.|Each ___ made the travelers stronger.|gauntlet,arduous|tribulations
  talisman|an object thought to have magic powers, especially to bring good luck or protection|护身符|The sailor wore a silver ___ around his neck.|In the tale, the ___ protects the hero from the witch's spell.|She kept her mother's ring as a ___.|relic,emissary|talismans
  relic|an object that has survived from the past, often one that is honored or treasured|遗物，圣物|The museum keeps a ___ from the old monastery.|The typewriter is a ___ of my grandfather's office.|Pilgrims came to see the sacred ___.|talisman,vigil|relics
  gauntlet|a series of attacks or difficulties to be faced one after another; or a heavy glove of armor|夹击，严峻考验；铁手套|The hero had to run a ___ of monsters to reach the gate.|The new law faced a ___ of criticism.|The knight threw down his ___ as a challenge.|tribulation,vigil|gauntlets
  vigil|a period of staying awake at night to watch or pray|守夜，值夜|She kept a ___ at her father's bedside.|The night before his quest, the knight held a ___ in the chapel.|Hundreds joined a candlelight ___ for the lost miners.|relic,sojourn|vigils
  emissary|a person sent on a special mission, especially to deliver a message|使者，密使|The king sent an ___ to make peace.|The ___ carried a letter sealed with wax.|She served as an ___ between the two families.|talisman,forsake|emissaries
  arduous|needing a great deal of effort and energy|艰巨的，艰苦的|The climb to the summit was long and ___.|Writing the dictionary was an ___ task.|After an ___ journey, they reached the coast.|tenacious,tribulation|arduously
  tenacious|holding on firmly and refusing to give up|坚韧的，顽强的|The ___ reporter kept asking questions until she got an answer.|The weed's ___ roots went deep into the soil.|The hero's ___ hope keeps him alive.|arduous,forsake|tenacity,tenaciously
  sojourn|a short stay in a place that is not your home|逗留，暂住|After a brief ___ on the island, the sailors went on.|Her ___ in Paris changed her life.|The hero's ___ with the goddess lasts seven years.|vigil,emissary|sojourns
  forsake|to abandon or leave someone or something completely|抛弃，离弃|He swore never to ___ his friends.|She would not ___ her dream of flying.|The crew ___ the sinking ship.|tenacious,sojourn|forsakes,forsook,forsaken
  `,
);

const honor = batch(
  "words-of-honor-and-hospitality",
  ["Words of Honor and Hospitality", "荣誉与待客之道的词"],
  ["honor, loyalty and the welcome of guests", "荣誉、忠诚与待客"],
  `
  hospitality|friendly and generous treatment of guests and strangers|好客，殷勤招待|The villagers showed great ___ to the lost travelers.|In ancient Greece, breaking the rules of ___ was a serious crime.|Thank you for your kind ___ during our stay.|reciprocity,magnanimous|hospitable
  fealty|the loyalty a person in the Middle Ages owed to a lord|（封建时代的）效忠|The lords knelt and swore ___ to the king.|In return for land, he owed his lord ___.|Breaking an oath of ___ was punished harshly.|suppliant,reciprocity
  suppliant|a person who humbly asks for help, especially from someone powerful|恳求者，哀求者|The ___ knelt before the king and begged for his son's life.|By custom, a ___ at the altar could not be harmed.|She came to the palace as a ___, not a queen.|benefactor,fealty|suppliants
  benefactor|a person who gives money or help to a person or a cause|恩人，捐助者|A mysterious ___ paid for her studies.|The library was built by a wealthy ___.|He never learned the name of his ___.|suppliant,magnanimous|benefactors
  reciprocity|giving something in return for what you receive, so that both sides benefit|互惠|Friendship depends on ___.|The two towns agreed on ___: each would help the other in a flood.|Gifts in the story create a bond of ___.|hospitality,fealty
  disgrace|loss of respect and honor; or something that causes it|耻辱，丢脸|He left the court in ___ after the scandal.|The broken promise was a ___ to the whole family.|She refused to bring ___ on her name.|ignominy,retribution|disgraced,disgraceful
  retribution|punishment for a serious wrong|惩罚，报应|The villagers demanded ___ for the burning of their homes.|The gods' ___ fell on the proud king.|He lived in fear of ___ for his crime.|disgrace,ignominy
  ignominy|public shame and loss of honor|耻辱，不光彩|The general suffered the ___ of surrender.|She could not bear the ___ of being sent home.|The team avoided the ___ of finishing last.|disgrace,honorable|ignominious
  magnanimous|generous and forgiving, especially toward a rival or someone weaker|宽宏大量的|The ___ victor shook hands with every player on the losing side.|It was ___ of her to forgive him.|In a ___ gesture, the king freed the prisoners.|honorable,benefactor|magnanimity
  honorable|deserving respect because of being honest and fair|光荣的，正直的|He was an ___ man who always kept his word.|There is nothing ___ about cheating.|She made an ___ choice to tell the truth.|magnanimous,ignominy|honorably
  `,
);

const feuds = batch(
  "words-of-love-and-feuds",
  ["Words of Love and Feuds", "爱情与世仇的词"],
  ["love and family feuds", "爱情与家族世仇"],
  `
  vendetta|a long series of revenge attacks between families or groups|血亲复仇，宿怨|The killing began a ___ that lasted thirty years.|He has a personal ___ against the newspaper.|The town was torn apart by the ___.|enmity,rancor|vendettas
  enmity|a feeling of hatred between enemies|敌意，仇恨|The old ___ between the two houses breaks out again in the street.|There was deep ___ between the rival captains.|Time had not softened their ___.|rancor,vendetta|enmities
  rancor|bitter, long-lasting anger and resentment|积怨，怨恨|He spoke of his old rival without ___.|Years of ___ divided the village.|She let go of her ___ and forgave him.|enmity,ardor
  infatuation|a strong but short-lived feeling of love or attraction|迷恋|His ___ with the actress lasted only a summer.|Is it true love or only ___?|Her ___ with the new game faded in a week.|devotion,ardor|infatuated
  devotion|great love, loyalty or care for someone or something|挚爱，忠诚|Her ___ to her sick brother never weakened.|The dog's ___ to its owner moved everyone.|He spoke of his wife with deep ___.|infatuation,ardor|devoted
  ardor|great warmth and strength of feeling, especially of love or enthusiasm|热情，热恋|He wrote love letters full of ___.|Her ___ for science began in childhood.|The crowd's ___ cooled when the speech went on too long.|devotion,rancor|ardent
  suitor|a man who wants to marry a particular woman|求婚者|Each ___ brought gifts to the princess.|Her father turned away every ___.|The rich ___ was refused, to everyone's surprise.|betrothed,elope|suitors
  betrothed|engaged to be married; or the person someone is engaged to|已订婚的；未婚夫（妻）|She was ___ to a prince she had never met.|He introduced his ___ to the family.|The two were ___ when they were still children.|suitor,elope
  elope|to run away secretly in order to get married|私奔|The young couple decided to ___ rather than wait.|They ___ on a stormy night in May.|Her parents feared she would ___ with the sailor.|betrothed,clandestine|elopes,eloped
  clandestine|done secretly, often because it is not allowed|秘密的，暗中的|The lovers held ___ meetings in the garden.|The rebels ran a ___ newspaper.|A ___ wedding took place in the old chapel.|elope,suitor|clandestinely
  `,
);

const fate = batch(
  "words-of-fate-and-fortune",
  ["Words of Fate and Fortune", "命运与运气的词"],
  ["fate, chance and fortune", "命运、机缘与运气"],
  `
  portent|a sign or warning that something important, usually bad, is about to happen|凶兆，预兆|The comet was taken as a ___ of war.|Strange dreams were a ___ of the king's death.|The play opens with a series of ___.|auspicious,providence|portents,portentous
  providence|the care of God or nature, thought to guide events; or careful planning for the future|天意；远见|They thanked ___ for their safe return.|By ___, a ship passed just as their raft began to sink.|The farmer's ___ saved the village from hunger.|predestined,fortune
  fortune|chance or luck, good or bad, and the way it affects a life; or great wealth|运气；财富|By good ___, the doctor was nearby.|___ turned against the king, and he lost every battle.|She made her ___ selling books.|providence,calamity|fortunes,fortunate,misfortune,misfortunes
  calamity|a sudden event that causes great damage or suffering|灾难|The flood was the worst ___ in the town's history.|The play ends in ___ for both families.|Forgetting her passport would have been a ___.|mishap,portent|calamities
  mishap|a small accident or piece of bad luck|小事故，不幸|Apart from one ___ with a flat tire, the trip went well.|The ___ with the letter changes everything in the play.|A small ___ in the kitchen left flour everywhere.|calamity,fluke|mishaps
  serendipity|the luck of finding something good without looking for it|意外发现，机缘巧合|By pure ___, she found the missing letter in a used book.|Many discoveries in science were made by ___.|It was ___ that brought the two old friends to the same café.|happenstance,fluke|serendipitous
  happenstance|something that happens by chance|偶然事件|By ___, they had both chosen the same train.|Their meeting was mere ___.|Much of history depends on ___.|serendipity,providence
  predestined|already decided by God or fate, so that it cannot be changed|命中注定的|The lovers believed their meeting was ___.|Is the hero's death ___, or could he escape it?|He did not believe that anything was ___.|happenstance,auspicious|predestination
  auspicious|showing signs that success will follow|吉利的，吉祥的|The sunny morning seemed an ___ start to the voyage.|They chose an ___ day for the wedding.|The team's first game was not an ___ beginning.|portent,predestined|auspiciously
  fluke|something lucky or surprising that happens by chance, not by skill|侥幸，偶然|Her first win was a ___, but the second showed real skill.|By a ___, the ball bounced into the goal.|It was no ___; he had practiced for years.|mishap,serendipity|flukes
  `,
);

const growing = batch(
  "words-of-growing-up",
  ["Words of Growing Up", "成长的词"],
  ["growing up", "成长"],
  `
  maturity|the state of being fully grown, or of thinking and acting like an adult|成熟|She showed great ___ for a fourteen-year-old.|It takes ___ to admit you were wrong.|The trees reach ___ after twenty years.|callow,juvenile
  naive|showing too little experience of life and too much trust|天真的，幼稚的|It was ___ to believe the stranger's story.|The ___ boy thinks everyone in the city will be kind.|Her ___ questions made the older girls laugh.|callow,precocious|naively,naivety
  autonomy|the freedom to make your own decisions and govern yourself|自主，自治|Teenagers often want more ___ than their parents allow.|The region won ___ after a long struggle.|With her first job came a new sense of ___.|maturity,rite
  rite|a ceremony performed according to a custom, especially to mark an event|仪式|In some cultures, a ___ of passage marks the move into adulthood.|The ___ was performed at sunrise.|Graduation is a modern ___ of passage.|autonomy,angst|rites
  impressionable|easily influenced by others, especially because young|易受影响的|Advertisers target ___ young viewers.|At twelve, he was ___ and copied his cousin in everything.|The film shows how ___ children can be.|naive,precocious
  juvenile|having to do with young people; or childish and silly|青少年的；幼稚的|The ___ court deals with crimes by people under eighteen.|His ___ jokes annoyed everyone at dinner.|___ birds stay near the nest for weeks.|maturity,fledgling|juveniles
  callow|young and without experience|稚嫩的，没有经验的|He was a ___ youth of seventeen when he joined the army.|The ___ reporter made every mistake possible.|She smiled at her ___ younger self in old photographs.|naive,juvenile
  precocious|having developed abilities or interests unusually early|早熟的|The ___ child was reading novels at five.|She was a ___ violinist who played concerts at nine.|His ___ questions surprised the teacher.|impressionable,callow|precociously
  fledgling|a young bird that has just learned to fly; or someone or something new and inexperienced|雏鸟；初出茅庐的人|The ___ fell from the nest but flew away safely.|The ___ company had only three workers.|As a ___ writer, she sent stories to every magazine.|juvenile,angst|fledglings
  angst|a strong feeling of worry and unhappiness, especially about life or the future|焦虑，忧虑|The novel captures the ___ of being sixteen.|His songs are full of teenage ___.|She felt a deep ___ about choosing a college.|rite,fledgling
  `,
);

const belonging = batch(
  "words-of-family-and-belonging",
  ["Words of Family and Belonging", "家庭与归属的词"],
  ["families and belonging", "家庭与归属"],
  `
  kinship|a family relationship, or a feeling of being close to someone|亲属关系；亲近感|She felt a strong ___ with the other new students.|In the village, ___ decided who could marry whom.|The two writers shared a deep ___ of spirit.|clan,solidarity
  heirloom|a valued object that has been passed down in a family for generations|传家宝|The silver clock is a family ___.|She wore her grandmother's ___ ring at her wedding.|The quilt became an ___ of great value.|ancestral,progeny|heirlooms
  estranged|no longer friendly or in contact with someone you were close to|疏远的，不和的|He had been ___ from his brother for ten years.|The story brings together an ___ father and daughter.|Her ___ husband lived in another city.|alienated,kinship|estrangement
  alienated|feeling that you do not belong or are cut off from others|疏远的，格格不入的|In the new school, he felt ___ and alone.|The novel describes a young woman ___ from her family.|Many workers felt ___ by the new rules.|estranged,solidarity|alienation
  solidarity|unity and support among people who share an aim or a difficulty|团结|The workers showed ___ by striking together.|Neighbors stood in ___ with the family who had lost their home.|A sense of ___ grew among the passengers.|kinship,alienated
  guardian|a person who is legally responsible for a child who is not their own; or a protector|监护人；守护者|After her parents died, her aunt became her ___.|The dog acted as the ___ of the farm.|Each student needs a parent or ___ to sign the form.|matriarch,clan|guardians,guardianship
  ancestral|belonging to or inherited from your ancestors|祖先的，祖传的|They visited their ___ village in Italy.|The family sold the ___ home after a hundred years.|___ customs are kept alive at festivals.|heirloom,kinship
  progeny|a person's children or descendants|子孙，后代|The old king hoped his ___ would rule after him.|The farmer's ___ still work the same land.|All the rose bushes in the garden are the ___ of one plant.|heirloom,clan
  matriarch|a woman who is the head of a family or a group|女家长，女族长|The family ___ made every important decision.|At ninety, she was the ___ of five generations.|The elephant herd follows its ___.|guardian,progeny|matriarchs,patriarch,patriarchs
  clan|a large group of families who share an ancestor|宗族，氏族|The Scottish ___ wore the same tartan.|Each ___ had its own lands and leader.|The whole ___ gathered for the wedding.|kinship,matriarch|clans
  `,
);

const courage = batch(
  "words-of-courage-and-fear",
  ["Words of Courage and Fear", "勇气与恐惧的词"],
  ["courage and fear", "勇气与恐惧"],
  `
  fortitude|courage in bearing pain or trouble for a long time|坚韧，刚毅|She faced her long illness with great ___.|It took ___ to keep going after the flood.|The soldiers showed ___ through the winter.|mettle,resilience
  audacity|a bold willingness to take risks, sometimes in a rude way|大胆，胆大妄为|He had the ___ to ask for a raise on his first day.|The ___ of the plan amazed everyone.|With great ___, she climbed onto the stage and began to sing.|fortitude,trepidation|audacious
  intrepid|fearless and adventurous|无畏的，勇敢的|The ___ explorer crossed the ice alone.|An ___ reporter went into the burning building.|Only the most ___ climbers attempt the north face.|craven,undaunted
  resilience|the ability to recover quickly from difficulties|恢复力，韧性|The town showed great ___ after the fire.|Children often have remarkable ___.|Her ___ helped her succeed after many failures.|fortitude,mettle
  undaunted|not discouraged or frightened by danger or difficulty|无畏的，不气馁的|___ by the storm, the sailors kept rowing.|She was ___ by her early failures.|The ___ team began again the next morning.|intrepid,unflinching
  trepidation|fear or worry about something that may happen|惶恐，忧惧|She opened the letter with ___.|With some ___, he stepped onto the old bridge.|The students waited for their results in ___.|audacity,craven
  valiant|very brave, especially in a difficult situation|英勇的|The firefighters made a ___ effort to save the house.|The ___ knight rode out alone.|Despite a ___ fight, the team lost.|intrepid,craven|valiantly
  craven|lacking courage; cowardly|怯懦的，胆小的|The ___ guard ran away at the first sign of danger.|It was a ___ act to blame his friend.|The hero is surrounded by ___ advisors.|valiant,trepidation|cravenly
  unflinching|not showing fear or hesitation in the face of danger or difficulty|毫不畏惧的，坚定的|She met his angry stare with an ___ gaze.|The book is an ___ look at life in prison.|His ___ courage inspired the others.|undaunted,valiant|unflinchingly
  mettle|the ability to keep going bravely through difficulty|勇气，毅力|The final race tested every runner's ___.|The young captain proved her ___ in the storm.|He showed his ___ by coming back after the injury.|fortitude,resilience
  `,
);

/** batchesA are the batches of words of the first four units of grade 9. */
export const batchesA: readonly BatchSpec[] = [tone, craft, epic, quests, honor, feuds, fate, growing, belonging, courage];
