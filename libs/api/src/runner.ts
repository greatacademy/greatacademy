import { generateProblem, type Problem, type ProblemRef, type Rng, type Verdict } from "@ga/content";
import {
  answerDiagnostic,
  answerLesson,
  type DiagnosticProgress,
  type EngineEvent,
  eventXp,
  finishDiagnostic,
  type LearnerState,
  type LessonProgress,
  nextDiagnosticTopic,
  quizPlan,
  reviewPlan,
  reviewResult,
  startDiagnostic,
  startLesson,
  type Task,
} from "@ga/engine";

import type { CourseEntry } from "./registry.ts";

/** Asked is a question of a run and its judged response. */
export interface Asked extends ProblemRef {
  readonly response: string;
  readonly correct: boolean;
  readonly skipped: boolean;
}

/** RunResult is the outcome of a finished run. */
export interface RunResult {
  readonly passed: boolean;
  readonly correct: number;
  readonly asked: number;
  readonly xp: number;
  /** placed counts the topics the diagnostic placed as known. */
  readonly placed: number;
}

interface RunBase {
  readonly asked: readonly Asked[];
  /** current is the question to answer next; unset once the run is over. */
  readonly current?: ProblemRef;
  readonly result?: RunResult;
}

/**
 * RunState is the server-side state of a session: plain JSON, stored with the
 * session. It holds problem references (topic, knowledge point, seed), never
 * problems: problems are regenerated from their seeds when needed.
 */
export type RunState =
  | (RunBase & {
      readonly kind: "lesson";
      readonly topic: string;
      readonly lesson: LessonProgress;
      /** example is the seed of the worked example of the current knowledge point. */
      readonly example: number;
    })
  | (RunBase & { readonly kind: "review"; readonly topic: string; readonly covers: readonly string[]; readonly plan: readonly number[] })
  | (RunBase & { readonly kind: "quiz"; readonly topics: readonly string[] })
  | (RunBase & { readonly kind: "diagnostic"; readonly diagnostic: DiagnosticProgress });

/** newSeed draws a seed for a problem instance. */
export function newSeed(rng: Rng): number {
  return rng.int(0, 0x7fffffff);
}

function kpCount(c: CourseEntry, topic: string): number {
  return c.ctx.graph.graph.topics.get(topic)!.knowledgePoints.length;
}

function diagnosticRef(c: CourseEntry, topic: string, rng: Rng): ProblemRef {
  return { topic, kp: c.ctx.graph.graph.topics.get(topic)!.diagnosticKp, seed: newSeed(rng) };
}

/** diagnosticCandidates are the topics the diagnostic of a course places: its whole scope. */
export function diagnosticCandidates(c: CourseEntry): readonly string[] {
  return c.planner.scope.topics;
}

/** startRun begins a run of a task. */
export function startRun(c: CourseEntry, task: Task, state: LearnerState, rng: Rng): RunState {
  switch (task.kind) {
    case "lesson":
      return {
        kind: "lesson",
        topic: task.topic,
        lesson: startLesson(task.topic, kpCount(c, task.topic)),
        example: newSeed(rng),
        asked: [],
        current: { topic: task.topic, kp: 0, seed: newSeed(rng) },
      };
    case "review": {
      const plan = reviewPlan(c.ctx.params, kpCount(c, task.topic), rng);
      return {
        kind: "review",
        topic: task.topic,
        covers: task.covers,
        plan,
        asked: [],
        current: { topic: task.topic, kp: plan[0]!, seed: newSeed(rng) },
      };
    }
    case "quiz": {
      const topics = quizPlan(c.planner, state, rng);
      return { kind: "quiz", topics, asked: [], current: diagnosticRef(c, topics[0]!, rng) };
    }
    case "diagnostic": {
      const diagnostic = startDiagnostic(diagnosticCandidates(c));
      const first = nextDiagnosticTopic(c.ctx.graph, diagnostic);
      if (!first) throw new Error("the course has nothing to diagnose");
      return { kind: "diagnostic", diagnostic, asked: [], current: diagnosticRef(c, first, rng) };
    }
  }
}

/** Answered is the outcome of answering the current question of a run. */
export interface Answered {
  readonly run: RunState;
  readonly problem: Problem;
  readonly verdict: Verdict;
  readonly skipped: boolean;
  /** event is set when the answer ends the run: the event to append to the log. */
  readonly event?: EngineEvent;
}

/** canSkip tells whether a run allows "I don't know": only the diagnostic does. */
export function canSkip(run: RunState): boolean {
  return run.kind === "diagnostic";
}

/** answerRun judges a response to the current question and advances the run. */
export function answerRun(c: CourseEntry, run: RunState, response: string, skip: boolean, now: number, rng: Rng): Answered {
  const ref = run.current;
  if (!ref) throw new Error("the session is over");
  const problem = generateProblem(c.subject, ref);
  const skipped = skip && canSkip(run);
  const verdict: Verdict = skipped
    ? { correct: false }
    : c.subject.checkers.check(problem.answer.checker, problem.answer.expected, response);
  const asked = [...run.asked, { ...ref, response: skipped ? "" : response, correct: verdict.correct, skipped }];
  const correct = asked.filter((a) => a.correct).length;
  const finish = (next: RunState, event: EngineEvent, passed: boolean, placed = 0): Answered => {
    const result: RunResult = { passed, correct, asked: asked.length, xp: eventXp(c.ctx, event), placed };
    const { current: _, ...rest } = next;
    return { run: { ...rest, result } as RunState, problem, verdict, skipped, event };
  };

  switch (run.kind) {
    case "lesson": {
      const lesson = answerLesson(c.ctx.params, run.lesson, verdict.correct);
      const next = { ...run, lesson, asked };
      if (lesson.outcome) {
        const passed = lesson.outcome === "passed";
        return finish(next, { type: "lesson", at: now, topic: run.topic, passed, asked: lesson.asked, correct: lesson.correct }, passed);
      }
      const newKp = lesson.kp !== run.lesson.kp;
      return {
        run: { ...next, example: newKp ? newSeed(rng) : run.example, current: { topic: run.topic, kp: lesson.kp, seed: newSeed(rng) } },
        problem,
        verdict,
        skipped,
      };
    }
    case "review": {
      const next = { ...run, asked };
      if (asked.length >= run.plan.length) {
        const event: EngineEvent = { type: "review", at: now, topic: run.topic, correct, total: asked.length };
        return finish(next, event, reviewResult(c.ctx.params, correct, asked.length) > 0);
      }
      return {
        run: { ...next, current: { topic: run.topic, kp: run.plan[asked.length]!, seed: newSeed(rng) } },
        problem,
        verdict,
        skipped,
      };
    }
    case "quiz": {
      const next = { ...run, asked };
      if (asked.length >= run.topics.length) {
        const event: EngineEvent = { type: "quiz", at: now, results: asked.map((a) => ({ topic: a.topic, correct: a.correct })) };
        return finish(next, event, correct * 2 >= asked.length);
      }
      return { run: { ...next, current: diagnosticRef(c, run.topics[asked.length]!, rng) }, problem, verdict, skipped };
    }
    case "diagnostic": {
      const diagnostic = answerDiagnostic(c.ctx.graph, run.diagnostic, ref.topic, verdict.correct);
      const next = { ...run, diagnostic, asked };
      const topic = nextDiagnosticTopic(c.ctx.graph, diagnostic);
      if (!topic) {
        const placement = finishDiagnostic(diagnostic);
        return finish(next, { type: "placed", at: now, ...placement }, true, placement.known.length);
      }
      return { run: { ...next, current: diagnosticRef(c, topic, rng) }, problem, verdict, skipped };
    }
  }
}

/** runTask is the engine task a run carries out. */
export function runTask(run: RunState): Task {
  switch (run.kind) {
    case "lesson":
      return { kind: "lesson", topic: run.topic };
    case "review":
      return { kind: "review", topic: run.topic, covers: run.covers };
    case "quiz":
      return { kind: "quiz" };
    case "diagnostic":
      return { kind: "diagnostic" };
  }
}
