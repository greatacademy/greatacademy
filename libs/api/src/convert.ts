import type { MessageInitShape } from "@bufbuild/protobuf";
import type { Figure, InputSpec, KnowledgePointLesson, PassageView, Problem, Sound, Text } from "@ga/content";
import {
  diagnosticCandidates,
  diagnosticLength,
  homeCourse,
  kpAnswers,
  kpNeeded,
  type LearnerState,
  quizTimeLimitMs,
  reviewXp,
  supplementalCandidates,
  type Task,
} from "@ga/engine";
import type { FigureSchema } from "@ga/proto/common/v1/figure_pb";
import type { TextSchema } from "@ga/proto/common/v1/text_pb";
import type {
  FeedbackSchema,
  InputSchema,
  KnowledgePointIntroSchema,
  PassageSchema,
  ProblemViewSchema,
  QuestionSchema,
  ResultSchema,
  SessionSchema,
  SoundSchema,
  TaskSchema,
} from "@ga/proto/learning/v1/learning_pb";

import type { CourseEntry } from "./registry.ts";
import { canSkip, type RunState, runTask } from "./runner.ts";

/** illustrationPath is the path, from the site's root and without an extension, of a subject's illustration; "" for none. */
export function illustrationPath(subject: string, name: string | undefined): string {
  return name ? `illustrations/${subject}/${name}` : "";
}

/** audioPath is the path, from the site's root and without an extension, of a subject's recording; "" for none. */
export function audioPath(subject: string, name: string | undefined): string {
  return name ? `audio/${subject}/${name}` : "";
}

/** passageMessage converts what a reader sees of a passage. */
export function passageMessage(subject: string, passage: PassageView): MessageInitShape<typeof PassageSchema> {
  return {
    title: text(passage.title),
    body: passage.body,
    illustration: illustrationPath(subject, passage.illustration),
    audio: audioPath(subject, passage.audio),
    ...(passage.accent && { accent: text(passage.accent) }),
  };
}

/** sounds converts the recordings of a solution. */
export function sounds(list: readonly Sound[] | undefined): MessageInitShape<typeof SoundSchema>[] {
  return (list ?? []).map(({ text, audio }) => ({ text, audio }));
}

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
    case "order":
      return { kind: { case: "order", value: { items: spec.items.map(text) } } };
    case "plot":
      return { kind: { case: "plot", value: { ...spec.grid, points: spec.points } } };
    case "writing":
      return { kind: { case: "writing", value: { minWords: spec.minWords, maxChars: spec.maxChars } } };
    case "strokes":
      return { kind: { case: "strokes", value: { strokes: spec.strokes, trace: spec.trace ?? "" } } };
    case "speech":
      return {
        kind: { case: "speech", value: { language: spec.language, mode: spec.mode, text: spec.text ?? "", maxSeconds: spec.maxSeconds } },
      };
  }
}

/** problemView converts what the learner may see of a problem before answering. */
export function problemView(p: Problem): MessageInitShape<typeof ProblemViewSchema> {
  return {
    prompt: text(p.prompt),
    input: input(p.answer.input),
    ...(p.figure && { figure: figure(p.figure) }),
    listen: [...(p.listen ?? [])],
    picture: p.picture ?? "",
  };
}

/** fromCourse names the earlier course a foundation of the course comes from, as Math Academy labels such tasks. */
function fromCourse(c: CourseEntry, topic: string): { fromCourse?: ReturnType<typeof text> } {
  if (c.planner.scope.inCourse.has(topic)) return {};
  const home = homeCourse(c.index, c.id, topic);
  const course = home === undefined ? undefined : c.subject.courses.get(home);
  return course ? { fromCourse: text(course.def.title) } : {};
}

/** taskMessage describes an engine task for the dashboard. */
export function taskMessage(c: CourseEntry, task: Task, state: LearnerState): MessageInitShape<typeof TaskSchema> {
  const topic = (id: string) => c.subject.topics.get(id)!;
  switch (task.kind) {
    case "diagnostic": {
      const supplemental = task.supplemental === true;
      const candidates = supplemental ? supplementalCandidates(c.planner, state) : diagnosticCandidates(c.planner, state);
      return {
        kind: { case: "diagnostic", value: { maxQuestions: diagnosticLength(candidates.length), supplemental, topics: candidates.length } },
      };
    }
    case "lesson": {
      const t = topic(task.topic);
      return {
        kind: {
          case: "lesson",
          value: { topicId: t.id, title: text(t.title), xp: t.xp, knowledgePoints: t.knowledgePoints.length, ...fromCourse(c, t.id) },
        },
      };
    }
    case "review": {
      const t = topic(task.topic);
      return {
        kind: {
          case: "review",
          value: { topicId: t.id, title: text(t.title), xp: reviewXp(t.xp), covers: [...task.covers], ...fromCourse(c, t.id) },
        },
      };
    }
    case "reading": {
      const passage = c.subject.passages.get(task.passage)!;
      return {
        kind: {
          case: "reading",
          value: { passageId: passage.id, title: text(passage.title), xp: passage.xp, questions: passage.questions, words: passage.words },
        },
      };
    }
    case "quiz": {
      const learned = c.planner.scope.topics.filter((id) => state.topics[id]?.learned).length;
      const p = c.ctx.params;
      const questions = task.retake ? (state.lastQuiz?.topics.length ?? 0) : Math.min(p.quizQuestions, learned);
      const minutes = Math.round(quizTimeLimitMs(p, questions) / 60_000);
      return { kind: { case: "quiz", value: { questions, xp: p.quizXp, retake: task.retake === true, minutes } } };
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
      solutionSounds: sounds(example.solutionSounds),
    },
    ...(kp.figure && { figure: figure(kp.figure) }),
    figures: (kp.figures ?? []).map(figure),
  };
}

/** reviewTotal is how many questions a review asks if every answer from now on is right: one more for each wrong answer so far. */
function reviewTotal(c: CourseEntry, run: RunState): number {
  const correct = run.asked.filter((a) => a.correct).length;
  return run.asked.length + Math.max(1, c.ctx.params.reviewPass - correct);
}

async function question(
  c: CourseEntry,
  run: RunState,
  judging: { readonly delayed: boolean; readonly failed: boolean } | undefined,
): Promise<MessageInitShape<typeof QuestionSchema>> {
  const ref = run.current!;
  const intro = run.kind === "lesson" && run.lesson.kpAsked === 0 && !run.practice;
  // The question and, when a knowledge point starts, its worked example come in one call.
  const [problem, example] = await c.source.problems(intro ? [ref, { topic: run.topic, kp: run.lesson.kp, seed: run.example }] : [ref]);
  const q: MessageInitShape<typeof QuestionSchema> = {
    index: run.asked.length,
    problem: problemView(problem!),
    feedback: run.kind === "lesson" || run.kind === "review" || run.kind === "reading",
    canSkip: canSkip(run),
    total:
      run.kind === "review" ? reviewTotal(c, run) : run.kind === "quiz" ? run.topics.length : run.kind === "reading" ? run.questions : 0,
    attempt: run.attempt ?? 0,
    deadline: BigInt(run.kind === "quiz" ? (run.deadline ?? 0) : 0),
    essay: run.kind === "lesson" && run.lesson.essay === true,
    ...(run.pending && {
      judging: { response: run.pending.response, delayed: judging?.delayed ?? false, failed: judging?.failed ?? false },
    }),
  };
  if (run.kind === "reading") {
    const passage = await c.source.passage(run.passage);
    return {
      ...q,
      passage: passageMessage(c.subject.def.id, passage),
    };
  }
  if (run.kind !== "lesson") return q;
  const l = run.lesson;
  const lesson = { knowledgePoint: l.kp, knowledgePoints: l.kpCount, streak: kpAnswers(l).correct, needed: kpNeeded(c.ctx.params, l) };
  if (!intro) return { ...q, lesson };
  const kp = await c.source.lesson(run.topic, l.kp);
  return {
    ...q,
    lesson,
    intro: knowledgePointIntro(kp, example!, l.kp, l.kpCount),
  };
}

async function result(
  c: CourseEntry,
  run: RunState,
  feedback: MessageInitShape<typeof FeedbackSchema> | undefined,
): Promise<MessageInitShape<typeof ResultSchema>> {
  const r = run.result!;
  const listed = run.kind !== "diagnostic";
  const problems = listed ? await c.source.problems(run.asked.map(({ topic, kp, seed }) => ({ topic, kp, seed }))) : [];
  // A lesson's questions are grouped by knowledge point, under its title.
  const topic = run.kind === "lesson" ? run.topic : undefined;
  const kps = topic ? [...new Set(run.asked.map((a) => a.kp))] : [];
  const kpTitles = new Map(await Promise.all(kps.map(async (kp) => [kp, text((await c.source.lesson(topic!, kp)).title)] as const)));
  const unanswered = run.kind === "quiz" ? Math.max(0, run.topics.length - run.asked.length) : 0;
  const items = listed
    ? run.asked.map((a, i) => {
        const p = problems[i]!;
        return {
          topicId: a.topic,
          title: text((c.subject.topics.get(a.topic) ?? c.subject.passages.get(a.topic)!).title),
          correct: a.correct,
          problem: problemView(p),
          solution: text(p.solution),
          answer: p.canonical,
          response: a.response,
          ...(p.solutionFigure && { solutionFigure: figure(p.solutionFigure) }),
          solutionSounds: sounds(p.solutionSounds),
          elapsedMs: BigInt(Math.max(0, Math.round(a.elapsedMs))),
          late: a.late === true,
          knowledgePoint: a.kp,
          ...(kpTitles.has(a.kp) && { knowledgePointTitle: kpTitles.get(a.kp) }),
        };
      })
    : [];
  const passage = run.kind === "reading" ? await c.source.passage(run.passage) : undefined;
  return {
    passed: r.passed,
    correct: r.correct,
    asked: r.asked,
    xp: r.xp,
    fullXp: r.full ?? r.xp,
    blownOff: r.blownOff ?? false,
    placed: r.placed,
    items,
    unanswered,
    ...(feedback && { feedback }),
    ...(passage && {
      passage: passageMessage(c.subject.def.id, passage),
    }),
  };
}

/** EssayView is what a session's message shows of its essay: submitted and waiting, or the verdict on its result. */
export interface EssayView {
  readonly submitted?: { readonly response: string; readonly failed: boolean };
  readonly feedback?: MessageInitShape<typeof FeedbackSchema>;
}

/** sessionMessage describes a session: its task and its current question, its submitted essay, or its result. */
export async function sessionMessage(
  c: CourseEntry,
  id: string,
  run: RunState,
  state: LearnerState,
  judging?: { readonly delayed: boolean; readonly failed: boolean },
  essay?: EssayView,
): Promise<MessageInitShape<typeof SessionSchema>> {
  const base = { id, courseId: c.id, task: taskMessage(c, runTask(run), state), answered: run.asked.length };
  if (essay?.submitted) return { ...base, step: { case: "submitted", value: essay.submitted } };
  if (run.result) return { ...base, step: { case: "result", value: await result(c, run, essay?.feedback) } };
  return { ...base, step: { case: "question", value: await question(c, run, judging) } };
}
