import type { Rng } from "@ga/content";

import type { Params } from "./params.ts";

/**
 * reviewPlan chooses the knowledge points a review may ask, one question each,
 * reviewMaxQuestions in all: first reviewQuestions of them, every knowledge
 * point once when there are at most that many, starting from the last (most
 * complete) ones, in shuffled order; then the ones asked after wrong answers,
 * again from the last knowledge points.
 */
export function reviewPlan(p: Params, kpCount: number, rng: Rng): number[] {
  const cycle = (n: number) => Array.from({ length: n }, (_, i) => kpCount - 1 - (i % Math.min(kpCount, p.reviewQuestions)));
  const first = rng.shuffle(cycle(p.reviewQuestions));
  return [...first, ...cycle(p.reviewMaxQuestions - p.reviewQuestions)];
}

/**
 * reviewOutcome tells how a review stands after `correct` of `asked` answers:
 * passed once reviewPass are correct, failed once that is out of reach within
 * reviewMaxQuestions, otherwise undefined and another question follows. So a
 * review asks reviewQuestions questions when every answer is right, and one
 * more for each wrong one.
 */
export function reviewOutcome(p: Params, correct: number, asked: number): "passed" | "failed" | undefined {
  if (correct >= p.reviewPass) return "passed";
  if (correct + (p.reviewMaxQuestions - asked) < p.reviewPass) return "failed";
  return undefined;
}

/**
 * reviewPassed tells whether a finished review passed. Reviews record it; a
 * review recorded without it passed with two correct answers of three.
 */
export function reviewPassed(e: { readonly correct: number; readonly total: number; readonly passed?: boolean }): boolean {
  return e.passed ?? e.correct >= Math.min(2, e.total);
}

/** reviewResult turns a finished review into a repetition result in [0, 1]: 0 when failed, otherwise the fraction correct. */
export function reviewResult(e: { readonly correct: number; readonly total: number; readonly passed?: boolean }): number {
  return reviewPassed(e) && e.total > 0 ? e.correct / e.total : 0;
}
