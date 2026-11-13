// Grade 12: the batches of words of science and inquiry, from the method of science and the words of physics and
// chemistry to genes, the sky, disease, the mind and the weighing of evidence.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const method = batch(
  "words-of-the-scientific-method",
  ["Words of the Scientific Method", "科学方法的词"],
  ["how scientists test ideas", "科学家如何检验想法"],
  `
  falsifiable|able to be shown false by a test or an observation|可证伪的|A good theory is ___: some result could prove it wrong.|The claim that ghosts hide from cameras is not ___.|Popper argued that science deals only in ___ ideas.|theorem,deduction|falsifiability
  meticulous|showing great care about small details|一丝不苟的|He kept ___ notes of every experiment.|The ___ work took three years.|A ___ check found the tiny mistake.|interpolate,causation|meticulously
  peer-reviewed|checked by other experts before being published|经同行评审的|Only ___ studies were used in the report.|The paper was ___ by three scientists.|A blog post is not a ___ article.|calibrate,theorem|
  quantify|to measure or express as a number|量化|It is hard to ___ happiness.|The study tried to ___ the damage to the reef.|Can you ___ how much time you saved?|calibrate,interpolate|quantified,quantifies,quantifiable
  calibrate|to adjust an instrument so that it measures correctly|校准|You must ___ the scale before each weighing.|The lab sent the thermometers away to ___ them.|Engineers ___ the sensors every month.|quantify,interpolate|calibrated,calibration
  interpolate|to estimate a value between two known values|插值，内插|From readings at noon and two, we can ___ the one at one o'clock.|The program will ___ the missing points on the graph.|Do not ___ beyond the data you have.|quantify,calibrate|interpolated,interpolation
  causation|the act of one thing causing another|因果关系|Correlation does not prove ___.|The study showed a link but not ___.|Judges must decide questions of ___ in many cases.|deduction,induction|causal
  deduction|reasoning from general rules to a particular conclusion|演绎，推论|By ___, if all metals conduct and copper is a metal, copper conducts.|The detective's ___ was simple but correct.|Sherlock Holmes reached the answer by pure ___ from clues.|induction,causation|deductive
  induction|reasoning from particular cases to a general rule|归纳|By ___, after seeing a thousand white swans, she guessed all swans were white.|Science often begins with ___ from observations.|Her ___ was undone by a single black swan.|deduction,theorem|inductive
  theorem|a statement in mathematics that has been proved from other statements|定理|Pythagoras's ___ is about right-angled triangles.|She proved the ___ in four lines.|The ___ took mathematicians three centuries to prove.|deduction,induction|theorems
  `,
);

const physics = batch(
  "words-of-physics-and-energy",
  ["Words of Physics and Energy", "物理与能量的词"],
  ["force, motion and energy", "力、运动和能量"],
  `
  inertia|the tendency of an object to keep still or keep moving until a force acts on it|惯性|Because of ___, passengers lurch forward when a bus stops.|The heavy cart's ___ made it hard to push.|The committee's ___ kept the old rules in place.|momentum,torque|
  momentum|the force a moving object has because of its mass and speed|动量，势头|The rolling boulder gained ___ down the hill.|The campaign lost ___ after the debate.|A truck has more ___ than a bicycle at the same speed.|inertia,torque|
  torque|a force that makes something turn|扭矩，转矩|A long wrench gives more ___ on the bolt.|The engine's ___ pulls the heavy truck uphill.|Too much ___ snapped the axle.|momentum,acceleration|
  acceleration|the rate at which something gets faster|加速度，加速|The ___ of a falling stone is the same as that of a falling coin.|The car's ___ pressed us into our seats.|An ___ in prices worried the bank.|buoyancy,insulation|accelerate,accelerated
  buoyancy|the power of a liquid to keep things floating|浮力|Salt water gives more ___ than fresh water.|The life jacket's ___ kept him afloat.|Her ___ of spirit cheered the whole ward.|inertia,gravitation|
  gravitation|the force that pulls masses toward each other|万有引力，引力|Newton's law of ___ explains the orbits of the planets.|___ holds the moon near the earth.|The ___ of a black hole traps even light.|buoyancy,radiation|gravitational
  radiation|energy sent out as waves or particles|辐射|The sun's ___ warms the earth.|Workers wear badges that measure ___.|Too much ___ can damage living cells.|gravitation,conduction|radiate,radiated
  conduction|the passing of heat or electricity through a material|传导|Metal pans heat food by ___.|___ is slow in wood and fast in copper.|The ___ of electricity needs a closed circuit.|radiation,insulation|conductive
  insulation|material that stops heat, sound or electricity from passing|绝缘，隔热材料|Thick ___ keeps the house warm.|The wire's plastic ___ was cracked.|Good ___ cut our heating bills in half.|conduction,buoyancy|insulated
  kinetic|having to do with motion|运动的，动力的|A falling hammer has ___ energy.|The dancer's ___ grace thrilled the crowd.|___ sculptures move with the wind.|inertia,momentum|
  `,
);

const chemistry = batch(
  "words-of-chemistry-and-matter",
  ["Words of Chemistry and Matter", "化学与物质的词"],
  ["what things are made of and how they change", "物质的构成与变化"],
  `
  element|a substance that cannot be broken into simpler substances, such as gold or oxygen|元素|Oxygen is the most common ___ in the earth's crust.|The table lists every known ___.|Each ___ has its own number of protons.|molecule,alloy|elements
  molecule|the smallest unit of a substance, made of atoms joined together|分子|A ___ of water has two hydrogen atoms and one oxygen atom.|The ___ is too small to see with a normal microscope.|Sugar is a large ___.|element,isotope|molecules,molecular
  isotope|one of two or more forms of an element with different numbers of neutrons|同位素|Carbon-14 is a radioactive ___ used to date bones.|Each ___ of uranium behaves differently in a reactor.|Doctors use a harmless ___ to trace blood flow.|element,molecule|isotopes
  alloy|a metal made by mixing two or more metals|合金|Bronze is an ___ of copper and tin.|The bike frame is a light ___.|Steel is an ___ that rusts unless it is treated.|element,solvent|alloys
  solvent|a liquid in which other substances dissolve|溶剂|Water is the most common ___.|Paint thinner is a strong ___.|The ___ removed the glue from the glass.|alloy,oxidation|solvents
  oxidation|the combining of a substance with oxygen, as when iron rusts|氧化|___ turns a cut apple brown.|Rust is the ___ of iron.|Paint protects the bridge from ___.|distillation,solvent|oxidize,oxidized
  corrosion|the slow damage of metal by chemical action, such as rust|腐蚀|Salt air causes ___ on cars near the sea.|The pipes failed because of ___.|A coat of zinc prevents ___.|alloy,distillation|corrode,corroded,corrosive
  alkaline|having a pH above seven; the opposite of acidic|碱性的|Soap is slightly ___.|The lake water was too ___ for the fish.|___ soil suits some plants better than others.|inert,solvent|alkali
  inert|not reacting chemically with other substances; not moving|惰性的，不活泼的|Helium is an ___ gas.|The ___ body lay on the floor.|The ___ filler does not change the medicine.|alkaline,oxidation|
  distillation|the purifying of a liquid by boiling it and cooling the steam|蒸馏|Fresh water can be made from sea water by ___.|___ separates alcohol from water.|The book is a ___ of thirty years of research.|oxidation,corrosion|distill,distilled
  `,
);

const sky = batch(
  "words-of-the-cosmos",
  ["Words of the Cosmos", "宇宙的词"],
  ["stars, planets and the space between them", "恒星、行星和其间的太空"],
  `
  meteorite|a piece of rock or metal from space that has landed on earth|陨石|The museum shows a ___ that fell in 1910.|A ___ made the huge crater in Arizona.|Scientists cut the ___ open to study its iron.|supernova,quasar|meteorites
  supernova|the huge explosion of a dying star|超新星|A ___ can shine brighter than a whole galaxy.|The ___ of 1054 was seen in daylight.|Heavy elements are made in a ___.|meteorite,pulsar|supernovae,supernovas
  quasar|a very distant, very bright object at the center of a galaxy|类星体|The light from the ___ left it billions of years ago.|A ___ is powered by a giant black hole.|Astronomers found the most distant ___ yet.|meteorite,light-year|quasars
  pulsar|a spinning star that sends out regular pulses of radio waves|脉冲星|The ___ flashed thirty times a second.|At first the signals from the ___ were thought to come from aliens.|A ___ is the remains of a supernova.|quasar,meteorite|pulsars
  stellar|having to do with stars; excellent|恒星的；杰出的|___ winds blow from the sun.|She gave a ___ performance.|___ nurseries are clouds where stars are born.|planetary,cosmic|
  interstellar|between the stars|星际的|The probe has now entered ___ space.|___ dust blocks the light of distant stars.|An ___ journey would take thousands of years.|stellar,planetary|
  cosmic|having to do with the whole universe; very great|宇宙的；巨大的|___ rays strike the earth all the time.|The mistake was of ___ size.|The book asks ___ questions about time and space.|stellar,interstellar|
  planetary|having to do with planets|行星的|The ___ system around that star has five worlds.|___ scientists study the clouds of Venus.|The probe sent back ___ images.|perihelion,light-year|
  light-year|the distance light travels in a year, about 9.5 trillion kilometers|光年|A ___ is a distance, not a time.|The star is about one ___ from its nearest neighbor.|Even at the speed of light, crossing one ___ takes a whole year.|perihelion,supernova|light-years
  perihelion|the point in a planet's or comet's orbit nearest the sun|近日点|The comet is brightest at ___.|Earth reaches ___ in early January.|At ___, the planet moves fastest.|light-year,quasar|
  `,
);

const medicine = batch(
  "words-of-medicine-and-disease",
  ["Words of Medicine and Disease", "医学与疾病的词"],
  ["illness and its treatment", "疾病及其治疗"],
  `
  infectious|able to spread from one person to another|传染性的|Measles is a highly ___ disease.|Her laugh was ___, and soon everyone was laughing.|The ___ patients were kept on a separate ward.|benign,contagion|
  contagion|the spreading of a disease by contact; something harmful that spreads|传染，蔓延|Doctors feared ___ in the crowded camp.|Panic spread like a ___ through the market.|Washing hands limits ___.|remission,inflammation|
  benign|not dangerous to health; kind and gentle|良性的；和善的|Good news: the tumor was ___, not cancer.|He had a ___ smile for every guest.|The climate here is ___ all year.|malignant,infectious|
  malignant|dangerous and likely to spread or get worse; full of hatred|恶性的；恶毒的|The ___ growth had spread to his liver.|A ___ rumor ruined her name.|The cancer was ___ and spreading fast.|benign,palliative|malignancy
  tumor|a mass of cells growing where they should not|肿瘤|The scan showed a small ___ in the lung.|Not every ___ is cancer.|Surgeons removed the ___ in a long operation.|biopsy,inflammation|tumors
  biopsy|the removal of a small piece of tissue to test it for disease|活组织检查|The ___ showed that the cells were healthy.|The doctor took a ___ from the lump.|Results of the ___ came back in a week.|tumor,remission|biopsies
  remission|a period when a serious illness becomes less severe or disappears|(病情)缓解|After treatment, her cancer went into ___.|The ___ lasted ten years.|He enjoyed every day of his ___.|biopsy,contagion|
  relapse|a return of an illness after a period of improvement|复发|She seemed cured in winter, then had a ___ in the spring.|Good habits help prevent a ___.|After a short ___, she recovered fully.|remission,inflammation|relapsed,relapses
  inflammation|redness, swelling and pain in part of the body|炎症|Ice reduces the ___ of a twisted ankle.|The ___ in his joints made walking hard.|The drug fights ___.|contagion,tumor|inflamed
  palliative|easing pain or symptoms without curing the cause|缓解的，姑息的|___ care keeps dying patients comfortable.|The new law is a ___ measure, not a cure.|She worked as a ___ nurse.|benign,malignant|
  `,
);

const mind = batch(
  "words-of-the-mind",
  ["Words of the Mind", "心智的词"],
  ["how people think, feel and behave", "人如何思考、感受和行动"],
  `
  cognition|the mental processes of knowing, thinking and remembering|认知|Sleep is important for ___.|The study tested ___ in older adults.|Language and ___ develop together in children.|projection,stimulus|cognitive
  perception|the way one notices or understands something through the senses or the mind|感知，看法|Our ___ of color depends on light.|Public ___ of the company changed after the scandal.|Her ___ of danger was sharper than his.|cognition,projection|perceptions
  neurosis|a mental condition marked by constant anxiety or irrational behavior|神经症|His ___ made him check the locks ten times.|The film is a study of modern ___.|Her ___ about germs controlled her life.|projection,extrovert|neuroses,neurotic
  phobia|an extreme and irrational fear of something|恐惧症|She has a ___ of spiders.|His ___ of flying kept him at home.|Therapy can help people overcome a ___.|neurosis,stimulus|phobias,phobic
  compulsion|a strong urge to do something, often against one's will|强迫，冲动|He felt a ___ to wash his hands again.|She paid under ___, not by choice.|A ___ to check his phone ruled his day.|phobia,stimulus|compulsions,compulsive
  trauma|deep shock or harm caused by a terrible experience|创伤|The ___ of the earthquake stayed with the children.|Doctors treat head ___ quickly.|Soldiers may suffer ___ long after a war.|neurosis,phobia|traumas,traumatic
  projection|seeing one's own feelings in other people|投射|Calling others lazy may be ___ of one's own guilt.|Psychologists call this ___.|His anger at his brother was a kind of ___.|perception,trauma|
  introvert|a quiet person who gains energy from time alone|内向的人|As an ___, she enjoyed reading alone.|The ___ left the party early.|Even an ___ can be a strong leader.|extrovert,cognition|introverts,introverted
  extrovert|an outgoing person who gains energy from being with others|外向的人|The ___ talked to everyone at the wedding.|An ___ may find working alone hard.|He was a lively ___ who loved crowds.|introvert,stimulus|extroverts,extroverted
  stimulus|something that causes a reaction or growth|刺激，刺激物|The light was a ___ for the plant to grow.|Lower taxes were a ___ to business.|The dog responded to the ___ of the bell.|compulsion,projection|stimuli
  `,
);

const courtroom = batch(
  "words-of-the-courtroom",
  ["Words of the Courtroom", "法庭的词"],
  ["trials and the people in them", "审判和其中的人"],
  `
  indictment|a formal charge that a person has committed a serious crime; a strong criticism|起诉书；控诉|The grand jury returned an ___ against the mayor.|The report is an ___ of the school system.|He pleaded not guilty to every count of the ___.|acquittal,affidavit|indict,indicted,indictments
  acquittal|a judgment that a person is not guilty|无罪释放，宣告无罪|The ___ shocked the victim's family.|Her lawyer asked for an ___.|After his ___, he walked out a free man.|indictment,misdemeanor|acquittals
  affidavit|a written statement sworn to be true, used as evidence|宣誓书，宣誓证词|The witness signed an ___ before a lawyer.|Each ___ was read aloud in court.|She swore in an ___ that she had seen the car.|subpoena,indictment|affidavits
  subpoena|a written order to come to court as a witness|传票|The senator received a ___ to testify.|A ___ cannot be ignored.|The court issued a ___ for the bank's records.|affidavit,tribunal|subpoenaed,subpoenas
  perjury|the crime of lying in court after promising to tell the truth|伪证罪|The witness was charged with ___.|Lying under oath is ___.|___ can bring a prison sentence.|felony,misdemeanor|
  jurisdiction|the official power to make legal decisions, or the area where it applies|司法权，管辖范围|The case is outside this court's ___.|Each state has ___ over its own schools.|The crime took place in another ___.|tribunal,litigation|jurisdictions
  litigation|the process of taking a dispute to court|诉讼|The two companies have been in ___ for years.|___ is slow and expensive.|They settled to avoid ___.|jurisdiction,perjury|litigate,litigants
  tribunal|a court or group with power to judge a particular kind of case|法庭，裁判所|An international ___ tried the war criminals.|The employment ___ ruled in her favor.|The ___ will hear the case next month.|jurisdiction,subpoena|tribunals
  felony|a serious crime such as murder or robbery|重罪|Burglary is a ___ in most states.|A ___ can lead to years in prison.|Armed robbery is a serious ___.|misdemeanor,perjury|felonies,felon
  misdemeanor|a minor crime, less serious than a felony|轻罪|Parking in the wrong place is not even a ___.|Shoplifting a pen is usually a ___.|She was fined for a ___.|felony,acquittal|misdemeanors
  `,
);

const diplomacy = batch(
  "words-of-embassies-and-treaties",
  ["Words of Diplomacy", "外交的词"],
  ["how nations deal with each other", "国家之间如何打交道"],
  `
  embassy|the official office of one country's ambassador in another country|大使馆|Protesters gathered outside the ___.|She works at the ___ in Tokyo.|The ___ is headed by the ambassador.|consulate,accord|embassies
  consulate|an office of a country's government in a foreign city, helping its citizens|领事馆|The ___ is headed by a consul, not an ambassador.|Besides its embassy in Beijing, Britain has a ___ in Shanghai.|The ___ is smaller than the embassy.|embassy,attaché|consulates
  attaché|an expert on the staff of an embassy|(使馆)专员，随员|The military ___ met the defense minister.|She served as cultural ___ in Paris.|The ___ carried a locked case of papers.|consulate,embassy|attachés
  sanction|a penalty a country places on another to make it obey; official permission|制裁；批准|The UN placed a ___ on the sale of weapons.|The plan has the ___ of the board.|A new ___ cut off trade in oil.|truce,neutrality|sanctions,sanctioned
  embargo|an official ban on trade with a country|禁运|The ___ stopped all ships from entering the port.|They lifted the ___ after the war.|An oil ___ caused prices to soar.|truce,annexation|embargoes
  truce|an agreement to stop fighting for a time|休战|The two armies agreed to a ___ for the holiday.|The ___ lasted only three days.|The brothers called a ___ in their argument.|neutrality,embargo|truces
  accord|an official agreement between groups or countries; agreement in opinion|协议；一致|The peace ___ was signed in Geneva.|They acted in ___ with the rules.|The ___ set limits on fishing.|truce,embargo|accords
  neutrality|refusing to take sides in a war or argument|中立|Switzerland is famous for its ___.|The referee's ___ was questioned.|The country gave up its ___ and joined the war.|détente,annexation|neutral
  annexation|taking control of a country or region and making it part of another|吞并，兼并|The ___ of the island was never recognized.|The town opposed its ___ by the city.|Many nations condemned the ___.|neutrality,embargo|annex,annexed
  détente|an easing of hostility between countries|(国际关系)缓和|The 1970s brought a ___ between the superpowers.|The visit was a sign of ___.|___ ended when the war began.|neutrality,truce|
  `,
);

/** batchesC are the batches of science and inquiry, the courtroom and diplomacy. */
export const batchesC: readonly BatchSpec[] = [method, physics, chemistry, sky, medicine, mind, courtroom, diplomacy];
