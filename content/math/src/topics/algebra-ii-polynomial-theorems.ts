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
import { chain, stepLabel } from "../solution-kit.ts";
import { reasoned } from "../wrong-reasons.ts";

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

/** parenQ writes a rational number, in parentheses when negative: "(-\frac{1}{2})". */
const parenQ = (v: Q) => (v.sign() < 0 ? `\\left(${v.toLatex()}\\right)` : v.toLatex());

/** termSum writes the terms of a polynomial evaluated at x as a sum: "8 - 12 + 4". */
function termSum(cs: Coefs, x: Q): string {
  const n = cs.length - 1;
  const terms = cs.flatMap((c, i) => (c === 0 ? [] : [Q.of(c).mul(x.pow(n - i))])).filter((v) => !v.isZero());
  if (terms.length === 0) return "0";
  return terms.map((v, i) => (i === 0 ? v.toLatex() : v.sign() < 0 ? ` - ${v.abs().toLatex()}` : ` + ${v.toLatex()}`)).join("");
}

/** atValue writes a polynomial evaluated at x: the substitution, the values of its terms and the value, without repeats. */
const atValue = (cs: Coefs, x: Q) => chain(substitute(cs, x.toLatex()), termSum(cs, x), evalQ(cs, x).toLatex());

/** FactorPower is a factor of a polynomial, by its coefficients, with its exponent. */
type FactorPower = readonly [Coefs, number];

/** checkPoint picks a small x at which none of the factors is zero. */
function checkPoint(factors: readonly Coefs[]): Q {
  for (const x of [2, -2, 3, -1, 1, 4, -3, 5, -4, 6]) if (factors.every((f) => !evalQ(f, Q.of(x)).isZero())) return Q.of(x);
  return Q.of(7);
}

/** factorCheck evaluates the expanded and the factored forms of a polynomial at a point where no factor is zero. */
function factorCheck(cs: Coefs, factors: readonly FactorPower[], lead = 1): Text {
  const x = checkPoint(factors.map(([f]) => f));
  let product = Q.of(lead);
  const shown = factors.map(([f, e]) => {
    const v = evalQ(f, x);
    product = product.mul(v.pow(e));
    return e === 1 ? parenQ(v) : `${parenQ(v)}^{${e}}`;
  });
  const V = evalQ(cs, x);
  if (!product.eq(V)) throw new RangeError("factorCheck: the factors do not multiply to the polynomial");
  const line = `${[...(lead === 1 ? [] : [parenQ(Q.of(lead))]), ...shown].join(" \\cdot ")} = ${V.toLatex()}`;
  return t(
    `**Check.** Evaluate both forms at $x = ${x.toLatex()}$. The expanded form gives $${atValue(cs, x)}$.\n\nThe factored form gives the same value: $${line}$.`,
    `**检验。** 在 $x = ${x.toLatex()}$ 处计算两种形式的值。展开式得 $${atValue(cs, x)}$。\n\n因式分解形式得到相同的值：$${line}$。`,
  );
}

/** rootCheck puts a solution back into an equation written as cs = 0. */
function rootCheck(cs: Coefs, x: Q): Text {
  const line = atValue(cs, x);
  return t(
    `**Check.** Put $x = ${x.toLatex()}$ back into the left side; it gives zero: $${line}$.`,
    `**检验。** 把 $x = ${x.toLatex()}$ 代回左边，结果为零：$${line}$。`,
  );
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

/** backCheck checks a division by multiplying the divisor by the quotient and adding the remainder. */
function backCheck(divisor: Coefs, quotient: Coefs, remainder: Coefs): Text {
  const m = divisor.length - 1;
  const partials = divisor
    .map((d, i) => (d === 0 ? "" : P([...quotient.map((q) => q * d), ...Array<number>(m - i).fill(0)])))
    .filter((s) => s !== "");
  const spread = `${partials[0]}${partials.slice(1).map(joinPoly).join("")}${joinPoly(P(remainder))}`;
  const line = chain(`(${P(divisor)})(${P(quotient)})${joinPoly(P(remainder))}`, spread, P(addP(mulP(divisor, quotient), remainder)));
  return t(
    `**Check.** Multiplying the divisor by the quotient and adding the remainder gives back the dividend: $${line}$.`,
    `**检验。** 用除式乘商再加上余数，得回被除式：$${line}$。`,
  );
}

/** syntheticSolution explains a synthetic division by x − c, step by step, and checks it by multiplying back. */
function syntheticSolution(dividend: Coefs, c: number, missing = false): Text {
  const s = synthetic(dividend, c);
  const s1 = stepLabel(1, "Set up", "列式");
  const s2 = stepLabel(2, "Bring down, multiply, add", "移下、相乘、相加");
  const s3 = stepLabel(3, "Read the answer", "读出结果");
  const coefs = dividend.join(", ");
  const id = steps(identity(dividend, [1, -c], s.quotient, [s.remainder]));
  const check = backCheck([1, -c], s.quotient, [s.remainder]);
  const en = [
    `${s1.en} ${c < 0 ? `Dividing by $${xm(c)}$ means dividing by $x - (${c})$, so $c = ${c}$.` : `Dividing by $${xm(c)}$ means $c = ${c}$.`} ${missing ? `Write $0$ for every missing power of $x$, so the coefficients are $${coefs}$.` : `The coefficients of the dividend are $${coefs}$.`}`,
    `${s2.en} Bring down the first coefficient. Then, column by column, multiply the last number of the bottom row by $${c}$, write the product under the next coefficient, and add:${steps(s.latex)}`,
    `${s3.en} The last number, $${s.remainder}$, is the remainder. The others are the coefficients of the quotient, which is one degree lower than the dividend: $${P(s.quotient)}$. So the division reads${id}`,
    check.en,
  ];
  const zh = [
    `${s1["zh-CN"]}${c < 0 ? `除以 $${xm(c)}$ 就是除以 $x - (${c})$，所以 $c = ${c}$。` : `除以 $${xm(c)}$，所以 $c = ${c}$。`}${missing ? `缺少的 $x$ 的幂用 $0$ 补上，系数依次是 $${coefs}$。` : `被除式的系数依次是 $${coefs}$。`}`,
    `${s2["zh-CN"]}把第一个系数移下来。然后逐列进行：用底行最后一个数乘以 $${c}$，把积写在下一个系数下面，再相加：${steps(s.latex)}`,
    `${s3["zh-CN"]}最后一个数 $${s.remainder}$ 是余数，其余的数是商的系数，商比被除式低一次：$${P(s.quotient)}$。所以${id}`,
    check["zh-CN"],
  ];
  return t(en.join("\n\n"), zh.join("\n\n"));
}

/** longSolution explains a long division, step by step, and checks it by multiplying back. */
function longSolution(dividend: Coefs, divisor: Coefs, missing = false): Text {
  const d = longDivision(dividend, divisor);
  const n = dividend.length - 1;
  const m = divisor.length - 1;
  const lead = poly([dividend[0]!, pw(n)]);
  const by = poly([divisor[0]!, pw(m)]);
  const first = poly([d.quotient[0]!, pw(n - m)]);
  const s1 = stepLabel(1, "Divide the leading terms", "首项相除");
  const s2 = stepLabel(2, "Multiply, subtract, repeat", "相乘、相减、重复");
  const s3 = stepLabel(3, "Read the answer", "读出结果");
  const id = steps(identity(dividend, divisor, d.quotient, d.remainder));
  const check = backCheck(divisor, d.quotient, d.remainder);
  const en = [
    `${s1.en} ${missing ? "Write every missing power of $x$ with coefficient $0$, so that like terms share a column. " : ""}The first term of the quotient is $${lead} \\div ${by} = ${first}$.`,
    `${s2.en} Multiply that term by $${P(divisor)}$ and subtract the product, changing the sign of each of its terms. Divide the leading term of what is left by $${by}$ again, and stop once what is left has degree less than $${m}$:${steps(d.latex)}`,
    `${s3.en} The quotient is $${P(d.quotient)}$ and the remainder is $${P(d.remainder)}$, so${id}`,
    check.en,
  ];
  const zh = [
    `${s1["zh-CN"]}${missing ? "缺少的 $x$ 的幂写成系数为 $0$ 的项，使同类项对齐在同一列。" : ""}商的第一项是 $${lead} \\div ${by} = ${first}$。`,
    `${s2["zh-CN"]}用这一项乘 $${P(divisor)}$，再减去这个积（积的每一项都要变号）。再用剩余部分的首项除以 $${by}$，直到剩余部分的次数低于 $${m}$：${steps(d.latex)}`,
    `${s3["zh-CN"]}商是 $${P(d.quotient)}$，余数是 $${P(d.remainder)}$，所以${id}`,
    check["zh-CN"],
  ];
  return t(en.join("\n\n"), zh.join("\n\n"));
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
  encompasses: [],
  xp: 15,
  standards: ["CCSS.HSA.APR.D.6"],
  intro: t(
    `Multiplying a polynomial by $x - c$ is a matter of expanding. Dividing undoes it, and the coefficients alone carry everything needed. Look at a product you can check by expanding:

$$(x - 3)(x^{2} + x - 2) = x^{3} - 2x^{2} - 5x + 6$$

Each coefficient of the product is the coefficient of $x^{2} + x - 2$ in that place minus $3$ times the one before it: $1$, then $1 - 3 \\cdot 1 = -2$, then $-2 - 3 \\cdot 1 = -5$, then $0 - 3 \\cdot (-2) = 6$.

Run this backwards. Start from the coefficients $1, -2, -5, 6$ of the product. Each coefficient of the quotient is the next coefficient of the dividend **plus** $3$ times the coefficient just found:

$$1, \\quad -2 + 3 \\cdot 1 = 1, \\quad -5 + 3 \\cdot 1 = -2, \\quad 6 + 3 \\cdot (-2) = 0$$

The first three numbers, $1, 1, -2$, are the coefficients of the quotient $x^{2} + x - 2$, and the last one, $0$, is the remainder. **Synthetic division** sets out this calculation in a table: bring down, multiply by $c$, add. In this lesson we use it to find quotients and remainders, also when a power of $x$ is missing.`,
    `把多项式乘以 $x - c$，只要展开即可。除法把乘法还原，而且只用系数就够了。看一个可以展开验证的乘积：

$$(x - 3)(x^{2} + x - 2) = x^{3} - 2x^{2} - 5x + 6$$

乘积的每个系数，等于 $x^{2} + x - 2$ 在该位置的系数减去前一个系数的 $3$ 倍：$1$，然后 $1 - 3 \\cdot 1 = -2$，再 $-2 - 3 \\cdot 1 = -5$，最后 $0 - 3 \\cdot (-2) = 6$。

把这个过程倒过来。从乘积的系数 $1, -2, -5, 6$ 出发，商的每个系数等于被除式的下一个系数**加上**刚求出的系数的 $3$ 倍：

$$1, \\quad -2 + 3 \\cdot 1 = 1, \\quad -5 + 3 \\cdot 1 = -2, \\quad 6 + 3 \\cdot (-2) = 0$$

前三个数 $1, 1, -2$ 是商 $x^{2} + x - 2$ 的系数，最后一个数 $0$ 是余数。**综合除法**就是把这个计算排成表格：移下、乘以 $c$、相加。本课用它求商和余数，包括缺少某些 $x$ 的幂的情形。`,
  ),
  knowledgePoints: [
    {
      id: "dividing-without-a-remainder",
      title: t("Synthetic division", "综合除法"),
      explanation: t(
        `**Synthetic division** is a short way to divide a polynomial by $x - c$. Write $c$ in the box and the coefficients of the dividend in a row. Bring down the first coefficient; then repeatedly multiply the last number of the bottom row by $c$, write the product under the next coefficient, and add.\n\nTo divide $x^{3} - 4x^{2} + x + 6$ by $x - 2$, use $c = 2$:\n\n$$${exSynthetic}$$\n\nThe last number, $0$, is the remainder. The others are the coefficients of the quotient, whose degree is one less than that of the dividend:\n\n$$x^{3} - 4x^{2} + x + 6 = (x - 2)(x^{2} - 2x - 3)$$\n\nThe bottom row adds $c$ times the previous number because multiplying by $x - c$ subtracted $c$ times it; adding puts it back.\n\n> **Watch out.** For $x - 2$ the box holds $2$, not $-2$: it is the number that makes $x - c$ zero. And the quotient is one degree lower than the dividend, so the last number is the remainder, not another coefficient; do not copy the dividend's coefficients either.`,
        `**综合除法**是把多项式除以 $x - c$ 的简便方法。把 $c$ 写在框里，被除式的系数写成一行。先把第一个系数移下来，然后反复地：用底行最后一个数乘以 $c$，把积写在下一个系数下面，再相加。\n\n计算 $x^{3} - 4x^{2} + x + 6$ 除以 $x - 2$，取 $c = 2$：\n\n$$${exSynthetic}$$\n\n最后一个数 $0$ 是余数，其余的数是商的系数，商的次数比被除式低一次：\n\n$$x^{3} - 4x^{2} + x + 6 = (x - 2)(x^{2} - 2x - 3)$$\n\n底行要加上前一个数的 $c$ 倍，是因为乘以 $x - c$ 时减去了它的 $c$ 倍；加回来就还原了。\n\n> **注意。** 除以 $x - 2$ 时框里写 $2$ 而不是 $-2$：它是使 $x - c$ 等于零的数。商比被除式低一次，所以最后一个数是余数，不是商的系数；也不要照抄被除式的系数。`,
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
        `When the last number of the bottom row is not $0$, it is the **remainder** $r$, and $p(x) = (x - c)q(x) + r$.\n\nTo divide by $x + 2$, write it as $x - (-2)$ and use $c = -2$. Dividing $2x^{3} + 3x^{2} - 5x + 4$ by $x + 2$:\n\n$$${exSyntheticRemainder}$$\n\nThe quotient is $2x^{2} - x - 3$ and the remainder is $10$:\n\n$$2x^{3} + 3x^{2} - 5x + 4 = (x + 2)(2x^{2} - x - 3) + 10$$\n\n> **Watch out.** For $x + 2$ the box holds $-2$. The remainder is the last number of the bottom row, not the constant term of the dividend, and it does not belong in the quotient.`,
        `当底行最后一个数不是 $0$ 时，它就是**余数** $r$，并且 $p(x) = (x - c)q(x) + r$。\n\n除以 $x + 2$ 时，把它写成 $x - (-2)$，取 $c = -2$。计算 $2x^{3} + 3x^{2} - 5x + 4$ 除以 $x + 2$：\n\n$$${exSyntheticRemainder}$$\n\n商是 $2x^{2} - x - 3$，余数是 $10$：\n\n$$2x^{3} + 3x^{2} - 5x + 4 = (x + 2)(2x^{2} - x - 3) + 10$$\n\n> **注意。** 除以 $x + 2$ 时框里写 $-2$。余数是底行的最后一个数，不是被除式的常数项，也不能写进商里。`,
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
        `Every power of $x$ needs a column. When a power is missing from the dividend, write $0$ as its coefficient, or the columns shift and the answer is wrong.\n\nTo divide $x^{3} - 7x - 6$ by $x + 1$, write the coefficients as $1, 0, -7, -6$:\n\n$$${exSyntheticMissing}$$\n\nThe quotient is $x^{2} - x - 6$ and the remainder is $0$.\n\n> **Watch out.** Skipping a missing power instead of writing $0$ shifts every later column one place, so both the quotient and the remainder come out wrong.`,
        `每个 $x$ 的幂都要占一列。被除式缺少某个幂时，要把它的系数写成 $0$，否则各列会错位，结果就错了。\n\n计算 $x^{3} - 7x - 6$ 除以 $x + 1$，把系数写成 $1, 0, -7, -6$：\n\n$$${exSyntheticMissing}$$\n\n商是 $x^{2} - x - 6$，余数是 $0$。\n\n> **注意。** 缺少的幂如果跳过而不写 $0$，后面每一列都会错位，商和余数都会算错。`,
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
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSA.APR.D.6"],
  intro: t(
    `Synthetic division only divides by $x - c$. To divide by $2x + 1$, or to see every term as it is subtracted, use **long division**. It works like long division of numbers: to divide $693$ by $3$, you find how many $3$s fit into the leading digit, multiply, subtract, and carry on with what is left.

Divide $2x^{2} + 7x + 3$ by $x + 3$. The leading term $2x^{2}$ divided by $x$ is $2x$, the first term of the quotient. Multiply it by the divisor and subtract:

$$2x^{2} + 7x + 3 - 2x(x + 3) = x + 3$$

Now $x \\div x = 1$, and taking away $1 \\cdot (x + 3)$ leaves $0$. So the quotient is $2x + 1$ and the remainder is $0$, which means $2x^{2} + 7x + 3 = (x + 3)(2x + 1)$.

Each round removes the leading term, so the degree of what is left keeps dropping. Once it is lower than the degree of the divisor, what is left is the remainder. In this lesson we divide by $x + b$ and by $ax + b$, with and without a remainder.`,
    `综合除法只能除以 $x - c$。要除以 $2x + 1$，或者想看清每一项是怎样减掉的，就用**长除法**。它和数的长除法一样：计算 $693$ 除以 $3$ 时，先看首位里有几个 $3$，相乘，相减，再对剩下的部分继续。

计算 $2x^{2} + 7x + 3$ 除以 $x + 3$。首项 $2x^{2}$ 除以 $x$ 得 $2x$，这是商的第一项。用它乘除式，再相减：

$$2x^{2} + 7x + 3 - 2x(x + 3) = x + 3$$

接着 $x \\div x = 1$，减去 $1 \\cdot (x + 3)$ 后剩下 $0$。所以商是 $2x + 1$，余数是 $0$，即 $2x^{2} + 7x + 3 = (x + 3)(2x + 1)$。

每一轮都消去首项，所以剩余部分的次数不断降低。一旦它低于除式的次数，剩下的就是余数。本课学习除以 $x + b$ 和 $ax + b$，包括有余数和没有余数的情形。`,
  ),
  knowledgePoints: [
    {
      id: "monic-divisor",
      title: t("Long division by x + b", "除以 x + b 的长除法"),
      explanation: t(
        `Polynomial **long division** works like long division of numbers. Divide the leading term of what is left by the leading term of the divisor, write the result in the quotient, multiply it by the divisor, and subtract. Repeat until what is left has a lower degree than the divisor.\n\nDividing $x^{3} + x^{2} - 7x + 2$ by $x - 2$:\n\n$$${exLong}$$\n\nFirst $x^{3} \\div x = x^{2}$, then $3x^{2} \\div x = 3x$, then $-x \\div x = -1$. The remainder is $0$, so the quotient is $x^{2} + 3x - 1$.\n\n> **Watch out.** Subtracting the product changes the sign of each of its terms: $x^{3} + x^{2} - (x^{3} - 2x^{2}) = 3x^{2}$, not $-x^{2}$. One sign slip there changes every later term of the quotient.`,
        `多项式**长除法**和数的长除法一样：用剩余部分的首项除以除式的首项，把结果写进商，再用它乘除式，然后相减。重复下去，直到剩余部分的次数低于除式。\n\n计算 $x^{3} + x^{2} - 7x + 2$ 除以 $x - 2$：\n\n$$${exLong}$$\n\n先算 $x^{3} \\div x = x^{2}$，再算 $3x^{2} \\div x = 3x$，最后 $-x \\div x = -1$。余数为 $0$，所以商是 $x^{2} + 3x - 1$。\n\n> **注意。** 减去乘积时，乘积的每一项都要变号：$x^{3} + x^{2} - (x^{3} - 2x^{2}) = 3x^{2}$，而不是 $-x^{2}$。这里错一个符号，商后面的每一项都会错。`,
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
        `When the last subtraction leaves a nonzero constant, it is the remainder. Missing powers get a $0$ placeholder so that like terms stay in the same column.\n\nDividing $2x^{3} - 3x^{2} + 4$ by $x + 1$:\n\n$$${exLongRemainder}$$\n\nThe quotient is $2x^{2} - 5x + 5$ and the last line gives the remainder $-1$:\n\n$$2x^{3} - 3x^{2} + 4 = (x + 1)(2x^{2} - 5x + 5) - 1$$\n\n> **Watch out.** The remainder is what the last subtraction leaves, not the constant term of the dividend. It stays apart from the quotient; do not add it to the quotient's last term.`,
        `最后一次相减剩下的非零常数就是余数。缺少的幂用 $0$ 占位，使同类项对齐在同一列。\n\n计算 $2x^{3} - 3x^{2} + 4$ 除以 $x + 1$：\n\n$$${exLongRemainder}$$\n\n商是 $2x^{2} - 5x + 5$，最后一行给出余数 $-1$：\n\n$$2x^{3} - 3x^{2} + 4 = (x + 1)(2x^{2} - 5x + 5) - 1$$\n\n> **注意。** 余数是最后一次相减剩下的部分，不是被除式的常数项。它和商分开写，不要把它加到商的最后一项上。`,
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
        `Long division also works for a divisor such as $2x + 1$, where synthetic division does not apply directly. Divide each leading term by $2x$:\n\n$$${exLongLeading}$$\n\n$6x^{3} \\div 2x = 3x^{2}$, $2x^{2} \\div 2x = x$, $-6x \\div 2x = -3$. The quotient is $3x^{2} + x - 3$ and the remainder is $5$.\n\n> **Watch out.** Divide each leading term by $2x$, not by $x$: dividing by $x$ makes every term of the quotient twice too large. Synthetic division with $c = -1$ does not divide by $2x + 1$, whose root is $-\\frac{1}{2}$.`,
        `对 $2x + 1$ 这样的除式，综合除法不能直接使用，长除法仍然适用。每一步都用首项除以 $2x$：\n\n$$${exLongLeading}$$\n\n$6x^{3} \\div 2x = 3x^{2}$，$2x^{2} \\div 2x = x$，$-6x \\div 2x = -3$。商是 $3x^{2} + x - 3$，余数是 $5$。\n\n> **注意。** 每个首项都要除以 $2x$，而不是 $x$：除以 $x$ 会使商的每一项都大一倍。取 $c = -1$ 做综合除法也不是除以 $2x + 1$，它的根是 $-\\frac{1}{2}$。`,
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
  encompasses: [{ topic: "dividing-polynomials-by-linear-binomials-using-long-division", weight: 0.6 }],
  xp: 17,
  standards: ["CCSS.HSA.APR.D.6"],
  intro: t(
    `Long division by $x + b$ removes the leading term at each round until a constant is left. The same rounds work for any divisor: divide the leading terms, multiply, subtract. Only the stopping point changes, because the division ends when what is left has a lower degree than the divisor.

Divide $x^{3} + 2x^{2} + 3x + 4$ by $x^{2} + 1$. First $x^{3} \\div x^{2} = x$, and subtracting $x(x^{2} + 1) = x^{3} + x$ leaves $2x^{2} + 2x + 4$. Next $2x^{2} \\div x^{2} = 2$, and subtracting $2(x^{2} + 1)$ leaves $2x + 2$. This has degree $1$, lower than $2$, so it is the remainder:

$$x^{3} + 2x^{2} + 3x + 4 = (x^{2} + 1)(x + 2) + 2x + 2$$

Expanding the right side gives $x^{3} + 2x^{2} + x + 2 + 2x + 2$, which is the dividend. In this lesson we divide by quadratics, with remainders that can be linear, and with powers missing from the dividend or the divisor.`,
    `除以 $x + b$ 的长除法每一轮消去首项，直到只剩一个常数。同样的步骤对任何除式都适用：首项相除、相乘、相减。只是停止的时机不同：剩余部分的次数低于除式时，除法结束。

计算 $x^{3} + 2x^{2} + 3x + 4$ 除以 $x^{2} + 1$。先算 $x^{3} \\div x^{2} = x$，减去 $x(x^{2} + 1) = x^{3} + x$，剩下 $2x^{2} + 2x + 4$。再算 $2x^{2} \\div x^{2} = 2$，减去 $2(x^{2} + 1)$，剩下 $2x + 2$。它的次数是 $1$，低于 $2$，所以它就是余式：

$$x^{3} + 2x^{2} + 3x + 4 = (x^{2} + 1)(x + 2) + 2x + 2$$

把右边展开得 $x^{3} + 2x^{2} + x + 2 + 2x + 2$，正是被除式。本课学习除以二次式，余式可以是一次式，被除式或除式也可能缺项。`,
  ),
  knowledgePoints: [
    {
      id: "by-a-quadratic",
      title: t("Dividing by a quadratic", "除以二次式"),
      explanation: t(
        `Dividing by a quadratic follows the same steps; each product now has three terms. Dividing $x^{4} + 3x^{3} + x^{2} - x - 4$ by $x^{2} + 2x - 1$:\n\n$$${exLongQuadratic}$$\n\nStop when what is left has degree less than $2$. The quotient is $x^{2} + x$ and the remainder is $-4$.\n\n> **Watch out.** Each product now has three terms, and subtracting changes the sign of all three. The quotient is not the dividend with its last terms dropped: its degree is $2$ less than the dividend's, and each coefficient comes from a division.`,
        `除以二次式的步骤相同，只是每次的乘积有三项。计算 $x^{4} + 3x^{3} + x^{2} - x - 4$ 除以 $x^{2} + 2x - 1$：\n\n$$${exLongQuadratic}$$\n\n当剩余部分的次数低于 $2$ 时停止。商是 $x^{2} + x$，余数是 $-4$。\n\n> **注意。** 现在每个乘积有三项，相减时三项都要变号。商也不是把被除式的后几项去掉：它的次数比被除式低 $2$，每个系数都要由除法得出。`,
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
        `When the divisor is quadratic, the remainder can be linear: the division stops as soon as what is left has degree less than $2$. Dividing $2x^{3} + x^{2} + 3x + 5$ by $x^{2} + 2$:\n\n$$${exLongQuadraticRemainder}$$\n\nThe quotient is $2x + 1$ and the remainder is $-x + 3$:\n\n$$2x^{3} + x^{2} + 3x + 5 = (x^{2} + 2)(2x + 1) - x + 3$$\n\n> **Watch out.** Keep both terms of a linear remainder, with the signs the last subtraction leaves: here $-x + 3$, not $x - 3$, $-x - 3$ or just $3$.`,
        `除式是二次式时，余式可以是一次式：剩余部分的次数一旦低于 $2$，除法就停止。计算 $2x^{3} + x^{2} + 3x + 5$ 除以 $x^{2} + 2$：\n\n$$${exLongQuadraticRemainder}$$\n\n商是 $2x + 1$，余式是 $-x + 3$：\n\n$$2x^{3} + x^{2} + 3x + 5 = (x^{2} + 2)(2x + 1) - x + 3$$\n\n> **注意。** 一次余式的两项都要保留，符号以最后一次相减的结果为准：这里是 $-x + 3$，不是 $x - 3$、$-x - 3$，也不只是 $3$。`,
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
        `Write every missing power with coefficient $0$, in the dividend and in the divisor, so that the columns line up. Dividing $x^{4} - 16$ by $x^{2} + 4$:\n\n$$${exLongMissing}$$\n\nThe quotient is $x^{2} - 4$ and the remainder is $0$.\n\n> **Watch out.** Without the $0$ placeholders, the terms of each product are subtracted from the wrong powers, and the quotient and remainder come out wrong.`,
        `被除式和除式中缺少的幂都要写成系数为 $0$ 的项，使各列对齐。计算 $x^{4} - 16$ 除以 $x^{2} + 4$：\n\n$$${exLongMissing}$$\n\n商是 $x^{2} - 4$，余数是 $0$。\n\n> **注意。** 不写 $0$ 占位，乘积的各项就会从错误的幂中减去，商和余数都会算错。`,
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
  const grouped = `(${P(div)})(${P(w.quotient)})${joinPoly(R)}`;
  const work = steps(`${P(N)} = ${w.lines[0]}`, ...w.lines.slice(1).map((l) => `= ${l}`), `= ${grouped}`);
  const split = steps(`\\frac{${P(N)}}{${P(div)}} = \\frac{${grouped}}{${P(div)}} = ${P(w.quotient)}${tail}`);
  const x = checkPoint([div]);
  const [Nv, dv, qv, Rv] = [N, div, w.quotient, w.remainder].map((cs) => evalQ(cs, x)) as [Q, Q, Q, Q];
  const left = `${Nv.toLatex()} \\div ${parenQ(dv)} = ${Nv.div(dv).toLatex()}`;
  const right = `${qv.toLatex()} + ${parenQ(Rv)} \\div ${parenQ(dv)} = ${qv.add(Rv.div(dv)).toLatex()}`;
  const s1 = stepLabel(1, "Take out multiples of the denominator", "提出分母的倍数");
  const s2 = stepLabel(2, "Split the fraction", "拆开分式");
  return t(
    [
      `${s1.en} Starting with the highest power, take multiples of $${P(div)}$ out of the numerator, subtracting each one, until what is left has a lower degree than $${P(div)}$:${work}`,
      `${s2.en} The multiple of the denominator divides out, and what is left stays over the denominator:${split}`,
      `**Check.** Put $x = ${x.toLatex()}$ into both sides. The left side gives $${left}$.\n\nThe right side gives the same: $${right}$.`,
    ].join("\n\n"),
    [
      `${s1["zh-CN"]}从最高次幂开始，从分子中逐个提出 $${P(div)}$ 的倍数（每提出一个就减去它），直到剩下部分的次数低于 $${P(div)}$：${work}`,
      `${s2["zh-CN"]}分母的倍数与分母约去，剩下的部分仍写在分母上：${split}`,
      `**检验。** 两边都代入 $x = ${x.toLatex()}$。左边得 $${left}$。\n\n右边得到相同的值：$${right}$。`,
    ].join("\n\n"),
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
  encompasses: [{ topic: "splitting-rational-expressions-into-terms", weight: 0.5 }],
  xp: 15,
  standards: ["CCSS.HSA.APR.D.6"],
  intro: t(
    `A fraction whose numerator is a sum splits into one fraction per term: $\\frac{a + b}{c} = \\frac{a}{c} + \\frac{b}{c}$. With numbers, this is how $\\frac{17}{5}$ becomes a mixed number: write $17 = 3 \\cdot 5 + 2$, so $\\frac{17}{5} = 3 + \\frac{2}{5}$.

The same idea divides polynomials. Rewrite the numerator as a multiple of the denominator plus what is left, then split. For $\\frac{x^{2} + 4x + 1}{x + 1}$, take out $x(x + 1) = x^{2} + x$, which leaves $3x + 1$; then take out $3(x + 1) = 3x + 3$, which leaves $-2$:

$$x^{2} + 4x + 1 = x(x + 1) + 3(x + 1) - 2 = (x + 1)(x + 3) - 2$$

Splitting the fraction cancels the multiple of the denominator:

$$\\frac{x^{2} + 4x + 1}{x + 1} = x + 3 - \\frac{2}{x + 1}$$

This is the result of long division, written without the table. In this lesson we rewrite quadratic and cubic numerators over a binomial, and over a quadratic.`,
    `分子是和的分式，可以按项拆成几个分式：$\\frac{a + b}{c} = \\frac{a}{c} + \\frac{b}{c}$。对数来说，$\\frac{17}{5}$ 就是这样化成带分数的：写成 $17 = 3 \\cdot 5 + 2$，所以 $\\frac{17}{5} = 3 + \\frac{2}{5}$。

同样的想法可以用来做多项式除法：把分子改写成分母的倍数加上剩下的部分，再拆开。对 $\\frac{x^{2} + 4x + 1}{x + 1}$，先提出 $x(x + 1) = x^{2} + x$，剩下 $3x + 1$；再提出 $3(x + 1) = 3x + 3$，剩下 $-2$：

$$x^{2} + 4x + 1 = x(x + 1) + 3(x + 1) - 2 = (x + 1)(x + 3) - 2$$

拆开分式时，分母的倍数与分母约去：

$$\\frac{x^{2} + 4x + 1}{x + 1} = x + 3 - \\frac{2}{x + 1}$$

这正是长除法的结果，只是不用列表格。本课学习分子是二次式、三次式，分母是二项式或二次式的情形。`,
  ),
  knowledgePoints: [
    {
      id: "quadratic-over-a-binomial",
      title: t("A quadratic over a binomial", "二次式除以二项式"),
      explanation: t(
        "Write the numerator as a multiple of the denominator plus what is left, one power at a time:\n\n$$x^{2} + 5x + 7 = x(x + 2) + 3x + 7 = x(x + 2) + 3(x + 2) + 1$$\n\nHere $x(x + 2) = x^{2} + 2x$ leaves $3x + 7$, and $3(x + 2) = 3x + 6$ leaves $1$. Splitting the fraction:\n\n$$\\frac{x^{2} + 5x + 7}{x + 2} = \\frac{(x + 3)(x + 2) + 1}{x + 2} = x + 3 + \\frac{1}{x + 2}$$\n\n> **Watch out.** Each multiple of the denominator is subtracted from the numerator: taking $x^{2} + 2x$ out of $x^{2} + 5x + 7$ leaves $3x + 7$, not $7x + 7$. And $r$ is what is left at the very end, here $1$, not the constant term $7$ of the numerator.",
        "逐个幂次地把分子写成分母的倍数加上剩下的部分：\n\n$$x^{2} + 5x + 7 = x(x + 2) + 3x + 7 = x(x + 2) + 3(x + 2) + 1$$\n\n这里 $x(x + 2) = x^{2} + 2x$，剩下 $3x + 7$；$3(x + 2) = 3x + 6$，剩下 $1$。拆开分式：\n\n$$\\frac{x^{2} + 5x + 7}{x + 2} = \\frac{(x + 3)(x + 2) + 1}{x + 2} = x + 3 + \\frac{1}{x + 2}$$\n\n> **注意。** 分母的每个倍数都要从分子中减去：从 $x^{2} + 5x + 7$ 中提出 $x^{2} + 2x$，剩下 $3x + 7$，而不是 $7x + 7$。$r$ 是最后剩下的部分，这里是 $1$，不是分子的常数项 $7$。",
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
        "For a cubic numerator, take out multiples of the denominator three times, starting with the highest power:\n\n$$x^{3} - 2x^{2} + 4 = x^{2}(x - 1) - x^{2} + 4 = x^{2}(x - 1) - x(x - 1) - x + 4$$\n\n$$= x^{2}(x - 1) - x(x - 1) - (x - 1) + 3 = (x - 1)(x^{2} - x - 1) + 3$$\n\nSo $\\frac{x^{3} - 2x^{2} + 4}{x - 1} = x^{2} - x - 1 + \\frac{3}{x - 1}$: the quotient is $q(x) = x^{2} - x - 1$ and the remainder is $3$.\n\n> **Watch out.** For the denominator $x - 1$, every step takes out a multiple of $x - 1$, not of $x + 1$. The remainder $3$ belongs in the fraction, not in $q(x)$, and $q(x)$ is one degree lower than the numerator.",
        "分子是三次式时，从最高次幂开始，分三次提出分母的倍数：\n\n$$x^{3} - 2x^{2} + 4 = x^{2}(x - 1) - x^{2} + 4 = x^{2}(x - 1) - x(x - 1) - x + 4$$\n\n$$= x^{2}(x - 1) - x(x - 1) - (x - 1) + 3 = (x - 1)(x^{2} - x - 1) + 3$$\n\n所以 $\\frac{x^{3} - 2x^{2} + 4}{x - 1} = x^{2} - x - 1 + \\frac{3}{x - 1}$：商 $q(x) = x^{2} - x - 1$，余数为 $3$。\n\n> **注意。** 分母是 $x - 1$ 时，每一步提出的都是 $x - 1$ 的倍数，而不是 $x + 1$ 的倍数。余数 $3$ 写在分式里，不属于 $q(x)$；$q(x)$ 比分子低一次。",
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
        "With a quadratic denominator, the part left over can be linear. To divide $2x^{3} + x^{2} + 3x + 5$ by $x^{2} + 2$:\n\n$$2x^{3} + x^{2} + 3x + 5 = 2x(x^{2} + 2) + x^{2} - x + 5 = 2x(x^{2} + 2) + (x^{2} + 2) - x + 3$$\n\nSo\n\n$$\\frac{2x^{3} + x^{2} + 3x + 5}{x^{2} + 2} = 2x + 1 + \\frac{-x + 3}{x^{2} + 2}$$\n\nThe numerator of the remaining fraction, $R(x) = -x + 3$, has a lower degree than the denominator.\n\n> **Watch out.** $R(x)$ is everything left after the last multiple is taken out, here both $-x$ and $3$, each with its sign; it is not just the constant $3$.",
        "分母是二次式时，剩下的部分可以是一次式。计算 $2x^{3} + x^{2} + 3x + 5$ 除以 $x^{2} + 2$：\n\n$$2x^{3} + x^{2} + 3x + 5 = 2x(x^{2} + 2) + x^{2} - x + 5 = 2x(x^{2} + 2) + (x^{2} + 2) - x + 3$$\n\n所以\n\n$$\\frac{2x^{3} + x^{2} + 3x + 5}{x^{2} + 2} = 2x + 1 + \\frac{-x + 3}{x^{2} + 2}$$\n\n剩下分式的分子 $R(x) = -x + 3$ 的次数低于分母。\n\n> **注意。** $R(x)$ 是提出最后一个倍数后剩下的全部，这里既有 $-x$ 也有 $3$，各带各的符号；它不只是常数 $3$。",
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

/** zeroAt writes a factored polynomial at one of its roots: the constant, the value of each factor, one of them 0, and the product 0. */
function zeroAt(lead: number, factors: readonly Coefs[], x: Q): string {
  const vals = factors.map((f) => parenQ(evalQ(f, x)));
  return `p\\left(${x.toLatex()}\\right) = ${[...(lead === 1 ? [] : [parenQ(Q.of(lead))]), ...vals].join(" \\cdot ")} = 0`;
}

/** zeroCheck checks a root of a factored polynomial: its own factor is zero there, so the product is. */
function zeroCheck(lead: number, factors: readonly Coefs[], x: Q, factor: string): Text {
  const line = zeroAt(lead, factors, x);
  return t(
    `**Check.** At $x = ${x.toLatex()}$ the factor $${factor}$ is zero, so the whole product is zero: $${line}$.`,
    `**检验。** 在 $x = ${x.toLatex()}$ 处，因式 $${factor}$ 等于零，所以整个乘积为零：$${line}$。`,
  );
}

/** determiningTheRootsOfPolynomials finds the roots of factored polynomials. */
export const determiningTheRootsOfPolynomials: TopicDef = {
  id: "determining-the-roots-of-polynomials",
  title: t("Determining the Roots of Polynomials", "求多项式的根"),
  summary: t(
    "Find the roots of a polynomial in factored form by setting each factor equal to zero.",
    "令因式分解形式中的每个因式等于零，求多项式的根。",
  ),
  prerequisites: ["roots-of-a-function", "solving-quadratic-equations-using-a-difference-of-squares"],
  encompasses: [{ topic: "zero-product-rule", weight: 0.6 }],
  xp: 12,
  standards: ["CCSS.HSA.APR.B.3"],
  intro: t(
    `A root of a function is an input where its value is $0$, a place where its graph meets the $x$-axis. For a polynomial in factored form, the roots can be read off without expanding, because of one fact about numbers: a product is $0$ exactly when one of its factors is $0$.

Take $p(x) = (x + 2)(x - 6)$. At $x = 6$ the second factor is $0$, so $p(6) = 8 \\cdot 0 = 0$. At $x = 1$ neither factor is $0$, and $p(1) = 3 \\cdot (-5) = -15$. Two nonzero numbers never multiply to $0$, so the only roots are the values that make a factor zero:

$$x + 2 = 0 \\implies x = -2, \\qquad x - 6 = 0 \\implies x = 6$$

So each factor contributes its own root, and finding the roots of a factored polynomial means solving one small equation per factor. In this lesson we do this for factors like $x - 3$, for factors with a coefficient like $2x - 3$, and for quadratic factors like $x^{2} - 9$ and $x^{2} + 4$.`,
    `函数的根是使函数值为 $0$ 的输入，也就是图像与 $x$ 轴相交的地方。对于因式分解形式的多项式，不必展开就能读出根，因为数有这样一个性质：乘积为 $0$，当且仅当某个因数为 $0$。

看 $p(x) = (x + 2)(x - 6)$。在 $x = 6$ 处第二个因式为 $0$，所以 $p(6) = 8 \\cdot 0 = 0$。在 $x = 1$ 处两个因式都不为 $0$，$p(1) = 3 \\cdot (-5) = -15$。两个非零的数相乘永远不会得 $0$，所以根只能是使某个因式为零的值：

$$x + 2 = 0 \\implies x = -2, \\qquad x - 6 = 0 \\implies x = 6$$

所以每个因式各给出自己的根，求因式分解形式的多项式的根，就是对每个因式解一个小方程。本课处理 $x - 3$ 这样的因式、$2x - 3$ 这样带系数的因式，以及 $x^{2} - 9$、$x^{2} + 4$ 这样的二次因式。`,
  ),
  knowledgePoints: [
    {
      id: "linear-factors",
      title: t("Monic linear factors", "首项系数为 1 的一次因式"),
      explanation: t(
        "A **root** of a polynomial $p(x)$ is a value of $x$ with $p(x) = 0$. When $p(x)$ is a product, it is zero exactly when one of its factors is zero, so each factor gives a root:\n\n$$p(x) = 2x(x - 3)(x + 5) = 0 \\implies x = 0, \\; x = 3, \\; x = -5$$\n\nThe factor $x - 3$ gives the root $3$, not $-3$. A constant factor such as $2$ is never zero and gives no root.\n\n> **Watch out.** The root has the opposite sign to the number in the factor: $x - 3$ gives $3$ and $x + 5$ gives $-5$. The factor $x$ gives the root $0$, which is easy to leave out, and the constant $2$ is not a root.",
        "多项式 $p(x)$ 的**根**是使 $p(x) = 0$ 的 $x$ 的值。$p(x)$ 是乘积时，它为零当且仅当某个因式为零，所以每个因式给出一个根：\n\n$$p(x) = 2x(x - 3)(x + 5) = 0 \\implies x = 0, \\; x = 3, \\; x = -5$$\n\n因式 $x - 3$ 给出的根是 $3$，不是 $-3$。$2$ 这样的常数因数永远不为零，不给出根。\n\n> **注意。** 根的符号与因式里的数相反：$x - 3$ 给出 $3$，$x + 5$ 给出 $-5$。因式 $x$ 给出根 $0$，这个根很容易漏掉；常数 $2$ 不是根。",
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
          solution: (() => {
            const s1 = stepLabel(1, "Set each factor equal to zero", "令每个因式等于零");
            const s2 = stepLabel(2, "Collect the roots", "写出所有根");
            const work = steps(roots.map((r) => (r === 0 ? "x = 0" : linearRoot(1, -r))).join(", \\quad "));
            const check = zeroCheck(
              k,
              roots.map((r) => [1, -r]),
              Q.of(roots[1]!),
              xm(roots[1]!),
            );
            return t(
              `${s1.en} A product is zero exactly when one of its factors is zero, so each factor gives a root:${work}\n\n${s2.en} ${k === 1 ? "" : `The constant factor $${k}$ is never zero, so it gives no root. `}The roots are $${values.join(", ")}$.\n\n${check.en}`,
              `${s1["zh-CN"]}乘积为零当且仅当某个因式为零，所以每个因式给出一个根：${work}\n\n${s2["zh-CN"]}${k === 1 ? "" : `常数因数 $${k}$ 永不为零，不给出根。`}根是 $${values.join(", ")}$。\n\n${check["zh-CN"]}`,
            );
          })(),
        });
      },
    },
    {
      id: "factors-with-coefficients",
      title: t("Factors with leading coefficients", "带首项系数的因式"),
      explanation: t(
        "A product is zero exactly when one of its factors is zero, so each factor gives one root.\n\nA factor $ax - b$ gives the root $x = \\frac{b}{a}$: solve $ax - b = 0$ rather than reading the number off the factor.\n\n$$p(x) = (2x - 3)(3x + 1)(x - 4)$$\n\n$$2x - 3 = 0 \\implies x = \\frac{3}{2}, \\quad 3x + 1 = 0 \\implies x = -\\frac{1}{3}, \\quad x - 4 = 0 \\implies x = 4$$\n\n> **Watch out.** The root of $2x - 3$ is $\\frac{3}{2}$, not $3$ and not $\\frac{2}{3}$: move the constant to the other side, then divide by the coefficient of $x$. The sign changes in the move, so $3x + 1$ gives $-\\frac{1}{3}$.",
        "一个乘积等于零，当且仅当其中某个因式等于零，所以每个因式给出一个根。\n\n因式 $ax - b$ 给出的根是 $x = \\frac{b}{a}$：要解方程 $ax - b = 0$，而不是直接读出因式中的数。\n\n$$p(x) = (2x - 3)(3x + 1)(x - 4)$$\n\n$$2x - 3 = 0 \\implies x = \\frac{3}{2}, \\quad 3x + 1 = 0 \\implies x = -\\frac{1}{3}, \\quad x - 4 = 0 \\implies x = 4$$\n\n> **注意。** $2x - 3$ 的根是 $\\frac{3}{2}$，不是 $3$，也不是 $\\frac{2}{3}$：先把常数移到另一边，再除以 $x$ 的系数。移项时要变号，所以 $3x + 1$ 给出 $-\\frac{1}{3}$。",
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
            solution: (() => {
              const s1 = stepLabel(1, "Set each factor equal to zero", "令每个因式等于零");
              const s2 = stepLabel(2, "Collect the roots", "写出所有根");
              const work = steps(shuffled.map(([a, b]) => linearRoot(a, -b)).join(", \\quad "));
              const [a0, b0] = shuffled[0]!;
              const check = zeroCheck(
                1,
                shuffled.map(([a, b]) => [a, -b]),
                Q.of(b0, a0),
                linear(a0, -b0),
              );
              return t(
                `${s1.en} The product is zero exactly when one factor is zero. Solve each factor's equation by moving the constant across and dividing by the coefficient of $x$:${work}\n\n${s2.en} The roots are $${values.join(", ")}$.\n\n${check.en}`,
                `${s1["zh-CN"]}乘积为零当且仅当某个因式为零。对每个因式解方程：把常数移到另一边，再除以 $x$ 的系数：${work}\n\n${s2["zh-CN"]}根是 $${values.join(", ")}$。\n\n${check["zh-CN"]}`,
              );
            })(),
          });
        }
      },
    },
    {
      id: "quadratic-factors",
      title: t("Quadratic factors", "二次因式"),
      explanation: t(
        "A factor $x^{2} - n$ with $n > 0$ gives two roots, $x = \\pm\\sqrt{n}$. A factor $x^{2} + n$ with $n > 0$ gives **no** real root, because $x^{2} + n \\ge n > 0$.\n\n$$p(x) = (x + 1)(x^{2} - 9)(x^{2} + 4)$$\n\n$x + 1 = 0$ gives $x = -1$; $x^{2} = 9$ gives $x = \\pm 3$; $x^{2} = -4$ has no real solution. The real roots are $-1, 3, -3$.\n\n> **Watch out.** $x^{2} = 9$ has two solutions, $3$ and $-3$; do not keep only $3$, and do not give $9$ itself. A factor $x^{2} + 4$ gives no real root at all: $\\pm 2$ are not roots, since $2^{2} + 4 = 8$.",
        "因式 $x^{2} - n$（$n > 0$）给出两个根 $x = \\pm\\sqrt{n}$。因式 $x^{2} + n$（$n > 0$）**没有**实数根，因为 $x^{2} + n \\ge n > 0$。\n\n$$p(x) = (x + 1)(x^{2} - 9)(x^{2} + 4)$$\n\n$x + 1 = 0$ 得 $x = -1$；$x^{2} = 9$ 得 $x = \\pm 3$；$x^{2} = -4$ 没有实数解。实数根是 $-1, 3, -3$。\n\n> **注意。** $x^{2} = 9$ 有两个解 $3$ 和 $-3$，不要只写 $3$，也不要写成 $9$。因式 $x^{2} + 4$ 根本没有实数根：$\\pm 2$ 不是根，因为 $2^{2} + 4 = 8$。",
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
        const linFirst = rng.bool(0.5);
        const expr = linFirst ? `${lin}${quad}` : `${quad}${lin}`;
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
          solution: (() => {
            const s1 = stepLabel(1, "Solve the linear factor", "解一次因式");
            const s2 = stepLabel(2, "Solve the quadratic factor", "解二次因式");
            const sq =
              kind === "none"
                ? t(
                    `$x^{2} + ${n}$ is at least $${n}$ for every real $x$, so it adds no root`,
                    `对每个实数 $x$，$x^{2} + ${n}$ 都不小于 $${n}$，所以它不添加根`,
                  )
                : t(
                    `the quadratic factor is zero at $x = ${pair[0]}$: $\\left(${pair[0]}\\right)^{2} - ${n} = ${n} - ${n} = 0$`,
                    `二次因式在 $x = ${pair[0]}$ 处为零：$\\left(${pair[0]}\\right)^{2} - ${n} = ${n} - ${n} = 0$`,
                  );
            const qc = [1, 0, kind === "none" ? n : -n];
            const at = zeroAt(1, linFirst ? [[1, -r], qc] : [qc, [1, -r]], Q.of(r));
            return t(
              `${s1.en} The product is zero exactly when one factor is zero. $${xm(r)} = 0$ gives $x = ${r}$.\n\n${s2.en} Set the quadratic factor equal to zero: ${quadStep.en}. ${values.length === 1 ? `The only real root is $${values[0]}$` : `The real roots are $${values.join(", ")}$`}.\n\n**Check.** At $x = ${r}$ the linear factor is zero: $${at}$. Also, ${sq.en}.`,
              `${s1["zh-CN"]}乘积为零当且仅当某个因式为零。$${xm(r)} = 0$ 得 $x = ${r}$。\n\n${s2["zh-CN"]}令二次因式等于零：${quadStep["zh-CN"]}。${values.length === 1 ? `唯一的实数根是 $${values[0]}$` : `实数根是 $${values.join(", ")}$`}。\n\n**检验。** 在 $x = ${r}$ 处一次因式为零：$${at}$。另外，${sq["zh-CN"]}。`,
            );
          })(),
        });
      },
    },
  ],
};

// ─── 2.6.2 Solving polynomial equations using the GCF ───────────────────────

/** solvePrompt asks to solve an equation. */
const solvePrompt = (eq: string, real = false): Text =>
  real ? t(`Find all real solutions of $${eq}$.`, `求方程 $${eq}$ 的所有实数解。`) : t(`Solve $${eq}$.`, `解方程 $${eq}$。`);

/** bothSidesSolution solves lhs = rhs: move every term to the left, factor, solve, and check one solution on both sides. */
function bothSidesSolution(lhs: Coefs, rhs: Coefs, factor: Text, solve: Text, x: number): Text {
  const left = P(
    addP(
      lhs,
      rhs.map((v) => -v),
    ),
  );
  const s1 = stepLabel(1, "Move every term to one side", "把所有项移到一边");
  const s2 = stepLabel(2, "Factor", "分解因式");
  const s3 = stepLabel(3, "Set each factor equal to zero", "令每个因式等于零");
  const X = Q.of(x);
  return t(
    [
      `${s1.en} Move $${P(rhs)}$ to the left side, changing its sign, so that the right side is $0$:${steps(`${left} = 0`)}`,
      `${s2.en} ${factor.en}`,
      `${s3.en} ${solve.en}`,
      `**Check.** Put $x = ${x}$ into both sides of the original equation. The left side gives $${atValue(lhs, X)}$.\n\nThe right side gives the same: $${atValue(rhs, X)}$.`,
    ].join("\n\n"),
    [
      `${s1["zh-CN"]}把 $${P(rhs)}$ 变号移到左边，使右边为 $0$：${steps(`${left} = 0`)}`,
      `${s2["zh-CN"]}${factor["zh-CN"]}`,
      `${s3["zh-CN"]}${solve["zh-CN"]}`,
      `**检验。** 把 $x = ${x}$ 代入原方程两边。左边得 $${atValue(lhs, X)}$。\n\n右边得到相同的值：$${atValue(rhs, X)}$。`,
    ].join("\n\n"),
  );
}

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
    { topic: "solving-quadratic-equations-with-no-constant-term", weight: 0.3 },
    { topic: "solving-quadratic-equations-by-factoring", weight: 0.5 },
    { topic: "factoring-polynomials-using-gcfs", weight: 0.4 },
  ],
  xp: 14,
  standards: ["CCSS.HSA.APR.B.3", "CCSS.HSA.SSE.A.2"],
  intro: t(
    `A quadratic equation with no constant term, such as $x^{2} = 5x$, is solved by moving everything to one side and taking out $x$: $x(x - 5) = 0$, so $x = 0$ or $x = 5$. Higher-degree equations whose terms share a factor are solved the same way: take out the greatest common factor, factor what is left, and set each factor equal to zero.

Solve $3x^{3} + 6x^{2} = 0$. Both terms contain $3x^{2}$:

$$3x^{3} + 6x^{2} = 3x^{2}(x + 2) = 0$$

The factor $x^{2}$ is zero at $x = 0$, and $x + 2$ is zero at $x = -2$, so the solutions are $0$ and $-2$. Dividing both sides by $3x^{2}$ would have left only $x + 2 = 0$ and lost $x = 0$: division by an expression that can be zero throws away the solutions that make it zero.

In this lesson we take out common factors and then factor a trinomial or a difference of squares, also when the terms start on both sides of the equation.`,
    `没有常数项的二次方程，例如 $x^{2} = 5x$，解法是把所有项移到一边再提出 $x$：$x(x - 5) = 0$，所以 $x = 0$ 或 $x = 5$。各项有公因式的高次方程也是这样解：提取最大公因式，分解剩下的部分，再令每个因式等于零。

解 $3x^{3} + 6x^{2} = 0$。两项都含有 $3x^{2}$：

$$3x^{3} + 6x^{2} = 3x^{2}(x + 2) = 0$$

因式 $x^{2}$ 在 $x = 0$ 处为零，$x + 2$ 在 $x = -2$ 处为零，所以解是 $0$ 和 $-2$。如果两边同除以 $3x^{2}$，就只剩 $x + 2 = 0$，丢掉了 $x = 0$：除以一个可能为零的式子，会丢掉使它为零的解。

本课先提取公因式，再分解三项式或平方差，也包括各项一开始分布在方程两边的情形。`,
  ),
  knowledgePoints: [
    {
      id: "gcf-then-trinomial",
      title: t("Taking out the GCF", "提取最大公因式"),
      explanation: t(
        "Take out the greatest common factor, power of $x$ included, then factor what is left:\n\n$$2x^{3} - 6x^{2} - 20x = 0$$\n\n$$2x(x^{2} - 3x - 10) = 0$$\n\n$$2x(x - 5)(x + 2) = 0$$\n\nThe factor $x$ gives the solution $x = 0$; do not lose it. The solutions are $x = 0, 5, -2$.\n\n> **Watch out.** Keep the solution $x = 0$ from the factor $2x$; it disappears if you divide by $x$. The constant $2$ of the common factor is not a solution, and each binomial gives the root of opposite sign: $x - 5$ gives $5$.",
        "提取最大公因式（包括 $x$ 的幂），再分解剩下的部分：\n\n$$2x^{3} - 6x^{2} - 20x = 0$$\n\n$$2x(x^{2} - 3x - 10) = 0$$\n\n$$2x(x - 5)(x + 2) = 0$$\n\n因式 $x$ 给出解 $x = 0$，不要丢掉它。解为 $x = 0, 5, -2$。\n\n> **注意。** 因式 $2x$ 给出的解 $x = 0$ 要保留，除以 $x$ 就会把它丢掉。公因式里的常数 $2$ 不是解；每个二项式给出符号相反的根：$x - 5$ 给出 $5$。",
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
          solution: (() => {
            const sq = r1 + r2 === 0;
            const s1 = stepLabel(1, "Take out the greatest common factor", "提取最大公因式");
            const s2 = stepLabel(2, sq ? "Factor the difference of squares" : "Factor the trinomial", sq ? "分解平方差" : "分解三项式");
            const s3 = stepLabel(3, "Set each factor equal to zero", "令每个因式等于零");
            const check = rootCheck(cs, Q.of(r1));
            return t(
              `${s1.en} Every term contains $${poly([k, pw(j)])}$:${steps(`${P(cs)} = ${gcfLatex}(${P(quad)}) = 0`)}\n\n${s2.en} ${sq ? `$${P(quad)}$ is a difference of squares` : `Two numbers with product $${r1 * r2}$ and sum $${r1 + r2}$ are $${-r1}$ and $${-r2}$`}:${steps(`${gcfLatex}${lf(1, -r1)}${lf(1, -r2)} = 0`)}\n\n${s3.en} The factor $${pw(j)}$ gives $x = 0$${k === 1 ? "" : `, the constant $${k}$ gives no solution`}, and the binomials give $x = ${r1}$ and $x = ${r2}$.\n\n${check.en}`,
              `${s1["zh-CN"]}每一项都含有 $${poly([k, pw(j)])}$：${steps(`${P(cs)} = ${gcfLatex}(${P(quad)}) = 0`)}\n\n${s2["zh-CN"]}${sq ? `$${P(quad)}$ 是平方差` : `积为 $${r1 * r2}$、和为 $${r1 + r2}$ 的两个数是 $${-r1}$ 和 $${-r2}$`}：${steps(`${gcfLatex}${lf(1, -r1)}${lf(1, -r2)} = 0`)}\n\n${s3["zh-CN"]}因式 $${pw(j)}$ 给出 $x = 0$${k === 1 ? "" : `，常数 $${k}$ 不给出解`}，两个二项式给出 $x = ${r1}$ 和 $x = ${r2}$。\n\n${check["zh-CN"]}`,
            );
          })(),
        });
      },
    },
    {
      id: "terms-on-both-sides",
      title: t("Terms on both sides", "两边都有项"),
      explanation: t(
        "First move every term to one side so that the other side is $0$. Never divide both sides by $x$: that loses the solution $x = 0$.\n\n$$x^{4} = 9x^{2} \\implies x^{4} - 9x^{2} = 0 \\implies x^{2}(x - 3)(x + 3) = 0$$\n\nThe solutions are $x = 0, 3, -3$. Dividing by $x^{2}$ would have given only $x = \\pm 3$.\n\n> **Watch out.** Dividing both sides by a power of $x$ loses the solution $x = 0$. And $x^{2} = 9$ gives both $3$ and $-3$, not $9$.",
        "先把所有项移到一边，使另一边为 $0$。不要两边同除以 $x$：那样会丢掉解 $x = 0$。\n\n$$x^{4} = 9x^{2} \\implies x^{4} - 9x^{2} = 0 \\implies x^{2}(x - 3)(x + 3) = 0$$\n\n解为 $x = 0, 3, -3$。如果两边除以 $x^{2}$，就只剩下 $x = \\pm 3$。\n\n> **注意。** 两边同除以 $x$ 的幂会丢掉解 $x = 0$。另外 $x^{2} = 9$ 给出 $3$ 和 $-3$ 两个解，而不是 $9$。",
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
            solution: bothSidesSolution(
              [k, ...Array<number>(j + 2).fill(0)],
              [k * v * v, ...Array<number>(j).fill(0)],
              t(
                `Take out $${poly([k, pw(j)])}$ and factor the difference of squares:${steps(`${monoFront(k, j)}(x^{2} - ${v * v}) = ${monoFront(k, j)}${lf(1, -v)}${lf(1, v)} = 0`)}`,
                `提出 $${poly([k, pw(j)])}$，再分解平方差：${steps(`${monoFront(k, j)}(x^{2} - ${v * v}) = ${monoFront(k, j)}${lf(1, -v)}${lf(1, v)} = 0`)}`,
              ),
              t(
                `The factor $${pw(j)}$ gives $x = 0$, and the binomials give $x = ${v}$ and $x = ${-v}$. Dividing both sides by $${pw(j)}$ at the start would have lost $x = 0$.`,
                `因式 $${pw(j)}$ 给出 $x = 0$，两个二项式给出 $x = ${v}$ 和 $x = ${-v}$。如果一开始两边同除以 $${pw(j)}$，就会丢掉 $x = 0$。`,
              ),
              v,
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
          solution: bothSidesSolution(
            moveX ? [k, B, 0, 0] : [k, 0, 0, 0],
            moveX ? [-C, 0] : [-B, -C, 0],
            t(
              `Take out $${poly([k, "x"])}$ and factor the trinomial:${steps(`${monoFront(k, 1)}(${P([1, -(r1 + r2), r1 * r2])}) = ${monoFront(k, 1)}${lf(1, -r1)}${lf(1, -r2)} = 0`)}`,
              `提出 $${poly([k, "x"])}$，再分解三项式：${steps(`${monoFront(k, 1)}(${P([1, -(r1 + r2), r1 * r2])}) = ${monoFront(k, 1)}${lf(1, -r1)}${lf(1, -r2)} = 0`)}`,
            ),
            t(
              `The factor $x$ gives $x = 0$, and the binomials give $x = ${r1}$ and $x = ${r2}$.`,
              `因式 $x$ 给出 $x = 0$，两个二项式给出 $x = ${r1}$ 和 $x = ${r2}$。`,
            ),
            r1,
          ),
        });
      },
    },
    {
      id: "leading-coefficients",
      title: t("A trinomial with a leading coefficient", "首项系数不为 1 的三项式"),
      explanation: t(
        "After taking out the GCF, the trinomial may have a leading coefficient; factor it as usual:\n\n$$6x^{3} - 3x^{2} - 9x = 3x(2x^{2} - x - 3) = 3x(2x - 3)(x + 1) = 0$$\n\nThe solutions are $x = 0$, $x = \\frac{3}{2}$ and $x = -1$.\n\n> **Watch out.** The factor $2x - 3$ gives $x = \\frac{3}{2}$, not $3$. And keep the solution $x = 0$ from the factor $3x$.",
        "提取公因式之后，三项式的首项系数可能不是 1，照常分解：\n\n$$6x^{3} - 3x^{2} - 9x = 3x(2x^{2} - x - 3) = 3x(2x - 3)(x + 1) = 0$$\n\n解为 $x = 0$，$x = \\frac{3}{2}$，$x = -1$。\n\n> **注意。** 因式 $2x - 3$ 给出 $x = \\frac{3}{2}$，而不是 $3$；也不要丢掉因式 $3x$ 给出的 $x = 0$。",
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
          solution: (() => {
            const s1 = stepLabel(1, "Take out the greatest common factor", "提取最大公因式");
            const s2 = stepLabel(2, "Factor the trinomial", "分解三项式");
            const s3 = stepLabel(3, "Set each factor equal to zero", "令每个因式等于零");
            const ac = quad[0]! * quad[2]!;
            const check = rootCheck(cs, Q.of(b, a));
            return t(
              `${s1.en} Every term contains $${poly([k, "x"])}$:${steps(`${P(cs)} = ${g}(${P(quad)}) = 0`)}\n\n${s2.en} By the ac-method, look for two numbers with product $${ac}$ and sum $${quad[1]}$: they are $${-b}$ and $${-a * r}$. Splitting the middle term and grouping gives${steps(`${g}${lf(a, -b)}${lf(1, -r)} = 0`)}\n\n${s3.en} The factor $x$ gives $x = 0$, $${linearRoot(a, -b)}$, and $${xm(r)} = 0$ gives $x = ${r}$.\n\n${check.en}`,
              `${s1["zh-CN"]}每一项都含有 $${poly([k, "x"])}$：${steps(`${P(cs)} = ${g}(${P(quad)}) = 0`)}\n\n${s2["zh-CN"]}用 ac 法，找积为 $${ac}$、和为 $${quad[1]}$ 的两个数：它们是 $${-b}$ 和 $${-a * r}$。拆开中间项再分组，得${steps(`${g}${lf(a, -b)}${lf(1, -r)} = 0`)}\n\n${s3["zh-CN"]}因式 $x$ 给出 $x = 0$，$${linearRoot(a, -b)}$，$${xm(r)} = 0$ 得 $x = ${r}$。\n\n${check["zh-CN"]}`,
            );
          })(),
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

/** groupingSolution solves the cubic [a, b, ca, cb] = 0 by grouping, then factors or solves x² + c, and checks the root of ax + b. */
function groupingSolution(cs: Coefs, a: number, b: number, c: number, factor: Text, solve: Text): Text {
  const s1 = stepLabel(1, "Group the terms in pairs", "两两分组");
  const s2 = stepLabel(2, "Factor what is left", "分解剩下的因式");
  const s3 = stepLabel(3, "Set each factor equal to zero", "令每个因式等于零");
  const check = rootCheck(cs, Q.of(-b, a));
  const pair = `${P([a, b, 0, 0])}`;
  return t(
    [
      `${s1.en} The first pair $${pair}$ has the common factor $x^{2}$, and taking $${c}$ out of the second pair leaves the same binomial $${linear(a, b)}$:${steps(`${groupingLine(a, b, c)} = 0`)}`,
      `${s2.en} ${factor.en}`,
      `${s3.en} ${solve.en}`,
      check.en,
    ].join("\n\n"),
    [
      `${s1["zh-CN"]}第一对 $${pair}$ 有公因式 $x^{2}$；从第二对中提出 $${c}$，剩下同一个二项式 $${linear(a, b)}$：${steps(`${groupingLine(a, b, c)} = 0`)}`,
      `${s2["zh-CN"]}${factor["zh-CN"]}`,
      `${s3["zh-CN"]}${solve["zh-CN"]}`,
      check["zh-CN"],
    ].join("\n\n"),
  );
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
  ],
  xp: 14,
  standards: ["CCSS.HSA.APR.B.3", "CCSS.HSA.SSE.A.2"],
  intro: t(
    `A cubic with four terms and no common factor can still be factored when its terms pair up: each pair has a common factor, and what is left in the two pairs is the same binomial. That binomial then comes out of the whole expression, by the distributive law used backwards.

Solve $x^{3} + x^{2} - 4x - 4 = 0$. The first pair is $x^{2}(x + 1)$ and the second is $-4(x + 1)$, so

$$x^{3} + x^{2} - 4x - 4 = x^{2}(x + 1) - 4(x + 1) = (x + 1)(x^{2} - 4) = (x + 1)(x - 2)(x + 2)$$

Setting each factor equal to zero gives $x = -1$, $x = 2$ and $x = -2$. Grouping works here because the coefficients of the two pairs are in the same ratio, $1 : 1$ and $-4 : -4$.

In this lesson the quadratic factor left over is sometimes a difference of squares, sometimes not factorable over the integers, and the common binomial can have a leading coefficient.`,
    `四项、没有公因式的三次式，如果各项能两两配对，仍然可以分解：每一对有自己的公因式，并且两对剩下的是同一个二项式。这时可以用反过来的分配律，把这个二项式从整个式子中提出来。

解 $x^{3} + x^{2} - 4x - 4 = 0$。第一对是 $x^{2}(x + 1)$，第二对是 $-4(x + 1)$，所以

$$x^{3} + x^{2} - 4x - 4 = x^{2}(x + 1) - 4(x + 1) = (x + 1)(x^{2} - 4) = (x + 1)(x - 2)(x + 2)$$

令每个因式等于零，得 $x = -1$、$x = 2$、$x = -2$。这里能分组，是因为两对的系数成相同的比：$1 : 1$ 与 $-4 : -4$。

本课中剩下的二次因式有时是平方差，有时在整数范围内不能分解；公共二项式的首项系数也可能不是 1。`,
  ),
  knowledgePoints: [
    {
      id: "grouping-then-difference-of-squares",
      title: t("Grouping, then a difference of squares", "分组后再分解平方差"),
      explanation: t(
        "Group the first two and the last two terms, take out the common binomial, and factor any difference of squares:\n\n$$x^{3} + 2x^{2} - 9x - 18 = x^{2}(x + 2) - 9(x + 2) = (x + 2)(x^{2} - 9) = (x + 2)(x - 3)(x + 3)$$\n\nSo $x^{3} + 2x^{2} - 9x - 18 = 0$ has the three solutions $x = -2, 3, -3$.\n\n> **Watch out.** Factor $x^{2} - 9$ all the way: it gives both $3$ and $-3$, not $9$. And the binomial $x + 2$ gives $-2$, not $2$.",
        "把前两项、后两项分别分组，提出公共二项式，再分解平方差：\n\n$$x^{3} + 2x^{2} - 9x - 18 = x^{2}(x + 2) - 9(x + 2) = (x + 2)(x^{2} - 9) = (x + 2)(x - 3)(x + 3)$$\n\n所以 $x^{3} + 2x^{2} - 9x - 18 = 0$ 有三个解 $x = -2, 3, -3$。\n\n> **注意。** 要把 $x^{2} - 9$ 分解到底：它给出 $3$ 和 $-3$ 两个解，而不是 $9$。二项式 $x + 2$ 给出 $-2$，不是 $2$。",
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
          solution: groupingSolution(
            cs,
            1,
            q,
            -v * v,
            t(
              `$x^{2} - ${v * v}$ is a difference of squares:${steps(`${lf(1, q)}${lf(1, -v)}${lf(1, v)} = 0`)}`,
              `$x^{2} - ${v * v}$ 是平方差：${steps(`${lf(1, q)}${lf(1, -v)}${lf(1, v)} = 0`)}`,
            ),
            t(`The solutions are $x = ${-q}, ${v}, ${-v}$.`, `解为 $x = ${-q}, ${v}, ${-v}$。`),
          ),
        });
      },
    },
    {
      id: "a-quadratic-factor-left",
      title: t("A quadratic factor that does not factor", "不能再分解的二次因式"),
      explanation: t(
        "The quadratic factor may not factor over the integers. Solve it directly: $x^{2} + 5 = 0$ has no real solution, while $x^{2} - 5 = 0$ gives $x = \\pm\\sqrt{5}$.\n\n$$x^{3} - 4x^{2} - 5x + 20 = x^{2}(x - 4) - 5(x - 4) = (x - 4)(x^{2} - 5) = 0$$\n\nThe real solutions are $x = 4$ and $x = \\pm\\sqrt{5}$.\n\n> **Watch out.** $x^{2} + 5 = 0$ has no real solution, so it adds nothing; do not write $\\pm\\sqrt{5}$ for it. For $x^{2} - 5 = 0$ the solutions are $\\pm\\sqrt{5}$, not $\\pm 5$, and the binomial $x - 4$ gives $4$, not $-4$.",
        "二次因式可能在整数范围内不能分解，直接求解即可：$x^{2} + 5 = 0$ 没有实数解，而 $x^{2} - 5 = 0$ 得 $x = \\pm\\sqrt{5}$。\n\n$$x^{3} - 4x^{2} - 5x + 20 = x^{2}(x - 4) - 5(x - 4) = (x - 4)(x^{2} - 5) = 0$$\n\n实数解为 $x = 4$ 和 $x = \\pm\\sqrt{5}$。\n\n> **注意。** $x^{2} + 5 = 0$ 没有实数解，不添加任何解；不要给它写 $\\pm\\sqrt{5}$。$x^{2} - 5 = 0$ 的解是 $\\pm\\sqrt{5}$，不是 $\\pm 5$；二项式 $x - 4$ 给出 $4$，不是 $-4$。",
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
          solution: groupingSolution(
            cs,
            1,
            q,
            c,
            t(
              `$x^{2} ${none ? "+" : "-"} ${n}$ ${none ? "is a sum, not a difference of squares" : `is not a difference of two integer squares, since $${n}$ is not a perfect square`}, so it does not factor over the integers. Solve it directly instead.`,
              `$x^{2} ${none ? "+" : "-"} ${n}$ ${none ? "是和而不是平方差" : `不是两个整数的平方差，因为 $${n}$ 不是完全平方数`}，在整数范围内不能分解，改为直接求解。`,
            ),
            t(
              `$${xm(-q)} = 0$ gives $x = ${-q}$, and ${quadStep.en}${none ? ", since a square is never negative" : ""}. ${values.length === 1 ? `The only real solution is $${values[0]}$` : `The real solutions are $${values.join(", ")}$`}.`,
              `$${xm(-q)} = 0$ 得 $x = ${-q}$；${quadStep["zh-CN"]}${none ? "，因为平方不会是负数" : ""}。${values.length === 1 ? `唯一的实数解是 $${values[0]}$` : `实数解为 $${values.join(", ")}$`}。`,
            ),
          ),
        });
      },
    },
    {
      id: "leading-coefficients",
      title: t("A binomial with a leading coefficient", "首项系数不为 1 的二项式"),
      explanation: t(
        "The common binomial may have a leading coefficient, giving a fractional solution:\n\n$$2x^{3} + 3x^{2} - 8x - 12 = x^{2}(2x + 3) - 4(2x + 3) = (2x + 3)(x - 2)(x + 2) = 0$$\n\n$2x + 3 = 0$ gives $x = -\\frac{3}{2}$, so the solutions are $x = -\\frac{3}{2}, 2, -2$.\n\n> **Watch out.** $2x + 3 = 0$ gives $x = -\\frac{3}{2}$: move the $3$ across, which changes its sign, and then divide by $2$. It is not $-3$, and not $\\frac{3}{2}$.",
        "公共二项式的首项系数可能不是 1，这时会得到分数解：\n\n$$2x^{3} + 3x^{2} - 8x - 12 = x^{2}(2x + 3) - 4(2x + 3) = (2x + 3)(x - 2)(x + 2) = 0$$\n\n$2x + 3 = 0$ 得 $x = -\\frac{3}{2}$，所以解为 $x = -\\frac{3}{2}, 2, -2$。\n\n> **注意。** $2x + 3 = 0$ 得 $x = -\\frac{3}{2}$：先把 $3$ 移到另一边（要变号），再除以 $2$。它不是 $-3$，也不是 $\\frac{3}{2}$。",
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
          solution: groupingSolution(
            cs,
            a,
            b,
            -v * v,
            t(
              `$x^{2} - ${v * v}$ is a difference of squares:${steps(`${lf(a, b)}${lf(1, -v)}${lf(1, v)} = 0`)}`,
              `$x^{2} - ${v * v}$ 是平方差：${steps(`${lf(a, b)}${lf(1, -v)}${lf(1, v)} = 0`)}`,
            ),
            t(
              `$${linearRoot(a, b)}$, and $x^{2} = ${v * v}$ gives $x = \\pm ${v}$. The solutions are $${values.join(", ")}$.`,
              `$${linearRoot(a, b)}$；$x^{2} = ${v * v}$ 得 $x = \\pm ${v}$。解为 $${values.join(", ")}$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ─── 2.6.4 Solving biquadratic equations ────────────────────────────────────

/** biquadSolution solves ax⁴ + bx² + c = 0 by factoring it as a quadratic in x², with the pair of numbers the factoring uses, and checks one solution. */
function biquadSolution(cs: Coefs, pair: readonly [number, number], factored: string, solve: Text, x: Q): Text {
  const [a, , b, , c] = cs as [number, number, number, number, number];
  const s1 = stepLabel(1, "Factor as a quadratic in $x^{2}$", "按 $x^{2}$ 的二次式分解");
  const s2 = stepLabel(2, "Solve for $x$", "求 $x$");
  const u = poly([a, "u^{2}"], [b, "u"], [c, ""]);
  const ac = a === 1 ? "" : " (by the ac-method)";
  const acZh = a === 1 ? "" : "（用 ac 法）";
  const check = rootCheck(cs, x);
  return t(
    [
      `${s1.en} With $u = x^{2}$ the equation reads $${u} = 0$. Two numbers with product $${a * c}$ and sum $${b}$${ac} are $${pair[0]}$ and $${pair[1]}$, so${steps(`${P(cs)} = ${factored} = 0`)}`,
      `${s2.en} Each factor gives a value of $x^{2}$, and each positive value gives two square roots. ${solve.en}`,
      check.en,
    ].join("\n\n"),
    [
      `${s1["zh-CN"]}令 $u = x^{2}$，方程变为 $${u} = 0$。积为 $${a * c}$、和为 $${b}$ 的两个数${acZh}是 $${pair[0]}$ 和 $${pair[1]}$，所以${steps(`${P(cs)} = ${factored} = 0`)}`,
      `${s2["zh-CN"]}每个因式给出 $x^{2}$ 的一个值，每个正值有两个平方根。${solve["zh-CN"]}`,
      check["zh-CN"],
    ].join("\n\n"),
  );
}

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
  intro: t(
    `A **biquadratic** equation has only the powers $x^{4}$, $x^{2}$ and a constant. Since $x^{4} = (x^{2})^{2}$, it is a quadratic equation in disguise: write $u$ for $x^{2}$, and the factoring of quadratics applies.

Solve $x^{4} - 5x^{2} + 4 = 0$. With $u = x^{2}$ it reads $u^{2} - 5u + 4 = 0$, and two numbers with product $4$ and sum $-5$ are $-1$ and $-4$:

$$u^{2} - 5u + 4 = (u - 1)(u - 4) = 0 \\implies u = 1 \\text{ or } u = 4$$

But the unknown is $x$, not $u$. Going back, $x^{2} = 1$ gives $x = \\pm 1$ and $x^{2} = 4$ gives $x = \\pm 2$: four solutions. Check one: $2^{4} - 5 \\cdot 2^{2} + 4 = 16 - 20 + 4 = 0$.

In this lesson each value of $x^{2}$ can give two solutions, one irrational pair, or none at all, and the quadratic in $x^{2}$ can have a leading coefficient.`,
    `**双二次**方程只含 $x^{4}$、$x^{2}$ 和常数项。因为 $x^{4} = (x^{2})^{2}$，它其实是改头换面的二次方程：用 $u$ 表示 $x^{2}$，就可以用二次式的分解方法。

解 $x^{4} - 5x^{2} + 4 = 0$。令 $u = x^{2}$，方程变成 $u^{2} - 5u + 4 = 0$，积为 $4$、和为 $-5$ 的两个数是 $-1$ 和 $-4$：

$$u^{2} - 5u + 4 = (u - 1)(u - 4) = 0 \\implies u = 1 \\text{ 或 } u = 4$$

但未知数是 $x$，不是 $u$。换回来，$x^{2} = 1$ 得 $x = \\pm 1$，$x^{2} = 4$ 得 $x = \\pm 2$，共四个解。检验其中一个：$2^{4} - 5 \\cdot 2^{2} + 4 = 16 - 20 + 4 = 0$。

本课中 $x^{2}$ 的每个值可能给出两个解、一对无理数解，或者没有解；关于 $x^{2}$ 的二次式也可能有首项系数。`,
  ),
  knowledgePoints: [
    {
      id: "four-solutions",
      title: t("Four solutions", "四个解"),
      explanation: t(
        "Treat $x^{4}$ as $(x^{2})^{2}$ and factor as a quadratic in $x^{2}$; each factor $x^{2} - k$ with $k > 0$ gives two solutions:\n\n$$x^{4} - 13x^{2} + 36 = (x^{2} - 4)(x^{2} - 9) = 0$$\n\n$x^{2} = 4$ gives $x = \\pm 2$ and $x^{2} = 9$ gives $x = \\pm 3$. Do not stop at $x^{2} = 4$: the solutions are values of $x$, and there are four of them.\n\n> **Watch out.** After finding $x^{2} = 4$ and $x^{2} = 9$, take square roots, with both signs: the solutions are $\\pm 2$ and $\\pm 3$, not $4$ and $9$, and not only $2$ and $3$.",
        "把 $x^{4}$ 看作 $(x^{2})^{2}$，按 $x^{2}$ 的二次式分解；每个因式 $x^{2} - k$（$k > 0$）给出两个解：\n\n$$x^{4} - 13x^{2} + 36 = (x^{2} - 4)(x^{2} - 9) = 0$$\n\n$x^{2} = 4$ 得 $x = \\pm 2$，$x^{2} = 9$ 得 $x = \\pm 3$。不要停在 $x^{2} = 4$：要求的是 $x$ 的值，共有四个。\n\n> **注意。** 求出 $x^{2} = 4$ 和 $x^{2} = 9$ 后，要开平方并取正负两个值：解是 $\\pm 2$ 和 $\\pm 3$，不是 $4$ 和 $9$，也不只是 $2$ 和 $3$。",
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
          solution: biquadSolution(
            cs,
            [-m * m, -n * n],
            `(x^{2} - ${m * m})(x^{2} - ${n * n})`,
            t(
              `$x^{2} = ${m * m}$ gives $x = \\pm ${m}$, and $x^{2} = ${n * n}$ gives $x = \\pm ${n}$: four solutions.`,
              `$x^{2} = ${m * m}$ 得 $x = \\pm ${m}$，$x^{2} = ${n * n}$ 得 $x = \\pm ${n}$，共四个解。`,
            ),
            Q.of(n),
          ),
        });
      },
    },
    {
      id: "fewer-real-solutions",
      title: t("Fewer real solutions", "实数解较少的情形"),
      explanation: t(
        "A biquadratic equation can have up to four real solutions, but each factor must be checked. A factor that is a sum of a square and a positive number never equals zero.\n\nA factor $x^{2} + k$ with $k > 0$ gives no real solution, and $x^{2} = k$ for a $k$ that is not a perfect square gives $x = \\pm\\sqrt{k}$:\n\n$$x^{4} + 5x^{2} - 36 = (x^{2} - 4)(x^{2} + 9) = 0 \\implies x = \\pm 2$$\n\n$$x^{4} - 7x^{2} + 12 = (x^{2} - 3)(x^{2} - 4) = 0 \\implies x = \\pm\\sqrt{3}, \\; x = \\pm 2$$\n\n> **Watch out.** $x^{2} + 9 = 0$ gives no real solution: $\\pm 3$ do not solve it, since $3^{2} + 9 = 18$. And $x^{2} = 3$ gives $\\pm\\sqrt{3}$, not $\\pm 3$ or $3$.",
        "双二次方程最多有四个实数解，但每个因式都要检查。平方式加上一个正数的因式永远不会等于零。\n\n因式 $x^{2} + k$（$k > 0$）没有实数解；当 $k$ 不是完全平方数时，$x^{2} = k$ 得 $x = \\pm\\sqrt{k}$：\n\n$$x^{4} + 5x^{2} - 36 = (x^{2} - 4)(x^{2} + 9) = 0 \\implies x = \\pm 2$$\n\n$$x^{4} - 7x^{2} + 12 = (x^{2} - 3)(x^{2} - 4) = 0 \\implies x = \\pm\\sqrt{3}, \\; x = \\pm 2$$\n\n> **注意。** $x^{2} + 9 = 0$ 没有实数解：$\\pm 3$ 不满足它，因为 $3^{2} + 9 = 18$。$x^{2} = 3$ 给出 $\\pm\\sqrt{3}$，而不是 $\\pm 3$ 或 $3$。",
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
            solution: biquadSolution(
              cs,
              [-m * m, n],
              `(x^{2} - ${m * m})(x^{2} + ${n})`,
              t(
                `$x^{2} = ${m * m}$ gives $x = \\pm ${m}$, while $x^{2} = ${-n}$ has no real solution, since a square is never negative.`,
                `$x^{2} = ${m * m}$ 得 $x = \\pm ${m}$；而 $x^{2} = ${-n}$ 没有实数解，因为平方不会是负数。`,
              ),
              Q.of(m),
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
          solution: biquadSolution(
            cs,
            [-s, -m * m],
            `(x^{2} - ${s})(x^{2} - ${m * m})`,
            t(
              `$x^{2} = ${s}$ gives $x = \\pm ${pair[0]}$, since $${s}$ is not a perfect square, and $x^{2} = ${m * m}$ gives $x = \\pm ${m}$.`,
              `$x^{2} = ${s}$ 得 $x = \\pm ${pair[0]}$（$${s}$ 不是完全平方数），$x^{2} = ${m * m}$ 得 $x = \\pm ${m}$。`,
            ),
            Q.of(m),
          ),
        });
      },
    },
    {
      id: "leading-coefficients",
      title: t("A leading coefficient", "首项系数不为 1"),
      explanation: t(
        "With a leading coefficient, factor as a quadratic in $x^{2}$ by the ac-method, then solve each factor:\n\n$$4x^{4} - 13x^{2} + 9 = (4x^{2} - 9)(x^{2} - 1) = 0$$\n\n$x^{2} = \\frac{9}{4}$ gives $x = \\pm\\frac{3}{2}$, and $x^{2} = 1$ gives $x = \\pm 1$.\n\n> **Watch out.** $4x^{2} - 9 = 0$ means $x^{2} = \\frac{9}{4}$: divide by $4$ before taking the square root. The solutions are $\\pm\\frac{3}{2}$, not $\\pm 3$ and not $\\pm\\frac{9}{4}$.",
        "首项系数不为 1 时，用 ac 法按 $x^{2}$ 的二次式分解，再分别求解：\n\n$$4x^{4} - 13x^{2} + 9 = (4x^{2} - 9)(x^{2} - 1) = 0$$\n\n$x^{2} = \\frac{9}{4}$ 得 $x = \\pm\\frac{3}{2}$，$x^{2} = 1$ 得 $x = \\pm 1$。\n\n> **注意。** $4x^{2} - 9 = 0$ 就是 $x^{2} = \\frac{9}{4}$：先除以 $4$ 再开平方。解是 $\\pm\\frac{3}{2}$，不是 $\\pm 3$，也不是 $\\pm\\frac{9}{4}$。",
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
          solution: biquadSolution(
            cs,
            [-u * u * m * m, -v * v],
            `(${P([u * u, 0, -v * v])})(x^{2} - ${m * m})`,
            t(
              `$${P([u * u, 0, -v * v])} = 0$ gives $x^{2} = ${fracOf(v * v, u * u)}$, so $x = \\pm ${fracOf(v, u)}$; and $x^{2} = ${m * m}$ gives $x = \\pm ${m}$.`,
              `$${P([u * u, 0, -v * v])} = 0$ 得 $x^{2} = ${fracOf(v * v, u * u)}$，所以 $x = \\pm ${fracOf(v, u)}$；$x^{2} = ${m * m}$ 得 $x = \\pm ${m}$。`,
            ),
            Q.of(v, u),
          ),
        });
      },
    },
  ],
};

// ─── 2.7.1 The factor theorem ───────────────────────────────────────────────

/** valueLine writes p(c) = substitution = the values of the terms = value. */
const valueLine = (cs: Coefs, c: Q) => `p\\left(${c.toLatex()}\\right) = ${atValue(cs, c)}`;

/** theFactorTheorem tells whether x − c is a factor from the value p(c). */
export const theFactorTheorem: TopicDef = {
  id: "the-factor-theorem",
  title: t("The Factor Theorem", "因式定理"),
  summary: t(
    "$x - c$ is a factor of $p(x)$ exactly when $p(c) = 0$: test factors by evaluating, and turn roots into factors.",
    "$x - c$ 是 $p(x)$ 的因式当且仅当 $p(c) = 0$：通过求值检验因式，并把根转化为因式。",
  ),
  prerequisites: ["dividing-polynomials-using-synthetic-division", "determining-the-roots-of-polynomials"],
  encompasses: [],
  xp: 13,
  standards: ["CCSS.HSA.APR.B.2"],
  intro: t(
    `Dividing $p(x)$ by $x - c$ always gives a quotient $q(x)$ and a number $r$ left over, with $p(x) = (x - c)q(x) + r$. This is an identity, true for every $x$, so we may put in the one value that makes the divisor vanish, $x = c$:

$$p(c) = (c - c)q(c) + r = 0 + r = r$$

So the remainder is the value $p(c)$, found without dividing. In particular, $x - c$ divides $p(x)$ exactly, with remainder $0$, when $p(c) = 0$.

Take $p(x) = x^{2} + x - 6$ and $x - 2$. Since $p(2) = 4 + 2 - 6 = 0$, the division leaves nothing, and indeed $x^{2} + x - 6 = (x - 2)(x + 3)$. With $x - 1$ instead, $p(1) = -4 \\neq 0$, so $x - 1$ is not a factor.

This is the **factor theorem**: $x - c$ is a factor of $p(x)$ exactly when $p(c) = 0$. It links the factors of a polynomial to its roots. In this lesson we use it to test factors, to turn roots into factors, and to pick out the factor among several candidates.`,
    `把 $p(x)$ 除以 $x - c$，总会得到商 $q(x)$ 和余下的一个数 $r$，并且 $p(x) = (x - c)q(x) + r$。这是一个恒等式，对每个 $x$ 都成立，所以可以代入使除式为零的那个值 $x = c$：

$$p(c) = (c - c)q(c) + r = 0 + r = r$$

所以余数就是函数值 $p(c)$，不用做除法就能得到。特别地，当 $p(c) = 0$ 时，$x - c$ 能整除 $p(x)$，余数为 $0$。

取 $p(x) = x^{2} + x - 6$ 和 $x - 2$。因为 $p(2) = 4 + 2 - 6 = 0$，相除没有余数，事实上 $x^{2} + x - 6 = (x - 2)(x + 3)$。如果换成 $x - 1$，$p(1) = -4 \\neq 0$，所以 $x - 1$ 不是因式。

这就是**因式定理**：$x - c$ 是 $p(x)$ 的因式当且仅当 $p(c) = 0$。它把多项式的因式和根联系起来。本课用它检验因式、把根转化为因式，并在几个候选中找出因式。`,
  ),
  knowledgePoints: [
    {
      id: "testing-a-factor",
      title: t("Testing a factor", "检验因式"),
      explanation: t(
        "Dividing $p(x)$ by $x - c$ gives $p(x) = (x - c)q(x) + r$. Substituting $x = c$ makes the first term zero, so $r = p(c)$. Hence the **factor theorem**: $x - c$ is a factor of $p(x)$ exactly when $p(c) = 0$.\n\nIs $x - 2$ a factor of $p(x) = x^{3} - 3x^{2} + 4$?\n\n$$p(2) = 8 - 12 + 4 = 0$$\n\nYes. For $x + 1$, use $c = -1$: $p(-1) = -1 - 3 + 4 = 0$, so $x + 1$ is a factor too.\n\n> **Watch out.** For $x + 1$ evaluate at $-1$, not at $1$: the factor $x - c$ goes with the value $p(c)$. Any nonzero value, however small, means $x - c$ is not a factor.",
        "把 $p(x)$ 除以 $x - c$ 得 $p(x) = (x - c)q(x) + r$。代入 $x = c$，第一项为零，所以 $r = p(c)$。由此得**因式定理**：$x - c$ 是 $p(x)$ 的因式当且仅当 $p(c) = 0$。\n\n$x - 2$ 是 $p(x) = x^{3} - 3x^{2} + 4$ 的因式吗？\n\n$$p(2) = 8 - 12 + 4 = 0$$\n\n是。对于 $x + 1$，取 $c = -1$：$p(-1) = -1 - 3 + 4 = 0$，所以 $x + 1$ 也是因式。\n\n> **注意。** 检验 $x + 1$ 要在 $-1$ 处求值，而不是 $1$：因式 $x - c$ 对应的是值 $p(c)$。只要值不为零，不管多小，$x - c$ 都不是因式。",
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
          const s1 = stepLabel(1, `Evaluate $p(${c})$`, `计算 $p(${c})$`);
          const s2 = stepLabel(2, "Apply the factor theorem", "用因式定理判断");
          const division = synthetic(cs, c);
          return reasoned(
            choiceProblem({
              prompt: t(`Is $${xm(c)}$ a factor of $p(x) = ${P(cs)}$?`, `$${xm(c)}$ 是 $p(x) = ${P(cs)}$ 的因式吗？`),
              options: yesNo,
              correct: yes ? 0 : 1,
              solution: t(
                [
                  `${s1.en} By the factor theorem, $${xm(c)}$ is a factor exactly when $p(${c}) = 0$${c < 0 ? `, because $${xm(c)} = x - (${c})$` : ""}:${steps(valueLine(cs, Q.of(c)))}`,
                  `${s2.en} ${yes ? `Since $p(${c}) = 0$, $${xm(c)}$ is a factor.` : `Since $p(${c}) = ${v} \\neq 0$, $${xm(c)}$ is not a factor; dividing would leave the remainder $${v}$.`}`,
                  `**Check.** Synthetic division by $${xm(c)}$ gives the same remainder:${steps(division.latex)}The remainder is $${division.remainder}$.`,
                ].join("\n\n"),
                [
                  `${s1["zh-CN"]}由因式定理，$${xm(c)}$ 是因式当且仅当 $p(${c}) = 0$${c < 0 ? `，因为 $${xm(c)} = x - (${c})$` : ""}：${steps(valueLine(cs, Q.of(c)))}`,
                  `${s2["zh-CN"]}${yes ? `因为 $p(${c}) = 0$，所以 $${xm(c)}$ 是因式。` : `因为 $p(${c}) = ${v} \\neq 0$，所以 $${xm(c)}$ 不是因式；相除会余下 $${v}$。`}`,
                  `**检验。** 用综合除法除以 $${xm(c)}$，得到相同的余数：${steps(division.latex)}余数是 $${division.remainder}$。`,
                ].join("\n\n"),
              ),
            }),
            [
              yes
                ? [
                    "No",
                    `$p(${c}) = 0$, so dividing by $${xm(c)}$ leaves no remainder: it is a factor.`,
                    `$p(${c}) = 0$，除以 $${xm(c)}$ 没有余数，所以它是因式。`,
                  ]
                : [
                    "Yes",
                    `$p(${c}) = ${v}$, not $0$, so dividing by $${xm(c)}$ leaves the remainder $${v}$.`,
                    `$p(${c}) = ${v}$ 不等于 $0$，除以 $${xm(c)}$ 会余下 $${v}$。`,
                  ],
            ],
          );
        }
      },
    },
    {
      id: "factors-from-roots",
      title: t("Factors from roots", "由根得因式"),
      explanation: t(
        "Read the factor theorem the other way: if $p(c) = 0$, then $x - c$ is a factor. For a fractional root $\\frac{b}{a}$, the factor $x - \\frac{b}{a}$ can be scaled by $a$ to clear the fraction:\n\n$$p\\left(\\frac{3}{2}\\right) = 0 \\implies x - \\frac{3}{2} \\text{ is a factor, and so is } 2x - 3$$\n\nCheck: $2x - 3 = 0$ gives $x = \\frac{3}{2}$. Similarly $p(-4) = 0$ means $x + 4$ is a factor.\n\n> **Watch out.** The root $\\frac{3}{2}$ goes with $2x - 3$, not with $2x + 3$, $3x - 2$ or $x - 3$. Test any candidate by setting it equal to zero: only the right one gives back the root.",
        "反过来用因式定理：若 $p(c) = 0$，则 $x - c$ 是因式。对于分数根 $\\frac{b}{a}$，可把因式 $x - \\frac{b}{a}$ 乘以 $a$ 去掉分母：\n\n$$p\\left(\\frac{3}{2}\\right) = 0 \\implies x - \\frac{3}{2} \\text{ 是因式，} 2x - 3 \\text{ 也是}$$\n\n检验：$2x - 3 = 0$ 得 $x = \\frac{3}{2}$。同理，$p(-4) = 0$ 说明 $x + 4$ 是因式。\n\n> **注意。** 根 $\\frac{3}{2}$ 对应的是 $2x - 3$，而不是 $2x + 3$、$3x - 2$ 或 $x - 3$。检验候选因式时令它等于零：只有正确的那个会解出这个根。",
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
          const pairs: readonly (readonly [number, number])[] = [
            [q, -s * pp],
            [q, s * pp],
            [pp, -s * q],
            [pp, s * q],
            [1, -s * pp],
            [1, s * pp],
          ];
          const options = [...new Set(candidates)].slice(0, 4);
          if (options.length < 4) continue;
          const order = rng.shuffle(options);
          const correct = order.indexOf(linear(q, -s * pp));
          const s1 = stepLabel(1, "Use the factor theorem", "用因式定理");
          const s2 = stepLabel(2, q === 1 ? "Write the factor" : "Clear the fraction", q === 1 ? "写出因式" : "去掉分母");
          const answer = linear(q, -s * pp);
          return reasoned(
            choiceProblem({
              prompt: t(
                `A polynomial $p(x)$ has $p\\left(${root.toLatex()}\\right) = 0$. Which of these must be a factor of $p(x)$?`,
                `多项式 $p(x)$ 满足 $p\\left(${root.toLatex()}\\right) = 0$。下列哪一个一定是 $p(x)$ 的因式？`,
              ),
              options: order.map((o) => same(`$${o}$`)),
              correct,
              solution: t(
                [
                  `${s1.en} Since $p\\left(${root.toLatex()}\\right) = 0$, the factor theorem says that $x - \\left(${root.toLatex()}\\right)$ is a factor of $p(x)$.`,
                  `${s2.en} ${q === 1 ? `$x - \\left(${root.toLatex()}\\right)$ simplifies to $${answer}$.` : `Multiplying a factor by the constant $${q}$ gives another factor, one with integer coefficients: $${q}\\left(x - ${parenQ(root)}\\right) = ${answer}$.`}`,
                  `**Check.** Setting the factor equal to zero gives back the root: $${linearRoot(q, -s * pp)}$.`,
                ].join("\n\n"),
                [
                  `${s1["zh-CN"]}因为 $p\\left(${root.toLatex()}\\right) = 0$，由因式定理，$x - \\left(${root.toLatex()}\\right)$ 是 $p(x)$ 的因式。`,
                  `${s2["zh-CN"]}${q === 1 ? `$x - \\left(${root.toLatex()}\\right)$ 化简为 $${answer}$。` : `因式乘以常数 $${q}$ 仍是因式，并且系数变成整数：$${q}\\left(x - ${parenQ(root)}\\right) = ${answer}$。`}`,
                  `**检验。** 令这个因式等于零，得回这个根：$${linearRoot(q, -s * pp)}$。`,
                ].join("\n\n"),
              ),
            }),
            pairs.map(([a, b]) => {
              const z = Q.of(-b, a).toLatex();
              return [
                `$${linear(a, b)}$`,
                `This is zero at $x = ${z}$, not at $x = ${root.toLatex()}$, so knowing $p\\left(${root.toLatex()}\\right) = 0$ says nothing about it.`,
                `它在 $x = ${z}$ 处为零，而不是在 $x = ${root.toLatex()}$ 处，所以由 $p\\left(${root.toLatex()}\\right) = 0$ 推不出它是因式。`,
              ] as const;
            }),
          );
        }
      },
    },
    {
      id: "finding-a-factor",
      title: t("Finding the factor", "找出因式"),
      explanation: t(
        "To decide which of several binomials is a factor, evaluate $p(x)$ at each candidate root. For $p(x) = x^{3} + 2x^{2} - 5x - 6$ and the candidates $x - 1$, $x + 1$, $x - 3$:\n\n$$p(1) = 1 + 2 - 5 - 6 = -8, \\quad p(-1) = -1 + 2 + 5 - 6 = 0, \\quad p(3) = 27 + 18 - 15 - 6 = 24$$\n\nOnly $p(-1) = 0$, so $x + 1$ is the factor.\n\n> **Watch out.** Match each candidate with the value at its own root, sign included: $x + 1$ needs $p(-1) = 0$, and $p(1) = 0$ would point to $x - 1$ instead.",
        "要判断几个二项式中哪个是因式，就在每个候选根处求 $p(x)$ 的值。对 $p(x) = x^{3} + 2x^{2} - 5x - 6$ 和候选 $x - 1$、$x + 1$、$x - 3$：\n\n$$p(1) = 1 + 2 - 5 - 6 = -8, \\quad p(-1) = -1 + 2 + 5 - 6 = 0, \\quad p(3) = 27 + 18 - 15 - 6 = 24$$\n\n只有 $p(-1) = 0$，所以 $x + 1$ 是因式。\n\n> **注意。** 每个候选因式要和它自己的根处的值对应，符号也要对：$x + 1$ 需要 $p(-1) = 0$；如果是 $p(1) = 0$，对应的是 $x - 1$。",
      ),
      generate(rng) {
        for (;;) {
          const cands = rng.sample([1, -1, 2, -2, 3, -3], 4);
          const root = rng.pick(cands);
          const quad = [1, rng.int(-5, 5), rng.nonZero(-6, 6)];
          const cs = mulP([1, -root], quad);
          if (cands.some((c) => c !== root && evalI(cs, c) === 0)) continue;
          const values = cands.map((c) => `p(${c}) = ${evalI(cs, c)}`).join(", \\quad ");
          return reasoned(
            choiceProblem({
              prompt: t(`Which of these is a factor of $p(x) = ${P(cs)}$?`, `下列哪一个是 $p(x) = ${P(cs)}$ 的因式？`),
              options: cands.map((c) => same(`$${xm(c)}$`)),
              correct: cands.indexOf(root),
              solution: (() => {
                const s1 = stepLabel(1, "Match each candidate with a value", "把候选因式与函数值对应");
                const s2 = stepLabel(2, "Evaluate", "求值");
                const division = synthetic(cs, root);
                const match = cands.map((c) => `${xm(c)} \\to p(${c})`).join(", \\quad ");
                return t(
                  [
                    `${s1.en} By the factor theorem, $x - c$ is a factor exactly when $p(c) = 0$. So each candidate goes with the value at its root:${steps(match)}`,
                    `${s2.en} Evaluate at each root:${steps(values)}Only $p(${root}) = 0$, so $${xm(root)}$ is the factor.`,
                    `**Check.** Synthetic division by $${xm(root)}$ leaves remainder $0$:${steps(division.latex)}So $p(x) = ${lf(1, -root)}(${P(division.quotient)})$.`,
                  ].join("\n\n"),
                  [
                    `${s1["zh-CN"]}由因式定理，$x - c$ 是因式当且仅当 $p(c) = 0$。所以每个候选因式对应它的根处的值：${steps(match)}`,
                    `${s2["zh-CN"]}逐个求值：${steps(values)}只有 $p(${root}) = 0$，所以 $${xm(root)}$ 是因式。`,
                    `**检验。** 用综合除法除以 $${xm(root)}$，余数为 $0$：${steps(division.latex)}所以 $p(x) = ${lf(1, -root)}(${P(division.quotient)})$。`,
                  ].join("\n\n"),
                );
              })(),
            }),
            [
              ...cands.map(
                (c) =>
                  [
                    `$${xm(c)}$`,
                    `This would need $p(${c}) = 0$, but $p(${c}) = ${evalI(cs, c)}$. Take care that the factor $x - c$ goes with the value at $c$, sign included.`,
                    `这需要 $p(${c}) = 0$，但 $p(${c}) = ${evalI(cs, c)}$。注意因式 $x - c$ 对应的是 $c$ 处的值，符号也要对应。`,
                  ] as const,
              ),
            ],
          );
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

/** solveK solves p(x0) = target for the coefficient k at index idx, as Q. */
function solveK(cs: Coefs, idx: number, x0: Q, target: Q = Q.zero): Q | undefined {
  const rest = evalQ(
    cs.map((c, i) => (i === idx ? 0 : c)),
    x0,
  );
  const coef = x0.pow(cs.length - 1 - idx);
  return coef.isZero() ? undefined : target.sub(rest).div(coef);
}

/** kSolution explains solving p(x0) = target for k, where cs already holds the value of k at index idx, and checks it. */
function kSolution(cs: Coefs, idx: number, x0: Q, target: Q, why: Text): Text {
  const rest = evalQ(
    cs.map((c, i) => (i === idx ? 0 : c)),
    x0,
  );
  const coef = x0.pow(cs.length - 1 - idx);
  const k = target.sub(rest).div(coef);
  const kTerm = `${coef.eq(Q.one) ? "" : coef.eq(Q.one.neg()) ? "-" : coef.toLatex()}k`;
  const lhs = `${kTerm}${rest.isZero() ? "" : rest.sign() < 0 ? ` - ${rest.abs().toLatex()}` : ` + ${rest.toLatex()}`}`;
  const lines = [`p\\left(${x0.toLatex()}\\right) = ${substituteK(cs, idx, x0.toLatex())} = ${lhs} = ${target.toLatex()}`];
  if (!rest.isZero()) lines.push(`${kTerm} = ${target.sub(rest).toLatex()}`);
  if (!coef.eq(Q.one)) lines.push(`k = ${k.toLatex()}`);
  if (!k.eq(Q.of(cs[idx]!))) throw new RangeError("kSolution: cs does not hold the value of k");
  const full = cs;
  const s1 = stepLabel(1, "Turn the condition into an equation", "把条件写成方程");
  const s2 = stepLabel(2, "Substitute and solve for $k$", "代入并解出 $k$");
  const division = x0.isInteger() ? synthetic(full, Number(x0.toString())) : undefined;
  const check = division
    ? t(
        `**Check.** With $k = ${k.toLatex()}$ the polynomial is $p(x) = ${P(full)}$. Synthetic division by $${xm(Number(x0.toString()))}$ leaves the required remainder $${target.toLatex()}$:${steps(division.latex)}`,
        `**检验。** 取 $k = ${k.toLatex()}$，多项式为 $p(x) = ${P(full)}$。用综合除法除以 $${xm(Number(x0.toString()))}$，余数正是 $${target.toLatex()}$：${steps(division.latex)}`,
      )
    : t(
        `**Check.** With $k = ${k.toLatex()}$ the polynomial is $p(x) = ${P(full)}$. Evaluating it at the root gives $${target.toLatex()}$: $${valueLine(full, x0)}$.`,
        `**检验。** 取 $k = ${k.toLatex()}$，多项式为 $p(x) = ${P(full)}$。在这个根处求值得 $${target.toLatex()}$：$${valueLine(full, x0)}$。`,
      );
  return t(
    `${s1.en} ${why.en}\n\n${s2.en} Put $x = ${x0.toLatex()}$ into $p(x)$, keeping $k$ as an unknown, and solve the linear equation:${steps(...lines)}\n\n${check.en}`,
    `${s1["zh-CN"]}${why["zh-CN"]}\n\n${s2["zh-CN"]}把 $x = ${x0.toLatex()}$ 代入 $p(x)$，$k$ 保留为未知数，再解这个一次方程：${steps(...lines)}\n\n${check["zh-CN"]}`,
  );
}

/** substituteK writes a polynomial with a value in place of x and the letter k as the coefficient at index idx. */
function substituteK(cs: Coefs, idx: number, v: string): string {
  const n = cs.length - 1;
  let out = "";
  cs.forEach((c, i) => {
    const e = n - i;
    const power = e === 0 ? "" : `\\left(${v}\\right)${e > 1 ? `^{${e}}` : ""}`;
    if (i === idx) {
      out += out === "" ? `k${power}` : ` + k${power}`;
      return;
    }
    if (c === 0) return;
    const a = Math.abs(c);
    const body = e === 0 ? String(a) : `${a === 1 ? "" : a}${power}`;
    out += out === "" ? `${c < 0 ? "-" : ""}${body}` : ` ${c < 0 ? "-" : "+"} ${body}`;
  });
  return out;
}

/** twoUnknownsSolution finds a and b in x³ + ax² + bx + d from the roots r and s by elimination, and checks both factors by synthetic division. */
function twoUnknownsSolution(r: number, s: number, a: number, b: number, d: number): Text {
  const e1 = -(r ** 3) - d;
  const e2 = -(s ** 3) - d;
  /** pAt writes p(x) with a and b as unknowns, equal to zero. */
  const pAt = (x: number, px = `\\left(${x}\\right)`) =>
    `p${px} = ${chain(`${px}^{3} + a${px}^{2} + b${px}${d < 0 ? ` - ${-d}` : ` + ${d}`}`, `${x ** 3}${joinPoly(poly([x * x, "a"], [x, "b"]))}${joinPoly(String(d))}`)} = 0`;
  const eq = (x: number) => `${poly([x * x, "a"], [x, "b"])} = ${-(x ** 3) - d}`;
  const m1 = `${poly([r * r * s, "a"], [r * s, "b"])} = ${e1 * s}`;
  const m2 = `${poly([s * s * r, "a"], [r * s, "b"])} = ${e2 * r}`;
  const diff = `${poly([r * r * s - s * s * r, "a"])} = ${e1 * s - e2 * r}`;
  if ((r * r * s - s * s * r) * a !== e1 * s - e2 * r || r * r * a + r * b !== e1)
    throw new RangeError("twoUnknownsSolution: a and b do not solve the system");
  const back = steps(`${poly([r * r * a, ""], [r, "b"])} = ${e1}`, `${poly([r, "b"])} = ${e1 - r * r * a}`, `b = ${b}`);
  const cs = [1, a, b, d];
  const first = synthetic(cs, r);
  const second = synthetic(first.quotient, s);
  const s1 = stepLabel(1, "Write one equation for each factor", "每个因式写一个方程");
  const s2 = stepLabel(2, "Eliminate $b$", "消去 $b$");
  const s3 = stepLabel(3, "Find $b$", "求出 $b$");
  const en = [
    `${s1.en} By the factor theorem, $${xm(r)}$ is a factor, so $p(${r}) = 0$, and $${xm(s)}$ is a factor, so $p(${s}) = 0$. Substituting each root, with $a$ and $b$ kept as unknowns:${steps(pAt(r), pAt(s))}Moving the numbers to the right gives a system of two linear equations:${steps(eq(r), eq(s))}`,
    `${s2.en} Both equations have a term in $b$. Multiply the first by $${s}$ and the second by $${r}$, so that the $b$ terms match:${steps(m1, m2)}Subtracting the second from the first removes $b$:${steps(diff, `a = ${a}`)}`,
    `${s3.en} Put $a = ${a}$ into the first equation:${back}So $a = ${a}$ and $b = ${b}$, and $p(x) = ${P(cs)}$.`,
    `**Check.** Divide by both factors with synthetic division. Dividing by $${xm(r)}$ leaves remainder $0$, and dividing the quotient by $${xm(s)}$ leaves $0$ again:${steps(first.latex, second.latex)}`,
  ];
  const zh = [
    `${s1["zh-CN"]}由因式定理，$${xm(r)}$ 是因式，所以 $p(${r}) = 0$；$${xm(s)}$ 是因式，所以 $p(${s}) = 0$。分别代入两个根，$a$ 和 $b$ 保留为未知数：${steps(pAt(r), pAt(s))}把数移到右边，得到一个二元一次方程组：${steps(eq(r), eq(s))}`,
    `${s2["zh-CN"]}两个方程都含 $b$ 的项。第一个方程乘 $${s}$，第二个方程乘 $${r}$，使 $b$ 的项相同：${steps(m1, m2)}第一个方程减去第二个方程，消去 $b$：${steps(diff, `a = ${a}`)}`,
    `${s3["zh-CN"]}把 $a = ${a}$ 代入第一个方程：${back}所以 $a = ${a}$，$b = ${b}$，$p(x) = ${P(cs)}$。`,
    `**检验。** 用综合除法分别除以两个因式。除以 $${xm(r)}$ 余数为 $0$，再把商除以 $${xm(s)}$，余数仍为 $0$：${steps(first.latex, second.latex)}`,
  ];
  return t(en.join("\n\n"), zh.join("\n\n"));
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
  intro: t(
    `The factor theorem says that $x - c$ is a factor of $p(x)$ exactly when $p(c) = 0$. So far we used it with a known polynomial, to test a factor. It also works backwards: when a factor is known but a coefficient is not, the condition $p(c) = 0$ becomes an equation for the missing coefficient.

Suppose $x - 1$ is a factor of $p(x) = x^{2} + kx + 4$. Then $p(1)$ must be zero:

$$p(1) = 1 + k + 4 = k + 5 = 0$$

This gives $k = -5$. To see that this is right, factor the result: $x^{2} - 5x + 4$ factors as $(x - 1)(x - 4)$, so $x - 1$ is indeed a factor.

One known factor fixes one unknown coefficient. With two unknowns we need two factors, which give two linear equations, solved by elimination. In this lesson we find one unknown from a factor $x - c$, one from a factor $ax - b$, and two from two factors.`,
    `因式定理说：$x - c$ 是 $p(x)$ 的因式当且仅当 $p(c) = 0$。前面我们用它检验已知多项式的因式。它也可以反过来用：已知因式而某个系数未知时，条件 $p(c) = 0$ 就成为关于这个系数的方程。

设 $x - 1$ 是 $p(x) = x^{2} + kx + 4$ 的因式，那么 $p(1)$ 必须为零：

$$p(1) = 1 + k + 4 = k + 5 = 0$$

所以 $k = -5$。把结果因式分解来验证：$x^{2} - 5x + 4 = (x - 1)(x - 4)$，$x - 1$ 确实是因式。

一个已知因式确定一个未知系数。有两个未知数时需要两个因式，它们给出两个一次方程，用消元法求解。本课由因式 $x - c$ 求一个未知系数，由因式 $ax - b$ 求一个未知系数，以及由两个因式求两个未知系数。`,
  ),
  knowledgePoints: [
    {
      id: "one-unknown-coefficient",
      title: t("One unknown coefficient", "一个未知系数"),
      explanation: t(
        "If $x - c$ is a factor of $p(x)$, then $p(c) = 0$. With one unknown coefficient this is a linear equation.\n\n$x - 2$ is a factor of $p(x) = x^{3} + kx^{2} - 5x + 6$:\n\n$$p(2) = 8 + 4k - 10 + 6 = 4k + 4 = 0 \\implies k = -1$$\n\nFor a factor $x + 3$, substitute $x = -3$.\n\n> **Watch out.** Substitute the root of the factor: $x - c$ gives $x = c$, and $x + 3$ gives $x = -3$. Substituting the opposite number gives a wrong $k$. When moving the other terms across, change their sign, or the answer comes out as $-k$.",
        "若 $x - c$ 是 $p(x)$ 的因式，则 $p(c) = 0$。只有一个未知系数时，这是一个一次方程。\n\n$x - 2$ 是 $p(x) = x^{3} + kx^{2} - 5x + 6$ 的因式：\n\n$$p(2) = 8 + 4k - 10 + 6 = 4k + 4 = 0 \\implies k = -1$$\n\n若因式是 $x + 3$，则代入 $x = -3$。\n\n> **注意。** 要代入因式的根：$x - c$ 对应 $x = c$，$x + 3$ 对应 $x = -3$。代入相反数会得到错误的 $k$。把其他项移到另一边时要变号，否则会得到 $-k$。",
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
        "By the factor theorem, a linear expression is a factor of a polynomial exactly when its root makes the polynomial zero. Substitute the root and solve for the unknown coefficient.\n\nIf $ax - b$ is a factor, the root is $x = \\frac{b}{a}$, so $p\\left(\\frac{b}{a}\\right) = 0$.\n\n$2x - 1$ is a factor of $p(x) = 2x^{3} + x^{2} + kx + 1$:\n\n$$p\\left(\\frac{1}{2}\\right) = \\frac{1}{4} + \\frac{1}{4} + \\frac{1}{2}k + 1 = \\frac{1}{2}k + \\frac{3}{2} = 0 \\implies k = -3$$\n\n> **Watch out.** The root of $ax - b$ is $\\frac{b}{a}$. Substituting $b$, or the opposite $-\\frac{b}{a}$, gives a wrong $k$, and so does a sign slip when the constant moves across.",
        "由因式定理，一个一次式是多项式的因式，当且仅当它的根使多项式等于零。代入这个根，解出未知的系数。\n\n若 $ax - b$ 是因式，则根为 $x = \\frac{b}{a}$，所以 $p\\left(\\frac{b}{a}\\right) = 0$。\n\n$2x - 1$ 是 $p(x) = 2x^{3} + x^{2} + kx + 1$ 的因式：\n\n$$p\\left(\\frac{1}{2}\\right) = \\frac{1}{4} + \\frac{1}{4} + \\frac{1}{2}k + 1 = \\frac{1}{2}k + \\frac{3}{2} = 0 \\implies k = -3$$\n\n> **注意。** $ax - b$ 的根是 $\\frac{b}{a}$。代入 $b$，或代入相反数 $-\\frac{b}{a}$，都会得到错误的 $k$；移项时符号出错也一样。",
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
        "Two known factors give two equations, one for each root; solve them as a system.\n\n$x - 1$ and $x + 2$ are factors of $p(x) = x^{3} + ax^{2} + bx - 6$:\n\n$$p(1) = 1 + a + b - 6 = 0 \\implies a + b = 5$$\n\n$$p(-2) = -8 + 4a - 2b - 6 = 0 \\implies 4a - 2b = 14$$\n\nSolving the system gives $a = 4$ and $b = 1$.\n\n> **Watch out.** Each factor is used at its own root: $x + 2$ gives $p(-2)$, not $p(2)$. Keep track of which unknown multiplies $x^{2}$ and which multiplies $x$; swapping $a$ and $b$, or changing both signs, does not satisfy the equations.",
        "两个已知因式给出两个方程（每个根一个），把它们作为方程组求解。\n\n$x - 1$ 和 $x + 2$ 是 $p(x) = x^{3} + ax^{2} + bx - 6$ 的因式：\n\n$$p(1) = 1 + a + b - 6 = 0 \\implies a + b = 5$$\n\n$$p(-2) = -8 + 4a - 2b - 6 = 0 \\implies 4a - 2b = 14$$\n\n解方程组得 $a = 4$，$b = 1$。\n\n> **注意。** 每个因式都要在它自己的根处求值：$x + 2$ 对应 $p(-2)$，而不是 $p(2)$。要分清哪个未知数乘 $x^{2}$，哪个乘 $x$；把 $a$ 和 $b$ 对调，或把两者都变号，都不满足方程。",
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
        const flipped = solve(-r, -s);
        return pointProblem({
          prompt: t(
            `$${xm(r)}$ and $${xm(s)}$ are factors of $p(x) = x^{3} + ax^{2} + bx ${d < 0 ? "-" : "+"} ${Math.abs(d)}$. Find $a$ and $b$.`,
            `$${xm(r)}$ 和 $${xm(s)}$ 是 $p(x) = x^{3} + ax^{2} + bx ${d < 0 ? "-" : "+"} ${Math.abs(d)}$ 的因式。求 $a$ 和 $b$。`,
          ),
          answer: [a, b],
          vars: ["a", "b"],
          wrong: [[b, a], [-a, -b], flipped],
          solution: twoUnknownsSolution(r, s, a, b, d),
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

/** Split are the factors (p₁x + q₁)(p₂x + q₂) of a quadratic. */
type Split = readonly [number, number, number, number];

/** quadText explains factoring a quadratic: two numbers with product and sum when it is monic, the ac-method otherwise, or the discriminant when f is missing and it does not factor. */
function quadText(quad: Coefs, f?: Split): Text {
  const [a, b, c] = quad as [number, number, number];
  if (!f) {
    const D = b * b - 4 * a * c;
    const disc = steps(
      `b^{2} - 4ac = ${chain(`${parenQ(Q.of(b))}^{2} - 4${a === 1 ? "" : ` \\cdot ${a}`} \\cdot ${parenQ(Q.of(c))}`, String(D))}`,
    );
    return t(
      `Its discriminant is ${D < 0 ? "negative" : "not a perfect square"}:${disc}So $${P(quad)}$ has no rational roots, and by the factor theorem no linear factor with integer coefficients; it does not factor further.`,
      `它的判别式${D < 0 ? "是负数" : "不是完全平方数"}：${disc}所以 $${P(quad)}$ 没有有理根，由因式定理也就没有整系数的一次因式，不能再分解。`,
    );
  }
  const [p1, q1, p2, q2] = f;
  const res = `${lf(p1, q1)}${lf(p2, q2)}`;
  if (a === 1)
    return t(
      `Look for two numbers whose product is the constant term $${c}$ and whose sum is the coefficient $${b}$ of $x$. They are $${q1}$ and $${q2}$, so${steps(`${P(quad)} = ${res}`)}`,
      `找两个数，它们的积是常数项 $${c}$，和是 $x$ 的系数 $${b}$。这两个数是 $${q1}$ 和 $${q2}$，所以${steps(`${P(quad)} = ${res}`)}`,
    );
  const m = p1 * q2;
  const n = q1 * p2;
  const split = `${poly([a, "x^{2}"])}${joinPoly(poly([m, "x"]))}${joinPoly(poly([n, "x"]))}${joinPoly(String(c))}`;
  const second = `${q1 < 0 ? " - " : " + "}${Math.abs(q1) === 1 ? "" : Math.abs(q1)}(${linear(p2, q2)})`;
  const groups = `${monoFront(p1, 1)}(${linear(p2, q2)})${second}`;
  const work = steps(chain(P(quad), split, groups, res));
  return t(
    `Use the ac-method. Here $ac = ${a} \\cdot ${parenQ(Q.of(c))} = ${a * c}$; two numbers with product $${a * c}$ and sum $${b}$ are $${m}$ and $${n}$. Split the middle term into these two parts and factor by grouping:${work}`,
    `用 ac 法。这里 $ac = ${a} \\cdot ${parenQ(Q.of(c))} = ${a * c}$；积为 $${a * c}$、和为 $${b}$ 的两个数是 $${m}$ 和 $${n}$。把中间项拆成这两部分，再分组分解：${work}`,
  );
}

/** divideStep explains one synthetic division by a factor x − c, with the result written as a product. */
function divideStep(cs: Coefs, c: number, before: string, name = "p(x)"): Text {
  const s = synthetic(cs, c);
  const line = steps(`${before}${lf(1, -c)}(${P(s.quotient)})`);
  return t(
    `Divide $${name}$ by $${xm(c)}$ with synthetic division, using $c = ${c}$:${steps(s.latex)}The remainder is $0$, as the factor theorem promises, and the quotient is $${P(s.quotient)}$. So${line}`,
    `用综合除法把 $${name}$ 除以 $${xm(c)}$，取 $c = ${c}$：${steps(s.latex)}余数为 $0$，正如因式定理所说，商为 $${P(s.quotient)}$。所以${line}`,
  );
}

/** rootSearch explains testing the divisors of the constant term until a root. */
function rootSearch(cs: Coefs, order: readonly number[], name = "p"): { text: Text; root: number } {
  const { line, root } = testLine(cs, order);
  const shown = steps(name === "p" ? line : line.replace(/p\(/g, `${name}(`));
  const d = cs[cs.length - 1]!;
  return {
    root,
    text: t(
      `An integer root of a polynomial with leading coefficient $1$ divides the constant term, here $${d}$. Test its divisors in turn:${shown}So $${xm(root)}$ is a factor.`,
      `首项系数为 $1$ 的多项式的整数根整除常数项，这里是 $${d}$。依次试验它的因数：${shown}所以 $${xm(root)}$ 是因式。`,
    ),
  };
}

/** splitFactors turns a split of a quadratic into factors for a check. */
const splitFactors = (quad: Coefs, f?: Split): FactorPower[] =>
  f
    ? [
        [[f[0], f[1]], 1],
        [[f[2], f[3]], 1],
      ]
    : [[quad, 1]];

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
    { topic: "dividing-polynomials-using-synthetic-division", weight: 0.3 },
    { topic: "factoring-trinomials", weight: 0.5 },
    { topic: "factoring-trinomials-with-leading-coefficients", weight: 0.3 },
  ],
  xp: 16,
  standards: ["CCSS.HSA.APR.B.2", "CCSS.HSA.APR.B.3"],
  intro: t(
    `We can factor quadratics, and the factor theorem tells us that a root $c$ of a polynomial gives a factor $x - c$. Together they factor a cubic: one root splits off a linear factor, the quotient is a quadratic, and the quadratic we already know how to factor. Factored, a cubic shows its roots, which is what we need to solve cubic equations and to sketch cubic graphs.

Take $p(x) = x^{3} - 2x^{2} - x + 2$. Trying $x = 1$:

$$p(1) = 1 - 2 - 1 + 2 = 0$$

So $x - 1$ is a factor. Synthetic division by $x - 1$ leaves remainder $0$ and the quotient $x^{2} - x - 2$:

$$\\begin{array}{r|rrrr} 1 & 1 & -2 & -1 & 2 \\\\ & & 1 & -1 & -2 \\\\ \\hline & 1 & -1 & -2 & 0 \\end{array}$$

The quotient factors as $(x - 2)(x + 1)$, so

$$x^{3} - 2x^{2} - x + 2 = (x - 1)(x - 2)(x + 1)$$

At $x = 0$ both sides give $2$, as they should. In this lesson we divide out a given factor, find a factor ourselves by testing divisors of the constant term, and factor quotients with a leading coefficient.`,
    `我们会分解二次式，而因式定理告诉我们：多项式的根 $c$ 给出因式 $x - c$。两者结合就能分解三次式：用一个根分出一个一次因式，商是二次式，而二次式我们已经会分解。分解后的三次式直接显示它的根，解三次方程、画三次函数的图像都要用到。

取 $p(x) = x^{3} - 2x^{2} - x + 2$。试 $x = 1$：

$$p(1) = 1 - 2 - 1 + 2 = 0$$

所以 $x - 1$ 是因式。用综合除法除以 $x - 1$，余数为 $0$，商为 $x^{2} - x - 2$：

$$\\begin{array}{r|rrrr} 1 & 1 & -2 & -1 & 2 \\\\ & & 1 & -1 & -2 \\\\ \\hline & 1 & -1 & -2 & 0 \\end{array}$$

商可以分解为 $(x - 2)(x + 1)$，所以

$$x^{3} - 2x^{2} - x + 2 = (x - 1)(x - 2)(x + 1)$$

在 $x = 0$ 处两边都等于 $2$，符合预期。本课先除去已知因式，再通过试验常数项的因数自己找因式，最后分解首项系数不为 1 的商。`,
  ),
  knowledgePoints: [
    {
      id: "a-given-factor",
      title: t("Dividing out a given factor", "除去已知因式"),
      explanation: t(
        `If $x - c$ is a factor, synthetic division by $x - c$ leaves a quadratic quotient with remainder $0$; then factor the quotient.\n\nGiven that $x - 2$ is a factor of $x^{3} - 4x^{2} + x + 6$:\n\n$$${exSynthetic}$$\n\n$$x^{3} - 4x^{2} + x + 6 = (x - 2)(x^{2} - 2x - 3) = (x - 2)(x - 3)(x + 1)$$\n\n> **Watch out.** The given factor $x - c$ stays as it is in the answer; writing $x + c$ instead is a different polynomial. "Completely" means the quotient must be factored too whenever it can be, and the signs in its factors must give the right product and sum.`,
        `若 $x - c$ 是因式，用综合除法除以 $x - c$ 会得到余数为 $0$ 的二次商式，再分解这个商。\n\n已知 $x - 2$ 是 $x^{3} - 4x^{2} + x + 6$ 的因式：\n\n$$${exSynthetic}$$\n\n$$x^{3} - 4x^{2} + x + 6 = (x - 2)(x^{2} - 2x - 3) = (x - 2)(x - 3)(x + 1)$$\n\n> **注意。** 已知因式 $x - c$ 在答案中保持不变，写成 $x + c$ 就是另一个多项式了。"彻底"分解意味着商只要能分解就必须分解，而且它的因式中的符号要使积与和都对。`,
      ),
      generate(rng) {
        for (;;) {
          const c = rng.nonZero(-4, 4);
          let quad: number[];
          let f: Split | undefined;
          if (rng.bool(0.7)) {
            const r = rng.nonZero(-6, 6);
            const s = rng.nonZero(-6, 6);
            if (r === s || r === c || s === c) continue;
            quad = mulP([1, -r], [1, -s]);
            f = [1, -r, 1, -s];
          } else {
            quad = [1, rng.int(-5, 5), rng.nonZero(-7, 7)];
            if (!irreducible(quad[1]!, quad[2]!)) continue;
          }
          const cs = mulP([1, -c], quad);
          const answer = `${lf(1, -c)}${quadFactors(quad)}`;
          const s1 = stepLabel(1, "Divide out the given factor", "除去已知因式");
          const s2 = stepLabel(2, "Factor the quotient", "分解商");
          const div = divideStep(cs, c, `${P(cs)} = `);
          const q = quadText(quad, f);
          const end = f ? steps(`${P(cs)} = ${answer}`) : "";
          const check = factorCheck(cs, [[[1, -c], 1], ...splitFactors(quad, f)]);
          return factoredProblem({
            prompt: t(
              `Given that $${xm(c)}$ is a factor of $p(x) = ${P(cs)}$, factor $p(x)$ completely.`,
              `已知 $${xm(c)}$ 是 $p(x) = ${P(cs)}$ 的因式，把 $p(x)$ 彻底分解因式。`,
            ),
            answer,
            wrong: [`${lf(1, c)}${quadFactors(quad)}`, `${lf(1, -c)}(${P(quad)})`, `${lf(1, -c)}${quadFactors([1, -quad[1]!, quad[2]!])}`],
            solution: t(
              `${s1.en} ${div.en}\n\n${s2.en} ${q.en}${f ? `Putting the factors together:${end}` : ""}\n\n${check.en}`,
              `${s1["zh-CN"]}${div["zh-CN"]}\n\n${s2["zh-CN"]}${q["zh-CN"]}${f ? `把因式合在一起：${end}` : ""}\n\n${check["zh-CN"]}`,
            ),
          });
        }
      },
    },
    {
      id: "finding-a-root",
      title: t("Finding a root first", "先找出一个根"),
      explanation: t(
        "When no factor is given, look for an integer root. For a polynomial with leading coefficient $1$ and integer coefficients, any integer root divides the constant term, so test those divisors: $\\pm 1, \\pm 2, \\dots$\n\nFor $x^{3} - 7x - 6$, the constant term is $-6$:\n\n$$p(1) = -12, \\quad p(-1) = 0$$\n\nSo $x + 1$ is a factor. Dividing gives $x^{2} - x - 6$, and\n\n$$x^{3} - 7x - 6 = (x + 1)(x - 3)(x + 2)$$\n\n> **Watch out.** A root $c$ gives the factor $x - c$: from $p(-1) = 0$ the factor is $x + 1$, not $x - 1$. Getting this sign wrong flips every factor. Do not stop after the first factor; the quotient may factor further.",
        "没有给出因式时，先找整数根。首项系数为 $1$ 的整系数多项式，其整数根一定整除常数项，所以逐个试验这些因数：$\\pm 1, \\pm 2, \\dots$\n\n对 $x^{3} - 7x - 6$，常数项是 $-6$：\n\n$$p(1) = -12, \\quad p(-1) = 0$$\n\n所以 $x + 1$ 是因式。相除得 $x^{2} - x - 6$，于是\n\n$$x^{3} - 7x - 6 = (x + 1)(x - 3)(x + 2)$$\n\n> **注意。** 根 $c$ 给出因式 $x - c$：由 $p(-1) = 0$ 得到的因式是 $x + 1$，而不是 $x - 1$。这个符号弄错，每个因式都会反号。找到第一个因式后不要停下，商可能还能分解。",
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
          const search = rootSearch(cs, [1, -1, 2, -2, 3, -3]);
          const root = search.root;
          const s = synthetic(cs, root);
          const rest = roots.length === 3 ? roots.filter((r) => r !== root) : [];
          const f: Split | undefined = rest.length === 2 ? [1, -rest[0]!, 1, -rest[1]!] : undefined;
          const answer = rest.length === 2 ? `${lf(1, -root)}${lf(1, -rest[0]!)}${lf(1, -rest[1]!)}` : `${lf(1, -root)}(${P(quad)})`;
          const s1 = stepLabel(1, "Find a root", "找一个根");
          const s2 = stepLabel(2, "Divide", "相除");
          const s3 = stepLabel(3, "Factor the quotient", "分解商");
          const div = divideStep(cs, root, `${P(cs)} = `);
          const q = quadText(s.quotient, f);
          const end = f ? steps(`${P(cs)} = ${answer}`) : "";
          const check = factorCheck(cs, [[[1, -root], 1], ...splitFactors(s.quotient, f)]);
          return factoredProblem({
            prompt: t(`Factor $${P(cs)}$ completely.`, `将 $${P(cs)}$ 彻底分解因式。`),
            answer,
            wrong: [
              `${lf(1, root)}(${P(s.quotient)})`,
              ...(rest.length === 2 ? [`${lf(1, root)}${lf(1, rest[0]!)}${lf(1, rest[1]!)}`] : [`${lf(1, root)}(${P(quad)})`]),
            ],
            solution: t(
              `${s1.en} ${search.text.en}\n\n${s2.en} ${div.en}\n\n${s3.en} ${q.en}${f ? `Putting the factors together:${end}` : ""}\n\n${check.en}`,
              `${s1["zh-CN"]}${search.text["zh-CN"]}\n\n${s2["zh-CN"]}${div["zh-CN"]}\n\n${s3["zh-CN"]}${q["zh-CN"]}${f ? `把因式合在一起：${end}` : ""}\n\n${check["zh-CN"]}`,
            ),
          });
        }
      },
    },
    {
      id: "leading-coefficients",
      title: t("A quotient with a leading coefficient", "首项系数不为 1 的商"),
      explanation: t(
        "When the cubic has a leading coefficient, so does the quadratic quotient; factor it with the ac-method.\n\nGiven that $x + 1$ is a factor of $6x^{3} + 7x^{2} - 1$, synthetic division with $c = -1$ gives the quotient $6x^{2} + x - 1$, which factors further:\n\n$$6x^{3} + 7x^{2} - 1 = (x + 1)(6x^{2} + x - 1) = (x + 1)(3x - 1)(2x + 1)$$\n\n> **Watch out.** In the ac-method the two numbers need the product $ac$ and the sum $b$. With their signs swapped, $(3x + 1)(2x - 1)$ multiplies to $6x^{2} - x - 1$, not $6x^{2} + x - 1$: expand the factors to compare the middle term. And keep the given factor's sign: $x + 1$ goes with $c = -1$.",
        "三次式的首项系数不为 1 时，二次商式的首项系数也不为 1，用 ac 法分解。\n\n例如已知 $x + 1$ 是 $6x^{3} + 7x^{2} - 1$ 的因式，取 $c = -1$ 做综合除法得商 $6x^{2} + x - 1$，再分解：\n\n$$6x^{3} + 7x^{2} - 1 = (x + 1)(6x^{2} + x - 1) = (x + 1)(3x - 1)(2x + 1)$$\n\n> **注意。** ac 法中两个数的积要等于 $ac$，和要等于 $b$。符号对调后，$(3x + 1)(2x - 1)$ 展开是 $6x^{2} - x - 1$，而不是 $6x^{2} + x - 1$：把因式展开，对比中间项。已知因式的符号也要保持：$x + 1$ 对应 $c = -1$。",
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
          const f: Split = [p1, q1, p2, q2];
          const s1 = stepLabel(1, "Divide out the given factor", "除去已知因式");
          const s2 = stepLabel(2, "Factor the quotient", "分解商");
          const div = divideStep(cs, c, `${P(cs)} = `);
          const q = quadText(quad, f);
          const end = steps(`${P(cs)} = ${answer}`);
          const check = factorCheck(cs, [[[1, -c], 1], ...splitFactors(quad, f)]);
          return factoredProblem({
            prompt: t(
              `Given that $${xm(c)}$ is a factor of $p(x) = ${P(cs)}$, factor $p(x)$ completely.`,
              `已知 $${xm(c)}$ 是 $p(x) = ${P(cs)}$ 的因式，把 $p(x)$ 彻底分解因式。`,
            ),
            answer,
            wrong: [`${lf(1, c)}${lf(p1, q1)}${lf(p2, q2)}`, `${lf(1, -c)}${lf(p1, -q1)}${lf(p2, -q2)}`, `${lf(1, -c)}(${P(quad)})`],
            solution: t(
              `${s1.en} ${div.en}\n\n${s2.en} ${q.en}Putting the factors together:${end}\n\n${check.en}`,
              `${s1["zh-CN"]}${div["zh-CN"]}\n\n${s2["zh-CN"]}${q["zh-CN"]}把因式合在一起：${end}\n\n${check["zh-CN"]}`,
            ),
          });
        }
      },
    },
  ],
};

// ─── 2.7.4 Factoring quartic polynomials using the factor theorem ──────────

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
  intro: t(
    `To factor a cubic we split off one linear factor with the factor theorem and factored the quadratic quotient. A quartic needs one more round: each linear factor we divide out lowers the degree by one, so two divisions bring a quartic down to a quadratic.

Take $p(x) = x^{4} + x^{3} - x^{2} + x - 2$. Since $p(1) = 0$, divide by $x - 1$:

$$\\begin{array}{r|rrrrr} 1 & 1 & 1 & -1 & 1 & -2 \\\\ & & 1 & 2 & 1 & 2 \\\\ \\hline & 1 & 2 & 1 & 2 & 0 \\end{array}$$

The quotient $q(x) = x^{3} + 2x^{2} + x + 2$ has $q(-2) = 0$, so divide it by $x + 2$:

$$\\begin{array}{r|rrrr} -2 & 1 & 2 & 1 & 2 \\\\ & & -2 & 0 & -2 \\\\ \\hline & 1 & 0 & 1 & 0 \\end{array}$$

What is left is $x^{2} + 1$, which has no real roots and does not factor. So

$$x^{4} + x^{3} - x^{2} + x - 2 = (x - 1)(x + 2)(x^{2} + 1)$$

At $x = 0$ both sides give $-2$. In this lesson we divide out two given factors, find two roots ourselves, and finish with quadratics that have a leading coefficient.`,
    `分解三次式时，我们用因式定理分出一个一次因式，再分解二次的商。四次式要多做一轮：每除去一个一次因式，次数降低一次，所以两次相除就把四次式降为二次式。

取 $p(x) = x^{4} + x^{3} - x^{2} + x - 2$。因为 $p(1) = 0$，除以 $x - 1$：

$$\\begin{array}{r|rrrrr} 1 & 1 & 1 & -1 & 1 & -2 \\\\ & & 1 & 2 & 1 & 2 \\\\ \\hline & 1 & 2 & 1 & 2 & 0 \\end{array}$$

商 $q(x) = x^{3} + 2x^{2} + x + 2$ 满足 $q(-2) = 0$，所以再除以 $x + 2$：

$$\\begin{array}{r|rrrr} -2 & 1 & 2 & 1 & 2 \\\\ & & -2 & 0 & -2 \\\\ \\hline & 1 & 0 & 1 & 0 \\end{array}$$

剩下 $x^{2} + 1$，它没有实根，不能再分解。所以

$$x^{4} + x^{3} - x^{2} + x - 2 = (x - 1)(x + 2)(x^{2} + 1)$$

在 $x = 0$ 处两边都等于 $-2$。本课先除去两个已知因式，再自己找出两个根，最后处理首项系数不为 1 的二次式。`,
  ),
  knowledgePoints: [
    {
      id: "two-given-factors",
      title: t("Two given factors", "两个已知因式"),
      explanation: t(
        `Divide by the first factor, then divide the cubic quotient by the second factor, then factor the quadratic that is left.\n\nGiven that $x + 1$ and $x - 2$ are factors of $x^{4} - 2x^{3} - 7x^{2} + 8x + 12$, divide with $c = -1$ and then with $c = 2$:\n\n$$${synthetic([1, -2, -7, 8, 12], -1).latex}$$\n\n$$${synthetic([1, -3, -4, 12], 2).latex}$$\n\n$$x^{4} - 2x^{3} - 7x^{2} + 8x + 12 = (x + 1)(x - 2)(x^{2} - x - 6) = (x + 1)(x - 2)(x - 3)(x + 2)$$\n\n> **Watch out.** Divide the second time into the cubic quotient, not into the original quartic. The given factors keep their signs in the answer, and the quadratic that is left must be factored too when it can be.`,
        `先除以第一个因式，再用第二个因式除三次商式，最后分解剩下的二次式。\n\n已知 $x + 1$ 和 $x - 2$ 是 $x^{4} - 2x^{3} - 7x^{2} + 8x + 12$ 的因式：\n\n$$${synthetic([1, -2, -7, 8, 12], -1).latex}$$\n\n$$${synthetic([1, -3, -4, 12], 2).latex}$$\n\n$$x^{4} - 2x^{3} - 7x^{2} + 8x + 12 = (x + 1)(x - 2)(x^{2} - x - 6) = (x + 1)(x - 2)(x - 3)(x + 2)$$\n\n> **注意。** 第二次相除要除三次商式，而不是原来的四次式。已知因式在答案中保持原来的符号，剩下的二次式能分解的也必须分解。`,
      ),
      generate(rng) {
        for (;;) {
          const [c1, c2] = rng.sample([1, -1, 2, -2, 3, -3], 2) as [number, number];
          let quad: number[];
          let f: Split | undefined;
          if (rng.bool(0.6)) {
            const r = rng.nonZero(-5, 5);
            const s = rng.nonZero(-5, 5);
            if (new Set([c1, c2, r, s]).size < 4) continue;
            quad = mulP([1, -r], [1, -s]);
            f = [1, -r, 1, -s];
          } else {
            quad = [1, rng.int(-4, 4), rng.nonZero(-6, 6)];
            if (!irreducible(quad[1]!, quad[2]!)) continue;
          }
          const cs = mulP([1, -c1], [1, -c2], quad);
          const cubic = synthetic(cs, c1).quotient;
          const answer = `${lf(1, -c1)}${lf(1, -c2)}${quadFactors(quad)}`;
          const s1 = stepLabel(1, "Divide by the first factor", "除以第一个因式");
          const s2 = stepLabel(2, "Divide the quotient by the second factor", "用第二个因式除商");
          const s3 = stepLabel(3, "Factor the quadratic", "分解二次式");
          const d1 = divideStep(cs, c1, `${P(cs)} = `);
          const d2 = divideStep(cubic, c2, `${P(cs)} = ${lf(1, -c1)}`, "q(x)");
          const q = quadText(quad, f);
          const end = f ? steps(`${P(cs)} = ${answer}`) : "";
          const check = factorCheck(cs, [[[1, -c1], 1], [[1, -c2], 1], ...splitFactors(quad, f)]);
          return factoredProblem({
            prompt: t(
              `Given that $${xm(c1)}$ and $${xm(c2)}$ are factors of $p(x) = ${P(cs)}$, factor $p(x)$ completely.`,
              `已知 $${xm(c1)}$ 和 $${xm(c2)}$ 是 $p(x) = ${P(cs)}$ 的因式，把 $p(x)$ 彻底分解因式。`,
            ),
            answer,
            wrong: [`${lf(1, c1)}${lf(1, c2)}${quadFactors(quad)}`, `${lf(1, -c1)}${lf(1, -c2)}(${P(quad)})`],
            solution: t(
              `${s1.en} ${d1.en}\n\n${s2.en} Call this quotient $q(x)$. ${d2.en}\n\n${s3.en} ${q.en}${f ? `Putting the factors together:${end}` : ""}\n\n${check.en}`,
              `${s1["zh-CN"]}${d1["zh-CN"]}\n\n${s2["zh-CN"]}把这个商记作 $q(x)$。${d2["zh-CN"]}\n\n${s3["zh-CN"]}${q["zh-CN"]}${f ? `把因式合在一起：${end}` : ""}\n\n${check["zh-CN"]}`,
            ),
          });
        }
      },
    },
    {
      id: "finding-two-roots",
      title: t("Finding two roots", "找出两个根"),
      explanation: t(
        "With no factor given, test the divisors of the constant term to find a root, divide, and test again on the cubic quotient.\n\nFor $x^{4} + x^{3} - 7x^{2} - x + 6$: $p(1) = 0$, so divide by $x - 1$ to get $x^{3} + 2x^{2} - 5x - 6$. For this cubic, $q(-1) = 0$, so divide by $x + 1$ to get $x^{2} + x - 6 = (x + 3)(x - 2)$:\n\n$$x^{4} + x^{3} - 7x^{2} - x + 6 = (x - 1)(x + 1)(x + 3)(x - 2)$$\n\n> **Watch out.** Each root $c$ gives the factor $x - c$, so $q(-1) = 0$ gives $x + 1$. Getting the sign wrong flips the factors. Do not stop after one division: the cubic quotient still has to be broken down.",
        "没有给出因式时，试验常数项的因数找到一个根，相除，再对三次商式继续试验。\n\n对 $x^{4} + x^{3} - 7x^{2} - x + 6$：$p(1) = 0$，除以 $x - 1$ 得 $x^{3} + 2x^{2} - 5x - 6$。对这个三次式，$q(-1) = 0$，除以 $x + 1$ 得 $x^{2} + x - 6 = (x + 3)(x - 2)$：\n\n$$x^{4} + x^{3} - 7x^{2} - x + 6 = (x - 1)(x + 1)(x + 3)(x - 2)$$\n\n> **注意。** 每个根 $c$ 给出因式 $x - c$，所以 $q(-1) = 0$ 给出 $x + 1$。符号弄错，因式就都反号了。除过一次后不要停下：三次的商还要继续分解。",
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
          const first = rootSearch(cs, order);
          const q1 = synthetic(cs, first.root);
          const second = rootSearch(q1.quotient, order, "q");
          const q2 = synthetic(q1.quotient, second.root);
          const rest = roots.filter((r) => r !== first.root && r !== second.root);
          const f: Split | undefined = rest.length === 2 ? [1, -rest[0]!, 1, -rest[1]!] : undefined;
          const tail = rest.length === 2 ? `${lf(1, -rest[0]!)}${lf(1, -rest[1]!)}` : `(${P(q2.quotient)})`;
          const answer = `${lf(1, -first.root)}${lf(1, -second.root)}${tail}`;
          const s1 = stepLabel(1, "Find a root", "找一个根");
          const s2 = stepLabel(2, "Divide", "相除");
          const s3 = stepLabel(3, "Find a root of the quotient", "找商的一个根");
          const s4 = stepLabel(4, "Divide again", "再相除");
          const s5 = stepLabel(5, "Factor the quadratic", "分解二次式");
          const d1 = divideStep(cs, first.root, `${P(cs)} = `);
          const d2 = divideStep(q1.quotient, second.root, `${P(cs)} = ${lf(1, -first.root)}`, "q(x)");
          const q = quadText(q2.quotient, f);
          const end = f ? steps(`${P(cs)} = ${answer}`) : "";
          const check = factorCheck(cs, [[[1, -first.root], 1], [[1, -second.root], 1], ...splitFactors(q2.quotient, f)]);
          return factoredProblem({
            prompt: t(`Factor $${P(cs)}$ completely.`, `将 $${P(cs)}$ 彻底分解因式。`),
            answer,
            wrong: [`${lf(1, first.root)}${lf(1, second.root)}${tail}`, `${lf(1, -first.root)}(${P(q1.quotient)})`],
            solution: t(
              [
                `${s1.en} ${first.text.en}`,
                `${s2.en} ${d1.en}`,
                `${s3.en} Every root of the quotient $q(x)$ is a root of $p(x)$ too. ${second.text.en}`,
                `${s4.en} ${d2.en}`,
                `${s5.en} ${q.en}${f ? `Putting the factors together:${end}` : ""}`,
                check.en,
              ].join("\n\n"),
              [
                `${s1["zh-CN"]}${first.text["zh-CN"]}`,
                `${s2["zh-CN"]}${d1["zh-CN"]}`,
                `${s3["zh-CN"]}商 $q(x)$ 的每个根也是 $p(x)$ 的根。${second.text["zh-CN"]}`,
                `${s4["zh-CN"]}${d2["zh-CN"]}`,
                `${s5["zh-CN"]}${q["zh-CN"]}${f ? `把因式合在一起：${end}` : ""}`,
                check["zh-CN"],
              ].join("\n\n"),
            ),
          });
        }
      },
    },
    {
      id: "leading-coefficients",
      title: t("A leading coefficient", "首项系数不为 1"),
      explanation: t(
        "If the quartic has a leading coefficient, the quadratic left after two divisions has it too; factor it with the ac-method:\n\n$$2x^{4} - x^{3} - 9x^{2} + 4x + 4 = (x - 1)(x + 2)(2x^{2} - 3x - 2) = (x - 1)(x + 2)(2x + 1)(x - 2)$$\n\n> **Watch out.** The two numbers of the ac-method need the product $ac$ and the sum $b$; swapping their signs gives factors such as $(2x - 1)(x + 2)$ whose middle term is $+3x$, not $-3x$. The given factors keep their signs.",
        "四次式的首项系数不为 1 时，两次相除后剩下的二次式首项系数也不为 1，用 ac 法分解：\n\n$$2x^{4} - x^{3} - 9x^{2} + 4x + 4 = (x - 1)(x + 2)(2x^{2} - 3x - 2) = (x - 1)(x + 2)(2x + 1)(x - 2)$$\n\n> **注意。** ac 法的两个数积要等于 $ac$，和要等于 $b$；把它们的符号对调，会得到像 $(2x - 1)(x + 2)$ 这样的因式，它的中间项是 $+3x$，而不是 $-3x$。已知因式保持原来的符号。",
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
          const cubic = synthetic(cs, c1).quotient;
          const answer = `${lf(1, -c1)}${lf(1, -c2)}${lf(p1, q1)}${lf(1, q2)}`;
          const f: Split = [p1, q1, 1, q2];
          const s1 = stepLabel(1, "Divide by the first factor", "除以第一个因式");
          const s2 = stepLabel(2, "Divide the quotient by the second factor", "用第二个因式除商");
          const s3 = stepLabel(3, "Factor the quadratic", "分解二次式");
          const d1 = divideStep(cs, c1, `${P(cs)} = `);
          const d2 = divideStep(cubic, c2, `${P(cs)} = ${lf(1, -c1)}`, "q(x)");
          const q = quadText(quad, f);
          const end = steps(`${P(cs)} = ${answer}`);
          const check = factorCheck(cs, [[[1, -c1], 1], [[1, -c2], 1], ...splitFactors(quad, f)]);
          return factoredProblem({
            prompt: t(
              `Given that $${xm(c1)}$ and $${xm(c2)}$ are factors of $p(x) = ${P(cs)}$, factor $p(x)$ completely.`,
              `已知 $${xm(c1)}$ 和 $${xm(c2)}$ 是 $p(x) = ${P(cs)}$ 的因式，把 $p(x)$ 彻底分解因式。`,
            ),
            answer,
            wrong: [`${lf(1, c1)}${lf(1, c2)}${lf(p1, q1)}${lf(1, q2)}`, `${lf(1, -c1)}${lf(1, -c2)}${lf(p1, -q1)}${lf(1, -q2)}`],
            solution: t(
              `${s1.en} ${d1.en}\n\n${s2.en} Call this quotient $q(x)$. ${d2.en}\n\n${s3.en} ${q.en}Putting the factors together:${end}\n\n${check.en}`,
              `${s1["zh-CN"]}${d1["zh-CN"]}\n\n${s2["zh-CN"]}把这个商记作 $q(x)$。${d2["zh-CN"]}\n\n${s3["zh-CN"]}${q["zh-CN"]}把因式合在一起：${end}\n\n${check["zh-CN"]}`,
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

/** degreeCheck checks multiplicities by adding them up to the degree. */
function degreeCheck(exps: readonly number[]): Text {
  const total = exps.reduce((a, b) => a + b, 0);
  const sum = exps.length === 1 ? String(total) : `${exps.join(" + ")} = ${total}`;
  return t(
    `**Check.** Each factor contributes as many powers of $x$ as its exponent, so the multiplicities of all the roots must add up to the degree of $p(x)$. Here they do: $${sum}$, and multiplying the leading terms of the factors gives $x^{${total}}$ times a constant.`,
    `**检验。** 每个因式贡献的 $x$ 的次数等于它的指数，所以所有根的重数之和必须等于 $p(x)$ 的次数。这里确实如此：$${sum}$，把各因式的首项相乘得到常数乘 $x^{${total}}$。`,
  );
}

/** multiplicitiesOfTheRootsOfPolynomials reads multiplicities from factored polynomials. */
export const multiplicitiesOfTheRootsOfPolynomials: TopicDef = {
  id: "multiplicities-of-the-roots-of-polynomials",
  title: t("Multiplicities of the Roots of Polynomials", "多项式根的重数"),
  summary: t(
    "The multiplicity of a root $c$ is the number of times the factor $x - c$ appears in the factored polynomial.",
    "根 $c$ 的重数是因式 $x - c$ 在多项式因式分解中出现的次数。",
  ),
  prerequisites: ["determining-the-roots-of-polynomials"],
  encompasses: [],
  xp: 11,
  standards: ["CCSS.HSA.APR.B.3"],
  intro: t(
    `We can read the roots of a factored polynomial: each factor that can be zero gives a root. Two polynomials can have exactly the same roots and still be different, though. Compare

$$f(x) = (x - 1)(x + 2) \\quad \\text{and} \\quad g(x) = (x - 1)^{2}(x + 2)$$

Both are zero exactly at $x = 1$ and $x = -2$. But in $g$ the factor $x - 1$ appears twice, so $g$ has degree $3$ while $f$ has degree $2$. Counting how many times each factor appears tells them apart.

That count is the **multiplicity** of the root. In $g$ the root $1$ has multiplicity $2$ and the root $-2$ has multiplicity $1$; counted this way, $g$ has $2 + 1 = 3$ roots, matching its degree. Multiplicities also shape graphs: at a root of even multiplicity the graph touches the axis and turns back, at one of odd multiplicity it crosses. In this lesson we read multiplicities from factors $x - c$, from factors with coefficients, and from factors that share a root.`,
    `我们会从因式分解形式读出多项式的根：每个能等于零的因式给出一个根。不过，两个多项式的根可以完全相同而多项式本身不同。比较

$$f(x) = (x - 1)(x + 2) \\quad \\text{和} \\quad g(x) = (x - 1)^{2}(x + 2)$$

两者都恰好在 $x = 1$ 和 $x = -2$ 处为零。但在 $g$ 中因式 $x - 1$ 出现了两次，所以 $g$ 是三次的，而 $f$ 是二次的。数一数每个因式出现几次，就能把它们区分开。

这个次数就是根的**重数**。在 $g$ 中，根 $1$ 的重数是 $2$，根 $-2$ 的重数是 $1$；这样计数，$g$ 有 $2 + 1 = 3$ 个根，正好等于它的次数。重数还决定图像的形状：在偶数重根处，图像碰到 $x$ 轴后折回；在奇数重根处，图像穿过 $x$ 轴。本课从因式 $x - c$、带系数的因式以及有公共根的因式中读出重数。`,
  ),
  knowledgePoints: [
    {
      id: "from-factored-form",
      title: t("Reading multiplicities", "读出重数"),
      explanation: t(
        "The **multiplicity** of a root $c$ is the number of times $x - c$ appears as a factor, which is its exponent in the factored form:\n\n$$p(x) = x^{2}(x - 3)^{4}(x + 1)$$\n\nThe root $0$ has multiplicity $2$, the root $3$ has multiplicity $4$, and the root $-1$ has multiplicity $1$. The multiplicities add up to the degree, $2 + 4 + 1 = 7$.\n\n> **Watch out.** A root's multiplicity is the exponent of its own factor only. The sum of all the exponents is the degree, not a multiplicity, and the constant in front is never zero, so it is not a root and says nothing about multiplicities.",
        "根 $c$ 的**重数**是 $x - c$ 作为因式出现的次数，也就是它在因式分解形式中的指数：\n\n$$p(x) = x^{2}(x - 3)^{4}(x + 1)$$\n\n根 $0$ 的重数是 $2$，根 $3$ 的重数是 $4$，根 $-1$ 的重数是 $1$。重数之和等于次数：$2 + 4 + 1 = 7$。\n\n> **注意。** 一个根的重数只看它自己那个因式的指数。所有指数之和是次数，不是某个根的重数；前面的常数永远不为零，不是根，与重数无关。",
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
        const r = roots[i]!;
        const factor = r === 0 ? "x" : xm(r);
        const s1 = stepLabel(1, "Find the factor of the root", "找出这个根对应的因式");
        const s2 = stepLabel(2, "Read its exponent", "读出它的指数");
        const check = degreeCheck(exps);
        const why = t(
          `A product is zero only when one of its factors is zero. At $x = ${r}$ the factor $${factor}$ is zero, while the other factors${k === 1 ? "" : " and the constant in front"} are not. So the root $x = ${r}$ comes from $${factor}$.`,
          `乘积为零当且仅当某个因式为零。在 $x = ${r}$ 处，因式 $${factor}$ 为零，而其他因式${k === 1 ? "" : "和前面的常数"}都不为零。所以根 $x = ${r}$ 来自 $${factor}$。`,
        );
        return numberProblem({
          prompt: multiplicityPrompt(String(r), expr),
          answer: e,
          wrong: [...exps.filter((_, j) => j !== i), exps.reduce((a, b) => a + b, 0), Math.abs(k)],
          solution: t(
            `${s1.en} ${why.en}\n\n${s2.en} The factor $${factor}$ appears with exponent $${e}$, that is, ${e === 1 ? "once" : `$${e}$ times`}. So the root $x = ${r}$ has multiplicity $${e}$.\n\n${check.en}`,
            `${s1["zh-CN"]}${why["zh-CN"]}\n\n${s2["zh-CN"]}因式 $${factor}$ 的指数是 $${e}$，也就是出现了 $${e}$ 次。所以根 $x = ${r}$ 是 $${e}$ 重根。\n\n${check["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "factors-with-coefficients",
      title: t("Factors with coefficients", "带系数的因式"),
      explanation: t(
        "A factor $ax - b$ gives the root $\\frac{b}{a}$, and its exponent is still the multiplicity. A factor written as $b - x$ gives the root $b$, since $b - x = -(x - b)$:\n\n$$p(x) = 5(2x - 1)^{3}(4 - x)^{2}$$\n\nThe root $\\frac{1}{2}$ has multiplicity $3$ and the root $4$ has multiplicity $2$. The constant $5$ is not a root.\n\n> **Watch out.** The coefficient $a$ in $ax - b$ moves the root to $\\frac{b}{a}$; it does not change how many times the factor appears. The multiplicity is the exponent, not $a$, and not the sum of all the exponents.",
        "因式 $ax - b$ 给出根 $\\frac{b}{a}$，它的指数仍是重数。写成 $b - x$ 的因式给出根 $b$，因为 $b - x = -(x - b)$：\n\n$$p(x) = 5(2x - 1)^{3}(4 - x)^{2}$$\n\n根 $\\frac{1}{2}$ 是 $3$ 重根，根 $4$ 是 $2$ 重根。常数 $5$ 不是根。\n\n> **注意。** $ax - b$ 中的系数 $a$ 把根移到 $\\frac{b}{a}$，但不改变这个因式出现的次数。重数是指数，不是 $a$，也不是所有指数之和。",
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
          const root = roots[i]!.toLatex();
          const factor = f.flip ? poly([f.b, ""], [-1, "x"]) : linear(f.a, -f.b);
          const s1 = stepLabel(1, "Find the factor that is zero at the root", "找出在这个根处为零的因式");
          const s2 = stepLabel(2, "Read its exponent", "读出它的指数");
          const check = degreeCheck(fs.map((g) => g.e));
          const zero = steps(`${factor} = 0 \\implies x = ${root}`);
          return numberProblem({
            prompt: multiplicityPrompt(root, expr),
            answer: f.e,
            wrong: [...fs.filter((_, j) => j !== i).map((g) => g.e), f.a, fs.reduce((s, g) => s + g.e, 0)],
            solution: t(
              `${s1.en} Set each factor equal to zero. The factor $${factor}$ gives the root:${zero}${f.flip ? `This works because $${factor} = -${lf(1, -f.b)}$, and the sign does not change where it is zero.` : `The coefficient $${f.a}$ only moves the root to $${root}$.`}\n\n${s2.en} The factor $${factor}$ appears with exponent $${f.e}$. So the root $${root}$ has multiplicity $${f.e}$.\n\n${check.en}`,
              `${s1["zh-CN"]}令每个因式等于零。因式 $${factor}$ 给出这个根：${zero}${f.flip ? `这是因为 $${factor} = -${lf(1, -f.b)}$，符号不影响它在哪里为零。` : `系数 $${f.a}$ 只是把根移到 $${root}$。`}\n\n${s2["zh-CN"]}因式 $${factor}$ 的指数是 $${f.e}$，所以根 $${root}$ 是 $${f.e}$ 重根。\n\n${check["zh-CN"]}`,
            ),
          });
        }
      },
    },
    {
      id: "combining-factors",
      title: t("Factors that share a root", "有公共根的因式"),
      explanation: t(
        "Factor every factor completely before counting: the same root can hide in more than one factor.\n\n$$p(x) = (x - 2)^{2}(x^{2} - 4) = (x - 2)^{2}(x - 2)(x + 2) = (x - 2)^{3}(x + 2)$$\n\nThe root $2$ has multiplicity $3$, not $2$, and the root $-2$ has multiplicity $1$.\n\n> **Watch out.** When equal factors are combined their exponents add; they do not multiply. A factor like $x^{2} - 4$ that is not yet factored can hide another copy of a root, and its exponent applies to both $x - 2$ and $x + 2$.",
        "数重数之前，先把每个因式彻底分解：同一个根可能藏在几个因式里。\n\n$$p(x) = (x - 2)^{2}(x^{2} - 4) = (x - 2)^{2}(x - 2)(x + 2) = (x - 2)^{3}(x + 2)$$\n\n根 $2$ 是 $3$ 重根而不是 $2$ 重根，根 $-2$ 是 $1$ 重根。\n\n> **注意。** 合并相同的因式时，指数相加而不是相乘。像 $x^{2} - 4$ 这样还没分解的因式可能藏着某个根的又一份，而它的指数同时作用在 $x - 2$ 和 $x + 2$ 上。",
      ),
      keyPrerequisites: ["solving-quadratic-equations-using-a-difference-of-squares"],
      generate(rng) {
        const a = rng.int(1, 6);
        const s = rng.sign();
        const r = s * a;
        const e1 = rng.int(1, 3);
        const e2 = rng.int(1, 2);
        const e0 = rng.pick([0, 0, 1, 2]);
        const x0 = e0 === 0 ? "" : powFactor("x", e0);
        const expr = `${x0}${powFactor(lf(1, -r), e1)}${powFactor(`(x^{2} - ${a * a})`, e2)}`;
        const which = rng.pick(["same", "same", "other"] as const);
        const root = which === "same" ? r : -r;
        const answer = which === "same" ? e1 + e2 : e2;
        const split = `${x0}${powFactor(lf(1, -r), e1)}${powFactor(lf(1, -r), e2)}${powFactor(lf(1, r), e2)}`;
        const combined = `${x0}${powFactor(lf(1, -r), e1 + e2)}${powFactor(lf(1, r), e2)}`;
        const s1 = stepLabel(1, "Factor completely", "彻底分解");
        const s2 = stepLabel(2, "Collect equal factors", "合并相同的因式");
        const s3 = stepLabel(3, "Read the exponent", "读出指数");
        const check = degreeCheck([...(e0 === 0 ? [] : [e0]), e1 + e2, e2]);
        const pair = `${lf(1, -a)}${lf(1, a)}`;
        return numberProblem({
          prompt: multiplicityPrompt(String(root), expr),
          answer,
          wrong: which === "same" ? [e1, e2, e1 * e2] : [e1 + e2, e1, 2 * e2 + 1],
          solution: t(
            `${s1.en} The factor $x^{2} - ${a * a}$ is a difference of squares, so it is not finished: $x^{2} - ${a * a} = ${pair}$. Raising it to the power $${e2}$ raises each of its factors to that power:${steps(`p(x) = ${split}`)}\n\n${s2.en} Equal factors multiply by adding exponents, so the two powers of $${xm(r)}$ combine:${steps(`p(x) = ${combined}`)}\n\n${s3.en} The root $x = ${root}$ comes from $${xm(root)}$, which now appears with exponent $${answer}$. So its multiplicity is $${answer}$.\n\n${check.en}`,
            `${s1["zh-CN"]}因式 $x^{2} - ${a * a}$ 是平方差，还没有分解完：$x^{2} - ${a * a} = ${pair}$。把它乘方 $${e2}$ 次，相当于它的每个因式都乘方 $${e2}$ 次：${steps(`p(x) = ${split}`)}\n\n${s2["zh-CN"]}相同的因式相乘，指数相加，所以 $${xm(r)}$ 的两个幂合并为：${steps(`p(x) = ${combined}`)}\n\n${s3["zh-CN"]}根 $x = ${root}$ 来自 $${xm(root)}$，它现在的指数是 $${answer}$。所以它是 $${answer}$ 重根。\n\n${check["zh-CN"]}`,
          ),
        });
      },
    },
  ],
};

// ─── 2.7.6 Finding multiplicities of the roots of quartic polynomials by factoring

/** multiplicityRead writes the step that reads the multiplicity of a root from a factored form. */
function multiplicityRead(root: number, factor: string, e: number): Text {
  return t(
    `The root $x = ${root}$ comes from the factor $${factor}$, which appears with exponent $${e}$. So its multiplicity is $${e}$.`,
    `根 $x = ${root}$ 来自因式 $${factor}$，它的指数是 $${e}$。所以它是 $${e}$ 重根。`,
  );
}

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
  ],
  xp: 15,
  standards: ["CCSS.HSA.APR.B.3"],
  intro: t(
    `Multiplicities are exponents in the factored form, so we can read them only once a polynomial is factored. An expanded polynomial hides them: nothing in $x^{3} - 4x^{2} + 4x$ shows that one of its roots is double. To find out, factor it with the methods we already have. Here the terms share the factor $x$, and what is left is a perfect square:

$$x^{3} - 4x^{2} + 4x = x(x^{2} - 4x + 4) = x(x - 2)^{2}$$

Now the multiplicities can be read: the root $0$ has multiplicity $1$ and the root $2$ has multiplicity $2$. They add up to $3$, the degree. In this lesson we do the same for quartics, factoring them by a common factor, as a quadratic in $x^{2}$, or by dividing out the same root again and again.`,
    `重数是因式分解形式中的指数，所以只有把多项式分解以后才能读出来。展开的多项式把重数藏起来了：从 $x^{3} - 4x^{2} + 4x$ 看不出它有一个二重根。要弄清楚，就用已经学过的方法分解它。这里各项有公因式 $x$，剩下的是完全平方式：

$$x^{3} - 4x^{2} + 4x = x(x^{2} - 4x + 4) = x(x - 2)^{2}$$

现在可以读出重数：根 $0$ 是一重根，根 $2$ 是二重根。它们的和是 $3$，等于次数。本课对四次式做同样的事：提取公因式，按 $x^{2}$ 的二次式分解，或者反复除去同一个根。`,
  ),
  knowledgePoints: [
    {
      id: "common-factor-first",
      title: t("A common factor first", "先提公因式"),
      explanation: t(
        "Take out the greatest common factor, then factor the trinomial; a perfect square gives a double root.\n\n$$p(x) = 2x^{4} - 12x^{3} + 18x^{2} = 2x^{2}(x^{2} - 6x + 9) = 2x^{2}(x - 3)^{2}$$\n\nThe roots $0$ and $3$ both have multiplicity $2$.\n\n> **Watch out.** The degree $4$ is the sum of the multiplicities, not the multiplicity of one root. The power of $x$ taken out is the multiplicity of the root $0$, and a factor that appears once gives multiplicity $1$, not $2$.",
        "先提取最大公因式，再分解三项式；完全平方式给出二重根。\n\n$$p(x) = 2x^{4} - 12x^{3} + 18x^{2} = 2x^{2}(x^{2} - 6x + 9) = 2x^{2}(x - 3)^{2}$$\n\n根 $0$ 和 $3$ 都是二重根。\n\n> **注意。** 次数 $4$ 是所有重数之和，不是某一个根的重数。提出的 $x$ 的幂次就是根 $0$ 的重数；只出现一次的因式给出一重根，而不是二重根。",
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
          let f: Split | undefined;
          let factors: FactorPower[];
          if (kind === "square") {
            j = 2;
            rest = mulP([1, -a], [1, -a]);
            factored = `${monoFront(k, 2)}${powFactor(lf(1, -a), 2)}`;
            mult = new Map([
              [0, 2],
              [a, 2],
            ]);
            f = [1, -a, 1, -a];
            factors = [[[1, -a], 2]];
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
            f = [1, -a, 1, -b];
            factors = [
              [[1, -a], 1],
              [[1, -b], 1],
            ];
          } else {
            j = 3;
            rest = [1, -a];
            factored = `${monoFront(k, 3)}${lf(1, -a)}`;
            mult = new Map([
              [0, 3],
              [a, 1],
            ]);
            factors = [[[1, -a], 1]];
          }
          const cs = [...rest.map((v) => v * k), ...Array<number>(j).fill(0)];
          const root = rng.pick([...mult.keys()]);
          const answer = mult.get(root)!;
          const gcf = poly([k, pw(j)]);
          const s1 = stepLabel(1, "Take out the greatest common factor", "提取最大公因式");
          const s2 = stepLabel(2, "Factor the trinomial", "分解三项式");
          const s3 = stepLabel(rest.length > 2 ? 3 : 2, "Read the multiplicity", "读出重数");
          const first = steps(`${P(cs)} = ${monoFront(k, j)}(${P(rest)})`);
          const q = rest.length > 2 ? quadText(rest, f) : undefined;
          const whole = steps(`${P(cs)} = ${factored}`);
          const factor = root === 0 ? "x" : xm(root);
          const read = multiplicityRead(root, factor, answer);
          const check = factorCheck(cs, [[[1, 0], j], ...factors], k);
          const en = [
            `${s1.en} Every term has the factor $${gcf}$:${first}${q ? "" : `The factor $${P(rest)}$ is linear, so the polynomial is fully factored.`}`,
            ...(q ? [`${s2.en} ${q.en}Putting the factors together:${whole}`] : []),
            `${s3.en} ${read.en}`,
            check.en,
          ];
          const zh = [
            `${s1["zh-CN"]}每一项都有因式 $${gcf}$：${first}${q ? "" : `因式 $${P(rest)}$ 是一次的，多项式已经分解完了。`}`,
            ...(q ? [`${s2["zh-CN"]}${q["zh-CN"]}把因式合在一起：${whole}`] : []),
            `${s3["zh-CN"]}${read["zh-CN"]}`,
            check["zh-CN"],
          ];
          return numberProblem({
            prompt: multiplicityPrompt(String(root), P(cs)),
            answer,
            wrong: [4, ...[...mult.values()].filter((v) => v !== answer), answer === 1 ? 2 : 1],
            solution: t(en.join("\n\n"), zh.join("\n\n")),
          });
        }
      },
    },
    {
      id: "biquadratic-quartics",
      title: t("Biquadratic quartics", "双二次的四次式"),
      explanation: t(
        "Factor a quartic in $x^{2}$ as a quadratic in $x^{2}$, then factor each difference of squares:\n\n$$x^{4} - 8x^{2} + 16 = (x^{2} - 4)^{2} = \\left[(x - 2)(x + 2)\\right]^{2} = (x - 2)^{2}(x + 2)^{2}$$\n\nBoth $2$ and $-2$ have multiplicity $2$, while in $x^{4} - 5x^{2} + 4 = (x - 1)(x + 1)(x - 2)(x + 2)$ every root has multiplicity $1$.\n\n> **Watch out.** In $(x^{2} - 4)^{2}$ the exponent $2$ goes to both $x - 2$ and $x + 2$, so each root has multiplicity $2$, not $4$. When $x^{2} - a^{2}$ appears only once, each of its roots has multiplicity $1$.",
        "把关于 $x^{2}$ 的四次式按 $x^{2}$ 的二次式分解，再分解每个平方差：\n\n$$x^{4} - 8x^{2} + 16 = (x^{2} - 4)^{2} = \\left[(x - 2)(x + 2)\\right]^{2} = (x - 2)^{2}(x + 2)^{2}$$\n\n$2$ 和 $-2$ 都是二重根；而 $x^{4} - 5x^{2} + 4 = (x - 1)(x + 1)(x - 2)(x + 2)$ 的每个根都是一重根。\n\n> **注意。** 在 $(x^{2} - 4)^{2}$ 中，指数 $2$ 同时作用在 $x - 2$ 和 $x + 2$ 上，所以每个根都是二重根，而不是四重根。$x^{2} - a^{2}$ 只出现一次时，它的每个根都是一重根。",
      ),
      keyPrerequisites: ["factoring-biquadratic-expressions"],
      generate(rng) {
        const a = rng.int(1, 6);
        const kind = rng.pick(["square", "square", "distinct", "imaginary"] as const);
        const root = rng.sign() * a;
        const s1 = stepLabel(1, "Factor as a quadratic in $x^{2}$", "按 $x^{2}$ 的二次式分解");
        const s2 = stepLabel(2, "Factor the differences of squares", "分解平方差");
        const s3 = stepLabel(3, "Read the multiplicity", "读出重数");
        if (kind === "square") {
          const cs = [1, 0, -2 * a * a, 0, a ** 4];
          const check = factorCheck(cs, [
            [[1, -a], 2],
            [[1, a], 2],
          ]);
          const u = steps(`u^{2} - ${2 * a * a}u + ${a ** 4} = (u - ${a * a})^{2}`);
          const sq = steps(
            `${P(cs)} = (x^{2} - ${a * a})^{2} = \\left[${lf(1, -a)}${lf(1, a)}\\right]^{2} = ${powFactor(lf(1, -a), 2)}${powFactor(lf(1, a), 2)}`,
          );
          const read = multiplicityRead(root, xm(root), 2);
          return numberProblem({
            prompt: multiplicityPrompt(String(root), P(cs)),
            answer: 2,
            wrong: [1, 4],
            solution: t(
              `${s1.en} Only even powers of $x$ appear, so write $u = x^{2}$. Then $x^{4} = u^{2}$, and the quartic is a perfect square trinomial in $u$, since $${a ** 4}$ is the square of $${a * a}$ and $${2 * a * a}$ is twice $${a * a}$:${u}\n\n${s2.en} Put back $u = x^{2}$ and factor the difference of squares inside the square; the exponent applies to each factor:${sq}\n\n${s3.en} ${read.en}\n\n${check.en}`,
              `${s1["zh-CN"]}只出现 $x$ 的偶次幂，所以令 $u = x^{2}$，则 $x^{4} = u^{2}$。这个四次式是关于 $u$ 的完全平方式，因为 $${a ** 4}$ 是 $${a * a}$ 的平方，$${2 * a * a}$ 是 $${a * a}$ 的 $2$ 倍：${u}\n\n${s2["zh-CN"]}代回 $u = x^{2}$，分解平方里面的平方差；指数作用在每个因式上：${sq}\n\n${s3["zh-CN"]}${read["zh-CN"]}\n\n${check["zh-CN"]}`,
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
        const uPoly = `${poly([1, "u^{2}"], [cs[2]!, "u"], [cs[4]!, ""])}`;
        const u = steps(`${uPoly} = (u - ${a * a})(u ${sign < 0 ? "-" : "+"} ${b * b})`);
        const check = factorCheck(cs, [
          [[1, -a], 1],
          [[1, a], 1],
          ...(kind === "distinct"
            ? ([
                [[1, -b], 1],
                [[1, b], 1],
              ] as FactorPower[])
            : ([[[1, 0, b * b], 1]] as FactorPower[])),
        ]);
        const read = multiplicityRead(root, xm(root), 1);
        return numberProblem({
          prompt: multiplicityPrompt(String(root), P(cs)),
          answer: 1,
          wrong: [2, 4],
          solution: t(
            `${s1.en} Only even powers of $x$ appear, so write $u = x^{2}$. Two numbers with product $${cs[4]}$ and sum $${cs[2]}$ are $${-a * a}$ and $${sign * b * b}$:${u}\n\n${s2.en} Put back $u = x^{2}$. The factor $x^{2} - ${a * a}$ is a difference of squares${kind === "distinct" ? `, and so is $x^{2} - ${b * b}$` : `, while $x^{2} + ${b * b}$ is never zero and does not factor`}:${steps(`${P(cs)} = (x^{2} - ${a * a})${second} = ${full}`)}\n\n${s3.en} ${read.en}\n\n${check.en}`,
            `${s1["zh-CN"]}只出现 $x$ 的偶次幂，所以令 $u = x^{2}$。积为 $${cs[4]}$、和为 $${cs[2]}$ 的两个数是 $${-a * a}$ 和 $${sign * b * b}$：${u}\n\n${s2["zh-CN"]}代回 $u = x^{2}$。因式 $x^{2} - ${a * a}$ 是平方差${kind === "distinct" ? `，$x^{2} - ${b * b}$ 也是` : `，而 $x^{2} + ${b * b}$ 永远不为零，不能分解`}：${steps(`${P(cs)} = (x^{2} - ${a * a})${second} = ${full}`)}\n\n${s3["zh-CN"]}${read["zh-CN"]}\n\n${check["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "repeated-division",
      title: t("Dividing repeatedly", "反复相除"),
      explanation: t(
        `When $c$ is a root, divide by $x - c$ and test $c$ again on the quotient. The number of divisions with remainder $0$ is the multiplicity.\n\nFor $p(x) = x^{4} - 5x^{3} + 6x^{2} + 4x - 8$ and the root $2$:\n\n$$${synthetic([1, -5, 6, 4, -8], 2).latex}$$\n\n$$${synthetic([1, -3, 0, 4], 2).latex}$$\n\n$$${synthetic([1, -1, -2], 2).latex}$$\n\n$$${synthetic([1, 1], 2).latex}$$\n\nThree divisions leave remainder $0$ and the fourth does not, so $p(x) = (x - 2)^{3}(x + 1)$ and $2$ has multiplicity $3$.\n\n> **Watch out.** Each new division goes into the latest quotient, not into $p(x)$ again. Count only the divisions with remainder $0$; the last one, with a nonzero remainder, shows that the factor does not appear again and is not counted.`,
        `当 $c$ 是根时，除以 $x - c$，再用 $c$ 检验商式。余数为 $0$ 的除法次数就是重数。\n\n对 $p(x) = x^{4} - 5x^{3} + 6x^{2} + 4x - 8$ 和根 $2$：\n\n$$${synthetic([1, -5, 6, 4, -8], 2).latex}$$\n\n$$${synthetic([1, -3, 0, 4], 2).latex}$$\n\n$$${synthetic([1, -1, -2], 2).latex}$$\n\n$$${synthetic([1, 1], 2).latex}$$\n\n前三次余数为 $0$，第四次不是，所以 $p(x) = (x - 2)^{3}(x + 1)$，$2$ 是三重根。\n\n> **注意。** 每次新的除法都除最新的商，而不是再除 $p(x)$。只数余数为 $0$ 的除法；最后那次余数不为零，说明这个因式不再出现，不计入。`,
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
          let last = 0;
          for (;;) {
            const s = synthetic(cur, a);
            arrays.push(s.latex);
            if (s.remainder !== 0) {
              last = s.remainder;
              break;
            }
            cur = s.quotient;
          }
          const s1 = stepLabel(1, `Divide by $${xm(a)}$ again and again`, `反复除以 $${xm(a)}$`);
          const s2 = stepLabel(2, "Count the divisions", "数出除法的次数");
          const form = steps(`p(x) = ${powFactor(lf(1, -a), answer)}(${P(cur)})`);
          const check = factorCheck(cs, [
            [[1, -a], answer],
            [cur, 1],
          ]);
          return numberProblem({
            prompt: t(
              `$x = ${a}$ is a root of $p(x) = ${P(cs)}$. What is its multiplicity?`,
              `$x = ${a}$ 是 $p(x) = ${P(cs)}$ 的根。它是几重根？`,
            ),
            answer,
            wrong: [1, 4, answer === 3 ? 2 : 3],
            solution: t(
              `${s1.en} Each division with remainder $0$ splits off one more factor $${xm(a)}$. Divide $p(x)$ by $${xm(a)}$ with $c = ${a}$, then divide each quotient again, until the remainder is not $0$:${arrays.map((l) => steps(l)).join("")}\n\n${s2.en} The first $${answer}$ divisions leave remainder $0$ and the last leaves $${last}$, so $${xm(a)}$ divides $p(x)$ exactly $${answer}$ times:${form}The last quotient is not zero at $x = ${a}$. So $x = ${a}$ has multiplicity $${answer}$.\n\n${check.en}`,
              `${s1["zh-CN"]}每次余数为 $0$ 的除法都分出一个因式 $${xm(a)}$。取 $c = ${a}$，把 $p(x)$ 除以 $${xm(a)}$，再用它去除每个商，直到余数不为 $0$：${arrays.map((l) => steps(l)).join("")}\n\n${s2["zh-CN"]}前 $${answer}$ 次除法余数为 $0$，最后一次余数为 $${last}$，所以 $${xm(a)}$ 恰好整除 $p(x)$ $${answer}$ 次：${form}最后的商在 $x = ${a}$ 处不为零。所以 $x = ${a}$ 是 $${answer}$ 重根。\n\n${check["zh-CN"]}`,
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

/** remainderSolution finds the remainder of a division by x − c by evaluating p(c), and checks it with synthetic division. */
function remainderSolution(cs: Coefs, c: number, identify: Text): Text {
  const s1 = stepLabel(1, "Identify $c$", "确定 $c$");
  const s2 = stepLabel(2, "Evaluate $p(c)$", "计算 $p(c)$");
  const v = evalI(cs, c);
  const s = synthetic(cs, c);
  return t(
    `${s1.en} ${identify.en}\n\n${s2.en} By the remainder theorem the remainder is the value of $p(x)$ at $x = ${c}$; there is no need to divide:${steps(valueLine(cs, Q.of(c)))}The remainder is $${v}$.\n\n**Check.** Synthetic division by $${xm(c)}$ gives the same remainder, the last number of the bottom row:${steps(s.latex)}`,
    `${s1["zh-CN"]}${identify["zh-CN"]}\n\n${s2["zh-CN"]}由余数定理，余数就是 $p(x)$ 在 $x = ${c}$ 处的值，不需要做除法：${steps(valueLine(cs, Q.of(c)))}余数是 $${v}$。\n\n**检验。** 用综合除法除以 $${xm(c)}$，底行最后一个数就是余数，结果相同：${steps(s.latex)}`,
  );
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
  encompasses: [{ topic: "evaluating-expressions", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.HSA.APR.B.2"],
  intro: t(
    `The factor theorem came from the identity $p(x) = (x - c)q(x) + r$. Putting $x = c$ makes the first term zero, so $p(c) = r$. We used only the case $r = 0$. The same identity says more: whatever the remainder is, it equals $p(c)$. So a remainder can be found by evaluating, which is often quicker than dividing.

Divide $p(x) = x^{2} + 3x + 1$ by $x - 1$. Synthetic division with $c = 1$ ends in the remainder $5$:

$$\\begin{array}{r|rrr} 1 & 1 & 3 & 1 \\\\ & & 1 & 4 \\\\ \\hline & 1 & 4 & 5 \\end{array}$$

Evaluating gives the same number without any division:

$$p(1) = 1 + 3 + 1 = 5$$

This is the **remainder theorem**: the remainder when $p(x)$ is divided by $x - c$ is $p(c)$. In this lesson we find remainders for divisors $x - c$ and $x + c$, and use a known remainder to find an unknown coefficient.`,
    `因式定理来自恒等式 $p(x) = (x - c)q(x) + r$：代入 $x = c$，第一项为零，所以 $p(c) = r$。之前我们只用了 $r = 0$ 的情形。同一个恒等式说明了更多：不管余数是多少，它都等于 $p(c)$。所以余数可以通过求值得到，这往往比做除法快。

把 $p(x) = x^{2} + 3x + 1$ 除以 $x - 1$。取 $c = 1$ 做综合除法，最后得到余数 $5$：

$$\\begin{array}{r|rrr} 1 & 1 & 3 & 1 \\\\ & & 1 & 4 \\\\ \\hline & 1 & 4 & 5 \\end{array}$$

直接求值，不做除法也得到同一个数：

$$p(1) = 1 + 3 + 1 = 5$$

这就是**余数定理**：$p(x)$ 除以 $x - c$ 的余数是 $p(c)$。本课求除以 $x - c$ 和 $x + c$ 的余数，并用已知的余数求未知系数。`,
  ),
  knowledgePoints: [
    {
      id: "evaluating-for-the-remainder",
      title: t("Remainders by evaluating", "用求值求余数"),
      explanation: t(
        "Since $p(x) = (x - c)q(x) + r$, substituting $x = c$ gives $p(c) = r$. This is the **remainder theorem**: the remainder of $p(x) \\div (x - c)$ is $p(c)$.\n\nThe remainder when $p(x) = x^{3} - 2x^{2} + 5$ is divided by $x - 3$ is\n\n$$p(3) = 27 - 18 + 5 = 14$$\n\nNo division is needed.\n\n> **Watch out.** For $x - c$ evaluate at $c$ itself, not at $-c$. The remainder is the whole value $p(c)$, not the constant term of $p(x)$, and its sign matters.",
        "因为 $p(x) = (x - c)q(x) + r$，代入 $x = c$ 得 $p(c) = r$。这就是**余数定理**：$p(x) \\div (x - c)$ 的余数是 $p(c)$。\n\n$p(x) = x^{3} - 2x^{2} + 5$ 除以 $x - 3$ 的余数是\n\n$$p(3) = 27 - 18 + 5 = 14$$\n\n不需要做除法。\n\n> **注意。** 除以 $x - c$ 时在 $c$ 本身处求值，而不是在 $-c$ 处。余数是整个值 $p(c)$，不是 $p(x)$ 的常数项，而且符号不能丢。",
      ),
      generate(rng) {
        const cs = randomPoly(rng);
        const c = rng.nonZero(-3, 3);
        const v = evalI(cs, c);
        return numberProblem({
          prompt: remainderPrompt(cs, xm(c)),
          answer: v,
          wrong: [evalI(cs, -c), cs[cs.length - 1]!, -v],
          solution: remainderSolution(
            cs,
            c,
            c < 0
              ? t(`The divisor is $${xm(c)} = x - (${c})$, so $c = ${c}$.`, `除式是 $${xm(c)} = x - (${c})$，所以 $c = ${c}$。`)
              : t(`The divisor is $${xm(c)}$, so $c = ${c}$.`, `除式是 $${xm(c)}$，所以 $c = ${c}$。`),
          ),
        });
      },
    },
    {
      id: "dividing-by-x-plus-c",
      title: t("Dividing by x + c", "除以 x + c"),
      explanation: t(
        "Dividing by $x + c$ is dividing by $x - (-c)$, so the remainder is $p(-c)$.\n\nThe remainder when $p(x) = 2x^{3} + x - 4$ is divided by $x + 2$ is\n\n$$p(-2) = -16 - 2 - 4 = -22$$\n\n> **Watch out.** For $x + c$ evaluate at $-c$, not at $c$. Odd powers of a negative number are negative, so work out each term's sign before adding.",
        "除以 $x + c$ 就是除以 $x - (-c)$，所以余数是 $p(-c)$。\n\n$p(x) = 2x^{3} + x - 4$ 除以 $x + 2$ 的余数是\n\n$$p(-2) = -16 - 2 - 4 = -22$$\n\n> **注意。** 除以 $x + c$ 时在 $-c$ 处求值，而不是在 $c$ 处。负数的奇次幂是负的，所以相加之前先确定每一项的符号。",
      ),
      generate(rng) {
        const cs = randomPoly(rng);
        const c = rng.int(1, 4);
        const v = evalI(cs, -c);
        return numberProblem({
          prompt: remainderPrompt(cs, linear(1, c)),
          answer: v,
          wrong: [evalI(cs, c), -v, cs[cs.length - 1]!],
          solution: remainderSolution(
            cs,
            -c,
            t(
              `Write the divisor in the form $x - c$: $${linear(1, c)} = x - (${-c})$, so $c = ${-c}$.`,
              `把除式写成 $x - c$ 的形式：$${linear(1, c)} = x - (${-c})$，所以 $c = ${-c}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "an-unknown-coefficient",
      title: t("An unknown coefficient", "未知系数"),
      explanation: t(
        "A known remainder gives an equation for an unknown coefficient.\n\n$p(x) = x^{3} + kx - 4$ leaves the remainder $6$ when divided by $x - 2$:\n\n$$p(2) = 8 + 2k - 4 = 2k + 4 = 6 \\implies k = 1$$\n\n> **Watch out.** The equation is $p(c) = R$ with the given remainder on the right, not $p(c) = 0$: the divisor is not a factor. Evaluate at the root of the divisor, $c$ for $x - c$, and keep the signs when solving for $k$.",
        "已知余数，就得到关于未知系数的方程。\n\n$p(x) = x^{3} + kx - 4$ 除以 $x - 2$ 余 $6$：\n\n$$p(2) = 8 + 2k - 4 = 2k + 4 = 6 \\implies k = 1$$\n\n> **注意。** 方程是 $p(c) = R$，右边是已知的余数，而不是 $p(c) = 0$：除式不是因式。要在除式的根处求值，$x - c$ 对应 $c$，解 $k$ 时注意符号。",
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
            t(
              `By the remainder theorem, the remainder of a division by $${div}$ is $p(${c})$, so $p(${c}) = ${R}$.`,
              `由余数定理，除以 $${div}$ 的余数是 $p(${c})$，所以 $p(${c}) = ${R}$。`,
            ),
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

/** divisorsText writes the step that lists the possible numerators and denominators. */
function divisorsText(a: number, d: number): Text {
  const ps = `p \\in \\{${divisors(d).join(", ")}\\}`;
  const qs = `q \\in \\{${divisors(a).join(", ")}\\}`;
  return t(
    `A rational root $\\pm\\frac{p}{q}$ in lowest terms has $p$ dividing the constant term $${d}$ and $q$ dividing the leading coefficient $${a}$:${steps(`${ps}, \\quad ${qs}`)}`,
    `最简形式的有理根 $\\pm\\frac{p}{q}$ 中，$p$ 整除常数项 $${d}$，$q$ 整除首项系数 $${a}$：${steps(`${ps}, \\quad ${qs}`)}`,
  );
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
  intro: t(
    `To factor a cubic we tested divisors of the constant term for integer roots. That works when the leading coefficient is $1$, but a polynomial such as $3x^{2} + 5x - 2$ has a root that is a fraction:

$$3x^{2} + 5x - 2 = (3x - 1)(x + 2)$$

Its roots are $\\frac{1}{3}$ and $-2$. Look at where the numbers come from. The numerators $1$ and $2$ divide the constant term $-2$, and the denominators $3$ and $1$ divide the leading coefficient $3$. This is no accident. Suppose $\\frac{p}{q}$ in lowest terms is a root of $ax^{n} + \\dots + d$. Substituting it for $x$ and multiplying through by $q^{n}$ gives

$$ap^{n} + \\dots + dq^{n} = 0$$

Every term but the last has the factor $p$, so $p$ divides $dq^{n}$, and since $p$ and $q$ share no factor, $p$ divides $d$. In the same way $q$ divides $a$.

This is the **rational roots theorem**. It turns the search for rational roots into a finite list of candidates to test. In this lesson we decide which numbers can be rational roots, count the candidates, and test them to find all the rational roots.`,
    `分解三次式时，我们试验常数项的因数来找整数根。首项系数为 $1$ 时这样做可以，但像 $3x^{2} + 5x - 2$ 这样的多项式有一个分数根：

$$3x^{2} + 5x - 2 = (3x - 1)(x + 2)$$

它的根是 $\\frac{1}{3}$ 和 $-2$。看看这些数从哪里来：分子 $1$ 和 $2$ 整除常数项 $-2$，分母 $3$ 和 $1$ 整除首项系数 $3$。这不是巧合。设最简分数 $\\frac{p}{q}$ 是 $ax^{n} + \\dots + d$ 的根。把它代入 $x$，再两边乘以 $q^{n}$，得

$$ap^{n} + \\dots + dq^{n} = 0$$

除最后一项外每一项都有因数 $p$，所以 $p$ 整除 $dq^{n}$；又因为 $p$ 和 $q$ 没有公因数，所以 $p$ 整除 $d$。同理 $q$ 整除 $a$。

这就是**有理根定理**。它把寻找有理根变成检验一张有限的候选表。本课判断哪些数可能是有理根，数出候选值的个数，并逐个检验求出所有有理根。`,
  ),
  knowledgePoints: [
    {
      id: "possible-rational-roots",
      title: t("Possible rational roots", "可能的有理根"),
      explanation: t(
        "The **rational roots theorem**: if a polynomial has integer coefficients, every rational root in lowest terms is $\\frac{p}{q}$ where $p$ divides the constant term and $q$ divides the leading coefficient.\n\nFor $2x^{3} + x^{2} - 7x - 6$: $p$ divides $6$, so $p \\in \\{1, 2, 3, 6\\}$; $q$ divides $2$, so $q \\in \\{1, 2\\}$. The possible rational roots are\n\n$$\\pm 1, \\; \\pm 2, \\; \\pm 3, \\; \\pm 6, \\; \\pm\\frac{1}{2}, \\; \\pm\\frac{3}{2}$$\n\nThe theorem lists candidates only; each must still be tested.\n\n> **Watch out.** The numerator goes with the constant term and the denominator with the leading coefficient, not the other way round. Reduce a fraction to lowest terms before checking it: its numerator must divide the constant term and its denominator the leading coefficient.",
        "**有理根定理**：若多项式的系数都是整数，则它的每个有理根写成最简分数后都是 $\\frac{p}{q}$，其中 $p$ 整除常数项，$q$ 整除首项系数。\n\n对 $2x^{3} + x^{2} - 7x - 6$：$p$ 整除 $6$，$p \\in \\{1, 2, 3, 6\\}$；$q$ 整除 $2$，$q \\in \\{1, 2\\}$。可能的有理根是\n\n$$\\pm 1, \\; \\pm 2, \\; \\pm 3, \\; \\pm 6, \\; \\pm\\frac{1}{2}, \\; \\pm\\frac{3}{2}$$\n\n定理只给出候选值，每个候选值仍需检验。\n\n> **注意。** 分子对应常数项，分母对应首项系数，不能弄反。检查一个分数之前先约成最简分数：它的分子必须整除常数项，分母必须整除首项系数。",
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
          const s1 = stepLabel(1, "List the possible numerators and denominators", "列出可能的分子和分母");
          const s2 = stepLabel(2, "List the candidates", "列出候选值");
          const s3 = stepLabel(3, "Compare with the options", "与选项比较");
          const n = Math.abs(Number(correct.n));
          const m = Number(correct.d);
          const list = divisorsText(a, d);
          const reasons = options
            .filter((v) => !v.eq(correct))
            .map((v) => {
              const vn = Math.abs(Number(v.n));
              const vd = Number(v.d);
              const option = `$${v.toLatex()}$`;
              return d % vn !== 0
                ? ([
                    option,
                    `In lowest terms its numerator is $${vn}$, which does not divide the constant term $${d}$.`,
                    `它化成最简分数后分子是 $${vn}$，不整除常数项 $${d}$。`,
                  ] as const)
                : ([
                    option,
                    `In lowest terms its denominator is $${vd}$, which does not divide the leading coefficient $${a}$.`,
                    `它化成最简分数后分母是 $${vd}$，不整除首项系数 $${a}$。`,
                  ] as const);
            });
          return reasoned(
            choiceProblem({
              prompt: t(
                `By the rational roots theorem, which of these could be a rational root of $p(x) = ${P(cs)}$?`,
                `根据有理根定理，下列哪一个可能是 $p(x) = ${P(cs)}$ 的有理根？`,
              ),
              options: options.map((v) => same(`$${v.toLatex()}$`)),
              correct: options.findIndex((v) => v.eq(correct)),
              solution: t(
                `${s1.en} ${list.en}\n\n${s2.en} Every value $\\pm\\frac{p}{q}$, reduced and without repeats, is a possible rational root:${steps(candidatesLatex(a, d))}\n\n${s3.en} Of the options, only $${correct.toLatex()}$ is in this list, so it is the only one that could be a root. The theorem does not say it is a root; that still has to be tested.\n\n**Check.** Test the answer directly against the theorem. In lowest terms, $${correct.toLatex()}$ has numerator $${n}$ and denominator $${m}$; $${n}$ divides $${d}$ and $${m}$ divides $${a}$, as required.`,
                `${s1["zh-CN"]}${list["zh-CN"]}\n\n${s2["zh-CN"]}约分并去掉重复后，每个 $\\pm\\frac{p}{q}$ 都是可能的有理根：${steps(candidatesLatex(a, d))}\n\n${s3["zh-CN"]}选项中只有 $${correct.toLatex()}$ 在这张表里，所以只有它可能是根。定理并没有说它一定是根，这还需要检验。\n\n**检验。** 直接用定理检查答案：$${correct.toLatex()}$ 化成最简分数后分子是 $${n}$，分母是 $${m}$；$${n}$ 整除 $${d}$，$${m}$ 整除 $${a}$，符合要求。`,
              ),
            }),
            reasons,
          );
        }
      },
    },
    {
      id: "counting-candidates",
      title: t("Counting the candidates", "数候选值"),
      explanation: t(
        "List every $\\frac{p}{q}$, reduce it, and drop repeats: with constant term $4$ and leading coefficient $2$, the fractions $\\frac{2}{2}$ and $\\frac{4}{2}$ equal $1$ and $2$, which are already listed.\n\n$$p \\in \\{1, 2, 4\\}, \\; q \\in \\{1, 2\\}: \\quad \\pm 1, \\; \\pm 2, \\; \\pm 4, \\; \\pm\\frac{1}{2}$$\n\nThere are $8$ possible rational roots, not $2 \\cdot 3 \\cdot 2 = 12$.\n\n> **Watch out.** Multiplying the numbers of choices for $p$ and $q$ counts some values more than once, since different fractions can reduce to the same number. Count each value once, and count both signs: every positive candidate comes with its negative.",
        "列出所有 $\\frac{p}{q}$，约分并去掉重复：常数项为 $4$、首项系数为 $2$ 时，$\\frac{2}{2}$ 和 $\\frac{4}{2}$ 等于 $1$ 和 $2$，已经列过了。\n\n$$p \\in \\{1, 2, 4\\}, \\; q \\in \\{1, 2\\}: \\quad \\pm 1, \\; \\pm 2, \\; \\pm 4, \\; \\pm\\frac{1}{2}$$\n\n共有 $8$ 个可能的有理根，而不是 $2 \\cdot 3 \\cdot 2 = 12$ 个。\n\n> **注意。** 把 $p$ 和 $q$ 的选择个数直接相乘，会把一些值重复计数，因为不同的分数可能约成同一个数。每个值只数一次，而且正负都要数：每个正的候选值都对应一个负的。",
      ),
      generate(rng) {
        const a = rng.pick([1, 2, 3, 4, 6, 8, 9]);
        const d = rng.sign() * rng.pick([2, 3, 4, 5, 6, 8, 9, 10, 12, 15]);
        const cs = [a, rng.int(-6, 6), rng.int(-6, 6), d];
        const n = candidates(a, d).length;
        const naive = 2 * divisors(d).length * divisors(a).length;
        const groups = divisors(a)
          .map((q) => ({ q, k: divisors(d).filter((p) => gcd(p, q) === 1).length }))
          .filter((g) => g.k > 0);
        const half = groups.reduce((s, g) => s + g.k, 0);
        if (2 * half !== n) throw new RangeError("counting-candidates: the two counts differ");
        const s1 = stepLabel(1, "List the possible numerators and denominators", "列出可能的分子和分母");
        const s2 = stepLabel(2, "Form the fractions, reduce, and drop repeats", "组成分数、约分并去掉重复");
        const s3 = stepLabel(3, "Count", "计数");
        const list = divisorsText(a, d);
        const byQText = t(
          groups.map((g) => `denominator $${g.q}$: $${g.k}$`).join(", "),
          groups.map((g) => `分母 $${g.q}$：$${g.k}$ 个`).join("，"),
        );
        return numberProblem({
          prompt: t(
            `How many possible rational roots does the rational roots theorem give for $p(x) = ${P(cs)}$?`,
            `根据有理根定理，$p(x) = ${P(cs)}$ 有多少个可能的有理根？`,
          ),
          answer: n,
          wrong: [naive, n / 2, divisors(d).length * divisors(a).length],
          solution: t(
            `${s1.en} ${list.en}\n\n${s2.en} Form every $\\frac{p}{q}$ and reduce it. Fractions that reduce to the same number count once, and each value comes with both signs:${steps(candidatesLatex(a, d))}\n\n${s3.en} The list has $${n / 2}$ positive values, each with its negative, so there are $${n}$ possible rational roots.\n\n**Check.** Count the positive candidates again, grouped by their denominator in lowest terms. A fraction $\\frac{p}{q}$ is in lowest terms when $p$ and $q$ share no factor: ${byQText.en}. In all there are $${half}$ positive values, and with both signs $2 \\cdot ${half} = ${n}$.`,
            `${s1["zh-CN"]}${list["zh-CN"]}\n\n${s2["zh-CN"]}组成每个 $\\frac{p}{q}$ 并约分。约成同一个数的分数只算一次，每个值都有正负两个：${steps(candidatesLatex(a, d))}\n\n${s3["zh-CN"]}表中有 $${n / 2}$ 个正值，每个都对应一个负值，所以共有 $${n}$ 个可能的有理根。\n\n**检验。** 按最简分数的分母分组，重新数正的候选值。当 $p$ 和 $q$ 没有公因数时 $\\frac{p}{q}$ 是最简分数：${byQText["zh-CN"]}。共 $${half}$ 个正值，算上正负共 $2 \\cdot ${half} = ${n}$ 个。`,
          ),
        });
      },
    },
    {
      id: "finding-rational-roots",
      title: t("Finding the rational roots", "求有理根"),
      explanation: t(
        "Test the candidates until one is a root, divide by the matching factor, and solve the quadratic that is left.\n\nFor $2x^{3} + x^{2} - 7x - 6$, the candidates are $\\pm 1, \\pm 2, \\pm 3, \\pm 6, \\pm\\frac{1}{2}, \\pm\\frac{3}{2}$. Testing gives $p(-1) = 0$, and dividing by $x + 1$ leaves $2x^{2} - x - 6 = (2x + 3)(x - 2)$:\n\n$$2x^{3} + x^{2} - 7x - 6 = (x + 1)(2x + 3)(x - 2)$$\n\nThe rational roots are $-1$, $-\\frac{3}{2}$ and $2$.\n\n> **Watch out.** The factor $ux - v$ gives the root $\\frac{v}{u}$, not $v$. Each root $c$ goes with the factor $x - c$, so the signs must not flip. Finding one root is not the end: the roots of the quadratic that is left are roots too.",
        "逐个检验候选值，直到找到一个根，除以对应的因式，再解剩下的二次式。\n\n对 $2x^{3} + x^{2} - 7x - 6$，候选值是 $\\pm 1, \\pm 2, \\pm 3, \\pm 6, \\pm\\frac{1}{2}, \\pm\\frac{3}{2}$。检验得 $p(-1) = 0$，除以 $x + 1$ 剩下 $2x^{2} - x - 6 = (2x + 3)(x - 2)$：\n\n$$2x^{3} + x^{2} - 7x - 6 = (x + 1)(2x + 3)(x - 2)$$\n\n有理根是 $-1$、$-\\frac{3}{2}$ 和 $2$。\n\n> **注意。** 因式 $ux - v$ 给出的根是 $\\frac{v}{u}$，而不是 $v$。每个根 $c$ 对应因式 $x - c$，符号不能反。找到一个根还没有结束：剩下的二次式的根也是根。",
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
          const d = cs[3]!;
          const s1 = stepLabel(1, "List the candidates", "列出候选值");
          const s2 = stepLabel(2, "Test the candidates", "检验候选值");
          const s3 = stepLabel(3, "Divide by the factor", "除以这个因式");
          const s4 = stepLabel(4, "Solve the quadratic", "解二次方程");
          const list = divisorsText(u, d);
          const q = quad[2]!;
          const quadStep =
            others.length === 2
              ? t(
                  `Set the quotient equal to zero and factor it:${steps(`${P(quad)} = ${lf(1, -others[0]!)}${lf(1, -others[1]!)} = 0`)}This gives $x = ${others[0]}$ and $x = ${others[1]}$.`,
                  `令商等于零并分解：${steps(`${P(quad)} = ${lf(1, -others[0]!)}${lf(1, -others[1]!)} = 0`)}得 $x = ${others[0]}$ 和 $x = ${others[1]}$。`,
                )
              : q < 0
                ? t(
                    `Setting the quotient equal to zero gives $x^{2} = ${-q}$, so $x = \\pm\\sqrt{${-q}}$. Since $${-q}$ is not a perfect square, these roots are irrational, not rational.`,
                    `令商等于零得 $x^{2} = ${-q}$，所以 $x = \\pm\\sqrt{${-q}}$。因为 $${-q}$ 不是完全平方数，这两个根是无理数，不是有理根。`,
                  )
                : t(
                    `Setting the quotient equal to zero gives $x^{2} = ${-q}$, which has no real solution, since a square is never negative.`,
                    `令商等于零得 $x^{2} = ${-q}$，它没有实数解，因为平方不会是负数。`,
                  );
          const check = factorCheck(cs, [
            [[u, -v], 1],
            ...(others.length === 2
              ? ([
                  [[1, -others[0]!], 1],
                  [[1, -others[1]!], 1],
                ] as FactorPower[])
              : ([[quad, 1]] as FactorPower[])),
          ]);
          const factored = `${lf(u, -v)}${others.length === 2 ? `${lf(1, -others[0]!)}${lf(1, -others[1]!)}` : `(${P(quad)})`}`;
          return solutionsProblem({
            prompt: t(`Find all the rational roots of $p(x) = ${P(cs)}$.`, `求 $p(x) = ${P(cs)}$ 的所有有理根。`),
            values,
            wrong: [[String(v), ...others.map(String)], [root.neg().toLatex(), ...others.map((o) => String(-o))], [root.toLatex()]].filter(
              (w) => w.length > 0,
            ),
            solution: t(
              [
                `${s1.en} ${list.en}So the possible rational roots are${steps(candidatesLatex(u, d))}`,
                `${s2.en} Put the candidates into $p(x)$ until one gives zero. One that works is $${root.toLatex()}$:${steps(valueLine(cs, root))}By the factor theorem, $x - ${parenQ(root)}$ is a factor, and so is $${linear(u, -v)}$, which is $${u}$ times it.`,
                `${s3.en} Long division by $${linear(u, -v)}$ leaves remainder $0$ and the quotient $${P(quad)}$:${steps(div.latex)}`,
                `${s4.en} ${quadStep.en} The rational roots are $${values.join(", ")}$.`,
                `${check.en.replace("**Check.** Evaluate both forms", `**Check.** The work gives $p(x) = ${factored}$. Evaluate both forms`)}`,
              ].join("\n\n"),
              [
                `${s1["zh-CN"]}${list["zh-CN"]}所以可能的有理根是${steps(candidatesLatex(u, d))}`,
                `${s2["zh-CN"]}把候选值代入 $p(x)$，直到有一个得零。$${root.toLatex()}$ 满足：${steps(valueLine(cs, root))}由因式定理，$x - ${parenQ(root)}$ 是因式，它的 $${u}$ 倍 $${linear(u, -v)}$ 也是。`,
                `${s3["zh-CN"]}用长除法除以 $${linear(u, -v)}$，余数为 $0$，商为 $${P(quad)}$：${steps(div.latex)}`,
                `${s4["zh-CN"]}${quadStep["zh-CN"]}有理根是 $${values.join(", ")}$。`,
                `${check["zh-CN"].replace("**检验。** 在", `**检验。** 由以上得 $p(x) = ${factored}$。在`)}`,
              ].join("\n\n"),
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
