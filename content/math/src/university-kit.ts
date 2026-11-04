// Shared writing helpers and integer arithmetic for the university courses added
// after the reference catalog: Number Theory, Real Analysis, Complex Analysis,
// Linear Programming and Partial Differential Equations.

import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import { numberProblem } from "./problems.ts";
import { pickChoice } from "./topics/grade-4-fractions.ts";

/** Pair is a text as an [English, Chinese] pair. */
export type Pair = readonly [string, string];

/** text turns a pair into a text. */
const text = ([en, zh]: Pair): Text => t(en, zh);

/** point builds a knowledge point from its id, title, explanation and generator. */
export function point(id: string, title: Pair, explanation: Pair, generate: (rng: Rng) => Problem): KnowledgePointDef {
  return { id, title: text(title), explanation: text(explanation), generate };
}

/** topic builds a university topic from its id, title, summary, prerequisites, encompassed topics and knowledge points. */
export function topic(
  id: string,
  title: Pair,
  summary: Pair,
  prerequisites: readonly string[],
  encompasses: readonly (readonly [string, number])[],
  knowledgePoints: readonly KnowledgePointDef[],
): TopicDef {
  return {
    id,
    title: text(title),
    summary: text(summary),
    prerequisites: [...prerequisites],
    encompasses: encompasses.map(([encompassed, weight]) => ({ topic: encompassed, weight })),
    xp: 10,
    standards: [],
    knowledgePoints: [...knowledgePoints],
  };
}

/** plausible removes repeats and the answer from the wrong responses, and adds near misses until there are three. */
function plausible(answer: number | Q, wrong: readonly (number | Q)[]): (number | Q)[] {
  const key = (v: number | Q) => (typeof v === "number" ? `${v}` : v.toLatex());
  const seen = new Set([key(answer)]);
  const kept = wrong.filter((v) => !seen.has(key(v)) && Boolean(seen.add(key(v))));
  for (let step = 1; kept.length < 3; step++) {
    const near = typeof answer === "number" ? answer + step : answer.add(Q.of(step));
    if (!seen.has(key(near))) {
      seen.add(key(near));
      kept.push(near);
    }
  }
  return kept;
}

/** bounds gives multiples of ten around some values, so that a prompt can name a range without naming a value. */
export function bounds(values: readonly number[]): [number, number] {
  return [Math.floor(Math.min(...values) / 10) * 10, Math.floor(Math.max(...values) / 10 + 1) * 10];
}

/** ask builds a problem whose answer is a number. */
export function ask(prompt: Pair, answer: number | Q, wrong: readonly (number | Q)[], solution: Pair, figure?: Figure): Problem {
  const problem = numberProblem({ prompt: text(prompt), answer, wrong: plausible(answer, wrong), solution: text(solution) });
  return figure ? { ...problem, figure } : problem;
}

/** choose builds a choice problem and drops wrong options that repeat the right one or each other. */
export function choose(rng: Rng, prompt: Pair, correct: Pair, wrong: readonly Pair[], solution: Pair, figure?: Figure): Problem {
  const seen = new Set([correct[0]]);
  const distinct = wrong.filter(([en]) => !seen.has(en) && Boolean(seen.add(en)));
  return pickChoice(rng, text(prompt), text(correct), distinct.map(text), text(solution), figure);
}

/** same writes the same formula as a pair, for an option that reads alike in both languages. */
export const same = (latex: string): Pair => [`$${latex}$`, `$${latex}$`];

/** isPrime tells whether a positive integer is prime. */
export function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
}

/** pickComposite picks a composite number in a range. */
export function pickComposite(rng: Rng, lo: number, hi: number): number {
  return rng.pick(Array.from({ length: hi - lo + 1 }, (_, i) => i + lo).filter((n) => !isPrime(n)));
}

/** primesUpTo lists the primes up to a limit. */
export function primesUpTo(limit: number): number[] {
  return Array.from({ length: Math.max(0, limit - 1) }, (_, i) => i + 2).filter(isPrime);
}

/** factorize gives the prime factorization of a positive integer as [prime, exponent] pairs. */
export function factorize(n: number): [number, number][] {
  const factors: [number, number][] = [];
  let rest = n;
  for (let p = 2; p * p <= rest; p++) {
    let e = 0;
    while (rest % p === 0) {
      rest /= p;
      e++;
    }
    if (e > 0) factors.push([p, e]);
  }
  if (rest > 1) factors.push([rest, 1]);
  return factors;
}

/** divisors lists the positive divisors of a positive integer in increasing order. */
export function divisors(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);
}

/** totient is Euler's function: how many of 1 to n are coprime to n. */
export function totient(n: number): number {
  return factorize(n).reduce((value, [p, e]) => value * p ** (e - 1) * (p - 1), 1);
}

/** powMod computes a to the power k modulo n by repeated squaring. */
export function powMod(a: number, k: number, n: number): number {
  let [result, base, e] = [1 % n, ((a % n) + n) % n, k];
  while (e > 0) {
    if (e % 2 === 1) result = (result * base) % n;
    base = (base * base) % n;
    e = Math.floor(e / 2);
  }
  return result;
}

/** orderMod gives the least positive k with a to the k equal to 1 modulo n, for a coprime to n. */
export function orderMod(a: number, n: number): number {
  let [k, value] = [1, a % n];
  while (value !== 1) {
    value = (value * a) % n;
    k++;
  }
  return k;
}

/** factorizationLatex writes a prime factorization in LaTeX. */
export const factorizationLatex = (factors: readonly (readonly [number, number])[]) =>
  factors.map(([p, e]) => (e === 1 ? `${p}` : `${p}^{${e}}`)).join(" \\cdot ");
