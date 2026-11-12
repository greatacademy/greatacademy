// Grade 6: the batches of words of the last five units, from living cells and memories to food, sport and the
// histories of words.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const cell = batch(
  "words-of-the-cell",
  ["Words of the Cell", "细胞的词"],
  ["the parts of a cell", "细胞的组成部分"],
  `
  cytoplasm|the jelly-like substance that fills a cell|细胞质|The parts of the cell float in the ___.|Under the microscope, the ___ looked clear and watery.|Many chemical reactions take place in the ___.|vacuole,organelle
  chloroplast|the green part of a plant cell where food is made from sunlight|叶绿体|Each ___ holds the green pigment that traps sunlight.|Animal cells have no ___, so animals cannot make food from light.|A leaf cell may contain dozens of chloroplasts, and each ___ makes sugar.|mitochondrion,vacuole|chloroplasts
  mitochondrion|the part of a cell that releases energy from food|线粒体|The ___ turns sugar into energy the cell can use.|A muscle cell needs many mitochondria, since each ___ supplies energy.|The ___ is often called the powerhouse of the cell.|chloroplast,organelle|mitochondria
  vacuole|a space in a cell that stores water, food or waste|液泡|A plant cell has one large ___ full of water.|When the ___ loses water, the plant wilts.|The ___ stores waste until the cell can get rid of it.|cytoplasm,chloroplast|vacuoles
  organelle|a tiny part inside a cell that does a special job|细胞器|Each ___ has its own job, like an organ in the body.|The nucleus is the largest ___ in most cells.|Scientists stained the cell to see each ___.|structure,vacuole|organelles
  unicellular|made of only one cell|单细胞的|Bacteria are ___ living things.|A ___ creature does everything inside one cell.|The amoeba is a ___ organism.|multicellular,cellular
  multicellular|made of many cells|多细胞的|Plants and animals are ___ living things.|A ___ animal has cells that do different jobs.|Mushrooms are ___, but yeast is made of single cells.|unicellular,specialized
  structure|the way the parts of something are arranged; also a building|结构；建筑物|The ___ of a cell is easier to see when it is stained.|A bridge is a ___ that must carry great weight.|Scientists studied the ___ of the leaf.|organelle,cellular|structures
  cellular|having to do with cells|细胞的|Exercise causes ___ changes in muscles.|___ biology is the study of how cells work.|The doctor looked for ___ damage.|unicellular,structure
  specialized|made for one particular job|专门的，特化的|Red blood cells are ___ to carry oxygen.|Nerve cells are ___ for sending signals.|The hospital has a ___ team for burns.|multicellular,cellular
  `,
);

const life = batch(
  "words-of-life-processes",
  ["Words of Life Processes", "生命活动的词"],
  ["how living things stay alive", "生物怎样维持生命"],
  `
  respiration|the process by which cells release energy from food, using oxygen|呼吸作用|___ in our cells turns sugar and oxygen into energy.|Plants carry out ___ day and night.|Carbon dioxide is a waste product of ___.|photosynthesis,metabolism
  photosynthesis|the way plants use sunlight to make food from water and air|光合作用|During ___, leaves take in carbon dioxide and give off oxygen.|Without sunlight, ___ stops.|The sugar made in ___ feeds the whole plant.|respiration,metabolism
  circulate|to move around through a system and back again|循环，流通|The heart pumps to ___ blood through the body.|Fans help the air ___ in a hot room.|The rumor began to ___ around the school.|secrete,excrete|circulated,circulates,circulation
  metabolism|all the chemical processes that keep a body alive|新陈代谢|A hummingbird has a very fast ___.|Your ___ slows down when you sleep.|Exercise can speed up your ___.|respiration,enzyme
  glucose|a simple sugar that cells use for energy|葡萄糖|Plants make ___ from sunlight, water and air.|The blood carries ___ to every cell.|Runners eat fruit to get quick ___.|hormone,enzyme
  excrete|to get rid of waste from the body|排泄|Kidneys ___ waste in urine.|Fish ___ waste through their gills.|Every living thing must ___ the waste it makes.|secrete,circulate|excreted,excretes
  secrete|to produce and release a liquid|分泌|Glands in the stomach ___ juices that break down food.|Some frogs ___ poison through their skin.|Trees ___ sap when their bark is cut.|excrete,circulate|secreted,secretes
  enzyme|a substance in living things that speeds up a chemical change|酶|An ___ in saliva starts to break down bread.|Each ___ works on only one kind of food.|Heat can destroy an ___.|hormone,glucose|enzymes
  hormone|a chemical made in the body that tells organs what to do|激素|A growth ___ makes children grow taller.|When you are scared, a ___ makes your heart beat faster.|The ___ travels through the blood.|enzyme,vessel|hormones
  vessel|a tube that carries blood or sap; also a ship|血管；船|A blood ___ carries blood to the brain.|The doctor checked the ___ in his leg.|A fishing ___ came into the harbor.|hormone,glucose|vessels
  `,
);

const heredity = batch(
  "words-of-heredity",
  ["Words of Heredity", "遗传的词"],
  ["how traits pass from parents to offspring", "性状怎样从亲代传给后代"],
  `
  trait|a feature, such as eye color, that a living thing has|特征，性状|Curly hair is a ___ that runs in her family.|Kindness is his best ___.|Each ___ is controlled by one or more genes.|gene,characteristic|traits
  inherit|to receive traits from your parents; also to receive money or things after someone dies|遗传；继承|Children ___ half their genes from each parent.|She will ___ her grandmother's house.|Did you ___ your father's red hair?|mutation,variation|inherited,inherits
  gene|a part of a cell that passes on a trait from parent to child|基因|One ___ decides whether a pea plant is tall or short.|Scientists found the ___ that causes the disease.|Every ___ is a set of instructions.|trait,species|genes
  offspring|the young of a person, animal or plant|后代|A cat may have four ___ in one litter.|The ___ look like their parents.|Seeds grow into the ___ of a plant.|species,heredity
  species|a group of living things of the same kind that can breed together|物种|The tiger is an endangered ___.|Scientists discover a new ___ of insect every day.|Each ___ is suited to its habitat.|offspring,variation
  variation|a difference between things of the same kind|变异，差异|There is great ___ in the color of the shells.|Small ___ among puppies of one litter is normal.|The ___ in temperature was greater in the desert.|mutation,characteristic|variations
  characteristic|a typical quality or feature|特征（的）|Long ears are a ___ of rabbits.|Wings are a ___ of birds.|It is ___ of her to help others.|trait,gene|characteristics
  heredity|the passing of traits from parents to children|遗传|Your height depends partly on ___.|Gregor Mendel studied ___ with pea plants.|Eye color is decided by ___.|variation,offspring
  dominant|stronger, so that it shows up over another|显性的；占优势的|Brown eyes are ___ over blue eyes.|The ___ wolf leads the pack.|A ___ trait appears even if only one parent passes it on.|characteristic,inherit
  mutation|a change in a gene|突变|A ___ can give a moth darker wings.|Most ___ changes are harmless.|The white tiger has a rare ___.|variation,heredity|mutations
  `,
);

const memory = batch(
  "words-of-memory",
  ["Words of Memory", "记忆的词"],
  ["memory and growing up", "记忆与成长"],
  `
  nostalgia|a sad but pleasant longing for the past|怀旧|Looking at old photos filled her with ___.|The song gave him a feeling of ___ for his school days.|___ made the old house seem more beautiful than it was.|recollection,souvenir
  adolescent|a young person between a child and an adult|青少年（的）|An ___ needs plenty of sleep.|During his ___ years, he grew twenty centimeters.|The book is written for an ___ reader.|upbringing,hometown|adolescents,adolescence
  reminisce|to talk or think about happy times in the past|追忆，缅怀|My grandparents love to ___ about their first house.|At the reunion, old friends sat down to ___.|We stayed up late to ___ about summer camp.|recollection,memento|reminisced
  memento|an object you keep to remember a person or event|纪念品|She kept the ticket as a ___ of the concert.|The shell was a ___ of our trip to the beach.|He gave each player a ___ of the season.|keepsake,souvenir|mementos
  recollection|a memory of something|回忆，记忆|I have a clear ___ of my first day at school.|His ___ of the accident was hazy.|To the best of my ___, the door was locked.|nostalgia,reminisce|recollections
  upbringing|the way a child is raised and cared for|教养，养育|Her strict ___ taught her to be on time.|He had a happy ___ on a farm.|A good ___ teaches children to be kind.|adolescent,hometown
  keepsake|a small object kept because it reminds you of someone|纪念物|Grandma's ring is a ___ I will never sell.|She gave me a lock of her hair as a ___.|The letter became a precious ___.|memento,souvenir|keepsakes
  souvenir|something you buy or keep to remember a place you visited|（旅游）纪念品|We bought a ___ of the Eiffel Tower in Paris.|The ___ shop sold mugs and postcards.|He brought back a rock from the canyon as a ___.|keepsake,memento|souvenirs
  bittersweet|both happy and sad at the same time|苦乐参半的|Graduation was a ___ day for the whole class.|The movie had a ___ ending.|Leaving the old house was ___.|nostalgia,adolescent
  hometown|the town where someone was born or grew up|家乡|She returned to her ___ after twenty years.|The singer gave a concert in his ___.|Our ___ is small but friendly.|upbringing,souvenir|hometowns
  `,
);

const friends = batch(
  "words-for-friends-and-family",
  ["Words for Friends and Family", "朋友与家人的词"],
  ["friends and family", "朋友与家人"],
  `
  sibling|a brother or sister|兄弟姐妹|Do you have a ___, or are you an only child?|My younger ___ always borrows my clothes.|Every ___ in the family has a chore.|companion,acquaintance|siblings
  companion|a person or animal you spend time with|同伴|The dog was his faithful ___ for fifteen years.|She was a cheerful ___ on the long trip.|The old woman hired a ___ to keep her company.|sibling,acquaintance|companions
  rivalry|a long competition between people or groups|竞争，较劲|There is a friendly ___ between the two schools.|The ___ between the sisters ended when they grew up.|Their ___ made both players better.|feud,quarrel|rivalries
  confide|to tell someone a secret because you trust them|吐露，倾诉|She decided to ___ in her aunt about her worries.|You can ___ in me; I will not tell anyone.|He was too shy to ___ his fears to his parents.|reconcile,betray|confided,confides
  reconcile|to become friends again after an argument|和解|The brothers finally agreed to ___ after years of silence.|Their mother helped them ___.|It is never too late to ___.|confide,betray|reconciled
  betray|to be disloyal to someone who trusts you|背叛，出卖|A true friend would never ___ your secret.|He felt that his team had decided to ___ him.|She would not ___ her country.|confide,reconcile|betrayed,betrays
  grudge|a feeling of anger at someone that lasts a long time|怨恨|He held a ___ against her for years after the argument.|Do not keep a ___; just talk to him.|She bears no ___ toward the boy who broke her bike.|feud,rivalry|grudges
  acquaintance|a person you know a little but who is not a close friend|熟人|He is an ___ from school, not a close friend.|I met an old ___ at the market.|She has many ___ friends but few close ones.|companion,sibling|acquaintances
  quarrel|an angry argument|争吵|The friends had a ___ about who would go first.|After their ___, they did not speak for a week.|The children began to ___ over the toy.|grudge,feud|quarrels,quarreled
  feud|a long, bitter fight between two families or groups|世仇，长期不和|The ___ between the two families lasted a hundred years.|Nobody remembered how the ___ had started.|The ___ ended when the children married.|rivalry,grudge|feuds
  `,
);

const fear = batch(
  "words-for-fear-and-courage",
  ["Words for Fear and Courage", "恐惧与勇气的词"],
  ["fear and courage", "恐惧与勇气"],
  `
  daunting|making you feel worried that you cannot do something|令人畏惧的|Climbing the mountain was a ___ task.|Starting at a new school can feel ___.|The long list of chores looked ___.|apprehensive,wary
  reluctant|not wanting to do something|不情愿的|He was ___ to jump into the cold water.|The ___ puppy would not leave its basket.|She was ___ to lend her new bike.|hesitant,courageous
  apprehensive|worried that something bad may happen|忧虑的|She felt ___ before her first piano recital.|The ___ traveler checked the map again.|We were ___ about the storm.|daunting,courageous
  falter|to lose strength or courage; to stop moving steadily|动摇；蹒跚|His voice began to ___ as he spoke to the crowd.|The runner did not ___ in the final lap.|Her courage started to ___ when she saw the height.|flinch,qualm|faltered,falters
  hesitant|slow to act because you are unsure|犹豫的|The ___ swimmer stood at the edge of the pool.|She gave a ___ answer.|He was ___ to raise his hand in class.|reluctant,wary
  flinch|to make a quick, small movement away from pain or fear|畏缩，退缩|She did not ___ when the nurse gave her the shot.|He tried not to ___ as the ball flew at him.|The loud bang made us all ___.|falter,qualm|flinched,flinches
  bravado|a show of courage that is not real|虚张声势|His ___ disappeared when he saw the big dog.|She spoke with ___, but her hands shook.|The boy's ___ did not fool anyone.|qualm,apprehensive
  qualm|a feeling of doubt about whether something is right|疑虑，不安|She had no ___ about telling the truth.|He felt a ___ about taking the last cookie.|Do you have any ___ about the plan?|bravado,falter|qualms
  wary|careful because you think something might be dangerous|谨慎的，警惕的|The deer was ___ of the hunters.|Be ___ of strangers who ask for money.|The cat was ___ of the new dog.|hesitant,daunting
  courageous|very brave|勇敢的|The ___ firefighter ran into the burning house.|It was a ___ decision to speak up.|The ___ girl climbed down to save the kitten.|reluctant,apprehensive
  `,
);

const nutrition = batch(
  "words-of-nutrition",
  ["Words of Nutrition", "营养的词"],
  ["food and health", "食物与健康"],
  `
  protein|a substance in food such as meat, eggs and beans that builds muscle|蛋白质|Eggs and beans are full of ___.|Your body needs ___ to build muscle.|Fish is a good source of ___.|fiber,carbohydrate|proteins
  vitamin|a substance in food that the body needs in small amounts|维生素|Oranges are rich in ___ C.|A ___ helps your body fight illness.|Sunlight helps your body make ___ D.|calorie,sodium|vitamins
  calorie|a unit for measuring the energy in food|卡路里|Each ___ in food is a small amount of energy for your body.|Running burns more than one ___ a minute.|This drink has almost no ___.|vitamin,diet|calories
  diet|the food a person or animal usually eats|饮食|A healthy ___ includes plenty of vegetables.|Pandas live on a ___ of bamboo.|The doctor told him to change his ___.|nutrition,calorie|diets
  nutrition|the food that you eat and how it affects your health|营养|Good ___ helps children grow strong.|The ___ label shows how much sugar is in the cereal.|We studied ___ in health class.|diet,protein
  carbohydrate|a substance in foods such as bread, rice and pasta that gives energy|碳水化合物|Rice is mostly ___.|Runners eat pasta because each ___ gives quick energy.|Sugar is a simple ___.|protein,fiber|carbohydrates
  fiber|the part of plants that the body cannot digest but needs|膳食纤维|Whole wheat bread has more ___ than white bread.|Beans and apples are full of ___.|___ helps food move through your body.|protein,sodium
  nutritious|full of things that keep you healthy|有营养的|A ___ breakfast gives you energy for the morning.|Nuts are small but ___.|The school serves ___ lunches.|wholesome,fiber
  sodium|a chemical in salt|钠|Chips contain a lot of ___.|Too much ___ is bad for your heart.|The label lists the ___ in each serving.|vitamin,fiber
  wholesome|good for your health and well-being|健康的，有益的|Grandma cooked a ___ meal of soup and bread.|The camp offers ___ fun for families.|Fresh fruit is a ___ snack.|nutritious,diet
  `,
);

const farming = batch(
  "words-of-modern-farming",
  ["Words of Modern Farming", "现代农业的词"],
  ["modern farming", "现代农业"],
  `
  pesticide|a chemical used to kill insects that harm crops|杀虫剂|The farmer sprayed ___ on the apple trees.|Some ___ can harm bees as well as pests.|Wash fruit to remove any ___.|fertilizer,erosion|pesticides
  fertilizer|a substance added to soil to help plants grow|肥料|Farmers spread ___ on the fields in spring.|Too much ___ can wash into rivers.|Compost is a natural ___.|pesticide,yield|fertilizers
  yield|the amount a field produces; also to produce|产量；出产|This year's ___ of corn was the best in ten years.|Healthy soil can ___ more wheat.|Rain helped increase the ___.|pasture,fallow|yields
  livestock|animals kept on a farm, such as cows and sheep|家畜，牲畜|The farmer fed his ___ every morning.|Floods drowned many ___.|Cows, pigs and goats are all ___.|pasture,organic
  organic|grown without man-made chemicals|有机的|___ vegetables cost more at the market.|The farm switched to ___ methods.|She buys ___ milk.|livestock,fallow
  cultivate|to prepare land and grow crops on it|耕作，种植|The settlers began to ___ the land along the river.|You must ___ the soil before you plant.|They ___ rice in flooded fields.|graze,yield|cultivated,cultivates,cultivation
  graze|to eat grass in a field|吃草，放牧|Sheep ___ on the hillside all summer.|The farmer let the cows ___ in the meadow.|Deer come out at dusk to ___.|cultivate,yield|grazed,grazing
  fallow|plowed but left without crops for a season|休耕的|The farmer left one field ___ each year to rest the soil.|___ land slowly gets its strength back.|The ___ field was full of weeds.|organic,pasture
  erosion|the slow wearing away of land by wind or water|侵蚀|Trees help stop the ___ of the hillside.|Heavy rain caused ___ along the river bank.|Wind ___ carried the topsoil away.|fertilizer,pesticide
  pasture|land covered with grass where animals feed|牧场|The horses ran across the green ___.|The farmer moved his sheep to a fresh ___.|A fence kept the cows in the ___.|livestock,fallow|pastures
  `,
);

const plenty = batch(
  "words-of-hunger-and-plenty",
  ["Words of Hunger and Plenty", "饥饿与富足的词"],
  ["hunger and plenty", "饥饿与富足"],
  `
  shortage|a situation in which there is not enough of something|短缺|A water ___ forced the town to close the pools.|The ___ of teachers meant larger classes.|During the war there was a ___ of sugar.|scarcity,famine|shortages
  famine|a time when there is so little food that many people go hungry or die|饥荒|The ___ began after three years of drought.|Millions of people died in the great ___.|Aid workers brought food to the ___ area.|feast,malnutrition|famines
  distribute|to give things out to many people|分发，分配|Volunteers ___ food to families in need.|The teacher will ___ the tests now.|Trucks ___ rice to the villages.|hoard,starve|distributed,distributing
  feast|a large, special meal|盛宴|The village held a ___ after the harvest.|We had a ___ of roast chicken and pies.|The wedding ___ lasted all night.|famine,abundance|feasts
  abundance|a very large amount; more than enough|丰富，大量|The garden produced an ___ of tomatoes.|There is an ___ of fish in the lake.|The market had an ___ of fruit in summer.|scarcity,shortage
  starve|to suffer or die because you have no food|挨饿，饿死|Without help, the cattle would ___ in the drought.|Many people began to ___ during the siege.|Do not ___ yourself; eat some lunch.|hoard,distribute|starved,starving
  hoard|to collect and hide a large supply of something|囤积|Squirrels ___ nuts for the winter.|During the shortage, some people began to ___ flour.|It is unfair to ___ food when others are hungry.|distribute,starve|hoarded,hoarding
  plentiful|existing in large amounts|充足的，丰富的|Food was ___ after the good harvest.|Rain is ___ in the spring.|Jobs were ___ in the growing city.|abundance,feast
  malnutrition|poor health caused by not eating enough good food|营养不良|Many children in the camp suffered from ___.|___ can stop a child from growing properly.|Doctors treated the ___ with special food.|famine,shortage
  scarcity|a lack of something that is needed|缺乏，稀缺|The ___ of water made farming hard.|Prices rise when there is a ___ of goods.|The ___ of doctors in the village was a problem.|abundance,feast
  `,
);

const competition = batch(
  "words-of-competition",
  ["Words of Competition", "比赛的词"],
  ["competition and sport", "比赛与体育"],
  `
  opponent|the person or team you play against|对手|Shake hands with your ___ before the match.|Her ___ was taller but slower.|The chess player studied his ___'s moves.|contender,spectator|opponents
  championship|a competition to find the best player or team|锦标赛，冠军|Our team won the city ___.|She is training for the national swimming ___.|The ___ game will be on Saturday.|league,victory|championships
  referee|an official who makes sure players follow the rules|裁判|The ___ blew the whistle to stop the game.|Players must respect the ___'s decision.|The ___ showed him a yellow card.|spectator,opponent|referees
  spectator|a person who watches an event|观众|Every ___ stood up to cheer.|Each ___ in the stadium paid for a ticket.|One ___ ran onto the field.|referee,contender|spectators
  compete|to try to win against others|比赛，竞争|Athletes from many countries ___ in the Olympics.|Two stores ___ for the same customers.|She will ___ in the long jump.|rally,defeat|competed,competition
  victory|a win|胜利|The team celebrated its ___ with a party.|It was a narrow ___ of one point.|The general led his army to ___.|defeat,championship|victories
  defeat|a loss; also to beat someone|失败；击败|The team learned a lot from its ___.|Can our school ___ the champions?|After the ___, the coach spoke kindly to the players.|victory,rally|defeated,defeats
  league|a group of teams that play against each other|联赛，联盟|Our soccer ___ has ten teams.|She plays in a basketball ___ for girls.|The ___ meets every Saturday.|championship,contender|leagues
  contender|a person or team that has a chance of winning|竞争者|She is a strong ___ for the gold medal.|Every ___ for the title must win its last game.|He was never a real ___ for the prize.|opponent,spectator|contenders
  rally|to come back strongly after being behind; also a long exchange of shots|重振，反攻；（球类）多拍对打|The team began to ___ in the second half.|The tennis ___ lasted thirty shots.|Fans cheered as their team tried to ___.|compete,defeat|rallied,rallies
  `,
);

const rules = batch(
  "words-of-rules-and-fair-play",
  ["Words of Rules and Fair Play", "规则与公平竞争的词"],
  ["rules and fair play", "规则与公平竞争"],
  `
  penalty|a punishment for breaking a rule|处罚，罚球|The referee gave a ___ for the late tackle.|The ___ for parking here is a large fine.|She scored from the ___ spot.|foul,forfeit|penalties
  foul|an action that breaks the rules of a game|犯规|The player was sent off after his third ___.|Pushing is a ___ in basketball.|The referee did not see the ___.|penalty,cheat|fouls,fouled
  violate|to break a rule, law or agreement|违反|Players who ___ the rules will be punished.|The factory was fined because it chose to ___ safety laws.|Do not ___ the trust of your friends.|disqualify,suspend|violated,violates,violation
  regulation|an official rule|规定，条例|Every ball must meet the league ___ for size.|A new ___ bans phones during exams.|Safety ___ requires helmets on bikes.|penalty,sportsmanship|regulations
  eligible|allowed to do or have something because you meet the rules|有资格的|Only students under twelve are ___ for the team.|She is ___ to vote this year.|Players must keep good grades to stay ___.|disqualify,forfeit
  disqualify|to stop someone from taking part because they broke a rule|取消资格|The judges will ___ any runner who starts early.|Cheating can ___ you from the contest.|They had to ___ the swimmer for a false start.|violate,suspend|disqualified,disqualifies
  cheat|to break the rules to get an advantage|作弊|Players who ___ spoil the game for everyone.|It is wrong to ___ on a test.|He would rather lose than ___.|foul,violate|cheated,cheating,cheats
  sportsmanship|playing fairly and being polite whether you win or lose|体育精神|She won an award for ___.|Shaking hands after the game shows good ___.|The coach cares more about ___ than winning.|regulation,eligible
  forfeit|to lose a game or right because you broke a rule or did not show up|弃权，被罚丧失|The team had to ___ the game because only six players came.|If you are late, you ___ your turn.|They chose to ___ rather than play unfairly.|disqualify,penalty|forfeited
  suspend|to stop someone from taking part for a time as a punishment|暂停（资格）|The league decided to ___ the player for two games.|The school may ___ students who fight.|They had to ___ the match because of rain.|disqualify,violate|suspended,suspension
  `,
);

const training = batch(
  "words-of-training",
  ["Words of Training", "训练的词"],
  ["training for sport", "体育训练"],
  `
  stamina|the strength to keep going for a long time|耐力|Long-distance runners need great ___.|Swimming every day built up her ___.|He ran out of ___ halfway through the race.|agility,coordination
  agility|the ability to move quickly and easily|敏捷|Goalkeepers need ___ to reach the ball.|The cat jumped onto the fence with great ___.|Ladder drills improve ___.|stamina,strain
  strain|an injury from stretching a muscle too far; also to try very hard|拉伤；竭力|He felt a ___ in his leg after the sprint.|Don't ___ your eyes reading in the dark.|She had to ___ to lift the heavy box.|sprain,drill|strained,strains
  coordination|the ability to make your body parts work well together|协调性|Juggling takes good ___.|Dancing improves ___ and balance.|Young children are still developing their ___.|agility,conditioning
  drill|an exercise that is repeated to practice a skill|练习，训练|The coach ran a passing ___ for twenty minutes.|We had a fire ___ at school today.|Each ___ helps the players react faster.|sprint,regimen|drills
  sprain|an injury to a joint, such as an ankle, from twisting it|扭伤|She got a ___ when she landed badly.|A ___ can take weeks to heal.|Ice will help the swelling of your ___.|strain,sprint|sprained
  hydrate|to drink enough water so your body has what it needs|补充水分|Remember to ___ before and after the race.|Players stop to ___ during hot games.|You should ___ often on a long hike.|sprint,drill|hydrated,hydration
  sprint|a short, very fast run; also to run very fast|冲刺|She won the 100-meter ___.|He had to ___ to catch the bus.|The last ___ to the finish line was exciting.|drill,stamina|sprinted,sprints
  conditioning|training that makes your body fit and strong|体能训练|Summer ___ gets the team ready for the season.|___ includes running, lifting and stretching.|The players groaned during ___.|regimen,coordination
  regimen|a strict plan of exercise, diet or medicine|养生法，训练计划|Her training ___ includes running every morning.|The doctor gave him a new ___ of exercise.|Olympic swimmers follow a strict ___.|conditioning,drill|regimens
  `,
);

const named = batch(
  "words-named-after-people",
  ["Words Named After People", "以人名命名的词"],
  ["words named after people", "以人名命名的词"],
  `
  sandwich|two pieces of bread with food between them, named after the Earl of Sandwich|三明治|I had a cheese ___ for lunch.|The Earl of Sandwich asked for his meat between bread, and the ___ got his name.|She cut the ___ into four triangles.|cardigan,saxophone|sandwiches
  boycott|to refuse to buy or use something as a protest, after Charles Boycott|抵制|People decided to ___ the store after it treated workers badly.|The word ___ comes from a land agent whom his neighbors refused to deal with.|The students called for a ___ of the cafeteria.|maverick,pasteurize|boycotted,boycotts
  cardigan|a knitted sweater that opens at the front, after the Earl of Cardigan|开襟毛衣|She buttoned up her ___ against the cold.|The Earl of Cardigan's soldiers wore a knitted jacket, and the ___ was named after him.|Grandpa wears a brown ___.|leotard,sandwich|cardigans
  saxophone|a curved metal musical instrument, invented by Adolphe Sax|萨克斯管|He plays the ___ in the jazz band.|The ___ is named after its inventor, Adolphe Sax.|A ___ solo opened the song.|diesel,braille|saxophones
  diesel|a fuel for engines, named after Rudolf Diesel|柴油|Trucks and buses often run on ___.|Rudolf Diesel built the engine that gave ___ its name.|The ___ engine made a loud rumble.|saxophone,pasteurize
  braille|a system of raised dots that blind people read with their fingers, invented by Louis Braille|盲文|She reads books in ___.|Louis Braille, who was blind himself, created ___ when he was fifteen.|The elevator buttons have ___ on them.|silhouette,saxophone
  leotard|a tight one-piece garment worn for dance, after Jules Léotard|紧身连衣裤|The gymnast wore a blue ___.|The ___ is named after a French acrobat.|Dancers changed into a ___ before class.|cardigan,silhouette|leotards
  silhouette|a dark outline against a light background, after Étienne de Silhouette|剪影，轮廓|We saw the ___ of a man against the sunset.|The artist cut a ___ of my face out of black paper.|The ___ of the mountains was beautiful at dusk.|braille,leotard|silhouettes
  maverick|a person who thinks and acts differently from others, after Samuel Maverick|特立独行的人|She was a ___ who never followed the crowd.|The ___ scientist tested an idea everyone laughed at.|Samuel Maverick did not brand his cattle, and so a ___ came to mean an independent thinker.|boycott,diesel|mavericks
  pasteurize|to heat milk to kill germs, after Louis Pasteur|巴氏消毒|Dairies ___ milk to make it safe to drink.|Louis Pasteur showed that heat could kill germs, so we ___ milk in his name.|Factories ___ juice before they bottle it.|boycott,diesel|pasteurized
  `,
);

const language = batch(
  "words-about-language",
  ["Words About Language", "关于语言的词"],
  ["language and how people speak", "语言与说话方式"],
  `
  dialect|a form of a language spoken in one area|方言|People in the north speak a different ___ from those in the south.|The old man spoke a ___ I could barely understand.|Cantonese is sometimes called a ___ of Chinese.|accent,slang|dialects
  accent|the way people from one place pronounce words|口音|She has a strong Scottish ___.|I could tell from his ___ that he was from Texas.|Her ___ changed after she moved abroad.|dialect,pronunciation|accents
  slang|very informal words used by a group, often young people|俚语|"Cool" is ___ for good.|Do not use ___ in a formal essay.|Every generation invents new ___.|jargon,idiom
  jargon|special words used by people in one job that others may not understand|行话，术语|Doctors use medical ___ that patients find confusing.|The computer manual was full of ___.|Try to explain it without ___.|slang,dialect
  idiom|a phrase whose meaning is different from its separate words|习语|"Break a leg" is an ___ that means "good luck."|Every language has an ___ that is hard to translate.|The teacher explained the ___ "under the weather."|slang,vocabulary|idioms
  fluent|able to speak a language easily and well|流利的|She is ___ in French and Chinese.|After two years, he became ___ in English.|A ___ speaker does not need to stop and think.|bilingual,translate
  bilingual|able to speak two languages well|双语的|Many children in Canada are ___.|The ___ sign was in English and Spanish.|Being ___ helped her get the job.|fluent,dialect
  pronunciation|the way a word is said|发音|The ___ of "colonel" surprises many learners.|Her ___ improved with practice.|Check the dictionary for the correct ___.|accent,vocabulary
  vocabulary|all the words a person knows or uses|词汇|Reading helps you build a large ___.|The new ___ for this unit is on the board.|Her ___ is amazing for a six-year-old.|pronunciation,jargon
  translate|to change words from one language into another|翻译|Can you ___ this letter into English?|It took two years to ___ the book into thirty languages.|She will ___ for the visitors.|fluent,idiom|translated,translation
  `,
);

const time = batch(
  "words-of-time-and-change",
  ["Words of Time and Change", "时间与变化的词"],
  ["time and change", "时间与变化"],
  `
  obsolete|no longer used because something newer exists|过时的，淘汰的|Typewriters became ___ after computers arrived.|This map is ___ because the roads have changed.|Many old words are now ___.|antique,temporary
  evolve|to change and develop slowly over time|逐渐演变，进化|Languages ___ as people invent new words.|Over millions of years, whales did ___ from animals that lived on land.|The small shop began to ___ into a big company.|permanent,contemporary|evolved,evolves,evolution
  permanent|lasting forever or for a very long time|永久的|The ink is ___ and will not wash out.|After the test, she got a ___ job.|The scar on his arm is ___.|temporary,obsolete
  temporary|lasting only a short time|暂时的|The school is in a ___ building while the new one is built.|The pain was only ___.|She found a ___ job for the summer.|permanent,contemporary
  epoch|a long period of history marked by special events|时代，纪元|The invention of printing began a new ___.|Dinosaurs lived in a distant ___.|The moon landing marked the start of an ___.|millennium,antique|epochs
  prehistoric|from the time before people wrote things down|史前的|___ people painted animals on cave walls.|The museum has a ___ skeleton.|Mammoths were ___ animals.|chronological,contemporary
  contemporary|belonging to the present time; also living at the same time|当代的；同时代的|The museum shows ___ art.|Shakespeare was a ___ of Queen Elizabeth.|She writes ___ songs about city life.|prehistoric,obsolete|contemporaries
  millennium|a period of a thousand years|千年|The year 2000 began a new ___.|The castle has stood for almost a ___.|Rome lasted more than a ___.|epoch,antique|millennia
  chronological|arranged in the order that things happened|按时间顺序的|Put the events of the story in ___ order.|The museum displays tools in ___ order.|Her diary is a ___ record of the trip.|prehistoric,permanent
  antique|old and valuable|古董（的）|Grandma has an ___ clock from 1850.|The shop sells ___ furniture.|That chair is a real ___.|obsolete,epoch|antiques
  `,
);

/** batchesB are the batches of the last five units of grade 6. */
export const batchesB: readonly BatchSpec[] = [
  cell,
  life,
  heredity,
  memory,
  friends,
  fear,
  nutrition,
  farming,
  plenty,
  competition,
  rules,
  training,
  named,
  language,
  time,
];
