// Grade 12: the batches of words of the later units, from translation and world literature to risk and crisis, and
// two batches of academic words.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const translation = batch(
  "words-of-translation-and-meaning",
  ["Words of Translation and Meaning", "翻译与意义的词"],
  ["carrying meaning from one language to another", "把意义从一种语言带到另一种语言"],
  `
  fidelity|faithfulness to an original, or to a person or a promise|忠实，忠诚|The translator aimed for ___ to the poet's rhythm.|Critics praised the film's ___ to the novel.|___ to the text sometimes makes a translation stiff.|rendering,equivalent|
  literal|following the exact words of the original, rather than its general sense|逐字的，字面的|A ___ translation of the idiom made no sense in English.|The ___ meaning of the word is "high mountain."|She gave a ___ version first and a smoother one second.|idiomatic,polysemy|
  idiomatic|natural to a language, as a native speaker would say it|地道的，符合语言习惯的|His English is fluent and ___.|The translator chose an ___ phrase over a word-for-word one.|An ___ translation reads as if it had been written in English.|literal,untranslatable|idiomatically
  rendering|a version of something in another language, or a performance or interpretation of it|译文，表演，诠释|Her ___ of the poem keeps its music.|The choir gave a moving ___ of the old hymn.|Each ___ of the line reveals a different meaning.|gloss,fidelity|renderings
  equivalent|having the same value, meaning or effect as something else|对等的，相当的|There is no exact English ___ for the word.|Find an ___ phrase that a child would understand.|A mile is roughly ___ to 1.6 kilometers.|rendering,calque|equivalents,equivalence
  untranslatable|impossible to express fully in another language|无法翻译的|Some jokes are ___ because they depend on sound.|The word for that feeling is said to be ___.|She kept the ___ term and explained it in a note.|idiomatic,polysemy|
  gloss|a short explanation of a difficult word or passage|注释，释义|The editor added a ___ for each old word.|Read the ___ in the margin before the poem.|A word-for-word ___ helped students follow the original.|rendering,transliterate|glosses,glossed
  polysemy|the fact of one word having several related meanings|一词多义|The ___ of "run" makes it hard to translate.|Poets often exploit ___ to create double meanings.|Dictionaries handle ___ by listing numbered senses.|literal,calque|polysemous
  calque|a phrase borrowed from another language by translating it word for word|仿译词|"Skyscraper" in many languages is a ___ of the English word.|The French phrase is a ___ of an English idiom.|Linguists noticed the ___ in the new slang.|equivalent,gloss|calques
  transliterate|to write a word in the letters of a different alphabet|音译，转写|We ___ the Russian name into the Latin alphabet.|Signs at the station ___ every place name.|It is hard to ___ some sounds exactly.|gloss,rendering|transliterated,transliteration
  `,
);

const worldLit = batch(
  "words-of-world-literature",
  ["Words of World Literature", "世界文学的词"],
  ["kinds and collections of literature", "文学的类型与汇编"],
  `
  canon|the body of works generally accepted as the most important in a field|经典(作品)|The novel has entered the ___ of world literature.|Critics argue about which writers belong in the ___.|Schools are widening the ___ to include more women writers.|anthology,compendium|canonical
  anthology|a published collection of poems, stories or other writings by different authors|选集，文集|The ___ includes poems from forty countries.|Her first story appeared in a student ___.|The teacher chose three essays from the ___.|canon,compendium|anthologies,anthologize
  picaresque|telling the adventures of a lovable rogue who travels from place to place|流浪汉小说的|The ___ novel follows a young thief across Spain.|Its ___ hero lives by his wits.|The film has a ___ structure of loosely linked episodes.|bildungsroman,novella|
  novella|a story longer than a short story but shorter than a novel|中篇小说|The ___ can be read in a single afternoon.|Her ___ won a prize for short fiction.|Some of the best Russian fiction takes the form of the ___.|anthology,epigraph|novellas
  bildungsroman|a novel about a young person's growth and education into adulthood|成长小说|The ___ follows its heroine from childhood to marriage.|Many first novels are a kind of ___.|The ___ ends when the hero finally understands himself.|picaresque,novella|
  laureate|a person given an honor for outstanding achievement, especially in literature|获奖者，桂冠诗人|The Nobel ___ gave a short speech about his village.|She was named the national poet ___.|Every ___ receives a medal and a prize.|fabulist,canon|laureates
  compendium|a collection of information on a subject, gathered in one book|概要，汇编|The book is a ___ of folk tales from the region.|A ___ of facts about birds sat on the shelf.|The scholar spent ten years on her ___.|anthology,canon|compendiums
  epigraph|a short quotation at the start of a book or chapter that suggests its theme|题词，卷首引语|The novel's ___ comes from an old ballad.|Each chapter opens with an ___ from a famous letter.|Read the ___ before you begin; it hints at the ending.|novella,laureate|epigraphs
  fabulist|a person who writes fables or tells invented stories|寓言作家|The ___ gave her animals human weaknesses.|Like an ancient ___, he ends each tale with a lesson.|Critics called the writer a modern ___.|laureate,picaresque|fabulists
  palimpsest|something that has been changed again and again but still shows traces of its earlier forms|重写本；层层叠加、仍留旧痕之物|The old city is a ___ of streets laid over older streets.|Scribes scraped the page and wrote over it, making a ___.|The novel is a ___ of the many stories that came before it.|canon,epigraph|palimpsests
  `,
);

const risk = batch(
  "words-of-risk-and-uncertainty",
  ["Words of Risk and Uncertainty", "风险与不确定性的词"],
  ["measuring and preparing for danger", "衡量和防范危险"],
  `
  contingency|a possible future event that one must plan for|意外事件，可能发生的情况|The army had a plan for every ___.|We kept money aside for any ___.|A good ___ plan tells everyone what to do if the power fails.|precaution,threshold|contingencies
  precaution|an action taken in advance to prevent harm|预防措施|As a ___, the school closed during the storm.|Wear a helmet as a simple ___.|Every ___ was taken, but the fire still spread.|contingency,hedge|precautions,precautionary
  likelihood|the chance that something will happen|可能性|The ___ of rain tomorrow is high.|What is the ___ that the bridge will fail?|Training reduces the ___ of injury.|probabilistic,threshold|
  volatile|likely to change suddenly and without warning|不稳定的，易变的|Oil prices are ___ and hard to predict.|The ___ situation could turn violent at any moment.|He has a ___ temper.|precarious,foreseeable|volatility
  precarious|not safe or secure; likely to fall or fail|不稳定的，岌岌可危的|The climber stood on a ___ ledge.|Many families live in ___ housing.|The company's finances are ___.|volatile,foreseeable|precariously
  actuarial|having to do with calculating risks, especially for insurance|精算的|___ tables show how long people of each age are likely to live.|The insurer did an ___ study of flood claims.|An ___ expert set the price of the policy.|probabilistic,likelihood|actuary
  threshold|the level at which something begins to happen or take effect|门槛，临界值|Pollution passed the safety ___ on six days.|The ___ for a tax is an income of 10,000 dollars.|Pain has a different ___ for every person.|contingency,likelihood|thresholds
  foreseeable|able to be known or expected in advance|可预见的|The accident was ___ and should have been prevented.|There will be no change in the ___ future.|The harm was not ___ when the drug was approved.|volatile,precarious|unforeseeable
  hedge|something that protects against loss, especially money|防范(损失)的手段|Gold is often bought as a ___ against inflation.|Insurance is a ___ against bad luck.|Planting several crops is a ___ against a poor harvest.|precaution,contingency|hedges,hedging
  probabilistic|based on chance or on what is likely, rather than certain|概率性的|Weather forecasts are ___, not certain.|A ___ model predicts how many floods to expect.|Courts are wary of purely ___ evidence.|actuarial,likelihood|probabilistically
  `,
);

const crisis = batch(
  "words-of-crisis-and-response",
  ["Words of Crisis and Response", "危机与应对的词"],
  ["disasters and how people meet them", "灾难及人们如何应对"],
  `
  catastrophe|a sudden event that causes great damage or suffering|大灾难|The flood was the worst ___ in the town's history.|Quick action prevented a ___.|The oil spill was an environmental ___.|cataclysm,fallout|catastrophes,catastrophic
  cataclysm|a violent event that causes great change or destruction|剧变，大灾难|The war was a ___ that changed the map of Europe.|Scientists believe a ___ ended the age of the dinosaurs.|The village never recovered from the ___.|catastrophe,onset|cataclysms,cataclysmic
  containment|the act of keeping something harmful under control so that it cannot spread|遏制，控制|___ of the fire took three days.|The plan for ___ of the disease began at the airports.|Workers built a ___ wall around the leaking tank.|cordon,rationing|
  mobilize|to organize people or resources for action|动员，调动|The city began to ___ volunteers to fill sandbags.|It takes days to ___ an army.|Charities moved fast to ___ supplies.|escalate,cordon|mobilized,mobilization
  fallout|the bad results of an event, or radioactive dust after a nuclear blast|(不良)后果，放射性尘埃|The political ___ from the scandal lasted for years.|Radioactive ___ spread across the region.|The bank's collapse had a long economic ___.|catastrophe,stopgap|
  stopgap|a temporary solution used until something better is ready|权宜之计|The tents were only a ___ until new houses were built.|Borrowing money is a ___, not a cure.|The new law is a ___ measure.|containment,rationing|stopgaps
  rationing|controlling how much of something each person may have when it is scarce|定量配给|During the war, ___ limited each family to one egg a week.|Water ___ began after the third dry summer.|___ of fuel caused long lines at the pumps.|stopgap,containment|rationed
  escalate|to become, or make something become, greater, worse or more serious|升级，加剧|The protest began to ___ into a riot.|Leaders tried not to ___ the conflict.|Costs began to ___ as the work went on.|mobilize,onset|escalated,escalation
  cordon|a line of police, soldiers or barriers placed around an area to keep people out|警戒线|Police set up a ___ around the burning building.|Reporters waited behind the ___.|A ___ of soldiers surrounded the palace.|containment,mobilize|cordons,cordoned
  onset|the beginning of something, especially something bad|(不好的事的)开始，发作|The ___ of winter brought new hardship.|Doctors watched for the ___ of fever.|At the ___ of the crisis, no one knew what to do.|cataclysm,escalate|
  `,
);

const academic10 = batch(
  "academic-words-10",
  ["Academic Words 10", "学术词汇 10"],
  ["writing about what is basic, widespread and related", "论述本质、普遍与相关"],
  `
  preclude|to prevent something from happening or make it impossible|排除，阻止|Lack of money may ___ further research.|His injury will ___ him from playing.|The rules ___ any change after the vote.|ascertain,concomitant|precluded,precludes
  ascertain|to find out something for certain|查明，确定|Police tried to ___ the cause of the fire.|We must ___ whether the data are accurate.|It was hard to ___ who had written the letter.|preclude,inherent|ascertained
  concomitant|happening together with something else, often as a result|伴随的|Fame and its ___ pressures changed her.|The war brought a ___ rise in prices.|Rapid growth has ___ risks.|intrinsic,pervasive|concomitantly
  intrinsic|belonging to the basic nature of something|固有的，本质的|Gold has little ___ value; we give it value.|Curiosity is ___ to childhood.|The ___ interest of the subject kept students reading.|extrinsic,inherent|intrinsically
  extrinsic|coming from outside rather than from within|外在的，外来的|Grades are an ___ reward for learning.|___ factors such as weather affected the results.|She studies for ___ reasons, not for love of the subject.|intrinsic,idiosyncratic|extrinsically
  pervasive|spreading widely through every part of something|遍布的，无处不在的|Fear was ___ in the occupied city.|The smell of smoke was ___.|Phones have a ___ influence on teenage life.|concomitant,commensurate|pervasively
  commensurate|matching in size, amount or degree|相称的，相当的|Pay should be ___ with experience.|The punishment was not ___ with the crime.|She was given a role ___ with her skills.|pervasive,heuristic|
  heuristic|a simple rule that helps someone solve a problem or decide quickly|启发法，经验法则|"Trust your first answer" is a common test-taking ___.|The ___ works most of the time but not always.|Doctors use a quick ___ to sort patients.|idiosyncratic,ascertain|heuristics
  inherent|existing as a natural or permanent part of something|内在的，固有的|Every investment carries an ___ risk.|The plan has an ___ flaw.|Some danger is ___ in climbing mountains.|intrinsic,concomitant|inherently
  idiosyncratic|peculiar to one person or thing; unusual|特有的，怪癖的|The writer's ___ spelling confused the printers.|His ___ way of dressing made him easy to spot.|The results were ___ and could not be repeated.|extrinsic,heuristic|idiosyncrasy
  `,
);

const academic11 = batch(
  "academic-words-11",
  ["Academic Words 11", "学术词汇 11"],
  ["writing about claims, conditions and effects", "论述主张、条件与效果"],
  `
  contingent|depending on something else that may or may not happen|视情况而定的|The deal is ___ on the board's approval.|Her place at the college is ___ on her final grades.|Success is ___ on good weather.|provisional,predicated|
  efficacy|the ability to produce the result that is wanted|功效，效力|Tests showed the ___ of the new vaccine.|Doctors doubt the ___ of the treatment.|The ___ of the policy is hard to measure.|requisite,germane|efficacious
  ameliorate|to make a bad situation better|改善，改进|New laws tried to ___ conditions in the factories.|Food aid helped ___ the famine.|Better lighting may ___ safety on the streets.|tantamount,ostensible|ameliorated,amelioration
  provisional|arranged for the present time and likely to change|临时的，暂定的|The results are ___ until all votes are counted.|A ___ government ruled after the revolution.|She gave her ___ agreement.|contingent,unequivocal|provisionally
  unequivocal|completely clear and leaving no doubt|明确的，毫不含糊的|Her answer was an ___ no.|The study gives ___ evidence of harm.|The board gave its ___ support.|provisional,ostensible|unequivocally
  tantamount|equal in effect or meaning to something else, usually something bad|等同于(坏事)的|Silence was ___ to agreement.|The new rule is ___ to a ban.|Refusing the offer was ___ to surrender.|ameliorate,germane|
  predicated|based on a belief or an idea|基于，以……为前提|The plan is ___ on cheap energy.|Her argument is ___ on a false assumption.|The forecast was ___ on steady growth.|contingent,requisite|predicate
  germane|relevant to the subject being discussed|有关的，切题的|That detail is not ___ to the case.|Keep your questions ___ to the topic.|The judge allowed only ___ evidence.|requisite,tantamount|
  requisite|needed for a particular purpose|必需的，必要的|She lacked the ___ skills for the job.|Applicants must have the ___ number of credits.|The ___ forms were signed and stamped.|germane,efficacy|requisites
  ostensible|appearing or claimed to be true, but perhaps not really so|表面上的，假称的|The ___ reason for the trip was business.|Their ___ aim was peace, but they prepared for war.|His ___ friendship hid a plan to cheat her.|unequivocal,ameliorate|ostensibly
  `,
);

/** batchesB are the batches of the later units of grade 12. */
export const batchesB: readonly BatchSpec[] = [translation, worldLit, risk, crisis, academic10, academic11];
