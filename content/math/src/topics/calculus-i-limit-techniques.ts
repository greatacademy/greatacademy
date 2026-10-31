import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q, radical } from "@ga/subject-math";

import { functionProblem, numberProblem } from "../problems.ts";
import { bare, fac, infL, type LimitValue, lim, limitChoice, range } from "./calculus-common.ts";

// Calculus I unit 2: Limits, modules 2.5 (Determining Limits Using Algebraic
// Manipulation) and 2.6 (Special Limits). Topics 2.5.8 and 2.5.9 are the
// existing vertical-asymptotes-of-rational-functions and
// infinite-limits-of-rational-functions.

/** cx writes the multiple k of a term: "x", "-x", "3x". */
const cx = (k: number, body: string) => (k === 1 ? body : k === -1 ? `-${body}` : `${k}${body}`);

/** inv is the reciprocal of q, or 0 when q is 0. */
const inv = (q: Q) => (q.isZero() ? Q.zero : Q.one.div(q));

/** frac is n/d, or 0 when d is 0, for wrong answers that may divide by zero. */
const frac = (n: number, d: number) => (d === 0 ? Q.zero : Q.of(n, d));

/** quad writes (x − p)(x − q) expanded, times k. */
const quad = (k: number, p: number, q: number) => poly([k, "x^{2}"], [-k * (p + q), "x"], [k * p * q, ""]);

/** calculatingLimitsOfRationalFunctionsByFactoring removes a common factor before substituting. */
export const calculatingLimitsOfRationalFunctionsByFactoring: TopicDef = {
  id: "calculating-limits-of-rational-functions-by-factoring",
  title: t("Calculating Limits of Rational Functions by Factoring", "用因式分解求分式函数的极限"),
  summary: t(
    "Evaluate limits of the form 0/0 by factoring and cancelling the common factor.",
    "通过因式分解并约去公因式，求 0/0 型的极限。",
  ),
  prerequisites: ["the-product-and-quotient-rules-for-limits", "simplifying-rational-expressions-by-factoring"],
  encompasses: [
    { topic: "the-product-and-quotient-rules-for-limits", weight: 0.3 },
    { topic: "simplifying-rational-expressions-by-factoring", weight: 0.3 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "cancelling-a-common-linear-factor",
      title: t("Cancelling a common factor", "约去公因式"),
      explanation: t(
        "Substituting $x = a$ into a rational function may give $\\frac{0}{0}$. This says nothing about the limit yet: both numerator and denominator have the factor $(x - a)$. Factor, cancel, then substitute:\n\n$$\\lim_{x \\to 3} \\frac{x^{2} - x - 6}{x - 3} = \\lim_{x \\to 3} \\frac{(x - 3)(x + 2)}{x - 3} = \\lim_{x \\to 3} (x + 2) = 5.$$\n\nCancelling is allowed because the limit only uses $x \\ne 3$.",
        "把 $x = a$ 代入分式函数可能得到 $\\frac{0}{0}$。这还不能说明极限是什么：分子和分母都含有因式 $(x - a)$。先分解、约分，再代入：\n\n$$\\lim_{x \\to 3} \\frac{x^{2} - x - 6}{x - 3} = \\lim_{x \\to 3} \\frac{(x - 3)(x + 2)}{x - 3} = \\lim_{x \\to 3} (x + 2) = 5.$$\n\n可以约分，是因为求极限时只考虑 $x \\ne 3$。",
      ),
      generate(rng) {
        const a = rng.int(-5, 5);
        const r = rng.pick(range(-6, 6).filter((v) => v !== a));
        const flip = rng.bool(0.35);
        const top = quad(1, a, r);
        const den = bare(a);
        const answer = flip ? Q.of(1, a - r) : Q.of(a - r);
        return numberProblem({
          prompt: t(
            `Find $${lim(a)} ${flip ? `\\frac{${den}}{${top}}` : `\\frac{${top}}{${den}}`}$.`,
            `求 $${lim(a)} ${flip ? `\\frac{${den}}{${top}}` : `\\frac{${top}}{${den}}`}$。`,
          ),
          answer,
          wrong: [Q.zero, Q.of(a + r), answer.neg(), flip ? Q.of(a - r) : Q.of(1, a - r)],
          solution: t(
            `Substituting gives $\\frac{0}{0}$. Factor: $${top} = ${fac(a)}${fac(r)}$. Cancel $${bare(a)}$, leaving ${flip ? `$\\frac{1}{${bare(r)}}$` : `$${bare(r)}$`}, and substitute $x = ${a}$: $${answer.toLatex()}$.`,
            `代入得 $\\frac{0}{0}$。分解：$${top} = ${fac(a)}${fac(r)}$。约去 $${bare(a)}$，剩下${flip ? `$\\frac{1}{${bare(r)}}$` : `$${bare(r)}$`}，再代入 $x = ${a}$：$${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "factoring-numerator-and-denominator",
      title: t("Factoring the numerator and denominator", "分解分子与分母"),
      explanation: t(
        "When both numerator and denominator are quadratics, or a difference of cubes appears, factor both fully before cancelling:\n\n$$\\lim_{x \\to 2} \\frac{x^{2} - 4}{x^{2} - 5x + 6} = \\lim_{x \\to 2} \\frac{(x - 2)(x + 2)}{(x - 2)(x - 3)} = \\frac{4}{-1} = -4,$$\n\n$$\\lim_{x \\to a} \\frac{x^{3} - a^{3}}{x - a} = \\lim_{x \\to a} (x^{2} + ax + a^{2}) = 3a^{2}.$$",
        "当分子和分母都是二次式，或出现立方差时，先把二者完全分解再约分：\n\n$$\\lim_{x \\to 2} \\frac{x^{2} - 4}{x^{2} - 5x + 6} = \\lim_{x \\to 2} \\frac{(x - 2)(x + 2)}{(x - 2)(x - 3)} = \\frac{4}{-1} = -4,$$\n\n$$\\lim_{x \\to a} \\frac{x^{3} - a^{3}}{x - a} = \\lim_{x \\to a} (x^{2} + ax + a^{2}) = 3a^{2}.$$",
      ),
      generate(rng) {
        if (rng.bool(0.25)) {
          const a = rng.nonZero(-4, 4);
          const k = rng.pick([1, 1, 2, 3, -1]);
          const top = poly([k, "x^{3}"], [-k * a ** 3, ""]);
          const answer = 3 * k * a * a;
          return numberProblem({
            prompt: t(`Find $${lim(a)} \\frac{${top}}{${bare(a)}}$.`, `求 $${lim(a)} \\frac{${top}}{${bare(a)}}$。`),
            answer,
            wrong: [0, k * a * a, 3 * k * a],
            solution: t(
              `$x^{3} - ${paren(a)}^{3} = ${fac(a)}(x^{2} ${a < 0 ? "-" : "+"} ${Math.abs(a) === 1 ? "" : Math.abs(a)}x + ${a * a})$. Cancel $${bare(a)}$ and substitute: $${k === 1 ? "" : `${k} \\cdot `}3(${a})^{2} = ${answer}$.`,
              `$x^{3} - ${paren(a)}^{3} = ${fac(a)}(x^{2} ${a < 0 ? "-" : "+"} ${Math.abs(a) === 1 ? "" : Math.abs(a)}x + ${a * a})$。约去 $${bare(a)}$ 后代入：$${k === 1 ? "" : `${k} \\cdot `}3(${a})^{2} = ${answer}$。`,
            ),
          });
        }
        const a = rng.int(-4, 4);
        const [r, s] = rng.sample(
          range(-5, 5).filter((v) => v !== a),
          2,
        ) as [number, number];
        const p = rng.pick([1, 1, 2, 3, -1, -2]);
        const q = rng.pick([1, 1, 2, 3, -1]);
        const top = quad(p, a, r);
        const den = quad(q, a, s);
        const answer = Q.of(p * (a - r), q * (a - s));
        return numberProblem({
          prompt: t(`Find $${lim(a)} \\frac{${top}}{${den}}$.`, `求 $${lim(a)} \\frac{${top}}{${den}}$。`),
          answer,
          wrong: [Q.zero, Q.of(p, q), frac(p * (a + r), q * (a + s)), inv(answer)],
          solution: t(
            `Substituting gives $\\frac{0}{0}$. Factor: $\\frac{${cx(p, `${fac(a)}${fac(r)}`)}}{${cx(q, `${fac(a)}${fac(s)}`)}}$. Cancel $${bare(a)}$ and substitute $x = ${a}$: $\\frac{${p * (a - r)}}{${q * (a - s)}} = ${answer.toLatex()}$.`,
            `代入得 $\\frac{0}{0}$。分解：$\\frac{${cx(p, `${fac(a)}${fac(r)}`)}}{${cx(q, `${fac(a)}${fac(s)}`)}}$。约去 $${bare(a)}$ 后代入 $x = ${a}$：$\\frac{${p * (a - r)}}{${q * (a - s)}} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** paren writes a number in parentheses when negative. */
const paren = (n: number) => (n < 0 ? `(${n})` : `${n}`);

/** limitsOfAbsoluteValueFunctions finds limits of functions containing |x − a|. */
export const limitsOfAbsoluteValueFunctions: TopicDef = {
  id: "limits-of-absolute-value-functions",
  title: t("Limits of Absolute Value Functions", "绝对值函数的极限"),
  summary: t(
    "Find limits of functions containing absolute values, splitting into one-sided limits where the expression inside changes sign.",
    "求含绝对值的函数的极限；在绝对值内的式子变号处分成单侧极限讨论。",
  ),
  prerequisites: [
    "finding-the-existence-of-a-limit-using-one-sided-limits",
    "calculating-limits-of-rational-functions-by-factoring",
    "absolute-value-graphs",
  ],
  encompasses: [
    { topic: "finding-the-existence-of-a-limit-using-one-sided-limits", weight: 0.3 },
    { topic: "absolute-value-graphs", weight: 0.2 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "absolute-value-limits-by-substitution",
      title: t("Limits by substitution", "代入法求极限"),
      explanation: t(
        "An absolute value function has no breaks, so a limit of $|g(x)|$ plus a polynomial is found by substituting, keeping the absolute value:\n\n$$\\lim_{x \\to 1} \\left(2|x - 4| + 3x\\right) = 2|{-3}| + 3 = 9.$$",
        "绝对值函数没有间断，所以 $|g(x)|$ 加上多项式的极限可直接代入求得，注意保留绝对值：\n\n$$\\lim_{x \\to 1} \\left(2|x - 4| + 3x\\right) = 2|{-3}| + 3 = 9.$$",
      ),
      generate(rng) {
        const a = rng.int(-5, 5);
        const b = rng.pick(range(-6, 6).filter((v) => v !== a));
        const k = rng.pick([-3, -2, -1, 1, 2, 3, 4]);
        const c = rng.int(-4, 4);
        const expr = poly([k, `|${bare(a)}|`], [c, "x"]);
        const answer = k * Math.abs(b - a) + c * b;
        return numberProblem({
          prompt: t(`Find $${lim(b)} \\left(${expr}\\right)$.`, `求 $${lim(b)} \\left(${expr}\\right)$。`),
          answer,
          wrong: [k * (b - a) + c * b, k * Math.abs(b + a) + c * b, Math.abs(k * (b - a) + c * b)],
          solution: t(
            `Substitute $x = ${b}$: $${poly([k, `|${b - a}|`], [c, `(${b})`])} = ${answer}$.`,
            `代入 $x = ${b}$：$${poly([k, `|${b - a}|`], [c, `(${b})`])} = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "absolute-value-limits-at-a-sign-change",
      title: t("Limits where the expression changes sign", "在式子变号处的极限"),
      explanation: t(
        "Near $x = a$, $|x - a| = x - a$ for $x > a$ and $|x - a| = -(x - a)$ for $x < a$. So\n\n$$\\lim_{x \\to a^{+}} \\frac{|x - a|}{x - a} = 1, \\qquad \\lim_{x \\to a^{-}} \\frac{|x - a|}{x - a} = -1,$$\n\nand the two-sided limit does not exist. Replace the absolute value by the right expression on each side, then simplify.",
        "在 $x = a$ 附近，$x > a$ 时 $|x - a| = x - a$，$x < a$ 时 $|x - a| = -(x - a)$。所以\n\n$$\\lim_{x \\to a^{+}} \\frac{|x - a|}{x - a} = 1, \\qquad \\lim_{x \\to a^{-}} \\frac{|x - a|}{x - a} = -1,$$\n\n双侧极限不存在。在每一侧把绝对值换成相应的式子，再化简。",
      ),
      generate(rng) {
        const a = rng.nonZero(-5, 5);
        const side = rng.pick([-1, 1, 0] as const);
        const form = rng.int(0, 1);
        let expr: string;
        let right: number;
        let how: string;
        let howZh: string;
        if (form === 0) {
          const k = rng.nonZero(-5, 5);
          const c = rng.int(-4, 4);
          expr = `\\frac{${cx(k, `|${bare(a)}|`)}}{${bare(a)}}${c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${-c}`}`;
          // The one-sided limits are c + k (right) and c − k (left).
          right = k;
          how = `the fraction is $${k}$ on the right and $${-k}$ on the left`;
          howZh = `分式在右侧等于 $${k}$，在左侧等于 $${-k}$`;
          const values = { right: c + k, left: c - k };
          const answer: LimitValue = side > 0 ? Q.of(values.right) : side < 0 ? Q.of(values.left) : "dne";
          return limitChoice(
            rng,
            t(`Find $${side === 0 ? lim(a) : lim(a, side)} ${expr}$.`, `求 $${side === 0 ? lim(a) : lim(a, side)} ${expr}$。`),
            answer,
            [Q.of(values.right), Q.of(values.left), Q.of(c)],
            t(
              `For $x > ${a}$, $|${bare(a)}| = ${bare(a)}$; for $x < ${a}$, $|${bare(a)}| = -${fac(a)}$. So ${how}: the right-sided limit is $${values.right}$ and the left-sided limit is $${values.left}$.${side === 0 ? " They differ, so the limit does not exist." : ""}`,
              `当 $x > ${a}$ 时 $|${bare(a)}| = ${bare(a)}$；当 $x < ${a}$ 时 $|${bare(a)}| = -${fac(a)}$。所以${howZh}：右极限为 $${values.right}$，左极限为 $${values.left}$。${side === 0 ? "二者不相等，所以极限不存在。" : ""}`,
            ),
            undefined,
            true,
          );
        }
        expr = `\\frac{${poly([1, "x^{2}"], [-a * a, ""])}}{|${bare(a)}|}`;
        right = 2 * a;
        const answer: LimitValue = side > 0 ? Q.of(right) : side < 0 ? Q.of(-right) : "dne";
        return limitChoice(
          rng,
          t(`Find $${side === 0 ? lim(a) : lim(a, side)} ${expr}$.`, `求 $${side === 0 ? lim(a) : lim(a, side)} ${expr}$。`),
          answer,
          [Q.of(right), Q.of(-right), Q.zero],
          t(
            `$x^{2} - ${a * a} = ${fac(a)}${fac(-a)}$. For $x > ${a}$ the fraction is $${bare(-a)}$, tending to $${right}$; for $x < ${a}$ it is $-${fac(-a)}$, tending to $${-right}$.${side === 0 ? " The one-sided limits differ, so the limit does not exist." : ""}`,
            `$x^{2} - ${a * a} = ${fac(a)}${fac(-a)}$。当 $x > ${a}$ 时分式等于 $${bare(-a)}$，趋于 $${right}$；当 $x < ${a}$ 时等于 $-${fac(-a)}$，趋于 $${-right}$。${side === 0 ? "两个单侧极限不相等，所以极限不存在。" : ""}`,
          ),
          undefined,
          true,
        );
      },
    },
  ],
};

/** calculatingLimitsOfRadicalFunctionsUsingConjugateMultiplication resolves 0/0 with a conjugate. */
export const calculatingLimitsOfRadicalFunctionsUsingConjugateMultiplication: TopicDef = {
  id: "calculating-limits-of-radical-functions-using-conjugate-multiplication",
  title: t("Calculating Limits of Radical Functions Using Conjugate Multiplication", "用共轭相乘求根式函数的极限"),
  summary: t(
    "Evaluate limits of the form 0/0 containing a square root by multiplying by the conjugate.",
    "对含平方根的 0/0 型极限，乘以共轭式后求值。",
  ),
  prerequisites: ["calculating-limits-of-rational-functions-by-factoring", "rationalizing-two-term-denominators"],
  encompasses: [
    { topic: "calculating-limits-of-rational-functions-by-factoring", weight: 0.3 },
    { topic: "rationalizing-two-term-denominators", weight: 0.3 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "conjugate-multiplication-in-the-numerator",
      title: t("A root in the numerator", "分子含根式"),
      explanation: t(
        "If $\\sqrt{g(x)} - r$ tends to $0$, multiply top and bottom by the conjugate $\\sqrt{g(x)} + r$; the difference of squares removes the root:\n\n$$\\lim_{x \\to 5} \\frac{\\sqrt{x + 4} - 3}{x - 5} = \\lim_{x \\to 5} \\frac{(x + 4) - 9}{(x - 5)(\\sqrt{x + 4} + 3)} = \\lim_{x \\to 5} \\frac{1}{\\sqrt{x + 4} + 3} = \\frac{1}{6}.$$",
        "若 $\\sqrt{g(x)} - r$ 趋于 $0$，分子分母同乘共轭式 $\\sqrt{g(x)} + r$，平方差会消去根号：\n\n$$\\lim_{x \\to 5} \\frac{\\sqrt{x + 4} - 3}{x - 5} = \\lim_{x \\to 5} \\frac{(x + 4) - 9}{(x - 5)(\\sqrt{x + 4} + 3)} = \\lim_{x \\to 5} \\frac{1}{\\sqrt{x + 4} + 3} = \\frac{1}{6}.$$",
      ),
      generate(rng) {
        const r = rng.int(1, 6);
        const p = rng.pick([1, 1, 2, 3]);
        const a = rng.int(-4, 6);
        const b = r * r - p * a;
        const inner = poly([p, "x"], [b, ""]);
        const flip = rng.bool(0.35);
        const top = `\\sqrt{${inner}} - ${r}`;
        const den = bare(a);
        const answer = flip ? Q.of(2 * r, p) : Q.of(p, 2 * r);
        return numberProblem({
          prompt: t(
            `Find $${lim(a)} ${flip ? `\\frac{${den}}{${top}}` : `\\frac{${top}}{${den}}`}$.`,
            `求 $${lim(a)} ${flip ? `\\frac{${den}}{${top}}` : `\\frac{${top}}{${den}}`}$。`,
          ),
          answer,
          wrong: [Q.zero, inv(answer), Q.of(p, r), Q.of(1, 2 * r)],
          solution: t(
            `Multiply by $\\sqrt{${inner}} + ${r}$: the root difference becomes $(${inner}) - ${r * r} = ${cx(p, `${fac(a)}`)}$. Cancel $${bare(a)}$ and substitute, using $\\sqrt{${r * r}} + ${r} = ${2 * r}$: the limit is $${answer.toLatex()}$.`,
            `同乘 $\\sqrt{${inner}} + ${r}$：根式之差变为 $(${inner}) - ${r * r} = ${cx(p, `${fac(a)}`)}$。约去 $${bare(a)}$ 后代入，其中 $\\sqrt{${r * r}} + ${r} = ${2 * r}$：极限为 $${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "conjugate-multiplication-with-a-quadratic",
      title: t("Conjugates with a quadratic factor", "共轭与二次因式"),
      explanation: t(
        "After multiplying by the conjugate, factor what remains before cancelling:\n\n$$\\lim_{x \\to 1} \\frac{x^{2} + 2x - 3}{\\sqrt{x + 3} - 2} = \\lim_{x \\to 1} \\frac{(x - 1)(x + 3)(\\sqrt{x + 3} + 2)}{x - 1} = 4 \\cdot 4 = 16.$$",
        "乘以共轭式后，先把剩余部分分解再约分：\n\n$$\\lim_{x \\to 1} \\frac{x^{2} + 2x - 3}{\\sqrt{x + 3} - 2} = \\lim_{x \\to 1} \\frac{(x - 1)(x + 3)(\\sqrt{x + 3} + 2)}{x - 1} = 4 \\cdot 4 = 16.$$",
      ),
      generate(rng) {
        const r = rng.int(1, 5);
        const a = rng.int(-4, 5);
        const b = r * r - a;
        const s = rng.pick(range(-5, 5).filter((v) => v !== a));
        const top = quad(1, a, s);
        const answer = (a - s) * 2 * r;
        return numberProblem({
          prompt: t(
            `Find $${lim(a)} \\frac{${top}}{\\sqrt{${poly([1, "x"], [b, ""])}} - ${r}}$.`,
            `求 $${lim(a)} \\frac{${top}}{\\sqrt{${poly([1, "x"], [b, ""])}} - ${r}}$。`,
          ),
          answer,
          wrong: [0, a - s, Q.of(a - s, 2 * r), (a + s) * 2 * r],
          solution: t(
            `Multiply by $\\sqrt{${poly([1, "x"], [b, ""])}} + ${r}$: the denominator becomes $${bare(a)}$, and $${top} = ${fac(a)}${fac(s)}$. Cancel and substitute: $(${a - s})(${2 * r}) = ${answer}$.`,
            `同乘 $\\sqrt{${poly([1, "x"], [b, ""])}} + ${r}$：分母变为 $${bare(a)}$，而 $${top} = ${fac(a)}${fac(s)}$。约分后代入：$(${a - s})(${2 * r}) = ${answer}$。`,
          ),
        });
      },
    },
  ],
};

/** IdentityForm is a trigonometric quotient that simplifies by an identity, with the angles where it is 0/0 and its value there. */
interface IdentityForm {
  readonly top: string;
  readonly bottom: string;
  readonly simplified: string;
  readonly at: readonly [string, number][];
}

const pythagoreanForms: readonly IdentityForm[] = [
  {
    top: "\\sin^{2} x",
    bottom: "1 - \\cos x",
    simplified: "1 + \\cos x",
    at: [
      ["0", 2],
      ["2\\pi", 2],
    ],
  },
  {
    top: "\\sin^{2} x",
    bottom: "1 + \\cos x",
    simplified: "1 - \\cos x",
    at: [
      ["\\pi", 2],
      ["-\\pi", 2],
    ],
  },
  { top: "\\cos^{2} x", bottom: "1 - \\sin x", simplified: "1 + \\sin x", at: [["\\frac{\\pi}{2}", 2]] },
  {
    top: "\\cos^{2} x",
    bottom: "1 + \\sin x",
    simplified: "1 - \\sin x",
    at: [
      ["-\\frac{\\pi}{2}", 2],
      ["\\frac{3\\pi}{2}", 2],
    ],
  },
  {
    top: "1 - \\cos x",
    bottom: "\\sin^{2} x",
    simplified: "\\frac{1}{1 + \\cos x}",
    at: [
      ["0", 0.5],
      ["2\\pi", 0.5],
    ],
  },
  { top: "1 - \\sin x", bottom: "\\cos^{2} x", simplified: "\\frac{1}{1 + \\sin x}", at: [["\\frac{\\pi}{2}", 0.5]] },
  { top: "1 + \\sin x", bottom: "\\cos^{2} x", simplified: "\\frac{1}{1 - \\sin x}", at: [["-\\frac{\\pi}{2}", 0.5]] },
];

const doubleAngleForms: readonly IdentityForm[] = [
  {
    top: "\\sin 2x",
    bottom: "\\sin x",
    simplified: "2\\cos x",
    at: [
      ["0", 2],
      ["\\pi", -2],
    ],
  },
  {
    top: "\\sin 2x",
    bottom: "\\cos x",
    simplified: "2\\sin x",
    at: [
      ["\\frac{\\pi}{2}", 2],
      ["-\\frac{\\pi}{2}", -2],
    ],
  },
  {
    top: "\\cos 2x",
    bottom: "\\cos x - \\sin x",
    simplified: "\\cos x + \\sin x",
    at: [
      ["\\frac{\\pi}{4}", Math.SQRT2],
      ["\\frac{5\\pi}{4}", -Math.SQRT2],
    ],
  },
  {
    top: "\\cos 2x",
    bottom: "\\cos x + \\sin x",
    simplified: "\\cos x - \\sin x",
    at: [
      ["-\\frac{\\pi}{4}", Math.SQRT2],
      ["\\frac{3\\pi}{4}", -Math.SQRT2],
    ],
  },
  {
    top: "1 - \\cos 2x",
    bottom: "\\sin^{2} x",
    simplified: "2",
    at: [
      ["0", 2],
      ["\\pi", 2],
    ],
  },
];

/** identityLimit draws a form, an angle where it is 0/0 and a ratio k/q of multiples, and states the limit. */
function identityLimit(rng: Rng, forms: readonly IdentityForm[], identity: { en: string; zh: string }) {
  const form = rng.pick(forms);
  const [at, value] = rng.pick(form.at);
  const k = rng.pick([1, 1, 2, 3, 4, -1, -2, 5]);
  const q = rng.pick([1, 1, 1, 2, 3, -1]);
  const ratio = Q.of(k, q);
  const rootTwo = Math.abs(Math.abs(value) - Math.SQRT2) < 1e-9;
  const scaled = rootTwo ? ratio.mul(Q.of(Math.sign(value))) : ratio.mul(Q.of(Math.round(value * 2), 2));
  const answer = rootTwo ? radical(scaled, 2) : scaled.toLatex();
  const top = k === 1 ? form.top : `${k}(${form.top})`.replace(/^(-?\d+)\((\\[a-z]+(?:\^\{2\})? ?\d?x)\)$/, "$1$2");
  const bottom = q === 1 ? form.bottom : `${q}(${form.bottom})`.replace(/^(-?\d+)\((\\[a-z]+(?:\^\{2\})? ?\d?x)\)$/, "$1$2");
  const expr = `\\frac{${top}}{${bottom}}`;
  const v = rootTwo ? radical(Q.of(Math.sign(value)), 2) : Q.of(Math.round(value * 2), 2).toLatex();
  const vp = value < 0 && !ratio.eq(Q.one) ? `\\left(${v}\\right)` : v;
  return functionProblem({
    prompt: t(`Find $${lim(at)} ${expr}$.`, `求 $${lim(at)} ${expr}$。`),
    answer,
    wrong: ["0", rootTwo ? radical(scaled.neg(), 2) : scaled.neg().toLatex(), ratio.toLatex()],
    solution: t(
      `Substituting gives $\\frac{0}{0}$. ${identity.en} $\\frac{${form.top}}{${form.bottom}} = ${form.simplified}$, so the limit is $${ratio.eq(Q.one) ? "" : `${ratio.toLatex()} \\cdot `}${vp} = ${answer}$.`,
      `代入得 $\\frac{0}{0}$。${identity.zh}$\\frac{${form.top}}{${form.bottom}} = ${form.simplified}$，所以极限是 $${ratio.eq(Q.one) ? "" : `${ratio.toLatex()} \\cdot `}${vp} = ${answer}$。`,
    ),
  });
}

/** calculatingLimitsUsingTrigonometricIdentities resolves 0/0 with trigonometric identities. */
export const calculatingLimitsUsingTrigonometricIdentities: TopicDef = {
  id: "calculating-limits-using-trigonometric-identities",
  title: t("Calculating Limits Using Trigonometric Identities", "用三角恒等式求极限"),
  summary: t(
    "Evaluate trigonometric limits of the form 0/0 by simplifying with the Pythagorean and double-angle identities.",
    "用勾股恒等式和二倍角公式化简，求 0/0 型三角函数极限。",
  ),
  prerequisites: [
    "limits-of-trigonometric-functions",
    "calculating-limits-of-rational-functions-by-factoring",
    "the-double-angle-formula-for-cosine",
  ],
  encompasses: [
    { topic: "limits-of-trigonometric-functions", weight: 0.3 },
    { topic: "alternate-forms-of-the-pythagorean-identity", weight: 0.2 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "trigonometric-limits-with-the-pythagorean-identity",
      title: t("Using the Pythagorean identity", "利用勾股恒等式"),
      explanation: t(
        "Write $\\sin^{2} x = 1 - \\cos^{2} x = (1 - \\cos x)(1 + \\cos x)$, and similarly $\\cos^{2} x = (1 - \\sin x)(1 + \\sin x)$, then cancel:\n\n$$\\lim_{x \\to 0} \\frac{\\sin^{2} x}{1 - \\cos x} = \\lim_{x \\to 0} \\frac{(1 - \\cos x)(1 + \\cos x)}{1 - \\cos x} = \\lim_{x \\to 0} (1 + \\cos x) = 2.$$",
        "把 $\\sin^{2} x$ 写成 $1 - \\cos^{2} x = (1 - \\cos x)(1 + \\cos x)$，同理 $\\cos^{2} x = (1 - \\sin x)(1 + \\sin x)$，然后约分：\n\n$$\\lim_{x \\to 0} \\frac{\\sin^{2} x}{1 - \\cos x} = \\lim_{x \\to 0} \\frac{(1 - \\cos x)(1 + \\cos x)}{1 - \\cos x} = \\lim_{x \\to 0} (1 + \\cos x) = 2.$$",
      ),
      generate(rng) {
        return identityLimit(rng, pythagoreanForms, {
          en: "By the Pythagorean identity and the difference of squares,",
          zh: "由勾股恒等式和平方差公式，",
        });
      },
    },
    {
      id: "trigonometric-limits-with-double-angle-formulas",
      title: t("Using the double-angle formulas", "利用二倍角公式"),
      explanation: t(
        "Rewrite $\\sin 2x = 2\\sin x\\cos x$ and $\\cos 2x = \\cos^{2} x - \\sin^{2} x = (\\cos x - \\sin x)(\\cos x + \\sin x)$, then cancel:\n\n$$\\lim_{x \\to \\pi/4} \\frac{\\cos 2x}{\\cos x - \\sin x} = \\lim_{x \\to \\pi/4} (\\cos x + \\sin x) = \\sqrt{2}.$$",
        "把 $\\sin 2x$ 写成 $2\\sin x\\cos x$，$\\cos 2x$ 写成 $\\cos^{2} x - \\sin^{2} x = (\\cos x - \\sin x)(\\cos x + \\sin x)$，然后约分：\n\n$$\\lim_{x \\to \\pi/4} \\frac{\\cos 2x}{\\cos x - \\sin x} = \\lim_{x \\to \\pi/4} (\\cos x + \\sin x) = \\sqrt{2}.$$",
      ),
      generate(rng) {
        return identityLimit(rng, doubleAngleForms, { en: "By the double-angle formulas,", zh: "由二倍角公式，" });
      },
    },
  ],
};

/** leading writes a polynomial of degree n with leading coefficient a and random lower terms. */
function leading(rng: Rng, n: number, a: number) {
  const terms: [number, string][] = [[a, n === 1 ? "x" : n === 0 ? "" : `x^{${n}}`]];
  for (let d = n - 1; d >= 0; d--) if (rng.bool(0.6)) terms.push([rng.int(-9, 9), d === 0 ? "" : d === 1 ? "x" : `x^{${d}}`]);
  return poly(...terms);
}

/** limitsAtInfinityAndHorizontalAsymptotesOfRationalFunctions finds limits of rational functions at ±∞. */
export const limitsAtInfinityAndHorizontalAsymptotesOfRationalFunctions: TopicDef = {
  id: "limits-at-infinity-and-horizontal-asymptotes-of-rational-functions",
  title: t("Limits at Infinity and Horizontal Asymptotes of Rational Functions", "分式函数在无穷远处的极限与水平渐近线"),
  summary: t(
    "Find limits of rational functions as x → ±∞ by dividing by the highest power of x, and relate them to horizontal asymptotes.",
    "通过除以 x 的最高次幂，求分式函数在 x → ±∞ 时的极限，并把它与水平渐近线联系起来。",
  ),
  prerequisites: ["limits-at-infinity-of-polynomials", "limits-of-reciprocal-functions", "horizontal-asymptotes-of-rational-functions"],
  encompasses: [
    { topic: "limits-at-infinity-of-polynomials", weight: 0.3 },
    { topic: "horizontal-asymptotes-of-rational-functions", weight: 0.4 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "rational-limits-at-infinity-with-equal-degrees",
      title: t("Equal degrees", "次数相等"),
      explanation: t(
        "Divide every term by the highest power of $x$ in the denominator. Terms like $\\frac{5}{x}$ tend to $0$, so when the degrees are equal the limit is the ratio of the leading coefficients:\n\n$$\\lim_{x \\to \\infty} \\frac{6x^{2} - x}{3x^{2} + 4} = \\lim_{x \\to \\infty} \\frac{6 - \\frac{1}{x}}{3 + \\frac{4}{x^{2}}} = 2.$$\n\nThe line $y = 2$ is a horizontal asymptote.",
        "把每一项都除以分母中 $x$ 的最高次幂。像 $\\frac{5}{x}$ 这样的项趋于 $0$，所以次数相等时，极限是首项系数之比：\n\n$$\\lim_{x \\to \\infty} \\frac{6x^{2} - x}{3x^{2} + 4} = \\lim_{x \\to \\infty} \\frac{6 - \\frac{1}{x}}{3 + \\frac{4}{x^{2}}} = 2.$$\n\n直线 $y = 2$ 是水平渐近线。",
      ),
      generate(rng) {
        const n = rng.int(1, 3);
        const a = rng.nonZero(-8, 8);
        const b = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
        const top = leading(rng, n, a);
        const bottom = leading(rng, n, b);
        const target = rng.pick(["\\infty", "-\\infty"]);
        const answer = Q.of(a, b);
        return numberProblem({
          prompt: t(`Find $${lim(target)} \\frac{${top}}{${bottom}}$.`, `求 $${lim(target)} \\frac{${top}}{${bottom}}$。`),
          answer,
          wrong: [Q.zero, inv(answer), answer.neg(), Q.one],
          solution: t(
            `The degrees are equal, so divide by $x${n === 1 ? "" : `^{${n}}`}$: every other term tends to $0$, leaving $${ratio(a, b)}$.`,
            `分子分母次数相等，同除以 $x${n === 1 ? "" : `^{${n}}`}$：其余各项都趋于 $0$，剩下 $${ratio(a, b)}$。`,
          ),
        });
      },
    },
    {
      id: "rational-limits-at-infinity-with-unequal-degrees",
      title: t("Unequal degrees", "次数不等"),
      explanation: t(
        "If the denominator has the higher degree, the limit is $0$. If the numerator has the higher degree, the function behaves like the ratio of the leading terms, which tends to $\\infty$ or $-\\infty$:\n\n$$\\lim_{x \\to -\\infty} \\frac{2x^{3} + 1}{x - 4} = \\lim_{x \\to -\\infty} 2x^{2} = \\infty.$$",
        "若分母次数更高，极限为 $0$。若分子次数更高，函数的表现与首项之比一致，趋于 $\\infty$ 或 $-\\infty$：\n\n$$\\lim_{x \\to -\\infty} \\frac{2x^{3} + 1}{x - 4} = \\lim_{x \\to -\\infty} 2x^{2} = \\infty.$$",
      ),
      generate(rng) {
        const [n, m] = rng.pick([
          [1, 2],
          [1, 3],
          [2, 3],
          [0, 2],
          [2, 1],
          [3, 1],
          [3, 2],
          [4, 2],
        ] as const);
        const a = rng.nonZero(-6, 6);
        const b = rng.nonZero(-5, 5);
        const top = leading(rng, n, a);
        const bottom = leading(rng, m, b);
        const toPlus = rng.bool();
        const target = toPlus ? "\\infty" : "-\\infty";
        let answer: LimitValue;
        let why: { en: string; zh: string };
        if (n < m) {
          answer = Q.zero;
          why = { en: "The denominator has the higher degree, so the limit is $0$.", zh: "分母次数更高，所以极限为 $0$。" };
        } else {
          const sign = Math.sign(a * b) * (toPlus || (n - m) % 2 === 0 ? 1 : -1);
          answer = sign > 0 ? "inf" : "-inf";
          const ratio = poly([Q.of(a, b), n - m === 1 ? "x" : `x^{${n - m}}`]);
          why = {
            en: `The numerator has the higher degree; the ratio of leading terms is $${ratio}$, which tends to $${infL(sign)}$ as $x \\to ${target}$.`,
            zh: `分子次数更高；首项之比为 $${ratio}$，当 $x \\to ${target}$ 时趋于 $${infL(sign)}$。`,
          };
        }
        return limitChoice(
          rng,
          t(`Find $${lim(target)} \\frac{${top}}{${bottom}}$.`, `求 $${lim(target)} \\frac{${top}}{${bottom}}$。`),
          answer,
          [Q.zero, Q.of(a, b)],
          t(why.en, why.zh),
        );
      },
    },
  ],
};

/** growthClasses are functions in increasing order of growth as x → ∞. */
const growthClasses = ["\\ln x", "\\sqrt{x}", "x", "x^{2}", "x^{5}", "2^{x}", "e^{x}", "3^{x}", "e^{2x}"] as const;

/** dot puts a multiplication dot between a coefficient and a numeric base: "5 \\cdot 3^{x}". */
const dot = (s: string) => s.replace(/(\d)([23]\^\{x\})/g, "$1 \\cdot $2");

/** evaluatingLimitsAtInfinityByComparingRelativeMagnitudesOfFunctions compares the growth of logarithms, powers and exponentials. */
export const evaluatingLimitsAtInfinityByComparingRelativeMagnitudesOfFunctions: TopicDef = {
  id: "evaluating-limits-at-infinity-by-comparing-relative-magnitudes-of-functions",
  title: t("Evaluating Limits at Infinity by Comparing Relative Magnitudes of Functions", "比较函数的增长速度求无穷远处的极限"),
  summary: t(
    "Use the growth order of logarithms, powers and exponentials to find limits at infinity.",
    "利用对数、幂函数和指数函数的增长快慢求无穷远处的极限。",
  ),
  prerequisites: [
    "limits-at-infinity-and-horizontal-asymptotes-of-rational-functions",
    "limits-of-exponential-functions",
    "limits-of-logarithmic-functions",
  ],
  encompasses: [
    { topic: "limits-at-infinity-and-horizontal-asymptotes-of-rational-functions", weight: 0.2 },
    { topic: "limits-of-exponential-functions", weight: 0.2 },
    { topic: "limits-of-logarithmic-functions", weight: 0.2 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "comparing-growth-rates",
      title: t("Comparing growth rates", "比较增长速度"),
      explanation: t(
        "As $x \\to \\infty$, these functions all tend to $\\infty$, but at very different rates:\n\n$$\\ln x \\ll \\sqrt{x} \\ll x \\ll x^{2} \\ll x^{5} \\ll 2^{x} \\ll e^{x} \\ll 3^{x}.$$\n\nAny power of $x$ beats a logarithm, and any exponential $b^{x}$ with $b > 1$ beats any power. In a quotient, if the faster function is on top the limit is $\\infty$; if it is underneath, the limit is $0$. Positive constant multiples do not change this.",
        "当 $x \\to \\infty$ 时，这些函数都趋于 $\\infty$，但速度差别很大：\n\n$$\\ln x \\ll \\sqrt{x} \\ll x \\ll x^{2} \\ll x^{5} \\ll 2^{x} \\ll e^{x} \\ll 3^{x}.$$\n\n$x$ 的任意正次幂都比对数增长快，底数 $b > 1$ 的指数函数 $b^{x}$ 比任意幂函数增长快。在商中，若增长更快的函数在分子，极限为 $\\infty$；若在分母，极限为 $0$。正的常数倍不改变结论。",
      ),
      generate(rng) {
        const [i, j] = rng.sample(range(0, growthClasses.length - 1), 2) as [number, number];
        const c = rng.pick([1, 1, 2, 3, 5, 10, 100]);
        const d = rng.pick([1, 1, 2, 4, 7, 1000]);
        const top = dot(cx(c, growthClasses[i]!));
        const bottom = dot(cx(d, growthClasses[j]!));
        const answer: LimitValue = i > j ? "inf" : Q.zero;
        return limitChoice(
          rng,
          t(`Find $${lim("\\infty")} \\frac{${top}}{${bottom}}$.`, `求 $${lim("\\infty")} \\frac{${top}}{${bottom}}$。`),
          answer,
          [Q.zero, Q.of(c, d), Q.one],
          i > j
            ? t(
                `$${growthClasses[i]}$ grows faster than $${growthClasses[j]}$, so the quotient tends to $\\infty$.`,
                `$${growthClasses[i]}$ 比 $${growthClasses[j]}$ 增长得快，所以商趋于 $\\infty$。`,
              )
            : t(
                `$${growthClasses[j]}$ grows faster than $${growthClasses[i]}$, so the quotient tends to $0$.`,
                `$${growthClasses[j]}$ 比 $${growthClasses[i]}$ 增长得快，所以商趋于 $0$。`,
              ),
        );
      },
    },
    {
      id: "limits-dominated-by-one-term",
      title: t("Limits dominated by one term", "由主导项决定的极限"),
      explanation: t(
        "In a sum, the fastest-growing term dominates. Divide top and bottom by it; every slower term then tends to $0$:\n\n$$\\lim_{x \\to \\infty} \\frac{3e^{x} + x^{5}}{2e^{x} - \\ln x} = \\lim_{x \\to \\infty} \\frac{3 + \\frac{x^{5}}{e^{x}}}{2 - \\frac{\\ln x}{e^{x}}} = \\frac{3}{2}.$$",
        "在和式中，增长最快的项起主导作用。分子分母同除以它，其余增长较慢的项都趋于 $0$：\n\n$$\\lim_{x \\to \\infty} \\frac{3e^{x} + x^{5}}{2e^{x} - \\ln x} = \\lim_{x \\to \\infty} \\frac{3 + \\frac{x^{5}}{e^{x}}}{2 - \\frac{\\ln x}{e^{x}}} = \\frac{3}{2}.$$",
      ),
      generate(rng) {
        const k = rng.int(2, growthClasses.length - 1);
        const dominant = growthClasses[k]!;
        const a = rng.nonZero(-6, 6);
        const b = rng.pick([1, 2, 3, 4, 5, -1, -2]);
        const [s1, s2] = [rng.int(0, k - 1), rng.int(0, k - 1)];
        const p = rng.nonZero(-5, 5);
        const q = rng.nonZero(-5, 5);
        const top = dot(poly([a, dominant], [p, growthClasses[s1]!]));
        const bottom = dot(rng.bool() ? poly([b, dominant], [q, growthClasses[s2]!]) : poly([q, growthClasses[s2]!], [b, dominant]));
        const answer = Q.of(a, b);
        return numberProblem({
          prompt: t(`Find $${lim("\\infty")} \\frac{${top}}{${bottom}}$.`, `求 $${lim("\\infty")} \\frac{${top}}{${bottom}}$。`),
          answer,
          wrong: [Q.of(p, q), Q.zero, inv(answer), frac(a + p, b + q)],
          solution: t(
            `$${dominant}$ grows fastest. Dividing top and bottom by it, the other terms tend to $0$, leaving $${ratio(a, b)}$.`,
            `$${dominant}$ 增长最快。分子分母同除以它，其余各项趋于 $0$，剩下 $${ratio(a, b)}$。`,
          ),
        });
      },
    },
  ],
};

/** evaluatingLimitsAtInfinityOfRadicalFunctions finds limits at infinity of functions with square roots. */
export const evaluatingLimitsAtInfinityOfRadicalFunctions: TopicDef = {
  id: "evaluating-limits-at-infinity-of-radical-functions",
  title: t("Evaluating Limits at Infinity of Radical Functions", "求根式函数在无穷远处的极限"),
  summary: t(
    "Find limits at ±∞ of quotients and differences containing square roots, using √(x²) = |x| and conjugates.",
    "利用 √(x²) = |x| 和共轭式，求含平方根的商与差在 ±∞ 处的极限。",
  ),
  prerequisites: [
    "limits-at-infinity-and-horizontal-asymptotes-of-rational-functions",
    "calculating-limits-of-radical-functions-using-conjugate-multiplication",
  ],
  encompasses: [
    { topic: "limits-at-infinity-and-horizontal-asymptotes-of-rational-functions", weight: 0.3 },
    { topic: "calculating-limits-of-radical-functions-using-conjugate-multiplication", weight: 0.3 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "quotients-with-roots-at-infinity",
      title: t("Quotients with roots", "含根式的商"),
      explanation: t(
        "For large $|x|$, $\\sqrt{k^{2}x^{2} + bx + c} \\approx \\sqrt{k^{2}x^{2}} = k|x|$. As $x \\to \\infty$, $|x| = x$; as $x \\to -\\infty$, $|x| = -x$. So\n\n$$\\lim_{x \\to \\infty} \\frac{\\sqrt{9x^{2} + 1}}{2x - 5} = \\frac{3}{2}, \\qquad \\lim_{x \\to -\\infty} \\frac{\\sqrt{9x^{2} + 1}}{2x - 5} = -\\frac{3}{2}.$$",
        "当 $|x|$ 很大时，$\\sqrt{k^{2}x^{2} + bx + c} \\approx \\sqrt{k^{2}x^{2}} = k|x|$。当 $x \\to \\infty$ 时 $|x| = x$；当 $x \\to -\\infty$ 时 $|x| = -x$。所以\n\n$$\\lim_{x \\to \\infty} \\frac{\\sqrt{9x^{2} + 1}}{2x - 5} = \\frac{3}{2}, \\qquad \\lim_{x \\to -\\infty} \\frac{\\sqrt{9x^{2} + 1}}{2x - 5} = -\\frac{3}{2}.$$",
      ),
      generate(rng) {
        const k = rng.int(1, 6);
        const m = rng.nonZero(-5, 5);
        const b = rng.int(-6, 6);
        const c = rng.int(1, 9);
        const d = rng.int(-7, 7);
        const root = `\\sqrt{${poly([k * k, "x^{2}"], [b, "x"], [c, ""])}}`;
        const line = poly([m, "x"], [d, ""]);
        const toPlus = rng.bool();
        const flip = rng.bool(0.3);
        const s = toPlus ? 1 : -1;
        const answer = flip ? Q.of(s * m, k) : Q.of(s * k, m);
        const target = toPlus ? "\\infty" : "-\\infty";
        return numberProblem({
          prompt: t(
            `Find $${lim(target)} ${flip ? `\\frac{${line}}{${root}}` : `\\frac{${root}}{${line}}`}$.`,
            `求 $${lim(target)} ${flip ? `\\frac{${line}}{${root}}` : `\\frac{${root}}{${line}}`}$。`,
          ),
          answer,
          wrong: [answer.neg(), inv(answer), Q.zero, flip ? Q.of(m, k * k) : Q.of(k * k, m)],
          solution: t(
            `For large $|x|$, $${root} \\approx ${k === 1 ? "" : k}|x|$, and $|x| = ${toPlus ? "x" : "-x"}$ as $x \\to ${target}$. Dividing, the limit is $${answer.toLatex()}$.`,
            `当 $|x|$ 很大时 $${root} \\approx ${k === 1 ? "" : k}|x|$，而当 $x \\to ${target}$ 时 $|x| = ${toPlus ? "x" : "-x"}$。相除得极限为 $${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "differences-with-roots-at-infinity",
      title: t("Differences with roots", "含根式的差"),
      explanation: t(
        "$\\sqrt{x^{2} + 6x} - x$ has the form $\\infty - \\infty$. Multiply and divide by the conjugate:\n\n$$\\sqrt{x^{2} + 6x} - x = \\frac{6x}{\\sqrt{x^{2} + 6x} + x} = \\frac{6}{\\sqrt{1 + \\frac{6}{x}} + 1} \\to \\frac{6}{2} = 3.$$\n\nIn general, $\\sqrt{k^{2}x^{2} + bx + c} - kx \\to \\frac{b}{2k}$ as $x \\to \\infty$.",
        "$\\sqrt{x^{2} + 6x} - x$ 是 $\\infty - \\infty$ 型。乘以并除以共轭式：\n\n$$\\sqrt{x^{2} + 6x} - x = \\frac{6x}{\\sqrt{x^{2} + 6x} + x} = \\frac{6}{\\sqrt{1 + \\frac{6}{x}} + 1} \\to \\frac{6}{2} = 3.$$\n\n一般地，当 $x \\to \\infty$ 时，$\\sqrt{k^{2}x^{2} + bx + c} - kx \\to \\frac{b}{2k}$。",
      ),
      generate(rng) {
        const k = rng.int(1, 4);
        const b = rng.nonZero(-12, 12);
        const c = rng.int(-9, 9);
        const d = rng.int(-4, 4);
        const root = `\\sqrt{${poly([k * k, "x^{2}"], [b, "x"], [c, ""])}}`;
        const rest = poly([-k, "x"], [-d, ""]);
        const answer = Q.of(b, 2 * k).sub(Q.of(d));
        return numberProblem({
          prompt: t(
            `Find $${lim("\\infty")} \\left(${root} ${rest.startsWith("-") ? `- ${rest.slice(1)}` : `+ ${rest}`}\\right)$.`,
            `求 $${lim("\\infty")} \\left(${root} ${rest.startsWith("-") ? `- ${rest.slice(1)}` : `+ ${rest}`}\\right)$。`,
          ),
          answer,
          wrong: [Q.zero, Q.of(b, k).sub(Q.of(d)), Q.of(b, 2 * k), Q.of(c, 2 * k).sub(Q.of(d))],
          solution: t(
            `Multiplying by the conjugate, $${root} - ${cx(k, "x")} = \\frac{${poly([b, "x"], [c, ""])}}{${root} + ${cx(k, "x")}} \\to \\frac{${b}}{${2 * k}}$.${d === 0 ? "" : ` ${d > 0 ? `Subtracting $${d}$` : `Adding $${-d}$`} gives $${answer.toLatex()}$.`}`,
            `乘以共轭式，$${root} - ${cx(k, "x")} = \\frac{${poly([b, "x"], [c, ""])}}{${root} + ${cx(k, "x")}} \\to \\frac{${b}}{${2 * k}}$。${d === 0 ? "" : `${d > 0 ? `再减去 $${d}$` : `再加上 $${-d}$`}，得 $${answer.toLatex()}$。`}`,
          ),
        });
      },
    },
  ],
};

/** theSqueezeTheorem finds limits by trapping a function between two others. */
export const theSqueezeTheorem: TopicDef = {
  id: "the-squeeze-theorem",
  title: t("The Squeeze Theorem", "夹逼定理"),
  summary: t(
    "Find a limit by trapping a function between two functions with the same limit, including oscillating functions times something that tends to zero.",
    "把函数夹在两个极限相同的函数之间来求极限，包括振荡函数乘以趋于零的因子的情形。",
  ),
  prerequisites: ["limits-of-trigonometric-functions", "the-sum-rule-for-limits"],
  encompasses: [{ topic: "the-sum-rule-for-limits", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "squeezing-between-two-functions",
      title: t("Squeezing between two functions", "夹在两个函数之间"),
      explanation: t(
        "**The squeeze theorem:** if $g(x) \\le f(x) \\le h(x)$ for $x$ near $a$, and $\\lim_{x \\to a} g(x) = \\lim_{x \\to a} h(x) = L$, then $\\lim_{x \\to a} f(x) = L$.\n\nFind the limits of the two bounds; if they agree, $f$ is squeezed to the same value.",
        "**夹逼定理：**若在 $a$ 附近 $g(x) \\le f(x) \\le h(x)$，且 $\\lim_{x \\to a} g(x) = \\lim_{x \\to a} h(x) = L$，则 $\\lim_{x \\to a} f(x) = L$。\n\n求出两个界的极限；若二者相等，$f$ 就被夹到同一个值。",
      ),
      generate(rng) {
        const a = rng.int(-3, 3);
        const L = rng.int(-8, 8);
        const m = rng.int(-3, 3);
        const p = rng.pick([1, 2, 3]);
        const q = rng.pick([1, 2, 4]);
        // g = L + m(x − a) − p(x − a)², h = L + m(x − a) + q(x − a)², expanded.
        const expand = (s: number) => poly([s, "x^{2}"], [m - 2 * s * a, "x"], [L - m * a + s * a * a, ""]);
        const g = expand(-p);
        const h = expand(q);
        return numberProblem({
          prompt: t(
            `For all $x$ near $${a}$, $$${g} \\le f(x) \\le ${h}.$$ Find $${lim(a)} f(x)$.`,
            `对 $${a}$ 附近的所有 $x$，$$${g} \\le f(x) \\le ${h}.$$ 求 $${lim(a)} f(x)$。`,
          ),
          answer: L,
          wrong: [L - m * a + q * a * a, 0, L + 1, a],
          solution: t(
            `Both bounds are polynomials; at $x = ${a}$ each equals $${L}$. So both tend to $${L}$, and by the squeeze theorem $${lim(a)} f(x) = ${L}$.`,
            `两个界都是多项式，在 $x = ${a}$ 处都等于 $${L}$。所以二者都趋于 $${L}$，由夹逼定理 $${lim(a)} f(x) = ${L}$。`,
          ),
        });
      },
    },
    {
      id: "squeezing-oscillating-functions",
      title: t("Oscillating functions", "振荡函数"),
      explanation: t(
        "Since $-1 \\le \\sin u \\le 1$, a bounded oscillation times something that tends to $0$ also tends to $0$:\n\n$$-x^{2} \\le x^{2}\\sin\\frac{1}{x} \\le x^{2} \\quad\\Rightarrow\\quad \\lim_{x \\to 0} x^{2}\\sin\\frac{1}{x} = 0.$$\n\nLikewise $\\frac{\\cos x}{x} \\to 0$ as $x \\to \\infty$, so $\\lim_{x \\to \\infty} \\frac{3x + \\cos x}{x} = 3$.",
        "因为 $-1 \\le \\sin u \\le 1$，有界的振荡乘以趋于 $0$ 的量也趋于 $0$：\n\n$$-x^{2} \\le x^{2}\\sin\\frac{1}{x} \\le x^{2} \\quad\\Rightarrow\\quad \\lim_{x \\to 0} x^{2}\\sin\\frac{1}{x} = 0.$$\n\n同样，当 $x \\to \\infty$ 时 $\\frac{\\cos x}{x} \\to 0$，所以 $\\lim_{x \\to \\infty} \\frac{3x + \\cos x}{x} = 3$。",
      ),
      generate(rng) {
        const fn = rng.pick(["\\sin", "\\cos"]);
        const c = rng.int(-6, 6);
        const form = rng.int(0, 2);
        if (form === 0) {
          const n = rng.int(1, 3);
          const k = rng.pick([1, 2, 3, 5]);
          const a = rng.pick([1, 2, 3, -1, -4]);
          const expr = `${cx(a, n === 1 ? "x" : `x^{${n}}`)}${fn}\\left(\\frac{${k}}{x}\\right)${c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${-c}`}`;
          return numberProblem({
            prompt: t(`Find $${lim(0)} \\left(${expr}\\right)$.`, `求 $${lim(0)} \\left(${expr}\\right)$。`),
            answer: c,
            wrong: [c + a, a * k, c + 1],
            solution: t(
              `$-|${cx(Math.abs(a), `x${n === 1 ? "" : `^{${n}}`}`)}| \\le ${cx(a, `x${n === 1 ? "" : `^{${n}}`}`)}${fn}\\left(\\frac{${k}}{x}\\right) \\le |${cx(Math.abs(a), `x${n === 1 ? "" : `^{${n}}`}`)}|$, and both bounds tend to $0$. So the product tends to $0$ and the limit is $${c}$.`,
              `$-|${cx(Math.abs(a), `x${n === 1 ? "" : `^{${n}}`}`)}| \\le ${cx(a, `x${n === 1 ? "" : `^{${n}}`}`)}${fn}\\left(\\frac{${k}}{x}\\right) \\le |${cx(Math.abs(a), `x${n === 1 ? "" : `^{${n}}`}`)}|$，两个界都趋于 $0$。所以乘积趋于 $0$，极限为 $${c}$。`,
            ),
          });
        }
        const p = rng.nonZero(-6, 6);
        const q = rng.pick([1, 2, 3, 4, -2]);
        const k = rng.pick([1, 2, 3]);
        const osc = `${fn} ${cx(k, "x")}`;
        const expr =
          form === 1
            ? `\\frac{${cx(p, "x")} + ${osc}}{${cx(q, "x")}}`
            : `\\frac{${osc}}{${cx(q, "x")}}${c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${-c}`}`;
        const answer = form === 1 ? Q.of(p, q) : Q.of(c);
        return numberProblem({
          prompt: t(
            `Find $${lim("\\infty")} ${form === 1 ? expr : `\\left(${expr}\\right)`}$.`,
            `求 $${lim("\\infty")} ${form === 1 ? expr : `\\left(${expr}\\right)`}$。`,
          ),
          answer,
          wrong: [Q.zero, Q.of(p + 1, q), Q.of(1, q), Q.of(c + 1)],
          solution: t(
            `$-1 \\le ${osc} \\le 1$, so $\\frac{${osc}}{${cx(q, "x")}}$ is squeezed between $\\pm\\frac{1}{${cx(Math.abs(q), "x")}}$, which both tend to $0$. So the limit is $${answer.toLatex()}$.`,
            `$-1 \\le ${osc} \\le 1$，所以 $\\frac{${osc}}{${cx(q, "x")}}$ 被夹在 $\\pm\\frac{1}{${cx(Math.abs(q), "x")}}$ 之间，二者都趋于 $0$。所以极限为 $${answer.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** kx writes the argument kx: "x", "-x", "3x". */
const kx = (k: number) => cx(k, "x");

/** ta writes the argument kx of a trigonometric function, in parentheses when negative: "3x", "(-2x)". */
const ta = (k: number) => (k < 0 ? `(${kx(k)})` : kx(k));

/** ratio writes a/b and its simplest form when they differ. */
function ratio(a: number, b: number): string {
  const raw = `\\frac{${a}}{${b}}`;
  const simple = Q.of(a, b).toLatex();
  return raw === simple ? raw : `${raw} = ${simple}`;
}

/** specialLimitsInvolvingSine uses sin x / x → 1. */
export const specialLimitsInvolvingSine: TopicDef = {
  id: "special-limits-involving-sine",
  title: t("Special Limits Involving Sine", "与正弦有关的特殊极限"),
  summary: t(
    "Use lim sin x / x = 1 to find limits of quotients of sines, tangents and multiples of x.",
    "利用 lim sin x / x = 1 求正弦、正切与 x 的倍数之商的极限。",
  ),
  prerequisites: ["the-squeeze-theorem", "the-product-and-quotient-rules-for-limits"],
  encompasses: [{ topic: "the-squeeze-theorem", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "limits-of-sin-ax-over-bx",
      title: t("Limits of sin ax over bx", "sin ax 与 bx 之商的极限"),
      explanation: t(
        "By the squeeze theorem (with $\\cos x \\le \\frac{\\sin x}{x} \\le 1$ near $0$),\n\n$$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1.$$\n\nFor $\\frac{\\sin ax}{bx}$, make the argument appear underneath: $\\frac{\\sin ax}{bx} = \\frac{a}{b} \\cdot \\frac{\\sin ax}{ax} \\to \\frac{a}{b}$. Likewise $\\frac{bx}{\\sin ax} \\to \\frac{b}{a}$.",
        "由夹逼定理（在 $0$ 附近 $\\cos x \\le \\frac{\\sin x}{x} \\le 1$），\n\n$$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1.$$\n\n对于 $\\frac{\\sin ax}{bx}$，在分母凑出相同的自变量：$\\frac{\\sin ax}{bx} = \\frac{a}{b} \\cdot \\frac{\\sin ax}{ax} \\to \\frac{a}{b}$。同理 $\\frac{bx}{\\sin ax} \\to \\frac{b}{a}$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-7, 7);
        const b = rng.nonZero(-6, 6);
        const flip = rng.bool(0.3);
        const s = `\\sin ${ta(a)}`;
        const answer = flip ? Q.of(b, a) : Q.of(a, b);
        return numberProblem({
          prompt: t(
            `Find $${lim(0)} ${flip ? `\\frac{${kx(b)}}{${s}}` : `\\frac{${s}}{${kx(b)}}`}$.`,
            `求 $${lim(0)} ${flip ? `\\frac{${kx(b)}}{${s}}` : `\\frac{${s}}{${kx(b)}}`}$。`,
          ),
          answer,
          wrong: [Q.one, Q.zero, inv(answer), answer.neg()],
          solution: t(
            `Write it as $\\frac{${flip ? `${b}` : `${a}`}}{${flip ? `${a}` : `${b}`}} \\cdot ${flip ? `\\frac{${kx(a)}}{${s}}` : `\\frac{${s}}{${kx(a)}}`}$; the second factor tends to $1$, so the limit is $${answer.toLatex()}$.`,
            `写成 $\\frac{${flip ? `${b}` : `${a}`}}{${flip ? `${a}` : `${b}`}} \\cdot ${flip ? `\\frac{${kx(a)}}{${s}}` : `\\frac{${s}}{${kx(a)}}`}$；第二个因子趋于 $1$，所以极限为 $${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "limits-of-quotients-of-sines-and-tangents",
      title: t("Quotients of sines and tangents", "正弦与正切之商"),
      explanation: t(
        "Since $\\tan x = \\frac{\\sin x}{\\cos x}$ and $\\cos x \\to 1$, also $\\frac{\\tan x}{x} \\to 1$. For a quotient of two such functions, divide top and bottom by $x$:\n\n$$\\lim_{x \\to 0} \\frac{\\sin 5x}{\\tan 2x} = \\lim_{x \\to 0} \\frac{5 \\cdot \\frac{\\sin 5x}{5x}}{2 \\cdot \\frac{\\tan 2x}{2x}} = \\frac{5}{2}.$$",
        "因为 $\\tan x = \\frac{\\sin x}{\\cos x}$ 且 $\\cos x \\to 1$，所以 $\\frac{\\tan x}{x} \\to 1$。对于这类函数之商，分子分母同除以 $x$：\n\n$$\\lim_{x \\to 0} \\frac{\\sin 5x}{\\tan 2x} = \\lim_{x \\to 0} \\frac{5 \\cdot \\frac{\\sin 5x}{5x}}{2 \\cdot \\frac{\\tan 2x}{2x}} = \\frac{5}{2}.$$",
      ),
      generate(rng) {
        const [a, b] = rng.sample([1, 2, 3, 4, 5, 6, 7, 9], 2) as [number, number];
        const sa = rng.bool(0.3) ? -a : a;
        const top = `${rng.pick(["\\sin", "\\tan"])} ${ta(sa)}`;
        const bottomFn = rng.pick(["\\sin", "\\tan", "x"]);
        const c = rng.pick([1, 1, 2, 3]);
        const bottom = bottomFn === "x" ? kx(b) : `${c === 1 ? "" : c}${bottomFn} ${ta(b)}`;
        const answer = bottomFn === "x" ? Q.of(sa, b) : Q.of(sa, c * b);
        return numberProblem({
          prompt: t(`Find $${lim(0)} \\frac{${top}}{${bottom}}$.`, `求 $${lim(0)} \\frac{${top}}{${bottom}}$。`),
          answer,
          wrong: [Q.one, inv(answer), Q.zero, answer.neg()],
          solution: t(
            `Near $0$, $${top} \\approx ${kx(sa)}$ and $${bottom} \\approx ${bottomFn === "x" ? kx(b) : kx(c * b)}$, since $\\frac{\\sin u}{u} \\to 1$ and $\\frac{\\tan u}{u} \\to 1$. So the limit is $${ratio(sa, bottomFn === "x" ? b : c * b)}$.`,
            `在 $0$ 附近，由 $\\frac{\\sin u}{u} \\to 1$ 和 $\\frac{\\tan u}{u} \\to 1$，$${top} \\approx ${kx(sa)}$，$${bottom} \\approx ${bottomFn === "x" ? kx(b) : kx(c * b)}$。所以极限为 $${ratio(sa, bottomFn === "x" ? b : c * b)}$。`,
          ),
        });
      },
    },
  ],
};

/** evaluatingSpecialLimitsInvolvingSineUsingASubstitution applies sin u / u → 1 with u → 0 away from x = 0. */
export const evaluatingSpecialLimitsInvolvingSineUsingASubstitution: TopicDef = {
  id: "evaluating-special-limits-involving-sine-using-a-substitution",
  title: t("Evaluating Special Limits Involving Sine Using a Substitution", "用换元法求与正弦有关的特殊极限"),
  summary: t(
    "Use a substitution u = g(x) with u → 0 to apply lim sin u / u = 1 at points other than 0.",
    "用换元 u = g(x)（u → 0），在 0 以外的点运用 lim sin u / u = 1。",
  ),
  prerequisites: ["special-limits-involving-sine", "calculating-limits-of-rational-functions-by-factoring"],
  encompasses: [
    { topic: "special-limits-involving-sine", weight: 0.4 },
    { topic: "calculating-limits-of-rational-functions-by-factoring", weight: 0.2 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "substituting-a-shifted-argument",
      title: t("A shifted argument", "平移后的自变量"),
      explanation: t(
        "If $u = x - a$, then $u \\to 0$ as $x \\to a$, so\n\n$$\\lim_{x \\to a} \\frac{\\sin(x - a)}{x - a} = \\lim_{u \\to 0} \\frac{\\sin u}{u} = 1.$$\n\nWith multiples: $\\lim_{x \\to 2} \\frac{\\sin(3x - 6)}{x - 2} = \\lim_{u \\to 0} \\frac{\\sin 3u}{u} = 3$.",
        "令 $u = x - a$，则 $x \\to a$ 时 $u \\to 0$，所以\n\n$$\\lim_{x \\to a} \\frac{\\sin(x - a)}{x - a} = \\lim_{u \\to 0} \\frac{\\sin u}{u} = 1.$$\n\n带倍数时：$\\lim_{x \\to 2} \\frac{\\sin(3x - 6)}{x - 2} = \\lim_{u \\to 0} \\frac{\\sin 3u}{u} = 3$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-5, 5);
        const k = rng.nonZero(-5, 5);
        const m = rng.pick([1, 1, 2, 3, 4, -1, -2]);
        const top = `\\sin(${poly([k, "x"], [-k * a, ""])})`;
        const bottom = poly([m, "x"], [-m * a, ""]);
        const answer = Q.of(k, m);
        return numberProblem({
          prompt: t(`Find $${lim(a)} \\frac{${top}}{${bottom}}$.`, `求 $${lim(a)} \\frac{${top}}{${bottom}}$。`),
          answer,
          wrong: [Q.one, Q.zero, inv(answer), Q.of(k * a, m)],
          solution: t(
            `Let $u = ${bare(a)}$, so $u \\to 0$. The limit becomes $${lim(0, undefined, "u")} \\frac{\\sin ${ta(k).replace("x", "u")}}{${kx(m).replace("x", "u")}} = ${answer.toLatex()}$.`,
            `令 $u = ${bare(a)}$，则 $u \\to 0$。极限化为 $${lim(0, undefined, "u")} \\frac{\\sin ${ta(k).replace("x", "u")}}{${kx(m).replace("x", "u")}} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "substituting-with-a-factored-denominator",
      title: t("Factoring around the substitution", "结合因式分解换元"),
      explanation: t(
        "Split off the factor that matches the sine's argument:\n\n$$\\lim_{x \\to 3} \\frac{\\sin(x - 3)}{x^{2} - x - 6} = \\lim_{x \\to 3} \\frac{\\sin(x - 3)}{x - 3} \\cdot \\frac{1}{x + 2} = 1 \\cdot \\frac{1}{5} = \\frac{1}{5}.$$\n\nSimilarly $\\frac{\\sin(x^{2} - 9)}{x - 3} = \\frac{\\sin(x^{2} - 9)}{x^{2} - 9} \\cdot (x + 3) \\to 6$.",
        "拆出与正弦的自变量相同的因式：\n\n$$\\lim_{x \\to 3} \\frac{\\sin(x - 3)}{x^{2} - x - 6} = \\lim_{x \\to 3} \\frac{\\sin(x - 3)}{x - 3} \\cdot \\frac{1}{x + 2} = 1 \\cdot \\frac{1}{5} = \\frac{1}{5}.$$\n\n同理 $\\frac{\\sin(x^{2} - 9)}{x - 3} = \\frac{\\sin(x^{2} - 9)}{x^{2} - 9} \\cdot (x + 3) \\to 6$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-5, 5);
        if (rng.bool(0.35)) {
          const top = `\\sin(${poly([1, "x^{2}"], [-a * a, ""])})`;
          const answer = 2 * a;
          return numberProblem({
            prompt: t(`Find $${lim(a)} \\frac{${top}}{${bare(a)}}$.`, `求 $${lim(a)} \\frac{${top}}{${bare(a)}}$。`),
            answer,
            wrong: [1, 0, a, a * a],
            solution: t(
              `Write it as $\\frac{${top}}{x^{2} - ${a * a}} \\cdot ${fac(-a)}$. The first factor tends to $1$ and the second to $${2 * a}$, so the limit is $${answer}$.`,
              `写成 $\\frac{${top}}{x^{2} - ${a * a}} \\cdot ${fac(-a)}$。第一个因子趋于 $1$，第二个趋于 $${2 * a}$，所以极限为 $${answer}$。`,
            ),
          });
        }
        const r = rng.pick(range(-6, 6).filter((v) => v !== a));
        const k = rng.pick([1, 1, 2, 3, -1]);
        const top = `\\sin(${poly([k, "x"], [-k * a, ""])})`;
        const bottom = quad(1, a, r);
        const answer = Q.of(k, a - r);
        return numberProblem({
          prompt: t(`Find $${lim(a)} \\frac{${top}}{${bottom}}$.`, `求 $${lim(a)} \\frac{${top}}{${bottom}}$。`),
          answer,
          wrong: [Q.of(k), Q.zero, Q.of(a - r, k), frac(k, a + r)],
          solution: t(
            `$${bottom} = ${fac(a)}${fac(r)}$. Write the quotient as $\\frac{${top}}{${bare(a)}} \\cdot \\frac{1}{${bare(r)}}$; the first factor tends to $${k}$ and the second to $${Q.of(1, a - r).toLatex()}$, so the limit is $${answer.toLatex()}$.`,
            `$${bottom} = ${fac(a)}${fac(r)}$。把商写成 $\\frac{${top}}{${bare(a)}} \\cdot \\frac{1}{${bare(r)}}$；第一个因子趋于 $${k}$，第二个趋于 $${Q.of(1, a - r).toLatex()}$，所以极限为 $${answer.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** specialLimitsInvolvingCosine uses (1 − cos x)/x → 0 and (1 − cos x)/x² → 1/2. */
export const specialLimitsInvolvingCosine: TopicDef = {
  id: "special-limits-involving-cosine",
  title: t("Special Limits Involving Cosine", "与余弦有关的特殊极限"),
  summary: t(
    "Use lim (1 − cos x)/x = 0 and lim (1 − cos x)/x² = 1/2 to find limits involving cosine.",
    "利用 lim (1 − cos x)/x = 0 与 lim (1 − cos x)/x² = 1/2 求含余弦的极限。",
  ),
  prerequisites: ["special-limits-involving-sine", "calculating-limits-using-trigonometric-identities"],
  encompasses: [
    { topic: "special-limits-involving-sine", weight: 0.3 },
    { topic: "calculating-limits-using-trigonometric-identities", weight: 0.2 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "limits-of-one-minus-cosine",
      title: t("Limits of 1 − cos ax", "1 − cos ax 的极限"),
      explanation: t(
        "Multiplying by $1 + \\cos x$ gives $\\frac{1 - \\cos x}{x} = \\frac{\\sin x}{x} \\cdot \\frac{\\sin x}{1 + \\cos x} \\to 1 \\cdot 0 = 0$, and\n\n$$\\lim_{x \\to 0} \\frac{1 - \\cos x}{x^{2}} = \\lim_{x \\to 0} \\left(\\frac{\\sin x}{x}\\right)^{2} \\frac{1}{1 + \\cos x} = \\frac{1}{2}.$$\n\nWith $ax$ in place of $x$: $\\frac{1 - \\cos ax}{bx^{2}} \\to \\frac{a^{2}}{2b}$.",
        "乘以 $1 + \\cos x$ 得 $\\frac{1 - \\cos x}{x} = \\frac{\\sin x}{x} \\cdot \\frac{\\sin x}{1 + \\cos x} \\to 1 \\cdot 0 = 0$，以及\n\n$$\\lim_{x \\to 0} \\frac{1 - \\cos x}{x^{2}} = \\lim_{x \\to 0} \\left(\\frac{\\sin x}{x}\\right)^{2} \\frac{1}{1 + \\cos x} = \\frac{1}{2}.$$\n\n把 $x$ 换成 $ax$：$\\frac{1 - \\cos ax}{bx^{2}} \\to \\frac{a^{2}}{2b}$。",
      ),
      generate(rng) {
        const a = rng.int(1, 6);
        const b = rng.nonZero(-5, 5);
        const flip = rng.bool();
        const top = flip ? `\\cos ${ta(a)} - 1` : `1 - \\cos ${ta(a)}`;
        const square = rng.bool(0.75);
        const bottom = cx(b, square ? "x^{2}" : "x");
        const answer = square ? Q.of((flip ? -1 : 1) * a * a, 2 * b) : Q.zero;
        return numberProblem({
          prompt: t(`Find $${lim(0)} \\frac{${top}}{${bottom}}$.`, `求 $${lim(0)} \\frac{${top}}{${bottom}}$。`),
          answer,
          wrong: [Q.of(a, 2 * b), Q.of(a * a, b), Q.of(1, 2), square ? Q.zero : Q.of(a * a, 2 * b)],
          solution: square
            ? t(
                `$\\frac{1 - \\cos u}{u^{2}} \\to \\frac{1}{2}$ with $u = ${kx(a)}$, and $u^{2} = ${cx(a * a, "x^{2}")}$. So the limit is $${flip ? "-" : ""}\\frac{${a * a}}{2 \\cdot ${paren(b)}} = ${answer.toLatex()}$.`,
                `取 $u = ${kx(a)}$，有 $\\frac{1 - \\cos u}{u^{2}} \\to \\frac{1}{2}$，且 $u^{2} = ${cx(a * a, "x^{2}")}$。所以极限为 $${flip ? "-" : ""}\\frac{${a * a}}{2 \\cdot ${paren(b)}} = ${answer.toLatex()}$。`,
              )
            : t(
                `$\\frac{1 - \\cos u}{u} \\to 0$ with $u = ${kx(a)}$, so the limit is $0$.`,
                `取 $u = ${kx(a)}$，有 $\\frac{1 - \\cos u}{u} \\to 0$，所以极限为 $0$。`,
              ),
        });
      },
    },
    {
      id: "combining-cosine-and-sine-limits",
      title: t("Combining with sine limits", "与正弦极限结合"),
      explanation: t(
        "Replace each factor by its behavior near $0$: $1 - \\cos ax \\approx \\frac{a^{2}x^{2}}{2}$, $\\sin bx \\approx bx$ and $1 - \\cos bx \\approx \\frac{b^{2}x^{2}}{2}$. So\n\n$$\\lim_{x \\to 0} \\frac{1 - \\cos 4x}{x \\sin 2x} = \\frac{16/2}{2} = 4, \\qquad \\lim_{x \\to 0} \\frac{1 - \\cos 3x}{1 - \\cos x} = 9.$$",
        "把每个因子换成它在 $0$ 附近的近似：$1 - \\cos ax \\approx \\frac{a^{2}x^{2}}{2}$，$\\sin bx \\approx bx$，$1 - \\cos bx \\approx \\frac{b^{2}x^{2}}{2}$。所以\n\n$$\\lim_{x \\to 0} \\frac{1 - \\cos 4x}{x \\sin 2x} = \\frac{16/2}{2} = 4, \\qquad \\lim_{x \\to 0} \\frac{1 - \\cos 3x}{1 - \\cos x} = 9.$$",
      ),
      generate(rng) {
        const [a, b] = rng.sample([1, 2, 3, 4, 5, 6], 2) as [number, number];
        const form = rng.int(0, 2);
        const top = `1 - \\cos ${ta(a)}`;
        const bottom = form === 0 ? `x \\sin ${ta(b)}` : form === 1 ? `\\sin^{2} ${kx(b)}` : `1 - \\cos ${ta(b)}`;
        const answer = form === 0 ? Q.of(a * a, 2 * b) : form === 1 ? Q.of(a * a, 2 * b * b) : Q.of(a * a, b * b);
        const approx = form === 0 ? cx(b, "x^{2}") : form === 1 ? cx(b * b, "x^{2}") : `\\frac{${b * b}x^{2}}{2}`;
        return numberProblem({
          prompt: t(`Find $${lim(0)} \\frac{${top}}{${bottom}}$.`, `求 $${lim(0)} \\frac{${top}}{${bottom}}$。`),
          answer,
          wrong: [Q.of(a, b), Q.zero, inv(answer), Q.of(a * a, b)],
          solution: t(
            `Near $0$, $${top} \\approx \\frac{${cx(a * a, "x^{2}")}}{2}$ and $${bottom} \\approx ${approx}$. Dividing, the limit is $${answer.toLatex()}$.`,
            `在 $0$ 附近，$${top} \\approx \\frac{${cx(a * a, "x^{2}")}}{2}$，$${bottom} \\approx ${approx}$。相除得极限为 $${answer.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** limitsInvolvingTheExponentialFunction finds limits of the form (1 + a/x)^{bx}. */
export const limitsInvolvingTheExponentialFunction: TopicDef = {
  id: "limits-involving-the-exponential-function",
  title: t("Limits Involving the Exponential Function", "与指数函数有关的极限"),
  summary: t(
    "Use lim (1 + 1/x)^x = e to find limits of the form (1 + a/x)^{bx} and (1 + ax)^{b/x}.",
    "利用 lim (1 + 1/x)^x = e 求形如 (1 + a/x)^{bx} 与 (1 + ax)^{b/x} 的极限。",
  ),
  prerequisites: ["limits-of-exponential-functions", "continuously-compounded-interest"],
  encompasses: [
    { topic: "limits-of-exponential-functions", weight: 0.3 },
    { topic: "continuously-compounded-interest", weight: 0.2 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "limits-of-one-plus-a-over-x",
      title: t("Limits of (1 + a/x)^(bx)", "(1 + a/x)^(bx) 的极限"),
      explanation: t(
        "The number $e$ is the limit\n\n$$e = \\lim_{x \\to \\infty} \\left(1 + \\frac{1}{x}\\right)^{x}.$$\n\nSubstituting $x = au$ gives $\\left(1 + \\frac{a}{x}\\right)^{x} \\to e^{a}$, and raising to the power $b$: $\\lim_{x \\to \\infty} \\left(1 + \\frac{a}{x}\\right)^{bx} = e^{ab}$.",
        "数 $e$ 定义为极限\n\n$$e = \\lim_{x \\to \\infty} \\left(1 + \\frac{1}{x}\\right)^{x}.$$\n\n代换 $x = au$ 得 $\\left(1 + \\frac{a}{x}\\right)^{x} \\to e^{a}$，再取 $b$ 次方：$\\lim_{x \\to \\infty} \\left(1 + \\frac{a}{x}\\right)^{bx} = e^{ab}$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-5, 5);
        const b = rng.pick([1, 2, 3, 4, -1, -2]);
        const c = rng.pick([1, 1, 2, 3]);
        const answer = Q.of(a * b, c);
        const frac = c === 1 ? `\\frac{${Math.abs(a)}}{x}` : `\\frac{${Math.abs(a)}}{${c}x}`;
        const base = `\\left(1 ${a < 0 ? "-" : "+"} ${frac}\\right)^{${kx(b)}}`;
        const e = (q: Q) => (q.eq(Q.one) ? "e" : `e^{${q.toLatex()}}`);
        return functionProblem({
          prompt: t(`Find $${lim("\\infty")} ${base}$.`, `求 $${lim("\\infty")} ${base}$。`),
          answer: e(answer),
          wrong: ["1", e(Q.of(a, c * b)), e(Q.of(a + b, c)), e(answer.neg())],
          solution: t(
            `$\\left(1 ${a < 0 ? "-" : "+"} ${frac}\\right)^{x} \\to ${e(Q.of(a, c))}$, and raising to the power $${b}$ gives $${e(answer)}$.`,
            `$\\left(1 ${a < 0 ? "-" : "+"} ${frac}\\right)^{x} \\to ${e(Q.of(a, c))}$，再取 $${b}$ 次方得 $${e(answer)}$。`,
          ),
        });
      },
    },
    {
      id: "limits-of-one-plus-ax-to-the-b-over-x",
      title: t("Limits of (1 + ax)^(b/x)", "(1 + ax)^(b/x) 的极限"),
      explanation: t(
        "Substituting $u = \\frac{1}{x}$ turns $\\lim_{x \\to \\infty}$ into $\\lim_{u \\to 0^{+}}$, and the limit also holds from the left:\n\n$$\\lim_{x \\to 0} (1 + x)^{1/x} = e, \\qquad \\lim_{x \\to 0} (1 + ax)^{b/x} = e^{ab}.$$",
        "代换 $u = \\frac{1}{x}$ 把 $\\lim_{x \\to \\infty}$ 化为 $\\lim_{u \\to 0^{+}}$，而从左侧趋近时结论同样成立：\n\n$$\\lim_{x \\to 0} (1 + x)^{1/x} = e, \\qquad \\lim_{x \\to 0} (1 + ax)^{b/x} = e^{ab}.$$",
      ),
      generate(rng) {
        const a = rng.nonZero(-6, 6);
        const b = rng.nonZero(-4, 4);
        const c = rng.pick([1, 1, 2, 3]);
        const answer = Q.of(a * b, c);
        const e = (q: Q) => (q.eq(Q.one) ? "e" : `e^{${q.toLatex()}}`);
        const expr = `\\left(1 ${a < 0 ? "-" : "+"} ${cx(Math.abs(a), "x")}\\right)^{\\frac{${b}}{${c === 1 ? "" : c}x}}`;
        return functionProblem({
          prompt: t(`Find $${lim(0)} ${expr}$.`, `求 $${lim(0)} ${expr}$。`),
          answer: e(answer),
          wrong: ["1", e(Q.of(b, c)), e(Q.of(a + b, c)), e(answer.neg())],
          solution: t(
            `$(1 ${a < 0 ? "-" : "+"} ${cx(Math.abs(a), "x")})^{1/x} \\to ${e(Q.of(a))}$, and raising to the power $${Q.of(b, c).toLatex()}$ gives $${e(answer)}$.`,
            `$(1 ${a < 0 ? "-" : "+"} ${cx(Math.abs(a), "x")})^{1/x} \\to ${e(Q.of(a))}$，再取 $${Q.of(b, c).toLatex()}$ 次方得 $${e(answer)}$。`,
          ),
        });
      },
    },
  ],
};

/** furtherLimitsInvolvingTheExponentialFunction uses (e^x − 1)/x → 1. */
export const furtherLimitsInvolvingTheExponentialFunction: TopicDef = {
  id: "further-limits-involving-the-exponential-function",
  title: t("Further Limits Involving the Exponential Function", "与指数函数有关的进一步极限"),
  summary: t(
    "Use lim (eˣ − 1)/x = 1 to find limits of quotients containing e^{ax} − 1.",
    "利用 lim (eˣ − 1)/x = 1 求含 e^{ax} − 1 的商的极限。",
  ),
  prerequisites: ["limits-involving-the-exponential-function", "special-limits-involving-sine"],
  encompasses: [{ topic: "limits-involving-the-exponential-function", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "limits-of-e-to-the-ax-minus-one",
      title: t("Limits of (e^(ax) − 1)/(bx)", "(e^(ax) − 1)/(bx) 的极限"),
      explanation: t(
        "A standard limit is\n\n$$\\lim_{x \\to 0} \\frac{e^{x} - 1}{x} = 1,$$\n\nso near $0$, $e^{ax} - 1 \\approx ax$. Hence $\\frac{e^{ax} - 1}{bx} \\to \\frac{a}{b}$ and $\\frac{e^{ax} - e^{bx}}{cx} = \\frac{(e^{ax} - 1) - (e^{bx} - 1)}{cx} \\to \\frac{a - b}{c}$.",
        "一个标准极限是\n\n$$\\lim_{x \\to 0} \\frac{e^{x} - 1}{x} = 1,$$\n\n所以在 $0$ 附近 $e^{ax} - 1 \\approx ax$。因此 $\\frac{e^{ax} - 1}{bx} \\to \\frac{a}{b}$，$\\frac{e^{ax} - e^{bx}}{cx} = \\frac{(e^{ax} - 1) - (e^{bx} - 1)}{cx} \\to \\frac{a - b}{c}$。",
      ),
      generate(rng) {
        const [a, b] = rng.sample([-4, -3, -2, -1, 1, 2, 3, 4, 5], 2) as [number, number];
        const c = rng.nonZero(-5, 5);
        const two = rng.bool(0.4);
        const top = two ? `e^{${kx(a)}} - e^{${kx(b)}}` : `e^{${kx(a)}} - 1`;
        const answer = two ? Q.of(a - b, c) : Q.of(a, c);
        return numberProblem({
          prompt: t(`Find $${lim(0)} \\frac{${top}}{${kx(c)}}$.`, `求 $${lim(0)} \\frac{${top}}{${kx(c)}}$。`),
          answer,
          wrong: [Q.zero, Q.one, inv(answer), two ? Q.of(a + b, c) : Q.of(a - 1, c)],
          solution: t(
            two
              ? `Write the top as $(e^{${kx(a)}} - 1) - (e^{${kx(b)}} - 1) \\approx ${kx(a)} - ${b < 0 ? `(${kx(b)})` : kx(b)} = ${kx(a - b)}$. Dividing by $${kx(c)}$ gives $${answer.toLatex()}$.`
              : `Near $0$, $e^{${kx(a)}} - 1 \\approx ${kx(a)}$, so the limit is $${ratio(a, c)}$.`,
            two
              ? `把分子写成 $(e^{${kx(a)}} - 1) - (e^{${kx(b)}} - 1) \\approx ${kx(a)} - ${b < 0 ? `(${kx(b)})` : kx(b)} = ${kx(a - b)}$。除以 $${kx(c)}$ 得 $${answer.toLatex()}$。`
              : `在 $0$ 附近 $e^{${kx(a)}} - 1 \\approx ${kx(a)}$，所以极限为 $${ratio(a, c)}$。`,
          ),
        });
      },
    },
    {
      id: "combining-exponential-and-sine-limits",
      title: t("Combining with other special limits", "与其他特殊极限结合"),
      explanation: t(
        "Replace each factor by its linear approximation near $0$: $e^{ax} - 1 \\approx ax$, $\\sin bx \\approx bx$, $\\tan bx \\approx bx$. So\n\n$$\\lim_{x \\to 0} \\frac{e^{6x} - 1}{\\sin 2x} = \\frac{6}{2} = 3, \\qquad \\lim_{x \\to 0} \\frac{e^{2x} - 1}{e^{5x} - 1} = \\frac{2}{5}.$$",
        "把每个因子换成它在 $0$ 附近的线性近似：$e^{ax} - 1 \\approx ax$，$\\sin bx \\approx bx$，$\\tan bx \\approx bx$。所以\n\n$$\\lim_{x \\to 0} \\frac{e^{6x} - 1}{\\sin 2x} = \\frac{6}{2} = 3, \\qquad \\lim_{x \\to 0} \\frac{e^{2x} - 1}{e^{5x} - 1} = \\frac{2}{5}.$$",
      ),
      generate(rng) {
        const [a, b] = rng.sample([-3, -2, -1, 1, 2, 3, 4, 5, 6, 7], 2) as [number, number];
        const bottomFn = rng.pick(["\\sin", "\\tan", "e"]);
        const bottom = bottomFn === "e" ? `e^{${kx(b)}} - 1` : `${bottomFn} ${ta(b)}`;
        const answer = Q.of(a, b);
        return numberProblem({
          prompt: t(`Find $${lim(0)} \\frac{e^{${kx(a)}} - 1}{${bottom}}$.`, `求 $${lim(0)} \\frac{e^{${kx(a)}} - 1}{${bottom}}$。`),
          answer,
          wrong: [Q.zero, Q.one, inv(answer), answer.neg()],
          solution: t(
            `Near $0$, $e^{${kx(a)}} - 1 \\approx ${kx(a)}$ and $${bottom} \\approx ${kx(b)}$, so the limit is $${ratio(a, b)}$.`,
            `在 $0$ 附近，$e^{${kx(a)}} - 1 \\approx ${kx(a)}$，$${bottom} \\approx ${kx(b)}$，所以极限为 $${ratio(a, b)}$。`,
          ),
        });
      },
    },
  ],
};

/** calculusILimitTechniqueTopics are the topics of Calculus I modules 2.5 and 2.6. */
export const calculusILimitTechniqueTopics: readonly TopicDef[] = [
  calculatingLimitsOfRationalFunctionsByFactoring,
  limitsOfAbsoluteValueFunctions,
  calculatingLimitsOfRadicalFunctionsUsingConjugateMultiplication,
  calculatingLimitsUsingTrigonometricIdentities,
  limitsAtInfinityAndHorizontalAsymptotesOfRationalFunctions,
  evaluatingLimitsAtInfinityByComparingRelativeMagnitudesOfFunctions,
  evaluatingLimitsAtInfinityOfRadicalFunctions,
  theSqueezeTheorem,
  specialLimitsInvolvingSine,
  evaluatingSpecialLimitsInvolvingSineUsingASubstitution,
  specialLimitsInvolvingCosine,
  limitsInvolvingTheExponentialFunction,
  furtherLimitsInvolvingTheExponentialFunction,
];
