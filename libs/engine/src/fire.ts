import type { EngineGraph } from "./graph.ts";
import type { Params } from "./params.ts";
import { type LearnerState, memory, type TopicState } from "./state.ts";

/**
 * earlyFactor discounts credit for a repetition that comes before the topic is
 * due: no credit right after a repetition (memory 1), full credit once due
 * (memory at or below dueMemory), linear in between.
 */
export function earlyFactor(p: Params, m: number): number {
  return Math.min(1, Math.max(0, (1 - m) / (1 - p.dueMemory)));
}

/**
 * credited applies a credit of `amount` repetitions to a topic at time now.
 * A full credit (1) is a complete repetition: repNum grows by the credit
 * scaled by the early factor and the learner's speed, and memory is restored.
 * A fractional credit moves the effective last-repetition time the same
 * fraction of the way to now.
 */
export function credited(p: Params, s: TopicState, amount: number, now: number): TopicState {
  const f = Math.min(1, Math.max(0, amount));
  if (f === 0) return s;
  const gain = f * earlyFactor(p, memory(p, s, now)) * s.speed;
  return { ...s, repNum: s.repNum + gain, last: s.last + f * (Math.max(now, s.last) - s.last) };
}

/** penalized removes repetitions from a topic; an explicit failure also resets its memory so that it is retaught soon. */
export function penalized(p: Params, s: TopicState, amount: number, now: number, explicit: boolean): TopicState {
  const repNum = Math.max(0, s.repNum - amount * p.failPenalty);
  return explicit ? { ...s, repNum, last: now } : { ...s, repNum };
}

type Topics = Record<string, TopicState>;

/**
 * applyRepetition records an explicit repetition of `topic` with a result in
 * [0, 1] (1 a full pass, 0 a failure) and propagates it through the
 * encompassing edges (FIRe):
 * - a pass credits the topic and, implicitly, every topic it encompasses, in
 *   proportion to the encompassing weight; topics on which the learner is slow
 *   (speed < 1) receive no implicit credit, as they need explicit practice;
 * - a failure penalizes the topic and, implicitly and scaled down, every
 *   learned topic that encompasses it, since those depend on it.
 */
export function applyRepetition(p: Params, g: EngineGraph, state: LearnerState, topic: string, result: number, now: number): LearnerState {
  const topics: Topics = { ...state.topics };
  const s = topics[topic];
  if (!s?.learned) return state;
  if (result > 0) {
    topics[topic] = credited(p, s, result, now);
    for (const [t, w] of g.encompassed.get(topic) ?? []) {
      const e = topics[t];
      if (e?.learned && e.speed >= 1) topics[t] = credited(p, e, result * w, now);
    }
  } else {
    topics[topic] = penalized(p, s, 1, now, true);
    for (const [t, w] of g.encompassers.get(topic) ?? []) {
      const e = topics[t];
      if (e?.learned) topics[t] = penalized(p, e, w * p.implicitPenaltyScale, now, false);
    }
  }
  return { ...state, topics };
}
