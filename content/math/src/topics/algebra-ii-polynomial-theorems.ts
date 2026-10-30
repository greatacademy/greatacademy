import type { Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { gcd, linear, num, poly, Q, radical, simplifyRadical } from "@ga/subject-math";

import {
  choiceProblem,
  expressionProblem,
  factoredProblem,
  numberProblem,
  pointProblem,
  solutionsProblem,
  steps,
  yesNo,
} from "../problems.ts";

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Coefs are the coefficients of a polynomial in x, from the highest power down to the constant term. */
type Coefs = readonly number[];

/** pw writes a power of x: "", "x" or "x^{3}". */
const pw = (e: number) => (e === 0 ? "" : e === 1 ? "x" : `x^{${e}}`);

/** P writes a polynomial from its coefficients, dropping zero terms. */
const P = (cs: Coefs) => poly(...cs.map((c, i): [number, string] => [c, pw(cs.length - 1 - i)]));

/** mulP multiplies polynomials. */
function mulP(...ps: readonly Coefs[]): number[] {
  return ps.reduce<number[]>(
    (a, b) => {
      const out = new Array<number>(a.length + b.length - 1).fill(0);
      a.forEach((x, i) => {
        b.forEach((y, j) => {
          out[i + j] = out[i + j]! + x * y;
        });
      });
      return out;
    },
    [1],
  );
}

/** addP adds two polynomials, aligned at the constant term. */
function addP(a: Coefs, b: Coefs): number[] {
  const n = Math.max(a.length, b.length);
  const at = (p: Coefs, i: number) => p[p.length - n + i] ?? 0;
  return Array.from({ length: n }, (_, i) => at(a, i) + at(b, i));
}

/** evalI evaluates a polynomial at an integer. */
const evalI = (cs: Coefs, x: number) => cs.reduce((acc, c) => acc * x + c, 0);

/** evalQ evaluates a polynomial at a rational number. */
const evalQ = (cs: Coefs, x: Q) => cs.reduce((acc, c) => acc.mul(x).add(Q.of(c)), Q.zero);

/** lf writes the factor (px + q). */
const lf = (p: number, q: number) => `(${linear(p, q)})`;

/** xm writes x − c. */
const xm = (c: number) => linear(1, -c);

/** front writes a constant factor before parentheses: "", "-" or "3". */
const front = (k: number) => (k === 1 ? "" : k === -1 ? "-" : String(k));

/** monoFront writes k·xᵉ as a factor before parentheses: "", "-", "3", "x" or "-2x^{2}". */
const monoFront = (k: number, e: number) => (e === 0 ? front(k) : poly([k, pw(e)]));

/** joinPoly appends a polynomial written in LaTeX to a sum: " + 3x - 1", " - 3x - 1", or nothing for "0". */
const joinPoly = (s: string) => (s === "0" ? "" : s.startsWith("-") ? ` - ${s.slice(1)}` : ` + ${s}`);

/** sqrtPair writes ±√n in simplest form, for n ≥ 1. */
function sqrtPair(n: number): [string, string] {
  const [k, m] = simplifyRadical(n);
  return [radical(k, m), radical(-k, m)];
}

/** isSquare tells whether n is the square of an integer. */
const isSquare = (n: number) => n >= 0 && Math.round(Math.sqrt(n)) ** 2 === n;

/** fracOf writes b/a in lowest terms. */
const fracOf = (b: number, a: number) => num(Q.of(b, a));

/** substitute writes a polynomial with a value in place of x: "2\left(3\right)^{2} - \left(3\right) + 4". */
function substitute(cs: Coefs, v: string): string {
  const n = cs.length - 1;
  let out = "";
  cs.forEach((c, i) => {
    if (c === 0) return;
    const k = n - i;
    const a = Math.abs(c);
    const body = k === 0 ? String(a) : `${a === 1 ? "" : a}\\left(${v}\\right)${k > 1 ? `^{${k}}` : ""}`;
    out += out === "" ? `${c < 0 ? "-" : ""}${body}` : ` ${c < 0 ? "-" : "+"} ${body}`;
  });
  return out === "" ? "0" : out;
}

/** Synthetic is the result of a synthetic division. */
interface Synthetic {
  readonly quotient: number[];
  readonly remainder: number;
  /** latex is the division as an array: c and the coefficients, the products, and the sums. */
  readonly latex: string;
}

/** synthetic divides a polynomial by x − c with synthetic division. */
function synthetic(cs: Coefs, c: number): Synthetic {
  const bottom: number[] = [];
  const middle: string[] = [];
  for (const a of cs) {
    const prev = bottom[bottom.length - 1];
    const m = prev === undefined ? 0 : prev * c + 0;
    middle.push(prev === undefined ? "" : String(m));
    bottom.push(a + m + 0);
  }
  const latex = `\\begin{array}{r|${"r".repeat(cs.length)}} ${c} & ${cs.join(" & ")} \\\\ & ${middle.join(" & ")} \\\\ \\hline & ${bottom.join(" & ")} \\end{array}`;
  return { quotient: bottom.slice(0, -1), remainder: bottom[bottom.length - 1]!, latex };
}

/** LongDivision is the result of a polynomial long division. */
interface LongDivision {
  readonly quotient: number[];
  readonly remainder: number[];
  /** latex is the division as an array with one column per power of x. */
  readonly latex: string;
}

/** term writes c·xᵖ as one cell of a long division: "x^{3}", "- 2x", "+ 0x^{2}". */
function term(c: number, p: number, first: boolean): string {
  const a = Math.abs(c);
  const body = a === 1 && p > 0 ? pw(p) : `${a}${pw(p)}`;
  if (first) return c < 0 ? `-${body}` : body;
  return `${c < 0 ? "-" : "+"} ${body}`;
}

/** longDivision divides by a divisor whose leading coefficient divides every step, as when the dividend is built from an integer quotient. */
function longDivision(dividend: Coefs, divisor: Coefs): LongDivision {
  const n = dividend.length - 1;
  const m = divisor.length - 1;
  const rem = [...dividend];
  const quotient: number[] = [];
  const row = (lead: string, entries: readonly (readonly [number, number])[], wrap = false) => {
    const cells = new Array<string>(n + 2).fill("");
    cells[0] = lead;
    entries.forEach(([p, c], i) => {
      let s = term(c, p, i === 0);
      if (wrap && i === 0) s = `-(${s}`;
      if (wrap && i === entries.length - 1) s = `${s})`;
      cells[1 + n - p] = s;
    });
    return cells.join(" & ");
  };
  const work: string[] = [];
  for (let k = n - m; k >= 0; k--) {
    const tq = rem[n - k - m]! / divisor[0]!;
    if (!Number.isInteger(tq)) throw new RangeError("the quotient has a non-integer coefficient");
    quotient.push(tq + 0);
    if (tq === 0) continue;
    const product = divisor.map((d, i): [number, number] => [k + m - i, tq * d]).filter(([, v]) => v !== 0);
    for (const [p, v] of product) rem[n - p] = rem[n - p]! - v;
    const left: [number, number][] = [];
    for (let p = k + m - 1; p >= 0; p--) left.push([p, rem[n - p]! + 0]);
    while (left.length > 1 && left[0]![1] === 0) left.shift();
    work.push(row("", product, true), `\\hline ${row("", left)}`);
  }
  const top = quotient.map((c, i): [number, number] => [n - m - i, c]).filter(([, c]) => c !== 0);
  const lines = [
    row("", top),
    `\\hline ${row(
      `${P(divisor)} \\,\\big)`,
      dividend.map((c, i): [number, number] => [n - i, c]),
    )}`,
    ...work,
  ];
  return {
    quotient,
    remainder: rem.slice(n - m + 1).map((v) => v + 0),
    latex: `\\begin{array}{${"r".repeat(n + 2)}} ${lines.join(" \\\\ ")} \\end{array}`,
  };
}

/** identity writes dividend = divisor · quotient + remainder. */
const identity = (dividend: Coefs, divisor: Coefs, quotient: Coefs, remainder: Coefs) =>
  `${P(dividend)} = (${P(divisor)})(${P(quotient)})${joinPoly(P(remainder))}`;

/** quotientPrompt asks for the quotient of a division by a method. */
function quotientPrompt(dividend: Coefs, divisor: Coefs, method: "synthetic" | "long", ask: "quotient" | "remainder" = "quotient"): Text {
  const how = method === "synthetic" ? t("synthetic division", "综合除法") : t("long division", "长除法");
  const what = ask === "quotient" ? t("quotient", "商") : t("remainder", "余数");
  return t(
    `Use ${how.en} to divide $${P(dividend)}$ by $${P(divisor)}$. What is the ${what.en}?`,
    `用${how["zh-CN"]}计算 $${P(dividend)}$ 除以 $${P(divisor)}$。${what["zh-CN"]}是多少？`,
  );
}

/** syntheticSolution explains a synthetic division by x − c. */
function syntheticSolution(dividend: Coefs, c: number, missing = false): Text {
  const s = synthetic(dividend, c);
  const plus = c < 0;
  const lead = t(
    `${plus ? `Dividing by $${xm(c)}$ means dividing by $x - (${c})$, so use $c = ${c}$. ` : `Use $c = ${c}$. `}${missing ? "Write $0$ for every missing power of $x$. " : ""}Bring down the first coefficient, then multiply by $${c}$ and add, column by column:`,
    `${plus ? `除以 $${xm(c)}$ 就是除以 $x - (${c})$，所以取 $c = ${c}$。` : `取 $c = ${c}$。`}${missing ? "缺少的 $x$ 的幂用 $0$ 补上。" : ""}把第一个系数移下来，然后逐列乘以 $${c}$ 再相加：`,
  );
  const ending = `${steps(s.latex)}`;
  const id = steps(identity(dividend, [1, -c], s.quotient, [s.remainder]));
  return t(
    `${lead.en}${ending}The last number is the remainder, $${s.remainder}$; the others are the coefficients of the quotient, $${P(s.quotient)}$. So${id}`,
    `${lead["zh-CN"]}${ending}最后一个数是余数 $${s.remainder}$，其余是商的系数，商为 $${P(s.quotient)}$。所以${id}`,
  );
}

/** longSolution explains a long division. */
function longSolution(dividend: Coefs, divisor: Coefs, missing = false): Text {
  const d = longDivision(dividend, divisor);
  const work = steps(d.latex);
  const id = steps(identity(dividend, divisor, d.quotient, d.remainder));
  const r = P(d.remainder);
  return t(
    `${missing ? "Write the missing powers of $x$ with coefficient $0$. " : ""}Divide the leading term by the leading term of $${P(divisor)}$, multiply, subtract, and repeat with what is left:${work}The quotient is $${P(d.quotient)}$ and the remainder is $${r}$:${id}`,
    `${missing ? "缺少的 $x$ 的幂用系数 $0$ 补上。" : ""}用首项除以 $${P(divisor)}$ 的首项，相乘，相减，再对剩下的部分重复：${work}商是 $${P(d.quotient)}$，余数是 $${r}$：${id}`,
  );
}

/** Examples shown in explanations. */
const exSynthetic = synthetic([1, -4, 1, 6], 2).latex;
const exSyntheticRemainder = synthetic([2, 3, -5, 4], -2).latex;
const exSyntheticMissing = synthetic([1, 0, -7, -6], -1).latex;
const exLong = longDivision([1, 1, -7, 2], [1, -2]).latex;
const exLongRemainder = longDivision([2, -3, 0, 4], [1, 1]).latex;
const exLongLeading = longDivision([6, 5, -5, 2], [2, 1]).latex;
const exLongQuadratic = longDivision([1, 3, 1, -1, -4], [1, 2, -1]).latex;
const exLongQuadraticRemainder = longDivision([2, 1, 3, 5], [1, 0, 2]).latex;
const exLongMissing = longDivision([1, 0, 0, 0, -16], [1, 0, 4]).latex;

// ─── 2.5.1 Dividing polynomials using synthetic division ────────────────────

/** dividingPolynomialsUsingSyntheticDivision divides by x − c with synthetic division. */
export const dividingPolynomialsUsingSyntheticDivision: TopicDef = {
  id: "dividing-polynomials-using-synthetic-division",
  title: t("Dividing Polynomials Using Synthetic Division", "用综合除法做多项式除法"),
  summary: t(
    "Divide a polynomial by $x - c$ using only its coefficients: bring down, multiply by $c$, add.",
    "只用系数把多项式除以 $x - c$：移下、乘以 $c$、相加。",
  ),
  prerequisites: ["splitting-rational-expressions-into-terms", "multiplying-polynomials"],
  encompasses: [
    { topic: "splitting-rational-expressions-into-terms", weight: 0.2 },
    { topic: "multiplying-polynomials", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.APR.D.6"],
  knowledgePoints: [
    {
      id: "dividing-without-a-remainder",
      title: t("Synthetic division", "综合除法"),
      explanation: t(
        `**Synthetic division** is a short way to divide a polynomial by $x - c$. Write $c$ in the box and the coefficients of the dividend in a row. Bring down the first coefficient; then repeatedly multiply the last number of the bottom row by $c$, write the product under the next coefficient, and add.\n\nTo divide $x^{3} - 4x^{2} + x + 6$ by $x - 2$, use $c = 2$:\n\n$$${exSynthetic}$$\n\nThe last number, $0$, is the remainder. The others are the coefficients of the quotient, whose degree is one less than that of the dividend:\n\n$$x^{3} - 4x^{2} + x + 6 = (x - 2)(x^{2} - 2x - 3)$$`,
        `**综合除法**是把多项式除以 $x - c$ 的简便方法。把 $c$ 写在框里，被除式的系数写成一行。先把第一个系数移下来，然后反复地：用底行最后一个数乘以 $c$，把积写在下一个系数下面，再相加。\n\n计算 $x^{3} - 4x^{2} + x + 6$ 除以 $x - 2$，取 $c = 2$：\n\n$$${exSynthetic}$$\n\n最后一个数 $0$ 是余数，其余的数是商的系数，商的次数比被除式低一次：\n\n$$x^{3} - 4x^{2} + x + 6 = (x - 2)(x^{2} - 2x - 3)$$`,
      ),
      keyPrerequisites: ["multiplying-polynomials"],
      generate(rng) {
        const c = rng.nonZero(-5, 5);
        const deg = rng.pick([2, 2, 3]);
        const q = [rng.bool(0.7) ? 1 : rng.int(2, 3), ...Array.from({ length: deg - 1 }, () => rng.int(-6, 6)), rng.nonZero(-6, 6)];
        const D = mulP(q, [1, -c]);
        return expressionProblem({
          prompt: quotientPrompt(D, [1, -c], "synthetic"),
          answer: P(q),
          simplified: true,
          wrong: [P(synthetic(D, -c).quotient), P([...q, 0]), P(D.slice(0, -1)), P(q.map((v, i) => (i === q.length - 1 ? -v : v)))],
          solution: syntheticSolution(D, c),
        });
      },
    },
    {
      id: "dividing-with-a-remainder",
      title: t("Quotient and remainder", "商和余数"),
      explanation: t(
        `When the last number of the bottom row is not $0$, it is the **remainder** $r$, and $p(x) = (x - c)q(x) + r$.\n\nTo divide by $x + 2$, write it as $x - (-2)$ and use $c = -2$. Dividing $2x^{3} + 3x^{2} - 5x + 4$ by $x + 2$:\n\n$$${exSyntheticRemainder}$$\n\nThe quotient is $2x^{2} - x - 3$ and the remainder is $10$:\n\n$$2x^{3} + 3x^{2} - 5x + 4 = (x + 2)(2x^{2} - x - 3) + 10$$`,
        `当底行最后一个数不是 $0$ 时，它就是**余数** $r$，并且 $p(x) = (x - c)q(x) + r$。\n\n除以 $x + 2$ 时，把它写成 $x - (-2)$，取 $c = -2$。计算 $2x^{3} + 3x^{2} - 5x + 4$ 除以 $x + 2$：\n\n$$${exSyntheticRemainder}$$\n\n商是 $2x^{2} - x - 3$，余数是 $10$：\n\n$$2x^{3} + 3x^{2} - 5x + 4 = (x + 2)(2x^{2} - x - 3) + 10$$`,
      ),
      generate(rng) {
        const c = rng.nonZero(-4, 4);
        const deg = rng.pick([2, 3]);
        const q = [rng.bool(0.6) ? 1 : rng.int(2, 3), ...Array.from({ length: deg }, () => rng.int(-6, 6))];
        const r = rng.nonZero(-9, 9);
        const D = addP(mulP(q, [1, -c]), [r]);
        const wrongDivision = synthetic(D, -c);
        if (rng.bool(0.5)) {
          return numberProblem({
            prompt: quotientPrompt(D, [1, -c], "synthetic", "remainder"),
            answer: r,
            wrong: [wrongDivision.remainder, -r, D[D.length - 1]!],
            solution: syntheticSolution(D, c),
          });
        }
        return expressionProblem({
          prompt: quotientPrompt(D, [1, -c], "synthetic"),
          answer: P(q),
          simplified: true,
          wrong: [P(wrongDivision.quotient), P([...q, r]), P(D.slice(0, -1))],
          solution: syntheticSolution(D, c),
        });
      },
    },
    {
      id: "missing-terms",
      title: t("Missing terms", "缺项"),
      explanation: t(
        `Every power of $x$ needs a column. When a power is missing from the dividend, write $0$ as its coefficient, or the columns shift and the answer is wrong.\n\nTo divide $x^{3} - 7x - 6$ by $x + 1$, write the coefficients as $1, 0, -7, -6$:\n\n$$${exSyntheticMissing}$$\n\nThe quotient is $x^{2} - x - 6$ and the remainder is $0$.`,
        `每个 $x$ 的幂都要占一列。被除式缺少某个幂时，要把它的系数写成 $0$，否则各列会错位，结果就错了。\n\n计算 $x^{3} - 7x - 6$ 除以 $x + 1$，把系数写成 $1, 0, -7, -6$：\n\n$$${exSyntheticMissing}$$\n\n商是 $x^{2} - x - 6$，余数是 $0$。`,
      ),
      generate(rng) {
        const deg = rng.pick([3, 4]);
        const patterns3: readonly (readonly boolean[])[] = [
          [true, false, true, true],
          [true, true, false, true],
          [true, false, false, true],
        ];
        const patterns4: readonly (readonly boolean[])[] = [
          [true, false, true, false, true],
          [true, false, false, true, true],
          [true, true, false, false, true],
          [true, false, true, true, true],
        ];
        const pattern = rng.pick(deg === 3 ? patterns3 : patterns4);
        const D = pattern.map((on, i) => (on ? (i === 0 ? rng.pick([1, 1, 2]) : rng.nonZero(-9, 9)) : 0));
        const c = rng.nonZero(-3, 3);
        const s = synthetic(D, c);
        const compressed = synthetic(
          D.filter((v) => v !== 0),
          c,
        );
        if (rng.bool(0.3)) {
          return numberProblem({
            prompt: quotientPrompt(D, [1, -c], "synthetic", "remainder"),
            answer: s.remainder,
            wrong: [compressed.remainder, synthetic(D, -c).remainder, -s.remainder],
            solution: syntheticSolution(D, c, true),
          });
        }
        return expressionProblem({
          prompt: quotientPrompt(D, [1, -c], "synthetic"),
          answer: P(s.quotient),
          simplified: true,
          wrong: [P(compressed.quotient), P(synthetic(D, -c).quotient), P(D.slice(0, -1))],
          solution: syntheticSolution(D, c, true),
        });
      },
    },
  ],
};

// ─── 2.5.2 Dividing polynomials by linear binomials using long division ─────

/** dividingPolynomialsByLinearBinomialsUsingLongDivision divides by ax + b with long division. */
export const dividingPolynomialsByLinearBinomialsUsingLongDivision: TopicDef = {
  id: "dividing-polynomials-by-linear-binomials-using-long-division",
  title: t("Dividing Polynomials by Linear Binomials Using Long Division", "用长除法把多项式除以一次二项式"),
  summary: t(
    "Divide a polynomial by $ax + b$ with long division: divide the leading terms, multiply, subtract, repeat.",
    "用长除法把多项式除以 $ax + b$：首项相除、相乘、相减、重复。",
  ),
  prerequisites: ["dividing-polynomials-using-synthetic-division"],
  encompasses: [
    { topic: "dividing-polynomials-using-synthetic-division", weight: 0.3 },
    { topic: "multiplying-polynomials", weight: 0.3 },
  ],
  xp: 16,
  standards: ["CCSS.HSA.APR.D.6"],
  knowledgePoints: [
    {
      id: "monic-divisor",
      title: t("Long division by x + b", "除以 x + b 的长除法"),
      explanation: t(
        `Polynomial **long division** works like long division of numbers. Divide the leading term of what is left by the leading term of the divisor, write the result in the quotient, multiply it by the divisor, and subtract. Repeat until what is left has a lower degree than the divisor.\n\nDividing $x^{3} + x^{2} - 7x + 2$ by $x - 2$:\n\n$$${exLong}$$\n\nFirst $x^{3} \\div x = x^{2}$, then $3x^{2} \\div x = 3x$, then $-x \\div x = -1$. The remainder is $0$, so the quotient is $x^{2} + 3x - 1$.`,
        `多项式**长除法**和数的长除法一样：用剩余部分的首项除以除式的首项，把结果写进商，再用它乘除式，然后相减。重复下去，直到剩余部分的次数低于除式。\n\n计算 $x^{3} + x^{2} - 7x + 2$ 除以 $x - 2$：\n\n$$${exLong}$$\n\n先算 $x^{3} \\div x = x^{2}$，再算 $3x^{2} \\div x = 3x$，最后 $-x \\div x = -1$。余数为 $0$，所以商是 $x^{2} + 3x - 1$。`,
      ),
      generate(rng) {
        const b = rng.nonZero(-6, 6);
        const q = [rng.bool(0.6) ? 1 : rng.int(2, 3), rng.int(-6, 6), rng.nonZero(-6, 6)];
        const D = mulP([1, b], q);
        return expressionProblem({
          prompt: quotientPrompt(D, [1, b], "long"),
          answer: P(q),
          simplified: true,
          wrong: [P(synthetic(D, b).quotient), P([q[0]!, -q[1]!, q[2]!]), P([q[0]!, q[1]!, -q[2]!]), P(D.slice(0, -1))],
          solution: longSolution(D, [1, b]),
        });
      },
    },
    {
      id: "with-a-remainder",
      title: t("A remainder", "有余数的情形"),
      explanation: t(
        `When the last subtraction leaves a nonzero constant, it is the remainder. Missing powers get a $0$ placeholder so that like terms stay in the same column.\n\nDividing $2x^{3} - 3x^{2} + 4$ by $x + 1$:\n\n$$${exLongRemainder}$$\n\nThe quotient is $2x^{2} - 5x + 5$ and the last line gives the remainder $-1$:\n\n$$2x^{3} - 3x^{2} + 4 = (x + 1)(2x^{2} - 5x + 5) - 1$$`,
        `最后一次相减剩下的非零常数就是余数。缺少的幂用 $0$ 占位，使同类项对齐在同一列。\n\n计算 $2x^{3} - 3x^{2} + 4$ 除以 $x + 1$：\n\n$$${exLongRemainder}$$\n\n商是 $2x^{2} - 5x + 5$，最后一行给出余数 $-1$：\n\n$$2x^{3} - 3x^{2} + 4 = (x + 1)(2x^{2} - 5x + 5) - 1$$`,
      ),
      generate(rng) {
        const b = rng.nonZero(-5, 5);
        const deg = rng.pick([2, 3]);
        const q = [rng.bool(0.6) ? 1 : rng.int(2, 3), ...Array.from({ length: deg }, () => rng.int(-5, 5))];
        const r = rng.nonZero(-9, 9);
        const D = addP(mulP([1, b], q), [r]);
        if (rng.bool(0.5)) {
          return numberProblem({
            prompt: quotientPrompt(D, [1, b], "long", "remainder"),
            answer: r,
            wrong: [evalI(D, b), -r, D[D.length - 1]!],
            solution: longSolution(D, [1, b]),
          });
        }
        return expressionProblem({
          prompt: quotientPrompt(D, [1, b], "long"),
          answer: P(q),
          simplified: true,
          wrong: [P(synthetic(D, b).quotient), P([...q.slice(0, -1), q[q.length - 1]! + r]), P(D.slice(0, -1))],
          solution: longSolution(D, [1, b]),
        });
      },
    },
    {
      id: "leading-coefficient",
      title: t("A divisor with a leading coefficient", "除式的首项系数不为 1"),
      explanation: t(
        `Long division also works for a divisor such as $2x + 1$, where synthetic division does not apply directly. Divide each leading term by $2x$:\n\n$$${exLongLeading}$$\n\n$6x^{3} \\div 2x = 3x^{2}$, $2x^{2} \\div 2x = x$, $-6x \\div 2x = -3$. The quotient is $3x^{2} + x - 3$ and the remainder is $5$.`,
        `对 $2x + 1$ 这样的除式，综合除法不能直接使用，长除法仍然适用。每一步都用首项除以 $2x$：\n\n$$${exLongLeading}$$\n\n$6x^{3} \\div 2x = 3x^{2}$，$2x^{2} \\div 2x = x$，$-6x \\div 2x = -3$。商是 $3x^{2} + x - 3$，余数是 $5$。`,
      ),
      generate(rng) {
        let a: number;
        let b: number;
        do {
          a = rng.int(2, 4);
          b = rng.nonZero(-7, 7);
        } while (gcd(a, b) !== 1);
        const q = [rng.int(1, 4), rng.int(-5, 5), rng.nonZero(-6, 6)];
        const r = rng.bool(0.4) ? rng.nonZero(-6, 6) : 0;
        const D = addP(mulP([a, b], q), [r]);
        return expressionProblem({
          prompt: quotientPrompt(D, [a, b], "long"),
          answer: P(q),
          simplified: true,
          wrong: [P(q.map((v) => v * a)), P(synthetic(D, -b).quotient), P([q[0]!, -q[1]!, q[2]!])],
          solution: longSolution(D, [a, b]),
        });
      },
    },
  ],
};

// ─── 2.5.3 Dividing polynomials using long division ─────────────────────────

/** dividingPolynomialsUsingLongDivision divides by quadratic divisors with long division. */
export const dividingPolynomialsUsingLongDivision: TopicDef = {
  id: "dividing-polynomials-using-long-division",
  title: t("Dividing Polynomials Using Long Division", "用长除法做多项式除法"),
  summary: t(
    "Divide polynomials by quadratics with long division, finding quotients and remainders of lower degree.",
    "用长除法把多项式除以二次式，求出商和次数更低的余式。",
  ),
  prerequisites: ["dividing-polynomials-by-linear-binomials-using-long-division"],
  encompasses: [
    { topic: "dividing-polynomials-by-linear-binomials-using-long-division", weight: 0.6 },
    { topic: "multiplying-polynomials", weight: 0.3 },
  ],
  xp: 17,
  standards: ["CCSS.HSA.APR.D.6"],
  knowledgePoints: [
    {
      id: "by-a-quadratic",
      title: t("Dividing by a quadratic", "除以二次式"),
      explanation: t(
        `Dividing by a quadratic follows the same steps; each product now has three terms. Dividing $x^{4} + 3x^{3} + x^{2} - x - 4$ by $x^{2} + 2x - 1$:\n\n$$${exLongQuadratic}$$\n\nStop when what is left has degree less than $2$. The quotient is $x^{2} + x$ and the remainder is $-4$.`,
        `除以二次式的步骤相同，只是每次的乘积有三项。计算 $x^{4} + 3x^{3} + x^{2} - x - 4$ 除以 $x^{2} + 2x - 1$：\n\n$$${exLongQuadratic}$$\n\n当剩余部分的次数低于 $2$ 时停止。商是 $x^{2} + x$，余数是 $-4$。`,
      ),
      generate(rng) {
        const div = [1, rng.int(-4, 4), rng.nonZero(-5, 5)];
        const q = rng.bool(0.5) ? [rng.int(1, 3), rng.nonZero(-6, 6)] : [1, rng.int(-5, 5), rng.nonZero(-5, 5)];
        const D = mulP(div, q);
        return expressionProblem({
          prompt: quotientPrompt(D, div, "long"),
          answer: P(q),
          simplified: true,
          wrong: [P(q.map((v, i) => (i === 0 ? v : -v))), P(q.map((v, i) => (i === q.length - 1 ? -v : v))), P(D.slice(0, -2))],
          solution: longSolution(D, div),
        });
      },
    },
    {
      id: "a-linear-remainder",
      title: t("A remainder of degree one", "一次的余式"),
      explanation: t(
        `When the divisor is quadratic, the remainder can be linear: the division stops as soon as what is left has degree less than $2$. Dividing $2x^{3} + x^{2} + 3x + 5$ by $x^{2} + 2$:\n\n$$${exLongQuadraticRemainder}$$\n\nThe quotient is $2x + 1$ and the remainder is $-x + 3$:\n\n$$2x^{3} + x^{2} + 3x + 5 = (x^{2} + 2)(2x + 1) - x + 3$$`,
        `除式是二次式时，余式可以是一次式：剩余部分的次数一旦低于 $2$，除法就停止。计算 $2x^{3} + x^{2} + 3x + 5$ 除以 $x^{2} + 2$：\n\n$$${exLongQuadraticRemainder}$$\n\n商是 $2x + 1$，余式是 $-x + 3$：\n\n$$2x^{3} + x^{2} + 3x + 5 = (x^{2} + 2)(2x + 1) - x + 3$$`,
      ),
      generate(rng) {
        const div = [1, rng.int(-3, 3), rng.nonZero(-5, 5)];
        const q = [rng.int(1, 3), rng.int(-5, 5)];
        let R: number[];
        do R = [rng.int(-6, 6), rng.int(-9, 9)];
        while (R[0] === 0 && R[1] === 0);
        const D = addP(mulP(div, q), R);
        if (rng.bool(0.6)) {
          return expressionProblem({
            prompt: quotientPrompt(D, div, "long", "remainder"),
            answer: P(R),
            simplified: true,
            wrong: [P(R.map((v) => -v)), P([R[0]!, -R[1]!]), P([R[1]!]), P([...R, 0])],
            solution: longSolution(D, div),
          });
        }
        return expressionProblem({
          prompt: quotientPrompt(D, div, "long"),
          answer: P(q),
          simplified: true,
          wrong: [P([q[0]!, -q[1]!]), P([...q, 0]), P(D.slice(0, -2))],
          solution: longSolution(D, div),
        });
      },
    },
    {
      id: "missing-terms",
      title: t("Missing terms", "缺项"),
      explanation: t(
        `Write every missing power with coefficient $0$, in the dividend and in the divisor, so that the columns line up. Dividing $x^{4} - 16$ by $x^{2} + 4$:\n\n$$${exLongMissing}$$\n\nThe quotient is $x^{2} - 4$ and the remainder is $0$.`,
        `被除式和除式中缺少的幂都要写成系数为 $0$ 的项，使各列对齐。计算 $x^{4} - 16$ 除以 $x^{2} + 4$：\n\n$$${exLongMissing}$$\n\n商是 $x^{2} - 4$，余数是 $0$。`,
      ),
      generate(rng) {
        const patterns: readonly (readonly boolean[])[] = [
          [true, false, true, false, true],
          [true, false, false, false, true],
          [true, false, false, true, true],
          [true, true, false, false, true],
          [true, false, true, true],
          [true, false, false, true],
        ];
        const pattern = rng.pick(patterns);
        const D = pattern.map((on, i) => (on ? (i === 0 ? 1 : rng.nonZero(-9, 9)) : 0));
        const div = rng.bool(0.6) ? [1, 0, rng.nonZero(-5, 5)] : [1, rng.nonZero(-3, 3), rng.nonZero(-4, 4)];
        const d = longDivision(D, div);
        const nz = D.filter((v) => v !== 0);
        const compressed = longDivision(nz, div);
        if (rng.bool(0.3)) {
          return expressionProblem({
            prompt: quotientPrompt(D, div, "long", "remainder"),
            answer: P(d.remainder),
            simplified: true,
            wrong: [P(compressed.remainder), P(d.remainder.map((v) => -v))],
            solution: longSolution(D, div, true),
          });
        }
        return expressionProblem({
          prompt: quotientPrompt(D, div, "long"),
          answer: P(d.quotient),
          simplified: true,
          wrong: [P(compressed.quotient), P(d.quotient.map((v, i) => (i === 0 ? v : -v))), P(D.slice(0, -2))],
          solution: longSolution(D, div, true),
        });
      },
    },
  ],
};

// ─── 2.5.4 Dividing polynomials by manipulating rational expressions ────────

/** Rewriting is a numerator rewritten as multiples of a monic divisor plus a remainder. */
interface Rewriting {
  readonly quotient: number[];
  readonly remainder: number[];
  /** lines are the successive forms of the numerator. */
  readonly lines: string[];
}

/** rewrite takes multiples of a monic divisor out of a numerator, one power at a time. */
function rewrite(N: Coefs, div: Coefs): Rewriting {
  const n = N.length - 1;
  const m = div.length - 1;
  const rem = [...N];
  const quotient: number[] = [];
  let parts = "";
  const lines: string[] = [];
  for (let k = n - m; k >= 0; k--) {
    const c = rem[n - k - m]!;
    quotient.push(c + 0);
    if (c === 0) continue;
    div.forEach((d, i) => {
      rem[n - k - m + i] = rem[n - k - m + i]! - c * d;
    });
    const part = `${monoFront(parts === "" ? c : Math.abs(c), k)}(${P(div)})`;
    parts += parts === "" ? part : ` ${c < 0 ? "-" : "+"} ${part}`;
    lines.push(`${parts}${joinPoly(P(rem))}`);
  }
  return { quotient, remainder: rem.slice(n - m + 1).map((v) => v + 0), lines };
}

/** rewriteSolution explains the division of N by a monic divisor by rewriting the numerator. */
function rewriteSolution(N: Coefs, div: Coefs): Text {
  const w = rewrite(N, div);
  const R = P(w.remainder);
  const tail =
    R === "0"
      ? ""
      : R.startsWith("-") && w.remainder.slice(0, -1).every((v) => v === 0)
        ? ` - \\frac{${R.slice(1)}}{${P(div)}}`
        : ` + \\frac{${R}}{${P(div)}}`;
  const work = steps(
    `${P(N)} = ${w.lines[0]}`,
    ...w.lines.slice(1).map((l) => `= ${l}`),
    `= (${P(div)})(${P(w.quotient)})${joinPoly(R)}`,
    `\\frac{${P(N)}}{${P(div)}} = ${P(w.quotient)}${tail}`,
  );
  return t(
    `Rewrite the numerator using multiples of $${P(div)}$, starting with the highest power, until what is left has a lower degree than $${P(div)}$. Then split the fraction:${work}`,
    `从最高次幂开始，把分子改写成 $${P(div)}$ 的倍数，直到剩下部分的次数低于 $${P(div)}$。然后拆开分式：${work}`,
  );
}

/** dividingPolynomialsByManipulatingRationalExpressions divides by rewriting the numerator in terms of the denominator. */
export const dividingPolynomialsByManipulatingRationalExpressions: TopicDef = {
  id: "dividing-polynomials-by-manipulating-rational-expressions",
  title: t("Dividing Polynomials by Manipulating Rational Expressions", "通过变形分式做多项式除法"),
  summary: t(
    "Rewrite the numerator as multiples of the denominator plus a remainder, then split the fraction: $\\frac{x^{2} + 5x + 7}{x + 2} = x + 3 + \\frac{1}{x + 2}$.",
    "把分子改写成分母的倍数加余式，再拆开分式：$\\frac{x^{2} + 5x + 7}{x + 2} = x + 3 + \\frac{1}{x + 2}$。",
  ),
  prerequisites: ["dividing-polynomials-by-linear-binomials-using-long-division"],
  encompasses: [
    { topic: "splitting-rational-expressions-into-terms", weight: 0.5 },
    { topic: "dividing-polynomials-by-linear-binomials-using-long-division", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.APR.D.6"],
  knowledgePoints: [
    {
      id: "quadratic-over-a-binomial",
      title: t("A quadratic over a binomial", "二次式除以二项式"),
      explanation: t(
        "Write the numerator as a multiple of the denominator plus what is left, one power at a time:\n\n$$x^{2} + 5x + 7 = x(x + 2) + 3x + 7 = x(x + 2) + 3(x + 2) + 1$$\n\nHere $x(x + 2) = x^{2} + 2x$ leaves $3x + 7$, and $3(x + 2) = 3x + 6$ leaves $1$. Splitting the fraction:\n\n$$\\frac{x^{2} + 5x + 7}{x + 2} = \\frac{(x + 3)(x + 2) + 1}{x + 2} = x + 3 + \\frac{1}{x + 2}$$",
        "逐个幂次地把分子写成分母的倍数加上剩下的部分：\n\n$$x^{2} + 5x + 7 = x(x + 2) + 3x + 7 = x(x + 2) + 3(x + 2) + 1$$\n\n这里 $x(x + 2) = x^{2} + 2x$，剩下 $3x + 7$；$3(x + 2) = 3x + 6$，剩下 $1$。拆开分式：\n\n$$\\frac{x^{2} + 5x + 7}{x + 2} = \\frac{(x + 3)(x + 2) + 1}{x + 2} = x + 3 + \\frac{1}{x + 2}$$",
      ),
      keyPrerequisites: ["splitting-rational-expressions-into-terms"],
      generate(rng) {
        const a = rng.pick([1, 1, 2, 3]);
        const h = rng.nonZero(-6, 6);
        const b = rng.int(-6, 6);
        const r = rng.nonZero(-9, 9);
        const N = [a, a * h + b, b * h + r];
        const den = linear(1, h);
        const target = rng.pick(["b", "r", "r"] as const);
        const bWrong = N[1]! + a * h;
        return numberProblem({
          prompt: t(
            `Write $\\frac{${P(N)}}{${den}}$ in the form $ax + b + \\frac{r}{${den}}$. Find $${target}$.`,
            `把 $\\frac{${P(N)}}{${den}}$ 写成 $ax + b + \\frac{r}{${den}}$ 的形式。求 $${target}$。`,
          ),
          answer: target === "b" ? b : r,
          solveFor: target,
          wrong: target === "b" ? [bWrong, N[1]!, -b] : [N[2]!, N[2]! + b * h, -r, N[2]! - bWrong * h],
          solution: rewriteSolution(N, [1, h]),
        });
      },
    },
    {
      id: "cubic-over-a-binomial",
      title: t("A cubic over a binomial", "三次式除以二项式"),
      explanation: t(
        "For a cubic numerator, take out multiples of the denominator three times, starting with the highest power:\n\n$$x^{3} - 2x^{2} + 4 = x^{2}(x - 1) - x^{2} + 4 = x^{2}(x - 1) - x(x - 1) - x + 4$$\n\n$$= x^{2}(x - 1) - x(x - 1) - (x - 1) + 3 = (x - 1)(x^{2} - x - 1) + 3$$\n\nSo $\\frac{x^{3} - 2x^{2} + 4}{x - 1} = x^{2} - x - 1 + \\frac{3}{x - 1}$: the quotient is $q(x) = x^{2} - x - 1$ and the remainder is $3$.",
        "分子是三次式时，从最高次幂开始，分三次提出分母的倍数：\n\n$$x^{3} - 2x^{2} + 4 = x^{2}(x - 1) - x^{2} + 4 = x^{2}(x - 1) - x(x - 1) - x + 4$$\n\n$$= x^{2}(x - 1) - x(x - 1) - (x - 1) + 3 = (x - 1)(x^{2} - x - 1) + 3$$\n\n所以 $\\frac{x^{3} - 2x^{2} + 4}{x - 1} = x^{2} - x - 1 + \\frac{3}{x - 1}$：商 $q(x) = x^{2} - x - 1$，余数为 $3$。",
      ),
      generate(rng) {
        const h = rng.nonZero(-4, 4);
        const q = [rng.int(1, 3), rng.int(-5, 5), rng.int(-5, 5)];
        const r = rng.nonZero(-9, 9);
        const N = addP(mulP(q, [1, -h]), [r]);
        const den = xm(h);
        return expressionProblem({
          prompt: t(
            `Write $\\frac{${P(N)}}{${den}}$ in the form $q(x) + \\frac{r}{${den}}$, where $q(x)$ is a polynomial and $r$ is a number. Find $q(x)$.`,
            `把 $\\frac{${P(N)}}{${den}}$ 写成 $q(x) + \\frac{r}{${den}}$ 的形式，其中 $q(x)$ 是多项式，$r$ 是数。求 $q(x)$。`,
          ),
          answer: P(q),
          simplified: true,
          prefix: "q(x) =",
          wrong: [P(synthetic(N, -h).quotient), P([...q, r]), P(N.slice(0, -1)), P(q.map((v, i) => (i === q.length - 1 ? -v : v)))],
          solution: rewriteSolution(N, [1, -h]),
        });
      },
    },
    {
      id: "over-a-quadratic",
      title: t("A quadratic denominator", "分母是二次式"),
      explanation: t(
        "With a quadratic denominator, the part left over can be linear. To divide $2x^{3} + x^{2} + 3x + 5$ by $x^{2} + 2$:\n\n$$2x^{3} + x^{2} + 3x + 5 = 2x(x^{2} + 2) + x^{2} - x + 5 = 2x(x^{2} + 2) + (x^{2} + 2) - x + 3$$\n\nSo\n\n$$\\frac{2x^{3} + x^{2} + 3x + 5}{x^{2} + 2} = 2x + 1 + \\frac{-x + 3}{x^{2} + 2}$$\n\nThe numerator of the remaining fraction, $R(x) = -x + 3$, has a lower degree than the denominator.",
        "分母是二次式时，剩下的部分可以是一次式。计算 $2x^{3} + x^{2} + 3x + 5$ 除以 $x^{2} + 2$：\n\n$$2x^{3} + x^{2} + 3x + 5 = 2x(x^{2} + 2) + x^{2} - x + 5 = 2x(x^{2} + 2) + (x^{2} + 2) - x + 3$$\n\n所以\n\n$$\\frac{2x^{3} + x^{2} + 3x + 5}{x^{2} + 2} = 2x + 1 + \\frac{-x + 3}{x^{2} + 2}$$\n\n剩下分式的分子 $R(x) = -x + 3$ 的次数低于分母。",
      ),
      generate(rng) {
        const div = rng.bool(0.6) ? [1, 0, rng.nonZero(-5, 5)] : [1, rng.nonZero(-3, 3), rng.nonZero(-5, 5)];
        const q = [rng.int(1, 3), rng.int(-5, 5)];
        let R: number[];
        do R = [rng.int(-5, 5), rng.int(-9, 9)];
        while (R[0] === 0 || (R[1] === 0 && rng.bool(0.5)));
        const N = addP(mulP(div, q), R);
        return expressionProblem({
          prompt: t(
            `Write $\\frac{${P(N)}}{${P(div)}}$ in the form $q(x) + \\frac{R(x)}{${P(div)}}$, where $q(x)$ and $R(x)$ are polynomials and $R(x)$ has degree less than $2$. Find $R(x)$.`,
            `把 $\\frac{${P(N)}}{${P(div)}}$ 写成 $q(x) + \\frac{R(x)}{${P(div)}}$ 的形式，其中 $q(x)$、$R(x)$ 是多项式，且 $R(x)$ 的次数小于 $2$。求 $R(x)$。`,
          ),
          answer: P(R),
          simplified: true,
          prefix: "R(x) =",
          wrong: [P(R.map((v) => -v)), P([R[0]!, -R[1]!]), P([R[1]!]), P([R[0]!, 0])],
          solution: rewriteSolution(N, div),
        });
      },
    },
  ],
};

// ─── 2.6.1 Determining the roots of polynomials ─────────────────────────────

/** rootsPrompt asks for the roots of a polynomial. */
const rootsPrompt = (p: string, real = false): Text =>
  real
    ? t(`Find all the real roots of $p(x) = ${p}$.`, `求 $p(x) = ${p}$ 的所有实数根。`)
    : t(`Find all the roots of $p(x) = ${p}$.`, `求 $p(x) = ${p}$ 的所有根。`);

/** linearRoot writes the step "px + q = 0 gives x = …". */
const linearRoot = (p: number, q: number) => `${linear(p, q)} = 0 \\implies x = ${fracOf(-q, p)}`;

/** determiningTheRootsOfPolynomials finds the roots of factored polynomials. */
export const determiningTheRootsOfPolynomials: TopicDef = {
  id: "determining-the-roots-of-polynomials",
  title: t("Determining the Roots of Polynomials", "求多项式的根"),
  summary: t(
    "Find the roots of a polynomial in factored form by setting each factor equal to zero.",
    "令因式分解形式中的每个因式等于零，求多项式的根。",
  ),
  prerequisites: ["roots-of-a-function", "solving-quadratic-equations-using-a-difference-of-squares"],
  encompasses: [
    { topic: "zero-product-rule", weight: 0.6 },
    { topic: "roots-of-a-function", weight: 0.3 },
    { topic: "solving-quadratic-equations-using-a-difference-of-squares", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSA.APR.B.3"],
  knowledgePoints: [
    {
      id: "linear-factors",
      title: t("Monic linear factors", "首项系数为 1 的一次因式"),
      explanation: t(
        "A **root** of a polynomial $p(x)$ is a value of $x$ with $p(x) = 0$. When $p(x)$ is a product, it is zero exactly when one of its factors is zero, so each factor gives a root:\n\n$$p(x) = 2x(x - 3)(x + 5) = 0 \\implies x = 0, \\; x = 3, \\; x = -5$$\n\nThe factor $x - 3$ gives the root $3$, not $-3$. A constant factor such as $2$ is never zero and gives no root.",
        "多项式 $p(x)$ 的**根**是使 $p(x) = 0$ 的 $x$ 的值。$p(x)$ 是乘积时，它为零当且仅当某个因式为零，所以每个因式给出一个根：\n\n$$p(x) = 2x(x - 3)(x + 5) = 0 \\implies x = 0, \\; x = 3, \\; x = -5$$\n\n因式 $x - 3$ 给出的根是 $3$，不是 $-3$。$2$ 这样的常数因数永远不为零，不给出根。",
      ),
      keyPrerequisites: ["zero-product-rule"],
      generate(rng) {
        let roots: number[];
        do roots = [rng.int(-7, 7), rng.nonZero(-7, 7), rng.nonZero(-7, 7)];
        while (new Set(roots).size < 3);
        const k = rng.pick([1, 1, 2, 3, -1, -2]);
        const factors = roots.map((r) => (r === 0 ? "x" : lf(1, -r)));
        const expr = `${front(k)}${factors.join("")}`;
        const values = roots.map(String);
        return solutionsProblem({
          prompt: rootsPrompt(expr),
          values,
          wrong: [roots.map((r) => String(-r)), roots.filter((r) => r !== 0).map(String), [...values, String(k)]],
          solution: t(
            `Set each factor equal to zero:${steps(roots.map((r) => (r === 0 ? "x = 0" : linearRoot(1, -r))).join(", \\quad "))}${k === 1 ? "" : `The constant factor $${k}$ is never zero. `}The roots are $${values.join(", ")}$.`,
            `令每个因式等于零：${steps(roots.map((r) => (r === 0 ? "x = 0" : linearRoot(1, -r))).join(", \\quad "))}${k === 1 ? "" : `常数因数 $${k}$ 永不为零。`}根是 $${values.join(", ")}$。`,
          ),
        });
      },
    },
    {
      id: "factors-with-coefficients",
      title: t("Factors with leading coefficients", "带首项系数的因式"),
      explanation: t(
        "A factor $ax - b$ gives the root $x = \\frac{b}{a}$: solve $ax - b = 0$ rather than reading the number off the factor.\n\n$$p(x) = (2x - 3)(3x + 1)(x - 4)$$\n\n$$2x - 3 = 0 \\implies x = \\frac{3}{2}, \\quad 3x + 1 = 0 \\implies x = -\\frac{1}{3}, \\quad x - 4 = 0 \\implies x = 4$$",
        "因式 $ax - b$ 给出的根是 $x = \\frac{b}{a}$：要解方程 $ax - b = 0$，而不是直接读出因式中的数。\n\n$$p(x) = (2x - 3)(3x + 1)(x - 4)$$\n\n$$2x - 3 = 0 \\implies x = \\frac{3}{2}, \\quad 3x + 1 = 0 \\implies x = -\\frac{1}{3}, \\quad x - 4 = 0 \\implies x = 4$$",
      ),
      generate(rng) {
        for (;;) {
          const fs = Array.from({ length: 3 }, (_, i) => {
            let a: number;
            let b: number;
            do {
              a = i === 0 ? rng.int(2, 5) : rng.pick([1, 1, 2, 3, 4, 5]);
              b = rng.nonZero(-7, 7);
            } while (gcd(a, b) !== 1);
            return [a, b] as const;
          });
          const roots = fs.map(([a, b]) => Q.of(b, a));
          if (roots.some((r, i) => roots.findIndex((o) => o.eq(r)) !== i)) continue;
          const shuffled = rng.shuffle(fs);
          const expr = shuffled.map(([a, b]) => lf(a, -b)).join("");
          const values = shuffled.map(([a, b]) => fracOf(b, a));
          return solutionsProblem({
            prompt: rootsPrompt(expr),
            values,
            wrong: [shuffled.map(([, b]) => String(b)), shuffled.map(([a, b]) => fracOf(-b, a)), shuffled.map(([a, b]) => fracOf(a, b))],
            solution: t(
              `Set each factor equal to zero and solve:${steps(shuffled.map(([a, b]) => linearRoot(a, -b)).join(", \\quad "))}The roots are $${values.join(", ")}$.`,
              `令每个因式等于零并求解：${steps(shuffled.map(([a, b]) => linearRoot(a, -b)).join(", \\quad "))}根是 $${values.join(", ")}$。`,
            ),
          });
        }
      },
    },
    {
      id: "quadratic-factors",
      title: t("Quadratic factors", "二次因式"),
      explanation: t(
        "A factor $x^{2} - n$ with $n > 0$ gives two roots, $x = \\pm\\sqrt{n}$. A factor $x^{2} + n$ with $n > 0$ gives **no** real root, because $x^{2} + n \\ge n > 0$.\n\n$$p(x) = (x + 1)(x^{2} - 9)(x^{2} + 4)$$\n\n$x + 1 = 0$ gives $x = -1$; $x^{2} = 9$ gives $x = \\pm 3$; $x^{2} = -4$ has no real solution. The real roots are $-1, 3, -3$.",
        "因式 $x^{2} - n$（$n > 0$）给出两个根 $x = \\pm\\sqrt{n}$。因式 $x^{2} + n$（$n > 0$）**没有**实数根，因为 $x^{2} + n \\ge n > 0$。\n\n$$p(x) = (x + 1)(x^{2} - 9)(x^{2} + 4)$$\n\n$x + 1 = 0$ 得 $x = -1$；$x^{2} = 9$ 得 $x = \\pm 3$；$x^{2} = -4$ 没有实数解。实数根是 $-1, 3, -3$。",
      ),
      keyPrerequisites: ["solving-quadratic-equations-using-a-difference-of-squares"],
      generate(rng) {
        const r = rng.nonZero(-6, 6);
        const kind = rng.pick(["square", "square", "irrational", "none"] as const);
        let n: number;
        do
          n =
            kind === "square"
              ? rng.int(1, 9) ** 2
              : kind === "irrational"
                ? rng.pick([2, 3, 5, 6, 7, 8, 10, 11, 12, 18, 20])
                : rng.int(1, 12);
        while (kind === "square" && n === r * r);
        const quad = `(${P([1, 0, kind === "none" ? n : -n])})`;
        const lin = lf(1, -r);
        const expr = rng.bool(0.5) ? `${lin}${quad}` : `${quad}${lin}`;
        const pair = sqrtPair(n);
        const values = kind === "none" ? [String(r)] : [String(r), ...pair];
        const wrong: string[][] =
          kind === "none"
            ? [[String(r), ...pair], [String(-r)], [String(r), String(-n)]]
            : [
                [String(r), pair[0]],
                [String(r), String(n), String(-n)],
                [String(-r), ...pair],
              ];
        const quadStep =
          kind === "none"
            ? t(`$x^{2} = ${-n}$ has no real solution, since a square is never negative`, `$x^{2} = ${-n}$ 没有实数解，因为平方不会是负数`)
            : t(`$x^{2} = ${n}$ gives $x = \\pm ${pair[0]}$`, `$x^{2} = ${n}$ 得 $x = \\pm ${pair[0]}$`);
        return solutionsProblem({
          prompt: rootsPrompt(expr, true),
          values,
          wrong,
          solution: t(
            `Set each factor equal to zero. $${xm(r)} = 0$ gives $x = ${r}$, and ${quadStep.en}. The real roots are $${values.join(", ")}$.`,
            `令每个因式等于零。$${xm(r)} = 0$ 得 $x = ${r}$；${quadStep["zh-CN"]}。实数根是 $${values.join(", ")}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 2.6.2 Solving polynomial equations using the GCF ───────────────────────

/** solvePrompt asks to solve an equation. */
const solvePrompt = (eq: string, real = false): Text =>
  real ? t(`Find all real solutions of $${eq}$.`, `求方程 $${eq}$ 的所有实数解。`) : t(`Solve $${eq}$.`, `解方程 $${eq}$。`);

/** solvingPolynomialEquationsUsingTheGcf solves polynomial equations by factoring out the greatest common factor. */
export const solvingPolynomialEquationsUsingTheGcf: TopicDef = {
  id: "solving-polynomial-equations-using-the-gcf",
  title: t("Solving Polynomial Equations Using the GCF", "提取公因式解多项式方程"),
  summary: t(
    "Solve equations such as $2x^{3} - 6x^{2} - 20x = 0$ by factoring out the greatest common factor, keeping the root $x = 0$.",
    "提取最大公因式，解 $2x^{3} - 6x^{2} - 20x = 0$ 这类方程，不丢掉根 $x = 0$。",
  ),
  prerequisites: [
    "determining-the-roots-of-polynomials",
    "solving-quadratic-equations-with-no-constant-term",
    "further-factoring-of-polynomials-using-gcfs",
    "solving-quadratic-equations-with-leading-coefficients-by-factoring",
  ],
  encompasses: [
    { topic: "determining-the-roots-of-polynomials", weight: 0.5 },
    { topic: "solving-quadratic-equations-with-no-constant-term", weight: 0.5 },
    { topic: "solving-quadratic-equations-by-factoring", weight: 0.5 },
    { topic: "factoring-polynomials-using-gcfs", weight: 0.4 },
  ],
  xp: 14,
  standards: ["CCSS.HSA.APR.B.3", "CCSS.HSA.SSE.A.2"],
  knowledgePoints: [
    {
      id: "gcf-then-trinomial",
      title: t("Taking out the GCF", "提取最大公因式"),
      explanation: t(
        "Take out the greatest common factor, power of $x$ included, then factor what is left:\n\n$$2x^{3} - 6x^{2} - 20x = 0$$\n\n$$2x(x^{2} - 3x - 10) = 0$$\n\n$$2x(x - 5)(x + 2) = 0$$\n\nThe factor $x$ gives the solution $x = 0$; do not lose it. The solutions are $x = 0, 5, -2$.",
        "提取最大公因式（包括 $x$ 的幂），再分解剩下的部分：\n\n$$2x^{3} - 6x^{2} - 20x = 0$$\n\n$$2x(x^{2} - 3x - 10) = 0$$\n\n$$2x(x - 5)(x + 2) = 0$$\n\n因式 $x$ 给出解 $x = 0$，不要丢掉它。解为 $x = 0, 5, -2$。",
      ),
      generate(rng) {
        let r1: number;
        let r2: number;
        do {
          r1 = rng.nonZero(-6, 6);
          r2 = rng.nonZero(-6, 6);
        } while (r1 === r2);
        const k = rng.pick([1, 2, 3, -1, -2, 4]);
        const j = rng.pick([1, 1, 2]);
        const quad = [1, -(r1 + r2), r1 * r2];
        const cs = [...quad.map((v) => v * k), ...Array<number>(j).fill(0)];
        const gcfLatex = monoFront(k, j);
        const values = ["0", String(r1), String(r2)];
        return solutionsProblem({
          prompt: solvePrompt(`${P(cs)} = 0`),
          values,
          wrong: [
            [String(r1), String(r2)],
            ["0", String(-r1), String(-r2)],
            [String(k), String(r1), String(r2)],
          ],
          solution: t(
            `Take out the greatest common factor $${poly([k, pw(j)])}$ and factor the trinomial:${steps(`${P(cs)} = ${gcfLatex}(${P(quad)}) = ${gcfLatex}${lf(1, -r1)}${lf(1, -r2)} = 0`)}The factor $${pw(j)}$ gives $x = 0$, and the binomials give $x = ${r1}$ and $x = ${r2}$.`,
            `提取最大公因式 $${poly([k, pw(j)])}$，再分解三项式：${steps(`${P(cs)} = ${gcfLatex}(${P(quad)}) = ${gcfLatex}${lf(1, -r1)}${lf(1, -r2)} = 0`)}因式 $${pw(j)}$ 给出 $x = 0$，两个二项式给出 $x = ${r1}$ 和 $x = ${r2}$。`,
          ),
        });
      },
    },
    {
      id: "terms-on-both-sides",
      title: t("Terms on both sides", "两边都有项"),
      explanation: t(
        "First move every term to one side so that the other side is $0$. Never divide both sides by $x$: that loses the solution $x = 0$.\n\n$$x^{4} = 9x^{2} \\implies x^{4} - 9x^{2} = 0 \\implies x^{2}(x - 3)(x + 3) = 0$$\n\nThe solutions are $x = 0, 3, -3$. Dividing by $x^{2}$ would have given only $x = \\pm 3$.",
        "先把所有项移到一边，使另一边为 $0$。不要两边同除以 $x$：那样会丢掉解 $x = 0$。\n\n$$x^{4} = 9x^{2} \\implies x^{4} - 9x^{2} = 0 \\implies x^{2}(x - 3)(x + 3) = 0$$\n\n解为 $x = 0, 3, -3$。如果两边除以 $x^{2}$，就只剩下 $x = \\pm 3$。",
      ),
      generate(rng) {
        const k = rng.pick([1, 1, 2, 3]);
        if (rng.bool(0.4)) {
          const v = rng.int(1, 8);
          const j = rng.pick([1, 2]);
          const lhs = poly([k, pw(j + 2)]);
          const rhs = poly([k * v * v, pw(j)]);
          const values = ["0", String(v), String(-v)];
          return solutionsProblem({
            prompt: solvePrompt(`${lhs} = ${rhs}`),
            values,
            wrong: [
              [String(v), String(-v)],
              ["0", String(v)],
              ["0", String(v * v)],
            ],
            solution: t(
              `Move every term to the left side, take out $${poly([k, pw(j)])}$ and factor the difference of squares:${steps(`${lhs} - ${rhs} = 0`, `${monoFront(k, j)}(x^{2} - ${v * v}) = ${monoFront(k, j)}${lf(1, -v)}${lf(1, v)} = 0`)}The solutions are $x = 0, ${v}, ${-v}$. Dividing by $${pw(j)}$ would lose $x = 0$.`,
              `把所有项移到左边，提出 $${poly([k, pw(j)])}$ 并分解平方差：${steps(`${lhs} - ${rhs} = 0`, `${monoFront(k, j)}(x^{2} - ${v * v}) = ${monoFront(k, j)}${lf(1, -v)}${lf(1, v)} = 0`)}解为 $x = 0, ${v}, ${-v}$。两边除以 $${pw(j)}$ 会丢掉 $x = 0$。`,
            ),
          });
        }
        let r1: number;
        let r2: number;
        do {
          r1 = rng.nonZero(-6, 6);
          r2 = rng.nonZero(-6, 6);
        } while (r1 === r2 || r1 + r2 === 0);
        const B = -k * (r1 + r2);
        const C = k * r1 * r2;
        const moveX = rng.bool(0.5);
        const lhs = moveX ? P([k, B, 0, 0]) : poly([k, "x^{3}"]);
        const rhs = moveX ? poly([-C, "x"]) : P([-B, -C, 0]);
        const values = ["0", String(r1), String(r2)];
        return solutionsProblem({
          prompt: solvePrompt(`${lhs} = ${rhs}`),
          values,
          wrong: [
            [String(r1), String(r2)],
            ["0", String(-r1), String(-r2)],
          ],
          solution: t(
            `Move every term to the left side, then take out $${poly([k, "x"])}$ and factor:${steps(`${P([k, B, C, 0])} = 0`, `${monoFront(k, 1)}(${P([1, -(r1 + r2), r1 * r2])}) = ${monoFront(k, 1)}${lf(1, -r1)}${lf(1, -r2)} = 0`)}The solutions are $x = 0, ${r1}, ${r2}$.`,
            `把所有项移到左边，提出 $${poly([k, "x"])}$ 再分解：${steps(`${P([k, B, C, 0])} = 0`, `${monoFront(k, 1)}(${P([1, -(r1 + r2), r1 * r2])}) = ${monoFront(k, 1)}${lf(1, -r1)}${lf(1, -r2)} = 0`)}解为 $x = 0, ${r1}, ${r2}$。`,
          ),
        });
      },
    },
    {
      id: "leading-coefficients",
      title: t("A trinomial with a leading coefficient", "首项系数不为 1 的三项式"),
      explanation: t(
        "After taking out the GCF, the trinomial may have a leading coefficient; factor it as usual:\n\n$$6x^{3} - 3x^{2} - 9x = 3x(2x^{2} - x - 3) = 3x(2x - 3)(x + 1) = 0$$\n\nThe solutions are $x = 0$, $x = \\frac{3}{2}$ and $x = -1$.",
        "提取公因式之后，三项式的首项系数可能不是 1，照常分解：\n\n$$6x^{3} - 3x^{2} - 9x = 3x(2x^{2} - x - 3) = 3x(2x - 3)(x + 1) = 0$$\n\n解为 $x = 0$，$x = \\frac{3}{2}$，$x = -1$。",
      ),
      keyPrerequisites: ["solving-quadratic-equations-with-leading-coefficients-by-factoring"],
      generate(rng) {
        let a: number;
        let b: number;
        do {
          a = rng.int(2, 4);
          b = rng.nonZero(-7, 7);
        } while (gcd(a, b) !== 1);
        const r = rng.nonZero(-5, 5);
        const k = rng.pick([1, 2, 3, -1, -2]);
        const quad = mulP([a, -b], [1, -r]);
        const cs = [...quad.map((v) => v * k), 0];
        const g = monoFront(k, 1);
        const values = ["0", fracOf(b, a), String(r)];
        return solutionsProblem({
          prompt: solvePrompt(`${P(cs)} = 0`),
          values,
          wrong: [
            ["0", String(b), String(r)],
            [fracOf(b, a), String(r)],
            ["0", fracOf(-b, a), String(-r)],
          ],
          solution: t(
            `Take out $${poly([k, "x"])}$ and factor the trinomial:${steps(`${P(cs)} = ${g}(${P(quad)}) = ${g}${lf(a, -b)}${lf(1, -r)} = 0`)}So $x = 0$, $${linearRoot(a, -b)}$, and $x = ${r}$.`,
            `提出 $${poly([k, "x"])}$ 并分解三项式：${steps(`${P(cs)} = ${g}(${P(quad)}) = ${g}${lf(a, -b)}${lf(1, -r)} = 0`)}所以 $x = 0$，$${linearRoot(a, -b)}$，$x = ${r}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 2.6.3 Solving cubic equations by grouping ──────────────────────────────

/** groupingLine writes x²(ax + b) + c(ax + b) = (ax + b)(x² + c) for a cubic [a, b, ca, cb]. */
function groupingLine(a: number, b: number, c: number): string {
  const B = lf(a, b);
  const second = c < 0 ? ` - ${Math.abs(c) === 1 ? "" : Math.abs(c)}${B}` : ` + ${c === 1 ? "" : c}${B}`;
  return `${P([a * 1, b, a * c, b * c])} = x^{2}${B}${second} = ${B}(${P([1, 0, c])})`;
}

/** solvingCubicEquationsByGrouping solves four-term cubic equations by grouping. */
export const solvingCubicEquationsByGrouping: TopicDef = {
  id: "solving-cubic-equations-by-grouping",
  title: t("Solving Cubic Equations by Grouping", "用分组分解法解三次方程"),
  summary: t(
    "Solve four-term cubic equations such as $x^{3} + 2x^{2} - 9x - 18 = 0$ by grouping, then setting each factor to zero.",
    "用分组分解法解 $x^{3} + 2x^{2} - 9x - 18 = 0$ 这类四项三次方程，再令每个因式为零。",
  ),
  prerequisites: ["solving-polynomial-equations-using-the-gcf", "factoring-cubic-expressions-by-grouping"],
  encompasses: [
    { topic: "factoring-cubic-expressions-by-grouping", weight: 0.7 },
    { topic: "determining-the-roots-of-polynomials", weight: 0.5 },
    { topic: "solving-polynomial-equations-using-the-gcf", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSA.APR.B.3", "CCSS.HSA.SSE.A.2"],
  knowledgePoints: [
    {
      id: "grouping-then-difference-of-squares",
      title: t("Grouping, then a difference of squares", "分组后再分解平方差"),
      explanation: t(
        "Group the first two and the last two terms, take out the common binomial, and factor any difference of squares:\n\n$$x^{3} + 2x^{2} - 9x - 18 = x^{2}(x + 2) - 9(x + 2) = (x + 2)(x^{2} - 9) = (x + 2)(x - 3)(x + 3)$$\n\nSo $x^{3} + 2x^{2} - 9x - 18 = 0$ has the three solutions $x = -2, 3, -3$.",
        "把前两项、后两项分别分组，提出公共二项式，再分解平方差：\n\n$$x^{3} + 2x^{2} - 9x - 18 = x^{2}(x + 2) - 9(x + 2) = (x + 2)(x^{2} - 9) = (x + 2)(x - 3)(x + 3)$$\n\n所以 $x^{3} + 2x^{2} - 9x - 18 = 0$ 有三个解 $x = -2, 3, -3$。",
      ),
      keyPrerequisites: ["factoring-cubic-expressions-by-grouping"],
      generate(rng) {
        let q: number;
        let v: number;
        do {
          q = rng.nonZero(-8, 8);
          v = rng.int(1, 7);
        } while (Math.abs(q) === v);
        const cs = [1, q, -v * v, -q * v * v];
        const values = [String(-q), String(v), String(-v)];
        return solutionsProblem({
          prompt: solvePrompt(`${P(cs)} = 0`),
          values,
          wrong: [
            [String(q), String(v), String(-v)],
            [String(-q), String(v)],
            [String(-q), String(v * v), String(-v * v)],
          ],
          solution: t(
            `Group the terms in pairs and take out the common binomial:${steps(groupingLine(1, q, -v * v), `= ${lf(1, q)}${lf(1, -v)}${lf(1, v)} = 0`)}The solutions are $x = ${-q}, ${v}, ${-v}$.`,
            `把各项两两分组，提出公共二项式：${steps(groupingLine(1, q, -v * v), `= ${lf(1, q)}${lf(1, -v)}${lf(1, v)} = 0`)}解为 $x = ${-q}, ${v}, ${-v}$。`,
          ),
        });
      },
    },
    {
      id: "a-quadratic-factor-left",
      title: t("A quadratic factor that does not factor", "不能再分解的二次因式"),
      explanation: t(
        "The quadratic factor may not factor over the integers. Solve it directly: $x^{2} + 5 = 0$ has no real solution, while $x^{2} - 5 = 0$ gives $x = \\pm\\sqrt{5}$.\n\n$$x^{3} - 4x^{2} - 5x + 20 = x^{2}(x - 4) - 5(x - 4) = (x - 4)(x^{2} - 5) = 0$$\n\nThe real solutions are $x = 4$ and $x = \\pm\\sqrt{5}$.",
        "二次因式可能在整数范围内不能分解，直接求解即可：$x^{2} + 5 = 0$ 没有实数解，而 $x^{2} - 5 = 0$ 得 $x = \\pm\\sqrt{5}$。\n\n$$x^{3} - 4x^{2} - 5x + 20 = x^{2}(x - 4) - 5(x - 4) = (x - 4)(x^{2} - 5) = 0$$\n\n实数解为 $x = 4$ 和 $x = \\pm\\sqrt{5}$。",
      ),
      generate(rng) {
        const q = rng.nonZero(-8, 8);
        const none = rng.bool(0.5);
        const n = none ? rng.int(1, 12) : rng.pick([2, 3, 5, 6, 7, 8, 10, 11, 12, 18]);
        const c = none ? n : -n;
        const cs = [1, q, c, q * c];
        const pair = sqrtPair(n);
        const values = none ? [String(-q)] : [String(-q), ...pair];
        const quadStep = none
          ? t(`$x^{2} = ${-n}$ has no real solution`, `$x^{2} = ${-n}$ 没有实数解`)
          : t(`$x^{2} = ${n}$ gives $x = \\pm ${pair[0]}$`, `$x^{2} = ${n}$ 得 $x = \\pm ${pair[0]}$`);
        return solutionsProblem({
          prompt: solvePrompt(`${P(cs)} = 0`, true),
          values,
          wrong: none ? [[String(-q), ...pair], [String(q)]] : [[String(-q), String(n), String(-n)], [String(q), ...pair], [String(-q)]],
          solution: t(
            `Group the terms in pairs:${steps(`${groupingLine(1, q, c)} = 0`)}$${xm(-q)} = 0$ gives $x = ${-q}$, and ${quadStep.en}. The real solutions are $${values.join(", ")}$.`,
            `把各项两两分组：${steps(`${groupingLine(1, q, c)} = 0`)}$${xm(-q)} = 0$ 得 $x = ${-q}$；${quadStep["zh-CN"]}。实数解为 $${values.join(", ")}$。`,
          ),
        });
      },
    },
    {
      id: "leading-coefficients",
      title: t("A binomial with a leading coefficient", "首项系数不为 1 的二项式"),
      explanation: t(
        "The common binomial may have a leading coefficient, giving a fractional solution:\n\n$$2x^{3} + 3x^{2} - 8x - 12 = x^{2}(2x + 3) - 4(2x + 3) = (2x + 3)(x - 2)(x + 2) = 0$$\n\n$2x + 3 = 0$ gives $x = -\\frac{3}{2}$, so the solutions are $x = -\\frac{3}{2}, 2, -2$.",
        "公共二项式的首项系数可能不是 1，这时会得到分数解：\n\n$$2x^{3} + 3x^{2} - 8x - 12 = x^{2}(2x + 3) - 4(2x + 3) = (2x + 3)(x - 2)(x + 2) = 0$$\n\n$2x + 3 = 0$ 得 $x = -\\frac{3}{2}$，所以解为 $x = -\\frac{3}{2}, 2, -2$。",
      ),
      generate(rng) {
        let a: number;
        let b: number;
        do {
          a = rng.int(2, 5);
          b = rng.nonZero(-9, 9);
        } while (gcd(a, b) !== 1);
        const v = rng.int(1, 6);
        const cs = [a, b, -a * v * v, -b * v * v];
        const values = [fracOf(-b, a), String(v), String(-v)];
        return solutionsProblem({
          prompt: solvePrompt(`${P(cs)} = 0`),
          values,
          wrong: [
            [String(-b), String(v), String(-v)],
            [fracOf(b, a), String(v), String(-v)],
            [fracOf(-b, a), String(v)],
          ],
          solution: t(
            `Group the terms in pairs:${steps(groupingLine(a, b, -v * v), `= ${lf(a, b)}${lf(1, -v)}${lf(1, v)} = 0`)}$${linearRoot(a, b)}$, so the solutions are $${values.join(", ")}$.`,
            `把各项两两分组：${steps(groupingLine(a, b, -v * v), `= ${lf(a, b)}${lf(1, -v)}${lf(1, v)} = 0`)}$${linearRoot(a, b)}$，所以解为 $${values.join(", ")}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 2.6.4 Solving biquadratic equations ────────────────────────────────────

/** solvingBiquadraticEquations solves ax⁴ + bx² + c = 0 as a quadratic in x². */
export const solvingBiquadraticEquations: TopicDef = {
  id: "solving-biquadratic-equations",
  title: t("Solving Biquadratic Equations", "解双二次方程"),
  summary: t(
    "Solve $ax^{4} + bx^{2} + c = 0$ by factoring it as a quadratic in $x^{2}$, then solving each $x^{2} = k$.",
    "把 $ax^{4} + bx^{2} + c = 0$ 看作 $x^{2}$ 的二次式分解，再解每个 $x^{2} = k$。",
  ),
  prerequisites: ["determining-the-roots-of-polynomials", "factoring-biquadratic-expressions"],
  encompasses: [
    { topic: "factoring-biquadratic-expressions", weight: 0.7 },
    { topic: "determining-the-roots-of-polynomials", weight: 0.5 },
  ],
  xp: 14,
  standards: ["CCSS.HSA.APR.B.3", "CCSS.HSA.SSE.A.2"],
  knowledgePoints: [
    {
      id: "four-solutions",
      title: t("Four solutions", "四个解"),
      explanation: t(
        "Treat $x^{4}$ as $(x^{2})^{2}$ and factor as a quadratic in $x^{2}$; each factor $x^{2} - k$ with $k > 0$ gives two solutions:\n\n$$x^{4} - 13x^{2} + 36 = (x^{2} - 4)(x^{2} - 9) = 0$$\n\n$x^{2} = 4$ gives $x = \\pm 2$ and $x^{2} = 9$ gives $x = \\pm 3$. Do not stop at $x^{2} = 4$: the solutions are values of $x$, and there are four of them.",
        "把 $x^{4}$ 看作 $(x^{2})^{2}$，按 $x^{2}$ 的二次式分解；每个因式 $x^{2} - k$（$k > 0$）给出两个解：\n\n$$x^{4} - 13x^{2} + 36 = (x^{2} - 4)(x^{2} - 9) = 0$$\n\n$x^{2} = 4$ 得 $x = \\pm 2$，$x^{2} = 9$ 得 $x = \\pm 3$。不要停在 $x^{2} = 4$：要求的是 $x$ 的值，共有四个。",
      ),
      generate(rng) {
        let m: number;
        let n: number;
        do {
          m = rng.int(1, 9);
          n = rng.int(1, 9);
        } while (m >= n);
        const cs = [1, 0, -(m * m + n * n), 0, m * m * n * n];
        const values = [String(m), String(-m), String(n), String(-n)];
        return solutionsProblem({
          prompt: solvePrompt(`${P(cs)} = 0`),
          values,
          wrong: [
            [String(m * m), String(n * n)],
            [String(m), String(n)],
            [String(m * m), String(-m * m), String(n * n), String(-n * n)],
          ],
          solution: t(
            `Factor as a quadratic in $x^{2}$: two numbers with product $${m * m * n * n}$ and sum $${-(m * m + n * n)}$ are $${-m * m}$ and $${-n * n}$.${steps(`${P(cs)} = (x^{2} - ${m * m})(x^{2} - ${n * n}) = 0`)}$x^{2} = ${m * m}$ gives $x = \\pm ${m}$, and $x^{2} = ${n * n}$ gives $x = \\pm ${n}$.`,
            `按 $x^{2}$ 的二次式分解：积为 $${m * m * n * n}$、和为 $${-(m * m + n * n)}$ 的两个数是 $${-m * m}$ 和 $${-n * n}$。${steps(`${P(cs)} = (x^{2} - ${m * m})(x^{2} - ${n * n}) = 0`)}$x^{2} = ${m * m}$ 得 $x = \\pm ${m}$，$x^{2} = ${n * n}$ 得 $x = \\pm ${n}$。`,
          ),
        });
      },
    },
    {
      id: "fewer-real-solutions",
      title: t("Fewer real solutions", "实数解较少的情形"),
      explanation: t(
        "A factor $x^{2} + k$ with $k > 0$ gives no real solution, and $x^{2} = k$ for a $k$ that is not a perfect square gives $x = \\pm\\sqrt{k}$:\n\n$$x^{4} + 5x^{2} - 36 = (x^{2} - 4)(x^{2} + 9) = 0 \\implies x = \\pm 2$$\n\n$$x^{4} - 7x^{2} + 12 = (x^{2} - 3)(x^{2} - 4) = 0 \\implies x = \\pm\\sqrt{3}, \\; x = \\pm 2$$",
        "因式 $x^{2} + k$（$k > 0$）没有实数解；当 $k$ 不是完全平方数时，$x^{2} = k$ 得 $x = \\pm\\sqrt{k}$：\n\n$$x^{4} + 5x^{2} - 36 = (x^{2} - 4)(x^{2} + 9) = 0 \\implies x = \\pm 2$$\n\n$$x^{4} - 7x^{2} + 12 = (x^{2} - 3)(x^{2} - 4) = 0 \\implies x = \\pm\\sqrt{3}, \\; x = \\pm 2$$",
      ),
      generate(rng) {
        const m = rng.int(1, 6);
        if (rng.bool(0.5)) {
          const n = rng.int(1, 10);
          const cs = [1, 0, n - m * m, 0, -m * m * n];
          const values = [String(m), String(-m)];
          return solutionsProblem({
            prompt: solvePrompt(`${P(cs)} = 0`, true),
            values,
            wrong: [[String(m), String(-m), ...sqrtPair(n)], [String(m * m)], [String(m)]],
            solution: t(
              `Factor as a quadratic in $x^{2}$:${steps(`${P(cs)} = (x^{2} - ${m * m})(x^{2} + ${n}) = 0`)}$x^{2} = ${m * m}$ gives $x = \\pm ${m}$, while $x^{2} = ${-n}$ has no real solution.`,
              `按 $x^{2}$ 的二次式分解：${steps(`${P(cs)} = (x^{2} - ${m * m})(x^{2} + ${n}) = 0`)}$x^{2} = ${m * m}$ 得 $x = \\pm ${m}$，而 $x^{2} = ${-n}$ 没有实数解。`,
            ),
          });
        }
        const s = rng.pick([2, 3, 5, 6, 7, 8, 10, 11, 12]);
        const cs = [1, 0, -(s + m * m), 0, s * m * m];
        const pair = sqrtPair(s);
        const values = [...pair, String(m), String(-m)];
        return solutionsProblem({
          prompt: solvePrompt(`${P(cs)} = 0`, true),
          values,
          wrong: [
            [String(s), String(-s), String(m), String(-m)],
            [pair[0], String(m)],
            [String(s), String(m * m)],
          ],
          solution: t(
            `Factor as a quadratic in $x^{2}$:${steps(`${P(cs)} = (x^{2} - ${s})(x^{2} - ${m * m}) = 0`)}$x^{2} = ${s}$ gives $x = \\pm ${pair[0]}$, and $x^{2} = ${m * m}$ gives $x = \\pm ${m}$.`,
            `按 $x^{2}$ 的二次式分解：${steps(`${P(cs)} = (x^{2} - ${s})(x^{2} - ${m * m}) = 0`)}$x^{2} = ${s}$ 得 $x = \\pm ${pair[0]}$，$x^{2} = ${m * m}$ 得 $x = \\pm ${m}$。`,
          ),
        });
      },
    },
    {
      id: "leading-coefficients",
      title: t("A leading coefficient", "首项系数不为 1"),
      explanation: t(
        "With a leading coefficient, factor as a quadratic in $x^{2}$ by the ac-method, then solve each factor:\n\n$$4x^{4} - 13x^{2} + 9 = (4x^{2} - 9)(x^{2} - 1) = 0$$\n\n$x^{2} = \\frac{9}{4}$ gives $x = \\pm\\frac{3}{2}$, and $x^{2} = 1$ gives $x = \\pm 1$.",
        "首项系数不为 1 时，用 ac 法按 $x^{2}$ 的二次式分解，再分别求解：\n\n$$4x^{4} - 13x^{2} + 9 = (4x^{2} - 9)(x^{2} - 1) = 0$$\n\n$x^{2} = \\frac{9}{4}$ 得 $x = \\pm\\frac{3}{2}$，$x^{2} = 1$ 得 $x = \\pm 1$。",
      ),
      generate(rng) {
        let u: number;
        let v: number;
        do {
          u = rng.int(2, 3);
          v = rng.int(1, 7);
        } while (gcd(u, v) !== 1);
        const m = rng.int(1, 5);
        const cs = [u * u, 0, -(u * u * m * m + v * v), 0, v * v * m * m];
        const values = [fracOf(v, u), fracOf(-v, u), String(m), String(-m)];
        return solutionsProblem({
          prompt: solvePrompt(`${P(cs)} = 0`),
          values,
          wrong: [
            [String(v), String(-v), String(m), String(-m)],
            [fracOf(v * v, u * u), fracOf(-v * v, u * u), String(m), String(-m)],
            [fracOf(v, u), String(m)],
          ],
          solution: t(
            `Factor as a quadratic in $x^{2}$:${steps(`${P(cs)} = (${P([u * u, 0, -v * v])})(x^{2} - ${m * m}) = 0`)}$x^{2} = ${fracOf(v * v, u * u)}$ gives $x = \\pm ${fracOf(v, u)}$, and $x^{2} = ${m * m}$ gives $x = \\pm ${m}$.`,
            `按 $x^{2}$ 的二次式分解：${steps(`${P(cs)} = (${P([u * u, 0, -v * v])})(x^{2} - ${m * m}) = 0`)}$x^{2} = ${fracOf(v * v, u * u)}$ 得 $x = \\pm ${fracOf(v, u)}$，$x^{2} = ${m * m}$ 得 $x = \\pm ${m}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 2.7.1 The factor theorem ───────────────────────────────────────────────

/** valueLine writes p(c) = substitution = value. */
const valueLine = (cs: Coefs, c: Q) => `p\\left(${c.toLatex()}\\right) = ${substitute(cs, c.toLatex())} = ${evalQ(cs, c).toLatex()}`;

/** theFactorTheorem tells whether x − c is a factor from the value p(c). */
export const theFactorTheorem: TopicDef = {
  id: "the-factor-theorem",
  title: t("The Factor Theorem", "因式定理"),
  summary: t(
    "$x - c$ is a factor of $p(x)$ exactly when $p(c) = 0$: test factors by evaluating, and turn roots into factors.",
    "$x - c$ 是 $p(x)$ 的因式当且仅当 $p(c) = 0$：通过求值检验因式，并把根转化为因式。",
  ),
  prerequisites: ["dividing-polynomials-using-synthetic-division", "determining-the-roots-of-polynomials"],
  encompasses: [
    { topic: "dividing-polynomials-using-synthetic-division", weight: 0.3 },
    { topic: "determining-the-roots-of-polynomials", weight: 0.4 },
  ],
  xp: 13,
  standards: ["CCSS.HSA.APR.B.2"],
  knowledgePoints: [
    {
      id: "testing-a-factor",
      title: t("Testing a factor", "检验因式"),
      explanation: t(
        "Dividing $p(x)$ by $x - c$ gives $p(x) = (x - c)q(x) + r$. Substituting $x = c$ makes the first term zero, so $r = p(c)$. Hence the **factor theorem**: $x - c$ is a factor of $p(x)$ exactly when $p(c) = 0$.\n\nIs $x - 2$ a factor of $p(x) = x^{3} - 3x^{2} + 4$?\n\n$$p(2) = 8 - 12 + 4 = 0$$\n\nYes. For $x + 1$, use $c = -1$: $p(-1) = -1 - 3 + 4 = 0$, so $x + 1$ is a factor too.",
        "把 $p(x)$ 除以 $x - c$ 得 $p(x) = (x - c)q(x) + r$。代入 $x = c$，第一项为零，所以 $r = p(c)$。由此得**因式定理**：$x - c$ 是 $p(x)$ 的因式当且仅当 $p(c) = 0$。\n\n$x - 2$ 是 $p(x) = x^{3} - 3x^{2} + 4$ 的因式吗？\n\n$$p(2) = 8 - 12 + 4 = 0$$\n\n是。对于 $x + 1$，取 $c = -1$：$p(-1) = -1 - 3 + 4 = 0$，所以 $x + 1$ 也是因式。",
      ),
      generate(rng) {
        for (;;) {
          const root = rng.nonZero(-4, 4);
          const quad = [rng.pick([1, 1, 2]), rng.int(-5, 5), rng.nonZero(-6, 6)];
          const cs = mulP([1, -root], quad);
          const yes = rng.bool(0.5);
          const c = yes ? root : rng.nonZero(-3, 3);
          const v = evalI(cs, c);
          if (!yes && v === 0) continue;
          return choiceProblem({
            prompt: t(`Is $${xm(c)}$ a factor of $p(x) = ${P(cs)}$?`, `$${xm(c)}$ 是 $p(x) = ${P(cs)}$ 的因式吗？`),
            options: yesNo,
            correct: yes ? 0 : 1,
            solution: t(
              `By the factor theorem, $${xm(c)}$ is a factor exactly when $p(${c}) = 0$:${steps(valueLine(cs, Q.of(c)))}${yes ? `Since $p(${c}) = 0$, $${xm(c)}$ is a factor.` : `Since $p(${c}) \\neq 0$, $${xm(c)}$ is not a factor; dividing would leave the remainder $${v}$.`}`,
              `由因式定理，$${xm(c)}$ 是因式当且仅当 $p(${c}) = 0$：${steps(valueLine(cs, Q.of(c)))}${yes ? `因为 $p(${c}) = 0$，所以 $${xm(c)}$ 是因式。` : `因为 $p(${c}) \\neq 0$，所以 $${xm(c)}$ 不是因式；相除会余下 $${v}$。`}`,
            ),
          });
        }
      },
    },
    {
      id: "factors-from-roots",
      title: t("Factors from roots", "由根得因式"),
      explanation: t(
        "Read the factor theorem the other way: if $p(c) = 0$, then $x - c$ is a factor. For a fractional root $\\frac{b}{a}$, the factor $x - \\frac{b}{a}$ can be scaled by $a$ to clear the fraction:\n\n$$p\\left(\\frac{3}{2}\\right) = 0 \\implies x - \\frac{3}{2} \\text{ is a factor, and so is } 2x - 3$$\n\nCheck: $2x - 3 = 0$ gives $x = \\frac{3}{2}$. Similarly $p(-4) = 0$ means $x + 4$ is a factor.",
        "反过来用因式定理：若 $p(c) = 0$，则 $x - c$ 是因式。对于分数根 $\\frac{b}{a}$，可把因式 $x - \\frac{b}{a}$ 乘以 $a$ 去掉分母：\n\n$$p\\left(\\frac{3}{2}\\right) = 0 \\implies x - \\frac{3}{2} \\text{ 是因式，} 2x - 3 \\text{ 也是}$$\n\n检验：$2x - 3 = 0$ 得 $x = \\frac{3}{2}$。同理，$p(-4) = 0$ 说明 $x + 4$ 是因式。",
      ),
      generate(rng) {
        for (;;) {
          const q = rng.pick([1, 1, 2, 3, 4, 5]);
          const pp = rng.int(1, 7);
          const s = rng.sign();
          if (gcd(pp, q) !== 1 || pp === q || (q === 1 && pp === 1)) continue;
          const root = Q.of(s * pp, q);
          const candidates = [
            linear(q, -s * pp),
            linear(q, s * pp),
            linear(pp, -s * q),
            linear(pp, s * q),
            linear(1, -s * pp),
            linear(1, s * pp),
          ];
          const options = [...new Set(candidates)].slice(0, 4);
          if (options.length < 4) continue;
          const order = rng.shuffle(options);
          const correct = order.indexOf(linear(q, -s * pp));
          return choiceProblem({
            prompt: t(
              `A polynomial $p(x)$ has $p\\left(${root.toLatex()}\\right) = 0$. Which of these must be a factor of $p(x)$?`,
              `多项式 $p(x)$ 满足 $p\\left(${root.toLatex()}\\right) = 0$。下列哪一个一定是 $p(x)$ 的因式？`,
            ),
            options: order.map((o) => same(`$${o}$`)),
            correct,
            solution: t(
              `By the factor theorem, $x - \\left(${root.toLatex()}\\right)$ is a factor${q === 1 ? "" : `, and multiplying it by $${q}$ gives a factor with integer coefficients`}: $${linear(q, -s * pp)}$. Check: $${linearRoot(q, -s * pp)}$.`,
              `由因式定理，$x - \\left(${root.toLatex()}\\right)$ 是因式${q === 1 ? "" : `，乘以 $${q}$ 得到整系数的因式`}：$${linear(q, -s * pp)}$。检验：$${linearRoot(q, -s * pp)}$。`,
            ),
          });
        }
      },
    },
    {
      id: "finding-a-factor",
      title: t("Finding the factor", "找出因式"),
      explanation: t(
        "To decide which of several binomials is a factor, evaluate $p(x)$ at each candidate root. For $p(x) = x^{3} + 2x^{2} - 5x - 6$ and the candidates $x - 1$, $x + 1$, $x - 3$:\n\n$$p(1) = 1 + 2 - 5 - 6 = -8, \\quad p(-1) = -1 + 2 + 5 - 6 = 0, \\quad p(3) = 27 + 18 - 15 - 6 = 24$$\n\nOnly $p(-1) = 0$, so $x + 1$ is the factor.",
        "要判断几个二项式中哪个是因式，就在每个候选根处求 $p(x)$ 的值。对 $p(x) = x^{3} + 2x^{2} - 5x - 6$ 和候选 $x - 1$、$x + 1$、$x - 3$：\n\n$$p(1) = 1 + 2 - 5 - 6 = -8, \\quad p(-1) = -1 + 2 + 5 - 6 = 0, \\quad p(3) = 27 + 18 - 15 - 6 = 24$$\n\n只有 $p(-1) = 0$，所以 $x + 1$ 是因式。",
      ),
      generate(rng) {
        for (;;) {
          const cands = rng.sample([1, -1, 2, -2, 3, -3], 4);
          const root = rng.pick(cands);
          const quad = [1, rng.int(-5, 5), rng.nonZero(-6, 6)];
          const cs = mulP([1, -root], quad);
          if (cands.some((c) => c !== root && evalI(cs, c) === 0)) continue;
          const values = cands.map((c) => `p(${c}) = ${evalI(cs, c)}`).join(", \\quad ");
          return choiceProblem({
            prompt: t(`Which of these is a factor of $p(x) = ${P(cs)}$?`, `下列哪一个是 $p(x) = ${P(cs)}$ 的因式？`),
            options: cands.map((c) => same(`$${xm(c)}$`)),
            correct: cands.indexOf(root),
            solution: t(
              `By the factor theorem, $x - c$ is a factor exactly when $p(c) = 0$. Evaluate at each candidate:${steps(values)}Only $p(${root}) = 0$, so $${xm(root)}$ is the factor.`,
              `由因式定理，$x - c$ 是因式当且仅当 $p(c) = 0$。逐个求值：${steps(values)}只有 $p(${root}) = 0$，所以 $${xm(root)}$ 是因式。`,
            ),
          });
        }
      },
    },
  ],
};

// ─── 2.7.2 Determining polynomial coefficients using the factor theorem ────

/** polyWithK writes a polynomial with the coefficient at index idx replaced by k. */
function polyWithK(cs: Coefs, idx: number): string {
  const n = cs.length - 1;
  return poly(...cs.map((c, i): [number, string] => (i === idx ? [1, `k${pw(n - i)}`] : [c, pw(n - i)])));
}

/** kSolution solves p(x0) = target for the coefficient k at index idx, as Q. */
function solveK(cs: Coefs, idx: number, x0: Q, target: Q = Q.zero): Q | undefined {
  const rest = evalQ(
    cs.map((c, i) => (i === idx ? 0 : c)),
    x0,
  );
  const coef = x0.pow(cs.length - 1 - idx);
  return coef.isZero() ? undefined : target.sub(rest).div(coef);
}

/** kSolution explains solving p(x0) = target for k. */
function kSolution(cs: Coefs, idx: number, x0: Q, target: Q, why: Text): Text {
  const rest = evalQ(
    cs.map((c, i) => (i === idx ? 0 : c)),
    x0,
  );
  const coef = x0.pow(cs.length - 1 - idx);
  const k = target.sub(rest).div(coef);
  const lhs = `${coef.eq(Q.one) ? "" : coef.eq(Q.one.neg()) ? "-" : coef.toLatex()}k${rest.isZero() ? "" : rest.sign() < 0 ? ` - ${rest.abs().toLatex()}` : ` + ${rest.toLatex()}`}`;
  const work = steps(`p\\left(${x0.toLatex()}\\right) = ${lhs} = ${target.toLatex()}`, `k = ${k.toLatex()}`);
  return t(`${why.en} Substitute and simplify:${work}`, `${why["zh-CN"]}代入并化简：${work}`);
}

/** determiningPolynomialCoefficientsUsingTheFactorTheorem finds unknown coefficients from known factors. */
export const determiningPolynomialCoefficientsUsingTheFactorTheorem: TopicDef = {
  id: "determining-polynomial-coefficients-using-the-factor-theorem",
  title: t("Determining Polynomial Coefficients Using the Factor Theorem", "用因式定理求多项式的系数"),
  summary: t(
    "Find unknown coefficients from known factors: $x - c$ is a factor, so $p(c) = 0$ gives an equation.",
    "由已知因式求未知系数：$x - c$ 是因式，所以 $p(c) = 0$ 给出一个方程。",
  ),
  prerequisites: ["the-factor-theorem", "elimination-with-two-transformations"],
  encompasses: [
    { topic: "the-factor-theorem", weight: 0.6 },
    { topic: "elimination-with-two-transformations", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSA.APR.B.2"],
  knowledgePoints: [
    {
      id: "one-unknown-coefficient",
      title: t("One unknown coefficient", "一个未知系数"),
      explanation: t(
        "If $x - c$ is a factor of $p(x)$, then $p(c) = 0$. With one unknown coefficient this is a linear equation.\n\n$x - 2$ is a factor of $p(x) = x^{3} + kx^{2} - 5x + 6$:\n\n$$p(2) = 8 + 4k - 10 + 6 = 4k + 4 = 0 \\implies k = -1$$\n\nFor a factor $x + 3$, substitute $x = -3$.",
        "若 $x - c$ 是 $p(x)$ 的因式，则 $p(c) = 0$。只有一个未知系数时，这是一个一次方程。\n\n$x - 2$ 是 $p(x) = x^{3} + kx^{2} - 5x + 6$ 的因式：\n\n$$p(2) = 8 + 4k - 10 + 6 = 4k + 4 = 0 \\implies k = -1$$\n\n若因式是 $x + 3$，则代入 $x = -3$。",
      ),
      generate(rng) {
        const c = rng.nonZero(-4, 4);
        const quad = [1, rng.int(-6, 6), rng.nonZero(-6, 6)];
        const cs = mulP([1, -c], quad);
        const idx = rng.pick([1, 2, 3]);
        const k = cs[idx]!;
        const other = solveK(cs, idx, Q.of(-c));
        return numberProblem({
          prompt: t(
            `$${xm(c)}$ is a factor of $p(x) = ${polyWithK(cs, idx)}$. Find $k$.`,
            `$${xm(c)}$ 是 $p(x) = ${polyWithK(cs, idx)}$ 的因式。求 $k$。`,
          ),
          answer: k,
          solveFor: "k",
          wrong: [...(other ? [other] : []), -k],
          solution: kSolution(
            cs,
            idx,
            Q.of(c),
            Q.zero,
            t(`Since $${xm(c)}$ is a factor, $p(${c}) = 0$.`, `因为 $${xm(c)}$ 是因式，所以 $p(${c}) = 0$。`),
          ),
        });
      },
    },
    {
      id: "a-factor-with-a-leading-coefficient",
      title: t("A factor with a leading coefficient", "首项系数不为 1 的因式"),
      explanation: t(
        "If $ax - b$ is a factor, the root is $x = \\frac{b}{a}$, so $p\\left(\\frac{b}{a}\\right) = 0$.\n\n$2x - 1$ is a factor of $p(x) = 2x^{3} + x^{2} + kx + 1$:\n\n$$p\\left(\\frac{1}{2}\\right) = \\frac{1}{4} + \\frac{1}{4} + \\frac{1}{2}k + 1 = \\frac{1}{2}k + \\frac{3}{2} = 0 \\implies k = -3$$",
        "若 $ax - b$ 是因式，则根为 $x = \\frac{b}{a}$，所以 $p\\left(\\frac{b}{a}\\right) = 0$。\n\n$2x - 1$ 是 $p(x) = 2x^{3} + x^{2} + kx + 1$ 的因式：\n\n$$p\\left(\\frac{1}{2}\\right) = \\frac{1}{4} + \\frac{1}{4} + \\frac{1}{2}k + 1 = \\frac{1}{2}k + \\frac{3}{2} = 0 \\implies k = -3$$",
      ),
      generate(rng) {
        let a: number;
        let b: number;
        do {
          a = rng.int(2, 3);
          b = rng.nonZero(-3, 3);
        } while (gcd(a, b) !== 1);
        const quad = [rng.int(1, 2), rng.int(-4, 4), rng.nonZero(-5, 5)];
        const cs = mulP([a, -b], quad);
        const idx = rng.pick([1, 2, 3]);
        const k = cs[idx]!;
        const root = Q.of(b, a);
        const wrong = [solveK(cs, idx, Q.of(b)), solveK(cs, idx, root.neg()), Q.of(-k)].filter((w): w is Q => w !== undefined);
        return numberProblem({
          prompt: t(
            `$${linear(a, -b)}$ is a factor of $p(x) = ${polyWithK(cs, idx)}$. Find $k$.`,
            `$${linear(a, -b)}$ 是 $p(x) = ${polyWithK(cs, idx)}$ 的因式。求 $k$。`,
          ),
          answer: k,
          solveFor: "k",
          wrong,
          solution: kSolution(
            cs,
            idx,
            root,
            Q.zero,
            t(
              `$${linearRoot(a, -b)}$, so $p\\left(${root.toLatex()}\\right) = 0$.`,
              `$${linearRoot(a, -b)}$，所以 $p\\left(${root.toLatex()}\\right) = 0$。`,
            ),
          ),
        });
      },
    },
    {
      id: "two-unknown-coefficients",
      title: t("Two unknown coefficients", "两个未知系数"),
      explanation: t(
        "Two known factors give two equations, one for each root; solve them as a system.\n\n$x - 1$ and $x + 2$ are factors of $p(x) = x^{3} + ax^{2} + bx - 6$:\n\n$$p(1) = 1 + a + b - 6 = 0 \\implies a + b = 5$$\n\n$$p(-2) = -8 + 4a - 2b - 6 = 0 \\implies 4a - 2b = 14$$\n\nSolving the system gives $a = 4$ and $b = 1$.",
        "两个已知因式给出两个方程（每个根一个），把它们作为方程组求解。\n\n$x - 1$ 和 $x + 2$ 是 $p(x) = x^{3} + ax^{2} + bx - 6$ 的因式：\n\n$$p(1) = 1 + a + b - 6 = 0 \\implies a + b = 5$$\n\n$$p(-2) = -8 + 4a - 2b - 6 = 0 \\implies 4a - 2b = 14$$\n\n解方程组得 $a = 4$，$b = 1$。",
      ),
      keyPrerequisites: ["elimination-with-two-transformations"],
      generate(rng) {
        let r: number;
        let s: number;
        do {
          r = rng.nonZero(-3, 3);
          s = rng.nonZero(-3, 3);
        } while (r === s);
        const u = rng.nonZero(-5, 5);
        const [, a, b, d] = mulP([1, -r], [1, -s], [1, -u]) as [number, number, number, number];
        /** solve finds a and b from the roots x and y, given d. */
        const solve = (x: number, y: number): [Q, Q] => {
          const e1 = -(x ** 3) - d;
          const e2 = -(y ** 3) - d;
          const det = x * x * y - y * y * x;
          return [Q.of(e1 * y - e2 * x, det), Q.of(x * x * e2 - y * y * e1, det)];
        };
        const eq = (x: number) => `${poly([x * x, "a"], [x, "b"])} = ${-(x ** 3) - d}`;
        const flipped = solve(-r, -s);
        return pointProblem({
          prompt: t(
            `$${xm(r)}$ and $${xm(s)}$ are factors of $p(x) = x^{3} + ax^{2} + bx ${d < 0 ? "-" : "+"} ${Math.abs(d)}$. Find $a$ and $b$.`,
            `$${xm(r)}$ 和 $${xm(s)}$ 是 $p(x) = x^{3} + ax^{2} + bx ${d < 0 ? "-" : "+"} ${Math.abs(d)}$ 的因式。求 $a$ 和 $b$。`,
          ),
          answer: [a, b],
          vars: ["a", "b"],
          wrong: [[b, a], [-a, -b], flipped],
          solution: t(
            `By the factor theorem, $p(${r}) = 0$ and $p(${s}) = 0$. Substituting gives a system of two linear equations:${steps(eq(r), eq(s))}Solving the system gives $a = ${a}$ and $b = ${b}$.`,
            `由因式定理，$p(${r}) = 0$ 且 $p(${s}) = 0$。代入得到一个二元一次方程组：${steps(eq(r), eq(s))}解方程组得 $a = ${a}$，$b = ${b}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 2.7.3 Factoring cubic polynomials using the factor theorem ────────────

/** quadFactors writes the factors of a monic quadratic with integer roots, or the quadratic itself. */
function quadFactors(quad: Coefs): string {
  const [, b, c] = quad as [number, number, number];
  const disc = b * b - 4 * c;
  if (quad[0] === 1 && isSquare(disc)) {
    const s = Math.round(Math.sqrt(disc));
    const r1 = (-b + s) / 2;
    const r2 = (-b - s) / 2;
    if (Number.isInteger(r1)) return `${lf(1, -r1)}${lf(1, -r2)}`;
  }
  return `(${P(quad)})`;
}

/** irreducible tells whether x² + bx + c has no rational root. */
const irreducible = (b: number, c: number) => !isSquare(b * b - 4 * c);

/** testLine writes the values of p at candidates until a root. */
function testLine(cs: Coefs, candidates: readonly number[]): { line: string; root: number } {
  const parts: string[] = [];
  for (const c of candidates) {
    const v = evalI(cs, c);
    parts.push(`p(${c}) = ${v}`);
    if (v === 0) return { line: parts.join(", \\quad "), root: c };
  }
  throw new RangeError("no integer root among the candidates");
}

/** factoringCubicPolynomialsUsingTheFactorTheorem factors cubics by dividing out a known or found factor. */
export const factoringCubicPolynomialsUsingTheFactorTheorem: TopicDef = {
  id: "factoring-cubic-polynomials-using-the-factor-theorem",
  title: t("Factoring Cubic Polynomials Using the Factor Theorem", "用因式定理分解三次多项式"),
  summary: t(
    "Factor a cubic completely: find a root $c$, divide by $x - c$, then factor the quadratic quotient.",
    "彻底分解三次多项式：找到一个根 $c$，除以 $x - c$，再分解二次的商。",
  ),
  prerequisites: ["the-factor-theorem", "further-factoring-trinomials-with-leading-coefficients"],
  encompasses: [
    { topic: "the-factor-theorem", weight: 0.6 },
    { topic: "dividing-polynomials-using-synthetic-division", weight: 0.5 },
    { topic: "factoring-trinomials", weight: 0.5 },
    { topic: "factoring-trinomials-with-leading-coefficients", weight: 0.3 },
  ],
  xp: 16,
  standards: ["CCSS.HSA.APR.B.2", "CCSS.HSA.APR.B.3"],
  knowledgePoints: [
    {
      id: "a-given-factor",
      title: t("Dividing out a given factor", "除去已知因式"),
      explanation: t(
        `If $x - c$ is a factor, synthetic division by $x - c$ leaves a quadratic quotient with remainder $0$; then factor the quotient.\n\nGiven that $x - 2$ is a factor of $x^{3} - 4x^{2} + x + 6$:\n\n$$${exSynthetic}$$\n\n$$x^{3} - 4x^{2} + x + 6 = (x - 2)(x^{2} - 2x - 3) = (x - 2)(x - 3)(x + 1)$$`,
        `若 $x - c$ 是因式，用综合除法除以 $x - c$ 会得到余数为 $0$ 的二次商式，再分解这个商。\n\n已知 $x - 2$ 是 $x^{3} - 4x^{2} + x + 6$ 的因式：\n\n$$${exSynthetic}$$\n\n$$x^{3} - 4x^{2} + x + 6 = (x - 2)(x^{2} - 2x - 3) = (x - 2)(x - 3)(x + 1)$$`,
      ),
      generate(rng) {
        for (;;) {
          const c = rng.nonZero(-4, 4);
          let quad: number[];
          if (rng.bool(0.7)) {
            const r = rng.nonZero(-6, 6);
            const s = rng.nonZero(-6, 6);
            if (r === s || r === c || s === c) continue;
            quad = mulP([1, -r], [1, -s]);
          } else {
            quad = [1, rng.int(-5, 5), rng.nonZero(-7, 7)];
            if (!irreducible(quad[1]!, quad[2]!)) continue;
          }
          const cs = mulP([1, -c], quad);
          const answer = `${lf(1, -c)}${quadFactors(quad)}`;
          const s = synthetic(cs, c);
          return factoredProblem({
            prompt: t(
              `Given that $${xm(c)}$ is a factor of $p(x) = ${P(cs)}$, factor $p(x)$ completely.`,
              `已知 $${xm(c)}$ 是 $p(x) = ${P(cs)}$ 的因式，把 $p(x)$ 彻底分解因式。`,
            ),
            answer,
            wrong: [`${lf(1, c)}${quadFactors(quad)}`, `${lf(1, -c)}(${P(quad)})`, `${lf(1, -c)}${quadFactors([1, -quad[1]!, quad[2]!])}`],
            solution: t(
              `Divide by $${xm(c)}$ with synthetic division:${steps(s.latex)}The remainder is $0$ and the quotient is $${P(quad)}$:${steps(`${P(cs)} = ${lf(1, -c)}(${P(quad)}) = ${answer}`)}`,
              `用综合除法除以 $${xm(c)}$：${steps(s.latex)}余数为 $0$，商为 $${P(quad)}$：${steps(`${P(cs)} = ${lf(1, -c)}(${P(quad)}) = ${answer}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "finding-a-root",
      title: t("Finding a root first", "先找出一个根"),
      explanation: t(
        "When no factor is given, look for an integer root. For a polynomial with leading coefficient $1$ and integer coefficients, any integer root divides the constant term, so test those divisors: $\\pm 1, \\pm 2, \\dots$\n\nFor $x^{3} - 7x - 6$, the constant term is $-6$:\n\n$$p(1) = -12, \\quad p(-1) = 0$$\n\nSo $x + 1$ is a factor. Dividing gives $x^{2} - x - 6$, and\n\n$$x^{3} - 7x - 6 = (x + 1)(x - 3)(x + 2)$$",
        "没有给出因式时，先找整数根。首项系数为 $1$ 的整系数多项式，其整数根一定整除常数项，所以逐个试验这些因数：$\\pm 1, \\pm 2, \\dots$\n\n对 $x^{3} - 7x - 6$，常数项是 $-6$：\n\n$$p(1) = -12, \\quad p(-1) = 0$$\n\n所以 $x + 1$ 是因式。相除得 $x^{2} - x - 6$，于是\n\n$$x^{3} - 7x - 6 = (x + 1)(x - 3)(x + 2)$$",
      ),
      generate(rng) {
        for (;;) {
          const c = rng.pick([1, -1, 2, -2, 3, -3]);
          let quad: number[];
          let roots: number[];
          if (rng.bool(0.6)) {
            const r = rng.nonZero(-5, 5);
            const s = rng.nonZero(-5, 5);
            if (new Set([c, r, s]).size < 3) continue;
            quad = mulP([1, -r], [1, -s]);
            roots = [c, r, s];
          } else {
            quad = [1, rng.int(-5, 5), rng.nonZero(-7, 7)];
            if (!irreducible(quad[1]!, quad[2]!)) continue;
            roots = [c];
          }
          const cs = mulP([1, -c], quad);
          const { line, root } = testLine(cs, [1, -1, 2, -2, 3, -3]);
          const s = synthetic(cs, root);
          const rest = roots.length === 3 ? roots.filter((r) => r !== root) : [];
          const answer = rest.length === 2 ? `${lf(1, -root)}${lf(1, -rest[0]!)}${lf(1, -rest[1]!)}` : `${lf(1, -root)}(${P(quad)})`;
          return factoredProblem({
            prompt: t(`Factor $${P(cs)}$ completely.`, `将 $${P(cs)}$ 彻底分解因式。`),
            answer,
            wrong: [
              `${lf(1, root)}(${P(s.quotient)})`,
              ...(rest.length === 2 ? [`${lf(1, root)}${lf(1, rest[0]!)}${lf(1, rest[1]!)}`] : [`${lf(1, root)}(${P(quad)})`]),
            ],
            solution: t(
              `Integer roots divide the constant term $${cs[3]}$. Test its divisors:${steps(line)}So $${xm(root)}$ is a factor. Divide by it:${steps(s.latex)}${steps(`${P(cs)} = ${lf(1, -root)}(${P(s.quotient)})${rest.length === 2 ? ` = ${answer}` : ""}`)}${rest.length === 2 ? "" : "The quadratic factor has no integer roots, so it does not factor further."}`,
              `整数根整除常数项 $${cs[3]}$。试验它的因数：${steps(line)}所以 $${xm(root)}$ 是因式。用它去除：${steps(s.latex)}${steps(`${P(cs)} = ${lf(1, -root)}(${P(s.quotient)})${rest.length === 2 ? ` = ${answer}` : ""}`)}${rest.length === 2 ? "" : "二次因式没有整数根，不能再分解。"}`,
            ),
          });
        }
      },
    },
    {
      id: "leading-coefficients",
      title: t("A quotient with a leading coefficient", "首项系数不为 1 的商"),
      explanation: t(
        "When the cubic has a leading coefficient, so does the quadratic quotient; factor it with the ac-method.\n\nGiven that $x + 1$ is a factor of $6x^{3} + 7x^{2} - 1$, synthetic division with $c = -1$ gives the quotient $6x^{2} + x - 1$, which factors further:\n\n$$6x^{3} + 7x^{2} - 1 = (x + 1)(6x^{2} + x - 1) = (x + 1)(3x - 1)(2x + 1)$$",
        "三次式的首项系数不为 1 时，二次商式的首项系数也不为 1，用 ac 法分解。\n\n例如已知 $x + 1$ 是 $6x^{3} + 7x^{2} - 1$ 的因式，取 $c = -1$ 做综合除法得商 $6x^{2} + x - 1$，再分解：\n\n$$6x^{3} + 7x^{2} - 1 = (x + 1)(6x^{2} + x - 1) = (x + 1)(3x - 1)(2x + 1)$$",
      ),
      keyPrerequisites: ["further-factoring-trinomials-with-leading-coefficients"],
      generate(rng) {
        for (;;) {
          const c = rng.nonZero(-3, 3);
          const p1 = rng.int(1, 3);
          const p2 = rng.int(2, 3);
          const q1 = rng.nonZero(-5, 5);
          const q2 = rng.nonZero(-5, 5);
          if (gcd(p1, q1) !== 1 || gcd(p2, q2) !== 1) continue;
          const roots = [Q.of(c), Q.of(-q1, p1), Q.of(-q2, p2)];
          if (roots.some((r, i) => roots.findIndex((o) => o.eq(r)) !== i)) continue;
          const quad = mulP([p1, q1], [p2, q2]);
          const cs = mulP([1, -c], quad);
          const answer = `${lf(1, -c)}${lf(p1, q1)}${lf(p2, q2)}`;
          const s = synthetic(cs, c);
          return factoredProblem({
            prompt: t(
              `Given that $${xm(c)}$ is a factor of $p(x) = ${P(cs)}$, factor $p(x)$ completely.`,
              `已知 $${xm(c)}$ 是 $p(x) = ${P(cs)}$ 的因式，把 $p(x)$ 彻底分解因式。`,
            ),
            answer,
            wrong: [`${lf(1, c)}${lf(p1, q1)}${lf(p2, q2)}`, `${lf(1, -c)}${lf(p1, -q1)}${lf(p2, -q2)}`, `${lf(1, -c)}(${P(quad)})`],
            solution: t(
              `Divide by $${xm(c)}$ with synthetic division:${steps(s.latex)}The quotient is $${P(quad)}$. Factor it with the ac-method:${steps(`${P(cs)} = ${lf(1, -c)}(${P(quad)}) = ${answer}`)}`,
              `用综合除法除以 $${xm(c)}$：${steps(s.latex)}商为 $${P(quad)}$，用 ac 法分解：${steps(`${P(cs)} = ${lf(1, -c)}(${P(quad)}) = ${answer}`)}`,
            ),
          });
        }
      },
    },
  ],
};

// ─── 2.7.4 Factoring quartic polynomials using the factor theorem ──────────

/** twoDivisions explains dividing a quartic by x − c₁ and then x − c₂. */
function twoDivisions(cs: Coefs, c1: number, c2: number): { latex: string; quad: number[] } {
  const s1 = synthetic(cs, c1);
  const s2 = synthetic(s1.quotient, c2);
  return { latex: `${steps(s1.latex)}${steps(s2.latex)}`, quad: s2.quotient };
}

/** factoringQuarticPolynomialsUsingTheFactorTheorem factors quartics by dividing out two linear factors. */
export const factoringQuarticPolynomialsUsingTheFactorTheorem: TopicDef = {
  id: "factoring-quartic-polynomials-using-the-factor-theorem",
  title: t("Factoring Quartic Polynomials Using the Factor Theorem", "用因式定理分解四次多项式"),
  summary: t(
    "Factor a quartic completely by dividing out two linear factors, one after the other, and factoring the quadratic that remains.",
    "依次除去两个一次因式，再分解剩下的二次式，从而彻底分解四次多项式。",
  ),
  prerequisites: ["factoring-cubic-polynomials-using-the-factor-theorem"],
  encompasses: [{ topic: "factoring-cubic-polynomials-using-the-factor-theorem", weight: 0.8 }],
  xp: 17,
  standards: ["CCSS.HSA.APR.B.2", "CCSS.HSA.APR.B.3"],
  knowledgePoints: [
    {
      id: "two-given-factors",
      title: t("Two given factors", "两个已知因式"),
      explanation: t(
        `Divide by the first factor, then divide the cubic quotient by the second factor, then factor the quadratic that is left.\n\nGiven that $x + 1$ and $x - 2$ are factors of $x^{4} - 2x^{3} - 7x^{2} + 8x + 12$, divide with $c = -1$ and then with $c = 2$:\n\n$$${synthetic([1, -2, -7, 8, 12], -1).latex}$$\n\n$$${synthetic([1, -3, -4, 12], 2).latex}$$\n\n$$x^{4} - 2x^{3} - 7x^{2} + 8x + 12 = (x + 1)(x - 2)(x^{2} - x - 6) = (x + 1)(x - 2)(x - 3)(x + 2)$$`,
        `先除以第一个因式，再用第二个因式除三次商式，最后分解剩下的二次式。\n\n已知 $x + 1$ 和 $x - 2$ 是 $x^{4} - 2x^{3} - 7x^{2} + 8x + 12$ 的因式：\n\n$$${synthetic([1, -2, -7, 8, 12], -1).latex}$$\n\n$$${synthetic([1, -3, -4, 12], 2).latex}$$\n\n$$x^{4} - 2x^{3} - 7x^{2} + 8x + 12 = (x + 1)(x - 2)(x^{2} - x - 6) = (x + 1)(x - 2)(x - 3)(x + 2)$$`,
      ),
      generate(rng) {
        for (;;) {
          const [c1, c2] = rng.sample([1, -1, 2, -2, 3, -3], 2) as [number, number];
          let quad: number[];
          if (rng.bool(0.6)) {
            const r = rng.nonZero(-5, 5);
            const s = rng.nonZero(-5, 5);
            if (new Set([c1, c2, r, s]).size < 4) continue;
            quad = mulP([1, -r], [1, -s]);
          } else {
            quad = [1, rng.int(-4, 4), rng.nonZero(-6, 6)];
            if (!irreducible(quad[1]!, quad[2]!)) continue;
          }
          const cs = mulP([1, -c1], [1, -c2], quad);
          const d = twoDivisions(cs, c1, c2);
          const answer = `${lf(1, -c1)}${lf(1, -c2)}${quadFactors(quad)}`;
          return factoredProblem({
            prompt: t(
              `Given that $${xm(c1)}$ and $${xm(c2)}$ are factors of $p(x) = ${P(cs)}$, factor $p(x)$ completely.`,
              `已知 $${xm(c1)}$ 和 $${xm(c2)}$ 是 $p(x) = ${P(cs)}$ 的因式，把 $p(x)$ 彻底分解因式。`,
            ),
            answer,
            wrong: [`${lf(1, c1)}${lf(1, c2)}${quadFactors(quad)}`, `${lf(1, -c1)}${lf(1, -c2)}(${P(quad)})`],
            solution: t(
              `Divide by $${xm(c1)}$, then divide the quotient by $${xm(c2)}$:${d.latex}What is left is $${P(quad)}$:${steps(`${P(cs)} = ${lf(1, -c1)}${lf(1, -c2)}(${P(quad)})${quadFactors(quad) === `(${P(quad)})` ? "" : ` = ${answer}`}`)}`,
              `先除以 $${xm(c1)}$，再用 $${xm(c2)}$ 除所得的商：${d.latex}剩下 $${P(quad)}$：${steps(`${P(cs)} = ${lf(1, -c1)}${lf(1, -c2)}(${P(quad)})${quadFactors(quad) === `(${P(quad)})` ? "" : ` = ${answer}`}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "finding-two-roots",
      title: t("Finding two roots", "找出两个根"),
      explanation: t(
        "With no factor given, test the divisors of the constant term to find a root, divide, and test again on the cubic quotient.\n\nFor $x^{4} + x^{3} - 7x^{2} - x + 6$: $p(1) = 0$, so divide by $x - 1$ to get $x^{3} + 2x^{2} - 5x - 6$. For this cubic, $q(-1) = 0$, so divide by $x + 1$ to get $x^{2} + x - 6 = (x + 3)(x - 2)$:\n\n$$x^{4} + x^{3} - 7x^{2} - x + 6 = (x - 1)(x + 1)(x + 3)(x - 2)$$",
        "没有给出因式时，试验常数项的因数找到一个根，相除，再对三次商式继续试验。\n\n对 $x^{4} + x^{3} - 7x^{2} - x + 6$：$p(1) = 0$，除以 $x - 1$ 得 $x^{3} + 2x^{2} - 5x - 6$。对这个三次式，$q(-1) = 0$，除以 $x + 1$ 得 $x^{2} + x - 6 = (x + 3)(x - 2)$：\n\n$$x^{4} + x^{3} - 7x^{2} - x + 6 = (x - 1)(x + 1)(x + 3)(x - 2)$$",
      ),
      generate(rng) {
        const order = [1, -1, 2, -2, 3, -3];
        for (;;) {
          const [c1, c2] = rng.sample(order, 2) as [number, number];
          let quad: number[];
          let roots: number[];
          if (rng.bool(0.5)) {
            const r = rng.nonZero(-4, 4);
            const s = rng.nonZero(-4, 4);
            if (new Set([c1, c2, r, s]).size < 4) continue;
            quad = mulP([1, -r], [1, -s]);
            roots = [c1, c2, r, s];
          } else {
            quad = [1, rng.int(-4, 4), rng.nonZero(-6, 6)];
            if (!irreducible(quad[1]!, quad[2]!)) continue;
            roots = [c1, c2];
          }
          const cs = mulP([1, -c1], [1, -c2], quad);
          const first = testLine(cs, order);
          const q1 = synthetic(cs, first.root);
          const second = testLine(q1.quotient, order);
          const q2 = synthetic(q1.quotient, second.root);
          const rest = roots.filter((r) => r !== first.root && r !== second.root);
          const tail = rest.length === 2 ? `${lf(1, -rest[0]!)}${lf(1, -rest[1]!)}` : `(${P(q2.quotient)})`;
          const answer = `${lf(1, -first.root)}${lf(1, -second.root)}${tail}`;
          return factoredProblem({
            prompt: t(`Factor $${P(cs)}$ completely.`, `将 $${P(cs)}$ 彻底分解因式。`),
            answer,
            wrong: [`${lf(1, first.root)}${lf(1, second.root)}${tail}`, `${lf(1, -first.root)}(${P(q1.quotient)})`],
            solution: t(
              `Test divisors of the constant term $${cs[4]}$:${steps(first.line)}Divide by $${xm(first.root)}$:${steps(q1.latex)}Test the quotient $q(x) = ${P(q1.quotient)}$:${steps(second.line.replace(/p\(/g, "q("))}Divide by $${xm(second.root)}$:${steps(q2.latex)}${steps(`${P(cs)} = ${answer}`)}`,
              `试验常数项 $${cs[4]}$ 的因数：${steps(first.line)}除以 $${xm(first.root)}$：${steps(q1.latex)}对商 $q(x) = ${P(q1.quotient)}$ 继续试验：${steps(second.line.replace(/p\(/g, "q("))}除以 $${xm(second.root)}$：${steps(q2.latex)}${steps(`${P(cs)} = ${answer}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "leading-coefficients",
      title: t("A leading coefficient", "首项系数不为 1"),
      explanation: t(
        "If the quartic has a leading coefficient, the quadratic left after two divisions has it too; factor it with the ac-method:\n\n$$2x^{4} - x^{3} - 9x^{2} + 4x + 4 = (x - 1)(x + 2)(2x^{2} - 3x - 2) = (x - 1)(x + 2)(2x + 1)(x - 2)$$",
        "四次式的首项系数不为 1 时，两次相除后剩下的二次式首项系数也不为 1，用 ac 法分解：\n\n$$2x^{4} - x^{3} - 9x^{2} + 4x + 4 = (x - 1)(x + 2)(2x^{2} - 3x - 2) = (x - 1)(x + 2)(2x + 1)(x - 2)$$",
      ),
      generate(rng) {
        for (;;) {
          const [c1, c2] = rng.sample([1, -1, 2, -2, 3], 2) as [number, number];
          const p1 = rng.int(2, 3);
          const q1 = rng.nonZero(-3, 3);
          const q2 = rng.nonZero(-4, 4);
          if (gcd(p1, q1) !== 1) continue;
          const roots = [Q.of(c1), Q.of(c2), Q.of(-q1, p1), Q.of(-q2)];
          if (roots.some((r, i) => roots.findIndex((o) => o.eq(r)) !== i)) continue;
          const quad = mulP([p1, q1], [1, q2]);
          const cs = mulP([1, -c1], [1, -c2], quad);
          const d = twoDivisions(cs, c1, c2);
          const answer = `${lf(1, -c1)}${lf(1, -c2)}${lf(p1, q1)}${lf(1, q2)}`;
          return factoredProblem({
            prompt: t(
              `Given that $${xm(c1)}$ and $${xm(c2)}$ are factors of $p(x) = ${P(cs)}$, factor $p(x)$ completely.`,
              `已知 $${xm(c1)}$ 和 $${xm(c2)}$ 是 $p(x) = ${P(cs)}$ 的因式，把 $p(x)$ 彻底分解因式。`,
            ),
            answer,
            wrong: [`${lf(1, c1)}${lf(1, c2)}${lf(p1, q1)}${lf(1, q2)}`, `${lf(1, -c1)}${lf(1, -c2)}${lf(p1, -q1)}${lf(1, -q2)}`],
            solution: t(
              `Divide by $${xm(c1)}$, then by $${xm(c2)}$:${d.latex}Factor the quadratic $${P(quad)}$ that is left:${steps(`${P(cs)} = ${lf(1, -c1)}${lf(1, -c2)}(${P(quad)}) = ${answer}`)}`,
              `先除以 $${xm(c1)}$，再除以 $${xm(c2)}$：${d.latex}分解剩下的二次式 $${P(quad)}$：${steps(`${P(cs)} = ${lf(1, -c1)}${lf(1, -c2)}(${P(quad)}) = ${answer}`)}`,
            ),
          });
        }
      },
    },
  ],
};

// ─── 2.7.5 Multiplicities of the roots of polynomials ──────────────────────

/** powFactor writes a factor raised to a power: "(x - 2)" or "(x - 2)^{3}". */
const powFactor = (f: string, e: number) => (e === 1 ? f : `${f}^{${e}}`);

/** multiplicityPrompt asks for the multiplicity of a root. */
const multiplicityPrompt = (root: string, p: string): Text =>
  t(`What is the multiplicity of the root $x = ${root}$ of $p(x) = ${p}$?`, `$x = ${root}$ 是 $p(x) = ${p}$ 的几重根？`);

/** multiplicitiesOfTheRootsOfPolynomials reads multiplicities from factored polynomials. */
export const multiplicitiesOfTheRootsOfPolynomials: TopicDef = {
  id: "multiplicities-of-the-roots-of-polynomials",
  title: t("Multiplicities of the Roots of Polynomials", "多项式根的重数"),
  summary: t(
    "The multiplicity of a root $c$ is the number of times the factor $x - c$ appears in the factored polynomial.",
    "根 $c$ 的重数是因式 $x - c$ 在多项式因式分解中出现的次数。",
  ),
  prerequisites: ["determining-the-roots-of-polynomials"],
  encompasses: [{ topic: "determining-the-roots-of-polynomials", weight: 0.5 }],
  xp: 11,
  standards: ["CCSS.HSA.APR.B.3"],
  knowledgePoints: [
    {
      id: "from-factored-form",
      title: t("Reading multiplicities", "读出重数"),
      explanation: t(
        "The **multiplicity** of a root $c$ is the number of times $x - c$ appears as a factor, which is its exponent in the factored form:\n\n$$p(x) = x^{2}(x - 3)^{4}(x + 1)$$\n\nThe root $0$ has multiplicity $2$, the root $3$ has multiplicity $4$, and the root $-1$ has multiplicity $1$. The multiplicities add up to the degree, $2 + 4 + 1 = 7$.",
        "根 $c$ 的**重数**是 $x - c$ 作为因式出现的次数，也就是它在因式分解形式中的指数：\n\n$$p(x) = x^{2}(x - 3)^{4}(x + 1)$$\n\n根 $0$ 的重数是 $2$，根 $3$ 的重数是 $4$，根 $-1$ 的重数是 $1$。重数之和等于次数：$2 + 4 + 1 = 7$。",
      ),
      generate(rng) {
        let roots: number[];
        do roots = [rng.int(-6, 6), rng.nonZero(-6, 6), rng.nonZero(-6, 6)];
        while (new Set(roots).size < 3);
        const exps = roots.map(() => rng.int(1, 4));
        const k = rng.pick([1, 1, 2, 3, -1, 5]);
        const expr = `${front(k)}${roots.map((r, i) => powFactor(r === 0 ? "x" : lf(1, -r), exps[i]!)).join("")}`;
        const i = rng.int(0, 2);
        const e = exps[i]!;
        return numberProblem({
          prompt: multiplicityPrompt(String(roots[i]), expr),
          answer: e,
          wrong: [...exps.filter((_, j) => j !== i), exps.reduce((a, b) => a + b, 0), Math.abs(k)],
          solution: t(
            `The factor $${roots[i] === 0 ? "x" : xm(roots[i]!)}$ appears with exponent $${e}$, so the root $x = ${roots[i]}$ has multiplicity $${e}$.`,
            `因式 $${roots[i] === 0 ? "x" : xm(roots[i]!)}$ 的指数是 $${e}$，所以根 $x = ${roots[i]}$ 是 $${e}$ 重根。`,
          ),
        });
      },
    },
    {
      id: "factors-with-coefficients",
      title: t("Factors with coefficients", "带系数的因式"),
      explanation: t(
        "A factor $ax - b$ gives the root $\\frac{b}{a}$, and its exponent is still the multiplicity. A factor written as $b - x$ gives the root $b$, since $b - x = -(x - b)$:\n\n$$p(x) = 5(2x - 1)^{3}(4 - x)^{2}$$\n\nThe root $\\frac{1}{2}$ has multiplicity $3$ and the root $4$ has multiplicity $2$. The constant $5$ is not a root.",
        "因式 $ax - b$ 给出根 $\\frac{b}{a}$，它的指数仍是重数。写成 $b - x$ 的因式给出根 $b$，因为 $b - x = -(x - b)$：\n\n$$p(x) = 5(2x - 1)^{3}(4 - x)^{2}$$\n\n根 $\\frac{1}{2}$ 是 $3$ 重根，根 $4$ 是 $2$ 重根。常数 $5$ 不是根。",
      ),
      generate(rng) {
        for (;;) {
          const fs = Array.from({ length: rng.pick([2, 3]) }, () => {
            const a = rng.pick([1, 2, 3, 4]);
            const b = rng.nonZero(-6, 6);
            const flip = a === 1 && rng.bool(0.4);
            return { a, b, flip, e: rng.int(1, 4) };
          });
          if (fs.some((f) => gcd(f.a, f.b) !== 1)) continue;
          const roots = fs.map((f) => Q.of(f.b, f.a));
          if (roots.some((r, i) => roots.findIndex((o) => o.eq(r)) !== i)) continue;
          if (!fs.some((f) => f.a > 1 || f.flip)) continue;
          const k = rng.pick([1, 2, 3, 5, -2]);
          const expr = `${front(k)}${fs.map((f) => powFactor(f.flip ? `(${poly([f.b, ""], [-1, "x"])})` : lf(f.a, -f.b), f.e)).join("")}`;
          const i = rng.int(0, fs.length - 1);
          const f = fs[i]!;
          return numberProblem({
            prompt: multiplicityPrompt(roots[i]!.toLatex(), expr),
            answer: f.e,
            wrong: [...fs.filter((_, j) => j !== i).map((g) => g.e), f.a, fs.reduce((s, g) => s + g.e, 0)],
            solution: t(
              `The root $${roots[i]!.toLatex()}$ comes from the factor $${f.flip ? poly([f.b, ""], [-1, "x"]) : linear(f.a, -f.b)}$, which appears with exponent $${f.e}$. So its multiplicity is $${f.e}$.`,
              `根 $${roots[i]!.toLatex()}$ 来自因式 $${f.flip ? poly([f.b, ""], [-1, "x"]) : linear(f.a, -f.b)}$，其指数是 $${f.e}$，所以它是 $${f.e}$ 重根。`,
            ),
          });
        }
      },
    },
    {
      id: "combining-factors",
      title: t("Factors that share a root", "有公共根的因式"),
      explanation: t(
        "Factor every factor completely before counting: the same root can hide in more than one factor.\n\n$$p(x) = (x - 2)^{2}(x^{2} - 4) = (x - 2)^{2}(x - 2)(x + 2) = (x - 2)^{3}(x + 2)$$\n\nThe root $2$ has multiplicity $3$, not $2$, and the root $-2$ has multiplicity $1$.",
        "数重数之前，先把每个因式彻底分解：同一个根可能藏在几个因式里。\n\n$$p(x) = (x - 2)^{2}(x^{2} - 4) = (x - 2)^{2}(x - 2)(x + 2) = (x - 2)^{3}(x + 2)$$\n\n根 $2$ 是 $3$ 重根而不是 $2$ 重根，根 $-2$ 是 $1$ 重根。",
      ),
      keyPrerequisites: ["solving-quadratic-equations-using-a-difference-of-squares"],
      generate(rng) {
        const a = rng.int(1, 6);
        const s = rng.sign();
        const r = s * a;
        const e1 = rng.int(1, 3);
        const e2 = rng.int(1, 2);
        const e0 = rng.pick([0, 0, 1, 2]);
        const expr = `${e0 === 0 ? "" : powFactor("x", e0)}${powFactor(lf(1, -r), e1)}${powFactor(`(x^{2} - ${a * a})`, e2)}`;
        const which = rng.pick(["same", "same", "other"] as const);
        const root = which === "same" ? r : -r;
        const answer = which === "same" ? e1 + e2 : e2;
        const combined = `${e0 === 0 ? "" : powFactor("x", e0)}${powFactor(lf(1, -r), e1 + e2)}${powFactor(lf(1, r), e2)}`;
        return numberProblem({
          prompt: multiplicityPrompt(String(root), expr),
          answer,
          wrong: which === "same" ? [e1, e2, e1 * e2] : [e1 + e2, e1, 2 * e2 + 1],
          solution: t(
            `Factor $x^{2} - ${a * a} = ${lf(1, -a)}${lf(1, a)}$ and collect equal factors:${steps(`p(x) = ${combined}`)}The root $x = ${root}$ has multiplicity $${answer}$.`,
            `分解 $x^{2} - ${a * a} = ${lf(1, -a)}${lf(1, a)}$，再合并相同的因式：${steps(`p(x) = ${combined}`)}根 $x = ${root}$ 是 $${answer}$ 重根。`,
          ),
        });
      },
    },
  ],
};

// ─── 2.7.6 Finding multiplicities of the roots of quartic polynomials by factoring

/** findingMultiplicitiesOfTheRootsOfQuarticPolynomialsByFactoring factors quartics to find multiplicities. */
export const findingMultiplicitiesOfTheRootsOfQuarticPolynomialsByFactoring: TopicDef = {
  id: "finding-multiplicities-of-the-roots-of-quartic-polynomials-by-factoring",
  title: t("Finding Multiplicities of the Roots of Quartic Polynomials by Factoring", "通过因式分解求四次多项式根的重数"),
  summary: t(
    "Factor an expanded quartic, by a common factor, as a biquadratic, or with the factor theorem, to find the multiplicities of its roots.",
    "通过提取公因式、按双二次式分解或用因式定理分解展开的四次多项式，求出各根的重数。",
  ),
  prerequisites: [
    "multiplicities-of-the-roots-of-polynomials",
    "factoring-quartic-polynomials-using-the-factor-theorem",
    "factoring-biquadratic-expressions",
  ],
  encompasses: [
    { topic: "multiplicities-of-the-roots-of-polynomials", weight: 0.7 },
    { topic: "factoring-quartic-polynomials-using-the-factor-theorem", weight: 0.3 },
    { topic: "factoring-biquadratic-expressions", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.APR.B.3"],
  knowledgePoints: [
    {
      id: "common-factor-first",
      title: t("A common factor first", "先提公因式"),
      explanation: t(
        "Take out the greatest common factor, then factor the trinomial; a perfect square gives a double root.\n\n$$p(x) = 2x^{4} - 12x^{3} + 18x^{2} = 2x^{2}(x^{2} - 6x + 9) = 2x^{2}(x - 3)^{2}$$\n\nThe roots $0$ and $3$ both have multiplicity $2$.",
        "先提取最大公因式，再分解三项式；完全平方式给出二重根。\n\n$$p(x) = 2x^{4} - 12x^{3} + 18x^{2} = 2x^{2}(x^{2} - 6x + 9) = 2x^{2}(x - 3)^{2}$$\n\n根 $0$ 和 $3$ 都是二重根。",
      ),
      generate(rng) {
        for (;;) {
          const k = rng.pick([1, 1, 2, 3, -1]);
          const a = rng.nonZero(-6, 6);
          const kind = rng.pick(["square", "square", "distinct", "cube"] as const);
          let j: number;
          let rest: number[];
          let factored: string;
          let mult: Map<number, number>;
          if (kind === "square") {
            j = 2;
            rest = mulP([1, -a], [1, -a]);
            factored = `${monoFront(k, 2)}${powFactor(lf(1, -a), 2)}`;
            mult = new Map([
              [0, 2],
              [a, 2],
            ]);
          } else if (kind === "distinct") {
            const b = rng.nonZero(-6, 6);
            if (b === a) continue;
            j = 2;
            rest = mulP([1, -a], [1, -b]);
            factored = `${monoFront(k, 2)}${lf(1, -a)}${lf(1, -b)}`;
            mult = new Map([
              [0, 2],
              [a, 1],
              [b, 1],
            ]);
          } else {
            j = 3;
            rest = [1, -a];
            factored = `${monoFront(k, 3)}${lf(1, -a)}`;
            mult = new Map([
              [0, 3],
              [a, 1],
            ]);
          }
          const cs = [...rest.map((v) => v * k), ...Array<number>(j).fill(0)];
          const root = rng.pick([...mult.keys()]);
          const answer = mult.get(root)!;
          return numberProblem({
            prompt: multiplicityPrompt(String(root), P(cs)),
            answer,
            wrong: [4, ...[...mult.values()].filter((v) => v !== answer), answer === 1 ? 2 : 1],
            solution: t(
              `Take out the greatest common factor $${poly([k, pw(j)])}$ and factor what is left:${steps(`${P(cs)} = ${monoFront(k, j)}(${P(rest)})${rest.length > 2 ? ` = ${factored}` : ""}`)}The root $x = ${root}$ has multiplicity $${answer}$.`,
              `提取最大公因式 $${poly([k, pw(j)])}$，再分解剩下的部分：${steps(`${P(cs)} = ${monoFront(k, j)}(${P(rest)})${rest.length > 2 ? ` = ${factored}` : ""}`)}根 $x = ${root}$ 是 $${answer}$ 重根。`,
            ),
          });
        }
      },
    },
    {
      id: "biquadratic-quartics",
      title: t("Biquadratic quartics", "双二次的四次式"),
      explanation: t(
        "Factor a quartic in $x^{2}$ as a quadratic in $x^{2}$, then factor each difference of squares:\n\n$$x^{4} - 8x^{2} + 16 = (x^{2} - 4)^{2} = \\left[(x - 2)(x + 2)\\right]^{2} = (x - 2)^{2}(x + 2)^{2}$$\n\nBoth $2$ and $-2$ have multiplicity $2$, while in $x^{4} - 5x^{2} + 4 = (x - 1)(x + 1)(x - 2)(x + 2)$ every root has multiplicity $1$.",
        "把关于 $x^{2}$ 的四次式按 $x^{2}$ 的二次式分解，再分解每个平方差：\n\n$$x^{4} - 8x^{2} + 16 = (x^{2} - 4)^{2} = \\left[(x - 2)(x + 2)\\right]^{2} = (x - 2)^{2}(x + 2)^{2}$$\n\n$2$ 和 $-2$ 都是二重根；而 $x^{4} - 5x^{2} + 4 = (x - 1)(x + 1)(x - 2)(x + 2)$ 的每个根都是一重根。",
      ),
      keyPrerequisites: ["factoring-biquadratic-expressions"],
      generate(rng) {
        const a = rng.int(1, 6);
        const kind = rng.pick(["square", "square", "distinct", "imaginary"] as const);
        const root = rng.sign() * a;
        if (kind === "square") {
          const cs = [1, 0, -2 * a * a, 0, a ** 4];
          return numberProblem({
            prompt: multiplicityPrompt(String(root), P(cs)),
            answer: 2,
            wrong: [1, 4],
            solution: t(
              `The quartic is a perfect square in $x^{2}$:${steps(`${P(cs)} = (x^{2} - ${a * a})^{2} = ${powFactor(lf(1, -a), 2)}${powFactor(lf(1, a), 2)}`)}The root $x = ${root}$ has multiplicity $2$.`,
              `这个四次式是关于 $x^{2}$ 的完全平方式：${steps(`${P(cs)} = (x^{2} - ${a * a})^{2} = ${powFactor(lf(1, -a), 2)}${powFactor(lf(1, a), 2)}`)}根 $x = ${root}$ 是二重根。`,
            ),
          });
        }
        let b: number;
        do b = rng.int(1, 6);
        while (b === a);
        const sign = kind === "distinct" ? -1 : 1;
        const cs = [1, 0, sign * b * b - a * a, 0, -sign * a * a * b * b];
        const second = `(x^{2} ${sign < 0 ? "-" : "+"} ${b * b})`;
        const full = kind === "distinct" ? `${lf(1, -a)}${lf(1, a)}${lf(1, -b)}${lf(1, b)}` : `${lf(1, -a)}${lf(1, a)}${second}`;
        return numberProblem({
          prompt: multiplicityPrompt(String(root), P(cs)),
          answer: 1,
          wrong: [2, 4],
          solution: t(
            `Factor as a quadratic in $x^{2}$, then factor the difference of squares:${steps(`${P(cs)} = (x^{2} - ${a * a})${second} = ${full}`)}The factor $${xm(root)}$ appears once, so $x = ${root}$ has multiplicity $1$.`,
            `按 $x^{2}$ 的二次式分解，再分解平方差：${steps(`${P(cs)} = (x^{2} - ${a * a})${second} = ${full}`)}因式 $${xm(root)}$ 只出现一次，所以 $x = ${root}$ 是一重根。`,
          ),
        });
      },
    },
    {
      id: "repeated-division",
      title: t("Dividing repeatedly", "反复相除"),
      explanation: t(
        `When $c$ is a root, divide by $x - c$ and test $c$ again on the quotient. The number of divisions with remainder $0$ is the multiplicity.\n\nFor $p(x) = x^{4} - 5x^{3} + 6x^{2} + 4x - 8$ and the root $2$:\n\n$$${synthetic([1, -5, 6, 4, -8], 2).latex}$$\n\n$$${synthetic([1, -3, 0, 4], 2).latex}$$\n\n$$${synthetic([1, -1, -2], 2).latex}$$\n\n$$${synthetic([1, 1], 2).latex}$$\n\nThree divisions leave remainder $0$ and the fourth does not, so $p(x) = (x - 2)^{3}(x + 1)$ and $2$ has multiplicity $3$.`,
        `当 $c$ 是根时，除以 $x - c$，再用 $c$ 检验商式。余数为 $0$ 的除法次数就是重数。\n\n对 $p(x) = x^{4} - 5x^{3} + 6x^{2} + 4x - 8$ 和根 $2$：\n\n$$${synthetic([1, -5, 6, 4, -8], 2).latex}$$\n\n$$${synthetic([1, -3, 0, 4], 2).latex}$$\n\n$$${synthetic([1, -1, -2], 2).latex}$$\n\n$$${synthetic([1, 1], 2).latex}$$\n\n前三次余数为 $0$，第四次不是，所以 $p(x) = (x - 2)^{3}(x + 1)$，$2$ 是三重根。`,
      ),
      keyPrerequisites: ["factoring-quartic-polynomials-using-the-factor-theorem"],
      generate(rng) {
        for (;;) {
          const a = rng.nonZero(-3, 3);
          const kind = rng.pick(["cube", "square", "squareIrreducible"] as const);
          let cs: number[];
          let answer: number;
          if (kind === "cube") {
            const b = rng.nonZero(-5, 5);
            if (b === a) continue;
            cs = mulP([1, -a], [1, -a], [1, -a], [1, -b]);
            answer = 3;
          } else if (kind === "square") {
            const b = rng.nonZero(-5, 5);
            const c = rng.nonZero(-5, 5);
            if (new Set([a, b, c]).size < 3) continue;
            cs = mulP([1, -a], [1, -a], [1, -b], [1, -c]);
            answer = 2;
          } else {
            const quad = [1, rng.int(-3, 3), rng.nonZero(-6, 6)];
            if (!irreducible(quad[1]!, quad[2]!)) continue;
            cs = mulP([1, -a], [1, -a], quad);
            answer = 2;
          }
          const arrays: string[] = [];
          let cur: number[] = cs;
          for (;;) {
            const s = synthetic(cur, a);
            arrays.push(s.latex);
            if (s.remainder !== 0) break;
            cur = s.quotient;
          }
          return numberProblem({
            prompt: t(
              `$x = ${a}$ is a root of $p(x) = ${P(cs)}$. What is its multiplicity?`,
              `$x = ${a}$ 是 $p(x) = ${P(cs)}$ 的根。它是几重根？`,
            ),
            answer,
            wrong: [1, 4, answer === 3 ? 2 : 3],
            solution: t(
              `Divide by $${xm(a)}$ again and again until the remainder is not $0$:${arrays.map((l) => steps(l)).join("")}${answer} divisions leave remainder $0$, so $x = ${a}$ has multiplicity $${answer}$.`,
              `反复除以 $${xm(a)}$，直到余数不为 $0$：${arrays.map((l) => steps(l)).join("")}有 ${answer} 次除法余数为 $0$，所以 $x = ${a}$ 是 $${answer}$ 重根。`,
            ),
          });
        }
      },
    },
  ],
};

// ─── 2.7.7 The remainder theorem ────────────────────────────────────────────

/** remainderPrompt asks for the remainder of a division. */
const remainderPrompt = (cs: Coefs, div: string): Text =>
  t(`Find the remainder when $p(x) = ${P(cs)}$ is divided by $${div}$.`, `求 $p(x) = ${P(cs)}$ 除以 $${div}$ 的余数。`);

/** randomPoly draws a cubic or quartic with small coefficients. */
function randomPoly(rng: {
  int(a: number, b: number): number;
  pick<T>(xs: readonly T[]): T;
  nonZero(a: number, b: number): number;
}): number[] {
  const deg = rng.pick([3, 3, 4]);
  return [rng.pick([1, 1, 2, -1]), ...Array.from({ length: deg - 1 }, () => rng.int(-6, 6)), rng.nonZero(-9, 9)];
}

/** theRemainderTheorem finds remainders by evaluating. */
export const theRemainderTheorem: TopicDef = {
  id: "the-remainder-theorem",
  title: t("The Remainder Theorem", "余数定理"),
  summary: t(
    "The remainder when $p(x)$ is divided by $x - c$ is $p(c)$: find remainders by evaluating instead of dividing.",
    "$p(x)$ 除以 $x - c$ 的余数等于 $p(c)$：用求值代替除法来求余数。",
  ),
  prerequisites: ["the-factor-theorem"],
  encompasses: [
    { topic: "the-factor-theorem", weight: 0.4 },
    { topic: "dividing-polynomials-using-synthetic-division", weight: 0.3 },
    { topic: "evaluating-expressions", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSA.APR.B.2"],
  knowledgePoints: [
    {
      id: "evaluating-for-the-remainder",
      title: t("Remainders by evaluating", "用求值求余数"),
      explanation: t(
        "Since $p(x) = (x - c)q(x) + r$, substituting $x = c$ gives $p(c) = r$. This is the **remainder theorem**: the remainder of $p(x) \\div (x - c)$ is $p(c)$.\n\nThe remainder when $p(x) = x^{3} - 2x^{2} + 5$ is divided by $x - 3$ is\n\n$$p(3) = 27 - 18 + 5 = 14$$\n\nNo division is needed.",
        "因为 $p(x) = (x - c)q(x) + r$，代入 $x = c$ 得 $p(c) = r$。这就是**余数定理**：$p(x) \\div (x - c)$ 的余数是 $p(c)$。\n\n$p(x) = x^{3} - 2x^{2} + 5$ 除以 $x - 3$ 的余数是\n\n$$p(3) = 27 - 18 + 5 = 14$$\n\n不需要做除法。",
      ),
      generate(rng) {
        const cs = randomPoly(rng);
        const c = rng.nonZero(-3, 3);
        const v = evalI(cs, c);
        return numberProblem({
          prompt: remainderPrompt(cs, xm(c)),
          answer: v,
          wrong: [evalI(cs, -c), cs[cs.length - 1]!, -v],
          solution: t(
            `By the remainder theorem, the remainder is $p(${c})$:${steps(valueLine(cs, Q.of(c)))}`,
            `由余数定理，余数等于 $p(${c})$：${steps(valueLine(cs, Q.of(c)))}`,
          ),
        });
      },
    },
    {
      id: "dividing-by-x-plus-c",
      title: t("Dividing by x + c", "除以 x + c"),
      explanation: t(
        "Dividing by $x + c$ is dividing by $x - (-c)$, so the remainder is $p(-c)$.\n\nThe remainder when $p(x) = 2x^{3} + x - 4$ is divided by $x + 2$ is\n\n$$p(-2) = -16 - 2 - 4 = -22$$",
        "除以 $x + c$ 就是除以 $x - (-c)$，所以余数是 $p(-c)$。\n\n$p(x) = 2x^{3} + x - 4$ 除以 $x + 2$ 的余数是\n\n$$p(-2) = -16 - 2 - 4 = -22$$",
      ),
      generate(rng) {
        const cs = randomPoly(rng);
        const c = rng.int(1, 4);
        const v = evalI(cs, -c);
        return numberProblem({
          prompt: remainderPrompt(cs, linear(1, c)),
          answer: v,
          wrong: [evalI(cs, c), -v, cs[cs.length - 1]!],
          solution: t(
            `$${linear(1, c)} = x - (${-c})$, so by the remainder theorem the remainder is $p(${-c})$:${steps(valueLine(cs, Q.of(-c)))}`,
            `$${linear(1, c)} = x - (${-c})$，由余数定理，余数等于 $p(${-c})$：${steps(valueLine(cs, Q.of(-c)))}`,
          ),
        });
      },
    },
    {
      id: "an-unknown-coefficient",
      title: t("An unknown coefficient", "未知系数"),
      explanation: t(
        "A known remainder gives an equation for an unknown coefficient.\n\n$p(x) = x^{3} + kx - 4$ leaves the remainder $6$ when divided by $x - 2$:\n\n$$p(2) = 8 + 2k - 4 = 2k + 4 = 6 \\implies k = 1$$",
        "已知余数，就得到关于未知系数的方程。\n\n$p(x) = x^{3} + kx - 4$ 除以 $x - 2$ 余 $6$：\n\n$$p(2) = 8 + 2k - 4 = 2k + 4 = 6 \\implies k = 1$$",
      ),
      generate(rng) {
        const cs = [rng.pick([1, 1, 2]), rng.int(-5, 5), rng.int(-6, 6), rng.nonZero(-9, 9)];
        const idx = rng.pick([1, 2, 3]);
        cs[idx] = rng.nonZero(-6, 6);
        const c = rng.nonZero(-3, 3);
        const R = evalI(cs, c);
        const k = cs[idx]!;
        const div = xm(c);
        const wrong = [solveK(cs, idx, Q.of(-c), Q.of(R)), solveK(cs, idx, Q.of(c)), Q.of(-k)].filter((w): w is Q => w !== undefined);
        return numberProblem({
          prompt: t(
            `When $p(x) = ${polyWithK(cs, idx)}$ is divided by $${div}$, the remainder is $${R}$. Find $k$.`,
            `$p(x) = ${polyWithK(cs, idx)}$ 除以 $${div}$ 的余数是 $${R}$。求 $k$。`,
          ),
          answer: k,
          solveFor: "k",
          wrong,
          solution: kSolution(
            cs,
            idx,
            Q.of(c),
            Q.of(R),
            t(`By the remainder theorem, $p(${c}) = ${R}$.`, `由余数定理，$p(${c}) = ${R}$。`),
          ),
        });
      },
    },
  ],
};

// ─── 2.7.8 The rational roots theorem ───────────────────────────────────────

/** divisors lists the positive divisors of n ≠ 0. */
const divisors = (n: number) => Array.from({ length: Math.abs(n) }, (_, i) => i + 1).filter((d) => n % d === 0);

/** candidates lists the possible rational roots ±p/q of a polynomial with leading coefficient a and constant term d. */
function candidates(a: number, d: number): Q[] {
  const out: Q[] = [];
  for (const p of divisors(d)) {
    for (const q of divisors(a)) {
      for (const v of [Q.of(p, q), Q.of(-p, q)]) if (!out.some((o) => o.eq(v))) out.push(v);
    }
  }
  return out;
}

/** candidatesLatex writes ±p/q for the positive candidates in increasing order. */
function candidatesLatex(a: number, d: number): string {
  return candidates(a, d)
    .filter((v) => v.sign() > 0)
    .sort((x, y) => x.cmp(y))
    .map((v) => `\\pm ${v.toLatex()}`)
    .join(", \\; ");
}

/** theRationalRootsTheorem lists and tests the possible rational roots ±p/q. */
export const theRationalRootsTheorem: TopicDef = {
  id: "the-rational-roots-theorem",
  title: t("The Rational Roots Theorem", "有理根定理"),
  summary: t(
    "Every rational root of a polynomial with integer coefficients is $\\pm\\frac{p}{q}$, with $p$ dividing the constant term and $q$ dividing the leading coefficient.",
    "整系数多项式的每个有理根都形如 $\\pm\\frac{p}{q}$，其中 $p$ 整除常数项，$q$ 整除首项系数。",
  ),
  prerequisites: ["factoring-cubic-polynomials-using-the-factor-theorem"],
  encompasses: [{ topic: "factoring-cubic-polynomials-using-the-factor-theorem", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSA.APR.B.3"],
  knowledgePoints: [
    {
      id: "possible-rational-roots",
      title: t("Possible rational roots", "可能的有理根"),
      explanation: t(
        "The **rational roots theorem**: if a polynomial has integer coefficients, every rational root in lowest terms is $\\frac{p}{q}$ where $p$ divides the constant term and $q$ divides the leading coefficient.\n\nFor $2x^{3} + x^{2} - 7x - 6$: $p$ divides $6$, so $p \\in \\{1, 2, 3, 6\\}$; $q$ divides $2$, so $q \\in \\{1, 2\\}$. The possible rational roots are\n\n$$\\pm 1, \\; \\pm 2, \\; \\pm 3, \\; \\pm 6, \\; \\pm\\frac{1}{2}, \\; \\pm\\frac{3}{2}$$\n\nThe theorem lists candidates only; each must still be tested.",
        "**有理根定理**：若多项式的系数都是整数，则它的每个有理根写成最简分数后都是 $\\frac{p}{q}$，其中 $p$ 整除常数项，$q$ 整除首项系数。\n\n对 $2x^{3} + x^{2} - 7x - 6$：$p$ 整除 $6$，$p \\in \\{1, 2, 3, 6\\}$；$q$ 整除 $2$，$q \\in \\{1, 2\\}$。可能的有理根是\n\n$$\\pm 1, \\; \\pm 2, \\; \\pm 3, \\; \\pm 6, \\; \\pm\\frac{1}{2}, \\; \\pm\\frac{3}{2}$$\n\n定理只给出候选值，每个候选值仍需检验。",
      ),
      generate(rng) {
        for (;;) {
          const a = rng.pick([2, 3, 4, 6]);
          const d = rng.sign() * rng.pick([2, 3, 4, 5, 6, 8, 9, 10, 12]);
          const cs = [a, rng.int(-6, 6), rng.int(-6, 6), d];
          const cands = candidates(a, d);
          const isCand = (v: Q) => cands.some((o) => o.eq(v));
          const fractional = cands.filter((v) => !v.isInteger());
          const correct = rng.bool(0.6) && fractional.length > 0 ? rng.pick(fractional) : rng.pick(cands);
          const traps = [Q.of(a, Math.abs(d)), Q.of(-a, Math.abs(d)), Q.of(a), Q.of(Math.abs(d) * 2), Q.of(1, Math.abs(d))];
          const pool: Q[] = traps.filter((v) => !isCand(v));
          for (let i = 0; i < 20; i++) {
            const v = Q.of(rng.sign() * rng.int(1, 12), rng.int(1, 6));
            if (!isCand(v)) pool.push(v);
          }
          const distractors: Q[] = [];
          for (const v of rng.shuffle(pool)) if (!distractors.some((o) => o.eq(v)) && !v.eq(correct)) distractors.push(v);
          if (distractors.length < 3) continue;
          const options = rng.shuffle([correct, ...distractors.slice(0, 3)]);
          return choiceProblem({
            prompt: t(
              `By the rational roots theorem, which of these could be a rational root of $p(x) = ${P(cs)}$?`,
              `根据有理根定理，下列哪一个可能是 $p(x) = ${P(cs)}$ 的有理根？`,
            ),
            options: options.map((v) => same(`$${v.toLatex()}$`)),
            correct: options.findIndex((v) => v.eq(correct)),
            solution: t(
              `$p$ must divide the constant term $${d}$ and $q$ must divide the leading coefficient $${a}$, so the possible rational roots are${steps(candidatesLatex(a, d))}Of the options, only $${correct.toLatex()}$ is in this list.`,
              `$p$ 必须整除常数项 $${d}$，$q$ 必须整除首项系数 $${a}$，所以可能的有理根是${steps(candidatesLatex(a, d))}选项中只有 $${correct.toLatex()}$ 在其中。`,
            ),
          });
        }
      },
    },
    {
      id: "counting-candidates",
      title: t("Counting the candidates", "数候选值"),
      explanation: t(
        "List every $\\frac{p}{q}$, reduce it, and drop repeats: with constant term $4$ and leading coefficient $2$, the fractions $\\frac{2}{2}$ and $\\frac{4}{2}$ equal $1$ and $2$, which are already listed.\n\n$$p \\in \\{1, 2, 4\\}, \\; q \\in \\{1, 2\\}: \\quad \\pm 1, \\; \\pm 2, \\; \\pm 4, \\; \\pm\\frac{1}{2}$$\n\nThere are $8$ possible rational roots, not $2 \\cdot 3 \\cdot 2 = 12$.",
        "列出所有 $\\frac{p}{q}$，约分并去掉重复：常数项为 $4$、首项系数为 $2$ 时，$\\frac{2}{2}$ 和 $\\frac{4}{2}$ 等于 $1$ 和 $2$，已经列过了。\n\n$$p \\in \\{1, 2, 4\\}, \\; q \\in \\{1, 2\\}: \\quad \\pm 1, \\; \\pm 2, \\; \\pm 4, \\; \\pm\\frac{1}{2}$$\n\n共有 $8$ 个可能的有理根，而不是 $2 \\cdot 3 \\cdot 2 = 12$ 个。",
      ),
      generate(rng) {
        const a = rng.pick([1, 2, 3, 4, 6, 8, 9]);
        const d = rng.sign() * rng.pick([2, 3, 4, 5, 6, 8, 9, 10, 12, 15]);
        const cs = [a, rng.int(-6, 6), rng.int(-6, 6), d];
        const n = candidates(a, d).length;
        const naive = 2 * divisors(d).length * divisors(a).length;
        return numberProblem({
          prompt: t(
            `How many possible rational roots does the rational roots theorem give for $p(x) = ${P(cs)}$?`,
            `根据有理根定理，$p(x) = ${P(cs)}$ 有多少个可能的有理根？`,
          ),
          answer: n,
          wrong: [naive, n / 2, divisors(d).length * divisors(a).length],
          solution: t(
            `$p$ divides $${Math.abs(d)}$: $${divisors(d).join(", ")}$. $q$ divides $${a}$: $${divisors(a).join(", ")}$. The distinct values of $\\pm\\frac{p}{q}$ in lowest terms are${steps(candidatesLatex(a, d))}There are $${n}$ of them.`,
            `$p$ 整除 $${Math.abs(d)}$：$${divisors(d).join(", ")}$。$q$ 整除 $${a}$：$${divisors(a).join(", ")}$。约分后互不相同的 $\\pm\\frac{p}{q}$ 是${steps(candidatesLatex(a, d))}共 $${n}$ 个。`,
          ),
        });
      },
    },
    {
      id: "finding-rational-roots",
      title: t("Finding the rational roots", "求有理根"),
      explanation: t(
        "Test the candidates until one is a root, divide by the matching factor, and solve the quadratic that is left.\n\nFor $2x^{3} + x^{2} - 7x - 6$, the candidates are $\\pm 1, \\pm 2, \\pm 3, \\pm 6, \\pm\\frac{1}{2}, \\pm\\frac{3}{2}$. Testing gives $p(-1) = 0$, and dividing by $x + 1$ leaves $2x^{2} - x - 6 = (2x + 3)(x - 2)$:\n\n$$2x^{3} + x^{2} - 7x - 6 = (x + 1)(2x + 3)(x - 2)$$\n\nThe rational roots are $-1$, $-\\frac{3}{2}$ and $2$.",
        "逐个检验候选值，直到找到一个根，除以对应的因式，再解剩下的二次式。\n\n对 $2x^{3} + x^{2} - 7x - 6$，候选值是 $\\pm 1, \\pm 2, \\pm 3, \\pm 6, \\pm\\frac{1}{2}, \\pm\\frac{3}{2}$。检验得 $p(-1) = 0$，除以 $x + 1$ 剩下 $2x^{2} - x - 6 = (2x + 3)(x - 2)$：\n\n$$2x^{3} + x^{2} - 7x - 6 = (x + 1)(2x + 3)(x - 2)$$\n\n有理根是 $-1$、$-\\frac{3}{2}$ 和 $2$。",
      ),
      generate(rng) {
        for (;;) {
          const u = rng.int(2, 4);
          const v = rng.nonZero(-5, 5);
          if (gcd(u, v) !== 1) continue;
          const root = Q.of(v, u);
          let quad: number[];
          let others: number[];
          if (rng.bool(0.6)) {
            const r = rng.nonZero(-4, 4);
            const s = rng.nonZero(-4, 4);
            if (r === s) continue;
            quad = mulP([1, -r], [1, -s]);
            others = [r, s];
          } else {
            quad = [1, 0, rng.pick([-2, -3, -5, -6, -7, 1, 2, 3, 4, 5])];
            others = [];
          }
          const cs = mulP([u, -v], quad);
          const values = [root.toLatex(), ...others.map(String)];
          const div = longDivision(cs, [u, -v]);
          const quadStep =
            others.length === 2
              ? t(`$${P(quad)} = ${lf(1, -others[0]!)}${lf(1, -others[1]!)}$`, `$${P(quad)} = ${lf(1, -others[0]!)}${lf(1, -others[1]!)}$`)
              : t(`$${P(quad)} = 0$ has no rational solution`, `$${P(quad)} = 0$ 没有有理数解`);
          return solutionsProblem({
            prompt: t(`Find all the rational roots of $p(x) = ${P(cs)}$.`, `求 $p(x) = ${P(cs)}$ 的所有有理根。`),
            values,
            wrong: [[String(v), ...others.map(String)], [root.neg().toLatex(), ...others.map((o) => String(-o))], [root.toLatex()]].filter(
              (w) => w.length > 0,
            ),
            solution: t(
              `The candidates are $\\pm\\frac{p}{q}$ with $p$ dividing $${Math.abs(cs[3]!)}$ and $q$ dividing $${u}$. Testing them, $${valueLine(cs, root)}$, so $${linear(u, -v)}$ is a factor. Divide by it:${steps(div.latex)}What is left is $${P(quad)}$, and ${quadStep.en}. The rational roots are $${values.join(", ")}$.`,
              `候选值是 $\\pm\\frac{p}{q}$，其中 $p$ 整除 $${Math.abs(cs[3]!)}$，$q$ 整除 $${u}$。逐个检验，$${valueLine(cs, root)}$，所以 $${linear(u, -v)}$ 是因式。用它去除：${steps(div.latex)}剩下 $${P(quad)}$，并且${quadStep["zh-CN"]}。有理根是 $${values.join(", ")}$。`,
            ),
          });
        }
      },
    },
  ],
};

/** polynomialTheoremTopics are the Algebra II topics on dividing polynomials, polynomial equations and polynomial theorems, in outline order. */
export const polynomialTheoremTopics: readonly TopicDef[] = [
  dividingPolynomialsUsingSyntheticDivision,
  dividingPolynomialsByLinearBinomialsUsingLongDivision,
  dividingPolynomialsUsingLongDivision,
  dividingPolynomialsByManipulatingRationalExpressions,
  determiningTheRootsOfPolynomials,
  solvingPolynomialEquationsUsingTheGcf,
  solvingCubicEquationsByGrouping,
  solvingBiquadraticEquations,
  theFactorTheorem,
  determiningPolynomialCoefficientsUsingTheFactorTheorem,
  factoringCubicPolynomialsUsingTheFactorTheorem,
  factoringQuarticPolynomialsUsingTheFactorTheorem,
  multiplicitiesOfTheRootsOfPolynomials,
  findingMultiplicitiesOfTheRootsOfQuarticPolynomialsByFactoring,
  theRemainderTheorem,
  theRationalRootsTheorem,
];
