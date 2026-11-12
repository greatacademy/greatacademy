// Grade 8: the batches of words of the first five units, from crisis and regret to engines, computers, ships at sea,
// revolutions and the factories of the industrial age.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const crisis = batch(
  "words-of-crisis-and-upheaval",
  ["Words of Crisis and Upheaval", "危机与剧变的词"],
  ["crisis and sudden change", "危机与突变"],
  `
  ultimatum|a final demand, with a threat of what will happen if it is refused|最后通牒|The general sent an ___: surrender by dawn or the city would be attacked.|Her parents gave her an ___: finish the chores or stay home from the party.|The workers rejected the company's ___ and walked out.|confrontation,predicament|ultimatums
  confrontation|a meeting in which people face each other angrily or in open conflict|对峙，冲突|The ___ between the two captains ended with a handshake.|She wanted to avoid a ___, so she wrote him a calm letter instead.|The story builds toward a final ___ on the bridge.|ultimatum,turmoil|confrontations
  predicament|a difficult or unpleasant situation that is hard to get out of|困境|Lost in the rain without a map, the hikers were in a real ___.|His ___ grew worse when the last bus left without him.|She explained her ___ to the teacher and asked for help.|crossroads,turmoil|predicaments
  turmoil|a state of great confusion, worry or disorder|混乱，动荡|After the earthquake, the city was in ___ for weeks.|Her mind was in ___ as she waited for the results.|The country fell into ___ when the king died without an heir.|upheaval,predicament
  catalyst|something or someone that causes an important change to happen|催化剂，促成因素|The flood was the ___ that finally made the town build a dam.|A single speech became the ___ for a nationwide movement.|In the novel, a stranger's arrival is the ___ for everything that follows.|aftermath,crossroads|catalysts
  upheaval|a great and sudden change that disturbs people's lives|剧变|The war brought ___ to every family in the valley.|Moving to a new country is a huge ___ for a child.|The invention of the printing press caused an ___ in how people learned.|turmoil,transformation|upheavals
  pivotal|of great importance, because other things depend on it|关键的|The letter plays a ___ role in the plot.|Winning that game was the ___ moment of the season.|Her decision to stay proved ___ to the success of the team.|catalyst,aftermath
  crossroads|a point at which an important choice must be made|十字路口，抉择关头|At the end of school, he stood at a ___: work or college.|The country was at a ___ in its history.|The hero reaches a ___ and must choose between friendship and duty.|predicament,ultimatum
  aftermath|the period that follows a bad event, and the effects it leaves|后果，余波|In the ___ of the storm, neighbors helped clear the roads.|The novel describes the ___ of the war in a small village.|The ___ of the scandal lasted for years.|upheaval,catalyst
  transformation|a complete change in the form, nature or appearance of something|转变，彻底改变|The old warehouse went through a ___ into a bright art center.|By the last chapter, the character's ___ from coward to hero is complete.|The ___ of the caterpillar into a butterfly takes about two weeks.|upheaval,turmoil|transformations
  `,
);

const regret = batch(
  "words-of-regret-and-redemption",
  ["Words of Regret and Redemption", "悔恨与救赎的词"],
  ["regret and making amends", "悔恨与弥补"],
  `
  remorse|a deep feeling of sorrow and guilt for something wrong you have done|懊悔，自责|He felt great ___ after breaking his friend's trust.|The thief showed no ___ at the trial.|Full of ___, she wrote a long letter of apology.|resentment,humility
  redemption|being saved from evil or from the results of a wrong, or making up for it|救赎|The story is about a cruel man's ___ through one act of kindness.|After his mistake cost the game, he found ___ by scoring the winning goal next week.|Some readers think the villain is beyond ___.|remorse,vow
  repent|to feel sorry for something wrong you have done and resolve not to do it again|悔改|The king came to ___ of his harsh laws.|"___ now, before it is too late," the preacher warned.|She did ___, but the damage was already done.|atone,renounce|repents,repented
  atone|to do something to make up for a wrong you have done|赎罪，弥补|He tried to ___ for his rudeness by cooking dinner for everyone.|Nothing could ___ for the harm the fire had caused.|She volunteered every Saturday to ___ for her mistake.|repent,forgive|atones,atoned
  renounce|to give up something formally or for good, such as a right, a belief or a habit|放弃，宣布放弃|The prince chose to ___ his claim to the throne.|He promised to ___ violence and live in peace.|To join the order, she had to ___ all her riches.|repent,vow|renounces,renounced
  penitent|feeling or showing sorrow for having done wrong|悔过的，忏悔的|The ___ boy returned the money he had taken.|She gave him a ___ smile and said she was sorry.|The ___ sailor begged the captain to let him stay.|remorse,humility
  vow|a serious promise; to promise seriously|誓言；发誓|She made a ___ never to tell the secret.|They exchanged a ___ of friendship under the old oak tree.|He broke his ___ and returned to the city.|redemption,renounce|vows,vowed
  resentment|a bitter feeling of anger about something you think is unfair|怨恨|Years of ___ grew between the two brothers.|She felt ___ when her idea was given to someone else.|His ___ toward the new rules showed in every word.|remorse,penitent
  forgive|to stop being angry with someone for something they have done|原谅|It took her months to ___ her friend for the lie.|"Please ___ me," he said quietly.|Some wrongs are hard to ___.|atone,repent|forgives,forgave,forgiven,forgiveness
  humility|the quality of not thinking you are better or more important than others|谦逊|Despite his fame, he spoke with great ___.|The coach praised the team's ___ after the big win.|___ helped her admit that she had been wrong.|resentment,remorse
  `,
);

const structure = batch(
  "words-of-story-structure",
  ["Words of Story Structure", "故事结构的词"],
  ["how a story is built", "故事的结构"],
  `
  subplot|a second, smaller story that runs alongside the main plot|次要情节|In the ___, the hero's sister tries to win a singing contest.|The ___ about the lost dog adds humor to a serious book.|The two lines of the story meet when the ___ joins the main plot.|interlude,backstory|subplots
  exposition|the part at the start of a story that introduces the characters, setting and situation|开端，背景交代|The ___ tells us that the family has just moved to the coast.|A long ___ can make readers impatient for the action.|In the ___, we learn that the twins have not spoken in years.|prologue,resolution
  epilogue|a short section at the end of a book that tells what happened later|尾声，后记|The ___ shows the characters twenty years later.|In the ___, we learn that the farm was saved.|Some readers skip the ___, but it answers the last questions.|prologue,resolution|epilogues
  prologue|a short introduction at the start of a story, play or poem, before the main action|序幕，序言|The ___ tells of a crime committed a hundred years before the story begins.|The play opens with a ___ spoken by a single actor.|Without the ___, the ending would make no sense.|epilogue,exposition|prologues
  vignette|a short scene or description that captures one moment or feeling|小品文，片段描写|The book is a series of ___ about life on one street.|Her essay opens with a ___ of her grandmother baking bread.|Each ___ is only a page long, but together they tell a whole life.|interlude,subplot|vignettes
  resolution|the part of a story in which the main problem is settled|结局，问题的解决|In the ___, the two families finally make peace.|The ___ came too quickly and felt unearned.|Readers wait the whole book for the ___ of the mystery.|epilogue,anticlimax|resolutions
  anticlimax|a disappointing ending after a build-up of excitement|虎头蛇尾，令人失望的结局|After all the warnings about the monster, its tiny size was an ___.|The final battle was an ___: the enemy simply ran away.|The writer avoids an ___ by saving the biggest surprise for last.|cliffhanger,resolution|anticlimaxes,anticlimactic
  cliffhanger|an ending of a chapter or episode that leaves the reader in suspense|悬念结尾|Each chapter ends with a ___, so it is hard to stop reading.|The first book ends on a ___: the bridge is collapsing.|Viewers waited all summer to learn how the ___ would be resolved.|anticlimax,epilogue|cliffhangers
  backstory|the events in a character's past that explain who they are now|背景故事，前史|The villain's ___ explains why he hates the city.|The author reveals the ___ slowly, in short memories.|Without his ___, his anger seems to come from nowhere.|subplot,exposition|backstories
  interlude|a short period or section between two longer ones, often different in mood|插曲，间歇|A calm ___ at the lake comes between two tense chapters.|The play has a musical ___ between the acts.|The ___ gives readers a moment to breathe.|vignette,subplot|interludes
  `,
);

const engines = batch(
  "words-of-engines",
  ["Words of Engines", "发动机的词"],
  ["engines and machines", "发动机与机器"],
  `
  piston|a short solid part that slides up and down inside a tube in an engine|活塞|Burning fuel pushes the ___ down, and that turns the wheels.|Each ___ moves hundreds of times a minute.|The mechanic replaced a cracked ___.|valve,crank|pistons
  combustion|the process of burning|燃烧|In an engine, the ___ of fuel releases energy.|___ needs fuel, heat and oxygen.|The car's ___ engine was replaced by an electric motor.|exhaust,boiler
  crank|a bent handle or arm that turns round to make a machine work|曲柄|Early cars had to be started by turning a ___ at the front.|The ___ changes the up-and-down motion of the pistons into turning.|She turned the ___ to raise the bucket from the well.|axle,pulley|cranks,cranked
  boiler|a large tank in which water is heated to make steam|锅炉|The fireman shoveled coal into the ___.|When the ___ burst, steam filled the engine room.|A steam train carries its ___ just behind the chimney.|piston,flywheel|boilers
  horsepower|a unit that measures the power of an engine|马力|The new tractor had twice the ___ of the old one.|Early engines produced only a few ___.|A racing car may have more than eight hundred ___.|combustion,flywheel
  exhaust|the waste gas that comes out of an engine|废气|___ from the trucks filled the narrow street.|A pipe carries the ___ away from the engine.|Electric buses produce no ___.|combustion,valve|exhausts
  valve|a part that opens and closes to control the flow of a liquid or gas|阀门|The engineer opened the ___ to let off steam.|A ___ in your heart stops blood from flowing backward.|The ___ was stuck, and water kept pouring out.|piston,exhaust|valves
  axle|a rod on which a wheel or a pair of wheels turns|车轴|The cart's ___ snapped under the heavy load.|Each ___ of the train carries two wheels.|Grease keeps the ___ turning smoothly.|crank,pulley|axles
  pulley|a wheel with a rope or chain around it, used to lift heavy things|滑轮|The builders used a ___ to lift the stones to the roof.|With one ___ and a rope, one person can raise a piano.|Pull the rope, and the ___ lifts the flag.|axle,crank|pulleys
  flywheel|a heavy wheel that keeps a machine running smoothly by storing energy as it spins|飞轮|The heavy ___ kept the engine turning between strokes.|Once it is spinning, a ___ is hard to stop.|The old sewing machine has a ___ at its side.|boiler,piston|flywheels
  `,
);

const computers = batch(
  "words-of-computers",
  ["Words of Computers", "计算机的词"],
  ["computers", "计算机"],
  `
  algorithm|a set of steps that a computer follows to solve a problem|算法|The search engine uses an ___ to rank the pages.|An ___ for sorting cards can be written in five steps.|The app's ___ suggests songs you might like.|processor,binary|algorithms
  binary|a system of numbers that uses only 0 and 1|二进制|Computers store everything in ___, as strings of zeros and ones.|In ___, the number five is written 101.|Each ___ digit is called a bit.|byte,algorithm
  processor|the part of a computer that carries out its instructions|处理器|A faster ___ lets the game run smoothly.|The phone's ___ does billions of steps every second.|The ___ gets hot when it works hard.|transistor,microchip|processors
  byte|a unit of computer memory made of eight bits|字节|A single letter takes up one ___ of memory.|A kilobyte is about a thousand of them; one ___ is just eight bits.|Each ___ can store a number from 0 to 255.|binary,pixel|bytes
  debug|to find and remove the mistakes in a computer program|调试，排除程序错误|It took her two days to ___ the code.|Programmers spend much of their time trying to ___ their work.|Run the program again after you ___ it.|encrypt,algorithm|debugs,debugged,debugging
  encrypt|to change information into a code so that others cannot read it|加密|Banks ___ your password before sending it.|The spy would ___ every message.|Apps ___ messages so that only the receiver can read them.|debug,binary|encrypts,encrypted,encryption
  transistor|a tiny electronic part that controls the flow of electricity and acts as a switch|晶体管|The ___ replaced large glass tubes in radios.|A modern chip holds billions of them; each ___ is smaller than a virus.|The invention of the ___ made small computers possible.|microchip,processor|transistors
  microchip|a very small piece of material that holds a complete electronic circuit|微芯片|A ___ in the card stores your information.|The vet put a ___ under the dog's skin.|One ___ can hold more power than a room-sized computer once did.|transistor,processor|microchips
  pixel|one of the tiny dots of color that make up an image on a screen|像素|Zoom in far enough, and you can see each ___.|The photo is blurry because each ___ is too large.|A screen with more of them looks sharper; one ___ is almost invisible.|byte,bandwidth|pixels
  bandwidth|the amount of information that can be sent over a connection in a given time|带宽|Streaming a film takes a lot of ___.|The village's slow ___ made video calls freeze.|When everyone is online, the ___ is shared and pages load slowly.|pixel,byte
  `,
);

const machineAge = batch(
  "words-of-the-machine-age",
  ["Words of the Machine Age", "机器时代的词"],
  ["the machine age", "机器时代"],
  `
  contraption|a strange-looking machine or device, often one that someone has built themselves|奇妙装置|His ___ of wires and pulleys could open the door from across the room.|The ___ rattled so loudly that the neighbors complained.|She entered a homemade ___ in the science fair.|gadget,apparatus|contraptions
  apparatus|the equipment or machines needed for a particular job|器械，仪器|The divers checked their breathing ___ before the dive.|The lab's ___ filled a whole table.|Firefighters wear a heavy ___ on their backs.|contraption,conveyor
  conveyor|a moving belt that carries objects from one place to another|传送带|Boxes moved along the ___ to the packing room.|At the airport, bags come out on a ___.|The ___ broke, and the whole factory stopped.|sprocket,apparatus|conveyors
  telegraph|a system for sending messages over wires using electric signals and a code|电报|News of the victory reached the capital by ___.|The ___ let people send messages across the continent in minutes.|The operator tapped the ___ key in Morse code.|typewriter,conveyor|telegraphs,telegraphed
  typewriter|a machine with keys that prints letters onto paper|打字机|She wrote her first novel on an old ___.|The clatter of the ___ filled the office.|Each key of the ___ struck the paper through an inked ribbon.|telegraph,gadget|typewriters
  sprocket|a wheel with teeth that fit into the links of a chain|链轮|The bicycle chain slipped off the ___.|Each tooth of the ___ grips a link of the chain.|The film moved through the projector on a ___.|conveyor,cylinder|sprockets
  ingenious|clever, original and well suited to its purpose|巧妙的，别出心裁的|She came up with an ___ way to water the plants while she was away.|The ___ design used rainwater to cool the building.|His solution was simple but ___.|apparatus,robotics
  gadget|a small, useful and often clever device|小器具，小玩意儿|He loves every new ___ that comes out.|This kitchen ___ peels an apple in seconds.|The spy carried a ___ that looked like a pen.|contraption,typewriter|gadgets
  robotics|the science of designing and building robots|机器人学|Our school's ___ club built a machine that sorts recycling.|Advances in ___ have changed how cars are made.|She wants to study ___ at college.|ingenious,apparatus
  cylinder|a tube-shaped chamber in an engine in which a piston moves|气缸|Each ___ of the engine holds one piston.|Fuel burns inside the ___.|A cracked ___ made the engine lose power.|sprocket,conveyor|cylinders
  `,
);

const navigation = batch(
  "words-of-navigation-at-sea",
  ["Words of Navigation at Sea", "海上航行的词"],
  ["finding the way at sea", "海上辨向"],
  `
  sextant|an instrument that measures the angle of the sun or a star above the horizon, used to find a ship's position|六分仪|The captain used a ___ to measure the height of the sun at noon.|Before satellites, every ship carried a ___.|She held the ___ to her eye and lined it up with the North Star.|astrolabe,bearing|sextants
  meridian|an imaginary line on the Earth's surface from the North Pole to the South Pole|子午线，经线|The prime ___ runs through Greenwich in London.|When the sun crosses your ___, it is noon.|Ships measured their distance east or west of a chosen ___.|bearing,knot|meridians
  bearing|the direction of something, measured as an angle from north|方位|The ship set a ___ of ninety degrees, due east.|We lost our ___ in the fog.|The navigator took a ___ on the lighthouse.|meridian,knot|bearings
  astrolabe|an old instrument used to measure the positions of the sun and stars|星盘|Sailors of the fifteenth century found their latitude with an ___.|The brass ___ was decorated with the names of stars.|Scholars in Baghdad improved the ___.|sextant,meridian|astrolabes
  knot|a unit of speed at sea, one nautical mile an hour|节（航速单位）|A ___ is a little faster than one mile an hour on land.|The ship slowed until it was moving at barely one ___.|Speed at sea is measured in this unit: one ___ is one nautical mile an hour.|bearing,meridian|knots
  cartographer|a person who draws or makes maps|地图绘制者|The ___ added the new islands to his map.|Every voyage brought the ___ fresh information.|A careful ___ marked rocks and reefs in red.|flagship,astrolabe|cartographers
  circumnavigate|to sail or travel all the way around something, especially the Earth|环航|Magellan's crew were the first to ___ the globe.|It took them three years to ___ the island.|She hopes to ___ the world alone in a small boat.|flotilla,armada|circumnavigates,circumnavigated,circumnavigation
  flagship|the ship that carries the commander of a group of ships|旗舰|The admiral sailed on the ___.|Signals from the ___ told the other ships where to turn.|When the ___ sank, the fleet was left without orders.|flotilla,armada|flagships
  armada|a large fleet of warships|舰队|The Spanish ___ sailed for England in 1588.|An ___ of a hundred ships filled the harbor.|Storms wrecked much of the ___.|flotilla,flagship|armadas
  flotilla|a small group of ships or boats|小型船队|A ___ of fishing boats followed the whales.|The ___ of canoes reached the island at dawn.|A ___ of rescue boats searched the bay.|armada,flagship|flotillas
  `,
);

const aboard = batch(
  "words-of-life-aboard-ship",
  ["Words of Life Aboard Ship", "船上生活的词"],
  ["life on a sailing ship", "帆船上的生活"],
  `
  helm|the wheel or handle used to steer a ship|舵|The captain took the ___ as the storm grew.|Two sailors held the ___ steady through the night.|Whoever is at the ___ decides where the ship goes.|keel,hatch|helms
  galley|the kitchen on a ship|船上厨房|The cook served soup from the ___.|In rough seas, pots slid across the ___ floor.|The ___ was hot, cramped and smelled of onions.|hatch,stern|galleys
  keel|the long beam along the bottom of a ship on which the rest is built|龙骨|The ___ keeps a sailing ship from tipping over.|The ship scraped its ___ on the rocks.|Builders laid the ___ first and built the hull up from it.|ballast,stern|keels
  stern|the back part of a ship|船尾|The flag flew from the ___.|Waves broke over the ___ as the ship ran before the wind.|The captain's cabin was at the ___.|keel,helm|sterns
  mutiny|a rebellion by sailors or soldiers against their officers|兵变，哗变|After months of hunger, the crew began to plan a ___.|The ___ on the Bounty is one of the most famous at sea.|The captain hanged the leaders of the ___.|ballast,quartermaster|mutinies,mutinied,mutineers
  ballast|heavy material carried low in a ship to keep it steady|压舱物|The ship carried stones as ___.|Without ___, the empty ship rolled badly in the waves.|They threw some ___ overboard to float off the sandbank.|keel,buoy
  buoy|a floating object fixed in the water to mark a danger or a channel|浮标|A red ___ marked the edge of the reef.|The boat was tied to a ___ in the bay.|Follow each ___ into the harbor.|ballast,hatch|buoys
  hatch|an opening in the deck of a ship, with a cover|舱口|Water poured through the open ___.|The sailors closed every ___ before the storm.|He climbed down through the ___ into the dark hold.|galley,helm|hatches
  deckhand|a sailor who does ordinary work on the deck of a ship|甲板水手|As a young ___, he scrubbed the deck every morning.|The ___ coiled the ropes and checked the sails.|She signed on as a ___ for the summer.|quartermaster,mutiny|deckhands
  quartermaster|on a ship, an officer in charge of steering and of supplies|舵手，军需官|The ___ handed out the day's food and water.|The ___ kept a record of every barrel in the hold.|The captain trusted his ___ above all others.|deckhand,mutiny|quartermasters
  `,
);

const perils = batch(
  "words-of-perils-at-sea",
  ["Words of Perils at Sea", "海上险境的词"],
  ["the dangers of long voyages", "远航的危险"],
  `
  scurvy|a disease caused by a lack of vitamin C, once common among sailors|坏血病|Sailors with ___ had bleeding gums and loose teeth.|Lemons and limes protected the crew from ___.|On long voyages, ___ killed more sailors than storms.|frostbite,hardship
  provisions|supplies of food and drink for a journey|食物储备，给养|The ship carried ___ for six months.|When the ___ ran low, the crew ate only biscuits.|They went ashore to buy fresh ___.|hardship,maroon
  maroon|to leave someone alone on an island or in a place they cannot escape from|放逐（到孤岛）|The pirates would ___ any sailor who broke their rules.|The storm threatened to ___ them on the reef.|Captains sometimes chose to ___ troublemakers rather than hang them.|perish,squall|marooned,maroons
  perish|to die, especially in a terrible or sudden way|死亡，丧生|Hundreds of sailors would ___ if the ship struck the rocks.|Without water, they would ___ in a week.|Many of the explorers did ___ in the ice.|maroon,frostbite|perished,perishes
  desolate|empty of people and bleak, giving a feeling of loneliness|荒凉的|They landed on a ___ shore with no trees and no water.|The ___ island had only rocks and seabirds.|After the storm, the beach looked ___.|becalmed,hardship
  frostbite|damage to the skin and flesh caused by extreme cold|冻伤|The explorers lost toes to ___.|Thick gloves protect your fingers from ___.|By the end of the march, half the men had ___.|scurvy,squall
  hardship|a condition of great difficulty or suffering, such as hunger or cold|艰难困苦|The crew faced every ___ without complaint.|Years of ___ made the settlers strong.|The ___ of the voyage is told in the captain's diary.|provisions,scurvy|hardships
  gale|a very strong wind|大风|The ___ tore the sails to shreds.|A ___ kept the ships in harbor for three days.|The forecast warned of a ___ from the north.|squall,becalmed|gales
  squall|a sudden, violent wind, often with rain or snow|暴风，飑|A ___ struck without warning and knocked over the mast.|The ___ passed as quickly as it came.|They saw a dark ___ racing across the water.|gale,frostbite|squalls
  becalmed|unable to move because there is no wind, of a sailing ship|因无风而停航的|The ship lay ___ for two weeks in the hot sun.|___ sailors watched their water barrels empty.|The fleet was ___ near the equator.|desolate,gale
  `,
);

const revolution = batch(
  "words-of-revolution",
  ["Words of Revolution", "革命的词"],
  ["revolution", "革命"],
  `
  patriot|a person who loves their country and is ready to defend it|爱国者|Each ___ in the town took up arms against the king's soldiers.|She is remembered as a ___ who risked her life for independence.|He called himself a true ___.|loyalist,insurgent|patriots,patriotic
  loyalist|a person who stays loyal to a ruler or government during a revolt|效忠者，保皇派|The ___ refused to join the rebels.|Many a ___ fled to Canada after the war.|Her father was a ___, but she sided with the revolution.|patriot,radical|loyalists
  militia|an army of ordinary citizens rather than professional soldiers|民兵|The town ___ gathered on the green at dawn.|Farmers left their fields to join the ___.|The ___ had few uniforms and fewer cannons.|insurgent,patriot|militias
  guillotine|a machine with a heavy falling blade, used for executions in the French Revolution|断头台|The king was executed by the ___ in 1793.|Crowds gathered to watch the ___ fall.|The ___ became a symbol of the Terror.|manifesto,despot|guillotines,guillotined
  insurgent|a person who fights against the government of their own country|叛乱分子，起义者|The ___ hid in the mountains.|Government troops captured an ___ leader.|Every ___ knew the risk of being caught.|militia,loyalist|insurgents
  radical|wanting great and sweeping political change; a person who wants it|激进的；激进分子|The ___ party wanted to end the monarchy altogether.|Her ideas seemed ___ at the time, but today they are common.|Each ___ in the assembly called for a republic.|loyalist,despot|radicals
  sedition|speech or action that urges people to rebel against the government|煽动叛乱|The printer was arrested for ___.|Writing against the king was treated as ___.|Laws against ___ were used to silence critics.|treason,manifesto|seditious
  treason|the crime of betraying your own country, for example by helping its enemies|叛国罪|He was tried for ___ for selling secrets to the enemy.|In those days, ___ was punished by death.|Signing the declaration was an act of ___ against the king.|sedition,insurgent|treasonous
  manifesto|a public statement of the aims and beliefs of a group|宣言|The rebels published a ___ listing their demands.|Her ___ called for free schools for every child.|Copies of the ___ were nailed to church doors.|sedition,guillotine|manifestos
  despot|a ruler with total power who often uses it cruelly|暴君，专制君主|The people rose up against the ___.|A ___ answers to no one.|The ___ jailed anyone who criticized him.|radical,patriot|despots,despotic
  `,
);

const founding = batch(
  "words-of-founding-documents",
  ["Words of Founding Documents", "建国文献的词"],
  ["founding a nation", "建立国家"],
  `
  declaration|an official public statement|宣言，声明|The ___ announced that the colonies were free.|A ___ of rights was read aloud in every town.|The ___ was signed by fifty-six delegates.|convention,preamble|declarations
  grievance|a complaint about something believed to be unfair|不满，冤情|The colonists listed every ___ against the king.|She raised her ___ at the town meeting.|Each ___ in the document begins with "He has."|declaration,sovereignty|grievances
  sovereignty|the full right of a country to govern itself|主权|The treaty recognized the ___ of the new nation.|The island fought for its ___ for fifty years.|No foreign power may take away our ___.|federal,aristocracy
  ratify|to approve a treaty or agreement formally, making it official|批准|Nine states had to ___ the new constitution.|The senate voted to ___ the treaty.|Without enough votes to ___ it, the plan failed.|enfranchise,declaration|ratified,ratifies,ratification
  preamble|an introduction to a formal document that explains its purpose|序言|The ___ begins with the words "We the People."|The ___ states why the laws that follow were written.|Students learn the ___ by heart.|declaration,convention|preambles
  federal|relating to a central government that shares power with states or provinces|联邦的|The ___ government prints the money.|Some powers are ___, and others belong to the states.|She works in a ___ office in the capital.|sovereignty,aristocracy
  convention|a formal meeting of representatives to make decisions|代表大会，会议|The ___ met in Philadelphia in the summer of 1787.|Delegates to the ___ argued for weeks.|The ___ wrote a new plan of government.|declaration,preamble|conventions
  enfranchise|to give someone the right to vote|给予选举权|The new law would ___ every adult citizen.|Women fought for decades for a law that would ___ them.|The reform did not ___ people who owned no land.|ratify,sovereignty|enfranchised,enfranchises
  aristocracy|the highest social class, made of nobles with titles and land|贵族阶层|The ___ lived in great houses and paid few taxes.|The revolution ended the power of the ___.|Members of the ___ fled abroad.|nobility,federal|aristocracies,aristocrat,aristocrats,aristocratic
  nobility|the group of people of the highest social rank, with titles such as duke or baron|贵族|The ___ owned most of the land.|The king gave titles of ___ to his friends.|Even the ___ had to pay the new tax.|aristocracy,sovereignty
  `,
);

const slavery = batch(
  "words-of-slavery-and-abolition",
  ["Words of Slavery and Abolition", "奴隶制与废奴的词"],
  ["slavery and its end", "奴隶制及其废除"],
  `
  abolition|the official ending of a law, system or practice, especially slavery|废除|The ___ of slavery in the British Empire came in 1833.|She spent her life working for ___.|The ___ of the death penalty was debated for years.|bondage,servitude
  abolitionist|a person who worked to end slavery|废奴主义者|Frederick Douglass was a famous ___.|Every ___ in the city signed the petition.|The ___ newspaper printed stories from people who had escaped.|fugitive,abolition|abolitionists
  plantation|a large farm, especially one where crops such as cotton or sugar were grown by enslaved people|种植园|The ___ grew sugar cane for export.|Enslaved workers on the ___ worked from dawn to dark.|The old ___ house is now a museum about slavery.|bondage,servitude|plantations
  bondage|the state of being a slave or being held under someone's control|奴役，束缚|She was born in ___ but died free.|The song speaks of a people in ___.|Millions were held in ___ for generations.|servitude,abolition
  liberate|to set someone free|解放|The army marched south to ___ the prisoners.|Learning to read helped ___ his mind.|The rebels hoped to ___ the island.|enslaved,manumission|liberated,liberates,liberation
  servitude|the condition of being forced to work for someone else without freedom|奴役状态|He was sold into ___ as a boy.|After seven years of ___, she was released.|The law ended ___ for debt.|bondage,plantation
  fugitive|a person who is running away, especially from the law or from slavery|逃亡者|The ___ hid in a barn by day and walked north by night.|Helping a ___ was against the law.|Every ___ dreamed of reaching Canada.|abolitionist,insurrection|fugitives
  manumission|the act of setting a slave free by the person who owned them|解放奴隶|His ___ papers proved that he was free.|Some owners granted ___ in their wills.|She saved for years to buy her own ___.|liberate,abolition
  enslaved|forced to be a slave|被奴役的|___ people were taken from Africa against their will.|The ___ workers planned their escape in secret.|Records list the names of every ___ person on the farm.|liberate,fugitive|enslave,enslaves,enslavement
  insurrection|a violent uprising against a government or authority|暴动，起义|The ___ in Haiti led to the first free Black republic.|Soldiers were sent to stop the ___.|The leaders of the ___ were captured and tried.|fugitive,manumission|insurrections
  `,
);

const factories = batch(
  "words-of-factories-and-mills",
  ["Words of Factories and Mills", "工厂与磨坊的词"],
  ["factories", "工厂"],
  `
  factory|a building where goods are made in large numbers by machines|工厂|The ___ made ten thousand shoes a week.|Her grandmother worked in a ___ that made tin cans.|Smoke rose from the ___ day and night.|mill,sweatshop|factories
  mill|a building with machines for making cloth or grinding grain|磨坊，纺织厂|The cotton ___ stood beside the river, which turned its wheel.|Children as young as eight worked in the ___.|The old ___ is now an apartment building.|factory,loom|mills
  mechanize|to change a process so that it is done by machines instead of people|使机械化|Farmers began to ___ the harvest with steam tractors.|To ___ the weaving, the owner bought fifty power looms.|Factories that did not ___ could not compete.|industrialist,output|mechanized,mechanizes,mechanization
  industrialist|a person who owns or runs a large industry|实业家|The ___ built a railway to carry his coal.|Every ___ in the city opposed the new safety law.|The ___ became one of the richest men in the country.|foreman,factory|industrialists
  foreman|a worker who is in charge of a group of other workers|工头|The ___ blew a whistle to start the shift.|She was the first woman to be made ___ at the mill.|The ___ fined anyone who arrived late.|industrialist,sweatshop|foremen
  output|the amount of something that a person, machine or factory produces|产量|The mill doubled its ___ in a year.|Steam engines raised the ___ of every factory.|The workers were paid by their ___, not by the hour.|furnace,mechanize|outputs
  loom|a machine for weaving thread into cloth|织布机|The power ___ wove cloth faster than ten weavers.|She worked at the same ___ for thirty years.|The clatter of each ___ made the mill deafening.|mill,smokestack|looms
  smokestack|a tall chimney that carries smoke away from a factory or ship|烟囱|Black smoke poured from every ___.|The tallest ___ in the city belonged to the steel works.|The ___ of the steamship rose above the deck.|furnace,loom|smokestacks
  furnace|an enclosed space in which a very hot fire is made, to melt metal or heat a building|熔炉，火炉|Iron ore was melted in a blast ___.|The ___ roared all night.|Workers shoveled coal into the ___ until their arms ached.|smokestack,output|furnaces
  sweatshop|a factory where people work long hours for very low pay in poor conditions|血汗工厂|Immigrants sewed shirts in a crowded ___.|The reporter described a ___ with no windows and one door.|Laws were passed to close every ___ in the city.|factory,foreman|sweatshops
  `,
);

const coal = batch(
  "words-of-coal-and-railways",
  ["Words of Coal and Railways", "煤与铁路的词"],
  ["coal and railways", "煤矿与铁路"],
  `
  coal|a hard black rock that burns and was the main fuel of the industrial age|煤|The engines burned tons of ___ every day.|The ___ was dug from deep underground.|Most of the city's homes were heated with ___.|soot,forge
  colliery|a coal mine and the buildings around it|煤矿|The whole village worked at the ___.|An explosion at the ___ killed forty men.|The ___ closed in 1985.|locomotive,railway|collieries
  miner|a person who works underground digging coal, metal or other materials|矿工|The ___ lit his lamp and went down the shaft.|A ___ often began work at the age of ten.|Each ___ was paid by the weight of the coal he dug.|tycoon,capitalist|miners
  locomotive|an engine that pulls a train|机车，火车头|The steam ___ pulled thirty wagons of coal.|Children ran to watch the ___ pass.|The first ___ was slower than a horse.|railway,colliery|locomotives
  railway|a track of rails on which trains run, and the system that runs them|铁路|The ___ reached the coast in 1850.|A new ___ station was built in the center of town.|The ___ cut a week's journey to a day.|locomotive,colliery|railways
  forge|a workshop with a fire for heating and shaping metal; to shape metal by heating and hammering it|锻造车间；锻造|The blacksmith worked at his ___ from dawn.|Workers would ___ the rails from red-hot iron.|Sparks flew from the ___.|coal,soot|forges,forged
  soot|black powder left in the air and on surfaces by burning coal or wood|煤烟，烟灰|The houses were black with ___.|Chimney sweeps were covered in ___.|___ from the factories darkened the sky.|smog,coal
  smog|thick, dirty air made of smoke and fog|烟雾|A yellow ___ hung over the city for days.|In the Great ___ of 1952, thousands died.|It was hard to breathe in the ___.|soot,coal|smoggy
  tycoon|a very rich and powerful person in business|大亨|The railway ___ owned half the town.|She became a shipping ___ before she was forty.|The ___ gave money to build a library.|capitalist,miner|tycoons
  capitalist|a person who uses their money to build businesses and make profit; relating to such a system|资本家；资本主义的|The ___ invested in railways and mines.|Workers and every ___ in the city disagreed about wages.|A ___ economy depends on private businesses.|tycoon,miner|capitalists,capitalism
  `,
);

const workers = batch(
  "words-of-workers-and-cities",
  ["Words of Workers and Cities", "工人与城市的词"],
  ["workers and growing cities", "工人与发展中的城市"],
  `
  union|an organized group of workers who act together to protect their rights and pay|工会|The ___ asked for a ten-hour day.|Joining the ___ could cost a worker his job.|The ___ and the owners finally signed an agreement.|reformer,tenement|unions
  unionize|to organize workers into a labor union|组织工会|The miners voted to ___.|Owners hired spies to stop workers who tried to ___.|The workers at the mill began to ___ in secret.|exploit,urbanize|unionized,unionizes
  exploit|to treat someone unfairly in order to gain from their work|剥削|The owners would ___ children because they could pay them less.|Laws were passed so employers could not ___ their workers.|He refused to ___ anyone, even if it cost him profits.|unionize,overtime|exploited,exploits,exploitation
  overtime|time worked beyond the normal hours of a job|加班|She worked three hours of ___ every night.|The union demanded extra pay for ___.|Without ___, the family could not pay the rent.|exploit,union
  tenement|a large, crowded building divided into small apartments, often in poor condition|廉租公寓|Eight people lived in two rooms of the ___.|The ___ had one toilet for every floor.|Reformers photographed each ___ to show how people lived.|slum,metropolis|tenements
  slum|a crowded, run-down area of a city where poor people live|贫民窟|Disease spread quickly through the ___.|He grew up in a ___ but became a famous doctor.|The city cleared the ___ to build new housing.|tenement,metropolis|slums
  reformer|a person who works to improve society or to correct unfair conditions|改革者|The ___ wrote about children working in mines.|Each ___ in the city called for clean water.|A ___ named Jacob Riis photographed the tenements.|union,unionize|reformers
  overcrowded|having too many people or things in a space|过度拥挤的|The ___ trains made the morning journey miserable.|Children in ___ rooms caught diseases easily.|The school was so ___ that classes met in the hall.|urbanize,slum
  urbanize|to make an area more like a city, or to move from farms to cities|城市化|As countries ___, farmland turns into streets.|Millions began to ___ during the industrial age, leaving the countryside.|The region will ___ quickly if the new railway is built.|unionize,overcrowded|urbanized,urbanizes,urbanization
  metropolis|a very large and busy city|大都市|The small port grew into a great ___.|The ___ had more than a million people by 1900.|Lights of the ___ could be seen from miles away.|slum,tenement|metropolises
  `,
);

/** batchesA are the batches of words of units 1 to 5 of grade 8. */
export const batchesA: readonly BatchSpec[] = [
  crisis,
  regret,
  structure,
  engines,
  computers,
  machineAge,
  navigation,
  aboard,
  perils,
  revolution,
  founding,
  slavery,
  factories,
  coal,
  workers,
];
