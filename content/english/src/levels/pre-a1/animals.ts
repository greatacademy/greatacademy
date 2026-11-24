// Pre-A1, unit 5: Animals. Animals, what they can do, little words, can and can't, and questions with be.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, interleave, sentenceCase, vocabularyTopic, word } from "../words.ts";

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

/** profiles say, for animals and people, what each can and can't do; every sentence they make is true. */
const profiles: readonly (readonly [subject: string, can: readonly string[], cannot: readonly string[]])[] = [
  ["A bird", ["fly", "sing", "walk"], ["swim under the water"]],
  ["A fish", ["swim"], ["walk", "run", "fly", "climb a tree"]],
  ["A horse", ["run fast", "jump", "eat grass"], ["fly", "climb a tree"]],
  ["A rabbit", ["jump", "run fast", "eat carrots"], ["fly", "climb a tree"]],
  ["A cow", ["eat grass", "walk"], ["fly", "jump very high", "climb a tree"]],
  ["A duck", ["swim", "fly", "walk"], ["climb a tree"]],
  ["A pig", ["eat a lot", "run"], ["fly", "climb a tree"]],
  ["A frog", ["jump", "swim"], ["fly"]],
  ["A cat", ["see at night", "jump", "climb a tree", "run"], ["fly", "talk"]],
  ["A dog", ["run", "swim", "jump"], ["fly", "talk"]],
  ["A mouse", ["run very fast", "climb"], ["fly", "talk"]],
  ["A baby", ["eat", "sleep a lot"], ["walk", "run fast", "ride a bike"]],
  ["My dad", ["swim", "read", "ride a bike", "run fast"], ["fly"]],
  ["I", ["draw a cat", "read", "write", "sing"], ["fly"]],
  ["We", ["read and write", "run", "jump", "swim"], ["fly"]],
  ["They", ["jump very high", "ride a horse", "sing"], ["fly"]],
  ["You", ["open the door", "sing", "read"], ["fly"]],
  ["Tom", ["run very fast", "swim", "read"], ["fly"]],
  ["She", ["sing very well", "ride a horse", "swim"], ["fly"]],
];

/** animalsCannot are what no animal can do, said of every animal in the profiles. */
const animalsCannot: readonly string[] = ["read", "write", "ride a bike"];

/** abilities are true facts about what animals and people can and can't do, each verb split from the rest. */
const abilities: readonly (readonly [subject: string, can: boolean, verb: string, rest: string])[] = interleave(
  profiles.map(([subject, can, cannot]) => {
    const isAnimal = subject.startsWith("A ") && subject !== "A baby";
    const facts = [
      ...can.map((v) => [true, v] as const),
      ...cannot.map((v) => [false, v] as const),
      ...(isAnimal ? animalsCannot.map((v) => [false, v] as const) : []),
    ];
    return facts.map(([yes, phrase]) => {
      const [verb = "", ...rest] = phrase.split(" ");
      return [subject, yes, verb, rest.length > 0 ? ` ${rest.join(" ")}` : ""] as const;
    });
  }),
);

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
  const lower = /^(A|My|We|They|You|She|He)\b/u.test(subject) ? subject.charAt(0).toLowerCase() + subject.slice(1) : subject;
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
  intro: t(
    "Look at *A duck can swim.* and *A duck can't climb a tree.* Whether the subject is *I*, *she*, or *a duck*, *can* and *can't* never change, and the verb right after them stays completely plain—no *-s* and no *to*. In this topic, you spot and write accurate *can* / *can't* sentences.",
    "看看 *A duck can swim.* 和 *A duck can't climb a tree.* 无论主语是 *I*、*she* 还是 *a duck*，*can* 和 *can't* 从不变化，后面的动词也一律用原形——不加 *-s*，也不加 *to*。本主题带你辨认并写出准确的 *can* / *can't* 句子。",
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
        "After *can* and *can't*, the verb stays plain: no *-s* and no *to*.\n\n*A bird can fly.* Not *A bird can flies.* or *A bird can to fly.*\n\n> **Watch out.** Even after *he*, *she*, *Tom*, or *a bird*, never add *-s* to the verb after *can* or *can't*, and never insert *to* between them.",
        "*can* 和 *can't* 后面的动词用原形：不加 *-s*，也不加 *to*。\n\n说 *A bird can fly.*，不说 *A bird can flies.* 或 *A bird can to fly.*\n\n> **注意。** 即使主语是 *he*、*she*、*Tom* 或 *a bird*，*can* / *can't* 后面的动词也绝不加 *-s*，中间也绝不加 *to*。",
      ),
      choiceGenerator(
        t("Which sentence is right?", "哪个句子是对的？"),
        canChoiceBank,
        (right) =>
          t(
            `${right} After *can* and *can't*, the verb stays plain, with no *-s* and no *to*.\n\n**Check.** Look right after *can* / *can't*—there is no *to* in between and no *-s* on the verb.`,
            `${right} *can* 和 *can't* 后面的动词用原形，不加 *-s*，也不加 *to*。\n\n**检验。** 紧盯着 *can* / *can't* 后面的词——中间没有 *to*，动词词尾也没有 *-s*。`,
          ),
        (_wrong, _right, _shown, position) =>
          position === 0
            ? t(
                "This adds *-s* to the verb after *can*, but the verb after *can* always stays plain.",
                "这句给 *can* 后面的动词加了 *-s*，可 *can* 后面的动词总是用原形。",
              )
            : t(
                "This puts *to* after *can*, but *can* is followed by the verb straight away.",
                "这句在 *can* 后面加了 *to*，可 *can* 后面直接跟动词。",
              ),
      ),
    ),
    point(
      "write",
      t("Writing can and can't", "写 can 和 can't 的句子"),
      t(
        "Write *can* for yes and *can't* for no. *Can't* is the short form of *cannot*. Never say *don't can*.\n\n*fish / swim (yes)* → *A fish can swim.*\n*fish / walk (no)* → *A fish can't walk.*\n\n> **Watch out.** For negative ability, write *can't* (or *cannot*)—never *don't can* or *not can*—and keep the verb right after it plain.",
        "“是”用 *can*，“不是”用 *can't*。*can't* 是 *cannot* 的缩写。中文说“不会”，但英语不能说 *don't can*。\n\n*fish / swim (yes)* → *A fish can swim.*\n*fish / walk (no)* → *A fish can't walk.*\n\n> **注意。** 表达“不会/不能”时用 *can't*（或 *cannot*）——切勿写 *don't can* 或 *not can*——后面的动词保持原形。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Write a sentence with can or can't.", "用 can 或 can't 写一个句子。"),
        canTypedBank,
        (right, shown) =>
          shown.endsWith("(yes)")
            ? t(
                `The note says yes, so write *can*, and the verb after it stays plain: ${right}\n\n**Check.** Verify the pattern *[Subject] + can + [plain verb]* with a capital letter at the start and a period at the end.`,
                `提示是 yes，所以用 *can*，后面的动词用原形：${right}\n\n**检验。** 核对结构“主语 + *can* + 动词原形”，确认句首大写、句末有句号。`,
              )
            : t(
                `The note says no, so write *can't*, never *don't can*, and the verb after it stays plain: ${right}\n\n**Check.** Verify the pattern *[Subject] + can't + [plain verb]* (not *don't can* or *not can*) with no *-s* or *to*.`,
                `提示是 no，所以用 *can't*，不能说 *don't can*，后面的动词用原形：${right}\n\n**检验。** 核对结构“主语 + *can't* + 动词原形”（不是 *don't can* 或 *not can*），且没有 *-s* 或 *to*。`,
              ),
      ),
    ),
  ],
};

// Questions with be.

/** statementGroups pair subjects with the rests that fit them, in sentences with be. */
const statementGroups: readonly (readonly [subjects: readonly string[], be: "am" | "is" | "are", rests: readonly string[]])[] = [
  [["it"], "is", ["a cat", "a frog", "a pig", "an egg", "a fish", "a horse", "a mouse", "blue", "red", "big", "small", "a book", "a pen"]],
  [
    ["Tom", "Anna", "he", "she", "Ben", "Lily", "your mom"],
    "is",
    ["happy", "sad", "at school", "at home", "in the classroom", "here", "your friend"],
  ],
  [["you"], "are", ["a student", "sad", "happy", "at home", "late", "ten"]],
  [["we"], "are", ["late", "here", "at school", "happy"]],
  [["they", "the cats", "the birds", "the frogs", "the ducks"], "are", ["black", "green", "in the tree", "here", "big", "small"]],
  [["the dog", "the horse", "the mouse", "the cow", "the duck"], "is", ["big", "small", "here", "black", "fast", "at home"]],
];

/** statements are sentences with be, each with its subject and the rest. */
const statements: readonly (readonly [subject: string, be: "am" | "is" | "are", rest: string])[] = interleave(
  statementGroups.map(([subjects, be, rests]) => everyPair(subjects, rests).map(([subject, rest]) => [subject, be, rest] as const)),
);

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
  intro: t(
    "Turn *She is at home.* into a question by moving *is* to the front: *Is she at home?* Then answer cleanly with *Yes, she is.* or *No, she isn't.* In this topic, you form yes/no questions with *be* and choose natural short answers.",
    "把 *She is at home.* 变成问句，要把 *is* 移到句首：*Is she at home?* 简略回答则是 *Yes, she is.* 或 *No, she isn't.* 本主题带你用 *be* 构成一般疑问句，并掌握规范的简略回答。",
  ),
  prerequisites: ["the-verb-be", "pre-a1-words-animals"],
  encompasses: [{ topic: "the-verb-be", weight: 0.4 }],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("The order of a question", "问句的语序"),
      t(
        "To ask a yes-or-no question, move *am*, *is* or *are* to the front and end with a question mark.\n\n*It is a cat.* → *Is it a cat?*\n*They are ducks.* → *Are they ducks?*\n\n> **Watch out.** Check *both* ends of the question: the verb (*Is/Are*) must sit before the subject, and the sentence must end with `?`, not `.`",
        "中文把陈述句变成问句，只要在句末加“吗”：“它是猫吗？”英语却要把 *am*、*is* 或 *are* 移到句首，句末用问号。\n\n*It is a cat.* → *Is it a cat?*\n*They are ducks.* → *Are they ducks?*\n\n> **注意。** 同时检查句首和句尾：动词（*Is/Are*）必须在主语前面，句末必须是 `?`，不能是句号。",
      ),
      choiceGenerator(
        t("Which one is a right question?", "哪一个是正确的问句？"),
        questionChoiceBank,
        (right) =>
          t(
            `${right} A yes-or-no question puts *${right.split(" ")[0]?.toLowerCase()}* before the subject and ends with a question mark.\n\n**Check.** Verify both marks of a *be*-question: *${right.split(" ")[0]}* comes first before the subject, and a question mark (?) closes the sentence.`,
            `${right} 一般疑问句把 *${right.split(" ")[0]?.toLowerCase()}* 放在主语前面，句末用问号。\n\n**检验。** 确认 *be* 问句的两个标志：*${right.split(" ")[0]}* 位于主语前，且句末以问号（?）结尾。`,
          ),
        (_wrong, _right, _shown, position) =>
          position === 0
            ? t(
                "This keeps the order of a statement and only adds a question mark, the way Chinese adds 吗; English moves the verb to the front.",
                "这句保留了陈述句的语序，只加了问号，就像中文只加“吗”；英语要把动词移到句首。",
              )
            : t(
                "This has the order of a question but ends with a period; a question ends with a question mark.",
                "这句语序对了，句末却用了句号；问句要以问号结尾。",
              ),
      ),
    ),
    point(
      "short-answers",
      t("Short answers", "简略回答"),
      t(
        "Answer with *Yes* or *No*, the word for who or what, and the verb: *Is it a cat? Yes, it is.* / *No, it isn't.* A question with *you* gets an answer with *I*: *Are you sad? No, I am not.*\n\nIn a short yes answer, do not use a short form: say *Yes, it is.*, not *Yes, it's.*\n\n> **Watch out.** Never contract a *Yes* short answer (*Yes, it's.* is wrong), and make sure *Yes* pairs with a positive verb while *No* pairs with *not* / *-n't*.",
        "用 *Yes* 或 *No*、代词和动词来回答：*Is it a cat? Yes, it is.* / *No, it isn't.* 问句中是 *you*，回答用 *I*：*Are you sad? No, I am not.*\n\n肯定的简略回答不能用缩写：说 *Yes, it is.*，不说 *Yes, it's.*\n\n> **注意。** 肯定简略回答绝不能缩写（不能说 *Yes, it's.*），而且 *Yes* 后面用肯定动词，*No* 后面必须带 *not* 或 *-n't*。",
      ),
      choiceGenerator(
        t("Choose the short answer.", "选出简略回答。"),
        shortAnswerBank,
        (right, shown) =>
          t(
            `A short answer is *${right.split(",")[0]}*, the word for who or what, and the verb of the question${right.startsWith("No") ? " with *not*" : ""}: ${shown.replace(/ \((yes|no)\)$/u, "")} ${right}\n\n**Check.** Confirm that *Yes/No* matches the verb's polarity (no contraction after *Yes*, *not/n't* included after *No*) and that the pronoun matches the question's subject.`,
            `简略回答由 *${right.split(",")[0]}*、代词和问句里的动词${right.startsWith("No") ? "加 *not*" : ""}组成：${shown.replace(/ \((yes|no)\)$/u, "")} ${right}\n\n**检验。** 确认 *Yes/No* 与动词的肯定或否定一致（*Yes* 后不缩写，*No* 后必有 *not/n't*），且代词与问句主语对应。`,
          ),
        (_wrong, right, _shown, position) =>
          right.startsWith("Yes")
            ? position === 0
              ? t(
                  "A short yes answer ends with the full verb, never a short form like *it's*.",
                  "肯定的简略回答以完整的动词结尾，不能用 *it's* 这样的缩写。",
                )
              : t(
                  "This starts with *Yes* but then says *not*, so it says yes and no at once.",
                  "这句以 *Yes* 开头，后面却有否定，等于同时说“是”和“不是”。",
                )
            : position === 0
              ? t(
                  "This starts with *No* but then says the verb without *not*, so it says no and yes at once.",
                  "这句以 *No* 开头，后面的动词却没有 *not*，等于同时说“不是”和“是”。",
                )
              : t("This leaves out the verb; a short answer needs it before *not*.", "这句漏了动词；简略回答在 *not* 前面要有动词。"),
      ),
    ),
    point(
      "write",
      t("Writing questions", "写问句"),
      t(
        "Turn the sentence into a question: the verb goes first, and the end is a question mark. For example: *Tom is at school.* → *Is Tom at school?*\n\n> **Watch out.** Remember to capitalize the moved verb (*Is* / *Are*), lower-case the subject unless it is *I* or a name (*The dog* -> *the dog*, but *Tom* stays *Tom*), and end with `?`.",
        "把陈述句改成问句：动词放在最前面，句末用问号。例如：*Tom is at school.* → *Is Tom at school?*\n\n> **注意。** 移到句首的动词要大写（*Is* / *Are*），原主语除 *I* 和人名外改为小写（如 *The dog* -> *the dog*，但 *Tom* 仍大写），句末加 `?`。",
      ),
      typedGenerator("sentence", t("Write the sentence as a question.", "把这个句子改成问句。"), questionTypedBank, (right, shown) =>
        t(
          `Move *${right.split(" ")[0]?.toLowerCase()}* to the front, before the subject, and end with a question mark: ${shown} → ${right}\n\n**Check.** Swap the first two blocks back mentally (*${right}* -> *${shown}*)—you should recover the original statement cleanly, with the question mark replaced by a period.`,
          `把 *${right.split(" ")[0]?.toLowerCase()}* 移到句首、主语前面，句末用问号：${shown} → ${right}\n\n**检验。** 在心里把句首动词和主语换回原位，应能完整还原原陈述句，并把句末的问号换回句号。`,
        ),
      ),
    ),
  ],
};

/** topics are the topics of the unit Animals. */
export const topics: readonly TopicDef[] = [animals.topic, canAndLike.topic, littleWords.topic, canForAbility, questionsWithBe];

/** vocabulary are the words the unit Animals teaches. */
export const vocabulary: readonly WordBatch[] = [animals.batch, canAndLike.batch, littleWords.batch];
