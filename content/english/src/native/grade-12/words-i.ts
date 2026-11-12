// Grade 12: the batches of words of food and appetite, of the build of the body, of ill will, of obedience, of
// wandering, of riches and want, of clear and muddled writing, of inheritance, of ships and of pirates.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const food = batch(
  "words-of-taste-and-appetite",
  ["Words of Taste and Appetite", "口味与食欲的词"],
  ["fine food, the people who love it and hunger", "美食、爱美食的人与饥饿"],
  `
  gourmet|a connoisseur of good food; of high quality|美食家；美味的|The ___ praised the sauce.|They opened a ___ burger shop.|A ___ dinner costs a lot here.|epicure,glutton|gourmets
  gastronomy|the practice or art of choosing, cooking and eating good food|烹饪法，美食学|Lyon is famous for its ___.|She wrote a history of French ___.|The festival celebrates local ___.|gourmand,palatable|gastronomic
  epicure|a person who takes particular pleasure in fine food and drink|美食家，讲究饮食的人|The ___ tasted the wine slowly.|Only a true ___ could tell the two cheeses apart.|He was an ___ who hated fast food.|gourmet,glutton|epicurean
  glutton|a person who eats far too much; one very eager for something|贪吃的人；酷爱…的人|The ___ ate the whole cake.|She is a ___ for hard work.|Don't be a ___; leave some for others.|gourmand,epicure|gluttony
  gourmand|a person who enjoys eating, often too much|嗜吃的人|The ___ ordered three desserts.|He was more ___ than gourmet.|A true ___ never refuses seconds.|glutton,gastronomy|gourmands
  voracious|wanting great quantities of food; very eager|贪婪的，如饥似渴的|She is a ___ reader.|The ___ caterpillars ate every leaf.|He has a ___ appetite.|ravenous,succulent|voraciously
  ravenous|extremely hungry|饥肠辘辘的|After the hike we were ___.|The ___ wolves circled the camp.|He came home ___ and ate two plates.|voracious,delectable|ravenously
  delectable|delicious; delightful|美味的；令人愉快的|The baker made a ___ pie.|A ___ smell came from the kitchen.|They served ___ little cakes.|succulent,ravenous|
  succulent|tender, juicy and tasty|多汁的|The chef served a ___ steak.|___ peaches hung from the tree.|The roast was ___ and pink.|delectable,palatable|
  palatable|pleasant to taste; acceptable|可口的；可接受的|The soup was barely ___.|They made the plan ___ to voters.|Add salt to make it ___.|delectable,voracious|unpalatable
  `,
);

const build = batch(
  "words-for-the-build-of-the-body",
  ["Words for the Build of the Body", "体型的词"],
  ["thin and stout, weak and strong", "瘦与胖，弱与强"],
  `
  frail|weak and delicate|虚弱的，脆弱的|Her ___ grandmother needs help to stand.|The ___ bridge creaked in the wind.|He looked ___ after the illness.|emaciated,sturdy|frailty
  sturdy|strongly and solidly built|结实的，坚固的|Buy a ___ pair of boots.|The ___ table held the weight.|A ___ little pony carried the bags.|stocky,frail|sturdily
  brawny|physically strong; muscular|强壮的，肌肉发达的|A ___ farmer lifted the sack.|The ___ guard blocked the door.|He had ___ arms from rowing.|burly,svelte|brawn
  emaciated|abnormally thin or weak, especially from illness or lack of food|消瘦的，憔悴的|The ___ dog had not eaten for days.|Prisoners were found ___ and ill.|Her ___ face showed years of hunger.|frail,portly|emaciation
  portly|having a stout body; somewhat fat, especially of an older man|发福的，肥胖的|A ___ gentleman sat in the armchair.|The ___ mayor cut the ribbon.|He grew ___ in middle age.|corpulent,lanky|
  corpulent|large and fat|肥胖的|The ___ king could barely ride.|A ___ man filled the doorway.|The doctor warned the ___ patient to diet.|portly,svelte|corpulence
  svelte|slender and elegant|苗条的，体态优美的|The ___ dancer moved gracefully.|She looked ___ in her black dress.|A ___ cat leapt onto the wall.|lanky,corpulent|
  lanky|tall, thin and awkward-looking|瘦长的|A ___ teenager ducked through the door.|The ___ boy tripped over his feet.|He was ___ but strong.|svelte,stocky|lankiness
  stocky|short and broad and solidly built|矮壮的|The ___ wrestler was hard to move.|A ___ man with a beard ran the shop.|___ ponies suit the mountain paths.|sturdy,lanky|
  burly|large and strong; heavily built|魁梧的|Two ___ men carried the piano.|A ___ bouncer stood at the door.|The ___ sailor hauled the rope.|brawny,frail|
  `,
);

const malice = batch(
  "words-of-envy-and-malice",
  ["Words of Envy and Malice", "嫉妒与恶意的词"],
  ["wanting what others have and wishing them harm", "想要别人所有与希望别人受害"],
  `
  envy|a feeling of wanting what someone else has; to feel this|嫉妒，羡慕|Her new car was the ___ of the street.|I ___ your patience.|He was eaten up with ___.|covet,begrudge|envied
  covet|to want something that belongs to someone else|觊觎，贪求|He would ___ his neighbor's land.|Many athletes ___ the gold medal.|They ___ power above all.|envy,malign|coveted,covetous
  begrudge|to resent someone having something; to give unwillingly|嫉妒；不情愿地给|I don't ___ her success.|He seemed to ___ every penny he spent.|Few would ___ them a holiday.|envy,vindictive|begrudged,begrudgingly
  rancorous|full of bitter, long-lasting resentment|充满怨恨的|The divorce was long and ___.|A ___ debate split the party.|Their ___ feud lasted forty years.|vindictive,beneficent|
  spiteful|showing a wish to hurt or annoy|恶意的，怀恨的|She made a ___ remark about his weight.|The ___ boy broke his sister's toy.|Don't be ___ just because you lost.|malicious,beneficent|spitefully,spite
  malicious|intending to do harm|恶意的|He spread ___ rumors about her.|The software was ___.|There was nothing ___ in her joke.|malevolent,spiteful|maliciously,malice
  vindictive|having a strong wish for revenge|报复心强的|The ___ ruler punished his critics.|She was not ___ after the trial.|A ___ ex-partner posted the photos.|rancorous,begrudge|vindictively,vindictiveness
  malevolent|wishing evil to others|恶毒的，邪恶的|A ___ spirit haunted the castle.|He gave her a ___ stare.|The ___ witch cursed the baby.|malicious,beneficent|malevolence
  malign|to speak harmful untruths about; evil in nature|诽谤；有害的|Don't ___ him behind his back.|The press tried to ___ the judge.|A ___ influence spread through the court.|covet,malevolent|maligned
  beneficent|doing good; generous and kind|行善的，慈善的|The ___ queen built schools for the poor.|A ___ donor paid for the hospital.|They hoped for a ___ outcome.|malevolent,rancorous|beneficence
  `,
);

const obedience = batch(
  "words-of-obedience-and-revolt",
  ["Words of Obedience and Revolt", "服从与反抗的词"],
  ["doing as one is told and refusing to", "照吩咐做与拒绝服从"],
  `
  oppress|to keep people down by cruel, unjust use of power|压迫|The tyrant used soldiers to ___ the people.|Laws that ___ minorities must change.|The heat began to ___ us.|subservient,rebellious|oppressed,oppressor
  docile|ready to accept control; easily taught|温顺的|The ___ horse let the child ride.|They wanted a ___ workforce.|A ___ puppy is easy to train.|biddable,unruly|docility
  subservient|too willing to obey others; less important|恭顺的，屈从的|She refused to be ___ to her boss.|The press was ___ to the government.|His needs were ___ to the company's.|submissive,insubordinate|subservience
  insubordinate|refusing to obey orders|不服从的，违抗命令的|The ___ soldier was sent home.|An ___ clerk ignored the rules.|Her ___ tone angered the captain.|rebellious,docile|insubordination
  submissive|ready to obey others without arguing|顺从的|The ___ dog rolled onto its back.|He was ___ to his older brother.|She lowered her eyes in a ___ way.|subservient,unruly|submissively,submission
  meek|quiet, gentle and easily imposed on|温顺的，逆来顺受的|The ___ boy never complained.|She gave a ___ reply.|Don't be so ___; stand up for yourself.|docile,rebellious|meekly
  rebellious|resisting authority or control|叛逆的|The ___ teenager dyed her hair green.|___ troops seized the palace.|He was ___ at school.|insubordinate,meek|rebelliously
  tractable|easy to control or influence; easily dealt with|易驾驭的；易处理的|The ___ child obeyed at once.|The problem proved ___.|A more ___ partner would help.|biddable,unruly|
  unruly|disorderly and hard to control|难以控制的，不守规矩的|The ___ crowd pushed past the police.|He tried to comb his ___ hair.|The ___ class wore out the teacher.|rebellious,tractable|unruliness
  biddable|meekly ready to accept and follow instructions|听话的，顺从的|The ___ sheepdog came at once.|She was a ___ child.|They hired ___ servants.|docile,insubordinate|
  `,
);

const wandering = batch(
  "words-of-roaming-and-wandering",
  ["Words of Roaming and Wandering", "漫游与流浪的词"],
  ["travelers without a fixed road", "没有固定路线的旅人"],
  `
  peregrination|a long, wandering journey|游历，漫游|His ___ took him through Asia.|The book records her ___ across Africa.|After years of ___, he came home.|wanderlust,traverse|peregrinations
  wanderlust|a strong desire to travel|旅行癖，漫游的欲望|___ led her to sail around the world.|He caught ___ at eighteen.|Her ___ never faded.|peregrination,vagabond|
  vagabond|a person who wanders from place to place without a home or job|流浪者|The ___ slept under the bridge.|He lived like a ___ for years.|A ___ knocked at the farm door.|drifter,wayfarer|vagabonds
  roam|to move about with no fixed purpose or direction|漫步，闲逛|Wild horses ___ the plains.|We let the dogs ___ in the woods.|Tourists ___ the old streets.|rove,traverse|roamed,roaming
  wayfarer|a person who travels on foot|徒步旅行者|The inn gave shelter to every ___.|A weary ___ asked for water.|Each ___ left a stone on the cairn.|vagabond,globetrotter|wayfarers
  drifter|a person who moves from place to place with no fixed home or work|流浪汉，漂泊者|A ___ came to town looking for work.|He was a ___ until he settled down.|The police questioned the ___.|vagabond,wayfarer|drifters
  rove|to travel constantly without a fixed destination|漫游，流浪|Bandits used to ___ these hills.|His eyes began to ___ around the room.|They ___ from city to city.|roam,ramble|roved,roving
  ramble|to walk for pleasure in the country; to talk at length without focus|漫步；漫谈|We like to ___ in the hills on Sundays.|He tends to ___ when he is tired.|Don't ___; get to the point.|rove,roam|rambled,rambler,rambling
  traverse|to travel across or through|穿越，横越|It took a week to ___ the desert.|A bridge will ___ the river.|They had to ___ the glacier.|roam,peregrination|traversed
  globetrotter|a person who travels widely|环球旅行者|The ___ had visited ninety countries.|She writes for every ___.|A seasoned ___ packs light.|wayfarer,drifter|globetrotters,globetrotting
  `,
);

const riches = batch(
  "words-of-luxury-and-penury",
  ["Words of Luxury and Penury", "奢华与贫困的词"],
  ["living in comfort and living in need", "舒适生活与贫困生活"],
  `
  sumptuous|splendid and expensive-looking|奢华的，豪华的|They ate a ___ feast.|The hotel had ___ rooms.|She wore a ___ silk gown.|luxurious,spartan|sumptuously
  luxurious|very comfortable and expensive|奢侈的，舒适的|They stayed in a ___ villa.|A ___ bath eased her muscles.|The car has ___ leather seats.|sumptuous,threadbare|luxuriously
  spartan|showing simplicity and a lack of comfort|简朴的，简陋的|The soldiers lived in ___ huts.|His room was ___: a bed and a desk.|They kept a ___ diet.|threadbare,sumptuous|
  penurious|extremely poor; unwilling to spend money|贫穷的；吝啬的|The ___ poet lived in an attic.|A ___ old man counted every coin.|They grew up in ___ conditions.|indigent,moneyed|penury
  indigent|poor and in need|贫困的|The clinic treats ___ patients for free.|___ families received food.|The law gives ___ defendants a lawyer.|penniless,well-heeled|indigence
  impoverished|made poor; weakened in quality|贫困的；枯竭的|The war left the region ___.|They grew up in an ___ village.|The soil was ___ after years of farming.|indigent,luxurious|impoverish,impoverishment
  penniless|having no money|身无分文的|He arrived in the city ___.|The gamble left them ___.|A ___ student asked for a loan.|penurious,moneyed|
  well-heeled|wealthy|富有的|The shop sells to ___ tourists.|A ___ crowd filled the opera house.|They live in a ___ suburb.|moneyed,penniless|
  moneyed|having a great deal of money|有钱的|The resort attracts ___ families.|He was born into a ___ class.|The ___ elite run the town.|well-heeled,indigent|
  threadbare|thin and worn from use; weak from overuse|破旧的；陈腐的|He wore a ___ coat.|The rug was ___ in the middle.|Their ___ excuse no longer worked.|spartan,luxurious|
  `,
);

const clarity = batch(
  "words-of-clear-and-muddled-thought",
  ["Words of Clear and Muddled Thought", "清晰与混乱思维的词"],
  ["ideas easy to follow and ideas hard to grasp", "易懂的想法与难懂的想法"],
  `
  abstruse|difficult to understand; obscure|深奥的|The lecture was too ___ for most of us.|He writes ___ theories of time.|___ terms filled the contract.|convoluted,intelligible|
  turbid|cloudy or muddy; confused|浑浊的；混乱的|The river was ___ after the rain.|His ___ prose was hard to follow.|Fish cannot see in ___ water.|crystalline,nebulous|turbidity
  nebulous|unclear, vague or ill-defined|模糊的，朦胧的|Their plans for the future are ___.|The idea is still ___.|He gave a ___ answer.|vague,perspicuous|
  vague|not clearly expressed or understood|模糊的，含糊的|She gave a ___ description of the man.|I have a ___ memory of the house.|The instructions were too ___.|nebulous,intelligible|vaguely,vagueness
  crystalline|very clear; having the structure of crystals|清澈透明的；晶体的|The lake was ___ and cold.|Her ___ prose was a joy to read.|Salt forms ___ shapes.|turbid,muddled|
  perspicuous|clearly expressed and easily understood|明晰的，易懂的|She gave a ___ account of the theory.|The judge wrote a ___ ruling.|A ___ style suits a textbook.|crystalline,abstruse|perspicuity
  intelligible|able to be understood|可理解的，清楚的|His speech was barely ___.|Make your notes ___ to others.|The message was ___ despite the noise.|perspicuous,unintelligible|intelligibly,intelligibility
  unintelligible|impossible to understand|难以理解的|The radio message was ___.|Her handwriting is ___.|He mumbled something ___.|abstruse,intelligible|
  convoluted|extremely complex and difficult to follow|错综复杂的|The plot was too ___.|They gave a ___ excuse.|The ___ rules confused everyone.|abstruse,muddled|convolution
  muddled|confused and disorganized|糊涂的，混乱的|His ideas were ___.|She got ___ about the dates.|The ___ report left out key facts.|convoluted,crystalline|muddle
  `,
);

const inheritance = batch(
  "words-of-wills-and-inheritance",
  ["Words of Wills and Inheritance", "遗嘱与继承的词"],
  ["what the dead leave and who receives it", "逝者留下的与接受者"],
  `
  bequeath|to leave property to someone in a will; to pass on|遗赠；传给|She will ___ the house to her niece.|He hoped to ___ his books to the library.|Each generation should ___ a better world.|disinherit,probate|bequeathed
  bequest|something left to someone in a will|遗赠物，遗产|The museum received a large ___.|Her ___ funded ten scholarships.|A ___ of paintings went to the town.|testament,beneficiary|bequests
  heiress|a woman who will inherit or has inherited great wealth|女继承人|The young ___ owned three castles.|He married a rich ___.|The ___ gave her fortune away.|executor,beneficiary|heiresses
  executor|a person named in a will to carry out its terms|遗嘱执行人|The ___ read the will aloud.|She was named ___ of her father's estate.|The ___ sold the house.|beneficiary,heiress|executors
  testament|a will; something that serves as proof|遗嘱；证明|This is my last will and ___.|The bridge is a ___ to their skill.|Her success is a ___ to hard work.|bequest,probate|testaments
  primogeniture|the right of the eldest son to inherit everything|长子继承制|Under ___, the eldest son got the farm.|The law of ___ was abolished.|___ left younger sons with nothing.|probate,intestate|
  disinherit|to prevent someone from inheriting one's property|剥夺继承权|He threatened to ___ his son.|She chose to ___ her greedy nephew.|Few parents ___ their children.|bequeath,intestate|disinherited
  beneficiary|a person who receives money or property from a will or insurance|受益人|She was the sole ___ of the will.|Name a ___ on the policy.|Farmers are the main ___ of the scheme.|executor,heiress|beneficiaries
  probate|the official process of proving that a will is valid|遗嘱认证|The will is now in ___.|___ can take many months.|The house cannot be sold until ___ ends.|primogeniture,testament|
  intestate|having died without making a will|未留遗嘱的|He died ___, so the state divided his money.|___ estates go to the next of kin.|She did not want to die ___.|disinherit,primogeniture|
  `,
);

const ships = batch(
  "words-of-ships-and-sailors",
  ["Words of Ships and Sailors", "船与水手的词"],
  ["life at sea and the ships of old", "海上生活与古老的船"],
  `
  mariner|a sailor|水手，海员|The old ___ told tales of storms.|Every ___ knows the North Star.|A ___ must read the tides.|stevedore,seafaring|mariners
  stevedore|a person who loads and unloads ships|码头装卸工|The ___ carried crates off the ship.|Each ___ worked a twelve-hour shift.|A ___ found the hidden cargo.|mariner,regatta|stevedores
  frigate|a fast warship|护卫舰|The navy sent a ___ to guard the coast.|The ___ fired its cannons.|An old ___ is now a museum.|schooner,regatta|frigates
  schooner|a sailing ship with two or more masts|纵帆船|The ___ sailed out at dawn.|They crossed the bay in a ___.|A white ___ rode at anchor.|frigate,flotsam|schooners
  regatta|a series of boat races|赛船会|The ___ draws rowers from all over Europe.|They watched the ___ from the bank.|She won the junior ___.|frigate,stevedore|regattas
  seafaring|traveling by sea; working as a sailor|航海的|The Vikings were a ___ people.|He comes from a ___ family.|___ nations built great fleets.|mariner,capsize|seafarer
  capsize|of a boat, to turn over in the water|(船)翻覆|A big wave may ___ the canoe.|Don't stand up or the boat will ___.|The ferry began to ___ in the storm.|scuttle,jettison|capsized
  scuttle|to sink one's own ship deliberately; to ruin a plan; to run with short quick steps|凿沉；破坏；急促奔跑|The crew chose to ___ the ship.|Bad news may ___ the deal.|Crabs ___ across the sand.|capsize,jettison|scuttled
  jettison|to throw goods overboard; to abandon something unwanted|抛弃(货物)；放弃|The crew had to ___ the cargo.|They decided to ___ the old plan.|The pilot had to ___ fuel.|scuttle,capsize|jettisoned
  flotsam|wreckage or goods found floating on the sea; people or things rejected|漂浮物；被遗弃的人或物|The beach was covered in ___.|Bits of ___ drifted past the boat.|The war left human ___ in every city.|jettison,schooner|
  `,
);

const pirates = batch(
  "words-of-pirates-and-plunder",
  ["Words of Pirates and Plunder", "海盗与劫掠的词"],
  ["robbers of the sea and what they took", "海上强盗及其掠夺物"],
  `
  buccaneer|a pirate, especially in the Caribbean; a bold adventurer|海盗；冒险家|The ___ buried his gold on an island.|He was a ___ of the business world.|A ___ seized the Spanish ship.|corsair,privateer|buccaneers
  corsair|a pirate, especially of the Mediterranean coast of North Africa|(北非沿岸的)海盗|A ___ captured the merchant ship.|The ___ fleet raided the coast.|Sailors feared every ___.|buccaneer,privateer|corsairs
  privateer|a privately owned ship allowed by a government to attack enemy ships|私掠船(主)|The queen gave the ___ a license to raid.|A ___ attacked the enemy's trade.|Each ___ kept a share of the prize.|buccaneer,corsair|privateers
  plunder|to steal goods by force, especially in war; the goods taken|掠夺；掠夺品|The invaders came to ___ the town.|They divided the ___ among the crew.|Companies ___ the forests for timber.|pillage,loot|plundered
  booty|valuable goods taken by force|战利品，赃物|The pirates counted their ___.|The thieves hid the ___ in a cave.|Gold and silks made up the ___.|loot,contraband|
  maraud|to roam in search of things to steal|劫掠，抢劫|Bandits ___ the border villages.|Wolves ___ at night.|Gangs began to ___ the countryside.|plunder,ransack|marauded,marauding,marauder
  pillage|to rob a place using violence, especially in war|(战争中)掠夺|The army began to ___ the city.|They would ___ every farm on their way.|Soldiers were told not to ___.|plunder,maraud|pillaged
  loot|goods stolen by thieves or soldiers; to steal during a riot or war|赃物；抢劫|Rioters began to ___ the shops.|The police found the ___ in a van.|Thieves split the ___.|booty,pillage|looted,looting,looter
  ransack|to search a place roughly, making a mess, often to steal|洗劫；仔细搜寻|Burglars ___ the house while we were away.|She will ___ the drawers for her passport.|Soldiers ___ the palace.|maraud,loot|ransacked
  contraband|goods brought into or out of a country illegally|走私货|The ship carried ___ in hidden holds.|Customs seized the ___.|Cigarettes were sold as ___.|booty,privateer|
  `,
);

/** batchesI are the batches of taste, the build of the body, envy, obedience, roaming, riches, clear thought, inheritance, ships and pirates. */
export const batchesI: readonly BatchSpec[] = [food, build, malice, obedience, wandering, riches, clarity, inheritance, ships, pirates];
