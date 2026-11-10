// B2, unit 3: Science, Ethics and Medicine. Medicine, the body inside, ethics, research methods, genetics, verbs of
// science, mental health, health systems, describing evidence, animals and people, and risk; modals of deduction about
// the present and the past, and should have. Its writing topic, introductions and conclusions, already exists.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { fill } from "../a2/kit.ts";
import { vocabularyTopic, word } from "../words.ts";

const medicine = vocabularyTopic({
  id: "b2-words-medicine",
  title: t("Medicine", "医学"),
  summary: t(
    "Diagnosis; chronic and acute illness; epidemics and pandemics; contagious diseases; being immune and immunity; antibiotics and doses; transplants and donors.",
    "诊断；慢性病和急性病；流行病和大流行病；传染性疾病；免疫和免疫力；抗生素和剂量；移植和捐献者。",
  ),
  prerequisites: ["b1-words-illness"],
  words: [
    word(
      "diagnosis",
      "the act of finding out what illness a person has",
      "诊断",
      "The doctor's {diagnosis} was a mild infection.|donor immune | An early {diagnosis} can save lives.|immune contagious | She is waiting for a {diagnosis} from the specialist.|contagious chronic",
      "diagnose prognosis",
    ),
    word(
      "chronic",
      "lasting for a long time, often for life (of an illness)",
      "慢性的；长期的",
      "She suffers from {chronic} back pain.|antibiotic donor | Diabetes is a {chronic} disease that lasts for life.|transplant dose | He has had a {chronic} cough for years.|donor diagnosis",
      "chronicle chromic",
      "acute",
    ),
    word(
      "acute",
      "sudden and serious (of an illness or pain); very great",
      "急性的；严重的",
      "She was taken to hospital with {acute} pain in her stomach.|donor transplant | The {acute} phase of the illness lasts a few days.|donor dose | There is an {acute} shortage of nurses.|immunity donor",
      "cute accurate",
      "chronic",
    ),
    word(
      "epidemic epidemics",
      "a large number of cases of a disease in one area at the same time",
      "流行病；（疾病的）流行",
      "A flu {epidemic} closed the schools.|immune contagious | Obesity has become an {epidemic} in many countries.|immune acute | The {epidemic} spread quickly through the city.|immune chronic",
      "epidermis academic",
      "pandemic",
    ),
    word(
      "pandemic pandemics",
      "a disease that spreads across many countries of the world",
      "大流行病；全球流行病",
      "The {pandemic} of 2020 changed the world.|immune contagious | A {pandemic} affects people in many countries at once.|contagious chronic | Governments must prepare for the next {pandemic}.|immune acute",
      "panda pandemonium",
      "epidemic",
    ),
    word(
      "contagious",
      "spreading from one person to another by touch or through the air",
      "传染性的；有感染力的",
      "Measles is highly {contagious}.|epidemic transplant | Stay at home while you are {contagious}.|immunity donor | Her laughter was {contagious}: soon everyone was laughing.|antibiotic diagnosis",
      "contiguous courageous",
    ),
    word(
      "immune",
      "not able to catch a disease; not affected by something",
      "免疫的；不受影响的",
      "After having the disease, you are {immune} to it.|epidemic dose | The {immune} system fights infection.|epidemic transplant | Nobody is {immune} to criticism.|donor dose",
      "immense immunize",
    ),
    word(
      "immunity",
      "the body's ability not to catch a disease",
      "免疫力",
      "Vaccines give {immunity} against many diseases.|donors transplants | {Immunity} to the virus lasts about a year.|Diagnosis Dose | Some people have natural {immunity} to the illness.|contagious acute",
      "community impunity",
    ),
    word(
      "antibiotic antibiotics",
      "a medicine that kills bacteria",
      "抗生素",
      "The doctor gave me {antibiotics} for the infection.|epidemics pandemics | {Antibiotics} don't work against viruses.|Immune Contagious | Take the {antibiotic} three times a day.|immune epidemic",
      "antibody antique",
    ),
    word(
      "dose doses",
      "the amount of a medicine that you take at one time",
      "剂量；一剂",
      "Don't take more than the recommended {dose}.|donor immunity | A small {dose} of the drug is enough.|immune contagious | She needs a second {dose} of the vaccine.|diagnosis immune",
      "doze does",
    ),
    word(
      "transplant transplants",
      "an operation in which an organ is moved from one person's body into another's",
      "移植（手术）",
      "He had a heart {transplant} last year.|immune contagious | She is waiting for a kidney {transplant}.|immune epidemic | Organ {transplants} save thousands of lives.|immune chronic",
      "transport implant",
    ),
    word(
      "donor donors",
      "a person who gives blood, an organ or money to help others",
      "捐献者；捐赠者",
      "A {donor} gave his kidney to his sister.|dose diagnosis | Blood {donors} are always needed.|doses epidemics | The heart came from a young {donor}.|dose immunity",
      "donut owner",
    ),
  ],
});

const organs = vocabularyTopic({
  id: "b2-words-organs",
  title: t("Inside the Body", "身体内部"),
  summary: t(
    "Organs and tissue; the kidneys and the liver; the spine and the skeleton; arteries and veins; hormones; digesting, digestion and metabolism.",
    "器官和组织；肾和肝；脊柱和骨骼；动脉和静脉；激素；消化和新陈代谢。",
  ),
  prerequisites: ["b1-words-body-and-mind"],
  words: [
    word(
      "organ organs",
      "a part of the body, such as the heart or the lungs, that has a special job",
      "器官",
      "The heart is the {organ} that pumps blood.|digest metabolism | The skin is the body's largest {organ}.|digest hormone | She gave her {organs} to science after she died.|digests metabolisms",
      "organize orphan",
    ),
    word(
      "tissue tissues",
      "the material that the parts of animals and plants are made of; a paper handkerchief",
      "组织；纸巾",
      "Muscle {tissue} heals slowly.|digest spine | The doctor took a small piece of {tissue} for tests.|digest metabolism | Scar {tissue} formed over the wound.|digestion hormone",
      "issue fissure",
    ),
    word(
      "kidney kidneys",
      "one of the two organs that clean the blood and make urine",
      "肾；肾脏",
      "The {kidneys} clean the blood and remove waste.|digests hormones | She gave one {kidney} to her brother.|digestion metabolism | {Kidney} disease is common in older people.|Digest Metabolism",
      "kidnap kindly",
    ),
    word(
      "liver livers",
      "the large organ that cleans poisons from the blood",
      "肝；肝脏",
      "Too much alcohol damages the {liver}.|digest hormone | The {liver} removes poisons from the blood.|digestion spine | Fish {liver} oil is rich in vitamins.|digestion spine",
      "lever river",
    ),
    word(
      "spine spines",
      "the row of bones down the middle of your back",
      "脊柱；脊椎",
      "She hurt her {spine} in a fall.|digestion metabolism | The {spine} protects the nerves in your back.|digestion hormone | Sit up straight to protect your {spine}.|digest hormone",
      "spin swine",
      "skeleton",
    ),
    word(
      "skeleton skeletons",
      "the frame of all the bones of a body",
      "骨骼；骨架",
      "The museum has a dinosaur {skeleton}.|digestion metabolism | The human {skeleton} has 206 bones.|digestion metabolism | The {skeleton} supports and protects the body.|digest digestion",
      "skeptic sketch",
      "spine",
    ),
    word(
      "artery arteries",
      "one of the tubes that carry blood from the heart to the rest of the body",
      "动脉",
      "The {arteries} carry blood away from the heart.|digests hormones | Fatty food can block your {arteries}.|digests skeletons | A main {artery} was cut in the accident.|digestion metabolism",
      "artillery battery",
      "vein",
    ),
    word(
      "vein veins",
      "one of the tubes that carry blood back to the heart",
      "静脉",
      "{Veins} carry blood back to the heart.|Digests Metabolisms | The nurse put the needle into a {vein}.|digestion skeleton | You can see the blue {veins} in her hands.|digestions metabolisms",
      "vain vine",
      "artery",
    ),
    word(
      "hormone hormones",
      "a chemical made in the body that controls growth, mood or other processes",
      "激素；荷尔蒙",
      "Growth {hormones} help children grow.|digests skeletons | Stress {hormones} rise when you are afraid.|skeletons digests | Insulin is a {hormone}.|digest skeleton",
      "harmony hormonal",
    ),
    word(
      "digest digests digested digesting",
      "to break down food in the stomach so the body can use it; to understand new information slowly",
      "消化；领会",
      "Some people can't {digest} milk.|digestion metabolism | It takes hours to {digest} a big meal.|digestion metabolism | I need time to {digest} the news.|digestion metabolism",
      "divest diagnose",
    ),
    word(
      "digestion",
      "the process of breaking down food in the body",
      "消化",
      "Fiber is good for {digestion}.|digest skeleton | Chewing slowly helps {digestion}.|digest spine | {Digestion} begins in the mouth.|Digest Skeleton",
      "direction suggestion",
    ),
    word(
      "metabolism",
      "the chemical processes by which the body turns food into energy",
      "新陈代谢",
      "Exercise speeds up your {metabolism}.|digest skeleton | People with a fast {metabolism} burn energy quickly.|digest spine | {Metabolism} slows down as we get older.|Digest Skeleton",
      "mechanism metabolic",
    ),
  ],
});

const ethics = vocabularyTopic({
  id: "b2-words-ethics",
  title: t("Ethics", "伦理"),
  summary: t(
    "Ethics and ethical questions; moral duties and morality; principles and dilemmas; justifying and justification; controversial issues and controversy; consent and dignity.",
    "伦理和伦理问题；道德责任和道德；原则和两难；辩护和理由；有争议的问题和争议；同意和尊严。",
  ),
  prerequisites: ["b1-words-truth"],
  words: [
    word(
      "ethics",
      "the rules of right and wrong behavior, or their study",
      "伦理；道德准则",
      "Medical {ethics} protect patients.|justify ethical | She teaches business {ethics}.|ethical justify | The scandal raised questions about the company's {ethics}.|justify ethical",
      "ethnics ethos",
      "morality",
    ),
    word(
      "ethical",
      "about right and wrong; morally right",
      "伦理的；合乎道德的",
      "Is it {ethical} to test drugs on animals?|ethics dilemma | We only buy from {ethical} companies.|ethics dignity | Doctors face difficult {ethical} questions.|ethics justify",
      "ethnical eternal",
      "moral",
    ),
    word(
      "moral",
      "about right and wrong behavior; the lesson that a story teaches",
      "道德的；寓意",
      "Parents teach children {moral} values.|morality dilemma | We have a {moral} duty to help.|morality justify | The {moral} of the story is: be kind.|justify dignity",
      "morale mortal",
      "ethical",
    ),
    word(
      "morality",
      "ideas about right and wrong behavior",
      "道德；道德观",
      "{Morality} is about right and wrong behavior.|Justify Ethical | They questioned the {morality} of the war.|moral justify | Religion and {morality} are often linked.|moral justify",
      "mortality morale",
      "ethics",
    ),
    word(
      "principle principles",
      "a basic rule or belief that guides how you behave",
      "原则；原理",
      "It's against my {principles} to lie.|dilemmas consents | The basic {principle} is simple: the patient comes first.|justify controversial | She refused to pay on {principle}.|dilemma consent",
      "principal participle",
    ),
    word(
      "dilemma dilemmas",
      "a situation in which you must make a difficult choice between two things",
      "两难境地；困境",
      "I'm in a {dilemma}: should I tell her the truth?|principle consent | Doctors often face moral {dilemmas}.|justifies dignities | The {dilemma} is whether to save money or help people.|justify ethical",
      "diploma dialogue",
    ),
    word(
      "justify justifies justified justifying",
      "to give a good reason for something",
      "证明……有理；为……辩护",
      "How can you {justify} spending so much money?|justification ethical | Nothing can {justify} violence.|justification controversy | The results {justified} the risk.|justification controversial",
      "justice testify",
    ),
    word(
      "justification justifications",
      "a good reason for doing something",
      "理由；正当理由",
      "There is no {justification} for cruelty.|justify ethical | What is the {justification} for the new tax?|justify controversial | He gave a long {justification} of his decision.|justify ethical",
      "justice qualification",
    ),
    word(
      "controversial",
      "causing a lot of disagreement",
      "有争议的",
      "Gene editing is a {controversial} topic.|controversy justify | The {controversial} law was changed after protests.|controversy justify | Her views are {controversial}: many people disagree with them.|controversy justify",
      "conversational contradictory",
    ),
    word(
      "controversy controversies",
      "a lot of public disagreement about something",
      "争议；争论",
      "The decision caused a lot of {controversy}.|controversial justify | There is {controversy} over the new airport.|controversial ethical | The film was at the center of a {controversy}.|controversial ethical",
      "conversation contrary",
    ),
    word(
      "consent consents consented consenting",
      "permission; to agree to let something happen",
      "同意；准许",
      "Doctors need your {consent} before an operation.|dignity dilemma | She {consented} to the treatment.|justified principled | Photos of children need their parents' {consent}.|dignity ethics",
      "content consensus",
    ),
    word(
      "dignity",
      "the quality of being respected and of respecting yourself",
      "尊严；庄重",
      "Every patient should be treated with {dignity}.|consent dilemma | She faced her illness with great {dignity}.|consent justification | Poverty can take away people's {dignity}.|justify ethical",
      "dignify divinity",
    ),
  ],
});

const methods = vocabularyTopic({
  id: "b2-words-research-2",
  title: t("Research Methods", "研究方法"),
  summary: t(
    "Clinical trials and placebos; variables; statistics and statistical analysis; correlation; replicating and verifying results; methodology; valid results and bias.",
    "临床试验和安慰剂；变量；统计数据和统计分析；相关性；重复和验证结果；方法论；有效的结果和偏差。",
  ),
  prerequisites: ["b1-words-research"],
  words: [
    word(
      "clinical",
      "about the treatment of patients and the testing of medicines on people",
      "临床的",
      "The drug is in {clinical} trials.|placebo correlation | She works as a {clinical} psychologist.|placebo statistic | {Clinical} tests showed the drug was safe.|Replicate Verify",
      "cynical classical",
    ),
    word(
      "trial trials",
      "a test of how well something works or how safe it is; the process of judging a case in court",
      "试验；审判",
      "The new vaccine is being tested in a {trial}.|valid replicate | The {trial} included 3,000 patients.|statistical valid | The murder {trial} lasted three weeks.|statistical valid",
      "trail trivial",
    ),
    word(
      "placebo placebos",
      "a pill or treatment with no medicine in it, used to compare with a real drug",
      "安慰剂",
      "Half the patients were given a {placebo}.|statistical valid | A {placebo} is a pill with no medicine in it.|bias correlation | Some patients felt better even on the {placebo}.|valid statistical",
      "placid plateau",
    ),
    word(
      "variable variables",
      "a thing that can change in an experiment or a situation",
      "变量；可变因素",
      "Temperature is an important {variable} in the experiment.|replicate verify | Change only one {variable} at a time.|replicate verify | There are too many {variables} to predict the result.|replicates verifies",
      "valuable variety",
    ),
    word(
      "statistic statistics",
      "a number that describes a fact; the science of collecting and studying numbers",
      "统计数据；统计学",
      "{Statistics} show that crime has fallen.|Replicates Valid | Here is one shocking {statistic}: a child dies every minute.|replicate valid | She studies {statistics} at university.|valid replicate",
      "statistical static",
    ),
    word(
      "statistical",
      "using numbers and statistics",
      "统计的；统计学的",
      "The {statistical} analysis took months.|statistics verify | There is no {statistical} difference between the groups.|statistics verify | We used {statistical} methods to test the results.|statistics replicate",
      "statistic stately",
    ),
    word(
      "correlation correlations",
      "a connection between two things, where one changes as the other changes",
      "相关性；关联",
      "There is a {correlation} between smoking and cancer.|placebo variable | A {correlation} does not prove that one thing causes another.|valid verify | The study found a strong {correlation}.|valid verify",
      "corporation correction",
    ),
    word(
      "replicate replicates replicated replicating",
      "to do an experiment again and get the same result; to copy exactly",
      "重复（实验）；复制",
      "Other scientists could not {replicate} the results.|valid statistical | The experiment was {replicated} in three countries.|valid statistical | To be trusted, a study must be {replicated}.|statistics clinical",
      "reciprocate replace",
    ),
    word(
      "verify verifies verified verifying",
      "to check that something is true or correct",
      "核实；证实",
      "Please {verify} your email address.|valid correlation | The police {verified} his story.|valid statistical | Scientists must {verify} their results.|valid statistical",
      "verity vary",
    ),
    word(
      "methodology methodologies",
      "the set of methods used in a study",
      "方法论；研究方法",
      "The {methodology} of the study was weak.|replicate verify | Explain your {methodology} in the report.|replicate valid | Critics questioned the research {methodology}.|replicate verify",
      "mythology meteorology",
    ),
    word(
      "valid",
      "based on good reasons or facts; legally acceptable for a period of time",
      "有效的；合理的",
      "Your ticket is {valid} for one month.|bias replicate | That's a {valid} point.|bias verify | The results are not {valid} because the sample was too small.|bias verify",
      "vapid solid",
    ),
    word(
      "bias biases",
      "an unfair preference for or against one person, group or result",
      "偏见；偏差",
      "The judge was accused of {bias}.|valid verify | Newspapers often show political {bias}.|valid replicate | The study had a {bias} toward younger patients.|valid verify",
      "basis bass",
    ),
  ],
});

const genetics = vocabularyTopic({
  id: "b2-words-genetics",
  title: t("Genetics and Life", "遗传学与生命"),
  summary: t(
    "Genetic tests and DNA; inheriting traits; mutations; organisms, bacteria and microbes; cloning; embryos; breeding; biological parents.",
    "基因检测和 DNA；遗传特征；突变；生物、细菌和微生物；克隆；胚胎；繁殖；亲生父母。",
  ),
  prerequisites: ["b1-words-science"],
  words: [
    word(
      "genetic",
      "about genes, the parts of cells that pass qualities from parents to children",
      "基因的；遗传的",
      "Eye color is {genetic}.|inherit embryo | The disease is caused by a {genetic} problem.|inherit breed | {Genetic} testing can show your risk of disease.|Inherit Clone",
      "generic genetics",
    ),
    word(
      "DNA",
      "the chemical in cells that carries genetic information",
      "DNA；脱氧核糖核酸",
      "The police found his {DNA} at the scene.|genetic inherit | {DNA} carries genetic information.|Genetic Inherit | A {DNA} test showed they were brothers.|inherit breed",
      "RNA DNS",
    ),
    word(
      "inherit inherits inherited inheriting",
      "to get a quality from your parents through your genes; to receive money or property from someone who has died",
      "遗传；继承",
      "She {inherited} her mother's eyes.|genetic biological | He {inherited} a house from his uncle.|genetic organism | We {inherit} half our genes from each parent.|genetic biological",
      "inhibit inhabit",
    ),
    word(
      "mutation mutations",
      "a change in the genes of a living thing",
      "突变；变异",
      "A {mutation} in one gene can cause disease.|genetic inherit | The virus has developed new {mutations}.|inherits genetic | Most {mutations} are harmless.|inherit genetic",
      "mutilation notation",
    ),
    word(
      "organism organisms",
      "a living thing, such as a plant, an animal or a bacterium",
      "生物；有机体",
      "Bacteria are tiny {organisms}.|genetic inherits | Every living {organism} needs energy.|genetic inherit | Scientists changed the genes of the {organism}.|genetic inherit",
      "organ organic",
    ),
    word(
      "bacteria",
      "very small living things, some of which cause disease",
      "细菌",
      "{Bacteria} can cause infections.|Genetic Inherit | Wash your hands to remove {bacteria}.|genetic inherit | Some {bacteria} are good for your stomach.|trait biological",
      "cafeteria bacterium",
      "microbe",
    ),
    word(
      "microbe microbes",
      "a living thing that is too small to see without a microscope",
      "微生物",
      "{Microbes} are too small to see without a microscope.|Genetic Inherits | The soil is full of {microbes}.|genetic inherited | This {microbe} lives in hot springs.|genetic biological",
      "microphone microwave",
      "bacteria",
    ),
    word(
      "clone clones cloned cloning",
      "to make an exact genetic copy of a plant or an animal; such a copy",
      "克隆；无性繁殖",
      "Scientists {cloned} a sheep called Dolly.|genetic biological | The {clone} is identical to the original.|genetic inherit | {Cloning} humans is illegal in most countries.|Genetic Biological",
      "clown close",
    ),
    word(
      "embryo embryos",
      "an animal or a human in the earliest stage of growing inside its mother or an egg",
      "胚胎",
      "The {embryo} grows inside its mother.|genetic inherit | Scientists studied the {embryos} of mice.|genetic inherits | At eight weeks, the {embryo} is about two centimeters long.|genetic inherit",
      "embassy embryonic",
    ),
    word(
      "breed breeds bred breeding",
      "to keep animals so that they produce young; (of animals) to have young; a type of animal",
      "繁殖；饲养；品种",
      "This {breed} of dog is very friendly.|genetic inherit | Birds {breed} in the spring.|genetic biological | They {bred} horses on their farm.|genetic biological",
      "bread bleed",
    ),
    word(
      "trait traits",
      "a particular quality in someone's character or body",
      "特征；特点",
      "Kindness is her best {trait}.|genetic inherit | Some {traits} are passed from parents to children.|inherits genetic | Curiosity is a common {trait} among scientists.|genetic inherit",
      "treat tract",
    ),
    word(
      "biological",
      "about living things; related by birth",
      "生物的；亲生的",
      "She is his {biological} mother.|DNA inherit | {Biological} weapons are banned.|Inherit Breed | Sleep is a {biological} need.|DNA inherit",
      "biographical ecological",
    ),
  ],
});

const scienceVerbs = vocabularyTopic({
  id: "b2-words-science-verbs",
  title: t("Verbs of Science", "科学动词"),
  summary: t(
    "Demonstrating and illustrating; determining and indicating; revealing, confirming and establishing; assessing, identifying and detecting; monitoring and simulating.",
    "展示和说明；确定和表明；揭示、证实和确立；评估、识别和检测；监测和模拟。",
  ),
  prerequisites: ["b1-words-research"],
  words: [
    word(
      "demonstrate demonstrates demonstrated demonstrating",
      "to show clearly that something is true; to show how something works; to march in protest",
      "证明；演示；示威",
      "The teacher {demonstrated} how to use the microscope.|placebo valid | Thousands of people {demonstrated} against the war.|placebo valid | The results {demonstrate} that the drug works.|bias statistical",
      "demolish remonstrate",
      "illustrate",
    ),
    word(
      "illustrate illustrates illustrated illustrating",
      "to explain something with an example; to add pictures to a book",
      "说明；配插图",
      "The book is {illustrated} with photos.|placebo bias | This example {illustrates} the problem.|placebo valid | Let me {illustrate} my point with a story.|placebo clinical",
      "illuminate illusion",
      "demonstrate",
    ),
    word(
      "determine determines determined determining",
      "to find out the facts about something; to decide or control what happens",
      "确定；决定",
      "Tests will {determine} the cause of death.|placebo valid | Your genes partly {determine} your height.|placebo valid | Scientists are trying to {determine} the age of the rock.|placebo statistical",
      "terminate detain",
    ),
    word(
      "indicate indicates indicated indicating",
      "to show that something is probably true; to point to something",
      "表明；指出",
      "Early results {indicate} that the treatment works.|placebo valid | Please {indicate} your answer with a tick.|placebo valid | A red light {indicates} danger.|placebo bias",
      "dedicate indict",
    ),
    word(
      "reveal reveals revealed revealing",
      "to make known something that was secret or hidden",
      "揭示；透露",
      "The tests {revealed} a small tumor.|placebo valid | She refused to {reveal} her age.|placebo valid | The report {revealed} serious mistakes.|placebo statistical",
      "revel repeal",
    ),
    word(
      "confirm confirms confirmed confirming",
      "to show or say that something is definitely true or will definitely happen",
      "证实；确认",
      "Please {confirm} your booking by email.|bias valid | The tests {confirmed} that she had the virus.|bias statistical | Can you {confirm} the time of the meeting?|bias clinical",
      "conform confine",
    ),
    word(
      "establish establishes established establishing",
      "to start a company or an organization; to show that something is true",
      "建立；确立；证实",
      "The school was {established} in 1890.|bias statistical | Scientists have {established} a link between sleep and memory.|bias valid | We need to {establish} the facts first.|bias clinical",
      "estimate abolish",
    ),
    word(
      "assess assesses assessed assessing",
      "to judge the amount, value or quality of something",
      "评估；评定",
      "Doctors {assessed} the patient's condition.|bias statistical | The test {assesses} your reading skills.|bias placebo | It's hard to {assess} the damage.|bias valid",
      "access assist",
    ),
    word(
      "identify identifies identified identifying",
      "to recognize and name someone or something",
      "识别；确认",
      "The police {identified} the thief from the video.|bias valid | Can you {identify} this bird?|bias valid | Scientists {identified} the gene that causes the disease.|bias clinical",
      "identity intensify",
    ),
    word(
      "detect detects detected detecting",
      "to notice or discover something that is hard to see, hear or smell",
      "察觉；检测出",
      "The test can {detect} cancer early.|bias valid | Dogs can {detect} smells that we can't.|bias valid | I {detected} a note of anger in her voice.|bias statistical",
      "deflect protect",
    ),
    word(
      "monitor monitors monitored monitoring",
      "to watch or check something carefully over a period of time; a machine that does this",
      "监测；监视器",
      "Nurses {monitor} the patient's heart rate.|bias valid | The government {monitors} air pollution.|bias placebo | The heart {monitor} beeped.|bias valid",
      "mentor monster",
    ),
    word(
      "simulate simulates simulated simulating",
      "to create a situation like a real one, often on a computer",
      "模拟；仿真",
      "The computer {simulates} a flight.|bias valid | The game {simulates} real driving.|bias valid | Scientists {simulated} the spread of the virus.|bias statistical",
      "stimulate assimilate",
    ),
  ],
});

const mind = vocabularyTopic({
  id: "b2-words-mental-health",
  title: t("Mental Health", "心理健康"),
  summary: t(
    "Wellbeing; anxiety and depression; therapists and counseling; coping; trauma and burnout; resilience and resilient people; self-esteem and loneliness.",
    "身心健康；焦虑和抑郁；心理治疗师和心理咨询；应对；创伤和倦怠；韧性和有韧性的人；自尊和孤独。",
  ),
  prerequisites: ["b1-words-emotions"],
  words: [
    word(
      "wellbeing",
      "the state of being healthy and happy",
      "健康；幸福",
      "Exercise improves your {wellbeing}.|cope resilient | Schools should care about students' {wellbeing}.|coped resilient | Money alone doesn't bring {wellbeing}.|cope resilient",
      "wellness being",
    ),
    word(
      "anxiety anxieties",
      "a feeling of worry or fear about what might happen",
      "焦虑；担忧",
      "She suffers from {anxiety} before exams.|cope resilient | {Anxiety} can make it hard to sleep.|Cope Resilient | There is growing {anxiety} about jobs.|coped resilient",
      "anxious anxiousness",
    ),
    word(
      "depression",
      "an illness in which a person feels very sad and without hope for a long time; a time of economic difficulty",
      "抑郁症；萧条",
      "He was treated for {depression}.|cope resilient | {Depression} is more than feeling sad.|Cope Resilient | Many people suffered from {depression} after losing their jobs.|coped resilient",
      "expression impression",
    ),
    word(
      "therapist therapists",
      "a person trained to help people with mental or physical problems",
      "治疗师；心理治疗师",
      "She sees a {therapist} once a week.|cope resilient | The {therapist} helped him talk about his fears.|cope resilient | Speech {therapists} help children who have trouble speaking.|copes resilient",
      "therapy theorist",
    ),
    word(
      "counseling",
      "advice and support given by a trained person to help with personal problems",
      "心理咨询；辅导",
      "The school offers free {counseling} to students.|cope resilient | After the accident, she needed {counseling}.|coped resilient | Marriage {counseling} saved their relationship.|cope resilient",
      "counting councillor",
    ),
    word(
      "cope copes coped coping",
      "to deal successfully with a difficult situation",
      "应对；对付",
      "How do you {cope} with stress?|anxiety therapist | She {coped} well after her husband died.|wellbeing burnout | The hospital can't {cope} with so many patients.|resilience trauma",
      "copy scope",
    ),
    word(
      "trauma traumas",
      "a deep shock that has a lasting effect on the mind; a serious injury",
      "创伤；精神创伤",
      "The war left him with deep {trauma}.|cope resilient | Children need help after a {trauma}.|cope resilient | The hospital treats head {trauma}.|coped resilient",
      "drama trams",
    ),
    word(
      "burnout",
      "the state of being very tired and unable to work because of too much stress",
      "精疲力竭；职业倦怠",
      "Long hours led to {burnout}.|cope resilient | Nurses are at high risk of {burnout}.|coped resilient | Take holidays to avoid {burnout}.|cope resilient",
      "burner turnout",
    ),
    word(
      "resilience",
      "the ability to recover quickly from difficulties",
      "韧性；适应力",
      "Her {resilience} helped her recover quickly.|cope resilient | Sport builds {resilience} in children.|coped resilient | The city showed great {resilience} after the flood.|cope resilient",
      "residence reliance",
    ),
    word(
      "resilient",
      "able to recover quickly from difficulties",
      "有韧性的；能迅速恢复的",
      "Children are often more {resilient} than adults.|resilience trauma | The economy proved {resilient}.|resilience burnout | A {resilient} person keeps going after a setback.|resilience cope",
      "resistant resident",
    ),
    word(
      "self-esteem",
      "the feeling of being happy with your own character and abilities",
      "自尊；自信",
      "Praise can build children's {self-esteem}.|cope resilient | She has low {self-esteem}.|coped resilient | Losing his job hurt his {self-esteem}.|cope resilient",
      "self-steem esteem",
    ),
    word(
      "loneliness",
      "the unhappy feeling of being alone",
      "孤独；寂寞",
      "Many old people suffer from {loneliness}.|cope resilient | {Loneliness} can be as bad for health as smoking.|Cope Resilient | She wrote about the {loneliness} of city life.|coped resilient",
      "loveliness lonely",
    ),
  ],
});

const care = vocabularyTopic({
  id: "b2-words-health-systems",
  title: t("Health Systems", "医疗体系"),
  summary: t(
    "Healthcare; physicians and paramedics; the pharmaceutical industry and medication; being discharged; intensive care and rehabilitation; preventive care, screening and checkups; being insured.",
    "医疗保健；内科医生和急救人员；制药业和药物；出院；重症监护和康复；预防保健、筛查和体检；参保。",
  ),
  prerequisites: ["b1-words-healthcare"],
  words: [
    word(
      "healthcare",
      "the services that look after people's health",
      "医疗保健；卫生保健",
      "Everyone should have access to {healthcare}.|insured discharge | She works in {healthcare}.|insured intensive | {Healthcare} costs are rising.|Discharged Insure",
      "healthy welfare",
    ),
    word(
      "physician physicians",
      "a doctor, especially one who treats illnesses with medicine",
      "医生；内科医生",
      "Ask your {physician} before taking this medicine.|insured intensive | She is a {physician} at the city hospital.|preventive pharmaceutical | The {physician} examined the patient.|insured intensive",
      "physicist physical",
    ),
    word(
      "paramedic paramedics",
      "a person trained to give medical help in an emergency, often in an ambulance",
      "护理人员；急救医务人员",
      "{Paramedics} arrived within minutes.|Insured Intensive | The {paramedic} gave her oxygen in the ambulance.|insured intensive | He trained as a {paramedic}.|preventive insured",
      "paragraph parameter",
    ),
    word(
      "pharmaceutical pharmaceuticals",
      "about making and selling medicines",
      "制药的；药物",
      "She works for a {pharmaceutical} company.|physician discharge | The {pharmaceutical} industry makes huge profits.|physician discharge | New {pharmaceutical} products must be tested.|physician discharge",
      "pharmacy pharmacist",
    ),
    word(
      "medication medications",
      "a medicine or drug that you take for an illness",
      "药物；药剂",
      "Are you taking any {medication}?|insured intensive | The {medication} made her sleepy.|insured intensive | He forgot to take his {medication}.|preventive insured",
      "meditation dedication",
    ),
    word(
      "discharge discharges discharged discharging",
      "to allow a patient to leave hospital; the act of doing this",
      "准许出院；出院",
      "She was {discharged} from hospital yesterday.|insured intensive | Patients are {discharged} when they are well enough.|intensive preventive | After his {discharge}, he rested at home.|insured intensive",
      "recharge discard",
    ),
    word(
      "intensive",
      "involving a lot of effort or care in a short time",
      "密集的；加强的",
      "He spent a week in {intensive} care.|insured discharge | She took an {intensive} English course.|insured discharge | The work is labor-{intensive}.|discharge physician",
      "intense extensive",
    ),
    word(
      "rehabilitation",
      "the process of helping someone return to a normal life after an illness, an injury or prison",
      "康复；改造",
      "After the accident, she needed months of {rehabilitation}.|insured intensive | The {rehabilitation} of prisoners is important.|insured intensive | He is in a {rehabilitation} center for drug users.|insured discharge",
      "habitation rehearsal",
    ),
    word(
      "preventive",
      "intended to stop something bad from happening",
      "预防性的",
      "{Preventive} medicine stops illness before it starts.|Insured Discharge | Vaccines are a {preventive} measure.|discharge physician | We need more {preventive} health checks.|discharge physician",
      "preventable perceptive",
    ),
    word(
      "screening screenings",
      "medical tests on many people to find a disease early",
      "筛查；检查",
      "Breast cancer {screening} saves lives.|insured intensive | All newborn babies have a hearing {screening}.|insured intensive | The {screening} found the disease early.|insured intensive",
      "screen scheming",
    ),
    word(
      "checkup checkups",
      "a general medical examination to see if you are healthy",
      "体检；检查",
      "I go to the dentist for a {checkup} every six months.|insured intensive | The doctor gave me a full {checkup}.|insured intensive | Regular {checkups} can find problems early.|insured intensive",
      "checkout checkpoint",
    ),
    word(
      "insured",
      "protected by insurance, so that you get money if something bad happens",
      "已投保的；有保险的",
      "Is your car {insured}?|physician paramedic | Most workers are {insured} through their company.|physician screening | The house was {insured} against fire.|paramedic checkup",
      "ensured injured",
    ),
  ],
});

const evidence = vocabularyTopic({
  id: "b2-words-scientific-adjectives",
  title: t("Describing Evidence", "描述证据"),
  summary: t(
    "Theoretical and empirical; experimental; subjective; precise and rigorous; consistent and inconsistent; conclusive and inconclusive; plausible and hypothetical.",
    "理论的和实证的；实验的；主观的；精确的和严谨的；一致的和不一致的；决定性的和非决定性的；看似合理的和假设的。",
  ),
  prerequisites: ["b1-words-thinking"],
  words: [
    word(
      "theoretical",
      "based on ideas and theories rather than practice or experience",
      "理论的；理论上的",
      "The course is very {theoretical}, with little practical work.|verify methodology | That's only a {theoretical} risk.|verify replicate | {Theoretical} physics uses a lot of math.|Verify Replicate",
      "theatrical heretical",
    ),
    word(
      "empirical",
      "based on observation and experiments, not on theory",
      "以实验为依据的；实证的",
      "We need {empirical} evidence, not opinions.|verify replicate | The theory has strong {empirical} support.|verify correlation | {Empirical} research is based on observation.|Verify Replicate",
      "imperial empire",
    ),
    word(
      "experimental",
      "new and still being tested; using new ideas",
      "实验性的；试验的",
      "The drug is still {experimental}.|verify replicate | She plays {experimental} music.|verify placebo | The {experimental} group received the new drug.|verify replicate",
      "experiential environmental",
    ),
    word(
      "subjective",
      "based on personal feelings and opinions, not facts",
      "主观的",
      "Beauty is {subjective}.|verify replicate | His review was very {subjective}.|verify correlation | Pain is a {subjective} experience.|verify methodology",
      "subject objective",
    ),
    word(
      "precise",
      "exact and accurate",
      "精确的；确切的",
      "Give me the {precise} time.|verify methodology | Surgeons must be very {precise}.|verify methodology | To be {precise}, there were 42 people.|verify correlation",
      "precious concise",
    ),
    word(
      "rigorous",
      "very careful and thorough",
      "严格的；严谨的",
      "The drug passed {rigorous} tests.|verify methodology | The training is {rigorous}.|verify correlation | Science needs {rigorous} methods.|verify replicate",
      "vigorous rigid",
    ),
    word(
      "consistent",
      "always behaving or happening in the same way; in agreement with something",
      "一致的；始终如一的",
      "Her work is {consistent}: it is always good.|verify methodology | The results are {consistent} with the theory.|verify methodology | Parents should be {consistent} with the rules.|verify placebo",
      "persistent constant",
    ),
    word(
      "inconsistent",
      "changing too often; not in agreement with something",
      "不一致的；前后矛盾的",
      "His story was {inconsistent}: the details kept changing.|verify methodology | The results were {inconsistent} with earlier studies.|verify correlation | The team's performance has been {inconsistent} this season.|verify methodology",
      "insistent incompetent",
    ),
    word(
      "conclusive",
      "proving that something is true, so that no doubt remains",
      "决定性的；确凿的",
      "There is no {conclusive} proof.|verify methodology | The DNA test was {conclusive}.|verify methodology | The evidence is not yet {conclusive}.|verify placebo",
      "conclusion inclusive",
    ),
    word(
      "inconclusive",
      "not giving a clear result or answer",
      "非决定性的；无定论的",
      "The results were {inconclusive}, so more research is needed.|verify methodology | The vote was {inconclusive}.|verify correlation | {Inconclusive} tests mean that we must wait.|Verify Methodology",
      "inclusive incomplete",
    ),
    word(
      "plausible",
      "likely to be true; reasonable",
      "似乎合理的；可信的",
      "Her excuse sounded {plausible}.|verify methodology | That's a {plausible} explanation.|verify methodology | It is {plausible} that life exists on other planets.|verify placebo",
      "possible applause",
    ),
    word(
      "hypothetical",
      "imagined as possible, but not real",
      "假设的；假定的",
      "Let's take a {hypothetical} example.|verify methodology | That's a {hypothetical} question.|verify correlation | The danger is not {hypothetical}; it is real.|verify methodology",
      "hypocritical hypothesis",
    ),
  ],
});

const animals = vocabularyTopic({
  id: "b2-words-animals-and-people",
  title: t("Animals and People", "动物与人"),
  summary: t(
    "Cruelty and cruel treatment; humane methods; captivity and captive animals; sanctuaries and poachers; conservation and conserving; predators and prey; veterinary care.",
    "虐待和残忍的对待；人道的方法；圈养和被囚禁的动物；保护区和偷猎者；保护；捕食者和猎物；兽医护理。",
  ),
  prerequisites: ["b1-words-nature-2"],
  words: [
    word(
      "cruelty",
      "behavior that causes pain or suffering on purpose",
      "残忍；虐待",
      "{Cruelty} to animals is a crime.|Cruel Humane | The film shows the {cruelty} of war.|cruel humane | She was shocked by the {cruelty} of the guards.|cruel humane",
      "crudity cruelly",
    ),
    word(
      "cruel",
      "causing pain or suffering on purpose",
      "残忍的；残酷的",
      "It's {cruel} to keep a dog in a small cage.|cruelty captivity | Children can be very {cruel}.|cruelty prey | That was a {cruel} thing to say.|cruelty conserve",
      "crude cruise",
    ),
    word(
      "humane",
      "kind, causing as little pain as possible",
      "人道的；仁慈的",
      "We need a more {humane} way to treat prisoners.|cruelty conserve | The farm uses {humane} methods.|cruelty conserve | Is it {humane} to keep animals in zoos?|cruelty conserve",
      "human humanity",
    ),
    word(
      "captivity",
      "the state of being kept in a cage or a prison",
      "囚禁；圈养",
      "The bird was born in {captivity}.|captive conserve | Many animals don't breed in {captivity}.|captive cruel | He spent six months in {captivity} before he escaped.|captive conserve",
      "captivate activity",
    ),
    word(
      "captive captives",
      "kept as a prisoner or in a cage; a prisoner",
      "被囚禁的；俘虏",
      "The soldiers were held {captive}.|captivity cruelty | {Captive} animals often become bored.|Captivity Cruelty | The {captives} were released after the war.|captivities cruelties",
      "captain captivate",
    ),
    word(
      "sanctuary sanctuaries",
      "a safe place, especially for animals or for people in danger",
      "保护区；避难所",
      "The donkeys live in an animal {sanctuary}.|conserve cruel | The church was a {sanctuary} for refugees.|conserve cruel | The bird {sanctuary} is protected by law.|conserve cruel",
      "sanitary sanction",
    ),
    word(
      "poacher poachers",
      "a person who illegally hunts animals",
      "偷猎者",
      "{Poachers} kill elephants for their ivory.|Conserve Humane | The {poacher} was caught with ten dead birds.|conserve humane | Rangers protect rhinos from {poachers}.|conserve humane",
      "preacher poach",
    ),
    word(
      "conservation",
      "the protection of nature, wildlife or resources",
      "保护；节约",
      "Wildlife {conservation} is important.|conserve cruel | She works in marine {conservation}.|conserve cruel | Energy {conservation} saves money.|conserve cruel",
      "conversation conservative",
    ),
    word(
      "conserve conserves conserved conserving",
      "to protect something from harm or loss; to use as little as possible",
      "保护；节约",
      "We must {conserve} water.|conservation cruel | Turn off lights to {conserve} energy.|conservation sanctuary | The park was created to {conserve} wildlife.|conservation predator",
      "converse deserve",
    ),
    word(
      "predator predators",
      "an animal that kills and eats other animals",
      "捕食者；掠夺者",
      "Lions are top {predators}.|conserve humane | The rabbit hid from the {predator}.|conserve humane | Sharks are the ocean's most feared {predators}.|conserve humane",
      "predecessor prediction",
    ),
    word(
      "prey",
      "an animal that is hunted and eaten by another animal",
      "猎物；捕食",
      "The lion caught its {prey}.|conserve humane | Birds of {prey} hunt small animals.|conserve humane | Old people are easy {prey} for thieves.|conserve humane",
      "pray grey",
    ),
    word(
      "veterinary",
      "about the medical care of animals",
      "兽医的",
      "She is studying {veterinary} medicine.|prey conserve | Take the dog to a {veterinary} clinic.|prey conserve | The farm needs {veterinary} care for its cows.|prey conserve",
      "veteran vegetarian",
    ),
  ],
});

const risk = vocabularyTopic({
  id: "b2-words-risk",
  title: t("Risk and Safety", "风险与安全"),
  summary: t(
    "Precautions and safeguards; hazardous, harmful and harmless substances; lethal and fatal; contaminating and contamination; exposing and exposure; minimizing risks.",
    "预防措施和保障；有害的和无害的物质；致命的；污染；暴露；把风险降到最低。",
  ),
  prerequisites: ["b1-words-environment"],
  words: [
    word(
      "precaution precautions",
      "something done to prevent danger or problems",
      "预防措施",
      "Take {precautions} against fire.|minimizes exposes | As a {precaution}, wear gloves.|minimize expose | Safety {precautions} were ignored.|minimizes exposes",
      "prescription caution",
      "safeguard",
    ),
    word(
      "safeguard safeguards safeguarded safeguarding",
      "to protect something from harm; a thing that protects",
      "保护；保障措施",
      "New laws {safeguard} children online.|exposure contamination | We need {safeguards} against misuse.|minimizes harmful | The rules {safeguard} workers' rights.|exposure contamination",
      "safekeeping lifeguard",
      "precaution",
    ),
    word(
      "hazardous",
      "dangerous, especially to health",
      "危险的；有害的",
      "{Hazardous} waste must be stored safely.|Contaminate Exposure | The roads are {hazardous} in winter.|contaminate exposure | Smoking is {hazardous} to health.|contaminate precaution",
      "haphazard harmonious",
      "harmful",
    ),
    word(
      "harmful",
      "causing harm or damage",
      "有害的",
      "Sugar is {harmful} to your teeth.|contaminate precaution | {Harmful} chemicals were found in the water.|Contaminate Precaution | The sun's rays can be {harmful}.|contaminate precaution",
      "harmless helpful",
      "hazardous",
    ),
    word(
      "harmless",
      "not able to cause harm",
      "无害的",
      "The snake is {harmless}.|contaminate precaution | It was just a {harmless} joke.|contaminate precaution | Most bacteria are {harmless}.|contaminate exposure",
      "harmful helpless",
    ),
    word(
      "lethal",
      "causing death or able to cause death",
      "致命的；致死的",
      "The poison is {lethal} in small doses.|contaminate precaution | A {lethal} dose of the drug killed him.|contaminate precaution | The virus is {lethal} to birds.|contaminate precaution",
      "legal metal",
      "fatal",
    ),
    word(
      "fatal",
      "causing death; causing failure",
      "致命的；灾难性的",
      "The accident was {fatal}.|contaminate precaution | Making that mistake was {fatal} to his career.|contaminate precaution | The disease is often {fatal}.|contaminate exposure",
      "fetal final",
      "lethal",
    ),
    word(
      "contaminate contaminates contaminated contaminating",
      "to make something dirty or poisonous",
      "污染；弄脏",
      "Chemicals {contaminated} the river.|harmful lethal | The food was {contaminated} with bacteria.|harmful lethal | Don't {contaminate} the samples.|harmful fatal",
      "contemplate concentrate",
    ),
    word(
      "contamination",
      "the act of making something dirty or poisonous; the state of being so",
      "污染",
      "The {contamination} of the water made people ill.|harmful lethal | Wear gloves to prevent {contamination}.|harmful lethal | Tests found {contamination} in the soil.|harmful lethal",
      "concentration consultation",
    ),
    word(
      "exposure exposures",
      "being in a situation where something harmful can affect you; the effects of extreme cold",
      "暴露；接触",
      "Too much {exposure} to the sun causes skin cancer.|harmful lethal | Children's {exposure} to screens has increased.|harmful fatal | He died of {exposure} on the mountain.|harmful fatal",
      "exposition composure",
    ),
    word(
      "expose exposes exposed exposing",
      "to put someone in a situation where something harmful can affect them; to show the truth about something bad",
      "使暴露；揭露",
      "Don't {expose} your skin to the sun.|harmful lethal | Workers were {exposed} to dangerous chemicals.|harmful lethal | The journalist {exposed} the scandal.|harmful lethal",
      "oppose expire",
    ),
    word(
      "minimize minimizes minimized minimizing",
      "to make something as small as possible",
      "使减到最少；将……降到最低",
      "We must {minimize} the risks.|harmful lethal | Wear a mask to {minimize} exposure.|harmful lethal | He tried to {minimize} his mistakes.|harmful fatal",
      "maximize minimum",
    ),
  ],
});

// Modals of deduction about the present.

const joinWords = (...parts: readonly string[]) => parts.filter((p) => p !== "").join(" ");
const lower = (s: string) => (s === "I" ? s : s.charAt(0).toLowerCase() + s.slice(1));

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
const guesses: readonly (readonly [string, string, string, string, Deduction])[] = [
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

/** guessNote explains in Chinese what a modal of deduction says. */
function guessNote(right: string): string {
  if (right.startsWith("must")) return "must 表示根据证据确信是这样";
  if (right.startsWith("can't")) return "can't 表示确信不可能，不用 mustn't";
  if (right.startsWith("should")) return "should have 加过去分词表示本该做却没做";
  return "might 表示有可能，但不确定";
}

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
const doings: readonly (readonly [string, string, Deduction, string, string, string])[] = [
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

const doingChoice: readonly ChoiceItem[] = doings.map(
  ([context, s, modal, base, ing, rest]): ChoiceItem => [
    `${context} ${joinWords(s, modal, "___", rest)}.`,
    `be ${ing}`,
    [ing, `be ${base}`],
  ],
);

const deduction: TopicDef = {
  id: "modals-of-deduction",
  title: t("Must Be, Can't Be", "must be 和 can't be"),
  summary: t(
    "It must be a virus. It can't be serious. It might be an allergy. Must says what we are sure of, can't what is impossible, and might what is possible.",
    "It must be a virus. It can't be serious. It might be an allergy。must 表示确信，can't 表示不可能，might 表示有可能。",
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
        "When you guess about the present from what you can see or know, choose the modal by how sure you are:\n\n- **must**: you are sure it is true. *She has a fever. She **must** be ill.*\n- **can't**: you are sure it is not true. *He ate ten minutes ago. He **can't** be hungry.*\n- **might**, **may** or **could**: it is possible. *She **might** be busy.*\n\nThe opposite of *must* here is *can't*, not *mustn't*: *mustn't* means that something is not allowed.",
        "根据看到或知道的情况推测现在时，按把握程度选情态动词：\n\n- **must**：确信是真的。*She has a fever. She **must** be ill.*\n- **can't**：确信不是真的。*He ate ten minutes ago. He **can't** be hungry.*\n- **might**、**may** 或 **could**：有可能。*She **might** be busy.*\n\n这里 *must* 的反义是 *can't*，不是 *mustn't*：*mustn't* 表示“不允许”。中文“一定”“不可能”“可能”正好对应这三个词，但不要把“一定不是”说成 *mustn't be*。",
      ),
      choiceGenerator(
        t(
          "The words in brackets say how sure the speaker is. Choose the word for the gap.",
          "括号里的话说明说话人的把握程度。选出填入空白处的词。",
        ),
        guessChoice,
        (right, shown) => t(fill(shown, right), `${fill(shown, right)}（${guessNote(right)}）`),
      ),
    ),
    point(
      "doing",
      t("Must be doing", "must be doing"),
      t(
        "To guess about what is happening **at this moment**, use the modal with **be** and the **-ing** form:\n\n- *She isn't answering. She **must be sleeping**.*\n- *He looks calm. He **can't be worrying** about the exam.*\n\nNot *must sleeping* (the *be* is missing) and not *must be sleep*.",
        "推测**此刻正在发生**的事，用情态动词加 **be** 再加 **-ing** 形式：\n\n- *She isn't answering. She **must be sleeping**.*\n- *He looks calm. He **can't be worrying** about the exam.*\n\n不能说 *must sleeping*（缺了 *be*），也不能说 *must be sleep*。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), doingChoice, (right, shown) =>
        t(fill(shown, right), `${fill(shown, right)}（推测正在发生的事：情态动词加 be 加 -ing）`),
      ),
    ),
    point(
      "write",
      t("Writing a guess", "写出推测"),
      t(
        "Rewrite the sentence with a modal and *be*:\n\n- *I'm sure that she is tired.* → *She **must be** tired.*\n- *I'm sure that he isn't hungry.* → *He **can't be** hungry.*\n- *Perhaps it is an allergy.* → *It **might be** an allergy.* (*may* and *could* are also right.)",
        "用情态动词加 *be* 改写句子：\n\n- *I'm sure that she is tired.* → *She **must be** tired.*\n- *I'm sure that he isn't hungry.* → *He **can't be** hungry.*\n- *Perhaps it is an allergy.* → *It **might be** an allergy.*（也可以用 *may* 或 *could*。）",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Rewrite the sentence with must, can't or might.", "用 must、can't 或 might 改写句子。"),
        guessTyped,
        (right) => t(right, `${right}（${guessNote(right.split(" ").find((w) => ["must", "can't", "might"].includes(w)) ?? "")}）`),
      ),
    ),
  ],
};

// Past modals.

/** pasts are a situation, the subject, the past simple, the base form and the past participle, the rest, and the modal. */
const pasts: readonly (readonly [string, string, string, string, string, string, Deduction | "should"])[] = [
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

const pastChoice: readonly ChoiceItem[] = pasts.map(
  ([context, s, , , pp, rest, kind]): ChoiceItem => [
    `${context} ${cueOf[kind]} ${joinWords(s, "___", rest)}.`,
    `${kind} have ${pp}`,
    [`${othersOf[kind][0]} have ${pp}`, `${othersOf[kind][1]} have ${pp}`],
  ],
);

const pastFormChoice: readonly ChoiceItem[] = pasts.map(
  ([context, s, past, , pp, rest, kind]): ChoiceItem => [
    `${context} ${joinWords(s, "___", rest)}.`,
    `${kind} have ${pp}`,
    [`${kind} had ${pp}`, past === pp ? `${kind} ${pp}` : `${kind} have ${past}`],
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
        "To guess about the **past**, put **have + past participle** after the modal:\n\n- **must have**: you are sure it happened. *The streets are wet. It **must have rained**.*\n- **can't have**: you are sure it did not happen. *It was dark. He **can't have seen** us.*\n- **might have**: perhaps it happened. *She **might have gone** home.*\n\n**Should have** says that something was the right thing to do, but it did not happen: *I failed. I **should have studied** harder.*",
        "推测**过去**的事，在情态动词后用 **have + 过去分词**：\n\n- **must have**：确信发生过。*The streets are wet. It **must have rained**.*\n- **can't have**：确信没发生。*It was dark. He **can't have seen** us.*\n- **might have**：也许发生过。*She **might have gone** home.*\n\n**should have** 表示本该做却没做：*I failed. I **should have studied** harder.* 中文说“我本该更努力的”，英语不说 *I should study harder*（那是说现在和以后）。",
      ),
      choiceGenerator(
        t(
          "The words in brackets say what the speaker means. Choose the words for the gap.",
          "括号里的话说明说话人的意思。选出填入空白处的词。",
        ),
        pastChoice,
        (right, shown) => t(fill(shown, right), `${fill(shown, right)}（${guessNote(right)}）`),
      ),
    ),
    point(
      "form",
      t("Have and the past participle", "have 加过去分词"),
      t(
        "After a modal, always use **have**, never *had* or *has*, and then the **past participle**: *must have **gone***, not *must had gone* or *must have went*. In speech, *have* sounds like *of* (*must've*), but it is never written *must of*.",
        "情态动词后面一律用 **have**，不用 *had* 或 *has*，然后接**过去分词**：*must have **gone***，不是 *must had gone*，也不是 *must have went*。口语中 *have* 弱读，听起来像 *of*（*must've*），但绝不能写成 *must of*。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), pastFormChoice, (right, shown) =>
        t(fill(shown, right), `${fill(shown, right)}（情态动词加 have 加过去分词）`),
      ),
    ),
    point(
      "write",
      t("Writing about the past with a modal", "用情态动词写过去的事"),
      t(
        "Rewrite the sentence with a modal, *have* and the past participle:\n\n- *I'm sure that she missed the bus.* → *She **must have missed** the bus.*\n- *It's impossible that he saw us.* → *He **can't have seen** us.*\n- *Perhaps she went home.* → *She **might have gone** home.*\n- *I didn't study harder, and that was a mistake.* → *I **should have studied** harder.*",
        "用情态动词加 *have* 加过去分词改写句子：\n\n- *I'm sure that she missed the bus.* → *She **must have missed** the bus.*\n- *It's impossible that he saw us.* → *He **can't have seen** us.*\n- *Perhaps she went home.* → *She **might have gone** home.*\n- *I didn't study harder, and that was a mistake.* → *I **should have studied** harder.*",
      ),
      typedGenerator(
        "sentence-pattern",
        t(
          "Rewrite the sentence with must have, can't have, might have or should have.",
          "用 must have、can't have、might have 或 should have 改写句子。",
        ),
        pastTyped,
        (right) =>
          t(right, `${right}（${guessNote(right.split(" ").find((w) => ["must", "can't", "might", "should"].includes(w)) ?? "")}）`),
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
