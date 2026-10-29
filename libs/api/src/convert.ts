import type { MessageInitShape } from "@bufbuild/protobuf";
import { generateProblem, type InputSpec, type Problem, type Text } from "@ga/content";
import { diagnosticLength, type LearnerState, reviewXp, type Task } from "@ga/engine";
import type { TextSchema } from "@ga/proto/common/v1/text_pb";
import type {
  InputSchema,
  ProblemViewSchema,
  QuestionSchema,
  ResultSchema,
  SessionSchema,
  TaskSchema,
} from "@ga/proto/learning/v1/learning_pb";

import type { CourseEntry } from "./registry.ts";
import { canSkip, diagnosticCandidates, type RunState, runTask } from "./runner.ts";

/** text converts a content text to its message. */
export function text(t: Text): MessageInitShape<typeof TextSchema> {
  return { values: { ...t } };
}

function input(spec: InputSpec): MessageInitShape<typeof InputSchema> {
  switch (spec.kind) {
    case "choice":
      return { kind: { case: "choice", value: { options: spec.options.map(text) } } };
    case "math":
      return { kind: { case: "math", value: { prefix: spec.prefix ?? "", suffix: spec.suffix ?? "" } } };
    case "text":
      return { kind: { case: "text", value: {} } };
  }
}

/** problemView converts what the learner may see of a problem before answering. */
export function problemView(p: Problem): MessageInitShape<typeof ProblemViewSchema> {
  return { prompt: text(p.prompt), input: input(p.answer.input) };
}

/** taskMessage describes an engine task for the dashboard. */
export function taskMessage(c: CourseEntry, task: Task, state: LearnerState): MessageInitShape<typeof TaskSchema> {
  const topic = (id: string) => c.subject.topics.get(id)!;
  switch (task.kind) {
    case "diagnostic":
      return { kind: { case: "diagnostic", value: { maxQuestions: diagnosticLength(diagnosticCandidates(c).length) } } };
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

function question(c: CourseEntry, run: RunState): MessageInitShape<typeof QuestionSchema> {
  const ref = run.current!;
  const q: MessageInitShape<typeof QuestionSchema> = {
    index: run.asked.length,
    problem: problemView(generateProblem(c.subject, ref)),
    feedback: run.kind === "lesson" || run.kind === "review",
    canSkip: canSkip(run),
    total: run.kind === "review" ? run.plan.length : run.kind === "quiz" ? run.topics.length : 0,
  };
  if (run.kind !== "lesson") return q;
  const l = run.lesson;
  const kp = c.subject.topics.get(run.topic)!.knowledgePoints[l.kp]!;
  const lesson = { knowledgePoint: l.kp, knowledgePoints: l.kpCount, streak: l.streak, needed: c.ctx.params.kpStreak };
  if (l.kpAsked > 0) return { ...q, lesson };
  const example = generateProblem(c.subject, { topic: run.topic, kp: l.kp, seed: run.example });
  return {
    ...q,
    lesson,
    intro: {
      index: l.kp,
      count: l.kpCount,
      title: text(kp.title),
      explanation: text(kp.explanation),
      example: { problem: problemView(example), solution: text(example.solution), answer: example.canonical },
    },
  };
}

function result(c: CourseEntry, run: RunState): MessageInitShape<typeof ResultSchema> {
  const r = run.result!;
  const items =
    run.kind === "review" || run.kind === "quiz"
      ? run.asked.map((a) => {
          const p = generateProblem(c.subject, a);
          return {
            topicId: a.topic,
            title: text(c.subject.topics.get(a.topic)!.title),
            correct: a.correct,
            problem: problemView(p),
            solution: text(p.solution),
            answer: p.canonical,
            response: a.response,
          };
        })
      : [];
  return { passed: r.passed, correct: r.correct, asked: r.asked, xp: r.xp, placed: r.placed, items };
}

/** sessionMessage describes a session: its task and its current question or result. */
export function sessionMessage(c: CourseEntry, id: string, run: RunState, state: LearnerState): MessageInitShape<typeof SessionSchema> {
  return {
    id,
    courseId: c.id,
    task: taskMessage(c, runTask(run), state),
    answered: run.asked.length,
    step: run.result ? { case: "result", value: result(c, run) } : { case: "question", value: question(c, run) },
  };
}
