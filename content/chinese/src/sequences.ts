import type { SequenceDef } from "@ga/content";
import { t } from "@ga/content";

/** grades lists the native grade courses from `from` to `to`. */
const grades = (from: number, to: number): string[] => Array.from({ length: to - from + 1 }, (_, i) => `chinese-grade-${from + i}`);

/** levels lists the foreign-language level courses from `from` to `to`. */
const levels = (from: number, to: number): string[] => Array.from({ length: to - from + 1 }, (_, i) => `chinese-level-${from + i}`);

/** SENIOR are the two courses of senior secondary school, required then selective required. */
const SENIOR = ["chinese-hs-required", "chinese-hs-selective"];

/**
 * chineseSequences are the routes through the courses of Chinese (docs/chinese-curriculum.md §3, §8): the native
 * grades 1 to 9 and the two senior courses; the heritage bridges, the third joining grade 5 and the native courses after
 * it; the foreign-language levels of GF 0025-2021 after pinyin; and the HSK courses after pinyin, each holding the
 * level it tests. The Gaokao course is a single course, on no route.
 */
export const chineseSequences: readonly SequenceDef[] = [
  { id: "native", title: t("Chinese for Native Speakers", "母语语文"), courses: [...grades(1, 9), ...SENIOR] },
  {
    id: "heritage",
    title: t("Chinese for Heritage Learners", "华裔语文"),
    courses: ["chinese-heritage-1", "chinese-heritage-2", "chinese-heritage-3", ...grades(5, 9), ...SENIOR],
  },
  { id: "foreign-language", title: t("Chinese as a Foreign Language", "中文作为外语"), courses: ["chinese-pinyin", ...levels(1, 9)] },
  {
    id: "hsk",
    title: t("HSK", "HSK"),
    courses: [
      "chinese-pinyin",
      "chinese-hsk-1",
      "chinese-hsk-2",
      "chinese-hsk-3",
      "chinese-hsk-4",
      "chinese-hsk-5",
      "chinese-hsk-6",
      "chinese-hsk-7-9",
    ],
  },
];
