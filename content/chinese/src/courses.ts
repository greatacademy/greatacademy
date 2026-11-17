import type { CourseDef, ModuleDef } from "@ga/content";
import { t } from "@ga/content";

import { recognitionByGrade } from "./characters/index.ts";

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

/** gradeCourse is the native course of a grade. */
function gradeCourse(grade: number, description: CourseDef["description"]): CourseDef {
  return {
    id: `chinese-grade-${grade}`,
    title: t(`Chinese, Grade ${grade}`, `语文 ${NUMERALS[grade]}年级`),
    description,
    group: t("Chinese", "语文"),
    explanationLocale: "zh-CN",
    units: [{ title: t("Characters", "识字"), modules: recognitionModules(grade) }],
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
];
