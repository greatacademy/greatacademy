import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { choiceProblem } from "../problems.ts";

// Precalculus units 8 & 9: Parametric Equations and Polar Coordinates
// (Module 8.28: Parametric Equations; Module 9.29: Polar Coordinates).

function oneOf(rng: Rng, prompt: Text, right: Text, wrong: readonly Text[], solution: Text): Problem {
  const seen = new Set([right.en]);
  const rest: Text[] = [];
  for (const w of wrong) {
    if (!seen.has(w.en)) {
      seen.add(w.en);
      rest.push(w);
    }
  }
  const options = [right, ...rest.slice(0, 3)];
  const order = rng.shuffle(options.map((_, i) => i));
  return choiceProblem({ prompt, options: order.map((i) => options[i]!), correct: order.indexOf(0), solution });
}

function sgnTerm(n: number): string {
  if (n === 0) return "";
  return n > 0 ? `+ ${n}` : `- ${Math.abs(n)}`;
}

function linExpr(a: number, b: number, v = "t"): string {
  let res = "";
  if (a === 1) res = v;
  else if (a === -1) res = `-${v}`;
  else if (a !== 0) res = `${a}${v}`;

  if (b !== 0) {
    if (res === "") res = `${b}`;
    else res += b > 0 ? ` + ${b}` : ` - ${Math.abs(b)}`;
  } else if (res === "") {
    res = "0";
  }
  return res;
}

function sq(v: string, h: number): string {
  if (h === 0) return `${v}^2`;
  if (h > 0) return `(${v} - ${h})^2`;
  return `(${v} + ${Math.abs(h)})^2`;
}

function lin(v: string, h: number): string {
  if (h === 0) return v;
  if (h > 0) return `(${v} - ${h})`;
  return `(${v} + ${Math.abs(h)})`;
}

function trigTerm(h: number, c: number, trig: string): string {
  if (c === 0) return `${h}`;
  const cAbs = Math.abs(c);
  const coeff = cAbs === 1 ? trig : `${cAbs}${trig}`;
  if (h === 0) return c < 0 ? `-${coeff}` : coeff;
  return c < 0 ? `${h} - ${coeff}` : `${h} + ${coeff}`;
}

// ─── 8.28.1 Graphing Curves Defined Parametrically ──────────────────────────

/** graphingCurvesDefinedParametrically covers evaluating parametric tables and orientation. */
export const graphingCurvesDefinedParametrically: TopicDef = {
  id: "graphing-curves-defined-parametrically",
  title: t("Graphing Curves Defined Parametrically", "参数方程定义的曲线作图"),
  summary: t(
    "Plot plane curves defined by parametric equations x = f(t) and y = g(t) using a table of values, and determine the orientation (direction of motion) as t increases.",
    "通过数值表绘制参数方程 x = f(t) 与 y = g(t) 定义的平面曲线，并确定随着参数 t 增大曲线的方向（运动取向）。",
  ),
  prerequisites: ["equations-of-circles"],
  encompasses: [{ topic: "equations-of-circles", weight: 0.3 }],
  xp: 16,
  standards: ["CCSS.HSF.IF.C.7", "CCSS.HSN.VM.A.1"],
  knowledgePoints: [
    {
      id: "plotting-parametric-points",
      title: t("Plotting points from parametric equations", "由参数方程列表描点"),
      explanation: t(
        "A plane curve can be defined parametrically by expressing both coordinates as functions of a third variable called a **parameter** $t$:\n$$x = f(t), \\quad y = g(t)$$\nTo plot points on the curve, substitute chosen values of $t$ into $f(t)$ and $g(t)$ to obtain coordinate pairs $(x(t), y(t))$ on the Cartesian plane.\n\nFor example, if $x(t) = 2t - 1$ and $y(t) = t^2 + 3$, then at $t = 2$:\n$$x(2) = 2(2) - 1 = 3, \\quad y(2) = 2^2 + 3 = 7$$\nyielding the point $(3, 7)$.",
        "平面曲线可以通过将两个坐标分别表示为第三个变量（称为**参数** $t$）的函数来定义：\n$$x = f(t), \\quad y = g(t)$$\n作图时，选取参数 $t$ 的特定取值代入 $f(t)$ 与 $g(t)$，得到直角坐标平面上的点 $(x(t), y(t))$。\n\n例如，若 $x(t) = 2t - 1$ 且 $y(t) = t^2 + 3$，则在 $t = 2$ 处：\n$$x(2) = 2(2) - 1 = 3, \\quad y(2) = 2^2 + 3 = 7$$\n对应的平面点坐标为 $(3, 7)$。",
      ),
      generate(rng) {
        const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const b = rng.int(-5, 5);
        const c = rng.pick([-3, -2, -1, 1, 2, 3]);
        const d = rng.int(-5, 5);
        const t0 = rng.pick([-3, -2, -1, 0, 1, 2, 3]);
        const xVal = a * t0 + b;
        const yVal = c * t0 * t0 + d;
        const xExpr = linExpr(a, b, "t");
        const yExpr = `${c === 1 ? "" : c === -1 ? "-" : c}t^2 ${sgnTerm(d)}`.trim();
        return oneOf(
          rng,
          t(
            `For the curve defined parametrically by $x(t) = ${xExpr}$ and $y(t) = ${yExpr}$, find the point $(x, y)$ corresponding to $t = ${t0}$.`,
            `对于参数方程为 $x(t) = ${xExpr}$ 和 $y(t) = ${yExpr}$ 的曲线，求当 $t = ${t0}$ 时对应的点 $(x, y)$ 的坐标。`,
          ),
          t(`$(${xVal}, ${yVal})$`, `$(${xVal}, ${yVal})$`),
          [
            t(`$(${yVal}, ${xVal})$`, `$(${yVal}, ${xVal})$`),
            t(`$(${xVal}, ${-yVal})$`, `$(${xVal}, ${-yVal})$`),
            t(`$(${-xVal}, ${yVal})$`, `$(${-xVal}, ${yVal})$`),
            t(`$(${xVal + 2}, ${yVal})$`, `$(${xVal + 2}, ${yVal})$`),
            t(`$(${xVal}, ${yVal - 3})$`, `$(${xVal}, ${yVal - 3})$`),
          ],
          t(
            `Substitute $t = ${t0}$ into the parametric equations:\n$$x(${t0}) = ${xVal}, \\quad y(${t0}) = ${yVal}$$\nThe point is $(${xVal}, ${yVal})$.`,
            `将 $t = ${t0}$ 代入参数方程：\n$$x(${t0}) = ${xVal}, \\quad y(${t0}) = ${yVal}$$\n所求点为 $(${xVal}, ${yVal})$。`,
          ),
        );
      },
    },
    {
      id: "direction-of-motion-orientation",
      title: t("Orientation and direction of motion", "曲线的取向与运动方向"),
      explanation: t(
        "As the parameter $t$ increases along an interval $[t_1, t_2]$, the point $(x(t), y(t))$ traces the curve in a specific direction called the **orientation** of the curve.\n\nThe point corresponding to the smallest parameter value $t = t_1$ is the **initial point** $(x(t_1), y(t_1))$, and the point corresponding to $t = t_2$ is the **terminal point** $(x(t_2), y(t_2))$. Directional arrows are placed along the curve to display this movement.",
        "当参数 $t$ 在区间 $[t_1, t_2]$ 上逐渐增大时，动点 $(x(t), y(t))$ 在曲线上运动的方向称为曲线的**取向**（或运动方向）。\n\n对应区间左端点 $t = t_1$ 的点称为**起点**（初始点）$(x(t_1), y(t_1))$，对应右端点 $t = t_2$ 的点称为**终点**（终止点）$(x(t_2), y(t_2))$。通常在曲线上标出箭头以指示随 $t$ 增大的运动方向。",
      ),
      generate(rng) {
        const t1 = rng.pick([-3, -2, -1, 0]);
        const t2 = rng.pick([1, 2, 3, 4]);
        const a = rng.pick([-3, -2, -1, 1, 2, 3]);
        const b = rng.int(-4, 4);
        const c = rng.pick([-3, -2, -1, 1, 2, 3]);
        const d = rng.int(-4, 4);
        const xExpr = linExpr(a, b, "t");
        const yExpr = linExpr(c, d, "t");
        const x1 = a * t1 + b;
        const y1 = c * t1 + d;
        const x2 = a * t2 + b;
        const y2 = c * t2 + d;
        return oneOf(
          rng,
          t(
            `A curve is defined parametrically by $x(t) = ${xExpr}$ and $y(t) = ${yExpr}$ for $t \\in [${t1}, ${t2}]$. Find the initial point and terminal point as $t$ increases.`,
            `已知参数方程 $x(t) = ${xExpr}$，$y(t) = ${yExpr}$，其中 $t \\in [${t1}, ${t2}]$。求随着 $t$ 增大，曲线的起点与终点坐标。`,
          ),
          t(`Initial: $(${x1}, ${y1})$, Terminal: $(${x2}, ${y2})$`, `起点: $(${x1}, ${y1})$，终点: $(${x2}, ${y2})$`),
          [
            t(`Initial: $(${x2}, ${y2})$, Terminal: $(${x1}, ${y1})$`, `起点: $(${x2}, ${y2})$，终点: $(${x1}, ${y1})$`),
            t(`Initial: $(${y1}, ${x1})$, Terminal: $(${y2}, ${x2})$`, `起点: $(${y1}, ${x1})$，终点: $(${y2}, ${x2})$`),
            t(`Initial: $(${x1}, ${-y1})$, Terminal: $(${x2}, ${-y2})$`, `起点: $(${x1}, ${-y1})$，终点: $(${x2}, ${-y2})$`),
            t(`Initial: $(${x1 + 1}, ${y1})$, Terminal: $(${x2 + 1}, ${y2})$`, `起点: $(${x1 + 1}, ${y1})$，终点: $(${x2 + 1}, ${y2})$`),
          ],
          t(
            `At the beginning of the interval $t = ${t1}$:\n$$(x(${t1}), y(${t1})) = (${x1}, ${y1})$$\nAt the end of the interval $t = ${t2}$:\n$$(x(${t2}), y(${t2})) = (${x2}, ${y2})$$\nThus the initial point is $(${x1}, ${y1})$ and the terminal point is $(${x2}, ${y2})$.`,
            `在参数区间起点 $t = ${t1}$ 处：\n$$(x(${t1}), y(${t1})) = (${x1}, ${y1})$$\n在参数区间终点 $t = ${t2}$ 处：\n$$(x(${t2}), y(${t2})) = (${x2}, ${y2})$$\n因此起点为 $(${x1}, ${y1})$，终点为 $(${x2}, ${y2})$。`,
          ),
        );
      },
    },
  ],
};

// ─── 8.28.2 Cartesian Equations of Parametric Curves ────────────────────────

/** cartesianEquationsOfParametricCurves covers eliminating the parameter algebraically and trigonometrically. */
export const cartesianEquationsOfParametricCurves: TopicDef = {
  id: "cartesian-equations-of-parametric-curves",
  title: t("Cartesian Equations of Parametric Curves", "消参法求平面曲线的普通方程"),
  summary: t(
    "Eliminate the parameter t by algebraic substitution or trigonometric identities to find the Cartesian equation of a curve, taking into account domain restrictions.",
    "通过代数消元法或三角恒等式消除参数 t，求解曲线的直角坐标方程（普通方程），并注意自变量的取值范围限制。",
  ),
  prerequisites: ["graphing-curves-defined-parametrically"],
  encompasses: [{ topic: "graphing-curves-defined-parametrically", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSF.IF.C.7", "CCSS.HSG.GPE.A.3"],
  knowledgePoints: [
    {
      id: "eliminate-parameter-algebraic",
      title: t("Eliminating parameter by algebraic substitution", "代数代入消参法"),
      explanation: t(
        "To find the Cartesian equation $y = f(x)$ from parametric equations $x = f(t)$ and $y = g(t)$:\n1. Solve for $t$ in terms of $x$ (for example, $x = t + h \\implies t = x - h$).\n2. Substitute the expression for $t$ into the equation for $y$.\n3. Simplify the resulting equation.\n\nFor example, if $x = t + 2$ and $y = 3t^2 - 1$, then $t = x - 2$, giving $y = 3(x - 2)^2 - 1$.",
        "由参数方程 $x = f(t)$ 与 $y = g(t)$ 求直角坐标方程（普通方程）$y = f(x)$ 的步骤：\n1. 从较简方程中解出参数 $t$（例如 $x = t + h \\implies t = x - h$）。\n2. 将 $t$ 的表达式代入关于 $y$ 的方程中。\n3. 化简所得方程。\n\n例如，若 $x = t + 2$ 且 $y = 3t^2 - 1$，则 $t = x - 2$，代入得 $y = 3(x - 2)^2 - 1$。",
      ),
      generate(rng) {
        const h = rng.int(-5, 5);
        const k = rng.int(-5, 5);
        const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const xExpr = linExpr(1, h, "t");
        const yExpr = `${a === 1 ? "" : a === -1 ? "-" : a}t^2 ${sgnTerm(k)}`.trim();
        const aCoeff = a === 1 ? "" : a === -1 ? "-" : `${a}`;
        const rightEq = `y = ${aCoeff}${sq("x", h)} ${sgnTerm(k)}`.trim();
        const wrong1 = `y = ${aCoeff}${sq("x", -h)} ${sgnTerm(k)}`.trim();
        const wrong2 = `x = ${aCoeff}${sq("y", h)} ${sgnTerm(k)}`.trim();
        const wrong3 = `y = ${aCoeff}${sq("x", h)} ${sgnTerm(-k)}`.trim();
        const wrong4 = `y = ${a + 1}${sq("x", h)} ${sgnTerm(k)}`.trim();
        return oneOf(
          rng,
          t(
            `Eliminate the parameter $t$ to find the Cartesian equation of the curve $x(t) = ${xExpr}$, $y(t) = ${yExpr}$.`,
            `消去参数 $t$，求参数曲线 $x(t) = ${xExpr}$，$y(t) = ${yExpr}$ 的直角坐标方程。`,
          ),
          t(`$${rightEq}$`, `$${rightEq}$`),
          [
            t(`$${wrong1}$`, `$${wrong1}$`),
            t(`$${wrong2}$`, `$${wrong2}$`),
            t(`$${wrong3}$`, `$${wrong3}$`),
            t(`$${wrong4}$`, `$${wrong4}$`),
          ],
          t(
            `Solve for $t$ from $x(t)$: $t = ${lin("x", h)}$.\nSubstitute into $y(t)$:\n$$y = ${aCoeff}${sq("x", h)} ${sgnTerm(k)}$$`,
            `由 $x(t)$ 解得 $t = ${lin("x", h)}$。\n代入 $y(t)$ 可得：\n$$y = ${aCoeff}${sq("x", h)} ${sgnTerm(k)}$$`,
          ),
        );
      },
    },
    {
      id: "eliminate-parameter-trigonometric",
      title: t("Eliminating parameter using trigonometric identities", "利用三角恒等式消参"),
      explanation: t(
        "When parametric equations contain trigonometric functions, isolate the trigonometric terms and use the fundamental Pythagorean identity:\n$$\\cos^2\\theta + \\sin^2\\theta = 1$$\nGiven $x = h + a\\cos\\theta$ and $y = k + b\\sin\\theta$, we have $\\frac{x - h}{a} = \\cos\\theta$ and $\\frac{y - k}{b} = \\sin\\theta$. Squaring and adding gives the standard ellipse equation:\n$$\\frac{(x - h)^2}{a^2} + \\frac{(y - k)^2}{b^2} = 1$$",
        "当参数方程含有三角函数时，先将三角函数单独分离出来，再利用同角三角函数的基本平方关系：\n$$\\cos^2\\theta + \\sin^2\\theta = 1$$\n对于 $x = h + a\\cos\\theta$ 与 $y = k + b\\sin\\theta$，可得 $\\frac{x - h}{a} = \\cos\\theta$ 和 $\\frac{y - k}{b} = \\sin\\theta$。两式分别平方后相加，即得椭圆的标准方程：\n$$\\frac{(x - h)^2}{a^2} + \\frac{(y - k)^2}{b^2} = 1$$",
      ),
      generate(rng) {
        const h = rng.int(-5, 5);
        const k = rng.int(-5, 5);
        const a = rng.int(2, 8);
        let b = rng.int(2, 8);
        while (b === a) b = rng.int(2, 8);
        const xTerm = trigTerm(h, a, "\\cos\\theta");
        const yTerm = trigTerm(k, b, "\\sin\\theta");
        const a2 = a * a;
        const b2 = b * b;
        const rightEq = `\\frac{${sq("x", h)}}{${a2}} + \\frac{${sq("y", k)}}{${b2}} = 1`;
        const wrong1 = `\\frac{${sq("x", h)}}{${a2}} - \\frac{${sq("y", k)}}{${b2}} = 1`;
        const wrong2 = `\\frac{${sq("x", h)}}{${b2}} + \\frac{${sq("y", k)}}{${a2}} = 1`;
        const wrong3 = `\\frac{${sq("x", -h)}}{${a2}} + \\frac{${sq("y", -k)}}{${b2}} = 1`;
        const wrong4 = `\\frac{${lin("x", h)}}{${a}} + \\frac{${lin("y", k)}}{${b}} = 1`;
        return oneOf(
          rng,
          t(
            `Eliminate the parameter $\\theta$ from $x = ${xTerm}$, $y = ${yTerm}$ ($0 \\le \\theta < 2\\pi$) to find its Cartesian equation.`,
            `消去参数 $\\theta$（$0 \\le \\theta < 2\\pi$），求曲线 $x = ${xTerm}$，$y = ${yTerm}$ 的直角坐标方程。`,
          ),
          t(`$${rightEq}$`, `$${rightEq}$`),
          [
            t(`$${wrong1}$`, `$${wrong1}$`),
            t(`$${wrong2}$`, `$${wrong2}$`),
            t(`$${wrong3}$`, `$${wrong3}$`),
            t(`$${wrong4}$`, `$${wrong4}$`),
          ],
          t(
            `Isolate the trigonometric functions:\n$$\\cos\\theta = \\frac{${lin("x", h)}}{${a}}, \\quad \\sin\\theta = \\frac{${lin("y", k)}}{${b}}$$\nUsing $\\cos^2\\theta + \\sin^2\\theta = 1$:\n$$\\frac{${sq("x", h)}}{${a2}} + \\frac{${sq("y", k)}}{${b2}} = 1$$`,
            `分离三角函数：\n$$\\cos\\theta = \\frac{${lin("x", h)}}{${a}}, \\quad \\sin\\theta = \\frac{${lin("y", k)}}{${b}}$$\n代入 $\\cos^2\\theta + \\sin^2\\theta = 1$：\n$$\\frac{${sq("x", h)}}{${a2}} + \\frac{${sq("y", k)}}{${b2}} = 1$$`,
          ),
        );
      },
    },
  ],
};

// ─── 8.28.3 Finding Intercepts of Curves Defined Parametrically ─────────────

/** findingInterceptsOfCurvesDefinedParametrically covers x- and y-intercepts of parametric curves. */
export const findingInterceptsOfCurvesDefinedParametrically: TopicDef = {
  id: "finding-intercepts-of-curves-defined-parametrically",
  title: t("Finding Intercepts of Curves Defined Parametrically", "求参数方程曲线的坐标轴截距"),
  summary: t(
    "Find the x-intercepts and y-intercepts of parametric curves by solving x(t) = 0 and y(t) = 0 for the parameter t.",
    "通过分别令 x(t) = 0 与 y(t) = 0 求解参数 t，进而确定参数曲线与坐标轴的截距及交点坐标。",
  ),
  prerequisites: ["cartesian-equations-of-parametric-curves"],
  encompasses: [{ topic: "cartesian-equations-of-parametric-curves", weight: 0.4 }],
  xp: 16,
  standards: ["CCSS.HSF.IF.C.7"],
  knowledgePoints: [
    {
      id: "parametric-y-intercepts",
      title: t("Finding y-intercepts of a parametric curve", "求参数曲线的 y 轴截距"),
      explanation: t(
        "The $y$-intercepts of a curve occur where the curve crosses the $y$-axis, which corresponds to $x(t) = 0$:\n1. Set $x(t) = 0$ and solve for the parameter $t$.\n2. For each real solution $t$, evaluate $y(t)$ to obtain the intercept point $(0, y(t))$.\n\nFor example, if $x(t) = t^2 - 4$ and $y(t) = 2t + 1$, setting $x(t) = 0$ gives $t = \\pm 2$. Then $y(2) = 5$ and $y(-2) = -3$, yielding $y$-intercepts at $(0, 5)$ and $(0, -3)$.",
        "曲线的 $y$ 轴截距（与 $y$ 轴的交点）发生在 $x(t) = 0$ 处：\n1. 令 $x(t) = 0$ 并求出参数 $t$ 的实数解。\n2. 将所求出的每个 $t$ 值代入 $y(t)$，得到截距交点坐标 $(0, y(t))$。\n\n例如，若 $x(t) = t^2 - 4$ 且 $y(t) = 2t + 1$，令 $x(t) = 0$ 得 $t = \\pm 2$。计算得 $y(2) = 5$ 与 $y(-2) = -3$，因此 $y$ 轴截距交点为 $(0, 5)$ 和 $(0, -3)$。",
      ),
      generate(rng) {
        const k = rng.int(1, 5);
        const c = rng.pick([-3, -2, -1, 1, 2, 3]);
        const d = rng.int(-5, 5);
        const k2 = k * k;
        const xExpr = `t^2 - ${k2}`;
        const yExpr = linExpr(c, d, "t");
        const y1 = c * k + d;
        const y2 = -c * k + d;
        const smaller = Math.min(y1, y2);
        const larger = Math.max(y1, y2);
        return oneOf(
          rng,
          t(
            `Find all $y$-intercepts of the parametric curve $x(t) = ${xExpr}$, $y(t) = ${yExpr}$.`,
            `求参数曲线 $x(t) = ${xExpr}$，$y(t) = ${yExpr}$ 的所有 $y$ 轴截距交点坐标。`,
          ),
          t(`$(0, ${smaller})$ and $(0, ${larger})$`, `$(0, ${smaller})$ 和 $(0, ${larger})$`),
          [
            t(`$(${smaller}, 0)$ and $(${larger}, 0)$`, `$(${smaller}, 0)$ 和 $(${larger}, 0)$`),
            t(`$(0, ${smaller + 1})$ and $(0, ${larger + 1})$`, `$(0, ${smaller + 1})$ 和 $(0, ${larger + 1})$`),
            t(`$(0, ${d})$`, `$(0, ${d})$`),
            t(`$(0, ${-smaller})$ and $(0, ${-larger})$`, `$(0, ${-smaller})$ 和 $(0, ${-larger})$`),
          ],
          t(
            `Set $x(t) = 0 \\implies t^2 - ${k2} = 0 \\implies t = \\pm ${k}$.\nEvaluate $y(t)$:\n- At $t = ${k}$: $y = ${c}(${k}) ${sgnTerm(d)} = ${y1}$\n- At $t = -${k}$: $y = ${c}(-${k}) ${sgnTerm(d)} = ${y2}$\nThus the $y$-intercepts are $(0, ${smaller})$ and $(0, ${larger})$.`,
            `令 $x(t) = 0 \\implies t^2 - ${k2} = 0 \\implies t = \\pm ${k}$。\n计算 $y(t)$：\n- 当 $t = ${k}$ 时，$y = ${c}(${k}) ${sgnTerm(d)} = ${y1}$\n- 当 $t = -${k}$ 时，$y = ${c}(-${k}) ${sgnTerm(d)} = ${y2}$\n因此 $y$ 轴截距交点为 $(0, ${smaller})$ 和 $(0, ${larger})$。`,
          ),
        );
      },
    },
    {
      id: "parametric-x-intercepts",
      title: t("Finding x-intercepts of a parametric curve", "求参数曲线的 x 轴截距"),
      explanation: t(
        "The $x$-intercepts of a curve occur where the curve crosses the $x$-axis, which corresponds to $y(t) = 0$:\n1. Set $y(t) = 0$ and solve for $t$.\n2. Substitute each real solution $t$ into $x(t)$ to find the intercept point $(x(t), 0)$.\n\nFor example, if $x(t) = 3t - 2$ and $y(t) = t^2 - 9$, setting $y(t) = 0$ gives $t = \\pm 3$. Then $x(3) = 7$ and $x(-3) = -11$, giving $x$-intercepts at $(7, 0)$ and $(-11, 0)$.",
        "曲线的 $x$ 轴截距（与 $x$ 轴的交点）发生在 $y(t) = 0$ 处：\n1. 令 $y(t) = 0$ 并求解参数 $t$。\n2. 将所求出的每个实数解 $t$ 代入 $x(t)$，得到交点坐标 $(x(t), 0)$。\n\n例如，若 $x(t) = 3t - 2$ 且 $y(t) = t^2 - 9$，令 $y(t) = 0$ 得 $t = \\pm 3$。计算得 $x(3) = 7$ 与 $x(-3) = -11$，因此 $x$ 轴截距交点为 $(7, 0)$ 和 $(-11, 0)$。",
      ),
      generate(rng) {
        const k = rng.int(1, 5);
        const c = rng.pick([-3, -2, -1, 1, 2, 3]);
        const d = rng.int(-5, 5);
        const k2 = k * k;
        const xExpr = linExpr(c, d, "t");
        const yExpr = `t^2 - ${k2}`;
        const x1 = c * k + d;
        const x2 = -c * k + d;
        const smaller = Math.min(x1, x2);
        const larger = Math.max(x1, x2);
        return oneOf(
          rng,
          t(
            `Find all $x$-intercepts of the parametric curve $x(t) = ${xExpr}$, $y(t) = ${yExpr}$.`,
            `求参数曲线 $x(t) = ${xExpr}$，$y(t) = ${yExpr}$ 的所有 $x$ 轴截距交点坐标。`,
          ),
          t(`$(${smaller}, 0)$ and $(${larger}, 0)$`, `$(${smaller}, 0)$ 和 $(${larger}, 0)$`),
          [
            t(`$(0, ${smaller})$ and $(0, ${larger})$`, `$(0, ${smaller})$ 和 $(0, ${larger})$`),
            t(`$(${smaller + 1}, 0)$ and $(${larger + 1}, 0)$`, `$(${smaller + 1}, 0)$ 和 $(${larger + 1}, 0)$`),
            t(`$(${d}, 0)$`, `$(${d}, 0)$`),
            t(`$(${-smaller}, 0)$ and $(${-larger}, 0)$`, `$(${-smaller}, 0)$ 和 $(${-larger}, 0)$`),
          ],
          t(
            `Set $y(t) = 0 \\implies t^2 - ${k2} = 0 \\implies t = \\pm ${k}$.\nEvaluate $x(t)$:\n- At $t = ${k}$: $x = ${c}(${k}) ${sgnTerm(d)} = ${x1}$\n- At $t = -${k}$: $x = ${c}(-${k}) ${sgnTerm(d)} = ${x2}$\nThus the $x$-intercepts are $(${smaller}, 0)$ and $(${larger}, 0)$.`,
            `令 $y(t) = 0 \\implies t^2 - ${k2} = 0 \\implies t = \\pm ${k}$。\n计算 $x(t)$：\n- 当 $t = ${k}$ 时，$x = ${c}(${k}) ${sgnTerm(d)} = ${x1}$\n- 当 $t = -${k}$ 时，$x = ${c}(-${k}) ${sgnTerm(d)} = ${x2}$\n因此 $x$ 轴截距交点为 $(${smaller}, 0)$ 和 $(${larger}, 0)$。`,
          ),
        );
      },
    },
  ],
};

// ─── 8.28.4 Finding Intersections of Parametric Curves and Lines ────────────

/** findingIntersectionsOfParametricCurvesAndLines covers intersections between parametric curves and lines. */
export const findingIntersectionsOfParametricCurvesAndLines: TopicDef = {
  id: "finding-intersections-of-parametric-curves-and-lines",
  title: t("Finding Intersections of Parametric Curves and Lines", "参数曲线与直线的交点"),
  summary: t(
    "Find intersection points of a parametric curve with a Cartesian line Ax + By + C = 0 by substituting the parametric equations into the line equation and solving for t.",
    "将参数方程代入直线的一般式方程 Ax + By + C = 0 中求解参数 t，从而求得参数曲线与直线的交点坐标。",
  ),
  prerequisites: ["finding-intercepts-of-curves-defined-parametrically"],
  encompasses: [{ topic: "finding-intercepts-of-curves-defined-parametrically", weight: 0.4 }],
  xp: 16,
  standards: ["CCSS.HSG.GPE.B.7", "CCSS.HSA.REI.C.7"],
  knowledgePoints: [
    {
      id: "intersection-parametric-curve-and-line",
      title: t("Intersection of a parametric curve and a line", "参数曲线与直线的交点"),
      explanation: t(
        "To find the intersection points between a parametric curve $x = x(t), y = y(t)$ and a Cartesian line $Ax + By = C$:\n1. Substitute $x(t)$ and $y(t)$ into the line's equation to obtain a single equation in $t$.\n2. Solve for $t$.\n3. Substitute each solution $t$ back into $(x(t), y(t))$ to determine the coordinates of the intersection point(s).",
        "求参数曲线 $x = x(t), y = y(t)$ 与直角坐标直线 $Ax + By = C$ 的交点步骤：\n1. 将 $x(t)$ 与 $y(t)$ 代入直线的方程中，得到关于参数 $t$ 的一元方程。\n2. 解该方程求出参数 $t$ 的值。\n3. 将每个解 $t$ 代回参数方程 $(x(t), y(t))$ 中，求出对应的交点坐标。",
      ),
      generate(rng) {
        const t1 = rng.int(-3, 1);
        let t2 = rng.int(2, 5);
        while (t2 === t1) t2 = rng.int(2, 5);
        const k = rng.int(-4, 4);
        const sum = t1 + t2;
        const prod = t1 * t2;
        const cVal = k - prod;
        const lineStr = `y ${sgnTerm(-sum)}x = ${cVal}`;
        const p1x = t1;
        const p1y = t1 * t1 + k;
        const p2x = t2;
        const p2y = t2 * t2 + k;
        return oneOf(
          rng,
          t(
            `Find the intersection points of the parametric curve $x(t) = t$, $y(t) = t^2 ${sgnTerm(k)}$ and the line $${lineStr}$.`,
            `求参数曲线 $x(t) = t$，$y(t) = t^2 ${sgnTerm(k)}$ 与直线 $${lineStr}$ 的交点坐标。`,
          ),
          t(`$(${p1x}, ${p1y})$ and $(${p2x}, ${p2y})$`, `$(${p1x}, ${p1y})$ 和 $(${p2x}, ${p2y})$`),
          [
            t(`$(${p1y}, ${p1x})$ and $(${p2y}, ${p2x})$`, `$(${p1y}, ${p1x})$ 和 $(${p2y}, ${p2x})$`),
            t(`$(${p1x}, ${p1y + 2})$ and $(${p2x}, ${p2y + 2})$`, `$(${p1x}, ${p1y + 2})$ 和 $(${p2x}, ${p2y + 2})$`),
            t(`$(${-p1x}, ${p1y})$ and $(${-p2x}, ${p2y})$`, `$(${-p1x}, ${p1y})$ 和 $(${-p2x}, ${p2y})$`),
            t(`$(${p1x}, ${-p1y})$ and $(${p2x}, ${-p2y})$`, `$(${p1x}, ${-p1y})$ 和 $(${p2x}, ${-p2y})$`),
          ],
          t(
            `Substitute $x = t$ and $y = t^2 ${sgnTerm(k)}$ into $${lineStr}$:\n$$(t^2 ${sgnTerm(k)}) - ${sum}t = ${cVal} \\implies t^2 - ${sum}t + ${prod} = 0$$\nFactoring: $(t - ${t1})(t - ${t2}) = 0 \\implies t = ${t1}, ${t2}$.\n- At $t = ${t1}$: point is $(${p1x}, ${p1y})$\n- At $t = ${t2}$: point is $(${p2x}, ${p2y})$\nThe intersection points are $(${p1x}, ${p1y})$ and $(${p2x}, ${p2y})$.`,
            `将 $x = t$ 与 $y = t^2 ${sgnTerm(k)}$ 代入直线方程 $${lineStr}$：\n$$(t^2 ${sgnTerm(k)}) - ${sum}t = ${cVal} \\implies t^2 - ${sum}t + ${prod} = 0$$\n因式分解得：$(t - ${t1})(t - ${t2}) = 0 \\implies t = ${t1}, ${t2}$。\n- 当 $t = ${t1}$ 时，交点为 $(${p1x}, ${p1y})$\n- 当 $t = ${t2}$ 时，交点为 $(${p2x}, ${p2y})$\n因此交点为 $(${p1x}, ${p1y})$ 和 $(${p2x}, ${p2y})$。`,
          ),
        );
      },
    },
    {
      id: "collision-point-of-two-particles",
      title: t("Collision point of two parametric paths", "两条参数曲线的碰撞点与碰撞时间"),
      explanation: t(
        "Two particles moving along paths $(x_1(t), y_1(t))$ and $(x_2(t), y_2(t))$ **collide** if they are at the exact same location at the **same time** $t$:\n$$x_1(t) = x_2(t) \\quad \\text{and} \\quad y_1(t) = y_2(t)$$\nIf such a time $t$ exists, the point $(x_1(t), y_1(t))$ is the collision point. (In contrast, a geometric path crossing without sharing the same time $t$ is an intersection, not a collision).",
        "两颗分别沿轨迹 $(x_1(t), y_1(t))$ 和 $(x_2(t), y_2(t))$ 运动的粒子，若在**同一时刻** $t$ 处于**相同位置**，则发生**碰撞**：\n$$x_1(t) = x_2(t) \\quad \\text{且} \\quad y_1(t) = y_2(t)$$\n若存在这样的时刻 $t$，则对应点即为碰撞点。（与之相比，若两条轨迹仅在空间上交叉但不同时到达同一位置，则为几何相交而非碰撞）。",
      ),
      generate(rng) {
        const tStar = rng.int(1, 5);
        const xStar = rng.int(-5, 5);
        const yStar = rng.int(-5, 5);
        const a1 = rng.pick([-3, -2, -1, 1, 2, 3]);
        let a2 = rng.pick([-3, -2, -1, 1, 2, 3]);
        while (a2 === a1) a2 = rng.pick([-3, -2, -1, 1, 2, 3]);
        const c1 = rng.pick([-3, -2, -1, 1, 2, 3]);
        let c2 = rng.pick([-3, -2, -1, 1, 2, 3]);
        while (c2 === c1) c2 = rng.pick([-3, -2, -1, 1, 2, 3]);
        const b1 = xStar - a1 * tStar;
        const b2 = xStar - a2 * tStar;
        const d1 = yStar - c1 * tStar;
        const d2 = yStar - c2 * tStar;
        const p1xExpr = linExpr(a1, b1, "t");
        const p1yExpr = linExpr(c1, d1, "t");
        const p2xExpr = linExpr(a2, b2, "t");
        const p2yExpr = linExpr(c2, d2, "t");
        return oneOf(
          rng,
          t(
            `Two particles follow paths $P_1(t) = (${p1xExpr}, ${p1yExpr})$ and $P_2(t) = (${p2xExpr}, ${p2yExpr})$ for $t \\ge 0$. Find the collision time $t$ and collision point $(x, y)$.`,
            `两颗粒子分别沿轨迹 $P_1(t) = (${p1xExpr}, ${p1yExpr})$ 与 $P_2(t) = (${p2xExpr}, ${p2yExpr})$（$t \\ge 0$）运动。求碰撞时刻 $t$ 以及碰撞点坐标 $(x, y)$。`,
          ),
          t(`$t = ${tStar}$, at $(${xStar}, ${yStar})$`, `$t = ${tStar}$，位于 $(${xStar}, ${yStar})$`),
          [
            t(`$t = ${tStar + 1}$, at $(${xStar + 1}, ${yStar})$`, `$t = ${tStar + 1}$，位于 $(${xStar + 1}, ${yStar})$`),
            t(`$t = ${tStar}$, at $(${yStar}, ${xStar})$`, `$t = ${tStar}$，位于 $(${yStar}, ${xStar})$`),
            t(`$t = ${tStar}$, at $(${xStar}, ${-yStar})$`, `$t = ${tStar}$，位于 $(${xStar}, ${-yStar})$`),
            t(`$t = ${tStar + 2}$, at $(${xStar}, ${yStar})$`, `$t = ${tStar + 2}$，位于 $(${xStar}, ${yStar})$`),
          ],
          t(
            `Set the $x$-coordinates equal: $${p1xExpr} = ${p2xExpr} \\implies (${a1 - a2})t = ${b2 - b1} \\implies t = ${tStar}$.\nSubstitute $t = ${tStar}$ into $y_1(t)$ and $y_2(t)$:\n$$y_1(${tStar}) = ${yStar}, \\quad y_2(${tStar}) = ${yStar}$$\nBoth coordinates match at $t = ${tStar}$, giving collision point $(${xStar}, ${yStar})$.`,
            `令两粒子的 $x$ 坐标相等：$${p1xExpr} = ${p2xExpr} \\implies (${a1 - a2})t = ${b2 - b1} \\implies t = ${tStar}$。\n将 $t = ${tStar}$ 代入 $y$ 坐标验证：\n$$y_1(${tStar}) = ${yStar}, \\quad y_2(${tStar}) = ${yStar}$$\n两坐标在 $t = ${tStar}$ 处完全相同，因此发生碰撞，碰撞点为 $(${xStar}, ${yStar})$。`,
          ),
        );
      },
    },
  ],
};

// ─── 8.28.5 Parametric Equations of Circles ─────────────────────────────────

/** parametricEquationsOfCircles covers circles in parametric and standard forms. */
export const parametricEquationsOfCircles: TopicDef = {
  id: "parametric-equations-of-circles",
  title: t("Parametric Equations of Circles", "圆的参数方程"),
  summary: t(
    "Represent circles centered at (h, k) with radius r using parametric equations x = h + r cos θ, y = k + r sin θ, and convert between parametric and standard Cartesian forms.",
    "使用参数方程 x = h + r cos θ, y = k + r sin θ 表示圆心为 (h, k)、半径为 r 的圆，并在参数方程与标准直角坐标方程之间互相转换。",
  ),
  prerequisites: ["cartesian-equations-of-parametric-curves"],
  encompasses: [
    { topic: "equations-of-circles", weight: 0.4 },
    { topic: "cartesian-equations-of-parametric-curves", weight: 0.3 },
  ],
  xp: 16,
  standards: ["CCSS.HSG.GPE.A.1"],
  knowledgePoints: [
    {
      id: "circle-cartesian-to-parametric",
      title: t("Standard circle to parametric form", "圆的标准方程化为参数方程"),
      explanation: t(
        "A circle centered at $(h, k)$ with radius $r > 0$ has standard equation:\n$$(x - h)^2 + (y - k)^2 = r^2$$\nIts parametric representation is:\n$$x = h + r\\cos\\theta, \\quad y = k + r\\sin\\theta \\quad (0 \\le \\theta < 2\\pi)$$\nwhere $\\theta$ represents the angle from the positive horizontal ray extending from the center.",
        "圆心为 $(h, k)$、半径为 $r > 0$ 的圆的标准方程为：\n$$(x - h)^2 + (y - k)^2 = r^2$$\n其参数方程表示为：\n$$x = h + r\\cos\\theta, \\quad y = k + r\\sin\\theta \\quad (0 \\le \\theta < 2\\pi)$$\n其中参数 $\\theta$ 表示从圆心引出的水平正向射线逆时针旋转的角。",
      ),
      generate(rng) {
        const h = rng.int(-6, 6);
        const k = rng.int(-6, 6);
        const r = rng.int(2, 10);
        const r2 = r * r;
        const cartesianEq = `${sq("x", h)} + ${sq("y", k)} = ${r2}`;
        const rightParam = `x = ${trigTerm(h, r, "\\cos\\theta")}, \\; y = ${trigTerm(k, r, "\\sin\\theta")}`;
        const wrong1 = `x = ${trigTerm(k, r, "\\cos\\theta")}, \\; y = ${trigTerm(h, r, "\\sin\\theta")}`;
        const wrong2 = `x = ${trigTerm(h, r2, "\\cos\\theta")}, \\; y = ${trigTerm(k, r2, "\\sin\\theta")}`;
        const wrong3 = `x = ${trigTerm(-h, r, "\\cos\\theta")}, \\; y = ${trigTerm(-k, r, "\\sin\\theta")}`;
        const wrong4 = `x = ${trigTerm(h, r, "\\sin\\theta")}, \\; y = ${trigTerm(k, r, "\\cos\\theta")}`;
        return oneOf(
          rng,
          t(
            `Find the parametric equations for the circle with equation $${cartesianEq}$ ($0 \\le \\theta < 2\\pi$).`,
            `求圆的标准方程 $${cartesianEq}$ 对应的参数方程（$0 \\le \\theta < 2\\pi$）。`,
          ),
          t(`$${rightParam}$`, `$${rightParam}$`),
          [
            t(`$${wrong1}$`, `$${wrong1}$`),
            t(`$${wrong2}$`, `$${wrong2}$`),
            t(`$${wrong3}$`, `$${wrong3}$`),
            t(`$${wrong4}$`, `$${wrong4}$`),
          ],
          t(
            `The circle has center $(h, k) = (${h}, ${k})$ and radius $r = \\sqrt{${r2}} = ${r}$.\nThe parametric equations are:\n$$x = h + r\\cos\\theta = ${trigTerm(h, r, "\\cos\\theta")}, \\quad y = k + r\\sin\\theta = ${trigTerm(k, r, "\\sin\\theta")}$$`,
            `该圆的圆心为 $(h, k) = (${h}, ${k})$，半径为 $r = \\sqrt{${r2}} = ${r}$。\n因此其参数方程为：\n$$x = h + r\\cos\\theta = ${trigTerm(h, r, "\\cos\\theta")}, \\quad y = k + r\\sin\\theta = ${trigTerm(k, r, "\\sin\\theta")}$$`,
          ),
        );
      },
    },
    {
      id: "circle-parametric-to-cartesian",
      title: t("Identify center and radius from parametric circle", "由圆的参数方程求圆心与半径"),
      explanation: t(
        "From the parametric equations $x = h + r\\cos\\theta$ and $y = k + r\\sin\\theta$:\n- The center is $(h, k)$.\n- The radius is $r$.\n- The Cartesian equation is $(x - h)^2 + (y - k)^2 = r^2$.\n\nFor example, $x = 3 + 5\\cos\\theta, y = -1 + 5\\sin\\theta$ represents a circle with center $(3, -1)$ and radius $5$.",
        "由圆的参数方程 $x = h + r\\cos\\theta$ 与 $y = k + r\\sin\\theta$ 可直接读出：\n- 圆心为 $(h, k)$。\n- 半径为 $r$。\n- 直角坐标方程为 $(x - h)^2 + (y - k)^2 = r^2$。\n\n例如，$x = 3 + 5\\cos\\theta, y = -1 + 5\\sin\\theta$ 表示圆心为 $(3, -1)$、半径为 $5$ 的圆。",
      ),
      generate(rng) {
        const h = rng.int(-6, 6);
        const k = rng.int(-6, 6);
        const r = rng.int(2, 10);
        const xTerm = trigTerm(h, r, "\\cos\\theta");
        const yTerm = trigTerm(k, r, "\\sin\\theta");
        return oneOf(
          rng,
          t(
            `Identify the center and radius of the circle defined by $x = ${xTerm}$, $y = ${yTerm}$.`,
            `求参数方程 $x = ${xTerm}$，$y = ${yTerm}$ 所表示的圆的圆心和半径。`,
          ),
          t(`Center $(${h}, ${k})$, radius $r = ${r}$`, `圆心 $(${h}, ${k})$，半径 $r = ${r}$`),
          [
            t(`Center $(${-h}, ${-k})$, radius $r = ${r}$`, `圆心 $(${-h}, ${-k})$，半径 $r = ${r}$`),
            t(`Center $(${k}, ${h})$, radius $r = ${r}$`, `圆心 $(${k}, ${h})$，半径 $r = ${r}$`),
            t(`Center $(${h}, ${k})$, radius $r = ${r * r}$`, `圆心 $(${h}, ${k})$，半径 $r = ${r * r}$`),
            t(`Center $(${h}, ${-k})$, radius $r = ${r}$`, `圆心 $(${h}, ${-k})$，半径 $r = ${r}$`),
          ],
          t(
            `Comparing with $x = h + r\\cos\\theta$ and $y = k + r\\sin\\theta$ gives center $(h, k) = (${h}, ${k})$ and radius $r = ${r}$.`,
            `与标准参数形式 $x = h + r\\cos\\theta$ 和 $y = k + r\\sin\\theta$ 对比可得圆心 $(h, k) = (${h}, ${k})$，半径 $r = ${r}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 8.28.6 Parametric Equations of Ellipses ────────────────────────────────

/** parametricEquationsOfEllipses covers ellipses in parametric form and eccentric angles. */
export const parametricEquationsOfEllipses: TopicDef = {
  id: "parametric-equations-of-ellipses",
  title: t("Parametric Equations of Ellipses", "椭圆的参数方程"),
  summary: t(
    "Write parametric equations for ellipses centered at (h, k) as x = h + a cos θ, y = k + b sin θ, relate parameters to semi-major and semi-minor axes, and distinguish parameter θ from the geometric angle.",
    "将中心在 (h, k) 的椭圆表示为参数方程 x = h + a cos θ, y = k + b sin θ，理解半长轴、半短轴与参数的关系，并区分参数 θ 与几何角。",
  ),
  prerequisites: ["parametric-equations-of-circles"],
  encompasses: [{ topic: "parametric-equations-of-circles", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSG.GPE.A.3"],
  knowledgePoints: [
    {
      id: "ellipse-parametric-equations",
      title: t("Converting between standard and parametric equations of an ellipse", "椭圆标准方程与参数方程的互化"),
      explanation: t(
        "An ellipse with center $(h, k)$, horizontal semi-axis $a$, and vertical semi-axis $b$ has standard Cartesian equation:\n$$\\frac{(x - h)^2}{a^2} + \\frac{(y - k)^2}{b^2} = 1$$\nIts parametric equations are:\n$$x = h + a\\cos\\theta, \\quad y = k + b\\sin\\theta \\quad (0 \\le \\theta < 2\\pi)$$\nSquaring and adding yields $\\left(\\frac{x - h}{a}\\right)^2 + \\left(\\frac{y - k}{b}\\right)^2 = \\cos^2\\theta + \\sin^2\\theta = 1$.",
        "中心在 $(h, k)$、水平半轴长为 $a$、垂直半轴长为 $b$ 的椭圆的标准方程为：\n$$\\frac{(x - h)^2}{a^2} + \\frac{(y - k)^2}{b^2} = 1$$\n其对应的参数方程为：\n$$x = h + a\\cos\\theta, \\quad y = k + b\\sin\\theta \\quad (0 \\le \\theta < 2\\pi)$$\n易验证 $\\left(\\frac{x - h}{a}\\right)^2 + \\left(\\frac{y - k}{b}\\right)^2 = \\cos^2\\theta + \\sin^2\\theta = 1$。",
      ),
      generate(rng) {
        const h = rng.int(-5, 5);
        const k = rng.int(-5, 5);
        const a = rng.int(2, 8);
        let b = rng.int(2, 8);
        while (b === a) b = rng.int(2, 8);
        const a2 = a * a;
        const b2 = b * b;
        const stdEq = `\\frac{${sq("x", h)}}{${a2}} + \\frac{${sq("y", k)}}{${b2}} = 1`;
        const rightParam = `x = ${trigTerm(h, a, "\\cos\\theta")}, \\; y = ${trigTerm(k, b, "\\sin\\theta")}`;
        const wrong1 = `x = ${trigTerm(h, a2, "\\cos\\theta")}, \\; y = ${trigTerm(k, b2, "\\sin\\theta")}`;
        const wrong2 = `x = ${trigTerm(h, b, "\\cos\\theta")}, \\; y = ${trigTerm(k, a, "\\sin\\theta")}`;
        const wrong3 = `x = ${trigTerm(-h, a, "\\cos\\theta")}, \\; y = ${trigTerm(-k, b, "\\sin\\theta")}`;
        const wrong4 = `x = ${trigTerm(h, a, "\\sec\\theta")}, \\; y = ${trigTerm(k, b, "\\tan\\theta")}`;
        return oneOf(
          rng,
          t(
            `Find the parametric equations of the ellipse $${stdEq}$ ($0 \\le \\theta < 2\\pi$).`,
            `求椭圆 $${stdEq}$ 的参数方程（$0 \\le \\theta < 2\\pi$）。`,
          ),
          t(`$${rightParam}$`, `$${rightParam}$`),
          [
            t(`$${wrong1}$`, `$${wrong1}$`),
            t(`$${wrong2}$`, `$${wrong2}$`),
            t(`$${wrong3}$`, `$${wrong3}$`),
            t(`$${wrong4}$`, `$${wrong4}$`),
          ],
          t(
            `From the standard equation, the center is $(h, k) = (${h}, ${k})$, the horizontal semi-axis is $a = \\sqrt{${a2}} = ${a}$, and the vertical semi-axis is $b = \\sqrt{${b2}} = ${b}$.\nThus $x = h + a\\cos\\theta = ${trigTerm(h, a, "\\cos\\theta")}$ and $y = k + b\\sin\\theta = ${trigTerm(k, b, "\\sin\\theta")}$.`,
            `由标准方程可知，中心为 $(h, k) = (${h}, ${k})$，水平半轴长 $a = \\sqrt{${a2}} = ${a}$，铅直半轴长 $b = \\sqrt{${b2}} = ${b}$。\n因此参数方程为 $x = h + a\\cos\\theta = ${trigTerm(h, a, "\\cos\\theta")}$，$y = k + b\\sin\\theta = ${trigTerm(k, b, "\\sin\\theta")}$。`,
          ),
        );
      },
    },
    {
      id: "ellipse-axes-and-eccentric-angle",
      title: t("Semi-axes lengths and eccentric angle", "椭圆的半轴长与离心角"),
      explanation: t(
        "For an ellipse $x = h + a\\cos\\theta, y = k + b\\sin\\theta$:\n- The center is $(h, k)$.\n- The semi-major axis length is $\\max(a, b)$, and the length of the major axis is $2\\max(a, b)$.\n- The semi-minor axis length is $\\min(a, b)$, and the length of the minor axis is $2\\min(a, b)$.\n- The parameter $\\theta$ is called the **eccentric angle** (离心角). It corresponds to the angle of a point on the circumscribed auxiliary circle, and is generally not the geometric angle from the origin to $(x, y)$.",
        "对于椭圆参数方程 $x = h + a\\cos\\theta, y = k + b\\sin\\theta$：\n- 中心为 $(h, k)$。\n- 半长轴长为 $\\max(a, b)$，长轴全长为 $2\\max(a, b)$。\n- 半短轴长为 $\\min(a, b)$，短轴全长为 $2\\min(a, b)$。\n- 参数 $\\theta$ 称为该点的**离心角**。它是辅助圆上对应点的圆心角，通常不等于椭圆上该点与中心连线的极角（几何角度）。",
      ),
      generate(rng) {
        const h = rng.int(-5, 5);
        const k = rng.int(-5, 5);
        const a = rng.int(2, 8);
        let b = rng.int(2, 8);
        while (b === a) b = rng.int(2, 8);
        const xTerm = trigTerm(h, a, "\\cos\\theta");
        const yTerm = trigTerm(k, b, "\\sin\\theta");
        const majorLen = 2 * Math.max(a, b);
        const minorLen = 2 * Math.min(a, b);
        return oneOf(
          rng,
          t(
            `For the ellipse $x = ${xTerm}$, $y = ${yTerm}$, find the center, major axis length, and minor axis length.`,
            `对于椭圆 $x = ${xTerm}$，$y = ${yTerm}$，求其中心坐标、长轴长与短轴长。`,
          ),
          t(
            `Center $(${h}, ${k})$, major axis $${majorLen}$, minor axis $${minorLen}$`,
            `中心 $(${h}, ${k})$，长轴长 $${majorLen}$，短轴长 $${minorLen}$`,
          ),
          [
            t(
              `Center $(${h}, ${k})$, major axis $${Math.max(a, b)}$, minor axis $${Math.min(a, b)}$`,
              `中心 $(${h}, ${k})$，长轴长 $${Math.max(a, b)}$，短轴长 $${Math.min(a, b)}$`,
            ),
            t(
              `Center $(${-h}, ${-k})$, major axis $${majorLen}$, minor axis $${minorLen}$`,
              `中心 $(${-h}, ${-k})$，长轴长 $${majorLen}$，短轴长 $${minorLen}$`,
            ),
            t(
              `Center $(${h}, ${k})$, major axis $${minorLen}$, minor axis $${majorLen}$`,
              `中心 $(${h}, ${k})$，长轴长 $${minorLen}$，短轴长 $${majorLen}$`,
            ),
            t(
              `Center $(${k}, ${h})$, major axis $${majorLen}$, minor axis $${minorLen}$`,
              `中心 $(${k}, ${h})$，长轴长 $${majorLen}$，短轴长 $${minorLen}$`,
            ),
          ],
          t(
            `The center is $(h, k) = (${h}, ${k})$. The semi-axes are $a = ${a}$ and $b = ${b}$.\nThe major axis has length $2\\max(${a}, ${b}) = ${majorLen}$, and the minor axis has length $2\\min(${a}, ${b}) = ${minorLen}$.`,
            `椭圆中心为 $(h, k) = (${h}, ${k})$。半轴长分别为 $a = ${a}$ 与 $b = ${b}$。\n长轴全长为 $2\\max(${a}, ${b}) = ${majorLen}$，短轴全长为 $2\\min(${a}, ${b}) = ${minorLen}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 8.28.7 Parametric Equations of Parabolas ───────────────────────────────

/** parametricEquationsOfParabolas covers standard parabolas opening along axes. */
export const parametricEquationsOfParabolas: TopicDef = {
  id: "parametric-equations-of-parabolas",
  title: t("Parametric Equations of Parabolas", "标准抛物线的参数方程"),
  summary: t(
    "Formulate parametric equations for standard parabolas opening along coordinate axes (x = pt², y = 2pt for y² = 4px and x = 2pt, y = pt² for x² = 4py), and eliminate t to recover standard Cartesian forms.",
    "建立开口向坐标轴的标准抛物线的参数方程（y² = 4px 对应 x = pt², y = 2pt；x² = 4py 对应 x = 2pt, y = pt²），并通过消参恢复其标准直角坐标方程。",
  ),
  prerequisites: ["cartesian-equations-of-parametric-curves"],
  encompasses: [{ topic: "cartesian-equations-of-parametric-curves", weight: 0.4 }],
  xp: 16,
  standards: ["CCSS.HSG.GPE.A.2"],
  knowledgePoints: [
    {
      id: "standard-horizontal-parabola-parametric",
      title: t("Parametric equations of horizontal parabolas y² = 4px", "水平抛物线 y² = 4px 的参数方程"),
      explanation: t(
        "A standard horizontal parabola with vertex at $(0, 0)$ has Cartesian equation $y^2 = 4px$ with focus $(p, 0)$.\nSetting $y = 2pt$ into the equation:\n$$(2pt)^2 = 4px \\implies 4p^2 t^2 = 4px \\implies x = pt^2$$\nThus, the standard parametric equations are:\n$$x = pt^2, \\quad y = 2pt \\quad (t \\in \\mathbb{R})$$\nEliminating $t = \\frac{y}{2p}$ yields $x = p\\left(\\frac{y}{2p}\\right)^2 = \\frac{y^2}{4p} \\implies y^2 = 4px$.",
        "顶点在原点 $(0, 0)$、焦点在 $(p, 0)$ 的标准水平抛物线方程为 $y^2 = 4px$。\n令 $y = 2pt$，代入方程得：\n$$(2pt)^2 = 4px \\implies 4p^2 t^2 = 4px \\implies x = pt^2$$\n因此标准参数方程为：\n$$x = pt^2, \\quad y = 2pt \\quad (t \\in \\mathbb{R})$$\n反向消去参数 $t = \\frac{y}{2p}$ 即可恢复直角坐标方程 $y^2 = 4px$。",
      ),
      generate(rng) {
        const p = rng.pick([-12, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12]);
        const fourP = 4 * p;
        const pCoeff = p === 1 ? "" : p === -1 ? "-" : `${p}`;
        const mode = rng.pick(["toParametric", "toCartesian", "focusDirectrix"]);

        if (mode === "toCartesian") {
          const rightEq = `y^2 = ${fourP}x`;
          const wrong1 = `x^2 = ${fourP}y`;
          const wrong2 = `y^2 = ${2 * p}x`;
          const wrong3 = `y^2 = ${-fourP}x`;
          return oneOf(
            rng,
            t(
              `Eliminate the parameter $t$ from $x = ${pCoeff}t^2, y = ${2 * p}t$ ($t \\in \\mathbb{R}$) to find the Cartesian equation of the parabola.`,
              `消去参数 $t$（$t \\in \\mathbb{R}$），求抛物线 $x = ${pCoeff}t^2, y = ${2 * p}t$ 的直角坐标方程。`,
            ),
            t(`$${rightEq}$`, `$${rightEq}$`),
            [t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`), t(`$${wrong3}$`, `$${wrong3}$`)],
            t(
              `Solve for $t$ from $y$: $t = \\frac{y}{${2 * p}}$. Substitute into $x$:\n$$x = ${p}\\left(\\frac{y}{${2 * p}}\\right)^2 = \\frac{y^2}{${fourP}} \\implies ${rightEq}$$`,
              `由 $y$ 解出 $t = \\frac{y}{${2 * p}}$，代入 $x$：\n$$x = ${p}\\left(\\frac{y}{${2 * p}}\\right)^2 = \\frac{y^2}{${fourP}} \\implies ${rightEq}$$`,
            ),
          );
        }

        if (mode === "focusDirectrix") {
          const rightAns = `Focus $(${p}, 0)$, directrix $x = ${-p}`;
          const wrong1 = `Focus $(0, ${p})$, directrix $y = ${-p}`;
          const wrong2 = `Focus $(${2 * p}, 0)$, directrix $x = ${-2 * p}`;
          const wrong3 = `Focus $(${-p}, 0)$, directrix $x = ${p}`;
          return oneOf(
            rng,
            t(
              `For the parabola given parametrically by $x = ${pCoeff}t^2, y = ${2 * p}t$, find the coordinates of its focus and the equation of its directrix.`,
              `求参数方程为 $x = ${pCoeff}t^2, y = ${2 * p}t$ 的抛物线的焦点坐标与准线方程。`,
            ),
            t(rightAns, `焦点 $(${p}, 0)$，准线 $x = ${-p}$`),
            [
              t(wrong1, `焦点 $(0, ${p})$，准线 $y = ${-p}$`),
              t(wrong2, `焦点 $(${2 * p}, 0)$，准线 $x = ${-2 * p}$`),
              t(wrong3, `焦点 $(${-p}, 0)$，准线 $x = ${p}$`),
            ],
            t(
              `In standard parametric form $x = pt^2, y = 2pt$, the parameter value is $p = ${p}$.\nThe focus is $(p, 0) = (${p}, 0)$ and the directrix is $x = -p \\implies x = ${-p}$.`,
              `标准参数式为 $x = pt^2, y = 2pt$，参数值为 $p = ${p}$。\n因此焦点为 $(p, 0) = (${p}, 0)$，准线为 $x = -p \\implies x = ${-p}$。`,
            ),
          );
        }

        const rightParam = `x = ${pCoeff}t^2, \\; y = ${2 * p}t`;
        const wrong1 = `x = ${2 * p}t, \\; y = ${pCoeff}t^2`;
        const wrong2 = `x = ${fourP}t^2, \\; y = ${2 * p}t`;
        const wrong3 = `x = ${pCoeff}t^2, \\; y = ${p}t`;
        return oneOf(
          rng,
          t(
            `Find the parametric equations for the standard parabola $y^2 = ${fourP}x$ ($t \\in \\mathbb{R}$).`,
            `求标准抛物线 $y^2 = ${fourP}x$ 的参数方程（$t \\in \\mathbb{R}$）。`,
          ),
          t(`$${rightParam}$`, `$${rightParam}$`),
          [t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`), t(`$${wrong3}$`, `$${wrong3}$`)],
          t(
            `From $y^2 = 4px$, we have $4p = ${fourP} \\implies p = ${p}$.\nThe standard parametric equations for $y^2 = 4px$ are:\n$$x = pt^2 = ${pCoeff}t^2, \\quad y = 2pt = ${2 * p}t$$`,
            `由 $y^2 = 4px$ 可知 $4p = ${fourP} implies p = ${p}$。\n水平抛物线 $y^2 = 4px$ 的标准参数方程为：\n$$x = pt^2 = ${pCoeff}t^2, \\quad y = 2pt = ${2 * p}t$$`,
          ),
        );
      },
    },
    {
      id: "standard-vertical-parabola-parametric",
      title: t("Parametric equations of vertical parabolas x² = 4py", "铅直抛物线 x² = 4py 的参数方程"),
      explanation: t(
        "A standard vertical parabola with vertex at $(0, 0)$ has Cartesian equation $x^2 = 4py$ with focus at $(0, p)$.\nSetting $x = 2pt$ into the equation gives:\n$$(2pt)^2 = 4py \\implies 4p^2 t^2 = 4py \\implies y = pt^2$$\nThus, its parametric equations are:\n$$x = 2pt, \\quad y = pt^2 \\quad (t \\in \\mathbb{R})$$",
        "顶点在原点 $(0, 0)$、焦点在 $(0, p)$ 的标准铅直抛物线方程为 $x^2 = 4py$。\n令 $x = 2pt$ 代入方程可得：\n$$(2pt)^2 = 4py \\implies 4p^2 t^2 = 4py \\implies y = pt^2$$\n因此其参数方程为：\n$$x = 2pt, \\quad y = pt^2 \\quad (t \\in \\mathbb{R})$$",
      ),
      generate(rng) {
        const p = rng.pick([-12, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12]);
        const fourP = 4 * p;
        const pCoeff = p === 1 ? "" : p === -1 ? "-" : `${p}`;
        const mode = rng.pick(["toParametric", "toCartesian", "focusDirectrix"]);

        if (mode === "toCartesian") {
          const rightEq = `x^2 = ${fourP}y`;
          const wrong1 = `y^2 = ${fourP}x`;
          const wrong2 = `x^2 = ${2 * p}y`;
          const wrong3 = `x^2 = ${-fourP}y`;
          return oneOf(
            rng,
            t(
              `Eliminate the parameter $t$ from $x = ${2 * p}t, y = ${pCoeff}t^2$ ($t \\in \\mathbb{R}$) to find the Cartesian equation of the parabola.`,
              `消去参数 $t$（$t \\in \\mathbb{R}$），求抛物线 $x = ${2 * p}t, y = ${pCoeff}t^2$ 的直角坐标方程。`,
            ),
            t(`$${rightEq}$`, `$${rightEq}$`),
            [t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`), t(`$${wrong3}$`, `$${wrong3}$`)],
            t(
              `Solve for $t$ from $x$: $t = \\frac{x}{${2 * p}}$. Substitute into $y$:\n$$y = ${p}\\left(\\frac{x}{${2 * p}}\\right)^2 = \\frac{x^2}{${fourP}} \\implies ${rightEq}$$`,
              `由 $x$ 解出 $t = \\frac{x}{${2 * p}}$，代入 $y$：\n$$y = ${p}\\left(\\frac{x}{${2 * p}}\\right)^2 = \\frac{x^2}{${fourP}} \\implies ${rightEq}$$`,
            ),
          );
        }

        if (mode === "focusDirectrix") {
          const rightAns = `Focus $(0, ${p})$, directrix $y = ${-p}$`;
          const wrong1 = `Focus $(${p}, 0)$, directrix $x = ${-p}$`;
          const wrong2 = `Focus $(0, ${2 * p})$, directrix $y = ${-2 * p}$`;
          const wrong3 = `Focus $(0, ${-p})$, directrix $y = ${p}$`;
          return oneOf(
            rng,
            t(
              `For the parabola given parametrically by $x = ${2 * p}t, y = ${pCoeff}t^2$, find the coordinates of its focus and the equation of its directrix.`,
              `求参数方程为 $x = ${2 * p}t, y = ${pCoeff}t^2$ 的抛物线的焦点坐标与准线方程。`,
            ),
            t(rightAns, `焦点 $(0, ${p})$，准线 $y = ${-p}$`),
            [
              t(wrong1, `焦点 $(${p}, 0)$，准线 $x = ${-p}$`),
              t(wrong2, `焦点 $(0, ${2 * p})$，准线 $y = ${-2 * p}$`),
              t(wrong3, `焦点 $(0, ${-p})$，准线 $y = ${p}$`),
            ],
            t(
              `In standard parametric form $x = 2pt, y = pt^2$, the parameter is $p = ${p}$.\nThe focus is $(0, p) = (0, ${p})$ and the directrix is $y = -p \\implies y = ${-p}$.`,
              `标准参数式为 $x = 2pt, y = pt^2$，参数值为 $p = ${p}$。\n因此焦点为 $(0, p) = (0, ${p})$，准线为 $y = -p \\implies y = ${-p}$。`,
            ),
          );
        }

        const rightParam = `x = ${2 * p}t, \\; y = ${pCoeff}t^2`;
        const wrong1 = `x = ${pCoeff}t^2, \\; y = ${2 * p}t`;
        const wrong2 = `x = ${2 * p}t, \\; y = ${fourP}t^2`;
        const wrong3 = `x = ${p}t, \\; y = ${pCoeff}t^2`;
        return oneOf(
          rng,
          t(
            `Find the parametric equations for the standard parabola $x^2 = ${fourP}y$ ($t \\in \\mathbb{R}$).`,
            `求标准铅直抛物线 $x^2 = ${fourP}y$ 的参数方程（$t \\in \\mathbb{R}$）。`,
          ),
          t(`$${rightParam}$`, `$${rightParam}$`),
          [t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`), t(`$${wrong3}$`, `$${wrong3}$`)],
          t(
            `From $x^2 = 4py$, $4p = ${fourP} \\implies p = ${p}$.\nThe standard parametric equations for $x^2 = 4py$ are:\n$$x = 2pt = ${2 * p}t, \\quad y = pt^2 = ${pCoeff}t^2$$`,
            `由 $x^2 = 4py$ 得 $4p = ${fourP} implies p = ${p}$。\n铅直抛物线 $x^2 = 4py$ 的标准参数方程为：\n$$x = 2pt = ${2 * p}t, \\quad y = pt^2 = ${pCoeff}t^2$$`,
          ),
        );
      },
    },
  ],
};

// ─── 8.28.8 Parametric Equations of Parabolas Centered at (h,k) ─────────────

/** parametricEquationsOfParabolasCenteredAtHk covers translated parabolas. */
export const parametricEquationsOfParabolasCenteredAtHk: TopicDef = {
  id: "parametric-equations-of-parabolas-centered-at-hk",
  title: t("Parametric Equations of Parabolas Centered at (h,k)", "一般位置抛物线的参数方程"),
  summary: t(
    "Write parametric equations for translated parabolas with vertex (h, k), such as x = h + 2pt, y = k + pt² or x = h + pt², y = k + 2pt, and identify the vertex and Cartesian form.",
    "写出顶点为 (h, k) 的平移抛物线的参数方程（如 x = h + 2pt, y = k + pt² 或 x = h + pt², y = k + 2pt），并识别其顶点坐标与直角坐标方程。",
  ),
  prerequisites: ["parametric-equations-of-parabolas"],
  encompasses: [{ topic: "parametric-equations-of-parabolas", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSG.GPE.A.2"],
  knowledgePoints: [
    {
      id: "shifted-vertical-parabola-parametric",
      title: t("Shifted vertical parabola parametric equations", "顶点在 (h, k) 的铅直抛物线参数方程"),
      explanation: t(
        "Translating a standard vertical parabola with vertex $(h, k)$ gives the Cartesian equation:\n$$(x - h)^2 = 4p(y - k)$$\nIts parametric equations are obtained by shifting the standard form $(2pt, pt^2)$:\n$$x = h + 2pt, \\quad y = k + pt^2 \\quad (t \\in \\mathbb{R})$$\nAt $t = 0$, $(x, y) = (h, k)$, which is the vertex of the parabola.",
        "将顶点位于 $(h, k)$ 的铅直抛物线平移后，其直角坐标顶点式方程为：\n$$(x - h)^2 = 4p(y - k)$$\n通过在标准参数式 $(2pt, pt^2)$ 上叠加平移量，得到参数方程：\n$$x = h + 2pt, \\quad y = k + pt^2 \\quad (t \\in \\mathbb{R})$$\n当 $t = 0$ 时，点 $(x, y) = (h, k)$ 即为抛物线的顶点坐标。",
      ),
      generate(rng) {
        const h = rng.int(-5, 5);
        const k = rng.int(-5, 5);
        const p = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const xTerm = linExpr(2 * p, h, "t");
        const pCoeff = p === 1 ? "" : p === -1 ? "-" : `${p}`;
        const yTerm = `${pCoeff}t^2 ${sgnTerm(k)}`.trim();
        const stdEq = `${sq("x", h)} = ${4 * p}${lin("y", k)}`;
        const rightChoice = `Vertex $(${h}, ${k})$, equation: $${stdEq}$`;
        const wrong1 = `Vertex $(${-h}, ${-k})$, equation: $${stdEq}$`;
        const wrong2 = `Vertex $(${k}, ${h})$, equation: $${stdEq}$`;
        const wrong3 = `Vertex $(${h}, ${k})$, equation: $${sq("y", k)} = ${4 * p}${lin("x", h)}$`;
        const wrong4 = `Vertex $(${h}, ${k})$, equation: $${sq("x", h)} = ${2 * p}${lin("y", k)}$`;
        return oneOf(
          rng,
          t(
            `Identify the vertex and Cartesian equation of the parabola $x(t) = ${xTerm}$, $y(t) = ${yTerm}$.`,
            `求参数抛物线 $x(t) = ${xTerm}$，$y(t) = ${yTerm}$ 的顶点坐标与直角坐标方程。`,
          ),
          t(rightChoice, `顶点 $(${h}, ${k})$，方程: $${stdEq}$`),
          [
            t(wrong1, `顶点 $(${-h}, ${-k})$，方程: $${stdEq}$`),
            t(wrong2, `顶点 $(${k}, ${h})$，方程: $${stdEq}$`),
            t(wrong3, `顶点 $(${h}, ${k})$，方程: $${sq("y", k)} = ${4 * p}${lin("x", h)}$`),
            t(wrong4, `顶点 $(${h}, ${k})$，方程: $${sq("x", h)} = ${2 * p}${lin("y", k)}$`),
          ],
          t(
            `Setting $t = 0$ gives vertex $(x, y) = (${h}, ${k})$.\nSolve for $t$ from $x$: $t = \\frac{${lin("x", h)}}{${2 * p}}$.\nSubstitute into $y$:\n$$y - ${k} = ${p}\\left(\\frac{${lin("x", h)}}{${2 * p}}\\right)^2 = \\frac{${sq("x", h)}}{${4 * p}} \\implies ${stdEq}$$`,
            `令 $t = 0$ 得顶点 $(x, y) = (${h}, ${k})$。\n由 $x$ 解得 $t = \\frac{${lin("x", h)}}{${2 * p}}$。\n代入 $y$：\n$$y - ${k} = ${p}\\left(\\frac{${lin("x", h)}}{${2 * p}}\\right)^2 = \\frac{${sq("x", h)}}{${4 * p}} \\implies ${stdEq}$$`,
          ),
        );
      },
    },
    {
      id: "shifted-horizontal-parabola-parametric",
      title: t("Shifted horizontal parabola parametric equations", "顶点在 (h, k) 的水平抛物线参数方程"),
      explanation: t(
        "A parabola opening horizontally with vertex at $(h, k)$ has Cartesian equation:\n$$(y - k)^2 = 4p(x - h)$$\nIts parametric equations are:\n$$x = h + pt^2, \\quad y = k + 2pt \\quad (t \\in \\mathbb{R})$$\nAt $t = 0$, $(x, y) = (h, k)$ gives the vertex.",
        "顶点在 $(h, k)$ 且开口水平的抛物线的直角坐标方程为：\n$$(y - k)^2 = 4p(x - h)$$\n其对应的参数方程为：\n$$x = h + pt^2, \\quad y = k + 2pt \\quad (t \\in \\mathbb{R})$$\n在 $t = 0$ 处，点 $(x, y) = (h, k)$ 即为顶点。",
      ),
      generate(rng) {
        const h = rng.int(-5, 5);
        const k = rng.int(-5, 5);
        const p = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const pCoeff = p === 1 ? "" : p === -1 ? "-" : `${p}`;
        const xTerm = `${pCoeff}t^2 ${sgnTerm(h)}`.trim();
        const yTerm = linExpr(2 * p, k, "t");
        const stdEq = `${sq("y", k)} = ${4 * p}${lin("x", h)}`;
        const rightChoice = `Vertex $(${h}, ${k})$, equation: $${stdEq}$`;
        const wrong1 = `Vertex $(${-h}, ${-k})$, equation: $${stdEq}$`;
        const wrong2 = `Vertex $(${k}, ${h})$, equation: $${stdEq}$`;
        const wrong3 = `Vertex $(${h}, ${k})$, equation: $${sq("x", h)} = ${4 * p}${lin("y", k)}$`;
        const wrong4 = `Vertex $(${h}, ${k})$, equation: $${sq("y", k)} = ${2 * p}${lin("x", h)}$`;
        return oneOf(
          rng,
          t(
            `Identify the vertex and Cartesian equation of the parabola $x(t) = ${xTerm}$, $y(t) = ${yTerm}$.`,
            `求参数抛物线 $x(t) = ${xTerm}$，$y(t) = ${yTerm}$ 的顶点坐标与直角坐标方程。`,
          ),
          t(rightChoice, `顶点 $(${h}, ${k})$，方程: $${stdEq}$`),
          [
            t(wrong1, `顶点 $(${-h}, ${-k})$，方程: $${stdEq}$`),
            t(wrong2, `顶点 $(${k}, ${h})$，方程: $${stdEq}$`),
            t(wrong3, `顶点 $(${h}, ${k})$，方程: $${sq("x", h)} = ${4 * p}${lin("y", k)}$`),
            t(wrong4, `顶点 $(${h}, ${k})$，方程: $${sq("y", k)} = ${2 * p}${lin("x", h)}$`),
          ],
          t(
            `Setting $t = 0$ gives vertex $(x, y) = (${h}, ${k})$.\nSolve for $t$ from $y$: $t = \\frac{${lin("y", k)}}{${2 * p}}$.\nSubstitute into $x$:\n$$x - ${h} = ${p}\\left(\\frac{${lin("y", k)}}{${2 * p}}\\right)^2 = \\frac{${sq("y", k)}}{${4 * p}} \\implies ${stdEq}$$`,
            `令 $t = 0$ 得顶点 $(x, y) = (${h}, ${k})$。\n由 $y$ 解得 $t = \\frac{${lin("y", k)}}{${2 * p}}$。\n代入 $x$：\n$$x - ${h} = ${p}\\left(\\frac{${lin("y", k)}}{${2 * p}}\\right)^2 = \\frac{${sq("y", k)}}{${4 * p}} \\implies ${stdEq}$$`,
          ),
        );
      },
    },
  ],
};

// ─── 8.28.9 Parametric Equations of Horizontal Hyperbolas ───────────────────

/** parametricEquationsOfHorizontalHyperbolas covers horizontal hyperbolas using sec and tan. */
export const parametricEquationsOfHorizontalHyperbolas: TopicDef = {
  id: "parametric-equations-of-horizontal-hyperbolas",
  title: t("Parametric Equations of Horizontal Hyperbolas", "水平双曲线的参数方程"),
  summary: t(
    "Parametrize horizontal hyperbolas using secant and tangent as x = h + a sec θ, y = k + b tan θ, and verify the standard Cartesian equation using sec² θ - tan² θ = 1.",
    "使用正割与正切函数将水平双曲线参数化为 x = h + a sec θ, y = k + b tan θ，并利用 sec² θ - tan² θ = 1 转化为标准直角坐标方程。",
  ),
  prerequisites: ["cartesian-equations-of-parametric-curves"],
  encompasses: [{ topic: "cartesian-equations-of-parametric-curves", weight: 0.4 }],
  xp: 16,
  standards: ["CCSS.HSG.GPE.A.3"],
  knowledgePoints: [
    {
      id: "horizontal-hyperbola-standard-to-parametric",
      title: t("Standard to parametric form of horizontal hyperbolas", "水平双曲线标准方程化为参数方程"),
      explanation: t(
        "A horizontal hyperbola with center $(h, k)$ and semi-axes $a$ and $b$ has standard equation:\n$$\\frac{(x - h)^2}{a^2} - \\frac{(y - k)^2}{b^2} = 1$$\nUsing the identity $\\sec^2\\theta - \\tan^2\\theta = 1$, we assign $\\frac{x - h}{a} = \\sec\\theta$ and $\\frac{y - k}{b} = \\tan\\theta$, which yields:\n$$x = h + a\\sec\\theta, \\quad y = k + b\\tan\\theta$$",
        "中心在 $(h, k)$、半实轴为 $a$、半虚轴为 $b$ 的水平双曲线的标准方程为：\n$$\\frac{(x - h)^2}{a^2} - \\frac{(y - k)^2}{b^2} = 1$$\n利用三角恒等式 $\\sec^2\\theta - \\tan^2\\theta = 1$，令 $\\frac{x - h}{a} = \\sec\\theta$ 与 $\\frac{y - k}{b} = \\tan\\theta$，得到其参数方程为：\n$$x = h + a\\sec\\theta, \\quad y = k + b\\tan\\theta$$",
      ),
      generate(rng) {
        const h = rng.int(-5, 5);
        const k = rng.int(-5, 5);
        const a = rng.int(2, 8);
        const b = rng.int(2, 8);
        const a2 = a * a;
        const b2 = b * b;
        const stdEq = `\\frac{${sq("x", h)}}{${a2}} - \\frac{${sq("y", k)}}{${b2}} = 1`;
        const rightParam = `x = ${trigTerm(h, a, "\\sec\\theta")}, \\; y = ${trigTerm(k, b, "\\tan\\theta")}`;
        const wrong1 = `x = ${trigTerm(h, b, "\\tan\\theta")}, \\; y = ${trigTerm(k, a, "\\sec\\theta")}`;
        const wrong2 = `x = ${trigTerm(h, a2, "\\sec\\theta")}, \\; y = ${trigTerm(k, b2, "\\tan\\theta")}`;
        const wrong3 = `x = ${trigTerm(h, a, "\\cos\\theta")}, \\; y = ${trigTerm(k, b, "\\sin\\theta")}`;
        const wrong4 = `x = ${trigTerm(-h, a, "\\sec\\theta")}, \\; y = ${trigTerm(-k, b, "\\tan\\theta")}`;
        return oneOf(
          rng,
          t(`Find the parametric equations of the horizontal hyperbola $${stdEq}$.`, `求水平双曲线 $${stdEq}$ 的参数方程。`),
          t(`$${rightParam}$`, `$${rightParam}$`),
          [
            t(`$${wrong1}$`, `$${wrong1}$`),
            t(`$${wrong2}$`, `$${wrong2}$`),
            t(`$${wrong3}$`, `$${wrong3}$`),
            t(`$${wrong4}$`, `$${wrong4}$`),
          ],
          t(
            `The center is $(h, k) = (${h}, ${k})$. The semi-transverse axis is $a = \\sqrt{${a2}} = ${a}$ and semi-conjugate axis is $b = \\sqrt{${b2}} = ${b}$.\nUsing $\\sec^2\\theta - \\tan^2\\theta = 1$:\n$$x = h + a\\sec\\theta = ${trigTerm(h, a, "\\sec\\theta")}, \\quad y = k + b\\tan\\theta = ${trigTerm(k, b, "\\tan\\theta")}$$`,
            `双曲线中心为 $(h, k) = (${h}, ${k})$，半实轴长 $a = \\sqrt{${a2}} = ${a}$，半虚轴长 $b = \\sqrt{${b2}} = ${b}$。\n利用 $\\sec^2\\theta - \\tan^2\\theta = 1$ 可得：\n$$x = h + a\\sec\\theta = ${trigTerm(h, a, "\\sec\\theta")}, \\quad y = k + b\\tan\\theta = ${trigTerm(k, b, "\\tan\\theta")}$$`,
          ),
        );
      },
    },
    {
      id: "horizontal-hyperbola-parametric-to-standard",
      title: t("Identify center and vertices from horizontal hyperbola", "由参数方程确定水平双曲线的中心与顶点"),
      explanation: t(
        "For a horizontal hyperbola $x = h + a\\sec\\theta, y = k + b\\tan\\theta$:\n- The center is $(h, k)$.\n- The transverse axis is horizontal, along the line $y = k$.\n- The vertices occur where $\\tan\\theta = 0$ (so $\\sec\\theta = \\pm 1$), giving $(h - a, k)$ and $(h + a, k)$.\n- The Cartesian equation is $\\frac{(x - h)^2}{a^2} - \\frac{(y - k)^2}{b^2} = 1$.",
        "对于水平双曲线参数方程 $x = h + a\\sec\\theta, y = k + b\\tan\\theta$：\n- 中心为 $(h, k)$。\n- 实轴沿水平方向直线 $y = k$。\n- 顶点发生在 $\\tan\\theta = 0$（此时 $\\sec\\theta = \\pm 1$）处，坐标为 $(h - a, k)$ 和 $(h + a, k)$。\n- 直角坐标方程为 $\\frac{(x - h)^2}{a^2} - \\frac{(y - k)^2}{b^2} = 1$。",
      ),
      generate(rng) {
        const h = rng.int(-5, 5);
        const k = rng.int(-5, 5);
        const a = rng.int(2, 8);
        const b = rng.int(2, 8);
        const xTerm = trigTerm(h, a, "\\sec\\theta");
        const yTerm = trigTerm(k, b, "\\tan\\theta");
        const v1x = h - a;
        const v2x = h + a;
        return oneOf(
          rng,
          t(
            `Find the center and vertices of the hyperbola defined by $x = ${xTerm}$, $y = ${yTerm}$.`,
            `求参数方程 $x = ${xTerm}$，$y = ${yTerm}$ 定义的双曲线的中心与顶点坐标。`,
          ),
          t(
            `Center $(${h}, ${k})$, vertices $(${v1x}, ${k})$ and $(${v2x}, ${k})$`,
            `中心 $(${h}, ${k})$，顶点 $(${v1x}, ${k})$ 和 $(${v2x}, ${k})$`,
          ),
          [
            t(
              `Center $(${h}, ${k})$, vertices $(${h}, ${k - a})$ and $(${h}, ${k + a})$`,
              `中心 $(${h}, ${k})$，顶点 $(${h}, ${k - a})$ 和 $(${h}, ${k + a})$`,
            ),
            t(
              `Center $(${-h}, ${-k})$, vertices $(${v1x}, ${k})$ and $(${v2x}, ${k})$`,
              `中心 $(${-h}, ${-k})$，顶点 $(${v1x}, ${k})$ 和 $(${v2x}, ${k})$`,
            ),
            t(
              `Center $(${h}, ${k})$, vertices $(${h - b}, ${k})$ and $(${h + b}, ${k})$`,
              `中心 $(${h}, ${k})$，顶点 $(${h - b}, ${k})$ 和 $(${h + b}, ${k})$`,
            ),
            t(
              `Center $(${k}, ${h})$, vertices $(${v1x}, ${k})$ and $(${v2x}, ${k})$`,
              `中心 $(${k}, ${h})$，顶点 $(${v1x}, ${k})$ 和 $(${v2x}, ${k})$`,
            ),
          ],
          t(
            `The center is $(h, k) = (${h}, ${k})$. The transverse axis is horizontal with semi-length $a = ${a}$.\nThe vertices are $(h \\pm a, k)$, which are $(${v1x}, ${k})$ and $(${v2x}, ${k})$.`,
            `中心为 $(h, k) = (${h}, ${k})$。实轴为水平方向，半实轴长 $a = ${a}$。\n因此顶点为 $(h \\pm a, k)$，即 $(${v1x}, ${k})$ 和 $(${v2x}, ${k})$。`,
          ),
        );
      },
    },
  ],
};

// ─── 8.28.10 Parametric Equations of Vertical Hyperbolas ────────────────────

/** parametricEquationsOfVerticalHyperbolas covers vertical hyperbolas with transverse axis along y. */
export const parametricEquationsOfVerticalHyperbolas: TopicDef = {
  id: "parametric-equations-of-vertical-hyperbolas",
  title: t("Parametric Equations of Vertical Hyperbolas", "铅直双曲线的参数方程"),
  summary: t(
    "Parametrize vertical hyperbolas with transverse axis along y as y = k + a sec θ, x = h + b tan θ, and convert to standard Cartesian form (y - k)²/a² - (x - h)²/b² = 1.",
    "将主轴沿 y 轴方向的铅直双曲线参数化为 y = k + a sec θ, x = h + b tan θ，并将其与标准方程 (y - k)²/a² - (x - h)²/b² = 1 进行互化。",
  ),
  prerequisites: ["parametric-equations-of-horizontal-hyperbolas"],
  encompasses: [{ topic: "parametric-equations-of-horizontal-hyperbolas", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSG.GPE.A.3"],
  knowledgePoints: [
    {
      id: "vertical-hyperbola-standard-to-parametric",
      title: t("Standard to parametric form of vertical hyperbolas", "铅直双曲线标准方程化为参数方程"),
      explanation: t(
        "A vertical hyperbola with center $(h, k)$ has standard equation:\n$$\\frac{(y - k)^2}{a^2} - \\frac{(x - h)^2}{b^2} = 1$$\nTo match $\\sec^2\\theta - \\tan^2\\theta = 1$, we assign the secant to the positive term (here $y$):\n$$\\frac{y - k}{a} = \\sec\\theta, \\quad \\frac{x - h}{b} = \\tan\\theta$$\nwhich gives:\n$$x = h + b\\tan\\theta, \\quad y = k + a\\sec\\theta$$",
        "中心在 $(h, k)$ 的铅直双曲线的标准方程为：\n$$\\frac{(y - k)^2}{a^2} - \\frac{(x - h)^2}{b^2} = 1$$\n对照 $\\sec^2\\theta - \\tan^2\\theta = 1$，正项（$y$ 项）对应正割函数：\n$$\\frac{y - k}{a} = \\sec\\theta, \\quad \\frac{x - h}{b} = \\tan\\theta$$\n得到参数方程为：\n$$x = h + b\\tan\\theta, \\quad y = k + a\\sec\\theta$$",
      ),
      generate(rng) {
        const h = rng.int(-5, 5);
        const k = rng.int(-5, 5);
        const a = rng.int(2, 8);
        const b = rng.int(2, 8);
        const a2 = a * a;
        const b2 = b * b;
        const stdEq = `\\frac{${sq("y", k)}}{${a2}} - \\frac{${sq("x", h)}}{${b2}} = 1`;
        const rightParam = `x = ${trigTerm(h, b, "\\tan\\theta")}, \\; y = ${trigTerm(k, a, "\\sec\\theta")}`;
        const wrong1 = `x = ${trigTerm(h, a, "\\sec\\theta")}, \\; y = ${trigTerm(k, b, "\\tan\\theta")}`;
        const wrong2 = `x = ${trigTerm(h, b2, "\\tan\\theta")}, \\; y = ${trigTerm(k, a2, "\\sec\\theta")}`;
        const wrong3 = `x = ${trigTerm(-h, b, "\\tan\\theta")}, \\; y = ${trigTerm(-k, a, "\\sec\\theta")}`;
        const wrong4 = `x = ${trigTerm(h, b, "\\sin\\theta")}, \\; y = ${trigTerm(k, a, "\\cos\\theta")}`;
        return oneOf(
          rng,
          t(`Find the parametric equations of the vertical hyperbola $${stdEq}$.`, `求铅直双曲线 $${stdEq}$ 的参数方程。`),
          t(`$${rightParam}$`, `$${rightParam}$`),
          [
            t(`$${wrong1}$`, `$${wrong1}$`),
            t(`$${wrong2}$`, `$${wrong2}$`),
            t(`$${wrong3}$`, `$${wrong3}$`),
            t(`$${wrong4}$`, `$${wrong4}$`),
          ],
          t(
            `The positive term is $y$, so the transverse axis is vertical with semi-axis $a = ${a}$, and semi-conjugate axis $b = ${b}$.\nUsing $\\sec^2\\theta - \\tan^2\\theta = 1$:\n$$x = h + b\\tan\\theta = ${trigTerm(h, b, "\\tan\\theta")}, \\quad y = k + a\\sec\\theta = ${trigTerm(k, a, "\\sec\\theta")}$$`,
            `方程中正项为 $y$，因此主轴为铅直方向，半实轴长 $a = ${a}$，半虚轴长 $b = ${b}$。\n利用 $\\sec^2\\theta - \\tan^2\\theta = 1$：\n$$x = h + b\\tan\\theta = ${trigTerm(h, b, "\\tan\\theta")}, \\quad y = k + a\\sec\\theta = ${trigTerm(k, a, "\\sec\\theta")}$$`,
          ),
        );
      },
    },
    {
      id: "vertical-hyperbola-parametric-to-standard",
      title: t("Identify center and vertices of vertical hyperbola", "由参数方程确定铅直双曲线的中心与顶点"),
      explanation: t(
        "For a vertical hyperbola $x = h + b\\tan\\theta, y = k + a\\sec\\theta$:\n- The center is $(h, k)$.\n- The transverse axis is vertical, along the line $x = h$.\n- The vertices occur at $\\tan\\theta = 0$ (so $\\sec\\theta = \\pm 1$), giving $(h, k - a)$ and $(h, k + a)$.\n- The Cartesian equation is $\\frac{(y - k)^2}{a^2} - \\frac{(x - h)^2}{b^2} = 1$.",
        "对于铅直双曲线参数方程 $x = h + b\\tan\\theta, y = k + a\\sec\\theta$：\n- 中心为 $(h, k)$。\n- 实轴沿铅直方向直线 $x = h$。\n- 顶点发生在 $\\tan\\theta = 0$（此时 $\\sec\\theta = \\pm 1$）处，坐标为 $(h, k - a)$ 和 $(h, k + a)$。\n- 直角坐标方程为 $\\frac{(y - k)^2}{a^2} - \\frac{(x - h)^2}{b^2} = 1$。",
      ),
      generate(rng) {
        const h = rng.int(-5, 5);
        const k = rng.int(-5, 5);
        const a = rng.int(2, 8);
        const b = rng.int(2, 8);
        const xTerm = trigTerm(h, b, "\\tan\\theta");
        const yTerm = trigTerm(k, a, "\\sec\\theta");
        const v1y = k - a;
        const v2y = k + a;
        return oneOf(
          rng,
          t(
            `Find the center and vertices of the hyperbola defined by $x = ${xTerm}$, $y = ${yTerm}$.`,
            `求参数方程 $x = ${xTerm}$，$y = ${yTerm}$ 定义的双曲线的中心与顶点坐标。`,
          ),
          t(
            `Center $(${h}, ${k})$, vertices $(${h}, ${v1y})$ and $(${h}, ${v2y})$`,
            `中心 $(${h}, ${k})$，顶点 $(${h}, ${v1y})$ 和 $(${h}, ${v2y})$`,
          ),
          [
            t(
              `Center $(${h}, ${k})$, vertices $(${h - a}, ${k})$ and $(${h + a}, ${k})$`,
              `中心 $(${h}, ${k})$，顶点 $(${h - a}, ${k})$ 和 $(${h + a}, ${k})$`,
            ),
            t(
              `Center $(${-h}, ${-k})$, vertices $(${h}, ${v1y})$ and $(${h}, ${v2y})$`,
              `中心 $(${-h}, ${-k})$，顶点 $(${h}, ${v1y})$ 和 $(${h}, ${v2y})$`,
            ),
            t(
              `Center $(${h}, ${k})$, vertices $(${h}, ${k - b})$ and $(${h}, ${k + b})$`,
              `中心 $(${h}, ${k})$，顶点 $(${h}, ${k - b})$ 和 $(${h}, ${k + b})$`,
            ),
            t(
              `Center $(${k}, ${h})$, vertices $(${h}, ${v1y})$ and $(${h}, ${v2y})$`,
              `中心 $(${k}, ${h})$，顶点 $(${h}, ${v1y})$ 和 $(${h}, ${v2y})$`,
            ),
          ],
          t(
            `The center is $(h, k) = (${h}, ${k})$. The transverse axis is vertical with semi-length $a = ${a}$.\nThe vertices are $(h, k \\pm a)$, which are $(${h}, ${v1y})$ and $(${h}, ${v2y})$.`,
            `中心为 $(h, k) = (${h}, ${k})$。实轴为铅直方向，半实轴长 $a = ${a}$。\n因此顶点为 $(h, k \\pm a)$，即 $(${h}, ${v1y})$ 和 $(${h}, ${v2y})$。`,
          ),
        );
      },
    },
  ],
};

// ─── 9.29.1 Introduction to Polar Coordinates ───────────────────────────────

/** introductionToPolarCoordinates covers pole, polar axis, coordinates (r, θ), and negative r. */
export const introductionToPolarCoordinates: TopicDef = {
  id: "introduction-to-polar-coordinates",
  title: t("Introduction to Polar Coordinates", "极坐标系与点的极坐标"),
  summary: t(
    "Understand the polar coordinate system defined by a pole and polar axis, plot points with coordinates (r, θ), and represent points using negative radial values (-r, θ) = (r, θ + π) and non-unique angles.",
    "理解由极点和极轴构成的极坐标系，绘制坐标为 (r, θ) 的点，掌握负极径表示法 (-r, θ) = (r, θ + π) 以及极坐标的多重非唯一性表示。",
  ),
  prerequisites: ["cartesian-equations-of-parametric-curves"],
  encompasses: [{ topic: "cartesian-equations-of-parametric-curves", weight: 0.3 }],
  xp: 16,
  standards: ["CCSS.HSN.CN.B.4"],
  knowledgePoints: [
    {
      id: "plotting-polar-coordinates",
      title: t("Plotting points and negative r in polar coordinates", "在极坐标系中描点与负极径"),
      explanation: t(
        "In the polar coordinate system, a point $P$ is located by $(r, \\theta)$:\n- The origin is the **pole** $O$, and the positive horizontal axis is the **polar axis**.\n- $r$ is the directed distance from the pole to $P$.\n- $\\theta$ is the directed angle measured counterclockwise from the polar axis.\n\nWhen $r < 0$, plot the point $|r|$ units along the opposite ray pointing in direction $\\theta + \\pi$:\n$$(-r, \\theta) = (r, \\theta + \\pi)$$\nFor example, $(-4, \\frac{\\pi}{3}) = (4, \\frac{4\\pi}{3})$, which lies in Quadrant III.",
        "在极坐标系中，平面上的点 $P$ 由有序数对 $(r, \\theta)$ 确定：\n- 原点称为**极点** $O$，水平向右的射线称为**极轴**。\n- $r$ 是从极点到点 $P$ 的有向距离（极径）。\n- $\\theta$ 是从极轴逆时针旋转到极径的有向角（极角）。\n\n当 $r < 0$ 时，点位于射线反向延长线上（即 $\\theta + \\pi$ 方向），距极点 $|r|$ 个单位：\n$$(-r, \\theta) = (r, \\theta + \\pi)$$\n例如，$(-4, \\frac{\\pi}{3}) = (4, \\frac{4\\pi}{3})$，位于第三象限。",
      ),
      generate(rng) {
        const specialAngles = [
          { angleStr: "\\frac{\\pi}{6}", oppStr: "\\frac{7\\pi}{6}", oppAngle: "7pi/6" },
          { angleStr: "\\frac{\\pi}{4}", oppStr: "\\frac{5\\pi}{4}", oppAngle: "5pi/4" },
          { angleStr: "\\frac{\\pi}{3}", oppStr: "\\frac{4\\pi}{3}", oppAngle: "4pi/3" },
          { angleStr: "\\frac{\\pi}{2}", oppStr: "\\frac{3\\pi}{2}", oppAngle: "3pi/2" },
          { angleStr: "\\frac{2\\pi}{3}", oppStr: "\\frac{5\\pi}{3}", oppAngle: "5pi/3" },
          { angleStr: "\\frac{3\\pi}{4}", oppStr: "\\frac{7\\pi}{4}", oppAngle: "7pi/4" },
          { angleStr: "\\frac{5\\pi}{6}", oppStr: "\\frac{11\\pi}{6}", oppAngle: "11pi/6" },
        ];
        const item = rng.pick(specialAngles);
        const rNeg = rng.int(-8, -2);
        const rPos = Math.abs(rNeg);
        const rightChoice = `(${rPos}, ${item.oppStr})`;
        const wrong1 = `(${rPos}, ${item.angleStr})`;
        const wrong2 = `(${rNeg}, ${item.oppStr})`;
        const wrong3 = `(${rPos}, -${item.angleStr})`;
        const wrong4 = `(${rPos}, 2\\pi - ${item.angleStr})`;
        return oneOf(
          rng,
          t(
            `Which of the following gives the polar coordinates of $(${rNeg}, ${item.angleStr})$ with positive radius $r > 0$ and $0 \\le \\theta < 2\\pi$?`,
            `下列哪个选项给出了极坐标点 $(${rNeg}, ${item.angleStr})$ 在 $r > 0$ 且 $0 \\le \\theta < 2\\pi$ 条件下的等价坐标？`,
          ),
          t(`$${rightChoice}$`, `$${rightChoice}$`),
          [
            t(`$${wrong1}$`, `$${wrong1}$`),
            t(`$${wrong2}$`, `$${wrong2}$`),
            t(`$${wrong3}$`, `$${wrong3}$`),
            t(`$${wrong4}$`, `$${wrong4}$`),
          ],
          t(
            `A negative radius represents movement in the opposite direction $\\theta + \\pi$:\n$$(${rNeg}, ${item.angleStr}) = (${rPos}, ${item.angleStr} + \\pi) = (${rPos}, ${item.oppStr})$$`,
            `负极径表示沿反方向 $\\theta + \\pi$ 度量：\n$$(${rNeg}, ${item.angleStr}) = (${rPos}, ${item.angleStr} + \\pi) = (${rPos}, ${item.oppStr})$$`,
          ),
        );
      },
    },
    {
      id: "multiple-polar-representations",
      title: t("Equivalent polar coordinate representations", "点的等价极坐标表示"),
      explanation: t(
        "Unlike Cartesian coordinates, polar representations are not unique. Every point in the plane has infinitely many pairs of polar coordinates:\n$$(r, \\theta) = (r, \\theta + 2k\\pi) = (-r, \\theta + (2k+1)\\pi), \\quad k \\in \\mathbb{Z}$$\nFor example, $(3, \\frac{\\pi}{4})$ can also be written as $(3, \\frac{9\\pi}{4})$, $(3, -\\frac{7\\pi}{4})$, or $(-3, \\frac{5\\pi}{4})$.",
        "与直角坐标不同，平面的极坐标表示不是唯一的。同一个点具有无穷多对极坐标表示：\n$$(r, \\theta) = (r, \\theta + 2k\\pi) = (-r, \\theta + (2k+1)\\pi), \\quad k \\in \\mathbb{Z}$$\n例如，$(3, \\frac{\\pi}{4})$ 亦可表示为 $(3, \\frac{9\\pi}{4})$、$(3, -\\frac{7\\pi}{4})$ 或 $(-3, \\frac{5\\pi}{4})$。",
      ),
      generate(rng) {
        const angleList = [
          { th: "\\frac{\\pi}{6}", plusPi: "\\frac{7\\pi}{6}", minus2Pi: "-\\frac{11\\pi}{6}" },
          { th: "\\frac{\\pi}{4}", plusPi: "\\frac{5\\pi}{4}", minus2Pi: "-\\frac{7\\pi}{4}" },
          { th: "\\frac{\\pi}{3}", plusPi: "\\frac{4\\pi}{3}", minus2Pi: "-\\frac{5\\pi}{3}" },
          { th: "\\frac{\\pi}{2}", plusPi: "\\frac{3\\pi}{2}", minus2Pi: "-\\frac{3\\pi}{2}" },
          { th: "\\frac{2\\pi}{3}", plusPi: "\\frac{5\\pi}{3}", minus2Pi: "-\\frac{4\\pi}{3}" },
          { th: "\\frac{3\\pi}{4}", plusPi: "\\frac{7\\pi}{4}", minus2Pi: "-\\frac{5\\pi}{4}" },
          { th: "\\frac{5\\pi}{6}", plusPi: "\\frac{11\\pi}{6}", minus2Pi: "-\\frac{7\\pi}{6}" },
          { th: "\\frac{7\\pi}{6}", plusPi: "\\frac{\\pi}{6}", minus2Pi: "-\\frac{5\\pi}{6}" },
          { th: "\\frac{5\\pi}{4}", plusPi: "\\frac{\\pi}{4}", minus2Pi: "-\\frac{3\\pi}{4}" },
          { th: "\\frac{4\\pi}{3}", plusPi: "\\frac{\\pi}{3}", minus2Pi: "-\\frac{2\\pi}{3}" },
          { th: "\\frac{5\\pi}{3}", plusPi: "\\frac{2\\pi}{3}", minus2Pi: "-\\frac{\\pi}{3}" },
          { th: "\\frac{7\\pi}{4}", plusPi: "\\frac{3\\pi}{4}", minus2Pi: "-\\frac{\\pi}{4}" },
          { th: "\\frac{11\\pi}{6}", plusPi: "\\frac{5\\pi}{6}", minus2Pi: "-\\frac{\\pi}{6}" },
        ];
        const rVal = rng.int(2, 9);
        const item = rng.pick(angleList);
        const mode = rng.pick(["negR", "negTheta"]);

        if (mode === "negR") {
          const rightChoice = `(-${rVal}, ${item.plusPi})`;
          const wrong1 = `(-${rVal}, ${item.th})`;
          const wrong2 = `(${rVal}, ${item.plusPi})`;
          const wrong3 = `(-${rVal}, -${item.th})`;
          return oneOf(
            rng,
            t(
              `Which of the following coordinates represents the point $(${rVal}, ${item.th})$ using a negative radius $r < 0$ and $0 \\le \\theta < 2\\pi$?`,
              `下列哪个选项使用负极径 $r < 0$ 且 $0 \\le \\theta < 2\\pi$ 表示点 $(${rVal}, ${item.th})$？`,
            ),
            t(`$${rightChoice}$`, `$${rightChoice}$`),
            [t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`), t(`$${wrong3}$`, `$${wrong3}$`)],
            t(
              `Using $(-r, \\theta + \\pi)$:\n$$(${rVal}, ${item.th}) = (-${rVal}, ${item.th} + \\pi) = ${rightChoice}$$`,
              `根据 $(-r, \\theta + \\pi)$：\n$$(${rVal}, ${item.th}) = (-${rVal}, ${item.th} + \\pi) = ${rightChoice}$$`,
            ),
          );
        }

        const rightChoice = `(${rVal}, ${item.minus2Pi})`;
        const wrong1 = `(${rVal}, -${item.th})`;
        const wrong2 = `(-${rVal}, ${item.minus2Pi})`;
        const wrong3 = `(${rVal}, ${item.plusPi})`;
        return oneOf(
          rng,
          t(
            `Which of the following coordinates represents the point $(${rVal}, ${item.th})$ with a negative angle in $[-2\\pi, 0)$?`,
            `下列哪个选项使用在 $[-2\\pi, 0)$ 内的负角表示点 $(${rVal}, ${item.th})$？`,
          ),
          t(`$${rightChoice}$`, `$${rightChoice}$`),
          [t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`), t(`$${wrong3}$`, `$${wrong3}$`)],
          t(
            `Subtract $2\\pi$ from the angle:\n$$(${rVal}, ${item.th}) = (${rVal}, ${item.th} - 2\\pi) = ${rightChoice}$$`,
            `极角减去 $2\\pi$：\n$$(${rVal}, ${item.th}) = (${rVal}, ${item.th} - 2\\pi) = ${rightChoice}$$`,
          ),
        );
      },
    },
  ],
};

// ─── 9.29.2 Converting from Polar Coordinates to Cartesian Coordinates ──────

/** convertingFromPolarCoordinatesToCartesianCoordinates covers polar <-> Cartesian coordinate conversions. */
export const convertingFromPolarCoordinatesToCartesianCoordinates: TopicDef = {
  id: "converting-from-polar-coordinates-to-cartesian-coordinates",
  title: t("Converting from Polar Coordinates to Cartesian Coordinates", "极坐标与直角坐标的互相转换"),
  summary: t(
    "Convert coordinates between polar (r, θ) and Cartesian (x, y) systems using x = r cos θ, y = r sin θ, r = √(x² + y²), and tan θ = y/x with quadrant analysis.",
    "利用 x = r cos θ, y = r sin θ 以及 r = √(x² + y²), tan θ = y/x（结合象限判断）实现极坐标 (r, θ) 与直角坐标 (x, y) 之间的互相转换。",
  ),
  prerequisites: ["introduction-to-polar-coordinates"],
  encompasses: [{ topic: "introduction-to-polar-coordinates", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSN.CN.B.4"],
  knowledgePoints: [
    {
      id: "polar-to-cartesian",
      title: t("Convert polar coordinates to Cartesian coordinates", "将极坐标转换为直角坐标"),
      explanation: t(
        "To convert polar coordinates $(r, \\theta)$ to Cartesian coordinates $(x, y)$:\n$$x = r\\cos\\theta, \\quad y = r\\sin\\theta$$\nFor example, for $(r, \\theta) = (6, \\frac{2\\pi}{3})$:\n$$x = 6\\cos\\frac{2\\pi}{3} = 6\\left(-\\frac{1}{2}\\right) = -3, \\quad y = 6\\sin\\frac{2\\pi}{3} = 6\\left(\\frac{\\sqrt{3}}{2}\\right) = 3\\sqrt{3}$$\nThus $(x, y) = (-3, 3\\sqrt{3})$.",
        "将极坐标 $(r, \\theta)$ 转换为直角坐标 $(x, y)$ 的公式为：\n$$x = r\\cos\\theta, \\quad y = r\\sin\\theta$$\n例如，对于 $(r, \\theta) = (6, \\frac{2\\pi}{3})$：\n$$x = 6\\cos\\frac{2\\pi}{3} = 6\\left(-\\frac{1}{2}\\right) = -3, \\quad y = 6\\sin\\frac{2\\pi}{3} = 6\\left(\\frac{\\sqrt{3}}{2}\\right) = 3\\sqrt{3}$$\n直角坐标为 $(-3, 3\\sqrt{3})$。",
      ),
      generate(rng) {
        const k = rng.int(1, 6);
        const r = 2 * k;
        const angles = [
          { th: "\\frac{\\pi}{3}", x: `${k}`, y: `${k === 1 ? "" : k}\\sqrt{3}` },
          { th: "\\frac{2\\pi}{3}", x: `-${k}`, y: `${k === 1 ? "" : k}\\sqrt{3}` },
          { th: "\\frac{4\\pi}{3}", x: `-${k}`, y: `-${k === 1 ? "" : k}\\sqrt{3}` },
          { th: "\\frac{5\\pi}{3}", x: `${k}`, y: `-${k === 1 ? "" : k}\\sqrt{3}` },
          { th: "\\frac{\\pi}{6}", x: `${k === 1 ? "" : k}\\sqrt{3}`, y: `${k}` },
          { th: "\\frac{5\\pi}{6}", x: `-${k === 1 ? "" : k}\\sqrt{3}`, y: `${k}` },
          { th: "\\frac{7\\pi}{6}", x: `-${k === 1 ? "" : k}\\sqrt{3}`, y: `-${k}` },
          { th: "\\frac{11\\pi}{6}", x: `${k === 1 ? "" : k}\\sqrt{3}`, y: `-${k}` },
        ];
        const item = rng.pick(angles);
        const rightChoice = `(${item.x}, ${item.y})`;
        const wrong1 = `(${item.y}, ${item.x})`;
        const wrong2 = `(-(${item.x}), ${item.y})`;
        const wrong3 = `(${item.x}, -(${item.y}))`;
        return oneOf(
          rng,
          t(
            `Convert the polar coordinates $(${r}, ${item.th})$ into Cartesian coordinates $(x, y)$.`,
            `将极坐标 $(${r}, ${item.th})$ 转换为直角坐标 $(x, y)$。`,
          ),
          t(`$${rightChoice}$`, `$${rightChoice}$`),
          [t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`), t(`$${wrong3}$`, `$${wrong3}$`)],
          t(
            `Calculate $x$ and $y$:\n$$x = ${r}\\cos\\left(${item.th}\\right) = ${item.x}$$\n$$y = ${r}\\sin\\left(${item.th}\\right) = ${item.y}$$\nThus $(x, y) = ${rightChoice}$.`,
            `计算 $x$ 与 $y$：\n$$x = ${r}\\cos\\left(${item.th}\\right) = ${item.x}$$\n$$y = ${r}\\sin\\left(${item.th}\\right) = ${item.y}$$\n因此直角坐标为 ${rightChoice}。`,
          ),
        );
      },
    },
    {
      id: "cartesian-to-polar",
      title: t("Convert Cartesian coordinates to polar coordinates", "将直角坐标转换为极坐标"),
      explanation: t(
        "To convert Cartesian coordinates $(x, y)$ into polar coordinates $(r, \\theta)$ with $r > 0$ and $0 \\le \\theta < 2\\pi$:\n1. Find the distance $r = \\sqrt{x^2 + y^2}$.\n2. Find the reference angle $\\alpha = \\arctan|y/x|$.\n3. Determine $\\theta$ by identifying the quadrant of $(x, y)$:\n   - Quadrant I: $\\theta = \\alpha$\n   - Quadrant II: $\\theta = \\pi - \\alpha$\n   - Quadrant III: $\\theta = \\pi + \\alpha$\n   - Quadrant IV: $\\theta = 2\\pi - \\alpha$",
        "将直角坐标 $(x, y)$ 转换为满足 $r > 0$ 且 $0 \\le \\theta < 2\\pi$ 的极坐标 $(r, \\theta)$ 的步骤：\n1. 计算距离 $r = \\sqrt{x^2 + y^2}$。\n2. 计算参考角 $\\alpha = \\arctan|y/x|$。\n3. 根据 $(x, y)$ 所在的象限确定极角 $\\theta$：\n   - 第一象限：$\\theta = \\alpha$\n   - 第二象限：$\\theta = \\pi - \\alpha$\n   - 第三象限：$\\theta = \\pi + \\alpha$\n   - 第四象限：$\\theta = 2\\pi - \\alpha$",
      ),
      generate(rng) {
        const k = rng.int(1, 6);
        const configs = [
          { x: `${k}`, y: `${k}`, r: `${k === 1 ? "" : k}\\sqrt{2}`, th: "\\frac{\\pi}{4}" },
          { x: `-${k}`, y: `${k}`, r: `${k === 1 ? "" : k}\\sqrt{2}`, th: "\\frac{3\\pi}{4}" },
          { x: `-${k}`, y: `-${k}`, r: `${k === 1 ? "" : k}\\sqrt{2}`, th: "\\frac{5\\pi}{4}" },
          { x: `${k}`, y: `-${k}`, r: `${k === 1 ? "" : k}\\sqrt{2}`, th: "\\frac{7\\pi}{4}" },
          { x: `${k === 1 ? "" : k}\\sqrt{3}`, y: `${k}`, r: `${2 * k}`, th: "\\frac{\\pi}{6}" },
          { x: `-${k === 1 ? "" : k}\\sqrt{3}`, y: `${k}`, r: `${2 * k}`, th: "\\frac{5\\pi}{6}" },
          { x: `-${k === 1 ? "" : k}\\sqrt{3}`, y: `-${k}`, r: `${2 * k}`, th: "\\frac{7\\pi}{6}" },
          { x: `${k === 1 ? "" : k}\\sqrt{3}`, y: `-${k}`, r: `${2 * k}`, th: "\\frac{11\\pi}{6}" },
        ];
        const item = rng.pick(configs);
        const rightChoice = `(${item.r}, ${item.th})`;
        const wrong1 = `(${item.r}, \\frac{\\pi}{2} - ${item.th})`;
        const wrong2 = `(${k}, ${item.th})`;
        const wrong3 = `(${item.r}, 2\\pi - ${item.th})`;
        return oneOf(
          rng,
          t(
            `Convert the Cartesian point $(${item.x}, ${item.y})$ into polar coordinates $(r, \\theta)$ with $r > 0$ and $0 \\le \\theta < 2\\pi$.`,
            `将直角坐标点 $(${item.x}, ${item.y})$ 转换为满足 $r > 0$ 且 $0 \\le \\theta < 2\\pi$ 的极坐标 $(r, \\theta)$。`,
          ),
          t(`$${rightChoice}$`, `$${rightChoice}$`),
          [t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`), t(`$${wrong3}$`, `$${wrong3}$`)],
          t(
            `Compute radius:\n$$r = \\sqrt{x^2 + y^2} = ${item.r}$$\nDetermine angle $\\theta$ from $\\tan\\theta = y/x$ and quadrant analysis:\n$$\\theta = ${item.th}$$\nThus $(r, \\theta) = ${rightChoice}$.`,
            `计算极径：\n$$r = \\sqrt{x^2 + y^2} = ${item.r}$$\n根据 $\\tan\\theta = y/x$ 结合所在象限确定极角：\n$$\\theta = ${item.th}$$\n因此极坐标为 ${rightChoice}。`,
          ),
        );
      },
    },
  ],
};

// ─── 9.29.3 Polar Equations of Circles Centered at the Origin ───────────────

/** polarEquationsOfCirclesCenteredAtTheOrigin covers r = a circles and Cartesian conversions. */
export const polarEquationsOfCirclesCenteredAtTheOrigin: TopicDef = {
  id: "polar-equations-of-circles-centered-at-the-origin",
  title: t("Polar Equations of Circles Centered at the Origin", "以极点为圆心的圆的极坐标方程"),
  summary: t(
    "Analyze polar equations of circles centered at the pole in the form r = a, understand families of concentric circles, and convert to Cartesian form x² + y² = a².",
    "掌握以极点为圆心的圆的极坐标方程 r = a，理解同心圆族，并实现与直角坐标方程 x² + y² = a² 的互化。",
  ),
  prerequisites: ["introduction-to-polar-coordinates"],
  encompasses: [{ topic: "introduction-to-polar-coordinates", weight: 0.4 }],
  xp: 16,
  standards: ["CCSS.HSG.GPE.A.1", "CCSS.HSN.CN.B.4"],
  knowledgePoints: [
    {
      id: "circle-at-origin-polar-form",
      title: t("Circles centered at the pole r = a", "以极点为圆心的圆 r = a"),
      explanation: t(
        "The polar equation $r = a$ (where $a \\ne 0$) states that every point on the graph is at directed distance $|a|$ from the pole, for every angle $\\theta$:\n- The graph is a circle centered at the pole $(0, 0)$ with radius $R = |a|$.\n- The equation $r = -a$ produces the identical circle, because $(-a, \\theta) = (a, \\theta + \\pi)$.\n- Varying $a$ generates a family of concentric circles centered at the origin.",
        "极坐标方程 $r = a$（其中 $a \\ne 0$）表示平面上所有与极点的距离均为 $|a|$ 的点构成的集合：\n- 其图形是以极点 $(0, 0)$ 为圆心、半径为 $R = |a|$ 的圆。\n- 方程 $r = -a$ 表示完全相同的圆，因为 $(-a, \\theta) = (a, \\theta + \\pi)$。\n- 改变常数 $a$ 的值，可得到以极点为中心的同心圆族。",
      ),
      generate(rng) {
        const a = rng.pick([
          -18, -16, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18,
        ]);
        const radius = Math.abs(a);
        const diameter = 2 * radius;
        const mode = rng.pick(["centerRadius", "diameterCircumference"]);

        if (mode === "diameterCircumference") {
          const circ = `${2 * radius}\\pi`;
          const area = `${radius * radius}\\pi`;
          return oneOf(
            rng,
            t(
              `Find the circumference and area of the circle defined by the polar equation $r = ${a}$.`,
              `求极坐标方程 $r = ${a}$ 所表示的圆的周长与面积。`,
            ),
            t(`Circumference $${circ}$, area $${area}$`, `周长 $${circ}$，面积 $${area}$`),
            [
              t(`Circumference $${radius}\\pi$, area $${area}$`, `周长 $${radius}\\pi$，面积 $${area}$`),
              t(`Circumference $${circ}$, area $${2 * radius}\\pi$`, `周长 $${circ}$，面积 $${2 * radius}\\pi$`),
              t(`Circumference $${4 * radius}\\pi$, area $${area}$`, `周长 $${4 * radius}\\pi$，面积 $${area}$`),
            ],
            t(
              `The radius is $R = |${a}| = ${radius}$.\nCircumference $C = 2\\pi R = ${circ}$, area $A = \\pi R^2 = ${area}$.`,
              `半径为 $R = |${a}| = ${radius}$。\n周长 $C = 2\\pi R = ${circ}$，面积 $A = \\pi R^2 = ${area}$。`,
            ),
          );
        }

        return oneOf(
          rng,
          t(
            `Identify the center, radius, and diameter of the curve with polar equation $r = ${a}$.`,
            `求极坐标方程 $r = ${a}$ 所表示曲线的圆心、半径与直径。`,
          ),
          t(
            `Center $(0, 0)$, radius $r = ${radius}$, diameter $d = ${diameter}`,
            `圆心 $(0, 0)$，半径 $r = ${radius}$，直径 $d = ${diameter}`,
          ),
          [
            t(
              `Center $(${a}, 0)$, radius $r = ${radius}$, diameter $d = ${diameter}`,
              `圆心 $(${a}, 0)$，半径 $r = ${radius}$，直径 $d = ${diameter}`,
            ),
            t(
              `Center $(0, ${a})$, radius $r = ${radius}$, diameter $d = ${diameter}`,
              `圆心 $(0, ${a})$，半径 $r = ${radius}$，直径 $d = ${diameter}`,
            ),
            t(
              `Center $(0, 0)$, radius $r = ${radius * radius}$, diameter $d = ${2 * radius * radius}`,
              `圆心 $(0, 0)$，半径 $r = ${radius * radius}$，直径 $d = ${2 * radius * radius}`,
            ),
          ],
          t(
            `The equation $r = ${a}$ represents all points at distance $|${a}| = ${radius}$ from the pole $(0, 0)$.\nThus the center is $(0, 0)$, radius is ${radius}$, and diameter is $2(${radius}) = ${diameter}$.`,
            `方程 $r = ${a}$ 表示所有到极点 $(0, 0)$ 的距离为 $|${a}| = ${radius}$ 的点。\n因此圆心为 $(0, 0)$，半径为 ${radius}$，直径为 $2(${radius}) = ${diameter}$。`,
          ),
        );
      },
    },
    {
      id: "circle-at-origin-conversion",
      title: t("Convert r = a to Cartesian equation", "将 r = a 转化为直角坐标方程"),
      explanation: t(
        "Since polar and Cartesian coordinates are related by $x^2 + y^2 = r^2$, squaring both sides of $r = a$ gives:\n$$r^2 = a^2 \\implies x^2 + y^2 = a^2$$\nFor instance, the polar circle $r = 5$ has Cartesian equation $x^2 + y^2 = 25$.",
        "由于极坐标与直角坐标的关系满足 $x^2 + y^2 = r^2$，将 $r = a$ 两边平方即可得：\n$$r^2 = a^2 \\implies x^2 + y^2 = a^2$$\n例如，极坐标方程 $r = 5$ 对应的直角坐标方程为 $x^2 + y^2 = 25$。",
      ),
      generate(rng) {
        const a = rng.int(2, 20);
        const a2 = a * a;
        const mode = rng.pick(["polarToCart", "cartToPolar"]);

        if (mode === "cartToPolar") {
          const rightAns = `r = ${a}`;
          const wrong1 = `r = ${a2}`;
          const wrong2 = `\\theta = ${a}`;
          const wrong3 = `r = ${2 * a}`;
          return oneOf(
            rng,
            t(
              `Convert the Cartesian circle equation $x^2 + y^2 = ${a2}$ into a polar equation with $r > 0$.`,
              `将圆的直角坐标方程 $x^2 + y^2 = ${a2}$ 转化为极径 $r > 0$ 的极坐标方程。`,
            ),
            t(`$${rightAns}$`, `$${rightAns}$`),
            [t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`), t(`$${wrong3}$`, `$${wrong3}$`)],
            t(
              `Substitute $x^2 + y^2 = r^2$:\n$$r^2 = ${a2} \\implies r = ${a} \\quad (r > 0)$$`,
              `代入 $x^2 + y^2 = r^2$：\n$$r^2 = ${a2} \\implies r = ${a} \\quad (r > 0)$$`,
            ),
          );
        }

        return oneOf(
          rng,
          t(`Find the Cartesian equation corresponding to the polar equation $r = ${a}$.`, `求极坐标方程 $r = ${a}$ 对应的直角坐标方程。`),
          t(`$x^2 + y^2 = ${a2}$`, `$x^2 + y^2 = ${a2}$`),
          [
            t(`$x^2 + y^2 = ${a}$`, `$x^2 + y^2 = ${a}$`),
            t(`$(x - ${a})^2 + y^2 = ${a2}$`, `$(x - ${a})^2 + y^2 = ${a2}$`),
            t(`$x^2 + (y - ${a})^2 = ${a2}$`, `$x^2 + (y - ${a})^2 = ${a2}$`),
          ],
          t(
            `Square both sides of $r = ${a}$:\n$$r^2 = ${a}^2 = ${a2}$$\nSince $r^2 = x^2 + y^2$, the Cartesian equation is $x^2 + y^2 = ${a2}$.`,
            `将 $r = ${a}$ 两边平方：\n$$r^2 = ${a}^2 = ${a2}$$\n由 $r^2 = x^2 + y^2$ 可得直角坐标方程为 $x^2 + y^2 = ${a2}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 9.29.4 Polar Equations of Radial Lines ─────────────────────────────────

/** polarEquationsOfRadialLines covers theta = alpha lines and conversions. */
export const polarEquationsOfRadialLines: TopicDef = {
  id: "polar-equations-of-radial-lines",
  title: t("Polar Equations of Radial Lines", "过极点的射线的极坐标方程"),
  summary: t(
    "Write and interpret polar equations of lines through the pole as θ = α, understand the slope m = tan α, and convert to Cartesian form y = (tan α) x.",
    "建立并理解过极点的直线与射线的极坐标方程 θ = α，掌握斜率 m = tan α，并将其转换为直角坐标方程 y = (tan α) x。",
  ),
  prerequisites: ["introduction-to-polar-coordinates"],
  encompasses: [{ topic: "introduction-to-polar-coordinates", weight: 0.4 }],
  xp: 16,
  standards: ["CCSS.HSN.CN.B.4"],
  knowledgePoints: [
    {
      id: "radial-line-polar-equation",
      title: t("The polar equation θ = α", "极坐标方程 θ = α"),
      explanation: t(
        "The polar equation $\\theta = \\alpha$ places no restriction on $r$, allowing $r$ to be any real number:\n- For $r \\ge 0$, the points trace the ray making angle $\\alpha$ with the polar axis.\n- For $r < 0$, the points trace the opposite ray in direction $\\alpha + \\pi$.\nTogether, all values of $r \\in \\mathbb{R}$ form the complete straight line passing through the pole with slope:\n$$m = \\tan\\alpha$$",
        "极坐标方程 $\\theta = \\alpha$ 对极径 $r$ 没有任何限制，$r$ 可取任意实数：\n- 当 $r \\ge 0$ 时，点构成与极轴夹角为 $\\alpha$ 的射线。\n- 当 $r < 0$ 时，点构成反方向角为 $\\alpha + \\pi$ 的反向射线。\n两部分结合，全体 $r \\in \\mathbb{R}$ 构成了整条穿过极点且斜率为：\n$$m = \\tan\\alpha$$\n的直线。",
      ),
      generate(rng) {
        const lineData = [
          {
            alpha: "\\frac{\\pi}{6}",
            deg: "30^\\circ",
            slope: "\\frac{\\sqrt{3}}{3}",
            bad1: "\\sqrt{3}",
            bad2: "-\\frac{\\sqrt{3}}{3}",
            badAngle: "\\frac{\\pi}{3}",
          },
          { alpha: "\\frac{\\pi}{4}", deg: "45^\\circ", slope: "1", bad1: "-1", bad2: "\\sqrt{3}", badAngle: "\\frac{\\pi}{6}" },
          {
            alpha: "\\frac{\\pi}{3}",
            deg: "60^\\circ",
            slope: "\\sqrt{3}",
            bad1: "\\frac{\\sqrt{3}}{3}",
            bad2: "-\\sqrt{3}",
            badAngle: "\\frac{\\pi}{4}",
          },
          {
            alpha: "\\frac{2\\pi}{3}",
            deg: "120^\\circ",
            slope: "-\\sqrt{3}",
            bad1: "\\sqrt{3}",
            bad2: "-\\frac{\\sqrt{3}}{3}",
            badAngle: "\\frac{3\\pi}{4}",
          },
          { alpha: "\\frac{3\\pi}{4}", deg: "135^\\circ", slope: "-1", bad1: "1", bad2: "-\\sqrt{3}", badAngle: "\\frac{2\\pi}{3}" },
          {
            alpha: "\\frac{5\\pi}{6}",
            deg: "150^\\circ",
            slope: "-\\frac{\\sqrt{3}}{3}",
            bad1: "\\frac{\\sqrt{3}}{3}",
            bad2: "-\\sqrt{3}",
            badAngle: "\\frac{\\pi}{6}",
          },
          {
            alpha: "\\frac{7\\pi}{6}",
            deg: "210^\\circ",
            slope: "\\frac{\\sqrt{3}}{3}",
            bad1: "-\\frac{\\sqrt{3}}{3}",
            bad2: "1",
            badAngle: "\\frac{5\\pi}{4}",
          },
          {
            alpha: "\\frac{5\\pi}{4}",
            deg: "225^\\circ",
            slope: "1",
            bad1: "-1",
            bad2: "\\frac{\\sqrt{3}}{3}",
            badAngle: "\\frac{4\\pi}{3}",
          },
          { alpha: "\\frac{4\\pi}{3}", deg: "240^\\circ", slope: "\\sqrt{3}", bad1: "-\\sqrt{3}", bad2: "1", badAngle: "\\frac{5\\pi}{3}" },
          { alpha: "\\frac{5\\pi}{3}", deg: "300^\\circ", slope: "-\\sqrt{3}", bad1: "\\sqrt{3}", bad2: "1", badAngle: "\\frac{7\\pi}{4}" },
          {
            alpha: "\\frac{7\\pi}{4}",
            deg: "315^\\circ",
            slope: "-1",
            bad1: "1",
            bad2: "-\\frac{\\sqrt{3}}{3}",
            badAngle: "\\frac{11\\pi}{6}",
          },
          {
            alpha: "\\frac{11\\pi}{6}",
            deg: "330^\\circ",
            slope: "-\\frac{\\sqrt{3}}{3}",
            bad1: "\\frac{\\sqrt{3}}{3}",
            bad2: "-1",
            badAngle: "\\frac{5\\pi}{6}",
          },
        ];
        const item = rng.pick(lineData);
        const mode = rng.pick(["slopeRad", "slopeDeg", "pointOnLine"]);
        if (mode === "pointOnLine") {
          const r = rng.int(2, 8);
          return oneOf(
            rng,
            t(
              `Which of the following points with $r = ${r}$ lies on the line given by the polar equation $\\theta = ${item.alpha}$?`,
              `下列哪个极径为 $r = ${r}$ 的点位于极坐标方程 $\\theta = ${item.alpha}$ 所表示的直线上？`,
            ),
            t(`$\\left(${r},\\, ${item.alpha}\\right)$`, `$\\left(${r},\\, ${item.alpha}\\right)$`),
            [
              t(`$\\left(${r},\\, ${item.badAngle}\\right)$`, `$\\left(${r},\\, ${item.badAngle}\\right)$`),
              t(`$\\left(${r},\\, -${item.badAngle}\\right)$`, `$\\left(${r},\\, -${item.badAngle}\\right)$`),
              t(`$\\left(${r},\\, \\frac{\\pi}{2}\\right)$`, `$\\left(${r},\\, \\frac{\\pi}{2}\\right)$`),
            ],
            t(
              `Any point on the line $\\theta = ${item.alpha}$ with radius $r = ${r}$ has coordinates $\\left(${r},\\, ${item.alpha}\\right)$.`,
              `直线 $\\theta = ${item.alpha}$ 上极径为 $r = ${r}$ 的点极坐标为 $\\left(${r},\\, ${item.alpha}\\right)$。`,
            ),
          );
        }
        const angleTex = mode === "slopeDeg" ? item.deg : item.alpha;
        return oneOf(
          rng,
          t(
            `Find the slope of the line given by the polar equation $\\theta = ${angleTex}$.`,
            `求极坐标方程 $\\theta = ${angleTex}$ 所表示直线的斜率。`,
          ),
          t(`$m = ${item.slope}$`, `$m = ${item.slope}$`),
          [t(`$m = ${item.bad1}$`, `$m = ${item.bad1}$`), t(`$m = ${item.bad2}$`, `$m = ${item.bad2}$`), t(`$m = 0$`, `$m = 0$`)],
          t(
            `The line passes through the pole with inclination angle $\\alpha = ${angleTex}$.\nThe slope is $m = \\tan\\left(${angleTex}\\right) = ${item.slope}$.`,
            `该直线通过极点，倾斜角为 $\\alpha = ${angleTex}$。\n因此斜率为 $m = \\tan\\left(${angleTex}\\right) = ${item.slope}$。`,
          ),
        );
      },
    },
    {
      id: "radial-line-to-cartesian",
      title: t("Convert θ = α to Cartesian equation", "将 θ = α 转化为直角坐标方程"),
      explanation: t(
        "To convert $\\theta = \\alpha$ into Cartesian coordinates, take the tangent of both sides:\n$$\\tan\\theta = \\tan\\alpha \\implies \\frac{y}{x} = \\tan\\alpha \\implies y = (\\tan\\alpha)x$$\nFor example, $\\theta = \\frac{\\pi}{3}$ gives $y = \\left(\\tan\\frac{\\pi}{3}\\right)x = \\sqrt{3}x$.",
        "将 $\\theta = \\alpha$ 转化为直角坐标方程时，两边取正切：\n$$\\tan\\theta = \\tan\\alpha \\implies \\frac{y}{x} = \\tan\\alpha \\implies y = (\\tan\\alpha)x$$\n例如，$\\theta = \\frac{\\pi}{3}$ 对应直线 $y = \\left(\\tan\\frac{\\pi}{3}\\right)x = \\sqrt{3}x$。",
      ),
      generate(rng) {
        const lineData = [
          {
            alpha: "\\frac{\\pi}{6}",
            reducedAlpha: "\\frac{\\pi}{6}",
            deg: "30^\\circ",
            eq: "y = \\frac{\\sqrt{3}}{3}x",
            bad1: "y = \\sqrt{3}x",
            bad2: "y = -\\frac{\\sqrt{3}}{3}x",
            badAngle: "\\frac{\\pi}{3}",
            stdEq: (c: number) => (c === 1 ? "x - \\sqrt{3}y = 0" : `${c}x - ${c}\\sqrt{3}y = 0`),
          },
          {
            alpha: "\\frac{\\pi}{4}",
            reducedAlpha: "\\frac{\\pi}{4}",
            deg: "45^\\circ",
            eq: "y = x",
            bad1: "y = -x",
            bad2: "y = 2x",
            badAngle: "\\frac{\\pi}{6}",
            stdEq: (c: number) => (c === 1 ? "x - y = 0" : `${c}x - ${c}y = 0`),
          },
          {
            alpha: "\\frac{\\pi}{3}",
            reducedAlpha: "\\frac{\\pi}{3}",
            deg: "60^\\circ",
            eq: "y = \\sqrt{3}x",
            bad1: "y = \\frac{\\sqrt{3}}{3}x",
            bad2: "y = -\\sqrt{3}x",
            badAngle: "\\frac{\\pi}{4}",
            stdEq: (c: number) => (c === 1 ? "\\sqrt{3}x - y = 0" : `${c}\\sqrt{3}x - ${c}y = 0`),
          },
          {
            alpha: "\\frac{2\\pi}{3}",
            reducedAlpha: "\\frac{2\\pi}{3}",
            deg: "120^\\circ",
            eq: "y = -\\sqrt{3}x",
            bad1: "y = \\sqrt{3}x",
            bad2: "y = -\\frac{\\sqrt{3}}{3}x",
            badAngle: "\\frac{3\\pi}{4}",
            stdEq: (c: number) => (c === 1 ? "\\sqrt{3}x + y = 0" : `${c}\\sqrt{3}x + ${c}y = 0`),
          },
          {
            alpha: "\\frac{3\\pi}{4}",
            reducedAlpha: "\\frac{3\\pi}{4}",
            deg: "135^\\circ",
            eq: "y = -x",
            bad1: "y = x",
            bad2: "y = -2x",
            badAngle: "\\frac{2\\pi}{3}",
            stdEq: (c: number) => (c === 1 ? "x + y = 0" : `${c}x + ${c}y = 0`),
          },
          {
            alpha: "\\frac{5\\pi}{6}",
            reducedAlpha: "\\frac{5\\pi}{6}",
            deg: "150^\\circ",
            eq: "y = -\\frac{\\sqrt{3}}{3}x",
            bad1: "y = \\frac{\\sqrt{3}}{3}x",
            bad2: "y = -\\sqrt{3}x",
            badAngle: "\\frac{\\pi}{6}",
            stdEq: (c: number) => (c === 1 ? "x + \\sqrt{3}y = 0" : `${c}x + ${c}\\sqrt{3}y = 0`),
          },
          {
            alpha: "\\frac{7\\pi}{6}",
            reducedAlpha: "\\frac{\\pi}{6}",
            deg: "210^\\circ",
            eq: "y = \\frac{\\sqrt{3}}{3}x",
            bad1: "y = -\\frac{\\sqrt{3}}{3}x",
            bad2: "y = x",
            badAngle: "\\frac{5\\pi}{4}",
            stdEq: (c: number) => (c === 1 ? "x - \\sqrt{3}y = 0" : `${c}x - ${c}\\sqrt{3}y = 0`),
          },
          {
            alpha: "\\frac{5\\pi}{4}",
            reducedAlpha: "\\frac{\\pi}{4}",
            deg: "225^\\circ",
            eq: "y = x",
            bad1: "y = -x",
            bad2: "y = \\sqrt{3}x",
            badAngle: "\\frac{4\\pi}{3}",
            stdEq: (c: number) => (c === 1 ? "x - y = 0" : `${c}x - ${c}y = 0`),
          },
          {
            alpha: "\\frac{4\\pi}{3}",
            reducedAlpha: "\\frac{\\pi}{3}",
            deg: "240^\\circ",
            eq: "y = \\sqrt{3}x",
            bad1: "y = -\\sqrt{3}x",
            bad2: "y = x",
            badAngle: "\\frac{5\\pi}{3}",
            stdEq: (c: number) => (c === 1 ? "\\sqrt{3}x - y = 0" : `${c}\\sqrt{3}x - ${c}y = 0`),
          },
          {
            alpha: "\\frac{5\\pi}{3}",
            reducedAlpha: "\\frac{2\\pi}{3}",
            deg: "300^\\circ",
            eq: "y = -\\sqrt{3}x",
            bad1: "y = \\sqrt{3}x",
            bad2: "y = x",
            badAngle: "\\frac{7\\pi}{4}",
            stdEq: (c: number) => (c === 1 ? "\\sqrt{3}x + y = 0" : `${c}\\sqrt{3}x + ${c}y = 0`),
          },
          {
            alpha: "\\frac{7\\pi}{4}",
            reducedAlpha: "\\frac{3\\pi}{4}",
            deg: "315^\\circ",
            eq: "y = -x",
            bad1: "y = x",
            bad2: "y = -\\sqrt{3}x",
            badAngle: "\\frac{11\\pi}{6}",
            stdEq: (c: number) => (c === 1 ? "x + y = 0" : `${c}x + ${c}y = 0`),
          },
          {
            alpha: "\\frac{11\\pi}{6}",
            reducedAlpha: "\\frac{5\\pi}{6}",
            deg: "330^\\circ",
            eq: "y = -\\frac{\\sqrt{3}}{3}x",
            bad1: "y = \\frac{\\sqrt{3}}{3}x",
            bad2: "y = -x",
            badAngle: "\\frac{5\\pi}{6}",
            stdEq: (c: number) => (c === 1 ? "x + \\sqrt{3}y = 0" : `${c}x + ${c}\\sqrt{3}y = 0`),
          },
        ];
        const item = rng.pick(lineData);
        const mode = rng.pick(["polarToCartRad", "polarToCartDeg", "cartToPolarSlope", "cartToPolarStd"]);

        if (mode === "cartToPolarStd") {
          const c = rng.int(1, 5);
          const cartEq = item.stdEq(c);
          return oneOf(
            rng,
            t(
              `Convert the Cartesian equation $${cartEq}$ into a polar equation of the form $\\theta = \\alpha$ with $0 \\le \\alpha < \\pi$.`,
              `将直角坐标方程 $${cartEq}$ 转化为形如 $\\theta = \\alpha$（$0 \\le \\alpha < \\pi$）的极坐标方程。`,
            ),
            t(`$\\theta = ${item.reducedAlpha}$`, `$\\theta = ${item.reducedAlpha}$`),
            [
              t(`$\\theta = ${item.badAngle}$`, `$\\theta = ${item.badAngle}$`),
              t(`$r = ${item.reducedAlpha}$`, `$r = ${item.reducedAlpha}$`),
              t(`$\\theta = 0$`, `$\\theta = 0$`),
            ],
            t(
              `Substitute $x = r\\cos\\theta$ and $y = r\\sin\\theta$ into $${cartEq}$ to find $\\tan\\theta$. For $0 \\le \\alpha < \\pi$, the polar equation is $\\theta = ${item.reducedAlpha}$.`,
              `将 $x = r\\cos\\theta$ 与 $y = r\\sin\\theta$ 代入 $${cartEq}$ 可得 $\\tan\\theta$ 的值。在 $0 \\le \\alpha < \\pi$ 范围内，极坐标方程为 $\\theta = ${item.reducedAlpha}$。`,
            ),
          );
        }

        if (mode === "cartToPolarSlope") {
          return oneOf(
            rng,
            t(
              `Convert the Cartesian line ${item.eq} into a polar equation of the form $\\theta = \\alpha$ with $0 \\le \\alpha < \\pi$.`,
              `将直角坐标直线 ${item.eq} 转化为形如 $\\theta = \\alpha$（$0 \\le \\alpha < \\pi$）的极坐标方程。`,
            ),
            t(`$\\theta = ${item.reducedAlpha}$`, `$\\theta = ${item.reducedAlpha}$`),
            [
              t(`$\\theta = ${item.badAngle}$`, `$\\theta = ${item.badAngle}$`),
              t(`$r = ${item.reducedAlpha}$`, `$r = ${item.reducedAlpha}$`),
              t(`$\\theta = 0$`, `$\\theta = 0$`),
            ],
            t(
              `The slope of ${item.eq} is $\\tan\\alpha$. For $0 \\le \\alpha < \\pi$, $\\theta = ${item.reducedAlpha}$.`,
              `直线 ${item.eq} 的斜率为 $\\tan\\alpha$。在 $0 \\le \\alpha < \\pi$ 内，$\\theta = ${item.reducedAlpha}$。`,
            ),
          );
        }

        const angleTex = mode === "polarToCartDeg" ? item.deg : item.alpha;
        return oneOf(
          rng,
          t(
            `Convert the polar equation $\\theta = ${angleTex}$ into a Cartesian equation.`,
            `将极坐标方程 $\\theta = ${angleTex}$ 转化为直角坐标方程。`,
          ),
          t(`$${item.eq}$`, `$${item.eq}$`),
          [t(`$${item.bad1}$`, `$${item.bad1}$`), t(`$${item.bad2}$`, `$${item.bad2}$`), t(`$x = 0$`, `$x = 0$`)],
          t(
            `Take tangent of both sides: $\\tan\\theta = \\tan\\left(${angleTex}\\right)$.\nSince $\\tan\\theta = y/x$, we obtain $y = (\\tan\\left(${angleTex}\\right))x$, which simplifies to ${item.eq}.`,
            `两边取正切得：$\\tan\\theta = \\tan\\left(${angleTex}\\right)$。\n由于 $\\tan\\theta = y/x$，化简即得 ${item.eq}。`,
          ),
        );
      },
    },
  ],
};

// ─── 9.29.5 Polar Equations of Circles Centered on Coordinate Axes ──────────

/** polarEquationsOfCirclesCenteredOnTheCoordinateAxes covers r = 2a cos theta and r = 2b sin theta. */
export const polarEquationsOfCirclesCenteredOnTheCoordinateAxes: TopicDef = {
  id: "polar-equations-of-circles-centered-on-the-coordinate-axes",
  title: t("Polar Equations of Circles Centered on the Coordinate Axes", "圆心在坐标轴上的圆的极坐标方程"),
  summary: t(
    "Understand polar equations of circles tangent to a coordinate axis at the pole: r = 2a cos θ (center (a, 0), radius |a|) and r = 2b sin θ (center (0, b), radius |b|), and convert to Cartesian form.",
    "掌握在极点处与坐标轴相切的圆的极坐标方程：r = 2a cos θ（圆心为 (a, 0)，半径为 |a|）与 r = 2b sin θ（圆心为 (0, b)，半径为 |b|），并将其转化为直角坐标方程。",
  ),
  prerequisites: ["polar-equations-of-circles-centered-at-the-origin", "converting-from-polar-coordinates-to-cartesian-coordinates"],
  encompasses: [{ topic: "polar-equations-of-circles-centered-at-the-origin", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSG.GPE.A.1", "CCSS.HSN.CN.B.4"],
  knowledgePoints: [
    {
      id: "circle-on-x-axis-polar",
      title: t("Circles of the form r = 2a cos θ", "形如 r = 2a cos θ 的圆"),
      explanation: t(
        "Multiplying $r = 2a\\cos\\theta$ by $r$ gives:\n$$r^2 = 2a(r\\cos\\theta) \\implies x^2 + y^2 = 2ax \\implies (x - a)^2 + y^2 = a^2$$\nThis is a circle with:\n- Center at $(a, 0)$ on the $x$-axis\n- Radius $R = |a|$\n- Passing through the pole $(0, 0)$ and tangent to the $y$-axis.",
        "将方程 $r = 2a\\cos\\theta$ 两端同乘 $r$ 可得：\n$$r^2 = 2a(r\\cos\\theta) \\implies x^2 + y^2 = 2ax \\implies (x - a)^2 + y^2 = a^2$$\n这表示一个圆，其特征为：\n- 圆心在 $x$ 轴上的 $(a, 0)$\n- 半径为 $R = |a|$\n- 经过极点 $(0, 0)$ 且与 $y$ 轴相切于极点。",
      ),
      generate(rng) {
        const a = rng.pick([-12, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12]);
        const twoA = 2 * a;
        const radius = Math.abs(a);
        const a2 = a * a;
        const mode = rng.pick(["fromPolar", "toPolar"]);

        if (mode === "toPolar") {
          const rightEq = `r = ${twoA}\\cos\\theta`;
          const wrong1 = `r = ${twoA}\\sin\\theta`;
          const wrong2 = `r = ${a}\\cos\\theta`;
          const wrong3 = `r = ${-twoA}\\cos\\theta`;
          return oneOf(
            rng,
            t(
              `Find the polar equation for the circle centered at $(${a}, 0)$ with radius $r = ${radius}$.`,
              `求圆心在 $(${a}, 0)$、半径为 $r = ${radius}$ 的圆的极坐标方程。`,
            ),
            t(`$${rightEq}$`, `$${rightEq}$`),
            [t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`), t(`$${wrong3}$`, `$${wrong3}$`)],
            t(
              `The standard Cartesian equation is $(x - ${a})^2 + y^2 = ${a2} \\implies x^2 + y^2 = ${twoA}x$.\nSubstitute $r^2 = x^2 + y^2$ and $x = r\\cos\\theta$:\n$$r^2 = ${twoA}r\\cos\\theta \\implies ${rightEq}$$`,
              `直角坐标方程为 $(x - ${a})^2 + y^2 = ${a2} \\implies x^2 + y^2 = ${twoA}x$。\n代入 $r^2 = x^2 + y^2$ 及 $x = r\\cos\\theta$：\n$$r^2 = ${twoA}r\\cos\\theta \\implies ${rightEq}$$`,
            ),
          );
        }

        return oneOf(
          rng,
          t(
            `Identify the center, radius, and Cartesian equation of the curve $r = ${twoA}\\cos\\theta$.`,
            `求极坐标方程 $r = ${twoA}\\cos\\theta$ 所表示圆的圆心、半径与直角坐标方程。`,
          ),
          t(
            `Center $(${a}, 0)$, radius $r = ${radius}$, equation $${sq("x", a)} + y^2 = ${a2}$`,
            `圆心 $(${a}, 0)$，半径 $r = ${radius}$，方程 $${sq("x", a)} + y^2 = ${a2}$`,
          ),
          [
            t(
              `Center $(0, ${a})$, radius $r = ${radius}$, equation $x^2 + ${sq("y", a)} = ${a2}$`,
              `圆心 $(0, ${a})$，半径 $r = ${radius}$，方程 $x^2 + ${sq("y", a)} = ${a2}$`,
            ),
            t(
              `Center $(${twoA}, 0)$, radius $r = ${Math.abs(twoA)}$, equation $${sq("x", twoA)} + y^2 = ${twoA * twoA}$`,
              `圆心 $(${twoA}, 0)$，半径 $r = ${Math.abs(twoA)}$，方程 $${sq("x", twoA)} + y^2 = ${twoA * twoA}$`,
            ),
            t(
              `Center $(${-a}, 0)$, radius $r = ${radius}$, equation $${sq("x", -a)} + y^2 = ${a2}$`,
              `圆心 $(${-a}, 0)$，半径 $r = ${radius}$，方程 $${sq("x", -a)} + y^2 = ${a2}$`,
            ),
          ],
          t(
            `Multiply by $r$: $r^2 = ${twoA}r\\cos\\theta \\implies x^2 + y^2 = ${twoA}x$.\nComplete the square: $x^2 - ${twoA}x + ${a2} + y^2 = ${a2} \\implies ${sq("x", a)} + y^2 = ${a2}$.\nCenter is $(${a}, 0)$ and radius is ${radius}$.`,
            `两端同乘 $r$ 得 $r^2 = ${twoA}r\\cos\\theta \\implies x^2 + y^2 = ${twoA}x$。\n配方得 $x^2 - ${twoA}x + ${a2} + y^2 = ${a2} \\implies ${sq("x", a)} + y^2 = ${a2}$。\n因此圆心为 $(${a}, 0)$，半径为 ${radius}$。`,
          ),
        );
      },
    },
    {
      id: "circle-on-y-axis-polar",
      title: t("Circles of the form r = 2b sin θ", "形如 r = 2b sin θ 的圆"),
      explanation: t(
        "Multiplying $r = 2b\\sin\\theta$ by $r$ gives:\n$$r^2 = 2b(r\\sin\\theta) \\implies x^2 + y^2 = 2by \\implies x^2 + (y - b)^2 = b^2$$\nThis is a circle with:\n- Center at $(0, b)$ on the $y$-axis\n- Radius $R = |b|$\n- Passing through the pole $(0, 0)$ and tangent to the $x$-axis.",
        "将方程 $r = 2b\\sin\\theta$ 两端同乘 $r$ 可得：\n$$r^2 = 2b(r\\sin\\theta) \\implies x^2 + y^2 = 2by \\implies x^2 + (y - b)^2 = b^2$$\n这表示一个圆，其特征为：\n- 圆心在 $y$ 轴上的 $(0, b)$\n- 半径为 $R = |b|$\n- 经过极点 $(0, 0)$ 且与 $x$ 轴相切于极点。",
      ),
      generate(rng) {
        const b = rng.pick([-12, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12]);
        const twoB = 2 * b;
        const radius = Math.abs(b);
        const b2 = b * b;
        const mode = rng.pick(["fromPolar", "toPolar"]);

        if (mode === "toPolar") {
          const rightEq = `r = ${twoB}\\sin\\theta`;
          const wrong1 = `r = ${twoB}\\cos\\theta`;
          const wrong2 = `r = ${b}\\sin\\theta`;
          const wrong3 = `r = ${-twoB}\\sin\\theta`;
          return oneOf(
            rng,
            t(
              `Find the polar equation for the circle centered at $(0, ${b})$ with radius $r = ${radius}$.`,
              `求圆心在 $(0, ${b})$、半径为 $r = ${radius}$ 的圆的极坐标方程。`,
            ),
            t(`$${rightEq}$`, `$${rightEq}$`),
            [t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`), t(`$${wrong3}$`, `$${wrong3}$`)],
            t(
              `The standard Cartesian equation is $x^2 + (y - ${b})^2 = ${b2} \\implies x^2 + y^2 = ${twoB}y$.\nSubstitute $r^2 = x^2 + y^2$ and $y = r\\sin\\theta$:\n$$r^2 = ${twoB}r\\sin\\theta \\implies ${rightEq}$$`,
              `直角坐标方程为 $x^2 + (y - ${b})^2 = ${b2} \\implies x^2 + y^2 = ${twoB}y$。\n代入 $r^2 = x^2 + y^2$ 及 $y = r\\sin\\theta$：\n$$r^2 = ${twoB}r\\sin\\theta \\implies ${rightEq}$$`,
            ),
          );
        }

        return oneOf(
          rng,
          t(
            `Identify the center, radius, and Cartesian equation of the curve $r = ${twoB}\\sin\\theta$.`,
            `求极坐标方程 $r = ${twoB}\\sin\\theta$ 所表示圆的圆心、半径与直角坐标方程。`,
          ),
          t(
            `Center $(0, ${b})$, radius $r = ${radius}$, equation $x^2 + ${sq("y", b)} = ${b2}$`,
            `圆心 $(0, ${b})$，半径 $r = ${radius}$，方程 $x^2 + ${sq("y", b)} = ${b2}$`,
          ),
          [
            t(
              `Center $(${b}, 0)$, radius $r = ${radius}$, equation $${sq("x", b)} + y^2 = ${b2}$`,
              `圆心 $(${b}, 0)$，半径 $r = ${radius}$，方程 $${sq("x", b)} + y^2 = ${b2}$`,
            ),
            t(
              `Center $(0, ${twoB})$, radius $r = ${Math.abs(twoB)}$, equation $x^2 + ${sq("y", twoB)} = ${twoB * twoB}$`,
              `圆心 $(0, ${twoB})$, 半径 $r = ${Math.abs(twoB)}$，方程 $x^2 + ${sq("y", twoB)} = ${twoB * twoB}$`,
            ),
            t(
              `Center $(0, ${-b})$, radius $r = ${radius}$, equation $x^2 + ${sq("y", -b)} = ${b2}$`,
              `圆心 $(0, ${-b})$，半径 $r = ${radius}$，方程 $x^2 + ${sq("y", -b)} = ${b2}$`,
            ),
          ],
          t(
            `Multiply by $r$: $r^2 = ${twoB}r\\sin\\theta \\implies x^2 + y^2 = ${twoB}y$.\nComplete the square: $x^2 + y^2 - ${twoB}y + ${b2} = ${b2} \\implies x^2 + ${sq("y", b)} = ${b2}$.\nCenter is $(0, ${b})$ and radius is ${radius}$.`,
            `两端同乘 $r$ 得 $r^2 = ${twoB}r\\sin\\theta \\implies x^2 + y^2 = ${twoB}y$。\n配方得 $x^2 + y^2 - ${twoB}y + ${b2} = ${b2} \\implies x^2 + ${sq("y", b)} = ${b2}$。\n因此圆心为 $(0, ${b})$，半径为 ${radius}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 9.29.6 Finding Intersections of Polar Curves ───────────────────────────

/** findingIntersectionsOfPolarCurves covers solving simultaneous polar curves and pole intersection. */
export const findingIntersectionsOfPolarCurves: TopicDef = {
  id: "finding-intersections-of-polar-curves",
  title: t("Finding Intersections of Polar Curves", "求极坐标曲线的交点"),
  summary: t(
    "Find intersection points of polar curves by solving r₁(θ) = r₂(θ) simultaneously, accounting for alternative coordinate representations and testing whether the pole is a shared point.",
    "通过联立求解 r₁(θ) = r₂(θ) 寻找极坐标曲线的交点，注意多重极坐标表示，并特别检验极点（r = 0）是否为两曲线的公共交点。",
  ),
  prerequisites: ["polar-equations-of-circles-centered-on-the-coordinate-axes"],
  encompasses: [{ topic: "polar-equations-of-circles-centered-on-the-coordinate-axes", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSN.CN.B.4"],
  knowledgePoints: [
    {
      id: "solve-simultaneous-polar-equations",
      title: t("Solving simultaneous polar equations", "联立求解极坐标方程"),
      explanation: t(
        "To find the intersection points of two polar curves $r_1(\\theta)$ and $r_2(\\theta)$:\n1. Set $r_1(\\theta) = r_2(\\theta)$ and solve for $\\theta \\in [0, 2\\pi)$.\n2. Compute $r$ for each solution to obtain $(r, \\theta)$.\n\nFor example, to intersect $r = 3$ and $r = 6\\cos\\theta$:\n$$6\\cos\\theta = 3 \\implies \\cos\\theta = \\frac{1}{2} \\implies \\theta = \\frac{\\pi}{3}, \\; \\frac{5\\pi}{3}$$\nyielding points $(3, \\frac{\\pi}{3})$ and $(3, \\frac{5\\pi}{3})$.",
        "求解两极坐标曲线 $r_1(\\theta)$ 与 $r_2(\\theta)$ 的交点方法：\n1. 令 $r_1(\\theta) = r_2(\\theta)$ 并在 $[0, 2\\pi)$ 内求解 $\\theta$。\n2. 将解出的每个 $\\theta$ 代入求出 $r$，得到交点极坐标 $(r, \\theta)$。\n\n例如，求 $r = 3$ 与 $r = 6\\cos\\theta$ 的交点：\n$$6\\cos\\theta = 3 \\implies \\cos\\theta = \\frac{1}{2} \\implies \\theta = \\frac{\\pi}{3}, \\; \\frac{5\\pi}{3}$$\n交点为 $(3, \\frac{\\pi}{3})$ 和 $(3, \\frac{5\\pi}{3})$。",
      ),
      generate(rng) {
        const a = rng.int(2, 14);
        const twoA = 2 * a;
        const kind = rng.pick(["cosHalf", "sinHalf", "cosRad2", "sinRad2"]);

        if (kind === "cosRad2") {
          const eq1 = `${a}\\sqrt{2}`;
          const p1 = `(${eq1}, \\frac{\\pi}{4})`;
          const p2 = `(${eq1}, \\frac{7\\pi}{4})`;
          const rightChoice = `$${p1}$ and $${p2}$`;
          const wrong1 = `(${eq1}, \\frac{\\pi}{3}) and (${eq1}, \\frac{5\\pi}{3})`;
          const wrong2 = `(${twoA}, \\frac{\\pi}{4}) and (${twoA}, \\frac{7\\pi}{4})`;
          const wrong3 = `(${eq1}, \\frac{3\\pi}{4}) and (${eq1}, \\frac{5\\pi}{4})`;
          return oneOf(
            rng,
            t(
              `Find the intersection points of the polar curves $r = ${eq1}$ and $r = ${twoA}\\cos\\theta$ for $0 \\le \\theta < 2\\pi$.`,
              `求极坐标曲线 $r = ${eq1}$ 与 $r = ${twoA}\\cos\\theta$ 在 $0 \\le \\theta < 2\\pi$ 上的交点坐标。`,
            ),
            t(rightChoice, rightChoice),
            [t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`), t(`$${wrong3}$`, `$${wrong3}$`)],
            t(
              `Set equations equal: ${twoA}\\cos\\theta = ${eq1} \\implies \\cos\\theta = \\frac{\\sqrt{2}}{2}$.\nOn $[0, 2\\pi)$, $\\theta = \\frac{\\pi}{4}, \\frac{7\\pi}{4}$.\nThus the intersection points are $${p1}$ and $${p2}$.`,
              `联立方程：${twoA}\\cos\\theta = ${eq1} \\implies \\cos\\theta = \\frac{\\sqrt{2}}{2}$。\n在 $[0, 2\\pi)$ 内解得 $\\theta = \\frac{\\pi}{4}, \\frac{7\\pi}{4}$。\n因此交点为 $${p1}$ 和 $${p2}$。`,
            ),
          );
        }

        if (kind === "sinRad2") {
          const eq1 = `${a}\\sqrt{2}`;
          const p1 = `(${eq1}, \\frac{\\pi}{4})`;
          const p2 = `(${eq1}, \\frac{3\\pi}{4})`;
          const rightChoice = `$${p1}$ and $${p2}$`;
          const wrong1 = `(${eq1}, \\frac{\\pi}{6}) and (${eq1}, \\frac{5\\pi}{6})`;
          const wrong2 = `(${twoA}, \\frac{\\pi}{4}) and (${twoA}, \\frac{3\\pi}{4})`;
          const wrong3 = `(${eq1}, \\frac{5\\pi}{4}) and (${eq1}, \\frac{7\\pi}{4})`;
          return oneOf(
            rng,
            t(
              `Find the intersection points of the polar curves $r = ${eq1}$ and $r = ${twoA}\\sin\\theta$ for $0 \\le \\theta < 2\\pi$.`,
              `求极坐标曲线 $r = ${eq1}$ 与 $r = ${twoA}\\sin\\theta$ 在 $0 \\le \\theta < 2\\pi$ 上的交点坐标。`,
            ),
            t(rightChoice, rightChoice),
            [t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`), t(`$${wrong3}$`, `$${wrong3}$`)],
            t(
              `Set equations equal: ${twoA}\\sin\\theta = ${eq1} \\implies \\sin\\theta = \\frac{\\sqrt{2}}{2}$.\nOn $[0, 2\\pi)$, $\\theta = \\frac{\\pi}{4}, \\frac{3\\pi}{4}$.\nThus the intersection points are $${p1}$ and $${p2}$.`,
              `联立方程：${twoA}\\sin\\theta = ${eq1} \\implies \\sin\\theta = \\frac{\\sqrt{2}}{2}$。\n在 $[0, 2\\pi)$ 内解得 $\\theta = \\frac{\\pi}{4}, \\frac{3\\pi}{4}$。\n因此交点为 $${p1}$ 和 $${p2}$。`,
            ),
          );
        }

        const isCos = kind === "cosHalf";
        const eq2 = isCos ? `${twoA}\\cos\\theta` : `${twoA}\\sin\\theta`;
        const p1 = isCos ? `(${a}, \\frac{\\pi}{3})` : `(${a}, \\frac{\\pi}{6})`;
        const p2 = isCos ? `(${a}, \\frac{5\\pi}{3})` : `(${a}, \\frac{5\\pi}{6})`;
        const rightChoice = `$${p1}$ and $${p2}$`;
        const wrong1 = isCos
          ? `(${a}, \\frac{\\pi}{6}) and (${a}, \\frac{11\\pi}{6})`
          : `(${a}, \\frac{\\pi}{3}) and (${a}, \\frac{2\\pi}{3})`;
        const wrong2 = `(${twoA}, \\frac{\\pi}{4}) and (${twoA}, \\frac{7\\pi}{4})`;
        const wrong3 = `(${a}, \\frac{\\pi}{4}) and (${a}, \\frac{5\\pi}{4})`;
        return oneOf(
          rng,
          t(
            `Find the intersection points of the polar curves $r = ${a}$ and $r = ${eq2}$ for $0 \\le \\theta < 2\\pi$.`,
            `求极坐标曲线 $r = ${a}$ 与 $r = ${eq2}$ 在 $0 \\le \\theta < 2\\pi$ 上的交点坐标。`,
          ),
          t(rightChoice, rightChoice),
          [t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`), t(`$${wrong3}$`, `$${wrong3}$`)],
          t(
            `Set equations equal: ${eq2} = ${a} \\implies ${isCos ? "\\cos" : "\\sin"}\\theta = \\frac{1}{2}$.\nOn $[0, 2\\pi)$, $\\theta = ${isCos ? "\\frac{\\pi}{3}, \\frac{5\\pi}{3}" : "\\frac{\\pi}{6}, \\frac{5\\pi}{6}"}$.\nThe points are $${p1}$ and $${p2}$.`,
            `联立方程：${eq2} = ${a} \\implies ${isCos ? "\\cos" : "\\sin"}\\theta = \\frac{1}{2}$。\n在 $[0, 2\\pi)$ 内，解得 $\\theta = ${isCos ? "\\frac{\\pi}{3}, \\frac{5\\pi}{3}" : "\\frac{\\pi}{6}, \\frac{5\\pi}{6}"}$。\n因此交点为 $${p1}$ 和 $${p2}$。`,
          ),
        );
      },
    },
    {
      id: "pole-as-polar-intersection",
      title: t("The pole as an intersection point", "极点作为交点的检验"),
      explanation: t(
        "The pole is represented by $(0, \\theta)$ for **any** angle $\\theta$. As a result, two polar curves can both pass through the pole at different angles $\\theta_1 \\ne \\theta_2$.\nSuch a shared point may not show up by simply equating $r_1(\\theta) = r_2(\\theta)$!\n\nTo verify if the pole is an intersection point:\n1. Check whether there is a $\\theta_1$ with $r_1(\\theta_1) = 0$.\n2. Check whether there is a $\\theta_2$ with $r_2(\\theta_2) = 0$.\nIf both curves pass through $r = 0$, the pole $(0, 0)$ is an intersection point.",
        "极点由 $(0, \\theta)$ 表示，对于**任意**角度 $\\theta$ 均代表同一点。因此，两条极坐标曲线完全可以在不同角度 $\\theta_1 \\ne \\theta_2$ 处穿过极点。\n这种交点往往无法通过直接联立方程 $r_1(\\theta) = r_2(\\theta)$ 求解得到！\n\n检验极点是否为交点的方法：\n1. 检查是否存在 $\\theta_1$ 使得 $r_1(\\theta_1) = 0$。\n2. 检查是否存在 $\\theta_2$ 使得 $r_2(\\theta_2) = 0$。\n若两曲线均能取到 $r = 0$，则极点 $(0, 0)$ 是它们的公共交点。",
      ),
      generate(rng) {
        const a = rng.int(1, 8);
        const b = rng.int(1, 8);
        const twoA = 2 * a;
        const twoB = 2 * b;
        return oneOf(
          rng,
          t(
            `Do the polar curves $C_1: r = ${twoA}\\cos\\theta$ and $C_2: r = ${twoB}\\sin\\theta$ intersect at the pole, and what is the total number of distinct intersection points in the plane?`,
            `极坐标曲线 $C_1: r = ${twoA}\\cos\\theta$ 与 $C_2: r = ${twoB}\\sin\\theta$ 是否相交于极点？它们在平面内共有几个不同的交点？`,
          ),
          t(
            `Yes, the pole is an intersection point; there are 2 intersection points in total (the pole and 1 other point).`,
            `是，极点是交点；平面内共有 2 个交点（极点及另外 1 个点）。`,
          ),
          [
            t(
              `No, the pole is not an intersection point; there is only 1 intersection point in total.`,
              `否，极点不是交点；平面内只有 1 个交点。`,
            ),
            t(`Yes, the pole is an intersection point; there are 4 intersection points in total.`, `是，极点是交点；平面内共有 4 个交点。`),
            t(`No, the two curves do not intersect anywhere.`, `否，两条曲线在平面内没有任何交点。`),
          ],
          t(
            `Testing the pole $r = 0$:\n- For $C_1$: $r = 0$ when $\\theta = \\frac{\\pi}{2}$ (since $\\cos\\frac{\\pi}{2} = 0$).\n- For $C_2$: $r = 0$ when $\\theta = 0$ (since $\\sin 0 = 0$).\nBoth curves pass through the pole, so the pole is an intersection point.\nEquating non-zero radii: $2a\\cos\\theta = 2b\\sin\\theta \\implies \\tan\\theta = \\frac{a}{b} = \\frac{${a}}{${b}}$, giving a second intersection point.\nThus there are 2 distinct intersection points in total.`,
            `检验极点 $r = 0$：\n- 对于 $C_1$：当 $\\theta = \\frac{\\pi}{2}$ 时 $r = 0$（因为 $\\cos\\frac{\\pi}{2} = 0$）。\n- 对于 $C_2$：当 $\\theta = 0$ 时 $r = 0$（因为 $\\sin 0 = 0$）。\n两曲线均经过极点，因此极点是交点。\n联立非零极径：$2a\\cos\\theta = 2b\\sin\\theta \\implies \\tan\\theta = \\frac{a}{b} = \\frac{${a}}{${b}}$，在 $[0, \\pi)$ 内产生第 2 个交点。\n因此平面内共有 2 个不同的交点。`,
          ),
        );
      },
    },
  ],
};

// ─── Exported Topics Array ──────────────────────────────────────────────────

/** precalculusParametricPolarTopics contains the 16 topics of Units 8 & 9. */
export const precalculusParametricPolarTopics: readonly TopicDef[] = [
  graphingCurvesDefinedParametrically,
  cartesianEquationsOfParametricCurves,
  findingInterceptsOfCurvesDefinedParametrically,
  findingIntersectionsOfParametricCurvesAndLines,
  parametricEquationsOfCircles,
  parametricEquationsOfEllipses,
  parametricEquationsOfParabolas,
  parametricEquationsOfParabolasCenteredAtHk,
  parametricEquationsOfHorizontalHyperbolas,
  parametricEquationsOfVerticalHyperbolas,
  introductionToPolarCoordinates,
  convertingFromPolarCoordinatesToCartesianCoordinates,
  polarEquationsOfCirclesCenteredAtTheOrigin,
  polarEquationsOfRadialLines,
  polarEquationsOfCirclesCenteredOnTheCoordinateAxes,
  findingIntersectionsOfPolarCurves,
];
