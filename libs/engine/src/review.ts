import type { Rng } from "@ga/content";

import type { Params } from "./params.ts";

/**
 * reviewPlan chooses the knowledge points a review asks, one question each:
 * every knowledge point once when there are at most reviewQuestions, starting
 * from the last (most complete) ones, then further questions from the later
 * knowledge points; the order is shuffled.
 */
export function reviewPlan(p: Params, kpCount: number, rng: Rng): number[] {
  const kps: number[] = [];
  for (let i = 0; kps.length < p.reviewQuestions; i++) kps.push(kpCount - 1 - (i % Math.min(kpCount, p.reviewQuestions)));
  return rng.shuffle(kps);
}

/** reviewResult turns a review score into a repetition result in [0, 1]: 0 below the pass mark, otherwise the fraction correct. */
export function reviewResult(p: Params, correct: number, total: number): number {
  return correct >= Math.min(p.reviewPass, total) ? correct / total : 0;
}
