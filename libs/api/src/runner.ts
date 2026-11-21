import type { Judged, Problem, ProblemRef, Rng, Verdict } from "@ga/content";
import {
  answerDiagnostic,
  answerLesson,
  type DiagnosticProgress,
  diagnosticCandidates,
  eventXp,
  finishDiagnostic,
  fullXp,
  isBlownOff,
  isReadingBlownOff,
  type LearnerState,
  type LessonProgress,
  lessonDifficulty,
  nextDiagnosticTopic,
  quizDifficulty,
  quizPlan,
  quizTimeLimitMs,
  readingPassed,
  reviewDifficulty,
  reviewOutcome,
  reviewPlan,
  startDiagnostic,
  startLesson,
  supplementalCandidates,
  type Task,
  type TaskEvent,
} from "@ga/engine";

import type { CourseEntry } from "./registry.ts";

/** Asked is a question of a run and its judged response. */
export interface Asked extends ProblemRef {
  readonly response: string;
  readonly correct: boolean;
  readonly skipped: boolean;
  /** elapsedMs is the server's time from serving the question to receiving the answer. */
  readonly elapsedMs: number;
  /** score is the fraction of criteria a model found met, for an answer it judged. */
  readonly score?: number;
  /** late marks a quiz answer that arrived after the time limit and so counts wrong. */
  readonly late?: boolean;
  /** parts are the answers to the parts of a multistep problem, in order; the question is correct when all of them are. */
  readonly parts?: readonly PartAnswer[];
  /** referenced marks a review question answered after looking at the reference. */
  readonly referenced?: boolean;
}

/** PartAnswer is the answer to one part of a multistep problem. */
export interface PartAnswer {
  readonly response: string;
  readonly correct: boolean;
  readonly elapsedMs: number;
}

/** QuizAnswer is the answer saved to a question of a quiz. */
export interface QuizAnswer {
  readonly response: string;
  readonly correct: boolean;
  /** late marks an answer saved after the time limit, which counts wrong. */
  readonly late?: boolean;
  /** parts are the answers to the parts of a multistep problem. */
  readonly parts?: readonly PartAnswer[];
  /** score is the fraction of criteria a model found met, for an answer it judged. */
  readonly score?: number;
  /** locked marks an answer that may not change: a multistep problem's, whose later parts show the earlier answers, or a model's verdict. */
  readonly locked?: boolean;
}

/** QuizSlot is a question of a quiz, which may be opened, answered and changed in any order until the quiz is handed in. */
export interface QuizSlot {
  /** ref is the problem asked, drawn when the question is first opened. */
  readonly ref?: ProblemRef;
  /** spentMs is how long the question was open. */
  readonly spentMs: number;
  /** partial are the answers to the parts of a multistep problem begun and not finished. */
  readonly partial?: readonly PartAnswer[];
  readonly answer?: QuizAnswer;
}

/** RunResult is the outcome of a finished run. */
export interface RunResult {
  readonly passed: boolean;
  readonly correct: number;
  readonly asked: number;
  /** xp is the XP the run changed the learner's total by. */
  readonly xp: number;
  /** full is the XP the task is worth when done well, before any bonus; missing in runs stored before it existed. */
  readonly full?: number;
  /** blownOff tells that the task was rushed through and so earned no XP. */
  readonly blownOff?: boolean;
  /** placed counts the topics the diagnostic placed as known. */
  readonly placed: number;
}

interface RunBase {
  readonly asked: readonly Asked[];
  /** current is the question to answer next; unset once the run is over. */
  readonly current?: ProblemRef;
  /** servedAt is when the current question was served. */
  readonly servedAt?: number;
  readonly result?: RunResult;
  /** attempt counts the judged tries at the current question that were sent back for a rewrite. */
  readonly attempt?: number;
  /** pending is the answer to the current question a model is judging; the run waits for its verdict. */
  readonly pending?: { readonly judgment: string; readonly response: string };
  /** partial are the answers to the parts of the current multistep problem before the part asked now. */
  readonly partial?: readonly PartAnswer[];
  /** referenced marks that the reference was looked at for the current question. */
  readonly referenced?: boolean;
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
      /** practice skips the explanations and worked examples of a practice-only topic. */
      readonly practice?: boolean;
    })
  | (RunBase & { readonly kind: "review"; readonly topic: string; readonly covers: readonly string[]; readonly plan: readonly number[] })
  | (RunBase & {
      readonly kind: "quiz";
      readonly topics: readonly string[];
      /** deadline is when the quiz's time runs out; absent in quizzes begun before quizzes were timed. */
      readonly deadline?: number;
      /** retake marks the last quiz taken again. */
      readonly retake?: boolean;
      /**
       * slots are the quiz's questions, one per topic, and at the one open; absent in quizzes begun before questions
       * could be answered in any order, whose answers are in asked. Their answers move to asked when the quiz ends.
       */
      readonly slots?: readonly QuizSlot[];
      readonly at?: number;
    })
  | (RunBase & { readonly kind: "reading"; readonly passage: string; readonly questions: number })
  | (RunBase & {
      readonly kind: "diagnostic";
      readonly diagnostic: DiagnosticProgress;
      /** supplemental marks a diagnostic of the gaps below what the learner knows. */
      readonly supplemental?: boolean;
    });

/**
 * newSeed draws a seed for a problem instance. Further questions of the same
 * run take the seeds after it, which is how a generator that cycles through a
 * bank of items avoids repeating one.
 */
export function newSeed(rng: Rng): number {
  return rng.int(0, 0x7fffffff);
}

function kpCount(c: CourseEntry, topic: string): number {
  return c.ctx.graph.graph.topics.get(topic)!.knowledgePoints.length;
}

function diagnosticRef(c: CourseEntry, topic: string, rng: Rng): ProblemRef {
  return { topic, kp: c.ctx.graph.graph.topics.get(topic)!.diagnosticKp, seed: newSeed(rng) };
}

/** startRun begins a run of a task. */
export function startRun(c: CourseEntry, task: Task, state: LearnerState, now: number, rng: Rng): RunState {
  const served = { asked: [], servedAt: now };
  switch (task.kind) {
    case "lesson": {
      const example = newSeed(rng);
      const lesson = startLesson(task.topic, kpCount(c, task.topic), c.ctx.graph.graph.topics.get(task.topic)?.essay === true);
      return {
        kind: "lesson",
        topic: task.topic,
        lesson,
        example,
        ...(c.subject.topics.get(task.topic)?.practiceOnly &&
          state.topics[task.topic]?.failedAt === undefined &&
          !state.topics[task.topic]?.reteach && { practice: true }),
        ...served,
        current: { topic: task.topic, kp: 0, seed: example + 1, difficulty: lessonDifficulty(c.ctx.params, lesson) },
      };
    }
    case "review": {
      const plan = reviewPlan(c.ctx.params, kpCount(c, task.topic), rng);
      return {
        kind: "review",
        topic: task.topic,
        covers: task.covers,
        plan,
        ...served,
        current: { topic: task.topic, kp: plan[0]!, seed: newSeed(rng), difficulty: reviewDifficulty(c.ctx.params, 0) },
      };
    }
    case "quiz": {
      const retake = task.retake === true;
      const topics = quizPlan(c.planner, state, rng, retake);
      const deadline = now + quizTimeLimitMs(c.ctx.params, topics.length);
      const current = { ...diagnosticRef(c, topics[0]!, rng), difficulty: quizDifficulty(c.ctx.params, 0, 0) };
      const slots = topics.map((_, i) => (i === 0 ? { ref: current, spentMs: 0 } : { spentMs: 0 }));
      return { kind: "quiz", topics, deadline, ...(retake && { retake }), ...served, current, slots, at: 0 };
    }
    case "reading": {
      const questions = c.ctx.graph.graph.passages.get(task.passage)!.questions;
      return { kind: "reading", passage: task.passage, questions, ...served, current: { topic: task.passage, kp: 0, seed: newSeed(rng) } };
    }
    case "diagnostic": {
      const supplemental = task.supplemental === true;
      const diagnostic = startDiagnostic(supplemental ? supplementalCandidates(c.planner, state) : diagnosticCandidates(c.planner, state));
      const first = nextDiagnosticTopic(c.ctx.graph, diagnostic);
      if (!first) throw new Error("the course has nothing to diagnose");
      return { kind: "diagnostic", diagnostic, ...(supplemental && { supplemental }), ...served, current: diagnosticRef(c, first, rng) };
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
  readonly event?: TaskEvent;
}

/** canSkip tells whether a run allows "I don't know": only the diagnostic does. */
export function canSkip(run: RunState): boolean {
  return run.kind === "diagnostic";
}

/** Given is a verdict reached outside the checkers, such as a model's on a judged answer, with its score. */
export interface Given extends Judged {
  readonly score?: number;
}

/**
 * answerRun judges a response to the current question and advances the run;
 * state is the learner's state before the answer. With given, the verdict is
 * given's, and the checkers are not asked.
 */
export async function answerRun(
  c: CourseEntry,
  run: RunState,
  state: LearnerState,
  response: string,
  skip: boolean,
  now: number,
  rng: Rng,
  given?: Given,
): Promise<Answered> {
  const answered = await advance(c, run, state, response, skip, now, rng, given);
  const next: Record<string, unknown> = { ...answered.run };
  delete next.attempt;
  delete next.pending;
  // The answers to earlier parts are kept only while a further part of the same problem is asked.
  if (!answered.run.current?.part) {
    delete next.partial;
    delete next.referenced;
  }
  return { ...answered, run: next as unknown as RunState };
}

async function advance(
  c: CourseEntry,
  run: RunState,
  state: LearnerState,
  response: string,
  skip: boolean,
  now: number,
  rng: Rng,
  given: Given | undefined,
): Promise<Answered> {
  const ref = run.current;
  if (!ref) throw new Error("the session is over");
  const skipped = !given && skip && canSkip(run);
  const { problem, verdict }: Judged = given
    ? given
    : skipped
      ? { problem: (await c.source.problems([ref]))[0]!, verdict: { correct: false } }
      : await c.source.judge(ref, response);
  const elapsed = now - (run.servedAt ?? 0);
  // A quiz answer that arrives after the time limit, beyond the time an answer takes to arrive, counts wrong.
  const late = run.kind === "quiz" && run.deadline !== undefined && now > run.deadline + c.ctx.params.quizGraceSeconds * 1000;
  const timeUp = run.kind === "quiz" && run.deadline !== undefined && now >= run.deadline;
  // A part of a multistep problem before its last is kept, and the next part asked; the problem is one question.
  const answer: PartAnswer = { response: skipped ? "" : response, correct: verdict.correct && !late, elapsedMs: elapsed };
  const part = problem.part;
  if (run.kind === "quiz") return saveToQuiz(c, quizRun(run), state, problem, verdict, answer, given, late, timeUp, now);
  if (part && part.index + 1 < part.count && !skipped && !timeUp) {
    const current = { ...ref, part: part.index + 1 };
    return { run: { ...run, partial: [...(run.partial ?? []), answer], servedAt: now, current }, problem, verdict, skipped };
  }
  const parts = part ? [...(run.partial ?? []), answer] : undefined;
  // A multistep problem left when the time ran out counts its parts not reached as wrong.
  const ok = parts ? parts.length === part!.count && parts.every((p) => p.correct) : answer.correct;
  const elapsedMs = parts ? parts.reduce((total, p) => total + p.elapsedMs, 0) : elapsed;
  const { part: _, ...asked0 } = ref;
  const asked = [
    ...run.asked,
    {
      ...asked0,
      response: answer.response,
      correct: ok,
      skipped,
      elapsedMs,
      ...(given?.score !== undefined && { score: given.score }),
      ...(late && { late }),
      ...(parts && { parts }),
      ...(run.referenced && { referenced: true }),
    },
  ];
  const correct = asked.filter((a) => a.correct).length;
  const finish = (next: RunState, finished: TaskEvent, passed: boolean, placed = 0): Answered => ({
    ...closeRun(c, state, next, finished, passed, placed),
    problem,
    verdict,
    skipped,
  });

  switch (run.kind) {
    case "lesson": {
      const lesson = answerLesson(c.ctx.params, run.lesson, ok);
      const next = { ...run, lesson, asked };
      if (lesson.outcome) {
        const passed = lesson.outcome === "passed";
        const event: TaskEvent = {
          type: "lesson",
          at: now,
          topic: run.topic,
          passed,
          asked: lesson.asked,
          correct: lesson.correct,
          ...(!passed && { kp: run.lesson.kp }),
        };
        return finish(next, event, passed);
      }
      const example = lesson.kp !== run.lesson.kp ? newSeed(rng) : run.example;
      return {
        run: {
          ...next,
          servedAt: now,
          example,
          // The worked example takes the seed before the first question of a knowledge point.
          current: {
            topic: run.topic,
            kp: lesson.kp,
            seed: example === run.example ? run.current.seed + 1 : example + 1,
            difficulty: lessonDifficulty(c.ctx.params, lesson),
          },
        },
        problem,
        verdict,
        skipped,
      };
    }
    case "review": {
      const next = { ...run, asked };
      const outcome = reviewOutcome(c.ctx.params, correct, asked.length);
      if (outcome) {
        const passed = outcome === "passed";
        const referenced = asked.filter((a) => a.correct && a.referenced).length;
        const event: TaskEvent = {
          type: "review",
          at: now,
          topic: run.topic,
          correct,
          total: asked.length,
          passed,
          ...(referenced > 0 && { referenced }),
        };
        return finish(next, event, passed);
      }
      // A review begun before plans held the questions after wrong answers asks its plan again.
      const kp = run.plan[asked.length % run.plan.length]!;
      return {
        run: {
          ...next,
          servedAt: now,
          current: { topic: run.topic, kp, seed: run.current.seed + 1, difficulty: reviewDifficulty(c.ctx.params, asked.length) },
        },
        problem,
        verdict,
        skipped,
      };
    }
    case "reading": {
      const next = { ...run, asked };
      if (asked.length >= run.questions) {
        const event: TaskEvent = { type: "reading", at: now, passage: run.passage, correct, total: asked.length };
        return finish(next, event, readingPassed(event));
      }
      return {
        run: { ...next, servedAt: now, current: { topic: run.passage, kp: asked.length, seed: run.current!.seed + 1 } },
        problem,
        verdict,
        skipped,
      };
    }
    case "diagnostic": {
      const diagnostic = answerDiagnostic(c.ctx.graph, run.diagnostic, ref.topic, ok);
      const next = { ...run, diagnostic, asked };
      const topic = nextDiagnosticTopic(c.ctx.graph, diagnostic);
      if (!topic) {
        const placement = finishDiagnostic(c.planner, diagnostic);
        const event: TaskEvent = {
          type: "placed",
          at: now,
          course: c.id,
          ...placement,
          ...(run.supplemental && { supplemental: true }),
          checked: diagnostic.candidates,
        };
        return finish(next, event, true, placement.known.length);
      }
      return { run: { ...next, servedAt: now, current: diagnosticRef(c, topic, rng) }, problem, verdict, skipped };
    }
  }
}

/** questionIndex is the index of the question a run asks now: the question open in a quiz, the next one elsewhere. */
export function questionIndex(run: RunState): number {
  return run.kind === "quiz" && run.slots && run.at !== undefined ? run.at : run.asked.length;
}

/** runTask is the engine task a run carries out. */
export function runTask(run: RunState): Task {
  switch (run.kind) {
    case "lesson":
      return { kind: "lesson", topic: run.topic };
    case "review":
      return { kind: "review", topic: run.topic, covers: run.covers };
    case "quiz":
      return { kind: "quiz", ...(run.retake && { retake: true }) };
    case "reading":
      return { kind: "reading", passage: run.passage };
    case "diagnostic":
      return { kind: "diagnostic", ...(run.supplemental && { supplemental: true }) };
  }
}

/** closeRun ends a run with its event, whose asked answers are in it, and its result. */
function closeRun(
  c: CourseEntry,
  state: LearnerState,
  next: RunState,
  finished: TaskEvent,
  passed: boolean,
  placed = 0,
): { readonly run: RunState; readonly event: TaskEvent } {
  const { asked } = next;
  const blownOff =
    finished.type === "reading"
      ? isReadingBlownOff(
          c.ctx.params,
          passed,
          c.ctx.graph.graph.passages.get(finished.passage)!.words,
          asked.reduce((total, a) => total + a.elapsedMs, 0),
        )
      : finished.type !== "placed" && isBlownOff(c.ctx.params, passed, asked);
  const event = blownOff ? { ...finished, blownOff } : finished;
  const result: RunResult = {
    passed,
    correct: asked.filter((a) => a.correct).length,
    asked: asked.length,
    xp: eventXp(c.ctx, state, event),
    full: fullXp(c.ctx, event),
    blownOff,
    placed,
  };
  const { current: _current, servedAt: _servedAt, partial: _partial, ...rest } = next;
  return { run: { ...rest, result } as RunState, event };
}

type QuizRun = Extract<RunState, { kind: "quiz" }> & { readonly slots: readonly QuizSlot[]; readonly at: number };

/**
 * quizRun is a quiz with its questions as slots: a quiz begun before questions could be answered in any order has its
 * answers moved from asked, final as they were.
 */
export function quizRun(run: Extract<RunState, { kind: "quiz" }>): QuizRun {
  if (run.slots && run.at !== undefined) return run as QuizRun;
  const slots = run.topics.map((_, i): QuizSlot => {
    const a = run.asked[i];
    if (a) {
      const { response, correct, late, parts, score, elapsedMs, topic, kp, seed, difficulty } = a;
      const answer = {
        response,
        correct,
        locked: true,
        ...(late && { late }),
        ...(parts && { parts }),
        ...(score !== undefined && { score }),
      };
      return { ref: { topic, kp, seed, ...(difficulty && { difficulty }) }, spentMs: elapsedMs, answer };
    }
    if (i !== run.asked.length || !run.current) return { spentMs: 0 };
    const { part: _part, ...ref } = run.current;
    return { ref, spentMs: 0, ...(run.partial && { partial: run.partial }) };
  });
  return { ...run, slots, at: Math.min(run.asked.length, run.topics.length - 1) };
}

/** quizTimeUp tells whether a quiz's time has run out. */
export function quizTimeUp(run: Extract<RunState, { kind: "quiz" }>, now: number): boolean {
  return run.deadline !== undefined && now >= run.deadline;
}

/** leaveSlot keeps the time the open question of a quiz was open, and the parts of it begun. */
function leaveSlot(run: QuizRun, now: number): QuizSlot[] {
  const slots = [...run.slots];
  const here = slots[run.at];
  if (!here) return slots;
  const spentMs = here.spentMs + Math.max(0, now - (run.servedAt ?? now));
  const { partial: _, ...rest } = here;
  slots[run.at] = { ...rest, spentMs, ...(run.partial?.length && !here.answer && { partial: run.partial }) };
  return slots;
}

/**
 * openQuizQuestion turns a quiz to one of its questions. A question opened for the first time is drawn at the tier the
 * answers saved so far steer to; a multistep problem opens at the part reached, and one answered shows its last part.
 */
export function openQuizQuestion(
  c: CourseEntry,
  quiz: Extract<RunState, { kind: "quiz" }>,
  index: number,
  now: number,
  rng: Rng,
): RunState {
  const run = quizRun(quiz);
  if (index < 0 || index >= run.slots.length) throw new Error("the quiz has no such question");
  const slots = leaveSlot(run, now);
  let target = slots[index]!;
  if (!target.ref) {
    const saved = slots.filter((s) => s.answer);
    const correct = saved.filter((s) => s.answer!.correct).length;
    const ref = { ...diagnosticRef(c, run.topics[index]!, rng), difficulty: quizDifficulty(c.ctx.params, correct, saved.length) };
    target = { ...target, ref };
    slots[index] = target;
  }
  const parts = target.answer?.parts;
  const partial = parts ? parts.slice(0, -1) : target.partial;
  const at = parts ? parts.length - 1 : (partial?.length ?? 0);
  const current = at > 0 ? { ...target.ref!, part: at } : target.ref!;
  const next: Record<string, unknown> = { ...run, slots, at: index, current, servedAt: now };
  delete next.partial;
  if (partial?.length) next.partial = partial;
  return next as unknown as RunState;
}

/** saveToQuiz keeps an answer to the open question of a quiz, which says nothing of it until the quiz is handed in. */
function saveToQuiz(
  c: CourseEntry,
  run: QuizRun,
  state: LearnerState,
  problem: Problem,
  verdict: Verdict,
  answer: PartAnswer,
  given: Given | undefined,
  late: boolean,
  timeUp: boolean,
  now: number,
): Answered {
  const slot = run.slots[run.at]!;
  if (slot.answer?.locked) throw new Error("that answer is final");
  const part = problem.part;
  const done = { problem, verdict, skipped: false };
  // A part before the last is kept, and the next part asked.
  if (part && part.index + 1 < part.count && !timeUp) {
    const current = { ...run.current!, part: part.index + 1 };
    return { ...done, run: { ...run, partial: [...(run.partial ?? []), answer], current } };
  }
  const parts = part ? [...(run.partial ?? []), answer] : undefined;
  const correct = parts ? parts.length === part!.count && parts.every((p) => p.correct) : answer.correct;
  const saved: QuizAnswer = {
    response: answer.response,
    correct,
    ...(late && { late }),
    ...(parts && { parts }),
    ...(given?.score !== undefined && { score: given.score }),
    // Begun parts and an answer a model judged are final; an answer judged at once may still change.
    ...((parts || given?.score !== undefined) && { locked: true }),
  };
  const slots = leaveSlot(run, now);
  const { partial: _, ...rest } = slots[run.at]!;
  slots[run.at] = { ...rest, answer: saved };
  const next: Record<string, unknown> = { ...run, slots, servedAt: now, current: run.slots[run.at]!.ref };
  delete next.partial;
  // Once the time is up the quiz ends with what was saved.
  if (timeUp) return { ...done, ...finishQuiz(c, next as unknown as QuizRun, state, now) };
  return { ...done, run: next as unknown as RunState };
}

/**
 * finishQuiz hands a quiz in: the answers saved become its asked questions, in order, and the questions without one
 * count wrong, marked late when the time ran out.
 */
export function finishQuiz(
  c: CourseEntry,
  quiz: Extract<RunState, { kind: "quiz" }>,
  state: LearnerState,
  now: number,
): { readonly run: RunState; readonly event: TaskEvent } {
  const run = quizRun(quiz);
  const slots = leaveSlot(run, now);
  const timeUp = quizTimeUp(run, now);
  // A quiz begun before its questions were slots keeps the answers recorded then first, in the same order.
  const asked: Asked[] = slots.flatMap((s) =>
    s.answer && s.ref
      ? [
          {
            ...s.ref,
            response: s.answer.response,
            correct: s.answer.correct,
            skipped: false,
            elapsedMs: s.spentMs,
            ...(s.answer.late && { late: true }),
            ...(s.answer.parts && { parts: s.answer.parts }),
            ...(s.answer.score !== undefined && { score: s.answer.score }),
          },
        ]
      : [],
  );
  const results = slots.map((s, i) =>
    s.answer
      ? { topic: run.topics[i]!, correct: s.answer.correct, ...(s.answer.late && { late: true }) }
      : { topic: run.topics[i]!, correct: false, ...(timeUp && { late: true }) },
  );
  const correct = results.filter((r) => r.correct).length;
  const event: TaskEvent = { type: "quiz", at: now, results, ...(run.retake && { retake: true }) };
  return closeRun(c, state, { ...run, slots, asked }, event, correct * 2 >= results.length);
}
