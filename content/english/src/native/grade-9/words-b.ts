// Grade 9: the batches of words of the last five units, from imagined futures, food and medicine to the customs of
// many cultures, the arts, the life of words and the academic words of the year.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const power = batch(
  "words-of-power-and-control",
  ["Words of Power and Control", "权力与控制的词"],
  ["the power of rulers and how they control people", "统治者的权力与对人的控制"],
  `
  compliance|the act of obeying a rule, an order or a request|服从，遵守|The new rules demand total ___ from every citizen.|Inspectors check the factory's ___ with safety laws.|In the novel, ___ is rewarded and questions are punished.|conformist,coerce|compliant
  indoctrinate|to teach someone to accept a set of beliefs without questioning them|灌输，洗脑|The regime used its schools to ___ children.|The cult tried to ___ new members within days.|Songs and posters were used to ___ the young.|coerce,subjugate|indoctrinates,indoctrinated,indoctrination
  autocrat|a ruler who has complete power and does not share it|独裁者，专制君主|The ___ made every decision himself.|Under the ___, no one dared to criticize the palace.|The old ___ was finally forced from power.|authoritarian,conformist|autocrats,autocratic,autocracy
  subjugate|to defeat a people and bring them fully under your control|征服，使屈服|The empire set out to ___ its neighbors.|The novel shows how a state can ___ its own citizens.|They refused to be ___ by the invaders.|indoctrinate,purge|subjugates,subjugated,subjugation
  edict|an official order given by a person in authority|法令，敕令|The king issued an ___ banning all public meetings.|By ___ of the council, the gates were closed at dusk.|The new ___ was read aloud in every square.|purge,compliance|edicts
  conformist|a person who behaves and thinks like everyone else and follows the rules without question|墨守成规的人|In a world of ___, the heroine stands out.|He was a quiet ___ who never broke a rule.|The school rewarded the ___ and punished the rebel.|autocrat,compliance|conformists,nonconformist
  coerce|to make someone do something by using force or threats|胁迫，强迫|The guards tried to ___ him into signing.|No one should be ___ into a confession.|The state used fear to ___ the people.|indoctrinate,subjugate|coerces,coerced,coercion,coercive
  repression|the use of force to control people and stop them from expressing themselves|镇压，压制|Years of ___ made the people afraid to speak.|The government's ___ of the press was condemned abroad.|The novel describes the ___ of all free thought.|purge,edict|repress,represses,repressed,repressive
  authoritarian|demanding strict obedience to authority at the expense of personal freedom|专制的，独裁主义的|The ___ government banned all newspapers but one.|Her ___ father allowed no arguments at dinner.|Many novels warn against ___ rule.|autocrat,conformist|authoritarianism
  purge|to remove people from an organization or a country, often violently, because they are thought disloyal|清洗，清除|The dictator began a ___ of the army.|Hundreds of officials were ___ after the failed revolt.|The party ___ anyone who questioned its leader.|repression,subjugate|purges,purged
  `,
);

const space = batch(
  "words-of-space-travel",
  ["Words of Space Travel", "太空旅行的词"],
  ["travel beyond the Earth", "地球之外的旅行"],
  `
  trajectory|the curved path of something moving through the air or through space|轨道，轨迹|The engineers calculated the rocket's ___ to the moon.|A small change in ___ sent the probe off course.|The ball's ___ carried it over the fence.|velocity,zenith|trajectories
  velocity|the speed of something in a given direction|速度|The capsule reached a ___ of eleven kilometers per second.|To escape Earth's pull, a rocket needs great ___.|Wind ___ is measured at the top of the tower.|propulsion,trajectory|velocities
  propulsion|the force that drives something forward|推进，推进力|The ship used a new kind of ___ to cross the galaxy.|Jet ___ changed air travel forever.|Engineers are testing solar ___ for long voyages.|thruster,velocity
  payload|the people or equipment carried by a rocket or an aircraft, beyond what it needs to fly|有效载荷|The rocket's ___ was a weather satellite.|The ___ separated from the rocket at a height of two hundred kilometers.|Each extra kilogram of ___ needs more fuel.|telemetry,thruster|payloads
  terrestrial|having to do with the Earth or with land rather than water or the sky|地球的，陆地的|___ animals live on land.|The astronauts missed ordinary ___ things, like rain.|Radio signals from ___ stations guided the ship.|celestial,colonize
  celestial|having to do with the sky or outer space|天体的，天空的|The ancient sailors steered by ___ bodies such as stars.|A ___ map showed every known planet.|The comet was a rare ___ event.|terrestrial,zenith
  colonize|to send people to live in a place and take control of it|殖民，开拓|Some scientists dream of ways to ___ Mars.|The story imagines humans who ___ distant moons.|Plants were the first to ___ the bare volcanic island.|terrestrial,payload|colonizes,colonized,colonization
  zenith|the point in the sky directly above you; or the highest point of something|天顶；顶峰|At noon the sun stood at its ___.|The empire reached its ___ under its third ruler.|Her career was at its ___ when she retired.|trajectory,celestial
  telemetry|the automatic measuring of data at a distance and its sending by radio to a receiver|遥测，遥测数据|Mission control studied the ___ from the probe.|The ___ showed that one engine was failing.|Without ___, the engineers could not tell where the satellite was.|payload,propulsion
  thruster|a small engine used to steer a spacecraft or change its position|推进器|The pilot fired a ___ to turn the ship.|One ___ failed, and the capsule began to spin.|Tiny ___ keep the satellite in its proper place.|propulsion,telemetry|thrusters
  `,
);

const minds = batch(
  "words-of-artificial-minds",
  ["Words of Artificial Minds", "人造心智的词"],
  ["robots and thinking machines", "机器人与会思考的机器"],
  `
  synthetic|made by people, often as a copy of something natural|合成的，人造的|The robot's skin was made of a ___ material.|___ fabrics such as nylon dry quickly.|The story asks whether a ___ mind can feel.|humanoid,programmable|synthetically
  sentient|able to feel and to be aware of things|有知觉的，有感情的|Is the machine in the story truly ___?|Most people agree that dogs are ___ beings.|The ship's computer became ___ and refused orders.|sapient,conscious|sentience
  conscious|aware of yourself and your surroundings; or aware of a particular thing|有意识的；意识到的|After the fall, she was still ___ but confused.|The robot slowly became ___ of its own thoughts.|He was ___ of the other students staring at him.|sentient,programmable|consciously,consciousness,unconscious,subconscious
  interface|the way a person communicates with a machine, or the point where two systems meet|界面，接口|The new ___ lets people talk to the computer.|A simple ___ makes the app easy to use.|The story describes a direct ___ between brain and machine.|cybernetic,glitch|interfaces
  cybernetic|having to do with the joining of living bodies with machines, or with control systems in both|控制论的，人机结合的|The soldier had a ___ arm that could lift a car.|___ research studies how brains and machines control movement.|The novel's hero is half human, half ___.|humanoid,interface|cybernetics
  humanoid|having the shape or the qualities of a human; or a robot shaped like a person|类人的；类人机器人|The ___ robot walked on two legs.|The aliens in the film are ___ but have green skin.|A ___ greeted visitors at the hotel.|automaton,synthetic|humanoids
  programmable|able to be given instructions so that it carries out tasks automatically|可编程的|The ___ oven starts cooking at a set time.|Early robots were simply ___ arms in factories.|The story's villain is a ___ army of drones.|synthetic,automaton
  glitch|a small fault that stops a machine or a system from working properly|小故障，失灵|A ___ in the software shut down the trains.|The robot's strange behavior began with a tiny ___.|After the ___ was fixed, the game ran smoothly.|interface,cybernetic|glitches
  sapient|wise, or able to think and reason as humans do|有智慧的，能思考的|The novel imagines ___ machines that write poetry.|Humans call themselves the ___ species.|Is a ___ robot a person in the eyes of the law?|sentient,conscious|sapience
  automaton|a machine that moves on its own like a person; or a person who acts without thinking|自动机，机器人；机械般的人|The clockmaker built an ___ that could write a letter.|He worked like an ___, never speaking.|The ___ in the museum still plays the flute.|humanoid,programmable|automata,automatons
  `,
);

const diet = batch(
  "words-of-diet-and-health",
  ["Words of Diet and Health", "饮食与健康的词"],
  ["food, diet and health", "食物、饮食与健康"],
  `
  digestion|the process by which the body breaks down food so it can be used|消化|Good bacteria in the gut help ___.|A walk after dinner is said to aid ___.|___ begins in the mouth, with saliva.|deficiency,moderation|digestive
  deficiency|a lack of something that is needed|缺乏，不足|A ___ of vitamin C causes a disease called scurvy.|The doctor found an iron ___ in her blood.|The plan's main ___ is its cost.|moderation,obesity|deficiencies,deficient
  moderation|the quality of not doing something too much|适度，节制|Sweets are fine in ___.|The doctor advised ___ in all things.|She drinks coffee, but only in ___.|abstain,deficiency
  abstain|to choose not to do or have something, especially something you enjoy|戒除，避免|He chose to ___ from sugar for a month.|Three members ___ from voting.|Athletes ___ from heavy food before a race.|moderation,dietary|abstains,abstained,abstinence
  dietary|having to do with the food you eat|饮食的|The restaurant can meet any ___ needs.|___ fiber is found in beans and grains.|Her ___ habits improved after the illness.|digestion,malnourished
  gluten|a protein found in wheat and some other grains, which makes dough stretchy|麸质，面筋|Some people cannot eat ___ and must avoid bread.|The bakery sells cakes without ___.|___ gives pizza dough its stretch.|cholesterol,insulin
  cholesterol|a fatty substance in the blood that can block arteries when there is too much of it|胆固醇|Fried foods can raise your ___.|The doctor tested his ___ every year.|High ___ increases the risk of heart disease.|gluten,obesity
  obesity|the condition of being very overweight in a way that harms health|肥胖症|Rates of childhood ___ have risen.|Exercise and diet can help prevent ___.|___ is linked to many diseases.|deficiency,cholesterol|obese
  malnourished|weak and ill because of not having enough of the right food|营养不良的|The rescued children were badly ___.|A ___ child may grow slowly.|Even people who eat a lot can be ___ if their food lacks vitamins.|dietary,obesity|malnourishment
  insulin|a substance made in the body that controls the amount of sugar in the blood|胰岛素|People with some kinds of diabetes need ___ injections.|The body makes ___ after a meal.|The discovery of ___ saved millions of lives.|gluten,cholesterol
  `,
);

const hospital = batch(
  "words-of-the-hospital",
  ["Words of the Hospital", "医院的词"],
  ["hospitals and medical care", "医院与医疗"],
  `
  diagnosis|the act of identifying an illness from its signs, or the judgment that results|诊断|The doctor's ___ was a broken wrist.|Early ___ can save lives.|After many tests, she finally got a ___.|prognosis,triage|diagnostic
  prognosis|a doctor's judgment of how an illness will develop|预后，预断|The ___ is good; he should recover fully.|The doctors gave a hopeful ___.|The ___ for the company's future is poor.|diagnosis,acute|prognoses
  acute|very serious or severe, coming on quickly; or sharp and keen|急性的；敏锐的|She was rushed to hospital with ___ pain.|There is an ___ shortage of nurses.|Owls have ___ hearing.|clinical,ailment|acutely
  dosage|the amount of a medicine to be taken at one time|剂量|Follow the ___ on the label.|The doctor lowered the ___ when he felt dizzy.|A child's ___ is smaller than an adult's.|anesthetic,incision|dosages
  surgical|having to do with operations on the body|外科的，手术的|The nurse wore a ___ mask.|___ tools must be cleaned carefully.|The ___ team worked through the night.|clinical,incision|surgically
  clinical|having to do with the examination and treatment of patients; or cold and without feeling|临床的；冷静客观的|The drug is now in ___ trials.|She spoke of the accident in a ___, unemotional voice.|The ___ staff work in shifts.|surgical,acute|clinically,clinic,clinics
  anesthetic|a drug that stops a person from feeling pain|麻醉剂|The dentist gave her a local ___.|Before the operation, he was given a general ___.|The ___ wore off after an hour.|dosage,incision|anesthetics,anesthesia
  incision|a cut made in the body during an operation|切口|The surgeon made a small ___ in his side.|The ___ healed in two weeks.|Modern methods need only a tiny ___.|surgical,anesthetic|incisions
  ailment|an illness, usually a minor one|小病，疾病|Grandmother treated every ___ with tea and honey.|Colds and other common ___ fill the clinic in winter.|He suffered from a strange ___ of the skin.|acute,prognosis|ailments
  triage|the sorting of patients by how urgently they need treatment|伤员分类，分诊|The nurse at ___ sent him straight to a doctor.|After the crash, doctors set up ___ in a tent.|___ means the most serious cases are treated first.|diagnosis,clinical
  `,
);

const body = batch(
  "words-of-the-body-and-brain",
  ["Words of the Body and Brain", "身体与大脑的词"],
  ["the body and the brain", "身体与大脑"],
  `
  neuron|a cell that carries messages through the brain and the nerves|神经元|The brain has about eighty billion ___.|Each ___ can connect to thousands of others.|A ___ sends signals with tiny bursts of electricity.|synapse,cortex|neurons
  cortex|the outer layer of the brain, where thinking happens|大脑皮层|The ___ helps us plan and reason.|Damage to the ___ can affect speech.|The visual ___ processes what we see.|cerebral,neuron|cortexes,cortices
  synapse|the tiny gap between two nerve cells, across which signals pass|突触|Signals jump across the ___ in a fraction of a second.|Learning makes new ___ form in the brain.|Each ___ connects two neurons.|neuron,tendon|synapses
  cardiac|having to do with the heart|心脏的|He was taken to hospital after ___ arrest.|The ___ ward is on the third floor.|Regular exercise improves ___ health.|respiratory,cerebral
  respiratory|having to do with breathing|呼吸的|Smoking causes ___ disease.|Colds are a common ___ infection.|The ___ system includes the lungs.|cardiac,skeletal
  skeletal|having to do with the bones of the body; or very thin|骨骼的；骨瘦如柴的|The ___ system supports the body.|The ___ remains of a dinosaur were found in the cliff.|After the illness he looked almost ___.|cartilage,vertebra
  cerebral|having to do with the brain; or using the mind rather than feelings|大脑的；理性的|A ___ injury can affect memory.|Chess is a very ___ game.|Her ___ films are admired more than loved.|cortex,cardiac
  vertebra|one of the small bones that form the backbone|脊椎骨|He cracked a ___ in the fall.|Each ___ protects part of the spinal cord.|The snake's back has hundreds of ___.|skeletal,cartilage|vertebrae
  cartilage|the strong, flexible tissue found in joints and in the nose and ears|软骨|The ___ in her knee was damaged.|Your ears are shaped by ___.|Sharks have skeletons of ___, not bone.|tendon,vertebra
  tendon|a strong band of tissue that joins a muscle to a bone|肌腱|The runner tore a ___ in her ankle.|The Achilles ___ is the strongest in the body.|A strained ___ can take weeks to heal.|cartilage,synapse|tendons
  `,
);

const custom = batch(
  "words-of-tradition-and-custom",
  ["Words of Tradition and Custom", "传统与习俗的词"],
  ["traditions and customs", "传统与习俗"],
  `
  taboo|something that a culture forbids people to do or to talk about|禁忌|In some cultures, it is ___ to say a dead person's name.|Speaking about money was ___ in her family.|The novel breaks every ___ of its time.|etiquette,observance|taboos
  etiquette|the rules of polite behavior in a group or a setting|礼节，礼仪|Table ___ differs from country to country.|It is poor ___ to arrive late.|She studied the ___ of the royal court.|taboo,ceremonial
  pageant|a public show in which people in costume act out history or a story|露天表演，盛会|The town held a ___ about its founding.|Children dressed as kings for the ___.|The New Year ___ fills the streets with color.|procession,garland|pageants,pageantry
  procession|a line of people or vehicles moving slowly as part of a ceremony|行列，队伍|A wedding ___ wound through the village.|The funeral ___ stretched for a mile.|Lanterns lit the ___ through the night.|pageant,observance|processions
  elder|an older person who is respected and has authority in a group|长者，长辈|The village ___ settled the quarrel.|Children were taught to listen to their ___.|Each ___ told a story at the festival.|kinsfolk,garland|elders
  ceremonial|used in or having to do with a formal ceremony|礼仪的，仪式的|The chief wore a ___ headdress.|The ___ sword is never used in battle.|The mayor's role is mostly ___.|etiquette,observance|ceremonially,ceremony,ceremonies
  observance|the keeping of a law, custom or religious practice; or a ceremony that marks a special day|遵守；仪式|The ___ of the holiday includes a fast.|Strict ___ of the rules was expected.|The annual ___ honors those who died in the war.|ceremonial,taboo|observances,observant
  dowry|money or goods that a bride's family gives to the groom when she marries, in some cultures|嫁妆|Her ___ included land and three horses.|The custom of the ___ is fading in many places.|The play's plot turns on a missing ___.|garland,kinsfolk|dowries
  kinsfolk|a person's relatives|亲属，亲戚|All his ___ came to the wedding.|She returned to live among her ___.|The old man had no ___ left in the town.|elder,dowry
  garland|a ring of flowers or leaves worn on the head or hung as a decoration|花环|Each guest was given a ___ of flowers.|___ of leaves hung over the door for the festival.|The winner was crowned with a laurel ___.|pageant,dowry|garlands
  `,
);

const wisdom = batch(
  "words-of-folk-wisdom",
  ["Words of Folk Wisdom", "民间智慧的词"],
  ["sayings and folk wisdom", "俗语与民间智慧"],
  `
  proverb|a short, well-known saying that gives advice or states a truth|谚语|"Look before you leap" is a ___.|Every culture has a ___ about patience.|Her grandmother answered every question with a ___.|maxim,adage|proverbs,proverbial
  maxim|a short statement of a general rule or principle|格言，准则|His ___ was "never borrow money."|The old ___ "honesty is the best policy" still holds.|She lived by a simple ___: work hard and be kind.|proverb,aphorism|maxims
  adage|an old saying that is widely believed to be true|古训，谚语|As the ___ goes, time is money.|The ___ "practice makes perfect" proved true.|She remembered the old ___ about counting chickens.|proverb,maxim|adages
  parable|a short, simple story that teaches a moral or a spiritual lesson|寓言，比喻|The teacher told a ___ about two builders.|The ___ of the lost sheep is well known.|His speech ended with a ___ about patience.|folklore,adage|parables
  folklore|the traditional stories, beliefs and customs of a people, passed down by word of mouth|民间传说|In local ___, the lake is home to a dragon.|She collects the ___ of mountain villages.|Many fairy tales come from European ___.|parable,proverb|folklorist
  sage|a very wise person, often an old one|智者，圣人|People traveled for miles to ask the ___ for advice.|The ___ answered with a riddle.|In the story, a ___ guides the young king.|wit,shrewd|sages
  shrewd|clever at understanding situations and making good judgments, especially for your own advantage|精明的|The ___ merchant never lost a deal.|It was a ___ move to sell before prices fell.|She gave him a ___ look.|prudent,wit|shrewdly,shrewdness
  prudent|careful and sensible, thinking of what may happen in the future|谨慎的，审慎的|It is ___ to save some money each month.|A ___ traveler carries water in the desert.|The ___ choice was to wait for the storm to pass.|shrewd,sage|prudently,prudence
  aphorism|a short, clever saying that expresses a general truth|格言，警句|"Less is more" is a famous ___.|His essays are full of witty ___.|The ___ fit neatly on a poster.|maxim,proverb|aphorisms
  wit|the ability to say clever and amusing things; or a person known for this|机智，风趣；机智的人|Her quick ___ made everyone laugh.|He was a famous ___ who wrote for a magazine.|The play is full of ___ and charm.|shrewd,sage|wits,witty
  `,
);

const art = batch(
  "words-of-art-and-criticism",
  ["Words of Art and Criticism", "艺术与评论的词"],
  ["art and the judging of art", "艺术与艺术评论"],
  `
  aesthetic|having to do with beauty and art; or a particular set of ideas about what is beautiful|美学的；审美观|The building has great ___ appeal.|The director's ___ is dark and dreamlike.|She chose the colors for ___ reasons, not practical ones.|composition,kitsch|aesthetics,aesthetically
  realism|a style of art or writing that shows things as they really are|现实主义|The novel is admired for its gritty ___.|Painters of ___ showed workers in the fields.|The film's ___ makes the war feel close.|impressionism,caricature|realist,realistic
  impressionism|a style of painting that shows the effect of light and color with quick brushstrokes|印象派|___ began in France in the 1870s.|The painting's soft colors are typical of ___.|Critics first mocked ___ but later loved it.|realism,avant-garde|impressionist,impressionists
  composition|the way the parts of a picture or a work are arranged; or a piece of music or writing|构图；作品|The ___ of the photograph draws your eye to the child.|The pianist played her own ___.|A good ___ balances light and dark areas.|aesthetic,pastiche|compositions
  connoisseur|a person who knows a lot about an art and can judge its quality|鉴赏家，行家|A ___ of tea can tell where the leaves were grown.|The painting fooled even the ___.|He was a ___ of old maps.|avant-garde,aesthetic|connoisseurs
  avant-garde|new and experimental, ahead of its time in art or ideas|前卫的，先锋派的|The ___ play had no plot at all.|___ artists rejected the old rules.|Her music was too ___ for the audience.|impressionism,kitsch
  kitsch|art or objects that are cheap, showy and in poor taste, sometimes enjoyed as a joke|俗气的艺术品|The shop was full of ___: plastic flamingos and glowing saints.|Some people collect ___ for fun.|The film's set is deliberately ___.|aesthetic,parody|kitschy
  parody|a piece of writing, music or art that copies another in a funny way|戏仿，模仿作品|The comedy is a ___ of spy films.|She wrote a ___ of a famous poem.|The show's ___ of politicians made everyone laugh.|pastiche,caricature|parodies,parodied
  pastiche|a work that imitates the style of another work, artist or period|模仿作品，混成作品|The novel is a ___ of Victorian mysteries.|The building is a ___ of several styles.|His music is a clever ___ of 1960s pop.|parody,composition|pastiches
  caricature|a drawing or a description that exaggerates someone's features for a funny effect|漫画，讽刺画|The artist drew a ___ of the president with huge ears.|The villain is a ___, not a real person.|Street artists draw quick ___ of tourists.|parody,realism|caricatures
  `,
);

const music = batch(
  "words-of-music-and-performance",
  ["Words of Music and Performance", "音乐与演出的词"],
  ["music and performance", "音乐与演出"],
  `
  crescendo|a gradual increase in loudness in music; or the point of greatest intensity|渐强；高潮|The music rose to a ___.|The ___ of applause filled the hall.|The protests reached a ___ in May.|overture,aria|crescendos
  symphony|a long piece of music for an orchestra, usually in four parts|交响乐|The orchestra played Beethoven's Ninth ___.|The ___ ended with a great crash of drums.|The city ___ gives free concerts in summer.|sonata,concerto|symphonies,symphonic
  virtuoso|a person who is extremely skilled at playing music or at some other art|大师，演奏名家|The young ___ played the violin like no one else.|She is a ___ of the guitar.|His ___ performance amazed the judges.|repertoire,aria|virtuosos,virtuosity
  aria|a song for one voice in an opera|咏叹调|The soprano sang the famous ___.|The ___ moved the audience to tears.|The opera's best ___ comes in the third act.|libretto,overture|arias
  libretto|the words of an opera or a musical|歌剧剧本，歌词|The ___ was written by a poet.|You can follow the story in the ___.|The ___ is in Italian, with English subtitles above the stage.|aria,sonata|librettos,libretti
  overture|a piece of music played at the start of an opera or a ballet; or a first offer to begin talks|序曲；提议|The orchestra played the ___ before the curtain rose.|The ___ hints at the tunes to come.|The country made peace ___ to its neighbor.|crescendo,libretto|overtures
  sonata|a piece of music for one instrument, or for one instrument with a piano|奏鸣曲|She played a Mozart ___ at the recital.|The ___ has three movements.|He composed a ___ for cello.|symphony,concerto|sonatas
  concerto|a piece of music for one or more solo instruments and an orchestra|协奏曲|The pianist played a ___ with the city orchestra.|In a ___, the soloist and orchestra take turns.|She practiced the violin ___ for months.|symphony,sonata|concertos
  improvise|to make something up on the spot without preparation|即兴创作，临时凑成|Jazz musicians often ___ solos.|When the lights failed, the actors had to ___.|They ___ a tent from a sheet and a rope.|repertoire,virtuoso|improvises,improvised,improvisation
  repertoire|all the pieces that a performer or a group knows and can perform|全部曲目，保留剧目|The singer's ___ includes folk songs and opera.|The company added three new plays to its ___.|His ___ of jokes was endless.|virtuoso,improvise|repertoires
  `,
);

const film = batch(
  "words-of-film",
  ["Words of Film", "电影的词"],
  ["the making of films", "电影制作"],
  `
  cinematography|the art of filming a movie: lighting, camera angles and movement|电影摄影术|The film won an award for its ___.|The ___ makes the desert look endless.|Students study the ___ of old black-and-white films.|montage,storyboard|cinematographer
  montage|a series of short shots edited together to show time passing or to build a mood|蒙太奇，剪辑|A ___ shows the boxer training for months.|The film opens with a ___ of city life.|The ___ is set to fast music.|sequence,cinematography|montages
  sequence|a series of related events or things in a particular order; or a section of a film|顺序；片段|The chase ___ lasts ten minutes.|Put the pictures in the right ___.|The ___ of events is hard to follow.|montage,sequel|sequences,sequential
  soundtrack|the music and sound recorded for a film|电影原声，配乐|The ___ became more famous than the film.|She bought the ___ on the day it came out.|The eerie ___ makes the scene frightening.|screenplay,premiere|soundtracks
  screenplay|the written script of a film, with dialogue and directions|电影剧本|She wrote the ___ in three months.|The ___ was based on a novel.|He won an award for best ___.|storyboard,soundtrack|screenplays
  sequel|a film, book or game that continues the story of an earlier one|续集|The ___ was even better than the first film.|Fans are waiting for the ___.|The novel's ___ takes place ten years later.|premiere,sequence|sequels
  premiere|the first public showing of a film or a play|首映，首演|The stars walked the red carpet at the ___.|The play's ___ was sold out.|The film will ___ in Paris.|sequel,documentary|premieres,premiered
  documentary|a film or a program that presents facts about real people and events|纪录片|The ___ follows a family of wolves.|She made a ___ about ocean pollution.|The ___ uses interviews with survivors.|premiere,screenplay|documentaries
  subtitle|words at the bottom of a screen that translate or record what is said|字幕|The film is in Korean with English ___.|Turn on the ___ if you cannot hear.|The ___ appeared too fast to read.|soundtrack,storyboard|subtitles,subtitled
  storyboard|a series of drawings that show the planned shots of a film|故事板，分镜头脚本|The director sketched a ___ for every scene.|The ___ showed where each camera would go.|Artists drew the ___ before filming began.|screenplay,cinematography|storyboards
  `,
);

const language = batch(
  "words-of-language-and-its-history",
  ["Words of Language and Its History", "语言及其历史的词"],
  ["language and the history of words", "语言与词汇的历史"],
  `
  etymology|the origin and history of a word|词源|The ___ of "salary" goes back to the Latin word for salt.|A good dictionary gives each word's ___.|She loves tracing the ___ of place names.|lexicon,coinage|etymologies,etymological
  lexicon|all the words of a language, or of a person or a subject|词汇，词典|The ___ of English keeps growing.|"Selfie" has entered the ___.|Each science has its own ___.|etymology,syntax|lexicons
  neologism|a newly invented word or expression|新词|"Podcast" was once a ___.|Writers like Shakespeare created many ___.|The dictionary added a hundred ___ this year.|coinage,loanword|neologisms
  archaic|very old or no longer in use|古老的，过时的|"Thou" is an ___ form of "you."|The law is ___ and should be changed.|The ___ spelling made the old letter hard to read.|phonetic,neologism
  loanword|a word taken from another language|外来词|"Kindergarten" is a ___ from German.|English has thousands of ___ from French.|"Tea" is a ___ from Chinese.|neologism,creole|loanwords
  coinage|a newly invented word or phrase; or the making of new words|新造词；造词|"Cyberspace" was a ___ of the 1980s.|The poet's ___ caught on quickly.|Many technical words are recent ___.|neologism,etymology|coinages
  syntax|the way words are arranged to form sentences|句法|Yoda's ___ is unusual: "Strong you are."|The poem's twisted ___ slows the reader down.|Each language has its own rules of ___.|lexicon,phonetic|syntactic
  phonetic|having to do with the sounds of speech|语音的|The dictionary gives a ___ spelling of each word.|Spanish spelling is more ___ than English spelling.|The ___ alphabet has a symbol for every sound.|syntax,archaic|phonetically,phonetics
  pidgin|a simple language made from two or more languages, used by people who share no common tongue|洋泾浜语，混杂语言|Traders spoke a ___ of English and Chinese.|A ___ has a small vocabulary and simple grammar.|The sailors used a ___ to bargain at the port.|creole,loanword|pidgins
  creole|a language that grew from a pidgin and became the first language of a community|克里奥尔语|Haitian ___ is spoken by millions.|Children turned the pidgin into a full ___.|The island's ___ mixes French and African languages.|pidgin,lexicon|creoles
  `,
);

const academic4 = batch(
  "academic-words-4",
  ["Academic Words 4", "学术词汇 4"],
  ["thinking and arguing in school", "学业中的思考与论证"],
  `
  analyze|to examine something in detail in order to understand it|分析|We will ___ the poem line by line.|Scientists ___ the water samples in a lab.|The coach ___ the video of the game.|synthesize,assess|analyzes,analyzed,analysis,analyses,analytical
  assess|to judge the quality, size or value of something|评定，评估|Teachers ___ students' progress each term.|Experts came to ___ the damage after the storm.|It is hard to ___ how much the plan will cost.|validate,scrutinize|assesses,assessed,assessment,assessments
  validate|to prove or confirm that something is true or correct|证实，确认|The experiment ___ her theory.|You must ___ your ticket before boarding.|The results have not yet been ___ by other scientists.|assess,postulate|validates,validated,validation,validity
  synthesize|to combine separate ideas or things into a whole|综合，合成|A good essay ___ ideas from several sources.|Plants ___ sugar from sunlight.|She ___ the reports into one summary.|analyze,elucidate|synthesizes,synthesized,synthesis
  scrutinize|to examine something very carefully|仔细检查，审查|The editor ___ every line of the article.|Voters should ___ each candidate's record.|He ___ the painting for signs of forgery.|assess,analyze|scrutinizes,scrutinized,scrutiny
  postulate|to suggest that something is true as a basis for reasoning|假定，假设|Scientists ___ that the planet once had water.|The theory ___ a hidden ninth planet.|Euclid ___ that two points fix a single straight line.|hypothesize,validate|postulates,postulated
  elucidate|to make something clear by explaining it|阐明，解释|The teacher ___ the difficult passage.|Can you ___ what you mean?|The notes ___ the poem's references.|delineate,contextualize|elucidates,elucidated
  contextualize|to place something in its setting so that it can be understood|将……置于背景中考虑|To understand the speech, we must ___ it in its time.|The museum labels ___ each object.|The historian ___ the letter within the war.|elucidate,synthesize|contextualizes,contextualized
  hypothesize|to suggest an explanation that can then be tested|假设，假定|Students ___ that plants grow faster in light.|Researchers ___ that the disease spreads through water.|She ___ about why the experiment failed.|postulate,validate|hypothesizes,hypothesized,hypothetical
  delineate|to describe or mark something clearly and in detail|描绘，勾画|The report ___ the duties of each worker.|A fence ___ the border of the farm.|The essay ___ the stages of the war.|elucidate,scrutinize|delineates,delineated
  `,
);

const academic5 = batch(
  "academic-words-5",
  ["Academic Words 5", "学术词汇 5"],
  ["reasoning about texts and data", "文本与数据的推理"],
  `
  context|the situation or the words around something that help explain its meaning|上下文，背景|Use ___ clues to guess the meaning of a new word.|The quotation was taken out of ___.|In the ___ of the war, the decision makes sense.|implicit,salient|contexts,contextual
  implicit|suggested but not stated directly|含蓄的，暗示的|There was an ___ threat in his words.|The poem's message is ___, not stated.|Her ___ trust in him was clear.|explicit,tenuous|implicitly
  explicit|stated clearly and directly, leaving no doubt|明确的，清楚的|The instructions were ___: no phones in the exam.|The author makes the theme ___ in the last line.|He gave ___ permission to use the photo.|implicit,coherent|explicitly
  qualitative|having to do with quality or kind rather than amount|定性的，质量的|The study collected ___ data from interviews.|There is a ___ difference between the two paintings.|___ research asks people about their experiences.|quantitative,salient|qualitatively
  quantitative|having to do with amounts that can be measured or counted|定量的，数量的|The survey produced ___ data in charts.|___ research uses numbers and statistics.|We need a ___ measure of success.|qualitative,arbitrary|quantitatively
  coherent|clear and logical, with parts that fit together|连贯的，条理清楚的|Her essay makes a ___ argument.|After the fall he was not ___.|The plan lacks a ___ purpose.|cogent,explicit|coherently,coherence,incoherent
  arbitrary|based on chance or personal whim rather than on reason or a rule|任意的，武断的|The choice of date seemed ___.|The ruler's ___ decisions angered the people.|Grades should not be ___.|tenuous,quantitative|arbitrarily
  salient|most noticeable or most important|显著的，最重要的|Summarize the ___ points of the article.|The ___ feature of the building is its tower.|She listed the ___ facts for the jury.|cogent,context
  tenuous|very weak or slight|薄弱的，站不住脚的|The link between the two events is ___.|His hold on power was ___.|The evidence for the claim is ___.|arbitrary,implicit|tenuously
  cogent|clear, logical and convincing|有说服力的|She made a ___ case for the new park.|The essay offers ___ evidence.|His argument was so ___ that no one objected.|coherent,salient|cogently,cogency
  `,
);

/** batchesB are the batches of words of the last five units of grade 9. */
export const batchesB: readonly BatchSpec[] = [
  power,
  space,
  minds,
  diet,
  hospital,
  body,
  custom,
  wisdom,
  art,
  music,
  film,
  language,
  academic4,
  academic5,
];
