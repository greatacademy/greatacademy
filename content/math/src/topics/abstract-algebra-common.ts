import type { Problem, Rng, Text } from "@ga/content";
import { t } from "@ga/content";

import { choiceProblem } from "../problems.ts";
import { range } from "./methods-of-proof-common.ts";

// Helpers shared by the Abstract Algebra topic files: modular arithmetic and finite groups given by tables.

/** gcd is the greatest common divisor of two integers. */
export const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/** lcm is the least common multiple of two positive integers. */
export const lcm = (a: number, b: number) => (a / gcd(a, b)) * b;

/** mod is the least non-negative residue of a modulo n. */
export const mod = (a: number, n: number) => ((a % n) + n) % n;

/** modInverse is the inverse of a modulo n; a must be coprime to n. */
export function modInverse(a: number, n: number): number {
  const x = range(1, n - 1).find((x) => mod(a * x, n) === 1);
  if (x === undefined) throw new Error(`${a} has no inverse modulo ${n}`);
  return x;
}

/** units lists the units of ℤₙ in increasing order. */
export const units = (n: number) => range(1, n - 1).filter((a) => gcd(a, n) === 1);

/** phi is Euler's totient function. */
export const phi = (n: number) => units(n).length;

/** multiplicativeOrder is the order of a in U(n). */
export function multiplicativeOrder(a: number, n: number): number {
  let x = mod(a, n);
  let k = 1;
  while (x !== 1) {
    x = mod(x * a, n);
    k++;
  }
  return k;
}

/** FiniteGroup is a finite group on the elements 0, …, size − 1 given by its operation; labels name the elements. */
export interface FiniteGroup {
  readonly size: number;
  readonly op: (a: number, b: number) => number;
  readonly identity: number;
  readonly labels: readonly string[];
  readonly abelian: boolean;
}

/** cyclicGroup is ℤₙ under addition, labeled 0, …, n − 1. */
export const cyclicGroup = (n: number): FiniteGroup => ({
  size: n,
  op: (a, b) => (a + b) % n,
  identity: 0,
  labels: range(0, n - 1).map(String),
  abelian: true,
});

/** kleinGroup is the Klein four-group, the group of bit strings of length 2 under exclusive or. */
export const kleinGroup = (): FiniteGroup => ({
  size: 4,
  op: (a, b) => a ^ b,
  identity: 0,
  labels: ["e", "a", "b", "c"],
  abelian: true,
});

/** compose3 is the permutation p ∘ q of {0, 1, 2}. */
const compose3 = (p: readonly number[], q: readonly number[]) => q.map((x) => p[x]!);

/** S3_PERMS are the permutations e, r, r², s, rs, r²s of {0, 1, 2}, where r is the 3-cycle and s a transposition. */
const S3_PERMS: readonly (readonly number[])[] = (() => {
  const e = [0, 1, 2];
  const r = [1, 2, 0];
  const s = [0, 2, 1];
  const r2 = compose3(r, r);
  return [e, r, r2, s, compose3(r, s), compose3(r2, s)];
})();

/** symmetricGroup3 is S₃, the smallest non-abelian group, with elements e, r, r², s, rs, r²s. */
export const symmetricGroup3 = (): FiniteGroup => ({
  size: 6,
  op: (a, b) => {
    const r = compose3(S3_PERMS[a]!, S3_PERMS[b]!);
    return S3_PERMS.findIndex((p) => p.every((x, i) => x === r[i]));
  },
  identity: 0,
  labels: ["e", "r", "r^2", "s", "rs", "r^2s"],
  abelian: false,
});

/** unitsGroup is U(n), the units of ℤₙ under multiplication, labeled by their residues. */
export function unitsGroup(n: number): FiniteGroup {
  const us = units(n);
  return {
    size: us.length,
    op: (a, b) => us.indexOf(mod(us[a]! * us[b]!, n)),
    identity: 0,
    labels: us.map(String),
    abelian: true,
  };
}

/** relabel gives the elements of a group distinct random letters. */
export function relabel(rng: Rng, g: FiniteGroup): FiniteGroup {
  return { ...g, labels: rng.sample(["a", "b", "c", "d", "f", "g", "h", "k", "p", "q", "u", "v", "w", "x", "y", "z"], g.size) };
}

/** shuffled lists the elements of a group in a random order with the identity first, for use as table headings. */
export const shuffled = (rng: Rng, g: FiniteGroup) => [g.identity, ...rng.shuffle(range(0, g.size - 1).filter((x) => x !== g.identity))];

/** cayleyTex writes the Cayley table of a group with rows and columns in the given order, hiding the entries in hide (written ?). */
export function cayleyTex(
  g: FiniteGroup,
  order: readonly number[],
  hide: readonly (readonly [number, number])[] = [],
  symbol = "\\ast",
): string {
  const hidden = (a: number, b: number) => hide.some(([x, y]) => x === a && y === b);
  const rows = order.map((a) => `${g.labels[a]} & ${order.map((b) => (hidden(a, b) ? "?" : g.labels[g.op(a, b)])).join(" & ")}`);
  return `\\begin{array}{c|${"c".repeat(order.length)}} ${symbol} & ${order.map((b) => g.labels[b]).join(" & ")} \\\\ \\hline ${rows.join(" \\\\ ")} \\end{array}`;
}

/** elementOrder is the order of an element of a finite group. */
export function elementOrder(g: FiniteGroup, a: number): number {
  let x = a;
  let k = 1;
  while (x !== g.identity) {
    x = g.op(x, a);
    k++;
  }
  return k;
}

/** inverseOf is the inverse of an element of a finite group. */
export const inverseOf = (g: FiniteGroup, a: number) => range(0, g.size - 1).find((b) => g.op(a, b) === g.identity)!;

/** generated lists the elements of the subgroup generated by the given elements, in the order they are found. */
export function generated(g: FiniteGroup, gens: readonly number[]): number[] {
  const found = [g.identity];
  for (let i = 0; i < found.length; i++)
    for (const x of gens) {
      const y = g.op(found[i]!, x);
      if (!found.includes(y)) found.push(y);
    }
  return found;
}

/** divisors lists the positive divisors of n in increasing order. */
export const divisors = (n: number) => range(1, n).filter((d) => n % d === 0);

/** texChoice builds a multiple-choice problem whose options are LaTeX strings: the right one and up to three distinct wrong ones. */
export function texChoice(rng: Rng, prompt: Text, right: string, wrong: readonly string[], solution: Text): Problem {
  const options = [right];
  for (const w of wrong) {
    if (options.length === 4) break;
    if (!options.includes(w)) options.push(w);
  }
  const order = rng.shuffle(range(0, options.length - 1));
  return choiceProblem({
    prompt,
    options: order.map((i) => t(`$${options[i]}$`, `$${options[i]}$`)),
    correct: order.indexOf(0),
    solution,
  });
}

/** textChoice builds a multiple-choice problem whose options are texts: the right one first in the list, then the wrong ones. */
export function textChoice(rng: Rng, prompt: Text, options: readonly Text[], solution: Text): Problem {
  const order = rng.shuffle(range(0, options.length - 1));
  return choiceProblem({ prompt, options: order.map((i) => options[i]!), correct: order.indexOf(0), solution });
}

/** signed writes "+ k" or "- k" for a nonzero integer k, as a term after another. */
export const signed = (k: number) => (k < 0 ? `- ${-k}` : `+ ${k}`);
