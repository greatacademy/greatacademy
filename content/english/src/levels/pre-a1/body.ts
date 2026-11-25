// Pre-A1, unit 6: My Body. The body, describing words before nouns, and sentences about yourself.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, interleave, vocabularyTopic, word } from "../words.ts";
import { aboutYourselfNot, adjectiveNot } from "./mistakes.ts";

const body = vocabularyTopic({
  id: "pre-a1-words-body",
  title: t("The Body", "身体"),
  summary: t("The parts of the body.", "身体的各个部位。"),
  intro: t(
    "Touch your **head**, then your **nose**, then your **feet**! These words help you name the parts of your body and say what each part does.",
    "摸摸你的 **head**（头），再摸摸 **nose**（鼻子），然后是 **feet**（脚）！这些词帮你说出身体的各个部位，以及每个部位做什么。",
  ),
  prerequisites: [],
  words: [
    word(
      "body bodies",
      "all of a person or an animal: the head, the arms, the legs and the rest",
      "身体",
      "Running is good for your {body}, from your head to your feet. | A snake has a long {body} and no legs. | Our {bodies} need food, water and sleep.|heads faces",
      "head face",
    ),
    word(
      "head heads",
      "the top part of the body, with the eyes, the ears and the mouth",
      "头",
      "I wear a hat on my {head}. | Nod your {head} to say yes. | A giraffe has a small {head} on a long neck.",
      "foot hand",
    ),
    word(
      "face faces",
      "the front of the head",
      "脸",
      "She has a happy {face}. She is smiling. | Draw a {face} with two eyes, a nose and a mouth. | He covers his {face} with his hands, so we can't see his eyes.",
      "foot arm",
    ),
    word(
      "eye eyes",
      "the part of the face you see with",
      "眼睛",
      "I see with my {eyes}.|ears hands | Close your {eyes} and go to sleep.|ears hands | She has big blue {eyes}.|ears hands",
      "ear hand",
    ),
    word(
      "ear ears",
      "the part of the head you hear with",
      "耳朵",
      "I hear with my {ears}.|eyes hands | A rabbit has long {ears}.|eyes hands | Put your hands over your {ears}. It's loud!|eyes hands",
      "eye hand",
    ),
    word(
      "nose noses",
      "the part of the face you smell with",
      "鼻子",
      "I smell with my {nose}. | An elephant has a very long {nose}. | Blow your {nose}. Here is a tissue.",
      "ear hand",
    ),
    word(
      "mouth mouths",
      "the part of the face you eat and talk with",
      "嘴",
      "I eat with my {mouth}. | Open your {mouth} and say ah. | Don't talk with food in your {mouth}.",
      "nose ear",
    ),
    word(
      "hand hands",
      "the part at the end of your arm, with five fingers",
      "手",
      "I write with my right {hand}. | Wash your {hands} before you eat.|feet legs | Put up your {hand} to ask a question.",
      "foot leg",
    ),
    word(
      "arm arms",
      "the long part of the body between the shoulder and the hand",
      "手臂；胳膊",
      "I hold the baby in my {arms}.|legs feet | A bird has wings, not {arms}.|legs feet | My {arm} is broken, so I can't write.",
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
      "I wear shoes on my {feet}.|hands arms | I kick the ball with my {foot}. | Hop on one {foot}!",
      "hand arm",
    ),
    word(
      "hair",
      "what grows on your head",
      "头发",
      "My sister has long black {hair}.|eyes arms | Brush your {hair} in the morning.|eyes arms | Grandpa has white {hair}.|eyes arms",
      "eye arm",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "Find the action in the sentence: you see with your *eyes*, hear with your *ears*, smell with your *nose* and eat with your *mouth*.",
        "找出句子里的动作：用 *eyes* 看，用 *ears* 听，用 *nose* 闻，用 *mouth* 吃。",
      ),
      meaning: t(
        "*Arm* and *leg* are both long parts; *hand* and *foot* are at their ends. Check whether the meaning talks about fingers and the shoulder or about standing and walking.",
        "*arm* 和 *leg* 都是长长的部位；*hand* 和 *foot* 在它们的末端。看清释义说的是手指和肩膀，还是站立和走路。",
      ),
      spell: t(
        "One *foot*, two *feet*, not *foots*; *body* becomes *bodies*; and *hair* for the hair on your head takes no -s.",
        "one *foot*，two *feet*，不是 *foots*；*body* 的复数是 *bodies*；头上的头发 *hair* 不加 -s。",
      ),
    },
    notes: `
      body|running and everything from head to feet;a snake's long shape with no legs;what needs food, water and sleep|the body is all of you; the head is only the top part|body 是整个身体；head 只是顶部|head=head is only the top part of the body, not all of it=head 只是身体的顶部，不是整个身体;face=face is only the front of the head, not the whole person=face 只是头的前面，不是整个身体|bo · dy|y changing to -ies in *bodies*|复数 *bodies* 要把 y 变成 -ies
      head|a hat;nodding to say yes;a giraffe's small top part on a long neck|the head is the top part of the body; the foot is at the bottom|head 在身体顶部；foot 在最下面|foot=foot is the part at the bottom of your leg, not the top of the body=foot 在腿的最下面，不在身体顶部;hand=hand is the part at the end of your arm, not the top of the body=hand 在手臂末端，不在身体顶部|head|ea said like the short e in *bed*|ea 读短 e，和 *bed* 一样
      face|a happy smile;two eyes, a nose and a mouth;covering it with your hands to hide your eyes|the face is the front of the head; the foot is at the bottom of the leg|face 是头的前面；foot 在腿的下面|foot=foot is at the end of your leg and has no eyes, nose or mouth=foot 在腿的末端，没有眼睛、鼻子和嘴;arm=arm is the long part between the shoulder and the hand, with no eyes or mouth=arm 是肩膀到手之间的长长部分，没有眼睛和嘴|face|c said like s, and the silent e at the end|c 读作 s，词尾 e 不发音
      eye|what you see with;closing them to sleep;big and blue|you see with your eyes; you hear with your ears|用 eyes 看；用 ears 听|ear=ear is the part you hear with, not the part you see with=ear 是用来听的，不是用来看的;hand=hand is the part with five fingers, not the part you see with=hand 是有五根手指的手，不是用来看的|eye|an e at both ends, though the word sounds like *I*|首尾都是 e，虽然读音像 *I*
      ear|what you hear with;a rabbit's long ones;covering them when it is loud|you hear with your ears; you see with your eyes|用 ears 听；用 eyes 看|eye=eye is the part you see with, not the part you hear with=eye 是用来看的，不是用来听的;hand=hand is the part with five fingers, not the part you hear with=hand 是有五根手指的手，不是用来听的|ear|ea said like the *ear* sound in *hear*|ea 的读音和 *hear* 里一样
      nose|what you smell with;an elephant's very long one;blowing it with a tissue|you smell with your nose; you hear with your ears|用 nose 闻；用 ears 听|ear=ear is the part you hear with, not the part you smell with=ear 是用来听的，不是用来闻的;hand=hand is the part with five fingers, not the part you smell with=hand 是有五根手指的手，不是用来闻的|nose|o and a silent e at the end, so o says its name|o 加词尾不发音的 e，o 读字母本音
      mouth|what you eat with;opening it to say ah;food inside it while you talk|you eat and talk with your mouth; you smell with your nose|用 mouth 吃和说话；用 nose 闻|nose=nose is the part you smell with, not the part you eat or talk with=nose 是用来闻的，不是用来吃或说话的;ear=ear is the part you hear with, not the part you eat or talk with=ear 是用来听的，不是用来吃或说话的|mouth|ou in the middle and th at the end|中间是 ou，结尾是 th
      hand|writing;washing before you eat;putting it up to ask a question|the hand is at the end of your arm; the foot is at the end of your leg|hand 在手臂末端；foot 在腿的末端|foot=foot is the part at the end of your leg that you stand on, not the one with fingers=foot 是腿末端用来站的脚，不是长手指的手;leg=leg is the long part you walk on, not the part with five fingers=leg 是用来走路的长长的腿，不是有五根手指的手|hand|nd at the end|结尾是 nd
      arm|holding a baby;what a bird has wings in place of;a broken one that stops you writing|the arm goes from the shoulder to the hand; the leg goes down to the foot|arm 从肩膀到手；leg 往下连着脚|leg=leg is the long part you stand and walk on, not the part between the shoulder and the hand=leg 是用来站和走的腿，不是肩膀到手之间的部分;foot=foot is the part you stand on at the end of the leg, not the part between the shoulder and the hand=foot 是腿末端用来站的脚，不是肩膀到手之间的部分|arm|ar, said like the *ar* in *car*|ar 的读音和 *car* 里一样
      leg|a dog's four;a spider's eight;tired after walking a long way|you stand and walk on your legs; your arms hold things|用 legs 站和走；用 arms 拿东西|arm=arm is the long part between the shoulder and the hand, not the part you stand and walk on=arm 是肩膀到手之间的部分，不是用来站和走的;hand=hand is the part with five fingers at the end of the arm, not the part you walk on=hand 是手臂末端有五根手指的手，不是用来走路的|leg|the short e, and just -s for more than one: legs|短元音 e，复数只加 -s：legs
      foot|shoes;kicking a ball;hopping on one|you stand on your feet; you hold things in your hands|用 feet 站；用 hands 拿|hand=hand is the part at the end of your arm, with fingers, not the part you stand on=hand 是手臂末端长手指的手，不是用来站的;arm=arm is the long part between the shoulder and the hand, not the part you stand on=arm 是肩膀到手之间的部分，不是用来站的|foot|the double o, and *feet*, not *foots*, for more than one|两个 o；复数是 *feet*，不是 *foots*
      hair|long and black on a sister;brushing it in the morning;white on Grandpa|hair grows on your head; eyes are in your face|hair 长在头上；eyes 在脸上|eye/eyes=eye is the part of the face you see with, not what grows on your head=eye 是脸上用来看的眼睛，不是头上长的东西;arm/arms=arm is the long part between the shoulder and the hand, not what grows on your head=arm 是肩膀到手之间的部分，不是头上长的东西|hair|air, said like the word *air*|拼作 air，读音和 *air* 一样
    `,
  },
});

// Describing words before nouns.

/** describers are people, who have the personal things. */
const describers: readonly (readonly [owner: string, verb: string])[] = [
  ["She", "has"],
  ["I", "have"],
  ["Tom", "has"],
  ["The baby", "has"],
  ["My grandpa", "has"],
  ["My mom", "has"],
  ["You", "have"],
  ["Anna", "has"],
];

/** animals are pets, who have the animal things. */
const animals: readonly (readonly [owner: string, verb: string])[] = [
  ["The cat", "has"],
  ["My dog", "has"],
];

/** described are a count or article, a describing word and a noun, for a person. */
const described: readonly (readonly [count: string, adjective: string, noun: string])[] = [
  ["", "long", "hair"],
  ["two", "big", "eyes"],
  ["a", "small", "nose"],
  ["two", "blue", "eyes"],
  ["", "black", "hair"],
  ["two", "small", "ears"],
  ["", "big", "feet"],
  ["a", "red", "bag"],
  ["two", "green", "eyes"],
  ["", "small", "hands"],
  ["", "long", "arms"],
  ["a", "big", "mouth"],
  ["two", "brown", "eyes"],
];

/** animalThings are what a pet has. */
const animalThings: readonly (readonly [count: string, adjective: string, noun: string])[] = [
  ["four", "long", "legs"],
  ["two", "small", "ears"],
  ["a", "long", "tail"],
  ["two", "big", "eyes"],
  ["a", "small", "nose"],
  ["", "big", "feet"],
  ["a", "red", "ball"],
];

const phrase = (count: string, words: string) => (count === "" ? words : `${count} ${words}`);

/** describedItems pairs every person with every personal thing and every pet with every animal thing. */
const describedItems = interleave([everyPair(describers, described), everyPair(animals, animalThings)]);

const adjectiveChoiceBank: readonly ChoiceItem[] = describedItems.map(
  ([[owner, verb], [count, adjective, noun]]): ChoiceItem => [
    "",
    `${owner} ${verb} ${phrase(count, `${adjective} ${noun}`)}.`,
    [`${owner} ${verb} ${phrase(count, `${noun} ${adjective}`)}.`, `${owner} ${verb} ${phrase(count, `${adjective}s ${noun}`)}.`],
  ],
);

const adjectiveTypedBank: readonly TypedItem[] = describedItems.map(
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
  intro: t(
    "Look at *My dog has four long legs.* and *The baby has a small nose.* In English, a describing word sits right before the noun—after *a* or a number—and never adds *-s*, even when the noun is plural. In this topic, you place adjectives cleanly before nouns.",
    "看看 *My dog has four long legs.* 和 *The baby has a small nose.* 英语里形容词紧挨在名词前面、位于 *a* 或数字之后，而且即使名词是复数，形容词也从不加 *-s*。本主题带你把形容词准确放在名词前面。",
  ),
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
        "A describing word like *big*, *long* or *blue* comes before the noun: *long hair*, *two big eyes*. It never takes *-s*, even before more than one: *two big eyes*, not *two bigs eyes*.\n\n> **Watch out.** Check two things on the describing word: it sits *before* the noun (not after it), and it stays plain with *no -s* even when the noun is plural.",
        "*big*、*long*、*blue* 这样的形容词放在名词前：*long hair*、*two big eyes*。名词是复数时，形容词也不加 *-s*：说 *two big eyes*，不说 *two bigs eyes*。\n\n> **注意。** 检查形容词的两点：位置在名词*前面*（不在后面），且即使名词是复数，形容词也绝不加 *-s*。",
      ),
      choiceGenerator(
        t("Which sentence is right?", "哪个句子是对的？"),
        adjectiveChoiceBank,
        (right) =>
          t(
            `${right} The describing word comes right before the noun, after any number, and never takes *-s*.\n\n**Check.** Find the noun at the end of the sentence—confirm the describing word sits directly in front of it with no *-s* attached.`,
            `${right} 形容词放在名词正前方、数字后面，而且从不加 *-s*。\n\n**检验。** 找到句尾的名词——确认形容词紧挨在它前面，且没有加 *-s*。`,
          ),
        (_wrong, _right, _shown, position) =>
          position === 0
            ? t(
                "This puts the describing word after the noun, but in English it comes before it.",
                "这句把形容词放在了名词后面，可英语里形容词放在名词前面。",
              )
            : t(
                "This adds *-s* to the describing word; only the noun shows more than one.",
                "这句给形容词加了 *-s*；只有名词才表示多个，形容词不变。",
              ),
      ),
    ),
    point(
      "write",
      t("Adding a describing word", "加上形容词"),
      t(
        "Put the describing word right before the noun, after any number: *two eyes* → *two blue eyes*.\n\n> **Watch out.** Slide the describing word *between* the article or number (*a*, *two*, *four*) and the noun—never put it before *a* or after the noun.",
        "把形容词放在名词正前方，数字后面：*two eyes* → *two blue eyes*。\n\n> **注意。** 把形容词插在冠词或数字（*a*、*two*、*four*）与名词*之间*——不要放在 *a* 前面，也不要放在名词后面。",
      ),
      typedGenerator(
        "sentence",
        t("Write the sentence again.", "重写这个句子。"),
        adjectiveTypedBank,
        (right, shown) => {
          const adjective = shown.match(/\((.*)\)$/u)?.[1] ?? "";
          return t(
            `*${adjective}* goes right before the noun, after any number, and takes no *-s*: ${right}\n\n**Check.** Verify the order *[a / number] + ${adjective} + [noun]* and confirm *${adjective}* has no *-s*.`,
            `*${adjective}* 放在名词正前方、数字后面，不加 *-s*：${right}\n\n**检验。** 核对语序“*[a / 数字] + ${adjective} + [名词]*”，并确认 *${adjective}* 没有加 *-s*。`,
          );
        },
        adjectiveNot,
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

/** noteRule says how a sentence for each kind of note is made, in every locale. */
const noteRule: Record<string, Text> = {
  name: t("To give your name, say *My name is* and then the name", "说自己的名字，用 *My name is* 加名字"),
  age: t("English says your age with *am*: you *are* an age, you do not *have* it", "英语用 *am* 说年龄：年龄是“是”，不是“有”"),
  have: t("To say what you have, use *I have*, with no *-s* after *I*", "说自己有什么，用 *I have*，*I* 后面的动词不加 *-s*"),
  look: t("Say *I have*, with the describing word before *hair* or *eyes*", "用 *I have*，形容词放在 *hair* 或 *eyes* 前面"),
  like: t("To say what you like, use *I like*, with no *-s* and no *am*", "说自己喜欢什么，用 *I like*，不加 *-s*，也不加 *am*"),
};

/** noteKind finds the kind of a note from its label. */
const noteKind = (note: string) => {
  const label = note.split(":")[0] ?? "";
  return label === "hair" || label === "eyes" ? "look" : label;
};

/** noteMistakes say what each wrong sentence of a kind of note gets wrong, in the order the notes list them. */
const noteMistakes: Record<string, readonly [Text, Text]> = {
  name: [
    t("This leaves out *is*, but an English sentence needs a verb.", "这句漏了 *is*，可英语句子必须有动词。"),
    t("*I* cannot stand before a noun; to say whose name it is, use *My*.", "*I* 不能放在名词前；要说“谁的名字”，用 *My*。"),
  ],
  age: [
    t("This says age with *have*, as Chinese does; English says it with *am*.", "这句像中文那样用 *have* 说年龄；英语说年龄用 *am*。"),
    t("This leaves out the verb, but an English sentence needs one.", "这句漏了动词，可英语句子必须有动词。"),
  ],
  have: [
    t("*has* is for *he*, *she* and *it*; after *I* the verb has no *-s*.", "*has* 用于 *he*、*she*、*it*；*I* 后面的动词不加 *-s*。"),
    t("This leaves out *I*; a sentence about yourself needs *I* before the verb.", "这句漏了 *I*；说自己的句子，动词前要有 *I*。"),
  ],
  look: [
    t(
      "This puts the describing word after the noun, but in English it comes before it.",
      "这句把形容词放在了名词后面，可英语里形容词放在名词前面。",
    ),
    t("This leaves out the verb, but an English sentence needs one.", "这句漏了动词，可英语句子必须有动词。"),
  ],
  like: [
    t("*likes* has *-s*, which is only for *he*, *she* and *it*.", "*likes* 加了 *-s*，可 *-s* 只用于 *he*、*she*、*it*。"),
    t(
      "This adds *am*, but *like* is already the verb, so the sentence needs no *am*.",
      "这句加了 *am*，可 *like* 已经是动词，不需要 *am*。",
    ),
  ],
};

const writingAboutYourself: TopicDef = {
  id: "writing-about-yourself",
  title: t("Writing About Yourself", "写写你自己"),
  summary: t(
    "Write sentences about yourself from notes: your name, your age and what you have.",
    "根据提示写关于自己的句子：你的名字、年龄和你拥有的东西。",
  ),
  intro: t(
    "Turn a short profile note like `name: Mia` or `age: 9` into a complete English sentence: *My name is Mia.* and *I am nine years old.* Notice how each kind of note uses its own pattern (*My name is…*, *I am…*, *I have…*, *I like…*). In this topic, you pick and write clean self-introduction sentences from notes.",
    "把 `name: Mia` 或 `age: 9` 这样的简短信息写成完整的英语句子：*My name is Mia.* 和 *I am nine years old.* 每类信息都有固定句型（*My name is…*、*I am…*、*I have…*、*I like…*）。本主题带你根据提示选出并写出规范的自我介绍句。",
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
        "*My name is Ben.* *I am eight years old.* (not *I have eight years.*) *I have a dog.* *I have black hair.* *I like cats.*\n\n> **Watch out.** Check the verb for each note: use *is* for your name, *am* (never *have*) for your age, *have* (never *has*) for what you own or look like, and *like* (no *am* and no *-s*) for what you like.",
        "*My name is Ben.* *I am eight years old.*（说年龄用 *am*，不用 *have*，也不能漏掉 *am*）*I have a dog.* *I have black hair.*（颜色放在 *hair* 前面）*I like cats.*\n\n> **注意。** 按提示类型核对动词：名字用 *is*，年龄用 *am*（不用 *have*），拥有或外貌用 *have*（不用 *has*），喜欢用 *like*（不加 *am*，也不加 *-s*）。",
      ),
      choiceGenerator(
        t("Choose the sentence that matches the note.", "选出与提示相符的句子。"),
        aboutYouChoiceBank,
        (right, shown) => {
          const rule = noteRule[noteKind(shown)];
          return t(
            `${rule?.en}: ${right}\n\n**Check.** Verify the sentence has a subject (*I* or *My name*), the exact verb for this kind of note, and adjectives placed before the noun.`,
            `${rule?.["zh-CN"]}：${right}\n\n**检验。** 确认句子有主语（*I* 或 *My name*）、用了这类提示对应的动词，且形容词放在名词前面。`,
          );
        },
        (_wrong, _right, shown, position) => noteMistakes[noteKind(shown)]?.[position === 0 ? 0 : 1] ?? t("", ""),
      ),
    ),
    point(
      "write",
      t("Turning notes into sentences", "把提示写成句子"),
      t(
        "Write a whole sentence about yourself for each note: a capital letter, *I* or *My*, a verb, and a period.\n\n*age: 8* → *I am eight years old.*\n*have: a cat* → *I have a cat.*\n\n> **Watch out.** Spell number words out for ages (*eight*, not `8`), keep *I* capitalized, and never drop the verb (*am*, *is*, *have*, or *like*).",
        "根据每条提示写一个完整的句子：大写字母开头，用 *I* 或 *My*，要有动词，句末加句号。\n\n*age: 8* → *I am eight years old.*\n*have: a cat* → *I have a cat.*\n\n> **注意。** 年龄中的数字要拼写成英文词（如 *eight*），*I* 永远大写，也千万别漏掉动词（*am*、*is*、*have* 或 *like*）。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Write a sentence about yourself from the note.", "根据提示写一个关于自己的句子。"),
        aboutYouTypedBank,
        (right, shown) => {
          const rule = noteRule[noteKind(shown)];
          return t(
            `${rule?.en}, in a whole sentence with a capital letter and a period: ${right}\n\n**Check.** Check four items in your sentence: capital first letter, the right verb for the note, describing words before nouns, and a final period.`,
            `${rule?.["zh-CN"]}，写成完整的句子，大写开头，句号结尾：${right}\n\n**检验。** 核对四处：句首大写、动词与提示类型相符、形容词在名词前，以及句末句号。`,
          );
        },
        aboutYourselfNot,
      ),
    ),
  ],
};

/** topics are the topics of the unit My Body. */
export const topics: readonly TopicDef[] = [body.topic, adjectivesBeforeNouns, writingAboutYourself];

/** vocabulary are the words the unit My Body teaches. */
export const vocabulary: readonly WordBatch[] = [body.batch];
