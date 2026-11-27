import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import type { ExamSpec } from "../exam.ts";
import { cx, par, sg, step, words, worked } from "../exam.ts";
import {
  anglePts,
  cevianFigure,
  crossFigure,
  exteriorFigure,
  isoPts,
  pointsFigure,
  polyFigure,
  radiusFigure,
  rectFigure,
  rightPts,
  sectorFigure,
  transversalFigure,
  twoTrianglesFigure,
} from "../exam-figures.ts";
import { ask } from "./act-exam-kit.ts";

// ACT Math Prep, questions of its own for the topics it shares with SAT Math Prep: angles, triangles, similarity, trigonometry, circles, coordinate geometry and solids.

const triples = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [20, 21, 29],
] as const;
const moreTriples = [
  ...triples,
  [39, 80, 89],
  [9, 40, 41],
  [12, 35, 37],
  [11, 60, 61],
  [28, 45, 53],
  [33, 56, 65],
  [16, 63, 65],
  [48, 55, 73],
] as const;
const lin = (a: number, b: number): string => `${cx(a)} ${sg(b)}`.trim();
const ratio = (n: number, d: number): string => Q.of(n, d).toLatex();
const pi = (n: number): string => (n === 1 ? "\\pi" : `${n}\\pi`);
const square = (v: string, c: number): string => (c === 0 ? `${v}^2` : `(${v} ${sg(-c)})^2`);
const sum = (h: number, k: number, r2: number): string => `${square("x", h)} + ${square("y", k)} = ${r2}`;

/** actOwnGeometry are the question generators of ACT topics on angles, triangles, similarity, trigonometry, circles, coordinate geometry and solids, by title. */
export const actOwnGeometry: Record<string, ExamSpec["make"]> = {
  "Finding Angles Formed by Intersecting Lines": (rng, hard) => {
    const a = rng.int(30, 85) + 65 * rng.int(0, 1);
    if (!hard)
      return ask(
        rng,
        `In the figure, two straight lines cross, and one of the angles measures $${a}^\\circ$. What is the measure of the angle marked "?", in degrees?`,
        `图中两条直线相交，其中一个角为 $${a}^\\circ$。标有 "?" 的角是多少度？`,
        180 - a,
        [a, a + 10, 360 - a],
        worked(
          [
            step(
              "Name the angle pair",
              "认出这对角",
              `The marked angle sits beside the $${a}^\\circ$ angle on one straight line, so the two are supplementary.`,
              `标记的角与 $${a}^\\circ$ 的角在同一条直线上相邻，所以两者互补。`,
            ),
            step("Subtract from 180", "用 180 减", `$180 - ${a} = ${180 - a}$.`, `$180 - ${a} = ${180 - a}$。`),
          ],
          t(`$${a} + ${180 - a} = 180$, a straight angle.`, `$${a} + ${180 - a} = 180$，正好是平角。`),
          [
            t(
              `This is the vertical angle, across from the $${a}^\\circ$ angle, not the one beside it.`,
              `这是 $${a}^\\circ$ 角的对顶角，不是它旁边的角。`,
            ),
            t(`With this angle the two would add to $${a + a + 10}$, not $180$.`, `取这个角，两角之和为 $${a + a + 10}$，不是 $180$。`),
            t(`This subtracts from $360$; angles on a straight line add to $180$.`, `这里用 $360$ 去减；直线上的角之和为 $180$。`),
          ],
        ),
        crossFigure(a, `${a}°`, "?", false),
      );
    const [p, q] = [rng.int(2, 6), rng.int(2, 25)];
    const x = rng.int(8, 25);
    const b = p * x + q;
    return ask(
      rng,
      `Two lines cross so that vertical angles measure $(${p}x + ${q})^\\circ$ and $${b}^\\circ$. What is the measure of a neighboring angle, in degrees?`,
      `两直线相交，一对对顶角为 $(${p}x + ${q})^\\circ$ 和 $${b}^\\circ$。其相邻的角是多少度？`,
      180 - b,
      [b, x, 180 - x],
      worked(
        [
          step(
            "Use vertical angles",
            "用对顶角",
            `Vertical angles are equal, so the angle is $${b}^\\circ$ whatever $x$ is (here $x = ${x}$).`,
            `对顶角相等，所以无论 $x$ 是多少，这个角都是 $${b}^\\circ$（这里 $x = ${x}$）。`,
          ),
          step(
            "Take the supplement",
            "取补角",
            `A neighboring angle lies on the same straight line: $180 - ${b} = ${180 - b}$.`,
            `相邻的角与它在同一条直线上：$180 - ${b} = ${180 - b}$。`,
          ),
        ],
        t(`$${b} + ${180 - b} = 180$.`, `$${b} + ${180 - b} = 180$。`),
        [
          t(`This is the vertical angle itself, not a neighboring one.`, `这是对顶角本身，不是相邻的角。`),
          t(`This is the value of $x$, not an angle.`, `这是 $x$ 的值，不是角。`),
          t(`This takes $x$ as the angle; the angle is $${p}x + ${q} = ${b}$.`, `这里把 $x$ 当成了角；角是 $${p}x + ${q} = ${b}$。`),
        ],
      ),
    );
  },
  "Finding Angles With Parallel Lines": (rng, hard) => {
    const a = rng.int(35, 85) + 60 * rng.int(0, 1);
    if (!hard) {
      const same = rng.int(0, 1) === 1;
      return ask(
        rng,
        `In the figure, the two horizontal lines are parallel and are crossed by a third line. What is the measure of the angle marked "?", in degrees?`,
        `图中两条水平线平行，并被第三条直线所截。标有 "?" 的角是多少度？`,
        same ? a : 180 - a,
        [same ? 180 - a : a, 90 + (a % 40), 360 - a],
        worked(
          [
            step(
              "Name the angle pair",
              "认出这对角",
              same
                ? `The marked angles are in the same position at the two crossings, so they are corresponding angles.`
                : `The marked angles lie between the parallel lines on the same side of the crossing line, so they are same-side interior angles.`,
              same ? `两个标记的角在两个交点处位置相同，是同位角。` : `两个标记的角在平行线之间、截线同侧，是同旁内角。`,
            ),
            step(
              "Apply the rule",
              "用规则",
              same
                ? `Corresponding angles are equal: $${a}^\\circ$.`
                : `Same-side interior angles add to $180^\\circ$: $180 - ${a} = ${180 - a}$.`,
              same ? `同位角相等：$${a}^\\circ$。` : `同旁内角之和为 $180^\\circ$：$180 - ${a} = ${180 - a}$。`,
            ),
          ],
          t(
            `In the figure the marked angle is ${same ? (a < 90 ? "acute, like" : "obtuse, like") : a < 90 ? "obtuse, unlike" : "acute, unlike"} the $${a}^\\circ$ angle.`,
            `图中标记的角与 $${a}^\\circ$ 的角${same ? "同为" : "一个锐角一个钝角，它是"}${same ? (a < 90 ? "锐角" : "钝角") : a < 90 ? "钝角" : "锐角"}。`,
          ),
          [
            t(
              same ? `These angles are equal, not supplementary.` : `These angles are supplementary, not equal.`,
              same ? `这两个角相等，不是互补。` : `这两个角互补，不是相等。`,
            ),
            t(
              `Parallel lines give angles equal to $${a}^\\circ$ or to $${180 - a}^\\circ$, and this is neither.`,
              `平行线形成的角只能是 $${a}^\\circ$ 或 $${180 - a}^\\circ$，这个都不是。`,
            ),
            t(
              `This subtracts from $360$; the angles here are equal or add to $180$.`,
              `这里用 $360$ 去减；这里的角要么相等，要么和为 $180$。`,
            ),
          ],
        ),
        transversalFigure(a, `${a}°`, "?", same),
      );
    }
    const k = rng.int(2, 4);
    const x = rng.int(10, 25);
    const c = rng.int(15, 30);
    const v = k * x + c;
    return ask(
      rng,
      `In the figure, the horizontal lines are parallel, and corresponding angles measure $(${k}x + ${c})^\\circ$ and $${v}^\\circ$. What is the value of $x$?`,
      `图中水平线平行，一对同位角为 $(${k}x + ${c})^\\circ$ 和 $${v}^\\circ$。$x$ 的值是多少？`,
      x,
      [v, x + c, 180 - v],
      worked(
        [
          step(
            "Set the angles equal",
            "令两角相等",
            `Corresponding angles are equal: $${k}x + ${c} = ${v}$.`,
            `同位角相等：$${k}x + ${c} = ${v}$。`,
          ),
          step("Solve", "求解", `$${k}x = ${v} - ${c} = ${k * x}$, so $x = ${x}$.`, `$${k}x = ${v} - ${c} = ${k * x}$，所以 $x = ${x}$。`),
        ],
        t(`$${k}(${x}) + ${c} = ${v}$.`, `$${k}(${x}) + ${c} = ${v}$。`),
        [
          t(`This is the angle, not $x$.`, `这是角的度数，不是 $x$。`),
          t(`This adds $${c}$ back after dividing.`, `这里除完后又加上了 $${c}$。`),
          t(`This is the supplement of the angle; corresponding angles are equal.`, `这是这个角的补角；同位角相等。`),
        ],
      ),
      transversalFigure(v, `(${k}x + ${c})°`, `${v}°`, true),
    );
  },
  "Problem-Solving With Parallel Lines": (rng, hard) => {
    const [a, b] = [rng.int(30, 70), rng.int(30, 70)];
    if (!hard)
      return ask(
        rng,
        `In triangle $ABC$, $\\overline{DE}$ is parallel to $\\overline{BC}$, with $D$ on $\\overline{AB}$ and $E$ on $\\overline{AC}$. If angle $ABC$ is $${a}^\\circ$ and angle $ACB$ is $${b}^\\circ$, what is angle $AED$, in degrees?`,
        `在三角形 $ABC$ 中，$\\overline{DE}$ 平行于 $\\overline{BC}$，$D$ 在 $\\overline{AB}$ 上，$E$ 在 $\\overline{AC}$ 上。若角 $ABC$ 为 $${a}^\\circ$，角 $ACB$ 为 $${b}^\\circ$，角 $AED$ 是多少度？`,
        b,
        [a, 180 - a - b, 180 - b],
        worked(
          [
            step(
              "Find the crossing line",
              "找出截线",
              `$\\overline{AC}$ crosses the parallel segments $\\overline{DE}$ and $\\overline{BC}$ at $E$ and $C$.`,
              `$\\overline{AC}$ 与平行线段 $\\overline{DE}$、$\\overline{BC}$ 交于 $E$ 和 $C$。`,
            ),
            step(
              "Match the angles",
              "对应两个角",
              `Angles $AED$ and $ACB$ are in the same position at the two crossings, so they are corresponding angles and equal: $${b}^\\circ$.`,
              `角 $AED$ 与角 $ACB$ 在两个交点处位置相同，是同位角，相等：$${b}^\\circ$。`,
            ),
          ],
          t(
            `Triangle $ADE$ then has angles $${a}^\\circ$ at $D$, $${b}^\\circ$ at $E$ and $${180 - a - b}^\\circ$ at $A$, the same as triangle $ABC$.`,
            `于是三角形 $ADE$ 在 $D$、$E$、$A$ 处的角为 $${a}^\\circ$、$${b}^\\circ$、$${180 - a - b}^\\circ$，与三角形 $ABC$ 相同。`,
          ),
          [
            t(`This is angle $ADE$, which matches angle $ABC$.`, `这是角 $ADE$，它对应角 $ABC$。`),
            t(`This is angle $A$, shared by both triangles.`, `这是两个三角形共有的角 $A$。`),
            t(`This is angle $DEC$, the supplement of angle $AED$.`, `这是角 $DEC$，是角 $AED$ 的补角。`),
          ],
        ),
      );
    const c = 180 - a;
    return ask(
      rng,
      `Two parallel lines are crossed by a third line. One of the eight angles formed measures $${a}^\\circ$. What is the sum of the measures of the four angles that are not equal to $${a}^\\circ$?`,
      `两条平行线被第三条直线所截。形成的八个角中有一个为 $${a}^\\circ$。不等于 $${a}^\\circ$ 的四个角之和是多少度？`,
      4 * c,
      [4 * a, 360, c],
      worked(
        [
          step(
            "Sort the eight angles",
            "把八个角分类",
            `Four of the angles equal $${a}^\\circ$, and the other four equal its supplement, $180 - ${a} = ${c}^\\circ$.`,
            `四个角等于 $${a}^\\circ$，另外四个等于它的补角 $180 - ${a} = ${c}^\\circ$。`,
          ),
          step("Add the other four", "把另外四个相加", `$4(${c}) = ${4 * c}$.`, `$4(${c}) = ${4 * c}$。`),
        ],
        t(
          `All eight add to $2 \\times 360 = 720$, and $4(${a}) + ${4 * c} = ${4 * a + 4 * c}$.`,
          `八个角之和为 $2 \\times 360 = 720$，而 $4(${a}) + ${4 * c} = ${4 * a + 4 * c}$。`,
        ),
        [
          t(`This adds the four angles equal to $${a}^\\circ$.`, `这是四个等于 $${a}^\\circ$ 的角之和。`),
          t(
            `This is the sum of the four angles at one crossing, which includes two equal to $${a}^\\circ$.`,
            `这是一个交点处四个角之和，其中两个等于 $${a}^\\circ$。`,
          ),
          t(`This is one of the four angles, not their sum.`, `这只是四个角中的一个，不是它们的和。`),
        ],
      ),
    );
  },
  "Finding Interior Angles of Triangles": (rng, hard) => {
    const [a, b] = [rng.int(25, 80), rng.int(25, 70)];
    if (!hard)
      return ask(
        rng,
        `In the triangle shown, what is the measure of the angle marked "?", in degrees?`,
        `图中三角形里，标有 "?" 的角是多少度？`,
        180 - a - b,
        [360 - a - b, a + b, 90 - Math.min(a, b)],
        worked(
          [
            step("Recall the angle sum", "回顾内角和", `The angles of a triangle add to $180^\\circ$.`, `三角形内角和为 $180^\\circ$。`),
            step(
              "Subtract the known angles",
              "减去已知角",
              `$180 - ${a} - ${b} = ${180 - a - b}$.`,
              `$180 - ${a} - ${b} = ${180 - a - b}$。`,
            ),
          ],
          t(`$${a} + ${b} + ${180 - a - b} = 180$.`, `$${a} + ${b} + ${180 - a - b} = 180$。`),
          [
            t(`This uses $360$, the angle sum of a quadrilateral.`, `这里用了 $360$，那是四边形的内角和。`),
            t(`This is the exterior angle at that corner, not the interior angle.`, `这是该顶点处的外角，不是内角。`),
            t(`This treats the triangle as a right triangle, which it is not.`, `这里把它当成了直角三角形，但它不是。`),
          ],
        ),
        polyFigure(anglePts(a, b), { a: [`${a}°`, `${b}°`, "?"] }),
      );
    const [p, q] = [rng.int(2, 3), rng.int(1, 4)];
    const k = rng.int(5, 15);
    const m = 180 - (p + q + 1) * k;
    return ask(
      rng,
      `The angles of a triangle measure $x^\\circ$, $${p}x^\\circ$ and $(${q}x + ${m})^\\circ$. What is the measure of the smallest angle, in degrees?`,
      `一个三角形的三个角为 $x^\\circ$、$${p}x^\\circ$ 和 $(${q}x + ${m})^\\circ$。最小的角是多少度？`,
      k,
      [p * k, q * k + m, 180 - m],
      worked(
        [
          step(
            "Add the angles",
            "把三个角相加",
            `$x + ${p}x + ${q}x + ${m} = ${p + q + 1}x + ${m} = 180$, so $${p + q + 1}x = ${180 - m}$ and $x = ${k}$.`,
            `$x + ${p}x + ${q}x + ${m} = ${p + q + 1}x + ${m} = 180$，所以 $${p + q + 1}x = ${180 - m}$，$x = ${k}$。`,
          ),
          step(
            "Find each angle",
            "求出每个角",
            `The angles are $${k}^\\circ$, $${p * k}^\\circ$ and $${q * k + m}^\\circ$, and the smallest is $${k}^\\circ$.`,
            `三个角为 $${k}^\\circ$、$${p * k}^\\circ$、$${q * k + m}^\\circ$，最小的是 $${k}^\\circ$。`,
          ),
        ],
        t(`$${k} + ${p * k} + ${q * k + m} = 180$.`, `$${k} + ${p * k} + ${q * k + m} = 180$。`),
        [
          t(`This is the angle $${p}x$, which is larger than $x$.`, `这是 $${p}x$ 这个角，比 $x$ 大。`),
          t(`This is the largest angle, not the smallest.`, `这是最大的角，不是最小的。`),
          t(
            `This is $180 - ${m}$, which still contains all ${p + q + 1} copies of $x$.`,
            `这是 $180 - ${m}$，其中还包含 $${p + q + 1}$ 个 $x$。`,
          ),
        ],
      ),
    );
  },
  "Finding Exterior Angles of Triangles": (rng, hard) => {
    const [a, b] = [rng.int(25, 75), rng.int(25, 70)];
    if (!hard)
      return ask(
        rng,
        `In the figure, one side of the triangle is extended. What is the measure of the exterior angle marked "?", in degrees?`,
        `图中三角形的一边被延长。标有 "?" 的外角是多少度？`,
        a + b,
        [180 - a - b, 180 - a, Math.abs(a - b) + 1],
        worked(
          [
            step(
              "Find the interior angle next to it",
              "求相邻的内角",
              `The third angle of the triangle is $180 - ${a} - ${b} = ${180 - a - b}^\\circ$.`,
              `三角形的第三个角为 $180 - ${a} - ${b} = ${180 - a - b}^\\circ$。`,
            ),
            step(
              "Take its supplement",
              "取它的补角",
              `The exterior angle forms a straight line with it: $180 - ${180 - a - b} = ${a + b}$, the sum of the two remote angles.`,
              `外角与它组成平角：$180 - ${180 - a - b} = ${a + b}$，正是两个不相邻内角之和。`,
            ),
          ],
          t(`$${a} + ${b} = ${a + b}$, as the exterior angle rule says.`, `$${a} + ${b} = ${a + b}$，与外角定理一致。`),
          [
            t(`This is the interior angle next to the exterior angle.`, `这是与外角相邻的内角。`),
            t(
              `This is the exterior angle at the other corner, beside the $${a}^\\circ$ angle.`,
              `这是另一个顶点处、$${a}^\\circ$ 角旁边的外角。`,
            ),
            t(`This subtracts the remote angles instead of adding them.`, `这里把两个不相邻的内角相减了，而应相加。`),
          ],
        ),
        exteriorFigure(a, b, `${a}°`, `${b}°`, "?"),
      );
    return ask(
      rng,
      `An exterior angle of a triangle measures $${a + b}^\\circ$. One of the two interior angles not next to it measures $${a}^\\circ$. What is the interior angle next to the exterior angle, in degrees?`,
      `三角形的一个外角为 $${a + b}^\\circ$。与它不相邻的内角之一为 $${a}^\\circ$。与该外角相邻的内角是多少度？`,
      180 - a - b,
      [b, a + b, 180 - a],
      worked(
        [
          step(
            "Use the straight line",
            "用平角",
            `An exterior angle and the interior angle next to it form a straight line, so they add to $180^\\circ$.`,
            `外角与相邻的内角组成平角，和为 $180^\\circ$。`,
          ),
          step(
            "Subtract",
            "相减",
            `$180 - ${a + b} = ${180 - a - b}$. The $${a}^\\circ$ angle is not needed.`,
            `$180 - ${a + b} = ${180 - a - b}$。$${a}^\\circ$ 这个角用不上。`,
          ),
        ],
        t(
          `The other remote angle is $${a + b} - ${a} = ${b}$, and $${a} + ${b} + ${180 - a - b} = 180$.`,
          `另一个不相邻的内角为 $${a + b} - ${a} = ${b}$，而 $${a} + ${b} + ${180 - a - b} = 180$。`,
        ),
        [
          t(
            `This is the other remote interior angle, not the one next to the exterior angle.`,
            `这是另一个不相邻的内角，不是与外角相邻的那个。`,
          ),
          t(`This is the exterior angle itself.`, `这是外角本身。`),
          t(`This subtracts the remote angle from $180$, not the exterior angle.`, `这里用 $180$ 减去了不相邻的内角，而应减去外角。`),
        ],
      ),
      exteriorFigure(a, b, `${a}°`, "", `${a + b}°`),
    );
  },
  "Finding Angles in Isosceles Triangles": (rng, hard) => {
    const base = rng.int(20, 80);
    if (!hard)
      return ask(
        rng,
        `In the figure, the two slanted sides of the triangle are congruent, and one base angle measures $${base}^\\circ$. What is the measure of the top angle, in degrees?`,
        `图中三角形的两条斜边相等，一个底角为 $${base}^\\circ$。顶角是多少度？`,
        180 - 2 * base,
        [base, 180 - base, 90 - base],
        worked(
          [
            step(
              "Use the equal base angles",
              "用两底角相等",
              `Equal sides face equal angles, so both base angles are $${base}^\\circ$, together $${2 * base}^\\circ$.`,
              `等边对等角，所以两个底角都是 $${base}^\\circ$，合起来 $${2 * base}^\\circ$。`,
            ),
            step("Subtract from 180", "用 180 减", `$180 - ${2 * base} = ${180 - 2 * base}$.`, `$180 - ${2 * base} = ${180 - 2 * base}$。`),
          ],
          t(`$${base} + ${base} + ${180 - 2 * base} = 180$.`, `$${base} + ${base} + ${180 - 2 * base} = 180$。`),
          [
            t(`This is the other base angle.`, `这是另一个底角。`),
            t(`This subtracts only one base angle.`, `这里只减了一个底角。`),
            t(`This is half of the top angle.`, `这是顶角的一半。`),
          ],
        ),
        polyFigure(isoPts(180 - 2 * base), { a: [`${base}°`, null, "?"] }),
      );
    const out = 180 - base;
    return ask(
      rng,
      `In an isosceles triangle with $AB = AC$, the base $\\overline{BC}$ is extended past $C$ to $D$, and angle $ACD$ measures $${out}^\\circ$. What is angle $BAC$, in degrees?`,
      `等腰三角形中 $AB = AC$，底边 $\\overline{BC}$ 延长过 $C$ 到 $D$，角 $ACD$ 为 $${out}^\\circ$。角 $BAC$ 是多少度？`,
      180 - 2 * base,
      [base, out, out - 90],
      worked(
        [
          step(
            "Find a base angle",
            "求底角",
            `Angle $ACB$ forms a straight line with angle $ACD$: $180 - ${out} = ${base}^\\circ$. Since $AB = AC$, angle $ABC$ is also $${base}^\\circ$.`,
            `角 $ACB$ 与角 $ACD$ 组成平角：$180 - ${out} = ${base}^\\circ$。因为 $AB = AC$，角 $ABC$ 也是 $${base}^\\circ$。`,
          ),
          step("Find the top angle", "求顶角", `$180 - 2(${base}) = ${180 - 2 * base}$.`, `$180 - 2(${base}) = ${180 - 2 * base}$。`),
        ],
        t(
          `The exterior angle $${out}^\\circ$ equals the two remote angles: $${base} + ${180 - 2 * base} = ${out}$.`,
          `外角 $${out}^\\circ$ 等于两个不相邻内角之和：$${base} + ${180 - 2 * base} = ${out}$。`,
        ),
        [
          t(`This is a base angle, not angle $BAC$.`, `这是底角，不是角 $BAC$。`),
          t(`This is the exterior angle $ACD$ itself.`, `这是外角 $ACD$ 本身。`),
          t(`This subtracts $90$ from the exterior angle, which no rule supports.`, `这里用外角减去 $90$，没有依据。`),
        ],
      ),
    );
  },
  "Problem-Solving With Isosceles Triangles": (rng, hard) => {
    const a = rng.int(25, 60);
    if (!hard)
      return ask(
        rng,
        `Point $D$ is on side $\\overline{BC}$ of triangle $ABC$ and $AD = BD$. If angle $B$ measures $${a}^\\circ$, what is angle $ADC$, in degrees?`,
        `点 $D$ 在三角形 $ABC$ 的边 $\\overline{BC}$ 上，且 $AD = BD$。若角 $B$ 为 $${a}^\\circ$，角 $ADC$ 是多少度？`,
        2 * a,
        [a, 180 - 2 * a, 180 - a],
        worked(
          [
            step(
              "Use the isosceles triangle",
              "用等腰三角形",
              `In triangle $ABD$, $AD = BD$, so the angles facing them are equal: angle $BAD$ = angle $B$ = $${a}^\\circ$.`,
              `在三角形 $ABD$ 中 $AD = BD$，所以它们所对的角相等：角 $BAD$ = 角 $B$ = $${a}^\\circ$。`,
            ),
            step(
              "Use the exterior angle",
              "用外角",
              `Angle $ADC$ is an exterior angle of triangle $ABD$, so it is $${a} + ${a} = ${2 * a}$.`,
              `角 $ADC$ 是三角形 $ABD$ 的外角，所以等于 $${a} + ${a} = ${2 * a}$。`,
            ),
          ],
          t(
            `Angle $ADB$ is $180 - ${2 * a} = ${180 - 2 * a}$, and $${180 - 2 * a} + ${2 * a} = 180$ along $\\overline{BC}$.`,
            `角 $ADB$ 为 $180 - ${2 * a} = ${180 - 2 * a}$，而沿 $\\overline{BC}$ 有 $${180 - 2 * a} + ${2 * a} = 180$。`,
          ),
          [
            t(`This is angle $BAD$, not angle $ADC$.`, `这是角 $BAD$，不是角 $ADC$。`),
            t(`This is angle $ADB$, on the other side of $D$.`, `这是 $D$ 另一侧的角 $ADB$。`),
            t(`This adds only one of the two remote angles.`, `这里只算了两个不相邻内角中的一个。`),
          ],
        ),
        cevianFigure(a, a),
      );
    const [s, d] = [rng.int(6, 30), rng.int(1, 5)];
    return ask(
      rng,
      `The perimeter of an isosceles triangle is $${2 * s + 2 * d}$ inches, and its base is $${2 * d}$ inches long. What is the length of each congruent side, in inches?`,
      `一个等腰三角形的周长为 $${2 * s + 2 * d}$ 英寸，底边长 $${2 * d}$ 英寸。每条腰长多少英寸？`,
      s,
      [2 * s, s + d, s + 2 * d],
      worked(
        [
          step(
            "Remove the base",
            "减去底边",
            `The two congruent sides make up $${2 * s + 2 * d} - ${2 * d} = ${2 * s}$ inches.`,
            `两条腰共 $${2 * s + 2 * d} - ${2 * d} = ${2 * s}$ 英寸。`,
          ),
          step("Split in two", "平分", `Each side is $${2 * s} \\div 2 = ${s}$ inches.`, `每条腰 $${2 * s} \\div 2 = ${s}$ 英寸。`),
        ],
        t(`$${s} + ${s} + ${2 * d} = ${2 * s + 2 * d}$.`, `$${s} + ${s} + ${2 * d} = ${2 * s + 2 * d}$。`),
        [
          t(`This is both congruent sides together.`, `这是两条腰的总长。`),
          t(`This halves the whole perimeter, which still includes the base.`, `这是周长的一半，其中还含有底边。`),
          t(
            `With this side the perimeter would be $${2 * (s + 2 * d) + 2 * d}$.`,
            `腰是这个长度的话，周长是 $${2 * (s + 2 * d) + 2 * d}$。`,
          ),
        ],
      ),
    );
  },
  "Identifying Corresponding Parts Under Congruence": (rng, hard) => {
    const names = rng.pick([
      ["P", "Q", "R", "X", "Y", "Z"],
      ["J", "K", "L", "S", "T", "U"],
      ["A", "B", "C", "M", "N", "O"],
      ["D", "E", "F", "G", "H", "I"],
    ]) as readonly string[];
    const [p, q, r, x, y, z] = names as [string, string, string, string, string, string];
    const a = rng.int(3, 40);
    if (!hard)
      return ask(
        rng,
        `Triangle $${p}${q}${r}$ is congruent to triangle $${x}${y}${z}$, in that order. If $${q}${r} = ${a}$, which side of the second triangle also has length $${a}$?`,
        `三角形 $${p}${q}${r}$ 与三角形 $${x}${y}${z}$ 全等，顶点按此顺序对应。若 $${q}${r} = ${a}$，第二个三角形的哪条边长也是 $${a}$？`,
        `\\overline{${y}${z}}`,
        [`\\overline{${x}${y}}`, `\\overline{${x}${z}}`, `\\overline{${q}${x}}`],
        worked(
          [
            step(
              "Match the vertices",
              "对应顶点",
              `The order of the letters gives the matching: $${p} \\to ${x}$, $${q} \\to ${y}$, $${r} \\to ${z}$.`,
              `字母顺序给出对应：$${p} \\to ${x}$，$${q} \\to ${y}$，$${r} \\to ${z}$。`,
            ),
            step(
              "Match the side",
              "对应边",
              `Side $\\overline{${q}${r}}$ joins the 2nd and 3rd vertices, so it matches $\\overline{${y}${z}}$, which has length $${a}$.`,
              `边 $\\overline{${q}${r}}$ 连接第 2、3 个顶点，所以对应 $\\overline{${y}${z}}$，长为 $${a}$。`,
            ),
          ],
          t(
            `Both $\\overline{${q}${r}}$ and $\\overline{${y}${z}}$ are the side opposite the first vertex, $${p}$ and $${x}$.`,
            `$\\overline{${q}${r}}$ 与 $\\overline{${y}${z}}$ 都是第一个顶点（$${p}$ 与 $${x}$）的对边。`,
          ),
          [
            t(`This matches $\\overline{${p}${q}}$, the 1st and 2nd vertices.`, `它对应 $\\overline{${p}${q}}$，即第 1、2 个顶点。`),
            t(`This matches $\\overline{${p}${r}}$, the 1st and 3rd vertices.`, `它对应 $\\overline{${p}${r}}$，即第 1、3 个顶点。`),
            t(
              `This joins a vertex of each triangle, so it is not a side of either.`,
              `它连接了两个三角形各一个顶点，不是任何一个三角形的边。`,
            ),
          ],
        ),
      );
    const [b, c] = [rng.int(30, 80), rng.int(30, 60)];
    return ask(
      rng,
      `Triangle $${p}${q}${r}$ is congruent to triangle $${x}${y}${z}$, in that order. Angle $${p}$ measures $${b}^\\circ$ and angle $${r}$ measures $${c}^\\circ$. What is the measure of angle $${y}$, in degrees?`,
      `三角形 $${p}${q}${r}$ 与三角形 $${x}${y}${z}$ 全等，顶点按此顺序对应。角 $${p}$ 为 $${b}^\\circ$，角 $${r}$ 为 $${c}^\\circ$。角 $${y}$ 是多少度？`,
      180 - b - c,
      [b, c, 360 - b - c],
      worked(
        [
          step(
            "Match the angle",
            "对应角",
            `$${y}$ is the 2nd vertex, so angle $${y}$ equals angle $${q}$.`,
            `$${y}$ 是第 2 个顶点，所以角 $${y}$ 等于角 $${q}$。`,
          ),
          step(
            `Find angle ${q}`,
            `求角 ${q}`,
            `Angle $${q}$ is the third angle of the first triangle: $180 - ${b} - ${c} = ${180 - b - c}$.`,
            `角 $${q}$ 是第一个三角形的第三个角：$180 - ${b} - ${c} = ${180 - b - c}$。`,
          ),
        ],
        t(`$${b} + ${180 - b - c} + ${c} = 180$.`, `$${b} + ${180 - b - c} + ${c} = 180$。`),
        [
          t(`This is angle $${x}$, which matches angle $${p}$.`, `这是角 $${x}$，它对应角 $${p}$。`),
          t(`This is angle $${z}$, which matches angle $${r}$.`, `这是角 $${z}$，它对应角 $${r}$。`),
          t(`This uses $360$; a triangle's angles add to $180$.`, `这里用了 $360$；三角形内角和为 $180$。`),
        ],
      ),
    );
  },
  "Using Corresponding Parts Under Similarity": (rng, hard) => {
    const [a, b] = [rng.int(30, 80), rng.int(30, 70)];
    if (!hard)
      return ask(
        rng,
        `Triangles $KLM$ and $RST$ are similar, in that order. Angle $K$ measures $${a}^\\circ$ and angle $S$ measures $${b}^\\circ$. What is angle $M$, in degrees?`,
        `三角形 $KLM$ 与 $RST$ 相似，顶点按此顺序对应。角 $K$ 为 $${a}^\\circ$，角 $S$ 为 $${b}^\\circ$。角 $M$ 是多少度？`,
        180 - a - b,
        [a, b, a + b],
        worked(
          [
            step(
              "Match the angles",
              "对应角",
              `$L$ matches $S$, and similar triangles have equal corresponding angles, so angle $L$ is $${b}^\\circ$.`,
              `$L$ 对应 $S$，相似三角形对应角相等，所以角 $L$ 为 $${b}^\\circ$。`,
            ),
            step("Find angle M", "求角 M", `$180 - ${a} - ${b} = ${180 - a - b}$.`, `$180 - ${a} - ${b} = ${180 - a - b}$。`),
          ],
          t(
            `Angle $T$, which matches $M$, is also $180 - ${a} - ${b} = ${180 - a - b}$.`,
            `与 $M$ 对应的角 $T$ 也是 $180 - ${a} - ${b} = ${180 - a - b}$。`,
          ),
          [
            t(`This is angle $K$.`, `这是角 $K$。`),
            t(`This is angle $L$, which matches angle $S$.`, `这是与角 $S$ 对应的角 $L$。`),
            t(`This adds the two known angles; that is the exterior angle at $M$.`, `这是两个已知角之和，即 $M$ 处的外角。`),
          ],
        ),
      );
    const [p, k, q] = [rng.int(2, 12), rng.int(2, 5), rng.int(2, 12)];
    return ask(
      rng,
      `Triangles $KLM$ and $RST$ are similar, in that order, with $KL = ${p}$, $RS = ${k * p}$ and $ST = ${k * q}$. What is $LM$?`,
      `三角形 $KLM$ 与 $RST$ 相似，顶点按此顺序对应，$KL = ${p}$，$RS = ${k * p}$，$ST = ${k * q}$。$LM$ 是多少？`,
      q,
      [k * q * k, p * q, q + k * p - p],
      worked(
        [
          step(
            "Find the scale factor",
            "求比例因子",
            `$RS$ matches $KL$, and $${k * p} \\div ${p} = ${k}$, so $RST$ is $${k}$ times as large.`,
            `$RS$ 对应 $KL$，$${k * p} \\div ${p} = ${k}$，所以 $RST$ 是 $KLM$ 的 $${k}$ 倍。`,
          ),
          step(
            "Scale back",
            "缩回去",
            `$LM$ matches $ST$: $LM = ${k * q} \\div ${k} = ${q}$.`,
            `$LM$ 对应 $ST$：$LM = ${k * q} \\div ${k} = ${q}$。`,
          ),
        ],
        t(
          `$\\frac{KL}{RS} = \\frac{${p}}{${k * p}}$ and $\\frac{LM}{ST} = \\frac{${q}}{${k * q}}$ are both $\\frac{1}{${k}}$.`,
          `$\\frac{KL}{RS} = \\frac{${p}}{${k * p}}$ 与 $\\frac{LM}{ST} = \\frac{${q}}{${k * q}}$ 都等于 $\\frac{1}{${k}}$。`,
        ),
        [
          t(`This multiplies $ST$ by $${k}$; going from $RST$ to $KLM$ divides.`, `这里把 $ST$ 乘以了 $${k}$；从 $RST$ 到 $KLM$ 应该除。`),
          t(
            `This multiplies two lengths of the same triangle, which gives no matching side.`,
            `这里把同一三角形的两个长度相乘，得不到对应边。`,
          ),
          t(
            `This subtracts the difference of $RS$ and $KL$; similar sides scale by a factor, not by an added amount.`,
            `这里减去了 $RS$ 与 $KL$ 的差；相似图形的边按倍数缩放，不是加减同一个数。`,
          ),
        ],
      ),
    );
  },
  "Finding Corresponding Lengths in Similar Figures": (rng, hard) => {
    const [a, b, k] = [rng.int(3, 15), rng.int(16, 30), rng.int(2, 5)];
    if (!hard)
      return ask(
        rng,
        `A photo $${a}$ inches wide and $${b}$ inches long is enlarged so the width becomes $${k * a}$ inches. If the shape stays the same, how long is the enlargement, in inches?`,
        `一张宽 $${a}$ 英寸、长 $${b}$ 英寸的照片被放大，宽变为 $${k * a}$ 英寸。形状不变时，放大后长多少英寸？`,
        k * b,
        [b + (k - 1) * a, b, k * a + k],
        worked(
          [
            step("Find the scale factor", "求比例因子", `$${k * a} \\div ${a} = ${k}$.`, `$${k * a} \\div ${a} = ${k}$。`),
            step(
              "Scale the length",
              "放大长",
              `A similar shape multiplies every length by the same factor: $${k}(${b}) = ${k * b}$.`,
              `相似图形的每个长度都乘以同一倍数：$${k}(${b}) = ${k * b}$。`,
            ),
          ],
          t(
            `$\\frac{${a}}{${b}} = \\frac{${k * a}}{${k * b}}$, so the shape is unchanged.`,
            `$\\frac{${a}}{${b}} = \\frac{${k * a}}{${k * b}}$，形状不变。`,
          ),
          [
            t(
              `This adds the same $${(k - 1) * a}$ inches to the length as to the width; similar shapes multiply instead.`,
              `这里给长也加了 $${(k - 1) * a}$ 英寸；相似图形应该相乘。`,
            ),
            t(`This leaves the length unchanged, so the shape would change.`, `这里长没有变，形状就变了。`),
            t(`This scales the width again instead of the length.`, `这里又放大了宽，而不是长。`),
          ],
        ),
      );
    const [h, s] = [rng.int(3, 9), rng.int(2, 6)];
    return ask(
      rng,
      `A post $${h}$ feet tall casts a shadow $${s}$ feet long at the same moment a tree casts a shadow $${s * k * 2}$ feet long. How tall is the tree, in feet?`,
      `同一时刻，一根 $${h}$ 英尺的柱子投下 $${s}$ 英尺的影子，一棵树投下 $${s * k * 2}$ 英尺的影子。树高多少英尺？`,
      h * k * 2,
      [h + s * k * 2 - s, s * k * 2, h * k],
      worked(
        [
          step(
            "Set up similar triangles",
            "建立相似三角形",
            `The sun's rays make the same angle with the ground, so the heights have the same ratio as the shadows.`,
            `太阳光与地面的夹角相同，所以高度之比等于影长之比。`,
          ),
          step(
            "Scale",
            "按比例放大",
            `The tree's shadow is $${s * k * 2} \\div ${s} = ${k * 2}$ times as long, so the tree is $${h}(${k * 2}) = ${h * k * 2}$ feet.`,
            `树影是柱影的 $${s * k * 2} \\div ${s} = ${k * 2}$ 倍，所以树高 $${h}(${k * 2}) = ${h * k * 2}$ 英尺。`,
          ),
        ],
        t(`$\\frac{${h}}{${s}} = \\frac{${h * k * 2}}{${s * k * 2}}$.`, `$\\frac{${h}}{${s}} = \\frac{${h * k * 2}}{${s * k * 2}}$。`),
        [
          t(
            `This adds the difference of the shadows to the post's height instead of scaling.`,
            `这里把影长之差加到了柱高上，而没有按比例缩放。`,
          ),
          t(`This is the tree's shadow, not its height.`, `这是树影的长度，不是树高。`),
          t(`This uses half the scale factor, $${k}$ instead of $${2 * k}$.`, `这里用了比例因子的一半：$${k}$ 而不是 $${2 * k}$。`),
        ],
      ),
    );
  },
  "Using Scale Factors in Similar Figures": (rng, hard) => {
    const [a, b, c, k] = [rng.int(3, 12), rng.int(4, 13), rng.int(5, 14), rng.int(2, 6)];
    if (!hard)
      return ask(
        rng,
        `A triangle has sides $${a}$, $${b}$ and $${c}$. What is the perimeter of a similar triangle with scale factor $${k}$?`,
        `一个三角形三边长 $${a}$、$${b}$、$${c}$。比例因子为 $${k}$ 的相似三角形周长是多少？`,
        k * (a + b + c),
        [a + b + c + k, a + b + c + 3 * k, k * k * (a + b + c)],
        worked(
          [
            step(
              "Find the original perimeter",
              "求原周长",
              `$${a} + ${b} + ${c} = ${a + b + c}$.`,
              `$${a} + ${b} + ${c} = ${a + b + c}$。`,
            ),
            step(
              "Scale it",
              "按比例放大",
              `Each side is multiplied by $${k}$, so the perimeter is too: $${k}(${a + b + c}) = ${k * (a + b + c)}$.`,
              `每条边乘以 $${k}$，周长也乘以 $${k}$：$${k}(${a + b + c}) = ${k * (a + b + c)}$。`,
            ),
          ],
          t(
            `The new sides $${k * a}$, $${k * b}$ and $${k * c}$ add to $${k * (a + b + c)}$.`,
            `新的三边 $${k * a}$、$${k * b}$、$${k * c}$ 之和为 $${k * (a + b + c)}$。`,
          ),
          [
            t(`This adds the scale factor instead of multiplying by it.`, `这里加上了比例因子，而不是乘以它。`),
            t(`This adds $${k}$ to each side instead of multiplying.`, `这里给每条边加了 $${k}$，而不是相乘。`),
            t(`This scales by $${k}^2$, which is for area, not perimeter.`, `这里按 $${k}^2$ 缩放，那是面积的比例，不是周长的。`),
          ],
        ),
      );
    const inches = rng.int(2, 12);
    return ask(
      rng,
      `On a map, $1$ inch represents $${k * 5}$ miles. Two towns are $${k * 5 * inches}$ miles apart. How many inches apart are they on the map?`,
      `地图上 $1$ 英寸代表 $${k * 5}$ 英里。两镇相距 $${k * 5 * inches}$ 英里。它们在地图上相距多少英寸？`,
      inches,
      [k * 5 * k * 5 * inches, inches + k * 5, k * inches],
      worked(
        [
          step("Read the scale", "读比例尺", `Every inch on the map stands for $${k * 5}$ miles.`, `地图上每英寸代表 $${k * 5}$ 英里。`),
          step(
            "Divide",
            "相除",
            `$${k * 5 * inches} \\div ${k * 5} = ${inches}$ inches.`,
            `$${k * 5 * inches} \\div ${k * 5} = ${inches}$ 英寸。`,
          ),
        ],
        t(
          `$${inches}$ inches at $${k * 5}$ miles each is $${k * 5 * inches}$ miles.`,
          `$${inches}$ 英寸，每英寸 $${k * 5}$ 英里，共 $${k * 5 * inches}$ 英里。`,
        ),
        [
          t(`This multiplies by the scale instead of dividing.`, `这里乘以了比例尺，而不是除以它。`),
          t(`This adds the scale to the answer.`, `这里把比例尺加到了答案上。`),
          t(`This multiplies by $${k}$ and never uses the $5$.`, `这里乘了 $${k}$，却没有用到 $5$。`),
        ],
      ),
    );
  },
  "Finding Areas of Similar Figures": (rng, hard) => {
    const [a, k] = [rng.int(2, 25), rng.int(2, 6)];
    if (!hard)
      return ask(
        rng,
        `A rug has area $${a}$ square feet. A similar rug has sides $${k}$ times as long. What is the area of the larger rug, in square feet?`,
        `一块地毯面积为 $${a}$ 平方英尺。一块相似的地毯边长是它的 $${k}$ 倍。大地毯的面积是多少平方英尺？`,
        k * k * a,
        [k * a, 2 * k * a, k ** 3 * a],
        worked(
          [
            step(
              "Square the factor",
              "把比例因子平方",
              `Area uses two lengths, each multiplied by $${k}$, so it is multiplied by $${k}^2 = ${k * k}$.`,
              `面积涉及两个长度，每个都乘以 $${k}$，所以面积乘以 $${k}^2 = ${k * k}$。`,
            ),
            step("Multiply", "相乘", `$${k * k}(${a}) = ${k * k * a}$.`, `$${k * k}(${a}) = ${k * k * a}$。`),
          ],
          t(
            `A $1$ by $1$ square becomes $${k}$ by $${k}$, which holds $${k * k}$ of the small squares.`,
            `$1 \\times 1$ 的正方形变为 $${k} \\times ${k}$，包含 $${k * k}$ 个小正方形。`,
          ),
          [
            t(`This scales the area like a length, by $${k}$.`, `这里把面积当作长度，只乘了 $${k}$。`),
            t(`This doubles the factor instead of squaring it.`, `这里把比例因子乘以 $2$，而不是平方。`),
            t(`This cubes the factor, which is for volume.`, `这里把比例因子立方了，那是体积的比例。`),
          ],
        ),
      );
    const side = rng.int(2, 15);
    return ask(
      rng,
      `Two similar pentagons have areas $${a}$ and $${k * k * a}$. A side of the smaller pentagon has length $${side}$. What is the length of the matching side of the larger pentagon?`,
      `两个相似五边形面积为 $${a}$ 和 $${k * k * a}$。较小者的一条边长 $${side}$。较大者的对应边长多少？`,
      k * side,
      [k * k * side, side + k, side + k * k],
      worked(
        [
          step("Find the area ratio", "求面积比", `$${k * k * a} \\div ${a} = ${k * k}$.`, `$${k * k * a} \\div ${a} = ${k * k}$。`),
          step(
            "Take the square root",
            "开平方",
            `Lengths scale by the square root of the area ratio, $\\sqrt{${k * k}} = ${k}$, so the side is $${k}(${side}) = ${k * side}$.`,
            `长度按面积比的平方根缩放，$\\sqrt{${k * k}} = ${k}$，所以对应边长为 $${k}(${side}) = ${k * side}$。`,
          ),
        ],
        t(
          `$\\left(\\frac{${k * side}}{${side}}\\right)^2 = ${k * k}$, the area ratio.`,
          `$\\left(\\frac{${k * side}}{${side}}\\right)^2 = ${k * k}$，正是面积比。`,
        ),
        [
          t(`This scales the side by the area ratio; lengths use its square root.`, `这里按面积比缩放了边长；长度应按其平方根缩放。`),
          t(`This adds the length factor instead of multiplying.`, `这里加上了长度比例，而不是相乘。`),
          t(`This adds the area ratio to the side.`, `这里把面积比加到了边长上。`),
        ],
      ),
      twoTrianglesFigure(anglePts(50, 70), { s: [null, `${side}`, null] }, { s: [null, "?", null] }, 1.6),
    );
  },
  "Applying the Pythagorean Theorem": (rng, hard) => {
    const [p, q, c] = rng.pick(triples);
    const k = rng.int(1, 6);
    if (!hard)
      return ask(
        rng,
        `In the right triangle shown, what is the length of the side marked "?"?`,
        `图中直角三角形里，标有 "?" 的边长是多少？`,
        q * k,
        [p * k + c * k, (c - p) * k, c * k + 1],
        worked(
          [
            step(
              "Identify the sides",
              "认出各边",
              `The side across from the right angle, $${c * k}$, is the hypotenuse, so the marked side is a leg.`,
              `直角所对的边 $${c * k}$ 是斜边，所以标记的边是直角边。`,
            ),
            step(
              "Subtract squares",
              "平方相减",
              `$${c * k}^2 - ${p * k}^2 = ${(c * k) ** 2} - ${(p * k) ** 2} = ${(q * k) ** 2}$, and $\\sqrt{${(q * k) ** 2}} = ${q * k}$.`,
              `$${c * k}^2 - ${p * k}^2 = ${(c * k) ** 2} - ${(p * k) ** 2} = ${(q * k) ** 2}$，而 $\\sqrt{${(q * k) ** 2}} = ${q * k}$。`,
            ),
          ],
          t(
            `$${p * k}^2 + ${q * k}^2 = ${(p * k) ** 2} + ${(q * k) ** 2} = ${(c * k) ** 2} = ${c * k}^2$.`,
            `$${p * k}^2 + ${q * k}^2 = ${(p * k) ** 2} + ${(q * k) ** 2} = ${(c * k) ** 2} = ${c * k}^2$。`,
          ),
          [
            t(`This adds the two sides; a leg is shorter than the hypotenuse.`, `这里把两边相加了；直角边比斜边短。`),
            t(`This subtracts the lengths instead of their squares.`, `这里把长度相减了，而应把平方相减。`),
            t(`A leg cannot be longer than the hypotenuse.`, `直角边不可能比斜边长。`),
          ],
        ),
        polyFigure(rightPts(q, p), { s: [`${p * k}`, "?", `${c * k}`], right: 1 }),
      );
    const [m, n] = [rng.int(1, 5), rng.int(2, 7)];
    return ask(
      rng,
      `What is the distance between the points $(${m}, ${n})$ and $(${m + p * k}, ${n + q * k})$ in the standard $(x, y)$ coordinate plane?`,
      `在标准 $(x, y)$ 坐标平面中，点 $(${m}, ${n})$ 与 $(${m + p * k}, ${n + q * k})$ 的距离是多少？`,
      c * k,
      [p * k + q * k, q * k, (p + q) * k + m],
      worked(
        [
          step(
            "Find the changes",
            "求变化量",
            `$x$ changes by $${m + p * k} - ${m} = ${p * k}$ and $y$ by $${n + q * k} - ${n} = ${q * k}$: the legs of a right triangle.`,
            `$x$ 变化 $${m + p * k} - ${m} = ${p * k}$，$y$ 变化 $${n + q * k} - ${n} = ${q * k}$：这是直角三角形的两条直角边。`,
          ),
          step(
            "Find the hypotenuse",
            "求斜边",
            `$\\sqrt{${(p * k) ** 2} + ${(q * k) ** 2}} = \\sqrt{${(c * k) ** 2}} = ${c * k}$.`,
            `$\\sqrt{${(p * k) ** 2} + ${(q * k) ** 2}} = \\sqrt{${(c * k) ** 2}} = ${c * k}$。`,
          ),
        ],
        t(
          `The distance $${c * k}$ is longer than each change and shorter than their sum $${(p + q) * k}$.`,
          `距离 $${c * k}$ 比每个变化量都长，又比它们的和 $${(p + q) * k}$ 短。`,
        ),
        [
          t(
            `This adds the changes, the path along the grid, not the straight distance.`,
            `这是两个变化量之和，即沿网格走的路程，不是直线距离。`,
          ),
          t(`This is only the vertical change.`, `这只是竖直方向的变化。`),
          t(`This adds the changes and the first $x$-coordinate.`, `这里把变化量与第一个点的 $x$ 坐标相加了。`),
        ],
      ),
    );
  },
  "Modeling Situations Using the Pythagorean Theorem": (rng, hard) => {
    const [p, q, c] = rng.pick(triples);
    const k = rng.int(1, 5);
    if (!hard)
      return ask(
        rng,
        `A park path runs $${p * k}$ yards east and then $${q * k}$ yards north. A shortcut goes straight from start to finish. How many yards long is the shortcut?`,
        `公园小路先向东 $${p * k}$ 码，再向北 $${q * k}$ 码。一条捷径从起点直达终点。捷径长多少码？`,
        c * k,
        [(p + q) * k, q * k, (q - p) * k + c],
        worked(
          [
            step(
              "Draw the triangle",
              "画出三角形",
              `East and north meet at a right angle, so the two parts of the path are legs and the shortcut is the hypotenuse.`,
              `向东与向北成直角，所以两段小路是直角边，捷径是斜边。`,
            ),
            step(
              "Apply the theorem",
              "用勾股定理",
              `$\\sqrt{${(p * k) ** 2} + ${(q * k) ** 2}} = \\sqrt{${(c * k) ** 2}} = ${c * k}$.`,
              `$\\sqrt{${(p * k) ** 2} + ${(q * k) ** 2}} = \\sqrt{${(c * k) ** 2}} = ${c * k}$。`,
            ),
          ],
          t(
            `The shortcut, $${c * k}$ yards, is shorter than the path, $${(p + q) * k}$ yards.`,
            `捷径 $${c * k}$ 码比原路 $${(p + q) * k}$ 码短。`,
          ),
          [
            t(`This is the length of the path itself, not the shortcut.`, `这是原路的长度，不是捷径。`),
            t(`This is only the northern part.`, `这只是向北的一段。`),
            t(`This does not use the Pythagorean theorem.`, `这里没有用勾股定理。`),
          ],
        ),
      );
    return ask(
      rng,
      `A support wire $${c * k}$ feet long runs from the top of a vertical pole to a stake $${p * k}$ feet from the pole's base on level ground. How many feet shorter is the pole than the wire?`,
      `一根 $${c * k}$ 英尺长的拉线从竖直杆顶连到水平地面上距杆底 $${p * k}$ 英尺的桩。杆高比拉线短多少英尺？`,
      (c - q) * k,
      [q * k, (c - p) * k, c * k + q * k],
      worked(
        [
          step(
            "Find the pole's height",
            "求杆高",
            `The wire is the hypotenuse and the ground is one leg: $\\sqrt{${(c * k) ** 2} - ${(p * k) ** 2}} = \\sqrt{${(q * k) ** 2}} = ${q * k}$.`,
            `拉线是斜边，地面是一条直角边：$\\sqrt{${(c * k) ** 2} - ${(p * k) ** 2}} = \\sqrt{${(q * k) ** 2}} = ${q * k}$。`,
          ),
          step("Compare", "比较", `$${c * k} - ${q * k} = ${(c - q) * k}$.`, `$${c * k} - ${q * k} = ${(c - q) * k}$。`),
        ],
        t(`$${p * k}^2 + ${q * k}^2 = ${(c * k) ** 2} = ${c * k}^2$.`, `$${p * k}^2 + ${q * k}^2 = ${(c * k) ** 2} = ${c * k}^2$。`),
        [
          t(`This is the pole's height, not how much shorter it is.`, `这是杆高，不是短了多少。`),
          t(`This compares the wire with the ground distance, not the pole.`, `这是拉线与地面距离之差，不是与杆高之差。`),
          t(`This adds the wire and the pole.`, `这里把拉线与杆高相加了。`),
        ],
      ),
    );
  },
  "Problem-Solving With Special Triangles": (rng, hard) => {
    const a = rng.int(2, 30);
    if (!hard)
      return ask(
        rng,
        `What is the length of the diagonal of a square with side length $${a}$?`,
        `边长为 $${a}$ 的正方形，对角线长多少？`,
        `${a}\\sqrt{2}`,
        [`${2 * a}`, `${a}\\sqrt{3}`, `${2 * a}\\sqrt{2}`],
        worked(
          [
            step(
              "Split the square",
              "分割正方形",
              `The diagonal cuts the square into two $45$-$45$-$90$ triangles with legs $${a}$.`,
              `对角线把正方形分成两个直角边为 $${a}$ 的 $45$-$45$-$90$ 三角形。`,
            ),
            step(
              "Use the ratio",
              "用边长比",
              `The hypotenuse is a leg times $\\sqrt{2}$: $${a}\\sqrt{2}$.`,
              `斜边等于直角边乘以 $\\sqrt{2}$：$${a}\\sqrt{2}$。`,
            ),
          ],
          t(`$${a}^2 + ${a}^2 = ${2 * a * a} = (${a}\\sqrt{2})^2$.`, `$${a}^2 + ${a}^2 = ${2 * a * a} = (${a}\\sqrt{2})^2$。`),
          [
            t(`This adds the two sides; the diagonal is shorter than that.`, `这里把两边相加了；对角线比这个短。`),
            t(`$\\sqrt{3}$ belongs to the $30$-$60$-$90$ triangle.`, `$\\sqrt{3}$ 属于 $30$-$60$-$90$ 三角形。`),
            t(`This doubles the diagonal.`, `这是对角线的两倍。`),
          ],
        ),
      );
    return ask(
      rng,
      `A ramp makes a $30^\\circ$ angle with the level ground and is $${2 * a}$ feet long. How high does it rise, in feet?`,
      `一个斜坡与水平地面成 $30^\\circ$ 角，长 $${2 * a}$ 英尺。它升高多少英尺？`,
      a,
      [`${a}\\sqrt{3}`, `${2 * a}\\sqrt{3}`, `${a}\\sqrt{2}`],
      worked(
        [
          step(
            "Name the triangle",
            "认出三角形",
            `The ramp, the ground and the rise form a $30$-$60$-$90$ triangle with hypotenuse $${2 * a}$.`,
            `斜坡、地面与升高构成斜边为 $${2 * a}$ 的 $30$-$60$-$90$ 三角形。`,
          ),
          step(
            "Use the ratio",
            "用边长比",
            `The rise is opposite the $30^\\circ$ angle, half the hypotenuse: $${2 * a} \\div 2 = ${a}$.`,
            `升高是 $30^\\circ$ 角的对边，等于斜边的一半：$${2 * a} \\div 2 = ${a}$。`,
          ),
        ],
        t(
          `The ground run is $${a}\\sqrt{3}$, and $${a}^2 + 3(${a * a}) = ${4 * a * a} = ${2 * a}^2$.`,
          `地面长度为 $${a}\\sqrt{3}$，而 $${a}^2 + 3(${a * a}) = ${4 * a * a} = ${2 * a}^2$。`,
        ),
        [
          t(`This is the ground run, the side next to the $30^\\circ$ angle.`, `这是地面长度，即 $30^\\circ$ 角的邻边。`),
          t(`This is longer than the ramp itself.`, `这比斜坡本身还长。`),
          t(`$\\sqrt{2}$ belongs to the $45$-$45$-$90$ triangle.`, `$\\sqrt{2}$ 属于 $45$-$45$-$90$ 三角形。`),
        ],
      ),
      polyFigure(rightPts(Math.sqrt(3), 1), { a: [null, null, "30°"], s: ["?", null, `${2 * a}`], right: 1 }),
    );
  },
  "Finding Trigonometric Ratios": (rng, hard) => {
    const [p, q, c] = rng.pick(triples);
    const k = rng.int(2, 5);
    const [opp, adj] = rng.int(0, 1) === 1 ? [p, q] : [q, p];
    if (!hard)
      return ask(
        rng,
        `In the right triangle shown, what is $\\cos A$?`,
        `图中直角三角形里，$\\cos A$ 是多少？`,
        ratio(adj, c),
        [ratio(opp, c), ratio(opp, adj), ratio(c, adj)],
        worked(
          [
            step(
              "Label the sides from A",
              "从 A 看各边",
              `From angle $A$, the adjacent leg is $${adj * k}$, the opposite leg is $${opp * k}$ and the hypotenuse is $${c * k}$.`,
              `从角 $A$ 看，邻边为 $${adj * k}$，对边为 $${opp * k}$，斜边为 $${c * k}$。`,
            ),
            step(
              "Form the ratio",
              "写出比值",
              `Cosine is adjacent over hypotenuse: $\\frac{${adj * k}}{${c * k}} = ${ratio(adj, c)}$.`,
              `余弦是邻边比斜边：$\\frac{${adj * k}}{${c * k}} = ${ratio(adj, c)}$。`,
            ),
          ],
          t(
            `$\\sin^2 A + \\cos^2 A = \\frac{${opp * opp} + ${adj * adj}}{${c * c}} = 1$.`,
            `$\\sin^2 A + \\cos^2 A = \\frac{${opp * opp} + ${adj * adj}}{${c * c}} = 1$。`,
          ),
          [
            t(`This is $\\sin A$, opposite over hypotenuse.`, `这是 $\\sin A$，对边比斜边。`),
            t(`This is $\\tan A$, opposite over adjacent.`, `这是 $\\tan A$，对边比邻边。`),
            t(`This is the reciprocal of $\\cos A$; a cosine is never more than $1$.`, `这是 $\\cos A$ 的倒数；余弦不会大于 $1$。`),
          ],
        ),
        polyFigure(rightPts(adj, opp), { v: ["B", "C", "A"], s: [`${opp * k}`, `${adj * k}`, `${c * k}`], right: 1 }),
      );
    return ask(
      rng,
      `In right triangle $RST$, angle $S$ is the right angle, $RS = ${adj * k}$ and $ST = ${opp * k}$. What is $\\tan T$?`,
      `在直角三角形 $RST$ 中，角 $S$ 是直角，$RS = ${adj * k}$，$ST = ${opp * k}$。$\\tan T$ 是多少？`,
      ratio(adj, opp),
      [ratio(opp, adj), ratio(adj, c), ratio(opp, c)],
      worked(
        [
          step(
            "Label the sides from T",
            "从 T 看各边",
            `From angle $T$, $RS$ is opposite and $ST$ is adjacent, since $ST$ touches $T$.`,
            `从角 $T$ 看，$RS$ 是对边，$ST$ 是邻边，因为 $ST$ 经过 $T$。`,
          ),
          step(
            "Form the ratio",
            "写出比值",
            `$\\tan T = \\frac{${adj * k}}{${opp * k}} = ${ratio(adj, opp)}$.`,
            `$\\tan T = \\frac{${adj * k}}{${opp * k}} = ${ratio(adj, opp)}$。`,
          ),
        ],
        t(
          `$\\tan R = ${ratio(opp, adj)}$, and $\\tan T \\cdot \\tan R = 1$, as it is for the two acute angles of a right triangle.`,
          `$\\tan R = ${ratio(opp, adj)}$，而 $\\tan T \\cdot \\tan R = 1$，直角三角形两锐角正是如此。`,
        ),
        [
          t(`This is $\\tan R$, from the other acute angle.`, `这是 $\\tan R$，从另一个锐角看的。`),
          t(`This is $\\sin T$, opposite over hypotenuse; tangent uses the two legs.`, `这是 $\\sin T$，对边比斜边；正切只用两条直角边。`),
          t(`This is $\\cos T$, adjacent over hypotenuse; tangent uses the two legs.`, `这是 $\\cos T$，邻边比斜边；正切只用两条直角边。`),
        ],
      ),
    );
  },
  "Finding a Trigonometric Ratio From Other Ratios": (rng, hard) => {
    const [p, q, c] = rng.pick(moreTriples);
    const [opp, adj] = rng.int(0, 1) === 1 ? [p, q] : [q, p];
    if (!hard) {
      const fromCos = rng.int(0, 1) === 1;
      const given = fromCos ? `\\cos \\theta = ${ratio(adj, c)}` : `\\sin \\theta = ${ratio(opp, c)}`;
      return ask(
        rng,
        `If $${given}$ and $\\theta$ is an acute angle, what is $\\tan \\theta$?`,
        `若 $${given}$，$\\theta$ 为锐角，$\\tan \\theta$ 是多少？`,
        ratio(opp, adj),
        [ratio(adj, opp), ratio(adj, c), ratio(c, opp)],
        worked(
          [
            step(
              "Draw the triangle",
              "画出三角形",
              fromCos
                ? `$\\cos \\theta = ${ratio(adj, c)}$ means an adjacent leg of $${adj}$ and a hypotenuse of $${c}$.`
                : `$\\sin \\theta = ${ratio(opp, c)}$ means an opposite leg of $${opp}$ and a hypotenuse of $${c}$.`,
              fromCos
                ? `$\\cos \\theta = ${ratio(adj, c)}$ 表示邻边 $${adj}$、斜边 $${c}$。`
                : `$\\sin \\theta = ${ratio(opp, c)}$ 表示对边 $${opp}$、斜边 $${c}$。`,
            ),
            step(
              "Find the missing leg",
              "求另一条直角边",
              fromCos
                ? `$\\sqrt{${c * c} - ${adj * adj}} = \\sqrt{${opp * opp}} = ${opp}$.`
                : `$\\sqrt{${c * c} - ${opp * opp}} = \\sqrt{${adj * adj}} = ${adj}$.`,
              fromCos
                ? `$\\sqrt{${c * c} - ${adj * adj}} = \\sqrt{${opp * opp}} = ${opp}$。`
                : `$\\sqrt{${c * c} - ${opp * opp}} = \\sqrt{${adj * adj}} = ${adj}$。`,
            ),
            step("Form the tangent", "写出正切", `$\\tan \\theta = \\frac{${opp}}{${adj}}$.`, `$\\tan \\theta = \\frac{${opp}}{${adj}}$。`),
          ],
          t(
            `$${opp}^2 + ${adj}^2 = ${opp * opp} + ${adj * adj} = ${c * c} = ${c}^2$.`,
            `$${opp}^2 + ${adj}^2 = ${opp * opp} + ${adj * adj} = ${c * c} = ${c}^2$。`,
          ),
          [
            t(`This is adjacent over opposite, the reciprocal of the tangent.`, `这是邻边比对边，是正切的倒数。`),
            t(`This is $\\cos \\theta$, not $\\tan \\theta$.`, `这是 $\\cos \\theta$，不是 $\\tan \\theta$。`),
            t(`This is hypotenuse over opposite, the reciprocal of $\\sin \\theta$.`, `这是斜边比对边，是 $\\sin \\theta$ 的倒数。`),
          ],
        ),
      );
    }
    return ask(
      rng,
      `If $\\tan \\theta = ${ratio(opp, adj)}$ and $180^\\circ < \\theta < 270^\\circ$, what is $\\cos \\theta$?`,
      `若 $\\tan \\theta = ${ratio(opp, adj)}$，且 $180^\\circ < \\theta < 270^\\circ$，$\\cos \\theta$ 是多少？`,
      `-${ratio(adj, c)}`,
      [ratio(adj, c), `-${ratio(opp, c)}`, ratio(opp, c)],
      worked(
        [
          step(
            "Build the reference triangle",
            "作参考三角形",
            `Legs $${opp}$ and $${adj}$ give hypotenuse $\\sqrt{${opp * opp} + ${adj * adj}} = ${c}$, so the size of $\\cos \\theta$ is $${ratio(adj, c)}$.`,
            `直角边 $${opp}$、$${adj}$ 给出斜边 $\\sqrt{${opp * opp} + ${adj * adj}} = ${c}$，所以 $\\cos \\theta$ 的大小为 $${ratio(adj, c)}$。`,
          ),
          step(
            "Choose the sign",
            "确定符号",
            `Between $180^\\circ$ and $270^\\circ$ the angle is in the third quadrant, where $x$ is negative, so $\\cos \\theta = -${ratio(adj, c)}$.`,
            `$180^\\circ$ 到 $270^\\circ$ 之间是第三象限，那里 $x$ 为负，所以 $\\cos \\theta = -${ratio(adj, c)}$。`,
          ),
        ],
        t(
          `Then $\\sin \\theta = -${ratio(opp, c)}$, and $\\frac{\\sin \\theta}{\\cos \\theta} = ${ratio(opp, adj)}$, positive as given.`,
          `于是 $\\sin \\theta = -${ratio(opp, c)}$，而 $\\frac{\\sin \\theta}{\\cos \\theta} = ${ratio(opp, adj)}$，与所给的正值一致。`,
        ),
        [
          t(`This has the right size but the wrong sign for the third quadrant.`, `大小对了，但在第三象限符号应为负。`),
          t(`This is $\\sin \\theta$, not $\\cos \\theta$.`, `这是 $\\sin \\theta$，不是 $\\cos \\theta$。`),
          t(`This is the size of $\\sin \\theta$, with the wrong sign too.`, `这是 $\\sin \\theta$ 的大小，符号也不对。`),
        ],
      ),
    );
  },
  "Using Cofunction Relationships": (rng, hard) => {
    const a = rng.int(10, 40) + 40 * rng.int(0, 1);
    const [p, q, c] = rng.pick(moreTriples);
    const [opp, adj] = rng.int(0, 1) === 1 ? [p, q] : [q, p];
    if (!hard)
      return ask(
        rng,
        `If $\\sin ${a}^\\circ = k$, which of the following also equals $k$?`,
        `若 $\\sin ${a}^\\circ = k$，下列哪一项也等于 $k$？`,
        `\\cos ${90 - a}^\\circ`,
        [`\\cos ${a}^\\circ`, `\\sin ${90 - a}^\\circ`, `\\tan ${a}^\\circ`],
        worked(
          [
            step(
              "Find the other acute angle",
              "求另一个锐角",
              `In a right triangle with a $${a}^\\circ$ angle, the other acute angle is $90 - ${a} = ${90 - a}^\\circ$.`,
              `含 $${a}^\\circ$ 角的直角三角形中，另一个锐角为 $90 - ${a} = ${90 - a}^\\circ$。`,
            ),
            step(
              "Swap sine for cosine",
              "正弦换余弦",
              `The side opposite $${a}^\\circ$ is next to $${90 - a}^\\circ$, so $\\sin ${a}^\\circ = \\cos ${90 - a}^\\circ$.`,
              `$${a}^\\circ$ 的对边是 $${90 - a}^\\circ$ 的邻边，所以 $\\sin ${a}^\\circ = \\cos ${90 - a}^\\circ$。`,
            ),
          ],
          t(`Both equal the same side over the same hypotenuse.`, `两者都等于同一条边比同一条斜边。`),
          [
            t(
              `$\\cos ${a}^\\circ$ uses the side next to $${a}^\\circ$, not across from it.`,
              `$\\cos ${a}^\\circ$ 用的是 $${a}^\\circ$ 的邻边，不是对边。`,
            ),
            t(
              `$\\sin ${90 - a}^\\circ$ equals $\\cos ${a}^\\circ$, not $\\sin ${a}^\\circ$.`,
              `$\\sin ${90 - a}^\\circ$ 等于 $\\cos ${a}^\\circ$，不是 $\\sin ${a}^\\circ$。`,
            ),
            t(
              `$\\tan ${a}^\\circ$ is $\\frac{\\sin ${a}^\\circ}{\\cos ${a}^\\circ}$, a different number.`,
              `$\\tan ${a}^\\circ$ 等于 $\\frac{\\sin ${a}^\\circ}{\\cos ${a}^\\circ}$，是另一个数。`,
            ),
          ],
        ),
      );
    const fromSin = rng.int(0, 1) === 1;
    const [en, zh] = fromSin ? [`\\sin A`, `\\cos B`] : [`\\cos A`, `\\sin B`];
    return ask(
      rng,
      `In a right triangle with acute angles $A$ and $B$, $${en} = ${ratio(opp, c)}$. What is $${zh}$?`,
      `一个直角三角形的锐角为 $A$ 和 $B$，$${en} = ${ratio(opp, c)}$。$${zh}$ 是多少？`,
      ratio(opp, c),
      [ratio(adj, c), ratio(opp, adj), ratio(c, opp)],
      worked(
        [
          step(
            "Relate the angles",
            "联系两个角",
            `$A$ and $B$ add to $90^\\circ$, so the side opposite one is the side next to the other.`,
            `$A$、$B$ 之和为 $90^\\circ$，一个角的对边是另一个角的邻边。`,
          ),
          step("Read the value", "读出值", `So $${zh} = ${en} = ${ratio(opp, c)}$.`, `所以 $${zh} = ${en} = ${ratio(opp, c)}$。`),
        ],
        t(
          `Take legs $${opp}$ and $${adj}$ with hypotenuse $${c}$: the side giving $${en}$ is the same side giving $${zh}$.`,
          `取直角边 $${opp}$、$${adj}$，斜边 $${c}$：给出 $${en}$ 的那条边，也给出 $${zh}$。`,
        ),
        [
          t(
            `This is the other leg over the hypotenuse, which is $${fromSin ? "\\cos A" : "\\sin A"}$, not $${zh}$.`,
            `这是另一条直角边比斜边，即 $${fromSin ? "\\cos A" : "\\sin A"}$，不是 $${zh}$。`,
          ),
          t(`This is a tangent, a ratio of the two legs.`, `这是正切，两条直角边之比。`),
          t(`This is the reciprocal; it is more than $1$.`, `这是倒数，大于 $1$。`),
        ],
      ),
    );
  },
  "Finding a Side From a Trigonometric Ratio": (rng, hard) => {
    const [p, q, c] = rng.pick(triples);
    const k = rng.int(2, 8);
    if (!hard)
      return ask(
        rng,
        `In the right triangle shown, $\\sin A = ${ratio(p, c)}$. What is the length of the side marked "?"?`,
        `图中直角三角形里 $\\sin A = ${ratio(p, c)}$。标有 "?" 的边长是多少？`,
        p * k,
        [q * k, c * k + p, c * c * k],
        worked(
          [
            step(
              "Set up the ratio",
              "列比值",
              `The marked side is opposite $A$, and sine is opposite over hypotenuse: $\\frac{?}{${c * k}} = ${ratio(p, c)}$.`,
              `标记的边是 $A$ 的对边，正弦是对边比斜边：$\\frac{?}{${c * k}} = ${ratio(p, c)}$。`,
            ),
            step("Solve", "求解", `$? = ${c * k} \\cdot ${ratio(p, c)} = ${p * k}$.`, `$? = ${c * k} \\cdot ${ratio(p, c)} = ${p * k}$。`),
          ],
          t(`$\\frac{${p * k}}{${c * k}} = ${ratio(p, c)}$.`, `$\\frac{${p * k}}{${c * k}} = ${ratio(p, c)}$。`),
          [
            t(`This is the side next to $A$, which goes with cosine.`, `这是 $A$ 的邻边，对应余弦。`),
            t(`A leg cannot be longer than the hypotenuse.`, `直角边不可能比斜边长。`),
            t(`This multiplies by $${c}$ instead of by $${ratio(p, c)}$.`, `这里乘以了 $${c}$，而不是 $${ratio(p, c)}$。`),
          ],
        ),
        polyFigure(rightPts(q, p), { a: [null, null, "A"], s: ["?", null, `${c * k}`], right: 1 }),
      );
    return ask(
      rng,
      `A surveyor stands $${q * k}$ meters from the base of a tower on level ground. The angle of elevation to the top, $\\theta$, has $\\tan \\theta = ${ratio(p, q)}$. How tall is the tower, in meters?`,
      `一名测量员站在水平地面上，距塔底 $${q * k}$ 米。到塔顶的仰角 $\\theta$ 满足 $\\tan \\theta = ${ratio(p, q)}$。塔高多少米？`,
      p * k,
      [c * k, q * k, (p + q) * k],
      worked(
        [
          step(
            "Set up the ratio",
            "列比值",
            `The tower is opposite $\\theta$ and the ground distance is adjacent: $\\frac{h}{${q * k}} = ${ratio(p, q)}$.`,
            `塔是 $\\theta$ 的对边，地面距离是邻边：$\\frac{h}{${q * k}} = ${ratio(p, q)}$。`,
          ),
          step("Solve", "求解", `$h = ${q * k} \\cdot ${ratio(p, q)} = ${p * k}$.`, `$h = ${q * k} \\cdot ${ratio(p, q)} = ${p * k}$。`),
        ],
        t(`$\\frac{${p * k}}{${q * k}} = ${ratio(p, q)}$.`, `$\\frac{${p * k}}{${q * k}} = ${ratio(p, q)}$。`),
        [
          t(`This is the line of sight to the top, the hypotenuse.`, `这是到塔顶的视线，即斜边。`),
          t(`This is the ground distance.`, `这是地面距离。`),
          t(`This adds the ground distance to the height.`, `这里把地面距离加到了塔高上。`),
        ],
      ),
    );
  },
  "Finding Perimeters of Figures": (rng, hard) => {
    const [l, w] = [rng.int(8, 30), rng.int(2, 7)];
    if (!hard)
      return ask(
        rng,
        `A fence surrounds a rectangular pen, shown in the figure in feet. How many feet of fence are there?`,
        `一道栅栏围住一个长方形围栏，图中单位为英尺。栅栏长多少英尺？`,
        2 * (l + w),
        [l + w, l * w, 2 * l + w],
        worked(
          [
            step(
              "List the sides",
              "列出各边",
              `A rectangle has two sides of $${l}$ and two of $${w}$.`,
              `长方形有两条 $${l}$ 的边和两条 $${w}$ 的边。`,
            ),
            step(
              "Add them",
              "相加",
              `$2(${l}) + 2(${w}) = ${2 * l} + ${2 * w} = ${2 * (l + w)}$.`,
              `$2(${l}) + 2(${w}) = ${2 * l} + ${2 * w} = ${2 * (l + w)}$。`,
            ),
          ],
          t(`$${l} + ${w} + ${l} + ${w} = ${2 * (l + w)}$.`, `$${l} + ${w} + ${l} + ${w} = ${2 * (l + w)}$。`),
          [
            t(`This counts only two of the four sides.`, `这里只算了四条边中的两条。`),
            t(`This is the area, in square feet.`, `这是面积，单位是平方英尺。`),
            t(`This leaves out one of the shorter sides.`, `这里漏掉了一条短边。`),
          ],
        ),
        rectFigure(l, w, `${l}`, `${w}`),
      );
    const side = rng.int(3, 30);
    const [sides, name, nameZh] = rng.pick([
      [5, "pentagon", "五边形"],
      [6, "hexagon", "六边形"],
      [8, "octagon", "八边形"],
    ] as const);
    return ask(
      rng,
      `A square with perimeter $${4 * side}$ has the same side length as a regular ${name}. What is the perimeter of the ${name}?`,
      `一个周长为 $${4 * side}$ 的正方形与一个正${nameZh}边长相等。正${nameZh}的周长是多少？`,
      sides * side,
      [4 * side, side, sides * 4 * side],
      worked(
        [
          step("Find the side", "求边长", `$${4 * side} \\div 4 = ${side}$.`, `$${4 * side} \\div 4 = ${side}$。`),
          step(
            "Multiply by the number of sides",
            "乘以边数",
            `A regular ${name} has $${sides}$ equal sides: $${sides}(${side}) = ${sides * side}$.`,
            `正${nameZh}有 $${sides}$ 条相等的边：$${sides}(${side}) = ${sides * side}$。`,
          ),
        ],
        t(
          `$${sides * side} \\div ${sides} = ${side}$, the square's side.`,
          `$${sides * side} \\div ${sides} = ${side}$，正是正方形的边长。`,
        ),
        [
          t(`This is the square's perimeter, which has only $4$ sides.`, `这是正方形的周长，只有 $4$ 条边。`),
          t(`This is one side, not the perimeter.`, `这是一条边，不是周长。`),
          t(`This multiplies the square's perimeter, not its side, by $${sides}$.`, `这里用 $${sides}$ 乘了正方形的周长，而不是边长。`),
        ],
      ),
    );
  },
  "Finding Areas Involving Circles": (rng, hard) => {
    const r = rng.int(3, 30);
    if (!hard)
      return ask(
        rng,
        `What is the area of the circle shown?`,
        `图中圆的面积是多少？`,
        pi(r * r),
        [pi(2 * r), pi(4 * r * r), pi(2 * r * r)],
        worked(
          [
            step("Read the radius", "读出半径", `The figure marks the radius $${r}$.`, `图中标出半径为 $${r}$。`),
            step("Square it", "平方", `$A = \\pi r^2 = \\pi(${r})^2 = ${pi(r * r)}$.`, `$A = \\pi r^2 = \\pi(${r})^2 = ${pi(r * r)}$。`),
          ],
          t(
            `The circle fits in a square of side $${2 * r}$, area $${4 * r * r}$, and $${pi(r * r)} \\approx ${(3.14 * r * r).toFixed(0)}$ is a bit more than three quarters of that.`,
            `圆可放进边长 $${2 * r}$、面积 $${4 * r * r}$ 的正方形，而 $${pi(r * r)} \\approx ${(3.14 * r * r).toFixed(0)}$，略大于它的四分之三。`,
          ),
          [
            t(`This is the circumference, $2\\pi r$.`, `这是周长 $2\\pi r$。`),
            t(`This squares the diameter instead of the radius.`, `这里把直径平方了，而不是半径。`),
            t(`This doubles $r^2$; the area is $\\pi r^2$.`, `这里把 $r^2$ 乘以了 $2$；面积是 $\\pi r^2$。`),
          ],
        ),
        radiusFigure(`${r}`),
      );
    return ask(
      rng,
      `A circle has circumference $${pi(2 * r)}$. What is its area?`,
      `一个圆的周长为 $${pi(2 * r)}$。它的面积是多少？`,
      pi(r * r),
      [pi(4 * r * r), pi(2 * r), pi(r)],
      worked(
        [
          step("Find the radius", "求半径", `$2\\pi r = ${pi(2 * r)}$ gives $r = ${r}$.`, `$2\\pi r = ${pi(2 * r)}$ 得 $r = ${r}$。`),
          step("Find the area", "求面积", `$\\pi(${r})^2 = ${pi(r * r)}$.`, `$\\pi(${r})^2 = ${pi(r * r)}$。`),
        ],
        t(
          `A radius of $${r}$ gives circumference $2\\pi(${r}) = ${pi(2 * r)}$, as given.`,
          `半径 $${r}$ 给出周长 $2\\pi(${r}) = ${pi(2 * r)}$，与题设一致。`,
        ),
        [
          t(`This squares the diameter $${2 * r}$ instead of the radius.`, `这里把直径 $${2 * r}$ 平方了，而不是半径。`),
          t(`This is the circumference again.`, `这还是周长。`),
          t(`This uses the radius without squaring it.`, `这里没有把半径平方。`),
        ],
      ),
    );
  },
  "Finding Arc Length": (rng, hard) => {
    const [r, a] = [rng.int(1, 8) * 6, rng.pick([30, 45, 60, 90, 120, 150])];
    const len = (2 * r * a) / 360;
    const length = Q.of(2 * r * a, 360);
    const arc = length.isInteger() ? pi(len) : `${length.toLatex()}\\pi`;
    const frac = Q.of(a, 360).toLatex();
    if (!hard)
      return ask(
        rng,
        `In the circle shown, what is the length of the arc of the shaded sector?`,
        `图中圆里，阴影扇形的弧长是多少？`,
        arc,
        [pi(2 * r), pi(r), pi(r * r)],
        worked(
          [
            step("Find the circumference", "求周长", `$2\\pi(${r}) = ${pi(2 * r)}$.`, `$2\\pi(${r}) = ${pi(2 * r)}$。`),
            step(
              "Take the sector's share",
              "取扇形所占的部分",
              `The sector's angle is $${a}^\\circ$ out of $360^\\circ$, which is $${frac}$, so the arc is $${frac} \\cdot ${pi(2 * r)} = ${arc}$.`,
              `扇形的角是 $360^\\circ$ 中的 $${a}^\\circ$，即 $${frac}$，所以弧长为 $${frac} \\cdot ${pi(2 * r)} = ${arc}$。`,
            ),
          ],
          t(
            `$${Q.of(360, a).toLatex()}$ such arcs make the whole circle: $${Q.of(360, a).toLatex()} \\cdot ${arc} = ${pi(2 * r)}$.`,
            `$${Q.of(360, a).toLatex()}$ 段这样的弧合起来正是整个圆周：$${Q.of(360, a).toLatex()} \\cdot ${arc} = ${pi(2 * r)}$。`,
          ),
          [
            t(`This is the whole circumference.`, `这是整个周长。`),
            t(`This is half the circumference, the arc of a $180^\\circ$ sector.`, `这是半个周长，即 $180^\\circ$ 扇形的弧长。`),
            t(`This is the area of the whole circle.`, `这是整个圆的面积。`),
          ],
        ),
        sectorFigure(a, `${a}°`, `${r}`),
      );
    const k = rng.int(2, 5);
    const total = Q.of(k * 2 * r)
      .add(length)
      .toLatex();
    return ask(
      rng,
      `A wheel of radius $${r}$ inches turns through $${k}$ full turns and then a further $${a}^\\circ$. How many inches does a point on its rim travel?`,
      `一个半径 $${r}$ 英寸的轮子转了 $${k}$ 整圈，又转了 $${a}^\\circ$。轮缘上一点走了多少英寸？`,
      `${total}\\pi`,
      [
        pi(k * 2 * r),
        arc,
        `${Q.of(k * r)
          .add(length)
          .toLatex()}\\pi`,
      ],
      worked(
        [
          step(
            "Count the full turns",
            "算整圈",
            `Each full turn is the circumference $${pi(2 * r)}$, so $${k}$ turns are $${pi(k * 2 * r)}$ inches.`,
            `每整圈是一个周长 $${pi(2 * r)}$，$${k}$ 圈为 $${pi(k * 2 * r)}$ 英寸。`,
          ),
          step(
            "Add the extra arc",
            "加上多转的弧",
            `The extra $${a}^\\circ$ is $${frac}$ of a turn, $${arc}$, for a total of $${pi(k * 2 * r)} + ${arc} = ${total}\\pi$.`,
            `多转的 $${a}^\\circ$ 是一圈的 $${frac}$，即 $${arc}$，共 $${pi(k * 2 * r)} + ${arc} = ${total}\\pi$。`,
          ),
        ],
        t(
          `The point turns $${k} + ${frac}$ times, and $(${k} + ${frac}) \\cdot ${pi(2 * r)} = ${total}\\pi$.`,
          `该点共转 $${k} + ${frac}$ 圈，而 $(${k} + ${frac}) \\cdot ${pi(2 * r)} = ${total}\\pi$。`,
        ),
        [
          t(`This leaves out the extra $${a}^\\circ$.`, `这里漏掉了多转的 $${a}^\\circ$。`),
          t(`This is only the extra arc, without the full turns.`, `这只是多转的弧，没有算整圈。`),
          t(`This counts each full turn as $\\pi r$, half a circumference.`, `这里把每整圈算成 $\\pi r$，只有半个周长。`),
        ],
      ),
    );
  },
  "Writing the Equation of a Circle": (rng, hard) => {
    const [h, k, r] = [rng.int(-7, 7), rng.int(-7, 7), rng.int(2, 9)];
    if (!hard)
      return ask(
        rng,
        `Which equation describes the circle with center $(${h}, ${k})$ and radius $${r}$ in the standard $(x, y)$ coordinate plane?`,
        `在标准 $(x, y)$ 坐标平面中，哪个等式表示圆心为 $(${h}, ${k})$、半径为 $${r}$ 的圆？`,
        sum(h, k, r * r),
        [sum(h, k, r), sum(-h - 1, k, r * r), sum(h, -k - 1, r * r)],
        worked(
          [
            step(
              "Recall the form",
              "回顾标准形式",
              `A circle with center $(h, k)$ and radius $r$ is $(x - h)^2 + (y - k)^2 = r^2$.`,
              `圆心 $(h, k)$、半径 $r$ 的圆为 $(x - h)^2 + (y - k)^2 = r^2$。`,
            ),
            step(
              "Substitute",
              "代入",
              `Subtract the center's coordinates and square the radius, $${r}^2 = ${r * r}$: $${sum(h, k, r * r)}$.`,
              `减去圆心坐标，并把半径平方 $${r}^2 = ${r * r}$：$${sum(h, k, r * r)}$。`,
            ),
          ],
          t(
            `The point $(${h + r}, ${k})$ is $${r}$ from the center, and it gives $${r}^2 + 0 = ${r * r}$.`,
            `点 $(${h + r}, ${k})$ 到圆心的距离为 $${r}$，代入得 $${r}^2 + 0 = ${r * r}$。`,
          ),
          [
            t(`The right side must be $r^2 = ${r * r}$, not $r$.`, `右边应是 $r^2 = ${r * r}$，不是 $r$。`),
            t(`This has the wrong center $x$-coordinate.`, `这里圆心的 $x$ 坐标错了。`),
            t(`This has the wrong center $y$-coordinate.`, `这里圆心的 $y$ 坐标错了。`),
          ],
        ),
      );
    const scale = rng.int(1, 3);
    const [a, b, s] = [3 * scale, 4 * scale, 5 * scale];
    return ask(
      rng,
      `A circle has center $(${h}, ${k})$ and passes through the point $(${h + a}, ${k + b})$. Which equation describes the circle?`,
      `一个圆的圆心为 $(${h}, ${k})$，且过点 $(${h + a}, ${k + b})$。哪个等式表示这个圆？`,
      sum(h, k, s * s),
      [sum(h, k, s), sum(h, k, a + b), sum(-h - 1, k, s * s)],
      worked(
        [
          step(
            "Find the radius",
            "求半径",
            `The radius is the distance to the point: $\\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a * a + b * b}} = ${s}$.`,
            `半径是到该点的距离：$\\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a * a + b * b}} = ${s}$。`,
          ),
          step(
            "Write the equation",
            "写出等式",
            `The right side is $r^2 = ${s * s}$: $${sum(h, k, s * s)}$.`,
            `右边是 $r^2 = ${s * s}$：$${sum(h, k, s * s)}$。`,
          ),
        ],
        t(
          `Put in $(${h + a}, ${k + b})$: $${a}^2 + ${b}^2 = ${a * a + b * b} = ${s * s}$.`,
          `代入 $(${h + a}, ${k + b})$：$${a}^2 + ${b}^2 = ${a * a + b * b} = ${s * s}$。`,
        ),
        [
          t(`The right side must be the square of the radius, $${s * s}$.`, `右边应是半径的平方 $${s * s}$。`),
          t(`This adds the changes instead of using the distance formula.`, `这里把变化量相加了，而没有用距离公式。`),
          t(`This has the wrong center $x$-coordinate.`, `这里圆心的 $x$ 坐标错了。`),
        ],
      ),
    );
  },
  "Problem-Solving With Circles": (rng, hard) => {
    const [h, k, r] = [rng.int(-9, 9), rng.int(-9, 9), rng.int(3, 12)];
    if (!hard)
      return ask(
        rng,
        `What is the area of the circle with equation $${sum(h, k, r * r)}$?`,
        `等式为 $${sum(h, k, r * r)}$ 的圆，面积是多少？`,
        pi(r * r),
        [pi(2 * r), pi(r), pi(r ** 4)],
        worked(
          [
            step(
              "Read r squared",
              "读出 r 的平方",
              `The right side of the equation is $r^2 = ${r * r}$, so $r = ${r}$.`,
              `等式右边是 $r^2 = ${r * r}$，所以 $r = ${r}$。`,
            ),
            step("Find the area", "求面积", `$\\pi r^2 = ${pi(r * r)}$.`, `$\\pi r^2 = ${pi(r * r)}$。`),
          ],
          t(`The center $(${h}, ${k})$ does not affect the size of the circle.`, `圆心 $(${h}, ${k})$ 不影响圆的大小。`),
          [
            t(`This is the circumference.`, `这是周长。`),
            t(`This uses $r$ without squaring.`, `这里用了 $r$，没有平方。`),
            t(`This squares $${r * r}$ again; it is already $r^2$.`, `这里又把 $${r * r}$ 平方了；它已经是 $r^2$。`),
          ],
        ),
      );
    return ask(
      rng,
      `The circle $${sum(h, k, r * r)}$ is tangent to a vertical line to its right. What is the $x$-coordinate of every point on that line?`,
      `圆 $${sum(h, k, r * r)}$ 与其右侧的一条竖直线相切。这条线上每个点的 $x$ 坐标是多少？`,
      h + r,
      [h - r, h + r * r, k + r],
      worked(
        [
          step(
            "Read the center and radius",
            "读出圆心与半径",
            `The center is $(${h}, ${k})$ and $r = \\sqrt{${r * r}} = ${r}$.`,
            `圆心为 $(${h}, ${k})$，$r = \\sqrt{${r * r}} = ${r}$。`,
          ),
          step(
            "Go one radius right",
            "向右一个半径",
            `The rightmost point is $(${h} + ${r}, ${k}) = (${h + r}, ${k})$, and the tangent line is $x = ${h + r}$.`,
            `最右点为 $(${h} + ${r}, ${k}) = (${h + r}, ${k})$，切线为 $x = ${h + r}$。`,
          ),
        ],
        t(
          `At $x = ${h + r}$ the equation gives $(y ${sg(-k)})^2 = 0$, a single point, so the line just touches.`,
          `$x = ${h + r}$ 时等式得 $(y ${sg(-k)})^2 = 0$，只有一个点，所以直线恰好相切。`,
        ),
        [
          t(`This is the tangent line on the left.`, `这是左侧的切线。`),
          t(`This adds $r^2$ instead of $r$.`, `这里加的是 $r^2$，而不是 $r$。`),
          t(`This uses the $y$-coordinate of the center.`, `这里用了圆心的 $y$ 坐标。`),
        ],
      ),
    );
  },
  "Further Problem-Solving With Circles": (rng, hard) => {
    const [h, k, r] = [rng.int(1, 9), rng.int(1, 9), rng.int(2, 9)];
    const c = h * h + k * k - r * r;
    const eq = `x^2 + y^2 - ${2 * h}x - ${2 * k}y ${sg(c)} = 0`;
    if (!hard)
      return ask(
        rng,
        `What is the center of the circle $${eq}$?`,
        `圆 $${eq}$ 的圆心是什么？`,
        `(${h}, ${k})`,
        [`(${-h}, ${-k})`, `(${2 * h}, ${2 * k})`, `(${-h}, ${k})`],
        worked(
          [
            step(
              "Halve the x term",
              "x 项系数减半",
              `Half of $-${2 * h}$ is $-${h}$, so $x^2 - ${2 * h}x$ becomes part of $(x - ${h})^2$.`,
              `$-${2 * h}$ 的一半是 $-${h}$，所以 $x^2 - ${2 * h}x$ 成为 $(x - ${h})^2$ 的一部分。`,
            ),
            step(
              "Halve the y term",
              "y 项系数减半",
              `Half of $-${2 * k}$ is $-${k}$, which gives $(y - ${k})^2$, so the center is $(${h}, ${k})$.`,
              `$-${2 * k}$ 的一半是 $-${k}$，得 $(y - ${k})^2$，所以圆心为 $(${h}, ${k})$。`,
            ),
          ],
          t(
            `$(x - ${h})^2 = x^2 - ${2 * h}x + ${h * h}$ and $(y - ${k})^2 = y^2 - ${2 * k}y + ${k * k}$ give back the $x$ and $y$ terms.`,
            `$(x - ${h})^2 = x^2 - ${2 * h}x + ${h * h}$，$(y - ${k})^2 = y^2 - ${2 * k}y + ${k * k}$，还原出 $x$ 项与 $y$ 项。`,
          ),
          [
            t(`This has both signs reversed: $(x - ${h})^2$ means $x = ${h}$.`, `两个符号都反了：$(x - ${h})^2$ 表示 $x = ${h}$。`),
            t(`This uses the full coefficients without halving them.`, `这里直接用了系数，没有减半。`),
            t(`This reverses the sign of the $x$-coordinate only.`, `这里只把 $x$ 坐标的符号弄反了。`),
          ],
        ),
      );
    return ask(
      rng,
      `What is the radius of the circle $${eq}$?`,
      `圆 $${eq}$ 的半径是多少？`,
      r,
      [r * r, 2 * r, r + h],
      worked(
        [
          step(
            "Complete both squares",
            "两次配方",
            `Add $${h * h}$ and $${k * k}$ to both sides: $(x - ${h})^2 + (y - ${k})^2 = ${h * h} + ${k * k} ${sg(-c)} = ${r * r}$.`,
            `两边同加 $${h * h}$ 与 $${k * k}$：$(x - ${h})^2 + (y - ${k})^2 = ${h * h} + ${k * k} ${sg(-c)} = ${r * r}$。`,
          ),
          step("Take the square root", "开平方", `$r = \\sqrt{${r * r}} = ${r}$.`, `$r = \\sqrt{${r * r}} = ${r}$。`),
        ],
        t(
          `The point $(${h + r}, ${k})$ gives $${(h + r) ** 2} + ${k * k} - ${2 * h * (h + r)} - ${2 * k * k} ${sg(c)} = 0$.`,
          `点 $(${h + r}, ${k})$ 代入得 $${(h + r) ** 2} + ${k * k} - ${2 * h * (h + r)} - ${2 * k * k} ${sg(c)} = 0$。`,
        ),
        [
          t(`This is $r^2$, before taking the square root.`, `这是 $r^2$，还没有开平方。`),
          t(`This is the diameter.`, `这是直径。`),
          t(`This adds the center's $x$-coordinate to the radius.`, `这里把圆心的 $x$ 坐标加到了半径上。`),
        ],
      ),
    );
  },
  "Using Slopes of Parallel Lines": (rng, hard) => {
    const [a, b, c, x, y] = [rng.int(1, 6), rng.pick([2, 3, 5, 7]), rng.int(1, 20), rng.int(-5, 5), rng.int(-5, 5)];
    if (!hard)
      return ask(
        rng,
        `What is the slope of any line parallel to $${cx(a)} + ${b}y = ${c}$?`,
        `任何平行于 $${cx(a)} + ${b}y = ${c}$ 的直线，斜率是多少？`,
        Q.of(-a, b),
        [Q.of(a, b), Q.of(b, a), Q.of(c, b)],
        worked(
          [
            step(
              "Solve for y",
              "解出 y",
              `$${b}y = ${-a === -1 ? "-x" : `-${a}x`} + ${c}$, so $y = ${Q.of(-a, b).toLatex()}x + ${Q.of(c, b).toLatex()}$.`,
              `$${b}y = ${-a === -1 ? "-x" : `-${a}x`} + ${c}$，所以 $y = ${Q.of(-a, b).toLatex()}x + ${Q.of(c, b).toLatex()}$。`,
            ),
            step(
              "Use the same slope",
              "用相同的斜率",
              `Parallel lines have equal slopes, so the slope is $${Q.of(-a, b).toLatex()}$.`,
              `平行线斜率相等，所以斜率为 $${Q.of(-a, b).toLatex()}$。`,
            ),
          ],
          t(
            `Moving $${b}$ to the right in $x$ changes $${cx(a)}$ by $${a * b}$, so $${b}y$ must drop by $${a * b}$ and $y$ by $${a}$: slope $${Q.of(-a, b).toLatex()}$.`,
            `$x$ 增加 $${b}$ 时 $${cx(a)}$ 增加 $${a * b}$，$${b}y$ 必须减少 $${a * b}$，$y$ 减少 $${a}$：斜率为 $${Q.of(-a, b).toLatex()}$。`,
          ),
          [
            t(`This drops the minus sign from moving $${cx(a)}$ across.`, `这里移项时丢掉了负号。`),
            t(
              `This flips the fraction; the slope is $-\\frac{a}{b}$, not $\\frac{b}{a}$.`,
              `这里把分数颠倒了；斜率是 $-\\frac{a}{b}$，不是 $\\frac{b}{a}$。`,
            ),
            t(`This is the $y$-intercept, not the slope.`, `这是 $y$ 轴截距，不是斜率。`),
          ],
        ),
      );
    const m = a + 1;
    return ask(
      rng,
      `A line passes through $(${x}, ${y})$ and is parallel to $y = ${lin(m, c)}$. What is its $y$-intercept?`,
      `一条直线过 $(${x}, ${y})$ 且平行于 $y = ${lin(m, c)}$。它的 $y$ 轴截距是多少？`,
      y - m * x,
      [c, y + m * x, y - x],
      worked(
        [
          step(
            "Take the slope",
            "取斜率",
            `A parallel line has the same slope, $${m}$: $y = ${m}x + b$.`,
            `平行线斜率相同，为 $${m}$：$y = ${m}x + b$。`,
          ),
          step(
            "Substitute the point",
            "代入点",
            `$${y} = ${m}(${x}) + b$, so $b = ${y} ${sg(-m * x)} = ${y - m * x}$.`,
            `$${y} = ${m}(${x}) + b$，所以 $b = ${y} ${sg(-m * x)} = ${y - m * x}$。`,
          ),
        ],
        t(`$${m}(${x}) ${sg(y - m * x)} = ${y}$.`, `$${m}(${x}) ${sg(y - m * x)} = ${y}$。`),
        [
          t(
            `This is the intercept of the given line; parallel lines share slope, not intercept.`,
            `这是所给直线的截距；平行线斜率相同，截距不同。`,
          ),
          t(`This adds $${m}(${x})$ instead of subtracting it.`, `这里加上了 $${m}(${x})$，而不是减去。`),
          t(`This forgets to multiply $${x}$ by the slope.`, `这里忘了把 $${x}$ 乘以斜率。`),
        ],
      ),
    );
  },
  "Using Slopes of Perpendicular Lines": (rng, hard) => {
    const [p, q, c] = [rng.int(1, 9), rng.pick([2, 3, 5, 7, 11]), rng.int(-9, 9)];
    const a = p === q ? p + 1 : p;
    if (!hard)
      return ask(
        rng,
        `A line has slope $${Q.of(a, q).toLatex()}$. What is the slope of a line perpendicular to it?`,
        `一条直线的斜率为 $${Q.of(a, q).toLatex()}$。与它垂直的直线斜率是多少？`,
        Q.of(-q, a),
        [Q.of(q, a), Q.of(-a, q), Q.of(a, q).add(Q.one)],
        worked(
          [
            step(
              "Take the reciprocal",
              "取倒数",
              `The reciprocal of $${Q.of(a, q).toLatex()}$ is $${Q.of(q, a).toLatex()}$.`,
              `$${Q.of(a, q).toLatex()}$ 的倒数是 $${Q.of(q, a).toLatex()}$。`,
            ),
            step(
              "Change the sign",
              "变号",
              `Perpendicular slopes are negative reciprocals: $${Q.of(-q, a).toLatex()}$.`,
              `互相垂直的直线斜率互为负倒数：$${Q.of(-q, a).toLatex()}$。`,
            ),
          ],
          t(
            `$${Q.of(a, q).toLatex()} \\cdot \\left(${Q.of(-q, a).toLatex()}\\right) = -1$.`,
            `$${Q.of(a, q).toLatex()} \\cdot \\left(${Q.of(-q, a).toLatex()}\\right) = -1$。`,
          ),
          [
            t(`This is the reciprocal without the sign change.`, `这是倒数，没有变号。`),
            t(`This changes the sign without taking the reciprocal.`, `这里只变了号，没有取倒数。`),
            t(`This adds $1$ to the slope, which has no part in the rule.`, `这里给斜率加了 $1$，规则中没有这一步。`),
          ],
        ),
      );
    const x = q * rng.int(1, 3);
    const y = (-a * x) / q + c;
    return ask(
      rng,
      `Line $\\ell$ has equation $y = ${Q.of(q, a).toLatex()}x + 1$. A second line is perpendicular to $\\ell$ and has $y$-intercept $${c}$. What is the $y$-coordinate of the point on the second line with $x = ${x}$?`,
      `直线 $\\ell$ 的等式为 $y = ${Q.of(q, a).toLatex()}x + 1$。第二条直线与 $\\ell$ 垂直，$y$ 轴截距为 $${c}$。第二条直线上 $x = ${x}$ 的点，$y$ 坐标是多少？`,
      y,
      [(a * x) / q + c, c, c - x],
      worked(
        [
          step(
            "Find the slope",
            "求斜率",
            `The negative reciprocal of $${Q.of(q, a).toLatex()}$ is $${Q.of(-a, q).toLatex()}$, so the line is $y = ${Q.of(-a, q).toLatex()}x ${sg(c)}$.`,
            `$${Q.of(q, a).toLatex()}$ 的负倒数是 $${Q.of(-a, q).toLatex()}$，所以直线为 $y = ${Q.of(-a, q).toLatex()}x ${sg(c)}$。`,
          ),
          step(
            "Evaluate",
            "求值",
            `$${Q.of(-a, q).toLatex()}(${x}) ${sg(c)} = ${(-a * x) / q} ${sg(c)} = ${y}$.`,
            `$${Q.of(-a, q).toLatex()}(${x}) ${sg(c)} = ${(-a * x) / q} ${sg(c)} = ${y}$。`,
          ),
        ],
        t(
          `From $x = 0$ to $x = ${x}$ the line falls $${(a * x) / q}$, from $${c}$ to $${y}$.`,
          `从 $x = 0$ 到 $x = ${x}$，直线下降 $${(a * x) / q}$，从 $${c}$ 降到 $${y}$。`,
        ),
        [
          t(`This uses the reciprocal without the minus sign.`, `这里用了倒数，但没有负号。`),
          t(`This is the $y$-intercept, the value at $x = 0$.`, `这是 $y$ 轴截距，即 $x = 0$ 时的值。`),
          t(`This takes the slope as $-1$.`, `这里把斜率当成了 $-1$。`),
        ],
      ),
    );
  },
  "Writing the Equation of a Line": (rng, hard) => {
    const [m, x] = [rng.pick([-4, -3, -2, 2, 3, 4, 5]), rng.int(1, 6)];
    const b = rng.int(-9, 9);
    const y = m * x + b;
    if (!hard)
      return ask(
        rng,
        `Which equation describes the line with slope $${m}$ through the point $(${x}, ${y})$?`,
        `哪个等式表示斜率为 $${m}$、过点 $(${x}, ${y})$ 的直线？`,
        `y = ${lin(m, b)}`,
        [`y = ${lin(m, y)}`, `y = ${lin(-m, b)}`, `y = ${lin(m, b + 2 * m * x)}`],
        worked(
          [
            step("Start from the slope", "从斜率出发", `The line is $y = ${m}x + b$ for some $b$.`, `直线为 $y = ${m}x + b$，$b$ 待定。`),
            step(
              "Substitute the point",
              "代入点",
              `$${y} = ${m}(${x}) + b = ${m * x} + b$, so $b = ${y} ${sg(-m * x)} = ${b}$.`,
              `$${y} = ${m}(${x}) + b = ${m * x} + b$，所以 $b = ${y} ${sg(-m * x)} = ${b}$。`,
            ),
          ],
          t(`$${m}(${x}) ${sg(b)} = ${y}$, so the point is on the line.`, `$${m}(${x}) ${sg(b)} = ${y}$，所以该点在直线上。`),
          [
            t(`This uses the point's $y$-coordinate as the intercept.`, `这里把点的 $y$ 坐标当成了截距。`),
            t(`This has the slope with the wrong sign.`, `这里斜率的符号反了。`),
            t(
              `This adds $${m}(${x})$ to $b$ instead of subtracting it from $${y}$.`,
              `这里没有从 $${y}$ 中减去 $${m}(${x})$，反而加上了。`,
            ),
          ],
        ),
      );
    const d = rng.int(1, 5);
    return ask(
      rng,
      `Which equation describes the line through $(${x}, ${y})$ and $(${x + d}, ${y + m * d})$?`,
      `哪个等式表示过 $(${x}, ${y})$ 和 $(${x + d}, ${y + m * d})$ 的直线？`,
      `y = ${lin(m, b)}`,
      [`y = ${lin(-m, b)}`, `y = ${lin(m, y)}`, `y = ${lin(m, b + 1)}`],
      worked(
        [
          step(
            "Find the slope",
            "求斜率",
            `The rise is $${y + m * d} - ${par(y)} = ${m * d}$ over a run of $${x + d} - ${x} = ${d}$, so the slope is $${m * d} \\div ${d} = ${m}$.`,
            `竖直变化 $${y + m * d} - ${par(y)} = ${m * d}$，水平变化 $${x + d} - ${x} = ${d}$，所以斜率为 $${m * d} \\div ${d} = ${m}$。`,
          ),
          step("Find the intercept", "求截距", `$${y} = ${m}(${x}) + b$ gives $b = ${b}$.`, `$${y} = ${m}(${x}) + b$ 得 $b = ${b}$。`),
        ],
        t(`The second point: $${m}(${x + d}) ${sg(b)} = ${y + m * d}$.`, `第二个点：$${m}(${x + d}) ${sg(b)} = ${y + m * d}$。`),
        [
          t(`This line slopes the other way.`, `这条直线倾斜方向相反。`),
          t(`This uses the first point's $y$-coordinate as the intercept.`, `这里把第一个点的 $y$ 坐标当成了截距。`),
          t(`This intercept is $1$ too large; the line misses both points.`, `这个截距大了 $1$；直线不过这两个点。`),
        ],
      ),
      pointsFigure([
        [x, y],
        [x + d, y + m * d],
      ]),
    );
  },
  "Interpreting Slope and Its Changes": (rng, hard) => {
    const [m, b, k] = [rng.int(5, 40), rng.int(20, 300), rng.int(2, 9)];
    if (!hard)
      return words(
        rng,
        t(
          `A shop's daily revenue, in dollars, is modeled by $R = ${m}n + ${b}$, where $n$ is the number of customers. What does $${m}$ represent?`,
          `一家店每日收入（美元）的模型为 $R = ${m}n + ${b}$，$n$ 是顾客人数。$${m}$ 表示什么？`,
        ),
        t(`The added revenue per customer`, `每多一位顾客增加的收入`),
        [
          t(`The revenue with no customers`, `没有顾客时的收入`),
          t(`The number of customers per day`, `每天的顾客人数`),
          t(`The total revenue for a day`, `一天的总收入`),
        ],
        worked(
          [
            step(
              "Find what it multiplies",
              "看它乘的是什么",
              `$${m}$ multiplies $n$, the number of customers, so it is the slope.`,
              `$${m}$ 乘以顾客人数 $n$，所以它是斜率。`,
            ),
            step(
              "Read the units",
              "读单位",
              `Slope is dollars per customer: each extra customer adds $\\$${m}$.`,
              `斜率的单位是美元每位顾客：每多一位顾客增加 $\\$${m}$。`,
            ),
          ],
          t(
            `With $n = 1$, $R = ${m + b}$, and with $n = 2$, $R = ${2 * m + b}$: the revenue rose by $${m}$.`,
            `$n = 1$ 时 $R = ${m + b}$，$n = 2$ 时 $R = ${2 * m + b}$：收入增加了 $${m}$。`,
          ),
          [
            t(`That is the constant $${b}$, the value when $n = 0$.`, `那是常数 $${b}$，即 $n = 0$ 时的值。`),
            t(`That is $n$, the input of the model.`, `那是模型的输入 $n$。`),
            t(`That is $R$, the output of the model.`, `那是模型的输出 $R$。`),
          ],
        ),
      );
    return ask(
      rng,
      `A taxi's fare, in dollars, for $d$ miles is $F = ${k} + ${m}d$. By how many dollars does the fare rise when a trip is $${k + 1}$ miles longer?`,
      `出租车行驶 $d$ 英里的车费（美元）为 $F = ${k} + ${m}d$。行程多 $${k + 1}$ 英里时，车费增加多少美元？`,
      m * (k + 1),
      [m * (k + 1) + k, m, k * (k + 1)],
      worked(
        [
          step(
            "Find the rate",
            "找出变化率",
            `The slope $${m}$ is dollars per mile; the fixed $${k}$ dollars do not change with distance.`,
            `斜率 $${m}$ 是每英里的美元数；固定的 $${k}$ 美元与距离无关。`,
          ),
          step("Multiply by the change", "乘以变化量", `$${m}(${k + 1}) = ${m * (k + 1)}$.`, `$${m}(${k + 1}) = ${m * (k + 1)}$。`),
        ],
        t(
          `$F(${k + 1}) - F(0) = ${k + m * (k + 1)} - ${k} = ${m * (k + 1)}$.`,
          `$F(${k + 1}) - F(0) = ${k + m * (k + 1)} - ${k} = ${m * (k + 1)}$。`,
        ),
        [
          t(`This adds the fixed fee, which is paid once whatever the distance.`, `这里加上了固定费用，但它与距离无关，只付一次。`),
          t(`This is the rise for one more mile.`, `这是多 $1$ 英里时增加的车费。`),
          t(`This multiplies the fixed fee by the miles instead of the rate.`, `这里用固定费用乘以英里数，而应乘以每英里的价格。`),
        ],
      ),
    );
  },
  "Finding Area in the Coordinate Plane": (rng, hard) => {
    const [x, y, w, h] = [rng.int(-6, 4), rng.int(-6, 4), rng.int(2, 9), rng.int(2, 9)];
    if (!hard)
      return ask(
        rng,
        `A rectangle has opposite vertices at $(${x}, ${y})$ and $(${x + w}, ${y + h})$. What is its area?`,
        `一个长方形的两个相对顶点为 $(${x}, ${y})$ 和 $(${x + w}, ${y + h})$。它的面积是多少？`,
        w * h,
        [2 * (w + h), w + h, 2 * w * h],
        worked(
          [
            step(
              "Find the side lengths",
              "求边长",
              `The width is $${x + w} - ${par(x)} = ${w}$ and the height is $${y + h} - ${par(y)} = ${h}$.`,
              `宽为 $${x + w} - ${par(x)} = ${w}$，高为 $${y + h} - ${par(y)} = ${h}$。`,
            ),
            step("Multiply", "相乘", `$${w} \\times ${h} = ${w * h}$.`, `$${w} \\times ${h} = ${w * h}$。`),
          ],
          t(
            `Counting grid squares gives $${h}$ rows of $${w}$, which is $${w * h}$.`,
            `数格子：$${h}$ 行，每行 $${w}$ 个，共 $${w * h}$ 个。`,
          ),
          [
            t(`This is the perimeter.`, `这是周长。`),
            t(`This adds the sides instead of multiplying.`, `这里把边长相加了，而不是相乘。`),
            t(`This doubles the area.`, `这是面积的两倍。`),
          ],
        ),
      );
    const b = 2 * w;
    return ask(
      rng,
      `What is the area of the triangle with vertices $(${x}, ${y})$, $(${x + b}, ${y})$ and $(${x + 1}, ${y + h})$?`,
      `顶点为 $(${x}, ${y})$、$(${x + b}, ${y})$、$(${x + 1}, ${y + h})$ 的三角形，面积是多少？`,
      w * h,
      [b * h, b + h, 2 * b * h],
      worked(
        [
          step(
            "Find the base",
            "求底",
            `The first two points share $y = ${y}$, so the base is horizontal with length $${b}$.`,
            `前两点的 $y$ 都是 $${y}$，所以底边水平，长 $${b}$。`,
          ),
          step(
            "Find the height and area",
            "求高与面积",
            `The third point is $${y + h} - ${par(y)} = ${h}$ above it, so the area is $\\frac{1}{2}(${b})(${h}) = ${w * h}$.`,
            `第三点比它高 $${y + h} - ${par(y)} = ${h}$，所以面积为 $\\frac{1}{2}(${b})(${h}) = ${w * h}$。`,
          ),
        ],
        t(
          `The triangle fills half of a $${b}$ by $${h}$ rectangle, which has area $${b * h}$.`,
          `这个三角形占 $${b} \\times ${h}$ 长方形（面积 $${b * h}$）的一半。`,
        ),
        [
          t(`This forgets the $\\frac{1}{2}$.`, `这里忘了乘 $\\frac{1}{2}$。`),
          t(`This adds the base and height.`, `这里把底和高相加了。`),
          t(`This doubles instead of halving.`, `这里乘以了 $2$，而应除以 $2$。`),
        ],
      ),
      pointsFigure(
        [
          [x, y],
          [x + b, y],
          [x + 1, y + h],
        ],
        [
          [x, y],
          [x + b, y],
        ],
      ),
    );
  },
  "Finding Volumes of Prisms and Cylinders": (rng, hard) => {
    const [r, h, a] = [rng.int(3, 9), rng.int(2, 15), rng.int(2, 9)];
    if (!hard)
      return ask(
        rng,
        `A can is a right circular cylinder with radius $${r}$ centimeters and height $${h}$ centimeters. What is its volume, in cubic centimeters?`,
        `一个罐子是底面半径 $${r}$ 厘米、高 $${h}$ 厘米的直圆柱。它的体积是多少立方厘米？`,
        pi(r * r * h),
        [pi(2 * r * h), pi(r * h), pi(4 * r * r * h)],
        worked(
          [
            step("Find the base area", "求底面积", `$\\pi(${r})^2 = ${pi(r * r)}$.`, `$\\pi(${r})^2 = ${pi(r * r)}$。`),
            step(
              "Multiply by the height",
              "乘以高",
              `$${pi(r * r)} \\times ${h} = ${pi(r * r * h)}$.`,
              `$${pi(r * r)} \\times ${h} = ${pi(r * r * h)}$。`,
            ),
          ],
          t(
            `Each centimeter of height holds a layer of $${pi(r * r)}$, and $${h}$ layers hold $${pi(r * r * h)}$.`,
            `每 $1$ 厘米高是一层 $${pi(r * r)}$，$${h}$ 层共 $${pi(r * r * h)}$。`,
          ),
          [
            t(`This is the area of the curved side, $2\\pi rh$.`, `这是侧面积 $2\\pi rh$。`),
            t(`This uses $r$ without squaring.`, `这里没有把 $r$ 平方。`),
            t(`This squares the diameter instead of the radius.`, `这里把直径平方了，而不是半径。`),
          ],
        ),
      );
    return ask(
      rng,
      `A prism's base is a right triangle with legs $${2 * a}$ and $${r}$ inches, and the prism is $${h}$ inches tall. What is its volume, in cubic inches?`,
      `一个棱柱的底面是直角边为 $${2 * a}$ 和 $${r}$ 英寸的直角三角形，棱柱高 $${h}$ 英寸。它的体积是多少立方英寸？`,
      a * r * h,
      [2 * a * r * h, a * r + h, 2 * a + r + h],
      worked(
        [
          step(
            "Find the base area",
            "求底面积",
            `$\\frac{1}{2}(${2 * a})(${r}) = ${a * r}$ square inches.`,
            `$\\frac{1}{2}(${2 * a})(${r}) = ${a * r}$ 平方英寸。`,
          ),
          step("Multiply by the height", "乘以高", `$${a * r} \\times ${h} = ${a * r * h}$.`, `$${a * r} \\times ${h} = ${a * r * h}$。`),
        ],
        t(
          `Two such prisms make a $${2 * a}$ by $${r}$ by $${h}$ box of $${2 * a * r * h}$, twice the answer.`,
          `两个这样的棱柱拼成 $${2 * a} \\times ${r} \\times ${h}$ 的长方体，体积 $${2 * a * r * h}$，正是答案的两倍。`,
        ),
        [
          t(`This forgets the $\\frac{1}{2}$ for the triangle.`, `这里忘了三角形面积的 $\\frac{1}{2}$。`),
          t(`This adds the height instead of multiplying.`, `这里加上了高，而不是相乘。`),
          t(`This adds the three lengths.`, `这里把三个长度相加了。`),
        ],
      ),
    );
  },
  "Finding Volumes of Pyramids, Cones, and Spheres": (rng, hard) => {
    const [r, h, s] = [rng.int(2, 12), 3 * rng.int(1, 8), rng.int(2, 15)];
    if (!hard)
      return ask(
        rng,
        `A cone has base radius $${r}$ and height $${h}$. What is its volume?`,
        `一个圆锥底面半径为 $${r}$，高为 $${h}$。它的体积是多少？`,
        pi((r * r * h) / 3),
        [pi(r * r * h), pi((4 * r * r * h) / 3), pi((2 * r * r * h) / 3)],
        worked(
          [
            step(
              "Find the cylinder's volume",
              "求圆柱体积",
              `A cylinder with the same base and height holds $\\pi(${r})^2(${h}) = ${pi(r * r * h)}$.`,
              `同底同高的圆柱体积为 $\\pi(${r})^2(${h}) = ${pi(r * r * h)}$。`,
            ),
            step(
              "Take one third",
              "取三分之一",
              `A cone holds one third of that: $${pi(r * r * h)} \\div 3 = ${pi((r * r * h) / 3)}$.`,
              `圆锥是它的三分之一：$${pi(r * r * h)} \\div 3 = ${pi((r * r * h) / 3)}$。`,
            ),
          ],
          t(
            `$\\frac{1}{3}\\pi r^2 h = \\frac{1}{3}\\pi(${r * r})(${h}) = ${pi((r * r * h) / 3)}$.`,
            `$\\frac{1}{3}\\pi r^2 h = \\frac{1}{3}\\pi(${r * r})(${h}) = ${pi((r * r * h) / 3)}$。`,
          ),
          [
            t(`This is the cylinder's volume, without the $\\frac{1}{3}$.`, `这是圆柱的体积，没有乘 $\\frac{1}{3}$。`),
            t(`This uses the sphere's $\\frac{4}{3}$.`, `这里用了球的 $\\frac{4}{3}$。`),
            t(`This takes two thirds instead of one third.`, `这里取了三分之二，而不是三分之一。`),
          ],
        ),
      );
    if (s % 2 === 0)
      return ask(
        rng,
        `A sphere has radius $${r}$. What is its volume?`,
        `一个球的半径为 $${r}$。它的体积是多少？`,
        `\\frac{${4 * r ** 3}\\pi}{3}`,
        [`\\frac{${r ** 3}\\pi}{3}`, pi(4 * r * r), pi(4 * r ** 3)],
        worked(
          [
            step("Cube the radius", "把半径立方", `$${r}^3 = ${r ** 3}$.`, `$${r}^3 = ${r ** 3}$。`),
            step(
              "Apply the formula",
              "代入公式",
              `$V = \\frac{4}{3}\\pi r^3 = \\frac{4 \\cdot ${r ** 3}}{3}\\pi = \\frac{${4 * r ** 3}\\pi}{3}$.`,
              `$V = \\frac{4}{3}\\pi r^3 = \\frac{4 \\cdot ${r ** 3}}{3}\\pi = \\frac{${4 * r ** 3}\\pi}{3}$。`,
            ),
          ],
          t(
            `The sphere fits in a cube of side $${2 * r}$, volume $${8 * r ** 3}$, and $\\frac{${4 * r ** 3}\\pi}{3} \\approx ${Math.round((4 * Math.PI * r ** 3) / 3)}$ is about half of it.`,
            `球可放进边长 $${2 * r}$、体积 $${8 * r ** 3}$ 的立方体，而 $\\frac{${4 * r ** 3}\\pi}{3} \\approx ${Math.round((4 * Math.PI * r ** 3) / 3)}$，约为其一半。`,
          ),
          [
            t(`This leaves out the $4$ in $\\frac{4}{3}$.`, `这里漏掉了 $\\frac{4}{3}$ 中的 $4$。`),
            t(`This is the surface area, $4\\pi r^2$.`, `这是表面积 $4\\pi r^2$。`),
            t(`This leaves out the division by $3$.`, `这里漏掉了除以 $3$。`),
          ],
        ),
      );
    return ask(
      rng,
      `A pyramid has a square base of side $${s}$ and a height of $${h}$. What is its volume?`,
      `一个棱锥底面是边长 $${s}$ 的正方形，高为 $${h}$。它的体积是多少？`,
      (s * s * h) / 3,
      [s * s * h, (4 * s * s * h) / 3, (2 * s * s * h) / 3],
      worked(
        [
          step("Find the base area", "求底面积", `$${s}^2 = ${s * s}$.`, `$${s}^2 = ${s * s}$。`),
          step(
            "Take one third of base times height",
            "底面积乘高再取三分之一",
            `$\\frac{1}{3}(${s * s})(${h}) = ${s * s} \\times ${h / 3} = ${(s * s * h) / 3}$.`,
            `$\\frac{1}{3}(${s * s})(${h}) = ${s * s} \\times ${h / 3} = ${(s * s * h) / 3}$。`,
          ),
        ],
        t(
          `Three such pyramids fill a prism of volume $${s * s * h}$, and $3 \\times ${(s * s * h) / 3} = ${s * s * h}$.`,
          `三个这样的棱锥正好填满体积 $${s * s * h}$ 的棱柱，而 $3 \\times ${(s * s * h) / 3} = ${s * s * h}$。`,
        ),
        [
          t(`This is the prism's volume, without the $\\frac{1}{3}$.`, `这是棱柱的体积，没有乘 $\\frac{1}{3}$。`),
          t(`This uses the sphere's $\\frac{4}{3}$.`, `这里用了球的 $\\frac{4}{3}$。`),
          t(`This takes two thirds instead of one third.`, `这里取了三分之二，而不是三分之一。`),
        ],
      ),
    );
  },
  "Finding the Surface Area of a Solid": (rng, hard) => {
    const [a, b, c] = [rng.int(2, 12), rng.int(2, 12), rng.int(2, 12)];
    const edge = rng.int(2, 30);
    if (!hard)
      return ask(
        rng,
        `How many square inches of wrapping paper exactly cover a closed box $${a}$ by $${b}$ by $${c}$ inches?`,
        `恰好包住一个 $${a}$ 乘 $${b}$ 乘 $${c}$ 英寸的封闭盒子，需要多少平方英寸包装纸？`,
        2 * (a * b + b * c + a * c),
        [a * b + b * c + a * c, a * b * c, 4 * (a + b + c)],
        worked(
          [
            step(
              "Find three different faces",
              "求三种不同的面",
              `The faces are $${a} \\times ${b} = ${a * b}$, $${b} \\times ${c} = ${b * c}$ and $${a} \\times ${c} = ${a * c}$.`,
              `三种面为 $${a} \\times ${b} = ${a * b}$、$${b} \\times ${c} = ${b * c}$、$${a} \\times ${c} = ${a * c}$。`,
            ),
            step(
              "Count each twice",
              "每种算两次",
              `A box has two of each: $2(${a * b} + ${b * c} + ${a * c}) = ${2 * (a * b + b * c + a * c)}$.`,
              `盒子每种面各有两个：$2(${a * b} + ${b * c} + ${a * c}) = ${2 * (a * b + b * c + a * c)}$。`,
            ),
          ],
          t(
            `Top and bottom $${2 * a * b}$, front and back $${2 * a * c}$, two sides $${2 * b * c}$: in all $${2 * (a * b + b * c + a * c)}$.`,
            `上下 $${2 * a * b}$，前后 $${2 * a * c}$，两侧 $${2 * b * c}$：共 $${2 * (a * b + b * c + a * c)}$。`,
          ),
          [
            t(`This counts only three of the six faces.`, `这里只算了六个面中的三个。`),
            t(`This is the volume, in cubic inches.`, `这是体积，单位是立方英寸。`),
            t(`This is the total length of the edges.`, `这是所有棱的总长。`),
          ],
        ),
      );
    return ask(
      rng,
      `A cube has a volume of $${edge ** 3}$ cubic units. What is its surface area, in square units?`,
      `一个立方体体积为 $${edge ** 3}$ 立方单位。它的表面积是多少平方单位？`,
      6 * edge * edge,
      [4 * edge * edge, edge * edge, 6 * edge],
      worked(
        [
          step(
            "Find the edge",
            "求棱长",
            `The edge is the cube root of the volume: $\\sqrt[3]{${edge ** 3}} = ${edge}$.`,
            `棱长是体积的立方根：$\\sqrt[3]{${edge ** 3}} = ${edge}$。`,
          ),
          step(
            "Add six faces",
            "六个面相加",
            `Each face is $${edge}^2 = ${edge * edge}$, and $6(${edge * edge}) = ${6 * edge * edge}$.`,
            `每个面为 $${edge}^2 = ${edge * edge}$，而 $6(${edge * edge}) = ${6 * edge * edge}$。`,
          ),
        ],
        t(
          `$${edge} \\times ${edge} \\times ${edge} = ${edge ** 3}$, the given volume.`,
          `$${edge} \\times ${edge} \\times ${edge} = ${edge ** 3}$，正是所给体积。`,
        ),
        [
          t(`This counts only four faces.`, `这里只算了四个面。`),
          t(`This is one face.`, `这是一个面。`),
          t(`This multiplies the edge by $6$ without squaring it.`, `这里把棱长乘以 $6$，没有平方。`),
        ],
      ),
    );
  },
  "Applying Volume Scale Factors": (rng, hard) => {
    const [v, k, s] = [rng.int(2, 40), rng.int(2, 5), rng.int(3, 40)];
    if (!hard)
      return ask(
        rng,
        `A model of a statue holds $${v}$ ounces of metal. A similar model is $${k}$ times as tall. How many ounces of the same metal does the larger model hold?`,
        `一个雕像模型含 $${v}$ 盎司金属。一个相似的模型高度是它的 $${k}$ 倍。较大的模型含多少盎司同种金属？`,
        k ** 3 * v,
        [k * v, k * k * v, v + k ** 3],
        worked(
          [
            step(
              "Cube the factor",
              "把比例因子立方",
              `Volume uses three lengths, each multiplied by $${k}$, so it is multiplied by $${k}^3 = ${k ** 3}$.`,
              `体积涉及三个长度，每个都乘以 $${k}$，所以体积乘以 $${k}^3 = ${k ** 3}$。`,
            ),
            step("Multiply", "相乘", `$${k ** 3}(${v}) = ${k ** 3 * v}$ ounces.`, `$${k ** 3}(${v}) = ${k ** 3 * v}$ 盎司。`),
          ],
          t(
            `A $1$ by $1$ by $1$ cube becomes $${k}$ by $${k}$ by $${k}$, which holds $${k ** 3}$ small cubes.`,
            `$1 \\times 1 \\times 1$ 的小立方体变为 $${k} \\times ${k} \\times ${k}$，包含 $${k ** 3}$ 个小立方体。`,
          ),
          [
            t(`This scales the volume like a length.`, `这里把体积当作长度来缩放。`),
            t(`This squares the factor, which is for area.`, `这里把比例因子平方了，那是面积的比例。`),
            t(`This adds $${k}^3$ instead of multiplying by it.`, `这里加上了 $${k}^3$，而不是乘以它。`),
          ],
        ),
      );
    return ask(
      rng,
      `Two similar cylinders have volumes $${v}$ and $${k ** 3 * v}$. The smaller has surface area $${s}$. What is the surface area of the larger?`,
      `两个相似圆柱体积为 $${v}$ 和 $${k ** 3 * v}$。较小者表面积为 $${s}$。较大者的表面积是多少？`,
      k * k * s,
      [k * s, k ** 3 * s, s + k * k],
      worked(
        [
          step(
            "Find the length factor",
            "求长度比例",
            `The volume ratio is $${k ** 3 * v} \\div ${v} = ${k ** 3}$, and $\\sqrt[3]{${k ** 3}} = ${k}$.`,
            `体积比为 $${k ** 3 * v} \\div ${v} = ${k ** 3}$，而 $\\sqrt[3]{${k ** 3}} = ${k}$。`,
          ),
          step(
            "Square it for area",
            "面积用平方",
            `Surface area scales by $${k}^2 = ${k * k}$: $${k * k}(${s}) = ${k * k * s}$.`,
            `表面积按 $${k}^2 = ${k * k}$ 缩放：$${k * k}(${s}) = ${k * k * s}$。`,
          ),
        ],
        t(
          `Length factor $${k}$: area grows $${k * k}$ times and volume $${k ** 3}$ times, matching the given volumes.`,
          `长度比例 $${k}$：面积扩大 $${k * k}$ 倍，体积扩大 $${k ** 3}$ 倍，与所给体积一致。`,
        ),
        [
          t(`This scales the area like a length.`, `这里把面积当作长度来缩放。`),
          t(`This scales the area by the volume ratio.`, `这里按体积比缩放了面积。`),
          t(`This adds $${k}^2$ instead of multiplying by it.`, `这里加上了 $${k}^2$，而不是乘以它。`),
        ],
      ),
    );
  },
};
