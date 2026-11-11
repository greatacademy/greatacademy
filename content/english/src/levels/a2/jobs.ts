// A2, unit 12: Jobs and Dreams. More jobs, work life and ambitions; questions about the subject and about the object;
// a dream job judged by a model.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { interleave, vocabularyTopic, word } from "../words.ts";
import { judgedTopic } from "./kit.ts";

const jobs2 = vocabularyTopic({
  id: "a2-words-jobs-2",
  title: t("More Jobs", "更多职业"),
  summary: t(
    "Engineers, scientists and mechanics; artists, singers, actors and writers; pilots, waiters and chefs; firefighters and businessmen.",
    "工程师、科学家和机修工；艺术家、歌手、演员和作家；飞行员、服务员和厨师；消防员和商人。",
  ),
  prerequisites: ["a1-words-jobs"],
  words: [
    word(
      "engineer engineers",
      "a person who designs and builds machines, roads or bridges",
      "工程师",
      "The {engineer} designed a new bridge over the river.|waiter singer | My mom is an {engineer}. She builds roads.|actor artist | {Engineers} are building a new subway line.|Waiters Singers",
      "mechanic scientist",
    ),
    word(
      "scientist scientists",
      "a person who studies how nature and the world work",
      "科学家",
      "The {scientist} did an experiment in her lab.|waiter actor | {Scientists} are looking for a cure for the disease.|Actors Waiters | Marie Curie was a famous {scientist}.|pilot chef",
      "engineer artist",
    ),
    word(
      "artist artists",
      "a person who paints or draws pictures",
      "艺术家；画家",
      "The {artist} painted a picture of the sea.|pilot mechanic | There are paintings by local {artists} in the gallery.|pilots mechanics | She wants to be an {artist} because she loves painting.|actor engineer",
      "actor writer",
    ),
    word(
      "singer singers",
      "a person who sings, often as a job",
      "歌手",
      "She's a famous pop {singer}.|pilot mechanic | The {singer} sang three songs at the concert.|chef mechanic | My brother is a {singer} in a band.|chef pilot",
      "actor writer",
    ),
    word(
      "actor actors",
      "a person who plays a part in a film or a play",
      "演员",
      "Jackie Chan is a famous {actor}.|pilot mechanic | The {actors} were great in the school play.|pilots chefs | He wants to be an {actor} in films.|engineer waiter",
      "singer artist",
    ),
    word(
      "pilot pilots",
      "a person who flies a plane",
      "飞行员",
      "The {pilot} said we would land in ten minutes.|chef waiter | My uncle is a {pilot}. He flies to Europe every week.|waiter chef | The {pilots} sat at the front of the plane.|chefs mechanics",
      "passenger mechanic",
    ),
    word(
      "waiter waiters",
      "a person who brings food to your table in a restaurant",
      "服务员",
      "The {waiter} brought us the menu.|pilot mechanic | Let's ask the {waiter} for the bill.|pilot artist | She worked as a {waiter} in a cafe last summer.|pilot engineer",
      "chef customer",
    ),
    word(
      "chef chefs",
      "a person who cooks in a restaurant",
      "厨师",
      "The {chef} cooked us a special dish.|pilot mechanic | My dream is to be a {chef} in a big hotel kitchen.|pilot mechanic | There are five {chefs} in the restaurant's kitchen.|pilots mechanics",
      "waiter customer",
    ),
    word(
      "writer writers",
      "a person who writes books or stories",
      "作家",
      "Lu Xun was a famous Chinese {writer}.|pilot mechanic | The {writer} is signing her new book at the bookstore.|pilot mechanic | She wants to be a {writer} because she loves telling stories.|pilot mechanic",
      "artist singer",
    ),
    word(
      "mechanic mechanics",
      "a person who repairs cars and machines",
      "机修工",
      "The {mechanic} fixed my car in an hour.|waiter singer | Take your motorbike to a {mechanic}.|waiter singer | My dad is a {mechanic} at a garage.|singer artist",
      "engineer pilot",
    ),
    word(
      "firefighter firefighters",
      "a person whose job is to stop fires",
      "消防员",
      "The {firefighters} put out the fire quickly.|waiters singers | A {firefighter} saved the cat from the burning house.|waiter singer | {Firefighters} are very brave.|Waiters Chefs",
      "police mechanic",
    ),
    word(
      "businessman businessmen",
      "a man who works in business, buying and selling things",
      "商人",
      "He's a {businessman} with three shops in town.|pilot singer | Many {businessmen} were at the meeting in the hotel.|waiter chef | The {businessman} sold his company for a lot of money.|waiter singer",
      "manager waiter",
    ),
  ],
});

const workLife = vocabularyTopic({
  id: "a2-words-work-life",
  title: t("Work Life", "工作生活"),
  summary: t(
    "Companies, bosses, managers, colleagues and staff; earning a salary; careers, interviews, skills and experience; part-time work.",
    "公司、老板、经理、同事和员工；挣工资；职业、面试、技能和经验；兼职工作。",
  ),
  prerequisites: ["a2-words-jobs-2"],
  words: [
    word(
      "company companies",
      "a business that sells things or services",
      "公司",
      "My mom works for a big {company} in Shanghai.|salary career | The {company} makes phones.|salary skill | Many {companies} are looking for new workers.|salaries skills",
      "salary career",
    ),
    word(
      "boss bosses",
      "the person who tells you what to do at work",
      "老板；上司",
      "My {boss} let me go home early.|salary skill | I asked my {boss} for a day off.|salary career | She's the {boss} of a small company.|salary staff",
      "salary staff",
    ),
    word(
      "earn earns earned earning",
      "to get money for work you do",
      "挣（钱）",
      "She {earns} a lot of money as a doctor.|improves graduates | I {earned} fifty yuan for washing the car.|improved graduated | How much do waiters {earn}?|improve graduate",
      "spend win",
    ),
    word(
      "salary salaries",
      "the money you get every month for your job",
      "工资",
      "His {salary} is 8,000 yuan a month.|career skill | Teachers should get higher {salaries}.|careers skills | She spends half her {salary} on rent.|career skill",
      "career skill",
    ),
    word(
      "career careers",
      "the jobs you do in your life, in one kind of work",
      "职业；事业",
      "She had a long {career} as a teacher.|salary staff | I want a {career} in medicine.|salary boss | Football players have short {careers}.|salaries bosses",
      "salary staff",
    ),
    word(
      "interview interviews",
      "a meeting where someone asks you questions to see if you are right for a job",
      "面试；采访",
      "I have a job {interview} tomorrow at ten.|career salary | Wear nice clothes to the {interview}.|career salary | The singer gave an {interview} on TV.|experience skill",
      "career salary",
    ),
    word(
      "skill skills",
      "something you can do well because you learned it",
      "技能",
      "Speaking two languages is a useful {skill}.|salary boss | What {skills} do you need for this job?|salaries bosses | Cooking is a {skill} you can learn.|salary career",
      "salary career",
    ),
    word(
      "experience experiences",
      "what you learn from doing something; something that happens to you",
      "经验；经历",
      "Do you have any {experience} of working with children?|salary skill | Visiting the Great Wall was an amazing {experience}.|salary staff | She has five years of {experience} as a nurse.|career skill",
      "career salary",
    ),
    word(
      "colleague colleagues",
      "a person you work with",
      "同事",
      "I had lunch with my {colleagues} from the office.|salaries careers | My {colleague} helped me with the report.|salary career | She is friendly with all her {colleagues}.|salaries skills",
      "boss salary",
    ),
    word(
      "manager managers",
      "a person who runs a shop, a hotel or part of a company",
      "经理",
      "I'd like to speak to the {manager}, please.|salary career | The hotel {manager} gave us a better room.|salary skill | She became a {manager} after five years.|salary staff",
      "staff salary",
    ),
    word(
      "staff",
      "all the people who work for a company or a school",
      "员工；全体职员",
      "The hotel {staff} were very friendly.|career salary | Our school has a {staff} of forty teachers.|career skill | The shop needs more {staff} at weekends.|careers salaries",
      "boss career",
    ),
    word(
      "part-time",
      "working only some of the day or the week",
      "兼职的",
      "My sister has a {part-time} job at a cafe.|hard-working useful | She works {part-time} because she has a baby.|hard-working useful | Many students do {part-time} work.|hard-working cheerful",
      "hard-working useful",
    ),
  ],
});

const ambitions = vocabularyTopic({
  id: "a2-words-ambitions",
  title: t("Ambitions", "抱负"),
  summary: t(
    "Becoming something; success and failure; improving and studying; universities, colleges, courses and graduating; ambitions; working hard.",
    "成为什么；成功和失败；进步和学习；大学、学院、课程和毕业；抱负；勤奋。",
  ),
  prerequisites: ["a2-words-work-life"],
  words: [
    word(
      "become becomes became becoming",
      "to start to be",
      "成为；变得",
      "She wants to {become} a doctor.|succeed improve | He {became} a famous singer at nineteen.|succeeded improved | It's {becoming} cold. Winter is coming.|improving succeeding",
      "succeed improve",
    ),
    word(
      "succeed succeeds succeeded succeeding",
      "to do what you tried to do",
      "成功",
      "If you work hard, you will {succeed}.|fail become | She {succeeded} in passing the exam.|failed improved | He tried three times and finally {succeeded}.|failed became",
      "fail become",
    ),
    word(
      "success successes",
      "getting what you tried to get",
      "成功",
      "The party was a big {success}. Everybody had fun.|ambition course | Hard work is the key to {success}.|ambition university | Her new book is a great {success}.|ambition college",
      "ambition course",
    ),
    word(
      "fail fails failed failing",
      "to not pass a test; to not do what you tried to do",
      "失败；不及格",
      "I {failed} my driving test, so I have to take it again.|succeeded improved | Don't be afraid to {fail}.|succeed graduate | He {failed} to finish the race.|succeeded improved",
      "succeed improve",
    ),
    word(
      "improve improves improved improving",
      "to make or become better",
      "提高；改善",
      "Read more to {improve} your English.|succeed graduate | Her English has {improved} a lot this year.|succeeded graduated | The weather is {improving}. The sun is out.|succeeding graduating",
      "succeed graduate",
    ),
    word(
      "study studies studied studying",
      "to learn about a subject; to read and learn for a test",
      "学习；研究",
      "She {studies} biology at university.|graduates earns | I {studied} for three hours for the test.|graduated improved | Where did you {study} English?|graduate succeed",
      "graduate teach",
    ),
    word(
      "university universities",
      "a place where people study after high school for a degree",
      "大学",
      "My sister goes to {university} in Beijing.|course ambition | He studied law at {university}.|ambition success | There are three {universities} in our city.|courses ambitions",
      "course ambition",
    ),
    word(
      "college colleges",
      "a school for study after high school, often for a job",
      "学院；大学",
      "After high school, she went to {college} to study art.|course ambition | My brother is in his first year at {college}.|ambition success | This {college} trains nurses.|ambition success",
      "course ambition",
    ),
    word(
      "graduate graduates graduated graduating",
      "to finish your studies at a school or a university; a person who has done this",
      "毕业；毕业生",
      "She {graduated} from university last year.|succeeded improved | When I {graduate}, I want to travel.|succeed improve | The {graduates} threw their hats in the air.|ambitions successes",
      "succeed improve",
    ),
    word(
      "course courses",
      "a set of lessons about one subject",
      "课程",
      "I'm taking a cooking {course} on Saturdays.|ambition success | The English {course} lasts ten weeks.|ambition success | She did an online {course} in photography.|ambition success",
      "ambition success",
    ),
    word(
      "ambition ambitions",
      "something you really want to do in your life",
      "抱负；雄心",
      "My {ambition} is to become a pilot.|course success | He has big {ambitions} for his company.|courses universities | She worked hard to reach her {ambition}.|course college",
      "course success",
    ),
    word(
      "hard-working",
      "working a lot and with care",
      "勤奋的",
      "She's very {hard-working}. She's always the last to leave.|part-time jealous | {Hard-working} students usually do well.|Jealous Embarrassed | My grandparents were {hard-working} farmers.|jealous embarrassed",
      "part-time lazy",
    ),
  ],
});

// Questions about the subject and about the object.

/**
 * deeds are a subject, its question word, whether it keeps its capital inside a sentence, the past of the verb, its
 * first form, the object and the object's question word.
 */
const deeds: readonly (readonly [string, string, boolean, string, string, string, string])[] = [
  ["Lily", "Who", true, "called", "call", "Sam", "Who"],
  ["My uncle", "Who", false, "met", "meet", "the manager", "Who"],
  ["The waiter", "Who", false, "helped", "help", "the old man", "Who"],
  ["Tom", "Who", true, "invited", "invite", "Anna", "Who"],
  ["The boss", "Who", false, "chose", "choose", "Mr. Lee", "Who"],
  ["My sister", "Who", false, "saw", "see", "a famous actor", "Who"],
  ["The firefighters", "Who", false, "saved", "save", "the children", "Who"],
  ["Jack", "Who", true, "kicked", "kick", "the ball", "What"],
  ["The dog", "What", false, "ate", "eat", "my sandwich", "What"],
  ["The storm", "What", false, "broke", "break", "the window", "What"],
  ["Dad", "Who", true, "cooked", "cook", "dinner", "What"],
  ["Mia", "Who", true, "wrote", "write", "the email", "What"],
  ["Grandma", "Who", true, "sent", "send", "a card", "What"],
  ["The chef", "Who", false, "made", "make", "the cake", "What"],
  ["The cat", "What", false, "woke", "wake", "the baby", "Who"],
  ["Ben", "Who", true, "found", "find", "the keys", "What"],
  ["The mechanic", "Who", false, "fixed", "fix", "my car", "What"],
  ["Our class", "Who", false, "won", "win", "the prize", "What"],
  ["The noise", "What", false, "scared", "scare", "the children", "Who"],
  ["My colleague", "Who", false, "interviewed", "interview", "the singer", "Who"],
  ["The teacher", "Who", false, "praised", "praise", "my essay", "What"],
];

type Deed = (typeof deeds)[number];

const inside = ([subject, , keep]: Deed) => (keep ? subject : subject.charAt(0).toLowerCase() + subject.slice(1));

/** aboutSubject is the question about the doer, its sentence with the doer in bold, and two wrong questions. */
const aboutSubject = (d: Deed) => {
  const [subject, who, , past, base, object] = d;
  return {
    shown: `**${subject}** ${past} ${object}.`,
    right: `${who} ${past} ${object}?`,
    other: `${d[6]} did ${inside(d)} ${base}?`,
    bad: [`${who} did ${past} ${object}?`, `${who} ${base} ${object}?`],
  };
};

/** aboutObject is the question about the one the action is done to. */
const aboutObject = (d: Deed) => {
  const [subject, who, , past, base, object, what] = d;
  return {
    shown: `${subject} ${past} **${object}**.`,
    right: `${what} did ${inside(d)} ${base}?`,
    other: `${who} ${past} ${object}?`,
    bad: [`${what} did ${inside(d)} ${past}?`, `${what} ${inside(d)} ${past}?`],
  };
};

const askChoiceBank: readonly ChoiceItem[] = interleave([
  deeds.map((d): ChoiceItem => {
    const q = aboutSubject(d);
    return [q.shown, q.right, [q.other, q.bad[0] ?? ""]];
  }),
  deeds.map((d): ChoiceItem => {
    const q = aboutObject(d);
    return [q.shown, q.right, [q.other, q.bad[0] ?? ""]];
  }),
]);

const askTypedBank: readonly TypedItem[] = interleave([
  deeds.map((d): TypedItem => {
    const q = aboutObject(d);
    return { shown: q.shown, accepted: [q.right], wrong: [...q.bad, q.other] };
  }),
  deeds.map((d): TypedItem => {
    const q = aboutSubject(d);
    return { shown: q.shown, accepted: [q.right], wrong: [...q.bad, q.other] };
  }),
]);

/** askWhy explains a question about the words in bold of shown. */
const askWhy = (right: string, shown: string): Text => {
  const bold = /\*\*(.+?)\*\*/u.exec(shown)?.[1] ?? "";
  const word = right.split(" ")[0] ?? "Who";
  const kind = word === "Who" ? t("a person", "人") : t("a thing", "物");
  return shown.startsWith("**")
    ? t(
        `*${bold}* did the action, so *${word}* (for ${kind.en}) takes its place and the verb stays in the past, with no *did*: ${right}`,
        `*${bold}* 是动作的发出者，所以用 *${word}*（问${kind["zh-CN"]}）直接代替它，动词保持过去式，不用 *did*：${right}`,
      )
    : t(
        `The action was done to *${bold}*, so ask with *${word}* (for ${kind.en}), then *did*, the subject and the first form of the verb: ${right}`,
        `*${bold}* 是动作的对象，所以用 *${word}*（问${kind["zh-CN"]}）提问，再接 *did*、主语和动词原形：${right}`,
      );
};

/** whyNotAsk explains a question that asks about the other one or builds the question wrong. */
const whyNotAsk = (wrong: string, _right: string, shown: string, position: number): Text => {
  const bold = /\*\*(.+?)\*\*/u.exec(shown)?.[1] ?? "";
  if (position === 0)
    return t(
      `*${wrong}* asks about the other one in the sentence, not about *${bold}*.`,
      `*${wrong}* 问的是句子里的另一方，不是 *${bold}*。`,
    );
  return shown.startsWith("**")
    ? t(
        `*${wrong}* adds *did* and keeps the past form. A question about the one who did it has no *did*.`,
        `*${wrong}* 加了 *did* 又保留了过去式。问动作发出者的问句不用 *did*。`,
      )
    : t(
        `*${wrong}* keeps the past form after *did*. After *did* the verb goes back to its first form.`,
        `*${wrong}* 在 *did* 后面还用过去式。*did* 后面的动词要用原形。`,
      );
};

const subjectAndObjectQuestions: TopicDef = {
  id: "subject-and-object-questions",
  title: t("Who Called You? Who Did You Call?", "Who called you? 和 Who did you call?"),
  summary: t(
    "Who called you? asks about the one who did it and has no did. Who did you call? asks about the other one.",
    "Who called you? 问的是动作的发出者，不用 did；Who did you call? 问的是动作的对象。",
  ),
  prerequisites: ["wh-questions", "past-simple-questions-and-negatives"],
  encompasses: [
    { topic: "past-simple-questions-and-negatives", weight: 0.3 },
    { topic: "wh-questions", weight: 0.2 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "which-question",
      t("Asking about the doer or the other one", "问发出者还是问对象"),
      t(
        "*Lily called Sam.* You can ask about either person.\n\n- About the one who did it (**Lily**): *who* or *what* takes the place of the subject, and the verb stays as it is, with no *did*: *Who called Sam?*\n- About the other one (**Sam**): use *did* and the first form of the verb, as in other questions: *Who did Lily call?*\n\nNot *Who did called Sam?* and not *Who did Lily called?*",
        "*Lily called Sam.* 两个人都可以问。\n\n- 问动作的发出者（**Lily**）：*who* 或 *what* 直接代替主语，动词不变，不用 *did*：*Who called Sam?*\n- 问动作的对象（**Sam**）：和别的问句一样，用 *did* 加动词原形：*Who did Lily call?*\n\n不说 *Who did called Sam?*，也不说 *Who did Lily called?* 中文“谁给萨姆打了电话？”和“莉莉给谁打了电话？”语序不变，英语问对象时却要加 *did* 并把主语放在后面。",
      ),
      choiceGenerator(
        t("Choose the question that asks about the words in bold.", "选出就加粗部分提问的问句。"),
        askChoiceBank,
        askWhy,
        whyNotAsk,
      ),
    ),
    point(
      "write",
      t("Writing the question", "写出问句"),
      t(
        "Write a question about the words in bold. If they did the action, put *who* or *what* in their place: *Who called Sam?* If the action was done to them, use *did*: *Who did Lily call?*",
        "就加粗部分写一个问句。如果加粗部分是动作的发出者，用 *who* 或 *what* 代替它：*Who called Sam?* 如果加粗部分是动作的对象，用 *did*：*Who did Lily call?*",
      ),
      typedGenerator("sentence", t("Write a question about the words in bold.", "就加粗部分写一个问句。"), askTypedBank, askWhy),
    ),
  ],
};

// A dream job.

const dreamJobBank: readonly WritingItem[] = [
  {
    task: "Write about your dream job: a pilot.",
    model:
      "When I grow up, I would like to be a pilot. I love planes, and I want to see the world. Pilots fly to many different countries, so they meet interesting people. It's also a well-paid job. But it isn't easy. I'm going to study hard at math and physics, because pilots need them. I will also go to flight school after high school.",
  },
  {
    task: "Write about your dream job: a doctor.",
    model:
      "My dream job is to be a doctor. I want to help sick people get better. My grandmother was very ill last year, and the doctors saved her life. Since then, I have wanted to do the same. Doctors need to study for many years, so I'm going to work hard at biology and chemistry. I will also volunteer at a hospital in the summer.",
  },
  {
    task: "Write about your dream job: a chef.",
    model:
      "I would like to become a chef in a big restaurant. I love cooking, and I often make dinner for my family. I enjoy trying new recipes from different countries. People are happy when they eat good food, and I want to make them happy. After school I'm going to go to a cooking college. I will also work part-time in a restaurant to get experience.",
  },
  {
    task: "Write about your dream job: a vet.",
    model:
      "My dream is to be a vet. I have loved animals since I was very small, and I have two cats and a rabbit. Vets help animals that are sick or hurt, and I think that is very important. I also like science. To become a vet, I'm going to study biology at university. Now I help at an animal center every Saturday.",
  },
  {
    task: "Write about your dream job: an engineer.",
    model:
      "I would like to be an engineer and build bridges. I love math, and I'm good at solving problems. Bridges connect towns and help people, so the work is useful. Engineers also earn a good salary. I'm going to study engineering at university. At the moment I'm in the robot club at school, and I'm learning to design machines.",
  },
  {
    task: "Write about your dream job: a teacher.",
    model:
      "My dream job is to be an English teacher. I like children, and I enjoy explaining things to people. My own English teacher is very kind, and she made me love the language. I also want to work in different countries. I'm going to study English at university, and I will practice by helping my little cousins with their homework.",
  },
  {
    task: "Write about your dream job: an artist.",
    model:
      "I would like to be an artist. I have painted pictures since I was five, and I draw every day. When I paint, I feel calm and happy. I want to show people beautiful things in my pictures. It is hard to earn money as an artist, but I don't mind. I'm going to go to art college, and I will try to sell my paintings online.",
  },
  {
    task: "Write about your dream job: a firefighter.",
    model:
      "When I'm older, I want to be a firefighter. Firefighters are brave, and they save people's lives. I also like doing sports, and this job needs a strong body. My uncle is a firefighter, and he told me many stories about his work. I'm going to keep fit by running every morning, and I will learn first aid next year.",
  },
  {
    task: "Write about your dream job: a scientist.",
    model:
      "My ambition is to become a scientist. I am very curious, and I always ask why things happen. I would like to find new ways to make clean energy, because the earth needs it. Scientists do experiments every day, and I love experiments. I'm going to study chemistry at university, and now I read science magazines every week.",
  },
  {
    task: "Write about your dream job: a writer.",
    model:
      "I would like to be a writer of children's books. I love reading, and I have written lots of short stories. Books can take children to other worlds, and I want to give them that. Writers can also work from home, which I like. I'm going to read as many books as I can. I will also enter a story competition this year.",
  },
  {
    task: "Write about your dream job: a football player.",
    model:
      "My dream job is to be a football player. I have played football since I was six, and I'm in my school team. I love the feeling when I score a goal, and the crowds make me excited. Football players are also famous. But only a few people succeed, so I'm going to practice every day. I will also try to join a club next year.",
  },
  {
    task: "Write about your dream job: a game designer.",
    model:
      "I would like to become a game designer. I love playing computer games, and I always have ideas for new ones. Game designers are creative, and they work with artists and programmers. It's also a job with a good salary. I'm going to learn to write computer programs, and I will take an online course in game design this summer.",
  },
];

const writingAboutYourDreamJob = judgedTopic({
  id: "writing-about-your-dream-job",
  title: t("Writing About a Dream Job", "写理想的工作"),
  summary: t(
    "Write six to eight sentences about a job you would like: what it is, why you want it, and what you will do to get it.",
    "写六到八句话，讲一份你想做的工作：是什么、为什么想做、你将怎样得到它。",
  ),
  prerequisites: ["writing-about-future-plans", "expanding-with-because-but-so"],
  encompasses: [
    { topic: "writing-about-future-plans", weight: 0.3 },
    { topic: "expanding-with-because-but-so", weight: 0.3 },
  ],
  criteria: ["a2-job-and-reasons", "a2-job-steps", "a2-future-forms", "a1-sentences"],
  point: {
    id: "dream-job",
    title: t("The job, why and how", "工作、原因和做法"),
    explanation: t(
      "Say what job you would like: *I would like to be a pilot. My dream job is to be a doctor.*\n\nGive reasons with *because* and *so*: *I love planes, so I want to fly.*\n\nSay what you will do to get it with *going to* or *will*: *I'm going to study math. I will go to flight school.*",
      "说出你想做的工作：*I would like to be a pilot. My dream job is to be a doctor.*\n\n用 *because* 和 *so* 说明理由：*I love planes, so I want to fly.*\n\n用 *going to* 或 *will* 说你将怎样做：*I'm going to study math. I will go to flight school.*\n\n注意职业前要加 *a* 或 *an*：说 *I want to be a doctor*，不说 *I want to be doctor*。",
    ),
  },
  question: t(
    "Write six to eight sentences in English about the job the task names: what it is, why you want it, and what you will do to get it.",
    "根据题目用英语写六到八句话：这是什么工作、你为什么想做、你将怎样得到它。",
  ),
  bank: dreamJobBank,
  limits: { minWords: 45, maxChars: 900 },
  what: t("text", "文字"),
});

/** topics are the topics of the unit Jobs and Dreams. */
export const topics: readonly TopicDef[] = [
  jobs2.topic,
  workLife.topic,
  ambitions.topic,
  subjectAndObjectQuestions,
  writingAboutYourDreamJob,
];

/** vocabulary are the words the unit Jobs and Dreams teaches. */
export const vocabulary: readonly WordBatch[] = [jobs2.batch, workLife.batch, ambitions.batch];
