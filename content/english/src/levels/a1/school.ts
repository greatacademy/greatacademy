// A1, unit 8: School. School subjects, schoolwork and little words, don't and doesn't, do and does questions, and
// writing questions.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, interleave, sentenceCase, vocabularyTopic, word } from "../words.ts";

const schoolSubjects = vocabularyTopic({
  id: "a1-words-school-subjects",
  title: t("School Subjects", "学科"),
  summary: t(
    "Math, science, art and history, classes, lessons and tests, learning and teaching.",
    "数学、科学、美术和历史，课、课程和测验，学和教。",
  ),
  prerequisites: ["pre-a1-words-classroom"],
  words: [
    word(
      "math",
      "the subject of numbers and shapes",
      "数学",
      "In {math}, we learn to add and take away numbers.|art history | Two plus two is four. {Math} is easy!|Art History | I need a ruler for my {math} class.|art history",
      "art history",
    ),
    word(
      "science sciences",
      "the subject about plants, animals, the body and the world, with tests and experiments",
      "科学",
      "In {science}, we learn how plants grow.|art math | Our {science} teacher showed us a frog's heart.|art math | Water turns into ice at zero degrees. We learned that in {science}.|art history",
      "art math",
    ),
    word(
      "art arts",
      "drawing, painting and making beautiful things",
      "美术；艺术",
      "In {art}, we paint pictures.|math science | Bring your colored pencils to {art} class.|math history | I love {art}. I want to be a painter.|math science",
      "math history",
    ),
    word(
      "history",
      "the subject about what happened long ago",
      "历史",
      "In {history}, we learn about people from long ago.|math science | The Great Wall is very old. We read about it in {history}.|math art | My {history} teacher tells us about kings and queens.|math science",
      "math science",
    ),
    word(
      "class classes",
      "a group of students who learn together; a time when they learn",
      "班级；课",
      "There are thirty students in my {class}.|test subject | Our English {class} starts at nine.|subject test | Be quiet in {class}, please.|subject test",
      "lesson subject",
    ),
    word(
      "lesson lessons",
      "a time when someone teaches you something",
      "课；一节课",
      "I have a piano {lesson} on Thursday.|subject test | Today's {lesson} is about animals.|subject easy | Each {lesson} is forty minutes long.|subject test",
      "subject test",
    ),
    word(
      "subject subjects",
      "something you learn at school, like math or art",
      "学科；科目",
      "My favorite {subject} is science.|lesson test | We have six {subjects} this year: math, English, science, art, music and sport.|lessons tests | History is my best {subject}.|lesson test",
      "lesson class",
    ),
    word(
      "test tests",
      "some questions to see how much you know",
      "测验；考试",
      "We have a math {test} tomorrow. I need to study.|subject class | I got all the answers right on the {test}!|subject class | The {test} has ten questions.|subject class",
      "lesson subject",
    ),
    word(
      "learn learns learned learning",
      "to get to know something new",
      "学习",
      "I {learn} English at school.|teach know | We {learned} a new song today.|taught knew | Babies {learn} to walk at about one.|teach know",
      "teach know",
    ),
    word(
      "teach teaches taught teaching",
      "to help someone learn something",
      "教",
      "Ms. Li {teaches} us math.|learns knows | Can you {teach} me to swim?|learn know | My mom {taught} me to cook.|learned knew",
      "learn know",
    ),
    word(
      "easy easier easiest",
      "not difficult",
      "容易的",
      "This test is {easy}. I know all the answers!|difficult wrong | Riding a bike is {easy} for me.|difficult wrong | The first question is {easy}: two plus two.|difficult wrong",
      "difficult wrong",
    ),
    word(
      "difficult",
      "not easy; needing a lot of work",
      "困难的",
      "This math problem is {difficult}. I can't do it.|easy right | Chinese is {difficult} for many English speakers.|easy right | The test was very {difficult}. Nobody got all the answers.|easy right",
      "easy right",
    ),
  ],
});

const schoolwork = vocabularyTopic({
  id: "a1-words-schoolwork",
  title: t("Schoolwork", "功课"),
  summary: t(
    "Students, questions and answers, words, pages and paper, spelling, knowing and understanding.",
    "学生、问题和答案、单词、页和纸、拼写、知道和理解。",
  ),
  prerequisites: ["a1-words-school-subjects"],
  words: [
    word(
      "student students",
      "a person who learns at a school",
      "学生",
      "There are thirty {students} in our class.|questions pages | I'm a {student} at Park School.|question page | The {students} are reading in the library.|questions papers",
      "question page",
    ),
    word(
      "question questions",
      "something you ask",
      "问题",
      'Can I ask a {question}? — Yes, of course.|page paper | The test has ten {questions}.|pages papers | "What is your name?" is a {question}.|word page',
      "answer word",
    ),
    word(
      "answer answers answered answering",
      "what you say or write after a question; to reply",
      "回答；答案",
      "What is the {answer} to question five?|word page | Please {answer} the phone.|spell ask | She {answered} all the questions.|asked spelled",
      "question ask",
    ),
    word(
      "ask asks asked asking",
      "to say a question to someone",
      "问",
      "Can I {ask} you a question?|answer spell | If you don't know, {ask} the teacher.|answer spell | He {asked} me my name.|answered spelled",
      "answer spell",
    ),
    word(
      "word words",
      "a group of letters that means something",
      "单词",
      '"Cat" is a short {word}.|page paper | How do you spell this {word}?|page paper | There are ten new {words} in this lesson.|pages papers',
      "page question",
    ),
    word(
      "page pages",
      "one side of a piece of paper in a book",
      "页",
      "Open your books to {page} ten.|word paper | This book has two hundred {pages}.|words papers | The picture is on the next {page}.|word paper",
      "paper word",
    ),
    word(
      "paper papers",
      "the thin white material you write on",
      "纸",
      "Write your name on the {paper}.|page word | Books are made of {paper}.|pages words | Can I have a piece of {paper}?|page word",
      "page word",
    ),
    word(
      "spell spells spelled spelling",
      "to say or write the letters of a word in the right order",
      "拼写",
      'How do you {spell} your name? — L-I-L-Y.|ask know | Can you {spell} "elephant"?|ask know | He {spelled} the word wrong.|asked knew',
      "ask know",
    ),
    word(
      "understand understands understood understanding",
      "to know what something means",
      "理解；明白",
      "I don't {understand} this word. What does it mean?|spell ask | Do you {understand}? — Yes, I see.|spell ask | Sorry, I didn't {understand} the question.|spell teach",
      "spell ask",
    ),
    word(
      "know knows knew known knowing",
      "to have something in your mind; to be sure of something",
      "知道",
      "I {know} the answer! It's seven.|ask spell | Do you {know} her name?|ask spell | I don't {know} where my pen is.|ask spell",
      "ask spell",
    ),
    word(
      "right",
      "correct; also the side opposite the left",
      "正确的；右边",
      "Two plus two is four. That's {right}!|wrong difficult | Is this answer {right} or wrong?|easy difficult | Turn {right} at the school.|wrong easy",
      "wrong easy",
    ),
    word(
      "wrong",
      "not correct",
      "错误的",
      "Two plus two is five? No, that's {wrong}!|right easy | Sorry, I have the {wrong} number.|right easy | What's {wrong}? Why are you crying?|right easy",
      "right easy",
    ),
  ],
});

const littleWords2 = vocabularyTopic({
  id: "a1-words-little-words-2",
  title: t("Little Words 2", "小词 2"),
  summary: t(
    "Which, because, so, if, than, something, someone, anything, nothing, everyone and everything.",
    "which、because、so、if、than、something、someone、anything、nothing、everyone 和 everything。",
  ),
  prerequisites: ["a1-words-little-words-1"],
  words: [
    word(
      "which",
      "the word you use to ask about one of a group",
      "哪一个",
      "{Which} color do you like, red or blue?|Because If | {Which} bag is yours? — The black one.|Because So | I don't know {which} bus to take.|than because",
      "because if",
    ),
    word(
      "because",
      "for the reason that",
      "因为",
      "I'm tired {because} I went to bed late.|than which | She is happy {because} it's her birthday.|than which | Why are you sad? — {Because} my cat is sick.|Than Which",
      "so than",
    ),
    word(
      "so",
      "for that reason; very",
      "所以；如此",
      "It was raining, {so} we stayed at home.|than which | I'm hungry, {so} I'm eating an apple.|than which | The cake is {so} good!|than which",
      "because than",
    ),
    word(
      "if",
      "used to say what happens when something else happens",
      "如果",
      "{If} it rains, we can watch a movie.|Than Which | You can play {if} you finish your homework.|than which | Call me {if} you need help.|than which",
      "because than",
    ),
    word(
      "than",
      "a word you use when you compare two things",
      "比",
      "An elephant is bigger {than} a dog.|because if | My brother is older {than} me.|because so | Ten is more {than} five.|because if",
      "because so",
    ),
    word(
      "something",
      "a thing; you don't say which one",
      "某事；某物",
      "I'm hungry. Can I have {something} to eat?|nothing everyone | There's {something} in my shoe!|someone everyone | I want to tell you {something}.|everyone someone",
      "someone nothing",
    ),
    word(
      "someone",
      "a person; you don't say which one",
      "某人",
      "{Someone} is at the door. Can you open it?|Something Nothing | Can {someone} help me, please?|something nothing | I saw {someone} in the garden.|something everything",
      "something everyone",
    ),
    word(
      "anything",
      "any thing; used in questions and negatives",
      "任何事物",
      "Do you need {anything} from the shop?|someone everyone | I can't see {anything}. It's too dark.|someone everyone | Is there {anything} in the box?|someone everyone",
      "something nothing",
    ),
    word(
      "nothing",
      "no thing; not anything",
      "什么也没有",
      'The box is empty. There is {nothing} in it.|someone everyone | I have {nothing} to do. I\'m bored.|someone everyone | "What\'s in your hand?" — "{Nothing}!"|Someone Everyone',
      "something anything",
    ),
    word(
      "everyone",
      "all the people",
      "每个人",
      "Good morning, {everyone}!|something anything | {Everyone} in my class likes music.|Something Anything | Is {everyone} here? Let's begin.|something anything",
      "everything someone",
    ),
    word(
      "everything",
      "all the things",
      "一切；所有东西",
      "Thank you for {everything}!|everyone someone | I ate {everything} on my plate.|everyone someone | {Everything} in this shop is cheap.|Everyone Someone",
      "everyone something",
    ),
  ],
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
      typedGenerator("sentence-pattern", t("Fix the sentence.", "改正这个句子。"), negFixBank, negWhy),
    ),
    point(
      "make",
      t("Making a sentence negative", "把句子改成否定句"),
      t(
        "To make a sentence negative, put *don't* or *doesn't* before the verb and take the *-s* off the verb: *Tom plays football.* → *Tom doesn't play football.* *We eat meat.* → *We don't eat meat.*\n\n> **Watch out.** Watch irregular *has* in particular: *She has a computer.* becomes *She doesn't have a computer.* (never *doesn't has*).",
        "把句子改成否定句时，在动词前加 *don't* 或 *doesn't*，并去掉动词的 *-s*：*Tom plays football.* → *Tom doesn't play football.* *We eat meat.* → *We don't eat meat.* 注意：*plays* 变回 *play*。\n\n> **注意。** 特别留心不规则动词 *has*：*She has a computer.* 要改成 *She doesn't have a computer.*（绝不是 *doesn't has*）。",
      ),
      typedGenerator("sentence-pattern", t("Change the sentence.", "改写这个句子。"), negMakeBank, negWhy),
    ),
  ],
};

// Do and does questions.

const lowerSubject = (subject: string) => (subject === "I" ? "I" : subject.charAt(0).toLowerCase() + subject.slice(1));

/** askedSubject is the subject of a question to the person who said the sentence: I becomes you. */
const askedSubject = (subject: string) => (subject === "I" ? "you" : lowerSubject(subject));

/** replyPronoun is the pronoun of a short answer to a question about asked. */
const replyPronoun = (asked: string, single: boolean): string =>
  asked === "you" ? "I" : asked === "we" ? "we" : !single ? "they" : /^(she|lily)$/u.test(asked) ? "she" : "he";

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
      typedGenerator("sentence", t("Write the question.", "写出疑问句。"), questionWriteBank, (right) => {
        const aux = right.split(" ")[0] ?? "Do";
        return t(
          `Put *${aux}* first, then the subject, then the verb with no *-s*, and end with a question mark: ${right}\n\n**Check.** Verify all four parts: *${aux}* at the front, the matching subject, the plain base verb with no *-s*, and a question mark (?) at the end.`,
          `先写 *${aux}*，再写主语，然后写不加 *-s* 的动词原形，句末用问号：${right}\n\n**检验。** 核对四处：句首 *${aux}*、对应主语、不带 *-s* 的动词原形，以及句末问号。`,
        );
      }),
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
