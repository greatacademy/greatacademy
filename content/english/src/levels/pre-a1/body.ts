// Pre-A1, unit 6: My Body. The body, describing words before nouns, and sentences about yourself.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { pairUp, vocabularyTopic, word } from "../words.ts";

const body = vocabularyTopic({
  id: "pre-a1-words-body",
  title: t("The Body", "身体"),
  summary: t("The parts of the body.", "身体的各个部位。"),
  prerequisites: [],
  words: [
    word(
      "body bodies",
      "all of a person or an animal: the head, the arms, the legs and the rest",
      "身体",
      "Running is good for your {body}.|hair nose | A snake has a long {body} and no legs.|hand arm | Our {bodies} need food, water and sleep.|noses ears",
      "hair nose",
    ),
    word(
      "head heads",
      "the top part of the body, with the eyes, the ears and the mouth",
      "头",
      "I wear a hat on my {head}.|foot hand | Nod your {head} to say yes.|foot hand | A giraffe has a small {head} on a long neck.|foot hand",
      "foot hand",
    ),
    word(
      "face faces",
      "the front of the head",
      "脸",
      "She has a happy {face}. She is smiling.|foot arm | Draw a {face} with two eyes, a nose and a mouth.|foot leg | He covers his {face} with his hands.|feet legs",
      "foot arm",
    ),
    word(
      "eye eyes",
      "the part of the face you see with",
      "眼睛",
      "I see with my {eyes}.|ears hands | Close your {eyes} and go to sleep.|ears hands | She has big blue {eyes}.|ears noses",
      "ear hand",
    ),
    word(
      "ear ears",
      "the part of the head you hear with",
      "耳朵",
      "I hear with my {ears}.|eyes hands | A rabbit has long {ears}.|eyes mouths | Put your hands over your {ears}. It's loud!|eyes feet",
      "eye hand",
    ),
    word(
      "nose noses",
      "the part of the face you smell with",
      "鼻子",
      "I smell with my {nose}.|ear hand | An elephant has a very long {nose}.|ear foot | Blow your {nose}. Here is a tissue.|ear eye",
      "ear hand",
    ),
    word(
      "mouth mouths",
      "the part of the face you eat and talk with",
      "嘴",
      "I eat with my {mouth}.|nose ear | Open your {mouth} and say ah.|nose ear | Don't talk with food in your {mouth}.|nose hand",
      "nose ear",
    ),
    word(
      "hand hands",
      "the part at the end of your arm, with five fingers",
      "手",
      "I write with my right {hand}.|foot leg | Wash your {hands} before you eat.|feet legs | Put up your {hand} to ask a question.|foot nose",
      "foot leg",
    ),
    word(
      "arm arms",
      "the long part of the body between the shoulder and the hand",
      "手臂；胳膊",
      "I hold the baby in my {arms}.|legs feet | A bird has wings, not {arms}.|ears eyes | My {arm} is broken, so I can't write.|leg foot",
      "leg foot",
    ),
    word(
      "leg legs",
      "the long part of the body you stand and walk on",
      "腿",
      "A dog has four {legs}.|arms hands | A spider has eight {legs}.|arms hands | My {legs} are tired. I walked a long way.|arms hands",
      "arm hand",
    ),
    word(
      "foot feet",
      "the part at the end of your leg that you stand on",
      "脚",
      "I wear shoes on my {feet}.|hands arms | I kick the ball with my {foot}.|hand arm | Ouch! You are standing on my {foot}!|hand head",
      "hand arm",
    ),
    word(
      "hair",
      "what grows on your head",
      "头发",
      "My sister has long black {hair}.|eyes arms | Brush your {hair} in the morning.|ears eyes | Grandpa has white {hair}.|eyes hands",
      "eye arm",
    ),
  ],
});

// Describing words before nouns.

/** owners have the described things. */
const describers: readonly (readonly [owner: string, verb: string])[] = [
  ["She", "has"],
  ["I", "have"],
  ["The cat", "has"],
  ["My dog", "has"],
  ["Tom", "has"],
  ["The baby", "has"],
  ["My grandpa", "has"],
];

/** described are a count or article, a describing word and a noun. */
const described: readonly (readonly [count: string, adjective: string, noun: string])[] = [
  ["", "long", "hair"],
  ["two", "big", "eyes"],
  ["a", "small", "nose"],
  ["two", "blue", "eyes"],
  ["", "black", "hair"],
  ["four", "long", "legs"],
  ["two", "small", "ears"],
  ["", "big", "feet"],
  ["a", "red", "bag"],
  ["", "white", "hair"],
  ["two", "green", "eyes"],
];

const phrase = (count: string, words: string) => (count === "" ? words : `${count} ${words}`);

const adjectiveChoiceBank: readonly ChoiceItem[] = pairUp(44, describers, described).map(
  ([[owner, verb], [count, adjective, noun]]): ChoiceItem => [
    "",
    `${owner} ${verb} ${phrase(count, `${adjective} ${noun}`)}.`,
    [`${owner} ${verb} ${phrase(count, `${noun} ${adjective}`)}.`, `${owner} ${verb} ${phrase(count, `${adjective}s ${noun}`)}.`],
  ],
);

const adjectiveTypedBank: readonly TypedItem[] = pairUp(33, describers.slice(0, 3), described).map(
  ([[owner, verb], [count, adjective, noun]]): TypedItem => ({
    shown: `${owner} ${verb} ${phrase(count, noun)}. (${adjective})`,
    accepted: [`${owner} ${verb} ${phrase(count, `${adjective} ${noun}`)}.`],
    wrong: [`${owner} ${verb} ${phrase(count, `${noun} ${adjective}`)}.`, `${owner} ${verb} ${phrase(count, `${adjective}s ${noun}`)}.`],
    instruction: t("Put the word in brackets in the sentence.", "把括号里的词放进句子。"),
  }),
);

const adjectivesBeforeNouns: TopicDef = {
  id: "adjectives-before-nouns",
  title: t("Big Eyes, Long Hair", "大眼睛，长头发"),
  summary: t("A describing word comes before the noun and never takes -s.", "形容词放在名词前，而且从不加 -s。"),
  prerequisites: ["pre-a1-words-body", "pre-a1-words-colors", "have-and-has"],
  encompasses: [
    { topic: "pre-a1-words-body", weight: 0.3 },
    { topic: "pre-a1-words-colors", weight: 0.2 },
    { topic: "have-and-has", weight: 0.2 },
  ],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Where the describing word goes", "形容词放在哪里"),
      t(
        "A describing word like *big*, *long* or *blue* comes before the noun: *long hair*, *two big eyes*. It never takes *-s*, even before more than one: *two big eyes*, not *two bigs eyes*.",
        "*big*、*long*、*blue* 这样的形容词放在名词前：*long hair*、*two big eyes*。名词是复数时，形容词也不加 *-s*：说 *two big eyes*，不说 *two bigs eyes*。",
      ),
      choiceGenerator(t("Which sentence is right?", "哪个句子是对的？"), adjectiveChoiceBank, (right) =>
        t(`${right} The describing word comes before the noun.`, `${right} 形容词放在名词前，不加 -s。`),
      ),
    ),
    point(
      "write",
      t("Adding a describing word", "加上形容词"),
      t(
        "Put the describing word right before the noun, after any number: *two eyes* → *two blue eyes*.",
        "把形容词放在名词正前方，数字后面：*two eyes* → *two blue eyes*。",
      ),
      typedGenerator("sentence", t("Write the sentence again.", "重写这个句子。"), adjectiveTypedBank, (right) =>
        t(right, `${right}（形容词放在名词前）`),
      ),
    ),
  ],
};

// Writing about yourself.

const numberWords = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];

type Note = readonly [note: string, sentence: string, wrong: readonly string[], pattern?: string];

const names: readonly string[] = ["Ben", "Lily", "Tom", "Anna", "Sam", "Mia", "Leo", "Amy", "Jack", "Kate"];

const nameNotes: readonly Note[] = names.map(
  (name): Note => [`name: ${name}`, `My name is ${name}.`, [`My name ${name}.`, `I name is ${name}.`]],
);

const ageNotes: readonly Note[] = numberWords
  .slice(4)
  .map(
    (n, i): Note => [
      `age: ${i + 5}`,
      `I am ${n} years old.`,
      [`I have ${n} years old.`, `I ${n} years old.`],
      `[I am|I'm] ${n} (years old).`,
    ],
  );

const haveNotes: readonly Note[] = ["a dog", "a cat", "two sisters", "a brother", "a red bag", "three pencils", "a rabbit", "two fish"].map(
  (thing): Note => [`have: ${thing}`, `I have ${thing}.`, [`I has ${thing}.`, `Have ${thing}.`]],
);

const lookNotes: readonly Note[] = [
  ["hair", "black"],
  ["hair", "long"],
  ["eyes", "brown"],
  ["eyes", "blue"],
  ["hair", "short and brown"],
  ["eyes", "big and green"],
].map(([part, looks]): Note => [`${part}: ${looks}`, `I have ${looks} ${part}.`, [`I have ${part} ${looks}.`, `My ${part} ${looks}.`]]);

const likeNotes: readonly Note[] = ["cats", "dogs", "horses", "green", "my school"].map(
  (thing): Note => [`like: ${thing}`, `I like ${thing}.`, [`I likes ${thing}.`, `I am like ${thing}.`]],
);

const notes: readonly Note[] = [...nameNotes, ...ageNotes, ...haveNotes, ...lookNotes, ...likeNotes];

const aboutYouTypedBank: readonly TypedItem[] = notes.map(
  ([note, sentence, wrong, pattern]): TypedItem => ({
    shown: note,
    accepted: [pattern ?? sentence],
    canonical: sentence,
    wrong: [...wrong],
  }),
);

const aboutYouChoiceBank: readonly ChoiceItem[] = notes.map(([note, sentence, wrong]): ChoiceItem => [note, sentence, [...wrong]]);

const writingAboutYourself: TopicDef = {
  id: "writing-about-yourself",
  title: t("Writing About Yourself", "写写你自己"),
  summary: t(
    "Write sentences about yourself from notes: your name, your age and what you have.",
    "根据提示写关于自己的句子：你的名字、年龄和你拥有的东西。",
  ),
  prerequisites: ["writing-words-in-order", "have-and-has"],
  encompasses: [
    { topic: "writing-words-in-order", weight: 0.3 },
    { topic: "have-and-has", weight: 0.2 },
  ],
  xp: 20,
  strand: "writing",
  knowledgePoints: [
    point(
      "choose",
      t("The right sentence for a note", "选出符合提示的句子"),
      t(
        "*My name is Ben.* *I am eight years old.* (not *I have eight years.*) *I have a dog.* *I have black hair.* *I like cats.*",
        "*My name is Ben.* *I am eight years old.*（说年龄用 *am*，不用 *have*，也不能漏掉 *am*）*I have a dog.* *I have black hair.*（颜色放在 *hair* 前面）*I like cats.*",
      ),
      choiceGenerator(t("Choose the sentence that matches the note.", "选出与提示相符的句子。"), aboutYouChoiceBank, (right) =>
        t(right, `${right}（句子要有动词，词序是：谁 + 动词 + 其余部分）`),
      ),
    ),
    point(
      "write",
      t("Turning notes into sentences", "把提示写成句子"),
      t(
        "Write a whole sentence about yourself for each note: a capital letter, *I* or *My*, a verb, and a period.\n\n*age: 8* → *I am eight years old.*\n*have: a cat* → *I have a cat.*",
        "根据每条提示写一个完整的句子：大写字母开头，用 *I* 或 *My*，要有动词，句末加句号。\n\n*age: 8* → *I am eight years old.*\n*have: a cat* → *I have a cat.*",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Write a sentence about yourself from the note.", "根据提示写一个关于自己的句子。"),
        aboutYouTypedBank,
        (right) => t(right, `${right}（完整的句子：大写开头，有动词，句号结尾）`),
      ),
    ),
  ],
};

/** topics are the topics of the unit My Body. */
export const topics: readonly TopicDef[] = [body.topic, adjectivesBeforeNouns, writingAboutYourself];

/** vocabulary are the words the unit My Body teaches. */
export const vocabulary: readonly WordBatch[] = [body.batch];
