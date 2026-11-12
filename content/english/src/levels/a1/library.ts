// A1, unit 9: The Library. Library words and books, me, him, her and them, a and the, and short notes judged by a
// model.

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
import { everyPair, interleave, vocabularyTopic, word } from "../words.ts";

const library = vocabularyTopic({
  id: "a1-words-library",
  title: t("The Library", "图书馆"),
  summary: t(
    "Borrowing and returning books, shelves, library cards, due dates, stories and the librarian.",
    "借书和还书、书架、借书证、到期日、故事和图书管理员。",
  ),
  prerequisites: ["a1-words-schoolwork"],
  words: [
    word(
      "library libraries",
      "a place with many books that you can read or borrow",
      "图书馆",
      "I borrow books from the {library}.|shelf card | The school {library} has ten thousand books.|shelf story | Be quiet in the {library}, please.|shelf card",
      "shelf story",
    ),
    word(
      "borrow borrows borrowed borrowing",
      "to take something for a time and then give it back",
      "借（入）",
      "Can I {borrow} your pen? I'll give it back after class.|return find | I {borrowed} three books from the library.|returned found | You can {borrow} a book for two weeks.|return need",
      "return find",
    ),
    word(
      "return returns returned returning",
      "to give something back; to go back",
      "归还；返回",
      "Please {return} the book by Friday.|borrow find | I {returned} my library books today.|borrowed found | We {return} home at six.|borrow need",
      "borrow find",
    ),
    word(
      "shelf shelves",
      "a flat board on a wall or in a cupboard for putting things on",
      "架子；书架",
      "Put the book back on the {shelf}.|card story | The comics are on the top {shelf}.|card librarian | There are five {shelves} in my bookcase.|cards stories",
      "card story",
    ),
    word(
      "card cards",
      "a small piece of stiff paper; you need a library one to borrow books",
      "卡片；借书证",
      "You need a library {card} to borrow books.|shelf story | I made a birthday {card} for Mom.|shelf librarian | Let's play a {card} game.|shelf story",
      "shelf story",
    ),
    word(
      "due",
      "expected or needed by a certain time",
      "到期的",
      "This book is {due} back on May 5th.|quiet back | When is the homework {due}? — On Monday.|quiet back | My library books are {due} tomorrow.|quiet back",
      "quiet back",
    ),
    word(
      "story stories",
      "words that tell what happened to someone, true or made up",
      "故事",
      "Grandpa tells me a {story} every night.|shelf card | This {story} is about a brave little mouse.|shelf card | I like funny {stories}.|shelves cards",
      "shelf card",
    ),
    word(
      "librarian librarians",
      "a person who works in a library",
      "图书管理员",
      "Ask the {librarian}. She knows where every book is.|shelf story | The {librarian} stamps the date in my book.|shelf card | Our school {librarian} reads stories to us.|shelf card",
      "shelf student",
    ),
    word(
      "quiet quieter quietest",
      "making little or no noise",
      "安静的",
      "Please be {quiet}. The baby is sleeping.|due back | The library is a {quiet} place.|due back | The classroom is very {quiet} during the test.|due back",
      "due back",
    ),
    word(
      "find finds found finding",
      "to see or get something you were looking for",
      "找到",
      "I can't {find} my library card. Where is it?|borrow need | She {found} her keys under the sofa.|borrowed needed | Can you help me {find} a book about cats?|borrow return",
      "borrow need",
    ),
    word(
      "need needs needed needing",
      "to have to have something",
      "需要",
      "I {need} a pencil. Can I borrow one?|find return | Plants {need} water to grow.|find borrow | Do you {need} help?|find return",
      "find return",
    ),
    word(
      "back",
      "to the place where something was before; the part behind",
      "回到原处；后面",
      "Put the book {back} on the shelf.|due quiet | I'll be {back} in five minutes.|due quiet | The cat is sleeping at the {back} of the room.|due quiet",
      "due quiet",
    ),
  ],
});

const books = vocabularyTopic({
  id: "a1-words-books",
  title: t("Books", "书"),
  summary: t(
    "Comics, dictionaries, titles and projects; bringing, taking and giving; must and when.",
    "漫画、词典、书名和课题；带来、拿走和给；must 和 when。",
  ),
  prerequisites: ["a1-words-library"],
  words: [
    word(
      "comic comics",
      "a magazine or book of stories told in pictures",
      "漫画",
      "I read {comics} about superheroes.|dictionaries titles | This {comic} has funny pictures.|dictionary title | My brother draws his own {comics}.|dictionaries projects",
      "dictionary title",
    ),
    word(
      "dictionary dictionaries",
      "a book that tells you what words mean",
      "词典",
      "I don't know this word. Let's look in the {dictionary}.|comic title | An English-Chinese {dictionary} is very useful.|comic title | There are many {dictionaries} in the library.|comics titles",
      "comic title",
    ),
    word(
      "title titles",
      "the name of a book, a movie or a song",
      "标题；书名",
      'The {title} of the book is "The Lost Cat".|project comic | What\'s the {title} of your story?|project comic | Write the {title} at the top of the page.|project comic',
      "project comic",
    ),
    word(
      "about",
      "on the subject of",
      "关于",
      "This book is {about} dinosaurs.|when must | What is the movie {about}?|when must | Tell me {about} your family.|when must",
      "when must",
    ),
    word(
      "project projects",
      "a piece of school work that you do over some time",
      "项目；课题",
      "Our class {project} is about the sea.|title comic | I need books for my science {project}.|title comic | We made a poster for our art {project}.|title dictionary",
      "title comic",
    ),
    word(
      "bring brings brought bringing",
      "to come with something",
      "带来",
      "Please {bring} your library card tomorrow.|take give | Can I {bring} a friend to your party?|take give | She {brought} a cake to school.|took gave",
      "take give",
    ),
    word(
      "take takes took taken taking",
      "to carry something with you to another place; to get and hold",
      "拿走；带走",
      "Don't forget to {take} your umbrella.|bring give | I {take} the bus to school.|bring give | Who {took} my pencil?|brought gave",
      "bring give",
    ),
    word(
      "give gives gave given giving",
      "to let someone have something",
      "给",
      "Please {give} me the book.|take bring | I {gave} Mom flowers for her birthday.|took brought | {Give} the ball to your sister.|Take Bring",
      "take bring",
    ),
    word(
      "must",
      "used to say that something is necessary",
      "必须",
      "You {must} return the book by Friday.|when about | We {must} be quiet in the library.|when about | You {must} wear a helmet on your bike.|when about",
      "when about",
    ),
    word(
      "when",
      "at what time; at the time that",
      "什么时候；当……时",
      "{When} is the book due? — Next Monday.|About Must | I read {when} I'm in bed.|about must | {When} I was little, I loved comics.|About Must",
      "about must",
    ),
  ],
});

// Me, him, her and them.

/** objectForms are a subject pronoun, its object form and the wrong forms a learner writes. */
const objectForms: readonly (readonly [subject: string, object: string, wrong: readonly string[]])[] = [
  ["I", "me", ["I", "my"]],
  ["he", "him", ["he", "his"]],
  ["she", "her", ["she", "hers"]],
  ["we", "us", ["we", "our"]],
  ["they", "them", ["they", "their"]],
];

const objectFrames: readonly string[] = [
  "Can you help ___?",
  "Give the book to ___.",
  "Grandma is waiting for ___.",
  "My dog loves ___.",
  "Please call ___ after school.",
  "Come to the library with ___.",
  "Tom sits next to ___.",
  "Look at ___!",
  "Mom made a cake for ___.",
  "Dad is looking for ___.",
  "Can you see ___?",
  "The teacher asks ___ a question.",
  "Lily writes to ___ every week.",
  "The cat follows ___ home.",
  "Our friends play with ___.",
  "The bus waits for ___.",
  "Anna smiles at ___.",
  "Please tell ___ the answer.",
  "Sit with ___ at lunch.",
  "Read the story to ___.",
];

const objectItems = () =>
  everyPair(objectForms, objectFrames).map(([[subject, object, wrong], frame]) => ({ shown: `${frame} (${subject})`, object, wrong }));

const objectChoiceBank: readonly ChoiceItem[] = objectItems().map(({ shown, object, wrong }): ChoiceItem => [shown, object, wrong]);

/** namedPeople are people and the pronouns that replace them after a verb. */
const namedPeople: readonly (readonly [noun: string, object: string, wrong: string])[] = [
  ["Tom", "him", "he"],
  ["Anna", "her", "she"],
  ["my parents", "them", "they"],
  ["my brother", "him", "he"],
  ["Grandma", "her", "she"],
  ["the children", "them", "they"],
  ["Ben and me", "us", "we"],
];

/** namedThings are things, which them replaces. */
const namedThings: readonly (readonly [noun: string, object: string, wrong: string])[] = [
  ["the books", "them", "they"],
  ["the flowers", "them", "they"],
  ["the photos", "them", "they"],
];

/** replaceFrames fit any person; thingFrames fit any thing. */
const replaceFrames: readonly string[] = [
  "Lily sees {x} every day.",
  "Can you help {x}?",
  "The teacher waits for {x} after school.",
  "Give the cake to {x}.",
  "Mom calls {x} at night.",
  "I often visit {x}.",
  "We play with {x} after school.",
  "Dad drives {x} to the station.",
  "Please ask {x}.",
  "I like {x} a lot.",
  "The dog follows {x}.",
  "Sit next to {x}.",
  "Write a letter to {x}.",
];
const thingFrames: readonly string[] = ["I like {x} a lot.", "Put {x} on the desk.", "Can you find {x}?", "Look at {x}!", "Take {x} home."];

const replaceBank: readonly TypedItem[] = interleave([everyPair(namedPeople, replaceFrames), everyPair(namedThings, thingFrames)]).map(
  ([[noun, object, wrong], frame]): TypedItem => ({
    shown: `${frame.replace("{x}", noun)} (${noun})`,
    accepted: [frame.replace("{x}", object)],
    wrong: [frame.replace("{x}", wrong), frame.replace("{x}", noun)],
    instruction: t(
      "Write the sentence again with a word like him, her or them in place of the words in brackets.",
      "重写句子，用 him、her、them 这样的词代替括号里的词。",
    ),
  }),
);

const objectWhy = (right: string, shown: string) => {
  const sentence = shown.replace(/ \(.*\)$/u, "").replace("___", `*${right}*`);
  const subject = shown.match(/\((.*)\)$/u)?.[1] ?? "";
  return t(
    `The gap comes after a verb or a word like *to* or *with*, so *${subject}* becomes *${right}*: ${sentence}`,
    `空白在动词或 *to*、*with* 这样的词后面，所以 *${subject}* 要变成宾格 *${right}*：${sentence}`,
  );
};

/** whyNotObject says what a wrong pronoun shows the learner misread, by the order the forms list it. */
const whyNotObject = (wrong: string, _right: string, _shown: string, position: number): Text =>
  position === 0
    ? t(
        `*${wrong}* is the form that comes before a verb; after a verb or a word like *to*, it changes.`,
        `*${wrong}* 是放在动词前的主格；在动词或 *to* 这样的词后面要变形。`,
      )
    : t(
        `*${wrong}* says whose something is, but the gap here is the person, not an owner.`,
        `*${wrong}* 表示“……的”，可这里的空白指的是人本身，而不是谁的东西。`,
      );

/** objectFor says whom each object pronoun stands for, in every locale. */
const objectFor: Record<string, Text> = {
  him: t("one man or boy", "一个男性"),
  her: t("one woman or girl", "一个女性"),
  them: t("more than one person or thing", "多个人或物"),
  us: t("you and others", "包括自己在内的几个人"),
};

const objectPronouns: TopicDef = {
  id: "object-pronouns",
  title: t("Me, Him, Her and Them", "me、him、her 和 them"),
  summary: t(
    "Can you help me? I like her. Give them to us. After a verb or a word like to and with, I becomes me, he becomes him and they becomes them.",
    "Can you help me? I like her. Give them to us. 在动词或 to、with 这样的词后面，I 变成 me，he 变成 him，they 变成 them。",
  ),
  prerequisites: ["my-your-his-her", "a1-words-books"],
  encompasses: [
    { topic: "my-your-his-her", weight: 0.3 },
    { topic: "a1-words-books", weight: 0.2 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("I or me, he or him", "I 还是 me，he 还是 him"),
      t(
        "Before a verb: *I, he, she, we, they*. After a verb or after *to, with, for, at, next to*: *me, him, her, us, them*.\n\n*I* like *her*. *She* likes *me*. *Give the book to him.*",
        "动词前用主格：*I、he、she、we、they*。动词后或 *to、with、for、at、next to* 后用宾格：*me、him、her、us、them*。\n\n*I* like *her*. *She* likes *me*. *Give the book to him.*\n\n中文“我”“他”放在哪里都不变，英语却要变形；也不要和 *my、his、our* 这些表示“……的”的词混淆。",
      ),
      choiceGenerator(t("Choose the word for the gap.", "选出填入空白处的词。"), objectChoiceBank, objectWhy, whyNotObject),
    ),
    point(
      "replace",
      t("A pronoun in place of a name", "用代词代替名字"),
      t(
        "Once we know who it is, we use a pronoun: *I see Tom every day.* → *I see him every day.* One man or boy: *him*. One woman or girl: *her*. More than one person or thing: *them*. You and others: *us*.",
        "知道说的是谁以后，就用代词：*I see Tom every day.* → *I see him every day.* 一个男性：*him*。一个女性：*her*。多个人或物：*them*。包括自己在内的几个人：*us*。",
      ),
      typedGenerator("sentence", t("Use a pronoun.", "使用代词。"), replaceBank, (right, shown) => {
        const noun = shown.match(/\((.*)\)$/u)?.[1] ?? "";
        const object = [...namedPeople, ...namedThings].find(([n]) => n === noun)?.[1] ?? "";
        return t(
          `*${noun}* is ${objectFor[object]?.en}, and after a verb or a word like *to* that is *${object}*: ${right}`,
          `*${noun}* 指${objectFor[object]?.["zh-CN"]}，在动词或 *to* 这样的词后面用 *${object}*：${right}`,
        );
      }),
    ),
  ],
};

// A and the.

const articleNouns: readonly string[] = [
  "book",
  "cat",
  "comic",
  "apple",
  "dictionary",
  "umbrella",
  "bag",
  "egg",
  "story",
  "letter",
  "old map",
];
const firstFrames: readonly string[] = [
  "I have ___ {n}.",
  "There is ___ {n} on the table.",
  "Can I borrow ___ {n}?",
  "Here is ___ {n}.",
  "I see ___ {n} in the box.",
  "Anna has ___ {n} in her bag.",
];
const describe: readonly string[] = ["new", "old", "very nice", "mine", "Tom's"];

const an = (noun: string) => (/^[aeiou]/u.test(noun) ? "an" : "a");

/** rotated starts a list at the given place, so two banks open on different sentences. */
const rotated = <T>(items: readonly T[], from: number): readonly T[] => [...items.slice(from), ...items.slice(0, from)];

const firstItems = (from: number) =>
  rotated(everyPair(articleNouns, firstFrames), from).map(([noun, frame]) => ({
    shown: frame.replace("{n}", noun),
    right: an(noun),
    wrong: [an(noun) === "a" ? "an" : "a", "the"],
  }));

const secondItems = (from: number) =>
  rotated(everyPair(articleNouns, describe), from).map(([noun, adjective]) => ({
    shown: `There is ${an(noun)} ${noun} on the desk. ___ ${noun} is ${adjective}.`,
    right: "The",
    wrong: ["A", "An"],
  }));

/** onlyOnes are sentences where the reader knows which one: the only one, the first or best, or one named by more words. */
const onlyOnes: readonly string[] = [
  "___ sun is very hot today.",
  "Look at ___ moon! It's so big tonight.",
  "___ sky is blue and clear.",
  "___ first day of the week is Monday.",
  "Who is ___ best student in your class?",
  "What is ___ title of this book?",
  "Here is ___ book you wanted.",
  "Who is ___ girl next to Tom?",
  "I read in bed in ___ evening.",
  "My sister plays ___ piano.",
  "We are in ___ same class.",
  "What is ___ name of your school?",
  "What's ___ date today?",
  "Z is ___ last letter of the alphabet.",
  "I do my homework in ___ afternoon.",
  "He plays ___ guitar in a band.",
  "Who is ___ tallest boy in the class?",
  "This is ___ last page of the story.",
  "What's ___ price of this comic?",
  "___ second question is difficult.",
  "I get up early in ___ morning.",
  "Where is ___ bag you bought yesterday?",
  "Mars is ___ fourth planet from the sun.",
  "What's ___ answer to question three?",
  "Monday is ___ day after Sunday.",
  "Who wrote ___ story we read in class?",
];

const onlyItems = (from: number, count: number) =>
  onlyOnes.slice(from, from + count).map((shown) => {
    const start = shown.startsWith("___");
    return { shown, right: start ? "The" : "the", wrong: start ? ["A", "An"] : ["a", "an"] };
  });

const articleChoiceBank: readonly ChoiceItem[] = interleave([firstItems(0), secondItems(0), onlyItems(0, 13)]).map(
  ({ shown, right, wrong }): ChoiceItem => [shown, right, wrong],
);

const articleTypedBank: readonly TypedItem[] = interleave([firstItems(30), secondItems(25), onlyItems(13, 13)]).map(
  ({ shown, right, wrong }): TypedItem => ({ shown, accepted: [right], wrong }),
);

/** articleNoun finds the noun after the gap of a sentence. */
const articleNoun = (shown: string) => (shown.split("___ ")[1] ?? "").split(/[ .?!]/u)[0] ?? "";

const articleWhy = (right: string, shown: string) => {
  const sentence = shown.replace("___", `*${right}*`);
  const noun = articleNoun(shown);
  const reason =
    right.toLowerCase() !== "the"
      ? t(
          `This is the first time the ${noun} comes up, one of many, so it takes *a* or *an*, and *${noun}* starts with a ${right === "an" ? "vowel" : "consonant"} sound`,
          `这是第一次提到 ${noun}，是许多中的一个，所以用 *a* 或 *an*；*${noun}* 以${right === "an" ? "元音" : "辅音"}开头`,
        )
      : shown.startsWith("There is")
        ? t(
            `The sentence before already named the ${noun}, so now we both know which one and it takes *the*`,
            `前一句已经提到了 ${noun}，双方都知道是哪一个，所以用 *the*`,
          )
        : t(
            "There is only one, or the words around it say which one, so it takes *the*",
            "这样东西独一无二，或者前后的词说明了是哪一个，所以用 *the*",
          );
  return t(`${reason.en}: ${sentence}`, `${reason["zh-CN"]}：${sentence}`);
};

/** whyNotArticle says what a wrong article shows the learner misread. */
const whyNotArticle = (wrong: string, right: string, shown: string): Text => {
  if (wrong.toLowerCase() === "the")
    return t(
      "*the* is for the one we both know, but this is the first time it comes up.",
      "*the* 用于双方都知道的那一个，可这是第一次提到它。",
    );
  if (right.toLowerCase() !== "the")
    return t(
      `*${wrong}* is the wrong one of the pair: *${articleNoun(shown)}* starts with a ${right === "an" ? "vowel" : "consonant"} sound.`,
      `*${wrong}* 用错了：*${articleNoun(shown)}* 以${right === "an" ? "元音" : "辅音"}开头。`,
    );
  return shown.startsWith("There is")
    ? t(
        `*${wrong}* would mean some other one, but the sentence before already named it.`,
        `*${wrong}* 表示另外的某一个，可前一句已经提到了它。`,
      )
    : t(
        `*${wrong}* is for one of many, but here there is only one, or the words say which one.`,
        `*${wrong}* 用于许多中的一个，可这里只有一个，或者前后的词已经说明了是哪一个。`,
      );
};

const theArticleThe: TopicDef = {
  id: "the-article-the",
  title: t("A and The", "a 和 the"),
  summary: t(
    "I have a book. The book is about cats. A is for one of many, the for the one we both know.",
    "I have a book. The book is about cats. a 指许多中的一个，the 指双方都知道的那一个。",
  ),
  prerequisites: ["a-and-an", "a1-words-library"],
  encompasses: [
    { topic: "a-and-an", weight: 0.4 },
    { topic: "a1-words-library", weight: 0.2 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("A or the", "a 还是 the"),
      t(
        "*a* or *an*: one of many, the first time you say it. *I have a book.*\n\n*the*: the one we both know. It is the second time you say it (*The book is about cats*), there is only one (*the sun*), or the words around it say which one (*the first day*, *the title of this book*, *the book you wanted*). Also *in the morning*, *play the piano*.",
        "*a* 或 *an*：许多中的一个，第一次提到时用。*I have a book.*\n\n*the*：说话双方都知道的那一个。第二次提到时用（*The book is about cats*）；独一无二的东西用（*the sun*）；前后的词说明了是哪一个时用（*the first day*、*the title of this book*、*the book you wanted*）。还有 *in the morning*、*play the piano*。\n\n中文没有冠词，“书”可以指任何书，也可以指那本书；英语必须用 *a* 或 *the* 表明是哪一种。",
      ),
      choiceGenerator(t("Choose the word for the gap.", "选出填入空白处的词。"), articleChoiceBank, articleWhy, whyNotArticle),
    ),
    point(
      "type",
      t("Writing a, an or the", "写出 a、an 或 the"),
      t(
        "Type *a*, *an* or *the*. Ask: is it one of many, said for the first time, or the one we both know?",
        "输入 *a*、*an* 或 *the*。想一想：是第一次提到的许多中的一个，还是双方都知道的那一个？",
      ),
      typedGenerator("word-form", t("Type the word for the gap.", "输入填入空白处的词。"), articleTypedBank, articleWhy),
    ),
  ],
};

// Writing a short note.

const criterion = (id: string): CriterionSpec => {
  const found = criterionById(id);
  if (!found) throw new Error(`unknown criterion ${id}`);
  return found;
};

const oneNote = (model: string) =>
  t(`One good note:\n\n> ${model.replace(/\n/gu, "\n> ")}`, `一张好的便条：\n\n> ${model.replace(/\n/gu, "\n> ")}`);

/** tellBank asks for a note that tells someone where you are or what you are doing. */
const tellBank: readonly WritingItem[] = [
  {
    task: "You are at the library after school. Write a note to your mom. Say where you are and when you will be home.",
    model: "Dear Mom,\nI'm at the library with Lily. We are doing our science project. I will be home at six o'clock.\nLove, Anna",
  },
  {
    task: "You went to the park to play football. Write a note to your dad. Say where you are and who you are with.",
    model: "Hi Dad,\nI'm at the park with Tom and Ben. We are playing football. I'll come home before dinner.\nSam",
  },
  {
    task: "You are at your friend's house. Write a note to your brother. Say where you are and ask him to feed the cat.",
    model: "Hi Leo,\nI'm at Mia's house. We are making a cake for her mom. Can you feed the cat at five, please?\nThanks, Kate",
  },
  {
    task: "You took the dog for a walk. Write a note to your grandma. Say where you are and when you will be back.",
    model:
      "Dear Grandma,\nI'm walking the dog in the park. It's sunny today, so we are taking a long walk. We will be back at four.\nLove, Ben",
  },
  {
    task: "You are at a piano lesson. Write a note to your sister. Say where you are and when the lesson ends.",
    model: "Hi Amy,\nI'm at my piano lesson. It ends at half past five. Then I will come home and help you with your homework.\nLucy",
  },
  {
    task: "You went shopping with your aunt. Write a note to your dad. Say where you are and what you are buying.",
    model: "Dear Dad,\nI'm at the shops with Aunt Rose. We are buying new shoes for school. We will be home for dinner.\nLove, Max",
  },
  {
    task: "You are at the swimming pool with your class. Write a note to your mom. Say where you are and what you need.",
    model:
      "Dear Mom,\nI'm at the swimming pool with my class. I forgot my towel. Can you bring it to the pool before four, please?\nLove, Jack",
  },
  {
    task: "You are visiting your grandpa. Write a note to your friend. Say where you are and that you can't play today.",
    model:
      "Hi Tom,\nI'm at my grandpa's house today. He is sick, so I'm helping him. I can't play football today, but I can play on Sunday.\nBen",
  },
  {
    task: "You are at the school club. Write a note to your mom. Say which club you are in and when you will be home.",
    model: "Dear Mom,\nI'm at the chess club after school. We have a big game today! I will be home at five thirty.\nLove, Mia",
  },
  {
    task: "You are at the doctor's with your dad. Write a note to your teacher. Say where you are and that you will be late.",
    model:
      "Dear Ms. Green,\nI'm at the doctor's with my dad this morning. I will be late for school. I will come at eleven o'clock.\nThank you, Leo",
  },
  {
    task: "You went to the shop to buy bread. Write a note to your sister. Say where you are and ask her to wait for you.",
    model: "Hi Emma,\nI'm at the shop. I'm buying bread and milk for breakfast. Please wait for me. I'll be back in ten minutes.\nNora",
  },
  {
    task: "You are at a friend's birthday party. Write a note to your parents. Say where you are and how you will get home.",
    model: "Dear Mom and Dad,\nI'm at Lily's birthday party. It's a lot of fun! Lily's dad will drive me home at seven.\nLove, Anna",
  },
];

/** askBank asks for a note that asks for something or thanks someone. */
const askBank: readonly WritingItem[] = [
  {
    task: "Your friend gave you a book for your birthday. Write a note to thank her and say what you like about it.",
    model:
      "Dear Lily,\nThank you for the book! I love stories about animals, and this one is very funny. I read it every night.\nLove, Anna",
  },
  {
    task: "You want to borrow your friend's dictionary for your English homework. Write a note to ask for it.",
    model:
      "Hi Tom,\nCan I borrow your dictionary, please? I need it for my English homework. I will give it back to you on Friday.\nThanks, Ben",
  },
  {
    task: "Your neighbor fed your cat when you were away. Write a note to thank him.",
    model:
      "Dear Mr. Brown,\nThank you for feeding our cat last week. She is very happy and healthy. Here are some cookies for you.\nThe Lee family",
  },
  {
    task: "You need help with your math homework. Write a note to your older brother to ask him.",
    model:
      "Hi Leo,\nCan you help me with my math homework tonight? The questions on page ten are very difficult. I will wash the dishes for you!\nSam",
  },
  {
    task: "Your teacher helped you after class. Write a note to thank her.",
    model: "Dear Ms. Green,\nThank you for helping me after class. Now I understand the present simple. The test was easy!\nFrom Mia",
  },
  {
    task: "You want your friend to bring his football to school tomorrow. Write a note to ask him.",
    model: "Hi Ben,\nCan you bring your football to school tomorrow, please? We can play after lunch. My ball is broken.\nTom",
  },
  {
    task: "Your grandma made you a hat. Write a note to thank her and say when you wear it.",
    model:
      "Dear Grandma,\nThank you for the beautiful hat. Blue is my favorite color! I wear it every day when I walk to school.\nLove, Emma",
  },
  {
    task: "You want to use your sister's computer for your project. Write a note to ask her.",
    model:
      "Hi Amy,\nCan I use your computer this afternoon, please? I need it for my history project. I will be careful with it.\nThanks, Jack",
  },
  {
    task: "Your friend's mom drove you home after a party. Write a note to thank her.",
    model:
      "Dear Mrs. Park,\nThank you for driving me home after the party. It was very kind of you. I had a lot of fun with Jun.\nFrom Lucy",
  },
  {
    task: "You want the librarian to keep a book for you until Monday. Write a note to ask her.",
    model:
      'Dear Ms. White,\nCan you keep the book "The Lost Cat" for me, please? I don\'t have my library card today. I will come on Monday.\nThank you, Max',
  },
  {
    task: "Your classmate lent you a pencil when you forgot yours. Write a note to thank him.",
    model: "Hi Ben,\nThank you for the pencil this morning. I forgot my pencil case at home. Here it is. You are a good friend!\nNora",
  },
  {
    task: "You want your dad to buy milk on his way home. Write a note to ask him.",
    model:
      "Dear Dad,\nCan you buy some milk on your way home, please? There isn't any milk in the kitchen. We need it for breakfast.\nLove, Kate",
  },
];

const noteCriteria = ["a1-note-purpose", "a1-reader-and-name", "a1-sentences"];

const writingAShortNote: TopicDef = {
  id: "writing-a-short-note",
  title: t("Writing a Short Note", "写便条"),
  summary: t(
    "Write a note of two to four sentences for a reason the task gives: to say where you are, to ask for something, or to thank someone.",
    "根据任务写一张两到四句话的便条：说你在哪里、请人帮忙或者向人道谢。",
  ),
  prerequisites: ["joining-with-and-but-or", "writing-capital-letters-for-names", "object-pronouns"],
  encompasses: [
    { topic: "joining-with-and-but-or", weight: 0.2 },
    { topic: "writing-capital-letters-for-names", weight: 0.2 },
  ],
  xp: 25,
  strand: "writing",
  criteria: noteCriteria.map(criterion),
  knowledgePoints: [
    point(
      "telling",
      t("A note that tells", "告知的便条"),
      t(
        "A note starts with the reader's name (*Dear Mom,* or *Hi Tom,*), says what the reader needs to know in two to four short sentences, and ends with your name.\n\nTo say where you are: *I'm at the library with Lily.* What you are doing: *We are doing our project.* When you'll be back: *I will be home at six o'clock.*",
        "便条以收信人的称呼开头（*Dear Mom,* 或 *Hi Tom,*），用两到四个短句说清对方需要知道的事，最后写上自己的名字。\n\n说你在哪里：*I'm at the library with Lily.* 在做什么：*We are doing our project.* 什么时候回来：*I will be home at six o'clock.*",
      ),
      writingGenerator(
        t(
          "Write a short note in English: two to four sentences, with the reader's name at the start and your name at the end.",
          "用英语写一张便条：两到四句话，开头写收信人的称呼，结尾写你的名字。",
        ),
        tellBank,
        noteCriteria,
        { minWords: 15, maxChars: 500 },
        oneNote,
      ),
    ),
    point(
      "asking-and-thanking",
      t("A note that asks or thanks", "请求或感谢的便条"),
      t(
        "To ask, use *Can you...?* or *Can I...?* and *please*, and say why: *Can I borrow your dictionary, please? I need it for my homework.*\n\nTo thank, say what for and add one more sentence: *Thank you for the book! I love stories about animals.*",
        "请求时用 *Can you...?* 或 *Can I...?* 加 *please*，并说明原因：*Can I borrow your dictionary, please? I need it for my homework.*\n\n感谢时说明为什么感谢，再多写一句：*Thank you for the book! I love stories about animals.*",
      ),
      writingGenerator(
        t(
          "Write a short note in English: two to four sentences, with the reader's name at the start and your name at the end.",
          "用英语写一张便条：两到四句话，开头写收信人的称呼，结尾写你的名字。",
        ),
        askBank,
        noteCriteria,
        { minWords: 15, maxChars: 500 },
        oneNote,
      ),
    ),
  ],
};

/** topics are the topics of the unit The Library. */
export const topics: readonly TopicDef[] = [library.topic, books.topic, objectPronouns, theArticleThe, writingAShortNote];

/** vocabulary are the words the unit The Library teaches. */
export const vocabulary: readonly WordBatch[] = [library.batch, books.batch];
