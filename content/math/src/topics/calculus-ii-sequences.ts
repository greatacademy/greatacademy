import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Interval, linear, poly, Q } from "@ga/subject-math";

import { functionProblem, intervalProblem, numberProblem, pointProblem } from "../problems.ts";
import { gcd, type LimitValue, limitChoice, limitLatex, oneOf } from "./calculus-common.ts";

// Calculus II unit 4: Sequences & Series, modules 4.17 (Sequences),
// 4.18 (Monotonic Sequences), 4.19 (Infinite Series) and 4.20 (Geometric Series).

/** limN writes the limit as n → ∞. */
const limN = "\\lim_{n \\to \\infty}";

/** term writes c·body, leaving out a coefficient of 1 and writing a dot before a body that starts with a digit. */
export function term(c: number, body: string): string {
  if (body === "") return `${c}`;
  if (c === 1) return body;
  if (c === -1) return `-${body}`;
  return /^[0-9]/.test(body) ? `${c} \\cdot ${body}` : `${c}${body}`;
}

/** plus joins terms with + and −. */
export const plus = (...terms: readonly string[]) =>
  terms.reduce((out, s) => (out === "" ? s : s.startsWith("-") ? `${out} - ${s.slice(1)}` : `${out} + ${s}`), "");

/** powN writes rⁿ (or another exponent), with parentheses around a negative or fractional ratio. */
export function powN(r: Q, e = "n"): string {
  const s = r.toLatex();
  return r.sign() > 0 && /^[0-9]+$/.test(s) ? `${s}^{${e}}` : `\\left(${s}\\right)^{${e}}`;
}

/** shift writes n + k, or n when k is 0. */
const shift = (k: number) => linear(1, k, "n");

/** fact writes (n + k)!, or n! when k is 0. */
const fact = (k: number) => (k === 0 ? "n!" : `(${shift(k)})!`);

/** limitWord says what a limit is in words for a solution. */
function limitWord(v: LimitValue): Text {
  if (v === "dne") return t("the limit does not exist", "极限不存在");
  return t(`the limit is $${limitLatex(v)}$`, `极限为 $${limitLatex(v)}$`);
}

/** limitsOfSequences finds limits of sequences given by rational expressions in n. */
export const limitsOfSequences: TopicDef = {
  id: "limits-of-sequences",
  title: t("Limits of Sequences", "数列的极限"),
  summary: t(
    "A sequence converges to L when its terms get arbitrarily close to L as n grows; for a rational expression in n, compare the leading terms.",
    "当 n 增大时数列的项任意接近 L，就说数列收敛于 L；对 n 的有理式，比较首项即可。",
  ),
  prerequisites: ["introduction-to-sequences", "limits-at-infinity-and-horizontal-asymptotes-of-rational-functions"],
  encompasses: [{ topic: "limits-at-infinity-and-horizontal-asymptotes-of-rational-functions", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "limits-of-rational-sequences",
      title: t("Sequences with leading terms of equal degree", "首项次数相同的数列"),
      explanation: t(
        "A sequence $a_n$ **converges** to $L$, written $\\lim_{n \\to \\infty} a_n = L$, when $a_n$ gets as close to $L$ as we like for all large enough $n$. If $a_n = f(n)$ and $\\lim_{x \\to \\infty} f(x) = L$, then $\\lim_{n \\to \\infty} a_n = L$. When the numerator and denominator have the same degree, the limit is the ratio of the leading coefficients:\n\n$$\\lim_{n \\to \\infty} \\frac{3n^{2} - n}{2n^{2} + 5} = \\lim_{n \\to \\infty} \\frac{3 - \\frac{1}{n}}{2 + \\frac{5}{n^{2}}} = \\frac{3}{2}.$$",
        "当 $n$ 足够大时，若 $a_n$ 能任意接近 $L$，就说数列 $a_n$ **收敛**于 $L$，记作 $\\lim_{n \\to \\infty} a_n = L$。若 $a_n = f(n)$ 且 $\\lim_{x \\to \\infty} f(x) = L$，则 $\\lim_{n \\to \\infty} a_n = L$。分子分母次数相同时，极限是首项系数之比：\n\n$$\\lim_{n \\to \\infty} \\frac{3n^{2} - n}{2n^{2} + 5} = \\lim_{n \\to \\infty} \\frac{3 - \\frac{1}{n}}{2 + \\frac{5}{n^{2}}} = \\frac{3}{2}。$$",
      ),
      generate(rng) {
        const d = rng.int(1, 2);
        const p = rng.nonZero(-9, 9);
        const s = rng.int(1, 9);
        const q = rng.int(-9, 9);
        const u = rng.int(1, 9);
        const lead = d === 1 ? "n" : "n^{2}";
        const top = d === 1 ? poly([p, "n"], [q, ""]) : poly([p, "n^{2}"], [q, "n"]);
        const bottom = poly([s, lead], [u, ""]);
        const answer = Q.of(p, s);
        return numberProblem({
          prompt: t(`Find $${limN} \\frac{${top}}{${bottom}}$.`, `求 $${limN} \\frac{${top}}{${bottom}}$。`),
          answer,
          wrong: [Q.of(s, p), Q.zero, Q.of(p), ...(d === 1 ? [Q.of(q, u)] : [])],
          solution: t(
            `Divide the numerator and the denominator by $${lead}$. Every term except the leading ones tends to $0$, so the limit is $\\frac{${p}}{${s}} = ${answer.toLatex()}$.`,
            `分子分母同除以 $${lead}$。除首项外的各项都趋于 $0$，所以极限为 $\\frac{${p}}{${s}} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "limits-of-sequences-with-different-degrees",
      title: t("Leading terms of different degrees", "首项次数不同"),
      explanation: t(
        "If the denominator has the higher degree, $a_n \\to 0$. If the numerator has the higher degree, $a_n$ grows without bound: it tends to $\\infty$ or $-\\infty$ by the sign of the ratio of the leading coefficients, and the sequence **diverges**. For example, $\\frac{4n}{n^{2} + 1} \\to 0$ and $\\frac{-n^{2}}{3n + 1} \\to -\\infty$.",
        "若分母次数更高，则 $a_n \\to 0$。若分子次数更高，$a_n$ 无界增长：按首项系数之比的符号趋于 $\\infty$ 或 $-\\infty$，数列**发散**。例如 $\\frac{4n}{n^{2} + 1} \\to 0$，$\\frac{-n^{2}}{3n + 1} \\to -\\infty$。",
      ),
      generate(rng) {
        const dn = rng.int(1, 3);
        let dd = rng.int(1, 3);
        if (dd === dn) dd = dn === 3 ? 1 : dn + 1;
        const p = rng.nonZero(-9, 9);
        const s = rng.nonZero(-9, 9);
        const q = rng.int(1, 9);
        const u = rng.int(1, 9);
        const pw = (k: number) => (k === 1 ? "n" : `n^{${k}}`);
        const top = poly([p, pw(dn)], [q, ""]);
        const bottom = poly([s, pw(dd)], [u, ""]);
        const right: LimitValue = dn < dd ? Q.zero : p * s > 0 ? "inf" : "-inf";
        return limitChoice(
          rng,
          t(`Find $${limN} \\frac{${top}}{${bottom}}$.`, `求 $${limN} \\frac{${top}}{${bottom}}$。`),
          right,
          [Q.of(p, s), Q.zero, Q.of(q, u)],
          dn < dd
            ? t(
                `The denominator has the higher degree ($${dd} > ${dn}$), so dividing by $${pw(dd)}$ leaves a numerator that tends to $0$ over a denominator that tends to $${s}$. The limit is $0$.`,
                `分母次数更高（$${dd} > ${dn}$），同除以 $${pw(dd)}$ 后分子趋于 $0$，分母趋于 $${s}$，极限为 $0$。`,
              )
            : t(
                `The numerator has the higher degree ($${dn} > ${dd}$), so $a_n$ behaves like $\\frac{${p}}{${s}}${pw(dn - dd)}$, which tends to $${limitLatex(right as "inf" | "-inf")}$.`,
                `分子次数更高（$${dn} > ${dd}$），$a_n$ 的表现类似 $\\frac{${p}}{${s}}${pw(dn - dd)}$，趋于 $${limitLatex(right as "inf" | "-inf")}$。`,
              ),
        );
      },
    },
  ],
};

/** coefficientOf writes a coefficient in front of a power: "", "-" or the number. */
const coefficientOf = (c: number) => (c === 1 ? "" : c === -1 ? "-" : `${c}`);

/** convergenceOfGeometricSequences finds the limit of c·rⁿ by the size of r. */
export const convergenceOfGeometricSequences: TopicDef = {
  id: "convergence-of-geometric-sequences",
  title: t("Convergence of Geometric Sequences", "等比数列的收敛性"),
  summary: t(
    "The geometric sequence c·rⁿ (c ≠ 0) converges to 0 when |r| < 1, to c when r = 1, and diverges otherwise.",
    "等比数列 c·rⁿ（c ≠ 0）在 |r| < 1 时收敛于 0，在 r = 1 时收敛于 c，其余情形发散。",
  ),
  prerequisites: ["limits-of-sequences", "nth-term-of-a-geometric-sequence"],
  encompasses: [{ topic: "limits-of-sequences", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "limits-of-geometric-sequences",
      title: t("The limit of c·rⁿ", "c·rⁿ 的极限"),
      explanation: t(
        "For $c \\neq 0$, the sequence $c \\cdot r^{n}$:\n\n- tends to $0$ when $-1 < r < 1$, since the powers shrink;\n- is constant, equal to $c$, when $r = 1$;\n- tends to $\\infty$ or $-\\infty$ (by the sign of $c$) when $r > 1$;\n- has no limit when $r \\le -1$, since its terms alternate in sign without settling.\n\nFor example, $5\\left(-\\frac{2}{3}\\right)^{n} \\to 0$, while $-2 \\cdot 3^{n} \\to -\\infty$.",
        "对 $c \\neq 0$，数列 $c \\cdot r^{n}$：\n\n- $-1 < r < 1$ 时趋于 $0$，因为幂越来越小；\n- $r = 1$ 时恒等于 $c$；\n- $r > 1$ 时按 $c$ 的符号趋于 $\\infty$ 或 $-\\infty$；\n- $r \\le -1$ 时没有极限，因为各项正负交替而不趋于定值。\n\n例如 $5\\left(-\\frac{2}{3}\\right)^{n} \\to 0$，而 $-2 \\cdot 3^{n} \\to -\\infty$。",
      ),
      generate(rng) {
        const c = rng.nonZero(-9, 9);
        const q = rng.int(1, 6);
        const p = rng.nonZero(-2 * q, 2 * q);
        const r = Q.of(p, q);
        const v = r.toNumber();
        const right: LimitValue = Math.abs(v) < 1 ? Q.zero : v === 1 ? Q.of(c) : v > 1 ? (c > 0 ? "inf" : "-inf") : "dne";
        const a = `${coefficientOf(c)}${powN(r)}`;
        const why =
          Math.abs(v) < 1
            ? t(`$|r| = ${r.abs().toLatex()} < 1$, so $r^{n} \\to 0$`, `$|r| = ${r.abs().toLatex()} < 1$，所以 $r^{n} \\to 0$`)
            : v === 1
              ? t(`$r = 1$, so every term equals $${c}$`, `$r = 1$，所以每一项都等于 $${c}$`)
              : v > 1
                ? t(`$r = ${r.toLatex()} > 1$, so $r^{n} \\to \\infty$`, `$r = ${r.toLatex()} > 1$，所以 $r^{n} \\to \\infty$`)
                : t(
                    `$r = ${r.toLatex()} \\le -1$, so the terms alternate in sign and do not shrink`,
                    `$r = ${r.toLatex()} \\le -1$，所以各项正负交替且不变小`,
                  );
        const word = limitWord(right);
        return limitChoice(
          rng,
          t(`Find $${limN} ${a}$.`, `求 $${limN} ${a}$。`),
          right,
          [Q.of(c), Q.zero],
          t(`Here ${why.en}; ${word.en}.`, `这里 ${why["zh-CN"]}；${word["zh-CN"]}。`),
          undefined,
          true,
        );
      },
    },
  ],
};

/** furtherConvergenceOfGeometricSequences handles sums of exponentials and ratios that depend on x. */
export const furtherConvergenceOfGeometricSequences: TopicDef = {
  id: "further-convergence-of-geometric-sequences",
  title: t("Further Convergence of Geometric Sequences", "等比数列收敛性进阶"),
  summary: t(
    "Divide by the dominant exponential to find limits of quotients of exponentials, and find the values of x for which a geometric sequence converges.",
    "除以占主导的指数项来求指数式之商的极限，并求使等比数列收敛的 x 的取值。",
  ),
  prerequisites: ["convergence-of-geometric-sequences"],
  encompasses: [{ topic: "convergence-of-geometric-sequences", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "quotients-of-exponentials",
      title: t("Quotients of exponentials", "指数式之商"),
      explanation: t(
        "Divide every term by the fastest-growing exponential. Each other term becomes a geometric sequence with ratio between $0$ and $1$, which tends to $0$:\n\n$$\\frac{2 \\cdot 5^{n} + 3^{n}}{5^{n} - 4^{n}} = \\frac{2 + \\left(\\frac{3}{5}\\right)^{n}}{1 - \\left(\\frac{4}{5}\\right)^{n}} \\to \\frac{2 + 0}{1 - 0} = 2.$$",
        "把每一项都除以增长最快的指数项。其余各项都变成公比在 $0$ 与 $1$ 之间的等比数列，趋于 $0$：\n\n$$\\frac{2 \\cdot 5^{n} + 3^{n}}{5^{n} - 4^{n}} = \\frac{2 + \\left(\\frac{3}{5}\\right)^{n}}{1 - \\left(\\frac{4}{5}\\right)^{n}} \\to \\frac{2 + 0}{1 - 0} = 2。$$",
      ),
      generate(rng) {
        const b = rng.int(3, 7);
        const c = rng.int(2, b - 1);
        const d = rng.int(2, b - 1);
        const p = rng.nonZero(-9, 9);
        const r = rng.int(1, 9);
        const q = rng.nonZero(-9, 9);
        const s = rng.nonZero(-9, 9);
        const top = plus(term(p, `${b}^{n}`), term(q, `${c}^{n}`));
        const bottom = plus(term(r, `${b}^{n}`), term(s, `${d}^{n}`));
        const answer = Q.of(p, r);
        const ratio = (k: number) => `\\left(\\frac{${k}}{${b}}\\right)^{n}`;
        return numberProblem({
          prompt: t(`Find $${limN} \\frac{${top}}{${bottom}}$.`, `求 $${limN} \\frac{${top}}{${bottom}}$。`),
          answer,
          wrong: [Q.of(q, s), ...(r + s === 0 ? [] : [Q.of(p + q, r + s)]), Q.of(p), Q.zero],
          solution: t(
            `Divide by $${b}^{n}$: $\\frac{${plus(`${p}`, term(q, ratio(c)))}}{${plus(`${r}`, term(s, ratio(d)))}}$. Both powers have ratios between $0$ and $1$, so they tend to $0$, and the limit is $${answer.toLatex()}$.`,
            `同除以 $${b}^{n}$：$\\frac{${plus(`${p}`, term(q, ratio(c)))}}{${plus(`${r}`, term(s, ratio(d)))}}$。两个幂的公比都在 $0$ 与 $1$ 之间，趋于 $0$，所以极限为 $${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "values-of-x-for-convergence",
      title: t("Values of x for which a geometric sequence converges", "使等比数列收敛的 x"),
      explanation: t(
        "A geometric sequence $r^{n}$ converges exactly when $-1 < r \\le 1$: to $0$ inside, and to $1$ at $r = 1$. When the ratio depends on $x$, solve this compound inequality. For $\\left(\\frac{x - 1}{3}\\right)^{n}$:\n\n$$-1 < \\frac{x - 1}{3} \\le 1 \\iff -3 < x - 1 \\le 3 \\iff -2 < x \\le 4,$$\n\nso the sequence converges for $x$ in $(-2, 4]$.",
        "等比数列 $r^{n}$ 收敛当且仅当 $-1 < r \\le 1$：区间内部收敛于 $0$，$r = 1$ 时收敛于 $1$。公比含 $x$ 时，解这个连不等式。对 $\\left(\\frac{x - 1}{3}\\right)^{n}$：\n\n$$-1 < \\frac{x - 1}{3} \\le 1 \\iff -3 < x - 1 \\le 3 \\iff -2 < x \\le 4，$$\n\n所以当 $x$ 属于 $(-2, 4]$ 时数列收敛。",
      ),
      generate(rng) {
        const a = rng.int(1, 4);
        const b = rng.int(-9, 9);
        const k = rng.int(1, 9);
        const L = linear(a, b);
        const base = k === 1 ? `\\left(${L}\\right)^{n}` : `\\left(\\frac{${L}}{${k}}\\right)^{n}`;
        const lo = Q.of(-k - b, a);
        const hi = Q.of(k - b, a);
        const iv = (loClosed: boolean, hiClosed: boolean): Interval[] => [{ lo, hi, loClosed, hiClosed }];
        const middle = k === 1 ? L : `\\frac{${L}}{${k}}`;
        return intervalProblem({
          prompt: t(
            `For which values of $x$ does the sequence $a_n = ${base}$ converge? Give your answer in interval notation.`,
            `$x$ 取哪些值时数列 $a_n = ${base}$ 收敛？用区间表示。`,
          ),
          set: iv(false, true),
          form: "interval",
          wrong: [iv(false, false), iv(true, true), iv(true, false)],
          solution: t(
            `The sequence converges exactly when $-1 < ${middle} \\le 1$, that is $${-k} < ${L} \\le ${k}$, so $${lo.toLatex()} < x \\le ${hi.toLatex()}$. At the right end the ratio is $1$ and the sequence is constant; at the left end the ratio is $-1$ and it alternates.`,
            `数列收敛当且仅当 $-1 < ${middle} \\le 1$，即 $${-k} < ${L} \\le ${k}$，所以 $${lo.toLatex()} < x \\le ${hi.toLatex()}$。右端点处公比为 $1$，数列为常数；左端点处公比为 $-1$，数列正负交替。`,
          ),
        });
      },
    },
  ],
};

/** limitsOfSequencesWithFactorials cancels factorials and compares them with exponentials. */
export const limitsOfSequencesWithFactorials: TopicDef = {
  id: "limits-of-sequences-with-factorials",
  title: t("Limits of Sequences With Factorials", "含阶乘的数列的极限"),
  summary: t(
    "Cancel factorials by writing the larger one as a product ending in the smaller one; n! grows faster than any exponential kⁿ.",
    "把较大的阶乘写成以较小阶乘结尾的乘积来约分；n! 比任何指数 kⁿ 增长得都快。",
  ),
  prerequisites: ["limits-of-sequences", "factorials-in-variable-expressions"],
  encompasses: [{ topic: "limits-of-sequences", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "cancelling-factorials",
      title: t("Cancelling factorials", "阶乘的约分"),
      explanation: t(
        "Since $(n + 1)! = (n + 1) \\cdot n!$ and $(n + 2)! = (n + 2)(n + 1) \\cdot n!$, a quotient of factorials that differ by a fixed amount is a polynomial:\n\n$$\\frac{(n + 2)!}{n! \\, (3n^{2} + 1)} = \\frac{(n + 2)(n + 1)}{3n^{2} + 1} \\to \\frac{1}{3}.$$",
        "由于 $(n + 1)! = (n + 1) \\cdot n!$，$(n + 2)! = (n + 2)(n + 1) \\cdot n!$，相差固定量的两个阶乘之商是多项式：\n\n$$\\frac{(n + 2)!}{n! \\, (3n^{2} + 1)} = \\frac{(n + 2)(n + 1)}{3n^{2} + 1} \\to \\frac{1}{3}。$$",
      ),
      generate(rng) {
        if (rng.bool()) {
          const m = rng.int(2, 5);
          const p = rng.int(1, 9);
          const q = rng.int(1, 9);
          const answer = Q.of(1, p);
          const bottom = poly([p, "n^{2}"], [q, ""]);
          return numberProblem({
            prompt: t(
              `Find $${limN} \\frac{${fact(m)}}{${fact(m - 2)} \\, (${bottom})}$.`,
              `求 $${limN} \\frac{${fact(m)}}{${fact(m - 2)} \\, (${bottom})}$。`,
            ),
            answer,
            wrong: [Q.of(p), Q.zero, Q.one, Q.of(m * (m - 1), q)],
            solution: t(
              `$\\frac{${fact(m)}}{${fact(m - 2)}} = (${shift(m)})(${shift(m - 1)})$, a quadratic with leading coefficient $1$. So the quotient is $\\frac{(${shift(m)})(${shift(m - 1)})}{${bottom}} \\to \\frac{1}{${p}}$.`,
              `$\\frac{${fact(m)}}{${fact(m - 2)}} = (${shift(m)})(${shift(m - 1)})$，是首项系数为 $1$ 的二次式。所以商为 $\\frac{(${shift(m)})(${shift(m - 1)})}{${bottom}} \\to \\frac{1}{${p}}$。`,
            ),
          });
        }
        const k = rng.nonZero(-9, 9);
        const j = rng.int(1, 9);
        const top = linear(k, j, "n");
        return numberProblem({
          prompt: t(`Find $${limN} \\frac{(${top}) \\, n!}{(n + 1)!}$.`, `求 $${limN} \\frac{(${top}) \\, n!}{(n + 1)!}$。`),
          answer: k,
          wrong: [j, 0, k + j, Q.of(1, k)],
          solution: t(
            `$\\frac{n!}{(n + 1)!} = \\frac{1}{n + 1}$, so the sequence is $\\frac{${top}}{n + 1} \\to ${k}$.`,
            `$\\frac{n!}{(n + 1)!} = \\frac{1}{n + 1}$，所以数列为 $\\frac{${top}}{n + 1} \\to ${k}$。`,
          ),
        });
      },
    },
    {
      id: "factorials-against-exponentials",
      title: t("Factorials against exponentials", "阶乘与指数比较"),
      explanation: t(
        "For any fixed $k$, $n!$ eventually outgrows $k^{n}$: once $n > k$, each new factor of $n!$ exceeds $k$. So $\\frac{k^{n}}{n!} \\to 0$ and $\\frac{n!}{k^{n}} \\to \\infty$. For example, $\\frac{-3 \\cdot 5^{n}}{n!} \\to 0$ and $\\frac{n!}{-2 \\cdot 4^{n}} \\to -\\infty$.",
        "对任意固定的 $k$，$n!$ 最终都会超过 $k^{n}$：一旦 $n > k$，$n!$ 每增加的一个因子都大于 $k$。所以 $\\frac{k^{n}}{n!} \\to 0$，$\\frac{n!}{k^{n}} \\to \\infty$。例如 $\\frac{-3 \\cdot 5^{n}}{n!} \\to 0$，$\\frac{n!}{-2 \\cdot 4^{n}} \\to -\\infty$。",
      ),
      generate(rng) {
        const c = rng.nonZero(-9, 9);
        const k = rng.int(2, 9);
        const flip = rng.bool();
        const exp = term(c, `${k}^{n}`);
        const expr = flip ? `\\frac{n!}{${exp}}` : `\\frac{${exp}}{n!}`;
        const right: LimitValue = flip ? (c > 0 ? "inf" : "-inf") : Q.zero;
        return limitChoice(
          rng,
          t(`Find $${limN} ${expr}$.`, `求 $${limN} ${expr}$。`),
          right,
          [Q.of(c), Q.zero, Q.of(1, c)],
          t(
            `$n!$ grows faster than $${k}^{n}$, so ${flip ? `the quotient grows without bound with the sign of $${c}$` : "the quotient tends to $0$"}; ${limitWord(right).en}.`,
            `$n!$ 比 $${k}^{n}$ 增长得快，所以${flip ? `商的绝对值无界增长，符号与 $${c}$ 相同` : "商趋于 $0$"}；${limitWord(right)["zh-CN"]}。`,
          ),
        );
      },
    },
  ],
};

/** Growth is a kind of term in the hierarchy ln n ≪ nᵏ ≪ bⁿ ≪ n! ≪ nⁿ. */
interface Growth {
  readonly rank: number;
  readonly tex: string;
}

/** growth picks a term of the given rank. */
function growth(rng: Rng, rank: number): Growth {
  if (rank === 0) return { rank, tex: "\\ln n" };
  if (rank === 1) return { rank, tex: `n^{${rng.int(2, 5)}}` };
  if (rank === 2) return { rank, tex: `${rng.int(2, 6)}^{n}` };
  if (rank === 3) return { rank, tex: "n!" };
  return { rank, tex: "n^{n}" };
}

/** hierarchy states the order of growth. */
const hierarchy = "\\ln n \\ll n^{k} \\ll b^{n} \\ll n! \\ll n^{n}";

/** determiningLimitsOfSequencesUsingRelativeMagnitudes divides by the dominant term. */
export const determiningLimitsOfSequencesUsingRelativeMagnitudes: TopicDef = {
  id: "determining-limits-of-sequences-using-relative-magnitudes",
  title: t("Determining Limits of Sequences Using Relative Magnitudes", "利用相对量级求数列的极限"),
  summary: t(
    "As n → ∞, ln n ≪ nᵏ ≪ bⁿ ≪ n! ≪ nⁿ; dividing by the dominant term leaves the ratio of its coefficients.",
    "当 n → ∞ 时，ln n ≪ nᵏ ≪ bⁿ ≪ n! ≪ nⁿ；除以占主导的项后只剩其系数之比。",
  ),
  prerequisites: [
    "limits-of-sequences-with-factorials",
    "further-convergence-of-geometric-sequences",
    "evaluating-limits-at-infinity-by-comparing-relative-magnitudes-of-functions",
  ],
  encompasses: [{ topic: "limits-of-sequences-with-factorials", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "dividing-by-the-dominant-term",
      title: t("Dividing by the dominant term", "除以主导项"),
      explanation: t(
        `For large $n$ the common kinds of terms are ordered by growth (with $k > 0$ and $b > 1$):\n\n$$${hierarchy}.$$\n\nEach is eventually negligible next to the next, so the quotient of any lower term by a higher one tends to $0$. When the numerator and the denominator share the same dominant term $D$, divide by $D$:\n\n$$\\frac{4 \\cdot 3^{n} + n^{5}}{2 \\cdot 3^{n} - \\ln n} = \\frac{4 + \\frac{n^{5}}{3^{n}}}{2 - \\frac{\\ln n}{3^{n}}} \\to 2.$$`,
        `$n$ 很大时，常见的项按增长快慢排列（$k > 0$，$b > 1$）：\n\n$$${hierarchy}。$$\n\n每一项最终都远小于后一项，所以较低的项除以较高的项趋于 $0$。分子分母的主导项 $D$ 相同时，同除以 $D$：\n\n$$\\frac{4 \\cdot 3^{n} + n^{5}}{2 \\cdot 3^{n} - \\ln n} = \\frac{4 + \\frac{n^{5}}{3^{n}}}{2 - \\frac{\\ln n}{3^{n}}} \\to 2。$$`,
      ),
      generate(rng) {
        const D = growth(rng, rng.int(1, 4));
        const lesser = () => growth(rng, rng.int(0, D.rank - 1));
        const x = lesser();
        const y = lesser();
        const p = rng.nonZero(-9, 9);
        const q = rng.int(1, 9);
        const u = rng.nonZero(-5, 5);
        const v = rng.nonZero(-5, 5);
        const top = plus(term(p, D.tex), term(u, x.tex));
        const bottom = plus(term(q, D.tex), term(v, y.tex));
        const answer = Q.of(p, q);
        return numberProblem({
          prompt: t(`Find $${limN} \\frac{${top}}{${bottom}}$.`, `求 $${limN} \\frac{${top}}{${bottom}}$。`),
          answer,
          wrong: [Q.of(u, v), Q.of(q, p), Q.zero, Q.of(p)],
          solution: t(
            `The dominant term is $${D.tex}$, since $${hierarchy}$. Dividing by it, $\\frac{${x.tex}}{${D.tex}} \\to 0$ and $\\frac{${y.tex}}{${D.tex}} \\to 0$, so the limit is $\\frac{${p}}{${q}} = ${answer.toLatex()}$.`,
            `主导项是 $${D.tex}$，因为 $${hierarchy}$。同除以它，$\\frac{${x.tex}}{${D.tex}} \\to 0$，$\\frac{${y.tex}}{${D.tex}} \\to 0$，所以极限为 $\\frac{${p}}{${q}} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** furtherDeterminingLimitsOfSequencesUsingRelativeMagnitudes compares different dominant terms above and below. */
export const furtherDeterminingLimitsOfSequencesUsingRelativeMagnitudes: TopicDef = {
  id: "further-determining-limits-of-sequences-using-relative-magnitudes",
  title: t("Further Determining Limits of Sequences Using Relative Magnitudes", "利用相对量级求数列的极限进阶"),
  summary: t(
    "When the dominant terms above and below differ, the faster one decides: the limit is 0 or ±∞.",
    "分子分母的主导项不同时，增长更快的一方决定结果：极限为 0 或 ±∞。",
  ),
  prerequisites: ["determining-limits-of-sequences-using-relative-magnitudes"],
  encompasses: [{ topic: "determining-limits-of-sequences-using-relative-magnitudes", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "comparing-dominant-terms",
      title: t("Comparing the dominant terms above and below", "比较分子分母的主导项"),
      explanation: t(
        `Find the dominant term of the numerator and of the denominator. If the denominator's grows faster, the limit is $0$; if the numerator's grows faster, the sequence tends to $\\infty$ or $-\\infty$ by the sign of the ratio of their coefficients; if they are the same, the limit is that ratio. For example, $\\frac{n^{4} - 2^{n}}{3 \\cdot n! + n} \\to 0$ and $\\frac{-n!}{5^{n} + n^{2}} \\to -\\infty$.`,
        `分别找出分子和分母的主导项。若分母的增长更快，极限为 $0$；若分子的增长更快，数列按两者系数之比的符号趋于 $\\infty$ 或 $-\\infty$；若相同，极限就是该比值。例如 $\\frac{n^{4} - 2^{n}}{3 \\cdot n! + n} \\to 0$，$\\frac{-n!}{5^{n} + n^{2}} \\to -\\infty$。`,
      ),
      generate(rng) {
        const rn = rng.int(1, 4);
        let rd = rng.int(1, 4);
        if (rd === rn && rng.int(1, 4) > 1) rd = rn === 4 ? 1 : rn + 1;
        const N = growth(rng, rn);
        const Dn = growth(rng, rd);
        const x = growth(rng, rng.int(0, rn - 1));
        const y = growth(rng, rng.int(0, rd - 1));
        const p = rng.nonZero(-9, 9);
        const q = rng.nonZero(-9, 9);
        const top = plus(term(p, N.tex), term(rng.nonZero(-5, 5), x.tex));
        const bottom = plus(term(q, Dn.tex), term(rng.nonZero(-5, 5), y.tex));
        const right: LimitValue = rn < rd ? Q.zero : rn > rd ? (p * q > 0 ? "inf" : "-inf") : Q.of(p, q);
        const why =
          rn < rd
            ? t(`$${Dn.tex}$ in the denominator grows faster than $${N.tex}$`, `分母中的 $${Dn.tex}$ 比 $${N.tex}$ 增长得快`)
            : rn > rd
              ? t(
                  `$${N.tex}$ in the numerator grows faster than $${Dn.tex}$, and the sign is that of $\\frac{${p}}{${q}}$`,
                  `分子中的 $${N.tex}$ 比 $${Dn.tex}$ 增长得快，符号与 $\\frac{${p}}{${q}}$ 相同`,
                )
              : t(
                  `both are dominated by $${N.tex}$, so the limit is $\\frac{${p}}{${q}}$`,
                  `分子分母的主导项都是 $${N.tex}$，极限为 $\\frac{${p}}{${q}}$`,
                );
        return limitChoice(
          rng,
          t(`Find $${limN} \\frac{${top}}{${bottom}}$.`, `求 $${limN} \\frac{${top}}{${bottom}}$。`),
          right,
          [Q.of(p, q), Q.zero],
          t(`By $${hierarchy}$, ${why.en}; ${limitWord(right).en}.`, `由 $${hierarchy}$，${why["zh-CN"]}；${limitWord(right)["zh-CN"]}。`),
        );
      },
    },
  ],
};

/** monotonicity names whether a sequence increases, decreases or neither. */
const monotonicity = [
  t("Increasing", "单调递增"),
  t("Decreasing", "单调递减"),
  t("Neither increasing nor decreasing", "既不递增也不递减"),
] as const;

/** monotonicSequences decides monotonicity from the sign of aₙ₊₁ − aₙ. */
export const monotonicSequences: TopicDef = {
  id: "monotonic-sequences",
  title: t("Monotonic Sequences", "单调数列"),
  summary: t(
    "A sequence is increasing when aₙ₊₁ > aₙ for every n and decreasing when aₙ₊₁ < aₙ; check the sign of aₙ₊₁ − aₙ.",
    "若对每个 n 都有 aₙ₊₁ > aₙ，数列单调递增；若 aₙ₊₁ < aₙ，则单调递减；看 aₙ₊₁ − aₙ 的符号即可。",
  ),
  prerequisites: ["limits-of-sequences"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-difference-of-consecutive-terms",
      title: t("The difference of consecutive terms", "相邻两项之差"),
      explanation: t(
        "To decide whether $a_n$ is monotonic, simplify $a_{n+1} - a_n$. For $a_n = \\frac{2n + 1}{n + 3}$:\n\n$$a_{n+1} - a_n = \\frac{2n + 3}{n + 4} - \\frac{2n + 1}{n + 3} = \\frac{(2n + 3)(n + 3) - (2n + 1)(n + 4)}{(n + 3)(n + 4)} = \\frac{5}{(n + 3)(n + 4)}.$$\n\nThe difference is positive for every $n \\ge 1$, so the sequence is increasing.",
        "判断 $a_n$ 是否单调，就化简 $a_{n+1} - a_n$。对 $a_n = \\frac{2n + 1}{n + 3}$：\n\n$$a_{n+1} - a_n = \\frac{2n + 3}{n + 4} - \\frac{2n + 1}{n + 3} = \\frac{(2n + 3)(n + 3) - (2n + 1)(n + 4)}{(n + 3)(n + 4)} = \\frac{5}{(n + 3)(n + 4)}。$$\n\n对每个 $n \\ge 1$ 差都为正，所以数列单调递增。",
      ),
      generate(rng) {
        for (;;) {
          const p = rng.nonZero(-6, 6);
          const q = rng.int(-9, 9);
          const s = rng.int(0, 6);
          const K = p * s - q;
          if (K === 0) continue;
          return numberProblem({
            prompt: t(
              `For $a_n = \\frac{${linear(p, q, "n")}}{${shift(s)}}$, the difference $a_{n+1} - a_n$ simplifies to $\\frac{K}{(${shift(s)})(${shift(s + 1)})}$. Find $K$.`,
              `对 $a_n = \\frac{${linear(p, q, "n")}}{${shift(s)}}$，差 $a_{n+1} - a_n$ 可化简为 $\\frac{K}{(${shift(s)})(${shift(s + 1)})}$。求 $K$。`,
            ),
            answer: K,
            wrong: [-K, p, p * s + q, p + q],
            solution: t(
              `$a_{n+1} = \\frac{${linear(p, p + q, "n")}}{${shift(s + 1)}}$. Over the common denominator, the numerator is $(${linear(p, p + q, "n")})(${shift(s)}) - (${linear(p, q, "n")})(${shift(s + 1)})$; the $n^{2}$ and $n$ terms cancel, leaving $${p} \\cdot ${s} - (${q}) = ${K}$.`,
              `$a_{n+1} = \\frac{${linear(p, p + q, "n")}}{${shift(s + 1)}}$。通分后分子为 $(${linear(p, p + q, "n")})(${shift(s)}) - (${linear(p, q, "n")})(${shift(s + 1)})$；$n^{2}$ 项与 $n$ 项相消，剩下 $${p} \\cdot ${s} - (${q}) = ${K}$。`,
            ),
          });
        }
      },
    },
    {
      id: "classifying-monotonic-sequences",
      title: t("Classifying sequences as increasing or decreasing", "判断数列的增减"),
      explanation: t(
        "A sequence is **increasing** if $a_{n+1} > a_n$ for all $n \\ge 1$, **decreasing** if $a_{n+1} < a_n$ for all $n \\ge 1$, and **monotonic** if it is either. A sign that alternates, as with a factor $(-1)^{n}$, or a difference that changes sign, means it is neither. For $a_n = n^{2} - 5n$, $a_{n+1} - a_n = 2n - 4$ is negative at $n = 1$ and positive at $n = 3$, so the sequence is not monotonic.",
        "若对所有 $n \\ge 1$ 有 $a_{n+1} > a_n$，数列**单调递增**；若 $a_{n+1} < a_n$，则**单调递减**；两者之一成立就称为**单调**数列。若符号正负交替（如含因子 $(-1)^{n}$），或差会变号，则既不递增也不递减。对 $a_n = n^{2} - 5n$，$a_{n+1} - a_n = 2n - 4$ 在 $n = 1$ 时为负、在 $n = 3$ 时为正，所以数列不单调。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        if (kind === 0) {
          for (;;) {
            const p = rng.nonZero(-6, 6);
            const q = rng.int(-9, 9);
            const s = rng.int(0, 6);
            const K = p * s - q;
            if (K === 0) continue;
            const a = `\\frac{${linear(p, q, "n")}}{${shift(s)}}`;
            return oneOf(
              rng,
              t(`Is the sequence $a_n = ${a}$ increasing, decreasing or neither?`, `数列 $a_n = ${a}$ 是单调递增、单调递减，还是都不是？`),
              monotonicity[K > 0 ? 0 : 1],
              [monotonicity[K > 0 ? 1 : 0], monotonicity[2]],
              t(
                `$a_{n+1} - a_n = \\frac{${K}}{(${shift(s)})(${shift(s + 1)})}$, which is ${K > 0 ? "positive" : "negative"} for every $n \\ge 1$, so the sequence is ${K > 0 ? "increasing" : "decreasing"}.`,
                `$a_{n+1} - a_n = \\frac{${K}}{(${shift(s)})(${shift(s + 1)})}$，对每个 $n \\ge 1$ 都${K > 0 ? "为正" : "为负"}，所以数列单调${K > 0 ? "递增" : "递减"}。`,
              ),
            );
          }
        }
        if (kind === 1) {
          const k = rng.int(-3, 12);
          const a = poly([1, "n^{2}"], [-k, "n"]);
          // a_{n+1} − a_n = 2n + 1 − k is positive for all n ≥ 1 exactly when k < 3.
          const inc = k < 3;
          return oneOf(
            rng,
            t(`Is the sequence $a_n = ${a}$ increasing, decreasing or neither?`, `数列 $a_n = ${a}$ 是单调递增、单调递减，还是都不是？`),
            monotonicity[inc ? 0 : 2],
            [monotonicity[1], monotonicity[inc ? 2 : 0]],
            t(
              `$a_{n+1} - a_n = ${linear(2, 1 - k, "n")}$. ${inc ? "It is positive for every $n \\ge 1$, so the sequence is increasing." : `At $n = 1$ it is $${3 - k} \\le 0$, but it is positive for large $n$, so the sequence is neither.`}`,
              `$a_{n+1} - a_n = ${linear(2, 1 - k, "n")}$。${inc ? "它对每个 $n \\ge 1$ 都为正，所以数列单调递增。" : `$n = 1$ 时它等于 $${3 - k} \\le 0$，但 $n$ 很大时为正，所以既不递增也不递减。`}`,
            ),
          );
        }
        const c = rng.int(1, 9);
        const s = rng.int(0, 6);
        const a = `\\frac{(-1)^{n} \\, ${c}}{${shift(s)}}`;
        return oneOf(
          rng,
          t(`Is the sequence $a_n = ${a}$ increasing, decreasing or neither?`, `数列 $a_n = ${a}$ 是单调递增、单调递减，还是都不是？`),
          monotonicity[2],
          [monotonicity[0], monotonicity[1]],
          t(
            "The factor $(-1)^{n}$ makes the terms alternate between negative and positive values, so the sequence goes up and down: it is neither increasing nor decreasing.",
            "因子 $(-1)^{n}$ 使各项在负值与正值之间交替，数列时升时降：既不递增也不递减。",
          ),
        );
      },
    },
  ],
};

/** identifyingMonotonicSequencesUsingDifferentiation uses the sign of f′ for aₙ = f(n). */
export const identifyingMonotonicSequencesUsingDifferentiation: TopicDef = {
  id: "identifying-monotonic-sequences-using-differentiation",
  title: t("Identifying Monotonic Sequences Using Differentiation", "用导数判断数列的单调性"),
  summary: t(
    "If aₙ = f(n) and f′(x) < 0 for x ≥ N, the sequence is decreasing from n = N on.",
    "若 aₙ = f(n) 且当 x ≥ N 时 f′(x) < 0，则数列从 n = N 起单调递减。",
  ),
  prerequisites: ["monotonic-sequences", "determining-intervals-on-which-a-function-is-increasing-or-decreasing"],
  encompasses: [{ topic: "monotonic-sequences", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "eventually-decreasing-sequences",
      title: t("Where a sequence starts to decrease", "数列从哪一项开始递减"),
      explanation: t(
        "When $a_n = f(n)$ for a differentiable $f$, the sign of $f'(x)$ tells how the terms move: if $f' < 0$ on $[N, \\infty)$, then $a_N > a_{N+1} > a_{N+2} > \\cdots$. For $a_n = n e^{-n/3}$, $f'(x) = e^{-x/3}\\left(1 - \\frac{x}{3}\\right)$, which is positive for $x < 3$ and negative for $x > 3$. So $a_1 < a_2 < a_3$ and the sequence decreases from $n = 3$ on.",
        "若 $a_n = f(n)$ 且 $f$ 可导，$f'(x)$ 的符号说明了各项的变化：若在 $[N, \\infty)$ 上 $f' < 0$，则 $a_N > a_{N+1} > a_{N+2} > \\cdots$。对 $a_n = n e^{-n/3}$，$f'(x) = e^{-x/3}\\left(1 - \\frac{x}{3}\\right)$，在 $x < 3$ 时为正，在 $x > 3$ 时为负。所以 $a_1 < a_2 < a_3$，数列从 $n = 3$ 起递减。",
      ),
      generate(rng) {
        if (rng.int(0, 2) > 0) {
          const p = rng.int(1, 3);
          const k = rng.int(1, 9);
          const N = p * k;
          const xp = p === 1 ? "x" : `x^{${p}}`;
          const np = p === 1 ? "n" : `n^{${p}}`;
          const ex = (v: string) => (k === 1 ? `e^{-${v}}` : `e^{-${v}/${k}}`);
          const kx = k === 1 ? "x" : `\\frac{x}{${k}}`;
          const front = p === 1 ? "" : p === 2 ? "x" : "x^{2}";
          return numberProblem({
            prompt: t(
              `Let $a_n = ${np} ${ex("n")}$. Using $f(x) = ${xp} ${ex("x")}$, find the smallest $N$ such that $a_{n+1} < a_n$ for every $n \\ge N$.`,
              `设 $a_n = ${np} ${ex("n")}$。利用 $f(x) = ${xp} ${ex("x")}$，求使得对每个 $n \\ge N$ 都有 $a_{n+1} < a_n$ 的最小 $N$。`,
            ),
            answer: N,
            wrong: [N + 1, N - 1, k, p],
            solution: t(
              `$f'(x) = ${front}${ex("x")}\\left(${p} - ${kx}\\right)$, which is positive for $0 < x < ${N}$ and negative for $x > ${N}$. So the terms increase up to $a_{${N}}$ and decrease after it: $N = ${N}$.`,
              `$f'(x) = ${front}${ex("x")}\\left(${p} - ${kx}\\right)$，在 $0 < x < ${N}$ 时为正，在 $x > ${N}$ 时为负。所以各项增大到 $a_{${N}}$，之后递减：$N = ${N}$。`,
            ),
          });
        }
        const k = rng.int(2, 12);
        return numberProblem({
          prompt: t(
            `Let $a_n = \\frac{n}{n^{2} + ${k * k}}$. Using $f(x) = \\frac{x}{x^{2} + ${k * k}}$, find the smallest $N$ such that $a_{n+1} < a_n$ for every $n \\ge N$.`,
            `设 $a_n = \\frac{n}{n^{2} + ${k * k}}$。利用 $f(x) = \\frac{x}{x^{2} + ${k * k}}$，求使得对每个 $n \\ge N$ 都有 $a_{n+1} < a_n$ 的最小 $N$。`,
          ),
          answer: k,
          wrong: [k * k, k + 1, k - 1],
          solution: t(
            `By the quotient rule, $f'(x) = \\frac{${k * k} - x^{2}}{(x^{2} + ${k * k})^{2}}$, which is positive for $0 < x < ${k}$ and negative for $x > ${k}$. So the terms increase up to $a_{${k}}$ and decrease after it: $N = ${k}$.`,
            `由商的求导法则，$f'(x) = \\frac{${k * k} - x^{2}}{(x^{2} + ${k * k})^{2}}$，在 $0 < x < ${k}$ 时为正，在 $x > ${k}$ 时为负。所以各项增大到 $a_{${k}}$，之后递减：$N = ${k}$。`,
          ),
        });
      },
    },
  ],
};

/** identifyingMonotonicSequencesUsingRatios compares aₙ₊₁/aₙ with 1 for positive sequences. */
export const identifyingMonotonicSequencesUsingRatios: TopicDef = {
  id: "identifying-monotonic-sequences-using-ratios",
  title: t("Identifying Monotonic Sequences Using Ratios", "用比值判断数列的单调性"),
  summary: t(
    "For a sequence of positive terms, aₙ₊₁/aₙ < 1 means the next term is smaller; ratios suit factorials and powers.",
    "对正项数列，aₙ₊₁/aₙ < 1 表示下一项更小；比值法适合阶乘和幂。",
  ),
  prerequisites: ["monotonic-sequences", "limits-of-sequences-with-factorials"],
  encompasses: [{ topic: "monotonic-sequences", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-ratio-of-consecutive-terms",
      title: t("The ratio of consecutive terms", "相邻两项之比"),
      explanation: t(
        "When the terms are products, their ratio simplifies well. For $a_n = \\frac{3^{n}}{n!}$:\n\n$$\\frac{a_{n+1}}{a_n} = \\frac{3^{n+1}}{(n + 1)!} \\cdot \\frac{n!}{3^{n}} = \\frac{3}{n + 1}.$$",
        "各项是乘积时，比值很容易化简。对 $a_n = \\frac{3^{n}}{n!}$：\n\n$$\\frac{a_{n+1}}{a_n} = \\frac{3^{n+1}}{(n + 1)!} \\cdot \\frac{n!}{3^{n}} = \\frac{3}{n + 1}。$$",
      ),
      generate(rng) {
        const k = rng.int(2, 9);
        const forms: readonly (readonly [string, string, readonly string[], string])[] = [
          [
            `\\frac{${k}^{n}}{n!}`,
            `\\frac{${k}}{n + 1}`,
            [`\\frac{${k}}{n}`, `\\frac{n + 1}{${k}}`],
            `\\frac{${k}^{n+1}}{(n + 1)!} \\cdot \\frac{n!}{${k}^{n}}`,
          ],
          [
            `\\frac{n!}{${k}^{n}}`,
            `\\frac{n + 1}{${k}}`,
            [`\\frac{${k}}{n + 1}`, `\\frac{n}{${k}}`],
            `\\frac{(n + 1)!}{${k}^{n+1}} \\cdot \\frac{${k}^{n}}{n!}`,
          ],
          [
            `\\frac{${k}^{n}}{(2n)!}`,
            `\\frac{${k}}{(2n + 1)(2n + 2)}`,
            [`\\frac{${k}}{2n + 1}`, `\\frac{${k}}{2n + 2}`],
            `\\frac{${k}^{n+1}}{(2n + 2)!} \\cdot \\frac{(2n)!}{${k}^{n}}`,
          ],
          [
            `n \\cdot ${k}^{n}`,
            `\\frac{${k}(n + 1)}{n}`,
            [`${k}`, `\\frac{n + 1}{n}`],
            `\\frac{(n + 1) \\cdot ${k}^{n+1}}{n \\cdot ${k}^{n}}`,
          ],
        ];
        const [a, answer, wrong, work] = rng.pick(forms);
        return functionProblem({
          prompt: t(`For $a_n = ${a}$, simplify $\\frac{a_{n+1}}{a_n}$.`, `对 $a_n = ${a}$，化简 $\\frac{a_{n+1}}{a_n}$。`),
          answer,
          variable: "n",
          prefix: "\\frac{a_{n+1}}{a_n} =",
          wrong,
          solution: t(`$\\frac{a_{n+1}}{a_n} = ${work} = ${answer}$.`, `$\\frac{a_{n+1}}{a_n} = ${work} = ${answer}$。`),
        });
      },
    },
    {
      id: "monotonicity-from-the-ratio",
      title: t("Where the ratio drops below 1", "比值何时小于 1"),
      explanation: t(
        "For positive terms, $a_{n+1} < a_n$ exactly when $\\frac{a_{n+1}}{a_n} < 1$. For $a_n = \\frac{3^{n}}{n!}$ the ratio is $\\frac{3}{n + 1}$, which equals $1$ at $n = 2$ ($a_3 = a_2$) and is less than $1$ for $n \\ge 3$. So $a_{n+1} < a_n$ for every $n \\ge 3$.",
        "对正项数列，$a_{n+1} < a_n$ 当且仅当 $\\frac{a_{n+1}}{a_n} < 1$。对 $a_n = \\frac{3^{n}}{n!}$，比值为 $\\frac{3}{n + 1}$，在 $n = 2$ 时等于 $1$（$a_3 = a_2$），在 $n \\ge 3$ 时小于 $1$。所以对每个 $n \\ge 3$ 都有 $a_{n+1} < a_n$。",
      ),
      generate(rng) {
        if (rng.bool()) {
          const m = rng.int(0, 2);
          const k = rng.int(m + 2, 12);
          const N = k - m;
          return numberProblem({
            prompt: t(
              `Let $a_n = \\frac{${k}^{n}}{${fact(m)}}$. Find the smallest $N$ such that $a_{n+1} < a_n$ for every $n \\ge N$.`,
              `设 $a_n = \\frac{${k}^{n}}{${fact(m)}}$。求使得对每个 $n \\ge N$ 都有 $a_{n+1} < a_n$ 的最小 $N$。`,
            ),
            answer: N,
            wrong: [N - 1, N + 1, k],
            solution: t(
              `$\\frac{a_{n+1}}{a_n} = \\frac{${k}}{${shift(m + 1)}}$, which is less than $1$ exactly when $${shift(m + 1)} > ${k}$, that is $n > ${N - 1}$. (At $n = ${N - 1}$ the ratio is $1$.) So $N = ${N}$.`,
              `$\\frac{a_{n+1}}{a_n} = \\frac{${k}}{${shift(m + 1)}}$，小于 $1$ 当且仅当 $${shift(m + 1)} > ${k}$，即 $n > ${N - 1}$。（$n = ${N - 1}$ 时比值为 $1$。）所以 $N = ${N}$。`,
            ),
          });
        }
        const k = rng.int(2, 12);
        return numberProblem({
          prompt: t(
            `Let $a_n = \\frac{n!}{${k}^{n}}$. Find the smallest $N$ such that $a_{n+1} > a_n$ for every $n \\ge N$.`,
            `设 $a_n = \\frac{n!}{${k}^{n}}$。求使得对每个 $n \\ge N$ 都有 $a_{n+1} > a_n$ 的最小 $N$。`,
          ),
          answer: k,
          wrong: [k - 1, k + 1],
          solution: t(
            `$\\frac{a_{n+1}}{a_n} = \\frac{n + 1}{${k}}$, which is greater than $1$ exactly when $n + 1 > ${k}$, that is $n \\ge ${k}$. (At $n = ${k - 1}$ the ratio is $1$.) So $N = ${k}$.`,
            `$\\frac{a_{n+1}}{a_n} = \\frac{n + 1}{${k}}$，大于 $1$ 当且仅当 $n + 1 > ${k}$，即 $n \\ge ${k}$。（$n = ${k - 1}$ 时比值为 $1$。）所以 $N = ${k}$。`,
          ),
        });
      },
    },
  ],
};

/** sigmaInf writes the sum of aₙ from n = k to ∞. */
const sigmaInf = (body: string, k = 1) => `\\sum_{n=${k}}^{\\infty} ${body}`;

/** infiniteSeriesAndPartialSums computes partial sums and recovers terms from them. */
export const infiniteSeriesAndPartialSums: TopicDef = {
  id: "infinite-series-and-partial-sums",
  title: t("Infinite Series and Partial Sums", "无穷级数与部分和"),
  summary: t(
    "The nth partial sum Sₙ = a₁ + ⋯ + aₙ of a series; each term is the difference aₙ = Sₙ − Sₙ₋₁.",
    "级数的第 n 个部分和 Sₙ = a₁ + ⋯ + aₙ；每一项都是差 aₙ = Sₙ − Sₙ₋₁。",
  ),
  prerequisites: ["sigma-notation", "limits-of-sequences"],
  encompasses: [{ topic: "sigma-notation", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "computing-partial-sums",
      title: t("Computing partial sums", "计算部分和"),
      explanation: t(
        "An **infinite series** $\\sum_{n=1}^{\\infty} a_n = a_1 + a_2 + a_3 + \\cdots$ adds the terms of a sequence. Its $N$th **partial sum** adds the first $N$ terms: $S_N = \\sum_{n=1}^{N} a_n$. For $a_n = n^{2} - 1$: $S_3 = 0 + 3 + 8 = 11$.",
        "**无穷级数** $\\sum_{n=1}^{\\infty} a_n = a_1 + a_2 + a_3 + \\cdots$ 把数列的各项相加。它的第 $N$ 个**部分和**是前 $N$ 项之和：$S_N = \\sum_{n=1}^{N} a_n$。对 $a_n = n^{2} - 1$：$S_3 = 0 + 3 + 8 = 11$。",
      ),
      generate(rng) {
        const p = rng.nonZero(-4, 4);
        const q = rng.int(-9, 9);
        const N = rng.int(3, 6);
        const alt = rng.bool();
        const body = poly([p, "n^{2}"], [q, ""]);
        const a = alt ? `(-1)^{n}(${body})` : body;
        const terms = Array.from({ length: N }, (_, i) => (alt ? (-1) ** (i + 1) : 1) * (p * (i + 1) ** 2 + q));
        const S = terms.reduce((x, y) => x + y, 0);
        return numberProblem({
          prompt: t(`Find the partial sum $S_{${N}}$ of the series $${sigmaInf(a)}$.`, `求级数 $${sigmaInf(a)}$ 的部分和 $S_{${N}}$。`),
          answer: S,
          wrong: [S - (terms[N - 1] ?? 0), S + (alt ? (-1) ** (N + 1) : 1) * (p * (N + 1) ** 2 + q), terms[N - 1] ?? 0],
          solution: t(
            `$S_{${N}} = ${plus(...terms.map((x) => (x < 0 ? `(${x})` : `${x}`)))} = ${S}$.`,
            `$S_{${N}} = ${plus(...terms.map((x) => (x < 0 ? `(${x})` : `${x}`)))} = ${S}$。`,
          ),
        });
      },
    },
    {
      id: "terms-from-partial-sums",
      title: t("Recovering terms from partial sums", "由部分和求项"),
      explanation: t(
        "Since $S_n = S_{n-1} + a_n$, each term is the difference of consecutive partial sums: $a_n = S_n - S_{n-1}$ for $n \\ge 2$, and $a_1 = S_1$. If $S_n = \\frac{2n}{n + 1}$, then $a_3 = S_3 - S_2 = \\frac{3}{2} - \\frac{4}{3} = \\frac{1}{6}$.",
        "由于 $S_n = S_{n-1} + a_n$，每一项都是相邻部分和之差：$n \\ge 2$ 时 $a_n = S_n - S_{n-1}$，且 $a_1 = S_1$。若 $S_n = \\frac{2n}{n + 1}$，则 $a_3 = S_3 - S_2 = \\frac{3}{2} - \\frac{4}{3} = \\frac{1}{6}$。",
      ),
      generate(rng) {
        const c = rng.nonZero(-9, 9);
        const s = rng.int(1, 5);
        const m = rng.int(2, 6);
        const S = (n: number) => Q.of(c * n, n + s);
        const answer = S(m).sub(S(m - 1));
        return numberProblem({
          prompt: t(
            `The $n$th partial sum of the series $${sigmaInf("a_n")}$ is $S_n = \\frac{${term(c, "n")}}{${shift(s)}}$. Find $a_{${m}}$.`,
            `级数 $${sigmaInf("a_n")}$ 的第 $n$ 个部分和为 $S_n = \\frac{${term(c, "n")}}{${shift(s)}}$。求 $a_{${m}}$。`,
          ),
          answer,
          wrong: [S(m), S(m - 1), S(m + 1).sub(S(m))],
          solution: t(
            `$a_{${m}} = S_{${m}} - S_{${m - 1}} = ${S(m).toLatex()} - ${S(m - 1).sign() < 0 ? `\\left(${S(m - 1).toLatex()}\\right)` : S(m - 1).toLatex()} = ${answer.toLatex()}$.`,
            `$a_{${m}} = S_{${m}} - S_{${m - 1}} = ${S(m).toLatex()} - ${S(m - 1).sign() < 0 ? `\\left(${S(m - 1).toLatex()}\\right)` : S(m - 1).toLatex()} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** convergentAndDivergentInfiniteSeries defines the sum of a series as the limit of its partial sums. */
export const convergentAndDivergentInfiniteSeries: TopicDef = {
  id: "convergent-and-divergent-infinite-series",
  title: t("Convergent and Divergent Infinite Series", "收敛与发散的无穷级数"),
  summary: t(
    "A series converges to S when its partial sums Sₙ tend to S; otherwise it diverges.",
    "若部分和 Sₙ 趋于 S，级数收敛于 S；否则级数发散。",
  ),
  prerequisites: ["infinite-series-and-partial-sums"],
  encompasses: [{ topic: "infinite-series-and-partial-sums", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "sums-from-partial-sums",
      title: t("The sum as the limit of the partial sums", "和是部分和的极限"),
      explanation: t(
        "A series **converges** to $S$, and we write $\\sum_{n=1}^{\\infty} a_n = S$, when $\\lim_{n \\to \\infty} S_n = S$. If $S_n = 4 - \\frac{3}{2^{n}}$, the series converges and its sum is $\\lim_{n \\to \\infty} S_n = 4$.",
        "若 $\\lim_{n \\to \\infty} S_n = S$，就说级数**收敛**于 $S$，记作 $\\sum_{n=1}^{\\infty} a_n = S$。若 $S_n = 4 - \\frac{3}{2^{n}}$，级数收敛，其和为 $\\lim_{n \\to \\infty} S_n = 4$。",
      ),
      generate(rng) {
        if (rng.bool()) {
          const p = rng.nonZero(-9, 9);
          const q = rng.int(-9, 9);
          const r = rng.int(1, 6);
          const s = rng.int(1, 9);
          const answer = Q.of(p, r);
          return numberProblem({
            prompt: t(
              `The $n$th partial sum of the series $${sigmaInf("a_n")}$ is $S_n = \\frac{${linear(p, q, "n")}}{${linear(r, s, "n")}}$. Find the sum of the series.`,
              `级数 $${sigmaInf("a_n")}$ 的第 $n$ 个部分和为 $S_n = \\frac{${linear(p, q, "n")}}{${linear(r, s, "n")}}$。求级数的和。`,
            ),
            answer,
            wrong: [Q.of(p + q, r + s), Q.of(q, s), Q.zero],
            solution: t(
              `The sum is $\\lim_{n \\to \\infty} S_n = \\frac{${p}}{${r}} = ${answer.toLatex()}$, the ratio of the leading coefficients.`,
              `级数的和为 $\\lim_{n \\to \\infty} S_n = \\frac{${p}}{${r}} = ${answer.toLatex()}$，即首项系数之比。`,
            ),
          });
        }
        const c = rng.nonZero(-9, 9);
        const d = rng.int(1, 9);
        const k = rng.int(2, 5);
        return numberProblem({
          prompt: t(
            `The $n$th partial sum of the series $${sigmaInf("a_n")}$ is $S_n = ${c} - \\frac{${d}}{${k}^{n}}$. Find the sum of the series.`,
            `级数 $${sigmaInf("a_n")}$ 的第 $n$ 个部分和为 $S_n = ${c} - \\frac{${d}}{${k}^{n}}$。求级数的和。`,
          ),
          answer: c,
          wrong: [c - d, Q.of(c * k - d, k), 0],
          solution: t(
            `$\\frac{${d}}{${k}^{n}} \\to 0$, so the sum is $\\lim_{n \\to \\infty} S_n = ${c}$.`,
            `$\\frac{${d}}{${k}^{n}} \\to 0$，所以级数的和为 $\\lim_{n \\to \\infty} S_n = ${c}$。`,
          ),
        });
      },
    },
    {
      id: "divergent-partial-sums",
      title: t("Series whose partial sums diverge", "部分和发散的级数"),
      explanation: t(
        "If $S_n \\to \\infty$ or $S_n \\to -\\infty$, the series diverges to $\\infty$ or $-\\infty$. If $S_n$ has no limit at all, as when $S_n = (-1)^{n}$, the series diverges and has no sum. For example, $1 - 1 + 1 - 1 + \\cdots$ has partial sums $1, 0, 1, 0, \\ldots$, which never settle.",
        "若 $S_n \\to \\infty$ 或 $S_n \\to -\\infty$，级数发散到 $\\infty$ 或 $-\\infty$。若 $S_n$ 根本没有极限（例如 $S_n = (-1)^{n}$），级数发散且没有和。例如 $1 - 1 + 1 - 1 + \\cdots$ 的部分和为 $1, 0, 1, 0, \\ldots$，始终不趋于定值。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const c = rng.nonZero(-9, 9);
        const s = rng.int(1, 9);
        const S =
          kind === 0 ? `\\frac{${term(c, "n^{2}")}}{${shift(s)}}` : kind === 1 ? `${c}(-1)^{n}` : `\\frac{${term(c, "n")}}{n^{2} + ${s}}`;
        const right: LimitValue = kind === 0 ? (c > 0 ? "inf" : "-inf") : kind === 1 ? "dne" : Q.zero;
        const why =
          kind === 0
            ? t("the numerator has the higher degree", "分子次数更高")
            : kind === 1
              ? t(`the partial sums alternate between $${-c}$ and $${c}$`, `部分和在 $${-c}$ 与 $${c}$ 之间交替`)
              : t("the denominator has the higher degree", "分母次数更高");
        return limitChoice(
          rng,
          t(
            `The $n$th partial sum of the series $${sigmaInf("a_n")}$ is $S_n = ${S}$. Find $\\lim_{n \\to \\infty} S_n$, which is the sum of the series when it exists.`,
            `级数 $${sigmaInf("a_n")}$ 的第 $n$ 个部分和为 $S_n = ${S}$。求 $\\lim_{n \\to \\infty} S_n$（若存在，它就是级数的和）。`,
          ),
          right,
          [Q.of(c), Q.zero, Q.of(c, s)],
          t(`Here ${why.en}, so ${limitWord(right).en}.`, `这里${why["zh-CN"]}，所以${limitWord(right)["zh-CN"]}。`),
          undefined,
          true,
        );
      },
    },
  ],
};

/** parenQ writes a value in parentheses when it is negative. */
const parenQ = (q: Q) => (q.sign() < 0 ? `\\left(${q.toLatex()}\\right)` : q.toLatex());

/** propertiesOfInfiniteSeries applies linearity to convergent series. */
export const propertiesOfInfiniteSeries: TopicDef = {
  id: "properties-of-infinite-series",
  title: t("Properties of Infinite Series", "无穷级数的性质"),
  summary: t(
    "Convergent series can be added and multiplied by constants term by term: Σ(c·aₙ + d·bₙ) = cΣaₙ + dΣbₙ.",
    "收敛级数可以逐项相加和乘以常数：Σ(c·aₙ + d·bₙ) = cΣaₙ + dΣbₙ。",
  ),
  prerequisites: ["convergent-and-divergent-infinite-series", "properties-of-finite-series"],
  encompasses: [{ topic: "convergent-and-divergent-infinite-series", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "linear-combinations-of-convergent-series",
      title: t("Linear combinations of convergent series", "收敛级数的线性组合"),
      explanation: t(
        "If $\\sum a_n = A$ and $\\sum b_n = B$ both converge, then for any constants $c$ and $d$,\n\n$$\\sum_{n=1}^{\\infty} (c \\, a_n + d \\, b_n) = cA + dB,$$\n\nbecause the partial sums satisfy the same rule and limits respect it. For $A = 3$ and $B = -2$: $\\sum (2a_n - 5b_n) = 6 + 10 = 16$.",
        "若 $\\sum a_n = A$ 与 $\\sum b_n = B$ 都收敛，则对任意常数 $c$、$d$，\n\n$$\\sum_{n=1}^{\\infty} (c \\, a_n + d \\, b_n) = cA + dB，$$\n\n因为部分和满足同样的法则，而极限保持这一法则。若 $A = 3$，$B = -2$：$\\sum (2a_n - 5b_n) = 6 + 10 = 16$。",
      ),
      generate(rng) {
        const A = Q.of(rng.nonZero(-12, 12), rng.pick([1, 1, 2, 3]));
        const B = Q.of(rng.nonZero(-12, 12), rng.pick([1, 1, 2, 3]));
        const c = rng.nonZero(-6, 6);
        const d = rng.nonZero(-6, 6);
        const answer = A.mul(Q.of(c)).add(B.mul(Q.of(d)));
        const body = plus(term(c, "a_n"), term(d, "b_n"));
        return numberProblem({
          prompt: t(
            `Given that $${sigmaInf("a_n")} = ${A.toLatex()}$ and $${sigmaInf("b_n")} = ${B.toLatex()}$, find $${sigmaInf(`(${body})`)}$.`,
            `已知 $${sigmaInf("a_n")} = ${A.toLatex()}$，$${sigmaInf("b_n")} = ${B.toLatex()}$，求 $${sigmaInf(`(${body})`)}$。`,
          ),
          answer,
          wrong: [A.add(B), A.mul(Q.of(c)).sub(B.mul(Q.of(d))), A.mul(Q.of(c)).add(B), Q.of(c + d)],
          solution: t(
            `$${sigmaInf(`(${body})`)} = ${c} \\cdot ${parenQ(A)} + (${d}) \\cdot ${parenQ(B)} = ${answer.toLatex()}$.`,
            `$${sigmaInf(`(${body})`)} = ${c} \\cdot ${parenQ(A)} + (${d}) \\cdot ${parenQ(B)} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** convergence names what can be said about a series. */
const convergence = [t("It converges.", "收敛。"), t("It diverges.", "发散。"), t("It cannot be determined.", "无法确定。")] as const;

/** furtherPropertiesOfInfiniteSeries drops initial terms and combines convergent with divergent series. */
export const furtherPropertiesOfInfiniteSeries: TopicDef = {
  id: "further-properties-of-infinite-series",
  title: t("Further Properties of Infinite Series", "无穷级数的性质进阶"),
  summary: t(
    "Dropping finitely many terms changes the sum but not convergence; a convergent series plus a divergent one diverges.",
    "去掉有限项会改变级数的和，但不改变敛散性；收敛级数加发散级数仍发散。",
  ),
  prerequisites: ["properties-of-infinite-series"],
  encompasses: [{ topic: "properties-of-infinite-series", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "removing-initial-terms",
      title: t("Removing initial terms", "去掉开头的项"),
      explanation: t(
        "Starting a series later subtracts the terms left out:\n\n$$\\sum_{n=k}^{\\infty} a_n = \\sum_{n=1}^{\\infty} a_n - (a_1 + \\cdots + a_{k-1}).$$\n\nIf $\\sum_{n=1}^{\\infty} \\frac{1}{n(n + 1)} = 1$, then $\\sum_{n=3}^{\\infty} \\frac{1}{n(n + 1)} = 1 - \\frac{1}{2} - \\frac{1}{6} = \\frac{1}{3}$.",
        "从后面的项开始求和，就减去被省略的项：\n\n$$\\sum_{n=k}^{\\infty} a_n = \\sum_{n=1}^{\\infty} a_n - (a_1 + \\cdots + a_{k-1})。$$\n\n若 $\\sum_{n=1}^{\\infty} \\frac{1}{n(n + 1)} = 1$，则 $\\sum_{n=3}^{\\infty} \\frac{1}{n(n + 1)} = 1 - \\frac{1}{2} - \\frac{1}{6} = \\frac{1}{3}$。",
      ),
      generate(rng) {
        const p = rng.int(1, 12);
        const k = rng.int(2, 4);
        const a = (n: number) => Q.of(p, n * (n + 1) * (n + 2));
        const body = `\\frac{${p}}{n(n + 1)(n + 2)}`;
        const dropped = Array.from({ length: k - 1 }, (_, i) => a(i + 1));
        const total = Q.of(p, 4);
        const answer = dropped.reduce((s, x) => s.sub(x), total);
        return numberProblem({
          prompt: t(
            `Given that $${sigmaInf(body)} = ${total.toLatex()}$, find $${sigmaInf(body, k)}$.`,
            `已知 $${sigmaInf(body)} = ${total.toLatex()}$，求 $${sigmaInf(body, k)}$。`,
          ),
          answer,
          wrong: [total, total.sub(a(k)), answer.sub(a(k))],
          solution: t(
            `Subtract the terms for $n = 1$ to $${k - 1}$: $${total.toLatex()} - ${dropped.map((x) => x.toLatex()).join(" - ")} = ${answer.toLatex()}$.`,
            `减去 $n = 1$ 到 $${k - 1}$ 的项：$${total.toLatex()} - ${dropped.map((x) => x.toLatex()).join(" - ")} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "convergent-plus-divergent",
      title: t("Combining convergent and divergent series", "收敛与发散级数的组合"),
      explanation: t(
        "If $\\sum a_n$ converges and $\\sum b_n$ diverges, then $\\sum (a_n + b_n)$ diverges: otherwise $\\sum b_n = \\sum (a_n + b_n) - \\sum a_n$ would converge. A nonzero multiple of a divergent series diverges too. But the sum of two divergent series can go either way: $\\sum 1$ and $\\sum (-1)$ diverge while $\\sum (1 + (-1)) = 0$ converges.",
        "若 $\\sum a_n$ 收敛而 $\\sum b_n$ 发散，则 $\\sum (a_n + b_n)$ 发散：否则 $\\sum b_n = \\sum (a_n + b_n) - \\sum a_n$ 就会收敛。发散级数的非零倍数也发散。但两个发散级数之和可能收敛也可能发散：$\\sum 1$ 与 $\\sum (-1)$ 都发散，而 $\\sum (1 + (-1)) = 0$ 收敛。",
      ),
      generate(rng) {
        const A = rng.nonZero(-12, 12);
        const c = rng.nonZero(-6, 6);
        const d = rng.nonZero(-6, 6);
        const kind = rng.int(0, 3);
        const fact2 = [
          t(
            `$${sigmaInf("a_n")} = ${A}$ converges and $${sigmaInf("b_n")}$ diverges`,
            `$${sigmaInf("a_n")} = ${A}$ 收敛，$${sigmaInf("b_n")}$ 发散`,
          ),
          t(
            `$${sigmaInf("a_n")} = ${A}$ converges and $${sigmaInf("b_n")}$ diverges`,
            `$${sigmaInf("a_n")} = ${A}$ 收敛，$${sigmaInf("b_n")}$ 发散`,
          ),
          t(`$${sigmaInf("a_n")}$ and $${sigmaInf("b_n")}$ both diverge`, `$${sigmaInf("a_n")}$ 与 $${sigmaInf("b_n")}$ 都发散`),
          t(
            `$${sigmaInf("a_n")} = ${A}$ and $${sigmaInf("b_n")} = ${c}$ both converge`,
            `$${sigmaInf("a_n")} = ${A}$ 与 $${sigmaInf("b_n")} = ${c}$ 都收敛`,
          ),
        ][kind]!;
        const body = kind === 1 ? term(d, "b_n") : plus(term(c, "a_n"), term(d, "b_n"));
        const right = kind === 2 ? 2 : kind === 3 ? 0 : 1;
        const why = [
          t(
            `If $${sigmaInf(`(${body})`)}$ converged, then $${sigmaInf("b_n")} = \\frac{1}{${d}}\\left(${poly([1, sigmaInf(`(${body})`)], [-c, sigmaInf("a_n")])}\\right)$ would converge too.`,
            `若 $${sigmaInf(`(${body})`)}$ 收敛，则 $${sigmaInf("b_n")} = \\frac{1}{${d}}\\left(${poly([1, sigmaInf(`(${body})`)], [-c, sigmaInf("a_n")])}\\right)$ 也收敛，矛盾。`,
          ),
          t(
            `A nonzero multiple of a divergent series diverges: if $${sigmaInf(body)}$ converged, so would $\\frac{1}{${d}}$ times it.`,
            `发散级数的非零倍数发散：若 $${sigmaInf(body)}$ 收敛，则它的 $\\frac{1}{${d}}$ 倍也收敛。`,
          ),
          t(
            "A combination of two divergent series may converge or diverge, so the information given is not enough.",
            "两个发散级数的组合可能收敛也可能发散，所以已知条件不足以判断。",
          ),
          t(
            `It converges to $${c} \\cdot ${A < 0 ? `(${A})` : A} + ${d < 0 ? `(${d})` : d} \\cdot ${c < 0 ? `(${c})` : c} = ${c * A + d * c}$.`,
            `它收敛于 $${c} \\cdot ${A < 0 ? `(${A})` : A} + ${d < 0 ? `(${d})` : d} \\cdot ${c < 0 ? `(${c})` : c} = ${c * A + d * c}$。`,
          ),
        ][kind]!;
        return oneOf(
          rng,
          t(
            `Suppose ${fact2.en}. What can be said about $${sigmaInf(`(${body})`)}$?`,
            `设${fact2["zh-CN"]}。关于 $${sigmaInf(`(${body})`)}$ 能得出什么结论？`,
          ),
          convergence[right]!,
          convergence.filter((_, i) => i !== right),
          why,
        );
      },
    },
  ],
};

/** telescopingSeries sums series whose partial sums collapse. */
export const telescopingSeries: TopicDef = {
  id: "telescoping-series",
  title: t("Telescoping Series", "裂项级数"),
  summary: t(
    "Split each term into a difference by partial fractions; the partial sums collapse to a few terms.",
    "用部分分式把每一项拆成差，部分和就相消到只剩少数几项。",
  ),
  prerequisites: ["convergent-and-divergent-infinite-series", "expressing-rational-functions-as-sums-of-partial-fractions"],
  encompasses: [{ topic: "convergent-and-divergent-infinite-series", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "partial-sums-of-telescoping-series",
      title: t("Partial sums of telescoping series", "裂项级数的部分和"),
      explanation: t(
        "When each term is a difference $b_n - b_{n+1}$, the middle terms cancel in pairs:\n\n$$S_N = (b_1 - b_2) + (b_2 - b_3) + \\cdots + (b_N - b_{N+1}) = b_1 - b_{N+1}.$$\n\nFor $\\frac{1}{n(n + 1)} = \\frac{1}{n} - \\frac{1}{n + 1}$: $S_N = 1 - \\frac{1}{N + 1}$, so $S_4 = \\frac{4}{5}$.",
        "当每一项都是差 $b_n - b_{n+1}$ 时，中间的项两两相消：\n\n$$S_N = (b_1 - b_2) + (b_2 - b_3) + \\cdots + (b_N - b_{N+1}) = b_1 - b_{N+1}。$$\n\n对 $\\frac{1}{n(n + 1)} = \\frac{1}{n} - \\frac{1}{n + 1}$：$S_N = 1 - \\frac{1}{N + 1}$，所以 $S_4 = \\frac{4}{5}$。",
      ),
      generate(rng) {
        const c = rng.int(1, 9);
        const a = rng.int(0, 4);
        const N = rng.int(3, 12);
        const answer = Q.of(c, a + 1).sub(Q.of(c, N + a + 1));
        const den = a === 0 ? "n(n + 1)" : `(${shift(a)})(${shift(a + 1)})`;
        return numberProblem({
          prompt: t(
            `Find the partial sum $S_{${N}}$ of the series $${sigmaInf(`\\frac{${c}}{${den}}`)}$.`,
            `求级数 $${sigmaInf(`\\frac{${c}}{${den}}`)}$ 的部分和 $S_{${N}}$。`,
          ),
          answer,
          wrong: [Q.of(c, a + 1), Q.of(c, a + 1).sub(Q.of(c, N + a)), Q.of(c, N + a + 1)],
          solution: t(
            `$\\frac{${c}}{${den}} = \\frac{${c}}{${shift(a)}} - \\frac{${c}}{${shift(a + 1)}}$, so the sum telescopes: $S_{${N}} = \\frac{${c}}{${a + 1}} - \\frac{${c}}{${N + a + 1}} = ${answer.toLatex()}$.`,
            `$\\frac{${c}}{${den}} = \\frac{${c}}{${shift(a)}} - \\frac{${c}}{${shift(a + 1)}}$，所以各项相消：$S_{${N}} = \\frac{${c}}{${a + 1}} - \\frac{${c}}{${N + a + 1}} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "sums-of-telescoping-series",
      title: t("Sums of telescoping series", "裂项级数的和"),
      explanation: t(
        "When the two pieces are $k$ places apart, $k$ terms survive at the start:\n\n$$\\frac{2}{n(n + 2)} = \\frac{1}{n} - \\frac{1}{n + 2}, \\qquad S_N = 1 + \\frac{1}{2} - \\frac{1}{N + 1} - \\frac{1}{N + 2} \\to \\frac{3}{2}.$$\n\nThe terms at the end tend to $0$, so the sum is the sum of the surviving terms at the start.",
        "当两部分相隔 $k$ 个位置时，开头会留下 $k$ 项：\n\n$$\\frac{2}{n(n + 2)} = \\frac{1}{n} - \\frac{1}{n + 2}，\\qquad S_N = 1 + \\frac{1}{2} - \\frac{1}{N + 1} - \\frac{1}{N + 2} \\to \\frac{3}{2}。$$\n\n末尾的项趋于 $0$，所以级数的和就是开头留下的各项之和。",
      ),
      generate(rng) {
        const a = rng.int(0, 4);
        const k = rng.int(1, 3);
        const c = rng.int(1, 9);
        const head = Array.from({ length: k }, (_, j) => Q.of(1, a + j + 1));
        const H = head.reduce((s, x) => s.add(x), Q.zero);
        const answer = H.mul(Q.of(c, k));
        const den = `${a === 0 ? "n" : `(${shift(a)})`}(${shift(a + k)})`;
        const coef = Q.of(c, k);
        return numberProblem({
          prompt: t(`Find $${sigmaInf(`\\frac{${c}}{${den}}`)}$.`, `求 $${sigmaInf(`\\frac{${c}}{${den}}`)}$。`),
          answer,
          wrong: [Q.of(c, a + 1), H.mul(Q.of(c)), Q.of(c, k * (a + 1))],
          solution: t(
            `By partial fractions, $\\frac{${c}}{${den}} = ${coef.toLatex()}\\left(\\frac{1}{${shift(a)}} - \\frac{1}{${shift(a + k)}}\\right)$. The first $${k}$ positive terms survive and the rest cancel or tend to $0$, so the sum is $${coef.toLatex()}\\left(${head.map((x) => x.toLatex()).join(" + ")}\\right) = ${answer.toLatex()}$.`,
            `由部分分式，$\\frac{${c}}{${den}} = ${coef.toLatex()}\\left(\\frac{1}{${shift(a)}} - \\frac{1}{${shift(a + k)}}\\right)$。前 $${k}$ 个正项留下，其余相消或趋于 $0$，所以和为 $${coef.toLatex()}\\left(${head.map((x) => x.toLatex()).join(" + ")}\\right) = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** GeometricSeries is a series a + ar + ar² + ⋯ with |r| < 1. */
interface GeometricSeries {
  readonly a: Q;
  readonly r: Q;
}

/** geometricSeries picks a convergent geometric series whose first terms are easy to read. */
function geometricSeries(rng: Rng): GeometricSeries {
  for (;;) {
    const q = rng.int(2, 5);
    const p = rng.nonZero(1 - q, q - 1);
    if (gcd(Math.abs(p), q) !== 1) continue;
    return { a: Q.of(rng.nonZero(-3, 3) * q * q), r: Q.of(p, q) };
  }
}

/** written writes the first four terms of a geometric series followed by ⋯. */
function written(g: GeometricSeries): string {
  const terms = [0, 1, 2, 3].map((i) => {
    let x = g.a;
    for (let j = 0; j < i; j++) x = x.mul(g.r);
    return x.toLatex();
  });
  return `${plus(...terms)} + \\cdots`;
}

/** geometricSum states S = a/(1 − r). */
const geometricSum = "S = \\frac{a}{1 - r}";

/** findingTheSumOfAnInfiniteGeometricSeries applies S = a/(1 − r). */
export const findingTheSumOfAnInfiniteGeometricSeries: TopicDef = {
  id: "finding-the-sum-of-an-infinite-geometric-series",
  title: t("Finding the Sum of an Infinite Geometric Series", "求无穷等比级数的和"),
  summary: t(
    "When |r| < 1, a + ar + ar² + ⋯ = a/(1 − r), the limit of the finite sums a(1 − rⁿ)/(1 − r).",
    "当 |r| < 1 时，a + ar + ar² + ⋯ = a/(1 − r)，即有限和 a(1 − rⁿ)/(1 − r) 的极限。",
  ),
  prerequisites: ["convergent-and-divergent-infinite-series", "the-sum-of-a-finite-geometric-series", "convergence-of-geometric-sequences"],
  encompasses: [{ topic: "the-sum-of-a-finite-geometric-series", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "sums-of-written-out-geometric-series",
      title: t("Sums of written-out geometric series", "写出各项的等比级数之和"),
      explanation: t(
        `The partial sums of $a + ar + ar^{2} + \\cdots$ are $S_n = \\frac{a(1 - r^{n})}{1 - r}$. When $|r| < 1$, $r^{n} \\to 0$, so the series converges to\n\n$$${geometricSum}.$$\n\nFor $12 - 6 + 3 - \\frac{3}{2} + \\cdots$: $a = 12$, $r = -\\frac{1}{2}$, and $S = \\frac{12}{3/2} = 8$.`,
        `$a + ar + ar^{2} + \\cdots$ 的部分和为 $S_n = \\frac{a(1 - r^{n})}{1 - r}$。当 $|r| < 1$ 时 $r^{n} \\to 0$，所以级数收敛于\n\n$$${geometricSum}。$$\n\n对 $12 - 6 + 3 - \\frac{3}{2} + \\cdots$：$a = 12$，$r = -\\frac{1}{2}$，$S = \\frac{12}{3/2} = 8$。`,
      ),
      generate(rng) {
        const g = geometricSeries(rng);
        const answer = g.a.div(Q.one.sub(g.r));
        return numberProblem({
          prompt: t(`Find the sum of the series $${written(g)}$.`, `求级数 $${written(g)}$ 的和。`),
          answer,
          wrong: [g.a.div(Q.one.add(g.r)), g.a.mul(g.r).div(Q.one.sub(g.r)), Q.one.div(Q.one.sub(g.r))],
          solution: t(
            `The first term is $a = ${g.a.toLatex()}$ and the common ratio is $r = ${g.r.toLatex()}$, with $|r| < 1$. So $S = \\frac{${g.a.toLatex()}}{1 - ${parenQ(g.r)}} = ${answer.toLatex()}$.`,
            `首项 $a = ${g.a.toLatex()}$，公比 $r = ${g.r.toLatex()}$，且 $|r| < 1$。所以 $S = \\frac{${g.a.toLatex()}}{1 - ${parenQ(g.r)}} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** writingAnInfiniteGeometricSeriesInSigmaNotation reads a and r off a series. */
export const writingAnInfiniteGeometricSeriesInSigmaNotation: TopicDef = {
  id: "writing-an-infinite-geometric-series-in-sigma-notation",
  title: t("Writing an Infinite Geometric Series in Sigma Notation", "用求和符号表示无穷等比级数"),
  summary: t(
    "$a + ar + ar^2 + \\cdots = \\sum_{n=1}^{\\infty} ar^{n-1} = \\sum_{n=0}^{\\infty} ar^n$.",
    "$a + ar + ar^2 + \\cdots = \\sum_{n=1}^{\\infty} ar^{n-1} = \\sum_{n=0}^{\\infty} ar^n$。",
  ),
  prerequisites: ["finding-the-sum-of-an-infinite-geometric-series", "writing-geometric-series-in-sigma-notation"],
  encompasses: [{ topic: "writing-geometric-series-in-sigma-notation", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "first-term-and-ratio",
      title: t("Finding a and r", "求 a 与 r"),
      explanation: t(
        "To write a geometric series as $\\sum_{n=1}^{\\infty} a r^{n-1}$, take $a$ as the first term and $r$ as the ratio of any term to the one before it. For $18 + 12 + 8 + \\frac{16}{3} + \\cdots$: $a = 18$ and $r = \\frac{12}{18} = \\frac{2}{3}$, so the series is $\\sum_{n=1}^{\\infty} 18\\left(\\frac{2}{3}\\right)^{n-1}$.",
        "要把等比级数写成 $\\sum_{n=1}^{\\infty} a r^{n-1}$，取首项为 $a$，取任一项与前一项之比为 $r$。对 $18 + 12 + 8 + \\frac{16}{3} + \\cdots$：$a = 18$，$r = \\frac{12}{18} = \\frac{2}{3}$，所以级数为 $\\sum_{n=1}^{\\infty} 18\\left(\\frac{2}{3}\\right)^{n-1}$。",
      ),
      generate(rng) {
        const g = geometricSeries(rng);
        return pointProblem({
          prompt: t(
            `Write $${written(g)}$ in the form $${sigmaInf("a r^{n-1}")}$. Give your answer as $(a, r)$.`,
            `把 $${written(g)}$ 写成 $${sigmaInf("a r^{n-1}")}$ 的形式，以 $(a, r)$ 作答。`,
          ),
          answer: [g.a, g.r],
          vars: ["a", "r"],
          wrong: [
            [g.a, Q.one.div(g.r)],
            [g.a.mul(g.r), g.r],
            [g.r, g.a],
          ],
          solution: t(
            `The first term is $a = ${g.a.toLatex()}$, and each term is $${g.r.toLatex()}$ times the one before, so $r = ${g.r.toLatex()}$.`,
            `首项 $a = ${g.a.toLatex()}$，每一项都是前一项的 $${g.r.toLatex()}$ 倍，所以 $r = ${g.r.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "the-general-term",
      title: t("The general term starting from n = 0", "从 n = 0 开始的通项"),
      explanation: t(
        "Starting the index at $0$ shifts the exponent: $a + ar + ar^{2} + \\cdots = \\sum_{n=0}^{\\infty} a r^{n}$, since the term with $n = 0$ is $a r^{0} = a$. For $18 + 12 + 8 + \\cdots$ the general term is $18\\left(\\frac{2}{3}\\right)^{n}$.",
        "下标从 $0$ 开始时指数随之平移：$a + ar + ar^{2} + \\cdots = \\sum_{n=0}^{\\infty} a r^{n}$，因为 $n = 0$ 对应的项是 $a r^{0} = a$。对 $18 + 12 + 8 + \\cdots$，通项为 $18\\left(\\frac{2}{3}\\right)^{n}$。",
      ),
      generate(rng) {
        // The checker compares functions at non-integer n, where a negative ratio raised to n is undefined.
        const g0 = geometricSeries(rng);
        const g = { a: g0.a, r: g0.r.abs() };
        const r = g.r.toLatex();
        const a = g.a.toLatex();
        const answer = `${a}(${r})^{n}`;
        return functionProblem({
          prompt: t(
            `Write $${written(g)}$ as $\\sum_{n=0}^{\\infty} a_n$. Find the general term $a_n$.`,
            `把 $${written(g)}$ 写成 $\\sum_{n=0}^{\\infty} a_n$，求通项 $a_n$。`,
          ),
          answer,
          variable: "n",
          prefix: "a_n =",
          wrong: [`${a}(${r})^{n-1}`, `${a}(${r})^{n+1}`, `${r}(${a})^{n}`],
          solution: t(
            `$a = ${a}$ and $r = ${r}$; with the index starting at $0$, the general term is $a r^{n} = ${answer}$.`,
            `$a = ${a}$，$r = ${r}$；下标从 $0$ 开始，通项为 $a r^{n} = ${answer}$。`,
          ),
        });
      },
    },
  ],
};

/** sumsOfInfiniteGeometricSeriesGivenInSigmaNotation finds the first term from the starting index. */
export const sumsOfInfiniteGeometricSeriesGivenInSigmaNotation: TopicDef = {
  id: "sums-of-infinite-geometric-series-given-in-sigma-notation",
  title: t("Sums of Infinite Geometric Series Given in Sigma Notation", "求和符号表示的无穷等比级数之和"),
  summary: t(
    "Read the first term from the starting index, then use S = a/(1 − r); split sums of geometric series.",
    "由起始下标读出首项，再用 S = a/(1 − r)；等比级数之和可以拆开求。",
  ),
  prerequisites: [
    "writing-an-infinite-geometric-series-in-sigma-notation",
    "sums-of-finite-geometric-series-given-in-sigma-notation",
    "properties-of-infinite-series",
  ],
  encompasses: [{ topic: "writing-an-infinite-geometric-series-in-sigma-notation", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-first-term-from-the-starting-index",
      title: t("The first term from the starting index", "由起始下标求首项"),
      explanation: t(
        "In $\\sum_{n=k}^{\\infty} c \\, r^{n}$ the first term is $c \\, r^{k}$, not $c$. With $|r| < 1$:\n\n$$\\sum_{n=k}^{\\infty} c \\, r^{n} = \\frac{c \\, r^{k}}{1 - r}.$$\n\nFor example, $\\sum_{n=2}^{\\infty} 4\\left(\\frac{1}{3}\\right)^{n} = \\frac{4/9}{2/3} = \\frac{2}{3}$.",
        "在 $\\sum_{n=k}^{\\infty} c \\, r^{n}$ 中，首项是 $c \\, r^{k}$ 而不是 $c$。当 $|r| < 1$ 时：\n\n$$\\sum_{n=k}^{\\infty} c \\, r^{n} = \\frac{c \\, r^{k}}{1 - r}。$$\n\n例如 $\\sum_{n=2}^{\\infty} 4\\left(\\frac{1}{3}\\right)^{n} = \\frac{4/9}{2/3} = \\frac{2}{3}$。",
      ),
      generate(rng) {
        const { r } = geometricSeries(rng);
        const c = rng.nonZero(-9, 9);
        const k = rng.int(0, 3);
        let first = Q.of(c);
        for (let j = 0; j < k; j++) first = first.mul(r);
        const answer = first.div(Q.one.sub(r));
        const body = `${coefficientOf(c)}${powN(r)}`;
        return numberProblem({
          prompt: t(`Find $${sigmaInf(body, k)}$.`, `求 $${sigmaInf(body, k)}$。`),
          answer,
          wrong: [Q.of(c).div(Q.one.sub(r)), first.mul(r).div(Q.one.sub(r)), first.div(Q.one.add(r))],
          solution: t(
            `The first term (at $n = ${k}$) is $a = ${c} \\cdot ${parenQ(r)}^{${k}} = ${first.toLatex()}$ and $r = ${r.toLatex()}$. So the sum is $\\frac{${first.toLatex()}}{1 - ${parenQ(r)}} = ${answer.toLatex()}$.`,
            `首项（$n = ${k}$）为 $a = ${c} \\cdot ${parenQ(r)}^{${k}} = ${first.toLatex()}$，$r = ${r.toLatex()}$。所以和为 $\\frac{${first.toLatex()}}{1 - ${parenQ(r)}} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "sums-of-two-geometric-series",
      title: t("Splitting into two geometric series", "拆成两个等比级数"),
      explanation: t(
        "A quotient such as $\\frac{2^{n} + 3^{n}}{6^{n}}$ splits into two geometric terms, $\\left(\\frac{1}{3}\\right)^{n} + \\left(\\frac{1}{2}\\right)^{n}$. Each series converges, so the sum is the sum of the two sums:\n\n$$\\sum_{n=0}^{\\infty} \\frac{2^{n} + 3^{n}}{6^{n}} = \\frac{1}{1 - \\frac{1}{3}} + \\frac{1}{1 - \\frac{1}{2}} = \\frac{3}{2} + 2 = \\frac{7}{2}.$$",
        "像 $\\frac{2^{n} + 3^{n}}{6^{n}}$ 这样的商可以拆成两个等比项 $\\left(\\frac{1}{3}\\right)^{n} + \\left(\\frac{1}{2}\\right)^{n}$。两个级数都收敛，所以总和等于两个和相加：\n\n$$\\sum_{n=0}^{\\infty} \\frac{2^{n} + 3^{n}}{6^{n}} = \\frac{1}{1 - \\frac{1}{3}} + \\frac{1}{1 - \\frac{1}{2}} = \\frac{3}{2} + 2 = \\frac{7}{2}。$$",
      ),
      generate(rng) {
        const e = rng.int(3, 9);
        const b = rng.int(1, e - 1);
        let d = rng.int(1, e - 1);
        if (d === b) d = b === 1 ? 2 : b - 1;
        const minus = rng.bool();
        const piece = (x: number) => Q.of(e, e - x);
        const answer = minus ? piece(b).sub(piece(d)) : piece(b).add(piece(d));
        const pw = (x: number) => (x === 1 ? "1" : `${x}^{n}`);
        const top = minus ? `${pw(b)} - ${pw(d)}` : `${pw(b)} + ${pw(d)}`;
        return numberProblem({
          prompt: t(`Find $${sigmaInf(`\\frac{${top}}{${e}^{n}}`, 0)}$.`, `求 $${sigmaInf(`\\frac{${top}}{${e}^{n}}`, 0)}$。`),
          answer,
          wrong: [minus ? piece(b).add(piece(d)) : piece(b).sub(piece(d)), Q.of(e, e - b).mul(Q.of(e, e - d)), Q.of(b, e - b)],
          solution: t(
            `Split: $\\left(\\frac{${b}}{${e}}\\right)^{n} ${minus ? "-" : "+"} \\left(\\frac{${d}}{${e}}\\right)^{n}$. Both ratios are less than $1$, so the sum is $\\frac{1}{1 - \\frac{${b}}{${e}}} ${minus ? "-" : "+"} \\frac{1}{1 - \\frac{${d}}{${e}}} = ${piece(b).toLatex()} ${minus ? "-" : "+"} ${piece(d).toLatex()} = ${answer.toLatex()}$.`,
            `拆开：$\\left(\\frac{${b}}{${e}}\\right)^{n} ${minus ? "-" : "+"} \\left(\\frac{${d}}{${e}}\\right)^{n}$。两个公比都小于 $1$，所以和为 $\\frac{1}{1 - \\frac{${b}}{${e}}} ${minus ? "-" : "+"} \\frac{1}{1 - \\frac{${d}}{${e}}} = ${piece(b).toLatex()} ${minus ? "-" : "+"} ${piece(d).toLatex()} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** convergenceOfGeometricSeries finds where a geometric series in x converges and what it converges to. */
export const convergenceOfGeometricSeries: TopicDef = {
  id: "convergence-of-geometric-series",
  title: t("Convergence of Geometric Series", "等比级数的收敛性"),
  summary: t(
    "A geometric series converges exactly when |r| < 1; when r depends on x, this gives an interval of x and a sum that is a function of x.",
    "等比级数收敛当且仅当 |r| < 1；当 r 含 x 时，这给出 x 的一个区间，其和是 x 的函数。",
  ),
  prerequisites: ["sums-of-infinite-geometric-series-given-in-sigma-notation"],
  encompasses: [{ topic: "sums-of-infinite-geometric-series-given-in-sigma-notation", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "values-of-x-for-which-a-geometric-series-converges",
      title: t("Values of x for which a geometric series converges", "使等比级数收敛的 x"),
      explanation: t(
        "A geometric series $\\sum r^{n}$ converges when $|r| < 1$ and diverges when $|r| \\ge 1$ (its terms do not tend to $0$). Unlike the sequence $r^{n}$, the series diverges at $r = 1$. For $\\sum_{n=0}^{\\infty} \\left(\\frac{x + 1}{4}\\right)^{n}$: $-4 < x + 1 < 4$, so $-5 < x < 3$.",
        "等比级数 $\\sum r^{n}$ 在 $|r| < 1$ 时收敛，在 $|r| \\ge 1$ 时发散（各项不趋于 $0$）。与数列 $r^{n}$ 不同，级数在 $r = 1$ 时发散。对 $\\sum_{n=0}^{\\infty} \\left(\\frac{x + 1}{4}\\right)^{n}$：$-4 < x + 1 < 4$，所以 $-5 < x < 3$。",
      ),
      generate(rng) {
        const a = rng.int(1, 4);
        const b = rng.int(-9, 9);
        const k = rng.int(1, 9);
        const L = linear(a, b);
        const base = k === 1 ? `\\left(${L}\\right)^{n}` : `\\left(\\frac{${L}}{${k}}\\right)^{n}`;
        const lo = Q.of(-k - b, a);
        const hi = Q.of(k - b, a);
        const iv = (loClosed: boolean, hiClosed: boolean): Interval[] => [{ lo, hi, loClosed, hiClosed }];
        return intervalProblem({
          prompt: t(
            `For which values of $x$ does the series $${sigmaInf(base, 0)}$ converge? Give your answer in interval notation.`,
            `$x$ 取哪些值时级数 $${sigmaInf(base, 0)}$ 收敛？用区间表示。`,
          ),
          set: iv(false, false),
          form: "interval",
          wrong: [iv(false, true), iv(true, true), [{ lo: Q.of(-1 - b, a), hi: Q.of(1 - b, a), loClosed: false, hiClosed: false }]],
          solution: t(
            `The series converges exactly when the ratio has absolute value less than $1$: $${-k} < ${L} < ${k}$, so $${lo.toLatex()} < x < ${hi.toLatex()}$. At both ends $|r| = 1$ and the terms do not tend to $0$.`,
            `级数收敛当且仅当公比的绝对值小于 $1$：$${-k} < ${L} < ${k}$，所以 $${lo.toLatex()} < x < ${hi.toLatex()}$。两个端点处 $|r| = 1$，各项不趋于 $0$。`,
          ),
        });
      },
    },
    {
      id: "the-sum-as-a-function-of-x",
      title: t("The sum as a function of x", "和作为 x 的函数"),
      explanation: t(
        "Where it converges, a geometric series in $x$ has a sum given by $\\frac{a}{1 - r}$, which is a function of $x$:\n\n$$\\sum_{n=1}^{\\infty} 2\\left(\\frac{x}{3}\\right)^{n} = \\frac{2 \\cdot \\frac{x}{3}}{1 - \\frac{x}{3}} = \\frac{2x}{3 - x} \\quad \\text{for } -3 < x < 3.$$",
        "在收敛的范围内，含 $x$ 的等比级数之和由 $\\frac{a}{1 - r}$ 给出，是 $x$ 的函数：\n\n$$\\sum_{n=1}^{\\infty} 2\\left(\\frac{x}{3}\\right)^{n} = \\frac{2 \\cdot \\frac{x}{3}}{1 - \\frac{x}{3}} = \\frac{2x}{3 - x}，\\quad -3 < x < 3。$$",
      ),
      generate(rng) {
        const c = rng.nonZero(-6, 6);
        const k = rng.int(2, 9);
        const start = rng.int(0, 1);
        const body = `${coefficientOf(c)}\\left(\\frac{x}{${k}}\\right)^{n}`;
        const answer = start === 0 ? `\\frac{${c * k}}{${k} - x}` : `\\frac{${term(c, "x")}}{${k} - x}`;
        const first = start === 0 ? `${c}` : `${c} \\cdot \\frac{x}{${k}}`;
        return functionProblem({
          prompt: t(
            `For $-${k} < x < ${k}$, find the sum of $${sigmaInf(body, start)}$ as a function of $x$.`,
            `当 $-${k} < x < ${k}$ 时，求 $${sigmaInf(body, start)}$ 的和（表示为 $x$ 的函数）。`,
          ),
          answer,
          wrong:
            start === 0
              ? [`\\frac{${c}}{${k} - x}`, `\\frac{${c * k}}{${k} + x}`]
              : [`\\frac{${c * k}}{${k} - x}`, `\\frac{${term(c, "x")}}{${k} + x}`],
          solution: t(
            `The first term is $${first}$ and $r = \\frac{x}{${k}}$, so the sum is $\\frac{${first}}{1 - \\frac{x}{${k}}} = ${answer}$.`,
            `首项为 $${first}$，$r = \\frac{x}{${k}}$，所以和为 $\\frac{${first}}{1 - \\frac{x}{${k}}} = ${answer}$。`,
          ),
        });
      },
    },
  ],
};

/** repeatingDecimalsAsInfiniteGeometricSeries converts repeating decimals to fractions. */
export const repeatingDecimalsAsInfiniteGeometricSeries: TopicDef = {
  id: "repeating-decimals-as-infinite-geometric-series",
  title: t("Repeating Decimals as Infinite Geometric Series", "循环小数与无穷等比级数"),
  summary: t(
    "A repeating block of k digits is a geometric series with ratio 10⁻ᵏ, so every repeating decimal is a fraction.",
    "k 位的循环节构成公比为 10⁻ᵏ 的等比级数，所以每个循环小数都是分数。",
  ),
  prerequisites: ["finding-the-sum-of-an-infinite-geometric-series"],
  encompasses: [{ topic: "finding-the-sum-of-an-infinite-geometric-series", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "purely-repeating-decimals",
      title: t("Purely repeating decimals", "纯循环小数"),
      explanation: t(
        "$0.\\overline{27} = 0.27 + 0.0027 + 0.000027 + \\cdots$ is geometric with $a = \\frac{27}{100}$ and $r = \\frac{1}{100}$, so\n\n$$0.\\overline{27} = \\frac{27/100}{1 - 1/100} = \\frac{27}{99} = \\frac{3}{11}.$$\n\nIn general, a block of $k$ repeating digits $B$ gives $\\frac{B}{10^{k} - 1}$.",
        "$0.\\overline{27} = 0.27 + 0.0027 + 0.000027 + \\cdots$ 是 $a = \\frac{27}{100}$、$r = \\frac{1}{100}$ 的等比级数，所以\n\n$$0.\\overline{27} = \\frac{27/100}{1 - 1/100} = \\frac{27}{99} = \\frac{3}{11}。$$\n\n一般地，$k$ 位循环节 $B$ 给出 $\\frac{B}{10^{k} - 1}$。",
      ),
      generate(rng) {
        const k = rng.int(2, 3);
        const B = rng.int(1, 10 ** k - 2);
        const digits = String(B).padStart(k, "0");
        const den = 10 ** k - 1;
        const answer = Q.of(B, den);
        return numberProblem({
          prompt: t(`Write $0.\\overline{${digits}}$ as a fraction in lowest terms.`, `把 $0.\\overline{${digits}}$ 写成最简分数。`),
          answer,
          wrong: [Q.of(B, 10 ** k), Q.of(B, den + 2), Q.of(B, 10 * den)],
          solution: t(
            `$0.\\overline{${digits}} = \\frac{${B}}{10^{${k}}} + \\frac{${B}}{10^{${2 * k}}} + \\cdots$, a geometric series with $a = \\frac{${B}}{${10 ** k}}$ and $r = \\frac{1}{${10 ** k}}$. Its sum is $\\frac{${B}}{${den}} = ${answer.toLatex()}$.`,
            `$0.\\overline{${digits}} = \\frac{${B}}{10^{${k}}} + \\frac{${B}}{10^{${2 * k}}} + \\cdots$，是 $a = \\frac{${B}}{${10 ** k}}$、$r = \\frac{1}{${10 ** k}}$ 的等比级数，其和为 $\\frac{${B}}{${den}} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "decimals-with-a-delayed-repeat",
      title: t("Decimals whose repeat starts later", "循环节不从第一位开始的小数"),
      explanation: t(
        "Split off the digits before the repeat: $0.4\\overline{36} = \\frac{4}{10} + 0.0\\overline{36}$, and $0.0\\overline{36}$ is geometric with $a = \\frac{36}{1000}$ and $r = \\frac{1}{100}$:\n\n$$0.4\\overline{36} = \\frac{4}{10} + \\frac{36}{990} = \\frac{396 + 36}{990} = \\frac{24}{55}.$$",
        "先把循环节之前的数字拆出来：$0.4\\overline{36} = \\frac{4}{10} + 0.0\\overline{36}$，而 $0.0\\overline{36}$ 是 $a = \\frac{36}{1000}$、$r = \\frac{1}{100}$ 的等比级数：\n\n$$0.4\\overline{36} = \\frac{4}{10} + \\frac{36}{990} = \\frac{396 + 36}{990} = \\frac{24}{55}。$$",
      ),
      generate(rng) {
        const m = rng.int(1, 9);
        const k = rng.int(1, 2);
        let B = rng.int(1, 10 ** k - 2);
        if (k === 1 && B === m) B = m === 8 ? 7 : m + 1;
        const digits = String(B).padStart(k, "0");
        const tail = Q.of(B, 10 * (10 ** k - 1));
        const answer = Q.of(m, 10).add(tail);
        return numberProblem({
          prompt: t(
            `Write $0.${m}\\overline{${digits}}$ as a fraction in lowest terms.`,
            `把 $0.${m}\\overline{${digits}}$ 写成最简分数。`,
          ),
          answer,
          wrong: [Q.of(m * 10 ** k + B, 10 ** (k + 1) - 1), Q.of(m, 10).add(Q.of(B, 10 ** k - 1)), Q.of(m * 10 ** k + B, 10 ** (k + 1))],
          solution: t(
            `$0.${m}\\overline{${digits}} = \\frac{${m}}{10} + 0.0\\overline{${digits}}$. The repeating part is geometric with $a = \\frac{${B}}{${10 ** (k + 1)}}$ and $r = \\frac{1}{${10 ** k}}$, so it equals $${tail.toLatex()}$. In all, $\\frac{${m}}{10} + ${tail.toLatex()} = ${answer.toLatex()}$.`,
            `$0.${m}\\overline{${digits}} = \\frac{${m}}{10} + 0.0\\overline{${digits}}$。循环部分是 $a = \\frac{${B}}{${10 ** (k + 1)}}$、$r = \\frac{1}{${10 ** k}}$ 的等比级数，等于 $${tail.toLatex()}$。合起来为 $\\frac{${m}}{10} + ${tail.toLatex()} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** calculusIISequenceTopics are the topics of Calculus II modules 4.17–4.20. */
export const calculusIISequenceTopics: readonly TopicDef[] = [
  limitsOfSequences,
  convergenceOfGeometricSequences,
  furtherConvergenceOfGeometricSequences,
  limitsOfSequencesWithFactorials,
  determiningLimitsOfSequencesUsingRelativeMagnitudes,
  furtherDeterminingLimitsOfSequencesUsingRelativeMagnitudes,
  monotonicSequences,
  identifyingMonotonicSequencesUsingDifferentiation,
  identifyingMonotonicSequencesUsingRatios,
  infiniteSeriesAndPartialSums,
  convergentAndDivergentInfiniteSeries,
  propertiesOfInfiniteSeries,
  furtherPropertiesOfInfiniteSeries,
  telescopingSeries,
  findingTheSumOfAnInfiniteGeometricSeries,
  writingAnInfiniteGeometricSeriesInSigmaNotation,
  sumsOfInfiniteGeometricSeriesGivenInSigmaNotation,
  convergenceOfGeometricSeries,
  repeatingDecimalsAsInfiniteGeometricSeries,
];
