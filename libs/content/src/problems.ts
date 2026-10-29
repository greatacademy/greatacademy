import type { CompiledSubject, Issue } from "./compile.ts";
import { createRng } from "./rng.ts";
import type { Text } from "./text.ts";
import { isText } from "./text.ts";
import type { Problem, TopicDef } from "./types.ts";

/** ProblemRef identifies a problem instance: the knowledge point that generates it and its seed. */
export interface ProblemRef {
  readonly topic: string;
  readonly kp: number;
  readonly seed: number;
}

/** generateProblem generates the problem of ref. */
export function generateProblem(subject: CompiledSubject, ref: ProblemRef): Problem {
  const topic = subject.topics.get(ref.topic);
  if (!topic) throw new Error(`unknown topic ${ref.topic}`);
  const kp = topic.knowledgePoints[ref.kp];
  if (!kp) throw new Error(`topic ${ref.topic} has no knowledge point ${ref.kp}`);
  return kp.generate(createRng(ref.seed));
}

/** ProblemView is what a client may see of a problem before answering: no answer, no solution. */
export interface ProblemView {
  readonly prompt: Text;
  readonly input: Problem["answer"]["input"];
}

/** viewOf strips a problem down to its ProblemView. */
export function viewOf(problem: Problem): ProblemView {
  return { prompt: problem.prompt, input: problem.answer.input };
}

/** SampleOptions controls sampleGenerators. */
export interface SampleOptions {
  /** samples is the number of seeds tried per knowledge point. */
  readonly samples?: number;
  /** minDistinct is the fewest distinct prompts expected among the samples before a warning. */
  readonly minDistinct?: number;
}

/**
 * sampleGenerators runs every knowledge point's generator over many seeds and
 * reports generators that throw, are not deterministic, produce invalid texts,
 * use unknown checkers, reject their canonical response, accept a listed wrong
 * response, or lack variety.
 */
export function sampleGenerators(subject: CompiledSubject, options: SampleOptions = {}): Issue[] {
  const samples = options.samples ?? 200;
  const minDistinct = options.minDistinct ?? Math.min(10, samples);
  const issues: Issue[] = [];
  for (const topic of subject.topics.values()) {
    topic.knowledgePoints.forEach((kp, index) => {
      const path = `topic ${topic.id} › kp ${kp.id}`;
      const prompts = new Set<string>();
      for (let seed = 1; seed <= samples; seed++) {
        const found = checkSample(subject, topic, index, seed);
        if (found) {
          issues.push({ severity: "error", path: `${path} › seed ${seed}`, message: found });
          return;
        }
        prompts.add(JSON.stringify(generateProblem(subject, { topic: topic.id, kp: index, seed }).prompt));
      }
      if (prompts.size < minDistinct)
        issues.push({ severity: "warning", path, message: `only ${prompts.size} distinct prompts in ${samples} samples` });
    });
  }
  return issues;
}

function checkSample(subject: CompiledSubject, topic: TopicDef, kp: number, seed: number): string | undefined {
  let a: Problem;
  let b: Problem;
  try {
    a = generateProblem(subject, { topic: topic.id, kp, seed });
    b = generateProblem(subject, { topic: topic.id, kp, seed });
  } catch (e) {
    return `generator threw: ${(e as Error).message}`;
  }
  if (JSON.stringify(a) !== JSON.stringify(b)) return "generator is not deterministic";
  if (!isText(a.prompt)) return "prompt must be non-empty in every locale";
  if (!isText(a.solution)) return "solution must be non-empty in every locale";
  for (const locale of ["en", "zh-CN"] as const) {
    for (const s of [a.prompt[locale], a.solution[locale]]) {
      if (/NaN|undefined|Infinity|\[object Object\]/.test(s))
        return `text contains ${s.match(/NaN|undefined|Infinity|\[object Object\]/)![0]}`;
    }
  }
  const { answer } = a;
  if (!subject.checkers.has(answer.checker)) return `unknown checker ${answer.checker}`;
  if (answer.input.kind === "choice") {
    const options = answer.input.options;
    if (options.length < 2) return "a choice needs at least two options";
    if (!options.every(isText)) return "every option must be non-empty in every locale";
    if (new Set(options.map((o) => o.en)).size !== options.length) return "options must be distinct";
    if (typeof answer.expected !== "number" || answer.expected < 0 || answer.expected >= options.length)
      return "expected must be an option index";
  }
  const verdict = subject.checkers.check(answer.checker, answer.expected, a.canonical);
  if (!verdict.correct) return `canonical response ${JSON.stringify(a.canonical)} is rejected`;
  for (const w of a.wrong ?? []) {
    if (subject.checkers.check(answer.checker, answer.expected, w).correct) return `wrong response ${JSON.stringify(w)} is accepted`;
  }
  return undefined;
}
