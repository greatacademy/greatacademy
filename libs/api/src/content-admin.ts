// The admin console's view of content: every course whole, whatever anyone has learned, and any problem to try. It
// reads the registry only and writes nothing: no learner, session or answer is recorded.

import type { MessageInitShape } from "@bufbuild/protobuf";
import { Code, ConnectError, type HandlerContext, type ServiceImpl } from "@connectrpc/connect";
import type { Problem, ProblemRef, Text } from "@ga/content";
import type { AdminService } from "@ga/proto/admin/v1/admin_pb";
import type { FeedbackSchema } from "@ga/proto/learning/v1/learning_pb";

import { courseMessage, courseUnits } from "./catalog.ts";
import { figure, knowledgePointIntro, passageMessage, problemView, sounds, text } from "./convert.ts";
import type { CourseEntry, Registry } from "./registry.ts";

/** ContentMethods are the methods of AdminService that show content. */
export type ContentMethods = Pick<
  ServiceImpl<typeof AdminService>,
  "getCourseContent" | "previewTopic" | "previewPassage" | "tryProblem" | "checkTry"
>;

/** MAX_SEED bounds the seeds a client may name, as the runner's seeds are bounded. */
const MAX_SEED = 2 ** 31 - 1;

/** answerOf is the answer of a problem with its solution, as feedback shows it, and the checker's message if any. */
function answerOf(problem: Problem, correct: boolean, message?: Text): MessageInitShape<typeof FeedbackSchema> {
  return {
    correct,
    ...(message && { message: text(message) }),
    solution: text(problem.solution),
    answer: problem.canonical,
    ...(problem.solutionFigure && { solutionFigure: figure(problem.solutionFigure) }),
    solutionSounds: sounds(problem.solutionSounds),
  };
}

/** checkable tells whether a problem's answers are checked by rules alone, not by a model or a speech service. */
const checkable = (problem: Problem) => problem.answer.judged === undefined && problem.answer.input.kind !== "speech";

/** contentMethods implements the content pages of the console; admin checks the role and fails otherwise. */
export function contentMethods(registry: Registry | undefined, admin: (ctx: HandlerContext) => Promise<unknown>): ContentMethods {
  const course = async (ctx: HandlerContext, id: string): Promise<CourseEntry> => {
    await admin(ctx);
    const c = await registry?.course(id);
    if (!c) throw new ConnectError(`unknown course ${id}`, Code.NotFound);
    return c;
  };
  const topicOf = (c: CourseEntry, id: string) => {
    const t = c.subject.topics.get(id);
    if (!t) throw new ConnectError(`unknown topic ${id}`, Code.NotFound);
    return t;
  };
  const link = (c: CourseEntry, id: string) => ({ topicId: id, title: text(topicOf(c, id).title) });
  /** refOf checks a problem's ref: a knowledge point of a topic, or a question of a passage. */
  const refOf = (c: CourseEntry, ref: { topicId: string; kp: number; seed: number } | undefined): ProblemRef => {
    if (!ref) throw new ConnectError("no problem named", Code.InvalidArgument);
    const passage = c.subject.passages.get(ref.topicId);
    const count = passage ? passage.questions : topicOf(c, ref.topicId).knowledgePoints.length;
    if (!Number.isInteger(ref.kp) || ref.kp < 0 || ref.kp >= count) throw new ConnectError("no such knowledge point", Code.NotFound);
    if (!Number.isInteger(ref.seed) || ref.seed < 0 || ref.seed > MAX_SEED)
      throw new ConnectError("a seed is a non-negative integer", Code.InvalidArgument);
    return { topic: ref.topicId, kp: ref.kp, seed: ref.seed };
  };
  return {
    async getCourseContent(req, ctx) {
      const c = await course(ctx, req.courseId);
      const listing = registry!.listings.find((s) => s.id === c.subject.def.id)!;
      return {
        course: courseMessage(listing, listing.courses.find((l) => l.id === c.id)!, courseUnits(c)),
        foundations: c.course.foundations.map((id) => {
          const t = topicOf(c, id);
          return { id, title: text(t.title), summary: text(t.summary), xp: t.xp, knowledgePoints: t.knowledgePoints.length };
        }),
        passages: c.planner.scope.passages.map((id) => {
          const p = c.subject.passages.get(id)!;
          return { id, title: text(p.title), questions: p.questions, words: p.words };
        }),
      };
    },

    async previewTopic(req, ctx) {
      const c = await course(ctx, req.courseId);
      const topic = topicOf(c, req.topicId);
      const count = topic.knowledgePoints.length;
      const indexes = Array.from({ length: count }, (_, kp) => kp);
      const [lessons, examples] = await Promise.all([
        Promise.all(indexes.map((kp) => c.source.lesson(topic.id, kp))),
        c.source.problems(indexes.map((kp) => ({ topic: topic.id, kp, seed: Math.abs(req.exampleSeed) + 1 }))),
      ]);
      const dependents = c.planner.scope.topics.filter((id) => c.subject.topics.get(id)?.prerequisites.includes(topic.id));
      return {
        topicId: topic.id,
        title: text(topic.title),
        summary: text(topic.summary),
        xp: topic.xp,
        practiceOnly: topic.practiceOnly ?? false,
        knowledgePoints: indexes.map((kp) => knowledgePointIntro(lessons[kp]!, examples[kp]!, kp, count)),
        prerequisites: topic.prerequisites.map((id) => link(c, id)),
        dependents: dependents.map((id) => link(c, id)),
      };
    },

    async previewPassage(req, ctx) {
      const c = await course(ctx, req.courseId);
      const p = c.subject.passages.get(req.passageId);
      if (!p) throw new ConnectError(`unknown passage ${req.passageId}`, Code.NotFound);
      const view = await c.source.passage(p.id);
      return {
        passage: passageMessage(c.subject.def.id, view),
        questions: p.questions,
        topics: p.topics.map((e) => link(c, e.topic)),
      };
    },

    async tryProblem(req, ctx) {
      const c = await course(ctx, req.ref?.courseId ?? "");
      const [problem] = await c.source.problems([refOf(c, req.ref)]);
      return { problem: problemView(problem!), answer: answerOf(problem!, true), checkable: checkable(problem!) };
    },

    async checkTry(req, ctx) {
      const c = await course(ctx, req.ref?.courseId ?? "");
      const ref = refOf(c, req.ref);
      const [problem] = await c.source.problems([ref]);
      if (!checkable(problem!))
        throw new ConnectError("this answer is judged by a model or heard by a speech service", Code.FailedPrecondition);
      const { verdict } = await c.source.judge(ref, req.response);
      return { feedback: answerOf(problem!, verdict.correct, verdict.feedback) };
    },
  };
}
