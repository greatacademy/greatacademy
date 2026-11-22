import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { linear, type PlaneMark, type PlaneView, plane, poly, Q } from "@ga/subject-math";
import { algebraDrawings } from "../explanation-drawings-algebra.ts";
import { remainingDrawings3 } from "../explanation-drawings-remaining-3.ts";
import { annotate, at } from "../graph-figures.ts";
import { numberProblem, pointLatex, steps } from "../problems.ts";
import { valueRows, view } from "../solution-kit.ts";
import { mathText, pickChoice } from "./grade-4-fractions.ts";

// Algebra I, systems of equations: approximating the solutions of systems of linear and nonlinear equations from
// graphs and tables of values, and refining an estimate to tenths.

const tallView: PlaneView = { xMin: -6, xMax: 6, yMin: -6, yMax: 12, labelEvery: 2 };

/** halfSlopes are the slopes of lines that are easy to draw through grid points. */
const halfSlopes: readonly Q[] = [-3, -2, -1, 1, 2, 3].map((n) => Q.of(n)).concat([Q.of(1, 2), Q.of(-1, 2)]);

/** offGrid is the distance from v to the nearest integer. */
const offGrid = (v: number) => Math.abs(v - Math.round(v));

/** approx writes a number to two decimal places. */
const approx = (v: number) => (Math.round(v * 100) / 100).toString();

/** plain writes a LaTeX expression for alt text: superscript squares, fractions with a slash, true minus signs. */
const plain = (latex: string) =>
  latex
    .replace(/\\frac\{(\d+)\}\{(\d+)\}/g, "$1/$2")
    .replace(/\^\{2\}/g, "²")
    .replace(/-/g, "−")
    .replace(/[{}]/g, "");

/** lineMark draws y = mx + b. */
const lineMark = (m: Q, b: Q, accent: boolean): PlaneMark => ({
  kind: "line",
  a: [0, b.toNumber()],
  b: [1, m.add(b).toNumber()],
  accent,
});

/** between is the choice "between x = a and x = b". */
const between = (a: string, b: string): Text => t(`Between $x = ${a}$ and $x = ${b}$`, `在 $x = ${a}$ 与 $x = ${b}$ 之间`);

/** neighborIntervals are the consecutive pairs of xs other than the one starting at index i, nearest first. */
function neighborIntervals(xs: readonly number[], i: number): Text[] {
  return xs
    .slice(0, -1)
    .map((x, j) => ({ j, text: between(String(x), String(xs[j + 1])) }))
    .filter(({ j }) => j !== i)
    .sort((p, q) => Math.abs(p.j - i) - Math.abs(q.j - i))
    .map(({ text }) => text);
}

/** linePair draws two lines y = m1·x + b1, y = m2·x + b2 meeting at a point inside the view, not on a grid point. */
function linePair(rng: Rng, slopes: readonly Q[], near: number): { m: [Q, Q]; b: [Q, Q]; x: Q; y: Q } {
  for (;;) {
    const [m1, m2] = rng.sample(slopes, 2) as [Q, Q];
    const [b1, b2] = [Q.of(rng.int(-5, 5)), Q.of(rng.int(-5, 5))];
    const x = b2.sub(b1).div(m1.sub(m2));
    const y = m1.mul(x).add(b1);
    const [xn, yn] = [x.toNumber(), y.toNumber()];
    if (Math.abs(xn) > 4.5 || Math.abs(yn) > 4.5) continue;
    if (x.d === 1n && y.d === 1n) continue;
    if (offGrid(xn) > near || offGrid(yn) > near) continue;
    return { m: [m1, m2], b: [b1, b2], x, y };
  }
}

/** linesIntro draws y = 2x − 1 and y = −x + 3, which cross at (4/3, 5/3), between grid points. */
const linesIntro: Figure = {
  svg: plane(view, [
    lineMark(Q.of(2), Q.of(-1), true),
    lineMark(Q.of(-1), Q.of(3), false),
    { kind: "point", at: [4 / 3, 5 / 3], tone: "result" },
  ]),
  alt: t(
    "The lines y = 2x − 1 and y = −x + 3 cross a little to the right of x = 1 and a little below y = 2.",
    "直线 y = 2x − 1 与 y = −x + 3 在 x = 1 稍右、y = 2 稍下的位置相交。",
  ),
};

/** leans says on which side of the grid lines X and Y a crossing at (x, y) lies. */
const leans = (dx: number, dy: number, X: number, Y: number): Text =>
  t(
    `a little to the ${dx > 0 ? "right" : "left"} of $x = ${X}$ and a little ${dy > 0 ? "above" : "below"} $y = ${Y}$`,
    `$x = ${X}$ 稍${dx > 0 ? "右" : "左"}、$y = ${Y}$ 稍${dy > 0 ? "上" : "下"}的位置`,
  );

/** substituted writes m·(x) + b = m·x + b = value, the value of mx + b at x. */
function substituted(m: Q, b: Q, x: Q): string {
  const coef = m.eq(Q.of(1)) ? "" : m.eq(Q.of(-1)) ? "-" : m.toLatex();
  const constant = b.n === 0n ? "" : b.n > 0n ? ` + ${b.toLatex()}` : ` - ${b.neg().toLatex()}`;
  return `${coef}\\left(${x.toLatex()}\\right)${constant} = ${m.mul(x).toLatex()}${constant} = ${m.mul(x).add(b).toLatex()}`;
}

/** approximatingSolutionsToSystemsOfLinearEquations estimates the solution of a linear system from a graph or a table. */
export const approximatingSolutionsToSystemsOfLinearEquations: TopicDef = {
  id: "approximating-solutions-to-systems-of-linear-equations",
  title: t("Approximating Solutions to Systems of Linear Equations", "估计线性方程组的解"),
  summary: t(
    "Estimate the solution of a system of two linear equations when the lines do not cross at a grid point: read the nearest grid point from a graph, locate the crossing between two x-values in a table, and confirm an estimate by solving exactly.",
    "当两直线不在网格点处相交时估计线性方程组的解：从图象上读出最近的网格点，在数值表中找出交点位于哪两个 $x$ 值之间，并通过精确求解来验证估计。",
  ),
  prerequisites: ["solving-systems-by-substitution"],
  encompasses: [],
  xp: 12,
  standards: ["CCSS.HSA.REI.D.11", "CCSS.8.EE.C.8.B"],
  intro: t(
    `The solution of a system of two linear equations is the point where their lines cross, and substitution finds it exactly. Often, though, we first meet a system as a graph or a table, and the crossing does not land on a grid point. Then the graph or table still tells us roughly where the solution is, which is useful for checking an exact answer and is sometimes all a problem needs.

{{figure 0}}

The lines $y = 2x - 1$ and $y = -x + 3$ cross a little to the right of $x = 1$ and a little below $y = 2$, so the solution is approximately $(1, 2)$. Solving $2x - 1 = -x + 3$ gives the exact solution $\\left(\\frac{4}{3}, \\frac{5}{3}\\right) \\approx (1.33, 1.67)$, which agrees.

In this lesson we estimate solutions from graphs, locate them in tables of values, and confirm estimates by solving exactly.`,
    `两个线性方程组成的方程组的解，就是两条直线的交点，用代入法可以精确地求出它。不过，我们常常先看到的是方程组的图象或数值表，而交点并不恰好落在网格点上。这时图象或数值表仍能告诉我们解大约在哪里：这既可以用来检验精确答案，有时也正是题目所需要的。

{{figure 0}}

直线 $y = 2x - 1$ 与 $y = -x + 3$ 在 $x = 1$ 稍右、$y = 2$ 稍下的位置相交，所以解约为 $(1, 2)$。解方程 $2x - 1 = -x + 3$ 得到精确解 $\\left(\\frac{4}{3}, \\frac{5}{3}\\right) \\approx (1.33, 1.67)$，与估计相符。

这节课我们从图象估计解，在数值表中确定解的位置，并通过精确求解来验证估计。`,
  ),
  introFigures: [linesIntro],
  knowledgePoints: [
    {
      id: "estimating-from-a-graph",
      figure: algebraDrawings["approximating-solutions-to-systems-of-linear-equations#estimating-from-a-graph"],
      title: t("Estimating from a graph", "从图象估计"),
      explanation: t(
        `Every point on a line satisfies its equation, so the point where two lines cross satisfies both: it is the solution of the system. When the lines cross between grid points, the graph cannot show the exact coordinates, but it does show which grid point the crossing is closest to, and that grid point is the best estimate of the solution.

For example, if the lines meet a little to the right of $x = 2$ and a little below $y = 1$, the nearest grid point is $(2, 1)$, so the solution is approximately $(2, 1)$. An estimate is not the solution itself: substituting $(2, 1)$ into the equations makes them only nearly true.

> **Watch out.** A crossing a little to the right of $x = 2$ is still nearest to $x = 2$: do not move on to the next grid line in the direction the crossing leans, for either coordinate. And write the $x$-coordinate first: $(2, 1)$ and $(1, 2)$ are different points.`,
        `直线上的每个点都满足它的方程，所以两直线的交点同时满足两个方程：它就是方程组的解。当两直线在网格点之间相交时，图象无法显示精确坐标，但能显示交点离哪个网格点最近，这个网格点就是解的最佳估计。

例如，如果两直线在 $x = 2$ 稍右、$y = 1$ 稍下的位置相交，那么最近的网格点是 $(2, 1)$，所以解约为 $(2, 1)$。估计值不是解本身：把 $(2, 1)$ 代入方程只会使方程近似成立。

> **注意。** 在 $x = 2$ 稍右的交点仍然离 $x = 2$ 最近：无论哪个坐标，都不要顺着交点偏离的方向跳到下一条网格线。另外要先写 $x$ 坐标：$(2, 1)$ 与 $(1, 2)$ 是不同的点。`,
      ),
      generate(rng) {
        const { m, b, x, y } = linePair(rng, halfSlopes, 0.3);
        const [X, Y] = [Math.round(x.toNumber()), Math.round(y.toNumber())];
        const dx = x.toNumber() > X ? 1 : -1;
        const dy = y.toNumber() > Y ? 1 : -1;
        const [l1, l2] = [linear(m[0], b[0]), linear(m[1], b[1])];
        const pt = (p: number, q: number) => mathText(pointLatex([p, q]));
        const figure: Figure = {
          svg: plane(view, [lineMark(m[0], b[0], true), lineMark(m[1], b[1], false)]),
          alt: t(
            `The lines y = ${plain(l1)} and y = ${plain(l2)} drawn on the same grid.`,
            `在同一网格中画出的直线 y = ${plain(l1)} 与 y = ${plain(l2)}。`,
          ),
        };
        const where = leans(dx, dy, X, Y);
        return annotate(
          pickChoice(
            rng,
            t(
              `The graphs of the system $y = ${l1}$, $y = ${l2}$ are shown. Which point is the best estimate of the solution?`,
              `图中是方程组 $y = ${l1}$，$y = ${l2}$ 的图象。哪个点是方程组的解的最佳估计？`,
            ),
            pt(X, Y),
            [pt(Y, X), pt(X + dx, Y), pt(X, Y + dy), pt(X + dx, Y + dy)],
            t(
              `**Step 1: Find the crossing.** The two lines cross ${where.en}, between grid points.

**Step 2: Take the nearest grid point.** The crossing is closer to $x = ${X}$ than to $x = ${X + dx}$, and closer to $y = ${Y}$ than to $y = ${Y + dy}$. So the best estimate is $${pointLatex([X, Y])}$, with the $x$-coordinate first.

**Check.** Solving exactly, $${l1} = ${l2}$ gives $x = ${x.toLatex()}$, and then $y = ${y.toLatex()}$. The solution is about $(${approx(x.toNumber())}, ${approx(y.toNumber())})$, and the nearest grid point is indeed $${pointLatex([X, Y])}$.`,
              `**第一步：找到交点。** 两直线在${where["zh-CN"]}相交，位于网格点之间。

**第二步：取最近的网格点。** 交点离 $x = ${X}$ 比离 $x = ${X + dx}$ 近，离 $y = ${Y}$ 比离 $y = ${Y + dy}$ 近。所以最佳估计是 $${pointLatex([X, Y])}$，$x$ 坐标写在前面。

**检验。** 精确求解：由 $${l1} = ${l2}$ 得 $x = ${x.toLatex()}$，进而 $y = ${y.toLatex()}$。解约为 $(${approx(x.toNumber())}, ${approx(y.toNumber())})$，离它最近的网格点确实是 $${pointLatex([X, Y])}$。`,
            ),
            figure,
          ),
          view,
          [{ kind: "point", at: [x.toNumber(), y.toNumber()], tone: "result" }],
          `The lines cross near ${at([X, Y])}.`,
          `两直线的交点接近 ${at([X, Y])}。`,
        );
      },
    },
    {
      id: "locating-the-solution-in-a-table",
      title: t("Locating the solution in a table", "在数值表中确定解的位置"),
      explanation: t(
        `A table of values of $f(x)$ and $g(x)$ shows where the lines $y = f(x)$ and $y = g(x)$ cross even when the crossing is not in the table. On one side of the crossing one line is below the other; on the other side it is above. So compare the two rows column by column: where $f(x)$ is below $g(x)$ at one $x$-value and above it at the next, or the other way around, the lines have crossed in between, and the $x$-coordinate of the solution lies between those two $x$-values.

For $f(x) = 2x - 1$ and $g(x) = -x + 3$: at $x = 1$, $f(1) = 1$ is below $g(1) = 2$; at $x = 2$, $f(2) = 3$ is above $g(2) = 1$. The order switches, so the solution has $x$ between $1$ and $2$ (exactly $x = \\frac{4}{3}$).

> **Watch out.** Look for the switch itself. In every other pair of neighboring columns the same row stays on top at both ends, so the lines do not cross there, even in the pairs right next to the switch. The answer is the pair of $x$-values on either side of the switch.`,
        `即使交点不在表中，$f(x)$ 与 $g(x)$ 的数值表也能显示直线 $y = f(x)$ 与 $y = g(x)$ 在哪里相交。在交点的一侧，一条直线在另一条下方；在另一侧，它在上方。所以逐列比较两行数值：如果在某个 $x$ 值处 $f(x)$ 小于 $g(x)$，而在下一个 $x$ 值处大于 $g(x)$（或者反过来），那么两直线在这两个 $x$ 值之间相交，解的 $x$ 坐标就位于这两个 $x$ 值之间。

对于 $f(x) = 2x - 1$ 与 $g(x) = -x + 3$：在 $x = 1$ 处，$f(1) = 1$ 小于 $g(1) = 2$；在 $x = 2$ 处，$f(2) = 3$ 大于 $g(2) = 1$。大小关系发生了改变，所以解的 $x$ 位于 $1$ 与 $2$ 之间（精确值为 $x = \\frac{4}{3}$）。

> **注意。** 要找的是大小关系改变的那一处。其他每一对相邻的列中，两端都是同一行较大，所以两直线在那里不相交，紧挨着改变处的那几对也是如此。答案是改变处两侧的那一对 $x$ 值。`,
      ),
      generate(rng) {
        const intSlopes = [-4, -3, -2, -1, 1, 2, 3, 4].map((n) => Q.of(n));
        const { m, b, x } = linePair(rng, intSlopes, 0.5);
        const lo = Math.floor(x.toNumber());
        const start = lo - rng.int(0, 4);
        const xs = Array.from({ length: 6 }, (_, j) => start + j);
        const f = (v: number) => m[0].mul(Q.of(v)).add(b[0]).toNumber();
        const g = (v: number) => m[1].mul(Q.of(v)).add(b[1]).toNumber();
        const [l1, l2] = [linear(m[0], b[0]), linear(m[1], b[1])];
        const i = lo - start;
        const above = (v: number) => (f(v) > g(v) ? t("above", "大于") : t("below", "小于"));
        return pickChoice(
          rng,
          t(
            `The table gives values of $f(x) = ${l1}$ and $g(x) = ${l2}$. ${valueRows(xs, [
              ["f(x)", xs.map(f)],
              ["g(x)", xs.map(g)],
            ])}Between which two consecutive $x$-values in the table does the $x$-coordinate of the solution of the system $y = f(x)$, $y = g(x)$ lie?`,
            `下表给出了 $f(x) = ${l1}$ 与 $g(x) = ${l2}$ 的值。${valueRows(xs, [
              ["f(x)", xs.map(f)],
              ["g(x)", xs.map(g)],
            ])}方程组 $y = f(x)$，$y = g(x)$ 的解的 $x$ 坐标位于表中哪两个相邻的 $x$ 值之间？`,
          ),
          between(String(lo), String(lo + 1)),
          neighborIntervals(xs, i),
          t(
            `**Step 1: Compare the rows column by column.** At $x = ${lo}$, $f(x) = ${f(lo)}$ is ${above(lo).en} $g(x) = ${g(lo)}$; at $x = ${lo + 1}$, $f(x) = ${f(lo + 1)}$ is ${above(lo + 1).en} $g(x) = ${g(lo + 1)}$.

**Step 2: Find the switch.** The order switches between these two columns, so the lines cross between $x = ${lo}$ and $x = ${lo + 1}$. In every other pair of neighboring columns the same row stays on top.

**Check.** Solving $${l1} = ${l2}$ exactly gives $x = ${x.toLatex()} \\approx ${approx(x.toNumber())}$, which indeed lies between $${lo}$ and $${lo + 1}$.`,
            `**第一步：逐列比较两行。** 在 $x = ${lo}$ 处，$f(x) = ${f(lo)}$ ${above(lo)["zh-CN"]} $g(x) = ${g(lo)}$；在 $x = ${lo + 1}$ 处，$f(x) = ${f(lo + 1)}$ ${above(lo + 1)["zh-CN"]} $g(x) = ${g(lo + 1)}$。

**第二步：找出大小关系改变处。** 大小关系在这两列之间发生了改变，所以两直线在 $x = ${lo}$ 与 $x = ${lo + 1}$ 之间相交。其他每一对相邻的列中，都是同一行保持较大。

**检验。** 精确解方程 $${l1} = ${l2}$ 得 $x = ${x.toLatex()} \\approx ${approx(x.toNumber())}$，确实位于 $${lo}$ 与 $${lo + 1}$ 之间。`,
          ),
        );
      },
    },
    {
      id: "confirming-an-estimate",
      figure: algebraDrawings["approximating-solutions-to-systems-of-linear-equations#confirming-an-estimate"],
      title: t("Confirming an estimate by solving", "通过求解验证估计"),
      explanation: t(
        `A graph gives an estimate; algebra gives the exact solution. At the solution both equations give the same $y$, so setting the two expressions for $y$ equal leaves one equation in $x$ alone. Solve it, and compare the result with the estimate: they should be close.

For $y = 2x - 1$ and $y = -x + 3$, setting $2x - 1 = -x + 3$ and moving the $x$-terms to the left and the numbers to the right gives $2x + x = 3 + 1$, so $3x = 4$ and $x = \\frac{4}{3} \\approx 1.33$. This agrees with a graph that shows the lines crossing a little to the right of $x = 1$.

> **Watch out.** A term changes sign when it moves across the equals sign: $-x$ on the right becomes $+x$ on the left, and $-1$ on the left becomes $+1$ on the right. Keep the sign of the quotient as well. The question asks for the exact $x$, not the estimate from the graph, and not the $y$-coordinate.`,
        `图象给出估计值，代数给出精确解。在解处两个方程给出相同的 $y$，所以令 $y$ 的两个表达式相等，就得到只含 $x$ 的一个方程。解出它，再与估计值比较：二者应当接近。

对于 $y = 2x - 1$ 和 $y = -x + 3$，令 $2x - 1 = -x + 3$，把含 $x$ 的项移到左边、数移到右边，得 $2x + x = 3 + 1$，所以 $3x = 4$，$x = \\frac{4}{3} \\approx 1.33$。这与图象上两直线在 $x = 1$ 稍右处相交相符。

> **注意。** 项移过等号时要变号：右边的 $-x$ 移到左边变成 $+x$，左边的 $-1$ 移到右边变成 $+1$。商的符号也要保留。题目要的是 $x$ 的精确值，不是图象上的估计值，也不是 $y$ 坐标。`,
      ),
      generate(rng) {
        const intSlopes = [-4, -3, -2, -1, 1, 2, 3, 4].map((n) => Q.of(n));
        const { m, b, x, y } = linePair(rng, intSlopes, 0.4);
        const [l1, l2] = [linear(m[0], b[0]), linear(m[1], b[1])];
        const [X, Y] = [Math.round(x.toNumber()), Math.round(y.toNumber())];
        const dm = m[0].sub(m[1]);
        const db = b[1].sub(b[0]);
        return numberProblem({
          prompt: t(
            `A graph of the system $y = ${l1}$, $y = ${l2}$ shows the lines crossing near $${pointLatex([X, Y])}$. Find the exact $x$-coordinate of the solution.`,
            `方程组 $y = ${l1}$，$y = ${l2}$ 的图象显示两直线在 $${pointLatex([X, Y])}$ 附近相交。求解的 $x$ 坐标的精确值。`,
          ),
          answer: x,
          wrong: [Q.of(X), x.neg(), b[1].add(b[0]).div(dm), ...(m[0].eq(m[1].neg()) ? [] : [db.div(m[0].add(m[1]))]), y],
          solution: t(
            `**Step 1: Set the two expressions for $y$ equal.** At the solution both equations give the same $y$, so $${l1} = ${l2}$.

**Step 2: Solve for $x$.** Move the $x$-terms to the left and the numbers to the right, changing their signs, then divide:${steps(`${l1} = ${l2}`, `${linear(dm, 0)} = ${db.toLatex()}`, `x = ${x.toLatex()} \\approx ${approx(x.toNumber())}`)}This is close to the estimate $x \\approx ${X}$, as it should be.

**Check.** Substitute $x = ${x.toLatex()}$ into both equations: $${substituted(m[0], b[0], x)}$ and $${substituted(m[1], b[1], x)}$. Both give the same $y$, so the point is on both lines.`,
            `**第一步：令 $y$ 的两个表达式相等。** 在解处两个方程给出相同的 $y$，所以 $${l1} = ${l2}$。

**第二步：解出 $x$。** 把含 $x$ 的项移到左边、数移到右边（移项要变号），再相除：${steps(`${l1} = ${l2}`, `${linear(dm, 0)} = ${db.toLatex()}`, `x = ${x.toLatex()} \\approx ${approx(x.toNumber())}`)}这与估计值 $x \\approx ${X}$ 接近，符合预期。

**检验。** 把 $x = ${x.toLatex()}$ 代入两个方程：$${substituted(m[0], b[0], x)}$，$${substituted(m[1], b[1], x)}$。两者给出相同的 $y$，所以这个点在两条直线上。`,
          ),
        });
      },
    },
  ],
};

/** parabolaAndLine draws y = x² + c and y = mx + b crossing twice, at irrational x-values, with the greater crossing inside the view. */
function parabolaAndLine(rng: Rng): { c: number; m: number; b: number; d: number; lo: number; hi: number } {
  for (;;) {
    const c = rng.int(-5, 0);
    const m = rng.int(-3, 3);
    const b = rng.int(-2, 5);
    const d = m * m - 4 * (c - b);
    if (d <= 0 || Number.isInteger(Math.sqrt(d))) continue;
    const [lo, hi] = [(m - Math.sqrt(d)) / 2, (m + Math.sqrt(d)) / 2];
    if (hi > 4.5 || hi < 0.5 || m * hi + b > 11) continue;
    return { c, m, b, d, lo, hi };
  }
}

/** rootLatex writes (m + √d)/2. */
const rootLatex = (m: number, d: number) => `\\frac{${m === 0 ? "" : `${m} + `}\\sqrt{${d}}}{2}`;

/** tenths writes n/10 as a decimal with one place. */
const tenths = (n: number) => `${n < 0 ? "-" : ""}${Math.floor(Math.abs(n) / 10)}.${Math.abs(n) % 10}`;

/** hundredths writes n/100 as a decimal with two places. */
const hundredths = (n: number) => `${Math.floor(n / 100)}.${String(n % 100).padStart(2, "0")}`;

/** parabolaIntro draws y = x² − 2 and y = x + 1, which cross at x = (1 ± √13)/2 ≈ −1.30 and 2.30. */
const parabolaIntro: Figure = {
  svg: plane(tallView, [
    { kind: "curve", f: (v) => v * v - 2 },
    { kind: "line", a: [0, 1], b: [1, 2], accent: true },
    { kind: "point", at: [(1 - Math.sqrt(13)) / 2, (3 - Math.sqrt(13)) / 2], tone: "result" },
    { kind: "point", at: [(1 + Math.sqrt(13)) / 2, (3 + Math.sqrt(13)) / 2], tone: "result" },
  ]),
  alt: t(
    "The parabola y = x² − 2 and the line y = x + 1 cross twice: near x = −1 and near x = 2.",
    "抛物线 y = x² − 2 与直线 y = x + 1 相交两次：一次在 x = −1 附近，一次在 x = 2 附近。",
  ),
};

/** approximatingSolutionsToSystemsOfNonlinearEquations estimates where a parabola meets a line from a graph or a table. */
export const approximatingSolutionsToSystemsOfNonlinearEquations: TopicDef = {
  id: "approximating-solutions-to-systems-of-nonlinear-equations",
  title: t("Approximating Solutions to Systems of Nonlinear Equations", "估计非线性方程组的解"),
  summary: t(
    "Estimate where a parabola meets a line when the crossings are not at grid points: read the nearest integer from a graph, locate a crossing between two x-values in a table, and narrow it down to tenths.",
    "当抛物线与直线不在网格点处相交时估计交点：从图象上读出最接近的整数，在数值表中找出交点位于哪两个 $x$ 值之间，并把范围缩小到十分位。",
  ),
  prerequisites: ["solving-systems-of-nonlinear-equations-using-graphs", "approximating-solutions-to-systems-of-linear-equations"],
  encompasses: [{ topic: "solving-systems-of-nonlinear-equations-using-graphs", weight: 0.4 }],
  xp: 12,
  standards: ["CCSS.HSA.REI.D.11"],
  intro: t(
    `We have solved systems of a parabola and a line by reading their crossings from a graph, and we have estimated the solution of two lines that cross between grid points. A parabola and a line often cross between grid points too, and then their coordinates are usually irrational: no graph shows them exactly, so an estimate is the practical answer.

{{figure 0}}

The parabola $y = x^{2} - 2$ and the line $y = x + 1$ cross twice. The right-hand crossing is nearest to $x = 2$. A table narrows it down: at $x = 2$ the parabola is below the line ($2 < 3$), at $x = 3$ it is above ($7 > 4$). Testing tenths, at $x = 2.3$ the parabola is still below ($3.29 < 3.3$) and at $x = 2.4$ it is above ($3.76 > 3.4$), so the crossing lies between $2.3$ and $2.4$. Exactly, it is at $x = \\frac{1 + \\sqrt{13}}{2} \\approx 2.30$.

In this lesson we estimate such solutions from a graph, locate them in a table, and narrow them down to tenths.`,
    `我们已经会从图象上读出抛物线与直线的交点来解方程组，也会估计在网格点之间相交的两条直线的解。抛物线与直线也常常在网格点之间相交，这时交点坐标通常是无理数：任何图象都无法精确显示它们，所以估计值就是实用的答案。

{{figure 0}}

抛物线 $y = x^{2} - 2$ 与直线 $y = x + 1$ 相交两次。右边的交点离 $x = 2$ 最近。数值表可以缩小范围：在 $x = 2$ 处抛物线在直线下方（$2 < 3$），在 $x = 3$ 处在上方（$7 > 4$）。再检验十分位数：在 $x = 2.3$ 处抛物线仍在下方（$3.29 < 3.3$），在 $x = 2.4$ 处在上方（$3.76 > 3.4$），所以交点位于 $2.3$ 与 $2.4$ 之间。精确地说，它在 $x = \\frac{1 + \\sqrt{13}}{2} \\approx 2.30$ 处。

这节课我们从图象估计这样的解，在数值表中确定它们的位置，并把它们缩小到十分位。`,
  ),
  introFigures: [parabolaIntro],
  knowledgePoints: [
    {
      id: "estimating-from-a-graph",
      figure: algebraDrawings["approximating-solutions-to-systems-of-nonlinear-equations#estimating-from-a-graph"],
      title: t("Estimating from a graph", "从图象估计"),
      explanation: t(
        `A parabola and a line can cross at points whose coordinates are irrational, such as $x = \\frac{1 + \\sqrt{13}}{2} \\approx 2.30$. A graph cannot show such a value exactly, but it shows which vertical grid line each crossing is nearest to, and that gives an estimate of each solution's $x$-coordinate to the nearest integer.

For $y = x^{2} - 2$ and $y = x + 1$, the right-hand crossing is a little to the right of the grid line $x = 2$, much closer to it than to $x = 3$, so its $x$-coordinate is $2$ to the nearest integer. The left-hand crossing is near $x = -1$.

> **Watch out.** A parabola and a line can cross twice, so choose the crossing the question asks for. Read the $x$-coordinate on the horizontal axis, not the height $y$ of the crossing. And round to the nearest grid line, not to the next one in the direction the crossing leans.`,
        `抛物线与直线的交点坐标可能是无理数，例如 $x = \\frac{1 + \\sqrt{13}}{2} \\approx 2.30$。图象无法精确显示这样的值，但能显示每个交点离哪条竖直网格线最近，从而把每个解的 $x$ 坐标估计到最接近的整数。

对于 $y = x^{2} - 2$ 和 $y = x + 1$，右边的交点在网格线 $x = 2$ 稍右，离它比离 $x = 3$ 近得多，所以它的 $x$ 坐标最接近的整数是 $2$。左边的交点在 $x = -1$ 附近。

> **注意。** 抛物线与直线可能相交两次，所以要选题目所问的那个交点。要在横轴上读 $x$ 坐标，而不是读交点的高度 $y$。还要取最近的网格线，不要顺着交点偏离的方向取下一条。`,
      ),
      generate(rng) {
        let p: ReturnType<typeof parabolaAndLine>;
        do p = parabolaAndLine(rng);
        while (offGrid(p.hi) > 0.3);
        const { c, m, b, d, lo, hi } = p;
        const parabola = poly([1, "x^{2}"], [c, ""]);
        const line = linear(m, b);
        const R = Math.round(hi);
        const toward = hi > R ? 1 : -1;
        return annotate(
          {
            ...numberProblem({
              prompt: t(
                `The graphs of the system $y = ${parabola}$, $y = ${line}$ are shown. To the nearest integer, what is the $x$-coordinate of the solution with the greater $x$-coordinate?`,
                `图中是方程组 $y = ${parabola}$，$y = ${line}$ 的图象。$x$ 坐标较大的那个解，其 $x$ 坐标最接近哪个整数？`,
              ),
              answer: R,
              form: "integer",
              wrong: [Math.round(lo), Math.round(m * hi + b), hi > R ? R + 1 : R - 1],
              solution: t(
                `**Step 1: Choose the crossing.** The parabola and the line cross twice. The solution with the greater $x$-coordinate is the right-hand crossing.

**Step 2: Read the nearest grid line.** That crossing is a little to the ${toward > 0 ? "right" : "left"} of the vertical grid line $x = ${R}$, closer to it than to $x = ${R + toward}$. So to the nearest integer its $x$-coordinate is $${R}$.

**Check.** Solving exactly, $${parabola} = ${line}$ gives $${poly([1, "x^{2}"], [-m, "x"], [c - b, ""])} = 0$, whose greater root is $x = ${rootLatex(m, d)} \\approx ${approx(hi)}$. It rounds to $${R}$.`,
                `**第一步：选定交点。** 抛物线与直线相交两次。$x$ 坐标较大的解是右边的交点。

**第二步：读出最近的网格线。** 这个交点在竖直网格线 $x = ${R}$ 稍${toward > 0 ? "右" : "左"}，离它比离 $x = ${R + toward}$ 近。所以它的 $x$ 坐标最接近的整数是 $${R}$。

**检验。** 精确求解：由 $${parabola} = ${line}$ 得 $${poly([1, "x^{2}"], [-m, "x"], [c - b, ""])} = 0$，它较大的根为 $x = ${rootLatex(m, d)} \\approx ${approx(hi)}$，四舍五入得 $${R}$。`,
              ),
            }),
            figure: {
              svg: plane(tallView, [
                { kind: "curve", f: (v) => v * v + c },
                { kind: "line", a: [0, b], b: [1, m + b], accent: true },
              ]),
              alt: t(
                `The parabola y = ${plain(parabola)} and the line y = ${plain(line)} drawn on the same grid.`,
                `在同一网格中画出的抛物线 y = ${plain(parabola)} 与直线 y = ${plain(line)}。`,
              ),
            },
          },
          tallView,
          [
            { kind: "segment", a: [hi, 0], b: [hi, m * hi + b], dashed: true, tone: "action" },
            { kind: "point", at: [hi, m * hi + b], tone: "result" },
          ],
          `The curves cross near x = ${R}.`,
          `两条曲线的交点接近 x = ${R}。`,
        );
      },
    },
    {
      id: "locating-a-solution-in-a-table",
      title: t("Locating a solution in a table", "在数值表中确定解的位置"),
      figure: remainingDrawings3["approximating-solutions-to-systems-of-nonlinear-equations#locating-a-solution-in-a-table"],
      explanation: t(
        `As with two lines, a table of values locates a crossing of a parabola and a line. Between two crossings one graph stays above the other, so wherever one function is below the other at an $x$-value and above it at the next, the graphs have crossed in between, and a solution lies there.

For $f(x) = x^{2} - 2$ and $g(x) = x + 1$: at $x = 2$, $f(2) = 2$ is below $g(2) = 3$; at $x = 3$, $f(3) = 7$ is above $g(3) = 4$. So a solution lies between $x = 2$ and $x = 3$.

> **Watch out.** A solution lies where the order of the two rows switches, not in a pair of neighboring columns where the same row is on top at both ends, even right next to the switch. A parabola can cross a line twice, so scan the whole table for every switch.`,
        `与两条直线的情形一样，数值表也能确定抛物线与直线交点的位置。在两个交点之间，一个图象始终在另一个上方，所以只要在某个 $x$ 值处一个函数小于另一个，而在下一个 $x$ 值处大于它，两个图象就在这两者之间相交，那里有一个解。

对于 $f(x) = x^{2} - 2$ 与 $g(x) = x + 1$：在 $x = 2$ 处，$f(2) = 2$ 小于 $g(2) = 3$；在 $x = 3$ 处，$f(3) = 7$ 大于 $g(3) = 4$。所以有一个解位于 $x = 2$ 与 $x = 3$ 之间。

> **注意。** 解位于两行大小关系改变的地方，而不在两端都是同一行较大的那对相邻列中，即使它紧挨着改变处。抛物线可能与直线相交两次，所以要沿整张表查找每一次改变。`,
      ),
      generate(rng) {
        let p: ReturnType<typeof parabolaAndLine>;
        do p = parabolaAndLine(rng);
        while (Math.floor(p.hi) < Math.ceil(p.lo));
        const { c, m, b, d, hi, lo: low } = p;
        const lo = Math.floor(hi);
        const start = rng.int(Math.max(Math.ceil(low), lo - 3), lo);
        const xs = Array.from({ length: 5 }, (_, j) => start + j);
        const f = (v: number) => v * v + c;
        const g = (v: number) => m * v + b;
        const parabola = poly([1, "x^{2}"], [c, ""]);
        const line = linear(m, b);
        const rows: [string, number[]][] = [
          ["f(x)", xs.map(f)],
          ["g(x)", xs.map(g)],
        ];
        return pickChoice(
          rng,
          t(
            `The table gives values of $f(x) = ${parabola}$ and $g(x) = ${line}$. ${valueRows(xs, rows)}Between which two consecutive $x$-values in the table does a solution of the system $y = f(x)$, $y = g(x)$ lie?`,
            `下表给出了 $f(x) = ${parabola}$ 与 $g(x) = ${line}$ 的值。${valueRows(xs, rows)}方程组 $y = f(x)$，$y = g(x)$ 的一个解位于表中哪两个相邻的 $x$ 值之间？`,
          ),
          between(String(lo), String(lo + 1)),
          neighborIntervals(xs, lo - start),
          t(
            `**Step 1: Compare the rows column by column.** At $x = ${lo}$, $f(x) = ${f(lo)}$ is below $g(x) = ${g(lo)}$; at $x = ${lo + 1}$, $f(x) = ${f(lo + 1)}$ is above $g(x) = ${g(lo + 1)}$.

**Step 2: Find the switch.** The order switches between these two columns, and it is the only switch in the table: in every other pair of neighboring columns the same row is on top at both ends. So a solution lies between $x = ${lo}$ and $x = ${lo + 1}$.

**Check.** Solving $${parabola} = ${line}$ exactly gives the greater root $x = ${rootLatex(m, d)} \\approx ${approx(hi)}$, which indeed lies between $${lo}$ and $${lo + 1}$.`,
            `**第一步：逐列比较两行。** 在 $x = ${lo}$ 处，$f(x) = ${f(lo)}$ 小于 $g(x) = ${g(lo)}$；在 $x = ${lo + 1}$ 处，$f(x) = ${f(lo + 1)}$ 大于 $g(x) = ${g(lo + 1)}$。

**第二步：找出大小关系改变处。** 大小关系在这两列之间发生了改变，而且这是表中唯一的一次：其他每一对相邻的列中，两端都是同一行较大。所以有一个解位于 $x = ${lo}$ 与 $x = ${lo + 1}$ 之间。

**检验。** 精确解方程 $${parabola} = ${line}$，较大的根为 $x = ${rootLatex(m, d)} \\approx ${approx(hi)}$，确实位于 $${lo}$ 与 $${lo + 1}$ 之间。`,
          ),
        );
      },
    },
    {
      id: "narrowing-to-tenths",
      figure: algebraDrawings["approximating-solutions-to-systems-of-nonlinear-equations#narrowing-to-tenths"],
      title: t("Narrowing an estimate to tenths", "把估计缩小到十分位"),
      explanation: t(
        `Once a solution is known to lie between two integers, test the tenths between them to narrow it down. The graphs of $y = x^{2}$ and $y = k$ cross where $x^{2} = k$. For positive $x$, a larger $x$ has a larger square, so the crossing lies above every tenth whose square is less than $k$ and below every tenth whose square is greater.

For $y = x^{2}$ and $y = 5$: since $2^{2} = 4 < 5 < 9 = 3^{2}$, the crossing is between $2$ and $3$. Squaring tenths gives $2.2^{2} = 4.84 < 5$ and $2.3^{2} = 5.29 > 5$, so the crossing lies between $x = 2.2$ and $x = 2.3$.

> **Watch out.** Compare the square $x^{2}$ with $k$, not $x$ itself. The answer is the pair of neighboring tenths where the square passes $k$: the lower one squares to less than $k$ and the upper one to more. A neighboring pair, one tenth too low or too high, has both squares on the same side of $k$.`,
        `一旦知道解位于两个整数之间，就检验它们之间的十分位数来缩小范围。$y = x^{2}$ 与 $y = k$ 的图象在 $x^{2} = k$ 处相交。对于正数 $x$，$x$ 越大平方越大，所以交点在每个平方小于 $k$ 的十分位数右边，在每个平方大于 $k$ 的十分位数左边。

对于 $y = x^{2}$ 与 $y = 5$：因为 $2^{2} = 4 < 5 < 9 = 3^{2}$，交点在 $2$ 与 $3$ 之间。计算十分位数的平方：$2.2^{2} = 4.84 < 5$，$2.3^{2} = 5.29 > 5$，所以交点位于 $x = 2.2$ 与 $x = 2.3$ 之间。

> **注意。** 要用平方 $x^{2}$ 与 $k$ 比较，而不是用 $x$ 本身。答案是平方越过 $k$ 的那一对相邻十分位数：较小的那个平方小于 $k$，较大的那个平方大于 $k$。偏低或偏高一格的相邻一对，两个平方都在 $k$ 的同一侧。`,
      ),
      generate(rng) {
        let k: number;
        do k = rng.int(2, 60);
        while (Number.isInteger(Math.sqrt(k)));
        let n = Math.floor(Math.sqrt(100 * k));
        while (n * n > 100 * k) n--;
        while ((n + 1) * (n + 1) <= 100 * k) n++;
        const options = (lo: number) => between(tenths(lo), tenths(lo + 1));
        const whole = Math.floor(n / 10);
        const root = (Math.round(Math.sqrt(k) * 1000) / 1000).toString();
        return pickChoice(
          rng,
          t(
            `The graphs of $y = x^{2}$ and $y = ${k}$ cross at a point with a positive $x$-coordinate. Between which two consecutive tenths does that $x$-coordinate lie?`,
            `$y = x^{2}$ 与 $y = ${k}$ 的图象相交于一个 $x$ 坐标为正数的点。该 $x$ 坐标位于哪两个相邻的十分位数之间？`,
          ),
          options(n),
          [options(n - 1), options(n + 1), options(n - 2), options(n + 2)],
          t(
            `**Step 1: Find the integers around it.** The crossing has $x^{2} = ${k}$. Since $${whole}^{2} = ${whole * whole} < ${k} < ${(whole + 1) ** 2} = ${whole + 1}^{2}$, the solution lies between $${whole}$ and $${whole + 1}$.

**Step 2: Square the tenths.** $${tenths(n)}^{2} = ${hundredths(n * n)} < ${k}$ and $${tenths(n + 1)}^{2} = ${hundredths((n + 1) ** 2)} > ${k}$. The square passes $${k}$ between these two tenths, so the solution lies between $x = ${tenths(n)}$ and $x = ${tenths(n + 1)}$.

**Check.** Exactly, $x = \\sqrt{${k}} \\approx ${root}$, which indeed lies between $${tenths(n)}$ and $${tenths(n + 1)}$.`,
            `**第一步：找出两侧的整数。** 交点满足 $x^{2} = ${k}$。因为 $${whole}^{2} = ${whole * whole} < ${k} < ${(whole + 1) ** 2} = ${whole + 1}^{2}$，所以解位于 $${whole}$ 与 $${whole + 1}$ 之间。

**第二步：计算十分位数的平方。** $${tenths(n)}^{2} = ${hundredths(n * n)} < ${k}$，$${tenths(n + 1)}^{2} = ${hundredths((n + 1) ** 2)} > ${k}$。平方在这两个十分位数之间越过 $${k}$，所以解位于 $x = ${tenths(n)}$ 与 $x = ${tenths(n + 1)}$ 之间。

**检验。** 精确地说，$x = \\sqrt{${k}} \\approx ${root}$，确实位于 $${tenths(n)}$ 与 $${tenths(n + 1)}$ 之间。`,
          ),
        );
      },
    },
  ],
};

/** approximatingSystemsTopics lists the Algebra I topics on approximating solutions of systems, in prerequisite order. */
export const approximatingSystemsTopics: readonly TopicDef[] = [
  approximatingSolutionsToSystemsOfLinearEquations,
  approximatingSolutionsToSystemsOfNonlinearEquations,
];
