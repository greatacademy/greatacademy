// Grade 7: the batches of words of the last five units and of public health, from money and markets, stories of
// tomorrow and voices for change to flight and the news.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const publicHealth = batch(
  "words-of-public-health",
  ["Words of Public Health", "公共卫生的词"],
  ["public health and the fight against disease", "公共卫生与抗击疾病"],
  `
  sanitation|keeping places clean and healthy, especially by removing waste and providing clean water|卫生设施，环境卫生|Good ___ ended the cholera outbreaks in the city.|Without ___, diseases spread through dirty water.|The new sewers were a great step for ___.|prevention,mortality
  mortality|the number of deaths in a group or a time|死亡率|Child ___ fell when clean water reached the villages.|The ___ of the disease was very high.|Doctors studied the ___ in each part of the city.|sanitation,pathogen
  prevention|stopping something bad before it happens|预防|___ is better than cure.|Fire ___ starts with working alarms.|Washing hands is the simplest form of ___.|sanitation,disinfect
  disinfect|to clean something with a substance that kills germs|消毒|Nurses ___ the beds between patients.|We ___ the tables after lunch.|Always ___ a wound before you cover it.|vaccinate,inject|disinfected,disinfects
  pathogen|a germ, such as a virus or a bacterium, that causes disease|病原体|A ___ entered the body through a small cut.|Scientists found the ___ that caused the fever.|Soap breaks apart the outer layer of many a ___.|mortality,smallpox|pathogens
  smallpox|a deadly disease, now ended, that caused fever and spots on the skin|天花|___ killed millions of people before the vaccine.|In 1980, the world was declared free of ___.|Jenner noticed that milkmaids rarely caught ___.|cholera,pathogen
  cholera|a disease spread by dirty water that causes severe sickness of the stomach|霍乱|John Snow traced the ___ to one water pump.|___ spread fast in cities without clean water.|Clean water ended the ___ outbreaks.|smallpox,sanitation
  vaccinate|to give someone a vaccine to protect them from a disease|接种疫苗|Doctors ___ babies against measles.|The clinic will ___ everyone over sixty first.|It is important to ___ pets against rabies.|disinfect,inject|vaccinated,vaccinates
  inject|to put a liquid into the body with a needle|注射|The nurse will ___ the medicine into your arm.|Doctors ___ insulin for people with diabetes.|Some snakes ___ poison when they bite.|vaccinate,disinfect|injected,injects
  fatal|causing death|致命的|Without treatment, the disease was often ___.|The fall from the cliff could have been ___.|A ___ mistake ended the expedition.|pathogen,mortality
  `,
);

const money = batch(
  "words-of-money",
  ["Words of Money", "金钱的词"],
  ["money: earning, saving and borrowing", "金钱：挣钱、存钱与借钱"],
  `
  loan|money that someone borrows and must pay back|贷款，借款|She took out a ___ to buy a car.|The bank gave the farmer a ___ for new seeds.|He paid back the ___ in two years.|debt,interest|loans
  interest|money paid for borrowing money, or earned on money saved|利息|The bank pays ___ on money in a savings account.|If you borrow, you pay ___ on top of the loan.|The ___ on the loan was five percent a year.|income,inflation
  income|money that a person or a business receives, especially from work|收入|Her ___ rose when she got a new job.|Most of the family's ___ came from the farm.|People with a low ___ may pay less tax.|wages,expense|incomes
  inflation|a general rise in prices, so that money buys less|通货膨胀|Because of ___, bread costs more than it did last year.|High ___ makes it hard for families to save.|The bank raised its rates to slow ___.|interest,investment
  investment|money put into something in the hope of making more money|投资|Buying the shop was a good ___.|An ___ in education pays off for years.|The company made a large ___ in new machines.|savings,loan|investments
  debt|money that you owe someone|债务|He worked two jobs to pay off his ___.|The country was deep in ___ after the war.|She was careful never to go into ___.|loan,tax|debts
  tax|money that people and businesses must pay to the government|税|The ___ on gasoline pays for the roads.|Workers pay ___ on what they earn.|The city raised the ___ to build a new school.|wages,debt|taxes
  wages|money paid to a worker, usually by the hour or the week|工资，工钱|Her ___ are paid every Friday.|The workers asked for higher ___.|He saved his ___ from the summer job.|income,tax
  expense|money spent on something; a cost|费用，开支|Rent is the family's biggest ___.|The trip was worth the ___.|Keep a list of every ___ this month.|income,investment|expenses
  savings|money that has been kept to use later|储蓄，存款|She used her ___ to buy a bicycle.|He keeps his ___ in the bank.|After a year, their ___ had doubled.|investment,expense
  `,
);

const business = batch(
  "words-of-business",
  ["Words of Business", "商业的词"],
  ["businesses and how they work", "企业及其运作"],
  `
  entrepreneur|a person who starts a business and takes the risk of it|企业家，创业者|The young ___ sold her first cakes at a market stall.|An ___ must be ready to fail and try again.|He became an ___ at sixteen.|shareholder,competitor|entrepreneurs
  revenue|the money a business takes in from selling things|收入，营业额|The shop's ___ doubled in the holiday season.|Ticket sales were the club's main ___.|The company's ___ fell when prices dropped.|corporation,monopoly
  competitor|a person or company trying to win or sell more than another|竞争者|The bakery opened next door to its biggest ___.|Every ___ cut its prices.|She shook hands with each ___ before the race.|customer,entrepreneur|competitors
  monopoly|complete control of a product or service by one company|垄断|With a ___ on salt, the king could set any price.|The law broke up the railroad's ___.|When one company has a ___, customers have no choice.|franchise,revenue|monopolies
  retail|the sale of goods to the public in shops|零售|She works in ___, at a shoe store.|The ___ price is higher than what the shop paid.|Online shopping changed ___ forever.|wholesale,franchise
  wholesale|the sale of goods in large amounts to shops, which then sell them to the public|批发|The shop buys rice ___ and sells it by the bag.|___ prices are lower than shop prices.|The farmer sells his apples to a ___ market.|retail,monopoly
  franchise|the right to sell a company's goods or services under its name|特许经营权|He bought a ___ of a famous burger chain.|Each ___ must follow the company's rules.|The team's ___ moved to another city.|monopoly,corporation|franchises
  shareholder|a person who owns part of a company|股东|Each ___ gets a vote at the yearly meeting.|The company sent every ___ a report.|She became a ___ when she bought ten shares.|entrepreneur,customer|shareholders
  customer|a person who buys goods or services|顾客|The ___ asked for a smaller size.|Every ___ got a free sample.|A happy ___ comes back.|competitor,shareholder|customers
  corporation|a large company recognized by law as one body|公司，企业|The ___ has offices in twenty countries.|A ___ can sign contracts like a person.|She works for a big ___ in the city.|franchise,revenue|corporations
  `,
);

const choices = batch(
  "words-of-choices-and-costs",
  ["Words of Choices and Costs", "选择与代价的词"],
  ["the choices people make with money", "人们在金钱上的选择"],
  `
  incentive|something that makes people want to do something|激励，诱因|A free drink was an ___ to buy the meal.|Good grades are an ___ to keep studying.|The town offered an ___ to people who planted trees.|tradeoff,priority|incentives
  tradeoff|a balance between two things you cannot have at the same time|权衡，取舍|There is a ___ between speed and safety.|Buying the cheaper bike was a ___: it was heavier.|Every choice has a ___.|incentive,opportunity|tradeoffs
  necessity|something that you must have|必需品|Water is a ___, but soda is not.|A coat is a ___ in a cold winter.|She bought only the bare ___ for the trip.|priority,value|necessities
  afford|to have enough money to pay for something|买得起，负担得起|We cannot ___ a new car this year.|He saved for months so he could ___ the guitar.|Can the school ___ a trip to the coast?|splurge,cost|afforded,affords
  priority|something that is more important than other things|优先事项|Safety is our first ___.|Paying the rent is a ___ before buying games.|Homework should be your ___ tonight.|necessity,incentive|priorities
  opportunity|a chance to do something|机会|The summer job is a great ___ to save money.|Don't miss the ___ to see the whales.|She had the ___ to study abroad.|tradeoff,value|opportunities
  cost|the amount of money needed to buy or do something|成本，费用|The ___ of the trip is two hundred dollars.|The ___ of food rose last year.|What will it ___ to fix the roof?|value,afford|costs
  value|how much something is worth|价值|The ___ of the old coin is more than a hundred dollars.|This jacket is good ___ for its price.|Houses near the park went up in ___.|cost,necessity
  frugal|careful not to spend more money than needed|节俭的|A ___ shopper compares prices before buying.|My grandmother was ___ and wasted nothing.|By being ___, they saved enough for a holiday.|splurge,afford
  splurge|to spend a lot of money on something you enjoy|挥霍，大肆花钱|We decided to ___ on a fancy dinner for her birthday.|He saved all year and then had one big ___.|Don't ___ your whole allowance on candy.|frugal,afford|splurged,splurges
  `,
);

const sciFi = batch(
  "words-of-science-fiction",
  ["Words of Science Fiction", "科幻的词"],
  ["science fiction and the future", "科幻与未来"],
  `
  dystopia|an imagined society where life is unfair, frightening or controlled|反乌托邦|In the novel's ___, people may not choose their own jobs.|The film shows a ___ where no one can trust anyone.|A ___ warns readers about where the world could go.|utopia,cyborg|dystopias
  utopia|an imagined perfect society|乌托邦|The founders hoped to build a ___ on the island.|In a ___, no one is hungry or poor.|Her ___ turned out to have a dark secret.|dystopia,android|utopias
  robot|a machine that can do tasks on its own, often controlled by a computer|机器人|The ___ swept the floor while we slept.|In the story, a ___ learns to feel.|Factories use a ___ to weld car parts.|android,clone|robots
  android|a robot made to look and act like a human|人形机器人|The ___ looked so real that no one guessed.|She asked the ___ whether it could dream.|The ___ smiled, but its eyes did not.|robot,cyborg|androids
  futuristic|very modern, as if from the future|未来派的，超现代的|The city had ___ towers of glass.|He wore ___ silver boots to the party.|The car's design looked ___.|artificial,alien
  clone|an exact copy of a living thing made from its cells|克隆体；克隆|In the story, each soldier is a ___ of the same man.|Scientists made a ___ of a sheep named Dolly.|The ___ had all of her memories.|android,cyborg|clones,cloned
  artificial|made by people, not by nature|人造的，人工的|The ship's garden grew under ___ light.|___ intelligence lets computers learn.|The lake is ___; it was dug in 1950.|futuristic,alien
  cyborg|a being that is part human and part machine|半机械人，赛博格|The ___ had a metal arm and a human heart.|After the accident, he became a ___.|In the story, a ___ must decide which side he is on.|clone,robot|cyborgs
  alien|a creature from another planet; also strange and unfamiliar|外星生物；陌生的|The ___ stepped out of the shining ship.|The new city felt ___ to her.|Scientists listen for signals from ___ life.|cyborg,android|aliens
  teleport|to move instantly from one place to another, as in science fiction|瞬间移动|In the game, you can ___ across the map.|The crew used a machine to ___ to the planet.|I wish I could ___ to school.|clone,alien|teleported,teleports
  `,
);

const controlled = batch(
  "words-of-controlled-societies",
  ["Words of Controlled Societies", "受控社会的词"],
  ["the controlled societies of dystopian stories", "反乌托邦故事中的受控社会"],
  `
  surveillance|close watching of a person or a place, often by a government|监视|Cameras kept the city under constant ___.|The spy was under ___ for months.|In the novel, ___ is everywhere, even in homes.|censorship,dissent
  conformity|behaving the same way as everyone else, following the rules of a group|顺从，遵从|The school prized ___ over new ideas.|In the story, ___ is enforced with fear.|She refused the ___ that the council demanded.|uniformity,obedience
  regime|a government, especially one that is strict and not chosen freely|政权|The ___ controlled the newspapers.|People fled the cruel ___.|The ___ fell after the people rose up.|tyranny,surveillance|regimes
  obedience|doing what you are told by a rule or a person in power|服从|The children were taught complete ___.|The dog's ___ won it a prize.|The ruler demanded ___ from every citizen.|conformity,defy
  censorship|stopping people from reading, hearing or saying certain things|审查制度|Under ___, many books were banned.|The film was cut by ___.|Writers spoke out against ___.|surveillance,dissent
  defy|to refuse openly to obey someone or something|公然违抗|She decided to ___ the order and speak out.|The rebels would ___ the council at any cost.|It takes courage to ___ the crowd.|obedience,dissent|defied,defies
  uniformity|being the same in every part, with no differences|一律，统一|The ___ of the gray houses was eerie.|Rules demanded ___ in dress and speech.|There was a strange ___ in everyone's answers.|conformity,regime
  dissent|strong disagreement with an official opinion|异议，不同意见|The leaders allowed no ___.|A few brave voices raised their ___.|___ grew as the rules became harsher.|censorship,defy
  oppressive|cruel and unfair, using power to control people|压迫的，暴虐的|The ___ laws kept people from meeting in groups.|The heat in the room was ___.|The ___ ruler was finally removed.|tyranny,regime
  tyranny|cruel and unfair use of power by a ruler|暴政|The people rose up against ___.|The story shows how ___ begins with small rules.|They fought to free their country from ___.|regime,oppressive|tyrannies
  `,
);

const mind = batch(
  "words-for-states-of-mind",
  ["Words for States of Mind", "心理状态的词"],
  ["states of mind and strong feelings", "心理状态与强烈情感"],
  `
  bewildered|very confused|困惑的，迷惑的|The ___ traveler stared at the map.|She was ___ by all the rules.|He looked ___ when the lights went out.|perplexed,composed
  frantic|wild with fear or worry, and rushing|狂乱的，发狂似的|The ___ mother searched every aisle.|There was a ___ search for the missing key.|He made a ___ call for help.|distraught,exasperated
  resolute|firm and determined; not giving up|坚决的，坚定的|She was ___ in her plan to escape.|With a ___ face, he stepped forward.|The team stayed ___ after the loss.|composed,elated
  indignant|angry because something seems unfair|愤慨的，义愤的|He was ___ when he was blamed for the mistake.|The ___ crowd demanded answers.|She gave an ___ reply.|exasperated,sullen
  elated|very happy and excited|兴高采烈的|The team was ___ after winning the final.|She felt ___ when the letter arrived.|An ___ shout went up from the crowd.|resolute,composed
  perplexed|puzzled because something is hard to understand|困惑的，茫然的|The scientists were ___ by the strange signal.|He looked ___ at the question.|I was ___ by her silence.|bewildered,sullen
  composed|calm and in control of your feelings|镇静的，沉着的|She stayed ___ even when the alarm went off.|He gave a ___ answer to the angry man.|Try to look ___ before you go on stage.|resolute,distraught
  distraught|very upset and worried|心烦意乱的|The ___ boy could not find his dog.|She was ___ when she heard the news.|The ___ family waited at the hospital.|frantic,composed
  sullen|bad-tempered and silent|闷闷不乐的，阴沉的|He sat in ___ silence after the argument.|The ___ teenager would not answer.|Her face turned ___ when the trip was canceled.|indignant,perplexed
  exasperated|very annoyed, especially after a long time|恼怒的|The ___ teacher asked for quiet a fourth time.|He was ___ by the slow line.|She gave an ___ sigh.|indignant,frantic
  `,
);

const rights = batch(
  "words-of-rights-and-equality",
  ["Words of Rights and Equality", "权利与平等的词"],
  ["rights and equality", "权利与平等"],
  `
  equality|the state of being equal, with the same rights and chances|平等|They marched for ___ for all people.|___ before the law is a basic right.|The club was founded on ___ between members.|inequality,prejudice
  segregation|keeping people of different races or groups apart by law or custom|种族隔离，隔离|___ kept Black and white children in separate schools.|The court ruled that ___ in schools was unfair.|Bus ___ ended after the boycott.|discrimination,integrate
  discrimination|treating a person or group unfairly because of who they are|歧视|The new law banned ___ in hiring.|She faced ___ because of her accent.|___ by age is also unfair.|segregation,prejudice
  abolish|to end a law, system or custom officially|废除|Many people worked to ___ slavery.|The school voted to ___ the old dress code.|The new leader promised to ___ the unfair tax.|emancipation,integrate|abolished,abolishes
  emancipation|setting someone free, especially from slavery|解放|The ___ of enslaved people was a turning point in history.|___ gave millions of people their freedom.|They celebrated the day of ___ every year.|abolish,oppression
  oppression|cruel and unfair treatment by people with power|压迫|The people suffered under years of ___.|Songs helped them endure ___.|She spoke out against ___ wherever she found it.|discrimination,emancipation
  civil|of the ordinary people of a country and their rights|公民的，民间的|The ___ rights movement changed the law.|Voting is a ___ right.|They settled the matter in a ___ court.|equality,inequality
  prejudice|an unfair opinion of a person or group formed without knowing them|偏见|He fought ___ by getting to know his neighbors.|___ against newcomers is common but wrong.|Her kindness broke down his ___.|discrimination,inequality|prejudices
  integrate|to bring people or things together so that they mix as equals|整合，使融合|The city began to ___ its schools in the 1960s.|New players need time to ___ into the team.|The plan will ___ art into science lessons.|abolish,segregation|integrated,integrates
  inequality|an unfair difference between people in wealth, rights or chances|不平等|The report showed ___ between rich and poor schools.|They worked to reduce ___ in pay.|___ in the city grew over twenty years.|equality,prejudice|inequalities
  `,
);

const protest = batch(
  "words-of-protest-and-reform",
  ["Words of Protest and Reform", "抗议与改革的词"],
  ["protest movements and reform", "抗议运动与改革"],
  `
  reform|a change that makes a law or system better; also to make such a change|改革；改革|The ___ gave every adult the right to vote.|Leaders promised to ___ the prisons.|School ___ was the main issue in the election.|legislation,movement|reforms,reformed
  activist|a person who works hard to bring about political or social change|活动家，积极分子|The young ___ spoke at the meeting.|She became an ___ after the factory polluted the river.|Every ___ knew the risks of protesting.|movement,picket|activists
  movement|a group of people working together for a shared cause|运动|The ___ for women's votes lasted seventy years.|The peace ___ grew quickly.|She joined the ___ to save the forest.|reform,demonstration|movements
  nonviolent|without using force or harming anyone|非暴力的|Gandhi led a ___ campaign against British rule.|The march was peaceful and ___.|___ protest can change unfair laws.|injustice,reform
  strike|a time when workers refuse to work to win better pay or conditions|罢工|The miners went on ___ for safer tunnels.|The ___ lasted for six weeks.|A bus ___ left the city without transport.|picket,demonstration|strikes
  injustice|an unfair act or situation|不公正|She could not ignore such ___.|The ___ of the law angered the people.|He spent his life fighting ___.|legislation,reform|injustices
  legislation|laws, or the making of laws|立法，法规|New ___ protects workers from danger.|The ___ passed by a single vote.|Activists pushed for ___ against child labor.|reform,injustice
  demonstration|a public gathering or march in which people show that they support or oppose something|示威，游行|Thousands joined the ___ in the square.|The ___ ended peacefully with a song.|Police watched the ___ from across the street.|strike,march|demonstrations
  march|an organized walk by many people to protest or support something|游行，示威|The ___ on Washington drew a quarter of a million people.|We joined the ___ through the city center.|The ___ began at dawn.|demonstration,picket|marches
  picket|a group of people standing outside a workplace in protest|纠察队，罢工哨|Workers formed a ___ outside the factory gate.|The ___ held signs that read Fair Pay.|No trucks crossed the ___.|strike,march|pickets
  `,
);

const speeches = batch(
  "words-of-speeches",
  ["Words of Speeches", "演讲的词"],
  ["speeches and speakers", "演讲与演讲者"],
  `
  orator|a person who gives speeches, especially a skilled one|演说家|Frederick Douglass was a powerful ___.|The ___ held the crowd for an hour.|She trained for years to become a great ___.|cadence,podium|orators
  podium|a raised stand where a speaker stands|讲台|The speaker walked up to the ___.|She gripped the ___ and began.|The microphone was fixed to the ___.|address,orator|podiums
  address|a formal speech to an audience; also to speak to a group|演说；向……讲话|The president gave an ___ to the nation.|The principal will ___ the students tomorrow.|Lincoln's ___ at Gettysburg was very short.|delivery,applause|addresses,addressed
  applause|clapping to show that people like something|鼓掌，掌声|The speech ended to loud ___.|___ filled the hall.|She waited for the ___ to stop.|conviction,delivery
  delivery|the way a speaker gives a speech|演讲方式|His words were good, but his ___ was too fast.|Practice improves your ___.|Her calm ___ made the audience trust her.|cadence,address
  conviction|a strong belief; also the feeling of being sure|信念，坚定|She spoke with deep ___.|His ___ that all people are equal never changed.|The speech was full of ___.|delivery,cadence|convictions
  stirring|causing strong feeling and excitement|激动人心的|The ___ speech brought people to their feet.|The band played a ___ song.|It was a ___ moment when the flag rose.|momentous,solemn
  momentous|very important, with great effects for the future|重大的，意义深远的|It was a ___ day when the law was signed.|The vote was a ___ decision.|Her speech marked a ___ change.|solemn,stirring
  cadence|the rise and fall of a voice; the rhythm of speech|抑扬顿挫，节奏|The ___ of his voice was like music.|Her sentences had a steady ___.|Repetition gives a speech its ___.|conviction,delivery|cadences
  solemn|serious and formal|庄严的，严肃的|There was a ___ silence for those who had died.|He made a ___ promise.|The ceremony was ___ and quiet.|stirring,momentous
  `,
);

const flight = batch(
  "words-of-flight",
  ["Words of Flight", "飞行的词"],
  ["the science of flight", "飞行的科学"],
  `
  lift|the upward force on a wing that holds an aircraft in the air|升力|A curved wing creates ___ as air flows over it.|With too little ___, the plane cannot climb.|Birds change the shape of their wings to get more ___.|thrust,drag
  thrust|the forward force that pushes an aircraft through the air|推力|The engine provides ___ to move the plane forward.|A rocket's ___ comes from burning fuel.|More ___ lets the plane take off sooner.|lift,drag
  drag|the force of the air that pushes back against a moving object|阻力|A smooth shape reduces ___.|___ slows the parachute as it falls.|Pilots pull up the wheels to cut ___.|lift,turbulence
  glider|an aircraft without an engine that flies on currents of air|滑翔机|The Wright brothers first tested a ___.|The ___ circled slowly in the warm air.|A ___ is pulled into the sky by a plane.|propeller,airfoil|gliders
  propeller|a set of spinning blades that pulls or pushes an aircraft or a ship|螺旋桨|The ___ began to spin faster and faster.|Early planes had a wooden ___.|The boat's ___ churned the water.|glider,wingspan|propellers
  turbulence|sudden, rough movements of the air|湍流，气流颠簸|The plane shook as it flew through ___.|Please stay seated during ___.|___ is common over mountains.|drag,thrust
  aviation|the design, building and flying of aircraft|航空|The Wright brothers changed the history of ___.|She studied ___ to become a pilot.|___ has made the world feel smaller.|aerodynamic,airfoil
  wingspan|the distance from the tip of one wing to the tip of the other|翼展|The albatross has a ___ of more than three meters.|The ___ of the jet is longer than its body.|An eagle's ___ helps it glide for hours.|airfoil,propeller|wingspans
  aerodynamic|shaped to move through air easily|空气动力学的，流线型的|Racing bikes have an ___ shape.|The ___ design saves fuel.|Birds' bodies are naturally ___.|aviation,turbulence
  airfoil|the curved shape of a wing seen from the side|翼型|The ___ is thicker at the front and thin at the back.|Air moves faster over the top of the ___.|A fan blade is also an ___.|wingspan,glider|airfoils
  `,
);

const pilots = batch(
  "words-of-pilots-and-airports",
  ["Words of Pilots and Airports", "飞行员与机场的词"],
  ["pilots, aircraft and airports", "飞行员、飞机与机场"],
  `
  cockpit|the part of an aircraft where the pilot sits|驾驶舱|The ___ was full of dials and switches.|The pilot climbed into the ___.|Children were allowed to visit the ___ after landing.|hangar,fuselage|cockpits
  runway|a long strip of hard ground where aircraft take off and land|跑道|The plane rolled slowly down the ___.|Snow was cleared from the ___.|The ___ lights glowed in the fog.|hangar,takeoff|runways
  hangar|a large building where aircraft are kept and repaired|飞机库|The old plane is kept in a ___.|Mechanics worked all night in the ___.|The ___ doors opened slowly.|runway,cockpit|hangars
  pilot|a person who flies an aircraft|飞行员|The ___ welcomed us on board.|She became a ___ at twenty-one.|The ___ landed the plane safely in the storm.|autopilot,rudder|pilots
  takeoff|the moment when an aircraft leaves the ground|起飞|Please fasten your seat belts for ___.|The ___ was smooth.|The ___ was delayed by fog.|runway,crosswind|takeoffs
  altimeter|an instrument that shows how high an aircraft is|高度计|The ___ showed ten thousand meters.|The pilot watched the ___ as they descended.|A broken ___ is very dangerous.|autopilot,rudder|altimeters
  autopilot|a system that flies an aircraft without the pilot steering|自动驾驶仪|The pilot turned on the ___ over the ocean.|On ___, the plane kept a steady course.|He did the job on ___, without thinking.|altimeter,pilot
  fuselage|the main body of an aircraft, where people and cargo ride|机身|The wings are attached to the ___.|The ___ of the plane was painted white.|Engineers found a crack in the ___.|cockpit,hangar
  rudder|a flat, moving part at the back of a plane or ship used to steer it|方向舵|The pilot pressed the pedals to move the ___.|The ship's ___ was damaged by the rocks.|Without a ___, the plane would turn in circles.|altimeter,fuselage|rudders
  crosswind|a wind blowing across the direction an aircraft is moving|侧风|Landing in a strong ___ takes skill.|A ___ pushed the plane to one side of the runway.|The ___ made it hard to ride a bike straight.|takeoff,runway|crosswinds
  `,
);

const trial = batch(
  "words-of-trial-and-error",
  ["Words of Trial and Error", "反复试验的词"],
  ["trying, failing and trying again", "尝试、失败与再尝试"],
  `
  attempt|a try at doing something, especially something hard|尝试|Their first ___ to fly lasted twelve seconds.|She made an ___ to climb the wall.|Every ___ taught them something new.|setback,triumph|attempts,attempted
  failure|a lack of success|失败|Each ___ showed the inventors what to change.|The launch ended in ___.|___ is part of learning.|flaw,setback|failures
  adjust|to change something slightly to make it work better|调整|The brothers had to ___ the angle of the wings.|___ your seat before you drive.|It takes time to ___ to a new school.|refine,tinker|adjusted,adjusts
  refine|to improve something by making small changes|改进，完善|She worked to ___ her design until it was perfect.|The writer will ___ the last chapter.|Engineers ___ the engine every year.|adjust,iterate|refined,refines
  tinker|to make small changes to a machine, often to fix or improve it|修补，小修小改|He likes to ___ with old radios.|They would ___ with the glider every evening.|Don't ___ with the clock unless you know how.|iterate,adjust|tinkered,tinkers
  setback|a problem that delays progress|挫折，阻碍|The broken wing was a serious ___.|Despite the ___, they kept working.|An injury was a ___ for the team.|failure,flaw|setbacks
  flaw|a mistake or weakness in something|缺陷，瑕疵|A small ___ in the design caused the crash.|The diamond has a tiny ___.|The ___ in his plan was the cost.|failure,setback|flaws
  iterate|to repeat a process, improving it each time|迭代，反复改进|Designers ___ until the product works well.|We will test, learn and ___.|The class had to ___ their bridge three times.|tinker,refine|iterated,iterates
  triumph|a great success or victory|胜利，巨大成功|The first flight was a ___ of patience.|Winning the final was a ___ for the town.|She returned home in ___.|attempt,perfect|triumphs
  perfect|to make something as good as it can be|使完美，完善|It took years to ___ the design.|She practiced daily to ___ her serve.|They worked to ___ the recipe.|refine,triumph|perfected,perfects
  `,
);

const news = batch(
  "words-of-news",
  ["Words of the News", "新闻的词"],
  ["newspapers, broadcasts and the people who make them", "报纸、广播及其制作者"],
  `
  headline|the title of a news story, printed in large letters|新闻标题|The ___ said Local Team Wins Title.|A good ___ makes you want to read the story.|The news was on every ___ the next day.|byline,edition|headlines
  journalist|a person who writes or reports the news|记者，新闻工作者|The ___ checked every fact twice.|She became a ___ to tell people the truth.|A ___ interviewed the mayor.|correspondent,editor|journalists
  editor|a person who decides what goes into a newspaper or book and corrects it|编辑|The ___ cut the story to three hundred words.|The ___ chose the photo for the front page.|My sister is the ___ of the school paper.|reporter,journalist|editors
  broadcast|a program sent out on radio or television; also to send one out|广播节目；播送|The news ___ starts at six.|The concert will ___ live.|Millions watched the ___ of the moon landing.|edition,coverage|broadcasts
  reporter|a person who gathers and reports the news|记者|The ___ asked the firefighter what had happened.|A ___ stood outside the courthouse.|Each ___ was given a different story.|editor,correspondent|reporters
  byline|a line at the top of an article that gives the writer's name|署名行|Her name appeared in the ___ for the first time.|The ___ read By Sam Lee.|Readers check the ___ to see who wrote the story.|headline,tabloid|bylines
  edition|one printing of a newspaper or book|版，版本|The morning ___ sold out early.|This is the first ___ of the book.|The Sunday ___ is the thickest.|broadcast,headline|editions
  coverage|the reporting of news about something|新闻报道|The ___ of the storm was on every channel.|The game got little ___ in the papers.|Fair ___ gives both sides.|broadcast,byline
  correspondent|a journalist who reports from a particular place|驻外记者，通讯员|The ___ sent her report from Paris.|Our science ___ explains the new study.|The war ___ risked his life to report the news.|journalist,reporter|correspondents
  tabloid|a newspaper with small pages and many short, exciting stories|小报|The ___ printed rumors about the singer.|Don't trust everything in a ___.|The ___ used a huge photo on the front.|edition,byline|tabloids
  `,
);

const ads = batch(
  "words-of-advertising",
  ["Words of Advertising", "广告的词"],
  ["advertising and selling", "广告与销售"],
  `
  slogan|a short, catchy phrase used to sell something or support a cause|口号，标语|The shoe company's ___ was easy to remember.|The team's ___ was printed on every shirt.|A good ___ sticks in your head.|jingle,logo|slogans
  brand|the name of a product made by a particular company|品牌|Which ___ of cereal do you like best?|The ___ is famous for its red label.|A store ___ is often cheaper.|logo,sponsor|brands
  endorse|to say publicly that you support a person or product|代言，公开支持|Famous athletes ___ sports drinks.|The newspaper will ___ a candidate.|The doctors refused to ___ the pill.|sponsor,advertise|endorsed,endorses
  sponsor|a company or person that pays for an event in return for advertising|赞助者；赞助|A bank was the main ___ of the race.|The shop will ___ our team's shirts.|Each ___ had its name on a banner.|endorse,commercial|sponsors,sponsored
  commercial|an advertisement on radio or television|商业广告|The ___ showed happy children eating cereal.|We skipped the ___ during the game.|A short ___ can cost millions.|jingle,slogan|commercials
  logo|a symbol that stands for a company or group|标志，徽标|The ___ was a simple green leaf.|You can see the company's ___ on every box.|Our club needs a new ___.|brand,slogan|logos
  discount|an amount taken off the usual price|折扣|Students get a ten percent ___.|The shop gave a ___ on old stock.|Is there a ___ if I buy two?|target,sponsor|discounts
  advertise|to tell the public about a product to make them buy it|做广告|The company will ___ its new phone on buses.|They ___ on websites for teenagers.|We put up posters to ___ the bake sale.|endorse,target|advertised,advertises
  jingle|a short, catchy song used in an advertisement|广告歌|The ___ for the soap stayed in my head all day.|Every child knew the ___.|The ___ was only ten seconds long.|slogan,commercial|jingles
  target|to aim something at a particular group; also the group aimed at|以……为目标；目标|The ads ___ parents of young children.|Teenagers are the ___ of this campaign.|They ___ sports fans with their posters.|advertise,discount|targeted,targets
  `,
);

const internet = batch(
  "words-of-the-internet",
  ["Words of the Internet", "互联网的词"],
  ["the internet and online life", "互联网与网络生活"],
  `
  online|connected to or done on the internet|在线的，网上的|We bought the tickets ___.|She takes an ___ course in coding.|Be careful what you share ___.|digital,viral
  website|a set of pages on the internet about one subject or company|网站|The museum's ___ lists its opening hours.|Check the ___ before you go.|She built a ___ for her bakery.|browser,password|websites
  browser|a program used to look at websites|浏览器|Open your ___ and type the address.|The page will not load in that ___.|Clear your ___ history now and then.|website,download|browsers
  download|to copy a file from the internet to your device|下载|___ the app to read the paper.|It took an hour to ___ the film.|Never ___ files from a site you do not trust.|upload,stream|downloaded,downloads
  upload|to send a file from your device to the internet|上传|She will ___ the photos tonight.|___ your homework before midnight.|The video took a long time to ___.|download,stream|uploaded,uploads
  password|a secret word or set of letters and numbers that lets you into an account|密码|Never share your ___ with anyone.|A strong ___ is long and hard to guess.|I forgot my ___ and had to reset it.|privacy,browser|passwords
  privacy|the right to keep your personal life and information to yourself|隐私|Check the ___ settings on your account.|The app collects data and does not respect ___.|Everyone deserves ___.|password,digital
  digital|using computers and numbers to store information|数字的，数码的|We have a ___ copy of the old photos.|___ cameras do not need film.|Most music today is ___.|online,viral
  stream|to watch or listen to something over the internet as it arrives|流媒体播放|We ___ the concert live.|You can ___ the film tonight.|The game will ___ on the club's site.|download,upload|streamed,streams,streaming
  viral|spreading quickly online from person to person|病毒式传播的|The video went ___ overnight.|A ___ post can reach millions in a day.|The joke became ___ before anyone checked whether it was true.|online,digital
  `,
);

/** batchesB are the batches of words of units 5 to 10 of grade 7. */
export const batchesB: readonly BatchSpec[] = [
  publicHealth,
  money,
  business,
  choices,
  sciFi,
  controlled,
  mind,
  rights,
  protest,
  speeches,
  flight,
  pilots,
  trial,
  news,
  ads,
  internet,
];
