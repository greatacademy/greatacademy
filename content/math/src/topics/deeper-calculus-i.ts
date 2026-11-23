// Further knowledge points for topics of Calculus I, each a skill the topic's own
// points leave out. See `deeperCalculusIPoints`.

import type { KnowledgePointDef, Rng, Text } from "@ga/content";
import { t } from "@ga/content";
import { dec, poly, Q } from "@ga/subject-math";
import { calculusDrawings1 } from "../explanation-drawings-calculus-1.ts";
import { calculusDrawings2 } from "../explanation-drawings-calculus-2.ts";
import { calculusDrawings3 } from "../explanation-drawings-calculus-3.ts";

import { numberProblem, why } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { piLatex, power, range, table } from "./calculus-common.ts";

/** walk writes a solution as labelled steps, each a title and what it says in both languages, followed by a check that takes a second route. */
function walk(parts: readonly (readonly [en: string, zh: string, sayEn: string, sayZh: string])[], check: readonly [string, string]): Text {
  const write = (zh: boolean) =>
    `${parts.map(([en, z, se, sz], i) => `${stepLabel(i + 1, en, z)[zh ? "zh-CN" : "en"]} ${zh ? sz : se}`).join("\n\n")}\n\n${zh ? `**检验。** ${check[1]}` : `**Check.** ${check[0]}`}`;
  return t(write(false), write(true));
}

/** num writes a value rounded to three decimal places, without trailing zeros. */
const num = (v: number) => dec(Q.of(Math.round(v * 1000) || 0, 1000));

/** approx writes " ≈ 0.833" after a fraction that is not a whole number, and nothing after a whole number. */
const approx = (q: Q) => (q.isInteger() ? "" : ` \\approx ${num(q.toNumber())}`);

/** around gives a − 0.01, a − 0.001, a + 0.001 and a + 0.01, rounded to three decimal places. */
const around = (a: number) => [-0.01, -0.001, 0.001, 0.01].map((d) => Math.round((a + d) * 1000) / 1000);

/** valueTable tabulates functions at some x-values to three decimal places; each row is a name in LaTeX and a function. */
function valueTable(xs: readonly number[], rows: readonly (readonly [string, (x: number) => number])[]): string {
  return table(["$x$", ...xs.map((x) => `$${x}$`)], ...rows.map(([name, f]) => [`$${name}$`, ...xs.map((x) => `$${num(f(x))}$`)]));
}

/** binomial is the binomial coefficient n choose k. */
const binomial = (n: number, k: number): number => (k === 0 ? 1 : (binomial(n, k - 1) * (n - k + 1)) / k);

/** nonzero picks a nonzero integer from -r to r. */
const nonzero = (rng: Rng, r: number) => rng.pick([...Array(2 * r + 1).keys()].map((i) => i - r).filter((i) => i !== 0));
/** inParens puts a negative number in parentheses, for use inside a sum. */
const inParens = (n: number) => (n < 0 ? `(${n})` : `${n}`);
/** different picks an integer from lo to hi other than the one given. */
const different = (rng: Rng, lo: number, hi: number, other: number) =>
  rng.pick([...Array(hi - lo + 1).keys()].map((i) => i + lo).filter((i) => i !== other));

const coefficientForPiecewiseLimit: KnowledgePointDef = {
  id: "a-coefficient-that-makes-a-piecewise-limit-exist",
  title: t("A coefficient that makes a piecewise limit exist", "使分段函数极限存在的系数"),
  explanation: t(
    "A two-sided limit exists at a break point only if the one-sided limits agree. Each piece gives its one-sided limit by substitution, so setting the two equal produces an equation for the unknown coefficient. The value of the function at the break point plays no part.\n\nFor $f(x) = ax + 1$ when $x < 2$ and $f(x) = x^{2} + 3$ when $x > 2$, the left limit is $2a + 1$ and the right limit is $7$. Setting $2a + 1 = 7$ gives $a = 3$.\n\nCheck: with $a = 3$, $f(1.99) = 6.97$ and $f(2.01) = 7.0401$, both close to $7$.\n\n> **Watch out.** Substitute the break point itself into each piece, and leave out any value given at the break point: it never enters the equation.",
    "只有两个单侧极限相等时，分段点处的双侧极限才存在。每一段代入后给出自己的单侧极限，令二者相等就得到未知系数的方程。函数在分段点的取值与此无关。\n\n对于 $x < 2$ 时 $f(x) = ax + 1$、$x > 2$ 时 $f(x) = x^{2} + 3$，左极限是 $2a + 1$，右极限是 $7$。令 $2a + 1 = 7$，得 $a = 3$。\n\n检验：取 $a = 3$，$f(1.99) = 6.97$，$f(2.01) = 7.0401$，都接近 $7$。\n\n> **注意。** 每一段都要代入分段点本身；分段点处单独给出的函数值不进入方程。",
  ),
  generate(rng) {
    const c = rng.int(1, 5);
    const b = nonzero(rng, 9);
    const d = nonzero(rng, 9);
    const right = c * c + d;
    const answer = Q.of(right - b, c);
    const leftPiece = poly([1, "ax"], [b, ""]);
    const rightPiece = poly([1, "x^2"], [d, ""]);
    const f = `\\begin{cases} ${leftPiece} & x < ${c} \\\\ ${rightPiece} & x > ${c} \\end{cases}`;
    const leftLimit = poly([c, "a"], [b, ""]);
    const a = answer.toNumber();
    const table = valueTable(around(c), [["f(x)", (x) => (x < c ? a * x + b : x * x + d)]]);
    return numberProblem({
      prompt: t(
        `Let $f(x) = ${f}$. For which value of $a$ does $\\lim_{x \\to ${c}} f(x)$ exist?`,
        `设 $f(x) = ${f}$。$a$ 取何值时 $\\lim_{x \\to ${c}} f(x)$ 存在？`,
      ),
      answer,
      wrong: [Q.of(right + b, c), Q.of(right - b), Q.of(right - b, 2 * c)],
      solution: walk(
        [
          [
            "Find the left limit",
            "求左极限",
            `For $x < ${c}$, $f(x) = ${leftPiece}$. Substituting $x = ${c}$ gives the left limit $${leftLimit}$.`,
            `当 $x < ${c}$ 时，$f(x) = ${leftPiece}$。代入 $x = ${c}$，得左极限 $${leftLimit}$。`,
          ],
          [
            "Find the right limit",
            "求右极限",
            `For $x > ${c}$, $f(x) = ${rightPiece}$. Substituting gives the right limit $${c * c} + ${inParens(d)} = ${right}$.`,
            `当 $x > ${c}$ 时，$f(x) = ${rightPiece}$。代入得右极限 $${c * c} + ${inParens(d)} = ${right}$。`,
          ],
          [
            "Set them equal",
            "令二者相等",
            `The limit exists exactly when the two agree:\n\n$$${leftLimit} = ${right} \\quad\\Rightarrow\\quad a = ${answer.toLatex()}$$`,
            `两者相等时极限才存在：\n\n$$${leftLimit} = ${right} \\quad\\Rightarrow\\quad a = ${answer.toLatex()}$$`,
          ],
        ],
        [
          `Take $a = ${answer.toLatex()}$ and evaluate $f$ on both sides of $x = ${c}$:\n\n${table}\n\nBoth sides close in on $${right}$, so with this $a$ the limit exists.`,
          `取 $a = ${answer.toLatex()}$，计算 $f$ 在 $x = ${c}$ 两侧的值：\n\n${table}\n\n两侧都逼近 $${right}$，所以取这个 $a$ 时极限存在。`,
        ],
      ),
    });
  },
};

/** firstMistakes drops mistakes whose value is the answer or repeats an earlier one, so each response gets one reason. */
function firstMistakes(answer: number | Q, ms: readonly ReturnType<typeof why>[]): ReturnType<typeof why>[] {
  const key = (v: unknown) => (typeof v === "number" ? Q.of(v) : (v as Q)).toString();
  const seen = new Set([key(answer)]);
  return ms.filter((m) => !seen.has(key(m.value)) && Boolean(seen.add(key(m.value))));
}

const limitThatMustExist: KnowledgePointDef = {
  id: "a-limit-that-forces-a-factor",
  title: t("A limit that forces a factor", "迫使出现因式的极限"),
  explanation: t(
    "If the denominator of a quotient tends to zero and the limit is finite, the numerator must tend to zero too. So the point is a root of the numerator, which then has the matching linear factor. Cancelling that factor gives the limit by substitution.\n\nFor $\\lim_{x \\to 2} \\frac{x^{2} + kx - 6}{x - 2}$ to exist, the top must be $0$ at $x = 2$: $4 + 2k - 6 = 0$, so $k = 1$. Then $x^{2} + x - 6 = (x - 2)(x + 3)$, and the limit is $2 + 3 = 5$.\n\nCheck: with $k = 1$, the quotient is $5.001$ at $x = 2.001$ and $4.999$ at $x = 1.999$.\n\n> **Watch out.** Finding $k$ is only the first step: the question asks for the limit. The other root comes from the product of the roots, here $-6 = 2 \\cdot (-3)$.",
    "如果分母趋于零而极限有限，分子也必须趋于零。所以这一点是分子的根，分子含有相应的一次因式。约去这个因式后，代入就得到极限。\n\n要使 $\\lim_{x \\to 2} \\frac{x^{2} + kx - 6}{x - 2}$ 存在，分子在 $x = 2$ 处必须为 $0$：$4 + 2k - 6 = 0$，所以 $k = 1$。于是 $x^{2} + x - 6 = (x - 2)(x + 3)$，极限是 $2 + 3 = 5$。\n\n检验：取 $k = 1$，商在 $x = 2.001$ 处是 $5.001$，在 $x = 1.999$ 处是 $4.999$。\n\n> **注意。** 求出 $k$ 只是第一步，题目问的是极限。另一个根由两根之积得到，这里 $-6 = 2 \\cdot (-3)$。",
  ),
  generate(rng) {
    const a = nonzero(rng, 6);
    const r = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6].filter((x) => x !== a));
    const m = a * r;
    const answer = a - r;
    const k = -(a + r);
    const top = poly([1, "x^2"], [k, "x"], [m, ""]);
    return numberProblem({
      prompt: t(
        `The limit $\\lim_{x \\to ${a}} \\frac{${poly([1, "x^2"], [1, "kx"], [m, ""])}}{${poly([1, "x"], [-a, ""])}}$ exists for exactly one value of $k$. Find the limit.`,
        `极限 $\\lim_{x \\to ${a}} \\frac{${poly([1, "x^2"], [1, "kx"], [m, ""])}}{${poly([1, "x"], [-a, ""])}}$ 只在 $k$ 取一个值时存在。求这个极限。`,
      ),
      answer,
      form: "integer",
      mistakes: firstMistakes(answer, [
        why(
          k,
          `This is the value of $k$. The question asks for the limit, which comes after cancelling.`,
          `这是 $k$ 的值。题目问的是极限，要约分之后才得到。`,
        ),
        why(
          a + r,
          `This gives the other factor the wrong sign. It is $${poly([1, "x"], [-r, ""])}$, which is $${answer}$ at $x = ${a}$.`,
          `这把另一个因式的符号弄反了。它是 $${poly([1, "x"], [-r, ""])}$，在 $x = ${a}$ 处等于 $${answer}$。`,
        ),
        why(
          r - a,
          `This subtracts the wrong way round: substitute $x = ${a}$ into $${poly([1, "x"], [-r, ""])}$.`,
          `这减反了：要把 $x = ${a}$ 代入 $${poly([1, "x"], [-r, ""])}$。`,
        ),
      ]),
      solution: walk(
        [
          [
            "Make the top vanish",
            "令分子为零",
            `The bottom tends to $0$, so for a finite limit the top must be $0$ at $x = ${a}$: $${a * a} + ${inParens(a)}k + ${inParens(m)} = 0$, so $k = ${k}$.`,
            `分母趋于 $0$，要使极限有限，分子在 $x = ${a}$ 处必须为 $0$：$${a * a} + ${inParens(a)}k + ${inParens(m)} = 0$，所以 $k = ${k}$。`,
          ],
          [
            "Factor",
            "分解因式",
            `The roots multiply to $${m}$, so the other root is $${r}$:\n\n$$${top} = (${poly([1, "x"], [-a, ""])})(${poly([1, "x"], [-r, ""])})$$`,
            `两根之积是 $${m}$，所以另一个根是 $${r}$：\n\n$$${top} = (${poly([1, "x"], [-a, ""])})(${poly([1, "x"], [-r, ""])})$$`,
          ],
          [
            "Cancel and substitute",
            "约分后代入",
            `Cancel $${poly([1, "x"], [-a, ""])}$ and put $x = ${a}$: $${a} - ${inParens(r)} = ${answer}$.`,
            `约去 $${poly([1, "x"], [-a, ""])}$，代入 $x = ${a}$：$${a} - ${inParens(r)} = ${answer}$。`,
          ],
        ],
        [
          `With $k = ${k}$, evaluate the quotient on both sides of $x = ${a}$:\n\n${valueTable(around(a), [["f(x)", (x) => (x * x + k * x + m) / (x - a)]])}\n\nThe values close in on $${answer}$.`,
          `取 $k = ${k}$，计算商在 $x = ${a}$ 两侧的值：\n\n${valueTable(around(a), [["f(x)", (x) => (x * x + k * x + m) / (x - a)]])}\n\n这些值逼近 $${answer}$。`,
        ],
      ),
    });
  },
};

const conjugatesTopAndBottom: KnowledgePointDef = {
  id: "conjugates-in-the-numerator-and-the-denominator",
  title: t("Conjugates in the numerator and the denominator", "分子和分母同时用共轭"),
  explanation: t(
    "When a root difference appears both above and below the line, multiply by both conjugates. Each difference of squares then produces the same factor that vanishes at the limit point, and what remains is a ratio of the two conjugates, which can be found by substitution.\n\nFor $\\lim_{x \\to 5} \\frac{\\sqrt{x + 4} - 3}{\\sqrt{x - 1} - 2}$, the top times $\\sqrt{x + 4} + 3$ is $x - 5$, and the bottom times $\\sqrt{x - 1} + 2$ is $x - 5$. What is left is $\\frac{\\sqrt{x - 1} + 2}{\\sqrt{x + 4} + 3} \\to \\frac{4}{6} = \\frac{2}{3}$.\n\nCheck: at $x = 5.01$ the quotient is about $0.6669$, and at $x = 4.99$ about $0.6664$.\n\n> **Watch out.** Each conjugate ends up on the other side of the line: the bottom's conjugate goes to the top. So the answer is $\\frac{4}{6}$, not $\\frac{6}{4}$.",
    "当分子和分母都含根式之差时，同时乘以两个共轭式。每个平方差都产生同一个在极限点为零的因式，约去后剩下两个共轭式之比，代入即可求值。\n\n对于 $\\lim_{x \\to 5} \\frac{\\sqrt{x + 4} - 3}{\\sqrt{x - 1} - 2}$，分子乘以 $\\sqrt{x + 4} + 3$ 得 $x - 5$，分母乘以 $\\sqrt{x - 1} + 2$ 也得 $x - 5$。剩下 $\\frac{\\sqrt{x - 1} + 2}{\\sqrt{x + 4} + 3} \\to \\frac{4}{6} = \\frac{2}{3}$。\n\n检验：$x = 5.01$ 时商约为 $0.6669$，$x = 4.99$ 时约为 $0.6664$。\n\n> **注意。** 每个共轭式最后都到了分数线的另一侧：分母的共轭式到了分子上。所以答案是 $\\frac{4}{6}$，不是 $\\frac{6}{4}$。",
  ),
  generate(rng) {
    const a = rng.int(1, 9);
    const u = rng.int(1, 6);
    const v = different(rng, 1, 6, u);
    const p = u * u - a;
    const q = v * v - a;
    const answer = Q.of(v, u);
    const top = `\\sqrt{${poly([1, "x"], [p, ""])}}`;
    const bottom = `\\sqrt{${poly([1, "x"], [q, ""])}}`;
    const expression = `\\frac{${top} - ${u}}{${bottom} - ${v}}`;
    const f = (x: number) => (Math.sqrt(x + p) - u) / (Math.sqrt(x + q) - v);
    return numberProblem({
      prompt: t(`Find $\\lim_{x \\to ${a}} ${expression}$.`, `求 $\\lim_{x \\to ${a}} ${expression}$。`),
      answer,
      mistakes: firstMistakes(answer, [
        why(
          Q.of(u, v),
          "This turns the answer upside down: each conjugate ends up on the other side of the line.",
          "这把结果颠倒了：每个共轭式最后都在分数线的另一侧。",
        ),
        why(1, "This cancels the common factor and forgets the two conjugates that remain.", "这约去了公因式，却忘了还剩下两个共轭式。"),
        why(
          Q.of(v, 2 * u),
          `This takes the bottom's conjugate as $${v}$. At $x = ${a}$ it is $\\sqrt{${v * v}} + ${v} = ${2 * v}$.`,
          `这把分母的共轭式当成了 $${v}$。在 $x = ${a}$ 处它等于 $\\sqrt{${v * v}} + ${v} = ${2 * v}$。`,
        ),
      ]),
      solution: walk(
        [
          [
            "Multiply the top by its conjugate",
            "分子乘以共轭式",
            `\n\n$$(${top} - ${u})(${top} + ${u}) = (${poly([1, "x"], [p, ""])}) - ${u * u} = ${poly([1, "x"], [-a, ""])}$$`,
            `\n\n$$(${top} - ${u})(${top} + ${u}) = (${poly([1, "x"], [p, ""])}) - ${u * u} = ${poly([1, "x"], [-a, ""])}$$`,
          ],
          [
            "Multiply the bottom by its conjugate",
            "分母乘以共轭式",
            `\n\n$$(${bottom} - ${v})(${bottom} + ${v}) = (${poly([1, "x"], [q, ""])}) - ${v * v} = ${poly([1, "x"], [-a, ""])}$$`,
            `\n\n$$(${bottom} - ${v})(${bottom} + ${v}) = (${poly([1, "x"], [q, ""])}) - ${v * v} = ${poly([1, "x"], [-a, ""])}$$`,
          ],
          [
            "Cancel and substitute",
            "约分后代入",
            `Cancel $${poly([1, "x"], [-a, ""])}$. The conjugates are left, each on the other side:\n\n$$\\lim_{x \\to ${a}} \\frac{${bottom} + ${v}}{${top} + ${u}} = \\frac{${2 * v}}{${2 * u}} = ${answer.toLatex()}$$`,
            `约去 $${poly([1, "x"], [-a, ""])}$，剩下两个共轭式，各在另一侧：\n\n$$\\lim_{x \\to ${a}} \\frac{${bottom} + ${v}}{${top} + ${u}} = \\frac{${2 * v}}{${2 * u}} = ${answer.toLatex()}$$`,
          ],
        ],
        [
          `Evaluate the quotient on both sides of $x = ${a}$:\n\n${valueTable(around(a), [["f(x)", f]])}\n\nThe values close in on $${answer.toLatex()}${approx(answer)}$.`,
          `计算商在 $x = ${a}$ 两侧的值：\n\n${valueTable(around(a), [["f(x)", f]])}\n\n这些值逼近 $${answer.toLatex()}${approx(answer)}$。`,
        ],
      ),
    });
  },
};

const crossingTheAsymptote: KnowledgePointDef = {
  id: "where-a-graph-crosses-its-horizontal-asymptote",
  figure:
    calculusDrawings1["limits-at-infinity-and-horizontal-asymptotes-of-rational-functions#where-a-graph-crosses-its-horizontal-asymptote"],
  title: t("Where a graph crosses its horizontal asymptote", "图象与水平渐近线的交点"),
  explanation: t(
    "A horizontal asymptote describes the behaviour of a function far from the origin, so the graph may cross it elsewhere. To find where, set the function equal to the asymptote's value and clear the denominator. The highest powers cancel, which leaves a lower-degree equation.\n\nFor $f(x) = \\frac{2x^{2} + 3x - 1}{x^{2} + 1}$ the asymptote is $y = 2$. Setting $2x^{2} + 3x - 1 = 2(x^{2} + 1)$ leaves $3x - 1 = 2$, so $x = 1$.\n\nCheck: $f(1) = \\frac{2 + 3 - 1}{1 + 1} = \\frac{4}{2} = 2$.\n\n> **Watch out.** Set $f(x)$ equal to the asymptote's value, not to $0$: setting the top equal to $0$ finds where the graph crosses the $x$-axis. Multiply the whole denominator by that value, constant term included.",
    "水平渐近线描述的是函数远离原点时的行为，所以图象可以在别处穿过它。要找交点，令函数等于渐近线的值并去分母。最高次项相消，剩下次数更低的方程。\n\n对于 $f(x) = \\frac{2x^{2} + 3x - 1}{x^{2} + 1}$，渐近线是 $y = 2$。令 $2x^{2} + 3x - 1 = 2(x^{2} + 1)$，剩下 $3x - 1 = 2$，所以 $x = 1$。\n\n检验：$f(1) = \\frac{2 + 3 - 1}{1 + 1} = \\frac{4}{2} = 2$。\n\n> **注意。** 要令 $f(x)$ 等于渐近线的值，而不是等于 $0$：令分子为 $0$ 求的是图象与 $x$ 轴的交点。分母的每一项（包括常数项）都要乘以这个值。",
  ),
  generate(rng) {
    const a = rng.int(1, 5);
    const b = nonzero(rng, 6);
    const c = nonzero(rng, 9);
    const d = rng.int(1, 9);
    const answer = Q.of(a * d - c, b);
    const f = `\\frac{${poly([a, "x^2"], [b, "x"], [c, ""])}}{${poly([1, "x^2"], [d, ""])}}`;
    const top = Q.of(a).mul(answer).mul(answer).add(Q.of(b).mul(answer)).add(Q.of(c));
    const bottom = answer.mul(answer).add(Q.of(d));
    return numberProblem({
      prompt: t(
        `At which value of $x$ does the graph of $f(x) = ${f}$ cross its horizontal asymptote?`,
        `$f(x) = ${f}$ 的图象在 $x$ 取何值时穿过它的水平渐近线？`,
      ),
      answer,
      mistakes: firstMistakes(answer, [
        why(Q.of(c - a * d, b), "This moves a term across without changing its sign.", "这把一项移到另一边时没有变号。"),
        why(
          Q.of(-c, b),
          `This leaves out the constant $${d}$ of the denominator. Clearing it gives $${a}(x^{2} + ${d}) = ${poly([a, "x^2"], [a * d, ""])}$.`,
          `这漏掉了分母的常数 $${d}$。去分母得 $${a}(x^{2} + ${d}) = ${poly([a, "x^2"], [a * d, ""])}$。`,
        ),
        why(
          a,
          `This is the height of the asymptote, $y = ${a}$. The question asks for $x$.`,
          `这是渐近线的高度 $y = ${a}$。题目问的是 $x$。`,
        ),
      ]),
      solution: walk(
        [
          [
            "Find the asymptote",
            "求渐近线",
            `The degrees are equal, so the asymptote is the ratio of the leading coefficients: $y = \\frac{${a}}{1} = ${a}$.`,
            `分子分母次数相等，渐近线是首项系数之比：$y = \\frac{${a}}{1} = ${a}$。`,
          ],
          [
            "Set f equal to it",
            "令 f 等于它",
            `Clear the denominator; the $x^2$ terms cancel:\n\n$$${poly([a, "x^2"], [b, "x"], [c, ""])} = ${poly([a, "x^2"], [a * d, ""])}$$`,
            `去分母，$x^2$ 项相消：\n\n$$${poly([a, "x^2"], [b, "x"], [c, ""])} = ${poly([a, "x^2"], [a * d, ""])}$$`,
          ],
          [
            "Solve",
            "求解",
            `\n\n$${poly([b, "x"])} = ${a * d} - ${inParens(c)} = ${a * d - c}$, so $x = ${answer.toLatex()}$.`,
            `\n\n$${poly([b, "x"])} = ${a * d} - ${inParens(c)} = ${a * d - c}$，所以 $x = ${answer.toLatex()}$。`,
          ],
        ],
        [
          `Put $x = ${answer.toLatex()}$ into $f$: the top is $${top.toLatex()}$ and the bottom is $${bottom.toLatex()}$, and their quotient is $${top.div(bottom).toLatex()}$, the height of the asymptote.`,
          `把 $x = ${answer.toLatex()}$ 代入 $f$：分子是 $${top.toLatex()}$，分母是 $${bottom.toLatex()}$，二者之商是 $${top.div(bottom).toLatex()}$，正是渐近线的高度。`,
        ],
      ),
    });
  },
};

const quadraticInsideSine: KnowledgePointDef = {
  id: "a-quadratic-inside-the-sine",
  title: t("A quadratic inside the sine", "正弦内的二次式"),
  explanation: t(
    "To use $\\lim_{u \\to 0} \\frac{\\sin u}{u} = 1$, the denominator must match the argument of the sine. If the argument is a quadratic and the denominator only a linear factor of it, multiply and divide by the other factor. The other factor stays behind as a value found by substitution.\n\nFor $\\lim_{x \\to 2} \\frac{\\sin(2x^{2} - 8)}{x - 2}$, the argument is $u = 2(x - 2)(x + 2)$. Multiplying and dividing by $2(x + 2)$ gives $\\frac{\\sin u}{u} \\cdot 2(x + 2) \\to 1 \\cdot 2 \\cdot 4 = 8$.\n\nCheck: at $x = 2.001$ the quotient is about $8.002$, and at $x = 1.999$ about $7.998$.\n\n> **Watch out.** The factor left behind is $2(x + 2)$, evaluated at $x = 2$: it is $8$. Do not drop it, and do not put $x = 0$ into it.",
    "要使用 $\\lim_{u \\to 0} \\frac{\\sin u}{u} = 1$，分母必须与正弦的自变量一致。如果自变量是二次式，而分母只是它的一个一次因式，就乘除另一个因式。另一个因式留下来，代入求值。\n\n对于 $\\lim_{x \\to 2} \\frac{\\sin(2x^{2} - 8)}{x - 2}$，自变量是 $u = 2(x - 2)(x + 2)$。乘除 $2(x + 2)$ 得 $\\frac{\\sin u}{u} \\cdot 2(x + 2) \\to 1 \\cdot 2 \\cdot 4 = 8$。\n\n检验：$x = 2.001$ 时商约为 $8.002$，$x = 1.999$ 时约为 $7.998$。\n\n> **注意。** 留下的因式是 $2(x + 2)$，要在 $x = 2$ 处求值，得 $8$。不能丢掉它，也不能代入 $x = 0$。",
  ),
  generate(rng) {
    const a = nonzero(rng, 6);
    const k = rng.int(1, 6);
    const answer = 2 * a * k;
    const lower = poly([1, "x"], [-a, ""]);
    const other = poly([1, "x"], [a, ""]);
    const scale = k === 1 ? "" : `${k}`;
    const xs = [-0.001, -0.0001, 0.0001, 0.001].map((d) => Math.round((a + d) * 10000) / 10000);
    const f = (x: number) => Math.sin(k * (x * x - a * a)) / (x - a);
    return numberProblem({
      prompt: t(
        `Find $\\lim_{x \\to ${a}} \\frac{\\sin(${poly([k, "x^2"], [-k * a * a, ""])})}{${lower}}$.`,
        `求 $\\lim_{x \\to ${a}} \\frac{\\sin(${poly([k, "x^2"], [-k * a * a, ""])})}{${lower}}$。`,
      ),
      answer,
      form: "integer",
      mistakes: firstMistakes(answer, [
        why(
          a * k,
          `This takes $${other}$ as $${a}$. At $x = ${a}$ it is $${2 * a}$.`,
          `这把 $${other}$ 当成了 $${a}$。在 $x = ${a}$ 处它等于 $${2 * a}$。`,
        ),
        why(
          k,
          `This drops the factor $${other}$, which is left behind and is $${2 * a}$ at $x = ${a}$.`,
          `这丢掉了留下的因式 $${other}$，它在 $x = ${a}$ 处等于 $${2 * a}$。`,
        ),
        why(2 * a, `This drops the coefficient $${k}$ of the argument.`, `这丢掉了自变量中的系数 $${k}$。`),
      ]),
      solution: walk(
        [
          [
            "Factor the argument",
            "分解自变量",
            `\n\n$$u = ${poly([k, "x^2"], [-k * a * a, ""])} = ${scale}(${lower})(${other})$$`,
            `\n\n$$u = ${poly([k, "x^2"], [-k * a * a, ""])} = ${scale}(${lower})(${other})$$`,
          ],
          [
            "Multiply and divide",
            "乘除另一个因式",
            `Multiply and divide by $${scale}(${other})$:\n\n$$\\frac{\\sin u}{${lower}} = \\frac{\\sin u}{u} \\cdot ${scale}(${other})$$`,
            `乘除 $${scale}(${other})$：\n\n$$\\frac{\\sin u}{${lower}} = \\frac{\\sin u}{u} \\cdot ${scale}(${other})$$`,
          ],
          [
            "Take the limits",
            "求极限",
            `As $x \\to ${a}$, $u \\to 0$, so the limit is $1 \\cdot ${k} \\cdot ${inParens(2 * a)} = ${answer}$.`,
            `当 $x \\to ${a}$ 时 $u \\to 0$，所以极限是 $1 \\cdot ${k} \\cdot ${inParens(2 * a)} = ${answer}$。`,
          ],
        ],
        [
          `Evaluate the quotient close to $x = ${a}$:\n\n${valueTable(xs, [["f(x)", f]])}\n\nThe values close in on $${answer}$.`,
          `在 $x = ${a}$ 附近计算商的值：\n\n${valueTable(xs, [["f(x)", f]])}\n\n这些值逼近 $${answer}$。`,
        ],
      ),
    });
  },
};

const ratioToAPower: KnowledgePointDef = {
  id: "a-ratio-of-linear-terms-to-a-growing-power",
  title: t("A ratio of linear terms to a growing power", "一次式之比的增长次幂"),
  explanation: t(
    "A quotient that tends to $1$, raised to a growing power, is an indeterminate form. Rewrite the quotient as one plus a small term: $\\frac{x+a}{x+b} = 1 + \\frac{a-b}{x+b}$. Then the standard limit gives $e$ raised to the product of the small term's numerator and the coefficient of the power.\n\nFor $\\left(\\frac{x + 3}{x + 1}\\right)^{2x}$ the quotient is $1 + \\frac{2}{x + 1}$, so the limit is $e^{2 \\cdot 2} = e^{4}$.\n\nCheck: the logarithm is $2x \\ln\\frac{x + 3}{x + 1}$, about $3.992$ at $x = 1000$ and $3.9992$ at $x = 10\\,000$, close to $4$.\n\n> **Watch out.** Use the difference $a - b$, not $a$ alone, and multiply by the coefficient of the power. The base tending to $1$ does not make the limit $1$.",
    "趋于 $1$ 的商的增长次幂是不定式。把商写成一加一个小量：$\\frac{x+a}{x+b} = 1 + \\frac{a-b}{x+b}$。再用标准极限，结果是 $e$ 的幂，指数是小量的分子与幂的系数之积。\n\n对于 $\\left(\\frac{x + 3}{x + 1}\\right)^{2x}$，商是 $1 + \\frac{2}{x + 1}$，所以极限是 $e^{2 \\cdot 2} = e^{4}$。\n\n检验：取对数得 $2x \\ln\\frac{x + 3}{x + 1}$，$x = 1000$ 时约为 $3.992$，$x = 10\\,000$ 时约为 $3.9992$，接近 $4$。\n\n> **注意。** 要用差 $a - b$，不是只用 $a$，还要乘以幂的系数。底数趋于 $1$ 并不意味着极限是 $1$。",
  ),
  generate(rng) {
    const a = nonzero(rng, 9);
    const b = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x !== a));
    const c = rng.int(1, 5);
    const answer = (a - b) * c;
    const expression = `\\left(\\frac{${poly([1, "x"], [a, ""])}}{${poly([1, "x"], [b, ""])}}\\right)^{${poly([c, "x"])}}`;
    const lnf = (x: number) => c * x * Math.log((x + a) / (x + b));
    return numberProblem({
      prompt: t(
        `The limit $\\lim_{x \\to \\infty} ${expression}$ equals $e^k$. Find $k$.`,
        `极限 $\\lim_{x \\to \\infty} ${expression}$ 等于 $e^k$。求 $k$。`,
      ),
      answer,
      solveFor: "k",
      mistakes: firstMistakes(answer, [
        why(
          a * c,
          `This uses $${a}$ alone. The small term is $\\frac{${a - b}}{${poly([1, "x"], [b, ""])}}$, with numerator $${a} - ${inParens(b)}$.`,
          `这只用了 $${a}$。小量是 $\\frac{${a - b}}{${poly([1, "x"], [b, ""])}}$，分子是 $${a} - ${inParens(b)}$。`,
        ),
        why((a + b) * c, `This adds $${b}$ instead of subtracting it.`, `这把 $${b}$ 加上了，应该减去。`),
        why(a - b, `This forgets the coefficient $${c}$ of the power.`, `这忘了幂的系数 $${c}$。`),
        why(
          0,
          "This reads the limit as $1 = e^{0}$ because the base tends to $1$. The growing power keeps it away from $1$.",
          "这因为底数趋于 $1$ 就把极限当成 $1 = e^{0}$。不断增大的指数使它不等于 $1$。",
        ),
      ]),
      solution: walk(
        [
          [
            "Write the quotient as one plus a small term",
            "把商写成一加小量",
            `\n\n$$\\frac{${poly([1, "x"], [a, ""])}}{${poly([1, "x"], [b, ""])}} = 1 + \\frac{${a - b}}{${poly([1, "x"], [b, ""])}}$$`,
            `\n\n$$\\frac{${poly([1, "x"], [a, ""])}}{${poly([1, "x"], [b, ""])}} = 1 + \\frac{${a - b}}{${poly([1, "x"], [b, ""])}}$$`,
          ],
          [
            "Use the standard limit",
            "利用标准极限",
            `For large $x$, $\\left(1 + \\frac{${a - b}}{${poly([1, "x"], [b, ""])}}\\right)^{x} \\to e^{${a - b}}$, and the power is $${c}$ times $x$, so the limit is $e^{${a - b} \\cdot ${c}} = e^{${answer}}$. So $k = ${answer}$.`,
            `当 $x$ 很大时，$\\left(1 + \\frac{${a - b}}{${poly([1, "x"], [b, ""])}}\\right)^{x} \\to e^{${a - b}}$，而指数是 $x$ 的 $${c}$ 倍，所以极限是 $e^{${a - b} \\cdot ${c}} = e^{${answer}}$。所以 $k = ${answer}$。`,
          ],
        ],
        [
          `Take the logarithm, $${poly([c, "x"])} \\ln\\frac{${poly([1, "x"], [a, ""])}}{${poly([1, "x"], [b, ""])}}$, for larger and larger $x$:\n\n${valueTable([100, 1000, 10000], [["\\ln f(x)", lnf]])}\n\nThe logarithms close in on $${answer}$.`,
          `取对数 $${poly([c, "x"])} \\ln\\frac{${poly([1, "x"], [a, ""])}}{${poly([1, "x"], [b, ""])}}$，计算 $x$ 越来越大时的值：\n\n${valueTable([100, 1000, 10000], [["\\ln f(x)", lnf]])}\n\n对数值逼近 $${answer}$。`,
        ],
      ),
    });
  },
};

const tangentThroughOutsidePoint: KnowledgePointDef = {
  id: "tangent-lines-through-a-point-off-the-curve",
  title: t("Tangent lines through a point off the curve", "过曲线外一点的切线"),
  explanation: t(
    "If the given point is not on the curve, the point of tangency is unknown. Call it $(a, a^2)$ on $y = x^2$. The tangent there is $y - a^2 = 2a(x - a)$, and requiring it to pass through the given point gives a quadratic in $a$. Each root gives one tangent line.\n\nFor the point $(1, -3)$: $-3 - a^{2} = 2a(1 - a)$ gives $a^{2} - 2a - 3 = 0$, so $a = 3$ or $a = -1$, and the two tangent slopes are $6$ and $-2$.\n\nCheck: the tangent at $(3, 9)$ is $y = 6x - 9$, which gives $6 - 9 = -3$ at $x = 1$.\n\n> **Watch out.** The given point is not the point of tangency, so its $x$-value does not give a slope: $2 \\cdot 1 = 2$ is not one of the tangent slopes here.",
    "如果给定的点不在曲线上，切点就是未知的。设 $y = x^2$ 上的切点为 $(a, a^2)$，切线是 $y - a^2 = 2a(x - a)$。要求它过给定的点，就得到关于 $a$ 的二次方程，每个根对应一条切线。\n\n对点 $(1, -3)$：$-3 - a^{2} = 2a(1 - a)$ 化为 $a^{2} - 2a - 3 = 0$，所以 $a = 3$ 或 $a = -1$，两条切线的斜率是 $6$ 和 $-2$。\n\n检验：$(3, 9)$ 处的切线是 $y = 6x - 9$，在 $x = 1$ 处给出 $6 - 9 = -3$。\n\n> **注意。** 给定的点不是切点，所以它的横坐标不能给出斜率：这里 $2 \\cdot 1 = 2$ 并不是切线的斜率。",
  ),
  generate(rng) {
    const p = rng.int(-6, 6);
    const s = rng.int(1, 6);
    const q = p * p - s * s;
    const answer = 2 * (p + s);
    const r = p + s;
    const eq = poly([1, "a^2"], [-2 * p, "a"], [q, ""]);
    return numberProblem({
      prompt: t(
        `Two tangent lines to $y = x^2$ pass through the point $(${p}, ${q})$. Find the larger of their slopes.`,
        `$y = x^2$ 有两条切线过点 $(${p}, ${q})$。求它们中较大的斜率。`,
      ),
      answer,
      form: "integer",
      mistakes: firstMistakes(answer, [
        why(
          2 * p,
          `This is $2x$ at the given point, $x = ${p}$. That point is not on the curve, so it is not a point of tangency.`,
          `这是在给定点 $x = ${p}$ 处的 $2x$。这个点不在曲线上，不是切点。`,
        ),
        why(2 * (p - s), `This is the smaller slope, from $a = ${p - s}$.`, `这是较小的斜率，来自 $a = ${p - s}$。`),
        why(r, `This is the point of tangency $a = ${r}$. The slope there is $2a$.`, `这是切点的横坐标 $a = ${r}$。那里的斜率是 $2a$。`),
      ]),
      solution: walk(
        [
          [
            "Set up the tangent",
            "设出切线",
            `The tangent at $(a, a^2)$ has slope $2a$. It passes through $(${p}, ${q})$ when\n\n$$${inParens(q)} - a^2 = 2a(${p} - a).$$`,
            `$(a, a^2)$ 处的切线斜率是 $2a$。它过 $(${p}, ${q})$ 的条件是\n\n$$${inParens(q)} - a^2 = 2a(${p} - a).$$`,
          ],
          [
            "Solve for the points of tangency",
            "解出切点",
            `This rearranges to $${eq} = 0$, with roots $a = ${p - s}$ and $a = ${r}$.`,
            `整理得 $${eq} = 0$，两根是 $a = ${p - s}$ 和 $a = ${r}$。`,
          ],
          [
            "Take the larger slope",
            "取较大的斜率",
            `The slopes are $2 \\cdot ${inParens(p - s)} = ${2 * (p - s)}$ and $2 \\cdot ${inParens(r)} = ${answer}$, so the larger is $${answer}$.`,
            `斜率分别是 $2 \\cdot ${inParens(p - s)} = ${2 * (p - s)}$ 和 $2 \\cdot ${inParens(r)} = ${answer}$，较大的是 $${answer}$。`,
          ],
        ],
        [
          `The tangent at $(${r}, ${r * r})$ is $y = ${poly([answer, "x"], [-r * r, ""])}$. At $x = ${p}$ it gives $${answer} \\cdot ${inParens(p)} - ${r * r} = ${q}$, so it does pass through the point.`,
          `$(${r}, ${r * r})$ 处的切线是 $y = ${poly([answer, "x"], [-r * r, ""])}$。在 $x = ${p}$ 处它给出 $${answer} \\cdot ${inParens(p)} - ${r * r} = ${q}$，确实经过这个点。`,
        ],
      ),
    });
  },
};

const normalMeetsAgain: KnowledgePointDef = {
  id: "where-a-normal-line-meets-the-curve-again",
  figure: calculusDrawings2["calculating-the-equation-of-a-normal-line-using-differentiation#where-a-normal-line-meets-the-curve-again"],
  title: t("Where a normal line meets the curve again", "法线与曲线的另一交点"),
  explanation: t(
    "A normal line to a parabola usually crosses the parabola a second time. For $y = cx^2$, the line through points with $x$-values $a$ and $b$ has slope $c(a + b)$. Setting this equal to the normal's slope gives the second point directly, without solving a quadratic.\n\nFor $y = x^{2}$ at $x = 1$ the tangent slope is $2$, so the normal slope is $-\\frac{1}{2}$. Then $1 + b = -\\frac{1}{2}$, and $b = -\\frac{3}{2}$.\n\nCheck: the normal $y = -\\frac{1}{2}x + \\frac{3}{2}$ gives $\\frac{3}{4} + \\frac{3}{2} = \\frac{9}{4}$ at $x = -\\frac{3}{2}$, and so does $x^{2}$.\n\n> **Watch out.** $-a$ is the other point at the same height, which a horizontal line reaches, not the normal. Divide the normal's slope by $c$ before subtracting $a$.",
    "抛物线的法线通常还会再次与它相交。对 $y = cx^2$，过横坐标为 $a$ 和 $b$ 的两点的直线斜率是 $c(a + b)$。令它等于法线的斜率，就能直接得到第二个交点，不必解二次方程。\n\n对 $y = x^{2}$ 在 $x = 1$ 处，切线斜率是 $2$，所以法线斜率是 $-\\frac{1}{2}$。于是 $1 + b = -\\frac{1}{2}$，$b = -\\frac{3}{2}$。\n\n检验：法线 $y = -\\frac{1}{2}x + \\frac{3}{2}$ 在 $x = -\\frac{3}{2}$ 处给出 $\\frac{3}{4} + \\frac{3}{2} = \\frac{9}{4}$，$x^{2}$ 也是 $\\frac{9}{4}$。\n\n> **注意。** $-a$ 是同一高度上的另一点，是水平线而不是法线到达的点。要先把法线斜率除以 $c$，再减去 $a$。",
  ),
  generate(rng) {
    const a = nonzero(rng, 6);
    const c = rng.int(1, 4);
    const answer = Q.of(-a).sub(Q.of(1, 2 * c * c * a));
    const normal = Q.of(-1, 2 * c * a);
    const height = Q.of(c).mul(answer).mul(answer);
    const cx2 = poly([c, "x^2"]);
    const nP = normal.sign() < 0 ? `\\left(${normal.toLatex()}\\right)` : normal.toLatex();
    return numberProblem({
      prompt: t(
        `The normal line to $y = ${cx2}$ at the point where $x = ${a}$ meets the curve at a second point. Find the $x$-coordinate of that point.`,
        `$y = ${cx2}$ 在 $x = ${a}$ 处的法线与曲线还有另一个交点。求该点的横坐标。`,
      ),
      answer,
      mistakes: firstMistakes(answer, [
        why(
          Q.of(-a),
          `This is the point at the same height as $x = ${a}$, which a horizontal line reaches. The normal is not horizontal.`,
          `这是与 $x = ${a}$ 同高的点，是水平线到达的点。法线不是水平的。`,
        ),
        why(normal, "This is the slope of the normal, not an $x$-coordinate.", "这是法线的斜率，不是横坐标。"),
        why(
          Q.of(a).add(Q.of(1, 2 * c * c * a)),
          `This has the signs the wrong way round: $b = ${normal.div(Q.of(c)).toLatex()} - ${inParens(a)}$.`,
          `这符号弄反了：$b = ${normal.div(Q.of(c)).toLatex()} - ${inParens(a)}$。`,
        ),
      ]),
      solution: walk(
        [
          [
            "Find the normal's slope",
            "求法线的斜率",
            `The tangent slope at $x = ${a}$ is $${2 * c} \\cdot ${inParens(a)} = ${2 * c * a}$, so the normal's slope is $${normal.toLatex()}$.`,
            `$x = ${a}$ 处的切线斜率是 $${2 * c} \\cdot ${inParens(a)} = ${2 * c * a}$，所以法线的斜率是 $${normal.toLatex()}$。`,
          ],
          [
            "Match the chord's slope",
            "令弦的斜率相等",
            `The line through the points at $x = ${a}$ and $x = b$ has slope $${c === 1 ? "" : c}(${a} + b)$, so\n\n$$${a} + b = ${normal.div(Q.of(c)).toLatex()}.$$`,
            `过 $x = ${a}$ 和 $x = b$ 两点的直线斜率是 $${c === 1 ? "" : c}(${a} + b)$，所以\n\n$$${a} + b = ${normal.div(Q.of(c)).toLatex()}.$$`,
          ],
          ["Solve for $b$", "解出 $b$", `$b = ${answer.toLatex()}${approx(answer)}$.`, `$b = ${answer.toLatex()}${approx(answer)}$。`],
        ],
        [
          `At $x = ${answer.toLatex()}$ the curve has height $${c === 1 ? "" : c}\\left(${answer.toLatex()}\\right)^{2} = ${height.toLatex()}$, and the normal $y = ${c * a * a} + ${nP}(x ${a < 0 ? "+" : "-"} ${Math.abs(a)})$ gives the same height there: $${Q.of(
            c * a * a,
          )
            .add(normal.mul(answer.sub(Q.of(a))))
            .toLatex()}$.`,
          `在 $x = ${answer.toLatex()}$ 处，曲线的高度是 $${c === 1 ? "" : c}\\left(${answer.toLatex()}\\right)^{2} = ${height.toLatex()}$，法线 $y = ${c * a * a} + ${nP}(x ${a < 0 ? "+" : "-"} ${Math.abs(a)})$ 在该处给出相同的高度：$${Q.of(
            c * a * a,
          )
            .add(normal.mul(answer.sub(Q.of(a))))
            .toLatex()}$。`,
        ],
      ),
    });
  },
};

const productOfThree: KnowledgePointDef = {
  id: "the-product-rule-for-three-functions",
  title: t("The product rule for three functions", "三个函数的乘积法则"),
  explanation: t(
    "Grouping $fgh$ as $(fg)h$ and applying the product rule twice gives $(fgh)' = f'gh + fg'h + fgh'$. There is one term for each factor, with only that factor differentiated. The pattern extends to any number of factors.\n\nFor example, if $f = 1$, $g = 2$, $h = 3$, $f' = 4$, $g' = 5$ and $h' = 6$ at a point, the derivative there is $24 + 15 + 12 = 51$.\n\nCheck: with $f = g = h = x$, the rule gives $3x^{2}$, which is the power rule for $x^{3}$.\n\n> **Watch out.** The derivative is not $f'g'h'$. Each of the three terms differentiates exactly one factor and keeps the other two.",
    "把 $fgh$ 看成 $(fg)h$，用两次乘积法则，得 $(fgh)' = f'gh + fg'h + fgh'$。每个因子对应一项，这一项中只有这个因子被求导。这个规律可以推广到任意多个因子。\n\n例如，若在某点 $f = 1$，$g = 2$，$h = 3$，$f' = 4$，$g' = 5$，$h' = 6$，则那里的导数是 $24 + 15 + 12 = 51$。\n\n检验：取 $f = g = h = x$，法则给出 $3x^{2}$，正是 $x^{3}$ 的幂法则。\n\n> **注意。** 导数不是 $f'g'h'$。三项中的每一项恰好对一个因子求导，另外两个保持不变。",
  ),
  generate(rng) {
    const c = rng.int(1, 5);
    const f = nonzero(rng, 4);
    const g = nonzero(rng, 4);
    const h = nonzero(rng, 4);
    const df = nonzero(rng, 4);
    const dg = nonzero(rng, 4);
    const dh = nonzero(rng, 4);
    const answer = df * g * h + f * dg * h + f * g * dh;
    const P = (s: number) => (f + df * s) * (g + dg * s) * (h + dh * s);
    const dq = (s: number) => (P(s) - P(0)) / s;
    const quotients = table(
      ["$s$", "$0.01$", "$-0.01$"],
      [`$\\frac{P(${c} + s) - P(${c})}{s}$`, `$${num(dq(0.01))}$`, `$${num(dq(-0.01))}$`],
    );
    return numberProblem({
      prompt: t(
        `At $x = ${c}$: $f = ${f}$, $g = ${g}$, $h = ${h}$, $f' = ${df}$, $g' = ${dg}$ and $h' = ${dh}$. Find the derivative of $fgh$ at $x = ${c}$.`,
        `在 $x = ${c}$ 处：$f = ${f}$，$g = ${g}$，$h = ${h}$，$f' = ${df}$，$g' = ${dg}$，$h' = ${dh}$。求 $fgh$ 在 $x = ${c}$ 处的导数。`,
      ),
      answer,
      form: "integer",
      wrong: [df * dg * dh, df * g * h, df * g * h + f * dg * h],
      solution: walk(
        [
          [
            "Write one term per factor",
            "每个因子写一项",
            `The derivative is $f'gh + fg'h + fgh'$. Its terms are $${df} \\cdot ${inParens(g)} \\cdot ${inParens(h)} = ${df * g * h}$, $${f} \\cdot ${inParens(dg)} \\cdot ${inParens(h)} = ${f * dg * h}$ and $${f} \\cdot ${inParens(g)} \\cdot ${inParens(dh)} = ${f * g * dh}$.`,
            `导数是 $f'gh + fg'h + fgh'$。各项为 $${df} \\cdot ${inParens(g)} \\cdot ${inParens(h)} = ${df * g * h}$，$${f} \\cdot ${inParens(dg)} \\cdot ${inParens(h)} = ${f * dg * h}$，$${f} \\cdot ${inParens(g)} \\cdot ${inParens(dh)} = ${f * g * dh}$。`,
          ],
          [
            "Add the terms",
            "把各项相加",
            `$${inParens(df * g * h)} + ${inParens(f * dg * h)} + ${inParens(f * g * dh)} = ${answer}$.`,
            `$${inParens(df * g * h)} + ${inParens(f * dg * h)} + ${inParens(f * g * dh)} = ${answer}$。`,
          ],
        ],
        [
          `Replace $f$, $g$ and $h$ by lines with the same values and slopes at $x = ${c}$, such as $${f} ${df < 0 ? "-" : "+"} ${Math.abs(df)}(x - ${c})$ for $f$. Their product $P$ has the same derivative at $x = ${c}$, and its difference quotients are\n\n${quotients}\n\nTheir average is $${num((dq(0.01) + dq(-0.01)) / 2)}$, which matches $${answer}$.`,
          `把 $f$、$g$、$h$ 换成在 $x = ${c}$ 处有相同值和斜率的直线，例如 $f$ 换成 $${f} ${df < 0 ? "-" : "+"} ${Math.abs(df)}(x - ${c})$。它们的积 $P$ 在 $x = ${c}$ 处有相同的导数，其差商为\n\n${quotients}\n\n它们的平均值是 $${num((dq(0.01) + dq(-0.01)) / 2)}$，与 $${answer}$ 相符。`,
        ],
      ),
    });
  },
};

const largestValueOfAQuotient: KnowledgePointDef = {
  id: "the-largest-value-of-a-quotient",
  title: t("The largest value of a quotient", "商的最大值"),
  explanation: t(
    "A derivative from the quotient rule is zero exactly when its numerator is zero, because the denominator of $f'$ is a square. So only the numerator needs to be solved. For a function that tends to zero at both ends, the positive critical point gives the largest value.\n\nFor example, $f(x) = \\frac{x}{x^{2} + 1}$ has numerator $1 - x^{2}$ in $f'$, from $(x^{2} + 1) - 2x^{2}$, which vanishes at $x = \\pm 1$, and $f(1) = \\frac{1}{2}$.\n\nCheck: $f(0.5) = 0.4$ and $f(2) = 0.4$, both below $0.5$.\n\n> **Watch out.** The denominator $x^{2} + k^{2}$ is never zero, so it gives no critical points. The negative critical point gives the smallest value, not the largest.",
    "由商法则得到的导数，分母是平方，所以导数为零当且仅当分子为零，只需解分子。对两端都趋于零的函数，正的临界点给出最大值。\n\n例如 $f(x) = \\frac{x}{x^{2} + 1}$ 的导数分子为 $(x^{2} + 1) - 2x^{2}$，即 $1 - x^{2}$，在 $x = \\pm 1$ 处为零，且 $f(1) = \\frac{1}{2}$。\n\n检验：$f(0.5) = 0.4$，$f(2) = 0.4$，都小于 $0.5$。\n\n> **注意。** 分母 $x^{2} + k^{2}$ 永不为零，不产生临界点。负的临界点给出最小值，而不是最大值。",
  ),
  generate(rng) {
    const a = rng.int(1, 9);
    const k = rng.int(1, 12);
    const answer = Q.of(a, 2 * k);
    const f = `\\frac{${poly([a, "x"])}}{${poly([1, "x^2"], [k * k, ""])}}`;
    const rows = valueTable([k / 2, k, 2 * k], [["f(x)", (x) => (a * x) / (x * x + k * k)]]);
    return numberProblem({
      prompt: t(`Find the largest value of $f(x) = ${f}$.`, `求 $f(x) = ${f}$ 的最大值。`),
      answer,
      wrong: [Q.of(a, k), Q.of(k), Q.of(a, k * k)],
      solution: walk(
        [
          [
            "Find the numerator of the derivative",
            "求导数的分子",
            `By the quotient rule the numerator of $f'(x)$ is\n\n$$${a}(${poly([1, "x^2"], [k * k, ""])}) - ${poly([a, "x"])} \\cdot 2x = ${a}(${poly([k * k, ""], [-1, "x^2"])}).$$\n\nIt vanishes at $x = \\pm ${k}$.`,
            `由商法则，$f'(x)$ 的分子是\n\n$$${a}(${poly([1, "x^2"], [k * k, ""])}) - ${poly([a, "x"])} \\cdot 2x = ${a}(${poly([k * k, ""], [-1, "x^2"])}).$$\n\n它在 $x = \\pm ${k}$ 处为零。`,
          ],
          [
            "Evaluate at the positive point",
            "在正的临界点求值",
            `The largest value is\n\n$$f(${k}) = \\frac{${a * k}}{${2 * k * k}} = ${answer.toLatex()}.$$`,
            `最大值是\n\n$$f(${k}) = \\frac{${a * k}}{${2 * k * k}} = ${answer.toLatex()}.$$`,
          ],
        ],
        [
          `Compare values on each side of $x = ${k}$:\n\n${rows}\n\nThe middle value, $${num(answer.toNumber())}$, is the largest, and $f$ is negative for $x < 0$.`,
          `比较 $x = ${k}$ 两侧的函数值：\n\n${rows}\n\n中间的值 $${num(answer.toNumber())}$ 最大，而 $x < 0$ 时 $f$ 为负。`,
        ],
      ),
    });
  },
};

const highDerivativeOfAProduct: KnowledgePointDef = {
  id: "a-high-derivative-of-x-times-an-exponential",
  title: t("A high derivative of $x$ times an exponential", "$x$ 与指数函数之积的高阶导数"),
  explanation: t(
    "Differentiating $xe^{ax}$ repeatedly shows a pattern: $f^{(n)}(x) = (a^n x + na^{n-1})e^{ax}$. Each new derivative multiplies by $a$ and adds another copy of the term coming from the factor $x$. At $x = 0$ only $na^{n-1}$ is left.\n\nFor example, $f(x) = xe^{2x}$ has $f'(x) = (2x + 1)e^{2x}$ and $f''(x) = (4x + 4)e^{2x}$, so $f''(0) = 4$.\n\nCheck: the pattern with $n = 2$ and $a = 2$ gives $(4x + 2 \\cdot 2)e^{2x}$, the same as differentiating twice.\n\n> **Watch out.** The constant term is $na^{n-1}$, not $a^{n}$: the factor $x$ contributes once at each of the $n$ steps.",
    "对 $xe^{ax}$ 反复求导会出现规律：$f^{(n)}(x) = (a^n x + na^{n-1})e^{ax}$。每求一次导都乘以 $a$，再多加一份来自因子 $x$ 的项。在 $x = 0$ 处只剩 $na^{n-1}$。\n\n例如 $f(x) = xe^{2x}$ 有 $f'(x) = (2x + 1)e^{2x}$，$f''(x) = (4x + 4)e^{2x}$，所以 $f''(0) = 4$。\n\n检验：在规律中取 $n = 2$、$a = 2$，得 $(4x + 2 \\cdot 2)e^{2x}$，与直接求两次导相同。\n\n> **注意。** 常数项是 $na^{n-1}$，不是 $a^{n}$：因子 $x$ 在 $n$ 步中每步都贡献一次。",
  ),
  generate(rng) {
    const a = nonzero(rng, 3);
    const n = rng.int(3, 7);
    const answer = n * a ** (n - 1);
    const prev = (x: number) => (a ** (n - 1) * x + (n - 1) * a ** (n - 2)) * Math.exp(a * x);
    const dq = (s: number) => (prev(s) - prev(0)) / s;
    const e = `e^{${poly([a, "x"])}}`;
    const quotients = table(
      ["$h$", "$0.01$", "$-0.01$"],
      [`$\\frac{f^{(${n - 1})}(h) - f^{(${n - 1})}(0)}{h}$`, `$${num(dq(0.01))}$`, `$${num(dq(-0.01))}$`],
    );
    return numberProblem({
      prompt: t(`Let $f(x) = x${e}$. Find $f^{(${n})}(0)$.`, `设 $f(x) = x${e}$。求 $f^{(${n})}(0)$。`),
      answer,
      form: "integer",
      wrong: [a ** n, n * a ** n, a ** (n - 1)],
      solution: walk(
        [
          [
            "Use the pattern",
            "利用规律",
            `With $a = ${a}$ and $n = ${n}$,\n\n$$f^{(${n})}(x) = (${inParens(a ** n)}x + ${inParens(answer)})${e}.$$`,
            `取 $a = ${a}$，$n = ${n}$，\n\n$$f^{(${n})}(x) = (${inParens(a ** n)}x + ${inParens(answer)})${e}.$$`,
          ],
          [
            "Substitute x = 0",
            "代入 x = 0",
            `The term in $x$ vanishes and $e^{0} = 1$, leaving $${n} \\cdot ${inParens(a)}^{${n - 1}} = ${answer}$.`,
            `含 $x$ 的项为零，$e^{0} = 1$，剩下 $${n} \\cdot ${inParens(a)}^{${n - 1}} = ${answer}$。`,
          ],
        ],
        [
          `The pattern gives $f^{(${n - 1})}(x) = (${inParens(a ** (n - 1))}x + ${inParens((n - 1) * a ** (n - 2))})${e}$. Its difference quotients at $0$ estimate $f^{(${n})}(0)$:\n\n${quotients}\n\nTheir average is $${num((dq(0.01) + dq(-0.01)) / 2)}$, close to $${answer}$.`,
          `由规律，$f^{(${n - 1})}(x) = (${inParens(a ** (n - 1))}x + ${inParens((n - 1) * a ** (n - 2))})${e}$。它在 $0$ 处的差商估计了 $f^{(${n})}(0)$：\n\n${quotients}\n\n它们的平均值是 $${num((dq(0.01) + dq(-0.01)) / 2)}$，接近 $${answer}$。`,
        ],
      ),
    });
  },
};

const rateThatSolvesAnEquation: KnowledgePointDef = {
  id: "an-exponential-that-satisfies-an-equation-in-its-derivatives",
  title: t("An exponential that satisfies an equation in its derivatives", "满足导数方程的指数函数"),
  explanation: t(
    "By the chain rule, $y = e^{kx}$ has $y' = ky$ and $y'' = k^2y$. Substituting into an equation in $y$ and its derivatives gives a common factor $e^{kx}$, which is never zero. So the condition reduces to a quadratic equation in $k$.\n\nFor example, $y'' - 5y' + 6y = 0$ becomes $(k^{2} - 5k + 6)e^{kx} = 0$, so $k^{2} - 5k + 6 = 0$ and $k = 2$ or $k = 3$.\n\nCheck: with $y = e^{3x}$, $y' = 3e^{3x}$ and $y'' = 9e^{3x}$, and $9 - 15 + 6 = 0$.\n\n> **Watch out.** The roots of $k^{2} + bk + c = 0$ have the opposite signs to the numbers in its factors: $(k - 2)(k - 3)$ gives $2$ and $3$, not $-2$ and $-3$.",
    "由链式法则，$y = e^{kx}$ 满足 $y' = ky$，$y'' = k^2y$。代入关于 $y$ 及其导数的方程，会出现公因子 $e^{kx}$，它永不为零。所以条件化为关于 $k$ 的二次方程。\n\n例如 $y'' - 5y' + 6y = 0$ 化为 $(k^{2} - 5k + 6)e^{kx} = 0$，所以 $k^{2} - 5k + 6 = 0$，$k = 2$ 或 $k = 3$。\n\n检验：取 $y = e^{3x}$，$y' = 3e^{3x}$，$y'' = 9e^{3x}$，而 $9 - 15 + 6 = 0$。\n\n> **注意。** $k^{2} + bk + c = 0$ 的根与因式中的数符号相反：$(k - 2)(k - 3)$ 给出 $2$ 和 $3$，不是 $-2$ 和 $-3$。",
  ),
  generate(rng) {
    const r = rng.int(-6, 5);
    const s = r + rng.int(1, 7);
    const b = -(r + s);
    const c = r * s;
    const equation = poly([1, "y''"], [b, "y'"], [c, "y"]);
    const quadratic = poly([1, "k^2"], [b, "k"], [c, ""]);
    const factor = (root: number) => (root === 0 ? "k" : `(${poly([1, "k"], [-root, ""])})`);
    return numberProblem({
      prompt: t(
        `For two values of $k$, the function $y = e^{kx}$ satisfies $${equation} = 0$. Find the larger value.`,
        `$k$ 取两个值时，函数 $y = e^{kx}$ 满足 $${equation} = 0$。求较大的值。`,
      ),
      answer: s,
      solveFor: "k",
      mistakes: firstMistakes(s, [
        why(r, `This is the smaller root; the question asks for the larger, $${s}$.`, `这是较小的根；题目问的是较大的根 $${s}$。`),
        why(
          -s,
          "This flips the sign of a root: the factor $(k - a)$ gives the root $a$.",
          "这把根的符号弄反了：因式 $(k - a)$ 给出的根是 $a$。",
        ),
        why(
          -r,
          "This flips the sign of a root: the factor $(k - a)$ gives the root $a$.",
          "这把根的符号弄反了：因式 $(k - a)$ 给出的根是 $a$。",
        ),
        why(b, `This is the coefficient of $y'$, not a value of $k$.`, `这是 $y'$ 的系数，不是 $k$ 的值。`),
      ]),
      solution: walk(
        [
          [
            "Differentiate",
            "求导",
            "By the chain rule, $y' = ke^{kx}$ and $y'' = k^{2}e^{kx}$.",
            "由链式法则，$y' = ke^{kx}$，$y'' = k^{2}e^{kx}$。",
          ],
          [
            "Substitute and divide by $e^{kx}$",
            "代入并除以 $e^{kx}$",
            `The equation becomes $(${quadratic})e^{kx} = 0$, and $e^{kx}$ is never $0$, so $${quadratic} = 0$.`,
            `方程化为 $(${quadratic})e^{kx} = 0$，而 $e^{kx}$ 永不为 $0$，所以 $${quadratic} = 0$。`,
          ],
          [
            "Solve",
            "求解",
            `$${factor(r)}${factor(s)} = 0$, so $k = ${r}$ or $k = ${s}$. The larger is $${s}$.`,
            `$${factor(r)}${factor(s)} = 0$，所以 $k = ${r}$ 或 $k = ${s}$。较大的是 $${s}$。`,
          ],
        ],
        [
          `With $y = e^{${s}x}$, $y' = ${s}y$ and $y'' = ${s * s}y$, so $${equation}$ is $(${s * s} + ${inParens(b * s)} + ${inParens(c)})y = ${s * s + b * s + c}$.`,
          `取 $y = e^{${s}x}$，$y' = ${s}y$，$y'' = ${s * s}y$，所以 $${equation}$ 等于 $(${s * s} + ${inParens(b * s)} + ${inParens(c)})y = ${s * s + b * s + c}$。`,
        ],
      ),
    });
  },
};

const inverseInsideAChain: KnowledgePointDef = {
  id: "an-inverse-function-inside-the-chain-rule",
  title: t("An inverse function inside the chain rule", "链式法则中的反函数"),
  explanation: t(
    "To differentiate $f^{-1}(u(x))$, apply the chain rule and the inverse rule together. The derivative of the outer function at $u$ is one over $f'$ at the point $f^{-1}(u)$, and this is multiplied by $u'(x)$. The value given for $f$ must be read backwards to find the point where $f'$ is needed.\n\nFor example, let $f(2) = 7$, $f'(2) = 4$ and $h(x) = f^{-1}(3x + 1)$. At $x = 2$ the inside is $7$, and $f^{-1}(7) = 2$, so the outer slope is $\\frac{1}{4}$ and $h'(2) = 3 \\cdot \\frac{1}{4}$, which is $\\frac{3}{4}$.\n\nCheck: near $t = 2$, $f(t) \\approx 7 + 4(t - 2)$, so near $y = 7$ the inverse is about $2 + \\frac{y - 7}{4}$. Putting in $y = 3x + 1$ gives $h(x) \\approx 2 + \\frac{3(x - 2)}{4}$, a line of slope $\\frac{3}{4}$.\n\n> **Watch out.** $f'$ is needed at $2$, the point that $f$ sends to $7$, not at $7$ itself. And the factor $3$ from the inside must not be left out.",
    "要求 $f^{-1}(u(x))$ 的导数，要同时用链式法则和反函数法则。外层函数在 $u$ 处的导数是 $f'$ 在 $f^{-1}(u)$ 处的值的倒数，再乘以 $u'(x)$。要反过来读 $f$ 的取值，才能知道需要 $f'$ 在哪一点的值。\n\n例如，设 $f(2) = 7$，$f'(2) = 4$，$h(x) = f^{-1}(3x + 1)$。在 $x = 2$ 处，内层是 $7$，而 $f^{-1}(7) = 2$，所以外层斜率是 $\\frac{1}{4}$，$h'(2) = 3 \\cdot \\frac{1}{4}$，即 $\\frac{3}{4}$。\n\n检验：在 $t = 2$ 附近，$f(t) \\approx 7 + 4(t - 2)$，所以在 $y = 7$ 附近，反函数约为 $2 + \\frac{y - 7}{4}$。代入 $y = 3x + 1$，得 $h(x) \\approx 2 + \\frac{3(x - 2)}{4}$，是斜率为 $\\frac{3}{4}$ 的直线。\n\n> **注意。** 需要的是 $f'$ 在 $2$ 处的值，$2$ 是 $f$ 映到 $7$ 的那个点，而不是 $7$ 本身。内层带来的因子 $3$ 也不能漏掉。",
  ),
  generate(rng) {
    const a = rng.int(2, 6);
    const b = rng.int(1, 9);
    const c = rng.int(1, 5);
    const d = rng.int(1, 6);
    const m = nonzero(rng, 9);
    const v = a * c + b;
    const answer = Q.of(a, m);
    const inner = poly([a, "x"], [b, ""]);
    return numberProblem({
      prompt: t(
        `$f$ is differentiable and one-to-one, with $f(${d}) = ${v}$ and $f'(${d}) = ${m}$. Let $h(x) = f^{-1}(${inner})$. Find $h'(${c})$.`,
        `$f$ 可导且是一一对应，$f(${d}) = ${v}$，$f'(${d}) = ${m}$。设 $h(x) = f^{-1}(${inner})$。求 $h'(${c})$。`,
      ),
      answer,
      wrong: [Q.of(1, m), Q.of(m, a), Q.of(a * m)],
      solution: walk(
        [
          [
            "Find the inner value",
            "求内层的值",
            `At $x = ${c}$ the inside is $${a} \\cdot ${c} + ${b}$, which is $${v}$. Since $f(${d}) = ${v}$, $f^{-1}(${v}) = ${d}$.`,
            `在 $x = ${c}$ 处，内层是 $${a} \\cdot ${c} + ${b}$，即 $${v}$。由于 $f(${d}) = ${v}$，所以 $f^{-1}(${v}) = ${d}$。`,
          ],
          [
            "Use the inverse rule",
            "用反函数法则",
            `The slope of $f^{-1}$ at $${v}$ is one over $f'(${d})$, which is $\\frac{1}{${m}}$.`,
            `$f^{-1}$ 在 $${v}$ 处的斜率是 $f'(${d})$ 的倒数，即 $\\frac{1}{${m}}$。`,
          ],
          [
            "Apply the chain rule",
            "用链式法则",
            `Multiply by the derivative $${a}$ of the inside: $h'(${c})$ is $${a} \\cdot \\frac{1}{${m}}$, which is $${answer.toLatex()}$.`,
            `乘以内层的导数 $${a}$：$h'(${c})$ 等于 $${a} \\cdot \\frac{1}{${m}}$，即 $${answer.toLatex()}$。`,
          ],
        ],
        [
          `Near $t = ${d}$, $f(t) \\approx ${v} + ${inParens(m)}(t - ${d})$, so near $y = ${v}$ the inverse is about $${d} + \\frac{y - ${v}}{${m}}$. Putting in $y = ${inner}$ gives $h(x) \\approx ${d} + \\frac{${a}(x - ${c})}{${m}}$, a line of slope $${answer.toLatex()}$.`,
          `在 $t = ${d}$ 附近，$f(t) \\approx ${v} + ${inParens(m)}(t - ${d})$，所以在 $y = ${v}$ 附近，反函数约为 $${d} + \\frac{y - ${v}}{${m}}$。代入 $y = ${inner}$，得 $h(x) \\approx ${d} + \\frac{${a}(x - ${c})}{${m}}$，是斜率为 $${answer.toLatex()}$ 的直线。`,
        ],
      ),
    });
  },
};

/** toQv turns a wrong value into a rational number. */
const toQv = (v: ReturnType<typeof why>["value"]) => (v instanceof Q ? v : Q.of(Number(v)));

/** distinctWhys keeps the first reason for each wrong value. */
const distinctWhys = (ms: readonly ReturnType<typeof why>[]) =>
  ms.filter((m, i) => ms.findIndex((n) => toQv(n.value).eq(toQv(m.value))) === i);

const troughDepth: KnowledgePointDef = {
  id: "the-rising-depth-in-a-triangular-trough",
  figure: calculusDrawings2["calculating-related-rates-using-similar-triangles#the-rising-depth-in-a-triangular-trough"],
  title: t("The rising depth in a triangular trough", "三角形水槽中上升的水深"),
  explanation: t(
    "Similar triangles relate the width of the water surface to its depth in a trough, so the volume can be written using the depth alone. Differentiating that formula with respect to time relates the inflow to the rate at which the depth rises. Substitute the current depth only after differentiating.\n\nFor example, a trough $5$ m long whose triangular end is $2$ m wide and $2$ m deep has a surface $y$ m wide at depth $y$, so $V = \\frac{1}{2} \\cdot y \\cdot y \\cdot 5 = 2.5y^{2}$ and $\\frac{dV}{dt} = 5y\\frac{dy}{dt}$. With $3$ m³/min flowing in at depth $1$ m, $\\frac{dy}{dt} = \\frac{3}{5} = 0.6$ m/min.\n\nCheck: the surface is then $5 \\times 1 = 5$ m², and $3$ m³ a minute spread over it raises the level $0.6$ m a minute.\n\n> **Watch out.** The surface width at depth $y$ is $\\frac{w}{h}y$, not the top width $w$. Put in the depth only after differentiating.",
    "由相似三角形可以把水面宽度用水深表示，于是体积只含水深一个变量。对时间求导，就得到流入量与水深上升速率的关系。求导之后才代入当前的水深。\n\n例如水槽长 $5$ m，三角形端面宽 $2$ m、深 $2$ m，水深为 $y$ 时水面宽 $y$ m，所以 $V = \\frac{1}{2} \\cdot y \\cdot y \\cdot 5 = 2.5y^{2}$，$\\frac{dV}{dt} = 5y\\frac{dy}{dt}$。每分钟流入 $3$ m³，水深 $1$ m 时，$\\frac{dy}{dt} = \\frac{3}{5} = 0.6$ m/min。\n\n检验：此时水面面积为 $5 \\times 1 = 5$ m²，每分钟 $3$ m³ 的水铺在上面，使水面每分钟上升 $0.6$ m。\n\n> **注意。** 水深为 $y$ 时水面宽为 $\\frac{w}{h}y$，不是顶部宽度 $w$。求导之后才代入水深。",
  ),
  generate(rng) {
    const L = rng.int(2, 10);
    const w = rng.int(1, 4);
    const h = rng.int(2, 6);
    const y = rng.int(1, h - 1);
    const R = rng.int(1, 12);
    const answer = Q.of(R * h, L * w * y);
    const width = Q.of(w * y, h);
    return numberProblem({
      prompt: t(
        `A trough is $${L}$ m long, and its cross section is an isosceles triangle, vertex down, $${w}$ m wide at the top and $${h}$ m deep. Water flows in at $${R}$ m³/min. How fast is the depth rising, in m/min, when the depth is $${y}$ m?`,
        `水槽长 $${L}$ m，横截面是顶点朝下的等腰三角形，顶部宽 $${w}$ m，深 $${h}$ m。水以 $${R}$ m³/min 的速率流入。当水深为 $${y}$ m 时，水深上升的速率是多少 m/min？`,
      ),
      answer,
      mistakes: distinctWhys([
        why(
          Q.of(R * h, 2 * L * w * y),
          "This keeps the $\\frac{1}{2}$ of the triangle's area; the $2$ from differentiating $y^{2}$ cancels it.",
          "这保留了三角形面积中的 $\\frac{1}{2}$；对 $y^{2}$ 求导得到的 $2$ 会把它约掉。",
        ),
        why(
          Q.of(R, L * w),
          `This uses the top width $${w}$ m for the width of the water surface, which is only $${width.toLatex()}$ m at this depth.`,
          `这把顶部宽度 $${w}$ m 当成了水面宽度，而此时水面只有 $${width.toLatex()}$ m 宽。`,
        ),
        why(
          Q.of(R * h, L * w),
          "This leaves out the depth $y$ that comes from differentiating $y^{2}$.",
          "这漏掉了对 $y^{2}$ 求导得到的水深 $y$。",
        ),
      ]),
      solution: walk(
        [
          [
            "Write the volume in the depth",
            "用水深表示体积",
            `By similar triangles the surface is $${poly([Q.of(w, h), "y"])}$ wide at depth $y$, so $V = \\frac{1}{2} \\cdot ${poly([Q.of(w, h), "y"])} \\cdot y \\cdot ${L} = ${poly([Q.of(L * w, 2 * h), "y^2"])}$.`,
            `由相似三角形，水深为 $y$ 时水面宽 $${poly([Q.of(w, h), "y"])}$，所以 $V = \\frac{1}{2} \\cdot ${poly([Q.of(w, h), "y"])} \\cdot y \\cdot ${L} = ${poly([Q.of(L * w, 2 * h), "y^2"])}$。`,
          ],
          [
            "Differentiate",
            "求导",
            `$\\frac{dV}{dt} = ${poly([Q.of(L * w, h), "y"])}\\frac{dy}{dt}$.`,
            `$\\frac{dV}{dt} = ${poly([Q.of(L * w, h), "y"])}\\frac{dy}{dt}$。`,
          ],
          [
            "Substitute and solve",
            "代入并求解",
            `With $y = ${y}$ and $\\frac{dV}{dt} = ${R}$: $${R} = ${Q.of(L * w * y, h).toLatex()}\\frac{dy}{dt}$, so $\\frac{dy}{dt} = ${answer.toLatex()}$.`,
            `代入 $y = ${y}$，$\\frac{dV}{dt} = ${R}$：$${R} = ${Q.of(L * w * y, h).toLatex()}\\frac{dy}{dt}$，所以 $\\frac{dy}{dt} = ${answer.toLatex()}$。`,
          ],
        ],
        [
          `At depth $${y}$ m the water surface is $${L}$ m by $${width.toLatex()}$ m, an area of $${width.mul(Q.of(L)).toLatex()}$ m². Spreading $${R}$ m³ a minute over it raises the level $${R} \\div ${width.mul(Q.of(L)).toLatex()} = ${answer.toLatex()}$ m a minute.`,
          `水深 $${y}$ m 时水面为 $${L}$ m 乘 $${width.toLatex()}$ m，面积为 $${width.mul(Q.of(L)).toLatex()}$ m²。每分钟 $${R}$ m³ 的水铺在上面，使水面每分钟上升 $${R} \\div ${width.mul(Q.of(L)).toLatex()} = ${answer.toLatex()}$ m。`,
        ],
      ),
    });
  },
};

const coneWithALeak: KnowledgePointDef = {
  id: "a-conical-tank-with-a-leak",
  figure: calculusDrawings2["calculating-related-rates-with-cones#a-conical-tank-with-a-leak"],
  title: t("A conical tank with a leak", "有渗漏的圆锥形水箱"),
  explanation: t(
    "When water flows in and out at once, $\\frac{dV}{dt}$ is the inflow minus the outflow. The geometry of the cone gives $\\frac{dV}{dt}$ from the depth and its rate, because the surface radius is a fixed fraction of the depth. So the inflow is this net rate plus the leak.\n\nFor example, in a cone of top radius $2$ m and height $4$ m, water $2$ m deep has surface radius $1$ m. If the depth rises at $\\frac{1}{2}$ m/min, $\\frac{dV}{dt} = \\pi(1)^{2} \\cdot \\frac{1}{2} = \\frac{\\pi}{2}$ m³/min. With a leak of $3\\pi$ m³/min, the inflow is $3.5\\pi$ m³/min.\n\nCheck: $3.5\\pi$ in minus $3\\pi$ out leaves $\\frac{\\pi}{2}$, which is the surface area $\\pi$ times the rise $\\frac{1}{2}$.\n\n> **Watch out.** $\\frac{dV}{dt}$ is the net rate. The pump must supply that and also replace what leaks out, so add the leak.",
    "水同时流入和流出时，$\\frac{dV}{dt}$ 等于流入量减流出量。由于水面半径是水深的固定比例，圆锥的几何关系可以由水深及其变化率给出 $\\frac{dV}{dt}$。所以流入量等于这个净速率加上渗漏量。\n\n例如顶部半径 $2$ m、高 $4$ m 的圆锥中，深 $2$ m 的水面半径为 $1$ m。若水深以 $\\frac{1}{2}$ m/min 上升，则 $\\frac{dV}{dt} = \\pi(1)^{2} \\cdot \\frac{1}{2} = \\frac{\\pi}{2}$ m³/min。渗漏 $3\\pi$ m³/min 时，流入量是 $3.5\\pi$ m³/min。\n\n检验：流入 $3.5\\pi$ 减去流出 $3\\pi$ 剩下 $\\frac{\\pi}{2}$，正是水面面积 $\\pi$ 乘以上升速率 $\\frac{1}{2}$。\n\n> **注意。** $\\frac{dV}{dt}$ 是净速率。泵既要提供这部分，还要补上渗漏的水，所以要加上渗漏量。",
  ),
  generate(rng) {
    const R = rng.int(1, 5);
    const H = rng.int(3, 10);
    const y = rng.int(1, H - 1);
    const leak = rng.int(1, 9);
    const rate = Q.of(1, rng.pick([2, 3, 4, 5]));
    const net = Q.of(R * R * y * y, H * H).mul(rate);
    const answer = net.add(Q.of(leak));
    const r = Q.of(R * y, H);
    return numberProblem({
      prompt: t(
        `A conical tank, vertex down, has top radius $${R}$ m and height $${H}$ m. Water leaks out at $${leak}\\pi$ m³/min while being pumped in. At depth $${y}$ m, the depth is rising at $${rate.toLatex()}$ m/min. The inflow is $c\\pi$ m³/min. Find $c$.`,
        `圆锥形水箱顶点朝下，顶部半径 $${R}$ m，高 $${H}$ m。水以 $${leak}\\pi$ m³/min 的速率渗漏，同时被泵入。水深 $${y}$ m 时，水深正以 $${rate.toLatex()}$ m/min 的速率上升。流入量是 $c\\pi$ m³/min。求 $c$。`,
      ),
      answer,
      mistakes: distinctWhys([
        why(
          net,
          "This is only the net rate $\\frac{dV}{dt}$; the pump must also replace the water that leaks out.",
          "这只是净速率 $\\frac{dV}{dt}$；泵还要补上渗漏的水。",
        ),
        why(
          net.sub(Q.of(leak)),
          "This subtracts the leak. Inflow minus leak is the net rate, so the inflow is the net rate plus the leak.",
          "这是减去了渗漏量。流入量减渗漏量等于净速率，所以流入量是净速率加渗漏量。",
        ),
        why(Q.of(leak).sub(net), "This is the leak minus the net rate; the inflow is their sum.", "这是渗漏量减净速率；流入量是两者之和。"),
      ]),
      solution: walk(
        [
          [
            "Find the net rate",
            "求净速率",
            `The surface radius at depth $y$ is $${poly([Q.of(R, H), "y"])}$, so $\\frac{dV}{dt} = \\pi\\left(${Q.of(R, H).toLatex()}\\right)^2y^2\\frac{dy}{dt} = \\pi\\left(${Q.of(R, H).toLatex()}\\right)^2(${y})^{2} \\cdot ${rate.toLatex()} = ${net.toLatex()}\\pi$.`,
            `水深为 $y$ 时水面半径是 $${poly([Q.of(R, H), "y"])}$，所以 $\\frac{dV}{dt} = \\pi\\left(${Q.of(R, H).toLatex()}\\right)^2y^2\\frac{dy}{dt} = \\pi\\left(${Q.of(R, H).toLatex()}\\right)^2(${y})^{2} \\cdot ${rate.toLatex()} = ${net.toLatex()}\\pi$。`,
          ],
          [
            "Add the leak",
            "加上渗漏量",
            `Inflow minus $${leak}\\pi$ equals the net rate, so $c = ${net.toLatex()} + ${leak} = ${answer.toLatex()}$.`,
            `流入量减去 $${leak}\\pi$ 等于净速率，所以 $c = ${net.toLatex()} + ${leak} = ${answer.toLatex()}$。`,
          ],
        ],
        [
          `At depth $${y}$ m the surface has radius $${r.toLatex()}$ m and area $${r.mul(r).toLatex()}\\pi$ m²; rising $${rate.toLatex()}$ m a minute, the water gains $${r.mul(r).toLatex()} \\cdot ${rate.toLatex()} = ${net.toLatex()}$ times $\\pi$ m³ a minute, which is $${answer.toLatex()}\\pi$ in minus $${leak}\\pi$ out.`,
          `水深 $${y}$ m 时水面半径为 $${r.toLatex()}$ m，面积为 $${r.mul(r).toLatex()}\\pi$ m²；每分钟上升 $${rate.toLatex()}$ m，水每分钟增加 $${r.mul(r).toLatex()} \\cdot ${rate.toLatex()} = ${net.toLatex()}$ 乘 $\\pi$ m³，正是流入 $${answer.toLatex()}\\pi$ 减去流出 $${leak}\\pi$。`,
        ],
      ),
    });
  },
};

const boxDiagonal: KnowledgePointDef = {
  id: "the-rate-of-the-diagonal-of-a-box",
  title: t("The rate of the diagonal of a box", "长方体对角线的变化率"),
  explanation: t(
    "The diagonal of a box satisfies $\\ell^2 = a^2 + b^2 + c^2$. Differentiating with respect to time and cancelling the factor of two gives $\\ell\\frac{d\\ell}{dt} = a\\frac{da}{dt} + b\\frac{db}{dt} + c\\frac{dc}{dt}$. So the current length of the diagonal divides a weighted sum of the edge rates.\n\nFor example, a box with edges $1$, $2$ and $2$ has diagonal $3$. If every edge grows at $1$, then $3\\frac{d\\ell}{dt} = 1 + 2 + 2 = 5$ and $\\frac{d\\ell}{dt} = \\frac{5}{3}$.\n\nCheck: $0.01$ later the edges are $1.01$, $2.01$ and $2.01$, the diagonal is $\\sqrt{9.1003} \\approx 3.0167$, an increase of $0.0167$ in $0.01$, about $1.67$.\n\n> **Watch out.** Divide by the diagonal $\\ell$, not by the sum of the edges. A shrinking edge has a negative rate.",
    "长方体的对角线满足 $\\ell^2 = a^2 + b^2 + c^2$。对时间求导并约去因子二，得 $\\ell\\frac{d\\ell}{dt} = a\\frac{da}{dt} + b\\frac{db}{dt} + c\\frac{dc}{dt}$。所以对角线的当前长度要除棱长变化率的加权和。\n\n例如棱长为 $1$、$2$、$2$ 的长方体，对角线为 $3$。若每条棱都以 $1$ 增长，则 $3\\frac{d\\ell}{dt} = 1 + 2 + 2 = 5$，$\\frac{d\\ell}{dt} = \\frac{5}{3}$。\n\n检验：经过 $0.01$，棱长为 $1.01$、$2.01$、$2.01$，对角线为 $\\sqrt{9.1003} \\approx 3.0167$，在 $0.01$ 内增加 $0.0167$，约为 $1.67$。\n\n> **注意。** 要除以对角线 $\\ell$，不是棱长之和。缩短的棱变化率为负。",
  ),
  generate(rng) {
    const [a, b, c, d] = rng.pick([
      [1, 2, 2, 3],
      [2, 3, 6, 7],
      [1, 4, 8, 9],
      [2, 6, 9, 11],
      [4, 4, 7, 9],
    ] as const);
    const ra = nonzero(rng, 5);
    const rb = nonzero(rng, 5);
    const rc = nonzero(rng, 5);
    const sum = a * ra + b * rb + c * rc;
    const answer = Q.of(sum, d);
    const e = 0.001;
    const later = Math.hypot(a + e * ra, b + e * rb, c + e * rc);
    return numberProblem({
      prompt: t(
        `At one moment the edges of a box are $${a}$, $${b}$ and $${c}$ cm, and they are changing at $${ra}$, $${rb}$ and $${rc}$ cm/s respectively. How fast is the diagonal changing, in cm/s?`,
        `某一时刻长方体的棱长是 $${a}$、$${b}$、$${c}$ cm，变化率依次是 $${ra}$、$${rb}$、$${rc}$ cm/s。对角线的变化率是多少 cm/s？`,
      ),
      answer,
      mistakes: distinctWhys([
        why(
          Q.of(ra + rb + rc),
          "This adds the edge rates; each must be weighted by its edge and the sum divided by the diagonal.",
          "这是把棱长变化率相加；每个变化率都要乘以对应的棱长，再把和除以对角线。",
        ),
        why(
          Q.of(sum, a + b + c),
          `This divides by the sum of the edges, $${a + b + c}$, instead of the diagonal $${d}$.`,
          `这是除以棱长之和 $${a + b + c}$，而应该除以对角线 $${d}$。`,
        ),
        why(
          Q.of(sum, 2 * d),
          "This keeps a $2$ on one side only; the $2$s from all four squares cancel.",
          "这只在一边保留了 $2$；四个平方求导得到的 $2$ 都会约掉。",
        ),
      ]),
      solution: walk(
        [
          [
            "Find the diagonal",
            "求对角线",
            `$\\ell = \\sqrt{${a * a} + ${b * b} + ${c * c}} = ${d}$.`,
            `$\\ell = \\sqrt{${a * a} + ${b * b} + ${c * c}} = ${d}$。`,
          ],
          [
            "Differentiate and substitute",
            "求导并代入",
            `$${d}\\frac{d\\ell}{dt} = ${a}${inParensAll(ra)} + ${b}${inParensAll(rb)} + ${c}${inParensAll(rc)} = ${sum}$, so $\\frac{d\\ell}{dt} = ${answer.toLatex()}$.`,
            `$${d}\\frac{d\\ell}{dt} = ${a}${inParensAll(ra)} + ${b}${inParensAll(rb)} + ${c}${inParensAll(rc)} = ${sum}$，所以 $\\frac{d\\ell}{dt} = ${answer.toLatex()}$。`,
          ],
        ],
        [
          `$0.001$ s later the edges are $${num(a + e * ra)}$, $${num(b + e * rb)}$ and $${num(c + e * rc)}$, and the diagonal is about $${later.toFixed(5)}$. The change divided by $0.001$ is about $${num((later - d) / e)}$, close to $${answer.toLatex()}${approx(answer)}$.`,
          `$0.001$ s 后棱长为 $${num(a + e * ra)}$、$${num(b + e * rb)}$、$${num(c + e * rc)}$，对角线约为 $${later.toFixed(5)}$。变化量除以 $0.001$ 约为 $${num((later - d) / e)}$，接近 $${answer.toLatex()}${approx(answer)}$。`,
        ],
      ),
    });
  },
};

/** inParensAll writes a number in parentheses, for use as a factor: "(3)", "(-2)". */
const inParensAll = (n: number) => `(${n})`;

const zeroTimesInfinity: KnowledgePointDef = {
  id: "lhopitals-rule-for-zero-times-infinity",
  title: t("L'Hopital's rule for zero times infinity", "零乘无穷型的洛必达法则"),
  explanation: t(
    "L'Hopital's rule applies only to quotients, so a product of the form $0 \\cdot \\infty$ must be rewritten first. Moving the growing factor into a denominator gives a $\\frac{0}{0}$ form: $x \\cdot g\\left(\\frac{1}{x}\\right) = \\frac{g(1/x)}{1/x}$. Then the rule applies as usual.\n\nFor example, put $u = \\frac{1}{x}$ in $\\lim_{x \\to \\infty} x\\sin\\left(\\frac{2}{x}\\right)$: it becomes $\\lim_{u \\to 0^{+}}\\frac{\\sin(2u)}{u}$, a $\\frac{0}{0}$ form, and the rule gives $\\lim_{u \\to 0^{+}}\\frac{2\\cos(2u)}{1} = 2$.\n\nCheck: at $x = 1000$, $1000\\sin(0.002) \\approx 1.999999$.\n\n> **Watch out.** $0 \\cdot \\infty$ is not $0$: one factor shrinks while the other grows. Rewrite the product as a quotient before differentiating.",
    "洛必达法则只适用于商，所以 $0 \\cdot \\infty$ 型的乘积要先改写。把增长的因子移到分母，就得到 $\\frac{0}{0}$ 型：$x \\cdot g\\left(\\frac{1}{x}\\right) = \\frac{g(1/x)}{1/x}$。然后照常使用法则。\n\n例如在 $\\lim_{x \\to \\infty} x\\sin\\left(\\frac{2}{x}\\right)$ 中令 $u = \\frac{1}{x}$：它变为 $\\lim_{u \\to 0^{+}}\\frac{\\sin(2u)}{u}$，是 $\\frac{0}{0}$ 型，由法则得 $\\lim_{u \\to 0^{+}}\\frac{2\\cos(2u)}{1} = 2$。\n\n检验：在 $x = 1000$ 处，$1000\\sin(0.002) \\approx 1.999999$。\n\n> **注意。** $0 \\cdot \\infty$ 不是 $0$：一个因子变小，另一个变大。求导之前先把乘积改写成商。",
  ),
  generate(rng) {
    const a = rng.int(1, 9);
    const b = rng.int(1, 5);
    const kind = rng.int(0, 2);
    const au = a === 1 ? "u" : `${a}u`;
    const [piece, top, dTop, g] = [
      [`\\sin\\left(\\frac{${a}}{x}\\right)`, `\\sin(${au})`, `${a === 1 ? "" : a}\\cos(${au})`, (z: number) => Math.sin(z)],
      [`\\left(e^{${a}/x} - 1\\right)`, `e^{${au}} - 1`, `${a === 1 ? "" : a}e^{${au}}`, (z: number) => Math.exp(z) - 1],
      [`\\ln\\left(1 + \\frac{${a}}{x}\\right)`, `\\ln(1 + ${au})`, `\\frac{${a}}{1 + ${au}}`, (z: number) => Math.log(1 + z)],
    ][kind] as [string, string, string, (z: number) => number];
    const answer = a * b;
    const front = poly([b, "x"]);
    const big = 1000;
    return numberProblem({
      prompt: t(`Find $\\lim_{x \\to \\infty} ${front}${piece}$.`, `求 $\\lim_{x \\to \\infty} ${front}${piece}$。`),
      answer,
      form: "integer",
      mistakes: distinctWhys([
        why(
          0,
          "This takes $0 \\cdot \\infty$ to be $0$. The first factor grows while the second shrinks, so the product needs rewriting as a quotient.",
          "这把 $0 \\cdot \\infty$ 当成了 $0$。第一个因子变大，第二个变小，所以要把乘积改写成商。",
        ),
        why(a, `This leaves out the factor $${b}$ in front.`, `这漏掉了前面的因子 $${b}$。`),
        why(
          b,
          `This leaves out the factor $${a}$ that the chain rule brings out of $${a === 1 ? "u" : `${a}u`}$.`,
          `这漏掉了链式法则从 $${a === 1 ? "u" : `${a}u`}$ 带出的因子 $${a}$。`,
        ),
        why(
          a + b,
          `This adds the factors $${a}$ and $${b}$; the limit is their product.`,
          `这是把因子 $${a}$ 和 $${b}$ 相加；极限是它们的积。`,
        ),
      ]),
      solution: walk(
        [
          [
            "Rewrite as a quotient",
            "改写成商",
            `Put $u = \\frac{1}{x}$, so $u \\to 0^{+}$ as $x \\to \\infty$: the limit is $\\lim_{u \\to 0^{+}}\\frac{${b === 1 ? "" : b}\\left(${top}\\right)}{u}$, a $\\frac{0}{0}$ form.`,
            `令 $u = \\frac{1}{x}$，当 $x \\to \\infty$ 时 $u \\to 0^{+}$：极限为 $\\lim_{u \\to 0^{+}}\\frac{${b === 1 ? "" : b}\\left(${top}\\right)}{u}$，是 $\\frac{0}{0}$ 型。`,
          ],
          [
            "Apply L'Hopital's rule",
            "使用洛必达法则",
            `The derivative of the bottom is $1$, so the limit is $\\lim_{u \\to 0^{+}} ${b === 1 ? "" : `${b} \\cdot `}${dTop} = ${b} \\cdot ${a} = ${answer}$.`,
            `分母的导数是 $1$，所以极限为 $\\lim_{u \\to 0^{+}} ${b === 1 ? "" : `${b} \\cdot `}${dTop} = ${b} \\cdot ${a} = ${answer}$。`,
          ],
        ],
        [
          `At $x = ${big}$ the product is $${b * big}${piece.replaceAll("x", String(big))} \\approx ${num(b * big * g(a / big))}$, close to $${answer}$.`,
          `在 $x = ${big}$ 处乘积为 $${b * big}${piece.replaceAll("x", String(big))} \\approx ${num(b * big * g(a / big))}$，接近 $${answer}$。`,
        ],
      ),
    });
  },
};

const boundFromMeanValue: KnowledgePointDef = {
  id: "a-bound-on-a-function-from-the-mean-value-theorem",
  title: t("A bound on a function from the mean value theorem", "由中值定理得到函数的界"),
  explanation: t(
    "The mean value theorem says $f(b) - f(a) = f'(c)(b - a)$ for some $c$ in the interval. So a bound on the derivative becomes a bound on the change of the function: if $f'$ never exceeds $M$, then $f(b)$ is at most $f(a) + M(b - a)$. A lower bound on $f'$ works the same way. For example, if $f(1) = 2$ and $f'(x) \\le 3$ on $[1, 5]$, then $f(5) \\le 2 + 3 \\cdot 4 = 14$.\n\nCheck: the line $g(x) = 3x - 1$ has $g'(x) = 3$, $g(1) = 2$ and $g(5) = 14$, so the bound $14$ is reached and cannot be improved.\n\n> **Watch out.** Multiply the bound on $f'$ by the length $b - a$ of the interval, here $4$, not by the endpoint $b = 5$.",
    "中值定理说，区间内存在 $c$ 使 $f(b) - f(a) = f'(c)(b - a)$。所以导数的界就变成函数变化量的界：如果 $f'$ 不超过 $M$，则 $f(b)$ 至多是 $f(a) + M(b - a)$。导数的下界同理。例如，若 $f(1) = 2$，且在 $[1, 5]$ 上 $f'(x) \\le 3$，则 $f(5) \\le 2 + 3 \\cdot 4 = 14$。\n\n检验：直线 $g(x) = 3x - 1$ 满足 $g'(x) = 3$，$g(1) = 2$，$g(5) = 14$，所以界 $14$ 能够取到，不能再改进。\n\n> **注意。** 导数的界要乘以区间长度 $b - a$，这里是 $4$，而不是乘以端点 $b = 5$。",
  ),
  generate(rng) {
    const a = rng.int(0, 5);
    const w = rng.int(2, 7);
    const b = a + w;
    const v = rng.int(-9, 9);
    const M = nonzero(rng, 6);
    const upper = rng.int(0, 1) === 0;
    const answer = v + M * w;
    const shifted = a === 0 ? "x" : `(x - ${a})`;
    return numberProblem({
      prompt: t(
        `$f$ is differentiable on $[${a}, ${b}]$, with $f(${a}) = ${v}$ and $f'(x) ${upper ? "\\le" : "\\ge"} ${M}$ throughout. What is the ${upper ? "largest" : "smallest"} possible value of $f(${b})$?`,
        `$f$ 在 $[${a}, ${b}]$ 上可导，$f(${a}) = ${v}$，且处处有 $f'(x) ${upper ? "\\le" : "\\ge"} ${M}$。$f(${b})$ 的${upper ? "最大" : "最小"}可能值是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [v + M, M * w, v + M * b],
      solution: walk(
        [
          [
            "Apply the mean value theorem",
            "应用中值定理",
            `For some $c$ in $(${a}, ${b})$, $f(${b}) - f(${a}) = f'(c) \\cdot ${w}$, and $f'(c) ${upper ? "\\le" : "\\ge"} ${M}$, so the change is ${upper ? "at most" : "at least"} $${M} \\cdot ${w} = ${M * w}$.`,
            `存在 $(${a}, ${b})$ 内的 $c$，使 $f(${b}) - f(${a}) = f'(c) \\cdot ${w}$，而 $f'(c) ${upper ? "\\le" : "\\ge"} ${M}$，所以变化量${upper ? "至多" : "至少"}是 $${M} \\cdot ${w} = ${M * w}$。`,
          ],
          [
            "Add the starting value",
            "加上起始值",
            `So $f(${b})$ is ${upper ? "at most" : "at least"} $${v} + ${inParens(M * w)} = ${answer}$.`,
            `所以 $f(${b})$ ${upper ? "至多" : "至少"}是 $${v} + ${inParens(M * w)} = ${answer}$。`,
          ],
        ],
        [
          `The line $g(x) = ${v} + ${inParens(M)}${shifted}$ has $g'(x) = ${M}$ everywhere and $g(${a}) = ${v}$, and $g(${b}) = ${v} + ${inParens(M)} \\cdot ${w} = ${answer}$. So the bound is reached, and it is the ${upper ? "largest" : "smallest"} possible value.`,
          `直线 $g(x) = ${v} + ${inParens(M)}${shifted}$ 处处满足 $g'(x) = ${M}$，且 $g(${a}) = ${v}$，$g(${b}) = ${v} + ${inParens(M)} \\cdot ${w} = ${answer}$。所以这个界能够取到，它就是${upper ? "最大" : "最小"}可能值。`,
        ],
      ),
    });
  },
};

const cubicFromExtrema: KnowledgePointDef = {
  id: "coefficients-of-a-cubic-from-its-extrema",
  title: t("Coefficients of a cubic from its extrema", "由极值点求三次函数的系数"),
  explanation: t(
    "The critical points of a cubic are the roots of its derivative. If $f(x) = x^3 + ax^2 + bx + c$ has them at $p$ and $q$, then $f'(x) = 3(x - p)(x - q)$. Expanding and matching with $3x^2 + 2ax + b$ gives the coefficients. The constant $c$ does not affect where the extrema are. For extrema at $-1$ and $3$,\n\n$$f'(x) = 3(x + 1)(x - 3) = 3x^2 - 6x - 9,$$\n\nso $2a = -6$, giving $a = -3$, and $b = -9$.\n\nCheck: with these values, $f'(-1) = 3 + 6 - 9 = 0$ and $f'(3) = 27 - 18 - 9 = 0$.\n\n> **Watch out.** The coefficient of $x$ in $f'$ is $2a$, not $a$: divide it by $2$.",
    "三次函数的临界点是导数的根。如果 $f(x) = x^3 + ax^2 + bx + c$ 的临界点是 $p$ 和 $q$，则 $f'(x) = 3(x - p)(x - q)$。展开后与 $3x^2 + 2ax + b$ 比较，就得到系数。常数 $c$ 不影响极值点的位置。若极值点是 $-1$ 和 $3$，\n\n$$f'(x) = 3(x + 1)(x - 3) = 3x^2 - 6x - 9,$$\n\n所以 $2a = -6$，得 $a = -3$，而 $b = -9$。\n\n检验：用这些值，$f'(-1) = 3 + 6 - 9 = 0$，$f'(3) = 27 - 18 - 9 = 0$。\n\n> **注意。** $f'$ 中 $x$ 的系数是 $2a$，不是 $a$：要除以 $2$。",
  ),
  generate(rng) {
    const p = nonzero(rng, 6);
    const q = rng.pick(range(p + 1, p + 6).filter((v) => v !== 0 && p + v !== 0));
    const askA = rng.int(0, 1) === 0;
    const a = Q.of(-3 * (p + q), 2);
    const b = 3 * p * q;
    const answer = askA ? a : Q.of(b);
    const expanded = poly([3, "x^2"], [-3 * (p + q), "x"], [b, ""]);
    const at = (x: number) => `3 \\cdot ${inParens(x)}^{2} + ${inParens(-3 * (p + q))} \\cdot ${inParens(x)} + ${inParens(b)} = 0`;
    return numberProblem({
      prompt: t(
        `$f(x) = x^3 + ax^2 + bx + 1$ has a local maximum at $x = ${p}$ and a local minimum at $x = ${q}$. Find $${askA ? "a" : "b"}$.`,
        `$f(x) = x^3 + ax^2 + bx + 1$ 在 $x = ${p}$ 处有极大值，在 $x = ${q}$ 处有极小值。求 $${askA ? "a" : "b"}$。`,
      ),
      answer,
      wrong: askA ? [a.neg(), Q.of(-(p + q)), Q.of(b)] : [Q.of(p * q), Q.of(-b), a],
      solution: walk(
        [
          [
            "Write the derivative from its roots",
            "由根写出导数",
            `$f'$ has leading coefficient $3$ and roots $${p}$ and $${q}$:\n\n$$f'(x) = 3(${poly([1, "x"], [-p, ""])})(${poly([1, "x"], [-q, ""])}) = ${expanded}$$`,
            `$f'$ 的首项系数是 $3$，根是 $${p}$ 和 $${q}$：\n\n$$f'(x) = 3(${poly([1, "x"], [-p, ""])})(${poly([1, "x"], [-q, ""])}) = ${expanded}$$`,
          ],
          [
            "Match coefficients",
            "比较系数",
            `Comparing with $3x^2 + 2ax + b$: $2a = ${-3 * (p + q)}$ and $b = ${b}$, so $${askA ? "a" : "b"} = ${answer.toLatex()}$.`,
            `与 $3x^2 + 2ax + b$ 比较：$2a = ${-3 * (p + q)}$，$b = ${b}$，所以 $${askA ? "a" : "b"} = ${answer.toLatex()}$。`,
          ],
        ],
        [
          `Put the roots back into $f'$:\n\n$$f'(${p}) = ${at(p)}$$\n\n$$f'(${q}) = ${at(q)}$$\n\nAlso $f''(${p}) = ${3 * (p - q)} < 0$, so $x = ${p}$ is indeed the maximum.`,
          `把根代回 $f'$：\n\n$$f'(${p}) = ${at(p)}$$\n\n$$f'(${q}) = ${at(q)}$$\n\n并且 $f''(${p}) = ${3 * (p - q)} < 0$，所以 $x = ${p}$ 确实是极大值点。`,
        ],
      ),
    });
  },
};

const quarticFromInflections: KnowledgePointDef = {
  id: "coefficients-of-a-quartic-from-its-inflection-points",
  title: t("Coefficients of a quartic from its inflection points", "由拐点求四次函数的系数"),
  explanation: t(
    "A point of inflection of a quartic is a place where its second derivative changes sign, so its $x$-coordinate is a simple root of $f''$. If $f(x) = x^4 + ax^3 + bx^2$ has them at $p$ and $q$, then $f''(x) = 12(x - p)(x - q)$. Matching this with $12x^2 + 6ax + 2b$ gives the coefficients. For inflection points at $1$ and $2$,\n\n$$f''(x) = 12(x - 1)(x - 2) = 12x^2 - 36x + 24,$$\n\nso $6a = -36$ and $2b = 24$, giving $a = -6$ and $b = 12$.\n\nCheck: $f''(1) = 12 - 36 + 24 = 0$ and $f''(2) = 48 - 72 + 24 = 0$, and $f''(1.5) = -3 < 0$ between them, so the sign does change.\n\n> **Watch out.** In $f''$ the coefficient of $x$ is $6a$ and the constant is $2b$: divide by $6$ and by $2$, not by $12$.",
    "四次函数的拐点是二阶导数变号的地方，所以它的横坐标是 $f''$ 的单根。如果 $f(x) = x^4 + ax^3 + bx^2$ 的拐点在 $p$ 和 $q$，则 $f''(x) = 12(x - p)(x - q)$。与 $12x^2 + 6ax + 2b$ 比较，就得到系数。若拐点在 $1$ 和 $2$，\n\n$$f''(x) = 12(x - 1)(x - 2) = 12x^2 - 36x + 24,$$\n\n所以 $6a = -36$，$2b = 24$，得 $a = -6$，$b = 12$。\n\n检验：$f''(1) = 12 - 36 + 24 = 0$，$f''(2) = 48 - 72 + 24 = 0$，而两者之间 $f''(1.5) = -3 < 0$，所以符号确实改变。\n\n> **注意。** $f''$ 中 $x$ 的系数是 $6a$，常数项是 $2b$：分别除以 $6$ 和 $2$，不是除以 $12$。",
  ),
  generate(rng) {
    const p = nonzero(rng, 6);
    const q = rng.pick(range(p + 1, p + 6).filter((v) => v !== 0 && p + v !== 0));
    const askA = rng.int(0, 1) === 0;
    const a = -2 * (p + q);
    const b = 6 * p * q;
    const answer = askA ? a : b;
    const expanded = poly([12, "x^2"], [-12 * (p + q), "x"], [12 * p * q, ""]);
    const at = (x: number) =>
      `12 \\cdot ${inParens(x)}^{2} + ${inParens(-12 * (p + q))} \\cdot ${inParens(x)} + ${inParens(12 * p * q)} = 0`;
    const mid = (p + q) / 2;
    return numberProblem({
      prompt: t(
        `$f(x) = x^4 + ax^3 + bx^2$ has points of inflection at $x = ${p}$ and $x = ${q}$. Find $${askA ? "a" : "b"}$.`,
        `$f(x) = x^4 + ax^3 + bx^2$ 的拐点在 $x = ${p}$ 和 $x = ${q}$ 处。求 $${askA ? "a" : "b"}$。`,
      ),
      answer,
      form: "integer",
      wrong: askA ? [-a, -(p + q), b] : [p * q, 12 * p * q, a],
      solution: walk(
        [
          [
            "Write the second derivative from its roots",
            "由根写出二阶导数",
            `$f''$ has leading coefficient $12$ and changes sign at $${p}$ and $${q}$:\n\n$$f''(x) = 12(${poly([1, "x"], [-p, ""])})(${poly([1, "x"], [-q, ""])}) = ${expanded}$$`,
            `$f''$ 的首项系数是 $12$，在 $${p}$ 和 $${q}$ 处变号：\n\n$$f''(x) = 12(${poly([1, "x"], [-p, ""])})(${poly([1, "x"], [-q, ""])}) = ${expanded}$$`,
          ],
          [
            "Match coefficients",
            "比较系数",
            `Comparing with $12x^2 + 6ax + 2b$: $6a = ${-12 * (p + q)}$ and $2b = ${12 * p * q}$, so $${askA ? "a" : "b"} = ${answer}$.`,
            `与 $12x^2 + 6ax + 2b$ 比较：$6a = ${-12 * (p + q)}$，$2b = ${12 * p * q}$，所以 $${askA ? "a" : "b"} = ${answer}$。`,
          ],
        ],
        [
          `Put the roots back:\n\n$$f''(${p}) = ${at(p)}$$\n\n$$f''(${q}) = ${at(q)}$$\n\nBetween them $f''(${num(mid)}) = ${num(12 * (mid - p) * (mid - q))} < 0$, while outside it is positive, so both are true inflection points.`,
          `把根代回：\n\n$$f''(${p}) = ${at(p)}$$\n\n$$f''(${q}) = ${at(q)}$$\n\n在两者之间 $f''(${num(mid)}) = ${num(12 * (mid - p) * (mid - q))} < 0$，而在外侧为正，所以两者都是真正的拐点。`,
        ],
      ),
    });
  },
};

const linearizationError: KnowledgePointDef = {
  id: "bounding-the-error-of-a-linearization",
  title: t("Bounding the error of a linearization", "线性近似的误差界"),
  explanation: t(
    "A tangent line departs from a curve because of curvature, so the error depends on the second derivative. If $|f''| \\le M$ between $a$ and $x$, then $|f(x) - L(x)| \\le \\frac{M}{2}(x - a)^2$. Because of the square, moving ten times closer makes the error bound a hundred times smaller. For $L$ at $a = 1$ with $|f''| \\le 4$, the bound at $x = 1.1$ is\n\n$$\\frac{4}{2}(0.1)^{2} = 0.02.$$\n\nCheck: $f(x) = 2x^{2}$ has $f'' = 4$, and its tangent at $1$ is $L(x) = 4x - 2$. Then $f(1.1) - L(1.1) = 2.42 - 2.4 = 0.02$, exactly the bound.\n\n> **Watch out.** Square the distance $x - a$ and halve $M$. Forgetting the square or the half gives a bound that is far too big.",
    "切线偏离曲线是因为曲线弯曲，所以误差取决于二阶导数。如果在 $a$ 与 $x$ 之间 $|f''| \\le M$，则 $|f(x) - L(x)| \\le \\frac{M}{2}(x - a)^2$。由于有平方，距离缩小到十分之一时，误差界缩小到百分之一。对 $a = 1$ 处的 $L$，若 $|f''| \\le 4$，则在 $x = 1.1$ 处误差界为\n\n$$\\frac{4}{2}(0.1)^{2} = 0.02.$$\n\n检验：$f(x) = 2x^{2}$ 有 $f'' = 4$，它在 $1$ 处的切线是 $L(x) = 4x - 2$。于是 $f(1.1) - L(1.1) = 2.42 - 2.4 = 0.02$，正好等于误差界。\n\n> **注意。** 要把距离 $x - a$ 平方，并把 $M$ 减半。漏掉平方或一半，得到的误差界会大得多。",
  ),
  generate(rng) {
    const a = rng.int(1, 5);
    const d = rng.int(1, 9);
    const M = rng.int(1, 12);
    const answer = Q.of(M * d * d, 200);
    const h = Q.of(d, 10);
    const half = Q.of(M, 2);
    const x = Q.of(a).add(h);
    const g = half.mul(x).mul(x);
    const l = half.mul(Q.of(a * a)).add(Q.of(M * a).mul(h));
    const lead = half.eq(Q.one) ? "" : half.toLatex();
    return numberProblem({
      prompt: t(
        `$L$ is the linearization of $f$ at $x = ${a}$, and $|f''(x)| \\le ${M}$ between $${a}$ and $${a}.${d}$. What upper bound does the error formula give for $|f(${a}.${d}) - L(${a}.${d})|$?`,
        `$L$ 是 $f$ 在 $x = ${a}$ 处的线性近似，在 $${a}$ 与 $${a}.${d}$ 之间 $|f''(x)| \\le ${M}$。误差公式给出的 $|f(${a}.${d}) - L(${a}.${d})|$ 的上界是多少？`,
      ),
      answer,
      wrong: [Q.of(M * d, 10), Q.of(M * d * d, 100), Q.of(M * d, 20)],
      solution: walk(
        [
          [
            "Find the distance",
            "求距离",
            `The distance from the center is $${a}.${d} - ${a} = 0.${d}$.`,
            `到中心的距离是 $${a}.${d} - ${a} = 0.${d}$。`,
          ],
          [
            "Apply the bound",
            "代入误差界",
            `With $M = ${M}$, the bound is\n\n$$\\frac{${M}}{2}(0.${d})^{2} = \\frac{${M}}{2} \\cdot ${dec(h.mul(h))} = ${dec(answer)}$$`,
            `取 $M = ${M}$，误差界为\n\n$$\\frac{${M}}{2}(0.${d})^{2} = \\frac{${M}}{2} \\cdot ${dec(h.mul(h))} = ${dec(answer)}$$`,
          ],
        ],
        [
          `$g(x) = ${lead}x^{2}$ has $g'' = ${M}$ everywhere, and its tangent at $${a}$ is $L(x) = ${poly([M * a, "x"], [half.mul(Q.of(a * a)).neg(), ""])}$. Then\n\n$$g(${dec(x)}) - L(${dec(x)}) = ${dec(g)} - ${dec(l)} = ${dec(answer)}$$\n\nThis is exactly the bound, so the formula cannot promise anything smaller.`,
          `$g(x) = ${lead}x^{2}$ 处处有 $g'' = ${M}$，它在 $${a}$ 处的切线是 $L(x) = ${poly([M * a, "x"], [half.mul(Q.of(a * a)).neg(), ""])}$。于是\n\n$$g(${dec(x)}) - L(${dec(x)}) = ${dec(g)} - ${dec(l)} = ${dec(answer)}$$\n\n正好等于误差界，所以这个公式不能保证更小的值。`,
        ],
      ),
    });
  },
};

const priceForMostRevenue: KnowledgePointDef = {
  id: "the-price-that-maximizes-revenue",
  figure: calculusDrawings3["optimization-problems-in-economics#the-price-that-maximizes-revenue"],
  title: t("The price that maximizes revenue", "使收入最大的价格"),
  explanation: t(
    "Raising a price brings in more per sale but loses sales. If a rise of $x$ takes the price to $p + x$ and the sales to $n - mx$, then the revenue is their product, a downward parabola in $x$. Its maximum lies halfway between its two roots.",
    "涨价使每笔收入增加，但销量减少。如果涨价 $x$ 后价格变成 $p + x$，销量变成 $n - mx$，收入就是二者之积，是关于 $x$ 的开口向下的抛物线。最大值在两根的正中间。",
  ),
  generate(rng) {
    const p = rng.int(5, 20);
    const m = rng.int(1, 10);
    const k = rng.int(1, 20);
    const n = m * p + 2 * m * k;
    const answer = p + k;
    return numberProblem({
      prompt: t(
        `A shop sells $${n}$ items a week at $${p}$ dollars each. Every dollar added to the price loses $${m}$ ${m === 1 ? "sale" : "sales"} a week. Which price gives the greatest weekly revenue, in dollars?`,
        `商店以每件 $${p}$ 美元的价格每周售出 $${n}$ 件。价格每提高一美元，每周少售出 $${m}$ 件。什么价格（美元）使每周收入最大？`,
      ),
      answer,
      form: "integer",
      wrong: [p + 2 * k, k, p],
      solution: t(
        `The revenue after a rise of $x$ is $(${p} + x)(${n} - ${m}x)$. Its derivative is $${n} - ${m * p} - ${2 * m}x$, which vanishes at $x = ${k}$. So the best price is $${p} + ${k} = ${answer}$.`,
        `涨价 $x$ 后的收入是 $(${p} + x)(${n} - ${m}x)$。它的导数是 $${n} - ${m * p} - ${2 * m}x$，在 $x = ${k}$ 处为零。所以最佳价格是 $${p} + ${k} = ${answer}$。`,
      ),
    });
  },
};

const newtonFails: KnowledgePointDef = {
  id: "a-starting-point-where-newtons-method-fails",
  title: t("A starting point where Newton's method fails", "牛顿法失效的起点"),
  explanation: t(
    "Newton's method divides by $f'(x_n)$, so it breaks down at a point where the derivative is zero. Geometrically, the tangent line there is horizontal and never meets the $x$-axis. Such a starting point has to be avoided, and starting near one sends the next estimate far away.",
    "牛顿法要除以 $f'(x_n)$，所以在导数为零的点会失效。从几何上看，那里的切线是水平的，与 $x$ 轴不相交。必须避开这样的起点，而在它附近出发，下一个估计值会跑得很远。",
  ),
  generate(rng) {
    const k = rng.int(1, 9);
    const m = nonzero(rng, 9);
    const f = poly([1, "x^3"], [-3 * k * k, "x"], [m, ""]);
    return numberProblem({
      prompt: t(
        `Newton's method is applied to $f(x) = ${f}$. For which positive starting value $x_0$ can $x_1$ not be computed?`,
        `对 $f(x) = ${f}$ 使用牛顿法。正的初始值 $x_0$ 取何值时无法算出 $x_1$？`,
      ),
      answer: k,
      solveFor: "x_0",
      wrong: [k * k, 3 * k * k, 2 * k],
      solution: t(
        `Computing $x_1$ requires dividing by $f'(x_0) = 3x_0^2 - ${3 * k * k}$. This is zero at $x_0 = \\pm ${k}$, and the positive value is $${k}$.`,
        `计算 $x_1$ 要除以 $f'(x_0) = 3x_0^2 - ${3 * k * k}$。它在 $x_0 = \\pm ${k}$ 处为零，正值是 $${k}$。`,
      ),
    });
  },
};

const twoInitialConditions: KnowledgePointDef = {
  id: "a-function-from-its-second-derivative",
  title: t("A function from its second derivative", "由二阶导数求函数"),
  explanation: t(
    "Integrating a second derivative twice introduces two constants, so two conditions are needed. Use the value of $f'$ to fix the constant in the first integration, and the value of $f$ to fix the constant in the second. Keep the two steps in this order.",
    "把二阶导数积分两次会引入两个常数，所以需要两个条件。用 $f'$ 的值确定第一次积分的常数，用 $f$ 的值确定第二次积分的常数。这两步的顺序不能颠倒。",
  ),
  generate(rng) {
    const A = nonzero(rng, 3);
    const B = nonzero(rng, 4);
    const c = nonzero(rng, 6);
    const d = nonzero(rng, 9);
    const x = rng.int(1, 3);
    const answer = A * x ** 3 + B * x ** 2 + c * x + d;
    const second = poly([6 * A, "x"], [2 * B, ""]);
    return numberProblem({
      prompt: t(
        `$f''(x) = ${second}$, $f'(0) = ${c}$ and $f(0) = ${d}$. Find $f(${x})$.`,
        `$f''(x) = ${second}$，$f'(0) = ${c}$，$f(0) = ${d}$。求 $f(${x})$。`,
      ),
      answer,
      form: "integer",
      wrong: [A * x ** 3 + B * x ** 2 + d, A * x ** 3 + B * x ** 2 + c * x, 6 * A * x + 2 * B],
      solution: t(
        `Integrating once and using $f'(0)$ gives $f'(x) = ${poly([3 * A, "x^2"], [2 * B, "x"], [c, ""])}$. Integrating again and using $f(0)$ gives $f(x) = ${poly([A, "x^3"], [B, "x^2"], [c, "x"], [d, ""])}$, so $f(${x}) = ${answer}$.`,
        `积分一次并用 $f'(0)$，得 $f'(x) = ${poly([3 * A, "x^2"], [2 * B, "x"], [c, ""])}$。再积分并用 $f(0)$，得 $f(x) = ${poly([A, "x^3"], [B, "x^2"], [c, "x"], [d, ""])}$，所以 $f(${x}) = ${answer}$。`,
      ),
    });
  },
};

const unknownUpperLimit: KnowledgePointDef = {
  id: "an-unknown-limit-of-integration",
  title: t("An unknown limit of integration", "未知的积分上限"),
  explanation: t(
    "The fundamental theorem works in reverse as well. If the value of an integral is known and a limit is not, evaluating the antiderivative at that limit gives an equation in the unknown. For a linear integrand, that equation is a quadratic, and a condition such as positivity selects the root.",
    "微积分基本定理也可以反过来用。如果已知积分的值而不知道积分限，把原函数代入这个积分限，就得到关于未知数的方程。被积函数是一次式时，这是一个二次方程，再由正数之类的条件选出合适的根。",
  ),
  generate(rng) {
    const c = rng.int(1, 3);
    const a = rng.int(1, 9);
    const k = rng.int(1, 9);
    const v = c * k * k + a * k;
    return numberProblem({
      prompt: t(
        `Find the positive number $k$ for which $\\int_0^k (${poly([2 * c, "x"], [a, ""])})\\,dx = ${v}$.`,
        `求正数 $k$，使 $\\int_0^k (${poly([2 * c, "x"], [a, ""])})\\,dx = ${v}$。`,
      ),
      answer: k,
      solveFor: "k",
      wrong: [k + a, 2 * k, k + 1],
      solution: t(
        `The integral equals $${poly([c, "k^2"], [a, "k"])}$. Setting this equal to $${v}$ gives a quadratic whose roots have a negative product, so exactly one root is positive: $k = ${k}$.`,
        `积分等于 $${poly([c, "k^2"], [a, "k"])}$。令它等于 $${v}$，得到两根之积为负的二次方程，所以恰有一个正根：$k = ${k}$。`,
      ),
    });
  },
};

const symmetryAboutAnotherCenter: KnowledgePointDef = {
  id: "symmetry-about-a-point-other-than-the-origin",
  title: t("Symmetry about a point other than the origin", "关于原点以外的点的对称"),
  explanation: t(
    "Symmetry does not need the origin. If an interval is centered at $c$, then an odd power of $x - c$ has equal and opposite areas on the two sides, and its integral is zero. Only the even part remains, and a constant term contributes its value times the width of the interval.",
    "对称不一定要关于原点。如果区间以 $c$ 为中心，$x - c$ 的奇次幂在两侧的面积大小相等、符号相反，积分为零。只剩下偶数部分，常数项贡献它的值乘以区间宽度。",
  ),
  generate(rng) {
    const c = nonzero(rng, 6);
    const a = rng.int(1, 6);
    const m = nonzero(rng, 5);
    const k = nonzero(rng, 9);
    const answer = 2 * a * k;
    const inner = poly([1, "x"], [-c, ""]);
    return numberProblem({
      prompt: t(
        `Find $\\int_{${c - a}}^{${c + a}} \\left(${poly([m, `(${inner})^3`], [k, ""])}\\right)dx$.`,
        `求 $\\int_{${c - a}}^{${c + a}} \\left(${poly([m, `(${inner})^3`], [k, ""])}\\right)dx$。`,
      ),
      answer,
      form: "integer",
      wrong: [0, a * k, 2 * a * m + 2 * a * k],
      solution: t(
        `The interval is centered at $${c}$, so the cubed term is odd about the center and integrates to zero. The constant contributes $${inParens(k)} \\cdot ${2 * a} = ${answer}$.`,
        `区间以 $${c}$ 为中心，所以立方项关于中心是奇函数，积分为零。常数项贡献 $${inParens(k)} \\cdot ${2 * a} = ${answer}$。`,
      ),
    });
  },
};

const constantInAnAccumulation: KnowledgePointDef = {
  id: "a-constant-in-an-accumulation-function",
  title: t("A constant in an accumulation function", "累积函数中的常数"),
  explanation: t(
    "An accumulation function $\\int_a^x f(t)\\,dt$ is zero at $x = a$, because the interval has no width. So if the integral is given by a formula with an unknown constant, setting $x = a$ determines the constant. There is no need to find $f$ itself.",
    "累积函数 $\\int_a^x f(t)\\,dt$ 在 $x = a$ 处为零，因为区间没有宽度。所以如果积分由一个含未知常数的公式给出，令 $x = a$ 就能确定这个常数，不必求出 $f$ 本身。",
  ),
  generate(rng) {
    const a = nonzero(rng, 6);
    const b = nonzero(rng, 9);
    const answer = -(a * a + a * b);
    return numberProblem({
      prompt: t(
        `For all $x$, $\\int_{${a}}^{x} f(t)\\,dt = ${poly([1, "x^2"], [b, "x"])} + k$. Find $k$.`,
        `对所有 $x$，$\\int_{${a}}^{x} f(t)\\,dt = ${poly([1, "x^2"], [b, "x"])} + k$。求 $k$。`,
      ),
      answer,
      solveFor: "k",
      wrong: [a * a + a * b, -(a * a), a * a - a * b],
      solution: t(
        `At $x = ${a}$ the integral is zero, so $${inParens(a)}^2 + ${inParens(b)}(${a}) + k = 0$. That gives $k = ${answer}$.`,
        `在 $x = ${a}$ 处积分为零，所以 $${inParens(a)}^2 + ${inParens(b)}(${a}) + k = 0$，得 $k = ${answer}$。`,
      ),
    });
  },
};

const rightMinusLeft: KnowledgePointDef = {
  id: "the-difference-between-right-and-left-sums",
  title: t("The difference between right and left sums", "右和与左和之差"),
  explanation: t(
    "Right and left Riemann sums share every height except one at each end, so most terms cancel: $R_n - L_n = \\Delta x\\,(f(b) - f(a))$. For a monotonic function the true area lies between them, so this gives a bound on the error without any integration.",
    "右黎曼和与左黎曼和除了两端各有一个高度不同，其余都相同，所以大多数项相消：$R_n - L_n = \\Delta x\\,(f(b) - f(a))$。对单调函数，真实面积在二者之间，所以不用积分就能得到误差的界。",
  ),
  generate(rng) {
    const a = rng.int(0, 4);
    const b = a + rng.int(1, 6);
    const n = rng.pick([4, 5, 8, 10, 20, 50, 100]);
    const c = rng.int(1, 6);
    const f = (x: number) => x * x + c * x;
    const answer = Q.of((b - a) * (f(b) - f(a)), n);
    return numberProblem({
      prompt: t(
        `For $f(x) = ${poly([1, "x^2"], [c, "x"])}$ on $[${a}, ${b}]$ with ${n} equal subintervals, find $R_{${n}} - L_{${n}}$, the right sum minus the left sum.`,
        `对 $[${a}, ${b}]$ 上的 $f(x) = ${poly([1, "x^2"], [c, "x"])}$，取 ${n} 个等宽子区间，求右和减左和 $R_{${n}} - L_{${n}}$。`,
      ),
      answer,
      wrong: [Q.of(f(b) - f(a)), Q.of((b - a) * f(b), n), answer.div(Q.of(2))],
      solution: t(
        `Only the end heights differ, and $f(${b}) - f(${a}) = ${f(b) - f(a)}$. With $\\Delta x = ${Q.of(b - a, n).toLatex()}$, the difference is $${answer.toLatex()}$.`,
        `只有两端的高度不同，$f(${b}) - f(${a}) = ${f(b) - f(a)}$。由 $\\Delta x = ${Q.of(b - a, n).toLatex()}$，差是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

/** timesX writes a multiple of x, without a coefficient of one. */
const timesX = (a: number) => (a === 1 ? "x" : a === -1 ? "-x" : `${a}x`);

const sinhAndCoshTogether: KnowledgePointDef = {
  id: "an-equation-with-both-sinh-and-cosh",
  title: t("An equation with both sinh and cosh", "同时含 sinh 和 cosh 的方程"),
  explanation: t(
    "When sinh and cosh appear together, no single inverse function undoes them. Writing both in terms of the exponential turns the equation into one in $u = e^{x}$. Multiplying by $u$ gives a quadratic, and since an exponential is always positive, only a positive root of that quadratic can correspond to a real $x$.\n\nFor example, $3\\sinh x - \\cosh x = 1$ becomes $\\frac{3\\left(u - \\frac{1}{u}\\right) - \\left(u + \\frac{1}{u}\\right)}{2} = u - \\frac{2}{u} = 1$, so $u^{2} - u - 2 = 0$ and $(u - 2)(u + 1) = 0$. Only $u = 2$ is positive, so $e^{x} = 2$.\n\nCheck: $\\sinh(\\ln 2) = \\frac{3}{4}$ and $\\cosh(\\ln 2) = \\frac{5}{4}$, and $3 \\cdot \\frac{3}{4} - \\frac{5}{4} = 1$.\n\n> **Watch out.** Reject the negative root: $e^{x} = -1$ has no solution. And collect the $u$ terms and the $\\frac{1}{u}$ terms separately, each with its own coefficient.",
    "当 sinh 和 cosh 同时出现时，没有一个反函数能直接消去它们。把两者都写成指数形式，方程就变成关于 $u = e^{x}$ 的方程。两边乘以 $u$ 得到二次方程；由于指数函数恒为正，只有正根才对应实数 $x$。\n\n例如 $3\\sinh x - \\cosh x = 1$ 化为 $\\frac{3\\left(u - \\frac{1}{u}\\right) - \\left(u + \\frac{1}{u}\\right)}{2} = u - \\frac{2}{u} = 1$，所以 $u^{2} - u - 2 = 0$，即 $(u - 2)(u + 1) = 0$。只有 $u = 2$ 为正，所以 $e^{x} = 2$。\n\n检验：$\\sinh(\\ln 2) = \\frac{3}{4}$，$\\cosh(\\ln 2) = \\frac{5}{4}$，而 $3 \\cdot \\frac{3}{4} - \\frac{5}{4} = 1$。\n\n> **注意。** 要舍去负根：$e^{x} = -1$ 无解。$u$ 的项和 $\\frac{1}{u}$ 的项要分别合并，各有各的系数。",
  ),
  generate(rng) {
    const k = rng.int(2, 6);
    const j = rng.int(1, 4);
    const n = k * j;
    const m = different(rng, 1, 7, n);
    const c = m * k - j;
    const equation = `${poly([m + n, "\\sinh x"], [m - n, "\\cosh x"])} = ${c}`;
    const inU = `${poly([m, "u"])} - \\frac{${n}}{u} = ${c}`;
    const quadratic = poly([m, "u^2"], [-c, "u"], [-n, ""]);
    const other = Q.of(-j, m);
    const sinh = Q.of(k * k - 1, 2 * k);
    const cosh = Q.of(k * k + 1, 2 * k);
    const total = sinh.mul(Q.of(m + n)).add(cosh.mul(Q.of(m - n)));
    return numberProblem({
      prompt: t(
        `The equation $${equation}$ has exactly one real solution $x$. Find $e^{x}$.`,
        `方程 $${equation}$ 恰有一个实数解 $x$。求 $e^{x}$。`,
      ),
      answer: k,
      form: "integer",
      mistakes: firstMistakes(k, [
        why(
          Q.of(j, m),
          `This drops the sign of the other root, $${other.toLatex()}$. That root is negative, and $e^{x}$ cannot be negative.`,
          `这去掉了另一个根 $${other.toLatex()}$ 的负号。那个根是负的，而 $e^{x}$ 不可能为负。`,
        ),
        why(m, "This is the coefficient of $u$, not a root.", "这是 $u$ 的系数，不是根。"),
        why(
          n,
          `This is the size of the constant term $-${n}$ of the quadratic, not a root.`,
          `这是二次方程常数项 $-${n}$ 的绝对值，不是根。`,
        ),
        why(
          Q.of(c, m),
          `This is the sum of the two roots, $\\frac{${c}}{${m}}$, not a root.`,
          `这是两根之和 $\\frac{${c}}{${m}}$，不是根。`,
        ),
      ]),
      solution: walk(
        [
          [
            "Write it with $u = e^{x}$",
            "用 $u = e^{x}$ 表示",
            `$\\sinh x = \\frac{u - \\frac{1}{u}}{2}$ and $\\cosh x = \\frac{u + \\frac{1}{u}}{2}$. Collecting the $u$ terms and the $\\frac{1}{u}$ terms turns the equation into $${inU}$.`,
            `$\\sinh x = \\frac{u - \\frac{1}{u}}{2}$，$\\cosh x = \\frac{u + \\frac{1}{u}}{2}$。分别合并 $u$ 的项和 $\\frac{1}{u}$ 的项，方程化为 $${inU}$。`,
          ],
          [
            "Multiply by $u$",
            "两边乘以 $u$",
            `$${quadratic} = 0$, that is $(u - ${k})(${poly([m, "u"], [j, ""])}) = 0$, with roots $${k}$ and $${other.toLatex()}$.`,
            `$${quadratic} = 0$，即 $(u - ${k})(${poly([m, "u"], [j, ""])}) = 0$，根为 $${k}$ 和 $${other.toLatex()}$。`,
          ],
          ["Keep the positive root", "保留正根", `$e^{x}$ must be positive, so $e^{x} = ${k}$.`, `$e^{x}$ 必须为正，所以 $e^{x} = ${k}$。`],
        ],
        [
          `With $x = \\ln ${k}$, $\\sinh x = ${sinh.toLatex()}$ and $\\cosh x = ${cosh.toLatex()}$, and $${m + n} \\cdot ${sinh.toLatex()} + ${inParens(m - n)} \\cdot ${cosh.toLatex()} = ${total.toLatex()}$.`,
          `取 $x = \\ln ${k}$，$\\sinh x = ${sinh.toLatex()}$，$\\cosh x = ${cosh.toLatex()}$，而 $${m + n} \\cdot ${sinh.toLatex()} + ${inParens(m - n)} \\cdot ${cosh.toLatex()} = ${total.toLatex()}$。`,
        ],
      ),
    });
  },
};

const hyperbolicOfInverse: KnowledgePointDef = {
  id: "a-hyperbolic-function-of-an-inverse-hyperbolic-value",
  title: t("A hyperbolic function of an inverse hyperbolic value", "反双曲函数值的双曲函数"),
  explanation: t(
    "To evaluate a hyperbolic function of an inverse hyperbolic value, name the inner value $y$, so one of $\\sinh y$ and $\\cosh y$ is known at once. The identity $\\cosh^{2} y - \\sinh^{2} y = 1$ gives the other, and the sign follows from the facts that cosh is positive and the principal value of arcosh is not negative.\n\nFor example, for $\\cosh\\left(\\operatorname{arsinh} \\frac{3}{4}\\right)$, let $y = \\operatorname{arsinh} \\frac{3}{4}$. Then $\\sinh y = \\frac{3}{4}$, so $\\cosh y = \\sqrt{1 + \\frac{9}{16}} = \\frac{5}{4}$.\n\nCheck: $\\operatorname{arsinh} \\frac{3}{4} = \\ln\\left(\\frac{3}{4} + \\frac{5}{4}\\right) = \\ln 2$, and $\\cosh(\\ln 2) = \\frac{2 + \\frac{1}{2}}{2} = \\frac{5}{4}$.\n\n> **Watch out.** $\\cosh y$ is positive even when $\\sinh y$ is negative, and $\\sinh\\left(\\operatorname{arcosh} c\\right)$ is not negative, because $\\operatorname{arcosh} c \\ge 0$.",
    "要计算反双曲函数值的双曲函数，把里面的值记作 $y$，这样 $\\sinh y$ 和 $\\cosh y$ 中就有一个立刻已知。恒等式 $\\cosh^{2} y - \\sinh^{2} y = 1$ 给出另一个，而符号由两个事实确定：cosh 恒为正，arcosh 的主值不为负。\n\n例如求 $\\cosh\\left(\\operatorname{arsinh} \\frac{3}{4}\\right)$，令 $y = \\operatorname{arsinh} \\frac{3}{4}$，则 $\\sinh y = \\frac{3}{4}$，所以 $\\cosh y = \\sqrt{1 + \\frac{9}{16}} = \\frac{5}{4}$。\n\n检验：$\\operatorname{arsinh} \\frac{3}{4} = \\ln\\left(\\frac{3}{4} + \\frac{5}{4}\\right) = \\ln 2$，而 $\\cosh(\\ln 2) = \\frac{2 + \\frac{1}{2}}{2} = \\frac{5}{4}$。\n\n> **注意。** 即使 $\\sinh y$ 为负，$\\cosh y$ 也为正；$\\sinh\\left(\\operatorname{arcosh} c\\right)$ 不为负，因为 $\\operatorname{arcosh} c \\ge 0$。",
  ),
  generate(rng) {
    const [a, b, c] = rng.pick([
      [3, 4, 5],
      [4, 3, 5],
      [5, 12, 13],
      [12, 5, 13],
      [8, 15, 17],
      [15, 8, 17],
      [7, 24, 25],
      [24, 7, 25],
    ] as const);
    const fromSinh = rng.pick([true, false]);
    const s = fromSinh ? rng.pick([1, -1]) : 1;
    const outerIsTanh = rng.pick([true, false]);
    const sinhY = Q.of(s * b, a);
    const coshY = Q.of(c, a);
    const tanhY = Q.of(s * b, c);
    const inner = fromSinh
      ? `\\operatorname{arsinh}\\left(${sinhY.toLatex()}\\right)`
      : `\\operatorname{arcosh}\\left(${coshY.toLatex()}\\right)`;
    const outer = outerIsTanh ? "\\tanh" : fromSinh ? "\\cosh" : "\\sinh";
    const answer = outerIsTanh ? tanhY : fromSinh ? coshY : sinhY;
    const known = fromSinh ? `\\sinh y = ${sinhY.toLatex()}` : `\\cosh y = ${coshY.toLatex()}`;
    const found = fromSinh
      ? `\\cosh y = \\sqrt{1 + ${Q.of(b * b, a * a).toLatex()}} = ${coshY.toLatex()}`
      : `\\sinh y = \\sqrt{${Q.of(c * c, a * a).toLatex()} - 1} = ${sinhY.toLatex()}`;
    const sign: readonly [string, string] = fromSinh
      ? ["taking the positive root because $\\cosh y > 0$", "因为 $\\cosh y > 0$，取正根"]
      : [
          "taking the positive root because $y = \\operatorname{arcosh}$ of a number is not negative",
          "因为 $\\operatorname{arcosh}$ 的值不为负，取正根",
        ];
    const e = Q.of(s * b + c, a);
    const fromE = outerIsTanh
      ? `\\tanh y = \\frac{e^{2y} - 1}{e^{2y} + 1} = \\frac{${e.mul(e).toLatex()} - 1}{${e.mul(e).toLatex()} + 1} = ${answer.toLatex()}`
      : `${outer} y = \\frac{${e.toLatex()} ${fromSinh ? "+" : "-"} ${Q.one.div(e).toLatex()}}{2} = ${answer.toLatex()}`;
    const named: readonly (readonly [Q, string])[] = [
      [sinhY, "\\sinh"],
      [coshY, "\\cosh"],
      [tanhY, "\\tanh"],
      [Q.of(a, c), "\\operatorname{sech}"],
      [Q.of(a, s * b), "\\operatorname{csch}"],
      [Q.of(c, s * b), "\\coth"],
    ];
    const signWhy = outerIsTanh
      ? why(
          answer.neg(),
          "This has the wrong sign: $\\tanh y$ has the sign of $\\sinh y$, because $\\cosh y > 0$.",
          "符号错了：因为 $\\cosh y > 0$，$\\tanh y$ 与 $\\sinh y$ 同号。",
        )
      : fromSinh
        ? why(answer.neg(), "$\\cosh y$ is always positive.", "$\\cosh y$ 恒为正。")
        : why(
            answer.neg(),
            "$y = \\operatorname{arcosh}$ of a number is not negative, so $\\sinh y$ is not negative.",
            "$\\operatorname{arcosh}$ 的值不为负，所以 $\\sinh y$ 不为负。",
          );
    return numberProblem({
      prompt: t(`Find $${outer}\\left(${inner}\\right)$.`, `求 $${outer}\\left(${inner}\\right)$。`),
      answer,
      mistakes: firstMistakes(answer, [
        signWhy,
        ...named.map(([v, name]) =>
          why(
            v,
            `This is $${name} y = ${v.toLatex()}$, but the question asks for $${outer} y$.`,
            `这是 $${name} y = ${v.toLatex()}$，但题目要求的是 $${outer} y$。`,
          ),
        ),
      ]),
      solution: walk(
        [
          ["Name the inner value", "给里面的值命名", `Let $y = ${inner}$, so $${known}$.`, `令 $y = ${inner}$，则 $${known}$。`],
          [
            "Use the identity",
            "使用恒等式",
            `$\\cosh^{2} y - \\sinh^{2} y = 1$ gives $${found}$, ${sign[0]}.`,
            `由 $\\cosh^{2} y - \\sinh^{2} y = 1$ 得 $${found}$，${sign[1]}。`,
          ],
          outerIsTanh
            ? [
                "Divide",
                "相除",
                `$\\tanh y = \\frac{\\sinh y}{\\cosh y} = ${answer.toLatex()}$.`,
                `$\\tanh y = \\frac{\\sinh y}{\\cosh y} = ${answer.toLatex()}$。`,
              ]
            : [
                "State the value",
                "写出结果",
                `So $${outer}\\left(${inner}\\right) = ${answer.toLatex()}$.`,
                `所以 $${outer}\\left(${inner}\\right) = ${answer.toLatex()}$。`,
              ],
        ],
        [
          `By the logarithmic form, $e^{y} = \\sinh y + \\cosh y = ${e.toLatex()}$, so $e^{-y} = ${Q.one.div(e).toLatex()}$ and $${fromE}$.`,
          `由对数形式，$e^{y} = \\sinh y + \\cosh y = ${e.toLatex()}$，所以 $e^{-y} = ${Q.one.div(e).toLatex()}$，而 $${fromE}$。`,
        ],
      ),
    });
  },
};

const quotientLimitNewDenominator: KnowledgePointDef = {
  id: "a-known-quotient-limit-over-a-new-denominator",
  title: t("A known quotient limit over a new denominator", "已知商的极限，换一个分母"),
  explanation: t(
    "The formula for $f$ is not needed when the limit of a related quotient is known. Factor the new denominator so that the known denominator appears, then write the new quotient as a product of the known quotient and a remaining fraction. The product rule for limits combines the two, because each factor has a limit.\n\nIf $\\lim_{x \\to 2} \\frac{f(x)}{x - 2} = 6$, then\n\n$$\\frac{f(x)}{x^{2} - 4} = \\frac{f(x)}{x - 2} \\cdot \\frac{1}{x + 2} \\to 6 \\cdot \\frac{1}{4} = \\frac{3}{2}.$$\n\nCheck: $f(x) = 6(x - 2)$ fits, and then the new quotient is $\\frac{6}{x + 2}$, which is $1.5$ at $x = 2$.\n\n> **Watch out.** Keep $f(x)$ and the known denominator together. Apart, $x - 2$ tends to $0$ and $f(x)$ has no known limit, so the product rule cannot be used on them.",
    "已知相关商的极限时，不需要 $f$ 的表达式。把新分母因式分解，让已知的分母出现，再把新商写成已知商与剩余分式的乘积。由于每个因子都有极限，极限的乘积法则就能把两者合起来。\n\n若 $\\lim_{x \\to 2} \\frac{f(x)}{x - 2} = 6$，则\n\n$$\\frac{f(x)}{x^{2} - 4} = \\frac{f(x)}{x - 2} \\cdot \\frac{1}{x + 2} \\to 6 \\cdot \\frac{1}{4} = \\frac{3}{2}.$$\n\n检验：$f(x) = 6(x - 2)$ 满足条件，此时新商是 $\\frac{6}{x + 2}$，在 $x = 2$ 处等于 $1.5$。\n\n> **注意。** 要让 $f(x)$ 和已知的分母留在一起。分开后 $x - 2$ 趋于 $0$，而 $f(x)$ 的极限未知，不能对它们用乘积法则。",
  ),
  generate(rng) {
    const c = nonzero(rng, 6);
    const l = nonzero(rng, 9);
    const isDifference = rng.pick([true, false]);
    const factor = isDifference ? poly([1, "x"], [c, ""]) : "x";
    const denominator = isDifference ? poly([1, "x^2"], [-c * c, ""]) : poly([1, "x^2"], [-c, "x"]);
    const at = isDifference ? 2 * c : c;
    const known = poly([1, "x"], [-c, ""]);
    const answer = Q.of(l, at);
    const inverse = Q.of(1, at);
    const factored = isDifference ? `(${known})(${factor})` : `x(${known})`;
    const table = valueTable(
      [c - 0.1, c - 0.01, c + 0.01, c + 0.1].map((x) => Math.round(x * 1000) / 1000),
      [[`\\frac{${l}}{${factor}}`, (x) => l / (isDifference ? x + c : x)]],
    );
    return numberProblem({
      prompt: t(
        `A function $f$ satisfies $\\lim_{x \\to ${c}} \\frac{f(x)}{${known}} = ${l}$. Find $\\lim_{x \\to ${c}} \\frac{f(x)}{${denominator}}$.`,
        `函数 $f$ 满足 $\\lim_{x \\to ${c}} \\frac{f(x)}{${known}} = ${l}$。求 $\\lim_{x \\to ${c}} \\frac{f(x)}{${denominator}}$。`,
      ),
      answer,
      wrong: [Q.of(l), Q.of(l * at), Q.of(-l, at), Q.of(l + at), Q.of(2 * l), Q.of(3 * l)],
      solution: walk(
        [
          [
            "Factor the new denominator",
            "分解新分母",
            `The known denominator is a factor of the new one:\n\n$$${denominator} = ${factored}$$`,
            `已知的分母是新分母的一个因式：\n\n$$${denominator} = ${factored}$$`,
          ],
          [
            "Split the quotient",
            "拆开商",
            `Write the new quotient as the known quotient times what is left:\n\n$$\\frac{f(x)}{${denominator}} = \\frac{f(x)}{${known}} \\cdot \\frac{1}{${factor}}$$`,
            `把新商写成已知的商乘以剩下的部分：\n\n$$\\frac{f(x)}{${denominator}} = \\frac{f(x)}{${known}} \\cdot \\frac{1}{${factor}}$$`,
          ],
          [
            "Combine the limits",
            "合并极限",
            `The first factor tends to $${l}$ and the second to $${inverse.toLatex()}$, so by the product rule the limit is\n\n$$${l} \\cdot ${at < 0 ? `\\left(${inverse.toLatex()}\\right)` : inverse.toLatex()} = ${answer.toLatex()}$$`,
            `第一个因子趋于 $${l}$，第二个趋于 $${inverse.toLatex()}$，由乘积法则，极限是\n\n$$${l} \\cdot ${at < 0 ? `\\left(${inverse.toLatex()}\\right)` : inverse.toLatex()} = ${answer.toLatex()}$$`,
          ],
        ],
        [
          `One function that fits is $f(x) = ${l}(${known})$, since then $\\frac{f(x)}{${known}} = ${l}$ for $x \\ne ${c}$. With it the new quotient is $\\frac{${l}}{${factor}}$, and near $x = ${c}$:\n\n${table}\n\nThe values close in on $${answer.toLatex()}${approx(answer)}$.`,
          `满足条件的一个函数是 $f(x) = ${l}(${known})$，因为当 $x \\ne ${c}$ 时 $\\frac{f(x)}{${known}} = ${l}$。这时新商是 $\\frac{${l}}{${factor}}$，在 $x = ${c}$ 附近：\n\n${table}\n\n函数值逼近 $${answer.toLatex()}${approx(answer)}$。`,
        ],
      ),
    });
  },
};

const ratioOfExponentials: KnowledgePointDef = {
  id: "a-ratio-of-exponentials-at-either-infinity",
  title: t("A ratio of exponentials at either infinity", "指数函数之比在两个方向的极限"),
  explanation: t(
    "An exponential with base above one behaves very differently in the two directions. As $x \\to \\infty$ it dominates the constants, so dividing above and below by it leaves its coefficients. As $x \\to -\\infty$ it vanishes, so only the constants remain. The same quotient therefore usually has two different limits at the two ends.\n\nFor $\\frac{3 \\cdot 2^{x} + 1}{2^{x} + 5}$ the limit is $3$ as $x \\to \\infty$ and $\\frac{1}{5}$ as $x \\to -\\infty$.\n\nCheck: at $x = 10$ the quotient is $\\frac{3073}{1029} \\approx 2.986$, and at $x = -10$ it is about $0.201$.\n\n> **Watch out.** At $-\\infty$ the exponential terms vanish; they do not dominate, so the coefficients in front of them are not the answer there.",
    "底数大于一的指数函数在两个方向上表现截然不同。当 $x \\to \\infty$ 时它压倒常数，所以分子分母同除以它，就只剩它的系数。当 $x \\to -\\infty$ 时它趋于零，只剩常数。因此同一个商在两端通常有两个不同的极限。\n\n对于 $\\frac{3 \\cdot 2^{x} + 1}{2^{x} + 5}$，当 $x \\to \\infty$ 时极限是 $3$，当 $x \\to -\\infty$ 时极限是 $\\frac{1}{5}$。\n\n检验：$x = 10$ 时商是 $\\frac{3073}{1029} \\approx 2.986$，$x = -10$ 时约为 $0.201$。\n\n> **注意。** 在 $-\\infty$ 处指数项趋于零，它们不占主导，所以那里的答案不是它们前面的系数。",
  ),
  generate(rng) {
    const base = rng.pick(["2^{x}", "3^{x}", "4^{x}", "5^{x}", "e^{x}"]);
    const a = nonzero(rng, 9);
    const c = rng.int(1, 6);
    const q = rng.int(1, 9);
    const p = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x * c !== a * q));
    const atPositive = rng.pick([true, false]);
    const answer = atPositive ? Q.of(a, c) : Q.of(p, q);
    const other = atPositive ? Q.of(p, q) : Q.of(a, c);
    const target = atPositive ? "\\infty" : "-\\infty";
    const term = (n: number) => (Math.abs(n) === 1 || base === "e^{x}" ? base : `\\cdot ${base}`);
    const f = `\\frac{${poly([a, term(a)], [p, ""])}}{${poly([c, term(c)], [q, ""])}}`;
    const grow = (x: number) => (base === "e^{x}" ? Math.exp(x) : Number(base[0]) ** x);
    const over = (k: number) => `${k < 0 ? "-" : "+"} \\frac{${Math.abs(k)}}{${base}}`;
    const xs = [5, 10, 20].map((x) => (atPositive ? x : -x));
    const table = valueTable(xs, [[f, (x) => (a * grow(x) + p) / (c * grow(x) + q)]]);
    return numberProblem({
      prompt: t(`Find $\\lim_{x \\to ${target}} ${f}$.`, `求 $\\lim_{x \\to ${target}} ${f}$。`),
      answer,
      wrong: [other, Q.of(a, q), Q.of(p, c), Q.of(a + p, c + q), answer.neg(), Q.of(a + p), answer.mul(Q.of(2))],
      solution: walk(
        atPositive
          ? [
              [
                "Find the dominant term",
                "找出主导项",
                `As $x \\to \\infty$, $${base}$ grows without bound, so it outweighs the constants $${p}$ and $${q}$.`,
                `当 $x \\to \\infty$ 时，$${base}$ 无限增大，所以它压倒常数 $${p}$ 和 $${q}$。`,
              ],
              [
                "Divide by it",
                "同除以它",
                `Dividing the top and the bottom by $${base}$ gives\n\n$$\\frac{${a} ${over(p)}}{${c} ${over(q)}}$$\n\nEach fraction with $${base}$ below tends to $0$, which leaves the ratio of the coefficients, $${answer.toLatex()}$.`,
                `分子分母同除以 $${base}$，得\n\n$$\\frac{${a} ${over(p)}}{${c} ${over(q)}}$$\n\n分母含 $${base}$ 的分式都趋于 $0$，剩下系数之比 $${answer.toLatex()}$。`,
              ],
            ]
          : [
              [
                "Find what vanishes",
                "找出趋于零的项",
                `As $x \\to -\\infty$, $${base} \\to 0$, so every term with $${base}$ tends to $0$.`,
                `当 $x \\to -\\infty$ 时，$${base} \\to 0$，所以含 $${base}$ 的项都趋于 $0$。`,
              ],
              [
                "Keep the constants",
                "保留常数",
                `Only the constant terms remain:\n\n$$\\lim_{x \\to -\\infty} ${f} = \\frac{${p}}{${q}} = ${answer.toLatex()}$$`,
                `只剩常数项：\n\n$$\\lim_{x \\to -\\infty} ${f} = \\frac{${p}}{${q}} = ${answer.toLatex()}$$`,
              ],
            ],
        [
          `Evaluate the quotient farther and farther out:\n\n${table}\n\nThe values close in on $${answer.toLatex()}${approx(answer)}$, not on $${other.toLatex()}$, which is the limit at the other end.`,
          `在越来越远处计算这个商：\n\n${table}\n\n函数值逼近 $${answer.toLatex()}${approx(answer)}$，而不是另一端的极限 $${other.toLatex()}$。`,
        ],
      ),
    });
  },
};

const differenceOfLogarithms: KnowledgePointDef = {
  id: "a-difference-of-logarithms-at-infinity",
  title: t("A difference of logarithms at infinity", "对数之差在无穷远处的极限"),
  explanation: t(
    "Each logarithm alone grows without bound, so the difference looks like infinity minus infinity, which says nothing yet. Combining them into the logarithm of a quotient resolves it: the quotient has a finite limit, found from its leading coefficients, and the logarithm is continuous there, so the limit can be moved inside.\n\nFor $\\log_{2}(8x + 1) - \\log_{2}(x + 3) = \\log_{2}\\frac{8x + 1}{x + 3}$, the quotient tends to $8$, so the limit is $\\log_{2} 8 = 3$.\n\nCheck: at $x = 1000$ the quotient is $\\frac{8001}{1003} \\approx 7.977$, and $\\log_{2} 7.977 \\approx 2.996$.\n\n> **Watch out.** Infinity minus infinity is not $0$. And the answer is the logarithm of the limiting quotient, not the quotient itself.",
    "每个对数单独都无限增大，所以差看起来是无穷减无穷，这还说明不了什么。把它们合并成商的对数就能解决：这个商有有限的极限，由最高次项系数求出，而对数函数在那里连续，所以极限可以移到对数里面。\n\n对于 $\\log_{2}(8x + 1) - \\log_{2}(x + 3) = \\log_{2}\\frac{8x + 1}{x + 3}$，商趋于 $8$，所以极限是 $\\log_{2} 8 = 3$。\n\n检验：$x = 1000$ 时商是 $\\frac{8001}{1003} \\approx 7.977$，而 $\\log_{2} 7.977 \\approx 2.996$。\n\n> **注意。** 无穷减无穷不等于 $0$。答案是商的极限取对数，而不是商本身。",
  ),
  generate(rng) {
    const b = rng.pick([2, 3, 5, 10]);
    const k = rng.int(1, b === 2 ? 4 : b === 3 ? 3 : 2);
    const c = rng.int(1, 5);
    const p = rng.int(1, 9);
    const q = rng.int(1, 9);
    const s = rng.pick([1, -1]);
    const large = c * b ** k;
    const log = b === 10 ? "\\log" : `\\log_{${b}}`;
    const bigInner = poly([large, "x"], [p, ""]);
    const smallInner = poly([c, "x"], [q, ""]);
    const big = `${log}\\left(${bigInner}\\right)`;
    const small = `${log}\\left(${smallInner}\\right)`;
    const f = s > 0 ? `${big} - ${small}` : `${small} - ${big}`;
    const answer = s * k;
    const ratio = s > 0 ? `\\frac{${bigInner}}{${smallInner}}` : `\\frac{${smallInner}}{${bigInner}}`;
    const coefficients = s > 0 ? `\\frac{${large}}{${c}}` : `\\frac{${c}}{${large}}`;
    const value = s > 0 ? `${b ** k}` : `\\frac{1}{${b ** k}}`;
    const at = (x: number) => (s * Math.log((large * x + p) / (c * x + q))) / Math.log(b);
    const table = valueTable([100, 10000, 1000000], [[f, at]]);
    return numberProblem({
      prompt: t(`Find $\\lim_{x \\to \\infty} \\left(${f}\\right)$.`, `求 $\\lim_{x \\to \\infty} \\left(${f}\\right)$。`),
      answer,
      form: "integer",
      wrong: [s * b ** k, s * (k + 1), -s * k, 0],
      solution: walk(
        [
          [
            "Combine the logarithms",
            "合并对数",
            `A difference of logarithms is the logarithm of a quotient:\n\n$$${f} = ${log}${ratio}$$`,
            `对数之差是商的对数：\n\n$$${f} = ${log}${ratio}$$`,
          ],
          [
            "Find the limit of the quotient",
            "求商的极限",
            c === 1 && s > 0
              ? `By the leading coefficients, the quotient tends to $${value}$.`
              : `By the leading coefficients, the quotient tends to $${coefficients}$, which is $${value}$.`,
            c === 1 && s > 0 ? `由最高次项系数，这个商趋于 $${value}$。` : `由最高次项系数，这个商趋于 $${coefficients}$，即 $${value}$。`,
          ],
          [
            "Move the limit inside",
            "把极限移进对数",
            `The logarithm is continuous at $${value}$, so the limit is\n\n$$${log} ${value} = ${answer}$$`,
            `对数函数在 $${value}$ 处连续，所以极限是\n\n$$${log} ${value} = ${answer}$$`,
          ],
        ],
        [
          `Evaluate the difference for larger and larger $x$:\n\n${table}\n\nEach logarithm alone keeps growing, yet their difference settles at $${answer}$.`,
          `计算 $x$ 越来越大时的差：\n\n${table}\n\n每个对数单独都在不断增大，它们的差却稳定在 $${answer}$。`,
        ],
      ),
    });
  },
};

const tangentMinusSine: KnowledgePointDef = {
  id: "tangent-minus-sine-over-a-cube",
  title: t("Tangent minus sine over a cube", "正切减正弦除以立方"),
  explanation: t(
    "Tangent and sine agree to first order near zero, so their difference shrinks faster than the angle, and splitting the quotient into two limits at once would fail. Factor the sine out of the numerator using $\\tan u = \\frac{\\sin u}{\\cos u}$. This exposes one minus cosine, which supplies two powers of the angle, while the sine supplies the third.\n\n$$\\lim_{x \\to 0} \\frac{\\tan x - \\sin x}{x^{3}} = \\lim_{x \\to 0} \\frac{\\sin x}{x} \\cdot \\frac{1 - \\cos x}{x^{2}} \\cdot \\frac{1}{\\cos x} = 1 \\cdot \\frac{1}{2} \\cdot 1 = \\frac{1}{2}.$$\n\nCheck: at $x = 0.1$ the quotient is about $0.5013$, and at $x = 0.01$ about $0.50001$.\n\n> **Watch out.** Splitting into $\\frac{\\tan x}{x^{3}} - \\frac{\\sin x}{x^{3}}$ gives $\\infty - \\infty$. With $ax$ inside, each power of the angle brings a factor $a$, so the answer has $a^{3}$.",
    "正切和正弦在零附近的一阶行为相同，所以它们的差比角本身更快地趋于零，直接把商拆成两个极限是行不通的。利用 $\\tan u = \\frac{\\sin u}{\\cos u}$ 把分子里的正弦提出来。这样就出现一减余弦，它提供角的两次方，而正弦提供第三次方。\n\n$$\\lim_{x \\to 0} \\frac{\\tan x - \\sin x}{x^{3}} = \\lim_{x \\to 0} \\frac{\\sin x}{x} \\cdot \\frac{1 - \\cos x}{x^{2}} \\cdot \\frac{1}{\\cos x} = 1 \\cdot \\frac{1}{2} \\cdot 1 = \\frac{1}{2}.$$\n\n检验：$x = 0.1$ 时商约为 $0.5013$，$x = 0.01$ 时约为 $0.50001$。\n\n> **注意。** 拆成 $\\frac{\\tan x}{x^{3}} - \\frac{\\sin x}{x^{3}}$ 会得到 $\\infty - \\infty$。自变量是 $ax$ 时，角的每一次方都带来一个因子 $a$，所以答案中是 $a^{3}$。",
  ),
  generate(rng) {
    const a = rng.int(1, 6);
    const c = rng.int(1, 6);
    const answer = Q.of(a ** 3, 2 * c);
    const u = timesX(a);
    const product = Q.of(a ** 3, 2).toLatex();
    const scale = c === 1 ? "" : `, and dividing by $${c}$ gives $${answer.toLatex()}$`;
    const scaleZh = c === 1 ? "" : `，再除以 $${c}$ 得 $${answer.toLatex()}$`;
    const f = (x: number) => (Math.tan(a * x) - Math.sin(a * x)) / (c * x ** 3);
    return numberProblem({
      prompt: t(
        `Find $\\lim_{x \\to 0} \\frac{\\tan ${u} - \\sin ${u}}{${poly([c, "x^3"])}}$.`,
        `求 $\\lim_{x \\to 0} \\frac{\\tan ${u} - \\sin ${u}}{${poly([c, "x^3"])}}$。`,
      ),
      answer,
      wrong: [Q.of(a ** 3, 3 * c)],
      mistakes: firstMistakes(answer, [
        why(
          Q.of(a * a, 2 * c),
          `This uses $a^{2}$. Three powers of the angle each bring a factor $${a}$: $${a}^{3}$.`,
          `这用了 $a^{2}$。角的三次方各带一个因子 $${a}$：$${a}^{3}$。`,
        ),
        why(
          Q.of(a ** 3, c),
          `This drops the $\\frac{1}{2}$ from $\\frac{1 - \\cos u}{u^{2}} \\to \\frac{1}{2}$.`,
          `这漏掉了 $\\frac{1 - \\cos u}{u^{2}} \\to \\frac{1}{2}$ 中的 $\\frac{1}{2}$。`,
        ),
        why(
          Q.of(a, 2 * c),
          `This keeps only one factor $${a}$. The argument $${u}$ appears to the third power.`,
          `这只保留了一个因子 $${a}$。自变量 $${u}$ 出现了三次方。`,
        ),
        why(
          0,
          "This takes tangent and sine as cancelling. Their difference shrinks like $x^{3}$, as fast as the bottom.",
          "这认为正切和正弦相互抵消。它们的差像 $x^{3}$ 那样趋于零，与分母一样快。",
        ),
      ]),
      solution: walk(
        [
          [
            "Factor out the sine",
            "提出正弦",
            `\n\n$$\\tan ${u} - \\sin ${u} = \\frac{\\sin ${u}}{\\cos ${u}}(1 - \\cos ${u})$$`,
            `\n\n$$\\tan ${u} - \\sin ${u} = \\frac{\\sin ${u}}{\\cos ${u}}(1 - \\cos ${u})$$`,
          ],
          [
            "Take each limit",
            "分别求极限",
            `As $x \\to 0$, $\\frac{\\sin ${u}}{x} \\to ${a}$, $\\frac{1 - \\cos ${u}}{x^2} \\to ${Q.of(a * a, 2).toLatex()}$ and $\\cos ${u} \\to 1$.`,
            `当 $x \\to 0$ 时，$\\frac{\\sin ${u}}{x} \\to ${a}$，$\\frac{1 - \\cos ${u}}{x^2} \\to ${Q.of(a * a, 2).toLatex()}$，$\\cos ${u} \\to 1$。`,
          ],
          ["Multiply", "相乘", `Multiplying these gives $${product}$${scale}.`, `三者相乘得 $${product}$${scaleZh}。`],
        ],
        [
          `Evaluate the quotient close to $x = 0$:\n\n${valueTable(around(0), [["f(x)", f]])}\n\nThe values close in on $${answer.toLatex()}${approx(answer)}$.`,
          `在 $x = 0$ 附近计算商的值：\n\n${valueTable(around(0), [["f(x)", f]])}\n\n这些值逼近 $${answer.toLatex()}${approx(answer)}$。`,
        ],
      ),
    });
  },
};

const differenceOfTwoRoots: KnowledgePointDef = {
  id: "a-difference-of-two-roots-at-infinity",
  title: t("A difference of two roots at infinity", "两个根式之差在无穷远处的极限"),
  explanation: t(
    "Two square roots with the same leading term both grow without bound, yet their difference can settle at a finite value. Multiplying by the conjugate cancels the squared terms and leaves a linear numerator over a sum of roots. Each root behaves like $k|x|$, and when $x$ is negative that absolute value contributes a change of sign.\n\nFor $\\sqrt{x^{2} + 4x} - \\sqrt{x^{2} + x}$, the conjugate gives $\\frac{3x}{\\sqrt{x^{2} + 4x} + \\sqrt{x^{2} + x}}$, and the bottom behaves like $2|x|$. So the limit as $x \\to \\infty$ is $\\frac{3}{2}$, and as $x \\to -\\infty$ it is $-\\frac{3}{2}$.\n\nCheck: at $x = 1000$ the difference is about $1.498$, and at $x = 10\\,000$ about $1.4998$.\n\n> **Watch out.** The bottom is a sum of two roots, so it behaves like $2k|x|$, not $k|x|$. And $\\infty - \\infty$ is not $0$.",
    "两个最高次项相同的平方根都无限增大，但它们的差可以趋于有限值。乘以共轭式消去平方项，剩下一次式的分子和根式之和的分母。每个根式的行为都像 $k|x|$，当 $x$ 为负时，这个绝对值会带来一次变号。\n\n对于 $\\sqrt{x^{2} + 4x} - \\sqrt{x^{2} + x}$，乘以共轭式得 $\\frac{3x}{\\sqrt{x^{2} + 4x} + \\sqrt{x^{2} + x}}$，分母的行为像 $2|x|$。所以 $x \\to \\infty$ 时极限是 $\\frac{3}{2}$，$x \\to -\\infty$ 时是 $-\\frac{3}{2}$。\n\n检验：$x = 1000$ 时这个差约为 $1.498$，$x = 10\\,000$ 时约为 $1.4998$。\n\n> **注意。** 分母是两个根式之和，行为像 $2k|x|$，不是 $k|x|$。$\\infty - \\infty$ 也不等于 $0$。",
  ),
  generate(rng) {
    const k = rng.int(1, 3);
    const a = nonzero(rng, 8);
    const c = different(rng, -8, 8, a);
    const b = rng.int(1, 9);
    const d = rng.int(1, 9);
    const positive = rng.pick([true, false]);
    const s = positive ? 1 : -1;
    const answer = Q.of(s * (a - c), 2 * k);
    const first = `\\sqrt{${poly([k * k, "x^2"], [a, "x"], [b, ""])}}`;
    const second = `\\sqrt{${poly([k * k, "x^2"], [c, "x"], [d, ""])}}`;
    const target = positive ? "\\infty" : "-\\infty";
    const top = poly([a - c, "x"], [b - d, ""]);
    const f = (x: number) => Math.sqrt(k * k * x * x + a * x + b) - Math.sqrt(k * k * x * x + c * x + d);
    const xs = [100, 1000, 10000].map((x) => s * x);
    return numberProblem({
      prompt: t(
        `Find $\\lim_{x \\to ${target}} \\left(${first} - ${second}\\right)$.`,
        `求 $\\lim_{x \\to ${target}} \\left(${first} - ${second}\\right)$。`,
      ),
      answer,
      wrong: [Q.of(s * (a - c), 4 * k)],
      mistakes: firstMistakes(answer, [
        why(
          answer.neg(),
          positive
            ? "This has the wrong sign. As $x \\to \\infty$, $|x| = x$."
            : "This takes $|x|$ as $x$. As $x \\to -\\infty$, $|x| = -x$, so the sign flips.",
          positive
            ? "这符号错了。当 $x \\to \\infty$ 时 $|x| = x$。"
            : "这把 $|x|$ 当成了 $x$。当 $x \\to -\\infty$ 时 $|x| = -x$，符号要变。",
        ),
        why(
          Q.of(s * (a - c), k),
          `This takes the bottom as $${k}|x|$. It is a sum of two roots, about $${2 * k}|x|$.`,
          `这把分母当成了 $${k}|x|$。它是两个根式之和，约为 $${2 * k}|x|$。`,
        ),
        why(Q.of(s * (a - c)), "This forgets to divide by the sum of the roots.", "这忘了除以两个根式之和。"),
        why(
          Q.of(a + c, 2 * k),
          `This adds the coefficients $${a}$ and $${c}$. The conjugate subtracts the second root's terms.`,
          `这把系数 $${a}$ 和 $${c}$ 相加了。乘以共轭式后，第二个根式的各项是减去的。`,
        ),
      ]),
      solution: walk(
        [
          [
            "Multiply by the conjugate",
            "乘以共轭式",
            `The $x^2$ terms cancel:\n\n$$${first} - ${second} = \\frac{${top}}{${first} + ${second}}$$`,
            `$x^2$ 项相消：\n\n$$${first} - ${second} = \\frac{${top}}{${first} + ${second}}$$`,
          ],
          [
            "Compare the sizes",
            "比较大小",
            `Each root behaves like $${k === 1 ? "" : k}|x|$, so the bottom behaves like $${2 * k}|x|$. ${positive ? "Here $|x| = x$" : "Here $|x| = -x$"}.`,
            `每个根式的行为像 $${k === 1 ? "" : k}|x|$，所以分母的行为像 $${2 * k}|x|$。${positive ? "这里 $|x| = x$" : "这里 $|x| = -x$"}。`,
          ],
          [
            "Divide",
            "相除",
            `\n\n$$\\frac{${poly([a - c, "x"])}}{${poly([s * 2 * k, "x"])}} = ${answer.toLatex()}$$`,
            `\n\n$$\\frac{${poly([a - c, "x"])}}{${poly([s * 2 * k, "x"])}} = ${answer.toLatex()}$$`,
          ],
        ],
        [
          `Evaluate the difference farther and farther out:\n\n${valueTable(xs, [["f(x)", f]])}\n\nThe values close in on $${answer.toLatex()}${approx(answer)}$.`,
          `计算越来越远处的差：\n\n${valueTable(xs, [["f(x)", f]])}\n\n这些值逼近 $${answer.toLatex()}${approx(answer)}$。`,
        ],
      ),
    });
  },
};

const boundedTermInRatio: KnowledgePointDef = {
  id: "a-bounded-term-inside-a-ratio-at-infinity",
  title: t("A bounded term inside a ratio at infinity", "无穷远处比值中的有界项"),
  explanation: t(
    "Sine and cosine never settle down as $x$ grows, so this limit cannot be found by substituting or by splitting into separate limits of the oscillating part. Dividing above and below by $x$ fixes it: the oscillating term becomes a bounded quantity over $x$, and the squeeze theorem sends that term to zero whatever its oscillation does.\n\nFor $\\frac{2x + 3\\sin x}{x + 5}$, divide by $x$: $\\frac{2 + \\frac{3\\sin x}{x}}{1 + \\frac{5}{x}}$. Since $\\left|\\frac{3\\sin x}{x}\\right| \\le \\frac{3}{x}$, that term tends to $0$, and the limit is $2$.\n\nCheck: at $x = 1000$ the quotient is about $1.993$, and at $x = 10\\,000$ about $1.999$.\n\n> **Watch out.** $\\sin x$ does not behave like $x$ for large $x$; that is only true near $0$. It stays between $-1$ and $1$, so only the coefficients of $x$ decide the limit.",
    "当 $x$ 增大时，正弦和余弦不会稳定下来，所以不能靠代入或单独求振荡部分的极限来解决。分子分母同除以 $x$ 就行了：振荡项变成有界量除以 $x$，无论它怎样振荡，夹逼定理都使这一项趋于零。\n\n对于 $\\frac{2x + 3\\sin x}{x + 5}$，同除以 $x$：$\\frac{2 + \\frac{3\\sin x}{x}}{1 + \\frac{5}{x}}$。因为 $\\left|\\frac{3\\sin x}{x}\\right| \\le \\frac{3}{x}$，这一项趋于 $0$，极限是 $2$。\n\n检验：$x = 1000$ 时商约为 $1.993$，$x = 10\\,000$ 时约为 $1.999$。\n\n> **注意。** 当 $x$ 很大时，$\\sin x$ 并不近似于 $x$，那只在 $0$ 附近成立。它始终在 $-1$ 与 $1$ 之间，所以只有 $x$ 的系数决定极限。",
  ),
  generate(rng) {
    const a = nonzero(rng, 6);
    const b = nonzero(rng, 9);
    const c = rng.int(1, 6);
    const d = nonzero(rng, 9);
    const wave = rng.pick(["\\sin x", "\\cos x"]);
    const trig = wave === "\\sin x" ? Math.sin : Math.cos;
    const answer = Q.of(a, c);
    const f = `\\frac{${poly([a, "x"], [b, wave])}}{${poly([c, "x"], [d, ""])}}`;
    const reduced = `\\frac{${poly([b, wave])}}{x}`;
    const g = (x: number) => (a * x + b * trig(x)) / (c * x + d);
    return numberProblem({
      prompt: t(`Find $\\lim_{x \\to \\infty} ${f}$.`, `求 $\\lim_{x \\to \\infty} ${f}$。`),
      answer,
      wrong: [Q.of(b, d), answer.mul(Q.of(2))],
      mistakes: firstMistakes(answer, [
        why(
          Q.of(a + b, c),
          `This treats $${wave}$ like $x$, which is only true near $0$ for sine. Here it stays between $-1$ and $1$.`,
          `这把 $${wave}$ 当成了 $x$，那只在 $0$ 附近对正弦成立。这里它始终在 $-1$ 与 $1$ 之间。`,
        ),
        why(
          0,
          `Only the oscillating term tends to $0$ after dividing by $x$. The terms $${poly([a, "x"])}$ and $${poly([c, "x"])}$ remain.`,
          `除以 $x$ 后只有振荡项趋于 $0$。$${poly([a, "x"])}$ 和 $${poly([c, "x"])}$ 两项还在。`,
        ),
        why(
          Q.of(a, d),
          `This divides by the constant $${d}$. After dividing by $x$, the bottom tends to $${c}$.`,
          `这除以了常数 $${d}$。同除以 $x$ 后，分母趋于 $${c}$。`,
        ),
        why(answer.neg(), `This has the wrong sign: the limit is $\\frac{${a}}{${c}}$.`, `这符号错了：极限是 $\\frac{${a}}{${c}}$。`),
        why(
          Q.of(b, c),
          `This keeps the coefficient of $${wave}$, whose term tends to $0$, instead of the coefficient of $x$.`,
          `这用了 $${wave}$ 的系数，而那一项趋于 $0$；应该用 $x$ 的系数。`,
        ),
      ]),
      solution: walk(
        [
          [
            "Divide by x",
            "同除以 x",
            `\n\n$$${f} = \\frac{${a} + ${reduced}}{${c} + \\frac{${d}}{x}}$$`,
            `\n\n$$${f} = \\frac{${a} + ${reduced}}{${c} + \\frac{${d}}{x}}$$`,
          ],
          [
            "Squeeze the oscillating term",
            "夹逼振荡项",
            `Since $\\left|${reduced}\\right| \\le \\frac{${Math.abs(b)}}{x}$, the squeeze theorem sends this term to $0$, and $\\frac{${d}}{x} \\to 0$ as well.`,
            `因为 $\\left|${reduced}\\right| \\le \\frac{${Math.abs(b)}}{x}$，由夹逼定理这一项趋于 $0$，$\\frac{${d}}{x}$ 也趋于 $0$。`,
          ],
          [
            "Read off the limit",
            "得出极限",
            `What remains is $\\frac{${a}}{${c}} = ${answer.toLatex()}$.`,
            `剩下的是 $\\frac{${a}}{${c}} = ${answer.toLatex()}$。`,
          ],
        ],
        [
          `Evaluate the quotient farther and farther out:\n\n${valueTable([100, 1000, 10000], [["f(x)", g]])}\n\nThe values wobble less and less and close in on $${answer.toLatex()}${approx(answer)}$.`,
          `计算越来越远处商的值：\n\n${valueTable([100, 1000, 10000], [["f(x)", g]])}\n\n这些值摆动越来越小，逼近 $${answer.toLatex()}${approx(answer)}$。`,
        ],
      ),
    });
  },
};

const differenceOfCosines: KnowledgePointDef = {
  id: "a-difference-of-cosines-over-x-squared",
  title: t("A difference of cosines over x squared", "余弦之差除以 x 的平方"),
  explanation: t(
    "The standard limit involves one minus a cosine, and a difference of two cosines has none in sight. Adding and subtracting one rewrites the numerator as a difference of two such expressions. Each then has its own limit over $x^{2}$, half the square of its coefficient, so the two can be taken separately and subtracted.\n\n$$\\lim_{x \\to 0} \\frac{\\cos x - \\cos 3x}{x^{2}} = \\lim_{x \\to 0} \\frac{(1 - \\cos 3x) - (1 - \\cos x)}{x^{2}} = \\frac{9}{2} - \\frac{1}{2} = 4.$$\n\nCheck: at $x = 0.01$ the quotient is about $3.9997$.\n\n> **Watch out.** Keep the order: $\\cos ax - \\cos bx = (1 - \\cos bx) - (1 - \\cos ax)$, so the answer has $b^{2} - a^{2}$, not $a^{2} - b^{2}$. Square each coefficient before subtracting.",
    "标准极限涉及一减余弦，而两个余弦之差里看不出这种形式。加一再减一，就把分子改写成两个这样的式子之差。每个式子除以 $x^{2}$ 都有自己的极限，即系数平方的一半，所以可以分别求出再相减。\n\n$$\\lim_{x \\to 0} \\frac{\\cos x - \\cos 3x}{x^{2}} = \\lim_{x \\to 0} \\frac{(1 - \\cos 3x) - (1 - \\cos x)}{x^{2}} = \\frac{9}{2} - \\frac{1}{2} = 4.$$\n\n检验：$x = 0.01$ 时商约为 $3.9997$。\n\n> **注意。** 顺序不能弄错：$\\cos ax - \\cos bx = (1 - \\cos bx) - (1 - \\cos ax)$，所以答案是 $b^{2} - a^{2}$，不是 $a^{2} - b^{2}$。先把每个系数平方，再相减。",
  ),
  generate(rng) {
    const a = rng.int(1, 7);
    const b = different(rng, 1, 7, a);
    const c = rng.int(1, 4);
    const answer = Q.of(b * b - a * a, 2 * c);
    const ua = timesX(a);
    const ub = timesX(b);
    const difference = Q.of(b * b - a * a, 2).toLatex();
    const scale = c === 1 ? "" : `, and dividing by $${c}$ gives $${answer.toLatex()}$`;
    const scaleZh = c === 1 ? "" : `，再除以 $${c}$ 得 $${answer.toLatex()}$`;
    const f = (x: number) => (Math.cos(a * x) - Math.cos(b * x)) / (c * x * x);
    return numberProblem({
      prompt: t(
        `Find $\\lim_{x \\to 0} \\frac{\\cos ${ua} - \\cos ${ub}}{${poly([c, "x^2"])}}$.`,
        `求 $\\lim_{x \\to 0} \\frac{\\cos ${ua} - \\cos ${ub}}{${poly([c, "x^2"])}}$。`,
      ),
      answer,
      mistakes: firstMistakes(answer, [
        why(
          Q.of(a * a - b * b, 2 * c),
          `This has the order reversed: $\\cos ${ua} - \\cos ${ub} = (1 - \\cos ${ub}) - (1 - \\cos ${ua})$.`,
          `这把顺序弄反了：$\\cos ${ua} - \\cos ${ub} = (1 - \\cos ${ub}) - (1 - \\cos ${ua})$。`,
        ),
        why(
          Q.of(b * b - a * a, c),
          "This drops the $\\frac{1}{2}$: $\\frac{1 - \\cos u}{u^{2}} \\to \\frac{1}{2}$.",
          "这漏掉了 $\\frac{1}{2}$：$\\frac{1 - \\cos u}{u^{2}} \\to \\frac{1}{2}$。",
        ),
        why(
          Q.of(b - a, 2 * c),
          "This does not square the coefficients. Each part gives half the square of its coefficient.",
          "这没有把系数平方。每部分给出的是系数平方的一半。",
        ),
        why(
          Q.of((b - a) ** 2, 2 * c),
          "This squares the difference of the coefficients. Square each one, then subtract.",
          "这把系数之差平方了。要先分别平方，再相减。",
        ),
      ]),
      solution: walk(
        [
          [
            "Add and subtract one",
            "加一再减一",
            `\n\n$$\\cos ${ua} - \\cos ${ub} = (1 - \\cos ${ub}) - (1 - \\cos ${ua})$$`,
            `\n\n$$\\cos ${ua} - \\cos ${ub} = (1 - \\cos ${ub}) - (1 - \\cos ${ua})$$`,
          ],
          [
            "Take each limit",
            "分别求极限",
            `Over $x^2$ these tend to $${Q.of(b * b, 2).toLatex()}$ and $${Q.of(a * a, 2).toLatex()}$.`,
            `除以 $x^2$ 后，它们分别趋于 $${Q.of(b * b, 2).toLatex()}$ 和 $${Q.of(a * a, 2).toLatex()}$。`,
          ],
          ["Subtract", "相减", `Their difference is $${difference}$${scale}.`, `二者之差是 $${difference}$${scaleZh}。`],
        ],
        [
          `Evaluate the quotient close to $x = 0$:\n\n${valueTable(around(0), [["f(x)", f]])}\n\nThe values close in on $${answer.toLatex()}${approx(answer)}$.`,
          `在 $x = 0$ 附近计算商的值：\n\n${valueTable(around(0), [["f(x)", f]])}\n\n这些值逼近 $${answer.toLatex()}${approx(answer)}$。`,
        ],
      ),
    });
  },
};

const ratioOfExponentialDifferences: KnowledgePointDef = {
  id: "a-ratio-of-two-exponential-differences",
  title: t("A ratio of two exponential differences", "两个指数差之比"),
  explanation: t(
    "Both the numerator and the denominator tend to zero, and neither has the form $e^{u} - 1$ on its own. Subtracting and adding one splits each into two familiar pieces. Dividing above and below by $x$ then turns each piece into a standard limit equal to its exponent's coefficient, so only those coefficients decide the value.\n\n$$\\lim_{x \\to 0} \\frac{e^{3x} - e^{x}}{e^{2x} - e^{-x}} = \\frac{3 - 1}{2 - (-1)} = \\frac{2}{3}.$$\n\nCheck: at $x = 0.001$ the quotient is about $0.6677$, and at $x = -0.001$ about $0.6657$.\n\n> **Watch out.** Subtract the coefficients with their signs: $2 - (-1) = 3$, not $1$. And keep the top's difference on top.",
    "分子和分母都趋于零，而且都不是 $e^{u} - 1$ 的形式。减一再加一，把每一个拆成两个熟悉的部分。分子分母同除以 $x$ 后，每一部分都变成标准极限，其值等于指数的系数，所以结果只取决于这些系数。\n\n$$\\lim_{x \\to 0} \\frac{e^{3x} - e^{x}}{e^{2x} - e^{-x}} = \\frac{3 - 1}{2 - (-1)} = \\frac{2}{3}.$$\n\n检验：$x = 0.001$ 时商约为 $0.6677$，$x = -0.001$ 时约为 $0.6657$。\n\n> **注意。** 系数要带着符号相减：$2 - (-1) = 3$，不是 $1$。分子的差要留在分子上。",
  ),
  generate(rng) {
    const a = nonzero(rng, 5);
    const b = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].filter((x) => x !== a));
    const c = nonzero(rng, 5);
    const d = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].filter((x) => x !== c && !(c === a && x === b)));
    const answer = Q.of(a - b, c - d);
    const e = (m: number) => `e^{${timesX(m)}}`;
    const f = `\\frac{${e(a)} - ${e(b)}}{${e(c)} - ${e(d)}}`;
    const g = (x: number) => (Math.exp(a * x) - Math.exp(b * x)) / (Math.exp(c * x) - Math.exp(d * x));
    const xs = [-0.001, -0.0001, 0.0001, 0.001];
    return numberProblem({
      prompt: t(`Find $\\lim_{x \\to 0} ${f}$.`, `求 $\\lim_{x \\to 0} ${f}$。`),
      answer,
      wrong: [Q.of(2 * (a - b), c - d), Q.of(a * d, b * c)],
      mistakes: firstMistakes(answer, [
        why(
          Q.of(c - d, a - b),
          "This turns the ratio upside down. The top's difference goes on top.",
          "这把比颠倒了。分子的差应在分子上。",
        ),
        why(
          Q.of(a, c),
          "This keeps only the first exponential above and below. The second ones count too.",
          "这只保留了分子分母中的第一个指数式。第二个也要算。",
        ),
        why(
          Q.of(b - a, c - d),
          `This subtracts the top's coefficients the wrong way round: it is $${a} - ${inParens(b)}$.`,
          `这把分子的系数减反了：应是 $${a} - ${inParens(b)}$。`,
        ),
        why(Q.of(a - b), `This forgets the bottom, which over $x$ tends to $${c - d}$.`, `这忘了分母，它除以 $x$ 后趋于 $${c - d}$。`),
        why(
          Q.of(b, d),
          "This keeps only the second exponential above and below. The first ones count too.",
          "这只保留了分子分母中的第二个指数式。第一个也要算。",
        ),
      ]),
      solution: walk(
        [
          [
            "Split the top",
            "拆开分子",
            `\n\n$$\\frac{${e(a)} - ${e(b)}}{x} = \\frac{${e(a)} - 1}{x} - \\frac{${e(b)} - 1}{x} \\to ${a} - ${inParens(b)} = ${a - b}$$`,
            `\n\n$$\\frac{${e(a)} - ${e(b)}}{x} = \\frac{${e(a)} - 1}{x} - \\frac{${e(b)} - 1}{x} \\to ${a} - ${inParens(b)} = ${a - b}$$`,
          ],
          [
            "Split the bottom",
            "拆开分母",
            `\n\n$$\\frac{${e(c)} - ${e(d)}}{x} \\to ${c} - ${inParens(d)} = ${c - d}$$`,
            `\n\n$$\\frac{${e(c)} - ${e(d)}}{x} \\to ${c} - ${inParens(d)} = ${c - d}$$`,
          ],
          [
            "Divide",
            "相除",
            `The limit is their ratio, $\\frac{${a - b}}{${c - d}} = ${answer.toLatex()}$.`,
            `极限是二者之比 $\\frac{${a - b}}{${c - d}} = ${answer.toLatex()}$。`,
          ],
        ],
        [
          `Evaluate the quotient close to $x = 0$:\n\n${valueTable(xs, [["f(x)", g]])}\n\nThe values close in on $${answer.toLatex()}${approx(answer)}$.`,
          `在 $x = 0$ 附近计算商的值：\n\n${valueTable(xs, [["f(x)", g]])}\n\n这些值逼近 $${answer.toLatex()}${approx(answer)}$。`,
        ],
      ),
    });
  },
};

const differentiableJoin: KnowledgePointDef = {
  id: "constants-that-make-a-join-differentiable",
  title: t("Constants that make a join differentiable", "使连接处可导的常数"),
  explanation: t(
    "Two pieces join smoothly only if two things hold at the break point. The values must agree, because a differentiable function is continuous, and the one-sided slopes must agree, so that there is no corner. With a line as one piece, the slope condition fixes its slope, and the value condition then fixes its intercept.\n\nFor $x^{2}$ when $x \\le 1$ and $mx + n$ when $x > 1$: the slopes give $m = 2 \\cdot 1 = 2$, and the values give $2 + n = 1$, so $n = -1$.\n\nCheck: $y = 2x - 1$ is the tangent line to $x^{2}$ at $(1, 1)$, so the line carries on exactly where the parabola leaves off, with no corner.\n\n> **Watch out.** Fix $m$ from the slopes first, then $n$ from the values. Matching the values alone only makes $f$ continuous, and $n$ is not the value at the break point but the intercept of the line.",
    "两段要光滑连接，分段点处必须同时满足两件事。函数值必须相等，因为可导函数一定连续；单侧斜率也必须相等，这样才没有尖角。当其中一段是直线时，斜率条件确定它的斜率，然后函数值条件确定它的截距。\n\n对 $x \\le 1$ 时的 $x^{2}$ 和 $x > 1$ 时的 $mx + n$：斜率条件给出 $m = 2 \\cdot 1 = 2$，函数值条件给出 $2 + n = 1$，所以 $n = -1$。\n\n检验：$y = 2x - 1$ 正是 $x^{2}$ 在 $(1, 1)$ 处的切线，所以直线恰好在抛物线结束的地方接上，没有尖角。\n\n> **注意。** 先由斜率确定 $m$，再由函数值确定 $n$。只让函数值相等只能保证连续；$n$ 也不是分段点处的函数值，而是直线的截距。",
  ),
  generate(rng) {
    const c = nonzero(rng, 4);
    const a = nonzero(rng, 3);
    const p = nonzero(rng, 9);
    const q = nonzero(rng, 9);
    const m = 2 * a * c + p;
    const value = a * c * c + p * c + q;
    const answer = value - m * c;
    const f = `\\begin{cases} ${poly([a, "x^2"], [p, "x"], [q, ""])} & x \\le ${c} \\\\ mx + n & x > ${c} \\end{cases}`;
    const first = (x: number) => a * x * x + p * x + q;
    return numberProblem({
      prompt: t(
        `Let $f(x) = ${f}$. The constants $m$ and $n$ are chosen so that $f$ is differentiable at $x = ${c}$. Find $n$.`,
        `设 $f(x) = ${f}$。选取常数 $m$ 和 $n$，使 $f$ 在 $x = ${c}$ 处可导。求 $n$。`,
      ),
      answer,
      form: "integer",
      wrong: [answer + c, answer + 2 * c, answer - 2 * c],
      mistakes: firstMistakes(answer, [
        why(
          value,
          `This is the value $f(${c}) = ${value}$. $n$ is the intercept of the line: $n = ${value} - ${inParens(m)} \\cdot ${inParens(c)}$.`,
          `这是函数值 $f(${c}) = ${value}$。$n$ 是直线的截距：$n = ${value} - ${inParens(m)} \\cdot ${inParens(c)}$。`,
        ),
        why(m, `This is $m$, the slope. The question asks for $n$.`, `这是斜率 $m$。题目问的是 $n$。`),
        why(
          value + m * c,
          `This adds $${m} \\cdot ${inParens(c)}$ instead of subtracting it: $${m} \\cdot ${inParens(c)} + n = ${value}$.`,
          `这加上了 $${m} \\cdot ${inParens(c)}$，应该减去：$${m} \\cdot ${inParens(c)} + n = ${value}$。`,
        ),
        why(q, "This is the constant of the first piece. The line needs its own intercept.", "这是第一段的常数项。直线有自己的截距。"),
      ]),
      solution: walk(
        [
          [
            "Match the slopes",
            "令斜率相等",
            `The first piece has derivative $${poly([2 * a, "x"], [p, ""])}$, which is $${m}$ at $x = ${c}$, so $m = ${m}$.`,
            `第一段的导数是 $${poly([2 * a, "x"], [p, ""])}$，在 $x = ${c}$ 处等于 $${m}$，所以 $m = ${m}$。`,
          ],
          [
            "Match the values",
            "令函数值相等",
            `The first piece gives $${value}$ at $x = ${c}$, so\n\n$$${m} \\cdot ${inParens(c)} + n = ${value} \\quad\\Rightarrow\\quad n = ${answer}.$$`,
            `第一段在 $x = ${c}$ 处的值是 $${value}$，所以\n\n$$${m} \\cdot ${inParens(c)} + n = ${value} \\quad\\Rightarrow\\quad n = ${answer}.$$`,
          ],
        ],
        [
          `With $h = 0.01$ the difference quotient at $x = ${c}$ uses the line and is exactly $${m}$; with $h = -0.01$ it uses the first piece and is $${num((first(c - 0.01) - value) / -0.01)}$. Both sides have slope close to $${m}$, so there is no corner.`,
          `在 $x = ${c}$ 处，取 $h = 0.01$ 时差商用的是直线，恰好是 $${m}$；取 $h = -0.01$ 时用的是第一段，为 $${num((first(c - 0.01) - value) / -0.01)}$。两侧斜率都接近 $${m}$，所以没有尖角。`,
        ],
      ),
    });
  },
};

const leastSlopeOnCubic: KnowledgePointDef = {
  id: "the-extreme-slope-on-a-cubic",
  figure: calculusDrawings2["calculating-the-slope-of-a-tangent-line-using-differentiation#the-extreme-slope-on-a-cubic"],
  title: t("The extreme slope on a cubic", "三次曲线上斜率的最值"),
  explanation: t(
    "The slope of a cubic at each point is given by its derivative, which is a quadratic in $x$. So the slope itself has an extreme value, at the vertex of that parabola: a least slope when the cubic's leading coefficient is positive and a greatest slope when it is negative. No tangent line on the curve can go beyond it.\n\nFor $y = x^{3} - 6x^{2} + 5x$, the slope $y' = 3x^{2} - 12x + 5$ has its vertex at $x = 2$, so the least slope is $12 - 24 + 5 = -7$.\n\nCheck: at $x = 1.9$ and at $x = 2.1$ the slope is $-6.97$, a little more than $-7$.\n\n> **Watch out.** The extreme slope is the value of $y'$ at the vertex, not the $x$-value of the vertex, and not the slope $y'(0)$ at the origin.",
    "三次曲线在每一点的斜率由它的导数给出，而导数是 $x$ 的二次式。所以斜率本身有最值，出现在这条抛物线的顶点处：三次项系数为正时是最小斜率，为负时是最大斜率。曲线上任何切线的斜率都不会超过这个界限。\n\n对 $y = x^{3} - 6x^{2} + 5x$，斜率 $y' = 3x^{2} - 12x + 5$ 的顶点在 $x = 2$，所以最小斜率是 $12 - 24 + 5 = -7$。\n\n检验：在 $x = 1.9$ 和 $x = 2.1$ 处斜率都是 $-6.97$，比 $-7$ 略大。\n\n> **注意。** 斜率的最值是 $y'$ 在顶点处的值，不是顶点的横坐标，也不是原点处的斜率 $y'(0)$。",
  ),
  generate(rng) {
    const a = nonzero(rng, 3);
    const k = nonzero(rng, 4);
    const c = nonzero(rng, 9);
    const d = nonzero(rng, 9);
    const answer = c - 3 * a * k * k;
    const y = poly([a, "x^3"], [3 * a * k, "x^2"], [c, "x"], [d, ""]);
    const slope = poly([3 * a, "x^2"], [6 * a * k, "x"], [c, ""]);
    const least = a > 0;
    return numberProblem({
      prompt: t(
        `Find the ${least ? "least" : "greatest"} possible slope of a tangent line to $y = ${y}$.`,
        `求 $y = ${y}$ 的切线斜率的${least ? "最小" : "最大"}值。`,
      ),
      answer,
      form: "integer",
      mistakes: firstMistakes(answer, [
        why(
          -k,
          `This is where the extreme slope occurs, $x = ${-k}$, not the slope itself.`,
          `这是斜率取最值的位置 $x = ${-k}$，不是斜率本身。`,
        ),
        why(
          c,
          "This is $y'(0)$, the slope at the origin, not at the vertex of $y'$.",
          "这是原点处的斜率 $y'(0)$，不是 $y'$ 顶点处的斜率。",
        ),
        why(
          c + 3 * a * k * k,
          `This has the sign of the $x^{2}$ term wrong: at $x = ${-k}$, $${3 * a}x^{2} + ${inParens(6 * a * k)}x = ${3 * a * k * k} - ${inParens(6 * a * k * k)}$.`,
          `这把二次项的符号弄错了：在 $x = ${-k}$ 处，$${3 * a}x^{2} + ${inParens(6 * a * k)}x = ${3 * a * k * k} - ${inParens(6 * a * k * k)}$。`,
        ),
        why(
          c - 6 * a * k * k,
          `This leaves out the $x^{2}$ term of $y'$, which is $${3 * a * k * k}$ at $x = ${-k}$.`,
          `这漏掉了 $y'$ 的二次项，它在 $x = ${-k}$ 处等于 $${3 * a * k * k}$。`,
        ),
      ]),
      solution: walk(
        [
          [
            "Differentiate",
            "求导",
            `The slope of the curve at each $x$ is $y' = ${slope}$.`,
            `曲线在每个 $x$ 处的斜率是 $y' = ${slope}$。`,
          ],
          [
            "Find the vertex of the slope",
            "求斜率的顶点",
            `$y'$ is a parabola that opens ${least ? "upwards" : "downwards"}, with its vertex at $x = -\\frac{${6 * a * k}}{2 \\cdot ${inParens(3 * a)}} = ${-k}$.`,
            `$y'$ 是开口向${least ? "上" : "下"}的抛物线，顶点在 $x = -\\frac{${6 * a * k}}{2 \\cdot ${inParens(3 * a)}} = ${-k}$。`,
          ],
          [
            "Evaluate the slope there",
            "求该处的斜率",
            `$y'(${-k}) = ${3 * a * k * k} - ${inParens(6 * a * k * k)} + ${inParens(c)} = ${answer}$.`,
            `$y'(${-k}) = ${3 * a * k * k} - ${inParens(6 * a * k * k)} + ${inParens(c)} = ${answer}$。`,
          ],
        ],
        [
          `On either side of the vertex, at $x = ${-k - 1}$ and $x = ${-k + 1}$, the slope is $${answer + 3 * a}$, ${least ? "more" : "less"} than $${answer}$, as an extreme value should be.`,
          `在顶点两侧的 $x = ${-k - 1}$ 和 $x = ${-k + 1}$ 处，斜率都是 $${answer + 3 * a}$，比 $${answer}$ ${least ? "大" : "小"}，最值正应如此。`,
        ],
      ),
    });
  },
};

const arctanOfPowerAtPoint: KnowledgePointDef = {
  id: "an-arctangent-of-a-power-at-a-point",
  title: t("An arctangent of a power at a point", "幂函数的反正切在一点的导数"),
  explanation: t(
    "The derivative of arctangent is one over one plus the square of its argument, and the chain rule multiplies that by the derivative of the argument. When the argument is a power of $x$, the numerator grows like one power and the denominator like a much higher one, so compute both at the point.\n\nFor example, $f(x) = 2\\arctan\\left(x^{2}\\right)$ at $x = 1$: the inside is $1$ and its derivative is $2$, so\n\n$$f'(1) = \\frac{2 \\cdot 2}{1 + 1^{2}} = 2.$$\n\nCheck: the difference quotients of $f$ at $1$ with $h = 0.01$ and $h = -0.01$ are about $1.990$ and $2.010$, on either side of $2$.\n\n> **Watch out.** Square the inside, not $x$: at $x = 2$ the inside $x^{2}$ is $4$, so the denominator is $1 + 16$, not $1 + 4$.",
    "反正切的导数是一除以一加自变量的平方，链式法则再乘以内层函数的导数。当内层是 $x$ 的幂时，分子按较低的幂增长，分母按高得多的幂增长，所以两者都要在该点算出来。\n\n例如 $f(x) = 2\\arctan\\left(x^{2}\\right)$ 在 $x = 1$ 处：内层是 $1$，它的导数是 $2$，所以\n\n$$f'(1) = \\frac{2 \\cdot 2}{1 + 1^{2}} = 2.$$\n\n检验：$f$ 在 $1$ 处取 $h = 0.01$ 和 $h = -0.01$ 的差商约为 $1.990$ 和 $2.010$，位于 $2$ 的两侧。\n\n> **注意。** 要平方的是内层，而不是 $x$：在 $x = 2$ 处，内层 $x^{2}$ 是 $4$，所以分母是 $1 + 16$，不是 $1 + 4$。",
  ),
  generate(rng) {
    const big = rng.int(1, 6);
    const b = rng.int(1, 3);
    const n = rng.pick([2, 3]);
    const c = rng.pick([-2, -1, 1, 2]);
    const inner = b * c ** n;
    const slope = b * n * c ** (n - 1);
    const top = big * slope;
    const bottom = 1 + inner * inner;
    const answer = Q.of(top, bottom);
    const f = poly([big, `\\arctan\\left(${poly([b, `x^{${n}}`])}\\right)`]);
    const F = (x: number) => big * Math.atan(b * x ** n);
    const quotient = (F(c + 0.001) - F(c - 0.001)) / 0.002;
    return numberProblem({
      prompt: t(`Let $f(x) = ${f}$. Find $f'(${c})$.`, `设 $f(x) = ${f}$。求 $f'(${c})$。`),
      answer,
      wrong: [Q.of(big, bottom), Q.of(top), Q.of(top, 1 + Math.abs(inner)), Q.of(-top, bottom)],
      solution: walk(
        [
          [
            "Evaluate the inside",
            "求内层的值",
            `At $x = ${c}$ the inside $${poly([b, `x^{${n}}`])}$ is $${inner}$, and its derivative $${poly([b * n, n === 2 ? "x" : "x^{2}"])}$ is $${slope}$.`,
            `在 $x = ${c}$ 处，内层 $${poly([b, `x^{${n}}`])}$ 等于 $${inner}$，它的导数 $${poly([b * n, n === 2 ? "x" : "x^{2}"])}$ 等于 $${slope}$。`,
          ],
          [
            "Apply the chain rule",
            "用链式法则",
            `Multiply $${big}$ by the derivative of the inside, and divide by $1$ plus the inside squared:\n\n$$f'(${c}) = \\frac{${big} \\cdot ${inParens(slope)}}{1 + ${inParens(inner)}^{2}} = ${answer.toLatex()}.$$`,
            `把 $${big}$ 乘以内层的导数，再除以 $1$ 加内层的平方：\n\n$$f'(${c}) = \\frac{${big} \\cdot ${inParens(slope)}}{1 + ${inParens(inner)}^{2}} = ${answer.toLatex()}.$$`,
          ],
        ],
        [
          `The difference quotient of $f$ from $x = ${num(c - 0.001)}$ to $x = ${num(c + 0.001)}$ is about $${num(quotient)}$, which agrees with $${answer.toLatex()}${approx(answer)}$.`,
          `$f$ 从 $x = ${num(c - 0.001)}$ 到 $x = ${num(c + 0.001)}$ 的差商约为 $${num(quotient)}$，与 $${answer.toLatex()}${approx(answer)}$ 相符。`,
        ],
      ),
    });
  },
};

const logOfTrig: KnowledgePointDef = {
  id: "a-logarithm-of-a-trigonometric-function-at-a-point",
  title: t("A logarithm of a trigonometric function at a point", "三角函数的对数在一点的导数"),
  explanation: t(
    "The rule for a logarithm divides the derivative of the inside by the inside, and a trigonometric inside then simplifies. The derivative of $\\ln(\\sin u)$ with respect to $u$ becomes a cotangent, and that of $\\ln(\\cos u)$ becomes a negative tangent. The chain rule still multiplies by the derivative of the angle, a step that is easy to forget.\n\nFor example, $f(x) = \\ln(\\sin 2x)$ has $f'(x) = \\frac{2\\cos 2x}{\\sin 2x} = 2\\cot 2x$. At $x = \\frac{\\pi}{8}$ the angle is $\\frac{\\pi}{4}$, where $\\cot = 1$, so $f'\\left(\\frac{\\pi}{8}\\right) = 2$.\n\nCheck: $\\frac{\\pi}{8} \\approx 0.3927$, and the difference quotients there with $h = 0.01$ and $h = -0.01$ are about $1.961$ and $2.041$, on either side of $2$.\n\n> **Watch out.** Multiply by the derivative of the angle, here $2$. And $\\ln(\\cos u)$ has derivative $-\\tan u$, with a minus sign.",
    "对数的求导法则是内层的导数除以内层，而内层是三角函数时还能进一步化简。$\\ln(\\sin u)$ 对 $u$ 的导数化为余切，$\\ln(\\cos u)$ 对 $u$ 的导数化为负的正切。链式法则还要再乘以角的导数，这一步很容易漏掉。\n\n例如 $f(x) = \\ln(\\sin 2x)$ 的导数是 $f'(x) = \\frac{2\\cos 2x}{\\sin 2x} = 2\\cot 2x$。在 $x = \\frac{\\pi}{8}$ 处角为 $\\frac{\\pi}{4}$，此时 $\\cot = 1$，所以 $f'\\left(\\frac{\\pi}{8}\\right) = 2$。\n\n检验：$\\frac{\\pi}{8} \\approx 0.3927$，在该处取 $h = 0.01$ 和 $h = -0.01$ 的差商约为 $1.961$ 和 $2.041$，位于 $2$ 的两侧。\n\n> **注意。** 要乘以角的导数，这里是 $2$。$\\ln(\\cos u)$ 的导数是 $-\\tan u$，带负号。",
  ),
  generate(rng) {
    const big = nonzero(rng, 6);
    const b = rng.int(1, 6);
    const [name, factor] = rng.pick([
      ["\\sin", 1],
      ["\\cos", -1],
      ["\\tan", 2],
    ] as const);
    const answer = big * b * factor;
    const u = timesX(b);
    const f = poly([big, `\\ln\\left(${name} ${u}\\right)`]);
    const at = `\\frac{\\pi}{${4 * b}}`;
    const rate = factor === 1 ? `\\cot ${u}` : factor === -1 ? `\\left(-\\tan ${u}\\right)` : `\\frac{\\sec^{2} ${u}}{\\tan ${u}}`;
    const value =
      factor === 1
        ? "\\cot \\frac{\\pi}{4} = 1"
        : factor === -1
          ? "-\\tan \\frac{\\pi}{4} = -1"
          : "\\frac{\\sec^{2} \\frac{\\pi}{4}}{\\tan \\frac{\\pi}{4}} = \\frac{2}{1} = 2";
    const trig = factor === 1 ? Math.sin : factor === -1 ? Math.cos : Math.tan;
    const fn = (x: number) => big * Math.log(trig(b * x));
    const x0 = Math.PI / (4 * b);
    const dq = (h: number) => (fn(x0 + h) - fn(x0)) / h;
    return numberProblem({
      prompt: t(`Let $f(x) = ${f}$. Find $f'\\left(${at}\\right)$.`, `设 $f(x) = ${f}$。求 $f'\\left(${at}\\right)$。`),
      answer,
      form: "integer",
      mistakes: firstMistakes(answer, [
        why(big * factor, `This leaves out the derivative of the angle, $${b}$.`, `这漏掉了角的导数 $${b}$。`),
        factor === -1
          ? why(
              -answer,
              "The derivative of $\\ln(\\cos u)$ is $-\\tan u$; the minus sign is missing.",
              "$\\ln(\\cos u)$ 的导数是 $-\\tan u$；这里漏了负号。",
            )
          : why(
              -answer,
              `This has the wrong sign: at $\\frac{\\pi}{4}$ the last factor is $${factor}$, which is positive.`,
              `符号错了：在 $\\frac{\\pi}{4}$ 处最后的因子是 $${factor}$，是正数。`,
            ),
        ...(factor === 2
          ? [
              why(
                big * b,
                "This takes $\\sec^{2} \\frac{\\pi}{4}$ as $1$; it is $2$.",
                "这把 $\\sec^{2} \\frac{\\pi}{4}$ 当成了 $1$；它是 $2$。",
              ),
            ]
          : []),
      ]),
      solution: walk(
        [
          [
            "Differentiate",
            "求导",
            `The derivative of $\\ln(${name} u)$ is the derivative of $${name} u$ over $${name} u$, and $u = ${u}$ has derivative $${b}$, so $f'(x) = ${big * b} \\cdot ${rate}$.`,
            `$\\ln(${name} u)$ 的导数是 $${name} u$ 的导数除以 $${name} u$，而 $u = ${u}$ 的导数是 $${b}$，所以 $f'(x) = ${big * b} \\cdot ${rate}$。`,
          ],
          [
            "Evaluate at the point",
            "在该点求值",
            `At $x = ${at}$ the angle $${u}$ is $\\frac{\\pi}{4}$, where $${value}$. So $f'\\left(${at}\\right) = ${big * b} \\cdot ${inParens(factor)} = ${answer}$.`,
            `在 $x = ${at}$ 处，角 $${u}$ 等于 $\\frac{\\pi}{4}$，此时 $${value}$。所以 $f'\\left(${at}\\right) = ${big * b} \\cdot ${inParens(factor)} = ${answer}$。`,
          ],
        ],
        [
          `$${at} \\approx ${num(x0)}$. The difference quotients of $f$ there are about $${num(dq(0.01))}$ for $h = 0.01$ and $${num(dq(-0.01))}$ for $h = -0.01$; their average, $${num((dq(0.01) + dq(-0.01)) / 2)}$, is close to $${answer}$.`,
          `$${at} \\approx ${num(x0)}$。$f$ 在该处的差商，$h = 0.01$ 时约为 $${num(dq(0.01))}$，$h = -0.01$ 时约为 $${num(dq(-0.01))}$；它们的平均值 $${num((dq(0.01) + dq(-0.01)) / 2)}$ 接近 $${answer}$。`,
        ],
      ),
    });
  },
};

const powerOfTrigOfMultiple: KnowledgePointDef = {
  id: "a-power-of-a-trigonometric-function-of-a-multiple",
  title: t("A power of a trigonometric function of a multiple", "倍角三角函数的幂"),
  explanation: t(
    "A function such as $\\tan^{2}(bx)$ has three layers: the square, the tangent and the multiple of $x$. The chain rule produces one factor for each layer, working from the outside in. Evaluating at a point where the angle is $\\frac{\\pi}{4}$ keeps the values simple and shows clearly whether a factor from any layer was dropped.\n\nFor example, for $f(x) = \\tan^{2}(3x)$ at $x = \\frac{\\pi}{12}$, the angle is $u = \\frac{\\pi}{4}$. The square gives $2\\tan u = 2$, the tangent gives $\\sec^{2} u = 2$, and the multiple gives $3$, so $f'\\left(\\frac{\\pi}{12}\\right) = 2 \\cdot 2 \\cdot 3 = 12$.\n\nCheck: $\\frac{\\pi}{12} \\approx 0.2618$, and the difference quotients there with $h = 0.01$ and $h = -0.01$ are about $12.76$ and $11.31$, on either side of $12$.\n\n> **Watch out.** Three layers give three factors. Leaving out the $3$ from $3x$, or the $\\sec^{2} u$ from the tangent, are the common slips.",
    "$\\tan^{2}(bx)$ 这样的函数有三层：平方、正切和 $x$ 的倍数。链式法则由外向内为每一层产生一个因子。在角等于 $\\frac{\\pi}{4}$ 的点求值，数值简单，也能清楚地看出是否漏掉了某一层的因子。\n\n例如，对 $f(x) = \\tan^{2}(3x)$ 在 $x = \\frac{\\pi}{12}$ 处，角为 $u = \\frac{\\pi}{4}$。平方给出 $2\\tan u = 2$，正切给出 $\\sec^{2} u = 2$，倍数给出 $3$，所以 $f'\\left(\\frac{\\pi}{12}\\right) = 2 \\cdot 2 \\cdot 3 = 12$。\n\n检验：$\\frac{\\pi}{12} \\approx 0.2618$，在该处取 $h = 0.01$ 和 $h = -0.01$ 的差商约为 $12.76$ 和 $11.31$，位于 $12$ 的两侧。\n\n> **注意。** 三层给出三个因子。漏掉 $3x$ 带来的 $3$，或漏掉正切带来的 $\\sec^{2} u$，是常见的错误。",
  ),
  generate(rng) {
    const big = nonzero(rng, 6);
    const b = rng.int(1, 6);
    const [outer, factor, steps, fn, drop] = rng.pick([
      ["\\tan^{2}", 4, "2\\tan u \\sec^{2} u = 2 \\cdot 1 \\cdot 2 = 4", (v: number) => Math.tan(v) ** 2, 2],
      ["\\sec^{2}", 4, "2\\sec^{2} u \\tan u = 2 \\cdot 2 \\cdot 1 = 4", (v: number) => 1 / Math.cos(v) ** 2, 0],
      ["\\sin^{2}", 1, "2\\sin u \\cos u = \\sin 2u = 1", (v: number) => Math.sin(v) ** 2, 0],
      ["\\cos^{2}", -1, "-2\\cos u \\sin u = -\\sin 2u = -1", (v: number) => Math.cos(v) ** 2, 0],
      ["\\tan^{3}", 6, "3\\tan^{2} u \\sec^{2} u = 3 \\cdot 1 \\cdot 2 = 6", (v: number) => Math.tan(v) ** 3, 3],
    ] as const);
    const answer = big * b * factor;
    const u = timesX(b);
    const f = poly([big, `${outer}(${u})`]);
    const at = `\\frac{\\pi}{${4 * b}}`;
    const x0 = Math.PI / (4 * b);
    const dq = (h: number) => (big * fn(b * (x0 + h)) - big * fn(b * x0)) / h;
    return numberProblem({
      prompt: t(`Let $f(x) = ${f}$. Find $f'\\left(${at}\\right)$.`, `设 $f(x) = ${f}$。求 $f'\\left(${at}\\right)$。`),
      answer,
      form: "integer",
      mistakes: firstMistakes(answer, [
        why(
          big * factor,
          `This leaves out $\\frac{du}{dx} = ${b}$, the factor from the multiple of $x$.`,
          `这漏掉了 $\\frac{du}{dx} = ${b}$，即 $x$ 的倍数带来的因子。`,
        ),
        why(
          -answer,
          `This has the wrong sign: at $u = \\frac{\\pi}{4}$ the derivative of $${outer} u$ is $${factor}$.`,
          `符号错了：在 $u = \\frac{\\pi}{4}$ 处，$${outer} u$ 的导数是 $${factor}$。`,
        ),
        ...(drop !== 0
          ? [
              why(
                big * b * drop,
                "This differentiates the power but leaves out $\\sec^{2} u = 2$, the derivative of the tangent.",
                "这对幂求了导，但漏掉了正切的导数 $\\sec^{2} u = 2$。",
              ),
            ]
          : []),
        why(
          big * b,
          `This leaves out the derivative of the outer layers, $${factor}$ at $u = \\frac{\\pi}{4}$.`,
          `这漏掉了外面几层的导数，它在 $u = \\frac{\\pi}{4}$ 处等于 $${factor}$。`,
        ),
      ]),
      solution: walk(
        [
          [
            "Name the layers",
            "分出各层",
            `Let $u = ${u}$, so $f = ${poly([big, `${outer} u`])}$ and $u = \\frac{\\pi}{4}$ at $x = ${at}$.`,
            `令 $u = ${u}$，则 $f = ${poly([big, `${outer} u`])}$，且在 $x = ${at}$ 处 $u = \\frac{\\pi}{4}$。`,
          ],
          [
            "Differentiate with respect to $u$",
            "对 $u$ 求导",
            `The derivative of $${outer} u$ with respect to $u$ is $${steps}$ there.`,
            `$${outer} u$ 关于 $u$ 的导数在此处是 $${steps}$。`,
          ],
          [
            "Multiply the factors",
            "把各因子相乘",
            `Multiplying by the coefficient $${big}$ and by $\\frac{du}{dx} = ${b}$ gives $${inParens(big)} \\cdot ${inParens(factor)} \\cdot ${b} = ${answer}$.`,
            `再乘以系数 $${big}$ 和 $\\frac{du}{dx} = ${b}$，得 $${inParens(big)} \\cdot ${inParens(factor)} \\cdot ${b} = ${answer}$。`,
          ],
        ],
        [
          `$${at} \\approx ${num(x0)}$. The difference quotients of $f$ there are about $${num(dq(0.01))}$ for $h = 0.01$ and $${num(dq(-0.01))}$ for $h = -0.01$; their average, $${num((dq(0.01) + dq(-0.01)) / 2)}$, is close to $${answer}$.`,
          `$${at} \\approx ${num(x0)}$。$f$ 在该处的差商，$h = 0.01$ 时约为 $${num(dq(0.01))}$，$h = -0.01$ 时约为 $${num(dq(-0.01))}$；它们的平均值 $${num((dq(0.01) + dq(-0.01)) / 2)}$ 接近 $${answer}$。`,
        ],
      ),
    });
  },
};

const secondDerivativeFromDxDy: KnowledgePointDef = {
  id: "the-second-derivative-when-x-is-a-function-of-y",
  title: t("The second derivative when x is a function of y", "x 是 y 的函数时的二阶导数"),
  explanation: t(
    "When $x$ is given in terms of $y$, the first derivative $\\frac{dy}{dx}$ is the reciprocal of $x'(y)$. Differentiating again with respect to $x$ needs care, because this reciprocal is a function of $y$: the chain rule contributes one more factor of $\\frac{dy}{dx}$, so\n\n$$\\frac{d^{2}y}{dx^{2}} = -\\frac{x''(y)}{x'(y)^{2}} \\cdot \\frac{1}{x'(y)} = -\\frac{x''(y)}{x'(y)^{3}}.$$\n\nFor example, on $x = y^{3} + y$ at $(2, 1)$, $x' = 4$ and $x'' = 6$, so the second derivative is $-\\frac{6}{64}$, which is $-\\frac{3}{32} \\approx -0.0938$.\n\nCheck: solving $y^{3} + y = x$ for $y$ gives $y \\approx 0.997495$ at $x = 1.99$ and $y \\approx 1.002495$ at $x = 2.01$. The second difference of $y$ with step $0.01$ is about $-0.0938$.\n\n> **Watch out.** The result is not $\\frac{1}{x''(y)}$, the reciprocal of the second derivative of $x$. The power in the denominator is $3$: two from differentiating the reciprocal and one from the chain rule.",
    "当 $x$ 用 $y$ 表示时，一阶导数 $\\frac{dy}{dx}$ 是 $x'(y)$ 的倒数。再对 $x$ 求导时要小心，因为这个倒数是 $y$ 的函数：链式法则还要多乘一个因子 $\\frac{dy}{dx}$，所以\n\n$$\\frac{d^{2}y}{dx^{2}} = -\\frac{x''(y)}{x'(y)^{2}} \\cdot \\frac{1}{x'(y)} = -\\frac{x''(y)}{x'(y)^{3}}.$$\n\n例如在曲线 $x = y^{3} + y$ 上的点 $(2, 1)$ 处，$x' = 4$，$x'' = 6$，所以二阶导数是 $-\\frac{6}{64}$，即 $-\\frac{3}{32} \\approx -0.0938$。\n\n检验：由 $y^{3} + y = x$ 解出 $y$，在 $x = 1.99$ 处 $y \\approx 0.997495$，在 $x = 2.01$ 处 $y \\approx 1.002495$。$y$ 以步长 $0.01$ 的二阶差分约为 $-0.0938$。\n\n> **注意。** 结果不是 $x$ 的二阶导数的倒数 $\\frac{1}{x''(y)}$。分母的幂是 $3$：对倒数求导贡献 $2$，链式法则再贡献 $1$。",
  ),
  generate(rng) {
    const a = rng.int(1, 2);
    const p = rng.int(1, 5);
    const c = rng.pick([-2, -1, 1, 2]);
    const q = nonzero(rng, 5);
    const first = 3 * a * c * c + p;
    const second = 6 * a * c;
    const x0 = a * c ** 3 + p * c + q;
    const answer = Q.of(-second, first ** 3);
    const curve = poly([a, "y^3"], [p, "y"], [q, ""]);
    // x'(y) = 3ay² + p is positive, so Newton's method from y = c finds the one y for each x near x0.
    const yAt = (x: number) => {
      let y = c;
      for (let i = 0; i < 30; i++) y -= (a * y ** 3 + p * y + q - x) / (3 * a * y * y + p);
      return y;
    };
    const sig = (v: number) => String(Number(v.toPrecision(4)));
    const difference = (yAt(x0 + 0.01) - 2 * yAt(x0) + yAt(x0 - 0.01)) / 0.0001;
    return numberProblem({
      prompt: t(
        `The point $(${x0}, ${c})$ lies on the curve $x = ${curve}$. Find $\\frac{d^{2}y}{dx^{2}}$ at this point.`,
        `点 $(${x0}, ${c})$ 在曲线 $x = ${curve}$ 上。求此点处的 $\\frac{d^{2}y}{dx^{2}}$。`,
      ),
      answer,
      wrong: [Q.of(second, first ** 3), Q.of(-second, first * first), Q.of(1, second), Q.of(1, first)],
      solution: walk(
        [
          [
            "Differentiate x twice",
            "对 x 求两次导",
            `$x'(y) = ${poly([3 * a, "y^2"], [p, ""])}$ and $x''(y) = ${poly([6 * a, "y"])}$. At $y = ${c}$ they are $${first}$ and $${second}$.`,
            `$x'(y) = ${poly([3 * a, "y^2"], [p, ""])}$，$x''(y) = ${poly([6 * a, "y"])}$。在 $y = ${c}$ 处它们分别是 $${first}$ 和 $${second}$。`,
          ],
          [
            "Use the second derivative formula",
            "用二阶导数公式",
            `Differentiating the reciprocal of $x'(y)$ with respect to $x$ gives\n\n$$\\frac{d^{2}y}{dx^{2}} = -\\frac{x''(y)}{x'(y)^{3}} = -\\frac{${second}}{${inParens(first)}^{3}} = ${answer.toLatex()}.$$`,
            `把 $x'(y)$ 的倒数对 $x$ 求导，得\n\n$$\\frac{d^{2}y}{dx^{2}} = -\\frac{x''(y)}{x'(y)^{3}} = -\\frac{${second}}{${inParens(first)}^{3}} = ${answer.toLatex()}.$$`,
          ],
        ],
        [
          `Solving the curve's equation for $y$ at $x = ${num(x0 - 0.01)}$, $${x0}$ and $${num(x0 + 0.01)}$ by Newton's method and taking the second difference with step $0.01$ gives about $${sig(difference)}$, which agrees with $${answer.toLatex()} \\approx ${sig(answer.toNumber())}$.`,
          `用牛顿法由曲线方程解出 $x = ${num(x0 - 0.01)}$、$${x0}$ 和 $${num(x0 + 0.01)}$ 处的 $y$，取步长 $0.01$ 的二阶差分，约为 $${sig(difference)}$，与 $${answer.toLatex()} \\approx ${sig(answer.toNumber())}$ 相符。`,
        ],
      ),
    });
  },
};

const squareFromDiagonal: KnowledgePointDef = {
  id: "the-area-of-a-square-from-its-diagonal",
  title: t("The area of a square from its diagonal", "由对角线求正方形的面积"),
  explanation: t(
    "A related-rates problem is easiest when the quantities are linked directly. The side of a square is the diagonal divided by the square root of two, and squaring removes that root, so the area is half the square of the diagonal. Differentiating this relation with respect to time links the two rates without ever computing the side.\n\nFor example, $A = \\frac{1}{2}D^{2}$ gives $\\frac{dA}{dt} = D\\frac{dD}{dt}$, so a diagonal of $10$ cm growing at $3$ cm/s makes the area grow at $30$ cm²/s.\n\nCheck: through the side, $s = \\frac{10}{\\sqrt{2}}$ grows at $\\frac{3}{\\sqrt{2}}$, and $\\frac{dA}{dt} = 2s\\frac{ds}{dt} = 2 \\cdot \\frac{10}{\\sqrt{2}} \\cdot \\frac{3}{\\sqrt{2}} = 30$.\n\n> **Watch out.** The area is $\\frac{1}{2}D^{2}$, not $D^{2}$. The $2$ from the power rule cancels the $\\frac{1}{2}$.",
    "相关变化率问题中，把两个量直接联系起来最省事。正方形的边长等于对角线除以根号二，平方后根号消失，所以面积等于对角线平方的一半。对这个关系关于时间求导，就把两个变化率联系起来，完全不必算出边长。\n\n例如由 $A = \\frac{1}{2}D^{2}$ 得 $\\frac{dA}{dt} = D\\frac{dD}{dt}$，所以对角线为 $10$ cm、以 $3$ cm/s 增长时，面积以 $30$ cm²/s 增长。\n\n检验：通过边长计算，$s = \\frac{10}{\\sqrt{2}}$ 以 $\\frac{3}{\\sqrt{2}}$ 增长，$\\frac{dA}{dt} = 2s\\frac{ds}{dt} = 2 \\cdot \\frac{10}{\\sqrt{2}} \\cdot \\frac{3}{\\sqrt{2}} = 30$。\n\n> **注意。** 面积是 $\\frac{1}{2}D^{2}$，不是 $D^{2}$。幂法则带下的 $2$ 与 $\\frac{1}{2}$ 约掉。",
  ),
  generate(rng) {
    const d = rng.int(2, 20);
    const rate = rng.int(1, 9);
    const findArea = rng.pick([true, false]);
    if (findArea) {
      const answer = d * rate;
      return numberProblem({
        prompt: t(
          `The diagonal of a square grows at $${rate}$ cm/s. Find the rate of change of its area, in cm²/s, when the diagonal is $${d}$ cm.`,
          `正方形的对角线以 $${rate}$ cm/s 的速度增长。求对角线为 $${d}$ cm 时其面积的变化率，单位为 cm²/s。`,
        ),
        answer,
        mistakes: distinctWhys([
          why(
            2 * answer,
            "This uses $A = D^{2}$; the area of a square is half the square of its diagonal.",
            "这用的是 $A = D^{2}$；正方形的面积是对角线平方的一半。",
          ),
          why(
            Q.of(answer, 2),
            "This differentiates $\\frac{1}{2}D^{2}$ to $\\frac{1}{2}D$; the power rule gives $D$.",
            "这把 $\\frac{1}{2}D^{2}$ 的导数算成了 $\\frac{1}{2}D$；幂法则给出 $D$。",
          ),
          why(
            rate,
            `This leaves out the diagonal $D = ${d}$ from $\\frac{dA}{dt} = D\\frac{dD}{dt}$.`,
            `这漏掉了 $\\frac{dA}{dt} = D\\frac{dD}{dt}$ 中的对角线 $D = ${d}$。`,
          ),
        ]),
        solution: walk(
          [
            [
              "Link area and diagonal",
              "联系面积与对角线",
              "The side is $\\frac{D}{\\sqrt{2}}$, so $A = \\frac{1}{2}D^{2}$.",
              "边长是 $\\frac{D}{\\sqrt{2}}$，所以 $A = \\frac{1}{2}D^{2}$。",
            ],
            [
              "Differentiate and substitute",
              "求导并代入",
              `$\\frac{dA}{dt} = D\\frac{dD}{dt} = ${d} \\cdot ${rate} = ${answer}$.`,
              `$\\frac{dA}{dt} = D\\frac{dD}{dt} = ${d} \\cdot ${rate} = ${answer}$。`,
            ],
          ],
          [
            `Through the side: $s = \\frac{${d}}{\\sqrt{2}}$ grows at $\\frac{${rate}}{\\sqrt{2}}$, and $\\frac{dA}{dt} = 2s\\frac{ds}{dt} = 2 \\cdot \\frac{${d}}{\\sqrt{2}} \\cdot \\frac{${rate}}{\\sqrt{2}} = ${answer}$.`,
            `通过边长计算：$s = \\frac{${d}}{\\sqrt{2}}$ 以 $\\frac{${rate}}{\\sqrt{2}}$ 增长，$\\frac{dA}{dt} = 2s\\frac{ds}{dt} = 2 \\cdot \\frac{${d}}{\\sqrt{2}} \\cdot \\frac{${rate}}{\\sqrt{2}} = ${answer}$。`,
          ],
        ),
      });
    }
    const answer = Q.of(rate, d);
    return numberProblem({
      prompt: t(
        `The area of a square grows at $${rate}$ cm²/s. How fast is its diagonal growing, in cm/s, when the diagonal is $${d}$ cm?`,
        `正方形的面积以 $${rate}$ cm²/s 的速度增长。对角线为 $${d}$ cm 时，它增长的速度是多少 cm/s？`,
      ),
      answer,
      mistakes: distinctWhys([
        why(
          Q.of(rate, 2 * d),
          "This uses $A = D^{2}$; the area of a square is half the square of its diagonal.",
          "这用的是 $A = D^{2}$；正方形的面积是对角线平方的一半。",
        ),
        why(
          Q.of(2 * rate, d),
          "This differentiates $\\frac{1}{2}D^{2}$ to $\\frac{1}{2}D$; the power rule gives $D$.",
          "这把 $\\frac{1}{2}D^{2}$ 的导数算成了 $\\frac{1}{2}D$；幂法则给出 $D$。",
        ),
        why(Q.of(rate * d), `This multiplies by $D = ${d}$ instead of dividing by it.`, `这是乘以 $D = ${d}$，而应该除以它。`),
        why(
          Q.of(rate, d * d),
          `This divides by $D^{2} = ${d * d}$; the derivative of $\\frac{1}{2}D^{2}$ leaves $D$.`,
          `这是除以 $D^{2} = ${d * d}$；$\\frac{1}{2}D^{2}$ 的导数只剩 $D$。`,
        ),
      ]),
      solution: walk(
        [
          [
            "Link area and diagonal",
            "联系面积与对角线",
            "The side is $\\frac{D}{\\sqrt{2}}$, so $A = \\frac{1}{2}D^{2}$.",
            "边长是 $\\frac{D}{\\sqrt{2}}$，所以 $A = \\frac{1}{2}D^{2}$。",
          ],
          [
            "Differentiate and solve",
            "求导并求解",
            `$\\frac{dA}{dt} = D\\frac{dD}{dt}$, so $${rate} = ${d}\\frac{dD}{dt}$ and $\\frac{dD}{dt} = ${answer.toLatex()}$.`,
            `$\\frac{dA}{dt} = D\\frac{dD}{dt}$，所以 $${rate} = ${d}\\frac{dD}{dt}$，得 $\\frac{dD}{dt} = ${answer.toLatex()}$。`,
          ],
        ],
        [
          `Through the side: $s = \\frac{${d}}{\\sqrt{2}}$ and $${rate} = 2s\\frac{ds}{dt}$ give $\\frac{ds}{dt} = \\frac{${rate}}{${d}\\sqrt{2}}$; the diagonal is $\\sqrt{2}$ times the side, so it grows at $\\frac{${rate}}{${d}} = ${answer.toLatex()}$.`,
          `通过边长计算：由 $s = \\frac{${d}}{\\sqrt{2}}$ 和 $${rate} = 2s\\frac{ds}{dt}$ 得 $\\frac{ds}{dt} = \\frac{${rate}}{${d}\\sqrt{2}}$；对角线是边长的 $\\sqrt{2}$ 倍，所以它以 $\\frac{${rate}}{${d}} = ${answer.toLatex()}$ 增长。`,
        ],
      ),
    });
  },
};

const triangleWithGrowingAngle: KnowledgePointDef = {
  id: "the-area-of-a-triangle-with-a-growing-angle",
  figure: calculusDrawings2["calculating-related-rates-using-trigonometry#the-area-of-a-triangle-with-a-growing-angle"],
  title: t("The area of a triangle with a growing angle", "夹角增大时三角形的面积"),
  explanation: t(
    "With two sides fixed, the area of a triangle depends only on the angle between them, through one half the product of the sides times the sine of the angle. Differentiating brings in the cosine and the angle's rate. Past a right angle the cosine is negative, so the area shrinks even though the angle keeps growing.\n\nFor example, with sides $4$ and $6$, $A = 12\\sin\\theta$ and $\\frac{dA}{dt} = 12\\cos\\theta\\frac{d\\theta}{dt}$. At $\\theta = \\frac{\\pi}{3}$ with $\\frac{d\\theta}{dt} = 0.1$: $\\frac{dA}{dt} = 12 \\cdot \\frac{1}{2} \\cdot 0.1 = 0.6$.\n\nCheck: $\\frac{12\\sin\\left(\\frac{\\pi}{3} + 0.001\\right) - 12\\sin\\left(\\frac{\\pi}{3} - 0.001\\right)}{0.02} \\approx 0.6$, the change in area over $0.01$ s each side.\n\n> **Watch out.** The derivative of $\\sin\\theta$ is $\\cos\\theta$, which is negative for an obtuse angle, so the area then shrinks. Keep the $\\frac{1}{2}$ of the area formula.",
    "两边固定时，三角形的面积只取决于它们的夹角：面积等于两边之积的一半乘以夹角的正弦。求导时出现余弦和夹角的变化率。夹角超过直角后余弦为负，所以尽管夹角继续增大，面积却在减小。\n\n例如两边为 $4$ 和 $6$ 时，$A = 12\\sin\\theta$，$\\frac{dA}{dt} = 12\\cos\\theta\\frac{d\\theta}{dt}$。在 $\\theta = \\frac{\\pi}{3}$，$\\frac{d\\theta}{dt} = 0.1$ 时：$\\frac{dA}{dt} = 12 \\cdot \\frac{1}{2} \\cdot 0.1 = 0.6$。\n\n检验：$\\frac{12\\sin\\left(\\frac{\\pi}{3} + 0.001\\right) - 12\\sin\\left(\\frac{\\pi}{3} - 0.001\\right)}{0.02} \\approx 0.6$，即前后各 $0.01$ s 内面积的变化。\n\n> **注意。** $\\sin\\theta$ 的导数是 $\\cos\\theta$，钝角时它为负，所以面积在减小。不要漏掉面积公式中的 $\\frac{1}{2}$。",
  ),
  generate(rng) {
    const p = rng.int(2, 12);
    const q = rng.int(2, 12);
    const n = rng.int(2, 10);
    const acute = rng.pick([true, false]);
    const s = acute ? 1 : -1;
    const angle = acute ? "\\frac{\\pi}{3}" : "\\frac{2\\pi}{3}";
    const cosine = acute ? "\\frac{1}{2}" : "-\\frac{1}{2}";
    const omega = Q.of(1, n);
    const answer = Q.of(s * p * q, 4 * n);
    const theta = acute ? Math.PI / 3 : (2 * Math.PI) / 3;
    const turn = 0.01 / n;
    const area = (x: number) => 0.5 * p * q * Math.sin(x);
    const central = (area(theta + turn) - area(theta - turn)) / 0.02;
    return numberProblem({
      prompt: t(
        `Two sides of a triangle stay fixed at $${p}$ cm and $${q}$ cm, while the angle between them grows at $${omega.toLatex()}$ radians per second. Find the rate of change of the area, in cm²/s, when the angle is $${angle}$. Give a negative value if the area is shrinking.`,
        `三角形的两边固定为 $${p}$ cm 和 $${q}$ cm，它们的夹角以每秒 $${omega.toLatex()}$ 弧度的速度增大。求夹角为 $${angle}$ 时面积的变化率，单位为 cm²/s。若面积在减小，请给出负值。`,
      ),
      answer,
      mistakes: distinctWhys([
        why(Q.of(-s * p * q, 4 * n), `The sign is wrong: $\\cos${angle} = ${cosine}$.`, `符号错了：$\\cos${angle} = ${cosine}$。`),
        why(Q.of(s * p * q, 2 * n), "This leaves out the $\\frac{1}{2}$ of the area formula.", "这漏掉了面积公式中的 $\\frac{1}{2}$。"),
        why(
          Q.of(s * p * q, 4),
          `This leaves out the rate of the angle, $\\frac{d\\theta}{dt} = ${omega.toLatex()}$.`,
          `这漏掉了夹角的变化率 $\\frac{d\\theta}{dt} = ${omega.toLatex()}$。`,
        ),
      ]),
      solution: walk(
        [
          [
            "Differentiate the area",
            "对面积求导",
            `$A = \\frac{1}{2}(${p})(${q})\\sin\\theta$, so $\\frac{dA}{dt} = \\frac{1}{2}(${p})(${q})\\cos\\theta\\,\\frac{d\\theta}{dt}$.`,
            `$A = \\frac{1}{2}(${p})(${q})\\sin\\theta$，所以 $\\frac{dA}{dt} = \\frac{1}{2}(${p})(${q})\\cos\\theta\\,\\frac{d\\theta}{dt}$。`,
          ],
          [
            "Substitute",
            "代入",
            `At $\\theta = ${angle}$, $\\cos\\theta = ${cosine}$, so $\\frac{dA}{dt} = ${Q.of(p * q, 2).toLatex()} \\cdot \\left(${cosine}\\right) \\cdot ${omega.toLatex()} = ${answer.toLatex()}$.`,
            `在 $\\theta = ${angle}$ 时 $\\cos\\theta = ${cosine}$，所以 $\\frac{dA}{dt} = ${Q.of(p * q, 2).toLatex()} \\cdot \\left(${cosine}\\right) \\cdot ${omega.toLatex()} = ${answer.toLatex()}$。`,
          ],
        ],
        [
          `In $0.01$ s before and after, the angle moves $${num(turn)}$ radians each way, and the area goes from about $${num(area(theta - turn))}$ to $${num(area(theta + turn))}$ cm². The change divided by $0.02$ is about $${num(central)}$, close to $${answer.toLatex()}${approx(answer)}$.`,
          `前后各 $0.01$ s 内夹角各变化 $${num(turn)}$ 弧度，面积约从 $${num(area(theta - turn))}$ 变为 $${num(area(theta + turn))}$ cm²。变化量除以 $0.02$ 约为 $${num(central)}$，接近 $${answer.toLatex()}${approx(answer)}$。`,
        ],
      ),
    });
  },
};

const cornerAsCandidate: KnowledgePointDef = {
  id: "a-corner-as-a-candidate-for-the-minimum",
  title: t("A corner as a candidate for the minimum", "尖角点作为最小值的候选点"),
  explanation: t(
    "The candidates for a global extreme are not only the points where the derivative is zero and the endpoints: a point where the derivative fails to exist counts too. An absolute value creates such a corner. Treat each side of the corner as its own function, keep only stationary points that lie on their own side, and compare. For $f(x) = x^2 + 4|x - 1|$ on $[-3, 3]$: left of $1$, $f'(x) = 2x - 4 < 0$; right of $1$, $f'(x) = 2x + 4 > 0$. The candidates are $f(-3) = 25$, $f(1) = 1$ and $f(3) = 17$, so the minimum is $1$, at the corner.\n\nCheck: $f(0.5) = 2.25$ and $f(1.5) = 4.25$ are both above $f(1) = 1$.\n\n> **Watch out.** Solving $2x - 4 = 0$ gives $x = 2$, but that formula holds only left of $1$, and $2$ lies on the right. Discard such a point.",
    "全局最值的候选点不只是导数为零的点和端点：导数不存在的点同样算数。绝对值会造成这样的尖角。把尖角两侧分别看作各自的函数，只保留落在自己一侧的驻点，然后比较。对 $[-3, 3]$ 上的 $f(x) = x^2 + 4|x - 1|$：在 $1$ 左侧 $f'(x) = 2x - 4 < 0$；在 $1$ 右侧 $f'(x) = 2x + 4 > 0$。候选值是 $f(-3) = 25$，$f(1) = 1$，$f(3) = 17$，所以最小值是尖角处的 $1$。\n\n检验：$f(0.5) = 2.25$，$f(1.5) = 4.25$，都大于 $f(1) = 1$。\n\n> **注意。** 解 $2x - 4 = 0$ 得 $x = 2$，但这个式子只在 $1$ 左侧成立，而 $2$ 在右侧。这样的点要舍去。",
  ),
  generate(rng) {
    const m = rng.int(2, 6);
    const c = rng.pick([-8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8]);
    const l = Math.min(c, -m) - rng.int(1, 3);
    const r = Math.max(c, m) + rng.int(1, 3);
    const f = (x: number) => x * x + 2 * m * Math.abs(x - c);
    const name = `x^2 + ${2 * m}|${poly([1, "x"], [-c, ""])}|`;
    const cornerWins = Math.abs(c) <= m;
    const at = cornerWins ? c : c > 0 ? m : -m;
    const answer = f(at);
    const candidates = [...new Set([l, c, ...(m < c ? [m] : []), ...(-m > c ? [-m] : []), r])].sort((x, y) => x - y);
    const keep = (side: "left" | "right"): readonly [string, string] => {
      const root = side === "left" ? m : -m;
      const ok = side === "left" ? root < c : root > c;
      return ok
        ? [`$x = ${root}$, which lies on that side, so it is a candidate`, `$x = ${root}$，它在这一侧，所以是候选点`]
        : [`$x = ${root}$, which is not on that side, so it is discarded`, `$x = ${root}$，它不在这一侧，所以舍去`];
    };
    const [leftEn, leftZh] = keep("left");
    const [rightEn, rightZh] = keep("right");
    let grid = f(l);
    for (let i = 1; i <= 4 * (r - l); i++) grid = Math.min(grid, f(l + i / 4));
    return numberProblem({
      prompt: t(
        `Find the global minimum value of $f(x) = ${name}$ on $[${l}, ${r}]$.`,
        `求 $f(x) = ${name}$ 在 $[${l}, ${r}]$ 上的全局最小值。`,
      ),
      answer,
      form: "integer",
      wrong: [c * c, f(m), f(-m), f(l), f(r)],
      solution: walk(
        [
          [
            "Split at the corner",
            "在尖角处分段",
            `Left of $x = ${c}$, $f(x) = x^2 - ${2 * m}(${poly([1, "x"], [-c, ""])})$ and $f'(x) = 2x - ${2 * m}$. Right of it, $f'(x) = 2x + ${2 * m}$. At $x = ${c}$ itself the one-sided slopes differ, so $f'(${c})$ does not exist and $x = ${c}$ is a candidate.`,
            `在 $x = ${c}$ 左侧，$f(x) = x^2 - ${2 * m}(${poly([1, "x"], [-c, ""])})$，$f'(x) = 2x - ${2 * m}$。在右侧，$f'(x) = 2x + ${2 * m}$。在 $x = ${c}$ 处两侧斜率不同，所以 $f'(${c})$ 不存在，$x = ${c}$ 是候选点。`,
          ],
          [
            "Find the stationary points on each side",
            "求两侧的驻点",
            `On the left, $2x - ${2 * m} = 0$ gives ${leftEn}. On the right, $2x + ${2 * m} = 0$ gives ${rightEn}.`,
            `在左侧，$2x - ${2 * m} = 0$ 给出 ${leftZh}。在右侧，$2x + ${2 * m} = 0$ 给出 ${rightZh}。`,
          ],
          [
            "Compare the candidates",
            "比较候选点",
            `With the endpoints:\n\n${table(["$x$", ...candidates.map((x) => `$${x}$`)], ["$f(x)$", ...candidates.map((x) => `$${f(x)}$`)])}\n\nThe smallest value is $f(${at}) = ${answer}$.`,
            `加上端点：\n\n${table(["$x$", ...candidates.map((x) => `$${x}$`)], ["$f(x)$", ...candidates.map((x) => `$${f(x)}$`)])}\n\n最小值是 $f(${at}) = ${answer}$。`,
          ],
        ],
        [
          `Evaluating $f$ at every point of $[${l}, ${r}]$ with step $0.25$ gives a smallest value of $${num(grid)}$, the same as $${answer}$.`,
          `在 $[${l}, ${r}]$ 上以步长 $0.25$ 逐点计算 $f$，得到的最小值是 $${num(grid)}$，与 $${answer}$ 相同。`,
        ],
      ),
    });
  },
};

const criticalPointWhereDerivativeFails: KnowledgePointDef = {
  id: "a-critical-point-where-the-derivative-does-not-exist",
  title: t("A critical point where the derivative does not exist", "导数不存在的临界点"),
  explanation: t(
    "A critical point is a point of the domain where the derivative is zero or does not exist, and the second kind is easily missed. For a fractional power, put the derivative over a common denominator. Its numerator gives the zeros, while its denominator vanishes at the origin, where the function is defined but the derivative is not. For $f(x) = x^{\\frac{1}{3}}(x - 4)$,\n\n$$f'(x) = \\frac{1}{3}x^{-\\frac{2}{3}}(x - 4) + x^{\\frac{1}{3}} = \\frac{4x - 4}{3x^{\\frac{2}{3}}},$$\n\nso the critical points are $x = 1$, where the numerator is $0$, and $x = 0$, where the denominator is.\n\nCheck: at $0$ the difference quotient is $h^{-\\frac{2}{3}}(h - 4)$, about $-399.9$ for $h = 0.001$. It grows without bound as $h$ shrinks, so $f'(0)$ does not exist.\n\n> **Watch out.** $x = 0$ counts because $f(0) = 0$ is defined. A point where $f$ itself is undefined is never a critical point.",
    "临界点是定义域内导数为零或导数不存在的点，第二类很容易被漏掉。对分数次幂，把导数通分。分子给出导数的零点，而分母在原点处为零，那里函数有定义，导数却不存在。对 $f(x) = x^{\\frac{1}{3}}(x - 4)$，\n\n$$f'(x) = \\frac{1}{3}x^{-\\frac{2}{3}}(x - 4) + x^{\\frac{1}{3}} = \\frac{4x - 4}{3x^{\\frac{2}{3}}},$$\n\n所以临界点是分子为 $0$ 的 $x = 1$，以及分母为 $0$ 的 $x = 0$。\n\n检验：在 $0$ 处差商为 $h^{-\\frac{2}{3}}(h - 4)$，$h = 0.001$ 时约为 $-399.9$。$h$ 越小它越大，没有界，所以 $f'(0)$ 不存在。\n\n> **注意。** $x = 0$ 之所以算，是因为 $f(0) = 0$ 有定义。$f$ 本身无定义的点永远不是临界点。",
  ),
  generate(rng) {
    const a = nonzero(rng, 12);
    const p = rng.pick([1, 2]);
    const answer = Q.of(p * a, p + 3);
    const power = `x^{\\frac{${p}}{3}}`;
    const factor = poly([1, "x"], [-a, ""]);
    const top = poly([p + 3, "x"], [-p * a, ""]);
    const below = p === 1 ? "3x^{\\frac{2}{3}}" : "3x^{\\frac{1}{3}}";
    const lower = p === 1 ? "-\\frac{2}{3}" : "-\\frac{1}{3}";
    const derivative = (x: number) => ((p + 3) * x - p * a) / (3 * Math.cbrt(x) ** (3 - p));
    const x0 = answer.toNumber();
    const xs = [x0 - 0.1, x0 + 0.1].map((x) => Math.round(x * 1000) / 1000);
    return numberProblem({
      prompt: t(
        `The function $f(x) = ${power}(${factor})$ has two critical points. Find the nonzero one.`,
        `函数 $f(x) = ${power}(${factor})$ 有两个临界点。求不为零的那一个。`,
      ),
      answer,
      wrong: [Q.of(a), Q.of(p * a, 3), Q.of(a, p + 3), Q.of(-p * a, p + 3)],
      solution: walk(
        [
          [
            "Differentiate",
            "求导",
            `By the product rule,\n\n$$f'(x) = \\frac{${p}}{3}x^{${lower}}(${factor}) + ${power} = \\frac{${top}}{${below}}$$`,
            `由乘积法则，\n\n$$f'(x) = \\frac{${p}}{3}x^{${lower}}(${factor}) + ${power} = \\frac{${top}}{${below}}$$`,
          ],
          [
            "Read off both kinds of critical point",
            "读出两类临界点",
            `The numerator is zero at $x = ${answer.toLatex()}$. The denominator is zero at $x = 0$, where $f$ is defined but $f'$ is not, so $0$ is the other critical point. The nonzero one is $${answer.toLatex()}$.`,
            `分子在 $x = ${answer.toLatex()}$ 处为零。分母在 $x = 0$ 处为零，那里 $f$ 有定义而 $f'$ 没有，所以 $0$ 是另一个临界点。不为零的那个是 $${answer.toLatex()}$。`,
          ],
        ],
        [
          `$f'$ on each side of $${answer.toLatex()}$:\n\n${valueTable(xs, [["f'(x)", derivative]])}\n\nThe sign changes, so $f'$ passes through $0$ there.`,
          `$f'$ 在 $${answer.toLatex()}$ 两侧的值：\n\n${valueTable(xs, [["f'(x)", derivative]])}\n\n符号改变，所以 $f'$ 在那里经过 $0$。`,
        ],
      ),
    });
  },
};

const increasingEverywhere: KnowledgePointDef = {
  id: "the-least-coefficient-that-makes-a-cubic-increasing",
  figure:
    calculusDrawings2[
      "determining-intervals-on-which-a-function-is-increasing-or-decreasing#the-least-coefficient-that-makes-a-cubic-increasing"
    ],
  title: t("The least coefficient that makes a cubic increasing", "使三次函数递增的最小系数"),
  explanation: t(
    "A cubic with positive leading coefficient rises on the whole real line exactly when its derivative is never negative. That derivative is an upward parabola, so the condition is that its discriminant is not positive. A single point where the derivative touches zero is allowed, because the function still increases through it, so the boundary value counts. For $x^3 + 3x^2 + kx$, $f'(x) = 3x^2 + 6x + k$ has discriminant $36 - 12k$, which is not positive when $k \\ge 3$.\n\nCheck: at $k = 3$, $f'(x) = 3(x + 1)^2$, which is never negative and is $0$ only at $x = -1$; at $k = 2$, $f'(-1) = -1 < 0$.\n\n> **Watch out.** The least value is $k = 3$ itself, not \"just above $3$\": a derivative that touches $0$ at one point does not stop the function increasing.",
    "首项系数为正的三次函数在整个实数轴上递增，当且仅当它的导数从不为负。这个导数是开口向上的抛物线，所以条件是判别式不为正。导数在单独一点碰到零是允许的，因为函数经过那里时仍然递增，所以边界值也算。对 $x^3 + 3x^2 + kx$，$f'(x) = 3x^2 + 6x + k$ 的判别式为 $36 - 12k$，当 $k \\ge 3$ 时它不为正。\n\n检验：$k = 3$ 时 $f'(x) = 3(x + 1)^2$，从不为负，只在 $x = -1$ 处为 $0$；$k = 2$ 时 $f'(-1) = -1 < 0$。\n\n> **注意。** 最小值就是 $k = 3$ 本身，而不是“比 $3$ 稍大”：导数只在一点碰到 $0$ 并不妨碍函数递增。",
  ),
  generate(rng) {
    const a = rng.int(1, 4);
    const b = nonzero(rng, 9);
    const d = nonzero(rng, 9);
    const answer = Q.of(b * b, 3 * a);
    const f = poly([a, "x^3"], [b, "x^2"], [1, "kx"], [d, ""]);
    const derivative = poly([3 * a, "x^2"], [2 * b, "x"], [1, "k"]);
    const vertex = Q.of(-b, 3 * a);
    const shift = vertex.neg();
    const square = `${3 * a}\\left(x ${shift.sign() < 0 ? "-" : "+"} ${shift.sign() < 0 ? shift.neg().toLatex() : shift.toLatex()}\\right)^{2}`;
    const below = answer.sub(Q.of(1));
    return numberProblem({
      prompt: t(
        `Find the least value of $k$ for which $f(x) = ${f}$ is increasing on the whole real line.`,
        `求使 $f(x) = ${f}$ 在整个实数轴上递增的 $k$ 的最小值。`,
      ),
      answer,
      wrong: [Q.of(b * b, a), Q.of(b * b, 6 * a), Q.of(-b * b, 3 * a), Q.of(Math.abs(b), 3 * a)],
      solution: walk(
        [
          [
            "Differentiate",
            "求导",
            `$f'(x) = ${derivative}$, an upward parabola, which must never be negative.`,
            `$f'(x) = ${derivative}$ 是开口向上的抛物线，它必须从不为负。`,
          ],
          [
            "Use the discriminant",
            "用判别式",
            `That holds when the discriminant $${4 * b * b} - ${12 * a}k$ is not positive, that is when $k \\ge ${answer.toLatex()}$. So the least value is $${answer.toLatex()}$.`,
            `当判别式 $${4 * b * b} - ${12 * a}k$ 不为正时成立，即 $k \\ge ${answer.toLatex()}$。所以最小值是 $${answer.toLatex()}$。`,
          ],
        ],
        [
          `At $k = ${answer.toLatex()}$ the derivative is a perfect square:\n\n$$f'(x) = ${square}$$\n\nIt is never negative and is $0$ only at $x = ${vertex.toLatex()}$. With $k = ${below.toLatex()}$ instead, $f'(${vertex.toLatex()}) = -1 < 0$, so a smaller $k$ fails.`,
          `当 $k = ${answer.toLatex()}$ 时，导数是完全平方：\n\n$$f'(x) = ${square}$$\n\n它从不为负，只在 $x = ${vertex.toLatex()}$ 处为 $0$。若改取 $k = ${below.toLatex()}$，则 $f'(${vertex.toLatex()}) = -1 < 0$，所以更小的 $k$ 不行。`,
        ],
      ),
    });
  },
};

const cylinderInCone: KnowledgePointDef = {
  id: "the-largest-cylinder-in-a-cone",
  figure: calculusDrawings3["optimization-problems-with-inscribed-shapes#the-largest-cylinder-in-a-cone"],
  title: t("The largest cylinder in a cone", "圆锥内最大的圆柱"),
  explanation: t(
    "An inscribed cylinder has a radius and a height, but they are not independent: similar triangles in a vertical slice of the cone tie them together along a straight line. Writing the height in terms of the radius leaves a cubic volume function of one variable, and setting its derivative to zero locates the best radius.",
    "内接圆柱有半径和高，但二者并不独立：圆锥竖直截面中的相似三角形把它们联系在一条直线上。把高用半径表示后，体积就成为一个单变量的三次函数，令其导数为零即可确定最佳半径。",
  ),
  generate(rng) {
    const k = rng.int(1, 5);
    const j = rng.int(1, 8);
    const R = 3 * k;
    const H = 3 * j;
    const answer = 4 * k * k * j;
    return numberProblem({
      prompt: t(
        `A cylinder stands inside a cone of base radius $${R}$ and height $${H}$, with its base on the base of the cone. Its largest possible volume is $V\\pi$. Find $V$.`,
        `一个圆柱立在底面半径为 $${R}$、高为 $${H}$ 的圆锥内，底面落在圆锥的底面上。它的最大体积是 $V\\pi$。求 $V$。`,
      ),
      answer,
      form: "integer",
      wrong: [9 * k * k * j, 12 * k * k * j, 2 * k * k * j, 3 * k * k * j],
      solution: t(
        `Similar triangles give $h = ${H}\\left(1 - \\frac{r}{${R}}\\right)$, so $V(r) = \\pi r^{2} h$. Setting $V'(r) = 0$ gives $r = ${2 * k}$, two thirds of the cone's radius, and then $h = ${j}$. The volume is $\\pi (${2 * k})^{2}(${j}) = ${answer}\\pi$.`,
        `由相似三角形得 $h = ${H}\\left(1 - \\frac{r}{${R}}\\right)$，所以 $V(r) = \\pi r^{2} h$。令 $V'(r) = 0$ 得 $r = ${2 * k}$，即圆锥半径的三分之二，此时 $h = ${j}$。体积是 $\\pi (${2 * k})^{2}(${j}) = ${answer}\\pi$。`,
      ),
    });
  },
};

const canWithCostlyEnds: KnowledgePointDef = {
  id: "a-can-whose-ends-cost-more-than-its-side",
  title: t("A can whose ends cost more than its side", "两端比侧面更贵的罐子"),
  explanation: t(
    "When the materials differ in price, the quantity to minimize is the cost and not the surface area. Each area is weighted by its price before differentiating. The fixed volume still removes the height, leaving a function of the radius alone. Dearer ends push the best can to be taller and narrower than the can of least material.",
    "材料价格不同时，要最小化的是成本而不是表面积。求导之前，每部分面积都要乘以各自的单价。固定的体积仍然可以消去高，只留下半径的函数。两端越贵，最佳的罐子就比用料最少的罐子越高越细。",
  ),
  generate(rng) {
    const r = rng.int(1, 6);
    const [ends, side] = rng.pick([
      [2, 1],
      [3, 1],
      [3, 2],
      [4, 1],
      [5, 2],
      [5, 4],
      [4, 3],
    ] as const);
    const volume = Q.of(2 * ends * r ** 3, side);
    const answer = Q.of(2 * ends * r, side);
    const held = `${volume.toLatex()}\\pi`;
    const cost = `${2 * ends}\\pi r^{2} + \\frac{${volume.mul(Q.of(2 * side)).toLatex()}\\pi}{r}`;
    return numberProblem({
      prompt: t(
        `A closed cylindrical can must hold $${held}$ cm³. Its top and bottom cost $${ends}$ cents per cm², and its side costs $${side}$ ${side === 1 ? "cent" : "cents"} per cm². Find the height, in cm, of the cheapest can.`,
        `一个有盖的圆柱形罐子必须容纳 $${held}$ cm³。顶和底的成本是每 cm² $${ends}$ 分，侧面的成本是每 cm² $${side}$ 分。求最便宜的罐子的高，单位为 cm。`,
      ),
      answer,
      wrong: [Q.of(2 * r), Q.of(r), Q.of(2 * side * r, ends), Q.of(ends * r, side), Q.of(4 * ends * r, side)],
      solution: t(
        `Removing the height with the volume, the cost is $C(r) = ${cost}$ in cents. Setting $C'(r) = 0$ gives $r = ${r}$, and the volume then gives $h = ${answer.toLatex()}$.`,
        `用体积消去高，成本（单位：分）是 $C(r) = ${cost}$。令 $C'(r) = 0$ 得 $r = ${r}$，再由体积得 $h = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const cableAcrossRiver: KnowledgePointDef = {
  id: "the-cheapest-cable-across-a-river",
  title: t("The cheapest cable across a river", "过河电缆的最低成本路线"),
  explanation: t(
    "A cable that crosses water at a high price and then runs along the bank at a low price should not take the shortest path, nor should it cross straight over. Its cost is a root plus a linear term in the landing point. At the best landing point the two rates balance, and that point does not depend on how far the destination is.",
    "电缆在水下成本高、沿岸成本低时，既不该走最短路线，也不该笔直过河。总成本是着陆点的一个根式加一个一次项。在最佳着陆点，两种变化率相互平衡，而这个点与目的地有多远无关。",
  ),
  generate(rng) {
    const [water, land, across, along] = rng.pick([
      [5, 3, 4, 3],
      [5, 4, 3, 4],
      [13, 5, 12, 5],
      [13, 12, 5, 12],
      [17, 8, 15, 8],
      [17, 15, 8, 15],
    ] as const);
    const k = rng.int(1, 5);
    const width = across * k;
    const answer = along * k;
    const total = answer + rng.int(1, 20);
    return numberProblem({
      prompt: t(
        `A cable must run from a point on one bank of a straight river $${width}$ m wide to a point on the other bank, $${total}$ m downstream of the point directly opposite. Cable costs $${water}$ dollars per metre under water and $${land}$ dollars per metre along the far bank. How far downstream of the point directly opposite, in metres, should the cable land to cost the least?`,
        `一条电缆要从笔直河流一岸的某点铺到对岸一点，河宽 $${width}$ m，终点在正对岸点的下游 $${total}$ m 处。电缆水下每米 $${water}$ 美元，沿对岸每米 $${land}$ 美元。为使成本最低，电缆应在正对岸点下游多少米处上岸？`,
      ),
      answer,
      wrong: [Q.of(width), Q.of(total), Q.of(width * across, along), Q.of(width * land, water)],
      solution: t(
        `Landing $x$ m downstream costs $C(x) = ${water}\\sqrt{${width * width} + x^{2}} + ${land}(${total} - x)$. Setting $C'(x) = 0$ gives $${water}x = ${land}\\sqrt{${width * width} + x^{2}}$. Squaring and solving for positive $x$ gives $x = ${answer}$, which is within the $${total}$ m available.`,
        `在下游 $x$ m 处上岸的成本是 $C(x) = ${water}\\sqrt{${width * width} + x^{2}} + ${land}(${total} - x)$。令 $C'(x) = 0$ 得 $${water}x = ${land}\\sqrt{${width * width} + x^{2}}$。两边平方并取正解，得 $x = ${answer}$，它在 $${total}$ m 的范围之内。`,
      ),
    });
  },
};

const greatestSpeed: KnowledgePointDef = {
  id: "the-greatest-speed-over-a-time-interval",
  title: t("The greatest speed over a time interval", "一段时间内的最大速率"),
  explanation: t(
    "Speed is the absolute value of velocity, so its greatest value need not be where velocity is greatest. The candidates are the endpoints and the moment when acceleration is zero, where velocity reaches an extreme. A velocity that dips far below zero can produce the highest speed of all, so compare absolute values and not signed ones.",
    "速率是速度的绝对值，所以它的最大值不一定出现在速度最大的时刻。候选点是两个端点，以及加速度为零的时刻，那时速度达到极值。速度如果向下深入零以下，可能产生全程最高的速率，所以要比较绝对值，而不是带符号的值。",
  ),
  generate(rng) {
    const t0 = rng.int(1, 4);
    const end = t0 + rng.int(1, 4);
    const q = rng.int(1, 20);
    const r = rng.int(1, 9);
    const v = (x: number) => 3 * x * x - 6 * t0 * x + q;
    const answer = Math.max(Math.abs(v(0)), Math.abs(v(t0)), Math.abs(v(end)));
    const s = poly([1, "t^3"], [-3 * t0, "t^2"], [q, "t"], [r, ""]);
    return numberProblem({
      prompt: t(
        `A particle moves along a line with position $s(t) = ${s}$ metres after $t$ seconds. Find its greatest speed, in m/s, for $0 \\le t \\le ${end}$.`,
        `一个质点沿直线运动，$t$ 秒后的位置是 $s(t) = ${s}$ 米。求 $0 \\le t \\le ${end}$ 时它的最大速率，单位为 m/s。`,
      ),
      answer,
      form: "integer",
      wrong: [v(0), v(t0), v(end), q + 3 * t0 * t0, 6 * (end - t0), answer + 6 * t0, 2 * answer, 3 * answer],
      solution: t(
        `$v(t) = ${poly([3, "t^2"], [-6 * t0, "t"], [q, ""])}$, and $v'(t) = 0$ at $t = ${t0}$. Then $v(0) = ${v(0)}$, $v(${t0}) = ${v(t0)}$ and $v(${end}) = ${v(end)}$. The greatest absolute value is $${answer}$.`,
        `$v(t) = ${poly([3, "t^2"], [-6 * t0, "t"], [q, ""])}$，且 $v'(t) = 0$ 在 $t = ${t0}$ 处。于是 $v(0) = ${v(0)}$，$v(${t0}) = ${v(t0)}$，$v(${end}) = ${v(end)}$。绝对值最大的是 $${answer}$。`,
      ),
    });
  },
};

const overlappingIntervals: KnowledgePointDef = {
  id: "integrals-on-overlapping-intervals",
  figure: calculusDrawings3["properties-of-definite-integrals-involving-the-limits-of-integration#integrals-on-overlapping-intervals"],
  title: t("Integrals on overlapping intervals", "重叠区间上的积分"),
  explanation: t(
    "Additivity lets integrals on adjacent intervals be added. When two given intervals overlap, adding them counts the shared part twice. So the integral over the whole span is the sum of the two integrals minus the integral over the overlap. A number line sketch with the four endpoints in order makes the bookkeeping clear.",
    "积分的可加性允许把相邻区间上的积分相加。当两个已知区间有重叠时，直接相加会把公共部分算两次。所以整个范围上的积分等于两个积分之和减去重叠部分上的积分。在数轴上按顺序标出四个端点，就能把这笔账算清楚。",
  ),
  generate(rng) {
    const a = rng.int(-6, 0);
    const b = a + rng.int(1, 3);
    const c = b + rng.int(1, 3);
    const d = c + rng.int(1, 3);
    const p = nonzero(rng, 12);
    const q = nonzero(rng, 12);
    const r = nonzero(rng, 12);
    const answer = p + q - r;
    const int = (lo: number, hi: number) => `\\int_{${lo}}^{${hi}} f(x) \\, dx`;
    const given = `${int(a, c)} = ${p}$, $${int(b, d)} = ${q}$ and $${int(b, c)} = ${r}`;
    const givenZh = `${int(a, c)} = ${p}$，$${int(b, d)} = ${q}$，$${int(b, c)} = ${r}`;
    return numberProblem({
      prompt: t(`Given $${given}$, find $${int(a, d)}$.`, `已知 $${givenZh}$，求 $${int(a, d)}$。`),
      answer,
      form: "integer",
      wrong: [p + q, p + q + r, p - r, q - r, p + q - 2 * r],
      solution: t(
        `The intervals $[${a}, ${c}]$ and $[${b}, ${d}]$ together cover $[${a}, ${d}]$, and both contain $[${b}, ${c}]$. So the value is $${poly([p, ""], [q, ""], [-r, ""])} = ${answer}$.`,
        `区间 $[${a}, ${c}]$ 和 $[${b}, ${d}]$ 合起来覆盖 $[${a}, ${d}]$，而且都包含 $[${b}, ${c}]$。所以值是 $${poly([p, ""], [q, ""], [-r, ""])} = ${answer}$。`,
      ),
    });
  },
};

const absoluteValueOfQuadratic: KnowledgePointDef = {
  id: "the-integral-of-the-absolute-value-of-a-quadratic",
  title: t("The integral of the absolute value of a quadratic", "二次函数绝对值的积分"),
  explanation: t(
    "An absolute value is a piecewise function in disguise, with its breaks where the inside changes sign. For a quadratic those are its roots. Split the interval at any root inside it, flip the sign on the part where the quadratic is negative, and integrate each piece separately. Integrating without splitting would let the negative part cancel some of the area.",
    "绝对值其实是分段函数，分段点就在内部变号的地方。对二次函数来说，这些点就是它的根。在区间内的根处把区间分开，在二次函数为负的部分改变符号，再分别积分。不分段直接积分，负的部分就会抵消一部分面积。",
  ),
  generate(rng) {
    const a = rng.int(1, 6);
    const b = a + rng.int(1, 5);
    const c = rng.int(1, 3);
    const first = Q.of(2 * a ** 3, 3);
    const second = Q.of(b ** 3 - a ** 3, 3).sub(Q.of(a * a * (b - a)));
    const answer = first.add(second).mul(Q.of(c));
    const f = poly([c, `\\left|${poly([1, "x^2"], [-a * a, ""])}\\right|`]);
    const scale = c === 1 ? "" : ` Multiplying by $${c}$ gives $${answer.toLatex()}$.`;
    const scaleZh = c === 1 ? "" : `乘以 $${c}$ 得 $${answer.toLatex()}$。`;
    const sum = first.add(second).toLatex();
    return numberProblem({
      prompt: t(`Evaluate $\\int_{0}^{${b}} ${f} \\, dx$.`, `计算 $\\int_{0}^{${b}} ${f} \\, dx$。`),
      answer,
      wrong: [
        Q.of(b ** 3, 3)
          .sub(Q.of(a * a * b))
          .mul(Q.of(c)),
        second.mul(Q.of(c)),
        first.mul(Q.of(c)),
        first.sub(second).mul(Q.of(c)),
      ],
      solution: t(
        `$x^2 - ${a * a}$ is negative on $[0, ${a}]$ and positive on $[${a}, ${b}]$. So $\\int_{0}^{${b}} |x^2 - ${a * a}| \\, dx = \\int_{0}^{${a}} (${a * a} - x^2) \\, dx + \\int_{${a}}^{${b}} (x^2 - ${a * a}) \\, dx = ${first.toLatex()} + ${second.toLatex()} = ${sum}$.${scale}`,
        `$x^2 - ${a * a}$ 在 $[0, ${a}]$ 上为负，在 $[${a}, ${b}]$ 上为正。所以 $\\int_{0}^{${b}} |x^2 - ${a * a}| \\, dx = \\int_{0}^{${a}} (${a * a} - x^2) \\, dx + \\int_{${a}}^{${b}} (x^2 - ${a * a}) \\, dx = ${first.toLatex()} + ${second.toLatex()} = ${sum}$。${scaleZh}`,
      ),
    });
  },
};

const dropBetweenExtremes: KnowledgePointDef = {
  id: "the-drop-between-extremes-of-an-accumulation-function",
  title: t("The drop between extremes of an accumulation function", "累积函数两个极值之间的落差"),
  explanation: t(
    "An accumulation function has its integrand as its derivative, so its local extrema lie at the integrand's sign changes. The change between two such points is simply the integral of the integrand between them. The lower limit of the accumulation function shifts every value by the same amount and therefore plays no part in that difference.",
    "累积函数的导数就是被积函数，所以它的局部极值出现在被积函数变号的地方。这两点之间的变化量，就是被积函数在两点之间的积分。累积函数的积分下限使所有函数值平移相同的量，因此对这个差没有影响。",
  ),
  generate(rng) {
    const p = rng.int(-6, 5);
    const q = p + rng.int(1, 6);
    const c = rng.int(1, 3);
    const k = rng.int(-3, 3);
    const gap = q - p;
    const answer = Q.of(c * gap ** 3, 6);
    const integrand = poly([c, "t^2"], [-c * (p + q), "t"], [c * p * q, ""]);
    return numberProblem({
      prompt: t(
        `Let $g(x) = \\int_{${k}}^{x} (${integrand}) \\, dt$. Find the local maximum value of $g$ minus its local minimum value.`,
        `设 $g(x) = \\int_{${k}}^{x} (${integrand}) \\, dt$。求 $g$ 的极大值减去极小值的差。`,
      ),
      answer,
      wrong: [answer.neg(), Q.of(c * gap ** 3, 3), Q.of(c * gap * gap, 2), Q.of(gap ** 3, 6), Q.of(c * gap ** 3)],
      solution: t(
        `$g'(x)$ is the integrand, which is positive, then negative, then positive, with zeros at $x = ${p}$ and $x = ${q}$. So $g(${p})$ is the local maximum and $g(${q})$ the local minimum. Their difference is minus the integral of the integrand from $${p}$ to $${q}$, which is $${answer.toLatex()}$.`,
        `$g'(x)$ 就是被积函数，它先正、后负、再正，零点是 $x = ${p}$ 和 $x = ${q}$。所以 $g(${p})$ 是极大值，$g(${q})$ 是极小值。二者之差等于被积函数从 $${p}$ 到 $${q}$ 的积分的相反数，即 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const limitOfSumValue: KnowledgePointDef = {
  id: "the-value-of-a-limit-of-a-sum",
  title: t("The value of a limit of a sum", "和式极限的值"),
  explanation: t(
    "A limit of right Riemann sums can be computed without any summation formula, by recognizing the integral it defines. The factor multiplying the bracket is the width of a subinterval, whose numerator gives the length of the interval. The constant in the bracket is its left endpoint, and the bracket itself is the variable of integration.",
    "右黎曼和的极限不用求和公式也能算出，只要认出它定义的积分。括号外的因子是子区间的宽度，其分子给出区间的长度。括号里的常数是区间的左端点，整个括号就是积分变量。",
  ),
  generate(rng) {
    const a = rng.int(1, 5);
    const b = rng.int(1, 6);
    const k = rng.pick([2, 3]);
    const top = a + b;
    const value = Q.of(top ** (k + 1) - a ** (k + 1), k + 1);
    const step = b === 1 ? "\\frac{i}{n}" : `\\frac{${b}i}{n}`;
    const sum = `\\lim_{n \\to \\infty} \\sum_{i = 1}^{n} \\left(${a} + ${step}\\right)^{${k}} \\cdot \\frac{${b}}{n}`;
    const integral = `\\int_{${a}}^{${top}} x^{${k}} \\, dx`;
    return numberProblem({
      prompt: t(`Find $${sum}$.`, `求 $${sum}$。`),
      answer: value,
      wrong: [Q.of(b ** (k + 1), k + 1), value.div(Q.of(b)), Q.of(top ** (k + 1) - a ** (k + 1)), Q.of(top ** k - a ** k, k)],
      solution: t(
        `The sum is a right Riemann sum for $x^{${k}}$ on an interval of length $${b}$ starting at $${a}$, so the limit is $${integral} = ${value.toLatex()}$.`,
        `这个和是 $x^{${k}}$ 在从 $${a}$ 开始、长度为 $${b}$ 的区间上的右黎曼和，所以极限是 $${integral} = ${value.toLatex()}$。`,
      ),
    });
  },
};

const enclosedByYAxis: KnowledgePointDef = {
  id: "a-region-enclosed-by-a-curve-and-the-y-axis",
  title: t("A region enclosed by a curve and the y-axis", "曲线与 y 轴围成的区域"),
  explanation: t(
    "When no bounding lines are given, the limits of integration must come from the curve itself: they are the values of $y$ where the curve meets the $y$-axis, the roots of $x(y) = 0$. Between those roots the curve stays on one side of the axis, so the area is the integral of the absolute value of $x$ with respect to $y$.",
    "没有给出边界直线时，积分限必须来自曲线本身：它们是曲线与 $y$ 轴相交处的 $y$ 值，即 $x(y) = 0$ 的根。在这两个根之间，曲线保持在 $y$ 轴的一侧，所以面积就是 $x$ 的绝对值对 $y$ 的积分。",
  ),
  generate(rng) {
    const p = rng.int(-5, 4);
    const gap = rng.int(1, 6);
    const q = p + gap;
    const c = rng.int(1, 3);
    const opensLeft = rng.pick([true, false]);
    const s = opensLeft ? -1 : 1;
    const answer = Q.of(c * gap ** 3, 6);
    const curve = poly([s * c, "y^2"], [-s * c * (p + q), "y"], [s * c * p * q, ""]);
    const side = opensLeft ? "right" : "left";
    const sideZh = opensLeft ? "右" : "左";
    return numberProblem({
      prompt: t(
        `Find the area of the region enclosed by the curve $x = ${curve}$ and the $y$-axis.`,
        `求曲线 $x = ${curve}$ 与 $y$ 轴围成的区域的面积。`,
      ),
      answer,
      wrong: [answer.neg(), Q.of(c * gap ** 3, 3), Q.of(c * gap * gap, 2), Q.of(gap ** 3, 6), Q.of(c * gap ** 3)],
      solution: t(
        `The curve meets the $y$-axis at $y = ${p}$ and $y = ${q}$, and between them it lies to the ${side} of the axis. Integrating $|x|$ from $${p}$ to $${q}$ gives $${answer.toLatex()}$.`,
        `曲线与 $y$ 轴相交于 $y = ${p}$ 和 $y = ${q}$，在这两点之间它位于 $y$ 轴${sideZh}侧。对 $|x|$ 从 $${p}$ 到 $${q}$ 积分，得 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const centralDifferenceError: KnowledgePointDef = {
  id: "the-error-of-a-central-difference-on-a-cubic",
  title: t("The error of a central difference on a cubic", "三次函数的中心差商误差"),
  explanation: t(
    "A central difference balances the two sides of a point, so its even-powered terms in the step cancel. For a cubic the error is therefore exactly its leading coefficient times the square of the step, and it does not depend on the point at all. Halving the step divides the error by four, which is why central differences are preferred.\n\nFor example, for $f(x) = x^{3}$ at $x = 2$ with $h = 0.1$: $\\frac{2.1^{3} - 1.9^{3}}{0.2} = \\frac{9.261 - 6.859}{0.2} = 12.01$, while $f'(2) = 12$.\n\nCheck: the leading coefficient is $1$ and $h^{2} = 0.01$, the same error.\n\n> **Watch out.** The error is $Ah^{2}$ with $A$ the coefficient of $x^{3}$: it uses $h^{2}$, not $h$, and it is the same at every point.",
    "中心差商平衡了一点的两侧，所以步长的偶次项相互抵消。因此对三次函数，误差恰好等于最高次项系数乘以步长的平方，完全与所取的点无关。步长减半，误差就变为四分之一，这正是人们偏爱中心差商的原因。\n\n例如 $f(x) = x^{3}$ 在 $x = 2$ 处取 $h = 0.1$：$\\frac{2.1^{3} - 1.9^{3}}{0.2} = \\frac{9.261 - 6.859}{0.2} = 12.01$，而 $f'(2) = 12$。\n\n检验：最高次项系数为 $1$，$h^{2} = 0.01$，误差相同。\n\n> **注意。** 误差是 $Ah^{2}$，$A$ 是 $x^{3}$ 的系数：用的是 $h^{2}$ 而不是 $h$，且在每一点都相同。",
  ),
  generate(rng) {
    const a = nonzero(rng, 5);
    const b = nonzero(rng, 9);
    const e = nonzero(rng, 9);
    const c = nonzero(rng, 4);
    const h = rng.pick([Q.of(1, 2), Q.one, Q.of(2), Q.of(1, 4)]);
    const answer = h.mul(h).mul(Q.of(a));
    const f = poly([a, "x^3"], [b, "x"], [e, ""]);
    const forward = Q.of(3 * a * c)
      .mul(h)
      .add(answer);
    const fq = (x: Q) => Q.of(a).mul(x.pow(3)).add(Q.of(b).mul(x)).add(Q.of(e));
    const [hi, lo] = [Q.of(c).add(h), Q.of(c).sub(h)];
    const estimate = fq(hi).sub(fq(lo)).div(h.add(h));
    const exact = 3 * a * c * c + b;
    return numberProblem({
      prompt: t(
        `Let $f(x) = ${f}$. Estimate $f'(${c})$ with a central difference quotient $\\frac{f(a + h) - f(a - h)}{2h}$, using $h = ${h.toLatex()}$. Find the estimate minus the true value of $f'(${c})$.`,
        `设 $f(x) = ${f}$。用中心差商 $\\frac{f(a + h) - f(a - h)}{2h}$ 估计 $f'(${c})$，取 $h = ${h.toLatex()}$。求估计值减去 $f'(${c})$ 的真实值。`,
      ),
      answer,
      mistakes: distinctWhys([
        why(
          forward,
          "This is the error of the forward quotient, $3Aah + Ah^{2}$; in the central quotient the $h$ term cancels.",
          "这是向前差商的误差 $3Aah + Ah^{2}$；中心差商中 $h$ 的一次项被抵消了。",
        ),
        why(h.mul(Q.of(a)), "This uses $h$ in place of $h^{2}$.", "这用 $h$ 代替了 $h^{2}$。"),
        why(answer.mul(Q.of(2)), "This divides $2h^{3}$ by $h$ instead of $2h$.", "这是把 $2h^{3}$ 除以 $h$，而应该除以 $2h$。"),
        why(
          0,
          "Central differences are exact only up to quadratics; a cubic leaves an error.",
          "中心差商只对二次以下的函数精确；三次函数会留下误差。",
        ),
        why(answer.neg(), "The sign is wrong: the error is $+Ah^{2}$.", "符号错了：误差是 $+Ah^{2}$。"),
      ]),
      solution: walk(
        [
          [
            "Expand the cubic part",
            "展开三次项",
            `$(x + h)^{3} - (x - h)^{3} = 6x^{2}h + 2h^{3}$, so the term $${poly([a, "x^3"])}$ contributes $${inParens(a)}(3x^{2} + h^{2})$ to the quotient. The terms $${poly([b, "x"], [e, ""])}$ contribute exactly $${b}$.`,
            `$(x + h)^{3} - (x - h)^{3} = 6x^{2}h + 2h^{3}$，所以 $${poly([a, "x^3"])}$ 这一项在差商中贡献 $${inParens(a)}(3x^{2} + h^{2})$。$${poly([b, "x"], [e, ""])}$ 恰好贡献 $${b}$。`,
          ],
          [
            "Subtract the derivative",
            "减去导数",
            `$f'(x) = ${poly([3 * a, "x^2"], [b, ""])}$, so the estimate minus $f'(${c})$ is $${inParens(a)}h^{2} = ${inParens(a)} \\cdot \\left(${h.toLatex()}\\right)^{2} = ${answer.toLatex()}$.`,
            `$f'(x) = ${poly([3 * a, "x^2"], [b, ""])}$，所以估计值减去 $f'(${c})$ 是 $${inParens(a)}h^{2} = ${inParens(a)} \\cdot \\left(${h.toLatex()}\\right)^{2} = ${answer.toLatex()}$。`,
          ],
        ],
        [
          `Directly: $f\\left(${hi.toLatex()}\\right) = ${fq(hi).toLatex()}$ and $f\\left(${lo.toLatex()}\\right) = ${fq(lo).toLatex()}$, so the estimate is $${estimate.toLatex()}$, while $f'(${c}) = ${exact}$. The difference is $${estimate.sub(Q.of(exact)).toLatex()}$.`,
          `直接计算：$f\\left(${hi.toLatex()}\\right) = ${fq(hi).toLatex()}$，以及 $f\\left(${lo.toLatex()}\\right) = ${fq(lo).toLatex()}$，所以估计值是 $${estimate.toLatex()}$，而 $f'(${c}) = ${exact}$。二者之差是 $${estimate.sub(Q.of(exact)).toLatex()}$。`,
        ],
      ),
    });
  },
};

// ---------------------------------------------------------------------------
// Third pass
// ---------------------------------------------------------------------------

/** rightTriangles lists Pythagorean triples with the longest side last. */
const rightTriangles = [
  [3, 4, 5],
  [4, 3, 5],
  [5, 12, 13],
  [12, 5, 13],
  [8, 15, 17],
  [15, 8, 17],
  [7, 24, 25],
  [24, 7, 25],
  [20, 21, 29],
  [21, 20, 29],
  [9, 40, 41],
  [40, 9, 41],
  [12, 35, 37],
  [35, 12, 37],
] as const;

const sechFromTanh: KnowledgePointDef = {
  id: "sech-from-the-value-of-tanh",
  title: t("Sech from the value of tanh", "由 tanh 的值求 sech"),
  explanation: t(
    "Dividing the identity $\\cosh^2 x - \\sinh^2 x = 1$ by $\\cosh^2 x$ gives $1 - \\tanh^2 x = \\operatorname{sech}^2 x$. So the value of $\\tanh x$ fixes the size of $\\operatorname{sech} x$ without any need to find $x$. The sign needs no thought at all, because $\\cosh x$ is always positive and so $\\operatorname{sech} x$ is too.\n\nFor example, if $\\tanh x = -\\frac{3}{5}$, then $\\operatorname{sech}^{2} x = 1 - \\frac{9}{25} = \\frac{16}{25}$, so $\\operatorname{sech} x = \\frac{4}{5}$.\n\nCheck: then $\\cosh x = \\frac{5}{4}$ and $\\sinh x = \\tanh x \\cosh x = -\\frac{3}{4}$, and $\\frac{25}{16} - \\frac{9}{16} = 1$.\n\n> **Watch out.** The identity is $\\operatorname{sech}^{2} x = 1 - \\tanh^{2} x$, with a minus sign. Even for a negative value of $\\tanh x$, $\\operatorname{sech} x$ is positive.",
    "把恒等式 $\\cosh^2 x - \\sinh^2 x = 1$ 除以 $\\cosh^2 x$，得 $1 - \\tanh^2 x = \\operatorname{sech}^2 x$。所以 $\\tanh x$ 的值确定了 $\\operatorname{sech} x$ 的大小，不必求出 $x$。符号也不用考虑，因为 $\\cosh x$ 总是正的，所以 $\\operatorname{sech} x$ 也是正的。\n\n例如，若 $\\tanh x = -\\frac{3}{5}$，则 $\\operatorname{sech}^{2} x = 1 - \\frac{9}{25} = \\frac{16}{25}$，所以 $\\operatorname{sech} x = \\frac{4}{5}$。\n\n检验：此时 $\\cosh x = \\frac{5}{4}$，$\\sinh x = \\tanh x \\cosh x = -\\frac{3}{4}$，而 $\\frac{25}{16} - \\frac{9}{16} = 1$。\n\n> **注意。** 恒等式是 $\\operatorname{sech}^{2} x = 1 - \\tanh^{2} x$，是减号。即使 $\\tanh x$ 的值为负，$\\operatorname{sech} x$ 也是正的。",
  ),
  generate(rng) {
    const [a, b, c] = rng.pick(rightTriangles);
    const sign = rng.pick([1, -1]);
    const tanh = Q.of(sign * b, c);
    const answer = Q.of(a, c);
    const sinh = Q.of(sign * b, a);
    return numberProblem({
      prompt: t(
        `Given $\\tanh x = ${tanh.toLatex()}$, find $\\operatorname{sech} x$.`,
        `已知 $\\tanh x = ${tanh.toLatex()}$，求 $\\operatorname{sech} x$。`,
      ),
      answer,
      mistakes: firstMistakes(answer, [
        why(
          Q.of(-a, c),
          "$\\operatorname{sech} x = \\frac{1}{\\cosh x}$ is always positive.",
          "$\\operatorname{sech} x = \\frac{1}{\\cosh x}$ 恒为正。",
        ),
        why(
          Q.of(c, a),
          "This is $\\cosh x$, the reciprocal of $\\operatorname{sech} x$.",
          "这是 $\\cosh x$，是 $\\operatorname{sech} x$ 的倒数。",
        ),
        why(
          Q.of(c, b),
          "This is the size of $\\coth x = \\frac{1}{\\tanh x}$, not $\\operatorname{sech} x$.",
          "这是 $\\coth x = \\frac{1}{\\tanh x}$ 的绝对值，不是 $\\operatorname{sech} x$。",
        ),
        why(
          Q.of(a, b),
          "This is the size of $\\operatorname{csch} x = \\frac{\\operatorname{sech} x}{\\tanh x}$, not $\\operatorname{sech} x$.",
          "这是 $\\operatorname{csch} x = \\frac{\\operatorname{sech} x}{\\tanh x}$ 的绝对值，不是 $\\operatorname{sech} x$。",
        ),
      ]),
      solution: walk(
        [
          [
            "Use the identity",
            "使用恒等式",
            `$\\operatorname{sech}^2 x = 1 - \\tanh^2 x = 1 - \\frac{${b * b}}{${c * c}} = \\frac{${a * a}}{${c * c}}$.`,
            `$\\operatorname{sech}^2 x = 1 - \\tanh^2 x = 1 - \\frac{${b * b}}{${c * c}} = \\frac{${a * a}}{${c * c}}$。`,
          ],
          [
            "Take the positive root",
            "取正根",
            `$\\operatorname{sech} x$ is always positive, so $\\operatorname{sech} x = ${answer.toLatex()}$.`,
            `$\\operatorname{sech} x$ 恒为正，所以 $\\operatorname{sech} x = ${answer.toLatex()}$。`,
          ],
        ],
        [
          `Then $\\cosh x = ${Q.of(c, a).toLatex()}$ and $\\sinh x = \\tanh x \\cosh x = ${sinh.toLatex()}$, and $\\cosh^{2} x - \\sinh^{2} x = \\frac{${c * c}}{${a * a}} - \\frac{${b * b}}{${a * a}} = 1$.`,
          `于是 $\\cosh x = ${Q.of(c, a).toLatex()}$，$\\sinh x = \\tanh x \\cosh x = ${sinh.toLatex()}$，而 $\\cosh^{2} x - \\sinh^{2} x = \\frac{${c * c}}{${a * a}} - \\frac{${b * b}}{${a * a}} = 1$。`,
        ],
      ),
    });
  },
};

const productLimitFromSumAndDifference: KnowledgePointDef = {
  id: "a-product-limit-from-a-sum-and-a-difference",
  title: t("A product limit from a sum and a difference", "由和与差的极限求积的极限"),
  explanation: t(
    "The limit laws can run backwards. If the limits of $f + g$ and $f - g$ both exist, then so do the limits of $f$ and $g$, since $f = \\frac{1}{2}((f + g) + (f - g))$ and $g = \\frac{1}{2}((f + g) - (f - g))$. Once the two separate limits are known, the product rule gives the limit of $fg$.\n\nIf $f + g \\to 5$ and $f - g \\to 1$, adding gives $2f \\to 6$, so $f \\to 3$, and subtracting gives $2g \\to 4$, so $g \\to 2$. The product tends to $6$.\n\nCheck: $(f + g)^{2} - (f - g)^{2} = 4fg$, and $\\frac{25 - 1}{4} = 6$.\n\n> **Watch out.** Multiplying the two given limits is a mistake: $(f + g)(f - g) = f^{2} - g^{2}$, so it gives the limit of $f^{2} - g^{2}$, here $5$.",
    "极限法则也可以反过来用。如果 $f + g$ 和 $f - g$ 的极限都存在，那么 $f$ 和 $g$ 的极限也存在，因为 $f = \\frac{1}{2}((f + g) + (f - g))$，$g = \\frac{1}{2}((f + g) - (f - g))$。知道两个单独的极限后，积的法则给出 $fg$ 的极限。\n\n若 $f + g \\to 5$，$f - g \\to 1$，相加得 $2f \\to 6$，所以 $f \\to 3$；相减得 $2g \\to 4$，所以 $g \\to 2$。积趋于 $6$。\n\n检验：$(f + g)^{2} - (f - g)^{2} = 4fg$，而 $\\frac{25 - 1}{4} = 6$。\n\n> **注意。** 把两个已知极限相乘是错的：$(f + g)(f - g) = f^{2} - g^{2}$，所以得到的是 $f^{2} - g^{2}$ 的极限，这里是 $5$。",
  ),
  generate(rng) {
    const f = nonzero(rng, 9);
    const g = nonzero(rng, 9);
    const c = rng.int(-5, 5);
    const sum = f + g;
    const difference = f - g;
    const answer = f * g;
    const lim = `\\lim_{x \\to ${c}}`;
    return numberProblem({
      prompt: t(
        `$${lim} (f(x) + g(x)) = ${sum}$ and $${lim} (f(x) - g(x)) = ${difference}$. Find $${lim} f(x)g(x)$.`,
        `$${lim} (f(x) + g(x)) = ${sum}$，$${lim} (f(x) - g(x)) = ${difference}$。求 $${lim} f(x)g(x)$。`,
      ),
      answer,
      form: "integer",
      wrong: [sum * difference, sum + difference, 2 * answer, -answer],
      solution: walk(
        [
          [
            "Add the two statements",
            "两式相加",
            `Adding them, the limit of $2f(x)$ is $${sum} + ${inParens(difference)} = ${2 * f}$, so $f$ has limit $${f}$.`,
            `两式相加，$2f(x)$ 的极限是 $${sum} + ${inParens(difference)} = ${2 * f}$，所以 $f$ 的极限是 $${f}$。`,
          ],
          [
            "Subtract them",
            "两式相减",
            `Subtracting, the limit of $2g(x)$ is $${sum} - ${inParens(difference)} = ${2 * g}$, so $g$ has limit $${g}$.`,
            `两式相减，$2g(x)$ 的极限是 $${sum} - ${inParens(difference)} = ${2 * g}$，所以 $g$ 的极限是 $${g}$。`,
          ],
          [
            "Multiply",
            "相乘",
            `By the product rule the limit of $f(x)g(x)$ is $${f} \\cdot ${inParens(g)} = ${answer}$.`,
            `由积的法则，$f(x)g(x)$ 的极限是 $${f} \\cdot ${inParens(g)} = ${answer}$。`,
          ],
        ],
        [
          `Since $(f + g)^{2} - (f - g)^{2} = 4fg$, the limit of $fg$ is also\n\n$$\\frac{${inParens(sum)}^{2} - ${inParens(difference)}^{2}}{4} = \\frac{${sum * sum} - ${difference * difference}}{4} = ${answer}$$\n\nBoth routes give $${answer}$.`,
          `因为 $(f + g)^{2} - (f - g)^{2} = 4fg$，$fg$ 的极限也等于\n\n$$\\frac{${inParens(sum)}^{2} - ${inParens(difference)}^{2}}{4} = \\frac{${sum * sum} - ${difference * difference}}{4} = ${answer}$$\n\n两种方法都得到 $${answer}$。`,
        ],
      ),
    });
  },
};

const limitFromItsRoot: KnowledgePointDef = {
  id: "a-limit-from-the-limit-of-its-root",
  title: t("A limit from the limit of its root", "由根式的极限求极限"),
  explanation: t(
    "The root rule says that the limit of a root is the root of the limit, when the limit is positive. Read in reverse, it recovers an unknown limit: squaring both sides of a statement about $\\sqrt{f(x) + k}$ gives the limit of $f(x) + k$. The sum rule then removes the constant. These two steps undo the operations on $f$ in the opposite order, in the same way as solving an equation.\n\nIf $\\lim_{x \\to 1} \\sqrt{f(x) + 3} = 4$, then $f(x) + 3 \\to 16$, so $f(x) \\to 13$.\n\nCheck: putting $13$ back gives $\\sqrt{13 + 3} = 4$.\n\n> **Watch out.** Undo the root first and the constant second. Subtracting first, as in $4 - 3 = 1$, undoes the operations in the wrong order.",
    "根式法则说，当极限为正时，根式的极限等于极限的根式。反过来读，可以求出未知的极限：把关于 $\\sqrt{f(x) + k}$ 的等式两边平方，得到 $f(x) + k$ 的极限。再用和的法则去掉常数。这两步按相反的顺序撤销对 $f$ 的运算，就像解方程一样。\n\n若 $\\lim_{x \\to 1} \\sqrt{f(x) + 3} = 4$，则 $f(x) + 3 \\to 16$，所以 $f(x) \\to 13$。\n\n检验：代回 $13$，得 $\\sqrt{13 + 3} = 4$。\n\n> **注意。** 先撤销根号，再去掉常数。先相减，比如算 $4 - 3 = 1$，就把运算的顺序弄反了。",
  ),
  generate(rng) {
    const m = rng.int(2, 9);
    const k = nonzero(rng, 12);
    const c = rng.int(-5, 5);
    const answer = m * m - k;
    const inside = poly([1, "f(x)"], [k, ""]);
    const sample = poly([1, "x"], [answer - c, ""]);
    const table = valueTable(around(c), [[`\\sqrt{${inside}}`, (x) => Math.sqrt(x + answer - c + k)]]);
    return numberProblem({
      prompt: t(
        `$\\lim_{x \\to ${c}} \\sqrt{${inside}} = ${m}$. Find $\\lim_{x \\to ${c}} f(x)$.`,
        `$\\lim_{x \\to ${c}} \\sqrt{${inside}} = ${m}$。求 $\\lim_{x \\to ${c}} f(x)$。`,
      ),
      answer,
      form: "integer",
      wrong: [m - k, m * m + k, m * m, 2 * m - k],
      solution: walk(
        [
          [
            "Square both sides",
            "两边平方",
            `The limit of the root is the root of the limit, so squaring undoes it:\n\n$$\\lim_{x \\to ${c}} \\left(${inside}\\right) = ${m}^{2} = ${m * m}$$`,
            `根式的极限等于极限的根式，所以平方就把根号撤销了：\n\n$$\\lim_{x \\to ${c}} \\left(${inside}\\right) = ${m}^{2} = ${m * m}$$`,
          ],
          [
            "Remove the constant",
            "去掉常数",
            `By the sum rule, the limit of $f(x)$ is $${m * m} - ${inParens(k)} = ${answer}$.`,
            `由和的法则，$f(x)$ 的极限是 $${m * m} - ${inParens(k)} = ${answer}$。`,
          ],
        ],
        [
          `Put the answer back: $\\sqrt{${poly([answer, ""], [k, ""])}} = \\sqrt{${m * m}} = ${m}$. For a function with this limit, take $f(x) = ${sample}$; near $x = ${c}$:\n\n${table}\n\nThe values close in on $${m}$, as the statement requires.`,
          `代回答案：$\\sqrt{${poly([answer, ""], [k, ""])}} = \\sqrt{${m * m}} = ${m}$。取一个有这个极限的函数 $f(x) = ${sample}$，在 $x = ${c}$ 附近：\n\n${table}\n\n函数值逼近 $${m}$，与已知条件一致。`,
        ],
      ),
    });
  },
};

const expandedPowersAtInfinity: KnowledgePointDef = {
  id: "a-difference-of-expanded-powers-at-infinity",
  title: t("A difference of expanded powers at infinity", "展开后的幂之差在无穷远处的极限"),
  explanation: t(
    "The leading term of a polynomial decides its limit at infinity, but only once the polynomial has been written out. In $(x + a)^n - x^n$ the terms $x^n$ cancel, and so the leading term is really the next one in the binomial expansion, $nax^{n - 1}$.\n\nFor $\\frac{(x + 2)^{2} - x^{2}}{3x}$ the numerator is $4x + 4$, so the quotient tends to $\\frac{4}{3}$.\n\nCheck: at $x = 100$ the quotient is $\\frac{404}{300} \\approx 1.347$.\n\n> **Watch out.** Comparing the highest powers before expanding suggests a numerator of degree $n$ and an infinite limit. The $x^{n}$ terms cancel, so the numerator has degree $n - 1$.",
    "多项式的首项决定它在无穷远处的极限，但前提是多项式已经写开。在 $(x + a)^n - x^n$ 中，$x^n$ 项抵消了，所以真正的首项是二项式展开的下一项 $nax^{n - 1}$。\n\n对于 $\\frac{(x + 2)^{2} - x^{2}}{3x}$，分子是 $4x + 4$，所以商趋于 $\\frac{4}{3}$。\n\n检验：$x = 100$ 时商是 $\\frac{404}{300} \\approx 1.347$。\n\n> **注意。** 不展开就比较最高次幂，会以为分子是 $n$ 次的、极限是无穷大。$x^{n}$ 项抵消后，分子只有 $n - 1$ 次。",
  ),
  generate(rng) {
    const a = nonzero(rng, 9);
    const n = rng.int(2, 4);
    const k = rng.int(1, 5);
    const answer = Q.of(n * a, k);
    const denominator = poly([k, n === 2 ? "x" : `x^${n - 1}`]);
    const inner = poly([1, "x"], [a, ""]);
    const terms = range(0, n).map((j) => [binomial(n, j) * a ** j, power(n - j)] as const);
    const expanded = poly(...terms);
    const rest = poly(...terms.slice(1));
    const expression = `\\frac{(${inner})^{${n}} - x^{${n}}}{${denominator}}`;
    const table = valueTable([10, 100, 1000], [[expression, (x) => ((x + a) ** n - x ** n) / (k * x ** (n - 1))]]);
    return numberProblem({
      prompt: t(`Find $\\lim_{x \\to \\infty} ${expression}$.`, `求 $\\lim_{x \\to \\infty} ${expression}$。`),
      answer,
      wrong: [Q.of(a, k), Q.of(a ** n, k), Q.of(n * a), Q.of(n, k)],
      solution: walk(
        [
          [
            "Expand the power",
            "展开幂",
            `By the binomial theorem\n\n$$(${inner})^{${n}} = ${expanded}$$\n\nThe terms $x^{${n}}$ cancel, so the numerator is\n\n$$${rest}$$`,
            `由二项式定理\n\n$$(${inner})^{${n}} = ${expanded}$$\n\n$x^{${n}}$ 项抵消，所以分子是\n\n$$${rest}$$`,
          ],
          [
            "Divide by the leading power",
            "除以最高次幂",
            `The numerator has the leading term $${poly([n * a, power(n - 1)])}$ and the denominator is $${denominator}$, of the same degree. The limit is the ratio of their coefficients, $${answer.toLatex()}$.`,
            `分子的首项是 $${poly([n * a, power(n - 1)])}$，分母是同次的 $${denominator}$。极限是它们系数之比 $${answer.toLatex()}$。`,
          ],
        ],
        [
          `Evaluate the quotient for larger and larger $x$:\n\n${table}\n\nThe values close in on $${answer.toLatex()}${approx(answer)}$ and do not grow, so the limit is finite.`,
          `计算 $x$ 越来越大时的商：\n\n${table}\n\n函数值逼近 $${answer.toLatex()}${approx(answer)}$，并不增大，所以极限是有限的。`,
        ],
      ),
    });
  },
};

const radicalAtNegativeInfinity: KnowledgePointDef = {
  id: "a-radical-over-a-linear-term-at-negative-infinity",
  title: t("A radical over a linear term at negative infinity", "负无穷处根式与一次式之比"),
  explanation: t(
    "For large $|x|$, the expression $\\sqrt{a^2x^2 + b}$ behaves like $\\sqrt{a^2x^2} = a|x|$, and the absolute value matters. As $x \\to -\\infty$, $x$ is negative and $|x| = -x$. The limit at negative infinity therefore has the opposite sign from the limit at positive infinity.\n\nFor $\\frac{\\sqrt{4x^{2} + 1}}{x + 3}$ the root behaves like $-2x$ as $x \\to -\\infty$, so the limit is $-2$.\n\nCheck: at $x = -1000$ the quotient is $\\frac{2000.00025}{-997} \\approx -2.006$.\n\n> **Watch out.** $\\sqrt{x^{2}} = |x|$, not $x$. Writing the root as $ax$ gives the wrong sign, since the root is always positive while $ax$ is negative there.",
    "当 $|x|$ 很大时，$\\sqrt{a^2x^2 + b}$ 的表现像 $\\sqrt{a^2x^2} = a|x|$，绝对值很重要。当 $x \\to -\\infty$ 时，$x$ 为负，$|x| = -x$。所以负无穷处的极限与正无穷处的极限符号相反。\n\n对于 $\\frac{\\sqrt{4x^{2} + 1}}{x + 3}$，当 $x \\to -\\infty$ 时根式的表现像 $-2x$，所以极限是 $-2$。\n\n检验：$x = -1000$ 时商是 $\\frac{2000.00025}{-997} \\approx -2.006$。\n\n> **注意。** $\\sqrt{x^{2}} = |x|$，而不是 $x$。把根式写成 $ax$ 会得到错误的符号，因为根式总是正的，而此时 $ax$ 是负的。",
  ),
  generate(rng) {
    const a = rng.int(2, 9);
    const b = rng.int(1, 20);
    const c = nonzero(rng, 9);
    const d = nonzero(rng, 9);
    const answer = Q.of(-a, c);
    const denominator = poly([c, "x"], [d, ""]);
    const radicand = poly([a * a, "x^2"], [b, ""]);
    const expression = `\\frac{\\sqrt{${radicand}}}{${denominator}}`;
    const table = valueTable([-10, -100, -1000], [[expression, (x) => Math.sqrt(a * a * x * x + b) / (c * x + d)]]);
    return numberProblem({
      prompt: t(`Find $\\lim_{x \\to -\\infty} ${expression}$.`, `求 $\\lim_{x \\to -\\infty} ${expression}$。`),
      answer,
      wrong: [Q.of(a, c), Q.of(a * a, c), Q.of(-a * a, c), Q.of(-a)],
      solution: walk(
        [
          [
            "Take out the absolute value",
            "提出绝对值",
            `For $x < 0$, $\\sqrt{x^{2}} = |x| = -x$, so\n\n$$\\sqrt{${radicand}} = -x\\sqrt{${a * a} + \\frac{${b}}{x^{2}}}$$`,
            `当 $x < 0$ 时，$\\sqrt{x^{2}} = |x| = -x$，所以\n\n$$\\sqrt{${radicand}} = -x\\sqrt{${a * a} + \\frac{${b}}{x^{2}}}$$`,
          ],
          [
            "Divide by $x$",
            "同除以 $x$",
            `Dividing the top and the bottom by $x$ gives\n\n$$\\frac{-\\sqrt{${a * a} + \\frac{${b}}{x^{2}}}}{${c} ${d < 0 ? "-" : "+"} \\frac{${Math.abs(d)}}{x}}$$\n\nThe fractions with $x$ below tend to $0$, so the limit is $\\frac{-${a}}{${c}}$, which is $${answer.toLatex()}$.`,
            `分子分母同除以 $x$，得\n\n$$\\frac{-\\sqrt{${a * a} + \\frac{${b}}{x^{2}}}}{${c} ${d < 0 ? "-" : "+"} \\frac{${Math.abs(d)}}{x}}$$\n\n分母含 $x$ 的分式都趋于 $0$，所以极限是 $\\frac{-${a}}{${c}}$，即 $${answer.toLatex()}$。`,
          ],
        ],
        [
          `Evaluate the quotient for more and more negative $x$:\n\n${table}\n\nThe values close in on $${answer.toLatex()}${approx(answer)}$. Writing the root as $${a}x$ would give $${Q.of(a, c).toLatex()}$, with the wrong sign.`,
          `计算 $x$ 越来越负时的商：\n\n${table}\n\n函数值逼近 $${answer.toLatex()}${approx(answer)}$。把根式写成 $${a}x$ 会得到 $${Q.of(a, c).toLatex()}$，符号错了。`,
        ],
      ),
    });
  },
};

const inverseTrigOfRatio: KnowledgePointDef = {
  id: "an-inverse-trigonometric-function-of-a-ratio-at-infinity",
  title: t("An inverse trigonometric function of a ratio at infinity", "比值的反三角函数在无穷远处的极限"),
  explanation: t(
    "Inverse trigonometric functions are continuous on their domains, so a limit can pass inside them: the limit of $\\arctan g(x)$ is the arctangent of the limit of $g(x)$. If $g$ is a ratio of two linear expressions, its limit at infinity is the ratio of the leading coefficients, whichever way $x$ goes. What remains is then a special value of the outer function, which is a simple multiple of $\\pi$.\n\nFor $\\arctan\\left(\\frac{3x}{3x + 1}\\right)$ the ratio tends to $1$, so the limit is $\\arctan 1 = \\frac{\\pi}{4}$.\n\nCheck: at $x = 100$ the ratio is $\\frac{300}{301} \\approx 0.997$, and its arctangent is about $0.784$, close to $\\frac{\\pi}{4} \\approx 0.785$.\n\n> **Watch out.** Take the limit of the ratio first, then the special value. The ratio is not the answer, and neither is the angle in degrees.",
    "反三角函数在定义域上连续，所以极限可以移到函数里面：$\\arctan g(x)$ 的极限是 $g(x)$ 极限的反正切。如果 $g$ 是两个一次式之比，无论 $x$ 趋向哪个方向，它在无穷远处的极限都是首项系数之比。剩下的就是外层函数的特殊值，它是 $\\pi$ 的简单倍数。\n\n对于 $\\arctan\\left(\\frac{3x}{3x + 1}\\right)$，比值趋于 $1$，所以极限是 $\\arctan 1 = \\frac{\\pi}{4}$。\n\n检验：$x = 100$ 时比值是 $\\frac{300}{301} \\approx 0.997$，它的反正切约为 $0.784$，接近 $\\frac{\\pi}{4} \\approx 0.785$。\n\n> **注意。** 先求比值的极限，再取特殊值。比值本身不是答案，用角度表示的度数也不是。",
  ),
  generate(rng) {
    const sign = rng.pick([1, -1]);
    const usesArctan = rng.pick([true, false]);
    const b = rng.int(1, 9);
    const c = nonzero(rng, 9);
    const denominator = usesArctan ? b : 2 * b;
    const parts = usesArctan ? 4 : 6;
    const answer = Q.of(sign, parts);
    const name = usesArctan ? "\\arctan" : "\\arcsin";
    const ratio = Q.of(sign, usesArctan ? 1 : 2);
    const direction = rng.pick(["\\infty", "-\\infty"]);
    const inner = `\\frac{${poly([sign * b, "x"])}}{${poly([denominator, "x"], [c, ""])}}`;
    const g = (x: number) => (sign * b * x) / (denominator * x + c);
    const outer = usesArctan ? Math.atan : Math.asin;
    const xs = [10, 100, 1000].map((x) => (direction === "\\infty" ? x : -x));
    const table = valueTable(xs, [
      ["g(x)", g],
      [`\\frac{1}{\\pi}${name} g(x)`, (x) => outer(g(x)) / Math.PI],
    ]);
    const word = usesArctan ? t("arctangent", "反正切") : t("arcsine", "反正弦");
    return numberProblem({
      prompt: t(
        `$\\lim_{x \\to ${direction}} ${name}\\left(${inner}\\right) = k\\pi$. Find $k$.`,
        `$\\lim_{x \\to ${direction}} ${name}\\left(${inner}\\right) = k\\pi$。求 $k$。`,
      ),
      answer,
      wrong: [Q.of(sign, 2), Q.of(-sign, parts), Q.of(sign, 3), Q.of(sign, 12)],
      solution: walk(
        [
          [
            "Find the limit of the ratio",
            "求比值的极限",
            `Write $g(x) = ${inner}$. Dividing the top and the bottom by $x$, $g(x)$ tends to the ratio of the leading coefficients, $${ratio.toLatex()}$.`,
            `记 $g(x) = ${inner}$。分子分母同除以 $x$，$g(x)$ 趋于首项系数之比 $${ratio.toLatex()}$。`,
          ],
          [
            "Use continuity",
            "利用连续性",
            `The ${word.en} is continuous at $${ratio.toLatex()}$, so\n\n$$\\lim_{x \\to ${direction}} ${name} g(x) = ${name}\\left(${ratio.toLatex()}\\right) = ${piLatex(sign, parts)}$$\n\nSo $k = ${answer.toLatex()}$.`,
            `${word["zh-CN"]}函数在 $${ratio.toLatex()}$ 处连续，所以\n\n$$\\lim_{x \\to ${direction}} ${name} g(x) = ${name}\\left(${ratio.toLatex()}\\right) = ${piLatex(sign, parts)}$$\n\n所以 $k = ${answer.toLatex()}$。`,
          ],
        ],
        [
          `Evaluate $g$ and the ${word.en} of it, divided by $\\pi$, farther and farther out:\n\n${table}\n\nThe last row closes in on $${answer.toLatex()}${approx(answer)}$.`,
          `在越来越远处计算 $g$ 以及它的${word["zh-CN"]}除以 $\\pi$：\n\n${table}\n\n最后一行逼近 $${answer.toLatex()}${approx(answer)}$。`,
        ],
      ),
    });
  },
};

const quotientOfAbsoluteValues: KnowledgePointDef = {
  id: "a-quotient-of-absolute-values-that-has-a-limit",
  title: t("A quotient of absolute values that has a limit", "有极限的绝对值之商"),
  explanation: t(
    "A quotient like $\\frac{|x^2 - a^2|}{x - a}$ has no two-sided limit at $a$, because it takes opposite signs on either side. But when the absolute value appears in both the numerator and the denominator, the sign cancels. Since $|x^2 - a^2| = |x - a||x + a|$, the factor $|x - a|$ can be cancelled for $x \\ne a$, which leaves a continuous function. So this limit exists, even though each piece vanishes at $a$.\n\nFor $\\lim_{x \\to 3} \\frac{|x^{2} - 9|}{|x - 3|}$, cancelling leaves $|x + 3|$, so the limit is $6$.\n\nCheck: at $x = 2.99$ the quotient is $5.99$, and at $x = 3.01$ it is $6.01$.\n\n> **Watch out.** What is left is $|x + a|$, evaluated at $x = a$: it is $|2a|$, which is positive even when $a$ is negative.",
    "像 $\\frac{|x^2 - a^2|}{x - a}$ 这样的商在 $a$ 处没有双侧极限，因为两侧符号相反。但当绝对值同时出现在分子和分母中时，符号抵消了。由于 $|x^2 - a^2| = |x - a||x + a|$，当 $x \\ne a$ 时可以约去 $|x - a|$，剩下一个连续函数。所以这个极限存在，尽管分子和分母在 $a$ 处都为零。\n\n对于 $\\lim_{x \\to 3} \\frac{|x^{2} - 9|}{|x - 3|}$，约去后剩下 $|x + 3|$，所以极限是 $6$。\n\n检验：$x = 2.99$ 时商是 $5.99$，$x = 3.01$ 时是 $6.01$。\n\n> **注意。** 剩下的是 $|x + a|$，要在 $x = a$ 处求值：它等于 $|2a|$，即使 $a$ 是负数，它也是正的。",
  ),
  generate(rng) {
    const a = nonzero(rng, 9);
    const k = rng.int(1, 6);
    const answer = 2 * k * Math.abs(a);
    const scale = k === 1 ? "" : `${k}`;
    const f = (x: number) => (k * Math.abs(x * x - a * a)) / Math.abs(x - a);
    return numberProblem({
      prompt: t(
        `Find $\\lim_{x \\to ${a}} \\frac{${scale}|x^2 - ${a * a}|}{|${poly([1, "x"], [-a, ""])}|}$.`,
        `求 $\\lim_{x \\to ${a}} \\frac{${scale}|x^2 - ${a * a}|}{|${poly([1, "x"], [-a, ""])}|}$。`,
      ),
      answer,
      form: "integer",
      mistakes: firstMistakes(answer, [
        why(
          -answer,
          a < 0
            ? `This takes $|${2 * a}|$ as $${2 * a}$. An absolute value is never negative.`
            : "A quotient of absolute values is never negative.",
          a < 0 ? `这把 $|${2 * a}|$ 当成了 $${2 * a}$。绝对值永远不是负数。` : "绝对值之商永远不是负数。",
        ),
        why(
          k * Math.abs(a),
          `This takes $|${poly([1, "x"], [a, ""])}|$ as $|${a}|$. At $x = ${a}$ it is $|${2 * a}|$.`,
          `这把 $|${poly([1, "x"], [a, ""])}|$ 当成了 $|${a}|$。在 $x = ${a}$ 处它等于 $|${2 * a}|$。`,
        ),
        why(
          k * a * a,
          `This uses $x^2 = ${a * a}$. The factor left after cancelling is $|${poly([1, "x"], [a, ""])}|$.`,
          `这用了 $x^2 = ${a * a}$。约分后剩下的因式是 $|${poly([1, "x"], [a, ""])}|$。`,
        ),
        why(0, "This reads $\\frac{0}{0}$ as $0$. Cancel the common factor first.", "这把 $\\frac{0}{0}$ 当成了 $0$。要先约去公因式。"),
      ]),
      solution: walk(
        [
          [
            "Factor",
            "分解因式",
            `\n\n$$|x^2 - ${a * a}| = |${poly([1, "x"], [-a, ""])}||${poly([1, "x"], [a, ""])}|$$`,
            `\n\n$$|x^2 - ${a * a}| = |${poly([1, "x"], [-a, ""])}||${poly([1, "x"], [a, ""])}|$$`,
          ],
          [
            "Cancel",
            "约分",
            `For $x \\ne ${a}$, cancel $|${poly([1, "x"], [-a, ""])}|$. This leaves $${scale}|${poly([1, "x"], [a, ""])}|$, which is continuous.`,
            `当 $x \\ne ${a}$ 时约去 $|${poly([1, "x"], [-a, ""])}|$，剩下 $${scale}|${poly([1, "x"], [a, ""])}|$，它是连续的。`,
          ],
          [
            "Substitute",
            "代入",
            `At $x = ${a}$: $${k === 1 ? "" : `${k} \\cdot `}|${2 * a}| = ${answer}$.`,
            `在 $x = ${a}$ 处：$${k === 1 ? "" : `${k} \\cdot `}|${2 * a}| = ${answer}$。`,
          ],
        ],
        [
          `Evaluate the quotient on both sides of $x = ${a}$:\n\n${valueTable(around(a), [["f(x)", f]])}\n\nBoth sides close in on $${answer}$.`,
          `计算商在 $x = ${a}$ 两侧的值：\n\n${valueTable(around(a), [["f(x)", f]])}\n\n两侧都逼近 $${answer}$。`,
        ],
      ),
    });
  },
};

const shiftedSineOverSquares: KnowledgePointDef = {
  id: "a-shifted-sine-over-a-difference-of-squares",
  title: t("A shifted sine over a difference of squares", "平移的正弦与平方差之比"),
  explanation: t(
    "The special limit $\\frac{\\sin u}{u} \\to 1$ works for any quantity $u$ that tends to zero, not just for $x$ itself. Near $x = a$, the natural choice is $u = x - a$, so the denominator must be arranged to contain this factor. Factoring a difference of squares does this, and it leaves a second factor that is continuous at $a$ and may simply be evaluated. So the limit is a product of two easy limits.\n\nFor $\\lim_{x \\to 1} \\frac{\\sin 3(x - 1)}{x^{2} - 1}$: $\\frac{\\sin 3(x - 1)}{x - 1} \\to 3$ and $\\frac{1}{x + 1} \\to \\frac{1}{2}$, so the limit is $\\frac{3}{2}$.\n\nCheck: at $x = 1.001$ the quotient is about $1.4992$, and at $x = 0.999$ about $1.5007$.\n\n> **Watch out.** The second factor $\\frac{1}{x + a}$ stays in the answer: at $x = a$ it is $\\frac{1}{2a}$, not $1$ and not $\\frac{1}{a}$.",
    "特殊极限 $\\frac{\\sin u}{u} \\to 1$ 对任何趋于零的量 $u$ 都成立，不只是 $x$ 本身。在 $x = a$ 附近，自然的选择是 $u = x - a$，所以要把分母整理成含有这个因子的形式。分解平方差正好做到这一点，并留下另一个在 $a$ 处连续的因子，可以直接代入。所以极限是两个简单极限之积。\n\n对于 $\\lim_{x \\to 1} \\frac{\\sin 3(x - 1)}{x^{2} - 1}$：$\\frac{\\sin 3(x - 1)}{x - 1} \\to 3$，$\\frac{1}{x + 1} \\to \\frac{1}{2}$，所以极限是 $\\frac{3}{2}$。\n\n检验：$x = 1.001$ 时商约为 $1.4992$，$x = 0.999$ 时约为 $1.5007$。\n\n> **注意。** 第二个因子 $\\frac{1}{x + a}$ 要留在答案里：它在 $x = a$ 处等于 $\\frac{1}{2a}$，不是 $1$，也不是 $\\frac{1}{a}$。",
  ),
  generate(rng) {
    const a = nonzero(rng, 9);
    const k = rng.int(1, 9);
    const answer = Q.of(k, 2 * a);
    const shift = poly([1, "x"], [-a, ""]);
    const argument = k === 1 ? shift : `${k}(${shift})`;
    const f = (x: number) => Math.sin(k * (x - a)) / (x * x - a * a);
    return numberProblem({
      prompt: t(
        `Find $\\lim_{x \\to ${a}} \\frac{\\sin(${argument})}{x^2 - ${a * a}}$.`,
        `求 $\\lim_{x \\to ${a}} \\frac{\\sin(${argument})}{x^2 - ${a * a}}$。`,
      ),
      answer,
      mistakes: firstMistakes(answer, [
        why(
          Q.of(k, a),
          `This takes $${poly([1, "x"], [a, ""])}$ as $${a}$. At $x = ${a}$ it is $${2 * a}$.`,
          `这把 $${poly([1, "x"], [a, ""])}$ 当成了 $${a}$。在 $x = ${a}$ 处它等于 $${2 * a}$。`,
        ),
        why(
          Q.of(1, 2 * a),
          `This drops the multiple $${k}$: $\\frac{\\sin(${argument})}{${shift}} \\to ${k}$.`,
          `这丢掉了倍数 $${k}$：$\\frac{\\sin(${argument})}{${shift}} \\to ${k}$。`,
        ),
        why(
          Q.of(k),
          `This drops the second factor $\\frac{1}{${poly([1, "x"], [a, ""])}}$, which is $${Q.of(1, 2 * a).toLatex()}$ at $x = ${a}$.`,
          `这丢掉了第二个因子 $\\frac{1}{${poly([1, "x"], [a, ""])}}$，它在 $x = ${a}$ 处等于 $${Q.of(1, 2 * a).toLatex()}$。`,
        ),
        why(
          Q.of(-k, 2 * a),
          `This has the wrong sign: $${poly([1, "x"], [a, ""])}$ is $${2 * a}$ at $x = ${a}$.`,
          `这符号错了：$${poly([1, "x"], [a, ""])}$ 在 $x = ${a}$ 处等于 $${2 * a}$。`,
        ),
      ]),
      solution: walk(
        [
          [
            "Factor the denominator",
            "分解分母",
            `\n\n$$\\frac{\\sin(${argument})}{x^2 - ${a * a}} = \\frac{\\sin(${argument})}{${shift}} \\cdot \\frac{1}{${poly([1, "x"], [a, ""])}}$$`,
            `\n\n$$\\frac{\\sin(${argument})}{x^2 - ${a * a}} = \\frac{\\sin(${argument})}{${shift}} \\cdot \\frac{1}{${poly([1, "x"], [a, ""])}}$$`,
          ],
          [
            "Take each limit",
            "分别求极限",
            `With $u = ${shift} \\to 0$, $\\frac{\\sin ${k === 1 ? "" : k}u}{u} \\to ${k}$, and $\\frac{1}{${poly([1, "x"], [a, ""])}} \\to ${Q.of(1, 2 * a).toLatex()}$.`,
            `令 $u = ${shift} \\to 0$，则 $\\frac{\\sin ${k === 1 ? "" : k}u}{u} \\to ${k}$，而 $\\frac{1}{${poly([1, "x"], [a, ""])}} \\to ${Q.of(1, 2 * a).toLatex()}$。`,
          ],
          ["Multiply", "相乘", `Their product is $${answer.toLatex()}$.`, `它们的积是 $${answer.toLatex()}$。`],
        ],
        [
          `Evaluate the quotient on both sides of $x = ${a}$:\n\n${valueTable(around(a), [["f(x)", f]])}\n\nThe values close in on $${answer.toLatex()}${approx(answer)}$.`,
          `计算商在 $x = ${a}$ 两侧的值：\n\n${valueTable(around(a), [["f(x)", f]])}\n\n这些值逼近 $${answer.toLatex()}${approx(answer)}$。`,
        ],
      ),
    });
  },
};

const continuityOfRadicalQuotient: KnowledgePointDef = {
  id: "counting-the-integers-where-a-radical-quotient-is-continuous",
  title: t("Counting the integers where a radical quotient is continuous", "计算根式商连续的整数个数"),
  explanation: t(
    "A combination of continuous functions is continuous wherever it is defined. So continuity can be read off from the domain: a square root needs a nonnegative input, and a denominator must not be zero. At the left end of the domain of the root, only the right side of the point exists, so that continuity there means continuity from the right. Points outside the domain cannot be continuous, because the function has no value there.\n\nFor example, $f(x) = \\frac{\\sqrt{x - 1}}{x - 3}$ needs $x \\ge 1$ and $x \\ne 3$. Of the integers from $0$ to $5$, that leaves $1$, $2$, $4$ and $5$, four in all.\n\nCheck: $f(1) = 0$, $f(2) = -1$, $f(4) = \\sqrt{3}$ and $f(5) = 1$ are all defined, while $f(0)$ needs $\\sqrt{-1}$ and $f(3)$ divides by $0$.\n\n> **Watch out.** The left end of the domain counts. There the root is $0$, so $f$ is defined and continuous from the right.",
    "连续函数的组合在有定义的地方都连续。所以连续性可以从定义域读出：平方根要求被开方数非负，分母不能为零。在根式定义域的左端点，只存在该点的右侧，所以那里的连续指右连续。定义域之外的点不可能连续，因为函数在那里没有值。\n\n例如，$f(x) = \\frac{\\sqrt{x - 1}}{x - 3}$ 要求 $x \\ge 1$ 且 $x \\ne 3$。从 $0$ 到 $5$ 的整数中剩下 $1$、$2$、$4$、$5$，共四个。\n\n检验：$f(1) = 0$，$f(2) = -1$，$f(4) = \\sqrt{3}$，$f(5) = 1$ 都有定义；而 $f(0)$ 需要 $\\sqrt{-1}$，$f(3)$ 要除以 $0$。\n\n> **注意。** 定义域的左端点要算上。那里根式为 $0$，所以 $f$ 有定义，并且右连续。",
  ),
  generate(rng) {
    const a = rng.int(-5, 5);
    const b = a + rng.int(1, 6);
    const low = a - rng.int(1, 4);
    const high = b + rng.int(1, 8);
    const answer = high - a;
    const f = `\\frac{\\sqrt{${poly([1, "x"], [-a, ""])}}}{${poly([1, "x"], [-b, ""])}}`;
    const xs = [...new Set([a, a + 1, b - 1, b + 1, high])].filter((x) => x !== b).sort((x, y) => x - y);
    const rows = valueTable(xs, [["f(x)", (x) => Math.sqrt(x - a) / (x - b)]]);
    return numberProblem({
      prompt: t(
        `Let $f(x) = ${f}$. At how many integers from $${low}$ to $${high}$ is $f$ continuous? At the left end of its domain, continuity from the right counts.`,
        `设 $f(x) = ${f}$。从 $${low}$ 到 $${high}$ 的整数中，$f$ 在多少个处连续？在定义域的左端点，右连续也算连续。`,
      ),
      answer,
      form: "integer",
      wrong: [answer + 1, answer - 1, high - low, high - low + 1],
      solution: walk(
        [
          [
            "Use the root",
            "利用根式",
            `The root needs $x \\ge ${a}$, which leaves the $${answer + 1}$ integers from $${a}$ to $${high}$. At $x = ${a}$ the root is $0$, and $f$ is continuous from the right.`,
            `根式要求 $x \\ge ${a}$，这样剩下从 $${a}$ 到 $${high}$ 的 $${answer + 1}$ 个整数。在 $x = ${a}$ 处根式为 $0$，$f$ 右连续。`,
          ],
          [
            "Use the denominator",
            "利用分母",
            `Leaving out $x = ${b}$, where the denominator vanishes, gives $${answer}$.`,
            `去掉使分母为零的 $x = ${b}$，得 $${answer}$。`,
          ],
        ],
        [
          `Count the other way. There are $${high - low + 1}$ integers from $${low}$ to $${high}$; the $${a - low}$ below $${a}$ have no real root, and $x = ${b}$ divides by $0$, leaving $${high - low + 1} - ${a - low} - 1 = ${answer}$.\n\nSome of the values that remain:\n\n${rows}\n\nEach is a real number, so $f$ is defined there.`,
          `换一种方法数。从 $${low}$ 到 $${high}$ 共有 $${high - low + 1}$ 个整数；小于 $${a}$ 的 $${a - low}$ 个没有实数根，$x = ${b}$ 要除以 $0$，剩下 $${high - low + 1} - ${a - low} - 1 = ${answer}$ 个。\n\n剩下的点处的一些函数值：\n\n${rows}\n\n每个都是实数，所以 $f$ 在这些点有定义。`,
        ],
      ),
    });
  },
};

const jumpsOfFloor: KnowledgePointDef = {
  id: "the-number-of-jumps-of-a-floor-function",
  figure: calculusDrawings1["jump-discontinuities#the-number-of-jumps-of-a-floor-function"],
  title: t("The number of jumps of a floor function", "取整函数的跳跃次数"),
  explanation: t(
    "The floor function $\\lfloor u \\rfloor$ jumps by 1 whenever $u$ reaches an integer. So $\\lfloor kx \\rfloor$ jumps wherever $kx$ is an integer, which happens at each multiple of $\\frac{1}{k}$. Compressing the graph horizontally in this way makes the jumps more frequent, with $k$ of them for each unit of $x$. When counting over an interval, check whether the ends are included, since a jump at an end of the interval would not count as an interior one.\n\nFor example, $\\lfloor 2x \\rfloor$ on $(0, 3)$ jumps at $0.5, 1, 1.5, 2$ and $2.5$, five times, which is $2 \\cdot 3 - 1$.\n\nCheck: $\\lfloor 2(0.49) \\rfloor = 0$ and $\\lfloor 2(0.51) \\rfloor = 1$, so the first jump is at $0.5$.\n\n> **Watch out.** The open interval leaves out its right end $x = n$, where $kx = kn$ is also an integer. Counting it gives one too many.",
    "取整函数 $\\lfloor u \\rfloor$ 在 $u$ 到达整数时跳跃 1。所以 $\\lfloor kx \\rfloor$ 在 $kx$ 为整数处跳跃，这发生在 $\\frac{1}{k}$ 的每个倍数处。这样水平压缩图像使跳跃更频繁，$x$ 每一个单位内有 $k$ 次。在区间上计数时要看端点是否包含，因为区间端点处的跳跃不算内部的跳跃。\n\n例如，$\\lfloor 2x \\rfloor$ 在 $(0, 3)$ 上于 $0.5, 1, 1.5, 2, 2.5$ 处跳跃，共五次，即 $2 \\cdot 3 - 1$。\n\n检验：$\\lfloor 2(0.49) \\rfloor = 0$，$\\lfloor 2(0.51) \\rfloor = 1$，所以第一次跳跃在 $0.5$ 处。\n\n> **注意。** 开区间不包含右端点 $x = n$，而那里 $kx = kn$ 也是整数。把它算进去就多了一个。",
  ),
  generate(rng) {
    const k = rng.int(2, 9);
    const n = rng.int(2, 12);
    const answer = k * n - 1;
    const xs = [1 / k - 0.01, 1 / k + 0.01, 2 / k - 0.01, 2 / k + 0.01].map((x) => Math.round(x * 1000) / 1000);
    const rows = valueTable(xs, [["f(x)", (x) => Math.floor(k * x + 1e-9)]]);
    return numberProblem({
      prompt: t(
        `How many jump discontinuities does $f(x) = \\lfloor ${k}x \\rfloor$ have on the open interval $(0, ${n})$?`,
        `$f(x) = \\lfloor ${k}x \\rfloor$ 在开区间 $(0, ${n})$ 上有多少个跳跃间断点？`,
      ),
      answer,
      form: "integer",
      wrong: [answer + 1, answer + 2, n - 1, k - 1],
      solution: walk(
        [
          [
            "Find where the jumps are",
            "找出跳跃的位置",
            `A jump occurs where $${k}x$ is an integer, at $x = \\frac{j}{${k}}$.`,
            `当 $${k}x$ 为整数时发生跳跃，即 $x = \\frac{j}{${k}}$。`,
          ],
          [
            "Count those inside",
            "数出内部的跳跃",
            `Inside the interval, $j$ runs from $1$ to $${k * n - 1}$, because $j = ${k * n}$ gives the excluded end. That makes $${answer}$.`,
            `在区间内部，$j$ 从 $1$ 取到 $${k * n - 1}$，因为 $j = ${k * n}$ 对应被排除的端点。共 $${answer}$ 个。`,
          ],
        ],
        [
          `Count unit by unit. Each of the $${n}$ intervals $(m, m + 1)$ holds $${k - 1}$ jumps, and the $${n - 1}$ whole numbers from $1$ to $${n - 1}$ add one each: $${n} \\cdot ${k - 1} + ${n - 1} = ${answer}$.\n\nThe first two jumps can be seen in the values:\n\n${rows}\n\nThe value steps up by $1$ across $x = \\frac{1}{${k}}$ and again across $x = \\frac{2}{${k}}$.`,
          `逐个单位地数。$${n}$ 个区间 $(m, m + 1)$ 中每个有 $${k - 1}$ 次跳跃，$1$ 到 $${n - 1}$ 这 $${n - 1}$ 个整数处各有一次：$${n} \\cdot ${k - 1} + ${n - 1} = ${answer}$。\n\n从函数值可以看到前两次跳跃：\n\n${rows}\n\n函数值在 $x = \\frac{1}{${k}}$ 两侧增加 $1$，在 $x = \\frac{2}{${k}}$ 两侧又增加 $1$。`,
        ],
      ),
    });
  },
};

const widthFromAverageRate: KnowledgePointDef = {
  id: "the-interval-width-from-an-average-rate",
  title: t("The interval width from an average rate", "由平均变化率求区间宽度"),
  explanation: t(
    "For a quadratic, the difference quotient over $[a, a + h]$ simplifies to an expression that is linear in $h$. After the expansion, $h$ cancels from the denominator, and the terms left show how the average rate depends on the width. This can be used in reverse: given an average rate, solve the linear equation for $h$. As $h$ shrinks to zero, this expression turns into the derivative at $a$.\n\nFor $f(x) = x^{2}$ over $[1, 1 + h]$ the quotient is $2 + h$, so an average rate of $5$ means $h = 3$.\n\nCheck: over $[1, 4]$, $\\frac{16 - 1}{3} = 5$.\n\n> **Watch out.** $h$ is the width of the interval, not its right end: here the interval is $[1, 4]$, but $h = 3$.",
    "对二次函数，$[a, a + h]$ 上的差商化简后是关于 $h$ 的一次式。展开后分母中的 $h$ 被约去，剩下的项表明平均变化率如何依赖于宽度。这可以反过来用：已知平均变化率，解这个一次方程求 $h$。当 $h$ 缩小到零时，这个式子就变成 $a$ 处的导数。\n\n对 $f(x) = x^{2}$ 在 $[1, 1 + h]$ 上，差商是 $2 + h$，所以平均变化率为 $5$ 意味着 $h = 3$。\n\n检验：在 $[1, 4]$ 上，$\\frac{16 - 1}{3} = 5$。\n\n> **注意。** $h$ 是区间的宽度，不是右端点：这里区间是 $[1, 4]$，而 $h = 3$。",
  ),
  generate(rng) {
    const p = rng.int(1, 5);
    const q = rng.int(-9, 9);
    const a = rng.int(-5, 5);
    const h = rng.int(1, 9);
    const rate = p * (2 * a + h) + q;
    const f = poly([p, "x^2"], [q, "x"]);
    const quotient = poly([p, "h"], [2 * a * p + q, ""]);
    const fa = p * a * a + q * a;
    const fb = p * (a + h) ** 2 + q * (a + h);
    return numberProblem({
      prompt: t(
        `The average rate of change of $f(x) = ${f}$ over $[${a}, ${a} + h]$, with $h > 0$, is $${rate}$. Find $h$.`,
        `$f(x) = ${f}$ 在 $[${a}, ${a} + h]$（$h > 0$）上的平均变化率是 $${rate}$。求 $h$。`,
      ),
      answer: h,
      form: "integer",
      wrong: [2 * h, rate - q, h + 2 * a, h + 1, h + 2],
      mistakes: firstMistakes(h, [
        why(a + h, `This is the right end $${a} + h$ of the interval, not its width $h$.`, `这是区间的右端点 $${a} + h$，不是宽度 $h$。`),
        why(p * h, `This is $${p}h$. Divide by $${p}$ to find $h$.`, `这是 $${p}h$。还要除以 $${p}$ 才得到 $h$。`),
      ]),
      solution: walk(
        [
          [
            "Simplify the difference quotient",
            "化简差商",
            `Expand $f(${a} + h)$, subtract $f(${a}) = ${fa}$ and cancel $h$:\n\n$$\\frac{f(${a} + h) - f(${a})}{h} = ${quotient}.$$`,
            `展开 $f(${a} + h)$，减去 $f(${a}) = ${fa}$，再约去 $h$：\n\n$$\\frac{f(${a} + h) - f(${a})}{h} = ${quotient}.$$`,
          ],
          [
            "Solve for $h$",
            "解出 $h$",
            `\n\n$$${quotient} = ${rate} \\quad\\Rightarrow\\quad ${poly([p, "h"])} = ${p * h} \\quad\\Rightarrow\\quad h = ${h}.$$`,
            `\n\n$$${quotient} = ${rate} \\quad\\Rightarrow\\quad ${poly([p, "h"])} = ${p * h} \\quad\\Rightarrow\\quad h = ${h}.$$`,
          ],
        ],
        [
          `Over $[${a}, ${a + h}]$ directly: $\\frac{f(${a + h}) - f(${a})}{${h}} = \\frac{${fb} - ${inParens(fa)}}{${h}} = ${rate}$.`,
          `直接在 $[${a}, ${a + h}]$ 上计算：$\\frac{f(${a + h}) - f(${a})}{${h}} = \\frac{${fb} - ${inParens(fa)}}{${h}} = ${rate}$。`,
        ],
      ),
    });
  },
};

const exponentFromDerivative: KnowledgePointDef = {
  id: "the-exponent-from-a-derivative-value",
  title: t("The exponent from a derivative value", "由导数值求指数"),
  explanation: t(
    "The power rule has the exponent in two places, as a coefficient and in the new exponent, so a value of the derivative is not simply solved for $n$ by algebra. For a positive base greater than 1, however, $nb^{n - 1}$ grows steadily as $n$ grows. So exactly one positive integer can match a given value, and it can be found by trying small values of $n$ in turn until the value is reached.\n\nFor $f(x) = x^{n}$ with $f'(2) = 80$: $n \\cdot 2^{n - 1}$ is $32$ at $n = 4$ and $80$ at $n = 5$, so $n = 5$.\n\nCheck: $\\frac{2.01^{5} - 2^{5}}{0.01} \\approx 80.8$, close to $80$.\n\n> **Watch out.** The power rule lowers the exponent: the derivative at $b$ is $nb^{n - 1}$, not $nb^{n}$. And the answer is $n$ itself, not the exponent $n - 1$ of the derivative.",
    "幂法则中指数出现在两处，既是系数又在新的指数中，所以不能简单地用代数解出 $n$。不过，当底数大于 1 时，$nb^{n - 1}$ 随 $n$ 增大而稳定增长。所以恰好有一个正整数能匹配给定的值，可以依次试较小的 $n$，直到达到这个值。\n\n对 $f(x) = x^{n}$，$f'(2) = 80$：$n \\cdot 2^{n - 1}$ 在 $n = 4$ 时是 $32$，在 $n = 5$ 时是 $80$，所以 $n = 5$。\n\n检验：$\\frac{2.01^{5} - 2^{5}}{0.01} \\approx 80.8$，接近 $80$。\n\n> **注意。** 幂法则会把指数减一：在 $b$ 处的导数是 $nb^{n - 1}$，不是 $nb^{n}$。答案是 $n$ 本身，不是导数的指数 $n - 1$。",
  ),
  generate(rng) {
    const b = rng.int(2, 3);
    const n = rng.int(3, 8);
    const c = rng.int(1, 6);
    const value = c * n * b ** (n - 1);
    const scale = c === 1 ? "" : `${c}`;
    const dq = (h: number) => (c * (b + h) ** n - c * b ** n) / h;
    return numberProblem({
      prompt: t(
        `$f(x) = ${scale}x^n$ for a positive integer $n$, and $f'(${b}) = ${value}$. Find $n$.`,
        `$f(x) = ${scale}x^n$，$n$ 是正整数，且 $f'(${b}) = ${value}$。求 $n$。`,
      ),
      answer: n,
      form: "integer",
      mistakes: firstMistakes(n, [
        why(n - 1, `This is the exponent $n - 1$ of the derivative, not $n$.`, `这是导数的指数 $n - 1$，不是 $n$。`),
        ...[n + 1, n + 2, n - 2].map((k) =>
          why(
            k,
            `At $n = ${k}$, $${c} \\cdot ${k} \\cdot ${b}^{${k - 1}} = ${c * k * b ** (k - 1)}$, not $${value}$.`,
            `当 $n = ${k}$ 时，$${c} \\cdot ${k} \\cdot ${b}^{${k - 1}} = ${c * k * b ** (k - 1)}$，不是 $${value}$。`,
          ),
        ),
      ]),
      solution: walk(
        [
          [
            "Apply the power rule",
            "用幂法则",
            `$f'(x) = ${c} \\cdot nx^{n - 1}$, so $f'(${b}) = ${c} \\cdot n \\cdot ${b}^{n - 1}$, which grows with $n$.`,
            `$f'(x) = ${c} \\cdot nx^{n - 1}$，所以 $f'(${b}) = ${c} \\cdot n \\cdot ${b}^{n - 1}$，它随 $n$ 增大而增大。`,
          ],
          [
            "Try values of $n$",
            "试 $n$ 的值",
            `At $n = ${n - 1}$ it is $${c} \\cdot ${n - 1} \\cdot ${b}^{${n - 2}} = ${c * (n - 1) * b ** (n - 2)}$, too small; at $n = ${n}$ it is $${c} \\cdot ${n} \\cdot ${b}^{${n - 1}} = ${value}$, as required. So $n = ${n}$.`,
            `当 $n = ${n - 1}$ 时，它是 $${c} \\cdot ${n - 1} \\cdot ${b}^{${n - 2}} = ${c * (n - 1) * b ** (n - 2)}$，太小；当 $n = ${n}$ 时，它是 $${c} \\cdot ${n} \\cdot ${b}^{${n - 1}} = ${value}$，符合要求。所以 $n = ${n}$。`,
          ],
        ],
        [
          `Estimate $f'(${b})$ for $f(x) = ${scale}x^{${n}}$ with difference quotients: $h = 0.01$ gives $${num(dq(0.01))}$ and $h = -0.01$ gives $${num(dq(-0.01))}$. Their average, $${num((dq(0.01) + dq(-0.01)) / 2)}$, is close to $${value}$.`,
          `用差商估计 $f(x) = ${scale}x^{${n}}$ 的 $f'(${b})$：$h = 0.01$ 时得 $${num(dq(0.01))}$，$h = -0.01$ 时得 $${num(dq(-0.01))}$。它们的平均值 $${num((dq(0.01) + dq(-0.01)) / 2)}$ 接近 $${value}$。`,
        ],
      ),
    });
  },
};

const highDerivativeOfSineCosineSum: KnowledgePointDef = {
  id: "a-high-derivative-of-a-sine-and-cosine-sum",
  title: t("A high derivative of a sine and cosine sum", "正弦余弦之和的高阶导数"),
  explanation: t(
    "The derivatives of sine and cosine repeat with period 4: $\\sin x$, $\\cos x$, $-\\sin x$, $-\\cos x$, and back to $\\sin x$. So a derivative of high order depends only on the remainder of the order on division by 4. That remainder tells us which of the four forms applies. At $x = 0$, the sine terms vanish, and only the coefficient of the cosine term of that form survives.\n\nFor example, $y = 2\\sin x + 3\\cos x$ has tenth derivative $-2\\sin x - 3\\cos x$, since $10$ leaves remainder $2$. At $x = 0$ it equals $-3$.\n\nCheck: each derivative shifts sine and cosine by a quarter turn, so the tenth derivative is $2\\sin(x + 5\\pi) + 3\\cos(x + 5\\pi)$, which is $-3$ at $x = 0$.\n\n> **Watch out.** A remainder of $0$ means the derivative is $y$ itself. At $x = 0$ read the coefficient of the cosine term, since $\\sin 0 = 0$.",
    "正弦和余弦的导数以 4 为周期重复：$\\sin x$、$\\cos x$、$-\\sin x$、$-\\cos x$，然后回到 $\\sin x$。所以高阶导数只取决于阶数除以 4 的余数。这个余数告诉我们属于四种形式中的哪一种。在 $x = 0$ 处，正弦项为零，只有该形式中余弦项的系数保留下来。\n\n例如 $y = 2\\sin x + 3\\cos x$ 的十阶导数是 $-2\\sin x - 3\\cos x$，因为 $10$ 除以 $4$ 余 $2$。它在 $x = 0$ 处等于 $-3$。\n\n检验：每求一次导，正弦和余弦就平移四分之一周，所以十阶导数是 $2\\sin(x + 5\\pi) + 3\\cos(x + 5\\pi)$，在 $x = 0$ 处为 $-3$。\n\n> **注意。** 余数为 $0$ 时导数就是 $y$ 本身。在 $x = 0$ 处读余弦项的系数，因为 $\\sin 0 = 0$。",
  ),
  generate(rng) {
    const a = nonzero(rng, 9);
    const b = nonzero(rng, 9);
    const n = rng.int(10, 99);
    const remainder = n % 4;
    const forms = [
      poly([a, "\\sin x"], [b, "\\cos x"]),
      poly([a, "\\cos x"], [-b, "\\sin x"]),
      poly([-a, "\\sin x"], [-b, "\\cos x"]),
      poly([-a, "\\cos x"], [b, "\\sin x"]),
    ];
    const answer = [b, a, -b, -a][remainder] ?? 0;
    const [s, c] = (
      [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ] as const
    )[remainder] ?? [0, 1];
    return numberProblem({
      prompt: t(
        `Let $y = ${forms[0]}$. Find the value of $\\frac{d^{${n}}y}{dx^{${n}}}$ at $x = 0$.`,
        `设 $y = ${forms[0]}$。求 $\\frac{d^{${n}}y}{dx^{${n}}}$ 在 $x = 0$ 处的值。`,
      ),
      answer,
      form: "integer",
      wrong: [a, b, -a, -b, 0],
      solution: walk(
        [
          [
            "Find the remainder",
            "求余数",
            `The derivatives repeat with period $4$, and $${n} = 4 \\cdot ${Math.floor(n / 4)} + ${remainder}$, so this derivative is $${forms[remainder]}$.`,
            `导数以 $4$ 为周期重复，而 $${n} = 4 \\cdot ${Math.floor(n / 4)} + ${remainder}$，所以这个导数是 $${forms[remainder]}$。`,
          ],
          [
            "Substitute x = 0",
            "代入 x = 0",
            `With $\\sin 0 = 0$ and $\\cos 0 = 1$, only the cosine coefficient remains: $${answer}$.`,
            `由 $\\sin 0 = 0$，$\\cos 0 = 1$，只剩余弦项的系数：$${answer}$。`,
          ],
        ],
        [
          `Each derivative shifts sine and cosine by a quarter turn, so the derivative of order $${n}$ is $${a}\\sin\\left(x + \\frac{${n}\\pi}{2}\\right) + ${inParens(b)}\\cos\\left(x + \\frac{${n}\\pi}{2}\\right)$.\n\nAt $x = 0$, $\\sin \\frac{${n}\\pi}{2} = ${s}$ and $\\cos \\frac{${n}\\pi}{2} = ${c}$, so the value is $${a} \\cdot ${inParens(s)} + ${inParens(b)} \\cdot ${inParens(c)} = ${answer}$, as before.`,
          `每求一次导，正弦和余弦就平移四分之一周，所以 $${n}$ 阶导数是 $${a}\\sin\\left(x + \\frac{${n}\\pi}{2}\\right) + ${inParens(b)}\\cos\\left(x + \\frac{${n}\\pi}{2}\\right)$。\n\n在 $x = 0$ 处 $\\sin \\frac{${n}\\pi}{2} = ${s}$，$\\cos \\frac{${n}\\pi}{2} = ${c}$，所以值为 $${a} \\cdot ${inParens(s)} + ${inParens(b)} \\cdot ${inParens(c)} = ${answer}$，与前面相同。`,
        ],
      ),
    });
  },
};

const coshSlopeAtHeight: KnowledgePointDef = {
  id: "the-slope-of-a-cosh-curve-at-a-given-height",
  title: t("The slope of a cosh curve at a given height", "cosh 曲线在给定高度处的斜率"),
  explanation: t(
    "The slope of $y = k\\cosh x$ is $k\\sinh x$, and the identity $\\cosh^2 x - \\sinh^2 x = 1$ gives $\\sinh x$ from $\\cosh x$ with no need to find $x$. The identity alone gives only the size of $\\sinh x$. Each value of $\\cosh x$ above 1 occurs twice, at $x$ and at $-x$, with slopes of opposite signs. So the side of the curve must be stated, and $x > 0$ gives a positive $\\sinh x$.\n\nFor example, on $y = 2\\cosh x$ where $\\cosh x = \\frac{5}{3}$ and $x > 0$: $\\sinh x = \\frac{4}{3}$, so the slope is $\\frac{8}{3}$.\n\nCheck: $x = \\ln 3$ has $e^{x} = 3$ and $e^{-x} = \\frac{1}{3}$, so $\\cosh x = \\frac{5}{3}$ and $\\sinh x = \\frac{4}{3}$.\n\n> **Watch out.** The slope is $k\\sinh x$, not $k\\cosh x$. For $x < 0$ the slope would be negative.",
    "$y = k\\cosh x$ 的斜率是 $k\\sinh x$，恒等式 $\\cosh^2 x - \\sinh^2 x = 1$ 由 $\\cosh x$ 给出 $\\sinh x$，不必求出 $x$。恒等式只给出 $\\sinh x$ 的大小。$\\cosh x$ 大于 1 的每个值出现两次，在 $x$ 和 $-x$ 处，斜率符号相反。所以必须说明在曲线的哪一侧，$x > 0$ 时 $\\sinh x$ 为正。\n\n例如在 $y = 2\\cosh x$ 上 $\\cosh x = \\frac{5}{3}$ 且 $x > 0$ 处：$\\sinh x = \\frac{4}{3}$，所以斜率是 $\\frac{8}{3}$。\n\n检验：取 $x = \\ln 3$，$e^{x} = 3$，$e^{-x} = \\frac{1}{3}$，所以 $\\cosh x = \\frac{5}{3}$，$\\sinh x = \\frac{4}{3}$。\n\n> **注意。** 斜率是 $k\\sinh x$，不是 $k\\cosh x$。当 $x < 0$ 时斜率为负。",
  ),
  generate(rng) {
    const [a, b, c] = rng.pick(rightTriangles);
    const k = rng.int(1, 9);
    const answer = Q.of(k * b, a);
    const cosh = Q.of(c, a);
    const exp = Q.of(c + b, a);
    const x0 = Math.log(exp.toNumber());
    const dq = (s: number) => (k * Math.cosh(x0 + s) - k * Math.cosh(x0)) / s;
    const quotients = table(
      ["$h$", "$0.01$", "$-0.01$"],
      [`$\\frac{y(x_{0} + h) - y(x_{0})}{h}$`, `$${num(dq(0.01))}$`, `$${num(dq(-0.01))}$`],
    );
    return numberProblem({
      prompt: t(
        `Find the slope of $y = ${poly([k, "\\cosh x"])}$ at the point with $x > 0$ where $\\cosh x = ${cosh.toLatex()}$.`,
        `求 $y = ${poly([k, "\\cosh x"])}$ 在 $x > 0$ 且 $\\cosh x = ${cosh.toLatex()}$ 的点处的斜率。`,
      ),
      answer,
      wrong: [Q.of(k * c, a), Q.of(-k * b, a), Q.of(k * a, b), Q.of(k * b, c)],
      solution: walk(
        [
          ["Differentiate", "求导", `The slope is $y' = ${poly([k, "\\sinh x"])}$.`, `斜率是 $y' = ${poly([k, "\\sinh x"])}$。`],
          [
            "Find sinh x",
            "求 sinh x",
            `By the identity,\n\n$$\\sinh^2 x = \\cosh^2 x - 1 = \\frac{${b * b}}{${a * a}}.$$\n\nSince $x > 0$, $\\sinh x$ is positive, so $\\sinh x = ${Q.of(b, a).toLatex()}$.`,
            `由恒等式，\n\n$$\\sinh^2 x = \\cosh^2 x - 1 = \\frac{${b * b}}{${a * a}}.$$\n\n因为 $x > 0$，$\\sinh x$ 为正，所以 $\\sinh x = ${Q.of(b, a).toLatex()}$。`,
          ],
          [
            "Multiply",
            "相乘",
            `The slope is $${k} \\cdot ${Q.of(b, a).toLatex()} = ${answer.toLatex()}$.`,
            `斜率是 $${k} \\cdot ${Q.of(b, a).toLatex()} = ${answer.toLatex()}$。`,
          ],
        ],
        [
          `Find the point itself. Since $e^{x} = \\cosh x + \\sinh x$, here $e^{x} = ${exp.toLatex()}$ and $x_{0} = \\ln ${exp.toLatex()} \\approx ${num(x0)}$. Difference quotients of $y$ there:\n\n${quotients}\n\nTheir average is $${num((dq(0.01) + dq(-0.01)) / 2)}$, close to $${answer.toLatex()}${approx(answer)}$.`,
          `求出这个点本身。因为 $e^{x} = \\cosh x + \\sinh x$，这里 $e^{x} = ${exp.toLatex()}$，$x_{0} = \\ln ${exp.toLatex()} \\approx ${num(x0)}$。$y$ 在那里的差商：\n\n${quotients}\n\n它们的平均值是 $${num((dq(0.01) + dq(-0.01)) / 2)}$，接近 $${answer.toLatex()}${approx(answer)}$。`,
        ],
      ),
    });
  },
};

const squaresOfSecantAndTangent: KnowledgePointDef = {
  id: "a-sum-of-squares-of-secant-and-tangent",
  figure: calculusDrawings2["differentiating-reciprocal-trigonometric-functions#a-sum-of-squares-of-secant-and-tangent"],
  title: t("A sum of squares of secant and tangent", "正割与正切的平方之和"),
  explanation: t(
    "By the chain rule, the derivative of $\\sec^2 x$ is $2\\sec x \\cdot \\sec x\\tan x$, and the derivative of $\\tan^2 x$ is $2\\tan x \\cdot \\sec^2 x$. These are the same expression, $2\\sec^2 x\\tan x$, which reflects the identity $\\sec^2 x = 1 + \\tan^2 x$: the two functions differ only by a constant. So a combination of them has a derivative that depends only on the sum of the two coefficients.\n\nFor example, $y = 3\\sec^2 x + 2\\tan^2 x$ has $y' = 10\\sec^2 x\\tan x$, which is $20$ at $x = \\frac{\\pi}{4}$.\n\nCheck: by the identity $y = 3 + 5\\tan^2 x$, and its derivative is $5 \\cdot 2\\tan x\\sec^2 x$, the same.\n\n> **Watch out.** At $x = \\frac{3\\pi}{4}$, $\\tan x = -1$, so the sign changes. $\\sec^2 x = 2$ at both points.",
    "由链式法则，$\\sec^2 x$ 的导数是 $2\\sec x \\cdot \\sec x\\tan x$，$\\tan^2 x$ 的导数是 $2\\tan x \\cdot \\sec^2 x$。它们是同一个式子 $2\\sec^2 x\\tan x$，这反映了恒等式 $\\sec^2 x = 1 + \\tan^2 x$：两个函数只差一个常数。所以它们的组合的导数只取决于两个系数之和。\n\n例如 $y = 3\\sec^2 x + 2\\tan^2 x$ 有 $y' = 10\\sec^2 x\\tan x$，在 $x = \\frac{\\pi}{4}$ 处为 $20$。\n\n检验：由恒等式 $y = 3 + 5\\tan^2 x$，其导数是 $5 \\cdot 2\\tan x\\sec^2 x$，相同。\n\n> **注意。** 在 $x = \\frac{3\\pi}{4}$ 处 $\\tan x = -1$，符号改变。两个点处都有 $\\sec^2 x = 2$。",
  ),
  generate(rng) {
    const a = rng.int(1, 9);
    const b = nonzero(rng, 9);
    const first = rng.pick([true, false]);
    const sum = a + b;
    const answer = (first ? 4 : -4) * sum;
    const point = first ? "\\frac{\\pi}{4}" : "\\frac{3\\pi}{4}";
    const x0 = first ? Math.PI / 4 : (3 * Math.PI) / 4;
    const y = (x: number) => a / Math.cos(x) ** 2 + b * Math.tan(x) ** 2;
    const dq = (s: number) => (y(x0 + s) - y(x0)) / s;
    const quotients = table(
      ["$h$", "$0.01$", "$-0.01$"],
      [`$\\frac{y\\left(${point} + h\\right) - y\\left(${point}\\right)}{h}$`, `$${num(dq(0.01))}$`, `$${num(dq(-0.01))}$`],
    );
    return numberProblem({
      prompt: t(
        `Let $y = ${poly([a, "\\sec^2 x"], [b, "\\tan^2 x"])}$. Find $y'$ at $x = ${point}$.`,
        `设 $y = ${poly([a, "\\sec^2 x"], [b, "\\tan^2 x"])}$。求 $y'$ 在 $x = ${point}$ 处的值。`,
      ),
      answer,
      form: "integer",
      wrong: [-answer, 2 * sum, 4 * a, 4 * b],
      solution: walk(
        [
          [
            "Differentiate",
            "求导",
            `Both terms have derivatives of the form $2\\sec^2 x\\tan x$, so $y' = ${poly([2 * sum, "\\sec^2 x\\tan x"])}$.`,
            `两项的导数都是 $2\\sec^2 x\\tan x$ 的倍数，所以 $y' = ${poly([2 * sum, "\\sec^2 x\\tan x"])}$。`,
          ],
          [
            "Substitute the point",
            "代入该点",
            `At $x = ${point}$, $\\sec^2 x = 2$ and $\\tan x = ${first ? 1 : -1}$, so $y' = ${2 * sum} \\cdot 2 \\cdot ${first ? 1 : "(-1)"} = ${answer}$.`,
            `在 $x = ${point}$ 处 $\\sec^2 x = 2$，$\\tan x = ${first ? 1 : -1}$，所以 $y' = ${2 * sum} \\cdot 2 \\cdot ${first ? 1 : "(-1)"} = ${answer}$。`,
          ],
        ],
        [
          `Compute difference quotients of $y$ at $x = ${point}$, with $h = 0.01$ on each side:\n\n${quotients}\n\nTheir average is $${num((dq(0.01) + dq(-0.01)) / 2)}$, close to $${answer}$.`,
          `计算 $y$ 在 $x = ${point}$ 处的差商，两侧各取 $h = 0.01$：\n\n${quotients}\n\n它们的平均值是 $${num((dq(0.01) + dq(-0.01)) / 2)}$，接近 $${answer}$。`,
        ],
      ),
    });
  },
};

const secondDerivativeOfProduct: KnowledgePointDef = {
  id: "a-second-derivative-of-a-product-from-values",
  title: t("A second derivative of a product from values", "由函数值求积的二阶导数"),
  explanation: t(
    "Applying the product rule twice gives $(fg)'' = f''g + 2f'g' + fg''$, a pattern with the same coefficients as $(a + b)^2$. The middle term has a coefficient of 2, because it arises once from each of the two terms of the first derivative. Given a table of values at a point, the formula needs nothing else, so the functions themselves need not be known.\n\nFor example, if $f = 1$, $f' = 2$, $f'' = 3$, $g = 4$, $g' = 5$ and $g'' = 6$ at a point, then $(fg)'' = 12 + 20 + 6 = 38$ there.\n\nCheck: with $f = g = x$, the formula gives $0 + 2 \\cdot 1 \\cdot 1 + 0 = 2$, and indeed $(x^{2})'' = 2$.\n\n> **Watch out.** Taking the product of the second derivatives is a common mistake, and so is forgetting the $2$ in the middle term.",
    "用两次积法则，得 $(fg)'' = f''g + 2f'g' + fg''$，系数规律与 $(a + b)^2$ 相同。中间项系数为 2，因为它从一阶导数的两项各产生一次。给出一点处的数值表，这个公式就不需要别的了，所以不必知道函数本身。\n\n例如，若在某点 $f = 1$，$f' = 2$，$f'' = 3$，$g = 4$，$g' = 5$，$g'' = 6$，则那里 $(fg)'' = 12 + 20 + 6 = 38$。\n\n检验：取 $f = g = x$，公式给出 $0 + 2 \\cdot 1 \\cdot 1 + 0 = 2$，而 $(x^{2})'' = 2$。\n\n> **注意。** 把二阶导数直接相乘是常见的错误，忘记中间项的 $2$ 也是。",
  ),
  generate(rng) {
    const c = rng.int(0, 5);
    const f0 = nonzero(rng, 5);
    const f1 = nonzero(rng, 5);
    const f2 = nonzero(rng, 5);
    const g0 = nonzero(rng, 5);
    const g1 = nonzero(rng, 5);
    const g2 = nonzero(rng, 5);
    const answer = f2 * g0 + 2 * f1 * g1 + f0 * g2;
    const values = `f(${c}) = ${f0}, \\; f'(${c}) = ${f1}, \\; f''(${c}) = ${f2}, \\; g(${c}) = ${g0}, \\; g'(${c}) = ${g1}, \\; g''(${c}) = ${g2}`;
    const P = (s: number) => (f0 + f1 * s + (f2 * s * s) / 2) * (g0 + g1 * s + (g2 * s * s) / 2);
    const d2 = (s: number) => (P(s) - 2 * P(0) + P(-s)) / (s * s);
    const differences = table(
      ["$s$", "$0.1$", "$0.01$"],
      [`$\\frac{P(${c} + s) - 2P(${c}) + P(${c} - s)}{s^{2}}$`, `$${num(d2(0.1))}$`, `$${num(d2(0.01))}$`],
    );
    return numberProblem({
      prompt: t(`$${values}$. Let $h = fg$. Find $h''(${c})$.`, `$${values}$。设 $h = fg$。求 $h''(${c})$。`),
      answer,
      form: "integer",
      wrong: [f2 * g0 + f0 * g2, f2 * g2, f2 * g0 + f1 * g1 + f0 * g2, f1 * g1],
      solution: walk(
        [
          [
            "Write the formula",
            "写出公式",
            "Applying the product rule twice gives $h'' = f''g + 2f'g' + fg''$.",
            "用两次乘积法则，得 $h'' = f''g + 2f'g' + fg''$。",
          ],
          [
            "Substitute the values",
            "代入数值",
            `At $x = ${c}$,\n\n$$h''(${c}) = ${f2} \\cdot ${inParens(g0)} + 2 \\cdot ${inParens(f1)} \\cdot ${inParens(g1)} + ${inParens(f0)} \\cdot ${inParens(g2)} = ${answer}.$$`,
            `在 $x = ${c}$ 处，\n\n$$h''(${c}) = ${f2} \\cdot ${inParens(g0)} + 2 \\cdot ${inParens(f1)} \\cdot ${inParens(g1)} + ${inParens(f0)} \\cdot ${inParens(g2)} = ${answer}.$$`,
          ],
        ],
        [
          `Replace $f$ and $g$ by quadratics with the same values and first two derivatives at $x = ${c}$, such as $${f0} + ${inParens(f1)}(x - ${c}) + \\frac{${f2}}{2}(x - ${c})^{2}$ for $f$. Their product $P$ has the same second derivative there, and its second differences are\n\n${differences}\n\nThese approach $${answer}$.`,
          `把 $f$、$g$ 换成在 $x = ${c}$ 处值和前两阶导数都相同的二次函数，例如 $f$ 换成 $${f0} + ${inParens(f1)}(x - ${c}) + \\frac{${f2}}{2}(x - ${c})^{2}$。它们的积 $P$ 在那里有相同的二阶导数，其二阶差分为\n\n${differences}\n\n这些值逼近 $${answer}$。`,
        ],
      ),
    });
  },
};

const chainRuleOfThree: KnowledgePointDef = {
  id: "the-chain-rule-for-three-functions-from-values",
  title: t("The chain rule for three functions from values", "由函数值用链式法则求三层复合的导数"),
  explanation: t(
    "For $y = f(g(h(x)))$, the chain rule gives three factors: $f'(g(h(x)))$, $g'(h(x))$ and $h'(x)$. Each derivative is taken at a different point, namely at whatever is fed into that function. So working from the inside out, $h$ first turns the input into a value for $g$, and $g$ then turns that into a value for $f$. Evaluating every derivative at the original $x$ is the common mistake.\n\nFor example, if $h(1) = 2$, $h'(1) = 3$, $g(2) = 5$, $g'(2) = -1$ and $f'(5) = 4$, then $y'(1) = f'(5)g'(2)h'(1) = 4 \\cdot (-1) \\cdot 3 = -12$.\n\nCheck: $h(x) = 3x - 1$, $g(x) = 7 - x$ and $f(x) = 4x$ have these values, and $f(g(h(x))) = 4(8 - 3x) = 32 - 12x$, whose slope is $-12$.\n\n> **Watch out.** Read $g'$ at $h(a)$ and $f'$ at $g(h(a))$. The values given at the other points are there to tempt you.",
    "对 $y = f(g(h(x)))$，链式法则给出三个因子：$f'(g(h(x)))$、$g'(h(x))$ 和 $h'(x)$。每个导数在不同的点取值，也就是输入该函数的那个值。所以从内向外计算，先由 $h$ 把输入变成 $g$ 的输入值，再由 $g$ 把它变成 $f$ 的输入值。把每个导数都在原来的 $x$ 处取值是常见的错误。\n\n例如，若 $h(1) = 2$，$h'(1) = 3$，$g(2) = 5$，$g'(2) = -1$，$f'(5) = 4$，则 $y'(1) = f'(5)g'(2)h'(1) = 4 \\cdot (-1) \\cdot 3 = -12$。\n\n检验：$h(x) = 3x - 1$，$g(x) = 7 - x$，$f(x) = 4x$ 符合这些值，而 $f(g(h(x))) = 4(8 - 3x) = 32 - 12x$，斜率是 $-12$。\n\n> **注意。** $g'$ 要在 $h(a)$ 处读，$f'$ 要在 $g(h(a))$ 处读。题中给出的其他点的值是用来干扰的。",
  ),
  generate(rng) {
    const a = rng.int(1, 3);
    const b = a + rng.int(1, 3);
    const c = b + rng.int(1, 3);
    const p = nonzero(rng, 6);
    const q = nonzero(rng, 6);
    const r = nonzero(rng, 6);
    const decoyG = nonzero(rng, 6);
    const decoyF = nonzero(rng, 6);
    const answer = r * q * p;
    const values = `h(${a}) = ${b}, \\; h'(${a}) = ${p}, \\; g(${b}) = ${c}, \\; g'(${b}) = ${q}, \\; g'(${a}) = ${decoyG}, \\; f'(${c}) = ${r}, \\; f'(${b}) = ${decoyF}`;
    const step = (v: number) => num(v * 0.01);
    return numberProblem({
      prompt: t(`$${values}$. Let $y = f(g(h(x)))$. Find $y'(${a})$.`, `$${values}$。设 $y = f(g(h(x)))$。求 $y'(${a})$。`),
      answer,
      form: "integer",
      mistakes: firstMistakes(answer, [
        why(
          decoyF * decoyG * p,
          `This reads $g'$ at $${a}$ and $f'$ at $${b}$. Each derivative belongs at its own input: $g'$ at $${b}$, $f'$ at $${c}$.`,
          `这是在 $${a}$ 处读 $g'$、在 $${b}$ 处读 $f'$。每个导数要在它自己的输入处读：$g'$ 在 $${b}$，$f'$ 在 $${c}$。`,
        ),
        why(
          r * decoyG * p,
          `This reads $g'$ at $${a}$. The input of $g$ is $h(${a}) = ${b}$.`,
          `这是在 $${a}$ 处读的 $g'$。$g$ 的输入是 $h(${a}) = ${b}$。`,
        ),
        why(
          decoyF * q * p,
          `This reads $f'$ at $${b}$. The input of $f$ is $g(${b}) = ${c}$.`,
          `这是在 $${b}$ 处读的 $f'$。$f$ 的输入是 $g(${b}) = ${c}$。`,
        ),
        why(r * q, `This leaves out the innermost factor $h'(${a}) = ${p}$.`, `这漏掉了最内层的因子 $h'(${a}) = ${p}$。`),
      ]),
      solution: walk(
        [
          [
            "Follow the inputs from the inside",
            "由内向外跟踪输入",
            `$h(${a}) = ${b}$ is the input of $g$, and $g(${b}) = ${c}$ is the input of $f$.`,
            `$h(${a}) = ${b}$ 是 $g$ 的输入，$g(${b}) = ${c}$ 是 $f$ 的输入。`,
          ],
          [
            "Read each derivative at its own input",
            "在各自的输入处读导数",
            `$h'(${a}) = ${p}$, $g'(${b}) = ${q}$ and $f'(${c}) = ${r}$.`,
            `$h'(${a}) = ${p}$，$g'(${b}) = ${q}$，$f'(${c}) = ${r}$。`,
          ],
          [
            "Multiply",
            "相乘",
            `$y'(${a}) = f'(${c})g'(${b})h'(${a}) = ${r} \\cdot ${inParens(q)} \\cdot ${inParens(p)} = ${answer}$.`,
            `$y'(${a}) = f'(${c})g'(${b})h'(${a}) = ${r} \\cdot ${inParens(q)} \\cdot ${inParens(p)} = ${answer}$。`,
          ],
        ],
        [
          `Follow a small step. When $x$ moves from $${a}$ by $0.01$, $h$ moves by about $${step(p)}$; then $g$ moves by about $${q}$ times that, $${step(p * q)}$; then $f$ moves by about $${r}$ times that, $${step(answer)}$. Dividing by $0.01$ gives $${answer}$ again.`,
          `跟着一小步走。当 $x$ 从 $${a}$ 移动 $0.01$ 时，$h$ 大约移动 $${step(p)}$；$g$ 大约移动它的 $${q}$ 倍，即 $${step(p * q)}$；$f$ 再大约移动它的 $${r}$ 倍，即 $${step(answer)}$。除以 $0.01$，又得到 $${answer}$。`,
        ],
      ),
    });
  },
};

const secondDerivativeOfInverse: KnowledgePointDef = {
  id: "the-second-derivative-of-an-inverse-function",
  figure: calculusDrawings2["differentiating-an-inverse-function-at-a-point#the-second-derivative-of-an-inverse-function"],
  title: t("The second derivative of an inverse function", "反函数的二阶导数"),
  explanation: t(
    "If $g$ is the inverse of $f$, then $g'(y)$ is the reciprocal of $f'(g(y))$. Differentiating once more by the chain rule, and replacing $g'$, gives\n\n$$g''(y) = -\\frac{f''(g(y))\\,g'(y)}{f'(g(y))^{2}} = -\\frac{f''(g(y))}{f'(g(y))^{3}}.$$\n\nThe cube in the denominator comes from the extra factor of $g'$. The sign shows that reflecting a graph in $y = x$ reverses its concavity when $f$ is increasing. For example, if $f(1) = 3$, $f'(1) = 2$ and $f''(1) = 4$, then $g''(3)$ is $-\\frac{4}{8}$, which is $-\\frac{1}{2}$.\n\nCheck: near $t = 1$, $f(t) \\approx 3 + 2(t - 1) + 2(t - 1)^{2}$. Solving this for $t - 1$ gives about $0.004975$ at $y = 3.01$ and $-0.005025$ at $y = 2.99$, so the second difference of $g$ with step $0.01$ is about $-0.5$.\n\n> **Watch out.** Evaluate $f'$ and $f''$ at $g(y)$, here $1$, not at $y = 3$. And the power is $3$, not $2$.",
    "如果 $g$ 是 $f$ 的反函数，那么 $g'(y)$ 是 $f'(g(y))$ 的倒数。用链式法则再求一次导，并代入 $g'$，得\n\n$$g''(y) = -\\frac{f''(g(y))\\,g'(y)}{f'(g(y))^{2}} = -\\frac{f''(g(y))}{f'(g(y))^{3}}.$$\n\n分母中的立方来自多出的因子 $g'$。这个符号说明，当 $f$ 递增时，关于 $y = x$ 反射图像会使凹凸性反转。例如，若 $f(1) = 3$，$f'(1) = 2$，$f''(1) = 4$，则 $g''(3)$ 等于 $-\\frac{4}{8}$，即 $-\\frac{1}{2}$。\n\n检验：在 $t = 1$ 附近，$f(t) \\approx 3 + 2(t - 1) + 2(t - 1)^{2}$。由此解出 $t - 1$，在 $y = 3.01$ 处约为 $0.004975$，在 $y = 2.99$ 处约为 $-0.005025$，所以 $g$ 以步长 $0.01$ 的二阶差分约为 $-0.5$。\n\n> **注意。** $f'$ 和 $f''$ 要在 $g(y)$ 处取值，这里是 $1$，而不是 $y = 3$。并且幂是 $3$，不是 $2$。",
  ),
  generate(rng) {
    const a = rng.int(-4, 4);
    const b = different(rng, -6, 6, a);
    const p = nonzero(rng, 4);
    const q = nonzero(rng, 9);
    const answer = Q.of(-q, p ** 3);
    // Near t = a, f(t) ≈ b + p(t − a) + (q/2)(t − a)², whose inverse moves t − a by 2u/(p + sign(p)·√(p² + 2qu)) when y = b + u.
    const shift = (u: number) => (2 * u) / (p + Math.sign(p) * Math.sqrt(p * p + 2 * q * u));
    const difference = (shift(0.001) + shift(-0.001)) / 0.000001;
    const sig = (v: number) => String(Number(v.toPrecision(4)));
    const shiftT = a === 0 ? "t" : a < 0 ? `t + ${-a}` : `t - ${a}`;
    return numberProblem({
      prompt: t(
        `$f$ is invertible with inverse $g$, and $f(${a}) = ${b}$, $f'(${a}) = ${p}$, $f''(${a}) = ${q}$. Find $g''(${b})$.`,
        `$f$ 可逆，反函数为 $g$，且 $f(${a}) = ${b}$，$f'(${a}) = ${p}$，$f''(${a}) = ${q}$。求 $g''(${b})$。`,
      ),
      answer,
      wrong: [Q.of(q, p ** 3), Q.of(-q, p * p), Q.of(1, q), Q.of(-q, p)],
      solution: walk(
        [
          [
            "Find the point for f",
            "找出 f 的取值点",
            `Since $f(${a}) = ${b}$, $g(${b}) = ${a}$, so $f'$ and $f''$ are needed at $${a}$: they are $${p}$ and $${q}$.`,
            `由于 $f(${a}) = ${b}$，所以 $g(${b}) = ${a}$，因此要用 $f'$ 和 $f''$ 在 $${a}$ 处的值：$${p}$ 和 $${q}$。`,
          ],
          [
            "Use the second derivative formula",
            "用二阶导数公式",
            `Differentiating the reciprocal of $f'(g(y))$ gives\n\n$$g''(${b}) = -\\frac{f''(${a})}{f'(${a})^{3}} = -\\frac{${q}}{${inParens(p)}^{3}} = ${answer.toLatex()}.$$`,
            `对 $f'(g(y))$ 的倒数求导，得\n\n$$g''(${b}) = -\\frac{f''(${a})}{f'(${a})^{3}} = -\\frac{${q}}{${inParens(p)}^{3}} = ${answer.toLatex()}.$$`,
          ],
        ],
        [
          `Near $t = ${a}$, $f$ behaves like the quadratic $${b} + ${inParens(p)}(${shiftT}) + ${inParens(q)} \\cdot \\frac{(${shiftT})^{2}}{2}$. Solving it for $t$ at $y = ${num(b - 0.001)}$, $${b}$ and $${num(b + 0.001)}$ and taking the second difference with step $0.001$ gives about $${sig(difference)}$, which agrees with $${answer.toLatex()} \\approx ${sig(answer.toNumber())}$.`,
          `在 $t = ${a}$ 附近，$f$ 近似于二次函数 $${b} + ${inParens(p)}(${shiftT}) + ${inParens(q)} \\cdot \\frac{(${shiftT})^{2}}{2}$。由它解出 $y = ${num(b - 0.001)}$、$${b}$ 和 $${num(b + 0.001)}$ 处的 $t$，取步长 $0.001$ 的二阶差分，约为 $${sig(difference)}$，与 $${answer.toLatex()} \\approx ${sig(answer.toNumber())}$ 相符。`,
        ],
      ),
    });
  },
};

const variablePowerAtOne: KnowledgePointDef = {
  id: "a-variable-power-at-x-equals-one",
  title: t("A variable power at x equals one", "变量幂在 x 等于 1 处的导数"),
  explanation: t(
    "A function such as $x^{g(x)}$ has its variable in both the base and the exponent, so neither the power rule nor the exponential rule applies on its own. Taking logarithms first gives $\\ln y = g(x)\\ln x$, and differentiating by the product rule gives\n\n$$\\frac{y'}{y} = g'(x)\\ln x + \\frac{g(x)}{x}.$$\n\nAt $x = 1$, the logarithm vanishes and $y = 1$, so $y'(1)$ is just $g(1)$. For example, $y = x^{2x^{2} + 3}$ has $y'(1) = 2 + 3 = 5$.\n\nCheck: the difference quotients of $x^{2x^{2} + 3}$ at $1$ with $h = 0.01$ and $h = -0.01$ are about $5.143$ and $4.863$, on either side of $5$.\n\n> **Watch out.** Treating the exponent as a constant gives $g(1) \\cdot 1^{g(1) - 1}$, which happens to match here only because $\\ln 1 = 0$. At any other point the term $g'(x)\\ln x$ matters.",
    "像 $x^{g(x)}$ 这样的函数，变量同时在底数和指数中，所以幂法则和指数法则都不能单独使用。先取对数，得 $\\ln y = g(x)\\ln x$，再用积法则求导，得\n\n$$\\frac{y'}{y} = g'(x)\\ln x + \\frac{g(x)}{x}.$$\n\n在 $x = 1$ 处，对数为零且 $y = 1$，所以 $y'(1)$ 就是 $g(1)$。例如 $y = x^{2x^{2} + 3}$ 有 $y'(1) = 2 + 3 = 5$。\n\n检验：$x^{2x^{2} + 3}$ 在 $1$ 处取 $h = 0.01$ 和 $h = -0.01$ 的差商约为 $5.143$ 和 $4.863$，位于 $5$ 的两侧。\n\n> **注意。** 把指数当成常数会得到 $g(1) \\cdot 1^{g(1) - 1}$，它在这里恰好相符，只是因为 $\\ln 1 = 0$。在其他点处，$g'(x)\\ln x$ 这一项不能忽略。",
  ),
  generate(rng) {
    const k = rng.int(1, 9);
    const m = nonzero(rng, 9);
    const answer = k + m;
    const exponent = poly([k, "x^2"], [m, ""]);
    const Y = (x: number) => x ** (k * x * x + m);
    const quotient = (Y(1.001) - Y(0.999)) / 0.002;
    return numberProblem({
      prompt: t(`Let $y = x^{${exponent}}$ for $x > 0$. Find $y'(1)$.`, `设 $y = x^{${exponent}}$，$x > 0$。求 $y'(1)$。`),
      answer,
      form: "integer",
      wrong: [2 * k + m, k, m, 2 * k],
      solution: walk(
        [
          [
            "Take logarithms and differentiate",
            "取对数并求导",
            `From $\\ln y = (${exponent})\\ln x$, the product rule gives\n\n$$\\frac{y'}{y} = ${poly([2 * k, "x"])}\\ln x + \\frac{${exponent}}{x}.$$`,
            `由 $\\ln y = (${exponent})\\ln x$，用积法则得\n\n$$\\frac{y'}{y} = ${poly([2 * k, "x"])}\\ln x + \\frac{${exponent}}{x}.$$`,
          ],
          [
            "Evaluate at x = 1",
            "在 x = 1 处取值",
            `At $x = 1$, $y = 1$ and $\\ln 1 = 0$, so $y'(1) = ${k} + ${inParens(m)} = ${answer}$.`,
            `在 $x = 1$ 处，$y = 1$ 且 $\\ln 1 = 0$，所以 $y'(1) = ${k} + ${inParens(m)} = ${answer}$。`,
          ],
        ],
        [
          `The difference quotient of $y$ from $x = 0.999$ to $x = 1.001$ is about $${num(quotient)}$, close to $${answer}$.`,
          `$y$ 从 $x = 0.999$ 到 $x = 1.001$ 的差商约为 $${num(quotient)}$，接近 $${answer}$。`,
        ],
      ),
    });
  },
};

const boatOnARope: KnowledgePointDef = {
  id: "a-boat-pulled-by-a-rope",
  figure: calculusDrawings2["calculating-related-rates-using-the-pythagorean-theorem#a-boat-pulled-by-a-rope"],
  title: t("A boat pulled by a rope", "用绳子拉船"),
  explanation: t(
    "A boat pulled toward a dock by a rope through a raised pulley forms a right triangle with a fixed height, a shrinking base and a shrinking rope. Differentiating $x^2 + h^2 = s^2$ removes the constant height and gives $x\\frac{dx}{dt} = s\\frac{ds}{dt}$. Since the rope is longer than the base, the boat moves faster than the rope is pulled. The closer the boat comes to the dock, the larger this speed becomes.\n\nFor example, with the pulley $3$ m up and $5$ m of rope out, the boat is $4$ m away. Pulling in at $2$ m/s gives $4\\frac{dx}{dt} = 5(-2)$, so the boat moves at $2.5$ m/s.\n\nCheck: $0.001$ s later the rope is $4.998$ m and the boat $\\sqrt{4.998^{2} - 9} \\approx 3.9975$ m away, $0.0025$ m closer, that is $2.5$ m/s.\n\n> **Watch out.** Find the horizontal distance first, and divide by it, not by the height. The rope shortens, so $\\frac{ds}{dt}$ is negative.",
    "用穿过高处滑轮的绳子把船拉向码头，构成一个直角三角形：高固定，底边缩短，绳子也缩短。对 $x^2 + h^2 = s^2$ 求导，常数高消失，得 $x\\frac{dx}{dt} = s\\frac{ds}{dt}$。由于绳子比底边长，船的速度大于拉绳的速度。船越靠近码头，这个速度就越大。\n\n例如滑轮高 $3$ m，绳子放出 $5$ m，船离码头 $4$ m。以 $2$ m/s 拉绳时，$4\\frac{dx}{dt} = 5(-2)$，所以船以 $2.5$ m/s 运动。\n\n检验：$0.001$ s 后绳长 $4.998$ m，船离码头 $\\sqrt{4.998^{2} - 9} \\approx 3.9975$ m，靠近了 $0.0025$ m，即 $2.5$ m/s。\n\n> **注意。** 先求出水平距离，并除以它，不是除以高度。绳子在缩短，所以 $\\frac{ds}{dt}$ 为负。",
  ),
  generate(rng) {
    const [h, x, s] = rng.pick(rightTriangles);
    const r = rng.int(1, 6);
    const answer = Q.of(s * r, x);
    const e = 0.001;
    const x1 = Math.sqrt((s - e * r) ** 2 - h * h);
    return numberProblem({
      prompt: t(
        `A rope runs from a boat to a pulley $${h}$ m above the level of the boat. The rope is pulled in at $${r}$ m/s. How fast, in m/s, is the boat moving horizontally when $${s}$ m of rope is out?`,
        `一根绳子从船连到比船高 $${h}$ 米的滑轮。绳子以每秒 $${r}$ 米的速度被拉进。当绳子放出 $${s}$ 米时，船的水平速度是每秒多少米？`,
      ),
      answer,
      mistakes: distinctWhys([
        why(
          r,
          "This is the speed of the rope. The boat moves faster, because the rope is longer than the horizontal distance.",
          "这是拉绳的速度。船移动得更快，因为绳子比水平距离长。",
        ),
        why(
          Q.of(x * r, s),
          "This has the ratio upside down: the boat's speed is $\\frac{s}{x}$ times the rope's.",
          "比例弄反了：船速是绳速的 $\\frac{s}{x}$ 倍。",
        ),
        why(Q.of(h * r, x), `This uses the height $${h}$ in place of the length of rope $${s}$.`, `这用高度 $${h}$ 代替了绳长 $${s}$。`),
        why(
          Q.of(s * r, h),
          `This divides by the height $${h}$ instead of the horizontal distance $${x}$.`,
          `这是除以高度 $${h}$，而应该除以水平距离 $${x}$。`,
        ),
      ]),
      solution: walk(
        [
          [
            "Find the horizontal distance",
            "求水平距离",
            `$x = \\sqrt{${s * s} - ${h * h}} = ${x}$.`,
            `$x = \\sqrt{${s * s} - ${h * h}} = ${x}$。`,
          ],
          [
            "Differentiate and substitute",
            "求导并代入",
            `From $x\\frac{dx}{dt} = s\\frac{ds}{dt}$ with $\\frac{ds}{dt} = -${r}$: $${x}\\frac{dx}{dt} = ${s}(-${r})$, so $\\frac{dx}{dt} = ${answer.neg().toLatex()}$ and the boat moves at $${answer.toLatex()}$ m/s.`,
            `由 $x\\frac{dx}{dt} = s\\frac{ds}{dt}$，$\\frac{ds}{dt} = -${r}$：$${x}\\frac{dx}{dt} = ${s}(-${r})$，所以 $\\frac{dx}{dt} = ${answer.neg().toLatex()}$，船速是 $${answer.toLatex()}$ m/s。`,
          ],
        ],
        [
          `$0.001$ s later the rope is $${num(s - e * r)}$ m and the boat $\\sqrt{${num(s - e * r)}^{2} - ${h * h}} \\approx ${x1.toFixed(5)}$ m away, about $${(x - x1).toFixed(5)}$ m closer, that is about $${num((x - x1) / e)}$ m/s, close to $${answer.toLatex()}${approx(answer)}$.`,
          `$0.001$ s 后绳长 $${num(s - e * r)}$ m，船离码头 $\\sqrt{${num(s - e * r)}^{2} - ${h * h}} \\approx ${x1.toFixed(5)}$ m，约靠近了 $${(x - x1).toFixed(5)}$ m，即约 $${num((x - x1) / e)}$ m/s，接近 $${answer.toLatex()}${approx(answer)}$。`,
        ],
      ),
    });
  },
};

const concaveDownLength: KnowledgePointDef = {
  id: "the-length-of-an-interval-where-a-quartic-is-concave-down",
  title: t("The length of an interval where a quartic is concave down", "四次函数下凹区间的长度"),
  explanation: t(
    "The sign of the second derivative decides the concavity. For a quartic with a positive leading coefficient, $y''$ is a quadratic that opens upward. If this quadratic has two real roots, then it is negative only between them, and so the curve is concave down on exactly that bounded interval. Outside the interval, the curve is concave up. Each of the two roots is an inflection point, because the sign changes there. For $y = x^4 - 4x^3$, $y'' = 12x^2 - 24x = 12x(x - 2)$, so the curve is concave down on $(0, 2)$, of length $2$.\n\nCheck: $y''(1) = -12 < 0$ inside the interval, and $y''(3) = 36 > 0$ outside it.\n\n> **Watch out.** The length is the distance between the roots, $s - r$, not their sum or their product.",
    "二阶导数的符号决定凹凸性。对首项系数为正的四次函数，$y''$ 是开口向上的二次式。如果这个二次式有两个实根，那么它只在两根之间为负，所以曲线恰好在这个有界区间上下凹。在区间之外，曲线上凹。两个根都是拐点，因为符号在那里改变。对 $y = x^4 - 4x^3$，$y'' = 12x^2 - 24x = 12x(x - 2)$，所以曲线在 $(0, 2)$ 上下凹，长度为 $2$。\n\n检验：在区间内 $y''(1) = -12 < 0$，在区间外 $y''(3) = 36 > 0$。\n\n> **注意。** 长度是两根之间的距离 $s - r$，不是它们的和或积。",
  ),
  generate(rng) {
    const r = rng.int(-6, 5);
    const s = r + rng.int(1, 8);
    const answer = s - r;
    const y = poly([1, "x^4"], [-2 * (r + s), "x^3"], [6 * r * s, "x^2"]);
    const second = poly([12, "x^2"], [-12 * (r + s), "x"], [12 * r * s, ""]);
    const factor = (v: number) => (v === 0 ? "x" : `(${poly([1, "x"], [-v, ""])})`);
    const y2 = (x: number) => 12 * (x - r) * (x - s);
    const mid = (r + s) / 2;
    return numberProblem({
      prompt: t(
        `The curve $y = ${y}$ is concave down on one bounded interval. Find the length of this interval.`,
        `曲线 $y = ${y}$ 在一个有界区间上下凹。求这个区间的长度。`,
      ),
      answer,
      form: "integer",
      wrong: [2 * answer, Math.abs(r + s), Math.abs(r * s), answer + 1],
      solution: walk(
        [
          [
            "Differentiate twice and factor",
            "求两次导数并因式分解",
            `The second derivative is\n\n$$y'' = ${second} = 12${factor(r)}${factor(s)}$$`,
            `二阶导数为\n\n$$y'' = ${second} = 12${factor(r)}${factor(s)}$$`,
          ],
          [
            "Find where it is negative",
            "找出它为负的区间",
            `The quadratic opens upward, so it is negative between its roots $${r}$ and $${s}$: the curve is concave down on $(${r}, ${s})$, of length $${s} - ${inParens(r)} = ${answer}$.`,
            `这个二次式开口向上，所以在两根 $${r}$ 与 $${s}$ 之间为负：曲线在 $(${r}, ${s})$ 上下凹，长度为 $${s} - ${inParens(r)} = ${answer}$。`,
          ],
        ],
        [
          `Test one point inside and one on each side:\n\n${valueTable([r - 1, mid, s + 1], [["y''", y2]])}\n\nOnly the middle value is negative.`,
          `在区间内取一点，两侧各取一点：\n\n${valueTable([r - 1, mid, s + 1], [["y''", y2]])}\n\n只有中间的值为负。`,
        ],
      ),
    });
  },
};

const powerPlusReciprocalMinimum: KnowledgePointDef = {
  id: "the-local-minimum-of-a-power-plus-a-reciprocal",
  title: t("The local minimum of a power plus a reciprocal", "幂与倒数之和的局部极小值"),
  explanation: t(
    "For $x > 0$, a function like $ax^2 + \\frac{b}{x}$ grows without bound both as $x \\to 0$ and as $x \\to \\infty$, with a lowest point between. The second derivative $2a + \\frac{2b}{x^3}$ is positive for all $x > 0$ when $a$ and $b$ are, so the second derivative test confirms a minimum at any critical point. This form often appears in optimization, as one term falls while the other rises. For $x^2 + \\frac{16}{x}$, $f'(x) = 2x - \\frac{16}{x^2}$ is $0$ when $x^3 = 8$, at $x = 2$, and $f''(2) = 2 + 4 = 6 > 0$. The minimum value is $f(2) = 4 + 8 = 12$.\n\nCheck: $f(1.9) \\approx 12.031$ and $f(2.1) \\approx 12.029$, both above $12$.\n\n> **Watch out.** The question asks for the value $f(2) = 12$, not the place $x = 2$ where it occurs.",
    "当 $x > 0$ 时，像 $ax^2 + \\frac{b}{x}$ 这样的函数在 $x \\to 0$ 和 $x \\to \\infty$ 时都无限增大，中间有一个最低点。当 $a$ 和 $b$ 为正时，二阶导数 $2a + \\frac{2b}{x^3}$ 对所有 $x > 0$ 都是正的，所以二阶导数判别法确认任何临界点都是极小值点。这种形式常出现在最优化中，一项减小时另一项增大。对 $x^2 + \\frac{16}{x}$，$f'(x) = 2x - \\frac{16}{x^2}$ 在 $x^3 = 8$ 即 $x = 2$ 时为 $0$，且 $f''(2) = 2 + 4 = 6 > 0$。极小值为 $f(2) = 4 + 8 = 12$。\n\n检验：$f(1.9) \\approx 12.031$，$f(2.1) \\approx 12.029$，都大于 $12$。\n\n> **注意。** 题目问的是函数值 $f(2) = 12$，而不是取得它的位置 $x = 2$。",
  ),
  generate(rng) {
    const a = rng.int(1, 4);
    const c = rng.int(1, 12);
    const b = 2 * a * c ** 3;
    const answer = 3 * a * c * c;
    const f = (x: number) => a * x * x + b / x;
    return numberProblem({
      prompt: t(
        `Find the local minimum value of $f(x) = ${poly([a, "x^2"])} + \\frac{${b}}{x}$ for $x > 0$.`,
        `求 $f(x) = ${poly([a, "x^2"])} + \\frac{${b}}{x}$（$x > 0$）的局部极小值。`,
      ),
      answer,
      form: "integer",
      wrong: [a * c * c, 2 * a * c * c, c, 3 * a * c],
      solution: walk(
        [
          [
            "Find the critical point",
            "求临界点",
            `$f'(x) = ${poly([2 * a, "x"])} - \\frac{${b}}{x^2}$ is $0$ when $x^3 = ${c ** 3}$, so $x = ${c}$.`,
            `$f'(x) = ${poly([2 * a, "x"])} - \\frac{${b}}{x^2}$ 在 $x^3 = ${c ** 3}$ 时为 $0$，所以 $x = ${c}$。`,
          ],
          [
            "Apply the second derivative test",
            "用二阶导数检验",
            `$f''(x) = ${2 * a} + \\frac{${2 * b}}{x^3}$, so $f''(${c}) = ${2 * a} + ${4 * a} = ${6 * a} > 0$: a local minimum.`,
            `$f''(x) = ${2 * a} + \\frac{${2 * b}}{x^3}$，所以 $f''(${c}) = ${2 * a} + ${4 * a} = ${6 * a} > 0$：局部极小值。`,
          ],
          [
            "Evaluate f",
            "计算函数值",
            `$f(${c}) = ${a * c * c} + ${2 * a * c * c} = ${answer}$.`,
            `$f(${c}) = ${a * c * c} + ${2 * a * c * c} = ${answer}$。`,
          ],
        ],
        [
          `Nearby values are larger: $f(${num(c - 0.1)}) \\approx ${num(f(c - 0.1))}$ and $f(${num(c + 0.1)}) \\approx ${num(f(c + 0.1))}$, both above $${answer}$.`,
          `附近的值更大：$f(${num(c - 0.1)}) \\approx ${num(f(c - 0.1))}$，$f(${num(c + 0.1)}) \\approx ${num(f(c + 0.1))}$，都大于 $${answer}$。`,
        ],
      ),
    });
  },
};

const reciprocalOfRoot: KnowledgePointDef = {
  id: "approximating-a-reciprocal-of-a-root",
  title: t("Approximating a reciprocal of a root", "近似计算根式的倒数"),
  explanation: t(
    "Local linearity works for any differentiable function, and the choice of function follows from the shape of the number. To approximate $\\frac{1}{\\sqrt{N}}$, use $f(x) = x^{-1/2}$ at a nearby perfect square, where $f$ and $f'$ have exact values. Since $f$ is decreasing, its slope is negative, so a number above the square has an approximation below the exact value at the square. Because $f$ is concave up, this estimate is slightly low. For $\\frac{1}{\\sqrt{26}}$, use $a = 25$: $f(25) = \\frac{1}{5}$, and $f'(x) = -\\frac{1}{2}x^{-3/2}$ gives $f'(25) = -\\frac{1}{250}$. Then\n\n$$\\frac{1}{\\sqrt{26}} \\approx \\frac{1}{5} - \\frac{1}{250} = \\frac{49}{250} = 0.196.$$\n\nCheck: $0.196^{2} \\cdot 26 \\approx 0.9988$, just below $1$, so $0.196$ is slightly below $\\frac{1}{\\sqrt{26}}$, as concave up predicts.\n\n> **Watch out.** The derivative of $x^{-1/2}$ is $-\\frac{1}{2}x^{-3/2}$, with a minus sign. Dropping it moves the estimate the wrong way.",
    "局部线性化适用于任何可导函数，函数的选择取决于这个数的形式。要近似 $\\frac{1}{\\sqrt{N}}$，取 $f(x) = x^{-1/2}$，在附近的完全平方数处，$f$ 和 $f'$ 都有精确值。由于 $f$ 递减，斜率为负，所以大于该平方数的数，其近似值小于在平方数处的精确值。又因为 $f$ 是上凹的，这个估计略微偏低。对 $\\frac{1}{\\sqrt{26}}$，取 $a = 25$：$f(25) = \\frac{1}{5}$，由 $f'(x) = -\\frac{1}{2}x^{-3/2}$ 得 $f'(25) = -\\frac{1}{250}$。于是\n\n$$\\frac{1}{\\sqrt{26}} \\approx \\frac{1}{5} - \\frac{1}{250} = \\frac{49}{250} = 0.196.$$\n\n检验：$0.196^{2} \\cdot 26 \\approx 0.9988$，略小于 $1$，所以 $0.196$ 略小于 $\\frac{1}{\\sqrt{26}}$，与上凹的判断一致。\n\n> **注意。** $x^{-1/2}$ 的导数是 $-\\frac{1}{2}x^{-3/2}$，带负号。漏掉负号会让估计朝错误的方向移动。",
  ),
  generate(rng) {
    const a = rng.int(3, 10);
    const h = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
    const base = Q.of(1, a);
    const step = Q.of(h, 2 * a ** 3);
    const answer = base.sub(step);
    const n = a * a + h;
    const back = answer.toNumber() ** 2 * n;
    const six = dec(Q.of(Math.round(back * 1e6), 1e6));
    return numberProblem({
      prompt: t(
        `Use the linearization of $f(x) = \\frac{1}{\\sqrt{x}}$ at $x = ${a * a}$ to approximate $\\frac{1}{\\sqrt{${n}}}$.`,
        `用 $f(x) = \\frac{1}{\\sqrt{x}}$ 在 $x = ${a * a}$ 处的线性化近似 $\\frac{1}{\\sqrt{${n}}}$。`,
      ),
      answer,
      wrong: [base.add(step), base.sub(Q.of(h, a ** 3)), base, base.sub(Q.of(h, 2 * a))],
      solution: walk(
        [
          [
            "Find the value and the slope",
            "求函数值和斜率",
            `$f(x) = x^{-1/2}$ has $f'(x) = -\\frac{1}{2}x^{-3/2}$. At the perfect square $${a * a}$,\n\n$$f(${a * a}) = \\frac{1}{${a}}, \\quad f'(${a * a}) = -\\frac{1}{2 \\cdot ${a}^{3}} = -\\frac{1}{${2 * a ** 3}}$$`,
            `$f(x) = x^{-1/2}$ 的导数为 $f'(x) = -\\frac{1}{2}x^{-3/2}$。在完全平方数 $${a * a}$ 处，\n\n$$f(${a * a}) = \\frac{1}{${a}}, \\quad f'(${a * a}) = -\\frac{1}{2 \\cdot ${a}^{3}} = -\\frac{1}{${2 * a ** 3}}$$`,
          ],
          [
            "Linearize",
            "线性化",
            `The step is $${n} - ${a * a} = ${h}$, so\n\n$$\\frac{1}{\\sqrt{${n}}} \\approx \\frac{1}{${a}} - \\frac{1}{${2 * a ** 3}} \\cdot ${inParens(h)} = ${answer.toLatex()}${approx(answer)}$$`,
            `步长为 $${n} - ${a * a} = ${h}$，所以\n\n$$\\frac{1}{\\sqrt{${n}}} \\approx \\frac{1}{${a}} - \\frac{1}{${2 * a ** 3}} \\cdot ${inParens(h)} = ${answer.toLatex()}${approx(answer)}$$`,
          ],
        ],
        [
          `If the estimate were exact, its square times $${n}$ would be $1$. Instead\n\n$$\\left(${answer.toLatex()}\\right)^{2} \\cdot ${n} \\approx ${six}$$\n\nThis is just below $1$, so the estimate is slightly below the exact value, as concave up predicts.`,
          `如果估计值是精确的，它的平方乘以 $${n}$ 应等于 $1$。实际上\n\n$$\\left(${answer.toLatex()}\\right)^{2} \\cdot ${n} \\approx ${six}$$\n\n略小于 $1$，所以估计值略小于精确值，与上凹的判断一致。`,
        ],
      ),
    });
  },
};

const rectangleUnderParabola: KnowledgePointDef = {
  id: "the-largest-rectangle-under-a-parabola",
  figure: calculusDrawings3["solving-optimization-problems-using-derivatives#the-largest-rectangle-under-a-parabola"],
  title: t("The largest rectangle under a parabola", "抛物线下的最大矩形"),
  explanation: t(
    "A rectangle with its base on the $x$-axis and its top corners on a symmetric parabola is fixed by one number: the $x$-coordinate of its right corner. Its width is twice this, and its height is the value of the function there. Writing the area in terms of $x$ turns a geometric question into a cubic to maximize. Only values of $x$ between 0 and the root of the parabola make sense as a rectangle.",
    "底边在 $x$ 轴上、上方两个顶点在对称抛物线上的矩形，由一个数确定：右顶点的 $x$ 坐标。宽是它的两倍，高是函数在那里的值。把面积写成 $x$ 的式子，就把几何问题变成求三次式的最大值。只有 0 和抛物线的根之间的 $x$ 才构成矩形。",
  ),
  generate(rng) {
    const k = rng.int(1, 5);
    const r = rng.int(1, 6);
    const answer = 4 * k * r ** 3;
    const curve = poly([3 * k * r * r, ""], [-k, "x^2"]);
    return numberProblem({
      prompt: t(
        `A rectangle has its base on the $x$-axis and its two top corners on the parabola $y = ${curve}$. Find the largest possible area of the rectangle.`,
        `一个矩形的底边在 $x$ 轴上，上方两个顶点在抛物线 $y = ${curve}$ 上。求矩形的最大面积。`,
      ),
      answer,
      form: "integer",
      wrong: [2 * k * r ** 3, 4 * k * r * r, 3 * k * r * r, 8 * k * r ** 3],
      solution: t(
        `With corners at $\\pm x$, the area is $A = 2x(${curve})$, and $A' = ${poly([6 * k * r * r, ""], [-6 * k, "x^2"])} = 0$ gives $x = ${r}$. The height there is $${2 * k * r * r}$ and the width is $${2 * r}$, so the area is $${answer}$.`,
        `设顶点在 $\\pm x$ 处，面积 $A = 2x(${curve})$，由 $A' = ${poly([6 * k * r * r, ""], [-6 * k, "x^2"])} = 0$ 得 $x = ${r}$。此时高是 $${2 * k * r * r}$，宽是 $${2 * r}$，所以面积是 $${answer}$。`,
      ),
    });
  },
};

const distanceBetweenTurningPoints: KnowledgePointDef = {
  id: "the-distance-between-two-turning-points",
  title: t("The distance between two turning points", "两个转向点之间的距离"),
  explanation: t(
    "A particle turns around where its velocity changes sign. When the position is a cubic, the velocity is a quadratic, and its two roots give the two moments of turning. The particle reaches an extreme position at each of them. So the distance between those positions is found by evaluating the position function, not the velocity. Note that this is the difference in position at two times, and not a time difference.",
    "质点在速度变号时转向。当位置是三次函数时，速度是二次函数，它的两个根给出两个转向时刻。质点在每个时刻都到达一个极端位置。所以这两个位置之间的距离要代入位置函数来求，而不是速度。注意这是两个时刻的位置之差，而不是时间差。",
  ),
  generate(rng) {
    const p = rng.int(1, 8);
    const d = 2 * rng.int(1, 4);
    const q = p + d;
    const middle = (-3 * (p + q)) / 2;
    const position = (time: number) => time ** 3 + middle * time ** 2 + 3 * p * q * time;
    const answer = d ** 3 / 2;
    return numberProblem({
      prompt: t(
        `A particle has position $s(t) = ${poly([1, "t^3"], [middle, "t^2"], [3 * p * q, "t"])}$ for $t \\ge 0$. It changes direction twice. How far apart are the two positions where it turns?`,
        `质点的位置是 $s(t) = ${poly([1, "t^3"], [middle, "t^2"], [3 * p * q, "t"])}$，$t \\ge 0$。它改变方向两次。两个转向位置相距多远？`,
      ),
      answer,
      form: "integer",
      wrong: [d, d ** 3, d * d, 3 * d * d],
      solution: t(
        `The velocity $${poly([3, "t^2"], [2 * middle, "t"], [3 * p * q, ""])}$ vanishes at $t = ${p}$ and $t = ${q}$. There $s(${p}) = ${position(p)}$ and $s(${q}) = ${position(q)}$, which are $${answer}$ apart.`,
        `速度 $${poly([3, "t^2"], [2 * middle, "t"], [3 * p * q, ""])}$ 在 $t = ${p}$ 和 $t = ${q}$ 时为零。此时 $s(${p}) = ${position(p)}$，$s(${q}) = ${position(q)}$，相距 $${answer}$。`,
      ),
    });
  },
};

const powerFromForce: KnowledgePointDef = {
  id: "the-rate-of-work-of-the-net-force",
  figure: calculusDrawings3["newtons-second-law#the-rate-of-work-of-the-net-force"],
  title: t("The rate of work of the net force", "合力做功的功率"),
  explanation: t(
    "Newton's second law gives the net force on an object as $F = ma$, and the rate at which that force does work is the power $P = Fv$. Both acceleration and velocity come from differentiating the position. With a quadratic position, the acceleration and the force are constant, yet the power still grows with time, because the object is moving faster. The unit of power is the watt, which is one newton metre per second.",
    "牛顿第二定律给出物体所受合力 $F = ma$，这个力做功的快慢是功率 $P = Fv$。加速度和速度都由位置求导得到。当位置是二次函数时，加速度和力是常数，但功率仍随时间增大，因为物体运动得更快了。功率的单位是瓦特，即每秒一牛顿米。",
  ),
  generate(rng) {
    const a = rng.int(1, 6);
    const b = rng.int(1, 9);
    const m = rng.int(2, 9);
    const time = rng.int(1, 6);
    const force = 2 * a * m;
    const velocity = 2 * a * time + b;
    const answer = force * velocity;
    return numberProblem({
      prompt: t(
        `An object of mass ${m} kg has position $s(t) = ${poly([a, "t^2"], [b, "t"])}$ metres at time $t$ seconds. Find the power $P = Fv$ of the net force, in watts, at $t = ${time}$.`,
        `质量为 ${m} 千克的物体在 $t$ 秒时的位置是 $s(t) = ${poly([a, "t^2"], [b, "t"])}$ 米。求 $t = ${time}$ 时合力的功率 $P = Fv$，单位为瓦特。`,
      ),
      answer,
      form: "integer",
      wrong: [force, velocity, m * velocity, force * 2 * a * time],
      solution: t(
        `The acceleration is $${2 * a}$, so $F = ${m} \\cdot ${2 * a} = ${force}$ N. The velocity at this time is $${velocity}$ m/s. So $P = ${force} \\cdot ${velocity} = ${answer}$ W.`,
        `加速度是 $${2 * a}$，所以 $F = ${m} \\cdot ${2 * a} = ${force}$ 牛。此时的速度是每秒 $${velocity}$ 米。所以 $P = ${force} \\cdot ${velocity} = ${answer}$ 瓦。`,
      ),
    });
  },
};

const integralAsOneLogarithm: KnowledgePointDef = {
  id: "a-logarithmic-integral-written-as-one-logarithm",
  title: t("A logarithmic integral written as one logarithm", "把对数积分写成一个对数"),
  explanation: t(
    "A definite integral of $\\frac{k}{x}$ on a positive interval gives $k(\\ln b - \\ln a)$. The rules of logarithms then combine this into a single logarithm: the difference becomes a quotient, and the coefficient becomes a power, so the result is $\\ln\\left(\\frac{b}{a}\\right)^k$. Notice that the value depends only on the ratio of the limits, so the integrals over $[1, 2]$ and $[3, 6]$ are equal. This is what makes the logarithm special.",
    "$\\frac{k}{x}$ 在正区间上的定积分是 $k(\\ln b - \\ln a)$。再用对数法则合并成一个对数：差变成商，系数变成幂，结果是 $\\ln\\left(\\frac{b}{a}\\right)^k$。注意积分值只取决于上下限的比，所以在 $[1, 2]$ 和 $[3, 6]$ 上的积分相等。这正是对数的特别之处。",
  ),
  generate(rng) {
    const a = rng.int(1, 4);
    const ratio = rng.int(2, 5);
    const k = rng.int(2, 4);
    const b = a * ratio;
    const answer = ratio ** k;
    return numberProblem({
      prompt: t(
        `$\\int_{${a}}^{${b}} \\frac{${k}}{x}\\,dx = \\ln c$. Find $c$.`,
        `$\\int_{${a}}^{${b}} \\frac{${k}}{x}\\,dx = \\ln c$。求 $c$。`,
      ),
      answer,
      form: "integer",
      wrong: [ratio * k, b ** k, ratio, (b - a) ** k],
      solution: t(
        `The integral is $${k}(\\ln ${b} - \\ln ${a}) = ${k}\\ln ${ratio} = \\ln ${ratio}^{${k}}$. So $c = ${answer}$.`,
        `积分等于 $${k}(\\ln ${b} - \\ln ${a}) = ${k}\\ln ${ratio} = \\ln ${ratio}^{${k}}$。所以 $c = ${answer}$。`,
      ),
    });
  },
};

const exponentialOverLogOfBase: KnowledgePointDef = {
  id: "an-exponential-integral-over-ln-of-the-base",
  title: t("An exponential integral over the logarithm of its base", "含底数对数的指数积分"),
  explanation: t(
    "The derivative of $a^x$ is $a^x\\ln a$, so an antiderivative of $a^x$ is $\\frac{a^x}{\\ln a}$. Bases other than $e$ therefore leave a factor of $\\frac{1}{\\ln a}$ in every definite integral. When evaluating, remember the lower limit: at $x = 0$, the value $a^0 = 1$ is not zero, and it must be subtracted. Forgetting it, or treating $a^x$ like a power of $x$, are the usual mistakes.",
    "$a^x$ 的导数是 $a^x\\ln a$，所以 $a^x$ 的一个原函数是 $\\frac{a^x}{\\ln a}$。因此底数不是 $e$ 时，每个定积分中都留下因子 $\\frac{1}{\\ln a}$。计算时要记住下限：在 $x = 0$ 处，$a^0 = 1$ 不是零，必须减去。忘记减去，或把 $a^x$ 当成 $x$ 的幂，是常见的错误。",
  ),
  generate(rng) {
    const a = rng.pick([2, 3, 5, 6, 7, 10]);
    const n = rng.int(2, 4);
    const k = rng.int(1, 9);
    const top = a ** n;
    const answer = k * (top - 1);
    const scale = k === 1 ? "" : `${k} \\cdot `;
    return numberProblem({
      prompt: t(
        `$\\int_0^{${n}} ${scale}${a}^x\\,dx = \\frac{c}{\\ln ${a}}$. Find $c$.`,
        `$\\int_0^{${n}} ${scale}${a}^x\\,dx = \\frac{c}{\\ln ${a}}$。求 $c$。`,
      ),
      answer,
      form: "integer",
      wrong: [k * top, top - 1, k * n * a ** (n - 1), k * (a ** (n + 1) - 1)],
      solution: t(
        `An antiderivative is $\\frac{${scale}${a}^x}{\\ln ${a}}$. Evaluating at $x = ${n}$ and $x = 0$ gives a numerator of $${k}(${top} - 1)$, so $c = ${answer}$.`,
        `一个原函数是 $\\frac{${scale}${a}^x}{\\ln ${a}}$。在 $x = ${n}$ 和 $x = 0$ 处取值，分子是 $${k}(${top} - 1)$，所以 $c = ${answer}$。`,
      ),
    });
  },
};

const integralOfTanSquared: KnowledgePointDef = {
  id: "an-integral-of-tan-squared-plus-a-constant",
  title: t("An integral of tan squared plus a constant", "tan 平方加常数的积分"),
  explanation: t(
    "There is no direct rule for $\\tan^2 x$, but the identity $\\tan^2 x = \\sec^2 x - 1$ turns it into two functions with known antiderivatives. So the integral is $\\tan x - x$. The term $-x$ is easy to overlook, yet it is where the factor of $\\pi$ comes from on an interval with limits in terms of $\\pi$. Any added constant combines with this term, because it also integrates to a multiple of $x$.",
    "$\\tan^2 x$ 没有直接的积分法则，但恒等式 $\\tan^2 x = \\sec^2 x - 1$ 把它变成两个已知原函数的函数。所以积分是 $\\tan x - x$。$-x$ 这一项容易被忽略，但当积分限用 $\\pi$ 表示时，$\\pi$ 的因子正是来自这里。任何加上的常数都与这一项合并，因为它积分后也是 $x$ 的倍数。",
  ),
  generate(rng) {
    const k = rng.int(1, 9);
    const m = different(rng, 1, 9, k);
    const answer = Q.of(m - k, 4);
    const integrand = poly([k, "\\tan^2 x"], [m, ""]);
    const rewritten = poly([k, "\\sec^2 x"], [m - k, ""]);
    return numberProblem({
      prompt: t(
        `$\\int_0^{\\pi/4} (${integrand})\\,dx = A + B\\pi$ with $A$ and $B$ rational. Find $B$.`,
        `$\\int_0^{\\pi/4} (${integrand})\\,dx = A + B\\pi$，其中 $A$ 和 $B$ 是有理数。求 $B$。`,
      ),
      answer,
      wrong: [Q.of(k, 4), Q.of(m, 4), Q.of(m + k, 4), Q.of(k - m, 4)],
      solution: t(
        `Since $\\tan^2 x = \\sec^2 x - 1$, the integrand is $${rewritten}$. The secant term gives the rational part $${k}$, and the constant gives $${inParens(m - k)} \\cdot \\frac{\\pi}{4}$. So $B = ${answer.toLatex()}$.`,
        `由于 $\\tan^2 x = \\sec^2 x - 1$，被积函数是 $${rewritten}$。正割项给出有理部分 $${k}$，常数给出 $${inParens(m - k)} \\cdot \\frac{\\pi}{4}$。所以 $B = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const scaledArctangent: KnowledgePointDef = {
  id: "an-arctangent-integral-with-a-scaled-variable",
  title: t("An arctangent integral with a scaled variable", "变量带系数的反正切积分"),
  explanation: t(
    "The rule $\\int \\frac{dx}{a^2 + x^2} = \\frac{1}{a}\\arctan\\frac{x}{a} + C$ needs $x^2$ to have a coefficient of 1. When the variable has a coefficient, as in $a^2 + b^2x^2$, the substitution $u = bx$ brings this about, at the cost of an extra factor of $\\frac{1}{b}$. So the antiderivative is $\\frac{1}{ab}\\arctan\\frac{bx}{a}$. Both constants appear in the denominator, and leaving one out is the usual slip.",
    "公式 $\\int \\frac{dx}{a^2 + x^2} = \\frac{1}{a}\\arctan\\frac{x}{a} + C$ 要求 $x^2$ 的系数为 1。当变量带系数时，如 $a^2 + b^2x^2$，代换 $u = bx$ 可以做到这一点，代价是多出因子 $\\frac{1}{b}$。所以原函数是 $\\frac{1}{ab}\\arctan\\frac{bx}{a}$。两个常数都出现在分母中，漏掉一个是常见的失误。",
  ),
  generate(rng) {
    const a = rng.int(2, 9);
    // A reduced fraction a/b, so that the limit and the arctangent read cleanly.
    const b = rng.pick([2, 3, 4, 5, 6, 7].filter((v) => Q.of(a, v).toLatex() === `\\frac{${a}}{${v}}`));
    const k = rng.int(1, 9);
    const upper = Q.of(a, b);
    const answer = Q.of(k, 4 * a * b);
    return numberProblem({
      prompt: t(
        `$\\int_0^{${upper.toLatex()}} \\frac{${k}}{${a * a} + ${b * b}x^2}\\,dx = c\\pi$. Find $c$.`,
        `$\\int_0^{${upper.toLatex()}} \\frac{${k}}{${a * a} + ${b * b}x^2}\\,dx = c\\pi$。求 $c$。`,
      ),
      answer,
      wrong: [Q.of(k, 4 * a), Q.of(k, 4 * b), Q.of(k, 2 * a * b), Q.of(k, a * b)],
      solution: t(
        `With $u = ${b}x$, an antiderivative is $${k} \\cdot \\frac{1}{${a * b}}\\arctan\\frac{${b}x}{${a}}$. At the upper limit the arctangent is that of $1$, which is $\\frac{\\pi}{4}$, and at $0$ it vanishes. So $c = ${answer.toLatex()}$.`,
        `令 $u = ${b}x$，一个原函数是 $${k} \\cdot \\frac{1}{${a * b}}\\arctan\\frac{${b}x}{${a}}$。在上限处是 $1$ 的反正切，即 $\\frac{\\pi}{4}$，在 $0$ 处为零。所以 $c = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const areaCutOffByParabola: KnowledgePointDef = {
  id: "the-area-cut-off-by-a-parabola",
  figure: calculusDrawings3["the-area-bounded-by-a-curve-and-the-x-axis#the-area-cut-off-by-a-parabola"],
  title: t("The area cut off by a parabola", "抛物线截出的面积"),
  explanation: t(
    "A downward parabola with two real roots encloses a region with the $x$-axis, and the roots are the limits of integration. They must be found first, since no limits are given. For the parabola $y = k(x - r)(s - x)$, this area comes to $\\frac{k(s - r)^3}{6}$, a formula due in essence to Archimedes. It depends only on the distance between the roots and the coefficient $k$, and not on where the parabola sits along the axis.",
    "开口向下、有两个实根的抛物线与 $x$ 轴围成一个区域，根就是积分限。由于没有给出积分限，必须先求出它们。对抛物线 $y = k(x - r)(s - x)$，这个面积是 $\\frac{k(s - r)^3}{6}$，这个结果本质上源于阿基米德。它只取决于两根之间的距离和系数 $k$，与抛物线在轴上的位置无关。",
  ),
  generate(rng) {
    const k = rng.int(1, 6);
    const r = rng.int(-5, 5);
    const d = rng.int(1, 8);
    const s = r + d;
    const answer = Q.of(k * d ** 3, 6);
    const curve = poly([-k, "x^2"], [k * (r + s), "x"], [-k * r * s, ""]);
    return numberProblem({
      prompt: t(
        `Find the area of the region enclosed by $y = ${curve}$ and the $x$-axis.`,
        `求 $y = ${curve}$ 与 $x$ 轴围成的区域的面积。`,
      ),
      answer,
      wrong: [Q.of(k * d ** 3, 3), Q.of(k * d ** 3, 2), Q.of(k * d * d, 6), Q.of(-k * d ** 3, 6)],
      solution: t(
        `The curve meets the axis at $x = ${r}$ and $x = ${s}$, and it is above the axis between them. With $u = ${poly([1, "x"], [-r, ""])}$, the area is $\\int_0^{${d}} ${poly([k, "u"])}(${d} - u)\\,du = ${answer.toLatex()}$.`,
        `曲线与轴交于 $x = ${r}$ 和 $x = ${s}$，在两者之间位于轴上方。令 $u = ${poly([1, "x"], [-r, ""])}$，面积是 $\\int_0^{${d}} ${poly([k, "u"])}(${d} - u)\\,du = ${answer.toLatex()}$。`,
      ),
    });
  },
};

/** deeperCalculusIPoints gives, by topic id, the knowledge points added after a Calculus I topic's own. */
export const deeperCalculusIPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "limits-of-piecewise-functions": [coefficientForPiecewiseLimit],
  "calculating-limits-of-rational-functions-by-factoring": [limitThatMustExist],
  "calculating-limits-of-radical-functions-using-conjugate-multiplication": [conjugatesTopAndBottom],
  "limits-at-infinity-and-horizontal-asymptotes-of-rational-functions": [crossingTheAsymptote],
  "evaluating-special-limits-involving-sine-using-a-substitution": [quadraticInsideSine],
  "limits-involving-the-exponential-function": [ratioToAPower],
  "calculating-the-equation-of-a-tangent-line-using-differentiation": [tangentThroughOutsidePoint],
  "calculating-the-equation-of-a-normal-line-using-differentiation": [normalMeetsAgain],
  "the-product-rule-for-differentiation": [productOfThree],
  "the-quotient-rule-for-differentiation": [largestValueOfAQuotient],
  "second-and-higher-order-derivatives": [highDerivativeOfAProduct],
  "the-chain-rule-with-exponential-functions": [rateThatSolvesAnEquation],
  "differentiating-inverse-functions": [inverseInsideAChain],
  "calculating-related-rates-using-similar-triangles": [troughDepth],
  "calculating-related-rates-with-cones": [coneWithALeak],
  "calculating-related-rates-with-rectangular-solids": [boxDiagonal],
  "lhopitals-rule": [zeroTimesInfinity],
  "the-mean-value-theorem": [boundFromMeanValue],
  "using-the-first-derivative-test-to-classify-local-extrema": [cubicFromExtrema],
  "points-of-inflection": [quarticFromInflections],
  "approximating-functions-using-local-linearity-and-linearization": [linearizationError],
  "optimization-problems-in-economics": [priceForMostRevenue],
  "newtons-method": [newtonFails],
  "the-antiderivative": [twoInitialConditions],
  "the-fundamental-theorem-of-calculus": [unknownUpperLimit],
  "evaluating-definite-integrals-using-symmetry": [symmetryAboutAnotherCenter],
  "the-second-fundamental-theorem-of-calculus": [constantInAnAccumulation],
  "approximating-areas-with-the-right-riemann-sum": [rightMinusLeft],
  "solving-equations-containing-hyperbolic-functions": [sinhAndCoshTogether],
  "the-inverse-hyperbolic-functions": [hyperbolicOfInverse],
  "the-product-and-quotient-rules-for-limits": [quotientLimitNewDenominator],
  "limits-of-exponential-functions": [ratioOfExponentials],
  "limits-of-logarithmic-functions": [differenceOfLogarithms],
  "calculating-limits-using-trigonometric-identities": [tangentMinusSine],
  "evaluating-limits-at-infinity-of-radical-functions": [differenceOfTwoRoots],
  "the-squeeze-theorem": [boundedTermInRatio],
  "special-limits-involving-cosine": [differenceOfCosines],
  "further-limits-involving-the-exponential-function": [ratioOfExponentialDifferences],
  "continuity-and-differentiability-of-functions": [differentiableJoin],
  "calculating-the-slope-of-a-tangent-line-using-differentiation": [leastSlopeOnCubic],
  "differentiating-inverse-trigonometric-functions": [arctanOfPowerAtPoint],
  "the-chain-rule-with-logarithmic-functions": [logOfTrig],
  "the-chain-rule-with-trigonometric-functions": [powerOfTrigOfMultiple],
  "calculating-dy-dx-using-dx-dy": [secondDerivativeFromDxDy],
  "calculating-related-rates-with-squares": [squareFromDiagonal],
  "calculating-related-rates-using-trigonometry": [triangleWithGrowingAngle],
  "the-candidates-test": [cornerAsCandidate],
  "using-differentiation-to-calculate-critical-points": [criticalPointWhereDerivativeFails],
  "determining-intervals-on-which-a-function-is-increasing-or-decreasing": [increasingEverywhere],
  "optimization-problems-with-inscribed-shapes": [cylinderInCone],
  "optimization-problems-involving-cylinders": [canWithCostlyEnds],
  "optimizing-distances": [cableAcrossRiver],
  "determining-characteristics-of-moving-objects-using-differentiation": [greatestSpeed],
  "properties-of-definite-integrals-involving-the-limits-of-integration": [overlappingIntervals],
  "definite-integrals-of-piecewise-functions": [absoluteValueOfQuadratic],
  "the-integral-as-an-accumulation-function": [dropBetweenExtremes],
  "defining-definite-integrals-using-left-and-right-riemann-sums": [limitOfSumValue],
  "the-area-bounded-by-a-curve-and-the-y-axis": [enclosedByYAxis],
  "estimating-derivatives-using-a-central-difference-quotient": [centralDifferenceError],
  "the-reciprocal-hyperbolic-functions": [sechFromTanh],
  "the-sum-rule-for-limits": [productLimitFromSumAndDifference],
  "the-power-and-root-rules-for-limits": [limitFromItsRoot],
  "limits-at-infinity-of-polynomials": [expandedPowersAtInfinity],
  "limits-of-radical-functions": [radicalAtNegativeInfinity],
  "limits-of-inverse-trigonometric-functions": [inverseTrigOfRatio],
  "limits-of-absolute-value-functions": [quotientOfAbsoluteValues],
  "special-limits-involving-sine": [shiftedSineOverSquares],
  "continuity-over-an-interval": [continuityOfRadicalQuotient],
  "jump-discontinuities": [jumpsOfFloor],
  "the-average-rate-of-change-of-a-function-over-a-varying-interval": [widthFromAverageRate],
  "the-power-rule-for-differentiation": [exponentFromDerivative],
  "differentiating-trigonometric-functions": [highDerivativeOfSineCosineSum],
  "differentiating-hyperbolic-functions": [coshSlopeAtHeight],
  "differentiating-reciprocal-trigonometric-functions": [squaresOfSecantAndTangent],
  "calculating-derivatives-from-data-and-tables": [secondDerivativeOfProduct],
  "calculating-derivatives-from-data-using-the-chain-rule": [chainRuleOfThree],
  "differentiating-an-inverse-function-at-a-point": [secondDerivativeOfInverse],
  "further-logarithmic-differentiation": [variablePowerAtOne],
  "calculating-related-rates-using-the-pythagorean-theorem": [boatOnARope],
  "relating-concavity-to-the-second-derivative": [concaveDownLength],
  "the-second-derivative-test": [powerPlusReciprocalMinimum],
  "approximating-the-roots-of-a-number-using-local-linearity": [reciprocalOfRoot],
  "solving-optimization-problems-using-derivatives": [rectangleUnderParabola],
  "calculating-velocity-for-straight-line-motion-using-differentiation": [distanceBetweenTurningPoints],
  "newtons-second-law": [powerFromForce],
  "integrating-the-reciprocal-function": [integralAsOneLogarithm],
  "integrating-exponential-functions": [exponentialOverLogOfBase],
  "integrating-trigonometric-functions": [integralOfTanSquared],
  "integration-using-inverse-trigonometric-functions": [scaledArctangent],
  "the-area-bounded-by-a-curve-and-the-x-axis": [areaCutOffByParabola],
};
