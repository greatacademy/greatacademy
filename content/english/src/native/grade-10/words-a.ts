// Grade 10: the batches of words of the first units, from argument and reasoning and the devices of poems to
// ambition, loyalty and guilt, war and memory, and the natural world.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const reasoning = batch(
  "words-of-argument-and-reasoning",
  ["Words of Argument and Reasoning", "论证与推理的词"],
  ["how an argument reasons", "论证的推理方式"],
  `
  axiom|a statement accepted as true without proof, used as a starting point|公理，不言自明的道理|It is an ___ of geometry that two points make a line.|"Know yourself" was an ___ of the ancient world.|She built her argument on one simple ___.|syllogism,corollary|axioms,axiomatic
  inference|a conclusion reached by reasoning from evidence|推论，推断|From the muddy boots, the detective drew the ___ that the man had walked in the rain.|Your ___ goes further than the facts allow.|Readers must make an ___ about why the character lies.|corollary,conjecture|inferences
  corollary|an idea that follows naturally from another idea already accepted|必然结果，推论|If all citizens are equal, a ___ is that all must obey the same laws.|Higher prices were a ___ of the shortage.|The ___ of her rule is that no one may vote twice.|syllogism,inference|corollaries
  syllogism|an argument in which a conclusion follows from two premises|三段论|"All men die; Socrates is a man; so Socrates dies" is a ___.|Each step of the ___ must be true for the conclusion to hold.|The lawyer laid out her case like a ___.|axiom,inference|syllogisms
  specious|seeming reasonable at first but actually false|似是而非的，貌似有理的|The ad's ___ claim fooled many buyers.|His excuse was ___; it fell apart under questions.|Do not be taken in by ___ reasoning.|fallacious,untenable|speciously
  fallacious|based on a false idea or faulty reasoning|谬误的，错误的|The claim that cold weather causes colds is ___.|His ___ argument confused cause with coincidence.|Critics pointed out the ___ logic of the ad.|specious,untenable|fallaciously
  untenable|impossible to defend against attack or criticism|站不住脚的，无法辩护的|Once the photos appeared, his story became ___.|The old theory is now ___.|She found herself in an ___ position.|fallacious,specious
  equivocate|to use unclear language on purpose to avoid giving a direct answer|含糊其词，模棱两可|When asked if he had read the report, the minister began to ___.|Don't ___; just tell us yes or no.|Politicians often ___ on hard questions.|caveat,conjecture|equivocated,equivocation
  caveat|a warning that a statement has limits or conditions|警告，附加说明|The study came with a ___: it tested only twenty people.|Add a ___ to your claim if the evidence is thin.|With one ___, the plan sounds good.|axiom,conjecture|caveats
  conjecture|an opinion formed without enough evidence; a guess|推测，猜想|Without the letters, any account of his motives is ___.|The report mixes fact with ___.|Scientists tested the ___ for years before it was proved.|inference,axiom|conjectures,conjectural
  `,
);

const devices = batch(
  "words-for-poetic-devices",
  ["Words for Poetic Devices", "诗歌手法的词"],
  ["the devices poets use", "诗人运用的手法"],
  `
  synecdoche|a figure of speech in which a part stands for the whole, as "hands" for workers|提喻|"All hands on deck" is a ___ for all sailors.|Calling a car "wheels" is a ___.|The poet's ___ "a sea of faces" turns people into parts.|metonymy,apostrophe
  caesura|a pause in the middle of a line of poetry|诗行中的停顿|A comma in the middle of the line creates a ___.|The ___ makes the reader stop and think.|Old English poems split each line with a ___.|metonymy,anaphora|caesuras
  metonymy|a figure of speech in which a thing is named by something closely linked to it, as "the crown" for a king|转喻|"The pen is mightier than the sword" uses ___.|"Washington announced" is a ___ for the government.|Calling the press "Fleet Street" is ___.|synecdoche,chiasmus
  anaphora|the repetition of a word or phrase at the start of several lines or sentences|首语重复|"We shall fight on the beaches, we shall fight in the fields" uses ___.|The ___ of "I have a dream" gives the speech its power.|The poet's ___ builds a feeling of urgency.|consonance,assonance
  assonance|the repetition of vowel sounds in nearby words|元音韵，半谐音|"The rain in Spain stays mainly in the plain" is full of ___.|Long *o* sounds create ___ in the line "go slow over the road."|The ___ gives the line a soft music.|consonance,anaphora
  consonance|the repetition of consonant sounds, especially at the ends of nearby words|辅音韵|"Pitter patter" uses ___ of the *t* sound.|The ___ in "blank and think" links the two words.|Hard *k* sounds create a harsh ___.|assonance,chiasmus
  chiasmus|a pattern in which words or ideas are repeated in reverse order|交错配列|"Ask not what your country can do for you; ask what you can do for your country" is a ___.|"Fair is foul, and foul is fair" is a famous ___.|The ___ makes the line easy to remember.|anaphora,volta
  apostrophe|speaking directly to someone absent or dead or to a thing, as if it could hear|呼语，顿呼|"O Death, where is thy sting?" is an example of ___.|In the poem, the speaker addresses the moon in an ___.|An ___ to the sea opens the poem.|anaphora,volta|apostrophes
  volta|the turn in thought or feeling in a poem, especially a sonnet|(十四行诗中的)转折|In a sonnet, the ___ often comes at line nine.|After the ___, the poem's mood darkens.|The word "but" signals the ___.|caesura,chiasmus
  sibilance|the repetition of *s* and *sh* sounds in nearby words|咝音，齿擦音重复|"The silken, sad, uncertain rustling" is full of ___.|___ gives the line a whispering sound.|The poet uses ___ to suggest the sea.|assonance,consonance
  `,
);

const ambition = batch(
  "words-of-ambition-and-tyranny",
  ["Words of Ambition and Tyranny", "野心与暴政的词"],
  ["ambition and the abuse of power", "野心与滥用权力"],
  `
  megalomania|an obsession with one's own power and importance|自大狂，权力狂|The king's ___ led him to build statues of himself everywhere.|Critics accused the dictator of ___.|His ___ grew with every victory.|hegemony,oligarchy|megalomaniac
  hegemony|dominance of one group or nation over others|霸权，支配地位|The empire held ___ over the whole region for a century.|The two powers struggled for ___.|Cultural ___ spreads one way of life.|oligarchy,megalomania
  oligarchy|government by a small group of powerful people|寡头政治|The city was ruled by an ___ of rich merchants.|The revolution ended the ___.|In an ___, a few families hold all the power.|hegemony,imperious|oligarchies,oligarch
  imperious|acting as if one expects to be obeyed without question|专横的，傲慢的|The duchess gave orders in an ___ voice.|His ___ manner made enemies.|With an ___ wave, she dismissed the servants.|benevolent,ruthless|imperiously
  ruthless|having no pity; cruel in getting what one wants|无情的，残忍的|The ___ general burned every village in his path.|She was ___ in removing her rivals.|A ___ ambition drives the hero to murder.|depose,benevolent|ruthlessly,ruthlessness
  depose|to remove a ruler from power by force|废黜，罢免|The army moved to ___ the king.|The rebels hoped to ___ the dictator.|Once the generals ___ the king, who will rule?|insatiable,abdicate|deposed
  abdicate|to give up a throne or a duty|退位，放弃(责任)|The king chose to ___ rather than fight a war.|A parent cannot ___ the duty to care for a child.|She refused to ___ her responsibility.|depose,insatiable|abdicated,abdication
  insatiable|impossible to satisfy|贪得无厌的，无法满足的|His ___ hunger for power ruined him.|The child had an ___ curiosity.|The empire's ___ appetite for land led to war.|ruthless,overweening|insatiably
  overweening|showing too much pride or confidence|傲慢的，过于自负的|Her ___ pride made her ignore all advice.|The general's ___ ambition led to his fall.|He spoke with ___ confidence.|insatiable,benevolent
  benevolent|kind and wishing to do good|仁慈的，善意的|The ___ queen opened her granaries to the poor.|A ___ ruler may still make mistakes.|He took a ___ interest in his workers.|megalomania,ruthless|benevolence,benevolently
  `,
);

const loyalty = batch(
  "words-of-loyalty-and-betrayal",
  ["Words of Loyalty and Betrayal", "忠诚与背叛的词"],
  ["loyalty and betrayal", "忠诚与背叛"],
  `
  turncoat|a person who leaves one side and joins the other|叛徒，变节者|The ___ led the enemy through the secret pass.|The soldiers called him a ___.|Nobody trusts a ___.|renegade,confidant|turncoats
  collude|to work together secretly to cheat or deceive others|勾结，串通|The two companies ___ to fix prices.|The guards were found to ___ with the smugglers.|It is illegal for bidders to ___.|subterfuge,duplicity|colluded,collusion
  perfidy|deliberate betrayal of trust|背信弃义|The ally's ___ cost them the war.|She could not forgive her friend's ___.|History remembers the general's ___.|treachery,duplicity|perfidious
  treachery|the act of betraying someone who trusted you|背叛，变节|The king was murdered by an act of ___.|The ___ of his closest friend broke his heart.|The play is full of plots and ___.|subterfuge,duplicity|treacherous
  duplicity|deceiving people by saying one thing and doing another|口是心非，欺骗|Her ___ was revealed when the letters were found.|The spy's ___ fooled both governments.|Iago's ___ destroys Othello.|treachery,subterfuge|duplicitous
  subterfuge|a trick used to hide one's real purpose|诡计，托词|She used a clever ___ to get past the guards.|By ___, the spy gained the general's trust.|His illness was a ___ to avoid the trip.|duplicity,treachery
  staunch|loyal, firm and committed|坚定的，忠实的|She is a ___ supporter of the arts.|The senator was a ___ ally of the president.|Even his most ___ friends began to doubt him.|renegade,fickle|staunchly
  fickle|changing loyalties or feelings often and without reason|反复无常的，易变的|The ___ crowd cheered the hero one day and booed him the next.|Fortune is ___.|He was too ___ to keep a friend for long.|staunch,renegade
  renegade|a person who deserts and betrays a group or cause|叛徒，背叛者|The ___ soldier joined the enemy.|The party expelled the ___ members.|She was seen as a ___ by her old friends.|confidant,turncoat|renegades
  confidant|a trusted friend to whom you tell secrets|知己，密友|Horatio is Hamlet's only true ___.|She was the queen's closest ___.|Every hero needs a ___.|renegade,turncoat|confidants
  `,
);

const guilt = batch(
  "words-of-guilt-and-conscience",
  ["Words of Guilt and Conscience", "罪疚与良知的词"],
  ["guilt and the conscience", "罪疚与良知"],
  `
  compunction|a feeling of guilt that stops or follows a wrong act|内疚，良心不安|He lied without the slightest ___.|She felt a pang of ___ for breaking the promise.|The thief had no ___ about taking the old man's savings.|contrition,penance
  contrition|sorrow for having done wrong, with a wish to make up for it|悔悟，痛悔|His letter was full of ___.|True ___ means changing your behavior.|She bowed her head in ___.|complicit,culpable|contrite
  culpable|deserving blame for something wrong|应受责备的，有罪的|The company was ___ for the spill.|Everyone who stayed silent is partly ___.|The court found him ___ of neglect.|complicit,absolve|culpability
  complicit|involved with others in a wrong act|同谋的，串通的|By keeping quiet, the guards became ___ in the crime.|She refused to be ___ in the cover-up.|Anyone who helped is ___.|culpable,absolve|complicity
  absolve|to declare someone free from guilt or blame|赦免，免除(罪责)|The judge refused to ___ the officer.|Nothing can ___ him of that choice.|Only the victim can ___ him of the wrong.|penance,exonerate|absolved,absolution
  exonerate|to show officially that someone is not to blame|宣告无罪，免除罪责|DNA evidence helped ___ the prisoner.|The report will ___ the pilot.|Nothing could ___ him in the eyes of the town.|vindicate,absolve|exonerated
  penance|an act done to show sorrow for a wrong|赎罪，忏悔(行为)|As a ___, he walked barefoot to the shrine.|She saw the long night shift as ___.|The knight's ___ was a year of silence.|vindicate,recant
  vindicate|to show that someone who was blamed or doubted was right|证明……正确，为……辩白|History will ___ her decision.|The new evidence ___ the scientist.|He felt ___ when the bridge held.|exonerate,recant|vindicated,vindication
  recant|to say publicly that one no longer holds a belief one once held|公开放弃(信仰或主张)|Galileo was forced to ___ his views.|The witness refused to ___ her statement.|Under pressure, he ___ everything he had said.|vindicate,absolve|recanted
  expiate|to make amends for a sin or a wrong|抵偿，赎(罪)|The hero sets out to ___ his crime.|No gift could ___ such cruelty.|He tried to ___ his guilt through good works.|absolve,compunction|expiation
  `,
);

const war = batch(
  "words-of-war-and-conflict",
  ["Words of War and Conflict", "战争与冲突的词"],
  ["war and its costs", "战争及其代价"],
  `
  belligerent|hostile and eager to fight; also, a nation at war|好战的；交战国|His ___ tone started the argument.|Both ___ nations signed the treaty.|The ___ dog barked at every stranger.|pacifist,conscript|belligerence
  armistice|an agreement to stop fighting, usually for a time|停战，停战协定|The ___ was signed at eleven o'clock in the morning.|Both sides kept the ___ for a month.|November 11 marks the ___ of 1918.|insurgency,attrition|armistices
  attrition|the slow wearing down of an enemy by constant attack and loss|消耗，损耗|The war became one of ___, with no side advancing.|___ wore down the army more than any battle.|The team's ___ of players left them weak.|armistice,carnage
  carnage|the killing of many people|大屠杀，残杀|The poet describes the ___ of the trenches.|Reporters were shocked by the ___.|The battle ended in terrible ___.|attrition,devastation
  conscript|a person forced by law to join the armed forces|应征入伍者|The young ___ had never held a rifle.|Each ___ was given a uniform and a rifle.|The army had to ___ farmers in the last year of the war.|veteran,pacifist|conscripts,conscription
  pacifist|a person who believes that war and violence are always wrong|和平主义者|The ___ refused to fight and was sent to prison.|As a ___, she marched against every war.|A ___ may still serve as a medic.|belligerent,conscript|pacifists,pacifism
  insurgency|an armed rebellion against a government|叛乱，暴动|The ___ spread from the mountains to the cities.|The government struggled to end the ___.|Local farmers joined the ___.|armistice,reprisal
  reprisal|an act of revenge against an enemy|报复，报复行动|The village was burned in ___ for the ambush.|Fear of ___ kept witnesses silent.|The attack brought a swift ___.|armistice,insurgency|reprisals
  devastation|great destruction or damage|毁灭，破坏|The ___ of the city shocked the world.|Photographs showed the ___ after the bombing.|The flood left ___ across the valley.|carnage,attrition|devastate,devastating
  veteran|a person who has served in a war or the armed forces|老兵，退伍军人|The ___ spoke to the class about the war.|Her grandfather is a ___ of two wars.|An old ___ led the parade.|conscript,pacifist|veterans
  `,
);

const memory = batch(
  "words-of-memory-and-witness",
  ["Words of Memory and Witness", "记忆与见证的词"],
  ["remembering and bearing witness", "记忆与见证"],
  `
  lament|to express deep sorrow; a song or poem of sorrow|哀悼；挽歌|The village ___ its lost sons.|She sang an old ___ for the dead.|Many poets ___ the passing of youth.|requiem,remembrance|lamented,lamentation
  reminiscence|a story told about something remembered from the past|回忆，追忆|The old soldier's ___ kept us listening for hours.|The book is a ___ of her childhood in Cairo.|Each ___ brought back a lost friend.|remembrance,vestige|reminiscences
  memorialize|to keep the memory of someone alive through a monument or work|纪念，追念|The poem tries to ___ the soldiers of the battle.|The town chose to ___ its founders with a park.|She wrote a song to ___ her brother.|atrocity,obliterate|memorialized
  atrocity|an extremely cruel and violent act|暴行|The ___ was reported by a single journalist.|The world must not forget such an ___.|She survived an ___ that killed her family.|oblivion,obliterate|atrocities
  obliterate|to destroy completely, leaving no trace|彻底毁掉，抹去|The bombs could ___ the old town in a night.|Time cannot ___ such memories.|A flood can ___ every sign of a road.|oblivion,vestige|obliterated
  oblivion|the state of being completely forgotten|遗忘，湮没|The poet's name fell into ___.|The village sank into ___ after the war.|Without records, these stories would pass into ___.|remembrance,vestige
  vestige|a small trace of something that once existed|遗迹，残余|A broken wall is the only ___ of the old castle.|Not a ___ of fear remained in her voice.|The custom is a ___ of an older time.|oblivion,cenotaph|vestiges
  remembrance|the act of remembering someone, especially those who have died|纪念，悼念|A minute of silence was held in ___.|The poppies are a sign of ___.|They planted a tree in ___ of their teacher.|reminiscence,requiem
  requiem|a piece of music or a service for the dead|安魂曲，追思弥撒|The choir sang a ___ for the soldiers.|Mozart died before finishing his ___.|The poem reads like a ___ for a lost city.|lament,cenotaph|requiems
  cenotaph|a monument to people buried somewhere else, especially soldiers|纪念碑(衣冠冢)|Wreaths were laid at the ___.|The ___ lists the names of the town's dead.|The children walked past the ___ in silence.|vestige,requiem|cenotaphs
  `,
);

const ecology = batch(
  "words-of-ecology-and-climate",
  ["Words of Ecology and Climate", "生态与气候的词"],
  ["ecosystems and the climate", "生态系统与气候"],
  `
  ecology|the study of how living things relate to each other and their surroundings|生态学|She studied the ___ of coral reefs.|The new road changed the ___ of the valley.|___ teaches that every species matters.|biosphere,fauna|ecological,ecologist
  biosphere|the parts of the earth where life exists|生物圈|The ___ includes oceans, soils and air.|Pollution threatens the whole ___.|Our ___ is the only one we know.|ecology,flora
  deforestation|the cutting down of large areas of forest|砍伐森林|___ is shrinking the orangutan's home.|Floods worsened after years of ___.|Satellite photos reveal the scale of ___.|emissions,pollutant
  pollutant|a substance that makes air, water or land dirty and harmful|污染物|Lead is a dangerous ___.|The factory released a ___ into the river.|Each ___ is measured by the city.|emissions,invasive|pollutants
  fauna|the animals of a particular place or time|动物群|The island's ___ includes rare lizards.|Scientists listed the ___ of the cave.|Arctic ___ are adapted to the cold.|flora,ecology
  emissions|gases or other substances sent into the air|排放物，排放|Cars produce harmful ___.|The factory cut its ___ by half.|Carbon ___ warm the planet.|flora,exacerbate|emission
  flora|the plants of a particular place or time|植物群|The desert's ___ blooms after rain.|She photographed the alpine ___.|The ___ of the island is unlike any other.|fauna,biosphere
  exacerbate|to make a problem worse|使恶化，加剧|Cutting forests will ___ the drought.|His angry comments will ___ the conflict.|Heat can ___ air pollution.|invasive,replenish|exacerbated
  invasive|spreading fast and harming the plants and animals already there|入侵的|The ___ weed choked the native plants.|Rats are an ___ species on the island.|___ fish crowded out the local trout.|pollutant,fauna
  replenish|to fill something up again|补充，重新装满|Rain will ___ the lakes.|The farmers rest the land to ___ the soil.|She stopped to ___ her water bottle.|ecology,biosphere|replenished
  `,
);

const landscapes = batch(
  "words-of-landscapes-and-weather",
  ["Words of Landscapes and Weather", "地貌与天气的词"],
  ["landscapes and weather", "地貌与天气"],
  `
  moor|a wide, open area of high land covered in rough grass|荒野，沼泽地|Mist rolled across the ___.|The hound howled on the dark ___.|Sheep graze on the ___.|fjord,crag|moors,moorland
  steppe|a large area of flat grassland without trees, especially in eastern Europe and Asia|干草原|Horsemen once ruled the ___.|The wind swept across the endless ___.|Herds of wild horses roam the ___.|fjord,escarpment|steppes
  fjord|a long, narrow inlet of the sea between high cliffs|峡湾|The ship sailed deep into the ___.|Norway's coast is cut by many a ___.|Cliffs rose straight from the waters of the ___.|ravine,moor|fjords
  escarpment|a long, steep slope or cliff at the edge of a plateau|陡坡，悬崖|The road climbs the ___ in tight curves.|From the top of the ___, the plain lies below.|Waterfalls pour over the ___.|humid,ravine|escarpments
  ravine|a deep, narrow valley with steep sides|峡谷，深谷|The hikers crossed the ___ on a rope bridge.|A stream ran at the bottom of the ___.|The car slid off the road into a ___.|escarpment,humid|ravines
  humid|warm and damp|潮湿的，湿热的|The ___ air made our clothes stick to us.|Jungles are hot and ___.|Summers in the south are long and ___.|sultry,crag
  crag|a steep, rough mass of rock|峭壁，危岩|An eagle nested on the ___.|The climbers rested beneath a ___.|A castle stood on the ___ above the sea.|escarpment,mesa|crags,craggy
  torrential|falling in large amounts very fast, like a flood|倾盆的，如注的|___ rain flooded the streets.|The ___ storm washed out the bridge.|Monsoon season brings ___ downpours.|mesa,sultry
  sultry|hot and humid in an uncomfortable way|闷热的|The ___ air made everyone sleepy.|It was a ___ evening in July.|A ___ wind blew from the south.|torrential,mesa
  mesa|a flat-topped hill with steep sides, common in deserts|平顶山，台地|The ___ rose red above the desert.|Ancient villages were built on top of the ___.|From the ___, we could see for miles.|crag,steppe|mesas
  `,
);

/** batchesA are the batches of words of the first units of grade 10. */
export const batchesA: readonly BatchSpec[] = [reasoning, devices, ambition, loyalty, guilt, war, memory, ecology, landscapes];
