// A1, unit 8: School. School subjects, schoolwork and little words, don't and doesn't, do and does questions, and
// writing questions.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, interleave, sentenceCase, vocabularyTopic, word } from "../words.ts";
import {
  presentSimpleNegativesFixNot,
  presentSimpleNegativesMakeNot,
  presentSimpleQuestionsWriteNot,
  writingQuestionsWriteNot,
} from "./mistakes.ts";

const schoolSubjects = vocabularyTopic({
  id: "a1-words-school-subjects",
  title: t("School Subjects", "学科"),
  summary: t(
    "Math, science, art and history, classes, lessons and tests, learning and teaching.",
    "数学、科学、美术和历史，课、课程和测验，学和教。",
  ),
  intro: t(
    "On Monday we have **math** and **science**, and on Friday we have **art**. The **test** is **easy** for me. These words help you talk about what you learn at school.",
    "星期一我们上 **math**（数学）和 **science**（科学），星期五上 **art**（美术）。这次 **test**（测验）对我来说很 **easy**（容易）。这些词帮你谈论在学校学什么。",
  ),
  prerequisites: ["pre-a1-words-classroom"],
  words: [
    word(
      "math",
      "the subject of numbers and shapes",
      "数学",
      "In {math}, we learn to add and take away numbers. | Two plus two is four. {Math} is easy!|Art History | Ten times ten is a hundred. I learned it in {math}.",
      "art history",
    ),
    word(
      "science sciences",
      "the subject about plants, animals, the body and the world, with tests and experiments",
      "科学",
      "In {science}, we learn how plants grow. | Our {science} teacher showed us a frog's heart. | Water turns into ice at zero degrees. We learned that in {science}.",
      "art math",
    ),
    word(
      "art arts",
      "drawing, painting and making beautiful things",
      "美术；艺术",
      "In {art}, we paint pictures. | Bring your colored pencils to {art} class. | I love {art}. I want to be a painter.",
      "math history",
    ),
    word(
      "history",
      "the subject about what happened long ago",
      "历史",
      "In {history}, we learn about people from long ago. | The Great Wall is very old. We read about it in {history}. | My {history} teacher tells us about kings and queens.",
      "math science",
    ),
    word(
      "class classes",
      "a group of students who learn together; a time when they learn",
      "班级；课",
      "There are thirty students in my {class}. | Our English {class} starts at nine, and we learn new words. | Be quiet in {class}, please.",
      "subject test",
    ),
    word(
      "lesson lessons",
      "a time when someone teaches you something",
      "课；一节课",
      "I have a piano {lesson} on Thursday. My teacher shows me new songs. | In today's {lesson}, the teacher teaches us about animals. | Each {lesson} is forty minutes, and the teacher teaches us something new.",
      "subject test",
    ),
    word(
      "subject subjects",
      "something you learn at school, like math or art",
      "学科；科目",
      "My favorite {subject} is science. | We study six {subjects} this year: math, English, science, art, music and sport. | History is my best {subject}.",
      "test teacher",
    ),
    word(
      "test tests",
      "some questions to see how much you know",
      "测验；考试",
      "We have a math {test} tomorrow, so I need to study for it. | I got all the answers right on the {test}! | The {test} has ten questions, and I must answer them all.",
      "lesson subject",
    ),
    word(
      "learn learns learned learning",
      "to get to know something new",
      "学习",
      "I {learn} English from my teacher at school. | We {learned} a new song from Ms. Li today.|taught knew | Babies {learn} to walk at about one.",
      "teach know",
    ),
    word(
      "teach teaches taught teaching",
      "to help someone learn something",
      "教",
      "Ms. Li {teaches} us math.|learns knows | Can you {teach} me to swim? | My mom {taught} me to cook.|learned knew",
      "learn know",
    ),
    word(
      "easy easier easiest",
      "not difficult",
      "容易的",
      "This test is {easy}. I know all the answers! | Riding a bike is {easy} for me. I learned it in one day. | The first question is {easy}: two plus two.",
      "difficult wrong",
    ),
    word(
      "difficult",
      "not easy; needing a lot of work",
      "困难的",
      "This math problem is {difficult}. I can't do it. | Chinese is {difficult} for many English speakers. They need years to learn it. | The test was very {difficult}. Nobody got all the answers.",
      "easy right",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "Match the subject to what you do in it: numbers in *math*, plants and ice in *science*, painting in *art*, and long ago in *history*. A *class* or a *lesson* is a time; a *subject* is what you study.",
        "按做的事选学科：算数是 *math*，植物和冰是 *science*，画画是 *art*，很久以前是 *history*。*class*、*lesson* 是上课的时间；*subject* 是学的科目。",
      ),
      meaning: t(
        "You *learn* from a teacher, and a teacher *teaches* you. *Easy* means you can do it fast; *difficult* means it needs a lot of work.",
        "你向老师 *learn*（学），老师 *teaches*（教）你。*easy* 是很快就能做到；*difficult* 是要花很多工夫。",
      ),
      spell: t(
        "*Science* has sc and ie: s-c-i-e-n-c-e. *Teach* becomes *taught* in the past, and *difficult* has a double f.",
        "*science* 里有 sc 和 ie：s-c-i-e-n-c-e。*teach* 的过去式是 *taught*，*difficult* 双写 f。",
      ),
    },
    notes: `
      math|adding and taking away;two plus two;ten times ten|math is numbers and shapes; art is drawing and painting|math 学数字和图形；art 学画画|art=art is drawing and painting, not adding, *plus* or *times*=art 是画画，不学加减和乘法;history=history is about long ago, not numbers like two plus two or ten times ten=history 讲很久以前的事，不学二加二或十乘十|math|th at the end|结尾是 th
      science|how plants grow;a frog's heart;water turning into ice|science is about plants, animals and the world; art is about making pictures|science 讲动植物和世界；art 讲画画|art=art is drawing and painting, not how plants grow, a frog's heart or ice=art 是画画，不讲植物生长、青蛙的心脏或结冰;math=math is numbers and shapes, not plants, frogs or water turning into ice=math 讲数字和图形，不讲植物、青蛙或结冰|sci · ence|sc at the start and ie after it|开头是 sc，后面是 ie
      art|painting pictures;colored pencils;wanting to be a painter|art is drawing and painting; math is numbers|art 是画画；math 是数字|math=math is numbers and shapes, not painting pictures or being a painter=math 讲数字和图形，不画画也不当画家;history=history is about long ago, not colored pencils or painting=history 讲很久以前，不用彩铅也不画画|art|ar said like *car*|ar 读作 *car* 里的音
      history|people from long ago;the old Great Wall;kings and queens|history is about long ago; science is about the world now|history 讲过去；science 讲世界的道理|math=math is numbers, not people from long ago, the Great Wall or kings=math 讲数字，不讲古人、长城或国王;science=science is plants, animals and how the world works, not kings, queens or people long ago=science 讲动植物和世界的道理，不讲国王、王后或古人|his · to · ry|o in the middle, and y at the end|中间是 o，结尾是 y
      class|thirty students;English at nine;being quiet|a class is a group of students or a time to learn; a subject is what you study|class 是班级或一节课；subject 是科目|subject=subject is what you study, so it has no students in it, does not start at nine and you are not *in subject*=subject 是科目，里面没有学生，不会九点开始，也没有 *in subject* 的说法;test=test is questions to see what you know, not thirty students or a time to learn new words=test 是看你懂多少的题目，不是三十个学生，也不是学新词的课|class|a double s, and -es in *classes*|双写 s，复数是 *classes*
      lesson|a teacher showing new songs;the teacher teaching about animals;forty minutes of learning something new|a lesson is a time when someone teaches you; a test checks what you know|lesson 是老师教你的时间；test 检查你懂多少|subject=subject is what you study, like math, not one Thursday with a teacher or forty minutes=subject 是数学这样的科目，不是星期四的一次课或四十分钟;test=test checks what you already know, but here the teacher shows and teaches you something new=test 检查你已经会的，可这里老师在教你新东西|les · son|a double s, and -on at the end|双写 s，结尾是 -on
      subject|science as my favorite;six studied this year;history as my best|a subject is what you study; a test checks what you know|subject 是学的科目；test 检查你懂多少|test/tests=test is questions on one day, not science or history, and you do not study six tests named math, English and art=test 是某天的一套题，不是科学或历史，也不会学叫数学、英语、美术的六个测验;teacher/teachers=teacher is a person, so science and history are not teachers=teacher 是人，科学和历史不是老师|sub · ject|j in the middle, and ct at the end|中间是 j，结尾是 ct
      test|math tomorrow to study for;all answers right;ten questions to answer|a test is questions to see what you know; a lesson is a time to learn|test 是检查的题目；lesson 是学习的课|lesson=lesson is a time to learn, but here there are answers, questions and studying before it=lesson 是学习的课，可这里有答案、题目，还要提前复习;subject=subject is something you study, like math, not ten questions you answer on one day=subject 是科目，比如数学，不是某天要回答的十道题|test|a short e, and st at the end|短元音 e，结尾是 st
      learn|English from my teacher;a song from Ms. Li;babies walking|you learn from someone; someone teaches you|learn 是学；teach 是教|teach/taught=teach means to help someone else learn, but here I, we and babies get the new thing, and *teach from* is not English=teach 是教别人，可这里是我、我们和婴儿在学，也没有 *teach from* 的说法;know/knew=know means you already have it in your mind, not getting something new from a teacher=know 是已经知道，不是从老师那里学新东西|learn|ear said like *er*|ear 读作 *er*
      teach|Ms. Li and math for us;showing me to swim;Mom showing me to cook|a teacher teaches; a student learns|teacher 教；学生学|learn/learns/learned=learn is what the student does, and *learns us*, *learn me* and *learned me* are not English=learn 是学生做的事，没有 *learns us*、*learn me*、*learned me* 的说法;know/knows/knew=know means to have it in your mind, and *knows us math* or *know me to swim* is not English=know 是知道，没有 *knows us math*、*know me to swim* 的说法|teach|ea said like *see*, and the past *taught*|ea 读作 *see*，过去式是 *taught*
      easy|knowing all the answers;learned in one day;two plus two|easy means not difficult; difficult means needing a lot of work|easy 是不难；difficult 是很费劲|difficult=difficult means needing a lot of work, but all the answers, one day and two plus two are not hard=difficult 是很费劲，可全都会、一天学会、二加二都不难;wrong=wrong means not correct, and a test, riding a bike or a question is not *wrong* here=wrong 是不对，可这里测验、骑车和题目都不是错的|eas · y|ea said like *see*, and y changing to i in *easier*|ea 读作 *see*，*easier* 里 y 变成 i
      difficult|a problem I can't do;years to learn Chinese;nobody got all the answers|difficult means hard to do; easy means not hard|difficult 是难；easy 是容易|easy=easy means not hard, but I can't do it, it takes years and nobody got all the answers=easy 是不难，可我做不出、要学好几年、没人全对;right=right means correct, and a problem, a language or a test is not *right* here=right 是正确，可这里题目、语言和测验都谈不上对|dif · fi · cult|a double f, and -cult at the end|双写 f，结尾是 -cult
    `,
  },
});

const schoolwork = vocabularyTopic({
  id: "a1-words-schoolwork",
  title: t("Schoolwork", "功课"),
  summary: t(
    "Students, questions and answers, words, pages and paper, spelling, knowing and understanding.",
    "学生、问题和答案、单词、页和纸、拼写、知道和理解。",
  ),
  intro: t(
    "The teacher **asks** a **question**, and the **students** write the **answer** on a piece of **paper**. These words help you do your work in class.",
    "老师 **asks**（提出）一个 **question**（问题），**students**（学生们）在一张 **paper**（纸）上写下 **answer**（答案）。这些词帮你在课上完成功课。",
  ),
  prerequisites: ["a1-words-school-subjects"],
  words: [
    word(
      "student students",
      "a person who learns at a school",
      "学生",
      "There are thirty {students} in our class.|questions pages | I'm a {student} at Park School. | The {students} are reading in the library.|questions pages",
      "question page",
    ),
    word(
      "question questions",
      "something you ask",
      "问题",
      'Can I ask you some {questions}?|answers words | The test has ten {questions}, and I can answer them all.|answers words | "What is your name?" and "How old are you?" are {questions}.|answers words',
      "answer word",
    ),
    word(
      "answer answers answered answering",
      "what you say or write after a question; to reply",
      "回答；答案",
      "What is the {answer} to question five? | Please {answer} the phone. | She {answered} all the teacher's questions correctly.|questioned asked",
      "question ask",
    ),
    word(
      "ask asks asked asking",
      "to say a question to someone",
      "问",
      "Can I {ask} you a question? | If you don't know, {ask} the teacher for help. | He {asked} me my name.|answered spelled",
      "answer spell",
    ),
    word(
      "word words",
      "a group of letters that means something",
      "单词",
      '"Cat" is a short {word}. | How do you spell this {word}? | There are ten new {words} to spell in this lesson.|pages questions',
      "page question",
    ),
    word(
      "page pages",
      "one side of a piece of paper in a book",
      "页",
      "Open your books to {page} ten. | This book has two hundred {pages}, and each one has a number.|papers words | The picture is on the next {page}.",
      "paper word",
    ),
    word(
      "paper papers",
      "the thin white material you write on",
      "纸",
      "Write your name on this sheet of {paper}. | Books are made of {paper}. | Can I have a piece of {paper}?",
      "page word",
    ),
    word(
      "spell spells spelled spelling",
      "to say or write the letters of a word in the right order",
      "拼写",
      'How do you {spell} your name? — L-I-L-Y. | Can you {spell} "elephant"? | He {spelled} the word wrong.|asked knew',
      "ask know",
    ),
    word(
      "understand understands understood understanding",
      "to know what something means",
      "理解；明白",
      "I don't {understand} this word. What does it mean? | Do you {understand}? — Yes, I see. | Sorry, I didn't {understand} the question. What does it mean?",
      "spell ask",
    ),
    word(
      "know knows knew known knowing",
      "to have something in your mind; to be sure of something",
      "知道",
      "I {know} the answer! It's seven. | I {know} her name, so I don't need to ask. | I don't {know} where my pen is. Can you help me find it?",
      "ask spell",
    ),
    word(
      "right",
      "correct; also the side opposite the left",
      "正确的；右边",
      "Two plus two is four. That's {right}! | Is this answer {right} or wrong? | Turn {right} at the school.",
      "wrong easy",
    ),
    word(
      "wrong",
      "not correct",
      "错误的",
      "Two plus two is five? No, that's {wrong}! | Sorry, I have the {wrong} number. | What's {wrong}? Why are you crying?",
      "right easy",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "A *question* comes first and the *answer* comes after it; you *ask* a question and *answer* it. A *page* is one side in a book, while *paper* is what the page is made of.",
        "先有 *question*，后有 *answer*；你 *ask*（提）问题，再 *answer*（回答）。*page* 是书里的一面，*paper* 是做页的材料。",
      ),
      meaning: t(
        "*Know* means it is already in your mind; *understand* means you see what it means. You *spell* a word when you say its letters, as in *L-I-L-Y*.",
        "*know* 是脑子里已经有；*understand* 是明白意思。说出单词的字母就是 *spell*，比如 *L-I-L-Y*。",
      ),
      spell: t(
        "*Know* and *knew* start with a silent k; *answer* has a silent w; *question* has qu, and *understand* becomes *understood*.",
        "*know*、*knew* 开头的 k 不发音；*answer* 里的 w 不发音；*question* 里是 qu，*understand* 的过去式是 *understood*。",
      ),
    },
    notes: `
      student|thirty in a class;at Park School;reading in the library|a student is a person who learns; a question is something you ask|student 是学习的人；question 是问的问题|question/questions=question is something you ask, so it cannot be at a school or read in the library=question 是问的问题，不能在学校上学，也不能在图书馆看书;page/pages=page is one side in a book, so it cannot be at Park School or read=page 是书的一面，不能在学校上学，也不能看书|stu · dent|u said like *you*, and -ent at the end|u 读作 *you*，结尾是 -ent
      question|asking you some;ten to answer on a test;what is your name and how old are you|a question is what you ask; an answer is what you say back|question 是问题；answer 是答案|answer/answers=answer is what you say back, so you do not ask answers or answer answers, and *What is your name?* is not one=answer 是回答，不能问答案、回答答案，*What is your name?* 也不是答案;word/words=word is one group of letters, but here they are things you ask and answer, each with many words=word 是一个单词，可这里是要问、要回答的话，每句有好几个词|ques · tion|qu at the start and -tion at the end|开头是 qu，结尾是 -tion
      answer|to question five;the phone;all the teacher's questions|you answer a question; you ask a question|answer 是回答；ask 是提问|question/questioned=question is what you ask, and *the question to question five* or *questioned the phone* does not make sense=question 是问题，*the question to question five*、*questioned the phone* 都说不通;ask/asked=ask means to say a question, but here the questions are already asked and you reply=ask 是提问，可这里问题已经问了，要的是回答|an · swer|a silent w|w 不发音
      ask|you a question;the teacher for help;me my name|you ask to get an answer; you answer when someone asks|ask 是问；answer 是答|answer/answered=answer means to reply, and *answer you a question* or *answered me my name* is not English=answer 是回答，没有 *answer you a question*、*answered me my name* 的说法;spell/spelled=spell means to say the letters of a word, not to say a question or ask for help=spell 是拼字母，不是提问或求助|ask|sk at the end|结尾是 sk
      word|cat;spelling it;ten new ones to spell|a word is a group of letters that means something; a page is one side in a book|word 是单词；page 是书的一面|page/pages=page is one side in a book, so *cat* is not a page and you do not spell pages=page 是书的一面，*cat* 不是一页，也不能拼写一页;question/questions=question is something you ask, so *cat* is not a question and you do not spell one=question 是问的话，*cat* 不是问题，也不用拼写问题|word|or said like *er*|or 读作 *er*
      page|page ten;two hundred with numbers;the next one with a picture|a page is one side in a book; paper is what it is made of|page 是书的一面；paper 是做页的材料|paper/papers=paper is the material, so books do not open to *paper ten* or have numbered papers=paper 是材料，书不会翻到 *paper ten*，也没有编号的纸;word/words=word is a group of letters, and you do not open to *word ten* or find a picture on a word=word 是单词，不会翻到 *word ten*，也不会在单词上找图片|page|g said like j, and a silent e|g 读作 j，词尾 e 不发音
      paper|a sheet to write my name on;what books are made of;a piece to have|paper is the material you write on; a page is one side in a book|paper 是纸；page 是书的一面|page=page is one side in a book, so *a sheet of page*, *made of page* and *a piece of page* are not English=page 是书的一面，没有 *a sheet of page*、*made of page*、*a piece of page* 的说法;word=word is a group of letters, so books are not made of word and you do not have a piece of word=word 是单词，书不是单词做的，也没有 *a piece of word*|pa · per|one p in the middle|中间只有一个 p
      spell|L-I-L-Y;elephant;getting the word wrong|you spell a word letter by letter; you ask a question|spell 是一个个字母地拼；ask 是提问|ask/asked=ask means to say a question, but L-I-L-Y gives letters, and *asked the word wrong* is not English=ask 是提问，可 L-I-L-Y 是字母，也没有 *asked the word wrong* 的说法;know/knew=know means to have it in your mind, and you cannot *know* a name as L-I-L-Y or *knew the word wrong*=know 是知道，不能把名字 know 成 L-I-L-Y，也没有 *knew the word wrong*|spell|a double l|双写 l
      understand|what a word means;yes I see;what the question means|you understand what something means; you spell its letters|understand 是明白意思；spell 是拼字母|spell=spell means to say the letters, but here you want to know what it means=spell 是拼字母，可这里想知道的是意思;ask=ask means to say a question, but *I see* and *what does it mean* are about getting the meaning=ask 是提问，可 *I see* 和 *what does it mean* 说的是懂不懂意思|un · der · stand|*under* + *stand*, and the past *understood*|*under* 加 *stand*，过去式是 *understood*
      know|the answer seven;her name with no need to ask;where my pen is|you know what is in your mind; you ask when you don't know|know 是知道；ask 是不知道时提问|ask=ask is for when you don't know, but here I have the answer or don't need to ask=ask 是不知道时才问，可这里我已知道答案，或说了不用问;spell=spell means to say the letters, not to have the answer, a name or a place in your mind=spell 是拼字母，不是心里知道答案、名字或地方|know|a silent k, the same sound as *no*|k 不发音，和 *no* 同音
      right|four after two plus two;right or wrong;turning at the school|right means correct or the side opposite left; wrong means not correct|right 是正确或右边；wrong 是错|wrong=wrong means not correct, but two plus two is four, *or wrong* is already there and you cannot *turn wrong*=wrong 是错，可二加二就是四，句中已有 *or wrong*，也不能 *turn wrong*;easy=easy means not difficult, and a sum, an answer you check or a turn is not *easy* here=easy 是不难，可这里算式、要检查的答案和拐弯都谈不上容易|right|igh with a silent gh, the same sound as *write*|igh 里 gh 不发音，和 *write* 同音
      wrong|five after two plus two;a number I'm sorry about;something that makes you cry|wrong means not correct; right means correct|wrong 是错；right 是对|right=right means correct, but two plus two is not five, *sorry* shows a mistake and crying shows a problem=right 是对，可二加二不是五，*sorry* 说明出错了，哭说明有事;easy=easy means not difficult, and *What's easy? Why are you crying?* does not make sense=easy 是不难，*What's easy? Why are you crying?* 说不通|wrong|a silent w|w 不发音
    `,
  },
});

const littleWords2 = vocabularyTopic({
  id: "a1-words-little-words-2",
  title: t("Little Words 2", "小词 2"),
  summary: t(
    "Which, because, so, if, than, something, someone, anything, nothing, everyone and everything.",
    "which、because、so、if、than、something、someone、anything、nothing、everyone 和 everything。",
  ),
  intro: t(
    "**Someone** is at the door, **so** I open it. It's Tom! **Everyone** is happy **because** he brings cake. These words help you join ideas and talk about people and things.",
    "**someone**（有人）在门口，**so**（所以）我去开门。是汤姆！**everyone**（大家）都很高兴，**because**（因为）他带来了蛋糕。这些词帮你连接想法，谈论人和事物。",
  ),
  prerequisites: ["a1-words-little-words-1"],
  words: [
    word(
      "which",
      "the word you use to ask about one of a group",
      "哪一个",
      "{Which} color do you like, red or blue? | {Which} bag is yours? — The black one. | I don't know {which} bus to take.",
      "because if",
    ),
    word(
      "because",
      "for the reason that",
      "因为",
      "I'm tired {because} I went to bed late. | She is happy {because} it's her birthday. | Why are you sad? — {Because} my cat is sick.|So Than",
      "so than",
    ),
    word(
      "so",
      "for that reason; very",
      "所以；如此",
      "It was raining, {so} we stayed at home. | I'm hungry, {so} I'm eating an apple. | The cake is {so} good!",
      "because than",
    ),
    word(
      "if",
      "used to say what happens when something else happens",
      "如果",
      "{If} it rains tomorrow, we can watch a movie. | You can play {if} you finish your homework. | Call me {if} you ever need help.",
      "because than",
    ),
    word(
      "than",
      "a word you use when you compare two things",
      "比",
      "An elephant is bigger {than} a dog. | My brother is older {than} me. | Ten is more {than} five.",
      "because so",
    ),
    word(
      "something",
      "a thing; you don't say which one",
      "某事；某物",
      "I'm hungry. Can I have {something} to eat? | There's {something} in my shoe! It hurts. | I want to tell you {something} important.",
      "someone nothing",
    ),
    word(
      "someone",
      "a person; you don't say which one",
      "某人",
      "{Someone} is knocking at the door. Who is it? | Can {someone} help me, please? Just one of you. | I saw {someone} in the garden. Who was it?",
      "something everyone",
    ),
    word(
      "anything",
      "any thing; used in questions and negatives",
      "任何事物",
      "Do you need {anything} from the shop? I'm going now. | I can't see {anything}. It's too dark. | I can't find {anything} in the box. It's empty.",
      "nothing everyone",
    ),
    word(
      "nothing",
      "no thing; not anything",
      "什么也没有",
      'The box is empty. There is {nothing} in it. | I have {nothing} to do. I\'m bored. | "What\'s in your hand?" — "{Nothing}! Look, it\'s empty."|Something Anything',
      "something anything",
    ),
    word(
      "everyone",
      "all the people",
      "每个人",
      "Good morning, {everyone}! | {Everyone} in my class likes music. All thirty of us sing. | Is {everyone} here? Are all the students in class?",
      "everything someone",
    ),
    word(
      "everything",
      "all the things",
      "一切；所有东西",
      "Thank you for {everything}! | I ate {everything} on my plate. Now it's empty. | {Everything} in this shop is cheap. All of it costs one dollar.",
      "everyone something",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Because* comes before the reason and *so* comes before the result: *I'm tired because I went to bed late*, but *It was raining, so we stayed home*. *Than* only follows words like *bigger* or *more*.",
        "*because* 后面接原因，*so* 后面接结果：*I'm tired because I went to bed late*，*It was raining, so we stayed home*。*than* 只跟在 *bigger*、*more* 这类词后面。",
      ),
      meaning: t(
        "Words with *-one* are people and words with *-thing* are things: *someone* knocks at the door, but *something* is in your shoe. *Nothing* means not one thing, and *everything* means all of them.",
        "带 *-one* 的词指人，带 *-thing* 的词指物：*someone* 敲门，*something* 在鞋里。*nothing* 是一样也没有，*everything* 是全部。",
      ),
      spell: t(
        "*Something*, *someone*, *anything*, *nothing*, *everyone* and *everything* are each one word. *Which* has wh and ch, and *because* ends in -ause.",
        "*something*、*someone*、*anything*、*nothing*、*everyone*、*everything* 都是一个词。*which* 里有 wh 和 ch，*because* 结尾是 -ause。",
      ),
    },
    notes: `
      which|red or blue;the black bag;one bus of many|which asks about one of a group; because gives a reason|which 问一组里的哪一个；because 说原因|because=because gives a reason, and *because color do you like* or *because bus to take* is not English=because 说原因，没有 *because color do you like*、*because bus to take* 的说法;if=if says what happens when something else happens, and *if bag is yours* or *if bus to take* is not English=if 表示如果，没有 *if bag is yours*、*if bus to take* 的说法|which|wh at the start and ch at the end|开头是 wh，结尾是 ch
      because|tired from a late night;happy for a birthday;the answer to why|because gives the reason; so gives the result|because 接原因；so 接结果|so=so gives a result, but a late night, a birthday and a sick cat are the reasons=so 接结果，可晚睡、生日和猫生病都是原因;than=than is for comparing, and nothing is compared here=than 用来比较，可这里没有比较|be · cause|-ause at the end|结尾是 -ause
      so|staying home after rain;eating because I'm hungry;very good cake|so gives the result or means very; because gives the reason|so 接结果或表示很；because 接原因|because=because gives a reason, but staying home and eating are the results of rain and hunger, and *because good* is not English=because 接原因，可待在家和吃东西是下雨和饿的结果，也没有 *because good* 的说法;than=than is for comparing, and *raining, than we stayed* or *than good* is not English=than 用来比较，没有 *raining, than we stayed*、*than good* 的说法|so|o said like *go*|o 读作 *go*
      if|rain tomorrow;finishing homework first;ever needing help|if says what happens when something else happens; because says why|if 表示如果；because 表示因为|because=because gives a reason that is true now, but rain tomorrow, finishing first and *ever needing help* may not happen=because 说现在成立的原因，可明天下雨、先做完作业、万一需要帮忙都还不一定;than=than is for comparing, and nothing is compared here=than 用来比较，可这里没有比较|if|one f|只有一个 f
      than|bigger;older;more|than follows words like *bigger* or *more* to compare; because gives a reason|than 跟在 *bigger*、*more* 后面比较；because 说原因|because=because gives a reason, but *bigger*, *older* and *more* need a word to compare=because 说原因，可 *bigger*、*older*、*more* 需要比较词;so=so gives a result, and *bigger so a dog* or *older so me* is not English=so 接结果，没有 *bigger so a dog*、*older so me* 的说法|than|a, so not *then*|是 a，不是 *then*
      something|to eat;in my shoe hurting;important to tell|something is a thing; someone is a person|something 指物；someone 指人|someone=someone is a person, but you eat a thing, a thing hurts in a shoe and you tell a thing=someone 是人，可吃的、鞋里硌脚的和要说的都是东西;nothing=nothing means not one thing, but you want food, it hurts and you tell an important thing=nothing 是什么都没有，可你要吃的、脚被硌疼了、还要说重要的事|some · thing|*some* + *thing*, one word|*some* 加 *thing*，一个词
      someone|knocking with who is it;just one of you helping;seen in the garden with who was it|someone is one person; everyone is all the people|someone 是某个人；everyone 是所有人|something=something is a thing, but *who is it*, *one of you* and *who was it* ask about a person=something 指物，可 *who is it*、*one of you*、*who was it* 问的是人;everyone=everyone is all the people, but *who is it*, *just one of you* and *who was it* are about one person=everyone 是所有人，可 *who is it*、*just one of you*、*who was it* 说的是一个人|some · one|*some* + *one*, one word|*some* 加 *one*，一个词
      anything|a question about the shop;the dark;an empty box|anything is used in questions and with *not*; nothing already means not anything|anything 用于疑问句和否定句；nothing 本身就是否定|nothing=nothing already means not anything, so *Do you need nothing* sounds wrong and *can't see nothing* says not twice=nothing 本身是否定，*Do you need nothing* 不自然，*can't see nothing* 是双重否定;everyone=everyone is all the people, not things from a shop or in a box=everyone 指所有人，不是商店里或箱子里的东西|an · y · thing|*any* + *thing*, with a said like *e*|*any* 加 *thing*，a 读作 *e*
      nothing|an empty box;nothing to do and bored;an empty hand|nothing means not one thing; something means one thing|nothing 是什么都没有；something 是某样东西|something=something means a thing is there, but the box and the hand are empty and I'm bored=something 表示有东西，可箱子和手都是空的，我也很无聊;anything=anything goes with *not* or in a question, and *There is anything in it* is not English=anything 和 *not* 或疑问句连用，没有 *There is anything in it* 的说法|noth · ing|o said like the u in *up*|o 读作 *up* 里的 u
      everyone|good morning to all;all thirty of us;all the students|everyone is all the people; someone is one person|everyone 是所有人；someone 是某一个人|everything=everything is all the things, but you say good morning to people, and students sing=everything 指所有东西，可早安是对人说的，唱歌的是学生;someone=someone is one person, but *all thirty of us* and *all the students* mean the whole group=someone 是一个人，可 *all thirty of us*、*all the students* 是整个群体|ev · ery · one|*every* + *one*, one word|*every* 加 *one*，一个词
      everything|thanks for all;all of my food;all of the shop|everything is all the things; everyone is all the people|everything 是所有东西；everyone 是所有人|everyone=everyone is all the people, but you eat food and a shop sells things=everyone 指所有人，可吃的是食物，商店卖的是东西;something=something is one thing, but *now it's empty* and *all of it* mean all the things=something 是某样东西，可 *now it's empty* 和 *all of it* 说的是全部|ev · ery · thing|*every* + *thing*, one word|*every* 加 *thing*，一个词
    `,
  },
});

// Don't and doesn't.

/** doers are subjects, and whether they take does. */
const doers: readonly (readonly [subject: string, single: boolean])[] = [
  ["I", false],
  ["She", true],
  ["We", false],
  ["He", true],
  ["They", false],
  ["My brother", true],
  ["You", false],
  ["Our teacher", true],
  ["My parents", false],
  ["Lily", true],
  ["The students", false],
];

/** deeds are a verb, its -s form and the rest of a sentence. */
const deeds: readonly (readonly [verb: string, third: string, rest: string])[] = [
  ["like", "likes", "math"],
  ["play", "plays", "the guitar"],
  ["speak", "speaks", "French"],
  ["eat", "eats", "meat"],
  ["watch", "watches", "TV in the morning"],
  ["go", "goes", "to school on Sunday"],
  ["have", "has", "a computer"],
  ["study", "studies", "history"],
  ["drink", "drinks", "coffee"],
  ["know", "knows", "the answer"],
  ["understand", "understands", "this word"],
  ["teach", "teaches", "art"],
  ["ride", "rides", "a bike"],
];

/** deedAll are every doer with every deed. */
const deedAll = everyPair(doers, deeds).map(([[subject, single], [verb, third, rest]]) => ({
  subject,
  single,
  verb,
  third,
  rest,
  aux: single ? "does" : "do",
}));

/** deedItems are all the pairs starting at the given place, so each bank opens on different sentences. */
const deedItems = (from: number) => [...deedAll.slice(from), ...deedAll.slice(0, from)];

const negChoiceBank: readonly ChoiceItem[] = deedItems(0).map(
  ({ subject, single, verb, rest }): ChoiceItem => [
    `${subject} ___ ${verb} ${rest}.`,
    single ? "doesn't" : "don't",
    [single ? "don't" : "doesn't", single ? "isn't" : "aren't"],
  ],
);

const negFixBank: readonly TypedItem[] = deedItems(44).map(({ subject, single, verb, third, rest }, k): TypedItem => {
  const right = single ? `${subject} [doesn't|does not] ${verb} ${rest}.` : `${subject} [don't|do not] ${verb} ${rest}.`;
  const canonical = `${subject} ${single ? "doesn't" : "don't"} ${verb} ${rest}.`;
  const shown = single
    ? k % 2 === 0
      ? `${subject} doesn't ${third} ${rest}.`
      : `${subject} don't ${verb} ${rest}.`
    : k % 2 === 0
      ? `${subject} doesn't ${verb} ${rest}.`
      : `${subject} not ${verb} ${rest}.`;
  return {
    shown,
    accepted: [right],
    canonical,
    wrong: [shown, `${subject} ${single ? "doesn't" : "don't"} ${third} ${rest}.`].filter(
      (w, i, all) => all.indexOf(w) === i && w !== canonical,
    ),
  };
});

const negMakeBank: readonly TypedItem[] = deedItems(84).map(
  ({ subject, single, verb, third, rest }): TypedItem => ({
    shown: `${subject} ${single ? third : verb} ${rest}.`,
    accepted: [single ? `${subject} [doesn't|does not] ${verb} ${rest}.` : `${subject} [don't|do not] ${verb} ${rest}.`],
    canonical: `${subject} ${single ? "doesn't" : "don't"} ${verb} ${rest}.`,
    wrong: [
      single ? `${subject} doesn't ${third} ${rest}.` : `${subject} not ${verb} ${rest}.`,
      `${subject} ${single ? "isn't" : "aren't"} ${verb} ${rest}.`,
    ],
    instruction: t("Make the sentence negative.", "把句子改成否定句。"),
  }),
);

/** negReason names the rule that picks don't or doesn't in sentence. */
const negReason = (sentence: string): Text =>
  sentence.includes("doesn't")
    ? t(
        "One person or thing, like *he*, *she* or *it*, takes *doesn't*, and the verb after it loses its *-s*",
        "单个的人或物（如 *he*、*she*、*it*）用 *doesn't*，后面的动词去掉 *-s*",
      )
    : t(
        "*I*, *you*, *we*, *they* and more than one person take *don't*, and the verb after it stays plain",
        "*I*、*you*、*we*、*they* 和多个人用 *don't*，后面用动词原形",
      );

const negWhy = (sentence: string): Text => {
  const reason = negReason(sentence);
  return t(
    `${reason.en}: ${sentence}\n\n**Check.** Verify both parts: the helper (*don't* or *doesn't*) matches the subject, and the main verb right after it is completely plain with no *-s*.`,
    `${reason["zh-CN"]}：${sentence}\n\n**检验。** 核对两处：助动词（*don't* 或 *doesn't*）与主语一致，紧随其后的实义动词恢复原形、不加 *-s*。`,
  );
};

/** whyNotNeg explains a wrong word in a gap that needs don't or doesn't without revealing the answer. */
const whyNotNeg = (wrong: string): Text =>
  wrong === "isn't" || wrong === "aren't"
    ? t(
        `*${wrong}* is a form of *be*, not the helper used to negate an action verb like this one.`,
        `*${wrong}* 是 *be* 动词的否定形式，不能用来否定这里的实义动词。`,
      )
    : wrong === "don't"
      ? t(
          "*don't* goes with *I*, *you*, *we*, *they*, and plural subjects, not with a single third-person subject.",
          "*don't* 用于 *I*、*you*、*we*、*they* 和复数主语，不用于第三人称单数主语。",
        )
      : t(
          "*doesn't* goes with a single third-person subject (*he*, *she*, *it*), not with *I*, *you*, *we*, *they*, or plural subjects.",
          "*doesn't* 用于第三人称单数主语（*he*、*she*、*it*），不用于 *I*、*you*、*we*、*they* 或复数主语。",
        );

const presentSimpleNegatives: TopicDef = {
  id: "present-simple-negatives",
  title: t("Don't and Doesn't", "don't 和 doesn't"),
  summary: t(
    "I don't like math. She doesn't like art. After doesn't the verb loses its -s.",
    "I don't like math. She doesn't like art. 在 doesn't 后面，动词去掉 -s。",
  ),
  intro: t(
    "Turn *My brother studies history.* into a negative: *My brother doesn't study history.* Notice two things happen at once—English adds *doesn't* (or *don't* for *I/you/we/they*) before the verb, and *studies* drops back to plain *study*. In this topic, you choose, fix, and write present-simple negatives.",
    "把 *My brother studies history.* 改成否定句：*My brother doesn't study history.* 注意两处同时变化——动词前加上 *doesn't*（*I/you/we/they* 用 *don't*），同时 *studies* 变回原形 *study*。本主题带你选择、改正并写出一般现在时否定句。",
  ),
  prerequisites: ["third-person-s"],
  encompasses: [{ topic: "third-person-s", weight: 0.4 }],
  xp: 25,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Don't or doesn't", "don't 还是 doesn't"),
      t(
        "To say *no* about a verb like *like* or *play*, put *don't* (*do not*) or *doesn't* (*does not*) before it.\n\n*I, you, we, they* → *don't*: *I don't like math.*\n*he, she, it* and one person → *doesn't*: *She doesn't like art.*\n\nNot *isn't*: *isn't* is only for *be*.\n\n> **Watch out.** Never pick *isn't* or *aren't* before a plain action verb (*She isn't like* is wrong), and match *don't* vs. *doesn't* to the subject.",
        "否定 *like*、*play* 这类动词时，在动词前加 *don't*（*do not*）或 *doesn't*（*does not*）。\n\n*I、you、we、they* → *don't*：*I don't like math.*\n*he、she、it* 和单个的人 → *doesn't*：*She doesn't like art.*\n\n中文只要加“不”就行，英语却要借助 *do*。也不能用 *isn't*：*isn't* 只用于 *be* 动词。\n\n> **注意。** 实义动词原形前绝不用 *isn't* 或 *aren't*（*She isn't like* 是错的），并按主语单复数区分 *don't* 和 *doesn't*。",
      ),
      choiceGenerator(
        t("Choose the word for the gap.", "选出填入空白处的词。"),
        negChoiceBank,
        (right, shown) => negWhy(shown.replace("___", right)),
        whyNotNeg,
      ),
    ),
    point(
      "fix",
      t("Fixing the negative", "改正否定句"),
      t(
        "After *doesn't* the verb has no *-s*: *She doesn't like*, not *She doesn't likes*. The *-s* is already in *does*.\n\nAnd *not* alone is not enough: *They don't eat meat*, not *They not eat meat*.\n\n> **Watch out.** Check *every* piece of a broken negative: *does* carries the *-s* so the main verb must return to its plain form (*has* -> *have*, *studies* -> *study*, *watches* -> *watch*).",
        "*doesn't* 后面的动词不加 *-s*：说 *She doesn't like*，不说 *She doesn't likes*，因为 *-s* 已经在 *does* 里了。\n\n只用 *not* 也不行：说 *They don't eat meat*，不说 *They not eat meat*。\n\n> **注意。** 改错时检查整个谓语：*does* 已经承担了单三变化，后面的实义动词必须恢复原形（*has* -> *have*、*studies* -> *study*、*watches* -> *watch*）。",
      ),
      typedGenerator("sentence-pattern", t("Fix the sentence.", "改正这个句子。"), negFixBank, negWhy, presentSimpleNegativesFixNot),
    ),
    point(
      "make",
      t("Making a sentence negative", "把句子改成否定句"),
      t(
        "To make a sentence negative, put *don't* or *doesn't* before the verb and take the *-s* off the verb: *Tom plays football.* → *Tom doesn't play football.* *We eat meat.* → *We don't eat meat.*\n\n> **Watch out.** Watch irregular *has* in particular: *She has a computer.* becomes *She doesn't have a computer.* (never *doesn't has*).",
        "把句子改成否定句时，在动词前加 *don't* 或 *doesn't*，并去掉动词的 *-s*：*Tom plays football.* → *Tom doesn't play football.* *We eat meat.* → *We don't eat meat.* 注意：*plays* 变回 *play*。\n\n> **注意。** 特别留心不规则动词 *has*：*She has a computer.* 要改成 *She doesn't have a computer.*（绝不是 *doesn't has*）。",
      ),
      typedGenerator("sentence-pattern", t("Change the sentence.", "改写这个句子。"), negMakeBank, negWhy, presentSimpleNegativesMakeNot),
    ),
  ],
};

// Do and does questions.

/** lowerSubject is a subject as it stands inside a sentence: names keep their capital, other words lose it. */
const lowerSubject = (subject: string) =>
  /^(He|She|It|We|They|You|Our|My|Your|His|Her|Their|The|A|An)\b/u.test(subject)
    ? subject.charAt(0).toLowerCase() + subject.slice(1)
    : subject;

/** askedSubject is the subject of a question to the person who said the sentence: I becomes you. */
const askedSubject = (subject: string) => (subject === "I" ? "you" : lowerSubject(subject));

/** replyPronoun is the pronoun of a short answer to a question about asked. */
const replyPronoun = (asked: string, single: boolean): string =>
  asked === "you" ? "I" : asked === "we" ? "we" : !single ? "they" : /^(she|Lily)$/u.test(asked) ? "she" : "he";

const questionChoiceBank: readonly ChoiceItem[] = deedItems(3).map(
  ({ subject, single, verb, rest }): ChoiceItem => [
    `___ ${lowerSubject(subject)} ${verb} ${rest}?`,
    single ? "Does" : "Do",
    [single ? "Do" : "Does", single ? "Is" : "Are"],
  ],
);

const questionWriteBank: readonly TypedItem[] = deedItems(50).map(({ subject, single, verb, third, rest, aux }): TypedItem => {
  const who = askedSubject(subject);
  const Aux = sentenceCase(aux);
  return {
    shown: `${subject} ${single ? third : verb} ${rest}.`,
    accepted: [`${Aux} ${who} ${verb} ${rest}?`],
    wrong: [
      `${subject} ${single ? third : verb} ${rest}?`,
      single ? `${Aux} ${who} ${third} ${rest}?` : `Does ${who} ${verb} ${rest}?`,
    ].filter((w, i, all) => all.indexOf(w) === i),
    instruction: t(
      "Make the sentence a question. You ask the person who said it, so I becomes you.",
      "把句子改成疑问句。你在问说这句话的人，所以 I 变成 you。",
    ),
  };
});

const shortAnswerBank: readonly ChoiceItem[] = deedItems(17).map(({ subject, single, verb, rest, aux }, k): ChoiceItem => {
  const who = askedSubject(subject);
  const reply = replyPronoun(who, single);
  const yes = k % 2 === 0;
  const answerAux = reply === "he" || reply === "she" ? "does" : "do";
  const otherAux = answerAux === "do" ? "does" : "do";
  const be = reply === "I" ? "am" : answerAux === "do" ? "are" : "is";
  return [
    `${sentenceCase(aux)} ${who} ${verb} ${rest}? (${yes ? "yes" : "no"})`,
    yes ? `Yes, ${reply} ${answerAux}.` : `No, ${reply} ${answerAux}n't.`,
    [
      yes ? `Yes, ${reply} ${otherAux}.` : `No, ${reply} ${otherAux}n't.`,
      yes ? `Yes, ${reply} ${be}.` : `No, ${reply} ${be === "am" ? "am not" : `${be}n't`}.`,
    ],
  ];
});

const presentSimpleQuestions: TopicDef = {
  id: "present-simple-questions",
  title: t("Do and Does Questions", "用 do 和 does 提问"),
  summary: t(
    "Do you like science? Does he speak English? Yes, he does. A question starts with do or does.",
    "Do you like science? Does he speak English? Yes, he does. 疑问句以 do 或 does 开头。",
  ),
  intro: t(
    "Ask about a habit by putting *Do* or *Does* right at the front: *Do they ride a bike?* and *Does Lily study history?* Just like in negatives, the main verb drops its *-s* after *Does*, and short answers echo *do/does* rather than repeating the action verb. In this topic, you build and answer present-simple questions.",
    "询问日常习惯时，把 *Do* 或 *Does* 放到句首：*Do they ride a bike?* 和 *Does Lily study history?* 与否定句一样，*Does* 后面的实义动词恢复原形，简短回答也用 *do/does* 呼应而不重复实义动词。本主题带你构成并回答一般现在时一般疑问句。",
  ),
  prerequisites: ["third-person-s"],
  encompasses: [{ topic: "third-person-s", weight: 0.4 }],
  xp: 25,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Do or does", "do 还是 does"),
      t(
        "A question about a verb like *like* or *play* starts with *Do* or *Does*.\n\n*Do* with *I, you, we, they*: *Do you like science?*\n*Does* with *he, she, it* and one person: *Does Tom speak English?*\n\nNot *Is* or *Are*: they are only for *be*.\n\n> **Watch out.** Never start an action-verb question with *Is* or *Are* (*Is he like math?* is wrong), and match *Do* vs. *Does* to the subject.",
        "关于 *like*、*play* 这类动词的疑问句以 *Do* 或 *Does* 开头。\n\n*I、you、we、they* 用 *Do*：*Do you like science?*\n*he、she、it* 和单个的人用 *Does*：*Does Tom speak English?*\n\n中文保持陈述句语序，只在句末加“吗”；英语要把 *do/does* 放到句首。不能用 *Is* 或 *Are*：它们只用于 *be* 动词。\n\n> **注意。** 实义动词问句绝不用 *Is* 或 *Are* 开头（*Is he like math?* 是错的），并按主语区分 *Do* 与 *Does*。",
      ),
      choiceGenerator(
        t("Choose the word for the gap.", "选出填入空白处的词。"),
        questionChoiceBank,
        (right, shown) => {
          const sentence = shown.replace("___", right);
          return right === "Does"
            ? t(
                `The subject is one person or thing, like *he* or *she*, so the question starts with *Does*: ${sentence}\n\n**Check.** Verify that the sentence has an action verb (so *do/does* is needed, not *is/are*) and a singular third-person subject (*Does*).`,
                `主语是单个的人或物（如 *he*、*she*），所以疑问句以 *Does* 开头：${sentence}\n\n**检验。** 确认句中有实义动词（需要 *do/does* 而非 *is/are*），且主语为第三人称单数（配 *Does*）。`,
              )
            : t(
                `The subject is *I*, *you*, *we*, *they* or more than one person, so the question starts with *Do*: ${sentence}\n\n**Check.** Verify that the sentence has an action verb (so *do/does* is needed, not *is/are*) and a subject taking *Do*.`,
                `主语是 *I*、*you*、*we*、*they* 或多个人，所以疑问句以 *Do* 开头：${sentence}\n\n**检验。** 确认句中有实义动词（需要 *do/does* 而非 *is/are*），且主语配 *Do*。`,
              );
        },
        (wrong) =>
          wrong === "Is" || wrong === "Are"
            ? t(
                `*${wrong}* starts a question with *be*, not a question with a plain action verb.`,
                `*${wrong}* 用于 *be* 动词的疑问句，不用于实义动词的疑问句。`,
              )
            : wrong === "Do"
              ? t(
                  "*Do* goes with *I*, *you*, *we*, *they*, and plural subjects, not with a single third-person subject.",
                  "*Do* 用于 *I*、*you*、*we*、*they* 和复数主语，不用于第三人称单数主语。",
                )
              : t(
                  "*Does* goes with a single third-person subject (*he*, *she*, *it*), not with *I*, *you*, *we*, *they*, or plural subjects.",
                  "*Does* 用于第三人称单数主语（*he*、*she*、*it*），不用于 *I*、*you*、*we*、*they* 或复数主语。",
                ),
      ),
    ),
    point(
      "write",
      t("Making a question", "写出疑问句"),
      t(
        "Put *Do* or *Does* first, then the subject, then the verb with no *-s*: *Tom plays football.* → *Does Tom play football?*\n\n> **Watch out.** Remember three shifts when turning a statement into a question: add *Do/Does* at the front, drop *-s* from the verb (*has* -> *have*, *studies* -> *study*), and change *I* to *you* when asking the speaker.",
        "先写 *Do* 或 *Does*，再写主语，然后写不加 *-s* 的动词：*Tom plays football.* → *Does Tom play football?* *plays* 要变回 *play*。\n\n> **注意。** 陈述句改疑问句时记住三处变化：句首加 *Do/Does*、实义动词去掉 *-s* 恢复原形（*has* -> *have*、*studies* -> *study*），以及向说话人发问时把 *I* 改成 *you*。",
      ),
      typedGenerator(
        "sentence",
        t("Write the question.", "写出疑问句。"),
        questionWriteBank,
        (right) => {
          const aux = right.split(" ")[0] ?? "Do";
          return t(
            `Put *${aux}* first, then the subject, then the verb with no *-s*, and end with a question mark: ${right}\n\n**Check.** Verify all four parts: *${aux}* at the front, the matching subject, the plain base verb with no *-s*, and a question mark (?) at the end.`,
            `先写 *${aux}*，再写主语，然后写不加 *-s* 的动词原形，句末用问号：${right}\n\n**检验。** 核对四处：句首 *${aux}*、对应主语、不带 *-s* 的动词原形，以及句末问号。`,
          );
        },
        presentSimpleQuestionsWriteNot,
      ),
    ),
    point(
      "answer",
      t("Short answers", "简短回答"),
      t(
        "Answer with *do*, *does*, *don't* or *doesn't*, not the verb again: *Does she like art?* → *Yes, she does.* / *No, she doesn't.* *Do you like art?* → *Yes, I do.*\n\n> **Watch out.** Match the helper in the answer to the helper in the question (*Do/Does* -> *do/does/don't/doesn't*, never *am/is/are*), and adjust *do* vs. *does* to the reply pronoun (*I/we/they* -> *do*, *he/she* -> *does*).",
        "简短回答用 *do*、*does*、*don't* 或 *doesn't*，不重复动词：*Does she like art?* → *Yes, she does.* / *No, she doesn't.* *Do you like art?* → *Yes, I do.* 中文常用“喜欢”“不喜欢”来回答，英语却不说 *Yes, she likes.*\n\n> **注意。** 回答里的助动词要和问句呼应（*Do/Does* 问就用 *do/does/don't/doesn't* 答，绝不用 *am/is/are*），并按答句代词区分 *do* 与 *does*（*I/we/they* 用 *do*，*he/she* 用 *does*）。",
      ),
      choiceGenerator(
        t("Choose the short answer.", "选出简短回答。"),
        shortAnswerBank,
        (right, shown) => {
          const question = shown.replace(/ \(.*\)$/u, "");
          const aux = right.includes("does") ? "does" : "do";
          return t(
            `A short answer uses the pronoun for the person asked about and the *${aux}* that pronoun takes, not the verb again: ${question} — ${right}\n\n**Check.** Match the pronoun to the question's subject, confirm *do/does* (not *be*), and check that *Yes* pairs with positive and *No* pairs with *-n't*.`,
            `简短回答用代表被问对象的代词，再加这个代词要用的 *${aux}*，不重复动词：${question} — ${right}\n\n**检验。** 确认代词对应问句主语、助动词用的是 *do/does*（而非 *be*），且 *Yes* 配肯定、*No* 配 *-n't*。`,
          );
        },
        (wrong, _right, _shown, position) =>
          position === 1
            ? t(
                `*${wrong}* answers with *be*, but the question asks with *do* or *does*, so the answer must use *do* or *does* too.`,
                `*${wrong}* 用的是 *be* 动词，但问句用 *do* 或 *does* 提问，回答也要用 *do* 或 *does*。`,
              )
            : t(
                `The helper in *${wrong.replace(/\.$/u, "")}* does not agree with its pronoun: *he/she* takes *does/doesn't*, while *I/we/they* takes *do/don't*.`,
                `*${wrong.replace(/\.$/u, "")}* 里的助动词与代词不搭配：*he/she* 用 *does/doesn't*，*I/we/they* 用 *do/don't*。`,
              ),
      ),
    ),
  ],
};

// Writing questions.

const askPeople: readonly (readonly [p: string, P: string, single: boolean])[] = [
  ["she", "She", true],
  ["he", "He", true],
  ["they", "They", false],
];

const beFacts: readonly string[] = ["at school", "hungry", "tired", "in the garden", "from China", "happy", "busy"];

const doQuestions = Array.from({ length: 28 }, (_, k) => {
  const [p, P, single] = askPeople[k % askPeople.length] ?? ["she", "She", true];
  const [verb, third, rest] = deeds[k % deeds.length] ?? ["like", "likes", "math"];
  const aux = single ? "does" : "do";
  const yes = k % 2 === 0;
  const answer = yes ? `Yes, ${p} ${aux}. ${P} ${single ? third : verb} ${rest}.` : `No, ${p} ${aux}n't. ${P} ${aux}n't ${verb} ${rest}.`;
  const question = `${sentenceCase(aux)} ${p} ${verb} ${rest}?`;
  return {
    answer,
    question,
    wrong: [`${P} ${single ? third : verb} ${rest}?`, `${sentenceCase(aux)} ${p} ${single ? third : `${verb}s`} ${rest}?`],
  };
});

const beQuestions = Array.from({ length: 14 }, (_, k) => {
  const [p, P, single] = askPeople[k % askPeople.length] ?? ["she", "She", true];
  const fact = beFacts[k % beFacts.length] ?? "happy";
  const be = single ? "is" : "are";
  const yes = k % 2 === 0;
  const answer = yes ? `Yes, ${p} ${be}. ${P} ${be} ${fact}.` : `No, ${p} ${be}n't. ${P} ${be}n't ${fact}.`;
  const question = `${sentenceCase(be)} ${p} ${fact}?`;
  return { answer, question, wrong: [`${P} ${be} ${fact}?`, `${single ? "Does" : "Do"} ${p} ${be} ${fact}?`] };
});

const writtenQuestions = interleave([doQuestions.slice(0, 14), doQuestions.slice(14), beQuestions]);

const writeQuestionChoiceBank: readonly ChoiceItem[] = writtenQuestions.map(
  ({ answer, question, wrong }): ChoiceItem => [answer, question, wrong],
);
const writeQuestionTypedBank: readonly TypedItem[] = writtenQuestions.map(
  ({ answer, question, wrong }): TypedItem => ({
    shown: answer,
    accepted: [question],
    wrong,
  }),
);

/** askedWhy explains which question a short answer and its sentence reply to. */
const askedWhy = (question: string): Text => {
  const first = question.split(" ")[0] ?? "Do";
  const be = first === "Is" || first === "Are";
  return be
    ? t(
        `The short answer uses *${first.toLowerCase()}*, a form of *be*, so the question puts *${first}* before the subject: ${question}\n\n**Check.** Confirm that *${first}* leads the question (with no *do* or *does* added), the subject follows right after, and a question mark closes the sentence.`,
        `简短回答用的是 *be* 动词 *${first.toLowerCase()}*，所以问句把 *${first}* 放在主语前面：${question}\n\n**检验。** 确认 *${first}* 位于句首（没有多余的 *do* 或 *does*）、主语紧随其后，且句末是问号。`,
      )
    : t(
        `The short answer uses *${first.toLowerCase()}*, so the question starts with *${first}*, then the subject and the plain verb: ${question}\n\n**Check.** Confirm that *${first}* leads the question, the verb after the subject has no *-s*, and a question mark closes the sentence.`,
        `简短回答用的是 *${first.toLowerCase()}*，所以问句以 *${first}* 开头，接着是主语和动词原形：${question}\n\n**检验。** 确认 *${first}* 位于句首、主语后的动词没有 *-s*，且句末是问号。`,
      );
};

/** whyNotAsked explains a wrong question for a short answer without revealing the answer. */
const whyNotAsked = (wrong: string, right: string, _shown: string, position: number): Text =>
  position === 0
    ? t(
        `*${wrong}* keeps statement word order and only adds a question mark; an English yes/no question moves *be* or *do/does* to the front.`,
        `*${wrong}* 保留了陈述句的语序，只加了问号；英语一般疑问句要把 *be* 或 *do/does* 放到句首。`,
      )
    : /^(Is|Are) /u.test(right)
      ? t(
          `*${wrong}* puts *do* or *does* before *be*, but a question with *be* needs no *do* or *does*.`,
          `*${wrong}* 在 *be* 动词前又加了 *do* 或 *does*，但 *be* 动词的问句不需要 *do* 或 *does*。`,
        )
      : t(
          `*${wrong}* keeps an *-s* on the verb, but after *do* or *does* the main verb must stay plain.`,
          `*${wrong}* 的动词还带着 *-s*，但在 *do* 或 *does* 后面，实义动词必须用原形。`,
        );

const writingQuestions: TopicDef = {
  id: "writing-questions",
  title: t("Writing Questions", "写问句"),
  summary: t(
    "Write the question that an answer replies to: Yes, she does. She likes art. asks Does she like art?",
    "写出与答句对应的问句：Yes, she does. She likes art. 对应 Does she like art?",
  ),
  intro: t(
    "Read the answer *No, they aren't. They aren't busy.* versus *No, they don't. They don't drink coffee.* The short answer hands you the exact opening word of the question—*Are* for *be* sentences, *Do/Does* for action verbs. In this topic, you work backward from answers to pick and write accurate yes/no questions.",
    "读一读这两组答句：*No, they aren't. They aren't busy.* 与 *No, they don't. They don't drink coffee.* 简短回答直接告诉你问句该用哪个词开头——*be* 句用 *Are*，实义动词句用 *Do/Does*。本主题带你根据答句倒推并写出准确的一般疑问句。",
  ),
  prerequisites: ["present-simple-questions", "questions-with-be"],
  encompasses: [
    { topic: "present-simple-questions", weight: 0.4 },
    { topic: "questions-with-be", weight: 0.3 },
  ],
  xp: 20,
  strand: "writing",
  knowledgePoints: [
    point(
      "choose",
      t("The question for an answer", "选出答句对应的问句"),
      t(
        "Look at the short answer. *Yes, she does* answers a question with *Does*; *Yes, he is* answers a question with *Is*. Then build the question from the second sentence: *She likes art.* → *Does she like art?* *He is tired.* → *Is he tired?*\n\n> **Watch out.** Never combine *do/does* with *is/are* (*Does he is tired?* is wrong), and never keep *-s* on the verb after *Does*.",
        "先看简短回答。*Yes, she does* 回答的是以 *Does* 开头的问句；*Yes, he is* 回答的是以 *Is* 开头的问句。再根据第二句话写出问句：*She likes art.* → *Does she like art?* *He is tired.* → *Is he tired?*\n\n英语问句不能像中文那样只改标点：*She likes art?* 不是正确的问句。\n\n> **注意。** 切勿把 *do/does* 和 *is/are* 混在一起用（*Does he is tired?* 是错的），也不要在 *Does* 后面保留动词的 *-s*。",
      ),
      choiceGenerator(
        t("Which question does this answer reply to?", "这个回答对应哪个问句？"),
        writeQuestionChoiceBank,
        askedWhy,
        whyNotAsked,
      ),
    ),
    point(
      "write",
      t("Writing the question", "写出问句"),
      t(
        "Take *do*, *does*, *is* or *are* from the short answer and put it first, then the subject and the rest of the second sentence, with a plain verb after *do* or *does*—for example, *No, he doesn't. He doesn't eat meat.* → *Does he eat meat?* Start with a capital letter and end with a question mark.\n\n> **Watch out.** When the answer is *No* (*doesn't*, *don't*, *isn't*, *aren't*), drop the *n't* when you build the positive question (*Does he…?*, *Is she…?*).",
        "从简短回答里取出 *do*、*does*、*is* 或 *are* 放在句首，再接主语和第二句的其余部分；*do* 或 *does* 后面的动词用原形，例如 *No, he doesn't. He doesn't eat meat.* → *Does he eat meat?* 句首大写，句末加问号。\n\n> **注意。** 当答句是否定（*doesn't*、*don't*、*isn't*、*aren't*）时，倒推一般疑问句要去掉 *n't*（写成 *Does he…?*、*Is she…?*）。",
      ),
      typedGenerator(
        "sentence",
        t("Write the question that this answer replies to.", "写出这个回答对应的问句。"),
        writeQuestionTypedBank,
        askedWhy,
        writingQuestionsWriteNot,
      ),
    ),
  ],
};

/** topics are the topics of the unit School. */
export const topics: readonly TopicDef[] = [
  schoolSubjects.topic,
  schoolwork.topic,
  littleWords2.topic,
  presentSimpleNegatives,
  presentSimpleQuestions,
  writingQuestions,
];

/** vocabulary are the words the unit School teaches. */
export const vocabulary: readonly WordBatch[] = [schoolSubjects.batch, schoolwork.batch, littleWords2.batch];
