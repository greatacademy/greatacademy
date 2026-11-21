import type { Difficulty } from "@ga/content";

import { kpAnswers, kpNeeded, type LessonProgress } from "./lesson.ts";
import type { Params } from "./params.ts";

/**
 * lessonDifficulty is the tier of a lesson's next question: a knowledge point
 * starts easy and its last needed correct answer is hard, with medium between.
 * A wrong answer asks the same tier again.
 */
export function lessonDifficulty(p: Params, l: LessonProgress): Difficulty {
  const { correct } = kpAnswers(l);
  const needed = kpNeeded(p, l);
  if (correct === 0 && needed > 1) return "easy";
  return correct >= needed - 1 ? "hard" : "medium";
}

/**
 * reviewDifficulty is the tier of a review's question at index: the first is
 * medium and the rest of the planned questions hard, since a review checks
 * that the whole step holds; the extra questions after wrong answers are
 * medium.
 */
export function reviewDifficulty(p: Params, index: number): Difficulty {
  if (index === 0 || index >= p.reviewQuestions) return "medium";
  return "hard";
}

/**
 * quizDifficulty is the tier of a quiz's next question after correct of asked
 * answers were right: it starts medium, rises while the share of correct
 * answers is above the target and falls once it is well below.
 */
export function quizDifficulty(p: Params, correct: number, asked: number): Difficulty {
  if (asked === 0) return "medium";
  const share = correct / asked;
  if (share > p.quizTargetAccuracy) return "hard";
  return share < p.quizTargetAccuracy - 0.2 ? "easy" : "medium";
}
