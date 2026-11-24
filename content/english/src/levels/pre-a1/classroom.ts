// Pre-A1, unit 4: My Classroom. Things in the classroom, this and that, in, on and under, classroom commands, and
// putting words in the order of an English sentence.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, interleave, sentenceCase, vocabularyTopic, word } from "../words.ts";

const classroom = vocabularyTopic({
  id: "pre-a1-words-classroom",
  title: t("The Classroom", "教室"),
  summary: t("The things and people of a classroom.", "教室里的东西和人。"),
  prerequisites: [],
  words: [
    word(
      "book books",
      "pages with words and pictures to read, inside a cover",
      "书",
      "I read a {book} about cats.|pen chair | Open your {books} to page ten.|pens chairs | This {book} has many pictures and stories.|ruler chair",
      "pen chair",
    ),
    word(
      "pen pens",
      "a thing you write with in ink",
      "钢笔；笔",
      "I write my name with a {pen}.|desk book | My {pen} has blue ink.|ruler desk | Can I have a {pen}? I want to write.|chair desk",
      "desk book",
    ),
    word(
      "pencil pencils",
      "a thing you write or draw with; you can rub out what it makes",
      "铅笔",
      "I draw with a {pencil}.|chair bag | Use a {pencil}, so you can rub it out.|pen ruler | My {pencils} are in my bag. They are not sharp.|chairs desks",
      "chair bag",
    ),
    word(
      "bag bags",
      "a thing you carry your books in",
      "书包；包",
      "Put your books in your {bag}.|desk pen | My school {bag} is heavy.|ruler pencil | I carry my {bag} to school.|desk chair",
      "desk pen",
    ),
    word(
      "desk desks",
      "a table you work or write at",
      "书桌；课桌",
      "My book is on my {desk}.|pen ruler | Sit at your {desk}, please.|bag pencil | There are thirty {desks} in our classroom.|teachers schools",
      "pen ruler",
    ),
    word(
      "chair chairs",
      "a seat for one person, with legs and a back",
      "椅子",
      "Sit on the {chair}.|pen ruler | The {chair} has four legs and a back.|pen ruler | Please put your {chair} under the desk.|teacher school",
      "pen ruler",
    ),
    word(
      "ruler rulers",
      "a long, flat thing for drawing straight lines",
      "尺子",
      "Draw a line with a {ruler}.|chair bag | Use a {ruler} to draw a straight line.|chair teacher | This {ruler} is long and flat. It has numbers on it.|chair bag",
      "chair bag",
    ),
    word(
      "eraser erasers",
      "a small thing for rubbing out pencil marks",
      "橡皮",
      "Oops! A mistake. Can I use your {eraser}?|ruler chair | Rub it out with an {eraser}.|ruler desk | My {eraser} is small and pink. It rubs out pencil.|ruler desk",
      "ruler chair",
    ),
    word(
      "teacher teachers",
      "a person who helps you learn at school",
      "老师",
      "Ms. Li is our English {teacher}.|book school | Listen to your {teacher}.|book desk | The {teachers} are in the classroom with the children.|books schools",
      "book school",
    ),
    word(
      "school schools",
      "a place where children go to learn",
      "学校",
      "I go to {school} at eight.|teacher desk | My {school} is big. It has many classrooms.|teacher desk | Children learn at {school}.|teacher desk",
      "teacher desk",
    ),
    word(
      "classroom classrooms",
      "a room in a school where a class learns",
      "教室",
      "Our {classroom} has thirty desks.|teacher pen | The children are in the {classroom}.|teacher pencil | Our school has twenty {classrooms} for twenty classes.|pens rulers",
      "teacher pen",
    ),
  ],
});

const thisAndThat = vocabularyTopic({
  id: "pre-a1-words-this-and-that",
  title: t("This, That, Here and There", "this、that、here 和 there"),
  summary: t("Words for near and far, and for places: in, on, under and where.", "表示远近和位置的词：in、on、under 和 where。"),
  prerequisites: ["pre-a1-words-i-and-you"],
  words: [
    word(
      "this",
      "the one thing near you",
      "这；这个",
      "{This} is my pen, here in my hand.|Those These | Look at {this} book in my hand.|these those | {This} is my friend Sam, next to me.|These Those",
      "those these",
    ),
    word(
      "that that's",
      "the one thing over there, not near you",
      "那；那个",
      "Look at {that} bird up in the sky!|these this | {That's} my house, over there.|These Those | What is {that}, over there?|these this",
      "these this",
    ),
    word(
      "these",
      "the things near you, more than one",
      "这些",
      "{These} are my pens, here on my desk.|That This | Look at {these} pictures in my book.|that this | Are {these} your shoes, here by the door?|that this",
      "that this",
    ),
    word(
      "those",
      "the things over there, more than one",
      "那些",
      "{Those} are my friends, over there.|This That | Look at {those} birds in the tree!|this that | Are {those} your bags, over there?|this that",
      "this that",
    ),
    word(
      "here",
      "in this place, near me",
      "这里",
      "Come {here}, please. Sit next to me.|there under | Your pen is {here}, in my hand.|there under | {Here} is your book.|Under Where",
      "there under",
    ),
    word(
      "there there's",
      "in that place, not near me; also in *there is* and *there are*",
      "那里；（用在 there is 中）有",
      "Your bag is over {there}, by the door.|here this | {There's} a cat on the bed.|Where's Its | Look over {there}! It's a big bird.|here this",
      "here this",
    ),
    word(
      "in",
      "inside something",
      "在……里面",
      "I am {in} the classroom.|on under | The milk is {in} the cup.|under at | Ben is {in} bed. He is sleeping.|on under",
      "on under",
    ),
    word(
      "on",
      "touching the top or the side of something",
      "在……上面",
      "The picture is {on} the wall.|in under | There is a hat {on} his head.|in under | Write your name {on} the paper.|in under",
      "in under",
    ),
    word(
      "under",
      "below something",
      "在……下面",
      "The dog sleeps {under} the table. It's dark there.|on at | My feet are {under} the desk.|on of | It's raining! Come {under} my umbrella.|on at",
      "on in",
    ),
    word(
      "where where's",
      "the word you use to ask about a place",
      "在哪里",
      "{Where} is my pen? It's in your bag.|What Who | {Where's} Dad? He's in the garden.|What's Who's | {Where} are you? I'm here!|What Who",
      "what who",
    ),
  ],
});

const classroomActions = vocabularyTopic({
  id: "pre-a1-words-classroom-actions",
  title: t("Classroom Actions", "课堂动作"),
  summary: t(
    "The verbs of classroom commands: open, close, sit, stand, look, listen, read, write, draw and do.",
    "课堂指令中的动词：open、close、sit、stand、look、listen、read、write、draw 和 do。",
  ),
  prerequisites: ["pre-a1-words-classroom"],
  words: [
    word(
      "open opens opened opening",
      "to move a door, a book or a box so you can go in or see inside",
      "打开",
      "{Open} your books to page five.|Close Sit | It's hot. Please {open} the window.|close sit | She {opens} the box and finds a cat inside.|closes sits",
      "close sit",
    ),
    word(
      "close closes closed closing",
      "to shut a door, a book or a box",
      "关上；合上",
      "It's cold. Please {close} the door.|open stand | {Close} your eyes and go to sleep.|Open Draw | The shop {closes} at six. Then it is not open.|opens sits",
      "open stand",
    ),
    word(
      "sit sits sat sitting",
      "to rest on a chair",
      "坐",
      "{Sit} down on your chair, please.|Stand Look | I {sit} next to Lily in class.|open close | The cat is {sitting} on the chair.|opening closing",
      "stand open",
    ),
    word(
      "stand stands stood standing",
      "to be on your feet",
      "站",
      "{Stand} up, please, and say your name.|Sit Close | We {stand} in a line at the door.|close open | Tom is {standing} on one leg.|closing opening",
      "sit close",
    ),
    word(
      "look looks looked looking",
      "to turn your eyes to see something",
      "看",
      "{Look} at the picture on page six.|Listen Sit | {Look}! A big bird in the sky!|Sit Close | She {looks} at the board.|listens opens",
      "listen sit",
    ),
    word(
      "listen listens listened listening",
      "to try to hear something",
      "听",
      "{Listen} to the song.|Look Open | Please {listen} to your teacher.|look draw | I {listen} to music in my room.|look sit",
      "look open",
    ),
    word(
      "read reads reading",
      "to look at words and understand them",
      "读；阅读",
      "I {read} a book before bed.|listen sit | Can you {read} this word?|listen sit | She is {reading} a story.|listening sitting",
      "listen sit",
    ),
    word(
      "write writes wrote written writing",
      "to make letters and words with a pen or pencil",
      "写",
      "{Write} your name at the top.|Sit Listen | I {write} with my right hand.|listen sit | Tom {wrote} a letter to his grandma.|sat stood",
      "listen sit",
    ),
    word(
      "draw draws drew drawn drawing",
      "to make a picture with a pencil or pen",
      "画",
      "{Draw} a cat in your book.|Listen Sit | I like to {draw} pictures of animals.|listen sit | She {drew} a big red sun.|read sat",
      "listen sit",
    ),
    word(
      "do does did done doing don't doesn't didn't",
      "to act, or to make something happen",
      "做；干",
      "What are you {doing}? I'm reading.|sitting looking | I {do} my homework after school.|sit look | {Don't} run in the classroom!|Doesn't Isn't | She {doesn't} like milk.|don't isn't",
      "sit look",
    ),
  ],
});

// This, that, these and those.

const pointedNouns: readonly (readonly [one: string, many: string])[] = [
  ["pen", "pens"],
  ["book", "books"],
  ["bag", "bags"],
  ["cat", "cats"],
  ["desk", "desks"],
  ["chair", "chairs"],
  ["pencil", "pencils"],
  ["ruler", "rulers"],
  ["box", "boxes"],
  ["dog", "dogs"],
  ["eraser", "erasers"],
  ["apple", "apples"],
  ["ball", "balls"],
  ["kite", "kites"],
];

type Pointer = "This" | "That" | "These" | "Those";

const pointerFrames: readonly (readonly [pointer: Pointer, make: (one: string, many: string) => string])[] = [
  ["This", (one) => `___ is my ${one}, here in my hand.`],
  ["That", (one) => `___ is my ${one}, over there.`],
  ["These", (_, many) => `___ are my ${many}, here on my desk.`],
  ["Those", (_, many) => `___ are my ${many}, over there.`],
  ["This", (one) => `___ is your ${one}, here.`],
  ["That", (one) => `___ is your ${one}, over there by the door.`],
  ["These", (_, many) => `___ are your ${many}, here in my bag.`],
  ["Those", (_, many) => `___ are your ${many}, over there on the chair.`],
];

const wrongPointers: Record<Pointer, readonly [Pointer, Pointer]> = {
  This: ["That", "These"],
  That: ["This", "Those"],
  These: ["This", "Those"],
  Those: ["That", "These"],
};

const pointerChoiceBank: readonly ChoiceItem[] = everyPair(pointedNouns, pointerFrames).map(
  ([[one, many], [pointer, make]]): ChoiceItem => [make(one, many), pointer, [...wrongPointers[pointer]]],
);

/** whose are the words for whose that the sentences to change carry along. */
const whose: readonly string[] = ["my", "your", "his", "her"];

const pointerTypedBank: readonly TypedItem[] = everyPair(
  pointedNouns,
  (["This", "That"] as const).flatMap((pointer) => whose.map((w) => [pointer, w] as const)),
).map(([[one, many], [pointer, w]]): TypedItem => {
  const plural = pointer === "This" ? "These" : "Those";
  return {
    shown: `${pointer} is ${w} ${one}.`,
    accepted: [`${plural} are ${w} ${many}.`],
    wrong: [`${plural} is ${w} ${many}.`, `${plural} are ${w} ${one}.`, `${pointer} are ${w} ${many}.`],
  };
});

const pointerTypedBank2: readonly TypedItem[] = everyPair(
  pointedNouns,
  (["These", "Those"] as const).flatMap((pointer) => whose.map((w) => [pointer, w] as const)),
).map(([[one, many], [pointer, w]]): TypedItem => {
  const single = pointer === "These" ? "This" : "That";
  return {
    shown: `${pointer} are ${w} ${many}.`,
    accepted: [`${single} is ${w} ${one}.`],
    wrong: [`${single} are ${w} ${one}.`, `${single} is ${w} ${many}.`],
  };
});

/** pointerSense says where a pointer word points and how many, in every locale. */
const pointerSense = (near: boolean, many: boolean): Text =>
  t(
    `${near ? "near (here)" : "far (over there)"} and ${many ? "more than one" : "one"}`,
    `${near ? "近处（here）" : "远处（over there）"}、${many ? "多个" : "一个"}`,
  );

/** whyNotPointer says which half of the table a wrong pointer word misreads. */
const whyNotPointer = (wrong: string, _right: string, shown: string): Text => {
  const near = !shown.includes("over there");
  const wrongNear = wrong === "This" || wrong === "These";
  const wrongMany = wrong === "These" || wrong === "Those";
  return wrongNear !== near
    ? t(
        `*${wrong}* points to something ${wrongNear ? "near" : "far"}, but the sentence says *${near ? "here" : "over there"}*.`,
        `*${wrong}* 指${wrongNear ? "近处" : "远处"}的东西，可句子里说的是 *${near ? "here" : "over there"}*。`,
      )
    : t(
        `*${wrong}* is for ${wrongMany ? "more than one" : "one"}, but the verb *${wrongMany ? "is" : "are"}* says ${wrongMany ? "one" : "more than one"}.`,
        `*${wrong}* 用于${wrongMany ? "多个" : "一个"}，可动词 *${wrongMany ? "is" : "are"}* 表示${wrongMany ? "一个" : "多个"}。`,
      );
};

/** changedWords lists the three words that change between a sentence about one and one about more than one. */
const changedWords = (from: string, to: string) => {
  const a = from.replace(/\.$/u, "").split(" ");
  const b = to.replace(/\.$/u, "").split(" ");
  return `*${a[0]}* → *${b[0]}*, *${a[1]}* → *${b[1]}*, *${a.at(-1)}* → *${b.at(-1)}*`;
};

const thisThatTheseThose: TopicDef = {
  id: "this-that-these-those",
  title: t("This, That, These and Those", "this、that、these 和 those"),
  summary: t(
    "This and these are near, that and those are far; these and those are for more than one.",
    "this 和 these 指近处，that 和 those 指远处；these 和 those 用于多个。",
  ),
  intro: t(
    "Point to one ruler in your hand and say *This is my ruler*; point to two rulers across the room and say *Those are my rulers*. English uses four pointing words to show both distance (near vs. far) and number (one vs. more than one)—and the verb and noun must match. In this topic, you choose the right pointer and switch sentences between singular and plural.",
    "指着手里的尺子说 *This is my ruler*，指着远处桌子上的两把尺子说 *Those are my rulers*。英语用四个指示词同时表达远近（近/远）和数量（一个/多个），后面的动词和名词也必须跟着一致。本主题带你选对指示词，并在单复数句子之间自由转换。",
  ),
  prerequisites: ["pre-a1-words-this-and-that", "plural-nouns-with-s"],
  encompasses: [
    { topic: "pre-a1-words-this-and-that", weight: 0.4 },
    { topic: "plural-nouns-with-s", weight: 0.3 },
  ],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Near or far, one or more", "近还是远，一个还是多个"),
      t(
        "| | one | more than one |\n|---|---|---|\n| near (here) | *this* | *these* |\n| far (over there) | *that* | *those* |\n\n*This is my pen. These are my pens. That is my bag. Those are my bags.*\n\n> **Watch out.** Check *both* clues in the sentence: *here* vs. *over there* tells you near or far, while *is* vs. *are* tells you one or more than one.",
        "| | 一个 | 多个 |\n|---|---|---|\n| 近处（here） | *this* | *these* |\n| 远处（over there） | *that* | *those* |\n\n中文“这些”“那些”后面的名词不变，英语却要全部变成复数：*these pens*，后面的动词也用 *are*。\n\n*This is my pen. These are my pens. That is my bag. Those are my bags.*\n\n> **注意。** 同时核对句中的*两个*线索：*here* / *over there* 决定远近，*is* / *are* 决定一个还是多个。",
      ),
      choiceGenerator(
        t("Choose the word for the gap.", "选出填入空白处的词。"),
        pointerChoiceBank,
        (right, shown) => {
          const sense = pointerSense(!shown.includes("over there"), shown.includes(" are "));
          return t(
            `The thing is ${sense.en}, so the word is *${right}*: ${shown.replace("___", `*${right}*`)}\n\n**Check.** Match both clues—distance (*here* -> *this/these*, *over there* -> *that/those*) and verb (*is* -> singular, *are* -> plural)—to confirm *${right}*.`,
            `东西在${sense["zh-CN"]}，所以用 *${right}*：${shown.replace("___", `*${right}*`)}\n\n**检验。** 同时核对远近线索（*here* 配 *this/these*，*over there* 配 *that/those*）与动词（*is* 配单数，*are* 配复数），确认是 *${right}*。`,
          );
        },
        whyNotPointer,
      ),
    ),
    point(
      "change",
      t("Changing one to more than one", "把一个变成多个"),
      t(
        "When *this* becomes *these* and *that* becomes *those*, three words change: *is* becomes *are*, and the noun takes *-s*.\n\n*This is my pen.* → *These are my pens.*\n\n> **Watch out.** Do not stop after changing the first word—always update all *three* spots together: pointer (*this/these* or *that/those*), verb (*is/are*), and noun (*pen/pens*, *box/boxes*).",
        "*this* 变成 *these*、*that* 变成 *those* 时，有三处要变：*is* 变成 *are*，名词加 *-s*。\n\n*This is my pen.* → *These are my pens.*\n\n> **注意。** 不要只改句首第一个词就停手——务必把*三处*一起改过来：指示词（*this/these* 或 *that/those*）、动词（*is/are*）和名词（*pen/pens*、*box/boxes*）。",
      ),
      typedGenerator(
        "sentence",
        t("Write the sentence about more than one, or about one.", "把句子改成说多个的，或改成说一个的。"),
        [...pointerTypedBank, ...pointerTypedBank2],
        (right, shown) =>
          t(
            `Between one and more than one, three words change together, ${changedWords(shown, right)}: ${shown} → ${right}\n\n**Check.** Count the three changes in your sentence—pointer, verb (*is/are*), and noun ending—and confirm the distance (near vs. far) stayed the same.`,
            `一个和多个之间转换时，三处要一起变，${changedWords(shown, right)}：${shown} → ${right}\n\n**检验。** 逐一核对句子里的三处变化——指示词、动词（*is/are*）和名词单复数——同时确认远近关系没有改错。`,
          ),
      ),
    ),
  ],
};

// In, on and under.

const things: readonly string[] = ["pen", "ball", "cat", "book", "dog", "ruler", "pencil"];
const placesFor: readonly string[] = ["box", "desk", "bed", "chair", "bag", "table"];
type Place = "in" | "on" | "under";
const cue: Record<Place, string> = { in: "inside", on: "on top", under: "below" };

const cueZh: Record<Place, string> = { in: "在里面", on: "在上面", under: "在下面" };

/** placed puts every thing on and under every place, and in only the places that hold things. */
const placed = interleave<readonly [readonly [string, string], Place]>([
  everyPair(things, placesFor).map((pair) => [pair, "on"] as const),
  everyPair(things, placesFor).map((pair) => [pair, "under"] as const),
  everyPair(things, ["box", "bag", "desk"]).map((pair) => [pair, "in"] as const),
]);

const placeChoiceBank: readonly ChoiceItem[] = placed.map(([[thing, place], prep]): ChoiceItem => {
  return [`The ${thing} is ___ the ${place}. (${cue[prep]})`, prep, (["in", "on", "under"] as const).filter((p) => p !== prep)];
});

const placeTypedBank: readonly TypedItem[] = placed.map(([[thing, place], prep]): TypedItem => {
  return {
    shown: `the ${thing} / ${prep} / the ${place} (${cue[prep]})`,
    accepted: [`The ${thing} is ${prep} the ${place}.`],
    wrong: [`The ${thing} is the ${place} ${prep}.`, `The ${thing} ${prep} the ${place}.`, `The ${thing} the ${place} is ${prep}.`],
  };
});

const inOnAndUnder: TopicDef = {
  id: "in-on-and-under",
  title: t("In, On and Under", "in、on 和 under"),
  summary: t("The pen is in the bag: the place word comes before the thing.", "The pen is in the bag：表示位置的词放在东西前面。"),
  intro: t(
    "Say where a ball is: *The ball is in the box* (inside), *on the table* (on top), or *under the bed* (below). Unlike Chinese, English puts the place word *before* the noun and always keeps *is* in the middle. In this topic, you pick the right preposition and build full location sentences in English word order.",
    "说明一个球在哪里：*The ball is in the box*（在里面）、*on the table*（在上面）或 *under the bed*（在下面）。和中文相反，英语把方位词放在名词*前面*，且中间必须保留 *is*。本主题带你选对介词，并按英语语序写出完整的方位句。",
  ),
  prerequisites: ["pre-a1-words-this-and-that", "pre-a1-words-classroom"],
  encompasses: [{ topic: "pre-a1-words-this-and-that", weight: 0.3 }],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("In, on or under?", "用 in、on 还是 under？"),
      t(
        "*in* = inside: *The pen is in the bag.*\n*on* = on top: *The book is on the desk.*\n*under* = below: *The cat is under the chair.*\n\n> **Watch out.** Picture the spatial cue carefully: *in* means enclosed inside, *on* means resting on top of a surface, and *under* means directly below.",
        "*in* = 在里面：*The pen is in the bag.*\n*on* = 在上面：*The book is on the desk.*\n*under* = 在下面：*The cat is under the chair.*\n\n> **注意。** 在脑中画出位置关系：*in* 表示在内部，*on* 表示在表面上，*under* 表示在正下方。",
      ),
      choiceGenerator(
        t("Choose the word for the gap.", "选出填入空白处的词。"),
        placeChoiceBank,
        (right, shown) =>
          t(
            `The note says *${cue[right as Place]}*, and *${right}* means ${cue[right as Place]}: ${shown.replace(/ \(.*\)$/u, "").replace("___", `*${right}*`)}\n\n**Check.** Match the spatial meaning back to the bracketed cue (*inside* -> *in*, *on top* -> *on*, *below* -> *under*) to verify *${right}*.`,
            `提示是 *${cue[right as Place]}*（${cueZh[right as Place]}），所以用 *${right}*：${shown.replace(/ \(.*\)$/u, "").replace("___", `*${right}*`)}\n\n**检验。** 把空间意思对照括号提示（*inside* -> *in*，*on top* -> *on*，*below* -> *under*），确认是 *${right}*。`,
          ),
        (wrong, right) =>
          t(
            `*${wrong}* means ${cue[wrong as Place]}, but the note says *${cue[right as Place]}*.`,
            `*${wrong}* 的意思是${cueZh[wrong as Place]}，可提示说的是 *${cue[right as Place]}*（${cueZh[right as Place]}）。`,
          ),
      ),
    ),
    point(
      "order",
      t("Putting the place word first", "把表示位置的词放在前面"),
      t(
        "English says the place word first and then the thing: *in the bag*, *on the desk*, *under the chair*. Do not forget *is*.\n\n*The pen is in the bag.*\n\n> **Watch out.** Check two common slips: never put *in/on/under* after the place (*the bag in*), and never drop *is* between the subject and the place word.",
        "中文说“在包里”“在桌子上”，表示位置的“里”“上”放在后面；英语正好相反，*in*、*on*、*under* 放在前面：*in the bag*、*on the desk*、*under the chair*。别忘了 *is*。\n\n*The pen is in the bag.*\n\n> **注意。** 避开两个常见失误：不要把 *in/on/under* 放到地点后面（如 *the bag in*），也不要在主语和方位词之间漏掉 *is*。",
      ),
      typedGenerator("sentence", t("Write a sentence with these words.", "用这些词写一个句子。"), placeTypedBank, (right) => {
        const place = right.split(" is ")[1]?.replace(/\.$/u, "") ?? "";
        return t(
          `English says the thing, then *is*, then the place word before the place, not after it: *${place}*. ${right}\n\n**Check.** Verify the order *The [thing] + is + [in/on/under] + the [place].*—with *is* present and the preposition right before the place.`,
          `英语先说东西，再说 *is*，位置词放在地点前面而不是后面：*${place}*。${right}\n\n**检验。** 核对语序 *The [物品] + is + [in/on/under] + the [地点].*——*is* 不能漏，方位词紧贴在地点前面。`,
        );
      }),
    ),
  ],
};

// Commands.

/** commandRests are, for each verb of a classroom command, the rests it takes. */
const commandRests: readonly (readonly [verb: string, rests: readonly string[]])[] = [
  ["open", ["your book", "the door", "the window", "your bag", "the box", "your eyes", "your books"]],
  ["close", ["your book", "the door", "the window", "your bag", "the box", "your eyes", "your books"]],
  ["look", ["at the board", "at me", "at the picture", "at page six", "at the cat", "at your book", "at the window"]],
  ["listen", ["to your teacher", "to the song", "to me", "to the bird", "to the story", "to your friend"]],
  ["read", ["page five", "the story", "this word", "the book", "your name", "the numbers"]],
  ["write", ["your name", "the word", "the number ten", "a big A", "a small b", "the word cat"]],
  ["draw", ["a cat", "a red flower", "your family", "a line", "a big house", "a dog", "a green tree"]],
  ["sit", ["down", "next to Tom", "on your chair", "next to me", "here"]],
  ["stand", ["up", "in a line", "next to your desk", "here", "next to Anna"]],
];

/** commands are classroom commands, each a verb and the rest, with and without please. */
const commands: readonly (readonly [verb: string, rest: string])[] = interleave([
  commandRests.flatMap(([verb, rests]) => rests.map((rest) => [verb, rest] as const)),
  commandRests.flatMap(([verb, rests]) => rests.map((rest) => [verb, `${rest}, please`] as const)),
]);

const third = (verb: string) => (verb === "do" ? "does" : `${verb}s`);

const commandChoiceBank: readonly ChoiceItem[] = commands.map(
  ([verb, rest]): ChoiceItem => ["", `${sentenceCase(verb)} ${rest}.`, [`You ${verb} ${rest}.`, `${sentenceCase(third(verb))} ${rest}.`]],
);

const dontRests: readonly (readonly [verb: string, rest: string])[] = [
  ["run", "in the classroom"],
  ["stand", "up"],
  ["open", "the door"],
  ["sit", "on the desk"],
  ["look", "at your friend's book"],
  ["write", "on the desk"],
  ["draw", "on the wall"],
  ["close", "your book"],
  ["eat", "in class"],
  ["read", "in the dark"],
];

const dontTypedBank: readonly TypedItem[] = interleave([
  dontRests.map(
    ([verb, rest]): TypedItem => ({
      shown: `not / ${verb} / ${rest}`,
      accepted: [`[Don't|Do not] ${verb} ${rest}.`],
      canonical: `Don't ${verb} ${rest}.`,
      wrong: [`No ${verb} ${rest}.`, `Not ${verb} ${rest}.`, `You don't ${verb} ${rest}.`],
    }),
  ),
  commands.map(
    ([verb, rest]): TypedItem => ({
      shown: `${verb} / ${rest}`,
      accepted: [`${sentenceCase(verb)} ${rest}.`],
      wrong: [`You ${verb} ${rest}.`, `${sentenceCase(third(verb))} ${rest}.`],
    }),
  ),
]);

const imperatives: TopicDef = {
  id: "imperatives",
  title: t("Commands", "祈使句"),
  summary: t("Open your book. Don't stand up. A command starts with the verb.", "Open your book. Don't stand up. 祈使句以动词开头。"),
  intro: t(
    "When a teacher says *Close the window, please.* or *Don't write on the desk.*, there is no *you* at the front and no *-s* on the verb. English commands begin straight with the base verb—or with *Don't* + base verb to tell someone not to act. In this topic, you recognize and write both positive and negative classroom commands.",
    "老师说 *Close the window, please.* 或 *Don't write on the desk.* 时，句首没有 *you*，动词也不加 *-s*。英语祈使句直接以动词原形开头，否定指令则用 *Don't* 加动词原形。本主题带你辨认并写出肯定与否定两类课堂祈使句。",
  ),
  prerequisites: ["pre-a1-words-classroom-actions"],
  encompasses: [{ topic: "pre-a1-words-classroom-actions", weight: 0.4 }],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Spotting a command", "认出祈使句"),
      t(
        "A command tells someone what to do. It starts with the verb, with no *you* and no *-s*: *Open your book. Sit down, please.*\n\n> **Watch out.** A sentence starting with *You* (*You open your book.*) is a statement, not a command, and a command verb never takes *-s* (*Opens*).",
        "祈使句告诉别人做什么。它以动词原形开头，不用 *you*，动词也不加 *-s*：*Open your book. Sit down, please.*\n\n> **注意。** 以 *You* 开头的句子（如 *You open your book.*）是陈述句，不是祈使句；祈使句的动词也绝不加 *-s*（如 *Opens*）。",
      ),
      choiceGenerator(
        t("Which one is a classroom command?", "哪一句是课堂指令？"),
        commandChoiceBank,
        (right) =>
          t(
            `${right} A command starts with the plain verb, *${right.split(" ")[0]}*, with no *you* before it and no *-s* on it.\n\n**Check.** Look at the very first word—it is a plain base verb (not *You* and not a verb ending in *-s*), directing someone to act.`,
            `${right} 祈使句以动词原形 *${right.split(" ")[0]}* 开头，前面没有 *you*，动词也不加 *-s*。\n\n**检验。** 看句首第一个词——它是不带 *-s* 的动词原形，前面没有 *You*，直接发出指令。`,
          ),
        (_wrong, _right, _shown, position) =>
          position === 0
            ? t(
                "This starts with *you*, so it says what someone does; a command leaves out *you* and starts with the verb.",
                "这句以 *you* 开头，是在陈述某人做什么；祈使句不用 *you*，直接以动词开头。",
              )
            : t("This verb has *-s*, but a command always uses the plain verb.", "这里的动词加了 *-s*，可祈使句总用动词原形。"),
      ),
    ),
    point(
      "write",
      t("Writing commands, and don't", "写祈使句和 don't"),
      t(
        "To tell someone not to do something, put *Don't* before the verb: *Don't run. Don't stand up.* Do not use *No* or *Not*.\n\n> **Watch out.** When the prompt starts with `not /`, always begin with *Don't* (or *Do not*) followed by the plain verb—never write *No run.* or *Not run.*",
        "叫别人不要做某事，在动词前加 *Don't*：*Don't run. Don't stand up.* 不能像中文“不要”那样直接用 *No* 或 *Not*。\n\n> **注意。** 提示以 `not /` 开头时，必须用 *Don't*（或 *Do not*）加动词原形——不要写成 *No run.* 或 *Not run.*",
      ),
      typedGenerator("sentence-pattern", t("Write a command with these words.", "用这些词写一句祈使句。"), dontTypedBank, (right) =>
        right.startsWith("Don't")
          ? t(
              `To tell someone not to do something, put *Don't* before the plain verb, not *No* or *Not*: ${right}\n\n**Check.** Confirm the sentence starts with *Don't* (or *Do not*), keeps the verb plain with no *-s*, and ends with a period.`,
              `叫别人不要做某事，在动词原形前加 *Don't*，不用 *No* 或 *Not*：${right}\n\n**检验。** 确认句子以 *Don't*（或 *Do not*）开头，后面的动词保持原形不加 *-s*，并以句号结尾。`,
            )
          : t(
              `A command starts with the plain verb, with no *you* before it and no *-s* on it: ${right}\n\n**Check.** Confirm the sentence starts straight with the capitalized base verb (no *You*, no *-s*) and ends with a period.`,
              `祈使句以动词原形开头，前面没有 *you*，动词也不加 *-s*：${right}\n\n**检验。** 确认句子直接以大写的动词原形开头（无 *You*、无 *-s*），并以句号结尾。`,
            ),
      ),
    ),
  ],
};

// Words in order.

/** orderedSentences are short sentences of this level, to be put in order. */
const orderedSentences: readonly string[] = [
  "This is my pen.",
  "I am ten years old.",
  "My sister has a cat.",
  "The book is on the desk.",
  "We are in the classroom.",
  "Tom has two brothers.",
  "Her bag is red.",
  "They are my friends.",
  "The cat is under the bed.",
  "I have a big dog.",
  "Our teacher is very kind.",
  "These are my books.",
  "My mom is at home.",
  "The pens are in the bag.",
  "His name is Ben.",
  "Anna is my best friend.",
  "I have three pencils.",
  "That is a green chair.",
  "My dad is a teacher.",
  "The dog is in the garden.",
  "We have a white cat.",
  "She is not sad.",
  "My grandma has gray hair.",
  "Those are my shoes.",
  "The ruler is on the chair.",
  "I am in the classroom.",
  "Lily has a pink bag.",
  "It is a red apple.",
  "Their house is big.",
  "My friends are at school.",
  "The baby is very small.",
  "He has a blue pen.",
  "You are my friend.",
  "The eraser is in my bag.",
  "Sam is eight years old.",
  "My family is very big.",
];

const keepsCapital = (w: string) =>
  w === "I" ||
  (/^[A-Z][a-z]+$/u.test(w) &&
    !["This", "My", "The", "We", "Her", "They", "Our", "These", "That", "She", "Those", "It", "Their", "He", "You"].includes(w));

const wordsOf = (s: string) => s.slice(0, -1).split(" ");

/** scramble lists the words of a sentence in another order, every second word first. */
const scramble = (s: string) => {
  const words = wordsOf(s).map((w, i) => (i === 0 && !keepsCapital(w) ? w.toLowerCase() : w));
  const odd = words.filter((_, i) => i % 2 === 1);
  const even = words.filter((_, i) => i % 2 === 0);
  return [...odd, ...even].join(" / ");
};

const chineseOrder = (s: string) => {
  // The place or thing before the verb, as a word-for-word Chinese order would put it.
  const words = wordsOf(s);
  return `${[words[0], ...words.slice(2), words[1]].join(" ")}.`;
};

const swapFirst = (s: string) => {
  const words = wordsOf(s);
  const second = words[1] ?? "";
  const first = words[0] ?? "";
  const firstLower = keepsCapital(first) ? first : first.toLowerCase();
  return `${sentenceCase(second)} ${firstLower} ${words.slice(2).join(" ")}.`;
};

const orderChoiceBank: readonly ChoiceItem[] = orderedSentences.map((s): ChoiceItem => [scramble(s), s, [chineseOrder(s), swapFirst(s)]]);

const orderTypedBank: readonly TypedItem[] = orderedSentences.map(
  (s): TypedItem => ({
    shown: scramble(s),
    accepted: [s],
    wrong: [chineseOrder(s), swapFirst(s)],
  }),
);

const verbs = new Set(["is", "am", "are", "has", "have"]);

/** partsOf splits a sentence into who or what, the verb and the rest. */
const partsOf = (s: string) => {
  const words = wordsOf(s);
  const at = words.findIndex((w) => verbs.has(w));
  return { who: words.slice(0, at).join(" "), verb: words[at] ?? "", rest: words.slice(at + 1).join(" ") };
};

/** orderWhy shows the three parts of a sentence in their English order. */
const orderWhy = (right: string): Text => {
  const { who, verb, rest } = partsOf(right);
  return t(
    `An English sentence starts with who or what (*${who}*), then the verb (*${verb}*), then the rest (*${rest}*): ${right}\n\n**Check.** Read the three blocks in order—*${who}* + *${verb}* + *${rest}*—with a capital letter at the start and a period at the end.`,
    `英语句子先说谁或什么（*${who}*），再说动词（*${verb}*），最后是其余部分（*${rest}*）：${right}\n\n**检验。** 按“主语（*${who}*）+ 动词（*${verb}*）+ 其余部分（*${rest}*）”三段顺读一遍，并确认句首大写、句末有句号。`,
  );
};

/** whyNotOrder explains a wrong order by where the verb must stand. */
const whyNotOrder = (_wrong: string, _right: string, _shown: string, position: number): Text =>
  position === 0
    ? t(
        "This puts the verb at the end of the sentence; in English the verb comes right after who or what the sentence is about.",
        "这句把动词放到了句末；英语里动词要紧跟在主语（谁或什么）后面。",
      )
    : t(
        "This swaps the first two words, breaking the subject-then-verb order of an English statement.",
        "这句把前两个词颠倒了，破坏了英语陈述句“先主语、后动词”的语序。",
      );

const wordsInOrder: TopicDef = {
  id: "writing-words-in-order",
  title: t("Words in Order", "把词排成句子"),
  summary: t(
    "Put words in the order of an English sentence: who, then the verb, then the rest.",
    "按英语句子的顺序排列词：先说谁，再说动词，最后是其余部分。",
  ),
  intro: t(
    "Take the jumbled words *is / bag / red / her* and arrange them: *Her bag is red.* Every English statement follows one dependable track—who or what first, then the verb, then the rest. In this topic, you pick and write sentences in natural English word order.",
    "把打乱的词 *is / bag / red / her* 排成句子：*Her bag is red.* 英语陈述句遵循一条稳定的主线——先说谁或什么，再接动词，最后接其余部分。本主题带你选出并写出语序自然的英语句子。",
  ),
  prerequisites: ["writing-capitals-and-periods"],
  encompasses: [{ topic: "writing-capitals-and-periods", weight: 0.3 }],
  xp: 15,
  strand: "writing",
  knowledgePoints: [
    point(
      "choose",
      t("Choosing the right order", "选出正确的语序"),
      t(
        "An English sentence goes: who or what, then the verb, then the rest.\n\n*My sister* (who) *has* (verb) *a cat* (the rest).\n*The book* (what) *is* (verb) *on the desk* (the rest).\n\n> **Watch out.** Find the verb (*am*, *is*, *are*, *have*, *has*) first—it sits right after the subject, never at the very end of the sentence.",
        "英语句子的顺序是：先说谁或什么，再说动词，最后是其余部分。\n\n*My sister*（谁）*has*（动词）*a cat*（其余）。\n*The book*（什么）*is*（动词）*on the desk*（其余）。\n\n不要把动词放在最后，也不要漏掉 *is*。\n\n> **注意。** 先找出动词（*am*、*is*、*are*、*have*、*has*）——它必须紧跟在主语后面，绝不能放到句末。",
      ),
      choiceGenerator(
        t("Which sentence puts these words in the right order?", "哪个句子把这些词排对了？"),
        orderChoiceBank,
        orderWhy,
        whyNotOrder,
      ),
    ),
    point(
      "write",
      t("Writing the sentence", "写出句子"),
      t(
        "Put the words in order and write the sentence: *is / Ben / name / his* → *His name is Ben.* Start with a capital letter and end with a period.\n\n> **Watch out.** Count that you used every given word exactly once, put the verb right after the subject, and add a capital letter at the start and a period at the end.",
        "把词排好顺序，写出句子：*is / Ben / name / his* → *His name is Ben.* 句首大写，句末加句号。\n\n> **注意。** 数一数给出的每个词是否都恰好用了一次，动词是否紧跟主语，并记得句首大写、句末加句号。",
      ),
      typedGenerator("sentence", t("Put the words in order and write the sentence.", "把词排好顺序，写出句子。"), orderTypedBank, orderWhy),
    ),
  ],
};

/** topics are the topics of the unit My Classroom. */
export const topics: readonly TopicDef[] = [
  classroom.topic,
  thisAndThat.topic,
  classroomActions.topic,
  thisThatTheseThose,
  inOnAndUnder,
  imperatives,
  wordsInOrder,
];

/** vocabulary are the words the unit My Classroom teaches. */
export const vocabulary: readonly WordBatch[] = [classroom.batch, thisAndThat.batch, classroomActions.batch];
