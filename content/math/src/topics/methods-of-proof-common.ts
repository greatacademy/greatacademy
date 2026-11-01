import type { Problem, Rng, Text } from "@ga/content";
import { t } from "@ga/content";
import { solutionsChecker } from "@ga/subject-math";

// Helpers shared by the Methods of Proof topics.

/** range lists the integers from a to b inclusive. */
export const range = (a: number, b: number) => Array.from({ length: Math.max(0, b - a + 1) }, (_, i) => a + i);

/** uniqueSorted removes duplicates and sorts numbers in increasing order. */
export const uniqueSorted = (xs: readonly number[]) => [...new Set(xs)].sort((a, b) => a - b);

/** setTex writes a finite set of numbers in LaTeX: "\{1, 3, 5\}", or "\varnothing" when it is empty. */
export const setTex = (xs: readonly number[]) => (xs.length === 0 ? "\\varnothing" : `\\{${uniqueSorted(xs).join(", ")}\\}`);

/** SET_HINT tells the learner how to type a finite set. */
export const SET_HINT = t(
  " Write the set as a list, such as $\\{1, 2, 3\\}$, or $\\varnothing$ if it is empty.",
  "用列举法写出集合，如 $\\{1, 2, 3\\}$；若为空集，写 $\\varnothing$。",
);

/** SetProblem describes a problem whose answer is a finite set of numbers. */
export interface SetProblem {
  readonly prompt: Text;
  readonly values: readonly number[];
  readonly solution: Text;
  /** wrong are the sets typical mistakes produce; sets equal to the answer are dropped. */
  readonly wrong?: readonly (readonly number[])[];
}

/** setProblem builds a problem whose answer is a finite set of numbers, typed as a list such as "\{2, 4, 6\}", checked by the "solutions" checker. */
export function setProblem(p: SetProblem): Problem {
  const expected = { var: "x", values: uniqueSorted(p.values).map(String) };
  return {
    prompt: t(`${p.prompt.en}${SET_HINT.en}`, `${p.prompt["zh-CN"]}${SET_HINT["zh-CN"]}`),
    answer: { checker: "solutions", expected, input: { kind: "math" } },
    solution: p.solution,
    canonical: setTex(p.values),
    wrong: [...new Set((p.wrong ?? []).map(setTex))].filter((w) => !solutionsChecker.check(expected, w).correct),
  };
}

/** Pred is a predicate about a number x, written in words and symbols. */
export interface Pred {
  /** text is the predicate in words, such as "$x$ is even". */
  readonly text: Text;
  /** negation is the negated predicate in words, such as "$x$ is odd". */
  readonly negation: Text;
  readonly holds: (n: number) => boolean;
}

/** isPrimeNumber tests primality of small integers. */
export const isPrimeNumber = (n: number) => {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
};

/** predicate picks a predicate about a positive integer x with thresholds suited to the domain 1..n. */
export function predicate(rng: Rng, n: number): Pred {
  const kind = rng.int(0, 5);
  if (kind === 0)
    return {
      text: t("$x$ is even", "$x$ 是偶数"),
      negation: t("$x$ is odd", "$x$ 是奇数"),
      holds: (x) => x % 2 === 0,
    };
  if (kind === 1)
    return {
      text: t("$x$ is odd", "$x$ 是奇数"),
      negation: t("$x$ is even", "$x$ 是偶数"),
      holds: (x) => x % 2 !== 0,
    };
  if (kind === 2) {
    const a = rng.int(2, n - 2);
    return { text: t(`$x > ${a}$`, `$x > ${a}$`), negation: t(`$x \\le ${a}$`, `$x \\le ${a}$`), holds: (x) => x > a };
  }
  if (kind === 3) {
    const a = rng.int(3, n - 1);
    return { text: t(`$x < ${a}$`, `$x < ${a}$`), negation: t(`$x \\ge ${a}$`, `$x \\ge ${a}$`), holds: (x) => x < a };
  }
  if (kind === 4)
    return {
      text: t("$x$ is prime", "$x$ 是质数"),
      negation: t("$x$ is not prime", "$x$ 不是质数"),
      holds: isPrimeNumber,
    };
  const k = rng.int(3, 4);
  return {
    text: t(`$x$ is a multiple of $${k}$`, `$x$ 是 $${k}$ 的倍数`),
    negation: t(`$x$ is not a multiple of $${k}$`, `$x$ 不是 $${k}$ 的倍数`),
    holds: (x) => x % k === 0,
  };
}

/** twoPredicates picks two predicates whose wording differs. */
export function twoPredicates(rng: Rng, n: number): [Pred, Pred] {
  for (;;) {
    const p = predicate(rng, n);
    const q = predicate(rng, n);
    if (p.text.en !== q.text.en && p.negation.en !== q.text.en) return [p, q];
  }
}

/** truthSet lists the elements of the domain where a predicate holds. */
export const truthSet = (domain: readonly number[], holds: (x: number) => boolean) => domain.filter(holds);

/** domainTex writes the domain 1..n as "\{1, 2, \dots, n\}". */
export const domainTex = (n: number) => `\\{1, 2, \\dots, ${n}\\}`;
