// Pre-A1, unit 1: Hello! Greetings, the people words I, you, he and she, and the verb be.

import { type Text, type TopicDef, t } from "@ga/content";

import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, interleave, vocabularyTopic, word } from "../words.ts";

const hello = vocabularyTopic({
  id: "pre-a1-words-hello",
  title: t("Hello and Goodbye", "问候与告别"),
  summary: t("The first words: saying hello and goodbye, please, thank you and sorry.", "最初的词：问好、告别、请、谢谢和对不起。"),
  intro: t(
    '"**Hello**! My **name** is Lily." "**Hi**, Lily! I\'m Ben." At the end of the day, they say **goodbye**. These words help you meet people, ask nicely and say thank you and sorry.',
    "“**Hello**（你好）！我的 **name**（名字）是莉莉。”“**Hi**（嗨），莉莉！我是本。”一天结束时，他们说 **goodbye**（再见）。这些词帮你和人见面、礼貌地请求，并说谢谢和对不起。",
  ),
  prerequisites: [],
  words: [
    word(
      "hello",
      "a word you say when you meet someone",
      "你好（见面时说）",
      `When we meet, we say {hello}. When we go, we say goodbye. | The phone rings. "{Hello}? Who is it?" | {Hello}, Ms. Li! Nice to meet you. Come in!`,
      "goodbye thanks",
      "hi",
    ),
    word(
      "hi",
      "hello, said to a friend",
      "嗨（朋友之间的“你好”）",
      `{Hi}, Tom! How are you? | Anna comes into the room and says, "{Hi}, everyone!" | {Hi}, Dad! I'm back home. How was your day?`,
      "bye thanks",
      "hello",
    ),
    word(
      "goodbye",
      "a word you say when you go away",
      "再见（离开时说）",
      `It is time to go home. {Goodbye}, everyone! | We say {goodbye} at the door and go home. | The class ends. "{Goodbye}, Mr. Wang! See you tomorrow!"`,
      "hello hi",
      "bye",
    ),
    word(
      "bye",
      "goodbye, said to a friend",
      "拜拜（朋友之间的“再见”）",
      `{Bye}, Mom! I'm going to school now. | See you later, Lily. {Bye}! | Wave {bye} to Grandma. Her bus is going.`,
      "hi hello",
      "goodbye",
    ),
    word(
      "name names",
      "what we call a person or a thing",
      "名字",
      "My {name} is Lily. | What is your {name}? I'm Ben. | Write your {name} on the book. | Hi, we are Tom and Ann. Those are our {names}.|friends colors",
      "friend color",
    ),
    word(
      "yes",
      "the word you say when something is true or when you agree",
      "是；对（表示肯定）",
      "Is it a cat? {Yes}, it is. | Do you like it? {Yes}, I do. It's great. | Do you want an apple? {Yes}, please.",
      "no thanks",
    ),
    word(
      "no",
      "the word you say when something is not true or when you do not agree",
      "不；不是（表示否定）",
      "Is it a dog? {No}, it isn't. It's a cat. | Do you have a pen? {No}, I don't. | Is she your sister? {No}, she is my friend.",
      "yes thanks",
    ),
    word(
      "please",
      "a word you say when you ask for something nicely",
      "请（客气地请求时说）",
      "Can I have a pencil, {please}? | Open the door, {please}. | Some water, {please}. Thank you!",
      "sorry goodbye",
    ),
    word(
      "thank thanks thanked thanking",
      "to say that you are happy about what someone gave you or did for you",
      "感谢；谢谢",
      "{Thank} you for the gift!|Sorry Please | Here is your pen. — {Thanks}! You are very kind.|Sorry Please | Ben {thanked} his mom for the cake.|sorry pleased",
      "sorry please",
    ),
    word(
      "sorry",
      "a word you say when you did something wrong",
      "对不起；抱歉",
      "{Sorry}, I am late! | I am {sorry}. I broke your pencil. | Oops! I took your pen. {Sorry}!",
      "thanks please",
    ),
    word(
      "friend friends",
      "a person you like and spend time with",
      "朋友",
      "Lily is my best {friend}. | I play with my {friends} after school.|names families | Sam is a good {friend}. He helps me.",
      "name family",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "Read whether people meet or go away: *hello* and *hi* are for meeting someone, *goodbye* and *bye* for leaving.",
        "看清是见面还是离开：见面说 *hello* 和 *hi*，离开说 *goodbye* 和 *bye*。",
      ),
      meaning: t(
        "*Please* asks for something, *thank you* says you are glad about what someone did, and *sorry* says you did something wrong. Find which of the three the meaning describes.",
        "*please* 用来请求，*thank you* 表示感谢别人为你做的事，*sorry* 表示自己做错了事。看释义说的是哪一种。",
      ),
      spell: t(
        "*Goodbye* is one word with a double o; *thank* starts with th, and *thanks* adds s; *sorry* has a double r.",
        "*goodbye* 是一个词，有两个 o；*thank* 以 th 开头，*thanks* 加 s；*sorry* 双写 r。",
      ),
    },
    notes: `
      hello|meeting people;answering the phone;meeting Ms. Li and asking her in|hello is for meeting; goodbye is for going away|hello 是见面时说的；goodbye 是离开时说的|goodbye=goodbye is what you say when you go away, not when you meet someone or answer the phone=goodbye 是离开时说的，不是见面或接电话时说的;thank/thanks=thanks says you are glad about what someone did, not a word for meeting someone=thanks 是感谢别人，不是见面时打招呼|hel · lo|the double l in the middle|中间双写 l
      hi|meeting Tom;coming into a room;getting back home to Dad|hi is for meeting a friend; bye is for going away|hi 是和朋友见面时说的；bye 是离开时说的|bye=bye is what you say to a friend when you go away, not when you meet=bye 是和朋友分开时说的，不是见面时说的;thank/thanks=thanks says you are glad about what someone did, not a word for meeting someone=thanks 是感谢别人，不是见面时打招呼|hi|h and i, said like *high*|h 加 i，读音像 *high*
      goodbye|going home;leaving at the door;the end of a class|goodbye is for going away; hello is for meeting|goodbye 是离开时说的；hello 是见面时说的|hello=hello is what you say when you meet someone, not when you go away=hello 是见面时说的，不是离开时说的;hi=hi is what you say to a friend when you meet, not when you go away=hi 是和朋友见面时说的，不是离开时说的|good · bye|one word: *good* with a double o, then *bye*|是一个词：两个 o 的 *good* 加上 *bye*
      bye|leaving Mom for school;seeing Lily later;waving to Grandma's bus|bye is for going away; hi is for meeting|bye 是离开时说的；hi 是见面时说的|hi=hi is what you say to a friend when you meet, not when you go away=hi 是和朋友见面时说的，不是离开时说的;hello=hello is what you say when you meet someone, not when you go away=hello 是见面时说的，不是离开时说的|bye|ye at the end, said like *by*|结尾是 ye，读音像 *by*
      name|Lily's own;asking who you are;writing it on a book;what Tom and Ann are called|a name is what we call a person; a friend is a person you like|name 是人的名字；friend 是你喜欢的人|friend/friends=friend is a person you like, not what someone is called=friend 是你喜欢的人，不是别人的称呼;color/colors=color is red, blue or green, not what someone is called=color 是红、蓝、绿这样的颜色，不是名字|name|a says its name, with a silent e at the end|a 读字母本音，词尾 e 不发音
      yes|saying it is a cat;liking something;wanting an apple|yes agrees; no does not agree|yes 表示同意；no 表示不同意|no=no says something is not true or you do not want it, but the rest of the answer agrees=no 表示不对或不要，可回答的后半句是同意的;thank/thanks=thanks says you are glad about what someone did, and it does not answer a yes-or-no question=thanks 是道谢，不能回答“是不是”的问题|yes|ye at the start and s at the end|开头是 ye，结尾是 s
      no|saying it is not a dog;not having a pen;saying she is not my sister|no does not agree; yes agrees|no 表示不同意；yes 表示同意|yes=yes says something is true, but the rest of the answer says it is not=yes 表示对，可回答的后半句说的是不对;thank/thanks=thanks says you are glad about what someone did, and it does not answer a yes-or-no question=thanks 是道谢，不能回答“是不是”的问题|no|just n and o, not *on*|只有 n 和 o，别写成 *on*
      please|asking for a pencil;asking someone to open the door;asking for water|please asks nicely; sorry says you did something wrong|please 是礼貌地请求；sorry 是说自己做错了|sorry=sorry says you did something wrong, not that you ask for something nicely=sorry 是说自己做错了，不是礼貌地请求;goodbye=goodbye is what you say when you go away, not when you ask for something=goodbye 是离开时说的，不是请求时说的|please|ea in the middle and a silent e at the end|中间是 ea，词尾 e 不发音
      thank|a gift;a pen someone gives you;a cake from Mom|thank says you are glad about what someone did; sorry says you did something wrong|thank 是感谢；sorry 是道歉|sorry=sorry says you did something wrong, not that you are glad about a gift=sorry 是说自己做错了，不是感谢礼物;please/pleased=please asks for something nicely, not thanks someone for what they gave you=please 是礼貌地请求，不是感谢别人给你的东西|thank|th at the start and nk at the end|开头是 th，结尾是 nk
      sorry|being late;breaking a pencil;taking someone's pen|sorry says you did something wrong; thanks says you are glad|sorry 是道歉；thanks 是感谢|thank/thanks=thanks says you are glad about what someone did, not that you did something wrong=thanks 是感谢别人，不是说自己做错了;please=please asks for something nicely, not that you did something wrong=please 是礼貌地请求，不是说自己做错了|sor · ry|the double r|双写 r
      friend|Lily, my best one;people I play with after school;Sam, who helps me|a friend is a person you like; a name is what someone is called|friend 是你喜欢的人；name 是名字|name/names=name is what someone is called, not a person you play with=name 是名字，不是一起玩的人;family/families=family is your mother, father and children, not one person you like=family 是父母和孩子组成的家，不是你喜欢的一个人|friend|ie in the middle, said like the short e in *end*|中间是 ie，读作 *end* 里的短 e
    `,
  },
});

const iAndYou = vocabularyTopic({
  id: "pre-a1-words-i-and-you",
  title: t("I, You and We", "我、你和我们"),
  summary: t(
    "The words for people (I, you, he, she, it, we, they) and am, is and are.",
    "表示人的词（I、you、he、she、it、we、they）以及 am、is、are。",
  ),
  intro: t(
    "**I** am Ben, and this is Tom. **He** is my friend. **We** are in the same class. These words help you talk about yourself and other people, with *am*, *is* and *are*.",
    "**I**（我）是本，这是汤姆。**He**（他）是我的朋友。**We**（我们）在同一个班。这些词帮你用 *am*、*is*、*are* 谈论自己和别人。",
  ),
  prerequisites: ["pre-a1-words-hello"],
  words: [
    word(
      "I",
      "the word for yourself when you talk",
      "我",
      "{I} am ten years old. | My name is Lily, and {I} am a student. | Can {I} have a pen, please?",
      "me my",
    ),
    word(
      "you",
      "the person or people you are talking to",
      "你；你们",
      "How are {you}? | Thank {you} for the gift! | Are {you} a student, Ben?",
      "I he",
    ),
    word(
      "he",
      "the word for a man or a boy",
      "他",
      "This is my dad. {He} is a teacher. | Tom is my brother. {He} is nine. | Look at that boy! {He} can run fast.",
      "she it",
    ),
    word(
      "she",
      "the word for a woman or a girl",
      "她",
      "This is my mom. {She} is very nice. | Anna is my sister. {She} is six. | Look at that girl! {She} can swim.",
      "he it",
    ),
    word(
      "it",
      "the word for a thing or an animal",
      "它",
      "What is this? {It} is a pen. | I have a bag. {It} is red. | Look at the bird! {It} can fly.",
      "he she",
    ),
    word(
      "we",
      "you and I, or I and other people",
      "我们",
      "Tom and I are friends. {We} play together. | My sister and I are at home. {We} are happy. | Ben and I are in the same class. {We} are ten.",
      "they he",
    ),
    word(
      "they",
      "other people or things, more than one",
      "他们；她们；它们",
      "Tom and Sam are my friends. {They} are nice. | I have two cats. {They} are white. | Where are Mom and Dad? {They} are in the kitchen.",
      "we he",
    ),
    word(
      "am I'm",
      "the form of *be* after *I*",
      "（be 的形式，用在 I 后面）是",
      "I {am} a student. | I {am} seven years old. | Hello, {I'm} Lily, and this is my brother.|She's You're | I {am} in the classroom now.",
      "is are",
    ),
    word(
      "is isn't it's he's she's",
      "the form of *be* after *he*, *she*, *it* or one person or thing",
      "（be 的形式，用在 he、she、it 或单数后面）是",
      "She {is} my sister. | The cat {is} on the bed. | {It's} a red pen.|I'm You're | He {isn't} at home. He is at school.|aren't am | {She's} my friend Anna.|I'm You're",
      "am are",
    ),
    word(
      "are aren't you're we're they're",
      "the form of *be* after *you*, *we*, *they* or more than one",
      "（be 的形式，用在 you、we、they 或复数后面）是",
      "You {are} my friend. | We {are} in the same class. | They {aren't} cats. They are dogs.|isn't am | Thank you, Ben. {You're} very kind.|I'm He's | {They're} my brothers.|He's I'm",
      "am is",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "Look back at who the sentence talks about: a boy or a man takes *he*, a girl or a woman *she*, a thing or an animal *it*, and *I* with someone else *we*.",
        "回头看句子说的是谁：男孩或男人用 *he*，女孩或女人用 *she*，东西或动物用 *it*，我和别人一起用 *we*。",
      ),
      meaning: t(
        "*Am*, *is* and *are* all mean *be*: *am* goes only with *I*, *is* with one person or thing, *are* with *you* and with more than one.",
        "*am*、*is*、*are* 都是 *be*：*am* 只跟 *I*，*is* 跟一个人或一样东西，*are* 跟 *you* 和多个人或东西。",
      ),
      spell: t(
        "*I* is always a capital letter, even in the middle of a sentence. In *I'm*, *it's* and *you're*, the apostrophe stands for the missing letter.",
        "*I* 永远大写，即使在句子中间也一样。*I'm*、*it's*、*you're* 里的撇号代替省掉的字母。",
      ),
    },
    notes: `
      I|being ten years old;Lily, who is a student;asking for a pen|I is the word for yourself before a verb; me comes after a verb|I 指自己，用在动词前面；me 用在动词后面|me=me is the word for yourself after a verb or *with*, not before *am* or *have*=me 用在动词或 *with* 后面，不能放在 *am* 或 *have* 前面;my=my needs a thing after it, as in *my pen*, not a verb=my 后面要跟东西，比如 *my pen*，不能跟动词|I|always a capital letter|永远大写
      you|asking how someone is;thanking someone for a gift;asking Ben if he is a student|you is the person you talk to; I is yourself|you 是对方；I 是自己|I=I is the word for yourself, and it goes with *am*, not *are*, and never after *thank*=I 指自己，跟 *am* 而不跟 *are*，也不放在 *thank* 后面;he=he is a boy or a man you talk about, not the person you talk to, and it goes with *is*, not *are*=he 是说到的男孩或男人，不是对方，而且跟 *is* 而不跟 *are*|you|y, then ou said like oo|先写 y，ou 读作 oo
      he|my dad, a teacher;Tom, who is nine;a boy who runs fast|he is a man or a boy; she is a woman or a girl|he 指男的；she 指女的|she=she is a woman or a girl, but dad, Tom and the boy are male=she 指女人或女孩，可 dad、Tom 和那个男孩都是男的;it=it is a thing or an animal, not a man or a boy=it 指东西或动物，不指男人或男孩|he|h and e, said like *hee*|h 加 e，读作 *hee*
      she|my nice mom;Anna, who is six;a girl who can swim|she is a woman or a girl; he is a man or a boy|she 指女的；he 指男的|he=he is a man or a boy, but mom, Anna and the girl are female=he 指男人或男孩，可 mom、Anna 和那个女孩都是女的;it=it is a thing or an animal, not a woman or a girl=it 指东西或动物，不指女人或女孩|she|sh at the start|开头是 sh
      it|a pen;a red bag;a bird that can fly|it is a thing or an animal; he and she are people|it 指东西或动物；he 和 she 指人|he=he is a man or a boy, not a thing like a pen or a bag=he 指男人或男孩，不指笔或包这样的东西;she=she is a woman or a girl, not a thing like a pen or a bag=she 指女人或女孩，不指笔或包这样的东西|it|just i and t|只有 i 和 t
      we|Tom and I playing together;my sister and me at home;Ben and me in one class|we is you and I together; they is other people|we 包括自己；they 是别人|they=they is other people without you, but here *I* is one of them=they 是不包括自己的别人，可这里有 *I*;he=he is one boy or man, but here there are two people=he 只指一个男的，可这里是两个人|we|w and e, said like *wee*|w 加 e，读作 *wee*
      they|Tom and Sam, who are nice;two white cats;Mom and Dad in the kitchen|they is more than one other person or thing; we includes you|they 指别的多个人或东西；we 包括自己|we=we includes the speaker, but here the speaker talks about other people or things=we 包括说话人，可这里说的是别人或别的东西;he=he is one boy or man, but here there are two=he 只指一个男的，可这里是两个|they|ey at the end, said like *ay*|结尾是 ey，读作 *ay*
      am|being a student;being seven;saying who I am;being in the classroom now|am goes only with I; is goes with he, she and it|am 只跟 I；is 跟 he、she、it|is/she's=is goes with he, she or it, not with I=is 跟 he、she、it 连用，不跟 I;are/you're=are goes with you, we and they, not with I=are 跟 you、we、they 连用，不跟 I|am|in *I'm*, the apostrophe takes the place of a|*I'm* 里的撇号代替 a
      is|my sister;a cat on the bed;a red pen;not being at home;my friend Anna|is goes with one person or thing; are goes with more than one|is 跟一个人或一样东西；are 跟多个|am/I'm=am goes only with I, not with she, he, it or the cat=am 只跟 I 连用，不跟 she、he、it 或 the cat;are/aren't/you're=are goes with you, we, they or more than one, not with one person or thing=are 跟 you、we、they 或多个连用，不跟一个人或一样东西|is|s said like z, and the apostrophe in *isn't* and *it's*|s 读作 z；*isn't*、*it's* 要加撇号
      are|you being my friend;we being in one class;not being cats;Ben being very kind;my brothers|are goes with you, we, they and more than one; is goes with one|are 跟 you、we、they 和多个；is 跟一个|am/I'm=am goes only with I, not with you, we or they=am 只跟 I 连用，不跟 you、we、they;is/isn't/he's=is goes with one person or thing, not with you, we or they=is 跟一个人或一样东西连用，不跟 you、we、they|are|ar with a silent e at the end|ar 后面加不发音的 e
    `,
  },
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
  intro: t(
    "Look at *My sister is at school* and *We are here*: English never skips the linking verb, and its form changes with the subject (*am*, *is*, or *are*). In this topic, you match each subject to the right form of *be*, fix sentences that leave *be* out, and use everyday short forms like *I'm* and *they're*.",
    "看看 *My sister is at school* 和 *We are here*：英语从不省略连系动词，而且它要跟着主语变成 *am*、*is* 或 *are*。本主题带你把主语与正确的 *be* 形式配对、补上漏掉的 *be*，并掌握 *I'm*、*they're* 等常用缩写。",
  ),
  prerequisites: ["pre-a1-words-i-and-you"],
  encompasses: [{ topic: "pre-a1-words-i-and-you", weight: 0.5 }],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Choosing am, is or are", "选择 am、is 还是 are"),
      t(
        "*I am*. *He is*, *she is*, *it is*, and one person or thing *is*. *You are*, *we are*, *they are*, and more than one *are*.\n\n*I am happy. Tom is at home. The dogs are here.*\n\n> **Watch out.** *You* always takes *are*—even when you are talking to just one person—and *am* goes only with *I*.",
        "*I* 后面用 *am*。*he*、*she*、*it* 和单个的人或东西后面用 *is*。*you*、*we*、*they* 和多个的人或东西后面用 *are*。\n\n*I am happy. Tom is at home. The dogs are here.*\n\n> **注意。** 哪怕只对一个人说话，*you* 后面也永远用 *are*；而 *am* 只和 *I* 连用。",
      ),
      choiceGenerator(
        t("Choose the word for the gap.", "选出填入空白处的词。"),
        beChoiceBank,
        (right, shown) =>
          t(
            `The subject is *${beSubject(shown)}*, and ${beRule[right]?.en}: ${shown.replace("___", `*${right}*`)}\n\n**Check.** Count the subject before the gap (*I* -> *am*, one person/thing -> *is*, *you* or more than one -> *are*) and confirm *${right}* matches.`,
            `主语是 *${beSubject(shown)}*，${beRule[right]?.["zh-CN"]}：${shown.replace("___", `*${right}*`)}\n\n**检验。** 核对空白前的主语（*I* 配 *am*，单数配 *is*，*you* 或复数配 *are*），确认 *${right}* 与主语一致。`,
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
        "An English sentence needs a verb. When you say how someone is or where they are, the verb is *am*, *is* or *are*.\n\nNot *She happy.* but *She is happy.*\n\n> **Watch out.** Do not translate Chinese sentences like “她很高兴” or “他在家” word for word—English always needs *am*, *is*, or *are* between the subject and an adjective or place.",
        "英语句子必须有动词。中文说“她很高兴”“我在家”，没有“是”，可英语描述状态或位置时一定要用 *am*、*is* 或 *are*。\n\n不说 *She happy.*，要说 *She is happy.*\n\n> **注意。** 不要把中文的“她很高兴”“他在家”逐字直译成英语——主语和形容词或地点之间必须放上 *am*、*is* 或 *are*。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("A word is missing. Write the sentence with am, is or are.", "句子缺了一个词。用 am、is 或 are 把句子写完整。"),
        missingBeBank,
        (right, shown) =>
          t(
            `*${shown}* has no verb, and an English sentence needs one. To say how or where someone is, add *am*, *is* or *are*: ${right}\n\n**Check.** Find the verb right after the subject in your sentence—confirm *am*, *is*, or *are* is there and matches the subject.`,
            `*${shown}* 没有动词，而英语句子必须有动词。说明人怎么样或在哪里，要加上 *am*、*is* 或 *are*：${right}\n\n**检验。** 检查主语后面紧跟着的词——确认已经补上与主语相配的 *am*、*is* 或 *are*。`,
          ),
      ),
    ),
    point(
      "short-forms",
      t("Short forms", "缩写形式"),
      t(
        "In speaking and in friendly writing, *am*, *is* and *are* get short: *I'm*, *he's*, *she's*, *it's*, *you're*, *we're*, *they're*. The mark ' stands for the missing letter.\n\n> **Watch out.** Never drop the apostrophe (write *I'm*, not *Im*), and match the ending to the verb: *'m* = *am*, *'s* = *is*, *'re* = *are*.",
        "口语和非正式书面语中，*am*、*is*、*are* 常常缩写：*I'm*、*he's*、*she's*、*it's*、*you're*、*we're*、*they're*。撇号 ' 代替省掉的字母。\n\n> **注意。** 千万别漏写撇号（写 *I'm*，不写 *Im*），并核对缩写结尾：*'m* = *am*、*'s* = *is*、*'re* = *are*。",
      ),
      choiceGenerator(
        t("Choose the short form of the sentence.", "选出这个句子的缩写形式。"),
        shortFormBank,
        (right, shown) =>
          t(
            `The short form joins the subject and the verb, and the mark ' stands for the letters left out: ${shown} → ${right}\n\n**Check.** Expand the contraction back out (*'m* -> *am*, *'s* -> *is*, *'re* -> *are*) and confirm you get the exact original sentence with the apostrophe in place.`,
            `缩写形式把主语和动词连在一起，撇号 ' 代替省掉的字母：${shown} → ${right}\n\n**检验。** 把缩写还原展开（*'m* -> *am*、*'s* -> *is*、*'re* -> *are*），确认能准确还原原句且撇号没有遗漏。`,
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
