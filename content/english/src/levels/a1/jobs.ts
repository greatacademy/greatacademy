// A1, unit 11: Jobs and People. Jobs, describing people and the actions of work, was and were, and descriptions of a
// person judged by a model.

import { type CriterionSpec, type Text, type TopicDef, t } from "@ga/content";
import {
  type ChoiceItem,
  choiceGenerator,
  criterionById,
  point,
  type TypedItem,
  typedGenerator,
  type WritingItem,
  writingGenerator,
} from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { pairUp, vocabularyTopic, word } from "../words.ts";

const jobs = vocabularyTopic({
  id: "a1-words-jobs",
  title: t("Jobs", "职业"),
  summary: t(
    "Doctors, nurses, farmers, drivers and police officers, and the places where people work.",
    "医生、护士、农民、司机和警察，以及人们工作的地方。",
  ),
  prerequisites: ["pre-a1-words-people"],
  words: [
    word(
      "job jobs",
      "the work that a person does to get money",
      "工作；职业",
      "My mom has a new {job} at the hospital.|farm factory | What's your dad's {job}? — He's a driver.|farm office | Teaching is a hard {job}.|farm factory",
      "office worker",
    ),
    word(
      "doctor doctors",
      "a person whose job is to help sick people get better",
      "医生",
      "I'm ill. I need to see a {doctor}.|farmer driver | The {doctor} looks at my throat.|farmer driver | My aunt is a {doctor} at the hospital.|farmer factory",
      "nurse driver",
    ),
    word(
      "nurse nurses",
      "a person whose job is to look after sick people, often in a hospital",
      "护士",
      "The {nurse} gives me some medicine.|farmer driver | {Nurses} work in hospitals day and night.|Farmers Drivers | The {nurse} is kind and helps the old man.|farm factory",
      "doctor driver",
    ),
    word(
      "farmer farmers",
      "a person whose job is to grow food or keep animals on a farm",
      "农民",
      "The {farmer} gets up at five to feed the cows.|nurse office | {Farmers} grow rice in the south of China.|Nurses Offices | My grandpa is a {farmer}. He grows apples.|nurse doctor",
      "driver worker",
    ),
    word(
      "driver drivers",
      "a person whose job is to drive a car, a bus or a train",
      "司机",
      "The bus {driver} says good morning to us.|nurse farmer | Taxi {drivers} know every street in the city.|nurses farmers | My uncle is a truck {driver}.|nurse hospital",
      "doctor farmer",
    ),
    word(
      "police",
      "the people whose job is to keep a town safe",
      "警察（总称）",
      "Call the {police}! Someone is in the house!|farm factory | The {police} are looking for the thief.|farm office | There is a {police} car outside the bank.|farm office",
      "officer office",
    ),
    word(
      "officer officers",
      "a person in the police or the army; a police officer",
      "警官；官员",
      "The police {officer} helps the children cross the road.|office factory | My mom is a police {officer}.|office farm | Two {officers} came to our school to talk about safety.|offices farms",
      "office worker",
    ),
    word(
      "worker workers",
      "a person who works, often with their hands",
      "工人；工作者",
      "The {workers} are building a new school.|offices doctors | My dad is a factory {worker}.|office doctor | She is a hard {worker}. She never stops.|office hospital",
      "farmer officer",
    ),
    word(
      "office offices",
      "a room or building where people work at desks",
      "办公室",
      "My mom works in an {office} in the city.|officer nurse | The teachers' {office} is on the second floor.|officer farmer | There are ten desks in the {office}.|nurse farmer",
      "officer factory",
    ),
    word(
      "hospital hospitals",
      "a building where sick people go to get better",
      "医院",
      "He broke his arm, so he went to the {hospital}.|office factory | Doctors and nurses work in a {hospital}.|office factory | I was born in this {hospital}.|office factory",
      "office farm",
    ),
    word(
      "farm farms",
      "land where people grow food and keep animals",
      "农场",
      "There are cows and pigs on the {farm}.|office hospital | My grandpa lives on a {farm}.|hospital office | We buy eggs from the {farm} near our house.|hospital office",
      "factory office",
    ),
    word(
      "factory factories",
      "a building where people make things with machines",
      "工厂",
      "They make cars in that {factory}.|hospital farm | My aunt works in a toy {factory}.|hospital farm | There are many {factories} near the river.|hospitals farms",
      "farm office",
    ),
  ],
});

const describingPeople = vocabularyTopic({
  id: "a1-words-describing-people",
  title: t("Describing People", "描述人"),
  summary: t(
    "Young, tall, short, beautiful, kind, funny and friendly, and the words also and both.",
    "年轻、高、矮、美丽、善良、有趣和友好，还有 also 和 both。",
  ),
  prerequisites: ["a1-words-jobs"],
  words: [
    word(
      "young younger youngest",
      "not old; having lived only a short time",
      "年轻的；年幼的",
      "My mom is {young}. She's only twenty-five.|old busy | My little brother is the {youngest} in our family.|tallest funniest | My {younger} brother is five, and I'm eight.|taller busier",
      "tall short",
    ),
    word(
      "tall taller tallest",
      "high from the feet to the head",
      "高的",
      "My dad is very {tall}. He can touch the ceiling.|young short | Ben is {taller} than me.|younger shorter | Giraffes are {tall} animals.|young short",
      "short young",
    ),
    word(
      "short shorter shortest",
      "not tall; not long",
      "矮的；短的",
      "My grandma is {short}, and I'm taller than her.|tall young | She has {short} black hair.|tall young | This pencil is too {short}.|tall young",
      "tall young",
    ),
    word(
      "beautiful",
      "very nice to look at",
      "美丽的",
      "What a {beautiful} flower!|busy short | Your sister has {beautiful} long hair.|busy tall | The beach is {beautiful} in the evening.|busy tall",
      "busy friendly",
    ),
    word(
      "kind kinder kindest",
      "good and nice to other people",
      "善良的；友好的",
      "Our teacher is very {kind}. She always helps us.|tall short | It's {kind} of you to help me.|tall short | Be {kind} to animals.|tall short",
      "funny busy",
    ),
    word(
      "funny funnier funniest",
      "making people laugh",
      "有趣的；好笑的",
      "My uncle is very {funny}. He tells great jokes.|tall short | That's a {funny} story! Ha ha!|tall short | The clown has a {funny} red nose.|busy young",
      "kind friendly",
    ),
    word(
      "friendly friendlier friendliest",
      "kind and happy to talk to people",
      "友好的",
      "The new girl is very {friendly}. She says hello to everyone.|short tall | Our dog is {friendly}. It doesn't bite.|busy tall | The people in this town are {friendly}. They always say hello.|short tall",
      "kind funny",
    ),
    word(
      "busy busier busiest",
      "with a lot to do; not free",
      "忙碌的",
      "Mom is {busy} at work today, so Dad is cooking.|tall young | I'm {busy} now. Can we talk later?|tall short | The doctors are very {busy} in winter.|tall short",
      "funny kind",
    ),
    word(
      "nice nicer nicest",
      "good; pleasant",
      "好的；令人愉快的",
      "Have a {nice} day!|tall short | Your new dress is very {nice}.|tall young | It's {nice} to meet you.|tall short",
      "kind friendly",
    ),
    word(
      "smile smiles smiled smiling",
      "to make a happy face, with the ends of your mouth up; a happy face like this",
      "微笑",
      "Look at the camera and {smile}!|both also | She has a lovely {smile}.|both also | The baby {smiled} at me.|built kept",
      "laugh cry",
    ),
    word(
      "also",
      "too; as well",
      "也",
      "My mom is a doctor. My dad is {also} a doctor.|both smile | I like cats, and I {also} like dogs.|both smile | Lily can swim. She can {also} ride a bike.|both smile",
      "both only",
    ),
    word(
      "both",
      "the two; this one and that one",
      "两个都",
      "My parents {both} work in an office.|smile kind | {Both} my sisters are tall.|Also Smile | I like {both} of them.|also smile",
      "also all",
    ),
  ],
});

const workActions = vocabularyTopic({
  id: "a1-words-work-actions",
  title: t("Work Actions", "工作中的动作"),
  summary: t(
    "Build, drive, fix, grow, carry, wait, call, meet, keep and show.",
    "建造、驾驶、修理、种植、搬运、等待、打电话、见面、保存和展示。",
  ),
  prerequisites: ["a1-words-actions"],
  words: [
    word(
      "build builds built building",
      "to make something by putting parts together",
      "建造",
      "The workers {build} houses.|wait call | Birds {build} nests in spring.|wait call | They {built} a new bridge last year.|waited called",
      "fix grow",
    ),
    word(
      "drive drives drove driven driving",
      "to make a car, a bus or a train go",
      "驾驶；开车",
      "My mom {drives} a bus.|grows smiles | Can you {drive} a car?|grow smile | Dad {drove} us to school this morning.|grew smiled",
      "carry keep",
    ),
    word(
      "fix fixes fixed fixing",
      "to make something that is broken work again",
      "修理",
      "My dad can {fix} my bike.|wait meet | The phone is broken. Can you {fix} it?|wait meet | She {fixed} the door yesterday.|waited met",
      "build show",
    ),
    word(
      "grow grows grew grown growing",
      "to get bigger; to make plants come up from the ground",
      "生长；种植",
      "Farmers {grow} rice and vegetables.|wait call | Children {grow} very fast.|wait call | These apples {grew} in our garden.|waited called",
      "build keep",
    ),
    word(
      "carry carries carried carrying",
      "to hold something and take it with you",
      "搬；提；携带",
      "Can you help me {carry} this box?|wait meet | The nurse {carries} the baby.|waits builds | I {carried} my bag all day.|waited met",
      "keep show",
    ),
    word(
      "wait waits waited waiting",
      "to stay in a place until someone comes or something happens",
      "等待",
      "Please {wait} here. I'll be back soon.|show keep | We {waited} for the bus for half an hour.|built fixed | The doctor is busy. Can you {wait} a minute?|build fix",
      "meet call",
    ),
    word(
      "call calls called calling",
      "to talk to someone on the phone; to say a name loudly",
      "打电话；叫",
      "{Call} me when you get home.|Build Grow | Mom {called} the doctor this morning.|built grew | The teacher {calls} our names every morning.|builds grows",
      "meet wait",
    ),
    word(
      "meet meets met meeting",
      "to see and talk to someone, for the first time or at a place you agree",
      "遇见；见面",
      "Let's {meet} at the park at three.|grow carry | Nice to {meet} you!|build grow | I {met} my best friend at school.|built grew",
      "call wait",
    ),
    word(
      "keep keeps kept keeping",
      "to have something and not give it away; to stay in a place or a way",
      "保存；保持",
      "You can {keep} this book. It's a present.|build wait | We {keep} our shoes by the door.|build wait | She {kept} the money in a box.|built waited",
      "carry show",
    ),
    word(
      "show shows showed shown showing",
      "to let someone see something",
      "给……看；展示",
      "{Show} me your new bike!|Wait Grow | The farmer {showed} us his cows.|built waited | Can you {show} me the way to the station?|build wait",
      "keep carry",
    ),
  ],
});

// Was and were.

/** pastSubjects are who was somewhere, with was or were and a present form of be to set beside them. */
const pastSubjects: readonly { who: string; be: "was" | "were"; now: string }[] = [
  { who: "I", be: "was", now: "am" },
  { who: "You", be: "were", now: "are" },
  { who: "He", be: "was", now: "is" },
  { who: "She", be: "was", now: "is" },
  { who: "We", be: "were", now: "are" },
  { who: "They", be: "were", now: "are" },
  { who: "My dad", be: "was", now: "is" },
  { who: "The nurses", be: "were", now: "are" },
  { who: "Our teacher", be: "was", now: "is" },
  { who: "The farmers", be: "were", now: "are" },
  { who: "My sister", be: "was", now: "is" },
  { who: "Tom and Ben", be: "were", now: "are" },
  { who: "Mr. Lee", be: "was", now: "is" },
];

/** pastPlaces are where or how they were, each with a word for the past. */
const pastPlaces: readonly string[] = [
  "at the hospital yesterday",
  "very busy last week",
  "at the farm last Sunday",
  "tired last night",
  "at home two days ago",
  "in the office yesterday",
  "happy at the party yesterday",
  "late for school last Monday",
  "at the station at six o'clock last night",
  "ill last week",
  "in the garden an hour ago",
];

// 13 and 11 are coprime, so the first 143 pairs are all different.
const pastPairs = pairUp(120, pastSubjects, pastPlaces).map(([s, place]) => ({ ...s, place }));

const pastChoiceBank: readonly ChoiceItem[] = pastPairs
  .slice(0, 40)
  .map(({ who, be, now, place }): ChoiceItem => [`${who} ___ ${place}.`, be, [be === "was" ? "were" : "was", now]]);

const pastFixBank: readonly TypedItem[] = pastPairs.slice(40, 76).map(({ who, be, now, place }, k): TypedItem => {
  const shown = `${who} ${k % 2 === 0 ? (be === "was" ? "were" : "was") : now} ${place}.`;
  return { shown, accepted: [`${who} ${be} ${place}.`], wrong: [shown] };
});

const lower = (who: string): string => (who === "I" || who.startsWith("Mr.") || who.includes(" and ") ? who : who.toLowerCase());

const pastAskBank: readonly TypedItem[] = pastPairs
  .slice(76)
  .filter(({ who }) => who !== "I")
  .map(({ who, be, place }): TypedItem => {
    const asker = be === "was" ? "Was" : "Were";
    const other = be === "was" ? "Were" : "Was";
    return {
      shown: `${who} ${be} ${place}.`,
      accepted: [`${asker} ${lower(who)} ${place}?`],
      wrong: [`${other} ${lower(who)} ${place}?`, `${who} ${be} ${place}?`],
    };
  });

/** wasReason says why a subject takes was or were, in every locale. */
const wasReason = (who: string, be: string): Text =>
  be === "was"
    ? t(`*${who}* is *I* or one person or thing, so the past of *be* is *was*`, `*${who}* 是 *I* 或单数主语，所以 be 的过去式用 *was*`)
    : t(`*${who}* is *you* or more than one, so the past of *be* is *were*`, `*${who}* 是 *you* 或复数主语，所以 be 的过去式用 *were*`);

const wasAndWere: TopicDef = {
  id: "was-and-were",
  title: t("Was and Were", "was 和 were"),
  summary: t(
    "I was at home. They were busy. The verb be in the past, and questions with it.",
    "I was at home. They were busy. be 动词的过去式，以及用它提问。",
  ),
  prerequisites: ["the-verb-be", "a1-words-jobs"],
  encompasses: [
    { topic: "the-verb-be", weight: 0.3 },
    { topic: "a1-words-jobs", weight: 0.2 },
  ],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Was or were", "was 还是 were"),
      t(
        "For the past, *am* and *is* become *was*, and *are* becomes *were*:\n\n- *I was*, *he was*, *she was*, *it was*, *my dad was*\n- *you were*, *we were*, *they were*, *the nurses were*\n\nWords like *yesterday*, *last week* and *an hour ago* tell you it's the past.",
        "谈过去时，*am* 和 *is* 变成 *was*，*are* 变成 *were*：\n\n- *I was*、*he was*、*she was*、*it was*、*my dad was*\n- *you were*、*we were*、*they were*、*the nurses were*\n\n中文说“昨天在医院”，动词不变；英语要看 *yesterday*、*last week*、*an hour ago* 这样的词，把 be 换成过去式。",
      ),
      choiceGenerator(
        t("Fill in the blank.", "填空。"),
        pastChoiceBank,
        (right, shown) => {
          const reason = wasReason(shown.split(" ___")[0] ?? "", right);
          return t(`${reason.en}: ${shown.replace("___", `*${right}*`)}`, `${reason["zh-CN"]}：${shown.replace("___", `*${right}*`)}`);
        },
        (wrong, _right, shown, position) =>
          position === 0
            ? t(
                `*${wrong}* is the past of *be* for ${wrong === "was" ? "*I* and one person or thing" : "*you* and more than one"}, but the subject is *${shown.split(" ___")[0]}*.`,
                `*${wrong}* 是${wrong === "was" ? " *I* 和单数主语" : " *you* 和复数主语"}用的过去式，可这里的主语是 *${shown.split(" ___")[0]}*。`,
              )
            : t(
                `*${wrong}* is the present, but the time words at the end of the sentence put it in the past.`,
                `*${wrong}* 是现在时，可句末的时间词说明这是过去的事。`,
              ),
      ),
    ),
    point(
      "fix",
      t("Fixing was and were", "改正 was 和 were"),
      t(
        "Each sentence has the wrong form of *be*: *were* for *was*, *was* for *were*, or a present form where the time is past. Write it again.",
        "每个句子里 *be* 的形式都错了：该用 *was* 的用了 *were*，该用 *were* 的用了 *was*，或者时间是过去却用了现在时。重写句子。",
      ),
      typedGenerator("sentence", t("Fix the sentence.", "改正这个句子。"), pastFixBank, (right) => {
        const [who = "", be = ""] = right.split(/ (was|were) /u);
        const reason = wasReason(who, be);
        return t(`The time is past, and ${reason.en}: ${right}`, `时间是过去，${reason["zh-CN"]}：${right}`);
      }),
    ),
    point(
      "ask",
      t("Questions with was and were", "用 was 和 were 提问"),
      t(
        "To ask a question, put *was* or *were* before the subject, as with *is* and *are*: *He was at home.* → *Was he at home?* *They were busy.* → *Were they busy?*",
        "提问时，把 *was* 或 *were* 放到主语前面，和 *is*、*are* 一样：*He was at home.* → *Was he at home?* *They were busy.* → *Were they busy?*",
      ),
      typedGenerator("sentence", t("Make a question.", "把句子改成疑问句。"), pastAskBank, (right) => {
        const be = right.split(" ")[0] ?? "";
        return t(
          `As with *is* and *are*, a question puts *${be}* before the subject and ends with a question mark: ${right}`,
          `和 *is*、*are* 一样，疑问句把 *${be}* 放到主语前面，句末用问号：${right}`,
        );
      }),
    ),
  ],
};

// Writing about a person.

const criterion = (id: string): CriterionSpec => {
  const found = criterionById(id);
  if (!found) throw new Error(`unknown criterion ${id}`);
  return found;
};

/** personBank asks for a description of a person: who they are, what they look like and what they do. */
const personBank: readonly WritingItem[] = [
  {
    task: "Write about someone in your family.",
    model:
      "This is my grandpa. He is seventy, and he is tall and thin. He has short white hair and a big smile. He lives on a farm and grows apples. He is very kind.",
  },
  {
    task: "Write about your best friend.",
    model:
      "My best friend is Lucy. She is ten years old. She is short and has long black hair. She likes drawing, and she draws cats every day. She is very funny.",
  },
  {
    task: "Write about your teacher.",
    model:
      "Ms. Wang is my English teacher. She is young and tall, and she has glasses. She teaches us songs and games. She always smiles. Everyone likes her.",
  },
  {
    task: "Write about a doctor or a nurse you know.",
    model:
      "My aunt is a nurse. She is thirty-five. She has short brown hair and kind eyes. She works at a big hospital and looks after children. She is always busy.",
  },
  {
    task: "Write about someone who works in your town.",
    model:
      "Mr. Li is our bus driver. He is old, and he has a gray beard. He drives the number 5 bus every morning. He says hello to everyone. He is very friendly.",
  },
  {
    task: "Write about your mom or your dad.",
    model:
      "My dad is forty. He is tall and has short black hair. He works in an office in the city. In the evening, he cooks dinner for us. He tells funny jokes.",
  },
  {
    task: "Write about a brother, a sister or a cousin.",
    model:
      "This is my cousin Ben. He is six. He is short, and he has big brown eyes. He goes to school near his house. He loves dinosaurs and reads about them every night.",
  },
  {
    task: "Write about a neighbor.",
    model:
      "My neighbor is Mrs. Green. She is old and short, and she has white hair. She has a small garden with lots of flowers. She gives us cakes every Sunday. She is kind.",
  },
  {
    task: "Write about a famous person you like.",
    model:
      "Yao Ming is a famous basketball player. He is very, very tall. He has short black hair and a nice smile. He doesn't play now, but he helps young players. I like him a lot.",
  },
  {
    task: "Write about a farmer, a worker or a police officer you know.",
    model:
      "My uncle is a police officer. He is thirty and tall. He has a blue uniform and a black hat. He keeps our town safe and helps children cross the road. He is brave.",
  },
  {
    task: "Write about a classmate.",
    model:
      "Mia sits next to me in class. She is nine. She has short red hair and freckles. She is good at math, and she helps me with my homework. She is very friendly.",
  },
  {
    task: "Write about a grandma or a grandpa.",
    model:
      "My grandma is sixty-eight. She is short and has gray hair and glasses. She lives with us. Every morning she walks in the park, and in the afternoon she reads. She is kind and funny.",
  },
];

const personCriteria = ["a1-person-who", "a1-person-looks", "a1-person-does", "a1-person-verb-s", "a1-sentences"];

const writingAboutAPerson: TopicDef = {
  id: "writing-about-a-person",
  title: t("Writing About a Person", "写一个人"),
  summary: t(
    "Write four to six sentences about a person: who they are, what they look like and what they do.",
    "写四到六句话介绍一个人：这个人是谁、长什么样、做什么。",
  ),
  prerequisites: ["third-person-s", "have-and-has", "a1-words-describing-people", "writing-a-short-note"],
  encompasses: [
    { topic: "third-person-s", weight: 0.3 },
    { topic: "a1-words-describing-people", weight: 0.2 },
    { topic: "writing-a-short-note", weight: 0.2 },
  ],
  xp: 25,
  strand: "writing",
  criteria: personCriteria.map(criterion),
  knowledgePoints: [
    point(
      "person",
      t("Who, looks and does", "是谁、长相、做什么"),
      t(
        "Say three things about the person:\n\n- who they are: *This is my grandpa. He is seventy.*\n- what they look like: *He is tall. He has short white hair.*\n- what they do: *He lives on a farm and grows apples.*\n\nThe person is *he* or *she*, so the verbs end in *-s*: *he lives*, *she works*, *he has*.",
        "写一个人要说三件事：\n\n- 是谁：*This is my grandpa. He is seventy.*\n- 长什么样：*He is tall. He has short white hair.*\n- 做什么：*He lives on a farm and grows apples.*\n\n写的是 *he* 或 *she*，所以动词要加 *-s*：*he lives*、*she works*、*he has*。",
      ),
      writingGenerator(
        t(
          "Write four to six sentences in English about the person: who they are, what they look like and what they do.",
          "用英语写四到六句话介绍这个人：是谁、长什么样、做什么。",
        ),
        personBank,
        personCriteria,
        { minWords: 25, maxChars: 600 },
        (model) => t(`One good description:\n\n> ${model}`, `一段好的描述：\n\n> ${model}`),
      ),
    ),
  ],
};

/** topics are the topics of the unit Jobs and People. */
export const topics: readonly TopicDef[] = [jobs.topic, describingPeople.topic, workActions.topic, wasAndWere, writingAboutAPerson];

/** beForms are be and its past forms, which the past of be teaches. */
const beForms: WordBatch = { topic: "was-and-were", words: ["be", "was", "were", "wasn't", "weren't"] };

/** vocabulary are the words the unit Jobs and People teaches. */
export const vocabulary: readonly WordBatch[] = [jobs.batch, describingPeople.batch, workActions.batch, beForms];
