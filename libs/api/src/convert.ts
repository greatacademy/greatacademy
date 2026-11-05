import type { MessageInitShape } from "@bufbuild/protobuf";
import type { Figure, InputSpec, KnowledgePointLesson, Problem, Text } from "@ga/content";
import { diagnosticCandidates, diagnosticLength, type LearnerState, reviewXp, type Task } from "@ga/engine";
import type { FigureSchema } from "@ga/proto/common/v1/figure_pb";
import type { TextSchema } from "@ga/proto/common/v1/text_pb";
import type {
  InputSchema,
  KnowledgePointIntroSchema,
  ProblemViewSchema,
  QuestionSchema,
  ResultSchema,
  SessionSchema,
  TaskSchema,
} from "@ga/proto/learning/v1/learning_pb";

import type { CourseEntry } from "./registry.ts";
import { canSkip, type RunState, runTask } from "./runner.ts";

/** text converts a content text to its message. */
export function text(t: Text): MessageInitShape<typeof TextSchema> {
  return { values: { ...t } };
}

/** figure converts a content figure to its message. */
export function figure(f: Figure): MessageInitShape<typeof FigureSchema> {
  return { svg: f.svg, alt: text(f.alt) };
}

function input(spec: InputSpec): MessageInitShape<typeof InputSchema> {
  switch (spec.kind) {
    case "choice":
      return { kind: { case: "choice", value: { options: spec.options.map(text), figures: (spec.figures ?? []).map(figure) } } };
    case "math":
      return { kind: { case: "math", value: { prefix: spec.prefix ?? "", suffix: spec.suffix ?? "" } } };
    case "text":
      return { kind: { case: "text", value: {} } };
    case "plot":
      return { kind: { case: "plot", value: { ...spec.grid, points: spec.points } } };
  }
}

/** problemView converts what the learner may see of a problem before answering. */
export function problemView(p: Problem): MessageInitShape<typeof ProblemViewSchema> {
  return { prompt: text(p.prompt), input: input(p.answer.input), ...(p.figure && { figure: figure(p.figure) }) };
}

/** taskMessage describes an engine task for the dashboard. */
export function taskMessage(c: CourseEntry, task: Task, state: LearnerState): MessageInitShape<typeof TaskSchema> {
  const topic = (id: string) => c.subject.topics.get(id)!;
  switch (task.kind) {
    case "diagnostic":
      return { kind: { case: "diagnostic", value: { maxQuestions: diagnosticLength(diagnosticCandidates(c.planner, state).length) } } };
    case "lesson": {
      const t = topic(task.topic);
      return {
        kind: { case: "lesson", value: { topicId: t.id, title: text(t.title), xp: t.xp, knowledgePoints: t.knowledgePoints.length } },
      };
    }
    case "review": {
      const t = topic(task.topic);
      return { kind: { case: "review", value: { topicId: t.id, title: text(t.title), xp: reviewXp(t.xp), covers: [...task.covers] } } };
    }
    case "quiz": {
      const learned = c.planner.scope.topics.filter((id) => state.topics[id]?.learned).length;
      const p = c.ctx.params;
      return { kind: { case: "quiz", value: { questions: Math.min(p.quizQuestions, learned), xp: p.quizXp } } };
    }
  }
}

/** knowledgePointIntro converts a knowledge point's lesson and a worked example of it. */
export function knowledgePointIntro(
  kp: KnowledgePointLesson,
  example: Problem,
  index: number,
  count: number,
): MessageInitShape<typeof KnowledgePointIntroSchema> {
  return {
    index,
    count,
    title: text(kp.title),
    explanation: text(kp.explanation),
    example: {
      problem: problemView(example),
      solution: text(example.solution),
      answer: example.canonical,
      ...(example.solutionFigure && { solutionFigure: figure(example.solutionFigure) }),
    },
    ...(kp.figure && { figure: figure(kp.figure) }),
    figures: (kp.figures ?? []).map(figure),
  };
}

async function question(c: CourseEntry, run: RunState): Promise<MessageInitShape<typeof QuestionSchema>> {
  const ref = run.current!;
  const intro = run.kind === "lesson" && run.lesson.kpAsked === 0 && !run.practice;
  // The question and, when a knowledge point starts, its worked example come in one call.
  const [problem, example] = await c.source.problems(intro ? [ref, { topic: run.topic, kp: run.lesson.kp, seed: run.example }] : [ref]);
  const q: MessageInitShape<typeof QuestionSchema> = {
    index: run.asked.length,
    problem: problemView(problem!),
    feedback: run.kind === "lesson" || run.kind === "review",
    canSkip: canSkip(run),
    total: run.kind === "review" ? run.plan.length : run.kind === "quiz" ? run.topics.length : 0,
  };
  if (run.kind !== "lesson") return q;
  const l = run.lesson;
  const lesson = { knowledgePoint: l.kp, knowledgePoints: l.kpCount, streak: l.streak, needed: c.ctx.params.kpStreak };
  if (!intro) return { ...q, lesson };
  const kp = await c.source.lesson(run.topic, l.kp);
  return {
    ...q,
    lesson,
    intro: knowledgePointIntro(kp, example!, l.kp, l.kpCount),
  };
}

async function result(c: CourseEntry, run: RunState): Promise<MessageInitShape<typeof ResultSchema>> {
  const r = run.result!;
  const listed = run.kind !== "diagnostic";
  const problems = listed ? await c.source.problems(run.asked.map(({ topic, kp, seed }) => ({ topic, kp, seed }))) : [];
  const items = listed
    ? run.asked.map((a, i) => {
        const p = problems[i]!;
        return {
          topicId: a.topic,
          title: text(c.subject.topics.get(a.topic)!.title),
          correct: a.correct,
          problem: problemView(p),
          solution: text(p.solution),
          answer: p.canonical,
          response: a.response,
          ...(p.solutionFigure && { solutionFigure: figure(p.solutionFigure) }),
        };
      })
    : [];
  return { passed: r.passed, correct: r.correct, asked: r.asked, xp: r.xp, placed: r.placed, items };
}

/** sessionMessage describes a session: its task and its current question or result. */
export async function sessionMessage(
  c: CourseEntry,
  id: string,
  run: RunState,
  state: LearnerState,
): Promise<MessageInitShape<typeof SessionSchema>> {
  return {
    id,
    courseId: c.id,
    task: taskMessage(c, runTask(run), state),
    answered: run.asked.length,
    step: run.result ? { case: "result", value: await result(c, run) } : { case: "question", value: await question(c, run) },
  };
}
