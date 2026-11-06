import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { linear, type PlaneMark, type PlaneView, plane, poly, Q } from "@ga/subject-math";
import { algebraDrawings } from "../explanation-drawings-algebra.ts";
import { remainingDrawings3 } from "../explanation-drawings-remaining-3.ts";
import { annotate, at } from "../graph-figures.ts";
import { numberProblem, pointLatex, steps } from "../problems.ts";
import { mathText, pickChoice } from "./grade-4-fractions.ts";

// Algebra I, systems of equations: approximating the solutions of systems of linear and nonlinear equations from
// graphs and tables of values, and refining an estimate to tenths.

const view: PlaneView = { xMin: -6, xMax: 6, yMin: -6, yMax: 6 };
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

/** table writes rows of values over a row of x-values as a display array. */
function table(xs: readonly number[], rows: readonly (readonly [string, readonly number[]])[]): string {
  const row = (head: string, values: readonly number[]) => `${head} & ${values.join(" & ")}`;
  return `$$\\begin{array}{c|${"c".repeat(xs.length)}} ${row("x", xs)} \\\\ \\hline ${rows.map(([h, v]) => row(h, v)).join(" \\\\ ")} \\end{array}$$`;
}

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
  knowledgePoints: [
    {
      id: "estimating-from-a-graph",
      figure: algebraDrawings["approximating-solutions-to-systems-of-linear-equations#estimating-from-a-graph"],
      title: t("Estimating from a graph", "从图象估计"),
      explanation: t(
        "When two lines cross between grid points, a graph only gives an estimate of the solution. Look at where the lines cross, and find the grid point closest to the crossing: if the lines meet a little to the right of $x = 2$ and a little below $y = 1$, the solution is approximately $(2, 1)$. An estimate is not a solution, so substituting it into the equations makes them only nearly true.",
        "当两直线在网格点之间相交时，图象只能给出解的估计值。观察两直线的交点，找出离交点最近的网格点：如果两直线在 $x = 2$ 稍右、$y = 1$ 稍下的位置相交，那么解约为 $(2, 1)$。估计值不是解，所以把它代入方程只会使方程近似成立。",
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
              `The lines cross at about $(${approx(x.toNumber())}, ${approx(y.toNumber())})$, and the nearest grid point is $${pointLatex([X, Y])}$. Solving exactly confirms it: $${l1} = ${l2}$ gives $x = ${x.toLatex()}$, and then $y = ${y.toLatex()}$.`,
              `两直线大约交于 $(${approx(x.toNumber())}, ${approx(y.toNumber())})$，离它最近的网格点是 $${pointLatex([X, Y])}$。精确求解可以验证：由 $${l1} = ${l2}$ 得 $x = ${x.toLatex()}$，进而 $y = ${y.toLatex()}$。`,
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
        "A table of values of $f(x)$ and $g(x)$ shows where the lines $y = f(x)$ and $y = g(x)$ cross even when the crossing is not in the table. Compare the two rows: where $f(x)$ is below $g(x)$ at one $x$-value and above it at the next, or the other way around, the lines have crossed in between, so the $x$-coordinate of the solution lies between those two $x$-values.",
        "即使交点不在表中，$f(x)$ 与 $g(x)$ 的数值表也能显示直线 $y = f(x)$ 与 $y = g(x)$ 在哪里相交。比较两行数值：如果在某个 $x$ 值处 $f(x)$ 小于 $g(x)$，而在下一个 $x$ 值处大于 $g(x)$（或者反过来），那么两直线在这两个 $x$ 值之间相交，所以解的 $x$ 坐标位于这两个 $x$ 值之间。",
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
            `The table gives values of $f(x) = ${l1}$ and $g(x) = ${l2}$. ${table(xs, [
              ["f(x)", xs.map(f)],
              ["g(x)", xs.map(g)],
            ])}Between which two consecutive $x$-values in the table does the $x$-coordinate of the solution of the system $y = f(x)$, $y = g(x)$ lie?`,
            `下表给出了 $f(x) = ${l1}$ 与 $g(x) = ${l2}$ 的值。${table(xs, [
              ["f(x)", xs.map(f)],
              ["g(x)", xs.map(g)],
            ])}方程组 $y = f(x)$，$y = g(x)$ 的解的 $x$ 坐标位于表中哪两个相邻的 $x$ 值之间？`,
          ),
          between(String(lo), String(lo + 1)),
          neighborIntervals(xs, i),
          t(
            `At $x = ${lo}$, $f(x) = ${f(lo)}$ is ${above(lo).en} $g(x) = ${g(lo)}$; at $x = ${lo + 1}$, $f(x) = ${f(lo + 1)}$ is ${above(lo + 1).en} $g(x) = ${g(lo + 1)}$. The order switches, so the lines cross between $x = ${lo}$ and $x = ${lo + 1}$ (exactly at $x = ${x.toLatex()}$).`,
            `在 $x = ${lo}$ 处，$f(x) = ${f(lo)}$ ${above(lo)["zh-CN"]} $g(x) = ${g(lo)}$；在 $x = ${lo + 1}$ 处，$f(x) = ${f(lo + 1)}$ ${above(lo + 1)["zh-CN"]} $g(x) = ${g(lo + 1)}$。大小关系发生了改变，所以两直线在 $x = ${lo}$ 与 $x = ${lo + 1}$ 之间相交（精确位置为 $x = ${x.toLatex()}$）。`,
          ),
        );
      },
    },
    {
      id: "confirming-an-estimate",
      figure: algebraDrawings["approximating-solutions-to-systems-of-linear-equations#confirming-an-estimate"],
      title: t("Confirming an estimate by solving", "通过求解验证估计"),
      explanation: t(
        "To turn an estimate from a graph into the exact solution, solve the system algebraically and compare. For $y = 2x - 1$ and $y = -x + 3$, setting $2x - 1 = -x + 3$ gives $3x = 4$, so $x = \\frac{4}{3} \\approx 1.33$; this agrees with a graph that shows the lines crossing a little to the right of $x = 1$.",
        "要把从图象得到的估计值变成精确解，就用代数方法解方程组并加以比较。对于 $y = 2x - 1$ 和 $y = -x + 3$，令 $2x - 1 = -x + 3$ 得 $3x = 4$，所以 $x = \\frac{4}{3} \\approx 1.33$；这与图象上两直线在 $x = 1$ 稍右处相交相符。",
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
            `Set the two expressions for $y$ equal: ${steps(`${l1} = ${l2}`, `${linear(dm, 0)} = ${db.toLatex()}`, `x = ${x.toLatex()} \\approx ${approx(x.toNumber())}`)}This is close to the estimate $x \\approx ${X}$, as it should be.`,
            `令 $y$ 的两个表达式相等：${steps(`${l1} = ${l2}`, `${linear(dm, 0)} = ${db.toLatex()}`, `x = ${x.toLatex()} \\approx ${approx(x.toNumber())}`)}这与估计值 $x \\approx ${X}$ 接近，符合预期。`,
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
  knowledgePoints: [
    {
      id: "estimating-from-a-graph",
      figure: algebraDrawings["approximating-solutions-to-systems-of-nonlinear-equations#estimating-from-a-graph"],
      title: t("Estimating from a graph", "从图象估计"),
      explanation: t(
        "A parabola and a line can cross at points whose coordinates are irrational, such as $x = \\frac{1 + \\sqrt{13}}{2} \\approx 2.30$. A graph cannot show such a value exactly, but it shows which grid line each crossing is nearest to, which gives an estimate of each solution to the nearest integer.",
        "抛物线与直线的交点坐标可能是无理数，例如 $x = \\frac{1 + \\sqrt{13}}{2} \\approx 2.30$。图象无法精确显示这样的值，但能显示每个交点离哪条网格线最近，从而把每个解估计到最接近的整数。",
      ),
      generate(rng) {
        let p: ReturnType<typeof parabolaAndLine>;
        do p = parabolaAndLine(rng);
        while (offGrid(p.hi) > 0.3);
        const { c, m, b, d, lo, hi } = p;
        const parabola = poly([1, "x^{2}"], [c, ""]);
        const line = linear(m, b);
        const R = Math.round(hi);
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
                `The right-hand crossing is closest to the grid line $x = ${R}$. Solving exactly confirms it: $x^{2} ${c < 0 ? "-" : "+"} ${Math.abs(c)} = ${line}$ gives $${poly([1, "x^{2}"], [-m, "x"], [c - b, ""])} = 0$, whose greater root is $x = ${rootLatex(m, d)} \\approx ${approx(hi)}$.`,
                `右边的交点离网格线 $x = ${R}$ 最近。精确求解可以验证：由 $x^{2} ${c < 0 ? "-" : "+"} ${Math.abs(c)} = ${line}$ 得 $${poly([1, "x^{2}"], [-m, "x"], [c - b, ""])} = 0$，它较大的根为 $x = ${rootLatex(m, d)} \\approx ${approx(hi)}$。`,
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
        "As with two lines, a table of values locates a crossing of a parabola and a line: where one function is below the other at an $x$-value and above it at the next, a solution lies in between. A parabola can cross a line twice, so look along the whole table for every switch.",
        "与两条直线的情形一样，数值表也能确定抛物线与直线交点的位置：如果在某个 $x$ 值处一个函数小于另一个，而在下一个 $x$ 值处大于它，那么两者之间有一个解。抛物线可能与直线相交两次，所以要沿整张表查找每一次大小关系的改变。",
      ),
      generate(rng) {
        let p: ReturnType<typeof parabolaAndLine>;
        do p = parabolaAndLine(rng);
        while (Math.floor(p.hi) < Math.ceil(p.lo));
        const { c, m, b, hi, lo: low } = p;
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
            `The table gives values of $f(x) = ${parabola}$ and $g(x) = ${line}$. ${table(xs, rows)}Between which two consecutive $x$-values in the table does a solution of the system $y = f(x)$, $y = g(x)$ lie?`,
            `下表给出了 $f(x) = ${parabola}$ 与 $g(x) = ${line}$ 的值。${table(xs, rows)}方程组 $y = f(x)$，$y = g(x)$ 的一个解位于表中哪两个相邻的 $x$ 值之间？`,
          ),
          between(String(lo), String(lo + 1)),
          neighborIntervals(xs, lo - start),
          t(
            `At $x = ${lo}$, $f(x) = ${f(lo)}$ is below $g(x) = ${g(lo)}$; at $x = ${lo + 1}$, $f(x) = ${f(lo + 1)}$ is above $g(x) = ${g(lo + 1)}$. This is the only switch in the table, so a solution lies between $x = ${lo}$ and $x = ${lo + 1}$ (at $x \\approx ${approx(hi)}$).`,
            `在 $x = ${lo}$ 处，$f(x) = ${f(lo)}$ 小于 $g(x) = ${g(lo)}$；在 $x = ${lo + 1}$ 处，$f(x) = ${f(lo + 1)}$ 大于 $g(x) = ${g(lo + 1)}$。这是表中唯一一次大小关系的改变，所以有一个解位于 $x = ${lo}$ 与 $x = ${lo + 1}$ 之间（约为 $x \\approx ${approx(hi)}$）。`,
          ),
        );
      },
    },
    {
      id: "narrowing-to-tenths",
      figure: algebraDrawings["approximating-solutions-to-systems-of-nonlinear-equations#narrowing-to-tenths"],
      title: t("Narrowing an estimate to tenths", "把估计缩小到十分位"),
      explanation: t(
        "Once a solution is known to lie between two integers, test the tenths between them to narrow it down. The graphs of $y = x^{2}$ and $y = 5$ cross at a positive $x$ between $2$ and $3$, since $2^{2} = 4 < 5 < 9 = 3^{2}$. Squaring tenths gives $2.2^{2} = 4.84 < 5$ and $2.3^{2} = 5.29 > 5$, so the crossing lies between $x = 2.2$ and $x = 2.3$.",
        "一旦知道解位于两个整数之间，就检验它们之间的十分位数来缩小范围。$y = x^{2}$ 与 $y = 5$ 的图象在 $2$ 与 $3$ 之间的某个正数 $x$ 处相交，因为 $2^{2} = 4 < 5 < 9 = 3^{2}$。计算十分位数的平方：$2.2^{2} = 4.84 < 5$，$2.3^{2} = 5.29 > 5$，所以交点位于 $x = 2.2$ 与 $x = 2.3$ 之间。",
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
        return pickChoice(
          rng,
          t(
            `The graphs of $y = x^{2}$ and $y = ${k}$ cross at a point with a positive $x$-coordinate. Between which two consecutive tenths does that $x$-coordinate lie?`,
            `$y = x^{2}$ 与 $y = ${k}$ 的图象相交于一个 $x$ 坐标为正数的点。该 $x$ 坐标位于哪两个相邻的十分位数之间？`,
          ),
          options(n),
          [options(n - 1), options(n + 1), options(n - 2), options(n + 2)],
          t(
            `First, $${whole}^{2} = ${whole * whole} < ${k} < ${(whole + 1) ** 2} = ${whole + 1}^{2}$, so the solution lies between $${whole}$ and $${whole + 1}$. Squaring tenths: $${tenths(n)}^{2} = ${hundredths(n * n)} < ${k}$ and $${tenths(n + 1)}^{2} = ${hundredths((n + 1) ** 2)} > ${k}$, so it lies between $x = ${tenths(n)}$ and $x = ${tenths(n + 1)}$ (exactly $x = \\sqrt{${k}}$).`,
            `首先，$${whole}^{2} = ${whole * whole} < ${k} < ${(whole + 1) ** 2} = ${whole + 1}^{2}$，所以解位于 $${whole}$ 与 $${whole + 1}$ 之间。计算十分位数的平方：$${tenths(n)}^{2} = ${hundredths(n * n)} < ${k}$，$${tenths(n + 1)}^{2} = ${hundredths((n + 1) ** 2)} > ${k}$，所以它位于 $x = ${tenths(n)}$ 与 $x = ${tenths(n + 1)}$ 之间（精确值为 $x = \\sqrt{${k}}$）。`,
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
