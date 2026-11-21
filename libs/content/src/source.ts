import { CheckerRegistry } from "./checkers.ts";
import type { Figure } from "./figure.ts";
import type { SubjectManifest } from "./manifest.ts";
import { type PassageView, passageProblem, passagesOf } from "./passages.ts";
import { generateAt, type ProblemRef, partOf } from "./problems.ts";
import { createRng } from "./rng.ts";
import type { Text } from "./text.ts";
import type { Checker, Problem, ReadingUnitDef, TopicDef, Verdict } from "./types.ts";

/** KnowledgePointLesson is what a lesson shows to introduce a knowledge point. */
export interface KnowledgePointLesson {
  readonly title: Text;
  readonly explanation: Text;
  readonly figure?: Figure;
  readonly figures?: readonly Figure[];
}

/** Judged is a generated problem and the verdict on a response to it. */
export interface Judged {
  readonly problem: Problem;
  readonly verdict: Verdict;
}

/**
 * SubjectSource serves what only a subject's code can produce. It is
 * asynchronous so that a subject could be served from another process.
 */
export interface SubjectSource {
  /** problems generates the problems of refs, in order. A question of a passage is the ref with the passage as its topic and the question as its knowledge point. */
  problems(refs: readonly ProblemRef[]): Promise<readonly Problem[]>;
  /** lesson gives the introduction of a knowledge point. */
  lesson(topic: string, kp: number): Promise<KnowledgePointLesson>;
  /** judge generates the problem of ref and checks a response to it. */
  judge(ref: ProblemRef, response: string): Promise<Judged>;
  /** passage gives the text of a passage. */
  passage(id: string): Promise<PassageView>;
}

/** SubjectGateway is the service of a subject: its manifest and its source. */
export interface SubjectGateway extends SubjectSource {
  /** manifest gives the subject without its code. */
  manifest(): Promise<SubjectManifest>;
}

/** topicSource serves a source from topic and passage definitions held in this process. */
export function topicSource(
  definitions: Iterable<TopicDef>,
  checkerList: readonly Checker[],
  reading: readonly ReadingUnitDef[] = [],
): SubjectSource {
  const topics = new Map<string, TopicDef>();
  for (const topic of definitions) topics.set(topic.id, topic);
  const checkers = new CheckerRegistry(checkerList);
  const point = (topic: string, kp: number) => {
    const def = topics.get(topic);
    if (!def) throw new Error(`unknown topic ${topic}`);
    const found = def.knowledgePoints[kp];
    if (!found) throw new Error(`topic ${topic} has no knowledge point ${kp}`);
    return found;
  };
  const passages = new Map(passagesOf(reading).map((p) => [p.id, p]));
  const covers = new Map(
    reading.flatMap((u) => {
      const cover = u.illustration;
      return cover ? u.passages.map((p) => [p.id, cover] as const) : [];
    }),
  );
  const generate = (ref: ProblemRef) => {
    const passage = passages.get(ref.topic);
    if (passage) return passageProblem(passage, ref.kp, createRng(ref.seed));
    const problem = generateAt(point(ref.topic, ref.kp), ref.seed, ref.difficulty);
    return problem.parts ? partOf(problem, ref.part ?? 0) : problem;
  };
  return {
    problems: async (refs) => refs.map(generate),
    lesson: async (topic, kp) => {
      const { title, explanation, figure, figures } = point(topic, kp);
      return { title, explanation, ...(figure && { figure }), ...(figures && { figures }) };
    },
    judge: async (ref, response) => {
      const problem = generate(ref);
      return { problem, verdict: checkers.judge(problem, response) };
    },
    passage: async (id) => {
      const passage = passages.get(id);
      if (!passage) throw new Error(`unknown passage ${id}`);
      const illustration = covers.get(id);
      return {
        title: passage.title,
        body: passage.body,
        ...(illustration && { illustration }),
        ...(passage.audio && { audio: passage.audio }),
        ...(passage.audio && passage.accent && { accent: passage.accent }),
      };
    },
  };
}
