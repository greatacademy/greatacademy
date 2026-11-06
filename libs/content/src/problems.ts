import { orderIndexes } from "./checkers.ts";
import type { CompiledSubject, Issue } from "./compile.ts";
import { type Figure, figureIssue, plottedPoints } from "./figure.ts";
import { createRng } from "./rng.ts";
import type { Locale, Text } from "./text.ts";
import { isText, locales } from "./text.ts";
import type { PlotGrid, Problem, TopicDef } from "./types.ts";

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
  readonly figure?: Figure;
  readonly input: Problem["answer"]["input"];
}

/** viewOf strips a problem down to its ProblemView. */
export function viewOf(problem: Problem): ProblemView {
  return { prompt: problem.prompt, ...(problem.figure && { figure: problem.figure }), input: problem.answer.input };
}

/** SampleOptions controls sampleGenerators. */
export interface SampleOptions {
  /** samples is the number of seeds tried per knowledge point. */
  readonly samples?: number;
  /** minDistinct is the fewest distinct prompts (with their figures and sets of options) expected among the samples before a warning. */
  readonly minDistinct?: number;
  /** shard limits sampling to the topics at positions index, index + count, … so that test files can sample in parallel. */
  readonly shard?: { readonly index: number; readonly count: number };
  /** textIssue reports what is wrong with a prompt, solution or option in one locale, if anything, so that a subject can enforce its own writing rules. */
  readonly textIssue?: (text: string, locale: Locale) => string | undefined;
  /** maxPositionShare is the largest share of a choice generator's samples whose answer may sit at one option position before an error. */
  readonly maxPositionShare?: number;
}

/** optionsOf lists the options of a choice or order problem in a fixed order, so that shuffling them does not make a new problem. */
function optionsOf(problem: Problem): readonly string[] {
  const { input } = problem.answer;
  if (input.kind === "order") return input.items.map((item) => item.en).sort();
  if (input.kind !== "choice") return [];
  return (input.figures?.map((f) => f.svg) ?? input.options.map((o) => o.en)).sort();
}

/**
 * sampleGenerators runs every knowledge point's generator over many seeds and
 * reports generators that throw, are not deterministic, produce invalid texts,
 * use unknown checkers, reject their canonical response, accept a listed wrong
 * response, break the subject's writing rules, keep the answer at one option
 * position, or lack variety.
 */
export function sampleGenerators(subject: CompiledSubject, options: SampleOptions = {}): Issue[] {
  const samples = options.samples ?? 200;
  const minDistinct = options.minDistinct ?? Math.min(10, samples);
  const issues: Issue[] = [];
  const topics = [...subject.topics.values()].filter((_, i) => !options.shard || i % options.shard.count === options.shard.index);
  for (const topic of topics) {
    topic.knowledgePoints.forEach((kp, index) => {
      const path = `topic ${topic.id} › kp ${kp.id}`;
      const prompts = new Set<string>();
      const positions = new Map<number, number>();
      for (let seed = 1; seed <= samples; seed++) {
        const found = checkSample(subject, topic, index, seed, options.textIssue);
        if (found) {
          issues.push({ severity: "error", path: `${path} › seed ${seed}`, message: found });
          return;
        }
        const p = generateProblem(subject, { topic: topic.id, kp: index, seed });
        prompts.add(JSON.stringify([p.prompt, p.figure?.svg, optionsOf(p)]));
        if (p.answer.input.kind === "choice")
          positions.set(p.answer.expected as number, (positions.get(p.answer.expected as number) ?? 0) + 1);
      }
      const top = Math.max(0, ...positions.values());
      if (options.maxPositionShare !== undefined && top > options.maxPositionShare * samples)
        issues.push({ severity: "error", path, message: `the answer sits at one option position in ${top} of ${samples} samples` });
      if (prompts.size < minDistinct)
        issues.push({ severity: "warning", path, message: `only ${prompts.size} distinct prompts in ${samples} samples` });
    });
  }
  return issues;
}

/** plotIssue tells what keeps a plot's canonical response from being marked on its grid. */
function plotIssue(grid: PlotGrid, points: number, canonical: string): string | undefined {
  if (!(grid.step > 0) || !(grid.scale > 0) || grid.xMin >= grid.xMax || grid.yMin >= grid.yMax) return "the grid of a plot is empty";
  const marked = plottedPoints(canonical);
  if (!marked || marked.length !== points) return `canonical response ${JSON.stringify(canonical)} does not list ${points} points`;
  const onGrid = (v: number, from: number) => Math.abs((v - from) / grid.step - Math.round((v - from) / grid.step)) < 1e-9;
  for (const [x, y] of marked) {
    if (x < grid.xMin || x > grid.xMax || y < grid.yMin || y > grid.yMax) return `(${x}, ${y}) lies outside the grid of the plot`;
    if (!onGrid(x, grid.xMin) || !onGrid(y, grid.yMin)) return `(${x}, ${y}) is not a point of the grid of the plot`;
  }
  return undefined;
}

function checkSample(
  subject: CompiledSubject,
  topic: TopicDef,
  kp: number,
  seed: number,
  textIssue: SampleOptions["textIssue"],
): string | undefined {
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
  if (textIssue) {
    const texts = [
      a.prompt,
      a.solution,
      ...(a.answer.input.kind === "choice" ? a.answer.input.options : []),
      ...(a.answer.input.kind === "order" ? a.answer.input.items : []),
      ...(a.mistakes ?? []).map((m) => m.feedback),
    ];
    for (const locale of locales) {
      for (const text of texts.filter(isText)) {
        const found = textIssue(text[locale], locale);
        if (found) return `${found}: ${text[locale]}`;
      }
    }
  }
  for (const drawn of [a.figure, a.solutionFigure]) {
    const figure = drawn && figureIssue(drawn);
    if (figure) return figure;
  }
  const { answer } = a;
  if (!subject.checkers.has(answer.checker)) return `unknown checker ${answer.checker}`;
  if (answer.input.kind === "choice") {
    const options = answer.input.options;
    if (options.length < 2) return "a choice needs at least two options";
    if (!options.every(isText)) return "every option must be non-empty in every locale";
    if (new Set(options.map((o) => o.en)).size !== options.length) return "options must be distinct";
    const { figures } = answer.input;
    if (figures) {
      if (figures.length !== options.length) return "a choice with figures needs one figure for each option";
      if (new Set(figures.map((f) => f.svg)).size !== figures.length) return "the figures of a choice must be distinct";
      const issue = figures.map(figureIssue).find(Boolean);
      if (issue) return issue;
    }
    if (typeof answer.expected !== "number" || answer.expected < 0 || answer.expected >= options.length)
      return "expected must be an option index";
  }
  if (answer.input.kind === "order") {
    const { items } = answer.input;
    if (items.length < 2) return "an order needs at least two items";
    if (!items.every(isText)) return "every item must be non-empty in every locale";
    const listed = orderIndexes(a.canonical);
    if ([...listed].sort((x, y) => x - y).join() !== items.map((_, i) => i).join())
      return "the canonical response must list every item once";
  }
  if (answer.input.kind === "plot") {
    if (!a.figure) return "a plot needs a figure to mark";
    const issue = plotIssue(answer.input.grid, answer.input.points, a.canonical);
    if (issue) return issue;
  }
  const verdict = subject.checkers.check(answer.checker, answer.expected, a.canonical);
  if (!verdict.correct) return `canonical response ${JSON.stringify(a.canonical)} is rejected`;
  for (const w of a.wrong ?? []) {
    if (subject.checkers.check(answer.checker, answer.expected, w).correct) return `wrong response ${JSON.stringify(w)} is accepted`;
  }
  for (const m of a.mistakes ?? []) {
    if (!isText(m.feedback)) return "the feedback of a mistake must be non-empty in every locale";
    if (subject.checkers.check(answer.checker, answer.expected, m.response).correct)
      return `mistake ${JSON.stringify(m.response)} is accepted`;
    if (!subject.checkers.same(answer.checker, answer.expected, m.response, m.response))
      return `mistake ${JSON.stringify(m.response)} does not match itself`;
  }
  return undefined;
}
