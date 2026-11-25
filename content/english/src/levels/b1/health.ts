// B1, unit 3: Health and Fitness. Illness, healthcare, fitness, nutrition, body and mind, causes and effects, symptoms
// and healthy habits; the first conditional. Its writing reuses the paragraph topics of the native courses.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { fill } from "../a2/kit.ts";
import { everyPair, interleave, sentenceCase, vocabularyTopic, word } from "../words.ts";
import { firstConditionalWriteNot } from "./mistakes.ts";

const illness = vocabularyTopic({
  id: "b1-words-illness",
  title: t("Illness", "疾病"),
  summary: t(
    "Diseases, illnesses and infections; viruses, allergies and injuries; symptoms, treatments and cures; recovering, operations and surgery.",
    "疾病、病症和感染；病毒、过敏和损伤；症状、治疗和治愈；康复、手术和外科手术。",
  ),
  intro: t(
    "When a **virus** causes an **illness**, you notice **symptoms** like a sore throat, and with the right **treatment** you **recover**. These words help you describe being ill and getting better.",
    "当 **virus**（病毒）引起 **illness**（疾病）时，你会注意到喉咙痛之类的 **symptoms**（症状），经过合适的 **treatment**（治疗），你就会 **recover**（康复）。这些词帮你描述生病和康复。",
  ),
  prerequisites: ["a2-words-health"],
  words: [
    word(
      "disease diseases",
      "an illness of people, animals or plants, often a serious one",
      "疾病",
      "Heart {disease} slowly damages the heart over many years and is common in older people. | Washing your hands stops {diseases} from spreading.|injuries allergies | Some {diseases}, like malaria, are carried by mosquitoes.|injuries allergies",
      "injury allergy",
      "illness",
    ),
    word(
      "illness illnesses",
      "the state of being ill; a disease",
      "病；疾病",
      "She missed two weeks of school because of {illness}: she had a bad cold and a high fever. | He died after a long {illness}. | Most childhood {illnesses}, like colds and coughs, are not serious.|injuries accidents",
      "injury accident",
      "disease",
    ),
    word(
      "infection infections",
      "an illness caused by germs or a virus getting into the body",
      "感染",
      "Germs got into the dirty cut, and now she has an {infection}. | Ear {infections}, caused by germs after a cold, are common in small children.|injuries allergies | Take this medicine to kill the germs and fight the {infection}.",
      "injury allergy",
    ),
    word(
      "virus viruses",
      "a very small living thing that causes illnesses such as colds and flu",
      "病毒",
      "Colds are caused by {viruses} that pass from person to person.|allergies injuries | The {virus} spread quickly from person to person around the world. | Some medicines don't work against {viruses}, the tiny living things that cause colds.|allergies injuries",
      "allergy injury",
    ),
    word(
      "allergy allergies",
      "a reaction of the body, such as sneezing, to a food, a plant or an animal",
      "过敏",
      "I have an {allergy} to cats. I sneeze when I'm near them. | Many children have food {allergies}, for example to nuts.|infections injuries | Spring is a hard time for people with {allergies} to flowers, who sneeze all day.|infections injuries",
      "infection injury",
    ),
    word(
      "injury injuries",
      "damage to the body, for example in an accident",
      "损伤；受伤",
      "He missed the match because of a knee {injury} from a bad fall. | Nobody was hurt in the crash. There were no {injuries}.|infections diseases | Wear a helmet to avoid head {injuries}.|infections diseases",
      "infection disease",
    ),
    word(
      "symptom symptoms",
      "a sign of an illness, such as a high temperature",
      "症状",
      "A sore throat is often the first {symptom} of a cold. | What {symptoms} do you have? Do you have a fever or a cough?|treatments cures | If the {symptoms}, like the cough and the fever, get worse, see a doctor.|treatments cures",
      "treatment cure",
    ),
    word(
      "treatment treatments",
      "what a doctor does to make an ill or hurt person better",
      "治疗",
      "She's getting {treatment} for her back problem. | The new {treatment} has helped many patients. | Doctors can choose from several {treatments}, such as medicine or an operation, for this illness.|symptoms diseases",
      "symptom disease",
      "cure",
    ),
    word(
      "cure cures cured curing",
      "to make an ill person well again; a medicine or treatment that does this",
      "治愈；疗法",
      "Scientists haven't found a {cure} for the common cold yet; it just goes away.|symptom virus | The doctors {cured} her completely, so her illness was gone for good.|examined hurt | This medicine can {cure} the infection and make you well again.",
      "examine hurt",
      "treatment",
    ),
    word(
      "recover recovers recovered recovering",
      "to get well again after an illness or an injury",
      "康复；恢复",
      "It took him a month to {recover} from a bad cold and feel strong again. | She's {recovering} well after her operation and getting stronger every day.|suffering fainting | Have you {recovered} from your cold? You look well again.|suffered fainted",
      "suffer faint",
    ),
    word(
      "operation operations",
      "the cutting into someone's body by a doctor to repair or remove something",
      "手术",
      "Surgeons cut open her knee in an {operation} to fix it. | The {operation} on his heart, with four surgeons at the table, lasted three hours. | The hospital does fifty {operations} a day.|injuries infections",
      "injury infection",
      "surgery",
    ),
    word(
      "surgery surgeries",
      "medical treatment in which a doctor cuts into the body",
      "外科手术",
      "A surgeon will cut into his chest, because he needs {surgery} on his heart. | After {surgery} to cut out a lump, she stayed in hospital for a week. | Doctors do thousands of eye {surgeries} every year.|medicines injuries",
      "medicine injury",
      "operation",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Symptom* and *treatment* both come with an illness, but a *symptom* is a sign that you have it, like a cough, and a *treatment* is what a doctor does to make it better. Ask whether the sentence describes a sign or a way to fix it.",
        "*symptom* 和 *treatment* 都和生病有关，但 *symptom* 是生病的迹象，比如咳嗽，*treatment* 是医生为了让病好转所做的事。想一想句子说的是迹象，还是治疗的办法。",
      ),
      meaning: t(
        "*Infection* and *allergy* can both make you feel ill, but an *infection* comes from germs getting into the body, and an *allergy* is the body reacting to something such as cats or nuts. Check whether the meaning talks about germs or about a food, plant or animal.",
        "*infection* 和 *allergy* 都会让人不舒服，但 *infection* 是病菌进入身体引起的，*allergy* 是身体对猫、坚果之类东西的反应。看清释义说的是病菌，还是某种食物、植物或动物。",
      ),
      spell: t(
        "*Allergy* and *injury* change y to ies for more than one: *allergies*, *injuries*; *surgery* ends in -ery, not -ary.",
        "*allergy* 和 *injury* 的复数把 y 变成 ies：*allergies*、*injuries*；*surgery* 以 -ery 结尾，不是 -ary。",
      ),
    },
    notes: `
      disease|a heart slowly damaged over many years;handwashing that stops the spread;malaria carried by mosquitoes|a disease is an illness that grows or spreads; an injury is damage from an accident|disease 是会发展或传播的疾病；injury 是意外造成的伤|injury/injuries=an injury is damage from a fall or a crash, not an illness that spreads or grows over years=injury 是摔倒或撞车造成的伤，不是会传播或多年发展的疾病;allergy/allergies=an allergy is the body reacting to cats or nuts, not an illness that spreads or is carried by mosquitoes=allergy 是身体对猫或坚果的反应，不是会传播或由蚊子带来的疾病|heart disease · spread a disease|the s in the middle sounds like z: *di-ZEEZ*|中间的 s 读作 z：*di-ZEEZ*
      illness|a bad cold and a high fever;a long time before he died;colds and coughs in childhood|illness is being ill; an injury is a hurt part of the body|illness 是生病；injury 是受伤|injury/injuries=an injury is damage from a fall or a crash, not being ill with a fever or a cold=injury 是摔倒或撞车造成的伤，不是发烧感冒之类的病;accident/accidents=an accident is something bad that happens suddenly, like a crash, not a time of being ill=accident 是突然发生的意外，比如撞车，不是一段生病的时间|a long illness · a serious illness|ill + -ness; *disease* often names one kind of illness|ill 加 -ness；*disease* 常指某一种具体的病
      infection|germs in a dirty cut;germs in the ears after a cold;medicine that kills germs|an infection comes from germs; an allergy comes from the body reacting to a thing|infection 来自病菌；allergy 是身体对某物的反应|injury/injuries=an injury is the damage itself, like a cut, not germs growing inside the body=injury 是伤口本身，不是在体内繁殖的病菌;allergy/allergies=an allergy comes from cats, nuts or flowers, not from germs=allergy 是猫、坚果或花引起的，不是病菌引起的|an ear infection · fight an infection|verb *infect*, adjective *infected*: an infected cut|动词 *infect*，形容词 *infected*：an infected cut
      virus|colds passed from person to person;something spreading around the world;tiny living things that cause colds|a virus is a tiny living thing that causes illness; an allergy is the body reacting to something|virus 是致病的微小生物；allergy 是身体的过敏反应|allergy/allergies=an allergy is the body reacting to cats or nuts, not a tiny living thing that passes between people=allergy 是身体对猫或坚果的反应，不是在人之间传播的微小生物;injury/injuries=an injury is damage from an accident, not a tiny living thing that spreads=injury 是意外造成的伤，不是会传播的微小生物|catch a virus · a computer virus|plural *viruses*, not *viri*|复数是 *viruses*，不是 *viri*
      allergy|sneezing near cats;food reactions to nuts;sneezing at flowers in spring|an allergy is a reaction to a thing; an infection comes from germs|allergy 是对某物的反应；infection 来自病菌|infection/infections=an infection comes from germs, not from being near cats, nuts or flowers=infection 来自病菌，不是因为接近猫、坚果或花;injury/injuries=an injury is damage from an accident, not sneezing near cats or flowers=injury 是意外造成的伤，不是在猫或花旁边打喷嚏|an allergy to cats · food allergies|use *to*: an allergy to nuts; adjective *allergic*|用 *to*：an allergy to nuts；形容词 *allergic*
      injury|a bad fall that hurt a knee;a crash where nobody was hurt;a helmet for the head|an injury is damage from an accident; an infection comes from germs|injury 是意外受伤；infection 是感染|infection/infections=an infection comes from germs, not from a fall or a crash that a helmet stops=infection 来自病菌，不是头盔能挡住的摔伤撞伤;disease/diseases=a disease is an illness that grows or spreads, not damage from a fall or a crash=disease 是会发展或传播的病，不是摔倒或撞车的伤|a knee injury · serious injuries|verb *injure*, adjective *injured*: two people were injured|动词 *injure*，形容词 *injured*：two people were injured
      symptom|a sore throat at the start of a cold;a fever or a cough;a cough and a fever that get worse|a symptom is a sign of an illness; a treatment makes it better|symptom 是症状；treatment 是治疗|treatment/treatments=a treatment is what a doctor does to make you better, not a sign of an illness like a cough=treatment 是医生让你好转的办法，不是咳嗽之类的迹象;cure/cures=a cure makes an illness go away, not a sign that you have it=cure 能把病治好，不是生病的迹象|the first symptom · symptoms of a cold|the p is said: *SIMP-tum*|p 要读出来：*SIMP-tum*
      treatment|help for a back problem;something new that helped patients;medicine or an operation|a treatment is what a doctor does to help; a symptom is a sign of illness|treatment 是治疗；symptom 是症状|symptom/symptoms=a symptom is a sign of an illness, like a cough, not something a doctor gives to help=symptom 是咳嗽之类的迹象，不是医生给的帮助;disease/diseases=a disease is the illness itself, not what helps patients get better=disease 是疾病本身，不是帮病人好转的东西|get treatment · treatment for back pain|verb *treat*: the doctor treated her|动词 *treat*：the doctor treated her
      cure|something not found for the common cold;an illness gone for good;medicine that makes you well again|a cure makes an illness go away; a symptom is a sign of it|cure 是治愈；symptom 是症状|symptom=a symptom is a sign of an illness, not something that makes it go away=symptom 是生病的迹象，不是把病治好的东西;virus=a virus causes colds and does not make them go away=virus 会引起感冒，不会把感冒治好;examine/examined=to examine is to look at carefully, which does not make an illness go away=examine 是仔细检查，不会让病消失;hurt=to hurt is to cause pain, the opposite of making someone well=hurt 是弄疼，和治好正相反|a cure for · cure an illness|a cure *for* something, not *of*|说 a cure *for* something，不用 *of*
      recover|feeling strong again after a cold;getting stronger every day after an operation;looking well again|to recover is to get well again; to suffer is to be ill or in pain|recover 是康复；suffer 是受苦、患病|suffer/suffering/suffered=to suffer is to feel pain or be ill, not to get well and strong again=suffer 是疼痛或生病，不是恢复健康;faint/fainting/fainted=to faint is to fall down and stop being awake, not to get well again=faint 是晕倒，不是恢复健康|recover from · recover well|use *from*: recover from a cold|用 *from*：recover from a cold
      operation|surgeons cutting open a knee;four surgeons at the table;fifty a day in a hospital|an operation is when surgeons cut into the body; an injury is damage from an accident|operation 是手术；injury 是受伤|injury/injuries=an injury is damage from an accident, not something surgeons do to fix you=injury 是意外造成的伤，不是外科医生为你做的事;infection/infections=an infection is germs in the body, not something surgeons do=infection 是体内的病菌，不是外科医生做的事|have an operation · an operation on the knee|verb *operate on*: surgeons operate on patients|动词 *operate on*：surgeons operate on patients
      surgery|a surgeon cutting into the chest;cutting out a lump;thousands done on eyes|surgery is treatment by cutting; medicine is something you swallow|surgery 是外科手术；medicine 是药|medicine/medicines=medicine is something you swallow, not doctors cutting into the body=medicine 是吃下去的药，不是医生切开身体;injury/injuries=an injury is damage from an accident, not treatment by a doctor who cuts=injury 是意外造成的伤，不是医生动刀的治疗|heart surgery · after surgery|in British English *surgery* is also a doctor's office|英式英语里 *surgery* 也指诊所
    `,
  },
});

const healthcare = vocabularyTopic({
  id: "b1-words-healthcare",
  title: t("Healthcare", "医疗"),
  summary: t(
    "Clinics, surgeons and prescriptions; vaccines, insurance and therapy; x-rays, wards and specialists; bandages, wheelchairs and diagnosing; medical help.",
    "诊所、外科医生和处方；疫苗、保险和疗法；X 光、病房和专科医生；绷带、轮椅和诊断；医疗帮助。",
  ),
  intro: t(
    "At the **clinic**, a **specialist** can **diagnose** your problem, write a **prescription** or send you for an **x-ray**. These words help you find your way around doctors and hospitals.",
    "在 **clinic**（诊所），**specialist**（专科医生）可以 **diagnose**（诊断）你的问题，开 **prescription**（处方），或者让你去拍 **x-ray**（X 光片）。这些词帮你看医生、去医院时不迷路。",
  ),
  prerequisites: ["b1-words-illness"],
  words: [
    word(
      "clinic clinics",
      "a place where people go to see a doctor or get treatment",
      "诊所",
      "You can see a doctor without staying in hospital at the {clinic} on Main Street. | I went to the dental {clinic} to have my teeth checked and went home the same day. | Our town has two {clinics}, where doctors see patients and send them home.|wards pharmacies",
      "ward pharmacy",
    ),
    word(
      "surgeon surgeons",
      "a doctor who does operations",
      "外科医生",
      "The {surgeon} operated on his heart. | She wants to be a {surgeon} and do operations when she grows up. | Two {surgeons} cut open and repaired the patient's heart for six hours.|nurses pharmacists",
      "nurse pharmacist",
      "specialist",
    ),
    word(
      "prescription prescriptions",
      "a paper from a doctor that says which medicine you need",
      "处方",
      "The doctor wrote me a {prescription} saying which medicine I need. | You can't buy this medicine without a {prescription} from a doctor. | Take the {prescription} the doctor wrote to the pharmacist.",
      "receipt vaccine",
    ),
    word(
      "vaccine vaccines",
      "a medicine that stops you from getting a disease",
      "疫苗",
      "Have you had the flu {vaccine} this year to stop you catching flu? | Scientists made a {vaccine} against the virus. | {Vaccines} given to babies have stopped many diseases.|bandages prescriptions",
      "bandage prescription",
    ),
    word(
      "insurance",
      "an agreement in which you pay a company and it pays your costs if you are ill, have an accident or lose something",
      "保险",
      "Do you have health {insurance} that pays if you get ill? | Travel {insurance} paid for my hospital bill abroad. | The {insurance} company paid for the new car after the accident.",
      "tax fee",
    ),
    word(
      "therapy therapies",
      "treatment of an illness or a problem, often without drugs or an operation",
      "疗法；治疗",
      "After the accident, she needed months of {therapy}, doing exercises to walk again. | Music {therapy} can help people who feel sad. | New {therapies} for the disease, without drugs or operations, are being tested.|insurances surgeries",
      "insurance surgery",
    ),
    word(
      "x-ray x-rays",
      "a photo of the inside of your body",
      "X 光片",
      "The {x-ray} showed that his arm was broken. | The doctor looked at the {x-ray}, a photo of the inside of my chest. | Dentists take {x-rays} of your teeth.|bandages vaccines",
      "bandage vaccine",
    ),
    word(
      "ward wards",
      "a large room in a hospital with beds for patients",
      "病房",
      "She's staying in a bed in the children's {ward} on the second floor of the hospital. | Visitors may come to see patients in their beds on the {ward} between two and four. | The hospital has twelve {wards}, each with twenty beds.|clinics pharmacies",
      "clinic pharmacy",
    ),
    word(
      "specialist specialists",
      "a doctor who knows a lot about one kind of illness or one part of the body",
      "专科医生；专家",
      "My doctor sent me to a heart {specialist}, a doctor who knows a lot about hearts. | She's a doctor and a {specialist} who only treats children's illnesses. | We asked three heart {specialists}, doctors who study only the heart, and they all said the same.|nurses pharmacists",
      "nurse pharmacist",
      "surgeon",
    ),
    word(
      "bandage bandages",
      "a long piece of cloth that you put around a hurt part of the body",
      "绷带",
      "The nurse put a {bandage} on my cut finger. | Change the {bandage} around the cut every day. | There are long {bandages} for wrapping cuts in the first aid box.|wheelchairs prescriptions",
      "wheelchair prescription",
    ),
    word(
      "wheelchair wheelchairs",
      "a chair with wheels for people who cannot walk",
      "轮椅",
      "After the accident, he couldn't walk, so he moved around in his {wheelchair} for three months. | The museum has ramps and wide doors for {wheelchairs}.|bandages ambulances | She pushed her grandfather's {wheelchair} into the park.",
      "bandage ambulance",
    ),
    word(
      "diagnose diagnoses diagnosed diagnosing",
      "to find out what illness someone has",
      "诊断",
      "The doctor {diagnosed} a broken bone after looking at the x-ray.|cured prevented | It is hard to {diagnose} this illness early, because the first signs are not clear. | Doctors use x-rays to {diagnose} broken bones.",
      "cure prevent",
    ),
    word(
      "medical",
      "about medicine and treating illness and injuries",
      "医学的；医疗的",
      "You're bleeding badly, so you need {medical} help from a doctor right away. | Your {medical} records, which list your illnesses, are private. | He had a {medical} check of his heart by a doctor before the race.",
      "healthy weak",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Clinic* and *ward* are both places for patients, but at a *clinic* you see a doctor and go home, and a *ward* is a hospital room where patients stay in beds. Look for beds or for going home.",
        "*clinic* 和 *ward* 都是病人去的地方，但在 *clinic* 看完医生就回家，*ward* 是病人住在病床上的医院病房。留意句中有没有病床，或者是不是当天回家。",
      ),
      meaning: t(
        "*Prescription* and *receipt* are both papers you take away, but a *prescription* comes from a doctor and says which medicine you need, and a *receipt* comes from a shop and shows what you paid. Check who gives the paper in the meaning.",
        "*prescription* 和 *receipt* 都是拿走的一张纸，但 *prescription* 是医生开的、写着你要什么药，*receipt* 是商店给的、写着你付了多少钱。看清释义里是谁给的这张纸。",
      ),
      spell: t(
        "*Prescription* comes from *prescribe*, but the b becomes p before -tion: prescri**p**tion; *x-ray* keeps its hyphen.",
        "*prescription* 来自 *prescribe*，但在 -tion 前 b 变成 p：prescri**p**tion；*x-ray* 保留连字符。",
      ),
    },
    notes: `
      clinic|seeing a doctor without staying in hospital;teeth checked and home the same day;doctors who send patients home|a clinic is where you see a doctor and go home; a ward is a hospital room where patients stay|clinic 是看完就回家的诊所；ward 是住院病房|ward/wards=a ward is a room of beds in a hospital where patients stay, not a place you visit and leave the same day=ward 是病人住下的医院病房，不是当天看完就走的地方;pharmacy/pharmacies=a pharmacy sells medicine, and you don't see a doctor there=pharmacy 是卖药的地方，不在那里看医生|a dental clinic · go to the clinic|*clinic* is the place; *clinical* is the adjective|*clinic* 是地方；形容词是 *clinical*
      surgeon|someone who operated on a heart;a job doing operations;six hours repairing a heart|a surgeon does operations; a nurse looks after patients|surgeon 是做手术的外科医生；nurse 是护士|nurse/nurses=a nurse looks after patients but does not do the operation=nurse 照顾病人，但不做手术;pharmacist/pharmacists=a pharmacist gives out medicine in a shop and does not operate=pharmacist 在药店配药，不做手术|a heart surgeon · a brain surgeon|-geon said like *jun*: *SUR-jun*|-geon 读作 *jun*：*SUR-jun*
      prescription|a paper saying which medicine I need;something from a doctor before you can buy medicine;what the doctor wrote|a prescription is a doctor's paper for medicine; a receipt shows what you paid|prescription 是处方；receipt 是收据|receipt/receipts=a receipt is a paper from a shop showing what you paid, not a paper a doctor writes=receipt 是商店给的付款凭证，不是医生写的纸;vaccine/vaccines=a vaccine is a medicine itself, not a paper a doctor writes=vaccine 是药本身，不是医生写的纸|a prescription for · write a prescription|verb *prescribe*: the doctor prescribed some pills|动词 *prescribe*：the doctor prescribed some pills
      vaccine|something that stops you catching flu;something scientists made against a virus;something given to babies that stopped diseases|a vaccine stops you getting a disease; a prescription is a paper|vaccine 是疫苗；prescription 是处方|bandage/bandages=a bandage is cloth around a cut, not something that stops a disease=bandage 是包伤口的布，不能预防疾病;prescription/prescriptions=a prescription is a paper from a doctor, not medicine that stops a disease=prescription 是医生开的单子，不是预防疾病的药|the flu vaccine · a vaccine against|a vaccine *against* a disease; verb *vaccinate*|a vaccine *against* 某种病；动词 *vaccinate*
      insurance|something that pays if you get ill;a hospital bill paid abroad;a company that paid for a new car|insurance pays your costs after illness or accidents; tax is money paid to the government|insurance 是保险；tax 是税|tax=tax is money you pay the government, which does not pay your bills when you are ill=tax 是交给政府的钱，生病时不会替你付账;fee=a fee is money you pay for a service, and it does not pay you back after an accident=fee 是付给某项服务的钱，出事后不会赔你|health insurance · travel insurance|no plural in this sense; verb *insure*|这个意思没有复数；动词 *insure*
      therapy|months of exercises to walk again;music that helps sad people;treatment without drugs or operations|therapy treats a problem, often without drugs; surgery cuts into the body|therapy 是治疗、疗法；surgery 是外科手术|insurance/insurances=insurance pays costs, and it is not a treatment that helps you walk or feel better=insurance 是付钱的保险，不是帮你走路或开心的治疗;surgery/surgeries=surgery means cutting into the body, not exercises, music or treatment without operations=surgery 是开刀，不是锻炼、音乐或不开刀的疗法|music therapy · physical therapy|a person who gives it is a *therapist*|做治疗的人叫 *therapist*
      x-ray|something showing a broken arm;a photo of the inside of my chest;something dentists take of teeth|an x-ray is a photo of the inside of the body; a bandage is cloth|x-ray 是 X 光片；bandage 是绷带|bandage/bandages=a bandage is cloth around a cut, not a photo of the inside of the body=bandage 是包伤口的布，不是身体内部的照片;vaccine/vaccines=a vaccine is a medicine, not a photo=vaccine 是药，不是照片|have an x-ray · a chest x-ray|say the letter *EKS*, so it takes *an*: an x-ray|x 按字母读 *EKS*，所以用 *an*：an x-ray
      ward|a bed in a hospital for children;patients in their beds;twenty beds each|a ward is a hospital room with beds; a clinic is where you see a doctor and leave|ward 是病房；clinic 是诊所|clinic/clinics=at a clinic you see a doctor and go home, and you don't stay in a bed=在 clinic 看完医生就回家，不住病床;pharmacy/pharmacies=a pharmacy is a shop for medicine, with no beds for patients=pharmacy 是药店，没有病床|a children's ward · on the ward|*ward* is a hospital room, not *word*|*ward* 是病房，别和 *word* 混
      specialist|a doctor who knows a lot about hearts;a doctor who only treats children's illnesses;doctors who study only the heart|a specialist is a doctor for one part of the body; a nurse looks after patients|specialist 是专科医生；nurse 是护士|nurse/nurses=a nurse looks after patients and is not a doctor who knows one illness very well=nurse 照顾病人，不是精通某种病的医生;pharmacist/pharmacists=a pharmacist sells medicine and is not a doctor for one part of the body=pharmacist 卖药，不是某个部位的专科医生|a heart specialist · see a specialist|special + -ist|special 加 -ist
      bandage|a nurse wrapping a cut finger;something around the cut changed every day;cloth for wrapping cuts|a bandage is cloth around a hurt part; a wheelchair is a chair with wheels|bandage 是绷带；wheelchair 是轮椅|wheelchair/wheelchairs=a wheelchair is a chair with wheels, not cloth put around a cut=wheelchair 是带轮子的椅子，不是包伤口的布;prescription/prescriptions=a prescription is a paper from a doctor, not cloth around a cut=prescription 是医生开的单子，不是包伤口的布|put on a bandage · change the bandage|-age said like *ij*: *BAN-dij*|-age 读作 *ij*：*BAN-dij*
      wheelchair|three months when he couldn't walk;ramps and wide doors in a museum;something pushed into the park|a wheelchair is a chair with wheels; an ambulance takes ill people to hospital|wheelchair 是轮椅；ambulance 是救护车|bandage/bandages=a bandage is cloth around a cut, not a chair for people who can't walk=bandage 是包伤口的布，不是给不能走路的人坐的椅子;ambulance/ambulances=an ambulance is a vehicle that rushes ill people to hospital, not a chair you push through doors=ambulance 是送病人去医院的车，不是推着进门的椅子|in a wheelchair · push a wheelchair|wheel + chair, one word|wheel 加 chair，写成一个词
      diagnose|a broken bone found from an x-ray;an illness whose first signs are not clear;x-rays for broken bones|to diagnose is to find out what illness someone has; to cure is to make them well|diagnose 是诊断；cure 是治好|cure/cured=to cure is to make someone well, not to find out what illness they have=cure 是治好病，不是查出是什么病;prevent/prevented=to prevent is to stop something before it happens, not find out what it is=prevent 是事先阻止，不是查明是什么|diagnose an illness · be diagnosed with|noun *diagnosis*, plural *diagnoses*|名词 *diagnosis*，复数 *diagnoses*
      medical|help from a doctor for bad bleeding;records that list your illnesses;a check of the heart by a doctor|medical is about doctors and treatment; healthy means well|medical 是医疗的；healthy 是健康的|healthy=healthy means well and strong, not about doctors and treatment=healthy 是身体好，不是和医生、治疗有关;weak=weak means not strong, not about doctors and treatment=weak 是虚弱，不是和医生、治疗有关|medical help · a medical check|*medical* is the adjective; *medicine* is the noun|*medical* 是形容词；名词是 *medicine*
    `,
  },
});

const fitness = vocabularyTopic({
  id: "b1-words-fitness",
  title: t("Fitness", "健身"),
  summary: t(
    "Gyms, muscles and weights; workouts, jogging and stretching; yoga, marathons and athletes; energy, sweat and being active.",
    "健身房、肌肉和重量；锻炼、慢跑和拉伸；瑜伽、马拉松和运动员；精力、出汗和积极活动。",
  ),
  intro: t(
    "At the **gym** I **stretch**, lift **weights** and **jog** on a machine, and after a good **workout** my **muscles** feel strong. These words help you talk about exercise and keeping fit.",
    "在 **gym**（健身房）里，我先 **stretch**（拉伸），再举 **weights**（哑铃），然后在跑步机上 **jog**（慢跑）；一次好的 **workout**（锻炼）之后，我的 **muscles**（肌肉）感觉很有力。这些词帮你谈论锻炼和保持健康。",
  ),
  prerequisites: ["a2-words-sports"],
  words: [
    word(
      "gym gyms",
      "a room or a building with equipment for exercise",
      "健身房；体育馆",
      "I go to the {gym} three times a week to lift weights on the machines. | Our school {gym} has new running machines. | There are lots of {gyms} with exercise machines in the city center.|pools parks",
      "pool park",
    ),
    word(
      "muscle muscles",
      "one of the parts inside the body that make it move",
      "肌肉",
      "Lifting weights makes your {muscles} bigger and stronger.|bones nerves | I stretched too far and pulled a {muscle} in my leg. | Your heart is a {muscle}.",
      "bone nerve",
    ),
    word(
      "weight weights",
      "how heavy someone or something is; a heavy piece of metal lifted for exercise",
      "体重；重量；哑铃",
      "He's trying to lose {weight} by eating less, because he's too heavy. | She lifts heavy metal {weights} at the gym.|energies muscles | What is the {weight} of this box? Is it too heavy to carry?",
      "energy muscle",
    ),
    word(
      "workout workouts",
      "a period of physical exercise",
      "锻炼",
      "I do a twenty-minute {workout} every morning. | After a hard {workout} at home in my room, I feel great. | These ten-minute {workouts} are good for beginners.|marathons gyms",
      "marathon gym",
    ),
    word(
      "jog jogs jogged jogging",
      "to run slowly for exercise",
      "慢跑",
      "I {jog} five kilometers at a slow run before breakfast. | She goes {jogging} in the park every evening, running slowly.|walking cycling | We {jogged} slowly around the lake, running side by side.|walked cycled",
      "walk cycle",
    ),
    word(
      "stretch stretches stretched stretching",
      "to make your arms, legs or body as long as you can",
      "伸展；拉伸",
      "Always {stretch} your legs, making them long, before you run. | The cat woke up and {stretched} its legs out long.|jogged sweated | Do some slow {stretching} of your arms and legs after your workout.|jogging sweating",
      "jog sweat",
    ),
    word(
      "yoga",
      "a kind of exercise from India, with slow movements and deep breathing",
      "瑜伽",
      "My mom does {yoga} on a mat at home, breathing slowly, to relax. | In {yoga}, you sit on a mat, breathe slowly and stretch. | The {yoga} class, where we hold slow poses on mats, starts at seven.",
      "jogging swimming",
    ),
    word(
      "marathon marathons",
      "a running race of about 42 kilometers",
      "马拉松",
      "She ran her first {marathon}, all 42 kilometers, last year. | A {marathon} is about 42 kilometers long. | He has run ten {marathons} of 42 kilometers each.|workouts matches",
      "workout match",
    ),
    word(
      "athlete athletes",
      "a person who is good at sport, especially running and jumping",
      "运动员",
      "Olympic {athletes} run and jump to win medals.|coaches fans | She's a fast {athlete} who wins every race. | The {athlete} won three gold medals for running.",
      "coach fan",
    ),
    word(
      "energy energies",
      "the strength to be active without feeling tired; power that makes machines work",
      "精力；能量",
      "Children have so much {energy} that they run around all day! | Bananas give you {energy} so you don't feel tired. | Solar {energy} comes from the sun.",
      "weight muscle",
    ),
    word(
      "sweat sweats sweated sweating",
      "to have water come out through your skin when you are hot",
      "出汗；汗水",
      "I {sweat} a lot when it's hot. | He was hot and {sweating} after the long walk.|sneezing coughing | After the hot run, {sweat} ran down her face.|blood oil",
      "sneeze cough",
    ),
    word(
      "active",
      "doing a lot of things, especially physical things",
      "活跃的；积极的",
      "My grandma is very {active}. She swims every day. | Try to stay {active} and keep moving as you get older. | Children should be {active}, running and playing, for an hour a day.",
      "lazy tired",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Jog* and *walk* are both ways of moving on foot, but you *jog* when you run slowly, and you *walk* when you don't run at all. Look for words about running.",
        "*jog* 和 *walk* 都是用脚移动，但 *jog* 是慢慢地跑，*walk* 是根本不跑。留意句中有没有和跑有关的词。",
      ),
      meaning: t(
        "*Workout* and *marathon* are both about exercise, but a *workout* is any time you exercise, often short, and a *marathon* is one long race of about 42 kilometers. Check whether the meaning is a race or a time of exercise.",
        "*workout* 和 *marathon* 都和运动有关，但 *workout* 是任何一段锻炼，常常不长，*marathon* 是约 42 公里的长跑比赛。看清释义说的是比赛，还是一段锻炼。",
      ),
      spell: t(
        "*Athlete* has no extra e in the middle: ath-lete, not *athelete*; *muscle* has a silent c after the s.",
        "*athlete* 中间没有多余的 e：ath-lete，不是 *athelete*；*muscle* 在 s 后面有一个不发音的 c。",
      ),
    },
    notes: `
      gym|lifting weights on the machines;new running machines at school;exercise machines in the city center|a gym is a room with exercise machines; a pool is water for swimming|gym 是健身房；pool 是游泳池|pool/pools=a pool is water for swimming, not a room with weights and machines=pool 是游泳的水池，不是有器械的房间;park/parks=a park is an outdoor green space, not a room with exercise machines=park 是户外绿地，不是有健身器械的房间|go to the gym · a school gym|y said like i: *jim*|y 读作 i：*jim*
      muscle|lifting weights that make them bigger;something pulled when stretching too far;the heart|a muscle moves the body; a bone is the hard part inside|muscle 是肌肉；bone 是骨头|bone/bones=a bone is the hard part inside you, and it doesn't grow big from weights or pull when you stretch=bone 是体内硬的部分，不会因举重变大，也不会拉伤;nerve/nerves=a nerve carries messages to the brain and is not what moves or pulls when you exercise=nerve 给大脑传信息，不是锻炼时用力或拉伤的部分|pull a muscle · build muscle|the c is silent: *MUS-ul*|c 不发音：*MUS-ul*
      weight|eating less because he's too heavy;heavy metal things lifted at the gym;how heavy a box is|weight is how heavy something is; energy is strength to be active|weight 是重量；energy 是精力|energy/energies=energy is strength to be active, not how heavy something is or metal you lift=energy 是活动的力气，不是重量或举的铁块;muscle/muscles=a muscle is a part of the body that moves it, not how heavy something is or a piece of metal=muscle 是让身体动的部分，不是重量或铁块|lose weight · lift weights|*weight* is the noun, *weigh* the verb; *wait* sounds the same|名词 *weight*，动词 *weigh*；*wait* 读音相同
      workout|twenty minutes every morning;a hard time of exercise at home;ten minutes for beginners|a workout is a time of exercise; a marathon is a 42-kilometer race|workout 是一次锻炼；marathon 是马拉松|marathon/marathons=a marathon is a long race of 42 kilometers, not a short time of exercise at home=marathon 是 42 公里的长跑，不是在家的短时间锻炼;gym/gyms=a gym is a place, not a time of exercise that lasts minutes=gym 是地方，不是几分钟的锻炼|do a workout · a hard workout|the verb is two words: *work out*|动词是两个词：*work out*
      jog|five kilometers at a slow run;running slowly in the park;running side by side around a lake|to jog is to run slowly; to walk is not to run at all|jog 是慢跑；walk 是走|walk/walking/walked=to walk is to move on foot without running=walk 是走路，不是跑;cycle/cycling/cycled=to cycle is to ride a bike, not to run on your feet=cycle 是骑车，不是用脚跑|go jogging · jog in the park|double the g: *jogged, jogging*|双写 g：*jogged、jogging*
      stretch|legs made long before a run;a cat making its legs long;slow movements of arms and legs after a workout|to stretch is to make your body long; to jog is to run slowly|stretch 是伸展；jog 是慢跑|jog/jogged/jogging=to jog is to run slowly, not to make your arms and legs long=jog 是慢跑，不是把手脚伸长;sweat/sweated/sweating=to sweat is to have water come out of your skin, not to make your body long=sweat 是出汗，不是把身体伸长|stretch your legs · do some stretching|*stretch your legs* can also mean go for a short walk|*stretch your legs* 也可以指出去走一走
      yoga|a mat at home and slow breathing;sitting on a mat and stretching;slow poses on mats|yoga is slow movement and breathing; jogging is running slowly|yoga 是瑜伽；jogging 是慢跑|jogging=jogging is running slowly, not slow movements on a mat=jogging 是慢跑，不是在垫子上的缓慢动作;swimming=swimming happens in water, not on a mat=swimming 在水里，不在垫子上|do yoga · a yoga class|we *do* yoga, not *play* yoga|说 *do* yoga，不说 *play* yoga
      marathon|all 42 kilometers;a race about 42 kilometers long;ten races of 42 kilometers each|a marathon is a 42-kilometer race; a match is a game between teams|marathon 是马拉松；match 是比赛|workout/workouts=a workout is exercise that often lasts minutes, not a 42-kilometer race=workout 是常常只有几分钟的锻炼，不是 42 公里的比赛;match/matches=a match is a game between two teams, not a long running race=match 是两队之间的比赛，不是长跑|run a marathon · a marathon runner|*marathon* can also mean any very long activity: a TV marathon|*marathon* 也可指很长的活动：a TV marathon
      athlete|people who run and jump to win medals;someone who wins every race;three gold medals for running|an athlete runs and competes; a coach trains others|athlete 是运动员；coach 是教练|coach/coaches=a coach trains players but does not run the race=coach 训练运动员，自己不参赛;fan/fans=a fan watches and cheers, and is not the person who runs and wins=fan 是看比赛加油的人，不是参赛获胜的人|a top athlete · Olympic athletes|two parts: *ATH-leet*|两个音节：*ATH-leet*
      energy|children who run around all day;bananas that stop you feeling tired;power from the sun|energy is strength to be active; weight is how heavy you are|energy 是精力；weight 是体重|weight=weight is how heavy you are, not strength to keep going=weight 是有多重，不是坚持下去的力气;muscle=muscle is a part of the body, not the power that stops you feeling tired=muscle 是身体的一部分，不是让你不累的力量|full of energy · solar energy|adjective *energetic*|形容词 *energetic*
      sweat|a lot in hot weather;being hot after a long walk;something running down a face after a hot run|to sweat is to have water come out of your skin; to sneeze is to blow air out of your nose|sweat 是出汗；sneeze 是打喷嚏|sneeze/sneezing=to sneeze is to blow air out of your nose, not water on hot skin=sneeze 是鼻子喷气，不是热时皮肤出水;cough/coughing=coughing comes from the throat, not water on your skin when you are hot=cough 来自喉咙，不是热时皮肤出的水;blood=blood comes from a cut, not from being hot after running=blood 是伤口流的，不是跑热了出的;oil=oil is used for cooking, not water from your skin=oil 是做饭用的，不是皮肤出的水|sweat a lot · covered in sweat|ea said like e in *wet*: *swet*|ea 读作 *wet* 里的 e：*swet*
      active|swimming every day;keeping moving when older;running and playing for an hour|active means moving and doing a lot; lazy means not wanting to move|active 是活跃的；lazy 是懒惰的|lazy=lazy means not wanting to work or move, the opposite of moving a lot=lazy 是不想动，和经常活动相反;tired=tired means needing rest, not doing lots of things=tired 是需要休息，不是做很多事|stay active · an active life|the opposite is *inactive*|反义词是 *inactive*
    `,
  },
});

const nutrition = vocabularyTopic({
  id: "b1-words-nutrition",
  title: t("Nutrition", "营养"),
  summary: t(
    "Vitamins, protein and fat; calories and nutrition; vegetarians and a balanced diet; junk food, snacks and portions; organic food and fiber.",
    "维生素、蛋白质和脂肪；卡路里和营养；素食者和均衡饮食；垃圾食品、零食和份量；有机食品和纤维。",
  ),
  intro: t(
    "A **balanced** diet gives you **protein**, **vitamins** and **fiber**, while **junk** food has too many **calories** and too much **fat**. These words help you talk about what you eat and how it keeps you healthy.",
    "**balanced**（均衡的）饮食给你 **protein**（蛋白质）、**vitamins**（维生素）和 **fiber**（纤维），而 **junk**（垃圾）食品含有太多 **calories**（卡路里）和太多 **fat**（脂肪）。这些词帮你谈论吃什么、怎样吃得健康。",
  ),
  prerequisites: ["a2-words-ingredients"],
  words: [
    word(
      "vitamin vitamins",
      "a natural thing in food that you need to stay healthy",
      "维生素",
      "Oranges are full of {vitamin} C. | Fresh vegetables give you {vitamins} such as A and C.|proteins fibers | Do you take {vitamins}, like C and D, in the winter?|proteins fibers",
      "protein fiber",
    ),
    word(
      "protein proteins",
      "a part of foods such as meat, eggs and beans that helps your body grow",
      "蛋白质",
      "Eggs and meat are rich in {protein}, which builds muscle. | Athletes need a lot of {protein} to build muscle. | Meat and fish are good sources of {protein}, which helps your body grow and build muscle.",
      "fiber fat",
    ),
    word(
      "fat fatter fattest fats",
      "the oily part of food; (of a person or an animal) heavy",
      "脂肪；胖的",
      "This cheese is full of {fat}, so it feels oily. | Our cat is getting {fatter} because he eats too much.|thinner smaller | Some {fats}, like olive oil, are good for you.|fibers sugars",
      "fiber sugar",
    ),
    word(
      "calorie calories",
      "a measure of how much energy food gives you",
      "卡路里",
      "This drink has 200 {calories}.|vitamins portions | Running burns a lot of {calories}.|vitamins portions | A banana has about 100 {calories} of energy.|vitamins portions",
      "vitamin portion",
    ),
    word(
      "nutrition",
      "the food you eat and how it affects your health",
      "营养",
      "Good {nutrition}, from fruit, vegetables and protein, is important for growing children. | She's studying {nutrition} at university to learn how food affects health. | The label on the cereal box gives {nutrition} information like calories and protein.",
      "junk hygiene",
    ),
    word(
      "vegetarian vegetarians",
      "a person who does not eat meat or fish; without meat or fish",
      "素食者；素食的",
      "I'm a {vegetarian}. I don't eat meat. | Ten {vegetarians} came to dinner, so we cooked no meat.|cooks farmers | {Vegetarians} get protein from beans and eggs, not meat.|cooks farmers",
      "cook farmer",
    ),
    word(
      "balanced",
      "with the right amounts of different things",
      "均衡的",
      "A {balanced} diet has the right amounts of fruit, vegetables, grains and protein. | Try to eat {balanced} meals with a little of everything. | Her life is well {balanced} between work and fun.",
      "fresh spicy",
    ),
    word(
      "junk",
      "food that is bad for your health, such as chips and sweets (junk food); things of no use",
      "垃圾食品；废品",
      "Too much {junk} food is bad for you. | The garage is full of old {junk}. | Stop eating {junk} like chips and have an apple.",
      "fiber nutrition",
    ),
    word(
      "snack snacks",
      "a small amount of food eaten between meals",
      "零食；小吃",
      "I usually have a small {snack}, like an apple, between lunch and dinner. | Nuts are a healthy {snack} to eat between meals. | Don't eat {snacks} like chips between meals, or you won't be hungry for dinner.|desserts meals",
      "dessert meal",
    ),
    word(
      "portion portions",
      "an amount of food for one person",
      "一份",
      "The {portions} of food on each plate here are huge.|recipes menus | Eat five {portions} of fruit and vegetables a day.|recipes menus | A small {portion} of rice on my plate is enough for me.",
      "recipe menu",
    ),
    word(
      "organic",
      "grown without chemicals",
      "有机的",
      "We buy {organic} vegetables, grown without any chemicals, at the market. | {Organic} farmers don't use chemicals. | Is this milk {organic}? Was it made without chemicals?",
      "balanced toxic",
    ),
    word(
      "fiber",
      "the part of plants such as grains and vegetables that helps food pass through your body",
      "纤维",
      "Brown bread, made from the whole grain, has more {fiber} than white bread. | Beans are high in {fiber}. | Eat more {fiber} from vegetables to help food pass through your body.",
      "fat sugar",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Snack* and *dessert* are both small foods, but a *snack* is eaten between meals, and a *dessert* is the sweet dish at the end of a meal. Look for when the food is eaten.",
        "*snack* 和 *dessert* 都是分量小的食物，但 *snack* 在两餐之间吃，*dessert* 是一顿饭最后的甜点。留意食物是什么时候吃的。",
      ),
      meaning: t(
        "*Protein* and *vitamin* are both good things in food, but *protein* comes from meat, eggs and beans and builds muscle, and *vitamins* have letter names like C and D. Check whether the meaning talks about building the body or about staying healthy.",
        "*protein* 和 *vitamin* 都是食物里的好东西，但 *protein* 来自肉、蛋和豆子，能长肌肉，*vitamins* 用 C、D 这样的字母命名。看清释义说的是让身体长大，还是保持健康。",
      ),
      spell: t(
        "*Fiber* ends in -er in American English and *fibre* in -re in British English; *vegetarian* keeps *veget-* from *vegetable*: veg-e-tar-i-an.",
        "美式 *fiber* 以 -er 结尾，英式 *fibre* 以 -re 结尾；*vegetarian* 保留 *vegetable* 的 *veget-*：veg-e-tar-i-an。",
      ),
    },
    notes: `
      vitamin|vitamin C in oranges;A and C from fresh vegetables;C and D taken in winter|vitamins have letter names like C; protein builds muscle|vitamin 是维生素；protein 是蛋白质|protein/proteins=protein builds muscle and has no letter names like C or D=protein 用来长肌肉，没有 C、D 这样的字母名;fiber/fibers=fiber helps food pass through the body and has no letter names like C or D=fiber 帮助消化，没有 C、D 这样的字母名|vitamin C · take vitamins|British *VIT-a-min*, American *VY-ta-min*|英式读 *VIT-a-min*，美式读 *VY-ta-min*
      protein|eggs and meat that build muscle;what athletes need for muscle;meat and fish that help the body grow|protein builds muscle; fiber helps food pass through you|protein 是蛋白质；fiber 是纤维|fiber=fiber comes from plants and helps food pass through you, and it doesn't build muscle=fiber 来自植物，帮助消化，不能长肌肉;fat=fat is the oily part of food and doesn't build muscle=fat 是食物里油的部分，不能长肌肉|rich in protein · a source of protein|ei said like *ee*: *PRO-teen*|ei 读作 *ee*：*PRO-teen*
      fat|cheese that feels oily;a cat that eats too much;olive oil|fat is the oily part of food; fiber is the rough part of plants|fat 是脂肪；fiber 是纤维|fiber/fibers=fiber is the rough part of plants, not oil=fiber 是植物里粗糙的部分，不是油;sugar/sugars=sugar is sweet, not oily like olive oil=sugar 是甜的，不像橄榄油那样油;thinner=thinner means less heavy, not what happens when you eat too much=thinner 是变瘦，吃太多不会这样;smaller=smaller means less big, not what happens when you eat too much=smaller 是变小，吃太多不会这样|low in fat · get fatter|double t: *fatter, fattest*|双写 t：*fatter、fattest*
      calorie|200 in a drink;what running burns;100 in a banana|a calorie measures energy in food; a vitamin keeps you healthy|calorie 是卡路里；vitamin 是维生素|vitamin/vitamins=vitamins are named by letters like C and are not a measure of energy that running burns=vitamins 用字母命名，不是跑步消耗的能量单位;portion/portions=a portion is an amount for one person, not a measure of energy=portion 是一人份，不是能量单位|burn calories · count calories|low-calorie food has few calories|low-calorie 的食物卡路里少
      nutrition|fruit, vegetables and protein for growing children;how food affects health;calories and protein on a label|nutrition is the food you eat and its effect on health; hygiene is keeping clean|nutrition 是营养；hygiene 是卫生|junk=junk is food that is bad for you, not good eating or the study of food and health=junk 是对身体不好的食物，不是好的营养或营养学;hygiene=hygiene is keeping things clean, not about the food you eat=hygiene 是保持清洁，不是关于吃的东西|good nutrition · nutrition information|adjective *nutritious*: healthy to eat|形容词 *nutritious*：有营养的
      vegetarian|someone who doesn't eat meat;guests who mean no meat is cooked;people who get protein from beans and eggs|a vegetarian doesn't eat meat; a cook makes food|vegetarian 是素食者；cook 是厨师|cook/cooks=a cook makes food, which can have meat, and is not someone who won't eat meat=cook 是做饭的人，饭里可以有肉，不是不吃肉的人;farmer/farmers=a farmer grows food or keeps animals and is not someone who doesn't eat meat=farmer 是种地养动物的人，不是不吃肉的人|a vegetarian dish · become a vegetarian|a *vegan* eats no eggs or milk either|*vegan* 连蛋和奶也不吃
      balanced|the right amounts of fruit, vegetables, grains and protein;a little of everything;work and fun|balanced means with the right amount of each thing; fresh means newly made or picked|balanced 是均衡的；fresh 是新鲜的|fresh=fresh means newly made or picked, not having the right amount of each thing=fresh 是刚做好或刚摘的，不是各样分量合适;spicy=spicy means hot in taste, not having the right amounts of each thing=spicy 是辣，不是各样分量合适|a balanced diet · a balanced meal|from *balance*|来自 *balance*
      junk|food that is bad for you;old things in a garage;chips instead of an apple|junk is food that is bad for you or useless things; fiber is good for you|junk 是垃圾食品或废物；fiber 是纤维|fiber=fiber is good for you and helps your stomach, and is not bad food or useless things=fiber 对身体好，帮助消化，不是垃圾食品或废物;nutrition=nutrition is eating well, not bad food or old things=nutrition 是吃得营养，不是垃圾食品或旧东西|junk food · old junk|no plural: some junk|没有复数：some junk
      snack|an apple between lunch and dinner;nuts between meals;chips that spoil your dinner|a snack is eaten between meals; a dessert is eaten at the end of a meal|snack 是两餐之间的零食；dessert 是饭后甜点|dessert/desserts=a dessert is sweet food at the end of a meal, not food between meals=dessert 是饭后的甜点，不是两餐之间吃的;meal/meals=a meal is breakfast, lunch or dinner, not a small amount between them=meal 是早中晚饭，不是两餐之间的一点东西|have a snack · a healthy snack|a *snack bar* is a small café|*snack bar* 是小吃店
      portion|food on each plate;five of fruit and vegetables a day;rice on my plate|a portion is an amount of food for one person; a recipe tells you how to cook|portion 是一份；recipe 是菜谱|recipe/recipes=a recipe tells you how to cook and is not an amount of food on a plate=recipe 告诉你怎么做菜，不是盘子里的一份食物;menu/menus=a menu is a list of dishes, not food you eat=menu 是菜单，不是吃的食物|a small portion · five portions a day|-tion said like *shun*|-tion 读作 *shun*
      organic|vegetables grown without any chemicals;farmers who don't use chemicals;milk made without chemicals|organic means grown without chemicals; toxic means poisonous|organic 是有机的；toxic 是有毒的|balanced/Balanced=balanced means with the right amounts of each thing, not grown without chemicals=balanced 是各样分量合适，不是不用化学品;toxic/Toxic=toxic means poisonous, not grown without chemicals=toxic 是有毒的，不是不用化学品|organic vegetables · organic farming|in science *organic* also means from living things|在科学里 *organic* 也指来自生物的
      fiber|brown bread from the whole grain;beans;vegetables that help food pass through your body|fiber is the part of plants that helps food pass through you; fat is oily|fiber 是纤维；fat 是脂肪|fat=fat is oily and found in cheese and butter, not the plant part that helps food pass through you=fat 是油性的，在奶酪黄油里，不是帮助消化的植物部分;sugar=sugar is sweet and doesn't help food pass through your body=sugar 是甜的，不帮助消化|high in fiber · rich in fiber|British spelling *fibre*|英式拼写 *fibre*
    `,
  },
});

const bodyAndMind = vocabularyTopic({
  id: "b1-words-body-and-mind",
  title: t("Body and Mind", "身体和心理"),
  summary: t(
    "The chest, lungs and nerves; the mind; mental and physical; stress, tense and anxious; depressed and moods; breathing and the pulse.",
    "胸部、肺和神经；头脑；精神的和身体的；压力、紧张和焦虑；抑郁和心情；呼吸和脉搏。",
  ),
  intro: t(
    "**Stress** before an exam can make you **tense** and **anxious**: your **pulse** goes up and you **breathe** fast, which shows how your **mental** and **physical** health are linked. These words help you talk about your body and your feelings.",
    "考试前的 **stress**（压力）会让你 **tense**（紧张）又 **anxious**（焦虑）：**pulse**（脉搏）加快，**breathe**（呼吸）变急，这说明 **mental**（心理的）和 **physical**（身体的）健康是连在一起的。这些词帮你谈论身体和感受。",
  ),
  prerequisites: ["a2-words-body-2"],
  words: [
    word(
      "chest chests",
      "the front of your body between your neck and your stomach",
      "胸部",
      "I have a pain in my {chest}, near my heart. | He folded his arms across his {chest}, just below his neck. | The doctor listened to my heart and lungs through my {chest}.",
      "stomach neck",
    ),
    word(
      "lung lungs",
      "one of the two parts in your chest that you breathe with",
      "肺",
      "Smokers often get ill because smoke goes into their {lungs} when they breathe.|hearts stomachs | Take a deep breath and fill both {lungs} with air.|hearts stomachs | She has a {lung} infection and finds it hard to breathe.",
      "heart stomach",
    ),
    word(
      "nerve nerves",
      "one of the thin parts in the body that carry messages to and from the brain; (nerves) a nervous feeling",
      "神经；紧张",
      "{Nerves} carry messages from the brain to the body.|muscles lungs | I had a bad case of {nerves} before my exam.|muscles lungs | The cut damaged a {nerve} in his finger, so he can't feel anything there.",
      "muscle lung",
    ),
    word(
      "mental",
      "of the mind",
      "精神的；心理的",
      "Feeling sad for a long time can hurt your {mental} health, the health of your mind. | Doing puzzles is good {mental} exercise for the brain. | Stress can cause {mental} illness, such as feeling worried all the time.",
      "physical medical",
    ),
    word(
      "physical",
      "of the body",
      "身体的",
      "Swimming is good {physical} exercise. | He's in good {physical} condition, with strong muscles and a strong heart. | Football is a very {physical} game, with lots of running and pushing.",
      "mental medical",
    ),
    word(
      "stress",
      "a feeling of worry because of problems in your life or work",
      "压力",
      "Exams cause a lot of {stress}. | Yoga helps me deal with the {stress} of a busy job. | She's been under a lot of {stress} at work.",
      "mood pulse",
    ),
    word(
      "tense tenser tensest",
      "nervous and worried, so that you cannot relax; (of a muscle) tight",
      "紧张的",
      "I always feel {tense} before an interview, and my hands shake. | The last minutes of the match were very {tense}, and the fans couldn't sit still. | My shoulders are {tense} and tight. I need a massage.",
      "calm bored",
      "anxious",
    ),
    word(
      "anxious",
      "worried and nervous",
      "焦虑的；担心的",
      "She's {anxious} about her exam results and can't sleep for worry. | He felt {anxious} when his son didn't come home. | Don't be {anxious}. Everything will be fine.",
      "calm excited",
      "tense",
    ),
    word(
      "depressed",
      "very sad for a long time",
      "沮丧的；抑郁的",
      "He felt {depressed}, very sad for months, after he lost his job. | Talk to someone if you feel {depressed} and sad all the time. | She was {depressed} for months after her dog died.",
      "bored nervous",
    ),
    word(
      "mood moods",
      "the way you feel at one time",
      "心情；情绪",
      "I'm in a good {mood} today! | Exercise can improve your {mood} and make you feel happier. | His {moods} change quickly from happy to sad.|stresses pulses",
      "stress pulse",
    ),
    word(
      "breathe breathes breathed breathing",
      "to take air into your body and let it out again",
      "呼吸",
      "{Breathe} in slowly through your nose. | Fish {breathe} air through gills under the water. | He was {breathing} fast and hard after the race, taking in lots of air.|sneezing coughing",
      "sneeze cough",
    ),
    word(
      "pulse pulses",
      "the beat of your heart that you can feel in your wrist",
      "脉搏",
      "The nurse took my {pulse}. | Your {pulse}, the beat of your heart, goes up when you run. | Check your {pulse} at your wrist after exercise.",
      "mood stress",
    ),
    word(
      "mind minds",
      "the part of a person that thinks, feels and remembers; to be unhappy about something",
      "头脑；思想；介意",
      "I can't stop thinking about that song: I can't get it out of my {mind}. | She decided to go, then changed her {mind} and stayed at home. | Would you {mind} closing the door, please?|enjoy hate | The best {minds} in the country are working on this problem.|moods pulses",
      "mood pulse",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Mental* and *physical* both describe health, but *mental* is about the mind and feelings, and *physical* is about the body and muscles. Look for the mind or the body in the sentence.",
        "*mental* 和 *physical* 都可以形容健康，但 *mental* 说的是头脑和情绪，*physical* 说的是身体和肌肉。留意句子讲的是头脑还是身体。",
      ),
      meaning: t(
        "*Anxious* and *depressed* are both bad feelings, but *anxious* means worried about what will happen, and *depressed* means very sad for a long time. Check whether the meaning is worry or sadness.",
        "*anxious* 和 *depressed* 都是不好的感受，但 *anxious* 是担心将要发生的事，*depressed* 是长时间非常难过。看清释义说的是担心还是难过。",
      ),
      spell: t(
        "*Breathe* with a final e is the verb and *breath* without it is the noun: take a deep *breath*, then *breathe* out.",
        "结尾有 e 的 *breathe* 是动词，没有 e 的 *breath* 是名词：take a deep *breath*，then *breathe* out。",
      ),
    },
    notes: `
      chest|a pain near my heart;arms folded just below the neck;the heart and lungs heard by a doctor|the chest is the front of the body with the heart and lungs; the stomach is lower, where food goes|chest 是胸部；stomach 是肚子|stomach=the stomach is lower down, where food goes, not the part with the heart and lungs=stomach 在下面，是装食物的地方，不是心肺所在的部位;neck=the neck joins the head to the body and is not where the heart and lungs are=neck 连接头和身体，不是心肺所在的部位|a pain in my chest · chest pain|*chest* is also a big wooden box|*chest* 也指大木箱
      lung|smoke breathed in by smokers;both filled with air;an infection that makes breathing hard|the lungs fill with air; the heart pumps blood|lung 是肺；heart 是心脏|heart/hearts=the heart pumps blood and is not what fills with air when you breathe=heart 输送血液，不是呼吸时装空气的器官;stomach/stomachs=the stomach holds food, not the air you breathe=stomach 装食物，不装呼吸的空气|a lung infection · fill your lungs|we have two: *lungs*|人有两个肺，常用复数 *lungs*
      nerve|messages carried from the brain;nervous feelings before an exam;no feeling in a cut finger|a nerve carries messages and feeling; a muscle moves the body|nerve 是神经；muscle 是肌肉|muscle/muscles/Muscles=a muscle moves the body and doesn't carry messages or feelings to the brain=muscle 让身体动，不传递信息和感觉;lung/lungs/Lungs=a lung is for breathing and doesn't carry messages or feelings=lung 用来呼吸，不传递信息和感觉|a bad case of nerves · a nerve in the finger|adjective *nervous*: worried|形容词 *nervous*：紧张的
      mental|the health of your mind;exercise for the brain;feeling worried all the time|mental is about the mind; physical is about the body|mental 是心理的；physical 是身体的|physical=physical is about the body, not the mind or the brain=physical 说的是身体，不是头脑;medical=medical is about doctors and treatment, not about the mind=medical 说的是医生和治疗，不是头脑|mental health · mental illness|*mental* describes the mind; *mind* is the noun|*mental* 是形容词；名词是 *mind*
      physical|swimming as exercise;strong muscles and a strong heart;lots of running and pushing|physical is about the body; mental is about the mind|physical 是身体的；mental 是心理的|mental=mental is about the mind, not the body and muscles=mental 说的是头脑，不是身体和肌肉;medical=medical is about doctors, not about the body moving=medical 说的是医生，不是身体运动|physical exercise · physical health|ph said like f: *FIZ-i-cal*|ph 读作 f：*FIZ-i-cal*
      stress|worry caused by exams;the worry of a busy job;pressure at work|stress is worry from problems; a mood is how you feel at one time|stress 是压力；mood 是心情|mood/moods=a mood is how you feel at one time, good or bad, not worry from problems=mood 是一时的心情，有好有坏，不是问题带来的担忧;pulse/pulses=a pulse is your heartbeat, not worry=pulse 是心跳，不是担忧|under stress · deal with stress|adjective *stressful*: a stressful job|形容词 *stressful*：a stressful job
      tense|hands that shake before an interview;fans who couldn't sit still;tight shoulders|tense means nervous or tight; calm means relaxed|tense 是紧张的；calm 是平静的|calm=calm means relaxed and not worried, the opposite of shaking or tight=calm 是放松不担心，和发抖、绷紧相反;bored=bored means not interested, not nervous or tight=bored 是没兴趣，不是紧张或绷紧|feel tense · a tense match|*tense* is also the time of a verb in grammar|在语法里 *tense* 也指时态
      anxious|exam results and no sleep for worry;a son who didn't come home;the hope that everything will be fine|anxious means worried; calm means not worried|anxious 是焦虑的；calm 是平静的|calm=calm means not worried, the opposite of anxious=calm 是不担心，正好和焦虑相反;excited=excited means happy and looking forward, not worried=excited 是高兴又期待，不是担心|anxious about · feel anxious|noun *anxiety*|名词 *anxiety*
      depressed|months of sadness after losing a job;feeling sad all the time;months after a dog died|depressed means very sad for a long time; bored means not interested|depressed 是抑郁的；bored 是无聊的|bored=bored means not interested in anything, not very sad for a long time=bored 是没兴趣，不是长期非常难过;nervous=nervous means worried about what will happen, not very sad=nervous 是担心将来的事，不是非常难过|feel depressed · get depressed|noun *depression*|名词 *depression*
      mood|a good feeling today;feeling happier after exercise;quick changes from happy to sad|a mood is how you feel at one time; stress is worry from problems|mood 是心情；stress 是压力|stress/stresses=stress is worry from problems, and it is never good or happy=stress 是问题带来的担忧，不会是好的或快乐的;pulse/pulses=a pulse is your heartbeat, not how you feel=pulse 是心跳，不是感受|in a good mood · in a bad mood|*moody* means often changing mood|*moody* 是情绪多变的
      breathe|air taken in slowly through the nose;air taken through gills;lots of air after a race|to breathe is to take air in and out; to sneeze is to blow air out suddenly|breathe 是呼吸；sneeze 是打喷嚏|sneeze/Sneeze/sneezing=to sneeze is to blow air out suddenly, not to take air in slowly=sneeze 是突然喷气，不是慢慢吸气;cough/Cough/coughing=to cough is to push air out of your throat with a noise, not to take it in=cough 是从喉咙用力把气咳出，不是吸气|breathe in · breathe out|th said like the start of *this*|th 读作 *this* 开头的音
      pulse|something a nurse took;the beat of the heart going up;something checked at the wrist|a pulse is the beat of your heart; a mood is how you feel|pulse 是脉搏；mood 是心情|mood=a mood is how you feel, not a beat you can count=mood 是感受，不是能数的跳动;stress=stress is worry, not a beat you can feel at your wrist=stress 是担忧，不是手腕上能摸到的跳动|take your pulse · check your pulse|you *take* someone's pulse|说 *take* someone's pulse
      mind|a song you can't stop thinking about;a decision changed;a polite question about the door;the best thinkers|the mind thinks and remembers; a mood is how you feel|mind 是头脑；mood 是心情|mood/moods=a mood is how you feel for a while, not the part of you that thinks, remembers and decides=mood 是一时的心情，不是思考、记忆、做决定的部分;pulse/pulses=a pulse is a heartbeat, not the part that thinks=pulse 是心跳，不是思考的部分;enjoy=asking if someone would enjoy a job is not how you politely ask for help=问别人会不会喜欢做某事，不是礼貌请求帮忙的说法;hate=nobody asks for help by asking whether someone would hate doing it=没有人用“你会不会讨厌做这件事”来请别人帮忙|change your mind · Would you mind …?|*Would you mind* takes -ing: would you mind closing|*Would you mind* 后面用 -ing：would you mind closing
    `,
  },
});

const healthVerbs = vocabularyTopic({
  id: "b1-words-health-verbs",
  title: t("Causes and Effects", "原因和结果"),
  summary: t(
    "Avoiding, preventing and reducing; increasing, suffering and affecting; causing, harming and damaging; risks, effects and benefits.",
    "避免、预防和减少；增加、患病和影响；导致、伤害和损害；风险、效果和好处。",
  ),
  intro: t(
    "Healthy habits **reduce** the **risk** of illness and **prevent** many problems, while smoking **causes** **harm** and **increases** the chance of disease. These words help you talk about what is good or bad for your health.",
    "健康的习惯能 **reduce**（降低）生病的 **risk**（风险），**prevent**（预防）很多问题，而吸烟会 **causes**（造成）**harm**（伤害），**increases**（增加）患病的可能。这些词帮你谈论什么对健康有好处、什么有坏处。",
  ),
  prerequisites: ["b1-words-illness"],
  words: [
    word(
      "avoid avoids avoided avoiding",
      "to stay away from something; to try not to do something",
      "避免",
      "Try to {avoid} sugary drinks and drink water instead. | She {avoided} my eyes and looked at the floor.|increased enjoyed | We left early to {avoid} the traffic.",
      "increase enjoy",
    ),
    word(
      "prevent prevents prevented preventing",
      "to stop something from happening",
      "预防；阻止",
      "Washing your hands helps {prevent} illness. | A new fence on the busy road {prevented} accidents, so nobody was hurt.|caused increased | What can we do to {prevent} accidents and keep children safe?",
      "cause increase",
    ),
    word(
      "reduce reduces reduced reducing",
      "to make something smaller or less",
      "减少",
      "Exercise can {reduce} stress and help you feel calm. | The shop has {reduced} its prices by twenty percent in the sale, so everything is cheaper.|increased caused | Turn off the lights to {reduce} your electricity bill.",
      "increase cause",
    ),
    word(
      "increase increases increased increasing",
      "to make or become larger",
      "增加",
      "The number of students has {increased} from 300 to 500.|reduced prevented | Smoking {increases} the risk of heart disease.|reduces prevents | Prices {increase} every year, so things cost more and more.",
      "reduce prevent",
    ),
    word(
      "suffer suffers suffered suffering",
      "to feel pain or be ill (suffer from)",
      "受苦；患病",
      "She often {suffers} from bad headaches that hurt for hours.|recovers benefits | Many old people {suffered} terribly in the hot summer.|recovered benefited | He's {suffering} from a bad cold and feels awful.|recovering benefiting",
      "recover benefit",
    ),
    word(
      "affect affects affected affecting",
      "to change something or someone",
      "影响",
      "Too little sleep can {affect} your memory and make it worse. | The storm {affected} thousands of homes, breaking windows and roofs.|improved helped | Does the weather {affect} your mood, making you sad when it rains?",
      "improve help",
    ),
    word(
      "cause causes caused causing",
      "to make something happen; the reason something happens",
      "导致；原因",
      "Smoking {causes} many diseases, such as lung cancer.|prevents cures | What was the {cause} of the fire? Was it an old cooker?|effect benefit | The storm {caused} a lot of damage.|prevented cured",
      "prevent cure",
    ),
    word(
      "harm harms harmed harming",
      "to hurt or damage; damage or hurt",
      "伤害",
      "Too much sun can {harm} your skin and burn it. | No animals were {harmed} or hurt in the film.|benefited helped | Smoking does a lot of {harm}.|benefit good",
      "benefit help",
      "damage",
    ),
    word(
      "damage damages damaged damaging",
      "physical harm to something; to harm something",
      "损坏；损害",
      "The storm {damaged} our roof, and now water comes in.|repaired protected | Loud music can {damage} your ears. | The fire caused a lot of {damage}.|benefit repair",
      "repair protect",
      "harm",
    ),
    word(
      "risk risks",
      "the chance that something bad will happen",
      "风险",
      "Smoking increases the {risk} of lung disease. | Don't take {risks} when you drive.|benefits effects | There's a small {risk} that the river will flood tonight.",
      "benefit effect",
    ),
    word(
      "effect effects",
      "a change that something causes",
      "效果；影响",
      "The medicine had a strange {effect}: it made my hair turn green! | One {effect} of too much screen time is bad sleep. | What are the side {effects} of this medicine?|causes benefits",
      "cause benefit",
    ),
    word(
      "benefit benefits",
      "a good thing that something gives you",
      "好处",
      "The {benefits} of exercise, like a strong heart, are clear.|risks harms | Regular sleep has many {benefits} for your health and mood.|risks harms | One {benefit} of cycling is that it's free.",
      "risk harm",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Affect* and *effect* sound alike, but *affect* is usually the verb, to change something, and *effect* is the noun, the change itself. Look for a word like *a*, *the* or *no* before the gap.",
        "*affect* 和 *effect* 读音相近，但 *affect* 通常是动词，表示影响，*effect* 是名词，指影响本身。留意空格前有没有 *a*、*the*、*no* 这样的词。",
      ),
      meaning: t(
        "*Prevent* and *avoid* both keep you from something bad, but you *prevent* a thing from happening at all, and you *avoid* it by staying away from it. Check whether the meaning stops it or stays away from it.",
        "*prevent* 和 *avoid* 都能让你远离坏事，但 *prevent* 是让事情根本不发生，*avoid* 是躲开它。看清释义是阻止它，还是避开它。",
      ),
      spell: t(
        "*Benefit* adds -ed without doubling the t: *benefited*; *damage* drops its e before -ing: *damaging*.",
        "*benefit* 加 -ed 时 t 不双写：*benefited*；*damage* 加 -ing 时去掉 e：*damaging*。",
      ),
    },
    notes: `
      avoid|water instead of sugary drinks;eyes on the floor;leaving early before the traffic|to avoid is to stay away from something; to enjoy is to like it|avoid 是避开；enjoy 是喜欢|increase/increased=to increase is to make bigger, not to stay away from something=increase 是增加，不是避开;enjoy/enjoyed=to enjoy is to like something, not to stay away from it=enjoy 是喜欢，不是避开|avoid sugar · avoid the traffic|followed by -ing: avoid eating, not avoid to eat|后面用 -ing：avoid eating，不说 avoid to eat
      prevent|handwashing against illness;a fence so nobody was hurt;keeping children safe|to prevent is to stop something happening; to cause is to make it happen|prevent 是预防；cause 是导致|cause/caused=to cause is to make something happen, the opposite of stopping it=cause 是让事情发生，和阻止相反;increase/increased=to increase is to make more, not to stop something happening=increase 是变多，不是阻止|prevent illness · prevent someone from doing|prevent someone *from* doing something|prevent someone *from* doing something
      reduce|stress lowered so you feel calm;prices cheaper in a sale;a lower electricity bill|to reduce is to make less; to increase is to make more|reduce 是减少；increase 是增加|increase/increased=to increase is to make bigger, not smaller or cheaper=increase 是变大，不是变小或变便宜;cause/caused=to cause is to make something happen, not to make it less=cause 是让事情发生，不是减少|reduce stress · reduce prices|noun *reduction*|名词 *reduction*
      increase|300 students becoming 500;a higher risk from smoking;things that cost more and more|to increase is to make bigger; to reduce is to make smaller|increase 是增加；reduce 是减少|reduce/reduced/reduces=to reduce is to make smaller, not bigger=reduce 是变小，不是变大;prevent/prevented/prevents=to prevent is to stop something, not to make it bigger=prevent 是阻止，不是变大|increase the risk · prices increase|noun stressed on *IN-*, verb on *-CREASE*|名词重音在 *IN-*，动词重音在 *-CREASE*
      suffer|headaches that hurt for hours;old people in a hot summer;a cold that makes him feel awful|to suffer is to feel pain or be ill; to recover is to get well|suffer 是受苦、患病；recover 是康复|recover/recovers/recovered/recovering=to recover is to get well again, not to feel pain=recover 是恢复健康，不是受苦;benefit/benefits/benefited/benefiting=to benefit is to get something good, not to feel pain or illness=benefit 是得到好处，不是受苦或生病|suffer from headaches · suffer pain|use *from*: suffer from a cold|用 *from*：suffer from a cold
      affect|a memory made worse;broken windows and roofs;feeling sad when it rains|to affect is to change something; to improve is to make it better|affect 是影响；improve 是改善|improve/improved=to improve is to make better, not worse or broken=improve 是变好，不是变坏或损坏;help/helped=to help is to make things easier or better, not worse or broken=help 是让事情更容易或更好，不是变坏或损坏|affect your mood · be affected by|*affect* is the verb, *effect* the noun|*affect* 是动词，*effect* 是名词
      cause|diseases like lung cancer;the reason for a fire;damage from a storm|to cause is to make something happen; to prevent is to stop it|cause 是导致、原因；prevent 是预防|prevent/prevents/prevented=to prevent is to stop something happening, not to make it happen=prevent 是阻止事情发生，不是让它发生;cure/cures/cured=to cure is to make an illness go away, not to make damage or illness happen=cure 是治好病，不是造成损害或疾病;effect=an effect is what happens after, not the reason before=effect 是之后的结果，不是之前的原因;benefit=a benefit is a good thing, not the reason for a fire=benefit 是好处，不是起火的原因|the cause of · cause damage|*because* has *cause* inside it|*because* 里面就有 *cause*
      harm|sun that burns your skin;animals not hurt in a film;the damage that smoking does|to harm is to hurt or damage; to benefit is to do good|harm 是伤害；benefit 是好处|benefit/benefited=a benefit is something good, not hurt or damage=benefit 是好处，不是伤害;help/helped=to help is to make better, not to hurt=help 是帮忙变好，不是伤害;good=doing good means helping, not hurting=do good 是有益，不是伤害|do harm · harm your skin|adjective *harmful*, opposite *harmless*|形容词 *harmful*，反义词 *harmless*
      damage|a roof that now lets water in;ears hurt by loud music;what a fire caused|to damage is to harm a thing; to repair is to fix it|damage 是损坏；repair 是修理|repair/repaired=to repair is to fix something, the opposite of breaking it=repair 是修好，和弄坏相反;protect/protected=to protect is to keep something safe, not to harm it=protect 是保护，不是损坏;benefit=a benefit is a good thing, not what a fire leaves=benefit 是好处，不是火灾留下的东西|cause damage · damage your ears|no plural for harm to things: a lot of damage|表示损坏时没有复数：a lot of damage
      risk|lung disease from smoking;dangerous driving;a river that might flood|a risk is the chance of something bad; a benefit is something good|risk 是风险；benefit 是好处|benefit/benefits=a benefit is a good thing, not the chance of something bad=benefit 是好处，不是坏事发生的可能;effect/effects=an effect is a change that has already happened, not the chance of something bad=effect 是已经发生的变化，不是坏事发生的可能|take a risk · the risk of|adjective *risky*|形容词 *risky*
      effect|hair that turned green;bad sleep from screen time;side effects of medicine|an effect is the change something causes; a cause is the reason|effect 是效果、影响；cause 是原因|cause/causes=a cause is the reason something happens, not the change that comes after it=cause 是原因，不是之后的变化;benefit/benefits=a benefit is a good thing, not a bad or strange change=benefit 是好处，不是坏的或奇怪的变化|side effects · have an effect on|have an effect *on* something|have an effect *on* something
      benefit|a strong heart from exercise;good things for health and mood from sleep;cycling for free|a benefit is a good thing; a risk is the chance of something bad|benefit 是好处；risk 是风险|risk/risks=a risk is the chance of something bad, not a good thing=risk 是坏事的可能，不是好处;harm/harms=harm is damage, not a good thing=harm 是伤害，不是好处|the benefits of · benefit from|verb *benefit from*: you benefit from sleep|动词 *benefit from*：you benefit from sleep
    `,
  },
});

const symptoms = vocabularyTopic({
  id: "b1-words-symptoms",
  title: t("Symptoms", "症状"),
  summary: t(
    "Examining and injections; bleeding, fainting and swallowing; sneezing, itching and scratching; bruises, and feeling swollen, sore and dizzy.",
    "检查和注射；流血、晕倒和吞咽；打喷嚏、发痒和抓挠；瘀伤，以及肿胀、疼痛和头晕。",
  ),
  intro: t(
    "When you are ill, the doctor will **examine** you, and you may feel **dizzy**, have a **sore** throat that hurts when you **swallow**, or **sneeze** all day. These words help you tell a doctor what is wrong.",
    "生病时，医生会 **examine**（检查）你；你可能觉得 **dizzy**（头晕），喉咙 **sore**（疼），一 **swallow**（吞咽）就痛，或者整天 **sneeze**（打喷嚏）。这些词帮你告诉医生哪里不舒服。",
  ),
  prerequisites: ["b1-words-illness"],
  words: [
    word(
      "examine examines examined examining",
      "to look at something or someone carefully",
      "检查",
      "The doctor {examined} my throat, looking at it carefully with a little light.|swallowed scratched | Let me {examine} your eye closely to see what's wrong. | The police {examined} the car carefully, looking for clues.|swallowed scratched",
      "swallow scratch",
    ),
    word(
      "injection injections",
      "medicine put into your body with a needle",
      "注射",
      "The nurse used a needle to give me the {injection} in my arm. | I'm afraid of {injections} because I hate needles.|bruises pills | Some medicines go into your body with a needle, as {injections}, not as pills.|bruises pills",
      "bruise pill",
    ),
    word(
      "bleed bleeds bled bleeding",
      "to lose blood",
      "流血",
      "Your nose is {bleeding}! There's blood on your shirt.|fainting itching | The cut {bled} for a long time, and blood got on the towel.|fainted itched | Press hard on the cut so that it stops {bleeding} and the blood dries.|fainting itching",
      "faint itch",
    ),
    word(
      "faint faints fainted fainting",
      "to fall down suddenly because you stop being awake for a short time",
      "晕倒",
      "It was so hot that a boy {fainted} and fell to the floor in the school hall.|sneezed bled | She felt dizzy and was going to {faint}, so she sat down. | Some people {faint} and fall down when they see blood.",
      "sneeze bleed",
    ),
    word(
      "swallow swallows swallowed swallowing",
      "to make food or drink go down your throat",
      "吞咽",
      "My throat is sore, and it hurts when I {swallow} my food. | Chew your food well before you {swallow} it. | The dog {swallowed} a small toy, and now it's in his stomach.|sneezed coughed",
      "sneeze cough",
    ),
    word(
      "sneeze sneezes sneezed sneezing",
      "to blow air out of your nose suddenly, for example when you have a cold",
      "打喷嚏",
      "Cats make me {sneeze}: air bursts out of my nose. | Cover your nose and mouth when you {sneeze}. | He {sneezed} five times in a row: achoo, achoo, achoo!|swallowed fainted",
      "swallow faint",
    ),
    word(
      "itch itches itched itching",
      "to have a feeling on your skin that makes you want to rub it",
      "发痒",
      "My mosquito bite {itches}, and I want to scratch it.|bleeds faints | This wool sweater makes my skin {itch}. | Stop scratching! I know it {itches}, but you'll make it worse.|bleeds faints",
      "bleed faint",
    ),
    word(
      "scratch scratches scratched scratching",
      "to rub your skin with your nails",
      "抓；挠",
      "Don't {scratch} the bite with your nails, or it will get worse. | The cat {scratched} my hand with its claws.|itched sneezed | He {scratched} his head with his fingers and thought.|itched sneezed",
      "itch sneeze",
    ),
    word(
      "bruise bruises",
      "a blue or purple mark on your skin after you hit it",
      "瘀伤",
      "I fell off my bike, and a big purple {bruise} came up on my leg. | Her arms were covered in blue and purple {bruises} after the fall.|injections itches | The {bruise} turned yellow after a few days.",
      "injection itch",
    ),
    word(
      "swollen",
      "bigger than usual, because of an injury or an illness",
      "肿胀的",
      "My ankle is so {swollen} after I fell that my shoe won't go on. | Her eyes were red and {swollen}, puffy and bigger, from crying. | He has a {swollen} knee that is much bigger than the other one.",
      "dizzy sore",
    ),
    word(
      "sore sorer sorest",
      "painful",
      "疼痛的",
      "I have a {sore} throat, and it hurts to talk. | My legs hurt: they are {sore} after the marathon. | My feet are getting {sorer} and hurt more with every step. Let's stop and rest.|dizzier weaker",
      "dizzy swollen",
    ),
    word(
      "dizzy dizzier dizziest",
      "feeling that everything is turning around and you might fall",
      "头晕的",
      "The room is turning around. I feel {dizzy}. | Spinning round and round makes me {dizzy}. | She got {dizzy}, the world turned around, and she fell off the ladder.",
      "swollen sore",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Itch* and *scratch* go together, but you *itch* when your skin has a feeling, and you *scratch* when you rub it with your nails. Look for nails or claws, or for a feeling on the skin.",
        "*itch* 和 *scratch* 常一起出现，但 *itch* 是皮肤发痒的感觉，*scratch* 是用指甲去挠。留意句中有没有指甲、爪子，还是在说皮肤的感觉。",
      ),
      meaning: t(
        "*Sore* and *swollen* often go together, but *sore* means painful, and *swollen* means bigger than usual. Check whether the meaning is about pain or about size.",
        "*sore* 和 *swollen* 常一起出现，但 *sore* 是疼，*swollen* 是比平常大。看清释义说的是疼痛还是大小。",
      ),
      spell: t(
        "*Bleed* changes its vowel in the past: *bled*, not *bleeded*; *swollen* comes from *swell* and ends in -en.",
        "*bleed* 的过去式改变元音：*bled*，不是 *bleeded*；*swollen* 来自 *swell*，以 -en 结尾。",
      ),
    },
    notes: `
      examine|a throat looked at with a little light;an eye looked at closely;a car searched for clues|to examine is to look at carefully; to scratch is to rub with your nails|examine 是检查；scratch 是挠|swallow/swallowed=to swallow is to make food go down your throat, not to look at something carefully=swallow 是把食物咽下去，不是仔细查看;scratch/scratched=to scratch is to rub with your nails, not to look carefully=scratch 是用指甲挠，不是仔细查看|examine a patient · examine carefully|noun *examination*, short *exam*|名词 *examination*，简称 *exam*
      injection|a needle in my arm;the fear of needles;medicine through a needle instead of pills|an injection is medicine given with a needle; a pill is swallowed|injection 是打针；pill 是药片|bruise/bruises=a bruise is a blue mark from a hit, not medicine given with a needle=bruise 是撞出的青紫，不是用针打的药;pill/pills=a pill is medicine you swallow, not medicine given with a needle=pill 是吞服的药片，不是用针打的药|give an injection · have an injection|verb *inject*|动词 *inject*
      bleed|blood on a shirt;blood on a towel;blood that dries|to bleed is to lose blood; to itch is to want to rub your skin|bleed 是流血；itch 是发痒|faint/fainting/fainted=to faint is to fall down and stop being awake, not to lose blood=faint 是晕倒，不是流血;itch/itching/itched=to itch is to want to rub your skin, not to lose blood=itch 是想挠皮肤，不是流血|bleed badly · a bleeding nose|past *bled*|过去式 *bled*
      faint|a boy falling to the floor in the heat;feeling dizzy and sitting down;falling down at the sight of blood|to faint is to fall because you stop being awake; to sneeze is to blow air out of your nose|faint 是晕倒；sneeze 是打喷嚏|sneeze/sneezed=to sneeze is to blow air out of your nose, not to fall down and stop being awake=sneeze 是鼻子喷气，不是倒下失去知觉;bleed/bled=to bleed is to lose blood, not to fall down because you stop being awake=bleed 是流血，不是失去知觉倒下|faint from the heat · feel faint|*feel faint* means you are about to faint|*feel faint* 是快要晕倒的感觉
      swallow|food that hurts a sore throat;chewed food going down;a toy now in a dog's stomach|to swallow is to make food go down; to cough is to push air out|swallow 是吞咽；cough 是咳嗽|sneeze/sneezed=to sneeze is to blow air out of your nose, not to make food go down=sneeze 是鼻子喷气，不是把食物咽下;cough/coughed=to cough is to push air out of your throat, not to make food go down=cough 是从喉咙咳出气，不是把食物咽下|swallow food · hard to swallow|*swallow* is also a small bird|*swallow* 也指燕子
      sneeze|air bursting out of my nose;a covered nose and mouth;achoo five times|to sneeze is to blow air out of your nose suddenly; to swallow is to send food down|sneeze 是打喷嚏；swallow 是吞咽|swallow/swallowed=to swallow is to send food down your throat, not to blow air out of your nose=swallow 是把食物咽下，不是鼻子喷气;faint/fainted=to faint is to fall down, not to blow air out of your nose=faint 是晕倒，不是鼻子喷气|sneeze loudly · cough and sneeze|people say *Bless you!* after a sneeze|别人打喷嚏后常说 *Bless you!*
      itch|a mosquito bite I want to scratch;a wool sweater on my skin;a bite made worse by scratching|to itch is to feel you want to scratch; to bleed is to lose blood|itch 是发痒；bleed 是流血|bleed/bleeds=to bleed is to lose blood, not a feeling that makes you want to scratch=bleed 是流血，不是想挠的感觉;faint/faints=to faint is to fall down, not a feeling on your skin=faint 是晕倒，不是皮肤的感觉|itch all over · an itchy bite|adjective *itchy*|形容词 *itchy*
      scratch|a bite rubbed with nails;a cat's claws on a hand;fingers on a head while thinking|to scratch is to rub with nails; to itch is the feeling that makes you do it|scratch 是挠；itch 是发痒|itch/itched=to itch is a feeling on your skin, not rubbing it with nails or claws=itch 是皮肤的感觉，不是用指甲或爪子挠;sneeze/sneezed=to sneeze is to blow air from your nose, not to rub with nails=sneeze 是鼻子喷气，不是用指甲挠|scratch an itch · scratch your head|*from scratch* means from the very start|*from scratch* 是从零开始
      bruise|a purple mark after falling off a bike;blue and purple marks after a fall;a mark that turned yellow|a bruise is a colored mark from a hit; an itch is a feeling|bruise 是瘀伤；itch 是痒|injection/injections=an injection is medicine given with a needle, not a blue or purple mark=injection 是用针打的药，不是青紫的印子;itch/itches=an itch is a feeling on the skin, not a colored mark=itch 是皮肤的感觉，不是有颜色的印子|a big bruise · covered in bruises|ui said like *oo*: *brooz*|ui 读作 *oo*：*brooz*
      swollen|an ankle too big for a shoe;eyes puffy from crying;a knee bigger than the other|swollen means bigger than usual; sore means painful|swollen 是肿的；sore 是疼的|dizzy=dizzy is a feeling that the room is turning, not a part of the body getting bigger=dizzy 是觉得天旋地转，不是身体某处变大;sore=sore means painful, not bigger than usual=sore 是疼，不是比平常大|a swollen ankle · swollen eyes|from *swell*: my ankle swelled up|来自 *swell*：my ankle swelled up
      sore|a throat that hurts to talk;legs that hurt after a marathon;feet that hurt more with every step|sore means painful; swollen means bigger than usual|sore 是疼的；swollen 是肿的|dizzy/dizzier=dizzy means feeling everything turning round, not pain in one part of the body=dizzy 是天旋地转，不是某个部位疼;swollen=swollen means bigger than usual, not painful=swollen 是比平常大，不是疼;weaker=weaker means less strong, not more painful=weaker 是更没力气，不是更疼|a sore throat · sore legs|*sore* means painful; *sorry* is a different word|*sore* 是疼；*sorry* 是另一个词
      dizzy|a room turning around;spinning round and round;the world turning before a fall from a ladder|dizzy means feeling that everything is turning; sore means painful|dizzy 是头晕的；sore 是疼的|swollen=swollen means bigger than usual, not feeling the room turn=swollen 是比平常大，不是觉得房间在转;sore=sore means painful, not feeling that you might fall=sore 是疼，不是觉得要摔倒|feel dizzy · get dizzy|double z: *dizzy*, *dizzier*|双写 z：*dizzy*、*dizzier*
    `,
  },
});

const habits = vocabularyTopic({
  id: "b1-words-healthy-habits",
  title: t("Healthy Habits", "健康习惯"),
  summary: t(
    "Routines and lifestyles; alcohol, cigarettes and being overweight; skipping meals; regular and normal; naps, meditation, hygiene and quitting; staying awake.",
    "日常习惯和生活方式；酒精、香烟和超重；不吃饭；规律的和正常的；小睡、冥想、卫生和戒掉；保持清醒。",
  ),
  intro: t(
    "A healthy **lifestyle** means a **regular** daily **routine**, good **hygiene**, a short **nap** when you need one and no **cigarettes** or **alcohol**. These words help you talk about habits that keep you well.",
    "健康的 **lifestyle**（生活方式）意味着 **regular**（规律的）日常 **routine**（作息）、良好的 **hygiene**（卫生）、累了就 **nap**（小睡）一会儿，不碰 **cigarettes**（香烟）和 **alcohol**（酒）。这些词帮你谈论让人保持健康的习惯。",
  ),
  prerequisites: ["a2-words-staying-well"],
  words: [
    word(
      "routine routines",
      "the usual order in which you do things",
      "日常惯例",
      "My morning {routine} is always the same: shower, breakfast, bus. | Exercise is part of my daily {routine}, the things I do in the same order every day. | Children feel safe when they have {routines}, like the same bedtime every night.|hobbies diets",
      "hobby diet",
      "lifestyle",
    ),
    word(
      "lifestyle lifestyles",
      "the way you live",
      "生活方式",
      "She has a healthy {lifestyle}: she eats well and exercises. | City {lifestyles} are often busy and stressful.|hobbies diets | Moving to the country changed our whole {lifestyle}: where we work, shop and play.",
      "hobby diet",
      "routine",
    ),
    word(
      "alcohol",
      "drinks such as beer and wine that can make people drunk",
      "酒精；酒",
      "Drivers must not drink {alcohol}, because it makes them drunk. | Children shouldn't drink {alcohol} like beer. | Beer and wine contain {alcohol}, which can make people drunk.",
      "sugar coffee",
    ),
    word(
      "cigarette cigarettes",
      "a thin paper tube of tobacco that people smoke",
      "香烟",
      "He smoked twenty {cigarettes} a day.|candles matches | {Cigarettes}, which people smoke, are bad for your lungs.|candles matches | She put out her {cigarette}, stopped smoking, and went inside.",
      "candle match",
    ),
    word(
      "overweight",
      "too heavy, in a way that is bad for your health",
      "超重的",
      "The doctor said I'm a bit {overweight}, so I should eat less. | {Overweight} pets that eat too much can have health problems too. | He was {overweight} because he ate junk food every day.",
      "thin healthy",
    ),
    word(
      "skip skips skipped skipping",
      "not to do something you usually do, such as eating a meal",
      "不做；跳过",
      "Don't {skip} breakfast, even once. It's the most important meal. | She {skipped} just one piano lesson because she was ill, and went back the next week.|quit enjoyed | I'm going to {skip} the gym just for today. I'm too tired.",
      "quit enjoy",
    ),
    word(
      "regular regularly",
      "happening at the same times each day or week; often",
      "规律的；定期的",
      "Take {regular} breaks, one every hour, when you study. | I exercise {regularly}, three times every week.|rarely suddenly | Brush your teeth {regularly}, every morning and every night.|rarely suddenly",
      "sudden rare",
    ),
    word(
      "normal",
      "usual and ordinary; what you expect",
      "正常的；平常的",
      "Your temperature is {normal}. You don't have a fever. | It's {normal} to feel nervous before an exam: everyone does. | After the holiday, life went back to {normal}.",
      "high strange",
    ),
    word(
      "nap naps",
      "a short sleep during the day",
      "小睡；午睡",
      "Grandpa has a {nap} in his chair after lunch and sleeps for an hour. | A short {nap}, a sleep of twenty minutes, can help you feel less tired. | Babies need several {naps} a day, sleeping in the morning and afternoon.|snacks meals",
      "snack meal",
    ),
    word(
      "meditation",
      "sitting quietly and thinking calmly for a time, to relax",
      "冥想",
      "{Meditation} with my eyes closed helps me feel calm. | She does ten minutes of {meditation} every morning, sitting quietly. | In {meditation}, you sit quietly and focus on your breathing.",
      "hygiene nutrition",
    ),
    word(
      "hygiene",
      "keeping yourself and things clean to stop disease",
      "卫生",
      "Good {hygiene}, like washing your hands, stops the spread of disease. | Washing your hands is basic {hygiene}. | The restaurant was closed because of poor {hygiene} and dirty kitchens.",
      "nutrition meditation",
    ),
    word(
      "quit quits quitting",
      "to stop doing something",
      "戒掉；放弃",
      "My dad {quit} smoking last year and hasn't had a cigarette since.|skipped started | It's hard to {quit} sugar and never eat it again. | She's {quitting} her job for good to travel the world.|skipping starting",
      "skip start",
    ),
    word(
      "awake",
      "not sleeping",
      "醒着的",
      "I was still {awake} at midnight, not sleeping at all. | Strong coffee keeps me {awake} at night. | Is the baby {awake} yet? I can hear her playing in her bed.",
      "asleep tired",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        '*Skip* and *quit* both mean not doing something, but you *skip* it once and do it again later, and you *quit* when you stop for good. Look for "once", "today" or "for good".',
        "*skip* 和 *quit* 都表示不做某事，但 *skip* 是跳过一次，之后还会做，*quit* 是彻底不做了。留意句中的 “once”“today” 或 “for good”。",
      ),
      meaning: t(
        "*Routine* and *lifestyle* both describe how you live, but a *routine* is the usual order of things you do each day, and a *lifestyle* is your whole way of living. Check whether the meaning is an order of things or a whole way of life.",
        "*routine* 和 *lifestyle* 都在说你怎样生活，但 *routine* 是每天做事的固定顺序，*lifestyle* 是整体的生活方式。看清释义说的是做事顺序，还是整个生活方式。",
      ),
      spell: t(
        "*Hygiene* has y after h and ie in the middle: h-y-g-ie-ne; *cigarette* ends in -ette.",
        "*hygiene* 的 h 后面是 y，中间是 ie：h-y-g-ie-ne；*cigarette* 以 -ette 结尾。",
      ),
    },
    notes: `
      routine|shower, breakfast and bus every morning;things done in the same order every day;the same bedtime every night|a routine is the usual order of what you do; a hobby is something you do for fun|routine 是日常作息；hobby 是爱好|hobby/hobbies=a hobby is something you do for fun, not the usual order of your day=hobby 是为了好玩做的事，不是每天的固定顺序;diet/diets=a diet is the food you eat, not the order you do things in=diet 是吃的东西，不是做事的顺序|a daily routine · a morning routine|*routine* said like *roo-TEEN*|*routine* 读作 *roo-TEEN*
      lifestyle|eating well and exercising;busy, stressful city living;where we work, shop and play|a lifestyle is your whole way of living; a diet is only what you eat|lifestyle 是生活方式；diet 是饮食|hobby/hobbies=a hobby is one thing you do for fun, not your whole way of living=hobby 是一项爱好，不是整个生活方式;diet/diets=a diet is only the food you eat, not your whole way of living=diet 只是吃的东西，不是整个生活方式|a healthy lifestyle · change your lifestyle|life + style, one word|life 加 style，写成一个词
      alcohol|what drivers must not drink;beer that children shouldn't drink;what makes beer and wine make people drunk|alcohol is in drinks that make people drunk; coffee keeps you awake|alcohol 是酒精；coffee 是咖啡|sugar=sugar is sweet and doesn't make people drunk=sugar 是甜的，不会让人喝醉;coffee=coffee keeps you awake and doesn't make people drunk=coffee 让人清醒，不会让人喝醉|drink alcohol · no alcohol|the h is silent: *AL-co-hol*|h 不发音：*AL-co-hol*
      cigarette|twenty smoked a day;something people smoke that hurts lungs;something put out when she stopped smoking|a cigarette is a paper tube of tobacco that people smoke; a candle gives light|cigarette 是香烟；candle 是蜡烛|candle/candles/Candles=a candle gives light when it burns, and people don't smoke it=candle 燃烧时照明，人不会抽它;match/matches/Matches=a match is a small stick you strike to make fire, not something people smoke=match 是划着生火的火柴，人不会抽它|smoke a cigarette · a pack of cigarettes|stress on the last part: *ci-ga-RETTE*|重音在最后：*ci-ga-RETTE*
      overweight|a doctor's advice to eat less;pets that eat too much;junk food every day|overweight means too heavy; thin means having little fat|overweight 是超重的；thin 是瘦的|thin/Thin=thin means having little fat, not too heavy=thin 是瘦，不是太重;healthy/Healthy=healthy means well and fit, not too heavy in a bad way=healthy 是健康，不是超重|a bit overweight · overweight pets|over + weight, one word|over 加 weight，写成一个词
      skip|breakfast missed even once;one piano lesson missed;the gym just for today|to skip is to miss something once; to quit is to stop for good|skip 是跳过一次；quit 是彻底放弃|quit=to quit is to stop doing something for good, not to miss it once=quit 是彻底不做，不是跳过一次;enjoy/enjoyed=to enjoy is to like doing something, not to miss it=enjoy 是喜欢做，不是不做|skip breakfast · skip a lesson|double the p: *skipped, skipping*|双写 p：*skipped、skipping*
      regular|one break every hour;three times every week;every morning and every night|regular means at the same times each day or week; rare means not often|regular 是规律的；rare 是少见的|sudden=sudden means happening quickly with no warning, not at the same times each day=sudden 是突然的，不是在固定时间;rare=rare means not happening often, not at the same times each day=rare 是很少发生，不是在固定时间;rarely=rarely means not often, not three times a week or twice a day=rarely 是很少，不是每周三次或每天两次;suddenly=suddenly means quickly with no warning, not at the same times each week=suddenly 是突然，不是在每周固定的时间|regular breaks · exercise regularly|the adverb is *regularly*|副词是 *regularly*
      normal|a temperature with no fever;nerves that everyone feels before an exam;life after a holiday|normal means usual and expected; strange means unusual|normal 是正常的；strange 是奇怪的|high=a high temperature means a fever, not a usual one=high 的体温是发烧，不是正常的;strange=strange means unusual, not what everyone feels=strange 是不寻常的，不是人人都有的|back to normal · perfectly normal|*abnormal* means not normal|*abnormal* 是不正常的
      nap|an hour asleep in a chair after lunch;a sleep of twenty minutes;sleeping in the morning and afternoon|a nap is a short sleep in the day; a snack is a little food|nap 是小睡；snack 是零食|snack/snacks=a snack is food between meals, not a short sleep=snack 是两餐之间的食物，不是小睡;meal/meals=a meal is food like lunch, not sleep=meal 是午饭之类的饭，不是睡觉|have a nap · take a nap|we *have* or *take* a nap|说 *have* 或 *take* a nap
      meditation|eyes closed and feeling calm;sitting quietly every morning;sitting quietly and focusing on breathing|meditation is sitting quietly to relax; hygiene is keeping clean|meditation 是冥想；hygiene 是卫生|hygiene/Hygiene=hygiene is keeping clean, not sitting quietly to relax=hygiene 是保持清洁，不是静坐放松;nutrition/Nutrition=nutrition is the food you eat, not sitting quietly=nutrition 是吃的营养，不是静坐|do meditation · ten minutes of meditation|verb *meditate*|动词 *meditate*
      hygiene|handwashing that stops disease;basic handwashing;dirty kitchens in a restaurant|hygiene is keeping clean to stop disease; nutrition is about food|hygiene 是卫生；nutrition 是营养|nutrition=nutrition is about the food you eat, not about keeping clean=nutrition 说的是吃的东西，不是保持清洁;meditation=meditation is sitting quietly, not keeping clean=meditation 是静坐，不是保持清洁|good hygiene · poor hygiene|y said like *eye*: *HY-jeen*|y 读作 *eye*：*HY-jeen*
      quit|no cigarette since last year;sugar never eaten again;a job left for good|to quit is to stop for good; to skip is to miss once|quit 是戒掉、辞去；skip 是跳过一次|skip/skipped/skipping=to skip is to miss something once, not to stop it for good=skip 是跳过一次，不是彻底不做;start/started/starting=to start is to begin, the opposite of stopping=start 是开始，和停止相反|quit smoking · quit your job|past *quit*, the same as the present|过去式还是 *quit*
      awake|not sleeping at midnight;strong coffee at night;a baby heard playing|awake means not sleeping; asleep means sleeping|awake 是醒着；asleep 是睡着|asleep=asleep means sleeping, the opposite of awake=asleep 是睡着，和醒着相反;tired=tired means needing sleep, not being awake and active=tired 是需要睡觉，不是醒着在活动|still awake · stay awake|*awake* comes after the verb: the baby is awake|*awake* 放在动词后：the baby is awake
    `,
  },
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

/** condPeople are a person, the pronoun that stands for them, and whether the verb takes -s after them. */
const condPeople: readonly (readonly [string, string, boolean])[] = [
  ["Tom", "he", true],
  ["Anna", "she", true],
  ["my parents", "they", false],
  ["we", "we", false],
  ["you", "you", false],
  ["I", "I", false],
  ["my brother", "he", true],
  ["the children", "they", false],
];

/** condActs are a verb with -s, its base form and past, the rest of the if-clause, and the verb and rest of the result. */
const condActs: readonly (readonly [string, string, string, string, string, string])[] = [
  ["studies", "study", "studied", "hard", "pass", "the exam"],
  ["leaves", "leave", "left", "now", "catch", "the train"],
  ["misses", "miss", "missed", "the bus", "be", "late"],
  ["takes", "take", "took", "this medicine", "feel", "better soon"],
  ["hurries", "hurry", "hurried", "", "get", "there on time"],
  ["practices", "practice", "practiced", "every day", "win", "the race"],
  ["has", "have", "had", "time", "finish", "the project"],
  ["eats", "eat", "ate", "too much cake", "feel", "sick"],
  ["goes", "go", "went", "to bed late", "be", "tired tomorrow"],
  ["saves", "save", "saved", "some money", "buy", "a new bike"],
  ["forgets", "forget", "forgot", "the map", "get", "lost"],
  ["wins", "win", "won", "the match", "be", "very happy"],
  ["reads", "read", "read", "the instructions", "understand", "the game"],
];

/** condRows builds conditions for every person and act, with the name in the clause that comes first. */
const condRows = (nameFirstInIf: boolean) =>
  everyPair(condPeople, condActs).map(([[person, pronoun, s], [third, base, past, rest, rv, rr]]) => {
    const [ifSubject, resultSubject] = nameFirstInIf ? [person, pronoun] : [pronoun, person];
    return [ifSubject, s ? third : base, base, past, rest, resultSubject, rv, rr] as const;
  });

/** conditionsIfFirst and conditionsResultFirst are the conditions for sentences that start with the if-part or the result. */
const conditionsIfFirst = [...conditions, ...condRows(true)];
const conditionsResultFirst = [...conditions, ...condRows(false)];

const join = (...parts: readonly string[]) => parts.filter((p) => p !== "").join(" ");
const pronouns = new Set(["I", "you", "we", "they", "he", "she", "it"]);
/** willOf is the result's subject with will, or with 'll after a pronoun, as a pattern. */
const willOf = (subject: string, capital: boolean) => {
  const s = capital ? sentenceCase(subject) : subject;
  return pronouns.has(subject) ? `[${s} will|${s}'ll]` : `${s} will`;
};

const ifVerbChoice: readonly ChoiceItem[] = interleave([
  conditionsIfFirst.map(
    ([s, present, base, past, rest, rs, rv, rr]): ChoiceItem => [
      `${join("If", s, "___", rest)}, ${join(rs, "will", rv, rr)}.`,
      present,
      [`will ${base}`, past],
    ],
  ),
  conditionsResultFirst.map(
    ([s, present, base, past, rest, rs, rv, rr]): ChoiceItem => [
      `${join(sentenceCase(rs), "will", rv, rr, "if", s, "___", rest)}.`,
      present,
      [`will ${base}`, past],
    ],
  ),
]);

const resultChoice: readonly ChoiceItem[] = interleave([
  conditionsIfFirst.map(
    ([s, present, , , rest, rs, rv, rr]): ChoiceItem => [
      `${join("If", s, present, rest)}, ${join(rs, "___", rr)}.`,
      `will ${rv}`,
      [`would ${rv}`, `to ${rv}`],
    ],
  ),
  conditionsResultFirst.map(
    ([s, present, , , rest, rs, rv, rr]): ChoiceItem => [
      `${join(sentenceCase(rs), "___", rr, "if", s, present, rest)}.`,
      `will ${rv}`,
      [`would ${rv}`, `to ${rv}`],
    ],
  ),
]);

const conditionalTyped: readonly TypedItem[] = interleave([
  conditionsIfFirst.map(
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
  conditionsResultFirst.map(
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

/** ifPartWhy explains the present simple in the if-part of a first conditional. */
const ifPartWhy = (right: string, shown: string): Text => {
  const s = conditions.some(([, present, base]) => present === right && present !== base && right !== "is" && right !== "has");
  const rule = t(
    `The *if*-part is about the future but takes the present simple${s ? ", with *-s* after a subject like *he*, *she* or *it*" : ""}`,
    `*if* 部分虽然说的是将来，却用一般现在时${s ? "，主语是 he、she、it 一类时动词加 -s" : ""}`,
  );
  return t(
    `${rule.en}: ${fill(shown, right)}\n\n**Check.** Look inside the *if*-clause: there is no *will*, and *${right}* agrees with its subject in the present simple.`,
    `${rule["zh-CN"]}：${fill(shown, right)}\n\n**检验。** 检查 *if* 从句内部：没有 *will*，且 *${right}* 是与主语一致的一般现在时。`,
  );
};

/** whyNotIfPart explains will or the past simple in the if-part. */
const whyNotIfPart = (wrong: string, _right: string, _shown: string, position: number): Text =>
  position === 0
    ? t("*will* never goes inside the *if*-clause, even when talking about the future.", "*if* 从句即使说将来，也不能放 *will*。")
    : t(
        `*${wrong}* is the past simple, but a first conditional about a real future possibility uses the present simple after *if*.`,
        `*${wrong}* 是一般过去时，可谈将来真实可能性的第一条件句在 *if* 后要用一般现在时。`,
      );

/** resultWhy explains will and the base form in the result of a first conditional. */
const resultWhy = (right: string, shown: string): Text =>
  t(
    `The result of a real possibility in the future takes *will* and the base form: ${fill(shown, right)}\n\n**Check.** Verify the main result clause: *will* + plain verb (no *to*, and not *would*), matching the present simple in the *if*-clause.`,
    `将来真实可能情况的结果用 *will* 加动词原形：${fill(shown, right)}\n\n**检验。** 核对结果主句：*will* + 动词原形（不加 *to*，也不用 *would*），与 *if* 从句的一般现在时呼应。`,
  );

/** whyNotResult explains would or to in the result of a first conditional. */
const whyNotResult = (wrong: string, _right: string, _shown: string, position: number): Text =>
  position === 0
    ? t(
        "*would* is for an imaginary situation, not a real future possibility with *if* + present simple.",
        "*would* 用于假设想象的情况，不用于 *if* + 一般现在时表达的真实将来可能。",
      )
    : t(
        `*${wrong}* is missing *will* or puts *to* after *will*—the result clause needs *will* directly before the base verb.`,
        `*${wrong}* 少了 *will* 或在 *will* 后多加了 *to*——结果主句需要 *will* 直接接动词原形。`,
      );

/** condWriteWhy explains how a first conditional is put together, with the comma when the if-part comes first. */
const condWriteWhy = (right: string): Text =>
  right.startsWith("If ")
    ? t(
        `The *if*-part takes the present simple, then a comma, and the result takes *will* and the base form: ${right}\n\n**Check.** Verify all three marks: present simple after *If* (no *will*), a comma between the clauses, and *will/'ll* + base verb in the result.`,
        `*if* 部分用一般现在时，后面加逗号，结果部分用 *will* 加动词原形：${right}\n\n**检验。** 核对三处：*If* 从句用一般现在时（不加 *will*）、两句之间有逗号、结果主句用 *will/'ll* + 动词原形。`,
      )
    : t(
        `The result takes *will* and the base form, and the *if*-part after it takes the present simple, with no comma: ${right}\n\n**Check.** Verify all three marks: *will/'ll* + base verb first, no comma before *if*, and present simple after *if*.`,
        `结果部分用 *will* 加动词原形，后面的 *if* 部分用一般现在时，不加逗号：${right}\n\n**检验。** 核对三处：先写 *will/'ll* + 动词原形、*if* 前不加逗号、*if* 后用一般现在时。`,
      );

const firstConditional: TopicDef = {
  id: "first-conditional",
  title: t("If It Rains, We Will Stay", "如果下雨，我们就待在家（第一条件句）"),
  summary: t(
    "If you exercise, you will feel better. The if-part takes the present, the result takes will: not If you will exercise.",
    "If you exercise, you will feel better。if 部分用一般现在时，结果部分用 will：不能说 If you will exercise。",
  ),
  intro: t(
    "To link a real future condition to its result—*If you sleep eight hours, you will feel sharper tomorrow*—English uses the present simple after *if* and *will* in the result clause.",
    "连接将来真实可能发生的条件和结果时（*If you sleep eight hours, you will feel sharper tomorrow*），英语在 *if* 从句里用一般现在时，在结果主句里用 *will*。",
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
        "To talk about a real possibility in the future, use *if* + the **present simple**, and *will* in the result:\n\n- *If it **rains** tomorrow, we will stay at home.*\n- *We will stay at home if it **rains** tomorrow.*\n\nRemember the *-s* after *he*, *she* and *it*: *If she **studies** hard…*\n\n> **Watch out.** Never put *will* inside the *if*-clause (*If it will rain tomorrow* is wrong), even though the sentence talks about the future.",
        "说将来可能发生的事情时，用 *if* 加**一般现在时**，结果部分用 *will*：\n\n- *If it **rains** tomorrow, we will stay at home.*\n- *We will stay at home if it **rains** tomorrow.*\n\n主语是 *he*、*she*、*it* 时别忘了加 *-s*：*If she **studies** hard…*\n\n> **注意。** 中文“如果明天会下雨”里可以有“会”，但英语 *if* 从句里绝不能用 *will*（*If it will rain tomorrow* 是错的）。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), ifVerbChoice, ifPartWhy, whyNotIfPart),
    ),
    point(
      "result",
      t("Will in the result", "结果部分用 will"),
      t(
        "The result of a real possibility takes *will* + the base form: *If you exercise, you **will feel** better.* When the *if*-part comes first, put a comma after it; when the result comes first, there is no comma.\n\n> **Watch out.** Do not use *would* for a real future possibility, and never put *to* after *will* (*you will to feel* is wrong).",
        "真实可能情况的结果用 *will* 加动词原形：*If you exercise, you **will feel** better.* *if* 部分在前时，后面加逗号；结果在前时，不加逗号。\n\n> **注意。** 真实将来可能性不要用 *would*，也不要在 *will* 后面加 *to*（*you will to feel* 是错的）。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), resultChoice, resultWhy, whyNotResult),
    ),
    point(
      "write",
      t("Writing first conditionals", "写第一条件句"),
      t(
        "Write the sentence from the note. The arrow → means the *if*-part comes first: *if it rain tomorrow → we stay at home* becomes *If it rains tomorrow, we will stay at home.* The arrow ← means the result comes first: *We will stay at home if it rains tomorrow.* You may write *we'll* for *we will*.\n\n> **Watch out.** Check the comma rule (comma only when *If* starts the sentence) and add *-s* to third-person singular verbs inside the *if*-clause.",
        "根据笔记写句子。箭头 → 表示 *if* 部分在前：*if it rain tomorrow → we stay at home* 写成 *If it rains tomorrow, we will stay at home.* 箭头 ← 表示结果在前：*We will stay at home if it rains tomorrow.* 可以把 *we will* 写成 *we'll*。\n\n> **注意。** 留意逗号规则（只有 *If* 在句首时才加逗号），并给 *if* 从句里的第三人称单数动词加上 *-s*。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Write a first conditional sentence from the note.", "根据笔记写一个第一条件句。"),
        conditionalTyped,
        condWriteWhy,
        firstConditionalWriteNot,
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
