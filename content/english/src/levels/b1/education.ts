// B1, unit 1: Education and Learning. School life, how we learn, people at school, more subjects, thinking, qualities,
// study skills and linking words; the present perfect or the past simple; an informal email judged by a model.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { fill, judgedTopic } from "../a2/kit.ts";
import { everyTriple, interleave, vocabularyTopic, word } from "../words.ts";

const schoolLife = vocabularyTopic({
  id: "b1-words-school-life",
  title: t("School Life", "校园生活"),
  summary: t(
    "Education, semesters and terms; grades, marks and exams; passing and revising; assignments, essays, presentations and deadlines.",
    "教育、学期；成绩、分数和考试；通过和复习；作业、短文、演示和截止日期。",
  ),
  intro: t(
    "This **semester** I have an **essay** to write, a **presentation** to give and an **exam** in June, and each one has a strict **deadline**. These words help you talk about the work, the tests and the calendar of school and university.",
    "这个 **semester**（学期）我要写一篇 **essay**（论文），做一次 **presentation**（展示），六月还有一场 **exam**（考试），每一项都有严格的 **deadline**（截止日期）。这些词帮你谈论学校和大学里的作业、考试和日程。",
  ),
  prerequisites: ["a1-words-schoolwork"],
  words: [
    word(
      "education",
      "the teaching and learning that happens at school and university",
      "教育",
      "Years of good {education} at school and university help you find a good job. | In many countries, children get free {education} at school until they are eighteen. | She went to the USA for her university {education}.",
      "homework knowledge",
    ),
    word(
      "semester semesters",
      "one of the two parts of a school or university year",
      "（一年两段的）学期",
      "The spring {semester}, the second half of the university year, starts in February. | I'm taking four classes this {semester}. | Our university year is split into two {semesters}.|deadlines exams",
      "deadline exam",
      "term",
    ),
    word(
      "term terms",
      "one of the parts of the school year, often three",
      "（一年三段的）学期",
      "The summer {term}, with twelve weeks of lessons, ends in July. | We have exams at the end of every {term}. | A British school year is split into three {terms}.|exams deadlines",
      "exam deadline",
      "semester",
    ),
    word(
      "grade grades",
      "a letter or number that shows how good a piece of work is; a year at school",
      "成绩；年级",
      "She got a good {grade}, an A, in math. | My brother is in the fifth {grade}. | You need good {grades}, mostly A's, to go to that university.|deadlines presentations",
      "deadline presentation",
      "mark",
    ),
    word(
      "exam exams",
      "an important test of what you know",
      "考试",
      "I have a history {exam} in the big hall tomorrow, with two hours to answer the questions. | Did you pass all your {exams}?|essays grades | We can't use our phones during the {exam}.",
      "essay grade",
    ),
    word(
      "mark marks",
      "a number or letter given for a piece of school work",
      "分数",
      "I got full {marks} on the spelling test.|terms essays | What {mark} did you get for your essay? | The pass {mark} is sixty.",
      "term essay",
      "grade",
    ),
    word(
      "pass passes passed passing",
      "to be successful in an exam or test",
      "通过（考试）",
      "If you study hard, you'll {pass} the exam. | Only half of the class {passed} the driving test and got their licenses.|failed revised | You {passed} with a grade of A.|failed revised",
      "fail revise",
    ),
    word(
      "revise revises revised revising",
      "to study again what you have learned, before an exam",
      "复习",
      "I need to {revise} for my chemistry exam. | She {revised} every evening for two weeks before the test.|passed submitted | Let's {revise} together in the library after school.",
      "pass submit",
    ),
    word(
      "assignment assignments",
      "a piece of work that a teacher asks you to do",
      "作业；任务",
      "The teacher gave us a long reading {assignment} to do at home this week. | Have you finished writing your history {assignment}? It's due tomorrow. | Please hand in your {assignments} by Friday.|exams grades",
      "exam grade",
    ),
    word(
      "essay essays",
      "a short piece of writing about a subject",
      "短文；论文",
      "Your {essay} about your hometown should be 300 words long. | Her {essay}, ten pages of careful writing on climate change, won a prize. | I spent the whole weekend writing two {essays} for my English class.|presentations exams",
      "presentation exam",
    ),
    word(
      "presentation presentations",
      "a talk in which you show and explain something to a group",
      "演示；陈述",
      "Tomorrow I have to give a {presentation} about my project to my classmates, as every student does. | My classmate showed photos and a map in his {presentation} about Italy. | Each student gave a five-minute {presentation}.",
      "lesson deadline",
    ),
    word(
      "deadline deadlines",
      "the time or day by which you must finish something",
      "截止日期",
      "The {deadline} for the essay is next Monday. | I always hand in my essays a day before the {deadline}, never late. | If you hand in your essay after the {deadline}, you'll lose marks.",
      "semester exam",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Semester* and *term* both name parts of a school year, but a *semester* is one of two halves, often at university, and a *term* is one of three parts in a British school. Count the parts the sentence gives.",
        "*semester* 和 *term* 都是学年的一部分，但 *semester* 是两个学期之一，多用于大学；*term* 是英国学校三个学期之一。数一数句子里说的学年分几段。",
      ),
      meaning: t(
        "*Revise* in school English is not to change a text: it means to study again what you learned before an exam. Check whether the meaning is about studying for a test.",
        "学校英语里的 *revise* 不是修改文章，而是考试前把学过的内容再学一遍。看清释义是不是在说为考试复习。",
      ),
      spell: t(
        "*Assignment* keeps a silent g from *assign*: as-**sign**-ment. *Semester* has e three times, s-e-m-e-s-t-e-r, with no a.",
        "*assignment* 保留了 *assign* 里不发音的 g：as-**sign**-ment。*semester* 里没有 a，三个元音都是 e。",
      ),
    },
    notes: `
      education|school and university that help you find a job;free schooling until eighteen;university in the USA|education is all the teaching and learning at school; knowledge is what you know|education 是学校的教与学；knowledge 是所知道的东西|homework=homework is the work you do at home for one lesson, not years of teaching at school and university=homework 是为某节课在家做的作业，不是学校和大学多年的教育;knowledge=knowledge is what you know, not the teaching you get at school=knowledge 是知道的东西，不是在学校接受的教学|ed · u · ca · tion|-tion at the end, and d said like j: *ej-oo-KAY-shun*|结尾 -tion；d 读作 j
      semester|the second half of the university year;four classes;a year split into two parts|a semester is one of two halves of the year; a term is often one of three|semester 是一学年的两段之一；term 常是三段之一|deadline/deadlines=deadline is the last day to hand in work, not months of classes=deadline 是交作业的最后期限，不是几个月的课程;exam/exams=exam is one test on one day, not a long part of the school year=exam 是某天的一场考试，不是学年中的一大段|se · mes · ter|three e's and no a|三个元音都是 e，没有 a
      term|twelve weeks of lessons in summer;exams at the end of each one;three parts of a British school year|a term is one of the parts of the school year; an exam is one test|term 是学年中的一个学期；exam 是一次考试|exam/exams=exam is one test, not weeks of lessons in a school year=exam 是一次考试，不是学年中几周的课;deadline/deadlines=deadline is the last day to finish work, not a part of the school year=deadline 是完成作业的最后一天，不是学年的一部分|term|the summer term · the end of term · three terms a year|at the end of term 常不加 the
      grade|an A in math;the fifth year at school;mostly A's for university|a grade is a letter or number for how good work is; a presentation is a talk|grade 是成绩等级；presentation 是展示讲解|deadline/deadlines=deadline is the last day to hand in work, not the letter that shows how good it was=deadline 是交作业的最后一天，不是表示好坏的字母;presentation/presentations=presentation is a talk you give, not a letter or number you get=presentation 是你做的讲解，不是你得到的字母或分数|grade|get a good grade · be in the fifth grade|in the fifth grade 也表示“五年级”
      exam|two hours in the big hall to answer questions;passing all of them;no phones allowed|an exam is an important test; an essay is a piece of writing you do at home|exam 是重要的考试；essay 是写的文章|essay/essays=essay is a piece of writing about a subject, not a test of questions you pass or fail=essay 是就某个话题写的文章，不是要通过的一套试题;grade/grades=grade is the letter you get for your work, not the test itself=grade 是得到的成绩，不是考试本身|ex · am|take an exam · pass an exam · fail an exam|take an exam 是参加考试，pass 是通过
      mark|full points on a spelling test;a score for an essay;sixty to pass|a mark is the number you get for work; a term is a part of the year|mark 是得的分数；term 是学期|term/terms=term is a part of the school year, not a number given for work=term 是学年的一段，不是给作业打的分;essay/essays=essay is the writing you hand in, not the number you get for it=essay 是交的文章，不是得到的分数|mark|full marks · get a mark for… · the pass mark|full marks 用复数
      pass|studying hard for the exam;a driving test that gave licenses;a grade of A|to pass is to be successful in a test; to fail is to not be successful|pass 是考试通过；fail 是不及格|fail/failed=fail means to not be successful in a test, the opposite of getting through with a good result=fail 是没通过，正好和顺利通过相反;revise/revised=revise means to study before a test, not to get through it=revise 是考前复习，不是通过考试|pass|pass an exam, with no *in*; *pass* is also to go past something|pass an exam，不加 in
      revise|a chemistry exam;two weeks of evening study before the test;the library after school|to revise is to study again before an exam; to pass is to be successful in it|revise 是复习；pass 是通过|pass/passed=pass means to be successful in an exam, not to study for it again and again=pass 是考试通过，不是一遍遍复习;submit/submitted=submit means to hand in your work, not to study what you learned before=submit 是交作业，不是复习学过的内容|re · vise|revise for an exam, with *for*|revise for…，用 for
      assignment|reading to do at home this week;history writing due tomorrow;work handed in by Friday|an assignment is work a teacher gives you to do; an exam is a test you take|assignment 是老师布置的作业；exam 是要参加的考试|exam/exams=exam is a test you sit in a hall, not work you do at home and hand in=exam 是在考场参加的考试，不是在家做完交上去的作业;grade/grades=grade is the letter you get for work, not the work itself=grade 是作业得的成绩，不是作业本身|as · sign · ment|silent g from *assign*|保留 *assign* 里不发音的 g
      essay|300 words about your hometown;ten pages of careful writing on climate change;writing for an English class|an essay is a piece of writing; a presentation is a talk you give|essay 是写的文章；presentation 是讲的展示|presentation/presentations=presentation is a talk you give to a group, not a piece of writing=presentation 是对一群人做的讲解，不是一篇文章;exam/exams=exam is a test you take, not writing you plan and finish at home=exam 是参加的考试，不是在家写完的文章|es · say|double s; *essay on* or *essay about* a subject|双写 s；essay on/about 某话题
      presentation|a project talk to classmates by each student;photos and a map about Italy;five minutes for each student|a presentation is a talk a student gives with things to show; a lesson is a teacher teaching a class|presentation 是学生展示讲解；lesson 是老师上的课|lesson/lessons=lesson is a time when a teacher teaches the class, not a talk each student gives=lesson 是老师给全班上课，不是每个学生做的讲解;deadline/deadlines=deadline is the last day to finish work, not a talk you give=deadline 是完成作业的最后一天，不是你做的讲解|pres · en · ta · tion|give a presentation · make a presentation|give a presentation，不说 do a presentation
      deadline|an essay due next Monday;essays never handed in late;marks lost for late work|a deadline is the last day to finish work; an exam is a test on a day|deadline 是最后期限；exam 是某天的考试|semester=semester is half of a university year, not the last day to hand in work=semester 是半个学年，不是交作业的最后一天;exam=exam is a test you sit, not the last moment to hand in work=exam 是参加的考试，不是交作业的最后时刻|dead · line|miss a deadline · meet a deadline|meet a deadline 是按时完成
    `,
  },
});

const learning = vocabularyTopic({
  id: "b1-words-learning",
  title: t("How We Learn", "我们怎样学习"),
  summary: t(
    "Knowledge and memory; memorizing, concentrating and focusing; progress, improvements and effort; methods, attention, explanations and ability.",
    "知识和记忆；背诵、集中注意力；进步、改进和努力；方法、注意力、解释和能力。",
  ),
  intro: t(
    "To make real **progress**, you need **effort**, good **attention** in class and a **method** that helps your **memory**. These words help you talk about how you learn and how you get better.",
    "想取得真正的 **progress**（进步），你需要 **effort**（努力）、课上的 **attention**（注意力），还要有帮助 **memory**（记忆）的 **method**（方法）。这些词帮你谈论怎样学习、怎样进步。",
  ),
  prerequisites: ["b1-words-school-life"],
  words: [
    word(
      "knowledge",
      "what you know about something",
      "知识",
      "He has a lot of {knowledge} about old cars. | Reading is a great way to get {knowledge}. | My {knowledge} of Spanish is small: I know only a few words.",
      "memory method",
    ),
    word(
      "memory memories",
      "the ability to remember things; something you remember",
      "记忆",
      "My grandmother has a very good {memory}. She never forgets a birthday. | I have a happy {memory} of my first day at school: I still remember my teacher's smile. | Can you say the poem from {memory}, without looking at the book?",
      "knowledge mistake",
    ),
    word(
      "memorize memorizes memorized memorizing",
      "to learn something so well that you can say it without looking",
      "记住；背熟",
      "Actors have to {memorize} their lines so they can say them without the script. | I {memorized} twenty new words today, and I can say them all without looking.|concentrated explained | Try {memorizing} the phone number so you don't need to write it down.|concentrating explaining",
      "concentrate explain",
    ),
    word(
      "concentrate concentrates concentrated concentrating",
      "to give all your thinking to one thing",
      "集中注意力",
      "Turn off the TV, please: I need to think hard about this problem, and I can't {concentrate}! | When you're tired, it's hard to {concentrate} and keep your mind on your homework. | She was {concentrating} so hard that she didn't hear the phone ring.|relaxing remembering",
      "relax remember",
      "focus",
    ),
    word(
      "focus focuses focused focusing",
      "to give your attention to one thing; the main thing you look at",
      "集中；焦点",
      "Today's lesson will {focus} only on the past simple, not on other tenses. | Put your phone away and {focus} on the lesson. | The main {focus} of this book is family life: almost every page is about it.|method mistake",
      "agree depend",
      "concentrate",
    ),
    word(
      "progress",
      "the act of getting better or nearer to a goal",
      "进步；进展",
      "Your English is getting better. You're making good {progress}. | The doctor is happy with his {progress} after the operation: he is getting stronger every day. | We've made a lot of {progress} on the project this week, and it's almost finished.",
      "effort method",
    ),
    word(
      "improvement improvements",
      "a change that makes something better",
      "改进；进步",
      "There has been a big {improvement} in your writing this term: it's much better now. | The new library is a great {improvement} on the old one. | We made some {improvements} to the essay, so it was better when we handed it in.|efforts mistakes",
      "effort mistake",
      "progress",
    ),
    word(
      "effort efforts",
      "hard work to do something",
      "努力",
      "Learning a language takes years of time and {effort}: you have to work hard every day. | She made a big {effort} to arrive on time. | Thank you for all the {effort} you put into this hard work.",
      "attention ability",
    ),
    word(
      "method methods",
      "a way of doing something",
      "方法",
      "What's the best {method} for learning new words? | Our teacher uses a new {method} to teach reading. | There are many {methods} of cooking rice: boiling, steaming and frying.|efforts abilities",
      "effort ability",
    ),
    word(
      "attention",
      "the act of watching, listening or thinking about something carefully",
      "注意；注意力",
      "Please pay {attention}. This is important. | The children listened with great {attention}, watching every move the teacher made. | The loud music got everyone's {attention}.",
      "effort memory",
    ),
    word(
      "explanation explanations",
      "words that make something clear or give the reason for it",
      "解释；说明",
      "The teacher's {explanation} of the rule, in simple words, was clear. | What is the {explanation} for that strange noise? Why is it happening? | He left without any {explanation} and never told us why.",
      "method knowledge",
    ),
    word(
      "ability abilities",
      "the power or skill to do something",
      "能力",
      "She has the {ability} to learn languages very quickly. | The test checks your {ability} to read and write. | Dogs have an amazing {ability} to find lost people.",
      "effort attention",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Progress* and *effort* travel together but are not the same: *effort* is the hard work you put in, and *progress* is getting better because of it. Ask whether the gap is the work or the result.",
        "*progress* 和 *effort* 常一起出现，但不一样：*effort* 是付出的努力，*progress* 是因此变好的结果。想想空格说的是付出，还是结果。",
      ),
      meaning: t(
        "*Memorize* is not *remember*: you *memorize* when you learn something on purpose so well that you can say it without looking. Check whether the meaning is learning by heart.",
        "*memorize* 不等于 *remember*：*memorize* 是有意把东西学到不看也能说出来，即背熟。看清释义是不是“背下来”。",
      ),
      spell: t(
        "*Knowledge* starts with a silent k and has a d before the g: knowl-**edge**. *Progress* has no plural when it means getting better.",
        "*knowledge* 开头的 k 不发音，g 前还有 d：knowl-**edge**。*progress* 表示进步时没有复数。",
      ),
    },
    notes: `
      knowledge|a lot about old cars;reading;only a few words of Spanish|knowledge is what you know; memory is your power to remember|knowledge 是所知道的东西；memory 是记忆力|memory=memory is your power to keep things in your mind, not the facts you know about a subject=memory 是记住东西的能力，不是关于某个话题的知识;method=method is a way of doing something, not what you know=method 是做事的方法，不是你知道的东西|knowl · edge|a silent k, and no plural: a lot of knowledge|k 不发音；没有复数：a lot of knowledge
      memory|never forgetting a birthday;a teacher's smile from the first day at school;a poem without the book|memory is the power to remember, or something you remember; knowledge is what you have learned|memory 是记忆力或回忆；knowledge 是学到的东西|knowledge=knowledge is what you have learned about a subject, not the power to remember or one thing you remember=knowledge 是学到的知识，不是记忆力或某段回忆;mistake=mistake is something done wrong, not something you remember=mistake 是做错的事，不是记得的事|mem · o · ry|from memory · a good memory · happy memories|from memory 是“凭记忆”
      memorize|lines said without the script;twenty words said without looking;a phone number not written down|to memorize is to learn by heart; to concentrate is to think hard about one thing|memorize 是背熟；concentrate 是集中注意力|concentrate/concentrated/concentrating=concentrate means to give all your thinking to one thing, not to learn words so you can say them without looking=concentrate 是全神贯注，不是背熟到不看也能说;explain/explained/explaining=explain means to make something clear to someone, not to learn it by heart=explain 是给别人讲清楚，不是自己背熟|mem · o · rize|memory, y to i, + -ze; British English also writes *memorise*|memory 把 y 变 i 加 -ze；英式也写 *memorise*
      concentrate|thinking hard about a problem;keeping your mind on homework;not hearing the phone ring|to concentrate is to give all your thinking to one thing; to relax is to rest|concentrate 是集中注意力；relax 是放松|relax/relaxing=relax means to rest and stop thinking hard, the opposite of giving all your mind to one thing=relax 是放松休息，正好和全神贯注相反;remember/remembering=remember means to keep something in your mind from before, not to give all your thinking to something now=remember 是记得以前的事，不是此刻全神贯注|con · cen · trate|concentrate on something, with *on*|concentrate on…，用 on
      focus|the past simple only in today's lesson;the lesson with the phone put away;family life on almost every page|to focus is to give your attention to one thing; to agree is to have the same opinion|focus 是集中于某事；agree 是同意|agree=agree means to have the same opinion as someone, not to give your attention to one thing=agree 是看法相同，不是把注意力放在一件事上;depend=depend means to need something or be decided by it, not to give your attention to it=depend 是依靠或取决于，不是集中注意力;method=method is a way of doing something, not the main thing a book is about=method 是做事的方法，不是书的重点;mistake=mistake is something wrong, not the main thing a book is about=mistake 是错误，不是书的重点|fo · cus|focus on · the focus of · focused or focussed|focus on…；名词 the focus of…
      progress|English getting better;getting stronger after an operation;a project almost finished|progress is getting better or nearer to a goal; effort is the hard work you do|progress 是进步、进展；effort 是付出的努力|effort=effort is the hard work you put in, not the getting better that comes from it=effort 是付出的努力，不是因此变好的结果;method=method is a way of doing something, not getting better=method 是做事的方法，不是变好|prog · ress|no plural: make progress, not make a progress|没有复数：make progress，不加 a
      improvement|writing much better this term;a new library better than the old;an essay made better before handing in|an improvement is a change that makes something better; a mistake makes it worse|improvement 是改进；mistake 是错误|effort/efforts=effort is the hard work you do, not the change that makes something better=effort 是付出的努力，不是让东西变好的改变;mistake/mistakes=mistake is something wrong, the opposite of a change that makes it better=mistake 是错误，正好和改进相反|im · prove · ment|improve + -ment, keeping the e|improve 保留 e 加 -ment
      effort|years of hard daily work for a language;arriving on time;putting a lot into hard work|effort is the hard work you put in; ability is the power to do something|effort 是努力；ability 是能力|attention=attention is watching or listening carefully, not hard work over time=attention 是认真看、认真听，不是长期的辛苦付出;ability=ability is the power you already have to do something, not the work you put in=ability 是本来就有的能力，不是付出的努力|ef · fort|make an effort · take effort|make an effort，不说 do an effort
      method|learning new words;teaching reading;boiling, steaming and frying rice|a method is a way of doing something; an ability is the power to do it|method 是方法；ability 是能力|effort/efforts=effort is the hard work you put in, not the way you do something=effort 是努力，不是做事的方式;ability/abilities=ability is the power to do something, not a way of doing it=ability 是能力，不是做事的方式|meth · od|th said as in *think*; a method for or of doing something|th 读 *think* 的音；a method for/of doing
      attention|something important;children watching every move of the teacher;loud music|attention is watching or listening carefully; memory is keeping things in your mind|attention 是注意力；memory 是记忆|effort=effort is hard work to do something, not watching and listening carefully=effort 是努力做事，不是认真看和听;memory=memory is keeping things in your mind from before, not watching something now=memory 是记住以前的事，不是此刻的注意|at · ten · tion|double t; pay attention to something|双写 t；pay attention to…
      explanation|a rule in simple words;the reason for a strange noise;why he left|an explanation makes something clear or gives a reason; a method is a way of doing something|explanation 是解释或原因；method 是方法|method=method is a way of doing something, not words that make it clear or give its reason=method 是做事的方法，不是讲清楚或说明原因的话;knowledge=knowledge is what you know, not words that tell someone why=knowledge 是所知道的，不是告诉别人原因的话|ex · pla · na · tion|*explain* has ai, but *explanation* has only a: ex-pla-na-tion|*explain* 有 ai，*explanation* 只有 a
      ability|learning languages quickly;reading and writing on a test;dogs finding lost people|ability is the power or skill to do something; effort is trying hard|ability 是能力；effort 是努力|effort=effort is trying hard, not the power or skill you have=effort 是努力，不是拥有的能力或技能;attention=attention is watching or listening carefully, not a skill to do something=attention 是注意力，不是做事的技能|a · bil · i · ty|the ability to do something, with *to*|the ability to do…，用 to
    `,
  },
});

const schoolPeople = vocabularyTopic({
  id: "b1-words-school-people",
  title: t("People at School", "学校里的人"),
  summary: t(
    "Principals, classmates and tutors; professors, pupils, lecturers and counselors; scholarships, certificates and diplomas; campuses and dormitories.",
    "校长、同学和导师；教授、学生、讲师和辅导员；奖学金、证书和文凭；校园和宿舍。",
  ),
  intro: t(
    "At the end of the year the **principal** handed out each **diploma**, and the **professor** who gave me a **scholarship** came to watch with my **classmates**. These words help you talk about the people and places of school and university.",
    "学年结束时，**principal**（校长）为每个人颁发 **diploma**（毕业证书），给我 **scholarship**（奖学金）的 **professor**（教授）也和 **classmates**（同学们）一起来观礼。这些词帮你谈论学校和大学里的人和地方。",
  ),
  prerequisites: ["b1-words-school-life"],
  words: [
    word(
      "principal principals",
      "the head of a school",
      "校长",
      "The {principal}, who runs our school, gave a speech at the start of the school year. | If you're late three times, you are sent to the {principal}, who is in charge of the whole school. | Our new {principal}, who now runs the whole school, used to be a math teacher.",
      "tutor pupil",
    ),
    word(
      "classmate classmates",
      "someone in the same class as you",
      "同班同学",
      "On the school trip, I sat next to my {classmate} Lily, who is in my class. | All twenty of my {classmates} from class 5B came to my birthday party.|principals professors | Ask a {classmate} who sits near you if you don't understand the homework.",
      "principal professor",
    ),
    word(
      "tutor tutors",
      "a teacher who teaches one student or a small group",
      "家庭教师；导师",
      "My parents pay a {tutor} to teach me chemistry at home. | She works as a math {tutor} on weekends. | My {tutor} comes to our house every Tuesday to give me a private lesson.",
      "principal classmate",
    ),
    word(
      "professor professors",
      "a teacher of the highest rank at a university",
      "教授",
      "{Professor} Lin teaches history at the university. | She became a {professor} of history at the university at forty. | The {professors} at this university are famous scientists.|pupils principals",
      "pupil principal",
      "lecturer",
    ),
    word(
      "pupil pupils",
      "a child at school",
      "小学生；学生",
      "There are thirty {pupils} in each class.|professors principals | The teacher asked each {pupil} to read a page. | She was a quiet {pupil} at primary school, but she worked hard.",
      "professor principal",
    ),
    word(
      "lecturer lecturers",
      "someone who teaches at a university by giving talks",
      "讲师",
      "The {lecturer} spoke for an hour to two hundred students about modern art. | My sister is a {lecturer} in economics at the university, where she teaches big classes. | The {lecturers} put their slides online after each class.|pupils classmates",
      "pupil classmate",
      "professor",
    ),
    word(
      "counselor counselors",
      "someone whose job is to listen to people and give them advice",
      "辅导员；顾问",
      "If you feel worried or sad, the school {counselor} will listen and give you advice. | The {counselor} listened to my worries and helped me choose my subjects. | Our school's {counselors} listen to students and help them with their problems.|principals tutors",
      "principal tutor",
    ),
    word(
      "scholarship scholarships",
      "money given to a good student to pay for their studies",
      "奖学金",
      "She won a {scholarship} to study in London. | Without the {scholarship}, he couldn't pay for university. | The university gives ten {scholarships} every year to pay for good students' studies.|certificates diplomas",
      "certificate diploma",
    ),
    word(
      "certificate certificates",
      "a paper that shows you have done or passed something",
      "证书",
      "You get a {certificate} at the end of the course to show that you finished it. | Here is my swimming {certificate}: it shows I passed the test. | She keeps all her {certificates}, the papers from every course she passed, in a box.|scholarships prizes",
      "scholarship prize",
      "diploma",
    ),
    word(
      "diploma diplomas",
      "a paper you get when you finish school or a course",
      "毕业文凭",
      "He got his high school {diploma} last summer, when he finished school. | She has a {diploma} in nursing. | The students walked up to get their {diplomas} on the last day of school.|scholarships prizes",
      "scholarship prize",
      "certificate",
    ),
    word(
      "campus campuses",
      "the land and buildings of a university or college",
      "校园",
      "The university {campus} has a lake and a sports center. | First-year students must live on the {campus}, inside the university grounds. | Our school has two {campuses} in the city.|dormitories classrooms",
      "dormitory classroom",
    ),
    word(
      "dormitory dormitories",
      "a building where students live and sleep",
      "宿舍",
      "I share a room in the {dormitory} with two other students. | The {dormitories}, where students sleep, are next to the library.|campuses classrooms | Lights go out in the {dormitory} at eleven, and students go to bed.",
      "campus classroom",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Campus* and *dormitory* are both university places, but the *campus* is all the land and buildings, and a *dormitory* is one building where students sleep. Ask whether the sentence means the whole place or the building with beds.",
        "*campus* 和 *dormitory* 都是大学里的地方，但 *campus* 是整片校园和所有建筑，*dormitory* 是学生睡觉的那栋楼。想想句子说的是整个校园，还是有床的那栋楼。",
      ),
      meaning: t(
        "A *scholarship* is not a paper you get for finishing school: that is a *diploma*. A *scholarship* is money given to a good student to pay for study. Check whether the meaning is money or a paper.",
        "*scholarship* 不是毕业时拿到的证书，那是 *diploma*。*scholarship* 是给优秀学生用于学习的钱。看清释义说的是钱，还是一张证书。",
      ),
      spell: t(
        "*Principal*, the head of a school, ends in -pal; *principle* with -ple is a rule or belief. *Counselor* has one l in American English.",
        "表示校长的 *principal* 以 -pal 结尾；以 -ple 结尾的 *principle* 是原则。*counselor* 美式拼写只有一个 l。",
      ),
    },
    notes: `
      principal|the person who runs our school;the person in charge of the whole school;a math teacher who now runs the school|the principal is the head of a school; a tutor teaches one student or a small group|principal 是校长；tutor 是家教或导师|tutor=tutor teaches one student or a small group, not the person who runs a whole school=tutor 教一个或几个学生，不是管理全校的人;pupil=pupil is a child who learns at school, not the head of it=pupil 是上学的孩子，不是学校的负责人|prin · ci · pal|-pal at the end; *principle* with -ple is a rule|结尾是 -pal；以 -ple 结尾的 *principle* 是原则
      classmate|Lily from my class on the school trip;twenty children from class 5B;someone who sits near you|a classmate is in the same class as you; a professor teaches at a university|classmate 是同班同学；professor 是大学教授|principal/principals=principal is the head of a whole school, not someone who sits in your class=principal 是全校的校长，不是和你同班的人;professor/professors=professor teaches at a university, not a child in your class=professor 是大学里的教授，不是和你同班的孩子|class · mate|class + mate, one word|class 加 mate，写成一个词
      tutor|chemistry at home for pay;math on weekends;a private lesson every Tuesday|a tutor teaches one student or a small group; a classmate learns with you|tutor 是单独辅导的老师；classmate 是同学|principal=principal runs a whole school, not someone paid to teach one student at home=principal 管理全校，不是到家里教一个学生的人;classmate=classmate learns in your class, not someone paid to teach you=classmate 和你一起上课，不是付钱请来教你的人|tu · tor|-or at the end; a private tutor · a math tutor|结尾是 -or
      professor|Professor Lin teaching history at the university;a history post at forty;famous scientists at a university|a professor is a top teacher at a university; a principal is the head of a school|professor 是大学教授；principal 是中小学校长|pupil/pupils=pupil is a child learning at school, not a top teacher at a university=pupil 是上学的孩子，不是大学的高级教师;principal/principals=principal is the head of a school for children, not a university teacher=principal 是中小学的校长，不是大学老师|pro · fes · sor|one f and a double s: pro-fes-sor|一个 f、两个 s：pro-fes-sor
      pupil|thirty in each class;each child reading a page;a quiet child at primary school|a pupil is a child at school; a professor is a top university teacher|pupil 是小学生；professor 是大学教授|professor/professors=professor teaches at a university, not a child who learns in a class=professor 是大学里教书的人，不是在班上学习的孩子;principal/principals=principal is the head of a school, not one of the children in it=principal 是校长，不是学校里的孩子|pu · pil|*pupil* is also the black part in the middle of your eye|*pupil* 还可以指“瞳孔”
      lecturer|an hour on modern art to two hundred students;economics classes at the university;slides put online after class|a lecturer teaches at a university by giving talks; a pupil is a child who learns|lecturer 是大学讲师；pupil 是学生|pupil/pupils=pupil is a child who learns, not someone who teaches at a university=pupil 是学习的孩子，不是在大学教书的人;classmate/classmates=classmate learns in the same class, not someone who gives talks to it=classmate 是同班同学，不是给全班讲课的人|lec · tur · er|lecture + -r|lecture 加 -r
      counselor|listening and advice when you feel worried;worries and choosing subjects;students' problems|a counselor listens and gives advice; a tutor teaches a subject|counselor 是倾听并给建议的辅导员；tutor 是教科目的老师|principal/principals=principal runs the whole school, not the person whose job is to listen to your worries=principal 管理全校，不是专门倾听你烦恼的人;tutor/tutors=tutor teaches you a subject, not the person who listens to your worries=tutor 教你某门功课，不是倾听你烦恼的人|coun · sel · or|counselor in American English, counsellor in British English|美式 counselor，英式 counsellor
      scholarship|study in London;paying for university;good students' studies paid every year|a scholarship is money for a good student's study; a diploma is the paper you get at the end|scholarship 是奖学金；diploma 是毕业证书|certificate/certificates=certificate is a paper that shows you passed something, not money to pay for study=certificate 是证明通过的证书，不是付学费的钱;diploma/diplomas=diploma is the paper you get when you finish, not money that pays for study=diploma 是毕业拿到的文凭，不是付学费的钱|schol · ar · ship|sch said like *sk*; win a scholarship|sch 读作 *sk*；win a scholarship
      certificate|a paper at the end of a course;a passed swimming test;papers from every passed course|a certificate shows you have done or passed something; a prize is something you win for being the best|certificate 是证明完成或通过的证书；prize 是赢得的奖品|scholarship/scholarships=scholarship is money for study, not a paper that shows you passed=scholarship 是用于学习的钱，不是证明通过的证书;prize/prizes=prize is something you win for being the best, not a paper that shows you finished or passed=prize 是因为最好而赢得的奖，不是证明完成或通过的纸|cer · tif · i · cate|-ate at the end, said like *it*|结尾 -ate 读作 *it*
      diploma|finishing high school last summer;nursing studies;the last day of school|a diploma is the paper you get when you finish school; a scholarship is money for study|diploma 是毕业文凭；scholarship 是奖学金|scholarship/scholarships=scholarship is money that pays for study, not a paper you get when you finish=scholarship 是付学费的钱，不是毕业时拿到的纸;prize/prizes=prize is won for being the best, not given to every student who finishes=prize 是因为最好才赢得的，不是每个毕业生都有|di · plo · ma|a diploma in a subject, with *in*|a diploma in…，用 in
      campus|a lake and a sports center;living inside the university grounds;two sites in the city|a campus is all the land and buildings of a university; a dormitory is one building to sleep in|campus 是整个校园；dormitory 是一栋宿舍楼|dormitory/dormitories=dormitory is one building where students sleep, not all the land with a lake and sports center=dormitory 是学生睡觉的一栋楼，不是有湖和体育馆的整个校园;classroom/classrooms=classroom is one room for lessons, not all the land and buildings of a university=classroom 是上课的一间教室，不是大学的整片土地和建筑|cam · pus|live on campus, with *on* and often no *the*|live on campus，常不加 the
      dormitory|a room shared with two students;buildings where students sleep;lights out at eleven and bedtime|a dormitory is a building where students sleep; a classroom is where they have lessons|dormitory 是宿舍；classroom 是教室|campus/campuses=campus is the whole university with all its buildings, not the one building where students sleep=campus 是包括所有建筑的整个校园，不是学生睡觉的那栋楼;classroom/classrooms=classroom is where lessons happen, not where students sleep=classroom 是上课的地方，不是睡觉的地方|dor · mi · to · ry|often shortened to *dorm*; y to -ies for more than one|常简称 *dorm*；复数 y 变 -ies
    `,
  },
});

const subjects = vocabularyTopic({
  id: "b1-words-subjects-2",
  title: t("More Subjects", "更多学科"),
  summary: t(
    "Geography, biology, chemistry and physics; literature, economics, philosophy and psychology; engineering, law, politics and drama.",
    "地理、生物、化学和物理；文学、经济学、哲学和心理学；工程、法律、政治和戏剧。",
  ),
  intro: t(
    "In **geography** we study rivers, in **chemistry** we mix liquids, and in **psychology** we ask why people act as they do; my brother chose **law** and **economics** at university. These words help you name school and university subjects and say what each one studies.",
    "在 **geography**（地理）课上我们学河流，在 **chemistry**（化学）课上我们混合液体，在 **psychology**（心理学）课上我们探究人为什么这样做；我哥哥在大学选了 **law**（法律）和 **economics**（经济学）。这些词帮你说出中学和大学的科目，以及每门学什么。",
  ),
  prerequisites: ["a1-words-school-subjects"],
  words: [
    word(
      "geography",
      "the study of countries, mountains, rivers and weather",
      "地理",
      "In {geography}, we learned about the longest rivers in the world. | Maps of mountains and rivers are very important in {geography}. | Our {geography} teacher showed us photos of volcanoes.",
      "history biology",
    ),
    word(
      "biology",
      "the study of living things",
      "生物",
      "In {biology}, we studied how plants grow. | She wants to study {biology} because she loves animals. | Our {biology} class went to the zoo to watch how animals live.",
      "chemistry geography",
    ),
    word(
      "chemistry",
      "the study of what things are made of and how they change when they are mixed",
      "化学",
      "In {chemistry}, we mixed two liquids and they turned blue. | My {chemistry} teacher wears a white coat in the lab when she mixes acids. | Water is H2O: you learn that in {chemistry}.",
      "physics biology",
    ),
    word(
      "physics",
      "the study of energy, light, heat, movement and forces",
      "物理",
      "In {physics}, we learned why things fall to the ground. | Einstein is famous for his work in {physics}. | Our {physics} teacher showed us how light moves.",
      "chemistry engineering",
    ),
    word(
      "literature",
      "books, plays and poems, and the study of them",
      "文学",
      "We read a play by Shakespeare in {literature} class. | She studied English {literature} at university and read hundreds of novels and poems. | Chinese {literature} has many famous poems.",
      "history philosophy",
    ),
    word(
      "economics",
      "the study of how money, work and trade work in a country",
      "经济学",
      "In {economics}, we learn why prices go up and down. | He studied {economics} and now works at a bank. | The {economics} teacher talked about jobs, prices and money.",
      "politics law",
    ),
    word(
      "philosophy",
      "the study of big questions about life, truth and how we should live",
      "哲学",
      "In {philosophy} class, we discussed what makes a good life. | Confucius, whose ideas about how to live a good life are still taught, is one of the most famous names in Chinese {philosophy}. | She loves {philosophy} because she likes asking big questions about life and truth.",
      "psychology literature",
    ),
    word(
      "psychology",
      "the study of the mind and why people behave as they do",
      "心理学",
      "She studied {psychology} because she wanted to understand how the mind works and why people behave as they do. | In {psychology}, we learned how memory and dreams affect the way people behave. | My cousin teaches child {psychology}: she studies how children's minds grow.",
      "philosophy biology",
    ),
    word(
      "engineering",
      "the work of designing and building machines, roads and bridges",
      "工程",
      "He studied {engineering} and now builds bridges. | Computer {engineering}, where students design and build machines, is a popular subject at our university. | She wants to work in {engineering} because she loves designing machines.",
      "physics economics",
    ),
    word(
      "law laws",
      "the rules of a country; the study of these rules",
      "法律",
      "Stealing is against the {law}. | She studied {law} for five years and now helps people in court. | A new {law} says that cyclists must wear helmets.",
      "politics drama",
    ),
    word(
      "politics",
      "the activities of governments and of the people who want to be in power",
      "政治",
      "He went into {politics} and became mayor of the city. | Young people should be interested in {politics}, because the people in government change their lives. | {Politics} is about who is in power and how they run the country.",
      "law economics",
    ),
    word(
      "drama",
      "the study and acting of plays; an exciting event",
      "戏剧",
      "In {drama} class, we act out stories. | She joined the school {drama} club and acted in three plays. | The {drama} teacher helped us learn our lines for the play.",
      "literature music",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        '*Philosophy* and *psychology* are both about people\'s minds, but *philosophy* asks big questions about life and truth, and *psychology* studies how the mind works and why people behave as they do. Look for "big questions" or "why people behave".',
        "*philosophy* 和 *psychology* 都和人的思想有关，但 *philosophy* 探讨人生、真理等大问题，*psychology* 研究心智如何运作、人为什么这样做。留意 “big questions” 或 “why people behave”。",
      ),
      meaning: t(
        "*Economics* is the study of money and trade, but *politics* is about governments and power, and learners often swap them because both appear in the news. Check whether the meaning is money or power.",
        "*economics* 是研究金钱和贸易的学科，*politics* 是关于政府和权力的；两者都常见于新闻，容易混淆。看清释义说的是钱，还是权力。",
      ),
      spell: t(
        "*Psychology* starts with a silent p, said like *sy-KOL-o-jee*, and *physics*, *economics* and *politics* end in -s but take a singular verb: physics **is** hard.",
        "*psychology* 开头的 p 不发音，读作 *sy-KOL-o-jee*；*physics*、*economics*、*politics* 虽以 -s 结尾，却用单数动词：physics **is** hard。",
      ),
    },
    notes: `
      geography|the longest rivers in the world;maps of mountains and rivers;photos of volcanoes|geography studies places, land and weather; history studies the past|geography 研究地方、地形和天气；history 研究过去|history=history is the study of the past, not of rivers, mountains and volcanoes=history 研究过去发生的事，不是河流、山脉和火山;biology=biology is the study of living things, not of maps and rivers=biology 研究生物，不是地图和河流|ge · og · ra · phy|ph said like f|ph 读作 f
      biology|how plants grow;a love of animals;how animals live at the zoo|biology studies living things; chemistry studies what things are made of|biology 研究生物；chemistry 研究物质组成|chemistry=chemistry is the study of what things are made of and how they mix, not plants and animals=chemistry 研究物质组成和混合，不是植物和动物;geography=geography is the study of places and land, not how living things grow=geography 研究地方和地形，不是生物怎样生长|bi · ol · o · gy|bio- means life|bio- 表示“生命”
      chemistry|two liquids turning blue;acids mixed in the lab;H2O for water|chemistry studies what things are made of and how they change; physics studies energy and forces|chemistry 研究物质及其变化；physics 研究能量和力|physics=physics is the study of energy, light and forces, not of what things are made of and how they mix=physics 研究能量、光和力，不是物质组成和混合;biology=biology is the study of living things, not of liquids and acids=biology 研究生物，不是液体和酸|chem · is · try|ch said like *k*|ch 读作 *k*
      physics|why things fall to the ground;Einstein's work;how light moves|physics studies energy, light and forces; chemistry studies what things are made of|physics 研究能量、光和力；chemistry 研究物质组成|chemistry=chemistry is the study of what things are made of and how they mix, not of why things fall and how light moves=chemistry 研究物质及其混合，不是物体为何下落、光怎样传播;engineering=engineering is designing and building machines and bridges, not studying light and falling things=engineering 是设计建造机器和桥梁，不是研究光和下落|phys · ics|ends in -s but takes a singular verb: physics is…|以 -s 结尾却用单数动词
      literature|a play by Shakespeare;hundreds of novels and poems;famous Chinese poems|literature is books, plays and poems; history is what happened in the past|literature 是文学作品；history 是历史|history=history is the study of what happened in the past, not novels, plays and poems=history 研究过去的事件，不是小说、戏剧和诗歌;philosophy=philosophy is asking big questions about life, not reading novels and poems=philosophy 是探讨人生大问题，不是读小说和诗歌|lit · er · a · ture|-ture at the end, said like *cher*|结尾 -ture 读作 *cher*
      economics|prices going up and down;work at a bank;jobs, prices and money|economics studies money, work and trade; politics is about governments and power|economics 研究金钱、工作和贸易；politics 关乎政府和权力|politics=politics is about governments and power, not why prices change=politics 关乎政府和权力，不是价格为何变化;law=law is the rules of a country, not how money and trade work=law 是国家的法规，不是金钱和贸易怎样运作|ec · o · nom · ics|*economy* is a country's money system; *economics* is the subject|*economy* 是经济；*economics* 是经济学
      philosophy|what makes a good life;Confucius and his ideas about how to live;big questions about life and truth|philosophy asks big questions about life and truth; psychology studies how the mind works|philosophy 探讨人生与真理；psychology 研究心智运作|psychology=psychology is the study of how the mind works and why people behave, not big questions about truth and a good life=psychology 研究心智和行为，不是真理和美好人生这类大问题;literature=literature is books, plays and poems, not questions about how we should live=literature 是书、戏剧和诗歌，不是探讨该怎样生活|phi · los · o · phy|ph said like f, twice|两个 ph 都读作 f
      psychology|how the mind works and why people behave;memory and dreams and the way people behave;how children's minds grow|psychology studies the mind and behavior; philosophy asks big questions about life|psychology 研究心智和行为；philosophy 探讨人生大问题|philosophy=philosophy asks big questions about life and truth, not how the mind works=philosophy 探讨人生和真理，不是心智怎样运作;biology=biology is the study of living bodies and plants, not why people behave as they do=biology 研究生物的身体和植物，不是人为什么这样做|psy · chol · o · gy|a silent p, and ch said like *k*|p 不发音，ch 读作 *k*
      engineering|building bridges;designing and building machines;a love of designing machines|engineering is designing and building machines and roads; physics studies forces and energy|engineering 是设计建造；physics 研究力和能量|physics=physics is studying energy, light and forces, not designing and building machines and bridges=physics 研究能量、光和力，不是设计建造机器和桥梁;economics=economics is about money and trade, not building machines=economics 关乎金钱和贸易，不是建造机器|en · gi · neer · ing|engineer + -ing, with double e|engineer 加 -ing，ee 双写
      law|stealing;helping people in court;helmets for cyclists|law is the rules of a country; politics is about who is in power|law 是国家的法律；politics 关乎谁掌权|politics=politics is about who is in power and how they win it, not the rules that say what you must not do=politics 关乎谁掌权，不是规定你不能做什么的条文;drama=drama is acting in plays, not the rules of a country=drama 是演戏，不是国家的规则|law|against the law · break the law · study law|against the law 是“违法”
      politics|becoming mayor of the city;the people in government;who is in power and how the country is run|politics is about governments and power; economics is about money and trade|politics 关乎政府和权力；economics 关乎金钱和贸易|law=law is the rules of a country, not who is in power and how they win it=law 是国家的规则，不是谁掌权、怎样得到权力;economics=economics is about money, prices and trade, not who runs the country=economics 关乎金钱、价格和贸易，不是谁治理国家|pol · i · tics|ends in -s but takes a singular verb: politics is…|以 -s 结尾却用单数动词
      drama|acting out stories;a club that acts in plays;learning lines for the play|drama is the study and acting of plays; literature is reading books and poems|drama 是表演戏剧；literature 是阅读文学作品|literature=literature is reading books and poems, not acting out stories on a stage=literature 是阅读书和诗，不是在台上表演;music=music is singing and playing songs, not acting in plays=music 是唱歌和演奏，不是演戏|dra · ma|*drama* can also mean an exciting event in real life|*drama* 也可指现实中戏剧性的事件
    `,
  },
});

const thinking = vocabularyTopic({
  id: "b1-words-thinking",
  title: t("Thinking", "思考"),
  summary: t(
    "Reminding, imagining and wondering; realizing, believing and considering; supposing and preferring; solving, comparing, discussing and describing; making sense.",
    "提醒、想象和想知道；意识到、相信和考虑；猜想和更喜欢；解决、比较、讨论和描述；有道理。",
  ),
  intro: t(
    "Before you **decide**, **consider** both plans, **compare** them, **discuss** them with a friend and **imagine** how each would feel; you may **realize** that one is clearly better. These words help you talk about what goes on in your mind.",
    "做决定之前，先 **consider**（考虑）两个方案，**compare**（比较）一下，和朋友 **discuss**（讨论），再 **imagine**（想象）各自的感受；你也许会 **realize**（意识到）其中一个明显更好。这些词帮你谈论头脑里的想法。",
  ),
  prerequisites: ["b1-words-learning"],
  words: [
    word(
      "remind reminds reminded reminding",
      "to make someone remember something",
      "提醒；使想起",
      "I'll forget otherwise, so please {remind} me to buy milk on the way home. | This song {reminds} me of my summer holiday.|tells warns | She {reminded} us that the essay was due on Friday, as she had said last week.|told warned",
      "tell warn",
    ),
    word(
      "imagine imagines imagined imagining",
      "to make a picture of something in your mind",
      "想象",
      "Close your eyes and {imagine} a picture in your mind of a beach in the sun. | I can't {imagine} life without my phone. | As a child, she knew her toys couldn't talk, but she liked to {imagine} that they could.|guess believe",
      "guess believe",
    ),
    word(
      "wonder wonders wondered wondering",
      "to want to know something",
      "想知道",
      "I {wonder} why the sky is blue, so I'll ask my teacher tomorrow. | She {wondered} if she had left the door open, so she went back to check.|knew remembered | I was {wondering} if you could help me; are you free?|knowing remembering",
      "know remember",
    ),
    word(
      "realize realizes realized realizing",
      "to suddenly understand or notice something",
      "意识到",
      "When I got to school, I {realized} I had left my bag at home.|imagined guessed | Look at the clock! Do you {realize} how late it is? | He didn't {realize} that the shop was closed until he reached the door.",
      "imagine guess",
    ),
    word(
      "believe believes believed believing",
      "to think that something is true",
      "相信",
      "Do you {believe} in ghosts? | Nobody {believed} his story about the dog eating his homework; they all thought it was a lie.|imagined guessed | I'm sure of it: I {believe} every child should go to school.",
      "imagine guess",
      "suppose",
    ),
    word(
      "consider considers considered considering",
      "to think carefully about something before deciding",
      "考虑",
      "We're {considering} moving to a bigger flat, but we haven't decided yet.|preferring realizing | Please think carefully and {consider} my idea before you say no. | She {considered} studying abroad for a long time, but in the end decided to stay.|preferred realized",
      "prefer realize",
    ),
    word(
      "suppose supposes supposed supposing",
      "to think that something is probably true",
      "猜想；认为",
      "I {suppose} you're right; I can't think of a better answer. | The lights are off, so I {suppose} they've gone out. | Where's Tom? I {suppose} he's still in bed; he usually is at this time.",
      "doubt prefer",
      "guess believe",
    ),
    word(
      "prefer prefers preferred preferring",
      "to like one thing more than another",
      "更喜欢",
      "I {prefer} tea to coffee, so I drink tea every morning. | Which seat would you {prefer}: by the window or by the door? Choose the one you like. | She {prefers} walking to taking the bus, because she likes the fresh air.|compares considers",
      "compare consider",
    ),
    word(
      "solve solves solved solving",
      "to find the answer to a problem",
      "解决；解答",
      "Can you {solve} this math problem? I can't find the answer. | The engineers {solved} the problem with the bridge, and now it is safe again.|guessed compared | We need to {solve} this problem together and find a way out.",
      "guess compare",
    ),
    word(
      "compare compares compared comparing",
      "to look at two or more things to see how they are the same or different",
      "比较",
      "{Compare} the two pictures and find five differences. | Don't {compare} yourself to your brother; you are different, not worse. | {Compared} to Beijing, my town is very quiet.|Preferred Described",
      "prefer describe",
    ),
    word(
      "discuss discusses discussed discussing",
      "to talk about something with other people",
      "讨论",
      "Let's {discuss} this together at the meeting and hear everyone's opinion. | We {discussed} the problem with our teacher for an hour, sharing our ideas.|described compared | In groups, talk with each other and {discuss} your favorite books.",
      "describe compare",
    ),
    word(
      "describe describes described describing",
      "to say what something or someone is like",
      "描述",
      "Can you {describe} the man you saw: how tall was he, and what was he wearing? | She {described} her new house so well that I could picture every room.|discussed compared | {Describe} your best friend in five sentences: say what she looks like and what she is like.",
      "discuss compare",
    ),
    word(
      "sense senses",
      "a feeling or an understanding; one of sight, hearing, smell, taste and touch; a meaning",
      "感觉；意识；意义",
      "Of the five, the {sense} I use most is sight. | Dogs have a very good {sense} of smell, so they can find things with their noses. | Hearing and smell are two of our five {senses}.|memories minds",
      "memory mind",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        '*Discuss* and *describe* are both ways of talking, but you *discuss* a subject with other people and share opinions, and you *describe* what something is like so that someone can picture it. Look for "with" and "opinions", or for what someone looks like.',
        "*discuss* 和 *describe* 都是“说”，但 *discuss* 是和别人一起讨论、交换看法，*describe* 是描述某物的样子让人能想象出来。留意 “with” 和 “opinions”，或者对外貌的描写。",
      ),
      meaning: t(
        "*Remind* is not *remember*: you *remember* something yourself, and you *remind* another person so that they remember it. Check whether the meaning makes someone else remember.",
        "*remind* 不是 *remember*：*remember* 是自己记得，*remind* 是让别人记起来。看清释义是不是让别人想起某事。",
      ),
      spell: t(
        "*Believe* has ie after the l, and *prefer* doubles the r in *preferred* and *preferring* because the stress is on -fer.",
        "*believe* 里 l 后面是 ie；*prefer* 重音在 -fer，所以 *preferred*、*preferring* 要双写 r。",
      ),
    },
    notes: `
      remind|milk I would otherwise forget;a song that brings back a summer holiday;an essay date said last week|to remind is to make someone else remember; to tell is to give them new information|remind 是提醒别人记起；tell 是告诉别人新信息|tell/tells/told=tell means to give someone new information, not to make them remember something they already knew=tell 是告诉新的信息，不是让人想起已知的事;warn/warns/warned=warn means to tell someone about a danger, not to make them remember something=warn 是提醒危险，不是让人想起某事|re · mind|remind someone to do something · remind someone of something|remind sb to do / of sth
      imagine|a picture in your mind with closed eyes;life without a phone;toys talking that she knew couldn't talk|to imagine is to make a picture in your mind; to believe is to think something is true|imagine 是在脑中想象；believe 是相信为真|guess=guess means to give an answer without knowing, not to make a picture in your mind=guess 是不确定地猜，不是在脑中构想画面;believe=believe means to think something is really true, not to picture something you know is not real=believe 是认为确实如此，不是想象明知不真的事|im · ag · ine|g said like j, and the noun drops the e: imagination|g 读作 j；名词去掉 e：imagination
      wonder|why the sky is blue, to ask a teacher about;a door that may be open, so she went back;help asked for politely|to wonder is to want to know; to know is to be sure already|wonder 是想知道；know 是已经知道|know/knew/knowing=know means to be sure already, not to want to find out=know 是已经知道，不是想去弄清;remember/remembered/remembering=remember means to keep something in your mind from before, not to want to find something out=remember 是记得以前的事，不是想弄清楚|won · der|o said like *u*; *wander* with a means to walk around|o 读作 *u*；带 a 的 *wander* 是“闲逛”
      realize|a bag left at home noticed at school;the clock showing how late it is;a closed shop noticed at the door|to realize is to suddenly understand something true; to imagine is to picture something in your mind|realize 是突然意识到；imagine 是想象|imagine/imagined=imagine means to make a picture in your mind, not to suddenly notice something true=imagine 是在脑中想象，不是突然注意到真实情况;guess/guessed=guess means to give an answer without being sure, not to suddenly understand what is really true=guess 是不确定地猜，不是突然明白真相|re · al · ize|real + -ize; British English also writes *realise*|real 加 -ize；英式也写 *realise*
      believe|ghosts;a story everyone thought was a lie;every child going to school|to believe is to think that something is true; to guess is to answer without being sure|believe 是相信；guess 是猜|imagine/imagined=imagine means to make a picture in your mind, not to think something is really true=imagine 是在脑中想象，不是认为确实如此;guess/guessed=guess means to answer without being sure, not to feel sure something is true=guess 是没把握地猜，不是确信为真|be · lieve|believe in something · believe someone|believe in 是“信仰、相信存在”
      consider|a bigger flat not decided yet;an idea before saying no;studying abroad before deciding to stay|to consider is to think carefully before deciding; to prefer is to like one thing more|consider 是考虑；prefer 是更喜欢|prefer/preferring/preferred=prefer means to like one thing more than another, not to think carefully before you decide=prefer 是更喜欢，不是在决定前仔细考虑;realize/realizing/realized=realize means to suddenly understand something, not to think carefully over time=realize 是突然意识到，不是长时间仔细考虑|con · sid · er|consider doing something, with -ing|consider doing，后接 -ing
      suppose|the best answer you can think of;lights off meaning they've gone out;Tom in bed as he usually is|to suppose is to think something is probably true; to doubt is to think it is probably not|suppose 是猜想多半如此；doubt 是怀疑|doubt=doubt means to think something is probably not true, the opposite of thinking it probably is=doubt 是认为多半不对，正好和认为多半如此相反;prefer=prefer means to like one thing more, not to think something is probably true=prefer 是更喜欢，不是认为多半如此|sup · pose|be supposed to means should: you're supposed to wear a uniform|be supposed to 表示“应该”
      prefer|tea every morning instead of coffee;the seat you like best;walking for the fresh air|to prefer is to like one thing more than another; to compare is to look at how they differ|prefer 是更喜欢；compare 是比较|compare/compares=compare means to look at how things are the same or different, not to like one more=compare 是看异同，不是更喜欢其中一个;consider/considers=consider means to think carefully about something, not to like one thing more than another=consider 是仔细考虑，不是更喜欢某样|pre · fer|prefer A to B · preferred, preferring with double r|prefer A to B；preferred 双写 r
      solve|a math problem with no answer yet;a bridge made safe again;a way out found together|to solve is to find the answer to a problem; to guess is to give an answer without being sure|solve 是解决；guess 是猜|guess/guessed=guess means to give an answer without being sure, not to find the real answer to a problem=guess 是不确定地猜，不是找到真正的答案;compare/compared=compare means to look at how things are the same or different, not to find an answer=compare 是看异同，不是找到答案|solve|solve a problem · solve a mystery; the noun is *solution*|名词是 *solution*
      compare|five differences between two pictures;yourself and your brother;a quiet town and Beijing|to compare is to look at how things are the same or different; to prefer is to like one more|compare 是比较；prefer 是更喜欢|prefer/Preferred=prefer means to like one thing more, not to look at how two things are the same or different=prefer 是更喜欢，不是看两样东西的异同;describe/Described=describe means to say what one thing is like, not to look at two things side by side=describe 是说一样东西的样子，不是把两样放在一起比|com · pare|compare A with B or compare A to B; compared to…|compare A with/to B
      discuss|everyone's opinion at the meeting;sharing ideas with a teacher for an hour;favorite books in groups|to discuss is to talk about something with other people; to describe is to say what something is like|discuss 是和别人讨论；describe 是描述|describe/described=describe means to say what something is like, not to share opinions about it with others=describe 是说某物的样子，不是和别人交换看法;compare/compared=compare means to look at how things are the same or different, not to talk with others and share opinions=compare 是看异同，不是和别人交换看法|dis · cuss|discuss something, with no *about*|discuss sth，不加 about
      describe|how tall a man was and what he wore;every room of a new house;what a best friend looks like|to describe is to say what something is like; to discuss is to talk about it with others|describe 是描述；discuss 是讨论|discuss/discussed=discuss means to talk about something with others and share opinions, not to tell what it looks like=discuss 是和别人交换看法，不是讲它的样子;compare/compared=compare means to look at two things to see how they differ, not to say what one is like=compare 是看两样东西的不同，不是说一样东西的样子|de · scribe|describe something to someone; the noun is *description*|describe sth to sb；名词 *description*
      sense|sight, used most of the five;a dog's nose for smell;hearing and smell among the five|a sense is sight, hearing, smell, taste or touch, or an understanding; a memory is something you remember|sense 是感官或感觉；memory 是记忆|memory/memories=memory is something you keep in your mind from before, not sight, hearing or smell=memory 是记住的往事，不是视觉、听觉或嗅觉;mind/minds=mind is the part of you that thinks, not one of sight, hearing, smell, taste and touch=mind 是思考的头脑，不是五种感官之一|sense|make sense · a sense of humor · the five senses|make sense 是“说得通”
    `,
  },
});

const qualities = vocabularyTopic({
  id: "b1-words-qualities",
  title: t("Qualities", "品质"),
  summary: t(
    "Creative, intelligent, clever and wise; talent and talented; confident, independent, responsible and thoughtful; lazy and brave.",
    "有创造力的、聪明的、机灵的和明智的；天赋和有天赋的；自信的、独立的、负责的和体贴的；懒惰的和勇敢的。",
  ),
  intro: t(
    "Our class is a mix: one girl is **creative**, one boy is **talented** at music, another is **responsible** and **independent**, and our **wise** teacher helps everyone feel **confident**. These words help you describe what people are like and what they are good at.",
    "我们班什么人都有：一个女孩 **creative**（有创造力），一个男孩在音乐上很 **talented**（有天赋），还有人 **responsible**（负责任）又 **independent**（独立），我们那位 **wise**（睿智的）老师让每个人都 **confident**（自信）。这些词帮你描述人的性格和特长。",
  ),
  prerequisites: ["a1-words-describing-people"],
  words: [
    word(
      "creative",
      "good at thinking of new ideas and making things",
      "有创造力的",
      "She's very {creative}. She paints, writes songs and makes her own clothes. | We need a {creative} idea for the school poster: something new that nobody has drawn before. | Art class helps children to be {creative} and make new things of their own.",
      "confident responsible",
    ),
    word(
      "intelligent",
      "able to learn and understand things quickly",
      "聪明的",
      "Dolphins are very {intelligent} animals that learn new tricks quickly. | She's {intelligent} and learns quickly, but she doesn't always work hard. | He asked some very {intelligent} questions that showed he understood the lesson quickly.",
      "creative confident",
      "clever wise",
    ),
    word(
      "clever cleverer cleverest",
      "quick at learning and understanding",
      "聪明的；机灵的",
      "What a {clever} answer! You worked out the puzzle so quickly. | She's the {cleverest} girl in the class. She always gets full marks.|bravest kindest | My little brother is {clever}. He can already read, and he's only four.",
      "brave kind",
      "intelligent wise",
    ),
    word(
      "wise wiser wisest",
      "able to make good decisions because of knowledge and experience",
      "明智的；有智慧的",
      "My grandfather is a {wise} old man who knows so much that people often ask him for advice. | It was {wise} to take an umbrella. It rained all day. | It's not {wise} to swim after a big meal; doctors say it's a bad decision.",
      "brave kind",
      "clever intelligent",
    ),
    word(
      "talent talents",
      "a natural ability to do something well",
      "天赋；才能",
      "She has a real {talent} for music that she was born with. | The show is looking for young people with {talent} who can sing or dance well. | He has many {talents}: he sings, dances and paints.|efforts memories",
      "effort memory",
      "talented",
    ),
    word(
      "talented",
      "having a natural ability to do something well",
      "有天赋的",
      "He's a very {talented} singer, born with a wonderful voice. | The school only takes {talented} young dancers who were born to dance. | She's {talented} at drawing: her pictures look real.",
      "confident brave",
      "talent",
    ),
    word(
      "confident",
      "sure that you can do something well",
      "自信的",
      "After a lot of practice, I felt {confident} before the exam. | She's a {confident} speaker. She isn't afraid of big groups. | Be {confident}! You know the answers.",
      "responsible thoughtful",
    ),
    word(
      "independent",
      "able to do things without help from other people",
      "独立的",
      "At eighteen, many young people want to be {independent} from their parents. | She's very {independent}: she cooks, cleans and pays her own bills without anyone's help. | The country became {independent} in 1960.",
      "confident responsible",
    ),
    word(
      "responsible",
      "having the job of looking after something; able to be trusted",
      "负责任的；负责的",
      "Who is {responsible} for feeding the cat this week? | Her parents can trust her to stay home alone, because she is {responsible} and always does what she promises. | Drivers are {responsible} for the safety of their passengers.",
      "independent confident",
    ),
    word(
      "thoughtful",
      "kind and always thinking of what other people need",
      "体贴的",
      "It was very {thoughtful} of you to bring me flowers. | He's a {thoughtful} son. He calls his mother every day. | Thank you for the {thoughtful} gift: you knew exactly what I needed.",
      "creative confident",
    ),
    word(
      "lazy lazier laziest",
      "not wanting to work or do anything",
      "懒惰的",
      "He's too {lazy} to make his bed, though he has nothing else to do. | On Sunday I felt {lazy} and stayed on the sofa all morning, doing nothing. | Our cat is the {laziest} animal I know. It sleeps all day.|busiest bravest",
      "busy brave",
    ),
    word(
      "brave braver bravest",
      "not afraid of danger",
      "勇敢的",
      "The {brave} firefighter ran into the burning house. | Be {brave}. The doctor won't hurt you. | It was {brave} of her to speak in front of the whole school, though she was afraid.",
      "lazy thoughtful",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Clever* and *wise* both praise the mind, but *clever* means quick at learning, and *wise* means making good decisions because of experience. Look for speed and marks, or for advice and good choices.",
        "*clever* 和 *wise* 都是夸头脑，但 *clever* 是学得快，*wise* 是凭经验做出好的判断。留意句中说的是速度和分数，还是建议和明智的选择。",
      ),
      meaning: t(
        "*Talent* and *talented* are a pair learners mix up: *talent* is the noun, the natural ability, and *talented* is the adjective, having it. Check whether the meaning is the ability itself or a person who has it.",
        "*talent* 和 *talented* 常被混用：*talent* 是名词，指天赋本身；*talented* 是形容词，指有天赋的。看清释义说的是能力本身，还是拥有能力的人。",
      ),
      spell: t(
        "*Independent* ends in -ent, never -ant, and *responsible* ends in -ible, never -able.",
        "*independent* 以 -ent 结尾，不是 -ant；*responsible* 以 -ible 结尾，不是 -able。",
      ),
    },
    notes: `
      creative|painting, songs and her own clothes;something new for a poster;new things of their own in art class|creative means good at new ideas and making things; confident means sure of yourself|creative 是有创造力的；confident 是自信的|confident=confident means sure you can do something well, not good at making new things=confident 是相信自己能做好，不是擅长创造新东西;responsible=responsible means able to be trusted, not good at new ideas=responsible 是可靠负责的，不是擅长新点子|cre · a · tive|create + -ive, dropping the e|create 去 e 加 -ive
      intelligent|dolphins learning tricks quickly;learning quickly without always working hard;questions showing quick understanding|intelligent means able to learn and understand quickly; creative means good at new ideas|intelligent 是聪明、理解快；creative 是有创造力|creative=creative means good at making new things, not quick at learning and understanding=creative 是擅长创造，不是学得快、理解快;confident=confident means sure of yourself, not quick at understanding=confident 是自信的，不是理解得快|in · tel · li · gent|double l, and -ent at the end|双写 l，结尾是 -ent
      clever|a puzzle worked out quickly;full marks every time;reading at four|clever means quick at learning; kind means nice to others|clever 是聪明机灵；kind 是善良的|brave/bravest=brave means not afraid of danger, not quick at learning=brave 是勇敢的，不是学得快;kind/kindest=kind means nice and helpful to others, not quick at learning=kind 是善良的，不是学得快|clev · er|clever, cleverer, cleverest|比较级 cleverer，最高级 cleverest
      wise|an old man people ask for advice;an umbrella on a rainy day;swimming after a big meal|wise means making good decisions from experience; clever means quick at learning|wise 是明智的、有智慧的；clever 是学得快|brave=brave means not afraid of danger, not making good decisions=brave 是不怕危险，不是做出明智的决定;kind=kind means nice to others, not making good decisions from experience=kind 是对人好，不是凭经验做出好决定|wise|the noun is *wisdom*, with the i said short|名词 *wisdom* 里 i 读短音
      talent|music she was born with;young people who sing or dance well;singing, dancing and painting|a talent is a natural ability; effort is hard work you do|talent 是天赋；effort 是努力|effort/efforts=effort is the hard work you put in, not an ability you were born with=effort 是付出的努力，不是天生的能力;memory/memories=memory is remembering things, not a natural skill such as music or dance=memory 是记忆，不是音乐、舞蹈这样的天赋|tal · ent|a talent for something, with *for*|a talent for…，用 for
      talented|a singer born with a wonderful voice;young dancers born to dance;pictures that look real|talented means having a natural ability; confident means sure of yourself|talented 是有天赋的；confident 是自信的|confident=confident means feeling sure, not having a natural ability=confident 是感到有把握，不是有天赋;brave=brave means not afraid of danger, not born with a skill=brave 是勇敢的，不是生来有某种本领|tal · ent · ed|talent + -ed; talented at or in something|talent 加 -ed
      confident|practice before an exam;a speaker not afraid of big groups;knowing the answers|confident means sure you can do something well; responsible means able to be trusted|confident 是自信的；responsible 是负责任的|responsible=responsible means you can be trusted to do your job, not that you feel sure of yourself=responsible 是可靠、尽责，不是对自己有信心;thoughtful=thoughtful means thinking of what others need, not feeling sure of yourself=thoughtful 是体贴别人，不是对自己有信心|con · fi · dent|-ent at the end; *confidence* is the noun|结尾 -ent；名词是 *confidence*
      independent|eighteen-year-olds and their parents;cooking, cleaning and paying bills without help;a country in 1960|independent means doing things without help; responsible means able to be trusted|independent 是独立的；responsible 是负责任的|confident=confident means sure you can do something, not doing things without help=confident 是有信心，不是不靠别人;responsible=responsible means you can be trusted, not that you do everything without help=responsible 是靠得住，不是凡事不靠别人|in · de · pend · ent|independent of or from something; -ent at the end|independent of/from；结尾 -ent
      responsible|feeding the cat this week;doing what she promises when home alone;the safety of passengers|responsible means having a job to look after or able to be trusted; independent means needing no help|responsible 是负责的、可靠的；independent 是独立的|independent=independent means needing no help from others, not having the job of looking after something=independent 是不需要别人帮助，不是负责照看某事;confident=confident means sure of yourself, not trusted to look after things=confident 是自信的，不是被托付照看某事|re · spon · si · ble|responsible for something, with *for*|responsible for…，用 for
      thoughtful|flowers you brought;a son who calls his mother every day;a gift that was exactly what I needed|thoughtful means kind and thinking of others; creative means full of new ideas|thoughtful 是体贴的；creative 是有创造力的|creative=creative means good at new ideas, not thinking of what other people need=creative 是有创意，不是想到别人需要什么;confident=confident means sure of yourself, not thinking of others=confident 是自信，不是体贴别人|thought · ful|thought + -ful, one l|thought 加 -ful，只有一个 l
      lazy|a bed not made with nothing else to do;a Sunday doing nothing on the sofa;a cat that sleeps all day|lazy means not wanting to work; busy means having a lot to do|lazy 是懒惰的；busy 是忙的|busy/busiest=busy means having a lot to do, the opposite of not wanting to do anything=busy 是有很多事要做，正好和什么都不想做相反;brave/bravest=brave means not afraid of danger, not wanting to do nothing=brave 是勇敢的，不是什么都不想做|la · zy|lazy, lazier, laziest: y to i|lazy → lazier → laziest，y 变 i
      brave|a firefighter in a burning house;a visit to the doctor;speaking to the whole school while afraid|brave means not afraid of danger; thoughtful means thinking of others|brave 是勇敢的；thoughtful 是体贴的|lazy=lazy means not wanting to do anything, not facing danger=lazy 是懒惰的，不是敢于面对危险;thoughtful=thoughtful means thinking of what others need, not facing something frightening=thoughtful 是体贴别人，不是面对可怕的事|brave|brave of you to… · the bravest|it was brave of you to…
    `,
  },
});

const studySkills = vocabularyTopic({
  id: "b1-words-study-skills",
  title: t("Study Skills", "学习技能"),
  summary: t(
    "Enrolling; defining, underlining and summarizing; outlines and highlighting; repeating, correcting, copying and submitting; notes and instructions.",
    "注册；定义、画线和概括；提纲和用荧光笔标出；重复、改正、抄写和提交；笔记和说明。",
  ),
  intro: t(
    "Good students **highlight** key words, take **notes**, write an **outline**, **summarize** each chapter and **correct** their work before they **submit** it. These words help you talk about the skills that make studying easier.",
    "好学生会 **highlight**（标出）关键词、做 **notes**（笔记）、写 **outline**（提纲）、**summarize**（概括）每一章，并在 **submit**（提交）作业前 **correct**（改正）错误。这些词帮你谈论让学习更轻松的技巧。",
  ),
  prerequisites: ["b1-words-school-life"],
  words: [
    word(
      "enroll enrolls enrolled enrolling",
      "to put your name on the list for a course or a school",
      "注册；入学",
      "I've {enrolled} in a French class for beginners.|submitted copied | You can {enroll} on the course online before September and get a place. | Over 2,000 students {enroll} at the college every year and put their names on its lists.",
      "submit copy",
    ),
    word(
      "define defines defined defining",
      "to say exactly what a word means",
      "定义；解释",
      "Can you {define} the word 'education' and say exactly what it means? | The dictionary {defines} 'campus' as the land and buildings of a university.|underlines summarizes | First, {define} exactly what the problem is; then look for an answer.",
      "underline summarize",
    ),
    word(
      "underline underlines underlined underlining",
      "to draw a line under a word",
      "在……下面画线",
      "{Underline} the verbs in each sentence with your pencil. | She {underlined} the important words in red.|defined summarized | I always {underline} new words with a pencil line when I read.",
      "define summarize",
      "highlight",
    ),
    word(
      "summarize summarizes summarized summarizing",
      "to give the main points of something in a few words",
      "总结；概括",
      "{Summarize} the story in three sentences. | Can you {summarize} what the teacher said in a few words, just the main points? | The last paragraph {summarizes} the main ideas.|defines copies",
      "define copy",
    ),
    word(
      "outline outlines",
      "a short plan of the main points of a piece of writing",
      "提纲；大纲",
      "Before you start your essay, write an {outline} with your main points in order. | Here is an {outline} of the course: twelve units in two terms. | My {outline} is just a list of three points: the beginning, the middle and the end.",
      "instruction essay",
      "note",
    ),
    word(
      "highlight highlights highlighted highlighting",
      "to mark words with a bright color so they are easy to see; to show that something is important",
      "用荧光笔标出；突出",
      "{Highlight} the key words in yellow. | The report {highlights} the problems with the school's food.|defines copies | She {highlighted} every new word in the text in bright green.|defined copied",
      "define copy",
      "underline",
    ),
    word(
      "repeat repeats repeated repeating",
      "to say or do something again",
      "重复",
      "Could you {repeat} that, please? I didn't hear you. | Listen and {repeat} after me. | He had to {repeat} the year because he failed his exams.|copy correct",
      "copy correct",
    ),
    word(
      "correct corrects corrected correcting",
      "to make something right; to mark the mistakes in a piece of work",
      "改正；批改",
      "The teacher {corrected} my spelling mistakes with a red pen, so now they are right.|copied repeated | Please {correct} me if I say something wrong. | Read your essay again and {correct} any mistakes so they are right.",
      "copy repeat",
    ),
    word(
      "copy copies copied copying",
      "to write or make something exactly the same as another thing",
      "抄写；复制",
      "{Copy} the new words into your notebook. | He {copied} his friend's homework word for word, and the teacher saw it.|corrected repeated | Can you make three {copies} of this page?|outlines notes",
      "correct repeat",
    ),
    word(
      "submit submits submitted submitting",
      "to give your work to someone to check",
      "提交",
      "Please {submit} your essays to me by Friday so I can check them. | I {submitted} my application online, and now I'm waiting for an answer.|copied repeated | All work must be {submitted} to the teacher before the deadline.|copied repeated",
      "copy repeat",
    ),
    word(
      "note notes",
      "a few words you write down to help you remember",
      "笔记；便条",
      "Take {notes} during the lesson.|certificates deadlines | I left a {note} on the fridge for my mom. | Can I borrow your {notes} from yesterday's class?|certificates deadlines",
      "certificate deadline",
      "outline",
    ),
    word(
      "instruction instructions",
      "words that tell you how to do something",
      "说明；指示",
      "Read the {instructions} that tell you how to use the machine before you turn it on.|notes outlines | Follow the teacher's {instructions} and do exactly what she says.|notes outlines | The {instructions} that tell you how to build the shelf are in English and Chinese.|notes outlines",
      "note outline",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        '*Underline* and *highlight* both mark words so you can find them, but you *underline* with a line under the word, and you *highlight* by coloring over it. Look for "line", "pen" or "pencil", or for a bright color.',
        "*underline* 和 *highlight* 都是给词做标记，但 *underline* 是在词下面画线，*highlight* 是用颜色涂在词上。留意 “line”“pen”“pencil”，还是鲜艳的颜色。",
      ),
      meaning: t(
        "*Summarize* and *define* are both short explanations, but you *summarize* a text by giving its main points, and you *define* a word by saying exactly what it means. Check whether the meaning is about main points or one word.",
        "*summarize* 和 *define* 都是简短的说明，但 *summarize* 是概括一段文字的要点，*define* 是准确说明一个词的意思。看清释义说的是要点，还是一个词。",
      ),
      spell: t(
        "*Submit* doubles the t in *submitted* and *submitting*, and *enroll* has a double l in American English but often one in British *enrol*.",
        "*submit* 在 *submitted*、*submitting* 中双写 t；*enroll* 美式双写 l，英式常写作 *enrol*。",
      ),
    },
    notes: `
      enroll|a French class for beginners;a place on the course before September;names on the college's lists|to enroll is to put your name on the list for a course; to submit is to hand in work|enroll 是报名注册；submit 是提交作业|submit/submitted=submit means to hand in finished work, not to put your name on the list for a course=submit 是交上完成的作业，不是报名参加课程;copy/copied=copy means to write the same thing again, not to join a course=copy 是照抄，不是报名入学|en · roll|enroll in or on a course; enroll at a school|enroll in/on a course；enroll at a school
      define|the exact meaning of 'education';'campus' in a dictionary;exactly what the problem is|to define is to say exactly what a word or problem is; to summarize is to give the main points|define 是下定义；summarize 是概括要点|underline/underlines=underline means to draw a line under a word, not to say what it means=underline 是在词下画线，不是说明意思;summarize/summarizes=summarize means to give the main points of a text, not the exact meaning of one word=summarize 是概括一段话的要点，不是一个词的确切意思|de · fine|the noun is *definition*|名词是 *definition*
      underline|verbs marked with a pencil;important words in red;new words marked with a pencil line|to underline is to draw a line under a word; to define is to say what it means|underline 是画线；define 是下定义|define/defined=define means to say what a word means, not to draw a line under it=define 是说明词义，不是在下面画线;summarize/summarized=summarize means to give the main points, not to draw lines under words=summarize 是概括要点，不是在词下画线|un · der · line|under + line, one word|under 加 line，写成一个词
      summarize|a story in three sentences;the teacher's main points in a few words;the main ideas in the last paragraph|to summarize is to give the main points in a few words; to copy is to write all of it again|summarize 是概括；copy 是照抄|define/defines=define means to say exactly what one word means, not to give the main points of a whole text=define 是说明一个词的意思，不是概括整段内容;copy/copies=copy means to write every word again, not to give the main points in a few words=copy 是一字不差地照抄，不是用几句话概括|sum · ma · rize|double m: summary + -ize, y dropped|双写 m：summary 去 y 加 -ize
      outline|main points in order before an essay;twelve units of a course in two terms;a list of three points|an outline is a short plan of the main points; an essay is the whole finished piece|outline 是要点提纲；essay 是完整的文章|instruction=instruction tells you how to do something, not a plan of the main points of your writing=instruction 告诉你怎样做，不是写作要点的提纲;essay=essay is the whole finished writing, not the short plan before it=essay 是完整的文章，不是写之前的简短提纲|out · line|out + line; an outline of something|out 加 line；an outline of…
      highlight|key words in yellow;problems with school food in a report;new words in bright green|to highlight is to color words to make them stand out or to show something is important; to copy is to write it again|highlight 是用颜色标出或强调；copy 是照抄|define/defines/defined=define means to say what a word means, not to color it or show it is important=define 是说明词义，不是涂色或强调;copy/copies/copied=copy means to write something again, not to mark it so it stands out=copy 是照抄，不是标出使之醒目|high · light|gh is silent: *HY-lite*|gh 不发音：*HY-lite*
      repeat|something not heard the first time;the teacher's words said back;a school year done again after failing|to repeat is to say or do again; to correct is to make something right|repeat 是重复；correct 是改正|copy=copy means to write down the same words, not to say or do something again=copy 是把字照抄下来，不是再说或再做一遍;correct=correct means to make something right, not to do it again the same way=correct 是改对，不是照原样再做一遍|re · peat|repeat after me · repeat a year|repeat after me 是“跟我读”
      correct|spelling made right with a red pen;something said wrong;mistakes in an essay made right|to correct is to make something right; to repeat is to do it again|correct 是改正；repeat 是重复|copy/copied=copy means to write something again the same way, not to make the mistakes right=copy 是照样再写，不是把错改对;repeat/repeated=repeat means to say or do something again, not to make it right=repeat 是再做一遍，不是改对|cor · rect|double r; *correct* is also an adjective meaning right|双写 r；*correct* 也可作形容词“正确的”
      copy|new words into a notebook;a friend's homework word for word;three pages made the same|to copy is to make something exactly the same; to correct is to make it right|copy 是照抄、复制；correct 是改正|correct/corrected=correct means to make something right, not to write it exactly the same=correct 是改对，不是一模一样地照写;repeat/repeated=repeat means to say again, not to write down someone else's work=repeat 是再说一遍，不是抄别人的作业;outline/outlines=outline is a short plan of main points, not a page made exactly the same=outline 是要点提纲，不是一模一样的复印件;note/notes=note is a few words you write to remember, not a page made exactly the same=note 是为记住而写下的几个字，不是复印件|cop · y|copy, copies, copied: y to i|copy → copies → copied，y 变 i
      submit|essays handed to the teacher by Friday;an application waiting for an answer;work handed to the teacher before the deadline|to submit is to hand in your work to be checked; to copy is to write the same again|submit 是提交；copy 是抄写|copy/copied=copy means to write something exactly the same, not to hand it in to be checked=copy 是照抄，不是交上去检查;repeat/repeated=repeat means to say or do again, not to give your work to someone=repeat 是再做一遍，不是把作业交给别人|sub · mit|submitted, submitting with double t|submitted、submitting 双写 t
      note|words written during the lesson;a message on the fridge for mom;yesterday's class written down|a note is a few words you write to remember; an instruction tells you what to do|note 是笔记、便条；instruction 是指示|certificate/certificates=certificate is an official paper that shows you passed, not words you write to remember=certificate 是证明通过的正式证书，不是为记住而写的字;deadline/deadlines=deadline is the last day to finish work, not words you write down=deadline 是完成作业的最后一天，不是写下的字|note|take notes · leave a note|take notes 是“记笔记”
      instruction|how to use a machine before turning it on;doing exactly what the teacher says;how to build a shelf in two languages|instructions tell you how to do something; notes are what you write to remember|instruction 是操作说明或指示；note 是自己写的笔记|note/notes=note is what you write to help you remember, not words that tell you how to do something=note 是帮自己记住的字，不是告诉你怎么做的说明;outline/outlines=outline is a short plan of main points, not words that tell you what to do=outline 是要点提纲，不是指示你做什么|in · struc · tion|usually plural: follow the instructions|常用复数：follow the instructions
    `,
  },
});

const linking = vocabularyTopic({
  id: "b1-words-little-words-4",
  title: t("Linking Words 1", "连接词 1"),
  summary: t(
    "Within, might, whose and whom; although, though and however; unless, either, neither and whether; toward.",
    "within、might、whose 和 whom；although、though 和 however；unless、either、neither 和 whether；toward。",
  ),
  intro: t(
    "**Although** it was late, I walked **toward** the station: I **might** catch the last train, **unless** it had left, and I didn't know **whether** to run. These small words join ideas and show how they are linked.",
    "**Although**（虽然）已经很晚了，我还是 **toward**（朝着）车站走去：我 **might**（可能）赶上末班车，**unless**（除非）它已经开走了，我也不知道 **whether**（是否）该跑。这些小词把想法连接起来，说明它们之间的关系。",
  ),
  prerequisites: ["a2-words-little-words-3"],
  words: [
    word(
      "within",
      "inside a period of time or a distance",
      "在……之内",
      "Please answer {within} two days, before Friday at the latest. | The school is {within} walking distance of my house. | You'll get your results {within} a week, or maybe sooner.",
      "toward during",
    ),
    word(
      "might",
      "a word that shows that something is possible",
      "可能",
      "Take an umbrella: it {might} rain later, though I'm not sure. | I {might} go to the party, but I'm not sure. | He {might} be at home, or he might be at work: try calling him.",
      "must will",
    ),
    word(
      "whose",
      "a word that asks or tells who something belongs to",
      "谁的",
      "{Whose} bag is this? I want to give it back to its owner. | That's the girl {whose} father is a pilot. | I don't know {whose} phone this is.",
      "whom which",
    ),
    word(
      "whom",
      "who, used after words such as to, with and for",
      "谁（宾格）",
      "To {whom} should I send the letter? | The man with {whom} she works is from Canada. | {Whom} did you meet at the party?",
      "whose whether",
    ),
    word(
      "although",
      "a word that joins two ideas when the second one is surprising",
      "尽管；虽然",
      "{Although} it was raining hard, we still went for a walk.|Because Unless | I enjoyed the film, {although} it was much too long. | {Although} she's only ten, she plays the piano beautifully.|Because Unless",
      "because unless",
      "though however",
    ),
    word(
      "though",
      "although; but, at the end of a sentence",
      "虽然；不过",
      "It's a small flat. I like it, {though}. | Even {though} he was tired, he finished his homework. | {Though} the test was hard, everyone passed.",
      "because unless",
      "although however",
    ),
    word(
      "however",
      "but; a word that adds an idea that is different",
      "然而；但是",
      "The hotel was nice. {However}, the food was terrible.|Instead Also | I'd love to come. {However}, I have an exam that day, so I can't.|Instead Also | Most students passed. Some, {however}, need to take the test again.",
      "instead also",
      "although though",
    ),
    word(
      "unless",
      "except if",
      "除非",
      "You can't go out {unless} you finish your homework. | I'll walk to school {unless} it rains; if it rains, I'll take the bus. | {Unless} you hurry, you'll miss the bus.|If Because",
      "if because",
    ),
    word(
      "either",
      "one or the other of two; also, after a sentence with not",
      "两者之一；也（用于否定句）",
      "You can have {either} tea or coffee. | I don't like it, and my sister doesn't {either}. | There are shops on {either} side of the street.",
      "neither both",
    ),
    word(
      "neither",
      "not one and not the other of two",
      "两者都不",
      '{Neither} of my parents can swim, so they never go in the sea.|Either Both | "I don\'t like coffee." "{Neither} do I." | {Neither} answer is right. Try again.|Either Both',
      "either both",
    ),
    word(
      "whether",
      "if, when there are two possible answers",
      "是否",
      "I don't know {whether} to laugh or cry. | She asked me {whether} I was coming to the party. | {Whether} you like it or not, you have to go to school.",
      "unless either",
    ),
    word(
      "toward",
      "in the direction of",
      "朝着；向",
      "The dog ran {toward} me. | She walked {toward} the door but stopped before she reached it. | We drove {toward} the mountains, which got bigger as we came closer.",
      "within across",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Although* and *however* both bring a surprise, but *although* joins two parts inside one sentence, and *however* starts a new sentence or sits between commas. Look at the full stop: if a new sentence begins at the gap, it is *however*.",
        "*although* 和 *however* 都引出转折，但 *although* 在同一个句子里连接两部分，*however* 用在新句子开头或夹在逗号之间。看句号：如果空格处开始了新句子，就用 *however*。",
      ),
      meaning: t(
        "*Whose* and *who's* sound the same, but *whose* asks who something belongs to, and *who's* is short for *who is*. Check whether the meaning is about belonging.",
        "*whose* 和 *who's* 读音相同，但 *whose* 问东西属于谁，*who's* 是 *who is* 的缩写。看清释义是不是在说归属。",
      ),
      spell: t(
        "*Neither* and *either* both have ei, not ie, and *toward* has no s in American English, while British English often writes *towards*.",
        "*neither* 和 *either* 都写 ei，不写 ie；美式 *toward* 没有 s，英式常写 *towards*。",
      ),
    },
    notes: `
      within|two days before Friday;walking distance of my house;a week or sooner|within means inside a time or distance, not later; during means at some time in a period|within 是在……之内；during 是在……期间|toward=toward means in the direction of a place, not inside a time limit=toward 是朝着某处，不是在时限之内;during=during means at some time while something is happening, not before a time limit ends=during 是在某事进行期间，不是在期限到之前|with · in|with + in, one word|with 加 in，写成一个词
      might|rain that may come later;a party I'm not sure about;home or work|might shows that something is possible; must shows that it is necessary or certain|might 表示可能；must 表示必须或肯定|must=must shows that something is necessary or that you are sure, not that it is only possible=must 表示必须或很肯定，不是仅仅有可能;will=will shows that something is sure to happen, not only possible=will 表示一定会发生，不是只是可能|might|might + verb with no -s and no to: it might rain|might 后接动词原形，不加 to
      whose|a bag given back to its owner;a girl and her pilot father;a phone that belongs to someone|whose asks or tells who something belongs to; whom is the person something is done to|whose 问或说明属于谁；whom 是动作的对象|whom=whom is the person after to, with or for, not the owner of something=whom 是介词后面的“谁”，不是东西的主人;which=which asks you to choose from a group, not who owns something=which 是在几个中选一个，不是问谁的东西|whose|*whose* says who owns it; *who's* is *who is*|*whose* 表示归属；*who's* = who is
      whom|a letter sent to someone;a man she works with;a person met at the party|whom is who after a word like to or with; whose is about who owns something|whom 是宾格的“谁”；whose 是“谁的”|whose=whose asks who owns something, not the person after to or with=whose 问东西是谁的，不是介词后面的人;whether=whether shows two possible answers, not a person=whether 表示两种可能，不是指人|whom|to whom · with whom · for whom|to whom、with whom 等
      although|rain and still a walk;a film enjoyed though much too long;a ten-year-old playing piano beautifully|although joins a surprising idea inside one sentence; because gives a reason|although 引出意外，在同一句里连接；because 给出原因|because=because gives the reason for something, not a surprising idea that goes against it=because 给出原因，不是引出相反的意外;unless=unless means except if, not a surprise that is already true=unless 是“除非”，不是已经发生的意外|al · though|one l: al-, and ough said like *oh*|只有一个 l；ough 读作 *oh*
      though|a small flat I still like;finishing homework while tired;a hard test that everyone passed|though means although, and can also end a sentence; because gives a reason|though 是“虽然”，还可放在句末；because 给出原因|because=because gives the reason, not a surprising idea=because 给出原因，不是意外的转折;unless=unless means except if, not although=unless 是“除非”，不是“虽然”|though|even though · …, though. at the end|even though；也可放句末
      however|a nice hotel with terrible food;an exam that stops me coming;students who must take the test again|however adds a different idea and starts a new sentence or sits between commas; also adds more of the same|however 引出转折；also 补充同类|instead=instead means in place of something, not a surprising different idea=instead 是“代替”，不是引出相反的意思;also=also adds one more of the same kind, not a different idea=also 补充同类，不是引出相反的意思|how · ev · er|however + comma: However, …|however 后常加逗号
      unless|going out after homework;the bus if it rains;hurrying for the bus|unless means except if; if means in the case that|unless 是“除非”；if 是“如果”|if=if means in the case that, the opposite of except if=if 是“如果”，正好和“除非”相反;because=because gives a reason, not a condition=because 给出原因，不是条件|un · less|double s; unless + present for the future: unless it rains|双写 s；unless 后用一般现在时
      either|tea or coffee;a sister who doesn't like it too;shops on both sides|either means one or the other of two, or also after not; neither means not one and not the other|either 是两者之一，或用于否定句的“也”；neither 是两者都不|neither=neither means not one and not the other, not one of the two=neither 是两者都不，不是两者之一;both=both means the two together, not one or the other=both 是两者都，不是任选其一|ei · ther|either… or…; not… either|either… or…；not… either
      neither|parents who never go in the sea;a reply to "I don't like coffee";an answer to try again|neither means not one and not the other of two; either means one or the other|neither 是两者都不；either 是两者之一|either=either means one or the other, not not one and not the other=either 是两者之一，不是两个都不;both=both means the two together, the opposite of not one and not the other=both 是两个都，正好和两个都不相反|nei · ther|Neither do I. · neither… nor…|Neither do I.；neither… nor…
      whether|laughing or crying;coming to the party or not;liking school or not|whether shows two possible answers; unless means except if|whether 表示“是否”；unless 是“除非”|unless=unless means except if, not a choice between two answers=unless 是“除非”，不是两种选择;either=either is one of two things, not a word that asks between two answers=either 是两者之一，不是引出“是否”|wheth · er|whether… or not; *weather* is rain and sun|whether… or not；*weather* 是天气
      toward|a dog running to me;a door not reached;mountains getting bigger as we came closer|toward means in the direction of; across means from one side to the other|toward 是朝着；across 是横穿|within=within means inside a time or distance, not in the direction of a place=within 是在时间或距离之内，不是朝着某处;across=across means from one side to the other, not moving in the direction of something=across 是从一边到另一边，不是朝着某物|to · ward|toward in American English, towards in British English|美式 toward，英式 towards
    `,
  },
});

// The present perfect or the past simple.

/**
 * StateVerb is a verb of a state or a habit with a subject: its present form, its past, its present perfect (with
 * has or have), the rest of the sentence, a point with since and a finished time in the past.
 */
type StateVerb = readonly [string, string, string, string, string, string, string, string];

/** stateVerbs are subject, base, present, past, present perfect, rest, since and a finished past time. */
const handStateVerbs: readonly StateVerb[] = [
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

/** stateSubjects are a subject and whether its present takes -s. */
const stateSubjects: readonly (readonly [string, boolean])[] = [
  ["My uncle", true],
  ["I", false],
  ["We", false],
  ["Anna", true],
  ["They", false],
  ["Our neighbor", true],
  ["My cousins", false],
];

/** stateActs are a state or a habit: base, present with -s, past, participle and the rest of the sentence. */
const stateActs: readonly (readonly [string, string, string, string, string])[] = [
  ["live", "lives", "lived", "lived", "in this town"],
  ["work", "works", "worked", "worked", "at the bank"],
  ["play", "plays", "played", "played", "the violin"],
  ["know", "knows", "knew", "known", "the Smiths"],
  ["have", "has", "had", "had", "a cat"],
  ["teach", "teaches", "taught", "taught", "English"],
  ["study", "studies", "studied", "studied", "French"],
  ["own", "owns", "owned", "owned", "a bike"],
  ["keep", "keeps", "kept", "kept", "a diary"],
  ["sing", "sings", "sang", "sung", "in a band"],
  ["drive", "drives", "drove", "driven", "a taxi"],
];

/** stateTimes are a point with since and a finished time in the past. */
const stateTimes: readonly (readonly [string, string])[] = [
  ["since 2018", "in 2014"],
  ["since last summer", "two years ago"],
  ["since January", "last year"],
  ["since 2020", "in the 1990s"],
];

/** stateVerbs are the hand-written verbs and one for every subject and act, with a pair of times. */
const stateVerbs: readonly StateVerb[] = [
  ...handStateVerbs,
  ...everyTriple(stateSubjects, stateActs, stateTimes).map(
    ([[subject, s], [base, third, past, participle, rest], [since, ago]]): StateVerb => [
      subject,
      base,
      s ? third : base,
      past,
      `${s ? "has" : "have"} ${participle}`,
      rest,
      since,
      ago,
    ],
  ),
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

/** PpKind is what in a sentence picks its tense: since, this is the first time, or a finished time. */
type PpKind = "since" | "first" | "finished";

/** ppKind finds what picks the tense of a sentence, and the words that show it. */
function ppKind(sentence: string): readonly [PpKind, string] {
  const since = /\bsince .+?(?=\.|$)/u.exec(sentence);
  if (since) return ["since", since[0]];
  if (sentence.startsWith("This is the first time")) return ["first", "This is the first time"];
  if (sentence.includes("last week")) return ["finished", "last week"];
  const ago = stateVerbs.map((v) => v[7]).find((time) => sentence.includes(` ${time}`));
  return ["finished", ago ?? ""];
}

/** ppRule names the rule of the tense for a sentence. */
function ppRule(sentence: string): Text {
  const [kind, words] = ppKind(sentence);
  if (kind === "since")
    return t(
      `*${words}* gives the point where it began, and it is still true now, so use the present perfect`,
      `*${words}* 说明从什么时候开始，到现在仍然如此，所以用现在完成时`,
    );
  if (kind === "first") return t("*This is the first time* takes the present perfect", "*This is the first time* 后面用现在完成时");
  return t(`*${words}* is a finished time in the past, so use the past simple`, `*${words}* 是过去已经结束的时间，所以用一般过去时`);
}

/** ppWhy puts the rule of the tense before a sentence. */
const ppWhy = (sentence: string, shown: string): Text => {
  const [kind, words] = ppKind(shown);
  const rule = ppRule(shown);
  const check =
    kind === "finished"
      ? t(
          `**Check.** Spot the finished time phrase (*${words}*): because the time is completely over, the past simple—never *have/has*—is required.`,
          `**检验。** 找到表示过去已结束的时间词（*${words}*）：时间已经彻底过去，必须用一般过去时，不能用 *have/has*。`,
        )
      : t(
          `**Check.** Spot the signal (*${words}*): it links the past up to the present, which calls for *have/has* + past participle.`,
          `**检验。** 找到关键信号（*${words}*）：它把过去一直连接到现在，因此要用 *have/has* + 过去分词。`,
        );
  return t(`${rule.en}: ${sentence}\n\n${check.en}`, `${rule["zh-CN"]}：${sentence}\n\n${check["zh-CN"]}`);
};

/** whyNotPp explains a wrong tense, from the position of the wrong form in its item. */
const whyNotPp = (wrong: string, right: string, shown: string, position: number): Text => {
  const [kind, words] = ppKind(shown);
  if (kind === "since")
    return position === 0
      ? t(
          `*${wrong}* is the present simple, which cannot be used with *since* for a state continuing from the past to now.`,
          `*${wrong}* 是一般现在时，不能和 *since* 连用来表示从过去持续到现在的状态。`,
        )
      : t(
          `*${wrong}* is the past simple, which says the state is over, but *${words}* shows it is still true now.`,
          `*${wrong}* 是一般过去时，表示已经结束，但 *${words}* 说明这件事现在仍然如此。`,
        );
  if (kind === "first")
    return position === 0
      ? t(
          `*${wrong}* is the past simple, which does not follow *This is the first time*.`,
          `*${wrong}* 是一般过去时，不能用在 *This is the first time* 后面。`,
        )
      : t(
          `*${wrong}* is the plain base form and lacks the tense form needed after *This is the first time*.`,
          `*${wrong}* 是动词原形，缺少 *This is the first time* 后面要求的时态形式。`,
        );
  if (/^ha(s|ve) /u.test(wrong))
    return t(
      `*${wrong}* is the present perfect, which cannot be paired with a finished past time such as *${words}*.`,
      `*${wrong}* 是现在完成时，不能和 *${words}* 这样的过去具体时间连用。`,
    );
  if (position === 1 && !shown.includes("last week") && wrong !== right)
    return t(
      `*${wrong}* is the present simple, but *${words}* places the event in the finished past.`,
      `*${wrong}* 是一般现在时，但 *${words}* 说明事情发生在已经结束的过去。`,
    );
  return t(
    `*${wrong}* is the base form and does not mark the past time *${words}*.`,
    `*${wrong}* 是动词原形，没有体现过去时间 *${words}*。`,
  );
};

const presentPerfectOrPastSimple: TopicDef = {
  id: "present-perfect-or-past-simple",
  title: t("The Present Perfect or the Past Simple", "现在完成时还是一般过去时"),
  summary: t(
    "I have lived here since 2019, but I lived in Paris in 2015. Since and the first time take the present perfect; a finished time takes the past simple.",
    "I have lived here since 2019，但 I lived in Paris in 2015。since 和 the first time 用现在完成时；过去的具体时间用一般过去时。",
  ),
  intro: t(
    "Compare *She has worked here since 2021* (still true now) with *She worked in Rome in 2018* (finished past). The time expression in the sentence tells you immediately whether to use the present perfect or the past simple.",
    "比较 *She has worked here since 2021*（至今仍在）和 *She worked in Rome in 2018*（已经结束的过去）。句中的时间表达直接决定了该用现在完成时还是一般过去时。",
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
        "Look at the time words.\n\n- A finished time in the past takes the **past simple**: *yesterday, last week, in 2015, two years ago, when I was little*. *I lived in Paris in 2015.*\n- A time that runs up to now takes the **present perfect**. *since* gives the point where it began: *I have lived here since 2019* (and I still live here).\n- *This is the first time* takes the present perfect: *This is the first time I have eaten sushi.* But with a finished time: *I ate sushi for the first time last week.*\n\n> **Watch out.** Never pair the present perfect with a finished time (*I have lived in Paris in 2015* is wrong), and never use the present simple with *since* (*I live here since 2019* is wrong).",
        "看句子里的时间词。\n\n- 过去某个已经结束的时间，用**一般过去时**：*yesterday, last week, in 2015, two years ago, when I was little*。*I lived in Paris in 2015.*\n- 一直延续到现在的时间，用**现在完成时**。*since* 说明从什么时候开始：*I have lived here since 2019*（现在还住在这里）。\n- *This is the first time* 后面用现在完成时：*This is the first time I have eaten sushi.* 但有过去的具体时间时：*I ate sushi for the first time last week.*\n\n> **注意。** 不要把现在完成时和过去具体时间混用（*I have lived in Paris in 2015* 是错的），也不要在 *since* 句里用一般现在时（*I live here since 2019* 是错的）。",
      ),
      choiceGenerator(
        t("Choose the words for the gap.", "选出填入空白处的词。"),
        ppChoiceBank,
        (right, shown) => ppWhy(fill(shown, right), shown),
        whyNotPp,
      ),
    ),
    point(
      "write",
      t("Writing in the right tense", "用正确的时态写句子"),
      t(
        "Write the sentence from the note. With *since* or after *This is the first time*, use *have* or *has* and the past participle: *Tom has worked at the hospital since March.* With a finished time, use the past simple: *Tom worked at the hospital two years ago.*\n\n> **Watch out.** Match *have* vs. *has* to the subject in present-perfect sentences, and use the irregular past participle (not the past simple) after *have/has*.",
        "根据笔记写句子。有 *since* 或在 *This is the first time* 后面，用 *have / has* 加过去分词：*Tom has worked at the hospital since March.* 有过去的具体时间，用一般过去时：*Tom worked at the hospital two years ago.*\n\n> **注意。** 现在完成时里要核对主语配 *have* 还是 *has*，并且 *have/has* 后面用过去分词而不是一般过去式。",
      ),
      typedGenerator("sentence-pattern", t("Write a sentence from the note.", "根据笔记写一个句子。"), ppTypedBank, (right) =>
        ppWhy(right, right),
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
  intro: t(
    "A natural email to a close friend opens warmly, replies to every point they raised, shares an update, and ends with a concrete plan: *Hi Sam, Congrats on the race! I've just started guitar lessons—why don't we meet at the café on Sunday?*",
    "给好友写的自然回信会先热情回应，逐条回答对方的问题，分享近况，再用具体邀约收尾：*Hi Sam, Congrats on the race! I've just started guitar lessons—why don't we meet at the café on Sunday?*",
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
      "An informal email to a friend has a clear shape:\n\n- Begin with *Hi* or *Hey* and the name, then react to their news: *Congratulations! That's amazing news.*\n- Answer **every** question they asked, one paragraph for each main idea.\n- Give some news of your own: *I've joined the drama club.*\n- Suggest a plan with a time and a place: *Why don't we meet at the park on Saturday?* *Shall we…?* *We could…*\n- End with *Love*, *See you* or *Best wishes* and your name.\n\nKeep the tone friendly: short forms such as *I'm* and *don't*, and words such as *great*, *really* and *so*.\n\n> **Watch out.** Do not write one solid wall of text or sound overly formal (*Yours sincerely* belongs in formal emails)—break your reply into clear paragraphs and answer every question in your friend's email.",
      "给朋友的非正式邮件有清楚的结构：\n\n- 用 *Hi* 或 *Hey* 加名字开头，然后回应对方的消息：*Congratulations! That's amazing news.*\n- 回答对方提出的**每一个**问题，每个主要意思一段。\n- 讲讲你自己的近况：*I've joined the drama club.*\n- 提出一个有时间和地点的计划：*Why don't we meet at the park on Saturday?* *Shall we…?* *We could…*\n- 结尾写 *Love*、*See you* 或 *Best wishes* 和你的名字。\n\n语气要友好：用 *I'm*、*don't* 这样的缩写，以及 *great*、*really*、*so* 这样的词。\n\n> **注意。** 不要把整封信挤成一大段，也不要用过于正式的套话（*Yours sincerely* 属于正式邮件）——分段作答并确保回应朋友提出的每一个问题。",
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
