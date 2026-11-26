import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { paren, poly, Q } from "@ga/subject-math";
import { multivariableDrawings1 } from "../explanation-drawings-multivariable-1.ts";
import { multivariableDrawings2 } from "../explanation-drawings-multivariable-2.ts";
import { multivariableDrawings3 } from "../explanation-drawings-multivariable-3.ts";

import {
  type EquationProblem,
  equationProblem,
  explainedChoice,
  expressionProblem,
  lowestTerms,
  numberProblem,
  type PointProblem,
  pointLatex,
  pointProblem,
  say,
  vectorLatex,
  verdictChoice,
  why,
  withMistakes,
} from "../problems.ts";
import { walked } from "./calculus-i-differentiation.ts";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type Vec2 = readonly [number, number];
type Vec3 = readonly [number, number, number];

/** asQ turns a number into a rational number so that values can be compared. */
const asQ = (c: number | Q): Q => (typeof c === "number" ? Q.of(c) : c);

/** distinct drops the mistakes whose value is the answer or repeats an earlier one. */
function distinct<M extends { readonly value: number | Q }>(answer: number | Q, mistakes: readonly M[]): M[] {
  return mistakes.filter((m, i, all) => !asQ(m.value).eq(asQ(answer)) && all.findIndex((x) => asQ(x.value).eq(asQ(m.value))) === i);
}

/** spoken drops the mistaken responses that equal the answer or repeat an earlier one. */
function spoken(answer: string, mistakes: readonly { readonly response: string; readonly why: Text }[]) {
  return mistakes.filter((m, i, all) => m.response !== answer && all.findIndex((x) => x.response === m.response) === i);
}

/** listed attaches to a problem the mistaken responses it still lists as wrong, each once. */
function listed(problem: Problem, mistakes: readonly { readonly response: string; readonly why: Text }[]): Problem {
  const wrong = new Set(problem.wrong ?? []);
  return withMistakes(
    problem,
    mistakes.filter((m, i, all) => wrong.has(m.response) && all.findIndex((x) => x.response === m.response) === i),
  );
}

/** pointWith builds a point problem whose wrong points each carry an explanation. */
function pointWith(p: Omit<PointProblem, "wrong">, mistakes: readonly (readonly [readonly (number | Q)[], string, string])[]): Problem {
  const write = p.vector ? vectorLatex : pointLatex;
  return listed(
    pointProblem({ ...p, wrong: mistakes.map(([v]) => v) }),
    mistakes.map(([v, en, zh]) => ({ response: write(v), why: t(en, zh) })),
  );
}

/** equationWith builds an equation problem whose wrong equations each carry an explanation. */
function equationWith(p: Omit<EquationProblem, "wrong">, mistakes: readonly { readonly response: string; readonly why: Text }[]): Problem {
  return listed(equationProblem({ ...p, wrong: mistakes.map((m) => m.response) }), mistakes);
}

const v2L = (v: readonly (number | Q)[]): string => `(${v.map((c) => (c instanceof Q ? c.toLatex() : String(c))).join(", ")})`;
const v3L = (v: readonly (number | Q)[]): string => vectorLatex(v);

/** pythagoreanTriples provides nice integer triangles. */
const pythagoreanTriples: readonly (readonly [number, number, number])[] = [
  [3, 4, 5],
  [4, 3, 5],
  [6, 8, 10],
  [8, 6, 10],
  [5, 12, 13],
  [12, 5, 13],
  [8, 15, 17],
  [15, 8, 17],
];

// ---------------------------------------------------------------------------
// 2.5 Introduction to Multivariable Functions
// ---------------------------------------------------------------------------

/** interiorAndBoundaryPoints classifies points as interior, boundary, or exterior. */
export const interiorAndBoundaryPoints: TopicDef = {
  id: "interior-and-boundary-points",
  title: t("Interior and Boundary Points", "内点与边界点"),
  summary: t(
    "A point is an interior point of a set S if an open disk centered at the point lies entirely in S; it is a boundary point if every open disk contains points in S and outside S.",
    "若以某点为圆心的某个开圆盘完全包含在集合 S 内，则该点为 S 的内点；若以该点为圆心的每个开圆盘都既包含 S 内的点又包含 S 外的点，则该点为 S 的边界点。",
  ),
  intro: t(
    "Take the half-plane $S = \\{(x, y) : x > 1\\}$. The point $(3, 5)$ is $2$ units to the right of the line $x = 1$, so the open disk of radius $2$ around it lies in $S$: it is an interior point. The point $(1, 4)$ lies on the line, and every disk around it contains points with $x > 1$ and points with $x < 1$: it is a boundary point, although it does not belong to $S$.\n\nCheck: the point $(-2, 0)$ is $3$ units to the left of the line, so the disk of radius $3$ around it misses $S$ completely, which makes it an exterior point. Each point of the plane is exactly one of the three kinds.\n\nIn this lesson we classify a point as an interior, boundary or exterior point of a set by comparing it with the inequality that defines the set.",
    "取半平面 $S = \\{(x, y) : x > 1\\}$。点 $(3, 5)$ 在直线 $x = 1$ 右方 $2$ 个单位处，所以以它为圆心、半径为 $2$ 的开圆盘落在 $S$ 内：它是内点。点 $(1, 4)$ 在这条直线上，它周围的每个圆盘都既含 $x > 1$ 的点，又含 $x < 1$ 的点：它是边界点，尽管它不属于 $S$。\n\n检验：点 $(-2, 0)$ 在直线左方 $3$ 个单位处，所以以它为圆心、半径为 $3$ 的圆盘与 $S$ 完全不相交，它是外点。平面上每个点恰好属于三类中的一类。\n\n本课我们把点与定义集合的不等式比较，判断它是集合的内点、边界点还是外点。",
  ),
  prerequisites: ["describing-sets-using-set-builder-notation"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "classifying-points-relative-to-regions",
      title: t("Classifying points relative to regions", "判断点相对于区域的位置"),
      explanation: t(
        "For a set $S \\subset \\mathbb{R}^2$:\n\n- **Interior point**: There exists an $\\varepsilon > 0$ such that the open disk $B_\\varepsilon(\\mathbf{x}) \\subset S$.\n- **Boundary point**: For every $\\varepsilon > 0$, the disk $B_\\varepsilon(\\mathbf{x})$ contains both points in $S$ and points not in $S$.\n- **Exterior point**: An interior point of the complement $\\mathbb{R}^2 \\setminus S$.\n\nFor the disk $S = \\{(x, y) : (x - 1)^2 + y^2 < 4\\}$, the point $(2, 1)$ gives $(2 - 1)^2 + 1^2 = 2 < 4$, so it is closer to the center $(1, 0)$ than the radius $2$ and is an interior point. The point $(3, 0)$ gives exactly $4$: it is on the circle, a boundary point.\n\n> **Watch out.** A boundary point need not belong to the set: the circle bounds $S$ even though the strict inequality leaves it out. Compare the squared distance with the squared radius, not with the radius.",
        "对于集合 $S \\subset \\mathbb{R}^2$：\n\n- **内点**：存在 $\\varepsilon > 0$ 使得开圆盘 $B_\\varepsilon(\\mathbf{x}) \\subset S$。\n- **边界点**：对任意 $\\varepsilon > 0$，开圆盘 $B_\\varepsilon(\\mathbf{x})$ 既包含 $S$ 中的点，也包含不属于 $S$ 的点。\n- **外点**：补集 $\\mathbb{R}^2 \\setminus S$ 的内点。\n\n对圆盘 $S = \\{(x, y) : (x - 1)^2 + y^2 < 4\\}$，点 $(2, 1)$ 给出 $(2 - 1)^2 + 1^2 = 2 < 4$，所以它到圆心 $(1, 0)$ 的距离小于半径 $2$，是内点。点 $(3, 0)$ 恰好给出 $4$：它在圆上，是边界点。\n\n> **注意。** 边界点不一定属于集合：严格不等式把圆排除在 $S$ 之外，但圆仍是 $S$ 的边界。要把距离的平方与半径的平方比较，而不是与半径比较。",
      ),
      generate(rng: Rng): Problem {
        const [a, b, c] = rng.pick(pythagoreanTriples);
        const kind = rng.int(0, 2);
        const rSq = c * c;
        const pt: Vec2 =
          kind === 0 ? [rng.int(-a + 1, a - 1), rng.int(-b + 1, b - 1)] : kind === 1 ? [a, b] : [a + rng.int(1, 3), b + rng.int(1, 3)];
        const d2 = pt[0] * pt[0] + pt[1] * pt[1];
        const at = `(${pt[0]}, ${pt[1]})`;
        const rel = kind === 0 ? "<" : kind === 1 ? "=" : ">";
        const names = [t("Interior point", "内点"), t("Boundary point", "边界点"), t("Exterior point", "外点")] as const;
        const reasons: readonly (readonly [string, string])[][] = [
          [
            ["", ""],
            [`$${d2} \\ne ${rSq}$, so the point is not on the circle`, `$${d2} \\ne ${rSq}$，所以该点不在圆上`],
            [`$${d2} < ${rSq}$, so the point is inside the circle, in $S$`, `$${d2} < ${rSq}$，所以该点在圆内，属于 $S$`],
          ],
          [
            ["The point is on the circle, so every disk around it reaches outside $S$", "该点在圆上，所以它周围的每个圆盘都伸到 $S$ 之外"],
            ["", ""],
            [
              "The point is on the circle, so every disk around it contains points of $S$",
              "该点在圆上，所以它周围的每个圆盘都含有 $S$ 的点",
            ],
          ],
          [
            [`$${d2} > ${rSq}$, so the point is outside the circle`, `$${d2} > ${rSq}$，所以该点在圆外`],
            [
              `$${d2} \\ne ${rSq}$, so the point is not on the circle: a small disk around it misses $S$`,
              `$${d2} \\ne ${rSq}$，所以该点不在圆上：它周围的小圆盘与 $S$ 不相交`,
            ],
            ["", ""],
          ],
        ];
        const verdict = [
          t("so a small disk around the point stays inside the circle: an interior point", "所以该点周围的小圆盘仍在圆内：内点"),
          t(
            "so the point is on the circle, and every disk around it meets both $S$ and its outside: a boundary point",
            "所以该点在圆上，它周围的每个圆盘都既与 $S$ 相交又与 $S$ 外部相交：边界点",
          ),
          t("so a small disk around the point stays outside the circle: an exterior point", "所以该点周围的小圆盘仍在圆外：外点"),
        ][kind] as Text;
        const radius =
          kind === 1 ? `equals the radius $${c}$` : kind === 0 ? `is less than the radius $${c}$` : `is more than the radius $${c}$`;
        const radiusZh = kind === 1 ? `等于半径 $${c}$` : kind === 0 ? `小于半径 $${c}$` : `大于半径 $${c}$`;
        return explainedChoice(rng, {
          prompt: t(
            `Consider the region $S = \\left\\{(x, y) \\in \\mathbb{R}^2 : x^2 + y^2 < ${rSq}\\right\\}$. Classify the point $${at}$.`,
            `考虑区域 $S = \\left\\{(x, y) \\in \\mathbb{R}^2 : x^2 + y^2 < ${rSq}\\right\\}$。判断点 $${at}$ 的类别。`,
          ),
          correct: names[kind] as Text,
          wrong: [0, 1, 2]
            .filter((i) => i !== kind)
            .map((i) => {
              const [en, zh] = reasons[kind]?.[i] ?? ["", ""];
              return { option: names[i] as Text, why: t(`${en}.`, `${zh}。`) };
            }),
          solution: walked(
            [
              [
                ["Compute the squared distance", "计算距离的平方"],
                t(`$(${pt[0]})^2 + (${pt[1]})^2 = ${d2}$.`, `$(${pt[0]})^2 + (${pt[1]})^2 = ${d2}$。`),
              ],
              [
                ["Compare with the squared radius", "与半径的平方比较"],
                t(`$${d2} ${rel} ${rSq}$, ${verdict.en}.`, `$${d2} ${rel} ${rSq}$，${verdict["zh-CN"]}。`),
              ],
            ],
            t(`The distance from the origin is $\\sqrt{${d2}}$, which ${radius}.`, `该点到原点的距离为 $\\sqrt{${d2}}$，${radiusZh}。`),
          ),
        });
      },
    },
    {
      id: "classifying-points-relative-to-a-region-above-a-parabola",
      figure: multivariableDrawings1["interior-and-boundary-points#classifying-points-relative-to-a-region-above-a-parabola"],
      title: t("Classifying points relative to a region above a parabola", "判断点相对于抛物线上方区域的位置"),
      explanation: t(
        "For $S = \\{(x, y) : y > x^2 + c\\}$, compare $y$ with $x^2 + c$ at the point. If $y > x^2 + c$, a small disk around the point still satisfies the strict inequality, so it is an interior point. If $y = x^2 + c$ the point lies on the parabola: every disk around it reaches both above and below, so it is a boundary point, even though it does not belong to $S$. If $y < x^2 + c$ the point is exterior.\n\nFor $S = \\{(x, y) : y > 2x^2 + 1\\}$, the point $(1, 3)$ gives $2 \\cdot 1 + 1 = 3 = y$, so it lies on the parabola and is a boundary point, while $(1, 5)$ lies above it and is an interior point.\n\n> **Watch out.** Square $x$ before adding $c$: at $x = -2$ the parabola is at height $4 + c$, not $-4 + c$. A point on the parabola is a boundary point, not an exterior one, even though the strict inequality leaves it out of $S$.",
        "对 $S = \\{(x, y) : y > x^2 + c\\}$，在该点比较 $y$ 与 $x^2 + c$。若 $y > x^2 + c$，该点周围的小圆盘仍满足严格不等式，所以它是内点。若 $y = x^2 + c$，该点在抛物线上：它周围的每个圆盘都同时伸到上方和下方，所以它是边界点，尽管它不属于 $S$。若 $y < x^2 + c$，该点是外点。\n\n对 $S = \\{(x, y) : y > 2x^2 + 1\\}$，点 $(1, 3)$ 给出 $2 \\cdot 1 + 1 = 3 = y$，所以它在抛物线上，是边界点；而 $(1, 5)$ 在抛物线上方，是内点。\n\n> **注意。** 先把 $x$ 平方再加 $c$：$x = -2$ 时抛物线的高度是 $4 + c$，不是 $-4 + c$。抛物线上的点是边界点而不是外点，尽管严格不等式把它排除在 $S$ 之外。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(-4, 4);
        const x = rng.int(-3, 3);
        const kind = rng.int(0, 2);
        const gap = kind === 0 ? rng.int(1, 4) : kind === 1 ? 0 : -rng.int(1, 4);
        const v = x * x + c;
        const y = v + gap;
        const curve = poly([1, "x^2"], [c, ""]);
        const sum = c === 0 ? `${x * x}` : `${x * x} ${c < 0 ? "-" : "+"} ${Math.abs(c)} = ${v}`;
        const names = [t("Interior point", "内点"), t("Boundary point", "边界点"), t("Exterior point", "外点")] as const;
        const rel = kind === 0 ? ">" : kind === 1 ? "=" : "<";
        const reasons: readonly (readonly [string, string])[][] = [
          [
            ["", ""],
            [`$y = ${y}$ is not equal to $${v}$, so the point is not on the parabola`, `$y = ${y}$ 不等于 $${v}$，所以该点不在抛物线上`],
            [`$${y} > ${v}$, so the point is above the parabola, in $S$`, `$${y} > ${v}$，所以该点在抛物线上方，属于 $S$`],
          ],
          [
            ["The point is on the parabola, and the points just below it are outside $S$", "该点在抛物线上，它正下方附近的点在 $S$ 之外"],
            ["", ""],
            ["The point is on the parabola, and the points just above it are in $S$", "该点在抛物线上，它正上方附近的点属于 $S$"],
          ],
          [
            [`$${y} < ${v}$, so the point is below the parabola, outside $S$`, `$${y} < ${v}$，所以该点在抛物线下方，在 $S$ 之外`],
            [
              `$y = ${y}$ is not equal to $${v}$, so the point is not on the parabola: a small disk around it stays below`,
              `$y = ${y}$ 不等于 $${v}$，所以该点不在抛物线上：它周围的小圆盘都在抛物线下方`,
            ],
            ["", ""],
          ],
        ];
        const verdict = [
          t("The point is above the parabola, so it is an interior point.", "该点在抛物线上方，所以是内点。"),
          t("The point is on the parabola, so it is a boundary point.", "该点在抛物线上，所以是边界点。"),
          t("The point is below the parabola, so it is an exterior point.", "该点在抛物线下方，所以是外点。"),
        ][kind] as Text;
        const check =
          kind === 1
            ? t(
                `$(${x}, ${y + 1})$, just above, satisfies $${y + 1} > ${v}$ and $(${x}, ${y - 1})$, just below, does not, and the same happens however close to the point we look.`,
                `正上方的 $(${x}, ${y + 1})$ 满足 $${y + 1} > ${v}$，正下方的 $(${x}, ${y - 1})$ 不满足；无论离该点多近，情况都一样。`,
              )
            : t(
                `The vertical gap $y - (${curve}) = ${gap}$ is ${kind === 0 ? "positive" : "negative"}, so the point is ${Math.abs(gap)} ${Math.abs(gap) === 1 ? "unit" : "units"} ${kind === 0 ? "above" : "below"} the parabola.`,
                `竖直方向的差 $y - (${curve}) = ${gap}$ 为${kind === 0 ? "正" : "负"}，所以该点在抛物线${kind === 0 ? "上方" : "下方"} ${Math.abs(gap)} 个单位处。`,
              );
        return explainedChoice(rng, {
          prompt: t(
            `Classify the point $(${x}, ${y})$ relative to $S = \\{(x, y) : y > ${curve}\\}$.`,
            `判断点 $(${x}, ${y})$ 相对于 $S = \\{(x, y) : y > ${curve}\\}$ 的位置。`,
          ),
          correct: names[kind] as Text,
          wrong: [0, 1, 2]
            .filter((i) => i !== kind)
            .map((i) => {
              const [en, zh] = reasons[kind]?.[i] ?? ["", ""];
              return { option: names[i] as Text, why: t(`${en}.`, `${zh}。`) };
            }),
          solution: walked(
            [
              [
                ["Find the height of the parabola", "求抛物线的高度"],
                t(`At $x = ${x}$, $${curve} = ${sum}$.`, `在 $x = ${x}$ 处，$${curve} = ${sum}$。`),
              ],
              [["Compare with y", "与 y 比较"], t(`$y = ${y} ${rel} ${v}$. ${verdict.en}`, `$y = ${y} ${rel} ${v}$。${verdict["zh-CN"]}`)],
            ],
            check,
          ),
        });
      },
    },
  ],
};

/** interiorsAndBoundariesOfSets determines the interior and boundary of sets. */
export const interiorsAndBoundariesOfSets: TopicDef = {
  id: "interiors-and-boundaries-of-sets",
  title: t("Interiors and Boundaries of Sets", "集合的内部与边界"),
  summary: t(
    "The interior of S is the set of all interior points; the boundary ∂S is the set of all boundary points.",
    "集合 S 的内部是其所有内点的集合；边界 ∂S 是其所有边界点的集合。",
  ),
  intro: t(
    "Take the square $S = \\{(x, y) : 0 \\le x < 2,\\ 0 \\le y < 2\\}$, which includes its left and bottom edges but not the other two. Its interior is the open square $0 < x < 2$, $0 < y < 2$, and its boundary $\\partial S$ is the whole outline of the square, all four edges, of length $8$.\n\nCheck: $(1, 0)$ belongs to $S$ and lies on the boundary; $(2, 1)$ does not belong to $S$ and lies on the boundary all the same; $(1, 1)$ has the disk of radius $1$ around it inside $S$, so it is in the interior.\n\nIn this lesson we find the interior and the boundary of a set from the inequalities that define it.",
    "取正方形 $S = \\{(x, y) : 0 \\le x < 2,\\ 0 \\le y < 2\\}$，它包含左边和下边，不包含另外两条边。它的内部是开正方形 $0 < x < 2$、$0 < y < 2$，边界 $\\partial S$ 是正方形的整个轮廓，即全部四条边，长度为 $8$。\n\n检验：$(1, 0)$ 属于 $S$ 且在边界上；$(2, 1)$ 不属于 $S$，但同样在边界上；$(1, 1)$ 周围半径为 $1$ 的圆盘在 $S$ 内，所以它在内部。\n\n本课我们由定义集合的不等式求集合的内部和边界。",
  ),
  prerequisites: ["interior-and-boundary-points"],
  encompasses: [{ topic: "interior-and-boundary-points", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "finding-the-boundary-curve-of-a-set",
      title: t("Finding the boundary curve of a set", "求集合的边界曲线"),
      explanation: t(
        "For a region defined by an inequality such as $g(x, y) \\le c$ or $g(x, y) < c$, the boundary $\\partial S$ is given by replacing the inequality with an equality: $g(x, y) = c$.\n\nFor $S = \\{(x, y) : y \\ge x^2 - 4\\}$ the boundary is the parabola $y = x^2 - 4$, and the same parabola bounds $\\{(x, y) : y > x^2 - 4\\}$.\n\n> **Watch out.** Clearing denominators multiplies every term: $\\frac{x^2}{p} = 1$ times $pq$ gives $qx^2 = pq$, so each square ends up with the other denominator. The boundary does not depend on whether the inequality is strict.",
        "对于由不等式如 $g(x, y) \\le c$ 或 $g(x, y) < c$ 定义的区域，其边界 $\\partial S$ 由将不等号替换为等号得到：$g(x, y) = c$。\n\n对 $S = \\{(x, y) : y \\ge x^2 - 4\\}$，边界是抛物线 $y = x^2 - 4$；同一条抛物线也是 $\\{(x, y) : y > x^2 - 4\\}$ 的边界。\n\n> **注意。** 去分母时每一项都要乘：$\\frac{x^2}{p} = 1$ 乘以 $pq$ 得 $qx^2 = pq$，所以每个平方项最后带的是另一个分母。边界与不等式是否严格无关。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 8);
        const b = rng.int(2, 8);
        const k = a * a * b * b;
        const answer = `${poly([b * b, "x^2"], [a * a, "y^2"])} = ${k}`;
        const mistakes = spoken(answer, [
          say(
            `${poly([a * a, "x^2"], [b * b, "y^2"])} = ${k}`,
            `Multiplying $\\frac{x^2}{${a * a}}$ by $${k}$ gives $${b * b}x^2$: each square takes the other denominator.`,
            `$\\frac{x^2}{${a * a}}$ 乘以 $${k}$ 得 $${b * b}x^2$：每个平方项带的是另一个分母。`,
          ),
          say(
            `x^2 + y^2 = ${k}`,
            `Multiplying by $${k}$ also multiplies the fractions on the left, so the squares keep coefficients $${b * b}$ and $${a * a}$.`,
            `乘以 $${k}$ 时左边的分数也要乘，所以平方项的系数是 $${b * b}$ 和 $${a * a}$。`,
          ),
          say(
            `${poly([b * b, "x^2"], [-a * a, "y^2"])} = ${k}`,
            "Both fractions are added in the ellipse, so both terms stay positive.",
            "椭圆中两个分数相加，所以两项都保持为正。",
          ),
        ]);
        return withMistakes(
          equationProblem({
            prompt: t(
              `Find the equation of the boundary curve $\\partial S$ for the elliptical region $S = \\left\\{(x, y) \\in \\mathbb{R}^2 : \\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} \\le 1\\right\\}$. Clear denominators so that the equation has the form $A x^2 + B y^2 = C$.`,
              `求椭圆区域 $S = \\left\\{(x, y) \\in \\mathbb{R}^2 : \\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} \\le 1\\right\\}$ 的边界曲线 $\\partial S$ 的方程。去分母使方程形式为 $A x^2 + B y^2 = C$。`,
            ),
            answer,
            wrong: mistakes.map((m) => m.response),
            solution: walked(
              [
                [
                  ["Replace the inequality by an equation", "把不等式换成等式"],
                  t(`$\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} = 1$.`, `$\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} = 1$。`),
                ],
                [
                  ["Clear the denominators", "去分母"],
                  t(
                    `Multiply every term by $${a * a} \\cdot ${b * b} = ${k}$: $${answer}$.`,
                    `每一项乘以 $${a * a} \\cdot ${b * b} = ${k}$：$${answer}$。`,
                  ),
                ],
              ],
              t(
                `The point $(${a}, 0)$ is on the ellipse, and $${b * b} \\cdot ${a * a} = ${k}$; so is $(0, ${b})$, and $${a * a} \\cdot ${b * b} = ${k}$.`,
                `点 $(${a}, 0)$ 在椭圆上，且 $${b * b} \\cdot ${a * a} = ${k}$；点 $(0, ${b})$ 也在椭圆上，且 $${a * a} \\cdot ${b * b} = ${k}$。`,
              ),
            ),
          }),
          mistakes,
        );
      },
    },
    {
      id: "the-length-of-the-boundary-of-a-rectangle",
      figure: multivariableDrawings1["interiors-and-boundaries-of-sets#the-length-of-the-boundary-of-a-rectangle"],
      title: t("The length of the boundary of a rectangle", "矩形边界的长度"),
      explanation: t(
        "The boundary of a set does not depend on which edges are included: $\\{|x| \\le a, |y| < b\\}$ and $\\{|x| < a, |y| < b\\}$ both have the whole rectangle outline as boundary. Removing a single point from the inside adds that point to the boundary, since every disk around it meets both $S$ and the missing point, but a point has no length. So the boundary length is the perimeter $4a + 4b$ in each case.\n\nFor $\\{(x, y) : 0 \\le x < 3,\\ 0 < y \\le 1\\}$ the boundary is the outline of a $3$ by $1$ rectangle, of length $2 \\cdot 3 + 2 \\cdot 1 = 8$.\n\n> **Watch out.** $|x| \\le a$ is the interval from $-a$ to $a$, of length $2a$, not $a$. Edges left out of the set still belong to its boundary, so count all four.",
        "集合的边界与包含哪些边无关：$\\{|x| \\le a, |y| < b\\}$ 与 $\\{|x| < a, |y| < b\\}$ 的边界都是整个矩形轮廓。从内部去掉一个点会使该点成为边界点，因为它周围的每个圆盘都同时与 $S$ 和这个缺失的点相交，但一个点没有长度。所以每种情形下边界长度都是周长 $4a + 4b$。\n\n对 $\\{(x, y) : 0 \\le x < 3,\\ 0 < y \\le 1\\}$，边界是 $3 \\times 1$ 矩形的轮廓，长度为 $2 \\cdot 3 + 2 \\cdot 1 = 8$。\n\n> **注意。** $|x| \\le a$ 是从 $-a$ 到 $a$ 的区间，长度为 $2a$，不是 $a$。不属于集合的边仍属于它的边界，所以四条边都要算。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 9);
        const b = rng.int(1, 9);
        const rx = rng.pick(["\\le", "<"]);
        const ry = rng.pick(["\\le", "<"]);
        const hole = rng.int(0, 1) === 1;
        const set = `\\{(x, y) : |x| ${rx} ${a},\\ |y| ${ry} ${b}\\}${hole ? " \\setminus \\{(0, 0)\\}" : ""}`;
        const answer = 4 * a + 4 * b;
        const included = (rx === "\\le" ? 4 * b : 0) + (ry === "\\le" ? 4 * a : 0);
        return numberProblem({
          prompt: t(`Find the total length of the boundary of $S = ${set}$.`, `求 $S = ${set}$ 的边界的总长度。`),
          answer,
          mistakes: distinct(answer, [
            why(
              2 * a + 2 * b,
              `$|x| ${rx} ${a}$ runs from $-${a}$ to $${a}$, so the sides are $${2 * a}$ and $${2 * b}$ long, not $${a}$ and $${b}$.`,
              `$|x| ${rx} ${a}$ 从 $-${a}$ 到 $${a}$，所以边长是 $${2 * a}$ 和 $${2 * b}$，不是 $${a}$ 和 $${b}$。`,
            ),
            why(
              4 * a * b,
              `That is the area of the rectangle; the boundary is its outline, measured by length.`,
              `这是矩形的面积；边界是它的轮廓，要量长度。`,
            ),
            ...(included > 0
              ? [
                  why(
                    included,
                    "The edges left out of the set are boundary points too: every disk around them meets the set.",
                    "不属于集合的边也是边界点：它们周围的每个圆盘都与集合相交。",
                  ),
                ]
              : []),
          ]),
          solution: walked(
            [
              [
                ["Find the outline", "找出轮廓"],
                t(
                  `The boundary is the outline of the rectangle $[-${a}, ${a}] \\times [-${b}, ${b}]$, whether or not each edge belongs to $S$${hole ? ", together with the point $(0, 0)$, which adds no length" : ""}.`,
                  `无论每条边是否属于 $S$，边界都是矩形 $[-${a}, ${a}] \\times [-${b}, ${b}]$ 的轮廓${hole ? "，再加上点 $(0, 0)$，后者不增加长度" : ""}。`,
                ),
              ],
              [
                ["Add the sides", "把各边相加"],
                t(
                  `The sides are $${2 * a}$, $${2 * b}$, $${2 * a}$ and $${2 * b}$, so the length is $${answer}$.`,
                  `各边长为 $${2 * a}$、$${2 * b}$、$${2 * a}$ 和 $${2 * b}$，所以长度为 $${answer}$。`,
                ),
              ],
            ],
            t(`$4 \\cdot ${a} + 4 \\cdot ${b} = ${answer}$.`, `$4 \\cdot ${a} + 4 \\cdot ${b} = ${answer}$。`),
          ),
        });
      },
    },
  ],
};

/** openAndClosedSets classifies planar sets as open, closed, or neither. */
export const openAndClosedSets: TopicDef = {
  id: "open-and-closed-sets",
  title: t("Open and Closed Sets", "开集与闭集"),
  summary: t(
    "A set is open if it contains none of its boundary points, closed if it contains all of its boundary points, and neither if it contains only some.",
    "若一个集合不包含其任何边界点，则为开集；若包含其全部边界点，则为闭集；若仅包含部分边界点，则既非开集亦非闭集。",
  ),
  intro: t(
    "Take the strip $S = \\{(x, y) : 1 < x \\le 3\\}$. Its boundary is the two lines $x = 1$ and $x = 3$. The line $x = 3$ belongs to $S$ and the line $x = 1$ does not, so $S$ contains some of its boundary points but not all: it is neither open nor closed.\n\nCheck: $(3, 0)$ is a boundary point in $S$, so no disk around it lies in $S$ and $S$ is not open; $(1, 0)$ is a boundary point missing from $S$, so $S$ is not closed.\n\nIn this lesson we decide whether a set is open, closed, both or neither by finding its boundary and seeing how much of it the set contains.",
    "取带状区域 $S = \\{(x, y) : 1 < x \\le 3\\}$。它的边界是两条直线 $x = 1$ 和 $x = 3$。直线 $x = 3$ 属于 $S$，直线 $x = 1$ 不属于 $S$，所以 $S$ 含有部分而非全部边界点：它既不开也不闭。\n\n检验：$(3, 0)$ 是属于 $S$ 的边界点，它周围没有圆盘落在 $S$ 内，所以 $S$ 不是开集；$(1, 0)$ 是 $S$ 缺少的边界点，所以 $S$ 不是闭集。\n\n本课我们先求集合的边界，再看集合含有多少边界点，以此判断集合是开集、闭集、既开又闭还是既不开也不闭。",
  ),
  prerequisites: ["interiors-and-boundaries-of-sets"],
  encompasses: [{ topic: "interiors-and-boundaries-of-sets", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "classifying-open-closed-neither",
      title: t("Classifying sets as open, closed, or neither", "将集合分类为开集、闭集或既非开亦非闭"),
      explanation: t(
        "A set $S \\subset \\mathbb{R}^2$ is:\n\n- **Open**: $S = \\operatorname{int}(S)$, meaning $S$ contains none of its boundary points (strict inequalities like $<$ or $>$).\n- **Closed**: $S$ contains all of its boundary points $\\partial S \\subset S$ (non-strict inequalities like $\\le$ or $\\ge$).\n- **Neither open nor closed**: $S$ contains some but not all of its boundary points.\n\nThe half disk $\\{(x, y) : x^2 + y^2 \\le 4,\\ x > 0\\}$ contains its curved edge but not its straight edge on the $y$-axis, so it is neither.\n\n> **Watch out.** Open and closed are not opposites: a set that is not open need not be closed. Look at every piece of the boundary before deciding.",
        "集合 $S \\subset \\mathbb{R}^2$：\n\n- **开集**：$S = \\operatorname{int}(S)$，即 $S$ 不包含任何边界点（严格不等式如 $<$ 或 $>$）。\n- **闭集**：$S$ 包含其全部边界点 $\\partial S \\subset S$（非严格不等式如 $\\le$ 或 $\\ge$）。\n- **既非开亦非闭**：$S$ 包含部分但非全部边界点。\n\n半圆盘 $\\{(x, y) : x^2 + y^2 \\le 4,\\ x > 0\\}$ 包含它的弧形边，但不包含 $y$ 轴上的直边，所以既不开也不闭。\n\n> **注意。** 开与闭不是对立的：不是开集的集合未必是闭集。要看过边界的每一部分再下结论。",
      ),
      generate(rng: Rng): Problem {
        const r1 = rng.int(1, 5);
        const r2 = rng.int(6, 12);
        const kind = rng.int(0, 2);
        const [inner, outer] = kind === 0 ? ["<", "<"] : kind === 1 ? ["\\le", "\\le"] : ["<", "\\le"];
        const set = `\\{(x, y) : ${r1 * r1} ${inner} x^2 + y^2 ${outer} ${r2 * r2}\\}`;
        const names = [t("Open set", "开集"), t("Closed set", "闭集"), t("Neither open nor closed", "既非开集亦非闭集")] as const;
        const innerIn = kind === 1;
        const outerIn = kind !== 0;
        const reasons: readonly (readonly [string, string])[][] = [
          [
            ["", ""],
            ["Neither boundary circle belongs to the set: both inequalities are strict", "两个边界圆都不属于该集合：两个不等式都是严格的"],
            ["It contains none of its boundary points, which is what open means", "它不含任何边界点，这正是开集的含义"],
          ],
          [
            ["Both boundary circles belong to the set, so it contains boundary points", "两个边界圆都属于该集合，所以它含有边界点"],
            ["", ""],
            ["It contains all of its boundary points, which is what closed means", "它含有全部边界点，这正是闭集的含义"],
          ],
          [
            [`The outer circle $x^2 + y^2 = ${r2 * r2}$ belongs to the set`, `外圆 $x^2 + y^2 = ${r2 * r2}$ 属于该集合`],
            [
              `The inner circle $x^2 + y^2 = ${r1 * r1}$ is a boundary circle missing from the set`,
              `内圆 $x^2 + y^2 = ${r1 * r1}$ 是该集合缺少的边界圆`,
            ],
            ["", ""],
          ],
        ];
        const has = (yes: boolean) => (yes ? t("belongs to the set", "属于该集合") : t("does not belong to the set", "不属于该集合"));
        const conclusion = [
          t("It contains none of its boundary points, so it is open.", "它不含任何边界点，所以是开集。"),
          t("It contains all of its boundary points, so it is closed.", "它含有全部边界点，所以是闭集。"),
          t("It contains some of its boundary points but not all, so it is neither.", "它含有部分而非全部边界点，所以既不开也不闭。"),
        ][kind] as Text;
        return explainedChoice(rng, {
          prompt: t(
            `Classify the set $S = ${set}$ as an open set, closed set, or neither.`,
            `将集合 $S = ${set}$ 分类为开集、闭集或既非开亦非闭。`,
          ),
          correct: names[kind] as Text,
          wrong: [0, 1, 2]
            .filter((i) => i !== kind)
            .map((i) => {
              const [en, zh] = reasons[kind]?.[i] ?? ["", ""];
              return { option: names[i] as Text, why: t(`${en}.`, `${zh}。`) };
            }),
          solution: walked(
            [
              [
                ["Find the boundary", "求边界"],
                t(
                  `The boundary is the two circles $x^2 + y^2 = ${r1 * r1}$ and $x^2 + y^2 = ${r2 * r2}$.`,
                  `边界是两个圆 $x^2 + y^2 = ${r1 * r1}$ 和 $x^2 + y^2 = ${r2 * r2}$。`,
                ),
              ],
              [
                ["See which circles belong to the set", "看哪些圆属于该集合"],
                t(
                  `The inner circle ${has(innerIn).en} and the outer circle ${has(outerIn).en}. ${conclusion.en}`,
                  `内圆${has(innerIn)["zh-CN"]}，外圆${has(outerIn)["zh-CN"]}。${conclusion["zh-CN"]}`,
                ),
              ],
            ],
            t(
              `Test one point of each circle: $(${r1}, 0)$ gives $${r1 * r1} ${inner} ${r1 * r1}$, which is ${innerIn ? "true" : "false"}, and $(${r2}, 0)$ gives $${r2 * r2} ${outer} ${r2 * r2}$, which is ${outerIn ? "true" : "false"}.`,
              `每个圆上各取一点检验：$(${r1}, 0)$ 给出 $${r1 * r1} ${inner} ${r1 * r1}$，${innerIn ? "成立" : "不成立"}；$(${r2}, 0)$ 给出 $${r2 * r2} ${outer} ${r2 * r2}$，${outerIn ? "成立" : "不成立"}。`,
            ),
          ),
        });
      },
    },
    {
      id: "classifying-half-planes-and-other-sets",
      title: t("Classifying half-planes and other sets", "判断半平面等集合的开闭性"),
      explanation: t(
        "A set is open when it contains none of its boundary points and closed when it contains all of them. Strict inequalities between continuous functions give open sets, and non-strict ones give closed sets. Mixing the two usually gives a set that is neither. A single point is closed, and the whole plane $\\mathbb{R}^2$ has no boundary at all, so it is both open and closed.\n\nThe quadrant $\\{(x, y) : x \\ge 0,\\ y > 0\\}$ contains the part of its boundary on the $y$-axis above the origin but none of the part on the $x$-axis, so it is neither.\n\n> **Watch out.** Only the whole plane and the empty set are both open and closed; any other set has a boundary point, which it either contains or misses. A set of one point is closed, not open: no disk around the point fits inside it.",
        "集合不含任何边界点时是开集，含有全部边界点时是闭集。连续函数之间的严格不等式给出开集，非严格不等式给出闭集。两者混合通常得到既不开也不闭的集合。单点集是闭集，而整个平面 $\\mathbb{R}^2$ 根本没有边界点，所以它既开又闭。\n\n象限 $\\{(x, y) : x \\ge 0,\\ y > 0\\}$ 含有它在 $y$ 轴正半轴上的边界，却不含 $x$ 轴上的边界，所以既不开也不闭。\n\n> **注意。** 只有整个平面和空集既开又闭；其他集合都有边界点，要么含有它，要么缺少它。单点集是闭集而不是开集：该点周围没有圆盘能放进集合里。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-5, 5);
        const b = rng.int(-5, 5);
        const parabola = poly([1, "x^2"], [a, ""]);
        type Form = readonly [set: string, kind: number, boundary: Text, check: Text];
        const forms: readonly Form[] = [
          [
            `\\{(x, y) : x + y < ${a}\\}`,
            0,
            t(
              `The boundary is the line $x + y = ${a}$, and none of it belongs to the set.`,
              `边界是直线 $x + y = ${a}$，它的点都不属于该集合。`,
            ),
            t(`$(${a}, 0)$ is on the line, and $${a} + 0 < ${a}$ is false.`, `$(${a}, 0)$ 在这条直线上，而 $${a} + 0 < ${a}$ 不成立。`),
          ],
          [
            `\\{(x, y) : x > ${a},\\ y > ${b}\\}`,
            0,
            t(
              `The boundary is the two rays $x = ${a}$, $y \\ge ${b}$ and $y = ${b}$, $x \\ge ${a}$, and none of them belongs to the set.`,
              `边界是两条射线 $x = ${a}$（$y \\ge ${b}$）与 $y = ${b}$（$x \\ge ${a}$），它们的点都不属于该集合。`,
            ),
            t(`The corner $(${a}, ${b})$ fails both strict inequalities.`, `角点 $(${a}, ${b})$ 两个严格不等式都不满足。`),
          ],
          [
            `\\{(x, y) : y \\ge ${parabola}\\}`,
            1,
            t(
              `The boundary is the parabola $y = ${parabola}$, and all of it belongs to the set.`,
              `边界是抛物线 $y = ${parabola}$，它的点全都属于该集合。`,
            ),
            t(`$(0, ${a})$ is on the parabola, and $${a} \\ge ${a}$ is true.`, `$(0, ${a})$ 在抛物线上，而 $${a} \\ge ${a}$ 成立。`),
          ],
          [
            `\\{(${a}, ${b})\\}`,
            1,
            t(
              `Every disk around $(${a}, ${b})$ contains the point and points outside the set, so the boundary is the point itself, which belongs to the set.`,
              `$(${a}, ${b})$ 周围的每个圆盘都含有该点以及集合外的点，所以边界就是该点本身，它属于该集合。`,
            ),
            t(
              `No disk around $(${a}, ${b})$ fits inside a set of one point, so the set is not open.`,
              `$(${a}, ${b})$ 周围没有圆盘能放进单点集，所以该集合不是开集。`,
            ),
          ],
          [
            `\\{(x, y) : x \\ge ${a},\\ y \\le ${b}\\}`,
            1,
            t(
              `The boundary is the two rays $x = ${a}$, $y \\le ${b}$ and $y = ${b}$, $x \\ge ${a}$, and all of them belong to the set.`,
              `边界是两条射线 $x = ${a}$（$y \\le ${b}$）与 $y = ${b}$（$x \\ge ${a}$），它们的点全都属于该集合。`,
            ),
            t(`The corner $(${a}, ${b})$ satisfies both inequalities.`, `角点 $(${a}, ${b})$ 两个不等式都满足。`),
          ],
          [
            `\\{(x, y) : x > ${a},\\ y \\le ${b}\\}`,
            3,
            t(
              `The boundary is the ray $x = ${a}$, $y \\le ${b}$, which is missing from the set, and the ray $y = ${b}$, $x \\ge ${a}$, whose points with $x > ${a}$ belong to it.`,
              `边界是射线 $x = ${a}$（$y \\le ${b}$）与射线 $y = ${b}$（$x \\ge ${a}$）；前者不属于该集合，后者中 $x > ${a}$ 的点属于该集合。`,
            ),
            t(
              `$(${a + 1}, ${b})$ is a boundary point in the set, and $(${a}, ${b - 1})$ is a boundary point outside it.`,
              `$(${a + 1}, ${b})$ 是属于该集合的边界点，$(${a}, ${b - 1})$ 是不属于它的边界点。`,
            ),
          ],
          [
            `\\{(x, y) : ${a} \\le x < ${a + 3}\\}`,
            3,
            t(
              `The boundary is the two lines $x = ${a}$ and $x = ${a + 3}$; the first belongs to the set and the second does not.`,
              `边界是两条直线 $x = ${a}$ 和 $x = ${a + 3}$；前者属于该集合，后者不属于。`,
            ),
            t(
              `$(${a}, 0)$ is in the set and $(${a + 3}, 0)$ is not, and both are boundary points.`,
              `$(${a}, 0)$ 在集合中而 $(${a + 3}, 0)$ 不在，两者都是边界点。`,
            ),
          ],
          [
            "\\mathbb{R}^2",
            2,
            t(
              "Every disk lies in the plane, so every point is an interior point and there are no boundary points at all.",
              "每个圆盘都在平面内，所以每个点都是内点，根本没有边界点。",
            ),
            t(
              "The plane is open since every point is interior, and its complement, the empty set, is open too, so the plane is also closed.",
              "平面的每个点都是内点，所以它是开集；它的补集空集也是开集，所以平面也是闭集。",
            ),
          ],
        ];
        const [set, kind, boundary, check] = rng.pick(forms);
        const names = [
          t("Open", "开集"),
          t("Closed", "闭集"),
          t("Both open and closed", "既开又闭"),
          t("Neither", "既不开也不闭"),
        ] as const;
        const reasons: readonly (readonly [string, string])[][] = [
          [
            ["", ""],
            ["Its boundary points are missing from it, since the inequalities are strict", "它缺少边界点，因为不等式是严格的"],
            ["Only the plane and the empty set are both, and this set has boundary points", "只有平面和空集既开又闭，而这个集合有边界点"],
            ["It contains none of its boundary points, so it is open", "它不含任何边界点，所以是开集"],
          ],
          [
            ["It contains boundary points, so it is not open", "它含有边界点，所以不是开集"],
            ["", ""],
            ["It contains its boundary points, so it is not open", "它含有边界点，所以不是开集"],
            ["It contains all of its boundary points, so it is closed", "它含有全部边界点，所以是闭集"],
          ],
          [
            ["It is open, and it is also closed: it has no boundary points to miss", "它是开集，同时也是闭集：它没有可缺少的边界点"],
            ["It is closed, and it is also open: every point is an interior point", "它是闭集，同时也是开集：每个点都是内点"],
            ["", ""],
            ["With no boundary points, it contains all of them and misses none", "没有边界点，所以它含有全部边界点，也不缺少任何边界点"],
          ],
          [
            ["It contains some of its boundary points, so it is not open", "它含有部分边界点，所以不是开集"],
            ["Some of its boundary points are missing from it, so it is not closed", "它缺少部分边界点，所以不是闭集"],
            ["Only the plane and the empty set are both, and this set has boundary points", "只有平面和空集既开又闭，而这个集合有边界点"],
            ["", ""],
          ],
        ];
        const conclusion = [
          t("It contains none of its boundary points: open.", "它不含任何边界点：开集。"),
          t("It contains all of its boundary points: closed.", "它含有全部边界点：闭集。"),
          t("It has no boundary points, so it is both open and closed.", "它没有边界点，所以既开又闭。"),
          t("It contains some of its boundary points but not all: neither.", "它含有部分而非全部边界点：既不开也不闭。"),
        ][kind] as Text;
        return explainedChoice(rng, {
          prompt: t(`Classify the set $${set}$.`, `判断集合 $${set}$ 的开闭性。`),
          correct: names[kind] as Text,
          wrong: [0, 1, 2, 3]
            .filter((i) => i !== kind)
            .map((i) => {
              const [en, zh] = reasons[kind]?.[i] ?? ["", ""];
              return { option: names[i] as Text, why: t(`${en}.`, `${zh}。`) };
            }),
          solution: walked(
            [
              [["Find the boundary", "求边界"], boundary],
              [["Decide", "下结论"], conclusion],
            ],
            check,
          ),
        });
      },
    },
  ],
};

/** theDomainOfAMultivariableFunction finds the natural domain of multivariable functions. */
export const theDomainOfAMultivariableFunction: TopicDef = {
  id: "the-domain-of-a-multivariable-function",
  title: t("The Domain of a Multivariable Function", "多元函数的定义域"),
  summary: t(
    "The domain of a multivariable function is the set of all input points for which the formula is mathematically defined.",
    "多元函数的定义域是使解析式具有数学意义的所有输入点的集合。",
  ),
  intro: t(
    "For $f(x, y) = \\sqrt{x - y} + \\ln y$, the square root needs $x - y \\ge 0$ and the logarithm needs $y > 0$. The domain is the set where both hold, $\\{(x, y) : 0 < y \\le x\\}$, the region of the first quadrant on or below the line $y = x$, without the $x$-axis.\n\nCheck: at $(3, 1)$ both pieces are defined, $f(3, 1) = \\sqrt{2} + \\ln 1 = \\sqrt{2}$, while $(1, 3)$ asks for $\\sqrt{-2}$ and $(2, 0)$ asks for $\\ln 0$.\n\nIn this lesson we find the domain of a function of two variables by collecting the condition each piece of its formula imposes.",
    "对 $f(x, y) = \\sqrt{x - y} + \\ln y$，平方根要求 $x - y \\ge 0$，对数要求 $y > 0$。定义域是两者同时成立的集合 $\\{(x, y) : 0 < y \\le x\\}$，即第一象限中直线 $y = x$ 上及其下方、不含 $x$ 轴的区域。\n\n检验：在 $(3, 1)$ 处两部分都有定义，$f(3, 1) = \\sqrt{2} + \\ln 1 = \\sqrt{2}$；而 $(1, 3)$ 需要 $\\sqrt{-2}$，$(2, 0)$ 需要 $\\ln 0$。\n\n本课我们汇集解析式中每一部分给出的条件，求二元函数的定义域。",
  ),
  prerequisites: ["open-and-closed-sets"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "determining-the-domain-of-a-multivariable-function",
      title: t("Determining the domain of a multivariable function", "求多元函数的定义域"),
      explanation: t(
        "To find the domain of a multivariable function, identify algebraic restrictions:\n\n- Radicands of even roots must be non-negative: $\\sqrt{g(x, y)} \\implies g(x, y) \\ge 0$.\n- Arguments of logarithms must be strictly positive: $\\ln(g(x, y)) \\implies g(x, y) > 0$.\n- Denominators must be non-zero.\n\nFor $f(x, y) = \\sqrt{y - x^2}$ the domain is $y \\ge x^2$, the region on and above the parabola $y = x^2$, and its boundary is that parabola.\n\n> **Watch out.** A logarithm needs a strictly positive argument while a square root allows $0$. In $x^2 + y^2 < 49$ the number $49$ is already the square of the radius $7$.",
        "求多元函数的定义域需考虑代数限制条件：\n\n- 偶次根式被开方数必须非负：$\\sqrt{g(x, y)} \\implies g(x, y) \\ge 0$。\n- 对数真数必须严格为正：$\\ln(g(x, y)) \\implies g(x, y) > 0$。\n- 分母不得为零。\n\n对 $f(x, y) = \\sqrt{y - x^2}$，定义域为 $y \\ge x^2$，即抛物线 $y = x^2$ 上及其上方的区域，其边界就是这条抛物线。\n\n> **注意。** 对数要求真数严格为正，而平方根允许 $0$。在 $x^2 + y^2 < 49$ 中，$49$ 已经是半径 $7$ 的平方。",
      ),
      generate(rng: Rng): Problem {
        const R = rng.int(2, 35);
        const rSq = R * R;
        const answer = `x^2 + y^2 = ${rSq}`;
        const mistakes = spoken(answer, [
          say(
            `x^2 + y^2 = ${R}`,
            `The right side of $x^2 + y^2 = r^2$ is the squared radius, and $${rSq}$ is already that square.`,
            `$x^2 + y^2 = r^2$ 的右边是半径的平方，而 $${rSq}$ 已经是这个平方。`,
          ),
          say(
            `x^2 - y^2 = ${rSq}`,
            `Moving $-x^2 - y^2$ to the other side makes both squares positive: $x^2 + y^2 < ${rSq}$.`,
            `把 $-x^2 - y^2$ 移到另一边，两个平方项都变为正：$x^2 + y^2 < ${rSq}$。`,
          ),
          say(`x + y = ${R}`, "The variables stay squared: the boundary is a circle, not a line.", "变量仍是平方：边界是圆，不是直线。"),
        ]);
        return withMistakes(
          equationProblem({
            prompt: t(
              `Find the equation of the boundary of the domain of the function $f(x, y) = \\ln(${rSq} - x^2 - y^2)$. Express the boundary as an equation in $x$ and $y$.`,
              `求函数 $f(x, y) = \\ln(${rSq} - x^2 - y^2)$ 的定义域边界的方程。结果以含 $x$ 和 $y$ 的方程表示。`,
            ),
            answer,
            wrong: mistakes.map((m) => m.response),
            solution: walked(
              [
                [
                  ["Write the condition", "写出条件"],
                  t(
                    `The logarithm needs a positive argument: $${rSq} - x^2 - y^2 > 0$, that is, $x^2 + y^2 < ${rSq}$.`,
                    `对数要求真数为正：$${rSq} - x^2 - y^2 > 0$，即 $x^2 + y^2 < ${rSq}$。`,
                  ),
                ],
                [
                  ["Take its edge", "取其边缘"],
                  t(
                    `The domain is the open disk of radius $${R}$ about the origin, and its boundary is the circle $${answer}$.`,
                    `定义域是以原点为圆心、半径为 $${R}$ 的开圆盘，其边界是圆 $${answer}$。`,
                  ),
                ],
              ],
              t(
                `At $(${R}, 0)$ the argument is $${rSq} - ${rSq} = 0$, where $\\ln$ is not defined, while at $(0, 0)$ it is $${rSq} > 0$: the circle separates the points where $f$ is defined from those where it is not.`,
                `在 $(${R}, 0)$ 处真数为 $${rSq} - ${rSq} = 0$，$\\ln$ 无定义；而在 $(0, 0)$ 处真数为 $${rSq} > 0$：这个圆把 $f$ 有定义的点与无定义的点分开。`,
              ),
            ),
          }),
          mistakes,
        );
      },
    },
    {
      id: "the-area-of-a-domain",
      figure: multivariableDrawings1["the-domain-of-a-multivariable-function#the-area-of-a-domain"],
      title: t("The area of a domain", "定义域的面积"),
      explanation: t(
        "To find the domain of a function built from roots and logarithms, collect the conditions from every piece: each square root needs a non-negative argument and each logarithm a positive one. The domain is the set where all of them hold at once. For example $\\sqrt{x} + \\sqrt{y} + \\sqrt{c - x - y}$ needs $x \\ge 0$, $y \\ge 0$ and $x + y \\le c$, a triangle of area $\\frac{c^2}{2}$.\n\nFor $\\sqrt{x} + \\sqrt{4 - x} + \\sqrt{y} + \\sqrt{1 - y}$ the conditions are $0 \\le x \\le 4$ and $0 \\le y \\le 1$, a rectangle of area $4$.\n\n> **Watch out.** $\\sqrt{a^2 - x^2}$ needs $-a \\le x \\le a$, an interval of length $2a$, not $a$. Whether an edge belongs to the domain does not change its area.",
        "要求由根式和对数构成的函数的定义域，需要汇集每一部分的条件：每个平方根要求被开方式非负，每个对数要求真数为正。定义域就是这些条件同时成立的集合。例如 $\\sqrt{x} + \\sqrt{y} + \\sqrt{c - x - y}$ 要求 $x \\ge 0$、$y \\ge 0$ 且 $x + y \\le c$，这是面积为 $\\frac{c^2}{2}$ 的三角形。\n\n对 $\\sqrt{x} + \\sqrt{4 - x} + \\sqrt{y} + \\sqrt{1 - y}$，条件是 $0 \\le x \\le 4$ 且 $0 \\le y \\le 1$，这是面积为 $4$ 的矩形。\n\n> **注意。** $\\sqrt{a^2 - x^2}$ 要求 $-a \\le x \\le a$，这个区间长 $2a$，不是 $a$。边是否属于定义域不影响面积。",
      ),
      generate(rng: Rng): Problem {
        const tri = rng.int(0, 1) === 0;
        const a = rng.int(1, 9);
        const b = rng.int(1, 9);
        const ans = tri ? Q.of(a * a, 2) : Q.of(4 * a * b);
        const f = tri ? `\\sqrt{x} + \\sqrt{y} + \\sqrt{${a} - x - y}` : `\\sqrt{${a * a} - x^2} + \\ln(${b * b} - y^2)`;
        const mistakes = tri
          ? [
              why(
                Q.of(a * a),
                `The triangle has legs $${a}$ and $${a}$, and a triangle is half of its rectangle: $\\frac{${a * a}}{2}$.`,
                `三角形两条直角边都是 $${a}$，三角形是对应矩形的一半：$\\frac{${a * a}}{2}$。`,
              ),
              why(
                Q.of(a, 2),
                `The legs are $${a}$ long, so the area is $\\frac{${a} \\cdot ${a}}{2}$: square the leg.`,
                `直角边长为 $${a}$，所以面积是 $\\frac{${a} \\cdot ${a}}{2}$：要把直角边平方。`,
              ),
            ]
          : [
              why(
                Q.of(a * b),
                `$|x| \\le ${a}$ is an interval of length $${2 * a}$ and $|y| < ${b}$ one of length $${2 * b}$.`,
                `$|x| \\le ${a}$ 是长为 $${2 * a}$ 的区间，$|y| < ${b}$ 是长为 $${2 * b}$ 的区间。`,
              ),
              why(
                Q.of(2 * a * b),
                `Both widths double: the sides are $${2 * a}$ and $${2 * b}$.`,
                `两个宽度都要加倍：边长是 $${2 * a}$ 和 $${2 * b}$。`,
              ),
              why(
                Q.of(4 * a * a * b * b),
                `The half widths are $${a}$ and $${b}$, the square roots of $${a * a}$ and $${b * b}$.`,
                `半宽是 $${a}$ 和 $${b}$，即 $${a * a}$ 与 $${b * b}$ 的平方根。`,
              ),
            ];
        return numberProblem({
          prompt: t(`Find the area of the domain of $f(x, y) = ${f}$.`, `求 $f(x, y) = ${f}$ 的定义域的面积。`),
          answer: ans,
          mistakes: distinct(ans, mistakes),
          solution: walked(
            tri
              ? [
                  [
                    ["Collect the conditions", "汇集条件"],
                    t(
                      `$x \\ge 0$, $y \\ge 0$ and $${a} - x - y \\ge 0$, that is, $x + y \\le ${a}$.`,
                      `$x \\ge 0$，$y \\ge 0$，且 $${a} - x - y \\ge 0$，即 $x + y \\le ${a}$。`,
                    ),
                  ],
                  [
                    ["Find the area", "求面积"],
                    t(
                      `This is the triangle with vertices $(0, 0)$, $(${a}, 0)$ and $(0, ${a})$, of area $\\frac{${a} \\cdot ${a}}{2} = ${ans.toLatex()}$.`,
                      `这是顶点为 $(0, 0)$、$(${a}, 0)$、$(0, ${a})$ 的三角形，面积为 $\\frac{${a} \\cdot ${a}}{2} = ${ans.toLatex()}$。`,
                    ),
                  ],
                ]
              : [
                  [
                    ["Collect the conditions", "汇集条件"],
                    t(
                      `$${a * a} - x^2 \\ge 0$ gives $|x| \\le ${a}$, and $${b * b} - y^2 > 0$ gives $|y| < ${b}$.`,
                      `$${a * a} - x^2 \\ge 0$ 给出 $|x| \\le ${a}$，$${b * b} - y^2 > 0$ 给出 $|y| < ${b}$。`,
                    ),
                  ],
                  [
                    ["Find the area", "求面积"],
                    t(
                      `This is a rectangle of sides $${2 * a}$ and $${2 * b}$, of area $${ans.toLatex()}$.`,
                      `这是边长为 $${2 * a}$ 和 $${2 * b}$ 的矩形，面积为 $${ans.toLatex()}$。`,
                    ),
                  ],
                ],
            tri
              ? t(
                  `Over each $x$ from $0$ to $${a}$ the domain has height $${a} - x$, and $\\int_0^{${a}} (${a} - x)\\,dx = ${a * a} - \\frac{${a * a}}{2} = ${ans.toLatex()}$.`,
                  `对 $0$ 到 $${a}$ 之间的每个 $x$，定义域的高度为 $${a} - x$，而 $\\int_0^{${a}} (${a} - x)\\,dx = ${a * a} - \\frac{${a * a}}{2} = ${ans.toLatex()}$。`,
                )
              : t(
                  `The quarter with $x \\ge 0$ and $y \\ge 0$ is $${a}$ by $${b}$, of area $${a * b}$, and four such quarters make $${ans.toLatex()}$.`,
                  `$x \\ge 0$、$y \\ge 0$ 的四分之一部分是 $${a} \\times ${b}$，面积为 $${a * b}$，四个这样的部分合起来是 $${ans.toLatex()}$。`,
                ),
          ),
        });
      },
    },
  ],
};

/** levelCurves finds equations of level curves f(x, y) = c. */
export const levelCurves: TopicDef = {
  id: "level-curves",
  title: t("Level Curves", "等值线"),
  summary: t(
    "The level curves of a function f(x, y) are the curves in the xy-plane with equation f(x, y) = c for constants c in the range.",
    "函数 f(x, y) 的等值线是 xy 平面内满足方程 f(x, y) = c 的曲线，其中 c 为函数值域内的常数。",
  ),
  intro: t(
    "For $f(x, y) = x^2 - y$, the level curve through $(2, 1)$ has level $c = f(2, 1) = 4 - 1 = 3$, so it is $x^2 - y = 3$, the parabola $y = x^2 - 3$. Every point of that parabola is sent by $f$ to the same value $3$.\n\nCheck: $(0, -3)$ lies on the parabola, and $f(0, -3) = 0 - (-3) = 3$.\n\nIn this lesson we find the level curve of a function through a point, by evaluating the function there and setting it equal to that value.",
    "对 $f(x, y) = x^2 - y$，过 $(2, 1)$ 的等值线的水平值为 $c = f(2, 1) = 4 - 1 = 3$，所以它是 $x^2 - y = 3$，即抛物线 $y = x^2 - 3$。$f$ 把这条抛物线上的每个点都映到同一个值 $3$。\n\n检验：$(0, -3)$ 在这条抛物线上，且 $f(0, -3) = 0 - (-3) = 3$。\n\n本课我们在一点处计算函数值，再令函数等于这个值，求出过该点的等值线。",
  ),
  prerequisites: ["the-domain-of-a-multivariable-function"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "finding-equations-of-level-curves",
      title: t("Finding equations of level curves", "求等值线方程"),
      explanation: t(
        "A **level curve** (or contour line) of $z = f(x, y)$ represents all input points $(x, y)$ where the function takes a constant value $c$. Its equation in the $xy$-plane is simply:\n\n$$f(x, y) = c.$$ The level curve through a point $(x_0, y_0)$ has $c = f(x_0, y_0)$.\n\nFor $f(x, y) = xy$ the level curve through $(2, 3)$ is $xy = 6$, a hyperbola.\n\n> **Watch out.** The level is the value of $f$ at the point, coefficients included, not the sum of the squared coordinates. The left side stays $f(x, y)$ itself.",
        "$z = f(x, y)$ 的**等值线**（或等高线）表示函数值取常数 $c$ 的所有输入点 $(x, y)$ 的集合。其在 $xy$ 平面中的方程为：\n\n$$f(x, y) = c$$ 过点 $(x_0, y_0)$ 的等值线有 $c = f(x_0, y_0)$。\n\n对 $f(x, y) = xy$，过 $(2, 3)$ 的等值线是 $xy = 6$，一条双曲线。\n\n> **注意。** 水平值是 $f$ 在该点的值，系数也要算进去，不是坐标平方之和。方程左边仍是 $f(x, y)$ 本身。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 6);
        const b = rng.int(2, 6);
        const p = rng.nonZero(-3, 3);
        const q = rng.nonZero(-3, 3);
        const c = a * p * p + b * q * q;
        const lhs = poly([a, "x^2"], [b, "y^2"]);
        const answer = `${lhs} = ${c}`;
        const mistakes = spoken(answer, [
          say(
            `${lhs} = ${p * p + q * q}`,
            `The level is $f(${p}, ${q})$, so the coefficients count: $${a} \\cdot ${p * p} + ${b} \\cdot ${q * q} = ${c}$.`,
            `水平值是 $f(${p}, ${q})$，所以系数要算进去：$${a} \\cdot ${p * p} + ${b} \\cdot ${q * q} = ${c}$。`,
          ),
          say(
            `${lhs} = ${a * p + b * q}`,
            "The coordinates are squared before they are multiplied by the coefficients.",
            "坐标要先平方，再乘以系数。",
          ),
          say(
            `${poly([a, "x^2"], [-b, "y^2"])} = ${c}`,
            `The left side is $f$ itself, $${lhs}$, with both terms positive.`,
            `左边就是 $f$ 本身，即 $${lhs}$，两项都为正。`,
          ),
        ]);
        return withMistakes(
          equationProblem({
            prompt: t(
              `Find the equation of the level curve of $f(x, y) = ${lhs}$ that passes through the point $(${p}, ${q})$.`,
              `求函数 $f(x, y) = ${lhs}$ 经过点 $(${p}, ${q})$ 的等值线方程。`,
            ),
            answer,
            wrong: mistakes.map((m) => m.response),
            solution: walked(
              [
                [
                  ["Evaluate f at the point", "在该点计算 f"],
                  t(
                    `$c = ${a} \\cdot ${p * p} + ${b} \\cdot ${q * q} = ${c}$.`,
                    `$c = ${a} \\cdot ${p * p} + ${b} \\cdot ${q * q} = ${c}$。`,
                  ),
                ],
                [["Set f equal to it", "令 f 等于它"], t(`$${answer}$.`, `$${answer}$。`)],
              ],
              t(
                `$(${-p}, ${q})$ is on the same curve, since $${a} \\cdot (${-p})^2 + ${b} \\cdot ${q * q} = ${c}$ as well: the curve is symmetric about the $y$-axis, as an ellipse centered at the origin should be.`,
                `$(${-p}, ${q})$ 也在这条曲线上，因为同样有 $${a} \\cdot (${-p})^2 + ${b} \\cdot ${q * q} = ${c}$：曲线关于 $y$ 轴对称，正如以原点为中心的椭圆应有的那样。`,
              ),
            ),
          }),
          mistakes,
        );
      },
    },
    {
      id: "the-level-curve-through-a-point",
      title: t("The level curve through a point", "过某点的等值线"),
      explanation: t(
        "The level curve of $f$ through a point $(p, q)$ is $f(x, y) = c$ with $c = f(p, q)$. For $f(x, y) = ax^2 + by^2$ with $a, b > 0$ it is the ellipse $ax^2 + by^2 = c$. Setting $y = 0$ shows where it crosses the $x$-axis, so its semi-axis along $x$ satisfies\n\n$$s_x^2 = \\frac{c}{a}.$$\n\nFor $f(x, y) = 9x^2 + y^2$ through $(1, 3)$, $c = 9 + 9 = 18$ and $s_x^2 = \\frac{18}{9} = 2$.\n\n> **Watch out.** Divide by the coefficient of $x^2$, not of $y^2$, for the semi-axis along $x$. The level $c$ is $f$ at the point, not the point's squared distance from the origin.",
        "$f$ 过点 $(p, q)$ 的等值线是 $f(x, y) = c$，其中 $c = f(p, q)$。对 $a, b > 0$ 的 $f(x, y) = ax^2 + by^2$，它是椭圆 $ax^2 + by^2 = c$。令 $y = 0$ 可知它与 $x$ 轴的交点，所以沿 $x$ 方向的半轴满足\n\n$$s_x^2 = \\frac{c}{a}.$$\n\n对 $f(x, y) = 9x^2 + y^2$ 过 $(1, 3)$ 的等值线，$c = 9 + 9 = 18$，$s_x^2 = \\frac{18}{9} = 2$。\n\n> **注意。** 求沿 $x$ 方向的半轴要除以 $x^2$ 的系数，而不是 $y^2$ 的系数。水平值 $c$ 是 $f$ 在该点的值，不是该点到原点距离的平方。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 6);
        const b = rng.int(1, 6);
        const p = rng.int(-4, 4);
        const q = rng.int(-4, 4) || 1;
        const c = a * p * p + b * q * q;
        const ans = Q.of(c, a);
        const f = poly([a, "x^2"], [b, "y^2"]);
        return numberProblem({
          prompt: t(
            `The level curve of $f(x, y) = ${f}$ through $(${p}, ${q})$ is an ellipse. Find the square of its semi-axis along the $x$-axis.`,
            `$f(x, y) = ${f}$ 过点 $(${p}, ${q})$ 的等值线是一个椭圆。求它沿 $x$ 轴的半轴长的平方。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(c),
              `Setting $y = 0$ leaves $${a === 1 ? "" : a}x^2 = ${c}$, so divide by $${a}$.`,
              `令 $y = 0$ 得 $${a === 1 ? "" : a}x^2 = ${c}$，所以要除以 $${a}$。`,
            ),
            why(
              Q.of(c, b),
              `Dividing by $${b}$ gives the square of the semi-axis along $y$, from $x = 0$.`,
              `除以 $${b}$ 得到的是沿 $y$ 方向的半轴平方，那是令 $x = 0$ 的结果。`,
            ),
            why(
              Q.of(p * p + q * q, a),
              `The level is $f(${p}, ${q}) = ${c}$, with the coefficients, not $${p * p} + ${q * q}$.`,
              `水平值是 $f(${p}, ${q}) = ${c}$，要带系数，而不是 $${p * p} + ${q * q}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the level", "求水平值"],
                t(`$c = f(${p}, ${q}) = ${c}$, so the curve is $${f} = ${c}$.`, `$c = f(${p}, ${q}) = ${c}$，所以曲线为 $${f} = ${c}$。`),
              ],
              [
                ["Set y = 0", "令 y = 0"],
                t(
                  `$${a === 1 ? "" : a}x^2 = ${c}$, so $s_x^2 = \\frac{${c}}{${a}}${lowestTerms(c, a)}$.`,
                  `$${a === 1 ? "" : a}x^2 = ${c}$，所以 $s_x^2 = \\frac{${c}}{${a}}${lowestTerms(c, a)}$。`,
                ),
              ],
            ],
            t(
              `The point $(s_x, 0)$ lies on the curve: $${a} \\cdot ${ans.toLatex()} + ${b} \\cdot 0 = ${c}$.`,
              `点 $(s_x, 0)$ 在曲线上：$${a} \\cdot ${ans.toLatex()} + ${b} \\cdot 0 = ${c}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** levelSurfaces finds equations of level surfaces F(x, y, z) = c. */
export const levelSurfaces: TopicDef = {
  id: "level-surfaces",
  title: t("Level Surfaces", "等值面"),
  summary: t(
    "The level surfaces of a function F(x, y, z) are the surfaces in three-dimensional space with equation F(x, y, z) = c.",
    "函数 F(x, y, z) 的等值面是三维空间中满足方程 F(x, y, z) = c 的曲面。",
  ),
  intro: t(
    "For $F(x, y, z) = x + y^2 + z$, the level surface through $(1, 2, -3)$ has level $c = 1 + 4 - 3 = 2$, so it is $x + y^2 + z = 2$. Every point of that surface is sent by $F$ to the value $2$.\n\nCheck: $(2, 0, 0)$ lies on the surface, since $2 + 0 + 0 = 2$, and so does $(0, 1, 1)$, since $0 + 1 + 1 = 2$.\n\nIn this lesson we find the level surface of a function of three variables through a point and recognize its shape from its level.",
    "对 $F(x, y, z) = x + y^2 + z$，过 $(1, 2, -3)$ 的等值面的水平值为 $c = 1 + 4 - 3 = 2$，所以它是 $x + y^2 + z = 2$。$F$ 把这个曲面上的每个点都映到值 $2$。\n\n检验：$(2, 0, 0)$ 在该曲面上，因为 $2 + 0 + 0 = 2$；$(0, 1, 1)$ 也在，因为 $0 + 1 + 1 = 2$。\n\n本课我们求三元函数过一点的等值面，并由水平值判断它的形状。",
  ),
  prerequisites: ["level-curves"],
  encompasses: [{ topic: "level-curves", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "finding-equations-of-level-surfaces",
      title: t("Finding equations of level surfaces", "求等值面方程"),
      explanation: t(
        "A level surface is the three dimensional version of a contour line: all the points where the function takes one fixed value. A **level surface** of a three-variable function $w = F(x, y, z)$ consists of all points in $\\mathbb{R}^3$ where $F(x, y, z) = c$ for a constant $c$. The level surface through a given point has $c$ equal to the value of $F$ there.\n\nFor $F(x, y, z) = xyz$ the level surface through $(1, 2, 3)$ is $xyz = 6$.\n\n> **Watch out.** The level is $F$ at the point with its coefficients, not the sum of the squared coordinates. Keep every sign of $F$ on the left side.",
        "等值面是等高线的三维版本：函数取同一个固定值的所有点。三元函数 $w = F(x, y, z)$ 的**等值面**由使 $F(x, y, z) = c$（$c$ 为常数）的所有三维空间点构成。过某一点的等值面，其 $c$ 等于 $F$ 在该点的值。\n\n对 $F(x, y, z) = xyz$，过 $(1, 2, 3)$ 的等值面是 $xyz = 6$。\n\n> **注意。** 水平值是带系数的 $F$ 在该点的值，不是坐标平方之和。左边要保留 $F$ 的每个符号。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const b = rng.int(1, 5);
        const cCoeff = rng.int(2, 5);
        const [p, q, r] = [rng.nonZero(-2, 2), rng.nonZero(-2, 2), rng.nonZero(-3, 3)];
        const k = a * p * p + b * q * q + cCoeff * r * r;
        const lhs = poly([a, "x^2"], [b, "y^2"], [cCoeff, "z^2"]);
        const answer = `${lhs} = ${k}`;
        const mistakes = spoken(answer, [
          say(
            `${lhs} = ${p * p + q * q + r * r}`,
            `The level is $F(${p}, ${q}, ${r})$, so the coefficients count: $${a} \\cdot ${p * p} + ${b} \\cdot ${q * q} + ${cCoeff} \\cdot ${r * r} = ${k}$.`,
            `水平值是 $F(${p}, ${q}, ${r})$，所以系数要算进去：$${a} \\cdot ${p * p} + ${b} \\cdot ${q * q} + ${cCoeff} \\cdot ${r * r} = ${k}$。`,
          ),
          say(
            `${lhs} = ${a * p + b * q + cCoeff * r}`,
            "The coordinates are squared before they are multiplied by the coefficients.",
            "坐标要先平方，再乘以系数。",
          ),
          say(
            `${poly([a, "x^2"], [b, "y^2"], [-cCoeff, "z^2"])} = ${k}`,
            `The left side is $F$ itself, $${lhs}$, with every term positive.`,
            `左边就是 $F$ 本身，即 $${lhs}$，每一项都为正。`,
          ),
        ]);
        return withMistakes(
          equationProblem({
            prompt: t(
              `Find the equation of the level surface of $F(x, y, z) = ${lhs}$ that passes through the point $(${p}, ${q}, ${r})$.`,
              `求函数 $F(x, y, z) = ${lhs}$ 经过点 $(${p}, ${q}, ${r})$ 的等值面方程。`,
            ),
            answer,
            wrong: mistakes.map((m) => m.response),
            solution: walked(
              [
                [
                  ["Evaluate F at the point", "在该点计算 F"],
                  t(
                    `$c = ${a} \\cdot ${p * p} + ${b} \\cdot ${q * q} + ${cCoeff} \\cdot ${r * r} = ${k}$.`,
                    `$c = ${a} \\cdot ${p * p} + ${b} \\cdot ${q * q} + ${cCoeff} \\cdot ${r * r} = ${k}$。`,
                  ),
                ],
                [["Set F equal to it", "令 F 等于它"], t(`$${answer}$.`, `$${answer}$。`)],
              ],
              t(
                `$(${p}, ${q}, ${-r})$ lies on the same surface, since changing the sign of $z$ leaves $z^2$ as it is; the surface is an ellipsoid centered at the origin.`,
                `$(${p}, ${q}, ${-r})$ 也在这个曲面上，因为改变 $z$ 的符号不改变 $z^2$；该曲面是以原点为中心的椭球面。`,
              ),
            ),
          }),
          mistakes,
        );
      },
    },
    {
      id: "the-shape-of-the-level-surface-through-a-point",
      figure: multivariableDrawings2["level-surfaces#the-shape-of-the-level-surface-through-a-point"],
      title: t("The shape of the level surface through a point", "过某点的等值面的形状"),
      explanation: t(
        "The level surfaces of $F(x, y, z) = x^2 + y^2 - z^2$ change shape with the level $c$. For $c > 0$, $x^2 + y^2 - z^2 = c$ is a hyperboloid of one sheet; for $c < 0$ it is a hyperboloid of two sheets; for $c = 0$ it is a double cone. To find the surface through a point, first compute $c = F$ at that point.\n\nThrough $(6, 0, 1)$ the level is $36 - 1 = 35 > 0$, so the surface is a hyperboloid of one sheet.\n\n> **Watch out.** A negative level gives two sheets: then $z^2 = x^2 + y^2 - c$ is at least $-c > 0$, which leaves a gap around the plane $z = 0$. The cone is the level $0$ alone.",
        "$F(x, y, z) = x^2 + y^2 - z^2$ 的等值面随水平值 $c$ 改变形状。$c > 0$ 时，$x^2 + y^2 - z^2 = c$ 是单叶双曲面；$c < 0$ 时是双叶双曲面；$c = 0$ 时是双圆锥面。要找过某点的等值面，先计算该点处的 $c = F$。\n\n过 $(6, 0, 1)$ 的水平值为 $36 - 1 = 35 > 0$，所以该曲面是单叶双曲面。\n\n> **注意。** 负的水平值给出双叶：这时 $z^2 = x^2 + y^2 - c$ 至少为 $-c > 0$，在平面 $z = 0$ 附近留下空隙。圆锥面只对应水平值 $0$。",
      ),
      generate(rng: Rng): Problem {
        const [x, y, z] = [rng.int(-4, 4), rng.int(-4, 4), rng.int(-5, 5)];
        const c = x * x + y * y - z * z;
        const kind = c > 0 ? 0 : c < 0 ? 1 : 2;
        const names = [
          t("Hyperboloid of one sheet", "单叶双曲面"),
          t("Hyperboloid of two sheets", "双叶双曲面"),
          t("Double cone", "双圆锥面"),
        ] as const;
        const reasons: readonly (readonly [string, string])[][] = [
          [
            ["", ""],
            [`Two sheets need a negative level, and $c = ${c}$ is positive`, `双叶需要负的水平值，而 $c = ${c}$ 为正`],
            [`The cone is the level $0$, and $c = ${c}$`, `圆锥面对应水平值 $0$，而 $c = ${c}$`],
          ],
          [
            [`One sheet needs a positive level, and $c = ${c}$ is negative`, `单叶需要正的水平值，而 $c = ${c}$ 为负`],
            ["", ""],
            [`The cone is the level $0$, and $c = ${c}$`, `圆锥面对应水平值 $0$，而 $c = ${c}$`],
          ],
          [
            ["One sheet needs a positive level, and here $c = 0$", "单叶需要正的水平值，而这里 $c = 0$"],
            ["Two sheets need a negative level, and here $c = 0$", "双叶需要负的水平值，而这里 $c = 0$"],
            ["", ""],
          ],
        ];
        const check = [
          t(
            `The plane $z = 0$ meets $x^2 + y^2 - z^2 = ${c}$ in the circle $x^2 + y^2 = ${c}$, and every plane $z = h$ meets it in a circle of radius $\\sqrt{${c} + h^2}$, so the surface is one connected piece.`,
            `平面 $z = 0$ 与 $x^2 + y^2 - z^2 = ${c}$ 交于圆 $x^2 + y^2 = ${c}$，每个平面 $z = h$ 都与它交于半径为 $\\sqrt{${c} + h^2}$ 的圆，所以曲面是连成一片的。`,
          ),
          t(
            `On the surface $z^2 = x^2 + y^2 + ${-c} \\ge ${-c}$, so no point has $|z| < \\sqrt{${-c}}$: the surface splits into a piece above and a piece below.`,
            `在曲面上 $z^2 = x^2 + y^2 + ${-c} \\ge ${-c}$，所以没有点满足 $|z| < \\sqrt{${-c}}$：曲面分成上下两片。`,
          ),
          t(
            "The origin satisfies $0 = 0$, and the surface is $z = \\pm\\sqrt{x^2 + y^2}$, two cones meeting at the origin.",
            "原点满足 $0 = 0$，曲面是 $z = \\pm\\sqrt{x^2 + y^2}$，即在原点相接的两个圆锥。",
          ),
        ][kind] as Text;
        const sign = kind === 0 ? "positive" : kind === 1 ? "negative" : "zero";
        const signZh = kind === 0 ? "为正" : kind === 1 ? "为负" : "为零";
        return explainedChoice(rng, {
          prompt: t(
            `Identify the level surface of $F(x, y, z) = x^2 + y^2 - z^2$ that passes through $(${x}, ${y}, ${z})$.`,
            `判断 $F(x, y, z) = x^2 + y^2 - z^2$ 过点 $(${x}, ${y}, ${z})$ 的等值面。`,
          ),
          correct: names[kind] as Text,
          wrong: [0, 1, 2]
            .filter((i) => i !== kind)
            .map((i) => {
              const [en, zh] = reasons[kind]?.[i] ?? ["", ""];
              return { option: names[i] as Text, why: t(`${en}.`, `${zh}。`) };
            }),
          solution: walked(
            [
              [
                ["Find the level", "求水平值"],
                t(`$c = ${x * x} + ${y * y} - ${z * z} = ${c}$.`, `$c = ${x * x} + ${y * y} - ${z * z} = ${c}$。`),
              ],
              [
                ["Read the shape from its sign", "由其符号判断形状"],
                t(
                  `The level is ${sign}, so $x^2 + y^2 - z^2 = ${c}$ is ${kind === 2 ? "a double cone" : `a ${(names[kind] as Text).en.toLowerCase()}`}.`,
                  `水平值${signZh}，所以 $x^2 + y^2 - z^2 = ${c}$ 是${(names[kind] as Text)["zh-CN"]}。`,
                ),
              ],
            ],
            check,
          ),
        });
      },
    },
  ],
};

/** kTimes writes k times a monomial, leaving a coefficient of 1 or −1 implicit. */
const kTimes = (k: number, v: string): string => (k === 1 ? v : k === -1 ? `-${v}` : `${k}${v}`);

/** limitsAndContinuityOfMultivariableFunctions examines limits along paths. */
export const limitsAndContinuityOfMultivariableFunctions: TopicDef = {
  id: "limits-and-continuity-of-multivariable-functions",
  title: t("Limits and Continuity of Multivariable Functions", "多元函数的极限与连续性"),
  summary: t(
    "A multivariable limit exists only if the function approaches the same value along every possible path approaching the point.",
    "多元函数的极限存在，当且仅当函数沿所有可能趋近该点的路径都趋于同一个值。",
  ),
  intro: t(
    "Take $f(x, y) = \\frac{x^2 - y^2}{x^2 + y^2}$. Along the $x$-axis, $y = 0$, it equals $\\frac{x^2}{x^2} = 1$; along the $y$-axis, $x = 0$, it equals $\\frac{-y^2}{y^2} = -1$. Two paths into the origin give two different values, so $\\lim_{(x, y) \\to (0, 0)} f(x, y)$ does not exist.\n\nCheck: along the line $y = x$ the function is $\\frac{0}{2x^2} = 0$, a third value, so the paths really do disagree.\n\nIn this lesson we compute limits along lines and curves into a point, and use them to show that a limit does not exist.",
    "取 $f(x, y) = \\frac{x^2 - y^2}{x^2 + y^2}$。沿 $x$ 轴，$y = 0$，它等于 $\\frac{x^2}{x^2} = 1$；沿 $y$ 轴，$x = 0$，它等于 $\\frac{-y^2}{y^2} = -1$。两条趋于原点的路径给出两个不同的值，所以 $\\lim_{(x, y) \\to (0, 0)} f(x, y)$ 不存在。\n\n检验：沿直线 $y = x$，函数为 $\\frac{0}{2x^2} = 0$，又是一个不同的值，所以各路径确实不一致。\n\n本课我们沿直线和曲线求趋于一点的极限，并用它们说明极限不存在。",
  ),
  prerequisites: ["level-surfaces", "the-finite-limit-of-a-function"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-limits-along-linear-paths",
      title: t("Evaluating limits along linear paths", "沿直线路径求极限"),
      explanation: t(
        "To test whether $\\lim_{(x, y) \\to (0, 0)} f(x, y)$ exists, approach $(0, 0)$ along lines $y = mx$. If the resulting limit depends on the slope $m$, the two-variable limit does not exist.\n\nFor $f(x, y) = \\frac{xy}{x^2 + y^2}$ along $y = -x$, $f(x, -x) = \\frac{-x^2}{2x^2} = -\\frac{1}{2}$, while along $y = 0$ it is $0$.\n\n> **Watch out.** Replace $y$ by $mx$ everywhere: $y^2$ becomes $m^2x^2$, not $mx^2$. One line giving a value does not show the limit exists; only two paths that disagree settle the question.",
        "为了检验 $\\lim_{(x, y) \\to (0, 0)} f(x, y)$ 是否存在，可沿直线 $y = mx$ 趋近 $(0, 0)$。若所得极限依赖于斜率 $m$，则该二元极限不存在。\n\n对 $f(x, y) = \\frac{xy}{x^2 + y^2}$，沿 $y = -x$ 有 $f(x, -x) = \\frac{-x^2}{2x^2} = -\\frac{1}{2}$，而沿 $y = 0$ 为 $0$。\n\n> **注意。** 每处的 $y$ 都要换成 $mx$：$y^2$ 变成 $m^2x^2$，而不是 $mx^2$。一条直线给出一个值并不说明极限存在；只有两条路径的值不同才能下结论。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-6, 6);
        const b = rng.int(1, 5);
        const c = rng.int(1, 5);
        const m = rng.int(1, 4);
        const num = a * m;
        const den = b + c * m * m;
        const ans = Q.of(num, den);
        const line = kTimes(m, "x");
        const f = `\\frac{${poly([a, "xy"])}}{${poly([b, "x^2"], [c, "y^2"])}}`;
        return numberProblem({
          prompt: t(
            `Find the limit of $f(x, y) = ${f}$ as $(x, y) \\to (0, 0)$ along the line $y = ${line}$.`,
            `求函数 $f(x, y) = ${f}$ 沿直线 $y = ${line}$ 当 $(x, y) \\to (0, 0)$ 时的极限值。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.zero,
              "Putting in $(0, 0)$ gives $\\frac{0}{0}$, which is not $0$; substitute the line first and cancel $x^2$.",
              "代入 $(0, 0)$ 得到 $\\frac{0}{0}$，它不是 $0$；要先代入直线，再约去 $x^2$。",
            ),
            why(
              Q.of(a * m, b + c * m),
              `On the line $y^2 = ${m * m}x^2$, so $${c}y^2$ becomes $${c * m * m}x^2$: square the slope.`,
              `在直线上 $y^2 = ${m * m}x^2$，所以 $${c}y^2$ 变成 $${c * m * m}x^2$：斜率要平方。`,
            ),
            why(
              Q.of(a, b + c),
              `That is the value along $y = x$; along $y = ${line}$ the slope $${m}$ appears in both the numerator and the denominator.`,
              `这是沿 $y = x$ 的值；沿 $y = ${line}$，斜率 $${m}$ 同时出现在分子和分母中。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Substitute the line", "代入直线"],
                t(
                  `$f(x, ${line}) = \\frac{${num}x^2}{${b}x^2 + ${c * m * m}x^2}$.`,
                  `$f(x, ${line}) = \\frac{${num}x^2}{${b}x^2 + ${c * m * m}x^2}$。`,
                ),
              ],
              [
                ["Cancel x²", "约去 x²"],
                t(
                  `For $x \\ne 0$ this is $\\frac{${num}}{${den}} = ${ans.toLatex()}$, which does not depend on $x$, so the limit is $${ans.toLatex()}$.`,
                  `当 $x \\ne 0$ 时它等于 $\\frac{${num}}{${den}} = ${ans.toLatex()}$，与 $x$ 无关，所以极限为 $${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `At the point $(1, ${m})$ of the line, $f(1, ${m}) = \\frac{${a} \\cdot ${m}}{${b} + ${c} \\cdot ${m * m}} = ${ans.toLatex()}$, the same value, since $f$ is constant along the line.`,
              `在直线上的点 $(1, ${m})$ 处，$f(1, ${m}) = \\frac{${a} \\cdot ${m}}{${b} + ${c} \\cdot ${m * m}} = ${ans.toLatex()}$，值相同，因为 $f$ 沿这条直线是常数。`,
            ),
          ),
        });
      },
    },
    {
      id: "limits-along-parabolic-paths",
      figure: multivariableDrawings2["limits-and-continuity-of-multivariable-functions#limits-along-parabolic-paths"],
      title: t("Limits along parabolic paths", "沿抛物线路径的极限"),
      explanation: t(
        "Some functions have the same limit along every straight line through the origin and still have no limit. For $f(x, y) = \\frac{x^2y}{x^4 + y^2}$, every line $y = mx$ gives $0$, but along the parabola $y = kx^2$,\n\n$$f(x, kx^2) = \\frac{kx^4}{x^4 + k^2x^4} = \\frac{k}{1 + k^2}.$$\n\nDifferent parabolas give different values, so the limit at the origin does not exist.\n\n> **Watch out.** Along $y = kx^2$, $y^2 = k^2x^4$, and the numerator $x^2y$ becomes $kx^4$, so $k$ appears in both. Agreement along every line is not enough for the limit to exist.",
        "有些函数沿过原点的每条直线极限都相同，但极限仍不存在。对 $f(x, y) = \\frac{x^2y}{x^4 + y^2}$，每条直线 $y = mx$ 都给出 $0$，但沿抛物线 $y = kx^2$，\n\n$$f(x, kx^2) = \\frac{kx^4}{x^4 + k^2x^4} = \\frac{k}{1 + k^2}.$$\n\n不同的抛物线给出不同的值，所以原点处的极限不存在。\n\n> **注意。** 沿 $y = kx^2$，$y^2 = k^2x^4$，分子 $x^2y$ 变成 $kx^4$，所以分子分母中都有 $k$。沿每条直线的值一致，并不足以说明极限存在。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const k = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
        const ans = Q.of(a * k, 1 + k * k);
        const path = kTimes(k, "x^2");
        const f = `\\frac{${a === 1 ? "" : a}x^2y}{x^4 + y^2}`;
        return numberProblem({
          prompt: t(
            `Find the limit of $f(x, y) = ${f}$ as $(x, y) \\to (0, 0)$ along the parabola $y = ${path}$.`,
            `求 $f(x, y) = ${f}$ 沿抛物线 $y = ${path}$ 当 $(x, y) \\to (0, 0)$ 时的极限。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.zero,
              "That is the limit along straight lines; along the parabola the powers of $x$ cancel and leave a constant that is not $0$.",
              "这是沿直线的极限；沿抛物线，$x$ 的幂约去后留下一个不为 $0$ 的常数。",
            ),
            why(
              Q.of(a, 1 + k * k),
              `The numerator $${a === 1 ? "" : a}x^2y$ becomes $${a * k}x^4$ on the parabola, so $${k}$ multiplies it too.`,
              `在抛物线上分子 $${a === 1 ? "" : a}x^2y$ 变成 $${a * k}x^4$，所以分子也要乘 $${k}$。`,
            ),
            why(
              Q.of(a, k),
              `The denominator is $x^4 + ${k * k}x^4$; dropping the $x^4$ leaves only $${k * k}x^4$.`,
              `分母是 $x^4 + ${k * k}x^4$；漏掉 $x^4$ 就只剩 $${k * k}x^4$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Substitute the parabola", "代入抛物线"],
                t(
                  `With $y = ${path}$, $y^2 = ${k * k}x^4$ and $f = \\frac{${a * k}x^4}{x^4 + ${k * k}x^4}$.`,
                  `取 $y = ${path}$，$y^2 = ${k * k}x^4$，$f = \\frac{${a * k}x^4}{x^4 + ${k * k}x^4}$。`,
                ),
              ],
              [
                ["Cancel x⁴", "约去 x⁴"],
                t(
                  `For $x \\ne 0$ this is $\\frac{${a * k}}{${1 + k * k}} = ${ans.toLatex()}$, so the limit along the parabola is $${ans.toLatex()}$.`,
                  `当 $x \\ne 0$ 时它等于 $\\frac{${a * k}}{${1 + k * k}} = ${ans.toLatex()}$，所以沿抛物线的极限是 $${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The point $(1, ${k})$ lies on the parabola, and $f(1, ${k}) = \\frac{${a} \\cdot ${paren(k)}}{1 + ${k * k}} = ${ans.toLatex()}$: $f$ is constant along the whole parabola.`,
              `点 $(1, ${k})$ 在抛物线上，且 $f(1, ${k}) = \\frac{${a} \\cdot ${paren(k)}}{1 + ${k * k}} = ${ans.toLatex()}$：$f$ 在整条抛物线上是常数。`,
            ),
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 2.6 Quadric Surfaces and Cylinders
// ---------------------------------------------------------------------------

/** ellipsoids identifies properties of ellipsoids. */
export const ellipsoids: TopicDef = {
  id: "ellipsoids",
  title: t("Ellipsoids", "椭球面"),
  summary: t(
    "An ellipsoid is a quadric surface with standard equation x²/a² + y²/b² + z²/c² = 1.",
    "椭球面是二次曲面，其标准方程为 x²/a² + y²/b² + z²/c² = 1。",
  ),
  intro: t(
    "The ellipsoid $\\frac{x^2}{4} + \\frac{y^2}{9} + z^2 = 1$ crosses the $x$-axis where $\\frac{x^2}{4} = 1$, at $x = \\pm 2$, the $y$-axis at $y = \\pm 3$ and the $z$-axis at $z = \\pm 1$. Its semi-axes are $2$, $3$ and $1$, and the surface is a sphere stretched by those factors along the three axes.\n\nCheck: $(2, 0, 0)$ gives $\\frac{4}{4} + 0 + 0 = 1$, and $(0, 3, 0)$ gives $\\frac{9}{9} = 1$.\n\nIn this lesson we read the intercepts and semi-axes of an ellipsoid from its equation and use them to find its volume.",
    "椭球面 $\\frac{x^2}{4} + \\frac{y^2}{9} + z^2 = 1$ 与 $x$ 轴交于 $\\frac{x^2}{4} = 1$ 处，即 $x = \\pm 2$；与 $y$ 轴交于 $y = \\pm 3$；与 $z$ 轴交于 $z = \\pm 1$。它的半轴为 $2$、$3$、$1$，这个曲面就是把球面沿三个坐标轴分别按这些倍数伸缩得到的。\n\n检验：$(2, 0, 0)$ 给出 $\\frac{4}{4} + 0 + 0 = 1$，$(0, 3, 0)$ 给出 $\\frac{9}{9} = 1$。\n\n本课我们由方程读出椭球面的截距和半轴，并用它们求体积。",
  ),
  prerequisites: ["level-surfaces"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "intercepts-and-semi-axes-of-ellipsoids",
      title: t("Intercepts and semi-axes of ellipsoids", "椭球面的截距与半轴长"),
      explanation: t(
        "Setting two of the coordinates to zero shows where the ellipsoid crosses each axis, and those crossing distances are the semi axes. For the ellipsoid $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} + \\frac{z^2}{c^2} = 1$, the semi-axes lengths are $a, b, c$. The positive $x$-intercept occurs at $(a, 0, 0)$.\n\nFor $4x^2 + y^2 + z^2 = 16$, setting $y = z = 0$ gives $4x^2 = 16$, so the positive $x$-intercept is $2$.\n\n> **Watch out.** The intercept is the square root of the denominator: $\\frac{x^2}{25}$ gives $5$, not $25$. Use the denominator under $x^2$ for the $x$-intercept.",
        "令其中两个坐标为零，就能看出椭球面与各坐标轴的交点，这些交点到原点的距离就是半轴长。对于椭球面 $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} + \\frac{z^2}{c^2} = 1$，其半轴长分别为 $a, b, c$。正 $x$ 截距点位于 $(a, 0, 0)$。\n\n对 $4x^2 + y^2 + z^2 = 16$，令 $y = z = 0$ 得 $4x^2 = 16$，所以正 $x$ 截距是 $2$。\n\n> **注意。** 截距是分母的平方根：$\\frac{x^2}{25}$ 给出 $5$，不是 $25$。求 $x$ 截距要用 $x^2$ 下面的分母。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const c = rng.int(2, 9);
        const eq = `\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} + \\frac{z^2}{${c * c}} = 1`;
        return numberProblem({
          prompt: t(`Find the positive $x$-intercept of the ellipsoid $${eq}$.`, `求椭球面 $${eq}$ 的正 $x$ 截距。`),
          answer: a,
          mistakes: distinct(a, [
            why(a * a, `$x^2 = ${a * a}$, so take the square root: $x = ${a}$.`, `$x^2 = ${a * a}$，所以要开平方：$x = ${a}$。`),
            why(
              b,
              `$${b}$ comes from the denominator under $y^2$: it is the $y$-intercept.`,
              `$${b}$ 来自 $y^2$ 下面的分母：它是 $y$ 截距。`,
            ),
            why(
              c,
              `$${c}$ comes from the denominator under $z^2$: it is the $z$-intercept.`,
              `$${c}$ 来自 $z^2$ 下面的分母：它是 $z$ 截距。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Set y = 0 and z = 0", "令 y = 0，z = 0"],
                t(`$\\frac{x^2}{${a * a}} = 1$, so $x^2 = ${a * a}$.`, `$\\frac{x^2}{${a * a}} = 1$，所以 $x^2 = ${a * a}$。`),
              ],
              [["Take the positive root", "取正根"], t(`$x = ${a}$.`, `$x = ${a}$。`)],
            ],
            t(
              `$(${a}, 0, 0)$ gives $\\frac{${a * a}}{${a * a}} + 0 + 0 = 1$.`,
              `$(${a}, 0, 0)$ 给出 $\\frac{${a * a}}{${a * a}} + 0 + 0 = 1$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-volume-of-an-ellipsoid",
      figure: multivariableDrawings2["ellipsoids#the-volume-of-an-ellipsoid"],
      title: t("The volume of an ellipsoid", "椭球的体积"),
      explanation: t(
        "The ellipsoid $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} + \\frac{z^2}{c^2} = 1$ is a unit sphere stretched by $a$, $b$ and $c$ along the three axes. Stretching multiplies volume by $abc$, so the enclosed volume is\n\n$$V = \\frac{4}{3}\\pi abc.$$\n\nFor $\\frac{x^2}{4} + \\frac{y^2}{9} + z^2 = 1$ the semi-axes are $2$, $3$ and $1$, so $V = \\frac{4}{3}\\pi \\cdot 6 = 8\\pi$.\n\n> **Watch out.** Read the semi-axes as the square roots of the denominators, not the denominators themselves. The factor is $\\frac{4}{3}$, as for a sphere.",
        "椭球 $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} + \\frac{z^2}{c^2} = 1$ 是单位球沿三个坐标轴分别伸缩 $a$、$b$、$c$ 倍得到的。伸缩使体积乘以 $abc$，所以所围体积为\n\n$$V = \\frac{4}{3}\\pi abc.$$\n\n对 $\\frac{x^2}{4} + \\frac{y^2}{9} + z^2 = 1$，半轴为 $2$、$3$、$1$，所以 $V = \\frac{4}{3}\\pi \\cdot 6 = 8\\pi$。\n\n> **注意。** 半轴长是分母的平方根，而不是分母本身。系数是 $\\frac{4}{3}$，与球相同。",
      ),
      generate(rng: Rng): Problem {
        const [a, b, c] = [rng.int(2, 7), rng.int(2, 7), rng.int(2, 7)];
        const ans = Q.of(4 * a * b * c, 3);
        return numberProblem({
          prompt: t(
            `The volume enclosed by $\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} + \\frac{z^2}{${c * c}} = 1$ is $k\\pi$. Find $k$.`,
            `$\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} + \\frac{z^2}{${c * c}} = 1$ 所围体积为 $k\\pi$。求 $k$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(4 * a * a * b * b * c * c, 3),
              `The semi-axes are the square roots of the denominators, $${a}$, $${b}$ and $${c}$.`,
              `半轴是分母的平方根，即 $${a}$、$${b}$、$${c}$。`,
            ),
            why(
              Q.of(a * b * c),
              "The volume keeps the factor $\\frac{4}{3}$ of a sphere's volume.",
              "体积要保留球体积中的系数 $\\frac{4}{3}$。",
            ),
            why(
              Q.of(4 * a * b * c),
              "The factor is $\\frac{4}{3}$, not $4$; $4\\pi r^2$ is the area of a sphere.",
              "系数是 $\\frac{4}{3}$，不是 $4$；$4\\pi r^2$ 是球的表面积。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Read the semi-axes", "读出半轴"],
                t(
                  `$\\sqrt{${a * a}} = ${a}$, $\\sqrt{${b * b}} = ${b}$, $\\sqrt{${c * c}} = ${c}$.`,
                  `$\\sqrt{${a * a}} = ${a}$，$\\sqrt{${b * b}} = ${b}$，$\\sqrt{${c * c}} = ${c}$。`,
                ),
              ],
              [
                ["Apply the volume formula", "代入体积公式"],
                t(
                  `$V = \\frac{4}{3}\\pi \\cdot ${a} \\cdot ${b} \\cdot ${c} = ${ans.toLatex()}\\pi$, so $k = ${ans.toLatex()}$.`,
                  `$V = \\frac{4}{3}\\pi \\cdot ${a} \\cdot ${b} \\cdot ${c} = ${ans.toLatex()}\\pi$，所以 $k = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The ellipsoid is the unit ball, of volume $\\frac{4}{3}\\pi$, stretched by $${a}$, $${b}$ and $${c}$, which multiplies the volume by $${a * b * c}$: $\\frac{4}{3} \\cdot ${a * b * c} = ${ans.toLatex()}$.`,
              `椭球是体积为 $\\frac{4}{3}\\pi$ 的单位球沿三轴伸缩 $${a}$、$${b}$、$${c}$ 倍得到的，体积乘以 $${a * b * c}$：$\\frac{4}{3} \\cdot ${a * b * c} = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** hyperboloids distinguishes hyperboloids of one sheet and two sheets. */
export const hyperboloids: TopicDef = {
  id: "hyperboloids",
  title: t("Hyperboloids", "双曲面"),
  summary: t(
    "A hyperboloid of one sheet has one minus sign in its standard equation, while a hyperboloid of two sheets has two minus signs.",
    "单叶双曲面的标准方程中含有一个负号，而双叶双曲面的标准方程中含有两个负号。",
  ),
  intro: t(
    "The surface $x^2 + y^2 - \\frac{z^2}{4} = 1$ has one minus sign. The plane $z = h$ cuts it in the circle $x^2 + y^2 = 1 + \\frac{h^2}{4}$, which exists for every $h$, so the surface is one connected piece: a hyperboloid of one sheet. The surface $-x^2 - y^2 + \\frac{z^2}{4} = 1$ has two minus signs, and needs $\\frac{z^2}{4} \\ge 1$, so it has no points with $|z| < 2$: a hyperboloid of two sheets.\n\nCheck: $(1, 0, 0)$ lies on the first surface, since $1 + 0 - 0 = 1$, and not on the second, since $-1 \\ne 1$; $(0, 0, 2)$ lies on the second.\n\nIn this lesson we tell the two kinds of hyperboloid apart by their signs and find the ellipses in which horizontal planes cut them.",
    "曲面 $x^2 + y^2 - \\frac{z^2}{4} = 1$ 有一个负号。平面 $z = h$ 截它得圆 $x^2 + y^2 = 1 + \\frac{h^2}{4}$，对每个 $h$ 都存在，所以曲面连成一片：单叶双曲面。曲面 $-x^2 - y^2 + \\frac{z^2}{4} = 1$ 有两个负号，要求 $\\frac{z^2}{4} \\ge 1$，所以没有满足 $|z| < 2$ 的点：双叶双曲面。\n\n检验：$(1, 0, 0)$ 在第一个曲面上，因为 $1 + 0 - 0 = 1$；它不在第二个曲面上，因为 $-1 \\ne 1$；$(0, 0, 2)$ 在第二个曲面上。\n\n本课我们由符号区分两种双曲面，并求水平面截它们所得的椭圆。",
  ),
  prerequisites: ["ellipsoids"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "counting-sheets-of-hyperboloids",
      title: t("Counting sheets of hyperboloids", "判断双曲面的叶数"),
      explanation: t(
        "Standard equations for hyperboloids:\n\n- **One sheet**: $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} - \\frac{z^2}{c^2} = 1$ (one minus sign, connected surface).\n- **Two sheets**: $-\\frac{x^2}{a^2} - \\frac{y^2}{b^2} + \\frac{z^2}{c^2} = 1$ (two minus signs, two disconnected pieces).\n\nThe surface $\\frac{x^2}{4} - y^2 - z^2 = 1$ has two minus signs, so it has two sheets; they open along the $x$-axis, the axis of the positive term, with no points where $|x| < 2$.\n\n> **Watch out.** Count the minus signs with the equation written as $= 1$, not $= -1$. The number of sheets equals the number of minus signs.",
        "双曲面的标准方程：\n\n- **单叶双曲面**：$\\frac{x^2}{a^2} + \\frac{y^2}{b^2} - \\frac{z^2}{c^2} = 1$（一个负号，连通曲面）。\n- **双叶双曲面**：$-\\frac{x^2}{a^2} - \\frac{y^2}{b^2} + \\frac{z^2}{c^2} = 1$（两个负号，两个不相连的分支）。\n\n曲面 $\\frac{x^2}{4} - y^2 - z^2 = 1$ 有两个负号，所以有两叶；它们沿正项所在的 $x$ 轴张开，没有满足 $|x| < 2$ 的点。\n\n> **注意。** 数负号时方程要写成 $= 1$，而不是 $= -1$。叶数等于负号的个数。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 6);
        const b = rng.int(2, 6);
        const c = rng.int(2, 6);
        const twoSheets = rng.bool();
        const ans = twoSheets ? 2 : 1;
        const eq = twoSheets
          ? `-\\frac{x^2}{${a * a}} - \\frac{y^2}{${b * b}} + \\frac{z^2}{${c * c}} = 1`
          : `\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} - \\frac{z^2}{${c * c}} = 1`;
        return numberProblem({
          prompt: t(`Determine the number of sheets (1 or 2) of the hyperboloid $${eq}$.`, `判断双曲面 $${eq}$ 的叶数（1 或 2）。`),
          answer: ans,
          mistakes: distinct(ans, [
            twoSheets
              ? why(
                  1,
                  `With two minus signs the equation needs $\\frac{z^2}{${c * c}} \\ge 1$, so there is a gap around $z = 0$ and two pieces.`,
                  `有两个负号时方程要求 $\\frac{z^2}{${c * c}} \\ge 1$，所以 $z = 0$ 附近有空隙，分成两片。`,
                )
              : why(
                  2,
                  "With one minus sign every horizontal plane cuts the surface in an ellipse, so it is one piece.",
                  "只有一个负号时每个水平面都截曲面得一椭圆，所以它是一整片。",
                ),
            why(
              0,
              twoSheets
                ? `The surface is not empty: $(0, 0, ${c})$ satisfies the equation.`
                : `The surface is not empty: $(${a}, 0, 0)$ satisfies the equation.`,
              twoSheets ? `该曲面不是空的：$(0, 0, ${c})$ 满足方程。` : `该曲面不是空的：$(${a}, 0, 0)$ 满足方程。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Count the minus signs", "数负号"],
                t(
                  `With the equation equal to $1$, ${twoSheets ? "two squares have" : "one square has"} a minus sign.`,
                  `方程右边为 $1$ 时，有${twoSheets ? "两个" : "一个"}平方项带负号。`,
                ),
              ],
              [
                ["Read the number of sheets", "读出叶数"],
                t(
                  twoSheets ? "Two minus signs: a hyperboloid of $2$ sheets." : "One minus sign: a hyperboloid of $1$ sheet.",
                  twoSheets ? "两个负号：双叶双曲面，$2$ 叶。" : "一个负号：单叶双曲面，$1$ 叶。",
                ),
              ],
            ],
            twoSheets
              ? t(
                  `At $z = 0$ the equation reads $-\\frac{x^2}{${a * a}} - \\frac{y^2}{${b * b}} = 1$, which no point satisfies, so the surface misses the plane $z = 0$ and has a piece on each side.`,
                  `在 $z = 0$ 处方程为 $-\\frac{x^2}{${a * a}} - \\frac{y^2}{${b * b}} = 1$，没有点满足，所以曲面与平面 $z = 0$ 不相交，两侧各有一片。`,
                )
              : t(
                  `Every plane $z = h$ cuts the surface in the ellipse $\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} = 1 + \\frac{h^2}{${c * c}}$, so the surface is one connected piece.`,
                  `每个平面 $z = h$ 都截曲面得椭圆 $\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} = 1 + \\frac{h^2}{${c * c}}$，所以曲面连成一片。`,
                ),
          ),
        });
      },
    },
    {
      id: "horizontal-traces-of-a-hyperboloid-of-one-sheet",
      title: t("Horizontal traces of a hyperboloid of one sheet", "单叶双曲面的水平截线"),
      explanation: t(
        "Cutting $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} - \\frac{z^2}{c^2} = 1$ with the plane $z = h$ gives\n\n$$\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1 + \\frac{h^2}{c^2},$$\n\nan ellipse for every $h$. The traces are smallest at $h = 0$ and grow as $|h|$ grows, which is why a hyperboloid of one sheet looks like a cooling tower. The semi-axis along $x$ satisfies $s_x^2 = a^2\\left(1 + \\frac{h^2}{c^2}\\right)$.\n\nFor $\\frac{x^2}{4} + \\frac{y^2}{9} - z^2 = 1$ at $z = 2$, $s_x^2 = 4(1 + 4) = 20$.\n\n> **Watch out.** Moving $-\\frac{h^2}{c^2}$ to the right side makes it $+\\frac{h^2}{c^2}$, so the traces grow with $|h|$. Keep the $1$: at $h = 0$ the semi-axis is $a$, not $0$.",
        "用平面 $z = h$ 截 $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} - \\frac{z^2}{c^2} = 1$ 得\n\n$$\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1 + \\frac{h^2}{c^2},$$\n\n对每个 $h$ 都是椭圆。截线在 $h = 0$ 时最小，随 $|h|$ 增大而增大，所以单叶双曲面看起来像冷却塔。沿 $x$ 方向的半轴满足 $s_x^2 = a^2\\left(1 + \\frac{h^2}{c^2}\\right)$。\n\n对 $\\frac{x^2}{4} + \\frac{y^2}{9} - z^2 = 1$ 在 $z = 2$ 处，$s_x^2 = 4(1 + 4) = 20$。\n\n> **注意。** 把 $-\\frac{h^2}{c^2}$ 移到右边变成 $+\\frac{h^2}{c^2}$，所以截线随 $|h|$ 增大。要保留 $1$：$h = 0$ 时半轴是 $a$，不是 $0$。",
      ),
      generate(rng: Rng): Problem {
        const [a, b, c] = [rng.int(2, 6), rng.int(2, 6), rng.int(2, 5)];
        const h = rng.int(1, 6) * rng.pick([-1, 1]);
        const ans = Q.of(a * a * (c * c + h * h), c * c);
        return numberProblem({
          prompt: t(
            `The plane $z = ${h}$ cuts $\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} - \\frac{z^2}{${c * c}} = 1$ in an ellipse. Find the square of its semi-axis along $x$.`,
            `平面 $z = ${h}$ 截 $\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} - \\frac{z^2}{${c * c}} = 1$ 得一椭圆。求它沿 $x$ 方向的半轴长的平方。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(a * a * (c * c - h * h), c * c),
              `Moving $-\\frac{z^2}{${c * c}}$ to the right side makes it $+\\frac{${h * h}}{${c * c}}$.`,
              `把 $-\\frac{z^2}{${c * c}}$ 移到右边变成 $+\\frac{${h * h}}{${c * c}}$。`,
            ),
            why(
              Q.of(a * a),
              `That is the trace at $z = 0$; at $z = ${h}$ the right side is $1 + \\frac{${h * h}}{${c * c}}$.`,
              `这是 $z = 0$ 处的截线；在 $z = ${h}$ 处右边是 $1 + \\frac{${h * h}}{${c * c}}$。`,
            ),
            why(
              Q.of(a * a * h * h, c * c),
              "The right side keeps the $1$ of the equation as well as the term from $z$.",
              "右边除了来自 $z$ 的项，还要保留方程中的 $1$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Substitute the height", "代入高度"],
                t(
                  `At $z = ${h}$: $\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} = 1 + \\frac{${h * h}}{${c * c}} = \\frac{${c * c + h * h}}{${c * c}}$.`,
                  `在 $z = ${h}$ 处：$\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} = 1 + \\frac{${h * h}}{${c * c}} = \\frac{${c * c + h * h}}{${c * c}}$。`,
                ),
              ],
              [
                ["Set y = 0", "令 y = 0"],
                t(
                  `$s_x^2 = ${a * a} \\cdot \\frac{${c * c + h * h}}{${c * c}} = ${ans.toLatex()}$.`,
                  `$s_x^2 = ${a * a} \\cdot \\frac{${c * c + h * h}}{${c * c}} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The point $(s_x, 0, ${h})$ lies on the surface: $\\frac{${ans.toLatex()}}{${a * a}} - \\frac{${h * h}}{${c * c}} = \\frac{${c * c + h * h}}{${c * c}} - \\frac{${h * h}}{${c * c}} = 1$.`,
              `点 $(s_x, 0, ${h})$ 在曲面上：$\\frac{${ans.toLatex()}}{${a * a}} - \\frac{${h * h}}{${c * c}} = \\frac{${c * c + h * h}}{${c * c}} - \\frac{${h * h}}{${c * c}} = 1$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** paraboloids covers elliptic and hyperbolic paraboloids. */
export const paraboloids: TopicDef = {
  id: "paraboloids",
  title: t("Paraboloids", "抛物面"),
  summary: t(
    "An elliptic paraboloid has equation z/c = x²/a² + y²/b², while a hyperbolic paraboloid (saddle) has equation z/c = x²/a² - y²/b².",
    "椭圆抛物面的方程为 z/c = x²/a² + y²/b²，而双曲抛物面（马鞍面）的方程为 z/c = x²/a² - y²/b²。",
  ),
  intro: t(
    "On $z = x^2 + 4y^2$ the plane $z = 4$ cuts out $x^2 + 4y^2 = 4$, the ellipse $\\frac{x^2}{4} + y^2 = 1$, and the plane $y = 0$ cuts out the parabola $z = x^2$: the surface is a bowl, an elliptic paraboloid. On $z = x^2 - y^2$ the trace in $y = 0$ is $z = x^2$, opening up, and the trace in $x = 0$ is $z = -y^2$, opening down: a saddle, a hyperbolic paraboloid.\n\nCheck: $(2, 0, 4)$ lies on the bowl, since $4 + 0 = 4$, and so does $(0, 1, 4)$, since $0 + 4 = 4$.\n\nIn this lesson we tell elliptic and hyperbolic paraboloids apart and measure their horizontal traces.",
    "在 $z = x^2 + 4y^2$ 上，平面 $z = 4$ 截出 $x^2 + 4y^2 = 4$，即椭圆 $\\frac{x^2}{4} + y^2 = 1$；平面 $y = 0$ 截出抛物线 $z = x^2$：曲面是碗形，即椭圆抛物面。在 $z = x^2 - y^2$ 上，$y = 0$ 中的截线是开口向上的 $z = x^2$，$x = 0$ 中的截线是开口向下的 $z = -y^2$：马鞍形，即双曲抛物面。\n\n检验：$(2, 0, 4)$ 在碗形曲面上，因为 $4 + 0 = 4$；$(0, 1, 4)$ 也在，因为 $0 + 4 = 4$。\n\n本课我们区分椭圆抛物面与双曲抛物面，并度量它们的水平截线。",
  ),
  prerequisites: ["hyperboloids"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "classifying-paraboloids",
      figure: multivariableDrawings2["paraboloids#classifying-paraboloids"],
      title: t("Classifying paraboloids", "分类抛物面"),
      explanation: t(
        "Paraboloids feature one linear variable (usually $z$) and two quadratic variables:\n\n- **Elliptic paraboloid**: $z = \\frac{x^2}{a^2} + \\frac{y^2}{b^2}$ (bowl-shaped, traces are ellipses and parabolas).\n- **Hyperbolic paraboloid**: $z = \\frac{x^2}{a^2} - \\frac{y^2}{b^2}$ (saddle-shaped, traces are hyperbolas and parabolas).\n\nIn $y = x^2 - z^2$ the variable $y$ appears to the first power and the squares have opposite signs, so the surface is a hyperbolic paraboloid along the $y$-axis.\n\n> **Watch out.** A paraboloid has exactly one variable to the first power; if every variable is squared, the surface is an ellipsoid, a hyperboloid or a cone instead. Compare the signs of the two squares on the same side of the equation.",
        "抛物面的特征是包含一个一次变量（通常为 $z$）和两个二次变量：\n\n- **椭圆抛物面**：$z = \\frac{x^2}{a^2} + \\frac{y^2}{b^2}$（碗状，截痕为椭圆与抛物线）。\n- **双曲抛物面**：$z = \\frac{x^2}{a^2} - \\frac{y^2}{b^2}$（马鞍状，截痕为双曲线与抛物线）。\n\n在 $y = x^2 - z^2$ 中，变量 $y$ 以一次方出现，两个平方项异号，所以该曲面是沿 $y$ 轴的双曲抛物面。\n\n> **注意。** 抛物面恰有一个变量以一次方出现；若每个变量都是平方，曲面就是椭球面、双曲面或锥面。要在方程同一边比较两个平方项的符号。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 6);
        const b = rng.int(2, 6);
        const isElliptic = rng.bool();
        const eq = isElliptic ? `z = \\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}}` : `z = \\frac{x^2}{${a * a}} - \\frac{y^2}{${b * b}}`;
        const right = isElliptic ? t("Elliptic paraboloid", "椭圆抛物面") : t("Hyperbolic paraboloid", "双曲抛物面");
        const linear = t("$z$ appears only to the first power, while this surface has $z^2$", "$z$ 只以一次方出现，而这种曲面含 $z^2$");
        const wrong = isElliptic
          ? [
              {
                option: t("Hyperbolic paraboloid", "双曲抛物面"),
                why: t("The two squares have the same sign, not opposite signs.", "两个平方项同号，不是异号。"),
              },
              { option: t("Ellipsoid", "椭球面"), why: t(`${linear.en}.`, `${linear["zh-CN"]}。`) },
              { option: t("Elliptic cone", "椭圆锥面"), why: t(`${linear.en}.`, `${linear["zh-CN"]}。`) },
            ]
          : [
              {
                option: t("Elliptic paraboloid", "椭圆抛物面"),
                why: t("The two squares have opposite signs, not the same sign.", "两个平方项异号，不是同号。"),
              },
              { option: t("Hyperboloid of one sheet", "单叶双曲面"), why: t(`${linear.en}.`, `${linear["zh-CN"]}。`) },
              { option: t("Elliptic cone", "椭圆锥面"), why: t(`${linear.en}.`, `${linear["zh-CN"]}。`) },
            ];
        return explainedChoice(rng, {
          prompt: t(`Classify the quadric surface defined by the equation $${eq}$.`, `对由方程 $${eq}$ 定义的二次曲面进行分类。`),
          correct: right,
          wrong,
          solution: walked(
            [
              [
                ["Find the linear variable", "找出一次变量"],
                t("$z$ appears to the first power, so the surface is a paraboloid.", "$z$ 以一次方出现，所以曲面是抛物面。"),
              ],
              [
                ["Compare the signs of the squares", "比较平方项的符号"],
                t(
                  `$x^2$ and $y^2$ have ${isElliptic ? "the same sign" : "opposite signs"}, so it is ${isElliptic ? "an elliptic" : "a hyperbolic"} paraboloid.`,
                  `$x^2$ 与 $y^2$ ${isElliptic ? "同号" : "异号"}，所以它是${right["zh-CN"]}。`,
                ),
              ],
            ],
            isElliptic
              ? t(
                  `Both squares are at least $0$, so $z \\ge 0$ everywhere and the plane $z = 1$ cuts out the ellipse $\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} = 1$: a bowl opening upward.`,
                  `两个平方项都不小于 $0$，所以处处 $z \\ge 0$，平面 $z = 1$ 截出椭圆 $\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} = 1$：开口向上的碗。`,
                )
              : t(
                  `Along the $x$-axis $z = \\frac{x^2}{${a * a}}$ rises and along the $y$-axis $z = -\\frac{y^2}{${b * b}}$ falls: a saddle at the origin.`,
                  `沿 $x$ 轴 $z = \\frac{x^2}{${a * a}}$ 上升，沿 $y$ 轴 $z = -\\frac{y^2}{${b * b}}$ 下降：原点处是马鞍形。`,
                ),
          ),
        });
      },
    },
    {
      id: "the-area-of-a-trace-of-an-elliptic-paraboloid",
      title: t("The area of a trace of an elliptic paraboloid", "椭圆抛物面截线所围面积"),
      explanation: t(
        "The plane $z = h$ with $h > 0$ cuts the elliptic paraboloid $z = \\frac{x^2}{a^2} + \\frac{y^2}{b^2}$ in the ellipse\n\n$$\\frac{x^2}{a^2 h} + \\frac{y^2}{b^2 h} = 1,$$\n\nwhose semi-axes are $a\\sqrt{h}$ and $b\\sqrt{h}$. An ellipse with semi-axes $p$ and $q$ encloses area $\\pi pq$, so this trace encloses $\\pi abh$. The area grows linearly with the height, not with its square.\n\nFor $z = x^2 + \\frac{y^2}{4}$ at $z = 9$ the semi-axes are $3$ and $6$, so the area is $18\\pi$.\n\n> **Watch out.** The semi-axes are $a\\sqrt{h}$ and $b\\sqrt{h}$, not $ah$ and $bh$, so the area is $\\pi abh$, not $\\pi abh^2$. Use $a$ and $b$, the square roots of the denominators.",
        "平面 $z = h$（$h > 0$）截椭圆抛物面 $z = \\frac{x^2}{a^2} + \\frac{y^2}{b^2}$ 得椭圆\n\n$$\\frac{x^2}{a^2 h} + \\frac{y^2}{b^2 h} = 1,$$\n\n其半轴为 $a\\sqrt{h}$ 和 $b\\sqrt{h}$。半轴为 $p$、$q$ 的椭圆所围面积为 $\\pi pq$，所以这条截线所围面积为 $\\pi abh$。面积随高度线性增长，而不是随高度的平方增长。\n\n对 $z = x^2 + \\frac{y^2}{4}$ 在 $z = 9$ 处，半轴为 $3$ 和 $6$，所以面积为 $18\\pi$。\n\n> **注意。** 半轴是 $a\\sqrt{h}$ 和 $b\\sqrt{h}$，不是 $ah$ 和 $bh$，所以面积是 $\\pi abh$，不是 $\\pi abh^2$。要用分母的平方根 $a$ 和 $b$。",
      ),
      generate(rng: Rng): Problem {
        const [a, b] = [rng.int(2, 6), rng.int(2, 6)];
        const h = rng.int(2, 9);
        const rt = Math.sqrt(h);
        const axis = (m: number): string => (Number.isInteger(rt) ? String(m * rt) : `${m}\\sqrt{${h}}`);
        const ans = a * b * h;
        return numberProblem({
          prompt: t(
            `The plane $z = ${h}$ cuts $z = \\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}}$ in an ellipse enclosing area $k\\pi$. Find $k$.`,
            `平面 $z = ${h}$ 截 $z = \\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}}$ 得一椭圆，其所围面积为 $k\\pi$。求 $k$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              a * b * h * h,
              `The semi-axes are $${axis(a)}$ and $${axis(b)}$, which grow with $\\sqrt{${h}}$, not with $${h}$.`,
              `半轴是 $${axis(a)}$ 和 $${axis(b)}$，随 $\\sqrt{${h}}$ 增长，而不是随 $${h}$。`,
            ),
            why(
              a * a * b * b * h,
              `The semi-axes are the square roots of $${a * a * h}$ and $${b * b * h}$, so their product is $${a} \\cdot ${b} \\cdot ${h}$.`,
              `半轴是 $${a * a * h}$ 与 $${b * b * h}$ 的平方根，所以乘积是 $${a} \\cdot ${b} \\cdot ${h}$。`,
            ),
            why(
              a * b,
              `That is the trace at $z = 1$; at $z = ${h}$ both semi-axes are multiplied by $\\sqrt{${h}}$.`,
              `这是 $z = 1$ 处的截线；在 $z = ${h}$ 处两条半轴都要乘以 $\\sqrt{${h}}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Write the trace", "写出截线"],
                t(
                  `$\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} = ${h}$, that is, $\\frac{x^2}{${a * a * h}} + \\frac{y^2}{${b * b * h}} = 1$, with semi-axes $${axis(a)}$ and $${axis(b)}$.`,
                  `$\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} = ${h}$，即 $\\frac{x^2}{${a * a * h}} + \\frac{y^2}{${b * b * h}} = 1$，半轴为 $${axis(a)}$ 和 $${axis(b)}$。`,
                ),
              ],
              [
                ["Find the area", "求面积"],
                t(
                  `$\\pi \\cdot ${axis(a)} \\cdot ${axis(b)} = ${ans}\\pi$, so $k = ${ans}$.`,
                  `$\\pi \\cdot ${axis(a)} \\cdot ${axis(b)} = ${ans}\\pi$，所以 $k = ${ans}$。`,
                ),
              ],
            ],
            t(
              `The trace at $z = 1$ has semi-axes $${a}$ and $${b}$ and area $${a * b}\\pi$; raising the plane to $z = ${h}$ multiplies each semi-axis by $\\sqrt{${h}}$ and the area by $${h}$, giving $${ans}\\pi$.`,
              `$z = 1$ 处的截线半轴为 $${a}$ 和 $${b}$，面积为 $${a * b}\\pi$；把平面升到 $z = ${h}$，每条半轴乘以 $\\sqrt{${h}}$，面积乘以 $${h}$，得 $${ans}\\pi$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** ellipticCones examines cone equations and horizontal traces. */
export const ellipticCones: TopicDef = {
  id: "elliptic-cones",
  title: t("Elliptic Cones", "椭圆锥面"),
  summary: t(
    "An elliptic cone has standard equation z²/c² = x²/a² + y²/b², with horizontal traces being ellipses and vertical traces being intersecting lines.",
    "椭圆锥面的标准方程为 z²/c² = x²/a² + y²/b²，其水平截痕为椭圆，通过顶点的垂直截痕为相交直线。",
  ),
  intro: t(
    "On the cone $z^2 = x^2 + \\frac{y^2}{4}$ the plane $z = 2$ cuts out $x^2 + \\frac{y^2}{4} = 4$, that is, $\\frac{x^2}{4} + \\frac{y^2}{16} = 1$, an ellipse with semi-axes $2$ and $4$. The plane $x = 0$ cuts out $z^2 = \\frac{y^2}{4}$, the two lines $z = \\pm\\frac{y}{2}$ crossing at the vertex.\n\nCheck: $(2, 0, 2)$ lies on the cone, since $4 = 4 + 0$, and so does $(0, 4, 2)$, since $4 = 0 + \\frac{16}{4}$.\n\nIn this lesson we find the horizontal traces of an elliptic cone and decide which lines through its vertex lie on it.",
    "在锥面 $z^2 = x^2 + \\frac{y^2}{4}$ 上，平面 $z = 2$ 截出 $x^2 + \\frac{y^2}{4} = 4$，即 $\\frac{x^2}{4} + \\frac{y^2}{16} = 1$，这是半轴为 $2$ 和 $4$ 的椭圆。平面 $x = 0$ 截出 $z^2 = \\frac{y^2}{4}$，即在顶点相交的两条直线 $z = \\pm\\frac{y}{2}$。\n\n检验：$(2, 0, 2)$ 在锥面上，因为 $4 = 4 + 0$；$(0, 4, 2)$ 也在，因为 $4 = 0 + \\frac{16}{4}$。\n\n本课我们求椭圆锥面的水平截线，并判断过顶点的哪些直线落在锥面上。",
  ),
  prerequisites: ["paraboloids"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "analyzing-traces-of-elliptic-cones",
      figure: multivariableDrawings2["elliptic-cones#analyzing-traces-of-elliptic-cones"],
      title: t("Analyzing traces of elliptic cones", "分析椭圆锥面的截痕"),
      explanation: t(
        "Slicing a surface with a plane shows its cross sections; for a cone, horizontal slices are ellipses that grow as the plane moves away from the vertex. For the cone $z^2 = \\frac{x^2}{a^2} + \\frac{y^2}{b^2}$, intersecting with horizontal planes $z = k$ yields the ellipse $\\frac{x^2}{(ak)^2} + \\frac{y^2}{(bk)^2} = 1$ with semi-axes $a|k|$ and $b|k|$.\n\nFor $z^2 = 4x^2 + y^2$ at $z = 3$, $4x^2 + y^2 = 9$, so the semi-axis along $x$ is $\\frac{3}{2}$ and the one along $y$ is $3$.\n\n> **Watch out.** Divide by $k^2$ to reach the standard form, and then take square roots: the semi-axis is $a|k|$, not $a^2k^2$. It grows in proportion to the height, unlike the trace of a paraboloid.",
        "用平面截曲面可以看到它的截面；对于锥面，水平截面是椭圆，平面离顶点越远，椭圆越大。对于椭圆锥面 $z^2 = \\frac{x^2}{a^2} + \\frac{y^2}{b^2}$，与水平面 $z = k$ 相交得到椭圆 $\\frac{x^2}{(ak)^2} + \\frac{y^2}{(bk)^2} = 1$，其半轴长分别为 $a|k|$ 和 $b|k|$。\n\n对 $z^2 = 4x^2 + y^2$ 在 $z = 3$ 处，$4x^2 + y^2 = 9$，所以沿 $x$ 方向的半轴是 $\\frac{3}{2}$，沿 $y$ 方向的是 $3$。\n\n> **注意。** 先除以 $k^2$ 化成标准形式，再开平方：半轴是 $a|k|$，不是 $a^2k^2$。它与高度成正比，这一点与抛物面的截线不同。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 6);
        const b = rng.int(2, 6);
        const k = rng.int(2, 5);
        const ans = a * k;
        const cone = `z^2 = \\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}}`;
        return numberProblem({
          prompt: t(
            `Find the length of the semi-axis in the $x$-direction of the elliptical trace of the cone $${cone}$ at the plane $z = ${k}$.`,
            `求椭圆锥面 $${cone}$ 与平面 $z = ${k}$ 相交所得椭圆截痕在 $x$ 方向的半轴长。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              a,
              `$${a}$ is the semi-axis at $z = 1$; at $z = ${k}$ it is multiplied by $${k}$.`,
              `$${a}$ 是 $z = 1$ 处的半轴；在 $z = ${k}$ 处要乘以 $${k}$。`,
            ),
            why(
              k,
              `The height alone is not the semi-axis: the denominator $${a * a}$ stretches the trace by $${a}$ along $x$.`,
              `高度本身不是半轴：分母 $${a * a}$ 使截线沿 $x$ 方向伸长 $${a}$ 倍。`,
            ),
            why(
              ans * ans,
              `$${ans * ans}$ is the denominator of the standard form; the semi-axis is its square root.`,
              `$${ans * ans}$ 是标准形式中的分母；半轴是它的平方根。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Substitute the height", "代入高度"],
                t(
                  `$\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} = ${k * k}$.`,
                  `$\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} = ${k * k}$。`,
                ),
              ],
              [
                ["Divide by the right side", "除以右边"],
                t(
                  `$\\frac{x^2}{${a * a * k * k}} + \\frac{y^2}{${b * b * k * k}} = 1$, so the semi-axis along $x$ is $\\sqrt{${a * a * k * k}} = ${ans}$.`,
                  `$\\frac{x^2}{${a * a * k * k}} + \\frac{y^2}{${b * b * k * k}} = 1$，所以沿 $x$ 方向的半轴为 $\\sqrt{${a * a * k * k}} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `The point $(${ans}, 0, ${k})$ lies on the cone: $\\frac{${ans * ans}}{${a * a}} = ${k * k} = ${k}^2$.`,
              `点 $(${ans}, 0, ${k})$ 在锥面上：$\\frac{${ans * ans}}{${a * a}} = ${k * k} = ${k}^2$。`,
            ),
          ),
        });
      },
    },
    {
      id: "lines-on-an-elliptic-cone",
      figure: multivariableDrawings2["elliptic-cones#lines-on-an-elliptic-cone"],
      title: t("Lines on an elliptic cone", "椭圆锥面上的直线"),
      explanation: t(
        "The elliptic cone $z^2 = \\frac{x^2}{a^2} + \\frac{y^2}{b^2}$ is made of lines through the origin. The line $(x, y, z) = s(p, q, r)$ lies on the cone exactly when its direction satisfies the equation, because every term scales by $s^2$:\n\n$$r^2 = \\frac{p^2}{a^2} + \\frac{q^2}{b^2}.$$\n\nIf the two sides differ, the line meets the cone only at the origin.\n\nOn the circular cone $z^2 = x^2 + y^2$ the line $s(3, 4, 5)$ lies on the cone, since $25 = 9 + 16$, while $s(1, 1, 1)$ does not, since $1 \\ne 2$.\n\n> **Watch out.** Every line on the cone passes through the vertex, but not every line through the vertex lies on the cone; test the direction. A cone is curved and still contains straight lines.",
        "椭圆锥面 $z^2 = \\frac{x^2}{a^2} + \\frac{y^2}{b^2}$ 由过原点的直线组成。直线 $(x, y, z) = s(p, q, r)$ 恰好在其方向满足方程时落在锥面上，因为每一项都按 $s^2$ 缩放：\n\n$$r^2 = \\frac{p^2}{a^2} + \\frac{q^2}{b^2}.$$\n\n若两边不等，该直线只在原点与锥面相交。\n\n在圆锥面 $z^2 = x^2 + y^2$ 上，直线 $s(3, 4, 5)$ 落在锥面上，因为 $25 = 9 + 16$；而 $s(1, 1, 1)$ 不在，因为 $1 \\ne 2$。\n\n> **注意。** 锥面上的每条直线都过顶点，但过顶点的直线未必在锥面上；要检验方向。锥面是弯曲的，却仍含有直线。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 4);
        const b = rng.int(2, 4);
        const u = rng.int(1, 3);
        const v = rng.int(1, 3);
        const p = a * u * rng.pick([-1, 1]);
        const q = b * v * rng.pick([-1, 1]);
        const r2 = u * u + v * v;
        const on = rng.int(0, 1) === 0;
        const r = Math.sqrt(r2);
        const rLatex = Number.isInteger(r) ? String(r) : `\\sqrt{${r2}}`;
        const rShown = on ? rLatex : Number.isInteger(r) ? String(r + 1) : `\\sqrt{${r2 + 1}}`;
        const rShown2 = on ? r2 : Number.isInteger(r) ? (r + 1) * (r + 1) : r2 + 1;
        const sum = `\\frac{${p * p}}{${a * a}} + \\frac{${q * q}}{${b * b}} = ${r2}`;
        return verdictChoice(rng, {
          prompt: t(
            `Does the line $(x, y, z) = s(${p}, ${q}, ${rShown})$ lie on the cone $z^2 = \\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}}$?`,
            `直线 $(x, y, z) = s(${p}, ${q}, ${rShown})$ 是否在锥面 $z^2 = \\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}}$ 上？`,
          ),
          holds: on,
          yes: t(`$${sum}$ equals the square of the last component, $${rShown2}$`, `$${sum}$ 等于最后一个分量的平方 $${rShown2}$`),
          no: t(`$${sum}$ differs from the square of the last component, $${rShown2}$`, `$${sum}$ 不等于最后一个分量的平方 $${rShown2}$`),
          yesWrong: t("the line passes through the origin, the vertex of the cone", "这条直线过原点，即锥面的顶点"),
          noWrong: t("a cone is curved, so no straight line can lie on it", "锥面是弯曲的，所以没有直线能落在上面"),
          solution: walked(
            [
              [["Put the direction into the right side", "把方向代入右边"], t(`$${sum}$.`, `$${sum}$。`)],
              [
                ["Compare with the last component squared", "与最后一个分量的平方比较"],
                t(
                  `$(${rShown})^2 = ${rShown2}$. ${on ? "They agree, so every point of the line lies on the cone." : "They differ, so the line meets the cone only at the origin."}`,
                  `$(${rShown})^2 = ${rShown2}$。${on ? "两者相等，所以直线上的每个点都在锥面上。" : "两者不等，所以该直线只在原点与锥面相交。"}`,
                ),
              ],
            ],
            on
              ? t(
                  `At $s = 2$ the point $(${2 * p}, ${2 * q}, 2${rShown})$ gives $4 \\cdot ${r2}$ on both sides: every term of the equation is multiplied by $s^2 = 4$.`,
                  `取 $s = 2$，点 $(${2 * p}, ${2 * q}, 2${rShown})$ 使两边都等于 $4 \\cdot ${r2}$：方程的每一项都乘以 $s^2 = 4$。`,
                )
              : t(
                  `At $s = 1$ the point $(${p}, ${q}, ${rShown})$ gives $z^2 = ${rShown2}$ but $\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} = ${r2}$, so it is off the cone.`,
                  `取 $s = 1$，点 $(${p}, ${q}, ${rShown})$ 给出 $z^2 = ${rShown2}$，而 $\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} = ${r2}$，所以它不在锥面上。`,
                ),
          ),
        });
      },
    },
  ],
};

/** cylinders examines surfaces whose defining equations lack one variable. */
export const cylinders: TopicDef = {
  id: "cylinders",
  title: t("Cylinders", "柱面"),
  summary: t(
    "A cylinder is a surface generated by straight lines (rulings) parallel to a given line passing through a given plane curve.",
    "柱面是由平行于定直线且通过定平面曲线的一族平行直线（母线）生成的曲面。",
  ),
  intro: t(
    "In $\\mathbb{R}^3$ the equation $z = y^2$ does not mention $x$. Its trace in the $yz$-plane is the parabola $z = y^2$, and since $x$ is free, that parabola is copied along the whole $x$-axis: the surface is a parabolic cylinder whose rulings are parallel to the $x$-axis.\n\nCheck: $(5, 2, 4)$ and $(-7, 2, 4)$ both satisfy $4 = 2^2$; they lie on the same ruling, the line through $(0, 2, 4)$ parallel to the $x$-axis.\n\nIn this lesson we recognize cylinders from their equations, find the direction of their rulings and locate points on them.",
    "在 $\\mathbb{R}^3$ 中，方程 $z = y^2$ 不含 $x$。它在 $yz$ 平面中的截线是抛物线 $z = y^2$，由于 $x$ 可取任意值，这条抛物线被复制到整个 $x$ 轴方向：该曲面是母线平行于 $x$ 轴的抛物柱面。\n\n检验：$(5, 2, 4)$ 和 $(-7, 2, 4)$ 都满足 $4 = 2^2$；它们在同一条母线上，即过 $(0, 2, 4)$ 且平行于 $x$ 轴的直线。\n\n本课我们由方程识别柱面，求出母线的方向，并找出柱面上的点。",
  ),
  prerequisites: ["elliptic-cones"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "identifying-cylinders-and-their-rulings",
      figure: multivariableDrawings2["cylinders#identifying-cylinders-and-their-rulings"],
      title: t("Identifying cylinders and their rulings", "识别柱面及其母线方向"),
      explanation: t(
        "In $\\mathbb{R}^3$, an equation involving only two of the three variables represents a cylinder whose rulings are parallel to the axis of the missing variable. For example, $x^2 + y^2 = r^2$ has rulings parallel to the $z$-axis.\n\nThe equation $x^2 + 4z^2 = 4$ has no $y$, so it is an elliptic cylinder whose rulings are parallel to the $y$-axis.\n\n> **Watch out.** The rulings run along the axis of the variable that is missing, not of one that appears. In $\\mathbb{R}^3$ an equation such as $x^2 + y^2 = 9$ is a whole cylinder, not a single circle.",
        "在 $\\mathbb{R}^3$ 中，仅包含三个坐标变量中两个变量的方程表示母线平行于缺失变量坐标轴的柱面。例如 $x^2 + y^2 = r^2$ 的母线平行于 $z$ 轴。\n\n方程 $x^2 + 4z^2 = 4$ 不含 $y$，所以它是母线平行于 $y$ 轴的椭圆柱面。\n\n> **注意。** 母线沿缺失变量的坐标轴方向，而不是沿出现在方程中的变量。在 $\\mathbb{R}^3$ 中，$x^2 + y^2 = 9$ 这样的方程是一整个柱面，而不是一个圆。",
      ),
      generate(rng: Rng): Problem {
        const r = rng.int(2, 25);
        const missing = rng.pick(["x", "y", "z"] as const);
        const [u, v] = missing === "z" ? (["x", "y"] as const) : missing === "y" ? (["x", "z"] as const) : (["y", "z"] as const);
        const eq = `${u}^2 + ${v}^2 = ${r * r}`;
        const axis = (w: string) => t(`$${w}$-axis`, `$${w}$ 轴`);
        const appears = (w: string) =>
          t(
            `The equation contains $${w}$, so moving parallel to the $${w}$-axis changes $${w}^2$ and leaves the surface.`,
            `方程含有 $${w}$，所以沿 $${w}$ 轴方向移动会改变 $${w}^2$，从而离开曲面。`,
          );
        const point = (w: number): string =>
          missing === "x" ? `(${w}, ${r}, 0)` : missing === "y" ? `(${r}, ${w}, 0)` : `(${r}, 0, ${w})`;
        return explainedChoice(rng, {
          prompt: t(
            `In $\\mathbb{R}^3$, the surface defined by $${eq}$ is a circular cylinder. The rulings of this cylinder are parallel to which coordinate axis?`,
            `在 $\\mathbb{R}^3$ 中，由方程 $${eq}$ 定义的曲面为圆柱面。该柱面的母线平行于哪个坐标轴？`,
          ),
          correct: axis(missing),
          wrong: [
            { option: axis(u), why: appears(u) },
            { option: axis(v), why: appears(v) },
            {
              option: t(`The line $${v} = ${u}$`, `直线 $${v} = ${u}$`),
              why: t(
                `Along that line both $${u}$ and $${v}$ change; the rulings follow the missing variable $${missing}$.`,
                `沿这条直线 $${u}$ 与 $${v}$ 都在变化；母线沿缺失的变量 $${missing}$ 的方向。`,
              ),
            },
          ],
          solution: walked(
            [
              [
                ["Find the missing variable", "找出缺失的变量"],
                t(
                  `The equation involves only $${u}$ and $${v}$; $${missing}$ is missing.`,
                  `方程只含 $${u}$ 和 $${v}$；缺少 $${missing}$。`,
                ),
              ],
              [
                ["Read the rulings", "读出母线方向"],
                t(
                  `$${missing}$ can take any value, so the circle $${eq}$ is copied along the $${missing}$-axis, and the rulings are parallel to it.`,
                  `$${missing}$ 可取任意值，所以圆 $${eq}$ 沿 $${missing}$ 轴方向被复制，母线平行于 $${missing}$ 轴。`,
                ),
              ],
            ],
            t(
              `$${point(0)}$ and $${point(7)}$ both satisfy the equation, and the segment joining them is parallel to the $${missing}$-axis.`,
              `$${point(0)}$ 与 $${point(7)}$ 都满足方程，连接它们的线段平行于 $${missing}$ 轴。`,
            ),
          ),
        });
      },
    },
    {
      id: "points-on-a-parabolic-cylinder",
      figure: multivariableDrawings2["cylinders#points-on-a-parabolic-cylinder"],
      title: t("Points on a parabolic cylinder", "抛物柱面上的点"),
      explanation: t(
        "An equation in $\\mathbb{R}^3$ that does not mention $z$, such as $y = ax^2 + b$, describes a cylinder: the parabola in the $xy$-plane is copied to every height. So a point $(x, y, z)$ lies on it exactly when $y = ax^2 + b$, whatever $z$ is. Finding the missing coordinate of a point on the surface uses only $x$ and $y$.\n\nOn $z = 3 - x^2$, which does not mention $y$, the point $(1, 5, z)$ has $z = 3 - 1 = 2$, whatever its $y$-coordinate.\n\n> **Watch out.** The missing variable plays no part: do not add it in or put it in place of $x$. Square $x$ before multiplying by $a$; a negative $x$ gives a positive $x^2$.",
        "$\\mathbb{R}^3$ 中不含 $z$ 的方程，例如 $y = ax^2 + b$，描述的是柱面：$xy$ 平面上的抛物线被复制到每个高度。所以点 $(x, y, z)$ 在该曲面上当且仅当 $y = ax^2 + b$，与 $z$ 无关。求曲面上一点所缺的坐标只需用到 $x$ 与 $y$。\n\n在不含 $y$ 的 $z = 3 - x^2$ 上，点 $(1, 5, z)$ 有 $z = 3 - 1 = 2$，与它的 $y$ 坐标无关。\n\n> **注意。** 缺失的变量不起作用：不要把它加进去，也不要用它代替 $x$。先把 $x$ 平方再乘以 $a$；负的 $x$ 平方后为正。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.pick([-3, -2, -1, 1, 2, 3]);
        const b = rng.int(-6, 6);
        const x = rng.int(-4, 4);
        const z = rng.int(-9, 9);
        const y = a * x * x + b;
        const curve = poly([a, "x^2"], [b, ""]);
        const ax2 = a === 1 || x === 0 ? `${a * x * x}` : a === -1 ? `-${x * x}` : `${a} \\cdot ${x * x}`;
        const value = b === 0 ? ax2 : `${ax2} ${b < 0 ? "-" : "+"} ${Math.abs(b)}`;
        return numberProblem({
          prompt: t(
            `The point $(${x}, y, ${z})$ lies on the surface $y = ${curve}$ in $\\mathbb{R}^3$. Find $y$.`,
            `点 $(${x}, y, ${z})$ 在 $\\mathbb{R}^3$ 中的曲面 $y = ${curve}$ 上。求 $y$。`,
          ),
          answer: y,
          mistakes: distinct(y, [
            why(y + z, `The equation does not mention $z$, so $z = ${z}$ is not added in.`, `方程不含 $z$，所以不要把 $z = ${z}$ 加进去。`),
            why(
              a * z * z + b,
              `The square in the equation is of $x$, so use $x = ${x}$, not $z = ${z}$.`,
              `方程中平方的是 $x$，所以要用 $x = ${x}$，而不是 $z = ${z}$。`,
            ),
            why(
              a * x + b,
              `The equation has $x^2$: square $${x}$ to get $${x * x}$ first.`,
              `方程中是 $x^2$：要先把 $${x}$ 平方得 $${x * x}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Notice the missing variable", "注意缺失的变量"],
                t(`The equation does not mention $z$, so $z = ${z}$ plays no role.`, `方程不含 $z$，所以 $z = ${z}$ 不起作用。`),
              ],
              [["Substitute x", "代入 x"], t(`$y = ${value} = ${y}$.`, `$y = ${value} = ${y}$。`)],
            ],
            t(
              `The point $(${x}, ${y}, 0)$ on the parabola in the $xy$-plane has the same $x$ and $y$, and the ruling through it, parallel to the $z$-axis, passes through $(${x}, ${y}, ${z})$.`,
              `$xy$ 平面中抛物线上的点 $(${x}, ${y}, 0)$ 有相同的 $x$ 与 $y$，过它且平行于 $z$ 轴的母线经过 $(${x}, ${y}, ${z})$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** intersectionsOfLinesAndPlanesWithSurfaces computes intersections of surfaces with planes. */
export const intersectionsOfLinesAndPlanesWithSurfaces: TopicDef = {
  id: "intersections-of-lines-and-planes-with-surfaces",
  title: t("Intersections of Lines and Planes With Surfaces", "直线、平面与曲面的交线"),
  summary: t(
    "Intersecting a quadric surface with a coordinate or parallel plane yields a two-dimensional conic section trace.",
    "用坐标平面或平行平面截二次曲面，得到的交线（截痕）为二维圆锥曲线。",
  ),
  intro: t(
    "The plane $z = 1$ cuts the sphere $x^2 + y^2 + z^2 = 9$ where $x^2 + y^2 + 1 = 9$, that is, in the circle $x^2 + y^2 = 8$ of radius $\\sqrt{8} = 2\\sqrt{2}$, centered at $(0, 0, 1)$.\n\nCheck: the point $(2\\sqrt{2}, 0, 1)$ is on that circle and on the sphere, since $8 + 0 + 1 = 9$.\n\nIn this lesson we intersect surfaces with planes and with lines by substituting the plane or the line into the equation of the surface.",
    "平面 $z = 1$ 截球面 $x^2 + y^2 + z^2 = 9$ 于 $x^2 + y^2 + 1 = 9$ 处，即圆心为 $(0, 0, 1)$、半径为 $\\sqrt{8} = 2\\sqrt{2}$ 的圆 $x^2 + y^2 = 8$。\n\n检验：点 $(2\\sqrt{2}, 0, 1)$ 在这个圆上，也在球面上，因为 $8 + 0 + 1 = 9$。\n\n本课我们把平面或直线代入曲面方程，求曲面与平面、与直线的交。",
  ),
  prerequisites: ["cylinders"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "calculating-radius-of-circular-traces",
      figure: multivariableDrawings2["intersections-of-lines-and-planes-with-surfaces#calculating-radius-of-circular-traces"],
      title: t("Calculating the radius of circular traces", "计算圆形截痕的半径"),
      explanation: t(
        "Substituting the height of the plane into the equation of the sphere leaves the equation of a circle, whose radius shrinks as the plane moves away from the center. Intersecting the sphere $x^2 + y^2 + z^2 = R^2$ with the plane $z = h$ (where $|h| < R$) produces the circle $x^2 + y^2 = R^2 - h^2$ with radius $r = \\sqrt{R^2 - h^2}$.\n\nThe plane $y = 2$ cuts $x^2 + y^2 + z^2 = 9$ in $x^2 + z^2 = 5$, a circle of radius $\\sqrt{5}$.\n\n> **Watch out.** Subtract the squares, not the lengths: the radius is $\\sqrt{R^2 - h^2}$, not $R - h$. The circle is smaller than the sphere's radius unless the plane passes through the center.",
        "把平面的高度代入球面方程，就得到一个圆的方程，平面离球心越远，圆的半径越小。用平面 $z = h$（其中 $|h| < R$）截球面 $x^2 + y^2 + z^2 = R^2$，得到的交线为圆 $x^2 + y^2 = R^2 - h^2$，其半径为 $r = \\sqrt{R^2 - h^2}$。\n\n平面 $y = 2$ 截 $x^2 + y^2 + z^2 = 9$ 得 $x^2 + z^2 = 5$，这是半径为 $\\sqrt{5}$ 的圆。\n\n> **注意。** 要减的是平方而不是长度：半径是 $\\sqrt{R^2 - h^2}$，不是 $R - h$。除非平面过球心，截得的圆半径都小于球的半径。",
      ),
      generate(rng: Rng): Problem {
        const [h0, r0, R0] = rng.pick(pythagoreanTriples);
        const k = rng.int(1, 4);
        const h = h0 * k;
        const r = r0 * k;
        const R = R0 * k;
        const axis = rng.pick(["x", "y", "z"] as const);
        const otherVars = axis === "z" ? "x^2 + y^2" : axis === "y" ? "x^2 + z^2" : "y^2 + z^2";
        const onCircle = axis === "z" ? `(${r}, 0, ${h})` : axis === "y" ? `(${r}, ${h}, 0)` : `(${h}, ${r}, 0)`;
        return numberProblem({
          prompt: t(
            `Find the radius of the circular cross section formed by the intersection of the sphere $x^2 + y^2 + z^2 = ${R * R}$ with the plane $${axis} = ${h}$.`,
            `求球面 $x^2 + y^2 + z^2 = ${R * R}$ 与平面 $${axis} = ${h}$ 相交所得圆形截面的半径。`,
          ),
          answer: r,
          mistakes: distinct(r, [
            why(
              R,
              `$${R}$ is the radius of the sphere; a plane that misses the center cuts a smaller circle.`,
              `$${R}$ 是球的半径；不过球心的平面截得的圆更小。`,
            ),
            why(
              h,
              `$${h}$ is the distance from the center to the plane, not the radius of the circle.`,
              `$${h}$ 是球心到平面的距离，不是圆的半径。`,
            ),
            why(
              R - h,
              `Subtract the squares, not the lengths: $\\sqrt{${R * R} - ${h * h}}$.`,
              `要减平方而不是长度：$\\sqrt{${R * R} - ${h * h}}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Substitute the plane", "代入平面"],
                t(
                  `$${otherVars} + ${h * h} = ${R * R}$, so $${otherVars} = ${r * r}$.`,
                  `$${otherVars} + ${h * h} = ${R * R}$，所以 $${otherVars} = ${r * r}$。`,
                ),
              ],
              [["Take the square root", "开平方"], t(`$r = \\sqrt{${r * r}} = ${r}$.`, `$r = \\sqrt{${r * r}} = ${r}$。`)],
            ],
            t(
              `The point $${onCircle}$ is on the circle and on the sphere: $${r * r} + ${h * h} = ${R * R}$.`,
              `点 $${onCircle}$ 在圆上，也在球面上：$${r * r} + ${h * h} = ${R * R}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "where-a-line-meets-a-sphere",
      figure: multivariableDrawings2["intersections-of-lines-and-planes-with-surfaces#where-a-line-meets-a-sphere"],
      title: t("Where a line meets a sphere", "直线与球面的交点"),
      explanation: t(
        "To intersect a line with a surface, substitute the line's parametric equations into the surface's equation and solve for the parameter. For the line $(t, q, r)$, parallel to the $x$-axis, and the sphere $x^2 + y^2 + z^2 = R^2$, this gives $t^2 = R^2 - q^2 - r^2$. Each real solution $t$ gives one intersection point.\n\nThe line $(t, 2, 2)$ meets $x^2 + y^2 + z^2 = 9$ where $t^2 + 8 = 9$, so $t = \\pm 1$, at the points $(1, 2, 2)$ and $(-1, 2, 2)$.\n\n> **Watch out.** Square the fixed coordinates, signs and all: $y = -4$ contributes $16$. The equation $t^2 = c$ has two roots, $\\pm\\sqrt{c}$, so the larger one is positive.",
        "要求直线与曲面的交点，把直线的参数方程代入曲面方程，解出参数。对平行于 $x$ 轴的直线 $(t, q, r)$ 与球面 $x^2 + y^2 + z^2 = R^2$，得到 $t^2 = R^2 - q^2 - r^2$。每个实数解 $t$ 对应一个交点。\n\n直线 $(t, 2, 2)$ 与 $x^2 + y^2 + z^2 = 9$ 交于 $t^2 + 8 = 9$ 处，所以 $t = \\pm 1$，交点为 $(1, 2, 2)$ 和 $(-1, 2, 2)$。\n\n> **注意。** 固定的坐标连同符号一起平方：$y = -4$ 贡献 $16$。方程 $t^2 = c$ 有两个根 $\\pm\\sqrt{c}$，较大的那个是正的。",
      ),
      generate(rng: Rng): Problem {
        const [p, q, r, R] = rng.pick([
          [3, 4, 0, 5],
          [4, 0, 3, 5],
          [2, 3, 6, 7],
          [6, 3, 2, 7],
          [1, 4, 8, 9],
          [4, 1, 8, 9],
          [8, 4, 1, 9],
          [2, 6, 9, 11],
          [6, 2, 9, 11],
          [12, 4, 3, 13],
          [3, 4, 12, 13],
          [5, 0, 12, 13],
        ] as const);
        const sy = rng.pick([-1, 1]);
        const sz = rng.pick([-1, 1]);
        const [y, z] = [sy * q, sz * r];
        return numberProblem({
          prompt: t(
            `The line $(x, y, z) = (t, ${y}, ${z})$ meets the sphere $x^2 + y^2 + z^2 = ${R * R}$ at two points. Find the larger of their $x$-coordinates.`,
            `直线 $(x, y, z) = (t, ${y}, ${z})$ 与球面 $x^2 + y^2 + z^2 = ${R * R}$ 交于两点。求两交点 $x$ 坐标中较大的一个。`,
          ),
          answer: p,
          mistakes: distinct(p, [
            why(p * p, `$t^2 = ${p * p}$, so take the square root: $t = \\pm ${p}$.`, `$t^2 = ${p * p}$，所以要开平方：$t = \\pm ${p}$。`),
            why(
              R - q - r,
              `Subtract the squares $${q * q}$ and $${r * r}$ from $${R * R}$, not the coordinates from the radius.`,
              `要从 $${R * R}$ 中减去平方 $${q * q}$ 和 $${r * r}$，而不是从半径中减去坐标。`,
            ),
            why(-p, `The two roots are $\\pm ${p}$, and the larger is the positive one.`, `两个根是 $\\pm ${p}$，较大的是正的那个。`),
          ]),
          solution: walked(
            [
              [
                ["Substitute the line", "代入直线"],
                t(
                  `$t^2 + ${paren(y)}^2 + ${paren(z)}^2 = ${R * R}$, that is, $t^2 + ${q * q} + ${r * r} = ${R * R}$.`,
                  `$t^2 + ${paren(y)}^2 + ${paren(z)}^2 = ${R * R}$，即 $t^2 + ${q * q} + ${r * r} = ${R * R}$。`,
                ),
              ],
              [
                ["Solve for t", "解出 t"],
                t(
                  `$t^2 = ${p * p}$, so $t = \\pm ${p}$, and the larger is $${p}$.`,
                  `$t^2 = ${p * p}$，所以 $t = \\pm ${p}$，较大者为 $${p}$。`,
                ),
              ],
            ],
            t(
              `The point $(${p}, ${y}, ${z})$ is on the sphere: $${p * p} + ${q * q} + ${r * r} = ${R * R}$.`,
              `点 $(${p}, ${y}, ${z})$ 在球面上：$${p * p} + ${q * q} + ${r * r} = ${R * R}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** quadricNames are the six quadric surfaces, in the order the classifying problems number them. */
const quadricNames = [
  t("Ellipsoid", "椭球面"),
  t("Hyperboloid of one sheet", "单叶双曲面"),
  t("Hyperboloid of two sheets", "双叶双曲面"),
  t("Elliptic cone", "椭圆锥面"),
  t("Elliptic paraboloid", "椭圆抛物面"),
  t("Hyperbolic paraboloid", "双曲抛物面"),
] as const;

/** quadricSigns describes the signs of each quadric with every square moved to the left side. */
const quadricSigns: readonly (readonly [string, string])[] = [
  ["no minus sign, with the right side positive", "没有负号，且右边为正"],
  ["one minus sign, with the right side positive", "一个负号，且右边为正"],
  ["two minus signs, with the right side positive", "两个负号，且右边为正"],
  ["one minus sign, with the right side $0$", "一个负号，且右边为 $0$"],
  ["one variable to the first power and two squares of the same sign", "一个变量以一次方出现，两个平方项同号"],
  ["one variable to the first power and two squares of opposite signs", "一个变量以一次方出现，两个平方项异号"],
];

/** quadricWhy says why a quadric of kind `option` does not fit an equation of kind `kind`. */
function quadricWhy(kind: number, option: number, w: string): Text {
  const name = quadricNames[option] as Text;
  const [en, zh] = quadricSigns[option] ?? ["", ""];
  const [enK, zhK] = quadricSigns[kind] ?? ["", ""];
  if (option >= 4 && kind < 4)
    return t(
      "Every variable is squared, while a paraboloid has one variable to the first power.",
      "每个变量都是平方，而抛物面有一个变量以一次方出现。",
    );
  if (option < 4 && kind >= 4)
    return t(
      `$${w}$ appears only to the first power, while ${name.en.toLowerCase().startsWith("e") ? "an" : "a"} ${name.en.toLowerCase()} has every variable squared.`,
      `$${w}$ 只以一次方出现，而${name["zh-CN"]}的每个变量都是平方。`,
    );
  return t(
    `${name.en.startsWith("E") ? "An" : "A"} ${name.en.toLowerCase()} has ${en}, but this equation, with every square on the left, has ${enK}.`,
    `${name["zh-CN"]}有${zh}，而这个方程把平方项都移到左边后有${zhK}。`,
  );
}

/** quadricCheck confirms the shape of a quadric of the given kind from a property of its points, in variables u, v and w. */
function quadricCheck(kind: number, u: string, v: string, w: string): Text {
  return [
    t(
      "Every term on the left is at least $0$ and they add up to a fixed number, so no coordinate can grow without limit: the surface is bounded, as an ellipsoid is.",
      "左边每一项都不小于 $0$，而它们的和是一个固定的数，所以没有坐标能无限增大：曲面是有界的，椭球面正是如此。",
    ),
    t(
      `Every plane $${w} = h$ cuts the surface in an ellipse, which grows with $|h|$, so the surface is one connected piece.`,
      `每个平面 $${w} = h$ 都截曲面得一椭圆，随 $|h|$ 增大而增大，所以曲面连成一片。`,
    ),
    t(
      `At $${w} = 0$ the left side is at most $0$, so it cannot equal the positive right side: the surface misses the plane $${w} = 0$ and has a piece on each side.`,
      `在 $${w} = 0$ 处左边不大于 $0$，不可能等于右边的正数：曲面与平面 $${w} = 0$ 不相交，两侧各有一片。`,
    ),
    t(
      `The origin satisfies the equation, and multiplying a point $(${u}, ${v}, ${w})$ of the surface by any $s$ multiplies every term by $s^2$, so the surface is made of lines through the origin.`,
      `原点满足方程；把曲面上的点 $(${u}, ${v}, ${w})$ 乘以任意 $s$，每一项都乘以 $s^2$，所以曲面由过原点的直线组成。`,
    ),
    t(
      `Both squares have positive coefficients, so $${w} \\ge 0$ at every point and $${w} = 1$ cuts out an ellipse: a bowl.`,
      `两个平方项的系数都为正，所以每个点都有 $${w} \\ge 0$，且 $${w} = 1$ 截出一个椭圆：碗形。`,
    ),
    t(
      `Along the $${u}$-axis $${w}$ rises and along the $${v}$-axis $${w}$ falls: a saddle at the origin.`,
      `沿 $${u}$ 轴 $${w}$ 上升，沿 $${v}$ 轴 $${w}$ 下降：原点处是马鞍形。`,
    ),
  ][kind] as Text;
}

/** quadricChoice builds the classifying problem for an equation of the given kind, w being its odd variable. */
function quadricChoice(rng: Rng, prompt: Text, kind: number, wrong: readonly number[], u: string, v: string, w: string): Problem {
  const [en, zh] = quadricSigns[kind] ?? ["", ""];
  const name = quadricNames[kind] as Text;
  return explainedChoice(rng, {
    prompt,
    correct: name,
    wrong: wrong.filter((i) => i !== kind).map((i) => ({ option: quadricNames[i] as Text, why: quadricWhy(kind, i, w) })),
    solution: walked(
      [
        [
          ["Look for a variable to the first power", "寻找一次方的变量"],
          kind >= 4
            ? t(`$${w}$ appears only to the first power, so the surface is a paraboloid.`, `$${w}$ 只以一次方出现，所以曲面是抛物面。`)
            : t("Every variable is squared, so the surface is not a paraboloid.", "每个变量都是平方，所以曲面不是抛物面。"),
        ],
        [
          ["Count the signs", "数符号"],
          t(
            `With every square on the left, the equation has ${en}: ${name.en.startsWith("E") ? "an" : "a"} ${name.en.toLowerCase()}.`,
            `把平方项都移到左边后，方程有${zh}：${name["zh-CN"]}。`,
          ),
        ],
      ],
      quadricCheck(kind, u, v, w),
    ),
  });
}

/** identifyingQuadricSurfaces classifies general quadric surfaces from standard equations. */
export const identifyingQuadricSurfaces: TopicDef = {
  id: "identifying-quadric-surfaces",
  title: t("Identifying Quadric Surfaces", "二次曲面的识别"),
  summary: t(
    "Quadric surfaces are identified by examining the signs of quadratic terms and whether linear terms appear.",
    "通过分析二次项的符号以及是否包含一次项来识别二次曲面的类型。",
  ),
  intro: t(
    "Take $4x^2 + y^2 = z^2$. Every variable is squared, and with all the squares on the left it reads $4x^2 + y^2 - z^2 = 0$: one minus sign and a right side of $0$. That is an elliptic cone with its axis along the $z$-axis.\n\nCheck: the origin lies on the surface, and so does $(1, 0, 2)$, since $4 + 0 - 4 = 0$; then so does every point $s(1, 0, 2)$, since each term scales by $s^2$, which is how a cone is made of lines through its vertex.\n\nIn this lesson we identify a quadric surface from its equation by looking for a variable to the first power and counting signs.",
    "取 $4x^2 + y^2 = z^2$。每个变量都是平方，把平方项都移到左边得 $4x^2 + y^2 - z^2 = 0$：一个负号，右边为 $0$。这是轴沿 $z$ 轴的椭圆锥面。\n\n检验：原点在曲面上，$(1, 0, 2)$ 也在，因为 $4 + 0 - 4 = 0$；于是每个点 $s(1, 0, 2)$ 也在，因为每一项都按 $s^2$ 缩放，锥面正是这样由过顶点的直线组成的。\n\n本课我们通过寻找一次方的变量并数符号，由方程识别二次曲面。",
  ),
  prerequisites: ["intersections-of-lines-and-planes-with-surfaces"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "recognizing-quadric-surfaces-from-equations",
      figure: multivariableDrawings2["identifying-quadric-surfaces#recognizing-quadric-surfaces-from-equations"],
      title: t("Recognizing quadric surfaces from equations", "根据方程识别二次曲面"),
      explanation: t(
        "Standard forms of quadric surfaces:\n\n- Ellipsoid: $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} + \\frac{z^2}{c^2} = 1$.\n- Hyperboloid of 1 sheet: $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} - \\frac{z^2}{c^2} = 1$.\n- Hyperboloid of 2 sheets: $-\\frac{x^2}{a^2} - \\frac{y^2}{b^2} + \\frac{z^2}{c^2} = 1$.\n- Elliptic cone: $\\frac{z^2}{c^2} = \\frac{x^2}{a^2} + \\frac{y^2}{b^2}$.\n- Elliptic paraboloid: $z = \\frac{x^2}{a^2} + \\frac{y^2}{b^2}$.\n- Hyperbolic paraboloid: $z = \\frac{x^2}{a^2} - \\frac{y^2}{b^2}$.\n\nThe equation $x^2 + \\frac{y^2}{4} - \\frac{z^2}{9} = 0$ has every variable squared, one minus sign and a right side of $0$, so it is an elliptic cone.\n\n> **Watch out.** Move every square to the same side before counting signs: the cone $\\frac{z^2}{c^2} = \\frac{x^2}{a^2} + \\frac{y^2}{b^2}$ then has one minus sign and a right side of $0$, which tells it apart from a hyperboloid.",
        "二次曲面的标准形式：\n\n- 椭球面：$\\frac{x^2}{a^2} + \\frac{y^2}{b^2} + \\frac{z^2}{c^2} = 1$。\n- 单叶双曲面：$\\frac{x^2}{a^2} + \\frac{y^2}{b^2} - \\frac{z^2}{c^2} = 1$。\n- 双叶双曲面：$-\\frac{x^2}{a^2} - \\frac{y^2}{b^2} + \\frac{z^2}{c^2} = 1$。\n- 椭圆锥面：$\\frac{z^2}{c^2} = \\frac{x^2}{a^2} + \\frac{y^2}{b^2}$。\n- 椭圆抛物面：$z = \\frac{x^2}{a^2} + \\frac{y^2}{b^2}$。\n- 双曲抛物面：$z = \\frac{x^2}{a^2} - \\frac{y^2}{b^2}$。\n\n方程 $x^2 + \\frac{y^2}{4} - \\frac{z^2}{9} = 0$ 中每个变量都是平方，有一个负号，右边为 $0$，所以它是椭圆锥面。\n\n> **注意。** 数符号前要把所有平方项移到同一边：锥面 $\\frac{z^2}{c^2} = \\frac{x^2}{a^2} + \\frac{y^2}{b^2}$ 移项后有一个负号且右边为 $0$，由此与双曲面区分开。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 5);
        const b = rng.int(2, 5);
        const c = rng.int(2, 5);
        const kind = rng.int(0, 5);
        const [X, Y, Z] = [`\\frac{x^2}{${a * a}}`, `\\frac{y^2}{${b * b}}`, `\\frac{z^2}{${c * c}}`];
        const eq = [
          `${X} + ${Y} + ${Z} = 1`,
          `${X} + ${Y} - ${Z} = 1`,
          `-${X} - ${Y} + ${Z} = 1`,
          `${Z} = ${X} + ${Y}`,
          `z = ${X} + ${Y}`,
          `z = ${X} - ${Y}`,
        ][kind];
        const wrong =
          [
            [1, 4, 3],
            [2, 0, 5],
            [1, 4, 0],
            [0, 4, 1],
            [5, 0, 3],
            [4, 1, 3],
          ][kind] ?? [];
        return quadricChoice(
          rng,
          t(`Identify the quadric surface defined by the equation $${eq}$.`, `识别由方程 $${eq}$ 定义的二次曲面。`),
          kind,
          wrong,
          "x",
          "y",
          "z",
        );
      },
    },
    {
      id: "identifying-quadric-surfaces-from-their-signs",
      figure: multivariableDrawings2["identifying-quadric-surfaces#identifying-quadric-surfaces-from-their-signs"],
      title: t("Identifying quadric surfaces from their signs", "根据符号识别二次曲面"),
      explanation: t(
        "When every variable appears squared, count the signs after moving the constant to the right side with $d > 0$. Three positive squares give an ellipsoid, two positive and one negative a hyperboloid of one sheet, one positive and two negative a hyperboloid of two sheets, and two positive and one negative equal to $0$ an elliptic cone. When one variable appears only to the first power, the surface is a paraboloid: elliptic if the two squares have the same sign, hyperbolic if they have opposite signs.\n\nIn $-16x^2 + 4y^2 + z^2 = 9$ one square of three is negative and the right side is positive, so the surface is a hyperboloid of one sheet, around the $x$-axis.\n\n> **Watch out.** Make the constant positive before counting: $x^2 + y^2 - z^2 = -1$ is $-x^2 - y^2 + z^2 = 1$, a hyperboloid of two sheets. The size of the coefficients does not change the type, only their signs do.",
        "当每个变量都以平方出现时，把常数移到右边并使 $d > 0$，然后数符号。三个正的平方项是椭球面，两正一负是单叶双曲面，一正两负是双叶双曲面，两正一负且等于 $0$ 是椭圆锥面。当某个变量只以一次方出现时，曲面是抛物面：两个平方项同号为椭圆抛物面，异号为双曲抛物面。\n\n在 $-16x^2 + 4y^2 + z^2 = 9$ 中，三个平方项有一个为负，右边为正，所以曲面是绕 $x$ 轴的单叶双曲面。\n\n> **注意。** 数符号前要使常数为正：$x^2 + y^2 - z^2 = -1$ 就是 $-x^2 - y^2 + z^2 = 1$，即双叶双曲面。系数的大小不改变类型，只有符号才会。",
      ),
      generate(rng: Rng): Problem {
        const [u, v, w] = rng.pick([
          ["x", "y", "z"],
          ["y", "z", "x"],
          ["z", "x", "y"],
        ] as const);
        const [a, b, c] = [rng.int(1, 9), rng.int(1, 9), rng.int(1, 9)];
        const d = rng.int(1, 20);
        const kind = rng.int(0, 5);
        const eq = [
          `${poly([a, `${u}^2`], [b, `${v}^2`], [c, `${w}^2`])} = ${d}`,
          `${poly([a, `${u}^2`], [b, `${v}^2`], [-c, `${w}^2`])} = ${d}`,
          `${poly([-a, `${u}^2`], [-b, `${v}^2`], [c, `${w}^2`])} = ${d}`,
          `${poly([a, `${u}^2`], [b, `${v}^2`], [-c, `${w}^2`])} = 0`,
          `${w} = ${poly([a, `${u}^2`], [b, `${v}^2`])}`,
          `${w} = ${poly([a, `${u}^2`], [-b, `${v}^2`])}`,
        ][kind];
        return quadricChoice(rng, t(`Identify the surface $${eq}$.`, `识别曲面 $${eq}$。`), kind, [0, 1, 2, 3, 4, 5], u, v, w);
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 2.7 Partial Derivatives
// ---------------------------------------------------------------------------

/** introductionToPartialDerivatives introduces partial derivatives fx and fy. */
export const introductionToPartialDerivatives: TopicDef = {
  id: "introduction-to-partial-derivatives",
  title: t("Introduction to Partial Derivatives", "偏导数简介"),
  summary: t(
    "The partial derivative fx is obtained by differentiating f(x, y) with respect to x while treating y as a constant.",
    "偏导数 fx 是将 y 视为常数对 x 求导所得的导数。",
  ),
  intro: t(
    "For $f(x, y) = x^2y + 3y$, holding $y$ fixed and differentiating in $x$ gives $f_x = 2xy$, and holding $x$ fixed and differentiating in $y$ gives $f_y = x^2 + 3$. At $(2, 1)$, $f_x = 4$ and $f_y = 7$.\n\nCheck: with $y = 1$ fixed, $f(2.01, 1) - f(2, 1) = 4.0401 - 4 = 0.0401$, and $\\frac{0.0401}{0.01} = 4.01$, close to $f_x(2, 1) = 4$.\n\nIn this lesson we compute the partial derivatives of a function of two variables at a point by treating the other variable as a constant.",
    "对 $f(x, y) = x^2y + 3y$，固定 $y$ 对 $x$ 求导得 $f_x = 2xy$，固定 $x$ 对 $y$ 求导得 $f_y = x^2 + 3$。在 $(2, 1)$ 处，$f_x = 4$，$f_y = 7$。\n\n检验：固定 $y = 1$，$f(2.01, 1) - f(2, 1) = 4.0401 - 4 = 0.0401$，而 $\\frac{0.0401}{0.01} = 4.01$，接近 $f_x(2, 1) = 4$。\n\n本课我们把另一个变量当作常数，求二元函数在一点处的偏导数。",
  ),
  prerequisites: ["identifying-quadric-surfaces", "defining-the-derivative-using-derivative-notation"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-first-partial-derivatives-at-a-point",
      title: t("Evaluating first partial derivatives at a point", "在某点处求一阶偏导数"),
      explanation: t(
        "To find $\\frac{\\partial f}{\\partial x}$, treat $y$ as a constant and differentiate with respect to $x$ using ordinary single-variable rules:\n\n$$\\frac{\\partial f}{\\partial x}(x_0, y_0) = \\lim_{h \\to 0} \\frac{f(x_0 + h, y_0) - f(x_0, y_0)}{h}.$$\n\nFor $f(x, y) = x^3y^2$, $f_x = 3x^2y^2$, so $f_x(1, 2) = 3 \\cdot 1 \\cdot 4 = 12$.\n\n> **Watch out.** With $y$ held constant, $xy^2$ is $y^2$ times $x$: its $x$-derivative is $y^2$, not $0$ and not $2xy$. Differentiating in $y$ instead gives $f_y$, a different number.",
        "求 $\\frac{\\partial f}{\\partial x}$ 时，将 $y$ 视为常数，利用普通一元求导法则对 $x$ 求导：\n\n$$\\frac{\\partial f}{\\partial x}(x_0, y_0) = \\lim_{h \\to 0} \\frac{f(x_0 + h, y_0) - f(x_0, y_0)}{h}$$\n\n对 $f(x, y) = x^3y^2$，$f_x = 3x^2y^2$，所以 $f_x(1, 2) = 3 \\cdot 1 \\cdot 4 = 12$。\n\n> **注意。** 固定 $y$ 时，$xy^2$ 是 $y^2$ 乘以 $x$：它对 $x$ 的导数是 $y^2$，不是 $0$，也不是 $2xy$。改为对 $y$ 求导得到的是 $f_y$，另一个数。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-4, 4);
        const b = rng.nonZero(-4, 4);
        const x0 = rng.int(-2, 3);
        const y0 = rng.int(-2, 3);
        const ans = 2 * a * x0 * y0 + b * y0 * y0;
        const f = poly([a, "x^2y"], [b, "xy^2"]);
        return numberProblem({
          prompt: t(
            `Find the partial derivative $f_x(${x0}, ${y0})$ for the function $f(x, y) = ${f}$ at the point $(${x0}, ${y0})$.`,
            `求函数 $f(x, y) = ${f}$ 在点 $(${x0}, ${y0})$ 处的偏导数 $f_x(${x0}, ${y0})$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              a * x0 * x0 + 2 * b * x0 * y0,
              "That is $f_y$: for $f_x$ hold $y$ constant and differentiate in $x$.",
              "这是 $f_y$：求 $f_x$ 要固定 $y$，对 $x$ 求导。",
            ),
            why(
              2 * a * x0 * y0,
              `$${b === 1 ? "" : b === -1 ? "-" : b}xy^2$ is a constant times $x$, so its $x$-derivative is $${b === 1 ? "" : b === -1 ? "-" : b}y^2$, not $0$.`,
              `$${b === 1 ? "" : b === -1 ? "-" : b}xy^2$ 是常数乘以 $x$，所以它对 $x$ 的导数是 $${b === 1 ? "" : b === -1 ? "-" : b}y^2$，不是 $0$。`,
            ),
            why(
              a * x0 * y0 + b * y0 * y0,
              "The power rule doubles $x^2$: its derivative is $2x$, not $x$.",
              "幂法则使 $x^2$ 的导数为 $2x$，而不是 $x$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Differentiate with y held constant", "固定 y 求导"],
                t(`$f_x(x, y) = ${poly([2 * a, "xy"], [b, "y^2"])}$.`, `$f_x(x, y) = ${poly([2 * a, "xy"], [b, "y^2"])}$。`),
              ],
              [
                ["Substitute the point", "代入该点"],
                t(
                  `$f_x(${x0}, ${y0}) = 2(${a})(${x0})(${y0}) + (${b})(${y0})^2 = ${ans}$.`,
                  `$f_x(${x0}, ${y0}) = 2(${a})(${x0})(${y0}) + (${b})(${y0})^2 = ${ans}$。`,
                ),
              ],
            ],
            t(
              `Fixing $y = ${y0}$ first leaves the one-variable function $g(x) = f(x, ${y0}) = ${poly([a * y0, "x^2"], [b * y0 * y0, "x"]) || "0"}$, and $g'(${x0}) = ${2 * a * y0} \\cdot ${paren(x0)} + ${paren(b * y0 * y0)} = ${ans}$.`,
              `先固定 $y = ${y0}$，得一元函数 $g(x) = f(x, ${y0}) = ${poly([a * y0, "x^2"], [b * y0 * y0, "x"]) || "0"}$，而 $g'(${x0}) = ${2 * a * y0} \\cdot ${paren(x0)} + ${paren(b * y0 * y0)} = ${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "evaluating-a-partial-derivative-with-respect-to-y",
      title: t("Evaluating a partial derivative with respect to y", "计算关于 y 的偏导数的值"),
      explanation: t(
        "To find $f_y$, treat $x$ as a constant and differentiate with respect to $y$ as in one-variable calculus. A term such as $ax^2y$ is a constant multiple of $y$, so its derivative is $ax^2$; a term without $y$ has derivative $0$. Then substitute the point.\n\nFor $f(x, y) = xy^2 + 5x^2$, $f_y = 2xy$, so $f_y(3, 1) = 6$; the term $5x^2$ contributes nothing.\n\n> **Watch out.** A term with no $y$, such as $x^3$, has $y$-derivative $0$. The power rule still applies to $y$: $xy^3$ has $y$-derivative $3xy^2$.",
        "求 $f_y$ 时，把 $x$ 当作常数，像一元微积分那样对 $y$ 求导。像 $ax^2y$ 这样的项是 $y$ 的常数倍，所以其导数为 $ax^2$；不含 $y$ 的项导数为 $0$。然后代入该点。\n\n对 $f(x, y) = xy^2 + 5x^2$，$f_y = 2xy$，所以 $f_y(3, 1) = 6$；$5x^2$ 这一项没有贡献。\n\n> **注意。** 不含 $y$ 的项，如 $x^3$，对 $y$ 的导数为 $0$。幂法则对 $y$ 照样适用：$xy^3$ 对 $y$ 的导数是 $3xy^2$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-4, 4) || 2;
        const b = rng.int(-3, 3) || 1;
        const c = rng.int(-5, 5);
        const e = rng.int(1, 6);
        const p = rng.int(-3, 3);
        const q = rng.int(-3, 3);
        const fy = a * p * p + 3 * b * p * q * q + c;
        const f = poly([a, "x^2y"], [b, "xy^3"], [c, "y"], [e, "x^3"]);
        const g = poly([b * p, "y^3"], [a * p * p + c, "y"], [e * p * p * p, ""]) || "0";
        return numberProblem({
          prompt: t(`Find $f_y(${p}, ${q})$ for $f(x, y) = ${f}$.`, `对 $f(x, y) = ${f}$，求 $f_y(${p}, ${q})$。`),
          answer: fy,
          mistakes: distinct(fy, [
            why(
              fy + 3 * e * p * p,
              `$${e === 1 ? "" : e}x^3$ has no $y$, so its $y$-derivative is $0$.`,
              `$${e === 1 ? "" : e}x^3$ 不含 $y$，所以它对 $y$ 的导数为 $0$。`,
            ),
            why(
              a * p * p + b * p * q * q + c,
              "The power rule brings down the exponent: $y^3$ has derivative $3y^2$.",
              "幂法则要把指数乘下来：$y^3$ 的导数是 $3y^2$。",
            ),
            why(
              2 * a * p * q + b * q * q * q + 3 * e * p * p,
              "That is $f_x$: for $f_y$ hold $x$ constant and differentiate in $y$.",
              "这是 $f_x$：求 $f_y$ 要固定 $x$，对 $y$ 求导。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Differentiate with x held constant", "固定 x 求导"],
                t(
                  `$f_y = ${poly([a, "x^2"], [3 * b, "xy^2"], [c, ""]) || "0"}$.`,
                  `$f_y = ${poly([a, "x^2"], [3 * b, "xy^2"], [c, ""]) || "0"}$。`,
                ),
              ],
              [["Substitute the point", "代入该点"], t(`$f_y(${p}, ${q}) = ${fy}$.`, `$f_y(${p}, ${q}) = ${fy}$。`)],
            ],
            t(
              `Fixing $x = ${p}$ first leaves $g(y) = f(${p}, y) = ${g}$, whose derivative at $y = ${q}$ is $${3 * b * p} \\cdot ${paren(q * q)} + ${paren(a * p * p + c)} = ${fy}$.`,
              `先固定 $x = ${p}$，得 $g(y) = f(${p}, y) = ${g}$，它在 $y = ${q}$ 处的导数为 $${3 * b * p} \\cdot ${paren(q * q)} + ${paren(a * p * p + c)} = ${fy}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** computingPartialDerivativesUsingTheRulesOfDifferentiation computes symbolic partials. */
export const computingPartialDerivativesUsingTheRulesOfDifferentiation: TopicDef = {
  id: "computing-partial-derivatives-using-the-rules-of-differentiation",
  title: t("Computing Partial Derivatives Using the Rules of Differentiation", "利用求导法则计算偏导数"),
  summary: t(
    "Partial derivatives of multivariable expressions are calculated by applying the power, product, quotient, and chain rules while treating inactive variables as constants.",
    "通过将非目标变量视为常数，应用幂法则、乘积法则、商法则和链式法则计算多元表达式的偏导数。",
  ),
  intro: t(
    "For $f(x, y) = x^2y^3 - 4y$, holding $y$ constant turns $y^3$ into a constant factor, so $f_x = 2xy^3$. Holding $x$ constant instead gives $f_y = 3x^2y^2 - 4$. At $(1, 1)$, $f_y = -1$.\n\nCheck: $f(1, 1.01) - f(1, 1) = (1.030301 - 4.04) - (1 - 4) = -0.009699$, and $\\frac{-0.009699}{0.01} \\approx -0.97$, close to $f_y(1, 1) = -1$.\n\nIn this lesson we find partial derivatives as formulas with the power, product and quotient rules, holding the other variable constant.",
    "对 $f(x, y) = x^2y^3 - 4y$，固定 $y$ 时 $y^3$ 是常数因子，所以 $f_x = 2xy^3$。改为固定 $x$，得 $f_y = 3x^2y^2 - 4$。在 $(1, 1)$ 处 $f_y = -1$。\n\n检验：$f(1, 1.01) - f(1, 1) = (1.030301 - 4.04) - (1 - 4) = -0.009699$，而 $\\frac{-0.009699}{0.01} \\approx -0.97$，接近 $f_y(1, 1) = -1$。\n\n本课我们固定另一个变量，用幂法则、乘积法则和商法则求偏导数的表达式。",
  ),
  prerequisites: ["introduction-to-partial-derivatives"],
  encompasses: [{ topic: "introduction-to-partial-derivatives", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "symbolic-partial-differentiation",
      title: t("Symbolic partial differentiation", "符号偏导数计算"),
      explanation: t(
        "A partial derivative measures change in one variable while the others are held fixed, so treat every other variable exactly as you would treat a constant. Apply standard differentiation rules while treating inactive variables as constant multipliers or independent constants:\n\n$$\\frac{\\partial}{\\partial x}[x^m y^n] = m x^{m-1} y^n, \\quad \\frac{\\partial}{\\partial y}[x^m y^n] = n x^m y^{n-1}.$$\n\nFor $f(x, y) = x^4y^2 + 5y$, $f_x = 4x^3y^2$: the factor $y^2$ rides along, and $5y$ has no $x$ at all.\n\n> **Watch out.** A term with no $x$, such as $y^3$, has $x$-derivative $0$. In a term such as $x^2y$ only the power of $x$ comes down, so its $x$-derivative is $2xy$, not $2x$ and not $x^2$.",
        "偏导数衡量只改变一个变量而其他变量固定时的变化，所以把其他变量完全当作常数来处理。在将非目标变量视为常数乘子或常数项的同时，应用标准求导法则：\n\n$$\\frac{\\partial}{\\partial x}[x^m y^n] = m x^{m-1} y^n, \\quad \\frac{\\partial}{\\partial y}[x^m y^n] = n x^m y^{n-1}$$\n\n对 $f(x, y) = x^4y^2 + 5y$，$f_x = 4x^3y^2$：因子 $y^2$ 原样保留，而 $5y$ 根本不含 $x$。\n\n> **注意。** 不含 $x$ 的项，如 $y^3$，对 $x$ 的导数为 $0$。像 $x^2y$ 这样的项只把 $x$ 的指数乘下来，所以它对 $x$ 的导数是 $2xy$，不是 $2x$，也不是 $x^2$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-5, 5);
        const b = rng.nonZero(-5, 5);
        const c = rng.nonZero(-5, 5);
        const f = poly([a, "x^3"], [b, "x^2y"], [c, "y^3"]);
        const ans = poly([3 * a, "x^2"], [2 * b, "xy"]);
        return expressionProblem({
          prompt: t(`Find the partial derivative $f_x(x, y)$ of $f(x, y) = ${f}$.`, `求函数 $f(x, y) = ${f}$ 的偏导数 $f_x(x, y)$。`),
          answer: ans,
          mistakes: spoken(ans, [
            say(
              poly([a, "x^2"], [b, "xy"]),
              "The power rule brings the exponent down as a factor: $x^3$ gives $3x^2$ and $x^2$ gives $2x$.",
              "幂法则要把指数作为因子乘下来：$x^3$ 得 $3x^2$，$x^2$ 得 $2x$。",
            ),
            say(
              poly([3 * a, "x^2"], [2 * b, "xy"], [3 * c, "y^2"]),
              `$${poly([c, "y^3"])}$ has no $x$, so with $y$ held constant its $x$-derivative is $0$.`,
              `$${poly([c, "y^3"])}$ 不含 $x$，固定 $y$ 时它对 $x$ 的导数为 $0$。`,
            ),
            say(
              poly([b, "x^2"], [3 * c, "y^2"]),
              "That is $f_y$: for $f_x$ hold $y$ constant and differentiate in $x$.",
              "这是 $f_y$：求 $f_x$ 要固定 $y$，对 $x$ 求导。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Differentiate term by term", "逐项求导"],
                t(
                  `With $y$ constant, $${poly([a, "x^3"])}$ gives $${poly([3 * a, "x^2"])}$, $${poly([b, "x^2y"])}$ gives $${poly([2 * b, "xy"])}$, and $${poly([c, "y^3"])}$ gives $0$.`,
                  `固定 $y$，$${poly([a, "x^3"])}$ 得 $${poly([3 * a, "x^2"])}$，$${poly([b, "x^2y"])}$ 得 $${poly([2 * b, "xy"])}$，$${poly([c, "y^3"])}$ 得 $0$。`,
                ),
              ],
              [["Add the results", "相加"], t(`$f_x(x, y) = ${ans}$.`, `$f_x(x, y) = ${ans}$。`)],
            ],
            t(
              `At $y = 1$ the function is $${poly([a, "x^3"], [b, "x^2"], [c, ""])}$, whose derivative $${poly([3 * a, "x^2"], [2 * b, "x"])}$ is $f_x$ with $y = 1$.`,
              `在 $y = 1$ 时函数为 $${poly([a, "x^3"], [b, "x^2"], [c, ""])}$，其导数 $${poly([3 * a, "x^2"], [2 * b, "x"])}$ 正是 $y = 1$ 时的 $f_x$。`,
            ),
          ),
        });
      },
    },
    {
      id: "partial-derivatives-of-a-quotient",
      title: t("Partial derivatives of a quotient", "商的偏导数"),
      explanation: t(
        "The quotient rule works for partial derivatives with the other variable held constant. For $f(x, y) = \\frac{x + ay}{x + by}$,\n\n$$f_x = \\frac{(x + by) - (x + ay)}{(x + by)^2} = \\frac{(b - a)y}{(x + by)^2}.$$\n\nSimplify the numerator before substituting, since much of it cancels. For $\\frac{2x + y}{x - y}$, $f_x = \\frac{2(x - y) - (2x + y)}{(x - y)^2} = \\frac{-3y}{(x - y)^2}$, which is $-3$ at $(2, 1)$.\n\n> **Watch out.** The numerator is the denominator times the derivative of the top, minus the top times the derivative of the bottom; reversing it flips the sign. Substitute $y$ in the simplified numerator, not $x$.",
        "商法则同样适用于偏导数，只需把另一个变量当作常数。对 $f(x, y) = \\frac{x + ay}{x + by}$，\n\n$$f_x = \\frac{(x + by) - (x + ay)}{(x + by)^2} = \\frac{(b - a)y}{(x + by)^2}.$$\n\n代入之前先化简分子，因为其中很多项会抵消。对 $\\frac{2x + y}{x - y}$，$f_x = \\frac{2(x - y) - (2x + y)}{(x - y)^2} = \\frac{-3y}{(x - y)^2}$，在 $(2, 1)$ 处等于 $-3$。\n\n> **注意。** 分子是分母乘分子的导数，减去分子乘分母的导数；顺序反了符号就反了。化简后的分子要代入的是 $y$，不是 $x$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-4, 4);
        let b = rng.int(-4, 4);
        if (b === a) b = a + 1;
        const q = rng.int(1, 3) * rng.pick([-1, 1]);
        let p = rng.int(-4, 4);
        if (p + b * q === 0) p += 1;
        const d = p + b * q;
        const den = d * d;
        const ans = Q.of((b - a) * q, den);
        const top = poly([1, "x"], [a, "y"]);
        const bottom = poly([1, "x"], [b, "y"]);
        return numberProblem({
          prompt: t(
            `Find $f_x(${p}, ${q})$ for $f(x, y) = \\frac{${top}}{${bottom}}$.`,
            `对 $f(x, y) = \\frac{${top}}{${bottom}}$，求 $f_x(${p}, ${q})$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of((a - b) * q, den),
              "The numerator is reversed: it is the bottom times the derivative of the top minus the top times the derivative of the bottom.",
              "分子的顺序反了：应当是分母乘分子的导数，减去分子乘分母的导数。",
            ),
            why(
              Q.of((b - a) * p, den),
              `The simplified numerator is $${poly([b - a, "y"])}$, so substitute $y = ${q}$, not $x = ${p}$.`,
              `化简后的分子是 $${poly([b - a, "y"])}$，所以要代入 $y = ${q}$，不是 $x = ${p}$。`,
            ),
            why(
              Q.of(1, d),
              "Differentiating only the top and keeping the bottom is not the quotient rule.",
              "只对分子求导而保留分母，这不是商法则。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Apply the quotient rule", "用商法则"],
                t(
                  `With $y$ constant, both the top and the bottom have $x$-derivative $1$, so $f_x = \\frac{(${bottom}) - (${top})}{(${bottom})^2} = \\frac{${poly([b - a, "y"])}}{(${bottom})^2}$.`,
                  `固定 $y$，分子和分母对 $x$ 的导数都是 $1$，所以 $f_x = \\frac{(${bottom}) - (${top})}{(${bottom})^2} = \\frac{${poly([b - a, "y"])}}{(${bottom})^2}$。`,
                ),
              ],
              [
                ["Substitute the point", "代入该点"],
                t(
                  `At $(${p}, ${q})$ the bottom is $${d}$, so $f_x = \\frac{${(b - a) * q}}{${den}} = ${ans.toLatex()}$.`,
                  `在 $(${p}, ${q})$ 处分母为 $${d}$，所以 $f_x = \\frac{${(b - a) * q}}{${den}} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `Writing $f = 1 + \\frac{${poly([a - b, "y"])}}{${bottom}}$ and using $\\frac{\\partial}{\\partial x} \\frac{1}{${bottom}} = -\\frac{1}{(${bottom})^2}$ gives $f_x = \\frac{${poly([b - a, "y"])}}{(${bottom})^2}$ again.`,
              `把 $f$ 写成 $1 + \\frac{${poly([a - b, "y"])}}{${bottom}}$，利用 $\\frac{\\partial}{\\partial x} \\frac{1}{${bottom}} = -\\frac{1}{(${bottom})^2}$，又得到 $f_x = \\frac{${poly([b - a, "y"])}}{(${bottom})^2}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** geometricInterpretationsOfPartialDerivatives interprets partial derivatives as slopes of traces. */
export const geometricInterpretationsOfPartialDerivatives: TopicDef = {
  id: "geometric-interpretations-of-partial-derivatives",
  title: t("Geometric Interpretations of Partial Derivatives", "偏导数的几何意义"),
  summary: t(
    "The partial derivative fx(x0, y0) represents the slope of the tangent line to the trace of z = f(x, y) in the plane y = y0.",
    "偏导数 fx(x0, y0) 表示曲面 z = f(x, y) 与平面 y = y0 的交线（截痕）在对应点处的切线斜率。",
  ),
  intro: t(
    "The plane $y = 2$ cuts the surface $z = x^2y - y^3$ in the curve $z = 2x^2 - 8$. Its slope at $x = 1$ is $4x = 4$, and this is $f_x(1, 2) = 2xy = 4$.\n\nCheck: on the curve, $\\frac{z(1.01) - z(1)}{0.01} = \\frac{(2.0402 - 8) - (2 - 8)}{0.01} = 4.02$, close to $4$.\n\nIn this lesson we read partial derivatives as slopes of the curves cut from a surface by the planes $y = \\text{constant}$ and $x = \\text{constant}$.",
    "平面 $y = 2$ 截曲面 $z = x^2y - y^3$ 得曲线 $z = 2x^2 - 8$。它在 $x = 1$ 处的斜率为 $4x = 4$，这正是 $f_x(1, 2) = 2xy = 4$。\n\n检验：在这条曲线上，$\\frac{z(1.01) - z(1)}{0.01} = \\frac{(2.0402 - 8) - (2 - 8)}{0.01} = 4.02$，接近 $4$。\n\n本课我们把偏导数理解为平面 $y = \\text{常数}$ 和 $x = \\text{常数}$ 截曲面所得曲线的斜率。",
  ),
  prerequisites: ["introduction-to-partial-derivatives"],
  encompasses: [{ topic: "introduction-to-partial-derivatives", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "slopes-of-surface-cross-sections",
      title: t("Slopes of surface cross sections", "曲面截痕的切线斜率"),
      explanation: t(
        "Geometrically, slicing the surface $z = f(x, y)$ by the vertical plane $y = y_0$ produces a curve $z = f(x, y_0)$. The slope of the tangent line to this curve in the $x$-direction is precisely $f_x(x_0, y_0)$.\n\nFor $z = x^3 + y^2$ cut by $y = 5$, the curve is $z = x^3 + 25$, and its slope at $x = 2$ is $3 \\cdot 2^2 = 12$.\n\n> **Watch out.** In the plane $y = y_0$ the $y$ term is a constant, so it adds nothing to the slope. The slope is $f_x$, not the height $z$ and not $f_y$.",
        "几何上，用垂直平面 $y = y_0$ 切割曲面 $z = f(x, y)$ 会得到曲线 $z = f(x, y_0)$。该曲线在 $x$ 方向切线的斜率恰好是 $f_x(x_0, y_0)$。\n\n对 $z = x^3 + y^2$ 被 $y = 5$ 所截，曲线为 $z = x^3 + 25$，它在 $x = 2$ 处的斜率为 $3 \\cdot 2^2 = 12$。\n\n> **注意。** 在平面 $y = y_0$ 中，$y$ 项是常数，对斜率没有贡献。斜率是 $f_x$，不是高度 $z$，也不是 $f_y$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-4, 4);
        const b = rng.nonZero(-4, 4);
        const x0 = rng.int(-3, 3);
        const y0 = rng.int(-3, 3);
        const ans = 2 * a * x0;
        const surface = poly([a, "x^2"], [b, "y^2"]);
        const curve = poly([a, "x^2"], [b * y0 * y0, ""]);
        const z = (x: number) => a * x * x + b * y0 * y0;
        return numberProblem({
          prompt: t(
            `Find the slope of the tangent line to the cross section of the surface $z = ${surface}$ cut by the plane $y = ${y0}$ at the point where $x = ${x0}$.`,
            `求曲面 $z = ${surface}$ 与平面 $y = ${y0}$ 相交截痕在 $x = ${x0}$ 处的切线斜率。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              2 * b * y0,
              "That is $f_y$, the slope across the other direction; in the plane $y = \\text{constant}$ only $x$ moves.",
              "这是 $f_y$，另一个方向的斜率；在平面 $y = \\text{常数}$ 中只有 $x$ 在变。",
            ),
            why(a * x0, "The power rule gives $x^2$ the derivative $2x$, not $x$.", "幂法则使 $x^2$ 的导数为 $2x$，而不是 $x$。"),
            why(
              z(x0),
              "That is the height $z$ of the point, not the slope of the curve there.",
              "这是该点的高度 $z$，不是曲线在该点的斜率。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Cut with the plane", "用平面截"],
                t(`Setting $y = ${y0}$ gives the curve $z = ${curve}$.`, `令 $y = ${y0}$，得曲线 $z = ${curve}$。`),
              ],
              [
                ["Differentiate in x", "对 x 求导"],
                t(
                  `Its slope is $${poly([2 * a, "x"])}$, which at $x = ${x0}$ is $${2 * a} \\cdot ${paren(x0)} = ${ans}$.`,
                  `它的斜率为 $${poly([2 * a, "x"])}$，在 $x = ${x0}$ 处为 $${2 * a} \\cdot ${paren(x0)} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `For a quadratic the symmetric difference is exact: $\\frac{z(${x0 + 1}) - z(${x0 - 1})}{2} = \\frac{${z(x0 + 1)} - ${paren(z(x0 - 1))}}{2} = ${ans}$.`,
              `对二次函数，对称差商是精确的：$\\frac{z(${x0 + 1}) - z(${x0 - 1})}{2} = \\frac{${z(x0 + 1)} - ${paren(z(x0 - 1))}}{2} = ${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-slope-of-a-surface-in-a-plane-x-equals-constant",
      title: t("The slope of a surface in a plane x = constant", "曲面在平面 x = 常数 中的斜率"),
      explanation: t(
        "The plane $x = p$ cuts the surface $z = f(x, y)$ in a curve $z = f(p, y)$. Its slope in the $y$-direction at $y = q$ is the partial derivative $f_y(p, q)$: moving along this curve changes $y$ while $x$ stays fixed. So the slope is found by differentiating with respect to $y$ and substituting.\n\nFor $z = x^2y^2 + y$ in the plane $x = 2$, the curve is $z = 4y^2 + y$, whose slope at $y = 1$ is $8 + 1 = 9$.\n\n> **Watch out.** In the plane $x = p$ a term with only $x$ is a constant and adds nothing. Substitute $x = p$ and $y = q$ into the right places after differentiating.",
        "平面 $x = p$ 截曲面 $z = f(x, y)$ 得曲线 $z = f(p, y)$。它在 $y = q$ 处沿 $y$ 方向的斜率就是偏导数 $f_y(p, q)$：沿这条曲线移动时 $y$ 变化而 $x$ 不变。所以对 $y$ 求导再代入即可得到斜率。\n\n对 $z = x^2y^2 + y$ 在平面 $x = 2$ 中，曲线为 $z = 4y^2 + y$，它在 $y = 1$ 处的斜率为 $8 + 1 = 9$。\n\n> **注意。** 在平面 $x = p$ 中，只含 $x$ 的项是常数，没有贡献。求导之后要把 $x = p$、$y = q$ 代入正确的位置。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-4, 4) || 1;
        const b = rng.int(-4, 4);
        const c = rng.int(-3, 3) || 1;
        const p = rng.int(-3, 3);
        const q = rng.int(-3, 3);
        const slope = b * p + 2 * c * q;
        const z = (y: number) => a * p * p + b * p * y + c * y * y;
        const surface = poly([a, "x^2"], [b, "xy"], [c, "y^2"]);
        return numberProblem({
          prompt: t(
            `The plane $x = ${p}$ cuts $z = ${surface}$ in a curve. Find its slope $\\frac{\\partial z}{\\partial y}$ at $y = ${q}$.`,
            `平面 $x = ${p}$ 截 $z = ${surface}$ 得一曲线。求它在 $y = ${q}$ 处的斜率 $\\frac{\\partial z}{\\partial y}$。`,
          ),
          answer: slope,
          mistakes: distinct(slope, [
            why(
              2 * a * p + b * q,
              "That is $f_x$; in the plane $x = \\text{constant}$ only $y$ moves.",
              "这是 $f_x$；在平面 $x = \\text{常数}$ 中只有 $y$ 在变。",
            ),
            why(
              slope + 2 * a * p,
              `$${poly([a, "x^2"])}$ has no $y$, so in the plane $x = ${p}$ it is a constant with slope $0$.`,
              `$${poly([a, "x^2"])}$ 不含 $y$，在平面 $x = ${p}$ 中它是常数，斜率为 $0$。`,
            ),
            why(
              b * q + 2 * c * p,
              `The values are swapped: substitute $x = ${p}$ and $y = ${q}$.`,
              `代入的值对调了：应代入 $x = ${p}$、$y = ${q}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Differentiate in y", "对 y 求导"],
                t(
                  `With $x$ held constant, $f_y = ${poly([b, "x"], [2 * c, "y"])}$.`,
                  `固定 $x$，$f_y = ${poly([b, "x"], [2 * c, "y"])}$。`,
                ),
              ],
              [
                ["Substitute the point", "代入该点"],
                t(
                  `$f_y(${p}, ${q}) = ${b} \\cdot ${paren(p)} + ${paren(2 * c)} \\cdot ${paren(q)} = ${slope}$.`,
                  `$f_y(${p}, ${q}) = ${b} \\cdot ${paren(p)} + ${paren(2 * c)} \\cdot ${paren(q)} = ${slope}$。`,
                ),
              ],
            ],
            t(
              `On the curve, $\\frac{z(${q + 1}) - z(${q - 1})}{2} = \\frac{${z(q + 1)} - ${paren(z(q - 1))}}{2} = ${slope}$, exact for a quadratic.`,
              `在这条曲线上，$\\frac{z(${q + 1}) - z(${q - 1})}{2} = \\frac{${z(q + 1)} - ${paren(z(q - 1))}}{2} = ${slope}$，对二次函数这是精确的。`,
            ),
          ),
        });
      },
    },
  ],
};

/** partialDifferentiabilityOfMultivariableFunctions covers differentiability conditions. */
export const partialDifferentiabilityOfMultivariableFunctions: TopicDef = {
  id: "partial-differentiability-of-multivariable-functions",
  title: t("Partial Differentiability of Multivariable Functions", "多元函数的可微性"),
  summary: t(
    "If the partial derivatives fx and fy exist and are continuous near a point, then f is differentiable at that point.",
    "若偏导数 fx 与 fy 在某点附近存在且连续，则函数在该点可微。",
  ),
  intro: t(
    "For $f(x, y) = x^3 + xy^2$, the partial derivatives $f_x = 3x^2 + y^2$ and $f_y = 2xy$ are polynomials, so they are continuous and $f$ is differentiable everywhere. At $(1, 2)$, $f_x = 7$ and $f_y = 4$, so a small step changes $f$ by about $7\\Delta x + 4\\Delta y$.\n\nCheck: $f(1.01, 2.01) - f(1, 2) = 5.110802 - 5 = 0.110802$, and $7(0.01) + 4(0.01) = 0.11$.\n\nIn this lesson we use continuity of the partial derivatives to show differentiability, and we compute partial derivatives from the definition where the rules do not apply.",
    "对 $f(x, y) = x^3 + xy^2$，偏导数 $f_x = 3x^2 + y^2$ 与 $f_y = 2xy$ 都是多项式，所以连续，$f$ 处处可微。在 $(1, 2)$ 处 $f_x = 7$，$f_y = 4$，所以小步长使 $f$ 大约变化 $7\\Delta x + 4\\Delta y$。\n\n检验：$f(1.01, 2.01) - f(1, 2) = 5.110802 - 5 = 0.110802$，而 $7(0.01) + 4(0.01) = 0.11$。\n\n本课我们用偏导数的连续性说明可微性，并在求导法则不适用的地方用定义求偏导数。",
  ),
  prerequisites: ["computing-partial-derivatives-using-the-rules-of-differentiation"],
  encompasses: [{ topic: "computing-partial-derivatives-using-the-rules-of-differentiation", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "sufficient-condition-for-differentiability",
      title: t("Sufficient condition for differentiability", "可微性的充分条件"),
      explanation: t(
        "A function $z = f(x, y)$ is **differentiable** at $(a, b)$ if $\\Delta z = f_x(a, b)\\Delta x + f_y(a, b)\\Delta y + \\varepsilon_1 \\Delta x + \\varepsilon_2 \\Delta y$, where $\\varepsilon_1, \\varepsilon_2 \\to 0$ as $(\\Delta x, \\Delta y) \\to (0, 0)$. A fundamental theorem states: if the partial derivatives $f_x$ and $f_y$ exist near $(a, b)$ and are continuous at $(a, b)$, then $f$ is differentiable at $(a, b)$.\n\nFor $f(x, y) = x^2y^3$, $f_x = 2xy^3$ and $f_y = 3x^2y^2$ are continuous everywhere, so $f$ is differentiable everywhere.\n\n> **Watch out.** Partial derivatives that merely exist are not enough: $\\frac{xy}{x^2 + y^2}$ with value $0$ at the origin has $f_x(0, 0) = f_y(0, 0) = 0$ but is not even continuous there. In a cross term such as $xy$, both partial derivatives pick up a piece.",
        "若 $\\Delta z = f_x(a, b)\\Delta x + f_y(a, b)\\Delta y + \\varepsilon_1 \\Delta x + \\varepsilon_2 \\Delta y$（其中当 $(\\Delta x, \\Delta y) \\to (0, 0)$ 时 $\\varepsilon_1, \\varepsilon_2 \\to 0$），则称函数 $z = f(x, y)$ 在 $(a, b)$ 处**可微**。基本定理表明：若偏导数 $f_x$ 与 $f_y$ 在 $(a, b)$ 附近存在且在 $(a, b)$ 处连续，则 $f$ 在 $(a, b)$ 处可微。\n\n对 $f(x, y) = x^2y^3$，$f_x = 2xy^3$ 与 $f_y = 3x^2y^2$ 处处连续，所以 $f$ 处处可微。\n\n> **注意。** 仅仅存在偏导数是不够的：在原点取值 $0$ 的 $\\frac{xy}{x^2 + y^2}$ 满足 $f_x(0, 0) = f_y(0, 0) = 0$，但在那里连续都谈不上。像 $xy$ 这样的交叉项，两个偏导数都会各得一部分。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-4, 4);
        const b = rng.nonZero(-4, 4);
        const c = rng.nonZero(-4, 4);
        const x0 = rng.int(-3, 3);
        const y0 = rng.int(-3, 3);
        const fx = 2 * a * x0 + c * y0;
        const fy = 2 * b * y0 + c * x0;
        const ans = fx + fy;
        const f = poly([a, "x^2"], [b, "y^2"], [c, "xy"]);
        return numberProblem({
          prompt: t(
            `Since $f_x$ and $f_y$ are continuous everywhere on $\\mathbb{R}^2$, the function $f(x, y) = ${f}$ is differentiable at all points. Calculate $f_x(${x0}, ${y0}) + f_y(${x0}, ${y0})$.`,
            `由于 $f_x$ 与 $f_y$ 在 $\\mathbb{R}^2$ 上处处连续，因此函数 $f(x, y) = ${f}$ 在所有点处均可微。计算 $f_x(${x0}, ${y0}) + f_y(${x0}, ${y0})$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(fx, `That is $f_x$ alone; add $f_y(${x0}, ${y0}) = ${fy}$.`, `这只是 $f_x$；还要加上 $f_y(${x0}, ${y0}) = ${fy}$。`),
            why(fy, `That is $f_y$ alone; add $f_x(${x0}, ${y0}) = ${fx}$.`, `这只是 $f_y$；还要加上 $f_x(${x0}, ${y0}) = ${fx}$。`),
            why(
              2 * a * x0 + 2 * b * y0,
              `The cross term $${poly([c, "xy"])}$ contributes $${poly([c, "y"])}$ to $f_x$ and $${poly([c, "x"])}$ to $f_y$.`,
              `交叉项 $${poly([c, "xy"])}$ 给 $f_x$ 贡献 $${poly([c, "y"])}$，给 $f_y$ 贡献 $${poly([c, "x"])}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the partial derivatives", "求偏导数"],
                t(
                  `$f_x = ${poly([2 * a, "x"], [c, "y"])}$ and $f_y = ${poly([2 * b, "y"], [c, "x"])}$, both continuous polynomials.`,
                  `$f_x = ${poly([2 * a, "x"], [c, "y"])}$，$f_y = ${poly([2 * b, "y"], [c, "x"])}$，都是连续的多项式。`,
                ),
              ],
              [
                ["Evaluate and add", "求值并相加"],
                t(
                  `$f_x(${x0}, ${y0}) = ${fx}$ and $f_y(${x0}, ${y0}) = ${fy}$, so the sum is $${fx} + ${paren(fy)} = ${ans}$.`,
                  `$f_x(${x0}, ${y0}) = ${fx}$，$f_y(${x0}, ${y0}) = ${fy}$，所以和为 $${fx} + ${paren(fy)} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `Along the diagonal, $g(t) = f(${poly([1, "t"], [x0, ""])}, ${poly([1, "t"], [y0, ""])})$ has $t$-coefficient $${2 * a} \\cdot ${paren(x0)} + ${paren(2 * b)} \\cdot ${paren(y0)} + ${paren(c)} \\cdot ${paren(x0 + y0)} = ${ans}$, and $g'(0) = f_x + f_y$.`,
              `沿对角线，$g(t) = f(${poly([1, "t"], [x0, ""])}, ${poly([1, "t"], [y0, ""])})$ 的 $t$ 的一次项系数为 $${2 * a} \\cdot ${paren(x0)} + ${paren(2 * b)} \\cdot ${paren(y0)} + ${paren(c)} \\cdot ${paren(x0 + y0)} = ${ans}$，而 $g'(0) = f_x + f_y$。`,
            ),
          ),
        });
      },
    },
    {
      id: "partial-derivatives-at-the-origin-from-the-definition",
      title: t("Partial derivatives at the origin from the definition", "用定义求原点处的偏导数"),
      explanation: t(
        "When a function is defined piecewise at the origin, the rules of differentiation do not apply there, so use the definition. For $f(x, y) = \\frac{ax^3 + by^3}{x^2 + y^2}$ with $f(0, 0) = 0$,\n\n$$f_x(0, 0) = \\lim_{h \\to 0} \\frac{f(h, 0) - f(0, 0)}{h} = \\lim_{h \\to 0} \\frac{ah^3 / h^2}{h} = a,$$\n\nand in the same way $f_y(0, 0) = b$. Only the values on the axes matter for these limits. For $\\frac{x^2y + 2x^3}{x^2 + y^2}$ with value $0$ at the origin, $f(h, 0) = 2h$, so $f_x(0, 0) = 2$.\n\n> **Watch out.** The formula gives $\\frac{0}{0}$ at the origin, so do not substitute into a derivative of it; use the value $f(0, 0)$ given. Set the other variable to $0$ first, so only one term survives.",
        "当函数在原点处分段定义时，求导法则在那里不适用，所以要用定义。对 $f(0, 0) = 0$ 的 $f(x, y) = \\frac{ax^3 + by^3}{x^2 + y^2}$，\n\n$$f_x(0, 0) = \\lim_{h \\to 0} \\frac{f(h, 0) - f(0, 0)}{h} = \\lim_{h \\to 0} \\frac{ah^3 / h^2}{h} = a,$$\n\n同理 $f_y(0, 0) = b$。这些极限只与坐标轴上的取值有关。对在原点取值 $0$ 的 $\\frac{x^2y + 2x^3}{x^2 + y^2}$，$f(h, 0) = 2h$，所以 $f_x(0, 0) = 2$。\n\n> **注意。** 公式在原点给出 $\\frac{0}{0}$，所以不能代入它的导数；要用给定的值 $f(0, 0)$。先把另一个变量设为 $0$，这样只剩下一项。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-9, 9) || 2;
        let b = rng.int(-9, 9) || -3;
        if (b === a) b = -a;
        const wantY = rng.int(0, 1) === 1;
        const ans = wantY ? b : a;
        const other = wantY ? a : b;
        const v = wantY ? "y" : "x";
        const at = wantY ? "(0, h)" : "(h, 0)";
        return numberProblem({
          prompt: t(
            `Let $f(x, y) = \\frac{${poly([a, "x^3"], [b, "y^3"])}}{x^2 + y^2}$ for $(x, y) \\ne (0, 0)$ and $f(0, 0) = 0$. Find $f_{${v}}(0, 0)$.`,
            `设 $(x, y) \\ne (0, 0)$ 时 $f(x, y) = \\frac{${poly([a, "x^3"], [b, "y^3"])}}{x^2 + y^2}$，且 $f(0, 0) = 0$。求 $f_{${v}}(0, 0)$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              0,
              "The value $f(0, 0) = 0$ does not make the derivative $0$; the difference quotient is the constant shown below.",
              "$f(0, 0) = 0$ 并不意味着导数为 $0$；差商是下面求出的常数。",
            ),
            why(
              other,
              `That is the other partial derivative; on the ${wantY ? "$y$" : "$x$"}-axis only the $${v}^3$ term survives.`,
              `这是另一个偏导数；在 ${wantY ? "$y$" : "$x$"} 轴上只剩下含 $${v}^3$ 的项。`,
            ),
            why(
              3 * ans,
              "The power $3$ does not come down: the definition gives $\\frac{h^3 / h^2}{h} = 1$ times the coefficient.",
              "指数 $3$ 不会乘下来：由定义 $\\frac{h^3 / h^2}{h} = 1$ 再乘系数。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Restrict to the axis", "限制在坐标轴上"],
                t(
                  `$f${at} = \\frac{${poly([ans, "h^3"])}}{h^2} = ${poly([ans, "h"])}$ for $h \\ne 0$.`,
                  `当 $h \\ne 0$ 时，$f${at} = \\frac{${poly([ans, "h^3"])}}{h^2} = ${poly([ans, "h"])}$。`,
                ),
              ],
              [
                ["Take the limit", "取极限"],
                t(
                  `$f_{${v}}(0, 0) = \\lim_{h \\to 0} \\frac{${poly([ans, "h"])} - 0}{h} = ${ans}$.`,
                  `$f_{${v}}(0, 0) = \\lim_{h \\to 0} \\frac{${poly([ans, "h"])} - 0}{h} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `The quotient does not depend on $h$: at $h = 1$, $\\frac{f${wantY ? "(0, 1)" : "(1, 0)"} - f(0, 0)}{1} = \\frac{${ans}}{1} = ${ans}$.`,
              `差商与 $h$ 无关：在 $h = 1$ 时，$\\frac{f${wantY ? "(0, 1)" : "(1, 0)"} - f(0, 0)}{1} = \\frac{${ans}}{1} = ${ans}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** higherOrderPartialDerivatives computes pure second partial derivatives. */
export const higherOrderPartialDerivatives: TopicDef = {
  id: "higher-order-partial-derivatives",
  title: t("Higher-Order Partial Derivatives", "高阶偏导数"),
  summary: t(
    "Second partial derivatives fxx and fyy are computed by repeatedly differentiating with respect to the same variable.",
    "二阶偏导数 fxx 与 fyy 是通过对同一变量连续求导两次计算得到的。",
  ),
  intro: t(
    "For $f(x, y) = x^3y^2 + 4y$, $f_x = 3x^2y^2$, and differentiating again in $x$ gives $f_{xx} = 6xy^2$. In the other variable, $f_y = 2x^3y + 4$ and $f_{yy} = 2x^3$. At $(1, 2)$, $f_{xx} = 24$.\n\nCheck: $\\frac{f_x(1.01, 2) - f_x(1, 2)}{0.01} = \\frac{12.2412 - 12}{0.01} = 24.12$, close to $24$.\n\nIn this lesson we differentiate two and three times, in the order the subscripts give, to find second and third partial derivatives.",
    "对 $f(x, y) = x^3y^2 + 4y$，$f_x = 3x^2y^2$，再对 $x$ 求导得 $f_{xx} = 6xy^2$。对另一个变量，$f_y = 2x^3y + 4$，$f_{yy} = 2x^3$。在 $(1, 2)$ 处 $f_{xx} = 24$。\n\n检验：$\\frac{f_x(1.01, 2) - f_x(1, 2)}{0.01} = \\frac{12.2412 - 12}{0.01} = 24.12$，接近 $24$。\n\n本课我们按下标给出的顺序求导两次、三次，求二阶和三阶偏导数。",
  ),
  prerequisites: ["computing-partial-derivatives-using-the-rules-of-differentiation"],
  encompasses: [{ topic: "computing-partial-derivatives-using-the-rules-of-differentiation", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "computing-second-pure-partial-derivatives",
      title: t("Computing second pure partial derivatives", "计算二阶纯偏导数"),
      explanation: t(
        "Differentiate the first partial derivative again with respect to the same variable, still treating the other variables as constants. The second pure partial derivative $f_{xx}$ is defined as:\n\n$$f_{xx} = \\frac{\\partial^2 f}{\\partial x^2} = \\frac{\\partial}{\\partial x}\\left(\\frac{\\partial f}{\\partial x}\\right).$$\n\nFor $f(x, y) = x^4y + y^2$, $f_x = 4x^3y$ and $f_{xx} = 12x^2y$.\n\n> **Watch out.** Stop only after the second derivative; the value of $f_x$ is not $f_{xx}$. A term such as $x^2y$ keeps a piece, $2y$, after two $x$-derivatives, while a term with no $x$ is gone after the first.",
        "把一阶偏导数再对同一个变量求导，仍然把其他变量当作常数。二阶纯偏导数 $f_{xx}$ 定义为：\n\n$$f_{xx} = \\frac{\\partial^2 f}{\\partial x^2} = \\frac{\\partial}{\\partial x}\\left(\\frac{\\partial f}{\\partial x}\\right)$$\n\n对 $f(x, y) = x^4y + y^2$，$f_x = 4x^3y$，$f_{xx} = 12x^2y$。\n\n> **注意。** 要求到第二次导数才停；$f_x$ 的值不是 $f_{xx}$。像 $x^2y$ 这样的项对 $x$ 求导两次后还剩 $2y$，而不含 $x$ 的项第一次求导就消失了。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-4, 4);
        const b = rng.nonZero(-4, 4);
        const c = rng.nonZero(-4, 4);
        const x0 = rng.int(-2, 2);
        const y0 = rng.int(-2, 2);
        const ans = 6 * a * x0 + 2 * b * y0;
        const f = poly([a, "x^3"], [b, "x^2y"], [c, "y^3"]);
        const F = (x: number) => a * x ** 3 + b * x * x * y0 + c * y0 ** 3;
        return numberProblem({
          prompt: t(
            `Calculate the second partial derivative $f_{xx}(${x0}, ${y0})$ for the function $f(x, y) = ${f}$ at the point $(${x0}, ${y0})$.`,
            `计算函数 $f(x, y) = ${f}$ 在点 $(${x0}, ${y0})$ 处的二阶偏导数 $f_{xx}(${x0}, ${y0})$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(3 * a * x0 * x0 + 2 * b * x0 * y0, "That is $f_x$; differentiate in $x$ once more.", "这是 $f_x$；还要再对 $x$ 求导一次。"),
            why(
              6 * a * x0,
              `$${poly([b, "x^2y"])}$ keeps $${poly([2 * b, "y"])}$ after two $x$-derivatives; it does not vanish.`,
              `$${poly([b, "x^2y"])}$ 对 $x$ 求导两次后还剩 $${poly([2 * b, "y"])}$，不会消失。`,
            ),
            why(6 * c * y0, "That is $f_{yy}$; here both derivatives are in $x$.", "这是 $f_{yy}$；这里两次都对 $x$ 求导。"),
          ]),
          solution: walked(
            [
              [
                ["Differentiate once in x", "对 x 求导一次"],
                t(`$f_x = ${poly([3 * a, "x^2"], [2 * b, "xy"])}$.`, `$f_x = ${poly([3 * a, "x^2"], [2 * b, "xy"])}$。`),
              ],
              [
                ["Differentiate again in x", "再对 x 求导"],
                t(`$f_{xx} = ${poly([6 * a, "x"], [2 * b, "y"])}$.`, `$f_{xx} = ${poly([6 * a, "x"], [2 * b, "y"])}$。`),
              ],
              [
                ["Substitute the point", "代入该点"],
                t(
                  `$f_{xx}(${x0}, ${y0}) = ${6 * a} \\cdot ${paren(x0)} + ${paren(2 * b)} \\cdot ${paren(y0)} = ${ans}$.`,
                  `$f_{xx}(${x0}, ${y0}) = ${6 * a} \\cdot ${paren(x0)} + ${paren(2 * b)} \\cdot ${paren(y0)} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `For a cubic in $x$ the second difference is exact: $f(${x0 + 1}, ${y0}) - 2f(${x0}, ${y0}) + f(${x0 - 1}, ${y0}) = ${F(x0 + 1)} - ${paren(2 * F(x0))} + ${paren(F(x0 - 1))} = ${ans}$.`,
              `对关于 $x$ 的三次函数，二阶差分是精确的：$f(${x0 + 1}, ${y0}) - 2f(${x0}, ${y0}) + f(${x0 - 1}, ${y0}) = ${F(x0 + 1)} - ${paren(2 * F(x0))} + ${paren(F(x0 - 1))} = ${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "third-order-partial-derivatives",
      title: t("Third-order partial derivatives", "三阶偏导数"),
      explanation: t(
        "A third-order partial derivative such as $f_{xxy}$ is found by differentiating three times, in the order the subscripts are read from left to right: first with respect to $x$, then $x$ again, then $y$. Each step treats the other variable as a constant. Terms disappear as soon as their power of the current variable runs out.\n\nFor $f(x, y) = x^4y^3$, $f_{xx} = 12x^2y^3$ and $f_{xxy} = 36x^2y^2$.\n\n> **Watch out.** Take all three derivatives: two in $x$ and then one in $y$. A term with a single $x$, such as $xy$, is gone after the second $x$-derivative, and each power that comes down multiplies the coefficient.",
        "像 $f_{xxy}$ 这样的三阶偏导数要求导三次，顺序按下标从左到右：先对 $x$，再对 $x$，最后对 $y$。每一步都把另一个变量当作常数。某一项一旦当前变量的次数用完就会消失。\n\n对 $f(x, y) = x^4y^3$，$f_{xx} = 12x^2y^3$，$f_{xxy} = 36x^2y^2$。\n\n> **注意。** 三次导数都要求：两次对 $x$，再一次对 $y$。只含一个 $x$ 的项，如 $xy$，在第二次对 $x$ 求导后就消失了；每次乘下来的指数都要乘进系数。",
      ),
      generate(rng: Rng): Problem {
        const A = rng.int(-3, 3) || 1;
        const B = rng.int(-3, 3) || 2;
        const C = rng.int(-6, 6);
        const p = rng.int(-3, 3);
        const q = rng.int(-3, 3) || 1;
        const ans = 12 * A * p * q + 6 * B * q * q;
        const f = poly([A, "x^3y^2"], [B, "x^2y^3"], [C, "xy"]);
        return numberProblem({
          prompt: t(`Find $f_{xxy}(${p}, ${q})$ for $f(x, y) = ${f}$.`, `对 $f(x, y) = ${f}$，求 $f_{xxy}(${p}, ${q})$。`),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              6 * A * p * q * q + 2 * B * q * q * q,
              "That is $f_{xx}$; one more derivative, in $y$, is needed.",
              "这是 $f_{xx}$；还要再对 $y$ 求导一次。",
            ),
            ...(C === 0
              ? []
              : [
                  why(
                    ans + C,
                    `$${poly([C, "xy"])}$ has only one $x$, so it is gone after the second $x$-derivative.`,
                    `$${poly([C, "xy"])}$ 只含一个 $x$，第二次对 $x$ 求导后就消失了。`,
                  ),
                ]),
            why(
              12 * A * p * q + 3 * B * q * q,
              `The factor $2$ from $x^2$ stays: $${poly([B, "x^2y^3"])}$ gives $${poly([6 * B, "y^2"])}$.`,
              `$x^2$ 乘下来的因子 $2$ 要保留：$${poly([B, "x^2y^3"])}$ 得 $${poly([6 * B, "y^2"])}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["First x-derivative", "第一次对 x 求导"],
                t(
                  `$f_x = ${poly([3 * A, "x^2y^2"], [2 * B, "xy^3"], [C, "y"])}$.`,
                  `$f_x = ${poly([3 * A, "x^2y^2"], [2 * B, "xy^3"], [C, "y"])}$。`,
                ),
              ],
              [
                ["Second x-derivative", "第二次对 x 求导"],
                t(`$f_{xx} = ${poly([6 * A, "xy^2"], [2 * B, "y^3"])}$.`, `$f_{xx} = ${poly([6 * A, "xy^2"], [2 * B, "y^3"])}$。`),
              ],
              [
                ["Then the y-derivative", "再对 y 求导"],
                t(
                  `$f_{xxy} = ${poly([12 * A, "xy"], [6 * B, "y^2"])}$, which at $(${p}, ${q})$ is $${ans}$.`,
                  `$f_{xxy} = ${poly([12 * A, "xy"], [6 * B, "y^2"])}$，在 $(${p}, ${q})$ 处为 $${ans}$。`,
                ),
              ],
            ],
            t(
              `In the order $y$, $x$, $x$: $f_y = ${poly([2 * A, "x^3y"], [3 * B, "x^2y^2"], [C, "x"])}$, $f_{yx} = ${poly([6 * A, "x^2y"], [6 * B, "xy^2"], [C, ""])}$, $f_{yxx} = ${poly([12 * A, "xy"], [6 * B, "y^2"])}$, the same.`,
              `按 $y$、$x$、$x$ 的顺序：$f_y = ${poly([2 * A, "x^3y"], [3 * B, "x^2y^2"], [C, "x"])}$，$f_{yx} = ${poly([6 * A, "x^2y"], [6 * B, "xy^2"], [C, ""])}$，$f_{yxx} = ${poly([12 * A, "xy"], [6 * B, "y^2"])}$，结果相同。`,
            ),
          ),
        });
      },
    },
  ],
};

/** equalityOfMixedPartialDerivatives explores Clairaut's Theorem fxy = fyx. */
export const equalityOfMixedPartialDerivatives: TopicDef = {
  id: "equality-of-mixed-partial-derivatives",
  title: t("Equality of Mixed Partial Derivatives", "混合偏导数相等性"),
  summary: t(
    "Clairaut's theorem guarantees that mixed second partial derivatives are equal, fxy = fyx, whenever they are continuous.",
    "克莱罗定理保证了当二阶混合偏导数连续时，它们相互相等，即 fxy = fyx。",
  ),
  intro: t(
    "For $f(x, y) = x^3y^2 + 5x$, differentiating in $x$ and then $y$ gives $f_x = 3x^2y^2 + 5$ and $f_{xy} = 6x^2y$. In the other order, $f_y = 2x^3y$ and $f_{yx} = 6x^2y$, the same.\n\nCheck: at $(1, 2)$ both orders give $6 \\cdot 1 \\cdot 2 = 12$.\n\nIn this lesson we use Clairaut's theorem to compute mixed partial derivatives in whichever order is easiest.",
    "对 $f(x, y) = x^3y^2 + 5x$，先对 $x$ 再对 $y$ 求导，得 $f_x = 3x^2y^2 + 5$，$f_{xy} = 6x^2y$。换个顺序，$f_y = 2x^3y$，$f_{yx} = 6x^2y$，结果相同。\n\n检验：在 $(1, 2)$ 处两种顺序都给出 $6 \\cdot 1 \\cdot 2 = 12$。\n\n本课我们利用克莱罗定理，按最省事的顺序计算混合偏导数。",
  ),
  prerequisites: ["higher-order-partial-derivatives"],
  encompasses: [{ topic: "higher-order-partial-derivatives", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "applying-clairauts-theorem",
      title: t("Applying Clairaut's Theorem", "应用克莱罗定理"),
      explanation: t(
        "**Clairaut's Theorem** (Schwarz's Theorem): If $f(x, y)$ is defined on an open disk containing $(a, b)$, and $f_{xy}$ and $f_{yx}$ are both continuous on that disk, then:\n\n$$f_{xy}(a, b) = f_{yx}(a, b).$$\n\nFor $f(x, y) = x^3y + xy^4$, $f_x = 3x^2y + y^4$ and $f_{xy} = 3x^2 + 4y^3$; starting with $y$ gives the same.\n\n> **Watch out.** A mixed derivative takes one derivative in each variable, so a term such as $xy$ leaves its coefficient, not $0$. Every power that comes down multiplies: $x^2y^2$ gives $4xy$.",
        "**克莱罗定理**（施瓦茨定理）：若 $f(x, y)$ 在包含点 $(a, b)$ 的开圆盘上有定义，且 $f_{xy}$ 与 $f_{yx}$ 在该圆盘上均连续，则：\n\n$$f_{xy}(a, b) = f_{yx}(a, b)$$\n\n对 $f(x, y) = x^3y + xy^4$，$f_x = 3x^2y + y^4$，$f_{xy} = 3x^2 + 4y^3$；先对 $y$ 求导结果相同。\n\n> **注意。** 混合偏导数对每个变量各求一次导，所以像 $xy$ 这样的项留下它的系数，而不是 $0$。乘下来的每个指数都要相乘：$x^2y^2$ 得 $4xy$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-4, 4);
        const b = rng.nonZero(-4, 4);
        const x0 = rng.int(-2, 2);
        const y0 = rng.int(-2, 2);
        const ans = 4 * a * x0 * y0 + b;
        const f = poly([a, "x^2y^2"], [b, "xy"]);
        return numberProblem({
          prompt: t(
            `Calculate the mixed partial derivative $f_{xy}(${x0}, ${y0})$ for the function $f(x, y) = ${f}$ at the point $(${x0}, ${y0})$.`,
            `计算函数 $f(x, y) = ${f}$ 在点 $(${x0}, ${y0})$ 处的二阶混合偏导数 $f_{xy}(${x0}, ${y0})$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              2 * a * x0 * y0 + b,
              `Both powers come down: $${poly([a, "x^2y^2"])}$ gives $${poly([4 * a, "xy"])}$, not $${poly([2 * a, "xy"])}$.`,
              `两个指数都要乘下来：$${poly([a, "x^2y^2"])}$ 得 $${poly([4 * a, "xy"])}$，不是 $${poly([2 * a, "xy"])}$。`,
            ),
            why(
              4 * a * x0 * y0,
              `$${poly([b, "xy"])}$ leaves $${b}$ after one derivative in each variable; it does not vanish.`,
              `$${poly([b, "xy"])}$ 对每个变量各求一次导后留下 $${b}$，不会消失。`,
            ),
            why(
              2 * a * y0 * y0,
              "That is $f_{xx}$; a mixed derivative takes one derivative in $x$ and one in $y$.",
              "这是 $f_{xx}$；混合偏导数是对 $x$、对 $y$ 各求一次导。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Differentiate in x", "对 x 求导"],
                t(`$f_x = ${poly([2 * a, "xy^2"], [b, "y"])}$.`, `$f_x = ${poly([2 * a, "xy^2"], [b, "y"])}$。`),
              ],
              [
                ["Then in y", "再对 y 求导"],
                t(
                  `$f_{xy} = ${poly([4 * a, "xy"], [b, ""])}$, so $f_{xy}(${x0}, ${y0}) = ${4 * a} \\cdot ${paren(x0)} \\cdot ${paren(y0)} + ${paren(b)} = ${ans}$.`,
                  `$f_{xy} = ${poly([4 * a, "xy"], [b, ""])}$，所以 $f_{xy}(${x0}, ${y0}) = ${4 * a} \\cdot ${paren(x0)} \\cdot ${paren(y0)} + ${paren(b)} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `In the other order, $f_y = ${poly([2 * a, "x^2y"], [b, "x"])}$ and $f_{yx} = ${poly([4 * a, "xy"], [b, ""])}$, the same, as Clairaut's theorem says.`,
              `换个顺序，$f_y = ${poly([2 * a, "x^2y"], [b, "x"])}$，$f_{yx} = ${poly([4 * a, "xy"], [b, ""])}$，结果相同，正如克莱罗定理所说。`,
            ),
          ),
        });
      },
    },
    {
      id: "reordering-third-order-mixed-partials",
      title: t("Reordering third-order mixed partials", "三阶混合偏导数的换序"),
      explanation: t(
        "When the partial derivatives are continuous, Clairaut's theorem lets you differentiate in any order: $f_{yxy} = f_{xyy} = f_{yyx}$, since each takes one derivative in $x$ and two in $y$. Choose the order that makes the work easiest. Only the number of derivatives in each variable matters, not their order.\n\nFor $f(x, y) = x^3y^2$, $f_{yxy} = f_{xyy}$: $f_x = 3x^2y^2$, $f_{xy} = 6x^2y$, $f_{xyy} = 6x^2$.\n\n> **Watch out.** $f_{yxy}$ has two $y$'s and one $x$, so it is not $f_{xxy}$. A term such as $xy^2$ survives exactly these three derivatives and leaves twice its coefficient.",
        "当偏导数连续时，克莱罗定理允许以任意顺序求导：$f_{yxy} = f_{xyy} = f_{yyx}$，因为它们都对 $x$ 求一次导、对 $y$ 求两次导。选择最省事的顺序。只有对每个变量求导的次数重要，顺序无关。\n\n对 $f(x, y) = x^3y^2$，$f_{yxy} = f_{xyy}$：$f_x = 3x^2y^2$，$f_{xy} = 6x^2y$，$f_{xyy} = 6x^2$。\n\n> **注意。** $f_{yxy}$ 含两个 $y$、一个 $x$，所以它不是 $f_{xxy}$。像 $xy^2$ 这样的项恰好经得住这三次求导，留下系数的 $2$ 倍。",
      ),
      generate(rng: Rng): Problem {
        const A = rng.int(-3, 3) || 1;
        const B = rng.int(-5, 5) || 2;
        const C = rng.int(-4, 4);
        const p = rng.int(-3, 3) || 2;
        const q = rng.int(-3, 3);
        const ans = 12 * A * p * q + 2 * B;
        const f = poly([A, "x^2y^3"], [B, "xy^2"], [C, "x^3"]);
        return numberProblem({
          prompt: t(`Find $f_{yxy}(${p}, ${q})$ for $f(x, y) = ${f}$.`, `对 $f(x, y) = ${f}$，求 $f_{yxy}(${p}, ${q})$。`),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              12 * A * p * q,
              `$${poly([B, "xy^2"])}$ survives one $x$- and two $y$-derivatives and leaves $${2 * B}$.`,
              `$${poly([B, "xy^2"])}$ 经过一次对 $x$、两次对 $y$ 的求导后留下 $${2 * B}$。`,
            ),
            why(
              6 * A * p * q + 2 * B,
              `Both powers come down: $${poly([A, "x^2y^3"])}$ gives $${poly([12 * A, "xy"])}$ after these three derivatives.`,
              `两个指数都要乘下来：$${poly([A, "x^2y^3"])}$ 经这三次求导得 $${poly([12 * A, "xy"])}$。`,
            ),
            why(
              6 * A * q * q,
              "That is $f_{xxy}$, two derivatives in $x$; $f_{yxy}$ has two in $y$.",
              "这是 $f_{xxy}$，对 $x$ 求了两次导；$f_{yxy}$ 是对 $y$ 求两次。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Differentiate in y", "对 y 求导"],
                t(`$f_y = ${poly([3 * A, "x^2y^2"], [2 * B, "xy"])}$.`, `$f_y = ${poly([3 * A, "x^2y^2"], [2 * B, "xy"])}$。`),
              ],
              [
                ["Then in x", "再对 x 求导"],
                t(`$f_{yx} = ${poly([6 * A, "xy^2"], [2 * B, "y"])}$.`, `$f_{yx} = ${poly([6 * A, "xy^2"], [2 * B, "y"])}$。`),
              ],
              [
                ["Then in y again", "再对 y 求导"],
                t(
                  `$f_{yxy} = ${poly([12 * A, "xy"], [2 * B, ""])}$, which at $(${p}, ${q})$ is $${ans}$.`,
                  `$f_{yxy} = ${poly([12 * A, "xy"], [2 * B, ""])}$，在 $(${p}, ${q})$ 处为 $${ans}$。`,
                ),
              ],
            ],
            t(
              `In the order $x$, $y$, $y$: $f_x = ${poly([2 * A, "xy^3"], [B, "y^2"], [3 * C, "x^2"])}$, $f_{xy} = ${poly([6 * A, "xy^2"], [2 * B, "y"])}$, $f_{xyy} = ${poly([12 * A, "xy"], [2 * B, ""])}$, the same.`,
              `按 $x$、$y$、$y$ 的顺序：$f_x = ${poly([2 * A, "xy^3"], [B, "y^2"], [3 * C, "x^2"])}$，$f_{xy} = ${poly([6 * A, "xy^2"], [2 * B, "y"])}$，$f_{xyy} = ${poly([12 * A, "xy"], [2 * B, ""])}$，结果相同。`,
            ),
          ),
        });
      },
    },
  ],
};

/** tangentPlanesToSurfaces computes equations of tangent planes z - z0 = fx(x - x0) + fy(y - y0). */
export const tangentPlanesToSurfaces: TopicDef = {
  id: "tangent-planes-to-surfaces",
  title: t("Tangent Planes to Surfaces", "曲面的切平面"),
  summary: t(
    "The tangent plane to z = f(x, y) at (x0, y0, z0) is given by z - z0 = fx(x0, y0)(x - x0) + fy(x0, y0)(y - y0).",
    "曲面 z = f(x, y) 在点 (x0, y0, z0) 处的切平面方程为 z - z0 = fx(x0, y0)(x - x0) + fy(x0, y0)(y - y0)。",
  ),
  intro: t(
    "For $z = x^3 + y^2$ at $(1, 2)$, the height is $z_0 = 5$ and the slopes are $f_x = 3x^2 = 3$ and $f_y = 2y = 4$. The tangent plane is $z - 5 = 3(x - 1) + 4(y - 2)$, or $3x + 4y - z = 6$.\n\nCheck: the point $(1, 2, 5)$ gives $3 + 8 - 5 = 6$. Near it, the plane predicts $z = 5.3$ at $(1.1, 2)$, and the surface gives $1.331 + 4 = 5.331$.\n\nIn this lesson we write the tangent plane to a graph from its two partial derivatives and find where it crosses the $z$-axis.",
    "对 $z = x^3 + y^2$ 在 $(1, 2)$ 处，高度 $z_0 = 5$，斜率 $f_x = 3x^2 = 3$，$f_y = 2y = 4$。切平面为 $z - 5 = 3(x - 1) + 4(y - 2)$，即 $3x + 4y - z = 6$。\n\n检验：点 $(1, 2, 5)$ 代入得 $3 + 8 - 5 = 6$。在它附近，平面在 $(1.1, 2)$ 处预测 $z = 5.3$，而曲面给出 $1.331 + 4 = 5.331$。\n\n本课我们由两个偏导数写出图像的切平面，并求它与 $z$ 轴的交点。",
  ),
  prerequisites: ["computing-partial-derivatives-using-the-rules-of-differentiation", "the-cartesian-equation-of-a-plane"],
  encompasses: [{ topic: "computing-partial-derivatives-using-the-rules-of-differentiation", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "finding-equations-of-tangent-planes",
      figure: multivariableDrawings2["tangent-planes-to-surfaces#finding-equations-of-tangent-planes"],
      title: t("Finding equations of tangent planes", "求切平面方程"),
      explanation: t(
        "The tangent plane is the flat surface that best matches the graph at a point, and its tilt in each direction is given by the partial derivatives there. For a differentiable function $z = f(x, y)$, the tangent plane at $(x_0, y_0, z_0)$ has equation:\n\n$$z - z_0 = f_x(x_0, y_0)(x - x_0) + f_y(x_0, y_0)(y - y_0).$$\n\nFor $z = x^2y$ at $(2, 1)$: $z_0 = 4$, $f_x = 2xy = 4$ and $f_y = x^2 = 4$, so $z - 4 = 4(x - 2) + 4(y - 1)$, that is $4x + 4y - z = 8$.\n\n> **Watch out.** The slopes are the values of $f_x$ and $f_y$ at the point, not the coefficients of $f$. Keep the shifts $x - x_0$ and $y - y_0$: without them the plane passes through the wrong point. Moving $z$ to the left gives $-z$.",
        "切平面是在一点处与图像最贴合的平面，它在各方向上的倾斜程度由该点的偏导数给出。对于可微函数 $z = f(x, y)$，其在点 $(x_0, y_0, z_0)$ 处的切平面方程为：\n\n$$z - z_0 = f_x(x_0, y_0)(x - x_0) + f_y(x_0, y_0)(y - y_0)$$\n\n对 $z = x^2y$ 在 $(2, 1)$ 处：$z_0 = 4$，$f_x = 2xy = 4$，$f_y = x^2 = 4$，所以 $z - 4 = 4(x - 2) + 4(y - 1)$，即 $4x + 4y - z = 8$。\n\n> **注意。** 斜率是 $f_x$ 和 $f_y$ 在该点的值，不是 $f$ 的系数。要保留平移 $x - x_0$ 和 $y - y_0$，否则平面经过的点就错了。把 $z$ 移到左边得 $-z$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        let x0 = rng.int(-2, 2);
        const y0 = rng.int(-2, 2);
        if (x0 === 0 && y0 === 0) x0 = 1;
        const z0 = a * x0 * x0 + b * y0 * y0;
        const fx = 2 * a * x0;
        const fy = 2 * b * y0;
        const constTerm = fx * x0 + fy * y0 - z0;
        const answer = `${poly([fx, "x"], [fy, "y"], [-1, "z"])} = ${constTerm}`;
        const surface = poly([a, "x^2"], [b, "y^2"]);
        return equationWith(
          {
            prompt: t(
              `Find the equation of the tangent plane to the surface $z = ${surface}$ at the point $(${x0}, ${y0}, ${z0})$.`,
              `求曲面 $z = ${surface}$ 在点 $(${x0}, ${y0}, ${z0})$ 处的切平面方程。`,
            ),
            answer,
            solution: walked(
              [
                [
                  ["Find the slopes", "求斜率"],
                  t(
                    `$f_x = ${poly([2 * a, "x"])}$ and $f_y = ${poly([2 * b, "y"])}$, so at $(${x0}, ${y0})$: $f_x = ${fx}$ and $f_y = ${fy}$.`,
                    `$f_x = ${poly([2 * a, "x"])}$，$f_y = ${poly([2 * b, "y"])}$，所以在 $(${x0}, ${y0})$ 处 $f_x = ${fx}$，$f_y = ${fy}$。`,
                  ),
                ],
                [
                  ["Apply the formula", "代入公式"],
                  t(
                    `$z - ${paren(z0)} = ${fx}(x - ${paren(x0)}) + ${paren(fy)}(y - ${paren(y0)})$.`,
                    `$z - ${paren(z0)} = ${fx}(x - ${paren(x0)}) + ${paren(fy)}(y - ${paren(y0)})$。`,
                  ),
                ],
                [["Collect the terms", "整理"], t(`$${answer}$.`, `$${answer}$。`)],
              ],
              t(
                `The point lies on the plane: $${fx} \\cdot ${paren(x0)} + ${paren(fy)} \\cdot ${paren(y0)} - ${paren(z0)} = ${constTerm}$.`,
                `该点在平面上：$${fx} \\cdot ${paren(x0)} + ${paren(fy)} \\cdot ${paren(y0)} - ${paren(z0)} = ${constTerm}$。`,
              ),
            ),
          },
          [
            say(
              `${poly([fy, "x"], [fx, "y"], [-1, "z"])} = ${constTerm}`,
              "The slopes are swapped: $f_x$ multiplies $x - x_0$ and $f_y$ multiplies $y - y_0$.",
              "斜率颠倒了：$f_x$ 乘 $x - x_0$，$f_y$ 乘 $y - y_0$。",
            ),
            say(
              `${poly([fx, "x"], [fy, "y"], [1, "z"])} = ${constTerm}`,
              "Moving $z$ from the right side to the left changes its sign: the term is $-z$.",
              "把 $z$ 从右边移到左边要变号：这一项是 $-z$。",
            ),
            say(
              `${poly([a, "x"], [b, "y"], [-1, "z"])} = 0`,
              `The slopes are the values $f_x = ${fx}$ and $f_y = ${fy}$ at the point, not the coefficients of $f$.`,
              `斜率是该点处的值 $f_x = ${fx}$ 和 $f_y = ${fy}$，不是 $f$ 的系数。`,
            ),
            say(
              `${poly([fx, "x"], [fy, "y"], [-1, "z"])} = ${-z0}`,
              "The plane must pass through the point: use $x - x_0$ and $y - y_0$, not $x$ and $y$.",
              "平面必须经过该点：要用 $x - x_0$ 和 $y - y_0$，不是 $x$ 和 $y$。",
            ),
          ],
        );
      },
    },
    {
      id: "the-z-intercept-of-a-tangent-plane",
      title: t("The z-intercept of a tangent plane", "切平面的 z 截距"),
      explanation: t(
        "The tangent plane to $z = f(x, y)$ at $(a, b)$ is\n\n$$z = f(a, b) + f_x(a, b)(x - a) + f_y(a, b)(y - b).$$\n\nIts $z$-intercept is where $x = y = 0$:\n\n$$z_0 = f(a, b) - a f_x(a, b) - b f_y(a, b).$$\n\nFor $z = x^3 + y$ at $(1, 0)$: $f = 1$, $f_x = 3$ and $f_y = 1$, so $z_0 = 1 - 1 \\cdot 3 - 0 \\cdot 1 = -2$.\n\n> **Watch out.** Put $x = y = 0$ into the plane, not into the surface: $f(0, 0)$ is where the surface crosses the $z$-axis. Each shift gives a minus sign, $-a f_x$ and $-b f_y$, and with a negative coordinate that minus meets another.",
        "$z = f(x, y)$ 在 $(a, b)$ 处的切平面为\n\n$$z = f(a, b) + f_x(a, b)(x - a) + f_y(a, b)(y - b).$$\n\n它的 $z$ 截距在 $x = y = 0$ 处：\n\n$$z_0 = f(a, b) - a f_x(a, b) - b f_y(a, b).$$\n\n对 $z = x^3 + y$ 在 $(1, 0)$ 处：$f = 1$，$f_x = 3$，$f_y = 1$，所以 $z_0 = 1 - 1 \\cdot 3 - 0 \\cdot 1 = -2$。\n\n> **注意。** 要把 $x = y = 0$ 代入平面，而不是代入曲面：$f(0, 0)$ 是曲面与 $z$ 轴的交点。每个平移都带来一个负号，即 $-a f_x$ 和 $-b f_y$；坐标为负时这个负号会与另一个负号相遇。",
      ),
      generate(rng: Rng): Problem {
        const A = rng.int(-3, 3) || 1;
        const B = rng.int(-3, 3);
        const D = rng.int(-5, 5) || 3;
        const a = rng.int(-3, 3) || 1;
        const b = rng.int(-3, 3);
        const f = A * a * a + B * a * b + D * b;
        const fx = 2 * A * a + B * b;
        const fy = B * a + D;
        const z0 = f - a * fx - b * fy;
        const surface = poly([A, "x^2"], [B, "xy"], [D, "y"]);
        return numberProblem({
          prompt: t(
            `Find the $z$-intercept of the tangent plane to $z = ${surface}$ at $(${a}, ${b})$.`,
            `求 $z = ${surface}$ 在 $(${a}, ${b})$ 处切平面的 $z$ 截距。`,
          ),
          answer: z0,
          mistakes: distinct(z0, [
            why(
              f,
              `$${f}$ is the height of the plane at $(${a}, ${b})$; at $x = y = 0$ the shifts add $-a f_x - b f_y$.`,
              `$${f}$ 是平面在 $(${a}, ${b})$ 处的高度；在 $x = y = 0$ 处还要加上 $-a f_x - b f_y$。`,
            ),
            why(
              f + a * fx + b * fy,
              "At $x = 0$ the shift $x - a$ is $-a$, so the terms are subtracted.",
              "在 $x = 0$ 处平移 $x - a$ 等于 $-a$，所以这些项要减去。",
            ),
            why(
              f - a * fx,
              `The $y$-shift also contributes: subtract $b f_y = ${paren(b)} \\cdot ${paren(fy)}$ too.`,
              `$y$ 方向的平移也有贡献：还要减去 $b f_y = ${paren(b)} \\cdot ${paren(fy)}$。`,
            ),
            why(
              0,
              "$0$ is where the surface crosses the $z$-axis; the tangent plane crosses it elsewhere.",
              "$0$ 是曲面与 $z$ 轴的交点；切平面与 $z$ 轴交于别处。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Evaluate at the point", "在该点求值"],
                t(
                  `$f(${a}, ${b}) = ${f}$, $f_x = ${poly([2 * A, "x"], [B, "y"])} = ${fx}$ and $f_y = ${poly([B, "x"], [D, ""])} = ${fy}$.`,
                  `$f(${a}, ${b}) = ${f}$，$f_x = ${poly([2 * A, "x"], [B, "y"])} = ${fx}$，$f_y = ${poly([B, "x"], [D, ""])} = ${fy}$。`,
                ),
              ],
              [
                ["Set x and y to zero", "令 x 和 y 为零"],
                t(
                  `$z_0 = ${f} - ${paren(a)} \\cdot ${paren(fx)} - ${paren(b)} \\cdot ${paren(fy)} = ${z0}$.`,
                  `$z_0 = ${f} - ${paren(a)} \\cdot ${paren(fx)} - ${paren(b)} \\cdot ${paren(fy)} = ${z0}$。`,
                ),
              ],
            ],
            t(
              `Going back from $(0, 0, ${z0})$ to the point along the plane adds $${paren(a)} \\cdot ${paren(fx)} + ${paren(b)} \\cdot ${paren(fy)} = ${a * fx + b * fy}$, giving $${z0} + ${paren(a * fx + b * fy)} = ${f}$, the height of the surface.`,
              `沿平面从 $(0, 0, ${z0})$ 回到该点要加上 $${paren(a)} \\cdot ${paren(fx)} + ${paren(b)} \\cdot ${paren(fy)} = ${a * fx + b * fy}$，得 $${z0} + ${paren(a * fx + b * fy)} = ${f}$，正是曲面的高度。`,
            ),
          ),
        });
      },
    },
  ],
};

/** linearizationOfMultivariableFunctions linear approximation L(x, y). */
export const linearizationOfMultivariableFunctions: TopicDef = {
  id: "linearization-of-multivariable-functions",
  title: t("Linearization of Multivariable Functions", "多元函数的线性化"),
  summary: t(
    "The linearization L(x, y) = f(a, b) + fx(a, b)(x - a) + fy(a, b)(y - b) provides the best linear approximation to f near (a, b).",
    "线性化 L(x, y) = f(a, b) + fx(a, b)(x - a) + fy(a, b)(y - b) 提供了函数在 (a, b) 附近的最佳线性逼近。",
  ),
  intro: t(
    "For $f(x, y) = xy^2$ at $(2, 1)$: $f = 2$, $f_x = y^2 = 1$ and $f_y = 2xy = 4$, so $L(x, y) = 2 + (x - 2) + 4(y - 1)$. It estimates $f(2.1, 0.9) \\approx 2 + 0.1 - 0.4 = 1.7$.\n\nCheck: exactly, $f(2.1, 0.9) = 2.1 \\cdot 0.81 = 1.701$.\n\nIn this lesson we build the linearization of a function of two variables and use it to estimate values near the center.",
    "对 $f(x, y) = xy^2$ 在 $(2, 1)$ 处：$f = 2$，$f_x = y^2 = 1$，$f_y = 2xy = 4$，所以 $L(x, y) = 2 + (x - 2) + 4(y - 1)$。它估计 $f(2.1, 0.9) \\approx 2 + 0.1 - 0.4 = 1.7$。\n\n检验：精确值 $f(2.1, 0.9) = 2.1 \\cdot 0.81 = 1.701$。\n\n本课我们写出二元函数的线性化，并用它估计中心附近的函数值。",
  ),
  prerequisites: ["tangent-planes-to-surfaces"],
  encompasses: [{ topic: "tangent-planes-to-surfaces", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "computing-linearizations",
      title: t("Computing linearizations", "计算线性化表达式"),
      explanation: t(
        "The linearization is the tangent plane written as a function, and it gives good estimates of the function at points near the center. The **linearization** of $f(x, y)$ at $(a, b)$ is:\n\n$$L(x, y) = f(a, b) + f_x(a, b)(x - a) + f_y(a, b)(y - b).$$\n\nFor $f = x^2y$ at $(1, 3)$: $f = 3$, $f_x = 2xy = 6$ and $f_y = x^2 = 1$, so $L = 3 + 6(x - 1) + (y - 3) = 6x + y - 6$.\n\n> **Watch out.** $L$ uses the shifts $x - a$ and $y - b$; writing $f(a, b) + f_x x + f_y y$ is right only at the origin. Evaluate $f_x$ and $f_y$ at the center, so that $L$ has no $x^2$ or $xy$ term.",
        "线性化就是写成函数形式的切平面，它可以很好地估计中心附近各点的函数值。函数 $f(x, y)$ 在点 $(a, b)$ 处的**线性化**为：\n\n$$L(x, y) = f(a, b) + f_x(a, b)(x - a) + f_y(a, b)(y - b)$$\n\n对 $f = x^2y$ 在 $(1, 3)$ 处：$f = 3$，$f_x = 2xy = 6$，$f_y = x^2 = 1$，所以 $L = 3 + 6(x - 1) + (y - 3) = 6x + y - 6$。\n\n> **注意。** $L$ 用的是平移 $x - a$ 和 $y - b$；写成 $f(a, b) + f_x x + f_y y$ 只在原点处才对。要在中心处求出 $f_x$ 和 $f_y$ 的值，这样 $L$ 中就没有 $x^2$ 或 $xy$ 项。",
      ),
      generate(rng: Rng): Problem {
        const b = rng.nonZero(-3, 3);
        const c = rng.int(-5, 5);
        const p = rng.nonZero(-2, 2);
        const q = rng.int(-2, 2);
        const f0 = p * p + b * p * q + c;
        const fx = 2 * p + b * q;
        const fy = b * p;
        const k = c - p * p - b * p * q;
        const f = poly([1, "x^2"], [b, "xy"], [c, ""]);
        const ans = poly([fx, "x"], [fy, "y"], [k, ""]);
        return expressionProblem({
          prompt: t(
            `Find the linearization $L(x, y)$ of $f(x, y) = ${f}$ at $(${p}, ${q})$.`,
            `求 $f(x, y) = ${f}$ 在 $(${p}, ${q})$ 处的线性化 $L(x, y)$。`,
          ),
          answer: ans,
          mistakes: spoken(ans, [
            say(
              poly([fx, "x"], [fy, "y"], [f0, ""]),
              `$L$ uses the shifts $x - ${paren(p)}$ and $y - ${paren(q)}$; adding $f(${p}, ${q})$ to $f_x x + f_y y$ is right only at the origin.`,
              `$L$ 用的是平移 $x - ${paren(p)}$ 和 $y - ${paren(q)}$；把 $f(${p}, ${q})$ 加到 $f_x x + f_y y$ 上只在原点才对。`,
            ),
            say(
              f,
              "That is $f$ itself; $L$ is linear, with $f_x$ and $f_y$ evaluated at the center.",
              "那是 $f$ 本身；$L$ 是线性的，$f_x$ 和 $f_y$ 要在中心处求值。",
            ),
            say(
              poly([2 * p, "x"], [fy, "y"], [c - p * p, ""]),
              `$f_x = ${poly([2, "x"], [b, "y"])}$ includes the term from $${poly([b, "xy"])}$, so $f_x(${p}, ${q}) = ${fx}$.`,
              `$f_x = ${poly([2, "x"], [b, "y"])}$ 包含来自 $${poly([b, "xy"])}$ 的项，所以 $f_x(${p}, ${q}) = ${fx}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Evaluate at the center", "在中心处求值"],
                t(
                  `$f(${p}, ${q}) = ${f0}$, $f_x = ${poly([2, "x"], [b, "y"])} = ${fx}$ and $f_y = ${poly([b, "x"])} = ${fy}$.`,
                  `$f(${p}, ${q}) = ${f0}$，$f_x = ${poly([2, "x"], [b, "y"])} = ${fx}$，$f_y = ${poly([b, "x"])} = ${fy}$。`,
                ),
              ],
              [
                ["Write L and expand", "写出 L 并展开"],
                t(
                  `$L = ${f0} + ${paren(fx)}(x - ${paren(p)}) + ${paren(fy)}(y - ${paren(q)}) = ${ans}$.`,
                  `$L = ${f0} + ${paren(fx)}(x - ${paren(p)}) + ${paren(fy)}(y - ${paren(q)}) = ${ans}$。`,
                ),
              ],
            ],
            t(
              `At the center $L(${p}, ${q}) = ${paren(fx)} \\cdot ${paren(p)} + ${paren(fy)} \\cdot ${paren(q)} + ${paren(k)} = ${f0}$, which is $f(${p}, ${q})$.`,
              `在中心处 $L(${p}, ${q}) = ${paren(fx)} \\cdot ${paren(p)} + ${paren(fy)} \\cdot ${paren(q)} + ${paren(k)} = ${f0}$，正是 $f(${p}, ${q})$。`,
            ),
          ),
        });
      },
    },
    {
      id: "approximating-a-distance-with-a-linearization",
      title: t("Approximating a distance with a linearization", "用线性化近似距离"),
      explanation: t(
        "For $f(x, y) = \\sqrt{x^2 + y^2}$ at a point $(p, q)$ with $\\sqrt{p^2 + q^2} = r$, the partial derivatives are $\\frac{p}{r}$ and $\\frac{q}{r}$, so\n\n$$L(x, y) = r + \\frac{p}{r}(x - p) + \\frac{q}{r}(y - q).$$\n\nNear $(p, q)$, $L$ approximates $f$ with only arithmetic. A nearby value is estimated by adding the change predicted by each partial derivative. At $(5, 12)$, $r = 13$, so $f(5.13, 12) \\approx 13 + \\frac{5}{13} \\cdot 0.13 = 13.05$, while $\\sqrt{26.3169 + 144} \\approx 13.0505$.\n\n> **Watch out.** The change in $x$ is weighted by $\\frac{p}{r}$ and the change in $y$ by $\\frac{q}{r}$. Adding the changes unweighted, or swapping the weights, ignores the direction of the point from the origin.",
        "对 $f(x, y) = \\sqrt{x^2 + y^2}$，在满足 $\\sqrt{p^2 + q^2} = r$ 的点 $(p, q)$ 处，偏导数为 $\\frac{p}{r}$ 与 $\\frac{q}{r}$，所以\n\n$$L(x, y) = r + \\frac{p}{r}(x - p) + \\frac{q}{r}(y - q).$$\n\n在 $(p, q)$ 附近，$L$ 只需算术运算就能近似 $f$。估计附近的值时，把每个偏导数预测的变化量加上去。在 $(5, 12)$ 处 $r = 13$，所以 $f(5.13, 12) \\approx 13 + \\frac{5}{13} \\cdot 0.13 = 13.05$，而 $\\sqrt{26.3169 + 144} \\approx 13.0505$。\n\n> **注意。** $x$ 的变化乘以权重 $\\frac{p}{r}$，$y$ 的变化乘以 $\\frac{q}{r}$。不加权直接相加，或者把权重对调，都忽略了该点相对原点的方向。",
      ),
      generate(rng: Rng): Problem {
        const [p, q, r] = rng.pick(pythagoreanTriples.filter(([, , c]) => 100 % c === 0));
        const h = Q.of(rng.int(1, 3) * rng.pick([-1, 1]), 10);
        const k = Q.of(rng.int(-3, 3), 10);
        const x = Q.of(p).add(h);
        const y = Q.of(q).add(k);
        const ans = Q.of(r).add(Q.of(p, r).mul(h)).add(Q.of(q, r).mul(k));
        const dec = (v: Q): string => String(v.toNumber());
        const square = x.mul(x).add(y.mul(y));
        return numberProblem({
          prompt: t(
            `Use the linearization of $f(x, y) = \\sqrt{x^2 + y^2}$ at $(${p}, ${q})$ to estimate $f(${dec(x)}, ${dec(y)})$.`,
            `用 $f(x, y) = \\sqrt{x^2 + y^2}$ 在 $(${p}, ${q})$ 处的线性化估计 $f(${dec(x)}, ${dec(y)})$。`,
          ),
          answer: ans,
          form: "decimal",
          mistakes: distinct(ans, [
            why(
              Q.of(r).add(h).add(k),
              `Each change is weighted by its partial derivative, $\\frac{${p}}{${r}}$ for $x$ and $\\frac{${q}}{${r}}$ for $y$.`,
              `每个变化量都要乘以它的偏导数：$x$ 乘 $\\frac{${p}}{${r}}$，$y$ 乘 $\\frac{${q}}{${r}}$。`,
            ),
            why(
              Q.of(r).add(Q.of(q, r).mul(h)).add(Q.of(p, r).mul(k)),
              `The weights are swapped: the change in $x$ goes with $f_x = \\frac{${p}}{${r}}$.`,
              `权重对调了：$x$ 的变化对应 $f_x = \\frac{${p}}{${r}}$。`,
            ),
            why(r, `$${r}$ is the value at the center; add the predicted change.`, `$${r}$ 是中心处的值；还要加上预测的变化量。`),
          ]),
          solution: walked(
            [
              [
                ["Find the changes", "求变化量"],
                t(
                  `From $(${p}, ${q})$ the changes are $${dec(h)}$ in $x$ and $${dec(k)}$ in $y$, and $f_x = \\frac{${p}}{${r}}$, $f_y = \\frac{${q}}{${r}}$.`,
                  `从 $(${p}, ${q})$ 出发，$x$ 变化 $${dec(h)}$，$y$ 变化 $${dec(k)}$，且 $f_x = \\frac{${p}}{${r}}$，$f_y = \\frac{${q}}{${r}}$。`,
                ),
              ],
              [
                ["Add the predicted change", "加上预测的变化量"],
                t(
                  `$L = ${r} + \\frac{${p}}{${r}} \\cdot (${dec(h)}) + \\frac{${q}}{${r}} \\cdot (${dec(k)}) = ${dec(ans)}$.`,
                  `$L = ${r} + \\frac{${p}}{${r}} \\cdot (${dec(h)}) + \\frac{${q}}{${r}} \\cdot (${dec(k)}) = ${dec(ans)}$。`,
                ),
              ],
            ],
            t(
              `Squaring the estimate gives $${dec(ans.mul(ans))}$, close to $${dec(x)}^2 + ${dec(y)}^2 = ${dec(square)}$.`,
              `把估计值平方得 $${dec(ans.mul(ans))}$，接近 $${dec(x)}^2 + ${dec(y)}^2 = ${dec(square)}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** differentiatingUnderTheIntegralSign applies the Leibniz integral rule. */
export const differentiatingUnderTheIntegralSign: TopicDef = {
  id: "differentiating-under-the-integral-sign",
  title: t("Differentiating Under the Integral Sign", "积分符号下求导"),
  summary: t(
    "Leibniz's rule states that the derivative of an integral with respect to a parameter equals the integral of the partial derivative.",
    "莱布尼茨法则表明，定积分对参数的导数等于被积函数偏导数的定积分。",
  ),
  intro: t(
    "For $F(t) = \\int_0^2 t^2x\\,dx$, differentiating inside gives $F'(t) = \\int_0^2 2tx\\,dx = 2t \\cdot 2 = 4t$.\n\nCheck: integrating first, $F(t) = t^2 \\cdot 2 = 2t^2$, whose derivative is $4t$.\n\nIn this lesson we differentiate an integral with respect to a parameter by differentiating inside it, and handle an upper limit that depends on the parameter.",
    "对 $F(t) = \\int_0^2 t^2x\\,dx$，在积分号内求导得 $F'(t) = \\int_0^2 2tx\\,dx = 2t \\cdot 2 = 4t$。\n\n检验：先积分，$F(t) = t^2 \\cdot 2 = 2t^2$，其导数为 $4t$。\n\n本课我们通过在积分号内求导，求积分对参数的导数，并处理依赖于参数的上限。",
  ),
  prerequisites: ["computing-partial-derivatives-using-the-rules-of-differentiation", "integrating-vector-valued-functions"],
  encompasses: [{ topic: "computing-partial-derivatives-using-the-rules-of-differentiation", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "applying-leibniz-integral-rule",
      title: t("Applying Leibniz's Integral Rule", "应用莱布尼茨积分法则"),
      explanation: t(
        "When the limits are fixed, the derivative with respect to a parameter can be taken inside the integral, differentiating the integrand partially. **Leibniz's Rule**: For continuous $\\frac{\\partial f}{\\partial t}$:\n\n$$\\frac{d}{dt} \\int_a^b f(x, t)\\,dx = \\int_a^b \\frac{\\partial f}{\\partial t}(x, t)\\,dx.$$\n\nFor $F(t) = \\int_0^1 (x + t)^3\\,dx$, $F'(t) = \\int_0^1 3(x + t)^2\\,dx = (1 + t)^3 - t^3$, which is $1$ at $t = 0$.\n\n> **Watch out.** Differentiate in $t$ with $x$ held fixed, so a term without $t$ drops out; then still integrate in $x$ over the limits.",
        "当积分限固定时，对参数的导数可以移到积分号里面，对被积函数求偏导数。**莱布尼茨法则**：当 $\\frac{\\partial f}{\\partial t}$ 连续时：\n\n$$\\frac{d}{dt} \\int_a^b f(x, t)\\,dx = \\int_a^b \\frac{\\partial f}{\\partial t}(x, t)\\,dx$$\n\n对 $F(t) = \\int_0^1 (x + t)^3\\,dx$，$F'(t) = \\int_0^1 3(x + t)^2\\,dx = (1 + t)^3 - t^3$，在 $t = 0$ 处等于 $1$。\n\n> **注意。** 固定 $x$ 对 $t$ 求导，所以不含 $t$ 的项消失；之后仍要在积分限上对 $x$ 积分。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-5, 5);
        const b = rng.nonZero(-4, 4);
        const L = rng.int(1, 3);
        const t0 = rng.nonZero(-3, 3);
        const ans = b * t0 * L * L;
        const integrand = poly([a, "x^2"], [b, "t^2x"]);
        const lower = Q.of(a * L ** 3, 3);
        const upper = Q.of(b * L * L, 2);
        return numberProblem({
          prompt: t(
            `Let $F(t) = \\int_{0}^{${L}} \\left(${integrand}\\right) dx$. Find $F'(${t0})$.`,
            `设 $F(t) = \\int_{0}^{${L}} \\left(${integrand}\\right) dx$。求 $F'(${t0})$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              2 * b * t0 * L,
              `$${poly([2 * b, "tx"])}$ still has to be integrated in $x$ from $0$ to $${L}$, not just evaluated at $x = ${L}$.`,
              `$${poly([2 * b, "tx"])}$ 还要对 $x$ 从 $0$ 到 $${L}$ 积分，而不只是在 $x = ${L}$ 处求值。`,
            ),
            why(
              lower.add(Q.of(ans)),
              `$${poly([a, "x^2"])}$ has no $t$, so its $t$-derivative is $0$.`,
              `$${poly([a, "x^2"])}$ 不含 $t$，所以它对 $t$ 的导数为 $0$。`,
            ),
            why(
              a * L * L + b * t0 * t0 * L,
              "That differentiates in $x$; the derivative is in $t$, with $x$ held fixed.",
              "那是对 $x$ 求导；应当固定 $x$，对 $t$ 求导。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Differentiate inside", "在积分号内求导"],
                t(
                  `$\\frac{\\partial}{\\partial t}\\left(${integrand}\\right) = ${poly([2 * b, "tx"])}$.`,
                  `$\\frac{\\partial}{\\partial t}\\left(${integrand}\\right) = ${poly([2 * b, "tx"])}$。`,
                ),
              ],
              [
                ["Integrate in x", "对 x 积分"],
                t(
                  `$F'(t) = \\int_0^{${L}} ${poly([2 * b, "tx"])}\\,dx = ${poly([b, "t"])} \\cdot ${L * L} = ${poly([b * L * L, "t"])}$, so $F'(${t0}) = ${ans}$.`,
                  `$F'(t) = \\int_0^{${L}} ${poly([2 * b, "tx"])}\\,dx = ${poly([b, "t"])} \\cdot ${L * L} = ${poly([b * L * L, "t"])}$，所以 $F'(${t0}) = ${ans}$。`,
                ),
              ],
            ],
            t(
              `Integrating first, $F(t) = ${poly([lower, ""], [upper, "t^2"])}$, whose derivative $${poly([b * L * L, "t"])}$ is $${ans}$ at $t = ${t0}$.`,
              `先积分，$F(t) = ${poly([lower, ""], [upper, "t^2"])}$，其导数 $${poly([b * L * L, "t"])}$ 在 $t = ${t0}$ 处为 $${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "differentiating-an-integral-with-a-variable-limit",
      title: t("Differentiating an integral with a variable limit", "对变上限积分求导"),
      explanation: t(
        "When both the limit and the integrand depend on $t$, Leibniz's rule has two parts:\n\n$$\\frac{d}{dt}\\int_0^t f(x, t)\\,dx = f(t, t) + \\int_0^t \\frac{\\partial f}{\\partial t}(x, t)\\,dx.$$\n\nThe first term comes from moving the upper limit, and the second from changing the integrand. For $F(t) = \\int_0^t (t + x)\\,dx$: $f(t, t) = 2t$ and $\\int_0^t 1\\,dx = t$, so $F'(t) = 3t$; indeed $F(t) = t^2 + \\frac{t^2}{2} = \\frac{3}{2}t^2$.\n\n> **Watch out.** Forgetting either part gives a wrong derivative. In the boundary term put $x = t$ into the integrand, and then evaluate at the given $t$.",
        "当积分限和被积函数都依赖于 $t$ 时，莱布尼茨法则有两部分：\n\n$$\\frac{d}{dt}\\int_0^t f(x, t)\\,dx = f(t, t) + \\int_0^t \\frac{\\partial f}{\\partial t}(x, t)\\,dx.$$\n\n第一项来自上限的移动，第二项来自被积函数的变化。对 $F(t) = \\int_0^t (t + x)\\,dx$：$f(t, t) = 2t$，$\\int_0^t 1\\,dx = t$，所以 $F'(t) = 3t$；确实 $F(t) = t^2 + \\frac{t^2}{2} = \\frac{3}{2}t^2$。\n\n> **注意。** 漏掉任何一部分都会得到错误的导数。边界项要把 $x = t$ 代入被积函数，然后在给定的 $t$ 处求值。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-4, 4) || 2;
        const b = rng.int(-4, 4);
        const p = rng.int(2, 4) * rng.pick([-1, 1]);
        const ans = Q.of(3 * a + 2 * b, 2).mul(Q.of(p * p));
        const integrand = poly([a, "tx"], [b, "x^2"]);
        return numberProblem({
          prompt: t(
            `Let $F(t) = \\int_0^t (${integrand})\\,dx$. Find $F'(${p})$.`,
            `设 $F(t) = \\int_0^t (${integrand})\\,dx$。求 $F'(${p})$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              (a + b) * p * p,
              "That is only the boundary term $f(t, t)$; add the integral of $\\frac{\\partial f}{\\partial t}$ as well.",
              "那只是边界项 $f(t, t)$；还要加上 $\\frac{\\partial f}{\\partial t}$ 的积分。",
            ),
            why(
              Q.of(a * p * p, 2),
              "That is only the integral of $\\frac{\\partial f}{\\partial t}$; the moving upper limit adds $f(t, t)$.",
              "那只是 $\\frac{\\partial f}{\\partial t}$ 的积分；移动的上限还要加上 $f(t, t)$。",
            ),
            why(
              Q.of(3 * a + 2 * b, 2),
              `That is the coefficient of $t^2$; evaluate at $t = ${p}$.`,
              `那是 $t^2$ 的系数；还要在 $t = ${p}$ 处求值。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["The boundary term", "边界项"],
                t(
                  `$f(t, t) = ${poly([a, "t^2"])} + ${paren(b)}t^2 = ${poly([a + b, "t^2"])}$.`,
                  `$f(t, t) = ${poly([a, "t^2"])} + ${paren(b)}t^2 = ${poly([a + b, "t^2"])}$。`,
                ),
              ],
              [
                ["The inside term", "积分项"],
                t(
                  `$\\frac{\\partial f}{\\partial t} = ${poly([a, "x"])}$, and $\\int_0^t ${poly([a, "x"])}\\,dx = ${poly([Q.of(a, 2), "t^2"])}$.`,
                  `$\\frac{\\partial f}{\\partial t} = ${poly([a, "x"])}$，而 $\\int_0^t ${poly([a, "x"])}\\,dx = ${poly([Q.of(a, 2), "t^2"])}$。`,
                ),
              ],
              [
                ["Add and evaluate", "相加并求值"],
                t(
                  `$F'(t) = ${poly([Q.of(3 * a + 2 * b, 2), "t^2"])}$, so $F'(${p}) = ${ans.toLatex()}$.`,
                  `$F'(t) = ${poly([Q.of(3 * a + 2 * b, 2), "t^2"])}$，所以 $F'(${p}) = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `Integrating first, $F(t) = ${poly([Q.of(a, 2), "t^3"], [Q.of(b, 3), "t^3"])} = ${poly([Q.of(3 * a + 2 * b, 6), "t^3"])}$, whose derivative is $${poly([Q.of(3 * a + 2 * b, 2), "t^2"])}$ again.`,
              `先积分，$F(t) = ${poly([Q.of(a, 2), "t^3"], [Q.of(b, 3), "t^3"])} = ${poly([Q.of(3 * a + 2 * b, 6), "t^3"])}$，其导数同样是 $${poly([Q.of(3 * a + 2 * b, 2), "t^2"])}$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 2.8 The Gradient Vector
// ---------------------------------------------------------------------------

/** theGradientVector computes 2D and 3D gradient vectors. */
export const theGradientVector: TopicDef = {
  id: "the-gradient-vector",
  title: t("The Gradient Vector", "梯度向量"),
  summary: t(
    "The gradient ∇f = ⟨fx, fy⟩ points in the direction of greatest increase of f, with magnitude equal to the maximum rate of increase.",
    "梯度 ∇f = ⟨fx, fy⟩ 指向函数增长最快的方向，其模长等于该最大增长率。",
  ),
  intro: t(
    "For $f(x, y) = x^3y$ at $(1, 2)$, $\\nabla f = \\langle 3x^2y, x^3 \\rangle = \\langle 6, 1 \\rangle$, and its length $\\sqrt{37} \\approx 6.08$ is the fastest rate of increase there.\n\nCheck: $\\frac{f(1.01, 2) - f(1, 2)}{0.01} = \\frac{2.060602 - 2}{0.01} \\approx 6.06$, close to the first component $6$.\n\nIn this lesson we compute gradient vectors at a point and the square of their length.",
    "对 $f(x, y) = x^3y$ 在 $(1, 2)$ 处，$\\nabla f = \\langle 3x^2y, x^3 \\rangle = \\langle 6, 1 \\rangle$，其长度 $\\sqrt{37} \\approx 6.08$ 是该处最快的增长率。\n\n检验：$\\frac{f(1.01, 2) - f(1, 2)}{0.01} = \\frac{2.060602 - 2}{0.01} \\approx 6.06$，接近第一个分量 $6$。\n\n本课我们计算一点处的梯度向量及其长度的平方。",
  ),
  prerequisites: ["computing-partial-derivatives-using-the-rules-of-differentiation", "three-dimensional-vectors-in-component-form"],
  encompasses: [{ topic: "computing-partial-derivatives-using-the-rules-of-differentiation", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "calculating-the-gradient-vector",
      title: t("Calculating the gradient vector", "计算梯度向量"),
      explanation: t(
        "Find each partial derivative and list them in order as the components of a vector, then substitute the point if one is given. For a scalar function $f(x, y)$, the gradient vector is:\n\n$$\\nabla f(x, y) = \\left\\langle \\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y} \\right\\rangle.$$\n\nFor $f = xy^3$ at $(2, 1)$: $\\nabla f = \\langle y^3, 3xy^2 \\rangle = \\langle 1, 6 \\rangle$.\n\n> **Watch out.** The first component is $f_x$ and the second $f_y$. A cross term $cxy$ contributes $cy$ to $f_x$ and $cx$ to $f_y$, and $x^2$ gives $2x$, not $x$.",
        "求出每个偏导数，把它们依次作为向量的分量；如果给定了点，再代入该点。对于标量函数 $f(x, y)$，梯度向量为：\n\n$$\\nabla f(x, y) = \\left\\langle \\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y} \\right\\rangle$$\n\n对 $f = xy^3$ 在 $(2, 1)$ 处：$\\nabla f = \\langle y^3, 3xy^2 \\rangle = \\langle 1, 6 \\rangle$。\n\n> **注意。** 第一个分量是 $f_x$，第二个是 $f_y$。交叉项 $cxy$ 给 $f_x$ 贡献 $cy$，给 $f_y$ 贡献 $cx$；$x^2$ 的导数是 $2x$，不是 $x$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-4, 4);
        const b = rng.nonZero(-4, 4);
        const c = rng.nonZero(-4, 4);
        let x0 = rng.int(-2, 2);
        const y0 = rng.int(-2, 2);
        if (x0 === 0 && y0 === 0) x0 = 1;
        const ansX = 2 * a * x0 + c * y0;
        const ansY = 2 * b * y0 + c * x0;
        const f = poly([a, "x^2"], [b, "y^2"], [c, "xy"]);
        return pointWith(
          {
            prompt: t(
              `Calculate the gradient vector $\\nabla f(${x0}, ${y0})$ for $f(x, y) = ${f}$. Express your answer as a vector $\\langle x, y \\rangle$.`,
              `计算函数 $f(x, y) = ${f}$ 的梯度向量 $\\nabla f(${x0}, ${y0})$。结果以向量 $\\langle x, y \\rangle$ 表示。`,
            ),
            answer: [ansX, ansY],
            vector: true,
            vars: ["x", "y"],
            solution: walked(
              [
                [
                  ["Find the partial derivatives", "求偏导数"],
                  t(
                    `$f_x = ${poly([2 * a, "x"], [c, "y"])}$ and $f_y = ${poly([2 * b, "y"], [c, "x"])}$.`,
                    `$f_x = ${poly([2 * a, "x"], [c, "y"])}$，$f_y = ${poly([2 * b, "y"], [c, "x"])}$。`,
                  ),
                ],
                [
                  ["Substitute the point", "代入该点"],
                  t(
                    `$\\nabla f(${x0}, ${y0}) = \\langle ${ansX}, ${ansY} \\rangle$.`,
                    `$\\nabla f(${x0}, ${y0}) = \\langle ${ansX}, ${ansY} \\rangle$。`,
                  ),
                ],
              ],
              t(
                `Along $y = ${y0}$, $f = ${poly([a, "x^2"], [c * y0, "x"], [b * y0 * y0, ""])}$, whose derivative $${poly([2 * a, "x"], [c * y0, ""])}$ is $${ansX}$ at $x = ${x0}$, the first component.`,
                `沿 $y = ${y0}$，$f = ${poly([a, "x^2"], [c * y0, "x"], [b * y0 * y0, ""])}$，其导数 $${poly([2 * a, "x"], [c * y0, ""])}$ 在 $x = ${x0}$ 处为 $${ansX}$，正是第一个分量。`,
              ),
            ),
          },
          [
            [
              [ansY, ansX],
              "The order is $\\langle f_x, f_y \\rangle$: the $x$-derivative comes first.",
              "顺序是 $\\langle f_x, f_y \\rangle$：对 $x$ 的导数在前。",
            ],
            [
              [2 * a * x0, 2 * b * y0],
              `The cross term $${poly([c, "xy"])}$ contributes $${poly([c, "y"])}$ to $f_x$ and $${poly([c, "x"])}$ to $f_y$.`,
              `交叉项 $${poly([c, "xy"])}$ 给 $f_x$ 贡献 $${poly([c, "y"])}$，给 $f_y$ 贡献 $${poly([c, "x"])}$。`,
            ],
            [
              [2 * a * x0 + c * x0, 2 * b * y0 + c * y0],
              `Differentiating $${poly([c, "xy"])}$ in $x$ leaves $${poly([c, "y"])}$, not $${poly([c, "x"])}$.`,
              `$${poly([c, "xy"])}$ 对 $x$ 求导剩下 $${poly([c, "y"])}$，不是 $${poly([c, "x"])}$。`,
            ],
            [
              [a * x0 + c * y0, b * y0 + c * x0],
              "The power rule gives $2x$ for $x^2$ and $2y$ for $y^2$.",
              "幂法则给出 $x^2$ 的导数 $2x$，$y^2$ 的导数 $2y$。",
            ],
          ],
        );
      },
    },
    {
      id: "the-length-of-the-gradient",
      title: t("The length of the gradient", "梯度的长度"),
      explanation: t(
        "The gradient $\\nabla f = (f_x, f_y)$ points in the direction of fastest increase, and its length $|\\nabla f| = \\sqrt{f_x^2 + f_y^2}$ is that greatest rate of increase. To find $|\\nabla f|^2$ at a point, compute both partial derivatives there and add their squares. For $f = xy^2$ at $(3, 1)$: $f_x = y^2 = 1$ and $f_y = 2xy = 6$, so $|\\nabla f|^2 = 1 + 36 = 37$.\n\n> **Watch out.** Square each component before adding: $(f_x + f_y)^2$ carries an extra $2f_xf_y$. Both components count, even when one is small.",
        "梯度 $\\nabla f = (f_x, f_y)$ 指向增长最快的方向，其长度 $|\\nabla f| = \\sqrt{f_x^2 + f_y^2}$ 就是最大增长率。要求某点处的 $|\\nabla f|^2$，先算出该点的两个偏导数，再把它们的平方相加。对 $f = xy^2$ 在 $(3, 1)$ 处：$f_x = y^2 = 1$，$f_y = 2xy = 6$，所以 $|\\nabla f|^2 = 1 + 36 = 37$。\n\n> **注意。** 要先把每个分量平方再相加：$(f_x + f_y)^2$ 多出 $2f_xf_y$。两个分量都要算，即使其中一个很小。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-3, 3) || 1;
        const b = rng.int(-3, 3) || 2;
        const p = rng.int(-3, 3) || 1;
        const q = rng.int(-3, 3) || -1;
        const fx = 2 * a * p * q;
        const fy = a * p * p + 2 * b * q;
        const ans = fx * fx + fy * fy;
        const f = poly([a, "x^2y"], [b, "y^2"]);
        return numberProblem({
          prompt: t(`Find $|\\nabla f(${p}, ${q})|^2$ for $f(x, y) = ${f}$.`, `对 $f(x, y) = ${f}$，求 $|\\nabla f(${p}, ${q})|^2$。`),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              fx + fy,
              "The length squared adds the squares of the components, not the components.",
              "长度的平方是各分量平方之和，不是分量之和。",
            ),
            why(
              (fx + fy) ** 2,
              `Squaring the sum adds the cross term $2f_xf_y = ${2 * fx * fy}$; square each component separately.`,
              `对和平方会多出交叉项 $2f_xf_y = ${2 * fx * fy}$；要分别把每个分量平方。`,
            ),
            why(fx * fx, `$f_y = ${fy}$ counts too: add $${fy * fy}$.`, `$f_y = ${fy}$ 也要算：还要加上 $${fy * fy}$。`),
          ]),
          solution: walked(
            [
              [
                ["Find the components", "求分量"],
                t(
                  `$f_x = ${poly([2 * a, "xy"])} = ${fx}$ and $f_y = ${poly([a, "x^2"], [2 * b, "y"])} = ${fy}$ at $(${p}, ${q})$.`,
                  `在 $(${p}, ${q})$ 处 $f_x = ${poly([2 * a, "xy"])} = ${fx}$，$f_y = ${poly([a, "x^2"], [2 * b, "y"])} = ${fy}$。`,
                ),
              ],
              [
                ["Add the squares", "平方相加"],
                t(`$|\\nabla f|^2 = ${fx * fx} + ${fy * fy} = ${ans}$.`, `$|\\nabla f|^2 = ${fx * fx} + ${fy * fy} = ${ans}$。`),
              ],
            ],
            t(
              `$(f_x + f_y)^2 - 2f_xf_y = ${(fx + fy) ** 2} - ${paren(2 * fx * fy)} = ${ans}$ as well.`,
              `$(f_x + f_y)^2 - 2f_xf_y = ${(fx + fy) ** 2} - ${paren(2 * fx * fy)} = ${ans}$，结果相同。`,
            ),
          ),
        });
      },
    },
  ],
};

/** theGradientAsANormalVector connects gradients to normal vectors of level surfaces. */
export const theGradientAsANormalVector: TopicDef = {
  id: "the-gradient-as-a-normal-vector",
  title: t("The Gradient as a Normal Vector", "作为法向量的梯度"),
  summary: t(
    "The gradient vector ∇F(x0, y0, z0) is orthogonal to the tangent plane of the level surface F(x, y, z) = k at that point.",
    "梯度向量 ∇F(x0, y0, z0) 与等值面 F(x, y, z) = k 在该点处的切平面正交。",
  ),
  intro: t(
    "On the sphere $x^2 + y^2 + z^2 = 9$ at $(1, 2, 2)$, $\\nabla F = \\langle 2x, 2y, 2z \\rangle = \\langle 2, 4, 4 \\rangle$, which points straight out from the center.\n\nCheck: $\\langle 2, -1, 0 \\rangle$ is tangent to the sphere there, since it is perpendicular to the radius $\\langle 1, 2, 2 \\rangle$, and $\\langle 2, 4, 4 \\rangle \\cdot \\langle 2, -1, 0 \\rangle = 4 - 4 + 0 = 0$.\n\nIn this lesson we use the gradient as a normal vector to a level surface and follow the normal line it gives.",
    "在球面 $x^2 + y^2 + z^2 = 9$ 上的 $(1, 2, 2)$ 处，$\\nabla F = \\langle 2x, 2y, 2z \\rangle = \\langle 2, 4, 4 \\rangle$，它从球心笔直向外。\n\n检验：$\\langle 2, -1, 0 \\rangle$ 垂直于半径 $\\langle 1, 2, 2 \\rangle$，所以在该处与球面相切，而 $\\langle 2, 4, 4 \\rangle \\cdot \\langle 2, -1, 0 \\rangle = 4 - 4 + 0 = 0$。\n\n本课我们用梯度作为等值面的法向量，并沿它给出的法线前进。",
  ),
  prerequisites: ["the-gradient-vector", "tangent-planes-to-surfaces"],
  encompasses: [{ topic: "the-gradient-vector", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "normal-vectors-to-level-surfaces",
      figure: multivariableDrawings2["the-gradient-as-a-normal-vector#normal-vectors-to-level-surfaces"],
      title: t("Normal vectors to level surfaces", "等值面的法向量"),
      explanation: t(
        "For a level surface $F(x, y, z) = k$, the gradient vector $\\mathbf{n} = \\nabla F(x_0, y_0, z_0)$ is perpendicular to the tangent plane of the surface at $(x_0, y_0, z_0)$. For $xyz = 6$ at $(1, 2, 3)$, $\\nabla F = \\langle yz, xz, xy \\rangle = \\langle 6, 3, 2 \\rangle$.\n\n> **Watch out.** Each component carries the factor that differentiation brings down, such as the $2$ from a square, and must be evaluated at the point. The position vector of the point is normal only for a sphere centered at the origin.",
        "对于等值面 $F(x, y, z) = k$，梯度向量 $\\mathbf{n} = \\nabla F(x_0, y_0, z_0)$ 垂直于该曲面在点 $(x_0, y_0, z_0)$ 处的切平面。对 $xyz = 6$ 在 $(1, 2, 3)$ 处，$\\nabla F = \\langle yz, xz, xy \\rangle = \\langle 6, 3, 2 \\rangle$。\n\n> **注意。** 每个分量都带着求导带下来的因子，比如平方带来的 $2$，并且要在该点求值。点的位置向量只有对以原点为中心的球面才是法向量。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const c = rng.nonZero(-3, 3);
        const pt: Vec3 = [rng.nonZero(-2, 2), rng.nonZero(-2, 2), rng.nonZero(-2, 2)];
        const level = a * pt[0] ** 2 + b * pt[1] ** 2 + c * pt[2] ** 2;
        const answer: Vec3 = [2 * a * pt[0], 2 * b * pt[1], 2 * c * pt[2]];
        const F = poly([a, "x^2"], [b, "y^2"], [c, "z^2"]);
        const at = `(${pt[0]}, ${pt[1]}, ${pt[2]})`;
        return pointWith(
          {
            prompt: t(
              `The level surface $${F} = ${level}$ passes through the point $${at}$. Find the normal vector $\\nabla F$ to the surface at that point. Express your answer as a vector $\\langle x, y, z \\rangle$.`,
              `等值面 $${F} = ${level}$ 经过点 $${at}$。求该曲面在这一点的法向量 $\\nabla F$。结果以向量 $\\langle x, y, z \\rangle$ 表示。`,
            ),
            answer,
            vector: true,
            vars: ["x", "y", "z"],
            solution: walked(
              [
                [
                  ["Differentiate", "求导"],
                  t(
                    `$\\nabla F = \\langle ${poly([2 * a, "x"])}, ${poly([2 * b, "y"])}, ${poly([2 * c, "z"])} \\rangle$.`,
                    `$\\nabla F = \\langle ${poly([2 * a, "x"])}, ${poly([2 * b, "y"])}, ${poly([2 * c, "z"])} \\rangle$。`,
                  ),
                ],
                [
                  ["Substitute the point", "代入该点"],
                  t(`At $${at}$, $\\nabla F = ${v3L(answer)}$.`, `在 $${at}$ 处，$\\nabla F = ${v3L(answer)}$。`),
                ],
              ],
              t(
                `Each term of $F$ is a square, so $\\nabla F \\cdot (x, y, z) = 2F$: $${answer[0]} \\cdot ${paren(pt[0])} + ${paren(answer[1])} \\cdot ${paren(pt[1])} + ${paren(answer[2])} \\cdot ${paren(pt[2])} = ${2 * level} = 2 \\cdot ${paren(level)}$.`,
                `$F$ 的每一项都是平方项，所以 $\\nabla F \\cdot (x, y, z) = 2F$：$${answer[0]} \\cdot ${paren(pt[0])} + ${paren(answer[1])} \\cdot ${paren(pt[1])} + ${paren(answer[2])} \\cdot ${paren(pt[2])} = ${2 * level} = 2 \\cdot ${paren(level)}$。`,
              ),
            ),
          },
          [
            [
              [a * pt[0], b * pt[1], c * pt[2]],
              "Differentiating a square brings down a factor $2$ in every component.",
              "对平方项求导，每个分量都带下因子 $2$。",
            ],
            [
              [2 * a, 2 * b, 2 * c],
              `Evaluate the partial derivatives at $${at}$; they still contain $x$, $y$ and $z$.`,
              `要在 $${at}$ 处求偏导数的值；它们还含有 $x$、$y$、$z$。`,
            ],
            [
              [pt[0], pt[1], pt[2]],
              "The position vector is normal only to a sphere centered at the origin; use $\\nabla F$.",
              "位置向量只对以原点为中心的球面才是法向量；要用 $\\nabla F$。",
            ],
          ],
        );
      },
    },
    {
      id: "following-a-normal-line-to-a-plane",
      title: t("Following a normal line to a plane", "沿法线到达平面"),
      explanation: t(
        "At a point on the level surface $F(x, y, z) = k$, the gradient $\\nabla F$ is normal to the surface, so the normal line is $(x_0, y_0, z_0) + s\\,\\nabla F(x_0, y_0, z_0)$. To find where it meets another surface, such as the plane $z = 0$, solve the $z$-equation for $s$ and substitute that $s$ into the other coordinates. For $2x^2 + y^2 + z^2 = 22$ at $(1, 2, 4)$, $\\nabla F = (4, 4, 8)$; $4 + 8s = 0$ gives $s = -\\frac{1}{2}$, so the line meets $z = 0$ at $x = 1 + 4 \\cdot \\left(-\\frac{1}{2}\\right) = -1$.\n\n> **Watch out.** $F_z = 2cz$ has the factor $2$, so $s = -\\frac{1}{2c}$, negative when $z_0 > 0$ because the line must come down. Use that same $s$ in the $x$-coordinate.",
        "在等值面 $F(x, y, z) = k$ 上的点处，梯度 $\\nabla F$ 垂直于曲面，所以法线为 $(x_0, y_0, z_0) + s\\,\\nabla F(x_0, y_0, z_0)$。要求它与另一曲面（如平面 $z = 0$）的交点，先由 $z$ 的方程解出 $s$，再把 $s$ 代入其他坐标。对 $2x^2 + y^2 + z^2 = 22$ 在 $(1, 2, 4)$ 处，$\\nabla F = (4, 4, 8)$；由 $4 + 8s = 0$ 得 $s = -\\frac{1}{2}$，所以法线在 $x = 1 + 4 \\cdot \\left(-\\frac{1}{2}\\right) = -1$ 处与 $z = 0$ 相交。\n\n> **注意。** $F_z = 2cz$ 带有因子 $2$，所以 $s = -\\frac{1}{2c}$；当 $z_0 > 0$ 时它为负，因为直线必须向下。在 $x$ 坐标中要用同一个 $s$。",
      ),
      generate(rng: Rng): Problem {
        const [a, b, c] = [rng.int(1, 4), rng.int(1, 4), rng.int(1, 4)];
        const p = rng.int(-4, 4) || 3;
        const q = rng.int(-3, 3);
        const r = rng.int(1, 3) * rng.pick([-1, 1]);
        const k = a * p * p + b * q * q + c * r * r;
        const ans = Q.of(p * (c - a), c);
        const s = Q.of(-1, 2 * c);
        const surface = poly([a, "x^2"], [b, "y^2"], [c, "z^2"]);
        return numberProblem({
          prompt: t(
            `The normal line to $${surface} = ${k}$ at $(${p}, ${q}, ${r})$ meets the plane $z = 0$. Find the $x$-coordinate of that point.`,
            `$${surface} = ${k}$ 在 $(${p}, ${q}, ${r})$ 处的法线与平面 $z = 0$ 相交。求交点的 $x$ 坐标。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(p * (c + a), c),
              `Solving $${r} + ${paren(2 * c * r)}s = 0$ gives a negative $s = ${s.toLatex()}$, which moves $x$ by $${paren(2 * a * p)} \\cdot ${paren(s)}$.`,
              `解 $${r} + ${paren(2 * c * r)}s = 0$ 得到负的 $s = ${s.toLatex()}$，$x$ 的移动量为 $${paren(2 * a * p)} \\cdot ${paren(s)}$。`,
            ),
            why(p, "Along the normal line $x$ changes too, unless $F_x = 0$.", "沿法线 $x$ 也会变化，除非 $F_x = 0$。"),
            why(
              Q.of(p * (c - 2 * a), c),
              `$F_z = ${2 * c}z$ has the factor $2$, so $s = ${s.toLatex()}$, not $${Q.of(-1, c).toLatex()}$.`,
              `$F_z = ${2 * c}z$ 带有因子 $2$，所以 $s = ${s.toLatex()}$，不是 $${Q.of(-1, c).toLatex()}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the normal", "求法向量"],
                t(
                  `$\\nabla F = (${2 * a * p}, ${2 * b * q}, ${2 * c * r})$ at the point.`,
                  `在该点 $\\nabla F = (${2 * a * p}, ${2 * b * q}, ${2 * c * r})$。`,
                ),
              ],
              [
                ["Solve for s", "解出 s"],
                t(
                  `$z = ${r} + ${paren(2 * c * r)}s = 0$ gives $s = ${s.toLatex()}$.`,
                  `由 $z = ${r} + ${paren(2 * c * r)}s = 0$ 得 $s = ${s.toLatex()}$。`,
                ),
              ],
              [
                ["Substitute into x", "代入 x"],
                t(
                  `$x = ${p} + ${paren(2 * a * p)} \\cdot ${paren(s)} = ${ans.toLatex()}$.`,
                  `$x = ${p} + ${paren(2 * a * p)} \\cdot ${paren(s)} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The step from the meeting point back to $(${p}, ${q}, ${r})$ is $\\left(${Q.of(a * p, c).toLatex()}, ${Q.of(b * q, c).toLatex()}, ${r}\\right)$, which is $\\frac{1}{${2 * c}}\\nabla F$, so it runs along the normal.`,
              `从交点回到 $(${p}, ${q}, ${r})$ 的位移为 $\\left(${Q.of(a * p, c).toLatex()}, ${Q.of(b * q, c).toLatex()}, ${r}\\right)$，等于 $\\frac{1}{${2 * c}}\\nabla F$，所以确实沿着法线。`,
            ),
          ),
        });
      },
    },
  ],
};

/** tangentLinesToLevelCurves computes tangent lines using the gradient. */
export const tangentLinesToLevelCurves: TopicDef = {
  id: "tangent-lines-to-level-curves",
  title: t("Tangent Lines to Level Curves", "等值线的切线"),
  summary: t(
    "The tangent line to the level curve f(x, y) = k at (x0, y0) has normal vector ∇f(x0, y0) and equation fx(x - x0) + fy(y - y0) = 0.",
    "等值线 f(x, y) = k 在 (x0, y0) 处的切线以 ∇f(x0, y0) 为法向量，其方程为 fx(x - x0) + fy(y - y0) = 0。",
  ),
  intro: t(
    "On the level curve $x^3 + y^3 = 9$ at $(1, 2)$, $\\nabla f = \\langle 3x^2, 3y^2 \\rangle = \\langle 3, 12 \\rangle$. The tangent line is $3(x - 1) + 12(y - 2) = 0$, or $x + 4y = 9$, with slope $-\\frac{1}{4}$.\n\nCheck: the point fits, $1 + 8 = 9$, and implicit differentiation gives $3x^2 + 3y^2y' = 0$, so $y' = -\\frac{3}{12} = -\\frac{1}{4}$.\n\nIn this lesson we find the tangent line to a level curve from the gradient, and its slope.",
    "在等值线 $x^3 + y^3 = 9$ 上的 $(1, 2)$ 处，$\\nabla f = \\langle 3x^2, 3y^2 \\rangle = \\langle 3, 12 \\rangle$。切线为 $3(x - 1) + 12(y - 2) = 0$，即 $x + 4y = 9$，斜率为 $-\\frac{1}{4}$。\n\n检验：该点满足 $1 + 8 = 9$；隐函数求导得 $3x^2 + 3y^2y' = 0$，所以 $y' = -\\frac{3}{12} = -\\frac{1}{4}$。\n\n本课我们由梯度求等值线的切线及其斜率。",
  ),
  prerequisites: ["the-gradient-vector"],
  encompasses: [{ topic: "the-gradient-vector", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "finding-tangent-lines-to-level-curves",
      title: t("Finding tangent lines to level curves", "求等值线的切线方程"),
      explanation: t(
        "Because $\\nabla f(x_0, y_0) = \\langle A, B \\rangle$ is normal to the level curve $f(x, y) = k$ at $(x_0, y_0)$, the equation of the tangent line is:\n\n$$A(x - x_0) + B(y - y_0) = 0 \\iff Ax + By = Ax_0 + By_0.$$\n\nFor $xy = 6$ at $(2, 3)$, $\\nabla f = \\langle y, x \\rangle = \\langle 3, 2 \\rangle$, so the tangent line is $3x + 2y = 12$.\n\n> **Watch out.** The gradient is normal to the line: its components are the coefficients of $x$ and $y$, not a direction along the line. The right side is $Ax_0 + By_0$, so that the point lies on the line.",
        "因为 $\\nabla f(x_0, y_0) = \\langle A, B \\rangle$ 垂直于等值线 $f(x, y) = k$ 在 $(x_0, y_0)$ 处的切线，所以切线方程为：\n\n$$A(x - x_0) + B(y - y_0) = 0 \\iff Ax + By = Ax_0 + By_0$$\n\n对 $xy = 6$ 在 $(2, 3)$ 处，$\\nabla f = \\langle y, x \\rangle = \\langle 3, 2 \\rangle$，所以切线为 $3x + 2y = 12$。\n\n> **注意。** 梯度垂直于切线：它的分量是 $x$ 和 $y$ 的系数，而不是沿切线的方向。右边是 $Ax_0 + By_0$，这样该点才在直线上。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        let x0 = rng.int(-3, 3);
        const y0 = rng.int(-3, 3);
        if (x0 === 0 && y0 === 0) x0 = rng.pick([-1, 1]);
        const A = 2 * a * x0;
        const B = 2 * b * y0;
        const C = A * x0 + B * y0;
        const answer = `${poly([A, "x"], [B, "y"])} = ${C}`;
        const curve = poly([a, "x^2"], [b, "y^2"]);
        const k = a * x0 * x0 + b * y0 * y0;
        return equationWith(
          {
            prompt: t(
              `Find the equation of the tangent line to the level curve $${curve} = ${k}$ at the point $(${x0}, ${y0})$.`,
              `求等值线 $${curve} = ${k}$ 在点 $(${x0}, ${y0})$ 处的切线方程。`,
            ),
            answer,
            solution: walked(
              [
                [
                  ["Find the gradient", "求梯度"],
                  t(
                    `$\\nabla f = \\langle ${poly([2 * a, "x"])}, ${poly([2 * b, "y"])} \\rangle = \\langle ${A}, ${B} \\rangle$ at $(${x0}, ${y0})$.`,
                    `在 $(${x0}, ${y0})$ 处 $\\nabla f = \\langle ${poly([2 * a, "x"])}, ${poly([2 * b, "y"])} \\rangle = \\langle ${A}, ${B} \\rangle$。`,
                  ),
                ],
                [
                  ["Use it as the normal", "以它为法向量"],
                  t(
                    `$${A}(x - ${paren(x0)}) + ${paren(B)}(y - ${paren(y0)}) = 0$, that is $${answer}$.`,
                    `$${A}(x - ${paren(x0)}) + ${paren(B)}(y - ${paren(y0)}) = 0$，即 $${answer}$。`,
                  ),
                ],
              ],
              t(
                `The point lies on the line: $${A} \\cdot ${paren(x0)} + ${paren(B)} \\cdot ${paren(y0)} = ${C}$, and the line is perpendicular to $\\nabla f$, as a tangent must be.`,
                `该点在直线上：$${A} \\cdot ${paren(x0)} + ${paren(B)} \\cdot ${paren(y0)} = ${C}$，且直线垂直于 $\\nabla f$，切线正应如此。`,
              ),
            ),
          },
          [
            say(
              `${poly([B, "x"], [A, "y"])} = ${C}`,
              "The coefficients are swapped: $f_x$ goes with $x$ and $f_y$ with $y$.",
              "系数颠倒了：$f_x$ 对应 $x$，$f_y$ 对应 $y$。",
            ),
            say(
              `${poly([B, "x"], [-A, "y"])} = ${B * x0 - A * y0}`,
              "That line runs along $\\nabla f$: it is the normal line. The tangent line is perpendicular to the gradient.",
              "那条直线沿着 $\\nabla f$：它是法线。切线垂直于梯度。",
            ),
            say(
              `${poly([A, "x"], [B, "y"])} = 0`,
              `The right side is $Ax_0 + By_0 = ${C}$, so that the point lies on the line.`,
              `右边是 $Ax_0 + By_0 = ${C}$，这样该点才在直线上。`,
            ),
          ],
        );
      },
    },
    {
      id: "the-slope-of-a-level-curve",
      figure: multivariableDrawings2["tangent-lines-to-level-curves#the-slope-of-a-level-curve"],
      title: t("The slope of a level curve", "等值线的斜率"),
      explanation: t(
        "The gradient $(f_x, f_y)$ is perpendicular to the level curve through a point, so the tangent line has direction $(f_y, -f_x)$ and slope\n\n$$\\frac{dy}{dx} = -\\frac{f_x}{f_y}$$\n\nwhenever $f_y \\ne 0$. This is implicit differentiation written with partial derivatives. For $x^3 + xy = 10$ at $(2, 1)$: $f_x = 3x^2 + y = 13$ and $f_y = x = 2$, so the slope is $-\\frac{13}{2}$.\n\n> **Watch out.** Keep the minus sign and put $f_x$ on top. $\\frac{f_y}{f_x}$ is the slope of the gradient itself, which is perpendicular to the curve.",
        "梯度 $(f_x, f_y)$ 垂直于过该点的等值线，所以切线方向为 $(f_y, -f_x)$，在 $f_y \\ne 0$ 时斜率为\n\n$$\\frac{dy}{dx} = -\\frac{f_x}{f_y}.$$\n\n这就是用偏导数写出的隐函数求导。对 $x^3 + xy = 10$ 在 $(2, 1)$ 处：$f_x = 3x^2 + y = 13$，$f_y = x = 2$，所以斜率为 $-\\frac{13}{2}$。\n\n> **注意。** 要保留负号，并把 $f_x$ 放在分子。$\\frac{f_y}{f_x}$ 是梯度本身的斜率，而梯度垂直于曲线。",
      ),
      generate(rng: Rng): Problem {
        let a = 0;
        let b = 0;
        let c = 0;
        let p = 0;
        let q = 0;
        do {
          a = rng.int(-3, 3) || 1;
          b = rng.int(-4, 4);
          c = rng.int(-3, 3) || 2;
          p = rng.int(-3, 3);
          q = rng.int(-3, 3) || 1;
        } while (2 * a * p + b * q === 0 || b * p + 2 * c * q === 0);
        const fx = 2 * a * p + b * q;
        const fy = b * p + 2 * c * q;
        const ans = Q.of(-fx, fy);
        const k = a * p * p + b * p * q + c * q * q;
        const curve = poly([a, "x^2"], [b, "xy"], [c, "y^2"]);
        return numberProblem({
          prompt: t(
            `Find the slope of the tangent line to the level curve $${curve} = ${k}$ at $(${p}, ${q})$.`,
            `求等值线 $${curve} = ${k}$ 在 $(${p}, ${q})$ 处切线的斜率。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(Q.of(fx, fy), "The slope is $-\\frac{f_x}{f_y}$: keep the minus sign.", "斜率是 $-\\frac{f_x}{f_y}$：要保留负号。"),
            why(
              Q.of(fy, fx),
              "That is the slope of the gradient, which is perpendicular to the curve.",
              "那是梯度的斜率，而梯度垂直于曲线。",
            ),
            why(Q.of(-fy, fx), "The fraction is upside down: $f_x$ goes on top.", "分式上下颠倒了：$f_x$ 在分子。"),
          ]),
          solution: walked(
            [
              [
                ["Find the partial derivatives", "求偏导数"],
                t(
                  `$f_x = ${poly([2 * a, "x"], [b, "y"])} = ${fx}$ and $f_y = ${poly([b, "x"], [2 * c, "y"])} = ${fy}$ at $(${p}, ${q})$.`,
                  `在 $(${p}, ${q})$ 处 $f_x = ${poly([2 * a, "x"], [b, "y"])} = ${fx}$，$f_y = ${poly([b, "x"], [2 * c, "y"])} = ${fy}$。`,
                ),
              ],
              [
                ["Divide", "相除"],
                t(
                  `$\\frac{dy}{dx} = -\\frac{${fx}}{${fy}} = ${ans.toLatex()}$.`,
                  `$\\frac{dy}{dx} = -\\frac{${fx}}{${fy}} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The direction $(1, ${ans.toLatex()})$ is perpendicular to $\\nabla f$: $${fx} + ${paren(fy)} \\cdot ${paren(ans)} = 0$.`,
              `方向 $(1, ${ans.toLatex()})$ 垂直于 $\\nabla f$：$${fx} + ${paren(fy)} \\cdot ${paren(ans)} = 0$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** tangentPlanesToLevelSurfaces computes tangent planes to F(x, y, z) = k. */
export const tangentPlanesToLevelSurfaces: TopicDef = {
  id: "tangent-planes-to-level-surfaces",
  title: t("Tangent Planes to Level Surfaces", "等值面的切平面"),
  summary: t(
    "The tangent plane to F(x, y, z) = k at (x0, y0, z0) is Fx(x - x0) + Fy(y - y0) + Fz(z - z0) = 0.",
    "等值面 F(x, y, z) = k 在 (x0, y0, z0) 处的切平面方程为 Fx(x - x0) + Fy(y - y0) + Fz(z - z0) = 0。",
  ),
  intro: t(
    "For $xy + z^2 = 7$ at $(3, 2, 1)$, $\\nabla F = \\langle y, x, 2z \\rangle = \\langle 2, 3, 2 \\rangle$. The tangent plane is $2(x - 3) + 3(y - 2) + 2(z - 1) = 0$, or $2x + 3y + 2z = 14$.\n\nCheck: the point fits, $6 + 6 + 2 = 14$.\n\nIn this lesson we write tangent planes to surfaces given by an equation $F(x, y, z) = k$, and find their intercepts.",
    "对 $xy + z^2 = 7$ 在 $(3, 2, 1)$ 处，$\\nabla F = \\langle y, x, 2z \\rangle = \\langle 2, 3, 2 \\rangle$。切平面为 $2(x - 3) + 3(y - 2) + 2(z - 1) = 0$，即 $2x + 3y + 2z = 14$。\n\n检验：该点满足 $6 + 6 + 2 = 14$。\n\n本课我们写出由方程 $F(x, y, z) = k$ 给出的曲面的切平面，并求它的截距。",
  ),
  prerequisites: ["the-gradient-as-a-normal-vector"],
  encompasses: [{ topic: "the-gradient-as-a-normal-vector", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "computing-tangent-planes-to-implicit-surfaces",
      figure: multivariableDrawings2["tangent-planes-to-level-surfaces#computing-tangent-planes-to-implicit-surfaces"],
      title: t("Computing tangent planes to implicit surfaces", "计算隐式曲面的切平面"),
      explanation: t(
        "The gradient is perpendicular to every level surface, so the gradient at the point serves as the normal vector of the tangent plane. For an implicitly defined surface $F(x, y, z) = k$, the tangent plane at $(x_0, y_0, z_0)$ has normal $\\nabla F(x_0, y_0, z_0) = \\langle F_x, F_y, F_z \\rangle$:\n\n$$F_x(x_0, y_0, z_0)(x - x_0) + F_y(x_0, y_0, z_0)(y - y_0) + F_z(x_0, y_0, z_0)(z - z_0) = 0.$$\n\nFor $x^2y + z = 5$ at $(1, 2, 3)$, $\\nabla F = \\langle 2xy, x^2, 1 \\rangle = \\langle 4, 1, 1 \\rangle$, so the plane is $4x + y + z = 9$.\n\n> **Watch out.** The right side is $\\nabla F \\cdot (x_0, y_0, z_0)$, not the level $k$, and not $0$. Each coefficient belongs to its own variable.",
        "梯度垂直于每个等值面，所以该点处的梯度可以作为切平面的法向量。对于隐式曲面 $F(x, y, z) = k$，其在点 $(x_0, y_0, z_0)$ 处的切平面以 $\\nabla F(x_0, y_0, z_0) = \\langle F_x, F_y, F_z \\rangle$ 为法向量：\n\n$$F_x(x_0, y_0, z_0)(x - x_0) + F_y(x_0, y_0, z_0)(y - y_0) + F_z(x_0, y_0, z_0)(z - z_0) = 0$$\n\n对 $x^2y + z = 5$ 在 $(1, 2, 3)$ 处，$\\nabla F = \\langle 2xy, x^2, 1 \\rangle = \\langle 4, 1, 1 \\rangle$，所以切平面为 $4x + y + z = 9$。\n\n> **注意。** 右边是 $\\nabla F \\cdot (x_0, y_0, z_0)$，不是等值 $k$，也不是 $0$。每个系数对应它自己的变量。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const c = rng.nonZero(-3, 3);
        let pt: Vec3 = [rng.int(-2, 2), rng.int(-2, 2), rng.int(-2, 2)];
        if (pt[0] === 0 && pt[1] === 0 && pt[2] === 0) pt = [rng.pick([-1, 1]), pt[1], pt[2]];
        const A = 2 * a * pt[0];
        const B = 2 * b * pt[1];
        const C = 2 * c * pt[2];
        const D = A * pt[0] + B * pt[1] + C * pt[2];
        const level = a * pt[0] ** 2 + b * pt[1] ** 2 + c * pt[2] ** 2;
        const answer = `${poly([A, "x"], [B, "y"], [C, "z"])} = ${D}`;
        const F = poly([a, "x^2"], [b, "y^2"], [c, "z^2"]);
        const at = `(${pt[0]}, ${pt[1]}, ${pt[2]})`;
        return equationWith(
          {
            prompt: t(
              `Find the equation of the tangent plane to the surface $${F} = ${level}$ at the point $${at}$.`,
              `求曲面 $${F} = ${level}$ 在点 $${at}$ 处的切平面方程。`,
            ),
            answer,
            solution: walked(
              [
                [
                  ["Find the normal", "求法向量"],
                  t(
                    `$\\nabla F = \\langle ${poly([2 * a, "x"])}, ${poly([2 * b, "y"])}, ${poly([2 * c, "z"])} \\rangle = \\langle ${A}, ${B}, ${C} \\rangle$ at $${at}$.`,
                    `在 $${at}$ 处 $\\nabla F = \\langle ${poly([2 * a, "x"])}, ${poly([2 * b, "y"])}, ${poly([2 * c, "z"])} \\rangle = \\langle ${A}, ${B}, ${C} \\rangle$。`,
                  ),
                ],
                [
                  ["Write the plane", "写出平面"],
                  t(
                    `$${A}(x - ${paren(pt[0])}) + ${paren(B)}(y - ${paren(pt[1])}) + ${paren(C)}(z - ${paren(pt[2])}) = 0$, that is $${answer}$.`,
                    `$${A}(x - ${paren(pt[0])}) + ${paren(B)}(y - ${paren(pt[1])}) + ${paren(C)}(z - ${paren(pt[2])}) = 0$，即 $${answer}$。`,
                  ),
                ],
              ],
              t(
                `For a sum of squares $\\nabla F \\cdot (x_0, y_0, z_0) = 2k$, and indeed $${D} = 2 \\cdot ${paren(level)}$.`,
                `对平方和形式的 $F$，$\\nabla F \\cdot (x_0, y_0, z_0) = 2k$，而确实 $${D} = 2 \\cdot ${paren(level)}$。`,
              ),
            ),
          },
          [
            say(
              `${poly([B, "x"], [A, "y"], [C, "z"])} = ${D}`,
              "The coefficients of $x$ and $y$ are swapped: $F_x$ goes with $x$.",
              "$x$ 和 $y$ 的系数颠倒了：$F_x$ 对应 $x$。",
            ),
            say(
              `${poly([A, "x"], [B, "y"], [C, "z"])} = ${level}`,
              `The right side is $\\nabla F \\cdot ${at} = ${D}$, not the level $${level}$.`,
              `右边是 $\\nabla F \\cdot ${at} = ${D}$，不是等值 $${level}$。`,
            ),
            say(
              `${poly([A, "x"], [B, "y"], [C, "z"])} = 0`,
              "That plane passes through the origin; the tangent plane passes through the point.",
              "那个平面经过原点；切平面应经过该点。",
            ),
          ],
        );
      },
    },
    {
      id: "intercepts-of-a-tangent-plane-to-xyz-equals-k",
      title: t("Intercepts of a tangent plane to xyz = k", "xyz = k 切平面的截距"),
      explanation: t(
        "For $F(x, y, z) = xyz$ the gradient at $(p, q, r)$ is $(qr, pr, pq)$, so the tangent plane to $xyz = pqr$ there is $qr(x - p) + pr(y - q) + pq(z - r) = 0$. Dividing by $pqr$ gives\n\n$$\\frac{x}{p} + \\frac{y}{q} + \\frac{z}{r} = 3,$$\n\nso the intercepts are $3p$, $3q$ and $3r$. For $xyz = 12$ at $(1, 2, 6)$ they are $3$, $6$ and $18$, with sum $27$.\n\n> **Watch out.** The right side is $3$, not $1$, so each intercept is three times the coordinate, with its sign. The normal is $(qr, pr, pq)$, not $(p, q, r)$.",
        "对 $F(x, y, z) = xyz$，在 $(p, q, r)$ 处的梯度为 $(qr, pr, pq)$，所以 $xyz = pqr$ 在该点的切平面为 $qr(x - p) + pr(y - q) + pq(z - r) = 0$。两边除以 $pqr$ 得\n\n$$\\frac{x}{p} + \\frac{y}{q} + \\frac{z}{r} = 3,$$\n\n所以截距为 $3p$、$3q$ 和 $3r$。对 $xyz = 12$ 在 $(1, 2, 6)$ 处，截距为 $3$、$6$、$18$，其和为 $27$。\n\n> **注意。** 右边是 $3$，不是 $1$，所以每个截距是坐标的三倍，并带着坐标的符号。法向量是 $(qr, pr, pq)$，不是 $(p, q, r)$。",
      ),
      generate(rng: Rng): Problem {
        const nz = (): number => rng.int(1, 5) * rng.pick([-1, 1]);
        const [p, q, r] = [nz(), nz(), nz()];
        const ans = 3 * (p + q + r);
        const term = (v: string, d: number, first: boolean): string =>
          `${d < 0 ? "-" : first ? "" : "+"} ${Math.abs(d) === 1 ? v : `\\frac{${v}}{${Math.abs(d)}}`}`;
        const plane = `${term("x", p, true)} ${term("y", q, false)} ${term("z", r, false)}`.trim();
        const S = p * p + q * q + r * r;
        const sphere = Q.of(S, p).add(Q.of(S, q)).add(Q.of(S, r));
        return numberProblem({
          prompt: t(
            `Find the sum of the $x$-, $y$- and $z$-intercepts of the tangent plane to $xyz = ${p * q * r}$ at $(${p}, ${q}, ${r})$.`,
            `求 $xyz = ${p * q * r}$ 在 $(${p}, ${q}, ${r})$ 处切平面的 $x$、$y$、$z$ 截距之和。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              p + q + r,
              "Dividing the plane by $pqr$ leaves $3$ on the right, so each intercept is three times the coordinate.",
              "平面方程除以 $pqr$ 后右边是 $3$，所以每个截距是坐标的三倍。",
            ),
            why(
              3 * (Math.abs(p) + Math.abs(q) + Math.abs(r)),
              "An intercept keeps the sign of its coordinate.",
              "截距带着对应坐标的符号。",
            ),
            why(
              sphere,
              "$(p, q, r)$ is normal to a sphere, not to $xyz = k$; the normal here is $(qr, pr, pq)$.",
              "$(p, q, r)$ 是球面的法向量，不是 $xyz = k$ 的；这里的法向量是 $(qr, pr, pq)$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Write the plane", "写出平面"],
                t(
                  `$\\nabla F = (${q * r}, ${p * r}, ${p * q})$, and dividing $${q * r}(x - ${paren(p)}) + ${paren(p * r)}(y - ${paren(q)}) + ${paren(p * q)}(z - ${paren(r)}) = 0$ by $${p * q * r}$ gives $${plane} = 3$.`,
                  `$\\nabla F = (${q * r}, ${p * r}, ${p * q})$，把 $${q * r}(x - ${paren(p)}) + ${paren(p * r)}(y - ${paren(q)}) + ${paren(p * q)}(z - ${paren(r)}) = 0$ 除以 $${p * q * r}$ 得 $${plane} = 3$。`,
                ),
              ],
              [
                ["Add the intercepts", "截距相加"],
                t(
                  `The intercepts are $${3 * p}$, $${3 * q}$ and $${3 * r}$, with sum $${ans}$.`,
                  `截距为 $${3 * p}$、$${3 * q}$ 和 $${3 * r}$，其和为 $${ans}$。`,
                ),
              ],
            ],
            t(
              `The point lies on the plane: $\\frac{${p}}{${p}} + \\frac{${q}}{${q}} + \\frac{${r}}{${r}} = 3$, and the $x$-intercept $(${3 * p}, 0, 0)$ gives $\\frac{${3 * p}}{${p}} = 3$.`,
              `该点在平面上：$\\frac{${p}}{${p}} + \\frac{${q}}{${q}} + \\frac{${r}}{${r}} = 3$；$x$ 截距 $(${3 * p}, 0, 0)$ 也给出 $\\frac{${3 * p}}{${p}} = 3$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** directionalDerivatives calculates directional derivatives Du f = ∇f · u. */
export const directionalDerivatives: TopicDef = {
  id: "directional-derivatives",
  title: t("Directional Derivatives", "方向导数"),
  summary: t(
    "The directional derivative Du f(x0, y0) = ∇f(x0, y0) · u measures the rate of change of f in the direction of the unit vector u.",
    "方向导数 Du f(x0, y0) = ∇f(x0, y0) · u 度量函数 f 沿单位向量 u 方向的变化率。",
  ),
  intro: t(
    "For $f(x, y) = x^2y$ at $(1, 3)$ in the direction $\\mathbf{u} = \\left(\\frac{3}{5}, \\frac{4}{5}\\right)$: $\\nabla f = (2xy, x^2) = (6, 1)$, so $D_{\\mathbf{u}}f = \\frac{18}{5} + \\frac{4}{5} = \\frac{22}{5} = 4.4$.\n\nCheck: a step of $0.05$ along $\\mathbf{u}$ reaches $(1.03, 3.04)$, where $f = 1.0609 \\cdot 3.04 \\approx 3.2251$, and $\\frac{3.2251 - 3}{0.05} \\approx 4.5$, close to $4.4$.\n\nIn this lesson we compute directional derivatives with unit vectors, including the direction toward a given point.",
    "对 $f(x, y) = x^2y$ 在 $(1, 3)$ 处沿方向 $\\mathbf{u} = \\left(\\frac{3}{5}, \\frac{4}{5}\\right)$：$\\nabla f = (2xy, x^2) = (6, 1)$，所以 $D_{\\mathbf{u}}f = \\frac{18}{5} + \\frac{4}{5} = \\frac{22}{5} = 4.4$。\n\n检验：沿 $\\mathbf{u}$ 走 $0.05$ 到达 $(1.03, 3.04)$，该处 $f = 1.0609 \\cdot 3.04 \\approx 3.2251$，而 $\\frac{3.2251 - 3}{0.05} \\approx 4.5$，接近 $4.4$。\n\n本课我们用单位向量计算方向导数，包括朝向给定点的方向。",
  ),
  prerequisites: ["the-gradient-vector"],
  encompasses: [{ topic: "the-gradient-vector", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "computing-directional-derivatives",
      title: t("Computing directional derivatives", "计算方向导数"),
      explanation: t(
        "The rate of change in any direction is the dot product of the gradient with a unit vector in that direction, so normalize the direction first. For a differentiable function $f(x, y)$ and a unit vector $\\mathbf{u} = \\langle u_1, u_2 \\rangle$:\n\n$$D_{\\mathbf{u}} f(x_0, y_0) = \\nabla f(x_0, y_0) \\cdot \\mathbf{u} = f_x(x_0, y_0)u_1 + f_y(x_0, y_0)u_2.$$\n\nFor $f = xy$ at $(2, 5)$ and $\\mathbf{u} = \\left\\langle \\frac{5}{13}, \\frac{12}{13} \\right\\rangle$: $\\nabla f = \\langle 5, 2 \\rangle$, so $D_{\\mathbf{u}}f = \\frac{25}{13} + \\frac{24}{13} = \\frac{49}{13}$.\n\n> **Watch out.** Pair $f_x$ with $u_1$ and $f_y$ with $u_2$. The components of $\\mathbf{u}$ are the fractions, so using their numerators alone multiplies the answer by the denominator.",
        "沿任意方向的变化率等于梯度与该方向单位向量的点积，所以要先把方向单位化。对于可微函数 $f(x, y)$ 和单位向量 $\\mathbf{u} = \\langle u_1, u_2 \\rangle$：\n\n$$D_{\\mathbf{u}} f(x_0, y_0) = \\nabla f(x_0, y_0) \\cdot \\mathbf{u} = f_x(x_0, y_0)u_1 + f_y(x_0, y_0)u_2$$\n\n对 $f = xy$ 在 $(2, 5)$ 处、$\\mathbf{u} = \\left\\langle \\frac{5}{13}, \\frac{12}{13} \\right\\rangle$：$\\nabla f = \\langle 5, 2 \\rangle$，所以 $D_{\\mathbf{u}}f = \\frac{25}{13} + \\frac{24}{13} = \\frac{49}{13}$。\n\n> **注意。** $f_x$ 与 $u_1$ 相乘，$f_y$ 与 $u_2$ 相乘。$\\mathbf{u}$ 的分量是分数，只用分子相当于把答案乘以分母。",
      ),
      generate(rng: Rng): Problem {
        const [u1Int, u2Int, mag] = rng.pick(pythagoreanTriples);
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        let x0 = rng.int(-2, 2);
        const y0 = rng.int(-2, 2);
        if (x0 === 0 && y0 === 0) x0 = 1;
        const fx = 2 * a * x0;
        const fy = 2 * b * y0;
        const ans = Q.of(fx * u1Int + fy * u2Int, mag);
        const u = `\\left\\langle \\frac{${u1Int}}{${mag}}, \\frac{${u2Int}}{${mag}} \\right\\rangle`;
        return numberProblem({
          prompt: t(
            `Find the directional derivative $D_{\\mathbf{u}} f(${x0}, ${y0})$ of $f(x, y) = ${poly([a, "x^2"], [b, "y^2"])}$ in the direction of the unit vector $\\mathbf{u} = ${u}$.`,
            `求函数 $f(x, y) = ${poly([a, "x^2"], [b, "y^2"])}$ 在点 $(${x0}, ${y0})$ 处沿单位向量 $\\mathbf{u} = ${u}$ 方向的方向导数 $D_{\\mathbf{u}} f(${x0}, ${y0})$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              fx + fy,
              "Each component of the gradient is weighted by the matching component of $\\mathbf{u}$.",
              "梯度的每个分量都要乘以 $\\mathbf{u}$ 的对应分量。",
            ),
            why(
              Q.of(fx * u2Int + fy * u1Int, mag),
              "The components are crossed: $f_x$ pairs with $u_1$ and $f_y$ with $u_2$.",
              "分量交叉了：$f_x$ 与 $u_1$ 相乘，$f_y$ 与 $u_2$ 相乘。",
            ),
            why(
              fx * u1Int + fy * u2Int,
              `The components of $\\mathbf{u}$ are fractions; using the numerators alone multiplies by $${mag}$.`,
              `$\\mathbf{u}$ 的分量是分数；只用分子相当于乘了 $${mag}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the gradient", "求梯度"],
                t(
                  `$\\nabla f = \\langle ${poly([2 * a, "x"])}, ${poly([2 * b, "y"])} \\rangle = \\langle ${fx}, ${fy} \\rangle$ at $(${x0}, ${y0})$.`,
                  `在 $(${x0}, ${y0})$ 处 $\\nabla f = \\langle ${poly([2 * a, "x"])}, ${poly([2 * b, "y"])} \\rangle = \\langle ${fx}, ${fy} \\rangle$。`,
                ),
              ],
              [
                ["Dot with u", "与 u 作点积"],
                t(
                  `$D_{\\mathbf{u}} f = ${fx} \\cdot \\frac{${u1Int}}{${mag}} + ${paren(fy)} \\cdot \\frac{${u2Int}}{${mag}} = ${ans.toLatex()}$.`,
                  `$D_{\\mathbf{u}} f = ${fx} \\cdot \\frac{${u1Int}}{${mag}} + ${paren(fy)} \\cdot \\frac{${u2Int}}{${mag}} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `No direction beats the gradient: $(${ans.toLatex()})^2 = ${ans.mul(ans).toLatex()}$ is at most $|\\nabla f|^2 = ${fx * fx + fy * fy}$.`,
              `没有方向能超过梯度：$(${ans.toLatex()})^2 = ${ans.mul(ans).toLatex()}$ 不超过 $|\\nabla f|^2 = ${fx * fx + fy * fy}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-directional-derivative-toward-a-point",
      title: t("The directional derivative toward a point", "朝向某点的方向导数"),
      explanation: t(
        "To find the rate of change of $f$ at $P$ in the direction of another point $R$, first form the vector $\\vec{PR}$ and divide it by its length to get a unit vector $\\mathbf{u}$. Then\n\n$$D_{\\mathbf{u}} f(P) = \\nabla f(P) \\cdot \\mathbf{u}.$$\n\nFor $f = xy$ at $P(1, 1)$ toward $R(4, 5)$: $\\vec{PR} = (3, 4)$ has length $5$, $\\nabla f(P) = (1, 1)$, so $D_{\\mathbf{u}}f = \\frac{3}{5} + \\frac{4}{5} = \\frac{7}{5}$.\n\n> **Watch out.** Skipping the normalization multiplies the answer by $|\\vec{PR}|$. The direction is $R - P$, not the coordinates of $R$.",
        "要求 $f$ 在 $P$ 处朝另一点 $R$ 方向的变化率，先构造向量 $\\vec{PR}$，再除以其长度得到单位向量 $\\mathbf{u}$。于是\n\n$$D_{\\mathbf{u}} f(P) = \\nabla f(P) \\cdot \\mathbf{u}.$$\n\n对 $f = xy$ 在 $P(1, 1)$ 处朝 $R(4, 5)$：$\\vec{PR} = (3, 4)$ 的长度为 $5$，$\\nabla f(P) = (1, 1)$，所以 $D_{\\mathbf{u}}f = \\frac{3}{5} + \\frac{4}{5} = \\frac{7}{5}$。\n\n> **注意。** 若不单位化，答案会被乘以 $|\\vec{PR}|$。方向是 $R - P$，不是 $R$ 的坐标。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-3, 3) || 1;
        const b = rng.int(-5, 5) || 2;
        const p = rng.int(-3, 3) || 1;
        const q = rng.int(-3, 3);
        const [u0, v0, w] = rng.pick(pythagoreanTriples.slice(0, 4));
        const u = u0 * rng.pick([-1, 1]);
        const v = v0 * rng.pick([-1, 1]);
        const fx = 2 * a * p;
        const fy = b;
        const ans = Q.of(fx * u + fy * v, w);
        return numberProblem({
          prompt: t(
            `Find the directional derivative of $f(x, y) = ${poly([a, "x^2"], [b, "y"])}$ at $P(${p}, ${q})$ in the direction of $R(${p + u}, ${q + v})$.`,
            `求 $f(x, y) = ${poly([a, "x^2"], [b, "y"])}$ 在 $P(${p}, ${q})$ 处朝 $R(${p + u}, ${q + v})$ 方向的方向导数。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              fx * u + fy * v,
              `Divide $\\vec{PR}$ by its length $${w}$ first; otherwise the rate is multiplied by $${w}$.`,
              `要先把 $\\vec{PR}$ 除以它的长度 $${w}$；否则变化率被乘以 $${w}$。`,
            ),
            why(fx + fy, "The gradient must be dotted with the unit direction, not summed.", "梯度要与单位方向作点积，而不是把分量相加。"),
            why(
              Q.of(fx * v + fy * u, w),
              "The components are crossed: $f_x$ pairs with the $x$-step of $\\vec{PR}$.",
              "分量交叉了：$f_x$ 要与 $\\vec{PR}$ 的 $x$ 分量相乘。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Make the unit vector", "求单位向量"],
                t(
                  `$\\vec{PR} = (${u}, ${v})$ has length $${w}$, so $\\mathbf{u} = \\left(${Q.of(u, w).toLatex()}, ${Q.of(v, w).toLatex()}\\right)$.`,
                  `$\\vec{PR} = (${u}, ${v})$ 的长度为 $${w}$，所以 $\\mathbf{u} = \\left(${Q.of(u, w).toLatex()}, ${Q.of(v, w).toLatex()}\\right)$。`,
                ),
              ],
              [
                ["Dot with the gradient", "与梯度作点积"],
                t(
                  `$\\nabla f(P) = (${fx}, ${fy})$, so $D_{\\mathbf{u}} f = \\frac{${fx} \\cdot ${paren(u)} + ${paren(fy)} \\cdot ${paren(v)}}{${w}} = ${ans.toLatex()}$.`,
                  `$\\nabla f(P) = (${fx}, ${fy})$，所以 $D_{\\mathbf{u}} f = \\frac{${fx} \\cdot ${paren(u)} + ${paren(fy)} \\cdot ${paren(v)}}{${w}} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `No direction beats the gradient: $(${ans.toLatex()})^2 = ${ans.mul(ans).toLatex()}$ is at most $|\\nabla f|^2 = ${fx * fx + fy * fy}$.`,
              `没有方向能超过梯度：$(${ans.toLatex()})^2 = ${ans.mul(ans).toLatex()}$ 不超过 $|\\nabla f|^2 = ${fx * fx + fy * fy}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** theMultivariableMeanValueTheorem covers the mean value theorem in multiple variables. */
export const theMultivariableMeanValueTheorem: TopicDef = {
  id: "the-multivariable-mean-value-theorem",
  title: t("The Multivariable Mean-Value Theorem", "多元拉格朗日中值定理"),
  summary: t(
    "The multivariable mean-value theorem states that f(b) - f(a) = ∇f(c) · (b - a) for some point c on the line segment connecting a and b.",
    "多元拉格朗日中值定理表明，连接 a 与 b 的线段上存在某点 c，使得 f(b) - f(a) = ∇f(c) · (b - a)。",
  ),
  intro: t(
    "For $f(x, y) = x^2 + y^2$ from $\\mathbf{a} = (0, 0)$ to $\\mathbf{b} = (2, 2)$, the change is $8$. On the segment, $\\mathbf{c} = (2s, 2s)$ has $\\nabla f(\\mathbf{c}) \\cdot (2, 2) = (4s, 4s) \\cdot (2, 2) = 16s$, which equals $8$ at $s = \\frac{1}{2}$, so $\\mathbf{c} = (1, 1)$.\n\nCheck: $\\nabla f(1, 1) = (2, 2)$ and $(2, 2) \\cdot (2, 2) = 8 = f(2, 2) - f(0, 0)$.\n\nIn this lesson we relate the change of a function along a segment to its gradient at a point between the ends.",
    "对 $f(x, y) = x^2 + y^2$ 从 $\\mathbf{a} = (0, 0)$ 到 $\\mathbf{b} = (2, 2)$，变化量为 $8$。线段上的点 $\\mathbf{c} = (2s, 2s)$ 满足 $\\nabla f(\\mathbf{c}) \\cdot (2, 2) = (4s, 4s) \\cdot (2, 2) = 16s$，在 $s = \\frac{1}{2}$ 时等于 $8$，所以 $\\mathbf{c} = (1, 1)$。\n\n检验：$\\nabla f(1, 1) = (2, 2)$，而 $(2, 2) \\cdot (2, 2) = 8 = f(2, 2) - f(0, 0)$。\n\n本课我们把函数沿线段的变化量与两端之间某点处的梯度联系起来。",
  ),
  prerequisites: ["directional-derivatives"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "understanding-the-multivariable-mean-value-theorem",
      title: t("Understanding the multivariable mean-value theorem", "理解多元拉格朗日中值定理"),
      explanation: t(
        "Let $f$ be differentiable on an open set containing the line segment from $\\mathbf{a}$ to $\\mathbf{b}$. Then there exists a point $\\mathbf{c}$ on that segment such that:\n\n$$f(\\mathbf{b}) - f(\\mathbf{a}) = \\nabla f(\\mathbf{c}) \\cdot (\\mathbf{b} - \\mathbf{a}).$$\n\nFrom $\\mathbf{a} = (1, 1)$ to $\\mathbf{b} = (4, -3)$ with $\\nabla f(\\mathbf{c}) = \\langle 2, 6 \\rangle$, the change is $\\langle 2, 6 \\rangle \\cdot \\langle 3, -4 \\rangle = 6 - 24 = -18$.\n\n> **Watch out.** Dot the gradient with the displacement $\\mathbf{b} - \\mathbf{a}$, not with $\\mathbf{b}$ itself, and pair the first components together. Reversing the displacement reverses the sign.",
        "设 $f$ 在包含从 $\\mathbf{a}$ 到 $\\mathbf{b}$ 线段的开集上可微。则在该线段上存在一点 $\\mathbf{c}$ 使得：\n\n$$f(\\mathbf{b}) - f(\\mathbf{a}) = \\nabla f(\\mathbf{c}) \\cdot (\\mathbf{b} - \\mathbf{a})$$\n\n从 $\\mathbf{a} = (1, 1)$ 到 $\\mathbf{b} = (4, -3)$，若 $\\nabla f(\\mathbf{c}) = \\langle 2, 6 \\rangle$，变化量为 $\\langle 2, 6 \\rangle \\cdot \\langle 3, -4 \\rangle = 6 - 24 = -18$。\n\n> **注意。** 梯度要与位移 $\\mathbf{b} - \\mathbf{a}$ 作点积，而不是与 $\\mathbf{b}$ 本身；第一个分量与第一个分量相乘。位移反向，符号也反过来。",
      ),
      generate(rng: Rng): Problem {
        const x1 = rng.int(-4, 4);
        const y1 = rng.nonZero(-4, 4);
        const dx = rng.nonZero(-4, 4);
        const dy = rng.nonZero(-4, 4);
        const x2 = x1 + dx;
        const y2 = y1 + dy;
        const u = rng.nonZero(-5, 5);
        const v = rng.nonZero(-5, 5);
        const ans = u * dx + v * dy;
        return numberProblem({
          prompt: t(
            `By the Multivariable Mean-Value Theorem, for a differentiable function $f$, $f(\\mathbf{b}) - f(\\mathbf{a}) = \\nabla f(\\mathbf{c}) \\cdot (\\mathbf{b} - \\mathbf{a})$ for some point $\\mathbf{c}$ on the line segment connecting $\\mathbf{a} = (${x1}, ${y1})$ and $\\mathbf{b} = (${x2}, ${y2})$. If $\\nabla f(\\mathbf{c}) = \\langle ${u}, ${v} \\rangle$, calculate the change $f(\\mathbf{b}) - f(\\mathbf{a})$.`,
            `根据多元拉格朗日中值定理，对于可微函数 $f$，在连接 $\\mathbf{a} = (${x1}, ${y1})$ 与 $\\mathbf{b} = (${x2}, ${y2})$ 的线段上存在某点 $\\mathbf{c}$ 满足 $f(\\mathbf{b}) - f(\\mathbf{a}) = \\nabla f(\\mathbf{c}) \\cdot (\\mathbf{b} - \\mathbf{a})$。若 $\\nabla f(\\mathbf{c}) = \\langle ${u}, ${v} \\rangle$，计算函数变化量 $f(\\mathbf{b}) - f(\\mathbf{a})$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              u * dy + v * dx,
              "The components are crossed: the first gradient component pairs with the change in $x$.",
              "分量交叉了：梯度的第一个分量与 $x$ 的变化相乘。",
            ),
            why(
              -ans,
              "That uses $\\mathbf{a} - \\mathbf{b}$; the displacement runs from $\\mathbf{a}$ to $\\mathbf{b}$.",
              "那用的是 $\\mathbf{a} - \\mathbf{b}$；位移是从 $\\mathbf{a}$ 到 $\\mathbf{b}$。",
            ),
            why(
              u * x2 + v * y2,
              "Dot with the displacement $\\mathbf{b} - \\mathbf{a}$, not with the point $\\mathbf{b}$.",
              "要与位移 $\\mathbf{b} - \\mathbf{a}$ 作点积，而不是与点 $\\mathbf{b}$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the displacement", "求位移"],
                t(
                  `$\\mathbf{b} - \\mathbf{a} = \\langle ${x2} - ${paren(x1)}, ${y2} - ${paren(y1)} \\rangle = \\langle ${dx}, ${dy} \\rangle$.`,
                  `$\\mathbf{b} - \\mathbf{a} = \\langle ${x2} - ${paren(x1)}, ${y2} - ${paren(y1)} \\rangle = \\langle ${dx}, ${dy} \\rangle$。`,
                ),
              ],
              [
                ["Dot with the gradient", "与梯度作点积"],
                t(
                  `$${u} \\cdot ${paren(dx)} + ${paren(v)} \\cdot ${paren(dy)} = ${ans}$.`,
                  `$${u} \\cdot ${paren(dx)} + ${paren(v)} \\cdot ${paren(dy)} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `Going back from $\\mathbf{b}$ to $\\mathbf{a}$, the displacement $\\langle ${-dx}, ${-dy} \\rangle$ gives $${-ans}$, which is $f(\\mathbf{a}) - f(\\mathbf{b})$, as it should be.`,
              `从 $\\mathbf{b}$ 回到 $\\mathbf{a}$，位移 $\\langle ${-dx}, ${-dy} \\rangle$ 给出 $${-ans}$，正是 $f(\\mathbf{a}) - f(\\mathbf{b})$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-mean-value-point-of-a-quadratic",
      title: t("The mean value point of a quadratic", "二次函数的中值点"),
      explanation: t(
        "The mean value theorem says that for $f$ differentiable along the segment from $P$ to $R$ there is a point $C$ on it with\n\n$$f(R) - f(P) = \\nabla f(C) \\cdot (R - P).$$\n\nFor a quadratic such as $ax^2 + cy^2 + dx$, $\\nabla f$ changes linearly along the segment, and the point that works is exactly the midpoint of $P$ and $R$. For $f = x^2 - y^2$ from $(0, 0)$ to $(2, 4)$: $f(R) - f(P) = -12$, and at the midpoint $(1, 2)$, $\\nabla f \\cdot (2, 4) = (2, -4) \\cdot (2, 4) = -12$.\n\n> **Watch out.** The midpoint is $\\frac{P + R}{2}$, not half the displacement $\\frac{R - P}{2}$, and in general neither endpoint works.",
        "中值定理指出，若 $f$ 沿从 $P$ 到 $R$ 的线段可微，则线段上存在点 $C$ 使\n\n$$f(R) - f(P) = \\nabla f(C) \\cdot (R - P).$$\n\n对 $ax^2 + cy^2 + dx$ 这样的二次函数，$\\nabla f$ 沿线段线性变化，满足条件的点恰好是 $P$ 与 $R$ 的中点。对 $f = x^2 - y^2$ 从 $(0, 0)$ 到 $(2, 4)$：$f(R) - f(P) = -12$，而在中点 $(1, 2)$ 处 $\\nabla f \\cdot (2, 4) = (2, -4) \\cdot (2, 4) = -12$。\n\n> **注意。** 中点是 $\\frac{P + R}{2}$，不是位移的一半 $\\frac{R - P}{2}$；一般来说两个端点都不满足。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 4);
        const c = rng.int(1, 4);
        const d = rng.int(-5, 5);
        const P = [rng.int(-4, 4), rng.int(-4, 4)] as const;
        const R = [P[0] + rng.int(1, 5) * rng.pick([-1, 1]), P[1] + rng.int(-4, 4)] as const;
        const dx = R[0] - P[0];
        const dy = R[1] - P[1];
        const mx = Q.of(P[0] + R[0], 2);
        const my = Q.of(P[1] + R[1], 2);
        const g0 = (2 * a * P[0] + d) * dx + 2 * c * P[1] * dy;
        const bend = a * dx * dx + c * dy * dy;
        const change = g0 + bend;
        const gx = mx.mul(Q.of(2 * a)).add(Q.of(d));
        const gy = my.mul(Q.of(2 * c));
        return pointWith(
          {
            prompt: t(
              `For $f(x, y) = ${poly([a, "x^2"], [c, "y^2"], [d, "x"])}$, find the point $C$ on the segment from $P(${P[0]}, ${P[1]})$ to $R(${R[0]}, ${R[1]})$ with $f(R) - f(P) = \\nabla f(C) \\cdot (R - P)$.`,
              `对 $f(x, y) = ${poly([a, "x^2"], [c, "y^2"], [d, "x"])}$，求从 $P(${P[0]}, ${P[1]})$ 到 $R(${R[0]}, ${R[1]})$ 的线段上满足 $f(R) - f(P) = \\nabla f(C) \\cdot (R - P)$ 的点 $C$。`,
            ),
            answer: [mx, my],
            solution: walked(
              [
                [
                  ["Move along the segment", "沿线段移动"],
                  t(
                    `With $R - P = (${dx}, ${dy})$ and $C = P + s(R - P)$, $\\nabla f(C) \\cdot (R - P) = ${g0} + ${paren(2 * bend)}s$.`,
                    `由 $R - P = (${dx}, ${dy})$ 和 $C = P + s(R - P)$，得 $\\nabla f(C) \\cdot (R - P) = ${g0} + ${paren(2 * bend)}s$。`,
                  ),
                ],
                [
                  ["Match the change", "与变化量相等"],
                  t(
                    `$f(R) - f(P) = ${change} = ${g0} + ${paren(bend)}$, so $s = \\frac{1}{2}$ and $C = \\left(${mx.toLatex()}, ${my.toLatex()}\\right)$, the midpoint.`,
                    `$f(R) - f(P) = ${change} = ${g0} + ${paren(bend)}$，所以 $s = \\frac{1}{2}$，$C = \\left(${mx.toLatex()}, ${my.toLatex()}\\right)$，即中点。`,
                  ),
                ],
              ],
              t(
                `$\\nabla f(C) = \\left(${gx.toLatex()}, ${gy.toLatex()}\\right)$, and $${paren(gx)} \\cdot ${paren(dx)} + ${paren(gy)} \\cdot ${paren(dy)} = ${change}$.`,
                `$\\nabla f(C) = \\left(${gx.toLatex()}, ${gy.toLatex()}\\right)$，而 $${paren(gx)} \\cdot ${paren(dx)} + ${paren(gy)} \\cdot ${paren(dy)} = ${change}$。`,
              ),
            ),
          },
          [
            [
              [P[0], P[1]],
              "At $P$ the gradient gives the starting rate, which misses the bending of $f$; the point is the midpoint.",
              "在 $P$ 处梯度只给出起始变化率，漏掉了 $f$ 的弯曲；所求点是中点。",
            ],
            [
              [R[0], R[1]],
              "At $R$ the gradient gives the final rate, which overshoots; the point is the midpoint.",
              "在 $R$ 处梯度给出的是终点变化率，偏大了；所求点是中点。",
            ],
            [
              [Q.of(dx, 2), Q.of(dy, 2)],
              "That is half the displacement $\\frac{R - P}{2}$; the midpoint is $\\frac{P + R}{2}$.",
              "那是位移的一半 $\\frac{R - P}{2}$；中点是 $\\frac{P + R}{2}$。",
            ],
          ],
        );
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 2.9 The Multivariable Chain Rule
// ---------------------------------------------------------------------------

/** theMultivariableChainRule computes dz/dt along parametric curves. */
export const theMultivariableChainRule: TopicDef = {
  id: "the-multivariable-chain-rule",
  title: t("The Multivariable Chain Rule", "多元复合函数求导法则"),
  summary: t(
    "The multivariable chain rule gives dz/dt = (∂z/∂x)(dx/dt) + (∂z/∂y)(dy/dt) when z = f(x, y) with x = g(t) and y = h(t).",
    "多元链式法则表明，当 z = f(x, y) 且 x = g(t)、y = h(t) 时，dz/dt = (∂z/∂x)(dx/dt) + (∂z/∂y)(dy/dt)。",
  ),
  intro: t(
    "Let $z = xy^2$ with $x = 2t$ and $y = t + 1$. At $t = 1$: $x = 2$, $y = 2$, $z_x = y^2 = 4$, $z_y = 2xy = 8$, $\\frac{dx}{dt} = 2$ and $\\frac{dy}{dt} = 1$, so $\\frac{dz}{dt} = 4 \\cdot 2 + 8 \\cdot 1 = 16$.\n\nCheck: substituting, $z = 2t(t + 1)^2$, and $\\frac{dz}{dt} = 2(t + 1)^2 + 4t(t + 1) = 8 + 8 = 16$ at $t = 1$.\n\nIn this lesson we differentiate along a path with the multivariable chain rule, with one parameter and with two.",
    "设 $z = xy^2$，其中 $x = 2t$，$y = t + 1$。在 $t = 1$ 时：$x = 2$，$y = 2$，$z_x = y^2 = 4$，$z_y = 2xy = 8$，$\\frac{dx}{dt} = 2$，$\\frac{dy}{dt} = 1$，所以 $\\frac{dz}{dt} = 4 \\cdot 2 + 8 \\cdot 1 = 16$。\n\n检验：代入得 $z = 2t(t + 1)^2$，$\\frac{dz}{dt} = 2(t + 1)^2 + 4t(t + 1)$，在 $t = 1$ 时为 $8 + 8 = 16$。\n\n本课我们用多元链式法则沿路径求导，包括一个参数和两个参数的情形。",
  ),
  prerequisites: ["the-gradient-vector"],
  encompasses: [{ topic: "the-gradient-vector", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "computing-derivatives-via-multivariable-chain-rule",
      title: t("Computing derivatives via the multivariable chain rule", "利用多元链式法则求导"),
      explanation: t(
        "When each input depends on a parameter, the total rate of change adds the contribution of each input: its partial derivative times its own rate. If $z = f(x, y)$ is differentiable and $x = g(t)$, $y = h(t)$ are differentiable functions of $t$, then:\n\n$$\\frac{dz}{dt} = \\frac{\\partial z}{\\partial x}\\frac{dx}{dt} + \\frac{\\partial z}{\\partial y}\\frac{dy}{dt}.$$\n\nFor $z = xy$ with $x = t^3$ and $y = 2 - t$ at $t = 1$: $z_x = y = 1$, $z_y = x = 1$, $\\frac{dx}{dt} = 3$ and $\\frac{dy}{dt} = -1$, so $\\frac{dz}{dt} = 3 - 1 = 2$.\n\n> **Watch out.** Multiply each partial derivative by its own rate, $\\frac{dx}{dt}$ or $\\frac{dy}{dt}$, evaluated at the given $t$. Find $x$ and $y$ at that $t$ before substituting into the partial derivatives.",
        "当每个输入都依赖于一个参数时，总变化率是各个输入贡献的和：偏导数乘以该输入自身的变化率。若 $z = f(x, y)$ 可微，且 $x = g(t)$、$y = h(t)$ 为 $t$ 的可微函数，则：\n\n$$\\frac{dz}{dt} = \\frac{\\partial z}{\\partial x}\\frac{dx}{dt} + \\frac{\\partial z}{\\partial y}\\frac{dy}{dt}$$\n\n对 $z = xy$，$x = t^3$，$y = 2 - t$，在 $t = 1$ 时：$z_x = y = 1$，$z_y = x = 1$，$\\frac{dx}{dt} = 3$，$\\frac{dy}{dt} = -1$，所以 $\\frac{dz}{dt} = 3 - 1 = 2$。\n\n> **注意。** 每个偏导数都要乘以它自己的变化率 $\\frac{dx}{dt}$ 或 $\\frac{dy}{dt}$，并在给定的 $t$ 处求值。代入偏导数之前，先求出该 $t$ 处的 $x$ 和 $y$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const k = rng.int(2, 3);
        const ans = 4 * a + 2 * b * k * k;
        return numberProblem({
          prompt: t(
            `Let $z = ${poly([a, "x^2"], [b, "y^2"])}$ where $x = t^2$ and $y = ${k}t$. Find $\\left.\\frac{dz}{dt}\\right|_{t=1}$.`,
            `设 $z = ${poly([a, "x^2"], [b, "y^2"])}$，其中 $x = t^2$，$y = ${k}t$。求 $\\left.\\frac{dz}{dt}\\right|_{t=1}$ 的值。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              2 * a + 2 * b * k,
              `Each partial derivative is multiplied by its own rate: $\\frac{dx}{dt} = 2$ and $\\frac{dy}{dt} = ${k}$.`,
              `每个偏导数都要乘以它自己的变化率：$\\frac{dx}{dt} = 2$，$\\frac{dy}{dt} = ${k}$。`,
            ),
            why(
              4 * a + 2 * b * k,
              `At $t = 1$, $y = ${k}$, so $\\frac{\\partial z}{\\partial y} = ${poly([2 * b, "y"])} = ${2 * b * k}$.`,
              `在 $t = 1$ 时 $y = ${k}$，所以 $\\frac{\\partial z}{\\partial y} = ${poly([2 * b, "y"])} = ${2 * b * k}$。`,
            ),
            why(2 * a + 2 * b * k * k, "$\\frac{dx}{dt} = 2t$, which is $2$ at $t = 1$.", "$\\frac{dx}{dt} = 2t$，在 $t = 1$ 时为 $2$。"),
          ]),
          solution: walked(
            [
              [
                ["Evaluate at t = 1", "在 t = 1 处求值"],
                t(
                  `$x = 1$, $y = ${k}$, $\\frac{dx}{dt} = 2t = 2$ and $\\frac{dy}{dt} = ${k}$; $\\frac{\\partial z}{\\partial x} = ${poly([2 * a, "x"])} = ${2 * a}$ and $\\frac{\\partial z}{\\partial y} = ${poly([2 * b, "y"])} = ${2 * b * k}$.`,
                  `$x = 1$，$y = ${k}$，$\\frac{dx}{dt} = 2t = 2$，$\\frac{dy}{dt} = ${k}$；$\\frac{\\partial z}{\\partial x} = ${poly([2 * a, "x"])} = ${2 * a}$，$\\frac{\\partial z}{\\partial y} = ${poly([2 * b, "y"])} = ${2 * b * k}$。`,
                ),
              ],
              [
                ["Add the contributions", "各项贡献相加"],
                t(
                  `$\\frac{dz}{dt} = ${2 * a} \\cdot 2 + ${paren(2 * b * k)} \\cdot ${k} = ${ans}$.`,
                  `$\\frac{dz}{dt} = ${2 * a} \\cdot 2 + ${paren(2 * b * k)} \\cdot ${k} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `Substituting, $z = ${poly([a, "t^4"], [b * k * k, "t^2"])}$, whose derivative $${poly([4 * a, "t^3"], [2 * b * k * k, "t"])}$ is $${ans}$ at $t = 1$.`,
              `代入得 $z = ${poly([a, "t^4"], [b * k * k, "t^2"])}$，其导数 $${poly([4 * a, "t^3"], [2 * b * k * k, "t"])}$ 在 $t = 1$ 时为 $${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-chain-rule-with-two-parameters",
      title: t("The chain rule with two parameters", "含两个参数的链式法则"),
      explanation: t(
        "When $z = f(x, y)$ with $x$ and $y$ both functions of $s$ and $t$, the partial derivative with respect to $s$ adds one term for each path from $z$ to $s$:\n\n$$\\frac{\\partial z}{\\partial s} = \\frac{\\partial z}{\\partial x}\\frac{\\partial x}{\\partial s} + \\frac{\\partial z}{\\partial y}\\frac{\\partial y}{\\partial s}.$$\n\nEvaluate $x$ and $y$ at the given $(s, t)$ before substituting into the partial derivatives of $f$. For $z = x + y^2$ with $x = s^2$ and $y = st$ at $(s, t) = (1, 2)$: $y = 2$, so $z_s = 1 \\cdot 2s + 2y \\cdot t = 2 + 8 = 10$.\n\n> **Watch out.** Both paths count, through $x$ and through $y$. With $y = st$, $\\frac{\\partial y}{\\partial s} = t$, not $s$.",
        "当 $z = f(x, y)$ 且 $x$、$y$ 都是 $s$ 和 $t$ 的函数时，对 $s$ 的偏导数对从 $z$ 到 $s$ 的每条路径加一项：\n\n$$\\frac{\\partial z}{\\partial s} = \\frac{\\partial z}{\\partial x}\\frac{\\partial x}{\\partial s} + \\frac{\\partial z}{\\partial y}\\frac{\\partial y}{\\partial s}.$$\n\n代入 $f$ 的偏导数之前，先求出给定 $(s, t)$ 处的 $x$ 和 $y$。对 $z = x + y^2$，$x = s^2$，$y = st$，在 $(s, t) = (1, 2)$ 处：$y = 2$，所以 $z_s = 1 \\cdot 2s + 2y \\cdot t = 2 + 8 = 10$。\n\n> **注意。** 经过 $x$ 和经过 $y$ 的两条路径都要算。对 $y = st$，$\\frac{\\partial y}{\\partial s} = t$，不是 $s$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-3, 3) || 1;
        const s = rng.int(-3, 3) || 1;
        const tt = rng.int(-3, 3) || 2;
        const x = s + tt;
        const y = s * tt;
        const zx = 2 * a * x * y;
        const zy = a * x * x;
        const ans = zx + zy * tt;
        return numberProblem({
          prompt: t(
            `Let $z = ${poly([a, "x^2y"])}$ with $x = s + t$ and $y = st$. Find $\\frac{\\partial z}{\\partial s}$ at $s = ${s}$, $t = ${tt}$.`,
            `设 $z = ${poly([a, "x^2y"])}$，其中 $x = s + t$，$y = st$。求 $s = ${s}$，$t = ${tt}$ 时的 $\\frac{\\partial z}{\\partial s}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              zx + zy,
              `$\\frac{\\partial y}{\\partial s} = t = ${tt}$, so the second term is $${zy} \\cdot ${paren(tt)}$.`,
              `$\\frac{\\partial y}{\\partial s} = t = ${tt}$，所以第二项是 $${zy} \\cdot ${paren(tt)}$。`,
            ),
            why(zx, "$z$ also depends on $s$ through $y = st$; add that path.", "$z$ 还通过 $y = st$ 依赖于 $s$；要加上这条路径。"),
            why(zx + zy * s, `$\\frac{\\partial}{\\partial s}(st) = t$, not $s$.`, `$\\frac{\\partial}{\\partial s}(st) = t$，不是 $s$。`),
          ]),
          solution: walked(
            [
              [
                ["Evaluate the inner functions", "求内层函数的值"],
                t(
                  `At $(s, t) = (${s}, ${tt})$: $x = ${x}$, $y = ${y}$, $\\frac{\\partial x}{\\partial s} = 1$ and $\\frac{\\partial y}{\\partial s} = t = ${tt}$.`,
                  `在 $(s, t) = (${s}, ${tt})$ 处：$x = ${x}$，$y = ${y}$，$\\frac{\\partial x}{\\partial s} = 1$，$\\frac{\\partial y}{\\partial s} = t = ${tt}$。`,
                ),
              ],
              [
                ["Add both paths", "两条路径相加"],
                t(
                  `$\\frac{\\partial z}{\\partial x} = ${poly([2 * a, "xy"])} = ${zx}$ and $\\frac{\\partial z}{\\partial y} = ${poly([a, "x^2"])} = ${zy}$, so $\\frac{\\partial z}{\\partial s} = ${zx} \\cdot 1 + ${paren(zy)} \\cdot ${paren(tt)} = ${ans}$.`,
                  `$\\frac{\\partial z}{\\partial x} = ${poly([2 * a, "xy"])} = ${zx}$，$\\frac{\\partial z}{\\partial y} = ${poly([a, "x^2"])} = ${zy}$，所以 $\\frac{\\partial z}{\\partial s} = ${zx} \\cdot 1 + ${paren(zy)} \\cdot ${paren(tt)} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `Substituting, $z = ${a === 1 ? "" : a === -1 ? "-" : a}(s + t)^2 st$; with $t = ${tt}$ fixed, the product rule gives $${a} \\cdot \\left(2 \\cdot ${paren(x)} \\cdot ${paren(y)} + ${paren(x)}^2 \\cdot ${paren(tt)}\\right) = ${ans}$.`,
              `代入得 $z = ${a === 1 ? "" : a === -1 ? "-" : a}(s + t)^2 st$；固定 $t = ${tt}$，由乘积法则得 $${a} \\cdot \\left(2 \\cdot ${paren(x)} \\cdot ${paren(y)} + ${paren(x)}^2 \\cdot ${paren(tt)}\\right) = ${ans}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** theMultivariableChainRuleWithPolarCoordinates transforms derivatives into polar coordinates. */
export const theMultivariableChainRuleWithPolarCoordinates: TopicDef = {
  id: "the-multivariable-chain-rule-with-polar-coordinates",
  title: t("The Multivariable Chain Rule With Polar Coordinates", "极坐标下的多元链式法则"),
  summary: t(
    "In polar coordinates x = r cos θ and y = r sin θ, the radial derivative is ∂z/∂r = (∂z/∂x) cos θ + (∂z/∂y) sin θ.",
    "在极坐标 x = r cos θ 与 y = r sin θ 下，径向偏导数为 ∂z/∂r = (∂z/∂x) cos θ + (∂z/∂y) sin θ。",
  ),
  intro: t(
    "Let $z = xy$ with $x = r\\cos\\theta$ and $y = r\\sin\\theta$. At $r = 2$, $\\theta = \\frac{\\pi}{6}$ the point is $(\\sqrt{3}, 1)$, where $z_x = y = 1$ and $z_y = x = \\sqrt{3}$. So $\\frac{\\partial z}{\\partial r} = z_x\\cos\\theta + z_y\\sin\\theta = \\frac{\\sqrt{3}}{2} + \\frac{\\sqrt{3}}{2} = \\sqrt{3}$.\n\nCheck: substituting, $z = r^2\\cos\\theta\\sin\\theta$, so $\\frac{\\partial z}{\\partial r} = 2r\\cos\\theta\\sin\\theta = 4 \\cdot \\frac{\\sqrt{3}}{2} \\cdot \\frac{1}{2} = \\sqrt{3}$.\n\nIn this lesson we use the chain rule to find derivatives with respect to $r$ and $\\theta$, and to recover Cartesian partial derivatives from polar ones.",
    "设 $z = xy$，其中 $x = r\\cos\\theta$，$y = r\\sin\\theta$。在 $r = 2$，$\\theta = \\frac{\\pi}{6}$ 处，点为 $(\\sqrt{3}, 1)$，此处 $z_x = y = 1$，$z_y = x = \\sqrt{3}$。所以 $\\frac{\\partial z}{\\partial r} = z_x\\cos\\theta + z_y\\sin\\theta = \\frac{\\sqrt{3}}{2} + \\frac{\\sqrt{3}}{2} = \\sqrt{3}$。\n\n检验：代入得 $z = r^2\\cos\\theta\\sin\\theta$，所以 $\\frac{\\partial z}{\\partial r} = 2r\\cos\\theta\\sin\\theta = 4 \\cdot \\frac{\\sqrt{3}}{2} \\cdot \\frac{1}{2} = \\sqrt{3}$。\n\n本课我们用链式法则求对 $r$ 和 $\\theta$ 的导数，并由极坐标下的偏导数还原直角坐标下的偏导数。",
  ),
  prerequisites: ["the-multivariable-chain-rule"],
  encompasses: [{ topic: "the-multivariable-chain-rule", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "radial-derivatives-in-polar-coordinates",
      title: t("Radial derivatives in polar coordinates", "极坐标下的径向导数"),
      explanation: t(
        "Changing the radius moves the point in both the horizontal and vertical directions, so the chain rule adds both partial derivatives with the right weights. For $z = f(x, y)$ with $x = r\\cos\\theta$ and $y = r\\sin\\theta$, applying the chain rule yields:\n\n$$\\frac{\\partial z}{\\partial r} = \\frac{\\partial z}{\\partial x}\\frac{\\partial x}{\\partial r} + \\frac{\\partial z}{\\partial y}\\frac{\\partial y}{\\partial r} = \\frac{\\partial z}{\\partial x}\\cos\\theta + \\frac{\\partial z}{\\partial y}\\sin\\theta.$$\n\nFor $z = x + y^3$ at $r = 2$, $\\theta = \\frac{\\pi}{2}$, the point is $(0, 2)$, so $\\frac{\\partial z}{\\partial r} = 1 \\cdot 0 + 12 \\cdot 1 = 12$.\n\n> **Watch out.** $\\frac{\\partial x}{\\partial r} = \\cos\\theta$ goes with $z_x$ and $\\frac{\\partial y}{\\partial r} = \\sin\\theta$ with $z_y$; swapping them is the usual slip. After substituting $x = r\\cos\\theta$, the factor $r$ stays in the answer.",
        "改变半径会使点在水平和竖直两个方向上移动，所以链式法则要把两个偏导数按相应的权重加起来。对于 $z = f(x, y)$（其中 $x = r\\cos\\theta$，$y = r\\sin\\theta$），由链式法则可得：\n\n$$\\frac{\\partial z}{\\partial r} = \\frac{\\partial z}{\\partial x}\\frac{\\partial x}{\\partial r} + \\frac{\\partial z}{\\partial y}\\frac{\\partial y}{\\partial r} = \\frac{\\partial z}{\\partial x}\\cos\\theta + \\frac{\\partial z}{\\partial y}\\sin\\theta$$\n\n对 $z = x + y^3$，在 $r = 2$，$\\theta = \\frac{\\pi}{2}$ 处，点为 $(0, 2)$，所以 $\\frac{\\partial z}{\\partial r} = 1 \\cdot 0 + 12 \\cdot 1 = 12$。\n\n> **注意。** $\\frac{\\partial x}{\\partial r} = \\cos\\theta$ 与 $z_x$ 相乘，$\\frac{\\partial y}{\\partial r} = \\sin\\theta$ 与 $z_y$ 相乘；把两者对调是常见的失误。代入 $x = r\\cos\\theta$ 后，答案中仍保留因子 $r$。",
      ),
      generate(rng: Rng): Problem {
        const r0 = rng.int(2, 5);
        const [thetaText, c4, s4] = rng.pick([
          ["\\frac{\\pi}{6}", 3, 1],
          ["\\frac{\\pi}{4}", 2, 2],
          ["\\frac{\\pi}{3}", 1, 3],
        ] as const);
        const b = rng.nonZero(-4, 4);
        const drawn = rng.nonZero(-4, 4);
        const a = drawn * c4 + b * s4 === 0 ? drawn + 1 || 1 : drawn;
        // z = a x^2 + b y^2, so dz/dr = 2 a x cos(theta) + 2 b y sin(theta) = 2 r (a cos^2 + b sin^2) = r (a c4 + b s4) / 2.
        const ans = Q.of(r0 * (a * c4 + b * s4), 2);
        const zText = poly([a, "x^2"], [b, "y^2"]);
        const inR = Q.of(a * c4 + b * s4, 4);
        return numberProblem({
          prompt: t(
            `For $z = ${zText}$ with $x = r\\cos\\theta$ and $y = r\\sin\\theta$, find $\\left.\\frac{\\partial z}{\\partial r}\\right|_{r=${r0}, \\theta=${thetaText}}$.`,
            `设 $z = ${zText}$，其中 $x = r\\cos\\theta$ 且 $y = r\\sin\\theta$。求 $\\left.\\frac{\\partial z}{\\partial r}\\right|_{r=${r0}, \\theta=${thetaText}}$ 的值。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(r0 * (a * s4 + b * c4), 2),
              "The weights are swapped: $z_x$ is multiplied by $\\cos\\theta$ and $z_y$ by $\\sin\\theta$.",
              "权重对调了：$z_x$ 乘以 $\\cos\\theta$，$z_y$ 乘以 $\\sin\\theta$。",
            ),
            why(
              Q.of(a * c4 + b * s4, 2),
              `The factor $r = ${r0}$ is lost; after substituting $x = r\\cos\\theta$ and $y = r\\sin\\theta$ it is still there.`,
              `丢了因子 $r = ${r0}$；代入 $x = r\\cos\\theta$、$y = r\\sin\\theta$ 后它仍然存在。`,
            ),
            why(
              2 * r0 * (a + b),
              "The factors $\\cos^2\\theta$ and $\\sin^2\\theta$ are left out; each term carries one from $x$ or $y$ and one from the chain rule.",
              "漏掉了因子 $\\cos^2\\theta$ 和 $\\sin^2\\theta$；每一项都从 $x$ 或 $y$ 带来一个，从链式法则再带来一个。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Apply the polar chain rule", "应用极坐标链式法则"],
                t(
                  `$\\frac{\\partial z}{\\partial r} = z_x\\cos\\theta + z_y\\sin\\theta = ${2 * a}x\\cos\\theta + ${paren(2 * b)}y\\sin\\theta$.`,
                  `$\\frac{\\partial z}{\\partial r} = z_x\\cos\\theta + z_y\\sin\\theta = ${2 * a}x\\cos\\theta + ${paren(2 * b)}y\\sin\\theta$。`,
                ),
              ],
              [
                ["Substitute x and y", "代入 x 和 y"],
                t(
                  `This is $${2 * a}r\\cos^2\\theta + ${paren(2 * b)}r\\sin^2\\theta$. At $\\theta = ${thetaText}$, $\\cos^2\\theta = \\frac{${c4}}{4}$ and $\\sin^2\\theta = \\frac{${s4}}{4}$, and with $r = ${r0}$ the value is $${ans.toLatex()}$.`,
                  `即 $${2 * a}r\\cos^2\\theta + ${paren(2 * b)}r\\sin^2\\theta$。在 $\\theta = ${thetaText}$ 处，$\\cos^2\\theta = \\frac{${c4}}{4}$，$\\sin^2\\theta = \\frac{${s4}}{4}$，再取 $r = ${r0}$，其值为 $${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `In polar form $z = r^2\\left(${a}\\cos^2\\theta + ${paren(b)}\\sin^2\\theta\\right)$, which is $${inR.toLatex()}r^2$ at $\\theta = ${thetaText}$; its $r$-derivative $${inR.mul(Q.of(2)).toLatex()}r$ is $${ans.toLatex()}$ at $r = ${r0}$.`,
              `化成极坐标形式 $z = r^2\\left(${a}\\cos^2\\theta + ${paren(b)}\\sin^2\\theta\\right)$，在 $\\theta = ${thetaText}$ 处为 $${inR.toLatex()}r^2$；它对 $r$ 的导数 $${inR.mul(Q.of(2)).toLatex()}r$ 在 $r = ${r0}$ 时为 $${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-angular-derivative-in-polar-coordinates",
      title: t("The angular derivative in polar coordinates", "极坐标下对角度的导数"),
      explanation: t(
        "With $x = r\\cos\\theta$ and $y = r\\sin\\theta$, we have $\\frac{\\partial x}{\\partial \\theta} = -y$ and $\\frac{\\partial y}{\\partial \\theta} = x$, so the chain rule gives\n\n$$\\frac{\\partial z}{\\partial \\theta} = -y\\,z_x + x\\,z_y.$$\n\nFind the Cartesian point first, then substitute it into both partial derivatives. For $z = xy$ at $r = 3$, $\\theta = 0$, the point is $(3, 0)$, with $z_x = 0$ and $z_y = 3$, so $\\frac{\\partial z}{\\partial \\theta} = 0 + 3 \\cdot 3 = 9$.\n\n> **Watch out.** The minus sign belongs to $\\frac{\\partial x}{\\partial \\theta} = -r\\sin\\theta = -y$. And $x\\,z_x + y\\,z_y$ is $r\\frac{\\partial z}{\\partial r}$, the radial rate, not the angular one.",
        "由 $x = r\\cos\\theta$，$y = r\\sin\\theta$ 得 $\\frac{\\partial x}{\\partial \\theta} = -y$，$\\frac{\\partial y}{\\partial \\theta} = x$，所以链式法则给出\n\n$$\\frac{\\partial z}{\\partial \\theta} = -y\\,z_x + x\\,z_y.$$\n\n先求出直角坐标点，再把它代入两个偏导数。对 $z = xy$，在 $r = 3$，$\\theta = 0$ 处，点为 $(3, 0)$，$z_x = 0$，$z_y = 3$，所以 $\\frac{\\partial z}{\\partial \\theta} = 0 + 3 \\cdot 3 = 9$。\n\n> **注意。** 负号来自 $\\frac{\\partial x}{\\partial \\theta} = -r\\sin\\theta = -y$。而 $x\\,z_x + y\\,z_y$ 是 $r\\frac{\\partial z}{\\partial r}$，即径向变化率，不是角向变化率。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-3, 3) || 1;
        const b = rng.int(-3, 3);
        const d = rng.int(-4, 4);
        const e = rng.int(-4, 4) || 1;
        const k = rng.int(1, 3);
        const [sx, sy, ang] = rng.pick([
          [1, 1, "\\frac{\\pi}{4}"],
          [-1, 1, "\\frac{3\\pi}{4}"],
          [-1, -1, "\\frac{5\\pi}{4}"],
          [1, -1, "\\frac{7\\pi}{4}"],
        ] as const);
        const x = sx * k;
        const y = sy * k;
        const zx = 2 * a * x + d;
        const zy = 2 * b * y + e;
        const ans = -y * zx + x * zy;
        const r = k === 1 ? "\\sqrt{2}" : `${k}\\sqrt{2}`;
        return numberProblem({
          prompt: t(
            `Let $z = ${poly([a, "x^2"], [b, "y^2"], [d, "x"], [e, "y"])}$ with $x = r\\cos\\theta$, $y = r\\sin\\theta$. Find $\\frac{\\partial z}{\\partial \\theta}$ at $r = ${r}$, $\\theta = ${ang}$.`,
            `设 $z = ${poly([a, "x^2"], [b, "y^2"], [d, "x"], [e, "y"])}$，其中 $x = r\\cos\\theta$，$y = r\\sin\\theta$。求 $r = ${r}$，$\\theta = ${ang}$ 时的 $\\frac{\\partial z}{\\partial \\theta}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              y * zx + x * zy,
              "The minus sign is lost: $\\frac{\\partial x}{\\partial \\theta} = -r\\sin\\theta = -y$.",
              "漏掉了负号：$\\frac{\\partial x}{\\partial \\theta} = -r\\sin\\theta = -y$。",
            ),
            why(
              x * zx + y * zy,
              "That is $x\\,z_x + y\\,z_y = r\\frac{\\partial z}{\\partial r}$, the radial rate; the angular rate uses $-y$ and $x$.",
              "那是 $x\\,z_x + y\\,z_y = r\\frac{\\partial z}{\\partial r}$，即径向变化率；角向变化率用的是 $-y$ 和 $x$。",
            ),
            why(
              -x * zx + y * zy,
              "$x$ and $y$ are swapped: $z_x$ is multiplied by $-y$ and $z_y$ by $x$.",
              "$x$ 与 $y$ 对调了：$z_x$ 乘以 $-y$，$z_y$ 乘以 $x$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the point", "求出点"],
                t(
                  `$(x, y) = (${x}, ${y})$, where $z_x = ${poly([2 * a, "x"], [d, ""])} = ${zx}$ and $z_y = ${poly([2 * b, "y"], [e, ""])} = ${zy}$.`,
                  `$(x, y) = (${x}, ${y})$，此处 $z_x = ${poly([2 * a, "x"], [d, ""])} = ${zx}$，$z_y = ${poly([2 * b, "y"], [e, ""])} = ${zy}$。`,
                ),
              ],
              [
                ["Apply the chain rule", "应用链式法则"],
                t(
                  `$\\frac{\\partial z}{\\partial \\theta} = -y\\,z_x + x\\,z_y = ${-y} \\cdot ${paren(zx)} + ${paren(x)} \\cdot ${paren(zy)} = ${ans}$.`,
                  `$\\frac{\\partial z}{\\partial \\theta} = -y\\,z_x + x\\,z_y = ${-y} \\cdot ${paren(zx)} + ${paren(x)} \\cdot ${paren(zy)} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `The weights $(-y, x) = (${-y}, ${x})$ are perpendicular to $(x, y)$: $${x} \\cdot ${paren(-y)} + ${paren(y)} \\cdot ${paren(x)} = 0$, as a direction along the circle $r = ${r}$ must be.`,
              `权重 $(-y, x) = (${-y}, ${x})$ 与 $(x, y)$ 垂直：$${x} \\cdot ${paren(-y)} + ${paren(y)} \\cdot ${paren(x)} = 0$，沿圆 $r = ${r}$ 的方向正应如此。`,
            ),
          ),
        });
      },
    },
  ],
};

/** theMultivariableChainRuleInVectorForm expresses the chain rule as a gradient dot product. */
export const theMultivariableChainRuleInVectorForm: TopicDef = {
  id: "the-multivariable-chain-rule-in-vector-form",
  title: t("The Multivariable Chain Rule in Vector Form", "向量形式的多元链式法则"),
  summary: t(
    "In vector form, the rate of change of f along a space curve r(t) is d/dt[f(r(t))] = ∇f(r(t)) · r'(t).",
    "在向量形式下，函数 f 沿空间曲线 r(t) 的变化率为 d/dt[f(r(t))] = ∇f(r(t)) · r'(t)。",
  ),
  intro: t(
    "Let $f(x, y, z) = x^2 + yz$ and $\\mathbf{r}(t) = \\langle t, 2t, t^2 \\rangle$. At $t = 1$ the point is $(1, 2, 1)$, $\\nabla f = \\langle 2x, z, y \\rangle = \\langle 2, 1, 2 \\rangle$ and $\\mathbf{r}'(1) = \\langle 1, 2, 2 \\rangle$, so $\\frac{d}{dt}f(\\mathbf{r}(t)) = 2 + 2 + 4 = 8$.\n\nCheck: $f(\\mathbf{r}(t)) = t^2 + 2t^3$, whose derivative $2t + 6t^2$ is $8$ at $t = 1$.\n\nIn this lesson we write the chain rule as a dot product of the gradient with the velocity, and use it to find rates along curves.",
    "设 $f(x, y, z) = x^2 + yz$，$\\mathbf{r}(t) = \\langle t, 2t, t^2 \\rangle$。在 $t = 1$ 时点为 $(1, 2, 1)$，$\\nabla f = \\langle 2x, z, y \\rangle = \\langle 2, 1, 2 \\rangle$，$\\mathbf{r}'(1) = \\langle 1, 2, 2 \\rangle$，所以 $\\frac{d}{dt}f(\\mathbf{r}(t)) = 2 + 2 + 4 = 8$。\n\n检验：$f(\\mathbf{r}(t)) = t^2 + 2t^3$，其导数 $2t + 6t^2$ 在 $t = 1$ 时为 $8$。\n\n本课我们把链式法则写成梯度与速度的点积，并用它求沿曲线的变化率。",
  ),
  prerequisites: ["the-multivariable-chain-rule"],
  encompasses: [{ topic: "the-multivariable-chain-rule", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "gradient-dot-product-formula-for-chain-rule",
      title: t("Gradient dot product formula for the chain rule", "链式法则的梯度点积公式"),
      explanation: t(
        "Along a curve, the rate of change of the function is the gradient dotted with the velocity of the curve, combining all the partial derivative terms at once. If $w = f(\\mathbf{r}(t))$ where $\\mathbf{r}(t) = \\langle x(t), y(t), z(t) \\rangle$, then the chain rule compactly reads:\n\n$$\\frac{dw}{dt} = \\nabla f(\\mathbf{r}(t)) \\cdot \\mathbf{r}'(t).$$\n\nWith $\\nabla f = \\langle 2, -1, 5 \\rangle$ and $\\mathbf{r}' = \\langle 4, 6, 1 \\rangle$, the rate is $8 - 6 + 5 = 7$.\n\n> **Watch out.** Multiply matching components and add all three products, keeping the sign of each; a negative product lowers the rate.",
        "沿一条曲线，函数的变化率等于梯度与曲线速度的点积，一次就合并了所有偏导数项。若 $w = f(\\mathbf{r}(t))$，其中 $\\mathbf{r}(t) = \\langle x(t), y(t), z(t) \\rangle$，则链式法则简洁地表示为：\n\n$$\\frac{dw}{dt} = \\nabla f(\\mathbf{r}(t)) \\cdot \\mathbf{r}'(t)$$\n\n若 $\\nabla f = \\langle 2, -1, 5 \\rangle$，$\\mathbf{r}' = \\langle 4, 6, 1 \\rangle$，变化率为 $8 - 6 + 5 = 7$。\n\n> **注意。** 对应分量相乘，三个乘积全部相加，并保留各自的符号；负的乘积会使变化率变小。",
      ),
      generate(rng: Rng): Problem {
        const grad: Vec3 = [rng.nonZero(-3, 3), rng.nonZero(-3, 3), rng.nonZero(-3, 3)];
        const vel: Vec3 = [rng.nonZero(-3, 3), rng.nonZero(-3, 3), rng.nonZero(-3, 3)];
        const t0 = rng.int(1, 4);
        const products = [grad[0] * vel[0], grad[1] * vel[1], grad[2] * vel[2]] as const;
        const ans = products[0] + products[1] + products[2];
        const sign = ans > 0 ? t("increasing", "增大") : ans < 0 ? t("decreasing", "减小") : t("momentarily constant", "瞬时不变");
        return numberProblem({
          prompt: t(
            `Suppose a particle moves along a curve $\\mathbf{r}(t)$ such that at $t = ${t0}$, $\\mathbf{r}'(${t0}) = ${v3L(vel)}$ and $\\nabla f(\\mathbf{r}(${t0})) = ${v3L(grad)}$. Find $\\left.\\frac{d}{dt}\\left[f(\\mathbf{r}(t))\\right]\\right|_{t=${t0}}$.`,
            `设质点沿曲线 $\\mathbf{r}(t)$ 运动，已知在 $t = ${t0}$ 时，$\\mathbf{r}'(${t0}) = ${v3L(vel)}$ 且 $\\nabla f(\\mathbf{r}(${t0})) = ${v3L(grad)}$。求 $\\left.\\frac{d}{dt}\\left[f(\\mathbf{r}(t))\\right]\\right|_{t=${t0}}$ 的值。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              products[0] + products[1],
              "The $z$-components are left out; the dot product adds all three products.",
              "漏掉了 $z$ 分量；点积要把三个乘积全部相加。",
            ),
            why(
              Math.abs(products[0]) + Math.abs(products[1]) + Math.abs(products[2]),
              "The signs are dropped; a negative product must be subtracted.",
              "丢了符号；负的乘积要减去。",
            ),
            why(
              products[0],
              "Only the $x$-components are used; the curve also moves in $y$ and $z$.",
              "只用了 $x$ 分量；曲线在 $y$ 和 $z$ 方向上也在移动。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Write the vector chain rule", "写出向量链式法则"],
                t(
                  "$\\frac{d}{dt} f(\\mathbf{r}(t)) = \\nabla f(\\mathbf{r}(t)) \\cdot \\mathbf{r}'(t)$.",
                  "$\\frac{d}{dt} f(\\mathbf{r}(t)) = \\nabla f(\\mathbf{r}(t)) \\cdot \\mathbf{r}'(t)$。",
                ),
              ],
              [
                ["Take the dot product", "求点积"],
                t(
                  `$${grad[0]} \\cdot ${paren(vel[0])} + ${paren(grad[1])} \\cdot ${paren(vel[1])} + ${paren(grad[2])} \\cdot ${paren(vel[2])} = ${products[0]} + ${paren(products[1])} + ${paren(products[2])} = ${ans}$.`,
                  `$${grad[0]} \\cdot ${paren(vel[0])} + ${paren(grad[1])} \\cdot ${paren(vel[1])} + ${paren(grad[2])} \\cdot ${paren(vel[2])} = ${products[0]} + ${paren(products[1])} + ${paren(products[2])} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `Adding the products in another order, $${products[2]} + ${paren(products[1])} + ${paren(products[0])} = ${ans}$; so $f$ is ${sign.en} along the curve at $t = ${t0}$.`,
              `换一个顺序相加，$${products[2]} + ${paren(products[1])} + ${paren(products[0])} = ${ans}$；所以在 $t = ${t0}$ 时 $f$ 沿曲线${sign["zh-CN"]}。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-rate-of-change-along-a-space-curve",
      title: t("The rate of change along a space curve", "沿空间曲线的变化率"),
      explanation: t(
        "In vector form the chain rule reads\n\n$$\\frac{d}{dt} f(\\mathbf{r}(t)) = \\nabla f(\\mathbf{r}(t)) \\cdot \\mathbf{r}'(t).$$\n\nEvaluate the curve at the given $t$ to find the point, compute the gradient there, and take its dot product with the velocity $\\mathbf{r}'(t)$. For $f = xz + y$ and $\\mathbf{r}(t) = \\langle t, t^2, t^3 \\rangle$ at $t = 1$: the point is $(1, 1, 1)$, $\\nabla f = \\langle z, 1, x \\rangle = \\langle 1, 1, 1 \\rangle$ and $\\mathbf{r}' = \\langle 1, 2, 3 \\rangle$, so the rate is $6$.\n\n> **Watch out.** The gradient is evaluated at the point $\\mathbf{r}(t)$, not at $t$ itself. Differentiate every component of $\\mathbf{r}$, including signs such as $\\frac{d}{dt}\\frac{1}{t} = -\\frac{1}{t^2}$.",
        "链式法则的向量形式为\n\n$$\\frac{d}{dt} f(\\mathbf{r}(t)) = \\nabla f(\\mathbf{r}(t)) \\cdot \\mathbf{r}'(t).$$\n\n先在给定的 $t$ 处求出曲线上的点，再计算该点的梯度，最后与速度 $\\mathbf{r}'(t)$ 作点积。对 $f = xz + y$，$\\mathbf{r}(t) = \\langle t, t^2, t^3 \\rangle$，在 $t = 1$ 时：点为 $(1, 1, 1)$，$\\nabla f = \\langle z, 1, x \\rangle = \\langle 1, 1, 1 \\rangle$，$\\mathbf{r}' = \\langle 1, 2, 3 \\rangle$，所以变化率为 $6$。\n\n> **注意。** 梯度在点 $\\mathbf{r}(t)$ 处求值，而不是在 $t$ 处。$\\mathbf{r}$ 的每个分量都要求导，包括 $\\frac{d}{dt}\\frac{1}{t} = -\\frac{1}{t^2}$ 这样的符号。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-3, 3) || 1;
        const b = rng.int(-4, 4) || 2;
        const p = rng.int(1, 3) * rng.pick([-1, 1]);
        const ans = Q.of(3 * a * p * p).sub(Q.of(2 * b, p ** 3));
        const pt = [Q.of(p), Q.of(p * p), Q.of(1, p)];
        const grad = [Q.of(a * p * p), Q.of(a * p), Q.of(2 * b, p)];
        const vel = [Q.of(1), Q.of(2 * p), Q.of(-1, p * p)];
        return numberProblem({
          prompt: t(
            `Let $f(x, y, z) = ${poly([a, "xy"], [b, "z^2"])}$ and $\\mathbf{r}(t) = \\left(t, t^2, \\frac{1}{t}\\right)$. Find $\\frac{d}{dt} f(\\mathbf{r}(t))$ at $t = ${p}$.`,
            `设 $f(x, y, z) = ${poly([a, "xy"], [b, "z^2"])}$，$\\mathbf{r}(t) = \\left(t, t^2, \\frac{1}{t}\\right)$。求 $t = ${p}$ 时的 $\\frac{d}{dt} f(\\mathbf{r}(t))$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(3 * a * p * p).add(Q.of(2 * b, p ** 3)),
              "The sign of $\\frac{d}{dt}\\frac{1}{t} = -\\frac{1}{t^2}$ is lost.",
              "漏掉了 $\\frac{d}{dt}\\frac{1}{t} = -\\frac{1}{t^2}$ 的负号。",
            ),
            why(
              Q.of(2 * a * p * p).sub(Q.of(2 * b, p ** 3)),
              "The $x$ term $f_x \\cdot 1$ is left out of the dot product.",
              "点积中漏掉了 $x$ 项 $f_x \\cdot 1$。",
            ),
            why(
              Q.of(3 * a * p * p),
              "The $z$ term is left out; $f$ depends on $z = \\frac{1}{t}$ too.",
              "漏掉了 $z$ 项；$f$ 也依赖于 $z = \\frac{1}{t}$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the point and velocity", "求点和速度"],
                t(
                  `$\\mathbf{r}(${p}) = ${v3L(pt)}$ and $\\mathbf{r}'(t) = \\left\\langle 1, 2t, -\\frac{1}{t^2} \\right\\rangle = ${v3L(vel)}$.`,
                  `$\\mathbf{r}(${p}) = ${v3L(pt)}$，$\\mathbf{r}'(t) = \\left\\langle 1, 2t, -\\frac{1}{t^2} \\right\\rangle = ${v3L(vel)}$。`,
                ),
              ],
              [
                ["Evaluate the gradient", "求梯度"],
                t(
                  `$\\nabla f = \\langle ${poly([a, "y"])}, ${poly([a, "x"])}, ${poly([2 * b, "z"])} \\rangle = ${v3L(grad)}$ there.`,
                  `该点处 $\\nabla f = \\langle ${poly([a, "y"])}, ${poly([a, "x"])}, ${poly([2 * b, "z"])} \\rangle = ${v3L(grad)}$。`,
                ),
              ],
              [
                ["Take the dot product", "求点积"],
                t(
                  `$${grad[0]!.toLatex()} \\cdot 1 + ${paren(grad[1]!)} \\cdot ${paren(vel[1]!)} + ${paren(grad[2]!)} \\cdot ${paren(vel[2]!)} = ${ans.toLatex()}$.`,
                  `$${grad[0]!.toLatex()} \\cdot 1 + ${paren(grad[1]!)} \\cdot ${paren(vel[1]!)} + ${paren(grad[2]!)} \\cdot ${paren(vel[2]!)} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `Substituting first, $f(\\mathbf{r}(t)) = ${poly([a, "t^3"])} + ${paren(b)}t^{-2}$, whose derivative $${poly([3 * a, "t^2"])} - ${paren(2 * b)}t^{-3}$ is $${ans.toLatex()}$ at $t = ${p}$.`,
              `先代入，$f(\\mathbf{r}(t)) = ${poly([a, "t^3"])} + ${paren(b)}t^{-2}$，其导数 $${poly([3 * a, "t^2"])} - ${paren(2 * b)}t^{-3}$ 在 $t = ${p}$ 时为 $${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** differentials calculates the total differential dz = fx dx + fy dy. */
export const differentials: TopicDef = {
  id: "differentials",
  title: t("Differentials", "全微分"),
  summary: t(
    "The total differential dz = fx dx + fy dy approximates the change Δz in a function for small increments dx and dy.",
    "全微分 dz = fx dx + fy dy 在自变量有微小增量 dx 与 dy 时近似表示函数值的增量 Δz。",
  ),
  intro: t(
    "Let $z = xy^2$ at $(3, 1)$, with $dx = 0.1$ and $dy = -0.2$. There $z_x = y^2 = 1$ and $z_y = 2xy = 6$, so $dz = 1 \\cdot 0.1 + 6 \\cdot (-0.2) = -1.1$.\n\nCheck: the exact change is $3.1 \\cdot 0.8^2 - 3 = 1.984 - 3 = -1.016$, close to $dz$ for steps this small.\n\nIn this lesson we estimate changes with the total differential and use it to bound errors in measured quantities.",
    "设 $z = xy^2$，在点 $(3, 1)$ 处取 $dx = 0.1$，$dy = -0.2$。此处 $z_x = y^2 = 1$，$z_y = 2xy = 6$，所以 $dz = 1 \\cdot 0.1 + 6 \\cdot (-0.2) = -1.1$。\n\n检验：精确的变化量是 $3.1 \\cdot 0.8^2 - 3 = 1.984 - 3 = -1.016$，对这么小的步长与 $dz$ 很接近。\n\n本课我们用全微分估计变化量，并用它估计测量量的误差。",
  ),
  prerequisites: ["the-multivariable-chain-rule"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "approximating-changes-using-differentials",
      title: t("Approximating changes using differentials", "利用全微分估计变化量"),
      explanation: t(
        "For small changes in the inputs, the change in the output is approximately each partial derivative times the change in its input, all added together. For a differentiable function $z = f(x, y)$, the **total differential** is:\n\n$$dz = \\frac{\\partial z}{\\partial x}\\,dx + \\frac{\\partial z}{\\partial y}\\,dy.$$ For small increments $\\Delta x$ and $\\Delta y$, $\\Delta z \\approx dz$. For $z = x^3 - y$ at $(1, 2)$ with $dx = 0.1$ and $dy = 0.5$, $dz = 3 \\cdot 0.1 - 1 \\cdot 0.5 = -0.2$.\n\n> **Watch out.** Evaluate the partial derivatives at the starting point and multiply by the increments $dx$ and $dy$, not by the new coordinates.",
        "当输入的变化很小时，输出的变化近似等于每个偏导数乘以相应输入的变化，再全部加起来。对于可微函数 $z = f(x, y)$，其**全微分**为：\n\n$$dz = \\frac{\\partial z}{\\partial x}\\,dx + \\frac{\\partial z}{\\partial y}\\,dy$$ 当增量 $\\Delta x$ 与 $\\Delta y$ 较小时，$\\Delta z \\approx dz$。对 $z = x^3 - y$，在 $(1, 2)$ 处取 $dx = 0.1$，$dy = 0.5$，$dz = 3 \\cdot 0.1 - 1 \\cdot 0.5 = -0.2$。\n\n> **注意。** 偏导数在起点处求值，再乘以增量 $dx$ 和 $dy$，而不是乘以新的坐标。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-4, 4);
        const b = rng.nonZero(-4, 4);
        const x0 = rng.int(1, 4);
        const y0 = rng.int(1, 4);
        const dx = rng.nonZero(-2, 2);
        const dy = rng.nonZero(-2, 2);
        const fx = 2 * a * x0;
        const fy = 2 * b * y0;
        const ans = fx * dx + fy * dy;
        const exact = a * ((x0 + dx) ** 2 - x0 * x0) + b * ((y0 + dy) ** 2 - y0 * y0);
        return numberProblem({
          prompt: t(
            `Calculate the total differential $dz$ for $z = ${poly([a, "x^2"], [b, "y^2"])}$ at the point $(${x0}, ${y0})$ when $dx = ${dx}$ and $dy = ${dy}$.`,
            `计算函数 $z = ${poly([a, "x^2"], [b, "y^2"])}$ 在点 $(${x0}, ${y0})$ 处当 $dx = ${dx}$ 与 $dy = ${dy}$ 时的全微分 $dz$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              fx + fy,
              "The partial derivatives are added without multiplying by $dx$ and $dy$.",
              "偏导数直接相加，没有乘以 $dx$ 和 $dy$。",
            ),
            why(
              fx * (x0 + dx) + fy * (y0 + dy),
              "The partial derivatives are multiplied by the new coordinates; the differential uses the increments $dx$ and $dy$.",
              "偏导数乘以了新的坐标；全微分用的是增量 $dx$ 和 $dy$。",
            ),
            why(fx * dx, "The $y$ term $f_y\\,dy$ is left out.", "漏掉了 $y$ 项 $f_y\\,dy$。"),
          ]),
          solution: walked(
            [
              [
                ["Evaluate the partial derivatives", "求偏导数的值"],
                t(
                  `$f_x = ${poly([2 * a, "x"])} = ${fx}$ and $f_y = ${poly([2 * b, "y"])} = ${fy}$ at $(${x0}, ${y0})$.`,
                  `在 $(${x0}, ${y0})$ 处，$f_x = ${poly([2 * a, "x"])} = ${fx}$，$f_y = ${poly([2 * b, "y"])} = ${fy}$。`,
                ),
              ],
              [
                ["Apply the total differential", "应用全微分公式"],
                t(
                  `$dz = f_x\\,dx + f_y\\,dy = ${fx} \\cdot ${paren(dx)} + ${paren(fy)} \\cdot ${paren(dy)} = ${ans}$.`,
                  `$dz = f_x\\,dx + f_y\\,dy = ${fx} \\cdot ${paren(dx)} + ${paren(fy)} \\cdot ${paren(dy)} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `The exact change is $z(${x0 + dx}, ${y0 + dy}) - z(${x0}, ${y0}) = ${exact}$; it differs from $dz$ by $${a}(dx)^2 + ${paren(b)}(dy)^2 = ${exact - ans}$, the part the differential leaves out.`,
              `精确的变化量是 $z(${x0 + dx}, ${y0 + dy}) - z(${x0}, ${y0}) = ${exact}$；它与 $dz$ 相差 $${a}(dx)^2 + ${paren(b)}(dy)^2 = ${exact - ans}$，正是全微分略去的部分。`,
            ),
          ),
        });
      },
    },
    {
      id: "estimating-percentage-error-with-differentials",
      title: t("Estimating percentage error with differentials", "用全微分估计百分比误差"),
      explanation: t(
        "For a product of powers such as $V = \\pi r^2 h$, divide the differential by $V$:\n\n$$\\frac{dV}{V} = 2\\frac{dr}{r} + \\frac{dh}{h}.$$\n\nSo relative errors add, each multiplied by its exponent. If $r$ is measured within $p\\%$ and $h$ within $q\\%$, the largest error in $V$ is about $(2p + q)\\%$; constant factors such as $\\pi$ or $\\frac{1}{3}$ do not change it. For $w = xy^3$ with $x$ within $1\\%$ and $y$ within $2\\%$, the error in $w$ is at most about $1 + 3 \\cdot 2 = 7\\%$.\n\n> **Watch out.** Each relative error is multiplied by its own exponent, then the results are added; percentages are never multiplied together.",
        "对于幂的乘积，如 $V = \\pi r^2 h$，把全微分除以 $V$：\n\n$$\\frac{dV}{V} = 2\\frac{dr}{r} + \\frac{dh}{h}.$$\n\n所以相对误差相加，并各乘以其指数。若 $r$ 的测量误差不超过 $p\\%$，$h$ 不超过 $q\\%$，则 $V$ 的最大误差约为 $(2p + q)\\%$；像 $\\pi$ 或 $\\frac{1}{3}$ 这样的常数因子不改变它。对 $w = xy^3$，若 $x$ 误差不超过 $1\\%$，$y$ 不超过 $2\\%$，则 $w$ 的误差约不超过 $1 + 3 \\cdot 2 = 7\\%$。\n\n> **注意。** 每个相对误差乘以它自己的指数，然后相加；百分比之间从不相乘。",
      ),
      generate(rng: Rng): Problem {
        const p = rng.int(1, 6);
        const q = rng.int(1, 6);
        const cone = rng.int(0, 1) === 1;
        const shape = cone ? t("cone", "圆锥") : t("cylinder", "圆柱");
        const V = cone ? "V = \\frac{1}{3}\\pi r^2 h" : "V = \\pi r^2 h";
        const ans = 2 * p + q;
        const exact = Q.of((100 + p) ** 2 * (100 + q), 10000).sub(Q.of(100));
        return numberProblem({
          prompt: t(
            `The radius of a ${shape.en} is measured with error at most $${p}\\%$ and its height with error at most $${q}\\%$. Use differentials to estimate the largest percentage error in its volume $${V}$.`,
            `测量一个${shape["zh-CN"]}的半径误差不超过 $${p}\\%$，高的误差不超过 $${q}\\%$。用全微分估计其体积 $${V}$ 的最大百分比误差。`,
          ),
          answer: ans,
          percent: true,
          mistakes: distinct(ans, [
            why(p + q, "The exponent $2$ on $r$ is ignored; the radius error counts twice.", "忽略了 $r$ 的指数 $2$；半径的误差要算两次。"),
            why(
              p + 2 * q,
              "The factor $2$ belongs to the radius, which is squared, not to the height.",
              "因子 $2$ 属于被平方的半径，而不是高。",
            ),
            why(
              2 * p * q,
              "The percentages are multiplied; relative errors add, each times its exponent.",
              "把百分比相乘了；相对误差应相加，各乘以其指数。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Take relative differentials", "求相对微分"],
                t(
                  "$\\frac{dV}{V} = 2\\frac{dr}{r} + \\frac{dh}{h}$; the constant factor drops out.",
                  "$\\frac{dV}{V} = 2\\frac{dr}{r} + \\frac{dh}{h}$；常数因子被约去。",
                ),
              ],
              [
                ["Add the worst cases", "加上最坏情形"],
                t(
                  `The error is at most $2 \\cdot ${p}\\% + ${q}\\% = ${ans}\\%$.`,
                  `误差不超过 $2 \\cdot ${p}\\% + ${q}\\% = ${ans}\\%$。`,
                ),
              ],
            ],
            t(
              `Raising $r$ by $${p}\\%$ and $h$ by $${q}\\%$ exactly multiplies $V$ by $${((100 + p) / 100).toFixed(2)}^2 \\cdot ${((100 + q) / 100).toFixed(2)}$, an increase of $${exact.toNumber().toFixed(2)}\\%$, close to $${ans}\\%$.`,
              `把 $r$ 精确增大 $${p}\\%$、$h$ 增大 $${q}\\%$，$V$ 乘以 $${((100 + p) / 100).toFixed(2)}^2 \\cdot ${((100 + q) / 100).toFixed(2)}$，增加了 $${exact.toNumber().toFixed(2)}\\%$，与 $${ans}\\%$ 很接近。`,
            ),
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 2.10 Plane Transformations
// ---------------------------------------------------------------------------

/** affineTransformations maps points under affine transformations. */
export const affineTransformations: TopicDef = {
  id: "affine-transformations",
  title: t("Affine Transformations", "仿射变换"),
  summary: t(
    "An affine transformation T(x) = Ax + b consists of a linear map followed by a translation.",
    "仿射变换 T(x) = Ax + b 由线性映射复合平移变换构成。",
  ),
  intro: t(
    "Let $T(x, y) = (2x - y + 3, x + 4y - 1)$. At $(1, 2)$: $T(1, 2) = (2 - 2 + 3, 1 + 8 - 1) = (3, 8)$.\n\nCheck: $T(0, 0) = (3, -1)$ is the shift, and $T(1, 2) - T(0, 0) = (0, 9)$ equals the matrix part $(2 \\cdot 1 - 2, 1 + 4 \\cdot 2)$.\n\nIn this lesson we evaluate affine transformations, find their fixed points, and see that the order of two of them matters.",
    "设 $T(x, y) = (2x - y + 3, x + 4y - 1)$。在 $(1, 2)$ 处：$T(1, 2) = (2 - 2 + 3, 1 + 8 - 1) = (3, 8)$。\n\n检验：$T(0, 0) = (3, -1)$ 就是平移量，而 $T(1, 2) - T(0, 0) = (0, 9)$ 等于矩阵部分 $(2 \\cdot 1 - 2, 1 + 4 \\cdot 2)$。\n\n本课我们计算仿射变换的像，求它们的不动点，并看到两个仿射变换的先后次序是有影响的。",
  ),
  prerequisites: ["introduction-to-linear-transformations", "the-parametric-equations-of-a-plane"],
  encompasses: [{ topic: "introduction-to-linear-transformations", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-affine-transformations-on-points",
      figure: multivariableDrawings3["affine-transformations#evaluating-affine-transformations-on-points"],
      title: t("Evaluating affine transformations on points", "计算点在仿射变换下的像"),
      explanation: t(
        "An affine transformation multiplies by a matrix and then adds a fixed vector, so it can stretch, rotate and shift the plane all at once. An affine transformation $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ is represented as:\n\n$$T(x, y) = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} + \\begin{pmatrix} e \\\\ f \\end{pmatrix} = (ax + by + e, cx + dy + f).$$\n\nFor $T(x, y) = (x + 5y - 2, 4x - y + 6)$, $T(2, -1) = (2 - 5 - 2, 8 + 1 + 6) = (-5, 15)$.\n\n> **Watch out.** The first row of the matrix gives the first coordinate; the shift is added after multiplying, to every point.",
        "仿射变换先乘以一个矩阵再加上一个固定向量，所以可以同时伸缩、旋转和平移平面。仿射变换 $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ 表示为：\n\n$$T(x, y) = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} + \\begin{pmatrix} e \\\\ f \\end{pmatrix} = (ax + by + e, cx + dy + f)$$\n\n对 $T(x, y) = (x + 5y - 2, 4x - y + 6)$，$T(2, -1) = (2 - 5 - 2, 8 + 1 + 6) = (-5, 15)$。\n\n> **注意。** 矩阵的第一行给出第一个坐标；平移量在乘法之后加上，而且对每个点都要加。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.int(-3, 3);
        const cCoeff = rng.int(-3, 3);
        const d = rng.nonZero(-3, 3);
        const e = rng.int(-4, 4);
        const f = rng.int(-4, 4);
        const x0 = rng.int(-3, 3);
        const y0 = rng.int(-3, 3);
        const u = a * x0 + b * y0 + e;
        const v = cCoeff * x0 + d * y0 + f;
        return pointWith(
          {
            prompt: t(
              `Find the image $T(${x0}, ${y0})$ under the affine transformation $T(x, y) = (${poly([a, "x"], [b, "y"], [e, ""])}, ${poly([cCoeff, "x"], [d, "y"], [f, ""])})$. Express your answer as a point $(u, v)$.`,
              `求点 $(${x0}, ${y0})$ 在仿射变换 $T(x, y) = (${poly([a, "x"], [b, "y"], [e, ""])}, ${poly([cCoeff, "x"], [d, "y"], [f, ""])})$ 下的像 $T(${x0}, ${y0})$。结果以点 $(u, v)$ 表示。`,
            ),
            answer: [u, v],
            vars: ["u", "v"],
            solution: walked(
              [
                [
                  ["First coordinate", "第一个坐标"],
                  t(
                    `$u = ${a} \\cdot ${paren(x0)} + ${paren(b)} \\cdot ${paren(y0)} + ${paren(e)} = ${u}$.`,
                    `$u = ${a} \\cdot ${paren(x0)} + ${paren(b)} \\cdot ${paren(y0)} + ${paren(e)} = ${u}$。`,
                  ),
                ],
                [
                  ["Second coordinate", "第二个坐标"],
                  t(
                    `$v = ${cCoeff} \\cdot ${paren(x0)} + ${paren(d)} \\cdot ${paren(y0)} + ${paren(f)} = ${v}$, so the image is $(${u}, ${v})$.`,
                    `$v = ${cCoeff} \\cdot ${paren(x0)} + ${paren(d)} \\cdot ${paren(y0)} + ${paren(f)} = ${v}$，所以像为 $(${u}, ${v})$。`,
                  ),
                ],
              ],
              t(
                `$T(0, 0) = (${e}, ${f})$ is the shift, and $(${u}, ${v}) - (${e}, ${f}) = (${u - e}, ${v - f})$ is the matrix times $(${x0}, ${y0})$.`,
                `$T(0, 0) = (${e}, ${f})$ 是平移量，而 $(${u}, ${v}) - (${e}, ${f}) = (${u - e}, ${v - f})$ 正是矩阵乘以 $(${x0}, ${y0})$。`,
              ),
            ),
          },
          [
            [[v, u], "The coordinates are swapped; the first formula gives $u$.", "两个坐标对调了；第一个公式给出 $u$。"],
            [[u - e, v - f], "The shift is left out; add it after multiplying.", "漏掉了平移量；乘法之后要把它加上。"],
            [
              [a * x0 + cCoeff * y0 + e, b * x0 + d * y0 + f],
              "The columns of the matrix are used as its rows; $u$ takes the coefficients of the first formula.",
              "把矩阵的列当成了行；$u$ 用的是第一个公式的系数。",
            ],
          ],
        );
      },
    },
    {
      id: "the-fixed-point-of-an-affine-transformation",
      title: t("The fixed point of an affine transformation", "仿射变换的不动点"),
      explanation: t(
        "A fixed point of $T(\\mathbf{x}) = A\\mathbf{x} + \\mathbf{b}$ is a point with $T(\\mathbf{x}) = \\mathbf{x}$. Rearranging gives the linear system\n\n$$(I - A)\\mathbf{x} = \\mathbf{b},$$\n\nwhich has exactly one solution when $\\det(I - A) \\ne 0$. Write out the two equations coordinate by coordinate and solve them. For $T(x, y) = (3x - 2, 2y + 5)$, $x = 3x - 2$ gives $x = 1$ and $y = 2y + 5$ gives $y = -5$, so the fixed point is $(1, -5)$.\n\n> **Watch out.** Move every $x$ and $y$ to one side before solving, keeping signs; the shift $\\mathbf{b}$ is not itself the fixed point.",
        "$T(\\mathbf{x}) = A\\mathbf{x} + \\mathbf{b}$ 的不动点是满足 $T(\\mathbf{x}) = \\mathbf{x}$ 的点。移项得线性方程组\n\n$$(I - A)\\mathbf{x} = \\mathbf{b},$$\n\n当 $\\det(I - A) \\ne 0$ 时它恰有一个解。按坐标写出两个方程并求解。对 $T(x, y) = (3x - 2, 2y + 5)$，由 $x = 3x - 2$ 得 $x = 1$，由 $y = 2y + 5$ 得 $y = -5$，所以不动点是 $(1, -5)$。\n\n> **注意。** 求解前把所有含 $x$、$y$ 的项移到一边，注意符号；平移量 $\\mathbf{b}$ 本身不是不动点。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(1, 2) * rng.pick([-1, 1]);
        const j = rng.int(-2, 2) || 1;
        const M = [1 + k * j, k, j, 1];
        if (rng.int(0, 1) === 1) [M[0], M[3]] = [M[3]!, M[0]!];
        const [m11, m12, m21, m22] = M as [number, number, number, number];
        const X = rng.int(-4, 4);
        const Y = rng.int(-4, 4);
        const b1 = m11 * X + m12 * Y;
        const b2 = m21 * X + m22 * Y;
        const first = poly([1 - m11, "x"], [-m12, "y"], [b1, ""]) || "0";
        const second = poly([-m21, "x"], [1 - m22, "y"], [b2, ""]) || "0";
        const T = `\\left(${first}, ${second}\\right)`;
        return pointWith(
          {
            prompt: t(`Find the fixed point of $T(x, y) = ${T}$.`, `求 $T(x, y) = ${T}$ 的不动点。`),
            answer: [X, Y],
            vars: ["x", "y"],
            solution: walked(
              [
                [
                  ["Set T(x, y) equal to (x, y)", "令 T(x, y) = (x, y)"],
                  t(
                    `$x = ${first}$ and $y = ${second}$, which rearrange to $${poly([m11, "x"], [m12, "y"])} = ${b1}$ and $${poly([m21, "x"], [m22, "y"])} = ${b2}$.`,
                    `$x = ${first}$，$y = ${second}$，移项得 $${poly([m11, "x"], [m12, "y"])} = ${b1}$，$${poly([m21, "x"], [m22, "y"])} = ${b2}$。`,
                  ),
                ],
                [
                  ["Solve the system", "解方程组"],
                  t(
                    `The determinant is $${m11} \\cdot ${paren(m22)} - ${paren(m12)} \\cdot ${paren(m21)} = 1$, so $x = ${b1} \\cdot ${paren(m22)} - ${paren(m12)} \\cdot ${paren(b2)} = ${X}$ and $y = ${m11} \\cdot ${paren(b2)} - ${paren(m21)} \\cdot ${paren(b1)} = ${Y}$.`,
                    `行列式为 $${m11} \\cdot ${paren(m22)} - ${paren(m12)} \\cdot ${paren(m21)} = 1$，所以 $x = ${b1} \\cdot ${paren(m22)} - ${paren(m12)} \\cdot ${paren(b2)} = ${X}$，$y = ${m11} \\cdot ${paren(b2)} - ${paren(m21)} \\cdot ${paren(b1)} = ${Y}$。`,
                  ),
                ],
              ],
              t(
                `$T(${X}, ${Y}) = (${X}, ${Y})$: substituting into both formulas gives the point back.`,
                `$T(${X}, ${Y}) = (${X}, ${Y})$：代入两个公式都得回该点。`,
              ),
            ),
          },
          [
            [
              [-X, -Y],
              "The signs are reversed, as if solving $(A - I)\\mathbf{x} = \\mathbf{b}$.",
              "符号反了，相当于解 $(A - I)\\mathbf{x} = \\mathbf{b}$。",
            ],
            [[Y, X], "The coordinates are swapped.", "两个坐标对调了。"],
            [
              [b1, b2],
              "That is the shift $\\mathbf{b} = T(0, 0)$, not a point that $T$ leaves fixed.",
              "那是平移量 $\\mathbf{b} = T(0, 0)$，不是 $T$ 保持不动的点。",
            ],
          ],
        );
      },
    },
  ],
};

/** theImageOfAnAffineTransformation computes area distortion Area(T(S)) = |det A| Area(S). */
export const theImageOfAnAffineTransformation: TopicDef = {
  id: "the-image-of-an-affine-transformation",
  title: t("The Image of an Affine Transformation", "仿射变换下的像与面积"),
  summary: t(
    "An affine transformation T(x) = Ax + b scales areas by a factor of |det A|: Area(T(S)) = |det A| Area(S).",
    "仿射变换 T(x) = Ax + b 将区域的面积缩放 |det A| 倍：Area(T(S)) = |det A| Area(S)。",
  ),
  intro: t(
    "Let $T(x, y) = (3x + y + 4, x + 2y)$. Its matrix has determinant $3 \\cdot 2 - 1 \\cdot 1 = 5$, so $T$ maps the unit square, of area $1$, to a parallelogram of area $5$.\n\nCheck: the image vertices are $(4, 0)$, $(7, 1)$, $(8, 3)$ and $(5, 2)$; the shoelace formula gives $\\frac{1}{2}|4 + 13 + 1 - 8| = 5$.\n\nIn this lesson we find areas of images under affine maps and the points they send to given targets.",
    "设 $T(x, y) = (3x + y + 4, x + 2y)$。其矩阵的行列式为 $3 \\cdot 2 - 1 \\cdot 1 = 5$，所以 $T$ 把面积为 $1$ 的单位正方形映成面积为 $5$ 的平行四边形。\n\n检验：像的顶点是 $(4, 0)$、$(7, 1)$、$(8, 3)$、$(5, 2)$；鞋带公式给出 $\\frac{1}{2}|4 + 13 + 1 - 8| = 5$。\n\n本课我们求仿射映射下像的面积，以及被映到给定目标的点。",
  ),
  prerequisites: ["affine-transformations"],
  encompasses: [{ topic: "affine-transformations", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "area-scaling-by-affine-maps",
      title: t("Area scaling by affine maps", "仿射映射的面积缩放因子"),
      explanation: t(
        "The shift does not change areas, while the matrix multiplies every area by the absolute value of its determinant. For an affine transformation $T(\\mathbf{x}) = A\\mathbf{x} + \\mathbf{b}$ in $\\mathbb{R}^2$, the area of the image $T(S)$ of a region $S$ is:\n\n$$\\operatorname{Area}(T(S)) = |\\det(A)| \\cdot \\operatorname{Area}(S).$$\n\nFor $A = \\begin{pmatrix} 2 & 5 \\\\ 1 & 4 \\end{pmatrix}$, $\\det A = 8 - 5 = 3$, so a region of area $7$ has an image of area $21$.\n\n> **Watch out.** The determinant is $ad - bc$, with a minus sign, and the factor is its absolute value: areas are never negative.",
        "平移不改变面积，而矩阵把每个面积乘以其行列式的绝对值。对于 $\\mathbb{R}^2$ 中的仿射变换 $T(\\mathbf{x}) = A\\mathbf{x} + \\mathbf{b}$，区域 $S$ 的像 $T(S)$ 的面积为：\n\n$$\\operatorname{Area}(T(S)) = |\\det(A)| \\cdot \\operatorname{Area}(S)$$\n\n对 $A = \\begin{pmatrix} 2 & 5 \\\\ 1 & 4 \\end{pmatrix}$，$\\det A = 8 - 5 = 3$，所以面积为 $7$ 的区域的像面积为 $21$。\n\n> **注意。** 行列式是 $ad - bc$，中间是减号；缩放因子是它的绝对值：面积从不为负。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.int(-2, 2);
        const drawnC = rng.int(-2, 2);
        const d = rng.nonZero(-3, 3);
        // A singular matrix has no area factor to find, so the off-diagonal entry is dropped in that case.
        const cCoeff = a * d === b * drawnC ? 0 : drawnC;
        const detA = a * d - b * cCoeff;
        const absDet = Math.abs(detA);
        const areaS = rng.int(2, 8);
        const ans = absDet * areaS;
        return numberProblem({
          prompt: t(
            `An affine transformation $T(x, y) = (${poly([a, "x"], [b, "y"])}, ${poly([cCoeff, "x"], [d, "y"])}) + (1, -2)$ maps a region $S$ of area $${areaS}$. Find the area of the image $T(S)$.`,
            `已知仿射变换 $T(x, y) = (${poly([a, "x"], [b, "y"])}, ${poly([cCoeff, "x"], [d, "y"])}) + (1, -2)$ 作用于面积为 $${areaS}$ 的区域 $S$。求像 $T(S)$ 的面积。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(areaS, "The area is not scaled; the matrix multiplies it by $|\\det A|$.", "面积没有缩放；矩阵会把它乘以 $|\\det A|$。"),
            why((a * d + b * cCoeff) * areaS, "The determinant is $ad - bc$, not $ad + bc$.", "行列式是 $ad - bc$，不是 $ad + bc$。"),
            why(detA * areaS, "An area cannot be negative; the factor is $|\\det A|$.", "面积不能为负；缩放因子是 $|\\det A|$。"),
            why(absDet + areaS, "The factor multiplies the area; it is not added to it.", "缩放因子要乘以面积，而不是加上。"),
          ]),
          solution: walked(
            [
              [
                ["Find the determinant", "求行列式"],
                t(
                  `$\\det A = ${a} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(cCoeff)} = ${detA}$, so $|\\det A| = ${absDet}$; the shift $(1, -2)$ does not affect areas.`,
                  `$\\det A = ${a} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(cCoeff)} = ${detA}$，所以 $|\\det A| = ${absDet}$；平移 $(1, -2)$ 不影响面积。`,
                ),
              ],
              [
                ["Scale the area", "缩放面积"],
                t(
                  `$\\operatorname{Area}(T(S)) = ${absDet} \\cdot ${areaS} = ${ans}$.`,
                  `$\\operatorname{Area}(T(S)) = ${absDet} \\cdot ${areaS} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `The unit square goes to the parallelogram on the columns $(${a}, ${cCoeff})$ and $(${b}, ${d})$, of area $|${a} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(cCoeff)}| = ${absDet}$, so every area is multiplied by $${absDet}$.`,
              `单位正方形映成以列向量 $(${a}, ${cCoeff})$、$(${b}, ${d})$ 为边的平行四边形，面积为 $|${a} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(cCoeff)}| = ${absDet}$，所以每个面积都乘以 $${absDet}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-area-of-the-image-of-a-triangle",
      figure: multivariableDrawings3["the-image-of-an-affine-transformation#the-area-of-the-image-of-a-triangle"],
      title: t("The area of the image of a triangle", "三角形像的面积"),
      explanation: t(
        "An affine transformation $T(\\mathbf{x}) = A\\mathbf{x} + \\mathbf{b}$ maps triangles to triangles and multiplies every area by $|\\det A|$; the translation $\\mathbf{b}$ does not change areas. So find the area of the original triangle, then multiply by $|\\det A|$. A negative determinant only reverses orientation. The triangle with vertices $(1, 1)$, $(4, 1)$ and $(1, 3)$ has area $3$; under a map with $\\det A = -2$ its image has area $2 \\cdot 3 = 6$.\n\n> **Watch out.** A right triangle's area is half the product of its legs; do not forget the $\\frac{1}{2}$.",
        "仿射变换 $T(\\mathbf{x}) = A\\mathbf{x} + \\mathbf{b}$ 把三角形映成三角形，并把每个面积乘以 $|\\det A|$；平移 $\\mathbf{b}$ 不改变面积。所以先求原三角形的面积，再乘以 $|\\det A|$。行列式为负只是使定向反转。顶点为 $(1, 1)$、$(4, 1)$、$(1, 3)$ 的三角形面积为 $3$；在 $\\det A = -2$ 的映射下，它的像面积为 $2 \\cdot 3 = 6$。\n\n> **注意。** 直角三角形的面积是两条直角边乘积的一半；不要忘了 $\\frac{1}{2}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 4) * rng.pick([-1, 1]);
        const [b, c] = [rng.int(-3, 3), rng.int(-3, 3)];
        let dd = rng.int(-4, 4);
        if (a * dd - b * c === 0) dd += 1;
        const D = a * dd - b * c;
        const m = rng.int(1, 6);
        const n = rng.int(1, 6);
        const e = rng.int(-5, 5);
        const f = rng.int(-5, 5);
        const ans = Q.of(Math.abs(D) * m * n, 2);
        const T = `\\left(${poly([a, "x"], [b, "y"], [e, ""])}, ${poly([c, "x"], [dd, "y"], [f, ""])}\\right)`;
        const p1 = [a * m, c * m] as const;
        const p2 = [b * n, dd * n] as const;
        return numberProblem({
          prompt: t(
            `Find the area of the image of the triangle with vertices $(0, 0)$, $(${m}, 0)$ and $(0, ${n})$ under $T(x, y) = ${T}$.`,
            `求以 $(0, 0)$、$(${m}, 0)$、$(0, ${n})$ 为顶点的三角形在 $T(x, y) = ${T}$ 下的像的面积。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(Math.abs(D) * m * n, "The $\\frac{1}{2}$ of the triangle's area is left out.", "漏掉了三角形面积中的 $\\frac{1}{2}$。"),
            why(
              Q.of(m * n, 2),
              "That is the area of the original triangle; the map multiplies it by $|\\det A|$.",
              "那是原三角形的面积；映射会把它乘以 $|\\det A|$。",
            ),
            why(Q.of(D * m * n, 2), "An area cannot be negative; use $|\\det A|$.", "面积不能为负；要用 $|\\det A|$。"),
          ]),
          solution: walked(
            [
              [
                ["Area of the triangle", "三角形的面积"],
                t(
                  `The legs are $${m}$ and $${n}$, so the area is $\\frac{${m} \\cdot ${n}}{2} = ${Q.of(m * n, 2).toLatex()}$.`,
                  `两条直角边为 $${m}$ 和 $${n}$，所以面积为 $\\frac{${m} \\cdot ${n}}{2} = ${Q.of(m * n, 2).toLatex()}$。`,
                ),
              ],
              [
                ["Scale by the determinant", "乘以行列式"],
                t(
                  `$\\det A = ${a} \\cdot ${paren(dd)} - ${paren(b)} \\cdot ${paren(c)} = ${D}$, so the image has area $${Math.abs(D)} \\cdot ${Q.of(m * n, 2).toLatex()} = ${ans.toLatex()}$.`,
                  `$\\det A = ${a} \\cdot ${paren(dd)} - ${paren(b)} \\cdot ${paren(c)} = ${D}$，所以像的面积为 $${Math.abs(D)} \\cdot ${Q.of(m * n, 2).toLatex()} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `From the image of $(0, 0)$, the other two image vertices lie along $(${p1[0]}, ${p1[1]})$ and $(${p2[0]}, ${p2[1]})$, and $\\frac{1}{2}|${p1[0]} \\cdot ${paren(p2[1])} - ${paren(p2[0])} \\cdot ${paren(p1[1])}| = ${ans.toLatex()}$.`,
              `从 $(0, 0)$ 的像出发，另外两个像顶点分别沿 $(${p1[0]}, ${p1[1]})$ 和 $(${p2[0]}, ${p2[1]})$，且 $\\frac{1}{2}|${p1[0]} \\cdot ${paren(p2[1])} - ${paren(p2[0])} \\cdot ${paren(p1[1])}| = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** theInverseOfAnAffineTransformation inverts affine transformations. */
export const theInverseOfAnAffineTransformation: TopicDef = {
  id: "the-inverse-of-an-affine-transformation",
  title: t("The Inverse of an Affine Transformation", "仿射变换的逆变换"),
  summary: t(
    "If det A ≠ 0, the inverse of T(x) = Ax + b is T⁻¹(y) = A⁻¹(y - b).",
    "若 det A ≠ 0，则 T(x) = Ax + b 的逆变换为 T⁻¹(y) = A⁻¹(y - b)。",
  ),
  intro: t(
    "Let $T(x, y) = (2x + 1, 3y - 4)$. To find $T^{-1}(7, 5)$, undo the shift and then the scaling: $x = \\frac{7 - 1}{2} = 3$ and $y = \\frac{5 + 4}{3} = 3$, so $T^{-1}(7, 5) = (3, 3)$.\n\nCheck: $T(3, 3) = (6 + 1, 9 - 4) = (7, 5)$.\n\nIn this lesson we invert affine transformations, first with separate coordinates and then with coupled ones, and use the inverse to relate areas.",
    "设 $T(x, y) = (2x + 1, 3y - 4)$。要求 $T^{-1}(7, 5)$，先撤销平移，再撤销伸缩：$x = \\frac{7 - 1}{2} = 3$，$y = \\frac{5 + 4}{3} = 3$，所以 $T^{-1}(7, 5) = (3, 3)$。\n\n检验：$T(3, 3) = (6 + 1, 9 - 4) = (7, 5)$。\n\n本课我们求仿射变换的逆，先是各坐标分离的情形，再是坐标耦合的情形，并用逆变换联系面积。",
  ),
  prerequisites: ["affine-transformations"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "inverting-affine-maps",
      figure: multivariableDrawings3["the-inverse-of-an-affine-transformation#inverting-affine-maps"],
      title: t("Inverting affine maps", "求仿射变换的逆像"),
      explanation: t(
        "To undo the map, reverse its steps in the opposite order: first remove the shift, then undo the matrix with its inverse. To invert $T(\\mathbf{x}) = A\\mathbf{x} + \\mathbf{b}$, first subtract the translation $\\mathbf{y} - \\mathbf{b}$, then apply the matrix inverse $A^{-1}$:\n\n$$T^{-1}(\\mathbf{y}) = A^{-1}(\\mathbf{y} - \\mathbf{b}).$$\n\nFor $T(x, y) = (5x - 2, -4y + 1)$, $T^{-1}(8, 9) = \\left(\\frac{8 + 2}{5}, \\frac{9 - 1}{-4}\\right) = (2, -2)$.\n\n> **Watch out.** Subtract the shift before dividing. Dividing first and then subtracting undoes the steps in the wrong order.",
        "要撤销这个映射，就按相反的顺序倒推每一步：先去掉平移，再用逆矩阵撤销矩阵的作用。求 $T(\\mathbf{x}) = A\\mathbf{x} + \\mathbf{b}$ 的逆变换，先减去平移量 $\\mathbf{y} - \\mathbf{b}$，再乘以矩阵逆 $A^{-1}$：\n\n$$T^{-1}(\\mathbf{y}) = A^{-1}(\\mathbf{y} - \\mathbf{b})$$\n\n对 $T(x, y) = (5x - 2, -4y + 1)$，$T^{-1}(8, 9) = \\left(\\frac{8 + 2}{5}, \\frac{9 - 1}{-4}\\right) = (2, -2)$。\n\n> **注意。** 先减去平移量，再做除法。先除后减就把步骤的顺序弄反了。",
      ),
      generate(rng: Rng): Problem {
        const aVal = rng.nonZero(-3, 3);
        const dVal = rng.nonZero(-3, 3);
        const e = rng.int(-3, 3);
        const f = rng.int(-3, 3);
        const x0 = rng.int(-3, 3);
        const y0 = rng.int(-3, 3);
        const u0 = aVal * x0 + e;
        const v0 = dVal * y0 + f;
        return pointWith(
          {
            prompt: t(
              `Given the affine transformation $T(x, y) = (${poly([aVal, "x"], [e, ""])}, ${poly([dVal, "y"], [f, ""])})$, find the pre-image $(x, y) = T^{-1}(${u0}, ${v0})$. Express your answer as a point $(x, y)$.`,
              `已知仿射变换 $T(x, y) = (${poly([aVal, "x"], [e, ""])}, ${poly([dVal, "y"], [f, ""])})$，求点 $(${u0}, ${v0})$ 的原像 $(x, y) = T^{-1}(${u0}, ${v0})$。结果以点 $(x, y)$ 表示。`,
            ),
            answer: [x0, y0],
            vars: ["x", "y"],
            solution: walked(
              [
                [
                  ["Undo the first coordinate", "还原第一个坐标"],
                  t(
                    `$${poly([aVal, "x"], [e, ""])} = ${u0}$ gives $${poly([aVal, "x"])} = ${u0 - e}$, so $x = ${x0}$.`,
                    `由 $${poly([aVal, "x"], [e, ""])} = ${u0}$ 得 $${poly([aVal, "x"])} = ${u0 - e}$，所以 $x = ${x0}$。`,
                  ),
                ],
                [
                  ["Undo the second coordinate", "还原第二个坐标"],
                  t(
                    `$${poly([dVal, "y"], [f, ""])} = ${v0}$ gives $${poly([dVal, "y"])} = ${v0 - f}$, so $y = ${y0}$.`,
                    `由 $${poly([dVal, "y"], [f, ""])} = ${v0}$ 得 $${poly([dVal, "y"])} = ${v0 - f}$，所以 $y = ${y0}$。`,
                  ),
                ],
              ],
              t(
                `$T(${x0}, ${y0}) = (${aVal} \\cdot ${paren(x0)} + ${paren(e)}, ${dVal} \\cdot ${paren(y0)} + ${paren(f)}) = (${u0}, ${v0})$.`,
                `$T(${x0}, ${y0}) = (${aVal} \\cdot ${paren(x0)} + ${paren(e)}, ${dVal} \\cdot ${paren(y0)} + ${paren(f)}) = (${u0}, ${v0})$。`,
              ),
            ),
          },
          [
            [[y0, x0], "The coordinates are swapped.", "两个坐标对调了。"],
            [
              [u0, v0],
              "That is the given image point; the pre-image is the point that $T$ sends there.",
              "那是给定的像点；原像是被 $T$ 映到那里的点。",
            ],
            [
              [Q.of(u0, aVal).sub(Q.of(e)), Q.of(v0, dVal).sub(Q.of(f))],
              "The steps are undone in the wrong order: subtract the shift first, then divide.",
              "撤销步骤的顺序弄反了：先减去平移量，再做除法。",
            ],
          ],
        );
      },
    },
    {
      id: "applying-the-inverse-of-a-coupled-affine-map",
      figure: multivariableDrawings3["the-inverse-of-an-affine-transformation#applying-the-inverse-of-a-coupled-affine-map"],
      title: t("Applying the inverse of a coupled affine map", "求耦合仿射变换的逆像"),
      explanation: t(
        "To find $T^{-1}(u, v)$ for $T(\\mathbf{x}) = A\\mathbf{x} + \\mathbf{b}$, undo the steps in reverse order: subtract the translation, then apply $A^{-1}$:\n\n$$T^{-1}(\\mathbf{u}) = A^{-1}(\\mathbf{u} - \\mathbf{b}).$$\n\nFor a $2 \\times 2$ matrix, $A^{-1} = \\frac{1}{ad - bc}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$. Check the answer by applying $T$ to it. For $T(x, y) = (3x + y + 1, 5x + 2y - 3)$, $\\det A = 1$; $T^{-1}(6, 0)$ subtracts the shift to get $(5, 3)$, and $A^{-1}(5, 3) = (2 \\cdot 5 - 3, -5 \\cdot 5 + 3 \\cdot 3) = (7, -16)$.\n\n> **Watch out.** Apply $A^{-1}$ to $\\mathbf{u} - \\mathbf{b}$, not to $\\mathbf{u}$; and $A^{-1}$ swaps the diagonal entries and negates the other two.",
        "要对 $T(\\mathbf{x}) = A\\mathbf{x} + \\mathbf{b}$ 求 $T^{-1}(u, v)$，按相反的顺序撤销各步：先减去平移，再作用 $A^{-1}$：\n\n$$T^{-1}(\\mathbf{u}) = A^{-1}(\\mathbf{u} - \\mathbf{b}).$$\n\n对 $2 \\times 2$ 矩阵，$A^{-1} = \\frac{1}{ad - bc}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$。把 $T$ 作用于答案来检验。对 $T(x, y) = (3x + y + 1, 5x + 2y - 3)$，$\\det A = 1$；求 $T^{-1}(6, 0)$ 时先减去平移得 $(5, 3)$，再得 $A^{-1}(5, 3) = (2 \\cdot 5 - 3, -5 \\cdot 5 + 3 \\cdot 3) = (7, -16)$。\n\n> **注意。** $A^{-1}$ 作用于 $\\mathbf{u} - \\mathbf{b}$，而不是 $\\mathbf{u}$；$A^{-1}$ 交换对角元，并把另外两个元素变号。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(1, 3) * rng.pick([-1, 1]);
        const j = rng.int(-2, 2);
        const swap = rng.int(0, 1) === 1;
        const [a, b, c, d] = swap ? [1, k, j, 1 + k * j] : [1 + k * j, k, j, 1];
        const det = a * d - b * c;
        const e = rng.int(-5, 5);
        const f = rng.int(-5, 5);
        const X = rng.int(-4, 4);
        const Y = rng.int(-4, 4);
        const u = a * X + b * Y + e;
        const v = c * X + d * Y + f;
        const T = `\\left(${poly([a, "x"], [b, "y"], [e, ""])}, ${poly([c, "x"], [d, "y"], [f, ""])}\\right)`;
        const p = u - e;
        const q = v - f;
        return pointWith(
          {
            prompt: t(`Let $T(x, y) = ${T}$. Find $T^{-1}(${u}, ${v})$.`, `设 $T(x, y) = ${T}$。求 $T^{-1}(${u}, ${v})$。`),
            answer: [X, Y],
            vars: ["x", "y"],
            solution: walked(
              [
                [
                  ["Subtract the shift", "减去平移量"],
                  t(
                    `$\\mathbf{u} - \\mathbf{b} = (${u} - ${paren(e)}, ${v} - ${paren(f)}) = (${p}, ${q})$.`,
                    `$\\mathbf{u} - \\mathbf{b} = (${u} - ${paren(e)}, ${v} - ${paren(f)}) = (${p}, ${q})$。`,
                  ),
                ],
                [
                  ["Apply the inverse matrix", "作用逆矩阵"],
                  t(
                    `$\\det A = ${det}$, so $A^{-1}(${p}, ${q}) = (${d} \\cdot ${paren(p)} - ${paren(b)} \\cdot ${paren(q)}, ${-c} \\cdot ${paren(p)} + ${paren(a)} \\cdot ${paren(q)}) = (${X}, ${Y})$.`,
                    `$\\det A = ${det}$，所以 $A^{-1}(${p}, ${q}) = (${d} \\cdot ${paren(p)} - ${paren(b)} \\cdot ${paren(q)}, ${-c} \\cdot ${paren(p)} + ${paren(a)} \\cdot ${paren(q)}) = (${X}, ${Y})$。`,
                  ),
                ],
              ],
              t(`$T(${X}, ${Y}) = (${u}, ${v})$.`, `$T(${X}, ${Y}) = (${u}, ${v})$。`),
            ),
          },
          [
            [[p, q], "This only removes the shift; $A^{-1}$ must still be applied.", "这只去掉了平移量；还要作用 $A^{-1}$。"],
            [[a * u + b * v + e, c * u + d * v + f], "This applies $T$ again instead of undoing it.", "这是再作用一次 $T$，而不是撤销它。"],
            [
              [d * u - b * v, -c * u + a * v],
              "$A^{-1}$ is applied to $\\mathbf{u}$ before the shift is removed.",
              "在去掉平移量之前就对 $\\mathbf{u}$ 作用了 $A^{-1}$。",
            ],
            [[Y, X], "The coordinates are swapped.", "两个坐标对调了。"],
          ],
        );
      },
    },
  ],
};

/** nonlinearTransformationsOfPlaneRegions maps points under nonlinear coordinate changes. */
export const nonlinearTransformationsOfPlaneRegions: TopicDef = {
  id: "nonlinear-transformations-of-plane-regions",
  title: t("Nonlinear Transformations of Plane Regions", "平面区域的非线性变换"),
  summary: t(
    "Nonlinear coordinate transformations u = u(x, y), v = v(x, y) map curved regions in the xy-plane to simpler regions in the uv-plane.",
    "非线性坐标变换 u = u(x, y)、v = v(x, y) 将 xy 平面内的弯曲区域映射为 uv 平面内更简单的区域。",
  ),
  intro: t(
    "Let $T(x, y) = (x^2, y - x)$. The point $(3, 5)$ maps to $(9, 2)$.\n\nCheck: $(-3, -1)$ maps to $\\left((-3)^2, -1 + 3\\right) = (9, 2)$ as well, so unlike an invertible affine map, this one sends two points to the same image.\n\nIn this lesson we map points and lines under nonlinear transformations, and undo one on a region where it is one-to-one.",
    "设 $T(x, y) = (x^2, y - x)$。点 $(3, 5)$ 映到 $(9, 2)$。\n\n检验：$(-3, -1)$ 映到 $\\left((-3)^2, -1 + 3\\right) = (9, 2)$，也是同一点；与可逆的仿射映射不同，这个映射把两个点映到同一个像。\n\n本课我们求点和直线在非线性变换下的像，并在变换为一一对应的区域上把它还原。",
  ),
  prerequisites: ["affine-transformations"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "mapping-points-under-nonlinear-transformations",
      title: t("Mapping points under nonlinear transformations", "计算点在非线性变换下的像"),
      explanation: t(
        "A nonlinear transformation has no single matrix, so find the image of a point by substituting its coordinates into the formulas directly. A nonlinear transformation maps a point $(x, y)$ to $(u, v)$ via nonlinear formulas such as $u = x^2 - y^2$ and $v = 2xy$. Under $u = x + y^2$, $v = xy$, the point $(2, 3)$ goes to $(2 + 9, 6) = (11, 6)$.\n\n> **Watch out.** $x^2 - y^2$ squares each coordinate first and then subtracts; it is not $(x - y)^2$.",
        "非线性变换没有单一的矩阵，所以要把点的坐标直接代入公式来求像点。非线性变换通过非线性公式（如 $u = x^2 - y^2$ 与 $v = 2xy$）将点 $(x, y)$ 映射为 $(u, v)$。在 $u = x + y^2$，$v = xy$ 下，点 $(2, 3)$ 映到 $(2 + 9, 6) = (11, 6)$。\n\n> **注意。** $x^2 - y^2$ 是先把每个坐标平方再相减，而不是 $(x - y)^2$。",
      ),
      generate(rng: Rng): Problem {
        const x0 = rng.int(1, 5);
        const y0 = rng.int(1, 5);
        const u = x0 * x0 - y0 * y0;
        const v = 2 * x0 * y0;
        const sum = x0 * x0 + y0 * y0;
        return pointWith(
          {
            prompt: t(
              `Under the nonlinear transformation $u = x^2 - y^2$ and $v = 2xy$, find the image $(u, v)$ of the point $(${x0}, ${y0})$. Express your answer as a point $(u, v)$.`,
              `在非线性变换 $u = x^2 - y^2$ 与 $v = 2xy$ 下，求点 $(${x0}, ${y0})$ 的像 $(u, v)$。结果以点 $(u, v)$ 表示。`,
            ),
            answer: [u, v],
            vars: ["u", "v"],
            solution: walked(
              [
                [
                  ["Compute u", "计算 u"],
                  t(
                    `$u = ${x0}^2 - ${y0}^2 = ${x0 * x0} - ${y0 * y0} = ${u}$.`,
                    `$u = ${x0}^2 - ${y0}^2 = ${x0 * x0} - ${y0 * y0} = ${u}$。`,
                  ),
                ],
                [["Compute v", "计算 v"], t(`$v = 2 \\cdot ${x0} \\cdot ${y0} = ${v}$.`, `$v = 2 \\cdot ${x0} \\cdot ${y0} = ${v}$。`)],
              ],
              t(
                `For this map $u^2 + v^2 = (x^2 + y^2)^2$, and indeed $${paren(u)}^2 + ${v}^2 = ${u * u + v * v} = ${sum}^2$.`,
                `对这个映射有 $u^2 + v^2 = (x^2 + y^2)^2$，确实 $${paren(u)}^2 + ${v}^2 = ${u * u + v * v} = ${sum}^2$。`,
              ),
            ),
          },
          [
            [[v, u], "The coordinates are swapped; $u = x^2 - y^2$ comes first.", "两个坐标对调了；$u = x^2 - y^2$ 在前。"],
            [[sum, v], "The squares are added; $u$ subtracts $y^2$ from $x^2$.", "把平方相加了；$u$ 是 $x^2$ 减去 $y^2$。"],
            [
              [(x0 - y0) ** 2, v],
              "That squares the difference; $u$ is $x^2 - y^2$, not $(x - y)^2$.",
              "那是差的平方；$u$ 是 $x^2 - y^2$，不是 $(x - y)^2$。",
            ],
          ],
        );
      },
    },
    {
      id: "the-image-of-a-vertical-line-under-a-nonlinear-map",
      figure: multivariableDrawings3["nonlinear-transformations-of-plane-regions#the-image-of-a-vertical-line-under-a-nonlinear-map"],
      title: t("The image of a vertical line under a nonlinear map", "竖直直线在非线性变换下的像"),
      explanation: t(
        "To find the image of a curve under $T(x, y) = (u, v)$, substitute the curve's description into $u$ and $v$ and eliminate the parameter. Under $T(x, y) = (x + ay^2, y)$ the line $x = c$ goes to the points $(c + ay^2, y)$, so with $v = y$ its image is the parabola\n\n$$u = c + av^2.$$\n\nLines become curves because the map is not linear. Under $T(x, y) = (x - y^3, y)$, the line $x = 1$ becomes $u = 1 - v^3$, which passes through $(-7, 2)$.\n\n> **Watch out.** Keep both pieces: $u$ is the constant $c$ from the line plus the term from $y$, and that term uses $v^2$, not $v$.",
        "要求曲线在 $T(x, y) = (u, v)$ 下的像，把曲线的描述代入 $u$ 和 $v$ 并消去参数。在 $T(x, y) = (x + ay^2, y)$ 下，直线 $x = c$ 映到点 $(c + ay^2, y)$，令 $v = y$ 得其像为抛物线\n\n$$u = c + av^2.$$\n\n由于变换不是线性的，直线变成了曲线。在 $T(x, y) = (x - y^3, y)$ 下，直线 $x = 1$ 变成 $u = 1 - v^3$，它经过 $(-7, 2)$。\n\n> **注意。** 两部分都要保留：$u$ 是直线给出的常数 $c$ 加上来自 $y$ 的项，而这一项用的是 $v^2$，不是 $v$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.pick([-3, -2, -1, 1, 2, 3]);
        const c = rng.int(-5, 5);
        const k = rng.int(-4, 4) || 2;
        const ans = c + a * k * k;
        const image = poly([c, ""], [a, "v^2"]);
        return numberProblem({
          prompt: t(
            `Under $T(x, y) = (${poly([1, "x"], [a, "y^2"])}, y)$ the image of the line $x = ${c}$ is a curve in the $uv$-plane. Find $u$ at the point of the image with $v = ${k}$.`,
            `在 $T(x, y) = (${poly([1, "x"], [a, "y^2"])}, y)$ 下，直线 $x = ${c}$ 的像是 $uv$ 平面上的一条曲线。求像上 $v = ${k}$ 的点的 $u$ 值。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              c,
              `That keeps $u = x = ${c}$; the map adds $${poly([a, "y^2"])}$.`,
              `那是保留了 $u = x = ${c}$；映射还要加上 $${poly([a, "y^2"])}$。`,
            ),
            why(
              c + a * k,
              `$y$ is squared: the added term is $${a} \\cdot ${paren(k)}^2$, not $${a} \\cdot ${paren(k)}$.`,
              `$y$ 要平方：加上的项是 $${a} \\cdot ${paren(k)}^2$，不是 $${a} \\cdot ${paren(k)}$。`,
            ),
            why(a * k * k, `The constant $x = ${c}$ from the line is left out.`, `漏掉了直线给出的常数 $x = ${c}$。`),
          ]),
          solution: walked(
            [
              [
                ["Substitute the line", "代入直线"],
                t(
                  `On $x = ${c}$, $T(${c}, y) = (${poly([c, ""], [a, "y^2"])}, y)$, so with $v = y$ the image is $u = ${image}$.`,
                  `在 $x = ${c}$ 上，$T(${c}, y) = (${poly([c, ""], [a, "y^2"])}, y)$，令 $v = y$，像为 $u = ${image}$。`,
                ),
              ],
              [
                ["Evaluate at the given v", "在给定的 v 处求值"],
                t(
                  `At $v = ${k}$, $u = ${c} + ${paren(a)} \\cdot ${paren(k)}^2 = ${ans}$.`,
                  `在 $v = ${k}$ 时，$u = ${c} + ${paren(a)} \\cdot ${paren(k)}^2 = ${ans}$。`,
                ),
              ],
            ],
            t(
              `The point $(${c}, ${k})$ lies on the line, and $T(${c}, ${k}) = (${ans}, ${k})$.`,
              `点 $(${c}, ${k})$ 在直线上，且 $T(${c}, ${k}) = (${ans}, ${k})$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** polarCoordinateTransformations covers the polar coordinate change of variables. */
export const polarCoordinateTransformations: TopicDef = {
  id: "polar-coordinate-transformations",
  title: t("Polar Coordinate Transformations", "极坐标变换"),
  summary: t(
    "The polar transformation x = r cos θ, y = r sin θ has Jacobian determinant ∂(x, y)/∂(r, θ) = r, giving area element dA = r dr dθ.",
    "极坐标变换 x = r cos θ、y = r sin θ 的雅可比行列式为 ∂(x, y)/∂(r, θ) = r，对应的面积微元为 dA = r dr dθ。",
  ),
  intro: t(
    "At the point $(x, y) = (20, 21)$ the radius is $r = \\sqrt{400 + 441} = 29$, so the polar map stretches a small $r\\theta$-rectangle there by a factor of $29$. A rectangle with sides $0.01$ in $r$ and $0.01$ in $\\theta$ becomes a patch of area about $29 \\cdot 0.0001 = 0.0029$.\n\nCheck: the patch has a radial side of $0.01$ and an arc of length $r \\cdot 0.01 = 0.29$, and $0.01 \\cdot 0.29 = 0.0029$.\n\nIn this lesson we compute the Jacobian of polar coordinates and use it to find the areas of polar rectangles.",
    "在点 $(x, y) = (20, 21)$ 处半径为 $r = \\sqrt{400 + 441} = 29$，所以极坐标映射把那里的小 $r\\theta$ 矩形放大 $29$ 倍。$r$ 方向边长 $0.01$、$\\theta$ 方向边长 $0.01$ 的矩形，变成面积约为 $29 \\cdot 0.0001 = 0.0029$ 的小块。\n\n检验：这个小块的径向边长为 $0.01$，弧长为 $r \\cdot 0.01 = 0.29$，而 $0.01 \\cdot 0.29 = 0.0029$。\n\n本课我们计算极坐标的雅可比行列式，并用它求极坐标矩形的面积。",
  ),
  prerequisites: ["nonlinear-transformations-of-plane-regions"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "jacobian-of-polar-coordinate-transformation",
      figure: multivariableDrawings3["polar-coordinate-transformations#jacobian-of-polar-coordinate-transformation"],
      title: t("Jacobian of polar coordinate transformation", "极坐标变换的雅可比行列式"),
      explanation: t(
        "The Jacobian determinant measures how much a small rectangle in the new coordinates is stretched, and for polar coordinates it equals the radius. For $x = r\\cos\\theta$ and $y = r\\sin\\theta$, the Jacobian matrix and its determinant are:\n\n$$J = \\frac{\\partial(x, y)}{\\partial(r, \\theta)} = \\begin{vmatrix} \\cos\\theta & -r\\sin\\theta \\\\ \\sin\\theta & r\\cos\\theta \\end{vmatrix} = r(\\cos^2\\theta + \\sin^2\\theta) = r.$$\n\nSo at the point $(x, y) = (-12, 35)$ the Jacobian is $r = \\sqrt{144 + 1225} = 37$.\n\n> **Watch out.** $\\cos^2\\theta + \\sin^2\\theta = 1$, but the factor $r$ stays: $J$ is $r$, not $1$ and not $r^2$. And $r$ is $\\sqrt{x^2 + y^2}$, never $x + y$.",
        "雅可比行列式衡量新坐标中的小矩形被拉伸了多少，对极坐标来说它等于半径。对于 $x = r\\cos\\theta$ 与 $y = r\\sin\\theta$，其雅可比矩阵及行列式为：\n\n$$J = \\frac{\\partial(x, y)}{\\partial(r, \\theta)} = \\begin{vmatrix} \\cos\\theta & -r\\sin\\theta \\\\ \\sin\\theta & r\\cos\\theta \\end{vmatrix} = r(\\cos^2\\theta + \\sin^2\\theta) = r.$$\n\n所以在点 $(x, y) = (-12, 35)$ 处，雅可比行列式为 $r = \\sqrt{144 + 1225} = 37$。\n\n> **注意。** $\\cos^2\\theta + \\sin^2\\theta = 1$，但因子 $r$ 还在：$J$ 是 $r$，不是 $1$，也不是 $r^2$。而 $r$ 是 $\\sqrt{x^2 + y^2}$，绝不是 $x + y$。",
      ),
      generate(rng: Rng): Problem {
        const [p, q, r0] = rng.pick([
          [3, 4, 5],
          [6, 8, 10],
          [5, 12, 13],
          [9, 12, 15],
          [8, 15, 17],
          [7, 24, 25],
        ] as const);
        const swap = rng.bool();
        const x0 = (swap ? q : p) * rng.pick([-1, 1]);
        const y0 = (swap ? p : q) * rng.pick([-1, 1]);
        const ans = r0;
        return numberProblem({
          prompt: t(
            `Calculate the Jacobian determinant $J = \\frac{\\partial(x, y)}{\\partial(r, \\theta)}$ of the polar transformation $x = r\\cos\\theta, y = r\\sin\\theta$ at the point with Cartesian coordinates $(x, y) = (${x0}, ${y0})$.`,
            `计算极坐标变换 $x = r\\cos\\theta, y = r\\sin\\theta$ 在直角坐标为 $(x, y) = (${x0}, ${y0})$ 的点处的雅可比行列式 $J = \\frac{\\partial(x, y)}{\\partial(r, \\theta)}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              r0 * r0,
              `$${r0 * r0}$ is $r^2 = x^2 + y^2$; the Jacobian is $r$ itself.`,
              `$${r0 * r0}$ 是 $r^2 = x^2 + y^2$；雅可比行列式是 $r$ 本身。`,
            ),
            why(
              1,
              "$\\cos^2\\theta + \\sin^2\\theta = 1$, but it is multiplied by $r$.",
              "$\\cos^2\\theta + \\sin^2\\theta = 1$，但它还要乘以 $r$。",
            ),
            why(
              p + q,
              `$r$ is $\\sqrt{x^2 + y^2}$, not the sum $|x| + |y| = ${p + q}$.`,
              `$r$ 是 $\\sqrt{x^2 + y^2}$，不是和 $|x| + |y| = ${p + q}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Expand the determinant", "展开行列式"],
                t(
                  "$J = \\cos\\theta \\cdot r\\cos\\theta - (-r\\sin\\theta) \\cdot \\sin\\theta = r(\\cos^2\\theta + \\sin^2\\theta) = r$.",
                  "$J = \\cos\\theta \\cdot r\\cos\\theta - (-r\\sin\\theta) \\cdot \\sin\\theta = r(\\cos^2\\theta + \\sin^2\\theta) = r$。",
                ),
              ],
              [
                ["Find r at the point", "求该点的 r"],
                t(
                  `$r = \\sqrt{${paren(x0)}^2 + ${paren(y0)}^2} = \\sqrt{${x0 * x0 + y0 * y0}} = ${r0}$, so $J = ${ans}$.`,
                  `$r = \\sqrt{${paren(x0)}^2 + ${paren(y0)}^2} = \\sqrt{${x0 * x0 + y0 * y0}} = ${r0}$，所以 $J = ${ans}$。`,
                ),
              ],
            ],
            t(
              `With $r\\cos\\theta = ${x0}$ and $\\cos\\theta = \\frac{${x0}}{${r0}}$, $r\\sin\\theta = ${y0}$ and $\\sin\\theta = \\frac{${y0}}{${r0}}$, the entries give $\\frac{${x0}}{${r0}} \\cdot ${paren(x0)} + ${paren(y0)} \\cdot \\frac{${y0}}{${r0}} = \\frac{${r0 * r0}}{${r0}} = ${r0}$.`,
              `由 $r\\cos\\theta = ${x0}$、$\\cos\\theta = \\frac{${x0}}{${r0}}$，$r\\sin\\theta = ${y0}$、$\\sin\\theta = \\frac{${y0}}{${r0}}$，各元素给出 $\\frac{${x0}}{${r0}} \\cdot ${paren(x0)} + ${paren(y0)} \\cdot \\frac{${y0}}{${r0}} = \\frac{${r0 * r0}}{${r0}} = ${r0}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-area-of-a-polar-rectangle",
      figure: multivariableDrawings3["polar-coordinate-transformations#the-area-of-a-polar-rectangle"],
      title: t("The area of a polar rectangle", "极坐标矩形的面积"),
      explanation: t(
        "The polar map $(r, \\theta) \\mapsto (r\\cos\\theta, r\\sin\\theta)$ sends the rectangle $r_1 \\le r \\le r_2$, $\\alpha \\le \\theta \\le \\beta$ to a piece of an annulus. Its area is a fraction $\\frac{\\beta - \\alpha}{2\\pi}$ of the full annulus:\n\n$$A = \\frac{1}{2}(\\beta - \\alpha)(r_2^2 - r_1^2).$$\n\nThe same result comes from integrating the Jacobian $r$ over the rectangle. For $1 \\le r \\le 6$, $0 \\le \\theta \\le \\pi$, the area is $\\frac{1}{2} \\cdot \\pi \\cdot (36 - 1) = \\frac{35\\pi}{2}$.\n\n> **Watch out.** Subtract the squares, $r_2^2 - r_1^2$, rather than squaring the difference $(r_2 - r_1)^2$, and keep the factor $\\frac{1}{2}$ that comes from integrating $r$.",
        "极坐标映射 $(r, \\theta) \\mapsto (r\\cos\\theta, r\\sin\\theta)$ 把矩形 $r_1 \\le r \\le r_2$，$\\alpha \\le \\theta \\le \\beta$ 映成圆环的一部分。其面积是整个圆环的 $\\frac{\\beta - \\alpha}{2\\pi}$：\n\n$$A = \\frac{1}{2}(\\beta - \\alpha)(r_2^2 - r_1^2).$$\n\n在矩形上对雅可比行列式 $r$ 积分也得到同样的结果。对 $1 \\le r \\le 6$，$0 \\le \\theta \\le \\pi$，面积为 $\\frac{1}{2} \\cdot \\pi \\cdot (36 - 1) = \\frac{35\\pi}{2}$。\n\n> **注意。** 要用平方差 $r_2^2 - r_1^2$，而不是差的平方 $(r_2 - r_1)^2$；也不要丢掉对 $r$ 积分得到的因子 $\\frac{1}{2}$。",
      ),
      generate(rng: Rng): Problem {
        const r1 = rng.int(0, 4);
        const r2 = r1 + rng.int(1, 4);
        const [m, n] = rng.pick([
          [1, 6],
          [1, 4],
          [1, 3],
          [1, 2],
          [2, 3],
          [3, 4],
          [1, 1],
          [3, 2],
        ] as const);
        const span = Q.of(m, n);
        const ans = span.mul(Q.of(r2 * r2 - r1 * r1, 2));
        const piL = (v: Q): string => (v.eq(Q.one) ? "\\pi" : v.d === 1n ? `${v.n}\\pi` : `\\frac{${v.n === 1n ? "" : v.n}\\pi}{${v.d}}`);
        const start = Q.of(rng.int(0, 3), 2);
        const end = start.add(span);
        const alpha = start.isZero() ? "0" : piL(start);
        return numberProblem({
          prompt: t(
            `The region $${r1} \\le r \\le ${r2}$, $${alpha} \\le \\theta \\le ${piL(end)}$ in polar coordinates has area $k\\pi$. Find $k$.`,
            `极坐标区域 $${r1} \\le r \\le ${r2}$，$${alpha} \\le \\theta \\le ${piL(end)}$ 的面积为 $k\\pi$。求 $k$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              span.mul(Q.of((r2 - r1) ** 2, 2)),
              `That squares the difference $${r2} - ${r1}$; the area uses $r_2^2 - r_1^2 = ${r2 * r2 - r1 * r1}$.`,
              `那是把差 $${r2} - ${r1}$ 平方了；面积用的是 $r_2^2 - r_1^2 = ${r2 * r2 - r1 * r1}$。`,
            ),
            why(
              span.mul(Q.of(r2 * r2 - r1 * r1)),
              "The factor $\\frac{1}{2}$ from $\\int r\\,dr = \\frac{r^2}{2}$ is missing.",
              "漏掉了由 $\\int r\\,dr = \\frac{r^2}{2}$ 得到的因子 $\\frac{1}{2}$。",
            ),
            why(
              Q.of(r2 * r2 - r1 * r1),
              `$${r2 * r2 - r1 * r1}\\pi$ is the whole annulus; the region covers only an angle of $${piL(span)}$ out of $2\\pi$.`,
              `$${r2 * r2 - r1 * r1}\\pi$ 是整个圆环；这个区域只占 $2\\pi$ 中的 $${piL(span)}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Read the angle", "读出角度"],
                t(
                  `The angle runs over $\\beta - \\alpha = ${piL(end)} - ${alpha} = ${piL(span)}$.`,
                  `角度的范围是 $\\beta - \\alpha = ${piL(end)} - ${alpha} = ${piL(span)}$。`,
                ),
              ],
              [
                ["Apply the formula", "代入公式"],
                t(
                  `$A = \\frac{1}{2} \\cdot ${piL(span)} \\cdot (${r2 * r2} - ${r1 * r1}) = ${piL(ans)}$, so $k = ${ans.toLatex()}$.`,
                  `$A = \\frac{1}{2} \\cdot ${piL(span)} \\cdot (${r2 * r2} - ${r1 * r1}) = ${piL(ans)}$，所以 $k = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The full annulus has area $\\pi(${r2 * r2} - ${r1 * r1}) = ${r2 * r2 - r1 * r1}\\pi$, and the region takes the fraction $\\frac{${piL(span)}}{2\\pi} = ${span.mul(Q.of(1, 2)).toLatex()}$ of it: $${span.mul(Q.of(1, 2)).toLatex()} \\cdot ${r2 * r2 - r1 * r1} = ${ans.toLatex()}$.`,
              `整个圆环的面积是 $\\pi(${r2 * r2} - ${r1 * r1}) = ${r2 * r2 - r1 * r1}\\pi$，区域占其中的 $\\frac{${piL(span)}}{2\\pi} = ${span.mul(Q.of(1, 2)).toLatex()}$：$${span.mul(Q.of(1, 2)).toLatex()} \\cdot ${r2 * r2 - r1 * r1} = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** transformationsOfRegionsBetweenCurves simplifies domains bounded by families of curves. */
export const transformationsOfRegionsBetweenCurves: TopicDef = {
  id: "transformations-of-regions-between-curves",
  title: t("Transformations of Regions Between Curves", "由曲线族所围区域的坐标变换"),
  summary: t(
    "Choosing new coordinates u and v along the boundary curves converts a curved region into a rectangle in the uv-plane.",
    "选取沿边界曲线的新坐标 u 与 v，可将弯曲区域转化为 uv 平面上的矩形区域。",
  ),
  intro: t(
    "The region in the first quadrant between the hyperbolas $xy = 2$ and $xy = 6$ and the rays $y = x$ and $y = 4x$ has curved sides. In the coordinates $u = xy$ and $v = \\frac{y}{x}$ it becomes the rectangle $2 \\le u \\le 6$, $1 \\le v \\le 4$.\n\nCheck: the point $(1, 3)$ lies between both pairs of curves, since $xy = 3$ and $\\frac{y}{x} = 3$, and its new coordinates $(u, v) = (3, 3)$ lie inside the rectangle.\n\nIn this lesson we change to coordinates along the boundary curves and compute the Jacobian of that change.",
    "第一象限中位于双曲线 $xy = 2$ 与 $xy = 6$、射线 $y = x$ 与 $y = 4x$ 之间的区域边界是弯的。在坐标 $u = xy$、$v = \\frac{y}{x}$ 下，它变成矩形 $2 \\le u \\le 6$，$1 \\le v \\le 4$。\n\n检验：点 $(1, 3)$ 满足 $xy = 3$、$\\frac{y}{x} = 3$，位于两对曲线之间，它的新坐标 $(u, v) = (3, 3)$ 也在矩形内。\n\n本课我们换成沿边界曲线的坐标，并计算这个变换的雅可比行列式。",
  ),
  prerequisites: ["nonlinear-transformations-of-plane-regions"],
  encompasses: [{ topic: "nonlinear-transformations-of-plane-regions", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "mapping-hyperbolic-regions-to-rectangles",
      figure: multivariableDrawings3["transformations-of-regions-between-curves#mapping-hyperbolic-regions-to-rectangles"],
      title: t("Mapping hyperbolic regions to rectangles", "将双曲区域映射为矩形"),
      explanation: t(
        "A region in the first quadrant bounded by hyperbolas $xy = c_1, xy = c_2$ and rays $y = k_1 x, y = k_2 x$ is mapped to a rectangle by setting $u = xy$ and $v = \\frac{y}{x}$: each hyperbola becomes a vertical side $u = c$ and each ray a horizontal side $v = k$. The point $(4, 2)$, for example, has $u = 8$ and $v = \\frac{2}{4} = \\frac{1}{2}$.\n\n> **Watch out.** $v$ is $\\frac{y}{x}$, the slope of the ray through the point, not $\\frac{x}{y}$. And $u$ is the product $xy$, not the sum.",
        "第一象限中由双曲线 $xy = c_1, xy = c_2$ 与射线 $y = k_1 x, y = k_2 x$ 围成的区域，可通过引入新坐标 $u = xy$ 和 $v = \\frac{y}{x}$ 映射为一个矩形：每条双曲线变成竖边 $u = c$，每条射线变成横边 $v = k$。例如点 $(4, 2)$ 有 $u = 8$，$v = \\frac{2}{4} = \\frac{1}{2}$。\n\n> **注意。** $v$ 是 $\\frac{y}{x}$，即过该点的射线的斜率，不是 $\\frac{x}{y}$。$u$ 是乘积 $xy$，不是和。",
      ),
      generate(rng: Rng): Problem {
        const x0 = rng.int(1, 8);
        const k = rng.int(1, 8);
        const y0 = k * x0;
        const u = x0 * y0;
        const v = k;
        return pointWith(
          {
            prompt: t(
              `For coordinates $u = xy$ and $v = \\frac{y}{x}$, find the coordinates $(u, v)$ of the point $(${x0}, ${y0})$. Express your answer as a point $(u, v)$.`,
              `对于新坐标 $u = xy$ 和 $v = \\frac{y}{x}$，求点 $(${x0}, ${y0})$ 在新坐标系下的坐标 $(u, v)$。结果以点 $(u, v)$ 表示。`,
            ),
            answer: [u, v],
            vars: ["u", "v"],
            solution: walked(
              [
                [["Compute u", "计算 u"], t(`$u = ${x0} \\cdot ${y0} = ${u}$.`, `$u = ${x0} \\cdot ${y0} = ${u}$。`)],
                [
                  ["Compute v", "计算 v"],
                  t(
                    `$v = \\frac{${y0}}{${x0}} = ${v}$, so $(u, v) = (${u}, ${v})$.`,
                    `$v = \\frac{${y0}}{${x0}} = ${v}$，所以 $(u, v) = (${u}, ${v})$。`,
                  ),
                ],
              ],
              t(
                `Going back, $x = \\sqrt{\\frac{u}{v}} = \\sqrt{${x0 * x0}} = ${x0}$ and $y = \\sqrt{uv} = \\sqrt{${y0 * y0}} = ${y0}$, the original point.`,
                `反推回去，$x = \\sqrt{\\frac{u}{v}} = \\sqrt{${x0 * x0}} = ${x0}$，$y = \\sqrt{uv} = \\sqrt{${y0 * y0}} = ${y0}$，正是原来的点。`,
              ),
            ),
          },
          [
            [[v, u], "The coordinates are swapped; $u = xy$ comes first.", "两个坐标对调了；$u = xy$ 在前。"],
            [[x0 + y0, v], `$u$ is the product $xy = ${u}$, not the sum $x + y$.`, `$u$ 是乘积 $xy = ${u}$，不是和 $x + y$。`],
          ],
        );
      },
    },
    {
      id: "the-jacobian-of-the-hyperbola-ray-coordinates",
      figure: multivariableDrawings3["transformations-of-regions-between-curves#the-jacobian-of-the-hyperbola-ray-coordinates"],
      title: t("The Jacobian of hyperbola and ray coordinates", "双曲线与射线坐标的雅可比行列式"),
      explanation: t(
        "Regions between hyperbolas $xy = c$ and rays $y = mx$ become rectangles in the coordinates $u = xy$, $v = \\frac{y}{x}$. Their Jacobian is\n\n$$\\frac{\\partial(u, v)}{\\partial(x, y)} = \\begin{vmatrix} y & x \\\\ -\\frac{y}{x^2} & \\frac{1}{x} \\end{vmatrix} = \\frac{y}{x} + \\frac{y}{x} = \\frac{2y}{x} = 2v.$$\n\nWith constant factors $u = a\\,xy$ and $v = b\\,\\frac{y}{x}$, the Jacobian is multiplied by $ab$. For $u = 5xy$ and $v = \\frac{y}{x}$ at $(1, 2)$, it is $5 \\cdot \\frac{2 \\cdot 2}{1} = 20$.\n\n> **Watch out.** The product of the off-diagonal entries is $x \\cdot \\left(-\\frac{y}{x^2}\\right) = -\\frac{y}{x}$, and subtracting it adds: the two terms do not cancel.",
        "在坐标 $u = xy$，$v = \\frac{y}{x}$ 下，双曲线 $xy = c$ 与射线 $y = mx$ 之间的区域变成矩形。其雅可比行列式为\n\n$$\\frac{\\partial(u, v)}{\\partial(x, y)} = \\begin{vmatrix} y & x \\\\ -\\frac{y}{x^2} & \\frac{1}{x} \\end{vmatrix} = \\frac{y}{x} + \\frac{y}{x} = \\frac{2y}{x} = 2v.$$\n\n若带常数因子 $u = a\\,xy$，$v = b\\,\\frac{y}{x}$，雅可比行列式要乘以 $ab$。对 $u = 5xy$、$v = \\frac{y}{x}$ 在 $(1, 2)$ 处，它等于 $5 \\cdot \\frac{2 \\cdot 2}{1} = 20$。\n\n> **注意。** 副对角线元素之积是 $x \\cdot \\left(-\\frac{y}{x^2}\\right) = -\\frac{y}{x}$，减去它等于加上：两项不会抵消。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 4);
        const b = rng.int(1, 4);
        const p = rng.int(1, 5);
        const q = rng.int(1, 6);
        const ans = Q.of(2 * a * b * q, p);
        const vHere = Q.of(b * q, p);
        return numberProblem({
          prompt: t(
            `Let $u = ${a === 1 ? "" : a}xy$ and $v = \\frac{${b === 1 ? "" : b}y}{x}$. Find $\\frac{\\partial(u, v)}{\\partial(x, y)}$ at $(${p}, ${q})$.`,
            `设 $u = ${a === 1 ? "" : a}xy$，$v = \\frac{${b === 1 ? "" : b}y}{x}$。求 $\\frac{\\partial(u, v)}{\\partial(x, y)}$ 在 $(${p}, ${q})$ 处的值。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(a * b * q, p),
              "Only one of the two equal terms is counted; the determinant is $\\frac{y}{x} + \\frac{y}{x}$, times $ab$.",
              "只算了两个相等项中的一个；行列式是 $\\frac{y}{x} + \\frac{y}{x}$，再乘 $ab$。",
            ),
            why(
              0,
              "The off-diagonal product is negative, so subtracting it adds; the terms do not cancel.",
              "副对角线的乘积是负的，减去它就是加上；两项不会抵消。",
            ),
            why(
              Q.of(2 * a * b * p, q),
              "That is $\\frac{2x}{y}$; the Jacobian is $\\frac{2y}{x}$, times $ab$.",
              "那是 $\\frac{2x}{y}$；雅可比行列式是 $\\frac{2y}{x}$，再乘 $ab$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Take the partial derivatives", "求偏导数"],
                t(
                  `$u_x = ${a === 1 ? "" : a}y$, $u_y = ${a === 1 ? "" : a}x$, $v_x = -\\frac{${b === 1 ? "" : b}y}{x^2}$, $v_y = \\frac{${b}}{x}$.`,
                  `$u_x = ${a === 1 ? "" : a}y$，$u_y = ${a === 1 ? "" : a}x$，$v_x = -\\frac{${b === 1 ? "" : b}y}{x^2}$，$v_y = \\frac{${b}}{x}$。`,
                ),
              ],
              [
                ["Form the determinant", "计算行列式"],
                t(
                  `$u_x v_y - u_y v_x = ${a * b} \\cdot \\frac{y}{x} + ${a * b} \\cdot \\frac{y}{x} = ${a * b} \\cdot \\frac{2y}{x} = ${a * b} \\cdot \\frac{${2 * q}}{${p}} = ${ans.toLatex()}$.`,
                  `$u_x v_y - u_y v_x = ${a * b} \\cdot \\frac{y}{x} + ${a * b} \\cdot \\frac{y}{x} = ${a * b} \\cdot \\frac{2y}{x} = ${a * b} \\cdot \\frac{${2 * q}}{${p}} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `In terms of the new coordinates the Jacobian is $${2 * a}v$, and here $v = \\frac{${b * q}}{${p}} = ${vHere.toLatex()}$, so $${2 * a} \\cdot ${vHere.toLatex()} = ${ans.toLatex()}$.`,
              `用新坐标表示，雅可比行列式是 $${2 * a}v$，这里 $v = \\frac{${b * q}}{${p}} = ${vHere.toLatex()}$，所以 $${2 * a} \\cdot ${vHere.toLatex()} = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 2.11 Differentiation
// ---------------------------------------------------------------------------

/** theJacobian computes 2D Jacobian determinants. */
export const theJacobian: TopicDef = {
  id: "the-jacobian",
  title: t("The Jacobian", "雅可比行列式"),
  summary: t(
    "The Jacobian determinant ∂(x, y)/∂(u, v) = xu yv - xv yu measures the local area expansion factor of a coordinate transformation.",
    "雅可比行列式 ∂(x, y)/∂(u, v) = xu yv - xv yu 度量了坐标变换的局部面积伸缩因子。",
  ),
  intro: t(
    "For $x = u + v$ and $y = uv$ the partial derivatives are $x_u = 1$, $x_v = 1$, $y_u = v$ and $y_v = u$, so the Jacobian is $1 \\cdot u - 1 \\cdot v = u - v$. At $(u, v) = (7, 2)$ it is $5$: near that point the map multiplies small areas by $5$.\n\nCheck: moving $u$ by $0.01$ moves $(x, y)$ by about $(0.01, 0.02)$, and moving $v$ by $0.01$ moves it by about $(0.01, 0.07)$. The parallelogram on these two sides has area $0.01 \\cdot 0.07 - 0.01 \\cdot 0.02 = 0.0005$, which is $5$ times the area $0.0001$ of the small square.\n\nIn this lesson we compute Jacobian determinants and integrate them to find the areas of images of regions.",
    "对 $x = u + v$，$y = uv$，偏导数为 $x_u = 1$，$x_v = 1$，$y_u = v$，$y_v = u$，所以雅可比行列式为 $1 \\cdot u - 1 \\cdot v = u - v$。在 $(u, v) = (7, 2)$ 处它等于 $5$：在该点附近，映射把小面积放大 $5$ 倍。\n\n检验：$u$ 增加 $0.01$ 使 $(x, y)$ 大约移动 $(0.01, 0.02)$，$v$ 增加 $0.01$ 使它大约移动 $(0.01, 0.07)$。以这两条边张成的平行四边形面积为 $0.01 \\cdot 0.07 - 0.01 \\cdot 0.02 = 0.0005$，正是小正方形面积 $0.0001$ 的 $5$ 倍。\n\n本课我们计算雅可比行列式，并对它积分，求区域的像的面积。",
  ),
  prerequisites: ["polar-coordinate-transformations"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "calculating-2d-jacobian-determinants",
      title: t("Calculating 2D Jacobian determinants", "计算二维雅可比行列式"),
      explanation: t(
        "Arrange the partial derivatives of the old coordinates with respect to the new ones in a matrix, and take its determinant. For a transformation $x = g(u, v)$ and $y = h(u, v)$, the **Jacobian determinant** is:\n\n$$J = \\frac{\\partial(x, y)}{\\partial(u, v)} = \\begin{vmatrix} \\frac{\\partial x}{\\partial u} & \\frac{\\partial x}{\\partial v} \\\\ \\frac{\\partial y}{\\partial u} & \\frac{\\partial y}{\\partial v} \\end{vmatrix} = \\frac{\\partial x}{\\partial u}\\frac{\\partial y}{\\partial v} - \\frac{\\partial x}{\\partial v}\\frac{\\partial y}{\\partial u}.$$\n\nFor $x = 5u^2$ and $y = v^2$, $x_u = 10u$, $y_v = 2v$ and the other two are zero, so $J = 20uv$, which is $40$ at $(1, 2)$.\n\n> **Watch out.** The entries are derivatives, not the coordinates themselves: each square contributes its own factor $2$. And $J$ keeps its sign; only an area uses $|J|$.",
        "把旧坐标对新坐标的偏导数排成一个矩阵，再求它的行列式。对于变换 $x = g(u, v)$ 与 $y = h(u, v)$，其**雅可比行列式**为：\n\n$$J = \\frac{\\partial(x, y)}{\\partial(u, v)} = \\begin{vmatrix} \\frac{\\partial x}{\\partial u} & \\frac{\\partial x}{\\partial v} \\\\ \\frac{\\partial y}{\\partial u} & \\frac{\\partial y}{\\partial v} \\end{vmatrix} = \\frac{\\partial x}{\\partial u}\\frac{\\partial y}{\\partial v} - \\frac{\\partial x}{\\partial v}\\frac{\\partial y}{\\partial u}.$$\n\n对 $x = 5u^2$，$y = v^2$，有 $x_u = 10u$，$y_v = 2v$，另两个为零，所以 $J = 20uv$，在 $(1, 2)$ 处为 $40$。\n\n> **注意。** 矩阵的元素是偏导数，不是坐标本身：每个平方都带来自己的因子 $2$。$J$ 保留符号；只有面积才用 $|J|$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const u0 = rng.int(1, 4);
        const v0 = rng.int(1, 4);
        const ans = 4 * a * b * u0 * v0;
        const central = (k: number, s: number) => (k * (s + 1) * (s + 1) - k * (s - 1) * (s - 1)) / 2;
        return numberProblem({
          prompt: t(
            `Compute the Jacobian determinant $J = \\frac{\\partial(x, y)}{\\partial(u, v)}$ for the transformation $x = ${poly([a, "u^2"])}, y = ${poly([b, "v^2"])}$ at the point $(u, v) = (${u0}, ${v0})$.`,
            `计算变换 $x = ${poly([a, "u^2"])}, y = ${poly([b, "v^2"])}$ 在点 $(u, v) = (${u0}, ${v0})$ 处的雅可比行列式 $J = \\frac{\\partial(x, y)}{\\partial(u, v)}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              2 * a * b * u0 * v0,
              "Only one factor $2$ is kept; both $x_u$ and $y_v$ carry one.",
              "只保留了一个因子 $2$；$x_u$ 和 $y_v$ 各带一个。",
            ),
            why(
              a * b * u0 * u0 * v0 * v0,
              "That multiplies $x$ and $y$ themselves; the determinant uses their partial derivatives.",
              "那是把 $x$ 和 $y$ 本身相乘；行列式用的是它们的偏导数。",
            ),
            why(
              -ans,
              "The sign is flipped; with $x_v = y_u = 0$ the determinant is just $x_u y_v$.",
              "符号反了；由于 $x_v = y_u = 0$，行列式就是 $x_u y_v$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Take the partial derivatives", "求偏导数"],
                t(
                  `$\\frac{\\partial x}{\\partial u} = ${2 * a}u$, $\\frac{\\partial x}{\\partial v} = 0$, $\\frac{\\partial y}{\\partial u} = 0$, $\\frac{\\partial y}{\\partial v} = ${2 * b}v$.`,
                  `$\\frac{\\partial x}{\\partial u} = ${2 * a}u$，$\\frac{\\partial x}{\\partial v} = 0$，$\\frac{\\partial y}{\\partial u} = 0$，$\\frac{\\partial y}{\\partial v} = ${2 * b}v$。`,
                ),
              ],
              [
                ["Form the determinant", "计算行列式"],
                t(
                  `$J = (${2 * a}u)(${2 * b}v) - 0 = ${4 * a * b}uv$, and at $(${u0}, ${v0})$, $J = ${4 * a * b} \\cdot ${u0} \\cdot ${v0} = ${ans}$.`,
                  `$J = (${2 * a}u)(${2 * b}v) - 0 = ${4 * a * b}uv$，在 $(${u0}, ${v0})$ 处 $J = ${4 * a * b} \\cdot ${u0} \\cdot ${v0} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `For a quadratic the central difference is exact: $\\frac{x(${u0 + 1}) - x(${u0 - 1})}{2} = ${central(a, u0)}$ and $\\frac{y(${v0 + 1}) - y(${v0 - 1})}{2} = ${central(b, v0)}$, whose product is $${ans}$.`,
              `对二次函数，中心差分是精确的：$\\frac{x(${u0 + 1}) - x(${u0 - 1})}{2} = ${central(a, u0)}$，$\\frac{y(${v0 + 1}) - y(${v0 - 1})}{2} = ${central(b, v0)}$，二者之积为 $${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "area-under-a-nonlinear-map-by-the-jacobian",
      figure: multivariableDrawings3["the-jacobian#area-under-a-nonlinear-map-by-the-jacobian"],
      title: t("Area under a nonlinear map by the Jacobian", "用雅可比行列式求非线性变换下的面积"),
      explanation: t(
        "When $T(u, v) = (x, y)$ is one-to-one on a region $R$, the area of the image is\n\n$$\\iint_R \\left|\\frac{\\partial(x, y)}{\\partial(u, v)}\\right| du\\,dv.$$\n\nFor $T(u, v) = (u, uv)$ the Jacobian is $\\begin{vmatrix} 1 & 0 \\\\ v & u \\end{vmatrix} = u$, so it stretches area more where $u$ is larger. Integrating $u$ over the rectangle gives the image's area. For $1 \\le u \\le 3$, $1 \\le v \\le 3$ it is $\\int_1^3 \\int_1^3 u\\,du\\,dv = 2 \\cdot \\frac{9 - 1}{2} = 8$.\n\n> **Watch out.** The area of the rectangle itself is not the answer: the map stretches it by the factor $u$, which changes across the rectangle and must be integrated.",
        "当 $T(u, v) = (x, y)$ 在区域 $R$ 上是一一映射时，像的面积为\n\n$$\\iint_R \\left|\\frac{\\partial(x, y)}{\\partial(u, v)}\\right| du\\,dv.$$\n\n对 $T(u, v) = (u, uv)$，雅可比行列式为 $\\begin{vmatrix} 1 & 0 \\\\ v & u \\end{vmatrix} = u$，所以 $u$ 越大面积被拉伸得越多。在矩形上对 $u$ 积分就得到像的面积。对 $1 \\le u \\le 3$，$1 \\le v \\le 3$，面积为 $\\int_1^3 \\int_1^3 u\\,du\\,dv = 2 \\cdot \\frac{9 - 1}{2} = 8$。\n\n> **注意。** 矩形本身的面积不是答案：映射按因子 $u$ 拉伸它，而这个因子在矩形上是变化的，必须积分。",
      ),
      generate(rng: Rng): Problem {
        const p = rng.int(1, 4);
        const q = p + rng.int(1, 4);
        const n = rng.int(1, 6);
        const ans = Q.of(n * (q * q - p * p), 2);
        return numberProblem({
          prompt: t(
            `Find the area of the image of the rectangle $${p} \\le u \\le ${q}$, $0 \\le v \\le ${n}$ under $T(u, v) = (u, uv)$.`,
            `求矩形 $${p} \\le u \\le ${q}$，$0 \\le v \\le ${n}$ 在 $T(u, v) = (u, uv)$ 下的像的面积。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              n * (q - p),
              "That is the area of the rectangle itself; the map stretches it by the Jacobian $u$.",
              "那是矩形本身的面积；映射按雅可比行列式 $u$ 拉伸它。",
            ),
            why(
              n * (q * q - p * p),
              "The factor $\\frac{1}{2}$ from $\\int u\\,du = \\frac{u^2}{2}$ is missing.",
              "漏掉了由 $\\int u\\,du = \\frac{u^2}{2}$ 得到的因子 $\\frac{1}{2}$。",
            ),
            why(
              Q.of(n * (q - p) ** 2, 2),
              `That squares the difference $${q} - ${p}$; the integral gives $\\frac{${q}^2 - ${p}^2}{2}$.`,
              `那是把差 $${q} - ${p}$ 平方了；积分给出 $\\frac{${q}^2 - ${p}^2}{2}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the Jacobian", "求雅可比行列式"],
                t(
                  "$\\frac{\\partial(x, y)}{\\partial(u, v)} = 1 \\cdot u - 0 \\cdot v = u$, which is positive here.",
                  "$\\frac{\\partial(x, y)}{\\partial(u, v)} = 1 \\cdot u - 0 \\cdot v = u$，这里为正。",
                ),
              ],
              [
                ["Integrate it", "积分"],
                t(
                  `$\\int_0^{${n}}\\int_{${p}}^{${q}} u\\,du\\,dv = ${n} \\cdot \\frac{${q * q} - ${p * p}}{2} = ${ans.toLatex()}$.`,
                  `$\\int_0^{${n}}\\int_{${p}}^{${q}} u\\,du\\,dv = ${n} \\cdot \\frac{${q * q} - ${p * p}}{2} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The image is the region $${p} \\le x \\le ${q}$, $0 \\le y \\le ${n === 1 ? "" : n}x$, whose area is $\\int_{${p}}^{${q}} ${n === 1 ? "" : n}x\\,dx = ${ans.toLatex()}$ directly.`,
              `像是区域 $${p} \\le x \\le ${q}$，$0 \\le y \\le ${n === 1 ? "" : n}x$，直接算面积为 $\\int_{${p}}^{${q}} ${n === 1 ? "" : n}x\\,dx = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** theInverseFunctionTheorem relates Jacobians of forward and inverse transformations. */
export const theInverseFunctionTheorem: TopicDef = {
  id: "the-inverse-function-theorem",
  title: t("The Inverse Function Theorem", "反函数定理"),
  summary: t(
    "If the Jacobian determinant J is nonzero at a point, the transformation is locally invertible, with inverse Jacobian 1/J.",
    "若在某点处雅可比行列式 J 非零，则该变换在该点局部可逆，且逆变换的雅可比行列式为 1/J。",
  ),
  intro: t(
    "The map $x = 2u + v$, $y = u + 3v$ has Jacobian $2 \\cdot 3 - 1 \\cdot 1 = 5$. Its inverse is $u = \\frac{3x - y}{5}$, $v = \\frac{2y - x}{5}$, whose Jacobian is $\\frac{3}{5} \\cdot \\frac{2}{5} - \\left(-\\frac{1}{5}\\right)\\left(-\\frac{1}{5}\\right) = \\frac{5}{25} = \\frac{1}{5}$.\n\nCheck: $5 \\cdot \\frac{1}{5} = 1$, the Jacobian of the identity map, which is what doing the map and then its inverse gives.\n\nIn this lesson we use a nonzero Jacobian to invert a map near a point, and find the Jacobian and the partial derivatives of the inverse without solving for it.",
    "映射 $x = 2u + v$，$y = u + 3v$ 的雅可比行列式为 $2 \\cdot 3 - 1 \\cdot 1 = 5$。它的逆是 $u = \\frac{3x - y}{5}$，$v = \\frac{2y - x}{5}$，其雅可比行列式为 $\\frac{3}{5} \\cdot \\frac{2}{5} - \\left(-\\frac{1}{5}\\right)\\left(-\\frac{1}{5}\\right) = \\frac{5}{25} = \\frac{1}{5}$。\n\n检验：$5 \\cdot \\frac{1}{5} = 1$，正是恒等映射的雅可比行列式，而先做映射再做其逆就得到恒等映射。\n\n本课我们利用非零的雅可比行列式在一点附近求逆映射，并且不解出逆映射就求出它的雅可比行列式和偏导数。",
  ),
  prerequisites: ["the-jacobian"],
  encompasses: [{ topic: "the-jacobian", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "reciprocal-property-of-inverse-jacobians",
      title: t("Reciprocal property of inverse Jacobians", "逆变换雅可比行列式的倒数关系"),
      explanation: t(
        "By the Inverse Function Theorem, if $T$ is continuously differentiable with non-zero Jacobian $J = \\frac{\\partial(x, y)}{\\partial(u, v)} \\ne 0$, then $T^{-1}$ exists locally and:\n\n$$\\frac{\\partial(u, v)}{\\partial(x, y)} = \\frac{1}{\\frac{\\partial(x, y)}{\\partial(u, v)}} = \\frac{1}{J}.$$\n\nA map with Jacobian $-\\frac{2}{3}$ at a point has an inverse with Jacobian $-\\frac{3}{2}$ at the image point.\n\n> **Watch out.** The reciprocal keeps the sign: an inverse reverses orientation exactly when the map does. It is $\\frac{1}{J}$, not $-J$ and not $\\frac{1}{J^2}$.",
        "由反函数定理，若 $T$ 连续可微且雅可比行列式 $J = \\frac{\\partial(x, y)}{\\partial(u, v)} \\ne 0$，则 $T^{-1}$ 局部存在且满足：\n\n$$\\frac{\\partial(u, v)}{\\partial(x, y)} = \\frac{1}{\\frac{\\partial(x, y)}{\\partial(u, v)}} = \\frac{1}{J}.$$\n\n若映射在某点的雅可比行列式为 $-\\frac{2}{3}$，则其逆在像点处的雅可比行列式为 $-\\frac{3}{2}$。\n\n> **注意。** 倒数保留符号：映射改变定向时，它的逆也改变定向。答案是 $\\frac{1}{J}$，不是 $-J$，也不是 $\\frac{1}{J^2}$。",
      ),
      generate(rng: Rng): Problem {
        const jVal = rng.nonZero(-30, 30);
        const ans = Q.of(1, jVal);
        return numberProblem({
          prompt: t(
            `Suppose a smooth coordinate transformation $T(u, v) = (x, y)$ has Jacobian determinant $\\frac{\\partial(x, y)}{\\partial(u, v)} = ${jVal}$ at a point $P$. Find the Jacobian determinant $\\frac{\\partial(u, v)}{\\partial(x, y)}$ of the inverse transformation at $T(P)$.`,
            `设光滑坐标变换 $T(u, v) = (x, y)$ 在点 $P$ 处的雅可比行列式为 $\\frac{\\partial(x, y)}{\\partial(u, v)} = ${jVal}$。求逆变换在 $T(P)$ 处的雅可比行列式 $\\frac{\\partial(u, v)}{\\partial(x, y)}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              jVal,
              "That is the Jacobian of $T$ itself; the inverse has the reciprocal.",
              "那是 $T$ 本身的雅可比行列式；逆变换的是它的倒数。",
            ),
            why(ans.neg(), "The reciprocal keeps the sign of $J$.", "倒数保留 $J$ 的符号。"),
            why(
              Q.of(1, jVal * jVal),
              "Only one reciprocal is taken: $\\frac{1}{J}$, not $\\frac{1}{J^2}$.",
              "只取一次倒数：$\\frac{1}{J}$，不是 $\\frac{1}{J^2}$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Check the theorem applies", "检查定理的条件"],
                t(
                  `The Jacobian $${jVal}$ is not zero, so $T$ has a local inverse near $P$.`,
                  `雅可比行列式 $${jVal}$ 不为零，所以 $T$ 在 $P$ 附近有局部逆映射。`,
                ),
              ],
              [
                ["Take the reciprocal", "取倒数"],
                t(
                  `$\\frac{\\partial(u, v)}{\\partial(x, y)} = \\frac{1}{${jVal}} = ${ans.toLatex()}$.`,
                  `$\\frac{\\partial(u, v)}{\\partial(x, y)} = \\frac{1}{${jVal}} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `Composing $T$ with its inverse gives the identity, whose Jacobian is $1$, and indeed $${jVal} \\cdot ${paren(ans)} = 1$.`,
              `$T$ 与其逆复合得到恒等映射，其雅可比行列式为 $1$，确实 $${jVal} \\cdot ${paren(ans)} = 1$。`,
            ),
          ),
        });
      },
    },
    {
      id: "partial-derivatives-of-a-local-inverse",
      title: t("Partial derivatives of a local inverse", "局部逆映射的偏导数"),
      explanation: t(
        "If $T(x, y) = (u, v)$ has a nonzero Jacobian at a point, the inverse function theorem gives a local inverse whose derivative matrix is the inverse of $DT$:\n\n$$\\begin{pmatrix} x_u & x_v \\\\ y_u & y_v \\end{pmatrix} = \\frac{1}{u_x v_y - u_y v_x}\\begin{pmatrix} v_y & -u_y \\\\ -v_x & u_x \\end{pmatrix}.$$\n\nSo the partial derivatives of the inverse can be found without solving for $x$ and $y$. For $T(x, y) = (x^2 + 5y, x + y^2)$ at $(1, 2)$, $DT = \\begin{pmatrix} 2 & 5 \\\\ 1 & 4 \\end{pmatrix}$ with determinant $3$, so $x_u = \\frac{4}{3}$ and $x_v = -\\frac{5}{3}$.\n\n> **Watch out.** $x_u$ is not $\\frac{1}{u_x}$: the inverse matrix swaps the diagonal entries and changes the sign of the other two, all over the determinant.",
        "若 $T(x, y) = (u, v)$ 在某点的雅可比行列式非零，反函数定理给出一个局部逆映射，其导数矩阵是 $DT$ 的逆：\n\n$$\\begin{pmatrix} x_u & x_v \\\\ y_u & y_v \\end{pmatrix} = \\frac{1}{u_x v_y - u_y v_x}\\begin{pmatrix} v_y & -u_y \\\\ -v_x & u_x \\end{pmatrix}.$$\n\n所以无需解出 $x$ 和 $y$ 就能求出逆映射的偏导数。对 $T(x, y) = (x^2 + 5y, x + y^2)$ 在 $(1, 2)$ 处，$DT = \\begin{pmatrix} 2 & 5 \\\\ 1 & 4 \\end{pmatrix}$，行列式为 $3$，所以 $x_u = \\frac{4}{3}$，$x_v = -\\frac{5}{3}$。\n\n> **注意。** $x_u$ 不是 $\\frac{1}{u_x}$：逆矩阵交换两个对角元素，改变另两个元素的符号，再全部除以行列式。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-3, 3) || 1;
        const b = rng.int(-3, 3) || 2;
        const p = rng.int(-3, 3) || 1;
        let q = rng.int(-3, 3) || 2;
        if (4 * p * q - a * b === 0) q += q > 0 ? 1 : -1;
        const J = 4 * p * q - a * b;
        const which = rng.int(0, 3);
        const names = [
          "\\frac{\\partial x}{\\partial u}",
          "\\frac{\\partial x}{\\partial v}",
          "\\frac{\\partial y}{\\partial u}",
          "\\frac{\\partial y}{\\partial v}",
        ];
        const forward = [2 * p, a, b, 2 * q];
        const nums = [2 * q, -a, -b, 2 * p];
        const num = nums[which] ?? 0;
        const fwd = forward[which] ?? 1;
        const ans = Q.of(num, J);
        const u0 = p * p + a * q;
        const v0 = b * p + q * q;
        const diagonal = which === 0 || which === 3;
        const column = which % 2 === 0 ? [2 * q, -b] : [-a, 2 * p];
        const c0 = column[0] ?? 0;
        const c1 = column[1] ?? 0;
        const rowDot = 2 * p * c0 + a * c1;
        return numberProblem({
          prompt: t(
            `Let $T(x, y) = (${poly([1, "x^2"], [a, "y"])}, ${poly([b, "x"], [1, "y^2"])})$. Near $(${p}, ${q})$, $T$ has a local inverse. Find $${names[which]}$ at $(u, v) = (${u0}, ${v0})$.`,
            `设 $T(x, y) = (${poly([1, "x^2"], [a, "y"])}, ${poly([b, "x"], [1, "y^2"])})$。在 $(${p}, ${q})$ 附近 $T$ 有局部逆映射。求 $(u, v) = (${u0}, ${v0})$ 处的 $${names[which]}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(fwd, J),
              diagonal
                ? "That keeps the diagonal entry in its place; the inverse matrix swaps the two diagonal entries."
                : "That keeps the sign of the off-diagonal entry; the inverse matrix changes it.",
              diagonal ? "那是让对角元素留在原位；逆矩阵要交换两个对角元素。" : "那是保留了副对角元素的符号；逆矩阵要改变它。",
            ),
            diagonal
              ? why(
                  Q.of(1, fwd),
                  "$\\frac{1}{u_x}$ is the one-variable rule; with two variables, invert the whole matrix.",
                  "$\\frac{1}{u_x}$ 是一元的法则；两个变量时要求整个矩阵的逆。",
                )
              : why(
                  Q.of(nums[3 - which] ?? 1, J),
                  "That is the other off-diagonal entry; each one stays in its place and only changes sign.",
                  "那是另一个副对角元素；每个副对角元素留在原位，只改变符号。",
                ),
            why(
              Q.of(J, num),
              "The fraction is upside down: the entry is divided by the determinant.",
              "分数上下颠倒了：应是该元素除以行列式。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the derivative matrix", "求导数矩阵"],
                t(
                  `$DT(${p}, ${q}) = \\begin{pmatrix} ${2 * p} & ${a} \\\\ ${b} & ${2 * q} \\end{pmatrix}$, with determinant $${2 * p} \\cdot ${paren(2 * q)} - ${paren(a)} \\cdot ${paren(b)} = ${J}$.`,
                  `$DT(${p}, ${q}) = \\begin{pmatrix} ${2 * p} & ${a} \\\\ ${b} & ${2 * q} \\end{pmatrix}$，行列式为 $${2 * p} \\cdot ${paren(2 * q)} - ${paren(a)} \\cdot ${paren(b)} = ${J}$。`,
                ),
              ],
              [
                ["Invert it", "求逆"],
                t(
                  `The inverse is $\\frac{1}{${J}}\\begin{pmatrix} ${2 * q} & ${-a} \\\\ ${-b} & ${2 * p} \\end{pmatrix}$, so $${names[which]} = ${ans.toLatex()}$.`,
                  `其逆为 $\\frac{1}{${J}}\\begin{pmatrix} ${2 * q} & ${-a} \\\\ ${-b} & ${2 * p} \\end{pmatrix}$，所以 $${names[which]} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The first row of $DT$ times column ${which % 2 === 0 ? "one" : "two"} of the inverse is $\\frac{${2 * p} \\cdot ${paren(c0)} + ${paren(a)} \\cdot ${paren(c1)}}{${J}} = ${rowDot / J}$, the matching entry of the identity matrix.`,
              `$DT$ 的第一行乘以逆矩阵的第${which % 2 === 0 ? "一" : "二"}列，得 $\\frac{${2 * p} \\cdot ${paren(c0)} + ${paren(a)} \\cdot ${paren(c1)}}{${J}} = ${rowDot / J}$，正是单位矩阵的对应元素。`,
            ),
          ),
        });
      },
    },
  ],
};

/** theJacobianOfAThreeDimensionalTransformation computes 3D Jacobians like cylindrical and spherical. */
export const theJacobianOfAThreeDimensionalTransformation: TopicDef = {
  id: "the-jacobian-of-a-three-dimensional-transformation",
  title: t("The Jacobian of a Three-Dimensional Transformation", "三维变换的雅可比行列式"),
  summary: t(
    "The 3D Jacobian determinant ∂(x, y, z)/∂(u, v, w) gives the local volume scaling factor, equal to r for cylindrical and ρ² sin φ for spherical coordinates.",
    "三维雅可比行列式 ∂(x, y, z)/∂(u, v, w) 给出了局部体积缩放因子，在柱坐标下为 r，在球坐标下为 ρ² sin φ。",
  ),
  intro: t(
    "In spherical coordinates at $\\rho = 2$, $\\varphi = \\frac{\\pi}{3}$, the Jacobian is $\\rho^2 \\sin\\varphi = 4 \\cdot \\frac{\\sqrt{3}}{2} = 2\\sqrt{3}$. A small coordinate box with sides $0.01$ in $\\rho$, $\\theta$ and $\\varphi$ therefore has volume about $2\\sqrt{3} \\cdot 10^{-6}$.\n\nCheck: the box has edges $0.01$ along the radius, $\\rho \\cdot 0.01 = 0.02$ along a meridian, and $\\rho\\sin\\varphi \\cdot 0.01 = \\sqrt{3} \\cdot 0.01$ along a circle of latitude; their product is $2\\sqrt{3} \\cdot 10^{-6}$.\n\nIn this lesson we find the volume factors of cylindrical and spherical coordinates and evaluate them at points.",
    "在球坐标中 $\\rho = 2$，$\\varphi = \\frac{\\pi}{3}$ 处，雅可比行列式为 $\\rho^2 \\sin\\varphi = 4 \\cdot \\frac{\\sqrt{3}}{2} = 2\\sqrt{3}$。因此 $\\rho$、$\\theta$、$\\varphi$ 方向边长都为 $0.01$ 的小坐标块，体积约为 $2\\sqrt{3} \\cdot 10^{-6}$。\n\n检验：这个小块沿半径的棱长为 $0.01$，沿经线的为 $\\rho \\cdot 0.01 = 0.02$，沿纬线圆的为 $\\rho\\sin\\varphi \\cdot 0.01 = \\sqrt{3} \\cdot 0.01$；三者之积为 $2\\sqrt{3} \\cdot 10^{-6}$。\n\n本课我们求柱坐标和球坐标的体积因子，并在具体的点求值。",
  ),
  prerequisites: ["the-jacobian"],
  encompasses: [{ topic: "the-jacobian", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "cylindrical-and-spherical-jacobians",
      title: t("Cylindrical and spherical Jacobians", "柱坐标与球坐标的雅可比行列式"),
      explanation: t(
        "These factors are the volume scaling of the coordinate systems, and they must appear in any triple integral after changing coordinates. Standard 3D coordinate Jacobians:\n\n- **Cylindrical coordinates** ($x = r\\cos\\theta, y = r\\sin\\theta, z = z$): $J = \\frac{\\partial(x, y, z)}{\\partial(r, \\theta, z)} = r$.\n- **Spherical coordinates** ($x = \\rho\\sin\\phi\\cos\\theta, y = \\rho\\sin\\phi\\sin\\theta, z = \\rho\\cos\\phi$): $J = \\rho^2\\sin\\phi$.\n\nSo the cylindrical Jacobian at $r = 25$ is $25$, and the spherical one at $\\rho = 12$, $\\phi = \\frac{\\pi}{6}$ is $144 \\cdot \\frac{1}{2} = 72$.\n\n> **Watch out.** Cylindrical coordinates only add a straight $z$-direction to polar ones, so the factor stays $r$, not $r^2$. The spherical factor needs both pieces: $\\rho$ squared and $\\sin\\phi$.",
        "这些因子是坐标系的体积缩放因子，换坐标后的任何三重积分中都必须出现它们。标准三维坐标变换的雅可比行列式：\n\n- **柱坐标** ($x = r\\cos\\theta, y = r\\sin\\theta, z = z$)：$J = \\frac{\\partial(x, y, z)}{\\partial(r, \\theta, z)} = r$。\n- **球坐标** ($x = \\rho\\sin\\phi\\cos\\theta, y = \\rho\\sin\\phi\\sin\\theta, z = \\rho\\cos\\phi$)：$J = \\rho^2\\sin\\phi$。\n\n所以柱坐标在 $r = 25$ 处的雅可比行列式为 $25$，球坐标在 $\\rho = 12$，$\\phi = \\frac{\\pi}{6}$ 处的为 $144 \\cdot \\frac{1}{2} = 72$。\n\n> **注意。** 柱坐标只是在极坐标上加了一个直的 $z$ 方向，所以因子仍是 $r$，不是 $r^2$。球坐标的因子两部分都要有：$\\rho$ 的平方和 $\\sin\\phi$。",
      ),
      generate(rng: Rng): Problem {
        const isCylindrical = rng.bool();
        if (isCylindrical) {
          const r = rng.int(2, 20);
          return numberProblem({
            prompt: t(
              `Calculate the Jacobian determinant $J = \\frac{\\partial(x, y, z)}{\\partial(r, \\theta, z)}$ of the cylindrical coordinate transformation at $r = ${r}$.`,
              `计算柱坐标变换在 $r = ${r}$ 处的雅可比行列式 $J = \\frac{\\partial(x, y, z)}{\\partial(r, \\theta, z)}$。`,
            ),
            answer: r,
            mistakes: distinct(r, [
              why(
                r * r,
                "Only the polar part stretches, by $r$; the $z$-direction adds a factor $1$, not another $r$.",
                "只有极坐标部分有拉伸，因子是 $r$；$z$ 方向带来的因子是 $1$，不是又一个 $r$。",
              ),
              why(
                1,
                "$\\cos^2\\theta + \\sin^2\\theta = 1$, but the factor $r$ from the polar part remains.",
                "$\\cos^2\\theta + \\sin^2\\theta = 1$，但极坐标部分的因子 $r$ 还在。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Expand along the z-row", "沿 z 所在行展开"],
                  t(
                    "The row of $z$ is $(0, 0, 1)$, so $J$ is the polar Jacobian $\\begin{vmatrix} \\cos\\theta & -r\\sin\\theta \\\\ \\sin\\theta & r\\cos\\theta \\end{vmatrix} = r$.",
                    "$z$ 所在的行是 $(0, 0, 1)$，所以 $J$ 就是极坐标的雅可比行列式 $\\begin{vmatrix} \\cos\\theta & -r\\sin\\theta \\\\ \\sin\\theta & r\\cos\\theta \\end{vmatrix} = r$。",
                  ),
                ],
                [["Evaluate", "求值"], t(`At $r = ${r}$, $J = ${r}$.`, `在 $r = ${r}$ 处 $J = ${r}$。`)],
              ],
              t(
                `A small box at radius $${r}$ has edges $\\Delta r$, $${r}\\,\\Delta\\theta$ and $\\Delta z$, so its volume is $${r}$ times $\\Delta r\\,\\Delta\\theta\\,\\Delta z$.`,
                `半径 $${r}$ 处的小块棱长为 $\\Delta r$、$${r}\\,\\Delta\\theta$ 和 $\\Delta z$，所以体积是 $\\Delta r\\,\\Delta\\theta\\,\\Delta z$ 的 $${r}$ 倍。`,
              ),
            ),
          });
        }
        const rho = rng.int(2, 10);
        const atHalf = rng.bool();
        const phiText = atHalf ? "\\frac{\\pi}{2}" : "\\frac{\\pi}{6}";
        const sinVal = atHalf ? Q.of(1) : Q.of(1, 2);
        const ans = sinVal.mul(Q.of(rho * rho));
        return numberProblem({
          prompt: t(
            `Calculate the Jacobian determinant $J = \\frac{\\partial(x, y, z)}{\\partial(\\rho, \\theta, \\phi)}$ of the spherical coordinate transformation at $\\rho = ${rho}$ and $\\phi = ${phiText}$.`,
            `计算球坐标变换在 $\\rho = ${rho}$ 与 $\\phi = ${phiText}$ 处的雅可比行列式 $J = \\frac{\\partial(x, y, z)}{\\partial(\\rho, \\theta, \\phi)}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(rho * rho, `The factor $\\sin\\phi = ${sinVal.toLatex()}$ is missing.`, `漏掉了因子 $\\sin\\phi = ${sinVal.toLatex()}$。`),
            why(rho, "$\\rho$ is squared in the spherical factor.", "球坐标的因子中 $\\rho$ 要平方。"),
            atHalf
              ? why(
                  0,
                  "That uses $\\cos\\phi$, which is $0$ at $\\frac{\\pi}{2}$; the factor is $\\sin\\phi = 1$.",
                  "那用的是 $\\cos\\phi$，它在 $\\frac{\\pi}{2}$ 处为 $0$；因子是 $\\sin\\phi = 1$。",
                )
              : why(
                  ans.mul(Q.of(4)),
                  `That divides by $\\sin\\phi$ instead of multiplying: $\\sin ${phiText} = \\frac{1}{2}$, so the factor halves $\\rho^2$.`,
                  `那是除以 $\\sin\\phi$ 而不是乘：$\\sin ${phiText} = \\frac{1}{2}$，所以要把 $\\rho^2$ 减半。`,
                ),
          ]),
          solution: walked(
            [
              [
                ["Recall the factor", "写出因子"],
                t("For spherical coordinates $J = \\rho^2\\sin\\phi$.", "球坐标的 $J = \\rho^2\\sin\\phi$。"),
              ],
              [
                ["Substitute", "代入"],
                t(
                  `$J = ${rho}^2 \\sin ${phiText} = ${rho * rho} \\cdot ${sinVal.toLatex()} = ${ans.toLatex()}$.`,
                  `$J = ${rho}^2 \\sin ${phiText} = ${rho * rho} \\cdot ${sinVal.toLatex()} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `A small box there has edges $\\Delta\\rho$, $${rho}\\,\\Delta\\phi$ and $${rho} \\cdot ${sinVal.toLatex()}\\,\\Delta\\theta$, whose product is $${ans.toLatex()}\\,\\Delta\\rho\\,\\Delta\\theta\\,\\Delta\\phi$.`,
              `那里的小块棱长为 $\\Delta\\rho$、$${rho}\\,\\Delta\\phi$ 和 $${rho} \\cdot ${sinVal.toLatex()}\\,\\Delta\\theta$，乘积为 $${ans.toLatex()}\\,\\Delta\\rho\\,\\Delta\\theta\\,\\Delta\\phi$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-spherical-coordinate-jacobian",
      title: t("The spherical coordinate Jacobian", "球坐标的雅可比行列式"),
      explanation: t(
        "For spherical coordinates $x = \\rho\\sin\\varphi\\cos\\theta$, $y = \\rho\\sin\\varphi\\sin\\theta$, $z = \\rho\\cos\\varphi$, the absolute value of the Jacobian is\n\n$$\\left|\\frac{\\partial(x, y, z)}{\\partial(\\rho, \\theta, \\varphi)}\\right| = \\rho^2 \\sin\\varphi.$$\n\nIt does not depend on $\\theta$, because turning about the $z$-axis does not stretch volume. Small boxes far from the origin and near the equator $\\varphi = \\frac{\\pi}{2}$ have the largest volume. At $\\rho = 10$, $\\theta = \\frac{\\pi}{4}$, $\\varphi = \\frac{\\pi}{6}$ it is $100 \\cdot \\frac{1}{2} = 50$.\n\n> **Watch out.** The angle $\\theta$ plays no part, so do not try to use it. And $\\sin\\varphi$ is positive for every $\\varphi$ between $0$ and $\\pi$, including the southern half.",
        "对球坐标 $x = \\rho\\sin\\varphi\\cos\\theta$，$y = \\rho\\sin\\varphi\\sin\\theta$，$z = \\rho\\cos\\varphi$，雅可比行列式的绝对值为\n\n$$\\left|\\frac{\\partial(x, y, z)}{\\partial(\\rho, \\theta, \\varphi)}\\right| = \\rho^2 \\sin\\varphi.$$\n\n它与 $\\theta$ 无关，因为绕 $z$ 轴旋转不拉伸体积。离原点远且靠近赤道 $\\varphi = \\frac{\\pi}{2}$ 的小块体积最大。在 $\\rho = 10$，$\\theta = \\frac{\\pi}{4}$，$\\varphi = \\frac{\\pi}{6}$ 处，它等于 $100 \\cdot \\frac{1}{2} = 50$。\n\n> **注意。** 角 $\\theta$ 不起作用，不要用它。对 $0$ 到 $\\pi$ 之间的每个 $\\varphi$，包括南半部分，$\\sin\\varphi$ 都是正的。",
      ),
      generate(rng: Rng): Problem {
        const r = rng.int(1, 8);
        const [phi, s] = rng.pick([
          ["\\frac{\\pi}{6}", Q.of(1, 2)],
          ["\\frac{\\pi}{2}", Q.one],
          ["\\frac{5\\pi}{6}", Q.of(1, 2)],
        ] as const);
        const theta = rng.pick(["0", "\\frac{\\pi}{3}", "\\frac{\\pi}{2}", "\\pi", "\\frac{4\\pi}{3}"]);
        const ans = s.mul(Q.of(r * r));
        return numberProblem({
          prompt: t(
            `Find $\\left|\\frac{\\partial(x, y, z)}{\\partial(\\rho, \\theta, \\varphi)}\\right|$ for spherical coordinates at $\\rho = ${r}$, $\\theta = ${theta}$, $\\varphi = ${phi}$.`,
            `求球坐标在 $\\rho = ${r}$，$\\theta = ${theta}$，$\\varphi = ${phi}$ 处的 $\\left|\\frac{\\partial(x, y, z)}{\\partial(\\rho, \\theta, \\varphi)}\\right|$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              s.mul(Q.of(r)),
              "$\\rho$ appears squared: two of the box's edges grow with $\\rho$.",
              "$\\rho$ 要平方：小块有两条棱随 $\\rho$ 增长。",
            ),
            why(Q.of(r * r), `The factor $\\sin ${phi} = ${s.toLatex()}$ is missing.`, `漏掉了因子 $\\sin ${phi} = ${s.toLatex()}$。`),
            why(s.mul(Q.of(r * r * r)), "That is $\\rho^3$; the factor is $\\rho^2$.", "那是 $\\rho^3$；因子是 $\\rho^2$。"),
          ]),
          solution: walked(
            [
              [
                ["Drop theta", "去掉 θ"],
                t(
                  `$\\rho^2\\sin\\varphi$ does not involve $\\theta$, so $\\theta = ${theta}$ is not needed.`,
                  `$\\rho^2\\sin\\varphi$ 不含 $\\theta$，所以不需要 $\\theta = ${theta}$。`,
                ),
              ],
              [
                ["Substitute", "代入"],
                t(
                  `$\\rho^2 \\sin\\varphi = ${r * r} \\sin ${phi} = ${r * r} \\cdot ${s.toLatex()} = ${ans.toLatex()}$.`,
                  `$\\rho^2 \\sin\\varphi = ${r * r} \\sin ${phi} = ${r * r} \\cdot ${s.toLatex()} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The small box has edges $\\Delta\\rho$, $${r}\\,\\Delta\\varphi$ and $${r} \\cdot ${s.toLatex()}\\,\\Delta\\theta$, whose product is $${ans.toLatex()}\\,\\Delta\\rho\\,\\Delta\\theta\\,\\Delta\\varphi$.`,
              `小块的棱长为 $\\Delta\\rho$、$${r}\\,\\Delta\\varphi$ 和 $${r} \\cdot ${s.toLatex()}\\,\\Delta\\theta$，乘积为 $${ans.toLatex()}\\,\\Delta\\rho\\,\\Delta\\theta\\,\\Delta\\varphi$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** theDerivativeOfAMultivariableFunction covers total derivative and the Jacobian matrix. */
export const theDerivativeOfAMultivariableFunction: TopicDef = {
  id: "the-derivative-of-a-multivariable-function",
  title: t("The Derivative of a Multivariable Function", "多元函数的导数（全导数矩阵）"),
  summary: t(
    "The derivative of a vector-valued multivariable function F: Rⁿ → Rᵐ is represented by its m × n Jacobian matrix of partial derivatives.",
    "向量值多元函数 F: Rⁿ → Rᵐ 的导数由其包含各偏导数的 m × n 雅可比矩阵表示。",
  ),
  intro: t(
    "For $\\mathbf{F}(x, y) = (x^2 y,\\ x + 3y)$ the derivative matrix is $D\\mathbf{F} = \\begin{pmatrix} 2xy & x^2 \\\\ 1 & 3 \\end{pmatrix}$, which at $(2, 1)$ is $\\begin{pmatrix} 4 & 4 \\\\ 1 & 3 \\end{pmatrix}$. Moving $x$ by $0.01$ changes $\\mathbf{F}$ by about $0.01 \\cdot (4, 1) = (0.04, 0.01)$, the first column.\n\nCheck: $\\mathbf{F}(2.01, 1) = (4.0401,\\ 5.01)$, and $\\mathbf{F}(2, 1) + (0.04, 0.01) = (4.04,\\ 5.01)$ is within $0.0001$ of it.\n\nIn this lesson we compute the entries of derivative matrices and use them to approximate vector functions.",
    "对 $\\mathbf{F}(x, y) = (x^2 y,\\ x + 3y)$，导数矩阵为 $D\\mathbf{F} = \\begin{pmatrix} 2xy & x^2 \\\\ 1 & 3 \\end{pmatrix}$，在 $(2, 1)$ 处为 $\\begin{pmatrix} 4 & 4 \\\\ 1 & 3 \\end{pmatrix}$。$x$ 增加 $0.01$ 时，$\\mathbf{F}$ 大约改变 $0.01 \\cdot (4, 1) = (0.04, 0.01)$，即第一列。\n\n检验：$\\mathbf{F}(2.01, 1) = (4.0401,\\ 5.01)$，而 $\\mathbf{F}(2, 1) + (0.04, 0.01) = (4.04,\\ 5.01)$，与它相差不超过 $0.0001$。\n\n本课我们计算导数矩阵的元素，并用它近似向量函数。",
  ),
  prerequisites: ["the-jacobian"],
  encompasses: [{ topic: "the-jacobian", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-jacobian-matrix-entries",
      title: t("Evaluating Jacobian matrix entries", "计算雅可比矩阵的元素"),
      explanation: t(
        "Each row of the Jacobian matrix holds the partial derivatives of one component, so it plays the role of the derivative for a function with vector outputs. For $\\mathbf{F}(x, y) = \\langle f_1(x, y), f_2(x, y) \\rangle$, the derivative is the $2 \\times 2$ Jacobian matrix:\n\n$$D\\mathbf{F}(x, y) = \\begin{pmatrix} \\frac{\\partial f_1}{\\partial x} & \\frac{\\partial f_1}{\\partial y} \\\\ \\frac{\\partial f_2}{\\partial x} & \\frac{\\partial f_2}{\\partial y} \\end{pmatrix}.$$\n\nFor $\\mathbf{F} = \\langle 5x^2 - y^2, 2xy \\rangle$ at $(4, 1)$, the $(1, 1)$-entry is $\\frac{\\partial f_1}{\\partial x} = 10x = 40$.\n\n> **Watch out.** The row names the component and the column names the variable: the $(1, 2)$-entry is $\\frac{\\partial f_1}{\\partial y}$ and the $(2, 1)$-entry is $\\frac{\\partial f_2}{\\partial x}$.",
        "雅可比矩阵的每一行是一个分量的偏导数，所以它对输出为向量的函数起着导数的作用。对于 $\\mathbf{F}(x, y) = \\langle f_1(x, y), f_2(x, y) \\rangle$，其导数为 $2 \\times 2$ 雅可比矩阵：\n\n$$D\\mathbf{F}(x, y) = \\begin{pmatrix} \\frac{\\partial f_1}{\\partial x} & \\frac{\\partial f_1}{\\partial y} \\\\ \\frac{\\partial f_2}{\\partial x} & \\frac{\\partial f_2}{\\partial y} \\end{pmatrix}.$$\n\n对 $\\mathbf{F} = \\langle 5x^2 - y^2, 2xy \\rangle$ 在 $(4, 1)$ 处，$(1, 1)$ 位置元素为 $\\frac{\\partial f_1}{\\partial x} = 10x = 40$。\n\n> **注意。** 行对应分量，列对应变量：$(1, 2)$ 位置元素是 $\\frac{\\partial f_1}{\\partial y}$，$(2, 1)$ 位置元素是 $\\frac{\\partial f_2}{\\partial x}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const x0 = rng.nonZero(-2, 3);
        const y0 = rng.nonZero(-2, 3);
        const ans = 2 * a * x0;
        const f1 = (x: number) => a * x * x + b * y0 * y0;
        return numberProblem({
          prompt: t(
            `For $\\mathbf{F}(x, y) = \\left\\langle ${poly([a, "x^2"], [b, "y^2"])}, 2xy \\right\\rangle$, compute the $(1, 1)$-entry $\\frac{\\partial f_1}{\\partial x}$ of the Jacobian matrix $D\\mathbf{F}(${x0}, ${y0})$.`,
            `对于 $\\mathbf{F}(x, y) = \\left\\langle ${poly([a, "x^2"], [b, "y^2"])}, 2xy \\right\\rangle$，计算雅可比矩阵 $D\\mathbf{F}(${x0}, ${y0})$ 的 $(1, 1)$ 位置元素 $\\frac{\\partial f_1}{\\partial x}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              2 * b * y0,
              "That is $\\frac{\\partial f_1}{\\partial y}$, the $(1, 2)$-entry.",
              "那是 $\\frac{\\partial f_1}{\\partial y}$，即 $(1, 2)$ 位置元素。",
            ),
            why(
              2 * y0,
              "That is $\\frac{\\partial f_2}{\\partial x} = 2y$, the $(2, 1)$-entry.",
              "那是 $\\frac{\\partial f_2}{\\partial x} = 2y$，即 $(2, 1)$ 位置元素。",
            ),
            why(a * x0, "The derivative of $x^2$ is $2x$; the factor $2$ is missing.", "$x^2$ 的导数是 $2x$；漏掉了因子 $2$。"),
          ]),
          solution: walked(
            [
              [
                ["Pick the entry", "确定元素"],
                t(
                  `Row $1$ is $f_1 = ${poly([a, "x^2"], [b, "y^2"])}$, and column $1$ means differentiating by $x$.`,
                  `第 $1$ 行是 $f_1 = ${poly([a, "x^2"], [b, "y^2"])}$，第 $1$ 列表示对 $x$ 求导。`,
                ),
              ],
              [
                ["Differentiate and evaluate", "求导并求值"],
                t(
                  `$\\frac{\\partial f_1}{\\partial x} = ${2 * a}x$, which at $x = ${x0}$ is $${2 * a} \\cdot ${paren(x0)} = ${ans}$.`,
                  `$\\frac{\\partial f_1}{\\partial x} = ${2 * a}x$，在 $x = ${x0}$ 处为 $${2 * a} \\cdot ${paren(x0)} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `For a quadratic the central difference is exact: $\\frac{f_1(${x0 + 1}, ${y0}) - f_1(${x0 - 1}, ${y0})}{2} = \\frac{${f1(x0 + 1)} - ${paren(f1(x0 - 1))}}{2} = ${ans}$.`,
              `对二次函数，中心差分是精确的：$\\frac{f_1(${x0 + 1}, ${y0}) - f_1(${x0 - 1}, ${y0})}{2} = \\frac{${f1(x0 + 1)} - ${paren(f1(x0 - 1))}}{2} = ${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "approximating-a-vector-function-with-its-derivative-matrix",
      title: t("Approximating a vector function with its derivative matrix", "用导数矩阵近似向量函数"),
      explanation: t(
        "The derivative of $\\mathbf{F}: \\mathbb{R}^2 \\to \\mathbb{R}^2$ at $\\mathbf{a}$ is its Jacobian matrix $D\\mathbf{F}(\\mathbf{a})$, the best linear approximation of the change in $\\mathbf{F}$:\n\n$$\\mathbf{F}(\\mathbf{a} + \\mathbf{h}) \\approx \\mathbf{F}(\\mathbf{a}) + D\\mathbf{F}(\\mathbf{a})\\,\\mathbf{h}.$$\n\nEach row of the matrix is the gradient of one component, so each component is approximated by its own linearization. For $\\mathbf{F}(x, y) = (xy, x^2 + 5y)$ at $(1, 1)$, $\\mathbf{F} = (1, 6)$ and $D\\mathbf{F} = \\begin{pmatrix} 1 & 1 \\\\ 2 & 5 \\end{pmatrix}$, so with $\\mathbf{h} = (0.1, -0.1)$, $\\mathbf{F}(1.1, 0.9) \\approx (1 + 0.1 - 0.1,\\ 6 + 0.2 - 0.5) = (1, 5.7)$.\n\n> **Watch out.** Multiply row by column: the first row pairs with $h_1$ and $h_2$ in order to give the first component. And add $D\\mathbf{F}\\,\\mathbf{h}$ to $\\mathbf{F}(\\mathbf{a})$; it is only the change.",
        "$\\mathbf{F}: \\mathbb{R}^2 \\to \\mathbb{R}^2$ 在 $\\mathbf{a}$ 处的导数是其雅可比矩阵 $D\\mathbf{F}(\\mathbf{a})$，即 $\\mathbf{F}$ 的变化量的最佳线性近似：\n\n$$\\mathbf{F}(\\mathbf{a} + \\mathbf{h}) \\approx \\mathbf{F}(\\mathbf{a}) + D\\mathbf{F}(\\mathbf{a})\\,\\mathbf{h}.$$\n\n矩阵的每一行是一个分量的梯度，所以每个分量都用自己的线性化来近似。对 $\\mathbf{F}(x, y) = (xy, x^2 + 5y)$ 在 $(1, 1)$ 处，$\\mathbf{F} = (1, 6)$，$D\\mathbf{F} = \\begin{pmatrix} 1 & 1 \\\\ 2 & 5 \\end{pmatrix}$，取 $\\mathbf{h} = (0.1, -0.1)$，得 $\\mathbf{F}(1.1, 0.9) \\approx (1 + 0.1 - 0.1,\\ 6 + 0.2 - 0.5) = (1, 5.7)$。\n\n> **注意。** 按行乘列：第一行依次与 $h_1$、$h_2$ 相乘，得到第一个分量。还要把 $D\\mathbf{F}\\,\\mathbf{h}$ 加到 $\\mathbf{F}(\\mathbf{a})$ 上；它只是变化量。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(-3, 3) || 2;
        const p = rng.int(-3, 3) || 1;
        const q = rng.int(-3, 3) || 2;
        const h1 = Q.of(rng.int(1, 3) * rng.pick([-1, 1]), 10);
        const h2 = Q.of(rng.int(-3, 3), 10);
        const F0 = p * q;
        const F1 = p * p + c * q;
        const d1 = Q.of(q).mul(h1).add(Q.of(p).mul(h2));
        const d2 = Q.of(2 * p)
          .mul(h1)
          .add(Q.of(c).mul(h2));
        const a1 = Q.of(F0).add(d1);
        const a2 = Q.of(F1).add(d2);
        const dec = (v: Q): string => String(v.toNumber());
        const x = Q.of(p).add(h1);
        const y = Q.of(q).add(h2);
        const e1 = x.mul(y);
        const e2 = x.mul(x).add(Q.of(c).mul(y));
        return pointWith(
          {
            prompt: t(
              `Let $\\mathbf{F}(x, y) = (xy, ${poly([1, "x^2"], [c, "y"])})$. Use $D\\mathbf{F}(${p}, ${q})$ to approximate $\\mathbf{F}(${dec(x)}, ${dec(y)})$.`,
              `设 $\\mathbf{F}(x, y) = (xy, ${poly([1, "x^2"], [c, "y"])})$。用 $D\\mathbf{F}(${p}, ${q})$ 近似 $\\mathbf{F}(${dec(x)}, ${dec(y)})$。`,
            ),
            answer: [a1, a2],
            vars: ["u", "v"],
            solution: walked(
              [
                [
                  ["Evaluate F and DF", "求 F 与 DF"],
                  t(
                    `$\\mathbf{F}(${p}, ${q}) = (${F0}, ${F1})$ and $D\\mathbf{F} = \\begin{pmatrix} y & x \\\\ 2x & ${c} \\end{pmatrix} = \\begin{pmatrix} ${q} & ${p} \\\\ ${2 * p} & ${c} \\end{pmatrix}$.`,
                    `$\\mathbf{F}(${p}, ${q}) = (${F0}, ${F1})$，$D\\mathbf{F} = \\begin{pmatrix} y & x \\\\ 2x & ${c} \\end{pmatrix} = \\begin{pmatrix} ${q} & ${p} \\\\ ${2 * p} & ${c} \\end{pmatrix}$。`,
                  ),
                ],
                [
                  ["Multiply by h", "乘以 h"],
                  t(
                    `With $\\mathbf{h} = (${dec(h1)}, ${dec(h2)})$, $D\\mathbf{F}\\,\\mathbf{h} = (${dec(d1)}, ${dec(d2)})$, so $\\mathbf{F}(\\mathbf{a}) + D\\mathbf{F}\\,\\mathbf{h} = (${dec(a1)}, ${dec(a2)})$.`,
                    `取 $\\mathbf{h} = (${dec(h1)}, ${dec(h2)})$，$D\\mathbf{F}\\,\\mathbf{h} = (${dec(d1)}, ${dec(d2)})$，所以 $\\mathbf{F}(\\mathbf{a}) + D\\mathbf{F}\\,\\mathbf{h} = (${dec(a1)}, ${dec(a2)})$。`,
                  ),
                ],
              ],
              t(
                `The exact value is $\\mathbf{F}(${dec(x)}, ${dec(y)}) = (${dec(e1)}, ${dec(e2)})$; the differences $h_1 h_2 = ${dec(e1.sub(a1))}$ and $h_1^2 = ${dec(e2.sub(a2))}$ are of second order, as they should be.`,
                `精确值为 $\\mathbf{F}(${dec(x)}, ${dec(y)}) = (${dec(e1)}, ${dec(e2)})$；差 $h_1 h_2 = ${dec(e1.sub(a1))}$ 与 $h_1^2 = ${dec(e2.sub(a2))}$ 是二阶小量，正应如此。`,
              ),
            ),
          },
          [
            [
              [Q.of(F0), Q.of(F1)],
              "That is $\\mathbf{F}(\\mathbf{a})$ alone; add the change $D\\mathbf{F}\\,\\mathbf{h}$.",
              "那只是 $\\mathbf{F}(\\mathbf{a})$；还要加上变化量 $D\\mathbf{F}\\,\\mathbf{h}$。",
            ],
            [
              [d1, d2],
              "That is only the change $D\\mathbf{F}\\,\\mathbf{h}$; add it to $\\mathbf{F}(\\mathbf{a})$.",
              "那只是变化量 $D\\mathbf{F}\\,\\mathbf{h}$；要把它加到 $\\mathbf{F}(\\mathbf{a})$ 上。",
            ],
            [
              [Q.of(F0).add(Q.of(p).mul(h1)).add(Q.of(q).mul(h2)), a2],
              "In the first component the entries of the row are paired with the wrong components of $\\mathbf{h}$.",
              "第一个分量中，行的元素与 $\\mathbf{h}$ 的分量配错了。",
            ],
          ],
        );
      },
    },
  ],
};

/** theSecondDerivativeOfAMultivariableFunction covers the Hessian matrix. */
export const theSecondDerivativeOfAMultivariableFunction: TopicDef = {
  id: "the-second-derivative-of-a-multivariable-function",
  title: t("The Second Derivative of a Multivariable Function", "多元函数的二阶导数（黑塞矩阵）"),
  summary: t(
    "The second derivative of a scalar function f is represented by the symmetric Hessian matrix of second partial derivatives.",
    "标量函数 f 的二阶导数由其二阶偏导数构成的对称黑塞矩阵（Hessian 矩阵）表示。",
  ),
  intro: t(
    "For $f(x, y) = x^3y + y^2$, the second partial derivatives are $f_{xx} = 6xy$, $f_{xy} = 3x^2$ and $f_{yy} = 2$. At $(1, 2)$ the Hessian is $H = \\begin{pmatrix} 12 & 3 \\\\ 3 & 2 \\end{pmatrix}$, with determinant $24 - 9 = 15$.\n\nCheck: differentiating in the other order, $f_y = x^3 + 2y$ and $f_{yx} = 3x^2$, the same as $f_{xy}$, so the matrix is symmetric as it should be.\n\nIn this lesson we compute Hessian matrices, their determinants, and second derivatives in a given direction.",
    "对 $f(x, y) = x^3y + y^2$，二阶偏导数为 $f_{xx} = 6xy$，$f_{xy} = 3x^2$，$f_{yy} = 2$。在 $(1, 2)$ 处黑塞矩阵为 $H = \\begin{pmatrix} 12 & 3 \\\\ 3 & 2 \\end{pmatrix}$，行列式为 $24 - 9 = 15$。\n\n检验：换一个顺序求导，$f_y = x^3 + 2y$，$f_{yx} = 3x^2$，与 $f_{xy}$ 相同，所以矩阵如应有的那样是对称的。\n\n本课我们计算黑塞矩阵及其行列式，以及沿给定方向的二阶导数。",
  ),
  prerequisites: ["equality-of-mixed-partial-derivatives", "the-derivative-of-a-multivariable-function"],
  encompasses: [{ topic: "equality-of-mixed-partial-derivatives", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "computing-hessian-determinants",
      title: t("Computing Hessian determinants", "计算黑塞矩阵行列式"),
      explanation: t(
        "The Hessian collects the second partial derivatives, and its determinant at a critical point helps decide whether that point is a maximum, a minimum or a saddle. For a scalar function $f(x, y)$, the **Hessian matrix** and its determinant are:\n\n$$H(x, y) = \\begin{pmatrix} f_{xx} & f_{xy} \\\\ f_{yx} & f_{yy} \\end{pmatrix}, \\quad D = \\det(H) = f_{xx}f_{yy} - (f_{xy})^2.$$\n\nFor $f = 5x^2 - y^2 + 4xy$, $f_{xx} = 10$, $f_{yy} = -2$ and $f_{xy} = 4$, so $D = 10 \\cdot (-2) - 4^2 = -36$.\n\n> **Watch out.** A square term $ax^2$ gives $f_{xx} = 2a$, but a mixed term $cxy$ gives $f_{xy} = c$, with no extra $2$. The square of $f_{xy}$ is subtracted.",
        "黑塞矩阵汇集了二阶偏导数，它在临界点处的行列式有助于判断该点是极大值、极小值还是鞍点。对于标量函数 $f(x, y)$，其**黑塞矩阵**及其行列式为：\n\n$$H(x, y) = \\begin{pmatrix} f_{xx} & f_{xy} \\\\ f_{yx} & f_{yy} \\end{pmatrix}, \\quad D = \\det(H) = f_{xx}f_{yy} - (f_{xy})^2.$$\n\n对 $f = 5x^2 - y^2 + 4xy$，$f_{xx} = 10$，$f_{yy} = -2$，$f_{xy} = 4$，所以 $D = 10 \\cdot (-2) - 4^2 = -36$。\n\n> **注意。** 平方项 $ax^2$ 给出 $f_{xx} = 2a$，而混合项 $cxy$ 给出 $f_{xy} = c$，没有多出的 $2$。$f_{xy}$ 的平方是减去的。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const c = rng.int(-2, 2);
        const ans = 4 * a * b - c * c;
        return numberProblem({
          prompt: t(
            `Calculate the Hessian determinant $D = \\det(H)$ for the function $f(x, y) = ${poly([a, "x^2"], [b, "y^2"], [c, "xy"])}$ at any point.`,
            `计算函数 $f(x, y) = ${poly([a, "x^2"], [b, "y^2"], [c, "xy"])}$ 的黑塞矩阵行列式 $D = \\det(H)$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(4 * a * b + c * c, "The square of $f_{xy}$ is subtracted, not added.", "$f_{xy}$ 的平方是减去的，不是加上的。"),
            why(
              a * b - c * c,
              `The second derivative of $${poly([a, "x^2"])}$ is $${2 * a}$, not $${a}$; each square term doubles.`,
              `$${poly([a, "x^2"])}$ 的二阶导数是 $${2 * a}$，不是 $${a}$；每个平方项都要乘 $2$。`,
            ),
            why(
              4 * a * b - 4 * c * c,
              `The mixed term $${poly([c, "xy"])}$ gives $f_{xy} = ${c}$, not $${2 * c}$.`,
              `混合项 $${poly([c, "xy"])}$ 给出 $f_{xy} = ${c}$，不是 $${2 * c}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Take the second partial derivatives", "求二阶偏导数"],
                t(
                  `$f_{xx} = ${2 * a}$, $f_{yy} = ${2 * b}$, $f_{xy} = ${c}$.`,
                  `$f_{xx} = ${2 * a}$，$f_{yy} = ${2 * b}$，$f_{xy} = ${c}$。`,
                ),
              ],
              [
                ["Form the determinant", "计算行列式"],
                t(
                  `$D = ${2 * a} \\cdot ${paren(2 * b)} - ${paren(c)}^2 = ${4 * a * b} - ${c * c} = ${ans}$.`,
                  `$D = ${2 * a} \\cdot ${paren(2 * b)} - ${paren(c)}^2 = ${4 * a * b} - ${c * c} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `For a quadratic $ax^2 + cxy + by^2$, $D = 4ab - c^2$ is the negative of the discriminant $c^2 - 4ab$ of $${poly([a, "t^2"], [c, "t"], [b, ""])}$, and $-(${c * c} - ${paren(4 * a * b)}) = ${ans}$.`,
              `对二次式 $ax^2 + cxy + by^2$，$D = 4ab - c^2$ 等于 $${poly([a, "t^2"], [c, "t"], [b, ""])}$ 的判别式 $c^2 - 4ab$ 的相反数，而 $-(${c * c} - ${paren(4 * a * b)}) = ${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-second-directional-derivative",
      title: t("The second directional derivative", "二阶方向导数"),
      explanation: t(
        "The second derivative of $f$ is its Hessian matrix $H$. The second derivative of $f$ in the direction of a unit vector $\\mathbf{u} = (u_1, u_2)$ is\n\n$$D_{\\mathbf{u}}^2 f = \\mathbf{u}^{\\mathsf{T}} H \\mathbf{u} = f_{xx}u_1^2 + 2f_{xy}u_1u_2 + f_{yy}u_2^2.$$\n\nIt measures how the surface curves along that direction. The mixed term appears twice because $H$ is symmetric. For $f = x^2 + 6xy + y^2$ along $\\mathbf{u} = \\left(\\frac{1}{\\sqrt{2}}, \\frac{1}{\\sqrt{2}}\\right)$, it is $2 \\cdot \\frac{1}{2} + 2 \\cdot 6 \\cdot \\frac{1}{2} + 2 \\cdot \\frac{1}{2} = 8$.\n\n> **Watch out.** Count the mixed term twice, $2f_{xy}u_1u_2$. The components of $\\mathbf{u}$ are squared, so a denominator $w$ becomes $w^2$.",
        "$f$ 的二阶导数是其黑塞矩阵 $H$。$f$ 沿单位向量 $\\mathbf{u} = (u_1, u_2)$ 方向的二阶导数为\n\n$$D_{\\mathbf{u}}^2 f = \\mathbf{u}^{\\mathsf{T}} H \\mathbf{u} = f_{xx}u_1^2 + 2f_{xy}u_1u_2 + f_{yy}u_2^2.$$\n\n它衡量曲面沿该方向的弯曲程度。由于 $H$ 是对称的，混合项出现两次。对 $f = x^2 + 6xy + y^2$ 沿 $\\mathbf{u} = \\left(\\frac{1}{\\sqrt{2}}, \\frac{1}{\\sqrt{2}}\\right)$，它等于 $2 \\cdot \\frac{1}{2} + 2 \\cdot 6 \\cdot \\frac{1}{2} + 2 \\cdot \\frac{1}{2} = 8$。\n\n> **注意。** 混合项要算两次，即 $2f_{xy}u_1u_2$。$\\mathbf{u}$ 的分量要平方，所以分母 $w$ 变成 $w^2$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-3, 3) || 1;
        const b = rng.int(-4, 4);
        const c = rng.int(-3, 3) || 2;
        const [u0, v0, w] = rng.pick(pythagoreanTriples.slice(0, 4));
        const u = u0 * rng.pick([-1, 1]);
        const v = v0;
        const ans = Q.of(2 * a * u * u + 2 * b * u * v + 2 * c * v * v, w * w);
        const along = Q.of(a * u * u + b * u * v + c * v * v, w * w);
        return numberProblem({
          prompt: t(
            `Find the second directional derivative of $f(x, y) = ${poly([a, "x^2"], [b, "xy"], [c, "y^2"])}$ in the direction of $\\mathbf{u} = \\left(${Q.of(u, w).toLatex()}, ${Q.of(v, w).toLatex()}\\right)$.`,
            `求 $f(x, y) = ${poly([a, "x^2"], [b, "xy"], [c, "y^2"])}$ 沿 $\\mathbf{u} = \\left(${Q.of(u, w).toLatex()}, ${Q.of(v, w).toLatex()}\\right)$ 方向的二阶方向导数。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(2 * a * u * u + b * u * v + 2 * c * v * v, w * w),
              "The mixed term counts twice: $2f_{xy}u_1u_2$.",
              "混合项要算两次：$2f_{xy}u_1u_2$。",
            ),
            why(
              Q.of(2 * a * u * u + 2 * b * u * v + 2 * c * v * v, w),
              `The components are squared, so the denominator is $${w}^2 = ${w * w}$, not $${w}$.`,
              `分量要平方，所以分母是 $${w}^2 = ${w * w}$，不是 $${w}$。`,
            ),
            why(
              Q.of(2 * a + 2 * c),
              "$f_{xx} + f_{yy}$ ignores the direction; weight each entry by the components of $\\mathbf{u}$.",
              "$f_{xx} + f_{yy}$ 没有考虑方向；每个元素都要按 $\\mathbf{u}$ 的分量加权。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Write the Hessian", "写出黑塞矩阵"],
                t(
                  `$H = \\begin{pmatrix} ${2 * a} & ${b} \\\\ ${b} & ${2 * c} \\end{pmatrix}$.`,
                  `$H = \\begin{pmatrix} ${2 * a} & ${b} \\\\ ${b} & ${2 * c} \\end{pmatrix}$。`,
                ),
              ],
              [
                ["Sandwich it", "两边乘以 u"],
                t(
                  `$\\mathbf{u}^{\\mathsf{T}} H \\mathbf{u} = \\frac{${2 * a} \\cdot ${u * u} + 2 \\cdot ${paren(b)} \\cdot ${paren(u * v)} + ${paren(2 * c)} \\cdot ${v * v}}{${w * w}} = ${ans.toLatex()}$.`,
                  `$\\mathbf{u}^{\\mathsf{T}} H \\mathbf{u} = \\frac{${2 * a} \\cdot ${u * u} + 2 \\cdot ${paren(b)} \\cdot ${paren(u * v)} + ${paren(2 * c)} \\cdot ${v * v}}{${w * w}} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `Along the line $t\\mathbf{u}$, $f = ${along.toLatex()}\\,t^2$, and the second derivative of that in $t$ is $2 \\cdot ${paren(along)} = ${ans.toLatex()}$.`,
              `沿直线 $t\\mathbf{u}$，$f = ${along.toLatex()}\\,t^2$，它对 $t$ 的二阶导数是 $2 \\cdot ${paren(along)} = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** secondDegreeTaylorPolynomialsOfMultivariableFunctions forms quadratic Taylor approximations. */
export const secondDegreeTaylorPolynomialsOfMultivariableFunctions: TopicDef = {
  id: "second-degree-taylor-polynomials-of-multivariable-functions",
  title: t("Second-Degree Taylor Polynomials of Multivariable Functions", "多元函数的二阶泰勒多项式"),
  summary: t(
    "The second-degree Taylor polynomial centered at (0, 0) is P2(x, y) = f(0, 0) + fx x + fy y + ½(fxx x² + 2fxy xy + fyy y²).",
    "在 (0, 0) 展开的二阶泰勒多项式为 P2(x, y) = f(0, 0) + fx x + fy y + ½(fxx x² + 2fxy xy + fyy y²)。",
  ),
  intro: t(
    "For $f(x, y) = e^y \\sin x$, multiplying the series $\\sin x \\approx x$ and $e^y \\approx 1 + y + \\frac{y^2}{2}$ and keeping terms of degree at most $2$ gives $P_2(x, y) = x + xy$.\n\nCheck: from the derivatives at $(0, 0)$, $f = 0$, $f_x = \\cos 0 \\cdot e^0 = 1$, $f_y = 0$, $f_{xx} = -\\sin 0 \\cdot e^0 = 0$, $f_{xy} = \\cos 0 \\cdot e^0 = 1$ and $f_{yy} = 0$, so the formula gives $x + 1 \\cdot xy$ as well.\n\nIn this lesson we build second-degree Taylor polynomials of functions of two variables and read off their coefficients.",
    "对 $f(x, y) = e^y \\sin x$，把级数 $\\sin x \\approx x$ 与 $e^y \\approx 1 + y + \\frac{y^2}{2}$ 相乘，保留次数不超过 $2$ 的项，得 $P_2(x, y) = x + xy$。\n\n检验：由 $(0, 0)$ 处的导数，$f = 0$，$f_x = \\cos 0 \\cdot e^0 = 1$，$f_y = 0$，$f_{xx} = -\\sin 0 \\cdot e^0 = 0$，$f_{xy} = \\cos 0 \\cdot e^0 = 1$，$f_{yy} = 0$，所以公式同样给出 $x + 1 \\cdot xy$。\n\n本课我们构造二元函数的二阶泰勒多项式，并读出它的系数。",
  ),
  prerequisites: ["the-second-derivative-of-a-multivariable-function"],
  encompasses: [{ topic: "the-second-derivative-of-a-multivariable-function", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "constructing-multivariable-taylor-polynomials",
      title: t("Constructing multivariable Taylor polynomials", "构造多元泰勒多项式"),
      explanation: t(
        "A quadratic Taylor polynomial in two variables matches the value, the first partial derivatives and the second partial derivatives of the function at the center. The quadratic Taylor polynomial of $f(x, y)$ centered at $(0, 0)$ is:\n\n$$P_2(x, y) = f(0, 0) + f_x(0, 0)x + f_y(0, 0)y + \\frac{1}{2}f_{xx}(0, 0)x^2 + f_{xy}(0, 0)xy + \\frac{1}{2}f_{yy}(0, 0)y^2.$$\n\nFor $f = e^{x - y}$ every derivative at the origin is $\\pm 1$, and $P_2 = 1 + x - y + \\frac{1}{2}x^2 - xy + \\frac{1}{2}y^2$.\n\n> **Watch out.** Halve $f_{xx}$ and $f_{yy}$, but not $f_{xy}$: the two equal mixed partials have already been combined into one $xy$ term.",
        "二元二次泰勒多项式在中心处与函数的值、一阶偏导数和二阶偏导数都一致。函数 $f(x, y)$ 在 $(0, 0)$ 处的二阶泰勒多项式为：\n\n$$P_2(x, y) = f(0, 0) + f_x(0, 0)x + f_y(0, 0)y + \\frac{1}{2}f_{xx}(0, 0)x^2 + f_{xy}(0, 0)xy + \\frac{1}{2}f_{yy}(0, 0)y^2.$$\n\n对 $f = e^{x - y}$，原点处的每个导数都是 $\\pm 1$，$P_2 = 1 + x - y + \\frac{1}{2}x^2 - xy + \\frac{1}{2}y^2$。\n\n> **注意。** $f_{xx}$ 和 $f_{yy}$ 要减半，$f_{xy}$ 不减半：两个相等的混合偏导数已经合并成一个 $xy$ 项。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.pick([-4, -2, 2, 4]);
        if (rng.bool()) {
          const p = rng.nonZero(-2, 2);
          const q = rng.nonZero(-2, 2);
          const f = `${c}e^{${poly([p, "x"], [q, "y"])}}`;
          const ans = poly([c, ""], [c * p, "x"], [c * q, "y"], [(c * p * p) / 2, "x^2"], [c * p * q, "xy"], [(c * q * q) / 2, "y^2"]);
          return expressionProblem({
            prompt: t(
              `Find the second-degree Taylor polynomial $P_2(x, y)$ centered at $(0, 0)$ for $f(x, y) = ${f}$.`,
              `求函数 $f(x, y) = ${f}$ 在 $(0, 0)$ 处的二阶泰勒多项式 $P_2(x, y)$。`,
            ),
            answer: ans,
            mistakes: spoken(ans, [
              say(
                poly([c, ""], [c * p, "x"], [c * q, "y"], [c * p * p, "x^2"], [c * p * q, "xy"], [c * q * q, "y^2"]),
                "The coefficients of $x^2$ and $y^2$ are half of $f_{xx}$ and $f_{yy}$.",
                "$x^2$ 和 $y^2$ 的系数是 $f_{xx}$ 和 $f_{yy}$ 的一半。",
              ),
              say(
                poly([c, ""], [c * p, "x"], [c * q, "y"], [(c * p * p) / 2, "x^2"], [(c * p * q) / 2, "xy"], [(c * q * q) / 2, "y^2"]),
                "The $xy$ coefficient is the whole of $f_{xy}$; only the pure squares are halved.",
                "$xy$ 的系数是整个 $f_{xy}$；只有纯平方项才减半。",
              ),
              say(
                poly([c, ""], [c * p, "x"], [c * q, "y"], [(c * p * p) / 2, "x^2"], [(c * q * q) / 2, "y^2"]),
                `The mixed term $${poly([c * p * q, "xy"])}$ is missing: $f_{xy}(0, 0) = ${c * p * q}$.`,
                `漏掉了混合项 $${poly([c * p * q, "xy"])}$：$f_{xy}(0, 0) = ${c * p * q}$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the derivatives at the origin", "求原点处的导数"],
                  t(
                    `Each derivative brings down a factor $${p}$ for $x$ or $${q}$ for $y$: $f = ${c}$, $f_x = ${c * p}$, $f_y = ${c * q}$, $f_{xx} = ${c * p * p}$, $f_{xy} = ${c * p * q}$, $f_{yy} = ${c * q * q}$.`,
                    `每求一次导数，对 $x$ 带下因子 $${p}$，对 $y$ 带下因子 $${q}$：$f = ${c}$，$f_x = ${c * p}$，$f_y = ${c * q}$，$f_{xx} = ${c * p * p}$，$f_{xy} = ${c * p * q}$，$f_{yy} = ${c * q * q}$。`,
                  ),
                ],
                [
                  ["Assemble the polynomial", "组成多项式"],
                  t(`Halving $f_{xx}$ and $f_{yy}$: $P_2(x, y) = ${ans}$.`, `把 $f_{xx}$ 和 $f_{yy}$ 减半：$P_2(x, y) = ${ans}$。`),
                ],
              ],
              t(
                `With $s = ${poly([p, "x"], [q, "y"])}$, $${c}\\left(1 + s + \\frac{s^2}{2}\\right)$ expands to the same polynomial; for instance its $xy$ term is $${c} \\cdot \\frac{2 \\cdot ${paren(p)} \\cdot ${paren(q)}}{2}\\,xy = ${poly([c * p * q, "xy"])}$.`,
                `令 $s = ${poly([p, "x"], [q, "y"])}$，$${c}\\left(1 + s + \\frac{s^2}{2}\\right)$ 展开后是同一个多项式；例如其 $xy$ 项为 $${c} \\cdot \\frac{2 \\cdot ${paren(p)} \\cdot ${paren(q)}}{2}\\,xy = ${poly([c * p * q, "xy"])}$。`,
              ),
            ),
          });
        }
        const p = rng.int(1, 3);
        const q = rng.nonZero(-2, 2);
        const f = `${c}\\cos(${poly([p, "x"])}) e^{${poly([q, "y"])}}`;
        const ans = poly([c, ""], [c * q, "y"], [-(c * p * p) / 2, "x^2"], [(c * q * q) / 2, "y^2"]);
        return expressionProblem({
          prompt: t(
            `Find the second-degree Taylor polynomial $P_2(x, y)$ centered at $(0, 0)$ for $f(x, y) = ${f}$.`,
            `求函数 $f(x, y) = ${f}$ 在 $(0, 0)$ 处的二阶泰勒多项式 $P_2(x, y)$。`,
          ),
          answer: ans,
          mistakes: spoken(ans, [
            say(
              poly([c, ""], [c * q, "y"], [(c * p * p) / 2, "x^2"], [(c * q * q) / 2, "y^2"]),
              `The second derivative of $\\cos(${poly([p, "x"])})$ is $-${p * p}\\cos(${poly([p, "x"])})$, so the $x^2$ term changes sign.`,
              `$\\cos(${poly([p, "x"])})$ 的二阶导数是 $-${p * p}\\cos(${poly([p, "x"])})$，所以 $x^2$ 项要变号。`,
            ),
            say(
              poly([c, ""], [c * q, "y"], [-c * p * p, "x^2"], [c * q * q, "y^2"]),
              "The coefficients of $x^2$ and $y^2$ are half of $f_{xx}$ and $f_{yy}$.",
              "$x^2$ 和 $y^2$ 的系数是 $f_{xx}$ 和 $f_{yy}$ 的一半。",
            ),
            say(
              poly([c, ""], [c * q, "y"], [-(c * p * p) / 2, "x^2"]),
              `The $y^2$ term is missing: $f_{yy}(0, 0) = ${c * q * q}$, so it is $${poly([(c * q * q) / 2, "y^2"])}$.`,
              `漏掉了 $y^2$ 项：$f_{yy}(0, 0) = ${c * q * q}$，所以它是 $${poly([(c * q * q) / 2, "y^2"])}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the derivatives at the origin", "求原点处的导数"],
                t(
                  `$f = ${c}$, $f_x = 0$, $f_y = ${c * q}$, $f_{xx} = ${-c * p * p}$, $f_{xy} = 0$, $f_{yy} = ${c * q * q}$, since $\\sin 0 = 0$.`,
                  `$f = ${c}$，$f_x = 0$，$f_y = ${c * q}$，$f_{xx} = ${-c * p * p}$，$f_{xy} = 0$，$f_{yy} = ${c * q * q}$，因为 $\\sin 0 = 0$。`,
                ),
              ],
              [
                ["Assemble the polynomial", "组成多项式"],
                t(`Halving $f_{xx}$ and $f_{yy}$: $P_2(x, y) = ${ans}$.`, `把 $f_{xx}$ 和 $f_{yy}$ 减半：$P_2(x, y) = ${ans}$。`),
              ],
            ],
            t(
              `Multiplying $${c}\\left(1 - \\frac{${p * p}x^2}{2}\\right)$ by $${poly([1, ""], [q, "y"])} + \\frac{${q * q}y^2}{2}$ and dropping terms of degree above $2$ gives $${ans}$ again.`,
              `把 $${c}\\left(1 - \\frac{${p * p}x^2}{2}\\right)$ 与 $${poly([1, ""], [q, "y"])} + \\frac{${q * q}y^2}{2}$ 相乘，去掉次数高于 $2$ 的项，同样得到 $${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "coefficients-of-a-second-degree-taylor-polynomial",
      title: t("Coefficients of a second-degree Taylor polynomial", "二阶泰勒多项式的系数"),
      explanation: t(
        "The second-degree Taylor polynomial at the origin is\n\n$$P_2 = f + f_x x + f_y y + \\tfrac{1}{2}f_{xx}x^2 + f_{xy}xy + \\tfrac{1}{2}f_{yy}y^2,$$\n\nwith every derivative taken at $(0, 0)$. So the coefficient of $x^2$ is half of $f_{xx}(0, 0)$, while the coefficient of $xy$ is the whole of $f_{xy}(0, 0)$, since the two mixed partials have been combined. Products of one-variable series give the same coefficients. For $f = e^{2x + 5y}$, $f_{xy}(0, 0) = 10$, so the coefficient of $xy$ is $10$, and the coefficient of $y^2$ is $\\frac{25}{2}$.\n\n> **Watch out.** Halve the pure second derivatives but not the mixed one. A factor $\\cos(by)$ contributes $-\\frac{b^2}{2}y^2$, with a minus sign.",
        "原点处的二阶泰勒多项式为\n\n$$P_2 = f + f_x x + f_y y + \\tfrac{1}{2}f_{xx}x^2 + f_{xy}xy + \\tfrac{1}{2}f_{yy}y^2,$$\n\n其中所有导数都在 $(0, 0)$ 处取值。所以 $x^2$ 的系数是 $f_{xx}(0, 0)$ 的一半，而 $xy$ 的系数是整个 $f_{xy}(0, 0)$，因为两个混合偏导数已合并。用一元级数相乘也得到同样的系数。对 $f = e^{2x + 5y}$，$f_{xy}(0, 0) = 10$，所以 $xy$ 的系数是 $10$，$y^2$ 的系数是 $\\frac{25}{2}$。\n\n> **注意。** 纯二阶导数要减半，混合的不减半。因子 $\\cos(by)$ 带来的是 $-\\frac{b^2}{2}y^2$，带负号。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-4, 4) || 1;
        const b = rng.int(-4, 4) || 3;
        const cosForm = rng.int(0, 1) === 1;
        const mono = rng.pick(cosForm ? (["x^2", "y^2"] as const) : (["x^2", "xy", "y^2"] as const));
        const f = cosForm ? `e^{${poly([a, "x"])}}\\cos(${poly([b, "y"])})` : `e^{${poly([a, "x"], [b, "y"])}}`;
        const coef = cosForm
          ? mono === "x^2"
            ? Q.of(a * a, 2)
            : Q.of(-b * b, 2)
          : mono === "x^2"
            ? Q.of(a * a, 2)
            : mono === "xy"
              ? Q.of(a * b)
              : Q.of(b * b, 2);
        const deriv = mono === "x^2" ? "f_{xx}" : mono === "xy" ? "f_{xy}" : "f_{yy}";
        const dv = mono === "xy" ? coef : coef.mul(Q.of(2));
        const k = mono === "x^2" ? a : b;
        const notHalved = why(
          dv,
          `$${dv.toLatex()}$ is $${deriv}(0, 0)$; the coefficient of a square is half of it.`,
          `$${dv.toLatex()}$ 是 $${deriv}(0, 0)$；平方项的系数是它的一半。`,
        );
        const mistakes =
          mono === "xy"
            ? [
                why(
                  coef.mul(Q.of(2)),
                  "The coefficient of $xy$ is $f_{xy}(0, 0)$ once; the two mixed partials are already combined.",
                  "$xy$ 的系数是一个 $f_{xy}(0, 0)$；两个混合偏导数已经合并。",
                ),
                why(
                  coef.mul(Q.of(1, 2)),
                  "Only the pure squares are halved; the $xy$ coefficient is the whole of $f_{xy}(0, 0)$.",
                  "只有纯平方项才减半；$xy$ 的系数是整个 $f_{xy}(0, 0)$。",
                ),
              ]
            : cosForm && mono === "y^2"
              ? [
                  notHalved,
                  why(
                    coef.neg(),
                    `$\\cos(${poly([b, "y"])}) \\approx 1 - \\frac{${b * b}}{2}y^2$: the $y^2$ term is negative.`,
                    `$\\cos(${poly([b, "y"])}) \\approx 1 - \\frac{${b * b}}{2}y^2$：$y^2$ 项是负的。`,
                  ),
                ]
              : [
                  notHalved,
                  why(
                    Q.of(k, 2),
                    `The factor $${k}$ is squared: two derivatives each bring one down.`,
                    `因子 $${k}$ 要平方：两次求导各带下一个。`,
                  ),
                  why(
                    coef.neg(),
                    `$${paren(k)}^2 = ${k * k}$ is positive, so the coefficient is positive.`,
                    `$${paren(k)}^2 = ${k * k}$ 是正的，所以系数为正。`,
                  ),
                ];
        const series = cosForm
          ? mono === "x^2"
            ? `e^{${poly([a, "x"])}} \\approx ${poly([1, ""], [a, "x"])} + \\frac{${a * a}}{2}x^2`
            : `\\cos(${poly([b, "y"])}) \\approx 1 - \\frac{${b * b}}{2}y^2`
          : `e^{s} \\approx 1 + s + \\frac{s^2}{2}, \\ s = ${poly([a, "x"], [b, "y"])}`;
        return numberProblem({
          prompt: t(
            `Find the coefficient of $${mono}$ in the second-degree Taylor polynomial of $f(x, y) = ${f}$ at $(0, 0)$.`,
            `求 $f(x, y) = ${f}$ 在 $(0, 0)$ 处的二阶泰勒多项式中 $${mono}$ 的系数。`,
          ),
          answer: coef,
          mistakes: distinct(coef, mistakes),
          solution: walked(
            [
              [["Find the derivative", "求导数"], t(`$${deriv}(0, 0) = ${dv.toLatex()}$.`, `$${deriv}(0, 0) = ${dv.toLatex()}$。`)],
              [
                ["Take the coefficient", "取系数"],
                mono === "xy"
                  ? t(
                      `The coefficient of $xy$ is $f_{xy}(0, 0)$ itself: $${coef.toLatex()}$.`,
                      `$xy$ 的系数就是 $f_{xy}(0, 0)$ 本身：$${coef.toLatex()}$。`,
                    )
                  : t(
                      `The coefficient is $\\frac{1}{2} \\cdot ${paren(dv)} = ${coef.toLatex()}$.`,
                      `系数为 $\\frac{1}{2} \\cdot ${paren(dv)} = ${coef.toLatex()}$。`,
                    ),
              ],
            ],
            t(
              `From the series $${series}$, the $${mono}$ term has coefficient $${coef.toLatex()}$ as well.`,
              `由级数 $${series}$，$${mono}$ 项的系数同样是 $${coef.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 2.12 Optimization
// ---------------------------------------------------------------------------

/** globalVsLocalExtremaAndCriticalPointsOfMultivariableFunctions finds critical points. */
export const globalVsLocalExtremaAndCriticalPointsOfMultivariableFunctions: TopicDef = {
  id: "global-vs-local-extrema-and-critical-points-of-multivariable-functions",
  title: t("Global vs. Local Extrema and Critical Points of Multivariable Functions", "多元函数的全局极值、局部极值与临界点"),
  summary: t(
    "A point (x0, y0) is a critical point of f(x, y) if ∇f(x0, y0) = 0 or if either partial derivative fails to exist.",
    "若 ∇f(x0, y0) = 0 或至少一个偏导数不存在，则点 (x0, y0) 为函数 f(x, y) 的临界点（驻点）。",
  ),
  intro: t(
    "For $f(x, y) = x^2 + y^3 - 48y$, setting $f_x = 2x = 0$ and $f_y = 3y^2 - 48 = 0$ gives the critical points $(0, 4)$ and $(0, -4)$. Near $(0, 4)$ the function is lowest at that point, with $f(0, 4) = 64 - 192 = -128$, so it is a local minimum.\n\nCheck: $f(0, -10) = -1000 + 480 = -520$ is lower than $-128$, so the local minimum is not a global one; along the $y$-axis, $y^3$ sends $f$ down without bound.\n\nIn this lesson we find critical points by setting the gradient to zero, and tell local extrema from global ones.",
    "对 $f(x, y) = x^2 + y^3 - 48y$，令 $f_x = 2x = 0$，$f_y = 3y^2 - 48 = 0$，得临界点 $(0, 4)$ 和 $(0, -4)$。在 $(0, 4)$ 附近，函数在该点最小，$f(0, 4) = 64 - 192 = -128$，所以它是局部最小值点。\n\n检验：$f(0, -10) = -1000 + 480 = -520$ 比 $-128$ 更小，所以这个局部最小值不是全局最小值；沿 $y$ 轴，$y^3$ 使 $f$ 无限下降。\n\n本课我们令梯度为零来求临界点，并区分局部极值与全局极值。",
  ),
  prerequisites: ["the-gradient-vector"],
  encompasses: [{ topic: "the-gradient-vector", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "finding-critical-points-of-surfaces",
      title: t("Finding critical points of surfaces", "求曲面的临界点"),
      explanation: t(
        "To find the critical points of a differentiable function $f(x, y)$, solve the system of equations setting both partial derivatives to zero:\n\n$$\\begin{cases} f_x(x, y) = 0 \\\\ f_y(x, y) = 0 \\end{cases}$$\n\nFor $f = 5x^2 - 30x + y^2 + 4y$, $f_x = 10x - 30 = 0$ gives $x = 3$ and $f_y = 2y + 4 = 0$ gives $y = -2$, so the critical point is $(3, -2)$.\n\n> **Watch out.** Solving $2ax + d = 0$ gives $x = -\\frac{d}{2a}$: keep the minus sign and divide by $2a$, not by $a$.",
        "求可微函数 $f(x, y)$ 的临界点，需联立求解令一阶偏导数均为零的方程组：\n\n$$\\begin{cases} f_x(x, y) = 0 \\\\ f_y(x, y) = 0 \\end{cases}$$\n\n对 $f = 5x^2 - 30x + y^2 + 4y$，由 $f_x = 10x - 30 = 0$ 得 $x = 3$，由 $f_y = 2y + 4 = 0$ 得 $y = -2$，所以临界点是 $(3, -2)$。\n\n> **注意。** 解 $2ax + d = 0$ 得 $x = -\\frac{d}{2a}$：保留负号，并除以 $2a$，而不是 $a$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        let x0 = rng.int(-3, 3);
        const y0 = rng.int(-3, 3);
        if (x0 === 0 && y0 === 0) {
          x0 = rng.pick([-1, 1]);
        }
        const cTerm = -2 * a * x0;
        const dTerm = -2 * b * y0;
        const shift = -(a * x0 * x0 + b * y0 * y0);
        const sq = (k: number, v: string, at: number) =>
          `${k === 1 ? "" : k === -1 ? "-" : k}${at === 0 ? `${v}^2` : `(${v} ${at > 0 ? "-" : "+"} ${Math.abs(at)})^2`}`;
        const squares = `${sq(a, "x", x0)} ${b < 0 ? "-" : "+"} ${sq(Math.abs(b), "y", y0)}${shift === 0 ? "" : ` ${shift > 0 ? "+" : "-"} ${Math.abs(shift)}`}`;
        const mistakes: [number[], string, string][] = [
          [
            [-x0 || 0, -y0 || 0],
            "The signs are flipped: $2ax + d = 0$ gives $x = -\\frac{d}{2a}$.",
            "符号反了：由 $2ax + d = 0$ 得 $x = -\\frac{d}{2a}$。",
          ],
          [
            [2 * x0, 2 * y0],
            "Each linear coefficient must be divided by $2a$ or $2b$, the coefficient in $f_x$ or $f_y$, not by $a$ or $b$.",
            "每个一次项系数要除以 $f_x$ 或 $f_y$ 中的系数 $2a$ 或 $2b$，而不是 $a$ 或 $b$。",
          ],
        ];
        if (x0 !== y0)
          mistakes.push([[y0, x0], "The coordinates are swapped; $f_x = 0$ gives $x$.", "两个坐标对调了；由 $f_x = 0$ 得到的是 $x$。"]);
        return pointWith(
          {
            prompt: t(
              `Find the critical point $(x, y)$ of the function $f(x, y) = ${poly([a, "x^2"], [b, "y^2"], [cTerm, "x"], [dTerm, "y"])}$ by solving $\\nabla f(x, y) = \\mathbf{0}$. Express your answer as a point $(x, y)$.`,
              `通过求解 $\\nabla f(x, y) = \\mathbf{0}$，求函数 $f(x, y) = ${poly([a, "x^2"], [b, "y^2"], [cTerm, "x"], [dTerm, "y"])}$ 的临界点 $(x, y)$。结果以点 $(x, y)$ 表示。`,
            ),
            answer: [x0, y0],
            vars: ["x", "y"],
            solution: walked(
              [
                [
                  ["Set f_x to zero", "令 f_x 为零"],
                  t(
                    `$f_x = ${poly([2 * a, "x"], [cTerm, ""])} = 0$ gives $x = ${x0}$.`,
                    `由 $f_x = ${poly([2 * a, "x"], [cTerm, ""])} = 0$ 得 $x = ${x0}$。`,
                  ),
                ],
                [
                  ["Set f_y to zero", "令 f_y 为零"],
                  t(
                    `$f_y = ${poly([2 * b, "y"], [dTerm, ""])} = 0$ gives $y = ${y0}$, so the critical point is $(${x0}, ${y0})$.`,
                    `由 $f_y = ${poly([2 * b, "y"], [dTerm, ""])} = 0$ 得 $y = ${y0}$，所以临界点是 $(${x0}, ${y0})$。`,
                  ),
                ],
              ],
              t(
                `Completing the squares, $f = ${squares}$, whose squares vanish exactly at $(${x0}, ${y0})$.`,
                `配方得 $f = ${squares}$，其中的平方项恰在 $(${x0}, ${y0})$ 处为零。`,
              ),
            ),
          },
          mistakes,
        );
      },
    },
    {
      id: "a-local-minimum-that-is-not-global",
      title: t("A local minimum that is not global", "不是全局最小值的局部最小值"),
      explanation: t(
        "A local minimum is lower than all nearby values, but the function may still go lower far away. For $f(x, y) = x^3 - 3k^2x + y^2 + c$ with $k > 0$, the critical points are $(\\pm k, 0)$. At $(k, 0)$, $f_{xx} = 6k > 0$ and $f_{yy} = 2 > 0$ with $f_{xy} = 0$, so it is a local minimum with value $c - 2k^3$. It is not global: along $y = 0$, $x^3$ makes $f \\to -\\infty$ as $x \\to -\\infty$. For $x^3 - 75x + y^2 + 3$, $k = 5$ and the local minimum value is $3 - 250 = -247$.\n\n> **Watch out.** At $(-k, 0)$, $f_{xx} = -6k$ is negative while $f_{yy} = 2$ is positive, so that point is a saddle, not the minimum. And the value $f(k, 0) = k^3 - 3k^3 + c$ keeps the $k^3$ from $x^3$.",
        "局部最小值比附近所有的值都小，但函数在远处仍可能更小。对 $k > 0$ 的 $f(x, y) = x^3 - 3k^2x + y^2 + c$，临界点为 $(\\pm k, 0)$。在 $(k, 0)$ 处 $f_{xx} = 6k > 0$，$f_{yy} = 2 > 0$，$f_{xy} = 0$，所以它是局部最小值点，值为 $c - 2k^3$。它不是全局最小值：沿 $y = 0$，当 $x \\to -\\infty$ 时 $x^3$ 使 $f \\to -\\infty$。对 $x^3 - 75x + y^2 + 3$，$k = 5$，局部最小值为 $3 - 250 = -247$。\n\n> **注意。** 在 $(-k, 0)$ 处，$f_{xx} = -6k$ 为负而 $f_{yy} = 2$ 为正，所以那是鞍点，不是最小值点。函数值 $f(k, 0) = k^3 - 3k^3 + c$ 中要保留来自 $x^3$ 的 $k^3$。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(1, 4);
        const c = rng.int(-9, 9);
        const ans = c - 2 * k ** 3;
        const cs = c === 0 ? "" : ` ${c < 0 ? "-" : "+"} ${Math.abs(c)}`;
        return numberProblem({
          prompt: t(
            `Find the local minimum value of $f(x, y) = ${poly([1, "x^3"], [-3 * k * k, "x"], [1, "y^2"], [c, ""])}$.`,
            `求 $f(x, y) = ${poly([1, "x^3"], [-3 * k * k, "x"], [1, "y^2"], [c, ""])}$ 的局部最小值。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              c + 2 * k ** 3,
              `That is $f(${-k}, 0)$, but $(${-k}, 0)$ is a saddle: $f_{xx} = ${-6 * k} < 0$ there while $f_{yy} = 2 > 0$.`,
              `那是 $f(${-k}, 0)$，但 $(${-k}, 0)$ 是鞍点：那里 $f_{xx} = ${-6 * k} < 0$ 而 $f_{yy} = 2 > 0$。`,
            ),
            why(c, "That is $f(0, 0)$, and the origin is not a critical point.", "那是 $f(0, 0)$，而原点不是临界点。"),
            why(c - 3 * k ** 3, `The term $x^3$ contributes $${k ** 3}$ at $x = ${k}$.`, `在 $x = ${k}$ 处，$x^3$ 项贡献 $${k ** 3}$。`),
          ]),
          solution: walked(
            [
              [
                ["Find the critical points", "求临界点"],
                t(
                  `$f_x = 3x^2 - ${3 * k * k} = 0$ and $f_y = 2y = 0$ give $(\\pm ${k}, 0)$.`,
                  `由 $f_x = 3x^2 - ${3 * k * k} = 0$，$f_y = 2y = 0$ 得 $(\\pm ${k}, 0)$。`,
                ),
              ],
              [
                ["Pick the minimum", "选出最小值点"],
                t(
                  `At $(${k}, 0)$, $f_{xx} = ${6 * k} > 0$, $f_{yy} = 2$ and $f_{xy} = 0$, so it is a local minimum with $f(${k}, 0) = ${k ** 3} - ${3 * k ** 3}${cs} = ${ans}$.`,
                  `在 $(${k}, 0)$ 处，$f_{xx} = ${6 * k} > 0$，$f_{yy} = 2$，$f_{xy} = 0$，所以它是局部最小值点，$f(${k}, 0) = ${k ** 3} - ${3 * k ** 3}${cs} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `It is only local: $f(${-3 * k}, 0) = ${-27 * k ** 3} + ${9 * k ** 3}${cs} = ${c - 18 * k ** 3}$ is lower, as $x^3$ dominates for large negative $x$.`,
              `它只是局部的：$f(${-3 * k}, 0) = ${-27 * k ** 3} + ${9 * k ** 3}${cs} = ${c - 18 * k ** 3}$ 更小，因为 $x$ 很负时 $x^3$ 起主导作用。`,
            ),
          ),
        });
      },
    },
  ],
};

/** theSecondPartialDerivativesTest classifies critical points using the Hessian discriminant D. */
export const theSecondPartialDerivativesTest: TopicDef = {
  id: "the-second-partial-derivatives-test",
  title: t("The Second Partial Derivatives Test", "二阶偏导数极值判别法"),
  summary: t(
    "The second partial derivatives test classifies critical points using D = fxx fyy - (fxy)²: local minimum if D > 0 and fxx > 0, local maximum if D > 0 and fxx < 0, saddle point if D < 0.",
    "二阶偏导数判别法利用判别式 D = fxx fyy - (fxy)² 分类临界点：若 D > 0 且 fxx > 0 为局部极小值；若 D > 0 且 fxx < 0 为局部极大值；若 D < 0 为鞍点。",
  ),
  intro: t(
    "The function $f(x, y) = x^3 + y^3 - 3xy$ has a critical point at $(1, 1)$, where $f_x = 3x^2 - 3y$ and $f_y = 3y^2 - 3x$ both vanish. There $f_{xx} = 6$, $f_{yy} = 6$ and $f_{xy} = -3$, so $D = 36 - 9 = 27 > 0$ with $f_{xx} > 0$: a local minimum.\n\nCheck: $f(1, 1) = -1$, while the nearby values $f(1.1, 1) = -0.969$ and $f(1, 0.9) = -0.971$ are both higher.\n\nIn this lesson we use the discriminant $D$ to classify critical points as minima, maxima or saddle points, and recognize when the test says nothing.",
    "函数 $f(x, y) = x^3 + y^3 - 3xy$ 在 $(1, 1)$ 处有临界点，那里 $f_x = 3x^2 - 3y$ 和 $f_y = 3y^2 - 3x$ 都为零。该点 $f_{xx} = 6$，$f_{yy} = 6$，$f_{xy} = -3$，所以 $D = 36 - 9 = 27 > 0$ 且 $f_{xx} > 0$：局部极小值点。\n\n检验：$f(1, 1) = -1$，而附近的值 $f(1.1, 1) = -0.969$ 和 $f(1, 0.9) = -0.971$ 都更大。\n\n本课我们用判别式 $D$ 把临界点分为极小值点、极大值点或鞍点，并认识检验失效的情形。",
  ),
  prerequisites: [
    "global-vs-local-extrema-and-critical-points-of-multivariable-functions",
    "the-second-derivative-of-a-multivariable-function",
  ],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "classifying-critical-points-using-discriminant",
      title: t("Classifying critical points using the discriminant", "利用二阶判别式分类临界点"),
      explanation: t(
        "Let $(a, b)$ be a critical point with continuous second partials. Let $D = f_{xx}(a, b)f_{yy}(a, b) - [f_{xy}(a, b)]^2$:\n\n1. If $D > 0$ and $f_{xx}(a, b) > 0$, then $f(a, b)$ is a **local minimum**.\n2. If $D > 0$ and $f_{xx}(a, b) < 0$, then $f(a, b)$ is a **local maximum**.\n3. If $D < 0$, then $(a, b)$ is a **saddle point**.\n4. If $D = 0$, the test is **inconclusive**.\n\nFor $f = 5x^2 - 6y^2$ at the origin, $D = 10 \\cdot (-12) - 0 = -120 < 0$, so the origin is a saddle point even though $f_{xx} > 0$.\n\n> **Watch out.** A positive $D$ alone does not say minimum or maximum; the sign of $f_{xx}$ decides. A negative $D$ means a saddle whatever the sign of $f_{xx}$.",
        "设 $(a, b)$ 为具有连续二阶偏导数的临界点，令 $D = f_{xx}(a, b)f_{yy}(a, b) - [f_{xy}(a, b)]^2$：\n\n1. 若 $D > 0$ 且 $f_{xx}(a, b) > 0$，则该点为**局部极小点**。\n2. 若 $D > 0$ 且 $f_{xx}(a, b) < 0$，则该点为**局部极大点**。\n3. 若 $D < 0$，则该点为**鞍点**。\n4. 若 $D = 0$，判别法**失效**（无法判定）。\n\n对 $f = 5x^2 - 6y^2$ 在原点处，$D = 10 \\cdot (-12) - 0 = -120 < 0$，所以尽管 $f_{xx} > 0$，原点仍是鞍点。\n\n> **注意。** 仅凭 $D$ 为正还不能判断是极小还是极大，要由 $f_{xx}$ 的符号决定。$D$ 为负就是鞍点，与 $f_{xx}$ 的符号无关。",
      ),
      generate(rng: Rng): Problem {
        const kind = rng.int(0, 2);
        const a = kind === 1 ? -rng.int(1, 4) : rng.int(1, 4);
        const b = kind === 0 ? rng.int(1, 4) : -rng.int(1, 4);
        const D = 4 * a * b;
        const names = [
          t("Local minimum", "局部极小值点"),
          t("Local maximum", "局部极大值点"),
          t("Saddle point", "鞍点"),
          t("Inconclusive", "无法判定"),
        ];
        const reason = (i: number): Text => {
          if (i === 3) return t(`$D = ${D}$ is not zero, so the test gives a verdict.`, `$D = ${D}$ 不为零，所以检验能给出结论。`);
          if (kind === 2)
            return i === 0
              ? t(
                  `$D = ${D} < 0$ means a saddle even though $f_{xx} = ${2 * a} > 0$.`,
                  `$D = ${D} < 0$ 意味着鞍点，尽管 $f_{xx} = ${2 * a} > 0$。`,
                )
              : t(`$D = ${D} < 0$ means a saddle; along the $x$-axis $f$ rises.`, `$D = ${D} < 0$ 意味着鞍点；沿 $x$ 轴 $f$ 是上升的。`);
          if (i === 2) return t(`$D = ${D} > 0$ rules out a saddle.`, `$D = ${D} > 0$ 排除了鞍点。`);
          return kind === 0
            ? t(
                `$f_{xx} = ${2 * a} > 0$, so the surface bends upward: a minimum, not a maximum.`,
                `$f_{xx} = ${2 * a} > 0$，曲面向上弯：是极小值点，不是极大值点。`,
              )
            : t(
                `$f_{xx} = ${2 * a} < 0$, so the surface bends downward: a maximum, not a minimum.`,
                `$f_{xx} = ${2 * a} < 0$，曲面向下弯：是极大值点，不是极小值点。`,
              );
        };
        const verdict =
          kind === 0
            ? t(
                `$D = ${D} > 0$ and $f_{xx} = ${2 * a} > 0$, so the origin is a local minimum.`,
                `$D = ${D} > 0$ 且 $f_{xx} = ${2 * a} > 0$，所以原点是局部极小点。`,
              )
            : kind === 1
              ? t(
                  `$D = ${D} > 0$ and $f_{xx} = ${2 * a} < 0$, so the origin is a local maximum.`,
                  `$D = ${D} > 0$ 且 $f_{xx} = ${2 * a} < 0$，所以原点是局部极大点。`,
                )
              : t(`$D = ${D} < 0$, so the origin is a saddle point.`, `$D = ${D} < 0$，所以原点是鞍点。`);
        const sign = (v: number) => (v > 0 ? ["positive", "正"] : ["negative", "负"]);
        return explainedChoice(rng, {
          prompt: t(
            `At the origin $(0, 0)$, the function $f(x, y) = ${poly([a, "x^2"], [b, "y^2"])}$ has a critical point. Use the second partial derivatives test to classify this critical point.`,
            `函数 $f(x, y) = ${poly([a, "x^2"], [b, "y^2"])}$ 在原点 $(0, 0)$ 处有一个临界点。使用二阶偏导数判别法对该临界点进行分类。`,
          ),
          correct: names[kind] as Text,
          wrong: [0, 1, 2, 3].filter((i) => i !== kind).map((i) => ({ option: names[i] as Text, why: reason(i) })),
          solution: walked(
            [
              [
                ["Find the discriminant", "求判别式"],
                t(
                  `$f_{xx} = ${2 * a}$, $f_{yy} = ${2 * b}$, $f_{xy} = 0$, so $D = ${2 * a} \\cdot ${paren(2 * b)} - 0 = ${D}$.`,
                  `$f_{xx} = ${2 * a}$，$f_{yy} = ${2 * b}$，$f_{xy} = 0$，所以 $D = ${2 * a} \\cdot ${paren(2 * b)} - 0 = ${D}$。`,
                ),
              ],
              [["Apply the test", "应用判别法"], verdict],
            ],
            t(
              `Along the axes, $f(t, 0) = ${poly([a, "t^2"])}$ is ${sign(a)[0]} and $f(0, t) = ${poly([b, "t^2"])}$ is ${sign(b)[0]} for $t \\ne 0$, which matches.`,
              `沿坐标轴，$t \\ne 0$ 时 $f(t, 0) = ${poly([a, "t^2"])}$ 为${sign(a)[1]}，$f(0, t) = ${poly([b, "t^2"])}$ 为${sign(b)[1]}，与结论一致。`,
            ),
          ),
        });
      },
    },
    {
      id: "classifying-the-origin-for-a-quadratic-form",
      title: t("Classifying the origin for a quadratic form", "判断二次型在原点的类型"),
      explanation: t(
        "For $f(x, y) = ax^2 + bxy + cy^2$ the origin is a critical point with $f_{xx} = 2a$, $f_{xy} = b$, $f_{yy} = 2c$, so the discriminant is\n\n$$D = f_{xx}f_{yy} - f_{xy}^2 = 4ac - b^2.$$\n\nIf $D > 0$ the origin is a local minimum when $a > 0$ and a local maximum when $a < 0$; if $D < 0$ it is a saddle point; if $D = 0$ the test is inconclusive. For $f = 2x^2 + 7xy + 5y^2$, $D = 40 - 49 = -9$, so the origin is a saddle point although $a$ and $c$ are both positive.\n\n> **Watch out.** The discriminant is $4ac - b^2$, not $ac - b^2$: the diagonal entries are $2a$ and $2c$. When $D = 0$ the test gives no answer at all.",
        "对 $f(x, y) = ax^2 + bxy + cy^2$，原点是临界点，且 $f_{xx} = 2a$，$f_{xy} = b$，$f_{yy} = 2c$，所以判别式为\n\n$$D = f_{xx}f_{yy} - f_{xy}^2 = 4ac - b^2.$$\n\n若 $D > 0$，当 $a > 0$ 时原点是局部最小值点，当 $a < 0$ 时是局部最大值点；若 $D < 0$，它是鞍点；若 $D = 0$，检验无法判定。对 $f = 2x^2 + 7xy + 5y^2$，$D = 40 - 49 = -9$，所以尽管 $a$ 和 $c$ 都为正，原点仍是鞍点。\n\n> **注意。** 判别式是 $4ac - b^2$，不是 $ac - b^2$：对角元素是 $2a$ 和 $2c$。$D = 0$ 时检验给不出任何结论。",
      ),
      generate(rng: Rng): Problem {
        const kind = rng.int(0, 3);
        let a: number;
        let b: number;
        let c: number;
        if (kind === 3) {
          const m = rng.int(1, 3);
          const n = rng.int(1, 3);
          const s = rng.pick([-1, 1]);
          a = m * m * s;
          b = 2 * m * n * rng.pick([-1, 1]) * s;
          c = n * n * s;
        } else {
          a = rng.int(1, 4);
          c = rng.int(1, 4);
          const bs = [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((v) =>
            kind === 2 ? v * v > 4 * a * c : v * v < 4 * a * c,
          );
          b = rng.pick(bs);
          if (kind === 1) [a, b, c] = [-a, -b, -c];
          if (kind === 2 && rng.int(0, 1) === 1) [a, c] = [-a, c];
        }
        const D = 4 * a * c - b * b;
        const names = [
          t("Local minimum", "局部最小值点"),
          t("Local maximum", "局部最大值点"),
          t("Saddle point", "鞍点"),
          t("The test is inconclusive", "检验无法判定"),
        ];
        const right = names[kind] ?? names[0]!;
        const reason = (i: number): Text => {
          if (kind === 3)
            return i === 2
              ? t("$D = 0$ is not negative; with $D = 0$ the test gives no verdict.", "$D = 0$ 不是负数；$D = 0$ 时检验给不出结论。")
              : t(
                  `With $D = 0$ the test gives no verdict, whatever the sign of $a = ${a}$.`,
                  `$D = 0$ 时，无论 $a = ${a}$ 的符号如何，检验都给不出结论。`,
                );
          if (i === 3) return t(`$D = ${D}$ is not zero, so the test decides.`, `$D = ${D}$ 不为零，所以检验能作出判断。`);
          if (kind === 2)
            return t(
              `$D = ${D} < 0$ means a saddle, whatever the signs of $a$ and $c$.`,
              `$D = ${D} < 0$ 意味着鞍点，与 $a$、$c$ 的符号无关。`,
            );
          if (i === 2) return t(`$D = ${D} > 0$ rules out a saddle.`, `$D = ${D} > 0$ 排除了鞍点。`);
          return kind === 0
            ? t(`$f_{xx} = ${2 * a} > 0$, so it is a minimum, not a maximum.`, `$f_{xx} = ${2 * a} > 0$，所以是最小值点，不是最大值点。`)
            : t(`$f_{xx} = ${2 * a} < 0$, so it is a maximum, not a minimum.`, `$f_{xx} = ${2 * a} < 0$，所以是最大值点，不是最小值点。`);
        };
        const fAt = a * D;
        const check =
          kind === 3
            ? t(
                `$f(${-b}, ${2 * a}) = a \\cdot D = 0$, so $f$ vanishes along a whole line through the origin; the second derivatives cannot see what happens beyond that.`,
                `$f(${-b}, ${2 * a}) = a \\cdot D = 0$，所以 $f$ 沿一整条过原点的直线为零；二阶导数看不出更多。`,
              )
            : kind === 2
              ? t(
                  `$f(1, 0) = ${a}$ and $f(${-b}, ${2 * a}) = a \\cdot D = ${fAt}$ have opposite signs, so $f$ takes both signs near the origin.`,
                  `$f(1, 0) = ${a}$ 与 $f(${-b}, ${2 * a}) = a \\cdot D = ${fAt}$ 异号，所以 $f$ 在原点附近正负都取。`,
                )
              : t(
                  `$f(1, 0) = ${a}$, $f(0, 1) = ${c}$ and $f(${-b}, ${2 * a}) = a \\cdot D = ${fAt}$ all have the sign of $a$, as they do near a ${kind === 0 ? "minimum" : "maximum"}.`,
                  `$f(1, 0) = ${a}$，$f(0, 1) = ${c}$，$f(${-b}, ${2 * a}) = a \\cdot D = ${fAt}$ 都与 $a$ 同号，正如在${kind === 0 ? "最小值点" : "最大值点"}附近那样。`,
                );
        return explainedChoice(rng, {
          prompt: t(
            `Use the second partials test to classify the critical point $(0, 0)$ of $f(x, y) = ${poly([a, "x^2"], [b, "xy"], [c, "y^2"])}$.`,
            `用二阶偏导数检验判断 $f(x, y) = ${poly([a, "x^2"], [b, "xy"], [c, "y^2"])}$ 的临界点 $(0, 0)$ 的类型。`,
          ),
          correct: right,
          wrong: [0, 1, 2, 3].filter((i) => i !== kind).map((i) => ({ option: names[i] as Text, why: reason(i) })),
          solution: walked(
            [
              [
                ["Find the discriminant", "求判别式"],
                t(
                  `$D = 4 \\cdot ${paren(a)} \\cdot ${paren(c)} - ${paren(b)}^2 = ${D}$.`,
                  `$D = 4 \\cdot ${paren(a)} \\cdot ${paren(c)} - ${paren(b)}^2 = ${D}$。`,
                ),
              ],
              [
                ["Apply the test", "应用检验"],
                t(
                  `${D > 0 ? `With $f_{xx} = ${2 * a}$, ` : ""}the answer is: ${right.en.toLowerCase()}.`,
                  `${D > 0 ? `由 $f_{xx} = ${2 * a}$，` : ""}答案是：${right["zh-CN"]}。`,
                ),
              ],
            ],
            check,
          ),
        });
      },
    },
  ],
};

/** calculatingGlobalExtremaOfMultivariableFunctions finds extrema on compact regions. */
export const calculatingGlobalExtremaOfMultivariableFunctions: TopicDef = {
  id: "calculating-global-extrema-of-multivariable-functions",
  title: t("Calculating Global Extrema of Multivariable Functions", "计算多元函数的全局极值"),
  summary: t(
    "To find the global extrema of a continuous function on a closed and bounded set, compare values at interior critical points and along the boundary.",
    "求有界闭集上连续函数的全局极值，需比较内部所有临界点处及边界上的函数值。",
  ),
  intro: t(
    "Find the extremes of $f(x, y) = x^2 + y^2 - 4x$ on the disk $x^2 + y^2 \\le 9$. Inside, $\\nabla f = (2x - 4, 2y) = \\mathbf{0}$ at $(2, 0)$, where $f = -4$. On the circle $x^2 + y^2 = 9$, $f = 9 - 4x$ with $-3 \\le x \\le 3$, which runs from $-3$ at $x = 3$ to $21$ at $x = -3$. Comparing, the global minimum is $-4$ and the global maximum is $21$.\n\nCheck: $f(-3, 0) = 9 + 12 = 21$, and $f = (x - 2)^2 + y^2 - 4 \\ge -4$ everywhere, with equality only at $(2, 0)$.\n\nIn this lesson we find global extrema on closed, bounded regions by comparing interior critical points with the boundary.",
    "求 $f(x, y) = x^2 + y^2 - 4x$ 在圆盘 $x^2 + y^2 \\le 9$ 上的最值。在内部，$\\nabla f = (2x - 4, 2y) = \\mathbf{0}$ 于 $(2, 0)$，那里 $f = -4$。在圆 $x^2 + y^2 = 9$ 上，$f = 9 - 4x$，$-3 \\le x \\le 3$，其值从 $x = 3$ 处的 $-3$ 到 $x = -3$ 处的 $21$。比较可知，全局最小值为 $-4$，全局最大值为 $21$。\n\n检验：$f(-3, 0) = 9 + 12 = 21$，且处处 $f = (x - 2)^2 + y^2 - 4 \\ge -4$，仅在 $(2, 0)$ 处取等号。\n\n本课我们比较内部临界点与边界上的值，求有界闭区域上的全局极值。",
  ),
  prerequisites: ["the-second-partial-derivatives-test"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "finding-global-maximum-on-disks",
      title: t("Finding global maximum on disks", "在闭圆盘上求全局最大值"),
      explanation: t(
        "By the Extreme Value Theorem, a continuous function $f(x, y)$ on a closed bounded set $D$ attains both a global maximum and minimum. Check values at all interior critical points and parameterize the boundary $\\partial D$. For $f = 20 - 3x^2 - 3y^2$ on $x^2 + y^2 \\le 49$, the only critical point is $(0, 0)$ with $f = 20$, and on the boundary $f = 20 - 3 \\cdot 49 = -127$; so the maximum is $20$ and the minimum is $-127$.\n\n> **Watch out.** The boundary value is the smallest here, not the largest: compare the values before naming the maximum, and keep the minus sign in front of the squares.",
        "由极值定理，有界闭集 $D$ 上的连续函数 $f(x, y)$ 必能取得全局最大值与最小值。需检验内部所有临界点处的取值，并对边界 $\\partial D$ 参数化求极值。对 $x^2 + y^2 \\le 49$ 上的 $f = 20 - 3x^2 - 3y^2$，唯一的临界点是 $(0, 0)$，$f = 20$；边界上 $f = 20 - 3 \\cdot 49 = -127$；所以最大值为 $20$，最小值为 $-127$。\n\n> **注意。** 这里边界上的值是最小的，不是最大的：先比较各值再判断最大值，并保留平方项前的负号。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 4);
        const R = rng.int(2, 6);
        const cVal = rng.int(1, 10);
        const ans = cVal;
        const edge = cVal - a * R * R;
        return numberProblem({
          prompt: t(
            `Find the global maximum value of the function $f(x, y) = ${poly([cVal, ""], [-a, "x^2"], [-a, "y^2"])}$ on the closed disk $D = \\left\\{(x, y) : x^2 + y^2 \\le ${R * R}\\right\\}$.`,
            `求函数 $f(x, y) = ${poly([cVal, ""], [-a, "x^2"], [-a, "y^2"])}$ 在闭圆盘 $D = \\left\\{(x, y) : x^2 + y^2 \\le ${R * R}\\right\\}$ 上的全局最大值。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(edge, "That is the value on the boundary circle, which is the global minimum.", "那是边界圆上的值，是全局最小值。"),
            why(
              cVal + a * R * R,
              `The squares enter with a minus sign: on the boundary $f = ${cVal} - ${a === 1 ? "" : a}(x^2 + y^2)$, and that is not the maximum anyway.`,
              `平方项前是负号：边界上 $f = ${cVal} - ${a === 1 ? "" : a}(x^2 + y^2)$，而且那也不是最大值。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the interior critical point", "求内部临界点"],
                t(
                  `$\\nabla f = (${-2 * a}x, ${-2 * a}y) = \\mathbf{0}$ only at $(0, 0)$, where $f(0, 0) = ${cVal}$.`,
                  `$\\nabla f = (${-2 * a}x, ${-2 * a}y) = \\mathbf{0}$ 仅在 $(0, 0)$ 处成立，$f(0, 0) = ${cVal}$。`,
                ),
              ],
              [
                ["Check the boundary", "检查边界"],
                t(
                  `On $x^2 + y^2 = ${R * R}$, $f = ${cVal} - ${a} \\cdot ${R * R} = ${edge}$. The larger value is $${ans}$.`,
                  `在 $x^2 + y^2 = ${R * R}$ 上，$f = ${cVal} - ${a} \\cdot ${R * R} = ${edge}$。较大的值是 $${ans}$。`,
                ),
              ],
            ],
            t(
              `Since $x^2 + y^2 \\ge 0$, $f \\le ${cVal}$ everywhere, with equality at the origin.`,
              `由于 $x^2 + y^2 \\ge 0$，处处 $f \\le ${cVal}$，在原点处取等号。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-maximum-distance-on-a-square",
      title: t("The maximum distance on a square", "正方形上的最大距离"),
      explanation: t(
        "A continuous function on a closed, bounded region attains a global maximum, either at a critical point inside or on the boundary. The function $f(x, y) = (x - p)^2 + (y - q)^2$ is the squared distance to $(p, q)$; its only critical point is the minimum at $(p, q)$. So on a square its maximum is on the boundary, at the corner farthest from $(p, q)$. For $f = (x - 2)^2 + (y + 1)^2$ on $-6 \\le x, y \\le 6$, the farthest corner is $(-6, 6)$ and the maximum is $8^2 + 7^2 = 113$.\n\n> **Watch out.** The farthest corner is on the opposite side from $(p, q)$ in each coordinate, so each distance is $L + |p|$ or $L + |q|$, not $L - |p|$.",
        "闭有界区域上的连续函数必取得全局最大值，要么在内部的临界点，要么在边界上。函数 $f(x, y) = (x - p)^2 + (y - q)^2$ 是到 $(p, q)$ 的距离的平方；其唯一的临界点是 $(p, q)$ 处的最小值点。所以它在正方形上的最大值在边界上，位于离 $(p, q)$ 最远的顶点。对 $-6 \\le x, y \\le 6$ 上的 $f = (x - 2)^2 + (y + 1)^2$，最远的顶点是 $(-6, 6)$，最大值为 $8^2 + 7^2 = 113$。\n\n> **注意。** 最远的顶点在每个坐标上都位于 $(p, q)$ 的另一侧，所以每个距离是 $L + |p|$ 或 $L + |q|$，而不是 $L - |p|$。",
      ),
      generate(rng: Rng): Problem {
        const L = rng.int(1, 5);
        const p = rng.int(-L + 1, L - 1);
        let q = rng.int(-L, L);
        if (p === 0 && q === 0) q = 1;
        const dx = L + Math.abs(p);
        const dy = L + Math.abs(q);
        const ans = dx * dx + dy * dy;
        const cx = p > 0 ? -L : L;
        const cy = q > 0 ? -L : L;
        const fx = p === 0 ? "x^2" : `(${poly([1, "x"], [-p, ""])})^2`;
        const fy = q === 0 ? "y^2" : `(${poly([1, "y"], [-q, ""])})^2`;
        const other = (L - Math.abs(p)) ** 2 + dy * dy;
        return numberProblem({
          prompt: t(
            `Find the maximum value of $f(x, y) = ${fx} + ${fy}$ on the square $-${L} \\le x \\le ${L}$, $-${L} \\le y \\le ${L}$.`,
            `求 $f(x, y) = ${fx} + ${fy}$ 在正方形 $-${L} \\le x \\le ${L}$，$-${L} \\le y \\le ${L}$ 上的最大值。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(0, `That is the minimum, at the critical point $(${p}, ${q})$.`, `那是最小值，在临界点 $(${p}, ${q})$ 处取得。`),
            why(
              (L - Math.abs(p)) ** 2 + (L - Math.abs(q)) ** 2,
              "That is the nearest corner; the maximum is at the corner farthest from the center of the circles.",
              "那是最近的顶点；最大值在离圆心最远的顶点处。",
            ),
            why(
              2 * L * L,
              `That is the squared distance from the origin to a corner; distances are measured from $(${p}, ${q})$.`,
              `那是原点到顶点距离的平方；距离应从 $(${p}, ${q})$ 量起。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Rule out the inside", "排除内部"],
                t(
                  `The only critical point is $(${p}, ${q})$, where $f = 0$, the minimum; so the maximum is on the boundary, at a corner.`,
                  `唯一的临界点是 $(${p}, ${q})$，那里 $f = 0$，是最小值；所以最大值在边界上，在某个顶点处。`,
                ),
              ],
              [
                ["Take the farthest corner", "取最远的顶点"],
                t(
                  `The corner $(${cx}, ${cy})$ is $${dx}$ and $${dy}$ away in each coordinate, so $f = ${dx * dx} + ${dy * dy} = ${ans}$.`,
                  `顶点 $(${cx}, ${cy})$ 在两个坐标上分别相距 $${dx}$ 和 $${dy}$，所以 $f = ${dx * dx} + ${dy * dy} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `The corner $(${-cx}, ${cy})$ gives only $${(L - Math.abs(p)) ** 2} + ${dy * dy} = ${other}$, which is not larger.`,
              `顶点 $(${-cx}, ${cy})$ 只给出 $${(L - Math.abs(p)) ** 2} + ${dy * dy} = ${other}$，并不更大。`,
            ),
          ),
        });
      },
    },
  ],
};

/** lagrangeMultipliersWithOneConstraint optimizes subject to g(x, y) = c using ∇f = λ∇g. */
export const lagrangeMultipliersWithOneConstraint: TopicDef = {
  id: "lagrange-multipliers-with-one-constraint",
  title: t("Lagrange Multipliers With One Constraint", "单约束拉格朗日乘数法"),
  summary: t(
    "The method of Lagrange multipliers optimizes f(x, y) subject to g(x, y) = k by solving ∇f = λ∇g and g(x, y) = k.",
    "拉格朗日乘数法通过求解 ∇f = λ∇g 与 g(x, y) = k 来寻找满足约束条件 g(x, y) = k 的函数 f(x, y) 的极值。",
  ),
  intro: t(
    "Maximize $f(x, y) = 2x + y$ on the circle $x^2 + y^2 = 5$. Setting $\\nabla f = \\lambda \\nabla g$ gives $(2, 1) = \\lambda(2x, 2y)$, so $x = \\frac{1}{\\lambda}$ and $y = \\frac{1}{2\\lambda}$. The constraint gives $\\frac{5}{4\\lambda^2} = 5$, so $\\lambda = \\pm\\frac{1}{2}$, and $\\lambda = \\frac{1}{2}$ gives the point $(2, 1)$ with $f = 5$.\n\nCheck: $(2, 1)$ is on the circle since $4 + 1 = 5$, and $\\lambda = -\\frac{1}{2}$ gives $(-2, -1)$ with $f = -5$, the minimum.\n\nIn this lesson we solve $\\nabla f = \\lambda \\nabla g$ together with the constraint to find extrema on a curve.",
    "在圆 $x^2 + y^2 = 5$ 上求 $f(x, y) = 2x + y$ 的最大值。令 $\\nabla f = \\lambda \\nabla g$，得 $(2, 1) = \\lambda(2x, 2y)$，所以 $x = \\frac{1}{\\lambda}$，$y = \\frac{1}{2\\lambda}$。由约束得 $\\frac{5}{4\\lambda^2} = 5$，所以 $\\lambda = \\pm\\frac{1}{2}$；$\\lambda = \\frac{1}{2}$ 给出点 $(2, 1)$，$f = 5$。\n\n检验：$4 + 1 = 5$，所以 $(2, 1)$ 在圆上；$\\lambda = -\\frac{1}{2}$ 给出 $(-2, -1)$，$f = -5$，是最小值。\n\n本课我们把 $\\nabla f = \\lambda \\nabla g$ 与约束联立，求曲线上的极值。",
  ),
  prerequisites: ["calculating-global-extrema-of-multivariable-functions", "the-gradient-as-a-normal-vector"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "optimizing-linear-functions-on-circles-using-lagrange",
      figure: multivariableDrawings3["lagrange-multipliers-with-one-constraint#optimizing-linear-functions-on-circles-using-lagrange"],
      title: t("Optimizing linear functions on circles using Lagrange", "利用拉格朗日法在圆上优化线性函数"),
      explanation: t(
        "At an extreme point on the constraint, the gradient of the function is parallel to the gradient of the constraint, which gives equations for the point. To find the maximum of $f(x, y) = ax + by$ subject to $x^2 + y^2 = r^2$, apply $\\nabla f = \\lambda \\nabla g$:\n\n$$\\langle a, b \\rangle = \\lambda \\langle 2x, 2y \\rangle \\implies \\text{Max value} = r\\sqrt{a^2 + b^2}.$$\n\nFor $f = x + 2y$ on $x^2 + y^2 = 20$, $r = 2\\sqrt{5}$ and $\\sqrt{a^2 + b^2} = \\sqrt{5}$, so the maximum is $10$, at $(2, 4)$.\n\n> **Watch out.** The constraint gives $r^2$, so take its square root for $r$; and the factor is $\\sqrt{a^2 + b^2}$, not $a^2 + b^2$.",
        "在约束上的极值点处，函数的梯度与约束的梯度平行，由此得到求该点的方程。在约束条件 $x^2 + y^2 = r^2$ 下求 $f(x, y) = ax + by$ 的最大值，应用 $\\nabla f = \\lambda \\nabla g$：\n\n$$\\langle a, b \\rangle = \\lambda \\langle 2x, 2y \\rangle \\implies \\text{最大值} = r\\sqrt{a^2 + b^2}$$\n\n对 $x^2 + y^2 = 20$ 上的 $f = x + 2y$，$r = 2\\sqrt{5}$，$\\sqrt{a^2 + b^2} = \\sqrt{5}$，所以最大值为 $10$，在 $(2, 4)$ 处取得。\n\n> **注意。** 约束给出的是 $r^2$，要开平方得 $r$；系数是 $\\sqrt{a^2 + b^2}$，不是 $a^2 + b^2$。",
      ),
      generate(rng: Rng): Problem {
        const [a, b, c] = rng.pick(pythagoreanTriples);
        const r = rng.int(1, 5);
        const ans = r * c;
        const x = Q.of(r * a, c);
        const y = Q.of(r * b, c);
        return numberProblem({
          prompt: t(
            `Use the method of Lagrange multipliers to find the maximum value of $f(x, y) = ${poly([a, "x"], [b, "y"])}$ subject to the constraint $x^2 + y^2 = ${r * r}$.`,
            `利用拉格朗日乘数法求函数 $f(x, y) = ${poly([a, "x"], [b, "y"])}$ 在约束条件 $x^2 + y^2 = ${r * r}$ 下的最大值。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              -ans,
              "That is the minimum, from the negative multiplier; the maximum takes the point in the direction of $(a, b)$.",
              "那是最小值，来自负的乘数；最大值取在 $(a, b)$ 方向上的点。",
            ),
            why(
              c,
              `That is $\\sqrt{${a * a + b * b}}$ alone; it still has to be multiplied by the radius $${r}$.`,
              `那只是 $\\sqrt{${a * a + b * b}}$；还要乘以半径 $${r}$。`,
            ),
            why(r * r * c, `$${r * r}$ is $r^2$; the radius is $${r}$.`, `$${r * r}$ 是 $r^2$；半径是 $${r}$。`),
            why(
              r * c * c,
              `$${c * c}$ is $a^2 + b^2$; the factor is its square root, $${c}$.`,
              `$${c * c}$ 是 $a^2 + b^2$；系数是它的平方根 $${c}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Set up the system", "列出方程组"],
                t(
                  `$\\langle ${a}, ${b} \\rangle = \\lambda \\langle 2x, 2y \\rangle$ gives $x = \\frac{${a}}{2\\lambda}$ and $y = \\frac{${b}}{2\\lambda}$.`,
                  `由 $\\langle ${a}, ${b} \\rangle = \\lambda \\langle 2x, 2y \\rangle$ 得 $x = \\frac{${a}}{2\\lambda}$，$y = \\frac{${b}}{2\\lambda}$。`,
                ),
              ],
              [
                ["Use the constraint", "代入约束"],
                t(
                  `$\\frac{${a * a + b * b}}{4\\lambda^2} = ${r * r}$, so $2\\lambda = \\pm\\frac{${c}}{${r}}$; the plus sign gives $(x, y) = (${x.toLatex()}, ${y.toLatex()})$.`,
                  `$\\frac{${a * a + b * b}}{4\\lambda^2} = ${r * r}$，所以 $2\\lambda = \\pm\\frac{${c}}{${r}}$；取正号得 $(x, y) = (${x.toLatex()}, ${y.toLatex()})$。`,
                ),
              ],
              [
                ["Evaluate", "求值"],
                t(
                  `$f = \\frac{${a * a + b * b}}{2\\lambda} = ${a * a + b * b} \\cdot \\frac{${r}}{${c}} = ${ans}$.`,
                  `$f = \\frac{${a * a + b * b}}{2\\lambda} = ${a * a + b * b} \\cdot \\frac{${r}}{${c}} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `The point is on the circle: $${x.mul(x).add(y.mul(y)).toLatex()} = ${r * r}$; and $${a}x + ${b}y = ${Q.of(r * (a * a + b * b), c).toLatex()} = ${ans}$.`,
              `该点在圆上：$${x.mul(x).add(y.mul(y)).toLatex()} = ${r * r}$；且 $${a}x + ${b}y = ${Q.of(r * (a * a + b * b), c).toLatex()} = ${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-closest-point-of-a-line-to-the-origin",
      title: t("The closest point of a line to the origin", "直线上离原点最近的点"),
      explanation: t(
        "To minimize $f = x^2 + y^2$ subject to $ax + by = c$, set $\\nabla f = \\lambda \\nabla g$: $2x = \\lambda a$ and $2y = \\lambda b$. So $(x, y)$ is a multiple of $(a, b)$, and the constraint gives $\\frac{\\lambda}{2}(a^2 + b^2) = c$. The minimum value is\n\n$$f_{\\min} = \\frac{c^2}{a^2 + b^2},$$\n\nthe square of the distance from the origin to the line. For $3x + y = 10$, the point is $(3, 1)$ and the minimum is $\\frac{100}{10} = 10$.\n\n> **Watch out.** The multiplier $t = \\frac{c}{a^2 + b^2}$ is not the minimum; the minimum is $t^2(a^2 + b^2) = \\frac{c^2}{a^2 + b^2}$.",
        "要在约束 $ax + by = c$ 下最小化 $f = x^2 + y^2$，令 $\\nabla f = \\lambda \\nabla g$：$2x = \\lambda a$，$2y = \\lambda b$。所以 $(x, y)$ 是 $(a, b)$ 的倍数，由约束得 $\\frac{\\lambda}{2}(a^2 + b^2) = c$。最小值为\n\n$$f_{\\min} = \\frac{c^2}{a^2 + b^2},$$\n\n即原点到该直线距离的平方。对 $3x + y = 10$，该点为 $(3, 1)$，最小值为 $\\frac{100}{10} = 10$。\n\n> **注意。** 倍数 $t = \\frac{c}{a^2 + b^2}$ 不是最小值；最小值是 $t^2(a^2 + b^2) = \\frac{c^2}{a^2 + b^2}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5) * rng.pick([-1, 1]);
        const b = rng.int(1, 5) * rng.pick([-1, 1]);
        const c = rng.int(1, 9) * rng.pick([-1, 1]);
        const n = a * a + b * b;
        const ans = Q.of(c * c, n);
        const k = Q.of(c, n);
        const px = k.mul(Q.of(a));
        const py = k.mul(Q.of(b));
        return numberProblem({
          prompt: t(
            `Use Lagrange multipliers to find the minimum of $x^2 + y^2$ subject to $${poly([a, "x"], [b, "y"])} = ${c}$.`,
            `用拉格朗日乘数法求 $x^2 + y^2$ 在约束 $${poly([a, "x"], [b, "y"])} = ${c}$ 下的最小值。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(Math.abs(c), n),
              `That is $|t|$, the size of the multiple of $(${a}, ${b})$; the minimum is $t^2 \\cdot ${n}$.`,
              `那是 $|t|$，即 $(${a}, ${b})$ 的倍数的大小；最小值是 $t^2 \\cdot ${n}$。`,
            ),
            why(
              Q.of(c * c, (Math.abs(a) + Math.abs(b)) ** 2),
              `The squared length of $(${a}, ${b})$ is $${a * a} + ${b * b} = ${n}$, not $(|a| + |b|)^2$.`,
              `$(${a}, ${b})$ 的长度平方是 $${a * a} + ${b * b} = ${n}$，不是 $(|a| + |b|)^2$。`,
            ),
            why(Q.of(c * c), `That leaves out the division by $a^2 + b^2 = ${n}$.`, `那漏了除以 $a^2 + b^2 = ${n}$。`),
          ]),
          solution: walked(
            [
              [
                ["Use the gradient condition", "用梯度条件"],
                t(
                  `$2x = \\lambda \\cdot ${paren(a)}$ and $2y = \\lambda \\cdot ${paren(b)}$, so $(x, y) = t(${a}, ${b})$.`,
                  `$2x = \\lambda \\cdot ${paren(a)}$，$2y = \\lambda \\cdot ${paren(b)}$，所以 $(x, y) = t(${a}, ${b})$。`,
                ),
              ],
              [
                ["Use the constraint", "代入约束"],
                t(
                  `$t \\cdot ${n} = ${c}$, so $t = ${k.toLatex()}$ and the minimum is $t^2 \\cdot ${n} = ${ans.toLatex()}$.`,
                  `$t \\cdot ${n} = ${c}$，所以 $t = ${k.toLatex()}$，最小值为 $t^2 \\cdot ${n} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The point $(${px.toLatex()}, ${py.toLatex()})$ is on the line, and the distance formula gives $\\left(\\frac{|${c}|}{\\sqrt{${n}}}\\right)^2 = ${ans.toLatex()}$.`,
              `点 $(${px.toLatex()}, ${py.toLatex()})$ 在直线上，距离公式给出 $\\left(\\frac{|${c}|}{\\sqrt{${n}}}\\right)^2 = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** lagrangeMultipliersWithMultipleConstraints optimizes subject to multiple constraints ∇f = λ∇g + μ∇h. */
export const lagrangeMultipliersWithMultipleConstraints: TopicDef = {
  id: "lagrange-multipliers-with-multiple-constraints",
  title: t("Lagrange Multipliers With Multiple Constraints", "多约束拉格朗日乘数法"),
  summary: t(
    "To optimize f subject to two constraints g = c and h = k, solve ∇f = λ∇g + μ∇h alongside the constraint equations.",
    "在双重约束条件 g = c 与 h = k 下求 f 的极值，需联立求解 ∇f = λ∇g + μ∇h 及约束方程。",
  ),
  intro: t(
    "Minimize $x^2 + y^2 + z^2$ subject to $x + y = 4$ and $y + z = 4$. The condition $(2x, 2y, 2z) = \\lambda(1, 1, 0) + \\mu(0, 1, 1)$ gives $x = \\frac{\\lambda}{2}$, $y = \\frac{\\lambda + \\mu}{2}$ and $z = \\frac{\\mu}{2}$. The two constraints read $\\lambda + \\frac{\\mu}{2} = 4$ and $\\frac{\\lambda}{2} + \\mu = 4$, so $\\lambda = \\mu = \\frac{8}{3}$, the point is $\\left(\\frac{4}{3}, \\frac{8}{3}, \\frac{4}{3}\\right)$, and the minimum is $\\frac{16 + 64 + 16}{9} = \\frac{32}{3}$.\n\nCheck: $\\frac{4}{3} + \\frac{8}{3} = 4$ satisfies both constraints, and the point $(2, 2, 2)$, which also satisfies them, gives the larger value $12$.\n\nIn this lesson we set $\\nabla f$ equal to a combination of the constraint gradients and solve it together with all the constraints.",
    "在约束 $x + y = 4$ 与 $y + z = 4$ 下最小化 $x^2 + y^2 + z^2$。条件 $(2x, 2y, 2z) = \\lambda(1, 1, 0) + \\mu(0, 1, 1)$ 给出 $x = \\frac{\\lambda}{2}$，$y = \\frac{\\lambda + \\mu}{2}$，$z = \\frac{\\mu}{2}$。两个约束化为 $\\lambda + \\frac{\\mu}{2} = 4$ 与 $\\frac{\\lambda}{2} + \\mu = 4$，所以 $\\lambda = \\mu = \\frac{8}{3}$，该点为 $\\left(\\frac{4}{3}, \\frac{8}{3}, \\frac{4}{3}\\right)$，最小值为 $\\frac{16 + 64 + 16}{9} = \\frac{32}{3}$。\n\n检验：$\\frac{4}{3} + \\frac{8}{3} = 4$，两个约束都满足；同样满足约束的点 $(2, 2, 2)$ 给出更大的值 $12$。\n\n本课我们令 $\\nabla f$ 等于各约束梯度的组合，并与全部约束联立求解。",
  ),
  prerequisites: ["lagrange-multipliers-with-one-constraint"],
  encompasses: [{ topic: "lagrange-multipliers-with-one-constraint", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "formulating-multiple-constraint-lagrange-equations",
      title: t("Formulating multiple-constraint Lagrange equations", "建立多约束拉格朗日方程"),
      explanation: t(
        "For an objective function $f(x, y, z)$ subject to two constraints $g(x, y, z) = c$ and $h(x, y, z) = k$, critical points occur where $\\nabla f$ is in the plane spanned by $\\nabla g$ and $\\nabla h$:\n\n$$\\nabla f = \\lambda \\nabla g + \\mu \\nabla h.$$\n\nWith $g = x + y$ and $h = y + z$, $\\nabla g = (1, 1, 0)$ and $\\nabla h = (0, 1, 1)$, so $\\lambda\\nabla g + \\mu\\nabla h = (\\lambda, \\lambda + \\mu, \\mu)$. If $\\nabla f = (5, 14, 9)$, then $\\lambda = 5$ and $\\mu = 9$, and the middle entry $14 = 5 + 9$ agrees.\n\n> **Watch out.** Each multiplier belongs to its own constraint: $\\lambda$ goes with $\\nabla g$, $\\mu$ with $\\nabla h$. Read $\\lambda$ from a component where only $\\nabla g$ is nonzero.",
        "对于目标函数 $f(x, y, z)$ 在两个约束条件 $g(x, y, z) = c$ 与 $h(x, y, z) = k$ 下的极值问题，临界点出现在 $\\nabla f$ 位于由 $\\nabla g$ 和 $\\nabla h$ 张成的平面内：\n\n$$\\nabla f = \\lambda \\nabla g + \\mu \\nabla h$$\n\n当 $g = x + y$，$h = y + z$ 时，$\\nabla g = (1, 1, 0)$，$\\nabla h = (0, 1, 1)$，所以 $\\lambda\\nabla g + \\mu\\nabla h = (\\lambda, \\lambda + \\mu, \\mu)$。若 $\\nabla f = (5, 14, 9)$，则 $\\lambda = 5$，$\\mu = 9$，中间分量 $14 = 5 + 9$ 也吻合。\n\n> **注意。** 每个乘数属于自己的约束：$\\lambda$ 对应 $\\nabla g$，$\\mu$ 对应 $\\nabla h$。要从只有 $\\nabla g$ 不为零的分量读出 $\\lambda$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-8, 8);
        let b = rng.nonZero(-8, 8);
        if (b === a) b = -a;
        const c1 = rng.int(1, 10);
        const c2 = rng.int(1, 10);
        const ans = a;
        return numberProblem({
          prompt: t(
            `When optimizing a function $f(x, y, z)$ subject to the two plane constraints $x + y = ${c1}$ and $y + z = ${c2}$, the Lagrange multiplier condition is $\\nabla f = \\lambda \\nabla g + \\mu \\nabla h$. If at an extremum $\\nabla f = \\langle ${a}, ${a + b}, ${b} \\rangle$, find the multiplier $\\lambda$.`,
            `在两个平面约束 $x + y = ${c1}$ 与 $y + z = ${c2}$ 下优化函数 $f(x, y, z)$ 时，拉格朗日乘数条件为 $\\nabla f = \\lambda \\nabla g + \\mu \\nabla h$。若在极值点处 $\\nabla f = \\langle ${a}, ${a + b}, ${b} \\rangle$，求拉格朗日乘数 $\\lambda$ 的值。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              b,
              "That is $\\mu$, the multiplier of $\\nabla h = \\langle 0, 1, 1 \\rangle$.",
              "那是 $\\mu$，即 $\\nabla h = \\langle 0, 1, 1 \\rangle$ 的乘数。",
            ),
            why(
              a + b,
              "That is the middle component, $\\lambda + \\mu$, where both gradients contribute.",
              "那是中间分量 $\\lambda + \\mu$，两个梯度在那里都有贡献。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Combine the gradients", "组合梯度"],
                t(
                  "$\\nabla g = \\langle 1, 1, 0 \\rangle$ and $\\nabla h = \\langle 0, 1, 1 \\rangle$, so $\\lambda \\nabla g + \\mu \\nabla h = \\langle \\lambda, \\lambda + \\mu, \\mu \\rangle$.",
                  "$\\nabla g = \\langle 1, 1, 0 \\rangle$，$\\nabla h = \\langle 0, 1, 1 \\rangle$，所以 $\\lambda \\nabla g + \\mu \\nabla h = \\langle \\lambda, \\lambda + \\mu, \\mu \\rangle$。",
                ),
              ],
              [
                ["Match the components", "比较分量"],
                t(
                  `The first component gives $\\lambda = ${a}$ and the third gives $\\mu = ${b}$.`,
                  `第一个分量给出 $\\lambda = ${a}$，第三个给出 $\\mu = ${b}$。`,
                ),
              ],
            ],
            t(`The middle component agrees: $${a} + ${paren(b)} = ${a + b}$.`, `中间分量也吻合：$${a} + ${paren(b)} = ${a + b}$。`),
          ),
        });
      },
    },
    {
      id: "the-closest-point-on-the-intersection-of-two-planes",
      title: t("The closest point on the intersection of two planes", "两平面交线上离原点最近的点"),
      explanation: t(
        "To minimize $x^2 + y^2 + z^2$ subject to $x + y + z = p$ and $x - y = q$, set $\\nabla f = \\lambda \\nabla g + \\mu \\nabla h$:\n\n$$(2x, 2y, 2z) = \\lambda(1, 1, 1) + \\mu(1, -1, 0).$$\n\nThis gives $x = \\frac{\\lambda + \\mu}{2}$, $y = \\frac{\\lambda - \\mu}{2}$, $z = \\frac{\\lambda}{2}$. The constraints then give $\\lambda = \\frac{2p}{3}$ and $\\mu = q$, and the minimum works out to $\\frac{p^2}{3} + \\frac{q^2}{2}$. For $p = 12$ and $q = 4$, $\\lambda = 8$ and $\\mu = 4$ give the point $(6, 2, 4)$ and the minimum $36 + 4 + 16 = 56$.\n\n> **Watch out.** Both constraints shape the answer: dropping $x - y = q$ leaves only $\\frac{p^2}{3}$. The $q$ is split as $\\pm\\frac{q}{2}$ between $x$ and $y$, so it adds $\\frac{q^2}{2}$, not $q^2$.",
        "要在约束 $x + y + z = p$ 与 $x - y = q$ 下最小化 $x^2 + y^2 + z^2$，令 $\\nabla f = \\lambda \\nabla g + \\mu \\nabla h$：\n\n$$(2x, 2y, 2z) = \\lambda(1, 1, 1) + \\mu(1, -1, 0).$$\n\n由此得 $x = \\frac{\\lambda + \\mu}{2}$，$y = \\frac{\\lambda - \\mu}{2}$，$z = \\frac{\\lambda}{2}$。再由约束得 $\\lambda = \\frac{2p}{3}$，$\\mu = q$，最小值为 $\\frac{p^2}{3} + \\frac{q^2}{2}$。当 $p = 12$，$q = 4$ 时，$\\lambda = 8$，$\\mu = 4$ 给出点 $(6, 2, 4)$，最小值为 $36 + 4 + 16 = 56$。\n\n> **注意。** 两个约束都影响答案：去掉 $x - y = q$ 只剩 $\\frac{p^2}{3}$。$q$ 以 $\\pm\\frac{q}{2}$ 分给 $x$ 和 $y$，所以增加的是 $\\frac{q^2}{2}$，不是 $q^2$。",
      ),
      generate(rng: Rng): Problem {
        const p = rng.int(-9, 9);
        const q = rng.int(-6, 6) || 2;
        const ans = Q.of(p * p, 3).add(Q.of(q * q, 2));
        const lam = Q.of(2 * p, 3);
        const x = lam.add(Q.of(q)).div(Q.of(2));
        const y = lam.sub(Q.of(q)).div(Q.of(2));
        const z = lam.div(Q.of(2));
        const wrap = (v: Q) => (v.sign() < 0 ? `\\left(${v.toLatex()}\\right)` : v.toLatex());
        return numberProblem({
          prompt: t(
            `Find the minimum of $x^2 + y^2 + z^2$ subject to $x + y + z = ${p}$ and $x - y = ${q}$.`,
            `求 $x^2 + y^2 + z^2$ 在约束 $x + y + z = ${p}$ 与 $x - y = ${q}$ 下的最小值。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(p * p, 3),
              `That uses only $x + y + z = ${p}$; the constraint $x - y = ${q}$ moves the point away.`,
              `那只用了 $x + y + z = ${p}$；约束 $x - y = ${q}$ 会使该点移开。`,
            ),
            why(
              Q.of(p * p + q * q, 3),
              `The two parts have different denominators: $\\frac{p^2}{3} + \\frac{q^2}{2}$.`,
              `两部分的分母不同：$\\frac{p^2}{3} + \\frac{q^2}{2}$。`,
            ),
            why(
              Q.of(p * p, 3).add(Q.of(q * q)),
              `$x$ and $y$ each move by $\\frac{${Math.abs(q)}}{2}$, so the $q$ part is $2 \\cdot \\frac{q^2}{4} = \\frac{q^2}{2}$.`,
              `$x$ 与 $y$ 各移动 $\\frac{${Math.abs(q)}}{2}$，所以 $q$ 的部分是 $2 \\cdot \\frac{q^2}{4} = \\frac{q^2}{2}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Write the point through the multipliers", "用乘数表示该点"],
                t(
                  "$(2x, 2y, 2z) = \\lambda(1, 1, 1) + \\mu(1, -1, 0)$ gives $x = \\frac{\\lambda + \\mu}{2}$, $y = \\frac{\\lambda - \\mu}{2}$ and $z = \\frac{\\lambda}{2}$.",
                  "由 $(2x, 2y, 2z) = \\lambda(1, 1, 1) + \\mu(1, -1, 0)$ 得 $x = \\frac{\\lambda + \\mu}{2}$，$y = \\frac{\\lambda - \\mu}{2}$，$z = \\frac{\\lambda}{2}$。",
                ),
              ],
              [
                ["Use the constraints", "代入约束"],
                t(
                  `$x + y + z = \\frac{3\\lambda}{2} = ${p}$ gives $\\lambda = ${lam.toLatex()}$, and $x - y = \\mu = ${q}$; the point is $\\left(${x.toLatex()}, ${y.toLatex()}, ${z.toLatex()}\\right)$.`,
                  `由 $x + y + z = \\frac{3\\lambda}{2} = ${p}$ 得 $\\lambda = ${lam.toLatex()}$，且 $x - y = \\mu = ${q}$；该点为 $\\left(${x.toLatex()}, ${y.toLatex()}, ${z.toLatex()}\\right)$。`,
                ),
              ],
              [["Evaluate", "求值"], t(`$x^2 + y^2 + z^2 = ${ans.toLatex()}$.`, `$x^2 + y^2 + z^2 = ${ans.toLatex()}$。`)],
            ],
            t(
              `The point satisfies both constraints: $${x.toLatex()} + ${wrap(y)} + ${wrap(z)} = ${p}$ and $${x.toLatex()} - ${wrap(y)} = ${q}$.`,
              `该点满足两个约束：$${x.toLatex()} + ${wrap(y)} + ${wrap(z)} = ${p}$，$${x.toLatex()} - ${wrap(y)} = ${q}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** optimizingMultivariableFunctionsUsingLagrangeMultipliers applies Lagrange multipliers to geometric problems. */
export const optimizingMultivariableFunctionsUsingLagrangeMultipliers: TopicDef = {
  id: "optimizing-multivariable-functions-using-lagrange-multipliers",
  title: t("Optimizing Multivariable Functions Using Lagrange Multipliers", "应用拉格朗日乘数法求解多元优化问题"),
  summary: t(
    "Geometric and physical optimization problems are solved by formulating objective and constraint functions and applying Lagrange multipliers.",
    "通过建立目标函数与约束函数并应用拉格朗日乘数法，求解几何与物理中的极值问题。",
  ),
  intro: t(
    "A rectangle has sides $x$ and $y$ with $5x + 2y = 40$; maximize its area $xy$. Lagrange's condition $(y, x) = \\lambda(5, 2)$ gives $y = 5\\lambda$ and $x = 2\\lambda$. The constraint gives $10\\lambda + 10\\lambda = 40$, so $\\lambda = 2$, $x = 4$, $y = 10$ and the area is $40$.\n\nCheck: other points on the line give less, for example $(2, 15)$ gives $30$ and $(6, 5)$ gives $30$.\n\nIn this lesson we turn a word problem into an objective and a constraint and solve it with Lagrange multipliers.",
    "矩形的边长 $x$、$y$ 满足 $5x + 2y = 40$，求面积 $xy$ 的最大值。拉格朗日条件 $(y, x) = \\lambda(5, 2)$ 给出 $y = 5\\lambda$，$x = 2\\lambda$。由约束得 $10\\lambda + 10\\lambda = 40$，所以 $\\lambda = 2$，$x = 4$，$y = 10$，面积为 $40$。\n\n检验：直线上的其他点给出的值更小，例如 $(2, 15)$ 给出 $30$，$(6, 5)$ 给出 $30$。\n\n本课我们把应用问题化为目标函数与约束，再用拉格朗日乘数法求解。",
  ),
  prerequisites: ["lagrange-multipliers-with-one-constraint"],
  encompasses: [{ topic: "lagrange-multipliers-with-one-constraint", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "maximizing-products-under-linear-constraints",
      title: t("Maximizing products under linear constraints", "在线性约束下求乘积最大值"),
      explanation: t(
        "To maximize $P(x, y) = xy$ subject to a linear budget constraint $ax + by = C$ (with $x, y > 0$), applying Lagrange multipliers yields equal allocation of value: $ax = by = \\frac{C}{2}$, so $xy = \\frac{C^2}{4ab}$. For $3x + 5y = 60$, $3x = 5y = 30$ gives $x = 10$, $y = 6$ and the maximum $60$.\n\n> **Watch out.** The two terms share $C$: each gets $\\frac{C}{2}$, not all of $C$. And $(ax)(by) = \\frac{C^2}{4}$ is not $xy$; divide by $ab$.",
        "在正数线性约束 $ax + by = C$ 下最大化乘积 $P(x, y) = xy$，应用拉格朗日乘数法可知各项均分总额：$ax = by = \\frac{C}{2}$，从而最大值为 $xy = \\frac{C^2}{4ab}$。对 $3x + 5y = 60$，由 $3x = 5y = 30$ 得 $x = 10$，$y = 6$，最大值为 $60$。\n\n> **注意。** 两项分享 $C$：各得 $\\frac{C}{2}$，而不是各得整个 $C$。$(ax)(by) = \\frac{C^2}{4}$ 也不是 $xy$；要除以 $ab$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 4);
        const b = rng.int(1, 4);
        const k = rng.int(2, 6);
        const C = 2 * a * b * k;
        const xOpt = b * k;
        const yOpt = a * k;
        const ans = xOpt * yOpt;
        return numberProblem({
          prompt: t(
            `Find the maximum value of $f(x, y) = xy$ subject to the constraint $${poly([a, "x"], [b, "y"])} = ${C}$ for $x, y > 0$.`,
            `求函数 $f(x, y) = xy$ 在约束条件 $${poly([a, "x"], [b, "y"])} = ${C}$（$x, y > 0$）下的最大值。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              4 * ans,
              `$${a === 1 ? "" : a}x$ and $${b === 1 ? "" : b}y$ share the total $${C}$: each is $${C / 2}$, not $${C}$.`,
              `$${a === 1 ? "" : a}x$ 与 $${b === 1 ? "" : b}y$ 分享总数 $${C}$：各为 $${C / 2}$，不是 $${C}$。`,
            ),
            why(
              (C / 2) ** 2,
              `That is $(${a === 1 ? "" : a}x)(${b === 1 ? "" : b}y)$; divide by $${a * b}$ to get $xy$.`,
              `那是 $(${a === 1 ? "" : a}x)(${b === 1 ? "" : b}y)$；除以 $${a * b}$ 才得 $xy$。`,
            ),
            why(k, "That is the multiplier $\\lambda$, not the product.", "那是乘数 $\\lambda$，不是乘积。"),
          ]),
          solution: walked(
            [
              [
                ["Apply the condition", "应用条件"],
                t(
                  `$\\langle y, x \\rangle = \\lambda \\langle ${a}, ${b} \\rangle$ gives $y = ${a === 1 ? "" : a}\\lambda$ and $x = ${b === 1 ? "" : b}\\lambda$.`,
                  `由 $\\langle y, x \\rangle = \\lambda \\langle ${a}, ${b} \\rangle$ 得 $y = ${a === 1 ? "" : a}\\lambda$，$x = ${b === 1 ? "" : b}\\lambda$。`,
                ),
              ],
              [
                ["Use the constraint", "代入约束"],
                t(
                  `$${a}(${b}\\lambda) + ${b}(${a}\\lambda) = ${2 * a * b}\\lambda = ${C}$, so $\\lambda = ${k}$, $x = ${xOpt}$, $y = ${yOpt}$ and $xy = ${ans}$.`,
                  `$${a}(${b}\\lambda) + ${b}(${a}\\lambda) = ${2 * a * b}\\lambda = ${C}$，所以 $\\lambda = ${k}$，$x = ${xOpt}$，$y = ${yOpt}$，$xy = ${ans}$。`,
                ),
              ],
            ],
            t(
              `The nearby point $(${xOpt + b}, ${yOpt - a})$ is also on the line, and gives only $${(xOpt + b) * (yOpt - a)}$.`,
              `附近的点 $(${xOpt + b}, ${yOpt - a})$ 也在直线上，只给出 $${(xOpt + b) * (yOpt - a)}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "maximizing-a-product-of-powers-on-a-line",
      title: t("Maximizing a product of powers on a line", "在直线上最大化幂的乘积"),
      explanation: t(
        "To maximize $f = x^m y^n$ with $x, y > 0$ subject to $x + y = s$, the Lagrange condition $\\nabla f = \\lambda \\nabla g$ gives $m x^{m-1}y^n = \\lambda$ and $n x^m y^{n-1} = \\lambda$. Dividing, $\\frac{m}{x} = \\frac{n}{y}$, so the sum is split in the ratio of the exponents:\n\n$$x = \\frac{m}{m + n}s, \\qquad y = \\frac{n}{m + n}s.$$\n\nFor $x^2y$ with $x + y = 15$, the split $2 : 1$ gives $x = 10$, $y = 5$ and the maximum $100 \\cdot 5 = 500$.\n\n> **Watch out.** Split in the ratio of the exponents, not equally, and give the larger share to the variable with the larger exponent.",
        "要在 $x, y > 0$ 且约束 $x + y = s$ 下最大化 $f = x^m y^n$，拉格朗日条件 $\\nabla f = \\lambda \\nabla g$ 给出 $m x^{m-1}y^n = \\lambda$ 与 $n x^m y^{n-1} = \\lambda$。两式相除得 $\\frac{m}{x} = \\frac{n}{y}$，所以和按指数之比分配：\n\n$$x = \\frac{m}{m + n}s, \\qquad y = \\frac{n}{m + n}s.$$\n\n对 $x + y = 15$ 下的 $x^2y$，按 $2 : 1$ 分配得 $x = 10$，$y = 5$，最大值为 $100 \\cdot 5 = 500$。\n\n> **注意。** 要按指数之比分配，而不是平分；指数较大的变量分得较多。",
      ),
      generate(rng: Rng): Problem {
        const [m, n] = rng.pick([
          [1, 2],
          [2, 1],
          [2, 2],
          [1, 3],
          [3, 1],
          [2, 3],
          [3, 2],
          [1, 4],
          [4, 1],
        ] as const);
        const k = rng.int(1, 4);
        const s = (m + n) * k;
        const x = m * k;
        const y = n * k;
        const ans = x ** m * y ** n;
        const mon = `${m === 1 ? "x" : `x^${m}`}${n === 1 ? "y" : `y^${n}`}`;
        const power = (v: number, e: number) => (e === 1 ? `${v}` : `${v}^{${e}}`);
        const lambda = m * x ** (m - 1) * y ** n;
        return numberProblem({
          prompt: t(
            `Find the maximum of $${mon}$ for $x, y > 0$ subject to $x + y = ${s}$.`,
            `求 $x, y > 0$ 且 $x + y = ${s}$ 时 $${mon}$ 的最大值。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(s, 2).pow(m + n),
              `That splits $${s}$ equally; the split follows the exponents, $${m} : ${n}$.`,
              `那是平分 $${s}$；应按指数之比 $${m} : ${n}$ 分配。`,
            ),
            why(
              y ** m * x ** n,
              `The shares are swapped: $x$ has exponent $${m}$, so $x = ${x}$.`,
              `两份对调了：$x$ 的指数是 $${m}$，所以 $x = ${x}$。`,
            ),
            why(
              x * y,
              `That is $xy$ at the best point; the powers $${m}$ and $${n}$ still apply.`,
              `那是最优点处的 $xy$；还要取 $${m}$ 次和 $${n}$ 次幂。`,
            ),
            why(
              lambda,
              `That is the multiplier $\\lambda = f_x$ at the best point, not the value of $f$.`,
              `那是最优点处的乘数 $\\lambda = f_x$，不是 $f$ 的值。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Split the sum", "分配总和"],
                t(
                  `$\\frac{${m}}{x} = \\frac{${n}}{y}$ splits $${s}$ in the ratio $${m} : ${n}$, so $x = ${x}$ and $y = ${y}$.`,
                  `由 $\\frac{${m}}{x} = \\frac{${n}}{y}$，按 $${m} : ${n}$ 分配 $${s}$，所以 $x = ${x}$，$y = ${y}$。`,
                ),
              ],
              [
                ["Evaluate", "求值"],
                t(`$${power(x, m)} \\cdot ${power(y, n)} = ${ans}$.`, `$${power(x, m)} \\cdot ${power(y, n)} = ${ans}$。`),
              ],
            ],
            t(
              `Both equations give the same multiplier, since $\\frac{${m}}{${x}} = \\frac{${n}}{${y}} = ${Q.of(1, k).toLatex()}$; and $x + y = ${x} + ${y} = ${s}$.`,
              `两个方程给出同一个乘数，因为 $\\frac{${m}}{${x}} = \\frac{${n}}{${y}} = ${Q.of(1, k).toLatex()}$；且 $x + y = ${x} + ${y} = ${s}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** newtonsMethodForMultivariableFunctions solves systems F(x) = 0 via x_{n+1} = x_n - J⁻¹ F(x_n). */
export const newtonsMethodForMultivariableFunctions: TopicDef = {
  id: "newtons-method-for-multivariable-functions",
  title: t("Newton's Method for Multivariable Functions", "多元牛顿迭代法"),
  summary: t(
    "Newton's method solves a nonlinear system $\\mathbf{F}(\\mathbf{x}) = \\mathbf{0}$ by iterating $\\mathbf{x}_{n+1} = \\mathbf{x}_n - J(\\mathbf{x}_n)^{-1}\\mathbf{F}(\\mathbf{x}_n)$.",
    "多元牛顿法通过迭代 $\\mathbf{x}_{n+1} = \\mathbf{x}_n - J(\\mathbf{x}_n)^{-1}\\mathbf{F}(\\mathbf{x}_n)$ 求解非线性方程组 $\\mathbf{F}(\\mathbf{x}) = \\mathbf{0}$。",
  ),
  intro: t(
    "Solve $x^2 + y = 5$, $x - y = -1$ starting from $(1, 1)$. With $\\mathbf{F} = (x^2 + y - 5, x - y + 1)$, $\\mathbf{F}(1, 1) = (-3, 1)$ and $J = \\begin{pmatrix} 2x & 1 \\\\ 1 & -1 \\end{pmatrix} = \\begin{pmatrix} 2 & 1 \\\\ 1 & -1 \\end{pmatrix}$. Solving $J\\Delta = (3, -1)$ gives $\\Delta = \\left(\\frac{2}{3}, \\frac{5}{3}\\right)$, so $\\mathbf{x}_1 = \\left(\\frac{5}{3}, \\frac{8}{3}\\right)$.\n\nCheck: $\\mathbf{F}\\left(\\frac{5}{3}, \\frac{8}{3}\\right) = \\left(\\frac{25}{9} + \\frac{24}{9} - \\frac{45}{9}, 0\\right) = \\left(\\frac{4}{9}, 0\\right)$, much smaller than $(-3, 1)$.\n\nIn this lesson we take Newton steps for systems by solving the linear system $J\\Delta = -\\mathbf{F}$.",
    "从 $(1, 1)$ 出发求解 $x^2 + y = 5$，$x - y = -1$。取 $\\mathbf{F} = (x^2 + y - 5, x - y + 1)$，则 $\\mathbf{F}(1, 1) = (-3, 1)$，$J = \\begin{pmatrix} 2x & 1 \\\\ 1 & -1 \\end{pmatrix} = \\begin{pmatrix} 2 & 1 \\\\ 1 & -1 \\end{pmatrix}$。解 $J\\Delta = (3, -1)$ 得 $\\Delta = \\left(\\frac{2}{3}, \\frac{5}{3}\\right)$，所以 $\\mathbf{x}_1 = \\left(\\frac{5}{3}, \\frac{8}{3}\\right)$。\n\n检验：$\\mathbf{F}\\left(\\frac{5}{3}, \\frac{8}{3}\\right) = \\left(\\frac{25}{9} + \\frac{24}{9} - \\frac{45}{9}, 0\\right) = \\left(\\frac{4}{9}, 0\\right)$，比 $(-3, 1)$ 小得多。\n\n本课我们解线性方程组 $J\\Delta = -\\mathbf{F}$，对方程组作牛顿迭代。",
  ),
  prerequisites: ["the-derivative-of-a-multivariable-function"],
  encompasses: [{ topic: "the-derivative-of-a-multivariable-function", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "performing-multivariable-newton-step",
      title: t("Performing a multivariable Newton step", "执行多元牛顿迭代步"),
      explanation: t(
        "The multivariable step replaces the function by its linearization and solves the resulting linear system to move toward a root. To solve $\\mathbf{F}(\\mathbf{x}) = \\mathbf{0}$, Newton's iteration update solves $J(\\mathbf{x}_0)\\Delta \\mathbf{x} = -\\mathbf{F}(\\mathbf{x}_0)$ and updates $\\mathbf{x}_1 = \\mathbf{x}_0 + \\Delta \\mathbf{x}$. For $\\mathbf{F} = (4x - 20, -5y - 10)$ from $(0, 0)$, $J = \\operatorname{diag}(4, -5)$ and $-\\mathbf{F}(0, 0) = (20, 10)$, so $\\Delta = (5, -2)$ and $\\mathbf{x}_1 = (5, -2)$, where $\\mathbf{F}$ is exactly zero.\n\n> **Watch out.** The right side is $-\\mathbf{F}(\\mathbf{x}_0)$, not $\\mathbf{F}(\\mathbf{x}_0)$, and the step is $J^{-1}$ times it: divide each entry by the matching diagonal entry of $J$.",
        "多元牛顿法的一步用线性化代替函数，解出所得的线性方程组，从而向根靠近。求解 $\\mathbf{F}(\\mathbf{x}) = \\mathbf{0}$ 时，牛顿迭代步通过求解线性方程组 $J(\\mathbf{x}_0)\\Delta \\mathbf{x} = -\\mathbf{F}(\\mathbf{x}_0)$，并更新 $\\mathbf{x}_1 = \\mathbf{x}_0 + \\Delta \\mathbf{x}$。对 $\\mathbf{F} = (4x - 20, -5y - 10)$，从 $(0, 0)$ 出发，$J = \\operatorname{diag}(4, -5)$，$-\\mathbf{F}(0, 0) = (20, 10)$，所以 $\\Delta = (5, -2)$，$\\mathbf{x}_1 = (5, -2)$，那里 $\\mathbf{F}$ 恰为零。\n\n> **注意。** 右端是 $-\\mathbf{F}(\\mathbf{x}_0)$，不是 $\\mathbf{F}(\\mathbf{x}_0)$；步长是 $J^{-1}$ 乘以它：每个分量要除以 $J$ 对应的对角元素。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        let tx = rng.int(-3, 3);
        const ty = rng.int(-3, 3);
        if (tx === 0 && ty === 0) tx = rng.pick([-2, 2]);
        const cVal = a * tx;
        const dVal = b * ty;
        const answer: Vec2 = [tx, ty];
        const neg = (v: number) => -v || 0;
        const mistakes: [number[], string, string][] = [
          [
            [neg(tx), neg(ty)],
            "That solves $J\\Delta = \\mathbf{F}(\\mathbf{x}_0)$; the right side is $-\\mathbf{F}(\\mathbf{x}_0)$.",
            "那是解了 $J\\Delta = \\mathbf{F}(\\mathbf{x}_0)$；右端应是 $-\\mathbf{F}(\\mathbf{x}_0)$。",
          ],
          [
            [cVal, dVal],
            `That uses $-\\mathbf{F}(0, 0)$ itself as the step; divide by the entries $${a}$ and $${b}$ of $J$.`,
            `那是直接把 $-\\mathbf{F}(0, 0)$ 当作步长；要除以 $J$ 的元素 $${a}$ 和 $${b}$。`,
          ],
          [[ty, tx], "The coordinates are swapped; the first equation gives $x_1$.", "两个坐标对调了；第一个方程给出 $x_1$。"],
        ];
        return pointWith(
          {
            prompt: t(
              `Apply one step of Newton's method starting from $(x_0, y_0) = (0, 0)$ to solve $\\mathbf{F}(x, y) = \\mathbf{0}$ for $\\mathbf{F}(x, y) = (${poly([a, "x"], [-cVal, ""])}, ${poly([b, "y"], [-dVal, ""])})$. Express your answer as $(x_1, y_1)$.`,
              `从初始点 $(x_0, y_0) = (0, 0)$ 出发，应用一步牛顿迭代法求解 $\\mathbf{F}(x, y) = \\mathbf{0}$，其中 $\\mathbf{F}(x, y) = (${poly([a, "x"], [-cVal, ""])}, ${poly([b, "y"], [-dVal, ""])})$。结果以 $(x_1, y_1)$ 表示。`,
            ),
            answer,
            vars: ["x", "y"],
            solution: walked(
              [
                [
                  ["Find the Jacobian and the value", "求雅可比矩阵与函数值"],
                  t(
                    `$J = \\begin{pmatrix} ${a} & 0 \\\\ 0 & ${b} \\end{pmatrix}$ and $\\mathbf{F}(0, 0) = (${neg(cVal)}, ${neg(dVal)})$.`,
                    `$J = \\begin{pmatrix} ${a} & 0 \\\\ 0 & ${b} \\end{pmatrix}$，$\\mathbf{F}(0, 0) = (${neg(cVal)}, ${neg(dVal)})$。`,
                  ),
                ],
                [
                  ["Solve for the step", "解出步长"],
                  t(
                    `$J\\Delta = (${cVal}, ${dVal})$ gives $\\Delta = (${tx}, ${ty})$, so $\\mathbf{x}_1 = ${v2L(answer)}$.`,
                    `由 $J\\Delta = (${cVal}, ${dVal})$ 得 $\\Delta = (${tx}, ${ty})$，所以 $\\mathbf{x}_1 = ${v2L(answer)}$。`,
                  ),
                ],
              ],
              t(
                `$\\mathbf{F}${v2L(answer)} = (${a} \\cdot ${paren(tx)} - ${paren(cVal)}, ${b} \\cdot ${paren(ty)} - ${paren(dVal)}) = (0, 0)$: for a linear system one step lands on the root.`,
                `$\\mathbf{F}${v2L(answer)} = (${a} \\cdot ${paren(tx)} - ${paren(cVal)}, ${b} \\cdot ${paren(ty)} - ${paren(dVal)}) = (0, 0)$：线性方程组一步就到达根。`,
              ),
            ),
          },
          mistakes.filter(([v], i, all) => v2L(v) !== v2L(answer) && all.findIndex(([w]) => v2L(w) === v2L(v)) === i),
        );
      },
    },
    {
      id: "a-newton-step-for-a-circle-and-a-line",
      figure: multivariableDrawings3["newtons-method-for-multivariable-functions#a-newton-step-for-a-circle-and-a-line"],
      title: t("A Newton step for a circle and a line", "圆与直线方程组的牛顿迭代一步"),
      explanation: t(
        "Newton's method for a system $\\mathbf{F}(\\mathbf{x}) = \\mathbf{0}$ replaces $\\mathbf{F}$ by its linearization at the current guess and solves that instead:\n\n$$J(\\mathbf{x}_0)\\,\\Delta = -\\mathbf{F}(\\mathbf{x}_0), \\qquad \\mathbf{x}_1 = \\mathbf{x}_0 + \\Delta.$$\n\nFor $\\mathbf{F} = (x^2 + y^2 - a, x - y)$ the Jacobian is $\\begin{pmatrix} 2x & 2y \\\\ 1 & -1 \\end{pmatrix}$. Solve the $2 \\times 2$ system for $\\Delta$ rather than inverting the matrix by habit. For $a = 26$ from $(3, 2)$, $\\mathbf{F} = (-13, 1)$, and $6\\Delta_1 + 4\\Delta_2 = 13$, $\\Delta_1 - \\Delta_2 = -1$ give $\\Delta = \\left(\\frac{9}{10}, \\frac{19}{10}\\right)$, so $\\mathbf{x}_1 = \\left(\\frac{39}{10}, \\frac{39}{10}\\right)$.\n\n> **Watch out.** $\\Delta$ is the change, not the new point: add it to $\\mathbf{x}_0$. And the right side is $-\\mathbf{F}(\\mathbf{x}_0)$, so subtracting $\\Delta$ moves the wrong way.",
        "方程组 $\\mathbf{F}(\\mathbf{x}) = \\mathbf{0}$ 的牛顿法用 $\\mathbf{F}$ 在当前猜测处的线性化代替 $\\mathbf{F}$ 并求解：\n\n$$J(\\mathbf{x}_0)\\,\\Delta = -\\mathbf{F}(\\mathbf{x}_0), \\qquad \\mathbf{x}_1 = \\mathbf{x}_0 + \\Delta.$$\n\n对 $\\mathbf{F} = (x^2 + y^2 - a, x - y)$，雅可比矩阵为 $\\begin{pmatrix} 2x & 2y \\\\ 1 & -1 \\end{pmatrix}$。解这个 $2 \\times 2$ 方程组求 $\\Delta$，不必习惯性地求逆矩阵。对 $a = 26$，从 $(3, 2)$ 出发，$\\mathbf{F} = (-13, 1)$，由 $6\\Delta_1 + 4\\Delta_2 = 13$，$\\Delta_1 - \\Delta_2 = -1$ 得 $\\Delta = \\left(\\frac{9}{10}, \\frac{19}{10}\\right)$，所以 $\\mathbf{x}_1 = \\left(\\frac{39}{10}, \\frac{39}{10}\\right)$。\n\n> **注意。** $\\Delta$ 是改变量，不是新的点：要把它加到 $\\mathbf{x}_0$ 上。右端是 $-\\mathbf{F}(\\mathbf{x}_0)$，所以减去 $\\Delta$ 会走错方向。",
      ),
      generate(rng: Rng): Problem {
        let a = rng.int(1, 20);
        const x0 = rng.int(1, 4);
        const y0 = rng.int(0, 4);
        if (x0 === y0 && 2 * x0 * x0 === a) a += 1;
        const F1 = x0 * x0 + y0 * y0 - a;
        const F2 = x0 - y0;
        const d2 = Q.of(-F1 + 2 * x0 * F2, 2 * x0 + 2 * y0);
        const d1 = d2.sub(Q.of(F2));
        const x1 = Q.of(x0).add(d1);
        const y1 = Q.of(y0).add(d2);
        const answer = [x1, y1];
        const mistakes: [Q[], string, string][] = [
          [
            [Q.of(x0).sub(d1), Q.of(y0).sub(d2)],
            "That subtracts $\\Delta$; since $J\\Delta = -\\mathbf{F}(\\mathbf{x}_0)$, the new point is $\\mathbf{x}_0 + \\Delta$.",
            "那是减去了 $\\Delta$；因为 $J\\Delta = -\\mathbf{F}(\\mathbf{x}_0)$，新点是 $\\mathbf{x}_0 + \\Delta$。",
          ],
          [
            [d1, d2],
            `That is $\\Delta$ itself; add it to the starting point $(${x0}, ${y0})$.`,
            `那是 $\\Delta$ 本身；要把它加到起点 $(${x0}, ${y0})$ 上。`,
          ],
        ];
        return pointWith(
          {
            prompt: t(
              `Apply one step of Newton's method to the system $x^2 + y^2 = ${a}$, $x - y = 0$, starting from $(${x0}, ${y0})$.`,
              `从 $(${x0}, ${y0})$ 出发，对方程组 $x^2 + y^2 = ${a}$，$x - y = 0$ 作一步牛顿迭代。`,
            ),
            answer,
            vars: ["x", "y"],
            solution: walked(
              [
                [
                  ["Evaluate at the start", "在起点求值"],
                  t(
                    `$\\mathbf{F}(${x0}, ${y0}) = (${F1}, ${F2})$ and $J = \\begin{pmatrix} ${2 * x0} & ${2 * y0} \\\\ 1 & -1 \\end{pmatrix}$.`,
                    `$\\mathbf{F}(${x0}, ${y0}) = (${F1}, ${F2})$，$J = \\begin{pmatrix} ${2 * x0} & ${2 * y0} \\\\ 1 & -1 \\end{pmatrix}$。`,
                  ),
                ],
                [
                  ["Solve the linear system", "解线性方程组"],
                  t(
                    `$${2 * x0}\\Delta_1 + ${2 * y0}\\Delta_2 = ${-F1 || 0}$ and $\\Delta_1 - \\Delta_2 = ${-F2 || 0}$ give $\\Delta = \\left(${d1.toLatex()}, ${d2.toLatex()}\\right)$.`,
                    `由 $${2 * x0}\\Delta_1 + ${2 * y0}\\Delta_2 = ${-F1 || 0}$，$\\Delta_1 - \\Delta_2 = ${-F2 || 0}$ 得 $\\Delta = \\left(${d1.toLatex()}, ${d2.toLatex()}\\right)$。`,
                  ),
                ],
                [
                  ["Take the step", "迈出一步"],
                  t(
                    `$\\mathbf{x}_1 = (${x0}, ${y0}) + \\Delta = \\left(${x1.toLatex()}, ${y1.toLatex()}\\right)$.`,
                    `$\\mathbf{x}_1 = (${x0}, ${y0}) + \\Delta = \\left(${x1.toLatex()}, ${y1.toLatex()}\\right)$。`,
                  ),
                ],
              ],
              t(
                "The linear equation $x - y = 0$ now holds exactly, since Newton's step solves linear equations without error: $x_1 = y_1$.",
                "线性方程 $x - y = 0$ 现在恰好成立，因为牛顿步对线性方程没有误差：$x_1 = y_1$。",
              ),
            ),
          },
          mistakes.filter(([v], i, all) => v2L(v) !== v2L(answer) && all.findIndex(([w]) => v2L(w) === v2L(v)) === i),
        );
      },
    },
  ],
};

/** newtonsMethodForOptimizingMultivariableFunctions finds critical points via Hessian inversion. */
export const newtonsMethodForOptimizingMultivariableFunctions: TopicDef = {
  id: "newtons-method-for-optimizing-multivariable-functions",
  title: t("Newton's Method for Optimizing Multivariable Functions", "多元优化的牛顿迭代法"),
  summary: t(
    "Newton's method for optimization finds stationary points by iterating $\\mathbf{x}_{n+1} = \\mathbf{x}_n - H(\\mathbf{x}_n)^{-1}\\nabla f(\\mathbf{x}_n)$.",
    "用于优化的牛顿法通过迭代 $\\mathbf{x}_{n+1} = \\mathbf{x}_n - H(\\mathbf{x}_n)^{-1}\\nabla f(\\mathbf{x}_n)$ 寻找驻点。",
  ),
  intro: t(
    "Take a Newton step for $f(x, y) = x^2 + xy + y^2 - 3x$ from $(0, 0)$. The gradient is $(2x + y - 3, x + 2y)$, so $\\nabla f(0, 0) = (-3, 0)$, and the Hessian is $H = \\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}$. Solving $H\\Delta = (3, 0)$, that is $2\\Delta_1 + \\Delta_2 = 3$ and $\\Delta_1 + 2\\Delta_2 = 0$, gives $\\Delta = (2, -1)$, so $\\mathbf{x}_1 = (2, -1)$.\n\nCheck: $\\nabla f(2, -1) = (4 - 1 - 3, 2 - 2) = (0, 0)$, and $H$ has $D = 3 > 0$ with $f_{xx} > 0$, so $(2, -1)$ is the minimum.\n\nIn this lesson we apply Newton's method to $\\nabla f = \\mathbf{0}$, with the Hessian in place of the Jacobian.",
    "从 $(0, 0)$ 出发，对 $f(x, y) = x^2 + xy + y^2 - 3x$ 作一步牛顿迭代。梯度为 $(2x + y - 3, x + 2y)$，所以 $\\nabla f(0, 0) = (-3, 0)$；黑塞矩阵为 $H = \\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}$。解 $H\\Delta = (3, 0)$，即 $2\\Delta_1 + \\Delta_2 = 3$，$\\Delta_1 + 2\\Delta_2 = 0$，得 $\\Delta = (2, -1)$，所以 $\\mathbf{x}_1 = (2, -1)$。\n\n检验：$\\nabla f(2, -1) = (4 - 1 - 3, 2 - 2) = (0, 0)$，且 $H$ 的 $D = 3 > 0$，$f_{xx} > 0$，所以 $(2, -1)$ 是最小值点。\n\n本课我们把牛顿法用于 $\\nabla f = \\mathbf{0}$，用黑塞矩阵代替雅可比矩阵。",
  ),
  prerequisites: ["newtons-method-for-multivariable-functions", "the-second-derivative-of-a-multivariable-function"],
  encompasses: [{ topic: "newtons-method-for-multivariable-functions", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "performing-newton-optimization-step",
      title: t("Performing a Newton optimization step", "执行牛顿优化迭代步"),
      explanation: t(
        "To minimize or find critical points of $f(\\mathbf{x})$, Newton's optimization iteration solves $H(\\mathbf{x}_0)\\Delta \\mathbf{x} = -\\nabla f(\\mathbf{x}_0)$ and updates $\\mathbf{x}_1 = \\mathbf{x}_0 + \\Delta \\mathbf{x}$. For a quadratic function, one step finds the exact stationary point. For $f = 5x^2 + 2y^2 - 20x + 12y$ from $(0, 0)$, $H = \\operatorname{diag}(10, 4)$ and $-\\nabla f(0, 0) = (20, -12)$, so $\\mathbf{x}_1 = (2, -3)$.\n\n> **Watch out.** The Hessian entries are $2a$ and $2b$, the second derivatives of $ax^2$ and $by^2$; dividing by $a$ and $b$ doubles the step.",
        "求 $f(\\mathbf{x})$ 的极值点或驻点，牛顿优化迭代步通过求解 $H(\\mathbf{x}_0)\\Delta \\mathbf{x} = -\\nabla f(\\mathbf{x}_0)$，并更新 $\\mathbf{x}_1 = \\mathbf{x}_0 + \\Delta \\mathbf{x}$。对于二次函数，只需一步迭代即可达到精确驻点。对 $f = 5x^2 + 2y^2 - 20x + 12y$，从 $(0, 0)$ 出发，$H = \\operatorname{diag}(10, 4)$，$-\\nabla f(0, 0) = (20, -12)$，所以 $\\mathbf{x}_1 = (2, -3)$。\n\n> **注意。** 黑塞矩阵的元素是 $2a$ 和 $2b$，即 $ax^2$ 与 $by^2$ 的二阶导数；除以 $a$ 和 $b$ 会使步长加倍。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 4);
        const b = rng.int(1, 4);
        let xTarget = rng.int(-3, 3);
        const yTarget = rng.int(-3, 3);
        if (xTarget === 0 && yTarget === 0) xTarget = rng.pick([-1, 1]);
        const cCoeff = -2 * a * xTarget;
        const dCoeff = -2 * b * yTarget;
        const answer: Vec2 = [xTarget, yTarget];
        const neg = (v: number) => -v || 0;
        const mistakes: [number[], string, string][] = [
          [
            [neg(xTarget), neg(yTarget)],
            "That adds $H^{-1}\\nabla f$; the step goes against the gradient, $-H^{-1}\\nabla f$.",
            "那是加上了 $H^{-1}\\nabla f$；步长与梯度方向相反，是 $-H^{-1}\\nabla f$。",
          ],
          [
            [2 * xTarget, 2 * yTarget],
            `That divides by $${a}$ and $${b}$; the Hessian entries are $${2 * a}$ and $${2 * b}$.`,
            `那是除以了 $${a}$ 和 $${b}$；黑塞矩阵的元素是 $${2 * a}$ 和 $${2 * b}$。`,
          ],
          [[yTarget, xTarget], "The coordinates are swapped; the $x$-equation gives $x_1$.", "两个坐标对调了；$x$ 的方程给出 $x_1$。"],
        ];
        return pointWith(
          {
            prompt: t(
              `Apply one iteration of Newton's optimization method from the initial guess $(x_0, y_0) = (0, 0)$ to find the minimum of $f(x, y) = ${poly([a, "x^2"], [b, "y^2"], [cCoeff, "x"], [dCoeff, "y"])}$ using $\\mathbf{x}_1 = \\mathbf{x}_0 - H^{-1}\\nabla f(\\mathbf{x}_0)$. Express your answer as $(x_1, y_1)$.`,
              `从初始猜测 $(x_0, y_0) = (0, 0)$ 出发，利用牛顿优化迭代公式 $\\mathbf{x}_1 = \\mathbf{x}_0 - H^{-1}\\nabla f(\\mathbf{x}_0)$ 执行一步迭代，求函数 $f(x, y) = ${poly([a, "x^2"], [b, "y^2"], [cCoeff, "x"], [dCoeff, "y"])}$ 的极小值点。结果以 $(x_1, y_1)$ 表示。`,
            ),
            answer,
            vars: ["x", "y"],
            solution: walked(
              [
                [
                  ["Find the gradient and the Hessian", "求梯度与黑塞矩阵"],
                  t(
                    `$\\nabla f = \\langle ${poly([2 * a, "x"], [cCoeff, ""])}, ${poly([2 * b, "y"], [dCoeff, ""])} \\rangle$, so $\\nabla f(0, 0) = \\langle ${cCoeff}, ${dCoeff} \\rangle$, and $H = \\begin{pmatrix} ${2 * a} & 0 \\\\ 0 & ${2 * b} \\end{pmatrix}$.`,
                    `$\\nabla f = \\langle ${poly([2 * a, "x"], [cCoeff, ""])}, ${poly([2 * b, "y"], [dCoeff, ""])} \\rangle$，所以 $\\nabla f(0, 0) = \\langle ${cCoeff}, ${dCoeff} \\rangle$，$H = \\begin{pmatrix} ${2 * a} & 0 \\\\ 0 & ${2 * b} \\end{pmatrix}$。`,
                  ),
                ],
                [
                  ["Solve for the step", "解出步长"],
                  t(
                    `$H\\Delta = \\langle ${neg(cCoeff)}, ${neg(dCoeff)} \\rangle$ gives $\\Delta = (${xTarget}, ${yTarget})$, so $\\mathbf{x}_1 = ${v2L(answer)}$.`,
                    `由 $H\\Delta = \\langle ${neg(cCoeff)}, ${neg(dCoeff)} \\rangle$ 得 $\\Delta = (${xTarget}, ${yTarget})$，所以 $\\mathbf{x}_1 = ${v2L(answer)}$。`,
                  ),
                ],
              ],
              t(
                `$\\nabla f${v2L(answer)} = \\langle ${2 * a} \\cdot ${paren(xTarget)} + ${paren(cCoeff)}, ${2 * b} \\cdot ${paren(yTarget)} + ${paren(dCoeff)} \\rangle = \\langle 0, 0 \\rangle$, so one step reaches the minimum of this quadratic.`,
                `$\\nabla f${v2L(answer)} = \\langle ${2 * a} \\cdot ${paren(xTarget)} + ${paren(cCoeff)}, ${2 * b} \\cdot ${paren(yTarget)} + ${paren(dCoeff)} \\rangle = \\langle 0, 0 \\rangle$，所以对这个二次函数一步就到达最小值点。`,
              ),
            ),
          },
          mistakes.filter(([v], i, all) => v2L(v) !== v2L(answer) && all.findIndex(([w]) => v2L(w) === v2L(v)) === i),
        );
      },
    },
    {
      id: "a-newton-optimization-step-with-a-cubic-term",
      title: t("A Newton optimization step with a cubic term", "含三次项的牛顿优化一步"),
      explanation: t(
        "Newton's method for finding a critical point applies Newton's method to $\\nabla f = \\mathbf{0}$, so the Hessian plays the role of the Jacobian:\n\n$$\\mathbf{x}_1 = \\mathbf{x}_0 - H(\\mathbf{x}_0)^{-1}\\nabla f(\\mathbf{x}_0).$$\n\nFor $f = \\frac{x^3}{3} - ax + y^2 - by$ the Hessian is diagonal, $\\operatorname{diag}(2x, 2)$, so each coordinate updates on its own. The quadratic part in $y$ is solved exactly in one step, while the cubic part in $x$ only gets closer to $\\sqrt{a}$. For $a = 13$, $b = 14$ from $(3, 0)$, $\\nabla f = (-4, -14)$ and $H = \\operatorname{diag}(6, 2)$, so $\\mathbf{x}_1 = \\left(3 + \\frac{4}{6}, 0 + 7\\right) = \\left(\\frac{11}{3}, 7\\right)$, and $\\frac{11}{3} \\approx 3.67$ is near $\\sqrt{13} \\approx 3.61$.\n\n> **Watch out.** Each gradient entry is divided by its Hessian entry, $2x_0$ or $2$, before it is subtracted; subtracting the raw gradient overshoots.",
        "求临界点的牛顿法是把牛顿法用于 $\\nabla f = \\mathbf{0}$，所以黑塞矩阵起雅可比矩阵的作用：\n\n$$\\mathbf{x}_1 = \\mathbf{x}_0 - H(\\mathbf{x}_0)^{-1}\\nabla f(\\mathbf{x}_0).$$\n\n对 $f = \\frac{x^3}{3} - ax + y^2 - by$，黑塞矩阵是对角的 $\\operatorname{diag}(2x, 2)$，所以每个坐标各自更新。$y$ 的二次部分一步就精确求出，而 $x$ 的三次部分只是更接近 $\\sqrt{a}$。对 $a = 13$，$b = 14$，从 $(3, 0)$ 出发，$\\nabla f = (-4, -14)$，$H = \\operatorname{diag}(6, 2)$，所以 $\\mathbf{x}_1 = \\left(3 + \\frac{4}{6}, 0 + 7\\right) = \\left(\\frac{11}{3}, 7\\right)$，而 $\\frac{11}{3} \\approx 3.67$ 接近 $\\sqrt{13} \\approx 3.61$。\n\n> **注意。** 每个梯度分量要先除以对应的黑塞矩阵元素 $2x_0$ 或 $2$，再减去；直接减去梯度会走过头。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 12);
        const b = rng.int(-6, 6);
        const x0 = rng.int(1, 4);
        const y0 = rng.int(-3, 3);
        const x1 = Q.of(x0 * x0 + a, 2 * x0);
        const y1 = Q.of(b, 2);
        const answer = [x1, y1];
        const stepX = Q.of(x0 * x0 - a, 2 * x0);
        const mistakes: [Q[], string, string][] = [
          [
            [Q.of(x0 * x0 - a, 2 * x0), y1],
            `That is $\\frac{x_0^2 - a}{2x_0}$, the step itself; $x_1 = ${x0} - ${paren(stepX)}$.`,
            `那是 $\\frac{x_0^2 - a}{2x_0}$，即步长本身；$x_1 = ${x0} - ${paren(stepX)}$。`,
          ],
          [
            [Q.of(x0).sub(Q.of(x0 * x0 - a)), Q.of(y0).sub(Q.of(2 * y0 - b))],
            `That subtracts the raw gradient; divide its entries by the Hessian entries $${2 * x0}$ and $2$ first.`,
            `那是直接减去了梯度；要先把各分量除以黑塞矩阵元素 $${2 * x0}$ 和 $2$。`,
          ],
          [
            [Q.of(x0).add(stepX), Q.of(y0).add(Q.of(2 * y0 - b, 2))],
            "That adds $H^{-1}\\nabla f$; Newton's step subtracts it.",
            "那是加上了 $H^{-1}\\nabla f$；牛顿步要减去它。",
          ],
        ];
        const gap = x1.mul(x1).sub(Q.of(a));
        const fy = b === 0 ? "2y_1" : `2y_1 ${b < 0 ? "+" : "-"} ${Math.abs(b)}`;
        return pointWith(
          {
            prompt: t(
              `Apply one step of Newton's method for optimization to $f(x, y) = \\frac{x^3}{3} ${poly([-a, "x"], [1, "y^2"], [-b, "y"])}$, starting from $(${x0}, ${y0})$.`,
              `从 $(${x0}, ${y0})$ 出发，对 $f(x, y) = \\frac{x^3}{3} ${poly([-a, "x"], [1, "y^2"], [-b, "y"])}$ 作一步牛顿优化迭代。`,
            ),
            answer,
            vars: ["x", "y"],
            solution: walked(
              [
                [
                  ["Find the gradient and the Hessian", "求梯度与黑塞矩阵"],
                  t(
                    `$\\nabla f = (x^2 - ${a}, ${poly([2, "y"], [-b, ""])})$, so $\\nabla f(${x0}, ${y0}) = (${x0 * x0 - a}, ${2 * y0 - b})$, and $H = \\operatorname{diag}(${2 * x0}, 2)$.`,
                    `$\\nabla f = (x^2 - ${a}, ${poly([2, "y"], [-b, ""])})$，所以 $\\nabla f(${x0}, ${y0}) = (${x0 * x0 - a}, ${2 * y0 - b})$，$H = \\operatorname{diag}(${2 * x0}, 2)$。`,
                  ),
                ],
                [
                  ["Update each coordinate", "逐个坐标更新"],
                  t(
                    `$x_1 = ${x0} - ${paren(stepX)} = ${x1.toLatex()}$ and $y_1 = ${y0} - ${paren(Q.of(2 * y0 - b, 2))} = ${y1.toLatex()}$.`,
                    `$x_1 = ${x0} - ${paren(stepX)} = ${x1.toLatex()}$，$y_1 = ${y0} - ${paren(Q.of(2 * y0 - b, 2))} = ${y1.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `$f_y = ${fy} = 0$ exactly, and $x_1^2 - ${a} = ${gap.toLatex()}$, ${gap.isZero() ? `so $x_1$ is exactly $\\sqrt{${a}}$` : `which is positive, so $x_1$ lies above $\\sqrt{${a}}$`}.`,
                `$f_y = ${fy} = 0$ 恰好成立，且 $x_1^2 - ${a} = ${gap.toLatex()}$，${gap.isZero() ? `所以 $x_1$ 恰为 $\\sqrt{${a}}$` : `它为正，所以 $x_1$ 大于 $\\sqrt{${a}}$`}。`,
              ),
            ),
          },
          mistakes.filter(([v], i, all) => v2L(v) !== v2L(answer) && all.findIndex(([w]) => v2L(w) === v2L(v)) === i),
        );
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Exported list of all Unit 2 topics
// ---------------------------------------------------------------------------

/** multivariableCalculusMultivariableFunctionTopics contains all Unit 2 topics of Multivariable Calculus. */
export const multivariableCalculusMultivariableFunctionTopics: readonly TopicDef[] = [
  interiorAndBoundaryPoints,
  interiorsAndBoundariesOfSets,
  openAndClosedSets,
  theDomainOfAMultivariableFunction,
  levelCurves,
  levelSurfaces,
  limitsAndContinuityOfMultivariableFunctions,
  ellipsoids,
  hyperboloids,
  paraboloids,
  ellipticCones,
  cylinders,
  intersectionsOfLinesAndPlanesWithSurfaces,
  identifyingQuadricSurfaces,
  introductionToPartialDerivatives,
  computingPartialDerivativesUsingTheRulesOfDifferentiation,
  geometricInterpretationsOfPartialDerivatives,
  partialDifferentiabilityOfMultivariableFunctions,
  higherOrderPartialDerivatives,
  equalityOfMixedPartialDerivatives,
  tangentPlanesToSurfaces,
  linearizationOfMultivariableFunctions,
  differentiatingUnderTheIntegralSign,
  theGradientVector,
  theGradientAsANormalVector,
  tangentLinesToLevelCurves,
  tangentPlanesToLevelSurfaces,
  directionalDerivatives,
  theMultivariableMeanValueTheorem,
  theMultivariableChainRule,
  theMultivariableChainRuleWithPolarCoordinates,
  theMultivariableChainRuleInVectorForm,
  differentials,
  affineTransformations,
  theImageOfAnAffineTransformation,
  theInverseOfAnAffineTransformation,
  nonlinearTransformationsOfPlaneRegions,
  polarCoordinateTransformations,
  transformationsOfRegionsBetweenCurves,
  theJacobian,
  theInverseFunctionTheorem,
  theJacobianOfAThreeDimensionalTransformation,
  theDerivativeOfAMultivariableFunction,
  theSecondDerivativeOfAMultivariableFunction,
  secondDegreeTaylorPolynomialsOfMultivariableFunctions,
  globalVsLocalExtremaAndCriticalPointsOfMultivariableFunctions,
  theSecondPartialDerivativesTest,
  calculatingGlobalExtremaOfMultivariableFunctions,
  lagrangeMultipliersWithOneConstraint,
  lagrangeMultipliersWithMultipleConstraints,
  optimizingMultivariableFunctionsUsingLagrangeMultipliers,
  newtonsMethodForMultivariableFunctions,
  newtonsMethodForOptimizingMultivariableFunctions,
];
