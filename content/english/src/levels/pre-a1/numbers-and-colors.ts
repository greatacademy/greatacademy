// Pre-A1, unit 2: Numbers and Colors. The numbers to twelve, colors, questions with what and how, a and an, plurals,
// and the first rule of writing: a capital letter and a period.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, interleave, vocabularyTopic, word } from "../words.ts";

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

/** articleFrames read naturally with every noun of both lists: they point at a thing, an animal or a person. */
const articleFrames: readonly string[] = ["It is ___ X.", "This is ___ X.", "That is ___ X.", "I see ___ X.", "Here is ___ X."];

const articleChoiceBank: readonly ChoiceItem[] = interleave([
  everyPair(consonantNouns, articleFrames).map(([noun, frame]): ChoiceItem => [frame.replace("X", noun), "a", ["an"]]),
  everyPair(vowelNouns, articleFrames).map(([noun, frame]): ChoiceItem => [frame.replace("X", noun), "an", ["a"]]),
]);

const missingArticleBank: readonly TypedItem[] = everyPair(
  interleave<readonly [string, "a" | "an"]>([consonantNouns.map((n) => [n, "a"] as const), vowelNouns.map((n) => [n, "an"] as const)]),
  articleFrames.map((f) => f.replace("___ ", "")),
).map(([[noun, article], frame]): TypedItem => {
  const other = article === "a" ? "an" : "a";
  return {
    shown: frame.replace("X", noun),
    accepted: [frame.replace("X", `${article} ${noun}`)],
    wrong: [frame.replace("X", noun), frame.replace("X", `${other} ${noun}`)],
  };
});

/** nextWord finds the word right after the gap of a sentence, the one that decides between a and an. */
const nextWord = (shown: string) => (shown.split("___ ")[1] ?? "").split(/[ .]/u)[0] ?? "";

/** soundOf says how the word after the article starts and which article that sound takes. */
const soundOf = (article: string, next: string): Text =>
  article === "an"
    ? t(`*${next}* starts with a vowel sound, so it takes *an*`, `*${next}* 以元音开头，所以用 *an*`)
    : t(`*${next}* starts with a consonant sound, so it takes *a*`, `*${next}* 以辅音开头，所以用 *a*`);

const aAndAn: TopicDef = {
  id: "a-and-an",
  title: t("A and An", "a 和 an"),
  summary: t("One thing takes a or an: a pen, an egg.", "一个东西前面要用 a 或 an：a pen、an egg。"),
  intro: t(
    "Compare *an umbrella* with *a red umbrella*: both name one umbrella, yet *an* changes to *a* because the word directly after it starts with a consonant sound (*red*). In this topic, you pick *a* or *an* by the very next sound and fix sentences that drop the article before a singular noun.",
    "比较 *an umbrella* 和 *a red umbrella*：说的都是一把伞，但 *an* 变成了 *a*，因为紧跟其后的词 *red* 以辅音开头。本主题带你按紧随其后的发音选择 *a* 或 *an*，并补全单数名词前漏掉的冠词。",
  ),
  prerequisites: ["pre-a1-words-how-many"],
  encompasses: [{ topic: "pre-a1-words-how-many", weight: 0.3 }],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("A or an?", "用 a 还是 an？"),
      t(
        "Use *an* when the next word starts with the sound of *a*, *e*, *i*, *o* or *u*: *an egg*, *an apple*, *an old book*. Use *a* before other sounds: *a pen*, *a big egg*.\n\nLook at the word right after it, not at the noun: *a big egg*, but *an egg*.\n\n> **Watch out.** Always check the word *immediately* after the blank—an adjective like *red* or *old* sits between the article and the noun and decides between *a* and *an*.",
        "下一个词以 *a*、*e*、*i*、*o*、*u* 的音开头时用 *an*：*an egg*、*an apple*、*an old book*。其他音前面用 *a*：*a pen*、*a big egg*。\n\n要看紧跟在后面的那个词，而不是名词：*a big egg*，但 *an egg*。\n\n> **注意。** 永远只看*紧挨着*空白的那个词——像 *red*、*old* 这样的形容词夹在冠词和名词中间时，由它来决定用 *a* 还是 *an*。",
      ),
      choiceGenerator(
        t("Choose a or an.", "选择 a 或 an。"),
        articleChoiceBank,
        (right, shown) => {
          const sound = soundOf(right, nextWord(shown));
          return t(
            `The word after the gap decides: ${sound.en}. ${shown.replace("___", `*${right}*`)}\n\n**Check.** Say *${right} ${nextWord(shown)}* aloud—the opening sound of *${nextWord(shown)}* pairs smoothly with *${right}*.`,
            `看空白后面的那个词：${sound["zh-CN"]}。${shown.replace("___", `*${right}*`)}\n\n**检验。** 把 *${right} ${nextWord(shown)}* 读出来——*${nextWord(shown)}* 的开头音正好与 *${right}* 搭配。`,
          );
        },
        (wrong, _right, shown) => {
          const next = nextWord(shown);
          return wrong === "an"
            ? t(
                `*an* goes before a vowel sound, but *${next}* starts with a consonant sound.`,
                `*an* 用在元音前，但 *${next}* 以辅音开头。`,
              )
            : t(`*a* goes before a consonant sound, but *${next}* starts with a vowel sound.`, `*a* 用在辅音前，但 *${next}* 以元音开头。`);
        },
      ),
    ),
    point(
      "do-not-leave-out",
      t("Never leaving out a or an", "不要漏掉 a 或 an"),
      t(
        "When you talk about one thing, English needs *a* or *an* before it: *It is a pen.*, not *It is pen.*\n\n> **Watch out.** Put *a* or *an* before the *whole* noun phrase (including any adjective): write *It is a red apple.*, never *It is red a apple.*",
        "中文说“这是笔”“我有猫”，不需要“一个”；英语说单个的东西时，前面一定要有 *a* 或 *an*：说 *It is a pen.*，不说 *It is pen.*\n\n> **注意。** 把 *a* 或 *an* 放在整个名词短语（含形容词）的最前面：写 *It is a red apple.*，不要写成 *It is red a apple.*",
      ),
      typedGenerator(
        "sentence",
        t("A word is missing. Write the sentence with a or an.", "句子缺了一个词。用 a 或 an 把句子写完整。"),
        missingArticleBank,
        (right, shown) => {
          const article = / an /u.test(right) ? "an" : "a";
          const next = right.split(` ${article} `)[1]?.split(/[ .]/u)[0] ?? "";
          const sound = soundOf(article, next);
          return t(
            `*${shown}* talks about one thing, so it needs *a* or *an*, and ${sound.en}: ${right}\n\n**Check.** Verify that *${article}* sits right before the singular noun phrase and matches the starting sound of *${next}*.`,
            `*${shown}* 说的是单个的东西，所以要有 *a* 或 *an*；${sound["zh-CN"]}：${right}\n\n**检验。** 确认 *${article}* 放在单数名词短语前面，并且与 *${next}* 的开头音一致。`,
          );
        },
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
  everyPair(sNouns, counts).map(([noun, count]): ChoiceItem => [`I see ${count} ___. (${noun})`, `${noun}s`, [noun, `${noun}es`]]),
  everyPair(esNouns, counts).map(([noun, count]): ChoiceItem => [`There are ${count} ___. (${noun})`, `${noun}es`, [noun, `${noun}s`]]),
]);

const pluralTypedBank: readonly TypedItem[] = everyPair(interleave([sNouns, esNouns]), ["two", "three", "four", "five", "six", "ten"]).map(
  ([noun, count]): TypedItem => ({
    shown: `one ${noun}, ${count} ___`,
    accepted: [plural(noun)],
    wrong: [noun, esNouns.includes(noun) ? `${noun}s` : `${noun}es`],
  }),
);

/** pluralRule says which ending a plural takes and why. */
const pluralRule = (plural: string): Text => {
  const noun = esNouns.find((n) => plural === `${n}es`);
  return noun
    ? t(
        `*${noun}* ends in *${noun.match(/(ch|sh|s|x)$/u)?.[0]}*, so it adds *-es*`,
        `*${noun}* 以 *${noun.match(/(ch|sh|s|x)$/u)?.[0]}* 结尾，所以加 *-es*`,
      )
    : t(`*${plural.slice(0, -1)}* just adds *-s*`, `*${plural.slice(0, -1)}* 直接加 *-s*`);
};

const pluralNouns: TopicDef = {
  id: "plural-nouns-with-s",
  title: t("One Cat, Two Cats", "一只猫，两只猫"),
  summary: t("More than one takes -s or -es: two cats, three boxes.", "多于一个时，名词加 -s 或 -es：two cats、three boxes。"),
  intro: t(
    "Compare *one desk, four desks* with *one dish, four dishes*: whenever you count more than one thing in English, the noun itself changes at the end, adding *-s* or *-es* depending on its final letters. In this topic, you choose and spell regular plural nouns accurately.",
    "比较 *one desk, four desks* 与 *one dish, four dishes*：英语里只要数量超过一个，名词词尾就会变化，按末尾字母加 *-s* 或 *-es*。本主题带你准确选择并拼写规则复数名词。",
  ),
  prerequisites: ["pre-a1-words-numbers", "a-and-an"],
  encompasses: [{ topic: "pre-a1-words-numbers", weight: 0.3 }],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Adding -s", "加 -s"),
      t(
        "For more than one, add *-s* to the noun: *one cat, two cats*. Add *-es* after *s*, *x*, *ch* and *sh*: *one box, three boxes*; *one watch, two watches*.\n\n> **Watch out.** Do not leave the noun unchanged after a number like *two* or *five*, and only add *-es* when the singular ends in *s*, *x*, *ch*, or *sh*.",
        "中文用量词表示数量（三只猫、两本书），名词本身不变。英语没有量词，但名词要变：多于一个时加 *-s*：*one cat, two cats*。以 *s*、*x*、*ch*、*sh* 结尾的词加 *-es*：*one box, three boxes*；*one watch, two watches*。\n\n> **注意。** 在 *two*、*five* 等数字后面不要漏加复数词尾，同时只有单数以 *s*、*x*、*ch* 或 *sh* 结尾时才加 *-es*。",
      ),
      choiceGenerator(
        t("Choose the word for the gap.", "选出填入空白处的词。"),
        pluralChoiceBank,
        (right, shown) => {
          const rule = pluralRule(right);
          return t(
            `The number says more than one, so the noun is plural, and ${rule.en}: ${shown.replace(/ \(.*\)$/u, "").replace("___", `*${right}*`)}\n\n**Check.** Look at the singular noun's last letters—if they are *s*, *x*, *ch*, or *sh*, add *-es*; otherwise add *-s*.`,
            `数字表示多于一个，所以名词用复数；${rule["zh-CN"]}：${shown.replace(/ \(.*\)$/u, "").replace("___", `*${right}*`)}\n\n**检验。** 看原形名词的末尾字母——是 *s*、*x*、*ch* 或 *sh* 就加 *-es*，其余直接加 *-s*。`,
          );
        },
        (wrong, _right, _shown, position) =>
          position === 0
            ? t(
                `*${wrong}* is the form for one, but the number before the gap says more than one.`,
                `*${wrong}* 是单数形式，可空白前的数字表示多于一个。`,
              )
            : wrong.endsWith("es")
              ? t(
                  `*${wrong}* adds *-es*, but *-es* is only for nouns that end in *s*, *x*, *ch* or *sh*.`,
                  `*${wrong}* 加了 *-es*，可只有以 *s*、*x*、*ch*、*sh* 结尾的名词才加 *-es*。`,
                )
              : t(
                  `*${wrong}* adds only *-s*, which is hard to say after *s*, *x*, *ch* or *sh*; those nouns add *-es*.`,
                  `*${wrong}* 只加了 *-s*，可以 *s*、*x*、*ch*、*sh* 结尾的名词要加 *-es*，否则读不出来。`,
                ),
      ),
    ),
    point(
      "type",
      t("Writing plurals", "写出复数"),
      t(
        "Write the noun for more than one. Most nouns add *-s* (*two books*); nouns that end in *s*, *x*, *ch* or *sh* add *-es* (*three buses*).\n\n> **Watch out.** Check the final letters before you type *-s* or *-es*: words like *bus*, *glass*, *box*, *watch*, and *dish* need *-es*, not just *-s*.",
        "写出名词的复数。大多数名词加 *-s*（*two books*）；以 *s*、*x*、*ch*、*sh* 结尾的名词加 *-es*（*three buses*）。\n\n> **注意。** 输入前先看末尾字母：*bus*、*glass*、*box*、*watch*、*dish* 这类词要加 *-es*，不能只加 *-s*。",
      ),
      typedGenerator("word-form", t("Type the missing word.", "输入缺少的词。"), pluralTypedBank, (right, shown) => {
        const rule = pluralRule(right);
        return t(
          `More than one needs the plural, and ${rule.en}: ${shown.replace("___", `*${right}*`)}\n\n**Check.** Verify the base spelling is untouched and that the ending matches the final letters (*-es* after *s/x/ch/sh*, *-s* otherwise).`,
          `多于一个要用复数；${rule["zh-CN"]}：${shown.replace("___", `*${right}*`)}\n\n**检验。** 确认原词拼写未改动，且词尾与末尾字母匹配（*s/x/ch/sh* 后加 *-es*，其余加 *-s*）。`,
        );
      }),
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

/** endMark names the mark a sentence ends with and why. */
const endMark = (sentence: string): Text =>
  sentence.endsWith("?")
    ? t("a question mark, because it asks something", "问号，因为它在提问")
    : t("a period, because it tells something", "句号，因为它在陈述");

const capitalsAndPeriods: TopicDef = {
  id: "writing-capitals-and-periods",
  title: t("Capital Letters and Periods", "大写字母和句号"),
  summary: t(
    "A sentence begins with a capital letter and ends with a period or a question mark, and I is always a capital.",
    "句子以大写字母开头，以句号或问号结尾，I 永远大写。",
  ),
  intro: t(
    "Compare *anna and i are friends* with *Anna and I are friends.* Every written English sentence has clear boundaries: a capital letter at the start, capitals for *I* and names, and a period (.) or question mark (?) at the end. In this topic, you spot and write sentences with correct capitals and end marks.",
    "比较 *anna and i are friends* 和 *Anna and I are friends.* 英语书面句子有明确的边界：句首字母大写，*I* 和人名大写，句末加句号（.）或问号（?）。本主题带你辨认并写出大小写和句末标点都规范的句子。",
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
        "A sentence starts with a capital letter: *My*, not *my*. It ends with a period (.), or with a question mark (?) when it asks something. The word *I* and names like *Ben* always start with a capital.\n\n> **Watch out.** Check *all three* places before picking: the very first letter, every *I* or person's name inside the sentence, and whether the sentence tells (.) or asks (?).",
        "英语句子以大写字母开头：写 *My*，不写 *my*。陈述句以句号（.）结尾——注意英语句号是一个小圆点，不是中文的“。”；问句以问号（?）结尾。*I* 和 *Ben* 这样的名字永远大写。\n\n> **注意。** 选择前检查*三处*：句首第一个字母、句中所有的 *I* 和人名，以及句子是在陈述（.）还是在提问（?）。",
      ),
      choiceGenerator(
        t("Which sentence is written right?", "哪个句子写对了？"),
        capitalsChoiceBank,
        (right) => {
          const end = endMark(right);
          return t(
            `${right} It starts with a capital letter, writes *I* and names with capitals, and ends with ${end.en}.\n\n**Check.** Scan left to right: capital at the start, every *I* and name capitalized, and the end mark matches whether the sentence tells or asks.`,
            `${right} 句首大写，*I* 和名字大写，句末用${end["zh-CN"]}。\n\n**检验。** 从左到右扫一遍：句首大写，所有 *I* 和人名大写，句末标点与陈述或提问一致。`,
          );
        },
        (wrong, right) =>
          wrong.charAt(0) !== right.charAt(0)
            ? t(
                "This sentence starts with a small letter, but a sentence always starts with a capital.",
                "这个句子以小写字母开头，可句子总要以大写字母开头。",
              )
            : wrong.slice(-1) !== right.slice(-1)
              ? t(
                  "This sentence ends with the wrong mark: a question ends with ?, and a sentence that tells something ends with a period.",
                  "这个句子的句末标点不对：问句以 ? 结尾，陈述句以句号结尾。",
                )
              : t(
                  "This sentence writes *I* as a small *i*, but the word *I* is always a capital.",
                  "这个句子把 *I* 写成了小写 *i*，可 *I* 永远大写。",
                ),
      ),
    ),
    point(
      "write",
      t("Writing sentences right", "正确地写句子"),
      t(
        "Copy the sentence with a capital letter at the start, capitals for *I* and for names, and a period or a question mark at the end: *how old are you* → *How old are you?*\n\n> **Watch out.** Do not forget capitals *inside* the sentence (like *Tom*, *Ms. Li*, or *I*), and use `?` if the sentence starts with a question word or verb (*What*, *How*, *Is*, *Are*).",
        "抄写句子：句首大写，*I* 和名字大写，句末加句号或问号，例如 *how old are you* → *How old are you?*\n\n> **注意。** 别忘了句中的大写（如 *Tom*、*Ms. Li* 和 *I*）；以疑问词或动词（*What*、*How*、*Is*、*Are*）开头的问句要以 `?` 结尾。",
      ),
      typedGenerator(
        "sentence",
        t("Write the sentence again with capital letters and a period or question mark.", "重写句子，加上大写字母和句号或问号。"),
        capitalsTypedBank,
        (right) => {
          const end = endMark(right);
          return t(
            `Start with a capital letter, write *I* and names with capitals, and end with ${end.en}: ${right}\n\n**Check.** Check three spots in your sentence: first letter capitalized, any *I* or name capitalized, and a final period or question mark.`,
            `句首大写，*I* 和名字大写，句末用${end["zh-CN"]}：${right}\n\n**检验。** 核对句子里的三处：首字母大写、句中 *I* 和人名大写，以及末尾的句号或问号。`,
          );
        },
      ),
    ),
  ],
};

/** topics are the topics of the unit Numbers and Colors. */
export const topics: readonly TopicDef[] = [numbers.topic, colors.topic, howMany.topic, aAndAn, pluralNouns, capitalsAndPeriods];

/** vocabulary are the words the unit Numbers and Colors teaches. */
export const vocabulary: readonly WordBatch[] = [numbers.batch, colors.batch, howMany.batch];
