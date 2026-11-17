import type { CourseDef, ModuleDef } from "@ga/content";
import { t } from "@ga/content";

import { recognitionByGrade } from "./characters/index.ts";
import { classicalDrillTopics, classicalPassages } from "./classical/index.ts";
import { connectiveTopics, faultyTopics, type GradeTopic, punctuationTopics, rhetoricTopics, sentenceTopics } from "./grammar/index.ts";
import { idiomsByGrade } from "./idioms/index.ts";
import { chineseReading } from "./reading/index.ts";
import { recitedPoems } from "./recitation/index.ts";
import { wordBatches } from "./words/index.ts";

const NUMERALS = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

/** MODULE is the number of recognition batches of a module. */
const MODULE = 6;

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

/** idiomTopicsOf are the ids of a grade's idiom batches. */
const idiomTopicsOf = (grade: number): readonly string[] =>
  (idiomsByGrade.find((g) => g.grade === grade)?.batches ?? []).map((b) => b.topic.id);

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

/** classicalModules are a grade's modules of classical language, those it has. */
function classicalModules(grade: number): readonly ModuleDef[] {
  const passages = ofGrade(classicalPassages, grade);
  const drills = ofGrade(classicalDrillTopics, grade);
  return [
    ...(passages.length > 0 ? [{ title: t("Classical Passages", "文言文"), topics: passages }] : []),
    ...(drills.length > 0 ? [{ title: t("Words of Classical Chinese", "文言字词"), topics: drills }] : []),
  ];
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
      { title: t("Characters", "识字"), modules: recognitionModules(grade) },
      {
        title: t("Words", "词语"),
        modules: [
          { title: t("Words", "词语"), topics: wordBatches.filter((b) => b.grade === grade).map((b) => b.topic.id) },
          { title: t("Idioms", "成语"), topics: idiomTopicsOf(grade) },
        ],
      },
      ...(grammarModules(grade).length > 0 ? [{ title: t("Grammar and Punctuation", "语法与标点"), modules: grammarModules(grade) }] : []),
      {
        title: t("Recitation", "积累与背诵"),
        modules: [{ title: t("Classical Poems", "古诗词"), topics: recitedPoems.filter((p) => p.grade === grade).map((p) => p.topic.id) }],
      },
      ...(classicalModules(grade).length > 0 ? [{ title: t("Classical Chinese", "文言"), modules: classicalModules(grade) }] : []),
    ],
    reading: chineseReading.filter((r) => r.grade === grade).map((r) => r.unit.id),
    ...(grade > 3 && { buildsOn: [`chinese-grade-${grade - 1}`] }),
  };
}

/** chineseCourses are the courses of Chinese. */
export const chineseCourses: readonly CourseDef[] = [
  gradeCourse(
    3,
    t(
      "Chinese for native speakers in grade 3: reading the next 450 common characters in words, in Chinese.",
      "面向母语学习者的三年级语文：在词语中认读常用字表中的约 450 个字，用中文讲解。",
    ),
  ),
  gradeCourse(
    4,
    t(
      "Chinese for native speakers in grade 4: reading the 450 more common characters that complete the 2,500 of the first table, in Chinese.",
      "面向母语学习者的四年级语文：再认读约 450 个常用字，读完常用字表一的 2500 字，用中文讲解。",
    ),
  ),
  gradeCourse(
    5,
    t(
      "Chinese for native speakers in grade 5: reading 250 characters of the second table of common characters in words, in Chinese.",
      "面向母语学习者的五年级语文：在词语中认读常用字表二中的约 250 个字，用中文讲解。",
    ),
  ),
  gradeCourse(
    6,
    t(
      "Chinese for native speakers in grade 6: reading 250 more characters of the second table, 3,000 characters in all by the end of primary school, in Chinese.",
      "面向母语学习者的六年级语文：再认读常用字表二中的约 250 个字，小学阶段累计认识 3000 字，用中文讲解。",
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
      {
        title: t("Tones in Speech", "语流变调"),
        modules: [{ title: t("Tones in Speech", "语流变调"), topics: ["pinyin-yi-and-bu", "pinyin-third-tones"] }],
      },
    ],
  },
];
