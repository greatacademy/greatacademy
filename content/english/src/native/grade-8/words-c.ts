// Grade 8: the batches of words of science and the everyday world, from the organs of the body and the blood to
// waves, food webs, the newsroom and the bank.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const organs = batch(
  "words-of-the-organs",
  ["Words of the Organs", "器官的词"],
  ["the organs of the body", "身体的器官"],
  `
  kidney|one of two organs in the lower back that clean the blood and make urine|肾|Each ___ is about the size of a fist.|A person can live a healthy life with only one ___.|The ___ filters waste out of the blood.|spleen,lung|kidneys
  liver|the large organ in the upper belly that cleans the blood and helps digest fat|肝|The ___ is the largest organ inside the body.|Drinking too much alcohol harms the ___.|The ___ makes bile, which helps break down fat.|kidney,trachea|livers
  lung|one of the two organs in the chest that you breathe with|肺|Smoking damages every ___ it reaches.|Each ___ fills with air when you breathe in.|The doctor listened to her left ___ through the stethoscope.|liver,bladder|lungs
  intestine|the long tube below the stomach where food is digested and taken into the body|肠|Food passes from the stomach into the small ___.|The large ___ takes water back out of the waste.|An adult's small ___ is about six meters long.|esophagus,diaphragm|intestines,intestinal
  bladder|the bag-like organ that holds urine until it leaves the body|膀胱|Drinking a lot of water fills the ___ quickly.|The ___ stretches as it fills.|A football has a rubber ___ inside the leather.|pancreas,lung|bladders
  pancreas|the organ behind the stomach that makes insulin and juices for digestion|胰腺|The ___ makes the insulin that controls sugar in the blood.|People with some kinds of diabetes have a ___ that makes too little insulin.|The ___ sits just behind the stomach.|bladder,spleen
  esophagus|the tube that carries food from the throat to the stomach|食管|Food slides down the ___ into the stomach.|The ___ squeezes in waves to push food down.|A fish bone got stuck in his ___.|trachea,intestine
  spleen|an organ near the stomach that filters the blood and helps fight infection|脾|The ___ removes old red blood cells.|After the crash, doctors removed his damaged ___.|You can live without a ___, but you catch infections more easily.|kidney,pancreas
  diaphragm|the sheet of muscle below the lungs that moves when you breathe|膈|Singers learn to breathe from the ___.|A hiccup is a sudden jerk of the ___.|The ___ pulls down to draw air into the lungs.|intestine,esophagus|diaphragms
  trachea|the tube that carries air from the throat to the lungs; the windpipe|气管|Air passes down the ___ into the lungs.|Rings of cartilage keep the ___ open.|A piece of food in the ___ makes you choke and cough.|esophagus,liver
  `,
);

const blood = batch(
  "words-of-blood",
  ["Words of the Blood", "血液的词"],
  ["blood and the heart", "血液和心脏"],
  `
  capillary|one of the tiniest blood vessels, which link arteries and veins|毛细血管|Blood passes oxygen to the body through the thin walls of each ___.|A ___ is so narrow that red cells pass through in single file.|A bruise forms when a ___ breaks under the skin.|aorta,ventricle|capillaries
  plasma|the yellowish liquid part of blood that carries the cells|血浆|More than half of your blood is ___.|Donated ___ can help people with burns.|Red cells float in the ___ like boats on a river.|marrow,clot
  platelet|a tiny piece of a cell in the blood that helps it to clot|血小板|A ___ rushes to a cut and helps seal it.|Patients with too few of them bleed easily, so they are given ___ transfusions.|Each ___ lives only about a week.|capillary,donor|platelets
  ventricle|one of the two lower chambers of the heart that pump blood out|心室|The left ___ pumps blood to the whole body.|The right ___ sends blood to the lungs.|The thick wall of the ___ squeezes with every beat.|aorta,marrow|ventricles
  marrow|the soft tissue inside bones where blood cells are made|骨髓|New blood cells are made in the ___ of the bones.|She gave ___ to help her brother fight his illness.|The cook boiled the bones to get the rich ___ out.|plasma,platelet
  aorta|the main artery, which carries blood from the heart to the rest of the body|主动脉|The ___ is the largest artery in the body.|Blood leaves the left ventricle through the ___.|The ___ is about as wide as a garden hose.|capillary,bloodstream|aortas
  clot|a lump of blood that has become thick and almost solid|血块，凝块|A ___ formed over the cut and stopped the bleeding.|A ___ in the brain can cause a stroke.|Doctors gave her a drug to break up the ___.|plasma,marrow|clots,clotted,clotting
  transfusion|the putting of blood from one person into another person's body|输血|After losing so much blood, he needed a ___.|The ___ saved her life after the accident.|Blood for a ___ must match the patient's type.|bloodstream,platelet|transfusions
  bloodstream|the blood flowing through the body|血流|The medicine enters the ___ within minutes.|Oxygen is carried in the ___ to every cell.|Germs that reach the ___ can spread quickly.|transfusion,ventricle
  donor|a person who gives blood, an organ or money to help others|捐献者|The ___ gave blood every three months.|Doctors found a kidney ___ for the sick boy.|An unknown ___ paid for the new library.|clot,aorta|donors
  `,
);

const waves = batch(
  "words-of-waves",
  ["Words of Waves", "波的词"],
  ["sound, light and waves", "声、光和波"],
  `
  frequency|how many times a wave or event repeats in a second or another period|频率|A high-pitched note has a high ___.|Radio stations broadcast on different ___ bands.|The ___ of the buses rose to one every five minutes.|amplitude,decibel|frequencies
  wavelength|the distance from one wave's peak to the next|波长|Red light has a longer ___ than blue light.|The ___ of a radio wave can be hundreds of meters.|As the ___ gets shorter, the frequency gets higher.|vibration,radar|wavelengths
  vibration|a fast shaking movement back and forth|振动|Sound is made by the ___ of air.|We felt the ___ of the train through the floor.|The phone gave a short ___ when the message came.|ultrasound,infrared|vibrations,vibrated,vibrating
  amplify|to make a sound or signal louder or stronger|放大|A speaker will ___ the sound of the guitar.|The microphone helps ___ her quiet voice.|Rumors tend to ___ people's fears.|vibration,frequency|amplifies,amplified,amplifying,amplifier
  decibel|a unit for measuring how loud a sound is|分贝|A jet engine measures about a hundred and forty on the ___ scale.|Each ten-___ rise makes a sound ten times stronger.|The ___ meter showed the music was dangerously loud.|amplitude,wavelength|decibels
  ultrasound|sound too high for humans to hear, used to see inside the body|超声波|Bats use ___ to find insects in the dark.|The ___ scan showed the baby's heartbeat.|Dog whistles make a sound close to ___.|infrared,radar
  amplitude|the height of a wave, which shows how strong it is|振幅|A louder sound has a greater ___.|The earthquake's waves had a huge ___.|On the screen, the ___ of the wave grew as she shouted.|frequency,wavelength
  infrared|light with a wavelength too long to see, felt as heat|红外线|Snakes can sense the ___ heat of their prey.|The TV remote sends an ___ signal.|Night cameras use ___ light to see in the dark.|ultraviolet,ultrasound
  ultraviolet|light with a wavelength too short to see, which can burn the skin|紫外线|Sunscreen blocks ___ rays.|Bees can see ___ patterns on flowers.|Too much ___ light can damage your eyes.|infrared,decibel
  radar|a system that finds distant objects by sending out radio waves and catching their echoes|雷达|The ship's ___ showed another boat in the fog.|Police use ___ to catch speeding drivers.|The plane flew too low to be seen on ___.|ultrasound,amplitude|radars
  `,
);

const foodWebs = batch(
  "words-of-food-webs",
  ["Words of Food Webs", "食物网的词"],
  ["how living things feed", "生物如何取食"],
  `
  niche|the role a living thing plays in its habitat, or a place or job that suits someone|生态位；合适的位置|Each kind of finch filled a different ___ on the island.|She found her ___ as a teacher of music.|The shop serves a small ___ of collectors.|canopy,host|niches
  parasite|a living thing that lives on or in another and takes its food from it|寄生虫|A tick is a ___ that feeds on blood.|The tapeworm is a ___ that lives in the gut.|He was called a ___ for living off his friends.|herbivore,grazer|parasites,parasitic
  host|a living thing that a parasite lives on; a person who receives guests|宿主；主人|The flea leaves its ___ when the animal dies.|A dog can be the ___ to many kinds of worms.|Our ___ greeted every guest at the door.|parasite,wetland|hosts,hosted,hosting
  mutualism|a relationship in which two kinds of living things both gain|互利共生|Bees and flowers live in ___: the bees get food and the flowers are pollinated.|In ___, neither partner is harmed.|The clownfish and the sea anemone are a famous case of ___.|niche,canopy
  herbivore|an animal that eats only plants|食草动物|A cow is a ___ that eats grass all day.|The ___ has flat teeth for grinding leaves.|Every ___ in the park fled when the lion came.|carnivore,omnivore|herbivores,herbivorous
  carnivore|an animal that eats meat|食肉动物|The lion is a ___ that hunts zebras.|A ___ has sharp teeth for tearing meat.|The wolf is the largest wild ___ in the forest.|herbivore,host|carnivores,carnivorous
  omnivore|an animal that eats both plants and meat|杂食动物|A bear is an ___ that eats berries and fish.|A human is an ___, eating both plants and meat.|As an ___, the raccoon eats almost anything.|herbivore,carnivore|omnivores
  canopy|the top layer of a forest, formed by the branches of the tallest trees; a cover|树冠层；顶篷|Monkeys live high in the ___ of the rainforest.|Little sunlight gets through the thick ___.|The bed had a silk ___ above it.|wetland,niche|canopies
  wetland|land that is wet most of the time, such as a marsh or swamp|湿地|Herons hunt for frogs in the ___.|The city drained the ___ to build houses.|A ___ soaks up water and helps prevent floods.|canopy,mutualism|wetlands
  grazer|an animal that feeds on growing grass|食草放牧动物|The zebra is a ___ of the African plains.|Each ___ moved slowly across the field, eating as it went.|The sheep is a ___ that keeps the grass short.|parasite,canopy|grazers
  `,
);

const newsroom = batch(
  "words-of-the-newsroom",
  ["Words of the Newsroom", "新闻编辑室的词"],
  ["how the news is made", "新闻的制作"],
  `
  interview|a meeting at which someone is asked questions, for a job or a news report|采访；面试|The reporter asked for an ___ with the mayor.|She was nervous before her job ___.|In the ___, the singer talked about her childhood.|caption,scoop|interviews,interviewed,interviewing,interviewer
  caption|the words printed under a picture to explain it|图片说明|The ___ under the photo gave the names of the players.|Read the ___ to find out where the picture was taken.|The magazine printed the wrong ___ beside her face.|masthead,feature|captions
  press|newspapers and the reporters who write for them; to push|新闻界；按，压|The ___ waited outside the court for the verdict.|Freedom of the ___ protects the public's right to know.|___ the button to start the machine.|scoop,newsroom|presses,pressed,pressing
  scoop|a story that one newspaper prints before any other|独家新闻|The young reporter got the ___ of the year.|The paper's ___ about the scandal was on every TV channel by noon.|Rival papers were angry that they missed the ___.|caption,masthead|scoops
  newsroom|the office where news stories are written and edited|新闻编辑室|The ___ was busy as the election results came in.|Reporters rushed back to the ___ to write the story.|Phones rang all night in the ___.|front page,feature|newsrooms
  masthead|the name of a newspaper printed in large letters at the top of the front page|报头|The paper's ___ has not changed in a hundred years.|The ___ is printed in old-fashioned letters.|The new owner put a bold red ___ on the front page.|caption,interview|mastheads
  paparazzi|photographers who follow famous people to take pictures of them|狗仔队|The ___ waited outside the actor's house all night.|She hid her face from the ___ with a scarf.|A crowd of ___ chased the singer's car.|newsreader,press
  feature|a long newspaper or magazine article about a person or subject; an important part|专题文章；特征|The Sunday paper ran a ___ about life on the farm.|She wrote a long ___ on the city's oldest shops.|The best ___ of the phone is its camera.|scoop,masthead|features,featured,featuring
  newsreader|a person who reads the news on television or radio|新闻播音员|The ___ read the headlines at six o'clock.|A calm ___ announced the death of the king.|The ___ smiled at the camera and said good evening.|paparazzi,masthead|newsreaders
  front page|the first page of a newspaper, where the most important news goes|头版|The election result filled the ___.|Her photo was on the ___ of every paper.|The scandal made the ___ the next morning.|newsroom,caption|front pages
  `,
);

const banking = batch(
  "words-of-banking",
  ["Words of Banking", "银行业务的词"],
  ["the bank and your money", "银行和钱"],
  `
  account|an arrangement with a bank to keep your money there|账户|She opened a bank ___ with her first wages.|Money from the job is paid straight into his ___.|You need a password to check your ___ online.|statement,teller|accounts
  statement|a list from a bank of all the money paid into and out of an account|对账单|The monthly ___ showed every payment he had made.|Check your bank ___ for any payments you don't recognize.|She printed a ___ to prove her income.|balance,overdraft|statements
  balance|the amount of money in an account|余额|Her ___ dropped to ten dollars after rent.|Check your ___ before you buy anything big.|The machine printed the ___ on a small slip.|transaction,lender|balances
  cheque|a printed form you sign to tell your bank to pay money to someone|支票|He paid the plumber by ___.|She signed the ___ and handed it to the landlord.|Grandma sent a ___ for my birthday.|debit,teller|cheques
  debit|money taken out of an account; to take money out of an account|借记；扣款|Each ___ on the statement is a payment you made.|The bank will ___ the fee from your account each month.|She paid with a ___ card instead of cash.|cheque,lender|debits,debited,debiting
  teller|a person who works at a bank counter and takes in or pays out money|银行出纳员|The ___ counted the notes twice.|Ask the ___ to change your coins for notes.|A friendly ___ helped him fill in the form.|lender,cheque|tellers
  withdraw|to take money out of a bank account; to take back or pull out|取款；撤回|He went to the bank to ___ fifty dollars.|You can ___ cash from the machine at any hour.|The army began to ___ its troops.|debit,overdraft|withdraws,withdrew,withdrawn,withdrawing,withdrawal
  overdraft|an arrangement that lets you take out more money than you have in an account|透支|She used her ___ to pay the rent before payday.|The bank charges interest on an ___.|His ___ grew larger every month.|statement,transaction|overdrafts
  transaction|a single act of buying, selling or moving money|交易|Every ___ is shown on your statement.|The bank stopped the strange ___ from abroad.|A ___ at the shop takes seconds with a card.|balance,account|transactions
  lender|a person or bank that lends money|放贷人|The ___ wanted to know how much she earned.|The bank is the biggest ___ to farmers in the region.|If you miss payments, the ___ can take the house.|teller,debit|lenders
  `,
);

/** batchesC are the batches of words of science and everyday life of grade 8. */
export const batchesC: readonly BatchSpec[] = [organs, blood, waves, foodWebs, newsroom, banking];
