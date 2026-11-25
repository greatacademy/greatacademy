// B2, unit 3: Science, Ethics and Medicine. Medicine, the body inside, ethics, research methods, genetics, verbs of
// science, mental health, health systems, describing evidence, animals and people, and risk; modals of deduction about
// the present and the past, and should have. Its writing topic, introductions and conclusions, already exists.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { fill } from "../a2/kit.ts";
import { everyPair, vocabularyTopic, word } from "../words.ts";
import { modalsOfDeductionWriteNot, pastModalsWriteNot } from "./mistakes.ts";

const medicine = vocabularyTopic({
  id: "b2-words-medicine",
  title: t("Medicine", "医学"),
  summary: t(
    "Diagnosis; chronic and acute illness; epidemics and pandemics; contagious diseases; being immune and immunity; antibiotics and doses; transplants and donors.",
    "诊断；慢性病和急性病；流行病和大流行病；传染性疾病；免疫和免疫力；抗生素和剂量；移植和捐献者。",
  ),
  intro: t(
    "The doctor's **diagnosis** was clear: the illness was **contagious**, so Tom stayed home, took one **dose** of **antibiotics** every eight hours, and kept away from his grandmother. These words help you talk about illness, treatment and how diseases spread.",
    "医生的 **diagnosis**（诊断）很明确：这种病 **contagious**（会传染），所以汤姆待在家里，每八小时吃一 **dose**（剂）**antibiotics**（抗生素），并且不靠近奶奶。这些词帮你谈论疾病、治疗以及疾病如何传播。",
  ),
  prerequisites: ["b1-words-illness"],
  words: [
    word(
      "diagnosis",
      "the act of finding out what illness a person has",
      "诊断",
      "The doctor's {diagnosis} was a mild infection: that was what was making her ill. | An early {diagnosis} can save lives, because doctors find the illness before it spreads. | She is waiting for a {diagnosis} from the specialist to learn what is wrong with her.",
      "transplant dose",
    ),
    word(
      "chronic",
      "lasting for a long time, often for life (of an illness)",
      "慢性的；长期的",
      "She has suffered from {chronic} back pain for twenty years. | Diabetes is {chronic}: it lasts for life. | His cough is {chronic}, and he has had it for years.",
      "acute temporary",
      "acute",
    ),
    word(
      "acute",
      "sudden and serious (of an illness or pain); very great",
      "急性的；严重的",
      "She was rushed to hospital with {acute} pain that began suddenly an hour ago. | The {acute} phase of the illness lasts only a few days, but it is the most serious. | The shortage of nurses is {acute}: many hospitals have had to close wards this week.",
      "chronic mild",
      "chronic",
    ),
    word(
      "epidemic epidemics",
      "a large number of cases of a disease in one area at the same time",
      "流行病；（疾病的）流行",
      "A flu {epidemic} in one city closed its schools for a week. | {Epidemics} of cholera broke out in several towns along the river.|Pandemics Diagnoses | The {epidemic} spread quickly through the city, but it never left the country.",
      "pandemic diagnosis",
      "pandemic",
    ),
    word(
      "pandemic pandemics",
      "a disease that spreads across many countries of the world",
      "大流行病；全球流行病",
      "The {pandemic} of 2020 reached almost every country in the world. | Unlike a local outbreak, the {pandemic} affected people on every continent at once. | Governments must prepare for the next global {pandemic}.",
      "epidemic diagnosis",
      "epidemic",
    ),
    word(
      "contagious",
      "spreading from one person to another by touch or through the air",
      "传染性的；有感染力的",
      "Measles is highly {contagious}: one sick child can infect a whole class. | Stay at home while you are {contagious}, so you don't pass the illness on. | Her laughter was {contagious}: soon everyone was laughing.",
      "chronic immune",
    ),
    word(
      "immune",
      "not able to catch a disease; not affected by something",
      "免疫的；不受影响的",
      "After having the disease once, you are {immune} to it and cannot catch it again. | Your {immune} system fights the germs that make you ill. | Nobody is {immune} to criticism: it hurts everyone sometimes.",
      "contagious chronic",
    ),
    word(
      "immunity",
      "the body's ability not to catch a disease",
      "免疫力",
      "Vaccines give {immunity} against many diseases, so you do not catch them. | {Immunity} to the virus lasts about a year, and after that you can catch it again. | Some people have natural {immunity} to the illness and never get sick.",
      "diagnosis epidemic",
    ),
    word(
      "antibiotic antibiotics",
      "a medicine that kills bacteria",
      "抗生素",
      "The doctor gave me {antibiotics} to kill the bacteria causing the infection.|vaccines painkillers | {Antibiotics} kill bacteria but don't work against viruses.|Vaccines Painkillers | Take the {antibiotic} three times a day until the infection has cleared.",
      "vaccine painkiller",
    ),
    word(
      "dose doses",
      "the amount of a medicine that you take at one time",
      "剂量；一剂",
      "Don't take more than the recommended {dose} of this medicine. | A small {dose} of the drug, just one tablet, is enough. | She needs a second {dose} of the vaccine next month.",
      "diagnosis transplant",
    ),
    word(
      "transplant transplants",
      "an operation in which an organ is moved from one person's body into another's",
      "移植（手术）",
      "He had a heart {transplant} last year, and now he has a new heart. | She is waiting for a kidney {transplant} to replace her failing kidney. | In {transplants}, surgeons move an organ from one body into another.|donors doses",
      "donor dose",
    ),
    word(
      "donor donors",
      "a person who gives blood, an organ or money to help others",
      "捐献者；捐赠者",
      "A {donor} gave one of his kidneys to his sister. | Blood {donors} are always needed, so please give blood if you can.|patients transplants | The heart came from a young {donor} who died in a car crash.",
      "patient transplant",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Chronic* illness lasts a long time, while *acute* illness comes suddenly and is serious. Look for words such as *for twenty years*, *for life* or *suddenly an hour ago* that show how long it lasts.",
        "*chronic* 病持续很久，*acute* 病来得突然而且严重。找找 *for twenty years*、*for life* 或 *suddenly an hour ago* 这类词，看病持续多久。",
      ),
      meaning: t(
        "An *epidemic* stays in one area, while a *pandemic* spreads across many countries. Check whether the meaning is about one place or about the whole world.",
        "*epidemic* 局限在一个地区，*pandemic* 蔓延到许多国家。看释义说的是一个地方，还是全世界。",
      ),
      spell: t(
        "*Diagnosis* has gn in the middle; *contagious* ends in -gious; *immune* and *immunity* have a double m.",
        "*diagnosis* 中间是 gn；*contagious* 以 -gious 结尾；*immune* 和 *immunity* 都双写 m。",
      ),
    },
    notes: `
      diagnosis|naming the infection that made her ill;finding an illness before it spreads;learning what is wrong|a diagnosis is finding out what illness someone has; a dose is an amount of medicine|diagnosis 是诊断；dose 是剂量|transplant=a transplant is an operation that moves an organ, not naming an illness=transplant 是移植器官的手术，不是说出是什么病;dose=a dose is an amount of medicine, not finding out what is wrong=dose 是药的剂量，不是查出什么病|di · ag · no · sis|gn in the middle, and -sis at the end|中间是 gn，以 -sis 结尾
      chronic|back pain for twenty years;an illness that lasts for life;a cough of many years|chronic means lasting a long time; acute means sudden and serious|chronic 是慢性的；acute 是急性的|acute=acute means sudden, but this lasts for years or for life=acute 是突然的，而这里持续多年甚至一辈子;temporary=temporary means lasting a short time, the opposite of years or life=temporary 是短暂的，和多年、一辈子正相反|chron · ic|chr at the start, said "kr"|开头是 chr，读作 "kr"
      acute|pain that began an hour ago;a phase of only a few days;hospitals closing wards this week|acute means sudden and serious; chronic means lasting a long time|acute 是急性的、严重的；chronic 是慢性的|chronic=chronic means lasting a long time, but this began suddenly or lasts only days=chronic 是长期的，而这里来得突然或只持续几天;mild=mild means not serious, but here people are rushed to hospital and wards close=mild 是轻微的，而这里要急送医院、病房关闭|a · cute|a + cute|a + cute
      epidemic|schools closed in one city;cholera in towns along a river;a disease that never left the country|an epidemic stays in one area; a pandemic spreads across the world|epidemic 是地区性流行病；pandemic 是全球大流行|pandemic/pandemics=a pandemic spreads across many countries, but this stays in one city, one river or one country=pandemic 遍及许多国家，而这里只在一个城市、一条河沿岸或一个国家;diagnosis/diagnoses=a diagnosis is naming one person's illness, not many cases spreading=diagnosis 是诊断一个人的病，不是许多病例的传播|ep · i · dem · ic|epi + demic|epi + demic
      pandemic|2020 and almost every country;every continent at once;a global disease|a pandemic spreads across the world; an epidemic stays in one area|pandemic 是全球大流行；epidemic 是地区性流行病|epidemic=an epidemic stays in one area, but this reached every country and continent=epidemic 局限一个地区，而这里遍及每个国家、每个大洲;diagnosis=a diagnosis is naming one person's illness, not a disease spreading around the world=diagnosis 是诊断一个人的病，不是全球传播的疾病|pan · dem · ic|pan + demic, pan meaning "all"|pan + demic，pan 是"全部"
      contagious|one child infecting a class;staying home so the illness is not passed on;laughter that spreads|contagious means spreading from person to person; immune means unable to catch it|contagious 是会传染的；immune 是免疫的|chronic=chronic means lasting a long time, not spreading to others=chronic 是长期的，不是传给别人;immune=immune means you cannot catch a disease, but here it is passed on to others=immune 是不会得病，而这里病会传给别人|con · ta · gious|-gious at the end, as in *religious*|以 -gious 结尾，和 *religious* 一样
      immune|unable to catch a disease again;the system that fights germs;not hurt by criticism|immune means not able to catch or be affected; contagious means able to spread|immune 是免疫的；contagious 是传染的|contagious=contagious means spreading to others, but here you cannot catch it or are not affected=contagious 是会传给别人，而这里是不会得病、不受影响;chronic=chronic means lasting a long time, not protected from illness=chronic 是长期的，不是受到保护不得病|im · mune|a double m, and -une at the end|双写 m，以 -une 结尾
      immunity|what vaccines give against disease;protection that lasts a year;people who never get sick|immunity is the ability not to catch a disease; an epidemic is many cases of it|immunity 是免疫力；epidemic 是流行病|diagnosis=a diagnosis is naming an illness, not protection from catching it=diagnosis 是诊断，不是不得病的保护;epidemic=an epidemic is many people falling ill, the opposite of never getting sick=epidemic 是许多人得病，和不得病正相反|im · mu · ni · ty|immune drops its e and adds -ity|immune 去掉 e 加 -ity
      antibiotic|killing the bacteria of an infection;working on bacteria but not viruses;tablets until an infection clears|an antibiotic kills bacteria; a vaccine stops you catching a disease|antibiotic 是抗生素；vaccine 是疫苗|vaccine/vaccines=a vaccine prevents a disease before you catch it, not a medicine that kills bacteria in an infection=vaccine 是事先预防疾病，不是杀死感染细菌的药;painkiller/painkillers=a painkiller stops pain but does not kill bacteria=painkiller 能止痛，但不能杀死细菌|an · ti · bi · ot · ic|anti + bio + tic|anti + bio + tic
      dose|the amount you must not go over;one tablet;a second injection next month|a dose is the amount of medicine taken at one time; a diagnosis is naming an illness|dose 是剂量；diagnosis 是诊断|diagnosis=a diagnosis is naming an illness, not an amount of medicine=diagnosis 是诊断，不是药量;transplant=a transplant is an operation, not an amount of medicine=transplant 是手术，不是药量|dose|o-e, as in *close*, not *does*|o-e 的拼法，和 *close* 一样，不要写成 *does*
      transplant|a new heart;a new kidney for a failing one;surgeons moving an organ|a transplant is moving an organ into another body; a donor is the person who gives it|transplant 是移植手术；donor 是捐献者|donor/donors=a donor is a person who gives an organ, not the operation=donor 是捐献器官的人，不是手术;dose/doses=a dose is an amount of medicine, not an operation=dose 是药量，不是手术|trans · plant|trans + plant|trans + plant
      donor|a kidney given to a sister;people who give blood;a heart from someone who died|a donor gives blood or an organ; a patient receives treatment|donor 是捐献者；patient 是病人|patient/patients=a patient receives help, but a donor gives the kidney, the blood or the heart=patient 是接受治疗的人，而捐出肾、血或心脏的是 donor;transplant/transplants=a transplant is an operation, not a person who gives=transplant 是手术，不是捐献的人|do · nor|-or at the end, as in *doctor*|以 -or 结尾，和 *doctor* 一样
    `,
  },
});

const organs = vocabularyTopic({
  id: "b2-words-organs",
  title: t("Inside the Body", "身体内部"),
  summary: t(
    "Organs and tissue; the kidneys and the liver; the spine and the skeleton; arteries and veins; hormones; digesting, digestion and metabolism.",
    "器官和组织；肾和肝；脊柱和骨骼；动脉和静脉；激素；消化和新陈代谢。",
  ),
  intro: t(
    "In biology class we studied a model of the body: the **skeleton** holds it up, the **arteries** carry blood away from the heart, and the **liver** and **kidneys** clean the blood. These words help you talk about the parts inside your body and what they do.",
    "生物课上我们研究了一个人体模型：**skeleton**（骨骼）支撑身体，**arteries**（动脉）把血液从心脏送出去，**liver**（肝）和 **kidneys**（肾）净化血液。这些词帮你谈论身体内部的器官及其作用。",
  ),
  prerequisites: ["b1-words-body-and-mind"],
  words: [
    word(
      "organ organs",
      "a part of the body, such as the heart or the lungs, that has a special job",
      "器官",
      "The heart is the {organ} that pumps blood around the body. | The lungs are the {organs} you breathe with.|tissues hormones | Each {organ}, such as the liver or the brain, has its own job.",
      "tissue hormone",
    ),
    word(
      "tissue tissues",
      "the material that the parts of animals and plants are made of; a paper handkerchief",
      "组织；纸巾",
      "Muscle {tissue} is made of millions of tiny cells. | The doctor took a small piece of {tissue} from the skin for tests. | Have you got a {tissue}? My nose is running.",
      "organ hormone",
    ),
    word(
      "kidney kidneys",
      "one of the two organs that clean the blood and make urine",
      "肾；肾脏",
      "The {kidneys} clean the blood and make urine.|livers hearts | She gave one {kidney} to her brother and lives well with the other. | {Kidney} stones are small hard lumps that form where urine is made.",
      "liver heart",
    ),
    word(
      "liver livers",
      "the large organ that cleans poisons from the blood",
      "肝；肝脏",
      "Too much alcohol damages the {liver}, the organ that breaks down alcohol. | The {liver} is the largest organ inside the body. | The {liver} makes bile, which helps you digest fat.",
      "kidney heart",
    ),
    word(
      "spine spines",
      "the row of bones down the middle of your back",
      "脊柱；脊椎",
      "She hurt her {spine} in a fall and now has back pain. | The {spine} runs down the middle of your back and protects the nerves. | Sit up straight to protect your {spine} and your lower back.",
      "skeleton liver",
      "skeleton",
    ),
    word(
      "skeleton skeletons",
      "the frame of all the bones of a body",
      "骨骼；骨架",
      "The museum has a dinosaur {skeleton} with every bone in place. | The human {skeleton} has 206 bones. | The {skeleton} supports the whole body like a frame.",
      "spine liver",
      "spine",
    ),
    word(
      "artery arteries",
      "one of the tubes that carry blood from the heart to the rest of the body",
      "动脉",
      "The {arteries} carry blood away from the heart.|veins organs | Fatty food can block your {arteries}, so less blood leaves the heart.|veins organs | A main {artery} was cut in the accident, and bright red blood pumped out.",
      "vein organ",
      "vein",
    ),
    word(
      "vein veins",
      "one of the tubes that carry blood back to the heart",
      "静脉",
      "{Veins} carry blood back to the heart.|Arteries Organs | The nurse took blood from a small {vein} in her arm. | You can see the blue {veins} under the skin of her hands.|arteries organs",
      "artery organ",
      "artery",
    ),
    word(
      "hormone hormones",
      "a chemical made in the body that controls growth, mood or other processes",
      "激素；荷尔蒙",
      "Growth {hormones} are chemicals that help children grow.|organs tissues | Stress {hormones} rise in the blood when you are afraid.|organs tissues | Insulin is the {hormone} that controls the sugar in your blood.",
      "organ tissue",
    ),
    word(
      "digest digests digested digesting",
      "to break down food in the stomach so the body can use it; to understand new information slowly",
      "消化；领会",
      "Some people can't {digest} milk, so it makes them ill. | It takes hours to {digest} a big meal. | I need time to {digest} the news before I decide.",
      "swallow chew",
    ),
    word(
      "digestion",
      "the process of breaking down food in the body",
      "消化",
      "Fiber helps {digestion} by moving food through the stomach and gut. | Chewing your food slowly helps {digestion}. | {Digestion} begins in the mouth, where food is broken down.",
      "circulation breathing",
    ),
    word(
      "metabolism",
      "the chemical processes by which the body turns food into energy",
      "新陈代谢",
      "Exercise speeds up your {metabolism}, so you turn food into energy faster. | People with a fast {metabolism} burn energy quickly. | {Metabolism} slows down as we get older, so we burn fewer calories.",
      "digestion circulation",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Arteries* carry blood away from the heart, while *veins* carry it back. Look for words such as *away from*, *back to* or *bright red* that show the direction of the blood.",
        "*arteries* 把血液从心脏送出，*veins* 把血液送回心脏。找找 *away from*、*back to* 或 *bright red* 这类词，看血液流向哪里。",
      ),
      meaning: t(
        "The *spine* is the row of bones down your back, while the *skeleton* is the frame of all your bones. Check whether the meaning is about one line of bones or about all of them.",
        "*spine* 是背部中间的一列骨头，*skeleton* 是全身所有骨头组成的骨架。看释义说的是一列骨头，还是全部骨头。",
      ),
      spell: t(
        "*Kidney* ends in -ey; *tissue* has a double s; *hormone* has an h at the start and ends in -one.",
        "*kidney* 以 -ey 结尾；*tissue* 双写 s；*hormone* 以 h 开头，以 -one 结尾。",
      ),
    },
    notes: `
      organ|the heart pumping blood;the lungs you breathe with;the liver and brain with their own jobs|an organ is a body part with a special job; tissue is the material parts are made of|organ 是器官；tissue 是组织|tissue/tissues=tissue is the material body parts are made of, not a part with its own job=tissue 是构成器官的材料，不是有专门功能的部位;hormone/hormones=a hormone is a chemical, not a part that pumps or breathes=hormone 是化学物质，不是泵血或呼吸的部位|or · gan|-gan at the end, not *organize*|结尾是 -gan，不要写成 *organize*
      tissue|cells that make up muscle;a small piece of skin for tests;something for a running nose|tissue is the material body parts are made of, or a paper handkerchief; an organ is a part with a job|tissue 是组织或纸巾；organ 是器官|organ=an organ is a whole body part, not the material of muscle or skin, nor something for your nose=organ 是整个器官，不是肌肉或皮肤的材料，也不是擦鼻子的东西;hormone=a hormone is a chemical, not cells, skin or paper=hormone 是化学物质，不是细胞、皮肤或纸|tis · sue|a double s, and -ue at the end|双写 s，以 -ue 结尾
      kidney|cleaning blood and making urine;giving one and keeping the other;stones where urine is made|the kidneys clean blood and make urine; the liver breaks down poisons|kidney 是肾；liver 是肝|liver/livers=the liver cleans blood but does not make urine, and you have only one=liver 能净化血液但不产生尿，而且人只有一个肝;heart/hearts=the heart pumps blood, does not make urine, and you have only one=heart 负责泵血，不产生尿，人也只有一颗心|kid · ney|kid + ney, -ey at the end|kid + ney，以 -ey 结尾
      liver|the organ that breaks down alcohol;the largest organ inside the body;making bile to digest fat|the liver breaks down poisons and makes bile; the kidneys make urine|liver 是肝；kidney 是肾|kidney=the kidneys make urine, not bile, and they are not the largest organ=kidney 产生尿，不产生胆汁，也不是最大的器官;heart=the heart pumps blood, and does not break down alcohol or make bile=heart 负责泵血，不分解酒精，也不产生胆汁|liv · er|live + r|live + r
      spine|back pain after a fall;bones down the middle of the back;sitting up straight|the spine is the row of bones in your back; the skeleton is all your bones|spine 是脊柱；skeleton 是全身骨骼|skeleton=the skeleton is all your bones, not the one row down your back=skeleton 是全身骨头，不是背部那一列;liver=the liver is an organ in your belly, not bones in your back=liver 是腹部的器官，不是背部的骨头|spine|i-e, as in *line*|i-e 的拼法，和 *line* 一样
      skeleton|every bone of a dinosaur;206 bones;a frame for the whole body|the skeleton is the frame of all the bones; the spine is one part of it|skeleton 是全身骨骼；spine 是其中的脊柱|spine=the spine is one row of bones, not every bone or a frame for the whole body=spine 只是一列骨头，不是全部骨头或整个身体的框架;liver=the liver is an organ, not a frame of bones=liver 是器官，不是骨架|skel · e · ton|skel + e + ton|skel + e + ton
      artery|blood going away from the heart;fatty food and less blood leaving the heart;bright red blood pumping out|an artery carries blood away from the heart; a vein carries it back|artery 是动脉；vein 是静脉|vein/veins=veins carry blood back to the heart, not away from it or pumping out=vein 把血送回心脏，不是从心脏送出或喷出;organ/organs=an organ is a body part with a job, not a tube for blood=organ 是器官，不是血管|ar · ter · y|-ery at the end; plural -eries|以 -ery 结尾；复数是 -eries
      vein|blood going back to the heart;taking blood with a needle;blue lines under the skin|a vein carries blood back to the heart; an artery carries it away|vein 是静脉；artery 是动脉|artery/arteries=arteries carry blood away from the heart and lie deep, not blue lines near the skin=artery 把血从心脏送出，位置较深，不是皮肤下的蓝色线条;organ/organs=an organ is a body part with a job, not a tube for blood=organ 是器官，不是血管|vein|ei, as in *rein*, not *vain*|ei 的拼法，和 *rein* 一样，不要写成 *vain*
      hormone|chemicals that help children grow;chemicals in the blood when afraid;insulin controlling sugar|a hormone is a chemical that controls body processes; an organ is a body part|hormone 是激素；organ 是器官|organ/organs=an organ is a body part, not a chemical in the blood=organ 是器官，不是血液中的化学物质;tissue/tissues=tissue is the material body parts are made of, not a chemical that controls growth=tissue 是组织，不是控制生长的化学物质|hor · mone|h at the start and -one at the end|以 h 开头，以 -one 结尾
      digest|milk that makes some people ill;hours after a big meal;news to think about before deciding|to digest is to break down food or understand news; to swallow is to send food down the throat|digest 是消化、领会；swallow 是吞下|swallow=swallowing takes a moment, but this takes hours, and people can swallow milk=吞咽只要一瞬间，而这里需要几个小时，喝牛奶也能咽下去;chew=chewing happens in the mouth, not for hours, and you cannot chew news=咀嚼在嘴里进行，不需几个小时，消息也不能嚼|di · gest|di + gest|di + gest
      digestion|moving food through the stomach;chewing food slowly;breaking down food in the mouth|digestion is breaking down food; circulation is the movement of blood|digestion 是消化；circulation 是血液循环|circulation=circulation is blood moving around the body, not food being broken down=circulation 是血液循环，不是食物被分解;breathing=breathing moves air, not food=breathing 是呼吸空气，不是处理食物|di · ges · tion|digest + ion|digest + ion
      metabolism|turning food into energy faster;burning energy quickly;burning fewer calories with age|metabolism is turning food into energy; digestion is breaking food down|metabolism 是新陈代谢；digestion 是消化|digestion=digestion breaks food down, but this is about burning energy and calories=digestion 是分解食物，而这里说的是消耗能量和卡路里;circulation=circulation is blood moving around the body, not turning food into energy=circulation 是血液循环，不是把食物变成能量|me · tab · o · lism|-ism at the end, with one l|以 -ism 结尾，一个 l
    `,
  },
});

const ethics = vocabularyTopic({
  id: "b2-words-ethics",
  title: t("Ethics", "伦理"),
  summary: t(
    "Ethics and ethical questions; moral duties and morality; principles and dilemmas; justifying and justification; controversial issues and controversy; consent and dignity.",
    "伦理和伦理问题；道德责任和道德；原则和两难；辩护和理由；有争议的问题和争议；同意和尊严。",
  ),
  intro: t(
    "In our debate club we faced a real **dilemma**: is it **ethical** to test medicines on animals if it saves human lives? It was a **controversial** question, and everyone had to **justify** their view. These words help you talk about right and wrong.",
    "在辩论社，我们遇到了一个真正的 **dilemma**（两难）：如果能挽救人的生命，用动物做药物试验 **ethical**（合乎道德）吗？这是个 **controversial**（有争议的）问题，每个人都得 **justify**（论证）自己的观点。这些词帮你谈论是非对错。",
  ),
  prerequisites: ["b1-words-truth"],
  words: [
    word(
      "ethics",
      "the rules of right and wrong behavior, or their study",
      "伦理；道德准则",
      "Medical {ethics} are rules of right and wrong that protect patients. | She teaches business {ethics}: how companies should behave fairly. | The scandal raised questions about the company's {ethics} and honesty.",
      "consent dignity",
      "morality",
    ),
    word(
      "ethical",
      "about right and wrong; morally right",
      "伦理的；合乎道德的",
      "It is legal, but is it {ethical} to test drugs on animals? | We only buy from {ethical} companies: they treat workers fairly, even where the law does not require it. | Doctors face difficult {ethical} questions about what is right and wrong.",
      "legal medical",
      "moral",
    ),
    word(
      "moral",
      "about right and wrong behavior; the lesson that a story teaches",
      "道德的；寓意",
      "Parents teach children {moral} values such as honesty and kindness. | We have a {moral} duty to help, even if no law says we must. | It is a {moral} question, not a legal one: is it right?",
      "legal mortal",
      "ethical",
    ),
    word(
      "morality",
      "ideas about right and wrong behavior",
      "道德；道德观",
      "{Morality} is about right and wrong behavior. | They questioned the {morality} of the war: was it right to fight? | Religion has shaped people's {morality}, their ideas of right and wrong.",
      "mortality legality",
      "ethics",
    ),
    word(
      "principle principles",
      "a basic rule or belief that guides how you behave",
      "原则；原理",
      "It's against my {principles} to lie, so I always tell the truth.|principals dilemmas | The basic {principle} is simple: the patient always comes first. | She refused to pay on {principle}, because she believed the fee was unfair.",
      "principal dilemma",
    ),
    word(
      "dilemma dilemmas",
      "a situation in which you must make a difficult choice between two things",
      "两难境地；困境",
      "I'm in a {dilemma}: should I tell her the truth or keep her secret? | Doctors often face moral {dilemmas}, where every choice has a cost.|principles controversies | The {dilemma} is whether to save the money or spend it helping people.",
      "principle controversy",
    ),
    word(
      "justify justifies justified justifying",
      "to give a good reason for something",
      "证明……有理；为……辩护",
      "How can you {justify} spending so much money? Give me one good reason. | Nothing can {justify} violence: there is never a good enough reason for it. | The great results {justified} the risk we took.|condemned testified",
      "condemn testify",
    ),
    word(
      "justification justifications",
      "a good reason for doing something",
      "理由；正当理由",
      "There is no {justification} for cruelty: no reason can make it right. | What is the {justification} for the new tax? Why do we need it? | He gave a long {justification} of his decision, listing all his reasons.",
      "dilemma controversy",
    ),
    word(
      "controversial",
      "causing a lot of disagreement",
      "有争议的",
      "Gene editing is {controversial}: people argue fiercely about it. | The {controversial} law was changed after months of angry protests. | Her views are {controversial}: many people disagree with them.",
      "popular ethical",
    ),
    word(
      "controversy controversies",
      "a lot of public disagreement about something",
      "争议；争论",
      "The decision caused a lot of {controversy}, and people argued for weeks. | There is {controversy} over the new airport: some want it, others don't. | The film was at the center of a {controversy} that filled the newspapers.",
      "dilemma dignity",
    ),
    word(
      "consent consents consented consenting",
      "permission; to agree to let something happen",
      "同意；准许",
      "Doctors need your {consent} before an operation: you must say yes. | She {consented} to the treatment and signed the form.|refused objected | Photos of children need their parents' {consent} before they are shared.",
      "dignity principle",
    ),
    word(
      "dignity",
      "the quality of being respected and of respecting yourself",
      "尊严；庄重",
      "Every patient should be treated with {dignity} and respect. | She faced her illness with great {dignity}, never complaining. | Poverty can take away people's {dignity} and self-respect.",
      "consent principle",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Ethical* and *moral* are about right and wrong, while *legal* is about the law. Look for words such as *It is legal, but* or *no law says* that tell you the sentence is not about the law.",
        "*ethical* 和 *moral* 说的是对错，*legal* 说的是法律。找找 *It is legal, but* 或 *no law says* 这类词，它们说明句子讲的不是法律。",
      ),
      meaning: t(
        "A *dilemma* is a hard choice between two things, while a *controversy* is public disagreement among many people. Check whether the meaning is about one choice or about people arguing.",
        "*dilemma* 是两者之间的艰难抉择，*controversy* 是许多人公开争论。看释义说的是一个选择，还是人们的争论。",
      ),
      spell: t(
        "*Principle* (a rule) ends in -ple, unlike *principal*; *dilemma* has a double m; *controversial* has -sial.",
        "*principle*（原则）以 -ple 结尾，和 *principal* 不同；*dilemma* 双写 m；*controversial* 中是 -sial。",
      ),
    },
    notes: `
      ethics|rules that protect patients;how companies should behave fairly;a company's honesty|ethics are rules of right and wrong; consent is permission|ethics 是伦理准则；consent 是同意|consent=consent is permission, not a set of rules of right and wrong=consent 是许可，不是一套是非准则;dignity=dignity is being respected, not rules that tell you how to behave=dignity 是尊严，不是告诉你如何行事的准则|eth · ics|eth + ics, ending in s|eth + ics，以 s 结尾
      ethical|legal but maybe wrong;fair treatment the law does not require;questions of right and wrong|ethical means morally right; legal means allowed by the law|ethical 是合乎道德的；legal 是合法的|legal=legal is about the law, but the sentence says it is legal or the law does not require it=legal 说的是法律，而句子说已经合法或法律并不要求;medical=medical is about medicine, not about right and wrong=medical 是医学的，与是非无关|eth · i · cal|ethic + al|ethic + al
      moral|values such as honesty;a duty no law requires;a question that is not legal|moral means about right and wrong; legal means about the law|moral 是道德的；legal 是法律的|legal=legal is about the law, but here no law says it or it is not a legal question=legal 说的是法律，而这里没有法律规定，或说明不是法律问题;mortal=mortal means certain to die, not about right and wrong=mortal 是终有一死的，与是非无关|mor · al|one r and one l, not *morale*|一个 r、一个 l，不要写成 *morale*
      morality|right and wrong behavior;whether it was right to fight;ideas shaped by religion|morality is ideas about right and wrong; legality is whether something is allowed by law|morality 是道德；legality 是合法性|mortality=mortality is the number of deaths, not ideas of right and wrong=mortality 是死亡率，不是是非观念;legality=legality is whether the law allows something, not whether it is right=legality 是法律是否允许，不是对不对|mo · ral · i · ty|moral + ity, not *mortality*|moral + ity，不要写成 *mortality*
      principle|always telling the truth;the patient coming first;refusing an unfair fee|a principle is a rule you live by; a principal is the head of a school|principle 是原则；principal 是校长|principal/principals=a principal is the head of a school, not a rule you live by=principal 是校长，不是做人的原则;dilemma/dilemmas=a dilemma is a hard choice, not a rule that guides you=dilemma 是两难选择，不是指导你的规则|prin · ci · ple|-ple at the end for a rule|表示"原则"时以 -ple 结尾
      dilemma|truth or secret;choices that all have a cost;saving money or helping people|a dilemma is a hard choice between two things; a principle is a rule|dilemma 是两难；principle 是原则|principle/principles=a principle is a rule you follow, not a hard choice between two things=principle 是要遵守的规则，不是两者间的艰难抉择;controversy/controversies=a controversy is public argument among many people, not one person choosing=controversy 是许多人公开争论，不是一个人做选择|di · lem · ma|a double m before the final a|结尾 a 前双写 m
      justify|spending that needs a good reason;violence with no good enough reason;great results after a risk|to justify is to give a good reason for something; to condemn is to say it is wrong|justify 是证明有理；condemn 是谴责|condemn/condemned=condemn means to say something is wrong, the opposite of giving a good reason for it=condemn 是谴责，和为之提供理由正相反;testify/testified=testify means to tell a court what you saw, not to give a reason for something=testify 是在法庭作证，不是为某事提供理由|jus · ti · fy|justi + fy|justi + fy
      justification|no reason that makes cruelty right;why a tax is needed;a list of reasons for a decision|a justification is a good reason; a dilemma is a hard choice|justification 是理由；dilemma 是两难|dilemma=a dilemma is a hard choice, not a reason that makes something right=dilemma 是艰难抉择，不是让事情说得通的理由;controversy=a controversy is public argument, not a list of reasons=controversy 是公开争论，不是一串理由|jus · ti · fi · ca · tion|justify changes its y to i before -cation|justify 的 y 变 i 再加 -cation
      controversial|people arguing fiercely;a law changed after protests;views many disagree with|controversial means causing disagreement; popular means liked by many|controversial 是有争议的；popular 是受欢迎的|popular=popular means liked by many, but here people argue, protest and disagree=popular 是受很多人喜欢，而这里人们争论、抗议、反对;ethical=ethical means morally right, which says nothing about people arguing=ethical 是合乎道德的，与人们是否争论无关|con · tro · ver · sial|-sial at the end, said "shul"|结尾是 -sial，读作 "shul"
      controversy|weeks of arguing;some wanting an airport and others not;stories filling the newspapers|a controversy is public disagreement; a dilemma is one hard choice|controversy 是争议；dilemma 是两难|dilemma=a dilemma is one person's hard choice, not weeks of public argument=dilemma 是一个人的艰难抉择，不是长时间的公开争论;dignity=dignity is being respected, not people arguing=dignity 是尊严，不是人们争论|con · tro · ver · sy|-sy at the end, with s|以 -sy 结尾，是 s
      consent|saying yes before an operation;signing a form for treatment;parents agreeing before photos are shared|consent is permission; dignity is respect|consent 是同意；dignity 是尊严|dignity=dignity is being respected, not saying yes to something=dignity 是尊严，不是答应某事;principle=a principle is a rule you live by, not permission for one thing=principle 是做人的原则，不是对某件事的许可;refuse/refused=refuse means to say no, but she signed the form=refuse 是拒绝，而她签了字;object/objected=object means to say you are against something, but she signed the form=object 是表示反对，而她签了字|con · sent|con + sent, not *content*|con + sent，不要写成 *content*
      dignity|patients treated with respect;an illness faced without complaining;self-respect taken by poverty|dignity is being respected and respecting yourself; consent is permission|dignity 是尊严；consent 是同意|consent=consent is permission, not respect for yourself=consent 是许可，不是自尊;principle=a principle is a rule, not the respect a person deserves=principle 是原则，不是人应得的尊重|dig · ni · ty|dign + ity|dign + ity
    `,
  },
});

const methods = vocabularyTopic({
  id: "b2-words-research-2",
  title: t("Research Methods", "研究方法"),
  summary: t(
    "Clinical trials and placebos; variables; statistics and statistical analysis; correlation; replicating and verifying results; methodology; valid results and bias.",
    "临床试验和安慰剂；变量；统计数据和统计分析；相关性；重复和验证结果；方法论；有效的结果和偏差。",
  ),
  intro: t(
    "In the **clinical** **trial**, half the patients took the new drug and half took a **placebo**. Then the team used **statistical** tests to see whether the drug really worked. These words help you talk about how scientists test ideas and trust their results.",
    "在这次 **clinical**（临床）**trial**（试验）中，一半病人服用新药，另一半服用 **placebo**（安慰剂）。然后团队用 **statistical**（统计的）检验来看药是否真的有效。这些词帮你谈论科学家如何检验想法、判断结果是否可信。",
  ),
  prerequisites: ["b1-words-research"],
  words: [
    word(
      "clinical",
      "about the treatment of patients and the testing of medicines on people",
      "临床的",
      "The new drug is now in {clinical} trials, where it is tested on real patients. | She works as a {clinical} psychologist, treating patients in a hospital. | In {clinical} trials, doctors give the new medicine to patients and watch the effects.",
      "cynical valid",
    ),
    word(
      "trial trials",
      "a test of how well something works or how safe it is; the process of judging a case in court",
      "试验；审判",
      "The new vaccine is being tested in a {trial} with 3,000 volunteers. | The murder {trial} lasted three weeks, and the jury found him guilty. | In the {trial}, half the patients got the real drug.",
      "placebo variable",
    ),
    word(
      "placebo placebos",
      "a pill or treatment with no medicine in it, used to compare with a real drug",
      "安慰剂",
      "Half the patients were given a {placebo}, a pill with no medicine in it. | A {placebo} looks like a real pill but contains no drug. | Some patients felt better even on the {placebo}, though it had no medicine in it.",
      "trial variable",
    ),
    word(
      "variable variables",
      "a thing that can change in an experiment or a situation",
      "变量；可变因素",
      "Temperature is an important {variable} in the experiment, because changing it changes the result. | In a fair test, change only one {variable} at a time and keep the rest the same. | There are too many changing {variables} to predict the result.|statistics placebos",
      "statistic placebo",
    ),
    word(
      "statistic statistics",
      "a number that describes a fact; the science of collecting and studying numbers",
      "统计数据；统计学",
      "{Statistics} show that crime has fallen by ten percent.|Variables Placebos | Here is one shocking {statistic}: a child dies every minute. | She studies {statistics} at university, collecting and analyzing numbers.|variables placebos",
      "variable placebo",
    ),
    word(
      "statistical",
      "using numbers and statistics",
      "统计的；统计学的",
      "The {statistical} analysis of all the numbers took months. | There is no {statistical} difference between the groups: the numbers are almost the same. | We used {statistical} methods, such as averages, to test the results.",
      "clinical valid",
    ),
    word(
      "correlation correlations",
      "a connection between two things, where one changes as the other changes",
      "相关性；关联",
      "There is a {correlation} between smoking and cancer: smokers get it more often. | A {correlation} does not prove that one thing causes another. | The study found a strong {correlation}: as one number rose, so did the other.",
      "variable bias",
    ),
    word(
      "replicate replicates replicated replicating",
      "to do an experiment again and get the same result; to copy exactly",
      "重复（实验）；复制",
      "Other scientists did the experiment again but could not {replicate} the results. | The experiment was {replicated} in three countries, with the same result.|replaced reciprocated | To be trusted, a study must be {replicated} by other teams.|replaced reciprocated",
      "replace reciprocate",
    ),
    word(
      "verify verifies verified verifying",
      "to check that something is true or correct",
      "核实；证实",
      "Please {verify} your email address by clicking the link. | The police checked and {verified} his story: every detail was true.|varied denied | Scientists must {verify} their results before they publish them.",
      "vary deny",
    ),
    word(
      "methodology methodologies",
      "the set of methods used in a study",
      "方法论；研究方法",
      "The {methodology} of the study was weak: the sample was too small. | Explain your {methodology} in the report: how did you collect your data? | Critics questioned the research {methodology}, saying the methods were unfair.",
      "mythology meteorology",
    ),
    word(
      "valid",
      "based on good reasons or facts; legally acceptable for a period of time",
      "有效的；合理的",
      "Your ticket is {valid} for one month, so you can use it until June. | Your point is {valid}: it is based on good reasons, and I agree with it. | The results are not {valid} because the sample was too small.",
      "invalid biased",
    ),
    word(
      "bias biases",
      "an unfair preference for or against one person, group or result",
      "偏见；偏差",
      "The judge was accused of {bias}: he seemed to favor one side. | Newspapers often show political {bias}, always supporting one party. | The study had a {bias} toward younger patients, so older people were left out.",
      "variable correlation",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "A *placebo* is a pill with no medicine in it, while a *trial* is the whole test. Look for words such as *no medicine in it*, *3,000 volunteers* or *the jury* that show whether the gap is the pill or the test.",
        "*placebo* 是不含药物的药片，*trial* 是整个试验。找找 *no medicine in it*、*3,000 volunteers* 或 *the jury* 这类词，看空格是那颗药片，还是整个试验。",
      ),
      meaning: t(
        "To *replicate* is to do an experiment again and get the same result, while to *verify* is to check that something is true. Check whether the meaning is about repeating or about checking.",
        "*replicate* 是重做实验并得到同样结果，*verify* 是核实某事是否属实。看释义说的是重复，还是核实。",
      ),
      spell: t(
        "*Methodology* is method + ology; *placebo* ends in -bo; *statistical* has three t's: s · ta · tis · ti · cal.",
        "*methodology* 是 method + ology；*placebo* 以 -bo 结尾；*statistical* 有三个 t：s · ta · tis · ti · cal。",
      ),
    },
    notes: `
      clinical|trials on real patients;a psychologist in a hospital;medicine given to patients|clinical means about treating patients; cynical means expecting the worst of people|clinical 是临床的；cynical 是愤世嫉俗的|cynical=cynical means believing people act only for themselves, not about treating patients=cynical 是认为人都自私，与治疗病人无关;valid=valid means based on good reasons, not about treating patients=valid 是有道理的，与治疗病人无关|clin · i · cal|clinic + al|clinic + al
      trial|a vaccine tested on volunteers;a murder case with a jury;patients split into two groups|a trial is a test or a court case; a placebo is a pill with no medicine|trial 是试验或审判；placebo 是安慰剂|placebo=a placebo is one pill with no medicine, not a test of thousands of people or a court case=placebo 是一颗不含药的药片，不是对数千人的试验，也不是案件审理;variable=a variable is one thing that can change, not a whole test or a court case=variable 是一个可变因素，不是整个试验或审判|tri · al|-al at the end, not *trail*|结尾是 -al，不要写成 *trail*
      placebo|a pill given to half the patients;something that looks like a pill but has no drug;feeling better with no medicine|a placebo is a pill with no medicine; a trial is the whole test|placebo 是安慰剂；trial 是试验|trial=a trial is the whole test, not a pill with no medicine in it=trial 是整个试验，不是不含药的药片;variable=a variable is something that changes in a test, not a pill=variable 是试验中的可变因素，不是药片|pla · ce · bo|c that sounds like s, and -bo at the end|c 读作 s，以 -bo 结尾
      variable|temperature that changes the result;one thing changed at a time;too many changing things|a variable is something that can change in an experiment; a statistic is a number that describes a fact|variable 是变量；statistic 是统计数字|statistic/statistics=a statistic is a number that describes a fact, not a thing you change in a test=statistic 是描述事实的数字，不是试验中改变的因素;placebo/placebos=a placebo is a pill with no medicine, not something that changes the result=placebo 是不含药的药片，不是影响结果的因素|var · i · a · ble|vary changes its y to i before -able|vary 的 y 变 i 再加 -able
      statistic|numbers showing crime has fallen;a shocking fact about children;a university subject about numbers|a statistic is a number that describes a fact; a variable is something that changes|statistic 是统计数字；variable 是变量|variable/variables=a variable is a thing that changes in a test, not a number that shows a fact=variable 是试验中会变的因素，不是表示事实的数字;placebo/placebos=a placebo is a pill with no medicine, not a number or a subject=placebo 是不含药的药片，不是数字或学科|sta · tis · tic|t, then s, then t again: sta · tis · tic|t、s、t 交替：sta · tis · tic
      statistical|months of work on numbers;groups with nearly the same numbers;methods such as averages|statistical means using numbers; clinical means about treating patients|statistical 是统计的；clinical 是临床的|clinical=clinical is about treating patients, not about working with numbers=clinical 是关于治疗病人的，不是处理数字;valid=valid means based on good reasons, not a kind of work with numbers=valid 是有道理的，不是一种处理数字的工作|sta · tis · ti · cal|statistic + al|statistic + al
      correlation|smokers getting cancer more often;a link that does not prove a cause;two numbers rising together|a correlation is a connection between two things; a variable is one thing that changes|correlation 是相关性；variable 是变量|variable=a variable is one thing that changes, not a link between two things=variable 是一个可变因素，不是两者之间的联系;bias=bias is an unfair preference, not a link between two numbers=bias 是不公平的偏向，不是两个数字间的联系|cor · re · la · tion|cor + relation, so a double r|cor + relation，所以双写 r
      replicate|an experiment done again;the same result in three countries;a study repeated by other teams|to replicate is to repeat an experiment and get the same result; to replace is to put something new in its place|replicate 是重复实验；replace 是替换|replace/replaced=replace means to put something new in place of something, not to repeat an experiment=replace 是用新的东西替换，不是重复实验;reciprocate/reciprocated=reciprocate means to do the same in return for kindness, not to repeat an experiment=reciprocate 是回报对方的好意，不是重复实验|rep · li · cate|repli + cate|repli + cate
      verify|clicking a link to check an email;a story with every detail true;results checked before publishing|to verify is to check that something is true; to vary is to change|verify 是核实；vary 是变化|vary/varied=vary means to change, not to check that something is true=vary 是变化，不是核实;deny/denied=deny means to say something is not true, but every detail was true and things are being checked=deny 是否认，而这里每个细节都属实，是在核实|ver · i · fy|veri + fy|veri + fy
      methodology|a study with too small a sample;how the data was collected;methods called unfair|methodology is the set of methods in a study; mythology is a set of old stories|methodology 是研究方法；mythology 是神话|mythology=mythology is old stories about gods, not the methods of a study=mythology 是关于神的古老故事，不是研究方法;meteorology=meteorology is the study of weather, not the methods of one study=meteorology 是气象学，不是某项研究的方法|meth · od · ol · o · gy|method + ology|method + ology
      valid|a ticket you can use until June;a point you agree with;results from a sample too small|valid means based on good reasons or acceptable; invalid means not acceptable|valid 是有效的；invalid 是无效的|invalid=invalid means not acceptable, but you can use the ticket and agree with the point=invalid 是无效的，而车票能用、观点被认同;biased=biased means unfairly favoring one side, which a ticket or a good reason is not=biased 是有偏见的，车票和好理由都谈不上偏见|val · id|val + id, one l|val + id，一个 l
      bias|a judge favoring one side;newspapers always supporting one party;older people left out of a study|bias is an unfair preference; a correlation is a link between two things|bias 是偏见；correlation 是相关性|variable=a variable is a thing that changes in a test, not an unfair preference=variable 是可变因素，不是不公平的偏向;correlation=a correlation is a link between two numbers, not favoring one side=correlation 是两个数字之间的联系，不是偏向一方|bi · as|bi + as, not *basis*|bi + as，不要写成 *basis*
    `,
  },
});

const genetics = vocabularyTopic({
  id: "b2-words-genetics",
  title: t("Genetics and Life", "遗传学与生命"),
  summary: t(
    "Genetic tests and DNA; inheriting traits; mutations; organisms, bacteria and microbes; cloning; embryos; breeding; biological parents.",
    "基因检测和 DNA；遗传特征；突变；生物、细菌和微生物；克隆；胚胎；繁殖；亲生父母。",
  ),
  intro: t(
    "Mia has her father's curly hair: she **inherited** it through her **DNA**. In science class she learned that a single **mutation** can change a **trait**, and that even tiny **bacteria** pass on their genes. These words help you talk about genes and living things.",
    "米娅有一头和爸爸一样的卷发：她是通过 **DNA** **inherited**（遗传）来的。科学课上她学到，一次 **mutation**（突变）就能改变一个 **trait**（特征），连微小的 **bacteria**（细菌）也会传递基因。这些词帮你谈论基因和生物。",
  ),
  prerequisites: ["b1-words-science"],
  words: [
    word(
      "genetic",
      "about genes, the parts of cells that pass qualities from parents to children",
      "基因的；遗传的",
      "Eye color is {genetic}: you get it from your parents' genes. | The disease is caused by a {genetic} fault that runs in families. | {Genetic} tests look at your genes to show your risk of disease.",
      "generic clinical",
    ),
    word(
      "DNA",
      "the chemical in cells that carries genetic information",
      "DNA；脱氧核糖核酸",
      "The police found his {DNA} on a cup at the scene. | {DNA} is the chemical in our cells that carries genetic information. | A {DNA} test showed that the two men were brothers.",
      "trait microbe",
    ),
    word(
      "inherit inherits inherited inheriting",
      "to get a quality from your parents through your genes; to receive money or property from someone who has died",
      "遗传；继承",
      "She {inherited} her blue eyes from her mother.|bred cloned | He {inherited} a house from his uncle when the old man died.|bred cloned | We {inherit} half our genes from each parent.",
      "breed clone",
    ),
    word(
      "mutation mutations",
      "a change in the genes of a living thing",
      "突变；变异",
      "A change called a {mutation} in one gene can cause disease. | The virus has developed new {mutations} that change how it spreads.|traits organisms | Most {mutations} are harmless, though they change the genes.|traits organisms",
      "trait organism",
    ),
    word(
      "organism organisms",
      "a living thing, such as a plant, an animal or a bacterium",
      "生物；有机体",
      "Bacteria are tiny {organisms}: living things too small to see.|traits mutations | Every living {organism}, from a tree to a whale, needs energy. | A virus is not really a living {organism}, because it cannot grow on its own.",
      "trait mutation",
    ),
    word(
      "bacteria",
      "very small living things, some of which cause disease",
      "细菌",
      "{Bacteria} in a cut can cause an infection. | Wash your hands to remove {bacteria}. | Some {bacteria} in your stomach help you digest food.",
      "embryos traits",
      "microbe",
    ),
    word(
      "microbe microbes",
      "a living thing that is too small to see without a microscope",
      "微生物",
      "{Microbes} are living things too small to see without a microscope.|Mutations Traits | The soil is full of {microbes} that break down dead leaves.|mutations traits | This {microbe} lives in hot springs.",
      "mutation trait",
      "bacteria",
    ),
    word(
      "clone clones cloned cloning",
      "to make an exact genetic copy of a plant or an animal; such a copy",
      "克隆；无性繁殖",
      "Scientists {cloned} a sheep called Dolly, making an exact genetic copy.|bred inherited | It is now possible to {clone} a pet: the copy is identical to the original. | {Cloning} a human, making an exact genetic copy, is illegal in most countries.|Breeding Inheriting",
      "breed inherit",
    ),
    word(
      "embryo embryos",
      "an animal or a human in the earliest stage of growing inside its mother or an egg",
      "胚胎",
      "The {embryo} grows inside its mother in the first weeks of life. | Scientists studied the {embryos} of mice in their earliest stage.|organisms microbes | At eight weeks, the human {embryo} is about two centimeters long.",
      "organism microbe",
    ),
    word(
      "breed breeds bred breeding",
      "to keep animals so that they produce young; (of animals) to have young; a type of animal",
      "繁殖；饲养；品种",
      "Birds {breed} in the spring, when there is plenty of food for their young. | Pandas rarely {breed} in zoos, so there are few baby pandas. | The farmer {breeds} sheep so that they have lambs to sell.|inherits clones",
      "inherit clone",
    ),
    word(
      "trait traits",
      "a particular quality in someone's character or body",
      "特征；特点",
      "Kindness is her best {trait}. | Some {traits}, such as eye color, are passed from parents to children.|mutations organisms | Curiosity is a common {trait} among scientists.",
      "mutation organism",
    ),
    word(
      "biological",
      "about living things; related by birth",
      "生物的；亲生的",
      "She is his {biological} mother: she gave birth to him. | {Biological} weapons use germs to make people ill. | Sleep is a {biological} need, like food and water.",
      "chemical ecological",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Bacteria* and *microbes* are tiny living things, while a *trait* is a quality and an *embryo* is a baby in its earliest stage. Look for words such as *infection*, *wash your hands* or *digest food* that show the gap is a living thing.",
        "*bacteria* 和 *microbes* 是微小的生物，*trait* 是特征，*embryo* 是最早期的胎儿。找找 *infection*、*wash your hands* 或 *digest food* 这类词，判断空格是不是一种生物。",
      ),
      meaning: t(
        "To *inherit* is to get a quality or property from someone else, while to *breed* is to have young or keep animals so they have young. Check whether the meaning is about receiving or about producing young.",
        "*inherit* 是从别人那里得到特征或财产，*breed* 是生育或饲养动物让它们繁殖。看释义说的是得到，还是繁殖后代。",
      ),
      spell: t(
        "*Bacteria* ends in -ia, and one is a *bacterium*; *embryo* has a y; *genetic* has one n and one t.",
        "*bacteria* 以 -ia 结尾，单数是 *bacterium*；*embryo* 里有 y；*genetic* 一个 n、一个 t。",
      ),
    },
    notes: `
      genetic|eye color from parents;a fault that runs in families;tests that look at genes|genetic means about genes; generic means general, not a brand|genetic 是基因的；generic 是通用的|generic=generic means general or without a brand name, not about genes=generic 是通用的、无品牌的，与基因无关;clinical=clinical is about treating patients, not passed on through families=clinical 是临床的，不是家族遗传的|ge · net · ic|gene + tic|gene + tic
      DNA|a trace left on a cup;the chemical that carries genetic information;a test showing two men are brothers|DNA is the chemical that carries genes; a trait is a quality it can cause|DNA 是脱氧核糖核酸；trait 是特征|trait=a trait is a quality such as kindness, not a chemical left on a cup or tested=trait 是像善良这样的特征，不是留在杯子上或能检测的化学物质;microbe=a microbe is a tiny living thing, not the chemical that carries genes=microbe 是微生物，不是携带基因的化学物质|D · N · A|three capital letters, said one by one|三个大写字母，逐个读
      inherit|blue eyes from a mother;a house from an uncle who died;half our genes from each parent|to inherit is to receive from parents or from someone who died; to breed is to have young|inherit 是遗传、继承；breed 是繁殖|breed/bred=breed means to have young or keep animals, not to receive eyes or a house=breed 是繁殖或饲养，不是得到眼睛或房子;clone/cloned=clone means to make a genetic copy, not to receive something from a parent or an uncle=clone 是克隆，不是从父母或叔叔那里得到|in · her · it|in + herit, ending in -it|in + herit，以 -it 结尾
      mutation|a change in one gene;new changes in a virus;harmless changes to genes|a mutation is a change in genes; a trait is a quality|mutation 是突变；trait 是特征|trait/traits=a trait is a quality you have, not a change in a gene=trait 是一个人具有的特征，不是基因的改变;organism/organisms=an organism is a living thing, not a change inside one=organism 是生物，不是生物体内的变化|mu · ta · tion|mute drops its e and adds -ation|mute 去掉 e 加 -ation
      organism|bacteria as tiny living things;everything from a tree to a whale;a virus that cannot grow alone|an organism is a living thing; a trait is a quality of one|organism 是生物；trait 是特征|trait/traits=a trait is a quality, not a living thing=trait 是特征，不是生物;mutation/mutations=a mutation is a change in genes, not a whole living thing=mutation 是基因变化，不是整个生物|or · gan · ism|organ + ism|organ + ism
      bacteria|infection in a cut;washing your hands;help with digesting food|bacteria are tiny living things; traits are qualities|bacteria 是细菌；traits 是特征|embryos=embryos are babies in their earliest stage, not living things in cuts, on hands or in your stomach=embryos 是早期胚胎，不在伤口、手上或胃里;traits=traits are qualities, which cannot cause infection or be washed away=traits 是特征，不会引起感染，也洗不掉|bac · te · ri · a|-ia at the end; one is a *bacterium*|以 -ia 结尾；单数是 *bacterium*
      microbe|living things too small to see;soil that breaks down leaves;life in hot springs|a microbe is a tiny living thing; a mutation is a change in genes|microbe 是微生物；mutation 是突变|mutation/mutations=a mutation is a change in genes, not a living thing in soil or hot springs=mutation 是基因变化，不是生活在土壤或温泉里的生物;trait/traits=a trait is a quality, not a living thing=trait 是特征，不是生物|mi · crobe|micro + be, said "my-krobe"|micro + be，读作 "my-krobe"
      clone|Dolly the sheep;a pet copied exactly;an exact copy of a human|to clone is to make an exact genetic copy; to breed is to have young|clone 是克隆；breed 是繁殖|breed/bred/Breeding=breeding makes new young that are not exact copies=繁殖产生的后代不是完全相同的复制品;inherit/inherited/Inheriting=inherit means to receive something from a parent, not to make a copy=inherit 是从父母那里得到，不是复制|clone|o-e, as in *phone*|o-e 的拼法，和 *phone* 一样
      embryo|the first weeks of life inside a mother;mice in their earliest stage;two centimeters at eight weeks|an embryo is a baby animal in its earliest stage; an organism is any living thing|embryo 是胚胎；organism 是生物|organism/organisms=an organism is any living thing, not one in its earliest stage inside a mother=organism 是任何生物，不特指母体内最早期的生命;microbe/microbes=a microbe is a tiny living thing, not a baby growing inside its mother=microbe 是微生物，不是母体内成长的胎儿|em · bry · o|bry with a y, and -o at the end|bry 里是 y，以 -o 结尾
      breed|birds having young in spring;pandas rarely having babies;sheep kept to have lambs|to breed is to have young or keep animals so they have young; to inherit is to receive|breed 是繁殖；inherit 是遗传|inherit/inherits=inherit means to receive from a parent, not to have young=inherit 是从父母那里得到，不是生育后代;clone/clones=clone means to make an exact copy, not to have young in the usual way=clone 是复制，不是正常生育后代|breed|ee, then d, not *bread*|ee 加 d，不要写成 *bread*
      trait|kindness as a quality;eye color passed to children;curiosity in scientists|a trait is a quality; a mutation is a change in genes|trait 是特征；mutation 是突变|mutation/mutations=a mutation is a change in a gene, not a quality such as kindness or eye color=mutation 是基因变化，不是善良或眼睛颜色这样的特征;organism/organisms=an organism is a living thing, not a quality of one=organism 是生物，不是生物的特征|trait|ai, then t, not *treat*|ai 加 t，不要写成 *treat*
      biological|the mother who gave birth;weapons that use germs;a need like food and water|biological means about living things or related by birth; chemical means about chemicals|biological 是生物的、亲生的；chemical 是化学的|chemical=chemical is about chemicals, not about birth or germs=chemical 是化学的，与出生或细菌无关;ecological=ecological is about plants, animals and their environment, not about birth or a body's needs=ecological 是生态的，与出生或身体需求无关|bi · o · log · i · cal|bio + logical|bio + logical
    `,
  },
});

const scienceVerbs = vocabularyTopic({
  id: "b2-words-science-verbs",
  title: t("Verbs of Science", "科学动词"),
  summary: t(
    "Demonstrating and illustrating; determining and indicating; revealing, confirming and establishing; assessing, identifying and detecting; monitoring and simulating.",
    "展示和说明；确定和表明；揭示、证实和确立；评估、识别和检测；监测和模拟。",
  ),
  intro: t(
    "First the lab team **identified** the bacteria in the water, then they **monitored** it for a month, and finally their results **confirmed** what they had suspected. These words help you describe what scientists do and what their results show.",
    "实验室团队先 **identified**（识别出）水里的细菌，然后 **monitored**（监测）了一个月，最后结果 **confirmed**（证实）了他们的猜测。这些词帮你描述科学家做什么，以及他们的结果说明了什么。",
  ),
  prerequisites: ["b1-words-research"],
  words: [
    word(
      "demonstrate demonstrates demonstrated demonstrating",
      "to show clearly that something is true; to show how something works; to march in protest",
      "证明；演示；示威",
      "The teacher {demonstrated} how to use the microscope, step by step.|simulated detected | Thousands of people {demonstrated} against the war in the streets.|simulated detected | The results {demonstrate} that the drug works.",
      "simulate detect",
      "illustrate",
    ),
    word(
      "illustrate illustrates illustrated illustrating",
      "to explain something with an example; to add pictures to a book",
      "说明；配插图",
      "The book is {illustrated} with photos on every page.|monitored simulated | This example {illustrates} the problem clearly.|monitors simulates | Let me {illustrate} my point with a story.",
      "monitor simulate",
      "demonstrate",
    ),
    word(
      "determine determines determined determining",
      "to find out the facts about something; to decide or control what happens",
      "确定；决定",
      "Tests will {determine} the cause of death. | Your genes partly {determine} how tall you will be. | Scientists are trying to {determine} the exact age of the rock.",
      "monitor simulate",
    ),
    word(
      "indicate indicates indicated indicating",
      "to show that something is probably true; to point to something",
      "表明；指出",
      "Early results {indicate} that the treatment works. | Please {indicate} your answer with a tick in the box. | A red light {indicates} danger.|simulates monitors",
      "simulate monitor",
    ),
    word(
      "reveal reveals revealed revealing",
      "to make known something that was secret or hidden",
      "揭示；透露",
      "The tests {revealed} a small tumor that no one knew about.|confirmed simulated | She refused to {reveal} her age: it was her secret. | The report {revealed} serious mistakes that had been hidden.|confirmed simulated",
      "confirm simulate",
    ),
    word(
      "confirm confirms confirmed confirming",
      "to show or say that something is definitely true or will definitely happen",
      "证实；确认",
      "Please {confirm} your booking by email. | The tests {confirmed} that she had the virus, as the doctor had thought.|denied simulated | Can you {confirm} the time of the meeting? Is it still at ten?",
      "deny simulate",
    ),
    word(
      "establish establishes established establishing",
      "to start a company or an organization; to show that something is true",
      "建立；确立；证实",
      "The school was {established} in 1890 and is still open today.|estimated abolished | Scientists have {established} a link between sleep and memory.|estimated abolished | We need to {establish} the facts first.",
      "estimate abolish",
    ),
    word(
      "assess assesses assessed assessing",
      "to judge the amount, value or quality of something",
      "评估；评定",
      "Doctors {assessed} the patient's condition and decided it was serious.|accessed assisted | The test {assesses} your reading skills and gives you a score.|accesses assists | It's hard to {assess} the damage until the water goes down.",
      "access assist",
    ),
    word(
      "identify identifies identified identifying",
      "to recognize and name someone or something",
      "识别；确认",
      "The police {identified} the thief from the video and named him.|illustrated simulated | Can you {identify} this bird? What is it called? | Scientists {identified} the gene that causes the disease.|illustrated simulated",
      "illustrate simulate",
    ),
    word(
      "detect detects detected detecting",
      "to notice or discover something that is hard to see, hear or smell",
      "察觉；检测出",
      "The test can {detect} cancer early, before you feel ill. | Dogs can {detect} smells that we can't. | I {detected} a note of anger in her voice.|protected deflected",
      "protect deflect",
    ),
    word(
      "monitor monitors monitored monitoring",
      "to watch or check something carefully over a period of time; a machine that does this",
      "监测；监视器",
      "Nurses {monitor} the patient's heart rate all night. | The government {monitors} air pollution every day.|mentors simulates | Satellites {monitor} the ice at the poles, checking it every week.",
      "mentor simulate",
    ),
    word(
      "simulate simulates simulated simulating",
      "to create a situation like a real one, often on a computer",
      "模拟；仿真",
      "The computer {simulates} a flight, so pilots can train safely.|stimulates illustrates | The game {simulates} real driving, so you feel as if you are on a real road.|stimulates illustrates | Scientists {simulated} the spread of the virus on a computer.|stimulated illustrated",
      "stimulate illustrate",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "To *reveal* is to show something hidden that no one knew, while to *confirm* is to show that what people thought is true. Look for words such as *no one knew about*, *hidden* or *as the doctor had thought* that show which one fits.",
        "*reveal* 是揭示无人知道的隐情，*confirm* 是证实人们原本的想法。找找 *no one knew about*、*hidden* 或 *as the doctor had thought* 这类词，判断该用哪个。",
      ),
      meaning: t(
        "To *simulate* is to create something like a real situation, while to *stimulate* is to make something more active. Check whether the meaning is about copying reality or about adding energy.",
        "*simulate* 是模拟真实情境，*stimulate* 是激发、使更活跃。看释义说的是模仿现实，还是增添活力。",
      ),
      spell: t(
        "*Assess* has two double s's: as · sess; *identify* changes y to i in *identified*; *monitor* ends in -or.",
        "*assess* 有两组双写 s：as · sess；*identify* 在 *identified* 里 y 变成 i；*monitor* 以 -or 结尾。",
      ),
    },
    notes: `
      demonstrate|showing how a microscope works;marching against a war;results showing a drug works|to demonstrate is to show clearly how something works or that it is true; to simulate is to copy a real situation|demonstrate 是演示、证明；simulate 是模拟|simulate/simulated=simulate means to copy a real situation, not to show how a microscope works or to march=simulate 是模拟真实情境，不是演示显微镜或游行;detect/detected=detect means to notice something hidden, not to teach, march or show that a drug works=detect 是察觉隐藏的东西，不是教学、游行或证明药效|dem · on · strate|demon + strate|demon + strate
      illustrate|photos on every page;an example that shows a problem;a story to make a point|to illustrate is to explain with an example or add pictures; to simulate is to copy a real situation|illustrate 是举例说明、配插图；simulate 是模拟|monitor/monitored/monitors=monitor means to watch over time, not to add pictures or explain with an example=monitor 是长期监测，不是配图或举例;simulate/simulated/simulates=simulate means to copy a real situation, not to add photos or explain a point with a story=simulate 是模拟真实情境，不是配图或用故事说明|il · lus · trate|il + lus + trate, with a double l|il + lus + trate，双写 l
      determine|finding the cause of death;genes controlling height;finding the age of a rock|to determine is to find out the facts or to control what happens; to monitor is to watch over time|determine 是确定、决定；monitor 是监测|monitor=monitor means to watch something over time, not to find the cause or control how tall you grow=monitor 是长期观察，不是查明原因或决定身高;simulate=simulate means to copy a real situation, not to find out a cause or an age=simulate 是模拟，不是查明原因或年龄|de · ter · mine|de + termine, ending in -ine|de + termine，以 -ine 结尾
      indicate|early results suggesting a treatment works;a tick in a box;a red light meaning danger|to indicate is to show or point to something; to simulate is to copy a situation|indicate 是表明、指出；simulate 是模拟|simulate/simulates=simulate means to copy a real situation, not to show something is probably true or point to an answer=simulate 是模拟，不是表明或指出答案;monitor/monitors=monitor means to watch over time, not to show an answer or a meaning=monitor 是长期监测，不是表示答案或含义|in · di · cate|in + di + cate|in + di + cate
      reveal|a tumor no one knew about;an age kept secret;mistakes that had been hidden|to reveal is to make known something hidden; to confirm is to show that something already believed is true|reveal 是揭示；confirm 是证实|confirm/confirmed=confirm means to show that what people already thought is true, but no one knew about this or it was hidden=confirm 是证实已有的看法，而这里无人知晓或被隐藏;simulate/simulated=simulate means to copy a real situation, not to make a secret known=simulate 是模拟，不是揭露秘密|re · veal|re + veal, with ea|re + veal，是 ea
      confirm|a booking checked by email;tests matching what the doctor thought;a meeting time checked|to confirm is to show or say that something is definitely true; to deny is to say it is not|confirm 是确认；deny 是否认|deny/denied=deny means to say something is not true, but the tests matched what the doctor thought=deny 是否认，而检测结果与医生的判断一致;simulate/simulated=simulate means to copy a situation, not to say a booking or a time is definite=simulate 是模拟，不是确认预订或时间|con · firm|con + firm|con + firm
      establish|a school started in 1890;a link between sleep and memory;facts found first|to establish is to start something or show it is true; to abolish is to end it|establish 是建立、确立；abolish 是废除|estimate/estimated=estimate means to guess an amount, not to start a school or prove a link=estimate 是估计数量，不是建校或证实联系;abolish/abolished=abolish means to end something officially, but the school is still open=abolish 是正式废除，而学校至今还开着|es · tab · lish|e + stab + lish|e + stab + lish
      assess|a patient's condition judged serious;reading skills given a score;damage judged after a flood|to assess is to judge the amount or quality of something; to access is to get into something|assess 是评估；access 是进入、获取|access/accessed/accesses=access means to get into a place or system, not to judge how serious or how good something is=access 是进入或获取，不是判断严重程度或水平;assist/assisted/assists=assist means to help, not to judge or give a score=assist 是帮助，不是评估或打分|as · sess|a double s twice|两组双写 s
      identify|a thief named from a video;the name of a bird;the gene behind a disease|to identify is to recognize and name; to illustrate is to explain with an example|identify 是识别；illustrate 是举例说明|illustrate/illustrated=illustrate means to explain with an example or pictures, not to recognize and name=illustrate 是举例或配图，不是认出并说出名字;simulate/simulated=simulate means to copy a real situation, not to recognize a person or a bird=simulate 是模拟，不是认出人或鸟|i · den · ti · fy|identi + fy; y becomes i in *identified*|identi + fy；*identified* 里 y 变成 i
      detect|cancer found before you feel ill;smells we cannot notice;anger heard in a voice|to detect is to notice something hard to see, hear or smell; to protect is to keep safe|detect 是察觉、检测出；protect 是保护|protect/protected=protect means to keep safe, not to notice something hidden=protect 是保护，不是察觉隐藏的东西;deflect/deflected=deflect means to make something change direction, not to notice it=deflect 是使改变方向，不是察觉|de · tect|de + tect|de + tect
      monitor|a heart rate checked all night;pollution checked every day;ice checked every week|to monitor is to watch something over time; to mentor is to advise and help someone|monitor 是监测；mentor 是指导|mentor/mentors=mentor means to advise a younger person, not to check a heart rate, pollution or ice=mentor 是指导晚辈，不是检测心率、污染或冰层;simulate/simulates=simulate means to copy a situation, not to keep checking a real one=simulate 是模拟，不是持续检查真实的东西|mon · i · tor|-or at the end|以 -or 结尾
      simulate|a flight for pilots to train;driving that feels like a real road;the spread of a virus on a computer|to simulate is to create a situation like a real one; to stimulate is to make something more active|simulate 是模拟；stimulate 是刺激、激发|stimulate/stimulates/stimulated=stimulate means to make something more active, not to copy a real situation=stimulate 是使更活跃，不是模拟真实情境;illustrate/illustrates/illustrated=illustrate means to explain with examples or pictures, not to create something that feels real=illustrate 是举例或配图，不是创造逼真的情境|sim · u · late|sim + u + late, with no t after the s|sim + u + late，s 后面没有 t
    `,
  },
});

const mind = vocabularyTopic({
  id: "b2-words-mental-health",
  title: t("Mental Health", "心理健康"),
  summary: t(
    "Wellbeing; anxiety and depression; therapists and counseling; coping; trauma and burnout; resilience and resilient people; self-esteem and loneliness.",
    "身心健康；焦虑和抑郁；心理治疗师和心理咨询；应对；创伤和倦怠；韧性和有韧性的人；自尊和孤独。",
  ),
  intro: t(
    "After months of long nights at work, Leo was close to **burnout**. His **anxiety** kept him awake, so he started seeing a **therapist**, who helped him **cope** and build his **resilience**. These words help you talk about the health of the mind.",
    "连续几个月加班到深夜，利奥几乎 **burnout**（精疲力竭）。**anxiety**（焦虑）让他睡不着，于是他开始去看 **therapist**（心理治疗师），治疗师帮他 **cope**（应对）压力，增强 **resilience**（韧性）。这些词帮你谈论心理健康。",
  ),
  prerequisites: ["b1-words-emotions"],
  words: [
    word(
      "wellbeing",
      "the state of being healthy and happy",
      "健康；幸福",
      "Exercise improves your {wellbeing}, making you healthier and happier. | Schools should protect students' {wellbeing}, so that they stay healthy and happy. | Money alone doesn't bring {wellbeing}: you also need friends and good health.",
      "burnout anxiety",
    ),
    word(
      "anxiety anxieties",
      "a feeling of worry or fear about what might happen",
      "焦虑；担忧",
      "She suffers from {anxiety} before exams, worrying all night. | {Anxiety} can make it hard to sleep. | There is growing {anxiety} about jobs: people fear they will lose them.",
      "resilience self-esteem",
    ),
    word(
      "depression",
      "an illness in which a person feels very sad and without hope for a long time; a time of economic difficulty",
      "抑郁症；萧条",
      "He was treated for {depression} after months of feeling sad and hopeless. | {Depression} is more than feeling sad: it is an illness. | In the economic {depression} of the 1930s, millions lost their jobs.",
      "resilience wellbeing",
    ),
    word(
      "therapist therapists",
      "a person trained to help people with mental or physical problems",
      "治疗师；心理治疗师",
      "She sees a {therapist} once a week to talk about her worries. | The {therapist} helped him talk about his fears. | Speech {therapists} help children who have trouble speaking.|patients paramedics",
      "patient paramedic",
    ),
    word(
      "counseling",
      "advice and support given by a trained person to help with personal problems",
      "心理咨询；辅导",
      "The school offers free {counseling} to students with problems. | After the accident, she needed {counseling} to help her talk through her fears. | Marriage {counseling} saved their relationship.",
      "burnout trauma",
    ),
    word(
      "cope copes coped coping",
      "to deal successfully with a difficult situation",
      "应对；对付",
      "How do you {cope} with stress? Do you go for a run? | She {coped} well after her husband died.|copied suffered | The hospital can't {cope} with so many patients.",
      "copy suffer",
    ),
    word(
      "trauma traumas",
      "a deep shock that has a lasting effect on the mind; a serious injury",
      "创伤；精神创伤",
      "The war left him with deep {trauma} that still gives him nightmares. | Children need help after a {trauma} such as a car crash. | The hospital treats head {trauma} from road accidents.",
      "burnout counseling",
    ),
    word(
      "burnout",
      "the state of being very tired and unable to work because of too much stress",
      "精疲力竭；职业倦怠",
      "Long hours at work led to {burnout}: she was too exhausted to continue. | Nurses who work too many long shifts without rest are at high risk of {burnout}. | Take holidays to avoid {burnout} from too much work.",
      "trauma resilience",
    ),
    word(
      "resilience",
      "the ability to recover quickly from difficulties",
      "韧性；适应力",
      "Her {resilience} helped her recover quickly. | Sport builds {resilience} in children, teaching them to bounce back from losing. | The city showed great {resilience} after the flood, and was rebuilt in a year.",
      "loneliness burnout",
    ),
    word(
      "resilient",
      "able to recover quickly from difficulties",
      "有韧性的；能迅速恢复的",
      "Children are often more {resilient} than adults and recover quickly from setbacks. | The economy proved {resilient}, recovering quickly after the crisis. | {Resilient} people keep going after a setback and soon feel strong again.",
      "lonely anxious",
    ),
    word(
      "self-esteem",
      "the feeling of being happy with your own character and abilities",
      "自尊；自信",
      "Praise can build children's {self-esteem}, so they feel good about themselves. | She has low {self-esteem} and thinks she is not good enough. | Losing his job hurt his {self-esteem}: he felt worthless.",
      "loneliness anxiety",
    ),
    word(
      "loneliness",
      "the unhappy feeling of being alone",
      "孤独；寂寞",
      "Many old people who live alone suffer from {loneliness}. | {Loneliness} can be as bad for health as smoking. | She wrote about the {loneliness} of city life, where no one knew her name.",
      "self-esteem resilience",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Burnout* comes from too much work and stress, while *trauma* comes from a deep shock such as a war or a crash. Look for words such as *long hours*, *shifts* or *nightmares* that show the cause.",
        "*burnout* 源于工作过多、压力过大，*trauma* 源于战争或车祸这样的重大打击。找找 *long hours*、*shifts* 或 *nightmares* 这类词，看原因是什么。",
      ),
      meaning: t(
        "*Resilience* is the ability to recover from difficulties, while *self-esteem* is how happy you are with yourself. Check whether the meaning is about bouncing back or about how you see yourself.",
        "*resilience* 是从困难中恢复的能力，*self-esteem* 是对自己是否满意。看释义说的是恢复，还是如何看待自己。",
      ),
      spell: t(
        "*Anxiety* has an i before the e: anx · i · e · ty; *resilience* ends in -ence; *self-esteem* has a hyphen and a double e.",
        "*anxiety* 里 i 在 e 前：anx · i · e · ty；*resilience* 以 -ence 结尾；*self-esteem* 有连字符和双写 e。",
      ),
    },
    notes: `
      wellbeing|feeling healthier and happier;students staying healthy and happy;something money alone cannot bring|wellbeing is being healthy and happy; burnout is being exhausted by stress|wellbeing 是身心健康；burnout 是精疲力竭|burnout=burnout is exhaustion from stress, which nobody wants to improve or protect=burnout 是压力导致的精疲力竭，没人想增进或保护它;anxiety=anxiety is worry, not being healthy and happy=anxiety 是焦虑，不是健康快乐|well · be · ing|well + being, one word|well + being，连写成一个词
      anxiety|worrying all night before exams;trouble sleeping;fear of losing jobs|anxiety is worry about what might happen; resilience is the ability to recover|anxiety 是焦虑；resilience 是韧性|resilience=resilience is the ability to recover, not worry that keeps you awake=resilience 是恢复能力，不是让人睡不着的担忧;self-esteem=self-esteem is feeling good about yourself, not fear about the future=self-esteem 是自尊，不是对未来的恐惧|anx · i · e · ty|i before e, and -ty at the end|i 在 e 前，以 -ty 结尾
      depression|months of feeling sad and hopeless;an illness beyond sadness;the 1930s when millions lost jobs|depression is a long illness of sadness or a time of economic difficulty; resilience is the ability to recover|depression 是抑郁症或经济萧条；resilience 是韧性|resilience=resilience is recovering well, not months of hopelessness or an economic crisis=resilience 是恢复能力，不是长期绝望或经济危机;wellbeing=wellbeing is being healthy and happy, the opposite of feeling hopeless=wellbeing 是健康快乐，和绝望正相反|de · pres · sion|depress + ion, with a double s|depress + ion，双写 s
      therapist|someone to talk to about worries;help talking about fears;help for children who cannot speak well|a therapist is trained to help with problems; a patient is the person who gets help|therapist 是治疗师；patient 是病人|patient/patients=a patient receives help, but here this person gives it=patient 是接受帮助的人，而这里这个人提供帮助;paramedic/paramedics=a paramedic gives emergency help in an ambulance, not weekly talks or speech help=paramedic 是在救护车上急救的人，不提供每周谈话或语言训练|ther · a · pist|therapy drops its y and adds -ist|therapy 去掉 y 加 -ist
      counseling|free help for students with problems;help talking through fears;support that saved a marriage|counseling is advice and support from a trained person; trauma is a deep shock|counseling 是心理咨询；trauma 是创伤|burnout=burnout is being exhausted, not help a school offers=burnout 是精疲力竭，不是学校提供的帮助;trauma=trauma is a shock that hurts you, not help that saves a relationship=trauma 是伤害人的打击，不是挽救关系的帮助|coun · sel · ing|counsel + ing, with one l in American English|counsel + ing，美式英语一个 l
      cope|going for a run against stress;life after a husband's death;too many patients for a hospital|to cope is to deal with a difficult situation; to suffer is to feel pain|cope 是应对；suffer 是受苦|copy/copied=copy means to make the same thing again, not to deal with a hard situation=copy 是复制，不是应对困境;suffer/suffered=suffer means to feel pain, and you cannot *suffer well* or *suffer with* patients=suffer 是受苦，不能说 *suffer well* 或 *suffer with* 病人|cope|o-e, as in *hope*|o-e 的拼法，和 *hope* 一样
      trauma|nightmares after a war;a car crash for a child;head injuries from road accidents|trauma is a deep shock or a serious injury; burnout is exhaustion from too much work|trauma 是创伤；burnout 是倦怠|burnout=burnout comes from too much work, not from a war, a crash or a head injury=burnout 来自过度工作，不是战争、车祸或头部受伤;counseling=counseling is help, not a shock that gives nightmares=counseling 是帮助，不是让人做噩梦的打击|trau · ma|au in the middle, said "aw"|中间是 au，读作 "aw"
      burnout|too exhausted to continue working;nurses with too many shifts;holidays against too much work|burnout is exhaustion from too much stress; trauma is a deep shock|burnout 是倦怠；trauma 是创伤|trauma=trauma comes from a shock such as a war, not from long hours of work=trauma 来自战争之类的打击，不是长时间工作;resilience=resilience is the ability to recover, which you do not try to avoid=resilience 是恢复能力，人们不会想避免它|burn · out|burn + out, one word|burn + out，连写成一个词
      resilience|recovering quickly;bouncing back from losing;a city rebuilt in a year|resilience is the ability to recover; loneliness is the feeling of being alone|resilience 是韧性；loneliness 是孤独|loneliness=loneliness is feeling alone, which does not help you recover or rebuild=loneliness 是孤独，不能帮人恢复或重建;burnout=burnout is exhaustion, the opposite of recovering quickly=burnout 是精疲力竭，和迅速恢复正相反|re · sil · i · ence|resili + ence, with -ence at the end|resili + ence，以 -ence 结尾
      resilient|children recovering from setbacks;an economy recovering after a crisis;people who soon feel strong again|resilient means able to recover quickly; anxious means worried|resilient 是有韧性的；anxious 是焦虑的|lonely=lonely means unhappy about being alone, not able to recover=lonely 是孤独的，不是能恢复的;anxious=anxious means worried, not able to bounce back=anxious 是焦虑的，不是能迅速恢复的|re · sil · i · ent|resili + ent|resili + ent
      self-esteem|children feeling good about themselves;thinking you are not good enough;feeling worthless after losing a job|self-esteem is how happy you are with yourself; loneliness is feeling alone|self-esteem 是自尊；loneliness 是孤独|loneliness=loneliness is feeling alone, not how you judge your own worth=loneliness 是孤独，不是对自己价值的判断;anxiety=anxiety is worry, and praise does not build it=anxiety 是焦虑，表扬不会增加焦虑|self · es · teem|self + esteem, with a hyphen and a double e|self + esteem，有连字符和双写 e
      loneliness|old people who live alone;something as bad as smoking;a city where no one knows your name|loneliness is the feeling of being alone; self-esteem is feeling good about yourself|loneliness 是孤独；self-esteem 是自尊|self-esteem=self-esteem is feeling good about yourself, not suffering from living alone=self-esteem 是自尊，不是独居之苦;resilience=resilience is the ability to recover, not a feeling of being alone=resilience 是恢复能力，不是孤独感|lone · li · ness|lonely changes its y to i before -ness|lonely 的 y 变 i 再加 -ness
    `,
  },
});

const care = vocabularyTopic({
  id: "b2-words-health-systems",
  title: t("Health Systems", "医疗体系"),
  summary: t(
    "Healthcare; physicians and paramedics; the pharmaceutical industry and medication; being discharged; intensive care and rehabilitation; preventive care, screening and checkups; being insured.",
    "医疗保健；内科医生和急救人员；制药业和药物；出院；重症监护和康复；预防保健、筛查和体检；参保。",
  ),
  intro: t(
    "When Grandpa fell, **paramedics** took him to hospital. He spent two days in **intensive** care, then weeks in **rehabilitation**, and was finally **discharged** with new **medication**. These words help you talk about hospitals, doctors and how health services work.",
    "爷爷摔倒后，**paramedics**（急救人员）把他送进医院。他在 **intensive**（重症）监护室待了两天，又做了几周 **rehabilitation**（康复），最后带着新的 **medication**（药物）**discharged**（出院）了。这些词帮你谈论医院、医生以及医疗服务如何运作。",
  ),
  prerequisites: ["b1-words-healthcare"],
  words: [
    word(
      "healthcare",
      "the services that look after people's health",
      "医疗保健；卫生保健",
      "Everyone should have access to {healthcare}: doctors, hospitals and medicine. | She works in {healthcare} as a nurse. | The country spends a lot on {healthcare}: all its hospitals, doctors and nurses.",
      "screening medication",
    ),
    word(
      "physician physicians",
      "a doctor, especially one who treats illnesses with medicine",
      "医生；内科医生",
      "Ask your {physician} before taking this medicine. | She is a {physician} at the city hospital, treating illnesses with medicine. | The {physician} examined the patient and wrote a prescription.",
      "paramedic patient",
    ),
    word(
      "paramedic paramedics",
      "a person trained to give medical help in an emergency, often in an ambulance",
      "护理人员；急救医务人员",
      "{Paramedics} arrived in an ambulance within minutes of the crash.|Physicians Patients | The {paramedic} gave her oxygen in the ambulance on the way to hospital. | He trained as a {paramedic} and now drives an ambulance to emergencies.",
      "physician patient",
    ),
    word(
      "pharmaceutical pharmaceuticals",
      "about making and selling medicines",
      "制药的；药物",
      "She works for a {pharmaceutical} company that makes medicines. | The {pharmaceutical} industry makes huge profits from selling drugs. | New {pharmaceutical} products must be tested before they are sold.",
      "preventive intensive",
    ),
    word(
      "medication medications",
      "a medicine or drug that you take for an illness",
      "药物；药剂",
      "Are you taking any {medication} for your heart? | The {medication} made her sleepy, so she stopped driving. | He forgot to take his {medication} this morning.",
      "screening checkup",
    ),
    word(
      "discharge discharges discharged discharging",
      "to allow a patient to leave hospital; the act of doing this",
      "准许出院；出院",
      "She was {discharged} from hospital yesterday and is now at home.|admitted insured | Patients are {discharged} when they are well enough to go home.|admitted insured | The hospital will {discharge} him tomorrow, and his wife will drive him home.",
      "admit insure",
    ),
    word(
      "intensive",
      "involving a lot of effort or care in a short time",
      "密集的；加强的",
      "He spent a week in {intensive} care after the crash. | Her English course was {intensive}: five hours a day for two weeks. | Farming by hand is labor-{intensive}: it needs many workers.",
      "preventive pharmaceutical",
    ),
    word(
      "rehabilitation",
      "the process of helping someone return to a normal life after an illness, an injury or prison",
      "康复；改造",
      "After the accident, she needed months of {rehabilitation} to walk again. | Prisons should focus on the {rehabilitation} of prisoners, so they can return to normal life. | He is in a {rehabilitation} center to stop using drugs.",
      "screening healthcare",
    ),
    word(
      "preventive",
      "intended to stop something bad from happening",
      "预防性的",
      "{Preventive} medicine stops illness before it starts. | Vaccines are {preventive}: they stop disease before it happens. | We need more {preventive} health checks to catch problems early.",
      "intensive pharmaceutical",
    ),
    word(
      "screening screenings",
      "medical tests on many people to find a disease early",
      "筛查；检查",
      "Breast cancer {screening} finds the disease early and saves lives. | All newborn babies have a hearing {screening} to find problems early. | The {screening} found the disease before she had any signs of it.",
      "rehabilitation medication",
    ),
    word(
      "checkup checkups",
      "a general medical examination to see if you are healthy",
      "体检；检查",
      "I go to the dentist for a {checkup} every six months. | The doctor gave me a full {checkup} and said I was healthy. | Regular {checkups} can find problems early.|medications discharges",
      "medication discharge",
    ),
    word(
      "insured",
      "protected by insurance, so that you get money if something bad happens",
      "已投保的；有保险的",
      "Is your car {insured} in case of an accident? | Most workers are {insured} through their company. | The house was {insured} against fire, so they got money to rebuild it.",
      "injured ensured",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "Patients are *admitted* to hospital when they arrive and *discharged* when they leave. Look for words such as *now at home*, *well enough to go home* or *drive him home* that show the patient is leaving.",
        "病人入院叫 *admitted*，出院叫 *discharged*。找找 *now at home*、*well enough to go home* 或 *drive him home* 这类词，它们说明病人要离开医院。",
      ),
      meaning: t(
        "A *physician* is a doctor who treats illnesses with medicine, while a *paramedic* gives emergency help, often in an ambulance. Check whether the meaning is about a doctor or about emergency help.",
        "*physician* 是用药物治病的医生，*paramedic* 是提供急救的人，通常在救护车上。看释义说的是医生，还是急救。",
      ),
      spell: t(
        "*Pharmaceutical* starts with ph and has eu: phar · ma · ceu · ti · cal; *physician* starts with ph too; *preventive* ends in -tive.",
        "*pharmaceutical* 以 ph 开头，中间有 eu：phar · ma · ceu · ti · cal；*physician* 也以 ph 开头；*preventive* 以 -tive 结尾。",
      ),
    },
    notes: `
      healthcare|access to doctors and medicine;work as a nurse;spending on hospitals and staff|healthcare is all the services that look after health; medication is a medicine|healthcare 是医疗保健；medication 是药物|screening=screening is one kind of medical test, not doctors, hospitals and nurses together=screening 是一种检查，不是医生、医院和护士的总和;medication=medication is a medicine, not a place to work as a nurse or a whole set of services=medication 是药物，不是护士工作的领域或整个服务体系|health · care|health + care, one word|health + care，连写成一个词
      physician|someone to ask about a medicine;a hospital doctor who treats with medicine;someone who writes a prescription|a physician is a doctor; a paramedic gives emergency help|physician 是医生；paramedic 是急救人员|paramedic=a paramedic gives emergency help in an ambulance, not hospital treatment or prescriptions=paramedic 在救护车上急救，不在医院治病或开处方;patient=a patient is the person being treated, not the one who examines and prescribes=patient 是接受治疗的人，不是检查和开药的人|phy · si · cian|ph at the start, and -cian at the end|以 ph 开头，以 -cian 结尾
      paramedic|an ambulance minutes after a crash;oxygen on the way to hospital;driving an ambulance to emergencies|a paramedic gives emergency help; a physician is a hospital doctor|paramedic 是急救人员；physician 是医生|physician/Physicians=a physician is a hospital doctor, not the person who comes in an ambulance=physician 是医院医生，不是坐救护车赶来的人;patient/Patients=a patient receives help, not the person who gives oxygen or drives an ambulance=patient 是接受帮助的人，不是给氧或开救护车的人|par · a · med · ic|para + medic|para + medic
      pharmaceutical|a company that makes medicines;an industry selling drugs;products tested before sale|pharmaceutical means about making medicines; preventive means stopping something before it happens|pharmaceutical 是制药的；preventive 是预防性的|preventive=preventive means stopping a problem early, not making and selling medicines=preventive 是预防性的，不是制造和销售药物;intensive=intensive means with a lot of effort, not about making medicines=intensive 是密集的，与制药无关|phar · ma · ceu · ti · cal|ph at the start, and ceu in the middle|以 ph 开头，中间是 ceu
      medication|medicine for a heart;a drug that makes you sleepy;something you take each morning|medication is a medicine you take; screening is a test|medication 是药物；screening 是筛查|screening=screening is a test, not something you take or that makes you sleepy=screening 是检查，不是服用后让人犯困的东西;checkup=a checkup is an examination, not something you take=checkup 是体检，不是要服用的东西|med · i · ca · tion|medic + ation, not *meditation*|medic + ation，不要写成 *meditation*
      discharge|going home from hospital yesterday;well enough to go home;a wife driving a patient home|to discharge is to let a patient leave hospital; to admit is to take a patient in|discharge 是准许出院；admit 是收治入院|admit/admitted=admit means to take a patient into hospital, but here the patient goes home=admit 是收治入院，而这里病人要回家;insure/insured=insure means to buy protection with money, not to let a patient leave=insure 是投保，不是让病人出院|dis · charge|dis + charge|dis + charge
      intensive|care after a crash;five hours of English a day;farming that needs many workers|intensive means a lot of effort or care in a short time; preventive means stopping problems early|intensive 是密集的；preventive 是预防性的|preventive=preventive means stopping a problem early, not a lot of care or work=preventive 是预防性的，不是大量的照护或工作;pharmaceutical=pharmaceutical is about making medicines, not about effort=pharmaceutical 是制药的，与投入的精力无关|in · ten · sive|intense drops its e and adds -ive|intense 去掉 e 加 -ive
      rehabilitation|months learning to walk again;prisoners returning to normal life;a center for stopping drugs|rehabilitation is helping someone return to normal life; screening is testing to find illness|rehabilitation 是康复；screening 是筛查|screening=screening is a test to find a disease, not months of help to walk again or leave drugs=screening 是查病的检查，不是几个月的康复或戒毒;healthcare=healthcare is all health services, not the process of returning to normal life=healthcare 是整个医疗服务，不是回归正常生活的过程|re · ha · bil · i · ta · tion|re + habilit + ation|re + habilit + ation
      preventive|medicine that stops illness starting;vaccines;checks that catch problems early|preventive means stopping something bad before it happens; intensive means a lot of care at once|preventive 是预防性的；intensive 是加强的|intensive=intensive means a lot of care when you are very ill, not stopping illness before it starts=intensive 是重病时的加强护理，不是事先预防;pharmaceutical=pharmaceutical is about making medicines, not about stopping problems early=pharmaceutical 是制药的，不是事先预防|pre · ven · tive|prevent + ive|prevent + ive
      screening|finding cancer early;tests for newborn babies' hearing;a disease found before signs appear|screening is testing many people to find disease early; rehabilitation is recovery|screening 是筛查；rehabilitation 是康复|rehabilitation=rehabilitation is recovery after an illness, not a test that finds it=rehabilitation 是病后康复，不是发现疾病的检查;medication=medication is medicine, not a test that finds disease=medication 是药物，不是发现疾病的检查|screen · ing|screen + ing|screen + ing
      checkup|a visit to the dentist every six months;an examination that showed good health;regular visits that find problems|a checkup is a general examination; medication is medicine|checkup 是体检；medication 是药物|medication/medications=medication is medicine you take, not an examination=medication 是药物，不是检查;discharge/discharges=a discharge is leaving hospital, not an examination=discharge 是出院，不是检查|check · up|check + up, one word|check + up，连写成一个词
      insured|a car protected for accidents;workers covered by their company;money to rebuild after a fire|insured means protected by insurance; injured means hurt|insured 是有保险的；injured 是受伤的|injured=injured means hurt, and a car or a house is not *injured*=injured 是受伤的，汽车或房子不能说 *injured*;ensured=ensured means made certain, not protected by insurance=ensured 是确保，不是有保险|in · sured|insure + d, with in- not en-|insure + d，是 in-，不是 en-
    `,
  },
});

const evidence = vocabularyTopic({
  id: "b2-words-scientific-adjectives",
  title: t("Describing Evidence", "描述证据"),
  summary: t(
    "Theoretical and empirical; experimental; subjective; precise and rigorous; consistent and inconsistent; conclusive and inconclusive; plausible and hypothetical.",
    "理论的和实证的；实验的；主观的；精确的和严谨的；一致的和不一致的；决定性的和非决定性的；看似合理的和假设的。",
  ),
  intro: t(
    "Is the new idea true? The first tests were **inconclusive**, so the team ran **rigorous** experiments and collected **empirical** data. Now their results are **consistent**, and their explanation looks **plausible**. These words help you describe how strong a piece of evidence is.",
    "这个新想法对吗？最初的测试 **inconclusive**（没有定论），于是团队做了 **rigorous**（严谨的）实验，收集了 **empirical**（实证的）数据。现在结果 **consistent**（一致），他们的解释看起来 **plausible**（合理）。这些词帮你描述证据有多有力。",
  ),
  prerequisites: ["b1-words-thinking"],
  words: [
    word(
      "theoretical",
      "based on ideas and theories rather than practice or experience",
      "理论的；理论上的",
      "The course is very {theoretical}, with little practical work. | That's only a {theoretical} risk, and it has never actually happened. | {Theoretical} physics uses math to build ideas about the universe.",
      "practical empirical",
    ),
    word(
      "empirical",
      "based on observation and experiments, not on theory",
      "以实验为依据的；实证的",
      "We need {empirical} evidence from experiments, not opinions. | The theory has strong {empirical} support from years of observation. | {Empirical} research is based on observation and measurement.",
      "theoretical subjective",
    ),
    word(
      "experimental",
      "new and still being tested; using new ideas",
      "实验性的；试验的",
      "The drug is still {experimental}: it is being tested and is not yet sold. | She plays {experimental} music that uses strange new sounds. | The {experimental} group received the new drug, while the other group got a placebo.",
      "conclusive theoretical",
    ),
    word(
      "subjective",
      "based on personal feelings and opinions, not facts",
      "主观的",
      "Beauty is {subjective}: what one person loves, another dislikes. | His review was very {subjective}, based only on his own feelings. | Pain is {subjective}: no machine can measure how much it hurts.",
      "objective empirical",
    ),
    word(
      "precise",
      "exact and accurate",
      "精确的；确切的",
      "Give me the {precise} time, to the minute. | Surgeons must be very {precise}, because one small mistake can kill. | To be {precise}, there were 42 people, not 40.",
      "vague plausible",
    ),
    word(
      "rigorous",
      "very careful and thorough",
      "严格的；严谨的",
      "The drug passed {rigorous} tests over five years. | Science needs {rigorous} methods that check every detail. | The training is {rigorous}: only the most careful students pass.",
      "vigorous careless",
    ),
    word(
      "consistent",
      "always behaving or happening in the same way; in agreement with something",
      "一致的；始终如一的",
      "Her work is {consistent}: it is always good. | The results are {consistent} with the theory, just as we predicted. | Parents should be {consistent} with the rules, applying them the same way every day.",
      "inconsistent hypothetical",
    ),
    word(
      "inconsistent",
      "changing too often; not in agreement with something",
      "不一致的；前后矛盾的",
      "His story was {inconsistent}: the details kept changing. | The results were {inconsistent} with earlier studies, which found the opposite. | The team's performance has been {inconsistent}: they win one week and lose the next.",
      "consistent conclusive",
    ),
    word(
      "conclusive",
      "proving that something is true, so that no doubt remains",
      "决定性的；确凿的",
      "There is no {conclusive} proof yet, so doubts remain. | The DNA test was {conclusive}: he was definitely the father. | The evidence is not yet {conclusive}, so the trial continues.",
      "inconclusive hypothetical",
    ),
    word(
      "inconclusive",
      "not giving a clear result or answer",
      "非决定性的；无定论的",
      "The results were {inconclusive}, so more research is needed. | The vote was {inconclusive}: neither side won a clear majority. | {Inconclusive} tests mean that we must wait for a clear answer.",
      "conclusive precise",
    ),
    word(
      "plausible",
      "likely to be true; reasonable",
      "似乎合理的；可信的",
      "Her excuse sounded {plausible}, so the teacher believed her. | That is a {plausible} explanation, likely to be true. | It is {plausible} that life exists on other planets: many scientists think so.",
      "impossible subjective",
    ),
    word(
      "hypothetical",
      "imagined as possible, but not real",
      "假设的；假定的",
      "Let's take a {hypothetical} example: imagine you won a million dollars. | That's a {hypothetical} question: it's about something that hasn't happened. | The danger is not {hypothetical} but real: it is already here.",
      "real conclusive",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Conclusive* evidence removes all doubt, while *inconclusive* evidence gives no clear answer. Look for words such as *definitely*, *doubts remain* or *more research is needed* that show whether the answer is clear.",
        "*conclusive* 的证据消除一切疑问，*inconclusive* 的证据给不出明确答案。找找 *definitely*、*doubts remain* 或 *more research is needed* 这类词，看答案是否明确。",
      ),
      meaning: t(
        "*Theoretical* means based on ideas, while *empirical* means based on observation and experiments. Check whether the meaning is about thinking or about watching and measuring.",
        "*theoretical* 是基于理论的，*empirical* 是基于观察和实验的。看释义说的是思考推理，还是观察测量。",
      ),
      spell: t(
        "*Rigorous* has -our- in the middle; *hypothetical* starts with hy; *plausible* ends in -ible.",
        "*rigorous* 中间是 -our-；*hypothetical* 以 hy 开头；*plausible* 以 -ible 结尾。",
      ),
    },
    notes: `
      theoretical|a course with little practical work;a risk that never happened;physics built from math and ideas|theoretical means based on ideas, not practice; practical means based on doing|theoretical 是理论的；practical 是实践的|practical=practical means about doing real things, but here there is little practical work or it never happened=practical 是实践的，而这里实践很少或从未发生;empirical=empirical means based on observation, not ideas built with math=empirical 是基于观察的，不是用数学构建的想法|the · o · ret · i · cal|theory changes its y to e and adds -tical|theory 的 y 变 e 再加 -tical
      empirical|evidence from experiments;years of observation;observation and measurement|empirical means based on observation and experiments; theoretical means based on ideas|empirical 是实证的；theoretical 是理论的|theoretical=theoretical means based on ideas, not on experiments and observation=theoretical 是基于理论的，不是基于实验和观察;subjective=subjective means based on feelings, not on measurement=subjective 是主观的，不是基于测量|em · pir · i · cal|em + piric + al, not *imperial*|em + piric + al，不要写成 *imperial*
      experimental|a drug still being tested;music with strange new sounds;the group that got the new drug|experimental means new and still being tested; conclusive means proving something|experimental 是实验性的；conclusive 是决定性的|conclusive=conclusive means giving proof, but this is still being tested or new=conclusive 是给出定论的，而这里还在试验或很新;theoretical=theoretical means only in ideas, but these drugs and sounds are real=theoretical 是只停留在理论上，而这些药和声音是真实的|ex · per · i · men · tal|experiment + al|experiment + al
      subjective|beauty that people judge differently;a review based on feelings;pain no machine can measure|subjective means based on personal feelings; objective means based on facts|subjective 是主观的；objective 是客观的|objective=objective means based on facts, but here feelings decide=objective 是基于事实的，而这里由感受决定;empirical=empirical means measured by observation, but this cannot be measured or depends on feelings=empirical 是靠观察测量的，而这里无法测量或取决于感受|sub · jec · tive|subject + ive|subject + ive
      precise|a time to the minute;surgeons who cannot make small mistakes;42, not 40|precise means exact; vague means not clear|precise 是精确的；vague 是含糊的|vague=vague means not clear or exact, the opposite of to the minute or 42, not 40=vague 是含糊的，和精确到分钟或"42 而不是 40"正相反;plausible=plausible means likely to be true, not exact=plausible 是似乎合理的，不是精确的|pre · cise|pre + cise, with c that sounds like s|pre + cise，c 读作 s
      rigorous|five years of tests;methods that check every detail;training only careful students pass|rigorous means very careful and thorough; vigorous means strong and energetic|rigorous 是严谨的；vigorous 是有活力的|vigorous=vigorous means full of energy, not careful about every detail=vigorous 是精力充沛的，不是注重每个细节;careless=careless means not careful, the opposite of checking every detail=careless 是粗心的，和检查每个细节正相反|rig · or · ous|rigor + ous, with -our- in the middle|rigor + ous，中间是 -our-
      consistent|work that is always good;results that match a theory;rules applied the same way|consistent means always the same or in agreement; inconsistent means changing|consistent 是一致的；inconsistent 是不一致的|inconsistent=inconsistent means changing or not in agreement, but here things stay the same or match=inconsistent 是不一致的，而这里保持一样或相符;hypothetical=hypothetical means imagined, not always the same=hypothetical 是假设的，不是始终如一的|con · sis · tent|con + sist + ent|con + sist + ent
      inconsistent|details that kept changing;results opposite to earlier studies;a team that wins and then loses|inconsistent means changing or not in agreement; consistent means always the same|inconsistent 是不一致的；consistent 是一致的|consistent=consistent means always the same, but here details change and results disagree=consistent 是始终如一的，而这里细节改变、结果矛盾;conclusive=conclusive means giving proof, not changing all the time=conclusive 是给出定论的，不是总在变化|in · con · sis · tent|in + consistent|in + consistent
      conclusive|doubts that remain without proof;a DNA test that settles it;a trial that goes on|conclusive means proving something beyond doubt; inconclusive means unclear|conclusive 是决定性的；inconclusive 是无定论的|inconclusive=inconclusive means unclear, but here the test definitely proves it, or the lack of proof leaves doubt=inconclusive 是无定论的，而这里测试已确证，或缺乏确证才留下疑问;hypothetical=hypothetical means imagined, not proving anything=hypothetical 是假设的，不能证明什么|con · clu · sive|conclude drops its de and adds -sive|conclude 去掉 de 加 -sive
      inconclusive|results that need more research;a vote with no clear winner;tests that leave us waiting|inconclusive means giving no clear answer; conclusive means proving it|inconclusive 是无定论的；conclusive 是决定性的|conclusive=conclusive means giving a clear answer, but here more research is needed and no one won=conclusive 是有定论的，而这里还需研究、没人胜出;precise=precise means exact, not unclear=precise 是精确的，不是没有定论|in · con · clu · sive|in + conclusive|in + conclusive
      plausible|an excuse a teacher believed;an explanation likely to be true;life on other planets|plausible means likely to be true; impossible means it cannot be true|plausible 是似乎合理的；impossible 是不可能的|impossible=impossible means it cannot be true, but the teacher and scientists believe it=impossible 是不可能的，而老师和科学家都相信;subjective=subjective means based on feelings, not likely to be true=subjective 是主观的，不是可能属实|plau · si · ble|au, and -ible at the end|有 au，以 -ible 结尾
      hypothetical|imagining winning a million dollars;a question about what has not happened;a danger that is real|hypothetical means imagined, not real; real means it actually exists|hypothetical 是假设的；real 是真实的|real=real means actually existing, but here we imagine or it hasn't happened, or it is set against real=real 是真实存在的，而这里是想象的、未发生的，或与 real 相对;conclusive=conclusive means proving something, not imagined=conclusive 是确凿的，不是想象的|hy · po · thet · i · cal|hypo + thetical, with y after the h|hypo + thetical，h 后面是 y
    `,
  },
});

const animals = vocabularyTopic({
  id: "b2-words-animals-and-people",
  title: t("Animals and People", "动物与人"),
  summary: t(
    "Cruelty and cruel treatment; humane methods; captivity and captive animals; sanctuaries and poachers; conservation and conserving; predators and prey; veterinary care.",
    "虐待和残忍的对待；人道的方法；圈养和被囚禁的动物；保护区和偷猎者；保护；捕食者和猎物；兽医护理。",
  ),
  intro: t(
    "The baby elephant lost its mother to **poachers**. Rangers brought it to a **sanctuary**, where it gets **veterinary** care and will never live in **captivity** again. These words help you talk about how people treat animals and protect wildlife.",
    "小象的妈妈被 **poachers**（偷猎者）杀害了。护林员把它送到 **sanctuary**（保护区），它在那里得到 **veterinary**（兽医的）照料，再也不会被 **captivity**（圈养）。这些词帮你谈论人们如何对待动物、保护野生动物。",
  ),
  prerequisites: ["b1-words-nature-2"],
  words: [
    word(
      "cruelty",
      "behavior that causes pain or suffering on purpose",
      "残忍；虐待",
      "{Cruelty} to animals, such as beating them, is a crime. | The film shows the {cruelty} of war: the pain and the suffering. | She was shocked by the {cruelty} of the guards, who beat the prisoners.",
      "conservation captivity",
    ),
    word(
      "cruel",
      "causing pain or suffering on purpose",
      "残忍的；残酷的",
      "It's {cruel} to keep a dog in a tiny cage all day. | Children can be very {cruel}, laughing at anyone who is different. | That was a {cruel} thing to say, and it made her cry.",
      "humane captive",
    ),
    word(
      "humane",
      "kind, causing as little pain as possible",
      "人道的；仁慈的",
      "We need a more {humane} way to treat prisoners, one that causes less suffering. | The farm uses {humane} methods that cause the animals as little pain as possible. | The vet ended the old dog's suffering in a {humane} way, quickly and without pain.",
      "cruel human",
    ),
    word(
      "captivity",
      "the state of being kept in a cage or a prison",
      "囚禁；圈养",
      "The bird was born in {captivity}, in a zoo cage. | Many animals don't breed in {captivity}, so zoos struggle to keep them. | He spent six months in {captivity} before he escaped.",
      "sanctuary conservation",
    ),
    word(
      "captive captives",
      "kept as a prisoner or in a cage; a prisoner",
      "被囚禁的；俘虏",
      "The soldiers were held {captive} for months. | {Captive} animals in small cages often become bored. | The {captive} lions were finally set free after years in cages.",
      "humane cruel",
    ),
    word(
      "sanctuary sanctuaries",
      "a safe place, especially for animals or for people in danger",
      "保护区；避难所",
      "The rescued donkeys now live in an animal {sanctuary}. | The church was a {sanctuary} for refugees: a safe place to hide. | The bird {sanctuary} is protected by law, and no hunting is allowed.",
      "captivity predator",
    ),
    word(
      "poacher poachers",
      "a person who illegally hunts animals",
      "偷猎者",
      "{Poachers} kill elephants for their ivory and sell it illegally.|Predators Rangers | The {poacher} was caught with ten dead birds he had shot illegally. | Rangers protect rhinos from {poachers} who hunt them illegally.|predators rangers",
      "predator ranger",
    ),
    word(
      "conservation",
      "the protection of nature, wildlife or resources",
      "（对自然和资源的）保护",
      "Wildlife {conservation} protects animals and their homes. | She works in marine {conservation}, protecting coral reefs. | Energy {conservation}, such as turning off lights, saves money.",
      "captivity cruelty",
    ),
    word(
      "conserve conserves conserved conserving",
      "to protect something from harm or loss; to use as little as possible",
      "保护；节约使用",
      "We must {conserve} water during the dry summer. | Turn off lights to {conserve} energy. | The park was created to {conserve} wildlife and protect it from harm.",
      "waste deserve",
    ),
    word(
      "predator predators",
      "an animal that kills and eats other animals",
      "捕食者；掠夺者",
      "Lions are {predators}: they hunt and eat other animals.|poachers sanctuaries | The rabbit hid from the {predator} that wanted to eat it. | Sharks are the ocean's most feared {predators}.|poachers sanctuaries",
      "poacher sanctuary",
    ),
    word(
      "prey",
      "an animal that is hunted and eaten by another animal",
      "猎物；捕食",
      "The lion caught its {prey}, a young zebra. | Birds of {prey}, such as eagles, hunt small animals. | Old people are easy {prey} for thieves.",
      "predator poacher",
    ),
    word(
      "veterinary",
      "about the medical care of animals",
      "兽医的",
      "She is studying {veterinary} medicine so she can treat sick animals. | Take the dog to a {veterinary} clinic. | The farm needs {veterinary} care for its sick cows.",
      "vegetarian veteran",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "A *predator* hunts and eats other animals, while its *prey* is the animal it eats. A *poacher* is a person who hunts illegally. Look for words such as *eat*, *ivory* or *illegally* that show who is hunting and why.",
        "*predator* 捕食其他动物，*prey* 是被吃的动物，*poacher* 是非法狩猎的人。找找 *eat*、*ivory* 或 *illegally* 这类词，看是谁在狩猎、为什么狩猎。",
      ),
      meaning: t(
        "*Humane* means kind and causing little pain, while *human* simply means about people. Check whether the meaning is about kindness or about being a person.",
        "*humane* 是仁慈的、尽量少造成痛苦，*human* 只是指人类的。看释义说的是仁慈，还是人类本身。",
      ),
      spell: t(
        "*Humane* ends in e: hu · mane; *sanctuary* has -tuary; *veterinary* has five syllables: vet · er · i · nar · y.",
        "*humane* 以 e 结尾：hu · mane；*sanctuary* 中是 -tuary；*veterinary* 有五个音节：vet · er · i · nar · y。",
      ),
    },
    notes: `
      cruelty|beating animals;the pain and suffering of war;guards who beat prisoners|cruelty is causing pain on purpose; conservation is protection|cruelty 是残忍；conservation 是保护|conservation=conservation is protecting animals, not beating them or causing suffering=conservation 是保护动物，不是殴打或制造痛苦;captivity=captivity is being kept in a cage, not beating or suffering on purpose=captivity 是被关起来，不是故意殴打或制造痛苦|cru · el · ty|cruel + ty|cruel + ty
      cruel|a dog in a tiny cage;laughing at someone different;words that made her cry|cruel means causing pain on purpose; humane means kind|cruel 是残忍的；humane 是仁慈的|humane=humane means kind, but these things cause pain and tears=humane 是仁慈的，而这些事造成痛苦和眼泪;captive=captive means kept in a cage, not a way of treating or speaking to others=captive 是被关着的，不是对待别人或说话的方式|cru · el|u, then el|u 加 el
      humane|treating prisoners with less suffering;as little pain as possible;ending suffering quickly|humane means kind and causing little pain; human means about people|humane 是人道的；human 是人类的|cruel=cruel means causing pain, but here suffering is reduced=cruel 是残忍的，而这里在减少痛苦;human=human means about people, not kind or causing little pain=human 是人类的，不是仁慈或少造成痛苦|hu · mane|human + e, said "hew-MANE"|human + e，读作 "hew-MANE"
      captivity|a bird born in a zoo cage;animals that do not breed in zoos;six months as a prisoner|captivity is being kept in a cage or a prison; a sanctuary is a safe place|captivity 是囚禁；sanctuary 是保护区|sanctuary=a sanctuary is a safe place, and you say *in a sanctuary*, not a cage or prison you escape from=sanctuary 是安全的地方，要说 *in a sanctuary*，不是要逃离的笼子或监狱;conservation=conservation is protecting wildlife, not being kept in a cage=conservation 是保护野生动物，不是被关起来|cap · tiv · i · ty|captive drops its e and adds -ity|captive 去掉 e 加 -ity
      captive|soldiers held for months;bored animals in cages;lions set free after years in cages|captive means kept in a cage or as a prisoner; cruel means causing pain|captive 是被囚禁的；cruel 是残忍的|humane=humane means kind, not kept in a cage or as a prisoner=humane 是仁慈的，不是被关押的;cruel=cruel describes someone who causes pain, not animals or soldiers kept in cages=cruel 形容施加痛苦的人，不是被关在笼子里的动物或士兵|cap · tive|capt + ive|capt + ive
      sanctuary|rescued donkeys;a church where refugees hid;a place where no hunting is allowed|a sanctuary is a safe place; captivity is being kept in a cage|sanctuary 是避难所、保护区；captivity 是囚禁|captivity=captivity is being kept in a cage, not a safe place to hide or live freely=captivity 是被关押，不是藏身或自由生活的安全之所;predator=a predator is an animal that hunts, not a safe place=predator 是捕食者，不是安全的地方|sanc · tu · ar · y|-tuary at the end|以 -tuary 结尾
      poacher|elephants killed for ivory;a man caught with birds shot illegally;rhinos hunted illegally|a poacher hunts animals illegally; a predator is an animal that hunts to eat|poacher 是偷猎者；predator 是捕食者|predator/predators=a predator is an animal that hunts to eat, not a person who sells ivory or breaks the law=predator 是为了吃而捕猎的动物，不是卖象牙或违法的人;ranger/rangers=a ranger protects animals, not someone who kills them illegally=ranger 保护动物，不是非法捕杀它们的人|poach · er|poach + er|poach + er
      conservation|protecting animals and their homes;coral reefs;turning off lights|conservation is protecting nature or using less; captivity is being kept in a cage|conservation 是保护、节约；captivity 是圈养|captivity=captivity is keeping animals in cages, not protecting reefs or saving energy=captivity 是把动物关起来，不是保护珊瑚礁或节约能源;cruelty=cruelty is causing pain, the opposite of protecting=cruelty 是残忍，和保护正相反|con · ser · va · tion|conserve drops its e and adds -ation, not *conversation*|conserve 去掉 e 加 -ation，不要写成 *conversation*
      conserve|water in a dry summer;energy saved by turning off lights;wildlife protected from harm|to conserve is to protect or use as little as possible; to waste is to use too much|conserve 是保护、节约；waste 是浪费|waste=waste means to use too much, the opposite of saving water or energy=waste 是浪费，和节约用水用电正相反;deserve=deserve means to earn something, not to protect or save it=deserve 是应得，不是保护或节约|con · serve|con + serve|con + serve
      predator|lions that hunt and eat;something a rabbit hides from;feared sharks|a predator hunts and eats other animals; prey is what it eats|predator 是捕食者；prey 是猎物|poacher/poachers=a poacher is a person who hunts illegally, not an animal that eats others=poacher 是非法狩猎的人，不是吃其他动物的动物;sanctuary/sanctuaries=a sanctuary is a safe place, not an animal that hunts=sanctuary 是安全的地方，不是捕猎的动物|pred · a · tor|-tor at the end|以 -tor 结尾
      prey|a zebra caught by a lion;small animals hunted by eagles;old people targeted by thieves|prey is the animal that is hunted; a predator is the hunter|prey 是猎物；predator 是捕食者|predator=a predator is the hunter, but here it is the one caught or hunted=predator 是猎手，而这里说的是被抓、被猎的一方;poacher=a poacher is a person who hunts, not the animal caught=poacher 是狩猎的人，不是被抓的动物|prey|ey, not *pray*|ey 的拼法，不要写成 *pray*
      veterinary|medicine to treat sick animals;a clinic for a dog;care for sick cows|veterinary means about animal medicine; vegetarian means not eating meat|veterinary 是兽医的；vegetarian 是素食的|vegetarian=vegetarian means not eating meat, not about treating sick animals=vegetarian 是素食的，与给动物治病无关;veteran=a veteran is someone with long experience, not about animal medicine=veteran 是老兵或资深的人，与兽医无关|vet · er · i · nar · y|vet + er + inary, five syllables|vet + er + inary，五个音节
    `,
  },
});

const risk = vocabularyTopic({
  id: "b2-words-risk",
  title: t("Risk and Safety", "风险与安全"),
  summary: t(
    "Precautions and safeguards; hazardous, harmful and harmless substances; lethal and fatal; contaminating and contamination; exposing and exposure; minimizing risks.",
    "预防措施和保障；有害的和无害的物质；致命的；污染；暴露；把风险降到最低。",
  ),
  intro: t(
    "In the science lab we work with **hazardous** chemicals, so we take every **precaution**: we wear gloves to avoid **contamination** and keep our **exposure** to fumes to a **minimum**. These words help you talk about danger and how to stay safe.",
    "在科学实验室里，我们要接触 **hazardous**（有害的）化学品，所以会采取各种 **precaution**（预防措施）：戴手套避免 **contamination**（污染），并把吸入烟雾的 **exposure**（接触）降到 **minimum**（最低）。这些词帮你谈论危险以及如何保证安全。",
  ),
  prerequisites: ["b1-words-environment"],
  words: [
    word(
      "precaution precautions",
      "something done to prevent danger or problems",
      "预防措施",
      "Take {precautions} against fire, such as fitting smoke alarms.|hazards contaminations | As a {precaution}, wear gloves when you use the chemicals. | Safety {precautions}, such as helmets and fences, protect workers.|hazards contaminations",
      "hazard contamination",
      "safeguard",
    ),
    word(
      "safeguard safeguards safeguarded safeguarding",
      "to protect something from harm; a thing that protects",
      "保护；保障措施",
      "New laws {safeguard} children online, keeping them safe. | Strong passwords help {safeguard} your account from thieves. | The rules {safeguard} workers' rights, so no boss can ignore them.",
      "contaminate expose",
      "precaution",
    ),
    word(
      "hazardous",
      "dangerous, especially to health",
      "危险的；有害的",
      "{Hazardous} waste must be stored safely. | The roads are {hazardous} in winter because of the ice. | Smoking is {hazardous} to health.",
      "harmless careless",
      "harmful",
    ),
    word(
      "harmful",
      "causing harm or damage",
      "有害的",
      "Sugar is {harmful} to your teeth: it causes holes. | {Harmful} chemicals were found in the water, so no one may drink it. | The sun's rays can be {harmful}, so wear sun cream.",
      "harmless helpful",
      "hazardous",
    ),
    word(
      "harmless",
      "not able to cause harm",
      "无害的",
      "The snake is {harmless}: its bite can't hurt you. | It was just a {harmless} joke, and nobody was hurt. | Most bacteria are {harmless}, and some are even good for you.",
      "harmful lethal",
    ),
    word(
      "lethal",
      "causing death or able to cause death",
      "致命的；致死的",
      "The poison is {lethal} even in small doses: it can kill. | A {lethal} dose of the drug killed him. | The virus is {lethal} to birds, killing most that catch it.",
      "harmless legal",
      "fatal",
    ),
    word(
      "fatal",
      "causing death; causing failure",
      "致命的；灾难性的",
      "The accident was {fatal}: two people died. | Making that mistake was {fatal} to his career, which soon ended. | The disease is often {fatal}, so few patients survive.",
      "harmless final",
      "lethal",
    ),
    word(
      "contaminate contaminates contaminated contaminating",
      "to make something dirty or poisonous",
      "污染；弄脏",
      "Chemicals from the factory {contaminated} the river and killed the fish.|concentrated purified | The food was {contaminated} with bacteria, and many people got sick.|concentrated purified | Don't {contaminate} the samples: wear clean gloves.",
      "concentrate purify",
    ),
    word(
      "contamination",
      "the act of making something dirty or poisonous; the state of being so",
      "污染",
      "The {contamination} of the water made people ill. | Wear gloves to prevent {contamination}. | Tests found {contamination} in the soil near the factory.",
      "precaution concentration",
    ),
    word(
      "exposure exposures",
      "being in a situation where something harmful can affect you; the effects of extreme cold",
      "暴露；接触",
      "Too much {exposure} to the sun causes skin cancer. | Children's {exposure} to screens has increased. | He died of {exposure} after a night outside in the snow.",
      "precaution contamination",
    ),
    word(
      "expose exposes exposed exposing",
      "to put someone in a situation where something harmful can affect them; to show the truth about something bad",
      "使暴露；揭露",
      "Don't {expose} your skin to the strong sun. | Workers were {exposed} to dangerous chemicals.|protected contaminated | The journalist {exposed} the scandal, showing the truth to everyone.|protected contaminated",
      "protect contaminate",
    ),
    word(
      "minimize minimizes minimized minimizing",
      "to make something as small as possible",
      "使减到最少；将……降到最低",
      "We must {minimize} the risks and keep them as small as possible. | Wear a mask to {minimize} your exposure to the dust. | He tried to {minimize} his mistakes, saying they were not important.",
      "maximize expose",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Harmful* things cause damage, while *harmless* things cannot hurt you. Look for words such as *can't hurt you*, *nobody was hurt* or *no one may drink it* that show whether there is danger.",
        "*harmful* 的东西会造成伤害，*harmless* 的东西伤不了人。找找 *can't hurt you*、*nobody was hurt* 或 *no one may drink it* 这类词，看有没有危险。",
      ),
      meaning: t(
        "To *expose* is to put someone in the way of harm, while to *safeguard* is to protect them from it. Check whether the meaning is about danger reaching you or about keeping it away.",
        "*expose* 是让人暴露在危害之下，*safeguard* 是保护人免受危害。看释义说的是危险找上你，还是把危险挡在外面。",
      ),
      spell: t(
        "*Hazardous* has one z and ends in -ous; *lethal* has th; *minimize* uses -ize in American English.",
        "*hazardous* 只有一个 z，以 -ous 结尾；*lethal* 中有 th；*minimize* 在美式英语里用 -ize。",
      ),
    },
    notes: `
      precaution|smoke alarms against fire;gloves when using chemicals;helmets and fences for workers|a precaution is something done to prevent danger; a hazard is a danger|precaution 是预防措施；hazard 是危险|hazard/hazards=a hazard is a danger, not something you take or wear to stay safe=hazard 是危险，不是为安全而采取或穿戴的东西;contamination/contaminations=contamination is making something dirty, not a way to stay safe=contamination 是污染，不是保证安全的办法|pre · cau · tion|pre + caution|pre + caution
      safeguard|laws keeping children safe online;passwords against thieves;rules that protect workers' rights|to safeguard is to protect; to expose is to put in danger|safeguard 是保护；expose 是使暴露|contaminate=contaminate means to make dirty or poisonous, not to keep safe=contaminate 是污染，不是保护;expose=expose means to put in danger, but here things are kept safe=expose 是使暴露在危险中，而这里是在保护|safe · guard|safe + guard, one word|safe + guard，连写成一个词
      hazardous|waste that must be stored safely;icy roads in winter;smoking and health|hazardous means dangerous; harmless means safe|hazardous 是危险的；harmless 是无害的|harmless=harmless means safe, but this must be stored safely or is dangerous=harmless 是无害的，而这里要妥善存放或很危险;careless=careless describes a person who is not careful, not waste, roads or smoking=careless 形容不小心的人，不是废物、道路或吸烟|haz · ard · ous|hazard + ous, with one z|hazard + ous，一个 z
      harmful|sugar that causes holes;water no one may drink;the sun's rays|harmful means causing damage; harmless means safe|harmful 是有害的；harmless 是无害的|harmless=harmless means safe, but here there are holes, banned water and sun cream=harmless 是无害的，而这里有蛀牙、禁饮的水和防晒霜;helpful=helpful means useful, not causing damage=helpful 是有用的，不是有害的|harm · ful|harm + ful, one l|harm + ful，一个 l
      harmless|a snake whose bite can't hurt;a joke that hurt nobody;bacteria that are good for you|harmless means unable to cause harm; harmful means causing harm|harmless 是无害的；harmful 是有害的|harmful=harmful means causing damage, but nothing here can hurt you=harmful 是有害的，而这里没有东西会伤人;lethal=lethal means able to kill, but nobody was hurt=lethal 是致命的，而这里没人受伤|harm · less|harm + less, a double s|harm + less，双写 s
      lethal|poison that kills in small doses;a dose that killed him;a virus that kills birds|lethal means able to cause death; harmless means safe|lethal 是致命的；harmless 是无害的|harmless=harmless means safe, but this poison, dose and virus kill=harmless 是无害的，而这里的毒药、剂量和病毒都能致死;legal=legal means allowed by law, not able to kill=legal 是合法的，不是致命的|le · thal|th in the middle, said like *the*|中间是 th，读音同 *the* 里的 th
      fatal|an accident where two died;a mistake that ended a career;a disease few survive|fatal means causing death or failure; final means last|fatal 是致命的；final 是最后的|harmless=harmless means safe, but people died or a career ended=harmless 是无害的，而这里有人丧命或事业终结;final=final means last, not causing death or failure=final 是最后的，不是致命或导致失败|fa · tal|fate drops its e and adds -al|fate 去掉 e 加 -al
      contaminate|a river where fish died;food that made people sick;samples kept clean with gloves|to contaminate is to make dirty or poisonous; to purify is to make clean|contaminate 是污染；purify 是净化|concentrate/concentrated=concentrate means to focus or make stronger, not to make dirty=concentrate 是集中或浓缩，不是污染;purify/purified=purify means to make clean, but here fish died and people got sick=purify 是净化，而这里鱼死了、人病了|con · tam · i · nate|con + tamin + ate|con + tamin + ate
      contamination|water that made people ill;what gloves prevent;dirty soil near a factory|contamination is making something dirty or poisonous; a precaution prevents it|contamination 是污染；precaution 是预防措施|precaution=a precaution prevents danger, not something that makes people ill or is found in soil=precaution 是预防措施，不会使人生病，也不会在土壤里被发现;concentration=concentration is focus, not dirt or poison=concentration 是专注，不是污物或毒物|con · tam · i · na · tion|contaminate drops its e and adds -ion|contaminate 去掉 e 加 -ion
      exposure|too much sun;screen time for children;a night outside in the snow|exposure is being where something harmful can affect you; a precaution prevents harm|exposure 是暴露、接触；precaution 是预防措施|precaution=a precaution protects you, not something that causes cancer or death=precaution 是保护措施，不会致癌或致死;contamination=contamination is making something dirty, not being out in the sun or the snow=contamination 是污染，不是晒太阳或受冻|ex · po · sure|expose drops its e and adds -ure|expose 去掉 e 加 -ure
      expose|skin in strong sun;workers near dangerous chemicals;a scandal shown to everyone|to expose is to put in danger or show the truth; to protect is to keep safe|expose 是使暴露、揭露；protect 是保护|protect/protected=protect means to keep safe, and you protect *from*, not *to*, chemicals, nor can it show a scandal=protect 是保护，要说 *protect from*，不是 *to*，也不能揭露丑闻;contaminate/contaminated=contaminate means to make dirty, not to put someone near danger or reveal the truth=contaminate 是污染，不是让人接触危险或揭露真相|ex · pose|ex + pose|ex + pose
      minimize|risks kept as small as possible;a mask against dust;mistakes called unimportant|to minimize is to make as small as possible; to maximize is to make as large as possible|minimize 是降到最低；maximize 是增至最大|maximize=maximize means to make as large as possible, the opposite of keeping risks small=maximize 是使最大化，和使风险最小正相反;expose=expose means to put in danger, not to reduce something=expose 是使暴露，不是减少|min · i · mize|minim + ize|minim + ize
    `,
  },
});

// Modals of deduction about the present.

const joinWords = (...parts: readonly string[]) => parts.filter((p) => p !== "").join(" ");
/** lower writes a subject as it reads inside a sentence: I and the names of people keep their capital. */
const lower = (s: string) => (s === "I" || guessPeople.some(([name]) => s === name) ? s : s.charAt(0).toLowerCase() + s.slice(1));

type Deduction = "must" | "can't" | "might";

const cueOf: Readonly<Record<Deduction | "should", string>> = {
  must: "(I'm sure.)",
  "can't": "(That's impossible.)",
  might: "(Perhaps.)",
  should: "(That was a mistake.)",
};

const othersOf: Readonly<Record<Deduction | "should", readonly [string, string]>> = {
  must: ["can't", "might"],
  "can't": ["must", "might"],
  might: ["must", "can't"],
  should: ["must", "might"],
};

/** guesses are a situation, the subject, is or are, what the subject probably is, and how sure the speaker is. */
const handGuesses: readonly (readonly [string, string, string, string, Deduction])[] = [
  ["She has been working for fourteen hours.", "She", "is", "exhausted", "must"],
  ["The phone is ringing, and it's your number.", "It", "is", "for you", "must"],
  ["He has lived in Paris for twenty years.", "His French", "is", "very good", "must"],
  ["The restaurant is full every night.", "The food", "is", "excellent", "must"],
  ["She has a fever and a bad cough.", "She", "is", "ill", "must"],
  ["They have been running for an hour.", "They", "are", "tired", "must"],
  ["There are flowers and cards on his desk.", "It", "is", "his birthday", "must"],
  ["Everyone in the office has the same symptoms.", "It", "is", "a virus", "must"],
  ["He owns three houses and a boat.", "He", "is", "rich", "must"],
  ["The baby has been crying since breakfast.", "She", "is", "hungry", "must"],
  ["You've just walked twenty kilometers in the sun.", "You", "are", "thirsty", "must"],
  ["The lights are on and I can hear music.", "They", "are", "at home", "must"],
  ["He ate a huge lunch ten minutes ago.", "He", "is", "hungry", "can't"],
  ["She's only fourteen.", "She", "is", "a doctor", "can't"],
  ["The shop opened two minutes ago.", "It", "is", "closed", "can't"],
  ["I saw him in the office a moment ago.", "He", "is", "on holiday", "can't"],
  ["The question asks for someone's age, and the answer is a negative number.", "That answer", "is", "right", "can't"],
  ["He is laughing with his friends.", "He", "is", "unhappy", "can't"],
  ["The tests show no bacteria at all.", "It", "is", "a bacterial infection", "can't"],
  ["They only met last week.", "They", "are", "married", "can't"],
  ["She walks to school in five minutes.", "Her house", "is", "far from the school", "can't"],
  ["That painting costs only twenty dollars.", "It", "is", "a real Picasso", "can't"],
  ["It's snowing outside.", "It", "is", "warm", "can't"],
  ["He has never left his village.", "He", "is", "the man you met in London", "can't"],
  ["Nobody knows what is wrong with him.", "It", "is", "an allergy", "might"],
  ["She hasn't replied to my message.", "She", "is", "busy", "might"],
  ["I don't know where my keys are.", "They", "are", "in the car", "might"],
  ["He's not at his desk.", "He", "is", "at lunch", "might"],
  ["The forecast isn't sure about tomorrow.", "Tomorrow", "is", "sunny", "might"],
  ["The doctor isn't certain yet.", "The pain", "is", "from your back", "might"],
  ["I've never met her, but she looks like Tom.", "She", "is", "his sister", "might"],
  ["The new drug works in mice.", "It", "is", "useful for people too", "might"],
  ["Someone is knocking at the door.", "It", "is", "the postman", "might"],
  ["There's a strange noise in the engine.", "Something", "is", "wrong", "might"],
  ["The results look strange.", "There", "is", "a mistake in the data", "might"],
  ["He's wearing a uniform I don't know.", "He", "is", "a pilot", "might"],
];

/** guessPeople are a person and the pronoun that stands for them, for guesses built from frames. */
const guessPeople: readonly (readonly [string, string])[] = [
  ["Anna", "She"],
  ["Tom", "He"],
  ["Mrs. Lee", "She"],
  ["Mr. Brown", "He"],
  ["Lucy", "She"],
  ["David", "He"],
];

/** guessFrames are a situation with {N} for the person, what they probably are, and how sure the speaker is. */
const guessFrames: readonly (readonly [string, string, Deduction])[] = [
  ["{N} has been working for fourteen hours.", "exhausted", "must"],
  ["{N} has just won the lottery.", "very happy", "must"],
  ["{N} has a fever and a bad cough.", "ill", "must"],
  ["{N} owns three houses and a boat.", "rich", "must"],
  ["{N} hasn't eaten all day.", "hungry", "must"],
  ["{N} ate a huge lunch ten minutes ago.", "hungry", "can't"],
  ["{N} is only twelve.", "a teacher", "can't"],
  ["I saw {N} in the office a moment ago.", "on holiday", "can't"],
  ["{N} is laughing with friends.", "unhappy", "can't"],
  ["{N} has just slept for ten hours.", "tired", "can't"],
  ["{N} hasn't replied to my message.", "busy", "might"],
  ["{N} isn't at the desk.", "at lunch", "might"],
  ["{N} looks pale today.", "ill", "might"],
  ["{N} is wearing a uniform I don't know.", "a pilot", "might"],
  ["{N} didn't come to the meeting.", "on holiday", "might"],
];

/** guesses are the hand-written guesses and one for every person with every frame, the person named again as the subject. */
const guesses: readonly (readonly [string, string, string, string, Deduction])[] = [
  ...handGuesses,
  ...everyPair(guessFrames, guessPeople).map(([[frame, x, kind], [name]]) => [frame.replace("{N}", name), name, "is", x, kind] as const),
];

/** noAfter adds nothing after the modal; haveAfter adds have and the past participle. */
const noAfter = t("", "");
const haveAfter = t("*have* with the past participle", "*have* 加过去分词");

/** kindOf finds the modal of deduction among the words of a sentence or an option. */
const kindOf = (text: string): Deduction | "should" =>
  (text.split(" ").find((w) => ["must", "can't", "might", "should"].includes(w)) as Deduction | "should" | undefined) ?? "might";

/** guessRule names the modal for how sure the speaker is, with what follows it. */
function guessRule(kind: Deduction | "should", after: Text): Text {
  const then = after.en === "" ? t("", "") : t(` and ${after.en}`, `，后面接 ${after["zh-CN"]}`);
  if (kind === "must")
    return t(`The speaker is sure it is true, so use *must*${then.en}`, `说话人确信是真的，所以用 *must*${then["zh-CN"]}`);
  if (kind === "can't")
    return t(
      `The speaker is sure it is not true, so use *can't*, not *mustn't*${then.en}`,
      `说话人确信不是真的，所以用 *can't*，不用 *mustn't*${then["zh-CN"]}`,
    );
  if (kind === "should")
    return t(
      `It was the right thing to do, but it did not happen, so use *should*${then.en}`,
      `那本是该做的事，却没有做，所以用 *should*${then["zh-CN"]}`,
    );
  return t(
    `It is only possible, so use *might*, *may* or *could*${then.en}`,
    `只是有可能，所以用 *might*、*may* 或 *could*${then["zh-CN"]}`,
  );
}

/** modalMeans says what a wrong modal of deduction would mean. */
function modalMeans(kind: Deduction | "should"): Text {
  if (kind === "must") return t("*must* says you are sure it is true.", "*must* 表示确信是真的。");
  if (kind === "can't") return t("*can't* says you are sure it is not true.", "*can't* 表示确信不是真的。");
  if (kind === "should") return t("*should* says it was the right thing to do.", "*should* 表示那是该做的事。");
  return t("*might* says it is only possible.", "*might* 表示只是有可能。");
}

/** whyNotGuess explains a modal that does not match how sure the speaker is. */
const whyNotGuess =
  (_after: Text) =>
  (wrong: string, _right: string): Text => {
    const first = modalMeans(kindOf(wrong));
    return t(
      `${first.en} That does not match the level of certainty shown in brackets.`,
      `${first["zh-CN"]}这与括号里给出的把握程度或语气不符。`,
    );
  };

/** guessWhy explains the modal in the gap of shown, with what follows it. */
const guessWhy =
  (after: Text) =>
  (right: string, shown: string): Text => {
    const rule = guessRule(kindOf(right), after);
    return t(
      `${rule.en}: ${fill(shown, right)}\n\n**Check.** Match the modal (*${kindOf(right)}*) to the clue in brackets: *must* = sure true, *can't* = sure false, *might* = possible, *should* = past regret.`,
      `${rule["zh-CN"]}：${fill(shown, right)}\n\n**检验。** 对照括号里的提示核对情态动词（*${kindOf(right)}*）：*must* 确信是真的，*can't* 确信不是，*might* 有可能，*should* 表示过去本该做却没做。`,
    );
  };

const guessChoice: readonly ChoiceItem[] = guesses.map(
  ([context, s, , x, kind]): ChoiceItem => [`${context} ${cueOf[kind]} ${s} ___ be ${x}.`, kind, othersOf[kind]],
);

/** acceptedModal gives the pattern of the modals that say the same as the one given. */
function acceptedModal(kind: Deduction | "should"): string {
  if (kind === "can't") return "[can't|cannot|couldn't]";
  if (kind === "might") return "[might|may|could]";
  return kind;
}

const guessTyped: readonly TypedItem[] = guesses.map(([, s, be, x, kind]): TypedItem => {
  const fact = joinWords(lower(s), be, x);
  const negative = joinWords(lower(s), `${be}n't`, x);
  const shown = kind === "must" ? `I'm sure that ${fact}.` : kind === "can't" ? `I'm sure that ${negative}.` : `Perhaps ${fact}.`;
  return {
    shown,
    accepted: [`${joinWords(s, acceptedModal(kind), "be", x)}.`],
    canonical: `${joinWords(s, kind, "be", x)}.`,
    wrong: [`${joinWords(s, kind === "can't" ? "mustn't" : kind, kind === "can't" ? "be" : "to be", x)}.`, `${joinWords(s, kind, be, x)}.`],
  };
});

/** doings are a situation, the subject, the modal, the base form and the -ing form of the verb, and the rest. */
const handDoings: readonly (readonly [string, string, Deduction, string, string, string])[] = [
  ["She isn't answering her phone.", "She", "must", "sleep", "sleeping", ""],
  ["I can hear loud music next door.", "They", "must", "have", "having", "a party"],
  ["He's wearing a suit and tie.", "He", "might", "go", "going", "to an interview"],
  ["The lights are on in the lab at night.", "Someone", "must", "work", "working", "late"],
  ["She's carrying a tennis racket.", "She", "must", "play", "playing", "tennis today"],
  ["He's still in bed at noon.", "He", "can't", "feel", "feeling", "well"],
  ["They're laughing loudly.", "They", "can't", "have", "having", "a bad time"],
  ["The surgeon is in the operating room.", "She", "must", "operate", "operating", "on a patient"],
  ["The scientists look very excited.", "Their experiment", "must", "go", "going", "well"],
  ["Her bags are packed.", "She", "might", "leave", "leaving", "today"],
  ["He keeps looking at his watch.", "He", "must", "wait", "waiting", "for someone"],
  ["The children are very quiet.", "They", "might", "watch", "watching", "TV"],
  ["You're shaking.", "You", "must", "feel", "feeling", "cold"],
  ["The roads near the stadium are full of cars.", "Everyone", "must", "drive", "driving", "to the match"],
  ["He's speaking Spanish on the phone.", "He", "might", "talk", "talking", "to his cousin in Madrid"],
  ["She looks very calm.", "She", "can't", "worry", "worrying", "about the exam"],
  ["There's smoke coming from the kitchen.", "Something", "must", "burn", "burning", ""],
  ["He's holding a prescription.", "He", "might", "collect", "collecting", "his medicine"],
  ["The patient is smiling again.", "The treatment", "must", "work", "working", ""],
  ["Nobody's at the reception desk.", "The nurse", "might", "take", "taking", "a break"],
  ["He's not at school today.", "He", "might", "stay", "staying", "at home with a cold"],
  ["She's typing very fast.", "She", "must", "finish", "finishing", "her report"],
  ["I can smell coffee.", "Someone", "must", "make", "making", "breakfast"],
  ["The dog is barking at the door.", "Someone", "must", "stand", "standing", "outside"],
  ["They haven't left the office all week.", "They", "must", "prepare", "preparing", "for the launch"],
  ["He's always tired these days.", "He", "can't", "sleep", "sleeping", "well"],
  ["She's walking with a stick.", "Her leg", "must", "hurt", "hurting", ""],
  ["The baby is smiling in her sleep.", "She", "might", "dream", "dreaming", ""],
  ["The team is still in the lab at midnight.", "They", "can't", "plan", "planning", "to go home soon"],
  ["The phones haven't stopped ringing.", "Customers", "must", "complain", "complaining", "about something"],
  ["He's reading the same page again and again.", "He", "can't", "concentrate", "concentrating", "today"],
  ["She's wearing her running shoes.", "She", "might", "train", "training", "for the marathon"],
];

/** doingFrames are a situation with {N} for the person, the modal, the base form and the -ing form of the verb, and the rest. */
const doingFrames: readonly (readonly [string, Deduction, string, string, string])[] = [
  ["{N} isn't answering the phone.", "must", "sleep", "sleeping", ""],
  ["{N} is wearing a suit and tie.", "might", "go", "going", "to an interview"],
  ["{N} is carrying a tennis racket.", "must", "play", "playing", "tennis today"],
  ["{N} is still in bed at noon.", "can't", "feel", "feeling", "well"],
  ["{N} keeps looking at the clock.", "must", "wait", "waiting", "for someone"],
  ["{N} is typing very fast.", "must", "finish", "finishing", "a report"],
  ["{N} looks very calm.", "can't", "worry", "worrying", "about the exam"],
  ["{N} is wearing running shoes.", "might", "train", "training", "for a race"],
  ["{N} is reading the same page again and again.", "can't", "concentrate", "concentrating", ""],
  ["{N} is speaking French on the phone.", "might", "talk", "talking", "to a friend in Paris"],
  ["{N} is humming a song.", "must", "feel", "feeling", "happy"],
  ["{N} has put some bags by the door.", "might", "leave", "leaving", "today"],
];

/** doings are the hand-written situations and one for every person with every frame. */
const doings: readonly (readonly [string, string, Deduction, string, string, string])[] = [
  ...handDoings,
  ...everyPair(doingFrames, guessPeople).map(
    ([[frame, modal, base, ing, rest], [name, pronoun]]) => [frame.replace("{N}", name), pronoun, modal, base, ing, rest] as const,
  ),
];

const doingChoice: readonly ChoiceItem[] = doings.map(
  ([context, s, modal, base, ing, rest], k): ChoiceItem => [
    `${context} ${joinWords(s, modal, "___", rest)}.`,
    `be ${ing}`,
    k % 2 === 0 ? [ing, `be ${base}`, `been ${ing}`] : [ing, `be ${base}`],
  ],
);

const deduction: TopicDef = {
  id: "modals-of-deduction",
  title: t("Must Be, Can't Be", "must be 和 can't be"),
  summary: t(
    "It must be a virus. It can't be serious. It might be an allergy. Must says what we are sure of, can't what is impossible, and might what is possible.",
    "It must be a virus. It can't be serious. It might be an allergy。must 表示确信，can't 表示不可能，might 表示有可能。",
  ),
  intro: t(
    "Hearing thunder outside, you judge from the clues: *It must be a storm* (certain), *It can't be sunny* (impossible), or *It might be hail* (possible). Each modal marks a different level of certainty about the present.",
    "听见窗外打雷，你会根据线索推测：*It must be a storm*（肯定）、*It can't be sunny*（不可能）或 *It might be hail*（有可能）。不同的情态动词对应对当下的不同把握程度。",
  ),
  prerequisites: ["may-might-and-could"],
  encompasses: [{ topic: "may-might-and-could", weight: 0.3 }],
  xp: 30,
  strand: "grammar",
  knowledgePoints: [
    point(
      "sure",
      t("Must, can't or might", "must、can't 还是 might"),
      t(
        "When you guess about the present from what you can see or know, choose the modal by how sure you are:\n\n- **must**: you are sure it is true. *She has a fever. She **must** be ill.*\n- **can't**: you are sure it is not true. *He ate ten minutes ago. He **can't** be hungry.*\n- **might**, **may** or **could**: it is possible. *She **might** be busy.*\n\n> **Watch out.** The negative opposite of deduction *must* is ***can't***, never *mustn't* (*mustn't* means prohibited, not “surely not”).",
        "根据看到或知道的情况推测现在时，按把握程度选情态动词：\n\n- **must**：确信是真的。*She has a fever. She **must** be ill.*\n- **can't**：确信不是真的。*He ate ten minutes ago. He **can't** be hungry.*\n- **might**、**may** 或 **could**：有可能。*She **might** be busy.*\n\n中文“一定”“不可能”“可能”正好对应这三个词。\n\n> **注意。** 表示推测时，*must* 的反义词是 ***can't***，绝不是 *mustn't*（*mustn't* 表示“禁止”，不是“一定不是”）。",
      ),
      choiceGenerator(
        t(
          "The words in brackets say how sure the speaker is. Choose the word for the gap.",
          "括号里的话说明说话人的把握程度。选出填入空白处的词。",
        ),
        guessChoice,
        guessWhy(noAfter),
        whyNotGuess(noAfter),
      ),
    ),
    point(
      "doing",
      t("Must be doing", "must be doing"),
      t(
        "To guess about what is happening **at this moment**, use the modal with **be** and the **-ing** form:\n\n- *She isn't answering. She **must be sleeping**.*\n- *He looks calm. He **can't be worrying** about the exam.*\n\n> **Watch out.** Keep base ***be*** between the modal and the *-ing* verb—*must sleeping*, *must been sleeping*, and *must be sleep* are all wrong.",
        "推测**此刻正在发生**的事，用情态动词加 **be** 再加 **-ing** 形式：\n\n- *She isn't answering. She **must be sleeping**.*\n- *He looks calm. He **can't be worrying** about the exam.*\n\n> **注意。** 情态动词和 *-ing* 之间必须保留原形 ***be***——*must sleeping*、*must been sleeping* 和 *must be sleep* 都是错的。",
      ),
      choiceGenerator(
        t("Choose the words for the gap.", "选出填入空白处的词。"),
        doingChoice,
        (right, shown) =>
          t(
            `The guess is about what is happening at this moment, so the modal takes *be* and the *-ing* form: ${fill(shown, right)}\n\n**Check.** Confirm the modal is followed directly by base *be* + *-ing* (*${right}*).`,
            `推测的是此刻正在发生的事，所以情态动词后面接 *be* 加 *-ing*：${fill(shown, right)}\n\n**检验。** 确认情态动词后紧跟原形 *be* + *-ing*（*${right}*）。`,
          ),
        (wrong) =>
          wrong.startsWith("been ")
            ? t(
                `*${wrong}* has *been*, the past participle, but right after a modal *be* stays in its base form: *be* and the *-ing* form.`,
                `*${wrong}* 用了过去分词 *been*，可紧跟在情态动词后面的 *be* 要用原形：*be* 加 *-ing*。`,
              )
            : wrong.startsWith("be ")
              ? t(
                  `*${wrong}* has the base form after *be*. A guess about this moment takes *be* and the *-ing* form.`,
                  `*${wrong}* 在 *be* 后面用了原形。推测此刻正在发生的事，要用 *be* 加 *-ing*。`,
                )
              : t(
                  `*${wrong}* leaves out *be*. A guess about this moment takes *be* and the *-ing* form after the modal.`,
                  `*${wrong}* 漏掉了 *be*。推测此刻正在发生的事，情态动词后面要接 *be* 加 *-ing*。`,
                ),
      ),
    ),
    point(
      "write",
      t("Writing a guess", "写出推测"),
      t(
        "Rewrite the sentence with a modal and *be*:\n\n- *I'm sure that she is tired.* → *She **must be** tired.*\n- *I'm sure that he isn't hungry.* → *He **can't be** hungry.*\n- *Perhaps it is an allergy.* → *It **might be** an allergy.* (*may* and *could* are also right.)\n\n> **Watch out.** After any modal, *is/are/am* always changes to base *be*—and never add *to* (*must to be* is wrong).",
        "用情态动词加 *be* 改写句子：\n\n- *I'm sure that she is tired.* → *She **must be** tired.*\n- *I'm sure that he isn't hungry.* → *He **can't be** hungry.*\n- *Perhaps it is an allergy.* → *It **might be** an allergy.*（也可以用 *may* 或 *could*。）\n\n> **注意。** 情态动词后面，*is/are/am* 一律改成原形 *be*，且不能加 *to*（*must to be* 是错的）。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Rewrite the sentence with must, can't or might.", "用 must、can't 或 might 改写句子。"),
        guessTyped,
        (right) => {
          const rule = guessRule(kindOf(right), t("*be*", "*be*"));
          return t(
            `${rule.en}: ${right}\n\n**Check.** Verify the modal matches the certainty level and is followed directly by base *be*.`,
            `${rule["zh-CN"]}：${right}\n\n**检验。** 核对情态动词与把握程度一致，且后面直接接原形 *be*。`,
          );
        },
        modalsOfDeductionWriteNot,
      ),
    ),
  ],
};

// Past modals.

/** pasts are a situation, the subject, the past simple, the base form and the past participle, the rest, and the modal. */
const handPasts: readonly (readonly [string, string, string, string, string, string, Deduction | "should"])[] = [
  ["She is late again.", "She", "missed", "miss", "missed", "the bus", "must"],
  ["He didn't come to the meeting.", "He", "forgot", "forget", "forgotten", "about it", "must"],
  ["Their car isn't outside.", "They", "left", "leave", "left", "already", "must"],
  ["Your grades are excellent.", "You", "worked", "work", "worked", "very hard", "must"],
  ["The streets are wet.", "It", "rained", "rain", "rained", "in the night", "must"],
  ["The plate is empty, and the dog looks happy.", "The dog", "ate", "eat", "eaten", "the cake", "must"],
  ["My umbrella isn't by the door.", "Someone", "took", "take", "taken", "it", "must"],
  ["She came out of the exam smiling.", "It", "went", "go", "gone", "well", "must"],
  ["It was completely dark.", "He", "saw", "see", "seen", "us", "can't"],
  ["She doesn't speak French, and the letter is in French.", "She", "wrote", "write", "written", "it", "can't"],
  ["They only started ten minutes ago.", "They", "finished", "finish", "finished", "the work", "can't"],
  ["I saw your keys in your bag a minute ago.", "You", "lost", "lose", "lost", "them", "can't"],
  ["The window was locked from inside.", "The thief", "came", "come", "come", "in through the window", "can't"],
  ["He doesn't have a car or a license.", "He", "drove", "drive", "driven", "here", "can't"],
  ["The results were exactly what we expected.", "The experiment", "failed", "fail", "failed", "", "can't"],
  ["She was on a plane with no internet.", "She", "heard", "hear", "heard", "the news", "can't"],
  ["He's late, and I don't know why.", "He", "got", "get", "got", "stuck in traffic", "might"],
  ["I can't find her anywhere.", "She", "went", "go", "gone", "home", "might"],
  ["They haven't answered our letters.", "They", "moved", "move", "moved", "away", "might"],
  ["I can't find my phone.", "I", "left", "leave", "left", "it in the taxi", "might"],
  ["The parcel hasn't arrived.", "It", "got", "get", "got", "lost in the post", "might"],
  ["She isn't answering her phone.", "She", "fell", "fall", "fallen", "asleep", "might"],
  ["Nobody knows where the patient caught it.", "He", "caught", "catch", "caught", "the infection in hospital", "might"],
  ["They should be here by now.", "They", "took", "take", "taken", "a different road", "might"],
  ["I failed the exam.", "I", "studied", "study", "studied", "harder", "should"],
  ["You only told me about the problem today.", "You", "told", "tell", "told", "me earlier", "should"],
  ["The restaurant is full.", "We", "booked", "book", "booked", "a table", "should"],
  ["The medicine had dangerous side effects.", "They", "tested", "test", "tested", "it more carefully", "should"],
  ["She is freezing.", "She", "wore", "wear", "worn", "a coat", "should"],
  ["He made many mistakes on his own.", "He", "asked", "ask", "asked", "for help", "should"],
  ["The diagnosis was wrong.", "The doctors", "checked", "check", "checked", "the results again", "should"],
  ["We missed the start of the film.", "We", "left", "leave", "left", "earlier", "should"],
];

/** pastFrames are a situation with {N} for the person, the past simple, base and participle, the rest, and the modal. */
const pastFrames: readonly (readonly [string, string, string, string, string, Deduction | "should"])[] = [
  ["{N} is late again.", "missed", "miss", "missed", "the bus", "must"],
  ["{N} didn't come to the party.", "forgot", "forget", "forgotten", "about it", "must"],
  ["{N} looks very tired.", "stayed", "stay", "stayed", "up late", "must"],
  ["{N} came out of the exam smiling.", "did", "do", "done", "well", "must"],
  ["{N} has just bought a new car.", "saved", "save", "saved", "a lot of money", "must"],
  ["{N} was in another city all day.", "took", "take", "taken", "my bike", "can't"],
  ["{N} doesn't speak Japanese, and the letter is in Japanese.", "wrote", "write", "written", "it", "can't"],
  ["{N} was asleep at the time.", "heard", "hear", "heard", "the noise", "can't"],
  ["{N} only started five minutes ago.", "finished", "finish", "finished", "the work", "can't"],
  ["{N} isn't here yet.", "got", "get", "got", "stuck in traffic", "might"],
  ["{N} isn't answering the phone.", "fell", "fall", "fallen", "asleep", "might"],
  ["{N} isn't at home.", "went", "go", "gone", "to the shops", "might"],
  ["{N} failed the test.", "studied", "study", "studied", "harder", "should"],
  ["{N} is freezing.", "wore", "wear", "worn", "a coat", "should"],
  ["{N} got lost in the city.", "took", "take", "taken", "a map", "should"],
];

/** pasts are the hand-written situations and one for every person with every frame, the person named again as the subject. */
const pasts: readonly (readonly [string, string, string, string, string, string, Deduction | "should"])[] = [
  ...handPasts,
  ...everyPair(pastFrames, guessPeople).map(
    ([[frame, past, base, pp, rest, kind], [name]]) => [frame.replace("{N}", name), name, past, base, pp, rest, kind] as const,
  ),
];

const pastChoice: readonly ChoiceItem[] = pasts.map(
  ([context, s, , , pp, rest, kind]): ChoiceItem => [
    `${context} ${cueOf[kind]} ${joinWords(s, "___", rest)}.`,
    `${kind} have ${pp}`,
    [`${othersOf[kind][0]} have ${pp}`, `${othersOf[kind][1]} have ${pp}`],
  ],
);

const pastFormChoice: readonly ChoiceItem[] = pasts.map(
  ([context, s, past, , pp, rest, kind], k): ChoiceItem => [
    `${context} ${joinWords(s, "___", rest)}.`,
    `${kind} have ${pp}`,
    [`${kind} had ${pp}`, past === pp ? `${kind} ${pp}` : `${kind} have ${past}`, ...(k % 2 === 0 ? [`${kind} to have ${pp}`] : [])],
  ],
);

const pastTyped: readonly TypedItem[] = pasts.map(([, s, past, base, pp, rest, kind]): TypedItem => {
  const fact = joinWords(lower(s), past, rest);
  const shown =
    kind === "must"
      ? `I'm sure that ${fact}.`
      : kind === "can't"
        ? `It's impossible that ${fact}.`
        : kind === "might"
          ? `Perhaps ${fact}.`
          : `${joinWords(s, "didn't", base, rest)}, and that was a mistake.`;
  return {
    shown,
    accepted: [`${joinWords(s, acceptedModal(kind), "have", pp, rest)}.`],
    canonical: `${joinWords(s, kind, "have", pp, rest)}.`,
    wrong: [`${joinWords(s, kind, "had", pp, rest)}.`, `${joinWords(s, kind, past === pp ? pp : `have ${past}`, rest)}.`],
  };
});

const pastModals: TopicDef = {
  id: "past-modals",
  title: t("Should Have, Might Have", "should have 和 might have"),
  summary: t(
    "They should have tested it. She might have forgotten. A modal with have and a past participle looks back at the past: must have, can't have and might have guess, and should have criticizes.",
    "They should have tested it. She might have forgotten。情态动词加 have 加过去分词回看过去：must have、can't have、might have 表示推测，should have 表示批评或后悔。",
  ),
  intro: t(
    "When a colleague arrives soaking wet, you look back at what happened: *He must have walked in the rain*, or *He should have brought an umbrella.* Adding *have* + past participle turns any modal toward the past.",
    "看到同事淋成落汤鸡，你回推刚才发生了什么：*He must have walked in the rain*，或者惋惜道 *He should have brought an umbrella.* 情态动词加上 *have* + 过去分词，就能把推测或批评指向过去。",
  ),
  prerequisites: ["modals-of-deduction", "present-perfect-or-past-simple"],
  encompasses: [
    { topic: "modals-of-deduction", weight: 0.4 },
    { topic: "present-perfect-or-past-simple", weight: 0.1 },
  ],
  xp: 30,
  strand: "grammar",
  knowledgePoints: [
    point(
      "meaning",
      t("Must have, can't have, might have, should have", "must have、can't have、might have、should have"),
      t(
        "To guess about the **past**, put **have + past participle** after the modal:\n\n- **must have**: you are sure it happened. *The streets are wet. It **must have rained**.*\n- **can't have**: you are sure it did not happen. *It was dark. He **can't have seen** us.*\n- **might have**: perhaps it happened. *She **might have gone** home.*\n\n**Should have** says that something was the right thing to do, but it did not happen: *I failed. I **should have studied** harder.*\n\n> **Watch out.** Do not use plain *should + base verb* for past regret—*I should study harder* talks about now or the future, not a past mistake.",
        "推测**过去**的事，在情态动词后用 **have + 过去分词**：\n\n- **must have**：确信发生过。*The streets are wet. It **must have rained**.*\n- **can't have**：确信没发生。*It was dark. He **can't have seen** us.*\n- **might have**：也许发生过。*She **might have gone** home.*\n\n**should have** 表示本该做却没做：*I failed. I **should have studied** harder.*\n\n> **注意。** 表达过去本该做却没做，不能只用 *should + 动词原形*——*I should study harder* 说的是现在或以后，不是过去的遗憾。",
      ),
      choiceGenerator(
        t(
          "The words in brackets say what the speaker means. Choose the words for the gap.",
          "括号里的话说明说话人的意思。选出填入空白处的词。",
        ),
        pastChoice,
        guessWhy(haveAfter),
        whyNotGuess(haveAfter),
      ),
    ),
    point(
      "form",
      t("Have and the past participle", "have 加过去分词"),
      t(
        "After a modal, always use **have**, never *had* or *has*, and then the **past participle**: *must have **gone***, not *must had gone* or *must have went*.\n\n> **Watch out.** In speech *must've* sounds like *must of*, but in writing it is always **have**—never *of*, never *had*, and never *to have*.",
        "情态动词后面一律用 **have**，不用 *had* 或 *has*，然后接**过去分词**：*must have **gone***，不是 *must had gone*，也不是 *must have went*。\n\n> **注意。** 口语中 *must've* 弱读起来像 *must of*，但书面永远写 **have**——不能写成 *of*、*had* 或 *to have*。",
      ),
      choiceGenerator(
        t("Choose the words for the gap.", "选出填入空白处的词。"),
        pastFormChoice,
        (right, shown) => {
          const pp = right.split(" ").at(-1) ?? "";
          return t(
            `After a modal, the past takes *have*, never *had*, and then the past participle, *${pp}*: ${fill(shown, right)}\n\n**Check.** Verify the three-part chain: modal + base *have* + past participle (*${pp}*).`,
            `情态动词后面表示过去，用 *have*，不用 *had*，再接过去分词 *${pp}*：${fill(shown, right)}\n\n**检验。** 核对三段结构：情态动词 + 原形 *have* + 过去分词（*${pp}*）。`,
          );
        },
        (wrong) => {
          const [, w1 = "", w2 = ""] = wrong.split(" ");
          if (w1 === "to")
            return t(`A modal is followed directly by base *have*, never by *to have*.`, `情态动词后面直接接原形 *have*，不能加 *to*。`);
          if (w1 === "had")
            return t(
              `After a modal, the helper stays in its base form (*have*), never *had*.`,
              `情态动词后面的助动词必须用原形 *have*，不能用 *had*。`,
            );
          if (w1 === "have")
            return t(
              `*${w2}* is the past simple, not the past participle required after *have*.`,
              `*${w2}* 是一般过去式，不是 *have* 后面所需的过去分词。`,
            );
          return t(`*${wrong}* leaves out *have*, so it does not refer back to the past.`, `*${wrong}* 漏掉了 *have*，无法回指过去。`);
        },
      ),
    ),
    point(
      "write",
      t("Writing about the past with a modal", "用情态动词写过去的事"),
      t(
        "Rewrite the sentence with a modal, *have* and the past participle:\n\n- *I'm sure that she missed the bus.* → *She **must have missed** the bus.*\n- *It's impossible that he saw us.* → *He **can't have seen** us.*\n- *Perhaps she went home.* → *She **might have gone** home.*\n- *I didn't study harder, and that was a mistake.* → *I **should have studied** harder.*\n\n> **Watch out.** Check irregular verbs carefully: *saw* becomes *seen*, *went* becomes *gone*, and *wrote* becomes *written* after *have*.",
        "用情态动词加 *have* 加过去分词改写句子：\n\n- *I'm sure that she missed the bus.* → *She **must have missed** the bus.*\n- *It's impossible that he saw us.* → *He **can't have seen** us.*\n- *Perhaps she went home.* → *She **might have gone** home.*\n- *I didn't study harder, and that was a mistake.* → *I **should have studied** harder.*\n\n> **注意。** 留心不规则动词的过去分词：放在 *have* 后面时，*saw* 要变成 *seen*，*went* 变成 *gone*，*wrote* 变成 *written*。",
      ),
      typedGenerator(
        "sentence-pattern",
        t(
          "Rewrite the sentence with must have, can't have, might have or should have.",
          "用 must have、can't have、might have 或 should have 改写句子。",
        ),
        pastTyped,
        (right) => {
          const rule = guessRule(kindOf(right), haveAfter);
          return t(
            `${rule.en}: ${right}\n\n**Check.** Verify the modal matches the clue and is followed by base *have* + past participle.`,
            `${rule["zh-CN"]}：${right}\n\n**检验。** 核对情态动词与句意线索一致，且后面是原形 *have* + 过去分词。`,
          );
        },
        pastModalsWriteNot,
      ),
    ),
  ],
};

/** topics are the topics of the unit Science, Ethics and Medicine. */
export const topics: readonly TopicDef[] = [
  medicine.topic,
  organs.topic,
  ethics.topic,
  methods.topic,
  genetics.topic,
  scienceVerbs.topic,
  mind.topic,
  care.topic,
  evidence.topic,
  animals.topic,
  risk.topic,
  deduction,
  pastModals,
];

/** vocabulary are the words the unit Science, Ethics and Medicine teaches. */
export const vocabulary: readonly WordBatch[] = [
  medicine.batch,
  organs.batch,
  ethics.batch,
  methods.batch,
  genetics.batch,
  scienceVerbs.batch,
  mind.batch,
  care.batch,
  evidence.batch,
  animals.batch,
  risk.batch,
];
