import type { SequenceDef } from "@ga/content";
import { t } from "@ga/content";

/** grades lists the native grade courses from `from` to `to`. */
const grades = (from: number, to: number): string[] => Array.from({ length: to - from + 1 }, (_, i) => `english-grade-${from + i}`);

/**
 * englishSequences are the routes through the courses of English (docs/english-curriculum.md §6): the native courses
 * from phonics through grades 1 to 12, and the foreign-language levels of the CEFR from Pre-A1 to B2; both go on to
 * college writing, with which the levels C1 and C2 merge. The exam courses are single courses, on no route.
 */
export const englishSequences: readonly SequenceDef[] = [
  {
    id: "native",
    title: t("English for Native Speakers", "母语英语"),
    courses: ["english-phonics", ...grades(1, 12), "english-college-writing"],
  },
  {
    id: "foreign-language",
    title: t("English as a Foreign Language", "英语作为外语"),
    courses: ["english-pre-a1", "english-a1", "english-a2", "english-b1", "english-b2", "english-college-writing"],
  },
];
