// Grade 8: the batches of words of the last five units, from evolution and gothic tales to the stage, migration,
// right and wrong, politics and the words for talking about language.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const evolution = batch(
  "words-of-evolution",
  ["Words of Evolution", "进化的词"],
  ["evolution", "进化"],
  `
  fossilize|to turn into a fossil over a very long time|成为化石|Bones buried quickly in mud are more likely to ___.|Soft bodies rarely ___, so we know little about early worms.|It takes millions of years for wood to ___.|diverge,extinction|fossilized,fossilizes
  extinction|the dying out of a whole kind of living thing|灭绝|The ___ of the dinosaurs came about sixty-six million years ago.|Many frogs face ___ because their ponds are drying up.|Hunting drove the dodo to ___.|selection,lineage|extinctions
  naturalist|a person who studies plants and animals in nature|博物学家|The young ___ collected beetles in every field she crossed.|Darwin sailed on the Beagle as the ship's ___.|A ___ wrote careful notes on each bird he saw.|primate,hominid|naturalists
  finch|a small songbird with a short, thick beak for cracking seeds|雀科鸣鸟|Each ___ on the islands had a beak shaped for its food.|A ___ landed on the feeder and cracked open a seed.|Darwin noticed that the ___ on one island differed from those on the next.|primate,fossilize|finches
  archipelago|a group of islands|群岛|The Galápagos are an ___ in the Pacific Ocean.|Ships sailed slowly through the ___, from one island to the next.|Indonesia is the largest ___ in the world.|lineage,fossilize|archipelagos
  diverge|to separate and go in different directions, or to become different|分化，分歧|Over many generations, the two groups of birds began to ___.|The paths ___ at the old oak tree.|When populations are cut off from each other, their features slowly ___.|fossilize,selection|diverges,diverged,divergence
  lineage|the line of ancestors from which a person, animal or plant comes|血统，世系|Scientists traced the whale's ___ back to animals that lived on land.|Her family's ___ goes back to a fishing village.|The horse's ___ includes a small animal the size of a dog.|extinction,selection|lineages
  hominid|any member of the family that includes humans and the great apes and their extinct relatives|人科动物|The skull belonged to an early ___ that walked upright.|Every ___ shares a common ancestor.|Footprints of a ___ were found in hardened ash.|primate,naturalist|hominids
  primate|a member of the group of animals that includes monkeys, apes and humans|灵长类动物|A gorilla is the largest ___.|Like any ___, a lemur has hands that can grip.|The zoo's ___ house has chimpanzees and gibbons.|hominid,finch|primates
  selection|the process by which living things better suited to their surroundings survive and have more young|选择（自然选择）|Natural ___ explains how the finches' beaks changed.|Through ___, moths with darker wings became common in sooty cities.|Darwin's idea of ___ shocked many readers.|extinction,lineage
  `,
);

const classifying = batch(
  "words-of-classifying-life",
  ["Words of Classifying Life", "生物分类的词"],
  ["sorting living things", "生物分类"],
  `
  taxonomy|the science of naming and sorting living things into groups|分类学|Linnaeus created the system of ___ that scientists still use.|In ___, every species has a two-part Latin name.|The new beetle did not fit anywhere in the ___.|genus,phylum
  genus|a group of closely related species; the first part of a scientific name|属|Lions and tigers belong to the same ___, Panthera.|The name of the ___ is always written with a capital letter.|The fossil was placed in a new ___.|phylum,taxonomy|genera
  phylum|a large group of living things that share a basic body plan|门（生物分类）|Insects, spiders and crabs belong to the same ___.|A ___ is bigger than a class but smaller than a kingdom.|Every animal with a backbone is in one ___.|genus,taxonomy|phyla
  vertebrate|an animal with a backbone|脊椎动物|A frog is a ___, but a worm is not.|Every ___ has a skull to protect its brain.|Fish were the first ___ to appear in the sea.|invertebrate,mammal|vertebrates
  invertebrate|an animal without a backbone|无脊椎动物|An octopus is a clever ___.|A snail is an ___ with a soft body and a shell.|The pond was full of ___ life: beetles, snails and worms.|vertebrate,reptile|invertebrates
  mammal|an animal that has hair or fur and feeds its young on milk|哺乳动物|A whale breathes air because it is a ___.|Every ___ feeds its babies on milk.|The bat is the only ___ that can truly fly.|reptile,amphibian|mammals
  reptile|a cold-blooded animal with dry, scaly skin, such as a snake or lizard|爬行动物|A crocodile is the largest living ___.|A ___ lays eggs with tough, leathery shells.|The lizard warmed itself on a rock, as any ___ must.|amphibian,mammal|reptiles
  amphibian|a cold-blooded animal that lives both in water and on land, such as a frog|两栖动物|A young ___ lives in water and breathes through gills.|The newt is an ___ that returns to the pond each spring.|An ___ can breathe through its moist skin.|reptile,vertebrate|amphibians
  hybrid|a plant or animal whose parents are of two different kinds|杂交种|A mule is a ___ of a horse and a donkey.|The farmer grew a ___ corn that resisted drought.|The ___ rose has the color of one parent and the scent of the other.|breed,genus|hybrids
  breed|a particular type of animal, especially one developed by people; to keep animals to produce young|品种；繁殖|The sheepdog is a ___ known for its intelligence.|Farmers chose to ___ only their strongest cows.|This ___ of chicken lays brown eggs.|hybrid,phylum|breeds,bred,breeding
  `,
);

const fossils = batch(
  "words-of-fossils-and-genes",
  ["Words of Fossils and Genes", "化石与基因的词"],
  ["fossils and genes", "化石与基因"],
  `
  eon|an extremely long period of time, the longest unit of geological time|亿万年，宙|Life on Earth began in an ___ long before the dinosaurs.|The rocks were shaped over an ___ of wind and water.|It seemed to take an ___ for the bus to arrive.|strata,genome|eons
  strata|layers of rock, one on top of another|地层|The canyon walls show ___ of red and yellow rock.|Older fossils lie in the deeper ___.|Geologists read the ___ like the pages of a book.|eon,genome|stratum
  geologic|relating to the study of the Earth's rocks and their history|地质的|The ___ record shows several great extinctions.|A ___ map shows the types of rock in an area.|Mountains rise over ___ time, not in a lifetime.|petrified,strata|geological
  genome|the complete set of genes of a living thing|基因组|Scientists read the whole human ___ in 2003.|A banana's ___ is surprisingly similar to ours in parts.|The ___ of the ancient wolf was pieced together from a bone.|chromosome,strata|genomes
  chromosome|a thread-like structure in a cell that carries the genes|染色体|Humans have forty-six of them; each ___ is a long strand of DNA.|A missing ___ can cause serious illness.|Each ___ comes in a pair, one from each parent.|genome,eon|chromosomes
  paleontologist|a scientist who studies fossils to learn about ancient life|古生物学家|The ___ brushed sand from the giant bone.|A ___ can tell from a tooth what an animal ate.|The ___ spent ten summers digging in the desert.|petrified,trilobite|paleontologists,paleontology
  trilobite|a sea animal with a hard, three-part shell that died out long before the dinosaurs|三叶虫|The ___ crawled along the sea floor five hundred million years ago.|She found a ___ in a piece of slate.|Each ___ had eyes made of tiny crystals.|mammoth,paleontologist|trilobites
  mammoth|a large, hairy kind of elephant that lived in the Ice Age; very large|猛犸象；巨大的|A ___ was found frozen in the Siberian ice.|Cave painters drew the ___ with long curved tusks.|Building the bridge was a ___ task.|trilobite,eon|mammoths
  excavate|to dig carefully to uncover something buried, such as fossils or ruins|发掘|The team will ___ the site next summer.|It took a month to ___ the whole skeleton.|Students helped to ___ the old village.|eon,petrified|excavated,excavates,excavation
  petrified|turned to stone over a very long time; also, extremely frightened|石化的；吓呆的|The ___ forest is full of trees turned to stone.|She was ___ when the lights went out.|A ___ log shows every ring of the tree it once was.|geologic,eon
  `,
);

const gloom = batch(
  "words-of-gloom-and-horror",
  ["Words of Gloom and Horror", "阴郁与恐怖的词"],
  ["gloom and horror", "阴郁与恐怖"],
  `
  macabre|disturbing because it is connected with death|恐怖的，与死亡有关的|The story has a ___ ending in a graveyard.|He had a ___ sense of humor.|The museum showed a ___ collection of old surgical tools.|morbid,grotesque
  foreboding|a strong feeling that something bad is going to happen|不祥的预感|A sense of ___ filled her as she opened the gate.|The dark clouds gave him a feeling of ___.|The story opens with an air of ___.|shudder,uncanny|forebodings
  grotesque|strange and ugly in a way that is frightening or shocking|怪诞的|___ stone faces stared down from the roof.|The mask was ___, with twisted teeth and huge eyes.|In the painting, the trees have ___ shapes.|ghastly,macabre
  ghastly|causing horror or fear; very pale and ill-looking|可怕的；苍白的|A ___ scream came from the cellar.|His face was ___ in the candlelight.|The crime was ___.|grotesque,gloomy
  gloomy|dark, or sad and without hope|阴暗的；忧郁的|The old house had long, ___ halls.|He felt ___ after hearing the news.|The ___ weather lasted all week.|dank,morbid
  uncanny|strange and hard to explain, in a way that is a little frightening|离奇的，神秘的|She had an ___ ability to guess what he was thinking.|The doll looked ___ like a real child.|There was an ___ silence in the forest.|foreboding,ghastly
  morbid|having a strong interest in death or unpleasant things|病态的，对死亡感兴趣的|He had a ___ fascination with old graveyards.|Her ___ jokes upset the guests.|The crowd's ___ curiosity drew them to the scene of the crash.|macabre,gloomy
  dank|unpleasantly cold and wet|阴冷潮湿的|They crept down into the ___ cellar.|A ___ smell rose from the well.|The prisoners lived in ___ cells under the castle.|gloomy,lurk
  shudder|to shake suddenly, especially from fear or cold|颤抖，战栗|She began to ___ when she heard the howl.|The thought made him ___.|The whole house seemed to ___ in the wind.|lurk,foreboding|shudders,shuddered
  lurk|to wait somewhere secretly, often to do something bad|潜伏|Something seemed to ___ behind the curtains.|Wolves ___ in the forest, waiting for dark.|Danger may ___ around any corner.|shudder,dank|lurks,lurked,lurking
  `,
);

const ghosts = batch(
  "words-of-ghosts-and-haunting",
  ["Words of Ghosts and Haunting", "鬼魂与闹鬼的词"],
  ["ghosts and haunted places", "鬼魂与闹鬼之地"],
  `
  spectral|like a ghost|幽灵般的|A ___ light glowed over the marsh.|The fog gave the trees a ___ look.|They heard ___ footsteps on the stairs.|phantom,apparition
  apparition|a ghost, or something strange that suddenly appears|幽灵，鬼魂|An ___ in white drifted across the lawn.|She was sure the ___ was her grandmother.|The ___ vanished when he lit the candle.|premonition,phantom|apparitions
  phantom|a ghost; something that seems real but is not|幽灵；幻影|A ___ ship is said to sail the bay on stormy nights.|He heard a ___ voice calling his name.|The ___ disappeared through the wall.|wraith,apparition|phantoms
  crypt|an underground room beneath a church, often used for burying people|地下墓室|The family is buried in the ___ under the chapel.|They carried candles down into the ___.|The ___ had not been opened for a hundred years.|mansion,haunt|crypts
  mansion|a very large and grand house|宅邸，大厦|The ___ on the hill had forty rooms.|No one had lived in the ___ for decades.|The ___ was built by a rich merchant.|crypt,haunt|mansions
  haunt|to appear in a place as a ghost; to stay in someone's mind and trouble them|（鬼魂）出没；萦绕心头|The ghost of the old captain is said to ___ the lighthouse.|Her mistake would ___ her for years.|Do you believe spirits ___ this castle?|spectral,crypt|haunts,haunted,haunting
  wraith|a ghost, especially a pale, thin one|幽灵，鬼魂|A thin ___ stood at the foot of his bed.|She looked like a ___ after her long illness.|The ___ drifted silently through the mist.|ghoul,specter|wraiths
  ghoul|an evil spirit said to rob graves; a person who enjoys things connected with death|食尸鬼|In the tale, a ___ crept out of the graveyard at midnight.|The ___ in the story eats the dead.|Children dressed as a ___ for the festival.|wraith,phantom|ghouls
  specter|a ghost; something frightening that may happen|幽灵；令人担忧的事|A ___ rose from the old well.|The ___ of war hung over the country.|He was haunted by the ___ of failure.|wraith,apparition|specters
  premonition|a feeling that something, usually bad, is going to happen|预感|She had a ___ that the ship would sink.|His ___ came true the next morning.|A strange ___ kept him from boarding the train.|apparition,specter|premonitions
  `,
);

const madness = batch(
  "words-of-madness-and-despair",
  ["Words of Madness and Despair", "疯狂与绝望的词"],
  ["madness and despair", "疯狂与绝望"],
  `
  wretched|very unhappy or ill; of very poor quality|悲惨的；极差的|The ___ prisoner had not eaten for days.|She felt ___ after the argument.|They lived in a ___ little hut.|gaunt,pallid
  gaunt|very thin, especially because of hunger, illness or worry|憔悴的，瘦削的|After the long winter, the horses were ___.|His face was ___ and his eyes were hollow.|A ___ old man opened the door.|pallid,ashen
  pallid|pale, in a way that looks unhealthy|苍白的|Her ___ face showed she had not slept.|The ___ light of the moon fell on the grave.|He looked ___ and weak.|ashen,gaunt
  ashen|very pale gray, often from shock or fear|灰白的，面如死灰|Her face turned ___ when she read the letter.|He came back ___ and shaking.|The sky was an ___ gray before the storm.|pallid,wretched
  frenzy|a state of wild excitement or uncontrolled activity|狂乱，疯狂|The crowd worked itself into a ___.|In a ___, he tore the room apart looking for the key.|The sharks fed in a ___.|delirium,hysteria|frenzies,frenzied
  madness|serious mental illness; very foolish behavior|疯狂，精神失常|The narrator insists that his ___ has sharpened his senses.|It would be ___ to sail in this storm.|The king's ___ grew worse each year.|obsession,frenzy
  delirium|a state of confused thinking caused by illness or fever|谵妄，神志不清|In her ___, she called out the names of people long dead.|High fever can cause ___.|He woke from his ___ and asked where he was.|frenzy,paranoia
  obsession|an idea or feeling that fills someone's mind so that they cannot stop thinking about it|痴迷，执念|His ___ with the old man's eye drove him to the crime.|Her ___ with winning cost her friends.|Collecting stamps became his ___.|madness,paranoia|obsessions,obsessive
  paranoia|an unreasonable belief that others are trying to harm you|偏执，多疑|His ___ made him lock every door three times.|She suffered from ___ and trusted no one.|In the story, the captain's ___ grows each night.|obsession,hysteria
  hysteria|uncontrolled fear, excitement or emotion, often in a crowd|歇斯底里|Rumors of a monster caused ___ in the village.|She laughed with ___ after the shock.|The ___ spread from one house to the next.|frenzy,delirium
  `,
);

const stage = batch(
  "words-of-the-elizabethan-stage",
  ["Words of the Elizabethan Stage", "伊丽莎白时代舞台的词"],
  ["the theater in Shakespeare's time and since", "莎士比亚时代及之后的戏剧"],
  `
  stagecraft|the skill of putting on a play: sets, lighting, movement and timing|舞台技巧|The director's ___ made the storm scene feel real.|She learned ___ by working backstage for years.|Good ___ lets the audience forget that they are in a theater.|blocking,backdrop
  backdrop|a painted cloth hung at the back of a stage; the setting in which something happens|背景幕；背景|The ___ showed a castle on a hill.|The war is the ___ of the whole novel.|Stagehands rolled down a new ___ between the acts.|footlights,stagecraft|backdrops
  footlights|a row of lights along the front of a stage floor|舞台脚灯|The actor stepped forward into the glow of the ___.|The ___ lit the actors' faces from below.|She had dreamed of the ___ since she was a child.|backdrop,matinee
  blocking|the planned movements and positions of actors on a stage|走位|The director spent the morning on ___ for the fight scene.|The ___ puts the two rivals at opposite ends of the stage.|Write the ___ in pencil, because it will change.|stagecraft,ensemble
  dramatist|a person who writes plays|剧作家|Shakespeare is the most famous ___ in English.|The young ___ sold her first play at twenty.|Each ___ of that age wrote for a particular company of actors.|tragedian,theatergoer|dramatists
  groundling|in Shakespeare's theater, a person who paid a penny to stand in the yard in front of the stage|（剧场）站票观众|A ___ could shout at the actors and throw nuts.|Each ___ stood in the open yard, rain or shine.|The jokes were written to make every ___ laugh.|theatergoer,matinee|groundlings
  matinee|a performance of a play or film in the afternoon|午后场|We went to the Saturday ___.|The ___ was full of schoolchildren.|Tickets for the ___ are cheaper than for the evening show.|footlights,ensemble|matinees
  ensemble|a group of actors, dancers or musicians who perform together|全体演员，合奏团|The whole ___ came out to bow at the end.|The play has no star; it is an ___ piece.|She joined a small ___ that toured the villages.|blocking,dramatist|ensembles
  theatergoer|a person who often goes to the theater|戏迷，常去剧院的人|The ___ waited outside the door for an hour.|A regular ___ can tell good acting at once.|Every ___ in London wanted a ticket.|groundling,tragedian|theatergoers
  tragedian|an actor who plays tragic roles, or a writer of tragedies|悲剧演员；悲剧作家|The great ___ played Hamlet more than a thousand times.|Sophocles was a ___ of ancient Athens.|The ___ wept real tears on stage.|dramatist,theatergoer|tragedians
  `,
);

const courts = batch(
  "words-of-courts-and-feuds",
  ["Words of Courts and Feuds", "宫廷与世仇的词"],
  ["royal courts and family feuds", "宫廷与家族世仇"],
  `
  jester|a person kept at a royal court to entertain with jokes and tricks|弄臣，小丑|The ___ was the only one allowed to mock the king.|In the play, the ___ speaks the wisest lines.|The ___ juggled apples at the feast.|friar,usurper|jesters
  doublet|a close-fitting jacket worn by men in the 1400s to 1600s|紧身上衣|The actor wore a velvet ___ and a short cape.|His ___ was buttoned to the throat.|A torn ___ lay on the floor after the fight.|rapier,potion|doublets
  usurper|a person who takes power or a position that does not belong to them|篡位者|The ___ killed the rightful king and took his crown.|The people never accepted the ___.|In the end, the ___ is defeated.|jester,villainy|usurpers,usurp
  villainy|very wicked behavior|恶行，邪恶|The audience hissed at each act of ___.|His ___ is revealed in the last act.|She refused to take part in such ___.|usurper,banish
  banish|to send someone away from a place as a punishment|放逐，驱逐|The prince decided to ___ him from the city forever.|To ___ a man was almost as harsh as to kill him.|She tried to ___ the thought from her mind.|duel,usurper|banished,banishes,banishment
  duel|a formal fight between two people with weapons, to settle a quarrel|决斗|The two men met at dawn to fight a ___.|The ___ ended when one of them dropped his sword.|He challenged his rival to a ___.|rapier,banish|duels,dueling
  rapier|a long, thin sword with a sharp point|长剑，细剑|He drew his ___ and stepped forward.|The ___ flashed in the torchlight.|A ___ was a gentleman's weapon.|doublet,duel|rapiers
  friar|a member of a religious order who lives a simple life and serves the poor|修士|The ___ agreed to marry the young couple in secret.|A kindly ___ gave them shelter for the night.|The ___ wore a simple brown robe tied with rope.|apothecary,jester|friars
  apothecary|a person who in the past made and sold medicines|药剂师|The ___ sold him a poison.|Jars of herbs lined the ___'s shelves.|The ___ mixed a powder for her fever.|friar,potion|apothecaries
  potion|a drink believed to have magical, medicinal or poisonous powers|药水，魔药|She drank the ___ and fell into a deep sleep.|The witch stirred a bubbling ___.|The ___ was meant to make him fall in love.|apothecary,doublet|potions
  `,
);

const migration = batch(
  "words-of-migration",
  ["Words of Migration", "移民的词"],
  ["leaving one's country", "离开祖国"],
  `
  emigrant|a person who leaves their own country to live in another|移民（移出者）|Each ___ carried only one suitcase.|As an ___, she missed the food of her childhood.|The ___ sailed from Naples to New York.|diaspora,displaced|emigrants
  emigrate|to leave your own country to live in another|移居国外|Her grandparents decided to ___ to Canada in 1955.|Millions chose to ___ during the famine.|He hoped to ___ once he had saved enough money.|assimilate,displaced|emigrated,emigrates,emigration
  asylum|protection given by a country to someone who has fled danger in their own|庇护|The writer asked for ___ after she was threatened at home.|The country granted ___ to the families fleeing the war.|His request for ___ was approved after a year.|visa,diaspora
  diaspora|people who have spread from their original homeland to many other places|散居族群，海外侨民|The Irish ___ lives on every continent.|Members of the ___ send money home each month.|The festival brings the ___ together.|homeland,emigrant|diasporas
  visa|an official mark in a passport that allows you to enter or stay in a country|签证|She needed a ___ to study abroad.|His ___ expired after six months.|The embassy refused to grant him a ___.|passport,asylum|visas
  passport|an official document that proves who you are and lets you travel to other countries|护照|Show your ___ at the border.|She lost her ___ and had to go to the embassy.|A new ___ lasts ten years.|visa,homeland|passports
  assimilate|to become part of a group or culture, or to make someone do so|同化，融入|Some newcomers chose to ___ quickly, while others kept their old ways.|Schools were expected to ___ immigrant children.|It took him years to ___ the customs of his new town.|emigrate,displaced|assimilated,assimilates,assimilation
  homeland|the country where someone was born or where their family came from|祖国，家乡|She dreamed of returning to her ___ one day.|The songs remind them of their ___.|He had not seen his ___ in forty years.|diaspora,emigrant|homelands
  displaced|forced to leave the place where you live|流离失所的|The flood left thousands of people ___.|Camps were set up for ___ families.|A ___ person may wait years to return home.|emigrate,persecution
  persecution|cruel or unfair treatment of people, especially because of their religion, race or beliefs|迫害|They fled ___ for their religion.|The ___ of writers drove many into exile.|Laws were passed to protect people from ___.|asylum,diaspora
  `,
);

const newLives = batch(
  "words-of-new-lives",
  ["Words of New Lives", "新生活的词"],
  ["starting a new life in a new country", "在新国家开始新生活"],
  `
  resettle|to move people to a new place to live|重新安置|The government helped ___ families from the flooded valley.|It took a year to ___ everyone from the camp.|They chose to ___ in a small town by the sea.|deport,naturalize|resettled,resettles,resettlement
  naturalize|to make someone from another country a citizen|使入籍|The state will ___ her after five years of residence.|To ___, you must pass a test on history and law.|He waited ten years to ___.|deport,resettle|naturalized,naturalizes,naturalization
  deport|to force someone to leave a country, usually because they have no legal right to be there|驱逐出境|The court ordered officials to ___ him.|They feared the police would ___ their father.|Officials may ___ anyone whose visa has run out.|resettle,naturalize|deported,deports,deportation
  ancestry|the people your family came from in the past|祖先，血统|She is proud of her Chinese ___.|He traced his ___ back to a Scottish farmer.|People of mixed ___ live in the city.|identity,belonging|ancestries
  newcomer|a person who has recently arrived somewhere|新来者|The ___ did not yet know anyone in the class.|The neighbors brought soup to welcome the ___.|As a ___, he found the winters hard.|settler,resettle|newcomers
  settler|a person who goes to live in a new country or area|定居者，移民|Each ___ was given a small piece of land.|The first ___ built a cabin by the river.|Life was hard for a ___ on the prairie.|newcomer,enclave|settlers
  belonging|the feeling of being accepted as part of a group or place|归属感|Joining the choir gave her a sense of ___.|Many immigrants struggle for years to find ___.|A feeling of ___ makes a new town feel like home.|identity,ancestry
  identity|who a person is, and what makes them different from others|身份，认同|Language is an important part of her ___.|His ___ was both Korean and American.|The story is about a girl searching for her ___.|belonging,ancestry|identities
  enclave|a part of a city where people of one culture or group live together|聚居区，飞地|The Chinese ___ had its own shops and newspapers.|She grew up in an Italian ___ of the city.|The ___ kept its language for three generations.|resettle,settler|enclaves
  remittance|money sent by a worker abroad to their family at home|汇款|Each month he sent a ___ to his mother.|The village school was built with ___ from abroad.|A ___ of fifty dollars fed the family for weeks.|ancestry,enclave|remittances
  `,
);

const diplomacy = batch(
  "words-of-diplomacy",
  ["Words of Diplomacy", "外交的词"],
  ["diplomacy and government", "外交与政府"],
  `
  ambassador|the official sent by a country to live in another and represent it|大使|The ___ met the president to discuss the treaty.|She served as ___ to Japan for four years.|The ___ was called home after the quarrel.|envoy,diplomat|ambassadors
  diplomacy|the work of managing relations between countries; skill in dealing with people without upsetting them|外交；交际手腕|The war was avoided through careful ___.|She used ___ to calm the angry customers.|Quiet ___ freed the prisoners.|coalition,mandate
  diplomat|a person whose job is to represent their country abroad|外交官|The ___ spoke four languages.|A ___ must choose words carefully.|He was a ___ in Paris before he became a writer.|ambassador,dissident|diplomats,diplomatic
  coalition|a group of parties or countries that join together to act|联盟，联合政府|A ___ of three parties formed the new government.|The ___ of nations sent aid to the region.|The ___ broke apart after a year.|cabinet,parliament|coalitions
  mandate|the authority given to a government or person by the people to carry out a plan|授权，任期|The election gave the party a ___ to change the tax laws.|Her ___ ends next year.|The leader claimed a ___ for sweeping reform.|coalition,diplomacy|mandates
  dissident|a person who openly disagrees with a government, often at great risk|持不同政见者|The ___ was jailed for writing against the regime.|Every ___ in the country knew the risk of speaking out.|The ___ later became president.|demonstrator,diplomat|dissidents
  demonstrator|a person who takes part in a public protest|示威者|Each ___ carried a sign.|Police asked the ___ to step back from the gate.|A young ___ spoke to the crowd.|dissident,envoy|demonstrators
  parliament|the group of elected people who make the laws of a country|议会，国会|___ voted to pass the new law.|She was elected to ___ at the age of thirty.|The prime minister spoke before ___.|cabinet,coalition|parliaments,parliamentary
  cabinet|the group of senior ministers who advise the head of a government|内阁|The prime minister met with her ___.|He was the youngest member of the ___.|The ___ agreed on the budget.|parliament,coalition|cabinets
  envoy|a messenger sent by one government to another on a special mission|特使|The king sent an ___ to make peace.|The ___ carried a letter from the president.|A special ___ was sent to free the hostages.|ambassador,demonstrator|envoys
  `,
);

const rightWrong = batch(
  "words-of-right-and-wrong",
  ["Words of Right and Wrong", "是非对错的词"],
  ["right and wrong", "是非对错"],
  `
  integrity|the quality of being honest and having strong moral principles|正直，诚信|The judge was known for her ___.|He showed ___ by returning the money.|A leader without ___ cannot be trusted.|virtue,conscience
  virtue|a good quality in a person, or goodness in general|美德|Patience is a ___.|The story praises the ___ of courage.|She believed that ___ is its own reward.|integrity,morality|virtues,virtuous
  conscience|the inner sense of right and wrong that makes you feel guilty when you do wrong|良心|His ___ would not let him lie.|She acted according to her ___.|The thief had a guilty ___.|scruple,integrity|consciences
  morality|ideas about what is right and wrong behavior|道德|The book asks questions about ___ and power.|The ___ of the decision was hotly debated.|Different cultures share many ideas of ___.|virtue,conscience
  scruple|a feeling that stops you from doing something you think is wrong|顾虑，良心不安|He had no ___ about taking the credit.|She had a ___ about lying, even to protect a friend.|A man without a single ___ will do anything for money.|conscience,temptation|scruples,scrupulous
  rationalize|to try to explain or excuse a wrong action with reasons that sound good|为……找借口|He tried to ___ taking the money by saying he would pay it back.|People often ___ their bad habits.|She could not ___ what she had done.|corrupt,temptation|rationalized,rationalizes
  temptation|the wish to do or have something, especially something wrong|诱惑|He fought the ___ to read her diary.|The open box of chocolates was too great a ___.|The hero resists every ___.|scruple,hypocrisy|temptations
  corrupt|willing to act dishonestly in return for money or power; to make someone dishonest|腐败的；使腐败|The ___ official took bribes.|Power can ___ even good people.|The newspaper exposed the ___ mayor.|accountable,rationalize|corrupted,corrupts,corruption
  hypocrisy|pretending to have beliefs or virtues that you do not really have|虚伪|It is ___ to preach honesty and then cheat.|Readers saw the ___ in his speech.|The novel attacks the ___ of the rich.|temptation,morality
  accountable|responsible for your actions and expected to explain them|负有责任的|Leaders must be held ___ for their decisions.|She felt ___ to her team.|The report made the company ___ for the spill.|corrupt,integrity|accountability
  `,
);

const character = batch(
  "words-of-good-character",
  ["Words of Good Character", "良好品格的词"],
  ["character", "品格"],
  `
  honesty|the quality of telling the truth and not cheating|诚实|Her ___ won the trust of the whole class.|He was praised for his ___ when he returned the wallet.|___ is the best policy.|sincerity,dignity
  hypocrite|a person who claims to have beliefs or virtues that they do not have|伪君子|He called the mayor a ___ for driving to the climate meeting.|She did not want to be a ___, so she followed her own advice.|Only a ___ would scold others for the same mistake.|altruism,selfless|hypocrites
  sincerity|the quality of meaning what you say|真诚|No one doubted the ___ of her apology.|He spoke with great ___.|The ___ in his letter moved her to tears.|honesty,empathy
  selfless|caring more about others than about yourself|无私的|The nurse's ___ work saved many lives.|It was a ___ act to give away his coat.|She was ___ in caring for her sick brother.|righteous,altruism
  altruism|caring about others and helping them without wanting anything in return|利他主义|Donating blood is an act of ___.|Scientists study ___ in animals, such as birds that warn the flock.|Her ___ made her a beloved teacher.|compassion,obligation
  compassion|a strong feeling of sympathy for someone who is suffering, and a wish to help|同情，怜悯|She treated the injured dog with ___.|The judge showed ___ to the young offender.|Without ___, the story's hero would be a cold man.|empathy,altruism
  empathy|the ability to understand and share another person's feelings|共情，同理心|Reading novels can build ___.|Her ___ helped her comfort her friend.|A good doctor needs ___ as well as skill.|compassion,sincerity
  obligation|something you must do because of a law, a promise or duty|义务，责任|He felt an ___ to help his neighbors.|Voting is both a right and an ___.|She had no ___ to stay, but she did.|dignity,altruism|obligations
  righteous|morally right, or feeling sure that you are|正义的；自以为是的|She was filled with ___ anger at the unfair rule.|The ___ hero defends the weak.|His ___ tone annoyed the others.|selfless,hypocrite
  dignity|the quality of being worthy of respect, and a calm, serious manner|尊严|Every person deserves to be treated with ___.|She lost the race but kept her ___.|He faced the judge with quiet ___.|honesty,obligation
  `,
);

const politics = batch(
  "words-of-politics-and-power",
  ["Words of Politics and Power", "政治与权力的词"],
  ["politics and elections", "政治与选举"],
  `
  incumbent|the person who holds an office at present|现任者|The ___ won the election by a wide margin.|It is hard to defeat an ___.|The ___ mayor is running for a third term.|constituent,lobbyist|incumbents
  constituent|a voter who lives in the area that an elected official represents|选民|The senator answered every letter from a ___.|Each ___ was invited to the town meeting.|She listened to her ___ and changed her vote.|electorate,incumbent|constituents
  partisan|strongly supporting one party or side, often without considering the other|党派性的，偏袒的|The vote split along ___ lines.|His ___ speech angered the other side.|The newspaper was accused of ___ reporting.|bipartisan,constituent
  referendum|a vote by all the people on a single question|全民公投|The country held a ___ on leaving the union.|The ___ passed with sixty percent of the vote.|Voters will decide the question in a ___.|caucus,inauguration|referendums,referenda
  inauguration|the ceremony at which a new leader formally begins their time in office|就职典礼|Thousands watched the president's ___.|The ___ took place on a cold January day.|She gave a short speech at her ___.|referendum,caucus|inaugurations,inaugurate
  electorate|all the people in a country or area who have the right to vote|全体选民|The ___ was tired of the old party.|Young voters are a growing part of the ___.|The candidate spoke directly to the ___.|constituent,caucus|electorates
  caucus|a meeting of the members of a political party to choose candidates or make plans|党团会议|The party held a ___ to pick its candidate.|The ___ lasted late into the night.|Each state ___ sends delegates to the convention.|referendum,filibuster|caucuses
  filibuster|a very long speech made to delay or block a vote|冗长演说（阻挠议事）|The senator spoke for twenty-four hours in a ___.|The ___ stopped the bill from passing.|To end a ___, sixty votes are needed.|caucus,lobbyist|filibusters
  lobbyist|a person paid to try to persuade lawmakers to support a cause or business|说客|The ___ met with lawmakers about the new tax.|Each ___ represented a different company.|The ___ argued that the law would cost jobs.|incumbent,constituent|lobbyists
  bipartisan|supported by both of the main political parties|两党的|The bill had ___ support.|A ___ committee studied the problem.|It is rare for a vote to be ___ these days.|partisan,electorate
  `,
);

const language = batch(
  "words-for-talking-about-language",
  ["Words for Talking About Language", "谈论语言的词"],
  ["language and style", "语言与文风"],
  `
  colloquial|used in everyday conversation rather than in formal writing|口语的|"Gonna" is a ___ way to say "going to."|The novel's dialogue is ___ and lively.|Avoid ___ words in a formal report.|vernacular,succinct
  articulate|able to express ideas clearly in words; to put into words|善于表达的；清楚地表达|She is an ___ speaker who can explain anything.|He struggled to ___ his feelings.|The ___ student won the debate.|verbose,succinct|articulated,articulates
  vernacular|the ordinary language spoken by the people of a place|方言，本地话|The poet wrote in the ___ of his village.|Dante chose the Italian ___ instead of Latin.|The ___ of sailors is full of colorful words.|colloquial,diction
  connotation|a feeling or idea that a word suggests in addition to its basic meaning|内涵，隐含意义|The word "home" has a warm ___.|"Cheap" has a negative ___, while "inexpensive" does not.|Writers choose words for their ___ as well as their meaning.|denotation,nuance|connotations
  denotation|the exact, literal meaning of a word|本义，字面意义|The ___ of "snake" is a long reptile with no legs.|A dictionary gives the ___ of a word.|The two words have the same ___ but different feelings.|connotation,nuance|denotations
  nuance|a very small difference in meaning, feeling or color|细微差别|A good translator catches every ___.|The actor's voice gave each line a different ___.|The poem is full of ___.|connotation,cliche|nuances
  cliche|a phrase or idea used so often that it has lost its force|陈词滥调|"As cold as ice" is a ___.|Her essay used one tired ___ after another.|Try to replace each ___ with a fresh image.|nuance,verbose|cliches,cliched
  verbose|using more words than are needed|冗长的，啰嗦的|His ___ report was forty pages long.|Cut the ___ opening and start with the action.|She is a ___ writer who never uses one word where ten will do.|succinct,articulate
  succinct|clear and short, using few words|简洁的|Her ___ answer settled the argument.|Write a ___ summary of the chapter.|The best slogans are ___.|verbose,colloquial
  diction|the choice of words a writer or speaker uses|措辞|The poet's ___ is simple and plain.|Formal ___ suits a speech to the court.|Notice how the author's ___ changes when the narrator is angry.|vernacular,connotation
  `,
);

/** batchesB are the batches of words of units 6 to 10 of grade 8. */
export const batchesB: readonly BatchSpec[] = [
  evolution,
  classifying,
  fossils,
  gloom,
  ghosts,
  madness,
  stage,
  courts,
  migration,
  newLives,
  diplomacy,
  rightWrong,
  character,
  politics,
  language,
];
