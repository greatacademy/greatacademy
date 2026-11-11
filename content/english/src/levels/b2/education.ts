// B2, unit 6: Education and Opportunity. Higher education, understanding, assessment, opportunity, teaching, growing
// up, abstract nouns, verbs of thinking, digital learning, vocations and character; mixed conditionals; the
// for-and-against essay. Its other topics, appositives and the counterclaim paragraph, already exist.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { fill, judgedTopic } from "../a2/kit.ts";
import { interleave, vocabularyTopic, word } from "../words.ts";

const university = vocabularyTopic({
  id: "b2-words-higher-education",
  title: t("Higher Education", "高等教育"),
  summary: t(
    "Undergraduates and postgraduates; bachelor's, master's and doctorates; theses and dissertations; faculties and tuition; lectures and seminars; academic work.",
    "本科生和研究生；学士、硕士和博士学位；论文和学位论文；院系和学费；讲座和研讨课；学术工作。",
  ),
  prerequisites: ["b1-words-school-life"],
  words: [
    word(
      "undergraduate undergraduates",
      "a university student studying for a first degree",
      "本科生",
      "She is an {undergraduate} at Oxford.|seminar faculty | Most {undergraduates} live on campus in their first year.|seminars faculties | The course is open to {undergraduates} and postgraduates.|seminars lectures",
      "underground graduate",
      "postgraduate",
    ),
    word(
      "postgraduate postgraduates",
      "a student who already has a first degree and is studying for a higher one",
      "研究生",
      "He is a {postgraduate} student in physics.|tuition lecture | The university has three thousand {postgraduates}.|lectures theses | {Postgraduates} often teach first-year classes.|Lectures Seminars",
      "postpone graduate",
      "undergraduate",
    ),
    word(
      "bachelor bachelors",
      "a first university degree; a man who has never married",
      "学士（学位）；单身汉",
      "She has a {bachelor}'s degree in history.|faculty tuition | A {bachelor}'s degree usually takes three or four years.|faculty seminar | After his {bachelor}'s, he started work.|faculty seminar",
      "butcher batch",
      "master",
    ),
    word(
      "master masters",
      "a university degree after the first one; a person very skilled at something",
      "硕士（学位）；大师",
      "He is studying for a {master}'s in law.|lecture faculty | She did her {master}'s in Paris.|seminar faculty | He is a {master} of the violin.|tuition faculty",
      "muster mastery",
      "bachelor",
    ),
    word(
      "doctorate doctorates",
      "the highest university degree, a PhD",
      "博士学位",
      "She earned her {doctorate} in chemistry at twenty-eight.|tuition seminar | A {doctorate} takes at least three years of research.|lecture seminar | He was given an honorary {doctorate}.|tuition lecture",
      "doctrine dictator",
    ),
    word(
      "thesis",
      "a long piece of writing for a university degree; the main idea of an argument",
      "（学位）论文；论点",
      "She wrote her {thesis} on Chinese poetry.|faculty tuition | His {thesis} is that cities make people lonely.|faculty tuition | He spent four years on his doctoral {thesis}.|faculty tuition",
      "theme thesaurus",
      "dissertation",
    ),
    word(
      "dissertation dissertations",
      "a long piece of writing on one subject, especially for a university degree",
      "学位论文",
      "My {dissertation} is due in May.|tuition faculty | Students write a {dissertation} in their final year.|tuition faculty | She read hundreds of {dissertations} on the subject.|faculties tuitions",
      "discussion dissemination",
      "thesis",
    ),
    word(
      "faculty faculties",
      "a group of departments in a university; all the teachers of a university",
      "（大学的）院系；全体教员",
      "She teaches in the {faculty} of law.|tuition thesis | The {faculty} voted against the plan.|tuition thesis | The university has six {faculties}.|tuitions theses",
      "facility factory",
    ),
    word(
      "tuition",
      "teaching, especially to one person or a small group; the money paid for it",
      "学费；（个别）教学",
      "{Tuition} fees have risen again.|Faculty Thesis | She gets extra {tuition} in math.|faculty thesis | The scholarship covers {tuition} and housing.|thesis faculty",
      "intuition tradition",
    ),
    word(
      "lecture lectures",
      "a talk to students or other people about a subject",
      "讲座；讲课",
      "The {lecture} starts at nine in the main hall.|thesis tuition | I missed two {lectures} last week.|theses tuitions | She gave a {lecture} on climate change.|tuition thesis",
      "lecturer lecher",
      "seminar",
    ),
    word(
      "seminar seminars",
      "a class in which a small group of students discuss a subject with a teacher",
      "研讨课；研讨会",
      "Twelve students take part in the {seminar}.|thesis tuition | We discuss the readings in our weekly {seminar}.|thesis tuition | She led a {seminar} on modern art.|thesis tuition",
      "seminary semester",
      "lecture",
    ),
    word(
      "academic",
      "connected with education, especially at a university; a teacher at a university",
      "学术的；大学教师",
      "The {academic} year starts in September.|undergraduate tuition | Her {academic} results are excellent.|tuition faculty | He is a well-known {academic} at Harvard.|tuition thesis",
      "acrobatic academy",
    ),
  ],
});

const understanding = vocabularyTopic({
  id: "b2-words-learning-2",
  title: t("Understanding", "理解"),
  summary: t(
    "Comprehension and comprehending; acquiring a language and its acquisition; retaining, recalling and absorbing; grasping an idea; insights; intellectual and cognitive skills; literacy.",
    "理解和领会；习得语言；记住、回忆和吸收；领会概念；洞见；智力和认知能力；读写能力。",
  ),
  prerequisites: ["b1-words-learning"],
  words: [
    word(
      "comprehension",
      "the ability to understand something; an exercise that tests it",
      "理解（力）；理解练习",
      "The test checks reading {comprehension}.|literacy acquisition | The problem is beyond my {comprehension}.|literacy acquisition | We did a listening {comprehension} in class.|literacy insight",
      "compression comprehensive",
      "grasp",
    ),
    word(
      "comprehend comprehends comprehended comprehending",
      "to understand something fully",
      "理解；领会",
      "I couldn't {comprehend} what had happened.|retain absorb | She can't {comprehend} why he left.|retain absorb | Small children cannot {comprehend} death.|retain recall",
      "comprise apprehend",
      "grasp",
    ),
    word(
      "acquire acquires acquired acquiring",
      "to get or learn something, such as a skill or a language",
      "获得；习得",
      "Children {acquire} languages quickly.|recall literacy | She {acquired} a taste for coffee in Italy.|recalled comprehended | He has {acquired} new skills at work.|recalled comprehended",
      "inquire require",
      "acquisition",
    ),
    word(
      "acquisition",
      "the act of learning or getting something; something bought by a company or a museum",
      "习得；获得物",
      "Language {acquisition} starts at birth.|literacy insight | The {acquisition} of new skills takes time.|literacy comprehension | The painting is the museum's latest {acquisition}.|literacy insight",
      "accusation requisition",
      "acquire",
    ),
    word(
      "retain retains retained retaining",
      "to keep something; to remember information",
      "保持；记住",
      "I learn new words easily, but I can't {retain} them for long.|acquire grasp | The town has {retained} its old charm.|acquired grasped | Clay {retains} water.|comprehends grasps",
      "obtain detain",
    ),
    word(
      "recall recalls recalled recalling",
      "to remember something",
      "回想；回忆起",
      "I can't {recall} his name.|absorb acquire | She {recalled} the day she met him.|absorbed acquired | As far as I {recall}, the meeting was on Tuesday.|absorb acquire",
      "recoil refill",
      "retain",
    ),
    word(
      "absorb absorbs absorbed absorbing",
      "to take in a liquid or information; to keep someone's attention completely",
      "吸收；使全神贯注",
      "A sponge {absorbs} water.|recalls grasps | The new students had to {absorb} a lot of information on their first day.|recall insight | She was {absorbed} in her book.|recalled comprehended",
      "observe adsorb",
    ),
    word(
      "grasp grasps grasped grasping",
      "to understand something; to hold something tightly",
      "领会；抓牢",
      "He quickly {grasped} the main idea.|acquired retained | She {grasped} my hand.|recalled absorbed | Do you {grasp} how serious this is?|acquire absorb",
      "gasp grass",
      "comprehend",
    ),
    word(
      "insight insights",
      "a clear and deep understanding of something",
      "洞察；洞见",
      "The book gives an {insight} into life in prison.|literacy comprehension | Her {insights} into the problem helped us.|literacies acquisitions | He showed great {insight} in his answer.|literacy acquisition",
      "incite insert",
    ),
    word(
      "intellectual",
      "connected with the ability to think and understand ideas",
      "智力的；理智的",
      "Chess is an {intellectual} challenge.|literacy insight | She enjoys {intellectual} conversation.|literacy insight | The {intellectual} development of children is fast.|literacy comprehension",
      "intelligible intentional",
      "cognitive",
    ),
    word(
      "cognitive",
      "connected with thinking, learning and remembering",
      "认知的",
      "Sleep improves {cognitive} skills.|literacy insight | Old age can bring {cognitive} decline.|literacy insight | {Cognitive} science studies the mind.|Literacy Insight",
      "cogent connective",
      "intellectual",
    ),
    word(
      "literacy",
      "the ability to read and write",
      "读写能力；识字",
      "Adult {literacy} has risen to ninety percent.|insight comprehension | The program teaches {literacy} to children.|insight acquisition | Digital {literacy} is now as important as reading.|insight comprehension",
      "literary liberty",
    ),
  ],
});

const assessment = vocabularyTopic({
  id: "b2-words-assessment",
  title: t("Assessment", "评估"),
  summary: t(
    "Assessments and evaluations; criteria and rubrics; feedback; plagiarism; qualifying and credentials; transcripts; standardized tests; aptitude and numeracy.",
    "评估和评价；标准和评分细则；反馈；抄袭；取得资格和资质证明；成绩单；标准化考试；天资和算术能力。",
  ),
  prerequisites: ["b1-words-study-skills"],
  words: [
    word(
      "assessment assessments",
      "a judgment of the quality or the level of something",
      "评估；评价",
      "The course has no final exam, only continuous {assessment}.|plagiarism numeracy | An {assessment} of the damage is under way.|aptitude credential | Teachers wrote {assessments} of every pupil.|transcripts rubrics",
      "assignment assortment",
      "evaluation",
    ),
    word(
      "evaluation evaluations",
      "a careful study of how good or useful something is",
      "评价；评估",
      "The {evaluation} showed that the program works.|plagiarism numeracy | Students fill in an {evaluation} of the course.|plagiarism aptitude | Regular {evaluations} help staff improve.|credentials transcripts",
      "elevation evacuation",
      "assessment",
    ),
    word(
      "criterion criteria",
      "a standard by which you judge something",
      "标准；准则",
      "Price is not the only {criterion}.|feedback numeracy | The essay meets all the {criteria}.|feedback plagiarisms | What are the {criteria} for choosing students?|feedback numeracy",
      "critic crimson",
      "rubric",
    ),
    word(
      "rubric rubrics",
      "a table that shows how a piece of work will be marked",
      "评分细则；评分量表",
      "The {rubric} gives points for grammar and ideas.|plagiarism aptitude | Check your essay against the {rubric}.|plagiarism numeracy | Teachers share {rubrics} before the task.|plagiarisms numeracies",
      "rubber cubic",
      "criterion",
    ),
    word(
      "feedback",
      "advice or criticism about how well someone has done something",
      "反馈；意见",
      "The teacher gives useful {feedback} on every essay.|plagiarism aptitude | We welcome your {feedback} on our service.|plagiarism aptitude | Positive {feedback} builds confidence.|plagiarism numeracy",
      "feedstock fallback",
    ),
    word(
      "plagiarism",
      "copying someone else's work and pretending it is your own",
      "抄袭；剽窃",
      "{Plagiarism} can get you expelled.|Feedback Aptitude | The software checks essays for {plagiarism}.|feedback aptitude | He was accused of {plagiarism}.|feedback numeracy",
      "pragmatism playwright",
    ),
    word(
      "qualify qualifies qualified qualifying",
      "to pass the exams or tests needed for a job or a competition; to have the right to do something",
      "取得资格；有资格",
      "She {qualified} as a nurse last year.|assessed evaluated | The team failed to {qualify} for the World Cup.|assess evaluate | Do I {qualify} for a discount?|assess evaluate",
      "quantify quality",
    ),
    word(
      "credential credentials",
      "a document or a qualification that shows you are able to do something",
      "资质证明；资历",
      "The job requires teaching {credentials}.|rubrics transcripts | Check the doctor's {credentials}.|rubrics plagiarisms | She has strong academic {credentials}.|rubrics aptitudes",
      "credible confidential",
      "transcript",
    ),
    word(
      "transcript transcripts",
      "an official record of a student's courses and grades; a written copy of something spoken",
      "成绩单；文字记录",
      "Send your {transcript} with the application.|rubric aptitude | The university asked for my high school {transcripts}.|rubrics aptitudes | A {transcript} of the interview was published.|rubric criterion",
      "transport transcribe",
      "credential",
    ),
    word(
      "standardized",
      "the same for everyone, so that results can be compared",
      "标准化的",
      "{Standardized} tests are used for university entry.|Qualified Credible | The forms are {standardized} across the country.|qualified credible | Critics say {standardized} testing narrows teaching.|qualified credible",
      "specialized stabilized",
    ),
    word(
      "aptitude",
      "a natural ability to learn or do something",
      "天资；才能",
      "She has an {aptitude} for languages.|feedback rubric | The job begins with an {aptitude} test.|plagiarism feedback | He showed no {aptitude} for math.|feedback rubric",
      "attitude altitude",
    ),
    word(
      "numeracy",
      "the ability to work with numbers",
      "计算能力；算术能力",
      "The program improves {numeracy} and literacy.|plagiarism feedback | Basic {numeracy} is needed for most jobs.|plagiarism rubric | The test checks {numeracy} skills.|plagiarism transcript",
      "numerous accuracy",
    ),
  ],
});

const opportunity = vocabularyTopic({
  id: "b2-words-opportunity",
  title: t("Opportunity", "机会"),
  summary: t(
    "Privilege, the privileged and the disadvantaged; social mobility; equal chances and merit; barriers; inclusive schools and inclusion; excluding people; quotas; being eligible.",
    "特权、享有特权的人和弱势群体；社会流动；平等的机会和才能；障碍；包容的学校和包容；排斥他人；配额；有资格。",
  ),
  prerequisites: ["b2-words-social-issues"],
  words: [
    word(
      "privilege privileges",
      "a special right or advantage that only some people have",
      "特权；荣幸",
      "Education should be a right, not a {privilege}.|quota barrier | Members enjoy special {privileges}.|quotas barriers | It's a {privilege} to work with you.|quota barrier",
      "privacy pilgrim",
      "privileged",
    ),
    word(
      "privileged",
      "having more money and chances than most people",
      "享有特权的；优越的",
      "He grew up in a {privileged} family.|eligible inclusive | Only {privileged} children could go to university then.|eligible inclusive | I feel {privileged} to be here.|disadvantaged eligible",
      "privatized pillaged",
      "privilege",
    ),
    word(
      "disadvantaged",
      "having less money and fewer chances than other people",
      "处于不利地位的；弱势的",
      "The charity helps {disadvantaged} children.|eligible equal | Students from {disadvantaged} areas get extra support.|eligible inclusive | The policy helps the most {disadvantaged} families.|eligible equal",
      "advantaged discouraged",
      "privileged",
    ),
    word(
      "mobility",
      "the ability to move from one place, job or social class to another",
      "流动性；活动能力",
      "Education increases social {mobility}.|merit quota | The illness affected her {mobility}.|merit inclusion | Job {mobility} is high in the city.|merit quota",
      "nobility mobile",
    ),
    word(
      "equal",
      "the same in size, number, value or rights",
      "平等的；相等的",
      "All citizens have {equal} rights.|eligible disadvantaged | Men and women should get {equal} pay.|eligible inclusive | Cut the cake into eight {equal} pieces.|eligible inclusive",
      "equate equip",
    ),
    word(
      "merit merits",
      "a good quality that deserves praise; being good enough to deserve something",
      "优点；价值",
      "Places are given on {merit}, not money.|mobility quota | The plan has many {merits}.|quotas barriers | We should judge each idea on its {merits}.|quotas barriers",
      "metric mermaid",
    ),
    word(
      "barrier barriers",
      "something that stops people from doing something or going somewhere",
      "障碍；屏障",
      "Cost is the main {barrier} to university.|merit quota | The police put up {barriers} around the square.|merits quotas | Language can be a {barrier} to making friends.|merit quota",
      "barrel carrier",
    ),
    word(
      "inclusive",
      "including everyone, without leaving out any group",
      "包容的；包括一切的",
      "We want an {inclusive} school where every child belongs.|eligible equal | The festival is open and {inclusive}.|eligible privileged | The price is {inclusive} of breakfast.|eligible privileged",
      "conclusive exclusive",
      "inclusion",
    ),
    word(
      "inclusion",
      "the act of including someone or something, especially people who are often left out",
      "包括；包容",
      "The school supports the {inclusion} of children with disabilities.|mobility merit | Her {inclusion} in the team surprised everyone.|mobility barrier | The policy aims at social {inclusion}.|mobility merit",
      "intrusion illusion",
      "inclusive",
    ),
    word(
      "exclude excludes excluded excluding",
      "to keep someone out or leave something out",
      "排斥；排除",
      "Girls were {excluded} from the school until 1970.|qualified included | The price {excludes} taxes.|qualifies merits | Don't {exclude} anyone from the game.|include qualify",
      "exude explode",
    ),
    word(
      "quota quotas",
      "a fixed number or amount of people or things that is allowed or needed",
      "配额；定额",
      "The university has a {quota} for students from poor areas.|merit barrier | Fishing {quotas} protect the fish.|merits barriers | Each country has a {quota} of tickets.|merit mobility",
      "quote quorum",
    ),
    word(
      "eligible",
      "having the right to do or get something",
      "有资格的；合格的",
      "You are {eligible} for a grant if your family earns less than 30,000 dollars a year.|inclusive equal | Only students over sixteen are {eligible} to apply.|inclusive equal | Is he {eligible} to vote?|inclusive privileged",
      "illegible elegant",
    ),
  ],
});

const teaching = vocabularyTopic({
  id: "b2-words-teaching",
  title: t("Teaching", "教学"),
  summary: t(
    "The curriculum and the syllabus; instructing and instructors; mentors; discipline; motivating, engaging and inspiring students; motivation and encouragement; attentive pupils.",
    "课程体系和教学大纲；教导和教练；导师；纪律；激励、吸引和启发学生；动力和鼓励；专心的学生。",
  ),
  prerequisites: ["b1-words-school-people"],
  words: [
    word(
      "curriculum curricula",
      "all the subjects that are taught in a school or a course",
      "课程体系；全部课程",
      "Coding is now part of the school {curriculum}.|mentor encouragement | The national {curriculum} sets what pupils learn.|mentor discipline | Schools design their own {curricula}.|mentors instructors",
      "currency criterion",
      "syllabus",
    ),
    word(
      "syllabus syllabuses",
      "a list of the topics in a course or an exam",
      "教学大纲",
      "The {syllabus} for the exam is online.|mentor motivation | We haven't covered half the {syllabus} yet.|mentor motivation | Teachers follow different {syllabuses}.|mentors instructors",
      "syllable stimulus",
      "curriculum",
    ),
    word(
      "instruct instructs instructed instructing",
      "to teach someone a practical skill; to tell someone officially to do something",
      "指导；指示",
      "She {instructs} new pilots in how to land.|motivates engages | The police {instructed} us to leave.|engaged attentive | He was {instructed} to wait outside.|engaged attentive",
      "instruction construct",
    ),
    word(
      "instructor instructors",
      "a person who teaches a practical skill, such as driving or swimming",
      "教练；指导者",
      "My driving {instructor} is very patient.|curriculum syllabus | Ski {instructors} work in the mountains in winter.|curricula syllabuses | The yoga {instructor} showed us the pose.|curriculum syllabus",
      "inspector constructor",
      "mentor",
    ),
    word(
      "mentor mentors",
      "an experienced person who advises and helps a less experienced one",
      "导师；指导者",
      "Every new teacher has a {mentor}.|syllabus curriculum | She was my {mentor} when I started work.|syllabus curriculum | {Mentors} meet the students once a week.|Syllabuses Curricula",
      "mentality monitor",
      "instructor",
    ),
    word(
      "discipline disciplines",
      "training people to obey rules; control of your own behavior; a subject of study",
      "纪律；自律；学科",
      "The school is known for strict {discipline}.|encouragement motivation | Learning an instrument takes {discipline}.|curriculum syllabus | History and law are different {disciplines}.|syllabuses mentors",
      "disciple principle",
    ),
    word(
      "motivate motivates motivating",
      "to make someone want to do something",
      "激励；使有动力",
      "Good teachers {motivate} their students.|attentive curriculum | Money doesn't {motivate} everyone.|instruct attentive | The coach is good at {motivating} young players.|attentive curriculum",
      "motive moderate",
      "inspire",
    ),
    word(
      "motivation",
      "the wish or the energy to do something",
      "动力；积极性",
      "Many students lack {motivation}.|discipline curriculum | What is your {motivation} for learning English?|discipline curriculum | Praise is a strong {motivation}.|discipline syllabus",
      "moderation motion",
      "encouragement",
    ),
    word(
      "engage engages engaging",
      "to get and keep someone's interest; to take part in something",
      "吸引；使参与",
      "The teacher uses games to {engage} the class.|mentor attentive | It's hard to {engage} teenagers in politics.|mentor attentive | She is an {engaging} speaker.|instructing attentive",
      "enrage enlarge",
      "inspire",
    ),
    word(
      "inspire inspires inspired",
      "to give someone the wish and the ideas to do something",
      "激励；启发",
      "Her story {inspired} me to become a doctor.|engaged attentive | Great teachers {inspire} their students.|attentive curriculum | The film is {inspired} by a true story.|instructed engaged",
      "inspect expire",
      "motivate",
    ),
    word(
      "encouragement",
      "words or actions that give someone confidence",
      "鼓励",
      "With a little {encouragement}, she began to sing.|discipline curriculum | Thanks for your {encouragement}.|discipline curriculum | Children need praise and {encouragement}.|curriculum syllabus",
      "enforcement engagement",
      "motivation",
    ),
    word(
      "attentive",
      "listening or watching carefully",
      "专心的；注意的",
      "The students were quiet and {attentive}.|motivating curriculum | An {attentive} waiter brought us water.|instructor encouragement | Be {attentive} to your customers' needs.|motivated engaging",
      "attractive tentative",
    ),
  ],
});

const growing = vocabularyTopic({
  id: "b2-words-growing-up",
  title: t("Growing Up", "成长"),
  summary: t(
    "Maturity; nurturing and fostering children; playful, obedient and rebellious children; peers and bullies; tantrums; curiosity; milestones and formative years.",
    "成熟；养育和抚养孩子；爱玩的、听话的和叛逆的孩子；同龄人和欺凌者；发脾气；好奇心；里程碑和成长的关键时期。",
  ),
  prerequisites: ["b1-words-family-life"],
  words: [
    word(
      "maturity",
      "the state of being an adult or of behaving like a sensible adult",
      "成熟",
      "She shows great {maturity} for her age.|curiosity tantrum | Boys reach physical {maturity} later than girls.|curiosity peer | He lacks the {maturity} to handle money.|curiosity milestone",
      "majority mutiny",
    ),
    word(
      "nurture nurtures nurtured nurturing",
      "to care for and help someone or something grow",
      "养育；培养",
      "Parents {nurture} their children's talents.|bully rebel | The school {nurtures} young musicians.|bullies rebels | She {nurtured} the plants carefully.|bullied rebelled",
      "nature torture",
      "foster",
    ),
    word(
      "foster fosters fostered fostering",
      "to look after someone else's child in your home for a time; to help something develop",
      "代养；促进",
      "They {foster} children who can't live with their parents.|bully tantrum | Sport {fosters} team spirit.|bullies peers | He was {fostered} by a family in Leeds.|rebelled peered",
      "faster roster",
      "nurture",
    ),
    word(
      "playful",
      "full of fun; not serious",
      "爱玩的；开玩笑的",
      "The puppy is very {playful}.|obedient formative | She gave him a {playful} push.|formative obedient | His tone was {playful}, not angry.|formative obedient",
      "plentiful painful",
    ),
    word(
      "obedient",
      "doing what you are told to do",
      "听话的；顺从的",
      "The dog is very {obedient}.|rebellious formative | He was an {obedient} child.|rebellious formative | Soldiers must be {obedient}.|rebellious formative",
      "obedience expedient",
      "rebellious",
    ),
    word(
      "rebellious",
      "not willing to obey rules or people in charge",
      "叛逆的；反抗的",
      "{Rebellious} teenagers often fight with their parents.|Obedient Formative | She went through a {rebellious} phase.|obedient curiosity | The {rebellious} soldiers took the city.|obedient formative",
      "religious rebellion",
      "obedient",
    ),
    word(
      "peer peers",
      "a person of the same age or position as you",
      "同龄人；同辈",
      "Teenagers care what their {peers} think.|tantrums milestones | {Peer} pressure made him start smoking.|Tantrum Milestone | She was respected by her {peers}.|tantrums milestones",
      "pier pear",
    ),
    word(
      "bully bullies bullied bullying",
      "to hurt or frighten someone weaker, again and again; a person who does this",
      "欺负；恃强凌弱者",
      "He was {bullied} at school.|nurtured fostered | Schools must stop {bullying}.|nurturing fostering | The {bully} took his lunch money.|tantrum milestone",
      "belly bulky",
    ),
    word(
      "tantrum tantrums",
      "a sudden fit of anger, especially by a young child",
      "（小孩）发脾气",
      "The toddler had a {tantrum} in the shop.|milestone peer | Two-year-olds often have {tantrums}.|milestones peers | He threw a {tantrum} when he lost.|milestone peer",
      "tandem tantalum",
    ),
    word(
      "curiosity",
      "the wish to know or learn about something",
      "好奇心",
      "Children are full of {curiosity}.|maturity tantrum | Out of {curiosity}, I opened the box.|maturity milestone | {Curiosity} drives science.|Maturity Tantrum",
      "curious security",
    ),
    word(
      "milestone milestones",
      "a very important stage or event in a person's life or a process",
      "里程碑；重要事件",
      "Walking is an important {milestone} for a baby.|tantrum peer | Leaving home is a big {milestone}.|tantrum peer | The company reached a {milestone}: one million users.|tantrum peer",
      "millstone limestone",
    ),
    word(
      "formative",
      "having an important effect on the way someone or something develops",
      "对成长有重要影响的；形成期的",
      "She spent her {formative} years in Kenya.|obedient playful | School is a {formative} experience.|obedient rebellious | His {formative} influences were his grandparents.|obedient rebellious",
      "formal normative",
    ),
  ],
});

const abstracts = vocabularyTopic({
  id: "b2-words-abstract-nouns",
  title: t("Abstract Nouns", "抽象名词"),
  summary: t(
    "Concepts and notions; aspects, factors and features; dimensions; frameworks and contexts; perspectives and approaches; issues; phenomena; kinds of things and the main ones.",
    "概念和观念；方面、因素和特点；维度；框架和背景；视角和方法；问题；现象；种类和主要的。",
  ),
  prerequisites: ["b1-words-thinking"],
  words: [
    word(
      "concept concepts",
      "an idea of what something is or how it works",
      "概念",
      "The {concept} of time is hard for children.|factor phenomenon | Freedom is a difficult {concept} to define.|factor context | The book explains basic {concepts} in physics.|factors contexts",
      "concert conceit",
      "notion",
    ),
    word(
      "notion notions",
      "an idea or a belief, often one that is not quite right",
      "观念；想法",
      "The {notion} that girls can't do math is wrong.|factor dimension | He has some strange {notions} about money.|factors frameworks | I had no {notion} of what she meant.|factor framework",
      "motion lotion",
      "concept",
    ),
    word(
      "aspect aspects",
      "one part or side of a situation, an idea or a problem",
      "方面",
      "Cost is an important {aspect} of the plan.|context phenomenon | We discussed every {aspect} of the problem.|context framework | Music is an {aspect} of every culture.|context approach",
      "aspen expect",
      "feature",
    ),
    word(
      "factor factors",
      "one of the things that cause or influence something",
      "因素",
      "Price is a key {factor} in choosing a phone.|notion framework | Many {factors} affect your health.|notions frameworks | Luck was a {factor} in her success.|notion framework",
      "factory actor",
      "aspect",
    ),
    word(
      "feature features",
      "an important or typical part of something; a part of the face",
      "特点；特征；五官",
      "The phone has some useful new {features}.|notions contexts | A large garden is the main {feature} of the house.|notion context | Her eyes are her best {feature}.|notion context",
      "future fracture",
      "aspect",
    ),
    word(
      "dimension dimensions",
      "an aspect of a situation; a measurement such as length or width",
      "方面；维度；尺寸",
      "The problem has a political {dimension}.|framework phenomenon | Measure the {dimensions} of the room.|frameworks notions | Music adds a new {dimension} to the film.|framework notion",
      "detention mention",
    ),
    word(
      "framework frameworks",
      "a set of ideas or rules that you use to make decisions; a structure that supports something",
      "框架；体系",
      "The law gives a {framework} for protecting workers.|phenomenon notion | The theory provides a useful {framework}.|phenomenon notion | The bridge has a steel {framework}.|phenomenon notion",
      "freework fieldwork",
    ),
    word(
      "context contexts",
      "the situation in which something happens, which helps you understand it",
      "背景；语境",
      "You can guess the word's meaning from the {context}.|feature factor | His words were taken out of {context}.|feature factor | The events must be seen in their historical {context}.|feature dimension",
      "contest content",
    ),
    word(
      "perspective perspectives",
      "a way of thinking about something",
      "视角；观点",
      "Try to see it from my {perspective}.|framework phenomenon | The book offers a fresh {perspective} on history.|phenomenon context | Living abroad gave her a new {perspective}.|phenomenon framework",
      "prospective respective",
      "approach",
    ),
    word(
      "approach approaches approached approaching",
      "a way of dealing with something; to come near",
      "方法；接近",
      "We need a new {approach} to teaching reading.|phenomenon notion | Winter is {approaching}.|featuring framing | A man {approached} me in the street.|featured framed",
      "reproach broach",
      "perspective",
    ),
    word(
      "issue issues",
      "a subject or a problem that people discuss",
      "问题；议题",
      "Climate change is a global {issue}.|notion framework | We discussed several {issues} at the meeting.|notions frameworks | Money is not the {issue}.|framework notion",
      "tissue isle",
    ),
    word(
      "phenomenon phenomena",
      "something that happens or exists, especially something unusual or interesting",
      "现象",
      "The northern lights are a natural {phenomenon}.|framework notion | Online shopping is a recent {phenomenon}.|framework dimension | Scientists study strange {phenomena} in space.|frameworks notions",
      "pheromone phantom",
    ),
    word(
      "kinds",
      "types or sorts of something; the plural of the noun kind, as in all kinds of",
      "种类；各种",
      "The shop sells all {kinds} of tea, from green to black.|frameworks notions | There are two {kinds} of people: those who plan and those who don't.|frameworks contexts | Scientists have found new {kinds} of bacteria in the ocean.|frameworks contexts",
      "kings kinsmen",
    ),
    word(
      "main",
      "most important or largest",
      "主要的",
      "The {main} reason I moved was the job.|countless numerous | The {main} road through the town is always busy.|countless numerous | Rice is the {main} food in many Asian countries.|countless numerous",
      "mane maim",
    ),
  ],
});

const thinking = vocabularyTopic({
  id: "b2-words-thinking-verbs",
  title: t("Verbs of Thinking", "思维动词"),
  summary: t(
    "Interpreting, clarifying and elaborating; categorizing and classifying; distinguishing and differentiating; integrating and synthesizing; formulating, generalizing and inferring.",
    "解读、澄清和详细说明；归类和分类；区分和辨别；整合和综合；构想、概括和推断。",
  ),
  prerequisites: ["b1-words-thinking"],
  words: [
    word(
      "interpret interprets interpreted interpreting",
      "to explain or decide what something means; to translate what someone says",
      "解读；口译",
      "How do you {interpret} the poem's last line?|categorize integrate | Her silence was {interpreted} as a yes.|integrated synthesized | He {interprets} for the president.|categorizes synthesizes",
      "interrupt interpose",
    ),
    word(
      "clarify clarifies clarified clarifying",
      "to make something clearer or easier to understand",
      "澄清；阐明",
      "Could you {clarify} what you mean?|classify integrate | The minister {clarified} her position.|classified synthesized | Let me {clarify} one point.|categorize integrate",
      "classify glorify",
      "elaborate",
    ),
    word(
      "elaborate elaborates elaborated elaborating",
      "to give more details about something",
      "详细说明",
      "Could you {elaborate} on that idea?|classify infer | She refused to {elaborate}.|classify integrate | He {elaborated} on his plans for the company.|classified integrated",
      "collaborate evaporate",
      "clarify",
    ),
    word(
      "categorize categorizes categorized categorizing",
      "to put people or things into groups by type",
      "将……归类",
      "The books are {categorized} by subject.|inferred elaborated | We {categorize} the animals by what they eat.|infer elaborate | It's hard to {categorize} her music.|infer elaborate",
      "catechize characterize",
      "classify",
    ),
    word(
      "classify classifies classified classifying",
      "to put things into groups; to say officially that information is secret",
      "分类；把……列为机密",
      "Scientists {classify} plants into families.|infer elaborate | The documents are {classified}.|inferred elaborated | The storm was {classified} as a hurricane.|inferred elaborated",
      "clarify glassy",
      "categorize",
    ),
    word(
      "distinguish distinguishes distinguished distinguishing",
      "to see or show the difference between things",
      "区分；辨别",
      "Can you {distinguish} between the twins?|integrate formulate | Colorblind people can't {distinguish} red from green.|integrate formulate | What {distinguishes} this phone from the others?|integrates formulates",
      "extinguish distinct",
      "differentiate",
    ),
    word(
      "differentiate differentiates differentiated differentiating",
      "to see or show the difference between things; to treat them differently",
      "区分；区别对待",
      "It's hard to {differentiate} fact from opinion online.|integrate formulate | The law doesn't {differentiate} between adults and children.|integrate synthesize | What {differentiates} the two products?|integrates formulates",
      "difference deferential",
      "distinguish",
    ),
    word(
      "integrate integrates integrated integrating",
      "to combine things so that they work together; to become part of a group",
      "整合；融入",
      "The app {integrates} with your calendar.|infers elaborates | It took years to {integrate} into the new country.|infer elaborate | The course {integrates} theory and practice.|infers classifies",
      "intricate interrogate",
      "synthesize",
    ),
    word(
      "synthesize synthesizes synthesized synthesizing",
      "to combine ideas or information into a whole; to make a substance by chemistry",
      "综合；合成",
      "The essay {synthesizes} research from many fields.|infers clarifies | The drug was first {synthesized} in 1950.|inferred clarified | You must {synthesize} the sources, not just list them.|infer clarify",
      "sympathize synthesizer",
      "integrate",
    ),
    word(
      "formulate formulates formulated formulating",
      "to develop a plan or an idea carefully; to say something clearly",
      "构想；表述",
      "The government is {formulating} a new policy.|inferring distinguishing | She {formulated} a theory about memory.|inferred distinguished | Take time to {formulate} your answer.|infer distinguish",
      "formula stimulate",
    ),
    word(
      "generalize generalizes generalized generalizing",
      "to say that something is true of a whole group from only a few examples",
      "概括；以偏概全",
      "You can't {generalize} from one bad experience.|categorize classify | It's dangerous to {generalize} about whole nations.|classify interpret | He tends to {generalize}.|classify formulate",
      "generate normalize",
    ),
    word(
      "infer infers inferred inferring",
      "to reach an opinion from the facts you have",
      "推断；推论",
      "What can you {infer} from the data?|elaborate categorize | I {inferred} from her smile that she had passed.|elaborated categorized | Readers must {infer} the writer's meaning.|categorize elaborate",
      "inform defer",
      "interpret",
    ),
  ],
});

const online = vocabularyTopic({
  id: "b2-words-digital-learning",
  title: t("Digital Learning", "数字化学习"),
  summary: t(
    "E-learning and virtual classes; webinars and modules; interactive and self-paced courses; tutorials and forums; distractions and multitasking; bandwidth; hybrid learning.",
    "在线学习和虚拟课堂；网络研讨会和模块；互动的和自定进度的课程；教程和论坛；干扰和一心多用；带宽；混合式学习。",
  ),
  prerequisites: ["b1-words-digital"],
  words: [
    word(
      "e-learning",
      "learning that is done on a computer or online",
      "在线学习；电子学习",
      "The company offers {e-learning} for its staff.|bandwidth forum | {E-learning} lets you study at home.|Bandwidth Distraction | Many teachers had to switch to {e-learning} in 2020.|bandwidth distraction",
      "e-mailing earning",
    ),
    word(
      "virtual",
      "existing on a computer or online, not in the real world",
      "虚拟的；（网上）进行的",
      "We had a {virtual} meeting with the team in Tokyo.|self-paced bandwidth | The museum offers a {virtual} tour.|bandwidth forum | {Virtual} reality headsets are getting cheaper.|Hybrid Self-paced",
      "virtue visual",
    ),
    word(
      "webinar webinars",
      "a seminar or a talk that people join online",
      "网络研讨会",
      "Join our free {webinar} on Tuesday.|bandwidth multitask | She gives {webinars} on marketing.|bandwidths distractions | Over five hundred people joined the {webinar}.|bandwidth distraction",
      "seminar website",
      "tutorial",
    ),
    word(
      "module modules",
      "one unit of a course that you can study on its own",
      "（课程的）模块；单元",
      "The course has six {modules}.|bandwidths distractions | I've finished the first {module}.|bandwidth forum | Each {module} ends with a test.|bandwidth forum",
      "model nodule",
    ),
    word(
      "interactive",
      "letting people and computers act on each other; involving people talking and working together",
      "互动的；交互式的",
      "The museum has {interactive} displays for children.|self-paced bandwidth | The lessons are lively and {interactive}.|bandwidth forum | Use the {interactive} map to plan your trip.|bandwidth self-paced",
      "inactive interfere",
    ),
    word(
      "self-paced",
      "letting each learner go at their own speed",
      "自定进度的",
      "The course is {self-paced}, so you can finish it in a week or a year.|bandwidth multitask | {Self-paced} learning suits busy adults.|Bandwidth Interactive | The training is online and {self-paced}.|bandwidth forum",
      "self-made space",
    ),
    word(
      "tutorial tutorials",
      "a lesson that teaches you step by step; a class with a teacher and a small group",
      "教程；（大学）辅导课",
      "I learned to cook from online {tutorials}.|bandwidths modules | Watch the video {tutorial} first.|bandwidth hybrid | Students meet their tutor in weekly {tutorials}.|bandwidths distractions",
      "tutor editorial",
      "webinar",
    ),
    word(
      "forum forums",
      "a website where people discuss a subject; a meeting for discussion",
      "论坛",
      "I posted my question on the course {forum}.|bandwidth hybrid | The {forum} has a thousand members.|bandwidth distraction | Online {forums} help students support each other.|bandwidths distractions",
      "forms foreman",
    ),
    word(
      "distraction distractions",
      "something that takes your attention away from what you are doing",
      "使人分心的事物",
      "Phones are a big {distraction} in class.|module forum | I need a quiet room with no {distractions}.|modules forums | Work is a welcome {distraction} from my problems.|module bandwidth",
      "destruction abstraction",
    ),
    word(
      "multitask multitasks multitasked multitasking",
      "to do several things at the same time",
      "一心多用；同时做多件事",
      "Some people can {multitask} well, but most can't.|distract forum | {Multitasking} makes you slower.|Bandwidth Module | She {multitasks} by answering emails during meetings.|distracts integrates",
      "multiply multitude",
    ),
    word(
      "bandwidth",
      "the amount of data an internet connection can carry; the time and energy someone has",
      "带宽；精力",
      "Video calls need a lot of {bandwidth}.|forum module | Schools in the countryside have low {bandwidth}.|forum module | I don't have the {bandwidth} for another project.|forum module",
      "bandstand broadband",
    ),
    word(
      "hybrid",
      "made of two different things mixed together, such as online and in-person learning",
      "混合的；混合物",
      "The school uses a {hybrid} model: two days online, three in class.|bandwidth forum | They drive a {hybrid} car.|bandwidth forum | The plant is a {hybrid} of two roses.|bandwidth forum",
      "hydro humid",
    ),
  ],
});

const vocations = vocabularyTopic({
  id: "b2-words-vocations",
  title: t("Vocations", "职业与志向"),
  summary: t(
    "Vocational training, professions and occupations; apprenticeships; aspiring and aspirations; pursuing and fulfilling a dream; devoted and dedicated workers; rewarding work; a vocation.",
    "职业培训、专业职业和职业；学徒期；渴望和抱负；追求和实现梦想；全心投入和敬业的员工；有回报的工作；天职。",
  ),
  prerequisites: ["b1-words-jobs-3"],
  words: [
    word(
      "vocational",
      "teaching the skills needed for a particular job",
      "职业的；职业技能的",
      "She went to a {vocational} college to train as a chef.|devoted rewarding | {Vocational} training prepares you for work.|Devoted Rewarding | The school offers {vocational} courses in plumbing.|devoted humble",
      "vocal vacation",
      "vocation",
    ),
    word(
      "profession professions",
      "a job that needs special training and education, such as law or medicine",
      "（需专门训练的）职业",
      "Teaching is a respected {profession}.|aspiration apprenticeship | She is a lawyer by {profession}.|aspiration apprenticeship | Doctors and nurses belong to the medical {professions}.|aspirations apprenticeships",
      "procession confession",
      "occupation",
    ),
    word(
      "occupation occupations",
      "a job; the act of taking control of a country by an army",
      "职业；占领",
      "Please write your name and {occupation} on the form.|aspiration apprenticeship | Farming is the main {occupation} in the region.|aspiration apprenticeship | The {occupation} of the city lasted four years.|aspiration apprenticeship",
      "occasion preoccupation",
      "profession",
    ),
    word(
      "apprenticeship apprenticeships",
      "a time of training for a job, working with someone who has the skill",
      "学徒期；学徒身份",
      "He did a three-year {apprenticeship} as an electrician.|aspiration occupation | {Apprenticeships} let young people earn while they learn.|Aspirations Occupations | She found an {apprenticeship} with a builder.|aspiration occupation",
      "appreciation partnership",
    ),
    word(
      "aspire aspires aspired aspiring",
      "to want very much to achieve something",
      "渴望；立志",
      "She {aspires} to be a surgeon.|pursues fulfills | Many young people {aspire} to work abroad.|pursue fulfill | He is an {aspiring} writer.|pursuing fulfilling",
      "inspire perspire",
      "aspiration",
    ),
    word(
      "aspiration aspirations",
      "a strong wish to achieve something",
      "抱负；渴望",
      "She has {aspirations} to become a politician.|apprenticeships occupations | His main {aspiration} is to own a farm.|apprenticeship occupation | Parents should support their children's {aspirations}.|apprenticeships occupations",
      "inspiration respiration",
      "aspire",
    ),
    word(
      "pursue pursues pursued pursuing",
      "to try to achieve something over a long time; to follow someone to catch them",
      "追求；追赶",
      "She left her job to {pursue} a career in music.|aspire devote | The police {pursued} the thief.|aspired fulfilled | He is {pursuing} a degree in law.|aspiring fulfilling",
      "peruse persuade",
    ),
    word(
      "fulfill fulfills fulfilled fulfilling",
      "to achieve something you wanted; to do what is needed or promised",
      "实现；履行；使满足",
      "He finally {fulfilled} his dream of flying.|aspired devoted | Teaching is a {fulfilling} job.|pursuing aspiring | You must {fulfill} all the conditions.|aspire pursue",
      "fulsome refill",
    ),
    word(
      "devoted",
      "loving or caring about someone or something very much; giving a lot of time to something",
      "全心全意的；挚爱的",
      "She is a {devoted} mother.|vocational rewarding | He is {devoted} to his work.|vocational rewarding | A whole chapter is {devoted} to his childhood.|vocational rewarding",
      "devote developed",
      "dedicated",
    ),
    word(
      "rewarding",
      "giving satisfaction, though not always much money",
      "有回报的；值得做的",
      "Nursing is hard but {rewarding} work.|vocational devoted | It was a very {rewarding} experience.|vocational devoted | Teaching children is deeply {rewarding}.|vocational devoted",
      "regarding rewording",
    ),
    word(
      "dedicated",
      "working very hard because you care; used only for one purpose",
      "敬业的；专用的",
      "The nurses are hard-working and {dedicated}.|vocational rewarding | There is a {dedicated} lane for buses.|vocational rewarding | She is a {dedicated} teacher.|vocational rewarding",
      "decided medicated",
      "devoted",
    ),
    word(
      "vocation vocations",
      "a strong feeling that you should do a particular job; a job you do because of this",
      "天职；使命感",
      "Medicine is her {vocation}, not just a job.|apprenticeship aspiration | He found his {vocation} as a teacher.|apprenticeship occupation | Nursing is a {vocation} for many people.|apprenticeship aspiration",
      "vacation vocalist",
      "vocational",
    ),
  ],
});

const character = vocabularyTopic({
  id: "b2-words-character",
  title: t("Character", "品格"),
  summary: t(
    "Determination and persistence; patience and integrity; humility and humble people; arrogance; courage and courageous acts; self-discipline; compassion and compassionate people.",
    "决心和毅力；耐心和正直；谦逊和谦虚的人；傲慢；勇气和勇敢的行为；自律；同情心和富有同情心的人。",
  ),
  prerequisites: ["b1-words-personality"],
  words: [
    word(
      "determination",
      "the quality of continuing to try to do something even when it is difficult",
      "决心；坚定",
      "With hard work and {determination}, she became a doctor.|humility arrogant | His {determination} to win impressed everyone.|humility compassion | She showed great {determination} after the accident.|humility arrogance",
      "termination destination",
      "persistence",
    ),
    word(
      "persistence",
      "continuing to try to do something although it is difficult",
      "坚持不懈；毅力",
      "Learning a language takes {persistence}.|humility arrogant | His {persistence} finally paid off.|humility integrity | Thanks to her {persistence}, the law was changed.|humility arrogance",
      "persistent resistance",
      "determination",
    ),
    word(
      "patience",
      "the ability to wait or to deal with problems without getting angry",
      "耐心",
      "Teaching young children takes {patience}.|arrogance humble | I'm losing my {patience}!|integrity arrogance | Thank you for your {patience}.|integrity arrogance",
      "patients passion",
    ),
    word(
      "integrity",
      "the quality of being honest and having strong moral principles",
      "正直；诚实",
      "She is a woman of great {integrity}.|arrogance patience | Nobody doubts the judge's {integrity}.|arrogance self-discipline | He refused the bribe and kept his {integrity}.|arrogance self-discipline",
      "integral intensity",
    ),
    word(
      "humility",
      "the quality of not thinking you are better than others",
      "谦逊；谦卑",
      "Despite his fame, he spoke with {humility}.|arrogance determination | Great leaders show {humility}.|arrogance arrogant | She accepted the prize with {humility}.|arrogance arrogant",
      "humidity humiliation",
      "humble",
    ),
    word(
      "humble humbler humblest",
      "not thinking you are better than others; poor and simple",
      "谦虚的；卑微的",
      "He remained {humble} after winning the prize.|arrogant courageous | She comes from a {humble} family of farmers.|arrogant compassionate | Be {humble} enough to admit your mistakes.|arrogant courageous",
      "humid tumble",
      "humility",
    ),
    word(
      "arrogant",
      "behaving as if you are better or more important than other people",
      "傲慢的；自大的",
      "He is rude and {arrogant}.|humble compassionate | It was {arrogant} of her to ignore our advice.|humble compassionate | An {arrogant} manager never listens.|humble compassionate",
      "elegant arrogance",
      "humble",
    ),
    word(
      "courage",
      "the ability to do something dangerous or difficult although you are afraid",
      "勇气",
      "It takes {courage} to say no.|humility arrogance | She showed great {courage} in the fire.|humility arrogance | He didn't have the {courage} to tell her the truth.|humility arrogance",
      "courtesy carriage",
      "courageous",
    ),
    word(
      "courageous",
      "brave",
      "勇敢的",
      "It was a {courageous} decision.|humble arrogant | The {courageous} firefighters saved the children.|arrogant humble | She was {courageous} enough to speak out.|humble arrogant",
      "outrageous contagious",
      "courage",
    ),
    word(
      "self-discipline",
      "the ability to make yourself do things you should do",
      "自律",
      "Working from home needs {self-discipline}.|arrogance humility | Athletes have great {self-discipline}.|arrogance humility | {Self-discipline} is the key to success.|Arrogance Humble",
      "self-defense self-display",
    ),
    word(
      "compassion",
      "a strong feeling of sympathy for people who are suffering, and a wish to help them",
      "同情心；怜悯",
      "The nurse treated everyone with {compassion}.|arrogance persistence | Show some {compassion}: he has just lost his job.|arrogance persistence | Her {compassion} for the poor led her to start a charity.|arrogance persistence",
      "companion compression",
      "compassionate",
    ),
    word(
      "compassionate",
      "feeling or showing sympathy for people who are suffering",
      "富有同情心的",
      "She is a kind and {compassionate} doctor.|arrogant arrogance | The judge made a {compassionate} decision.|arrogant arrogance | He was given {compassionate} leave when his mother died.|arrogant humble",
      "passionate companionable",
      "compassion",
    ),
  ],
});

// Mixed conditionals.

const joinWords = (...parts: readonly string[]) => parts.filter((p) => p !== "").join(" ");
const pronouns = new Set(["I", "you", "he", "she", "it", "we", "they"]);
const singular = new Set(["I", "he", "she", "it"]);
/** hadOf is the if-clause's subject with had, or with 'd after a pronoun, as a pattern. */
const hadOf = (subject: string) => (pronouns.has(subject) ? `[${subject} had|${subject}'d]` : `${subject} had`);
/** wouldOf is the result's subject with would, or with 'd after a pronoun, as a pattern. */
const wouldOf = (subject: string) => (pronouns.has(subject) ? `[${subject} would|${subject}'d]` : `${subject} would`);
/** wouldHaveOf is the result's subject with would have, or with 'd have or would've after a pronoun, as a pattern. */
const wouldHaveOf = (subject: string) =>
  pronouns.has(subject) ? `[${subject} would have|${subject}'d have|${subject} would've]` : `${subject} would have`;

/**
 * pastNows imagine a different past with a result now: the if-clause's subject, base form, past participle and rest,
 * then the result's subject, base form, past participle and rest.
 */
const pastNows: readonly (readonly [string, string, string, string, string, string, string, string])[] = [
  ["I", "take", "taken", "the job in Tokyo in 2019", "I", "be", "been", "in Japan now"],
  ["she", "study", "studied", "medicine at university", "she", "be", "been", "a doctor now"],
  ["we", "buy", "bought", "that house ten years ago", "we", "be", "been", "rich now"],
  ["you", "listen", "listened", "to my advice last year", "you", "have", "had", "a job now"],
  ["they", "leave", "left", "early this morning", "they", "be", "been", "here by now"],
  ["I", "learn", "learned", "Chinese as a child", "I", "speak", "spoken", "it well now"],
  ["she", "win", "won", "the lottery last week", "she", "be", "been", "on a beach now"],
  ["he", "save", "saved", "more money in his twenties", "he", "own", "owned", "a house now"],
  ["we", "plant", "planted", "the trees last spring", "we", "have", "had", "fruit now"],
  ["I", "go", "gone", "to bed earlier last night", "I", "be", "been", "less tired now"],
  ["they", "fix", "fixed", "the roof in the autumn", "the house", "be", "been", "dry now"],
  ["you", "eat", "eaten", "breakfast this morning", "you", "be", "been", "less hungry now"],
  ["she", "accept", "accepted", "his proposal in 2015", "she", "be", "been", "married now"],
  ["he", "pass", "passed", "his driving test last month", "he", "have", "had", "a license now"],
  ["I", "read", "read", "the instructions yesterday", "I", "know", "known", "what to do now"],
  ["the city", "build", "built", "the metro in the 1990s", "traffic", "be", "been", "much lighter now"],
  ["we", "book", "booked", "the tickets in January", "we", "have", "had", "seats now"],
  ["they", "invest", "invested", "in the company in 2010", "they", "be", "been", "millionaires now"],
  ["she", "move", "moved", "to Canada as a child", "she", "speak", "spoken", "fluent English now"],
  ["he", "stop", "stopped", "smoking twenty years ago", "he", "be", "been", "healthier now"],
  ["you", "charge", "charged", "your phone last night", "you", "have", "had", "some battery now"],
  ["I", "bring", "brought", "an umbrella this morning", "I", "be", "been", "dry now"],
  ["the team", "win", "won", "yesterday's match", "they", "be", "been", "in the final now"],
  ["we", "leave", "left", "home on time", "we", "be", "been", "at the airport now"],
  ["she", "finish", "finished", "her degree last year", "she", "have", "had", "a better job now"],
  ["he", "sell", "sold", "his shares in 2020", "he", "be", "been", "much poorer now"],
  ["I", "know", "known", "about the sale last week", "I", "have", "had", "a new laptop now"],
  ["they", "catch", "caught", "the earlier flight", "they", "be", "been", "in Rome now"],
  ["you", "water", "watered", "the plants last week", "they", "be", "been", "alive now"],
  ["he", "become", "become", "a teacher", "he", "be", "been", "happier now"],
  ["we", "choose", "chosen", "the other hotel", "we", "have", "had", "a sea view now"],
  ["the government", "act", "acted", "on the warnings in 2000", "the problem", "be", "been", "smaller now"],
  ["I", "write", "written", "the report yesterday", "I", "be", "been", "free now"],
];

/**
 * nowPasts imagine a different present with a result in the past: the if-clause's subject, base form, past form and
 * rest, then the result's subject, base form, past participle and rest.
 */
const nowPasts: readonly (readonly [string, string, string, string, string, string, string, string])[] = [
  ["I", "speak", "spoke", "French", "I", "understand", "understood", "the film last night"],
  ["she", "be", "were", "taller", "she", "join", "joined", "the basketball team last year"],
  ["he", "be", "were", "braver", "he", "ask", "asked", "her to dance yesterday"],
  ["we", "have", "had", "a car", "we", "drive", "driven", "to the beach last weekend"],
  ["I", "know", "knew", "how to swim", "I", "go", "gone", "into the sea yesterday"],
  ["they", "like", "liked", "dogs", "they", "adopt", "adopted", "the puppy last month"],
  ["you", "be", "were", "more careful", "you", "notice", "noticed", "the mistake last week"],
  ["she", "like", "liked", "flying", "she", "visit", "visited", "us in Australia last summer"],
  ["he", "be", "were", "a better cook", "he", "make", "made", "dinner for us last night"],
  ["I", "have", "had", "more money", "I", "buy", "bought", "that jacket yesterday"],
  ["we", "live", "lived", "closer to the station", "we", "catch", "caught", "the last train last night"],
  ["I", "enjoy", "enjoyed", "camping", "I", "go", "gone", "on the school trip last weekend"],
  ["he", "speak", "spoke", "English", "he", "understand", "understood", "the lecture this morning"],
  ["she", "trust", "trusted", "him", "she", "lend", "lent", "him the money last month"],
  ["they", "be", "were", "more organized", "they", "finish", "finished", "the project on time last year"],
  ["you", "know", "knew", "him better", "you", "believe", "believed", "his story yesterday"],
  ["I", "be", "were", "braver", "I", "say", "said", "something at the meeting this morning"],
  ["we", "have", "had", "a bigger house", "we", "invite", "invited", "everyone to the party last Saturday"],
  ["he", "be", "were", "more hard-working", "he", "pass", "passed", "the exam last month"],
  ["she", "like", "liked", "spicy food", "she", "order", "ordered", "the curry last night"],
  ["I", "own", "owned", "a camera", "I", "take", "taken", "photos at the wedding last week"],
  ["they", "speak", "spoke", "Spanish", "they", "enjoy", "enjoyed", "their trip to Mexico more last year"],
  ["you", "be", "were", "more patient", "you", "finish", "finished", "the puzzle yesterday"],
  ["he", "spend", "spent", "more time at home", "he", "notice", "noticed", "his son's problems last year"],
  ["I", "be", "were", "good at math", "I", "study", "studied", "engineering at university"],
  ["she", "be", "were", "less busy", "she", "come", "come", "to my party last night"],
  ["we", "have", "had", "a map", "we", "find", "found", "the hotel more quickly yesterday"],
  ["he", "be", "were", "more honest", "he", "tell", "told", "the police the truth last week"],
  ["I", "be", "were", "healthier", "I", "go", "gone", "to the concert last night"],
  ["they", "care", "cared", "about the environment", "they", "vote", "voted", "for the green party in the last election"],
  ["you", "read", "read", "the news", "you", "hear", "heard", "about the strike last week"],
  ["the town", "have", "had", "a hospital", "the injured man", "be", "been", "treated sooner last night"],
];

const pastNowChoice: readonly ChoiceItem[] = pastNows.map(
  ([s, , pp, rest, rs, rbase, rpp, rr]): ChoiceItem => [
    `${joinWords("If", s, "had", pp, rest)}, ${joinWords(rs, "___", rr)}.`,
    `would ${rbase}`,
    [`would have ${rpp}`, `will ${rbase}`],
  ],
);

const nowPastChoice: readonly ChoiceItem[] = nowPasts.map(
  ([s, , past, rest, rs, rbase, rpp, rr], k): ChoiceItem => [
    `${joinWords("If", s, past, rest)}, ${joinWords(rs, "___", rr)}.`,
    `would have ${rpp}`,
    k % 2 === 0 ? [`would ${rbase}`, `had ${rpp}`, `would have had ${rpp}`] : [`would ${rbase}`, `had ${rpp}`],
  ],
);

/** wereOf accepts was beside were after a singular subject. */
const wereOf = (subject: string, past: string) => (past === "were" && singular.has(subject) ? "[were|was]" : past);

const mixedTyped: readonly TypedItem[] = interleave([
  pastNows.map(
    ([s, base, pp, rest, rs, rbase, rpp, rr]): TypedItem => ({
      shown: `if ${joinWords(s, base, rest)} → ${joinWords(rs, rbase, rr)}`,
      accepted: [`${joinWords("If", hadOf(s), pp, rest)}, ${joinWords(wouldOf(rs), rbase, rr)}.`],
      canonical: `${joinWords("If", s, "had", pp, rest)}, ${joinWords(rs, "would", rbase, rr)}.`,
      wrong: [
        `${joinWords("If", s, "had", pp, rest)}, ${joinWords(rs, "would have", rpp, rr)}.`,
        `${joinWords("If", s, "would have", pp, rest)}, ${joinWords(rs, "would", rbase, rr)}.`,
      ],
    }),
  ),
  nowPasts.map(
    ([s, base, past, rest, rs, rbase, rpp, rr]): TypedItem => ({
      shown: `if ${joinWords(s, base, rest)} → ${joinWords(rs, rbase, rr)}`,
      accepted: [`${joinWords("If", s, wereOf(s, past), rest)}, ${joinWords(wouldHaveOf(rs), rpp, rr)}.`],
      canonical: `${joinWords("If", s, past, rest)}, ${joinWords(rs, "would have", rpp, rr)}.`,
      wrong: [
        `${joinWords("If", s, past, rest)}, ${joinWords(rs, "would", rbase, rr)}.`,
        `${joinWords("If", s, past, rest)}, ${joinWords(rs, "had", rpp, rr)}.`,
      ],
    }),
  ),
]);

/** mixedRule names how a mixed conditional mixes, from whether its result is in the past. */
function mixedRule(right: string): Text {
  return right.includes("would have ")
    ? t(
        "The *if*-part imagines a different present, in the past simple, but the result is in the past, so it takes *would have* and the past participle",
        "*if* 部分想象的是不同的现在，用一般过去时；结果却在过去，所以用 *would have* 加过去分词",
      )
    : t(
        "The *if*-part imagines a different past, with *had* and the past participle, but the result is about now, so it takes *would* and the base form",
        "*if* 部分想象的是不同的过去，用 *had* 加过去分词；结果却在现在，所以用 *would* 加动词原形",
      );
}

/** mixedWhy puts the rule of the mixed conditional before a sentence. */
const mixedWhy = (right: string, sentence: string): Text => {
  const rule = mixedRule(right);
  return t(`${rule.en}: ${sentence}`, `${rule["zh-CN"]}：${sentence}`);
};

/** whyNotMixed explains a result in the wrong time, will for an imagined past, or had alone. */
const whyNotMixed = (wrong: string, right: string): Text => {
  const rule = mixedRule(right);
  let first: Text;
  if (wrong.startsWith("would have had "))
    first = t(
      `*${wrong}* adds a *had* the result does not take: after *would have* comes the past participle alone.`,
      `*${wrong}* 多加了一个 *had*：*would have* 后面直接接过去分词。`,
    );
  else if (wrong.startsWith("would have "))
    first = t(`*${wrong}* puts the result in the past, but it is about now.`, `*${wrong}* 把结果放在了过去，但结果说的是现在。`);
  else if (wrong.startsWith("would "))
    first = t(`*${wrong}* puts the result in the present, but it is in the past.`, `*${wrong}* 把结果放在了现在，但结果发生在过去。`);
  else if (wrong.startsWith("will "))
    first = t(
      `*${wrong}* is for a real possibility, but the *if*-part imagines a past that did not happen.`,
      `*${wrong}* 用于真实的可能，但 *if* 部分想象的是没有发生的过去。`,
    );
  else
    first = t(
      `*${wrong}* says what really happened before something else, not an imagined result.`,
      `*${wrong}* 说的是在另一件事之前真实发生的事，不是想象的结果。`,
    );
  return t(`${first.en} ${rule.en}.`, `${first["zh-CN"]}${rule["zh-CN"]}。`);
};

const mixedConditionals: TopicDef = {
  id: "mixed-conditionals",
  title: t("If I Had Studied Medicine, I Would Be a Doctor", "混合条件句"),
  summary: t(
    "If I had studied medicine, I would be a doctor now. If I spoke French, I would have understood the film. A mixed conditional joins an imagined past to a result now, or an imagined present to a result in the past.",
    "If I had studied medicine, I would be a doctor now. If I spoke French, I would have understood the film。混合条件句把想象的过去和现在的结果连在一起，或者把想象的现在和过去的结果连在一起。",
  ),
  prerequisites: ["third-conditional"],
  encompasses: [{ topic: "third-conditional", weight: 0.4 }],
  xp: 30,
  strand: "grammar",
  knowledgePoints: [
    point(
      "past-now",
      t("A different past, a different now", "过去不同，现在就不同"),
      t(
        "When an imagined past would change the **present**, the *if*-part is a third conditional and the result is a second conditional:\n\n- *If I **had studied** medicine, I **would be** a doctor now.* (I didn't study it, so I'm not a doctor.)\n- *If we **had bought** that house ten years ago, we **would be** rich now.*\n\nWords such as *now*, *today* and *by now* show that the result is in the present, so it takes *would* + the base form, not *would have* + past participle.",
        "想象的过去会改变**现在**时，*if* 部分用第三条件句，结果部分用第二条件句：\n\n- *If I **had studied** medicine, I **would be** a doctor now.*（我没学医，所以现在不是医生。）\n- *If we **had bought** that house ten years ago, we **would be** rich now.*\n\n*now*、*today*、*by now* 等词表明结果在现在，所以用 *would* 加动词原形，不用 *would have* 加过去分词。中文“要是当年学了医，现在就是医生了”靠“当年”“现在”区分时间，英语则要靠两部分不同的动词形式。",
      ),
      choiceGenerator(
        t("Choose the words for the gap.", "选出填入空白处的词。"),
        pastNowChoice,
        (right, shown) => mixedWhy(right, fill(shown, right)),
        whyNotMixed,
      ),
    ),
    point(
      "now-past",
      t("A different now, a different past", "现在不同，过去就不同"),
      t(
        "When an imagined **present** (something that is always or still true) would have changed the past, the *if*-part is a second conditional and the result is a third conditional:\n\n- *If I **spoke** French, I **would have understood** the film last night.* (I don't speak French, so I didn't understand it.)\n- *If he **were** braver, he **would have asked** her to dance.*\n\nWords such as *yesterday* and *last year* show that the result is in the past, so it takes *would have* + past participle. The result never takes *had* alone: *had understood* says what really happened before something else.",
        "想象的**现在**（一直或至今仍然如此的情况）本会改变过去时，*if* 部分用第二条件句，结果部分用第三条件句：\n\n- *If I **spoke** French, I **would have understood** the film last night.*（我不会说法语，所以昨晚没看懂。）\n- *If he **were** braver, he **would have asked** her to dance.*\n\n*yesterday*、*last year* 等词表明结果在过去，所以用 *would have* 加过去分词。结果部分不能只用 *had*：*had understood* 说的是过去真实发生在另一件事之前的事。",
      ),
      choiceGenerator(
        t("Choose the words for the gap.", "选出填入空白处的词。"),
        nowPastChoice,
        (right, shown) => mixedWhy(right, fill(shown, right)),
        whyNotMixed,
      ),
    ),
    point(
      "write",
      t("Writing mixed conditionals", "写混合条件句"),
      t(
        "Write the sentence from the note. The time words tell you which way it mixes:\n\n- A past event with a result *now*: *if I take the job in Tokyo in 2019 → I be in Japan now* becomes *If I had taken the job in Tokyo in 2019, I would be in Japan now.*\n- A present state with a result in the past: *if I speak French → I understand the film last night* becomes *If I spoke French, I would have understood the film last night.*\n\nPut a comma after the *if*-part. You may write *I'd* for *I had* and *I would*, *would've* for *would have*, and *was* for *were* after *I*, *he* and *she*.",
        "根据笔记写句子。时间词告诉你怎样混合：\n\n- 过去的事情，结果在*现在*：*if I take the job in Tokyo in 2019 → I be in Japan now* 写成 *If I had taken the job in Tokyo in 2019, I would be in Japan now.*\n- 现在的状态，结果在过去：*if I speak French → I understand the film last night* 写成 *If I spoke French, I would have understood the film last night.*\n\n*if* 部分后面加逗号。可以把 *I had* 和 *I would* 写成 *I'd*，把 *would have* 写成 *would've*，*I*、*he*、*she* 后面的 *were* 也可以写成 *was*。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Write a mixed conditional sentence from the note.", "根据笔记写一个混合条件句。"),
        mixedTyped,
        (right) => mixedWhy(right.split(", ")[1] ?? "", right),
      ),
    ),
  ],
};

// Writing a for-and-against essay.

const balanceBank: readonly WritingItem[] = [
  {
    task: "Should university education be free for all students? Discuss the arguments for and against.",
    model:
      "In many countries, students leave university with large debts, while in others the state pays for their education. Whether higher education should be free for everyone is a question on which reasonable people disagree, and there are strong arguments on both sides.\n\nOn the one hand, free tuition would open universities to talented young people from disadvantaged families. At present, the fear of debt stops many of them from applying, even when their grades are excellent. Furthermore, a country benefits when more of its citizens are highly educated, since graduates tend to earn more, pay more tax and contribute new ideas to the economy. From this point of view, university is an investment that society as a whole should make. Countries such as Germany have shown that such a system can work.\n\nOn the other hand, free education is extremely expensive, and the money has to come from taxes paid by everyone, including people who never went to university. Critics also point out that graduates usually earn more than other workers, so it seems fair that they should pay at least part of the cost. In addition, when universities depend entirely on the state, they may have to limit the number of places, which can make entry even more competitive.\n\nIn conclusion, both sides make valid points. Free tuition promotes equal opportunity, but it places a heavy burden on public money. On balance, I believe the best solution lies in between: education should be free for students from low-income families, while others repay part of the cost once they earn a good salary.",
  },
  {
    task: "Should homework be abolished in primary schools? Discuss the arguments for and against.",
    model:
      "Homework has long been part of school life, yet a growing number of parents and teachers now question whether young children should have any at all. There are convincing arguments both for abolishing homework in primary schools and for keeping it.\n\nThose who want to abolish it argue that young children need time to play, rest and be with their families. After six hours in a classroom, many pupils are tired, and homework can turn the evening into a battle between parents and children. Moreover, research suggests that homework does little to improve the results of children under the age of eleven. Some schools that have stopped setting it report that their pupils arrive in the morning happier and more motivated.\n\nHowever, supporters of homework believe that it teaches important habits. Regular tasks at home help children learn to organize their time and to work without a teacher beside them, skills they will need at secondary school. Homework also allows parents to see what their children are learning and to notice early if they are struggling. Without it, some families might have little idea of what happens in the classroom.\n\nIn conclusion, the debate is not simply about whether homework is good or bad. Long, stressful assignments are clearly unhelpful for young children, but short and enjoyable tasks, such as reading a book with a parent, seem to offer real benefits. On balance, primary schools should not abolish homework completely, but they should keep it brief and make it a pleasure rather than a burden.",
  },
  {
    task: "Is it better to study online from home than to attend classes in person? Discuss the arguments for and against.",
    model:
      "Since the pandemic, millions of students have experienced learning from home through a screen. Many universities now offer the choice between online and in-person courses, which raises the question of which form of study is better. Each has clear advantages and disadvantages.\n\nThe main argument for online learning is flexibility. Students can watch lectures at any time, pause them and replay difficult parts, which suits people who work or care for children. Online courses are also cheaper, since learners do not need to travel or pay for accommodation in an expensive city. In addition, the internet gives students in remote areas access to teachers and courses that would otherwise be out of reach.\n\nOn the other hand, studying alone at home requires a great deal of self-discipline. Without a timetable and classmates around them, many learners find it hard to stay motivated, and distractions such as phones and social media are always close at hand. Furthermore, a large part of education happens through conversation: discussing ideas in a seminar, asking a question after class or working on a project in a group. These experiences are difficult to reproduce on a screen. Practical subjects, such as chemistry or nursing, also require laboratories and equipment that students cannot use at home.\n\nIn conclusion, neither form of study is better for everyone. Online learning is ideal for independent adults who need flexibility, while younger students usually benefit more from the structure and human contact of a classroom. In my view, a hybrid approach, combining recorded lectures with regular face-to-face seminars, offers the best of both worlds.",
  },
  {
    task: "Should students be required to wear school uniforms? Discuss the arguments for and against.",
    model:
      "In some countries, school uniforms are a tradition that nobody questions, while in others students wear whatever they like. Whether uniforms should be compulsory is a topic that divides parents, teachers and students alike.\n\nThose in favor of uniforms argue that they reduce differences between rich and poor students. When everyone wears the same clothes, children from disadvantaged families are less likely to be teased for not having expensive brands. Supporters also believe that uniforms create a sense of belonging and help pupils to focus on learning rather than on fashion. Furthermore, uniforms can save time and arguments in the morning, since there is no need to decide what to wear. Many head teachers also say that uniforms make it easier to recognize strangers on school grounds.\n\nOn the other hand, opponents claim that uniforms limit young people's freedom to express their identity. Adolescence is a time when people discover who they are, and clothes can be an important part of that process. Critics also point out that uniforms are not always cheap: some schools require blazers and shoes from a particular shop, which can cost families more than ordinary clothes. Finally, there is little clear evidence that uniforms improve behavior or academic results.\n\nIn conclusion, both views have merit. Uniforms can promote equality and a sense of community, but they may restrict self-expression and place a financial burden on some families. On balance, I believe that a simple and affordable uniform is reasonable for younger children, whereas older teenagers should be allowed more freedom, perhaps within a basic dress code.",
  },
  {
    task: "Should mobile phones be banned in schools? Discuss the arguments for and against.",
    model:
      "Almost every teenager now owns a smartphone, and many bring it to school every day. As a result, several countries have introduced laws that ban phones in classrooms, while others leave the decision to individual schools. There are strong arguments on both sides of this debate.\n\nOn the one hand, phones are a major source of distraction. Notifications interrupt lessons, and students who check social media during class find it harder to concentrate and to remember what they have learned. Phones can also be used for cheating in tests and for cyberbullying, which may continue even inside the school building. Supporters of a ban point out that schools which have removed phones often report better results and more conversation between students at break time.\n\nOn the other hand, phones can be valuable learning tools. Students can use them to look up information, record their homework or practice a language with an app. Many parents also want their children to carry a phone so that they can contact them in an emergency, especially on the journey to and from school. Moreover, opponents of a ban argue that schools should teach young people to use technology responsibly rather than simply forbid it.\n\nIn conclusion, phones bring both risks and benefits to the classroom. In my opinion, the most sensible approach is a compromise: students should keep their phones switched off and out of sight during lessons, but teachers should be free to allow them for particular tasks. In this way, schools can reduce distraction without ignoring the advantages of technology.",
  },
  {
    task: "Is it a good idea for young people to take a gap year between school and university? Discuss the arguments for and against.",
    model:
      "A growing number of school leavers decide to spend a year traveling, working or volunteering before they begin university. Some people see this gap year as a valuable experience, while others regard it as a waste of time. Both opinions deserve careful consideration.\n\nThere are several advantages to taking a gap year. First of all, it gives young people time to think about what they really want to study, which may prevent them from choosing the wrong course. Furthermore, working or traveling abroad can develop independence, confidence and practical skills that are rarely taught at school. Many students who take a year out return more mature and more motivated, and some universities say that these students are more likely to complete their degrees.\n\nHowever, a gap year also has disadvantages. Traveling can be very expensive, so this option is often available only to young people from wealthy families. In addition, some students lose the habit of studying and find it difficult to return to academic work after twelve months away from books. There is also a risk that a poorly planned year will be spent doing very little, which delays the start of a career without bringing any real benefit.\n\nIn conclusion, a gap year can be an excellent opportunity, but only if it is used well. On balance, I believe it is worth taking for students who have a clear plan, such as a job, a volunteering project or a language course. For those without such a plan, starting university straight away is probably the wiser choice.",
  },
  {
    task: "Should children start school at the age of seven rather than five? Discuss the arguments for and against.",
    model:
      "In Britain, children begin school at the age of four or five, whereas in Finland they start at seven. This difference has led many people to ask whether starting formal education later would be better for children. There are reasonable arguments both for and against such a change.\n\nThose who support a later start argue that young children learn best through play. At five, many children are not yet ready to sit still, hold a pencil properly or follow instructions for long periods, and pushing them too early can make them anxious about learning. Supporters often point to Finland, where pupils start late but achieve some of the best results in the world by the age of fifteen. In their view, the extra years of play build curiosity, social skills and confidence.\n\nOn the other hand, starting school early can help children from disadvantaged families. If their parents work long hours or cannot afford nursery education, school may be the best place for them to develop language and early numeracy. Delaying school by two years could widen the gap between these children and their more privileged peers. Moreover, a later start would create problems for working parents, who would need to pay for childcare for longer.\n\nIn conclusion, the age at which children start school matters less than what happens there. On balance, I would argue that children can start at five, provided that the first two years are based on play rather than formal lessons. This approach would combine the benefits of both systems.",
  },
  {
    task: "Are single-sex schools better than mixed schools? Discuss the arguments for and against.",
    model:
      "Although most schools today teach boys and girls together, single-sex schools remain popular with some parents. The question of whether separating the sexes produces better results has been debated for many years, and the evidence points in different directions.\n\nSupporters of single-sex schools argue that pupils feel freer to choose the subjects they enjoy. Girls in all-girls schools, for example, are more likely to study physics and mathematics, which are often seen as male subjects in mixed classrooms. Some parents also believe that teenagers are less distracted when they are not trying to impress classmates of the opposite sex, so they can concentrate more on their studies. In addition, teachers can adapt their methods to the ways in which boys or girls tend to learn. Single-sex schools can also give shy pupils more confidence to speak in class.\n\nOn the other hand, critics argue that single-sex schools do not prepare young people for real life. In the workplace and in society, men and women work side by side, and learning to cooperate and communicate with each other from an early age is an important part of growing up. Furthermore, many studies suggest that the good results of single-sex schools are explained by other factors, such as the wealth of the families who choose them, rather than by the separation itself.\n\nIn conclusion, single-sex schools may suit some pupils, but there is little proof that they are better in general. On balance, I believe mixed schools are preferable, as long as teachers make sure that both boys and girls feel encouraged to pursue every subject.",
  },
  {
    task: "Should students be allowed to evaluate their teachers? Discuss the arguments for and against.",
    model:
      "At many universities, students complete questionnaires about their teachers at the end of each course, and some secondary schools have begun to do the same. While this practice gives learners a voice, it also raises concerns. This essay will consider both sides of the question.\n\nThere are clear benefits to student evaluations. Students are the people who experience lessons every day, so they are well placed to say whether explanations are clear and whether the pace is right. Honest feedback can help teachers notice problems they were not aware of and improve their methods. Moreover, when students feel that their opinions are taken seriously, they may become more engaged and take more responsibility for their own learning. Some schools have used such feedback to improve their lessons within a single term.\n\nNevertheless, there are serious drawbacks. Young people may judge teachers on how entertaining or how easy their lessons are rather than on how much they learn. A demanding teacher who sets difficult work could receive poor scores, even though the class benefits from the challenge. Research has also shown that evaluations can be biased, for example against women and teachers from ethnic minorities. If these scores are used to decide promotions, the consequences could be unfair.\n\nIn conclusion, student evaluations can provide useful information, but they should not be the only measure of a teacher's quality. In my view, schools should collect students' opinions regularly and use them to help teachers develop, while decisions about pay and careers should be based on a wider assessment that includes observations by experienced colleagues.",
  },
  {
    task: "Should more young people choose vocational training instead of going to university? Discuss the arguments for and against.",
    model:
      "For decades, young people have been told that a university degree is the key to a successful career. Recently, however, some politicians and employers have argued that more school leavers should choose vocational training or an apprenticeship instead. There are good reasons on both sides.\n\nThe case for vocational training is strong. Many countries face a shortage of skilled workers such as electricians, plumbers and nurses, and these jobs often pay well and offer secure employment. Apprentices also earn a salary while they learn, so they avoid the debts that many university students take on. Furthermore, not every young person enjoys academic study, and practical training can allow them to develop their talents in a more rewarding way.\n\nOn the other hand, a university degree still opens doors that vocational qualifications do not. Professions such as medicine, law and engineering require academic study, and graduates on average earn more over their lifetime. A degree also develops skills such as critical thinking and research that are valuable in many careers. Some people worry that encouraging students from poorer backgrounds to choose vocational routes could limit their social mobility, while wealthier students continue to go to university.\n\nIn conclusion, both paths can lead to fulfilling careers, and neither should be seen as second best. On balance, I believe that more young people should consider vocational training, but the choice must depend on their interests and abilities, not on their family background. Schools should present both options fairly so that students can make an informed decision.",
  },
  {
    task: "Should final exams be replaced by continuous assessment? Discuss the arguments for and against.",
    model:
      "In many education systems, a student's future depends largely on a few hours of exams at the end of the year. Some educators believe this system should be replaced by continuous assessment, in which coursework and tests throughout the year count towards the final grade. Both approaches have their supporters.\n\nThose in favor of continuous assessment argue that it gives a fairer picture of a student's ability. A single exam can be affected by illness, nerves or bad luck, whereas marks collected over a whole year show what a student can do consistently. Continuous assessment also encourages students to work steadily instead of trying to memorize everything in the last few weeks. In addition, it allows teachers to give feedback during the course, so that students can improve before it is too late.\n\nOn the other hand, final exams have important strengths. Because everyone takes the same test under the same conditions, the results are easy to compare and difficult to cheat on. With coursework, by contrast, it can be hard to know whether students have done the work themselves or received help from parents, tutors or the internet. Furthermore, continuous assessment can create constant pressure, as every piece of work counts and students never have time to make mistakes and learn from them.\n\nIn conclusion, each system has its advantages. On balance, I believe that a combination is the fairest solution: part of the grade should come from coursework done in class, and part from a final exam, so that neither bad luck on one day nor outside help decides a student's future.",
  },
  {
    task: "Should schools teach coding to all pupils from the age of six? Discuss the arguments for and against.",
    model:
      "Computers now play a part in almost every job, and several countries have added coding to the primary school curriculum. Some people welcome this change, while others doubt that young children should spend their time learning to program. Both positions are worth examining.\n\nSupporters argue that coding is a basic skill for the modern world, like reading and arithmetic. Children who learn it early understand how the technology around them works and are better prepared for well-paid jobs in the future. Furthermore, coding develops logical thinking and problem-solving, since pupils must break a task into small steps and find their own mistakes. Simple programs that move a robot or create a game can also be highly motivating, even for children who find other subjects difficult.\n\nOn the other hand, critics point out that the school day is already full. Adding coding may mean less time for art, music, physical education or reading, which are just as important for young children's development. There is also a shortage of teachers who are trained to teach programming well, and lessons taught by teachers without confidence in the subject may do more harm than good. Finally, technology changes so quickly that the languages children learn at six may be out of date by the time they start work.\n\nIn conclusion, coding offers real benefits, but it should not replace other essential subjects. On balance, I believe that young children should be introduced to the basic ideas of programming through play, while more serious coding lessons can wait until secondary school.",
  },
];

const balanceEssay = judgedTopic({
  id: "writing-a-for-and-against-essay",
  title: t("Writing a For-and-Against Essay", "写正反论证类议论文"),
  summary: t(
    "Write an essay of 250 to 300 words that introduces a question neutrally, gives the arguments for and the arguments against in separate paragraphs, and reaches a balanced conclusion.",
    "写一篇 250 到 300 词的议论文：中立地引出问题，分段列出支持和反对的论点，并得出权衡后的结论。",
  ),
  prerequisites: ["writing-an-opinion-essay", "writing-a-counterclaim-paragraph"],
  encompasses: [
    { topic: "writing-an-opinion-essay", weight: 0.3 },
    { topic: "writing-a-counterclaim-paragraph", weight: 0.3 },
  ],
  criteria: ["b2-balanced-introduction", "b2-essay-balance", "b2-balanced-conclusion", "b2-essay-linking", "b2-neutral-register"],
  point: {
    id: "for-and-against-essay",
    title: t("Both sides, then a judgment", "先讲两方，再下判断"),
    explanation: t(
      "A for-and-against essay looks fairly at both sides of a question before you decide. Plan four paragraphs:\n\n1. **Introduction**: present the question and say that people disagree about it, without giving your own view yet: *There are strong arguments on both sides.*\n2. **Arguments for**: two or three points, each explained and supported with an example: *On the one hand, ... Furthermore, ...*\n3. **Arguments against**: the same number of points, as fully developed: *On the other hand, ... Critics point out that ...*\n4. **Conclusion**: weigh the two sides and say which you find stronger, or under what conditions each is right: *In conclusion, both sides make valid points. On balance, I believe ...* Do not add a new argument here.\n\nGive both sides a fair hearing: describe the side you disagree with as its supporters would, not as a weak position. Keep a neutral, formal tone, with no contractions.",
      "正反论证类议论文在下结论之前公平地看待问题的两方面。安排四段：\n\n1. **引言**：提出问题，说明人们对此看法不一，先不表明自己的观点：*There are strong arguments on both sides.*\n2. **支持的论点**：两三点，每点都有解释和例子：*On the one hand, ... Furthermore, ...*\n3. **反对的论点**：同样多的论点，同样充分地展开：*On the other hand, ... Critics point out that ...*\n4. **结论**：权衡两方，说明你认为哪一方更有说服力，或者各自在什么条件下成立：*In conclusion, both sides make valid points. On balance, I believe ...* 不要在这里加新的论点。\n\n要公平地对待两方：像对方的支持者那样介绍你不赞同的一方，而不是把它写成不堪一击的观点。语气中立、正式，不用缩写。和观点类议论文不同，这种文章的引言不急于表态，判断留到结尾。",
    ),
  },
  question: t(
    "Write a for-and-against essay of 250 to 300 words in English. Introduce the question neutrally, give the arguments for and against in separate paragraphs, and end with a balanced conclusion.",
    "用英语写一篇 250 到 300 词的正反论证类议论文。中立地引出问题，分段写出支持和反对的论点，最后写出权衡后的结论。",
  ),
  bank: balanceBank,
  limits: { minWords: 220, maxChars: 3200 },
  what: t("for-and-against essay", "正反论证类议论文"),
});

/** topics are the topics of the unit Education and Opportunity. */
export const topics: readonly TopicDef[] = [
  university.topic,
  understanding.topic,
  assessment.topic,
  opportunity.topic,
  teaching.topic,
  growing.topic,
  abstracts.topic,
  thinking.topic,
  online.topic,
  vocations.topic,
  character.topic,
  mixedConditionals,
  balanceEssay,
];

/** vocabulary are the words the unit Education and Opportunity teaches. */
export const vocabulary: readonly WordBatch[] = [
  university.batch,
  understanding.batch,
  assessment.batch,
  opportunity.batch,
  teaching.batch,
  growing.batch,
  abstracts.batch,
  thinking.batch,
  online.batch,
  vocations.batch,
  character.batch,
];
