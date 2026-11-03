import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { paren, poly, Q } from "@ga/subject-math";

import { choiceProblem, equationProblem, expressionProblem, numberProblem, pointProblem, steps, vectorLatex } from "../problems.ts";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type Vec2 = readonly [number, number];
type Vec3 = readonly [number, number, number];

const v2L = (v: readonly (number | Q)[]): string => `(${v.map((c) => (c instanceof Q ? c.toLatex() : String(c))).join(", ")})`;
const v3L = (v: readonly (number | Q)[]): string => vectorLatex(v);

/** pickChoice builds a multiple choice problem with options shuffled. */
function pickChoice(rng: Rng, prompt: Text, right: Text, wrong: readonly Text[], solution: Text): Problem {
  const options = rng.shuffle([right, ...wrong]);
  const correct = options.indexOf(right);
  return choiceProblem({ prompt, options, correct, solution });
}

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
  prerequisites: ["describing-sets-using-set-builder-notation"],
  encompasses: [{ topic: "describing-sets-using-set-builder-notation", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "classifying-points-relative-to-regions",
      title: t("Classifying points relative to regions", "判断点相对于区域的位置"),
      explanation: t(
        "For a set $S \\subset \\mathbb{R}^2$:\n\n- **Interior point**: There exists an $\\varepsilon > 0$ such that the open disk $B_\\varepsilon(\\mathbf{x}) \\subset S$.\n- **Boundary point**: For every $\\varepsilon > 0$, the disk $B_\\varepsilon(\\mathbf{x})$ contains both points in $S$ and points not in $S$.\n- **Exterior point**: An interior point of the complement $\\mathbb{R}^2 \\setminus S$.",
        "对于集合 $S \\subset \\mathbb{R}^2$：\n\n- **内点**：存在 $\\varepsilon > 0$ 使得开圆盘 $B_\\varepsilon(\\mathbf{x}) \\subset S$。\n- **边界点**：对任意 $\\varepsilon > 0$，开圆盘 $B_\\varepsilon(\\mathbf{x})$ 既包含 $S$ 中的点，也包含不属于 $S$ 的点。\n- **外点**：补集 $\\mathbb{R}^2 \\setminus S$ 的内点。",
      ),
      generate(rng: Rng): Problem {
        const [a, b, c] = rng.pick(pythagoreanTriples);
        // Scale so point (a, b) has distance c from origin
        const kind = rng.int(0, 2);
        // Region: S = { (x, y) : x^2 + y^2 < c^2 }
        const rSq = c * c;
        let pt: Vec2;
        let right: Text;
        let wrong: readonly Text[];
        let reason: Text;

        if (kind === 0) {
          // Interior: distance < c
          pt = [rng.int(-a + 1, a - 1), rng.int(-b + 1, b - 1)];
          right = t("Interior point", "内点");
          wrong = [t("Boundary point", "边界点"), t("Exterior point", "外点")];
          reason = t(
            `The distance squared is $(${pt[0]})^2 + (${pt[1]})^2 = ${pt[0] * pt[0] + pt[1] * pt[1]} < ${rSq}$, so an open disk around $(${pt[0]}, ${pt[1]})$ lies entirely inside $S$.`,
            `距离平方为 $(${pt[0]})^2 + (${pt[1]})^2 = ${pt[0] * pt[0] + pt[1] * pt[1]} < ${rSq}$，因此以 $(${pt[0]}, ${pt[1]})$ 为圆心的某个开圆盘完全位于 $S$ 内部。`,
          );
        } else if (kind === 1) {
          // Boundary: distance = c
          pt = [a, b];
          right = t("Boundary point", "边界点");
          wrong = [t("Interior point", "内点"), t("Exterior point", "外点")];
          reason = t(
            `The point satisfies $(${a})^2 + (${b})^2 = ${rSq}$, so every disk around it contains points inside and outside $S$.`,
            `该点满足 $(${a})^2 + (${b})^2 = ${rSq}$，因此以它为圆心的任意开圆盘都既包含 $S$ 内部的点也包含外部的点。`,
          );
        } else {
          // Exterior: distance > c
          pt = [a + rng.int(1, 3), b + rng.int(1, 3)];
          right = t("Exterior point", "外点");
          wrong = [t("Interior point", "内点"), t("Boundary point", "边界点")];
          reason = t(
            `The distance squared exceeds $${rSq}$, so the point lies strictly outside $S$.`,
            `距离平方超过 $${rSq}$，因此该点严格位于 $S$ 的外部。`,
          );
        }

        const prompt = t(
          `Consider the region $S = \\left\\{(x, y) \\in \\mathbb{R}^2 : x^2 + y^2 < ${rSq}\\right\\}$. Classify the point $(${pt[0]}, ${pt[1]})$.`,
          `考虑区域 $S = \\left\\{(x, y) \\in \\mathbb{R}^2 : x^2 + y^2 < ${rSq}\\right\\}$。判断点 $(${pt[0]}, ${pt[1]})$ 的类别。`,
        );
        const solution = t(
          `The point $(${pt[0]}, ${pt[1]})$ is an ${right.en.toLowerCase()} because ${reason.en}`,
          `点 $(${pt[0]}, ${pt[1]})$ 是${right["zh-CN"]}，因为${reason["zh-CN"]}`,
        );
        return pickChoice(rng, prompt, right, wrong, solution);
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
  prerequisites: ["interior-and-boundary-points"],
  encompasses: [{ topic: "interior-and-boundary-points", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "finding-the-boundary-curve-of-a-set",
      title: t("Finding the boundary curve of a set", "求集合的边界曲线"),
      explanation: t(
        "For a region defined by an inequality such as $g(x, y) \\le c$ or $g(x, y) < c$, the boundary $\\partial S$ is given by replacing the inequality with an equality: $g(x, y) = c$.",
        "对于由不等式如 $g(x, y) \\le c$ 或 $g(x, y) < c$ 定义的区域，其边界 $\\partial S$ 由将不等号替换为等号得到：$g(x, y) = c$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 8);
        const b = rng.int(2, 8);
        const k = a * a * b * b;
        const answer = `${poly([b * b, "x^2"], [a * a, "y^2"])} = ${k}`;

        const prompt = t(
          `Find the equation of the boundary curve $\\partial S$ for the elliptical region $S = \\left\\{(x, y) \\in \\mathbb{R}^2 : \\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} \\le 1\\right\\}$. Clear denominators so that the equation has the form $A x^2 + B y^2 = C$.`,
          `求椭圆区域 $S = \\left\\{(x, y) \\in \\mathbb{R}^2 : \\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} \\le 1\\right\\}$ 的边界曲线 $\\partial S$ 的方程。去分母使方程形式为 $A x^2 + B y^2 = C$。`,
        );
        const solution = t(
          steps(
            `The boundary curve $\\partial S$ is obtained by setting the defining inequality to an equality: $\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} = 1$.`,
            `Multiply through by the common denominator $${k}$ to obtain $${answer}$.`,
          ),
          steps(
            `边界曲线 $\\partial S$ 通过将不等式取等号得到：$\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} = 1$。`,
            `两边同乘公分母 $${k}$，得到 $${answer}$。`,
          ),
        );
        return equationProblem({
          prompt,
          solution,
          answer,
          wrong: [
            `${poly([a * a, "x^2"], [b * b, "y^2"])} = ${k}`,
            `${poly([b * b, "x^2"], [-a * a, "y^2"])} = ${k}`,
            `${poly([1, "x^2"], [1, "y^2"])} = ${k}`,
          ],
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
  prerequisites: ["interiors-and-boundaries-of-sets"],
  encompasses: [{ topic: "interiors-and-boundaries-of-sets", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "classifying-open-closed-neither",
      title: t("Classifying sets as open, closed, or neither", "将集合分类为开集、闭集或既非开亦非闭"),
      explanation: t(
        "A set $S \\subset \\mathbb{R}^2$ is:\n\n- **Open**: $S = \\operatorname{int}(S)$, meaning $S$ contains none of its boundary points (strict inequalities like $<$ or $>$).\n- **Closed**: $S$ contains all of its boundary points $\\partial S \\subset S$ (non-strict inequalities like $\\le$ or $\\ge$).\n- **Neither open nor closed**: $S$ contains some but not all of its boundary points.",
        "集合 $S \\subset \\mathbb{R}^2$：\n\n- **开集**：$S = \\operatorname{int}(S)$，即 $S$ 不包含任何边界点（严格不等式如 $<$ 或 $>$）。\n- **闭集**：$S$ 包含其全部边界点 $\\partial S \\subset S$（非严格不等式如 $\\le$ 或 $\\ge$）。\n- **既非开亦非闭**：$S$ 包含部分但非全部边界点。",
      ),
      generate(rng: Rng): Problem {
        const r1 = rng.int(1, 5);
        const r2 = rng.int(6, 12);
        const kind = rng.int(0, 2);

        let desc: Text;
        let right: Text;
        let wrong: readonly Text[];
        let reason: Text;

        if (kind === 0) {
          desc = t(`\\{(x, y) : ${r1 * r1} < x^2 + y^2 < ${r2 * r2}\\}`, `\\{(x, y) : ${r1 * r1} < x^2 + y^2 < ${r2 * r2}\\}`);
          right = t("Open set", "开集");
          wrong = [t("Closed set", "闭集"), t("Neither open nor closed", "既非开集亦非闭集")];
          reason = t("Both boundary circles are excluded by strict inequalities.", "两个边界圆均被严格不等式排除在外。");
        } else if (kind === 1) {
          desc = t(`\\{(x, y) : ${r1 * r1} \\le x^2 + y^2 \\le ${r2 * r2}\\}`, `\\{(x, y) : ${r1 * r1} \\le x^2 + y^2 \\le ${r2 * r2}\\}`);
          right = t("Closed set", "闭集");
          wrong = [t("Open set", "开集"), t("Neither open nor closed", "既非开集亦非闭集")];
          reason = t("Both boundary circles are included by non-strict inequalities.", "两个边界圆均通过非严格不等式包含在集合中。");
        } else {
          desc = t(`\\{(x, y) : ${r1 * r1} < x^2 + y^2 \\le ${r2 * r2}\\}`, `\\{(x, y) : ${r1 * r1} < x^2 + y^2 \\le ${r2 * r2}\\}`);
          right = t("Neither open nor closed", "既非开集亦非闭集");
          wrong = [t("Open set", "开集"), t("Closed set", "闭集")];
          reason = t("It contains the outer boundary circle but not the inner boundary circle.", "它包含外边界圆但不包含内边界圆。");
        }

        const prompt = t(
          `Classify the set $S = ${desc.en}$ as an open set, closed set, or neither.`,
          `将集合 $S = ${desc["zh-CN"]}$ 分类为开集、闭集或既非开亦非闭。`,
        );
        const solution = t(
          `The set is an ${right.en.toLowerCase()} because ${reason.en}`,
          `该集合为${right["zh-CN"]}，因为${reason["zh-CN"]}`,
        );
        return pickChoice(rng, prompt, right, wrong, solution);
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
  prerequisites: ["open-and-closed-sets"],
  encompasses: [{ topic: "open-and-closed-sets", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "determining-the-domain-of-a-multivariable-function",
      title: t("Determining the domain of a multivariable function", "求多元函数的定义域"),
      explanation: t(
        "To find the domain of a multivariable function, identify algebraic restrictions:\n\n- Radicands of even roots must be non-negative: $\\sqrt{g(x, y)} \\implies g(x, y) \\ge 0$.\n- Arguments of logarithms must be strictly positive: $\\ln(g(x, y)) \\implies g(x, y) > 0$.\n- Denominators must be non-zero.",
        "求多元函数的定义域需考虑代数限制条件：\n\n- 偶次根式被开方数必须非负：$\\sqrt{g(x, y)} \\implies g(x, y) \\ge 0$。\n- 对数真数必须严格为正：$\\ln(g(x, y)) \\implies g(x, y) > 0$。\n- 分母不得为零。",
      ),
      generate(rng: Rng): Problem {
        const R = rng.int(2, 35);
        const rSq = R * R;
        const answer = `x^2 + y^2 = ${rSq}`;

        const prompt = t(
          `Find the equation of the boundary of the domain of the function $f(x, y) = \\ln(${rSq} - x^2 - y^2)$. Express the boundary as an equation in $x$ and $y$.`,
          `求函数 $f(x, y) = \\ln(${rSq} - x^2 - y^2)$ 的定义域边界的方程。结果以含 $x$ 和 $y$ 的方程表示。`,
        );
        const solution = t(
          steps(
            `The natural logarithm requires its argument to be strictly positive: $${rSq} - x^2 - y^2 > 0 \\iff x^2 + y^2 < ${rSq}$.`,
            `The domain is the open disk of radius $${R}$ centered at the origin.`,
            `The boundary curve of this open disk is the circle $${answer}$.`,
          ),
          steps(
            `自然对数要求其真数严格为正：$${rSq} - x^2 - y^2 > 0 \\iff x^2 + y^2 < ${rSq}$。`,
            `定义域是以原点为圆心、半径为 $${R}$ 的开圆盘。`,
            `该开圆盘的边界曲线为圆 $${answer}$。`,
          ),
        );
        return equationProblem({
          prompt,
          solution,
          answer,
          wrong: [`x^2 + y^2 = ${R}`, `x^2 - y^2 = ${rSq}`, `x + y = ${R}`],
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
  prerequisites: ["the-domain-of-a-multivariable-function"],
  encompasses: [{ topic: "the-domain-of-a-multivariable-function", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "finding-equations-of-level-curves",
      title: t("Finding equations of level curves", "求等值线方程"),
      explanation: t(
        "A **level curve** (or contour line) of $z = f(x, y)$ represents all input points $(x, y)$ where the function takes a constant value $c$. Its equation in the $xy$-plane is simply:\n\n$$f(x, y) = c.$$",
        "$z = f(x, y)$ 的**等值线**（或等高线）表示函数值取常数 $c$ 的所有输入点 $(x, y)$ 的集合。其在 $xy$ 平面中的方程为：\n\n$$f(x, y) = c。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 6);
        const b = rng.int(1, 6);
        const c = rng.int(2, 20);
        const answer = `${poly([a, "x^2"], [b, "y^2"])} = ${c}`;

        const prompt = t(
          `Find the equation of the level curve of the function $f(x, y) = ${poly([a, "x^2"], [b, "y^2"])}$ corresponding to $c = ${c}$.`,
          `求函数 $f(x, y) = ${poly([a, "x^2"], [b, "y^2"])}$ 对应于 $c = ${c}$ 的等值线方程。`,
        );
        const solution = t(
          steps(`Set the function expression equal to the constant value $c = ${c}$:`, `$$f(x, y) = ${c} \\implies ${answer}.$$`),
          steps(`令函数表达式等于常数值 $c = ${c}$：`, `$$f(x, y) = ${c} \\implies ${answer}。$$`),
        );
        return equationProblem({
          prompt,
          solution,
          answer,
          wrong: [
            `${poly([a, "x"], [b, "y"])} = ${c}`,
            `${poly([a, "x^2"], [-b, "y^2"])} = ${c}`,
            `${poly([b, "x^2"], [a, "y^2"])} = ${c}`,
          ],
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
  prerequisites: ["level-curves"],
  encompasses: [{ topic: "level-curves", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "finding-equations-of-level-surfaces",
      title: t("Finding equations of level surfaces", "求等值面方程"),
      explanation: t(
        "A level surface is the three dimensional version of a contour line: all the points where the function takes one fixed value. A **level surface** of a three-variable function $w = F(x, y, z)$ consists of all points in $\\mathbb{R}^3$ where $F(x, y, z) = c$ for a constant $c$.",
        "等值面是等高线的三维版本：函数取同一个固定值的所有点。三元函数 $w = F(x, y, z)$ 的**等值面**由使 $F(x, y, z) = c$（$c$ 为常数）的所有三维空间点构成。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const b = rng.int(1, 5);
        const cCoeff = rng.int(1, 5);
        const k = rng.int(2, 25);
        const answer = `${poly([a, "x^2"], [b, "y^2"], [cCoeff, "z^2"])} = ${k}`;

        const prompt = t(
          `Find the equation of the level surface of $F(x, y, z) = ${poly([a, "x^2"], [b, "y^2"], [cCoeff, "z^2"])}$ for the constant $c = ${k}$.`,
          `求函数 $F(x, y, z) = ${poly([a, "x^2"], [b, "y^2"], [cCoeff, "z^2"])}$ 对应于常数 $c = ${k}$ 的等值面方程。`,
        );
        const solution = t(
          steps(`Set the function expression equal to the constant value $c = ${k}$:`, `$$F(x, y, z) = ${k} \\implies ${answer}.$$`),
          steps(`令函数表达式等于常数值 $c = ${k}$：`, `$$F(x, y, z) = ${k} \\implies ${answer}。$$`),
        );
        return equationProblem({
          prompt,
          solution,
          answer,
          wrong: [
            `${poly([a, "x"], [b, "y"], [cCoeff, "z"])} = ${k}`,
            `${poly([a, "x^2"], [b, "y^2"], [-cCoeff, "z^2"])} = ${k}`,
            `${poly([1, "x^2"], [1, "y^2"], [1, "z^2"])} = ${k}`,
          ],
        });
      },
    },
  ],
};

/** limitsAndContinuityOfMultivariableFunctions examines limits along paths. */
export const limitsAndContinuityOfMultivariableFunctions: TopicDef = {
  id: "limits-and-continuity-of-multivariable-functions",
  title: t("Limits and Continuity of Multivariable Functions", "多元函数的极限与连续性"),
  summary: t(
    "A multivariable limit exists only if the function approaches the same value along every possible path approaching the point.",
    "多元函数的极限存在，当且仅当函数沿所有可能趋近该点的路径都趋于同一个值。",
  ),
  prerequisites: ["level-surfaces", "the-finite-limit-of-a-function"],
  encompasses: [{ topic: "level-surfaces", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-limits-along-linear-paths",
      title: t("Evaluating limits along linear paths", "沿直线路径求极限"),
      explanation: t(
        "To test whether $\\lim_{(x, y) \\to (0, 0)} f(x, y)$ exists, approach $(0, 0)$ along lines $y = mx$. If the resulting limit depends on the slope $m$, the two-variable limit does not exist.",
        "为了检验 $\\lim_{(x, y) \\to (0, 0)} f(x, y)$ 是否存在，可沿直线 $y = mx$ 趋近 $(0, 0)$。若所得极限依赖于斜率 $m$，则该二元极限不存在。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-6, 6);
        const b = rng.int(1, 5);
        const c = rng.int(1, 5);
        const m = rng.int(1, 4);

        // f(x, y) = (a * x * y) / (b * x^2 + c * y^2)
        // Along y = mx: (a * m * x^2) / (b * x^2 + c * m^2 * x^2) = (a * m) / (b + c * m^2)
        const num = a * m;
        const den = b + c * m * m;
        const ans = Q.of(num, den);

        const prompt = t(
          `Find the limit of $f(x, y) = \\frac{${poly([a, "xy"])}}{${poly([b, "x^2"], [c, "y^2"])}}$ as $(x, y) \\to (0, 0)$ along the line $y = ${m === 1 ? "x" : `${m}x`}$.`,
          `求函数 $f(x, y) = \\frac{${poly([a, "xy"])}}{${poly([b, "x^2"], [c, "y^2"])}}$ 沿直线 $y = ${m === 1 ? "x" : `${m}x`}$ 当 $(x, y) \\to (0, 0)$ 时的极限值。`,
        );
        const solution = t(
          steps(
            `Substitute $y = ${m === 1 ? "x" : `${m}x`}$ into $f(x, y)$:\n\n` +
              `$$f(x, ${m === 1 ? "x" : `${m}x`}) = \\frac{${poly([a, "x"])}(${m === 1 ? "x" : `${m}x`})}{${poly([b, "x^2"])} + ${c}(${m === 1 ? "x" : `${m}x`})^2} = \\frac{${num}x^2}{${b}x^2 + ${c * m * m}x^2} = \\frac{${num}}{${den}} = ${ans.toLatex()}.$$`,
            `As $x \\to 0$, the value is identically $${ans.toLatex()}$.`,
          ),
          steps(
            `将 $y = ${m === 1 ? "x" : `${m}x`}$ 代入 $f(x, y)$：\n\n` +
              `$$f(x, ${m === 1 ? "x" : `${m}x`}) = \\frac{${poly([a, "x"])}(${m === 1 ? "x" : `${m}x`})}{${poly([b, "x^2"])} + ${c}(${m === 1 ? "x" : `${m}x`})^2} = \\frac{${num}x^2}{${b}x^2 + ${c * m * m}x^2} = \\frac{${num}}{${den}} = ${ans.toLatex()}。$$`,
            `当 $x \\to 0$ 时，该极限恒为 $${ans.toLatex()}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [Q.zero, Q.of(1), Q.of(a, b + c)],
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
  prerequisites: ["level-surfaces"],
  encompasses: [{ topic: "level-surfaces", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "intercepts-and-semi-axes-of-ellipsoids",
      title: t("Intercepts and semi-axes of ellipsoids", "椭球面的截距与半轴长"),
      explanation: t(
        "Setting two of the coordinates to zero shows where the ellipsoid crosses each axis, and those crossing distances are the semi axes. For the ellipsoid $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} + \\frac{z^2}{c^2} = 1$, the semi-axes lengths are $a, b, c$. The positive $x$-intercept occurs at $(a, 0, 0)$.",
        "令其中两个坐标为零，就能看出椭球面与各坐标轴的交点，这些交点到原点的距离就是半轴长。对于椭球面 $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} + \\frac{z^2}{c^2} = 1$，其半轴长分别为 $a, b, c$。正 $x$ 截距点位于 $(a, 0, 0)$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const c = rng.int(2, 9);
        const ans = a;

        const prompt = t(
          `Find the positive $x$-intercept of the ellipsoid $\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} + \\frac{z^2}{${c * c}} = 1$.`,
          `求椭球面 $\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} + \\frac{z^2}{${c * c}} = 1$ 的正 $x$ 截距。`,
        );
        const solution = t(
          steps(
            `Set $y = 0$ and $z = 0$ in the equation: $\\frac{x^2}{${a * a}} = 1 \\implies x^2 = ${a * a}$.`,
            `The positive $x$-intercept is $x = ${ans}$.`,
          ),
          steps(`在方程中令 $y = 0$ 且 $z = 0$：$\\frac{x^2}{${a * a}} = 1 \\implies x^2 = ${a * a}$。`, `正 $x$ 截距为 $x = ${ans}$。`),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [a * a, b, c],
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
  prerequisites: ["ellipsoids"],
  encompasses: [{ topic: "ellipsoids", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "counting-sheets-of-hyperboloids",
      title: t("Counting sheets of hyperboloids", "判断双曲面的叶数"),
      explanation: t(
        "Standard equations for hyperboloids:\n\n- **One sheet**: $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} - \\frac{z^2}{c^2} = 1$ (one minus sign, connected surface).\n- **Two sheets**: $-\\frac{x^2}{a^2} - \\frac{y^2}{b^2} + \\frac{z^2}{c^2} = 1$ (two minus signs, two disconnected pieces).",
        "双曲面的标准方程：\n\n- **单叶双曲面**：$\\frac{x^2}{a^2} + \\frac{y^2}{b^2} - \\frac{z^2}{c^2} = 1$（一个负号，连通曲面）。\n- **双叶双曲面**：$-\\frac{x^2}{a^2} - \\frac{y^2}{b^2} + \\frac{z^2}{c^2} = 1$（两个负号，两个不相连的分支）。",
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

        const prompt = t(`Determine the number of sheets (1 or 2) of the hyperboloid $${eq}$.`, `判断双曲面 $${eq}$ 的叶数（1 或 2）。`);
        const solution = t(
          twoSheets
            ? `The equation has two negative quadratic terms, representing a hyperboloid of 2 sheets.`
            : `The equation has one negative quadratic term, representing a hyperboloid of 1 sheet.`,
          twoSheets ? `方程包含两个负二次项，表示双叶双曲面（2 叶）。` : `方程包含一个负二次项，表示单叶双曲面（1 叶）。`,
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [ans === 1 ? 2 : 1, 0, 3],
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
  prerequisites: ["hyperboloids"],
  encompasses: [{ topic: "hyperboloids", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "classifying-paraboloids",
      title: t("Classifying paraboloids", "分类抛物面"),
      explanation: t(
        "Paraboloids feature one linear variable (usually $z$) and two quadratic variables:\n\n- **Elliptic paraboloid**: $z = \\frac{x^2}{a^2} + \\frac{y^2}{b^2}$ (bowl-shaped, traces are ellipses and parabolas).\n- **Hyperbolic paraboloid**: $z = \\frac{x^2}{a^2} - \\frac{y^2}{b^2}$ (saddle-shaped, traces are hyperbolas and parabolas).",
        "抛物面的特征是包含一个一次变量（通常为 $z$）和两个二次变量：\n\n- **椭圆抛物面**：$z = \\frac{x^2}{a^2} + \\frac{y^2}{b^2}$（碗状，截痕为椭圆与抛物线）。\n- **双曲抛物面**：$z = \\frac{x^2}{a^2} - \\frac{y^2}{b^2}$（马鞍状，截痕为双曲线与抛物线）。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 6);
        const b = rng.int(2, 6);
        const isElliptic = rng.bool();

        const eq = isElliptic ? `z = \\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}}` : `z = \\frac{x^2}{${a * a}} - \\frac{y^2}{${b * b}}`;

        const right = isElliptic ? t("Elliptic paraboloid", "椭圆抛物面") : t("Hyperbolic paraboloid", "双曲抛物面");
        const wrong = isElliptic
          ? [t("Hyperbolic paraboloid", "双曲抛物面"), t("Ellipsoid", "椭球面"), t("Elliptic cone", "椭圆锥面")]
          : [t("Elliptic paraboloid", "椭圆抛物面"), t("Hyperboloid of one sheet", "单叶双曲面"), t("Elliptic cone", "椭圆锥面")];

        const prompt = t(`Classify the quadric surface defined by the equation $${eq}$.`, `对由方程 $${eq}$ 定义的二次曲面进行分类。`);
        const solution = t(
          `The equation has one linear variable and two squared variables with ${isElliptic ? "the same sign" : "opposite signs"}, so it is an ${right.en.toLowerCase()}.`,
          `该方程包含一个一次变量与两个${isElliptic ? "同号" : "异号"}的平方项，因此它是${right["zh-CN"]}。`,
        );
        return pickChoice(rng, prompt, right, wrong, solution);
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
  prerequisites: ["paraboloids"],
  encompasses: [{ topic: "paraboloids", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "analyzing-traces-of-elliptic-cones",
      title: t("Analyzing traces of elliptic cones", "分析椭圆锥面的截痕"),
      explanation: t(
        "Slicing a surface with a plane shows its cross sections; for a cone, horizontal slices are ellipses that grow as the plane moves away from the vertex. For the cone $z^2 = \\frac{x^2}{a^2} + \\frac{y^2}{b^2}$, intersecting with horizontal planes $z = k$ yields the ellipse $\\frac{x^2}{(ak)^2} + \\frac{y^2}{(bk)^2} = 1$ with semi-axes $a|k|$ and $b|k|$.",
        "用平面截曲面可以看到它的截面；对于锥面，水平截面是椭圆，平面离顶点越远，椭圆越大。对于椭圆锥面 $z^2 = \\frac{x^2}{a^2} + \\frac{y^2}{b^2}$，与水平面 $z = k$ 相交得到椭圆 $\\frac{x^2}{(ak)^2} + \\frac{y^2}{(bk)^2} = 1$，其半轴长分别为 $a|k|$ 和 $b|k|$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 6);
        const b = rng.int(2, 6);
        const k = rng.int(2, 5);
        const ans = a * k;

        const prompt = t(
          `Find the length of the semi-horizontal axis in the $x$-direction for the elliptical trace of the cone $z^2 = \\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}}$ at the plane $z = ${k}$.`,
          `求椭圆锥面 $z^2 = \\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}}$ 与平面 $z = ${k}$ 相交所得椭圆截痕在 $x$ 方向的半轴长。`,
        );
        const solution = t(
          steps(
            `Substitute $z = ${k}$ into the equation: $(${k})^2 = \\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} \\implies ${k * k} = \\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}}$.`,
            `Divide by $${k * k}$: $\\frac{x^2}{${a * a * k * k}} + \\frac{y^2}{${b * b * k * k}} = 1$.`,
            `The semi-axis in the $x$-direction is $\\sqrt{${a * a * k * k}} = ${ans}$.`,
          ),
          steps(
            `将 $z = ${k}$ 代入方程：$(${k})^2 = \\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} \\implies ${k * k} = \\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}}$。`,
            `两边同除以 $${k * k}$：$\\frac{x^2}{${a * a * k * k}} + \\frac{y^2}{${b * b * k * k}} = 1$。`,
            `在 $x$ 方向的半轴长为 $\\sqrt{${a * a * k * k}} = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [a, k, ans * ans],
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
  prerequisites: ["elliptic-cones"],
  encompasses: [{ topic: "elliptic-cones", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "identifying-cylinders-and-their-rulings",
      title: t("Identifying cylinders and their rulings", "识别柱面及其母线方向"),
      explanation: t(
        "In $\\mathbb{R}^3$, an equation involving only two of the three variables represents a cylinder whose rulings are parallel to the axis of the missing variable. For example, $x^2 + y^2 = r^2$ has rulings parallel to the $z$-axis.",
        "在 $\\mathbb{R}^3$ 中，仅包含三个坐标变量中两个变量的方程表示母线平行于缺失变量坐标轴的柱面。例如 $x^2 + y^2 = r^2$ 的母线平行于 $z$ 轴。",
      ),
      generate(rng: Rng): Problem {
        const r = rng.int(2, 25);
        const missing = rng.pick(["x", "y", "z"] as const);

        let eq: string;
        let right: Text;
        let wrong: readonly Text[];

        if (missing === "z") {
          eq = `x^2 + y^2 = ${r * r}`;
          right = t("z-axis", "z 轴");
          wrong = [t("x-axis", "x 轴"), t("y-axis", "y 轴"), t("Line y = x", "直线 y = x")];
        } else if (missing === "y") {
          eq = `x^2 + z^2 = ${r * r}`;
          right = t("y-axis", "y 轴");
          wrong = [t("x-axis", "x 轴"), t("z-axis", "z 轴"), t("Line z = x", "直线 z = x")];
        } else {
          eq = `y^2 + z^2 = ${r * r}`;
          right = t("x-axis", "x 轴");
          wrong = [t("y-axis", "y 轴"), t("z-axis", "z 轴"), t("Line z = y", "直线 z = y")];
        }

        const prompt = t(
          `In $\\mathbb{R}^3$, the surface defined by $${eq}$ is a circular cylinder. The rulings of this cylinder are parallel to which coordinate axis?`,
          `在 $\\mathbb{R}^3$ 中，由方程 $${eq}$ 定义的曲面为圆柱面。该柱面的母线平行于哪个坐标轴？`,
        );
        const solution = t(
          `The equation lacks the variable $${missing}$, so the rulings are parallel to the ${right.en}.`,
          `方程中缺失变量 $${missing}$，因此其母线平行于 ${right["zh-CN"]}。`,
        );
        return pickChoice(rng, prompt, right, wrong, solution);
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
  prerequisites: ["cylinders"],
  encompasses: [{ topic: "cylinders", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "calculating-radius-of-circular-traces",
      title: t("Calculating the radius of circular traces", "计算圆形截痕的半径"),
      explanation: t(
        "Substituting the height of the plane into the equation of the sphere leaves the equation of a circle, whose radius shrinks as the plane moves away from the center. Intersecting the sphere $x^2 + y^2 + z^2 = R^2$ with the plane $z = h$ (where $|h| < R$) produces the circle $x^2 + y^2 = R^2 - h^2$ with radius $r = \\sqrt{R^2 - h^2}$.",
        "把平面的高度代入球面方程，就得到一个圆的方程，平面离球心越远，圆的半径越小。用平面 $z = h$（其中 $|h| < R$）截球面 $x^2 + y^2 + z^2 = R^2$，得到的交线为圆 $x^2 + y^2 = R^2 - h^2$，其半径为 $r = \\sqrt{R^2 - h^2}$。",
      ),
      generate(rng: Rng): Problem {
        const [h0, r0, R0] = rng.pick(pythagoreanTriples);
        const k = rng.int(1, 4);
        const h = h0 * k;
        const r = r0 * k;
        const R = R0 * k;
        const axis = rng.pick(["x", "y", "z"] as const);
        const ans = r;

        const otherVars = axis === "z" ? "x^2 + y^2" : axis === "y" ? "x^2 + z^2" : "y^2 + z^2";

        const prompt = t(
          `Find the radius of the circular cross section formed by the intersection of the sphere $x^2 + y^2 + z^2 = ${R * R}$ with the plane $${axis} = ${h}$.`,
          `求球面 $x^2 + y^2 + z^2 = ${R * R}$ 与平面 $${axis} = ${h}$ 相交所得圆形截面的半径。`,
        );
        const solution = t(
          steps(
            `Substitute $${axis} = ${h}$ into the sphere equation: $${otherVars} + (${h})^2 = ${R * R} \\implies ${otherVars} + ${h * h} = ${R * R}$.`,
            `Subtract $${h * h}$ from both sides: $${otherVars} = ${R * R - h * h} = ${r * r}$.`,
            `The radius of the intersection circle is $r = \\sqrt{${r * r}} = ${ans}$.`,
          ),
          steps(
            `将 $${axis} = ${h}$ 代入球面方程：$${otherVars} + (${h})^2 = ${R * R} \\implies ${otherVars} + ${h * h} = ${R * R}$。`,
            `两边减去 $${h * h}$：$${otherVars} = ${R * R - h * h} = ${r * r}$。`,
            `交线圆的半径为 $r = \\sqrt{${r * r}} = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [R, h, R - h],
        });
      },
    },
  ],
};

/** identifyingQuadricSurfaces classifies general quadric surfaces from standard equations. */
export const identifyingQuadricSurfaces: TopicDef = {
  id: "identifying-quadric-surfaces",
  title: t("Identifying Quadric Surfaces", "二次曲面的识别"),
  summary: t(
    "Quadric surfaces are identified by examining the signs of quadratic terms and whether linear terms appear.",
    "通过分析二次项的符号以及是否包含一次项来识别二次曲面的类型。",
  ),
  prerequisites: ["intersections-of-lines-and-planes-with-surfaces"],
  encompasses: [{ topic: "intersections-of-lines-and-planes-with-surfaces", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "recognizing-quadric-surfaces-from-equations",
      title: t("Recognizing quadric surfaces from equations", "根据方程识别二次曲面"),
      explanation: t(
        "Standard forms of quadric surfaces:\n\n- Ellipsoid: $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} + \\frac{z^2}{c^2} = 1$.\n- Hyperboloid of 1 sheet: $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} - \\frac{z^2}{c^2} = 1$.\n- Hyperboloid of 2 sheets: $-\\frac{x^2}{a^2} - \\frac{y^2}{b^2} + \\frac{z^2}{c^2} = 1$.\n- Elliptic cone: $\\frac{z^2}{c^2} = \\frac{x^2}{a^2} + \\frac{y^2}{b^2}$.\n- Elliptic paraboloid: $z = \\frac{x^2}{a^2} + \\frac{y^2}{b^2}$.\n- Hyperbolic paraboloid: $z = \\frac{x^2}{a^2} - \\frac{y^2}{b^2}$.",
        "二次曲面的标准形式：\n\n- 椭球面：$\\frac{x^2}{a^2} + \\frac{y^2}{b^2} + \\frac{z^2}{c^2} = 1$。\n- 单叶双曲面：$\\frac{x^2}{a^2} + \\frac{y^2}{b^2} - \\frac{z^2}{c^2} = 1$。\n- 双叶双曲面：$-\\frac{x^2}{a^2} - \\frac{y^2}{b^2} + \\frac{z^2}{c^2} = 1$。\n- 椭圆锥面：$\\frac{z^2}{c^2} = \\frac{x^2}{a^2} + \\frac{y^2}{b^2}$。\n- 椭圆抛物面：$z = \\frac{x^2}{a^2} + \\frac{y^2}{b^2}$。\n- 双曲抛物面：$z = \\frac{x^2}{a^2} - \\frac{y^2}{b^2}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 5);
        const b = rng.int(2, 5);
        const c = rng.int(2, 5);
        const kind = rng.int(0, 5);

        let eq: string;
        let right: Text;
        let wrong: readonly Text[];

        switch (kind) {
          case 0:
            eq = `\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} + \\frac{z^2}{${c * c}} = 1`;
            right = t("Ellipsoid", "椭球面");
            wrong = [t("Hyperboloid of one sheet", "单叶双曲面"), t("Elliptic paraboloid", "椭圆抛物面"), t("Elliptic cone", "椭圆锥面")];
            break;
          case 1:
            eq = `\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} - \\frac{z^2}{${c * c}} = 1`;
            right = t("Hyperboloid of one sheet", "单叶双曲面");
            wrong = [t("Hyperboloid of two sheets", "双叶双曲面"), t("Ellipsoid", "椭球面"), t("Hyperbolic paraboloid", "双曲抛物面")];
            break;
          case 2:
            eq = `-\\frac{x^2}{${a * a}} - \\frac{y^2}{${b * b}} + \\frac{z^2}{${c * c}} = 1`;
            right = t("Hyperboloid of two sheets", "双叶双曲面");
            wrong = [t("Hyperboloid of one sheet", "单叶双曲面"), t("Elliptic paraboloid", "椭圆抛物面"), t("Ellipsoid", "椭球面")];
            break;
          case 3:
            eq = `z = \\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}}`;
            right = t("Elliptic paraboloid", "椭圆抛物面");
            wrong = [t("Hyperbolic paraboloid", "双曲抛物面"), t("Ellipsoid", "椭球面"), t("Elliptic cone", "椭圆锥面")];
            break;
          case 4:
            eq = `z = \\frac{x^2}{${a * a}} - \\frac{y^2}{${b * b}}`;
            right = t("Hyperbolic paraboloid", "双曲抛物面");
            wrong = [t("Elliptic paraboloid", "椭圆抛物面"), t("Hyperboloid of one sheet", "单叶双曲面"), t("Elliptic cone", "椭圆锥面")];
            break;
          default:
            eq = `\\frac{z^2}{${c * c}} = \\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}}`;
            right = t("Elliptic cone", "椭圆锥面");
            wrong = [t("Ellipsoid", "椭球面"), t("Elliptic paraboloid", "椭圆抛物面"), t("Hyperboloid of one sheet", "单叶双曲面")];
            break;
        }

        const prompt = t(`Identify the quadric surface defined by the equation $${eq}$.`, `识别由方程 $${eq}$ 定义的二次曲面。`);
        const solution = t(`The equation $${eq}$ represents an ${right.en.toLowerCase()}.`, `方程 $${eq}$ 表示一个${right["zh-CN"]}。`);
        return pickChoice(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Export list for Unit 2 (first 14 topics so far)
// ---------------------------------------------------------------------------

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
  prerequisites: ["identifying-quadric-surfaces", "defining-the-derivative-using-derivative-notation"],
  encompasses: [{ topic: "identifying-quadric-surfaces", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-first-partial-derivatives-at-a-point",
      title: t("Evaluating first partial derivatives at a point", "在某点处求一阶偏导数"),
      explanation: t(
        "To find $\\frac{\\partial f}{\\partial x}$, treat $y$ as a constant and differentiate with respect to $x$ using ordinary single-variable rules:\n\n$$\\frac{\\partial f}{\\partial x}(x_0, y_0) = \\lim_{h \\to 0} \\frac{f(x_0 + h, y_0) - f(x_0, y_0)}{h}.$$",
        "求 $\\frac{\\partial f}{\\partial x}$ 时，将 $y$ 视为常数，利用普通一元求导法则对 $x$ 求导：\n\n$$\\frac{\\partial f}{\\partial x}(x_0, y_0) = \\lim_{h \\to 0} \\frac{f(x_0 + h, y_0) - f(x_0, y_0)}{h}。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-4, 4);
        const b = rng.nonZero(-4, 4);
        const x0 = rng.int(-2, 3);
        const y0 = rng.int(-2, 3);

        // f(x, y) = a * x^2 * y + b * x * y^2
        // f_x(x, y) = 2*a*x*y + b*y^2
        const ans = 2 * a * x0 * y0 + b * y0 * y0;

        const prompt = t(
          `Find the partial derivative $f_x(${x0}, ${y0})$ for the function $f(x, y) = ${poly([a, "x^2y"], [b, "xy^2"])}$ at the point $(${x0}, ${y0})$.`,
          `求函数 $f(x, y) = ${poly([a, "x^2y"], [b, "xy^2"])}$ 在点 $(${x0}, ${y0})$ 处的偏导数 $f_x(${x0}, ${y0})$。`,
        );
        const solution = t(
          steps(
            `Treat $y$ as a constant and differentiate with respect to $x$:\n\n` +
              `$$f_x(x, y) = \\frac{\\partial}{\\partial x}\\left(${poly([a, "x^2y"], [b, "xy^2"])}\\right) = ${poly([2 * a, "xy"], [b, "y^2"])}.$$`,
            `Substitute $(x, y) = (${x0}, ${y0})$:\n\n` +
              `$$f_x(${x0}, ${y0}) = 2(${a})(${x0})(${y0}) + (${b})(${y0})^2 = ${2 * a * x0 * y0} + ${paren(b * y0 * y0)} = ${ans}.$$`,
          ),
          steps(
            `将 $y$ 视为常数对 $x$ 求导：\n\n` +
              `$$f_x(x, y) = \\frac{\\partial}{\\partial x}\\left(${poly([a, "x^2y"], [b, "xy^2"])}\\right) = ${poly([2 * a, "xy"], [b, "y^2"])}。$$`,
            `代入点 $(x, y) = (${x0}, ${y0})$：\n\n` +
              `$$f_x(${x0}, ${y0}) = 2(${a})(${x0})(${y0}) + (${b})(${y0})^2 = ${2 * a * x0 * y0} + ${paren(b * y0 * y0)} = ${ans}。$$`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [a * x0 * y0 + 2 * b * x0 * y0, -ans, ans + 1],
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
  prerequisites: ["introduction-to-partial-derivatives"],
  encompasses: [{ topic: "introduction-to-partial-derivatives", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "symbolic-partial-differentiation",
      title: t("Symbolic partial differentiation", "符号偏导数计算"),
      explanation: t(
        "A partial derivative measures change in one variable while the others are held fixed, so treat every other variable exactly as you would treat a constant. Apply standard differentiation rules while treating inactive variables as constant multipliers or independent constants:\n\n$$\\frac{\\partial}{\\partial x}[x^m y^n] = m x^{m-1} y^n, \\quad \\frac{\\partial}{\\partial y}[x^m y^n] = n x^m y^{n-1}.$$",
        "偏导数衡量只改变一个变量而其他变量固定时的变化，所以把其他变量完全当作常数来处理。在将非目标变量视为常数乘子或常数项的同时，应用标准求导法则：\n\n$$\\frac{\\partial}{\\partial x}[x^m y^n] = m x^{m-1} y^n, \\quad \\frac{\\partial}{\\partial y}[x^m y^n] = n x^m y^{n-1}。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-5, 5);
        const b = rng.nonZero(-5, 5);
        const c = rng.nonZero(-5, 5);

        // f(x, y) = a * x^3 + b * x^2 * y + c * y^3
        // f_x(x, y) = 3a * x^2 + 2b * x * y
        const ans = poly([3 * a, "x^2"], [2 * b, "xy"]);

        const prompt = t(
          `Find the partial derivative $f_x(x, y)$ of $f(x, y) = ${poly([a, "x^3"], [b, "x^2y"], [c, "y^3"])}$.`,
          `求函数 $f(x, y) = ${poly([a, "x^3"], [b, "x^2y"], [c, "y^3"])}$ 的偏导数 $f_x(x, y)$。`,
        );
        const solution = t(
          steps(
            `Differentiate each term with respect to $x$, treating $y$ as a constant:`,
            `$\\frac{\\partial}{\\partial x}(${poly([a, "x^3"])}) = ${poly([3 * a, "x^2"])}$`,
            `$\\frac{\\partial}{\\partial x}(${poly([b, "x^2y"])}) = ${poly([2 * b, "xy"])}$`,
            `$\\frac{\\partial}{\\partial x}(${poly([c, "y^3"])}) = 0$`,
            `Combine the terms: $f_x(x, y) = ${ans}$.`,
          ),
          steps(
            `将 $y$ 视为常数对各项关于 $x$ 求导：`,
            `$\\frac{\\partial}{\\partial x}(${poly([a, "x^3"])}) = ${poly([3 * a, "x^2"])}$`,
            `$\\frac{\\partial}{\\partial x}(${poly([b, "x^2y"])}) = ${poly([2 * b, "xy"])}$`,
            `$\\frac{\\partial}{\\partial x}(${poly([c, "y^3"])}) = 0$`,
            `合并得到：$f_x(x, y) = ${ans}$。`,
          ),
        );
        return expressionProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [poly([a, "x^2"], [b, "xy"]), poly([3 * a, "x^2"], [2 * b, "xy"], [3 * c, "y^2"]), poly([2 * b, "x^2"], [3 * c, "y^2"])],
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
  prerequisites: ["introduction-to-partial-derivatives"],
  encompasses: [{ topic: "introduction-to-partial-derivatives", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "slopes-of-surface-cross-sections",
      title: t("Slopes of surface cross sections", "曲面截痕的切线斜率"),
      explanation: t(
        "Geometrically, slicing the surface $z = f(x, y)$ by the vertical plane $y = y_0$ produces a curve $z = f(x, y_0)$. The slope of the tangent line to this curve in the $x$-direction is precisely $f_x(x_0, y_0)$.",
        "几何上，用垂直平面 $y = y_0$ 切割曲面 $z = f(x, y)$ 会得到曲线 $z = f(x, y_0)$。该曲线在 $x$ 方向切线的斜率恰好是 $f_x(x_0, y_0)$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-4, 4);
        const b = rng.nonZero(-4, 4);
        const x0 = rng.int(-3, 3);
        const y0 = rng.int(-3, 3);
        // z = a * x^2 + b * y^2
        // In plane y = y0, curve is z = a * x^2 + b * y0^2, slope dz/dx = 2*a*x0
        const ans = 2 * a * x0;

        const prompt = t(
          `Find the slope of the tangent line to the cross section of the surface $z = ${poly([a, "x^2"], [b, "y^2"])}$ cut by the plane $y = ${y0}$ at the point where $x = ${x0}$.`,
          `求曲面 $z = ${poly([a, "x^2"], [b, "y^2"])}$ 与平面 $y = ${y0}$ 相交截痕在 $x = ${x0}$ 处的切线斜率。`,
        );
        const solution = t(
          steps(
            `The slope of the tangent line in the plane $y = ${y0}$ is given by the partial derivative with respect to $x$:\n\n` +
              `$$\\frac{\\partial z}{\\partial x} = \\frac{\\partial}{\\partial x}\\left(${poly([a, "x^2"], [b, "y^2"])}\\right) = ${2 * a}x.$$`,
            `Evaluating at $x = ${x0}$ yields the slope $m = ${2 * a}(${x0}) = ${ans}$.`,
          ),
          steps(
            `平面 $y = ${y0}$ 中切线的斜率由对 $x$ 的偏导数给出：\n\n` +
              `$$\\frac{\\partial z}{\\partial x} = \\frac{\\partial}{\\partial x}\\left(${poly([a, "x^2"], [b, "y^2"])}\\right) = ${2 * a}x。$$`,
            `在 $x = ${x0}$ 处求值得到斜率 $m = ${2 * a}(${x0}) = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [2 * b * y0, a * x0, -ans],
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
  prerequisites: ["computing-partial-derivatives-using-the-rules-of-differentiation"],
  encompasses: [{ topic: "computing-partial-derivatives-using-the-rules-of-differentiation", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "sufficient-condition-for-differentiability",
      title: t("Sufficient condition for differentiability", "可微性的充分条件"),
      explanation: t(
        "A function $z = f(x, y)$ is **differentiable** at $(a, b)$ if $\\Delta z = f_x(a, b)\\Delta x + f_y(a, b)\\Delta y + \\varepsilon_1 \\Delta x + \\varepsilon_2 \\Delta y$, where $\\varepsilon_1, \\varepsilon_2 \\to 0$ as $(\\Delta x, \\Delta y) \\to (0, 0)$. A fundamental theorem states: if the partial derivatives $f_x$ and $f_y$ exist near $(a, b)$ and are continuous at $(a, b)$, then $f$ is differentiable at $(a, b)$.",
        "若 $\\Delta z = f_x(a, b)\\Delta x + f_y(a, b)\\Delta y + \\varepsilon_1 \\Delta x + \\varepsilon_2 \\Delta y$（其中当 $(\\Delta x, \\Delta y) \\to (0, 0)$ 时 $\\varepsilon_1, \\varepsilon_2 \\to 0$），则称函数 $z = f(x, y)$ 在 $(a, b)$ 处**可微**。基本定理表明：若偏导数 $f_x$ 与 $f_y$ 在 $(a, b)$ 附近存在且在 $(a, b)$ 处连续，则 $f$ 在 $(a, b)$ 处可微。",
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

        const prompt = t(
          `Since $f_x$ and $f_y$ are continuous everywhere on $\\mathbb{R}^2$, the function $f(x, y) = ${poly([a, "x^2"], [b, "y^2"], [c, "xy"])}$ is differentiable at all points. Calculate $f_x(${x0}, ${y0}) + f_y(${x0}, ${y0})$.`,
          `由于 $f_x$ 与 $f_y$ 在 $\\mathbb{R}^2$ 上处处连续，因此函数 $f(x, y) = ${poly([a, "x^2"], [b, "y^2"], [c, "xy"])}$ 在所有点处均可微。计算 $f_x(${x0}, ${y0}) + f_y(${x0}, ${y0})$。`,
        );
        const solution = t(
          steps(
            `The partial derivatives are $f_x(x, y) = ${poly([2 * a, "x"], [c, "y"])}$ and $f_y(x, y) = ${poly([2 * b, "y"], [c, "x"])}$.`,
            `Because these are continuous polynomials, $f$ is differentiable at $(${x0}, ${y0})$ by the sufficient condition for differentiability.`,
            `Evaluate at $(${x0}, ${y0})$: $f_x(${x0}, ${y0}) = ${fx}$ and $f_y(${x0}, ${y0}) = ${fy}$.`,
            `Summing them yields $f_x(${x0}, ${y0}) + f_y(${x0}, ${y0}) = ${fx} + (${fy}) = ${ans}$.`,
          ),
          steps(
            `偏导数为 $f_x(x, y) = ${poly([2 * a, "x"], [c, "y"])}$ 与 $f_y(x, y) = ${poly([2 * b, "y"], [c, "x"])}$。`,
            `因为多项式偏导数连续，根据可微性的充分条件，$f$ 在 $(${x0}, ${y0})$ 处可微。`,
            `在 $(${x0}, ${y0})$ 处求值：$f_x(${x0}, ${y0}) = ${fx}$ 且 $f_y(${x0}, ${y0}) = ${fy}$。`,
            `求和得到 $f_x(${x0}, ${y0}) + f_y(${x0}, ${y0}) = ${fx} + (${fy}) = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [fx, fy, ans + 2],
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
  prerequisites: ["computing-partial-derivatives-using-the-rules-of-differentiation"],
  encompasses: [{ topic: "computing-partial-derivatives-using-the-rules-of-differentiation", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "computing-second-pure-partial-derivatives",
      title: t("Computing second pure partial derivatives", "计算二阶纯偏导数"),
      explanation: t(
        "Differentiate the first partial derivative again with respect to the same variable, still treating the other variables as constants. The second pure partial derivative $f_{xx}$ is defined as:\n\n$$f_{xx} = \\frac{\\partial^2 f}{\\partial x^2} = \\frac{\\partial}{\\partial x}\\left(\\frac{\\partial f}{\\partial x}\\right).$$",
        "把一阶偏导数再对同一个变量求导，仍然把其他变量当作常数。二阶纯偏导数 $f_{xx}$ 定义为：\n\n$$f_{xx} = \\frac{\\partial^2 f}{\\partial x^2} = \\frac{\\partial}{\\partial x}\\left(\\frac{\\partial f}{\\partial x}\\right)。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-4, 4);
        const b = rng.nonZero(-4, 4);
        const c = rng.nonZero(-4, 4);
        const x0 = rng.int(-2, 2);
        const y0 = rng.int(-2, 2);

        // f(x, y) = a * x^3 + b * x^2 * y + c * y^3
        // f_x = 3a * x^2 + 2b * x * y
        // f_xx = 6a * x + 2b * y
        const ans = 6 * a * x0 + 2 * b * y0;

        const prompt = t(
          `Calculate the second partial derivative $f_{xx}(${x0}, ${y0})$ for the function $f(x, y) = ${poly([a, "x^3"], [b, "x^2y"], [c, "y^3"])}$ at the point $(${x0}, ${y0})$.`,
          `计算函数 $f(x, y) = ${poly([a, "x^3"], [b, "x^2y"], [c, "y^3"])}$ 在点 $(${x0}, ${y0})$ 处的二阶偏导数 $f_{xx}(${x0}, ${y0})$。`,
        );
        const solution = t(
          steps(
            `First partial with respect to $x$: $f_x(x, y) = ${poly([3 * a, "x^2"], [2 * b, "xy"])}$.`,
            `Differentiate again with respect to $x$: $f_{xx}(x, y) = ${poly([6 * a, "x"], [2 * b, "y"])}$.`,
            `Substitute $(x, y) = (${x0}, ${y0})$: $f_{xx}(${x0}, ${y0}) = 6(${a})(${x0}) + 2(${b})(${y0}) = ${ans}$.`,
          ),
          steps(
            `对 $x$ 的一阶偏导数：$f_x(x, y) = ${poly([3 * a, "x^2"], [2 * b, "xy"])}$。`,
            `再次对 $x$ 求导：$f_{xx}(x, y) = ${poly([6 * a, "x"], [2 * b, "y"])}$。`,
            `代入点 $(x, y) = (${x0}, ${y0})$：$f_{xx}(${x0}, ${y0}) = 6(${a})(${x0}) + 2(${b})(${y0}) = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [3 * a * x0 * x0 + 2 * b * x0 * y0, -ans, 6 * a * x0],
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
  prerequisites: ["higher-order-partial-derivatives"],
  encompasses: [{ topic: "higher-order-partial-derivatives", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "applying-clairauts-theorem",
      title: t("Applying Clairaut's Theorem", "应用克莱罗定理"),
      explanation: t(
        "**Clairaut's Theorem** (Schwarz's Theorem): If $f(x, y)$ is defined on an open disk containing $(a, b)$, and $f_{xy}$ and $f_{yx}$ are both continuous on that disk, then:\n\n$$f_{xy}(a, b) = f_{yx}(a, b).$$",
        "**克莱罗定理**（施瓦茨定理）：若 $f(x, y)$ 在包含点 $(a, b)$ 的开圆盘上有定义，且 $f_{xy}$ 与 $f_{yx}$ 在该圆盘上均连续，则：\n\n$$f_{xy}(a, b) = f_{yx}(a, b)。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-4, 4);
        const b = rng.nonZero(-4, 4);
        const x0 = rng.int(-2, 2);
        const y0 = rng.int(-2, 2);

        // f(x, y) = a * x^2 * y^2 + b * x * y
        // f_x = 2a * x * y^2 + b * y
        // f_xy = 4a * x * y + b
        const ans = 4 * a * x0 * y0 + b;

        const prompt = t(
          `Calculate the mixed partial derivative $f_{xy}(${x0}, ${y0})$ for the function $f(x, y) = ${poly([a, "x^2y^2"], [b, "xy"])}$ at the point $(${x0}, ${y0})$.`,
          `计算函数 $f(x, y) = ${poly([a, "x^2y^2"], [b, "xy"])}$ 在点 $(${x0}, ${y0})$ 处的二阶混合偏导数 $f_{xy}(${x0}, ${y0})$。`,
        );
        const solution = t(
          steps(
            `Compute $f_x(x, y) = \\frac{\\partial}{\\partial x}\\left(${poly([a, "x^2y^2"], [b, "xy"])}\\right) = ${poly([2 * a, "xy^2"], [b, "y"])}$.`,
            `Differentiate with respect to $y$: $f_{xy}(x, y) = \\frac{\\partial}{\\partial y}\\left(${poly([2 * a, "xy^2"], [b, "y"])}\\right) = ${poly([4 * a, "xy"], [b, ""])}$.`,
            `Substitute $(x, y) = (${x0}, ${y0})$: $f_{xy}(${x0}, ${y0}) = 4(${a})(${x0})(${y0}) + ${paren(b)} = ${ans}$.`,
          ),
          steps(
            `计算 $f_x(x, y) = \\frac{\\partial}{\\partial x}\\left(${poly([a, "x^2y^2"], [b, "xy"])}\\right) = ${poly([2 * a, "xy^2"], [b, "y"])}$。`,
            `对 $y$ 求偏导：$f_{xy}(x, y) = \\frac{\\partial}{\\partial y}\\left(${poly([2 * a, "xy^2"], [b, "y"])}\\right) = ${poly([4 * a, "xy"], [b, ""])}$。`,
            `代入点 $(x, y) = (${x0}, ${y0})$：$f_{xy}(${x0}, ${y0}) = 4(${a})(${x0})(${y0}) + ${paren(b)} = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [2 * a * x0 * y0 + b, -ans, ans + 2],
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
  prerequisites: ["computing-partial-derivatives-using-the-rules-of-differentiation", "the-cartesian-equation-of-a-plane"],
  encompasses: [{ topic: "computing-partial-derivatives-using-the-rules-of-differentiation", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "finding-equations-of-tangent-planes",
      title: t("Finding equations of tangent planes", "求切平面方程"),
      explanation: t(
        "The tangent plane is the flat surface that best matches the graph at a point, and its tilt in each direction is given by the partial derivatives there. For a differentiable function $z = f(x, y)$, the tangent plane at $(x_0, y_0, z_0)$ has equation:\n\n$$z - z_0 = f_x(x_0, y_0)(x - x_0) + f_y(x_0, y_0)(y - y_0).$$",
        "切平面是在一点处与图像最贴合的平面，它在各方向上的倾斜程度由该点的偏导数给出。对于可微函数 $z = f(x, y)$，其在点 $(x_0, y_0, z_0)$ 处的切平面方程为：\n\n$$z - z_0 = f_x(x_0, y_0)(x - x_0) + f_y(x_0, y_0)(y - y_0)。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const x0 = rng.int(-2, 2);
        const y0 = rng.int(-2, 2);

        // z = a*x^2 + b*y^2
        const z0 = a * x0 * x0 + b * y0 * y0;
        const fx = 2 * a * x0;
        const fy = 2 * b * y0;

        // z - z0 = fx*(x - x0) + fy*(y - y0)
        // fx*x + fy*y - z = fx*x0 + fy*y0 - z0
        const constTerm = fx * x0 + fy * y0 - z0;
        const lhs = poly([fx, "x"], [fy, "y"], [-1, "z"]);
        const answer = `${lhs} = ${constTerm}`;

        const prompt = t(
          `Find the equation of the tangent plane to the surface $z = ${poly([a, "x^2"], [b, "y^2"])}$ at the point $(${x0}, ${y0}, ${z0})$.`,
          `求曲面 $z = ${poly([a, "x^2"], [b, "y^2"])}$ 在点 $(${x0}, ${y0}, ${z0})$ 处的切平面方程。`,
        );
        const solution = t(
          steps(
            `Compute partial derivatives:\n\n` +
              `$f_x = 2(${a})x = ${2 * a}x \\implies f_x(${x0}, ${y0}) = ${fx}$\n\n` +
              `$f_y = 2(${b})y = ${2 * b}y \\implies f_y(${x0}, ${y0}) = ${fy}$`,
            `Apply the tangent plane formula: $z - (${z0}) = ${fx}(x - (${x0})) + ${paren(fy)}(y - (${y0}))$.`,
            `Rearrange to standard form: $${answer}$.`,
          ),
          steps(
            `计算偏导数：\n\n` +
              `$f_x = 2(${a})x = ${2 * a}x \\implies f_x(${x0}, ${y0}) = ${fx}$\n\n` +
              `$f_y = 2(${b})y = ${2 * b}y \\implies f_y(${x0}, ${y0}) = ${fy}$`,
            `应用切平面公式：$z - (${z0}) = ${fx}(x - (${x0})) + ${paren(fy)}(y - (${y0}))$。`,
            `整理为标准形式：$${answer}$。`,
          ),
        );
        return equationProblem({
          prompt,
          solution,
          answer,
          wrong: [
            `${poly([fy, "x"], [fx, "y"], [-1, "z"])} = ${constTerm}`,
            `${poly([fx, "x"], [fy, "y"], [1, "z"])} = ${constTerm}`,
            `${poly([a, "x"], [b, "y"], [-1, "z"])} = 0`,
          ],
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
  prerequisites: ["tangent-planes-to-surfaces"],
  encompasses: [{ topic: "tangent-planes-to-surfaces", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "computing-linearizations",
      title: t("Computing linearizations", "计算线性化表达式"),
      explanation: t(
        "The linearization is the tangent plane written as a function, and it gives good estimates of the function at points near the center. The **linearization** of $f(x, y)$ at $(a, b)$ is:\n\n$$L(x, y) = f(a, b) + f_x(a, b)(x - a) + f_y(a, b)(y - b).$$",
        "线性化就是写成函数形式的切平面，它可以很好地估计中心附近各点的函数值。函数 $f(x, y)$ 在点 $(a, b)$ 处的**线性化**为：\n\n$$L(x, y) = f(a, b) + f_x(a, b)(x - a) + f_y(a, b)(y - b)。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const c = rng.int(-5, 5);

        // f(x, y) = a*x + b*y + c + x^2
        // Linearization at (0, 0): f(0,0) = c, f_x(0,0) = a, f_y(0,0) = b
        // L(x, y) = a*x + b*y + c
        const ans = poly([a, "x"], [b, "y"], [c, ""]);

        const prompt = t(
          `Find the linearization $L(x, y)$ of the function $f(x, y) = ${poly([1, "x^2"], [a, "x"], [b, "y"], [c, ""])}$ at $(0, 0)$.`,
          `求函数 $f(x, y) = ${poly([1, "x^2"], [a, "x"], [b, "y"], [c, ""])}$ 在点 $(0, 0)$ 处的线性化 $L(x, y)$。`,
        );
        const solution = t(
          steps(
            `Evaluate $f(0, 0) = ${c}$.`,
            `Compute partial derivatives: $f_x(x, y) = ${poly([2, "x"], [a, ""])} \\implies f_x(0, 0) = ${a}$.`,
            `$f_y(x, y) = ${b} \\implies f_y(0, 0) = ${b}$.`,
            `Form the linearization: $L(x, y) = f(0, 0) + f_x(0, 0)x + f_y(0, 0)y = ${ans}$.`,
          ),
          steps(
            `计算 $f(0, 0) = ${c}$。`,
            `求偏导数：$f_x(x, y) = ${poly([2, "x"], [a, ""])} \\implies f_x(0, 0) = ${a}$。`,
            `$f_y(x, y) = ${b} \\implies f_y(0, 0) = ${b}$。`,
            `写出线性化表达式：$L(x, y) = f(0, 0) + f_x(0, 0)x + f_y(0, 0)y = ${ans}$。`,
          ),
        );
        return expressionProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [poly([1, "x^2"], [a, "x"], [b, "y"]), poly([2 * a, "x"], [b, "y"], [c, ""]), poly([a, "x"], [b, "y"])],
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
  prerequisites: ["computing-partial-derivatives-using-the-rules-of-differentiation", "integrating-vector-valued-functions"],
  encompasses: [{ topic: "computing-partial-derivatives-using-the-rules-of-differentiation", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "applying-leibniz-integral-rule",
      title: t("Applying Leibniz's Integral Rule", "应用莱布尼茨积分法则"),
      explanation: t(
        "When the limits are fixed, the derivative with respect to a parameter can be taken inside the integral, differentiating the integrand partially. **Leibniz's Rule**: For continuous $\\frac{\\partial f}{\\partial t}$:\n\n$$\\frac{d}{dt} \\int_a^b f(x, t)\\,dx = \\int_a^b \\frac{\\partial f}{\\partial t}(x, t)\\,dx.$$",
        "当积分限固定时，对参数的导数可以移到积分号里面，对被积函数求偏导数。**莱布尼茨法则**：当 $\\frac{\\partial f}{\\partial t}$ 连续时：\n\n$$\\frac{d}{dt} \\int_a^b f(x, t)\\,dx = \\int_a^b \\frac{\\partial f}{\\partial t}(x, t)\\,dx。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const bEven = 2 * rng.int(1, 5);
        // F(t) = \int_0^1 (a x^2 + bEven * t * x) dx
        // F'(t) = \int_0^1 bEven * x dx = bEven * [x^2 / 2]_0^1 = bEven / 2.
        const ans = bEven / 2;

        const prompt = t(
          `Apply Leibniz's rule to find $F'(t)$ for $F(t) = \\int_{0}^{1} \\left(${poly([a, "x^2"], [bEven, "tx"])}\\right) dx$.`,
          `应用莱布尼茨法则求函数 $F(t) = \\int_{0}^{1} \\left(${poly([a, "x^2"], [bEven, "tx"])}\\right) dx$ 的导数 $F'(t)$。`,
        );
        const solution = t(
          steps(
            `Differentiate under the integral sign with respect to $t$:\n\n` +
              `$$\\frac{\\partial}{\\partial t}\\left(${poly([a, "x^2"], [bEven, "tx"])}\\right) = ${bEven}x.$$`,
            `Integrate with respect to $x$ from $0$ to $1$:\n\n` +
              `$$F'(t) = \\int_{0}^{1} ${bEven}x\\,dx = \\left[ \\frac{${bEven}}{2} x^2 \\right]_{0}^{1} = ${ans}.$$`,
          ),
          steps(
            `在积分号下关于 $t$ 求偏导：\n\n` +
              `$$\\frac{\\partial}{\\partial t}\\left(${poly([a, "x^2"], [bEven, "tx"])}\\right) = ${bEven}x。$$`,
            `对 $x$ 从 $0$ 到 $1$ 进行定积分：\n\n` +
              `$$F'(t) = \\int_{0}^{1} ${bEven}x\\,dx = \\left[ \\frac{${bEven}}{2} x^2 \\right]_{0}^{1} = ${ans}。$$`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [bEven, ans * 2, a + ans],
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
  prerequisites: ["computing-partial-derivatives-using-the-rules-of-differentiation", "three-dimensional-vectors-in-component-form"],
  encompasses: [{ topic: "computing-partial-derivatives-using-the-rules-of-differentiation", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "calculating-the-gradient-vector",
      title: t("Calculating the gradient vector", "计算梯度向量"),
      explanation: t(
        "Find each partial derivative and list them in order as the components of a vector, then substitute the point if one is given. For a scalar function $f(x, y)$, the gradient vector is:\n\n$$\\nabla f(x, y) = \\left\\langle \\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y} \\right\\rangle.$$",
        "求出每个偏导数，把它们依次作为向量的分量；如果给定了点，再代入该点。对于标量函数 $f(x, y)$，梯度向量为：\n\n$$\\nabla f(x, y) = \\left\\langle \\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y} \\right\\rangle。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-4, 4);
        const b = rng.nonZero(-4, 4);
        const c = rng.nonZero(-4, 4);
        const x0 = rng.int(-2, 2);
        const y0 = rng.int(-2, 2);

        // f(x, y) = a*x^2 + b*y^2 + c*x*y
        // fx = 2a*x + c*y
        // fy = 2b*y + c*x
        const ansX = 2 * a * x0 + c * y0;
        const ansY = 2 * b * y0 + c * x0;
        const answer: Vec2 = [ansX, ansY];

        const prompt = t(
          `Calculate the gradient vector $\\nabla f(${x0}, ${y0})$ for $f(x, y) = ${poly([a, "x^2"], [b, "y^2"], [c, "xy"])}$ at the point $(${x0}, ${y0})$. Express your answer as a vector $\\langle x, y \\rangle$.`,
          `计算函数 $f(x, y) = ${poly([a, "x^2"], [b, "y^2"], [c, "xy"])}$ 在点 $(${x0}, ${y0})$ 处的梯度向量 $\\nabla f(${x0}, ${y0})$。结果以向量 $\\langle x, y \\rangle$ 表示。`,
        );
        const solution = t(
          steps(
            `Compute the partial derivatives:\n\n` +
              `$f_x = 2(${a})x + ${c === 1 ? "" : paren(c)}y = ${poly([2 * a, "x"], [c, "y"])}$\n\n` +
              `$f_y = 2(${b})y + ${c === 1 ? "" : paren(c)}x = ${poly([2 * b, "y"], [c, "x"])}$`,
            `Evaluate at $(${x0}, ${y0})$:\n\n` + `$f_x(${x0}, ${y0}) = ${ansX}, \\quad f_y(${x0}, ${y0}) = ${ansY}$`,
            `The gradient vector is $\\nabla f(${x0}, ${y0}) = \\langle ${ansX}, ${ansY} \\rangle$.`,
          ),
          steps(
            `计算偏导数：\n\n` +
              `$f_x = 2(${a})x + ${c === 1 ? "" : paren(c)}y = ${poly([2 * a, "x"], [c, "y"])}$\n\n` +
              `$f_y = 2(${b})y + ${c === 1 ? "" : paren(c)}x = ${poly([2 * b, "y"], [c, "x"])}$`,
            `代入点 $(${x0}, ${y0})$：\n\n` + `$f_x(${x0}, ${y0}) = ${ansX}, \\quad f_y(${x0}, ${y0}) = ${ansY}$`,
            `梯度向量为 $\\nabla f(${x0}, ${y0}) = \\langle ${ansX}, ${ansY} \\rangle$。`,
          ),
        );
        return pointProblem({
          prompt,
          solution,
          answer,
          vector: true,
          vars: ["x", "y"],
          wrong: [
            [ansY, ansX],
            [-ansX, -ansY],
            [a * x0, b * y0],
          ],
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
  prerequisites: ["the-gradient-vector", "tangent-planes-to-surfaces"],
  encompasses: [{ topic: "the-gradient-vector", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "normal-vectors-to-level-surfaces",
      title: t("Normal vectors to level surfaces", "等值面的法向量"),
      explanation: t(
        "For a level surface $F(x, y, z) = k$, the gradient vector $\\mathbf{n} = \\nabla F(x_0, y_0, z_0)$ is perpendicular to the tangent plane of the surface at $(x_0, y_0, z_0)$.",
        "对于等值面 $F(x, y, z) = k$，梯度向量 $\\mathbf{n} = \\nabla F(x_0, y_0, z_0)$ 垂直于该曲面在点 $(x_0, y_0, z_0)$ 处的切平面。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const c = rng.nonZero(-3, 3);
        let pt: Vec3 = [rng.int(-2, 2), rng.int(-2, 2), rng.int(-2, 2)];
        if (pt[0] === 0 && pt[1] === 0 && pt[2] === 0) {
          pt = [rng.pick([-1, 1]), pt[1], pt[2]];
        }

        const ansX = 2 * a * pt[0];
        const ansY = 2 * b * pt[1];
        const ansZ = 2 * c * pt[2];
        const answer: Vec3 = [ansX, ansY, ansZ];

        const prompt = t(
          `Find a normal vector to the level surface $${poly([a, "x^2"], [b, "y^2"], [c, "z^2"])} = 10$ at the point $(${pt[0]}, ${pt[1]}, ${pt[2]})$. Express your answer as a vector $\\langle x, y, z \\rangle$.`,
          `求等值面 $${poly([a, "x^2"], [b, "y^2"], [c, "z^2"])} = 10$ 在点 $(${pt[0]}, ${pt[1]}, ${pt[2]})$ 处的一个法向量。结果以向量 $\\langle x, y, z \\rangle$ 表示。`,
        );
        const solution = t(
          steps(
            `A normal vector is given by the gradient $\\nabla F = \\langle F_x, F_y, F_z \\rangle$.`,
            `$F_x = ${2 * a}x$, $F_y = ${2 * b}y$, $F_z = ${2 * c}z$.`,
            `Evaluating at $(${pt[0]}, ${pt[1]}, ${pt[2]})$ gives $\\mathbf{n} = ${v3L(answer)}$.`,
          ),
          steps(
            `法向量由梯度给出：$\\nabla F = \\langle F_x, F_y, F_z \\rangle$。`,
            `$F_x = ${2 * a}x$，$F_y = ${2 * b}y$，$F_z = ${2 * c}z$。`,
            `在点 $(${pt[0]}, ${pt[1]}, ${pt[2]})$ 处求值得到 $\\mathbf{n} = ${v3L(answer)}$。`,
          ),
        );
        return pointProblem({
          prompt,
          solution,
          answer,
          vector: true,
          vars: ["x", "y", "z"],
          wrong: [
            [ansY, ansX, ansZ],
            [-ansX, -ansY, -ansZ],
            [a * pt[0], b * pt[1], c * pt[2]],
          ],
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
  prerequisites: ["the-gradient-vector"],
  encompasses: [{ topic: "the-gradient-vector", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "finding-tangent-lines-to-level-curves",
      title: t("Finding tangent lines to level curves", "求等值线的切线方程"),
      explanation: t(
        "Because $\\nabla f(x_0, y_0) = \\langle A, B \\rangle$ is normal to the level curve $f(x, y) = k$ at $(x_0, y_0)$, the equation of the tangent line is:\n\n$$A(x - x_0) + B(y - y_0) = 0 \\iff Ax + By = Ax_0 + By_0.$$",
        "因为 $\\nabla f(x_0, y_0) = \\langle A, B \\rangle$ 垂直于等值线 $f(x, y) = k$ 在 $(x_0, y_0)$ 处的切线，所以切线方程为：\n\n$$A(x - x_0) + B(y - y_0) = 0 \\iff Ax + By = Ax_0 + By_0。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        let x0 = rng.int(-3, 3);
        const y0 = rng.int(-3, 3);
        if (x0 === 0 && y0 === 0) {
          x0 = rng.pick([-1, 1]);
        }

        const A = 2 * a * x0;
        const B = 2 * b * y0;
        const C = A * x0 + B * y0;
        const answer = `${poly([A, "x"], [B, "y"])} = ${C}`;

        const prompt = t(
          `Find the equation of the tangent line to the level curve $${poly([a, "x^2"], [b, "y^2"])} = ${a * x0 * x0 + b * y0 * y0}$ at the point $(${x0}, ${y0})$.`,
          `求等值线 $${poly([a, "x^2"], [b, "y^2"])} = ${a * x0 * x0 + b * y0 * y0}$ 在点 $(${x0}, ${y0})$ 处的切线方程。`,
        );
        const solution = t(
          steps(
            `The normal vector to the curve is the gradient: $\\nabla f(${x0}, ${y0}) = \\langle ${A}, ${B} \\rangle$.`,
            `The tangent line equation is $${A}(x - (${x0})) + ${paren(B)}(y - (${y0})) = 0$.`,
            `Rearranging yields $${answer}$.`,
          ),
          steps(
            `曲线的法向量为梯度：$\\nabla f(${x0}, ${y0}) = \\langle ${A}, ${B} \\rangle$。`,
            `切线方程为 $${A}(x - (${x0})) + ${paren(B)}(y - (${y0})) = 0$。`,
            `整理得到 $${answer}$。`,
          ),
        );
        return equationProblem({
          prompt,
          solution,
          answer,
          wrong: [`${poly([B, "x"], [A, "y"])} = ${C}`, `${poly([A, "x"], [-B, "y"])} = ${C}`, `${poly([a, "x"], [b, "y"])} = ${C}`],
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
  prerequisites: ["the-gradient-as-a-normal-vector"],
  encompasses: [{ topic: "the-gradient-as-a-normal-vector", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "computing-tangent-planes-to-implicit-surfaces",
      title: t("Computing tangent planes to implicit surfaces", "计算隐式曲面的切平面"),
      explanation: t(
        "The gradient is perpendicular to every level surface, so the gradient at the point serves as the normal vector of the tangent plane. For an implicitly defined surface $F(x, y, z) = k$, the tangent plane at $(x_0, y_0, z_0)$ has normal $\\nabla F(x_0, y_0, z_0) = \\langle F_x, F_y, F_z \\rangle$:\n\n$$F_x(x_0, y_0, z_0)(x - x_0) + F_y(x_0, y_0, z_0)(y - y_0) + F_z(x_0, y_0, z_0)(z - z_0) = 0.$$",
        "梯度垂直于每个等值面，所以该点处的梯度可以作为切平面的法向量。对于隐式曲面 $F(x, y, z) = k$，其在点 $(x_0, y_0, z_0)$ 处的切平面以 $\\nabla F(x_0, y_0, z_0) = \\langle F_x, F_y, F_z \\rangle$ 为法向量：\n\n$$F_x(x_0, y_0, z_0)(x - x_0) + F_y(x_0, y_0, z_0)(y - y_0) + F_z(x_0, y_0, z_0)(z - z_0) = 0。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const c = rng.nonZero(-3, 3);
        let pt: Vec3 = [rng.int(-2, 2), rng.int(-2, 2), rng.int(-2, 2)];
        if (pt[0] === 0 && pt[1] === 0 && pt[2] === 0) {
          pt = [rng.pick([-1, 1]), pt[1], pt[2]];
        }

        const A = 2 * a * pt[0];
        const B = 2 * b * pt[1];
        const C = 2 * c * pt[2];
        const D = A * pt[0] + B * pt[1] + C * pt[2];
        const answer = `${poly([A, "x"], [B, "y"], [C, "z"])} = ${D}`;

        const prompt = t(
          `Find the equation of the tangent plane to the surface $${poly([a, "x^2"], [b, "y^2"], [c, "z^2"])} = ${a * pt[0] * pt[0] + b * pt[1] * pt[1] + c * pt[2] * pt[2]}$ at the point $(${pt[0]}, ${pt[1]}, ${pt[2]})$.`,
          `求曲面 $${poly([a, "x^2"], [b, "y^2"], [c, "z^2"])} = ${a * pt[0] * pt[0] + b * pt[1] * pt[1] + c * pt[2] * pt[2]}$ 在点 $(${pt[0]}, ${pt[1]}, ${pt[2]})$ 处的切平面方程。`,
        );
        const solution = t(
          steps(
            `Compute the gradient: $\\nabla F = \\langle ${2 * a}x, ${2 * b}y, ${2 * c}z \\rangle$.`,
            `At $(${pt[0]}, ${pt[1]}, ${pt[2]})$, $\\nabla F = \\langle ${A}, ${B}, ${C} \\rangle$.`,
            `The tangent plane is $${A}(x - (${pt[0]})) + ${paren(B)}(y - (${pt[1]})) + ${paren(C)}(z - (${pt[2]})) = 0$.`,
            `Simplifying gives $${answer}$.`,
          ),
          steps(
            `计算梯度：$\\nabla F = \\langle ${2 * a}x, ${2 * b}y, ${2 * c}z \\rangle$。`,
            `在点 $(${pt[0]}, ${pt[1]}, ${pt[2]})$ 处，$\\nabla F = \\langle ${A}, ${B}, ${C} \\rangle$。`,
            `切平面方程为 $${A}(x - (${pt[0]})) + ${paren(B)}(y - (${pt[1]})) + ${paren(C)}(z - (${pt[2]})) = 0$。`,
            `化简得 $${answer}$。`,
          ),
        );
        return equationProblem({
          prompt,
          solution,
          answer,
          wrong: [
            `${poly([B, "x"], [A, "y"], [C, "z"])} = ${D}`,
            `${poly([A, "x"], [B, "y"], [-C, "z"])} = ${D}`,
            `${poly([a, "x"], [b, "y"], [c, "z"])} = ${D}`,
          ],
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
  prerequisites: ["the-gradient-vector"],
  encompasses: [{ topic: "the-gradient-vector", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "computing-directional-derivatives",
      title: t("Computing directional derivatives", "计算方向导数"),
      explanation: t(
        "The rate of change in any direction is the dot product of the gradient with a unit vector in that direction, so normalize the direction first. For a differentiable function $f(x, y)$ and a unit vector $\\mathbf{u} = \\langle u_1, u_2 \\rangle$:\n\n$$D_{\\mathbf{u}} f(x_0, y_0) = \\nabla f(x_0, y_0) \\cdot \\mathbf{u} = f_x(x_0, y_0)u_1 + f_y(x_0, y_0)u_2.$$",
        "沿任意方向的变化率等于梯度与该方向单位向量的点积，所以要先把方向单位化。对于可微函数 $f(x, y)$ 和单位向量 $\\mathbf{u} = \\langle u_1, u_2 \\rangle$：\n\n$$D_{\\mathbf{u}} f(x_0, y_0) = \\nabla f(x_0, y_0) \\cdot \\mathbf{u} = f_x(x_0, y_0)u_1 + f_y(x_0, y_0)u_2。$$",
      ),
      generate(rng: Rng): Problem {
        const [u1Int, u2Int, mag] = rng.pick(pythagoreanTriples);
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const x0 = rng.int(-2, 2);
        const y0 = rng.int(-2, 2);

        // f(x, y) = a*x^2 + b*y^2
        // fx = 2a*x0, fy = 2b*y0
        const fx = 2 * a * x0;
        const fy = 2 * b * y0;
        const u1 = Q.of(u1Int, mag);
        const u2 = Q.of(u2Int, mag);
        const ans = u1.mul(Q.of(fx)).add(u2.mul(Q.of(fy)));

        const prompt = t(
          `Find the directional derivative $D_{\\mathbf{u}} f(${x0}, ${y0})$ of $f(x, y) = ${poly([a, "x^2"], [b, "y^2"])}$ in the direction of the unit vector $\\mathbf{u} = \\left\\langle \\frac{${u1Int}}{${mag}}, \\frac{${u2Int}}{${mag}} \\right\\rangle$.`,
          `求函数 $f(x, y) = ${poly([a, "x^2"], [b, "y^2"])}$ 在点 $(${x0}, ${y0})$ 处沿单位向量 $\\mathbf{u} = \\left\\langle \\frac{${u1Int}}{${mag}}, \\frac{${u2Int}}{${mag}} \\right\\rangle$ 方向的方向导数 $D_{\\mathbf{u}} f(${x0}, ${y0})$。`,
        );
        const solution = t(
          steps(
            `Compute the gradient: $\\nabla f(${x0}, ${y0}) = \\langle 2(${a})(${x0}), 2(${b})(${y0}) \\rangle = \\langle ${fx}, ${fy} \\rangle$.`,
            `Compute the dot product with $\\mathbf{u}$:\n\n` +
              `$$D_{\\mathbf{u}} f = \\langle ${fx}, ${fy} \\rangle \\cdot \\left\\langle \\frac{${u1Int}}{${mag}}, \\frac{${u2Int}}{${mag}} \\right\\rangle = ${fx}\\left(\\frac{${u1Int}}{${mag}}\\right) + ${paren(fy)}\\left(\\frac{${u2Int}}{${mag}}\\right) = ${ans.toLatex()}.$$`,
          ),
          steps(
            `计算梯度：$\\nabla f(${x0}, ${y0}) = \\langle 2(${a})(${x0}), 2(${b})(${y0}) \\rangle = \\langle ${fx}, ${fy} \\rangle$。`,
            `计算与 $\\mathbf{u}$ 的点积：\n\n` +
              `$$D_{\\mathbf{u}} f = \\langle ${fx}, ${fy} \\rangle \\cdot \\left\\langle \\frac{${u1Int}}{${mag}}, \\frac{${u2Int}}{${mag}} \\right\\rangle = ${fx}\\left(\\frac{${u1Int}}{${mag}}\\right) + ${paren(fy)}\\left(\\frac{${u2Int}}{${mag}}\\right) = ${ans.toLatex()}。$$`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [ans.neg(), ans.add(Q.of(1)), Q.of(fx + fy)],
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
  prerequisites: ["directional-derivatives"],
  encompasses: [{ topic: "directional-derivatives", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "understanding-the-multivariable-mean-value-theorem",
      title: t("Understanding the multivariable mean-value theorem", "理解多元拉格朗日中值定理"),
      explanation: t(
        "Let $f$ be differentiable on an open set containing the line segment from $\\mathbf{a}$ to $\\mathbf{b}$. Then there exists a point $\\mathbf{c}$ on that segment such that:\n\n$$f(\\mathbf{b}) - f(\\mathbf{a}) = \\nabla f(\\mathbf{c}) \\cdot (\\mathbf{b} - \\mathbf{a}).$$",
        "设 $f$ 在包含从 $\\mathbf{a}$ 到 $\\mathbf{b}$ 线段的开集上可微。则在该线段上存在一点 $\\mathbf{c}$ 使得：\n\n$$f(\\mathbf{b}) - f(\\mathbf{a}) = \\nabla f(\\mathbf{c}) \\cdot (\\mathbf{b} - \\mathbf{a})。$$",
      ),
      generate(rng: Rng): Problem {
        const x1 = rng.int(-4, 4);
        const y1 = rng.int(-4, 4);
        const dx = rng.nonZero(-4, 4);
        const dy = rng.nonZero(-4, 4);
        const x2 = x1 + dx;
        const y2 = y1 + dy;
        const u = rng.nonZero(-5, 5);
        const v = rng.nonZero(-5, 5);

        const ans = u * dx + v * dy;

        const prompt = t(
          `By the Multivariable Mean-Value Theorem, for a differentiable function $f$, $f(\\mathbf{b}) - f(\\mathbf{a}) = \\nabla f(\\mathbf{c}) \\cdot (\\mathbf{b} - \\mathbf{a})$ for some point $\\mathbf{c}$ on the line segment connecting $\\mathbf{a} = (${x1}, ${y1})$ and $\\mathbf{b} = (${x2}, ${y2})$. If $\\nabla f(\\mathbf{c}) = \\langle ${u}, ${v} \\rangle$, calculate the change $f(\\mathbf{b}) - f(\\mathbf{a})$.`,
          `根据多元拉格朗日中值定理，对于可微函数 $f$，在连接 $\\mathbf{a} = (${x1}, ${y1})$ 与 $\\mathbf{b} = (${x2}, ${y2})$ 的线段上存在某点 $\\mathbf{c}$ 满足 $f(\\mathbf{b}) - f(\\mathbf{a}) = \\nabla f(\\mathbf{c}) \\cdot (\\mathbf{b} - \\mathbf{a})$。若 $\\nabla f(\\mathbf{c}) = \\langle ${u}, ${v} \\rangle$，计算函数变化量 $f(\\mathbf{b}) - f(\\mathbf{a})$。`,
        );
        const solution = t(
          steps(
            `Compute the displacement vector: $\\mathbf{b} - \\mathbf{a} = \\langle ${x2} - (${x1}), ${y2} - (${y1}) \\rangle = \\langle ${dx}, ${dy} \\rangle$.`,
            `Apply the theorem: $f(\\mathbf{b}) - f(\\mathbf{a}) = \\nabla f(\\mathbf{c}) \\cdot (\\mathbf{b} - \\mathbf{a}) = \\langle ${u}, ${v} \\rangle \\cdot \\langle ${dx}, ${dy} \\rangle$.`,
            `Calculate the dot product: $(${u})(${dx}) + (${v})(${dy}) = ${u * dx} + (${v * dy}) = ${ans}$.`,
          ),
          steps(
            `计算位移向量：$\\mathbf{b} - \\mathbf{a} = \\langle ${x2} - (${x1}), ${y2} - (${y1}) \\rangle = \\langle ${dx}, ${dy} \\rangle$。`,
            `应用多元中值定理：$f(\\mathbf{b}) - f(\\mathbf{a}) = \\nabla f(\\mathbf{c}) \\cdot (\\mathbf{b} - \\mathbf{a}) = \\langle ${u}, ${v} \\rangle \\cdot \\langle ${dx}, ${dy} \\rangle$。`,
            `计算点积：$(${u})(${dx}) + (${v})(${dy}) = ${u * dx} + (${v * dy}) = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [u * dy + v * dx, ans + 2, -ans],
        });
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
  prerequisites: ["the-gradient-vector"],
  encompasses: [{ topic: "the-gradient-vector", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "computing-derivatives-via-multivariable-chain-rule",
      title: t("Computing derivatives via the multivariable chain rule", "利用多元链式法则求导"),
      explanation: t(
        "When each input depends on a parameter, the total rate of change adds the contribution of each input: its partial derivative times its own rate. If $z = f(x, y)$ is differentiable and $x = g(t)$, $y = h(t)$ are differentiable functions of $t$, then:\n\n$$\\frac{dz}{dt} = \\frac{\\partial z}{\\partial x}\\frac{dx}{dt} + \\frac{\\partial z}{\\partial y}\\frac{dy}{dt}.$$",
        "当每个输入都依赖于一个参数时，总变化率是各个输入贡献的和：偏导数乘以该输入自身的变化率。若 $z = f(x, y)$ 可微，且 $x = g(t)$、$y = h(t)$ 为 $t$ 的可微函数，则：\n\n$$\\frac{dz}{dt} = \\frac{\\partial z}{\\partial x}\\frac{dx}{dt} + \\frac{\\partial z}{\\partial y}\\frac{dy}{dt}。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const k = rng.int(1, 3);
        // z = a*x^2 + b*y^2, x = t^2, y = k*t
        // At t = 1: x = 1, y = k, dx/dt = 2, dy/dt = k
        // dz/dt = 2a*x*(2) + 2b*y*(k) = 4a(1) + 2b(k^2) = 4a + 2b*k^2
        const ans = 4 * a + 2 * b * k * k;

        const prompt = t(
          `Let $z = ${poly([a, "x^2"], [b, "y^2"])}$ where $x = t^2$ and $y = ${k === 1 ? "t" : `${k}t`}$. Find $\\left.\\frac{dz}{dt}\\right|_{t=1}$.`,
          `设 $z = ${poly([a, "x^2"], [b, "y^2"])}$，其中 $x = t^2$，$y = ${k === 1 ? "t" : `${k}t`}$。求 $\\left.\\frac{dz}{dt}\\right|_{t=1}$ 的值。`,
        );
        const solution = t(
          steps(
            `Apply the chain rule: $\\frac{dz}{dt} = \\frac{\\partial z}{\\partial x}\\frac{dx}{dt} + \\frac{\\partial z}{\\partial y}\\frac{dy}{dt}$.`,
            `Compute partial derivatives: $\\frac{\\partial z}{\\partial x} = ${2 * a}x$, $\\frac{\\partial z}{\\partial y} = ${2 * b}y$.`,
            `Compute derivatives with respect to $t$: $\\frac{dx}{dt} = 2t$, $\\frac{dy}{dt} = ${k}$.`,
            `At $t = 1$, $x = 1$ and $y = ${k}$, so $\\frac{dz}{dt} = (${2 * a}(1))(2(1)) + (${2 * b}(${k}))(${k}) = ${4 * a} + ${paren(2 * b * k * k)} = ${ans}$.`,
          ),
          steps(
            `应用复合函数求导法则：$\\frac{dz}{dt} = \\frac{\\partial z}{\\partial x}\\frac{dx}{dt} + \\frac{\\partial z}{\\partial y}\\frac{dy}{dt}$。`,
            `计算偏导数：$\\frac{\\partial z}{\\partial x} = ${2 * a}x$，$\\frac{\\partial z}{\\partial y} = ${2 * b}y$。`,
            `对 $t$ 求导：$\\frac{dx}{dt} = 2t$，$\\frac{dy}{dt} = ${k}$。`,
            `在 $t = 1$ 时，$x = 1$ 且 $y = ${k}$，故 $\\frac{dz}{dt} = (${2 * a}(1))(2(1)) + (${2 * b}(${k}))(${k}) = ${4 * a} + ${paren(2 * b * k * k)} = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [2 * a + 2 * b * k, ans + 2, -ans],
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
  prerequisites: ["the-multivariable-chain-rule"],
  encompasses: [{ topic: "the-multivariable-chain-rule", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "radial-derivatives-in-polar-coordinates",
      title: t("Radial derivatives in polar coordinates", "极坐标下的径向导数"),
      explanation: t(
        "Changing the radius moves the point in both the horizontal and vertical directions, so the chain rule adds both partial derivatives with the right weights. For $z = f(x, y)$ with $x = r\\cos\\theta$ and $y = r\\sin\\theta$, applying the chain rule yields:\n\n$$\\frac{\\partial z}{\\partial r} = \\frac{\\partial z}{\\partial x}\\frac{\\partial x}{\\partial r} + \\frac{\\partial z}{\\partial y}\\frac{\\partial y}{\\partial r} = \\frac{\\partial z}{\\partial x}\\cos\\theta + \\frac{\\partial z}{\\partial y}\\sin\\theta.$$",
        "改变半径会使点在水平和竖直两个方向上移动，所以链式法则要把两个偏导数按相应的权重加起来。对于 $z = f(x, y)$（其中 $x = r\\cos\\theta$，$y = r\\sin\\theta$），由链式法则可得：\n\n$$\\frac{\\partial z}{\\partial r} = \\frac{\\partial z}{\\partial x}\\frac{\\partial x}{\\partial r} + \\frac{\\partial z}{\\partial y}\\frac{\\partial y}{\\partial r} = \\frac{\\partial z}{\\partial x}\\cos\\theta + \\frac{\\partial z}{\\partial y}\\sin\\theta。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-4, 4);
        const b = rng.nonZero(-4, 4);
        const r0 = rng.int(1, 5);
        // z = a*x + b*y
        // dz/dr = a*cos(theta) + b*sin(theta). At theta = 0: dz/dr = a.
        // At theta = pi/2: dz/dr = b.
        const atZero = rng.bool();
        const thetaText = atZero ? "0" : "\\frac{\\pi}{2}";
        const ans = atZero ? a : b;

        const prompt = t(
          `For $z = ${poly([a, "x"], [b, "y"])}$ with $x = r\\cos\\theta$ and $y = r\\sin\\theta$, find $\\left.\\frac{\\partial z}{\\partial r}\\right|_{r=${r0}, \\theta=${thetaText}}$.`,
          `设 $z = ${poly([a, "x"], [b, "y"])}$，其中 $x = r\\cos\\theta$ 且 $y = r\\sin\\theta$。求 $\\left.\\frac{\\partial z}{\\partial r}\\right|_{r=${r0}, \\theta=${thetaText}}$ 的值。`,
        );
        const solution = t(
          steps(
            `Apply the polar chain rule: $\\frac{\\partial z}{\\partial r} = \\frac{\\partial z}{\\partial x}\\cos\\theta + \\frac{\\partial z}{\\partial y}\\sin\\theta$.`,
            `$\\frac{\\partial z}{\\partial x} = ${a}$ and $\\frac{\\partial z}{\\partial y} = ${b}$.`,
            `At $\\theta = ${thetaText}$, $\\cos(${thetaText}) = ${atZero ? 1 : 0}$ and $\\sin(${thetaText}) = ${atZero ? 0 : 1}$.`,
            `Thus $\\frac{\\partial z}{\\partial r} = ${ans}$.`,
          ),
          steps(
            `应用极坐标链式法则：$\\frac{\\partial z}{\\partial r} = \\frac{\\partial z}{\\partial x}\\cos\\theta + \\frac{\\partial z}{\\partial y}\\sin\\theta$。`,
            `$\\frac{\\partial z}{\\partial x} = ${a}$ 且 $\\frac{\\partial z}{\\partial y} = ${b}$。`,
            `在 $\\theta = ${thetaText}$ 处，$\\cos(${thetaText}) = ${atZero ? 1 : 0}$，$\\sin(${thetaText}) = ${atZero ? 0 : 1}$。`,
            `因此 $\\frac{\\partial z}{\\partial r} = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [atZero ? b : a, a + b, a * r0],
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
  prerequisites: ["the-multivariable-chain-rule"],
  encompasses: [{ topic: "the-multivariable-chain-rule", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "gradient-dot-product-formula-for-chain-rule",
      title: t("Gradient dot product formula for the chain rule", "链式法则的梯度点积公式"),
      explanation: t(
        "Along a curve, the rate of change of the function is the gradient dotted with the velocity of the curve, combining all the partial derivative terms at once. If $w = f(\\mathbf{r}(t))$ where $\\mathbf{r}(t) = \\langle x(t), y(t), z(t) \\rangle$, then the chain rule compactly reads:\n\n$$\\frac{dw}{dt} = \\nabla f(\\mathbf{r}(t)) \\cdot \\mathbf{r}'(t).$$",
        "沿一条曲线，函数的变化率等于梯度与曲线速度的点积，一次就合并了所有偏导数项。若 $w = f(\\mathbf{r}(t))$，其中 $\\mathbf{r}(t) = \\langle x(t), y(t), z(t) \\rangle$，则链式法则简洁地表示为：\n\n$$\\frac{dw}{dt} = \\nabla f(\\mathbf{r}(t)) \\cdot \\mathbf{r}'(t)。$$",
      ),
      generate(rng: Rng): Problem {
        const grad: Vec3 = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)];
        const vel: Vec3 = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)];
        const t0 = rng.int(1, 4);

        const ans = grad[0] * vel[0] + grad[1] * vel[1] + grad[2] * vel[2];

        const prompt = t(
          `Suppose a particle moves along a curve $\\mathbf{r}(t)$ such that at $t = ${t0}$, $\\mathbf{r}'(${t0}) = ${v3L(vel)}$ and $\\nabla f(\\mathbf{r}(${t0})) = ${v3L(grad)}$. Find $\\left.\\frac{d}{dt}\\left[f(\\mathbf{r}(t))\\right]\\right|_{t=${t0}}$.`,
          `设质点沿曲线 $\\mathbf{r}(t)$ 运动，已知在 $t = ${t0}$ 时，$\\mathbf{r}'(${t0}) = ${v3L(vel)}$ 且 $\\nabla f(\\mathbf{r}(${t0})) = ${v3L(grad)}$。求 $\\left.\\frac{d}{dt}\\left[f(\\mathbf{r}(t))\\right]\\right|_{t=${t0}}$ 的值。`,
        );
        const solution = t(
          steps(
            `Apply the vector chain rule: $\\frac{d}{dt} f(\\mathbf{r}(t)) = \\nabla f(\\mathbf{r}(t)) \\cdot \\mathbf{r}'(t)$.`,
            `Compute the dot product at $t = ${t0}$:\n\n` +
              `$$\\nabla f \\cdot \\mathbf{r}' = (${grad[0]})(${vel[0]}) + (${grad[1]})(${vel[1]}) + (${grad[2]})(${vel[2]}) = ${ans}.$$`,
          ),
          steps(
            `应用向量形式的链式法则：$\\frac{d}{dt} f(\\mathbf{r}(t)) = \\nabla f(\\mathbf{r}(t)) \\cdot \\mathbf{r}'(t)$。`,
            `计算在 $t = ${t0}$ 处的点积：\n\n` +
              `$$\\nabla f \\cdot \\mathbf{r}' = (${grad[0]})(${vel[0]}) + (${grad[1]})(${vel[1]}) + (${grad[2]})(${vel[2]}) = ${ans}。$$`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [ans + 1, -ans, grad[0] * vel[0]],
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
  prerequisites: ["the-multivariable-chain-rule"],
  encompasses: [{ topic: "the-multivariable-chain-rule", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "approximating-changes-using-differentials",
      title: t("Approximating changes using differentials", "利用全微分估计变化量"),
      explanation: t(
        "For small changes in the inputs, the change in the output is approximately each partial derivative times the change in its input, all added together. For a differentiable function $z = f(x, y)$, the **total differential** is:\n\n$$dz = \\frac{\\partial z}{\\partial x}\\,dx + \\frac{\\partial z}{\\partial y}\\,dy.$$ For small increments $\\Delta x$ and $\\Delta y$, $\\Delta z \\approx dz$.",
        "当输入的变化很小时，输出的变化近似等于每个偏导数乘以相应输入的变化，再全部加起来。对于可微函数 $z = f(x, y)$，其**全微分**为：\n\n$$dz = \\frac{\\partial z}{\\partial x}\\,dx + \\frac{\\partial z}{\\partial y}\\,dy。$$ 当增量 $\\Delta x$ 与 $\\Delta y$ 较小时，$\\Delta z \\approx dz$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-4, 4);
        const b = rng.nonZero(-4, 4);
        const x0 = rng.int(1, 4);
        const y0 = rng.int(1, 4);
        // z = a*x^2 + b*y^2
        // dz = 2a*x0 dx + 2b*y0 dy
        // Let dx = 1, dy = -1 or similar integer increments
        const dx = rng.nonZero(-2, 2);
        const dy = rng.nonZero(-2, 2);

        const fx = 2 * a * x0;
        const fy = 2 * b * y0;
        const ans = fx * dx + fy * dy;

        const prompt = t(
          `Calculate the total differential $dz$ for $z = ${poly([a, "x^2"], [b, "y^2"])}$ at the point $(${x0}, ${y0})$ when $dx = ${dx}$ and $dy = ${dy}$.`,
          `计算函数 $z = ${poly([a, "x^2"], [b, "y^2"])}$ 在点 $(${x0}, ${y0})$ 处当 $dx = ${dx}$ 与 $dy = ${dy}$ 时的全微分 $dz$。`,
        );
        const solution = t(
          steps(
            `Compute partial derivatives:\n\n` +
              `$\\frac{\\partial z}{\\partial x} = ${2 * a}x \\implies f_x(${x0}, ${y0}) = ${fx}$\n\n` +
              `$\\frac{\\partial z}{\\partial y} = ${2 * b}y \\implies f_y(${x0}, ${y0}) = ${fy}$`,
            `Apply the total differential formula: $dz = f_x\\,dx + f_y\\,dy = (${fx})(${dx}) + (${fy})(${dy}) = ${ans}$.`,
          ),
          steps(
            `计算偏导数：\n\n` +
              `$\\frac{\\partial z}{\\partial x} = ${2 * a}x \\implies f_x(${x0}, ${y0}) = ${fx}$\n\n` +
              `$\\frac{\\partial z}{\\partial y} = ${2 * b}y \\implies f_y(${x0}, ${y0}) = ${fy}$`,
            `应用全微分公式：$dz = f_x\\,dx + f_y\\,dy = (${fx})(${dx}) + (${fy})(${dy}) = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [fx * dx - fy * dy, ans + 1, -ans],
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
  prerequisites: ["introduction-to-linear-transformations", "the-parametric-equations-of-a-plane"],
  encompasses: [{ topic: "introduction-to-linear-transformations", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-affine-transformations-on-points",
      title: t("Evaluating affine transformations on points", "计算点在仿射变换下的像"),
      explanation: t(
        "An affine transformation multiplies by a matrix and then adds a fixed vector, so it can stretch, rotate and shift the plane all at once. An affine transformation $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ is represented as:\n\n$$T(x, y) = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} + \\begin{pmatrix} e \\\\ f \\end{pmatrix} = (ax + by + e, cx + dy + f).$$",
        "仿射变换先乘以一个矩阵再加上一个固定向量，所以可以同时伸缩、旋转和平移平面。仿射变换 $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ 表示为：\n\n$$T(x, y) = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} + \\begin{pmatrix} e \\\\ f \\end{pmatrix} = (ax + by + e, cx + dy + f)。$$",
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
        const answer: Vec2 = [u, v];

        const prompt = t(
          `Find the image $T(${x0}, ${y0})$ under the affine transformation $T(x, y) = (${poly([a, "x"], [b, "y"], [e, ""])}, ${poly([cCoeff, "x"], [d, "y"], [f, ""])})$. Express your answer as a point $(u, v)$.`,
          `求点 $(${x0}, ${y0})$ 在仿射变换 $T(x, y) = (${poly([a, "x"], [b, "y"], [e, ""])}, ${poly([cCoeff, "x"], [d, "y"], [f, ""])})$ 下的像 $T(${x0}, ${y0})$。结果以点 $(u, v)$ 表示。`,
        );
        const solution = t(
          steps(
            `Substitute $x = ${x0}$ and $y = ${y0}$ into the transformation:`,
            `$u = ${a}(${x0}) + ${paren(b)}(${y0}) + ${paren(e)} = ${u}$`,
            `$v = ${cCoeff}(${x0}) + ${paren(d)}(${y0}) + ${paren(f)} = ${v}$`,
            `The image is $(u, v) = ${v2L(answer)}$.`,
          ),
          steps(
            `将 $x = ${x0}$ 和 $y = ${y0}$ 代入变换公式：`,
            `$u = ${a}(${x0}) + ${paren(b)}(${y0}) + ${paren(e)} = ${u}$`,
            `$v = ${cCoeff}(${x0}) + ${paren(d)}(${y0}) + ${paren(f)} = ${v}$`,
            `得到像为 $(u, v) = ${v2L(answer)}$。`,
          ),
        );
        return pointProblem({
          prompt,
          solution,
          answer,
          vars: ["u", "v"],
          wrong: [
            [v, u],
            [u - e, v - f],
            [x0, y0],
          ],
        });
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
  prerequisites: ["affine-transformations"],
  encompasses: [{ topic: "affine-transformations", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "area-scaling-by-affine-maps",
      title: t("Area scaling by affine maps", "仿射映射的面积缩放因子"),
      explanation: t(
        "The shift does not change areas, while the matrix multiplies every area by the absolute value of its determinant. For an affine transformation $T(\\mathbf{x}) = A\\mathbf{x} + \\mathbf{b}$ in $\\mathbb{R}^2$, the area of the image $T(S)$ of a region $S$ is:\n\n$$\\operatorname{Area}(T(S)) = |\\det(A)| \\cdot \\operatorname{Area}(S).$$",
        "平移不改变面积，而矩阵把每个面积乘以其行列式的绝对值。对于 $\\mathbb{R}^2$ 中的仿射变换 $T(\\mathbf{x}) = A\\mathbf{x} + \\mathbf{b}$，区域 $S$ 的像 $T(S)$ 的面积为：\n\n$$\\operatorname{Area}(T(S)) = |\\det(A)| \\cdot \\operatorname{Area}(S)。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.int(-2, 2);
        const cCoeff = rng.int(-2, 2);
        const d = rng.nonZero(-3, 3);
        const detA = a * d - b * cCoeff;
        const absDet = Math.abs(detA) === 0 ? 2 : Math.abs(detA);
        const areaS = rng.int(2, 8);
        const ans = absDet * areaS;

        const prompt = t(
          `An affine transformation $T(x, y) = (${poly([a, "x"], [b, "y"])}, ${poly([cCoeff, "x"], [d, "y"])}) + (1, -2)$ maps a region $S$ of area $Area(S) = ${areaS}$. Find the area of the transformed image $Area(T(S))$, given that $|\\det A| = ${absDet}$.`,
          `已知仿射变换 $T(x, y) = (${poly([a, "x"], [b, "y"])}, ${poly([cCoeff, "x"], [d, "y"])}) + (1, -2)$ 作用于面积为 $Area(S) = ${areaS}$ 的区域 $S$。已知 $|\\det A| = ${absDet}$，求变换后像的面积 $Area(T(S))$。`,
        );
        const solution = t(
          steps(
            `The area scaling factor of an affine transformation is $|\\det(A)|$.`,
            `Compute $\\operatorname{Area}(T(S)) = |\\det(A)| \\cdot \\operatorname{Area}(S) = ${absDet} \\cdot ${areaS} = ${ans}$.`,
          ),
          steps(
            `仿射变换的面积缩放因子为 $|\\det(A)|$。`,
            `计算 $\\operatorname{Area}(T(S)) = |\\det(A)| \\cdot \\operatorname{Area}(S) = ${absDet} \\cdot ${areaS} = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [areaS, absDet + areaS, ans * 2],
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
  prerequisites: ["affine-transformations"],
  encompasses: [{ topic: "affine-transformations", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "inverting-affine-maps",
      title: t("Inverting affine maps", "求仿射变换的逆像"),
      explanation: t(
        "To undo the map, reverse its steps in the opposite order: first remove the shift, then undo the matrix with its inverse. To invert $T(\\mathbf{x}) = A\\mathbf{x} + \\mathbf{b}$, first subtract the translation $\\mathbf{y} - \\mathbf{b}$, then apply the matrix inverse $A^{-1}$:\n\n$$T^{-1}(\\mathbf{y}) = A^{-1}(\\mathbf{y} - \\mathbf{b}).$$",
        "要撤销这个映射，就按相反的顺序倒推每一步：先去掉平移，再用逆矩阵撤销矩阵的作用。求 $T(\\mathbf{x}) = A\\mathbf{x} + \\mathbf{b}$ 的逆变换，先减去平移量 $\\mathbf{y} - \\mathbf{b}$，再乘以矩阵逆 $A^{-1}$：\n\n$$T^{-1}(\\mathbf{y}) = A^{-1}(\\mathbf{y} - \\mathbf{b})。$$",
      ),
      generate(rng: Rng): Problem {
        // Simple diagonal scaling and shift: T(x, y) = (a*x + e, d*y + f)
        const aVal = rng.nonZero(-3, 3);
        const dVal = rng.nonZero(-3, 3);
        const e = rng.int(-3, 3);
        const f = rng.int(-3, 3);

        const x0 = rng.int(-3, 3);
        const y0 = rng.int(-3, 3);
        const u0 = aVal * x0 + e;
        const v0 = dVal * y0 + f;

        const prompt = t(
          `Given the affine transformation $T(x, y) = (${poly([aVal, "x"], [e, ""])}, ${poly([dVal, "y"], [f, ""])})$, find the pre-image $(x, y) = T^{-1}(${u0}, ${v0})$. Express your answer as a point $(x, y)$.`,
          `已知仿射变换 $T(x, y) = (${poly([aVal, "x"], [e, ""])}, ${poly([dVal, "y"], [f, ""])})$，求点 $(${u0}, ${v0})$ 的原像 $(x, y) = T^{-1}(${u0}, ${v0})$。结果以点 $(x, y)$ 表示。`,
        );
        const solution = t(
          steps(
            `Set $u = ${poly([aVal, "x"], [e, ""])} = ${u0} \\implies ${poly([aVal, "x"])} = ${u0 - e} \\implies x = ${x0}$.`,
            `Set $v = ${poly([dVal, "y"], [f, ""])} = ${v0} \\implies ${poly([dVal, "y"])} = ${v0 - f} \\implies y = ${y0}$.`,
            `The pre-image is $(x, y) = (${x0}, ${y0})$.`,
          ),
          steps(
            `令 $u = ${poly([aVal, "x"], [e, ""])} = ${u0} \\implies ${poly([aVal, "x"])} = ${u0 - e} \\implies x = ${x0}$。`,
            `令 $v = ${poly([dVal, "y"], [f, ""])} = ${v0} \\implies ${poly([dVal, "y"])} = ${v0 - f} \\implies y = ${y0}$。`,
            `原像为 $(x, y) = (${x0}, ${y0})$。`,
          ),
        );
        return pointProblem({
          prompt,
          solution,
          answer: [x0, y0],
          vars: ["x", "y"],
          wrong: [
            [y0, x0],
            [u0, v0],
            [-x0, -y0],
          ],
        });
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
  prerequisites: ["affine-transformations"],
  encompasses: [{ topic: "affine-transformations", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "mapping-points-under-nonlinear-transformations",
      title: t("Mapping points under nonlinear transformations", "计算点在非线性变换下的像"),
      explanation: t(
        "A nonlinear transformation has no single matrix, so find the image of a point by substituting its coordinates into the formulas directly. A nonlinear transformation maps a point $(x, y)$ to $(u, v)$ via nonlinear formulas such as $u = x^2 - y^2$ and $v = 2xy$.",
        "非线性变换没有单一的矩阵，所以要把点的坐标直接代入公式来求像点。非线性变换通过非线性公式（如 $u = x^2 - y^2$ 与 $v = 2xy$）将点 $(x, y)$ 映射为 $(u, v)$。",
      ),
      generate(rng: Rng): Problem {
        const x0 = rng.int(1, 5);
        const y0 = rng.int(1, 5);

        // u = x^2 - y^2, v = 2xy
        const u = x0 * x0 - y0 * y0;
        const v = 2 * x0 * y0;
        const answer: Vec2 = [u, v];

        const prompt = t(
          `Under the nonlinear transformation $u = x^2 - y^2$ and $v = 2xy$, find the image $(u, v)$ of the point $(${x0}, ${y0})$. Express your answer as a point $(u, v)$.`,
          `在非线性变换 $u = x^2 - y^2$ 与 $v = 2xy$ 下，求点 $(${x0}, ${y0})$ 的像 $(u, v)$。结果以点 $(u, v)$ 表示。`,
        );
        const solution = t(
          steps(
            `Substitute $x = ${x0}$ and $y = ${y0}$:\n\n` +
              `$u = (${x0})^2 - (${y0})^2 = ${x0 * x0} - ${y0 * y0} = ${u}$\n\n` +
              `$v = 2(${x0})(${y0}) = ${v}$`,
            `The image is $(u, v) = ${v2L(answer)}$.`,
          ),
          steps(
            `代入 $x = ${x0}$ 和 $y = ${y0}$：\n\n` +
              `$u = (${x0})^2 - (${y0})^2 = ${x0 * x0} - ${y0 * y0} = ${u}$\n\n` +
              `$v = 2(${x0})(${y0}) = ${v}$`,
            `像点为 $(u, v) = ${v2L(answer)}$。`,
          ),
        );
        return pointProblem({
          prompt,
          solution,
          answer,
          vars: ["u", "v"],
          wrong: [
            [v, u],
            [x0 * x0 + y0 * y0, v],
            [-u, -v],
          ],
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
  prerequisites: ["nonlinear-transformations-of-plane-regions"],
  encompasses: [{ topic: "nonlinear-transformations-of-plane-regions", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "jacobian-of-polar-coordinate-transformation",
      title: t("Jacobian of polar coordinate transformation", "极坐标变换的雅可比行列式"),
      explanation: t(
        "The Jacobian determinant measures how much a small rectangle in the new coordinates is stretched, and for polar coordinates it equals the radius. For $x = r\\cos\\theta$ and $y = r\\sin\\theta$, the Jacobian matrix and its determinant are:\n\n$$J = \\frac{\\partial(x, y)}{\\partial(r, \\theta)} = \\begin{vmatrix} \\cos\\theta & -r\\sin\\theta \\\\ \\sin\\theta & r\\cos\\theta \\end{vmatrix} = r(\\cos^2\\theta + \\sin^2\\theta) = r.$$",
        "雅可比行列式衡量新坐标中的小矩形被拉伸了多少，对极坐标来说它等于半径。对于 $x = r\\cos\\theta$ 与 $y = r\\sin\\theta$，其雅可比矩阵及行列式为：\n\n$$J = \\frac{\\partial(x, y)}{\\partial(r, \\theta)} = \\begin{vmatrix} \\cos\\theta & -r\\sin\\theta \\\\ \\sin\\theta & r\\cos\\theta \\end{vmatrix} = r(\\cos^2\\theta + \\sin^2\\theta) = r。$$",
      ),
      generate(rng: Rng): Problem {
        const r0 = rng.int(2, 35);
        const ans = r0;

        const prompt = t(
          `Calculate the Jacobian determinant $J = \\frac{\\partial(x, y)}{\\partial(r, \\theta)}$ of the polar transformation $x = r\\cos\\theta, y = r\\sin\\theta$ at $r = ${r0}$.`,
          `计算极坐标变换 $x = r\\cos\\theta, y = r\\sin\\theta$ 在 $r = ${r0}$ 处的雅可比行列式 $J = \\frac{\\partial(x, y)}{\\partial(r, \\theta)}$。`,
        );
        const solution = t(
          steps(
            `The Jacobian determinant formula is $J = \\frac{\\partial(x, y)}{\\partial(r, \\theta)} = r(\\cos^2\\theta + \\sin^2\\theta) = r$.`,
            `Evaluating at $r = ${r0}$ yields $J = ${ans}$.`,
          ),
          steps(
            `极坐标变换的雅可比行列式公式为 $J = \\frac{\\partial(x, y)}{\\partial(r, \\theta)} = r(\\cos^2\\theta + \\sin^2\\theta) = r$。`,
            `在 $r = ${r0}$ 处求值得到 $J = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [r0 * r0, 1, r0 + 2],
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
  prerequisites: ["nonlinear-transformations-of-plane-regions"],
  encompasses: [{ topic: "nonlinear-transformations-of-plane-regions", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "mapping-hyperbolic-regions-to-rectangles",
      title: t("Mapping hyperbolic regions to rectangles", "将双曲区域映射为矩形"),
      explanation: t(
        "A region in the first quadrant bounded by hyperbolas $xy = c_1, xy = c_2$ and rays $y = k_1 x, y = k_2 x$ is mapped to a rectangle by setting $u = xy$ and $v = \\frac{y}{x}$.",
        "第一象限中由双曲线 $xy = c_1, xy = c_2$ 与射线 $y = k_1 x, y = k_2 x$ 围成的区域，可通过引入新坐标 $u = xy$ 和 $v = \\frac{y}{x}$ 映射为一个矩形。",
      ),
      generate(rng: Rng): Problem {
        const x0 = rng.int(1, 8);
        const k = rng.int(1, 8);
        const y0 = k * x0;

        // u = xy = k * x0^2, v = y/x = k
        const u = x0 * y0;
        const v = k;
        const answer: Vec2 = [u, v];

        const prompt = t(
          `For coordinates $u = xy$ and $v = \\frac{y}{x}$, find the coordinates $(u, v)$ of the point $(${x0}, ${y0})$. Express your answer as a point $(u, v)$.`,
          `对于新坐标 $u = xy$ 和 $v = \\frac{y}{x}$，求点 $(${x0}, ${y0})$ 在新坐标系下的坐标 $(u, v)$。结果以点 $(u, v)$ 表示。`,
        );
        const solution = t(
          steps(
            `Substitute $x = ${x0}$ and $y = ${y0}$:\n\n` + `$u = (${x0})(${y0}) = ${u}$\n\n` + `$v = \\frac{${y0}}{${x0}} = ${v}$`,
            `The point is $(u, v) = (${u}, ${v})$.`,
          ),
          steps(
            `代入 $x = ${x0}$ 和 $y = ${y0}$：\n\n` + `$u = (${x0})(${y0}) = ${u}$\n\n` + `$v = \\frac{${y0}}{${x0}} = ${v}$`,
            `得到新坐标为 $(u, v) = (${u}, ${v})$。`,
          ),
        );
        return pointProblem({
          prompt,
          solution,
          answer,
          vars: ["u", "v"],
          wrong: [
            [v, u],
            [x0 + y0, y0 - x0],
            [u, 1],
          ],
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
  prerequisites: ["polar-coordinate-transformations"],
  encompasses: [{ topic: "polar-coordinate-transformations", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "calculating-2d-jacobian-determinants",
      title: t("Calculating 2D Jacobian determinants", "计算二维雅可比行列式"),
      explanation: t(
        "Arrange the partial derivatives of the old coordinates with respect to the new ones in a matrix, and take its determinant. For a transformation $x = g(u, v)$ and $y = h(u, v)$, the **Jacobian determinant** is:\n\n$$J = \\frac{\\partial(x, y)}{\\partial(u, v)} = \\begin{vmatrix} \\frac{\\partial x}{\\partial u} & \\frac{\\partial x}{\\partial v} \\\\ \\frac{\\partial y}{\\partial u} & \\frac{\\partial y}{\\partial v} \\end{vmatrix} = \\frac{\\partial x}{\\partial u}\\frac{\\partial y}{\\partial v} - \\frac{\\partial x}{\\partial v}\\frac{\\partial y}{\\partial u}.$$",
        "把旧坐标对新坐标的偏导数排成一个矩阵，再求它的行列式。对于变换 $x = g(u, v)$ 与 $y = h(u, v)$，其**雅可比行列式**为：\n\n$$J = \\frac{\\partial(x, y)}{\\partial(u, v)} = \\begin{vmatrix} \\frac{\\partial x}{\\partial u} & \\frac{\\partial x}{\\partial v} \\\\ \\frac{\\partial y}{\\partial u} & \\frac{\\partial y}{\\partial v} \\end{vmatrix} = \\frac{\\partial x}{\\partial u}\\frac{\\partial y}{\\partial v} - \\frac{\\partial x}{\\partial v}\\frac{\\partial y}{\\partial u}。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const u0 = rng.int(1, 4);
        const v0 = rng.int(1, 4);

        // x = a * u^2, y = b * v^2
        // xu = 2a*u, xv = 0
        // yu = 0, yv = 2b*v
        // J = (2a*u)*(2b*v) = 4ab * u * v
        const ans = 4 * a * b * u0 * v0;

        const prompt = t(
          `Compute the Jacobian determinant $J = \\frac{\\partial(x, y)}{\\partial(u, v)}$ for the transformation $x = ${poly([a, "u^2"])}, y = ${poly([b, "v^2"])}$ at the point $(u, v) = (${u0}, ${v0})$.`,
          `计算变换 $x = ${poly([a, "u^2"])}, y = ${poly([b, "v^2"])}$ 在点 $(u, v) = (${u0}, ${v0})$ 处的雅可比行列式 $J = \\frac{\\partial(x, y)}{\\partial(u, v)}$。`,
        );
        const solution = t(
          steps(
            `Compute the partial derivatives:\n\n` +
              `$\\frac{\\partial x}{\\partial u} = ${2 * a}u, \\quad \\frac{\\partial x}{\\partial v} = 0$\n\n` +
              `$\\frac{\\partial y}{\\partial u} = 0, \\quad \\frac{\\partial y}{\\partial v} = ${2 * b}v$`,
            `The Jacobian determinant is $J = (${2 * a}u)(${2 * b}v) - 0 = ${4 * a * b}uv$.`,
            `Evaluate at $(${u0}, ${v0})$: $J = ${4 * a * b}(${u0})(${v0}) = ${ans}$.`,
          ),
          steps(
            `计算偏导数：\n\n` +
              `$\\frac{\\partial x}{\\partial u} = ${2 * a}u, \\quad \\frac{\\partial x}{\\partial v} = 0$\n\n` +
              `$\\frac{\\partial y}{\\partial u} = 0, \\quad \\frac{\\partial y}{\\partial v} = ${2 * b}v$`,
            `雅可比行列式为 $J = (${2 * a}u)(${2 * b}v) - 0 = ${4 * a * b}uv$。`,
            `在 $(${u0}, ${v0})$ 处求值：$J = ${4 * a * b}(${u0})(${v0}) = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [2 * a * b * u0 * v0, -ans, ans / 2],
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
  prerequisites: ["the-jacobian"],
  encompasses: [{ topic: "the-jacobian", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "reciprocal-property-of-inverse-jacobians",
      title: t("Reciprocal property of inverse Jacobians", "逆变换雅可比行列式的倒数关系"),
      explanation: t(
        "By the Inverse Function Theorem, if $T$ is continuously differentiable with non-zero Jacobian $J = \\frac{\\partial(x, y)}{\\partial(u, v)} \\ne 0$, then $T^{-1}$ exists locally and:\n\n$$\\frac{\\partial(u, v)}{\\partial(x, y)} = \\frac{1}{\\frac{\\partial(x, y)}{\\partial(u, v)}} = \\frac{1}{J}.$$",
        "由反函数定理，若 $T$ 连续可微且雅可比行列式 $J = \\frac{\\partial(x, y)}{\\partial(u, v)} \\ne 0$，则 $T^{-1}$ 局部存在且满足：\n\n$$\\frac{\\partial(u, v)}{\\partial(x, y)} = \\frac{1}{\\frac{\\partial(x, y)}{\\partial(u, v)}} = \\frac{1}{J}。$$",
      ),
      generate(rng: Rng): Problem {
        const jVal = rng.nonZero(-30, 30);
        const ans = Q.of(1, jVal);

        const prompt = t(
          `Suppose a smooth coordinate transformation $T(u, v) = (x, y)$ has Jacobian determinant $\\frac{\\partial(x, y)}{\\partial(u, v)} = ${jVal}$ at a point $P$. Find the Jacobian determinant $\\frac{\\partial(u, v)}{\\partial(x, y)}$ of the inverse transformation at $T(P)$.`,
          `设光滑坐标变换 $T(u, v) = (x, y)$ 在点 $P$ 处的雅可比行列式为 $\\frac{\\partial(x, y)}{\\partial(u, v)} = ${jVal}$。求逆变换在 $T(P)$ 处的雅可比行列式 $\\frac{\\partial(u, v)}{\\partial(x, y)}$。`,
        );
        const solution = t(
          steps(
            `By the Inverse Function Theorem, the Jacobian of the inverse transformation is the reciprocal of the forward Jacobian:\n\n$$\\frac{\\partial(u, v)}{\\partial(x, y)} = \\frac{1}{\\frac{\\partial(x, y)}{\\partial(u, v)}} = \\frac{1}{${jVal}} = ${ans.toLatex()}.$$`,
          ),
          steps(
            `由反函数定理，逆变换的雅可比行列式等于正向变换雅可比行列式的倒数：\n\n$$\\frac{\\partial(u, v)}{\\partial(x, y)} = \\frac{1}{\\frac{\\partial(x, y)}{\\partial(u, v)}} = \\frac{1}{${jVal}} = ${ans.toLatex()}。$$`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [Q.of(jVal), ans.neg(), Q.of(1, jVal * jVal)],
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
  prerequisites: ["the-jacobian"],
  encompasses: [{ topic: "the-jacobian", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "cylindrical-and-spherical-jacobians",
      title: t("Cylindrical and spherical Jacobians", "柱坐标与球坐标的雅可比行列式"),
      explanation: t(
        "These factors are the volume scaling of the coordinate systems, and they must appear in any triple integral after changing coordinates. Standard 3D coordinate Jacobians:\n\n- **Cylindrical coordinates** ($x = r\\cos\\theta, y = r\\sin\\theta, z = z$): $J = \\frac{\\partial(x, y, z)}{\\partial(r, \\theta, z)} = r$.\n- **Spherical coordinates** ($x = \\rho\\sin\\phi\\cos\\theta, y = \\rho\\sin\\phi\\sin\\theta, z = \\rho\\cos\\phi$): $J = \\rho^2\\sin\\phi$.",
        "这些因子是坐标系的体积缩放因子，换坐标后的任何三重积分中都必须出现它们。标准三维坐标变换的雅可比行列式：\n\n- **柱坐标** ($x = r\\cos\\theta, y = r\\sin\\theta, z = z$)：$J = \\frac{\\partial(x, y, z)}{\\partial(r, \\theta, z)} = r$。\n- **球坐标** ($x = \\rho\\sin\\phi\\cos\\theta, y = \\rho\\sin\\phi\\sin\\theta, z = \\rho\\cos\\phi$)：$J = \\rho^2\\sin\\phi$。",
      ),
      generate(rng: Rng): Problem {
        const isCylindrical = rng.bool();
        if (isCylindrical) {
          const r = rng.int(2, 20);
          const ans = Q.of(r);
          const prompt = t(
            `Calculate the Jacobian determinant $J = \\frac{\\partial(x, y, z)}{\\partial(r, \\theta, z)}$ of the cylindrical coordinate transformation at $r = ${r}$.`,
            `计算柱坐标变换在 $r = ${r}$ 处的雅可比行列式 $J = \\frac{\\partial(x, y, z)}{\\partial(r, \\theta, z)}$。`,
          );
          const solution = t(
            steps(`The Jacobian determinant for cylindrical coordinates is $J = r$.`, `Evaluating at $r = ${r}$ yields $J = ${r}$.`),
            steps(`柱坐标变换的雅可比行列式公式为 $J = r$。`, `在 $r = ${r}$ 处求值得到 $J = ${r}$。`),
          );
          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [Q.of(r * r), Q.of(1), Q.of(r + 1)],
          });
        }

        const rho = rng.int(2, 10);
        // At phi = pi/2: sin(pi/2) = 1 => J = rho^2
        // At phi = pi/6: sin(pi/6) = 1/2 => J = rho^2 / 2
        const atHalf = rng.bool();
        const phiText = atHalf ? "\\frac{\\pi}{2}" : "\\frac{\\pi}{6}";
        const sinVal = atHalf ? Q.of(1) : Q.of(1, 2);
        const ans = sinVal.mul(Q.of(rho * rho));

        const prompt = t(
          `Calculate the Jacobian determinant $J = \\frac{\\partial(x, y, z)}{\\partial(\\rho, \\theta, \\phi)}$ of the spherical coordinate transformation at $\\rho = ${rho}$ and $\\phi = ${phiText}$.`,
          `计算球坐标变换在 $\\rho = ${rho}$ 与 $\\phi = ${phiText}$ 处的雅可比行列式 $J = \\frac{\\partial(x, y, z)}{\\partial(\\rho, \\theta, \\phi)}$。`,
        );
        const solution = t(
          steps(
            `The Jacobian determinant for spherical coordinates is $J = \\rho^2 \\sin\\phi$.`,
            `Substitute $\\rho = ${rho}$ and $\\phi = ${phiText}$:\n\n` +
              `$$J = (${rho})^2 \\sin\\left(${phiText}\\right) = ${rho * rho}\\left(${sinVal.toLatex()}\\right) = ${ans.toLatex()}.$$`,
          ),
          steps(
            `球坐标变换的雅可比行列式公式为 $J = \\rho^2 \\sin\\phi$。`,
            `代入 $\\rho = ${rho}$ 和 $\\phi = ${phiText}$：\n\n` +
              `$$J = (${rho})^2 \\sin\\left(${phiText}\\right) = ${rho * rho}\\left(${sinVal.toLatex()}\\right) = ${ans.toLatex()}。$$`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [Q.of(rho * rho), ans.mul(Q.of(2)), Q.of(rho)],
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
  prerequisites: ["the-jacobian"],
  encompasses: [{ topic: "the-jacobian", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-jacobian-matrix-entries",
      title: t("Evaluating Jacobian matrix entries", "计算雅可比矩阵的元素"),
      explanation: t(
        "Each row of the Jacobian matrix holds the partial derivatives of one component, so it plays the role of the derivative for a function with vector outputs. For $\\mathbf{F}(x, y) = \\langle f_1(x, y), f_2(x, y) \\rangle$, the derivative is the $2 \\times 2$ Jacobian matrix:\n\n$$D\\mathbf{F}(x, y) = \\begin{pmatrix} \\frac{\\partial f_1}{\\partial x} & \\frac{\\partial f_1}{\\partial y} \\\\ \\frac{\\partial f_2}{\\partial x} & \\frac{\\partial f_2}{\\partial y} \\end{pmatrix}.$$",
        "雅可比矩阵的每一行是一个分量的偏导数，所以它对输出为向量的函数起着导数的作用。对于 $\\mathbf{F}(x, y) = \\langle f_1(x, y), f_2(x, y) \\rangle$，其导数为 $2 \\times 2$ 雅可比矩阵：\n\n$$D\\mathbf{F}(x, y) = \\begin{pmatrix} \\frac{\\partial f_1}{\\partial x} & \\frac{\\partial f_1}{\\partial y} \\\\ \\frac{\\partial f_2}{\\partial x} & \\frac{\\partial f_2}{\\partial y} \\end{pmatrix}。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const x0 = rng.int(-2, 3);
        const y0 = rng.int(-2, 3);

        // f1 = a * x^2 + b * y^2, f2 = 2 * x * y
        // Entry (1, 1): df1/dx = 2a*x0
        const ans = 2 * a * x0;

        const prompt = t(
          `For $\\mathbf{F}(x, y) = \\left\\langle ${poly([a, "x^2"], [b, "y^2"])}, 2xy \\right\\rangle$, compute the $(1, 1)$-entry $\\frac{\\partial f_1}{\\partial x}$ of the Jacobian matrix $D\\mathbf{F}(${x0}, ${y0})$.`,
          `对于 $\\mathbf{F}(x, y) = \\left\\langle ${poly([a, "x^2"], [b, "y^2"])}, 2xy \\right\\rangle$，计算雅可比矩阵 $D\\mathbf{F}(${x0}, ${y0})$ 的 $(1, 1)$ 位置元素 $\\frac{\\partial f_1}{\\partial x}$。`,
        );
        const solution = t(
          steps(
            `The first component is $f_1(x, y) = ${poly([a, "x^2"], [b, "y^2"])}$.`,
            `Differentiate with respect to $x$: $\\frac{\\partial f_1}{\\partial x} = ${2 * a}x$.`,
            `Evaluate at $x = ${x0}$: $\\frac{\\partial f_1}{\\partial x}(${x0}, ${y0}) = ${2 * a}(${x0}) = ${ans}$.`,
          ),
          steps(
            `第一分量为 $f_1(x, y) = ${poly([a, "x^2"], [b, "y^2"])}$。`,
            `对 $x$ 求偏导：$\\frac{\\partial f_1}{\\partial x} = ${2 * a}x$。`,
            `在 $x = ${x0}$ 处求值：$\\frac{\\partial f_1}{\\partial x}(${x0}, ${y0}) = ${2 * a}(${x0}) = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [2 * b * y0, a * x0, -ans],
        });
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
  prerequisites: ["equality-of-mixed-partial-derivatives", "the-derivative-of-a-multivariable-function"],
  encompasses: [{ topic: "equality-of-mixed-partial-derivatives", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "computing-hessian-determinants",
      title: t("Computing Hessian determinants", "计算黑塞矩阵行列式"),
      explanation: t(
        "The Hessian collects the second partial derivatives, and its determinant at a critical point helps decide whether that point is a maximum, a minimum or a saddle. For a scalar function $f(x, y)$, the **Hessian matrix** and its determinant are:\n\n$$H(x, y) = \\begin{pmatrix} f_{xx} & f_{xy} \\\\ f_{yx} & f_{yy} \\end{pmatrix}, \\quad D = \\det(H) = f_{xx}f_{yy} - (f_{xy})^2.$$",
        "黑塞矩阵汇集了二阶偏导数，它在临界点处的行列式有助于判断该点是极大值、极小值还是鞍点。对于标量函数 $f(x, y)$，其**黑塞矩阵**及其行列式为：\n\n$$H(x, y) = \\begin{pmatrix} f_{xx} & f_{xy} \\\\ f_{yx} & f_{yy} \\end{pmatrix}, \\quad D = \\det(H) = f_{xx}f_{yy} - (f_{xy})^2。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const c = rng.int(-2, 2);

        // f(x, y) = a*x^2 + b*y^2 + c*x*y
        // f_xx = 2a, f_yy = 2b, f_xy = c
        // D = (2a)(2b) - c^2 = 4ab - c^2
        const ans = 4 * a * b - c * c;

        const prompt = t(
          `Calculate the Hessian determinant $D = \\det(H)$ for the function $f(x, y) = ${poly([a, "x^2"], [b, "y^2"], [c, "xy"])}$ at any point.`,
          `计算函数 $f(x, y) = ${poly([a, "x^2"], [b, "y^2"], [c, "xy"])}$ 的黑塞矩阵行列式 $D = \\det(H)$。`,
        );
        const solution = t(
          steps(
            `Compute second partial derivatives:\n\n` +
              `$f_{xx} = 2(${a}) = ${2 * a}$\n\n` +
              `$f_{yy} = 2(${b}) = ${2 * b}$\n\n` +
              `$f_{xy} = ${c}$`,
            `The Hessian determinant is $D = f_{xx}f_{yy} - (f_{xy})^2 = (${2 * a})(${2 * b}) - (${c})^2 = ${4 * a * b} - ${c * c} = ${ans}$.`,
          ),
          steps(
            `计算二阶偏导数：\n\n$f_{xx} = 2(${a}) = ${2 * a}$\n\n$f_{yy} = 2(${b}) = ${2 * b}$\n\n$f_{xy} = ${c}$`,
            `黑塞矩阵行列式为 $D = f_{xx}f_{yy} - (f_{xy})^2 = (${2 * a})(${2 * b}) - (${c})^2 = ${4 * a * b} - ${c * c} = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [4 * a * b + c * c, 2 * a * b - c, -ans],
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
  prerequisites: ["the-second-derivative-of-a-multivariable-function"],
  encompasses: [{ topic: "the-second-derivative-of-a-multivariable-function", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "constructing-multivariable-taylor-polynomials",
      title: t("Constructing multivariable Taylor polynomials", "构造多元泰勒多项式"),
      explanation: t(
        "A quadratic Taylor polynomial in two variables matches the value, the first partial derivatives and the second partial derivatives of the function at the center. The quadratic Taylor polynomial of $f(x, y)$ centered at $(0, 0)$ is:\n\n$$P_2(x, y) = f(0, 0) + f_x(0, 0)x + f_y(0, 0)y + \\frac{1}{2}f_{xx}(0, 0)x^2 + f_{xy}(0, 0)xy + \\frac{1}{2}f_{yy}(0, 0)y^2.$$",
        "二元二次泰勒多项式在中心处与函数的值、一阶偏导数和二阶偏导数都一致。函数 $f(x, y)$ 在 $(0, 0)$ 处的二阶泰勒多项式为：\n\n$$P_2(x, y) = f(0, 0) + f_x(0, 0)x + f_y(0, 0)y + \\frac{1}{2}f_{xx}(0, 0)x^2 + f_{xy}(0, 0)xy + \\frac{1}{2}f_{yy}(0, 0)y^2。$$",
      ),
      generate(rng: Rng): Problem {
        const c = rng.pick([-4, -2, 2, 4]);
        if (rng.bool()) {
          // f = c e^{px + qy}: P2 = c (1 + u + u^2 / 2) with u = px + qy.
          const p = rng.nonZero(-2, 2);
          const q = rng.nonZero(-2, 2);
          const f = `${c === 1 ? "" : c === -1 ? "-" : c}e^{${poly([p, "x"], [q, "y"])}}`;
          const ans = poly([c, ""], [c * p, "x"], [c * q, "y"], [(c * p * p) / 2, "x^2"], [c * p * q, "xy"], [(c * q * q) / 2, "y^2"]);
          return expressionProblem({
            prompt: t(
              `Find the second-degree Taylor polynomial $P_2(x, y)$ centered at $(0, 0)$ for $f(x, y) = ${f}$.`,
              `求函数 $f(x, y) = ${f}$ 在 $(0, 0)$ 处的二阶泰勒多项式 $P_2(x, y)$。`,
            ),
            solution: t(
              steps(
                `At $(0, 0)$: $f = ${c}$, $f_x = ${c * p}$, $f_y = ${c * q}$, $f_{xx} = ${c * p * p}$, $f_{xy} = ${c * p * q}$ and $f_{yy} = ${c * q * q}$.`,
                `Halving the pure second derivatives: $$P_2(x, y) = ${ans}.$$`,
              ),
              steps(
                `在 $(0, 0)$ 处：$f = ${c}$，$f_x = ${c * p}$，$f_y = ${c * q}$，$f_{xx} = ${c * p * p}$，$f_{xy} = ${c * p * q}$，$f_{yy} = ${c * q * q}$。`,
                `纯二阶导数乘以 $\\frac{1}{2}$：$$P_2(x, y) = ${ans}。$$`,
              ),
            ),
            answer: ans,
            wrong: [
              poly([c, ""], [c * p, "x"], [c * q, "y"], [c * p * p, "x^2"], [c * p * q, "xy"], [c * q * q, "y^2"]),
              poly([c, ""], [c * p, "x"], [c * q, "y"], [(c * p * p) / 2, "x^2"], [(c * p * q) / 2, "xy"], [(c * q * q) / 2, "y^2"]),
              poly([c, ""], [c * p, "x"], [c * q, "y"], [(c * p * p) / 2, "x^2"], [(c * q * q) / 2, "y^2"]),
            ],
          });
        }
        // f = c cos(px) e^{qy}: cos(px) ≈ 1 - p^2 x^2 / 2 and e^{qy} ≈ 1 + qy + q^2 y^2 / 2.
        const p = rng.int(1, 3);
        const q = rng.nonZero(-2, 2);
        const f = `${c}\\cos(${poly([p, "x"])}) e^{${poly([q, "y"])}}`;
        const ans = poly([c, ""], [c * q, "y"], [-(c * p * p) / 2, "x^2"], [(c * q * q) / 2, "y^2"]);
        return expressionProblem({
          prompt: t(
            `Find the second-degree Taylor polynomial $P_2(x, y)$ centered at $(0, 0)$ for $f(x, y) = ${f}$.`,
            `求函数 $f(x, y) = ${f}$ 在 $(0, 0)$ 处的二阶泰勒多项式 $P_2(x, y)$。`,
          ),
          solution: t(
            steps(
              `At $(0, 0)$: $f = ${c}$, $f_x = 0$, $f_y = ${c * q}$, $f_{xx} = ${-c * p * p}$, $f_{xy} = 0$ and $f_{yy} = ${c * q * q}$.`,
              `Halving the pure second derivatives: $$P_2(x, y) = ${ans}.$$`,
            ),
            steps(
              `在 $(0, 0)$ 处：$f = ${c}$，$f_x = 0$，$f_y = ${c * q}$，$f_{xx} = ${-c * p * p}$，$f_{xy} = 0$，$f_{yy} = ${c * q * q}$。`,
              `纯二阶导数乘以 $\\frac{1}{2}$：$$P_2(x, y) = ${ans}。$$`,
            ),
          ),
          answer: ans,
          wrong: [
            poly([c, ""], [c * q, "y"], [(c * p * p) / 2, "x^2"], [(c * q * q) / 2, "y^2"]),
            poly([c, ""], [c * q, "y"], [-c * p * p, "x^2"], [c * q * q, "y^2"]),
            poly([c, ""], [c * q, "y"], [-(c * p * p) / 2, "x^2"]),
          ],
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
  prerequisites: ["the-gradient-vector"],
  encompasses: [{ topic: "the-gradient-vector", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "finding-critical-points-of-surfaces",
      title: t("Finding critical points of surfaces", "求曲面的临界点"),
      explanation: t(
        "To find the critical points of a differentiable function $f(x, y)$, solve the system of equations setting both partial derivatives to zero:\n\n$$\\begin{cases} f_x(x, y) = 0 \\\\ f_y(x, y) = 0 \\end{cases}$$",
        "求可微函数 $f(x, y)$ 的临界点，需联立求解令一阶偏导数均为零的方程组：\n\n$$\\begin{cases} f_x(x, y) = 0 \\\\ f_y(x, y) = 0 \\end{cases}$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        let x0 = rng.int(-3, 3);
        const y0 = rng.int(-3, 3);
        if (x0 === 0 && y0 === 0) {
          x0 = rng.pick([-1, 1]);
        }

        // f(x, y) = a*(x - x0)^2 + b*(y - y0)^2 = a*x^2 - 2a*x0*x + b*y^2 - 2b*y0*y + C
        const cTerm = -2 * a * x0;
        const dTerm = -2 * b * y0;
        const answer: Vec2 = [x0, y0];

        const prompt = t(
          `Find the critical point $(x, y)$ of the function $f(x, y) = ${poly([a, "x^2"], [b, "y^2"], [cTerm, "x"], [dTerm, "y"])}$ by solving $\\nabla f(x, y) = \\mathbf{0}$. Express your answer as a point $(x, y)$.`,
          `通过求解 $\\nabla f(x, y) = \\mathbf{0}$，求函数 $f(x, y) = ${poly([a, "x^2"], [b, "y^2"], [cTerm, "x"], [dTerm, "y"])}$ 的临界点 $(x, y)$。结果以点 $(x, y)$ 表示。`,
        );
        const solution = t(
          steps(
            `Compute partial derivatives:\n\n` +
              `$f_x = ${poly([2 * a, "x"], [cTerm, ""])} = 0 \\implies x = ${x0}$\n\n` +
              `$f_y = ${poly([2 * b, "y"], [dTerm, ""])} = 0 \\implies y = ${y0}$`,
            `The unique critical point is $(x, y) = (${x0}, ${y0})$.`,
          ),
          steps(
            `求偏导数并令其为零：\n\n` +
              `$f_x = ${poly([2 * a, "x"], [cTerm, ""])} = 0 \\implies x = ${x0}$\n\n` +
              `$f_y = ${poly([2 * b, "y"], [dTerm, ""])} = 0 \\implies y = ${y0}$`,
            `唯一的临界点为 $(x, y) = (${x0}, ${y0})$。`,
          ),
        );
        return pointProblem({
          prompt,
          solution,
          answer,
          vars: ["x", "y"],
          wrong: [
            [-x0, -y0],
            [y0, x0],
            [0, 0],
          ],
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
  prerequisites: [
    "global-vs-local-extrema-and-critical-points-of-multivariable-functions",
    "the-second-derivative-of-a-multivariable-function",
  ],
  encompasses: [{ topic: "global-vs-local-extrema-and-critical-points-of-multivariable-functions", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "classifying-critical-points-using-discriminant",
      title: t("Classifying critical points using the discriminant", "利用二阶判别式分类临界点"),
      explanation: t(
        "Let $(a, b)$ be a critical point with continuous second partials. Let $D = f_{xx}(a, b)f_{yy}(a, b) - [f_{xy}(a, b)]^2$:\n\n1. If $D > 0$ and $f_{xx}(a, b) > 0$, then $f(a, b)$ is a **local minimum**.\n2. If $D > 0$ and $f_{xx}(a, b) < 0$, then $f(a, b)$ is a **local maximum**.\n3. If $D < 0$, then $(a, b)$ is a **saddle point**.\n4. If $D = 0$, the test is **inconclusive**.",
        "设 $(a, b)$ 为具有连续二阶偏导数的临界点，令 $D = f_{xx}(a, b)f_{yy}(a, b) - [f_{xy}(a, b)]^2$：\n\n1. 若 $D > 0$ 且 $f_{xx}(a, b) > 0$，则该点为**局部极小点**。\n2. 若 $D > 0$ 且 $f_{xx}(a, b) < 0$，则该点为**局部极大点**。\n3. 若 $D < 0$，则该点为**鞍点**。\n4. 若 $D = 0$，判别法**失效**（无法判定）。",
      ),
      generate(rng: Rng): Problem {
        const kind = rng.int(0, 2);
        let a: number;
        let b: number;
        let right: Text;
        let wrong: readonly Text[];

        if (kind === 0) {
          // Local min: a > 0, b > 0
          a = rng.int(1, 4);
          b = rng.int(1, 4);
          right = t("Local minimum", "局部极小值点");
          wrong = [t("Local maximum", "局部极大值点"), t("Saddle point", "鞍点"), t("Inconclusive", "无法判定")];
        } else if (kind === 1) {
          // Local max: a < 0, b < 0
          a = -rng.int(1, 4);
          b = -rng.int(1, 4);
          right = t("Local maximum", "局部极大值点");
          wrong = [t("Local minimum", "局部极小值点"), t("Saddle point", "鞍点"), t("Inconclusive", "无法判定")];
        } else {
          // Saddle point: a > 0, b < 0
          a = rng.int(1, 4);
          b = -rng.int(1, 4);
          right = t("Saddle point", "鞍点");
          wrong = [t("Local minimum", "局部极小值点"), t("Local maximum", "局部极大值点"), t("Inconclusive", "无法判定")];
        }

        const D = 4 * a * b;
        const prompt = t(
          `At the origin $(0, 0)$, the function $f(x, y) = ${poly([a, "x^2"], [b, "y^2"])}$ has a critical point. Use the second partial derivatives test to classify this critical point.`,
          `函数 $f(x, y) = ${poly([a, "x^2"], [b, "y^2"])}$ 在原点 $(0, 0)$ 处有一个临界点。使用二阶偏导数判别法对该临界点进行分类。`,
        );
        const solution = t(
          steps(
            `Compute second partial derivatives: $f_{xx} = ${2 * a}$, $f_{yy} = ${2 * b}$, $f_{xy} = 0$.`,
            `Calculate the discriminant: $D = f_{xx}f_{yy} - (f_{xy})^2 = (${2 * a})(${2 * b}) - 0 = ${D}$.`,
            D > 0
              ? a > 0
                ? `Since $D = ${D} > 0$ and $f_{xx} = ${2 * a} > 0$, the critical point is a local minimum.`
                : `Since $D = ${D} > 0$ and $f_{xx} = ${2 * a} < 0$, the critical point is a local maximum.`
              : `Since $D = ${D} < 0$, the critical point is a saddle point.`,
          ),
          steps(
            `计算二阶偏导数：$f_{xx} = ${2 * a}$，$f_{yy} = ${2 * b}$，$f_{xy} = 0$。`,
            `计算判别式：$D = f_{xx}f_{yy} - (f_{xy})^2 = (${2 * a})(${2 * b}) - 0 = ${D}$。`,
            D > 0
              ? a > 0
                ? `因为 $D = ${D} > 0$ 且 $f_{xx} = ${2 * a} > 0$，故该临界点为局部极小点。`
                : `因为 $D = ${D} > 0$ 且 $f_{xx} = ${2 * a} < 0$，故该临界点为局部极大点。`
              : `因为 $D = ${D} < 0$，故该临界点为鞍点。`,
          ),
        );
        return pickChoice(rng, prompt, right, wrong, solution);
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
  prerequisites: ["the-second-partial-derivatives-test"],
  encompasses: [{ topic: "the-second-partial-derivatives-test", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "finding-global-maximum-on-disks",
      title: t("Finding global maximum on disks", "在闭圆盘上求全局最大值"),
      explanation: t(
        "By the Extreme Value Theorem, a continuous function $f(x, y)$ on a closed bounded set $D$ attains both a global maximum and minimum. Check values at all interior critical points and parameterize the boundary $\\partial D$.",
        "由极值定理，有界闭集 $D$ 上的连续函数 $f(x, y)$ 必能取得全局最大值与最小值。需检验内部所有临界点处的取值，并对边界 $\\partial D$ 参数化求极值。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 4);
        const R = rng.int(2, 6);
        const cVal = rng.int(1, 10);

        // f(x, y) = cVal - a*(x^2 + y^2) on x^2 + y^2 <= R^2
        // Max at (0, 0): f(0, 0) = cVal. Min on boundary: cVal - a*R^2.
        const ans = cVal;

        const prompt = t(
          `Find the global maximum value of the function $f(x, y) = ${poly([cVal, ""], [-a, "x^2"], [-a, "y^2"])}$ on the closed disk $D = \\left\\{(x, y) : x^2 + y^2 \\le ${R * R}\\right\\}$.`,
          `求函数 $f(x, y) = ${poly([cVal, ""], [-a, "x^2"], [-a, "y^2"])}$ 在闭圆盘 $D = \\left\\{(x, y) : x^2 + y^2 \\le ${R * R}\\right\\}$ 上的全局最大值。`,
        );
        const solution = t(
          steps(
            `Find interior critical points: $\\nabla f = \\langle -${2 * a}x, -${2 * a}y \\rangle = \\mathbf{0} \\implies (x, y) = (0, 0)$.`,
            `The value at the critical point is $f(0, 0) = ${cVal}$.`,
            `On the boundary $x^2 + y^2 = ${R * R}$, the value is $f(x, y) = ${cVal} - ${a}(${R * R}) = ${cVal - a * R * R}$.`,
            `Comparing values, the global maximum value is $${ans}$.`,
          ),
          steps(
            `求内部临界点：$\\nabla f = \\langle -${2 * a}x, -${2 * a}y \\rangle = \\mathbf{0} \\implies (x, y) = (0, 0)$。`,
            `临界点处的函数值为 $f(0, 0) = ${cVal}$。`,
            `在边界 $x^2 + y^2 = ${R * R}$ 上，函数值为 $f(x, y) = ${cVal} - ${a}(${R * R}) = ${cVal - a * R * R}$。`,
            `比较各处取值，全局最大值为 $${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [cVal - a * R * R, 0, cVal + a * R * R],
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
  prerequisites: ["calculating-global-extrema-of-multivariable-functions", "the-gradient-as-a-normal-vector"],
  encompasses: [{ topic: "calculating-global-extrema-of-multivariable-functions", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "optimizing-linear-functions-on-circles-using-lagrange",
      title: t("Optimizing linear functions on circles using Lagrange", "利用拉格朗日法在圆上优化线性函数"),
      explanation: t(
        "At an extreme point on the constraint, the gradient of the function is parallel to the gradient of the constraint, which gives equations for the point. To find the maximum of $f(x, y) = ax + by$ subject to $x^2 + y^2 = r^2$, apply $\\nabla f = \\lambda \\nabla g$:\n\n$$\\langle a, b \\rangle = \\lambda \\langle 2x, 2y \\rangle \\implies \\text{Max value} = r\\sqrt{a^2 + b^2}.$$",
        "在约束上的极值点处，函数的梯度与约束的梯度平行，由此得到求该点的方程。在约束条件 $x^2 + y^2 = r^2$ 下求 $f(x, y) = ax + by$ 的最大值，应用 $\\nabla f = \\lambda \\nabla g$：\n\n$$\\langle a, b \\rangle = \\lambda \\langle 2x, 2y \\rangle \\implies \\text{最大值} = r\\sqrt{a^2 + b^2}。$$",
      ),
      generate(rng: Rng): Problem {
        const [a, b, c] = rng.pick(pythagoreanTriples);
        const r = rng.int(1, 5);
        const ans = r * c;

        const prompt = t(
          `Use the method of Lagrange multipliers to find the maximum value of $f(x, y) = ${poly([a, "x"], [b, "y"])}$ subject to the constraint $x^2 + y^2 = ${r * r}$.`,
          `利用拉格朗日乘数法求函数 $f(x, y) = ${poly([a, "x"], [b, "y"])}$ 在约束条件 $x^2 + y^2 = ${r * r}$ 下的最大值。`,
        );
        const solution = t(
          steps(
            `Set up Lagrange system: $\\nabla f = \\lambda \\nabla g \\implies \\langle ${a}, ${b} \\rangle = \\lambda \\langle 2x, 2y \\rangle$.`,
            `This gives $x = \\frac{${a}}{2\\lambda}$ and $y = \\frac{${b}}{2\\lambda}$.`,
            `Substitute into constraint: $\\frac{${a * a} + ${b * b}}{4\\lambda^2} = ${r * r} \\implies 4\\lambda^2 = \\frac{${c * c}}{${r * r}} \\implies 2\\lambda = \\pm \\frac{${c}}{${r}}$.`,
            `The maximum value is $ax + by = \\frac{${a * a} + ${b * b}}{2\\lambda} = ${c * c} \\left(\\frac{${r}}{${c}}\\right) = ${ans}$.`,
          ),
          steps(
            `建立拉格朗日方程组：$\\nabla f = \\lambda \\nabla g \\implies \\langle ${a}, ${b} \\rangle = \\lambda \\langle 2x, 2y \\rangle$。`,
            `解得 $x = \\frac{${a}}{2\\lambda}$ 且 $y = \\frac{${b}}{2\\lambda}$。`,
            `代入约束条件：$\\frac{${a * a} + ${b * b}}{4\\lambda^2} = ${r * r} \\implies 4\\lambda^2 = \\frac{${c * c}}{${r * r}} \\implies 2\\lambda = \\pm \\frac{${c}}{${r}}$。`,
            `最大值为 $ax + by = \\frac{${a * a} + ${b * b}}{2\\lambda} = ${c * c} \\left(\\frac{${r}}{${c}}\\right) = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [c, r * a, -ans],
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
  prerequisites: ["lagrange-multipliers-with-one-constraint"],
  encompasses: [{ topic: "lagrange-multipliers-with-one-constraint", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "formulating-multiple-constraint-lagrange-equations",
      title: t("Formulating multiple-constraint Lagrange equations", "建立多约束拉格朗日方程"),
      explanation: t(
        "For an objective function $f(x, y, z)$ subject to two constraints $g(x, y, z) = c$ and $h(x, y, z) = k$, critical points occur where $\\nabla f$ is in the plane spanned by $\\nabla g$ and $\\nabla h$:\n\n$$\\nabla f = \\lambda \\nabla g + \\mu \\nabla h.$$",
        "对于目标函数 $f(x, y, z)$ 在两个约束条件 $g(x, y, z) = c$ 与 $h(x, y, z) = k$ 下的极值问题，临界点出现在 $\\nabla f$ 位于由 $\\nabla g$ 和 $\\nabla h$ 张成的平面内：\n\n$$\\nabla f = \\lambda \\nabla g + \\mu \\nabla h。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-8, 8);
        const b = rng.nonZero(-8, 8);
        const c1 = rng.int(1, 10);
        const c2 = rng.int(1, 10);
        const ans = a;

        const prompt = t(
          `When optimizing a function $f(x, y, z)$ subject to the two plane constraints $x + y = ${c1}$ and $y + z = ${c2}$, the Lagrange multiplier condition is $\\nabla f = \\lambda \\nabla g + \\mu \\nabla h$. If at an extremum $\\nabla f = \\langle ${a}, ${a + b}, ${b} \\rangle$, find the multiplier $\\lambda$.`,
          `在两个平面约束 $x + y = ${c1}$ 与 $y + z = ${c2}$ 下优化函数 $f(x, y, z)$ 时，拉格朗日乘数条件为 $\\nabla f = \\lambda \\nabla g + \\mu \\nabla h$。若在极值点处 $\\nabla f = \\langle ${a}, ${a + b}, ${b} \\rangle$，求拉格朗日乘数 $\\lambda$ 的值。`,
        );
        const solution = t(
          steps(
            `Compute the constraint gradients: $\\nabla g = \\langle 1, 1, 0 \\rangle$ and $\\nabla h = \\langle 0, 1, 1 \\rangle$.`,
            `The linear combination is $\\lambda \\nabla g + \\mu \\nabla h = \\langle \\lambda, \\lambda + \\mu, \\mu \\rangle$.`,
            `Equating components with $\\nabla f = \\langle ${a}, ${a + b}, ${b} \\rangle$:\n\n` +
              `$$\\lambda = ${a}, \\quad \\mu = ${b}.$$`,
            `Thus $\\lambda = ${ans}$.`,
          ),
          steps(
            `计算约束函数的梯度：$\\nabla g = \\langle 1, 1, 0 \\rangle$ 与 $\\nabla h = \\langle 0, 1, 1 \\rangle$。`,
            `线性组合为 $\\lambda \\nabla g + \\mu \\nabla h = \\langle \\lambda, \\lambda + \\mu, \\mu \\rangle$。`,
            `与 $\\nabla f = \\langle ${a}, ${a + b}, ${b} \\rangle$ 的各分量对应比较：\n\n` + `$$\\lambda = ${a}, \\quad \\mu = ${b}。$$`,
            `因此 $\\lambda = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [b, a + b, a - b],
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
  prerequisites: ["lagrange-multipliers-with-one-constraint"],
  encompasses: [{ topic: "lagrange-multipliers-with-one-constraint", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "maximizing-products-under-linear-constraints",
      title: t("Maximizing products under linear constraints", "在线性约束下求乘积最大值"),
      explanation: t(
        "To maximize $P(x, y) = xy$ subject to a linear budget constraint $ax + by = C$ (with $x, y > 0$), applying Lagrange multipliers yields equal allocation of value: $ax = by = \\frac{C}{2}$, so $xy = \\frac{C^2}{4ab}$.",
        "在正数线性约束 $ax + by = C$ 下最大化乘积 $P(x, y) = xy$，应用拉格朗日乘数法可知各项均分总额：$ax = by = \\frac{C}{2}$，从而最大值为 $xy = \\frac{C^2}{4ab}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 4);
        const b = rng.int(1, 4);
        const k = rng.int(2, 6);
        // C = 2 * a * b * k, so ax = abk => x = bk, by = abk => y = ak
        const C = 2 * a * b * k;
        const xOpt = b * k;
        const yOpt = a * k;
        const ans = xOpt * yOpt;

        const prompt = t(
          `Find the maximum value of $f(x, y) = xy$ subject to the constraint $${poly([a, "x"], [b, "y"])} = ${C}$ for $x, y > 0$.`,
          `求函数 $f(x, y) = xy$ 在约束条件 $${poly([a, "x"], [b, "y"])} = ${C}$（$x, y > 0$）下的最大值。`,
        );
        const solution = t(
          steps(
            `Apply Lagrange multipliers: $\\nabla f = \\lambda \\nabla g \\implies \\langle y, x \\rangle = \\lambda \\langle ${a}, ${b} \\rangle$.`,
            `This gives $y = ${a}\\lambda$ and $x = ${b}\\lambda$.`,
            `Substitute into the constraint: $${a}(${b}\\lambda) + ${b}(${a}\\lambda) = ${2 * a * b}\\lambda = ${C} \\implies \\lambda = ${k}$.`,
            `The optimal values are $x = ${xOpt}$ and $y = ${yOpt}$.`,
            `The maximum product is $f(${xOpt}, ${yOpt}) = (${xOpt})(${yOpt}) = ${ans}$.`,
          ),
          steps(
            `应用拉格朗日乘数法：$\\nabla f = \\lambda \\nabla g \\implies \\langle y, x \\rangle = \\lambda \\langle ${a}, ${b} \\rangle$。`,
            `得到 $y = ${a}\\lambda$ 且 $x = ${b}\\lambda$。`,
            `代入约束条件：$${a}(${b}\\lambda) + ${b}(${a}\\lambda) = ${2 * a * b}\\lambda = ${C} \\implies \\lambda = ${k}$。`,
            `最佳取值为 $x = ${xOpt}$ 与 $y = ${yOpt}$。`,
            `最大乘积为 $f(${xOpt}, ${yOpt}) = (${xOpt})(${yOpt}) = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [Math.floor((C * C) / (2 * a * b)), ans + k, ans * 2],
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
  prerequisites: ["the-derivative-of-a-multivariable-function"],
  encompasses: [{ topic: "the-derivative-of-a-multivariable-function", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "performing-multivariable-newton-step",
      title: t("Performing a multivariable Newton step", "执行多元牛顿迭代步"),
      explanation: t(
        "The multivariable step replaces the function by its linearization and solves the resulting linear system to move toward a root. To solve $\\mathbf{F}(\\mathbf{x}) = \\mathbf{0}$, Newton's iteration update solves $J(\\mathbf{x}_0)\\Delta \\mathbf{x} = -\\mathbf{F}(\\mathbf{x}_0)$ and updates $\\mathbf{x}_1 = \\mathbf{x}_0 + \\Delta \\mathbf{x}$.",
        "多元牛顿法的一步用线性化代替函数，解出所得的线性方程组，从而向根靠近。求解 $\\mathbf{F}(\\mathbf{x}) = \\mathbf{0}$ 时，牛顿迭代步通过求解线性方程组 $J(\\mathbf{x}_0)\\Delta \\mathbf{x} = -\\mathbf{F}(\\mathbf{x}_0)$，并更新 $\\mathbf{x}_1 = \\mathbf{x}_0 + \\Delta \\mathbf{x}$。",
      ),
      generate(rng: Rng): Problem {
        // Linear system: F(x, y) = (a*x - c, b*y - d)
        // J = diag(a, b). For any initial guess (x0, y0), one Newton step gives exact root (c/a, d/b)!
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const cVal = a * rng.int(-3, 3);
        const dVal = b * rng.int(-3, 3);
        const targetX = cVal / a;
        const targetY = dVal / b;
        const answer: Vec2 = [targetX, targetY];

        const prompt = t(
          `Apply one step of Newton's method starting from $(x_0, y_0) = (0, 0)$ to solve $\\mathbf{F}(x, y) = \\mathbf{0}$ for $\\mathbf{F}(x, y) = (${poly([a, "x"], [-cVal, ""])}, ${poly([b, "y"], [-dVal, ""])})$. Express your answer as $(x_1, y_1)$.`,
          `从初始点 $(x_0, y_0) = (0, 0)$ 出发，应用一步牛顿迭代法求解 $\\mathbf{F}(x, y) = \\mathbf{0}$，其中 $\\mathbf{F}(x, y) = (${poly([a, "x"], [-cVal, ""])}, ${poly([b, "y"], [-dVal, ""])})$。结果以 $(x_1, y_1)$ 表示。`,
        );
        const solution = t(
          steps(
            `Compute the Jacobian matrix: $J = \\begin{pmatrix} ${a} & 0 \\\\ 0 & ${b} \\end{pmatrix}$.`,
            `Evaluate $\\mathbf{F}(0, 0) = (${-cVal}, ${-dVal})$.`,
            `Solve $J\\Delta \\mathbf{x} = -\\mathbf{F}(0, 0) = (${cVal}, ${dVal}) \\implies \\Delta x = ${targetX}, \\Delta y = ${targetY}$.`,
            `The next iterate is $\\mathbf{x}_1 = (0, 0) + (${targetX}, ${targetY}) = ${v2L(answer)}$.`,
          ),
          steps(
            `计算雅可比矩阵：$J = \\begin{pmatrix} ${a} & 0 \\\\ 0 & ${b} \\end{pmatrix}$。`,
            `计算 $\\mathbf{F}(0, 0) = (${-cVal}, ${-dVal})$。`,
            `求解 $J\\Delta \\mathbf{x} = -\\mathbf{F}(0, 0) = (${cVal}, ${dVal}) \\implies \\Delta x = ${targetX}, \\Delta y = ${targetY}$。`,
            `下一步迭代值为 $\\mathbf{x}_1 = (0, 0) + (${targetX}, ${targetY}) = ${v2L(answer)}$。`,
          ),
        );
        return pointProblem({
          prompt,
          solution,
          answer,
          vars: ["x", "y"],
          wrong: [
            [-targetX, -targetY],
            [targetY, targetX],
            [0, 0],
          ],
        });
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
  prerequisites: ["newtons-method-for-multivariable-functions", "the-second-derivative-of-a-multivariable-function"],
  encompasses: [{ topic: "newtons-method-for-multivariable-functions", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "performing-newton-optimization-step",
      title: t("Performing a Newton optimization step", "执行牛顿优化迭代步"),
      explanation: t(
        "To minimize or find critical points of $f(\\mathbf{x})$, Newton's optimization iteration solves $H(\\mathbf{x}_0)\\Delta \\mathbf{x} = -\\nabla f(\\mathbf{x}_0)$ and updates $\\mathbf{x}_1 = \\mathbf{x}_0 + \\Delta \\mathbf{x}$. For a quadratic function, one step finds the exact stationary point.",
        "求 $f(\\mathbf{x})$ 的极值点或驻点，牛顿优化迭代步通过求解 $H(\\mathbf{x}_0)\\Delta \\mathbf{x} = -\\nabla f(\\mathbf{x}_0)$，并更新 $\\mathbf{x}_1 = \\mathbf{x}_0 + \\Delta \\mathbf{x}$。对于二次函数，只需一步迭代即可达到精确驻点。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 4);
        const b = rng.int(1, 4);
        const xTarget = rng.int(-3, 3);
        const yTarget = rng.int(-3, 3);

        // f(x, y) = a*(x - xTarget)^2 + b*(y - yTarget)^2
        // = a*x^2 - 2a*xTarget*x + b*y^2 - 2b*yTarget*y + C
        const cCoeff = -2 * a * xTarget;
        const dCoeff = -2 * b * yTarget;
        const answer: Vec2 = [xTarget, yTarget];

        const prompt = t(
          `Apply one iteration of Newton's optimization method from the initial guess $(x_0, y_0) = (0, 0)$ to find the minimum of $f(x, y) = ${poly([a, "x^2"], [b, "y^2"], [cCoeff, "x"], [dCoeff, "y"])}$ using $\\mathbf{x}_1 = \\mathbf{x}_0 - H^{-1}\\nabla f(\\mathbf{x}_0)$. Express your answer as $(x_1, y_1)$.`,
          `从初始猜测 $(x_0, y_0) = (0, 0)$ 出发，利用牛顿优化迭代公式 $\\mathbf{x}_1 = \\mathbf{x}_0 - H^{-1}\\nabla f(\\mathbf{x}_0)$ 执行一步迭代，求函数 $f(x, y) = ${poly([a, "x^2"], [b, "y^2"], [cCoeff, "x"], [dCoeff, "y"])}$ 的极小值点。结果以 $(x_1, y_1)$ 表示。`,
        );
        const solution = t(
          steps(
            `The gradient is $\\nabla f(x, y) = \\langle ${poly([2 * a, "x"], [cCoeff, ""])}, ${poly([2 * b, "y"], [dCoeff, ""])} \\rangle$. At $(0, 0)$, $\\nabla f(0, 0) = \\langle ${cCoeff}, ${dCoeff} \\rangle$.`,
            `The Hessian matrix is constant: $H = \\begin{pmatrix} ${2 * a} & 0 \\\\ 0 & ${2 * b} \\end{pmatrix}$.`,
            `Solve $H\\Delta \\mathbf{x} = -\\nabla f(0, 0) = \\langle ${-cCoeff}, ${-dCoeff} \\rangle \\implies \\Delta x = ${xTarget}, \\Delta y = ${yTarget}$.`,
            `The next point is $(x_1, y_1) = (0, 0) + (${xTarget}, ${yTarget}) = ${v2L(answer)}$.`,
          ),
          steps(
            `梯度为 $\\nabla f(x, y) = \\langle ${poly([2 * a, "x"], [cCoeff, ""])}, ${poly([2 * b, "y"], [dCoeff, ""])} \\rangle$。在 $(0, 0)$ 处，$\\nabla f(0, 0) = \\langle ${cCoeff}, ${dCoeff} \\rangle$。`,
            `黑塞矩阵为常数矩阵：$H = \\begin{pmatrix} ${2 * a} & 0 \\\\ 0 & ${2 * b} \\end{pmatrix}$。`,
            `求解 $H\\Delta \\mathbf{x} = -\\nabla f(0, 0) = \\langle ${-cCoeff}, ${-dCoeff} \\rangle \\implies \\Delta x = ${xTarget}, \\Delta y = ${yTarget}$。`,
            `下一步迭代点为 $(x_1, y_1) = (0, 0) + (${xTarget}, ${yTarget}) = ${v2L(answer)}$。`,
          ),
        );
        return pointProblem({
          prompt,
          solution,
          answer,
          vars: ["x", "y"],
          wrong: [
            [-xTarget, -yTarget],
            [yTarget, xTarget],
            [0, 0],
          ],
        });
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
