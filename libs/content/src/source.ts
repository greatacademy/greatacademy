import { CheckerRegistry } from "./checkers.ts";
import type { Figure } from "./figure.ts";
import type { SubjectListing, SubjectManifest } from "./manifest.ts";
import type { ProblemRef } from "./problems.ts";
import { createRng } from "./rng.ts";
import type { Text } from "./text.ts";
import type { Checker, Problem, TopicDef, Verdict } from "./types.ts";

/** KnowledgePointLesson is what a lesson shows to introduce a knowledge point. */
export interface KnowledgePointLesson {
  readonly title: Text;
  readonly explanation: Text;
  readonly figure?: Figure;
}

/** Judged is a generated problem and the verdict on a response to it. */
export interface Judged {
  readonly problem: Problem;
  readonly verdict: Verdict;
}

/**
 * SubjectSource serves what only a subject's code can produce. It is
 * asynchronous because that code may run in another Worker: a Worker RPC stub
 * for a subject satisfies this interface.
 */
export interface SubjectSource {
  /** problems generates the problems of refs, in order. */
  problems(refs: readonly ProblemRef[]): Promise<readonly Problem[]>;
  /** lesson gives the introduction of a knowledge point. */
  lesson(topic: string, kp: number): Promise<KnowledgePointLesson>;
  /** judge generates the problem of ref and checks a response to it. */
  judge(ref: ProblemRef, response: string): Promise<Judged>;
}

/** SubjectGateway is the service of a subject: its manifest and its source. */
export interface SubjectGateway extends SubjectSource {
  /** listing gives what a list of courses needs, without loading the subject. */
  listing(): Promise<SubjectListing>;
  /** manifest gives the subject without its code. */
  manifest(): Promise<SubjectManifest>;
}

/**
 * routeSource serves a source from shards that each hold some of the topics.
 * shards maps the name of each shard to the ids of its topics; shard gives the
 * source of a shard by that name.
 */
export function routeSource(shards: Readonly<Record<string, readonly string[]>>, shard: (name: string) => SubjectSource): SubjectSource {
  const owner = new Map<string, string>();
  for (const [name, topics] of Object.entries(shards)) for (const topic of topics) owner.set(topic, name);
  const of = (topic: string) => {
    const name = owner.get(topic);
    if (!name) throw new Error(`unknown topic ${topic}`);
    return name;
  };
  return {
    problems: async (refs) => {
      const byShard = new Map<string, number[]>();
      refs.forEach((ref, i) => {
        const name = of(ref.topic);
        const at = byShard.get(name);
        if (at) at.push(i);
        else byShard.set(name, [i]);
      });
      const out = new Array<Problem>(refs.length);
      await Promise.all(
        [...byShard].map(async ([name, at]) => {
          const problems = await shard(name).problems(at.map((i) => refs[i]!));
          at.forEach((i, j) => {
            out[i] = problems[j]!;
          });
        }),
      );
      return out;
    },
    lesson: (topic, kp) => shard(of(topic)).lesson(topic, kp),
    judge: (ref, response) => shard(of(ref.topic)).judge(ref, response),
  };
}

/** topicSource serves a source from topic definitions held in this process. */
export function topicSource(definitions: Iterable<TopicDef>, checkerList: readonly Checker[]): SubjectSource {
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
  const generate = (ref: ProblemRef) => point(ref.topic, ref.kp).generate(createRng(ref.seed));
  return {
    problems: async (refs) => refs.map(generate),
    lesson: async (topic, kp) => {
      const { title, explanation, figure } = point(topic, kp);
      return { title, explanation, ...(figure && { figure }) };
    },
    judge: async (ref, response) => {
      const problem = generate(ref);
      return { problem, verdict: checkers.check(problem.answer.checker, problem.answer.expected, response) };
    },
  };
}
