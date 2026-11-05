import type { KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { linear, num, poly, Q } from "@ga/subject-math";
import { gradeDrawings5 } from "../explanation-drawings-grades-5.ts";

import { choiceProblem, numberProblem, pointLatex, steps } from "../problems.ts";
import { mathText, pickChoice } from "./grade-4-fractions.ts";

// 8th Grade Math, linear equations: equations with infinitely many solutions or none, horizontal and vertical lines,
// and slope as the unit rate of a proportional relationship.

/** ccss is a helper for writing Common Core codes. */
const ccss = (...codes: string[]) => codes.map((c) => `CCSS.${c}`);

/** topic builds a TopicDef with the common fields filled in. */
function topic(
  id: string,
  title: Text,
  summary: Text,
  prerequisites: string[],
  standards: string[],
  knowledgePoints: KnowledgePointDef[],
): TopicDef {
  return { id, title, summary, prerequisites, encompasses: [], xp: 10, standards: ccss(...standards), knowledgePoints };
}

/** times writes k(ax + b), the product of a number and a linear expression. */
const times = (k: number, a: number, b: number) => `${k === -1 ? "-" : num(k)}(${linear(a, b)})`;

/** plus appends a term with its sign: plus("2(x + 1)", -3, "x") is "2(x + 1) - 3x". */
const plus = (left: string, c: number, v = "") => `${left} ${c < 0 ? "-" : "+"} ${poly([Math.abs(c), v])}`;

/** Count is how many solutions a linear equation has: 0 for exactly one, 1 for infinitely many, 2 for none. */
type Count = 0 | 1 | 2;

/** countOptions are the answers to "how many solutions", indexed by Count. */
const countOptions: readonly Text[] = [t("Exactly one", "恰有一个"), t("Infinitely many", "无穷多个"), t("None", "无解")];

/** lowerFirst lowercases the first letter of a sentence so that it can continue another. */
const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** cancelling says how to remove the term ax from both sides, as the start of a sentence. */
const cancelling = (a: number): Text =>
  a > 0
    ? t(`Subtracting $${poly([a, "x"])}$ from both sides`, `两边同时减去 $${poly([a, "x"])}$`)
    : t(`Adding $${poly([-a, "x"])}$ to both sides`, `两边同时加上 $${poly([-a, "x"])}$`);

/** verdictOf says what ax + b = cx + d means for the number of solutions. */
function verdictOf(a: number, b: number, c: number, d: number): Text {
  if (a !== c)
    return t(
      `The coefficients of $x$, $${a}$ and $${c}$, differ, so there is exactly one solution.`,
      `$x$ 的系数 $${a}$ 和 $${c}$ 不同，所以恰有一个解。`,
    );
  return b === d
    ? t("The two sides are the same expression, so every number is a solution.", "两边是同一个式子，所以任何数都是解。")
    : t(
        `${cancelling(a).en} leaves $${b} = ${d}$, which is false, so there is no solution.`,
        `${cancelling(a)["zh-CN"]}，得到 $${b} = ${d}$，这不成立，所以无解。`,
      );
}

/** countOf classifies ax + b = cx + d. */
const countOf = (a: number, b: number, c: number, d: number): Count => (a !== c ? 0 : b === d ? 1 : 2);

/** expandedEquation draws a(x + p) + qx = r(x + s) + u with both sides to expand, with the given number of solutions,
 * and returns the equation with both sides simplified. */
function expandedEquation(rng: Rng, kind: Count) {
  const a = rng.sign() * rng.int(2, 6);
  const p = rng.nonZero(-6, 6);
  const q = rng.nonZero(-5, 5);
  const left = a + q;
  if (left === 0) return expandedEquation(rng, kind);
  const r = rng.sign() * rng.int(2, 6);
  // The right side has x-coefficient r + w; for one solution it differs from the left.
  const w = kind === 0 ? left - r + rng.sign() * rng.int(1, 3) : left - r;
  if (w === 0 || r + w === 0) return expandedEquation(rng, kind);
  const s = rng.nonZero(-6, 6);
  if (r === a && s === p) return expandedEquation(rng, kind);
  // The constants a·p and r·s + u agree only for infinitely many solutions.
  const u = kind === 1 ? a * p - r * s : a * p - r * s + rng.sign() * rng.int(1, 6);
  const lhs = plus(times(a, 1, p), q, "x");
  const rhs = u === 0 ? plus(times(r, 1, s), w, "x") : plus(plus(times(r, 1, s), w, "x"), u);
  return { equation: `${lhs} = ${rhs}`, a: left, b: a * p, c: r + w, d: r * s + u };
}

// ---------------------------------------------------------------------------
// Infinitely many solutions and no solutions

/** linearEquationsWithInfinitelyManySolutions finds the numbers that make a linear equation an identity. */
export const linearEquationsWithInfinitelyManySolutions = topic(
  "linear-equations-with-infinitely-many-solutions",
  t("Linear Equations With Infinitely Many Solutions", "有无穷多个解的一元一次方程"),
  t(
    "A linear equation has infinitely many solutions when its two sides simplify to the same expression: the x-terms match and so do the constants. Then every number is a solution.",
    "当一元一次方程的两边化简后是同一个式子时，即含 x 的项相同、常数项也相同，方程有无穷多个解：任何数都是它的解。",
  ),
  ["equations-with-parentheses"],
  ["8.EE.C.7.A"],
  [
    {
      id: "choosing-the-constant",
      title: t("Choosing the constant", "确定常数项"),
      explanation: t(
        "For which $k$ does $3(x - 4) + 2x = 5x + k$ have infinitely many solutions? Expand the left side: $3x - 12 + 2x = 5x - 12$. The $x$-terms already match, so the sides are the same exactly when $k = -12$. Forgetting to multiply the $-4$ by $3$ gives the wrong $k = -4$.",
        "$k$ 取何值时，$3(x - 4) + 2x = 5x + k$ 有无穷多个解？展开左边：$3x - 12 + 2x = 5x - 12$。含 $x$ 的项已经相同，所以当且仅当 $k = -12$ 时两边相同。忘记把 $-4$ 乘以 $3$ 会得到错误的 $k = -4$。",
      ),
      generate(rng) {
        const a = rng.sign() * rng.int(2, 7);
        const p = rng.nonZero(-9, 9);
        const c = rng.nonZero(-6, 6);
        if (a + c === 0) return this.generate(rng);
        const k = a * p;
        const eq = `${plus(times(a, 1, p), c, "x")} = ${linear(a + c, 0)} + k`;
        return numberProblem({
          prompt: t(`For what value of $k$ does $${eq}$ have infinitely many solutions?`, `$k$ 取何值时，方程 $${eq}$ 有无穷多个解？`),
          answer: k,
          form: "integer",
          // Not distributing, adding instead of multiplying, and a sign slip.
          wrong: [p, a + p, -k],
          solution: t(
            `Simplify the left side:${steps(`${plus(times(a, 1, p), c, "x")} = ${plus(linear(a, k), c, "x")} = ${linear(a + c, k)}`)}The $x$-terms match, so the two sides are the same expression exactly when $k = ${k}$.`,
            `化简左边：${steps(`${plus(times(a, 1, p), c, "x")} = ${plus(linear(a, k), c, "x")} = ${linear(a + c, k)}`)}含 $x$ 的项相同，所以当且仅当 $k = ${k}$ 时两边是同一个式子。`,
          ),
        });
      },
    },
    {
      id: "choosing-the-multiplier",
      title: t("Choosing the multiplier", "确定括号外的系数"),
      explanation: t(
        "For which $k$ does $k(2x - 3) = 8x - 12$ have infinitely many solutions? Expanding gives $2kx - 3k$. Matching the $x$-terms, $2k = 8$, so $k = 4$; check the constants: $-3 \\cdot 4 = -12$. ✓ Both parts must match: if the constant were $-10$, no value of $k$ would work.",
        "$k$ 取何值时，$k(2x - 3) = 8x - 12$ 有无穷多个解？展开得 $2kx - 3k$。比较含 $x$ 的项，$2k = 8$，所以 $k = 4$；再检验常数项：$-3 \\cdot 4 = -12$。✓ 两部分都必须相同：如果常数项是 $-10$，$k$ 取任何值都不行。",
      ),
      generate(rng) {
        const k = rng.sign() * rng.int(2, 6);
        const b = rng.int(2, 5);
        const p = rng.nonZero(-7, 7);
        const eq = `k(${linear(b, p)}) = ${linear(k * b, k * p)}`;
        return numberProblem({
          prompt: t(`For what value of $k$ does $${eq}$ have infinitely many solutions?`, `$k$ 取何值时，方程 $${eq}$ 有无穷多个解？`),
          answer: k,
          form: "integer",
          // The coefficient of x itself, a difference instead of a quotient, and the constant itself.
          wrong: [k * b, k * b - b, k * p],
          solution: t(
            `Expanding the left side gives $${poly([b, "kx"])} ${p < 0 ? "-" : "+"} ${poly([Math.abs(p), "k"])}$. Match the $x$-terms, then check the constants:${steps(`${b}k = ${k * b} \\Rightarrow k = ${k}`, `${num(p)} \\cdot ${k < 0 ? `(${k})` : k} = ${k * p}`)}`,
            `展开左边得 $${poly([b, "kx"])} ${p < 0 ? "-" : "+"} ${poly([Math.abs(p), "k"])}$。先比较含 $x$ 的项，再检验常数项：${steps(`${b}k = ${k * b} \\Rightarrow k = ${k}`, `${num(p)} \\cdot ${k < 0 ? `(${k})` : k} = ${k * p}`)}`,
          ),
        });
      },
    },
  ],
);

/** linearEquationsWithNoSolutions recognizes equations whose x-terms cancel and leave a false statement. */
export const linearEquationsWithNoSolutions = topic(
  "linear-equations-with-no-solutions",
  t("Linear Equations With No Solutions", "无解的一元一次方程"),
  t(
    "A linear equation has no solution when, after simplifying, the x-terms on the two sides match but the constants do not. Subtracting the x-terms then leaves a false statement such as 5 = 6.",
    "当一元一次方程化简后两边含 x 的项相同而常数项不同时，方程无解。两边同时减去含 x 的项，会得到 5 = 6 这样不成立的式子。",
  ),
  ["linear-equations-with-infinitely-many-solutions"],
  ["8.EE.C.7.A"],
  [
    {
      id: "choosing-the-coefficient",
      title: t("Choosing the coefficient of x", "确定 x 的系数"),
      explanation: t(
        "For which $a$ does $ax + 5 = 3(x + 2)$ have no solution? The right side is $3x + 6$. With $a = 3$ the equation is $3x + 5 = 3x + 6$, and subtracting $3x$ leaves $5 = 6$, which is false. Any other $a$ gives exactly one solution. The constant $6$ is not the answer: it does not multiply $x$.",
        "$a$ 取何值时，$ax + 5 = 3(x + 2)$ 无解？右边是 $3x + 6$。当 $a = 3$ 时方程为 $3x + 5 = 3x + 6$，两边减去 $3x$ 得 $5 = 6$，不成立。$a$ 取其他值时方程恰有一个解。常数 $6$ 不是答案：它不与 $x$ 相乘。",
      ),
      generate(rng) {
        const c = rng.sign() * rng.int(2, 7);
        const p = rng.nonZero(-8, 8);
        let q = rng.nonZero(-20, 20);
        if (q === c * p) q += rng.sign() * rng.int(1, 4);
        const eq = `ax ${q < 0 ? "-" : "+"} ${Math.abs(q)} = ${times(c, 1, p)}`;
        return numberProblem({
          prompt: t(`For what value of $a$ does $${eq}$ have no solution?`, `$a$ 取何值时，方程 $${eq}$ 无解？`),
          answer: c,
          form: "integer",
          // The constant of the right side, its sign changed, and the number in the parentheses.
          wrong: [c * p, -c, p],
          solution: t(
            `The right side is $${linear(c, c * p)}$. With $a = ${c}$ the equation becomes $${linear(c, q)} = ${linear(c, c * p)}$; ${lowerFirst(cancelling(c).en)} leaves $${q} = ${c * p}$, which is false. Any other value of $a$ gives exactly one solution.`,
            `右边是 $${linear(c, c * p)}$。当 $a = ${c}$ 时方程为 $${linear(c, q)} = ${linear(c, c * p)}$；${cancelling(c)["zh-CN"]}，得 $${q} = ${c * p}$，不成立。$a$ 取其他值时方程恰有一个解。`,
          ),
        });
      },
    },
    {
      id: "which-equation-has-no-solution",
      title: t("Which equation has no solution", "哪个方程无解"),
      explanation: t(
        "To decide, simplify each side. $2(x + 3) + x = 3x + 6$ becomes $3x + 6 = 3x + 6$: infinitely many solutions. $2(x + 3) + x = 3x + 5$ becomes $3x + 6 = 3x + 5$: no solution. $2(x + 3) + x = 4x + 5$ has different $x$-terms, so exactly one solution ($x = 1$).",
        "要判断，先化简每一边。$2(x + 3) + x = 3x + 6$ 化为 $3x + 6 = 3x + 6$：有无穷多个解。$2(x + 3) + x = 3x + 5$ 化为 $3x + 6 = 3x + 5$：无解。$2(x + 3) + x = 4x + 5$ 两边含 $x$ 的项不同，所以恰有一个解（$x = 1$）。",
      ),
      generate(rng) {
        const a = rng.sign() * rng.int(2, 6);
        const p = rng.nonZero(-6, 6);
        const q = rng.nonZero(-4, 4);
        if (a + q === 0) return this.generate(rng);
        const [m, k] = [a + q, a * p];
        const lhs = plus(times(a, 1, p), q, "x");
        const off = rng.sign() * rng.int(1, 5);
        // No solution; the same constant (an identity); the x-terms differing; and the constant before multiplying.
        const none = `${lhs} = ${linear(m, k + off)}`;
        const all = `${lhs} = ${linear(m, k)}`;
        const one = `${lhs} = ${linear(m + rng.sign(), k + off)}`;
        const unexpanded = `${lhs} = ${linear(m, p)}`;
        const correct = mathText(none);
        const distractors = [all, one, unexpanded].filter((e) => e !== none);
        return pickChoice(
          rng,
          t(
            `The equations below all have the left side $${lhs}$. Which one has no solution?`,
            `下面的方程左边都是 $${lhs}$。哪个方程无解？`,
          ),
          correct,
          distractors.map(mathText),
          t(
            `The left side of every equation simplifies to $${linear(m, k)}$. Only in $${none}$ does the right side have the same $x$-term, $${poly([m, "x"])}$, with a different constant, $${k + off}$ instead of $${k}$; ${lowerFirst(cancelling(m).en)} leaves $${k} = ${k + off}$, which is false.`,
            `每个方程的左边都化简为 $${linear(m, k)}$。只有在 $${none}$ 中，右边含 $x$ 的项同为 $${poly([m, "x"])}$，而常数项不同（$${k + off}$ 而不是 $${k}$）；${cancelling(m)["zh-CN"]}，得 $${k} = ${k + off}$，不成立。`,
          ),
        );
      },
    },
  ],
);

/** determiningTheNumberOfSolutionsOfALinearEquation simplifies both sides to decide between one, none and infinitely many. */
export const determiningTheNumberOfSolutionsOfALinearEquation = topic(
  "determining-the-number-of-solutions-of-a-linear-equation",
  t("Determining the Number of Solutions of a Linear Equation", "判断一元一次方程解的个数"),
  t(
    "Simplify both sides to the form ax + b = cx + d. If a ≠ c, there is exactly one solution. If a = c and b = d, there are infinitely many. If a = c but b ≠ d, there is none.",
    "把两边化简成 ax + b = cx + d 的形式。若 a ≠ c，恰有一个解；若 a = c 且 b = d，有无穷多个解；若 a = c 而 b ≠ d，无解。",
  ),
  ["linear-equations-with-no-solutions"],
  ["8.EE.C.7.A"],
  [
    {
      id: "counting-solutions-after-expanding",
      title: t("Counting solutions after expanding both sides", "两边展开后判断解的个数"),
      explanation: t(
        "$4(x - 1) + 2x = 3(2x + 1) - 7$. The left side is $6x - 4$ and the right side is $6x + 3 - 7 = 6x - 4$, so the sides are the same and there are infinitely many solutions. Equal $x$-terms alone do not decide it: the constants must be compared too.",
        "$4(x - 1) + 2x = 3(2x + 1) - 7$。左边是 $6x - 4$，右边是 $6x + 3 - 7 = 6x - 4$，两边相同，所以有无穷多个解。仅凭含 $x$ 的项相同还不能下结论：还要比较常数项。",
      ),
      generate(rng) {
        const kind = rng.pick([0, 1, 2] as const);
        const { equation, a, b, c, d } = expandedEquation(rng, kind);
        return choiceProblem({
          prompt: t(`How many solutions does $${equation}$ have?`, `方程 $${equation}$ 有几个解？`),
          options: countOptions,
          correct: countOf(a, b, c, d),
          solution: t(
            `Simplify each side:${steps(`${linear(a, b)} = ${linear(c, d)}`)}${verdictOf(a, b, c, d).en}`,
            `化简两边：${steps(`${linear(a, b)} = ${linear(c, d)}`)}${verdictOf(a, b, c, d)["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "solving-or-classifying",
      title: t("Solving when there is one solution", "恰有一个解时求出它"),
      explanation: t(
        "$5x - 2(x + 4) = x + 6$ simplifies to $3x - 8 = x + 6$. The $x$-terms differ, so there is exactly one solution: $2x = 14$, $x = 7$. When the $x$-terms cancel instead, the answer is no solution or infinitely many, never a particular number.",
        "$5x - 2(x + 4) = x + 6$ 化简为 $3x - 8 = x + 6$。含 $x$ 的项不同，所以恰有一个解：$2x = 14$，$x = 7$。如果含 $x$ 的项被消去，答案就是无解或有无穷多个解，而不是某个具体的数。",
      ),
      generate(rng) {
        const kind = rng.pick([0, 0, 1, 2] as const);
        const { equation, a, b, c, d } = expandedEquation(rng, kind);
        const one = (x: Q) => t(`Exactly one: $x = ${num(x)}$`, `恰有一个：$x = ${num(x)}$`);
        const x = a !== c ? Q.of(d - b, a - c) : Q.zero;
        if (!x.isInteger) return this.generate(rng);
        // A sign slip in moving the constant, or for the other kinds the tempting x = 0.
        const slip = a !== c ? Q.of(d + b, a - c) : Q.of(d - b);
        const options = [one(x), one(slip.eq(x) ? x.add(Q.one) : slip), countOptions[1]!, countOptions[2]!];
        const correct = countOf(a, b, c, d) === 0 ? 0 : countOf(a, b, c, d) === 1 ? 2 : 3;
        const work =
          a !== c
            ? steps(`${linear(a, b)} = ${linear(c, d)}`, `${poly([a - c, "x"])} = ${d - b}`, `x = ${num(x)}`)
            : steps(`${linear(a, b)} = ${linear(c, d)}`);
        return pickChoice(
          rng,
          t(`Solve $${equation}$.`, `解方程 $${equation}$。`),
          options[correct]!,
          options.filter((_, i) => i !== correct),
          t(
            `Simplify each side:${work}${a !== c ? "" : verdictOf(a, b, c, d).en}`,
            `化简两边：${work}${a !== c ? "" : verdictOf(a, b, c, d)["zh-CN"]}`,
          ),
        );
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Horizontal and vertical lines

/** horizontalAndVerticalLines writes the lines x = a and y = b and finds the points on them. */
export const horizontalAndVerticalLines = topic(
  "horizontal-and-vertical-lines",
  t("Horizontal and Vertical Lines", "水平直线和竖直直线"),
  t(
    "Every point of a vertical line has the same x-coordinate, so its equation is x = a. Every point of a horizontal line has the same y-coordinate, so its equation is y = b.",
    "竖直直线上每个点的横坐标都相同，所以它的方程是 x = a。水平直线上每个点的纵坐标都相同，所以它的方程是 y = b。",
  ),
  ["graphing-linear-equations"],
  ["8.EE.B.6"],
  [
    {
      id: "the-line-through-two-points",
      title: t("The line through two points", "过两点的直线"),
      explanation: t(
        "$(3, -1)$ and $(3, 4)$ have the same $x$-coordinate, so the line through them is vertical and its equation is $x = 3$: every point on it has $x = 3$, whatever $y$ is. $(-2, 5)$ and $(6, 5)$ share the $y$-coordinate, so the line through them is horizontal: $y = 5$. A common slip is to write $y = 3$ for the vertical line.",
        "$(3, -1)$ 和 $(3, 4)$ 的横坐标相同，所以过这两点的直线是竖直的，方程为 $x = 3$：无论 $y$ 是多少，直线上每个点都有 $x = 3$。$(-2, 5)$ 和 $(6, 5)$ 的纵坐标相同，所以过它们的直线是水平的：$y = 5$。常见的错误是把竖直直线写成 $y = 3$。",
      ),
      generate(rng) {
        const vertical = rng.bool();
        const same = rng.nonZero(-9, 9);
        const [u, v] = rng.sample(
          Array.from({ length: 19 }, (_, i) => i - 9).filter((n) => n !== same && n !== -same),
          2,
        );
        const [p1, p2] = vertical
          ? [
              [same, u!],
              [same, v!],
            ]
          : [
              [u!, same],
              [v!, same],
            ];
        const [axis, other] = vertical ? ["x", "y"] : ["y", "x"];
        return pickChoice(
          rng,
          t(
            `Which is the equation of the line through $${pointLatex(p1)}$ and $${pointLatex(p2)}$?`,
            `过点 $${pointLatex(p1)}$ 和 $${pointLatex(p2)}$ 的直线的方程是哪一个？`,
          ),
          mathText(`${axis} = ${same}`),
          // The wrong letter, and the coordinate that changes.
          [`${other} = ${same}`, `${other} = ${u}`, `${axis} = ${u}`].map(mathText),
          vertical
            ? t(
                `Both points have $x$-coordinate $${same}$, so the line is vertical: $x = ${same}$.`,
                `两点的横坐标都是 $${same}$，所以直线是竖直的：$x = ${same}$。`,
              )
            : t(
                `Both points have $y$-coordinate $${same}$, so the line is horizontal: $y = ${same}$.`,
                `两点的纵坐标都是 $${same}$，所以直线是水平的：$y = ${same}$。`,
              ),
        );
      },
    },
    {
      id: "points-on-a-horizontal-or-vertical-line",
      figure: gradeDrawings5["horizontal-and-vertical-lines#points-on-a-horizontal-or-vertical-line"],
      title: t("Points on the line", "直线上的点"),
      explanation: t(
        "The line $y = -2$ is horizontal, and a point lies on it exactly when its $y$-coordinate is $-2$: $(7, -2)$ is on it, but $(-2, 7)$ is not. The line $x = 4$ is vertical, and it is parallel to the $y$-axis, not the $x$-axis.",
        "直线 $y = -2$ 是水平的，一个点在这条直线上当且仅当它的纵坐标是 $-2$：$(7, -2)$ 在直线上，而 $(-2, 7)$ 不在。直线 $x = 4$ 是竖直的，它平行于 $y$ 轴，而不是 $x$ 轴。",
      ),
      generate(rng) {
        const vertical = rng.bool();
        const c = rng.nonZero(-8, 8);
        let k = rng.nonZero(-8, 8);
        if (Math.abs(k) === Math.abs(c)) k = Math.abs(c) === 8 ? 1 : Math.abs(c) + 1;
        const point = (x: number, y: number) => mathText(pointLatex([x, y]));
        const [correct, swapped, negated, zero] = vertical
          ? [point(c, k), point(k, c), point(-c, k), point(0, c)]
          : [point(k, c), point(c, k), point(k, -c), point(c, 0)];
        const line = vertical ? `x = ${c}` : `y = ${c}`;
        return pickChoice(
          rng,
          t(`Which point lies on the line $${line}$?`, `哪个点在直线 $${line}$ 上？`),
          correct,
          [swapped, negated, zero],
          vertical
            ? t(
                `The line $${line}$ is vertical: a point is on it exactly when its $x$-coordinate is $${c}$. Only ${correct.en} has $x = ${c}$.`,
                `直线 $${line}$ 是竖直的：一个点在直线上当且仅当它的横坐标是 $${c}$。只有 ${correct["zh-CN"]} 的 $x = ${c}$。`,
              )
            : t(
                `The line $${line}$ is horizontal: a point is on it exactly when its $y$-coordinate is $${c}$. Only ${correct.en} has $y = ${c}$.`,
                `直线 $${line}$ 是水平的：一个点在直线上当且仅当它的纵坐标是 $${c}$。只有 ${correct["zh-CN"]} 的 $y = ${c}$。`,
              ),
        );
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Slope as a unit rate

/** Rate is a context for a proportional relationship: who or what does it, the two quantities and their units. */
interface Rate {
  readonly thing: Text;
  readonly verb: Text;
  readonly quantity: Text;
  readonly x: string;
  readonly y: string;
  readonly xUnit: Text;
  readonly yUnit: Text;
  readonly rate: Text;
  readonly question: Text;
  readonly lo: number;
  readonly hi: number;
}

/** rates are the contexts for unit rates. */
const rates: readonly Rate[] = [
  {
    verb: t("travels", "行驶"),
    quantity: t("distance", "路程"),
    thing: t("Car", "汽车"),
    x: "t",
    y: "d",
    xUnit: t("hours", "小时"),
    yUnit: t("miles", "英里"),
    rate: t("miles per hour", "英里每小时"),
    question: t("Which car is faster?", "哪辆汽车更快？"),
    lo: 35,
    hi: 70,
  },
  {
    verb: t("prints", "打印"),
    quantity: t("page count", "打印的页数"),
    thing: t("Printer", "打印机"),
    x: "m",
    y: "p",
    xUnit: t("minutes", "分钟"),
    yUnit: t("pages", "页"),
    rate: t("pages per minute", "页每分钟"),
    question: t("Which printer prints faster?", "哪台打印机打印得更快？"),
    lo: 12,
    hi: 40,
  },
  {
    verb: t("earns", "挣"),
    quantity: t("earnings", "收入"),
    thing: t("Worker", "工人"),
    x: "h",
    y: "e",
    xUnit: t("hours", "小时"),
    yUnit: t("dollars", "美元"),
    rate: t("dollars per hour", "美元每小时"),
    question: t("Which worker earns more per hour?", "哪位工人每小时挣得更多？"),
    lo: 14,
    hi: 32,
  },
  {
    verb: t("fills", "放出"),
    quantity: t("volume of water", "放出的水量"),
    thing: t("Faucet", "水龙头"),
    x: "m",
    y: "v",
    xUnit: t("minutes", "分钟"),
    yUnit: t("liters", "升"),
    rate: t("liters per minute", "升每分钟"),
    question: t("Which faucet fills faster?", "哪个水龙头放水更快？"),
    lo: 6,
    hi: 18,
  },
];

/** slopeAsAUnitRateInProportionalRelationships reads the unit rate of a proportional relationship as the slope of its graph. */
export const slopeAsAUnitRateInProportionalRelationships = topic(
  "slope-as-a-unit-rate-in-proportional-relationships",
  t("Slope as a Unit Rate in Proportional Relationships", "比例关系中作为单位比率的斜率"),
  t(
    "The graph of a proportional relationship y = kx is a line through the origin whose slope is k, the unit rate: the change in y for each increase of 1 in x. Unit rates let relationships given in different ways be compared.",
    "比例关系 y = kx 的图像是过原点的直线，它的斜率就是 k，即单位比率：x 每增加 1 时 y 的变化量。借助单位比率，可以比较以不同方式给出的比例关系。",
  ),
  ["slope-of-a-line", "understanding-proportional-relationships-using-graphs"],
  ["8.EE.B.5"],
  [
    {
      id: "unit-rate-from-two-points",
      figure: gradeDrawings5["slope-as-a-unit-rate-in-proportional-relationships#unit-rate-from-two-points"],
      title: t("The unit rate from two points on the graph", "由图像上的两点求单位比率"),
      explanation: t(
        "A car's distance $d$ (miles) is proportional to the time $t$ (hours), and the graph passes through $(2, 110)$ and $(5, 275)$. The slope is $\\frac{275 - 110}{5 - 2} = \\frac{165}{3} = 55$, so the car travels $55$ miles per hour. Dividing the other way, $\\frac{3}{165}$, gives hours per mile instead.",
        "汽车行驶的路程 $d$（英里）与时间 $t$（小时）成正比，图像经过 $(2, 110)$ 和 $(5, 275)$。斜率为 $\\frac{275 - 110}{5 - 2} = \\frac{165}{3} = 55$，所以汽车每小时行驶 $55$ 英里。反过来相除得 $\\frac{3}{165}$，那是每英里所需的小时数。",
      ),
      generate(rng) {
        const c = rng.pick(rates);
        const k = rng.int(c.lo, c.hi);
        const [x1, x2] = rng.sample([1, 2, 3, 4, 5, 6, 7, 8], 2).sort((a, b) => a - b) as [number, number];
        const [y1, y2] = [k * x1, k * x2];
        const thing = t(c.thing.en.toLowerCase(), c.thing["zh-CN"]);
        return numberProblem({
          prompt: t(
            `The ${c.quantity.en} $${c.y}$ (${c.yUnit.en}) of a ${thing.en} ${c.quantity.en === "earnings" ? "are" : "is"} proportional to the time $${c.x}$ (${c.xUnit.en}), and the graph passes through $${pointLatex([x1, y1])}$ and $${pointLatex([x2, y2])}$. What is the slope of the graph, in ${c.rate.en}?`,
            `某${thing["zh-CN"]}的${c.quantity["zh-CN"]} $${c.y}$（${c.yUnit["zh-CN"]}）与时间 $${c.x}$（${c.xUnit["zh-CN"]}）成正比，图像经过 $${pointLatex([x1, y1])}$ 和 $${pointLatex([x2, y2])}$。图像的斜率是多少（单位：${c.rate["zh-CN"]}）？`,
          ),
          answer: k,
          form: "integer",
          // The rate the other way round, the change in y alone, and the second y-coordinate.
          wrong: [Q.of(x2 - x1, y2 - y1), y2 - y1, y2],
          solution: t(
            `The slope is the change in $${c.y}$ divided by the change in $${c.x}$:${steps(`\\frac{${y2} - ${y1}}{${x2} - ${x1}} = ${x2 - x1 === 1 ? "" : `\\frac{${y2 - y1}}{${x2 - x1}} = `}${k}`)}So the unit rate is $${k}$ ${c.rate.en}.`,
            `斜率等于 $${c.y}$ 的变化量除以 $${c.x}$ 的变化量：${steps(`\\frac{${y2} - ${y1}}{${x2} - ${x1}} = ${x2 - x1 === 1 ? "" : `\\frac{${y2 - y1}}{${x2 - x1}} = `}${k}`)}所以单位比率是 $${k}$ ${c.rate["zh-CN"]}。`,
          ),
        });
      },
    },
    {
      id: "comparing-unit-rates",
      title: t("Comparing two proportional relationships", "比较两个比例关系"),
      explanation: t(
        "Car A travels $d = 52t$ miles in $t$ hours. Car B travels $165$ miles in $3$ hours at a constant speed, so its unit rate is $165 \\div 3 = 55$ miles per hour. Since $55 > 52$, car B is faster. Compare the unit rates, not the numbers as they are written.",
        "汽车 A 在 $t$ 小时内行驶 $d = 52t$ 英里。汽车 B 匀速行驶，$3$ 小时行驶 $165$ 英里，所以它的单位比率是 $165 \\div 3 = 55$ 英里每小时。因为 $55 > 52$，所以汽车 B 更快。要比较的是单位比率，而不是题目中直接写出的数。",
      ),
      generate(rng) {
        const c = rng.pick(rates);
        const ka = rng.int(c.lo, c.hi);
        let kb = rng.int(c.lo, c.hi);
        if (kb === ka) kb += rng.sign() * rng.int(1, 3);
        const x = rng.int(3, 8);
        const y = kb * x;
        const [a, b] = [t(`${c.thing.en} A`, `${c.thing["zh-CN"]} A`), t(`${c.thing.en} B`, `${c.thing["zh-CN"]} B`)];
        const faster = ka > kb ? a : b;
        return choiceProblem({
          prompt: t(
            `${a.en} ${c.verb.en} $${c.y} = ${ka}${c.x}$ ${c.yUnit.en} in $${c.x}$ ${c.xUnit.en}. ${b.en} works at a constant rate and ${c.verb.en} $${y}$ ${c.yUnit.en} in $${x}$ ${c.xUnit.en}. ${c.question.en}`,
            `${a["zh-CN"]} 在 $${c.x}$ ${c.xUnit["zh-CN"]}内${c.verb["zh-CN"]} $${c.y} = ${ka}${c.x}$ ${c.yUnit["zh-CN"]}。${b["zh-CN"]} 匀速工作，$${x}$ ${c.xUnit["zh-CN"]}内${c.verb["zh-CN"]} $${y}$ ${c.yUnit["zh-CN"]}。${c.question["zh-CN"]}`,
          ),
          options: [a, b],
          correct: ka > kb ? 0 : 1,
          solution: t(
            `The unit rate of ${a.en} is the coefficient $${ka}$ ${c.rate.en}. The unit rate of ${b.en} is $${y} \\div ${x} = ${kb}$ ${c.rate.en}. Since $${Math.max(ka, kb)} > ${Math.min(ka, kb)}$, the answer is ${faster.en}.`,
            `${a["zh-CN"]} 的单位比率是系数 $${ka}$ ${c.rate["zh-CN"]}。${b["zh-CN"]} 的单位比率是 $${y} \\div ${x} = ${kb}$ ${c.rate["zh-CN"]}。因为 $${Math.max(ka, kb)} > ${Math.min(ka, kb)}$，所以答案是${faster["zh-CN"]}。`,
          ),
        });
      },
    },
  ],
);

/** grade8LinearEquationTopics lists the 8th grade topics on linear equations and lines. */
export const grade8LinearEquationTopics: readonly TopicDef[] = [
  linearEquationsWithInfinitelyManySolutions,
  linearEquationsWithNoSolutions,
  determiningTheNumberOfSolutionsOfALinearEquation,
  horizontalAndVerticalLines,
  slopeAsAUnitRateInProportionalRelationships,
];
