import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type PlaneMark, paren, plane, poly, Q } from "@ga/subject-math";
import { choiceProblem, numberProblem, pointProblem, steps, yesNo } from "../problems.ts";

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
        const solution = t(
          `The curve is ${right.en.toLowerCase()} because ${sol.en.charAt(0).toLowerCase()}${sol.en.slice(1)}`,
          `该曲线为${right["zh-CN"]}，因为${sol["zh-CN"]}`,
        );
        return pickChoice(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "the-orientation-of-a-parametrized-ellipse",
      title: t("The orientation of a parametrized ellipse", "参数化椭圆的定向"),
      explanation: t(
        "A parametrization gives a closed curve an orientation, the direction of increasing $t$. To decide it, check where the curve is at $t = 0$ and where it moves just after. For $\\mathbf{r}(t) = (a\\cos t, b\\sin t)$ with $a, b > 0$ the point starts at $(a, 0)$ and moves up into the first quadrant, which is counterclockwise. Changing the sign of one coordinate, or swapping $\\cos$ and $\\sin$, reverses the direction.",
        "参数化赋予闭曲线一个定向，即 $t$ 增大的方向。判断方法是看 $t = 0$ 时曲线在哪里以及随后向哪里移动。对 $\\mathbf{r}(t) = (a\\cos t, b\\sin t)$（$a, b > 0$），点从 $(a, 0)$ 出发向上进入第一象限，即逆时针。改变一个坐标的符号，或交换 $\\cos$ 与 $\\sin$，都会反转方向。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 7);
        const b = rng.int(1, 7);
        const kind = rng.int(0, 3);
        const x = [`${a}\\cos t`, `${a}\\cos t`, `${a}\\sin t`, `-${a}\\sin t`][kind]!;
        const y = [`${b}\\sin t`, `-${b}\\sin t`, `${b}\\cos t`, `${b}\\cos t`][kind]!;
        const ccw = kind === 0 || kind === 3;
        const start = [`(${a}, 0)`, `(${a}, 0)`, `(0, ${b})`, `(0, ${b})`][kind]!;
        const next = [t("upward", "向上"), t("downward", "向下"), t("to the right", "向右"), t("to the left", "向左")][kind]!;
        const cc = t("Counterclockwise", "逆时针");
        const cw = t("Clockwise", "顺时针");
        return pickChoice(
          rng,
          t(
            `In which direction does $\\mathbf{r}(t) = (${x}, ${y})$, $0 \\le t \\le 2\\pi$, trace its ellipse?`,
            `$\\mathbf{r}(t) = (${x}, ${y})$，$0 \\le t \\le 2\\pi$，沿哪个方向描出椭圆？`,
          ),
          ccw ? cc : cw,
          [ccw ? cw : cc],
          t(
            `At $t = 0$ the point is $${start}$, and as $t$ increases it moves ${next.en}, so the orientation is ${ccw ? "counterclockwise" : "clockwise"}.`,
            `$t = 0$ 时点在 $${start}$，随 $t$ 增大它${next["zh-CN"]}移动，所以定向为${ccw ? "逆时针" : "顺时针"}。`,
          ),
        );
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
        "A scalar line integral adds up the function's values along the curve weighted by small lengths, so the integrand includes the speed of the parametrization. For a curve parameterized by $\\mathbf{r}(t)$ on $[a, b]$, the line integral is:\n\n$$\\int_C f(x, y)\\,ds = \\int_a^b f(\\mathbf{r}(t))\\,\\|\\mathbf{r}'(t)\\|\\,dt.$$",
        "数量值曲线积分把函数沿曲线的值按小段长度加权相加，所以被积函数中包含参数化的速率。对于由 $\\mathbf{r}(t)$（$t \\in [a, b]$）参数化的曲线，第一类曲线积分为：\n\n$$\\int_C f(x, y)\\,ds = \\int_a^b f(\\mathbf{r}(t))\\,\\|\\mathbf{r}'(t)\\|\\,dt。$$",
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
    {
      id: "a-scalar-line-integral-of-xy-along-a-segment",
      title: t("A scalar line integral of $cxy$ along a segment", "沿线段计算 $cxy$ 的标量线积分"),
      explanation: t(
        "A scalar line integral adds up the values of $f$ weighted by arc length, so the first step is always to express both $f$ and $ds$ in terms of one parameter. Parametrize the segment from $(0, 0)$ to $(x_1, y_1)$ by $\\mathbf{r}(t) = (x_1t, y_1t)$ for $0 \\le t \\le 1$. Then $ds = \\|\\mathbf{r}'(t)\\|\\,dt = L\\,dt$ with $L = \\sqrt{x_1^2 + y_1^2}$, and\n\n$$\\int_C c\\,xy\\,ds = \\int_0^1 c\\,x_1y_1t^2 \\cdot L\\,dt = \\frac{c\\,x_1y_1L}{3}.$$",
        "标量线积分按弧长加权累加 $f$ 的值，所以第一步总是把 $f$ 和 $ds$ 都用同一个参数表示。把从 $(0, 0)$ 到 $(x_1, y_1)$ 的线段参数化为 $\\mathbf{r}(t) = (x_1t, y_1t)$，$0 \\le t \\le 1$。则 $ds = \\|\\mathbf{r}'(t)\\|\\,dt = L\\,dt$，$L = \\sqrt{x_1^2 + y_1^2}$，且\n\n$$\\int_C c\\,xy\\,ds = \\int_0^1 c\\,x_1y_1t^2 \\cdot L\\,dt = \\frac{c\\,x_1y_1L}{3}。$$",
      ),
      generate(rng: Rng): Problem {
        const [p, q, L] = rng.pick(pythagoreanTriples.slice(0, 5));
        const [x1, y1] = rng.int(0, 1) === 0 ? [p, q] : [q, p];
        const c = rng.int(1, 3);
        const ans = Q.of(c * x1 * y1 * L, 3);
        return numberProblem({
          prompt: t(
            `Evaluate $\\int_C ${c === 1 ? "" : c}xy\\,ds$ along the segment $C$ from $(0, 0)$ to $(${x1}, ${y1})$.`,
            `沿从 $(0, 0)$ 到 $(${x1}, ${y1})$ 的线段 $C$ 计算 $\\int_C ${c === 1 ? "" : c}xy\\,ds$。`,
          ),
          answer: ans,
          wrong: [Q.of(c * x1 * y1, 3), Q.of(c * x1 * y1 * L, 2), Q.of(c * x1 * y1 * L), Q.of(c * x1 * y1 * L * L, 3)],
          solution: t(
            `With $\\mathbf{r}(t) = (${x1}t, ${y1}t)$, $ds = ${L}\\,dt$, so $\\int_0^1 ${c * x1 * y1}t^2 \\cdot ${L}\\,dt = \\frac{${c * x1 * y1 * L}}{3}${ans.isInteger() ? ` = ${ans.toLatex()}` : ""}$.`,
            `取 $\\mathbf{r}(t) = (${x1}t, ${y1}t)$，$ds = ${L}\\,dt$，所以 $\\int_0^1 ${c * x1 * y1}t^2 \\cdot ${L}\\,dt = \\frac{${c * x1 * y1 * L}}{3}${ans.isInteger() ? ` = ${ans.toLatex()}` : ""}$。`,
          ),
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
    {
      id: "linearity-of-scalar-line-integrals",
      title: t("Linearity of scalar line integrals", "标量线积分的线性性"),
      explanation: t(
        "Scalar line integrals are linear in the integrand: $\\int_C (\\alpha f + \\beta g)\\,ds = \\alpha\\int_C f\\,ds + \\beta\\int_C g\\,ds$. A constant term $k$ contributes $k\\int_C ds = kL$, where $L$ is the length of $C$. Unlike line integrals of vector fields, these do not change sign when the curve is reversed, because $ds$ is always positive.",
        "标量线积分关于被积函数是线性的：$\\int_C (\\alpha f + \\beta g)\\,ds = \\alpha\\int_C f\\,ds + \\beta\\int_C g\\,ds$。常数项 $k$ 贡献 $k\\int_C ds = kL$，$L$ 为 $C$ 的长度。与向量场的线积分不同，曲线反向时它们不变号，因为 $ds$ 总是正的。",
      ),
      generate(rng: Rng): Problem {
        const F = rng.nonZero(-9, 9);
        const G = rng.nonZero(-9, 9);
        const L = rng.int(2, 9);
        const alpha = rng.pick([-3, -2, 2, 3, 4]);
        const k = rng.nonZero(-3, 3);
        const ans = alpha * F + k * L;
        return numberProblem({
          prompt: t(
            `A curve $C$ has length $${L}$, $\\int_C f\\,ds = ${F}$ and $\\int_C g\\,ds = ${G}$. Find $\\int_{-C} (${poly([alpha, "f"], [k, ""])})\\,ds$.`,
            `曲线 $C$ 长为 $${L}$，$\\int_C f\\,ds = ${F}$，$\\int_C g\\,ds = ${G}$。求 $\\int_{-C} (${poly([alpha, "f"], [k, ""])})\\,ds$。`,
          ),
          answer: ans,
          wrong: [-ans, alpha * F + k, alpha * F + k * G, alpha * F],
          solution: t(
            `Reversing the curve does not change a scalar line integral, so the value is $${alpha} \\cdot ${paren(F)} + ${paren(k)} \\cdot ${L} = ${ans}$.`,
            `曲线反向不改变标量线积分，所以值为 $${alpha} \\cdot ${paren(F)} + ${paren(k)} \\cdot ${L} = ${ans}$。`,
          ),
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
        "When the curve is a graph, use the horizontal variable as the parameter, and the arc length element includes the square root of one plus the square of the slope. For $y = mx$ with $0 \\le x \\le a$, the arc length differential is $ds = \\sqrt{1 + m^2}\\,dx$. Integrating $kx$ yields:\n\n$$\\int_C kx\\,ds = k\\sqrt{1 + m^2} \\int_0^a x\\,dx = k\\sqrt{1 + m^2}\\frac{a^2}{2}.$$",
        "当曲线是函数图像时，用水平变量作为参数，弧长微元中含有 1 加斜率平方的平方根。对于 $0 \\le x \\le a$ 上的线段 $y = mx$，弧长微元为 $ds = \\sqrt{1 + m^2}\\,dx$。对 $kx$ 积分得到：\n\n$$\\int_C kx\\,ds = k\\sqrt{1 + m^2} \\int_0^a x\\,dx = k\\sqrt{1 + m^2}\\frac{a^2}{2}。$$",
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
          `Evaluate the line integral $\\int_C ${coeff}x\\,ds$ along the line segment $y = ${Q.of(b, a).toLatex()}x$ from $x = 0$ to $x = ${a}$.`,
          `计算第一类曲线积分 $\\int_C ${coeff}x\\,ds$，其中曲线 $C$ 为直线段 $y = ${Q.of(b, a).toLatex()}x$ 从 $x = 0$ 到 $x = ${a}$。`,
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
    {
      id: "integrating-x-squared-along-a-line-through-the-origin",
      title: t("Integrating $kx^2$ along a line $y = mx$", "沿直线 $y = mx$ 积分 $kx^2$"),
      explanation: t(
        "For a path $y = g(x)$, $a \\le x \\le b$, the arc length element is $ds = \\sqrt{1 + g'(x)^2}\\,dx$. On the line $y = \\frac{q}{p}x$ this is the constant $\\frac{L}{p}\\,dx$ with $L = \\sqrt{p^2 + q^2}$. So\n\n$$\\int_C k\\,x^2\\,ds = \\frac{kL}{p}\\int_0^p x^2\\,dx = \\frac{k\\,p^2L}{3}.$$",
        "对路径 $y = g(x)$，$a \\le x \\le b$，弧长元素为 $ds = \\sqrt{1 + g'(x)^2}\\,dx$。在直线 $y = \\frac{q}{p}x$ 上它是常数 $\\frac{L}{p}\\,dx$，$L = \\sqrt{p^2 + q^2}$。所以\n\n$$\\int_C k\\,x^2\\,ds = \\frac{kL}{p}\\int_0^p x^2\\,dx = \\frac{k\\,p^2L}{3}。$$",
      ),
      generate(rng: Rng): Problem {
        const [m, n, L] = rng.pick(pythagoreanTriples.slice(0, 5));
        const [p, q] = rng.int(0, 1) === 0 ? [m, n] : [n, m];
        const k = rng.int(1, 3);
        const ans = Q.of(k * p * p * L, 3);
        return numberProblem({
          prompt: t(
            `Evaluate $\\int_C ${k === 1 ? "" : k}x^2\\,ds$ along $y = \\frac{${q}}{${p}}x$ from $x = 0$ to $x = ${p}$.`,
            `沿 $y = \\frac{${q}}{${p}}x$ 从 $x = 0$ 到 $x = ${p}$ 计算 $\\int_C ${k === 1 ? "" : k}x^2\\,ds$。`,
          ),
          answer: ans,
          wrong: [Q.of(k * p ** 3, 3), Q.of(k * p * p * q, 3), Q.of(k * p * p * L, 2), Q.of(k * p ** 3 * L, 3)],
          solution: t(
            `$ds = \\sqrt{1 + \\frac{${q * q}}{${p * p}}}\\,dx = \\frac{${L}}{${p}}\\,dx$, so $\\frac{${k * L}}{${p}}\\int_0^{${p}} x^2\\,dx = \\frac{${k * L}}{${p}} \\cdot \\frac{${p ** 3}}{3} = ${ans.toLatex()}$.`,
            `$ds = \\sqrt{1 + \\frac{${q * q}}{${p * p}}}\\,dx = \\frac{${L}}{${p}}\\,dx$，所以 $\\frac{${k * L}}{${p}}\\int_0^{${p}} x^2\\,dx = \\frac{${k * L}}{${p}} \\cdot \\frac{${p ** 3}}{3} = ${ans.toLatex()}$。`,
          ),
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
        "When the curve gives the horizontal coordinate as a function of the vertical one, use the vertical variable as the parameter instead. For $x = \\frac{a}{b}y$ with $0 \\le y \\le b$, $ds = \\frac{\\sqrt{a^2 + b^2}}{b}\\,dy = \\frac{c}{b}\\,dy$. Then $\\int_C ky\\,ds = \\frac{kc b}{2}$.",
        "当曲线把水平坐标表示为竖直坐标的函数时，改用竖直变量作为参数。对于 $0 \\le y \\le b$ 上的线段 $x = \\frac{a}{b}y$，$ds = \\frac{\\sqrt{a^2 + b^2}}{b}\\,dy = \\frac{c}{b}\\,dy$。则 $\\int_C ky\\,ds = \\frac{kc b}{2}$。",
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
          `Evaluate the line integral $\\int_C ${coeff}y\\,ds$ along the curve $x = ${Q.of(a, b).toLatex()}y$ from $y = 0$ to $y = ${b}$.`,
          `计算第一类曲线积分 $\\int_C ${coeff}y\\,ds$，其中曲线 $C$ 为直线段 $x = ${Q.of(a, b).toLatex()}y$ 从 $y = 0$ 到 $y = ${b}$。`,
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
    {
      id: "integrating-y-squared-along-a-line-x-equals-my",
      title: t("Integrating $ky^2$ along a line $x = my$", "沿直线 $x = my$ 积分 $ky^2$"),
      explanation: t(
        "For a path $x = h(y)$, $c \\le y \\le d$, the arc length element is $ds = \\sqrt{1 + h'(y)^2}\\,dy$, and the integral is taken in $y$. On the line $x = \\frac{p}{q}y$ this is $\\frac{L}{q}\\,dy$ with $L = \\sqrt{p^2 + q^2}$, so\n\n$$\\int_C k\\,y^2\\,ds = \\frac{kL}{q}\\int_0^q y^2\\,dy = \\frac{k\\,q^2L}{3}.$$",
        "对路径 $x = h(y)$，$c \\le y \\le d$，弧长元素为 $ds = \\sqrt{1 + h'(y)^2}\\,dy$，积分对 $y$ 进行。在直线 $x = \\frac{p}{q}y$ 上它是 $\\frac{L}{q}\\,dy$，$L = \\sqrt{p^2 + q^2}$，所以\n\n$$\\int_C k\\,y^2\\,ds = \\frac{kL}{q}\\int_0^q y^2\\,dy = \\frac{k\\,q^2L}{3}。$$",
      ),
      generate(rng: Rng): Problem {
        const [m, n, L] = rng.pick(pythagoreanTriples.slice(0, 5));
        const [p, q] = rng.int(0, 1) === 0 ? [m, n] : [n, m];
        const k = rng.int(1, 3);
        const ans = Q.of(k * q * q * L, 3);
        return numberProblem({
          prompt: t(
            `Evaluate $\\int_C ${k === 1 ? "" : k}y^2\\,ds$ along $x = \\frac{${p}}{${q}}y$ from $y = 0$ to $y = ${q}$.`,
            `沿 $x = \\frac{${p}}{${q}}y$ 从 $y = 0$ 到 $y = ${q}$ 计算 $\\int_C ${k === 1 ? "" : k}y^2\\,ds$。`,
          ),
          answer: ans,
          wrong: [Q.of(k * q ** 3, 3), Q.of(k * q * q * p, 3), Q.of(k * q * q * L, 2), Q.of(k * q ** 3 * L, 3)],
          solution: t(
            `$ds = \\sqrt{1 + \\frac{${p * p}}{${q * q}}}\\,dy = \\frac{${L}}{${q}}\\,dy$, so $\\frac{${k * L}}{${q}}\\int_0^{${q}} y^2\\,dy = \\frac{${k * L}}{${q}} \\cdot \\frac{${q ** 3}}{3} = ${ans.toLatex()}$.`,
            `$ds = \\sqrt{1 + \\frac{${p * p}}{${q * q}}}\\,dy = \\frac{${L}}{${q}}\\,dy$，所以 $\\frac{${k * L}}{${q}}\\int_0^{${q}} y^2\\,dy = \\frac{${k * L}}{${q}} \\cdot \\frac{${q ** 3}}{3} = ${ans.toLatex()}$。`,
          ),
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
        "Parametrize the segment from one endpoint to the other; the speed is then the constant length of the segment, which comes out of the integral. For a line segment connecting $(0, 0)$ to $(x_1, y_1)$ with length $L = \\sqrt{x_1^2 + y_1^2}$, $\\int_C k\\,ds = kL$.",
        "从一个端点到另一个端点参数化线段，速率就是线段的固定长度，可以提到积分号外面。对于连接 $(0, 0)$ 到 $(x_1, y_1)$、长度为 $L = \\sqrt{x_1^2 + y_1^2}$ 的线段，$\\int_C k\\,ds = kL$。",
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
    {
      id: "a-linear-function-along-a-segment-by-its-average-value",
      title: t("A linear function along a segment by its average", "用平均值求线段上一次函数的积分"),
      explanation: t(
        "A linear function $f(x, y) = x + y$ changes at a constant rate along a straight segment, so its average value on the segment is its value at the midpoint. Hence\n\n$$\\int_C (x + y)\\,ds = f(\\text{midpoint}) \\cdot L,$$\n\nwhere $L$ is the length of the segment. This agrees with parametrizing $\\mathbf{r}(t) = P + t(Q - P)$ and integrating directly.",
        "一次函数 $f(x, y) = x + y$ 沿直线段以恒定速率变化，所以它在线段上的平均值就是中点处的值。因此\n\n$$\\int_C (x + y)\\,ds = f(\\text{中点}) \\cdot L,$$\n\n其中 $L$ 是线段长度。这与参数化 $\\mathbf{r}(t) = P + t(Q - P)$ 后直接积分的结果一致。",
      ),
      generate(rng: Rng): Problem {
        const [m, n, L] = rng.pick(pythagoreanTriples.slice(0, 5));
        const [dx, dy] = rng.int(0, 1) === 0 ? [m, n] : [n, m];
        const sx = rng.pick([-1, 1]);
        const x0 = rng.int(-4, 4);
        const y0 = rng.int(-4, 4);
        const x1 = x0 + sx * dx;
        const y1 = y0 + dy;
        const mid = Q.of(x0 + x1 + y0 + y1, 2);
        const ans = mid.mul(Q.of(L));
        return numberProblem({
          prompt: t(
            `Evaluate $\\int_C (x + y)\\,ds$ along the segment $C$ from $(${x0}, ${y0})$ to $(${x1}, ${y1})$.`,
            `沿从 $(${x0}, ${y0})$ 到 $(${x1}, ${y1})$ 的线段 $C$ 计算 $\\int_C (x + y)\\,ds$。`,
          ),
          answer: ans,
          wrong: [mid, Q.of(x1 + y1).mul(Q.of(L)), Q.of(x0 + y0).mul(Q.of(L)), mid.mul(Q.of(dx + dy))],
          solution: t(
            `The length is $L = \\sqrt{${dx * dx} + ${dy * dy}} = ${L}$, and $x + y$ at the midpoint is $${mid.toLatex()}$. So the integral is $${mid.toLatex()} \\cdot ${L} = ${ans.toLatex()}$.`,
            `长度为 $L = \\sqrt{${dx * dx} + ${dy * dy}} = ${L}$，中点处 $x + y = ${mid.toLatex()}$。所以积分为 $${mid.toLatex()} \\cdot ${L} = ${ans.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

const wireView = { xMin: -5, xMax: 5, yMin: -5, yMax: 5, labelEvery: 1 } as const;
const onWire = (d: number, r = 3): readonly [number, number] => [r * Math.cos((d * Math.PI) / 180), r * Math.sin((d * Math.PI) / 180)];

/** circularWireFigure shows a wire along the circle of radius R and one short piece of it, of length ds. */
const circularWireFigure: Figure = {
  svg: plane(wireView, [
    { kind: "circle", center: [0, 0], r: 3 },
    { kind: "segment", a: [0, 0], b: onWire(40) },
    { kind: "segment", a: [0, 0], b: onWire(60), dashed: true },
    { kind: "curve", f: (x) => Math.sqrt(9 - x * x), from: onWire(60)[0], to: onWire(40)[0], accent: true },
    { kind: "point", at: onWire(40) },
    { kind: "point", at: onWire(60) },
    { kind: "label", at: [1.15, 0.95], text: "R", dir: "se" },
    { kind: "label", at: onWire(50, 3.1), text: "ds", dir: "ne" },
  ] satisfies PlaneMark[]),
  alt: t(
    "A circular wire of radius R centered at the origin, with one short piece of arc of length ds marked between two radii; adding ρ₀ ds around the circle gives ρ₀ times the circumference 2πR.",
    "以原点为圆心、半径为 R 的圆形细丝，两条半径之间标出一小段长为 ds 的弧；沿圆周累加 ρ₀ ds，得到 ρ₀ 乘以周长 2πR。",
  ),
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
      figure: circularWireFigure,
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
    {
      id: "integrating-a-quadratic-density-around-a-circle",
      title: t("Integrating $a + bx^2$ around a circle", "绕圆积分 $a + bx^2$"),
      explanation: t(
        "On a circle the arc length element is especially simple, because the speed of the standard parametrization is constant and equal to the radius. Parametrize the circle of radius $R$ by $(R\\cos t, R\\sin t)$, so $ds = R\\,dt$. A constant $a$ gives $a \\cdot 2\\pi R$. For $x^2$ use $\\int_0^{2\\pi} \\cos^2 t\\,dt = \\pi$:\n\n$$\\int_C x^2\\,ds = \\int_0^{2\\pi} R^2\\cos^2 t \\cdot R\\,dt = \\pi R^3.$$\n\nSo $\\int_C (a + bx^2)\\,ds = \\pi(2aR + bR^3)$.",
        "在圆上弧长元素特别简单，因为标准参数化的速率是常数，等于半径。把半径为 $R$ 的圆参数化为 $(R\\cos t, R\\sin t)$，则 $ds = R\\,dt$。常数 $a$ 贡献 $a \\cdot 2\\pi R$。对 $x^2$，利用 $\\int_0^{2\\pi} \\cos^2 t\\,dt = \\pi$：\n\n$$\\int_C x^2\\,ds = \\int_0^{2\\pi} R^2\\cos^2 t \\cdot R\\,dt = \\pi R^3。$$\n\n所以 $\\int_C (a + bx^2)\\,ds = \\pi(2aR + bR^3)$。",
      ),
      generate(rng: Rng): Problem {
        const R = rng.int(1, 4);
        const a = rng.int(1, 5);
        const b = rng.int(1, 4);
        const ans = 2 * a * R + b * R ** 3;
        return numberProblem({
          prompt: t(
            `$C$ is the circle $x^2 + y^2 = ${R * R}$. Find $\\frac{1}{\\pi}\\int_C (${poly([a, ""], [b, "x^2"])})\\,ds$.`,
            `$C$ 是圆 $x^2 + y^2 = ${R * R}$。求 $\\frac{1}{\\pi}\\int_C (${poly([a, ""], [b, "x^2"])})\\,ds$。`,
          ),
          answer: ans,
          wrong: [2 * a * R + 2 * b * R ** 3, a * R + b * R ** 3, 2 * a * R + b * R * R, 2 * (a + b * R * R) * R],
          solution: t(
            `$\\int_C ${a}\\,ds = ${a} \\cdot 2\\pi \\cdot ${R}$ and $\\int_C ${b === 1 ? "" : b}x^2\\,ds = ${b === 1 ? "" : b}\\pi \\cdot ${R}^3$. Dividing by $\\pi$ gives $${2 * a * R} + ${b * R ** 3} = ${ans}$.`,
            `$\\int_C ${a}\\,ds = ${a} \\cdot 2\\pi \\cdot ${R}$，$\\int_C ${b === 1 ? "" : b}x^2\\,ds = ${b === 1 ? "" : b}\\pi \\cdot ${R}^3$。除以 $\\pi$ 得 $${2 * a * R} + ${b * R ** 3} = ${ans}$。`,
          ),
        });
      },
    },
  ],
};

/** ellipseSymmetryFigure pairs points (x, y) and (−x, y) of an ellipse, where cx takes opposite values. */
const ellipseSymmetryFigure: Figure = {
  svg: plane(wireView, [
    { kind: "curve", f: (x) => 2.5 * Math.sqrt(Math.max(0, 1 - (x * x) / 16)), from: -4, to: 4 },
    { kind: "curve", f: (x) => -2.5 * Math.sqrt(Math.max(0, 1 - (x * x) / 16)), from: -4, to: 4 },
    { kind: "segment", a: [-2.4, 2], b: [2.4, 2], dashed: true },
    { kind: "segment", a: [-3.2, -1.5], b: [3.2, -1.5], dashed: true },
    { kind: "point", at: [2.4, 2], label: "cx", dir: "ne" },
    { kind: "point", at: [-2.4, 2], label: "−cx", dir: "nw" },
    { kind: "point", at: [3.2, -1.5], label: "cx", dir: "se" },
    { kind: "point", at: [-3.2, -1.5], label: "−cx", dir: "sw" },
  ]),
  alt: t(
    "An ellipse symmetric about the y-axis, with points paired across it; at each pair cx takes opposite values, so the cx parts of the integral cancel.",
    "关于 y 轴对称的椭圆，其上的点关于 y 轴两两配对；每一对点处 cx 的值互为相反数，所以积分中 cx 的部分相互抵消。",
  ),
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
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "integrating-over-symmetric-quadrants-of-ellipses",
      title: t("Integrating over symmetric quadrants of ellipses", "利用椭圆对称性计算曲线积分"),
      explanation: t(
        "When both the curve and the function are symmetric, the integral over the whole curve is a multiple of the integral over one quarter. By symmetry across the coordinate axes, for the ellipse $C: \\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$:\n\n$$\\oint_C (cx + k)\\,ds = \\oint_C cx\\,ds + k\\oint_C 1\\,ds = 0 + k\\,\\text{Length}(C).$$",
        "当曲线和函数都对称时，整条曲线上的积分是四分之一曲线上积分的倍数。由关于坐标轴的对称性，对于椭圆 $C: \\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$：\n\n$$\\oint_C (cx + k)\\,ds = \\oint_C cx\\,ds + k\\oint_C 1\\,ds = 0 + k\\,\\text{Length}(C)。$$",
      ),
      figure: ellipseSymmetryFigure,
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
    {
      id: "spotting-a-zero-line-integral-on-an-ellipse-by-symmetry",
      title: t("Spotting a zero integral on an ellipse by symmetry", "利用对称性识别椭圆上为零的积分"),
      explanation: t(
        "The arc length of an ellipse has no elementary formula, but symmetry can still decide some integrals. The ellipse $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$ is symmetric under $x \\mapsto -x$ and under $y \\mapsto -y$, and $ds$ is unchanged by these reflections. So $\\oint_C f\\,ds = 0$ whenever $f$ is odd in $x$ or odd in $y$, such as $x$, $xy^2$ or $y^3$, and also for a sum of such terms. Functions like $x^2$ or $x^2 + y^4$ are positive and give a positive integral.",
        "椭圆弧长没有初等公式，但对称性仍能确定某些积分。椭圆 $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$ 关于 $x \\mapsto -x$ 和 $y \\mapsto -y$ 对称，且这些反射不改变 $ds$。所以只要 $f$ 关于 $x$ 或关于 $y$ 为奇函数，如 $x$、$xy^2$ 或 $y^3$，就有 $\\oint_C f\\,ds = 0$，这样的项之和也一样。像 $x^2$ 或 $x^2 + y^4$ 这样的正函数给出正的积分。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 8);
        let b = rng.int(2, 8);
        if (b === a) b += 1;
        const c = rng.int(2, 5);
        const odd = rng.pick([`${c}xy^2`, `${c}x^3`, `${c}y^3`, `${c}x^2y`, `${c}xy^4`, `x^3 + ${c}y`]);
        const even = rng.shuffle([`${c}x^2`, `${c}y^2 + 1`, `x^2y^2`, `${c} + x^4`, `${c}x^2 + y^2`]).slice(0, 3);
        const o = (s: string) => t(`$f(x, y) = ${s}$`, `$f(x, y) = ${s}$`);
        return pickChoice(
          rng,
          t(
            `$C$ is the ellipse $\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} = 1$. For which function is $\\oint_C f\\,ds = 0$?`,
            `$C$ 是椭圆 $\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} = 1$。对哪个函数有 $\\oint_C f\\,ds = 0$？`,
          ),
          o(odd),
          even.map(o),
          t(
            `Each term of $${odd}$ is odd in $x$ or in $y$, so its values on symmetric halves of the ellipse cancel. The other functions are positive on most of the ellipse and never negative, so their integrals are positive.`,
            `$${odd}$ 的每一项都关于 $x$ 或 $y$ 是奇函数，在椭圆对称的两半上的值相互抵消。其他函数在椭圆上非负且大部分为正，积分为正。`,
          ),
        );
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
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "additivity-over-piecewise-smooth-paths",
      title: t("Additivity over piecewise-smooth paths", "分段光滑路径上的可加性"),
      explanation: t(
        "A path made of several smooth pieces is handled one piece at a time, with a convenient parametrization for each, and the results are added. If a path $C$ consists of $k$ smooth components $C_1, C_2, \\dots, C_k$ joined end-to-end:\n\n$$\\int_C f\\,ds = \\sum_{i=1}^k \\int_{C_i} f\\,ds.$$",
        "由几段光滑曲线组成的路径要逐段处理，每段用方便的参数化，再把结果相加。若路径 $C$ 由首尾相接的 $k$ 个光滑子段 $C_1, C_2, \\dots, C_k$ 构成：\n\n$$\\int_C f\\,ds = \\sum_{i=1}^k \\int_{C_i} f\\,ds。$$",
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
    {
      id: "a-scalar-line-integral-over-an-l-shaped-path",
      title: t("A scalar line integral over an L-shaped path", "沿 L 形路径的标量线积分"),
      explanation: t(
        "A piecewise smooth path is integrated one smooth piece at a time: $\\int_{C_1 \\cup C_2} f\\,ds = \\int_{C_1} f\\,ds + \\int_{C_2} f\\,ds$. On a horizontal piece $ds = dx$ with $y$ fixed, and on a vertical piece $ds = dy$ with $x$ fixed. Each piece is parametrized in its own variable, and the pieces' contributions are added at the end.",
        "分段光滑路径按光滑段逐段积分：$\\int_{C_1 \\cup C_2} f\\,ds = \\int_{C_1} f\\,ds + \\int_{C_2} f\\,ds$。在水平段上 $ds = dx$ 且 $y$ 固定，在竖直段上 $ds = dy$ 且 $x$ 固定。每一段用各自的变量参数化，最后把各段的贡献相加。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 8);
        const b = rng.int(1, 8);
        const k = rng.int(1, 3);
        const c1 = Q.of(k * a * a, 2);
        const c2 = Q.of(2 * k * a * b + k * b * b, 2);
        const ans = c1.add(c2);
        const f = k === 1 ? "x + y" : `${k}(x + y)`;
        return numberProblem({
          prompt: t(
            `$C$ runs along the segment from $(0, 0)$ to $(${a}, 0)$ and then along the segment from $(${a}, 0)$ to $(${a}, ${b})$. Evaluate $\\int_C ${f}\\,ds$.`,
            `$C$ 先沿从 $(0, 0)$ 到 $(${a}, 0)$ 的线段，再沿从 $(${a}, 0)$ 到 $(${a}, ${b})$ 的线段。计算 $\\int_C ${f}\\,ds$。`,
          ),
          answer: ans,
          wrong: [c1, c2, Q.of(k * (a * a + b * b), 2), Q.of(k * (a + b) * (a + b))],
          solution: t(
            `On the first piece $y = 0$ and $ds = dx$: $\\int_0^{${a}} ${k === 1 ? "" : k}x\\,dx = ${c1.toLatex()}$. On the second $x = ${a}$ and $ds = dy$: $\\int_0^{${b}} ${k === 1 ? "" : k}(${a} + y)\\,dy = ${c2.toLatex()}$. The total is $${ans.toLatex()}$.`,
            `第一段上 $y = 0$，$ds = dx$：$\\int_0^{${a}} ${k === 1 ? "" : k}x\\,dx = ${c1.toLatex()}$。第二段上 $x = ${a}$，$ds = dy$：$\\int_0^{${b}} ${k === 1 ? "" : k}(${a} + y)\\,dy = ${c2.toLatex()}$。总和为 $${ans.toLatex()}$。`,
          ),
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
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "arc-length-element-in-polar-coordinates",
      title: t("Arc length element in polar coordinates", "极坐标下的弧长微元计算"),
      explanation: t(
        "For a polar curve the arc length element combines the change in radius with the sideways motion, which is the radius times the change in angle. For a curve given by $r = g(\\theta)$ on $[\\alpha, \\beta]$, the line integral is:\n\n$$\\int_C f(r, \\theta)\\,ds = \\int_\\alpha^\\beta f(g(\\theta), \\theta)\\sqrt{[g(\\theta)]^2 + [g'(\\theta)]^2}\\,d\\theta.$$",
        "对于极坐标曲线，弧长微元结合了半径的变化和侧向的运动，后者等于半径乘以角度的变化。对于由 $r = g(\\theta)$（$\\theta \\in [\\alpha, \\beta]$）给出的曲线，第一类曲线积分为：\n\n$$\\int_C f(r, \\theta)\\,ds = \\int_\\alpha^\\beta f(g(\\theta), \\theta)\\sqrt{[g(\\theta)]^2 + [g'(\\theta)]^2}\\,d\\theta。$$",
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
    {
      id: "the-mass-of-a-cardioid-wire",
      title: t("The mass of a cardioid-shaped wire", "心形线导线的质量"),
      explanation: t(
        "For a polar curve $r = r(\\theta)$, $ds = \\sqrt{r^2 + (dr/d\\theta)^2}\\,d\\theta$. For the cardioid $r = a(1 + \\cos\\theta)$,\n\n$$r^2 + r'^2 = a^2(2 + 2\\cos\\theta) = 4a^2\\cos^2\\tfrac{\\theta}{2},$$\n\nso $ds = 2a\\left|\\cos\\tfrac{\\theta}{2}\\right|d\\theta$ and the whole curve has length $\\int_0^{2\\pi} 2a\\left|\\cos\\tfrac{\\theta}{2}\\right|d\\theta = 8a$. The same holds for $a(1 - \\cos\\theta)$ and $a(1 \\pm \\sin\\theta)$, which are rotations of it. A wire of constant density $k$ along it has mass $8ak$.",
        "对极坐标曲线 $r = r(\\theta)$，$ds = \\sqrt{r^2 + (dr/d\\theta)^2}\\,d\\theta$。对心形线 $r = a(1 + \\cos\\theta)$，\n\n$$r^2 + r'^2 = a^2(2 + 2\\cos\\theta) = 4a^2\\cos^2\\tfrac{\\theta}{2},$$\n\n所以 $ds = 2a\\left|\\cos\\tfrac{\\theta}{2}\\right|d\\theta$，整条曲线长 $\\int_0^{2\\pi} 2a\\left|\\cos\\tfrac{\\theta}{2}\\right|d\\theta = 8a$。$a(1 - \\cos\\theta)$ 与 $a(1 \\pm \\sin\\theta)$ 是它的旋转，结论相同。沿它的常密度 $k$ 导线质量为 $8ak$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 6);
        const k = rng.int(1, 4);
        const form = rng.pick(["1 + \\cos\\theta", "1 - \\cos\\theta", "1 + \\sin\\theta", "1 - \\sin\\theta"]);
        const ans = 8 * a * k;
        return numberProblem({
          prompt: t(
            `A wire of constant density $${k}$ lies along the cardioid $r = ${a === 1 ? "" : a}(${form})$, $0 \\le \\theta \\le 2\\pi$. Find its mass $\\int_C ${k}\\,ds$.`,
            `常密度为 $${k}$ 的导线沿心形线 $r = ${a === 1 ? "" : a}(${form})$，$0 \\le \\theta \\le 2\\pi$。求其质量 $\\int_C ${k}\\,ds$。`,
          ),
          answer: ans,
          wrong: [4 * a * k, 16 * a * k, 2 * a * k, 6 * a * k],
          solution: t(
            `$r^2 + r'^2 = ${a * a}(2 ${form[2]} 2${form.slice(4)})$, a perfect square in the half angle, and the total length is $8 \\cdot ${a} = ${8 * a}$. The mass is $${k} \\cdot ${8 * a} = ${ans}$.`,
            `$r^2 + r'^2 = ${a * a}(2 ${form[2]} 2${form.slice(4)})$，整条曲线长 $8 \\cdot ${a} = ${8 * a}$。质量为 $${k} \\cdot ${8 * a} = ${ans}$。`,
          ),
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
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "differential-line-integrals-along-curves",
      title: t("Differential line integrals along curves", "计算沿曲线的坐标微分积分"),
      explanation: t(
        "Integrating with respect to one coordinate measures the function against changes in that coordinate only, so replace the differential by the derivative of that coordinate times the parameter's differential. For a curve parameterized by $\\mathbf{r}(t) = (x(t), y(t))$ on $[a, b]$:\n\n$$\\int_C P(x, y)\\,dx = \\int_a^b P(x(t), y(t))\\,x'(t)\\,dt, \\quad \\int_C Q(x, y)\\,dy = \\int_a^b Q(x(t), y(t))\\,y'(t)\\,dt.$$",
        "对一个坐标积分只衡量函数相对于该坐标变化的累积，所以把微分换成该坐标的导数乘以参数的微分。对于由 $\\mathbf{r}(t) = (x(t), y(t))$（$t \\in [a, b]$）参数化的曲线：\n\n$$\\int_C P(x, y)\\,dx = \\int_a^b P(x(t), y(t))\\,x'(t)\\,dt, \\quad \\int_C Q(x, y)\\,dy = \\int_a^b Q(x(t), y(t))\\,y'(t)\\,dt。$$",
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
    {
      id: "x-dy-versus-y-dx-on-a-parametric-parabola",
      title: t("$\\int x\\,dy$ versus $\\int y\\,dx$ on a parabola", "抛物线上的 $\\int x\\,dy$ 与 $\\int y\\,dx$"),
      explanation: t(
        "On a parametric curve $x = x(t)$, $y = y(t)$, replace $dx$ by $x'(t)\\,dt$ and $dy$ by $y'(t)\\,dt$. For $x = pt$, $y = qt^2$, $0 \\le t \\le 1$:\n\n$$\\int_C y\\,dx = \\int_0^1 qt^2 \\cdot p\\,dt = \\frac{pq}{3}, \\qquad \\int_C x\\,dy = \\int_0^1 pt \\cdot 2qt\\,dt = \\frac{2pq}{3}.$$\n\nThe two are different integrals; which differential appears matters.",
        "在参数曲线 $x = x(t)$，$y = y(t)$ 上，把 $dx$ 换成 $x'(t)\\,dt$，把 $dy$ 换成 $y'(t)\\,dt$。对 $x = pt$，$y = qt^2$，$0 \\le t \\le 1$：\n\n$$\\int_C y\\,dx = \\int_0^1 qt^2 \\cdot p\\,dt = \\frac{pq}{3}, \\qquad \\int_C x\\,dy = \\int_0^1 pt \\cdot 2qt\\,dt = \\frac{2pq}{3}。$$\n\n二者是不同的积分，出现的是哪个微分很重要。",
      ),
      generate(rng: Rng): Problem {
        const p = rng.nonZero(-5, 5);
        const q = rng.nonZero(-5, 5);
        const xdy = rng.int(0, 1) === 1;
        const ans = Q.of(xdy ? 2 * p * q : p * q, 3);
        const xt = p === 1 ? "t" : p === -1 ? "-t" : `${p}t`;
        const yt = q === 1 ? "t^2" : q === -1 ? "-t^2" : `${q}t^2`;
        return numberProblem({
          prompt: t(
            `$C$ is $x = ${xt}$, $y = ${yt}$, $0 \\le t \\le 1$. Evaluate $\\int_C ${xdy ? "x\\,dy" : "y\\,dx"}$.`,
            `$C$ 为 $x = ${xt}$，$y = ${yt}$，$0 \\le t \\le 1$。计算 $\\int_C ${xdy ? "x\\,dy" : "y\\,dx"}$。`,
          ),
          answer: ans,
          wrong: [Q.of(xdy ? p * q : 2 * p * q, 3), Q.of(p * q, 2), Q.of(p * q), ans.neg()],
          solution: xdy
            ? t(
                `$dy = ${2 * q}t\\,dt$, so $\\int_0^1 (${poly([p, "t"])})(${poly([2 * q, "t"])})\\,dt = ${2 * p * q} \\cdot \\frac{1}{3} = ${ans.toLatex()}$.`,
                `$dy = ${2 * q}t\\,dt$，所以 $\\int_0^1 (${poly([p, "t"])})(${poly([2 * q, "t"])})\\,dt = ${2 * p * q} \\cdot \\frac{1}{3} = ${ans.toLatex()}$。`,
              )
            : t(
                `$dx = ${p}\\,dt$, so $\\int_0^1 (${poly([q, "t^2"])}) \\cdot ${paren(p)}\\,dt = ${p * q} \\cdot \\frac{1}{3} = ${ans.toLatex()}$.`,
                `$dx = ${p}\\,dt$，所以 $\\int_0^1 (${poly([q, "t^2"])}) \\cdot ${paren(p)}\\,dt = ${p * q} \\cdot \\frac{1}{3} = ${ans.toLatex()}$。`,
              ),
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
        "Unlike integrals with respect to arc length, these integrals depend on direction, so travelling the curve backwards changes the sign of the result. Reversing the curve's direction negates coordinate differentials $dx \\to -dx$ and $dy \\to -dy$, so:\n\n$$\\int_{-C} (P\\,dx + Q\\,dy) = -\\int_C (P\\,dx + Q\\,dy).$$",
        "与对弧长的积分不同，这些积分依赖于方向，所以沿曲线反向走会改变结果的符号。反转曲线遍历方向会导致坐标微分变号 $dx \\to -dx$ 与 $dy \\to -dy$，因此：\n\n$$\\int_{-C} (P\\,dx + Q\\,dy) = -\\int_C (P\\,dx + Q\\,dy)。$$",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(2, 5);
        const m = rng.nonZero(-9, 9);
        const drawn = rng.nonZero(-9, 9);
        const n = k * m + drawn === 0 ? drawn + 1 : drawn;
        const forward = k * m + n;
        const ans = -forward;

        const prompt = t(
          `If $\\int_C P\\,dx = ${m}$ and $\\int_C Q\\,dy = ${n}$, find the value of $\\int_{-C} (${k}P\\,dx + Q\\,dy)$.`,
          `若 $\\int_C P\\,dx = ${m}$，$\\int_C Q\\,dy = ${n}$，求 $\\int_{-C} (${k}P\\,dx + Q\\,dy)$ 的值。`,
        );
        const solution = t(
          steps(
            `Along $C$ the integral is $\\int_C (${k}P\\,dx + Q\\,dy) = ${k}(${m}) + (${n}) = ${forward}$.`,
            `Reversing the orientation of the curve reverses the sign of the line integral with respect to coordinates, so the value along $-C$ is $${ans}$.`,
          ),
          steps(
            `沿 $C$ 的积分为 $\\int_C (${k}P\\,dx + Q\\,dy) = ${k}(${m}) + (${n}) = ${forward}$。`,
            `反转曲线的行进方向会导致对坐标的曲线积分变号，所以沿 $-C$ 的值为 $${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [forward, -k * m + n, -(m + n), k * m - n],
        });
      },
    },
    {
      id: "constant-coefficient-differentials-depend-only-on-endpoints",
      title: t("$\\int_C k\\,dx + m\\,dy$ depends only on the endpoints", "$\\int_C k\\,dx + m\\,dy$ 只取决于端点"),
      explanation: t(
        "With constant coefficients, $\\int_C k\\,dx = k\\int_a^b x'(t)\\,dt = k\\,(x_B - x_A)$ for any path from $A$ to $B$, and similarly $\\int_C m\\,dy = m\\,(y_B - y_A)$. So\n\n$$\\int_C k\\,dx + m\\,dy = k\\,\\Delta x + m\\,\\Delta y,$$\n\nwhatever the shape of the path. Reversing the path changes the sign.",
        "系数为常数时，对从 $A$ 到 $B$ 的任意路径，$\\int_C k\\,dx = k\\int_a^b x'(t)\\,dt = k\\,(x_B - x_A)$，同理 $\\int_C m\\,dy = m\\,(y_B - y_A)$。所以\n\n$$\\int_C k\\,dx + m\\,dy = k\\,\\Delta x + m\\,\\Delta y,$$\n\n与路径形状无关。路径反向则变号。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.nonZero(-6, 6);
        const m = rng.nonZero(-6, 6);
        const x0 = rng.int(-4, 4);
        const y0 = rng.int(-4, 4);
        let x1 = rng.int(-4, 4);
        const y1 = rng.int(-4, 4);
        if (x1 === x0) x1 += 2;
        const ans = k * (x1 - x0) + m * (y1 - y0);
        return numberProblem({
          prompt: t(
            `$C$ is an arc of a parabola from $(${x0}, ${y0})$ to $(${x1}, ${y1})$. Evaluate $\\int_C ${poly([k, "\\,dx"], [m, "\\,dy"])}$.`,
            `$C$ 是从 $(${x0}, ${y0})$ 到 $(${x1}, ${y1})$ 的一段抛物线弧。计算 $\\int_C ${poly([k, "\\,dx"], [m, "\\,dy"])}$。`,
          ),
          answer: ans,
          wrong: [-ans, k * (y1 - y0) + m * (x1 - x0), k * x1 + m * y1, k + m],
          solution: t(
            `The value depends only on the endpoints: $${k} \\cdot ${paren(x1 - x0)} + ${paren(m)} \\cdot ${paren(y1 - y0)} = ${ans}$.`,
            `值只取决于端点：$${k} \\cdot ${paren(x1 - x0)} + ${paren(m)} \\cdot ${paren(y1 - y0)} = ${ans}$。`,
          ),
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
        "Substitute the parametrization into both component functions and both differentials, which turns the line integral into an ordinary integral in the parameter. Substitute $x = x(t), dx = x'(t)dt$ and $y = y(t), dy = y'(t)dt$:\n\n$$\\int_C (P\\,dx + Q\\,dy) = \\int_a^b \\left[P(x(t), y(t))x'(t) + Q(x(t), y(t))y'(t)\\right]dt.$$",
        "把参数化代入两个分量函数和两个微分，就把曲线积分变成关于参数的普通积分。代入 $x = x(t), dx = x'(t)dt$ 与 $y = y(t), dy = y'(t)dt$：\n\n$$\\int_C (P\\,dx + Q\\,dy) = \\int_a^b \\left[P(x(t), y(t))x'(t) + Q(x(t), y(t))y'(t)\\right]dt。$$",
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
    {
      id: "p-dx-plus-q-dy-along-a-sideways-parabola",
      title: t("$P\\,dx + Q\\,dy$ along $x = t^2$, $y = t$", "沿 $x = t^2$，$y = t$ 计算 $P\\,dx + Q\\,dy$"),
      explanation: t(
        "Substitute the parametrization into both terms and add before integrating. For $x = t^2$, $y = t$ we have $dx = 2t\\,dt$ and $dy = dt$, so\n\n$$\\int_C a\\,y^2\\,dx + b\\,x\\,dy = \\int_0^c (2a t^3 + b t^2)\\,dt = \\frac{ac^4}{2} + \\frac{bc^3}{3}.$$",
        "把参数化代入两项，相加后再积分。对 $x = t^2$，$y = t$，有 $dx = 2t\\,dt$，$dy = dt$，所以\n\n$$\\int_C a\\,y^2\\,dx + b\\,x\\,dy = \\int_0^c (2a t^3 + b t^2)\\,dt = \\frac{ac^4}{2} + \\frac{bc^3}{3}。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-5, 5);
        const b = rng.nonZero(-5, 5);
        const c = rng.int(1, 3);
        const ans = Q.of(a * c ** 4, 2).add(Q.of(b * c ** 3, 3));
        return numberProblem({
          prompt: t(
            `$C$ is $x = t^2$, $y = t$, $0 \\le t \\le ${c}$. Evaluate $\\int_C ${poly([a, "y^2\\,dx"], [b, "x\\,dy"])}$.`,
            `$C$ 为 $x = t^2$，$y = t$，$0 \\le t \\le ${c}$。计算 $\\int_C ${poly([a, "y^2\\,dx"], [b, "x\\,dy"])}$。`,
          ),
          answer: ans,
          wrong: [
            Q.of(a * c ** 3, 3).add(Q.of(b * c ** 3, 3)),
            Q.of(a * c ** 4, 4).add(Q.of(b * c ** 3, 3)),
            Q.of(a * c ** 4, 2).add(Q.of(b * c ** 4, 2)),
            ans.neg(),
          ],
          solution: t(
            `$dx = 2t\\,dt$ and $dy = dt$, so the integrand is $${poly([2 * a, "t^3"], [b, "t^2"])}$. Integrating from $0$ to $${c}$ gives $${Q.of(a * c ** 4, 2).toLatex()} + ${paren(Q.of(b * c ** 3, 3))} = ${ans.toLatex()}$.`,
            `$dx = 2t\\,dt$，$dy = dt$，被积式为 $${poly([2 * a, "t^3"], [b, "t^2"])}$。从 $0$ 积到 $${c}$ 得 $${Q.of(a * c ** 4, 2).toLatex()} + ${paren(Q.of(b * c ** 3, 3))} = ${ans.toLatex()}$。`,
          ),
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
        "On a horizontal segment the vertical coordinate does not change, so that part of the integral vanishes, and similarly for vertical segments. Along horizontal segments $y = c$, $dy = 0$, so $\\int_C (P\\,dx + Q\\,dy) = \\int P(x, c)\\,dx$. Along vertical segments $x = c$, $dx = 0$, so $\\int_C (P\\,dx + Q\\,dy) = \\int Q(c, y)\\,dy$.",
        "在水平线段上竖直坐标不变，所以积分中相应的部分为零；竖直线段也是如此。在水平线段 $y = c$ 上，$dy = 0$，故 $\\int_C (P\\,dx + Q\\,dy) = \\int P(x, c)\\,dx$。在垂直线段 $x = c$ 上，$dx = 0$，故 $\\int_C (P\\,dx + Q\\,dy) = \\int Q(c, y)\\,dy$。",
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
    {
      id: "p-dx-plus-q-dy-along-a-two-segment-path",
      title: t("$P\\,dx + Q\\,dy$ along a two-segment path", "沿两段折线计算 $P\\,dx + Q\\,dy$"),
      explanation: t(
        "Split a polygonal path into segments. On a horizontal segment $dy = 0$, so only the $P\\,dx$ term survives, with $y$ held fixed. On a vertical segment $dx = 0$, so only $Q\\,dy$ survives, with $x$ held fixed. For $\\int_C p\\,y\\,dx + q\\,x\\,dy$ two paths between the same points can give different values, because the field $\\langle py, qx \\rangle$ is conservative only when $p = q$.",
        "把折线路径拆成线段。水平线段上 $dy = 0$，只剩 $P\\,dx$ 项且 $y$ 固定；竖直线段上 $dx = 0$，只剩 $Q\\,dy$ 项且 $x$ 固定。对 $\\int_C p\\,y\\,dx + q\\,x\\,dy$，同样端点之间的两条路径可能给出不同的值，因为场 $\\langle py, qx \\rangle$ 只有在 $p = q$ 时才是保守的。",
      ),
      generate(rng: Rng): Problem {
        const p = rng.nonZero(-5, 5);
        let q = rng.nonZero(-5, 5);
        if (q === p) q = -p;
        const a = rng.int(1, 6);
        const b = rng.int(1, 6);
        const rightFirst = rng.int(0, 1) === 0;
        const ans = rightFirst ? q * a * b : p * a * b;
        const mid = rightFirst ? `(${a}, 0)` : `(0, ${b})`;
        return numberProblem({
          prompt: t(
            `$C$ goes along segments from $(0, 0)$ to $${mid}$ to $(${a}, ${b})$. Evaluate $\\int_C ${poly([p, "y\\,dx"], [q, "x\\,dy"])}$.`,
            `$C$ 沿线段从 $(0, 0)$ 到 $${mid}$ 再到 $(${a}, ${b})$。计算 $\\int_C ${poly([p, "y\\,dx"], [q, "x\\,dy"])}$。`,
          ),
          answer: ans,
          wrong: [rightFirst ? p * a * b : q * a * b, (p + q) * a * b, 0, -ans],
          solution: rightFirst
            ? t(
                `On the horizontal segment $y = 0$ and $dy = 0$, so it contributes $0$. On the vertical segment $x = ${a}$ and $dx = 0$: $\\int_0^{${b}} ${paren(q)} \\cdot ${a}\\,dy = ${ans}$.`,
                `水平段上 $y = 0$，$dy = 0$，贡献 $0$。竖直段上 $x = ${a}$，$dx = 0$：$\\int_0^{${b}} ${paren(q)} \\cdot ${a}\\,dy = ${ans}$。`,
              )
            : t(
                `On the vertical segment $x = 0$ and $dx = 0$, so it contributes $0$. On the horizontal segment $y = ${b}$ and $dy = 0$: $\\int_0^{${a}} ${paren(p)} \\cdot ${b}\\,dx = ${ans}$.`,
                `竖直段上 $x = 0$，$dx = 0$，贡献 $0$。水平段上 $y = ${b}$，$dy = 0$：$\\int_0^{${a}} ${paren(p)} \\cdot ${b}\\,dx = ${ans}$。`,
              ),
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
        "The integral adds up how much the field pushes along the direction of motion, which is its dot product with the velocity of the curve. To evaluate $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$, compute the velocity $\\mathbf{r}'(t)$, evaluate $\\mathbf{F}(\\mathbf{r}(t))$, and integrate the scalar product:\n\n$$\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_a^b \\left[\\mathbf{F}(\\mathbf{r}(t)) \\cdot \\mathbf{r}'(t)\\right]dt.$$",
        "这个积分累加向量场沿运动方向推动的程度，也就是它与曲线速度的点积。计算 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ 时，先求速度向量 $\\mathbf{r}'(t)$，代入 $\\mathbf{F}(\\mathbf{r}(t))$ 并对两者的点积求定积分：\n\n$$\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_a^b \\left[\\mathbf{F}(\\mathbf{r}(t)) \\cdot \\mathbf{r}'(t)\\right]dt。$$",
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
    {
      id: "a-rotational-field-along-a-circular-arc",
      title: t("A rotational field along a circular arc", "旋转场沿圆弧的线积分"),
      explanation: t(
        "To evaluate $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$, substitute the parametrization into the field, take the dot product with the velocity, and integrate in $t$. For $\\mathbf{r}(t) = (R\\cos t, R\\sin t)$, $\\mathbf{r}'(t) = (-R\\sin t, R\\cos t)$. The field $\\mathbf{F} = \\langle -ay, ax \\rangle$ at $\\mathbf{r}(t)$ is $(-aR\\sin t, aR\\cos t)$, so\n\n$$\\mathbf{F} \\cdot \\mathbf{r}'(t) = aR^2(\\sin^2 t + \\cos^2 t) = aR^2,$$\n\na constant. Over $0 \\le t \\le \\theta$ the integral is $aR^2\\theta$.",
        "计算 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ 时，把参数化代入场，与速度作点积，再对 $t$ 积分。对 $\\mathbf{r}(t) = (R\\cos t, R\\sin t)$，$\\mathbf{r}'(t) = (-R\\sin t, R\\cos t)$。场 $\\mathbf{F} = \\langle -ay, ax \\rangle$ 在 $\\mathbf{r}(t)$ 处为 $(-aR\\sin t, aR\\cos t)$，所以\n\n$$\\mathbf{F} \\cdot \\mathbf{r}'(t) = aR^2(\\sin^2 t + \\cos^2 t) = aR^2,$$\n\n为常数。在 $0 \\le t \\le \\theta$ 上积分为 $aR^2\\theta$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-4, 4);
        const R = rng.int(1, 4);
        const [num, den] = rng.pick([
          [1, 2],
          [1, 1],
          [3, 2],
          [2, 1],
          [1, 3],
          [2, 3],
        ] as const);
        const theta =
          num === 1 && den === 1 ? "\\pi" : num === 1 ? `\\frac{\\pi}{${den}}` : den === 1 ? `${num}\\pi` : `\\frac{${num}\\pi}{${den}}`;
        const ans = Q.of(a * R * R * num, den);
        const F = `\\langle ${poly([-a, "y"])}, ${poly([a, "x"])} \\rangle`;
        return numberProblem({
          prompt: t(
            `Let $\\mathbf{F} = ${F}$ and $\\mathbf{r}(t) = (${R === 1 ? "" : R}\\cos t, ${R === 1 ? "" : R}\\sin t)$, $0 \\le t \\le ${theta}$. Find $\\frac{1}{\\pi}\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$.`,
            `设 $\\mathbf{F} = ${F}$，$\\mathbf{r}(t) = (${R === 1 ? "" : R}\\cos t, ${R === 1 ? "" : R}\\sin t)$，$0 \\le t \\le ${theta}$。求 $\\frac{1}{\\pi}\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$。`,
          ),
          answer: ans,
          wrong: [Q.of(a * R * num, den), Q.of(2 * a * R * R * num, den), ans.neg(), Q.of(a * R * R)],
          solution: t(
            `$\\mathbf{F} \\cdot \\mathbf{r}'(t) = ${a} \\cdot ${R * R}(\\sin^2 t + \\cos^2 t) = ${a * R * R}$, so the integral is $${a * R * R} \\cdot ${theta}$, and dividing by $\\pi$ gives $${ans.toLatex()}$.`,
            `$\\mathbf{F} \\cdot \\mathbf{r}'(t) = ${a} \\cdot ${R * R}(\\sin^2 t + \\cos^2 t) = ${a * R * R}$，积分为 $${a * R * R} \\cdot ${theta}$，除以 $\\pi$ 得 $${ans.toLatex()}$。`,
          ),
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
        "Use the horizontal variable as the parameter, write the vertical coordinate and its differential in terms of it, and integrate the resulting single variable function. Along $y = cx^2$ from $x = 0$ to $x = a$, with $\\mathbf{F} = \\langle y, x \\rangle$:\n\n$$\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_0^a \\left[cx^2(1) + x(2cx)\\right]dx = \\int_0^a 3cx^2\\,dx = ca^3.$$",
        "用水平变量作为参数，把竖直坐标及其微分用它表示，再积分所得的一元函数。沿抛物线 $y = cx^2$ 从 $x = 0$ 到 $x = a$，对于 $\\mathbf{F} = \\langle y, x \\rangle$：\n\n$$\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_0^a \\left[cx^2(1) + x(2cx)\\right]dx = \\int_0^a 3cx^2\\,dx = ca^3。$$",
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
    {
      id: "a-vector-line-integral-along-a-graph-y-equals-x-squared",
      title: t("A vector line integral along $y = x^2$", "沿 $y = x^2$ 的向量线积分"),
      explanation: t(
        "A curve given as a graph needs no new parameter, and the whole integral becomes an ordinary integral in $x$. A graph $y = g(x)$ is parametrized by $x$ itself: $\\mathbf{r}(x) = (x, g(x))$, so $dx = dx$ and $dy = g'(x)\\,dx$. For $\\mathbf{F} = \\langle a\\,xy, b \\rangle$ along $y = x^2$ from $x = 0$ to $x = c$:\n\n$$\\int_C a\\,xy\\,dx + b\\,dy = \\int_0^c (a x^3 + 2b x)\\,dx = \\frac{ac^4}{4} + bc^2.$$",
        "以图像给出的曲线不需要新参数，整个积分化为关于 $x$ 的普通积分。图像 $y = g(x)$ 以 $x$ 本身为参数：$\\mathbf{r}(x) = (x, g(x))$，于是 $dy = g'(x)\\,dx$。对 $\\mathbf{F} = \\langle a\\,xy, b \\rangle$ 沿 $y = x^2$ 从 $x = 0$ 到 $x = c$：\n\n$$\\int_C a\\,xy\\,dx + b\\,dy = \\int_0^c (a x^3 + 2b x)\\,dx = \\frac{ac^4}{4} + bc^2。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-4, 4);
        const b = rng.nonZero(-5, 5);
        const c = rng.int(1, 3);
        const ans = Q.of(a * c ** 4, 4).add(Q.of(b * c * c));
        return numberProblem({
          prompt: t(
            `Evaluate $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ for $\\mathbf{F} = \\langle ${poly([a, "xy"])}, ${b} \\rangle$ along $y = x^2$ from $(0, 0)$ to $(${c}, ${c * c})$.`,
            `沿 $y = x^2$ 从 $(0, 0)$ 到 $(${c}, ${c * c})$，对 $\\mathbf{F} = \\langle ${poly([a, "xy"])}, ${b} \\rangle$ 计算 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$。`,
          ),
          answer: ans,
          wrong: [
            Q.of(a * c ** 4, 4).add(Q.of(b * c)),
            Q.of(a * c ** 3, 3).add(Q.of(b * c * c)),
            Q.of(a * c ** 4, 4),
            Q.of(a * c ** 4, 4).add(Q.of(2 * b * c * c)),
          ],
          solution: t(
            `With $y = x^2$, $dy = 2x\\,dx$, so the integrand is $${paren(a)}x \\cdot x^2 + ${paren(b)} \\cdot 2x = ${poly([a, "x^3"], [2 * b, "x"])}$. Integrating from $0$ to $${c}$ gives $${Q.of(a * c ** 4, 4).toLatex()} + ${paren(b * c * c)} = ${ans.toLatex()}$.`,
            `由 $y = x^2$，$dy = 2x\\,dx$，被积式为 $${paren(a)}x \\cdot x^2 + ${paren(b)} \\cdot 2x = ${poly([a, "x^3"], [2 * b, "x"])}$。从 $0$ 积到 $${c}$ 得 $${Q.of(a * c ** 4, 4).toLatex()} + ${paren(b * c * c)} = ${ans.toLatex()}$。`,
          ),
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
    {
      id: "the-sign-of-a-vector-line-integral",
      title: t("The sign of a vector line integral", "向量线积分的符号"),
      explanation: t(
        "$\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_C \\mathbf{F} \\cdot \\mathbf{T}\\,ds$ adds up the component of $\\mathbf{F}$ along the direction of motion. It is positive when the field mostly pushes along the path, negative when it mostly pushes against it, and zero when the field is perpendicular to the path everywhere. A radial field $\\langle x, y \\rangle$ is perpendicular to every circle centered at the origin, and a rotational field $\\langle -y, x \\rangle$ is perpendicular to every ray from the origin.",
        "$\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_C \\mathbf{F} \\cdot \\mathbf{T}\\,ds$ 累加 $\\mathbf{F}$ 沿运动方向的分量。场主要顺着路径推动时为正，主要逆着路径时为负，处处垂直于路径时为零。径向场 $\\langle x, y \\rangle$ 垂直于以原点为中心的每个圆，旋转场 $\\langle -y, x \\rangle$ 垂直于从原点出发的每条射线。",
      ),
      generate(rng: Rng): Problem {
        const kind = rng.int(0, 3);
        const k = rng.nonZero(-5, 5);
        const R = rng.int(1, 6);
        const pos = t("Positive", "正");
        const neg = t("Negative", "负");
        const zero = t("Zero", "零");
        let prompt: Text;
        let sign: number;
        let why: Text;
        if (kind === 0) {
          const d = rng.nonZero(-6, 6);
          const y0 = rng.int(-3, 3);
          const y1 = y0 + rng.int(-3, 3);
          prompt = t(
            `$\\mathbf{F} = \\langle ${k}, 0 \\rangle$ and $C$ is the segment from $(0, ${y0})$ to $(${d}, ${y1})$.`,
            `$\\mathbf{F} = \\langle ${k}, 0 \\rangle$，$C$ 为从 $(0, ${y0})$ 到 $(${d}, ${y1})$ 的线段。`,
          );
          sign = Math.sign(k * d);
          why = t(
            `The integral is $${k} \\cdot ${paren(d)} = ${k * d}$, the $x$-component times the change in $x$.`,
            `积分为 $${k} \\cdot ${paren(d)} = ${k * d}$，即 $x$ 分量乘以 $x$ 的变化量。`,
          );
        } else if (kind === 1) {
          prompt = t(
            `$\\mathbf{F} = \\langle ${poly([k, "x"])}, ${poly([k, "y"])} \\rangle$ and $C$ is the circle $x^2 + y^2 = ${R * R}$ traversed counterclockwise.`,
            `$\\mathbf{F} = \\langle ${poly([k, "x"])}, ${poly([k, "y"])} \\rangle$，$C$ 为逆时针方向的圆 $x^2 + y^2 = ${R * R}$。`,
          );
          sign = 0;
          why = t(
            "The field is radial, so it is perpendicular to the circle at every point and $\\mathbf{F} \\cdot \\mathbf{T} = 0$.",
            "该场是径向的，在圆上每点都垂直于圆，$\\mathbf{F} \\cdot \\mathbf{T} = 0$。",
          );
        } else if (kind === 2) {
          const cw = rng.int(0, 1) === 1;
          prompt = t(
            `$\\mathbf{F} = \\langle ${poly([-k, "y"])}, ${poly([k, "x"])} \\rangle$ and $C$ is the circle $x^2 + y^2 = ${R * R}$ traversed ${cw ? "clockwise" : "counterclockwise"}.`,
            `$\\mathbf{F} = \\langle ${poly([-k, "y"])}, ${poly([k, "x"])} \\rangle$，$C$ 为${cw ? "顺时针" : "逆时针"}方向的圆 $x^2 + y^2 = ${R * R}$。`,
          );
          sign = Math.sign(k) * (cw ? -1 : 1);
          why = t(
            `$\\langle -y, x \\rangle$ points counterclockwise along the circle, so $\\mathbf{F} \\cdot \\mathbf{T} = ${k * (cw ? -1 : 1) * R}$ at every point and the integral is $${2 * k * (cw ? -1 : 1) * R * R}\\pi$.`,
            `$\\langle -y, x \\rangle$ 沿圆逆时针指向，所以每点 $\\mathbf{F} \\cdot \\mathbf{T} = ${k * (cw ? -1 : 1) * R}$，积分为 $${2 * k * (cw ? -1 : 1) * R * R}\\pi$。`,
          );
        } else {
          const end = R * rng.pick([1, 2, -1]);
          prompt = t(
            `$\\mathbf{F} = \\langle ${poly([-k, "y"])}, ${poly([k, "x"])} \\rangle$ and $C$ is the segment from $(0, 0)$ to $(${R}, ${end})$.`,
            `$\\mathbf{F} = \\langle ${poly([-k, "y"])}, ${poly([k, "x"])} \\rangle$，$C$ 为从 $(0, 0)$ 到 $(${R}, ${end})$ 的线段。`,
          );
          sign = 0;
          why = t(
            "The segment lies on a ray from the origin, and the rotational field is perpendicular to every such ray.",
            "该线段位于从原点出发的射线上，旋转场垂直于每条这样的射线。",
          );
        }
        const right = sign > 0 ? pos : sign < 0 ? neg : zero;
        return pickChoice(
          rng,
          t(
            `${prompt.en} Is $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ positive, negative or zero?`,
            `${prompt["zh-CN"]}$\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ 为正、负还是零？`,
          ),
          right,
          [pos, neg, zero].filter((o) => o !== right),
          why,
        );
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
        "Going the other way along the curve reverses the direction of every small displacement, so the work done by the field changes sign. Reversing the direction of traversal negates the tangent displacement vector $d\\mathbf{r}$, hence:\n\n$$\\int_{-C} \\mathbf{F} \\cdot d\\mathbf{r} = -\\int_C \\mathbf{F} \\cdot d\\mathbf{r}.$$",
        "沿曲线反方向走会使每一小段位移反向，所以向量场做的功改变符号。反转遍历方向会导致切向微元向量变号 $d\\mathbf{r} \\to -d\\mathbf{r}$，因此：\n\n$$\\int_{-C} \\mathbf{F} \\cdot d\\mathbf{r} = -\\int_C \\mathbf{F} \\cdot d\\mathbf{r}。$$",
      ),
      generate(rng: Rng): Problem {
        const p = rng.nonZero(-15, 15);
        const drawn = rng.nonZero(-15, 15);
        const q = p + drawn === 0 ? drawn + 1 || 1 : drawn;
        const forward = p + q;
        const ans = -forward;

        const prompt = t(
          `The curve $C$ is $C_1$ followed by $C_2$, with $\\int_{C_1} \\mathbf{F} \\cdot d\\mathbf{r} = ${p}$ and $\\int_{C_2} \\mathbf{F} \\cdot d\\mathbf{r} = ${q}$. Determine the value of $\\int_{-C} \\mathbf{F} \\cdot d\\mathbf{r}$, where $-C$ is the same curve traversed in reverse.`,
          `曲线 $C$ 由 $C_1$ 接 $C_2$ 组成，$\\int_{C_1} \\mathbf{F} \\cdot d\\mathbf{r} = ${p}$，$\\int_{C_2} \\mathbf{F} \\cdot d\\mathbf{r} = ${q}$。求 $\\int_{-C} \\mathbf{F} \\cdot d\\mathbf{r}$ 的值，其中 $-C$ 为反向遍历的同一曲线。`,
        );
        const solution = t(
          steps(
            `Integrals add along pieces, so $\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = ${p} + (${q}) = ${forward}$.`,
            `Reversing the orientation of the curve negates the tangent vector element $d\\mathbf{r}$, so $\\int_{-C} \\mathbf{F} \\cdot d\\mathbf{r} = ${ans}$.`,
          ),
          steps(
            `积分可按分段相加，所以 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = ${p} + (${q}) = ${forward}$。`,
            `反向遍历曲线使切向位移微元 $d\\mathbf{r}$ 变号，所以 $\\int_{-C} \\mathbf{F} \\cdot d\\mathbf{r} = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [forward, q - p, p - q, 0],
        });
      },
    },
    {
      id: "combining-reversal-additivity-and-linearity",
      title: t("Combining reversal, additivity and linearity", "综合运用反向、可加性与线性"),
      explanation: t(
        "Three rules handle vector line integrals over combined paths: reversing a path changes the sign, $\\int_{-C} \\mathbf{F} \\cdot d\\mathbf{r} = -\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$; joining paths adds the integrals; and constants come out, $\\int_C \\alpha\\mathbf{F} \\cdot d\\mathbf{r} = \\alpha\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$. So\n\n$$\\int_{C_1 \\cup (-C_2)} \\alpha\\mathbf{F} \\cdot d\\mathbf{r} = \\alpha\\left(\\int_{C_1} \\mathbf{F} \\cdot d\\mathbf{r} - \\int_{C_2} \\mathbf{F} \\cdot d\\mathbf{r}\\right).$$",
        "三条规则处理组合路径上的向量线积分：路径反向则变号，$\\int_{-C} \\mathbf{F} \\cdot d\\mathbf{r} = -\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$；路径相接则积分相加；常数可以提出，$\\int_C \\alpha\\mathbf{F} \\cdot d\\mathbf{r} = \\alpha\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$。所以\n\n$$\\int_{C_1 \\cup (-C_2)} \\alpha\\mathbf{F} \\cdot d\\mathbf{r} = \\alpha\\left(\\int_{C_1} \\mathbf{F} \\cdot d\\mathbf{r} - \\int_{C_2} \\mathbf{F} \\cdot d\\mathbf{r}\\right)。$$",
      ),
      generate(rng: Rng): Problem {
        const A = rng.nonZero(-9, 9);
        let B = rng.nonZero(-9, 9);
        if (B === A) B += 1;
        const alpha = rng.pick([-3, -2, 2, 3, 4, 5]);
        const ans = alpha * (A - B);
        return numberProblem({
          prompt: t(
            `$\\int_{C_1} \\mathbf{F} \\cdot d\\mathbf{r} = ${A}$ and $\\int_{C_2} \\mathbf{F} \\cdot d\\mathbf{r} = ${B}$, where $C_1$ ends where $C_2$ ends. Find $\\int_{C_1 \\cup (-C_2)} ${alpha}\\mathbf{F} \\cdot d\\mathbf{r}$.`,
            `$\\int_{C_1} \\mathbf{F} \\cdot d\\mathbf{r} = ${A}$，$\\int_{C_2} \\mathbf{F} \\cdot d\\mathbf{r} = ${B}$，$C_1$ 与 $C_2$ 终点相同。求 $\\int_{C_1 \\cup (-C_2)} ${alpha}\\mathbf{F} \\cdot d\\mathbf{r}$。`,
          ),
          answer: ans,
          wrong: [alpha * (A + B), -ans, A - B, alpha * (B - A) + 1],
          solution: t(
            `Reversing $C_2$ gives $${-B}$, so the integral is $${alpha}(${A} + ${paren(-B)}) = ${ans}$.`,
            `把 $C_2$ 反向得 $${-B}$，所以积分为 $${alpha}(${A} + ${paren(-B)}) = ${ans}$。`,
          ),
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
    {
      id: "work-by-a-shear-force-along-a-segment",
      title: t("Work by the force $\\langle ay, 0 \\rangle$ along a segment", "力 $\\langle ay, 0 \\rangle$ 沿线段做的功"),
      explanation: t(
        "Work is $W = \\int_C \\mathbf{F} \\cdot d\\mathbf{r}$. For $\\mathbf{F} = \\langle ay, 0 \\rangle$ only the $dx$ term counts: $W = \\int_C a\\,y\\,dx$. On the segment $\\mathbf{r}(t) = (x_0 + t\\Delta x, y_0 + t\\Delta y)$, $0 \\le t \\le 1$,\n\n$$W = \\int_0^1 a(y_0 + t\\Delta y)\\,\\Delta x\\,dt = a\\,\\Delta x\\,\\frac{y_0 + y_1}{2}.$$\n\nThis field is not conservative, so another path between the same points can do different work.",
        "功为 $W = \\int_C \\mathbf{F} \\cdot d\\mathbf{r}$。对 $\\mathbf{F} = \\langle ay, 0 \\rangle$，只有 $dx$ 项起作用：$W = \\int_C a\\,y\\,dx$。在线段 $\\mathbf{r}(t) = (x_0 + t\\Delta x, y_0 + t\\Delta y)$，$0 \\le t \\le 1$ 上，\n\n$$W = \\int_0^1 a(y_0 + t\\Delta y)\\,\\Delta x\\,dt = a\\,\\Delta x\\,\\frac{y_0 + y_1}{2}。$$\n\n这个场不是保守的，同样两点之间的另一条路径做的功可能不同。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-4, 4);
        const x0 = rng.int(-3, 3);
        const y0 = rng.int(-3, 4);
        const dx = rng.nonZero(-5, 5);
        const y1 = rng.int(-3, 5);
        const x1 = x0 + dx;
        const ans = Q.of(a * dx * (y0 + y1), 2);
        return numberProblem({
          prompt: t(
            `Find the work done by $\\mathbf{F} = \\langle ${poly([a, "y"])}, 0 \\rangle$ on a particle moving along the segment from $(${x0}, ${y0})$ to $(${x1}, ${y1})$.`,
            `求 $\\mathbf{F} = \\langle ${poly([a, "y"])}, 0 \\rangle$ 对沿从 $(${x0}, ${y0})$ 到 $(${x1}, ${y1})$ 的线段运动的质点所做的功。`,
          ),
          answer: ans,
          wrong: [Q.of(a * dx * y1), Q.of(a * dx * y0), Q.of(a * (y1 - y0) * (x0 + x1), 2), ans.neg()],
          solution: t(
            `$W = \\int_C ${poly([a, "y"])}\\,dx$. Along the segment $y$ averages $\\frac{${y0} + ${paren(y1)}}{2}$ and $\\Delta x = ${dx}$, so $W = ${a} \\cdot ${paren(dx)} \\cdot \\frac{${y0 + y1}}{2} = ${ans.toLatex()}$.`,
            `$W = \\int_C ${poly([a, "y"])}\\,dx$。沿线段 $y$ 的平均值为 $\\frac{${y0} + ${paren(y1)}}{2}$，$\\Delta x = ${dx}$，所以 $W = ${a} \\cdot ${paren(dx)} \\cdot \\frac{${y0 + y1}}{2} = ${ans.toLatex()}$。`,
          ),
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
  title: t("The Fundamental Theorem for Line Integrals", "曲线积分基本定理"),
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
        const x2Drawn = rng.int(-2, 2);
        const y2 = rng.int(-2, 2);

        // f(x, y) = a * x^2 + b * y^2
        const fA = a * x1 * x1 + b * y1 * y1;
        // Moving x2 to 3 makes f(B) differ from f(A) whenever the drawn end has the same value: x^2 grows past every other value.
        const x2 = a * x2Drawn * x2Drawn + b * y2 * y2 === fA ? 3 : x2Drawn;
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
    {
      id: "evaluating-a-gradient-integral-with-a-mixed-term",
      title: t("A gradient integral with a mixed term", "含交叉项的梯度场积分"),
      explanation: t(
        "If $\\mathbf{F} = \\nabla f$ and $C$ runs from $A$ to $B$, then $\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = f(B) - f(A)$, whatever the path. When $\\mathbf{F}$ is given by its components, first recognize the potential. For $f = ax^2y + by$ the gradient is $\\langle 2axy, ax^2 + b \\rangle$, so the integral of that field is a difference of two values of $ax^2y + by$.",
        "若 $\\mathbf{F} = \\nabla f$ 且 $C$ 从 $A$ 到 $B$，则无论路径如何，$\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = f(B) - f(A)$。当 $\\mathbf{F}$ 以分量给出时，先认出势函数。对 $f = ax^2y + by$，梯度为 $\\langle 2axy, ax^2 + b \\rangle$，所以该场的积分是 $ax^2y + by$ 两个值之差。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-5, 5);
        const x0 = rng.int(-2, 2);
        const y0 = rng.int(-2, 2);
        const x1 = rng.int(-3, 3);
        let y1 = rng.int(-3, 3);
        if (x1 === x0 && y1 === y0) y1 += 1;
        const f = (x: number, y: number) => a * x * x * y + b * y;
        const fA = f(x0, y0);
        const fB = f(x1, y1);
        const ans = fB - fA;
        return numberProblem({
          prompt: t(
            `$\\mathbf{F} = \\nabla f$ with $f(x, y) = ${poly([a, "x^2y"], [b, "y"])}$, so $\\mathbf{F} = \\langle ${poly([2 * a, "xy"])}, ${poly([a, "x^2"], [b, ""])} \\rangle$. Evaluate $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ along any path from $(${x0}, ${y0})$ to $(${x1}, ${y1})$.`,
            `$\\mathbf{F} = \\nabla f$，$f(x, y) = ${poly([a, "x^2y"], [b, "y"])}$，即 $\\mathbf{F} = \\langle ${poly([2 * a, "xy"])}, ${poly([a, "x^2"], [b, ""])} \\rangle$。沿从 $(${x0}, ${y0})$ 到 $(${x1}, ${y1})$ 的任意路径计算 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$。`,
          ),
          answer: ans,
          wrong: [-ans, fB + fA, fB, ans + b],
          solution: t(
            `$f(${x1}, ${y1}) = ${fB}$ and $f(${x0}, ${y0}) = ${fA}$, so the integral is $${fB} - ${paren(fA)} = ${ans}$.`,
            `$f(${x1}, ${y1}) = ${fB}$，$f(${x0}, ${y0}) = ${fA}$，所以积分为 $${fB} - ${paren(fA)} = ${ans}$。`,
          ),
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
    {
      id: "testing-a-linear-field-for-path-independence",
      title: t("Testing a field for path independence", "检验向量场的路径无关性"),
      explanation: t(
        "On the whole plane, which is simply connected, $\\int_C P\\,dx + Q\\,dy$ is path independent exactly when $\\frac{\\partial P}{\\partial y} = \\frac{\\partial Q}{\\partial x}$ everywhere. For $\\mathbf{F} = \\langle ay + bx^2, cx + dy^3 \\rangle$ this means $a = c$: the terms $bx^2$ and $dy^3$ depend on one variable only and never affect the test.",
        "在整个平面（单连通）上，$\\int_C P\\,dx + Q\\,dy$ 与路径无关当且仅当处处 $\\frac{\\partial P}{\\partial y} = \\frac{\\partial Q}{\\partial x}$。对 $\\mathbf{F} = \\langle ay + bx^2, cx + dy^3 \\rangle$，这意味着 $a = c$：项 $bx^2$ 与 $dy^3$ 只依赖一个变量，从不影响检验。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-5, 5);
        const indep = rng.int(0, 1) === 0;
        let c = indep ? a : rng.nonZero(-5, 5);
        if (!indep && c === a) c = -a;
        const b = rng.nonZero(-4, 4);
        const d = rng.nonZero(-4, 4);
        return pickChoice(
          rng,
          t(
            `Is $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ independent of path in the plane for $\\mathbf{F} = \\langle ${poly([a, "y"], [b, "x^2"])}, ${poly([c, "x"], [d, "y^3"])} \\rangle$?`,
            `对 $\\mathbf{F} = \\langle ${poly([a, "y"], [b, "x^2"])}, ${poly([c, "x"], [d, "y^3"])} \\rangle$，$\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ 在平面上与路径无关吗？`,
          ),
          indep ? yesNo[0]! : yesNo[1]!,
          [indep ? yesNo[1]! : yesNo[0]!],
          t(
            `$\\frac{\\partial P}{\\partial y} = ${a}$ and $\\frac{\\partial Q}{\\partial x} = ${c}$. ${indep ? "They agree on the whole plane, so the field is conservative and the integral is path independent." : "They differ, so the field is not conservative and the integral depends on the path."}`,
            `$\\frac{\\partial P}{\\partial y} = ${a}$，$\\frac{\\partial Q}{\\partial x} = ${c}$。${indep ? "二者在整个平面上相等，所以场是保守的，积分与路径无关。" : "二者不等，所以场不是保守的，积分依赖于路径。"}`,
          ),
        );
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
    {
      id: "a-nonzero-circulation-rules-out-a-potential",
      title: t("A nonzero circulation rules out a potential", "非零环量说明不存在势函数"),
      explanation: t(
        "If $\\mathbf{F}$ is conservative, its circulation around every closed curve is $0$. So a single closed curve with nonzero circulation proves that $\\mathbf{F}$ has no potential. For $\\mathbf{F} = \\langle -ay, bx \\rangle$ around the counterclockwise circle of radius $R$, with $\\mathbf{r}(t) = (R\\cos t, R\\sin t)$,\n\n$$\\oint_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_0^{2\\pi} (aR^2\\sin^2 t + bR^2\\cos^2 t)\\,dt = (a + b)\\pi R^2.$$\n\nThis is nonzero unless $b = -a$, and $\\langle -ay, -ax \\rangle = \\nabla(-axy)$ is indeed conservative.",
        "若 $\\mathbf{F}$ 是保守的，它沿每条闭曲线的环量都是 $0$。所以只要有一条闭曲线的环量不为零，就证明了 $\\mathbf{F}$ 没有势函数。对 $\\mathbf{F} = \\langle -ay, bx \\rangle$ 沿半径为 $R$ 的逆时针圆，$\\mathbf{r}(t) = (R\\cos t, R\\sin t)$，\n\n$$\\oint_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_0^{2\\pi} (aR^2\\sin^2 t + bR^2\\cos^2 t)\\,dt = (a + b)\\pi R^2。$$\n\n除非 $b = -a$，这都不为零；而 $\\langle -ay, -ax \\rangle = \\nabla(-axy)$ 确实是保守的。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-4, 4);
        let b = rng.nonZero(-4, 4);
        if (b === -a) b = a;
        const R = rng.int(1, 4);
        const ans = (a + b) * R * R;
        return numberProblem({
          prompt: t(
            `Find $\\frac{1}{\\pi}\\oint_C \\mathbf{F} \\cdot d\\mathbf{r}$ for $\\mathbf{F} = \\langle ${poly([-a, "y"])}, ${poly([b, "x"])} \\rangle$ around the circle $x^2 + y^2 = ${R * R}$, counterclockwise. A nonzero answer shows $\\mathbf{F}$ is not conservative.`,
            `沿逆时针方向的圆 $x^2 + y^2 = ${R * R}$，对 $\\mathbf{F} = \\langle ${poly([-a, "y"])}, ${poly([b, "x"])} \\rangle$ 求 $\\frac{1}{\\pi}\\oint_C \\mathbf{F} \\cdot d\\mathbf{r}$。非零的结果说明 $\\mathbf{F}$ 不是保守的。`,
          ),
          answer: ans,
          wrong: [0, (b - a) * R * R, 2 * (a + b) * R * R, (a + b) * R],
          solution: t(
            `$\\mathbf{F} \\cdot \\mathbf{r}'(t) = ${poly([a * R * R, "\\sin^2 t"], [b * R * R, "\\cos^2 t"])}$, and each of $\\sin^2 t$, $\\cos^2 t$ integrates to $\\pi$ over a full turn. So the circulation is $${ans}\\pi$, and dividing by $\\pi$ gives $${ans}$.`,
            `$\\mathbf{F} \\cdot \\mathbf{r}'(t) = ${poly([a * R * R, "\\sin^2 t"], [b * R * R, "\\cos^2 t"])}$，$\\sin^2 t$ 与 $\\cos^2 t$ 在一整圈上的积分都是 $\\pi$。所以环量为 $${ans}\\pi$，除以 $\\pi$ 得 $${ans}$。`,
          ),
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
        "Integrate the first component with respect to its variable, then choose the leftover function of the other variable so that its partial derivative matches the second component. For $\\mathbf{F} = \\langle 2ax + by, bx + 2cy \\rangle$, the potential function is $f(x, y) = ax^2 + bxy + cy^2$. The line integral from $(0, 0)$ to $(x_0, y_0)$ is $f(x_0, y_0) - f(0, 0) = ax_0^2 + bx_0 y_0 + cy_0^2$.",
        "把第一个分量对其变量积分，再选择剩下的另一变量的函数，使它的偏导数与第二个分量一致。对于 $\\mathbf{F} = \\langle 2ax + by, bx + 2cy \\rangle$，其势函数为 $f(x, y) = ax^2 + bxy + cy^2$。从 $(0, 0)$ 到 $(x_0, y_0)$ 的线积分为 $f(x_0, y_0) - f(0, 0) = ax_0^2 + bx_0 y_0 + cy_0^2$。",
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
    {
      id: "a-potential-function-with-a-cubic-term",
      title: t("A potential function with a cubic term", "含三次项的势函数"),
      explanation: t(
        "To find $f$ with $\\nabla f = \\langle P, Q \\rangle$, integrate $P$ in $x$, which leaves an unknown $g(y)$, then match $f_y$ with $Q$. For $\\mathbf{F} = \\langle 3ax^2y + b, ax^3 + 2cy \\rangle$:\n\n$$f = \\int (3ax^2y + b)\\,dx = ax^3y + bx + g(y), \\qquad f_y = ax^3 + g'(y) = ax^3 + 2cy,$$\n\nso $g(y) = cy^2$ and $f = ax^3y + bx + cy^2$. The line integral from $A$ to $B$ is $f(B) - f(A)$.",
        "要求 $f$ 使 $\\nabla f = \\langle P, Q \\rangle$，先把 $P$ 对 $x$ 积分，留下未知的 $g(y)$，再让 $f_y$ 与 $Q$ 一致。对 $\\mathbf{F} = \\langle 3ax^2y + b, ax^3 + 2cy \\rangle$：\n\n$$f = \\int (3ax^2y + b)\\,dx = ax^3y + bx + g(y), \\qquad f_y = ax^3 + g'(y) = ax^3 + 2cy,$$\n\n所以 $g(y) = cy^2$，$f = ax^3y + bx + cy^2$。从 $A$ 到 $B$ 的线积分为 $f(B) - f(A)$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-2, 2);
        const b = rng.nonZero(-5, 5);
        const c = rng.nonZero(-3, 3);
        const x0 = rng.int(-2, 2);
        const y0 = rng.int(-2, 2);
        const x1 = rng.int(-2, 2);
        let y1 = rng.int(-2, 3);
        if (x1 === x0 && y1 === y0) y1 += 1;
        const f = (x: number, y: number) => a * x ** 3 * y + b * x + c * y * y;
        // f is quadratic in y, so at most two values of y repeat f(x0, y0), and this stops.
        while (f(x1, y1) === f(x0, y0)) y1 += 1;
        const ans = f(x1, y1) - f(x0, y0);
        const g = (x: number, y: number) => a * x ** 3 * y + c * y * y;
        return numberProblem({
          prompt: t(
            `$\\mathbf{F} = \\langle ${poly([3 * a, "x^2y"], [b, ""])}, ${poly([a, "x^3"], [2 * c, "y"])} \\rangle$. Find a potential function and evaluate $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ along any path from $(${x0}, ${y0})$ to $(${x1}, ${y1})$.`,
            `$\\mathbf{F} = \\langle ${poly([3 * a, "x^2y"], [b, ""])}, ${poly([a, "x^3"], [2 * c, "y"])} \\rangle$。求势函数，并沿从 $(${x0}, ${y0})$ 到 $(${x1}, ${y1})$ 的任意路径计算 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$。`,
          ),
          answer: ans,
          wrong: [-ans, g(x1, y1) - g(x0, y0), f(x1, y1) + f(x0, y0), ans + c],
          solution: t(
            `$f(x, y) = ${poly([a, "x^3y"], [b, "x"], [c, "y^2"])}$. Then $f(${x1}, ${y1}) = ${f(x1, y1)}$ and $f(${x0}, ${y0}) = ${f(x0, y0)}$, so the integral is $${ans}$.`,
            `$f(x, y) = ${poly([a, "x^3y"], [b, "x"], [c, "y^2"])}$。于是 $f(${x1}, ${y1}) = ${f(x1, y1)}$，$f(${x0}, ${y0}) = ${f(x0, y0)}$，积分为 $${ans}$。`,
          ),
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
        "The line integral of a gradient field depends only on the endpoints, so evaluate the potential at the end and the start and subtract. For $f(x, y, z) = ax^2 + by^2 + cz^2$, $\\int_C \\nabla f \\cdot d\\mathbf{r} = f(x_2, y_2, z_2) - f(x_1, y_1, z_1)$.",
        "梯度场的曲线积分只取决于端点，所以在终点和起点分别计算势函数再相减。对于势函数 $f(x, y, z) = ax^2 + by^2 + cz^2$，$\\int_C \\nabla f \\cdot d\\mathbf{r} = f(x_2, y_2, z_2) - f(x_1, y_1, z_1)$。",
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
    {
      id: "a-three-dimensional-potential-with-a-product-term",
      title: t("A three-dimensional potential with a product term", "含乘积项的三维势函数"),
      explanation: t(
        "In space, $\\int_C \\nabla f \\cdot d\\mathbf{r} = f(B) - f(A)$ just as in the plane. The field $\\mathbf{F} = \\langle ayz, axz, axy + 2bz \\rangle$ is the gradient of $f = axyz + bz^2$: differentiating $axyz$ gives $ayz$, $axz$ and $axy$, and $bz^2$ adds $2bz$ to the last component. So its line integral is a difference of two values of $axyz + bz^2$.",
        "在空间中同样有 $\\int_C \\nabla f \\cdot d\\mathbf{r} = f(B) - f(A)$。场 $\\mathbf{F} = \\langle ayz, axz, axy + 2bz \\rangle$ 是 $f = axyz + bz^2$ 的梯度：$axyz$ 的偏导为 $ayz$、$axz$ 与 $axy$，$bz^2$ 给最后一个分量加上 $2bz$。所以其线积分是 $axyz + bz^2$ 两个值之差。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const P0 = [rng.int(-2, 2), rng.int(-2, 2), rng.int(-2, 2)] as const;
        const P1 = [rng.int(-2, 3), rng.int(-2, 3), rng.int(1, 3)] as const;
        const f = (p: readonly [number, number, number]) => a * p[0] * p[1] * p[2] + b * p[2] * p[2];
        const ans = f(P1) - f(P0);
        const pt = (p: readonly [number, number, number]) => `(${p[0]}, ${p[1]}, ${p[2]})`;
        return numberProblem({
          prompt: t(
            `Evaluate $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ for $\\mathbf{F} = \\langle ${poly([a, "yz"])}, ${poly([a, "xz"])}, ${poly([a, "xy"], [2 * b, "z"])} \\rangle$ along any path from $${pt(P0)}$ to $${pt(P1)}$.`,
            `沿从 $${pt(P0)}$ 到 $${pt(P1)}$ 的任意路径，对 $\\mathbf{F} = \\langle ${poly([a, "yz"])}, ${poly([a, "xz"])}, ${poly([a, "xy"], [2 * b, "z"])} \\rangle$ 计算 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$。`,
          ),
          answer: ans,
          wrong: [-ans, f(P1), f(P1) + f(P0), ans + b * (P1[2] * P1[2] - P0[2] * P0[2])],
          solution: t(
            `$\\mathbf{F} = \\nabla f$ with $f = ${poly([a, "xyz"], [b, "z^2"])}$. $f${pt(P1)} = ${f(P1)}$ and $f${pt(P0)} = ${f(P0)}$, so the integral is $${ans}$.`,
            `$\\mathbf{F} = \\nabla f$，$f = ${poly([a, "xyz"], [b, "z^2"])}$。$f${pt(P1)} = ${f(P1)}$，$f${pt(P0)} = ${f(P0)}$，积分为 $${ans}$。`,
          ),
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
    {
      id: "kinetic-energy-after-moving-through-a-conservative-field",
      title: t("Kinetic energy after moving through a conservative field", "在保守场中运动后的动能"),
      explanation: t(
        "If the only force is $\\mathbf{F} = -\\nabla U$, its work from $A$ to $B$ is $U(A) - U(B)$, and by the work–energy theorem this equals the change in kinetic energy. So $K + U$ stays constant:\n\n$$K_B = K_A + U(A) - U(B), \\qquad K_A = \\tfrac12 m v_A^2.$$\n\nMoving to lower potential energy speeds the particle up.",
        "若唯一的力是 $\\mathbf{F} = -\\nabla U$，它从 $A$ 到 $B$ 做的功为 $U(A) - U(B)$，由动能定理这等于动能的变化。所以 $K + U$ 保持不变：\n\n$$K_B = K_A + U(A) - U(B), \\qquad K_A = \\tfrac12 m v_A^2。$$\n\n移向较低势能时质点加速。",
      ),
      generate(rng: Rng): Problem {
        const m = rng.pick([2, 4, 6]);
        const v = rng.int(1, 5);
        const KA = (m * v * v) / 2;
        const UA = rng.int(-10, 20);
        const UB = UA + rng.int(-15, KA - 1);
        const ans = KA + UA - UB;
        return numberProblem({
          prompt: t(
            `A particle of mass $${m}$ moves under a force $\\mathbf{F} = -\\nabla U$ alone. At $A$ its speed is $${v}$ and $U(A) = ${UA}$; at $B$, $U(B) = ${UB}$. Find its kinetic energy at $B$.`,
            `质量为 $${m}$ 的质点仅受力 $\\mathbf{F} = -\\nabla U$ 作用。在 $A$ 处速率为 $${v}$，$U(A) = ${UA}$；在 $B$ 处 $U(B) = ${UB}$。求它在 $B$ 处的动能。`,
          ),
          answer: ans,
          wrong: [KA + UB - UA, UA - UB, KA, m * v * v + UA - UB],
          solution: t(
            `$K_A = \\frac12 \\cdot ${m} \\cdot ${v}^2 = ${KA}$, and $K_B = K_A + U(A) - U(B) = ${KA} + ${paren(UA)} - ${paren(UB)} = ${ans}$.`,
            `$K_A = \\frac12 \\cdot ${m} \\cdot ${v}^2 = ${KA}$，$K_B = K_A + U(A) - U(B) = ${KA} + ${paren(UA)} - ${paren(UB)} = ${ans}$。`,
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Circulation and Flux
// ---------------------------------------------------------------------------

/** outwardPointingUnitNormalVectorsIn2D turns the tangent of a counterclockwise curve into its outward normal. */
export const outwardPointingUnitNormalVectorsIn2D: TopicDef = {
  id: "outward-pointing-unit-normal-vectors-in-2d",
  title: t("Outward-Pointing Unit Normal Vectors in 2D", "平面上指向外侧的单位法向量"),
  summary: t(
    "For a simple closed curve traversed counterclockwise with tangent $\\mathbf{r}'(t) = \\langle x'(t), y'(t) \\rangle$, the outward unit normal is $\\mathbf{n} = \\dfrac{\\langle y'(t), -x'(t) \\rangle}{\\lVert \\mathbf{r}'(t) \\rVert}$.",
    "对于沿逆时针方向遍历、切向量为 $\\mathbf{r}'(t) = \\langle x'(t), y'(t) \\rangle$ 的简单闭曲线，向外的单位法向量为 $\\mathbf{n} = \\dfrac{\\langle y'(t), -x'(t) \\rangle}{\\lVert \\mathbf{r}'(t) \\rVert}$。",
  ),
  prerequisites: ["unit-tangent-vectors", "simple-closed-and-oriented-curves"],
  encompasses: [{ topic: "unit-tangent-vectors", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "outward-normals-on-a-circle",
      title: t("Outward normals on a circle", "圆上的外法向量"),
      explanation: t(
        "When a closed curve is traversed counterclockwise, the region it encloses is always on the left, so turning the tangent a quarter turn clockwise makes it point away from the region. Turning $\\langle x', y' \\rangle$ clockwise gives $\\langle y', -x' \\rangle$; dividing by its length makes it a unit vector. For the circle $\\mathbf{r}(t) = \\langle R\\cos t, R\\sin t \\rangle$, $\\mathbf{r}'(t) = \\langle -R\\sin t, R\\cos t \\rangle$, so\n\n$$\\mathbf{n} = \\frac{\\langle R\\cos t, R\\sin t \\rangle}{R} = \\left\\langle \\frac{x}{R}, \\frac{y}{R} \\right\\rangle,$$\n\nthe position vector divided by the radius.",
        "沿逆时针方向遍历闭曲线时，它所围的区域总在左侧，所以把切向量顺时针旋转四分之一圈，就使它指向远离区域的方向。把 $\\langle x', y' \\rangle$ 顺时针旋转得到 $\\langle y', -x' \\rangle$，再除以它的长度就得到单位向量。对于圆 $\\mathbf{r}(t) = \\langle R\\cos t, R\\sin t \\rangle$，$\\mathbf{r}'(t) = \\langle -R\\sin t, R\\cos t \\rangle$，所以\n\n$$\\mathbf{n} = \\frac{\\langle R\\cos t, R\\sin t \\rangle}{R} = \\left\\langle \\frac{x}{R}, \\frac{y}{R} \\right\\rangle,$$\n\n即位置向量除以半径。",
      ),
      generate(rng: Rng): Problem {
        const [p, q, c] = rng.pick(pythagoreanTriples);
        const x = rng.sign() * p;
        const y = rng.sign() * q;
        const prompt = t(
          `The circle $x^2 + y^2 = ${c * c}$ is traversed counterclockwise. Find the outward-pointing unit normal vector at the point $(${x}, ${y})$.`,
          `圆 $x^2 + y^2 = ${c * c}$ 沿逆时针方向遍历。求它在点 $(${x}, ${y})$ 处指向外侧的单位法向量。`,
        );
        const n = `\\left\\langle ${Q.of(x, c).toLatex()}, ${Q.of(y, c).toLatex()} \\right\\rangle`;
        const solution = t(
          steps(
            `With $\\mathbf{r}(t) = \\langle ${c}\\cos t, ${c}\\sin t \\rangle$, the tangent is $\\langle -${c}\\sin t, ${c}\\cos t \\rangle = \\langle -y, x \\rangle$.`,
            `Turning it clockwise gives $\\langle x, y \\rangle = \\langle ${x}, ${y} \\rangle$, which has length $${c}$.`,
            `So $\\mathbf{n} = ${n}$, pointing away from the center.`,
          ),
          steps(
            `取 $\\mathbf{r}(t) = \\langle ${c}\\cos t, ${c}\\sin t \\rangle$，切向量为 $\\langle -${c}\\sin t, ${c}\\cos t \\rangle = \\langle -y, x \\rangle$。`,
            `把它顺时针旋转得到 $\\langle x, y \\rangle = \\langle ${x}, ${y} \\rangle$，长度为 $${c}$。`,
            `所以 $\\mathbf{n} = ${n}$，指向远离圆心的方向。`,
          ),
        );
        return pointProblem({
          prompt,
          solution,
          answer: [Q.of(x, c), Q.of(y, c)],
          vector: true,
          wrong: [
            [Q.of(-x, c), Q.of(-y, c)],
            [Q.of(-y, c), Q.of(x, c)],
            [x, y],
          ],
        });
      },
    },
    {
      id: "outward-normals-on-a-polygon",
      title: t("Outward normals on a polygon side", "多边形边上的外法向量"),
      explanation: t(
        "On a side of a polygon traversed counterclockwise, the tangent direction is the vector from the start of the side to its end. If that vector is $\\langle d_x, d_y \\rangle$, the outward unit normal is\n\n$$\\mathbf{n} = \\frac{\\langle d_y, -d_x \\rangle}{\\sqrt{d_x^2 + d_y^2}},$$\n\nthe same along the whole side, because a straight side never changes direction.",
        "沿逆时针方向遍历多边形时，一条边上的切线方向就是从该边起点指向终点的向量。若这个向量为 $\\langle d_x, d_y \\rangle$，则向外的单位法向量为\n\n$$\\mathbf{n} = \\frac{\\langle d_y, -d_x \\rangle}{\\sqrt{d_x^2 + d_y^2}},$$\n\n它在整条边上都相同，因为直边的方向从不改变。",
      ),
      generate(rng: Rng): Problem {
        const [p, q, c] = rng.pick(pythagoreanTriples);
        const dx = rng.sign() * p;
        const dy = rng.sign() * q;
        const x0 = rng.int(-4, 4);
        const y0 = rng.int(-4, 4);
        const prompt = t(
          `The boundary of a polygon is traversed counterclockwise, and one of its sides runs from $(${x0}, ${y0})$ to $(${x0 + dx}, ${y0 + dy})$. Find the outward-pointing unit normal vector on that side.`,
          `沿逆时针方向遍历一个多边形的边界，其中一条边从 $(${x0}, ${y0})$ 到 $(${x0 + dx}, ${y0 + dy})$。求这条边上指向外侧的单位法向量。`,
        );
        const n = `\\left\\langle ${Q.of(dy, c).toLatex()}, ${Q.of(-dx, c).toLatex()} \\right\\rangle`;
        const solution = t(
          steps(
            `The direction of the side is $\\langle ${dx}, ${dy} \\rangle$, of length $\\sqrt{${dx * dx} + ${dy * dy}} = ${c}$.`,
            `Turning it clockwise gives $\\langle ${dy}, ${-dx} \\rangle$.`,
            `So $\\mathbf{n} = ${n}$.`,
          ),
          steps(
            `这条边的方向为 $\\langle ${dx}, ${dy} \\rangle$，长度为 $\\sqrt{${dx * dx} + ${dy * dy}} = ${c}$。`,
            `把它顺时针旋转得到 $\\langle ${dy}, ${-dx} \\rangle$。`,
            `所以 $\\mathbf{n} = ${n}$。`,
          ),
        );
        return pointProblem({
          prompt,
          solution,
          answer: [Q.of(dy, c), Q.of(-dx, c)],
          vector: true,
          wrong: [
            [Q.of(-dy, c), Q.of(dx, c)],
            [Q.of(dx, c), Q.of(dy, c)],
            [dy, -dx],
          ],
        });
      },
    },
  ],
};

/** circulation measures how much a plane field flows along a closed curve. */
export const circulation: TopicDef = {
  id: "circulation",
  title: t("Circulation", "环量"),
  summary: t(
    "The circulation of $\\mathbf{F} = \\langle P, Q \\rangle$ around a closed curve $C$ is $\\oint_C \\mathbf{F} \\cdot \\mathbf{T}\\,ds = \\oint_C (P\\,dx + Q\\,dy)$: the net flow along the curve.",
    "向量场 $\\mathbf{F} = \\langle P, Q \\rangle$ 沿闭曲线 $C$ 的环量为 $\\oint_C \\mathbf{F} \\cdot \\mathbf{T}\\,ds = \\oint_C (P\\,dx + Q\\,dy)$，即沿曲线方向的净流动。",
  ),
  prerequisites: ["line-integrals-of-vector-valued-functions-over-general-curves"],
  encompasses: [{ topic: "line-integrals-of-vector-valued-functions-over-general-curves", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "circulation-around-a-rectangle",
      title: t("Circulation around a rectangle", "沿矩形的环量"),
      explanation: t(
        "Circulation is the line integral of the tangential component of the field around a closed curve, so it measures how strongly the field pushes along the curve. Around a rectangle, add the four sides: on a horizontal side only $P\\,dx$ contributes, and on a vertical side only $Q\\,dy$, with $dx < 0$ along the top and $dy < 0$ along the left side when traversing counterclockwise.",
        "环量是场的切向分量沿闭曲线的曲线积分，所以它衡量场沿曲线推动的强弱。沿矩形计算时把四条边相加：在水平边上只有 $P\\,dx$ 有贡献，在竖直边上只有 $Q\\,dy$ 有贡献；逆时针遍历时，顶边上 $dx < 0$，左边上 $dy < 0$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-6, 6);
        let b = rng.nonZero(-6, 6);
        if (b === a) b = a + 1;
        const W = rng.int(2, 6);
        const H = rng.int(2, 6);
        const ans = (b - a) * W * H;
        const prompt = t(
          `Find the circulation of $\\mathbf{F} = \\langle ${poly([a, "y"])}, ${poly([b, "x"])} \\rangle$ around the boundary of the rectangle $[0, ${W}] \\times [0, ${H}]$, traversed counterclockwise.`,
          `求 $\\mathbf{F} = \\langle ${poly([a, "y"])}, ${poly([b, "x"])} \\rangle$ 沿矩形 $[0, ${W}] \\times [0, ${H}]$ 的边界逆时针方向的环量。`,
        );
        const solution = t(
          steps(
            `Bottom ($y = 0$, $x$ from $0$ to $${W}$): $\\int P\\,dx = \\int_0^{${W}} 0\\,dx = 0$.`,
            `Right ($x = ${W}$, $y$ from $0$ to $${H}$): $\\int Q\\,dy = \\int_0^{${H}} ${b * W}\\,dy = ${b * W * H}$.`,
            `Top ($y = ${H}$, $x$ from $${W}$ to $0$): $\\int P\\,dx = \\int_{${W}}^0 ${a * H}\\,dx = ${-a * H * W}$.`,
            `Left ($x = 0$, $y$ from $${H}$ to $0$): $\\int Q\\,dy = 0$.`,
            `The circulation is $${b * W * H} + ${paren(-a * H * W)} = ${ans}$.`,
          ),
          steps(
            `底边（$y = 0$，$x$ 从 $0$ 到 $${W}$）：$\\int P\\,dx = \\int_0^{${W}} 0\\,dx = 0$。`,
            `右边（$x = ${W}$，$y$ 从 $0$ 到 $${H}$）：$\\int Q\\,dy = \\int_0^{${H}} ${b * W}\\,dy = ${b * W * H}$。`,
            `顶边（$y = ${H}$，$x$ 从 $${W}$ 到 $0$）：$\\int P\\,dx = \\int_{${W}}^0 ${a * H}\\,dx = ${-a * H * W}$。`,
            `左边（$x = 0$，$y$ 从 $${H}$ 到 $0$）：$\\int Q\\,dy = 0$。`,
            `环量为 $${b * W * H} + ${paren(-a * H * W)} = ${ans}$。`,
          ),
        );
        return numberProblem({ prompt, solution, answer: ans, wrong: [(a + b) * W * H, (a - b) * W * H, b * W * H] });
      },
    },
    {
      id: "circulation-around-a-circle",
      title: t("Circulation around a circle", "沿圆的环量"),
      explanation: t(
        "For a rotating field $\\mathbf{F} = \\langle -ky, kx \\rangle$ on the circle of radius $R$, the field is tangent to the circle with constant length $kR$, so $\\mathbf{F} \\cdot \\mathbf{T} = kR$ everywhere. The circulation is that constant times the length of the circle:\n\n$$\\oint_C \\mathbf{F} \\cdot \\mathbf{T}\\,ds = kR \\cdot 2\\pi R = 2\\pi k R^2.$$",
        "对于旋转场 $\\mathbf{F} = \\langle -ky, kx \\rangle$，在半径为 $R$ 的圆上，场与圆相切且长度恒为 $kR$，所以处处有 $\\mathbf{F} \\cdot \\mathbf{T} = kR$。环量就是这个常数乘以圆周长：\n\n$$\\oint_C \\mathbf{F} \\cdot \\mathbf{T}\\,ds = kR \\cdot 2\\pi R = 2\\pi k R^2。$$",
      ),
      generate(rng: Rng): Problem {
        const k = rng.nonZero(-5, 5);
        const R = rng.int(2, 6);
        const ans = 2 * k * R * R;
        const field = `\\langle ${poly([-k, "y"])}, ${poly([k, "x"])} \\rangle`;
        const prompt = t(
          `The circulation of $\\mathbf{F} = ${field}$ around the circle $x^2 + y^2 = ${R * R}$, traversed counterclockwise, equals $c\\pi$. Find $c$.`,
          `$\\mathbf{F} = ${field}$ 沿圆 $x^2 + y^2 = ${R * R}$ 逆时针方向的环量等于 $c\\pi$。求 $c$。`,
        );
        const solution = t(
          steps(
            `With $\\mathbf{r}(t) = \\langle ${R}\\cos t, ${R}\\sin t \\rangle$: $\\mathbf{F} = \\langle ${-k * R}\\sin t, ${k * R}\\cos t \\rangle$ and $\\mathbf{r}'(t) = \\langle -${R}\\sin t, ${R}\\cos t \\rangle$.`,
            `\\mathbf{F} \\cdot \\mathbf{r}'(t) = ${k * R * R}\\sin^2 t + ${paren(k * R * R)}\\cos^2 t = ${k * R * R}`,
            `\\oint_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_0^{2\\pi} ${k * R * R}\\,dt = ${ans}\\pi`,
            `So $c = ${ans}$.`,
          ),
          steps(
            `取 $\\mathbf{r}(t) = \\langle ${R}\\cos t, ${R}\\sin t \\rangle$：$\\mathbf{F} = \\langle ${-k * R}\\sin t, ${k * R}\\cos t \\rangle$，$\\mathbf{r}'(t) = \\langle -${R}\\sin t, ${R}\\cos t \\rangle$。`,
            `\\mathbf{F} \\cdot \\mathbf{r}'(t) = ${k * R * R}\\sin^2 t + ${paren(k * R * R)}\\cos^2 t = ${k * R * R}`,
            `\\oint_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_0^{2\\pi} ${k * R * R}\\,dt = ${ans}\\pi`,
            `所以 $c = ${ans}$。`,
          ),
        );
        return numberProblem({ prompt, solution, answer: ans, wrong: [k * R * R, 2 * k * R, -ans] });
      },
    },
    {
      id: "the-sign-of-the-circulation",
      title: t("The sign of the circulation", "环量的符号"),
      explanation: t(
        "Positive circulation around a counterclockwise curve means the field flows mostly with the direction of travel, negative means mostly against it, and zero means the flow along the curve cancels out, as it does for every gradient field.",
        "沿逆时针曲线的环量为正，表示场大体顺着行进方向流动；为负表示大体逆着行进方向；为零表示沿曲线的流动相互抵消，每个梯度场都是如此。",
      ),
      generate(rng: Rng): Problem {
        const kind = rng.pick(["positive", "negative", "zero"] as const);
        const k = rng.int(1, 5);
        const R = rng.int(1, 5);
        const field =
          kind === "positive"
            ? `\\langle ${poly([-k, "y"])}, ${poly([k, "x"])} \\rangle`
            : kind === "negative"
              ? `\\langle ${poly([k, "y"])}, ${poly([-k, "x"])} \\rangle`
              : `\\langle ${poly([2 * k, "x"])}, ${poly([2 * k, "y"])} \\rangle`;
        const options = [t("Positive", "正"), t("Negative", "负"), t("Zero", "零")];
        const correct = ["positive", "negative", "zero"].indexOf(kind);
        const prompt = t(
          `Is the circulation of $\\mathbf{F} = ${field}$ around the circle $x^2 + y^2 = ${R * R}$, traversed counterclockwise, positive, negative or zero?`,
          `$\\mathbf{F} = ${field}$ 沿圆 $x^2 + y^2 = ${R * R}$ 逆时针方向的环量是正、负还是零？`,
        );
        const reason =
          kind === "positive"
            ? t(
                `On the circle $\\mathbf{F} \\cdot \\mathbf{r}'(t) = ${k * R * R} > 0$: the field flows counterclockwise, with the direction of travel.`,
                `在圆上 $\\mathbf{F} \\cdot \\mathbf{r}'(t) = ${k * R * R} > 0$：场沿逆时针方向流动，与行进方向一致。`,
              )
            : kind === "negative"
              ? t(
                  `On the circle $\\mathbf{F} \\cdot \\mathbf{r}'(t) = ${-k * R * R} < 0$: the field flows clockwise, against the direction of travel.`,
                  `在圆上 $\\mathbf{F} \\cdot \\mathbf{r}'(t) = ${-k * R * R} < 0$：场沿顺时针方向流动，与行进方向相反。`,
                )
              : t(
                  `The field is the gradient of $${k}(x^2 + y^2)$ and points straight out of the circle, so $\\mathbf{F} \\cdot \\mathbf{T} = 0$ everywhere on it and the circulation is zero.`,
                  `这个场是 $${k}(x^2 + y^2)$ 的梯度，垂直指向圆外，所以在圆上处处有 $\\mathbf{F} \\cdot \\mathbf{T} = 0$，环量为零。`,
                );
        return choiceProblem({ prompt, options, correct, solution: reason });
      },
    },
  ],
};

/** fluxInTwoDimensionalVectorFields defines the flux of a plane field across a curve. */
export const fluxInTwoDimensionalVectorFields: TopicDef = {
  id: "flux-in-two-dimensional-vector-fields",
  title: t("Flux in Two-Dimensional Vector Fields", "二维向量场的通量"),
  summary: t(
    "The flux of $\\mathbf{F}$ across a curve $C$ is $\\int_C \\mathbf{F} \\cdot \\mathbf{n}\\,ds$, the rate at which the field crosses the curve in the direction of the normal $\\mathbf{n}$.",
    "$\\mathbf{F}$ 穿过曲线 $C$ 的通量为 $\\int_C \\mathbf{F} \\cdot \\mathbf{n}\\,ds$，即场沿法向量 $\\mathbf{n}$ 方向穿过曲线的速率。",
  ),
  prerequisites: ["outward-pointing-unit-normal-vectors-in-2d", "line-integrals-of-scalar-functions-over-line-segments"],
  encompasses: [{ topic: "outward-pointing-unit-normal-vectors-in-2d", weight: 0.4 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "flux-of-a-constant-field-across-a-segment",
      title: t("Flux of a constant field across a segment", "常向量场穿过线段的通量"),
      explanation: t(
        "Flux measures how much of the field crosses the curve rather than running along it, so it uses the normal component $\\mathbf{F} \\cdot \\mathbf{n}$. For a constant field and a straight segment both $\\mathbf{F}$ and $\\mathbf{n}$ are constant, so the flux is $\\mathbf{F} \\cdot \\mathbf{n}$ times the length. With direction $\\langle d_x, d_y \\rangle$ and $\\mathbf{n}$ on its right, this is $P\\,d_y - Q\\,d_x$.",
        "通量衡量的是场穿过曲线而不是沿曲线流动的部分，所以它使用法向分量 $\\mathbf{F} \\cdot \\mathbf{n}$。对于常向量场和直线段，$\\mathbf{F}$ 和 $\\mathbf{n}$ 都是常量，所以通量等于 $\\mathbf{F} \\cdot \\mathbf{n}$ 乘以长度。若方向为 $\\langle d_x, d_y \\rangle$ 且 $\\mathbf{n}$ 在其右侧，结果就是 $P\\,d_y - Q\\,d_x$。",
      ),
      generate(rng: Rng): Problem {
        const [p, q, c] = rng.pick(pythagoreanTriples);
        const dx = rng.sign() * p;
        const dy = rng.sign() * q;
        const P = rng.nonZero(-6, 6);
        const Qc = rng.nonZero(-6, 6);
        const ans = P * dy - Qc * dx;
        const prompt = t(
          `Find the flux of the constant field $\\mathbf{F} = \\langle ${P}, ${Qc} \\rangle$ across the segment from $(0, 0)$ to $(${dx}, ${dy})$, with $\\mathbf{n} = \\frac{1}{${c}}\\langle ${dy}, ${-dx} \\rangle$, the unit normal on the right of the direction of travel.`,
          `求常向量场 $\\mathbf{F} = \\langle ${P}, ${Qc} \\rangle$ 穿过从 $(0, 0)$ 到 $(${dx}, ${dy})$ 的线段的通量，其中 $\\mathbf{n} = \\frac{1}{${c}}\\langle ${dy}, ${-dx} \\rangle$ 是行进方向右侧的单位法向量。`,
        );
        const solution = t(
          steps(
            `\\mathbf{F} \\cdot \\mathbf{n} = \\frac{${P} \\cdot ${paren(dy)} + ${paren(Qc)} \\cdot ${paren(-dx)}}{${c}} = \\frac{${ans}}{${c}}`,
            `The segment has length $${c}$, so the flux is $\\frac{${ans}}{${c}} \\cdot ${c} = ${ans}$.`,
          ),
          steps(
            `\\mathbf{F} \\cdot \\mathbf{n} = \\frac{${P} \\cdot ${paren(dy)} + ${paren(Qc)} \\cdot ${paren(-dx)}}{${c}} = \\frac{${ans}}{${c}}`,
            `线段长度为 $${c}$，所以通量为 $\\frac{${ans}}{${c}} \\cdot ${c} = ${ans}$。`,
          ),
        );
        return numberProblem({ prompt, solution, answer: ans, wrong: [P * dx + Qc * dy, -ans, Q.of(ans, c)] });
      },
    },
    {
      id: "the-sign-of-the-flux",
      title: t("The sign of the outward flux", "外法向通量的符号"),
      explanation: t(
        "Positive outward flux across a closed curve means more of the field leaves the region than enters it, negative means more enters than leaves, and zero means the flow in and the flow out balance exactly.",
        "穿过闭曲线的外法向通量为正，表示离开区域的场多于进入的；为负表示进入的多于离开的；为零表示流入与流出恰好平衡。",
      ),
      generate(rng: Rng): Problem {
        const kind = rng.pick(["positive", "negative", "zero"] as const);
        const k = rng.int(1, 5);
        const R = rng.int(1, 5);
        const field =
          kind === "positive"
            ? `\\langle ${poly([k, "x"])}, ${poly([k, "y"])} \\rangle`
            : kind === "negative"
              ? `\\langle ${poly([-k, "x"])}, ${poly([-k, "y"])} \\rangle`
              : `\\langle ${poly([-k, "y"])}, ${poly([k, "x"])} \\rangle`;
        const options = [t("Positive", "正"), t("Negative", "负"), t("Zero", "零")];
        const correct = ["positive", "negative", "zero"].indexOf(kind);
        const prompt = t(
          `Is the outward flux of $\\mathbf{F} = ${field}$ across the circle $x^2 + y^2 = ${R * R}$ positive, negative or zero?`,
          `$\\mathbf{F} = ${field}$ 穿过圆 $x^2 + y^2 = ${R * R}$ 的外法向通量是正、负还是零？`,
        );
        const solution =
          kind === "zero"
            ? t(
                `The outward normal is $\\mathbf{n} = \\frac{1}{${R}}\\langle x, y \\rangle$, and $\\mathbf{F} \\cdot \\mathbf{n} = \\frac{${k}(-yx + xy)}{${R}} = 0$: the field runs along the circle and never crosses it.`,
                `外法向量为 $\\mathbf{n} = \\frac{1}{${R}}\\langle x, y \\rangle$，$\\mathbf{F} \\cdot \\mathbf{n} = \\frac{${k}(-yx + xy)}{${R}} = 0$：场沿着圆流动，从不穿过它。`,
              )
            : t(
                `The outward normal is $\\mathbf{n} = \\frac{1}{${R}}\\langle x, y \\rangle$, and $\\mathbf{F} \\cdot \\mathbf{n} = ${kind === "positive" ? "" : "-"}\\frac{${k}(x^2 + y^2)}{${R}} = ${kind === "positive" ? k * R : -k * R}$ everywhere on the circle, so the field points ${kind === "positive" ? "out of" : "into"} the disk and the flux is ${kind}.`,
                `外法向量为 $\\mathbf{n} = \\frac{1}{${R}}\\langle x, y \\rangle$，在圆上处处有 $\\mathbf{F} \\cdot \\mathbf{n} = ${kind === "positive" ? "" : "-"}\\frac{${k}(x^2 + y^2)}{${R}} = ${kind === "positive" ? k * R : -k * R}$，所以场指向圆盘${kind === "positive" ? "外" : "内"}，通量为${kind === "positive" ? "正" : "负"}。`,
              );
        return choiceProblem({ prompt, options, correct, solution });
      },
    },
  ],
};

/** calculatingFluxInTwoDimensionalVectorFields computes outward flux across closed plane curves. */
export const calculatingFluxInTwoDimensionalVectorFields: TopicDef = {
  id: "calculating-flux-in-two-dimensional-vector-fields",
  title: t("Calculating Flux in Two-Dimensional Vector Fields", "计算二维向量场的通量"),
  summary: t(
    "With $\\mathbf{n}\\,ds = \\langle dy, -dx \\rangle$ on a counterclockwise curve, the outward flux of $\\mathbf{F} = \\langle P, Q \\rangle$ is $\\oint_C (P\\,dy - Q\\,dx)$.",
    "在逆时针曲线上 $\\mathbf{n}\\,ds = \\langle dy, -dx \\rangle$，所以 $\\mathbf{F} = \\langle P, Q \\rangle$ 的外法向通量为 $\\oint_C (P\\,dy - Q\\,dx)$。",
  ),
  prerequisites: ["flux-in-two-dimensional-vector-fields", "line-integrals-with-respect-to-x-and-y"],
  encompasses: [{ topic: "flux-in-two-dimensional-vector-fields", weight: 0.5 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "outward-flux-across-a-rectangle",
      title: t("Outward flux across a rectangle", "穿过矩形的外法向通量"),
      explanation: t(
        "Since $\\mathbf{n}\\,ds = \\langle y'(t), -x'(t) \\rangle\\,dt = \\langle dy, -dx \\rangle$, the outward flux is $\\oint_C (P\\,dy - Q\\,dx)$. Around a rectangle, compute it side by side: the outward normal is $\\langle 1, 0 \\rangle$ on the right side, $\\langle -1, 0 \\rangle$ on the left, $\\langle 0, 1 \\rangle$ on top and $\\langle 0, -1 \\rangle$ on the bottom.",
        "由于 $\\mathbf{n}\\,ds = \\langle y'(t), -x'(t) \\rangle\\,dt = \\langle dy, -dx \\rangle$，外法向通量为 $\\oint_C (P\\,dy - Q\\,dx)$。沿矩形逐边计算：外法向量在右边为 $\\langle 1, 0 \\rangle$，左边为 $\\langle -1, 0 \\rangle$，顶边为 $\\langle 0, 1 \\rangle$，底边为 $\\langle 0, -1 \\rangle$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-5, 5);
        const b = rng.nonZero(-5, 5);
        const c = rng.nonZero(-4, 4);
        const W = rng.int(2, 6);
        const H = rng.int(2, 6);
        const ans = (a + b) * W * H;
        const field = `\\langle ${poly([a, "x"], [c, "y"])}, ${poly([b, "y"])} \\rangle`;
        const prompt = t(
          `Find the outward flux of $\\mathbf{F} = ${field}$ across the boundary of the rectangle $[0, ${W}] \\times [0, ${H}]$.`,
          `求 $\\mathbf{F} = ${field}$ 穿过矩形 $[0, ${W}] \\times [0, ${H}]$ 边界的外法向通量。`,
        );
        const solution = t(
          steps(
            `Right ($x = ${W}$, $\\mathbf{n} = \\langle 1, 0 \\rangle$): $\\int_0^{${H}} (${a * W} + ${paren(c)}y)\\,dy = ${Q.of(2 * a * W * H + c * H * H, 2).toLatex()}$.`,
            `Left ($x = 0$, $\\mathbf{n} = \\langle -1, 0 \\rangle$): $\\int_0^{${H}} -${paren(c)}y\\,dy = ${Q.of(-c * H * H, 2).toLatex()}$.`,
            `Top ($y = ${H}$, $\\mathbf{n} = \\langle 0, 1 \\rangle$): $\\int_0^{${W}} ${b * H}\\,dx = ${b * H * W}$. Bottom ($y = 0$): $Q = 0$, so $0$.`,
            `The terms from $${c}y$ cancel, and the flux is $${a * W * H} + ${paren(b * H * W)} = ${ans}$.`,
          ),
          steps(
            `右边（$x = ${W}$，$\\mathbf{n} = \\langle 1, 0 \\rangle$）：$\\int_0^{${H}} (${a * W} + ${paren(c)}y)\\,dy = ${Q.of(2 * a * W * H + c * H * H, 2).toLatex()}$。`,
            `左边（$x = 0$，$\\mathbf{n} = \\langle -1, 0 \\rangle$）：$\\int_0^{${H}} -${paren(c)}y\\,dy = ${Q.of(-c * H * H, 2).toLatex()}$。`,
            `顶边（$y = ${H}$，$\\mathbf{n} = \\langle 0, 1 \\rangle$）：$\\int_0^{${W}} ${b * H}\\,dx = ${b * H * W}$。底边（$y = 0$）：$Q = 0$，结果为 $0$。`,
            `来自 $${c}y$ 的项相互抵消，通量为 $${a * W * H} + ${paren(b * H * W)} = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [Q.of(2 * ans + c * H * H, 2), (a - b) * W * H, a * W * H],
        });
      },
    },
    {
      id: "outward-flux-across-a-circle",
      title: t("Outward flux across a circle", "穿过圆的外法向通量"),
      explanation: t(
        "On a circle, parametrize with $x = R\\cos t$, $y = R\\sin t$ for $0 \\le t \\le 2\\pi$, substitute into $\\oint_C (P\\,dy - Q\\,dx)$, and integrate in $t$. The averages $\\int_0^{2\\pi} \\cos^2 t\\,dt = \\int_0^{2\\pi} \\sin^2 t\\,dt = \\pi$ and $\\int_0^{2\\pi} \\sin t \\cos t\\,dt = 0$ do most of the work.",
        "在圆上，用 $x = R\\cos t$、$y = R\\sin t$（$0 \\le t \\le 2\\pi$）参数化，代入 $\\oint_C (P\\,dy - Q\\,dx)$ 后对 $t$ 积分。$\\int_0^{2\\pi} \\cos^2 t\\,dt = \\int_0^{2\\pi} \\sin^2 t\\,dt = \\pi$ 和 $\\int_0^{2\\pi} \\sin t \\cos t\\,dt = 0$ 这两个结果完成了大部分计算。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-5, 5);
        const b = rng.nonZero(-5, 5);
        const R = rng.int(1, 5);
        const ans = (a + b) * R * R;
        const field = `\\langle ${poly([a, "x"])}, ${poly([b, "y"])} \\rangle`;
        const prompt = t(
          `The outward flux of $\\mathbf{F} = ${field}$ across the circle $x^2 + y^2 = ${R * R}$ equals $c\\pi$. Find $c$.`,
          `$\\mathbf{F} = ${field}$ 穿过圆 $x^2 + y^2 = ${R * R}$ 的外法向通量等于 $c\\pi$。求 $c$。`,
        );
        const solution = t(
          steps(
            `With $x = ${R}\\cos t$, $y = ${R}\\sin t$: $P\\,dy = ${a * R * R}\\cos^2 t\\,dt$ and $-Q\\,dx = ${b * R * R}\\sin^2 t\\,dt$.`,
            `\\oint_C (P\\,dy - Q\\,dx) = \\int_0^{2\\pi} (${a * R * R}\\cos^2 t + ${paren(b * R * R)}\\sin^2 t)\\,dt = ${a * R * R}\\pi + ${paren(b * R * R)}\\pi = ${ans}\\pi`,
            `So $c = ${ans}$.`,
          ),
          steps(
            `取 $x = ${R}\\cos t$，$y = ${R}\\sin t$：$P\\,dy = ${a * R * R}\\cos^2 t\\,dt$，$-Q\\,dx = ${b * R * R}\\sin^2 t\\,dt$。`,
            `\\oint_C (P\\,dy - Q\\,dx) = \\int_0^{2\\pi} (${a * R * R}\\cos^2 t + ${paren(b * R * R)}\\sin^2 t)\\,dt = ${a * R * R}\\pi + ${paren(b * R * R)}\\pi = ${ans}\\pi`,
            `所以 $c = ${ans}$。`,
          ),
        );
        return numberProblem({ prompt, solution, answer: ans, wrong: [2 * ans, (a - b) * R * R, (a + b) * R] });
      },
    },
  ],
};

/** sourceFreeVectorFields identifies plane fields with zero divergence. */
export const sourceFreeVectorFields: TopicDef = {
  id: "source-free-vector-fields",
  title: t("Source-Free Vector Fields", "无源向量场"),
  summary: t(
    "A plane field $\\mathbf{F} = \\langle P, Q \\rangle$ is source-free when $\\nabla \\cdot \\mathbf{F} = P_x + Q_y = 0$; its outward flux across every simple closed curve is then zero.",
    "当 $\\nabla \\cdot \\mathbf{F} = P_x + Q_y = 0$ 时，平面向量场 $\\mathbf{F} = \\langle P, Q \\rangle$ 是无源的；这时它穿过每条简单闭曲线的外法向通量都为零。",
  ),
  prerequisites: ["the-divergence-of-a-vector-field", "calculating-flux-in-two-dimensional-vector-fields"],
  encompasses: [{ topic: "the-divergence-of-a-vector-field", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "recognizing-source-free-fields",
      title: t("Recognizing source-free fields", "识别无源场"),
      explanation: t(
        "The divergence measures how much a field spreads out from a point, so a field with zero divergence everywhere has no sources or sinks: whatever flows into a region also flows out. To test a field, compute $P_x + Q_y$ and check whether it is identically zero.",
        "散度衡量场从一点向外发散的程度，所以处处散度为零的场没有源也没有汇：流入一个区域的量也同样流出。要检验一个场，计算 $P_x + Q_y$，看它是否恒等于零。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-5, 5);
        const c = rng.nonZero(-5, 5);
        const d = rng.nonZero(-5, 5);
        const free = rng.bool();
        const b = free ? -a : rng.pick([a, 2 * a, -2 * a]);
        const field = `\\langle ${poly([a, "x"], [c, "y^2"])}, ${poly([b, "y"], [d, "x^2"])} \\rangle`;
        const prompt = t(`Is $\\mathbf{F} = ${field}$ source-free?`, `$\\mathbf{F} = ${field}$ 是无源场吗？`);
        const solution = t(
          steps(
            `P_x + Q_y = ${a} + ${paren(b)} = ${a + b}`,
            free
              ? `The divergence is $${a + b} = 0$ everywhere, so the field is source-free.`
              : `The divergence is $${a + b} \\ne 0$, so the field is not source-free.`,
          ),
          steps(
            `P_x + Q_y = ${a} + ${paren(b)} = ${a + b}`,
            free ? `散度处处为 $${a + b} = 0$，所以这个场是无源的。` : `散度为 $${a + b} \\ne 0$，所以这个场不是无源的。`,
          ),
        );
        return choiceProblem({ prompt, options: yesNo, correct: free ? 0 : 1, solution });
      },
    },
    {
      id: "making-a-field-source-free",
      title: t("Making a field source-free", "使向量场无源"),
      explanation: t(
        "To choose a constant that makes a field source-free, write the divergence $P_x + Q_y$ in terms of the constant and pick the value that makes it vanish for every point $(x, y)$.",
        "要选取一个常数使向量场无源，就把散度 $P_x + Q_y$ 用这个常数表示出来，再选出使它对每个点 $(x, y)$ 都为零的值。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-5, 5);
        const c = rng.nonZero(-5, 5);
        const ans = -2 * a;
        const field = `\\langle ${poly([a, "x^2"], [c, "y"])}, kxy \\rangle`;
        const prompt = t(
          `Find the constant $k$ for which $\\mathbf{F} = ${field}$ is source-free.`,
          `求常数 $k$，使 $\\mathbf{F} = ${field}$ 为无源场。`,
        );
        const solution = t(
          steps(`P_x + Q_y = ${2 * a}x + kx = (${2 * a} + k)x`, `This is zero for every $x$ exactly when $k = ${ans}$.`),
          steps(`P_x + Q_y = ${2 * a}x + kx = (${2 * a} + k)x`, `它对每个 $x$ 都为零，当且仅当 $k = ${ans}$。`),
        );
        return numberProblem({ prompt, solution, answer: ans, solveFor: "k", wrong: [2 * a, -a, a] });
      },
    },
    {
      id: "balanced-flux-of-source-free-fields",
      title: t("Balanced flux of a source-free field", "无源场的通量平衡"),
      explanation: t(
        "A source-free field creates and destroys nothing inside a region, so its net outward flux across a simple closed curve is zero, a fact Green's theorem will prove. If the boundary is made of several pieces, the outward fluxes across the pieces add up to zero, which lets you find a missing one.",
        "无源场在区域内既不产生也不消灭任何东西，所以它穿过简单闭曲线的净外法向通量为零，这一事实将由格林公式证明。如果边界由若干段组成，各段的外法向通量之和为零，由此可以求出缺少的那一段。",
      ),
      generate(rng: Rng): Problem {
        const f1 = rng.nonZero(-12, 12);
        const f2 = rng.nonZero(-12, 12);
        const f3 = rng.nonZero(-12, 12);
        const ans = -(f1 + f2 + f3);
        const prompt = t(
          `A source-free field $\\mathbf{F}$ has outward fluxes $${f1}$, $${f2}$ and $${f3}$ across three sides of a square. Find its outward flux across the fourth side.`,
          `无源场 $\\mathbf{F}$ 穿过一个正方形三条边的外法向通量分别为 $${f1}$、$${f2}$ 和 $${f3}$。求它穿过第四条边的外法向通量。`,
        );
        const solution = t(
          steps(
            `The net outward flux of a source-free field across the boundary is $0$.`,
            `${f1} + ${paren(f2)} + ${paren(f3)} + x = 0`,
            `So $x = ${ans}$.`,
          ),
          steps(`无源场穿过边界的净外法向通量为 $0$。`, `${f1} + ${paren(f2)} + ${paren(f3)} + x = 0`, `所以 $x = ${ans}$。`),
        );
        return numberProblem({ prompt, solution, answer: ans, wrong: [f1 + f2 + f3, 0, -(f1 + f2)] });
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
  prerequisites: ["circulation", "calculating-flux-in-two-dimensional-vector-fields"],
  encompasses: [
    { topic: "circulation", weight: 0.3 },
    { topic: "calculating-flux-in-two-dimensional-vector-fields", weight: 0.3 },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "circulation-form-vs-flux-form",
      title: t("Circulation form vs flux form", "环量形式与通量形式的线积分表达式"),
      explanation: t(
        "Circulation measures flow along the curve using the tangent direction, while flux measures flow across the curve using the outward normal direction. For $\\mathbf{F} = \\langle P, Q \\rangle$:\n- **Circulation**: $\\oint_C \\mathbf{F} \\cdot \\mathbf{T}\\,ds = \\oint_C (P\\,dx + Q\\,dy)$.\n- **Outward Flux**: $\\oint_C \\mathbf{F} \\cdot \\mathbf{n}\\,ds = \\oint_C (P\\,dy - Q\\,dx)$.",
        "环量用切线方向衡量沿曲线的流动，通量则用外法线方向衡量穿过曲线的流动。对于平面向量场 $\\mathbf{F} = \\langle P, Q \\rangle$：\n- **环量**：$\\oint_C \\mathbf{F} \\cdot \\mathbf{T}\\,ds = \\oint_C (P\\,dx + Q\\,dy)$。\n- **外法向通量**：$\\oint_C \\mathbf{F} \\cdot \\mathbf{n}\\,ds = \\oint_C (P\\,dy - Q\\,dx)$。",
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
    {
      id: "circulation-around-a-rectangle-edge-by-edge",
      title: t("Circulation around a rectangle edge by edge", "逐边计算绕矩形的环量"),
      explanation: t(
        "The counterclockwise circulation $\\oint_C P\\,dx + Q\\,dy$ around the rectangle $[0, w] \\times [0, h]$ is the sum over its four edges. For $\\mathbf{F} = \\langle ay, bx \\rangle$: the bottom edge has $y = 0$ and the left edge has $x = 0$, so both give $0$. The right edge, going up at $x = w$, gives $\\int_0^h bw\\,dy = bwh$. The top edge, going left at $y = h$, gives $\\int_w^0 ah\\,dx = -awh$. The circulation is $(b - a)wh$.",
        "绕矩形 $[0, w] \\times [0, h]$ 的逆时针环量 $\\oint_C P\\,dx + Q\\,dy$ 是四条边之和。对 $\\mathbf{F} = \\langle ay, bx \\rangle$：底边 $y = 0$，左边 $x = 0$，都贡献 $0$。右边在 $x = w$ 向上，贡献 $\\int_0^h bw\\,dy = bwh$。顶边在 $y = h$ 向左，贡献 $\\int_w^0 ah\\,dx = -awh$。环量为 $(b - a)wh$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-5, 5);
        let b = rng.nonZero(-5, 5);
        if (b === a) b = -a;
        const w = rng.int(1, 6);
        const h = rng.int(1, 6);
        const ans = (b - a) * w * h;
        return numberProblem({
          prompt: t(
            `Find the counterclockwise circulation of $\\mathbf{F} = \\langle ${poly([a, "y"])}, ${poly([b, "x"])} \\rangle$ around the boundary of the rectangle $0 \\le x \\le ${w}$, $0 \\le y \\le ${h}$.`,
            `求 $\\mathbf{F} = \\langle ${poly([a, "y"])}, ${poly([b, "x"])} \\rangle$ 绕矩形 $0 \\le x \\le ${w}$，$0 \\le y \\le ${h}$ 边界的逆时针环量。`,
          ),
          answer: ans,
          wrong: [(a + b) * w * h, (a - b) * w * h, b * w * h, (b - a) * (w + h)],
          solution: t(
            `Bottom and left edges give $0$. Right edge: $${paren(b)} \\cdot ${w} \\cdot ${h} = ${b * w * h}$. Top edge (leftward): $-${paren(a)} \\cdot ${h} \\cdot ${w} = ${-a * w * h}$. Total: $${ans}$.`,
            `底边与左边贡献 $0$。右边：$${paren(b)} \\cdot ${w} \\cdot ${h} = ${b * w * h}$。顶边（向左）：$-${paren(a)} \\cdot ${h} \\cdot ${w} = ${-a * w * h}$。合计：$${ans}$。`,
          ),
        });
      },
    },
  ],
};

/** greensTheoremInCirculationCurlForm connects circulation to the curl double integral. */
export const greensTheoremInCirculationCurlForm: TopicDef = {
  id: "greens-theorem-in-circulation-curl-form",
  title: t("Introduction to Green's Theorem", "格林公式简介"),
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
        "Green's theorem trades the circulation around a closed curve for a double integral of the curl over the region inside it, which is often easier. By Green's theorem:\n\n$$\\oint_C (P\\,dx + Q\\,dy) = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right)dA.$$ For $P = 0, Q = kx$ over a rectangle of area $A$, $\\oint_C kx\\,dy = kA$.",
        "格林公式把沿闭曲线的环量换成在其内部区域上旋度的二重积分，后者往往更容易计算。由格林公式：\n\n$$\\oint_C (P\\,dx + Q\\,dy) = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right)dA。$$ 当 $P = 0, Q = kx$ 且区域为面积为 $A$ 的矩形时，$\\oint_C kx\\,dy = kA$。",
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
    {
      id: "circulation-around-a-circle-by-greens-theorem",
      title: t("Circulation around a circle by Green's theorem", "用格林定理求绕圆的环量"),
      explanation: t(
        "Green's theorem turns a counterclockwise circulation into a double integral of the scalar curl:\n\n$$\\oint_C P\\,dx + Q\\,dy = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right) dA.$$\n\nTerms such as $x^2$ in $P$ or $y^3$ in $Q$ drop out of the curl. For $P = -ay + x^2$, $Q = bx + y^3$ the curl is the constant $a + b$, so the circulation around a circle of radius $R$ is $(a + b)\\pi R^2$.",
        "格林定理把逆时针环量化为标量旋度的二重积分：\n\n$$\\oint_C P\\,dx + Q\\,dy = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right) dA。$$\n\n$P$ 中的 $x^2$ 或 $Q$ 中的 $y^3$ 这类项在旋度中消失。对 $P = -ay + x^2$，$Q = bx + y^3$，旋度为常数 $a + b$，所以绕半径 $R$ 的圆的环量为 $(a + b)\\pi R^2$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const b = rng.int(1, 5);
        const R = rng.int(1, 4);
        const ans = (a + b) * R * R;
        return numberProblem({
          prompt: t(
            `Use Green's theorem to find $\\frac{1}{\\pi}\\oint_C (${poly([-a, "y"], [1, "x^2"])})\\,dx + (${poly([b, "x"], [1, "y^3"])})\\,dy$, where $C$ is the circle $x^2 + y^2 = ${R * R}$ counterclockwise.`,
            `用格林定理求 $\\frac{1}{\\pi}\\oint_C (${poly([-a, "y"], [1, "x^2"])})\\,dx + (${poly([b, "x"], [1, "y^3"])})\\,dy$，$C$ 为逆时针方向的圆 $x^2 + y^2 = ${R * R}$。`,
          ),
          answer: ans,
          wrong: [(b - a) * R * R, (a + b) * R, 2 * (a + b) * R * R, (a + b) * R * R + 2 * R],
          solution: t(
            `$\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = ${b} - (-${a}) = ${a + b}$, and the disk has area $${R === 1 ? "" : R * R}\\pi$. So the circulation is $${ans}\\pi$, and dividing by $\\pi$ gives $${ans}$.`,
            `$\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = ${b} - (-${a}) = ${a + b}$，圆盘面积为 $${R === 1 ? "" : R * R}\\pi$。所以环量为 $${ans}\\pi$，除以 $\\pi$ 得 $${ans}$。`,
          ),
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
        "Once Green's theorem turns the circulation into a double integral, polar coordinates make the integral over the disk straightforward. For $\\mathbf{F} = \\langle -a y^3, a x^3 \\rangle$ the curl integrand is $Q_x - P_y = 3a x^2 + 3a y^2 = 3a r^2$. Over the disk of radius $R$, remember the factor $r$ in $dA = r\\,dr\\,d\\theta$:\n\n$$\\oint_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_0^{2\\pi}\\int_0^R 3a r^2 \\cdot r\\,dr\\,d\\theta = 2\\pi \\cdot \\frac{3a R^4}{4} = \\frac{3a\\pi R^4}{2}.$$",
        "格林公式把环量化为二重积分后，用极坐标计算圆盘上的积分就很直接。对 $\\mathbf{F} = \\langle -a y^3, a x^3 \\rangle$，旋度被积函数为 $Q_x - P_y = 3a x^2 + 3a y^2 = 3a r^2$。在半径为 $R$ 的圆盘上积分时，别忘了 $dA = r\\,dr\\,d\\theta$ 中的因子 $r$：\n\n$$\\oint_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_0^{2\\pi}\\int_0^R 3a r^2 \\cdot r\\,dr\\,d\\theta = 2\\pi \\cdot \\frac{3a R^4}{4} = \\frac{3a\\pi R^4}{2}。$$",
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
  title: t("Using Green's Theorem to Calculate Area", "应用格林公式计算平面区域面积"),
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
        "Choosing a field whose curl is one makes the double integral equal to the area, so the area can be computed from a line integral around the boundary. Setting $P = -\\frac{y}{2}$ and $Q = \\frac{x}{2}$ yields $\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = 1$, giving the area formula:\n\n$$\\text{Area}(D) = \\frac{1}{2}\\oint_C (x\\,dy - y\\,dx).$$",
        "选择旋度为 1 的向量场，使二重积分等于面积，这样就能由沿边界的曲线积分算出面积。取 $P = -\\frac{y}{2}$ 与 $Q = \\frac{x}{2}$ 可得 $\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = 1$，从而得到面积公式：\n\n$$\\text{Area}(D) = \\frac{1}{2}\\oint_C (x\\,dy - y\\,dx)。$$",
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
    {
      id: "the-area-of-a-triangle-from-a-boundary-integral",
      title: t("The area of a triangle from a boundary integral", "用边界积分求三角形面积"),
      explanation: t(
        "Green's theorem gives the area of a region as $A = \\frac12\\oint_C x\\,dy - y\\,dx$ around its counterclockwise boundary. Along a segment through the origin, $x\\,dy - y\\,dx = 0$, because the point moves straight away from or toward the origin. For the triangle with vertices $(0, 0)$, $(a, b)$, $(c, d)$ only the edge from $(a, b)$ to $(c, d)$ contributes, and it gives $ad - bc$. So\n\n$$A = \\tfrac12(ad - bc)$$\n\nwhen the vertices are in counterclockwise order.",
        "格林定理给出区域面积 $A = \\frac12\\oint_C x\\,dy - y\\,dx$，沿逆时针边界积分。沿过原点的线段，$x\\,dy - y\\,dx = 0$，因为点径直远离或接近原点。对顶点为 $(0, 0)$、$(a, b)$、$(c, d)$ 的三角形，只有从 $(a, b)$ 到 $(c, d)$ 的边有贡献，其值为 $ad - bc$。所以当顶点为逆时针顺序时\n\n$$A = \\tfrac12(ad - bc)。$$",
      ),
      generate(rng: Rng): Problem {
        let a = rng.int(1, 6);
        let b = rng.int(-3, 3);
        let c = rng.int(-3, 4);
        let d = rng.int(1, 6);
        if (a * d - b * c <= 0) {
          [a, b, c, d] = [a + 2, b, c, d + 2];
          if (a * d - b * c <= 0) [b, c] = [0, 0];
        }
        const det = a * d - b * c;
        const ans = Q.of(det, 2);
        return numberProblem({
          prompt: t(
            `Use $A = \\frac12\\oint_C x\\,dy - y\\,dx$ to find the area of the triangle with vertices $(0, 0)$, $(${a}, ${b})$ and $(${c}, ${d})$.`,
            `用 $A = \\frac12\\oint_C x\\,dy - y\\,dx$ 求顶点为 $(0, 0)$、$(${a}, ${b})$、$(${c}, ${d})$ 的三角形面积。`,
          ),
          answer: ans,
          wrong: [Q.of(det), Q.of(a * d + b * c, 2), Q.of(a * c + b * d, 2), Q.of(a * d, 2)],
          solution: t(
            `The two edges through the origin contribute $0$. The edge from $(${a}, ${b})$ to $(${c}, ${d})$ gives $${a} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(c)} = ${det}$. So $A = \\frac12 \\cdot ${det} = ${ans.toLatex()}$.`,
            `过原点的两条边贡献 $0$。从 $(${a}, ${b})$ 到 $(${c}, ${d})$ 的边给出 $${a} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(c)} = ${det}$。所以 $A = \\frac12 \\cdot ${det} = ${ans.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** greensTheoremInFluxDivergenceForm connects outward flux to the divergence double integral. */
export const greensTheoremInFluxDivergenceForm: TopicDef = {
  id: "greens-theorem-in-flux-divergence-form",
  title: t("Green's Theorem in Flux Form", "格林公式的通量形式"),
  summary: t(
    "The flux form of Green's theorem equates the outward flux across $C$ to the double integral of the divergence: $\\oint_C (P\\,dy - Q\\,dx) = \\iint_D (P_x + Q_y)\\,dA$.",
    "格林公式的通量形式把穿过 $C$ 的向外通量与散度的二重积分联系起来：$\\oint_C (P\\,dy - Q\\,dx) = \\iint_D (P_x + Q_y)\\,dA$。",
  ),
  prerequisites: ["greens-theorem-in-circulation-curl-form", "the-divergence-of-a-vector-field"],
  encompasses: [{ topic: "the-divergence-of-a-vector-field", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "two-dimensional-divergence-theorem",
      title: t("Two-dimensional divergence theorem", "应用二维散度定理计算通量"),
      explanation: t(
        "The flux form of Green's theorem says that the net flow out through the boundary equals the total divergence inside the region. Green's theorem in flux form states:\n\n$$\\oint_C \\mathbf{F} \\cdot \\mathbf{n}\\,ds = \\oint_C (P\\,dy - Q\\,dx) = \\iint_D \\text{div}\\,\\mathbf{F}\\,dA = \\iint_D \\left(\\frac{\\partial P}{\\partial x} + \\frac{\\partial Q}{\\partial y}\\right)dA.$$",
        "格林公式的通量形式说明，穿过边界向外的净流量等于区域内散度的总和。通量形式的格林公式（平面散度定理）表明：\n\n$$\\oint_C \\mathbf{F} \\cdot \\mathbf{n}\\,ds = \\oint_C (P\\,dy - Q\\,dx) = \\iint_D \\text{div}\\,\\mathbf{F}\\,dA = \\iint_D \\left(\\frac{\\partial P}{\\partial x} + \\frac{\\partial Q}{\\partial y}\\right)dA。$$",
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
    {
      id: "outward-flux-with-a-variable-divergence",
      title: t("Outward flux with a variable divergence", "散度不为常数时的向外通量"),
      explanation: t(
        "In flux form, Green's theorem says the outward flux across a closed curve equals the integral of the divergence over the enclosed region:\n\n$$\\oint_C \\mathbf{F} \\cdot \\mathbf{n}\\,ds = \\iint_D \\left(\\frac{\\partial P}{\\partial x} + \\frac{\\partial Q}{\\partial y}\\right) dA.$$\n\nWhen the divergence is not constant, evaluate the double integral as an iterated integral. For $\\mathbf{F} = \\langle x^2, ky \\rangle$ on $[0, w] \\times [0, h]$ the divergence is $2x + k$, and\n\n$$\\int_0^h \\int_0^w (2x + k)\\,dx\\,dy = w^2h + kwh.$$",
        "通量形式的格林定理说，穿过闭曲线的向外通量等于散度在所围区域上的积分：\n\n$$\\oint_C \\mathbf{F} \\cdot \\mathbf{n}\\,ds = \\iint_D \\left(\\frac{\\partial P}{\\partial x} + \\frac{\\partial Q}{\\partial y}\\right) dA。$$\n\n散度不是常数时，把二重积分化为累次积分。对 $\\mathbf{F} = \\langle x^2, ky \\rangle$ 在 $[0, w] \\times [0, h]$ 上，散度为 $2x + k$，\n\n$$\\int_0^h \\int_0^w (2x + k)\\,dx\\,dy = w^2h + kwh。$$",
      ),
      generate(rng: Rng): Problem {
        const k = rng.nonZero(-4, 5);
        const w = rng.int(1, 5);
        const h = rng.int(1, 5);
        const ans = w * w * h + k * w * h;
        return numberProblem({
          prompt: t(
            `Find the outward flux of $\\mathbf{F} = \\langle x^2, ${poly([k, "y"])} \\rangle$ across the boundary of the rectangle $0 \\le x \\le ${w}$, $0 \\le y \\le ${h}$.`,
            `求 $\\mathbf{F} = \\langle x^2, ${poly([k, "y"])} \\rangle$ 穿过矩形 $0 \\le x \\le ${w}$，$0 \\le y \\le ${h}$ 边界的向外通量。`,
          ),
          answer: ans,
          wrong: [k * w * h, 2 * w * w * h + k * w * h, (2 * w + k) * w * h, w * w * h - k * w * h],
          solution: t(
            `$\\nabla \\cdot \\mathbf{F} = ${poly([2, "x"], [k, ""])}$. Then $\\int_0^{${h}} \\int_0^{${w}} (${poly([2, "x"], [k, ""])})\\,dx\\,dy = ${h}(${w * w} + ${paren(k * w)}) = ${ans}$.`,
            `$\\nabla \\cdot \\mathbf{F} = ${poly([2, "x"], [k, ""])}$。于是 $\\int_0^{${h}} \\int_0^{${w}} (${poly([2, "x"], [k, ""])})\\,dx\\,dy = ${h}(${w * w} + ${paren(k * w)}) = ${ans}$。`,
          ),
        });
      },
    },
  ],
};

/** greensTheoremOnRegionsWithHoles extends Green's theorem to multiply-connected domains. */
export const greensTheoremOnRegionsWithHoles: TopicDef = {
  id: "greens-theorem-on-regions-with-holes",
  title: t("Extending Green's Theorem", "格林公式的推广：复连通区域"),
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
        "For a region with a hole, the boundary has two parts, and the inner one is traversed in the opposite direction so that the region stays on the left. For an annular region $D$ between outer boundary $C_1$ and inner boundary $C_2$ (both oriented counterclockwise):\n\n$$\\oint_{C_1} \\mathbf{F} \\cdot d\\mathbf{r} - \\oint_{C_2} \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right)dA.$$",
        "对于有洞的区域，边界有两部分，内边界要反向绕行，使区域始终在左侧。对于由外边界 $C_1$ 与内边界 $C_2$（均按逆时针定向）围成的环形区域 $D$：\n\n$$\\oint_{C_1} \\mathbf{F} \\cdot d\\mathbf{r} - \\oint_{C_2} \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right)dA。$$",
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
    {
      id: "an-outer-circulation-from-an-inner-one",
      title: t("Finding an outer circulation from an inner one", "由内边界环量求外边界环量"),
      explanation: t(
        "On an annulus $D$ between an inner circle $C_1$ and an outer circle $C_2$, both counterclockwise, Green's theorem reads\n\n$$\\oint_{C_2} \\mathbf{F} \\cdot d\\mathbf{r} - \\oint_{C_1} \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right) dA,$$\n\nbecause the inner circle must be traversed clockwise to keep $D$ on the left. Even if $\\mathbf{F}$ is not defined at the origin, knowing the inner circulation and the curl on $D$ determines the outer one. With constant curl $c$ the right side is $c\\pi(r_2^2 - r_1^2)$.",
        "在内圆 $C_1$ 与外圆 $C_2$（都取逆时针）之间的圆环 $D$ 上，格林定理为\n\n$$\\oint_{C_2} \\mathbf{F} \\cdot d\\mathbf{r} - \\oint_{C_1} \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right) dA,$$\n\n因为内圆必须顺时针遍历才能使 $D$ 在左侧。即使 $\\mathbf{F}$ 在原点无定义，已知内环量和 $D$ 上的旋度就能确定外环量。旋度为常数 $c$ 时右边为 $c\\pi(r_2^2 - r_1^2)$。",
      ),
      generate(rng: Rng): Problem {
        const r1 = rng.int(1, 3);
        const r2 = r1 + rng.int(1, 3);
        const c = rng.nonZero(-3, 4);
        const m = rng.nonZero(-6, 6);
        const ring = c * (r2 * r2 - r1 * r1);
        const ans = m + ring;
        return numberProblem({
          prompt: t(
            `$\\mathbf{F}$ is not defined at the origin, and $\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = ${c}$ everywhere else. Its counterclockwise circulation around $x^2 + y^2 = ${r1 * r1}$ is $${m === 1 ? "" : m === -1 ? "-" : m}\\pi$. Find $\\frac{1}{\\pi}$ times its counterclockwise circulation around $x^2 + y^2 = ${r2 * r2}$.`,
            `$\\mathbf{F}$ 在原点无定义，在其他地方 $\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = ${c}$。它绕 $x^2 + y^2 = ${r1 * r1}$ 的逆时针环量为 $${m === 1 ? "" : m === -1 ? "-" : m}\\pi$。求它绕 $x^2 + y^2 = ${r2 * r2}$ 的逆时针环量的 $\\frac{1}{\\pi}$ 倍。`,
          ),
          answer: ans,
          wrong: [ring, m - ring, m + c * r2 * r2, m + c * (r2 * r2 + r1 * r1)],
          solution: t(
            `The annulus has area $(${r2 * r2} - ${r1 * r1})\\pi$, so $\\oint_{C_2} - \\oint_{C_1} = ${c} \\cdot ${r2 * r2 - r1 * r1}\\pi = ${ring}\\pi$. Then $\\oint_{C_2} = (${m} + ${paren(ring)})\\pi = ${ans}\\pi$, giving $${ans}$.`,
            `圆环面积为 $(${r2 * r2} - ${r1 * r1})\\pi$，所以 $\\oint_{C_2} - \\oint_{C_1} = ${c} \\cdot ${r2 * r2 - r1 * r1}\\pi = ${ring}\\pi$。于是 $\\oint_{C_2} = (${m} + ${paren(ring)})\\pi = ${ans}\\pi$，结果为 $${ans}$。`,
          ),
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

  // Circulation and Flux
  outwardPointingUnitNormalVectorsIn2D,
  circulation,
  fluxInTwoDimensionalVectorFields,
  calculatingFluxInTwoDimensionalVectorFields,
  sourceFreeVectorFields,

  // 4.23 Green's Theorem
  circulationAndFluxAcrossSimpleClosedPlaneCurves,
  greensTheoremInCirculationCurlForm,
  greensTheoremInPolarCoordinates,
  calculatingAreasUsingGreensTheorem,
  greensTheoremInFluxDivergenceForm,
  greensTheoremOnRegionsWithHoles,
];
