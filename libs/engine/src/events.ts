import { applyRepetition } from "./fire.ts";
import type { EngineGraph } from "./graph.ts";
import { lessonSpeed } from "./lesson.ts";
import type { Params } from "./params.ts";
import { reviewResult } from "./review.ts";
import { clampSpeed, type LearnerState, newTopicState, type TopicState } from "./state.ts";

/**
 * EngineEvent is a completed task, as recorded in the event log. Learner
 * state is the fold of applyEvent over these events, so changing a parameter
 * of the engine only requires a replay.
 */
export type EngineEvent =
  /** placed ends the diagnostic of a course; skipping it places nothing. */
  | {
      readonly type: "placed";
      readonly at: number;
      readonly course: string;
      readonly known: readonly string[];
      readonly tested: readonly string[];
    }
  /** lesson ends a lesson, passed or failed. */
  | {
      readonly type: "lesson";
      readonly at: number;
      readonly topic: string;
      readonly passed: boolean;
      readonly asked: number;
      readonly correct: number;
    }
  /** review ends an explicit review. */
  | { readonly type: "review"; readonly at: number; readonly topic: string; readonly correct: number; readonly total: number }
  /** quiz ends a quiz: one result per question, by topic. */
  | { readonly type: "quiz"; readonly at: number; readonly results: readonly { readonly topic: string; readonly correct: boolean }[] };

/** EngineContext is what applying events needs besides the state. */
export interface EngineContext {
  readonly params: Params;
  readonly graph: EngineGraph;
}

function setTopic(state: LearnerState, id: string, s: TopicState): LearnerState {
  return { ...state, topics: { ...state.topics, [id]: s } };
}

/** reviewXp is the XP of a perfect review of a topic: a third of its lesson, at least 3. */
export function reviewXp(topicXp: number): number {
  return Math.max(3, Math.round(topicXp / 3));
}

/** eventXp is the XP an event earns. */
export function eventXp(ctx: EngineContext, e: EngineEvent): number {
  switch (e.type) {
    case "placed":
      return 0;
    case "lesson":
      return e.passed ? (ctx.graph.graph.topics.get(e.topic)?.xp ?? 0) : 0;
    case "review": {
      const xp = reviewXp(ctx.graph.graph.topics.get(e.topic)?.xp ?? 0);
      return reviewResult(ctx.params, e.correct, e.total) > 0 ? Math.round((xp * e.correct) / e.total) : 0;
    }
    case "quiz": {
      const n = e.results.length;
      return n === 0 ? 0 : Math.round((ctx.params.quizXp * e.results.filter((r) => r.correct).length) / n);
    }
  }
}

/** applyEvent folds one event into the learner state. */
export function applyEvent(ctx: EngineContext, state: LearnerState, e: EngineEvent): LearnerState {
  const { params: p, graph: g } = ctx;
  const xp = state.xp + eventXp(ctx, e);
  switch (e.type) {
    case "placed": {
      const tested = new Set(e.tested);
      const diagnosed = state.diagnosed.includes(e.course) ? state.diagnosed : [...state.diagnosed, e.course];
      let next: LearnerState = { ...state, diagnosed };
      for (const t of e.known) {
        if (next.topics[t]?.learned || !g.graph.topics.has(t)) continue;
        next = setTopic(next, t, newTopicState(e.at, p.placedRepNum + (tested.has(t) ? 0.5 : 0), 1, true));
      }
      return next;
    }
    case "lesson": {
      const topic = g.graph.topics.get(e.topic);
      const prev = state.topics[e.topic];
      if (!topic) return state;
      if (!e.passed) {
        const failed: TopicState = prev ?? { learned: false, repNum: 0, last: e.at, speed: 1, explicitReviews: 0 };
        return { ...setTopic(state, e.topic, { ...failed, failedAt: e.at }), xp, reviewsSinceLesson: 0 };
      }
      if (prev?.learned) return { ...applyRepetition(p, g, state, e.topic, 1, e.at), xp, reviewsSinceLesson: 0 };
      const speed = clampSpeed(p, lessonSpeed(p, topic.knowledgePoints.length, e.asked));
      const learned = setTopic(state, e.topic, newTopicState(e.at, 0, speed, false));
      // A lesson is also a full repetition of the topics it encompasses. The new topic itself starts at repNum 0.
      const after = applyRepetition(p, g, learned, e.topic, 1, e.at);
      return { ...setTopic(after, e.topic, learned.topics[e.topic]!), xp, reviewsSinceLesson: 0 };
    }
    case "review": {
      const prev = state.topics[e.topic];
      if (!prev?.learned) return state;
      const result = reviewResult(p, e.correct, e.total);
      const after = applyRepetition(p, g, state, e.topic, result, e.at);
      const s = after.topics[e.topic]!;
      const speed = clampSpeed(p, 0.8 * s.speed + 0.2 * (0.5 + e.correct / e.total));
      const reviewsSinceLesson = state.reviewsSinceLesson + 1;
      return { ...setTopic(after, e.topic, { ...s, speed, explicitReviews: s.explicitReviews + 1 }), xp, reviewsSinceLesson };
    }
    case "quiz": {
      let next = state;
      for (const r of e.results) next = applyRepetition(p, g, next, r.topic, r.correct ? p.quizCredit : 0, e.at);
      return { ...next, xp, xpAtLastQuiz: xp, quizzes: state.quizzes + 1 };
    }
  }
}

/** replay rebuilds the learner state from the event log. */
export function replay(ctx: EngineContext, events: readonly EngineEvent[], from: LearnerState): LearnerState {
  return events.reduce((s, e) => applyEvent(ctx, s, e), from);
}
