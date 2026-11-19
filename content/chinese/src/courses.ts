import type { CourseDef, ModuleDef } from "@ga/content";
import { t } from "@ga/content";

import { recognitionByGrade } from "./characters/index.ts";
import { classicalDrillTopics, classicalPassages } from "./classical/index.ts";
import { gaokaoCourse } from "./gaokao/index.ts";
import { connectiveTopics, faultyTopics, type GradeTopic, punctuationTopics, rhetoricTopics, sentenceTopics } from "./grammar/index.ts";
import { heritageTopics } from "./heritage/topics.ts";
import { hskCourses } from "./hsk/index.ts";
import { idiomsByGrade } from "./idioms/index.ts";
import { levelOneCourse } from "./level-1/index.ts";
import { levelTwoCourse } from "./level-2/index.ts";
import { levelThreeCourse } from "./level-3/index.ts";
import { levelFourCourse } from "./level-4/index.ts";
import { levelFiveCourse } from "./level-5/index.ts";
import { levelSixCourse } from "./level-6/index.ts";
import { levelSevenCourse } from "./level-7/index.ts";
import { levelEightCourse } from "./level-8/index.ts";
import { levelNineCourse } from "./level-9/index.ts";
import { heritageReading } from "./reading/heritage.ts";
import { chineseReading } from "./reading/index.ts";
import { recitedPoems } from "./recitation/index.ts";
import { componentTopics, strokeOrderTopics } from "./strokes/index.ts";
import { levelHandwritingByLevel } from "./strokes/levels.ts";
import { handwritingByGrade } from "./strokes/writing.ts";
import { wordBatches } from "./words/index.ts";
import { earlySentenceTopics } from "./writing/early-sentences.ts";
import { writingTopics } from "./writing/index.ts";
import { laterWritingTopics } from "./writing/later.ts";

const NUMERALS = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

/** MODULE is the number of recognition batches of a module. */
const MODULE = 6;

/** PINYIN_MODULES are the pinyin of grade 1: the topics of the course chinese-pinyin, explained in Chinese. */
const PINYIN_MODULES: readonly ModuleDef[] = [
  { title: t("Tones", "声调"), topics: ["pinyin-tones"] },
  { title: t("Initials and Finals", "声母和韵母"), topics: ["pinyin-initials", "pinyin-finals", "pinyin-spelling"] },
  { title: t("Hearing", "听音"), topics: ["pinyin-hearing"] },
  { title: t("Tones in Speech", "语流变调"), topics: ["pinyin-yi-and-bu", "pinyin-third-tones"] },
  { title: t("Saying Words", "说词语"), topics: ["pinyin-saying"] },
];

/** recognitionModules groups a grade's recognition batches into modules of six. */
function recognitionModules(grade: number): readonly ModuleDef[] {
  const batches = recognitionByGrade.find((g) => g.grade === grade)?.batches ?? [];
  const modules: ModuleDef[] = [];
  for (let i = 0; i < batches.length; i += MODULE) {
    const part = batches.slice(i, i + MODULE);
    const last = i + part.length;
    modules.push({ title: t(`Sets ${i + 1} to ${last}`, `第${i + 1}至${last}组`), topics: part.map((b) => b.topic.id) });
  }
  return modules;
}

/** handOf are the ids of a grade's writing batches. */
const handOf = (grade: number): readonly string[] =>
  (handwritingByGrade.find((g) => g.grade === grade)?.batches ?? []).map((b) => b.topic.id);

/** idiomTopicsOf are the ids of a grade's idiom batches. */
const idiomTopicsOf = (grade: number): readonly string[] =>
  (idiomsByGrade.find((g) => g.grade === grade)?.batches ?? []).map((b) => b.topic.id);

/** wordModules are a grade's modules of words and of idioms, those it has. */
function wordModules(grade: number): readonly ModuleDef[] {
  const words = wordBatches.filter((b) => b.grade === grade).map((b) => b.topic.id);
  const idioms = idiomTopicsOf(grade);
  return [
    ...(words.length > 0 ? [{ title: t("Words", "词语"), topics: words }] : []),
    ...(idioms.length > 0 ? [{ title: t("Idioms", "成语"), topics: idioms }] : []),
  ];
}

/** ofGrade are the ids of the topics a grade teaches. */
const ofGrade = (topics: readonly GradeTopic[], grade: number): readonly string[] =>
  topics.filter((g) => g.grade === grade).map((g) => g.topic.id);

/** grammarModules are a grade's modules of punctuation, connectives, sentence forms, rhetoric and faulty sentences, those it has. */
function grammarModules(grade: number): readonly ModuleDef[] {
  const modules: ModuleDef[] = [];
  const punctuation = ofGrade(punctuationTopics, grade);
  const faulty = ofGrade(faultyTopics, grade);
  const connectives = ofGrade(connectiveTopics, grade);
  const sentences = ofGrade(sentenceTopics, grade);
  const rhetoric = ofGrade(rhetoricTopics, grade);
  if (punctuation.length > 0) modules.push({ title: t("Punctuation", "标点符号"), topics: punctuation });
  if (connectives.length > 0) modules.push({ title: t("Connectives", "关联词"), topics: connectives });
  if (sentences.length > 0) modules.push({ title: t("Changing Sentence Forms", "句式变换"), topics: sentences });
  if (rhetoric.length > 0) modules.push({ title: t("Rhetorical Devices", "修辞手法"), topics: rhetoric });
  if (faulty.length > 0) modules.push({ title: t("Faulty Sentences", "修改病句"), topics: faulty });
  return modules;
}

/** writingModules are a grade's modules of judged writing, those it has. */
function writingModules(grade: number): readonly ModuleDef[] {
  const sentences = ofGrade(earlySentenceTopics, grade);
  if (sentences.length > 0) return [{ title: t("Building Sentences", "连词成句"), topics: sentences }];
  const topics = ofGrade([...writingTopics, ...laterWritingTopics], grade);
  return topics.length > 0 ? [{ title: t("Writing", grade >= 7 ? "写作" : "习作"), topics }] : [];
}

/** classicalModules are a grade's modules of classical language, those it has. */
function classicalModules(grade: number): readonly ModuleDef[] {
  const passages = ofGrade(classicalPassages, grade);
  const drills = ofGrade(classicalDrillTopics, grade);
  return [
    ...(passages.length > 0 ? [{ title: t("Classical Passages", "文言文"), topics: passages }] : []),
    ...(drills.length > 0 ? [{ title: t("Words of Classical Chinese", "文言字词"), topics: drills }] : []),
  ];
}

/** seniorCourse is a native course of senior secondary school; grade 10 is the required course and 11 the selective one. */
function seniorCourse(grade: number, id: string, title: CourseDef["title"], description: CourseDef["description"]): CourseDef {
  return {
    id,
    title,
    description,
    group: t("Chinese", "语文"),
    explanationLocale: "zh-CN",
    units: [
      ...(wordModules(grade).length > 0 ? [{ title: t("Words", "词语"), modules: wordModules(grade) }] : []),
      ...(grammarModules(grade).length > 0 ? [{ title: t("Grammar and Rhetoric", "语法与修辞"), modules: grammarModules(grade) }] : []),
      ...(writingModules(grade).length > 0 ? [{ title: t("Writing", "写作"), modules: writingModules(grade) }] : []),
      {
        title: t("Recitation", "积累与背诵"),
        modules: [
          { title: t("Classical Poems", "古诗词曲"), topics: recitedPoems.filter((p) => p.grade === grade).map((p) => p.topic.id) },
        ],
      },
      { title: t("Classical Chinese", "文言"), modules: classicalModules(grade) },
    ],
    reading: chineseReading.filter((r) => r.grade === grade).map((r) => r.unit.id),
    buildsOn: [grade === 10 ? "chinese-grade-9" : "chinese-hs-required"],
  };
}

/** gradeCourse is the native course of a grade. */
function gradeCourse(grade: number, description: CourseDef["description"]): CourseDef {
  return {
    id: `chinese-grade-${grade}`,
    title: t(`Chinese, Grade ${grade}`, `语文 ${NUMERALS[grade]}年级`),
    description,
    group: t("Chinese", "语文"),
    explanationLocale: "zh-CN",
    units: [
      ...(grade === 1
        ? [
            { title: t("Pinyin", "汉语拼音"), modules: PINYIN_MODULES },
            {
              title: t("Strokes", "笔画"),
              modules: [{ title: t("Strokes and Their Order", "笔画和笔顺"), topics: strokeOrderTopics.map((x) => x.id) }],
            },
          ]
        : []),
      ...(grade === 2
        ? [
            {
              title: t("Components", "偏旁部首"),
              modules: [{ title: t("Components", "偏旁部首"), topics: componentTopics.map((x) => x.id) }],
            },
          ]
        : []),
      { title: t("Characters", "识字"), modules: recognitionModules(grade) },
      ...(handOf(grade).length > 0 ? [{ title: t("Writing Characters", "写字"), modules: setModules(handOf(grade)) }] : []),
      ...(wordModules(grade).length > 0 ? [{ title: t("Words", "词语"), modules: wordModules(grade) }] : []),
      ...(grammarModules(grade).length > 0 ? [{ title: t("Grammar and Punctuation", "语法与标点"), modules: grammarModules(grade) }] : []),
      ...(writingModules(grade).length > 0
        ? [{ title: t("Writing", grade >= 7 ? "写作" : grade <= 2 ? "写话" : "习作"), modules: writingModules(grade) }]
        : []),
      {
        title: t("Recitation", "积累与背诵"),
        modules: [{ title: t("Classical Poems", "古诗词"), topics: recitedPoems.filter((p) => p.grade === grade).map((p) => p.topic.id) }],
      },
      ...(classicalModules(grade).length > 0 ? [{ title: t("Classical Chinese", "文言"), modules: classicalModules(grade) }] : []),
    ],
    reading: chineseReading.filter((r) => r.grade === grade).map((r) => r.unit.id),
    ...(grade > 1 && { buildsOn: [`chinese-grade-${grade - 1}`] }),
  };
}

/** stageBatches are the ids of a stage's recognition batches in the order of its characters: grades 1 and 2 one after the other, the others in turn. */
function stageBatches(first: number): readonly string[] {
  const [a, b] = [first, first + 1].map((g) => recognitionByGrade.find((x) => x.grade === g)?.batches ?? []);
  if (first === 1) return [...a!, ...b!].map((x) => x.topic.id);
  return Array.from({ length: Math.max(a!.length, b!.length) }, (_, i) => [a![i], b![i]])
    .flat()
    .filter((x) => x !== undefined)
    .map((x) => x.topic.id);
}

/** setModules groups recognition batches into modules of six, numbered from `from`. */
function setModules(ids: readonly string[], from = 1): readonly ModuleDef[] {
  const modules: ModuleDef[] = [];
  for (let i = 0; i < ids.length; i += MODULE) {
    const part = ids.slice(i, i + MODULE);
    const [first, last] = [from + i, from + i + part.length - 1];
    modules.push({ title: t(`Sets ${first} to ${last}`, `第${first}至${last}组`), topics: part });
  }
  return modules;
}

/** HERITAGE_FIRST is how many batches of grades 1 and 2 the first heritage bridge teaches: 600 characters. */
const HERITAGE_FIRST = 50;

/** heritageOwn are the ids of the heritage topics a bridge teaches. */
const heritageOwn = (...ids: readonly string[]): readonly string[] =>
  ids.map((id) => {
    if (!heritageTopics.some((x) => x.id === id)) throw new Error(`no heritage topic ${id}`);
    return id;
  });

/** sentencesAfter are the sentence-building topics of grades 1 and 2 that follow one of the given recognition batches. */
const sentencesAfter = (batches: readonly string[]): readonly string[] =>
  earlySentenceTopics.filter((x) => x.topic.prerequisites.some((p) => batches.includes(p))).map((x) => x.topic.id);

/** handUpTo are the ids of the writing batches whose characters the given recognition batches, and those before, all teach. */
function handUpTo(batches: readonly string[]): readonly string[] {
  const taught = new Set(
    recognitionByGrade.flatMap((g) => g.batches.filter((b) => batches.includes(b.topic.id)).flatMap((b) => b.entries.map((e) => e.char))),
  );
  const all = handwritingByGrade.flatMap((g) => g.batches);
  const first = all.findIndex((b) => b.entries.some((e) => !taught.has(e.char)));
  return all.slice(0, first === -1 ? all.length : first).map((b) => b.topic.id);
}

/** heritageCourse builds a heritage bridge: recognition batches of the native graph and writing those it can, with units before and after them. */
function heritageCourse(
  n: number,
  description: CourseDef["description"],
  batches: readonly string[],
  own: readonly string[],
  before: CourseDef["units"] = [],
  earlier: readonly string[] = [],
): CourseDef {
  const hand = handUpTo([...earlier, ...batches]).filter((id) => !handUpTo(earlier).includes(id));
  return {
    id: `chinese-heritage-${n}`,
    title: t(`Chinese for Heritage Learners ${n}`, `华裔识字衔接 ${NUMERALS[n]}`),
    description,
    group: t("Chinese", "语文"),
    units: [
      ...before,
      { title: t("Characters", "识字"), modules: setModules(batches) },
      ...(hand.length > 0 ? [{ title: t("Writing Characters", "写字"), modules: setModules(hand) }] : []),
      ...(sentencesAfter(batches).length > 0
        ? [
            {
              title: t("Building Sentences", "连词成句"),
              modules: [{ title: t("Building Sentences", "连词成句"), topics: sentencesAfter(batches) }],
            },
          ]
        : []),
      { title: t("Writing What You Say", "我手写我口"), modules: [{ title: t("Writing What You Say", "我手写我口"), topics: own }] },
    ],
    reading: heritageReading.filter((r) => r.bridge === n).map((r) => r.unit.id),
    ...(n > 1 && { buildsOn: [`chinese-heritage-${n - 1}`] }),
  };
}

/** heritageCourses are the three literacy bridges for learners who speak Chinese (docs/chinese-curriculum.md §8.2). */
const heritageCourses: readonly CourseDef[] = [
  heritageCourse(
    1,
    t(
      "For children and adults who speak Chinese but do not yet read it: pinyin, strokes and components, the first 600 common characters, read and written by hand, characters that sound alike, and 的, 地, 得. Explanations are in the learner's language.",
      "面向会说中文、还不识字的孩子和成人：拼音、笔画和偏旁，最常用的 600 个字，会认也会写，同音字，以及“的、地、得”。用学习者的语言讲解。",
    ),
    stageBatches(1).slice(0, HERITAGE_FIRST),
    heritageOwn("heritage-sound-alike", "heritage-de-and-pronouns"),
    [
      { title: t("Pinyin", "汉语拼音"), modules: PINYIN_MODULES },
      {
        title: t("Strokes and Components", "笔画和偏旁"),
        modules: [
          { title: t("Strokes and Their Order", "笔画和笔顺"), topics: strokeOrderTopics.map((x) => x.id) },
          { title: t("Components", "偏旁部首"), topics: componentTopics.map((x) => x.id) },
        ],
      },
    ],
  ),
  heritageCourse(
    2,
    t(
      "The second literacy bridge: 1,000 more common characters, 1,600 in all, read and written by hand, the written forms of everyday words and set phrases, and dialect words and their Mandarin. Explanations are in the learner's language.",
      "第二门识字衔接课：再认识并会写 1000 个常用字，累计 1600 字，学会常用词和成语的写法，分清方言词和普通话。用学习者的语言讲解。",
    ),
    stageBatches(1).slice(HERITAGE_FIRST),
    heritageOwn("heritage-written-forms", "heritage-dialect-words"),
    [],
    stageBatches(1).slice(0, HERITAGE_FIRST),
  ),
  heritageCourse(
    3,
    t(
      "The third literacy bridge: 900 more common characters, the 2,500 of the first table, read and written by hand, spoken and written Chinese, and reading traditional characters. Explanations are in the learner's language.",
      "第三门识字衔接课：再认识并会写 900 个常用字，读完常用字表一的 2500 字，分清口语和书面语，认识繁体字。用学习者的语言讲解。",
    ),
    stageBatches(3),
    heritageOwn("heritage-register", "heritage-traditional"),
    [],
    stageBatches(1),
  ),
];

/** levelHandUnit is the unit of writing characters of the given levels, its batches in modules of six. */
function levelHandUnit(levels: readonly number[]): CourseDef["units"][number] {
  const ids = levelHandwritingByLevel.filter((l) => levels.includes(l.level)).flatMap((l) => l.batches.map((b) => b.topic.id));
  if (ids.length === 0) throw new Error(`no writing batches of levels ${levels.join(", ")}`);
  return { title: t("Writing Characters", "写汉字"), modules: setModules(ids) };
}

/** withLevelHand ends a level course with the unit of writing its characters. */
const withLevelHand = (course: CourseDef, level: number): CourseDef => ({ ...course, units: [...course.units, levelHandUnit([level])] });

/** withHskHand puts the writing units of an HSK course's levels just before its last unit, the exam practice. */
function withHskHand(course: CourseDef): CourseDef {
  const key = course.id.replace(/^chinese-hsk-/u, "");
  const levels = key === "7-9" ? [7, 8, 9] : [Number(key)];
  const last = course.units.at(-1);
  if (last?.title.en !== "Exam Practice" || levels.some((l) => !(l >= 1 && l <= 9))) throw new Error(`HSK course ${course.id}`);
  return { ...course, units: [...course.units.slice(0, -1), levelHandUnit(levels), last] };
}

/** baseCourses are the courses of Chinese but the Gaokao course, which is built from two of them. */
const baseCourses: readonly CourseDef[] = [
  gradeCourse(
    1,
    t(
      "Chinese for native speakers in grade 1: pinyin, strokes and their order, reading about 800 common characters in words and writing 400 by hand, and short poems to recite, in Chinese.",
      "面向母语学习者的一年级语文：汉语拼音、笔画和笔顺，在词语中认读约 800 个常用字，会写其中 400 个，背诵短诗，用中文讲解。",
    ),
  ),
  gradeCourse(
    2,
    t(
      "Chinese for native speakers in grade 2: components, reading about 800 more common characters in words and writing 400 more by hand, and short poems to recite, in Chinese.",
      "面向母语学习者的二年级语文：偏旁部首，在词语中再认读约 800 个常用字，再会写 400 个，背诵短诗，用中文讲解。",
    ),
  ),
  gradeCourse(
    3,
    t(
      "Chinese for native speakers in grade 3: reading the next 450 common characters in words and writing 400 more by hand, in Chinese.",
      "面向母语学习者的三年级语文：在词语中认读常用字表中的约 450 个字，再会写 400 个，用中文讲解。",
    ),
  ),
  gradeCourse(
    4,
    t(
      "Chinese for native speakers in grade 4: reading the 450 more common characters that complete the 2,500 of the first table, and writing 400 more by hand, 1,600 in all, in Chinese.",
      "面向母语学习者的四年级语文：再认读约 450 个常用字，读完常用字表一的 2500 字，再会写 400 个，累计会写 1600 字，用中文讲解。",
    ),
  ),
  gradeCourse(
    5,
    t(
      "Chinese for native speakers in grade 5: reading 250 characters of the second table of common characters in words and writing 450 more by hand, in Chinese.",
      "面向母语学习者的五年级语文：在词语中认读常用字表二中的约 250 个字，再会写 450 个，用中文讲解。",
    ),
  ),
  gradeCourse(
    6,
    t(
      "Chinese for native speakers in grade 6: reading 250 more characters of the second table, 3,000 characters in all by the end of primary school, and writing 450 more by hand, 2,500 in all, in Chinese.",
      "面向母语学习者的六年级语文：再认读常用字表二中的约 250 个字，小学阶段累计认识 3000 字，再会写 450 个，累计会写 2500 字，用中文讲解。",
    ),
  ),
  gradeCourse(
    7,
    t(
      "Chinese for native speakers in grade 7: reading about 170 more characters of the second table in words and writing 170 more by hand, forty words and thirty-two idioms, the rhetorical devices of metonymy, contrast, quotation and anadiplosis, twelve classical poems and eight passages of classical prose to recite, and the words of classical Chinese, in Chinese.",
      "面向母语学习者的七年级语文：在词语中再认读常用字表二中的约 170 个字，再会写 170 个，积累四十个词语和三十二个成语，学习借代、对比、引用和顶真，背诵十二首古诗词和八篇文言文，学习文言字词，用中文讲解。",
    ),
  ),
  gradeCourse(
    8,
    t(
      "Chinese for native speakers in grade 8: reading about 170 more characters of the second table in words and writing 160 more by hand, forty words and thirty-two idioms, mixed-up sentence structures, twelve classical poems and eight passages of classical prose to recite, and the usages of 其 and 为, in Chinese.",
      "面向母语学习者的八年级语文：在词语中再认读常用字表二中的约 170 个字，再会写 160 个，积累四十个词语和三十二个成语，辨析句式杂糅的病句，背诵十二首古诗词和八篇文言文，学习“其”“为”的用法，用中文讲解。",
    ),
  ),
  gradeCourse(
    9,
    t(
      "Chinese for native speakers in grade 9: reading the last characters of the second table, all 3,500 common characters by the end of junior secondary school, writing 170 more by hand, 3,000 in all, forty words and thirty-two idioms, illogical sentences, twelve classical poems and eight passages of classical prose to recite, and borrowed characters, in Chinese.",
      "面向母语学习者的九年级语文：认读常用字表二中余下的字，初中阶段累计认识 3500 个常用字，再会写 170 个，累计会写 3000 字，积累四十个词语和三十二个成语，辨析不合逻辑的病句，背诵十二首古诗词和八篇文言文，学习通假字，用中文讲解。",
    ),
  ),
  seniorCourse(
    10,
    "chinese-hs-required",
    t("Chinese, Senior Required", "高中语文 必修"),
    t(
      "Chinese for native speakers in the required course of senior secondary school: forty words of essays and arguments, thirty-two idioms often misused, the rhetoric of synaesthesia, paired phrasing, double meaning and irony, twenty classical poems and sixteen passages of classical prose to recite, the function words 乃, 且, 若, 焉, 何 and 乎, and the kinds of classical sentence, in Chinese.",
      "面向母语学习者的高中必修语文：积累四十个论说文中常用的词语和三十二个容易误用的成语，学习通感、互文、双关和反语，背诵二十首古诗词曲和十六篇文言文，学习文言虚词“乃”“且”“若”“焉”“何”“乎”和文言特殊句式，用中文讲解。",
    ),
  ),
  seniorCourse(
    11,
    "chinese-hs-selective",
    t("Chinese, Senior Selective Required", "高中语文 选择性必修"),
    t(
      "Chinese for native speakers in the selective required course of senior secondary school: forty words, among them pairs easily confused, thirty-two idioms often misused, sentences with two meanings, twenty classical poems and sixteen passages of classical prose to recite, the function words 因, 与, 则, 所, 也 and 者, words used as another part of speech and words whose meaning has changed, in Chinese.",
      "面向母语学习者的高中选择性必修语文：积累四十个词语（包括几组易混词）和三十二个容易误用的成语，辨析表意不明的病句，背诵二十首古诗词曲和十六篇文言文，学习文言虚词“因”“与”“则”“所”“也”“者”、词类活用和古今异义，用中文讲解。",
    ),
  ),
  {
    id: "chinese-pinyin",
    title: t("Pinyin", "拼音"),
    description: t(
      "Pinyin for learners of Chinese as a foreign language: the four tones and their marks, initials, finals, the spelling rules, and the tones that change in speech. Explanations are in the learner's language.",
      "面向把中文作为外语学习的人的拼音课：四个声调和调号、声母、韵母、拼写规则，以及说话时的变调。用学习者的语言讲解。",
    ),
    group: t("Chinese", "语文"),
    units: [
      { title: t("Tones", "声调"), modules: [{ title: t("Tones", "声调"), topics: ["pinyin-tones"] }] },
      {
        title: t("Initials and Finals", "声母和韵母"),
        modules: [{ title: t("Initials and Finals", "声母和韵母"), topics: ["pinyin-initials", "pinyin-finals", "pinyin-spelling"] }],
      },
      { title: t("Hearing", "听音"), modules: [{ title: t("Hearing Syllables", "听音节"), topics: ["pinyin-hearing"] }] },
      {
        title: t("Tones in Speech", "语流变调"),
        modules: [{ title: t("Tones in Speech", "语流变调"), topics: ["pinyin-yi-and-bu", "pinyin-third-tones"] }],
      },
      { title: t("Speaking", "开口说"), modules: [{ title: t("Saying Words", "说词语"), topics: ["pinyin-saying"] }] },
    ],
  },
  ...heritageCourses,
  ...[
    levelOneCourse,
    levelTwoCourse,
    levelThreeCourse,
    levelFourCourse,
    levelFiveCourse,
    levelSixCourse,
    levelSevenCourse,
    levelEightCourse,
    levelNineCourse,
  ].map((course, i) => withLevelHand(course, i + 1)),
  ...hskCourses.map(withHskHand),
];

/** byId finds a course of baseCourses. */
function byId(id: string): CourseDef {
  const found = baseCourses.find((c) => c.id === id);
  if (!found) throw new Error(`no course ${id}`);
  return found;
}

/** chineseCourses are the courses of Chinese. */
export const chineseCourses: readonly CourseDef[] = [
  ...baseCourses,
  gaokaoCourse(byId("chinese-hs-required"), byId("chinese-hs-selective")),
];
