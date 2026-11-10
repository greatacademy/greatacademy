// B1, unit 1: Education and Learning. School life, how we learn, people at school, more subjects, thinking, qualities,
// study skills and linking words; the present perfect or the past simple; an informal email judged by a model.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { fill, judgedTopic } from "../a2/kit.ts";
import { interleave, vocabularyTopic, word } from "../words.ts";

const schoolLife = vocabularyTopic({
  id: "b1-words-school-life",
  title: t("School Life", "校园生活"),
  summary: t(
    "Education, semesters and terms; grades, marks and exams; passing and revising; assignments, essays, presentations and deadlines.",
    "教育、学期；成绩、分数和考试；通过和复习；作业、短文、演示和截止日期。",
  ),
  prerequisites: ["a1-words-schoolwork"],
  words: [
    word(
      "education",
      "the teaching and learning that happens at school and university",
      "教育",
      "A good {education} helps you find a good job.|deadline semester | In many countries, {education} is free until you are eighteen.|essay presentation | She went to the USA for her university {education}.|deadline mark",
      "assignment deadline",
    ),
    word(
      "semester semesters",
      "one of the two parts of a school or university year",
      "学期",
      "The spring {semester} starts in February.|essay deadline | I'm taking four classes this {semester}.|essay mark | Our university year has two {semesters}.|essays deadlines",
      "deadline exam",
      "term",
    ),
    word(
      "term terms",
      "one of the parts of the school year, often three",
      "学期",
      "The summer {term} ends in July.|essay grade | We have exams at the end of every {term}.|essay mark | There are three {terms} in a British school year.|marks essays",
      "exam deadline",
      "semester",
    ),
    word(
      "grade grades",
      "a letter or number that shows how good a piece of work is; a year at school",
      "成绩；年级",
      "She got a good {grade} in math.|deadline semester | My brother is in the fifth {grade}.|essay deadline | You need good {grades} to go to that university.|deadlines semesters",
      "deadline presentation",
      "mark",
    ),
    word(
      "exam exams",
      "an important test of what you know",
      "考试",
      "I have a history {exam} tomorrow, so I need to study tonight.|semester education | Did you pass all your {exams}?|deadlines semesters | We can't use our phones during the {exam}.|education deadline",
      "essay grade",
    ),
    word(
      "mark marks",
      "a number or letter given for a piece of school work",
      "分数",
      "I got full {marks} on the spelling test.|terms deadlines | What {mark} did you get for your essay?|term education | The pass {mark} is sixty.|term semester",
      "term essay",
      "grade",
    ),
    word(
      "pass passes passed passing",
      "to be successful in an exam or test",
      "通过（考试）",
      "If you study hard, you'll {pass} the exam.|lose forget | Only half of the class {passed} the driving test.|lost broke | You {passed} with a grade of A.|lost revised",
      "revise mark",
    ),
    word(
      "revise revises revised revising",
      "to study again what you have learned, before an exam",
      "复习",
      "I need to {revise} for my chemistry exam.|pass mark | She {revised} every evening for two weeks before the test.|passed marked | Let's {revise} together in the library after school.|pass grade",
      "pass submit",
    ),
    word(
      "assignment assignments",
      "a piece of work that a teacher asks you to do",
      "作业；任务",
      "The teacher gave us a long reading {assignment}.|semester education | Have you finished your history {assignment}?|mark semester | Please hand in your {assignments} by Friday.|terms semesters",
      "exam grade",
    ),
    word(
      "essay essays",
      "a short piece of writing about a subject",
      "短文；论文",
      "Write an {essay} of 300 words about your hometown.|exam education | Her {essay} on climate change won a prize.|semester deadline | I spent the whole weekend writing {essays}.|grades semesters",
      "presentation exam",
    ),
    word(
      "presentation presentations",
      "a talk in which you show and explain something to a group",
      "演示；陈述",
      "Tomorrow I have to give a {presentation} to the whole class.|semester deadline | He used photos and a map in his {presentation} about Italy.|semester deadline | Each student gave a five-minute {presentation}.|semester mark",
      "essay exam",
    ),
    word(
      "deadline deadlines",
      "the time or day by which you must finish something",
      "截止日期",
      "The {deadline} for the essay is next Monday.|education presentation | I always finish my work before the {deadline}.|grade education | If you miss the {deadline}, you'll lose marks.|education grade",
      "semester exam",
    ),
  ],
});

const learning = vocabularyTopic({
  id: "b1-words-learning",
  title: t("How We Learn", "我们怎样学习"),
  summary: t(
    "Knowledge and memory; memorizing, concentrating and focusing; progress, improvements and effort; methods, attention, explanations and ability.",
    "知识和记忆；背诵、集中注意力；进步、改进和努力；方法、注意力、解释和能力。",
  ),
  prerequisites: ["b1-words-school-life"],
  words: [
    word(
      "knowledge",
      "what you know about something",
      "知识",
      "He has a lot of {knowledge} about old cars.|memory effort | Reading is a great way to get {knowledge}.|method memory | My {knowledge} of Spanish is not very good.|effort attention",
      "memory method",
    ),
    word(
      "memory memories",
      "the ability to remember things; something you remember",
      "记忆",
      "My grandmother has a very good {memory}. She never forgets a birthday.|method effort | I have happy {memories} of my first school.|methods efforts | Can you say the poem from {memory}?|method attention",
      "knowledge mistake",
    ),
    word(
      "memorize memorizes memorized memorizing",
      "to learn something so well that you can say it without looking",
      "记住；背熟",
      "Actors have to {memorize} their lines.|concentrate focus | I {memorized} twenty new words today.|concentrated focused | Try {memorizing} the phone number.|concentrating focusing",
      "focus concentrate",
    ),
    word(
      "concentrate concentrates concentrated concentrating",
      "to give all your thinking to one thing",
      "集中注意力",
      "Turn off the TV. I can't {concentrate}!|knowledge attention | It's hard to {concentrate} on your homework when you're tired.|memorize effort | She {concentrated} on her reading and didn't hear the phone.|memorized progressed",
      "memorize explanation",
      "focus",
    ),
    word(
      "focus focuses focused focusing",
      "to give your attention to one thing; the main thing you look at",
      "集中；焦点",
      "Today we will {focus} on the past simple.|memorize effort | Put your phone away and {focus} on the lesson.|memorize attention | The {focus} of this book is family life.|memory mistake",
      "memorize progress",
      "concentrate",
    ),
    word(
      "progress",
      "the act of getting better or nearer to a goal",
      "进步；进展",
      "Your English is getting better. You're making good {progress}.|memory knowledge | The doctor is happy with his {progress} after the operation.|knowledge attention | We've made a lot of {progress} on the project this week.|knowledge memory",
      "effort method",
    ),
    word(
      "improvement improvements",
      "a change that makes something better",
      "改进；进步",
      "There has been a big {improvement} in your writing this term.|memory method | The new library is a great {improvement} on the old one.|attention memory | We made some {improvements} to the essay before we handed it in.|memories abilities",
      "effort method",
      "progress",
    ),
    word(
      "effort efforts",
      "hard work to do something",
      "努力",
      "Learning a language takes time and {effort}.|progress mistake | She made a big {effort} to arrive on time.|method memory | Thank you for all your {efforts}.|mistakes methods",
      "attention ability",
    ),
    word(
      "method methods",
      "a way of doing something",
      "方法",
      "What's the best {method} for learning new words?|progress attention | Our teacher uses a new {method} to teach reading.|progress knowledge | There are many {methods} of cooking rice.|mistakes efforts",
      "effort ability",
    ),
    word(
      "attention",
      "the act of watching, listening or thinking about something carefully",
      "注意；注意力",
      "Please pay {attention}. This is important.|progress effort | The children listened with great {attention}.|memory knowledge | The loud music got everyone's {attention}.|progress effort",
      "effort memory",
    ),
    word(
      "explanation explanations",
      "words that make something clear or give the reason for it",
      "解释；说明",
      "The teacher's {explanation} was clear, and everyone understood.|progress memory | Is there an {explanation} for the noise?|effort ability | He left without any {explanation}.|progress method",
      "method knowledge",
    ),
    word(
      "ability abilities",
      "the power or skill to do something",
      "能力",
      "She has the {ability} to learn languages very quickly.|attention mistake | The test checks your {ability} to read and write.|attention method | Dogs have an amazing {ability} to find lost people.|attention effort",
      "effort attention",
    ),
  ],
});

const schoolPeople = vocabularyTopic({
  id: "b1-words-school-people",
  title: t("People at School", "学校里的人"),
  summary: t(
    "Principals, classmates and tutors; professors, pupils, lecturers and counselors; scholarships, certificates and diplomas; campuses and dormitories.",
    "校长、同学和导师；教授、学生、讲师和辅导员；奖学金、证书和文凭；校园和宿舍。",
  ),
  prerequisites: ["b1-words-school-life"],
  words: [
    word(
      "principal principals",
      "the head of a school",
      "校长",
      "The {principal} gave a speech at the start of the school year.|campus diploma | If you're late three times, you have to see the {principal}.|dormitory certificate | Our new {principal} used to be a math teacher.|campus scholarship",
      "pupil tutor",
    ),
    word(
      "classmate classmates",
      "someone in the same class as you",
      "同班同学",
      "I sat next to my {classmate} on the bus.|diploma campus | All my {classmates} came to my birthday party.|diplomas campuses | Ask a {classmate} if you don't understand the homework.|certificate dormitory",
      "principal professor",
    ),
    word(
      "tutor tutors",
      "a teacher who teaches one student or a small group",
      "家庭教师；导师",
      "My parents found a {tutor} to help me with chemistry.|campus diploma | She works as a math {tutor} on weekends.|campus dormitory | My {tutor} comes to our house every Tuesday.|scholarship campus",
      "principal pupil",
    ),
    word(
      "professor professors",
      "a teacher of the highest rank at a university",
      "教授",
      "{Professor} Lin teaches history at the university.|campus diploma | She became a {professor} at the age of forty.|campus dormitory | The {professors} at this university are famous scientists.|campuses diplomas",
      "pupil classmate",
      "lecturer",
    ),
    word(
      "pupil pupils",
      "a child at school",
      "小学生；学生",
      "There are thirty {pupils} in each class.|campuses diplomas | The teacher asked each {pupil} to read a page.|campus certificate | She was a quiet {pupil}, but she worked hard.|campus diploma",
      "professor principal",
    ),
    word(
      "lecturer lecturers",
      "someone who teaches at a university by giving talks",
      "讲师",
      "The {lecturer} spoke for an hour about modern art.|campus dormitory | My sister is a {lecturer} in economics.|campus diploma | The {lecturers} put their slides online after each class.|campuses dormitories",
      "pupil classmate",
      "professor",
    ),
    word(
      "counselor counselors",
      "someone whose job is to listen to people and give them advice",
      "辅导员；顾问",
      "If you feel worried, you can talk to the school {counselor}.|campus diploma | The {counselor} helped me choose my subjects.|campus certificate | Our school's {counselors} help students with their problems.|campuses diplomas",
      "principal pupil",
    ),
    word(
      "scholarship scholarships",
      "money given to a good student to pay for their studies",
      "奖学金",
      "She won a {scholarship} to study in London.|campus dormitory | Without the {scholarship}, he couldn't pay for university.|diploma campus | The university gives ten {scholarships} every year.|campuses pupils",
      "certificate diploma",
    ),
    word(
      "certificate certificates",
      "a paper that shows you have done or passed something",
      "证书",
      "You get a {certificate} at the end of the course.|campus dormitory | Here is my swimming {certificate}.|campus principal | She keeps all her {certificates} in a box.|campuses principals",
      "scholarship campus",
      "diploma",
    ),
    word(
      "diploma diplomas",
      "a paper you get when you finish school or a course",
      "毕业文凭",
      "He got his high school {diploma} last summer.|campus dormitory | She has a {diploma} in nursing.|campus principal | The students walked up to get their {diplomas}.|campuses dormitories",
      "scholarship tutor",
      "certificate",
    ),
    word(
      "campus campuses",
      "the land and buildings of a university or college",
      "校园",
      "The university {campus} has a lake and a sports center.|diploma tutor | First-year students must live on {campus}.|diploma certificate | Our school has two {campuses} in the city.|diplomas certificates",
      "diploma tutor",
    ),
    word(
      "dormitory dormitories",
      "a building where students live and sleep",
      "宿舍",
      "I share a room in the {dormitory} with two other students.|diploma scholarship | The {dormitories} are next to the library.|diplomas scholarships | Lights go out in the {dormitory} at eleven.|diploma certificate",
      "classmate certificate",
    ),
  ],
});

const subjects = vocabularyTopic({
  id: "b1-words-subjects-2",
  title: t("More Subjects", "更多学科"),
  summary: t(
    "Geography, biology, chemistry and physics; literature, economics, philosophy and psychology; engineering, law, politics and drama.",
    "地理、生物、化学和物理；文学、经济学、哲学和心理学；工程、法律、政治和戏剧。",
  ),
  prerequisites: ["a1-words-school-subjects"],
  words: [
    word(
      "geography",
      "the study of countries, mountains, rivers and weather",
      "地理",
      "In {geography}, we learned about the longest rivers in the world.|chemistry philosophy | Maps are very important in {geography}.|psychology law | Our {geography} teacher showed us photos of volcanoes.|economics literature",
      "biology history",
    ),
    word(
      "biology",
      "the study of living things",
      "生物",
      "In {biology}, we studied how plants grow.|economics law | She wants to study {biology} because she loves animals.|politics law | Our {biology} class went to the zoo.|law economics",
      "chemistry geography",
    ),
    word(
      "chemistry",
      "the study of what things are made of and how they change when they are mixed",
      "化学",
      "In {chemistry}, we mixed two liquids and they turned blue.|literature geography | My {chemistry} teacher wears a white coat in the lab.|literature politics | Water is H2O: you learn that in {chemistry}.|drama literature",
      "physics biology",
    ),
    word(
      "physics",
      "the study of energy, light, heat, movement and forces",
      "物理",
      "In {physics}, we learned why things fall to the ground.|literature drama | Einstein is famous for his work in {physics}.|drama law | Our {physics} teacher showed us how light moves.|law drama",
      "chemistry economics",
    ),
    word(
      "literature",
      "books, plays and poems, and the study of them",
      "文学",
      "We read a play by Shakespeare in {literature} class.|physics chemistry | She studied English {literature} at university.|physics engineering | Chinese {literature} has many famous poems.|engineering chemistry",
      "philosophy history",
    ),
    word(
      "economics",
      "the study of how money, work and trade work in a country",
      "经济学",
      "In {economics}, we learn why prices go up and down.|biology drama | He studied {economics} and now works at a bank.|biology drama | The {economics} teacher talked about jobs and money.|biology geography",
      "politics law",
    ),
    word(
      "philosophy",
      "the study of big questions about life, truth and how we should live",
      "哲学",
      "In {philosophy} class, we discussed what makes a good life.|chemistry engineering | Confucius is one of the most famous names in Chinese {philosophy}.|engineering chemistry | She loves {philosophy} because she likes asking big questions.|engineering physics",
      "psychology literature",
    ),
    word(
      "psychology",
      "the study of the mind and why people behave as they do",
      "心理学",
      "She studied {psychology} because she wanted to understand how people think.|engineering geography | In {psychology}, we learned about memory and sleep.|geography engineering | My cousin is a teacher of child {psychology}.|geography engineering",
      "philosophy biology",
    ),
    word(
      "engineering",
      "the work of designing and building machines, roads and bridges",
      "工程",
      "He studied {engineering} and now builds bridges.|psychology literature | Computer {engineering} is a popular subject at our university.|literature drama | She wants to work in {engineering} because she loves machines.|literature philosophy",
      "physics economics",
    ),
    word(
      "law laws",
      "the rules of a country; the study of these rules",
      "法律",
      "Stealing is against the {law}.|drama physics | She studied {law} for five years and now helps people in court.|chemistry drama | There are new {laws} about cycling in the city.|dramas economics",
      "politics philosophy",
    ),
    word(
      "politics",
      "the activities of governments and of the people who want to be in power",
      "政治",
      "He went into {politics} and became mayor of the city.|chemistry geography | Young people should be interested in {politics}, because laws change their lives.|chemistry drama | {Politics} is about how a country is run.|chemistry drama",
      "law economics",
    ),
    word(
      "drama",
      "the study and acting of plays; an exciting event",
      "戏剧",
      "In {drama} class, we act out stories.|physics economics | She joined the school {drama} club and acted in three plays.|physics economics | The {drama} teacher helped us learn our lines.|economics physics",
      "literature psychology",
    ),
  ],
});

const thinking = vocabularyTopic({
  id: "b1-words-thinking",
  title: t("Thinking", "思考"),
  summary: t(
    "Reminding, imagining and wondering; realizing, believing and considering; supposing and preferring; solving, comparing, discussing and describing.",
    "提醒、想象和想知道；意识到、相信和考虑；猜想和更喜欢；解决、比较、讨论和描述。",
  ),
  prerequisites: ["b1-words-learning"],
  words: [
    word(
      "remind reminds reminded reminding",
      "to make someone remember something",
      "提醒；使想起",
      "Please {remind} me to buy milk on the way home.|describe compare | This song {reminds} me of my summer holiday.|describes compares | She {reminded} us that the essay was due on Friday.|described solved",
      "realize solve",
    ),
    word(
      "imagine imagines imagined imagining",
      "to make a picture of something in your mind",
      "想象",
      "{Imagine} you're on a beach in the sun.|describe solve | I can't {imagine} life without my phone.|solve prefer | As a child, she {imagined} that her toys could talk.|solved compared",
      "describe compare",
    ),
    word(
      "wonder wonders wondered wondering",
      "to want to know something",
      "想知道",
      "I {wonder} why the sky is blue.|solve prefer | She {wondered} if she had left the door open.|described compared | I was {wondering} if you could help me.|describing solving",
      "guess compare",
    ),
    word(
      "realize realizes realized realizing",
      "to suddenly understand or notice something",
      "意识到",
      "When I got to school, I {realized} I had left my bag at home.|described compared | Do you {realize} how late it is?|describe solve | He didn't {realize} that the shop was closed.|solve prefer",
      "imagine guess",
    ),
    word(
      "believe believes believed believing",
      "to think that something is true",
      "相信",
      "Do you {believe} in ghosts?|solve compare | Nobody {believed} his story about the dog eating his homework.|solved wondered | I {believe} that every child should go to school.|solve compare",
      "imagine wonder",
      "suppose",
    ),
    word(
      "consider considers considered considering",
      "to think carefully about something before deciding",
      "考虑",
      "We're {considering} moving to a bigger flat.|solving wondering | Please {consider} my idea before you say no.|wonder solve | She {considered} studying abroad, but decided to stay.|solved wondered",
      "prefer realize",
    ),
    word(
      "suppose supposes supposed supposing",
      "to think that something is probably true",
      "猜想；认为",
      "I {suppose} you're right.|describe solve | You're {supposed} to wear a uniform at school.|described solved | Where's Tom? I {suppose} he's still in bed.|compare describe",
      "wonder prefer",
      "guess believe",
    ),
    word(
      "prefer prefers preferred preferring",
      "to like one thing more than another",
      "更喜欢",
      "I {prefer} tea to coffee.|solve imagine | Would you {prefer} to sit by the window?|describe solve | She {prefers} walking to taking the bus.|solves describes",
      "compare consider",
    ),
    word(
      "solve solves solved solving",
      "to find the answer to a problem",
      "解决；解答",
      "Can you {solve} this math problem?|prefer wonder | The engineers {solved} the problem with the bridge.|preferred wondered | We need to {solve} this problem together.|prefer wonder",
      "guess compare",
    ),
    word(
      "compare compares compared comparing",
      "to look at two or more things to see how they are the same or different",
      "比较",
      "{Compare} the two pictures and find five differences.|solve wonder | Don't {compare} yourself to your brother.|solve wonder | {Compared} to Beijing, my town is very quiet.|solved wondered",
      "prefer consider",
    ),
    word(
      "discuss discusses discussed discussing",
      "to talk about something with other people",
      "讨论",
      "Let's {discuss} this at the meeting tomorrow.|wonder prefer | We {discussed} the problem for an hour.|wondered preferred | In groups, {discuss} your favorite books.|wonder realize",
      "describe compare",
    ),
    word(
      "describe describes described describing",
      "to say what something or someone is like",
      "描述",
      "Can you {describe} the man you saw?|wonder prefer | She {described} her new house to me.|wondered realized | {Describe} your best friend in five sentences.|wonder suppose",
      "discuss compare",
    ),
  ],
});

const qualities = vocabularyTopic({
  id: "b1-words-qualities",
  title: t("Qualities", "品质"),
  summary: t(
    "Creative, intelligent, clever and wise; talent and talented; confident, independent, responsible and thoughtful; lazy and brave.",
    "有创造力的、聪明的、机灵的和明智的；天赋和有天赋的；自信的、独立的、负责的和体贴的；懒惰的和勇敢的。",
  ),
  prerequisites: ["a1-words-describing-people"],
  words: [
    word(
      "creative",
      "good at thinking of new ideas and making things",
      "有创造力的",
      "She's very {creative}. She paints, writes songs and makes her own clothes.|lazy responsible | We need a {creative} idea for the school poster.|lazy brave | Art class helps children to be {creative}.|lazy talent",
      "confident clever",
    ),
    word(
      "intelligent",
      "able to learn and understand things quickly",
      "聪明的",
      "Dolphins are very {intelligent} animals.|lazy responsible | She's {intelligent}, but she doesn't always work hard.|lazy talent | He asked some very {intelligent} questions.|lazy independent",
      "creative confident",
      "clever wise",
    ),
    word(
      "clever cleverer cleverest",
      "quick at learning and understanding",
      "聪明的；机灵的",
      "What a {clever} idea!|lazy independent | She's the {cleverest} girl in the class. She always gets full marks.|laziest bravest | My little brother is {clever}. He can already read, and he's only four.|lazy brave",
      "creative confident",
      "intelligent wise",
    ),
    word(
      "wise wiser wisest",
      "able to make good decisions because of knowledge and experience",
      "明智的；有智慧的",
      "My grandfather is a {wise} old man. People often ask him for advice.|lazy brave | It was {wise} to take an umbrella. It rained all day.|lazy brave | It's not {wise} to swim after a big meal.|lazy talented",
      "creative confident",
      "clever intelligent",
    ),
    word(
      "talent talents",
      "a natural ability to do something well",
      "天赋；才能",
      "She has a real {talent} for music.|mistake method | The show is looking for young people with {talent}.|mistakes methods | He has many {talents}: he sings, dances and paints.|mistakes methods",
      "effort memory",
      "talented",
    ),
    word(
      "talented",
      "having a natural ability to do something well",
      "有天赋的",
      "He's a very {talented} singer.|lazy wise | The school is for {talented} young dancers.|lazy responsible | She's {talented} at drawing.|lazy brave",
      "confident brave",
      "talent",
    ),
    word(
      "confident",
      "sure that you can do something well",
      "自信的",
      "After a lot of practice, I felt {confident} before the exam.|lazy talented | She's a {confident} speaker. She isn't afraid of big groups.|lazy thoughtful | Be {confident}! You know the answers.|lazy independent",
      "responsible thoughtful",
    ),
    word(
      "independent",
      "able to do things without help from other people",
      "独立的",
      "At eighteen, many young people want to be {independent} from their parents.|lazy thoughtful | She's very {independent}. She cooks, cleans and pays her own bills.|lazy creative | The country became {independent} in 1960.|lazy brave",
      "confident responsible",
    ),
    word(
      "responsible",
      "having the job of looking after something; able to be trusted",
      "负责任的；负责的",
      "Who is {responsible} for feeding the cat this week?|lazy creative | She's a {responsible} girl, so her parents let her stay home alone.|lazy creative | Drivers are {responsible} for the safety of their passengers.|lazy talented",
      "independent confident",
    ),
    word(
      "thoughtful",
      "kind and always thinking of what other people need",
      "体贴的",
      "It was very {thoughtful} of you to bring me flowers.|lazy independent | He's a {thoughtful} son. He calls his mother every day.|lazy talented | Thank you for the {thoughtful} gift.|lazy brave",
      "creative confident",
    ),
    word(
      "lazy lazier laziest",
      "not wanting to work or do anything",
      "懒惰的",
      "He's too {lazy} to make his bed.|confident thoughtful | I had a {lazy} morning on the sofa.|talented responsible | Our cat is the {laziest} animal I know. It sleeps all day.|cleverest bravest",
      "independent brave",
    ),
    word(
      "brave braver bravest",
      "not afraid of danger",
      "勇敢的",
      "The {brave} firefighter ran into the burning house.|lazy thoughtful | Be {brave}. The doctor won't hurt you.|lazy creative | It was {brave} of her to speak in front of the whole school.|lazy creative",
      "creative talented",
    ),
  ],
});

const studySkills = vocabularyTopic({
  id: "b1-words-study-skills",
  title: t("Study Skills", "学习技能"),
  summary: t(
    "Enrolling; defining, underlining and summarizing; outlines and highlighting; repeating, correcting, copying and submitting; notes and instructions.",
    "注册；定义、画线和概括；提纲和用荧光笔标出；重复、改正、抄写和提交；笔记和说明。",
  ),
  prerequisites: ["b1-words-school-life"],
  words: [
    word(
      "enroll enrolls enrolled enrolling",
      "to put your name on the list for a course or a school",
      "注册；入学",
      "I've {enrolled} in a French class for beginners.|underlined copied | You can {enroll} online before September.|underline define | Over 2,000 students {enroll} at the college every year.|underline highlight",
      "submit summarize",
    ),
    word(
      "define defines defined defining",
      "to say exactly what a word means",
      "定义；解释",
      "Can you {define} the word 'education'?|enroll submit | The dictionary {defines} 'campus' as the land and buildings of a university.|enrolls submits | First, {define} the problem; then look for an answer.|enroll submit",
      "underline summarize",
    ),
    word(
      "underline underlines underlined underlining",
      "to draw a line under a word",
      "在……下面画线",
      "{Underline} the verbs in each sentence.|enroll submit | She {underlined} the important words in red.|enrolled submitted | I always {underline} new words when I read.|enroll submit",
      "define summarize",
      "highlight",
    ),
    word(
      "summarize summarizes summarized summarizing",
      "to give the main points of something in a few words",
      "总结；概括",
      "{Summarize} the story in three sentences.|enroll underline | Can you {summarize} what the teacher said?|enroll underline | The last paragraph {summarizes} the main ideas.|enrolls submits",
      "define copy",
    ),
    word(
      "outline outlines",
      "a short plan of the main points of a piece of writing",
      "提纲；大纲",
      "Write an {outline} before you start your essay.|instruction deadline | Here is an {outline} of the course: twelve units in two terms.|instruction exam | My {outline} has three parts: the beginning, the middle and the end.|instruction deadline",
      "summarize copy",
      "note",
    ),
    word(
      "highlight highlights highlighted highlighting",
      "to mark words with a bright color so they are easy to see; to show that something is important",
      "用荧光笔标出；突出",
      "{Highlight} the key words in yellow.|enroll submit | The report {highlights} the problems with the school's food.|enrolls copies | She {highlighted} every new word in the text.|enrolled submitted",
      "define copy",
      "underline",
    ),
    word(
      "repeat repeats repeated repeating",
      "to say or do something again",
      "重复",
      "Could you {repeat} that, please? I didn't hear you.|enroll submit | Listen and {repeat} after me.|enroll submit | He had to {repeat} the year because he failed his exams.|define enroll",
      "copy correct",
    ),
    word(
      "correct corrects corrected correcting",
      "to make something right; to mark the mistakes in a piece of work",
      "改正；批改",
      "The teacher {corrected} my spelling mistakes.|enrolled summarized | Please {correct} me if I say something wrong.|define enroll | Read your essay again and {correct} any mistakes.|enroll define",
      "copy repeat",
    ),
    word(
      "copy copies copied copying",
      "to write or make something exactly the same as another thing",
      "抄写；复制",
      "{Copy} the new words into your notebook.|enroll define | He {copied} his friend's homework, and the teacher saw it.|enrolled defined | Can you make three {copies} of this page?|outlines instructions",
      "correct repeat",
    ),
    word(
      "submit submits submitted submitting",
      "to give your work to someone to check",
      "提交",
      "Please {submit} your essays by Friday.|define underline | I {submitted} my application online.|underlined defined | All work must be {submitted} before the deadline.|enrolled defined",
      "copy repeat",
    ),
    word(
      "note notes",
      "a few words you write down to help you remember",
      "笔记；便条",
      "Take {notes} during the lesson.|deadlines memories | I left a {note} on the fridge for my mom.|outline instruction | Can I borrow your {notes} from yesterday's class?|instructions deadlines",
      "instruction certificate",
      "outline",
    ),
    word(
      "instruction instructions",
      "words that tell you how to do something",
      "说明；指示",
      "Read the {instructions} before you use the machine.|deadlines certificates | Follow the teacher's {instructions} carefully.|deadlines memories | The {instructions} are in English and Chinese.|deadlines efforts",
      "note outline",
    ),
  ],
});

const linking = vocabularyTopic({
  id: "b1-words-little-words-4",
  title: t("Linking Words 1", "连接词 1"),
  summary: t(
    "Within, might, whose and whom; although, though and however; unless, either, neither and whether; toward.",
    "within、might、whose 和 whom；although、though 和 however；unless、either、neither 和 whether；toward。",
  ),
  prerequisites: ["a2-words-little-words-3"],
  words: [
    word(
      "within",
      "inside a period of time or a distance",
      "在……之内",
      "Please answer {within} two days.|unless whose | The school is {within} walking distance of my house.|toward unless | You'll get your results {within} a week.|toward whether",
      "toward either",
    ),
    word(
      "might",
      "a word that shows that something is possible",
      "可能",
      "Take an umbrella. It {might} rain later.|whose either | I {might} go to the party, but I'm not sure.|whom neither | He {might} be at home. Try calling him.|whether whose",
      "whether either",
    ),
    word(
      "whose",
      "a word that asks or tells who something belongs to",
      "谁的",
      "{Whose} bag is this?|whom whether | That's the girl {whose} father is a pilot.|whom though | I don't know {whose} phone this is.|whom though",
      "whom whether",
    ),
    word(
      "whom",
      "who, used after words such as to, with and for",
      "谁（宾格）",
      "To {whom} should I send the letter?|whose whether | The man with {whom} she works is from Canada.|whose either | {Whom} did you meet at the party?|whose whether",
      "whose either",
    ),
    word(
      "although",
      "a word that joins two ideas when the second one is surprising",
      "尽管；虽然",
      "{Although} it was raining, we went for a walk.|unless whether | I enjoyed the film, {although} it was very long.|unless whom | {Although} she's only ten, she plays the piano beautifully.|unless whether",
      "unless whether",
      "though however",
    ),
    word(
      "though",
      "although; but, at the end of a sentence",
      "虽然；不过",
      "It's a small flat. I like it, {though}.|unless whether | Even {though} he was tired, he finished his homework.|unless whether | {Though} the test was hard, everyone passed.|unless whom",
      "unless whether",
      "although however",
    ),
    word(
      "however",
      "but; a word that adds an idea that is different",
      "然而；但是",
      "The hotel was nice. {However}, the food was terrible.|unless whether | I'd love to come. {However}, I have an exam that day.|unless either | Most students passed. Some, {however}, need to take the test again.|unless whether",
      "unless either",
      "although though",
    ),
    word(
      "unless",
      "except if",
      "除非",
      "You can't go out {unless} you finish your homework.|whether although | I'll walk to school {unless} it rains.|whose whom | {Unless} you hurry, you'll miss the bus.|whose neither",
      "whether although",
    ),
    word(
      "either",
      "one or the other of two; also, after a sentence with not",
      "两者之一；也（用于否定句）",
      "You can have {either} tea or coffee.|neither whether | I don't like it, and my sister doesn't {either}.|whom whose | There are shops on {either} side of the street.|whose whom",
      "neither whether",
    ),
    word(
      "neither",
      "not one and not the other of two",
      "两者都不",
      '{Neither} of my parents can swim.|whom whether | "I don\'t like coffee." "{Neither} do I."|either whom | {Neither} answer is right. Try again.|whom unless',
      "either whether",
    ),
    word(
      "whether",
      "if, when there are two possible answers",
      "是否",
      "I don't know {whether} to laugh or cry.|unless either | She asked me {whether} I was coming to the party.|unless whom | {Whether} you like it or not, you have to go to school.|unless although",
      "either unless",
    ),
    word(
      "toward",
      "in the direction of",
      "朝着；向",
      "The dog ran {toward} me.|within unless | She walked {toward} the door.|within whom | We drove {toward} the mountains.|unless whether",
      "within either",
    ),
  ],
});

// The present perfect or the past simple.

/**
 * StateVerb is a verb of a state or a habit with a subject: its present form, its past, its present perfect (with
 * has or have), the rest of the sentence, a point with since and a finished time in the past.
 */
type StateVerb = readonly [string, string, string, string, string, string, string, string];

/** stateVerbs are subject, base, present, past, present perfect, rest, since and a finished past time. */
const stateVerbs: readonly StateVerb[] = [
  ["My aunt", "live", "lives", "lived", "has lived", "in Paris", "since 2019", "in 2015"],
  ["I", "know", "know", "knew", "have known", "Anna", "since we were five", "when we were at primary school"],
  ["We", "have", "have", "had", "have had", "this car", "since last summer", "in 2018"],
  ["Tom", "work", "works", "worked", "has worked", "at the hospital", "since March", "two years ago"],
  ["She", "be", "is", "was", "has been", "a teacher", "since 2015", "in 2010"],
  ["They", "study", "study", "studied", "have studied", "Japanese", "since last September", "last year"],
  ["My brother", "play", "plays", "played", "has played", "the piano", "since he was six", "when he was a child"],
  ["Mr. Wang", "teach", "teaches", "taught", "has taught", "at this school", "since 2012", "from 2005 to 2010"],
  ["I", "want", "want", "wanted", "have wanted", "a dog", "since I was little", "when I was little"],
  ["My grandpa", "wear", "wears", "wore", "has worn", "glasses", "since he was forty", "ten years ago"],
  ["We", "keep", "keep", "kept", "have kept", "chickens", "since last spring", "when we lived on a farm"],
  ["Lily", "collect", "collects", "collected", "has collected", "stamps", "since she was eight", "in 2016"],
  ["They", "be", "are", "were", "have been", "friends", "since primary school", "when they were at primary school"],
  ["I", "sing", "sing", "sang", "have sung", "in the school choir", "since Grade 3", "when I was in Grade 3"],
  ["Our dog", "sleep", "sleeps", "slept", "has slept", "in the kitchen", "since he was a puppy", "last night"],
  ["My parents", "run", "run", "ran", "have run", "a small shop", "since 2010", "in the 1990s"],
];

/** firstTimes are a subject, the base, the past and the participle of a verb, and its object. */
const firstTimes: readonly (readonly [string, string, string, string, string])[] = [
  ["I", "eat", "ate", "eaten", "sushi"],
  ["We", "see", "saw", "seen", "snow"],
  ["I", "fly", "flew", "flown", "in a plane"],
  ["They", "ride", "rode", "ridden", "a horse"],
  ["We", "visit", "visited", "visited", "Beijing"],
  ["I", "meet", "met", "met", "a famous singer"],
  ["They", "win", "won", "won", "a prize"],
  ["I", "give", "gave", "given", "a presentation in English"],
];

const haveOf = (subject: string) => (["I", "We", "They", "My parents"].includes(subject) ? "have" : "has");

const ppChoiceBank: readonly ChoiceItem[] = interleave([
  stateVerbs.map(
    ([subject, , present, past, perfect, rest, since]): ChoiceItem => [`${subject} ___ ${rest} ${since}.`, perfect, [present, past]],
  ),
  stateVerbs.map(
    ([subject, , present, past, perfect, rest, , ago]): ChoiceItem => [`${subject} ___ ${rest} ${ago}.`, past, [perfect, present]],
  ),
  [
    ...firstTimes.map(
      ([subject, base, past, participle, object]): ChoiceItem => [
        `This is the first time ${subject === "I" ? "I" : subject.toLowerCase()} ___ ${object}.`,
        `${haveOf(subject)} ${participle}`,
        [past, base],
      ],
    ),
    ...firstTimes.map(
      ([subject, base, past, participle, object]): ChoiceItem => [
        `${subject} ___ ${object} for the first time last week.`,
        past,
        [`${haveOf(subject)} ${participle}`, base],
      ],
    ),
  ],
]);

const short: Readonly<Record<string, string>> = { I: "I've", We: "We've", They: "They've", She: "She's" };

/** perfectStart is the subject and have or has, with the short form allowed for a pronoun. */
function perfectStart(subject: string, have: string): string {
  const contracted = short[subject];
  return contracted ? `[${subject} ${have}|${contracted}]` : `${subject} ${have}`;
}

const ppTypedBank: readonly TypedItem[] = interleave([
  stateVerbs.map(([subject, base, present, , perfect, rest, since]): TypedItem => {
    const [have, participle] = perfect.split(" ") as [string, string];
    return {
      shown: `${subject} / ${base} / ${rest} / ${since}`,
      accepted: [`${perfectStart(subject, have)} ${participle} ${rest} ${since}.`],
      canonical: `${subject} ${perfect} ${rest} ${since}.`,
      wrong: [`${subject} ${present} ${rest} ${since}.`, `${subject} ${perfect.replace(/^ha(s|ve) /u, "")} ${rest} ${since}.`],
    };
  }),
  stateVerbs.map(
    ([subject, base, present, past, perfect, rest, , ago]): TypedItem => ({
      shown: `${subject} / ${base} / ${rest} / ${ago}`,
      accepted: [`${subject} ${past} ${rest} ${ago}.`],
      canonical: `${subject} ${past} ${rest} ${ago}.`,
      wrong: [`${subject} ${perfect} ${rest} ${ago}.`, `${subject} ${present} ${rest} ${ago}.`],
    }),
  ),
  [
    ...firstTimes.map(([subject, base, past, participle, object]): TypedItem => {
      const who = subject === "I" ? "I" : subject.toLowerCase();
      const start = short[subject] ? `[${who} ${haveOf(subject)}|${short[subject]!.replace(subject, who)}]` : `${who} ${haveOf(subject)}`;
      return {
        shown: `This is the first time / ${who} / ${base} / ${object}`,
        accepted: [`This is the first time ${start} ${participle} ${object}.`],
        canonical: `This is the first time ${who} ${haveOf(subject)} ${participle} ${object}.`,
        wrong: [`This is the first time ${who} ${past} ${object}.`, `This is the first time ${who} ${base} ${object}.`],
      };
    }),
    ...firstTimes.map(
      ([subject, base, past, participle, object]): TypedItem => ({
        shown: `${subject} / ${base} / ${object} / for the first time last week`,
        accepted: [`${subject} ${past} ${object} for the first time last week.`],
        canonical: `${subject} ${past} ${object} for the first time last week.`,
        wrong: [
          `${subject} ${haveOf(subject)} ${participle} ${object} for the first time last week.`,
          `${subject} ${base} ${object} for the first time last week.`,
        ],
      }),
    ),
  ],
]);

/** ppNote explains in Chinese which tense a sentence needs, from its time words. */
function ppNote(sentence: string): string {
  if (sentence.includes("since")) return "since 加过去的起点，说的是从那时一直到现在，用现在完成时，不用一般现在时";
  if (sentence.startsWith("This is the first time")) return "This is the first time 后面用现在完成时";
  return "句中有过去的具体时间（yesterday、last week、in 2015、two years ago、when I was little 等），用一般过去时，不用现在完成时";
}

const presentPerfectOrPastSimple: TopicDef = {
  id: "present-perfect-or-past-simple",
  title: t("The Present Perfect or the Past Simple", "现在完成时还是一般过去时"),
  summary: t(
    "I have lived here since 2019, but I lived in Paris in 2015. Since and the first time take the present perfect; a finished time takes the past simple.",
    "I have lived here since 2019，但 I lived in Paris in 2015。since 和 the first time 用现在完成时；过去的具体时间用一般过去时。",
  ),
  prerequisites: ["present-perfect-with-just-already-and-yet", "past-simple-questions-and-negatives"],
  encompasses: [
    { topic: "present-perfect-with-just-already-and-yet", weight: 0.3 },
    { topic: "past-simple-questions-and-negatives", weight: 0.2 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "which-tense",
      t("Which tense?", "用哪个时态？"),
      t(
        "Look at the time words.\n\n- A finished time in the past takes the **past simple**: *yesterday, last week, in 2015, two years ago, when I was little*. *I lived in Paris in 2015.* Never *I have lived in Paris in 2015.*\n- A time that runs up to now takes the **present perfect**. *since* gives the point where it began: *I have lived here since 2019* (and I still live here). Do not use the present simple: not *I live here since 2019*.\n- *This is the first time* takes the present perfect: *This is the first time I have eaten sushi.* But with a finished time: *I ate sushi for the first time last week.*",
        "看句子里的时间词。\n\n- 过去某个已经结束的时间，用**一般过去时**：*yesterday, last week, in 2015, two years ago, when I was little*。*I lived in Paris in 2015.* 不能说 *I have lived in Paris in 2015.*\n- 一直延续到现在的时间，用**现在完成时**。*since* 说明从什么时候开始：*I have lived here since 2019*（现在还住在这里）。不要用一般现在时，不能说 *I live here since 2019*。\n- *This is the first time* 后面用现在完成时：*This is the first time I have eaten sushi.* 但有过去的具体时间时：*I ate sushi for the first time last week.*\n\n中文“我从 2019 年起就住在这里”里动词没有变化，英语却要用 *have lived*，这是中国学生最常出错的地方。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), ppChoiceBank, (right, shown) =>
        t(fill(shown, right), `${fill(shown, right)}（${ppNote(shown)}）`),
      ),
    ),
    point(
      "write",
      t("Writing in the right tense", "用正确的时态写句子"),
      t(
        "Write the sentence from the note. With *since* or after *This is the first time*, use *have* or *has* and the past participle: *Tom has worked at the hospital since March.* With a finished time, use the past simple: *Tom worked at the hospital two years ago.*",
        "根据笔记写句子。有 *since* 或在 *This is the first time* 后面，用 *have / has* 加过去分词：*Tom has worked at the hospital since March.* 有过去的具体时间，用一般过去时：*Tom worked at the hospital two years ago.*",
      ),
      typedGenerator("sentence-pattern", t("Write a sentence from the note.", "根据笔记写一个句子。"), ppTypedBank, (right) =>
        t(right, `${right}（${ppNote(right)}）`),
      ),
    ),
  ],
};

// An informal email.

const informalBank: readonly WritingItem[] = [
  {
    task: "Answer your friend's email.",
    source:
      "Hi! How are you? I haven't heard from you since the summer. How is your new school? Have you made any friends? I've started learning the guitar, and I practice every day. Let's meet up soon! Mia",
    model:
      "Hi Mia,\n\nIt's great to hear from you! Sorry I haven't written for so long. I've been really busy since school started.\n\nMy new school is much bigger than the old one, and at first I got lost every day! The teachers are friendly, though, and I've already made two good friends, Leo and Sara. We sit together at lunch. Last week we gave a presentation about volcanoes, and we got the best mark in the class.\n\nWell done on the guitar! You'll have to play something for me. Are you free next Saturday afternoon? We could meet at the café near the park and you could tell me all your news.\n\nLove,\nAnna",
  },
  {
    task: "Answer your friend's email.",
    source:
      "Hey! Guess what? I passed my driving test yesterday! I'm so happy. What about you? How did your exams go? And what are you doing this summer? Let's do something fun together. Jack",
    model:
      "Hey Jack,\n\nCongratulations! That's amazing news. I knew you would pass. You practiced so much!\n\nMy exams finished last Friday. I think most of them went well, but the chemistry exam was really hard. I couldn't answer two of the questions. I'll get my results in July, so I'm trying not to think about it.\n\nThis summer I'm working in my uncle's shop for a month, but I'm free in August. Now that you can drive, why don't we take a trip to the beach? We could go for a day, swim, and have a picnic. What do you think?\n\nSee you soon,\nTom",
  },
  {
    task: "Answer your friend's email.",
    source:
      "Hi! I've just moved to a new city for university. My dormitory is small, but my roommate is nice. Have you decided which university you want to go to? What subject are you going to study? Write soon! Emma",
    model:
      "Hi Emma,\n\nThanks for your email! It sounds like you're having a great time already. I'm glad your roommate is nice. That makes a big difference.\n\nYes, I've finally decided! I'm going to study psychology at a university in Shanghai. I've always been interested in how people think, and the course looks really interesting. I'm a bit nervous about living away from home, but I'm also excited.\n\nWhy don't I come and visit you before my course starts? I could come for a weekend in September, and you could show me your campus. Let me know which weekend is good for you.\n\nLots of love,\nLucy",
  },
  {
    task: "Answer your friend's email.",
    source:
      "Hello! I need your help. I have to give a presentation in English next week, and I'm really nervous. You've given lots of presentations. Do you have any tips? Also, how was your trip to Xi'an? Ben",
    model:
      "Hi Ben,\n\nDon't worry, you'll be fine! I was really nervous before my first presentation too.\n\nHere are my tips. First, don't try to memorize every word. Write short notes on cards instead. Second, practice in front of a mirror or your family a few times. Third, speak slowly and look at the people, not at the floor. If you make a mistake, just smile and continue.\n\nMy trip to Xi'an was fantastic. We saw the Terracotta Warriors, and we cycled on the old city wall. The food was amazing too.\n\nIf you like, we could practice your presentation together on Sunday. Call me!\n\nGood luck,\nDavid",
  },
  {
    task: "Answer your friend's email.",
    source:
      "Hi! It's my birthday next month, and I'm planning a party. Can you help me choose what to do? I don't want a boring party at home. Also, have you finished your history essay yet? Kate",
    model:
      "Hi Kate,\n\nA birthday party, how exciting! I'd love to help.\n\nWhat about a picnic in the park? You could ask everyone to bring some food, and we could play games. Or, if it's cold, we could go bowling. There's a new bowling place near the station, and I went there last month with my cousins. It was really fun and not too expensive.\n\nYes, I finally finished my history essay last night! It took me a whole week, and I'm happy with it.\n\nShall we meet after school on Thursday to plan everything? We could make a list of people to invite.\n\nSee you,\nGrace",
  },
  {
    task: "Answer your friend's email.",
    source:
      "Hi! I've been ill for a week, and I've missed a lot of lessons. I'm feeling better now. What have you done in math and science since last Monday? Can you help me catch up? Sam",
    model:
      "Hi Sam,\n\nI'm sorry you've been ill! I'm glad you're feeling better now. We've all missed you in class.\n\nIn math, we've started a new unit on percentages. It isn't too difficult, and I've got good notes that you can copy. In science, we did an experiment with plants on Tuesday, and we have to write a short report about it by next Friday. The teacher said you can have more time.\n\nOf course I can help you catch up. Why don't you come to my house on Saturday morning? We can go through everything together, and then we can play basketball in the afternoon.\n\nTake care,\nLeo",
  },
  {
    task: "Answer your friend's email.",
    source:
      "Hello from Canada! We've lived here for three months now. It's very cold, but I love the snow. Have you ever seen snow? What's the weather like where you are? I miss you! Lily",
    model:
      "Hi Lily,\n\nIt was so nice to get your email! I miss you too. I can't believe it's been three months already.\n\nNo, I've never seen real snow! You're so lucky. It doesn't snow where I live. Right now it's warm and sunny, and we still go to the beach on weekends. Last Sunday my family had a barbecue by the sea.\n\nSchool is busy as usual. I've joined the drama club, and we're going to put on a play in December. I'm really enjoying it.\n\nCould we have a video call next weekend? You could show me the snow outside your window!\n\nLove,\nMei",
  },
  {
    task: "Answer your friend's email.",
    source:
      "Hi! I want to start running, but I'm too lazy to do it alone. You run every morning, right? Can I join you? And how is your new puppy? Max",
    model:
      "Hi Max,\n\nOf course you can join me! It's much more fun with a friend. I usually run in the park near the river at seven o'clock, before school. We can start slowly, maybe twenty minutes, and run a little longer every week.\n\nMy puppy is great, but he's very naughty! Last week he ate one of my shoes and part of my homework. My mum laughed, but my teacher didn't believe me!\n\nWhy don't we start next Monday? Meet me at the park gate at five to seven. Don't forget to bring some water.\n\nSee you there,\nOscar",
  },
  {
    task: "Answer your friend's email.",
    source:
      "Hi! I've been thinking about learning a new language. I'm not sure if I should learn Spanish or French. You've studied both. Which is easier? And what are your plans for the holidays? Zoe",
    model:
      "Hi Zoe,\n\nWhat a great idea! I think learning a language is one of the best things you can do.\n\nI've studied both, and I think Spanish is a bit easier. The spelling is simple, and you say words the way you write them. French is beautiful, but the spelling is really difficult! I suppose it depends on where you want to travel. If you want to go to South America one day, choose Spanish.\n\nFor the holidays, I'm going to visit my grandparents in the countryside for a week. After that, I'm free.\n\nWhy don't you come to my house one afternoon? I can lend you my old Spanish books.\n\nBest wishes,\nHelen",
  },
  {
    task: "Answer your friend's email.",
    source:
      "Hi! I have some big news. My family is moving to Singapore next year because of my dad's job. I'm excited, but I'm also sad to leave my friends. Have you ever been to Singapore? What should I know? Paul",
    model:
      "Hi Paul,\n\nWow, that's big news! I'm happy for you, but I'm going to miss you so much.\n\nYes, I went to Singapore two years ago with my parents. I loved it! It's very clean and green, and the food markets are fantastic. It's hot all year, so you won't need your winter coat. People speak English there, so school won't be too hard for you.\n\nDon't worry about your friends here. We can still talk online every week, and maybe I can visit you one day.\n\nBefore you leave, let's have a goodbye party. What about the last Saturday before you go? I'll ask everyone from our class.\n\nYour friend,\nKevin",
  },
  {
    task: "Answer your friend's email.",
    source:
      "Hi! I've just read a great book, and I can't stop thinking about it. It's about a girl who travels back in time. Have you read anything good recently? Also, are you coming to the school concert on Friday? Rosa",
    model:
      "Hi Rosa,\n\nThat book sounds really interesting! What's it called? I love stories about time travel, so I'd like to read it too.\n\nI haven't read much recently because I've had so many exams. But last month I read a book about a boy who lives alone on an island. It was exciting, and the ending was a big surprise. I think you'd like it.\n\nYes, I'm coming to the concert on Friday! My brother is playing the drums, so my whole family is going. Shall we sit together? We could meet at the school gate at half past six and get good seats.\n\nSee you on Friday,\nJenny",
  },
  {
    task: "Answer your friend's email.",
    source:
      "Hi! My parents have said I can have a pet for my birthday. I can't decide between a cat and a rabbit. You've had both. Which one is better? And how was your weekend? Nick",
    model:
      "Hi Nick,\n\nThat's great news! You'll love having a pet.\n\nI've had both, and they're very different. Cats are independent, so they're good if your family is busy. They don't need a walk, and they clean themselves. Rabbits are sweet, but they need a big space and a lot of attention. Our rabbit was always eating the wires behind the TV! I think a cat is better for you, because you're at school all day.\n\nMy weekend was quiet. I revised for my geography exam on Saturday, and on Sunday I went swimming with my dad.\n\nWhy don't you come and meet my cat this weekend? Then you can decide.\n\nSee you,\nChris",
  },
];

const writingAnInformalEmail = judgedTopic({
  id: "writing-an-informal-email",
  title: t("Writing an Informal Email", "写非正式电子邮件"),
  summary: t(
    "Write an email of 100 to 150 words to a friend that answers their questions, gives your news and suggests a plan, in a friendly tone.",
    "给朋友写一封 100 到 150 词的电子邮件：回答对方的问题，讲讲你的近况，提出一个计划，语气友好。",
  ),
  prerequisites: ["writing-an-email-to-a-friend", "present-perfect-or-past-simple"],
  encompasses: [
    { topic: "writing-an-email-to-a-friend", weight: 0.4 },
    { topic: "present-perfect-or-past-simple", weight: 0.1 },
  ],
  criteria: ["b1-informal-email-answers", "b1-informal-email-news-and-plan", "b1-informal-tone", "b1-email-paragraphs"],
  point: {
    id: "email",
    title: t("Answers, news and a plan", "回答、近况和计划"),
    explanation: t(
      "An informal email to a friend has a clear shape:\n\n- Begin with *Hi* or *Hey* and the name, then react to their news: *Congratulations! That's amazing news.*\n- Answer **every** question they asked, one paragraph for each main idea.\n- Give some news of your own: *I've joined the drama club.*\n- Suggest a plan with a time and a place: *Why don't we meet at the park on Saturday?* *Shall we…?* *We could…*\n- End with *Love*, *See you* or *Best wishes* and your name.\n\nKeep the tone friendly: short forms such as *I'm* and *don't*, and words such as *great*, *really* and *so*.",
      "给朋友的非正式邮件有清楚的结构：\n\n- 用 *Hi* 或 *Hey* 加名字开头，然后回应对方的消息：*Congratulations! That's amazing news.*\n- 回答对方提出的**每一个**问题，每个主要意思一段。\n- 讲讲你自己的近况：*I've joined the drama club.*\n- 提出一个有时间和地点的计划：*Why don't we meet at the park on Saturday?* *Shall we…?* *We could…*\n- 结尾写 *Love*、*See you* 或 *Best wishes* 和你的名字。\n\n语气要友好：用 *I'm*、*don't* 这样的缩写，以及 *great*、*really*、*so* 这样的词。",
    ),
  },
  question: t(
    "Read your friend's email. Write a reply of 100 to 150 words in English: answer all their questions, give your own news, and suggest a plan.",
    "读朋友的邮件，用英语写一封 100 到 150 词的回信：回答对方所有的问题，讲讲你的近况，并提出一个计划。",
  ),
  bank: informalBank,
  limits: { minWords: 90, maxChars: 1400 },
  what: t("email", "电子邮件"),
});

/** topics are the topics of the unit Education and Learning. */
export const topics: readonly TopicDef[] = [
  schoolLife.topic,
  learning.topic,
  schoolPeople.topic,
  subjects.topic,
  thinking.topic,
  qualities.topic,
  studySkills.topic,
  linking.topic,
  presentPerfectOrPastSimple,
  writingAnInformalEmail,
];

/** vocabulary are the words the unit Education and Learning teaches. */
export const vocabulary: readonly WordBatch[] = [
  schoolLife.batch,
  learning.batch,
  schoolPeople.batch,
  subjects.batch,
  thinking.batch,
  qualities.batch,
  studySkills.batch,
  linking.batch,
];
