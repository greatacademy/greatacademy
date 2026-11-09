import { applyRepetition, credited } from "./fire.ts";
import type { EngineGraph } from "./graph.ts";
import { lessonSpeed } from "./lesson.ts";
import type { Params } from "./params.ts";
import { reviewResult } from "./review.ts";
import { clampSpeed, type LearnerState, newTopicState, type TopicState } from "./state.ts";
import { eventXp, nextBlowOffs, readingPassed } from "./xp.ts";

/** TaskEvent is a completed task, as recorded in the event log. */
export type TaskEvent =
  /** placed ends the diagnostic of a course; skipping it places nothing. */
  | {
      readonly type: "placed";
      readonly at: number;
      readonly course: string;
      readonly known: readonly string[];
      readonly tested: readonly string[];
      /** missed are the topics answered wrongly; absent when none were. */
      readonly missed?: readonly string[];
    }
  /** lesson ends a lesson, passed or failed. */
  | {
      readonly type: "lesson";
      readonly at: number;
      readonly topic: string;
      readonly passed: boolean;
      readonly asked: number;
      readonly correct: number;
      /** blownOff marks a task rushed through rather than attempted; see isBlownOff. */
      readonly blownOff?: boolean;
    }
  /** review ends an explicit review. */
  | {
      readonly type: "review";
      readonly at: number;
      readonly topic: string;
      readonly correct: number;
      readonly total: number;
      /** blownOff marks a task rushed through rather than attempted; see isBlownOff. */
      readonly blownOff?: boolean;
    }
  /** reading ends a passage: how many of its comprehension questions were answered correctly. */
  | {
      readonly type: "reading";
      readonly at: number;
      readonly passage: string;
      readonly correct: number;
      readonly total: number;
      /** blownOff marks a task rushed through rather than attempted; see isReadingBlownOff. */
      readonly blownOff?: boolean;
    }
  /** quiz ends a quiz: one result per question, by topic. */
  | {
      readonly type: "quiz";
      readonly at: number;
      readonly results: readonly { readonly topic: string; readonly correct: boolean }[];
      /** blownOff marks a task rushed through rather than attempted; see isBlownOff. */
      readonly blownOff?: boolean;
    };

/**
 * StartOverEvent is a decision to start part of a subject over, made by whoever decides for the learner. Both keep the
 * XP earned, the quizzes taken and the passages read: they change what the engine believes is known, not the record.
 */
export type StartOverEvent =
  /**
   * retake forgets the topics of a course that only a diagnostic placed, so the course's diagnostic is offered again;
   * topics taught in lessons stay. See retakeEvent.
   */
  | { readonly type: "retake"; readonly at: number; readonly course: string; readonly forgotten: readonly string[] }
  /** reset forgets every topic of the subject and every diagnostic, as if the learner had just started. */
  | { readonly type: "reset"; readonly at: number };

/**
 * EngineEvent is an entry of the event log: a completed task or a decision to start over. Learner state is the fold of
 * applyEvent over these events, so changing a parameter of the engine only requires a replay.
 */
export type EngineEvent = TaskEvent | StartOverEvent;

/** EngineContext is what applying events needs besides the state. */
export interface EngineContext {
  readonly params: Params;
  readonly graph: EngineGraph;
}

function setTopic(state: LearnerState, id: string, s: TopicState): LearnerState {
  return { ...state, topics: { ...state.topics, [id]: s } };
}

/** applyEvent folds one event into the learner state. */
export function applyEvent(ctx: EngineContext, state: LearnerState, e: EngineEvent): LearnerState {
  if (e.type === "retake" || e.type === "reset") return startOver(state, e);
  return { ...applyTask(ctx, state, e), blowOffs: nextBlowOffs(ctx.params, state, e) };
}

/**
 * startOver applies a retake or a reset. A retake forgets the topics of the course that only the diagnostic placed; a
 * reset forgets every topic. Either way the next task of the course is its diagnostic again.
 */
function startOver(state: LearnerState, e: StartOverEvent): LearnerState {
  if (e.type === "reset") return { ...state, topics: {}, diagnosed: [], reviewsSinceLesson: 0, blowOffs: 0 };
  const forgotten = new Set(e.forgotten);
  const topics = Object.fromEntries(Object.entries(state.topics).filter(([id]) => !forgotten.has(id)));
  return { ...state, topics, diagnosed: state.diagnosed.filter((c) => c !== e.course) };
}

function applyTask(ctx: EngineContext, state: LearnerState, e: TaskEvent): LearnerState {
  const { params: p, graph: g } = ctx;
  const xp = state.xp + eventXp(ctx, state, e);
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
    case "reading": {
      const read = state.read?.includes(e.passage) ? state.read : [...(state.read ?? []), e.passage];
      const readingXp = (state.readingXp ?? 0) + Math.max(0, xp - state.xp);
      const passage = g.graph.passages.get(e.passage);
      const topics: Record<string, TopicState> = { ...state.topics };
      // Understanding a passage is partial practice of what it depends on. A failed check says too little to penalize: the passage may just be hard.
      if (passage && readingPassed(e) && !e.blownOff) {
        for (const { topic, weight } of passage.topics) {
          const s = topics[topic];
          if (s?.learned && s.speed >= 1) topics[topic] = credited(p, s, p.readingCredit * weight, e.at);
        }
      }
      return { ...state, topics, xp, read, readingXp };
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
