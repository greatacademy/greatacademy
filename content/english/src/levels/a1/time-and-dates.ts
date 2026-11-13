// A1, unit 3: Time and Dates. Telling the time, days, months and dates, at, on and in for time, and capital letters
// for names.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, interleave, sentenceCase, vocabularyTopic, word } from "../words.ts";

const time = vocabularyTopic({
  id: "a1-words-time",
  title: t("Telling the Time", "看时间"),
  summary: t("O'clock, half past, a quarter past, minutes and hours, early and late.", "整点、半点、一刻钟，分钟和小时，早和晚。"),
  prerequisites: ["a1-words-times-of-day"],
  words: [
    word(
      "time times",
      "what a clock shows; the hour and the minutes",
      "时间；时刻",
      "What {time} is it? — It's three o'clock.|clock hour | It's {time} for bed. Good night!|week clock | We have no {time}. Hurry up!|clock weekend",
      "clock hour",
    ),
    word(
      "clock clocks",
      "a thing on a wall or a table that shows the time",
      "钟",
      "Look at the {clock}. It's ten o'clock.|minute week | The {clock} in the kitchen is slow.|minute hour | There is a big {clock} on the station wall.|week minute",
      "minute hour",
    ),
    word(
      "o'clock",
      "used after a number from one to twelve to say an hour",
      "……点钟（整点）",
      "School starts at eight {o'clock}.|half quarter | It's six {o'clock}. Time for dinner!|half past | At nine {o'clock} I go to bed.|minute past",
      "half quarter",
    ),
    word(
      "half halves",
      "one of two equal parts",
      "一半；半",
      "It's {half} past seven: seven thirty.|quarter hour | Thirty minutes is {half} an hour.|quarter week | Cut the apple in {half}, one part for you and one for me.|quarter past",
      "quarter hour",
    ),
    word(
      "quarter quarters",
      "one of four equal parts; fifteen minutes",
      "四分之一；一刻钟",
      "It's a {quarter} past nine: nine fifteen.|half minute | Fifteen minutes is a {quarter} of an hour.|half week | Cut the pizza into four. Each {quarter} is for one of us.|half minute",
      "half minute",
    ),
    word(
      "past",
      "after; used to say the minutes after an hour",
      "（时间）过；在……之后",
      "It's half {past} six: six thirty.|o'clock quarter | It's ten {past} four: four ten.|early hour | We walked {past} the school.|late hour",
      "late early",
    ),
    word(
      "minute minutes",
      "sixty seconds; there are sixty in an hour",
      "分钟",
      "Wait a {minute}, please. I'm coming.|week hour | There are sixty {minutes} in an hour.|weeks days | The bus comes in five {minutes}.|weekends weeks",
      "hour week",
    ),
    word(
      "hour hours",
      "sixty minutes",
      "小时",
      "There are twenty-four {hours} in a day.|minutes weeks | The movie is two {hours} long.|weeks clocks | I sleep for nine {hours} every night.|weeks clocks",
      "minute week",
    ),
    word(
      "week weeks",
      "seven days",
      "星期；周",
      "There are seven days in a {week}.|minute hour | We have English three times a {week}.|minute clock | I see you next {week}!|minute clock",
      "hour minute",
    ),
    word(
      "weekend weekends",
      "Saturday and Sunday",
      "周末",
      "We have no school on the {weekend}. We play all day.|week hour | Saturday and Sunday are the {weekend}.|week hour | What do you do on the {weekend}? — I visit my grandma.|week minute",
      "week hour",
    ),
    word(
      "late later latest",
      "after the right time",
      "迟的；晚",
      "Hurry! We are {late} for school!|early past | The bus came at nine, not eight. It was {late}.|early half | It's {late}. Go to bed now.|early past",
      "early past",
    ),
    word(
      "early earlier earliest",
      "before the usual or right time",
      "早的；早",
      "I get up {early}, at five o'clock.|late past | The class starts at nine. We are {early}: it's only eight thirty.|late past | Let's go to bed {early} tonight. We're tired.|late past",
      "late past",
    ),
  ],
});

const days = vocabularyTopic({
  id: "a1-words-days",
  title: t("Days of the Week", "星期"),
  summary: t("Monday to Sunday, the month, next and last.", "星期一到星期日，月，next 和 last。"),
  prerequisites: ["a1-words-times-of-day"],
  words: [
    word(
      "Monday Mondays",
      "the day after Sunday",
      "星期一",
      "{Monday} is the first day of the school week.|Friday Saturday | Sunday, then {Monday}, then Tuesday.|Friday Saturday | I don't like {Mondays}. The weekend is over!|Fridays Saturdays",
      "Friday Saturday",
    ),
    word(
      "Tuesday Tuesdays",
      "the day after Monday",
      "星期二",
      "Monday, {Tuesday}, Wednesday.|Thursday Friday | {Tuesday} comes after Monday.|Thursday Saturday | Today is Monday, so tomorrow is {Tuesday}.|Thursday Sunday",
      "Thursday Friday",
    ),
    word(
      "Wednesday Wednesdays",
      "the day after Tuesday",
      "星期三",
      "Tuesday, {Wednesday}, Thursday.|Monday Friday | {Wednesday} is in the middle of the school week.|Monday Sunday | Today is Tuesday, so tomorrow is {Wednesday}.|Monday Friday",
      "Monday Friday",
    ),
    word(
      "Thursday Thursdays",
      "the day after Wednesday",
      "星期四",
      "Wednesday, {Thursday}, Friday.|Tuesday Monday | {Thursday} comes before Friday.|Tuesday Sunday | Today is Wednesday, so tomorrow is {Thursday}.|Tuesday Monday",
      "Tuesday Monday",
    ),
    word(
      "Friday Fridays",
      "the day after Thursday; the last school day of the week",
      "星期五",
      "{Friday} is the last day of the school week.|Monday Tuesday | Thursday, {Friday}, Saturday.|Monday Wednesday | Today is Thursday, so tomorrow is {Friday}.|Monday Tuesday",
      "Monday Tuesday",
    ),
    word(
      "Saturday Saturdays",
      "the day after Friday; the first day of the weekend",
      "星期六",
      "{Saturday} is the first day of the weekend.|Monday Wednesday | Friday, {Saturday}, Sunday.|Monday Tuesday | Today is Friday, so tomorrow is {Saturday}.|Monday Thursday",
      "Monday Wednesday",
    ),
    word(
      "Sunday Sundays",
      "the day after Saturday",
      "星期日",
      "{Sunday} is the last day of the weekend.|Monday Friday | Saturday, {Sunday}, Monday.|Tuesday Friday | Today is Saturday, so tomorrow is {Sunday}.|Monday Friday",
      "Monday Friday",
    ),
    word(
      "month months",
      "one of the twelve parts of a year, like May",
      "月；月份",
      "There are twelve {months} in a year.|weeks days | May is my favorite {month}.|week day | My birthday is next {month}, in June.|week day",
      "week day",
    ),
    word(
      "next",
      "the one after this one",
      "下一个的",
      "See you {next} week!|last every | This week is Monday's test. {Next} week is the art show.|Last Every | Who is {next} in the line? — Me!|last every",
      "last every",
    ),
    word(
      "last",
      "the one before this one; at the end",
      "上一个的；最后的",
      "I went to the zoo {last} Sunday.|next every | Z is the {last} letter of the alphabet.|next every | Sunday is the {last} day of the week.|next every",
      "next every",
    ),
  ],
});

const months = vocabularyTopic({
  id: "a1-words-months",
  title: t("Months", "月份"),
  summary: t("January to December.", "一月到十二月。"),
  prerequisites: ["a1-words-days"],
  words: [
    word(
      "January",
      "the first month of the year",
      "一月",
      "{January} is the first month of the year.|March June | The year starts in {January}.|June August | December, {January}, February.|March June",
      "March June",
    ),
    word(
      "February",
      "the second month of the year",
      "二月",
      "{February} is the second month.|April October | January, {February}, March.|June October | {February} is the shortest month. It has 28 days.|October July",
      "April October",
    ),
    word(
      "March",
      "the third month of the year",
      "三月",
      "{March} comes after February.|May January | February, {March}, April.|May July | {March} is the third month.|May November",
      "May January",
    ),
    word(
      "April",
      "the fourth month of the year",
      "四月",
      "{April} comes after March.|August June | March, {April}, May.|August June | {April} is the fourth month.|August June",
      "August June",
    ),
    word(
      "May",
      "the fifth month of the year",
      "五月",
      "{May} comes after April.|March July | April, {May}, June.|March July | {May} is the fifth month.|March July",
      "March July",
    ),
    word(
      "June",
      "the sixth month of the year",
      "六月",
      "{June} comes after May.|July January | May, {June}, July.|January April | {June} is the sixth month.|July January",
      "July January",
    ),
    word(
      "July",
      "the seventh month of the year",
      "七月",
      "{July} comes after June.|June May | June, {July}, August.|May January | {July} is the seventh month.|June May",
      "June May",
    ),
    word(
      "August",
      "the eighth month of the year",
      "八月",
      "{August} comes after July.|April October | July, {August}, September.|April October | {August} is the eighth month.|April October",
      "April October",
    ),
    word(
      "September",
      "the ninth month of the year",
      "九月",
      "{September} comes after August.|November December | August, {September}, October.|November December | {September} is the ninth month.|November December",
      "November December",
    ),
    word(
      "October",
      "the tenth month of the year",
      "十月",
      "{October} comes after September.|August February | September, {October}, November.|August February | {October} is the tenth month.|August February",
      "August February",
    ),
    word(
      "November",
      "the eleventh month of the year",
      "十一月",
      "{November} comes after October.|September December | October, {November}, December.|September January | {November} is the eleventh month.|September December",
      "September December",
    ),
    word(
      "December",
      "the twelfth and last month of the year",
      "十二月",
      "{December} is the last month of the year.|January November | November, {December}, January.|September October | {December} is the twelfth month.|November September",
      "January November",
    ),
  ],
});

const dates = vocabularyTopic({
  id: "a1-words-dates",
  title: t("Dates and Birthdays", "日期与生日"),
  summary: t("Sixty to ninety, zero, first to fifth, birthdays and dates.", "六十到九十、零、第一到第五、生日和日期。"),
  prerequisites: ["a1-words-numbers-to-hundred", "a1-words-months"],
  words: [
    word(
      "sixty",
      "the number 60",
      "六十",
      "There are {sixty} minutes in an hour.|seventy eighty | Fifty, {sixty}, seventy.|eighty ninety | Thirty and thirty make {sixty}.|seventy ninety",
      "seventy eighty",
    ),
    word(
      "seventy",
      "the number 70",
      "七十",
      "Sixty, {seventy}, eighty.|ninety sixty | Seven tens make {seventy}.|eighty ninety | Thirty and forty make {seventy}.|sixty eighty",
      "sixty eighty",
    ),
    word(
      "eighty",
      "the number 80",
      "八十",
      "Seventy, {eighty}, ninety.|sixty seventy | Forty and forty make {eighty}.|ninety seventy | Eight tens make {eighty}.|ninety sixty",
      "ninety seventy",
    ),
    word(
      "ninety",
      "the number 90",
      "九十",
      "Eighty, {ninety}, one hundred.|seventy sixty | Nine tens make {ninety}.|eighty seventy | Ten more than eighty is {ninety}.|seventy sixty",
      "eighty seventy",
    ),
    word(
      "zero",
      "the number 0; nothing",
      "零",
      "Ten minus ten is {zero}.|first one | One, two, three... wait, before one comes {zero}.|first fifth | It's very cold: {zero} degrees.|first fifth",
      "one first",
    ),
    word(
      "first",
      "number one in order; before all the others",
      "第一",
      "January is the {first} month of the year.|third fifth | A is the {first} letter of the alphabet.|second third | I was {first} in the race! I won!|fifth third",
      "second third",
    ),
    word(
      "second seconds",
      "number two in order; also a very short time",
      "第二；秒",
      "February is the {second} month.|third first | Tuesday is the {second} day of the school week.|first fourth | Wait a {second}! I'm coming.|date first",
      "first third",
    ),
    word(
      "third",
      "number three in order",
      "第三",
      "March is the {third} month.|second fourth | C is the {third} letter of the alphabet.|second fifth | First, second, {third}.|fourth fifth",
      "second fourth",
    ),
    word(
      "fourth",
      "number four in order",
      "第四",
      "April is the {fourth} month.|third fifth | Thursday is the {fourth} day of the school week.|third fifth | Third, {fourth}, fifth.|second first",
      "third fifth",
    ),
    word(
      "fifth",
      "number five in order",
      "第五",
      "May is the {fifth} month.|fourth third | Friday is the {fifth} day of the school week.|fourth third | E is the {fifth} letter of the alphabet.|fourth third",
      "fourth third",
    ),
    word(
      "birthday birthdays",
      "the day of the year you were born",
      "生日",
      "Happy {birthday}! You are ten today.|date month | My {birthday} is on May 5th.|date week | We have a cake on my {birthday}.|date week",
      "date month",
    ),
    word(
      "date dates",
      "the day of the month, like May 5th",
      "日期",
      "What's the {date} today? — It's June 1st.|birthday time | Write the {date} at the top of the page.|birthday clock | The {date} of the test is Friday, May 12th.|birthday clock",
      "birthday time",
    ),
  ],
});

// At, on and in for time.

/** timeFrames are sentences that a time phrase can end. */
const timeFrames: readonly string[] = [
  "We have art",
  "My party is",
  "I visit my grandma",
  "The shop opens",
  "We play football",
  "The test is",
  "Our school trip is",
];

/** phrases are the time phrases that take each word. */
const phrases: Readonly<Record<"at" | "on" | "in", readonly string[]>> = {
  at: ["seven o'clock", "half past four", "a quarter past nine", "night", "ten o'clock", "6:30", "noon", "a quarter past two"],
  on: ["Monday", "Friday", "Saturday morning", "May 5th", "my birthday", "Sunday afternoon", "Tuesday", "June 1st"],
  in: ["May", "summer", "the morning", "the afternoon", "December", "spring", "the evening", "July"],
};

const preps = ["at", "on", "in"] as const;

/** prepAll are every frame with every phrase of every word. */
const prepAll = interleave(
  preps.map((prep) =>
    everyPair(timeFrames, phrases[prep]).map(([frame, phrase]) => ({
      prep,
      sentence: `${frame} ___ ${phrase}.`,
      others: preps.filter((p) => p !== prep),
    })),
  ),
);

/** prepItems are all the items starting at the given place, so each bank opens on different sentences. */
const prepItems = (skip: number) => [...prepAll.slice(skip), ...prepAll.slice(0, skip)];

const prepChoiceBank: readonly ChoiceItem[] = prepItems(0).map(({ prep, sentence, others }): ChoiceItem => [sentence, prep, others]);

const prepTypedBank: readonly TypedItem[] = prepItems(42).map(
  ({ prep, sentence, others }): TypedItem => ({ shown: sentence, accepted: [prep], wrong: [...others] }),
);

/** noPrepFrames are sentences that end in next week, this morning or every day, which take no at, on or in. */
const noPrepFrames: readonly string[] = [
  "We have art",
  "I visit my grandma",
  "The shop is closed",
  "We play football",
  "Our class has a test",
  "I see my friends",
  "We go swimming",
  "My dad works late",
  "We clean the house",
  "I have a piano lesson",
  "The children go to the park",
  "We start a new book",
  "My mom goes shopping",
  "I call my grandpa",
  "We eat fish",
];

const noPrepPhrases: readonly (readonly [phrase: string, wrongPrep: string])[] = [
  ["next week", "in"],
  ["next Monday", "on"],
  ["this morning", "in"],
  ["every Sunday", "on"],
  ["this evening", "in"],
  ["every day", "on"],
  ["next month", "in"],
];

const noPrepBank: readonly TypedItem[] = everyPair(noPrepFrames, noPrepPhrases).map(
  ([frame, [phrase, wrongPrep]]): TypedItem => ({
    shown: `${frame} ${wrongPrep} ${phrase}.`,
    accepted: [`${frame} ${phrase}.`],
    wrong: [`${frame} ${wrongPrep} ${phrase}.`, `${frame} at ${phrase}.`],
  }),
);

/** phraseIn is the time phrase after the gap of sentence. */
const phraseIn = (sentence: string): string => sentence.replace(/^.*___ /u, "").replace(/\.$/u, "");

/** prepKind says what kind of time phrase takes prep. */
const prepKind = (prep: string, phrase: string): Text =>
  prep === "at"
    ? phrase === "night"
      ? t("*night* is the one part of the day that takes *at*", "*night* 是唯一用 *at* 的时段")
      : t(`*${phrase}* is a time on the clock, and clock times take *at*`, `*${phrase}* 是钟点，钟点用 *at*`)
    : prep === "on"
      ? /\d/u.test(phrase)
        ? t(`*${phrase}* is a date, and dates take *on*`, `*${phrase}* 是日期，日期用 *on*`)
        : t(`*${phrase}* is one day, and days take *on*`, `*${phrase}* 是某一天，某一天用 *on*`)
      : /morning|afternoon|evening/u.test(phrase)
        ? t(`*${phrase}* is a part of the day, and parts of the day take *in*`, `*${phrase}* 是一天中的时段，时段用 *in*`)
        : /summer|spring|autumn|winter/u.test(phrase)
          ? t(`*${phrase}* is a season, and seasons take *in*`, `*${phrase}* 是季节，季节用 *in*`)
          : t(`*${phrase}* is a month, and months take *in*`, `*${phrase}* 是月份，月份用 *in*`);

/** prepWhy explains the word for the gap of shown. */
const prepWhy = (right: string, shown: string): Text => {
  const kind = prepKind(right, phraseIn(shown));
  const sentence = shown.replace("___", `*${right}*`);
  return t(`${kind.en}: ${sentence}`, `${kind["zh-CN"]}：${sentence}`);
};

/** prepUse says what each of at, on and in is for. */
const prepUse: Readonly<Record<string, Text>> = {
  at: t("*at* is for clock times and *night*", "*at* 用于钟点和 *night*"),
  on: t("*on* is for days and dates", "*on* 用于某一天和日期"),
  in: t("*in* is for months, seasons and parts of the day", "*in* 用于月份、季节和一天中的时段"),
};

/** whyNotPrep explains a wrong word for the gap of shown. */
const whyNotPrep = (wrong: string, right: string, shown: string): Text => {
  const use = prepUse[wrong] ?? t(`*${wrong}*`, `*${wrong}*`);
  const kind = prepKind(right, phraseIn(shown));
  return t(`${use.en}. ${kind.en}.`, `${use["zh-CN"]}。${kind["zh-CN"]}。`);
};

const prepositionsOfTime: TopicDef = {
  id: "prepositions-of-time",
  title: t("At, On and In for Time", "表示时间的 at、on 和 in"),
  summary: t("At seven o'clock, on Monday, in May.", "at seven o'clock、on Monday、in May。"),
  prerequisites: ["a1-words-days", "a1-words-time"],
  encompasses: [
    { topic: "a1-words-days", weight: 0.3 },
    { topic: "a1-words-time", weight: 0.3 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("At, on or in", "at、on 还是 in"),
      t(
        "*at* a time on the clock: *at seven o'clock*, *at half past four*, and *at night*.\n\n*on* a day: *on Monday*, *on May 5th*, *on my birthday*, *on Saturday morning*.\n\n*in* a longer time: *in May*, *in summer*, *in the morning*.",
        "*at* 用于钟点：*at seven o'clock*、*at half past four*，还有 *at night*。\n\n*on* 用于某一天：*on Monday*、*on May 5th*、*on my birthday*、*on Saturday morning*。\n\n*in* 用于较长的时间：*in May*、*in summer*、*in the morning*。\n\n中文说“七点”“星期一”“五月”时前面不加词，英语却必须加，而且三个词不能混用。",
      ),
      choiceGenerator(t("Choose the word for the gap.", "选出填入空白处的词。"), prepChoiceBank, prepWhy, whyNotPrep),
    ),
    point(
      "type",
      t("Writing at, on or in", "写出 at、on 或 in"),
      t(
        "Type the word: *at* for the clock, *on* for a day, *in* for a month, a season or a part of the day.",
        "输入这个词：钟点用 *at*，某一天用 *on*，月份、季节和一天中的时段用 *in*。",
      ),
      typedGenerator("word-form", t("Type the word for the gap.", "输入填入空白处的词。"), prepTypedBank, prepWhy),
    ),
    point(
      "no-word",
      t("Next week, this morning, every day", "next week、this morning、every day"),
      t(
        "Before *next*, *last*, *this* and *every*, there is no *at*, *on* or *in*: *We have a test next Monday.* *I visit my grandma every Sunday.*",
        "在 *next*、*last*、*this*、*every* 前面不用 *at*、*on*、*in*：*We have a test next Monday.* *I visit my grandma every Sunday.* 不要说 *on next Monday*。",
      ),
      typedGenerator("sentence", t("Fix the sentence.", "改正这个句子。"), noPrepBank, (right) => {
        const phrase = /(next|this|every) \w+/u.exec(right)?.[0] ?? "next week";
        const first = phrase.split(" ")[0] ?? "next";
        return t(
          `*${phrase}* starts with *${first}*, and a time that starts with *next*, *last*, *this* or *every* takes no *at*, *on* or *in*: ${right}`,
          `*${phrase}* 以 *${first}* 开头；以 *next*、*last*、*this*、*every* 开头的时间前不加 *at*、*on*、*in*：${right}`,
        );
      }),
    ),
  ],
};

// Capital letters for names.

const people: readonly string[] = ["Anna", "Tom", "Li Wei", "Sara", "Ben", "Mia"];
const languages: readonly string[] = ["English", "Chinese", "French", "Spanish", "Japanese"];
const cities: readonly string[] = ["Beijing", "London", "Paris", "Sydney", "Shanghai", "Tokyo", "Toronto"];
const countries: readonly string[] = ["China", "Canada", "Japan", "Spain", "France"];
const dayNames: readonly string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const monthNames: readonly string[] = ["January", "March", "April", "June", "July", "August", "October", "November", "December"];

const at = <T>(list: readonly T[], k: number): T => list[k % list.length] as T;

/** nameSentence k is the k-th sentence full of names, days and months. */
const nameSentence = (k: number): string => {
  switch (k % 5) {
    case 0:
      return `On ${at(dayNames, k)}, ${at(people, k)} speaks ${at(languages, k)}.`;
    case 1:
      return `${at(people, k)} is from ${at(countries, k)}, but she lives in ${at(cities, k)}.`.replace(
        /^(Tom|Ben|Li Wei) is from (\w+), but she/u,
        "$1 is from $2, but he",
      );
    case 2:
      return `My birthday is in ${at(monthNames, k)}, and my party is on a ${at(dayNames, k + 3)}.`;
    case 3:
      return `We go to ${at(cities, k)} every ${at(monthNames, k + 2)}.`;
    default:
      return `My friend ${at(people, k)} learns ${at(languages, k + 1)} on ${at(dayNames, k + 1)}s.`;
  }
};

const nameSentences: readonly string[] = (() => {
  const seen = new Set<string>();
  for (let k = 0; seen.size < 40 && k < 400; k++) seen.add(nameSentence(k));
  if (seen.size < 40) throw new Error("capital letters for names: too few sentences");
  return [...seen];
})();

/** careless writes a sentence with no capitals except the first letter. */
const careless = (s: string): string => sentenceCase(s.toLowerCase());

/** tooMany writes every word with a capital letter. */
const tooMany = (s: string): string => s.replace(/\b([a-z])/gu, (c) => c.toUpperCase());

const namesTypedBank: readonly TypedItem[] = nameSentences.map(
  (s): TypedItem => ({ shown: careless(s), accepted: [s], wrong: [careless(s), tooMany(s)] }),
);

const namesChoiceBank: readonly ChoiceItem[] = nameSentences.map((s): ChoiceItem => ["", s, [careless(s), tooMany(s)]]);

/** namesIn are the names in sentence s. */
const namesIn = (s: string): readonly string[] =>
  [...people, ...languages, ...cities, ...countries, ...dayNames, ...monthNames].filter((name) => s.includes(name));

/** namesWhy explains which words of a sentence take a capital letter. */
const namesWhy = (right: string): Text => {
  const names = namesIn(right)
    .map((name) => `*${name}*`)
    .join(", ");
  return t(
    `Names of people, places, languages, days and months begin with a capital letter, here ${names}, and other words do not: ${right}`,
    `人名、地名、语言、星期和月份以大写字母开头，这里是 ${names}，其他词不大写：${right}`,
  );
};

/** whyNotNames explains a sentence with too few or too many capitals. */
const whyNotNames = (wrong: string, right: string, _shown: string, position: number): Text => {
  if (position === 0) {
    const name = namesIn(right).find((n) => !wrong.startsWith(n)) ?? namesIn(right)[0] ?? "";
    return t(
      `This writes names with a small letter, like *${name.toLowerCase()}*. A name always begins with a capital: *${name}*.`,
      `这句把名字写成了小写，如 *${name.toLowerCase()}*。名字总是以大写字母开头：*${name}*。`,
    );
  }
  const plain = /\b[a-z]{3,}\b/u.exec(right)?.[0] ?? "and";
  return t(
    `This gives every word a capital letter. Only names and the first word take one, so *${plain}* stays small.`,
    `这句给每个词都加了大写。只有名字和句首的词大写，所以 *${plain}* 仍然小写。`,
  );
};

const capitalLettersForNames: TopicDef = {
  id: "writing-capital-letters-for-names",
  title: t("Capital Letters for Names", "专有名词的大写"),
  summary: t(
    "Names of people, places, languages, days and months begin with a capital letter: On Monday, Anna speaks English.",
    "人名、地名、语言、星期和月份以大写字母开头：On Monday, Anna speaks English.",
  ),
  prerequisites: ["writing-capitals-and-periods", "a1-words-months"],
  encompasses: [
    { topic: "writing-capitals-and-periods", weight: 0.3 },
    { topic: "a1-words-months", weight: 0.2 },
  ],
  xp: 15,
  strand: "writing",
  knowledgePoints: [
    point(
      "choose",
      t("Which words need a capital", "哪些词要大写"),
      t(
        "A name begins with a capital letter: people (*Anna*), cities (*London*), countries (*China*), languages (*English*), days (*Monday*) and months (*May*). Other words do not: *birthday*, *party*, *friend*.",
        "名字以大写字母开头：人名（*Anna*）、城市（*London*）、国家（*China*）、语言（*English*）、星期（*Monday*）和月份（*May*）。其他词不大写：*birthday*、*party*、*friend*。\n\n中文没有大小写，所以要特别留意：星期和月份在英语里也算名字，必须大写。",
      ),
      choiceGenerator(t("Which sentence is written right?", "哪个句子写对了？"), namesChoiceBank, namesWhy, whyNotNames),
    ),
    point(
      "write",
      t("Writing names with capitals", "名字大写"),
      t(
        "Copy the sentence and give every name a capital letter: people, cities, countries, languages, days and months. Keep the first word capital, and write every other word with a small letter.",
        "抄写句子，给每个名字加上大写字母：人名、城市、国家、语言、星期和月份。句首的词保持大写，其他词都用小写。",
      ),
      typedGenerator(
        "sentence",
        t("Write the sentence again with the right capital letters.", "用正确的大写字母重写句子。"),
        namesTypedBank,
        namesWhy,
      ),
    ),
  ],
};

const ordinals = vocabularyTopic({
  id: "a1-words-ordinals",
  title: t("Sixth to Thirtieth", "第六到第三十"),
  summary: t(
    "Numbers in order from sixth to twelfth, twentieth and thirtieth, for floors, months and dates.",
    "表示顺序的数：第六到第十二、第二十和第三十，用于楼层、月份和日期。",
  ),
  prerequisites: ["a1-words-dates"],
  words: [
    word(
      "sixth",
      "number six in order",
      "第六",
      "June is the {sixth} month of the year.|seventh eighth | F is the {sixth} letter of the alphabet.|seventh ninth | Fifth, {sixth}, seventh.|eighth fourth | Our flat is on the {sixth} floor.|six sixty",
      "seventh fifth",
    ),
    word(
      "seventh",
      "number seven in order",
      "第七",
      "July is the {seventh} month.|sixth eighth | G is the {seventh} letter of the alphabet.|sixth ninth | Sixth, {seventh}, eighth.|ninth tenth | Today is the {seventh} of March.|seven seventy",
      "sixth eighth",
    ),
    word(
      "eighth",
      "number eight in order",
      "第八",
      "August is the {eighth} month.|seventh ninth | H is the {eighth} letter of the alphabet.|sixth tenth | Seventh, {eighth}, ninth.|sixth tenth | He came {eighth} in the race.|eight eighty",
      "seventh ninth",
    ),
    word(
      "ninth",
      "number nine in order",
      "第九",
      "September is the {ninth} month.|eighth tenth | I is the {ninth} letter of the alphabet.|seventh eleventh | Eighth, {ninth}, tenth.|seventh sixth",
      "eighth tenth",
    ),
    word(
      "tenth",
      "number ten in order",
      "第十",
      "October is the {tenth} month.|ninth twelfth | J is the {tenth} letter of the alphabet.|eighth twelfth | We live on the {tenth} floor, so we take the lift.|zero one",
      "ninth eleventh",
    ),
    word(
      "eleventh",
      "number eleven in order",
      "第十一",
      "November is the {eleventh} month.|tenth twelfth | Tenth, {eleventh}, twelfth.|ninth twentieth | K is the {eleventh} letter of the alphabet.|ninth twelfth",
      "tenth twelfth",
    ),
    word(
      "twelfth",
      "number twelve in order",
      "第十二",
      "December is the {twelfth} and last month.|tenth eleventh | Eleventh, {twelfth}, thirteenth.|tenth twentieth | L is the {twelfth} letter of the alphabet.|tenth ninth",
      "eleventh twentieth",
    ),
    word(
      "twentieth",
      "number twenty in order",
      "第二十",
      "My birthday is on the {twentieth} of May.|twenty thirty | Nineteenth, {twentieth}, twenty-first.|twelfth thirtieth | T is the {twentieth} letter of the alphabet.|twelfth tenth",
      "twelfth thirtieth",
    ),
    word(
      "thirtieth",
      "number thirty in order",
      "第三十",
      "April has thirty days, so its last day is the {thirtieth}.|thirty twentieth | Grandma's party is on the {thirtieth} of June.|thirty twenty | Twenty-ninth, {thirtieth}, thirty-first.|twentieth thirteenth",
      "twentieth thirty",
    ),
  ],
});

const tensWords = ["twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const unitWords = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const unitOrdinals = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth"];

/** compoundNumbers are twenty-one to ninety-nine, written with a hyphen; the numbers to a hundred teach them. */
const compoundNumbers: WordBatch = {
  topic: "a1-words-numbers-to-hundred",
  words: tensWords.flatMap((tens) => unitWords.map((unit) => `${tens}-${unit}`)),
};

/** compoundOrdinals are thirteenth to nineteenth and twenty-first to thirty-first, for dates. */
const compoundOrdinals: WordBatch = {
  topic: "a1-words-ordinals",
  words: [
    "thirteenth",
    "fourteenth",
    "fifteenth",
    "sixteenth",
    "seventeenth",
    "eighteenth",
    "nineteenth",
    ...unitOrdinals.map((o) => `twenty-${o}`),
    "thirty-first",
  ],
};

/** topics are the topics of the unit Time and Dates. */
export const topics: readonly TopicDef[] = [
  time.topic,
  days.topic,
  months.topic,
  dates.topic,
  ordinals.topic,
  prepositionsOfTime,
  capitalLettersForNames,
];

/** vocabulary are the words the unit Time and Dates teaches. */
export const vocabulary: readonly WordBatch[] = [
  time.batch,
  days.batch,
  months.batch,
  dates.batch,
  ordinals.batch,
  compoundNumbers,
  compoundOrdinals,
];
