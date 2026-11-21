import type { Params } from "./params.ts";

/**
 * LessonProgress is the state of a lesson in progress. A lesson walks through
 * the topic's knowledge points in order; each one shows its explanation and a
 * worked example, then asks practice questions until the learner has answered
 * at least kpPass correctly and more correctly than wrongly. The kpMaxWrong-th
 * wrong answer on one knowledge point fails the lesson.
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
  /** kpCorrect and kpWrong count the answers on this knowledge point; absent in lessons begun before they were kept. */
  readonly kpCorrect?: number;
  readonly kpWrong?: number;
  /** asked and correct count every question of the lesson. */
  readonly asked: number;
  readonly correct: number;
  readonly outcome?: "passed" | "failed";
  /** essay tells that the lesson asks one essay, whose verdict passes or fails it. */
  readonly essay?: boolean;
}

/** startLesson begins a lesson on a topic with kpCount knowledge points; an essay's lesson asks one text. */
export function startLesson(topic: string, kpCount: number, essay = false): LessonProgress {
  return { topic, kpCount, kp: 0, streak: 0, kpAsked: 0, kpCorrect: 0, kpWrong: 0, asked: 0, correct: 0, ...(essay && { essay: true }) };
}

/** kpAnswers are the correct and wrong answers on the current knowledge point. */
export function kpAnswers(l: LessonProgress): { readonly correct: number; readonly wrong: number } {
  const correct = l.kpCorrect ?? l.streak;
  return { correct, wrong: l.kpWrong ?? l.kpAsked - correct };
}

/** kpNeeded is how many correct answers pass the current knowledge point given its wrong answers so far. */
export function kpNeeded(p: Params, l: LessonProgress): number {
  return l.essay ? 1 : Math.max(p.kpPass, kpAnswers(l).wrong + 1);
}

/** answerLesson records one answer to the current practice question. */
export function answerLesson(p: Params, l: LessonProgress, correct: boolean): LessonProgress {
  if (l.outcome) throw new Error("the lesson is over");
  const before = kpAnswers(l);
  const kpCorrect = before.correct + (correct ? 1 : 0);
  const kpWrong = before.wrong + (correct ? 0 : 1);
  const next = {
    ...l,
    streak: correct ? l.streak + 1 : 0,
    kpAsked: l.kpAsked + 1,
    kpCorrect,
    kpWrong,
    asked: l.asked + 1,
    correct: l.correct + (correct ? 1 : 0),
  };
  if (l.essay) return { ...next, outcome: correct ? "passed" : "failed" };
  if (kpCorrect >= p.kpPass && kpCorrect > kpWrong) {
    if (l.kp + 1 >= l.kpCount) return { ...next, outcome: "passed" };
    return { ...next, kp: l.kp + 1, streak: 0, kpAsked: 0, kpCorrect: 0, kpWrong: 0 };
  }
  if (kpWrong >= p.kpMaxWrong) return { ...next, outcome: "failed" };
  return next;
}

/** lessonSpeed estimates speed from a passed lesson: the fewest possible questions over the questions asked, mapped to [0.5, 1.5]. */
export function lessonSpeed(p: Params, kpCount: number, asked: number): number {
  const fewest = kpCount * p.kpPass;
  return 0.5 + fewest / Math.max(asked, fewest);
}
