import type { EngineContext, EngineEvent } from "./events.ts";
import type { Params } from "./params.ts";
import { reviewResult } from "./review.ts";
import type { LearnerState } from "./state.ts";

/** reviewXp is the full XP of a review of a topic: a third of its lesson, at least 3. */
export function reviewXp(topicXp: number): number {
  return Math.max(3, Math.round(topicXp / 3));
}

/** fullXp is the XP an event's task is worth when done well, before any bonus. */
export function fullXp(ctx: EngineContext, e: EngineEvent): number {
  const topicXp = (id: string) => ctx.graph.graph.topics.get(id)?.xp ?? 0;
  switch (e.type) {
    case "placed":
      return 0;
    case "lesson":
      return topicXp(e.topic);
    case "review":
      return reviewXp(topicXp(e.topic));
    case "quiz":
      return ctx.params.quizXp;
  }
}

/** lessonXp is the XP of a lesson by how it went: a bonus when perfect, full when nearly so, a share when passable, a little when nearly passable. */
function lessonXp(p: Params, full: number, passed: boolean, asked: number, correct: number): number {
  const accuracy = asked === 0 ? 0 : correct / asked;
  if (passed) {
    if (accuracy === 1) return full + p.xpPerfectBonus;
    return accuracy >= p.xpNearlyPerfect ? full : Math.round(full * accuracy);
  }
  return accuracy >= p.xpNearlyPassable ? Math.max(1, Math.round(full * p.xpNearlyPassableShare)) : 0;
}

/** earnedXp is the XP a task done in good faith earns; it is what a blown-off task forgoes. */
function earnedXp(ctx: EngineContext, e: EngineEvent): number {
  const { params: p } = ctx;
  const full = fullXp(ctx, e);
  switch (e.type) {
    case "placed":
      return 0;
    case "lesson":
      return lessonXp(p, full, e.passed, e.asked, e.correct);
    case "review":
      if (reviewResult(p, e.correct, e.total) <= 0) return 0;
      return e.correct === e.total ? full + p.xpPerfectBonus : Math.round((full * e.correct) / e.total);
    case "quiz": {
      const n = e.results.length;
      const correct = e.results.filter((r) => r.correct).length;
      if (n === 0) return 0;
      return correct === n ? full + p.xpPerfectBonus : Math.round((full * correct) / n);
    }
  }
}

/** blowOffPenalty is the XP a blown-off task costs after count earlier ones: nothing for the first few, more as they continue, never more than the task is worth. */
export function blowOffPenalty(p: Params, count: number, full: number): number {
  return Math.min(Math.floor(count / p.blowOffStep), p.blowOffMaxPenalty, full);
}

/** eventXp is the XP an event changes the state's total by; a blown-off task can lose XP, but the total never falls below zero. */
export function eventXp(ctx: EngineContext, state: LearnerState, e: EngineEvent): number {
  if (e.type !== "placed" && e.blownOff) return 0 - Math.min(state.xp, blowOffPenalty(ctx.params, state.blowOffs, fullXp(ctx, e)));
  return earnedXp(ctx, e);
}

/** nextBlowOffs is the count of recent blown-off tasks after an event: one more after a blown-off task, a little less after a passed one. */
export function nextBlowOffs(p: Params, state: LearnerState, e: EngineEvent): number {
  if (e.type === "placed") return state.blowOffs;
  if (e.blownOff) return state.blowOffs + 1;
  return taskPassed(p, e) ? Math.max(0, state.blowOffs - p.blowOffDecay) : state.blowOffs;
}

function taskPassed(p: Params, e: Exclude<EngineEvent, { type: "placed" }>): boolean {
  switch (e.type) {
    case "lesson":
      return e.passed;
    case "review":
      return reviewResult(p, e.correct, e.total) > 0;
    case "quiz":
      return e.results.filter((r) => r.correct).length * 2 >= e.results.length;
  }
}

/** TimedAnswer is one answer of a task and how long after the question was served it arrived. */
export interface TimedAnswer {
  readonly correct: boolean;
  readonly elapsedMs: number;
}

/**
 * isBlownOff tells whether a task looks blown off rather than failed in good
 * faith: not passed, with several wrong answers sent too quickly to have been
 * thought through, and these make up at least half of the wrong answers.
 * Failing slowly is never blowing off, and neither is passing quickly.
 */
export function isBlownOff(p: Params, passed: boolean, answers: readonly TimedAnswer[]): boolean {
  if (passed) return false;
  const wrong = answers.filter((a) => !a.correct);
  const rushed = wrong.filter((a) => a.elapsedMs < p.rushSeconds * 1000).length;
  return rushed >= p.rushMinAnswers && rushed * 2 >= wrong.length;
}
