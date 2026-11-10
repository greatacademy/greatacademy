// B1, unit 3: Health and Fitness. Illness, healthcare, fitness, nutrition, body and mind, causes and effects, symptoms
// and healthy habits; the first conditional. Its writing reuses the paragraph topics of the native courses.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { fill } from "../a2/kit.ts";
import { interleave, sentenceCase, vocabularyTopic, word } from "../words.ts";

const illness = vocabularyTopic({
  id: "b1-words-illness",
  title: t("Illness", "疾病"),
  summary: t(
    "Diseases, illnesses and infections; viruses, allergies and injuries; symptoms, treatments and cures; recovering, operations and surgery.",
    "疾病、病症和感染；病毒、过敏和损伤；症状、治疗和治愈；康复、手术和外科手术。",
  ),
  prerequisites: ["a2-words-health"],
  words: [
    word(
      "disease diseases",
      "an illness of people, animals or plants, often a serious one",
      "疾病",
      "Heart {disease} is common in older people.|symptom allergy | Washing your hands stops {diseases} from spreading.|treatments surgeries | Malaria is a {disease} carried by mosquitoes.|symptom treatment",
      "symptom treatment",
      "illness",
    ),
    word(
      "illness illnesses",
      "the state of being ill; a disease",
      "病；疾病",
      "She missed two weeks of school because of {illness}.|symptom cure | He died after a long {illness}.|cure symptom | Most childhood {illnesses} are not serious.|cures treatments",
      "injury treatment",
      "disease",
    ),
    word(
      "infection infections",
      "an illness caused by germs or a virus getting into the body",
      "感染",
      "The cut got dirty, and now she has an {infection}.|cure surgery | Ear {infections} are common in small children.|cures surgeries | Take this medicine to fight the {infection}.|surgery operation",
      "injury allergy",
    ),
    word(
      "virus viruses",
      "a very small living thing that causes illnesses such as colds and flu",
      "病毒",
      "Colds are caused by a {virus}.|surgery treatment | The {virus} spread quickly around the world.|surgery injury | Some medicines don't work against {viruses}.|surgeries injuries",
      "allergy cure",
    ),
    word(
      "allergy allergies",
      "a reaction of the body, such as sneezing, to a food, a plant or an animal",
      "过敏",
      "I have an {allergy} to cats. I sneeze when I'm near them.|operation injury | Many children have food {allergies}, for example to nuts.|operations surgeries | Spring is a hard time for people with {allergies}.|operations cures",
      "infection injury",
    ),
    word(
      "injury injuries",
      "damage to the body, for example in an accident",
      "损伤；受伤",
      "He missed the match because of a knee {injury}.|virus allergy | Nobody was hurt in the crash. There were no {injuries}.|viruses allergies | Wear a helmet to avoid head {injuries}.|viruses allergies",
      "infection disease",
    ),
    word(
      "symptom symptoms",
      "a sign of an illness, such as a high temperature",
      "症状",
      "A sore throat is often the first {symptom} of a cold.|cure surgery | What {symptoms} do you have? Do you have a fever?|cures surgeries | If the {symptoms} get worse, see a doctor.|cures surgeries",
      "treatment cure",
    ),
    word(
      "treatment treatments",
      "what a doctor does to make an ill or hurt person better",
      "治疗",
      "She's getting {treatment} for her back problem.|symptom virus | The new {treatment} has helped many patients.|symptom virus | There are several {treatments} for this illness.|symptoms viruses",
      "symptom disease",
      "cure",
    ),
    word(
      "cure cures cured curing",
      "to make an ill person well again; a medicine or treatment that does this",
      "治愈；疗法",
      "There is no {cure} for the common cold.|symptom injury | The doctors {cured} her, and she went home.|recovered suffered | This medicine can {cure} the infection.|recover suffer",
      "recover symptom",
      "treatment",
    ),
    word(
      "recover recovers recovered recovering",
      "to get well again after an illness or an injury",
      "康复；恢复",
      "It took him a month to {recover} from the flu.|cure treat | She's {recovering} well after her operation.|curing operating | Have you {recovered} from your cold?|cured operated",
      "cure suffer",
    ),
    word(
      "operation operations",
      "the cutting into someone's body by a doctor to repair or remove something",
      "手术",
      "She had an {operation} on her knee.|symptom virus | The {operation} lasted three hours.|symptom virus | The hospital does fifty {operations} a day.|symptoms viruses",
      "treatment injury",
      "surgery",
    ),
    word(
      "surgery surgeries",
      "medical treatment in which a doctor cuts into the body",
      "外科手术",
      "He needs {surgery} on his heart.|symptom allergy | After {surgery}, she stayed in hospital for a week.|symptom allergy | Doctors do thousands of eye {surgeries} every year.|symptoms allergies",
      "treatment symptom",
      "operation",
    ),
  ],
});

const healthcare = vocabularyTopic({
  id: "b1-words-healthcare",
  title: t("Healthcare", "医疗"),
  summary: t(
    "Clinics, surgeons and prescriptions; vaccines, insurance and therapy; x-rays, wards and specialists; bandages, wheelchairs and diagnosing.",
    "诊所、外科医生和处方；疫苗、保险和疗法；X 光、病房和专科医生；绷带、轮椅和诊断。",
  ),
  prerequisites: ["b1-words-illness"],
  words: [
    word(
      "clinic clinics",
      "a place where people go to see a doctor or get treatment",
      "诊所",
      "The {clinic} is open from eight to six.|bandage prescription | I went to the dental {clinic} to have my teeth checked.|bandage wheelchair | There are two {clinics} in our town.|bandages prescriptions",
      "ward specialist",
    ),
    word(
      "surgeon surgeons",
      "a doctor who does operations",
      "外科医生",
      "The {surgeon} operated on his heart.|ward bandage | She wants to be a {surgeon} when she grows up.|ward bandage | Two {surgeons} worked on the patient for six hours.|wards bandages",
      "clinic therapy",
      "specialist",
    ),
    word(
      "prescription prescriptions",
      "a paper from a doctor that says which medicine you need",
      "处方",
      "The doctor gave me a {prescription} for some medicine.|ward wheelchair | You can't buy this medicine without a {prescription}.|bandage ward | Take your {prescription} to the pharmacist.|ward wheelchair",
      "vaccine insurance",
    ),
    word(
      "vaccine vaccines",
      "a medicine that stops you from getting a disease",
      "疫苗",
      "Have you had the flu {vaccine} this year?|bandage ward | Scientists made a {vaccine} against the virus.|bandage ward | {Vaccines} have saved millions of lives.|Wards Wheelchairs",
      "prescription bandage",
    ),
    word(
      "insurance",
      "an agreement in which you pay a company and it pays your costs if you are ill, have an accident or lose something",
      "保险",
      "Do you have health {insurance}?|therapy bandage | Travel {insurance} paid for my hospital bill abroad.|therapy bandage | The {insurance} company paid for the new car after the accident.|therapy ward",
      "therapy prescription",
    ),
    word(
      "therapy therapies",
      "treatment of an illness or a problem, often without drugs or an operation",
      "疗法；治疗",
      "After the accident, she needed {therapy} to walk again.|insurance prescription | Music {therapy} can help people who feel sad.|insurance ward | New {therapies} for the disease are being tested.|insurances wards",
      "insurance vaccine",
    ),
    word(
      "x-ray x-rays",
      "a photo of the inside of your body",
      "X 光片",
      "The {x-ray} showed that his arm was broken.|bandage ward | The doctor sent me for an {x-ray} of my chest.|bandage ward | Dentists take {x-rays} of your teeth.|bandages wards",
      "bandage vaccine",
    ),
    word(
      "ward wards",
      "a large room in a hospital with beds for patients",
      "病房",
      "She's in the children's {ward} on the second floor.|bandage vaccine | Visitors may come to the {ward} between two and four.|bandage vaccine | The hospital has twelve {wards}.|bandages vaccines",
      "clinic wheelchair",
    ),
    word(
      "specialist specialists",
      "a doctor who knows a lot about one kind of illness or one part of the body",
      "专科医生；专家",
      "My doctor sent me to a heart {specialist}.|bandage ward | She's a {specialist} in children's illnesses.|bandage ward | We asked three {specialists}, and they all said the same.|bandages wards",
      "clinic therapy",
      "surgeon",
    ),
    word(
      "bandage bandages",
      "a long piece of cloth that you put around a hurt part of the body",
      "绷带",
      "The nurse put a {bandage} on my cut finger.|ward vaccine | Change the {bandage} every day.|ward x-ray | There are {bandages} in the first aid box.|wards vaccines",
      "wheelchair ward",
    ),
    word(
      "wheelchair wheelchairs",
      "a chair with wheels for people who cannot walk",
      "轮椅",
      "After the accident, he used a {wheelchair} for three months.|ward vaccine | The museum has ramps for {wheelchairs}.|bandages vaccines | She pushed her grandfather's {wheelchair} into the park.|ward vaccine",
      "bandage ward",
    ),
    word(
      "diagnose diagnoses diagnosed diagnosing",
      "to find out what illness someone has",
      "诊断",
      "The doctor {diagnosed} a broken bone.|insured vaccinated | It is hard to {diagnose} this illness early.|insure bandage | Doctors use x-rays to {diagnose} broken bones.|insure ward",
      "insure prescription",
    ),
  ],
});

const fitness = vocabularyTopic({
  id: "b1-words-fitness",
  title: t("Fitness", "健身"),
  summary: t(
    "Gyms, muscles and weights; workouts, jogging and stretching; yoga, marathons and athletes; energy, sweat and being active.",
    "健身房、肌肉和重量；锻炼、慢跑和拉伸；瑜伽、马拉松和运动员；精力、出汗和积极活动。",
  ),
  prerequisites: ["a2-words-sports"],
  words: [
    word(
      "gym gyms",
      "a room or a building with equipment for exercise",
      "健身房；体育馆",
      "I go to the {gym} three times a week.|muscle marathon | Our school {gym} has new running machines.|muscle yoga | There are lots of {gyms} in the city center.|muscles marathons",
      "muscle yoga",
    ),
    word(
      "muscle muscles",
      "one of the parts inside the body that make it move",
      "肌肉",
      "Lifting weights makes your {muscles} stronger.|gyms marathons | I hurt a {muscle} in my leg.|gym marathon | Your heart is a {muscle}.|gym marathon",
      "gym weight",
    ),
    word(
      "weight weights",
      "how heavy someone or something is; a heavy piece of metal lifted for exercise",
      "体重；重量；哑铃",
      "He's trying to lose {weight}.|energy yoga | She lifts {weights} at the gym.|marathons athletes | What is the {weight} of this box?|energy yoga",
      "energy muscle",
    ),
    word(
      "workout workouts",
      "a period of physical exercise",
      "锻炼",
      "I do a twenty-minute {workout} every morning.|muscle athlete | After a hard {workout}, I feel great.|muscle athlete | These {workouts} are good for beginners.|muscles energies",
      "marathon gym",
    ),
    word(
      "jog jogs jogged jogging",
      "to run slowly for exercise",
      "慢跑",
      "I {jog} five kilometers before breakfast.|stretch sweat | She goes {jogging} every evening.|stretching sweating | We {jogged} slowly around the lake.|stretched sweated",
      "stretch sweat",
    ),
    word(
      "stretch stretches stretched stretching",
      "to make your arms, legs or body as long as you can",
      "伸展；拉伸",
      "Always {stretch} your legs before you run.|jog sweat | The cat woke up and {stretched}.|jogged sweated | Do some {stretching} after your workout.|sweating marathon",
      "jog sweat",
    ),
    word(
      "yoga",
      "a kind of exercise from India, with slow movements and deep breathing",
      "瑜伽",
      "My mom does {yoga} to relax.|muscle marathon | In {yoga}, you breathe slowly and stretch.|marathon gym | The {yoga} class starts at seven.|muscle weight",
      "marathon workout",
    ),
    word(
      "marathon marathons",
      "a running race of about 42 kilometers",
      "马拉松",
      "She ran her first {marathon} last year.|gym muscle | A {marathon} is about 42 kilometers long.|gym muscle | He has run ten {marathons}.|gyms muscles",
      "workout yoga",
    ),
    word(
      "athlete athletes",
      "a person who is good at sport, especially running and jumping",
      "运动员",
      "Olympic {athletes} train every day.|gyms muscles | She's a fast {athlete}.|gym muscle | The {athlete} won three gold medals.|gym yoga",
      "muscle gym",
    ),
    word(
      "energy energies",
      "the strength to be active without feeling tired; power that makes machines work",
      "精力；能量",
      "Children have so much {energy}!|weight yoga | Bananas give you {energy}.|yoga athletes | Solar {energy} comes from the sun.|weight yoga",
      "weight muscle",
    ),
    word(
      "sweat sweats sweated sweating",
      "to have water come out through your skin when you are hot",
      "出汗；汗水",
      "I {sweat} a lot when it's hot.|yoga gym | He was hot and {sweating} after the long walk.|stretching jogging | {Sweat} ran down her face.|Yoga Energy",
      "stretch jog",
    ),
    word(
      "active",
      "doing a lot of things, especially physical things",
      "活跃的；积极的",
      "My grandma is very {active}. She swims every day.|tense lazy | Try to stay {active} as you get older.|lazy tired | Children should be {active} for an hour a day.|lazy tense",
      "lazy tense",
    ),
  ],
});

const nutrition = vocabularyTopic({
  id: "b1-words-nutrition",
  title: t("Nutrition", "营养"),
  summary: t(
    "Vitamins, protein and fat; calories and nutrition; vegetarians and a balanced diet; junk food, snacks and portions; organic food and fiber.",
    "维生素、蛋白质和脂肪；卡路里和营养；素食者和均衡饮食；垃圾食品、零食和份量；有机食品和纤维。",
  ),
  prerequisites: ["a2-words-ingredients"],
  words: [
    word(
      "vitamin vitamins",
      "a natural thing in food that you need to stay healthy",
      "维生素",
      "Oranges are full of {vitamin} C.|protein fiber | Fresh vegetables give you lots of {vitamins}.|portions calories | Do you take {vitamins} in the winter?|portions fibers",
      "protein calorie",
    ),
    word(
      "protein proteins",
      "a part of foods such as meat, eggs and beans that helps your body grow",
      "蛋白质",
      "Eggs and beans are rich in {protein}.|calorie junk | Athletes need a lot of {protein} to build muscle.|junk fiber | Meat and fish are good sources of {protein}.|junk calorie",
      "vitamin fiber",
    ),
    word(
      "fat fatter fattest fats",
      "the oily part of food; (of a person or an animal) heavy",
      "脂肪；胖的",
      "This cheese has a lot of {fat}.|junk snack | Our cat is getting {fatter} because he eats too much.|thinner shorter | Some {fats}, like olive oil, are good for you.|portions snacks",
      "fiber protein",
    ),
    word(
      "calorie calories",
      "a measure of how much energy food gives you",
      "卡路里",
      "This drink has 200 {calories}.|vitamins portions | Running burns a lot of {calories}.|vitamins fibers | How many {calories} are there in a banana?|vitamins snacks",
      "vitamin portion",
    ),
    word(
      "nutrition",
      "the food you eat and how it affects your health",
      "营养",
      "Good {nutrition} is important for growing children.|junk portion | She's studying {nutrition} at university.|junk portion | The label gives {nutrition} information.|junk snack",
      "junk calorie",
    ),
    word(
      "vegetarian vegetarians",
      "a person who does not eat meat or fish; without meat or fish",
      "素食者；素食的",
      "I'm a {vegetarian}. I don't eat meat.|snack portion | The restaurant has three {vegetarian} dishes.|fiber calorie | {Vegetarians} get protein from beans and eggs.|Snacks Portions",
      "snack organic",
    ),
    word(
      "balanced",
      "with the right amounts of different things",
      "均衡的",
      "A {balanced} diet has fruit, vegetables, grains and protein.|junk fat | Try to eat {balanced} meals.|tense fiber | Her life is well {balanced} between work and fun.|organic junk",
      "junk organic",
    ),
    word(
      "junk",
      "food that is bad for your health, such as chips and sweets (junk food); things of no use",
      "垃圾食品；废品",
      "Too much {junk} food is bad for you.|fiber vitamin | The garage is full of old {junk}.|fiber nutrition | Stop eating {junk} and have an apple.|nutrition vitamin",
      "fiber organic",
    ),
    word(
      "snack snacks",
      "a small amount of food eaten between meals",
      "零食；小吃",
      "I usually have a {snack} after school.|portion calorie | Nuts are a healthy {snack}.|calorie vitamin | Don't eat {snacks} before dinner.|portions calories",
      "portion vitamin",
    ),
    word(
      "portion portions",
      "an amount of food for one person",
      "一份",
      "The {portions} at this restaurant are huge.|calories vitamins | Eat five {portions} of fruit and vegetables a day.|calories snacks | A small {portion} of rice is enough for me.|calorie vitamin",
      "snack calorie",
    ),
    word(
      "organic",
      "grown without chemicals",
      "有机的",
      "We buy {organic} vegetables at the market.|junk balanced | {Organic} farmers don't use chemicals.|Junk Balanced | Is this milk {organic}?|junk balanced",
      "balanced junk",
    ),
    word(
      "fiber",
      "the part of plants such as grains and vegetables that helps food pass through your body",
      "纤维",
      "Brown bread has more {fiber} than white bread.|junk portion | Beans are high in {fiber}.|junk portion | Eat more {fiber} to help your stomach.|junk calorie",
      "fat protein",
    ),
  ],
});

const bodyAndMind = vocabularyTopic({
  id: "b1-words-body-and-mind",
  title: t("Body and Mind", "身体和心理"),
  summary: t(
    "The chest, lungs and nerves; mental and physical; stress, tense and anxious; depressed and moods; breathing and the pulse.",
    "胸部、肺和神经；精神的和身体的；压力、紧张和焦虑；抑郁和心情；呼吸和脉搏。",
  ),
  prerequisites: ["a2-words-body-2"],
  words: [
    word(
      "chest chests",
      "the front of your body between your neck and your stomach",
      "胸部",
      "I have a pain in my {chest}.|mood pulse | He folded his arms across his {chest}.|mood stress | The doctor listened to my {chest}.|mood stress",
      "lung pulse",
    ),
    word(
      "lung lungs",
      "one of the two parts in your chest that you breathe with",
      "肺",
      "Smoking damages your {lungs}.|moods pulses | Take a deep breath and fill your {lungs} with air.|moods nerves | She has a {lung} infection.|mood pulse",
      "chest nerve",
    ),
    word(
      "nerve nerves",
      "one of the thin parts in the body that carry messages to and from the brain; (nerves) a nervous feeling",
      "神经；紧张",
      "{Nerves} carry messages from the brain to the body.|Lungs Moods | I had a bad case of {nerves} before my exam.|lungs pulses | The cut damaged a {nerve} in his finger.|mood lung",
      "lung mood",
    ),
    word(
      "mental",
      "of the mind",
      "精神的；心理的",
      "Sport is good for your {mental} health.|anxious depressed | Doing puzzles is good {mental} exercise.|anxious tense | Stress can cause {mental} illness.|anxious tense",
      "anxious tense",
    ),
    word(
      "physical",
      "of the body",
      "身体的",
      "Swimming is good {physical} exercise.|anxious depressed | He's in good {physical} condition.|anxious tense | Football is a very {physical} game.|anxious depressed",
      "anxious depressed",
    ),
    word(
      "stress",
      "a feeling of worry because of problems in your life or work",
      "压力",
      "Exams cause a lot of {stress}.|pulse mood | Yoga helps me deal with {stress}.|pulse lung | She's been under a lot of {stress} at work.|pulse mood",
      "mood pulse",
    ),
    word(
      "tense tenser tensest",
      "nervous and worried, so that you cannot relax; (of a muscle) tight",
      "紧张的",
      "I always feel {tense} before an interview.|physical mental | The last minutes of the match were very {tense}.|mental depressed | My shoulders are {tense}. I need a massage.|mental anxious",
      "physical mental",
      "anxious",
    ),
    word(
      "anxious",
      "worried and nervous",
      "焦虑的；担心的",
      "She's {anxious} about her exam results.|physical mental | He felt {anxious} when his son didn't come home.|physical mental | Don't be {anxious}. Everything will be fine.|physical mental",
      "physical depressed",
      "tense",
    ),
    word(
      "depressed",
      "very sad for a long time",
      "沮丧的；抑郁的",
      "He felt {depressed} after he lost his job.|physical mental | Talk to someone if you feel {depressed}.|physical mental | She was {depressed} for months after her dog died.|physical mental",
      "physical tense",
    ),
    word(
      "mood moods",
      "the way you feel at one time",
      "心情；情绪",
      "I'm in a good {mood} today!|pulse stress | Exercise can improve your {mood}.|lung stress | His {moods} change quickly.|pulses lungs",
      "pulse stress",
    ),
    word(
      "breathe breathes breathed breathing",
      "to take air into your body and let it out again",
      "呼吸",
      "{Breathe} in slowly through your nose.|Pulse Stress | Fish {breathe} through gills.|pulse stress | He was {breathing} fast after the race.|pulsing stressing",
      "pulse stress",
    ),
    word(
      "pulse pulses",
      "the beat of your heart that you can feel in your wrist",
      "脉搏",
      "The nurse took my {pulse}.|mood stress | Your {pulse} goes up when you run.|lung nerve | Check your {pulse} after exercise.|mood stress",
      "mood lung",
    ),
  ],
});

const healthVerbs = vocabularyTopic({
  id: "b1-words-health-verbs",
  title: t("Causes and Effects", "原因和结果"),
  summary: t(
    "Avoiding, preventing and reducing; increasing, suffering and affecting; causing, harming and damaging; risks, effects and benefits.",
    "避免、预防和减少；增加、患病和影响；导致、伤害和损害；风险、效果和好处。",
  ),
  prerequisites: ["b1-words-illness"],
  words: [
    word(
      "avoid avoids avoided avoiding",
      "to stay away from something; to try not to do something",
      "避免",
      "Try to {avoid} sugary drinks.|increase suffer | She {avoided} my eyes.|increased suffered | We left early to {avoid} the traffic.|increase suffer",
      "increase cause",
    ),
    word(
      "prevent prevents prevented preventing",
      "to stop something from happening",
      "预防；阻止",
      "Washing your hands helps {prevent} illness.|increase suffer | The rain {prevented} us from playing.|increased suffered | What can we do to {prevent} accidents?|increase suffer",
      "cause increase",
    ),
    word(
      "reduce reduces reduced reducing",
      "to make something smaller or less",
      "减少",
      "Exercise can {reduce} stress.|suffer benefit | The shop has {reduced} its prices by twenty percent.|suffered avoided | Turn off the lights to {reduce} your electricity bill.|increase suffer",
      "increase suffer",
    ),
    word(
      "increase increases increased increasing",
      "to make or become larger",
      "增加",
      "The number of students has {increased} from 300 to 500.|reduced avoided | Smoking {increases} the risk of heart disease.|reduces avoids | Prices {increase} every year.|reduce avoid",
      "reduce prevent",
    ),
    word(
      "suffer suffers suffered suffering",
      "to feel pain or be ill (suffer from)",
      "受苦；患病",
      "She {suffers} from headaches.|causes affects | Many people {suffered} in the hot summer.|caused affected | He's {suffering} from a bad cold.|causing affecting",
      "cause affect",
    ),
    word(
      "affect affects affected affecting",
      "to change something or someone",
      "影响",
      "Too little sleep can {affect} your memory.|suffer benefit | The storm {affected} thousands of homes.|suffered benefited | Does the weather {affect} your mood?|suffer cause",
      "effect suffer",
    ),
    word(
      "cause causes caused causing",
      "to make something happen; the reason something happens",
      "导致；原因",
      "Smoking {causes} many diseases.|suffers prevents | What was the {cause} of the fire?|benefit stress | The storm {caused} a lot of damage.|suffered avoided",
      "suffer prevent",
    ),
    word(
      "harm harms harmed harming",
      "to hurt or damage; damage or hurt",
      "伤害",
      "Too much sun can {harm} your skin.|benefit suffer | No animals were {harmed} in the film.|benefited suffered | Smoking does a lot of {harm}.|benefit effect",
      "benefit suffer",
      "damage",
    ),
    word(
      "damage damages damaged damaging",
      "physical harm to something; to harm something",
      "损坏；损害",
      "The storm {damaged} our roof.|suffered benefited | Loud music can {damage} your ears.|suffer benefit | The fire caused a lot of {damage}.|benefit effect",
      "benefit prevent",
      "harm",
    ),
    word(
      "risk risks",
      "the chance that something bad will happen",
      "风险",
      "Smoking increases the {risk} of lung disease.|benefit pulse | Don't take {risks} when you drive.|benefits effects | There's a small {risk} of rain this afternoon.|benefit effect",
      "benefit effect",
    ),
    word(
      "effect effects",
      "a change that something causes",
      "效果；影响",
      "The medicine had no {effect}.|pulse cause | Too much screen time has a bad {effect} on sleep.|cause risk | What are the side {effects} of this medicine?|causes risks",
      "cause affect",
    ),
    word(
      "benefit benefits",
      "a good thing that something gives you",
      "好处",
      "The {benefits} of exercise are clear.|causes damages | Regular sleep has many {benefits}.|risks causes | One {benefit} of cycling is that it's free.|risk cause",
      "risk harm",
    ),
  ],
});

const symptoms = vocabularyTopic({
  id: "b1-words-symptoms",
  title: t("Symptoms", "症状"),
  summary: t(
    "Examining and injections; bleeding, fainting and swallowing; sneezing, itching and scratching; bruises, and feeling swollen, sore and dizzy.",
    "检查和注射；流血、晕倒和吞咽；打喷嚏、发痒和抓挠；瘀伤，以及肿胀、疼痛和头晕。",
  ),
  prerequisites: ["b1-words-illness"],
  words: [
    word(
      "examine examines examined examining",
      "to look at something or someone carefully",
      "检查",
      "The doctor {examined} my throat.|swallowed sneezed | Let me {examine} your eye.|sneeze faint | The police {examined} the car carefully.|swallowed fainted",
      "swallow scratch",
    ),
    word(
      "injection injections",
      "medicine put into your body with a needle",
      "注射",
      "The nurse gave me an {injection} in my arm.|bruise scratch | I'm afraid of {injections}.|sneezes itches | Some medicines are given as an {injection}, not as pills.|bruise scratch",
      "bruise itch",
    ),
    word(
      "bleed bleeds bled bleeding",
      "to lose blood",
      "流血",
      "Your nose is {bleeding}!|fainting swallowing | The cut {bled} for a long time.|fainted swallowed | Press hard on the cut to stop it {bleeding}.|swallowing sneezing",
      "faint itch",
    ),
    word(
      "faint faints fainted fainting",
      "to fall down suddenly because you stop being awake for a short time",
      "晕倒",
      "It was so hot that a boy {fainted} in the school hall.|bled swallowed | She felt she was going to {faint}, so she sat down.|bleed swallow | Some people {faint} when they see blood.|bleed swallow",
      "bleed sneeze",
    ),
    word(
      "swallow swallows swallowed swallowing",
      "to make food or drink go down your throat",
      "吞咽",
      "It hurts when I {swallow}.|examine injection | Chew your food well before you {swallow} it.|sneeze faint | The dog {swallowed} a small toy.|sneezed fainted",
      "sneeze bleed",
    ),
    word(
      "sneeze sneezes sneezed sneezing",
      "to blow air out of your nose suddenly, for example when you have a cold",
      "打喷嚏",
      "Cats make me {sneeze}.|swallow bleed | Cover your mouth when you {sneeze}.|bleed swallow | He {sneezed} five times in a row.|bled swallowed",
      "swallow itch",
    ),
    word(
      "itch itches itched itching",
      "to have a feeling on your skin that makes you want to rub it",
      "发痒",
      "My mosquito bite {itches}.|bleeds faints | This wool sweater makes my skin {itch}.|bleed faint | Stop scratching! I know it {itches}, but you'll make it worse.|bleeds faints",
      "scratch bleed",
    ),
    word(
      "scratch scratches scratched scratching",
      "to rub your skin with your nails",
      "抓；挠",
      "Don't {scratch} the bite, or it will get worse.|sneeze faint | The cat {scratched} my hand.|sneezed fainted | He {scratched} his head and thought.|sneezed fainted",
      "itch sneeze",
    ),
    word(
      "bruise bruises",
      "a blue or purple mark on your skin after you hit it",
      "瘀伤",
      "I fell off my bike and got a big {bruise} on my leg.|injection itch | Her arms were covered in {bruises}.|injections sneezes | The {bruise} turned yellow after a few days.|injection sneeze",
      "injection itch",
    ),
    word(
      "swollen",
      "bigger than usual, because of an injury or an illness",
      "肿胀的",
      "My ankle is {swollen} after I fell.|dizzy itch | Her eyes were red and {swollen} from crying.|dizzy itch | He has a {swollen} knee.|dizzy itch",
      "dizzy sore",
    ),
    word(
      "sore sorer sorest",
      "painful",
      "疼痛的",
      "I have a {sore} throat.|dizzy itch | My legs are {sore} after the marathon.|dizzy itch | My feet are getting {sorer}. Let's stop and rest.|dizzier faster",
      "dizzy swollen",
    ),
    word(
      "dizzy dizzier dizziest",
      "feeling that everything is turning around and you might fall",
      "头晕的",
      "The room is turning around. I feel {dizzy}.|swollen sore | Spinning round and round makes me {dizzy}.|swollen bruise | She got {dizzy} and fell off the ladder.|swollen itch",
      "swollen sore",
    ),
  ],
});

const habits = vocabularyTopic({
  id: "b1-words-healthy-habits",
  title: t("Healthy Habits", "健康习惯"),
  summary: t(
    "Routines and lifestyles; alcohol, cigarettes and being overweight; skipping meals; regular and normal; naps, meditation, hygiene and quitting.",
    "日常习惯和生活方式；酒精、香烟和超重；不吃饭；规律的和正常的；小睡、冥想、卫生和戒掉。",
  ),
  prerequisites: ["a2-words-staying-well"],
  words: [
    word(
      "routine routines",
      "the usual order in which you do things",
      "日常惯例",
      "My morning {routine} is always the same: shower, breakfast, bus.|alcohol hygiene | Exercise is part of my daily {routine}.|alcohol cigarette | Children feel safe when they have {routines}.|cigarettes meditations",
      "alcohol nap",
      "lifestyle",
    ),
    word(
      "lifestyle lifestyles",
      "the way you live",
      "生活方式",
      "She has a healthy {lifestyle}: she eats well and exercises.|alcohol hygiene | City {lifestyles} are often busy and stressful.|cigarettes naps | Moving to the country changed our whole {lifestyle}.|alcohol cigarette",
      "hygiene alcohol",
      "routine",
    ),
    word(
      "alcohol",
      "drinks such as beer and wine that can make people drunk",
      "酒精；酒",
      "Drivers must not drink {alcohol}.|hygiene meditation | Children shouldn't drink {alcohol}.|hygiene nap | Beer and wine contain {alcohol}.|hygiene routine",
      "cigarette hygiene",
    ),
    word(
      "cigarette cigarettes",
      "a thin paper tube of tobacco that people smoke",
      "香烟",
      "He smoked twenty {cigarettes} a day.|naps routines | {Cigarettes} are bad for your lungs.|Naps Routines | She put out her {cigarette} and went inside.|nap routine",
      "alcohol nap",
    ),
    word(
      "overweight",
      "too heavy, in a way that is bad for your health",
      "超重的",
      "The doctor said I'm a bit {overweight}, so I should eat less.|regular normal | {Overweight} pets can have health problems too.|Regular Hygiene | He was {overweight} because he ate junk food every day.|regular normal",
      "regular normal",
    ),
    word(
      "skip skips skipped skipping",
      "not to do something you usually do, such as eating a meal",
      "不做；跳过",
      "Don't {skip} breakfast. It's the most important meal.|nap meditation | She {skipped} her piano lesson because she was ill.|napped meditated | I'm going to {skip} the gym today. I'm too tired.|nap meditate",
      "quit nap",
    ),
    word(
      "regular regularly",
      "happening at the same times each day or week; often",
      "规律的；定期的",
      "Take {regular} breaks when you study.|overweight alcohol | I exercise {regularly}, three times a week.|overweight hygiene | Brush your teeth {regularly}.|overweight alcohol",
      "overweight normal",
    ),
    word(
      "normal",
      "usual and ordinary; what you expect",
      "正常的；平常的",
      "Your temperature is {normal}. You don't have a fever.|overweight alcohol | It's {normal} to feel nervous before an exam.|overweight alcohol | After the holiday, life went back to {normal}.|overweight hygiene",
      "overweight regular",
    ),
    word(
      "nap naps",
      "a short sleep during the day",
      "小睡；午睡",
      "Grandpa has a {nap} after lunch.|routine hygiene | A short {nap} can help you feel less tired.|cigarette alcohol | Babies need several {naps} a day.|cigarettes routines",
      "routine meditation",
    ),
    word(
      "meditation",
      "sitting quietly and thinking calmly for a time, to relax",
      "冥想",
      "{Meditation} helps me feel calm.|Alcohol Hygiene | She does ten minutes of {meditation} every morning.|alcohol hygiene | In {meditation}, you sit quietly and focus on your breathing.|alcohol hygiene",
      "hygiene nap",
    ),
    word(
      "hygiene",
      "keeping yourself and things clean to stop disease",
      "卫生",
      "Good {hygiene} stops the spread of disease.|meditation alcohol | Washing your hands is basic {hygiene}.|meditation lifestyle | The restaurant was closed because of poor {hygiene}.|meditation routine",
      "meditation routine",
    ),
    word(
      "quit quits quitting",
      "to stop doing something",
      "戒掉；放弃",
      "My dad {quit} smoking last year.|skipped napped | It's hard to {quit} sugar.|nap meditate | She's {quitting} her job to travel.|napping meditating",
      "skip nap",
    ),
  ],
});

// The first conditional.

/**
 * conditions are the subject of the if-clause, its verb in the present, the base form and the past of that verb, the
 * rest of the if-clause, and the subject, verb and rest of the result.
 */
const conditions: readonly (readonly [string, string, string, string, string, string, string, string])[] = [
  ["it", "rains", "rain", "rained", "tomorrow", "we", "stay", "at home"],
  ["you", "exercise", "exercise", "exercised", "every day", "you", "feel", "better"],
  ["she", "studies", "study", "studied", "hard", "she", "pass", "the exam"],
  ["we", "leave", "leave", "left", "now", "we", "catch", "the train"],
  ["you", "eat", "eat", "ate", "too much sugar", "your teeth", "get", "worse"],
  ["I", "see", "see", "saw", "Tom", "I", "give", "him your message"],
  ["they", "miss", "miss", "missed", "the bus", "they", "be", "late"],
  ["it", "is", "be", "was", "sunny", "we", "go", "to the beach"],
  ["you", "heat", "heat", "heated", "the ice", "it", "melt", ""],
  ["my mom", "finds", "find", "found", "out", "she", "be", "angry"],
  ["the shop", "has", "have", "had", "my size", "I", "buy", "the shoes"],
  ["you", "take", "take", "took", "this medicine", "you", "feel", "better soon"],
  ["we", "hurry", "hurry", "hurried", "", "we", "get", "there on time"],
  ["he", "practices", "practice", "practiced", "every day", "he", "win", "the race"],
  ["I", "have", "have", "had", "time", "I", "help", "you"],
  ["the weather", "is", "be", "was", "nice", "we", "have", "a picnic"],
  ["Anna", "calls", "call", "called", "me", "I", "tell", "her the news"],
];

const join = (...parts: readonly string[]) => parts.filter((p) => p !== "").join(" ");
const pronouns = new Set(["I", "you", "we", "they", "he", "she", "it"]);
/** willOf is the result's subject with will, or with 'll after a pronoun, as a pattern. */
const willOf = (subject: string, capital: boolean) => {
  const s = capital ? sentenceCase(subject) : subject;
  return pronouns.has(subject) ? `[${s} will|${s}'ll]` : `${s} will`;
};

const ifVerbChoice: readonly ChoiceItem[] = interleave([
  conditions.map(
    ([s, present, base, past, rest, rs, rv, rr]): ChoiceItem => [
      `${join("If", s, "___", rest)}, ${join(rs, "will", rv, rr)}.`,
      present,
      [`will ${base}`, past],
    ],
  ),
  conditions.map(
    ([s, present, base, past, rest, rs, rv, rr]): ChoiceItem => [
      `${join(sentenceCase(rs), "will", rv, rr, "if", s, "___", rest)}.`,
      present,
      [`will ${base}`, past],
    ],
  ),
]);

const resultChoice: readonly ChoiceItem[] = interleave([
  conditions.map(
    ([s, present, , , rest, rs, rv, rr]): ChoiceItem => [
      `${join("If", s, present, rest)}, ${join(rs, "___", rr)}.`,
      `will ${rv}`,
      [`would ${rv}`, `to ${rv}`],
    ],
  ),
  conditions.map(
    ([s, present, , , rest, rs, rv, rr]): ChoiceItem => [
      `${join(sentenceCase(rs), "___", rr, "if", s, present, rest)}.`,
      `will ${rv}`,
      [`would ${rv}`, `to ${rv}`],
    ],
  ),
]);

const conditionalTyped: readonly TypedItem[] = interleave([
  conditions.map(
    ([s, present, base, past, rest, rs, rv, rr]): TypedItem => ({
      shown: `if ${join(s, base, rest)} → ${join(rs, rv, rr)}`,
      accepted: [`${join("If", s, present, rest)}, ${join(willOf(rs, false), rv, rr)}.`],
      canonical: `${join("If", s, present, rest)}, ${join(rs, "will", rv, rr)}.`,
      wrong: [
        `${join("If", s, "will", base, rest)}, ${join(rs, "will", rv, rr)}.`,
        `${join("If", s, past, rest)}, ${join(rs, "will", rv, rr)}.`,
      ],
    }),
  ),
  conditions.map(
    ([s, present, base, past, rest, rs, rv, rr]): TypedItem => ({
      shown: `${join(rs, rv, rr)} ← if ${join(s, base, rest)}`,
      accepted: [`${join(willOf(rs, true), rv, rr, "if", s, present, rest)}.`],
      canonical: `${join(sentenceCase(rs), "will", rv, rr, "if", s, present, rest)}.`,
      wrong: [
        `${join(sentenceCase(rs), "will", rv, rr, "if", s, "will", base, rest)}.`,
        `${join(sentenceCase(rs), "will", rv, rr, "if", s, past, rest)}.`,
      ],
    }),
  ),
]);

/** condNote explains in Chinese which verb form each part of a first conditional takes. */
function condNote(right: string): string {
  if (right.startsWith("will ")) return "结果部分说将来会怎样，用 will 加动词原形";
  return "if 从句虽然说的是将来，却用一般现在时，不用 will";
}

const firstConditional: TopicDef = {
  id: "first-conditional",
  title: t("If It Rains, We Will Stay", "如果下雨，我们就待在家（第一条件句）"),
  summary: t(
    "If you exercise, you will feel better. The if-part takes the present, the result takes will: not If you will exercise.",
    "If you exercise, you will feel better。if 部分用一般现在时，结果部分用 will：不能说 If you will exercise。",
  ),
  prerequisites: ["will-for-the-future", "subordinating-conjunctions"],
  encompasses: [
    { topic: "will-for-the-future", weight: 0.3 },
    { topic: "subordinating-conjunctions", weight: 0.1 },
  ],
  xp: 25,
  strand: "grammar",
  knowledgePoints: [
    point(
      "if-part",
      t("The present after if", "if 后面用一般现在时"),
      t(
        "To talk about a real possibility in the future, use *if* + the **present simple**, and *will* in the result:\n\n- *If it **rains** tomorrow, we will stay at home.*\n- *We will stay at home if it **rains** tomorrow.*\n\nThe *if*-part is about the future, but it never takes *will*: not *If it will rain tomorrow*. Remember the *-s* after *he*, *she* and *it*: *If she **studies** hard…*",
        "说将来可能发生的事情时，用 *if* 加**一般现在时**，结果部分用 *will*：\n\n- *If it **rains** tomorrow, we will stay at home.*\n- *We will stay at home if it **rains** tomorrow.*\n\n*if* 部分虽然说的是将来，却不能用 *will*：不能说 *If it will rain tomorrow*。中文“如果明天会下雨”里可以有“会”，英语的 *if* 从句里却不行。主语是 *he*、*she*、*it* 时别忘了加 *-s*：*If she **studies** hard…*",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), ifVerbChoice, (right, shown) =>
        t(fill(shown, right), `${fill(shown, right)}（${condNote(right)}）`),
      ),
    ),
    point(
      "result",
      t("Will in the result", "结果部分用 will"),
      t(
        "The result of a real possibility takes *will* + the base form: *If you exercise, you **will feel** better.* Do not use *would* here, which is for situations you only imagine, and do not add *to*: not *you will to feel*.\n\nWhen the *if*-part comes first, put a comma after it. When the result comes first, there is no comma.",
        "真实可能情况的结果用 *will* 加动词原形：*If you exercise, you **will feel** better.* 这里不要用 *would*（*would* 用于想象的情况），也不要加 *to*：不能说 *you will to feel*。\n\n*if* 部分在前时，后面加逗号；结果在前时，不加逗号。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), resultChoice, (right, shown) =>
        t(fill(shown, right), `${fill(shown, right)}（${condNote(right)}）`),
      ),
    ),
    point(
      "write",
      t("Writing first conditionals", "写第一条件句"),
      t(
        "Write the sentence from the note. The arrow → means the *if*-part comes first: *if it rain tomorrow → we stay at home* becomes *If it rains tomorrow, we will stay at home.* The arrow ← means the result comes first: *We will stay at home if it rains tomorrow.* You may write *we'll* for *we will*.",
        "根据笔记写句子。箭头 → 表示 *if* 部分在前：*if it rain tomorrow → we stay at home* 写成 *If it rains tomorrow, we will stay at home.* 箭头 ← 表示结果在前：*We will stay at home if it rains tomorrow.* 可以把 *we will* 写成 *we'll*。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Write a first conditional sentence from the note.", "根据笔记写一个第一条件句。"),
        conditionalTyped,
        (right) => t(right, `${right}（if 部分用一般现在时，结果部分用 will）`),
      ),
    ),
  ],
};

/** topics are the topics of the unit Health and Fitness. */
export const topics: readonly TopicDef[] = [
  illness.topic,
  healthcare.topic,
  fitness.topic,
  nutrition.topic,
  bodyAndMind.topic,
  healthVerbs.topic,
  symptoms.topic,
  habits.topic,
  firstConditional,
];

/** vocabulary are the words the unit Health and Fitness teaches. */
export const vocabulary: readonly WordBatch[] = [
  illness.batch,
  healthcare.batch,
  fitness.batch,
  nutrition.batch,
  bodyAndMind.batch,
  healthVerbs.batch,
  symptoms.batch,
  habits.batch,
];
