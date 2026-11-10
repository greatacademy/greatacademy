// Pre-A1, unit 5: Animals. Animals, what they can do, little words, can and can't, and questions with be.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { sentenceCase, vocabularyTopic, word } from "../words.ts";

const animals = vocabularyTopic({
  id: "pre-a1-words-animals",
  title: t("Animals", "动物"),
  summary: t("Pets and farm animals.", "宠物和农场动物。"),
  prerequisites: [],
  words: [
    word(
      "animal animals",
      "a living thing that can move, like a dog or a bird",
      "动物",
      "A cat is an {animal}.|color name | The zoo has many {animals}.|colors names | What is your best {animal}? The panda!|color name",
      "color name",
    ),
    word(
      "cat cats",
      "a small animal with soft fur that says meow",
      "猫",
      "My {cat} says meow.|dog cow | The {cat} likes to catch mice.|duck frog | Our {cat} sleeps on my bed and purrs.|cow horse",
      "dog cow",
    ),
    word(
      "dog dogs",
      "an animal that says woof and is a good friend to people",
      "狗",
      "My {dog} says woof.|cat duck | I walk my {dog} in the park every day.|fish frog | The {dog} wags its tail. It is happy.|fish frog",
      "cat duck",
    ),
    word(
      "bird birds",
      "an animal with wings and feathers that can usually fly",
      "鸟",
      "A {bird} can fly in the sky.|fish pig | The {bird} sings in the tree.|pig cow | {Birds} make nests in trees.|Pigs Cows",
      "fish pig",
    ),
    word(
      "fish",
      "an animal that lives and swims in water",
      "鱼",
      "A {fish} lives in water.|bird horse | {Fish} can swim, but they can't walk.|Birds Horses | There are three {fish} in the pond.|horses cows",
      "bird horse",
    ),
    word(
      "horse horses",
      "a big animal that people can ride",
      "马",
      "I can ride a {horse}.|duck mouse | A {horse} can run very fast.|frog mouse | The {horse} eats grass in the field.|frog cat",
      "duck mouse",
    ),
    word(
      "cow cows",
      "a big farm animal that gives us milk",
      "奶牛；母牛",
      "We get milk from a {cow}.|pig duck | The {cow} says moo.|pig dog | There are ten {cows} on the farm. They give us milk.|frogs ducks",
      "pig duck",
    ),
    word(
      "pig pigs",
      "a pink farm animal with a short nose and a curly tail",
      "猪",
      "A {pig} is pink and fat.|cow frog | The {pig} says oink.|cow duck | {Pigs} like to roll in mud.|Birds Fish",
      "cow frog",
    ),
    word(
      "duck ducks",
      "a bird that swims and says quack",
      "鸭子",
      "The {duck} says quack.|cow pig | A {duck} can swim and fly.|pig horse | The {ducks} swim on the lake.|pigs cows",
      "cow pig",
    ),
    word(
      "rabbit rabbits",
      "a small animal with long ears that jumps",
      "兔子",
      "A {rabbit} has long ears.|fish frog | My {rabbit} eats carrots.|fish bird | The {rabbit} jumps across the grass.|fish cow",
      "fish frog",
    ),
    word(
      "mouse mice",
      "a very small gray animal with a long tail",
      "老鼠",
      "A {mouse} is small and gray.|horse cow | The cat runs after the {mouse}.|horse cow | Two little {mice} live under the floor.|horses cows",
      "horse cow",
    ),
    word(
      "frog frogs",
      "a small green animal that jumps and lives near water",
      "青蛙",
      "A {frog} is green and jumps.|pig cow | The {frog} says ribbit.|pig cow | {Frogs} live near ponds and eat flies.|Cows Horses",
      "pig cow",
    ),
  ],
});

const canAndLike = vocabularyTopic({
  id: "pre-a1-words-can-and-like",
  title: t("Can, Like and Actions", "can、like 和动作"),
  summary: t("What animals and people can do, what they like, and big and small.", "动物和人能做什么、喜欢什么，以及 big 和 small。"),
  prerequisites: ["pre-a1-words-animals"],
  words: [
    word(
      "can can't cannot",
      "to be able to",
      "能；会",
      "A bird {can} fly.|is like | I {can't} fly. I am not a bird.|isn't aren't | {Can} you swim? Yes, I can.|Are Is",
      "is like",
    ),
    word(
      "like likes liked liking",
      "to think something is good or nice",
      "喜欢",
      "I {like} cats. They are nice.|can is | Do you {like} apples? Yes, I love them.|can is | She {likes} her new bag.|can is",
      "can is",
    ),
    word(
      "see sees saw seen seeing",
      "to notice something with your eyes",
      "看见",
      "I can {see} a bird in the tree.|eat swim | Close your eyes. Now you can't {see} anything.|jump swim | I {saw} a big dog yesterday.|ran swam",
      "eat swim",
    ),
    word(
      "run runs ran running",
      "to move fast on your feet",
      "跑",
      "Horses can {run} very fast.|swim fly | Don't {run} in the classroom.|fly see | The dog {ran} after the ball.|flew swam",
      "swim fly",
    ),
    word(
      "jump jumps jumped jumping",
      "to push yourself up into the air with your legs",
      "跳",
      "Rabbits {jump} with their long back legs.|fly swim | {Jump} up and down!|Swim Eat | The cat {jumped} onto the table.|swam flew",
      "fly swim",
    ),
    word(
      "swim swims swam swum swimming",
      "to move through water",
      "游泳",
      "Fish {swim} in the water.|fly walk | Can you {swim}? Yes, I go to the pool every week.|fly eat | We are {swimming} in the sea.|flying eating",
      "fly walk",
    ),
    word(
      "fly flies flew flown flying",
      "to move through the air",
      "飞",
      "Birds {fly} in the sky.|swim walk | A plane can {fly}.|swim eat | The bird {flew} away.|swam ate",
      "swim walk",
    ),
    word(
      "walk walks walked walking",
      "to move on your feet, not fast",
      "走；步行",
      "I {walk} to school with my friend.|fly swim | Babies can't {walk}. They are too small.|see eat | Let's {walk} in the park.|fly swim",
      "fly swim",
    ),
    word(
      "eat eats ate eaten eating",
      "to put food in your mouth",
      "吃",
      "I {eat} rice for lunch.|see fly | Cows {eat} grass.|fly swim | Don't talk when you are {eating}.|flying swimming",
      "see fly",
    ),
    word(
      "big bigger biggest",
      "large; not small",
      "大的",
      "An elephant is very {big}.|small sad | A horse is {bigger} than a dog.|smaller sadder | Our house is {big}. It has ten rooms.|small sad",
      "small sad",
    ),
    word(
      "small smaller smallest",
      "little; not big",
      "小的",
      "A mouse is very {small}.|big long | A mouse is {smaller} than a cat.|bigger longer | My room is {small}. It has one bed and one chair.|big long",
      "big long",
    ),
  ],
});

const littleWords = vocabularyTopic({
  id: "pre-a1-words-little-words",
  title: t("Little Words", "小词"),
  summary: t(
    "But, or, very, to, at and of, and good, bad, happy, sad and long.",
    "but、or、very、to、at、of，以及 good、bad、happy、sad、long。",
  ),
  prerequisites: ["pre-a1-words-how-many"],
  words: [
    word(
      "but",
      "a word that joins two different ideas",
      "但是",
      "I like cats, {but} I don't like dogs.|or to | Birds can fly, {but} fish can't.|or of | It is small, {but} it is very fast.|or of",
      "or to",
    ),
    word(
      "or",
      "a word that gives a choice",
      "或者；还是",
      "Is it a cat {or} a dog?|but very | Do you want milk {or} water?|but of | Is your bag red {or} blue?|but at",
      "but very",
    ),
    word(
      "very",
      "more than usual",
      "很；非常",
      "The elephant is {very} big.|to or | Thank you {very} much!|to of | I am {very} happy today.|or of",
      "to or",
    ),
    word(
      "to",
      "in the direction of; toward",
      "到；去；向",
      "I go {to} school by bus.|at of | Say hello {to} your mom.|of at | Give the book {to} me.|of at",
      "at of",
    ),
    word(
      "at",
      "in or near a place; at a time",
      "在（某地或某时）",
      "I am {at} school.|to of | Look {at} me!|to of | We eat lunch {at} twelve.|of to",
      "to of",
    ),
    word(
      "of",
      "that belongs to; that is part of",
      "……的",
      "This is a picture {of} my family.|at to | A cup {of} tea, please.|at to | He is the father {of} two girls.|at to",
      "at to",
    ),
    word(
      "good better best",
      "nice, or done well",
      "好的",
      "Well done! Your picture is very {good}.|bad sad | Lily is my {best} friend.|worst saddest | Have a {good} day!|bad sad",
      "bad sad",
    ),
    word(
      "bad worse worst",
      "not good",
      "坏的；糟糕的",
      "Oh no! The milk is {bad}. Don't drink it.|good happy | It's a {bad} day. It is raining and I am sick.|good happy | Oh no! This is the {worst} day ever!|best happiest",
      "good happy",
    ),
    word(
      "happy happier happiest",
      "feeling good and glad",
      "快乐的；高兴的",
      "It's my birthday! I am very {happy}.|sad bad | The children are {happy}. They are laughing.|sad bad | {Happy} birthday, Tom!|Sad Long",
      "sad bad",
    ),
    word(
      "sad sadder saddest",
      "feeling bad, maybe crying",
      "难过的；伤心的",
      "My dog is sick. I am {sad}.|happy good | Why are you crying? Are you {sad}?|happy long | The {sad} girl is crying.|happy long",
      "happy good",
    ),
    word(
      "long longer longest",
      "big from one end to the other",
      "长的",
      "A giraffe has a {long} neck.|sad bad | My sister has {long} hair.|sad bad | A snake is {long} and thin.|happy good",
      "sad bad",
    ),
  ],
});

// Can and can't.

/** abilities are true facts about what animals and people can and can't do. */
const abilities: readonly (readonly [subject: string, can: boolean, verb: string, rest: string])[] = [
  ["A bird", true, "fly", ""],
  ["A fish", true, "swim", ""],
  ["A fish", false, "walk", ""],
  ["A horse", true, "run", " fast"],
  ["A rabbit", true, "jump", ""],
  ["A cow", false, "fly", ""],
  ["A duck", true, "swim", ""],
  ["A pig", false, "fly", ""],
  ["A frog", true, "jump", ""],
  ["A cat", true, "see", " at night"],
  ["A dog", true, "run", ""],
  ["A mouse", false, "swim", " very far"],
  ["A baby", false, "walk", ""],
  ["My dad", true, "swim", ""],
  ["I", true, "draw", " a cat"],
  ["A horse", false, "fly", ""],
  ["A bird", true, "sing", ""],
  ["A cow", true, "eat", " grass"],
  ["A frog", true, "swim", ""],
  ["A rabbit", false, "fly", ""],
  ["We", true, "read", " and write"],
  ["A fish", false, "run", ""],
  ["My sister", true, "ride", " a horse"],
  ["A duck", true, "fly", ""],
  ["A dog", false, "fly", ""],
  ["They", true, "jump", " very high"],
  ["A baby", false, "read", ""],
  ["You", true, "open", " the door"],
  ["A cat", false, "talk", ""],
  ["A bird", false, "swim", " under the water"],
  ["Tom", true, "run", " very fast"],
  ["A pig", true, "eat", " a lot"],
  ["She", true, "sing", " very well"],
  ["He", false, "swim", ""],
  ["A mouse", true, "run", " very fast"],
  ["A cow", false, "jump", " very high"],
];

const third = (verb: string) => (verb.endsWith("y") ? `${verb.slice(0, -1)}ies` : `${verb}s`);

const canChoiceBank: readonly ChoiceItem[] = abilities.map(([subject, can, verb, rest]): ChoiceItem => {
  const modal = can ? "can" : "can't";
  return [
    "",
    `${subject} ${modal} ${verb}${rest}.`,
    [`${subject} ${modal} ${third(verb)}${rest}.`, `${subject} ${modal} to ${verb}${rest}.`],
  ];
});

const canTypedBank: readonly TypedItem[] = abilities.map(([subject, can, verb, rest]): TypedItem => {
  const lower = subject === "I" ? "I" : subject.charAt(0).toLowerCase() + subject.slice(1);
  return {
    shown: `${lower} / ${verb}${rest} (${can ? "yes" : "no"})`,
    accepted: [can ? `${subject} can ${verb}${rest}.` : `${subject} [can't|cannot] ${verb}${rest}.`],
    canonical: `${subject} ${can ? "can" : "can't"} ${verb}${rest}.`,
    wrong: [
      `${subject} ${can ? "can" : "can't"} ${third(verb)}${rest}.`,
      `${subject} ${can ? "can" : "can't"} to ${verb}${rest}.`,
      ...(can ? [] : [`${subject} don't can ${verb}${rest}.`, `${subject} not can ${verb}${rest}.`]),
    ],
  };
});

const canForAbility: TopicDef = {
  id: "can-for-ability",
  title: t("Can and Can't", "can 和 can't"),
  summary: t(
    "A bird can fly. A fish can't walk. After can the verb has no -s and no to.",
    "A bird can fly. A fish can't walk. can 后面的动词不加 -s，也不加 to。",
  ),
  prerequisites: ["pre-a1-words-can-and-like"],
  encompasses: [{ topic: "pre-a1-words-can-and-like", weight: 0.4 }],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("The verb after can", "can 后面的动词"),
      t(
        "After *can* and *can't*, the verb stays plain: no *-s* and no *to*.\n\n*A bird can fly.* Not *A bird can flies.* or *A bird can to fly.*",
        "*can* 和 *can't* 后面的动词用原形：不加 *-s*，也不加 *to*。\n\n说 *A bird can fly.*，不说 *A bird can flies.* 或 *A bird can to fly.*",
      ),
      choiceGenerator(t("Which sentence is right?", "哪个句子是对的？"), canChoiceBank, (right) =>
        t(`${right} After *can*, the verb has no *-s* and no *to*.`, `${right} *can* 后面的动词用原形。`),
      ),
    ),
    point(
      "write",
      t("Writing can and can't", "写 can 和 can't 的句子"),
      t(
        "Write *can* for yes and *can't* for no. *Can't* is the short form of *cannot*. Never say *don't can*.\n\n*fish / swim (yes)* → *A fish can swim.*\n*fish / walk (no)* → *A fish can't walk.*",
        "“是”用 *can*，“不是”用 *can't*。*can't* 是 *cannot* 的缩写。中文说“不会”，但英语不能说 *don't can*。\n\n*fish / swim (yes)* → *A fish can swim.*\n*fish / walk (no)* → *A fish can't walk.*",
      ),
      typedGenerator("sentence-pattern", t("Write a sentence with can or can't.", "用 can 或 can't 写一个句子。"), canTypedBank, (right) =>
        t(right, `${right}（can 和 can't 后面用动词原形）`),
      ),
    ),
  ],
};

// Questions with be.

/** statements are sentences with be, each with its subject and the rest. */
const statements: readonly (readonly [subject: string, be: "am" | "is" | "are", rest: string])[] = [
  ["it", "is", "a cat"],
  ["it", "is", "a frog"],
  ["Tom", "is", "happy"],
  ["they", "are", "ducks"],
  ["you", "are", "a student"],
  ["he", "is", "at school"],
  ["she", "is", "your sister"],
  ["the dog", "is", "big"],
  ["the cats", "are", "black"],
  ["it", "is", "a pig"],
  ["we", "are", "late"],
  ["Anna", "is", "at home"],
  ["the horse", "is", "fast"],
  ["they", "are", "rabbits"],
  ["it", "is", "an egg"],
  ["the birds", "are", "in the tree"],
  ["he", "is", "your brother"],
  ["the mouse", "is", "under the bed"],
  ["you", "are", "sad"],
  ["it", "is", "a fish"],
  ["the cow", "is", "on the farm"],
  ["she", "is", "a teacher"],
  ["they", "are", "your friends"],
  ["it", "is", "blue"],
  ["the frogs", "are", "green"],
  ["Ben", "is", "ten"],
  ["the bag", "is", "red"],
  ["it", "is", "a horse"],
  ["your mom", "is", "at work"],
  ["they", "are", "in the classroom"],
  ["the duck", "is", "on the lake"],
  ["it", "is", "a mouse"],
  ["the pens", "are", "in the bag"],
  ["Lily", "is", "your friend"],
];

const asStatement = (subject: string, be: string, rest: string) => `${sentenceCase(subject)} ${be} ${rest}.`;
const asQuestion = (subject: string, be: string, rest: string) => `${sentenceCase(be)} ${subject} ${rest}?`;

const questionChoiceBank: readonly ChoiceItem[] = statements.map(
  ([subject, be, rest]): ChoiceItem => [
    "",
    asQuestion(subject, be, rest),
    [`${sentenceCase(subject)} ${be} ${rest}?`, `${sentenceCase(be)} ${subject} ${rest}.`],
  ],
);

/** answerPronoun is the word a short answer uses for the subject of a question. */
const answerPronoun: Readonly<Record<string, string>> = {
  you: "I",
  Tom: "he",
  Ben: "he",
  Anna: "she",
  Lily: "she",
  "your mom": "she",
};

const shortAnswerOf = (subject: string, be: string): string => {
  const pronoun =
    answerPronoun[subject] ?? (["it", "he", "she", "they", "we"].includes(subject) ? subject : /s$/u.test(subject) ? "they" : "it");
  return `${pronoun} ${pronoun === "I" ? "am" : be}`;
};

const shortAnswerBank: readonly ChoiceItem[] = statements.map(([subject, be, rest], k): ChoiceItem => {
  const yes = k % 2 === 0;
  const [pronoun = "it", verb = "is"] = shortAnswerOf(subject, be).split(" ");
  const negative = verb === "am" ? "am not" : `${verb}n't`;
  const right = yes ? `Yes, ${pronoun} ${verb}.` : `No, ${pronoun} ${negative}.`;
  const contracted = pronoun === "I" ? "I'm" : pronoun === "they" || pronoun === "we" ? `${pronoun}'re` : `${pronoun}'s`;
  return [
    `${asQuestion(subject, be, rest)} (${yes ? "yes" : "no"})`,
    right,
    yes ? [`Yes, ${contracted}.`, `Yes, ${pronoun} ${negative}.`] : [`No, ${pronoun} ${verb}.`, `No, ${pronoun} not.`],
  ];
});

const questionTypedBank: readonly TypedItem[] = statements.map(
  ([subject, be, rest]): TypedItem => ({
    shown: asStatement(subject, be, rest),
    accepted: [asQuestion(subject, be, rest)],
    wrong: [`${sentenceCase(subject)} ${be} ${rest}?`, `${sentenceCase(subject)} ${be} ${rest} ma?`],
  }),
);

const questionsWithBe: TopicDef = {
  id: "questions-with-be",
  title: t("Questions with Be", "用 be 提问"),
  summary: t("Is it a cat? Yes, it is. The verb moves to the front.", "Is it a cat? Yes, it is. 动词移到句首。"),
  prerequisites: ["the-verb-be", "pre-a1-words-animals"],
  encompasses: [{ topic: "the-verb-be", weight: 0.4 }],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("The order of a question", "问句的语序"),
      t(
        "To ask a yes-or-no question, move *am*, *is* or *are* to the front and end with a question mark.\n\n*It is a cat.* → *Is it a cat?*\n*They are ducks.* → *Are they ducks?*",
        "中文把陈述句变成问句，只要在句末加“吗”：“它是猫吗？”英语却要把 *am*、*is* 或 *are* 移到句首，句末用问号。\n\n*It is a cat.* → *Is it a cat?*\n*They are ducks.* → *Are they ducks?*",
      ),
      choiceGenerator(t("Which one is a right question?", "哪一个是正确的问句？"), questionChoiceBank, (right) =>
        t(`${right} The verb comes first.`, `${right} 动词放在句首。`),
      ),
    ),
    point(
      "short-answers",
      t("Short answers", "简略回答"),
      t(
        "Answer with *Yes* or *No*, the word for who or what, and the verb: *Is it a cat? Yes, it is.* / *No, it isn't.* A question with *you* gets an answer with *I*: *Are you sad? No, I am not.*\n\nIn a short yes answer, do not use a short form: say *Yes, it is.*, not *Yes, it's.*",
        "用 *Yes* 或 *No*、代词和动词来回答：*Is it a cat? Yes, it is.* / *No, it isn't.* 问句中是 *you*，回答用 *I*：*Are you sad? No, I am not.*\n\n肯定的简略回答不能用缩写：说 *Yes, it is.*，不说 *Yes, it's.*",
      ),
      choiceGenerator(t("Choose the short answer.", "选出简略回答。"), shortAnswerBank, (right, shown) =>
        t(`${shown.replace(/ \((yes|no)\)$/u, "")} ${right}`, `${shown.replace(/ \((yes|no)\)$/u, "")} ${right}（简略回答）`),
      ),
    ),
    point(
      "write",
      t("Writing questions", "写问句"),
      t(
        "Turn the sentence into a question: the verb goes first, and the end is a question mark.",
        "把陈述句改成问句：动词放在最前面，句末用问号。",
      ),
      typedGenerator("sentence", t("Write the sentence as a question.", "把这个句子改成问句。"), questionTypedBank, (right, shown) =>
        t(`${shown} → ${right}`, `${shown} → ${right}（动词移到句首）`),
      ),
    ),
  ],
};

/** topics are the topics of the unit Animals. */
export const topics: readonly TopicDef[] = [animals.topic, canAndLike.topic, littleWords.topic, canForAbility, questionsWithBe];

/** vocabulary are the words the unit Animals teaches. */
export const vocabulary: readonly WordBatch[] = [animals.batch, canAndLike.batch, littleWords.batch];
