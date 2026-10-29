import type { Params } from "./params.ts";

/**
 * LessonProgress is the state of a lesson in progress. A lesson walks through
 * the topic's knowledge points in order; each one shows its explanation and a
 * worked example, then asks practice questions until the learner answers
 * kpStreak in a row correctly. Asking kpMaxQuestions questions without
 * passing fails the lesson.
 */
export interface LessonProgress {
  readonly topic: string;
  readonly kpCount: number;
  /** kp is the index of the current knowledge point. */
  readonly kp: number;
  /** streak is the current run of correct answers on this knowledge point. */
  readonly streak: number;
  /** kpAsked is the number of questions asked on this knowledge point. */
  readonly kpAsked: number;
  /** asked and correct count every question of the lesson. */
  readonly asked: number;
  readonly correct: number;
  readonly outcome?: "passed" | "failed";
}

/** startLesson begins a lesson on a topic with kpCount knowledge points. */
export function startLesson(topic: string, kpCount: number): LessonProgress {
  return { topic, kpCount, kp: 0, streak: 0, kpAsked: 0, asked: 0, correct: 0 };
}

/** answerLesson records one answer to the current practice question. */
export function answerLesson(p: Params, l: LessonProgress, correct: boolean): LessonProgress {
  if (l.outcome) throw new Error("the lesson is over");
  const streak = correct ? l.streak + 1 : 0;
  const next = { ...l, streak, kpAsked: l.kpAsked + 1, asked: l.asked + 1, correct: l.correct + (correct ? 1 : 0) };
  if (streak >= p.kpStreak) {
    if (l.kp + 1 >= l.kpCount) return { ...next, outcome: "passed" };
    return { ...next, kp: l.kp + 1, streak: 0, kpAsked: 0 };
  }
  // Fail as soon as passing has become impossible within kpMaxQuestions.
  if (next.kpAsked + (p.kpStreak - streak) > p.kpMaxQuestions) return { ...next, outcome: "failed" };
  return next;
}

/** lessonSpeed estimates speed from a passed lesson: the fewest possible questions over the questions asked, mapped to [0.5, 1.5]. */
export function lessonSpeed(p: Params, kpCount: number, asked: number): number {
  const fewest = kpCount * p.kpStreak;
  return 0.5 + fewest / Math.max(asked, fewest);
}
