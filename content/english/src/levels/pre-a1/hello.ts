// Pre-A1, unit 1: Hello! Greetings, the people words I, you, he and she, and the verb be.

import { type Text, type TopicDef, t } from "@ga/content";

import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, interleave, vocabularyTopic, word } from "../words.ts";

const hello = vocabularyTopic({
  id: "pre-a1-words-hello",
  title: t("Hello and Goodbye", "问候与告别"),
  summary: t("The first words: saying hello and goodbye, please, thank you and sorry.", "最初的词：问好、告别、请、谢谢和对不起。"),
  prerequisites: [],
  words: [
    word(
      "hello",
      "a word you say when you meet someone",
      "你好（见面时说）",
      `When we meet, we say {hello}. When we go, we say goodbye.|goodbye please | The phone rings. "{Hello}? Who is it?"|Goodbye Thanks | {Hello}, Ms. Li! Nice to see you.|Goodbye Sorry`,
      "goodbye sorry",
      "hi",
    ),
    word(
      "hi",
      "hello, said to a friend",
      "嗨（朋友之间的“你好”）",
      `{Hi}, Tom! How are you?|Bye Sorry | Anna comes into the room and says, "{Hi}, everyone!"|Bye Goodbye | Say {hi} to your mom for me!|no yes`,
      "bye sorry",
      "hello",
    ),
    word(
      "goodbye",
      "a word you say when you go away",
      "再见（离开时说）",
      `It is time to go home. {Goodbye}, everyone!|Hello Hi | We say {goodbye} at the door and go home.|hello please | The class ends. "{Goodbye}, Mr. Wang! See you tomorrow!"|Hello Hi`,
      "hello hi",
      "bye",
    ),
    word(
      "bye",
      "goodbye, said to a friend",
      "拜拜（朋友之间的“再见”）",
      `{Bye}, Mom! I'm going to school now.|Hi Hello | See you later, Lily. {Bye}!|Hi Hello | Wave {bye} to Grandma. Her bus is going.|hi hello`,
      "hi hello",
      "goodbye",
    ),
    word(
      "name names",
      "what we call a person or a thing",
      "名字",
      "My {name} is Lily.|friend sorry | What is your {name}? I'm Ben.|friend sorry | Write your {name} on the book.|friend please | Tom and Ann are their {names}.|friends thanks",
      "friend sorry",
    ),
    word(
      "yes",
      "the word you say when something is true or when you agree",
      "是；对（表示肯定）",
      "Is it a cat? {Yes}, it is.|No Sorry | Do you like it? {Yes}, I do. It's great.|No Bye | Do you want an apple? {Yes}, please.|No Hello",
      "no sorry",
    ),
    word(
      "no",
      "the word you say when something is not true or when you do not agree",
      "不；不是（表示否定）",
      "Is it a dog? {No}, it isn't. It's a cat.|Yes Hello | Do you have a pen? {No}, I don't.|Yes Please | Is she your sister? {No}, she is my friend.|Yes Hi",
      "yes hello",
    ),
    word(
      "please",
      "a word you say when you ask for something nicely",
      "请（客气地请求时说）",
      "Can I have a pencil, {please}?|sorry goodbye | Open the door, {please}.|sorry no | Some water, {please}. Thank you!|sorry hello",
      "sorry goodbye",
    ),
    word(
      "thank thanks thanked thanking",
      "to say that you are happy about what someone gave you or did for you",
      "感谢；谢谢",
      "{Thank} you for the gift!|Sorry Please | Here is your pen. — {Thanks}! You are very kind.|Sorry Hello | Ben {thanked} his mom for the cake.|sorry pleased",
      "sorry please",
    ),
    word(
      "sorry",
      "a word you say when you did something wrong",
      "对不起；抱歉",
      "{Sorry}, I am late!|Thanks Hello | I am {sorry}. I broke your pencil.|thanks hello | Oops! I took your pen. {Sorry}!|Thanks Hi",
      "thanks hello",
    ),
    word(
      "friend friends",
      "a person you like and spend time with",
      "朋友",
      "Lily is my best {friend}.|name sorry | I play with my {friends} after school.|names thanks | Sam is a good {friend}. He helps me.|name please",
      "name sorry",
    ),
  ],
});

const iAndYou = vocabularyTopic({
  id: "pre-a1-words-i-and-you",
  title: t("I, You and We", "我、你和我们"),
  summary: t(
    "The words for people (I, you, he, she, it, we, they) and am, is and are.",
    "表示人的词（I、you、he、she、it、we、they）以及 am、is、are。",
  ),
  prerequisites: ["pre-a1-words-hello"],
  words: [
    word(
      "I",
      "the word for yourself when you talk",
      "我",
      "{I} am ten years old.|He You | My name is Lily, and {I} am a student.|she they | Can {I} have a pen, please?|me my",
      "me my",
    ),
    word(
      "you",
      "the person or people you are talking to",
      "你；你们",
      "How are {you}?|I he | Thank {you} for the gift!|I she | Are {you} a student, Ben?|he I",
      "I he",
    ),
    word(
      "he",
      "the word for a man or a boy",
      "他",
      "This is my dad. {He} is a teacher.|She It | Tom is my brother. {He} is nine.|She They | Look at that boy! {He} can run fast.|She We",
      "she it",
    ),
    word(
      "she",
      "the word for a woman or a girl",
      "她",
      "This is my mom. {She} is very nice.|He It | Anna is my sister. {She} is six.|He They | Look at that girl! {She} can swim.|He We",
      "he it",
    ),
    word(
      "it",
      "the word for a thing or an animal",
      "它",
      "What is this? {It} is a pen.|He She | I have a bag. {It} is red.|He She | Look at the bird! {It} can fly.|We They",
      "he she",
    ),
    word(
      "we",
      "you and I, or I and other people",
      "我们",
      "Tom and I are friends. {We} play together.|They He | My sister and I are at home. {We} are happy.|They She | Ben and I are in the same class. {We} are ten.|They It",
      "they he",
    ),
    word(
      "they",
      "other people or things, more than one",
      "他们；她们；它们",
      "Tom and Sam are my friends. {They} are nice.|We He | I have two cats. {They} are white.|It He | Where are Mom and Dad? {They} are in the kitchen.|He We",
      "we he",
    ),
    word(
      "am I'm",
      "the form of *be* after *I*",
      "（be 的形式，用在 I 后面）是",
      "I {am} a student.|is are | I {am} seven years old.|is are | {I'm} Lily. Nice to meet you.|I's Im | I {am} in the classroom now.|is are",
      "is are",
    ),
    word(
      "is isn't it's he's she's",
      "the form of *be* after *he*, *she*, *it* or one person or thing",
      "（be 的形式，用在 he、she、it 或单数后面）是",
      "She {is} my sister.|am are | The cat {is} on the bed.|am are | {It's} a red pen.|Its I'm | He {isn't} at home. He is at school.|aren't am | {She's} my friend Anna.|Shes I'm",
      "am are",
    ),
    word(
      "are aren't you're we're they're",
      "the form of *be* after *you*, *we*, *they* or more than one",
      "（be 的形式，用在 you、we、they 或复数后面）是",
      "You {are} my friend.|am is | We {are} in the same class.|am is | They {aren't} cats. They are dogs.|isn't am | {You're} very kind.|You's Your | {They're} my brothers.|Their There",
      "am is",
    ),
  ],
});

// The verb be: am, is and are with their subjects.

const subjects: readonly (readonly [subject: string, be: "am" | "is" | "are", short: string])[] = [
  ["I", "am", "I'm"],
  ["You", "are", "You're"],
  ["He", "is", "He's"],
  ["She", "is", "She's"],
  ["It", "is", "It's"],
  ["We", "are", "We're"],
  ["They", "are", "They're"],
];

/** complements fit any subject: they say how someone is or where. */
const complements: readonly string[] = [
  "happy",
  "at home",
  "at school",
  "very small",
  "in the classroom",
  "sad today",
  "with my mom",
  "here",
  "there",
  "very happy",
  "very big",
  "with my friends",
  "happy today",
  "at school today",
  "sad",
];

/** places fit any named subject, a person, an animal or a thing: they say where it is. */
const places: readonly string[] = ["here", "there", "at home", "at school", "in the classroom"];

/** namedSubjects are nouns and names, each with its form of be. */
const namedSubjects: readonly (readonly [subject: string, be: "is" | "are"])[] = [
  ["Tom", "is"],
  ["My mom", "is"],
  ["The cat", "is"],
  ["Lily and Ben", "are"],
  ["My friends", "are"],
  ["The pens", "are"],
  ["Anna", "is"],
  ["The dogs", "are"],
  ["My dad", "is"],
  ["The books", "are"],
  ["Sam", "is"],
];

const beChoiceBank: readonly ChoiceItem[] = interleave([
  everyPair(subjects, complements).map(
    ([[subject, be], rest]): ChoiceItem => [`${subject} ___ ${rest}.`, be, (["am", "is", "are"] as const).filter((b) => b !== be)],
  ),
  everyPair(namedSubjects, places).map(
    ([[subject, be], rest]): ChoiceItem => [`${subject} ___ ${rest}.`, be, ["am", be === "is" ? "are" : "is"]],
  ),
]);

const missingBeBank: readonly TypedItem[] = interleave([
  everyPair(subjects, complements).map(([[subject, be, short], rest]): TypedItem => {
    const wrongBe = be === "is" ? "are" : "is";
    return {
      shown: `${subject} ${rest}.`,
      accepted: [`[${subject} ${be}|${short}] ${rest}.`],
      canonical: `${subject} ${be} ${rest}.`,
      wrong: [`${subject} ${rest}.`, `${subject} ${wrongBe} ${rest}.`],
    };
  }),
  everyPair(namedSubjects, places).map(([[subject, be], rest]): TypedItem => {
    const wrongBe = be === "is" ? "are" : "is";
    return {
      shown: `${subject} ${rest}.`,
      accepted: [`${subject} ${be} ${rest}.`],
      canonical: `${subject} ${be} ${rest}.`,
      wrong: [`${subject} ${rest}.`, `${subject} ${wrongBe} ${rest}.`],
    };
  }),
]);

const shortFormBank: readonly ChoiceItem[] = everyPair(subjects, complements).map(([[subject, be, short], rest]): ChoiceItem => {
  const badApostrophe = `${subject}${be === "am" ? "m" : be === "is" ? "s" : "re"}`;
  const wrongBe = `${subject}'${be === "is" ? "re" : "s"}`;
  return [`${subject} ${be} ${rest}.`, `${short} ${rest}.`, [`${badApostrophe} ${rest}.`, `${wrongBe} ${rest}.`]];
});

/** beRule says which subjects take a form of be, in every locale. */
const beRule: Record<string, Text> = {
  am: t("*am* goes only with *I*", "*am* 只跟 *I* 连用"),
  is: t(
    "*is* goes with one person or thing, like *he*, *she*, *it* or *Tom*",
    "*is* 跟单个的人或东西连用，比如 *he*、*she*、*it* 或 *Tom*",
  ),
  are: t("*are* goes with *you*, *we*, *they* and more than one", "*are* 跟 *you*、*we*、*they* 和多个的人或东西连用"),
};

/** beSubject finds the subject of a gapped sentence, the words before the gap. */
const beSubject = (shown: string) => shown.split(" ___")[0] ?? shown;

const theVerbBe: TopicDef = {
  id: "the-verb-be",
  title: t("Am, Is and Are", "am、is 和 are"),
  summary: t("I am, you are, she is: the verb be, which English never leaves out.", "I am、you are、she is：英语中不能省略的动词 be。"),
  prerequisites: ["pre-a1-words-i-and-you"],
  encompasses: [{ topic: "pre-a1-words-i-and-you", weight: 0.5 }],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Choosing am, is or are", "选择 am、is 还是 are"),
      t(
        "*I am*. *He is*, *she is*, *it is*, and one person or thing *is*. *You are*, *we are*, *they are*, and more than one *are*.\n\n*I am happy. Tom is at home. The dogs are here.*",
        "*I* 后面用 *am*。*he*、*she*、*it* 和单个的人或东西后面用 *is*。*you*、*we*、*they* 和多个的人或东西后面用 *are*。\n\n*I am happy. Tom is at home. The dogs are here.*",
      ),
      choiceGenerator(
        t("Choose the word for the gap.", "选出填入空白处的词。"),
        beChoiceBank,
        (right, shown) =>
          t(
            `The subject is *${beSubject(shown)}*, and ${beRule[right]?.en}: ${shown.replace("___", `*${right}*`)}`,
            `主语是 *${beSubject(shown)}*，${beRule[right]?.["zh-CN"]}：${shown.replace("___", `*${right}*`)}`,
          ),
        (wrong, _right, shown) =>
          t(
            `${beRule[wrong]?.en}, but the subject here is *${beSubject(shown)}*.`,
            `${beRule[wrong]?.["zh-CN"]}，可这里的主语是 *${beSubject(shown)}*。`,
          ),
      ),
    ),
    point(
      "do-not-leave-out",
      t("Never leaving out be", "不要漏掉 be"),
      t(
        "An English sentence needs a verb. When you say how someone is or where they are, the verb is *am*, *is* or *are*.\n\nNot *She happy.* but *She is happy.*",
        "英语句子必须有动词。中文说“她很高兴”“我在家”，没有“是”，可英语描述状态或位置时一定要用 *am*、*is* 或 *are*。\n\n不说 *She happy.*，要说 *She is happy.*",
      ),
      typedGenerator(
        "sentence-pattern",
        t("A word is missing. Write the sentence with am, is or are.", "句子缺了一个词。用 am、is 或 are 把句子写完整。"),
        missingBeBank,
        (right, shown) =>
          t(
            `*${shown}* has no verb, and an English sentence needs one. To say how or where someone is, add *am*, *is* or *are*: ${right}`,
            `*${shown}* 没有动词，而英语句子必须有动词。说明人怎么样或在哪里，要加上 *am*、*is* 或 *are*：${right}`,
          ),
      ),
    ),
    point(
      "short-forms",
      t("Short forms", "缩写形式"),
      t(
        "In speaking and in friendly writing, *am*, *is* and *are* get short: *I'm*, *he's*, *she's*, *it's*, *you're*, *we're*, *they're*. The mark ' stands for the missing letter.",
        "口语和非正式书面语中，*am*、*is*、*are* 常常缩写：*I'm*、*he's*、*she's*、*it's*、*you're*、*we're*、*they're*。撇号 ' 代替省掉的字母。",
      ),
      choiceGenerator(
        t("Choose the short form of the sentence.", "选出这个句子的缩写形式。"),
        shortFormBank,
        (right, shown) =>
          t(
            `The short form joins the subject and the verb, and the mark ' stands for the letters left out: ${shown} → ${right}`,
            `缩写形式把主语和动词连在一起，撇号 ' 代替省掉的字母：${shown} → ${right}`,
          ),
        (_wrong, _right, _shown, position) =>
          position === 0
            ? t(
                "This leaves out the mark ': a short form always shows the missing letter with '.",
                "这里漏了撇号 '：缩写形式总要用 ' 表示省掉的字母。",
              )
            : t(
                "This short form stands for a different verb: *'s* is *is* and *'re* is *are*, so it does not match the sentence.",
                "这个缩写代表的是另一个动词：*'s* 是 *is*，*'re* 是 *are*，和原句的动词不一致。",
              ),
      ),
    ),
  ],
};

/** topics are the topics of the unit Hello!. */
export const topics: readonly TopicDef[] = [hello.topic, iAndYou.topic, theVerbBe];

/** vocabulary are the words the unit Hello! teaches. */
export const vocabulary: readonly WordBatch[] = [hello.batch, iAndYou.batch];
