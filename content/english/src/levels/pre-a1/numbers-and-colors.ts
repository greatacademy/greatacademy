// Pre-A1, unit 2: Numbers and Colors. The numbers to twelve, colors, questions with what and how, a and an, plurals,
// and the first rule of writing: a capital letter and a period.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { interleave, pairUp, vocabularyTopic, word } from "../words.ts";

const numbers = vocabularyTopic({
  id: "pre-a1-words-numbers",
  title: t("Numbers 1 to 12", "数字 1 到 12"),
  summary: t("Counting from one to twelve.", "从一数到十二。"),
  prerequisites: [],
  words: [
    word(
      "one",
      "the number 1",
      "一（1）",
      "I have {one} nose.|two three | One and {one} is two.|two three | A cat has {one} tail.|two four",
      "two three",
    ),
    word(
      "two",
      "the number 2",
      "二（2）",
      "I have {two} eyes.|three one | One and one is {two}.|three four | A bird has {two} legs.|four three",
      "three one",
    ),
    word(
      "three",
      "the number 3",
      "三（3）",
      "One and two is {three}.|four five | One, two, {three}, four.|five six | I have two cats and one dog. That is {three} animals.|two four",
      "four five",
    ),
    word(
      "four",
      "the number 4",
      "四（4）",
      "A dog has {four} legs.|two three | Two and two is {four}.|three five | Three, {four}, five.|six two",
      "three five",
    ),
    word(
      "five",
      "the number 5",
      "五（5）",
      "I have {five} fingers on one hand.|four six | Two and three is {five}.|four six | Four, {five}, six.|three seven",
      "four six",
    ),
    word(
      "six",
      "the number 6",
      "六（6）",
      "Three and three is {six}.|five seven | Five, {six}, seven.|four eight | A bee has {six} legs.|four eight",
      "five seven",
    ),
    word(
      "seven",
      "the number 7",
      "七（7）",
      "There are {seven} days in a week.|six eight | Four and three is {seven}.|six eight | Six, {seven}, eight.|five nine",
      "six eight",
    ),
    word(
      "eight",
      "the number 8",
      "八（8）",
      "A spider has {eight} legs.|six ten | Four and four is {eight}.|six nine | Seven, {eight}, nine.|six ten",
      "six nine",
    ),
    word(
      "nine",
      "the number 9",
      "九（9）",
      "Five and four is {nine}.|eight ten | Eight, {nine}, ten.|seven eleven | Ten take away one is {nine}.|eight eleven",
      "eight ten",
    ),
    word(
      "ten",
      "the number 10",
      "十（10）",
      "I have {ten} fingers.|eight twelve | Five and five is {ten}.|nine eleven | Nine, {ten}, eleven.|eight twelve",
      "nine eleven",
    ),
    word(
      "eleven",
      "the number 11",
      "十一（11）",
      "Ten and one is {eleven}.|twelve nine | Ten, {eleven}, twelve.|nine seven | A football team has {eleven} players.|ten twelve",
      "twelve ten",
    ),
    word(
      "twelve",
      "the number 12",
      "十二（12）",
      "There are {twelve} months in a year.|ten eleven | Six and six is {twelve}.|ten eleven | Ten, eleven, {twelve}.|nine seven",
      "eleven ten",
    ),
  ],
});

const colors = vocabularyTopic({
  id: "pre-a1-words-colors",
  title: t("Colors", "颜色"),
  summary: t("The names of the colors.", "颜色的名称。"),
  prerequisites: [],
  words: [
    word(
      "color colors",
      "what we call red, blue, green and the others",
      "颜色",
      "What {color} is your bag? It's red.|name year | Red is my best {color}.|name friend | My pens are many {colors}: red, blue and green.|names friends",
      "name year",
    ),
    word(
      "red",
      "the color of fire and of a stop light",
      "红色；红色的",
      "Stop! The light is {red}.|green white | A fire truck is {red}.|blue purple | Tomatoes are {red}.|blue gray",
      "blue green",
    ),
    word(
      "blue",
      "the color of the sky on a sunny day",
      "蓝色；蓝色的",
      "The sky is {blue}.|green pink | The sea is {blue}.|red yellow | Mix yellow and {blue} to make green.|red white",
      "green pink",
    ),
    word(
      "green",
      "the color of grass and leaves",
      "绿色；绿色的",
      "Grass is {green}.|blue pink | Go! The light is {green}.|red black | Mix blue and yellow to make {green}.|red pink",
      "blue red",
    ),
    word(
      "yellow",
      "the color of bananas and the sun",
      "黄色；黄色的",
      "Bananas are {yellow}.|blue black | The sun is {yellow}.|blue green | Lemons are {yellow}.|purple blue",
      "blue black",
    ),
    word(
      "black",
      "the darkest color, the color of the sky at night",
      "黑色；黑色的",
      "Night is dark. The sky is {black}.|yellow white | A panda is {black} and white.|blue pink | Crows are {black} birds.|pink yellow",
      "white yellow",
    ),
    word(
      "white",
      "the color of snow and milk",
      "白色；白色的",
      "Snow is {white}.|black green | Milk is {white}.|green blue | Clouds are {white}.|red green",
      "black green",
    ),
    word(
      "orange oranges",
      "a color like red and yellow together; also a round, sweet fruit of this color",
      "橙色；橙子",
      "Mix red and yellow to make {orange}.|blue green | Carrots are {orange}.|blue purple | A tiger is {orange} and black.|blue green | I eat two {oranges} for breakfast. They are sweet.|colors grays",
      "blue green",
    ),
    word(
      "pink",
      "a light red color",
      "粉红色；粉红色的",
      "Mix red and white to make {pink}.|green black | A pig is {pink}.|blue green | Strawberry ice cream is {pink}.|blue black",
      "green black",
    ),
    word(
      "brown",
      "the color of chocolate and of wood",
      "棕色；棕色的",
      "Chocolate is {brown}.|green blue | A bear is {brown}.|blue pink | Mud is {brown}.|blue pink",
      "green blue",
    ),
    word(
      "purple",
      "a color like red and blue together",
      "紫色；紫色的",
      "Mix red and blue to make {purple}.|green yellow | Grapes are {purple}.|orange white | An eggplant is {purple}.|yellow white",
      "green yellow",
    ),
    word(
      "gray",
      "a color like black and white together",
      "灰色；灰色的",
      "Mix black and white to make {gray}.|pink brown | An elephant is {gray}.|pink green | Rain clouds are dark {gray}.|pink yellow",
      "pink brown",
    ),
  ],
});

const howMany = vocabularyTopic({
  id: "pre-a1-words-how-many",
  title: t("What, How Many, How Old", "什么、多少、几岁"),
  summary: t("Question words, a, an and the, and and not.", "疑问词、a、an 和 the，以及 and 和 not。"),
  prerequisites: ["pre-a1-words-i-and-you"],
  words: [
    word(
      "what what's",
      "the word you use to ask about a thing",
      "什么",
      "{What} is your name?|How Many | {What's} this? It's a pen.|How's Where's | {What} color is it? It's red.|How Many | {What} is that? It is a book.|How Many",
      "how many",
    ),
    word(
      "how",
      "the word you use to ask in what way, or how much",
      "怎样；多么；多少",
      "{How} are you? I'm fine.|What Many | {How} old are you? I'm eight.|What Many | {How} many cats do you have?|What Not",
      "what many",
    ),
    word(
      "many",
      "a large number of; in a question, what number",
      "许多；（提问时）多少",
      "How {many} pens do you have?|old not | How {many} books are there? Ten.|old a | I have {many} friends at school.|a an",
      "old not",
    ),
    word(
      "old older oldest",
      "having lived for many years; also used to say how many years someone has lived",
      "老的；旧的；……岁的",
      "How {old} are you? I'm seven.|many not | I am ten years {old}.|many year | My grandpa is very {old}.|many not",
      "many not",
    ),
    word(
      "year years",
      "a time of twelve months",
      "年；岁",
      "I am eight {years} old.|names friends | There are twelve months in a {year}.|name color | Happy New {Year}!|Name Color",
      "name color",
    ),
    word(
      "a",
      "one; used before a word that starts with a sound like b, c or d",
      "一（个）（用在辅音开头的词前）",
      "I have {a} dog.|an and | She is {a} teacher.|an and | That is {a} big egg.|an and",
      "an and",
    ),
    word(
      "an",
      "one; used before a word that starts with a sound like a, e, i, o or u",
      "一（个）（用在元音开头的词前）",
      "It is {an} egg.|a and | I have {an} apple.|a and | He is {an} old man.|a and | That is {an} orange cat.|a and",
      "a and",
    ),
    word(
      "the",
      "the word before a thing we both know about",
      "这个；那个（特指）",
      "Open {the} door, please.|an and | {The} sun is yellow.|An And | Look at {the} moon!|an and",
      "an and",
    ),
    word(
      "and",
      "a word that joins two words or ideas",
      "和；而且",
      "I have a cat {and} a dog.|not the | Tom {and} I are friends.|not the | Red {and} yellow make orange.|not a",
      "not the",
    ),
    word(
      "not",
      "a word that makes a sentence say no",
      "不；没有",
      "I am {not} sad. I am happy.|and a | It is {not} a cat. It is a dog.|and the | She is {not} at home today.|and an",
      "and the",
    ),
  ],
});

// A and an.

/** consonantNouns start with a consonant sound and take a. */
const consonantNouns: readonly string[] = [
  "pen",
  "book",
  "cat",
  "dog",
  "bag",
  "desk",
  "red apple",
  "big egg",
  "chair",
  "girl",
  "boy",
  "ruler",
  "pencil",
];

/** vowelNouns start with a vowel sound and take an. */
const vowelNouns: readonly string[] = ["egg", "apple", "orange", "eraser", "elephant", "old book", "umbrella", "ant", "owl", "ear", "eye"];

const articleChoiceBank: readonly ChoiceItem[] = interleave([
  pairUp(26, consonantNouns, ["It is ___ X.", "I have ___ X."]).map(([noun, frame]): ChoiceItem => [frame.replace("X", noun), "a", ["an"]]),
  pairUp(22, vowelNouns, ["This is ___ X.", "I see ___ X."]).map(([noun, frame]): ChoiceItem => [frame.replace("X", noun), "an", ["a"]]),
]);

const missingArticleBank: readonly TypedItem[] = pairUp(
  48,
  [...consonantNouns.slice(0, 8).map((n) => [n, "a"] as const), ...vowelNouns.slice(0, 8).map((n) => [n, "an"] as const)],
  ["It is X.", "This is X.", "That is X."],
).map(([[noun, article], frame]): TypedItem => {
  const other = article === "a" ? "an" : "a";
  return {
    shown: frame.replace("X", noun),
    accepted: [frame.replace("X", `${article} ${noun}`)],
    wrong: [frame.replace("X", noun), frame.replace("X", `${other} ${noun}`)],
  };
});

const aAndAn: TopicDef = {
  id: "a-and-an",
  title: t("A and An", "a 和 an"),
  summary: t("One thing takes a or an: a pen, an egg.", "一个东西前面要用 a 或 an：a pen、an egg。"),
  prerequisites: ["pre-a1-words-how-many"],
  encompasses: [{ topic: "pre-a1-words-how-many", weight: 0.3 }],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("A or an?", "用 a 还是 an？"),
      t(
        "Use *an* when the next word starts with the sound of *a*, *e*, *i*, *o* or *u*: *an egg*, *an apple*, *an old book*. Use *a* before other sounds: *a pen*, *a big egg*.\n\nLook at the word right after it, not at the noun: *a big egg*, but *an egg*.",
        "下一个词以 *a*、*e*、*i*、*o*、*u* 的音开头时用 *an*：*an egg*、*an apple*、*an old book*。其他音前面用 *a*：*a pen*、*a big egg*。\n\n要看紧跟在后面的那个词，而不是名词：*a big egg*，但 *an egg*。",
      ),
      choiceGenerator(t("Choose a or an.", "选择 a 或 an。"), articleChoiceBank, (right, shown) =>
        t(
          `${shown.replace("___", `*${right}*`)}`,
          `${shown.replace("___", `*${right}*`)} 后面的词${right === "an" ? "以元音开头，用 *an*" : "以辅音开头，用 *a*"}。`,
        ),
      ),
    ),
    point(
      "do-not-leave-out",
      t("Never leaving out a or an", "不要漏掉 a 或 an"),
      t(
        "When you talk about one thing, English needs *a* or *an* before it: *It is a pen.*, not *It is pen.*",
        "中文说“这是笔”“我有猫”，不需要“一个”；英语说单个的东西时，前面一定要有 *a* 或 *an*：说 *It is a pen.*，不说 *It is pen.*",
      ),
      typedGenerator(
        "sentence",
        t("A word is missing. Write the sentence with a or an.", "句子缺了一个词。用 a 或 an 把句子写完整。"),
        missingArticleBank,
        (right) => t(`${right} One thing takes *a* or *an*.`, `${right} 单个的东西前面要用 *a* 或 *an*。`),
      ),
    ),
  ],
};

// Plurals with -s and -es.

/** sNouns take -s in the plural. */
const sNouns: readonly string[] = ["cat", "dog", "pen", "book", "bag", "desk", "chair", "girl", "boy", "egg", "apple", "pencil", "ruler"];

/** esNouns end in s, x, ch or sh and take -es. */
const esNouns: readonly string[] = ["box", "bus", "glass", "watch", "dish", "fox", "class"];

const counts: readonly string[] = ["two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];

const plural = (noun: string) => (esNouns.includes(noun) ? `${noun}es` : `${noun}s`);

const pluralChoiceBank: readonly ChoiceItem[] = interleave([
  pairUp(33, sNouns, counts).map(([noun, count]): ChoiceItem => [`I have ${count} ___. (${noun})`, `${noun}s`, [noun, `${noun}es`]]),
  pairUp(14, esNouns, ["three", "six"]).map(
    ([noun, count]): ChoiceItem => [`There are ${count} ___. (${noun})`, `${noun}es`, [noun, `${noun}s`]],
  ),
]);

const pluralTypedBank: readonly TypedItem[] = pairUp(
  40,
  [...sNouns, ...esNouns],
  ["one X, two ___", "one X, four ___", "one X, ten ___"],
).map(
  ([noun, frame]): TypedItem => ({
    shown: frame.replace("X", noun),
    accepted: [plural(noun)],
    wrong: [noun, esNouns.includes(noun) ? `${noun}s` : `${noun}es`],
  }),
);

const pluralNouns: TopicDef = {
  id: "plural-nouns-with-s",
  title: t("One Cat, Two Cats", "一只猫，两只猫"),
  summary: t("More than one takes -s or -es: two cats, three boxes.", "多于一个时，名词加 -s 或 -es：two cats、three boxes。"),
  prerequisites: ["pre-a1-words-numbers", "a-and-an"],
  encompasses: [{ topic: "pre-a1-words-numbers", weight: 0.3 }],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Adding -s", "加 -s"),
      t(
        "For more than one, add *-s* to the noun: *one cat, two cats*. Add *-es* after *s*, *x*, *ch* and *sh*: *one box, three boxes*; *one watch, two watches*.",
        "中文用量词表示数量（三只猫、两本书），名词本身不变。英语没有量词，但名词要变：多于一个时加 *-s*：*one cat, two cats*。以 *s*、*x*、*ch*、*sh* 结尾的词加 *-es*：*one box, three boxes*；*one watch, two watches*。",
      ),
      choiceGenerator(t("Choose the word for the gap.", "选出填入空白处的词。"), pluralChoiceBank, (right, shown) =>
        t(
          `${shown.replace(/ \(.*\)$/u, "").replace("___", `*${right}*`)}`,
          `${shown.replace(/ \(.*\)$/u, "").replace("___", `*${right}*`)} 多于一个，名词用复数。`,
        ),
      ),
    ),
    point(
      "type",
      t("Writing plurals", "写出复数"),
      t(
        "Write the noun for more than one. Most nouns add *-s*; nouns that end in *s*, *x*, *ch* or *sh* add *-es*.",
        "写出名词的复数。大多数名词加 *-s*；以 *s*、*x*、*ch*、*sh* 结尾的名词加 *-es*。",
      ),
      typedGenerator("word-form", t("Type the missing word.", "输入缺少的词。"), pluralTypedBank, (right, shown) =>
        t(`${shown.replace("___", `*${right}*`)}`, `${shown.replace("___", `*${right}*`)}（复数形式）`),
      ),
    ),
  ],
};

// Writing: capital letters and periods.

/** capitalSentences are written right: a capital at the start, a capital I and names, and a period or question mark. */
const capitalSentences: readonly string[] = [
  "My name is Ben.",
  "I am seven years old.",
  "What is your name?",
  "How old are you?",
  "It is a red pen.",
  "The sky is blue.",
  "I have a cat and a dog.",
  "Tom and I are friends.",
  "She is not sad.",
  "Is it an egg?",
  "We are in the classroom.",
  "They are my friends.",
  "My bag is green.",
  "How many pens do you have?",
  "I have twelve books.",
  "Lily is my friend.",
  "What color is it?",
  "It is not a cat.",
  "I am happy today.",
  "You are very kind.",
  "Is it blue?",
  "Anna and I are ten.",
  "The cats are white.",
  "He is at school.",
  "What is this?",
  "It is an orange.",
  "Thank you, Ms. Li.",
  "I have three pencils.",
  "Are you a student?",
  "My friends are here.",
  "Grass is green.",
  "Sam is eight years old.",
  "How are you?",
  "I am not at home.",
  "We have two dogs.",
  "Is she your friend?",
];

const careless = (s: string) => s.toLowerCase().replace(/[.?]$/u, "");

const capitalsTypedBank: readonly TypedItem[] = capitalSentences.map(
  (s): TypedItem => ({ shown: careless(s), accepted: [s], wrong: [careless(s), `${careless(s)}.`] }),
);

const capitalsChoiceBank: readonly ChoiceItem[] = capitalSentences.map((s): ChoiceItem => {
  const noCapital = s.charAt(0).toLowerCase() + s.slice(1);
  const noEnd = s.slice(0, -1);
  const wrongEnd = s.endsWith("?") ? `${noEnd}.` : `${noEnd}?`;
  return ["", s, [noCapital, /\sI\b/u.test(s) ? s.replace(/(\s)I\b/u, "$1i") : wrongEnd]];
});

const capitalsAndPeriods: TopicDef = {
  id: "writing-capitals-and-periods",
  title: t("Capital Letters and Periods", "大写字母和句号"),
  summary: t(
    "A sentence begins with a capital letter and ends with a period or a question mark, and I is always a capital.",
    "句子以大写字母开头，以句号或问号结尾，I 永远大写。",
  ),
  prerequisites: ["the-verb-be"],
  encompasses: [{ topic: "the-verb-be", weight: 0.2 }],
  xp: 15,
  strand: "writing",
  knowledgePoints: [
    point(
      "choose",
      t("Spotting the right sentence", "找出写对的句子"),
      t(
        "A sentence starts with a capital letter: *My*, not *my*. It ends with a period (.), or with a question mark (?) when it asks something. The word *I* and names like *Ben* always start with a capital.",
        "英语句子以大写字母开头：写 *My*，不写 *my*。陈述句以句号（.）结尾——注意英语句号是一个小圆点，不是中文的“。”；问句以问号（?）结尾。*I* 和 *Ben* 这样的名字永远大写。",
      ),
      choiceGenerator(t("Which sentence is written right?", "哪个句子写对了？"), capitalsChoiceBank, (right) =>
        t(`${right} It starts with a capital letter and ends with the right mark.`, `${right} 句首大写，句末标点正确。`),
      ),
    ),
    point(
      "write",
      t("Writing sentences right", "正确地写句子"),
      t(
        "Copy the sentence with a capital letter at the start, capitals for *I* and for names, and a period or a question mark at the end.",
        "抄写句子：句首大写，*I* 和名字大写，句末加句号或问号。",
      ),
      typedGenerator(
        "sentence",
        t("Write the sentence again with capital letters and a period or question mark.", "重写句子，加上大写字母和句号或问号。"),
        capitalsTypedBank,
        (right) => t(`${right}`, `${right} 句首大写，句末加标点。`),
      ),
    ),
  ],
};

/** topics are the topics of the unit Numbers and Colors. */
export const topics: readonly TopicDef[] = [numbers.topic, colors.topic, howMany.topic, aAndAn, pluralNouns, capitalsAndPeriods];

/** vocabulary are the words the unit Numbers and Colors teaches. */
export const vocabulary: readonly WordBatch[] = [numbers.batch, colors.batch, howMany.batch];
