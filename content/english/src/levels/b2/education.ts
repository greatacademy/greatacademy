// B2, unit 6: Education and Opportunity. Higher education, understanding, assessment, opportunity, teaching, growing
// up, abstract nouns, verbs of thinking, digital learning, vocations and character; mixed conditionals; the
// for-and-against essay. Its other topics, appositives and the counterclaim paragraph, already exist.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { fill, judgedTopic } from "../a2/kit.ts";
import { interleave, vocabularyTopic, word } from "../words.ts";
import { mixedConditionalsWriteNot } from "./mistakes.ts";

const university = vocabularyTopic({
  id: "b2-words-higher-education",
  title: t("Higher Education", "高等教育"),
  summary: t(
    "Undergraduates and postgraduates; bachelor's, master's and doctorates; theses and dissertations; faculties and tuition; lectures and seminars; academic work.",
    "本科生和研究生；学士、硕士和博士学位；论文和学位论文；院系和学费；讲座和研讨课；学术工作。",
  ),
  intro: t(
    "As an **undergraduate** she sat in big **lectures**; now, working on her **doctorate**, she leads a small **seminar** of her own. These words help you talk about university, its degrees and the work students do there.",
    "读 **undergraduate**（本科生）时，她坐在大教室里听 **lectures**（讲座课）；现在攻读 **doctorate**（博士学位），她自己带一个小小的 **seminar**（研讨课）。这些词帮你谈论大学、学位以及学生在大学里做的事。",
  ),
  prerequisites: ["b1-words-school-life"],
  words: [
    word(
      "undergraduate undergraduates",
      "a university student studying for a first degree",
      "本科生",
      "Oxford's {undergraduates} are all studying for their first degree.|graduates undergrounds | Most {undergraduates} live on campus in their first year.|graduates undergrounds | The course is open to {undergraduates} and to students who already have a degree.|graduates undergrounds",
      "graduate underground",
      "postgraduate",
    ),
    word(
      "postgraduate postgraduates",
      "a student who already has a first degree and is studying for a higher one",
      "研究生",
      "He is a {postgraduate} in physics who already has a degree and is now doing a PhD. | The university has three thousand {postgraduates} studying for higher degrees.|freshmen schoolboys | {Postgraduates} working on their PhDs often teach first-year classes.|Freshmen Schoolboys",
      "freshman schoolboy",
      "undergraduate",
    ),
    word(
      "bachelor bachelors",
      "a first university degree; a man who has never married",
      "学士（学位）；单身汉",
      "She has a {bachelor}'s degree in history, her first university degree. | A {bachelor}'s degree, the first degree you can earn at university, usually takes three or four years. | After his {bachelor}'s, his first degree, he started work instead of studying further.",
      "master doctor",
      "master",
    ),
    word(
      "master masters",
      "a university degree after the first one; a person very skilled at something",
      "硕士（学位）；大师",
      "He is studying for a {master}'s in law, the degree that comes after a bachelor's. | She did her {master}'s in Paris after her bachelor's degree in Rome. | He is a {master} of the violin who has played for fifty years.|beginner learner",
      "bachelor butcher",
      "bachelor",
    ),
    word(
      "doctorate doctorates",
      "the highest university degree, a PhD",
      "博士学位",
      "She earned her {doctorate} in chemistry at twenty-eight, after years of research. | A {doctorate}, the highest university degree, takes at least three years of research. | He was given an honorary {doctorate} by the university.",
      "doctrine dictator",
    ),
    word(
      "thesis",
      "a long piece of writing for a university degree; the main idea of an argument",
      "（学位）论文；论点",
      "She wrote her {thesis} on Chinese poetry for her degree. | The main argument of his {thesis} is that cities make people lonely. | He spent four years writing his doctoral {thesis}.",
      "thesaurus tuition",
      "dissertation",
    ),
    word(
      "dissertation dissertations",
      "a long piece of writing on one subject, especially for a university degree",
      "学位论文",
      "My {dissertation}, all 20,000 words of it, is due in May. | Students write a long {dissertation} in their final year. | She read hundreds of {dissertations} written by other students on the subject.|disseminations tuitions",
      "dissemination tuition",
      "thesis",
    ),
    word(
      "faculty faculties",
      "a group of departments in a university; all the teachers of a university",
      "（大学的）院系；全体教员",
      "She teaches in the {faculty} of law, one of the university's departments. | The {faculty}, all the university's teachers, voted against the plan. | The university has six {faculties}, from arts to medicine.|facilities factories",
      "facility factory",
    ),
    word(
      "tuition",
      "teaching, especially to one person or a small group; the money paid for it",
      "学费；（个别）教学",
      "{Tuition} fees, the money students pay for teaching, have risen again.|Intuition Tradition | She gets extra {tuition} in math from a private teacher. | The scholarship covers {tuition} and housing, so she pays nothing for her classes.",
      "intuition tradition",
    ),
    word(
      "lecture lectures",
      "a talk to students or other people about a subject",
      "讲座；讲课",
      "The {lecture} starts at nine in the main hall, where 300 students listen to the professor. | I missed two {lectures} last week, so I borrowed my friend's notes on the talks.|lecturers seminars | She gave a {lecture} on climate change to a hall full of students.",
      "lecturer seminar",
      "seminar",
    ),
    word(
      "seminar seminars",
      "a class in which a small group of students discuss a subject with a teacher",
      "研讨课；研讨会",
      "Only twelve students take part in the {seminar}, sitting round one table. | We discuss the readings together in our weekly {seminar}. | She led a small {seminar} on modern art in which every student spoke.",
      "lecture semester",
      "lecture",
    ),
    word(
      "academic",
      "connected with education, especially at a university; a teacher at a university",
      "学术的；大学教师",
      "The {academic} year, when classes are held, starts in September. | Her {academic} results are excellent: she got top marks in every exam. | He is a well-known {academic} at Harvard who teaches and writes books.|athlete accountant",
      "athletic financial",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Lecture* and *seminar* are both university classes, but in a *lecture* one teacher talks to many students, while in a *seminar* a small group discusses together. Look for how many students there are and who does the talking.",
        "*lecture* 和 *seminar* 都是大学课程，但 *lecture* 是一位老师对很多学生讲，*seminar* 是一小组人一起讨论。看看有多少学生、由谁来说话。",
      ),
      meaning: t(
        "*Thesis* and *dissertation* are both long pieces of writing for a degree, but *thesis* can also mean the main idea of an argument. Check whether the meaning is about a piece of writing or about an idea.",
        "*thesis* 和 *dissertation* 都是为学位写的长篇论文，但 *thesis* 还可以指论证的中心论点。看释义说的是一篇文章还是一个观点。",
      ),
      spell: t(
        "*Bachelor* has no t before its ch, *tuition* has ui in the middle, and *thesis* becomes *theses* in the plural.",
        "*bachelor* 的 ch 前面没有 t，*tuition* 中间是 ui，*thesis* 的复数是 *theses*。",
      ),
    },
    notes: `
      undergraduate|students studying for their first degree;first-year students living on campus;students who don't yet have a degree|an undergraduate is studying for a first degree; a graduate has already finished one|undergraduate 是本科生；graduate 是毕业生|graduate/graduates=graduate is someone who has already finished a degree, not someone in their first year or still studying for the first one=graduate 是已拿到学位的人，不是一年级或仍在读第一个学位的学生;underground/undergrounds=underground is a railway under a city, not a student=underground 是地铁，不是学生|un · der · grad · u · ate|under + graduate|under + graduate
      postgraduate|someone who already has a degree and is doing a PhD;students working for higher degrees;PhD students teaching first-year classes|a postgraduate studies for a higher degree; a freshman is in the first year|postgraduate 是研究生；freshman 是大一新生|freshman/freshmen/Freshmen=freshman is a student in the first year, not someone who already has a degree and works for a higher one=freshman 是一年级新生，不是已有学位、攻读更高学位的人;schoolboy/schoolboys/Schoolboys=schoolboy is a boy at school, not a university student working for a PhD=schoolboy 是中小学男生，不是读博士的大学生|post · grad · u · ate|post + graduate|post + graduate
      bachelor|a first university degree in history;the first degree, taking three or four years;a first degree before starting work|a bachelor's is the first degree; a master's comes after it|bachelor 是学士学位；master 是之后的硕士学位|master=master's is the degree that comes after the first one, not the first degree itself=master 是第一个学位之后的硕士，不是第一个学位;doctor=doctor's degree is the highest degree after years of research, not the first one=doctor 学位是多年研究后的最高学位，不是第一个学位|bach · e · lor|bach + elor, with no t before ch|bach + elor，ch 前没有 t
      master|a law degree after a bachelor's;a degree in Paris after one in Rome;fifty years of playing the violin|a master's comes after the first degree; a bachelor's is the first|master 是硕士或大师；bachelor 是学士|bachelor=bachelor's is the first degree, not the one that comes after it=bachelor 是第一个学位，不是之后的那个;butcher=butcher's is a shop that sells meat, not a degree or a skilled musician=butcher 是肉铺，不是学位或技艺高超的乐手;beginner=beginner has only just started learning, not someone who has played for fifty years=beginner 是刚入门的人，不是演奏了五十年的人;learner=learner is still learning a skill, not someone who has mastered it=learner 是还在学的人，不是已经精通的人|mas · ter|mast + er|mast + er
      doctorate|a chemistry degree after years of research;the highest university degree;an honorary degree from a university|a doctorate is the highest degree; a doctrine is a set of beliefs|doctorate 是博士学位；doctrine 是教义|doctrine=doctrine is a set of beliefs taught by a church or a party, not a university degree=doctrine 是教会或政党宣扬的信条，不是大学学位;dictator=dictator is a ruler with total power, not a degree you earn=dictator 是独裁者，不是可以获得的学位|doc · tor · ate|doctor + ate|doctor + ate
      thesis|writing on Chinese poetry for a degree;the main argument that cities make people lonely;four years of doctoral writing|a thesis is long writing for a degree or the main idea of an argument; a thesaurus is a book of words|thesis 是学位论文或论点；thesaurus 是同义词词典|thesaurus=thesaurus is a book of words with similar meanings, not something you write for a degree or an argument you make=thesaurus 是同义词词典，不是为学位写的论文或提出的论点;tuition=tuition is teaching or the money paid for it, not a piece of writing or an argument=tuition 是教学或学费，不是论文或论点|the · sis|th + esis, and theses in the plural|th + esis，复数是 theses
      dissertation|20,000 words due in May;long writing in the final year;writing by other students on a subject|a dissertation is long writing for a degree; dissemination is spreading information|dissertation 是学位论文；dissemination 是传播|dissemination/disseminations=dissemination is spreading information to many people, not a long piece of writing you hand in=dissemination 是向很多人传播信息，不是要交的长篇论文;tuition/tuitions=tuition is teaching or the money paid for it, not something students write=tuition 是教学或学费，不是学生写的东西|dis · ser · ta · tion|a double s in the middle|中间双写 s
      faculty|the law department of a university;all the teachers of a university;departments from arts to medicine|a faculty is a group of departments or all the teachers; a facility is a building or equipment|faculty 是院系或全体教员；facility 是设施|facility/facilities=facility is a building or piece of equipment, such as a gym, not a department or the teachers who vote=facility 是体育馆之类的设施，不是院系或投票的教员;factory/factories=factory is a building where goods are made, not part of a university=factory 是工厂，不是大学的一部分|fac · ul · ty|fac + ulty|fac + ulty
      tuition|money students pay for teaching;extra lessons in math from a private teacher;classes paid for by a scholarship|tuition is teaching or the money paid for it; intuition is a feeling you can't explain|tuition 是学费或教学；intuition 是直觉|intuition/Intuition=intuition is knowing something without thinking it through, not teaching or money for classes=intuition 是直觉，不是教学或课程费用;tradition/Tradition=tradition is a custom passed down over years, not teaching or the money for it=tradition 是传统，不是教学或学费|tu · i · tion|t + ui + tion|t + ui + tion
      lecture|300 students listening to a professor;talks a friend took notes on;a talk on climate change to a full hall|a lecture is a talk to many students; a seminar is a small group discussion|lecture 是讲座课；seminar 是研讨课|lecturer/lecturers=lecturer is the person who gives the talk, not the talk that starts at nine or that you miss=lecturer 是讲课的人，不是九点开始或被错过的那堂课;seminar/seminars=seminar is a small group discussion, not one person talking to a hall full of students=seminar 是小组讨论，不是一个人对满堂学生讲话|lec · ture|lect + ure|lect + ure
      seminar|twelve students round one table;discussing the readings together each week;a small class where every student spoke|a seminar is a small group discussion; a lecture is one person talking to many|seminar 是研讨课；lecture 是讲座课|lecture=lecture is one teacher talking to many students, not a small group round one table where everyone speaks=lecture 是一位老师对很多学生讲，不是围坐一桌、人人发言的小组;semester=semester is half of a school year, not a class where students discuss=semester 是学期，不是讨论课|sem · i · nar|semin + ar, not -er|semin + ar，不是 -er
      academic|the year when classes are held;top marks in every exam;someone at Harvard who teaches and writes books|academic is about study at school or university; athletic is about sport|academic 是学术的；athletic 是运动的|athletic=athletic is about sport and strong bodies, not classes or exams=athletic 与体育和强健体魄有关，与课程或考试无关;financial=financial is about money, not classes or exam marks=financial 与金钱有关，与课程或考试成绩无关;athlete=athlete is someone who is good at sport, not someone who teaches and writes books at a university=athlete 是运动员，不是在大学教书写书的人;accountant=accountant keeps the money records of a business, not a university teacher=accountant 是会计，不是大学教师|ac · a · dem · ic|academy with the y changed to -ic|把 academy 的 y 改成 -ic
    `,
  },
});

const understanding = vocabularyTopic({
  id: "b2-words-learning-2",
  title: t("Understanding", "理解"),
  summary: t(
    "Comprehension and comprehending; acquiring a language and its acquisition; retaining, recalling and absorbing; grasping an idea; insights; intellectual and cognitive skills; literacy.",
    "理解和领会；习得语言；记住、回忆和吸收；领会概念；洞见；智力和认知能力；读写能力。",
  ),
  intro: t(
    "Children **acquire** words fast, but to **retain** them they must use them, and to **recall** them in an exam they need practice. These words help you talk about how the mind understands, keeps and uses what it learns.",
    "孩子们 **acquire**（习得）词语很快，但要 **retain**（记住）它们就得常用，考试时要 **recall**（回想起）它们还需要练习。这些词帮你谈论大脑如何理解、保存和运用所学的东西。",
  ),
  prerequisites: ["b1-words-learning"],
  words: [
    word(
      "comprehension",
      "the ability to understand something; an exercise that tests it",
      "理解（力）；理解练习",
      "The test checks reading {comprehension}: how well you understand a text. | The problem is beyond my {comprehension}: I simply cannot understand it. | We did a listening {comprehension} in class, answering questions about a recording.",
      "compression confusion",
      "grasp",
    ),
    word(
      "comprehend comprehends comprehended comprehending",
      "to understand something fully",
      "理解；领会",
      "I couldn't {comprehend} what had happened: it made no sense to me. | She can't {comprehend} why he left: his reasons make no sense to her. | Small children cannot {comprehend} death because it is too hard for them to understand.",
      "apprehend forget",
      "grasp",
    ),
    word(
      "acquire acquires acquired acquiring",
      "to get or learn something, such as a skill or a language",
      "获得；习得",
      "Children {acquire} languages quickly by listening to the people around them. | She {acquired} a taste for coffee while living in Italy, though she hated it before.|required lost | He has {acquired} new skills at work by training every week.|required lost",
      "require lose",
      "acquisition",
    ),
    word(
      "acquisition",
      "the act of learning or getting something; something bought by a company or a museum",
      "习得；获得物",
      "Language {acquisition}, the learning of a first language, starts at birth. | The {acquisition} of new skills takes time and practice. | The painting, bought last month, is the museum's latest {acquisition}.",
      "accusation loss",
      "acquire",
    ),
    word(
      "retain retains retained retaining",
      "to keep something; to remember information",
      "保持；记住",
      "I learn new words easily, but I can't {retain} them for long: I soon forget them. | The town has {retained} its old charm: it still looks as it did a century ago.|obtained detained | Clay {retains} water, so the soil stays wet for days.|obtains detains",
      "obtain detain",
    ),
    word(
      "recall recalls recalled recalling",
      "to remember something",
      "回想；回忆起",
      "I can't {recall} his name: it's on the tip of my tongue. | She {recalled} the day she met him as if it were yesterday.|forgot recycled | As far as I {recall}, the meeting was on Tuesday, but check your diary.",
      "forget recycle",
      "retain",
    ),
    word(
      "absorb absorbs absorbed absorbing",
      "to take in a liquid or information; to keep someone's attention completely",
      "吸收；使全神贯注",
      "A sponge {absorbs} water and holds it inside.|observes releases | The new students had to {absorb} a lot of information on their first day, learning it all at once. | Water is {absorbed} by the roots of the plant and carried up to its leaves.|observed released",
      "observe release",
    ),
    word(
      "grasp grasps grasped grasping",
      "to understand something; to hold something tightly",
      "领会；抓牢",
      "He quickly {grasped} the main idea and explained it clearly to the class.|misunderstood forgot | She held my hand tightly: she {grasped} it and wouldn't let go.|misunderstood forgot | Do you {grasp} how serious this is, or should I explain again?",
      "misunderstand forget",
      "comprehend",
    ),
    word(
      "insight insights",
      "a clear and deep understanding of something",
      "洞察；洞见",
      "The book, written by a former prisoner, is full of {insight}: it helps you truly understand prison life. | Her {insight} showed us the real cause of the problem, which no one else had seen. | He showed great {insight} in his answer, seeing straight to the heart of the question.",
      "ignorance oversight",
    ),
    word(
      "intellectual",
      "connected with the ability to think and understand ideas",
      "智力的；理智的",
      "For chess players the challenge is {intellectual}: it tests how well you think. | She enjoys {intellectual} conversation about books, science and ideas. | The {intellectual} development of children, their ability to think and reason, is fast.",
      "physical intentional",
      "cognitive",
    ),
    word(
      "cognitive",
      "connected with thinking, learning and remembering",
      "认知的",
      "Sleep improves {cognitive} skills such as memory and attention. | Old age can bring {cognitive} decline, making it harder to remember and think. | {Cognitive} science studies how the mind thinks and learns.|Physical Connective",
      "physical connective",
      "intellectual",
    ),
    word(
      "literacy",
      "the ability to read and write",
      "读写能力；识字",
      "Adult {literacy}, the ability to read and write, has risen to ninety percent. | The program teaches {literacy} to children who cannot yet read. | Digital {literacy}, knowing how to use computers well, is now as important as reading.",
      "literature liberty",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Retain* and *recall* are both about memory, but *retain* means keeping information in your head, while *recall* means bringing it back at the moment you need it. Ask whether the sentence is about keeping something or about remembering it now.",
        "*retain* 和 *recall* 都与记忆有关，但 *retain* 是把信息留在脑子里，*recall* 是在需要时把它想起来。想想句子说的是保存还是此刻想起。",
      ),
      meaning: t(
        "*Acquire* is the verb for getting or learning something, while *acquisition* is the noun for that act or for the thing you got. Check whether the meaning describes an action or a thing.",
        "*acquire* 是获得、习得的动词，*acquisition* 是表示这一行为或所得之物的名词。看释义描述的是动作还是事物。",
      ),
      spell: t(
        "*Comprehension* keeps the h after compre-, *acquire* has a c before its q, and *literacy* ends in -acy.",
        "*comprehension* 在 compre- 后保留 h，*acquire* 的 q 前有个 c，*literacy* 以 -acy 结尾。",
      ),
    },
    notes: `
      comprehension|how well you understand a text;a problem you cannot understand;answering questions about a recording|comprehension is understanding; confusion is not understanding|comprehension 是理解；confusion 是困惑|compression=compression is pressing something into a smaller space, not understanding a text or a recording=compression 是压缩，不是理解文章或录音;confusion=confusion is not understanding, the opposite of knowing how well you understand or answering questions=confusion 是困惑不解，和理解、答题正相反|com · pre · hen · sion|compre + hension, with an h|compre + hension，有 h
      comprehend|something that made no sense;reasons that make no sense to her;death too hard for small children to understand|to comprehend is to understand fully; to forget is to stop remembering|comprehend 是理解；forget 是忘记|apprehend=apprehend means to catch and arrest someone, not to understand what happened or why=apprehend 是逮捕，不是理解发生了什么或为什么;forget=forget means to stop remembering, not to understand something that makes no sense=forget 是忘记，不是理解说不通的事|com · pre · hend|compre + hend|compre + hend
      acquire|languages learned by listening;a taste for coffee gained in Italy;skills gained by training every week|to acquire is to get or learn something new; to lose is to stop having it|acquire 是获得、习得；lose 是失去|require/required=require means to need something, not to get or learn it=require 是需要，不是获得或学会;lose/lost=lose means to stop having something, the opposite of learning languages, a taste or new skills=lose 是失去，和学会语言、养成口味或掌握技能正相反|ac · quire|ac + quire, with a c before the q|ac + quire，q 前有 c
      acquisition|learning a first language from birth;gaining new skills with practice;a painting bought last month|acquisition is getting or learning something; loss is no longer having it|acquisition 是获得、习得；loss 是失去|accusation=accusation is saying that someone did something wrong, not learning or buying something=accusation 是指控，不是学会或买到东西;loss=loss is no longer having something, the opposite of learning, gaining skills or buying=loss 是失去，和学会、获得技能或买入正相反|ac · qui · si · tion|acquire with -re changed to -sition|把 acquire 的 -re 改成 -sition
      retain|new words soon forgotten;a town that still looks as it did;soil that stays wet for days|to retain is to keep something; to obtain is to get it|retain 是保持、记住；obtain 是获得|obtain/obtained/obtains=obtain means to get something new, not to keep words, charm or water you already have=obtain 是得到新东西，不是留住已有的词、风貌或水分;detain/detained/detains=detain means to keep a person somewhere, such as in a police station, not to keep words or water=detain 是扣留某人，不是保留词语或水分|re · tain|re + tain|re + tain
      recall|a name on the tip of the tongue;a day remembered as if it were yesterday;a meeting to check in a diary|to recall is to bring a memory back; to forget is to lose it|recall 是回想起；forget 是忘记|forget/forgot=forget means to lose a memory, the opposite of bringing back a name, a day or a meeting=forget 是忘记，和想起名字、那一天或会议正相反;recycle/recycled=recycle means to use material again, such as paper or glass, not to remember=recycle 是回收利用，不是回忆|re · call|re + call, with a double l|re + call，双写 l
      absorb|a sponge holding water inside;students learning a lot at once;water carried from roots to leaves|to absorb is to take something in; to release is to let it go|absorb 是吸收；release 是释放|observe/observes/observed=observe means to watch something carefully, not to take water or information inside=observe 是观察，不是把水或信息吸进去;release/releases/released=release means to let something go out, the opposite of taking it in and holding it=release 是释放，和吸进、留住正相反|ab · sorb|ab + sorb|ab + sorb
      grasp|a main idea explained clearly to a class;a hand held tightly;how serious something is|to grasp is to understand or hold firmly; to misunderstand is to get it wrong|grasp 是领会、抓牢；misunderstand 是误解|misunderstand/misunderstood=misunderstand means to get the meaning wrong, not to understand clearly or hold tightly=misunderstand 是理解错，不是清楚领会或紧紧抓住;forget/forgot=forget means to lose something from memory, not to understand it or hold it=forget 是忘记，不是理解或抓住|grasp|gr + asp|gr + asp
      insight|a book that helps you truly understand prison life;seeing a cause no one else had seen;seeing straight to the heart of a question|insight is deep understanding; ignorance is lack of knowledge|insight 是洞察；ignorance 是无知|ignorance=ignorance is lack of knowledge, the opposite of truly understanding or seeing to the heart of something=ignorance 是无知，和真正理解、一针见血正相反;oversight=oversight is a mistake made by not noticing something, the opposite of seeing what no one else saw=oversight 是疏忽，和看到别人没看到的东西正相反|in · sight|in + sight|in + sight
      intellectual|a challenge that tests how well you think;conversation about books and ideas;children's ability to think and reason|intellectual is about thinking; physical is about the body|intellectual 是智力的；physical 是身体的|physical=physical is about the body, not about thinking, ideas or reasoning=physical 关乎身体，不关乎思考、观点或推理;intentional=intentional means done on purpose, not connected with thinking and ideas=intentional 是故意的，与思考和观点无关|in · tel · lec · tu · al|intel + lectual, with a double l|intel + lectual，双写 l
      cognitive|skills like memory and attention;decline that makes remembering harder;the science of how the mind thinks|cognitive is about thinking and memory; physical is about the body|cognitive 是认知的；physical 是身体的|physical/Physical=physical is about the body, not memory, attention or how the mind thinks=physical 关乎身体，与记忆、注意力或思维无关;connective/Connective=connective means joining things together, not about thinking and remembering=connective 是起连接作用的，与思考和记忆无关|cog · ni · tive|cog + nitive, with g and n said apart|cog + nitive，g 和 n 分开读
      literacy|the ability of adults to read and write;teaching children who cannot read;knowing how to use computers well|literacy is the ability to read and write; literature is books and poems|literacy 是读写能力；literature 是文学|literature=literature is books, plays and poems, not the ability to read or use computers=literature 是文学作品，不是阅读或用电脑的能力;liberty=liberty is freedom, not the ability to read or use computers=liberty 是自由，不是阅读或使用电脑的能力|lit · er · a · cy|liter + acy|liter + acy
    `,
  },
});

const assessment = vocabularyTopic({
  id: "b2-words-assessment",
  title: t("Assessment", "评估"),
  summary: t(
    "Assessments and evaluations; criteria and rubrics; feedback; plagiarism; qualifying and credentials; transcripts; standardized tests; aptitude and numeracy.",
    "评估和评价；标准和评分细则；反馈；抄袭；取得资格和资质证明；成绩单；标准化考试；天资和算术能力。",
  ),
  intro: t(
    "Before the essay the teacher shares a **rubric**; afterwards she gives **feedback** on each **criterion**, and the software checks for **plagiarism**. These words help you talk about how work, students and courses are judged.",
    "写作文前，老师先发 **rubric**（评分细则）；写完后，她就每条 **criterion**（标准）给出 **feedback**（反馈），软件还会检查有没有 **plagiarism**（抄袭）。这些词帮你谈论作业、学生和课程如何被评判。",
  ),
  prerequisites: ["b1-words-study-skills"],
  words: [
    word(
      "assessment assessments",
      "a judgment of the quality or the level of something",
      "评估；评价",
      "The course has no final exam, only continuous {assessment}, with teachers judging students' work all year. | An {assessment} of the damage, judging how bad it is, is under way. | Teachers wrote {assessments} of every pupil's progress at the end of the year.|assignments assortments",
      "assignment assortment",
      "evaluation",
    ),
    word(
      "evaluation evaluations",
      "a careful study of how good or useful something is",
      "评价；评估",
      "The {evaluation} of the program, a careful study of its results, showed that it works. | Students fill in an {evaluation} of the course, saying how useful it was. | Regular {evaluations} of their work help staff improve.|elevations evacuations",
      "elevation evacuation",
      "assessment",
    ),
    word(
      "criterion criteria",
      "a standard by which you judge something",
      "标准；准则",
      "Price is not the only {criterion} we use to judge a car: we also look at safety. | The essay meets all the {criteria}, the standards the teacher marks by.|critics conclusions | What are the {criteria} for choosing students: grades, interviews or both?|critics conclusions",
      "critic conclusion",
      "rubric",
    ),
    word(
      "rubric rubrics",
      "a table that shows how a piece of work will be marked",
      "评分细则；评分量表",
      "The {rubric} for the essay gives points for grammar and ideas. | Check your essay against the {rubric} to see how it will be marked. | Teachers share their marking {rubrics} before the task.|rubbers recipes",
      "rubber recipe",
      "criterion",
    ),
    word(
      "feedback",
      "advice or criticism about how well someone has done something",
      "反馈；意见",
      "The teacher gives useful {feedback} on every essay, saying what to improve. | We welcome your {feedback} on our service: tell us what you think. | Positive {feedback} about their work builds students' confidence.",
      "fallback flashback",
    ),
    word(
      "plagiarism",
      "copying someone else's work and pretending it is your own",
      "抄袭；剽窃",
      "{Plagiarism}, copying other people's work, can get you expelled.|Pragmatism Patriotism | The software checks essays for {plagiarism}, finding sentences copied from the internet. | He was accused of {plagiarism} after copying a whole chapter from a book.",
      "pragmatism patriotism",
    ),
    word(
      "qualify qualifies qualified qualifying",
      "to pass the exams or tests needed for a job or a competition; to have the right to do something",
      "取得资格；有资格",
      "She {qualified} as a nurse last year: she passed every exam she needed.|retired failed | The team {qualified} for the World Cup by winning all its group matches.|paid waited | Students under twenty-five {qualify} for a discount, so you have the right to pay less.|pay wait",
      "retire fail",
    ),
    word(
      "credential credentials",
      "a document or a qualification that shows you are able to do something",
      "资质证明；资历",
      "The job requires teaching {credentials}, such as a degree and a teaching license.|creditors credits | Check the doctor's {credentials}: is she really qualified?|creditors credits | She has strong academic {credentials}: two degrees and a doctorate.|creditors credits",
      "creditor credit",
      "transcript",
    ),
    word(
      "transcript transcripts",
      "an official record of a student's courses and grades; a written copy of something spoken",
      "成绩单；文字记录",
      "Send your {transcript}, the official list of your courses and grades, with the application. | The university asked for my high school {transcripts} showing all my grades.|transports transfers | A written {transcript} of the interview, word for word, was published.",
      "transport transfer",
      "credential",
    ),
    word(
      "standardized",
      "the same for everyone, so that results can be compared",
      "标准化的",
      "{Standardized} tests, the same for every student, are used for university entry.|Specialized Stabilized | The forms are {standardized}: they are the same across the country. | Critics say {standardized} testing, with one exam for everyone, narrows teaching.",
      "specialized stabilized",
    ),
    word(
      "aptitude",
      "a natural ability to learn or do something",
      "天资；才能",
      "She has a natural {aptitude} for languages and learns them easily. | The job begins with an {aptitude} test to see what you are naturally good at. | He showed no {aptitude} for math and found every lesson hard.",
      "attitude altitude",
    ),
    word(
      "numeracy",
      "the ability to work with numbers",
      "计算能力；算术能力",
      "The program improves {numeracy}, the ability to work with numbers. | Basic {numeracy}, such as adding and measuring, is needed for most jobs. | The test checks {numeracy} skills like counting money and working out percentages.",
      "literacy accuracy",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Credential* and *transcript* are both documents, but a *credential* proves you are qualified, while a *transcript* lists your courses and grades or records spoken words. Ask whether the sentence is about being qualified or about a record.",
        "*credential* 和 *transcript* 都是文件，但 *credential* 证明你有资格，*transcript* 列出课程和成绩，或记录说过的话。想想句子说的是资格还是记录。",
      ),
      meaning: t(
        "A *criterion* is one standard for judging, while a *rubric* is a whole marking table built from several criteria. Check whether the meaning describes one standard or a table.",
        "*criterion* 是一条评判标准，*rubric* 是由多条标准组成的整张评分表。看释义说的是一条标准还是一张表。",
      ),
      spell: t(
        "*Criterion* becomes *criteria* in the plural, *plagiarism* has gi said like *j*, and *aptitude* starts with apt-.",
        "*criterion* 的复数是 *criteria*，*plagiarism* 里的 gi 读作 *j*，*aptitude* 以 apt- 开头。",
      ),
    },
    notes: `
      assessment|teachers judging students' work all year;judging how bad the damage is;reports on every pupil's progress|an assessment is a judgment of quality or level; an assignment is a task|assessment 是评估；assignment 是作业任务|assignment/assignments=assignment is a task that someone is given, not a judgment of how good work or damage is=assignment 是布置的任务，不是对作业或损失的评判;assortment/assortments=assortment is a mixed group of things, not a judgment=assortment 是各式各样的混合，不是评判|as · sess · ment|a double s twice|两处双写 s
      evaluation|a careful study of a program's results;students saying how useful a course was;reviews that help staff improve|an evaluation is a careful judgment of how good something is; an evacuation is moving people out of danger|evaluation 是评价；evacuation 是疏散|elevation/elevations=elevation is height above sea level or raising something up, not a judgment of how good something is=elevation 是海拔或抬高，不是评判好坏;evacuation/evacuations=evacuation is moving people out of a dangerous place, not studying results=evacuation 是疏散撤离，不是研究结果|e · val · u · a · tion|e + value + ation, with the e of value dropped|e + value + ation，去掉 value 的 e
      criterion|price as one standard for judging a car;the standards a teacher marks by;grades and interviews for choosing students|a criterion is a standard for judging; a critic is a person who judges|criterion 是标准；critic 是评论家|critic/critics=critic is a person who judges films or books, not the standard used to judge=critic 是评论家，不是评判所用的标准;conclusion/conclusions=conclusion is a decision reached at the end, not a standard you judge by=conclusion 是最终结论，不是评判依据的标准|cri · te · ri · on|criteri + on, with criteria in the plural|criteri + on，复数是 criteria
      rubric|points for grammar and ideas;how an essay will be marked;marking tables shared before a task|a rubric is a marking table; a recipe is cooking instructions|rubric 是评分细则；recipe 是食谱|rubber/rubbers=rubber is a soft material or a thing for erasing, not a table that shows how work is marked=rubber 是橡胶或橡皮，不是评分表;recipe/recipes=recipe is instructions for cooking a dish, not for marking an essay=recipe 是做菜的步骤，不是作文评分标准|ru · bric|ru + bric, ending in -ic|ru + bric，以 -ic 结尾
      feedback|telling a student what to improve;customers saying what they think;positive comments that build confidence|feedback is advice about how well you did; a flashback is a scene from the past|feedback 是反馈意见；flashback 是闪回|fallback=fallback is a plan you use if the first one fails, not advice on how well someone did=fallback 是备用方案，不是对表现的意见;flashback=flashback is a scene in a film or a memory from the past, not comments on work=flashback 是闪回镜头或回忆，不是对作品的评价|feed · back|feed + back|feed + back
      plagiarism|copying other people's work;sentences copied from the internet;a whole chapter copied from a book|plagiarism is copying work and calling it your own; pragmatism is being practical|plagiarism 是抄袭；pragmatism 是实用主义|pragmatism/Pragmatism=pragmatism is dealing with problems in a practical way, not copying someone else's work=pragmatism 是务实，不是抄袭别人的作品;patriotism/Patriotism=patriotism is love for your country, not copying work=patriotism 是爱国主义，不是抄袭|pla · gia · rism|gi said like *j*, then -arism|gi 读作 *j*，后面是 -arism
      qualify|passing every exam needed to be a nurse;winning matches to reach the World Cup;the right to pay less with a discount|to qualify is to pass the tests or have the right to something; to fail is not to pass|qualify 是取得资格；fail 是不及格|retire/retired=retire means to stop working at the end of a career, not to pass the exams for a new job=retire 是退休，不是通过考试获得新工作;fail/failed=fail means not to pass, the opposite of passing every exam=fail 是没通过，和通过所有考试正相反;pay/paid=pay means to give money, not to win the right to play or to get a discount=pay 是付钱，不是赢得参赛权或享受折扣的资格;wait/waited=wait means to stay until something happens, not to win a place or have the right to something=wait 是等待，不是赢得资格或享有权利|qual · i · fy|qual + ify|qual + ify
      credential|a degree and a teaching license;proof that a doctor is qualified;two degrees and a doctorate|credentials are documents or qualifications that prove you can do something; a creditor is someone you owe money to|credential 是资质证明；creditor 是债权人|creditor/creditors=creditor is a person or company you owe money to, not a degree or a license=creditor 是你欠钱的人或公司，不是学位或执照;credit/credits=credit is money you borrow or a unit of a course, not a document proving you are qualified=credit 是贷款或课程学分，不是资格证明|cre · den · tial|creden + tial, with ti said like *sh*|creden + tial，ti 读作 *sh*
      transcript|the official list of courses and grades;high school records of all grades;a word-for-word written copy of an interview|a transcript is a record of grades or of spoken words; a transfer is a move from one place to another|transcript 是成绩单或文字记录；transfer 是转移|transport/transports=transport is buses, trains and other ways of moving people, not a record of grades or words=transport 是交通运输，不是成绩或谈话记录;transfer/transfers=transfer is a move from one place, school or account to another, not a written record=transfer 是转学、转账等转移，不是书面记录|tran · script|trans + cript|trans + cript
      standardized|tests the same for every student;forms the same across the country;one exam for everyone|standardized means the same for everyone; specialized means made for one purpose|standardized 是标准化的；specialized 是专门的|specialized/Specialized=specialized means made for one special purpose or group, the opposite of the same for everyone=specialized 是专门针对某一用途或群体的，和人人相同正相反;stabilized/Stabilized=stabilized means made steady so that it no longer changes, not made the same for everyone=stabilized 是使稳定，不是统一标准|stan · dard · ized|standard + ized|standard + ized
      aptitude|a natural talent for learning languages;a test of what you are naturally good at;no ability for math|aptitude is a natural ability; attitude is how you think and feel about something|aptitude 是天资；attitude 是态度|attitude=attitude is the way you think and feel about something, not a natural ability to learn=attitude 是态度，不是学习的天赋;altitude=altitude is height above sea level, not an ability=altitude 是海拔，不是能力|ap · ti · tude|apt + itude|apt + itude
      numeracy|the ability to work with numbers;adding and measuring for jobs;counting money and working out percentages|numeracy is the ability to work with numbers; literacy is the ability to read and write|numeracy 是计算能力；literacy 是读写能力|literacy=literacy is the ability to read and write, not to work with numbers, add or count money=literacy 是读写能力，不是运算、加减或数钱;accuracy=accuracy is being exactly correct, not the ability to work with numbers=accuracy 是准确，不是计算能力|nu · mer · a · cy|numer + acy|numer + acy
    `,
  },
});

const opportunity = vocabularyTopic({
  id: "b2-words-opportunity",
  title: t("Opportunity", "机会"),
  summary: t(
    "Privilege, the privileged and the disadvantaged; social mobility; equal chances and merit; barriers; inclusive schools and inclusion; excluding people; quotas; being eligible.",
    "特权、享有特权的人和弱势群体；社会流动；平等的机会和才能；障碍；包容的学校和包容；排斥他人；配额；有资格。",
  ),
  intro: t(
    "For **disadvantaged** students the cost of university is a real **barrier**, so the college keeps a **quota** of places for them and gives them on **merit**. These words help you talk about fairness, equal chances and who gets left in or out.",
    "对 **disadvantaged**（弱势的）学生来说，上大学的费用是真正的 **barrier**（障碍），所以学院为他们保留一定 **quota**（名额），并按 **merit**（成绩、实力）录取。这些词帮你谈论公平、平等的机会，以及谁被接纳、谁被排除。",
  ),
  prerequisites: ["b2-words-social-issues"],
  words: [
    word(
      "privilege privileges",
      "a special right or advantage that only some people have",
      "特权；荣幸",
      "Education should be a right for everyone, not a {privilege} for a few. | Members enjoy special {privileges}, such as free parking and early entry.|disadvantages penalties | It's a {privilege} to work with you: I feel lucky and honored.",
      "privacy disadvantage",
      "privileged",
    ),
    word(
      "privileged",
      "having more money and chances than most people",
      "享有特权的；优越的",
      "He grew up in a rich, {privileged} family with servants and private schools. | Only {privileged} children from rich families could go to university then. | I feel {privileged} to be here: it's a great honor.",
      "disadvantaged privatized",
      "privilege",
    ),
    word(
      "disadvantaged",
      "having less money and fewer chances than other people",
      "处于不利地位的；弱势的",
      "The charity helps {disadvantaged} children from poor homes. | Students from {disadvantaged} areas, where few people have jobs, get extra support. | The policy helps the most {disadvantaged} families, those with the least money.",
      "privileged wealthy",
      "privileged",
    ),
    word(
      "mobility",
      "the ability to move from one place, job or social class to another",
      "流动性；活动能力",
      "Education increases social {mobility}, helping poor children move up to better jobs. | The illness affected her {mobility}: she can no longer walk far. | Job {mobility} is high in the city: people change jobs often.",
      "nobility visibility",
    ),
    word(
      "equal",
      "the same in size, number, value or rights",
      "平等的；相等的",
      "All citizens have {equal} rights: the law treats everyone the same. | Men and women should get {equal} pay for the same work. | Cut the cake into eight {equal} pieces, all the same size.",
      "unequal equipped",
    ),
    word(
      "merit merits",
      "a good quality that deserves praise; being good enough to deserve something",
      "优点；价值",
      "Places are given on {merit}: only the best students get in. | The plan has many {merits}: it is cheap, quick and fair.|demerits metrics | We should judge each idea on its {merits}, on how good it really is.|demerits metrics",
      "demerit metric",
    ),
    word(
      "barrier barriers",
      "something that stops people from doing something or going somewhere",
      "障碍；屏障",
      "Cost is the main {barrier} that stops poor students from going to university. | The police put up {barriers} to stop people entering the square.|barrels carriers | Language can be a {barrier} to making friends when you cannot understand each other.",
      "barrel carrier",
    ),
    word(
      "inclusive",
      "including everyone, without leaving out any group",
      "包容的；包括一切的",
      "We want our school to be {inclusive}, a place where every child belongs. | The festival is open and {inclusive}: everyone is welcome. | The price is {inclusive} of breakfast, so you pay nothing extra for it.",
      "exclusive conclusive",
      "inclusion",
    ),
    word(
      "inclusion",
      "the act of including someone or something, especially people who are often left out",
      "包括；包容",
      "The school supports the {inclusion} of children with disabilities in normal classes. | Her {inclusion} in the team, after years on the bench, surprised everyone. | The policy aims at social {inclusion}, so that no group is left out.",
      "exclusion illusion",
      "inclusive",
    ),
    word(
      "exclude excludes excluded excluding",
      "to keep someone out or leave something out",
      "排斥；排除",
      "Girls were {excluded} from the school until 1970, when they were finally let in.|included exploded | The price {excludes} taxes, so you must pay them on top.|includes explodes | Don't {exclude} anyone from the game: let everyone play.",
      "include explode",
    ),
    word(
      "quota quotas",
      "a fixed number or amount of people or things that is allowed or needed",
      "配额；定额",
      "The university has a {quota} of places kept for students from poor areas. | Fishing {quotas}, fixed amounts each boat may catch, protect the fish.|quotes quorums | Each country has a {quota} of tickets, a fixed number it may sell.",
      "quote quorum",
    ),
    word(
      "eligible",
      "having the right to do or get something",
      "有资格的；合格的",
      "You are {eligible} for a grant if your family earns less than 30,000 dollars a year. | Only students over sixteen are {eligible} to apply, so younger ones cannot. | Is he {eligible} to vote, or is he still too young?",
      "ineligible illegible",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Inclusive* and *exclusive* are opposites: *inclusive* lets everyone in or counts everything in the price, while *exclusive* keeps some people or things out. Ask whether the sentence lets people and things in or keeps them out.",
        "*inclusive* 和 *exclusive* 意思相反：*inclusive* 让所有人进来或把一切算进价格，*exclusive* 把某些人或东西挡在外面。想想句子是让人和东西进来，还是挡在外面。",
      ),
      meaning: t(
        "A *privilege* is a special advantage, *privileged* describes a person who has such advantages, and *disadvantaged* describes someone who has fewer chances. Check whether the meaning names a thing or describes a person.",
        "*privilege* 是特殊的好处，*privileged* 形容享有这种好处的人，*disadvantaged* 形容机会更少的人。看释义说的是一样东西，还是在形容人。",
      ),
      spell: t(
        "*Privilege* has no d before its g, *eligible* starts with e- unlike *illegible*, and *barrier* doubles the r.",
        "*privilege* 的 g 前没有 d，*eligible* 以 e- 开头，和 *illegible* 不同，*barrier* 双写 r。",
      ),
    },
    notes: `
      privilege|education for a few instead of everyone;free parking and early entry for members;the honor of working with someone|a privilege is a special advantage only some have; a disadvantage is something that makes things harder|privilege 是特权、荣幸；disadvantage 是不利条件|privacy=privacy is being free from other people watching you, not a special advantage or an honor=privacy 是隐私，不是特殊的好处或荣幸;disadvantage/disadvantages=disadvantage is something that makes life harder, the opposite of free parking, early entry or an honor=disadvantage 是不利条件，和免费停车、优先入场或荣幸正相反;penalties=penalties are punishments for breaking rules, not special advantages=penalties 是违规的惩罚，不是特殊好处|priv · i · lege|privi + lege, with no d before the g|privi + lege，g 前没有 d
      privileged|a rich family with servants and private schools;children of rich families at university;feeling honored to be somewhere|privileged means having more advantages than most; disadvantaged means having fewer|privileged 是享有特权的；disadvantaged 是弱势的|disadvantaged=disadvantaged means having less money and fewer chances, the opposite of rich families or a great honor=disadvantaged 是钱少机会少的，和富裕家庭或莫大荣幸正相反;privatized=privatized means sold by the government to private owners, a word for companies, not families or feelings=privatized 是私有化的，形容企业，不形容家庭或感受|priv · i · leged|privilege + d|privilege + d
      disadvantaged|children from poor homes;areas where few people have jobs;families with the least money|disadvantaged means having fewer chances; privileged means having more|disadvantaged 是弱势的；privileged 是享有特权的|privileged=privileged means having more money and chances than most, the opposite of poor homes and the least money=privileged 是比多数人钱多机会多，和贫困家庭、钱最少正相反;wealthy=wealthy means rich, the opposite of poor homes or having the least money=wealthy 是富有的，和贫困家庭、钱最少正相反|dis · ad · van · taged|dis + advantaged|dis + advantaged
      mobility|poor children moving up to better jobs;no longer being able to walk far;people changing jobs often|mobility is the ability to move; nobility is the class of lords and ladies|mobility 是流动性、行动能力；nobility 是贵族|nobility=nobility is the class of people with titles like lord and duke, not the ability to move up, walk or change jobs=nobility 是贵族阶层，不是向上流动、行走或换工作的能力;visibility=visibility is how far or how well you can see, not the ability to move=visibility 是能见度，不是移动能力|mo · bil · i · ty|mobile with -le changed to -ility|把 mobile 的 -le 改成 -ility
      equal|the law treating everyone the same;the same pay for the same work;pieces all the same size|equal means the same in size or rights; unequal means different|equal 是平等的、相等的；unequal 是不平等的|unequal=unequal means not the same, the opposite of treating everyone the same or pieces of the same size=unequal 是不相等的，和一视同仁或大小相同正相反;equipped=equipped means having the tools you need, not the same in size or rights=equipped 是装备好的，不是大小或权利相同|e · qual|e + qual, with qu said like *kw*|e + qual，qu 读作 *kw*
      merit|only the best students getting in;a plan that is cheap, quick and fair;how good an idea really is|merit is a good quality that deserves reward; a demerit is a fault|merit 是优点、实力；demerit 是缺点|demerit/demerits=demerit is a fault or a bad mark, the opposite of being the best or cheap, quick and fair=demerit 是缺点或记过，和最优秀、省钱快速公平正相反;metric/metrics=metric is a way of measuring something, not a good quality that deserves praise=metric 是衡量标准，不是值得称赞的优点|mer · it|mer + it|mer + it
      barrier|cost that stops poor students from university;fences stopping people entering a square;language that stops friendships|a barrier stops people doing something or going somewhere; a carrier takes things somewhere|barrier 是障碍；carrier 是运送者|barrel/barrels=barrel is a large round container for wine or oil, not something that stops people=barrel 是装酒或油的大桶，不是阻挡人的东西;carrier/carriers=carrier is a person or company that takes things or people somewhere, the opposite of stopping them=carrier 是运送人或货物的人或公司，和阻挡正相反|bar · ri · er|a double r, then -ier|双写 r，结尾是 -ier
      inclusive|a school where every child belongs;a festival where everyone is welcome;a price with breakfast counted in|inclusive means including everyone or everything; exclusive means keeping some out|inclusive 是包容的、包括在内的；exclusive 是排外的、不包括的|exclusive=exclusive means keeping some people or things out, the opposite of every child belonging or nothing extra to pay=exclusive 是排除在外的，和每个孩子都有归属或不再另付费正相反;conclusive=conclusive means proving something without doubt, not including everyone=conclusive 是确凿的，不是包容所有人|in · clu · sive|include with -de changed to -sive|把 include 的 -de 改成 -sive
      inclusion|children with disabilities in normal classes;a place in the team after years on the bench;no group left out|inclusion is letting someone in; exclusion is keeping them out|inclusion 是包容、纳入；exclusion 是排斥|exclusion=exclusion is keeping someone out, the opposite of a place in classes, a team or society=exclusion 是排斥在外，和进入课堂、球队或社会正相反;illusion=illusion is something that seems real but is not, not letting people in=illusion 是错觉，不是接纳人|in · clu · sion|include with -de changed to -sion|把 include 的 -de 改成 -sion
      exclude|girls kept out of a school until 1970;taxes left out of a price;a game where everyone should play|to exclude is to keep out or leave out; to include is to let in or count in|exclude 是排除；include 是包括|include/included/includes=include means to let in or count in, the opposite of keeping girls out, adding taxes on top or not letting someone play=include 是包括在内，和把女孩挡在外、税另算或不让人玩正相反;explode/exploded/explodes=explode means to burst with a loud noise, not to keep someone out=explode 是爆炸，不是把人挡在外面|ex · clude|ex + clude|ex + clude
      quota|places kept for students from poor areas;fixed amounts each boat may catch;a fixed number of tickets a country may sell|a quota is a fixed number allowed or needed; a quote is words repeated from someone|quota 是配额；quote 是引语或报价|quote/quotes=quote is words repeated from a speaker or a price for a job, not a fixed number of places, fish or tickets=quote 是引语或报价，不是固定数量的名额、鱼或票;quorum/quorums=quorum is the smallest number of people needed for a meeting to make decisions, not a fixed number of places or tickets=quorum 是会议做决定所需的法定人数，不是名额或票数|quo · ta|quo + ta, ending in a|quo + ta，以 a 结尾
      eligible|a grant for families earning less than 30,000 dollars;students over sixteen allowed to apply;being old enough to vote|eligible means having the right to do or get something; ineligible means not having it|eligible 是有资格的；ineligible 是没有资格的|ineligible=ineligible means not having the right, the opposite of getting a grant, applying or voting=ineligible 是没有资格的，和拿补助、申请或投票正相反;illegible=illegible means impossible to read, a word for handwriting, not for people's rights=illegible 是字迹难认的，形容笔迹，不形容人的资格|el · i · gi · ble|e + ligible, not *illegible*|e + ligible，别写成 *illegible*
    `,
  },
});

const teaching = vocabularyTopic({
  id: "b2-words-teaching",
  title: t("Teaching", "教学"),
  summary: t(
    "The curriculum and the syllabus; instructing and instructors; mentors; discipline; motivating, engaging and inspiring students; motivation and encouragement; attentive pupils.",
    "课程体系和教学大纲；教导和教练；导师；纪律；激励、吸引和启发学生；动力和鼓励；专心的学生。",
  ),
  intro: t(
    "Our new teacher follows the **syllabus** but adds games that **engage** us, and her **encouragement** keeps our **motivation** high. These words help you talk about what is taught and how good teachers help people learn.",
    "我们的新老师按 **syllabus**（教学大纲）上课，但会加入能 **engage**（吸引）我们的游戏，她的 **encouragement**（鼓励）让我们的 **motivation**（学习动力）一直很高。这些词帮你谈论教什么，以及好老师如何帮人学习。",
  ),
  prerequisites: ["b1-words-school-people"],
  words: [
    word(
      "curriculum curricula",
      "all the subjects that are taught in a school or a course",
      "课程体系；全部课程",
      "Coding is now one of the subjects in the school {curriculum}. | The national {curriculum} sets which subjects pupils learn. | Schools design their own {curricula}, choosing which subjects to teach.|currencies calendars",
      "currency calendar",
      "syllabus",
    ),
    word(
      "syllabus syllabuses",
      "a list of the topics in a course or an exam",
      "教学大纲",
      "The {syllabus}, listing every topic in the exam, is online. | We haven't covered half the topics on the {syllabus} yet. | Teachers follow different {syllabuses}, each with its own list of topics.|syllables stimuli",
      "syllable stimulus",
      "curriculum",
    ),
    word(
      "instruct instructs instructed instructing",
      "to teach someone a practical skill; to tell someone officially to do something",
      "指导；指示",
      "She {instructs} new pilots in how to land, teaching them step by step.|constructs obstructs | The trainer {instructed} the class in first aid, showing them how to bandage a wound.|constructed obstructed | He was {instructed} in how to use the machine by an expert, who showed him every step.|constructed obstructed",
      "construct obstruct",
    ),
    word(
      "instructor instructors",
      "a person who teaches a practical skill, such as driving or swimming",
      "教练；指导者",
      "My driving {instructor} is very patient when he teaches me to park. | Ski {instructors} teach beginners in the mountains in winter.|inspectors constructors | The yoga {instructor} showed us the pose and corrected our arms.",
      "inspector constructor",
      "mentor",
    ),
    word(
      "mentor mentors",
      "an experienced person who advises and helps a less experienced one",
      "导师；指导者",
      "Every new teacher has a {mentor}, an experienced colleague who gives advice. | She was my {mentor} when I started work, giving me advice and support. | {Mentors} meet the students once a week to advise them.|Monitors Mentalities",
      "monitor mentality",
      "instructor",
    ),
    word(
      "discipline disciplines",
      "training people to obey rules; control of your own behavior; a subject of study",
      "纪律；自律；学科",
      "The school is known for strict {discipline}: pupils must obey every rule. | Learning an instrument takes {discipline}: you must practice every day. | History and law are different {disciplines}, or subjects of study.|disciples principles",
      "chaos laziness",
    ),
    word(
      "motivate motivates motivating",
      "to make someone want to do something",
      "激励；使有动力",
      "Good teachers {motivate} their students, making them want to work hard. | Money doesn't {motivate} everyone: some people work hard for other reasons. | The coach is good at {motivating} young players: they train harder after every talk.|discouraging boring",
      "discourage bore",
      "inspire",
    ),
    word(
      "motivation",
      "the wish or the energy to do something",
      "动力；积极性",
      "Many students lack {motivation} and don't want to study. | What is your {motivation} for learning English: work, travel or friends? | Praise is a strong {motivation} that makes people want to try harder.",
      "moderation laziness",
      "encouragement",
    ),
    word(
      "engage engages engaging",
      "to get and keep someone's interest; to take part in something",
      "吸引；使参与",
      "The teacher uses games to {engage} the class and keep everyone interested. | With dull lessons it's hard to {engage} teenagers and keep their interest. | As a speaker she is {engaging}: she holds everyone's interest.|enraging boring",
      "enrage bore",
      "inspire",
    ),
    word(
      "inspire inspires inspired",
      "to give someone the wish and the ideas to do something",
      "激励；启发",
      "Reading her story, I felt {inspired} and decided to become a doctor.|discouraged inspected | Great teachers {inspire} their students and fill them with new ideas. | The film's idea came from real life: it was {inspired} by a true story.|discouraged inspected",
      "discourage inspect",
      "motivate",
    ),
    word(
      "encouragement",
      "words or actions that give someone confidence",
      "鼓励",
      "With a little {encouragement} from her friends, she began to sing. | Thanks for your {encouragement}: it gave me the confidence to try. | Children need praise and {encouragement} to feel confident.",
      "discouragement enforcement",
      "motivation",
    ),
    word(
      "attentive",
      "listening or watching carefully",
      "专心的；注意的",
      "The students were quiet and {attentive}, listening to every word. | Our waiter was {attentive}: he watched our table and brought water before we asked. | Be {attentive} to your customers' needs and notice what they want.",
      "attractive inattentive",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Curriculum* and *syllabus* both list what is taught, but a *curriculum* is all the subjects of a school, while a *syllabus* lists the topics of one course or exam. Ask whether the sentence is about a whole school or one course.",
        "*curriculum* 和 *syllabus* 都列出教学内容，但 *curriculum* 是一所学校的全部科目，*syllabus* 是一门课或一场考试的知识点清单。想想句子说的是整所学校还是一门课。",
      ),
      meaning: t(
        "An *instructor* teaches a practical skill such as driving, while a *mentor* is an experienced person who gives advice over a long time. Check whether the meaning is about a skill or about advice.",
        "*instructor* 教开车这类实用技能，*mentor* 是长期给人建议的有经验的人。看释义说的是技能还是建议。",
      ),
      spell: t(
        "*Curriculum* becomes *curricula* in the plural, *syllabus* has a double l, and *encouragement* keeps the e of *encourage*.",
        "*curriculum* 的复数是 *curricula*，*syllabus* 双写 l，*encouragement* 保留 *encourage* 的 e。",
      ),
    },
    notes: `
      curriculum|coding among the school subjects;the national list of subjects pupils learn;schools choosing which subjects to teach|a curriculum is all the subjects of a school; a calendar shows dates|curriculum 是课程体系；calendar 是日历|currency/currencies=currency is the money of a country, not the subjects a school teaches=currency 是一国的货币，不是学校教的科目;calendar/calendars=calendar shows the days and dates of a year, not which subjects are taught=calendar 显示一年的日期，不是教哪些科目|cur · ric · u · lum|cur + ric + ulum, with curricula in the plural|cur + ric + ulum，复数是 curricula
      syllabus|every topic in an exam online;half the topics not yet covered;each course's own list of topics|a syllabus lists the topics of a course; a syllable is part of a word|syllabus 是教学大纲；syllable 是音节|syllable/syllables=syllable is one sound unit of a word, not a list of topics=syllable 是单词的音节，不是知识点清单;stimulus/stimuli=stimulus is something that causes a reaction, not a list of topics in a course=stimulus 是刺激物，不是课程的知识点清单|syl · la · bus|a double l, then -abus|双写 l，结尾是 -abus
      instruct|teaching pilots to land step by step;showing a class how to bandage a wound;an expert showing every step of a machine|to instruct is to teach a practical skill or give an order; to obstruct is to block|instruct 是指导、指示；obstruct 是阻挠|construct/constructs/constructed=construct means to build something like a bridge, not to teach a person a skill=construct 是建造桥梁之类，不是教人技能;obstruct/obstructs/obstructed=obstruct means to block someone or stop progress, the opposite of showing them step by step=obstruct 是阻挡、妨碍，和一步步示范正相反|in · struct|in + struct|in + struct
      instructor|someone teaching a learner driver to park;people teaching beginners to ski;someone showing a yoga pose|an instructor teaches a practical skill; an inspector checks that rules are followed|instructor 是教练；inspector 是检查员|inspector/inspectors=inspector checks that rules are followed, not someone who teaches parking, skiing or yoga=inspector 是检查员，不是教停车、滑雪或瑜伽的人;constructor/constructors=constructor is a person or company that builds things, not someone who teaches a skill=constructor 是建造者，不是教技能的人|in · struc · tor|instruct + or|instruct + or
      mentor|an experienced colleague who gives advice;advice and support when starting work;weekly meetings to advise students|a mentor is an experienced adviser; a monitor is a screen or someone who watches|mentor 是导师；monitor 是显示器或监督员|monitor/monitors/Monitors=monitor is a screen or a person who watches that rules are kept, not an experienced adviser=monitor 是显示器或监督员，不是有经验的指导者;mentality/mentalities/Mentalities=mentality is a way of thinking, not a person who gives advice=mentality 是心态，不是给建议的人|men · tor|men + tor, ending in -or|men + tor，以 -or 结尾
      discipline|pupils obeying every rule;practicing every day;history and law as subjects of study|discipline is control and obeying rules; chaos is complete disorder|discipline 是纪律、自律、学科；chaos 是混乱|chaos=chaos is complete disorder, the opposite of obeying rules or practicing every day=chaos 是一片混乱，和遵守规则、天天练习正相反;laziness=laziness is not wanting to work, the opposite of practicing every day and obeying rules=laziness 是懒惰，和天天练习、遵守规则正相反;disciples=disciples are followers of a teacher such as Jesus, not subjects of study=disciples 是追随者、门徒，不是学科;principles=principles are basic rules or beliefs, not subjects of study like history and law=principles 是原则，不是历史、法律这样的学科|dis · ci · pline|dis + ci + pline, with sc said like s|dis + ci + pline，sc 读作 s
      motivate|making students want to work hard;people working hard for reasons other than money;players training harder after a talk|to motivate is to make someone want to act; to discourage is to make them want to stop|motivate 是激励；discourage 是使泄气|discourage/discouraging=discourage means to make someone lose the wish to try, the opposite of making them work or train harder=discourage 是使人泄气，和让人更努力学习训练正相反;bore/boring=bore means to make someone tired of something because it is dull, not to make them want to work harder=bore 是使人厌烦，不是让人更想努力|mo · ti · vate|motive with the e dropped, then -ate|motive 去掉 e，再加 -ate
      motivation|students who don't want to study;work, travel or friends as reasons to learn;praise that makes people try harder|motivation is the wish to do something; laziness is not wanting to|motivation 是动力；laziness 是懒惰|moderation=moderation is not doing too much of something, not the wish to study or try harder=moderation 是适度，不是想学习或更努力的愿望;laziness=laziness is not wanting to work, the opposite of a reason to learn or a wish to try harder=laziness 是懒惰，和学习的理由、更努力的愿望正相反|mo · ti · va · tion|motivate with the e dropped, then -ion|motivate 去掉 e，再加 -ion
      engage|games that keep everyone interested;keeping teenagers' interest through dull lessons;a speaker who holds everyone's interest|to engage is to get and keep interest; to bore is to make people lose it|engage 是吸引；bore 是使厌烦|enrage/enraging=enrage means to make someone very angry, not to keep them interested=enrage 是激怒，不是吸引人的兴趣;bore/boring=bore means to make people lose interest, the opposite of keeping everyone interested=bore 是使人失去兴趣，和让大家保持兴趣正相反|en · gage|en + gage|en + gage
      inspire|deciding to become a doctor after a story;filling students with new ideas;a film whose idea came from real life|to inspire is to give someone the wish and ideas to act; to discourage is to take that wish away|inspire 是激励、启发；discourage 是使泄气|discourage/discouraged=discourage means to make someone lose the wish to act, the opposite of deciding to become a doctor or being filled with ideas=discourage 是使泄气，和决定当医生或充满新想法正相反;inspect/inspected=inspect means to look at something carefully to check it, not to give someone ideas=inspect 是仔细检查，不是给人启发|in · spire|in + spire|in + spire
      encouragement|friends helping her begin to sing;words that gave confidence to try;praise that helps children feel confident|encouragement gives confidence; discouragement takes it away|encouragement 是鼓励；discouragement 是打击|discouragement=discouragement is words or events that take away confidence, the opposite of helping someone sing or try=discouragement 是使人丧失信心的话或事，和鼓励人唱歌或尝试正相反;enforcement=enforcement is making people obey a law, not giving them confidence=enforcement 是执法，不是给人信心|en · cour · age · ment|encourage + ment, keeping the e|encourage + ment，保留 e
      attentive|students listening to every word;a waiter bringing water before being asked;noticing what customers want|attentive means listening or watching carefully; inattentive means not paying attention|attentive 是专心的、周到的；inattentive 是不专心的|attractive=attractive means pleasant to look at, not listening or watching carefully=attractive 是有吸引力的、好看的，不是专心留意;inattentive=inattentive means not paying attention, the opposite of listening to every word or noticing needs=inattentive 是不专心的，和认真听每个字或留意需求正相反|at · ten · tive|attent + ive, with a double t|attent + ive，双写 t
    `,
  },
});

const growing = vocabularyTopic({
  id: "b2-words-growing-up",
  title: t("Growing Up", "成长"),
  summary: t(
    "Maturity; nurturing and fostering children; playful, obedient and rebellious children; peers and bullies; tantrums; curiosity; milestones and formative years.",
    "成熟；养育和抚养孩子；爱玩的、听话的和叛逆的孩子；同龄人和欺凌者；发脾气；好奇心；里程碑和成长的关键时期。",
  ),
  intro: t(
    "At two my brother had a **tantrum** every day; at fifteen he was **rebellious** and cared only about his **peers**; now he shows real **maturity**. These words help you talk about how children grow, behave and are cared for.",
    "我弟弟两岁时天天 **tantrum**（发脾气）；十五岁时很 **rebellious**（叛逆），只在乎 **peers**（同龄人）；如今他表现出真正的 **maturity**（成熟）。这些词帮你谈论孩子如何成长、表现，以及如何被照顾。",
  ),
  prerequisites: ["b1-words-family-life"],
  words: [
    word(
      "maturity",
      "the state of being an adult or of behaving like a sensible adult",
      "成熟",
      "She shows great {maturity} for her age, behaving like a sensible adult. | Boys reach physical {maturity}, with an adult body, later than girls. | He lacks the {maturity} to handle money sensibly.",
      "majority immaturity",
    ),
    word(
      "nurture nurtures nurtured nurturing",
      "to care for and help someone or something grow",
      "养育；培养",
      "Parents {nurture} their children's talents, helping them grow. | The school {nurtures} young musicians with lessons and support.|neglects tortures | She {nurtured} the plants carefully, watering them every day.|neglected tortured",
      "neglect torture",
      "foster",
    ),
    word(
      "foster fosters fostered fostering",
      "to look after someone else's child in your home for a time; to help something develop",
      "代养；促进",
      "They {foster} children who can't live with their parents, caring for them at home. | Sport {fosters} team spirit, helping it grow.|neglects abandons | He was {fostered} by a family in Leeds who looked after him for three years.|neglected abandoned",
      "neglect abandon",
      "nurture",
    ),
    word(
      "playful",
      "full of fun; not serious",
      "爱玩的；开玩笑的",
      "The puppy is very {playful}, always running after balls. | She gave him a {playful} push, laughing as she did it. | His tone was {playful}, not angry: he was only joking.",
      "serious painful",
    ),
    word(
      "obedient",
      "doing what you are told to do",
      "听话的；顺从的",
      "The dog is very {obedient}: it sits when you tell it to. | As a child he was {obedient} and always did what his parents said. | Soldiers must be {obedient} and follow orders.",
      "rebellious expedient",
      "rebellious",
    ),
    word(
      "rebellious",
      "not willing to obey rules or people in charge",
      "叛逆的；反抗的",
      "{Rebellious} teenagers often fight with their parents and break the rules.|Obedient Religious | At fifteen she was {rebellious}, refusing to do anything she was told. | The {rebellious} soldiers turned against their officers and took the city.",
      "obedient religious",
      "obedient",
    ),
    word(
      "peer peers",
      "a person of the same age or position as you",
      "同龄人；同辈",
      "Teenagers care what their {peers}, people of their own age, think.|piers parents | {Peer} pressure from friends his age made him start smoking.|Pier Parent | She was respected by her {peers}, the other doctors of her generation.|piers parents",
      "pier parent",
    ),
    word(
      "bully bullies bullied bullying",
      "to hurt or frighten someone weaker, again and again; a person who does this",
      "欺负；恃强凌弱者",
      "He was {bullied} at school: older boys hit him every day.|protected praised | Schools must stop {bullying}, when strong pupils frighten weaker ones again and again.|protecting praising | The {bully} took the younger boy's lunch money every day.|victim protector",
      "protect praise",
    ),
    word(
      "tantrum tantrums",
      "a sudden fit of anger, especially by a young child",
      "（小孩）发脾气",
      "The toddler had a {tantrum} in the shop, screaming and kicking on the floor. | Two-year-olds often have angry {tantrums} when they don't get what they want.|tandems naps | He threw a {tantrum} when he lost, shouting and throwing his toys.",
      "tandem nap",
    ),
    word(
      "curiosity",
      "the wish to know or learn about something",
      "好奇心",
      "Children are full of {curiosity} and ask questions about everything. | Out of {curiosity}, I opened the box to see what was inside.|security boredom | {Curiosity}, the wish to know more, drives science.|Security Boredom",
      "security boredom",
    ),
    word(
      "milestone milestones",
      "a very important stage or event in a person's life or a process",
      "里程碑；重要事件",
      "Taking its first steps is a big {milestone} for a baby. | Leaving home is a big {milestone} in a young person's life. | The company reached a {milestone}: one million users.",
      "millstone limestone",
    ),
    word(
      "formative",
      "having an important effect on the way someone or something develops",
      "对成长有重要影响的；形成期的",
      "She spent her {formative} years, the years that shaped her, in Kenya. | School is a {formative} experience that shapes who we become. | His {formative} influences, the people who shaped him most, were his grandparents.",
      "formal normative",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Nurture* and *foster* both help someone or something grow, but *foster* also means caring for another family's child in your own home. Ask whether the sentence is about a child who lives with a different family.",
        "*nurture* 和 *foster* 都指帮助人或事物成长，但 *foster* 还指在自己家里照顾别人家的孩子。想想句子说的是不是住在别人家的孩子。",
      ),
      meaning: t(
        "*Obedient* and *rebellious* are opposites: an *obedient* person does what they are told, while a *rebellious* one refuses. Check whether the meaning is about following rules or fighting them.",
        "*obedient* 和 *rebellious* 意思相反：*obedient* 的人照吩咐做，*rebellious* 的人拒绝服从。看释义说的是遵守规则还是反抗规则。",
      ),
      spell: t(
        "*Tantrum* ends in -rum, *milestone* is mile + stone, and *curiosity* turns the -ous of *curious* into -os-.",
        "*tantrum* 以 -rum 结尾，*milestone* 是 mile + stone，*curiosity* 把 *curious* 的 -ous 变成 -os-。",
      ),
    },
    notes: `
      maturity|behaving like a sensible adult;reaching an adult body;handling money sensibly|maturity is being or acting like a sensible adult; immaturity is acting like a child|maturity 是成熟；immaturity 是不成熟|majority=majority is the larger part of a group, not being or acting like an adult=majority 是大多数，不是成年或举止成熟;immaturity=immaturity is acting like a child, the opposite of behaving like a sensible adult=immaturity 是幼稚，和举止像懂事的成年人正相反|ma · tu · ri · ty|mature with the e dropped, then -ity|mature 去掉 e，再加 -ity
      nurture|helping children's talents grow;lessons and support for young musicians;watering plants every day|to nurture is to care for something so it grows; to neglect is not to care for it|nurture 是培养；neglect 是忽视|neglect/neglects/neglected=neglect means to fail to care for someone or something, the opposite of helping, supporting or watering them=neglect 是疏于照顾，和帮助、支持或浇水正相反;torture/tortures/tortured=torture means to hurt someone badly on purpose, the opposite of caring for them=torture 是故意折磨，和精心照料正相反|nur · ture|nur + ture|nur + ture
      foster|caring at home for children who can't live with their parents;helping team spirit grow;a family that looked after a boy for three years|to foster is to look after another family's child or help something develop; to abandon is to leave it|foster 是代养、促进；abandon 是抛弃|neglect/neglects/neglected=neglect means to fail to care for someone or something, the opposite of caring for children or helping team spirit grow=neglect 是疏于照顾，和照顾孩子或培养团队精神正相反;abandon/abandons/abandoned=abandon means to leave someone or something forever, the opposite of looking after them=abandon 是抛弃，和照顾正相反|fos · ter|fos + ter, not *faster*|fos + ter，别写成 *faster*
      playful|a puppy running after balls;a push given while laughing;a joking tone, not an angry one|playful means full of fun; serious means not joking|playful 是爱玩的、开玩笑的；serious 是严肃的|serious=serious means not joking, the opposite of running after balls, laughing or joking=serious 是严肃的，和追球、大笑或开玩笑正相反;painful=painful means causing pain, not full of fun and jokes=painful 是令人疼痛的，不是好玩的|play · ful|play + ful, with a single l at the end|play + ful，结尾只有一个 l
      obedient|a dog that sits when told;a child who did what his parents said;soldiers who follow orders|obedient means doing what you are told; rebellious means refusing|obedient 是听话的；rebellious 是叛逆的|rebellious=rebellious means refusing to obey, the opposite of sitting when told or following orders=rebellious 是叛逆不服从的，和听令坐下或服从命令正相反;expedient=expedient means useful for a purpose even if not fair, not doing what you are told=expedient 是权宜的，不是听从吩咐|o · be · di · ent|obey with -ey changed to -edient|把 obey 的 -ey 改成 -edient
      rebellious|teenagers fighting parents and breaking rules;refusing to do anything she was told;soldiers turning against their officers|rebellious means refusing to obey; obedient means doing what you are told|rebellious 是叛逆的；obedient 是听话的|obedient/Obedient=obedient means doing what you are told, the opposite of breaking rules or turning against officers=obedient 是听话的，和违反规则或反抗长官正相反;religious/Religious=religious means connected with a faith, not refusing to obey=religious 与宗教信仰有关，不是不服从|re · bel · lious|rebel + lious, with a double l|rebel + lious，双写 l
      peer|people of their own age;friends of the same age as him;other doctors of the same generation|a peer is someone of your own age or position; a parent is your mother or father|peer 是同龄人、同辈；parent 是父母|pier/piers/Pier=pier is a platform built out into the sea, not a person of your own age=pier 是伸入海中的码头，不是同龄人;parent/parents/Parent=parent is a mother or father, an older generation, not someone of your own age=parent 是父母，属于上一辈，不是同龄人|peer|p + eer, not *pier*|p + eer，别写成 *pier*
      bully|older boys hitting him every day;strong pupils frightening weaker ones again and again;taking a younger boy's lunch money|to bully is to hurt or frighten someone weaker again and again; to protect is to keep them safe|bully 是欺负；protect 是保护|protect/protected/protecting=protect means to keep someone safe, the opposite of hitting or frightening them=protect 是保护，和打人或吓唬人正相反;praise/praised/praising=praise means to say good things about someone, not to hurt or frighten them=praise 是表扬，不是伤害或恐吓;victim=victim is the person who gets hurt, not the one who takes the money=victim 是受害者，不是抢钱的人;protector=protector is someone who keeps others safe, the opposite of taking their money=protector 是保护者，和抢别人的钱正相反|bul · ly|a double l, then y|双写 l，结尾是 y
      tantrum|a toddler screaming and kicking in a shop;angry fits when children don't get what they want;shouting and throwing toys after losing|a tantrum is a sudden fit of anger; a nap is a short sleep|tantrum 是发脾气；nap 是小睡|tandem/tandems=tandem is a bicycle for two people, not a fit of anger=tandem 是双人自行车，不是发脾气;nap/naps=nap is a short sleep in the day, the opposite of screaming, kicking or shouting=nap 是白天小睡，和尖叫、乱踢或大喊正相反|tan · trum|tan + trum, ending in -rum|tan + trum，以 -rum 结尾
      curiosity|children asking questions about everything;opening a box to see what is inside;the wish to know more that drives science|curiosity is the wish to know; boredom is having no interest|curiosity 是好奇心；boredom 是无聊|security/Security=security is being safe from danger, not the wish to know or learn=security 是安全，不是求知欲;boredom/Boredom=boredom is feeling no interest, the opposite of asking questions or wanting to know more=boredom 是无聊、没兴趣，和提问、想知道更多正相反|cu · ri · os · i · ty|curious with -ous changed to -osity|把 curious 的 -ous 改成 -osity
      milestone|a baby's first steps;leaving home in a young person's life;one million users for a company|a milestone is an important stage in life or a process; a millstone is a heavy stone for grinding|milestone 是里程碑；millstone 是磨盘|millstone=millstone is a heavy round stone for grinding grain, not an important stage in life=millstone 是磨盘石，不是人生的重要阶段;limestone=limestone is a type of rock, not an important event=limestone 是石灰岩，不是重要事件|mile · stone|mile + stone|mile + stone
      formative|the years that shaped her;an experience that shapes who we become;the people who shaped him most|formative means having an important effect on how someone develops; formal means official and serious|formative 是对成长有重要影响的；formal 是正式的|formal=formal means official or serious in style, not shaping how someone grows up=formal 是正式的，不是影响人的成长;normative=normative means connected with rules about how things should be, not shaping a person's years=normative 是规范性的，不是塑造人生某段岁月|for · ma · tive|form + ative|form + ative
    `,
  },
});

const abstracts = vocabularyTopic({
  id: "b2-words-abstract-nouns",
  title: t("Abstract Nouns", "抽象名词"),
  summary: t(
    "Concepts and notions; aspects, factors and features; dimensions; frameworks and contexts; perspectives and approaches; issues; phenomena; kinds of things and the main ones.",
    "概念和观念；方面、因素和特点；维度；框架和背景；视角和方法；问题；现象；种类和主要的。",
  ),
  intro: t(
    "To understand a word, look at its **context**; to understand a problem, look at every **aspect** and each **factor** behind it. These words help you talk about ideas, causes and points of view in essays and discussions.",
    "要理解一个词，就看它的 **context**（语境）；要理解一个问题，就看它的每个 **aspect**（方面）和背后的每个 **factor**（因素）。这些词帮你在文章和讨论中谈论观点、原因和看问题的角度。",
  ),
  prerequisites: ["b1-words-thinking"],
  words: [
    word(
      "concept concepts",
      "an idea of what something is or how it works",
      "概念",
      "The {concept} of time, the idea of what it is, is hard for children. | Freedom is a difficult {concept} to define in words. | The book explains basic {concepts} in physics, such as energy and force.|concerts conceits",
      "concert conceit",
      "notion",
    ),
    word(
      "notion notions",
      "an idea or a belief, often one that is not quite right",
      "观念；想法",
      "The {notion} that girls can't do math is a wrong belief that many people still hold. | He has some strange {notions} about money, such as never using banks.|motions lotions | I had no {notion} of what she meant: I had no idea at all.",
      "motion lotion",
      "concept",
    ),
    word(
      "aspect aspects",
      "one part or side of a situation, an idea or a problem",
      "方面",
      "Cost is an important {aspect} of the plan, one side we must think about. | We discussed every {aspect} of the problem, looking at it from all sides. | Music is an {aspect} of every culture, one part of its life.",
      "aspen expectation",
      "feature",
    ),
    word(
      "factor factors",
      "one of the things that cause or influence something",
      "因素",
      "Price is a key {factor} in choosing a phone: it influences what we buy. | Many {factors}, like food, sleep and stress, affect your health.|factories actors | Luck was one {factor} in her success, though hard work mattered more.",
      "factory actor",
      "aspect",
    ),
    word(
      "feature features",
      "an important or typical part of something; a part of the face",
      "特点；特征；五官",
      "The phone has some useful new {features}, such as a better camera.|futures fractures | A large garden is the main {feature} of the house, the thing everyone notices. | Her eyes are her best {feature}: they are the most beautiful part of her face.",
      "future fracture",
      "aspect",
    ),
    word(
      "dimension dimensions",
      "an aspect of a situation; a measurement such as length or width",
      "方面；维度；尺寸",
      "The problem has a political {dimension}, as well as an economic one. | Measure the {dimensions} of the room: its length, width and height.|detentions mentions | Music adds a new {dimension} to the film, a side it did not have before.",
      "detention mention",
    ),
    word(
      "framework frameworks",
      "a set of ideas or rules that you use to make decisions; a structure that supports something",
      "框架；体系",
      "The law gives a {framework} of rules for protecting workers. | The theory provides a useful {framework}, a structure for organizing ideas. | The bridge has a steel {framework} that holds it up.",
      "fieldwork homework",
    ),
    word(
      "context contexts",
      "the situation in which something happens, which helps you understand it",
      "背景；语境",
      "You can guess the word's meaning from the {context}, the sentences around it. | His words were taken out of {context}, so they sounded worse than he meant. | The events must be seen in their historical {context}, the situation of the time.",
      "contest contact",
    ),
    word(
      "perspective perspectives",
      "a way of thinking about something",
      "视角；观点",
      "Try to see it from my {perspective}, the way I think about it. | The book offers a fresh {perspective} on history, a new way of looking at it. | Living abroad gave her a new {perspective} on her own country.",
      "prospect inspection",
      "approach",
    ),
    word(
      "approach approaches approached approaching",
      "a way of dealing with something; to come near",
      "方法；接近",
      "We need a new {approach} to teaching reading, a different way of doing it. | Winter is {approaching}: the days are getting shorter and colder.|retreating reproaching | A man {approached} me in the street and asked the way.|reproached avoided",
      "reproach retreat",
      "perspective",
    ),
    word(
      "issue issues",
      "a subject or a problem that people discuss",
      "问题；议题",
      "Climate change is a global {issue} that every country discusses. | We discussed several {issues} at the meeting, from pay to holidays.|tissues isles | Money is not the {issue}: the real problem is time.",
      "tissue isle",
    ),
    word(
      "phenomenon phenomena",
      "something that happens or exists, especially something unusual or interesting",
      "现象",
      "The northern lights are a natural {phenomenon} that many people travel to see. | Online shopping is a recent {phenomenon} that has changed how we buy. | Scientists study strange {phenomena}, such as black holes, in space.|pheromones phantoms",
      "pheromone phantom",
    ),
    word(
      "kinds",
      "types or sorts of something; the plural of the noun kind, as in all kinds of",
      "种类；各种",
      "The shop sells all {kinds} of tea, from green to black. | There are two {kinds} of people: those who plan and those who don't. | Scientists have found new {kinds} of bacteria, never seen before, in the ocean.",
      "kings kinsmen",
    ),
    word(
      "main",
      "most important or largest",
      "主要的",
      "The {main} reason I moved was the job: it mattered more than anything else. | The {main} road through the town, the biggest one, is always busy. | Rice is the {main} food in many Asian countries, eaten more than any other.",
      "minor manual",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Concept* and *notion* are both ideas, but a *notion* is often a belief that is not quite right, while a *concept* is the idea of what something is or how it works. Ask whether the sentence questions the idea or simply explains it.",
        "*concept* 和 *notion* 都是想法，但 *notion* 常指不太对的看法，*concept* 是对事物是什么、如何运作的概念。想想句子是在质疑这个想法，还是在解释它。",
      ),
      meaning: t(
        "An *aspect* is one side of a situation, while a *factor* is something that causes or influences a result. Check whether the meaning is about a side or about a cause.",
        "*aspect* 是一个情况的某个方面，*factor* 是引起或影响结果的因素。看释义说的是方面还是原因。",
      ),
      spell: t(
        "*Phenomenon* becomes *phenomena* in the plural, *perspective* starts with per-, not pro-, and *framework* is frame + work.",
        "*phenomenon* 的复数是 *phenomena*，*perspective* 以 per- 开头，不是 pro-，*framework* 是 frame + work。",
      ),
    },
    notes: `
      concept|the idea of what time is;freedom as an idea hard to define;energy and force in physics|a concept is an idea of what something is; a concert is a music performance|concept 是概念；concert 是音乐会|concert/concerts=concert is a performance of music, not an idea of what something is=concert 是音乐会，不是对事物的概念;conceit/conceits=conceit is thinking too highly of yourself, not an idea in physics or about time=conceit 是自负，不是物理或时间的概念|con · cept|con + cept|con + cept
      notion|a wrong belief that girls can't do math;strange ideas like never using banks;having no idea of what she meant|a notion is an idea or belief, often not quite right; a motion is movement or a proposal|notion 是观念、想法；motion 是动作或提议|motion/motions=motion is movement or a proposal voted on in a meeting, not a belief people hold or an idea in your head=motion 是运动或会议上的动议，不是人们抱有的看法或脑中的想法;lotion/lotions=lotion is a cream you put on your skin, not an idea=lotion 是护肤乳液，不是想法|no · tion|no + tion|no + tion
      aspect|one side of a plan to think about;looking at a problem from all sides;one part of every culture's life|an aspect is one side of something; an expectation is what you think will happen|aspect 是方面；expectation 是期望|aspen=aspen is a kind of tree, not one side of a plan or a problem=aspen 是白杨树，不是计划或问题的一个方面;expectation=expectation is what you believe will happen, not one side of a plan, a problem or a culture=expectation 是预期，不是计划、问题或文化的一个方面|as · pect|a + spect|a + spect
      factor|price influencing what we buy;food, sleep and stress affecting health;luck as one cause of success|a factor is something that influences a result; an aspect is one side of a situation|factor 是因素；aspect 是方面|factory/factories=factory is a building where goods are made, not something that influences a result=factory 是工厂，不是影响结果的因素;actor/actors=actor is a person who performs in films and plays, not a cause of success or health=actor 是演员，不是成功或健康的原因|fac · tor|fact + or|fact + or
      feature|a better camera on a phone;a garden everyone notices;the most beautiful part of her face|a feature is an important part of something; a fracture is a break in a bone|feature 是特点、五官；fracture 是骨折|future/futures=future is the time that is coming, not a part of a phone, a house or a face=future 是未来，不是手机、房子或脸的组成部分;fracture/fractures=fracture is a crack or break in a bone, not a useful or beautiful part=fracture 是骨折、裂缝，不是有用或好看的部分|fea · ture|feat + ure|feat + ure
      dimension|a political side as well as an economic one;the length, width and height of a room;a new side music gives a film|a dimension is a side of a situation or a measurement; a mention is a short remark about something|dimension 是方面、尺寸；mention 是提及|detention/detentions=detention is being kept in a place as a punishment, not a side of a problem or a size=detention 是被关押或留校惩罚，不是问题的方面或尺寸;mention/mentions=mention is a short remark about something, not a side of a problem or a length or width=mention 是提及，不是问题的方面或长宽|di · men · sion|di + mension, with -sion said like *shun*|di + mension，-sion 读作 *shun*
      framework|rules for protecting workers;a structure for organizing ideas;steel that holds a bridge up|a framework is a set of ideas or a supporting structure; fieldwork is research done outside|framework 是框架；fieldwork 是实地考察|fieldwork=fieldwork is research done outside an office or a laboratory, not a set of rules or a structure that holds something up=fieldwork 是实地考察，不是一套规则或支撑结构;homework=homework is school work done at home, not a set of rules or a steel structure=homework 是家庭作业，不是一套规则或钢结构|frame · work|frame + work|frame + work
      context|the sentences around a word;words that sounded worse when taken out;the situation of the time|context is the situation around something; a contest is a competition|context 是语境、背景；contest 是比赛|contest=contest is a competition, not the sentences or the situation around something=contest 是比赛，不是周围的句子或情况;contact=contact is touching or communicating with someone, not the situation that helps you understand something=contact 是接触或联系，不是帮助理解的背景|con · text|con + text|con + text
      perspective|seeing something the way I think about it;a fresh way of looking at history;a new view of her own country|a perspective is a way of thinking about something; a prospect is a possibility in the future|perspective 是视角；prospect 是前景|prospect=prospect is something that may happen in the future, not a way of looking at something=prospect 是前景、可能性，不是看问题的角度;inspection=inspection is a careful check of something, not a way of thinking about it=inspection 是检查，不是思考的角度|per · spec · tive|per + spective, not *pro*|per + spective，不是 *pro*
      approach|a different way of teaching reading;winter coming with shorter, colder days;a man coming up to ask the way|an approach is a way of dealing with something, and to approach is to come near; to retreat is to move back|approach 是方法、接近；retreat 是后退|reproach/reproaching/reproached=reproach means to blame or criticize someone, not a way of doing something or coming nearer=reproach 是责备，不是做事方法或靠近;retreat/retreating=retreat means to move back or away, the opposite of a new way forward or a season coming nearer=retreat 是后退离开，和新办法或季节临近正相反;avoided=avoid means to keep away from someone, the opposite of coming up to ask them the way=avoid 是避开，和走上前问路正相反|ap · proach|a double p, then -roach|双写 p，结尾是 -roach
      issue|climate change that every country discusses;pay and holidays at a meeting;money compared with the real problem|an issue is a subject or problem people discuss; a tissue is a paper handkerchief|issue 是议题、问题；tissue 是纸巾|tissue/tissues=tissue is a soft paper handkerchief or the cells of a body, not a subject people discuss=tissue 是纸巾或身体组织，不是人们讨论的议题;isle/isles=isle is an island, not a problem or a subject=isle 是小岛，不是问题或议题|is · sue|a double s, said like *sh*|双写 s，读作 *sh*
      phenomenon|northern lights people travel to see;online shopping changing how we buy;black holes in space|a phenomenon is something that happens or exists, especially something unusual; a phantom is a ghost|phenomenon 是现象；phantom 是幽灵|pheromone/pheromones=pheromone is a chemical an animal gives off to send signals, not lights in the sky or a way of shopping=pheromone 是动物释放的信息素，不是天空的光或购物方式;phantom/phantoms=phantom is a ghost or something that is not real, not something that really happens or exists=phantom 是幽灵或虚幻之物，不是真实发生或存在的东西|phe · nom · e · non|ph said like f, ending in -on, with phenomena in the plural|ph 读作 f，以 -on 结尾，复数是 phenomena
      kinds|green and black tea;people who plan and people who don't;bacteria never seen before|kinds are types of something; kings are rulers|kinds 是种类；kings 是国王|kings=kings are male rulers of countries, not types of tea, people or bacteria=kings 是国王，不是茶、人或细菌的种类;kinsmen=kinsmen are members of your family, not types of something=kinsmen 是亲属，不是种类|kinds|kind + s|kind + s
      main|a job that mattered more than anything else;the biggest road through town;the food eaten more than any other|main means most important or largest; minor means small and less important|main 是主要的；minor 是次要的|minor=minor means small and less important, the opposite of what matters most, the biggest road or the most eaten food=minor 是次要的，和最重要、最大或吃得最多正相反;manual=manual means done with the hands, not most important or largest=manual 是手工的，不是最主要或最大的|main|m + ain, not *mane*|m + ain，别写成 *mane*
    `,
  },
});

const thinking = vocabularyTopic({
  id: "b2-words-thinking-verbs",
  title: t("Verbs of Thinking", "思维动词"),
  summary: t(
    "Interpreting, clarifying and elaborating; categorizing and classifying; distinguishing and differentiating; integrating and synthesizing; formulating, generalizing and inferring.",
    "解读、澄清和详细说明；归类和分类；区分和辨别；整合和综合；构想、概括和推断。",
  ),
  intro: t(
    "In a good essay you **interpret** the sources, **synthesize** them into one argument and **infer** what they mean, but you never **generalize** from one example. These words help you describe the thinking you do when you study, read and write.",
    "好文章要 **interpret**（解读）资料，把它们 **synthesize**（综合）成一个论点，并 **infer**（推断）其含义，但绝不能从一个例子 **generalize**（以偏概全）。这些词帮你描述学习、阅读和写作时的思考活动。",
  ),
  prerequisites: ["b1-words-thinking"],
  words: [
    word(
      "interpret interprets interpreted interpreting",
      "to explain or decide what something means; to translate what someone says",
      "解读；口译",
      "How do you {interpret} the poem's last line: what do you think it means? | Her silence was {interpreted} as a yes: everyone took it to mean she agreed.|interrupted ignored | At meetings he {interprets} what the president says for the foreign guests.|interrupts ignores",
      "interrupt ignore",
    ),
    word(
      "clarify clarifies clarified clarifying",
      "to make something clearer or easier to understand",
      "澄清；阐明",
      "Could you {clarify} what you mean? I don't understand. | The minister {clarified} her position, explaining it more clearly.|classified confused | Let me {clarify} one point so that nobody misunderstands.",
      "classify confuse",
      "elaborate",
    ),
    word(
      "elaborate elaborates elaborated elaborating",
      "to give more details about something",
      "详细说明",
      'Could you {elaborate}? Please give us more details. | She refused to {elaborate}, saying only "yes" and nothing more. | When asked about his plans, he {elaborated}, describing each one in detail.|collaborated evaporated',
      "collaborate evaporate",
      "clarify",
    ),
    word(
      "categorize categorizes categorized categorizing",
      "to put people or things into groups by type",
      "将……归类",
      "The books are {categorized} by subject: history, science and art.|criticized memorized | We {categorize} the animals by what they eat: meat, plants or both. | It's hard to {categorize} her music: is it jazz, pop or folk?",
      "criticize memorize",
      "classify",
    ),
    word(
      "classify classifies classified classifying",
      "to put things into groups; to say officially that information is secret",
      "分类；把……列为机密",
      "Scientists {classify} plants by their flowers, putting each in a family. | The documents are {classified}: only a few officials may read them.|clarified glorified | The storm was {classified} as a hurricane because of its strong winds.|clarified glorified",
      "clarify glorify",
      "categorize",
    ),
    word(
      "distinguish distinguishes distinguished distinguishing",
      "to see or show the difference between things",
      "区分；辨别",
      "Can you {distinguish} the twins, or do they look exactly alike to you? | Colorblind people can't {distinguish} red and green: the two look the same to them. | What {distinguishes} this phone, making it different from the others?|extinguishes confuses",
      "extinguish confuse",
      "differentiate",
    ),
    word(
      "differentiate differentiates differentiated differentiating",
      "to see or show the difference between things; to treat them differently",
      "区分；区别对待",
      "A good reader can {differentiate} facts and opinions and see which is which. | The law treats adults and children the same: it doesn't {differentiate} them. | What {differentiates} the two products? They look almost the same to me.|confuses combines",
      "confuse combine",
      "distinguish",
    ),
    word(
      "integrate integrates integrated integrating",
      "to combine things so that they work together; to become part of a group",
      "整合；融入",
      "The app {integrates} your calendar and your email, so they work together.|separates interrogates | The school works hard to {integrate} new pupils so that they feel part of the school. | The course {integrates} theory and practice, combining them in every lesson.|separates interrogates",
      "separate interrogate",
      "synthesize",
    ),
    word(
      "synthesize synthesizes synthesized synthesizing",
      "to combine ideas or information into a whole; to make a substance by chemistry",
      "综合；合成",
      "The essay {synthesizes} research from many fields, combining it into one clear argument.|separates copies | The drug was first {synthesized} in 1950, when chemists made it from simple substances.|separated copied | You must {synthesize} the sources into one argument, not just list them.",
      "separate copy",
      "integrate",
    ),
    word(
      "formulate formulates formulated formulating",
      "to develop a plan or an idea carefully; to say something clearly",
      "构想；表述",
      "The government is {formulating} a new policy, working out every detail carefully.|stimulating forgetting | She {formulated} a theory about memory and tested it on hundreds of people.|stimulated forgot | Take time to {formulate} your answer before you speak.",
      "stimulate forget",
    ),
    word(
      "generalize generalizes generalized generalizing",
      "to say that something is true of a whole group from only a few examples",
      "概括；以偏概全",
      "Don't {generalize}: one rude waiter doesn't mean that everyone in Paris is rude. | It's dangerous to {generalize} about whole nations after meeting only a few of their people.|apologize hesitate | He tends to {generalize}, saying all teenagers are lazy because his son is.",
      "apologize specialize",
    ),
    word(
      "infer infers inferred inferring",
      "to reach an opinion from the facts you have",
      "推断；推论",
      "What can you {infer} from the data about how sales are changing? | I {inferred} from her smile that she had passed the exam.|implied hid | Readers must {infer} the writer's meaning from clues in the text.",
      "imply hide",
      "interpret",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Infer* and *imply* are easy to mix up: the writer or the facts *imply* something, and the reader *infers* it from them. Ask whether the sentence is about the one who suggests or the one who works it out.",
        "*infer* 和 *imply* 很容易混：作者或事实 *imply*（暗示）某事，读者从中 *infers*（推断）出来。想想句子说的是暗示的一方，还是推断的一方。",
      ),
      meaning: t(
        "*Clarify* makes something clearer, while *elaborate* adds more details to it. Check whether the meaning is about being clearer or about saying more.",
        "*clarify* 是让事情更清楚，*elaborate* 是补充更多细节。看释义说的是更清楚还是说得更多。",
      ),
      spell: t(
        "*Categorize* and *generalize* end in -ize, *infer* doubles its r in *inferred*, and *distinguish* ends in -guish.",
        "*categorize* 和 *generalize* 以 -ize 结尾，*infer* 在 *inferred* 里双写 r，*distinguish* 以 -guish 结尾。",
      ),
    },
    notes: `
      interpret|what the last line of a poem means;silence taken to mean yes;the president's words for foreign guests|to interpret is to explain what something means; to interrupt is to stop someone speaking|interpret 是解读、口译；interrupt 是打断|interrupt/interrupted/interrupts=interrupt means to stop someone while they are speaking, not to explain or translate what they mean=interrupt 是打断别人说话，不是解释或翻译其意思;ignore/ignored/ignores=ignore means to pay no attention, the opposite of working out what something means=ignore 是不理会，和弄清意思正相反|in · ter · pret|inter + pret|inter + pret
      clarify|explaining what you mean when someone doesn't understand;a position explained more clearly;a point made so nobody misunderstands|to clarify is to make clearer; to confuse is to make harder to understand|clarify 是澄清；confuse 是使困惑|classify/classified=classify means to put things into groups, not to make something easier to understand=classify 是分类，不是让事情更好懂;confuse/confused=confuse means to make something harder to understand, the opposite of explaining clearly=confuse 是让人糊涂，和解释清楚正相反|clar · i · fy|clear with ea changed to a, then -ify|把 clear 的 ea 改成 a，再加 -ify
      elaborate|giving more details;saying only yes and nothing more;describing each plan in detail|to elaborate is to give more details; to collaborate is to work together|elaborate 是详细说明；collaborate 是合作|collaborate/collaborated=collaborate means to work together with other people, not to give more details=collaborate 是与别人合作，不是补充细节;evaporate/evaporated=evaporate means to turn from liquid into gas, not to say more about something=evaporate 是蒸发，不是详细说明|e · lab · o · rate|e + labor + ate|e + labor + ate
      categorize|books grouped as history, science and art;animals grouped by meat, plants or both;music that might be jazz, pop or folk|to categorize is to put things into groups; to criticize is to say what is wrong|categorize 是归类；criticize 是批评|criticize/criticized=criticize means to say what is bad about something, not to put things into groups=criticize 是批评，不是分组归类;memorize/memorized=memorize means to learn something so you remember it, not to put things into groups=memorize 是背下来，不是分组归类|cat · e · go · rize|category with the y changed to -ize|把 category 的 y 改成 -ize
      classify|plants put in families by their flowers;documents only a few officials may read;a storm named a hurricane|to classify is to put into groups or make officially secret; to clarify is to make clearer|classify 是分类、列为机密；clarify 是澄清|clarify/clarified=clarify means to make something easier to understand, not to put it into a group or keep it secret=clarify 是澄清，不是归类或保密;glorify/glorified=glorify means to praise something as wonderful, not to put it into a group=glorify 是美化、颂扬，不是归类|clas · si · fy|class + ify|class + ify
      distinguish|twins who might look exactly alike;red and green that look the same;what makes a phone different|to distinguish is to see a difference; to confuse is to mix things up|distinguish 是辨别；confuse 是混淆|extinguish/extinguishes=extinguish means to put out a fire or a light, not to see a difference=extinguish 是熄灭，不是辨别差异;confuse/confuses=confuse means to mix two things up, the opposite of seeing or making a difference between them=confuse 是混淆，和辨别差异正相反|dis · tin · guish|dis + tin + guish|dis + tin + guish
      differentiate|facts and opinions and which is which;adults and children treated the same;two products that look almost the same|to differentiate is to see or show a difference; to combine is to join things together|differentiate 是区分；combine 是结合|confuse/confuses=confuse means to mix things up, the opposite of seeing which is which or what makes things different=confuse 是混淆，和分清彼此正相反;combine/combines=combine means to join things together, the opposite of seeing what makes them different=combine 是结合，和看出区别正相反|dif · fer · en · ti · ate|different + iate, with ti said like *sh*|different + iate，ti 读作 *sh*
      integrate|a calendar and email working together;new pupils feeling part of a school;theory and practice combined in each lesson|to integrate is to combine things or help people become part of a group; to separate is to keep them apart|integrate 是整合、融入；separate 是分开|separate/separates=separate means to keep things or people apart, the opposite of making them work together or feel part of a group=separate 是分开，和协同工作或融入群体正相反;interrogate/interrogates=interrogate means to ask someone many questions, often in a police station, not to combine things=interrogate 是审问，不是整合|in · te · grate|integr + ate|integr + ate
      synthesize|research combined into one argument;a drug made by chemists from simple substances;sources combined instead of listed|to synthesize is to combine into a whole or to make by chemistry; to separate is to break apart|synthesize 是综合、合成；separate 是分开|separate/separates/separated=separate means to break things apart, the opposite of combining them or making something new from them=separate 是分开，和组合或合成新东西正相反;copy/copies/copied=copy means to make the same thing again, not to combine sources into a new whole=copy 是照抄，不是综合成新的整体|syn · the · size|synthesis with -sis changed to -size|把 synthesis 的 -sis 改成 -size
      formulate|working out every detail of a policy;a theory tested on hundreds of people;an answer prepared before speaking|to formulate is to develop a plan or an idea carefully; to forget is to stop remembering it|formulate 是构想、表述；forget 是忘记|stimulate/stimulating/stimulated=stimulate means to make something more active, not to develop a plan or an idea carefully=stimulate 是刺激、激发，不是精心构想计划或观点;forget/forgetting/forgot=forget means to stop remembering, the opposite of working out a policy, a theory or an answer=forget 是忘记，和构想政策、理论或答案正相反|for · mu · late|formula + te|formula + te
      generalize|one rude waiter and everyone in Paris;whole nations judged from a few people;all teenagers called lazy because of one son|to generalize is to say something is true of a group from a few examples; to specialize is to focus on one area|generalize 是以偏概全；specialize 是专攻|apologize=apologize means to say sorry, not to judge a whole group from a few examples=apologize 是道歉，不是以少数例子评判整个群体;specialize=specialize means to focus on one subject or area, not to say something is true of everyone=specialize 是专攻某领域，不是断言所有人都如此;hesitate=hesitate means to pause before acting, not to judge whole nations from a few people=hesitate 是犹豫，不是凭少数人评判整个国家|gen · er · al · ize|general + ize|general + ize
      infer|what data shows about sales;a smile that showed she had passed;clues in the text about the writer's meaning|to infer is to work out an opinion from facts; to imply is to suggest it|infer 是推断；imply 是暗示|imply/implied=imply is what the writer or the facts do when they suggest something, not what you do when you work it out=imply 是作者或事实暗示某事，不是你从中推断;hide/hid=hide means to keep something out of sight, not to work out an opinion from facts=hide 是藏起来，不是根据事实推断|in · fer|in + fer, with inferred doubling the r|in + fer，inferred 双写 r
    `,
  },
});

const online = vocabularyTopic({
  id: "b2-words-digital-learning",
  title: t("Digital Learning", "数字化学习"),
  summary: t(
    "E-learning and virtual classes; webinars and modules; interactive and self-paced courses; tutorials and forums; distractions and multitasking; bandwidth; hybrid learning.",
    "在线学习和虚拟课堂；网络研讨会和模块；互动的和自定进度的课程；教程和论坛；干扰和一心多用；带宽；混合式学习。",
  ),
  intro: t(
    "My course is **self-paced**: I watch a **tutorial**, finish each **module** and ask questions on the **forum**. These words help you talk about studying online and the tools and problems that come with it.",
    "我的课程是 **self-paced**（自定进度的）：我看 **tutorial**（教程），学完每个 **module**（模块），再到 **forum**（论坛）上提问。这些词帮你谈论在线学习，以及随之而来的工具和问题。",
  ),
  prerequisites: ["b1-words-digital"],
  words: [
    word(
      "e-learning",
      "learning that is done on a computer or online",
      "在线学习；电子学习",
      "The company offers {e-learning} for its staff: online courses they can take at their desks. | {E-learning} lets you study online at home.|E-mailing Earning | Many teachers had to switch to {e-learning} in 2020, teaching their classes online.",
      "e-mailing earning",
    ),
    word(
      "virtual",
      "existing on a computer or online, not in the real world",
      "虚拟的；（网上）进行的",
      "We had a {virtual} meeting with the team in Tokyo over the internet. | The museum offers a {virtual} tour that you can take online from home. | {Virtual} reality headsets, which show a world made by computers, are getting cheaper.|Visual Face-to-face",
      "visual face-to-face",
    ),
    word(
      "webinar webinars",
      "a seminar or a talk that people join online",
      "网络研讨会",
      "Join our free {webinar} on Tuesday from your computer at home. | She gives {webinars} on marketing to people who watch online.|seminars websites | Over five hundred people joined the {webinar} online from around the world.",
      "seminar website",
      "tutorial",
    ),
    word(
      "module modules",
      "one unit of a course that you can study on its own",
      "（课程的）模块；单元",
      "The course has six {modules}, each a unit you can study on its own.|models nodules | I've finished the first {module} of the course and started the second. | Each {module} of the course ends with a test.",
      "model nodule",
    ),
    word(
      "interactive",
      "letting people and computers act on each other; involving people talking and working together",
      "互动的；交互式的",
      "The museum has {interactive} displays that children can touch and play with. | The lessons are lively and {interactive}, with students talking and working together. | Use the {interactive} map, which responds when you click on it, to plan your trip.",
      "inactive passive",
    ),
    word(
      "self-paced",
      "letting each learner go at their own speed",
      "自定进度的",
      "The course is {self-paced}, so you can finish it in a week or a year. | {Self-paced} learning, where you choose your own speed, suits busy adults.|Self-made Timed | The training is online and {self-paced}: there are no deadlines.",
      "self-made timed",
    ),
    word(
      "tutorial tutorials",
      "a lesson that teaches you step by step; a class with a teacher and a small group",
      "教程；（大学）辅导课",
      "I learned to cook from online {tutorials} showing each step of a recipe.|editorials trailers | Watch the video {tutorial} first: it shows you step by step how to set up the app. | Students meet their tutor in small weekly {tutorials}.|editorials trailers",
      "editorial trailer",
      "webinar",
    ),
    word(
      "forum forums",
      "a website where people discuss a subject; a meeting for discussion",
      "论坛",
      "I posted my question on the course {forum}, and other students answered it. | The {forum} has a thousand members who discuss gardening online. | Online {forums} help students support each other by discussing problems.|forms foremen",
      "form foreman",
    ),
    word(
      "distraction distractions",
      "something that takes your attention away from what you are doing",
      "使人分心的事物",
      "Phones are a big {distraction} in class: students look at them instead of listening. | I need a quiet room with no {distractions} so that I can concentrate.|destructions abstractions | Work is a welcome {distraction} that takes my mind off my problems.",
      "destruction abstraction",
    ),
    word(
      "multitask multitasks multitasked multitasking",
      "to do several things at the same time",
      "一心多用；同时做多件事",
      "Some people can {multitask}, doing several things at once, but most can't. | {Multitasking}, doing two jobs at the same time, makes you slower.|Concentrating Multiplying | She {multitasks} by answering emails during meetings.|concentrates multiplies",
      "concentrate multiply",
    ),
    word(
      "bandwidth",
      "the amount of data an internet connection can carry; the time and energy someone has",
      "带宽；精力",
      "Video calls need a lot of {bandwidth} to carry all that data. | Schools in the countryside have low {bandwidth}, so videos load slowly. | I don't have the {bandwidth} for another project: I have no time or energy left.",
      "bandstand wavelength",
    ),
    word(
      "hybrid",
      "made of two different things mixed together, such as online and in-person learning",
      "混合的；混合物",
      "The school uses a {hybrid} model, mixing two days online with three in class. | They drive a {hybrid} car that runs on both petrol and electricity. | The plant is a {hybrid} of two roses, mixing the colors of both.",
      "uniform humid",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Webinar*, *tutorial* and *forum* are all online, but a *webinar* is a live talk people join, a *tutorial* teaches step by step, and a *forum* is a place for written discussion. Ask what people do in the sentence: join, follow or post.",
        "*webinar*、*tutorial* 和 *forum* 都在网上，但 *webinar* 是人们加入的直播讲座，*tutorial* 一步步教你，*forum* 是书面讨论的地方。想想句子里的人是在加入、跟着学，还是发帖。",
      ),
      meaning: t(
        "*Virtual* means existing online instead of in the real world, while *hybrid* means a mix of two things, such as online and in-person learning. Check whether the meaning says only online or a mix.",
        "*virtual* 指存在于网上而非现实中，*hybrid* 指两种东西的混合，比如线上和线下学习。看释义说的是只在网上，还是两者混合。",
      ),
      spell: t(
        "*E-learning* and *self-paced* both have a hyphen, *bandwidth* is band + width, and *module* ends in -ule.",
        "*e-learning* 和 *self-paced* 都有连字符，*bandwidth* 是 band + width，*module* 以 -ule 结尾。",
      ),
    },
    notes: `
      e-learning|online courses taken at desks;studying online at home;teachers teaching classes online|e-learning is learning on a computer or online; e-mailing is sending messages|e-learning 是在线学习；e-mailing 是发邮件|e-mailing/E-mailing=e-mailing is sending messages by email, not studying or teaching online courses=e-mailing 是发电子邮件，不是在线学习或授课;earning/Earning=earning is getting money for work, not learning online=earning 是挣钱，不是在线学习|e · learn · ing|e + hyphen + learning|e + 连字符 + learning
      virtual|a meeting over the internet;a museum tour taken online from home;a world made by computers|virtual means existing online; face-to-face means in the same room|virtual 是虚拟的、线上的；face-to-face 是面对面的|visual=visual means connected with seeing, not existing online instead of in real life=visual 是视觉的，不是存在于网上而非现实中;face-to-face/Face-to-face=face-to-face means meeting in the same place, the opposite of over the internet or in a world made by computers=face-to-face 是当面的，和通过网络或电脑虚构的世界正相反|vir · tu · al|virtu + al|virtu + al
      webinar|a free talk joined from a computer at home;marketing talks people watch online;five hundred people joining online|a webinar is a talk joined online; a seminar is a class held in a room|webinar 是网络研讨会；seminar 是研讨课|seminar/seminars=seminar is a small class that meets in a room, not a talk joined from home on a computer=seminar 是在教室里上的小班课，不是在家用电脑加入的讲座;website/websites=website is a set of pages on the internet, not a talk that people join on a day=website 是网站，不是人们在某天加入的讲座|web · i · nar|web + seminar without the sem|web + inar，取自 seminar 去掉 sem
      module|six units of a course;the first unit of a course before the second;a unit of a course that ends with a test|a module is one unit of a course; a model is a copy or an example|module 是模块、单元；model 是模型|model/models=model is a small copy of something or a person who shows clothes, not a unit of a course=model 是模型或模特，不是课程单元;nodule/nodules=nodule is a small lump, for example on a plant or in the body, not part of a course=nodule 是小结节，不是课程的一部分|mod · ule|mod + ule|mod + ule
      interactive|displays children can touch and play with;lessons with students talking and working together;a map that responds to clicks|interactive means acting on each other; passive means only watching|interactive 是互动的；passive 是被动的|inactive=inactive means not doing anything, the opposite of displays you play with or lessons full of talk=inactive 是不活动的，和可玩的展品或充满讨论的课堂正相反;passive=passive means only watching or listening, the opposite of touching, talking or clicking=passive 是只看只听的，和动手、交谈或点击正相反|in · ter · ac · tive|inter + active|inter + active
      self-paced|finishing a course in a week or a year;choosing your own speed;training with no deadlines|self-paced means at your own speed; timed means with a fixed time|self-paced 是自定进度的；timed 是限时的|self-made/Self-made=self-made describes a person who became rich by their own work, not a course where you choose your speed=self-made 形容白手起家的人，不形容自定进度的课程;timed/Timed=timed means with a fixed time to finish, the opposite of no deadlines or your own speed=timed 是限时的，和没有截止日期、自定速度正相反|self · paced|self + hyphen + paced|self + 连字符 + paced
      tutorial|online lessons showing each step of a recipe;a video showing step by step how to set up an app;small weekly classes with a tutor|a tutorial teaches step by step; an editorial gives a newspaper's opinion|tutorial 是教程、辅导课；editorial 是社论|editorial/editorials=editorial is a newspaper article giving the editor's opinion, not a lesson that teaches step by step=editorial 是表达编辑观点的社论，不是一步步教学的课;trailer/trailers=trailer is a short film showing parts of a new film, not a lesson=trailer 是电影预告片，不是课|tu · to · ri · al|tutor + ial|tutor + ial
      forum|a question that other students answered;a thousand members discussing gardening online;students discussing problems online|a forum is a place for discussion; a form is a paper you fill in|forum 是论坛；form 是表格|form/forms=form is a paper or page with spaces you fill in, not a place where people discuss and answer each other=form 是要填写的表格，不是大家讨论、互相回答的地方;foreman/foremen=foreman is a person in charge of a group of workers, not a place for discussion=foreman 是工头，不是讨论的地方|fo · rum|fo + rum|fo + rum
      distraction|phones that students look at instead of listening;things that stop you concentrating;work that takes your mind off problems|a distraction takes your attention away; destruction is great damage|distraction 是让人分心的事；destruction 是破坏|destruction/destructions=destruction is great damage, not something that takes your attention away=destruction 是严重破坏，不是让人分心的事物;abstraction/abstractions=abstraction is a general idea, not something that takes your mind off what you are doing=abstraction 是抽象概念，不是让人分心的事物|dis · trac · tion|dis + traction|dis + traction
      multitask|doing several things at once;doing two jobs at the same time;answering emails during meetings|to multitask is to do several things at once; to concentrate is to focus on one|multitask 是一心多用；concentrate 是专心|concentrate/Concentrating/concentrates=concentrate means to focus on one thing, the opposite of doing several things at once=concentrate 是专注于一件事，和同时做几件事正相反;multiply/Multiplying/multiplies=multiply means to do a sum like 3 times 4, or to grow in number, not to do several jobs at once=multiply 是做乘法或数量倍增，不是同时做几件事|mul · ti · task|multi + task|multi + task
      bandwidth|data carried for video calls;slow videos in country schools;no time or energy left for another project|bandwidth is how much data a connection carries, or how much time and energy you have; a wavelength is the size of a wave|bandwidth 是带宽、精力；wavelength 是波长|bandstand=bandstand is a covered stage in a park for music, not data or energy=bandstand 是公园里的露天音乐台，不是数据或精力;wavelength=wavelength is the distance between waves of light or sound, not the data a connection can carry or your energy=wavelength 是波长，不是网速或精力|band · width|band + width|band + width
      hybrid|two days online and three in class;a car running on petrol and electricity;a plant mixing two roses|hybrid means a mix of two things; uniform means all the same|hybrid 是混合的；uniform 是统一的|uniform=uniform means all of one kind, the opposite of mixing online with class, petrol with electricity or two roses=uniform 是单一不变的，和线上线下结合、油电混合或两种玫瑰杂交正相反;humid=humid describes warm, wet air, not a mix of two things=humid 形容空气湿热，不是两种东西的混合|hy · brid|hy + brid, with y said like *eye*|hy + brid，y 读作 *eye*
    `,
  },
});

const vocations = vocabularyTopic({
  id: "b2-words-vocations",
  title: t("Vocations", "职业与志向"),
  summary: t(
    "Vocational training, professions and occupations; apprenticeships; aspiring and aspirations; pursuing and fulfilling a dream; devoted and dedicated workers; rewarding work; a vocation.",
    "职业培训、专业职业和职业；学徒期；渴望和抱负；追求和实现梦想；全心投入和敬业的员工；有回报的工作；天职。",
  ),
  intro: t(
    "After a **vocational** course and a long **apprenticeship**, Mei finally **fulfilled** her dream of running a bakery, and she finds the work deeply **rewarding**. These words help you talk about jobs, the training for them and what people hope to get from their work.",
    "读完 **vocational**（职业技能的）课程、经过漫长的 **apprenticeship**（学徒期）后，梅终于 **fulfilled**（实现了）开面包店的梦想，她觉得这份工作非常 **rewarding**（有意义、值得）。这些词帮你谈论工作、职业培训，以及人们希望从工作中得到什么。",
  ),
  prerequisites: ["b1-words-jobs-3"],
  words: [
    word(
      "vocational",
      "teaching the skills needed for a particular job",
      "职业的；职业技能的",
      "She went to a college that offers {vocational} training, and she now works as a chef. | {Vocational} training, learning the skills for a job, prepares you for work.|Vocal Academic | The school offers {vocational} courses in practical trades like plumbing.",
      "vocal academic",
      "vocation",
    ),
    word(
      "profession professions",
      "a job that needs special training and education, such as law or medicine",
      "（需专门训练的）职业",
      "Teaching is a respected {profession} that needs years of training. | She is a lawyer by {profession}. | Doctors and nurses belong to the medical {professions}.|processions confessions",
      "procession confession",
      "occupation",
    ),
    word(
      "occupation occupations",
      "a job; the act of taking control of a country by an army",
      "职业；占领",
      "Please write your name and {occupation}, the job you do, on the form. | Farming is the main {occupation} in the region: most people work on farms. | The {occupation} of the city by enemy soldiers lasted four years.",
      "occasion vacation",
      "profession",
    ),
    word(
      "apprenticeship apprenticeships",
      "a time of training for a job, working with someone who has the skill",
      "学徒期；学徒身份",
      "He did a three-year {apprenticeship}, learning the job from a skilled electrician. | {Apprenticeships} let young people earn money while they learn a trade.|Partnerships Appreciations | She is now in the second year of her {apprenticeship} with a builder who is teaching her the trade.",
      "partnership appreciation",
    ),
    word(
      "aspire aspires aspired aspiring",
      "to want very much to achieve something",
      "渴望；立志",
      "She {aspires} to be a surgeon and studies hard to reach that goal.|refuses hesitates | Many young people {aspire} to work abroad one day: it is their dream. | He has always {aspired} to write, dreaming of publishing his first novel.|refused hesitated",
      "refuse hesitate",
      "aspiration",
    ),
    word(
      "aspiration aspirations",
      "a strong wish to achieve something",
      "抱负；渴望",
      "She has {aspirations} to become a politician one day.|inspirations respirations | His main {aspiration}, the thing he most wants, is to own a farm. | Parents should support their children's {aspirations} and help them reach their goals.|inspirations respirations",
      "inspiration respiration",
      "aspire",
    ),
    word(
      "pursue pursues pursued pursuing",
      "to try to achieve something over a long time; to follow someone to catch them",
      "追求；追赶",
      "She left her job to {pursue} a career in music. | The police {pursued} the thief through the streets until they caught him.|perused persuaded | He is {pursuing} a degree in law, which will take four years.|perusing persuading",
      "peruse persuade",
    ),
    word(
      "fulfill fulfills fulfilled fulfilling",
      "to achieve something you wanted; to do what is needed or promised",
      "实现；履行；使满足",
      "He finally {fulfilled} his dream of flying when he became a pilot.|refilled abandoned | Teaching is {fulfilling}: it makes me happy every day.|refilling abandoning | You must {fulfill} all the conditions before you can get the loan.",
      "refill abandon",
    ),
    word(
      "devoted",
      "loving or caring about someone or something very much; giving a lot of time to something",
      "全心全意的；挚爱的",
      "She is a {devoted} mother who would do anything for her children. | He is so {devoted} that he works late every night. | The {devoted} fans waited outside in the rain for hours to see the band.",
      "developed neglectful",
      "dedicated",
    ),
    word(
      "rewarding",
      "giving satisfaction, though not always much money",
      "有回报的；值得做的",
      "Nursing is hard but {rewarding} work: it makes you feel you have helped people. | It was a very {rewarding} experience that I will always be proud of. | Teaching children is deeply {rewarding}, even though the pay is low.",
      "regarding boring",
    ),
    word(
      "dedicated",
      "working very hard because you care; used only for one purpose",
      "敬业的；专用的",
      "The nurses are hard-working and {dedicated}, caring deeply about their patients. | There is a {dedicated} lane used only by buses. | She is a {dedicated} teacher who stays late to help her students.",
      "lazy medicated",
      "devoted",
    ),
    word(
      "vocation vocations",
      "a strong feeling that you should do a particular job; a job you do because of this",
      "天职；使命感",
      "Medicine is her {vocation}, not just a job: she feels she was born to do it. | He found his {vocation} as a teacher and has loved the work ever since. | Nursing is a {vocation} for many people, who feel called to care for others.",
      "vacation vocalist",
      "vocational",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Aspire* and *pursue* are both about goals, but you *aspire* to something you wish for, while you *pursue* it by working towards it over time. Ask whether the sentence is about wishing or about doing.",
        "*aspire* 和 *pursue* 都与目标有关，但 *aspire* 是渴望某事，*pursue* 是长期为之努力。想想句子说的是愿望还是行动。",
      ),
      meaning: t(
        "*Profession* and *occupation* both mean a job, but a *profession* needs long special training, and *occupation* can also mean an army taking control of a place. Check which of these the meaning gives.",
        "*profession* 和 *occupation* 都指职业，但 *profession* 需要长期专门训练，*occupation* 还可指军队占领某地。看释义给的是哪一种。",
      ),
      spell: t(
        "*Fulfill* has a single l in the middle and a double l at the end, *pursue* starts with pur-, and *apprenticeship* is apprentice + ship.",
        "*fulfill* 中间只有一个 l，结尾双写 l，*pursue* 以 pur- 开头，*apprenticeship* 是 apprentice + ship。",
      ),
    },
    notes: `
      vocational|a college for training as a chef;learning the skills for a job;courses in practical trades like plumbing|vocational means teaching the skills for a job; academic means about study and theory|vocational 是职业技能的；academic 是学术的|vocal/Vocal=vocal means connected with the voice or saying your opinions loudly, not training for a job=vocal 是嗓音的或直言的，不是职业培训;academic/Academic=academic means about study and theory at school or university, not practical training for a trade=academic 是学术理论的，不是行业的实用培训|vo · ca · tion · al|vocation + al|vocation + al
      profession|teaching that needs years of training;a lawyer by training and work;the medical jobs of doctors and nurses|a profession is a job needing special training; a procession is a line of people moving along|profession 是专业职业；procession 是游行队伍|procession/processions=procession is a line of people walking or driving slowly in a ceremony, not a job=procession 是仪式中缓缓行进的队伍，不是职业;confession/confessions=confession is admitting you did something wrong, not a job=confession 是认罪、坦白，不是职业|pro · fes · sion|pro + fession, with a double s|pro + fession，双写 s
      occupation|the job you write on a form;farming as most people's work;enemy soldiers controlling a city|an occupation is a job or an army taking control of a place; an occasion is a special event|occupation 是职业、占领；occasion 是场合|occasion=occasion is a special event or a time when something happens, not a job or soldiers controlling a city=occasion 是场合或时机，不是职业或军队占领;vacation=vacation is a holiday away from work, not a job or an army's control=vacation 是假期，不是职业或军事占领|oc · cu · pa · tion|occupy with the y changed to -ation|把 occupy 的 y 改成 -ation
      apprenticeship|learning from a skilled electrician;earning money while learning a trade;training with a builder|an apprenticeship is training on the job with a skilled worker; a partnership is a business shared by equals|apprenticeship 是学徒期；partnership 是合伙关系|partnership/Partnerships=partnership is a business owned by two or more equal people, not training under a skilled worker=partnership 是平等的合伙经营，不是跟着师傅学手艺;appreciation/Appreciations=appreciation is being grateful or seeing the value of something, not training for a job=appreciation 是感激或欣赏，不是职业培训|ap · pren · tice · ship|apprentice + ship|apprentice + ship
      aspire|studying hard to become a surgeon;working abroad as a dream;dreaming of publishing a first novel|to aspire is to want very much to achieve something; to refuse is to say no|aspire 是渴望、立志；refuse 是拒绝|refuse/refuses/refused=refuse means to say you will not do something, the opposite of a dream or a goal you work for=refuse 是拒绝，和梦想或努力的目标正相反;hesitate/hesitates/hesitated=hesitate means to pause because you are not sure, not to want something very much=hesitate 是犹豫，不是强烈渴望|as · pire|a + spire|a + spire
      aspiration|hopes of becoming a politician;the thing he most wants;children's goals parents should support|an aspiration is a strong wish to achieve something; inspiration is something that gives you ideas|aspiration 是抱负；inspiration 是灵感|inspiration/inspirations=inspiration is something that gives you new ideas, not the goal you want to reach=inspiration 是灵感来源，不是要实现的目标;respiration/respirations=respiration is breathing, not a wish to achieve something=respiration 是呼吸，不是抱负|as · pi · ra · tion|aspire with the e dropped, then -ation|aspire 去掉 e，再加 -ation
      pursue|a career in music after leaving a job;police chasing a thief until they caught him;four years of studying law|to pursue is to work towards something or chase someone; to persuade is to make someone agree|pursue 是追求、追赶；persuade 是说服|peruse/perused/perusing=peruse means to read something carefully, not to chase a thief or work towards a career=peruse 是仔细阅读，不是追捕小偷或追求事业;persuade/persuaded/persuading=persuade means to make someone agree or do something by talking, not to chase or work towards a goal=persuade 是说服，不是追赶或追求目标|pur · sue|pur + sue|pur + sue
      fulfill|becoming a pilot after dreaming of flying;work that makes someone happy every day;conditions to meet before getting a loan|to fulfill is to achieve a wish or do what is needed; to abandon is to give it up|fulfill 是实现、履行；abandon 是放弃|refill/refilled/refilling=refill means to fill a container again, not to achieve a dream or meet conditions=refill 是再装满，不是实现梦想或满足条件;abandon/abandoned/abandoning=abandon means to give something up, the opposite of achieving a dream or meeting conditions=abandon 是放弃，和实现梦想或满足条件正相反|ful · fill|ful + fill, a single l then a double l|ful + fill，先一个 l，后双写 l
      devoted|a mother who would do anything for her children;working late every night;fans waiting for hours in the rain|devoted means loving or caring very much; neglectful means not caring enough|devoted 是全心全意的；neglectful 是疏忽的|developed=developed means grown or more advanced, not loving or caring very much=developed 是发达的、成熟的，不是全心投入;neglectful=neglectful means not giving enough care, the opposite of doing anything for someone or waiting for hours=neglectful 是疏于照顾的，和愿为人做任何事或苦等几小时正相反|de · vot · ed|devote + d|devote + d
      rewarding|hard work that helps people;an experience to be proud of;teaching children despite low pay|rewarding means giving satisfaction; boring means dull|rewarding 是有回报的、值得的；boring 是无聊的|regarding=regarding means about or on the subject of, not giving satisfaction=regarding 是关于，不是令人满足的;boring=boring means dull and uninteresting, the opposite of work or experiences that make you proud=boring 是乏味的，和让人自豪的工作或经历正相反|re · ward · ing|reward + ing|reward + ing
      dedicated|nurses caring deeply about patients;a lane used only by buses;a teacher staying late to help|dedicated means working hard because you care, or used for one purpose; lazy means not wanting to work|dedicated 是敬业的、专用的；lazy 是懒惰的|lazy=lazy means not wanting to work, the opposite of caring deeply or staying late to help=lazy 是懒惰的，和尽心尽力或留下来帮忙正相反;medicated=medicated means containing medicine, not working hard or used for one purpose=medicated 是含药物的，不是敬业或专用的|ded · i · cat · ed|dedicate + d|dedicate + d
      vocation|feeling born to do medicine;finding a calling as a teacher;feeling called to care for others|a vocation is a job you feel you are meant to do; a vacation is a holiday|vocation 是天职；vacation 是假期|vacation=vacation is a holiday away from work, not a job you feel called to do=vacation 是假期，不是感到使命所在的工作;vocalist=vocalist is a singer, not a feeling that you should do a job=vocalist 是歌手，不是对某份工作的使命感|vo · ca · tion|o after the v, not *vacation*|v 后面是 o，别写成 *vacation*
    `,
  },
});

const character = vocabularyTopic({
  id: "b2-words-character",
  title: t("Character", "品格"),
  summary: t(
    "Determination and persistence; patience and integrity; humility and humble people; arrogance; courage and courageous acts; self-discipline; compassion and compassionate people.",
    "决心和毅力；耐心和正直；谦逊和谦虚的人；傲慢；勇气和勇敢的行为；自律；同情心和富有同情心的人。",
  ),
  intro: t(
    "After the accident Tom learned to walk again through **determination** and **patience**, yet he stayed **humble** and thanked the nurses for their **compassion**. These words help you describe the qualities that make a person strong, good and easy to trust.",
    "事故之后，汤姆凭着 **determination**（决心）和 **patience**（耐心）重新学会走路，但他依然 **humble**（谦虚），感谢护士们的 **compassion**（同情与关怀）。这些词帮你描述让人坚强、善良、值得信任的品质。",
  ),
  prerequisites: ["b1-words-personality"],
  words: [
    word(
      "determination",
      "the quality of continuing to try to do something even when it is difficult",
      "决心；坚定",
      "With hard work and {determination}, she never gave up and became a doctor. | His {determination} to win, even after falling twice, impressed everyone. | She showed great {determination} after the accident and learned to walk again.",
      "termination hesitation",
      "persistence",
    ),
    word(
      "persistence",
      "continuing to try to do something although it is difficult",
      "坚持不懈；毅力",
      "Learning a language takes {persistence}: you must keep going for years. | His {persistence} finally paid off: after ten tries he passed. | Thanks to her {persistence}, after years of letters and meetings, the law was changed.",
      "resistance laziness",
      "determination",
    ),
    word(
      "patience",
      "the ability to wait or to deal with problems without getting angry",
      "耐心",
      "Teaching young children takes {patience}: you must stay calm and wait. | I'm losing my {patience}: I've been waiting for an hour! | Thank you for your {patience} while you waited.",
      "patients passion",
    ),
    word(
      "integrity",
      "the quality of being honest and having strong moral principles",
      "正直；诚实",
      "She is a woman of great {integrity} who never lies. | Nobody doubts the judge's {integrity}: she has always been honest and fair. | He refused the bribe and kept his {integrity}.",
      "intensity dishonesty",
    ),
    word(
      "humility",
      "the quality of not thinking you are better than others",
      "谦逊；谦卑",
      "Despite his fame, he spoke with {humility}, never boasting. | Great leaders show {humility} and admit what they don't know. | She accepted the prize with {humility}, thanking her whole team.",
      "arrogance humidity",
      "humble",
    ),
    word(
      "humble humbler humblest",
      "not thinking you are better than others; poor and simple",
      "谦虚的；卑微的",
      "He remained {humble} after winning the prize and never boasted. | Her family was poor and {humble}: they were farmers with very little land.|wealthy humid | Be {humble} enough to admit your mistakes.",
      "arrogant humid",
      "humility",
    ),
    word(
      "arrogant",
      "behaving as if you are better or more important than other people",
      "傲慢的；自大的",
      "He is rude and {arrogant}, always saying he is better than us. | It was {arrogant} of her to ignore our advice as if she knew best. | Managers who are {arrogant} never listen to their staff.",
      "humble elegant",
      "humble",
    ),
    word(
      "courage",
      "the ability to do something dangerous or difficult although you are afraid",
      "勇气",
      "It takes {courage} to say no when everyone else says yes. | She showed great {courage} in the fire, going back in to save a child. | He didn't have the {courage} to tell her the truth: he was too afraid.",
      "fear carriage",
      "courageous",
    ),
    word(
      "courageous",
      "brave",
      "勇敢的",
      "Her decision to speak against the powerful king, though she was afraid, was {courageous}. | The {courageous} firefighters ran into the burning building to save the children. | She was {courageous} enough to speak out against her boss.",
      "cowardly contagious",
      "courage",
    ),
    word(
      "self-discipline",
      "the ability to make yourself do things you should do",
      "自律",
      "Working from home needs {self-discipline}: you must make yourself start work on time. | Athletes have great {self-discipline}, training every day even when they're tired. | {Self-discipline}, making yourself do what you should, is the key to success.|Self-defense Self-pity",
      "self-defense self-pity",
    ),
    word(
      "compassion",
      "a strong feeling of sympathy for people who are suffering, and a wish to help them",
      "同情心；怜悯",
      "The nurse treated everyone with {compassion}, kindly helping those in pain. | Show some {compassion}: he has just lost his job and needs help. | Her {compassion} for the poor led her to start a charity.",
      "cruelty compression",
      "compassionate",
    ),
    word(
      "compassionate",
      "feeling or showing sympathy for people who are suffering",
      "富有同情心的",
      "She is a kind and {compassionate} doctor who feels for her patients. | The judge made a {compassionate} decision, letting the sick old man go home. | He was given {compassionate} leave when his mother died.",
      "cruel heartless",
      "compassion",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Humble* and *arrogant* are opposites: a *humble* person does not think they are better than others, while an *arrogant* one does. Ask whether the person in the sentence boasts or stays modest.",
        "*humble* 和 *arrogant* 意思相反：*humble* 的人不觉得自己高人一等，*arrogant* 的人却这样认为。想想句子里的人是在炫耀还是保持谦逊。",
      ),
      meaning: t(
        "*Courage* is the noun for the ability to act when you are afraid, while *courageous* is the adjective for a brave person or act. Check whether the meaning names an ability or describes someone.",
        "*courage* 是名词，指害怕时仍能行动的能力，*courageous* 是形容勇敢的人或行为的形容词。看释义是在说一种能力还是在形容人。",
      ),
      spell: t(
        "*Patience* ends in -ence, unlike *patients*, *courageous* keeps the e of *courage*, and *self-discipline* has a hyphen.",
        "*patience* 以 -ence 结尾，和 *patients* 不同，*courageous* 保留 *courage* 的 e，*self-discipline* 有连字符。",
      ),
    },
    notes: `
      determination|never giving up on becoming a doctor;wanting to win even after falling twice;learning to walk again after an accident|determination is continuing to try when things are hard; hesitation is pausing because you are unsure|determination 是决心；hesitation 是犹豫|termination=termination is the ending of something, such as a contract, not continuing to try=termination 是终止，不是坚持努力;hesitation=hesitation is pausing because you are unsure, the opposite of never giving up=hesitation 是犹豫不决，和永不放弃正相反|de · ter · mi · na · tion|determine with the e dropped, then -ation|determine 去掉 e，再加 -ation
      persistence|keeping going with a language for years;passing after ten tries;years of letters and meetings to change a law|persistence is trying again and again; resistance is fighting against something|persistence 是坚持不懈；resistance 是抵抗|resistance=resistance is fighting against something or refusing to accept it, not trying again and again to reach a goal=resistance 是抵抗或抗拒，不是为达目标一再尝试;laziness=laziness is not wanting to work, the opposite of keeping going for years or trying ten times=laziness 是懒惰，和坚持多年或尝试十次正相反|per · sis · tence|persist + ence|persist + ence
      patience|staying calm and waiting with young children;waiting for an hour;waiting without complaint|patience is waiting calmly; passion is a strong feeling|patience 是耐心；passion 是激情|patients=patients are people treated by a doctor, not the ability to wait calmly=patients 是病人，不是平静等待的能力;passion=passion is a very strong feeling, such as love or excitement, not staying calm while you wait=passion 是强烈的情感，不是平静地等待|pa · tience|pa + tience, ending in -ence, not *patients*|pa + tience，以 -ence 结尾，别写成 *patients*
      integrity|a woman who never lies;a judge who has always been honest and fair;refusing a bribe|integrity is being honest and having strong principles; dishonesty is lying|integrity 是正直；dishonesty 是不诚实|intensity=intensity is how strong or extreme something is, not being honest=intensity 是强度，不是诚实正直;dishonesty=dishonesty is lying or cheating, the opposite of never lying or refusing a bribe=dishonesty 是不诚实，和从不说谎、拒绝贿赂正相反|in · teg · ri · ty|integr + ity|integr + ity
      humility|speaking without boasting despite fame;admitting what you don't know;thanking the whole team for a prize|humility is not thinking you are better than others; arrogance is thinking you are|humility 是谦逊；arrogance 是傲慢|arrogance=arrogance is thinking you are better than others, the opposite of not boasting or admitting what you don't know=arrogance 是傲慢，和不炫耀、承认无知正相反;humidity=humidity is the amount of water in the air, not a quality of a person=humidity 是空气湿度，不是人的品质|hu · mil · i · ty|humil + ity|humil + ity
      humble|never boasting after a prize;a poor farming family with very little land;admitting your mistakes|humble means modest or poor and simple; arrogant means thinking you are better|humble 是谦虚的、卑微的；arrogant 是傲慢的|arrogant=arrogant means thinking you are better than others, the opposite of never boasting or admitting mistakes=arrogant 是傲慢的，和从不炫耀、承认错误正相反;wealthy=wealthy means rich, the opposite of a poor family with very little land=wealthy 是富有的，和土地很少的贫穷家庭正相反;humid=humid describes warm, wet air, not a person or a family=humid 形容空气湿热，不形容人或家庭|hum · ble|hum + ble|hum + ble
      arrogant|always saying he is better than us;ignoring advice as if she knew best;managers who never listen to staff|arrogant means acting as if you are better than others; humble means modest|arrogant 是傲慢的；humble 是谦虚的|humble=humble means modest and not thinking you are better, the opposite of saying you are better or ignoring advice=humble 是谦虚的，和自称高人一等或无视建议正相反;elegant=elegant means graceful and stylish, not acting as if you are better than others=elegant 是优雅的，不是自以为高人一等|ar · ro · gant|a double r, then -gant|双写 r，结尾是 -gant
      courage|saying no when everyone else says yes;going back into a fire to save a child;telling the truth despite being afraid|courage is acting although you are afraid; fear is being afraid|courage 是勇气；fear 是恐惧|fear=fear is the feeling of being afraid, the opposite of saying no, going back into a fire or telling the truth=fear 是害怕，和敢于说不、冲回火场或说出真相正相反;carriage=carriage is a vehicle pulled by horses or part of a train, not a quality of a person=carriage 是马车或车厢，不是人的品质|cour · age|cour + age|cour + age
      courageous|speaking against a powerful king though afraid;firefighters running into a burning building;speaking out against a boss|courageous means brave; cowardly means too afraid to act|courageous 是勇敢的；cowardly 是胆怯的|cowardly=cowardly means too afraid to do what is right, the opposite of speaking out or running into a fire=cowardly 是胆怯的，和直言或冲进火场正相反;contagious=contagious describes an illness that spreads from person to person, not a brave act=contagious 形容会传染的疾病，不形容勇敢的行为|cou · ra · geous|courage + ous, keeping the e|courage + ous，保留 e
      self-discipline|making yourself start work on time at home;training every day even when tired;making yourself do what you should|self-discipline is making yourself do what you should; self-pity is feeling sorry for yourself|self-discipline 是自律；self-pity 是自怜|self-defense/Self-defense=self-defense is protecting yourself from attack, not making yourself work or train=self-defense 是自卫，不是让自己工作或训练;self-pity/Self-pity=self-pity is feeling sorry for yourself, not making yourself do what you should=self-pity 是自怜，不是逼自己做该做的事|self · dis · ci · pline|self + hyphen + discipline|self + 连字符 + discipline
      compassion|kindly helping those in pain;helping a man who has lost his job;starting a charity for the poor|compassion is sympathy and a wish to help; cruelty is wanting to hurt|compassion 是同情心；cruelty 是残忍|cruelty=cruelty is causing pain on purpose, the opposite of kindly helping people who suffer=cruelty 是故意伤害，和善意帮助受苦的人正相反;compression=compression is pressing something into a smaller space, not a feeling for people who suffer=compression 是压缩，不是对受苦者的同情|com · pas · sion|com + passion|com + passion
      compassionate|a doctor who feels for her patients;letting a sick old man go home;time off when a mother died|compassionate means showing sympathy and a wish to help; cruel means wanting to hurt|compassionate 是富有同情心的；cruel 是残忍的|cruel=cruel means causing pain on purpose, the opposite of feeling for patients or letting a sick man go home=cruel 是残忍的，和体恤病人或放病弱老人回家正相反;heartless=heartless means feeling no sympathy, the opposite of feeling for people who suffer=heartless 是冷酷无情的，和体恤受苦的人正相反|com · pas · sion · ate|compassion + ate|compassion + ate
    `,
  },
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
const handPastNows: readonly (readonly [string, string, string, string, string, string, string, string])[] = [
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
const handNowPasts: readonly (readonly [string, string, string, string, string, string, string, string])[] = [
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

/** mixedPeople are the subjects of the generated mixed conditionals, the same in both clauses. */
const mixedPeople = ["I", "you", "she", "he", "we", "they"] as const;

/** pastNowActs are a different past and its result now: base form, past participle and rest of each. */
const pastNowActs: readonly (readonly [string, string, string, string, string, string])[] = [
  ["take", "taken", "the train at six", "be", "been", "at work now"],
  ["learn", "learned", "to drive last year", "have", "had", "more freedom now"],
  ["save", "saved", "the file before the crash", "have", "had", "a copy now"],
  ["go", "gone", "to the doctor last week", "feel", "felt", "better now"],
  ["buy", "bought", "a ticket yesterday", "be", "been", "at the concert now"],
  ["miss", "missed", "the bus this morning", "be", "been", "late now"],
  ["lose", "lost", "the keys last night", "be", "been", "locked out now"],
  ["pack", "packed", "a coat this morning", "be", "been", "warm now"],
  ["sleep", "slept", "well last night", "feel", "felt", "fresh now"],
  ["study", "studied", "harder at school", "have", "had", "more choices now"],
  ["answer", "answered", "the email on Monday", "know", "known", "the plan now"],
  ["join", "joined", "the gym in January", "be", "been", "fitter now"],
  ["skip", "skipped", "lunch today", "be", "been", "hungry now"],
  ["move", "moved", "to the coast last year", "live", "lived", "by the sea now"],
];

/** nowPastActs are a different present and its result in the past: base and past form, rest, then the result. */
const nowPastActs: readonly (readonly [string, string, string, string, string, string])[] = [
  ["be", "were", "less shy", "speak", "spoken", "at the meeting yesterday"],
  ["have", "had", "a phone", "call", "called", "home last night"],
  ["know", "knew", "the way", "drive", "driven", "there last weekend"],
  ["like", "liked", "horror films", "watch", "watched", "the new one last night"],
  ["live", "lived", "nearer", "walk", "walked", "to the party on Saturday"],
  ["be", "were", "fitter", "run", "run", "the marathon last month"],
  ["speak", "spoke", "Italian", "enjoy", "enjoyed", "the tour of Rome last summer"],
  ["have", "had", "more time", "help", "helped", "with the move last week"],
  ["be", "were", "taller", "reach", "reached", "the top shelf this morning"],
  ["own", "owned", "a bike", "cycle", "cycled", "to school yesterday"],
  ["be", "were", "a morning person", "catch", "caught", "the early train today"],
  ["trust", "trusted", "doctors", "see", "seen", "one last month"],
  ["play", "played", "the piano", "join", "joined", "the band last year"],
  ["be", "were", "less afraid of heights", "climb", "climbed", "the tower last week"],
];

/** pastNows are the hand-written mixed conditionals of a different past, then those from people and acts. */
const pastNows = [
  ...handPastNows,
  ...pastNowActs.flatMap(([b, pp, rest, rb, rpp, rr]) => mixedPeople.map((p) => [p, b, pp, rest, p, rb, rpp, rr] as const)),
];

/** nowPasts are the hand-written mixed conditionals of a different present, then those from people and acts. */
const nowPasts = [
  ...handNowPasts,
  ...nowPastActs.flatMap(([b, past, rest, rb, rpp, rr]) => mixedPeople.map((p) => [p, b, past, rest, p, rb, rpp, rr] as const)),
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
  const check = right.includes("would have ")
    ? t(
        "**Check.** Match each half to its own time: present state in the *if*-clause (past simple) + past result (*would have* + past participle).",
        "**检验。** 两半各对各的时间：*if* 从句表现在状态（一般过去时）+ 结果表过去（*would have* + 过去分词）。",
      )
    : t(
        "**Check.** Match each half to its own time: past event in the *if*-clause (*had* + past participle) + present result (*would* + base verb).",
        "**检验。** 两半各对各的时间：*if* 从句表过去事件（*had* + 过去分词）+ 结果表现在（*would* + 动词原形）。",
      );
  return t(`${rule.en}: ${sentence}\n\n${check.en}`, `${rule["zh-CN"]}：${sentence}\n\n${check["zh-CN"]}`);
};

/** whyNotMixed explains a result in the wrong time, will for an imagined past, or had alone. */
const whyNotMixed = (wrong: string): Text => {
  if (wrong.startsWith("would have had "))
    return t(
      `*${wrong}* inserts an extra *had*: *would have* goes straight to the past participle.`,
      `*${wrong}* 多加了一个 *had*：*would have* 后面应直接接过去分词。`,
    );
  if (wrong.startsWith("would have "))
    return t(
      `*${wrong}* places the result in the past, whereas the time clue points to now.`,
      `*${wrong}* 把结果放进了过去，但时间线索指向的是现在。`,
    );
  if (wrong.startsWith("would "))
    return t(
      `*${wrong}* places the result in the present, whereas the time clue points to the past.`,
      `*${wrong}* 把结果放在了现在，但时间线索指向的是过去。`,
    );
  if (wrong.startsWith("will "))
    return t(
      `*${wrong}* is for a real future possibility, not an imagined past condition.`,
      `*${wrong}* 用于真实的将来可能，不能配与过去事实相反的假设。`,
    );
  return t(
    `*${wrong}* states a real earlier past event rather than an imagined result.`,
    `*${wrong}* 说的是过去真实发生的更早动作，不是假设的结果。`,
  );
};

const mixedConditionals: TopicDef = {
  id: "mixed-conditionals",
  title: t("If I Had Studied Medicine, I Would Be a Doctor", "混合条件句"),
  summary: t(
    "If I had studied medicine, I would be a doctor now. If I spoke French, I would have understood the film. A mixed conditional joins an imagined past to a result now, or an imagined present to a result in the past.",
    "If I had studied medicine, I would be a doctor now. If I spoke French, I would have understood the film。混合条件句把想象的过去和现在的结果连在一起，或者把想象的现在和过去的结果连在一起。",
  ),
  intro: t(
    "A past choice can shape today (*If she had taken the scholarship, she would live in Zurich now*), and a present trait can explain a past event (*If I were taller, I would have reached that shelf yesterday*). Mixed conditionals pair the time of each half independently.",
    "过去的选择会影响现在（*If she had taken the scholarship, she would live in Zurich now*），而现在的特质也会影响过去（*If I were taller, I would have reached that shelf yesterday*）。混合条件句让条件和结果各自按自己的时间选动词形式。",
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
        "When an imagined past would change the **present**, the *if*-part is a third conditional and the result is a second conditional:\n\n- *If I **had studied** medicine, I **would be** a doctor now.* (I didn't study it, so I'm not a doctor.)\n- *If we **had bought** that house ten years ago, we **would be** rich now.*\n\nWords such as *now*, *today* and *by now* show that the result is in the present.\n\n> **Watch out.** Do not pull *have* into the result just because the *if*-clause has *had*: when the result is about **now**, use *would* + base verb, not *would have* + past participle.",
        "想象的过去会改变**现在**时，*if* 部分用第三条件句，结果部分用第二条件句：\n\n- *If I **had studied** medicine, I **would be** a doctor now.*（我没学医，所以现在不是医生。）\n- *If we **had bought** that house ten years ago, we **would be** rich now.*\n\n*now*、*today*、*by now* 等词表明结果在现在。中文“要是当年学了医，现在就是医生了”靠“当年”“现在”区分时间，英语则要靠两部分不同的动词形式。\n\n> **注意。** 不要因为 *if* 从句里有 *had* 就顺手把结果也写成 *would have*：结果说的是**现在**，必须用 *would* + 动词原形。",
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
        "When an imagined **present** (something that is always or still true) would have changed the past, the *if*-part is a second conditional and the result is a third conditional:\n\n- *If I **spoke** French, I **would have understood** the film last night.* (I don't speak French, so I didn't understand it.)\n- *If he **were** braver, he **would have asked** her to dance.*\n\nWords such as *yesterday* and *last year* show that the result is in the past, so it takes *would have* + past participle.\n\n> **Watch out.** Do not use plain *would* + base verb when the result is already in the past, and never write *had* alone without *would* (*had understood* states a real past fact).",
        "想象的**现在**（一直或至今仍然如此的情况）本会改变过去时，*if* 部分用第二条件句，结果部分用第三条件句：\n\n- *If I **spoke** French, I **would have understood** the film last night.*（我不会说法语，所以昨晚没看懂。）\n- *If he **were** braver, he **would have asked** her to dance.*\n\n*yesterday*、*last year* 等词表明结果在过去，所以用 *would have* 加过去分词。\n\n> **注意。** 结果发生在过去时不能只用 *would* + 动词原形，也不能省略 *would* 只写 *had*（*had understood* 表示过去真实发生的事）。",
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
        "Write the sentence from the note. The time words tell you which way it mixes:\n\n- A past event with a result *now*: *if I take the job in Tokyo in 2019 → I be in Japan now* becomes *If I had taken the job in Tokyo in 2019, I would be in Japan now.*\n- A present state with a result in the past: *if I speak French → I understand the film last night* becomes *If I spoke French, I would have understood the film last night.*\n\nPut a comma after the *if*-part. You may write *I'd* for *I had* and *I would*, *would've* for *would have*, and *was* for *were* after *I*, *he* and *she*.\n\n> **Watch out.** Check the time of **both** clauses separately before writing—never assume both halves share the same tense.",
        "根据笔记写句子。时间词告诉你怎样混合：\n\n- 过去的事情，结果在*现在*：*if I take the job in Tokyo in 2019 → I be in Japan now* 写成 *If I had taken the job in Tokyo in 2019, I would be in Japan now.*\n- 现在的状态，结果在过去：*if I speak French → I understand the film last night* 写成 *If I spoke French, I would have understood the film last night.*\n\n*if* 部分后面加逗号。可以把 *I had* 和 *I would* 写成 *I'd*，把 *would have* 写成 *would've*，*I*、*he*、*she* 后面的 *were* 也可以写成 *was*。\n\n> **注意。** 动笔前把前后两半的时间分开判断——不要默认两半用同一套时态。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Write a mixed conditional sentence from the note.", "根据笔记写一个混合条件句。"),
        mixedTyped,
        (right) => mixedWhy(right.split(", ")[1] ?? "", right),
        mixedConditionalsWriteNot,
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
  intro: t(
    "When debating whether schools should shorten the summer break, a for-and-against essay holds back its own verdict at the start, gives each side an equally well-developed paragraph, and weighs them in a balanced conclusion.",
    "讨论“学校是否应缩短暑假”时，正反论证类议论文先不急于表态，而是给支持和反对两方同等充分的段落，最后在结论段权衡并给出判断。",
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
      "A for-and-against essay looks fairly at both sides of a question before you decide. Plan four paragraphs:\n\n1. **Introduction**: present the question and say that people disagree about it, without giving your own view yet: *There are strong arguments on both sides.*\n2. **Arguments for**: two or three points, each explained and supported with an example: *On the one hand, ... Furthermore, ...*\n3. **Arguments against**: the same number of points, as fully developed: *On the other hand, ... Critics point out that ...*\n4. **Conclusion**: weigh the two sides and say which you find stronger, or under what conditions each is right: *In conclusion, both sides make valid points. On balance, I believe ...* Do not add a new argument here.\n\nGive both sides a fair hearing: describe the side you disagree with as its supporters would, not as a weak position. Keep a neutral, formal tone, with no contractions.\n\n> **Watch out.** Keep your personal verdict out of the introduction—save it for the conclusion—and make sure both body paragraphs receive comparable depth.",
      "正反论证类议论文在下结论之前公平地看待问题的两方面。安排四段：\n\n1. **引言**：提出问题，说明人们对此看法不一，先不表明自己的观点：*There are strong arguments on both sides.*\n2. **支持的论点**：两三点，每点都有解释和例子：*On the one hand, ... Furthermore, ...*\n3. **反对的论点**：同样多的论点，同样充分地展开：*On the other hand, ... Critics point out that ...*\n4. **结论**：权衡两方，说明你认为哪一方更有说服力，或者各自在什么条件下成立：*In conclusion, both sides make valid points. On balance, I believe ...* 不要在这里加新的论点。\n\n要公平地对待两方：像对方的支持者那样介绍你不赞同的一方，而不是把它写成不堪一击的观点。语气中立、正式，不用缩写。和观点类议论文不同，这种文章的引言不急于表态，判断留到结尾。\n\n> **注意。** 引言里先不要亮出个人立场，把判断留到结尾；两个主体段的篇幅与说理深度要大致均衡。",
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
