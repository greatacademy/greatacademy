import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { paren, poly, Q } from "@ga/subject-math";
import { choiceProblem, numberProblem, steps } from "../problems.ts";

/** Pythagorean triples for clean coordinates. */
const pythagoreanTriples = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [6, 8, 10],
  [9, 12, 15],
  [12, 16, 20],
  [15, 20, 25],
] as const;

/** Helper for multiple-choice problems with shuffled options. */
function pickChoice(rng: Rng, prompt: Text, right: Text, wrong: readonly Text[], solution: Text): Problem {
  const all = [right, ...wrong];
  const perm = rng.shuffle(all.map((_, i) => i));
  const options = perm.map((i) => all[i]!);
  const correct = perm.indexOf(0);
  return choiceProblem({ prompt, options, correct, solution });
}

// ---------------------------------------------------------------------------
// 4.18 Line Integrals of Scalar Functions
// ---------------------------------------------------------------------------

/** simpleClosedAndOrientedCurves classifies curve topologies and orientations. */
export const simpleClosedAndOrientedCurves: TopicDef = {
  id: "simple-closed-and-oriented-curves",
  title: t("Simple, Closed, and Oriented Curves", "简单曲线、闭曲线与有向曲线"),
  summary: t(
    "A curve is simple if it does not cross itself, closed if its endpoints coincide, and oriented when endowed with a direction of traversal.",
    "简单曲线不自交，闭曲线起点与终点重合，有向曲线具有指定的遍历行进方向。",
  ),
  prerequisites: ["the-arc-length-of-a-vector-valued-function"],
  encompasses: [{ topic: "the-arc-length-of-a-vector-valued-function", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "identifying-curve-topologies-and-orientations",
      title: t("Identifying curve topologies and orientations", "识别曲线的拓扑特征与定向"),
      explanation: t(
        "Curve classification:\n- **Simple & closed**: Circle, ellipse, boundary of a polygon (no self-intersections, closed loop).\n- **Closed but not simple**: Figure-eight curve (crosses itself at the origin).\n- **Simple but not closed**: Line segment, open parabolic arc.",
        "曲线拓扑分类：\n- **简单闭曲线**：圆周、椭圆、多边形边界（无自交点且首尾相连）。\n- **闭但不简单**：8字形曲线（在原点自交）。\n- **简单非闭曲线**：线段、开抛物线弧段。",
      ),
      generate(rng: Rng): Problem {
        const type = rng.int(0, 2);
        const r = rng.int(2, 10);

        let desc: Text;
        let right: Text;
        let wrong: readonly Text[];
        let sol: Text;

        if (type === 0) {
          desc = t(
            `The circle $\\mathbf{r}(t) = (${r}\\cos t, ${r}\\sin t)$ for $0 \\le t \\le 2\\pi$`,
            `圆周 $\\mathbf{r}(t) = (${r}\\cos t, ${r}\\sin t)$（$0 \\le t \\le 2\\pi$）`,
          );
          right = t("Simple and closed", "简单闭曲线");
          wrong = [
            t("Closed but not simple", "闭但不简单的曲线"),
            t("Simple but not closed", "简单非闭曲线"),
            t("Neither simple nor closed", "既非简单亦非闭曲线"),
          ];
          sol = t(
            `The curve starts and ends at $(${r}, 0)$ and has no self-intersections on $[0, 2\\pi)$, so it is simple and closed.`,
            `曲线起点与终点均为 $(${r}, 0)$，且在 $[0, 2\\pi)$ 内无自交点，因此是简单闭曲线。`,
          );
        } else if (type === 1) {
          desc = t(
            `The line segment $\\mathbf{r}(t) = (t, ${r}t)$ for $0 \\le t \\le 1$`,
            `线段 $\\mathbf{r}(t) = (t, ${r}t)$（$0 \\le t \\le 1$）`,
          );
          right = t("Simple but not closed", "简单非闭曲线");
          wrong = [
            t("Simple and closed", "简单闭曲线"),
            t("Closed but not simple", "闭但不简单的曲线"),
            t("Neither simple nor closed", "既非简单亦非闭曲线"),
          ];
          sol = t(
            `The endpoints $(0, 0)$ and $(1, ${r})$ are distinct, and the segment never self-intersects, so it is simple but not closed.`,
            `端点 $(0, 0)$ 与 $(1, ${r})$ 不重合，且线段无自交，故为简单非闭曲线。`,
          );
        } else {
          desc = t(
            `The figure-eight curve $\\mathbf{r}(t) = (${r}\\sin t, ${r}\\sin(2t))$ for $0 \\le t \\le 2\\pi$`,
            `8字形曲线 $\\mathbf{r}(t) = (${r}\\sin t, ${r}\\sin(2t))$（$0 \\le t \\le 2\\pi$）`,
          );
          right = t("Closed but not simple", "闭但不简单的曲线");
          wrong = [
            t("Simple and closed", "简单闭曲线"),
            t("Simple but not closed", "简单非闭曲线"),
            t("Neither simple nor closed", "既非简单亦非闭曲线"),
          ];
          sol = t(
            `The curve is closed since $\\mathbf{r}(0) = \\mathbf{r}(2\\pi) = (0, 0)$, but it intersects itself at $(0, 0)$ when $t = \\pi$, so it is not simple.`,
            `曲线首尾重合 $\\mathbf{r}(0) = \\mathbf{r}(2\\pi) = (0, 0)$，但在 $t = \\pi$ 处自交于原点，故为闭但非简单曲线。`,
          );
        }

        const prompt = t(`Classify the topological type of the plane curve: ${desc.en}.`, `判断平面曲线的拓扑类型：${desc["zh-CN"]}。`);
        const solution = t(`The curve is ${right.en.toLowerCase()} because ${sol.en}`, `该曲线为${right["zh-CN"]}，因为${sol["zh-CN"]}`);
        return pickChoice(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

/** lineIntegralsOfScalarFunctions evaluates scalar line integrals. */
export const lineIntegralsOfScalarFunctions: TopicDef = {
  id: "line-integrals-of-scalar-functions",
  title: t("Line Integrals of Scalar Functions", "标量函数的第一类曲线积分"),
  summary: t(
    "The scalar line integral $\\int_C f\\,ds$ integrates a function along a curve with respect to arc length $ds = \\|\\mathbf{r}'(t)\\|\\,dt$.",
    "标量函数的曲线积分 $\\int_C f\\,ds$ 沿曲线对弧长微元 $ds = \\|\\mathbf{r}'(t)\\|\\,dt$ 积分。",
  ),
  prerequisites: ["simple-closed-and-oriented-curves"],
  encompasses: [{ topic: "simple-closed-and-oriented-curves", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-scalar-line-integrals-using-arc-length",
      title: t("Evaluating scalar line integrals using arc length", "利用弧长微元计算标量曲线积分"),
      explanation: t(
        "For a curve parameterized by $\\mathbf{r}(t)$ on $[a, b]$, the line integral is:\n\n$$\\int_C f(x, y)\\,ds = \\int_a^b f(\\mathbf{r}(t))\\,\\|\\mathbf{r}'(t)\\|\\,dt.$$",
        "对于由 $\\mathbf{r}(t)$（$t \\in [a, b]$）参数化的曲线，第一类曲线积分为：\n\n$$\\int_C f(x, y)\\,ds = \\int_a^b f(\\mathbf{r}(t))\\,\\|\\mathbf{r}'(t)\\|\\,dt。$$",
      ),
      generate(rng: Rng): Problem {
        const [x1_0, y1_0, L0] = rng.pick(pythagoreanTriples);
        const k = rng.int(1, 4);
        const x1 = x1_0 * k;
        const y1 = y1_0 * k;
        const L = L0 * k;
        const c = rng.int(1, 6);

        // Path: r(t) = (x1*t, y1*t), t in [0, 1]. ||r'(t)|| = L.
        // f(x, y) = c * (x + y).
        // Integral = c * (x1 + y1) * L * int_0^1 t dt = c * (x1 + y1) * L / 2.
        const num = c * (x1 + y1) * L;
        const ans = Q.of(num, 2);

        const prompt = t(
          `Evaluate the scalar line integral $\\int_C ${c}(x + y)\\,ds$ along the straight line segment $C$ from $(0, 0)$ to $(${x1}, ${y1})$.`,
          `计算第一类曲线积分 $\\int_C ${c}(x + y)\\,ds$ 的值，其中 $C$ 为从 $(0, 0)$ 到 $(${x1}, ${y1})$ 的直线段。`,
        );
        const solution = t(
          steps(
            `Parametrize the line segment: $\\mathbf{r}(t) = \\langle ${x1}t, ${y1}t \\rangle$ for $0 \\le t \\le 1$.`,
            `Compute the speed element: $\\mathbf{r}'(t) = \\langle ${x1}, ${y1} \\rangle \\implies ds = \\sqrt{${x1}^2 + ${y1}^2}\\,dt = ${L}\\,dt$.`,
            `Substitute into the integral: $\\int_0^1 ${c}(${x1}t + ${y1}t)(${L})\\,dt = ${c * (x1 + y1) * L} \\int_0^1 t\\,dt = \\frac{${num}}{2} = ${ans.toLatex()}$.`,
          ),
          steps(
            `参数化线段：$\\mathbf{r}(t) = \\langle ${x1}t, ${y1}t \\rangle$（$0 \\le t \\le 1$）。`,
            `计算速度及弧长微元：$\\mathbf{r}'(t) = \\langle ${x1}, ${y1} \\rangle \\implies ds = \\sqrt{${x1}^2 + ${y1}^2}\\,dt = ${L}\\,dt$。`,
            `代入积分式：$\\int_0^1 ${c}(${x1}t + ${y1}t)(${L})\\,dt = ${c * (x1 + y1) * L} \\int_0^1 t\\,dt = \\frac{${num}}{2} = ${ans.toLatex()}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [Q.of(num), ans.mul(Q.of(2)), ans.div(Q.of(2))],
        });
      },
    },
  ],
};

/** propertiesOfLineIntegralsOfScalarFunctions covers orientation invariance. */
export const propertiesOfLineIntegralsOfScalarFunctions: TopicDef = {
  id: "properties-of-line-integrals-of-scalar-functions",
  title: t("Properties of Line Integrals of Scalar Functions", "标量函数曲线积分的性质"),
  summary: t(
    "Scalar line integrals do not depend on the orientation of the curve, $\\int_{-C} f\\,ds = \\int_C f\\,ds$, and are linear in the integrand.",
    "标量曲线积分与曲线方向无关：$\\int_{-C} f\\,ds = \\int_C f\\,ds$，且对被积函数是线性的。",
  ),
  prerequisites: ["line-integrals-of-scalar-functions"],
  encompasses: [{ topic: "line-integrals-of-scalar-functions", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "invariance-under-orientation-reversal",
      title: t("Invariance under orientation reversal", "标量曲线积分对定向反转的对称性"),
      explanation: t(
        "Because arc length $ds = \\|\\mathbf{r}'(t)\\|\\,dt$ is always non-negative, reversing the direction of traversal does not change the sign of a scalar line integral:\n\n$$\\int_{-C} f\\,ds = \\int_C f\\,ds.$$",
        "因为弧长微元 $ds = \\|\\mathbf{r}'(t)\\|\\,dt$ 始终非负，颠倒曲线的遍历方向不会改变第一类标量曲线积分的符号：\n\n$$\\int_{-C} f\\,ds = \\int_C f\\,ds。$$",
      ),
      generate(rng: Rng): Problem {
        const val = rng.int(10, 50);
        const alpha = rng.int(2, 5);
        const ans = alpha * val;

        const prompt = t(
          `Suppose $\\int_C f\\,ds = ${val}$. Find the value of $\\int_{-C} ${alpha}f\\,ds$, where $-C$ denotes the same curve traversed in the opposite direction.`,
          `已知 $\\int_C f\\,ds = ${val}$。求 $\\int_{-C} ${alpha}f\\,ds$ 的值，其中 $-C$ 表示沿相反方向遍历的同一曲线。`,
        );
        const solution = t(
          steps(
            `For scalar line integrals with respect to arc length, orientation does not change the sign: $\\int_{-C} f\\,ds = \\int_C f\\,ds$.`,
            `By linearity, $\\int_{-C} ${alpha}f\\,ds = ${alpha} \\int_C f\\,ds = ${alpha}(${val}) = ${ans}$.`,
          ),
          steps(
            `对于对弧长的第一类标量曲线积分，遍历方向的反转不改变积分值：$\\int_{-C} f\\,ds = \\int_C f\\,ds$。`,
            `由线性性质，$\\int_{-C} ${alpha}f\\,ds = ${alpha} \\int_C f\\,ds = ${alpha}(${val}) = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [-ans, val, ans + alpha],
        });
      },
    },
  ],
};

/** lineIntegralsOfScalarFunctionsOverPathsExpressedAsFunctionsOfX evaluates integrals along y = g(x). */
export const lineIntegralsOfScalarFunctionsOverPathsExpressedAsFunctionsOfX: TopicDef = {
  id: "line-integrals-of-scalar-functions-over-paths-expressed-as-functions-of-x",
  title: t("Line Integrals of Scalar Functions Over Paths Expressed as Functions of X", "沿 y = g(x) 路径的标量曲线积分"),
  summary: t(
    "When a path is given explicitly by y = g(x), the arc length element is ds = √(1 + [g'(x)]²) dx.",
    "当曲线由显式方程 y = g(x) 给出时，弧长微元为 ds = √(1 + [g'(x)]²) dx。",
  ),
  prerequisites: ["line-integrals-of-scalar-functions"],
  encompasses: [{ topic: "line-integrals-of-scalar-functions", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "line-integrals-along-explicit-curves-y-equals-g-of-x",
      title: t("Line integrals along explicit curves y = g(x)", "计算沿显式曲线 y = g(x) 的标量曲线积分"),
      explanation: t(
        "For $y = mx$ with $0 \\le x \\le a$, the arc length differential is $ds = \\sqrt{1 + m^2}\\,dx$. Integrating $kx$ yields:\n\n$$\\int_C kx\\,ds = k\\sqrt{1 + m^2} \\int_0^a x\\,dx = k\\sqrt{1 + m^2}\\frac{a^2}{2}.$$",
        "对于 $0 \\le x \\le a$ 上的线段 $y = mx$，弧长微元为 $ds = \\sqrt{1 + m^2}\\,dx$。对 $kx$ 积分得到：\n\n$$\\int_C kx\\,ds = k\\sqrt{1 + m^2} \\int_0^a x\\,dx = k\\sqrt{1 + m^2}\\frac{a^2}{2}。$$",
      ),
      generate(rng: Rng): Problem {
        // Pythagorean triple for clean sqrt(1 + m^2): m = b/a => sqrt(1 + m^2) = c/a
        const [a0, b0, c0] = rng.pick(pythagoreanTriples);
        const k = rng.int(1, 4);
        const a = a0;
        const b = b0;
        const c = c0;
        const coeff = 2 * k;

        // ds = (c / a) dx.
        // int_0^a coeff * x * (c / a) dx = coeff * (c / a) * [a^2 / 2] = coeff * c * a / 2 = k * c * a.
        const ans = k * c * a;

        const prompt = t(
          `Evaluate the line integral $\\int_C ${coeff}x\\,ds$ along the line segment $y = \\frac{${b}}{${a}}x$ from $x = 0$ to $x = ${a}$.`,
          `计算第一类曲线积分 $\\int_C ${coeff}x\\,ds$，其中曲线 $C$ 为直线段 $y = \\frac{${b}}{${a}}x$ 从 $x = 0$ 到 $x = ${a}$。`,
        );
        const solution = t(
          steps(
            `Compute the derivative: $y' = \\frac{${b}}{${a}}$.`,
            `Find the arc length element: $ds = \\sqrt{1 + (y')^2}\\,dx = \\sqrt{1 + \\frac{${b * b}}{${a * a}}}\\,dx = \\frac{\\sqrt{${a * a + b * b}}}{${a}}\\,dx = \\frac{${c}}{${a}}\\,dx$.`,
            `Integrate: $\\int_0^{${a}} ${coeff}x \\left(\\frac{${c}}{${a}}\\right)dx = \\frac{${coeff * c}}{${a}} \\left[\\frac{x^2}{2}\\right]_0^{${a}} = \\frac{${coeff * c}}{${a}}\\frac{${a * a}}{2} = ${ans}$.`,
          ),
          steps(
            `求导数：$y' = \\frac{${b}}{${a}}$。`,
            `计算弧长微元：$ds = \\sqrt{1 + (y')^2}\\,dx = \\sqrt{1 + \\frac{${b * b}}{${a * a}}}\\,dx = \\frac{\\sqrt{${a * a + b * b}}}{${a}}\\,dx = \\frac{${c}}{${a}}\\,dx$。`,
            `计算定积分：$\\int_0^{${a}} ${coeff}x \\left(\\frac{${c}}{${a}}\\right)dx = \\frac{${coeff * c}}{${a}} \\left[\\frac{x^2}{2}\\right]_0^{${a}} = \\frac{${coeff * c}}{${a}}\\frac{${a * a}}{2} = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [ans * 2, ans - c, ans + c],
        });
      },
    },
  ],
};

/** lineIntegralsOfScalarFunctionsOverPathsExpressedAsFunctionsOfY evaluates integrals along x = h(y). */
export const lineIntegralsOfScalarFunctionsOverPathsExpressedAsFunctionsOfY: TopicDef = {
  id: "line-integrals-of-scalar-functions-over-paths-expressed-as-functions-of-y",
  title: t("Line Integrals of Scalar Functions Over Paths Expressed as Functions of Y", "沿 x = h(y) 路径的标量曲线积分"),
  summary: t(
    "When a path is given explicitly by x = h(y), the arc length element is ds = √(1 + [h'(y)]²) dy.",
    "当曲线由显式方程 x = h(y) 给出时，弧长微元为 ds = √(1 + [h'(y)]²) dy。",
  ),
  prerequisites: ["line-integrals-of-scalar-functions-over-paths-expressed-as-functions-of-x"],
  encompasses: [
    {
      topic: "line-integrals-of-scalar-functions-over-paths-expressed-as-functions-of-x",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "line-integrals-along-explicit-curves-x-equals-h-of-y",
      title: t("Line integrals along explicit curves x = h(y)", "计算沿显式曲线 x = h(y) 的标量曲线积分"),
      explanation: t(
        "For $x = \\frac{a}{b}y$ with $0 \\le y \\le b$, $ds = \\frac{\\sqrt{a^2 + b^2}}{b}\\,dy = \\frac{c}{b}\\,dy$. Then $\\int_C ky\\,ds = \\frac{kc b}{2}$.",
        "对于 $0 \\le y \\le b$ 上的线段 $x = \\frac{a}{b}y$，$ds = \\frac{\\sqrt{a^2 + b^2}}{b}\\,dy = \\frac{c}{b}\\,dy$。则 $\\int_C ky\\,ds = \\frac{kc b}{2}$。",
      ),
      generate(rng: Rng): Problem {
        const [a0, b0, c0] = rng.pick(pythagoreanTriples);
        const k = rng.int(1, 4);
        const a = a0;
        const b = b0;
        const c = c0;
        const coeff = 2 * k;

        const ans = k * c * b;

        const prompt = t(
          `Evaluate the line integral $\\int_C ${coeff}y\\,ds$ along the curve $x = \\frac{${a}}{${b}}y$ from $y = 0$ to $y = ${b}$.`,
          `计算第一类曲线积分 $\\int_C ${coeff}y\\,ds$，其中曲线 $C$ 为直线段 $x = \\frac{${a}}{${b}}y$ 从 $y = 0$ 到 $y = ${b}$。`,
        );
        const solution = t(
          steps(
            `Compute the derivative with respect to $y$: $x'(y) = \\frac{${a}}{${b}}$.`,
            `Find the arc length element: $ds = \\sqrt{1 + (x')^2}\\,dy = \\sqrt{1 + \\frac{${a * a}}{${b * b}}}\\,dy = \\frac{${c}}{${b}}\\,dy$.`,
            `Integrate: $\\int_0^{${b}} ${coeff}y \\left(\\frac{${c}}{${b}}\\right)dy = \\frac{${coeff * c}}{${b}} \\left[\\frac{y^2}{2}\\right]_0^{${b}} = ${ans}$.`,
          ),
          steps(
            `对 $y$ 求导：$x'(y) = \\frac{${a}}{${b}}$。`,
            `计算弧长微元：$ds = \\sqrt{1 + (x')^2}\\,dy = \\sqrt{1 + \\frac{${a * a}}{${b * b}}}\\,dy = \\frac{${c}}{${b}}\\,dy$。`,
            `计算定积分：$\\int_0^{${b}} ${coeff}y \\left(\\frac{${c}}{${b}}\\right)dy = \\frac{${coeff * c}}{${b}} \\left[\\frac{y^2}{2}\\right]_0^{${b}} = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [ans * 2, ans - c, ans + c],
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 4.19 Line Integrals of Scalar Functions Over Parametric Curves
// ---------------------------------------------------------------------------

/** lineIntegralsOfScalarFunctionsOverLineSegments integrates scalar functions over 3D line segments. */
export const lineIntegralsOfScalarFunctionsOverLineSegments: TopicDef = {
  id: "line-integrals-of-scalar-functions-over-line-segments",
  title: t("Line Integrals of Scalar Functions Over Line Segments", "线段上的标量曲线积分"),
  summary: t(
    "Line segments parameterized by r(t) = P0 + t(P1 - P0) for t in [0, 1] have constant speed ||r'(t)|| = |P1 - P0|.",
    "由 r(t) = P0 + t(P1 - P0)（t in [0, 1]）参数化的线段具有恒定切向速度 ||r'(t)|| = |P1 - P0|。",
  ),
  prerequisites: ["line-integrals-of-scalar-functions"],
  encompasses: [{ topic: "line-integrals-of-scalar-functions", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "integrating-linear-functions-over-line-segments",
      title: t("Integrating linear functions over line segments", "在线段上积分线性标量函数"),
      explanation: t(
        "For a line segment connecting $(0, 0)$ to $(x_1, y_1)$ with length $L = \\sqrt{x_1^2 + y_1^2}$, $\\int_C k\\,ds = kL$.",
        "对于连接 $(0, 0)$ 到 $(x_1, y_1)$、长度为 $L = \\sqrt{x_1^2 + y_1^2}$ 的线段，$\\int_C k\\,ds = kL$。",
      ),
      generate(rng: Rng): Problem {
        const [x0, y0, L0] = rng.pick(pythagoreanTriples);
        const k = rng.int(1, 4);
        const x1 = x0 * k;
        const y1 = y0 * k;
        const L = L0 * k;
        const c = rng.int(2, 8);
        const ans = c * L;

        const prompt = t(
          `Find the value of the line integral $\\int_C ${c}\\,ds$ along the straight line segment $C$ from $(0, 0)$ to $(${x1}, ${y1})$.`,
          `求第一类曲线积分 $\\int_C ${c}\\,ds$ 的值，其中 $C$ 为从 $(0, 0)$ 到 $(${x1}, ${y1})$ 的直线段。`,
        );
        const solution = t(
          steps(
            `The length of the line segment is $L = \\sqrt{(${x1})^2 + (${y1})^2} = \\sqrt{${x1 * x1 + y1 * y1}} = ${L}$.`,
            `Since the integrand is constant, $\\int_C ${c}\\,ds = ${c} \\cdot L = ${c} \\times ${L} = ${ans}$.`,
          ),
          steps(
            `线段长度为 $L = \\sqrt{(${x1})^2 + (${y1})^2} = \\sqrt{${x1 * x1 + y1 * y1}} = ${L}$。`,
            `由于被积函数为常数，$\\int_C ${c}\\,ds = ${c} \\cdot L = ${c} \\times ${L} = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [c * (x1 + y1), ans + 2, ans + c],
        });
      },
    },
  ],
};

/** lineIntegralsOfScalarFunctionsOverCircles integrates scalar functions over circular paths. */
export const lineIntegralsOfScalarFunctionsOverCircles: TopicDef = {
  id: "line-integrals-of-scalar-functions-over-circles",
  title: t("Line Integrals of Scalar Functions Over Circles", "圆周上的标量曲线积分"),
  summary: t(
    "On a circle of radius R, ds = R dθ, reducing scalar line integrals to standard single integrals from 0 to 2π.",
    "在半径为 R 的圆周上，弧长微元 ds = R dθ，将标量曲线积分化为 0 到 2π 的一元定积分。",
  ),
  prerequisites: ["line-integrals-of-scalar-functions-over-line-segments"],
  encompasses: [
    {
      topic: "line-integrals-of-scalar-functions-over-line-segments",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "integrating-constant-density-over-circular-wire",
      title: t("Integrating constant density over circular wire", "在圆形细丝上计算恒定线密度的质量积分"),
      explanation: t(
        "For a full circle $C$ of radius $R$ centered at the origin, the line integral of a constant density $\\rho_0$ divided by $\\pi$ is:\n\n$$\\frac{1}{\\pi}\\int_C \\rho_0\\,ds = \\frac{\\rho_0}{\\pi}(2\\pi R) = 2\\rho_0 R.$$",
        "对于以原点为中心、半径为 $R$ 的完整圆周 $C$，恒定密度 $\\rho_0$ 的曲线积分除以 $\\pi$ 为：\n\n$$\\frac{1}{\\pi}\\int_C \\rho_0\\,ds = \\frac{\\rho_0}{\\pi}(2\\pi R) = 2\\rho_0 R。$$",
      ),
      generate(rng: Rng): Problem {
        const R = rng.int(2, 12);
        const rho = rng.int(1, 8);
        const ans = 2 * rho * R;

        const prompt = t(
          `Find the value of $\\frac{1}{\\pi} \\int_C ${rho}\\,ds$, where $C$ is the circle $x^2 + y^2 = ${R * R}$ traversed once.`,
          `计算 $\\frac{1}{\\pi} \\int_C ${rho}\\,ds$ 的值，其中 $C$ 为圆周 $x^2 + y^2 = ${R * R}$。`,
        );
        const solution = t(
          steps(
            `The perimeter of the circle of radius $R = ${R}$ is $2\\pi R = 2\\pi(${R}) = ${2 * R}\\pi$.`,
            `The integral is $\\int_C ${rho}\\,ds = ${rho}(2\\pi R) = ${2 * rho * R}\\pi$.`,
            `Dividing by $\\pi$ yields $${ans}$.`,
          ),
          steps(
            `半径为 $R = ${R}$ 的圆周周长为 $2\\pi R = 2\\pi(${R}) = ${2 * R}\\pi$。`,
            `积分为 $\\int_C ${rho}\\,ds = ${rho}(2\\pi R) = ${2 * rho * R}\\pi$。`,
            `除以 $\\pi$ 得到 $${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [rho * R, 4 * rho * R, ans + rho],
        });
      },
    },
  ],
};

/** lineIntegralsOfScalarFunctionsOverEllipses uses symmetry over elliptical paths. */
export const lineIntegralsOfScalarFunctionsOverEllipses: TopicDef = {
  id: "line-integrals-of-scalar-functions-over-ellipses",
  title: t("Line Integrals of Scalar Functions Over Ellipses", "椭圆上的标量曲线积分与对称性"),
  summary: t(
    "Odd integrand components cancel over symmetric elliptical paths, simplifying line integrals to symmetric quarters.",
    "奇函数被积项在对称椭圆路径上的积分为零，利用对称性可极大简化积分计算。",
  ),
  prerequisites: ["line-integrals-of-scalar-functions-over-circles"],
  encompasses: [{ topic: "line-integrals-of-scalar-functions-over-circles", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "integrating-over-symmetric-quadrants-of-ellipses",
      title: t("Integrating over symmetric quadrants of ellipses", "利用椭圆对称性计算曲线积分"),
      explanation: t(
        "By symmetry across the coordinate axes, for the ellipse $C: \\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$:\n\n$$\\oint_C (cx + k)\\,ds = \\oint_C cx\\,ds + k\\oint_C 1\\,ds = 0 + k\\,\\text{Length}(C).$$",
        "由关于坐标轴的对称性，对于椭圆 $C: \\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$：\n\n$$\\oint_C (cx + k)\\,ds = \\oint_C cx\\,ds + k\\oint_C 1\\,ds = 0 + k\\,\\text{Length}(C)。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 8);
        const b = rng.int(2, 8);
        const c = rng.nonZero(-6, 6);
        const ans = 0;

        const prompt = t(
          `Evaluate the line integral $\\oint_C (${poly([c, "x^3"])})\\,ds$ around the complete ellipse $C: \\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} = 1$.`,
          `计算沿完整椭圆 $C: \\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} = 1$ 的曲线积分 $\\oint_C (${poly([c, "x^3"])})\\,ds$。`,
        );
        const solution = t(
          steps(
            `The ellipse is symmetric with respect to the $y$-axis (under $x \\mapsto -x$).`,
            `The integrand $f(x, y) = ${poly([c, "x^3"])}$ is odd with respect to $x$: $f(-x, y) = -f(x, y)$.`,
            `Therefore, the contributions from opposite points cancel identically, giving $\\oint_C ${poly([c, "x^3"])}\\,ds = 0$.`,
          ),
          steps(
            `椭圆关于 $y$ 轴对称（在变换 $x \\mapsto -x$ 下保持不变）。`,
            `被积函数 $f(x, y) = ${poly([c, "x^3"])}$ 关于 $x$ 是奇函数：$f(-x, y) = -f(x, y)$。`,
            `因此关于 $y$ 轴对称的对应点贡献互相抵消，得 $\\oint_C ${poly([c, "x^3"])}\\,ds = 0$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [c * a * b, 2 * c * a, c * a * a],
        });
      },
    },
  ],
};

/** furtherPropertiesOfLineIntegralsOfScalarFunctions covers piecewise additivity. */
export const furtherPropertiesOfLineIntegralsOfScalarFunctions: TopicDef = {
  id: "further-properties-of-line-integrals-of-scalar-functions",
  title: t("Further Properties of Line Integrals of Scalar Functions", "标量函数曲线积分的进一步性质"),
  summary: t(
    "A line integral over a piecewise-smooth curve is the sum of the integrals over its smooth pieces: $\\int_{C_1 + C_2} f\\,ds = \\int_{C_1} f\\,ds + \\int_{C_2} f\\,ds$.",
    "分段光滑曲线上的曲线积分等于各光滑段上积分之和：$\\int_{C_1 + C_2} f\\,ds = \\int_{C_1} f\\,ds + \\int_{C_2} f\\,ds$。",
  ),
  prerequisites: ["line-integrals-of-scalar-functions-over-circles"],
  encompasses: [{ topic: "line-integrals-of-scalar-functions-over-circles", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "additivity-over-piecewise-smooth-paths",
      title: t("Additivity over piecewise-smooth paths", "分段光滑路径上的可加性"),
      explanation: t(
        "If a path $C$ consists of $k$ smooth components $C_1, C_2, \\dots, C_k$ joined end-to-end:\n\n$$\\int_C f\\,ds = \\sum_{i=1}^k \\int_{C_i} f\\,ds.$$",
        "若路径 $C$ 由首尾相接的 $k$ 个光滑子段 $C_1, C_2, \\dots, C_k$ 构成：\n\n$$\\int_C f\\,ds = \\sum_{i=1}^k \\int_{C_i} f\\,ds。$$",
      ),
      generate(rng: Rng): Problem {
        const i1 = rng.int(5, 30);
        const i2 = rng.int(5, 30);
        const i3 = rng.int(5, 30);
        const ans = i1 + i2 + i3;

        const prompt = t(
          `A piecewise-smooth curve $C$ is the union of three smooth segments $C_1$, $C_2$, and $C_3$. If $\\int_{C_1} f\\,ds = ${i1}$, $\\int_{C_2} f\\,ds = ${i2}$, and $\\int_{C_3} f\\,ds = ${i3}$, find $\\int_C f\\,ds$.`,
          `分段光滑曲线 $C$ 由三个光滑子段 $C_1$、$C_2$ 与 $C_3$ 顺次连接而成。若 $\\int_{C_1} f\\,ds = ${i1}$、$\\int_{C_2} f\\,ds = ${i2}$ 且 $\\int_{C_3} f\\,ds = ${i3}$，求 $\\int_C f\\,ds$。`,
        );
        const solution = t(
          steps(
            `Apply additivity of the line integral over the components: $\\int_C f\\,ds = \\int_{C_1} f\\,ds + \\int_{C_2} f\\,ds + \\int_{C_3} f\\,ds$.`,
            `Sum the values: $${i1} + ${i2} + ${i3} = ${ans}$.`,
          ),
          steps(
            `应用曲线积分对路径的可加性：$\\int_C f\\,ds = \\int_{C_1} f\\,ds + \\int_{C_2} f\\,ds + \\int_{C_3} f\\,ds$。`,
            `求和：$${i1} + ${i2} + ${i3} = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [ans - i1, ans + i2, i1 + i2],
        });
      },
    },
  ],
};

/** lineIntegralsOfScalarFunctionsOverPolarCurves integrates in polar coordinates. */
export const lineIntegralsOfScalarFunctionsOverPolarCurves: TopicDef = {
  id: "line-integrals-of-scalar-functions-over-polar-curves",
  title: t("Line Integrals of Scalar Functions Over Polar Curves", "极坐标曲线上的标量曲线积分"),
  summary: t(
    "Along polar curves r = g(θ), the arc length differential is ds = √(r² + [r'(θ)]²) dθ.",
    "沿极坐标曲线 r = g(θ)，弧长微元为 ds = √(r² + [r'(θ)]²) dθ。",
  ),
  prerequisites: ["line-integrals-of-scalar-functions-over-circles"],
  encompasses: [{ topic: "line-integrals-of-scalar-functions-over-circles", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "arc-length-element-in-polar-coordinates",
      title: t("Arc length element in polar coordinates", "极坐标下的弧长微元计算"),
      explanation: t(
        "For a curve given by $r = g(\\theta)$ on $[\\alpha, \\beta]$, the line integral is:\n\n$$\\int_C f(r, \\theta)\\,ds = \\int_\\alpha^\\beta f(g(\\theta), \\theta)\\sqrt{[g(\\theta)]^2 + [g'(\\theta)]^2}\\,d\\theta.$$",
        "对于由 $r = g(\\theta)$（$\\theta \\in [\\alpha, \\beta]$）给出的曲线，第一类曲线积分为：\n\n$$\\int_C f(r, \\theta)\\,ds = \\int_\\alpha^\\beta f(g(\\theta), \\theta)\\sqrt{[g(\\theta)]^2 + [g'(\\theta)]^2}\\,d\\theta。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 10);
        // Circle r = a, r' = 0 => ds = a dtheta.
        // theta from 0 to pi / k
        const k = rng.pick([2, 3, 4, 6]);
        // int_C ds = a * (pi / k)
        // (1 / pi) * int_C ds = a / k
        const ans = Q.of(a, k);

        const prompt = t(
          `Find the value of $\\frac{1}{\\pi} \\int_C 1\\,ds$ along the polar arc $r = ${a}$ for $0 \\le \\theta \\le \\frac{\\pi}{${k}}$.`,
          `计算 $\\frac{1}{\\pi} \\int_C 1\\,ds$ 的值，其中曲线 $C$ 为极坐标弧 $r = ${a}$（$0 \\le \\theta \\le \\frac{\\pi}{${k}}$）。`,
        );
        const solution = t(
          steps(
            `For $r = ${a}$, $\\frac{dr}{d\\theta} = 0$, so $ds = \\sqrt{r^2 + (r')^2}\\,d\\theta = \\sqrt{${a * a} + 0}\\,d\\theta = ${a}\\,d\\theta$.`,
            `Integrate: $\\int_C 1\\,ds = \\int_0^{\\pi/${k}} ${a}\\,d\\theta = ${a} \\cdot \\frac{\\pi}{${k}} = \\frac{${a}\\pi}{${k}}$.`,
            `Dividing by $\\pi$ gives $${ans.toLatex()}$.`,
          ),
          steps(
            `对于 $r = ${a}$，$\\frac{dr}{d\\theta} = 0$，故 $ds = \\sqrt{r^2 + (r')^2}\\,d\\theta = \\sqrt{${a * a} + 0}\\,d\\theta = ${a}\\,d\\theta$。`,
            `积分：$\\int_C 1\\,ds = \\int_0^{\\pi/${k}} ${a}\\,d\\theta = ${a} \\cdot \\frac{\\pi}{${k}} = \\frac{${a}\\pi}{${k}}$。`,
            `除以 $\\pi$ 得到 $${ans.toLatex()}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [Q.of(a), ans.mul(Q.of(2)), ans.div(Q.of(2))],
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 4.20 Line Integrals With Respect to X and Y
// ---------------------------------------------------------------------------

/** lineIntegralsWithRespectToXAndY introduces differential component line integrals. */
export const lineIntegralsWithRespectToXAndY: TopicDef = {
  id: "line-integrals-with-respect-to-x-and-y",
  title: t("Line Integrals With Respect to X and Y", "对坐标 x 与 y 的第二类曲线积分"),
  summary: t(
    "The line integrals $\\int_C P\\,dx$ and $\\int_C Q\\,dy$ integrate along an oriented curve with respect to the change in $x$ or in $y$.",
    "对坐标的曲线积分 $\\int_C P\\,dx$ 与 $\\int_C Q\\,dy$ 沿有向曲线对 $x$ 或 $y$ 的变化量积分。",
  ),
  prerequisites: ["line-integrals-of-scalar-functions-over-line-segments"],
  encompasses: [
    {
      topic: "line-integrals-of-scalar-functions-over-line-segments",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "differential-line-integrals-along-curves",
      title: t("Differential line integrals along curves", "计算沿曲线的坐标微分积分"),
      explanation: t(
        "For a curve parameterized by $\\mathbf{r}(t) = (x(t), y(t))$ on $[a, b]$:\n\n$$\\int_C P(x, y)\\,dx = \\int_a^b P(x(t), y(t))\\,x'(t)\\,dt, \\quad \\int_C Q(x, y)\\,dy = \\int_a^b Q(x(t), y(t))\\,y'(t)\\,dt.$$",
        "对于由 $\\mathbf{r}(t) = (x(t), y(t))$（$t \\in [a, b]$）参数化的曲线：\n\n$$\\int_C P(x, y)\\,dx = \\int_a^b P(x(t), y(t))\\,x'(t)\\,dt, \\quad \\int_C Q(x, y)\\,dy = \\int_a^b Q(x(t), y(t))\\,y'(t)\\,dt。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-4, 4);
        const b = rng.int(1, 5);

        // Path: y = x^2 from x = 0 to x = b.
        // int_C a y dx = int_0^b a x^2 dx = a * b^3 / 3.
        const num = a * b * b * b;
        const ans = Q.of(num, 3);

        const prompt = t(
          `Evaluate $\\int_C ${poly([a, "y"])}\\,dx$ along the parabolic arc $y = x^2$ from $(0, 0)$ to $(${b}, ${b * b})$.`,
          `计算 $\\int_C ${poly([a, "y"])}\\,dx$ 的值，其中曲线 $C$ 为抛物线弧 $y = x^2$ 从 $(0, 0)$ 到 $(${b}, ${b * b})$。`,
        );
        const solution = t(
          steps(
            `Parametrize with $x = t$: $x(t) = t, y(t) = t^2$ for $0 \\le t \\le ${b}$.`,
            `Since $dx = dt$, substitute into the integral:\n\n$$\\int_0^{${b}} ${a}(t^2)\\,dt = ${a} \\left[\\frac{t^3}{3}\\right]_0^{${b}} = \\frac{${num}}{3} = ${ans.toLatex()}.$$ `,
          ),
          steps(
            `以 $x = t$ 参数化：$x(t) = t, y(t) = t^2$（$0 \\le t \\le ${b}$）。`,
            `因 $dx = dt$，代入积分式：\n\n$$\\int_0^{${b}} ${a}(t^2)\\,dt = ${a} \\left[\\frac{t^3}{3}\\right]_0^{${b}} = \\frac{${num}}{3} = ${ans.toLatex()}。$$ `,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [Q.of(num), Q.of(num, 2), ans.neg()],
        });
      },
    },
  ],
};

/** propertiesOfLineIntegralsWithRespectToXAndY covers orientation reversal of coordinate integrals. */
export const propertiesOfLineIntegralsWithRespectToXAndY: TopicDef = {
  id: "properties-of-line-integrals-with-respect-to-x-and-y",
  title: t("Properties of Line Integrals With Respect to X and Y", "对坐标的第二类曲线积分的性质"),
  summary: t(
    "Unlike scalar line integrals, reversing the orientation changes the sign of a line integral with respect to a coordinate: $\\int_{-C} P\\,dx = -\\int_C P\\,dx$.",
    "与标量曲线积分不同，反转方向会使对坐标的曲线积分变号：$\\int_{-C} P\\,dx = -\\int_C P\\,dx$。",
  ),
  prerequisites: ["line-integrals-with-respect-to-x-and-y"],
  encompasses: [{ topic: "line-integrals-with-respect-to-x-and-y", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "orientation-reversal-for-differential-integrals",
      title: t("Orientation reversal for differential integrals", "坐标微分积分在定向反转下的变号法则"),
      explanation: t(
        "Reversing the curve's direction negates coordinate differentials $dx \\to -dx$ and $dy \\to -dy$, so:\n\n$$\\int_{-C} (P\\,dx + Q\\,dy) = -\\int_C (P\\,dx + Q\\,dy).$$",
        "反转曲线遍历方向会导致坐标微分变号 $dx \\to -dx$ 与 $dy \\to -dy$，因此：\n\n$$\\int_{-C} (P\\,dx + Q\\,dy) = -\\int_C (P\\,dx + Q\\,dy)。$$",
      ),
      generate(rng: Rng): Problem {
        const val = rng.nonZero(-35, 35);
        const ans = -val;

        const prompt = t(
          `If $\\int_C (P\\,dx + Q\\,dy) = ${val}$, find the value of $\\int_{-C} (P\\,dx + Q\\,dy)$.`,
          `若 $\\int_C (P\\,dx + Q\\,dy) = ${val}$，求 $\\int_{-C} (P\\,dx + Q\\,dy)$ 的值。`,
        );
        const solution = t(
          steps(
            `Reversing the orientation of the curve reverses the sign of the line integral with respect to coordinates:\n\n$$\\int_{-C} (P\\,dx + Q\\,dy) = -\\int_C (P\\,dx + Q\\,dy) = -(${val}) = ${ans}.$$ `,
          ),
          steps(
            `反转曲线的行进方向会导致对坐标的曲线积分变号：\n\n$$\\int_{-C} (P\\,dx + Q\\,dy) = -\\int_C (P\\,dx + Q\\,dy) = -(${val}) = ${ans}。$$ `,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [val, 0, ans + 1],
        });
      },
    },
  ],
};

/** sumsOfLineIntegralsWithRespectToXAndYOverParametricCurves integrates P dx + Q dy along parametric curves. */
export const sumsOfLineIntegralsWithRespectToXAndYOverParametricCurves: TopicDef = {
  id: "sums-of-line-integrals-with-respect-to-x-and-y-over-parametric-curves",
  title: t("Sums of Line Integrals With Respect to X and Y Over Parametric Curves", "参数曲线上 P dx + Q dy 的曲线积分"),
  summary: t(
    "Along a parametric curve, $\\int_C (P\\,dx + Q\\,dy) = \\int_a^b \\left[P(x, y)\\,x'(t) + Q(x, y)\\,y'(t)\\right] dt$.",
    "沿参数曲线，$\\int_C (P\\,dx + Q\\,dy) = \\int_a^b \\left[P(x, y)\\,x'(t) + Q(x, y)\\,y'(t)\\right] dt$。",
  ),
  prerequisites: ["properties-of-line-integrals-with-respect-to-x-and-y"],
  encompasses: [
    {
      topic: "properties-of-line-integrals-with-respect-to-x-and-y",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-p-dx-plus-q-dy-along-parametric-paths",
      title: t("Evaluating P dx + Q dy along parametric paths", "在参数路径上计算 P dx + Q dy 的曲线积分"),
      explanation: t(
        "Substitute $x = x(t), dx = x'(t)dt$ and $y = y(t), dy = y'(t)dt$:\n\n$$\\int_C (P\\,dx + Q\\,dy) = \\int_a^b \\left[P(x(t), y(t))x'(t) + Q(x(t), y(t))y'(t)\\right]dt.$$",
        "代入 $x = x(t), dx = x'(t)dt$ 与 $y = y(t), dy = y'(t)dt$：\n\n$$\\int_C (P\\,dx + Q\\,dy) = \\int_a^b \\left[P(x(t), y(t))x'(t) + Q(x(t), y(t))y'(t)\\right]dt。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-4, 4);
        const b = rng.nonZero(-4, 4);
        const xEnd = rng.int(1, 4);
        const yEnd = rng.int(1, 4);

        // Path: r(t) = (xEnd * t, yEnd * t), t in [0, 1].
        // dx = xEnd dt, dy = yEnd dt.
        // P = a * y = a * yEnd * t, Q = b * x = b * xEnd * t.
        // P dx + Q dy = (a * yEnd * xEnd * t + b * xEnd * yEnd * t) dt = (a + b) * xEnd * yEnd * t dt.
        // Integral = (a + b) * xEnd * yEnd * [t^2 / 2]_0^1 = (a + b) * xEnd * yEnd / 2.
        const num = (a + b) * xEnd * yEnd;
        const ans = Q.of(num, 2);

        const prompt = t(
          `Evaluate $\\int_C (${poly([a, "y\\,dx"], [b, "x\\,dy"])})$ along the segment from $(0, 0)$ to $(${xEnd}, ${yEnd})$.`,
          `计算曲线积分 $\\int_C (${poly([a, "y\\,dx"], [b, "x\\,dy"])})$，其中 $C$ 为从 $(0, 0)$ 到 $(${xEnd}, ${yEnd})$ 的线段。`,
        );
        const solution = t(
          steps(
            `Parametrize the line segment: $x(t) = ${poly([xEnd, "t"])}, y(t) = ${poly([yEnd, "t"])}$ for $0 \\le t \\le 1$.`,
            `Differentials are $dx = ${xEnd}\\,dt$ and $dy = ${yEnd}\\,dt$.`,
            `Substitute into the integrand:\n\n$$\\int_0^1 \\left[(${a})(${poly([yEnd, "t"])})(${xEnd}) + (${b})(${poly([xEnd, "t"])})(${yEnd})\\right]dt = ${(a + b) * xEnd * yEnd} \\int_0^1 t\\,dt = \\frac{${num}}{2} = ${ans.toLatex()}.$$ `,
          ),
          steps(
            `参数化线段：$x(t) = ${poly([xEnd, "t"])}, y(t) = ${poly([yEnd, "t"])}$（$0 \\le t \\le 1$）。`,
            `微分元为 $dx = ${xEnd}\\,dt$ 与 $dy = ${yEnd}\\,dt$。`,
            `代入被积式：\n\n$$\\int_0^1 \\left[(${a})(${poly([yEnd, "t"])})(${xEnd}) + (${b})(${poly([xEnd, "t"])})(${yEnd})\\right]dt = ${(a + b) * xEnd * yEnd} \\int_0^1 t\\,dt = \\frac{${num}}{2} = ${ans.toLatex()}。$$ `,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [Q.of(num), ans.neg(), ans.mul(Q.of(2))],
        });
      },
    },
  ],
};

/** sumsOfLineIntegralsWithRespectToXAndY integrates general differential forms. */
export const sumsOfLineIntegralsWithRespectToXAndY: TopicDef = {
  id: "sums-of-line-integrals-with-respect-to-x-and-y",
  title: t("Sums of Line Integrals With Respect to X and Y", "一般的 P dx + Q dy 曲线积分"),
  summary: t(
    "The sum $\\int_C P\\,dx + Q\\,dy$ measures the circulation, or tangential effect, of a plane force field along a curve.",
    "曲线积分 $\\int_C P\\,dx + Q\\,dy$ 度量平面力场沿曲线的环量，即切向作用。",
  ),
  prerequisites: ["sums-of-line-integrals-with-respect-to-x-and-y-over-parametric-curves"],
  encompasses: [
    {
      topic: "sums-of-line-integrals-with-respect-to-x-and-y-over-parametric-curves",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "integrating-differential-forms-along-line-segments",
      title: t("Integrating differential forms along line segments", "在线段上积分微分形式"),
      explanation: t(
        "Along horizontal segments $y = c$, $dy = 0$, so $\\int_C (P\\,dx + Q\\,dy) = \\int P(x, c)\\,dx$. Along vertical segments $x = c$, $dx = 0$, so $\\int_C (P\\,dx + Q\\,dy) = \\int Q(c, y)\\,dy$.",
        "在水平线段 $y = c$ 上，$dy = 0$，故 $\\int_C (P\\,dx + Q\\,dy) = \\int P(x, c)\\,dx$。在垂直线段 $x = c$ 上，$dx = 0$，故 $\\int_C (P\\,dx + Q\\,dy) = \\int Q(c, y)\\,dy$。",
      ),
      generate(rng: Rng): Problem {
        const x1 = rng.int(0, 3);
        const x2 = x1 + rng.int(1, 5);
        const y0 = rng.int(1, 5);
        const a = rng.nonZero(-3, 3);

        // Path: horizontal segment y = y0 from x1 to x2.
        // P(x, y) = a * x, Q = 0.
        // int_C a x dx = a [x^2 / 2]_{x1}^{x2} = a * (x2^2 - x1^2) / 2.
        const num = a * (x2 * x2 - x1 * x1);
        const ans = Q.of(num, 2);

        const prompt = t(
          `Evaluate $\\int_C ${poly([a, "x"])}\\,dx$ along the horizontal line segment $C$ from $(${x1}, ${y0})$ to $(${x2}, ${y0})$.`,
          `计算 $\\int_C ${poly([a, "x"])}\\,dx$ 的值，其中 $C$ 为从 $(${x1}, ${y0})$ 到 $(${x2}, ${y0})$ 的水平线段。`,
        );
        const solution = t(
          steps(
            `Along the horizontal segment $y = ${y0}$, $y$ is constant and $x$ varies from $${x1}$ to $${x2}$.`,
            `Integrate directly: $\\int_{${x1}}^{${x2}} ${poly([a, "x"])}\\,dx = ${a === 1 ? "" : a === -1 ? "-" : a} \\left[\\frac{x^2}{2}\\right]_{${x1}}^{${x2}} = ${a === 1 ? "" : a === -1 ? "-" : a} \\frac{${x2 * x2} - ${x1 * x1}}{2} = \\frac{${num}}{2}${num % 2 === 1 ? "" : ` = ${ans.toLatex()}`}$.`,
          ),
          steps(
            `在水平线段 $y = ${y0}$ 上，$y$ 为常数，$x$ 从 $${x1}$ 变到 $${x2}$。`,
            `直接积分：$\\int_{${x1}}^{${x2}} ${poly([a, "x"])}\\,dx = ${a === 1 ? "" : a === -1 ? "-" : a} \\left[\\frac{x^2}{2}\\right]_{${x1}}^{${x2}} = ${a === 1 ? "" : a === -1 ? "-" : a} \\frac{${x2 * x2} - ${x1 * x1}}{2} = \\frac{${num}}{2}${num % 2 === 1 ? "" : ` = ${ans.toLatex()}`}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [Q.of(num), ans.neg(), ans.mul(Q.of(2))],
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 4.21 Line Integrals of Vector-Valued Functions
// ---------------------------------------------------------------------------

/** lineIntegralsOfVectorValuedFunctionsOverParametricCurves computes work integrals ∫ F · dr. */
export const lineIntegralsOfVectorValuedFunctionsOverParametricCurves: TopicDef = {
  id: "line-integrals-of-vector-valued-functions-over-parametric-curves",
  title: t("Line Integrals of Vector-Valued Functions Over Parametric Curves", "参数曲线上的向量线积分"),
  summary: t(
    "The line integral of a vector field $\\mathbf{F}$ along a curve $\\mathbf{r}(t)$ is $\\int_a^b \\mathbf{F}(\\mathbf{r}(t)) \\cdot \\mathbf{r}'(t)\\,dt$.",
    "向量场 $\\mathbf{F}$ 沿参数曲线 $\\mathbf{r}(t)$ 的线积分为 $\\int_a^b \\mathbf{F}(\\mathbf{r}(t)) \\cdot \\mathbf{r}'(t)\\,dt$。",
  ),
  prerequisites: ["vector-fields", "sums-of-line-integrals-with-respect-to-x-and-y"],
  encompasses: [
    { topic: "vector-fields", weight: 0.3 },
    {
      topic: "sums-of-line-integrals-with-respect-to-x-and-y",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "vector-line-integral-as-dot-product-with-velocity",
      title: t("Vector line integral as dot product with velocity", "向量场与速度向量的点积线积分"),
      explanation: t(
        "To evaluate $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$, compute the velocity $\\mathbf{r}'(t)$, evaluate $\\mathbf{F}(\\mathbf{r}(t))$, and integrate the scalar product:\n\n$$\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_a^b \\left[\\mathbf{F}(\\mathbf{r}(t)) \\cdot \\mathbf{r}'(t)\\right]dt.$$",
        "计算 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ 时，先求速度向量 $\\mathbf{r}'(t)$，代入 $\\mathbf{F}(\\mathbf{r}(t))$ 并对两者的点积求定积分：\n\n$$\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_a^b \\left[\\mathbf{F}(\\mathbf{r}(t)) \\cdot \\mathbf{r}'(t)\\right]dt。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const T = rng.int(1, 4);

        // Path: r(t) = (t, t^2) for 0 <= t <= T.
        // r'(t) = (1, 2t).
        // F(x, y) = (a * y, b * x) = (a * t^2, b * t).
        // F · r' = a * t^2 * 1 + b * t * (2t) = (a + 2b) * t^2.
        // Integral = (a + 2b) * T^3 / 3.
        const num = (a + 2 * b) * T * T * T;
        const ans = Q.of(num, 3);

        const prompt = t(
          `Evaluate $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ for $\\mathbf{F}(x, y) = \\langle ${poly([a, "y"])}, ${poly([b, "x"])} \\rangle$ along the parabola $\\mathbf{r}(t) = \\langle t, t^2 \\rangle$ for $0 \\le t \\le ${T}$.`,
          `计算向量线积分 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$，其中 $\\mathbf{F}(x, y) = \\langle ${poly([a, "y"])}, ${poly([b, "x"])} \\rangle$，曲线为抛物线 $\\mathbf{r}(t) = \\langle t, t^2 \\rangle$（$0 \\le t \\le ${T}$）。`,
        );
        const solution = t(
          steps(
            `Find velocity: $\\mathbf{r}'(t) = \\langle 1, 2t \\rangle$.`,
            `Evaluate field along curve: $\\mathbf{F}(\\mathbf{r}(t)) = \\langle ${poly([a, "t^2"])}, ${poly([b, "t"])} \\rangle$.`,
            `Compute dot product: $\\mathbf{F} \\cdot \\mathbf{r}'(t) = (${poly([a, "t^2"])})(1) + (${poly([b, "t"])})(2t) = ${poly([a + 2 * b, "t^2"])}$.`,
            `Integrate: $\\int_0^{${T}} ${poly([a + 2 * b, "t^2"])}\\,dt = ${a + 2 * b} \\left[\\frac{t^3}{3}\\right]_0^{${T}} = \\frac{${num}}{3} = ${ans.toLatex()}$.`,
          ),
          steps(
            `求速度向量：$\\mathbf{r}'(t) = \\langle 1, 2t \\rangle$。`,
            `将曲线代入向量场：$\\mathbf{F}(\\mathbf{r}(t)) = \\langle ${poly([a, "t^2"])}, ${poly([b, "t"])} \\rangle$。`,
            `计算点积：$\\mathbf{F} \\cdot \\mathbf{r}'(t) = (${poly([a, "t^2"])})(1) + (${poly([b, "t"])})(2t) = ${poly([a + 2 * b, "t^2"])}$。`,
            `定积分求值：$\\int_0^{${T}} ${poly([a + 2 * b, "t^2"])}\\,dt = ${a + 2 * b} \\left[\\frac{t^3}{3}\\right]_0^{${T}} = \\frac{${num}}{3} = ${ans.toLatex()}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [Q.of(num), ans.neg(), ans.mul(Q.of(2))],
        });
      },
    },
  ],
};

/** lineIntegralsOfVectorValuedFunctionsOverGeneralCurves integrates over curves like line segments and parabolas. */
export const lineIntegralsOfVectorValuedFunctionsOverGeneralCurves: TopicDef = {
  id: "line-integrals-of-vector-valued-functions-over-general-curves",
  title: t("Line Integrals of Vector-Valued Functions Over General Curves", "一般曲线上的第二类向量线积分"),
  summary: t(
    "Vector line integrals over explicit Cartesian curves y = g(x) use parametrization r(x) = ⟨x, g(x)⟩ with dr = ⟨1, g'(x)⟩ dx.",
    "显式平面曲线 y = g(x) 上的向量线积分采用标准参数化 r(x) = ⟨x, g(x)⟩ 与 dr = ⟨1, g'(x)⟩ dx 进行计算。",
  ),
  prerequisites: ["line-integrals-of-vector-valued-functions-over-parametric-curves"],
  encompasses: [
    {
      topic: "line-integrals-of-vector-valued-functions-over-parametric-curves",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-vector-line-integrals-over-parabolic-paths",
      title: t("Evaluating vector line integrals over parabolic paths", "在抛物线路径上计算向量线积分"),
      explanation: t(
        "Along $y = cx^2$ from $x = 0$ to $x = a$, with $\\mathbf{F} = \\langle y, x \\rangle$:\n\n$$\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_0^a \\left[cx^2(1) + x(2cx)\\right]dx = \\int_0^a 3cx^2\\,dx = ca^3.$$",
        "沿抛物线 $y = cx^2$ 从 $x = 0$ 到 $x = a$，对于 $\\mathbf{F} = \\langle y, x \\rangle$：\n\n$$\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_0^a \\left[cx^2(1) + x(2cx)\\right]dx = \\int_0^a 3cx^2\\,dx = ca^3。$$",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(1, 6);
        const a = rng.int(1, 6);
        const ans = c * a * a * a;

        const prompt = t(
          `Evaluate the line integral $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ for $\\mathbf{F}(x, y) = \\langle y, x \\rangle$ along the parabola $y = ${poly([c, "x^2"])}$ from $(0, 0)$ to $(${a}, ${c * a * a})$.`,
          `计算向量线积分 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$，其中 $\\mathbf{F}(x, y) = \\langle y, x \\rangle$，路径 $C$ 为抛物线 $y = ${poly([c, "x^2"])}$ 从 $(0, 0)$ 到 $(${a}, ${c * a * a})$。`,
        );
        const solution = t(
          steps(
            `Parametrize with $x$: $\\mathbf{r}(x) = \\langle x, ${poly([c, "x^2"])} \\rangle$, so $d\\mathbf{r} = \\langle 1, ${poly([2 * c, "x"])} \\rangle dx$.`,
            `Compute the dot product: $\\mathbf{F} \\cdot d\\mathbf{r} = (${poly([c, "x^2"])})(1) + (x)(${poly([2 * c, "x"])}) = ${poly([3 * c, "x^2"])}$.`,
            `Integrate: $\\int_0^{${a}} ${poly([3 * c, "x^2"])}\\,dx = ${c}[x^3]_0^{${a}} = ${c}(${a}^3) = ${ans}$.`,
          ),
          steps(
            `以 $x$ 为参数：$\\mathbf{r}(x) = \\langle x, ${poly([c, "x^2"])} \\rangle$，故 $d\\mathbf{r} = \\langle 1, ${poly([2 * c, "x"])} \\rangle dx$。`,
            `计算点积：$\\mathbf{F} \\cdot d\\mathbf{r} = (${poly([c, "x^2"])})(1) + (x)(${poly([2 * c, "x"])}) = ${poly([3 * c, "x^2"])}$。`,
            `积分求值：$\\int_0^{${a}} ${poly([3 * c, "x^2"])}\\,dx = ${c}[x^3]_0^{${a}} = ${c}(${a}^3) = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [2 * ans, ans - c, ans + c],
        });
      },
    },
  ],
};

/** interpretingLineIntegralsOfVectorValuedFunctions relates line integrals to circulation and work. */
export const interpretingLineIntegralsOfVectorValuedFunctions: TopicDef = {
  id: "interpreting-line-integrals-of-vector-valued-functions",
  title: t("Interpreting Line Integrals of Vector-Valued Functions", "向量线积分的几何与物理意义"),
  summary: t(
    "The line integral $\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_C (\\mathbf{F} \\cdot \\mathbf{T})\\,ds$ accumulates the tangential component of $\\mathbf{F}$ along $C$ (circulation or work).",
    "线积分 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_C (\\mathbf{F} \\cdot \\mathbf{T})\\,ds$ 累积 $\\mathbf{F}$ 沿 $C$ 的切向分量（环量或功）。",
  ),
  prerequisites: ["line-integrals-of-vector-valued-functions-over-general-curves"],
  encompasses: [
    {
      topic: "line-integrals-of-vector-valued-functions-over-general-curves",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "circulation-and-tangential-component-interpretation",
      title: t("Circulation and tangential component interpretation", "切向分量与环量的几何解释"),
      explanation: t(
        "Because $d\\mathbf{r} = \\mathbf{T}\\,ds$, the vector line integral equates to the scalar line integral of the tangential component:\n\n$$\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_C (\\mathbf{F} \\cdot \\mathbf{T})\\,ds.$$",
        "因为 $d\\mathbf{r} = \\mathbf{T}\\,ds$，向量线积分等同于切向分量对弧长的标量积分：\n\n$$\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_C (\\mathbf{F} \\cdot \\mathbf{T})\\,ds。$$",
      ),
      generate(rng: Rng): Problem {
        const val = rng.int(2, 8);
        const L = rng.int(3, 10);
        const ans = val * L;

        const prompt = t(
          `A vector field $\\mathbf{F}$ has a constant tangential component $\\mathbf{F} \\cdot \\mathbf{T} = ${val}$ along a curve $C$ of total arc length $L = ${L}$. Find $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$.`,
          `已知向量场 $\\mathbf{F}$ 沿总弧长为 $L = ${L}$ 的曲线 $C$ 具有恒定的切向分量 $\\mathbf{F} \\cdot \\mathbf{T} = ${val}$。求线积分 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ 的值。`,
        );
        const solution = t(
          steps(
            `Relate to the tangential component: $\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_C (\\mathbf{F} \\cdot \\mathbf{T})\\,ds$.`,
            `Since $\\mathbf{F} \\cdot \\mathbf{T} = ${val}$ is constant: $\\int_C ${val}\\,ds = ${val} \\int_C 1\\,ds = ${val} \\times ${L} = ${ans}$.`,
          ),
          steps(
            `利用切向分量转化公式：$\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_C (\\mathbf{F} \\cdot \\mathbf{T})\\,ds$。`,
            `由于切向分量 $\\mathbf{F} \\cdot \\mathbf{T} = ${val}$ 为常数：$\\int_C ${val}\\,ds = ${val} \\int_C 1\\,ds = ${val} \\times ${L} = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [val + L, ans * 2, ans - L],
        });
      },
    },
  ],
};

/** propertiesOfLineIntegralsOfVectorValuedFunctions covers linearity and sign flip on orientation reversal. */
export const propertiesOfLineIntegralsOfVectorValuedFunctions: TopicDef = {
  id: "properties-of-line-integrals-of-vector-valued-functions",
  title: t("Properties of Line Integrals of Vector-Valued Functions", "向量线积分的代数与几何性质"),
  summary: t(
    "Vector line integrals satisfy $\\int_{-C} \\mathbf{F} \\cdot d\\mathbf{r} = -\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$, are linear in the field, and add over joined paths.",
    "向量线积分满足 $\\int_{-C} \\mathbf{F} \\cdot d\\mathbf{r} = -\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$，对向量场是线性的，并对相接的路径可加。",
  ),
  prerequisites: ["interpreting-line-integrals-of-vector-valued-functions"],
  encompasses: [
    {
      topic: "interpreting-line-integrals-of-vector-valued-functions",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "orientation-reversal-of-vector-line-integrals",
      title: t("Orientation reversal of vector line integrals", "向量线积分在反向遍历下的变号法则"),
      explanation: t(
        "Reversing the direction of traversal negates the tangent displacement vector $d\\mathbf{r}$, hence:\n\n$$\\int_{-C} \\mathbf{F} \\cdot d\\mathbf{r} = -\\int_C \\mathbf{F} \\cdot d\\mathbf{r}.$$",
        "反转遍历方向会导致切向微元向量变号 $d\\mathbf{r} \\to -d\\mathbf{r}$，因此：\n\n$$\\int_{-C} \\mathbf{F} \\cdot d\\mathbf{r} = -\\int_C \\mathbf{F} \\cdot d\\mathbf{r}。$$",
      ),
      generate(rng: Rng): Problem {
        const val = rng.nonZero(-30, 30);
        const ans = -val;

        const prompt = t(
          `Given that $\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = ${val}$, determine the value of $\\int_{-C} \\mathbf{F} \\cdot d\\mathbf{r}$, where $-C$ is the same curve traversed in reverse.`,
          `已知 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = ${val}$，求 $\\int_{-C} \\mathbf{F} \\cdot d\\mathbf{r}$ 的值，其中 $-C$ 为反向遍历的同一曲线。`,
        );
        const solution = t(
          steps(
            `Reversing the orientation of the curve negates the tangent vector element $d\\mathbf{r}$:`,
            `$$\\int_{-C} \\mathbf{F} \\cdot d\\mathbf{r} = -\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = -(${val}) = ${ans}.$$ `,
          ),
          steps(
            `反向遍历曲线使切向位移微元 $d\\mathbf{r}$ 变号：`,
            `$$\\int_{-C} \\mathbf{F} \\cdot d\\mathbf{r} = -\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = -(${val}) = ${ans}。$$ `,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [val, 0, ans + 2],
        });
      },
    },
  ],
};

/** workDoneByAForceField calculates work done by a force field along a trajectory. */
export const workDoneByAForceField: TopicDef = {
  id: "work-done-by-a-force-field",
  title: t("Work Done by a Force Field", "力场做功的计算"),
  summary: t(
    "The work done by a force field $\\mathbf{F}$ moving a particle along a curve $C$ is $W = \\int_C \\mathbf{F} \\cdot d\\mathbf{r}$.",
    "力场 $\\mathbf{F}$ 推动质点沿曲线 $C$ 运动所做的功为 $W = \\int_C \\mathbf{F} \\cdot d\\mathbf{r}$。",
  ),
  prerequisites: ["properties-of-line-integrals-of-vector-valued-functions"],
  encompasses: [
    {
      topic: "properties-of-line-integrals-of-vector-valued-functions",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "calculating-work-done-along-paths",
      title: t("Calculating work done along paths", "计算质点沿路径所做的功"),
      explanation: t(
        "Work is the vector line integral of force over displacement: $W = \\int_C \\mathbf{F} \\cdot d\\mathbf{r}$. For a constant force $\\mathbf{F} = \\langle F_x, F_y \\rangle$ acting over displacement $\\Delta \\mathbf{r} = \\langle \\Delta x, \\Delta y \\rangle$, $W = \\mathbf{F} \\cdot \\Delta \\mathbf{r}$.",
        "功是力场沿位移路径的向量线积分：$W = \\int_C \\mathbf{F} \\cdot d\\mathbf{r}$。恒力 $\\mathbf{F} = \\langle F_x, F_y \\rangle$ 沿直线位移 $\\Delta \\mathbf{r} = \\langle \\Delta x, \\Delta y \\rangle$ 做功为 $W = \\mathbf{F} \\cdot \\Delta \\mathbf{r}$。",
      ),
      generate(rng: Rng): Problem {
        const fx = rng.nonZero(-6, 6);
        const fy = rng.nonZero(-6, 6);
        const x1 = rng.int(-4, 4);
        const y1 = rng.int(-4, 4);
        const dx = rng.nonZero(-5, 5);
        const dy = rng.nonZero(-5, 5);
        const x2 = x1 + dx;
        const y2 = y1 + dy;

        const ans = fx * dx + fy * dy;

        const prompt = t(
          `Find the work done by the constant force field $\\mathbf{F} = \\langle ${fx}, ${fy} \\rangle$ on a particle moving along the line segment from $(${x1}, ${y1})$ to $(${x2}, ${y2})$.`,
          `求恒力场 $\\mathbf{F} = \\langle ${fx}, ${fy} \\rangle$ 将质点沿直线段从 $(${x1}, ${y1})$ 移动到 $(${x2}, ${y2})$ 所做的功。`,
        );
        const solution = t(
          steps(
            `The displacement vector is $\\Delta \\mathbf{r} = \\langle ${x2} - (${x1}), ${y2} - (${y1}) \\rangle = \\langle ${dx}, ${dy} \\rangle$.`,
            `Since the force is constant, $W = \\mathbf{F} \\cdot \\Delta \\mathbf{r} = \\langle ${fx}, ${fy} \\rangle \\cdot \\langle ${dx}, ${dy} \\rangle$.`,
            `Compute the dot product: $(${fx})(${dx}) + (${fy})(${dy}) = ${fx * dx} + (${fy * dy}) = ${ans}$.`,
          ),
          steps(
            `位移向量为 $\\Delta \\mathbf{r} = \\langle ${x2} - (${x1}), ${y2} - (${y1}) \\rangle = \\langle ${dx}, ${dy} \\rangle$。`,
            `由于力为恒力，$W = \\mathbf{F} \\cdot \\Delta \\mathbf{r} = \\langle ${fx}, ${fy} \\rangle \\cdot \\langle ${dx}, ${dy} \\rangle$。`,
            `计算点积：$(${fx})(${dx}) + (${fy})(${dy}) = ${fx * dx} + (${fy * dy}) = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [fx * dy + fy * dx, -ans, ans + 4],
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 4.22 The Fundamental Theorem of Line Integrals
// ---------------------------------------------------------------------------

/** theFundamentalTheoremOfLineIntegrals evaluates line integrals of gradient fields. */
export const theFundamentalTheoremOfLineIntegrals: TopicDef = {
  id: "the-fundamental-theorem-of-line-integrals",
  title: t("The Fundamental Theorem of Line Integrals", "曲线积分基本定理"),
  summary: t(
    "If $\\mathbf{F} = \\nabla f$ is conservative, then $\\int_C \\nabla f \\cdot d\\mathbf{r} = f(\\mathbf{r}(b)) - f(\\mathbf{r}(a))$, which depends only on the endpoints of $C$.",
    "若 $\\mathbf{F} = \\nabla f$ 为保守场，则 $\\int_C \\nabla f \\cdot d\\mathbf{r} = f(\\mathbf{r}(b)) - f(\\mathbf{r}(a))$，只取决于 $C$ 的端点。",
  ),
  prerequisites: ["gradient-vector-fields", "line-integrals-of-vector-valued-functions-over-parametric-curves"],
  encompasses: [
    { topic: "gradient-vector-fields", weight: 0.3 },
    {
      topic: "line-integrals-of-vector-valued-functions-over-parametric-curves",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-gradient-line-integrals-by-potential-endpoints",
      title: t("Evaluating gradient line integrals by potential endpoints", "通过势函数端点差计算梯度线积分"),
      explanation: t(
        "By the Fundamental Theorem of Line Integrals, if $\\mathbf{F} = \\nabla f$, then:\n\n$$\\int_C \\nabla f \\cdot d\\mathbf{r} = f(B) - f(A),$$ where $A$ and $B$ are the initial and terminal points of $C$.",
        "由曲线积分基本定理，若 $\\mathbf{F} = \\nabla f$，则：\n\n$$\\int_C \\nabla f \\cdot d\\mathbf{r} = f(B) - f(A)，$$ 其中 $A$ 与 $B$ 为曲线 $C$ 的起点与终点。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const x1 = rng.int(-2, 2);
        const y1 = rng.int(-2, 2);
        const x2 = rng.int(-2, 2);
        const y2 = rng.int(-2, 2);

        // f(x, y) = a * x^2 + b * y^2
        const fA = a * x1 * x1 + b * y1 * y1;
        const fB = a * x2 * x2 + b * y2 * y2;
        const ans = fB - fA;

        const prompt = t(
          `Find $\\int_C \\nabla f \\cdot d\\mathbf{r}$ for $f(x, y) = ${poly([a, "x^2"], [b, "y^2"])}$ along any smooth curve $C$ starting at $A(${x1}, ${y1})$ and ending at $B(${x2}, ${y2})$.`,
          `求势函数 $f(x, y) = ${poly([a, "x^2"], [b, "y^2"])}$ 的梯度场沿任意以 $A(${x1}, ${y1})$ 为起点、$B(${x2}, ${y2})$ 为终点的光滑曲线 $C$ 的积分 $\\int_C \\nabla f \\cdot d\\mathbf{r}$。`,
        );
        const solution = t(
          steps(
            `By the Fundamental Theorem of Line Integrals, $\\int_C \\nabla f \\cdot d\\mathbf{r} = f(B) - f(A)$.`,
            `Evaluate at endpoint $B$: $f(${x2}, ${y2}) = ${a}(${x2})^2 + ${paren(b)}(${y2})^2 = ${fB}$.`,
            `Evaluate at starting point $A$: $f(${x1}, ${y1}) = ${a}(${x1})^2 + ${paren(b)}(${y1})^2 = ${fA}$.`,
            `Compute the difference: $f(B) - f(A) = ${fB} - (${fA}) = ${ans}$.`,
          ),
          steps(
            `由曲线积分基本定理，$\\int_C \\nabla f \\cdot d\\mathbf{r} = f(B) - f(A)$。`,
            `终点 $B$ 处的函数值：$f(${x2}, ${y2}) = ${a}(${x2})^2 + ${paren(b)}(${y2})^2 = ${fB}$。`,
            `起点 $A$ 处的函数值：$f(${x1}, ${y1}) = ${a}(${x1})^2 + ${paren(b)}(${y1})^2 = ${fA}$。`,
            `两值相减：$f(B) - f(A) = ${fB} - (${fA}) = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [fA - fB, fB + fA, ans + 2],
        });
      },
    },
  ],
};

/** pathIndependenceOfLineIntegrals characterizes conservative vector fields. */
export const pathIndependenceOfLineIntegrals: TopicDef = {
  id: "path-independence-of-line-integrals",
  title: t("Path Independence of Line Integrals", "曲线积分的路径无关性"),
  summary: t(
    "On a connected domain $D$, the line integral $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ is independent of path if and only if $\\mathbf{F} = \\nabla f$ is a gradient field on $D$.",
    "在连通区域 $D$ 上，线积分 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ 与路径无关，当且仅当 $\\mathbf{F} = \\nabla f$ 是 $D$ 上的梯度场。",
  ),
  prerequisites: ["the-fundamental-theorem-of-line-integrals"],
  encompasses: [{ topic: "the-fundamental-theorem-of-line-integrals", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "equivalence-of-path-independence-and-conservative-fields",
      title: t("Equivalence of path independence and conservative fields", "路径无关性与保守场的等价性"),
      explanation: t(
        "On an open connected region $D$, the following statements are logically equivalent:\n1. $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ is path independent.\n2. $\\oint_C \\mathbf{F} \\cdot d\\mathbf{r} = 0$ for every closed loop.\n3. $\\mathbf{F} = \\nabla f$ for some potential function $f$.",
        "在开连通区域 $D$ 上，下列命题等价：\n1. 曲线积分 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ 与路径无关。\n2. 沿任意闭曲线的环量 $\\oint_C \\mathbf{F} \\cdot d\\mathbf{r} = 0$。\n3. 存在标量势函数 $f$ 使得 $\\mathbf{F} = \\nabla f$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 8);
        const b = rng.int(2, 8);
        const x1 = rng.int(0, 3);
        const y1 = rng.int(0, 3);
        const x2 = rng.int(1, 5);
        const y2 = rng.int(1, 5);
        const fA = a * x1 * x1 + b * y1 * y1;
        const fB = a * x2 * x2 + b * y2 * y2;
        const ans = fB - fA;

        const prompt = t(
          `Since $\\mathbf{F} = \\nabla (${poly([a, "x^2"], [b, "y^2"])})$ is conservative, the line integral $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ is path independent. Evaluate $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ along any path starting at $A(${x1}, ${y1})$ and ending at $B(${x2}, ${y2})$.`,
          `已知 $\\mathbf{F} = \\nabla (${poly([a, "x^2"], [b, "y^2"])})$ 为保守场，曲线积分 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ 具有路径无关性。求沿任意起点为 $A(${x1}, ${y1})$、终点为 $B(${x2}, ${y2})$ 的路径积分 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ 的值。`,
        );
        const solution = t(
          steps(
            `Because $\\mathbf{F} = \\nabla f$ with $f(x, y) = ${a}x^2 + ${b}y^2$, path independence allows evaluating $\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = f(B) - f(A)$.`,
            `Evaluate $f$ at the terminal point $B(${x2}, ${y2})$: $f(${x2}, ${y2}) = ${a}(${x2})^2 + ${paren(b)}(${y2})^2 = ${fB}$.`,
            `Evaluate $f$ at the initial point $A(${x1}, ${y1})$: $f(${x1}, ${y1}) = ${a}(${x1})^2 + ${paren(b)}(${y1})^2 = ${fA}$.`,
            `Subtract: $f(B) - f(A) = ${fB} - ${fA} = ${ans}$.`,
          ),
          steps(
            `由于 $\\mathbf{F} = \\nabla f$（其中 $f(x, y) = ${a}x^2 + ${b}y^2$），由路径无关性可知 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = f(B) - f(A)$。`,
            `计算终点 $B(${x2}, ${y2})$ 处的势函数值：$f(${x2}, ${y2}) = ${a}(${x2})^2 + ${paren(b)}(${y2})^2 = ${fB}$。`,
            `计算起点 $A(${x1}, ${y1})$ 处的势函数值：$f(${x1}, ${y1}) = ${a}(${x1})^2 + ${paren(b)}(${y1})^2 = ${fA}$。`,
            `相减得：$f(B) - f(A) = ${fB} - ${fA} = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [fA - fB, fB + fA, ans + 2],
        });
      },
    },
  ],
};

/** conservativeVectorFieldsAndClosedPaths establishes vanishing circulation around closed loops. */
export const conservativeVectorFieldsAndClosedPaths: TopicDef = {
  id: "conservative-vector-fields-and-closed-paths",
  title: t("Conservative Vector Fields and Closed Paths", "保守向量场与闭路径环量"),
  summary: t(
    "The circulation of a conservative vector field around every closed curve $C$ is zero: $\\oint_C \\mathbf{F} \\cdot d\\mathbf{r} = 0$.",
    "保守向量场沿任意闭曲线 $C$ 的环量为零：$\\oint_C \\mathbf{F} \\cdot d\\mathbf{r} = 0$。",
  ),
  prerequisites: ["path-independence-of-line-integrals"],
  encompasses: [{ topic: "path-independence-of-line-integrals", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "vanishing-of-circulation-in-conservative-fields",
      title: t("Vanishing of circulation in conservative fields", "保守场沿闭路径环量的消失性"),
      explanation: t(
        "For any closed path $C$, the starting point $A$ and ending point $B$ coincide ($B = A$). By the Fundamental Theorem:\n\n$$\\oint_C \\nabla f \\cdot d\\mathbf{r} = f(A) - f(A) = 0.$$",
        "对于任意闭路径 $C$，起点 $A$ 与终点 $B$ 重合（$B = A$）。由基本定理：\n\n$$\\oint_C \\nabla f \\cdot d\\mathbf{r} = f(A) - f(A) = 0。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-5, 5);
        const b = rng.nonZero(-5, 5);
        const R = rng.int(2, 10);
        const ans = 0;

        const prompt = t(
          `Evaluate the closed line integral $\\oint_C \\nabla f \\cdot d\\mathbf{r}$ for $f(x, y) = ${poly([a, "x^3"], [b, "y^3"])}$ around the circle $C: x^2 + y^2 = ${R * R}$ traversed counterclockwise.`,
          `计算闭曲线积分 $\\oint_C \\nabla f \\cdot d\\mathbf{r}$ 的值，其中 $f(x, y) = ${poly([a, "x^3"], [b, "y^3"])}$，曲线 $C$ 为沿逆时针方向遍历的圆周 $x^2 + y^2 = ${R * R}$。`,
        );
        const solution = t(
          steps(
            `Because $\\mathbf{F} = \\nabla f$ is a gradient field and $C$ is a closed curve, the initial point and terminal point coincide.`,
            `By the Fundamental Theorem of Line Integrals, $\\oint_C \\nabla f \\cdot d\\mathbf{r} = f(A) - f(A) = 0$.`,
          ),
          steps(
            `因为 $\\mathbf{F} = \\nabla f$ 是梯度场且 $C$ 是闭合曲线，其起点与终点重合。`,
            `由曲线积分基本定理，$\\oint_C \\nabla f \\cdot d\\mathbf{r} = f(A) - f(A) = 0$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [a * R * R, 2 * a * R, b * R],
        });
      },
    },
  ],
};

/** calculatingPotentialFunctionsForLineIntegrals reconstructs f from F = ⟨P, Q⟩. */
export const calculatingPotentialFunctionsForLineIntegrals: TopicDef = {
  id: "calculating-potential-functions-for-line-integrals",
  title: t("Calculating Potential Functions for Line Integrals", "求用于计算曲线积分的势函数"),
  summary: t(
    "To integrate a conservative field, determine the potential function f by partial integration and evaluate f(end) - f(start).",
    "对于保守向量场，先通过逐次偏积分确定势函数 f，再通过计算 f(终点) - f(起点) 快速求出曲线积分值。",
  ),
  prerequisites: ["conservative-vector-fields-in-the-cartesian-plane", "the-fundamental-theorem-of-line-integrals"],
  encompasses: [
    {
      topic: "conservative-vector-fields-in-the-cartesian-plane",
      weight: 0.3,
    },
    { topic: "the-fundamental-theorem-of-line-integrals", weight: 0.3 },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "recovering-potential-function-from-gradient-components",
      title: t("Recovering potential function from gradient components", "从梯度分量还原势函数并求积分"),
      explanation: t(
        "For $\\mathbf{F} = \\langle 2ax + by, bx + 2cy \\rangle$, the potential function is $f(x, y) = ax^2 + bxy + cy^2$. The line integral from $(0, 0)$ to $(x_0, y_0)$ is $f(x_0, y_0) - f(0, 0) = ax_0^2 + bx_0 y_0 + cy_0^2$.",
        "对于 $\\mathbf{F} = \\langle 2ax + by, bx + 2cy \\rangle$，其势函数为 $f(x, y) = ax^2 + bxy + cy^2$。从 $(0, 0)$ 到 $(x_0, y_0)$ 的线积分为 $f(x_0, y_0) - f(0, 0) = ax_0^2 + bx_0 y_0 + cy_0^2$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const c = rng.nonZero(-3, 3);
        const x0 = rng.int(1, 4);
        const y0 = rng.int(1, 4);

        const P_desc = poly([2 * a, "x"], [b, "y"]);
        const Q_desc = poly([b, "x"], [2 * c, "y"]);
        const ans = a * x0 * x0 + b * x0 * y0 + c * y0 * y0;

        const prompt = t(
          `Find a potential function for $\\mathbf{F}(x, y) = \\langle ${P_desc}, ${Q_desc} \\rangle$ and evaluate $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ along any path from $(0, 0)$ to $(${x0}, ${y0})$.`,
          `为向量场 $\\mathbf{F}(x, y) = \\langle ${P_desc}, ${Q_desc} \\rangle$ 求势函数，并计算沿从 $(0, 0)$ 到 $(${x0}, ${y0})$ 任意路径的曲线积分 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$。`,
        );
        const solution = t(
          steps(
            `Integrate $P$ with respect to $x$: $f(x, y) = \\int (${P_desc})dx = ${poly([a, "x^2"], [b, "xy"])} + g(y)$.`,
            `Differentiate with respect to $y$: $f_y = ${poly([b, "x"])} + g'(y) = ${Q_desc} \\implies g'(y) = ${poly([2 * c, "y"])} \\implies g(y) = ${poly([c, "y^2"])}$.`,
            `The potential is $f(x, y) = ${poly([a, "x^2"], [b, "xy"], [c, "y^2"])}$ (up to a constant).`,
            `Apply the Fundamental Theorem: $\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = f(${x0}, ${y0}) - f(0, 0) = ${a}(${x0})^2 + ${paren(b)}(${x0})(${y0}) + ${paren(c)}(${y0})^2 = ${ans}$.`,
          ),
          steps(
            `对 $x$ 偏积分：$f(x, y) = \\int (${P_desc})dx = ${poly([a, "x^2"], [b, "xy"])} + g(y)$。`,
            `对 $y$ 求偏导：$f_y = ${poly([b, "x"])} + g'(y) = ${Q_desc} \\implies g'(y) = ${poly([2 * c, "y"])} \\implies g(y) = ${poly([c, "y^2"])}$。`,
            `求得势函数为 $f(x, y) = ${poly([a, "x^2"], [b, "xy"], [c, "y^2"])}$（差一任意常数）。`,
            `应用基本定理：$\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = f(${x0}, ${y0}) - f(0, 0) = ${a}(${x0})^2 + ${paren(b)}(${x0})(${y0}) + ${paren(c)}(${y0})^2 = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [ans + 2, -ans, ans * 2],
        });
      },
    },
  ],
};

/** lineIntegralsOfConservativeVectorFieldsInThreeDimensions evaluates 3D conservative line integrals. */
export const lineIntegralsOfConservativeVectorFieldsInThreeDimensions: TopicDef = {
  id: "line-integrals-of-conservative-vector-fields-in-three-dimensions",
  title: t("Line Integrals of Conservative Vector Fields in Three Dimensions", "三维保守向量场的曲线积分"),
  summary: t(
    "In $\\mathbb{R}^3$, a conservative line integral $\\int_C \\nabla f \\cdot d\\mathbf{r} = f(P_2) - f(P_1)$ depends only on the endpoints.",
    "在 $\\mathbb{R}^3$ 中，保守场的线积分 $\\int_C \\nabla f \\cdot d\\mathbf{r} = f(P_2) - f(P_1)$ 只取决于端点。",
  ),
  prerequisites: ["calculating-potential-functions-for-line-integrals"],
  encompasses: [
    {
      topic: "calculating-potential-functions-for-line-integrals",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "three-dimensional-gradient-theorem",
      title: t("Three-dimensional gradient theorem", "三维梯度定理计算曲线积分"),
      explanation: t(
        "For $f(x, y, z) = ax^2 + by^2 + cz^2$, $\\int_C \\nabla f \\cdot d\\mathbf{r} = f(x_2, y_2, z_2) - f(x_1, y_1, z_1)$.",
        "对于势函数 $f(x, y, z) = ax^2 + by^2 + cz^2$，$\\int_C \\nabla f \\cdot d\\mathbf{r} = f(x_2, y_2, z_2) - f(x_1, y_1, z_1)$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const c = rng.nonZero(-3, 3);
        const x1 = rng.int(-2, 2);
        const y1 = rng.int(-2, 2);
        const z1 = rng.int(-2, 2);
        const x2 = rng.int(-2, 2);
        const y2 = rng.int(-2, 2);
        const z2 = rng.int(-2, 2);

        const fA = a * x1 * x1 + b * y1 * y1 + c * z1 * z1;
        const fB = a * x2 * x2 + b * y2 * y2 + c * z2 * z2;
        const ans = fB - fA;

        const prompt = t(
          `Find $\\int_C \\nabla f \\cdot d\\mathbf{r}$ for $f(x, y, z) = ${poly([a, "x^2"], [b, "y^2"], [c, "z^2"])}$ along any curve $C$ from $A(${x1}, ${y1}, ${z1})$ to $B(${x2}, ${y2}, ${z2})$.`,
          `求三维势函数 $f(x, y, z) = ${poly([a, "x^2"], [b, "y^2"], [c, "z^2"])}$ 的梯度场沿从 $A(${x1}, ${y1}, ${z1})$ 到 $B(${x2}, ${y2}, ${z2})$ 的曲线积分 $\\int_C \\nabla f \\cdot d\\mathbf{r}$。`,
        );
        const solution = t(
          steps(
            `Apply the 3D Fundamental Theorem of Line Integrals: $\\int_C \\nabla f \\cdot d\\mathbf{r} = f(B) - f(A)$.`,
            `Evaluate at terminal point $B$: $f(${x2}, ${y2}, ${z2}) = ${fB}$.`,
            `Evaluate at initial point $A$: $f(${x1}, ${y1}, ${z1}) = ${fA}$.`,
            `The value is $f(B) - f(A) = ${fB} - (${fA}) = ${ans}$.`,
          ),
          steps(
            `应用三维曲线积分基本定理：$\\int_C \\nabla f \\cdot d\\mathbf{r} = f(B) - f(A)$。`,
            `计算终点 $B$ 处的函数值：$f(${x2}, ${y2}, ${z2}) = ${fB}$。`,
            `计算起点 $A$ 处的函数值：$f(${x1}, ${y1}, ${z1}) = ${fA}$。`,
            `求差：$f(B) - f(A) = ${fB} - (${fA}) = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [fA - fB, fB + fA, ans + 2],
        });
      },
    },
  ],
};

/** conservationOfMechanicalEnergy links work by conservative forces to potential energy. */
export const conservationOfMechanicalEnergy: TopicDef = {
  id: "conservation-of-mechanical-energy",
  title: t("Conservation of Mechanical Energy", "机械能守恒定律"),
  summary: t(
    "Work done by a conservative force F = -∇U equals negative change in potential energy, ensuring total mechanical energy E = K + U remains constant.",
    "保守力 F = -∇U 所做的功等于势能增量的相反数，保证了系统总机械能 E = K + U 保持守恒。",
  ),
  prerequisites: ["the-fundamental-theorem-of-line-integrals"],
  encompasses: [{ topic: "the-fundamental-theorem-of-line-integrals", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "kinetic-and-potential-energy-along-trajectories",
      title: t("Kinetic and potential energy along trajectories", "运动轨迹上的动能与势能转化"),
      explanation: t(
        "For a conservative force $\\mathbf{F} = -\\nabla U$, work relates to potential energy by $W = -\\Delta U = U_1 - U_2$. By the work-energy theorem, $W = \\Delta K = K_2 - K_1$, yielding conservation: $K_1 + U_1 = K_2 + U_2$.",
        "对于保守力 $\\mathbf{F} = -\\nabla U$，做功满足 $W = -\\Delta U = U_1 - U_2$。由动能定理 $W = \\Delta K = K_2 - K_1$，得到机械能守恒：$K_1 + U_1 = K_2 + U_2$。",
      ),
      generate(rng: Rng): Problem {
        const K1 = rng.int(10, 60);
        const U1 = rng.int(20, 80);
        const U2 = rng.int(5, U1);

        // K2 = K1 + U1 - U2
        const ans = K1 + U1 - U2;

        const prompt = t(
          `A particle moves in a conservative force field with potential energy $U$. At point $A$, it has kinetic energy $K_A = ${K1}\\text{ J}$ and potential energy $U_A = ${U1}\\text{ J}$. At point $B$, its potential energy is $U_B = ${U2}\\text{ J}$. Assuming no non-conservative forces act, find its kinetic energy $K_B$.`,
          `质点在势能为 $U$ 的保守力场中运动。在点 $A$ 处，其动能为 $K_A = ${K1}\\text{ J}$，势能为 $U_A = ${U1}\\text{ J}$。运动至点 $B$ 处时，其势能变为 $U_B = ${U2}\\text{ J}$。在无非保守力做功的情况下，求其在 $B$ 点处的动能 $K_B$。`,
        );
        const solution = t(
          steps(
            `By the conservation of mechanical energy: $K_A + U_A = K_B + U_B$.`,
            `Total mechanical energy is $E = K_A + U_A = ${K1} + ${U1} = ${K1 + U1}\\text{ J}$.`,
            `Solve for $K_B$: $K_B = E - U_B = ${K1 + U1} - ${U2} = ${ans}\\text{ J}$.`,
          ),
          steps(
            `由机械能守恒定律：$K_A + U_A = K_B + U_B$。`,
            `系统总机械能为 $E = K_A + U_A = ${K1} + ${U1} = ${K1 + U1}\\text{ J}$。`,
            `解出 $K_B$：$K_B = E - U_B = ${K1 + U1} - ${U2} = ${ans}\\text{ J}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [K1 + U2, U1 - U2, ans + 10],
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 4.23 Green's Theorem
// ---------------------------------------------------------------------------

/** circulationAndFluxAcrossSimpleClosedPlaneCurves contrasts circulation and flux. */
export const circulationAndFluxAcrossSimpleClosedPlaneCurves: TopicDef = {
  id: "circulation-and-flux-across-simple-closed-plane-curves",
  title: t("Circulation and Flux Across Simple Closed Plane Curves", "简单闭曲线上的环量与通量"),
  summary: t(
    "Circulation $\\oint_C (P\\,dx + Q\\,dy)$ accumulates the field along the tangent $\\mathbf{T}$, while flux $\\oint_C (P\\,dy - Q\\,dx)$ accumulates it across the outward normal $\\mathbf{n}$.",
    "环量 $\\oint_C (P\\,dx + Q\\,dy)$ 沿切向量 $\\mathbf{T}$ 累积场，通量 $\\oint_C (P\\,dy - Q\\,dx)$ 沿向外法向量 $\\mathbf{n}$ 累积场。",
  ),
  prerequisites: ["line-integrals-of-vector-valued-functions-over-general-curves"],
  encompasses: [
    {
      topic: "line-integrals-of-vector-valued-functions-over-general-curves",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "circulation-form-vs-flux-form",
      title: t("Circulation form vs flux form", "环量形式与通量形式的线积分表达式"),
      explanation: t(
        "For $\\mathbf{F} = \\langle P, Q \\rangle$:\n- **Circulation**: $\\oint_C \\mathbf{F} \\cdot \\mathbf{T}\\,ds = \\oint_C (P\\,dx + Q\\,dy)$.\n- **Outward Flux**: $\\oint_C \\mathbf{F} \\cdot \\mathbf{n}\\,ds = \\oint_C (P\\,dy - Q\\,dx)$.",
        "对于平面向量场 $\\mathbf{F} = \\langle P, Q \\rangle$：\n- **环量**：$\\oint_C \\mathbf{F} \\cdot \\mathbf{T}\\,ds = \\oint_C (P\\,dx + Q\\,dy)$。\n- **外法向通量**：$\\oint_C \\mathbf{F} \\cdot \\mathbf{n}\\,ds = \\oint_C (P\\,dy - Q\\,dx)$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 12);
        const b = rng.int(2, 12);
        const W = rng.int(2, 8);
        const H = rng.int(2, 8);
        const ans = (a + b) * W * H;
        const prompt = t(
          `Calculate the outward flux $\\oint_C (P\\,dy - Q\\,dx)$ of the vector field $\\mathbf{F} = \\langle ${a}x, ${b}y \\rangle$ across the boundary $C$ of the rectangle $[0, ${W}] \\times [0, ${H}]$, oriented counterclockwise.`,
          `计算向量场 $\\mathbf{F} = \\langle ${a}x, ${b}y \\rangle$ 穿过逆时针定向的矩形区域 $[0, ${W}] \\times [0, ${H}]$ 边界 $C$ 的外法向通量 $\\oint_C (P\\,dy - Q\\,dx)$。`,
        );
        const solution = t(
          steps(
            `The outward flux line integral is $\\oint_C (P\\,dy - Q\\,dx)$ where $P(x, y) = ${a}x$ and $Q(x, y) = ${b}y$.`,
            `By the flux form of Green's theorem, the outward flux equals $\\iint_D (\\frac{\\partial P}{\\partial x} + \\frac{\\partial Q}{\\partial y})\\,dA$.`,
            `Here $\\frac{\\partial P}{\\partial x} = ${a}$ and $\\frac{\\partial Q}{\\partial y} = ${b}$, so the integrand is $${a} + ${b} = ${a + b}$.`,
            `The area of the rectangle is $W \\times H = ${W} \\times ${H} = ${W * H}$.`,
            `Thus the outward flux is $(${a + b}) \\times ${W * H} = ${ans}$.`,
          ),
          steps(
            `外法向通量曲线积分为 $\\oint_C (P\\,dy - Q\\,dx)$，其中 $P(x, y) = ${a}x$，$Q(x, y) = ${b}y$。`,
            `由格林公式通量形式，外法向通量等于 $\\iint_D (\\frac{\\partial P}{\\partial x} + \\frac{\\partial Q}{\\partial y})\\,dA$。`,
            `此处 $\\frac{\\partial P}{\\partial x} = ${a}$，$\\frac{\\partial Q}{\\partial y} = ${b}$，被积函数为 $${a} + ${b} = ${a + b}$。`,
            `矩形面积为 $W \\times H = ${W} \\times ${H} = ${W * H}$。`,
            `因此外法向通量为 $(${a + b}) \\times ${W * H} = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [a * W * H, b * W * H, ans + W * H],
        });
      },
    },
  ],
};

/** greensTheoremInCirculationCurlForm connects circulation to the curl double integral. */
export const greensTheoremInCirculationCurlForm: TopicDef = {
  id: "greens-theorem-in-circulation-curl-form",
  title: t("Green's Theorem in Circulation-Curl Form", "格林公式（环量-旋度形式）"),
  summary: t(
    "Green's theorem equates the counterclockwise circulation to the double integral of the curl: $\\oint_C (P\\,dx + Q\\,dy) = \\iint_D (Q_x - P_y)\\,dA$.",
    "格林公式把逆时针方向的环量与旋度的二重积分联系起来：$\\oint_C (P\\,dx + Q\\,dy) = \\iint_D (Q_x - P_y)\\,dA$。",
  ),
  prerequisites: ["circulation-and-flux-across-simple-closed-plane-curves", "double-integrals-over-rectangular-domains"],
  encompasses: [
    {
      topic: "circulation-and-flux-across-simple-closed-plane-curves",
      weight: 0.3,
    },
    { topic: "double-integrals-over-rectangular-domains", weight: 0.3 },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "applying-greens-theorem-for-circulation",
      title: t("Applying Green's theorem for circulation", "应用格林公式计算环量积分"),
      explanation: t(
        "By Green's theorem:\n\n$$\\oint_C (P\\,dx + Q\\,dy) = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right)dA.$$ For $P = 0, Q = kx$ over a rectangle of area $A$, $\\oint_C kx\\,dy = kA$.",
        "由格林公式：\n\n$$\\oint_C (P\\,dx + Q\\,dy) = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right)dA。$$ 当 $P = 0, Q = kx$ 且区域为面积为 $A$ 的矩形时，$\\oint_C kx\\,dy = kA$。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(2, 6);
        const W = rng.int(2, 6);
        const H = rng.int(2, 6);
        const area = W * H;
        const ans = k * area;

        const prompt = t(
          `Use Green's Theorem to evaluate $\\oint_C ${k}x\\,dy$ around the boundary $C$ of the rectangle $D = [0, ${W}] \\times [0, ${H}]$ oriented counterclockwise.`,
          `应用格林公式计算逆时针沿矩形 $D = [0, ${W}] \\times [0, ${H}]$ 边界 $C$ 的曲线积分 $\\oint_C ${k}x\\,dy$。`,
        );
        const solution = t(
          steps(
            `Identify components: $P(x, y) = 0$ and $Q(x, y) = ${k}x$.`,
            `Compute the curl integrand: $\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = ${k} - 0 = ${k}$.`,
            `Apply Green's Theorem: $\\oint_C ${k}x\\,dy = \\iint_D ${k}\\,dA = ${k} \\times \\text{Area}(D) = ${k}(${W} \\times ${H}) = ${ans}$.`,
          ),
          steps(
            `确定分量：$P(x, y) = 0$ 且 $Q(x, y) = ${k}x$。`,
            `计算旋度被积函数：$\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = ${k} - 0 = ${k}$。`,
            `应用格林公式：$\\oint_C ${k}x\\,dy = \\iint_D ${k}\\,dA = ${k} \\times \\text{Area}(D) = ${k}(${W} \\times ${H}) = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [area, k * (W + H), ans + area],
        });
      },
    },
  ],
};

/** greensTheoremInPolarCoordinates evaluates the curl double integral of Green's theorem in polar coordinates. */
export const greensTheoremInPolarCoordinates: TopicDef = {
  id: "greens-theorem-in-polar-coordinates",
  title: t("Green's Theorem in Polar Coordinates", "极坐标下的格林公式"),
  summary: t(
    "When $D$ is a disk or an annulus, the double integral in Green's theorem is easiest in polar coordinates: $\\oint_C (P\\,dx + Q\\,dy) = \\int_0^{2\\pi}\\int (Q_x - P_y)\\,r\\,dr\\,d\\theta$.",
    "当 $D$ 是圆盘或圆环时，格林公式中的二重积分用极坐标计算最方便：$\\oint_C (P\\,dx + Q\\,dy) = \\int_0^{2\\pi}\\int (Q_x - P_y)\\,r\\,dr\\,d\\theta$。",
  ),
  prerequisites: ["greens-theorem-in-circulation-curl-form", "double-integrals-in-plane-polar-coordinates"],
  encompasses: [
    { topic: "greens-theorem-in-circulation-curl-form", weight: 0.5 },
    { topic: "double-integrals-in-plane-polar-coordinates", weight: 0.4 },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "greens-theorem-over-a-disk-in-polar-coordinates",
      title: t("Circulation around a circle", "沿圆周的环量"),
      explanation: t(
        "For $\\mathbf{F} = \\langle -a y^3, a x^3 \\rangle$ the curl integrand is $Q_x - P_y = 3a x^2 + 3a y^2 = 3a r^2$. Over the disk of radius $R$, remember the factor $r$ in $dA = r\\,dr\\,d\\theta$:\n\n$$\\oint_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_0^{2\\pi}\\int_0^R 3a r^2 \\cdot r\\,dr\\,d\\theta = 2\\pi \\cdot \\frac{3a R^4}{4} = \\frac{3a\\pi R^4}{2}.$$",
        "对 $\\mathbf{F} = \\langle -a y^3, a x^3 \\rangle$，旋度被积函数为 $Q_x - P_y = 3a x^2 + 3a y^2 = 3a r^2$。在半径为 $R$ 的圆盘上积分时，别忘了 $dA = r\\,dr\\,d\\theta$ 中的因子 $r$：\n\n$$\\oint_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_0^{2\\pi}\\int_0^R 3a r^2 \\cdot r\\,dr\\,d\\theta = 2\\pi \\cdot \\frac{3a R^4}{4} = \\frac{3a\\pi R^4}{2}。$$",
      ),
      generate(rng: Rng): Problem {
        const a = 2 * rng.int(1, 3);
        const p = rng.int(2, 6);
        const q = rng.int(2, 6);
        const R = rng.int(1, 3);
        const ans = (3 * a * R ** 4) / 2;
        const prompt = t(
          `Let $C$ be the circle $x^2 + y^2 = ${R * R}$, oriented counterclockwise, and $\\mathbf{F}(x, y) = \\langle ${p}x - ${a}y^3, ${a}x^3 + ${q}y \\rangle$. Use Green's theorem and polar coordinates to find $\\frac{1}{\\pi}\\oint_C \\mathbf{F} \\cdot d\\mathbf{r}$.`,
          `设 $C$ 为逆时针方向的圆周 $x^2 + y^2 = ${R * R}$，$\\mathbf{F}(x, y) = \\langle ${p}x - ${a}y^3, ${a}x^3 + ${q}y \\rangle$。利用格林公式和极坐标求 $\\frac{1}{\\pi}\\oint_C \\mathbf{F} \\cdot d\\mathbf{r}$。`,
        );
        const solution = t(
          steps(
            `The curl integrand is $Q_x - P_y = ${3 * a}x^2 + ${3 * a}y^2 = ${3 * a}r^2$; the terms $${p}x$ and $${q}y$ contribute nothing.`,
            `The region is the disk $0 \\le r \\le ${R}$, $0 \\le \\theta \\le 2\\pi$, with $dA = r\\,dr\\,d\\theta$.`,
            `$\\oint_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_0^{2\\pi}\\int_0^{${R}} ${3 * a}r^3\\,dr\\,d\\theta = 2\\pi \\cdot \\frac{${3 * a} \\cdot ${R ** 4}}{4} = ${ans}\\pi$.`,
            `Dividing by $\\pi$ gives $${ans}$.`,
          ),
          steps(
            `旋度被积函数为 $Q_x - P_y = ${3 * a}x^2 + ${3 * a}y^2 = ${3 * a}r^2$；$${p}x$ 与 $${q}y$ 两项不起作用。`,
            `区域是圆盘 $0 \\le r \\le ${R}$，$0 \\le \\theta \\le 2\\pi$，且 $dA = r\\,dr\\,d\\theta$。`,
            `$\\oint_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_0^{2\\pi}\\int_0^{${R}} ${3 * a}r^3\\,dr\\,d\\theta = 2\\pi \\cdot \\frac{${3 * a} \\cdot ${R ** 4}}{4} = ${ans}\\pi$。`,
            `除以 $\\pi$ 得 $${ans}$。`,
          ),
        );
        // Forgetting the factor r gives 2aR^3; Q_x + P_y gives 0; dropping the 1/4 gives 6aR^4.
        return numberProblem({ prompt, solution, answer: ans, wrong: [2 * a * R ** 3, 0, 6 * a * R ** 4] });
      },
    },
    {
      id: "greens-theorem-over-an-annulus-in-polar-coordinates",
      title: t("Circulation around the boundary of an annulus", "沿圆环边界的环量"),
      explanation: t(
        "The positively oriented boundary of the annulus $r_1 \\le r \\le r_2$ is the outer circle counterclockwise together with the inner circle clockwise. Green's theorem still applies, with $r$ running from $r_1$ to $r_2$:\n\n$$\\oint_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_0^{2\\pi}\\int_{r_1}^{r_2} (Q_x - P_y)\\,r\\,dr\\,d\\theta.$$ For $\\mathbf{F} = \\langle -a y^3, a x^3 \\rangle$ this is $\\frac{3a\\pi}{2}(r_2^4 - r_1^4)$.",
        "圆环 $r_1 \\le r \\le r_2$ 的正向边界由逆时针方向的外圆和顺时针方向的内圆组成。格林公式依然成立，只是 $r$ 从 $r_1$ 积到 $r_2$：\n\n$$\\oint_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_0^{2\\pi}\\int_{r_1}^{r_2} (Q_x - P_y)\\,r\\,dr\\,d\\theta。$$ 对 $\\mathbf{F} = \\langle -a y^3, a x^3 \\rangle$，结果为 $\\frac{3a\\pi}{2}(r_2^4 - r_1^4)$。",
      ),
      generate(rng: Rng): Problem {
        const a = 2 * rng.int(1, 2);
        const p = rng.int(2, 6);
        const q = rng.int(2, 6);
        const r1 = rng.int(1, 2);
        const r2 = rng.int(r1 + 1, 3);
        const diff = r2 ** 4 - r1 ** 4;
        const ans = (3 * a * diff) / 2;
        const prompt = t(
          `Let $D$ be the annulus $${r1 * r1} \\le x^2 + y^2 \\le ${r2 * r2}$ and $C$ its positively oriented boundary. For $\\mathbf{F}(x, y) = \\langle ${p}x - ${a}y^3, ${a}x^3 + ${q}y \\rangle$, use Green's theorem and polar coordinates to find $\\frac{1}{\\pi}\\oint_C \\mathbf{F} \\cdot d\\mathbf{r}$.`,
          `设 $D$ 为圆环 $${r1 * r1} \\le x^2 + y^2 \\le ${r2 * r2}$，$C$ 为它的正向边界。对 $\\mathbf{F}(x, y) = \\langle ${p}x - ${a}y^3, ${a}x^3 + ${q}y \\rangle$，利用格林公式和极坐标求 $\\frac{1}{\\pi}\\oint_C \\mathbf{F} \\cdot d\\mathbf{r}$。`,
        );
        const solution = t(
          steps(
            `The curl integrand is $Q_x - P_y = ${3 * a}x^2 + ${3 * a}y^2 = ${3 * a}r^2$; the terms $${p}x$ and $${q}y$ contribute nothing.`,
            `The annulus is $${r1} \\le r \\le ${r2}$, $0 \\le \\theta \\le 2\\pi$, with $dA = r\\,dr\\,d\\theta$.`,
            `$\\oint_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_0^{2\\pi}\\int_{${r1}}^{${r2}} ${3 * a}r^3\\,dr\\,d\\theta = 2\\pi \\cdot \\frac{${3 * a}(${r2 ** 4} - ${r1 ** 4})}{4} = ${ans}\\pi$.`,
            `Dividing by $\\pi$ gives $${ans}$.`,
          ),
          steps(
            `旋度被积函数为 $Q_x - P_y = ${3 * a}x^2 + ${3 * a}y^2 = ${3 * a}r^2$；$${p}x$ 与 $${q}y$ 两项不起作用。`,
            `圆环为 $${r1} \\le r \\le ${r2}$，$0 \\le \\theta \\le 2\\pi$，且 $dA = r\\,dr\\,d\\theta$。`,
            `$\\oint_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_0^{2\\pi}\\int_{${r1}}^{${r2}} ${3 * a}r^3\\,dr\\,d\\theta = 2\\pi \\cdot \\frac{${3 * a}(${r2 ** 4} - ${r1 ** 4})}{4} = ${ans}\\pi$。`,
            `除以 $\\pi$ 得 $${ans}$。`,
          ),
        );
        // Using only the outer circle, adding the inner disk, or forgetting the factor r.
        const wrong = [(3 * a * r2 ** 4) / 2, (3 * a * (r2 ** 4 + r1 ** 4)) / 2, 2 * a * (r2 ** 3 - r1 ** 3)];
        return numberProblem({ prompt, solution, answer: ans, wrong: wrong.filter((w) => w !== ans) });
      },
    },
  ],
};

/** calculatingAreasUsingGreensTheorem evaluates areas via boundary line integrals. */
export const calculatingAreasUsingGreensTheorem: TopicDef = {
  id: "calculating-areas-using-greens-theorem",
  title: t("Calculating Areas Using Green's Theorem", "应用格林公式计算平面区域面积"),
  summary: t(
    "Green's theorem gives area as a boundary integral: $\\operatorname{Area}(D) = \\oint_C x\\,dy = -\\oint_C y\\,dx = \\frac{1}{2}\\oint_C (x\\,dy - y\\,dx)$.",
    "格林公式把面积写成边界上的曲线积分：$\\operatorname{Area}(D) = \\oint_C x\\,dy = -\\oint_C y\\,dx = \\frac{1}{2}\\oint_C (x\\,dy - y\\,dx)$。",
  ),
  prerequisites: ["greens-theorem-in-circulation-curl-form"],
  encompasses: [{ topic: "greens-theorem-in-circulation-curl-form", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "area-formulas-from-boundary-integrals",
      title: t("Area formulas from boundary integrals", "由边界曲线积分求解平面区域面积"),
      explanation: t(
        "Setting $P = -\\frac{y}{2}$ and $Q = \\frac{x}{2}$ yields $\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = 1$, giving the area formula:\n\n$$\\text{Area}(D) = \\frac{1}{2}\\oint_C (x\\,dy - y\\,dx).$$",
        "取 $P = -\\frac{y}{2}$ 与 $Q = \\frac{x}{2}$ 可得 $\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = 1$，从而得到面积公式：\n\n$$\\text{Area}(D) = \\frac{1}{2}\\oint_C (x\\,dy - y\\,dx)。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 8);
        const b = rng.int(2, 8);
        const ans = a * b;

        const prompt = t(
          `For the ellipse with parametrization $\\mathbf{r}(t) = (${a}\\cos t, ${b}\\sin t)$ for $0 \\le t \\le 2\\pi$, find $\\frac{\\text{Area}(E)}{\\pi}$ using Green's area formula $\\text{Area}(E) = \\frac{1}{2}\\oint_C (x\\,dy - y\\,dx)$.`,
          `对于由参数方程 $\\mathbf{r}(t) = (${a}\\cos t, ${b}\\sin t)$（$0 \\le t \\le 2\\pi$）定义的椭圆，利用格林面积公式 $\\text{Area}(E) = \\frac{1}{2}\\oint_C (x\\,dy - y\\,dx)$ 计算 $\\frac{\\text{Area}(E)}{\\pi}$ 的值。`,
        );
        const solution = t(
          steps(
            `Compute differentials: $x = ${a}\\cos t, dx = -${a}\\sin t\\,dt$ and $y = ${b}\\sin t, dy = ${b}\\cos t\\,dt$.`,
            `The integrand is $x\\,dy - y\\,dx = (${a}\\cos t)(${b}\\cos t\\,dt) - (${b}\\sin t)(-${a}\\sin t\\,dt) = ${a * b}(\\cos^2 t + \\sin^2 t)\\,dt = ${a * b}\\,dt$.`,
            `Integrate around the loop: $\\text{Area}(E) = \\frac{1}{2} \\int_0^{2\\pi} ${a * b}\\,dt = \\frac{1}{2}(${a * b})(2\\pi) = ${a * b}\\pi$.`,
            `Dividing by $\\pi$ yields $${ans}$.`,
          ),
          steps(
            `计算微分：$x = ${a}\\cos t, dx = -${a}\\sin t\\,dt$ 且 $y = ${b}\\sin t, dy = ${b}\\cos t\\,dt$。`,
            `被积式为 $x\\,dy - y\\,dx = (${a}\\cos t)(${b}\\cos t\\,dt) - (${b}\\sin t)(-${a}\\sin t\\,dt) = ${a * b}(\\cos^2 t + \\sin^2 t)\\,dt = ${a * b}\\,dt$。`,
            `闭路积分：$\\text{Area}(E) = \\frac{1}{2} \\int_0^{2\\pi} ${a * b}\\,dt = \\frac{1}{2}(${a * b})(2\\pi) = ${a * b}\\pi$。`,
            `除以 $\\pi$ 得到 $${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [2 * a * b, a + b, ans + a * b],
        });
      },
    },
  ],
};

/** greensTheoremInFluxDivergenceForm connects outward flux to the divergence double integral. */
export const greensTheoremInFluxDivergenceForm: TopicDef = {
  id: "greens-theorem-in-flux-divergence-form",
  title: t("Green's Theorem in Flux-Divergence Form", "格林公式（通量-散度形式）"),
  summary: t(
    "The flux form of Green's theorem equates the outward flux across $C$ to the double integral of the divergence: $\\oint_C (P\\,dy - Q\\,dx) = \\iint_D (P_x + Q_y)\\,dA$.",
    "格林公式的通量形式把穿过 $C$ 的向外通量与散度的二重积分联系起来：$\\oint_C (P\\,dy - Q\\,dx) = \\iint_D (P_x + Q_y)\\,dA$。",
  ),
  prerequisites: ["greens-theorem-in-circulation-curl-form", "the-divergence-of-a-vector-field"],
  encompasses: [
    {
      topic: "greens-theorem-in-circulation-curl-form",
      weight: 0.3,
    },
    { topic: "the-divergence-of-a-vector-field", weight: 0.3 },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "two-dimensional-divergence-theorem",
      title: t("Two-dimensional divergence theorem", "应用二维散度定理计算通量"),
      explanation: t(
        "Green's theorem in flux form states:\n\n$$\\oint_C \\mathbf{F} \\cdot \\mathbf{n}\\,ds = \\oint_C (P\\,dy - Q\\,dx) = \\iint_D \\text{div}\\,\\mathbf{F}\\,dA = \\iint_D \\left(\\frac{\\partial P}{\\partial x} + \\frac{\\partial Q}{\\partial y}\\right)dA.$$",
        "通量形式的格林公式（平面散度定理）表明：\n\n$$\\oint_C \\mathbf{F} \\cdot \\mathbf{n}\\,ds = \\oint_C (P\\,dy - Q\\,dx) = \\iint_D \\text{div}\\,\\mathbf{F}\\,dA = \\iint_D \\left(\\frac{\\partial P}{\\partial x} + \\frac{\\partial Q}{\\partial y}\\right)dA。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const b = rng.int(1, 5);
        const W = rng.int(2, 6);
        const H = rng.int(2, 6);

        // F = (a*x, b*y) => div F = a + b.
        // Area = W * H.
        // Flux = (a + b) * Area.
        const div = a + b;
        const area = W * H;
        const ans = div * area;

        const prompt = t(
          `Find the outward flux $\\oint_C \\mathbf{F} \\cdot \\mathbf{n}\\,ds$ of $\\mathbf{F}(x, y) = \\langle ${poly([a, "x"])}, ${poly([b, "y"])} \\rangle$ across the boundary of the rectangle $D = [0, ${W}] \\times [0, ${H}]$.`,
          `计算向量场 $\\mathbf{F}(x, y) = \\langle ${poly([a, "x"])}, ${poly([b, "y"])} \\rangle$ 穿过矩形 $D = [0, ${W}] \\times [0, ${H}]$ 边界向外的总通量 $\\oint_C \\mathbf{F} \\cdot \\mathbf{n}\\,ds$。`,
        );
        const solution = t(
          steps(
            `Calculate the divergence: $\\text{div}\\,\\mathbf{F} = \\frac{\\partial}{\\partial x}(${poly([a, "x"])}) + \\frac{\\partial}{\\partial y}(${poly([b, "y"])}) = ${a} + ${b} = ${div}$.`,
            `Apply the 2D Divergence Theorem: $\\oint_C \\mathbf{F} \\cdot \\mathbf{n}\\,ds = \\iint_D \\text{div}\\,\\mathbf{F}\\,dA = ${div} \\times \\text{Area}(D)$.`,
            `The area is $${W} \\times ${H} = ${area}$, so the outward flux is $${div} \\times ${area} = ${ans}$.`,
          ),
          steps(
            `计算散度：$\\text{div}\\,\\mathbf{F} = \\frac{\\partial}{\\partial x}(${poly([a, "x"])}) + \\frac{\\partial}{\\partial y}(${poly([b, "y"])}) = ${a} + ${b} = ${div}$。`,
            `应用二维散度定理：$\\oint_C \\mathbf{F} \\cdot \\mathbf{n}\\,ds = \\iint_D \\text{div}\\,\\mathbf{F}\\,dA = ${div} \\times \\text{Area}(D)$。`,
            `矩形面积为 $${W} \\times ${H} = ${area}$，故向外总通量为 $${div} \\times ${area} = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [area, div * (W + H), ans + area],
        });
      },
    },
  ],
};

/** greensTheoremOnRegionsWithHoles extends Green's theorem to multiply-connected domains. */
export const greensTheoremOnRegionsWithHoles: TopicDef = {
  id: "greens-theorem-on-regions-with-holes",
  title: t("Green's Theorem on Regions With Holes", "复连通区域上的格林公式"),
  summary: t(
    "For a region with a hole, the outer boundary $C_1$ is traversed counterclockwise and the inner boundary $C_2$ clockwise: $\\oint_{C_1} \\mathbf{F} \\cdot d\\mathbf{r} - \\oint_{C_2} \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_D (Q_x - P_y)\\,dA$, with both $\\oint$ taken counterclockwise.",
    "对于含孔的区域，外边界 $C_1$ 取逆时针、内边界 $C_2$ 取顺时针：$\\oint_{C_1} \\mathbf{F} \\cdot d\\mathbf{r} - \\oint_{C_2} \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_D (Q_x - P_y)\\,dA$，其中两个 $\\oint$ 都按逆时针计算。",
  ),
  prerequisites: ["greens-theorem-in-circulation-curl-form"],
  encompasses: [{ topic: "greens-theorem-in-circulation-curl-form", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "greens-theorem-on-multiply-connected-domains",
      title: t("Green's theorem on multiply-connected domains", "复连通区域上格林公式的环量关系"),
      explanation: t(
        "For an annular region $D$ between outer boundary $C_1$ and inner boundary $C_2$ (both oriented counterclockwise):\n\n$$\\oint_{C_1} \\mathbf{F} \\cdot d\\mathbf{r} - \\oint_{C_2} \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right)dA.$$",
        "对于由外边界 $C_1$ 与内边界 $C_2$（均按逆时针定向）围成的环形区域 $D$：\n\n$$\\oint_{C_1} \\mathbf{F} \\cdot d\\mathbf{r} - \\oint_{C_2} \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right)dA。$$",
      ),
      generate(rng: Rng): Problem {
        const R1 = rng.int(3, 8);
        const R2 = rng.int(1, R1 - 1);
        const innerCirc = rng.int(5, 30);

        // Area = pi * (R1^2 - R2^2)
        // iint_D curl dA = curl * pi * (R1^2 - R2^2)
        // If oint_{C1} - oint_{C2} = curl * Area, or let curl = 0 (curl-free field on domain with hole):
        // If curl = 0, oint_{C1} = oint_{C2}!
        // Let's test curl-free on punctured plane (e.g. vortex):
        // If Q_x - P_y = 0 throughout the region between C1 and C2, then oint_{C1} = oint_{C2}!
        const ans = innerCirc;

        const prompt = t(
          `Suppose $\\frac{\\partial Q}{\\partial x} = \\frac{\\partial P}{\\partial y}$ throughout the annular region $D$ between two concentric counterclockwise circles $C_1$ (outer, radius ${R1}) and $C_2$ (inner, radius ${R2}). If $\\oint_{C_2} (P\\,dx + Q\\,dy) = ${innerCirc}$, find $\\oint_{C_1} (P\\,dx + Q\\,dy)$.`,
          `设在两个同心逆时针圆周 $C_1$（外圆，半径 ${R1}）与 $C_2$（内圆，半径 ${R2}）之间的环形区域 $D$ 内处处满足 $\\frac{\\partial Q}{\\partial x} = \\frac{\\partial P}{\\partial y}$。若内圆周积分 $\\oint_{C_2} (P\\,dx + Q\\,dy) = ${innerCirc}$，求外圆周积分 $\\oint_{C_1} (P\\,dx + Q\\,dy)$ 的值。`,
        );
        const solution = t(
          steps(
            `By Green's Theorem for multiply-connected domains, $\\oint_{C_1} (P\\,dx + Q\\,dy) - \\oint_{C_2} (P\\,dx + Q\\,dy) = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right)dA$.`,
            `Since $\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = 0$, the double integral vanishes: $\\iint_D 0\\,dA = 0$.`,
            `Therefore, $\\oint_{C_1} (P\\,dx + Q\\,dy) = \\oint_{C_2} (P\\,dx + Q\\,dy) = ${ans}$.`,
          ),
          steps(
            `由复连通区域上的格林公式，$\\oint_{C_1} (P\\,dx + Q\\,dy) - \\oint_{C_2} (P\\,dx + Q\\,dy) = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right)dA$。`,
            `因为 $\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = 0$，二重积分恒为零：$\\iint_D 0\\,dA = 0$。`,
            `因此，$\\oint_{C_1} (P\\,dx + Q\\,dy) = \\oint_{C_2} (P\\,dx + Q\\,dy) = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [0, -ans, 2 * ans],
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Export all Unit 4 topics
// ---------------------------------------------------------------------------

export const multivariableCalculusLineIntegralTopics: readonly TopicDef[] = [
  // 4.18 Line Integrals of Scalar Functions
  simpleClosedAndOrientedCurves,
  lineIntegralsOfScalarFunctions,
  propertiesOfLineIntegralsOfScalarFunctions,
  lineIntegralsOfScalarFunctionsOverPathsExpressedAsFunctionsOfX,
  lineIntegralsOfScalarFunctionsOverPathsExpressedAsFunctionsOfY,

  // 4.19 Line Integrals of Scalar Functions Over Parametric Curves
  lineIntegralsOfScalarFunctionsOverLineSegments,
  lineIntegralsOfScalarFunctionsOverCircles,
  lineIntegralsOfScalarFunctionsOverEllipses,
  furtherPropertiesOfLineIntegralsOfScalarFunctions,
  lineIntegralsOfScalarFunctionsOverPolarCurves,

  // 4.20 Line Integrals With Respect to X and Y
  lineIntegralsWithRespectToXAndY,
  propertiesOfLineIntegralsWithRespectToXAndY,
  sumsOfLineIntegralsWithRespectToXAndYOverParametricCurves,
  sumsOfLineIntegralsWithRespectToXAndY,

  // 4.21 Line Integrals of Vector-Valued Functions
  lineIntegralsOfVectorValuedFunctionsOverParametricCurves,
  lineIntegralsOfVectorValuedFunctionsOverGeneralCurves,
  interpretingLineIntegralsOfVectorValuedFunctions,
  propertiesOfLineIntegralsOfVectorValuedFunctions,
  workDoneByAForceField,

  // 4.22 The Fundamental Theorem of Line Integrals
  theFundamentalTheoremOfLineIntegrals,
  pathIndependenceOfLineIntegrals,
  conservativeVectorFieldsAndClosedPaths,
  calculatingPotentialFunctionsForLineIntegrals,
  lineIntegralsOfConservativeVectorFieldsInThreeDimensions,
  conservationOfMechanicalEnergy,

  // 4.23 Green's Theorem
  circulationAndFluxAcrossSimpleClosedPlaneCurves,
  greensTheoremInCirculationCurlForm,
  greensTheoremInPolarCoordinates,
  calculatingAreasUsingGreensTheorem,
  greensTheoremInFluxDivergenceForm,
  greensTheoremOnRegionsWithHoles,
];
