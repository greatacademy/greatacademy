// Partial Differential Equations: classification, first-order equations and characteristics,
// separation of variables, the heat, wave and Laplace equations, and finite differences.

import type { TopicDef } from "@ga/content";
import { gcd, Q } from "@ga/subject-math";

import { ask, choose, type Pair, point, same, topic } from "../university-kit.ts";

/** times writes a coefficient before a term, leaving out a coefficient of one. */
const times = (c: number, v: string) => (c === 1 ? v : c === -1 ? `-${v}` : `${c}${v}`);

/** shifted writes a variable plus a signed number. */
const shifted = (v: string, a: number) => (a === 0 ? v : a < 0 ? `${v} - ${-a}` : `${v} + ${a}`);

/** mode writes the sine of a multiple of pi x over L, in lowest terms. */
const mode = (n: number, L: number, fn = "\\sin") => {
  const g = gcd(n, L);
  const [top, bottom] = [n / g, L / g];
  const inner = bottom === 1 ? `${times(top, "\\pi")} x` : `\\frac{${times(top, "\\pi")} x}{${bottom}}`;
  return `${fn}\\left(${inner}\\right)`;
};

const introduction = topic(
  "introduction-to-partial-differential-equations",
  ["Introduction to Partial Differential Equations", "偏微分方程简介"],
  ["Read the order of an equation, and check a proposed solution.", "读出方程的阶，并验证给定的解。"],
  ["higher-order-partial-derivatives"],
  [],
  [
    point(
      "the-order-of-an-equation",
      ["The order of an equation", "方程的阶"],
      [
        "A partial differential equation relates an unknown function of several variables to its partial derivatives. Its order is the order of the highest derivative that appears, counting all differentiations, whichever variables they are with respect to. So a mixed derivative in x and t counts as second order. The order largely decides how many initial and boundary conditions a problem needs to determine a single solution.",
        "偏微分方程把多元未知函数和它的偏导数联系起来。它的阶是方程中最高阶导数的阶，不论对哪个变量求导，所有求导次数都要算上。所以对 x 和 t 的混合导数算二阶。阶在很大程度上决定了问题需要多少初始条件和边界条件才能确定唯一的解。",
      ],
      (rng) => {
        const c = rng.int(2, 12);
        const d = rng.int(2, 12);
        const [text, answer] = rng.pick<[string, number]>([
          [`u_t = ${c}u_{xx} + ${d}u`, 2],
          [`u_t + ${c}u_x = ${d}`, 1],
          [`u_{tt} = ${c}u_{xxxx} + ${d}u_x`, 4],
          [`u_{xxt} + ${c}u_x = ${d}u`, 3],
          [`u_{xt} = ${c}u + ${d}`, 2],
          [`u_t + ${c}u_{xxx} = ${d}u_x`, 3],
        ]);
        return ask(
          [`What is the order of $${text}$?`, `$${text}$ 的阶是多少？`],
          answer,
          [answer + 1, answer === 1 ? 2 : answer - 1, c, 0],
          [
            `The highest derivative in the equation has order ${answer}, counting every differentiation in it.`,
            `方程中最高阶导数的阶是 ${answer}，其中每次求导都要算上。`,
          ],
        );
      },
    ),
    point(
      "checking-a-solution",
      ["Checking a solution", "验证解"],
      [
        "To check a proposed solution, compute the derivatives in the equation and substitute them. No solving is needed, and the check often determines an unknown constant. Partial differential equations have very many solutions, far more than ordinary ones, since an arbitrary function can take the place of an arbitrary constant. So a function that satisfies the equation need not meet the conditions of a particular problem as well.",
        "验证给定的解时，计算方程中的导数再代入即可。不需要求解，这种验证常常还能确定未知常数。偏微分方程的解非常多，比常微分方程多得多，因为任意函数可以取代任意常数。所以满足方程的函数不一定也满足具体问题的条件。",
      ],
      (rng) => {
        const c = rng.int(2, 15);
        const p = rng.int(1, 9);
        const q = rng.int(-9, 9);
        const answer = 2 * c * p;
        return ask(
          [
            `For which $k$ does $u = ${times(p, "x^2")} + kt${q === 0 ? "" : q > 0 ? ` + ${q}` : ` - ${-q}`}$ solve $u_t = ${c}u_{xx}$?`,
            `当 $k$ 为何值时，$u = ${times(p, "x^2")} + kt${q === 0 ? "" : q > 0 ? ` + ${q}` : ` - ${-q}`}$ 满足 $u_t = ${c}u_{xx}$？`,
          ],
          answer,
          [c * p, 2 * p, 2 * c, answer + 1],
          [
            `$u_t = k$ and $u_{xx} = ${2 * p}$, so $k = ${c}(${2 * p}) = ${answer}$.`,
            `$u_t = k$，$u_{xx} = ${2 * p}$，所以 $k = ${c}(${2 * p}) = ${answer}$。`,
          ],
        );
      },
    ),
  ],
);

const classifying = topic(
  "classifying-second-order-equations",
  ["Classifying Second-Order Equations", "二阶方程的分类"],
  ["Use the discriminant to tell elliptic, parabolic and hyperbolic equations apart.", "用判别式区分椭圆型、抛物型和双曲型方程。"],
  ["introduction-to-partial-differential-equations"],
  [],
  [
    point(
      "the-discriminant",
      ["The discriminant", "判别式"],
      [
        "A second-order linear equation has the form A times the second x derivative, plus B times the mixed derivative, plus C times the second y derivative, plus lower terms. Its discriminant is $B^2 - 4AC$, as for a conic section. The name is no accident: these three coefficients control the equation in the way that they control the shape of a conic, and the lower terms have no effect on the type.",
        "二阶线性方程的形式是 A 乘对 x 的二阶导数，加 B 乘混合导数，加 C 乘对 y 的二阶导数，再加低阶项。它的判别式是 $B^2 - 4AC$，和圆锥曲线一样。这不是巧合：这三个系数控制方程的方式，正如它们控制圆锥曲线的形状，而低阶项不影响类型。",
      ],
      (rng) => {
        const [A, B, C] = [rng.int(1, 6), rng.int(1, 9), rng.int(-5, 6)];
        const e = rng.int(2, 9);
        const answer = B * B - 4 * A * C;
        const third = C === 0 ? "" : C > 0 ? ` + ${times(C, "u_{yy}")}` : ` - ${times(-C, "u_{yy}")}`;
        const equation = `${times(A, "u_{xx}")} + ${times(B, "u_{xy}")}${third} + ${e}u_x = 0`;
        return ask(
          [`What is the discriminant of $${equation}$?`, `$${equation}$ 的判别式是多少？`],
          answer,
          [B * B + 4 * A * C, B - 4 * A * C, B * B - 2 * A * C, answer + e],
          [
            `$B^2 - 4AC = ${B * B} - 4(${A})(${C}) = ${answer}$. The term in $u_x$ plays no part.`,
            `$B^2 - 4AC = ${B * B} - 4(${A})(${C}) = ${answer}$。$u_x$ 项不起作用。`,
          ],
        );
      },
    ),
    point(
      "naming-the-type",
      ["Naming the type", "判断类型"],
      [
        "A negative discriminant makes an equation elliptic, a zero discriminant makes it parabolic, and a positive one makes it hyperbolic. Laplace's equation, the heat equation and the wave equation are the models of the three types, and solutions of each type behave in their own way: elliptic problems describe steady states, parabolic ones describe smoothing diffusion, and hyperbolic ones carry waves at a finite speed.",
        "判别式为负时方程是椭圆型，为零时是抛物型，为正时是双曲型。拉普拉斯方程、热方程和波动方程分别是这三种类型的模型，每种类型的解都有自己的行为：椭圆型问题描述稳态，抛物型问题描述平滑的扩散，双曲型问题以有限速度传播波。",
      ],
      (rng) => {
        const p = rng.int(1, 6);
        const q = rng.int(1, 12);
        const kind = rng.pick(["elliptic", "parabolic", "hyperbolic"]);
        const words: Record<string, Pair> = {
          elliptic: ["Elliptic", "椭圆型"],
          parabolic: ["Parabolic", "抛物型"],
          hyperbolic: ["Hyperbolic", "双曲型"],
        };
        const B = kind === "parabolic" ? 2 * p * q : rng.int(1, 3);
        const C = kind === "parabolic" ? p * q * q : kind === "elliptic" ? rng.int(B * B, B * B + 9) : -q;
        const third = C > 0 ? `+ ${times(C, "u_{yy}")}` : `- ${times(-C, "u_{yy}")}`;
        const A = kind === "parabolic" ? p : 1;
        const d = B * B - 4 * A * C;
        return choose(
          rng,
          [
            `What type is $${times(A, "u_{xx}")} + ${times(B, "u_{xy}")} ${third} = 0$?`,
            `$${times(A, "u_{xx}")} + ${times(B, "u_{xy}")} ${third} = 0$ 是什么类型？`,
          ],
          words[kind] as Pair,
          [
            ...Object.entries(words)
              .filter(([w]) => w !== kind)
              .map(([, w]) => w),
            ["Not of any type", "不属于任何类型"],
          ],
          [
            `The discriminant is $${d}$, so the equation is ${(words[kind] as Pair)[0].toLowerCase()}.`,
            `判别式是 $${d}$，所以方程是${(words[kind] as Pair)[1]}。`,
          ],
        );
      },
    ),
  ],
);

const transport = topic(
  "the-transport-equation",
  ["The Transport Equation", "输运方程"],
  ["Solve the simplest first-order equation by following the moving profile.", "沿移动的波形求解最简单的一阶方程。"],
  ["introduction-to-partial-differential-equations"],
  [],
  [
    point(
      "a-value-of-the-moving-profile",
      ["A value of the moving profile", "移动波形的值"],
      [
        "The transport equation says that the time derivative plus c times the x derivative is zero. Its solution is the starting profile sliding to the right at speed c without changing shape: u of x and t equals f of x minus ct. To find a value, trace back to the point where the profile came from. Substitution confirms that the chain rule makes the two terms cancel.",
        "输运方程说，时间导数加 c 乘 x 的导数等于零。它的解是初始波形以速度 c 向右滑动，形状不变：u(x, t) 等于 f(x − ct)。求值时，要追溯到波形出发的位置。代入后可以确认，链式法则使这两项相消。",
      ],
      (rng) => {
        const c = rng.int(2, 6);
        const t = rng.int(1, 5);
        const x = rng.int(-6, 14);
        const p = rng.int(1, 5);
        const foot = x - c * t;
        const answer = p * foot * foot;
        return ask(
          [
            `Let $u_t + ${c}u_x = 0$ with $u(x, 0) = ${times(p, "x^2")}$. What is $u(${x}, ${t})$?`,
            `设 $u_t + ${c}u_x = 0$，$u(x, 0) = ${times(p, "x^2")}$。$u(${x}, ${t})$ 是多少？`,
          ],
          answer,
          [p * x * x, p * (x + c * t) * (x + c * t), answer + 1, p * foot],
          [
            `$u(x, t) = f(x - ${c}t)$, and the point traces back to $x = ${foot}$, so the value is $${answer}$.`,
            `$u(x, t) = f(x - ${c}t)$，这一点追溯到 $x = ${foot}$，所以值是 $${answer}$。`,
          ],
        );
      },
    ),
    point(
      "the-foot-of-a-characteristic",
      ["The foot of a characteristic", "特征线的起点"],
      [
        "The lines along which the solution stays constant are called characteristics. For speed c, they are the straight lines x minus ct equal to a constant in the plane of x and t. Each one starts from a point on the x axis, called its foot, and carries that point's initial value forward. So the speed may be negative, in which case the characteristics lean to the left.",
        "解保持不变的那些直线称为特征线。速度为 c 时，它们是 x − ct 等于常数的直线，位于 x-t 平面中。每条特征线都从 x 轴上的一点出发，这一点称为它的起点，并把该点的初始值向前传递。速度也可以是负的，这时特征线向左倾斜。",
      ],
      (rng) => {
        const c = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
        const t = rng.int(1, 7);
        const x = rng.int(-9, 12);
        const answer = x - c * t;
        const term = c < 0 ? `- ${-c}u_x` : `+ ${c}u_x`;
        return ask(
          [
            `For $u_t ${term} = 0$, where does the characteristic through $(x, t) = (${x}, ${t})$ meet the $x$ axis?`,
            `对于 $u_t ${term} = 0$，经过 $(x, t) = (${x}, ${t})$ 的特征线与 $x$ 轴交于何处？`,
          ],
          answer,
          [x + c * t, x, c * t, answer + 1],
          [
            `$x - (${c})t$ is constant along the line, so the foot is at $${x} - (${c})(${t}) = ${answer}$.`,
            `$x - (${c})t$ 沿这条线不变，所以起点在 $${x} - (${c})(${t}) = ${answer}$。`,
          ],
        );
      },
    ),
  ],
);

const characteristics = topic(
  "the-method-of-characteristics",
  ["The Method of Characteristics", "特征线法"],
  ["Reduce first-order equations to ordinary ones along special curves.", "沿特殊曲线把一阶方程化为常微分方程。"],
  ["the-transport-equation"],
  [["the-transport-equation", 0.5]],
  [
    point(
      "a-constant-source",
      ["A constant source", "常数源项"],
      [
        "The method of characteristics follows a curve along which a first-order equation becomes an ordinary one. With a constant source s on the right side, the solution along a characteristic changes at the rate s, rather than remaining constant. So the value at time t is the initial value at the foot, plus s times t. In this way the partial differential equation reduces to a one-line integration.",
        "特征线法沿一条曲线，使一阶方程变成常微分方程。右端有常数源项 s 时，解沿特征线以速率 s 变化，而不是保持不变。所以时刻 t 的值等于起点的初始值加 s 乘 t。这样偏微分方程就化成了一行积分。",
      ],
      (rng) => {
        const c = rng.int(2, 5);
        const s = rng.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);
        const t = rng.int(1, 6);
        const x = rng.int(0, 20);
        const m = rng.int(2, 7);
        const foot = x - c * t;
        const answer = m * foot + s * t;
        return ask(
          [
            `Let $u_t + ${c}u_x = ${s}$ with $u(x, 0) = ${m}x$. What is $u(${x}, ${t})$?`,
            `设 $u_t + ${c}u_x = ${s}$，$u(x, 0) = ${m}x$。$u(${x}, ${t})$ 是多少？`,
          ],
          answer,
          [m * foot, m * x + s * t, m * foot - s * t, answer + 1],
          [
            `The foot is $x = ${foot}$, with initial value $${m * foot}$. Adding $(${s})(${t})$ gives $${answer}$.`,
            `起点是 $x = ${foot}$，初始值是 $${m * foot}$。加上 $(${s})(${t})$，得 $${answer}$。`,
          ],
        );
      },
    ),
    point(
      "a-variable-speed",
      ["A variable speed", "变化的速度"],
      [
        "Characteristics need not be straight. For the time derivative plus x times the x derivative equal to zero, the speed at each place is x, so a characteristic solves the ordinary equation dx over dt equal to x, and it is an exponential curve. Following it back from a point at time t lands at x times $e^{-t}$. The solution there equals the initial value at that foot.",
        "特征线不一定是直线。对于时间导数加 x 乘 x 的导数等于零的方程，每处的速度是 x，所以特征线满足常微分方程 dx/dt = x，它是指数曲线。从时刻 t 的一点沿它回溯，到达 x 乘 $e^{-t}$。这一点的解等于这个起点的初始值。",
      ],
      (rng) => {
        const k = rng.int(2, 5);
        const foot = rng.int(1, 6);
        const p = rng.int(2, 9);
        const x = k * foot;
        const q = rng.int(1, 9);
        const answer = p * foot + q;
        return ask(
          [
            `Let $u_t + xu_x = 0$ with $u(x, 0) = ${p}x + ${q}$. What is $u(${x}, \\ln ${k})$?`,
            `设 $u_t + xu_x = 0$，$u(x, 0) = ${p}x + ${q}$。$u(${x}, \\ln ${k})$ 是多少？`,
          ],
          answer,
          [p * x + q, p * foot, Q.of(p * x, k * k).add(Q.of(q)), answer + 1],
          [
            `The foot is $${x}e^{-\\ln ${k}} = \\frac{${x}}{${k}} = ${foot}$, so the value is $${p}(${foot}) + ${q} = ${answer}$.`,
            `起点是 $${x}e^{-\\ln ${k}} = \\frac{${x}}{${k}} = ${foot}$，所以值是 $${p}(${foot}) + ${q} = ${answer}$。`,
          ],
        );
      },
    ),
  ],
);

const separation = topic(
  "separation-of-variables-for-pdes",
  ["Separation of Variables for PDEs", "偏微分方程的分离变量法"],
  ["Split an equation into ordinary equations, and read off eigenvalues.", "把方程拆成常微分方程，并读出特征值。"],
  ["introduction-to-partial-differential-equations", "eigenvalues-and-eigenfunctions-of-homogeneous-bvps"],
  [],
  [
    point(
      "the-eigenvalues-for-fixed-ends",
      ["The eigenvalues for fixed ends", "固定端点的特征值"],
      [
        "Separation of variables looks for solutions that are a product of a function of x and a function of t. Substituting and dividing gives one side depending only on x and the other only on t, so both equal a constant. The x equation with zero values at both ends then allows only special constants, called eigenvalues: the square of n pi over L, with sines as eigenfunctions.",
        "分离变量法寻找 x 的函数与 t 的函数之积形式的解。代入并相除后，一边只依赖 x，另一边只依赖 t，所以两边都等于常数。x 的方程在两端取零值时，只允许特殊的常数，称为特征值：n 乘 π 除以 L 的平方，特征函数是正弦。",
      ],
      (rng) => {
        const L = rng.int(2, 9);
        const n = rng.int(1, 7);
        const answer = Q.of(n * n, L * L);
        return ask(
          [
            `For $X'' = -\\lambda X$ with $X(0) = X(${L}) = 0$, eigenvalue number ${n} equals $k\\pi^2$. What is $k$?`,
            `对于 $X'' = -\\lambda X$，$X(0) = X(${L}) = 0$，第 ${n} 个特征值等于 $k\\pi^2$。$k$ 是多少？`,
          ],
          answer,
          [Q.of(n, L), Q.of(n * n, L), Q.of(L * L, n * n), answer.add(Q.of(1))],
          [
            `$\\lambda = \\left(\\frac{${times(n, "\\pi")}}{${L}}\\right)^2$, so $k = ${answer.toLatex()}$.`,
            `$\\lambda = \\left(\\frac{${times(n, "\\pi")}}{${L}}\\right)^2$，所以 $k = ${answer.toLatex()}$。`,
          ],
        );
      },
    ),
    point(
      "the-time-equation",
      ["The time equation", "时间方程"],
      [
        "Once the eigenvalue is known, the equation for T is an ordinary one that can be solved directly. For diffusion, the time factor satisfies T prime equal to minus c lambda times T, whose solution is an exponential decay at the rate c times the eigenvalue. Thus each mode has its own rate, fixed by the same constant that the x equation supplied, and the two equations stay linked through it.",
        "知道特征值后，T 的方程就是可以直接求解的常微分方程。对扩散问题，时间因子满足 $T' = -c\\lambda T$，它的解是以 c 乘特征值为速率的指数衰减。因此每个模态都有自己的速率，由 x 的方程提供的同一个常数确定，两个方程通过它保持联系。",
      ],
      (rng) => {
        const c = rng.int(2, 9);
        const T0 = rng.int(2, 15);
        const lambda = rng.int(2, 9);
        const t = rng.int(1, 5);
        const asksRate = rng.bool();
        const answer = c * lambda * (asksRate ? 1 : t);
        return ask(
          [
            `Separating $u_t = ${c}u_{xx}$ gives $T' = -${c}\\lambda T$. With $\\lambda = ${lambda}$ and $T(0) = ${T0}$, ${asksRate ? "$T(t) = " + T0 + "e^{-kt}$. What is $k$?" : `$T(${t}) = ${T0}e^{-k}$. What is $k$?`}`,
            `分离 $u_t = ${c}u_{xx}$ 得 $T' = -${c}\\lambda T$。若 $\\lambda = ${lambda}$，$T(0) = ${T0}$，${asksRate ? "$T(t) = " + T0 + "e^{-kt}$。$k$ 是多少？" : `$T(${t}) = ${T0}e^{-k}$。$k$ 是多少？`}`,
          ],
          answer,
          [lambda, c, answer + c, T0 * answer],
          [
            `The rate is $${c} \\times ${lambda} = ${c * lambda}$${asksRate ? "" : `, and at time ${t} the exponent is ${answer}`}.`,
            `速率是 $${c} \\times ${lambda} = ${c * lambda}$${asksRate ? "" : `，在时刻 ${t} 指数是 ${answer}`}。`,
          ],
        );
      },
    ),
  ],
);

const heatEquation = topic(
  "the-heat-equation",
  ["The Heat Equation", "热方程"],
  ["Check solutions of the heat equation, and find its steady state.", "验证热方程的解，并求它的稳态。"],
  ["separation-of-variables-for-pdes"],
  [],
  [
    point(
      "a-decaying-solution",
      ["A decaying solution", "衰减的解"],
      [
        "The heat equation says that the temperature rises at a rate proportional to its second x derivative. Where the profile curves upward, the point is cooler than its neighbours and warms; where it curves downward, it cools. The constant, called the diffusivity, sets the speed. High-frequency wiggles have large curvature, and so they decay quickly, which explains why heat flow smooths everything out.",
        "热方程说，温度上升的速率与它对 x 的二阶导数成正比。波形向上弯的地方，这一点比邻近的点冷，因而升温；向下弯的地方则降温。这个常数称为扩散系数，它决定速度。高频的起伏曲率大，所以衰减很快，这解释了为什么热流会把一切都抹平。",
      ],
      (rng) => {
        const c = rng.int(2, 12);
        const n = rng.int(2, 7);
        const a = rng.int(2, 9);
        const answer = c * n * n;
        return ask(
          [
            `For which $k$ does $u = ${a}e^{-kt}\\sin(${n}x)$ solve $u_t = ${c}u_{xx}$?`,
            `当 $k$ 为何值时，$u = ${a}e^{-kt}\\sin(${n}x)$ 满足 $u_t = ${c}u_{xx}$？`,
          ],
          answer,
          [c * n, n * n, a * answer, answer + c],
          [
            `$u_t = -ku$ and $u_{xx} = -${n * n}u$, so $k = ${c} \\times ${n * n} = ${answer}$.`,
            `$u_t = -ku$，$u_{xx} = -${n * n}u$，所以 $k = ${c} \\times ${n * n} = ${answer}$。`,
          ],
        );
      },
    ),
    point(
      "the-steady-state",
      ["The steady state", "稳态"],
      [
        "With the ends of a rod held at fixed temperatures, the solution settles down as time passes. In the limit the time derivative vanishes, so the second x derivative is zero as well, and the temperature is a straight line joining the two end values. The initial temperature leaves no trace in the limit, since the boundary values alone determine this steady state.",
        "杆的两端保持固定温度时，解随时间趋于稳定。在极限情况下时间导数为零，所以对 x 的二阶导数也为零，温度是连接两端值的一条直线。初始温度在极限中不留痕迹，因为这个稳态完全由边界值决定。",
      ],
      (rng) => {
        const L = rng.int(2, 10);
        const slope = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
        const A = rng.int(-10, 30);
        const B = A + slope * L;
        const x = rng.int(1, L - 1);
        const answer = A + slope * x;
        return ask(
          [
            `A rod on $[0, ${L}]$ obeys the heat equation with $u(0, t) = ${A}$ and $u(${L}, t) = ${B}$. What does the temperature at $x = ${x}$ approach as $t \\to \\infty$?`,
            `$[0, ${L}]$ 上的杆满足热方程，$u(0, t) = ${A}$，$u(${L}, t) = ${B}$。当 $t \\to \\infty$ 时，$x = ${x}$ 处的温度趋于多少？`,
          ],
          answer,
          [Q.of(A + B, 2), A, B, answer + slope * 2 + 1],
          [
            `The steady state is the line through the end values, with slope $${slope}$, so at $x = ${x}$ it equals $${answer}$.`,
            `稳态是过两端值的直线，斜率是 $${slope}$，所以在 $x = ${x}$ 处等于 $${answer}$。`,
          ],
        );
      },
    ),
  ],
);

const heatSeries = topic(
  "solving-the-heat-equation-on-an-interval",
  ["Solving the Heat Equation on an Interval", "解区间上的热方程"],
  ["Build solutions from sine modes, and compare their decay rates.", "由正弦模态构造解，并比较它们的衰减速率。"],
  ["the-heat-equation", "fourier-sine-series"],
  [["the-heat-equation", 0.4]],
  [
    point(
      "the-exponent-of-a-mode",
      ["The exponent of a mode", "模态的指数"],
      [
        "With both ends held at zero, an initial temperature equal to one sine mode stays in that shape and merely shrinks. Mode n on an interval of length L decays by the factor e to the minus c times the square of n pi over L, times t. A general initial temperature is a Fourier sine series, and then each of its terms decays on its own, by this same formula.",
        "两端保持为零时，等于一个正弦模态的初始温度保持这个形状，只是不断缩小。长度为 L 的区间上第 n 个模态按 e 的负 c 乘 (nπ/L) 的平方再乘 t 次方衰减。一般的初始温度是傅里叶正弦级数，这时每一项都按同样的公式各自衰减。",
      ],
      (rng) => {
        const c = rng.int(1, 9);
        const L = rng.int(2, 6);
        const n = rng.int(1, 6);
        const a = rng.int(2, 15);
        const answer = Q.of(c * n * n, L * L);
        return ask(
          [
            `Let $u_t = ${times(c, "u_{xx}")}$ on $[0, ${L}]$ with zero ends and $u(x, 0) = ${a}${mode(n, L)}$. The factor in time is $e^{-k\\pi^2 t}$. What is $k$?`,
            `设 $[0, ${L}]$ 上 $u_t = ${times(c, "u_{xx}")}$，两端为零，$u(x, 0) = ${a}${mode(n, L)}$。时间因子是 $e^{-k\\pi^2 t}$。$k$ 是多少？`,
          ],
          answer,
          [Q.of(c * n, L), Q.of(c * n * n, L), Q.of(n * n, L * L).add(Q.of(c)), answer.add(Q.of(1))],
          [
            `The exponent is $${c === 1 ? "" : c}\\left(\\frac{${times(n, "\\pi")}}{${L}}\\right)^2 t$, so $k = ${answer.toLatex()}$.`,
            `指数是 $${c === 1 ? "" : c}\\left(\\frac{${times(n, "\\pi")}}{${L}}\\right)^2 t$，所以 $k = ${answer.toLatex()}$。`,
          ],
        );
      },
    ),
    point(
      "comparing-two-modes",
      ["Comparing two modes", "比较两个模态"],
      [
        "Decay rates grow with the square of the mode number, so higher modes vanish far sooner than lower ones. Mode three decays nine times as fast as mode one. For this reason, after a short time the solution looks like its lowest surviving mode, and a single term of the series often gives an accurate approximation. The high modes make the solution smooth for every positive time.",
        "衰减速率随模态序号的平方增长，所以高阶模态比低阶模态消失得快得多。第三个模态的衰减速度是第一个的九倍。因此经过很短时间后，解看起来就像它最低的留存模态，级数的一项往往就是准确的近似。高阶模态的快速消失使解在任何正时刻都是光滑的。",
      ],
      (rng) => {
        const m = rng.int(1, 5);
        const n = m + rng.int(1, 6);
        const answer = Q.of(n * n, m * m);
        return ask(
          [
            `On an interval with zero ends, how many times as fast as mode ${m} does mode ${n} of the heat equation decay?`,
            `在两端为零的区间上，热方程的第 ${n} 个模态的衰减速度是第 ${m} 个模态的多少倍？`,
          ],
          answer,
          [Q.of(n, m), Q.of(n * n - m * m), Q.of(m * m, n * n), answer.add(Q.of(1))],
          [
            `The rates are in the ratio of the squares, $\\frac{${n}^2}{${m}^2} = ${answer.toLatex()}$.`,
            `速率之比是平方之比，$\\frac{${n}^2}{${m}^2} = ${answer.toLatex()}$。`,
          ],
        );
      },
    ),
  ],
);

const insulated = topic(
  "the-heat-equation-with-insulated-ends",
  ["The Heat Equation with Insulated Ends", "两端绝热的热方程"],
  ["Use cosine modes, and find the temperature that remains in the long run.", "使用余弦模态，并求长时间后留下的温度。"],
  ["solving-the-heat-equation-on-an-interval", "fourier-cosine-series"],
  [],
  [
    point(
      "the-limit-from-a-cosine-series",
      ["The limit from a cosine series", "由余弦级数得极限"],
      [
        "An insulated end lets no heat through, which means that the x derivative is zero there. The eigenfunctions are then cosines, and one eigenvalue is zero, with the constant as its eigenfunction. Every other mode decays, so the solution tends to that constant term of the series. With the ends sealed, no heat escapes, so the limit is simply the temperature that spreads the heat evenly.",
        "绝热的端点不让热量通过，这意味着那里对 x 的导数为零。这时特征函数是余弦，有一个特征值为零，对应的特征函数是常数。其他每个模态都衰减，所以解趋于级数的常数项。两端封闭时热量不会散失，所以极限就是热量均匀分布时的温度。",
      ],
      (rng) => {
        const L = rng.int(1, 6);
        const a = rng.int(-9, 30);
        const b = rng.pick([-8, -7, -5, -4, -3, -2, 2, 3, 4, 5, 7, 8]);
        const n = rng.int(1, 5);
        const c = rng.int(1, 4);
        return ask(
          [
            `Let $u_t = ${times(c, "u_{xx}")}$ on $[0, ${L}]$ with insulated ends and $u(x, 0) = ${shifted(`${b}${mode(n, L, "\\cos")}`, a)}$. What does $u$ approach as $t \\to \\infty$?`,
            `设 $[0, ${L}]$ 上 $u_t = ${times(c, "u_{xx}")}$，两端绝热，$u(x, 0) = ${shifted(`${b}${mode(n, L, "\\cos")}`, a)}$。当 $t \\to \\infty$ 时 $u$ 趋于多少？`,
          ],
          a,
          [0, b, a + b, a - b],
          [
            `The cosine mode decays and the constant term $${a}$ has eigenvalue zero, so it remains.`,
            `余弦模态衰减，而常数项 $${a}$ 的特征值为零，所以它留下来。`,
          ],
        );
      },
    ),
    point(
      "the-limit-is-the-average",
      ["The limit is the average", "极限是平均值"],
      [
        "The constant term of a cosine series is the average of the function over the interval, so with insulated ends the limit is the average of the initial temperature. This agrees with conservation of heat: the total heat never changes, as it cannot leave, and the integral of the temperature over the rod stays fixed. Dividing this integral by the length gives the final uniform temperature.",
        "余弦级数的常数项是函数在区间上的平均值，所以两端绝热时，极限是初始温度的平均值。这与热量守恒一致：总热量不变，因为它出不去，温度在杆上的积分保持不变。用这个积分除以长度，就得到最终的均匀温度。",
      ],
      (rng) => {
        const L = rng.int(2, 12);
        const m = rng.int(1, 9);
        const b = rng.int(-9, 9);
        const answer = Q.of(m * L, 2).add(Q.of(b));
        const initial = shifted(times(m, "x"), b);
        return ask(
          [
            `A rod on $[0, ${L}]$ has insulated ends and initial temperature $${initial}$. What temperature does it approach?`,
            `$[0, ${L}]$ 上的杆两端绝热，初始温度是 $${initial}$。它趋于什么温度？`,
          ],
          answer,
          [Q.of(m * L).add(Q.of(b)), Q.of(b), Q.of(m * L, 2), answer.add(Q.of(1))],
          [
            `The average of a linear function is its value at the midpoint $x = ${Q.of(L, 2).toLatex()}$, which is $${answer.toLatex()}$.`,
            `线性函数的平均值是它在中点 $x = ${Q.of(L, 2).toLatex()}$ 处的值，也就是 $${answer.toLatex()}$。`,
          ],
        );
      },
    ),
  ],
);

const nonhomogeneous = topic(
  "nonhomogeneous-heat-problems",
  ["Nonhomogeneous Heat Problems", "非齐次热问题"],
  ["Remove nonzero boundary values, and find steady states with a heat source.", "消去非零边界值，并求有热源时的稳态。"],
  ["solving-the-heat-equation-on-an-interval"],
  [],
  [
    point(
      "subtracting-the-steady-state",
      ["Subtracting the steady state", "减去稳态"],
      [
        "Series methods need zero boundary values, so nonzero ones are removed first. Write the solution as the steady state plus a remainder. The remainder then satisfies the same heat equation with zero ends, so sine modes apply. Its initial value is the given initial temperature minus the steady state, and this difference is what must be expanded in the Fourier sine series, not the original function.",
        "级数方法要求边界值为零，所以要先消去非零的边界值。把解写成稳态加上余项。余项满足同样的热方程，两端为零，所以可以用正弦模态。它的初始值是给定的初始温度减去稳态，要展开成傅里叶正弦级数的正是这个差，而不是原来的函数。",
      ],
      (rng) => {
        const L = rng.int(2, 8);
        const slope = rng.int(1, 6);
        const A = rng.int(0, 20);
        const B = A + slope * L;
        const x = rng.int(1, L - 1);
        const start = rng.int(20, 90);
        const answer = start - (A + slope * x);
        return ask(
          [
            `A rod on $[0, ${L}]$ has $u(0, t) = ${A}$, $u(${L}, t) = ${B}$ and initial temperature ${start} throughout. Write $u$ as the steady state plus $v$. What is $v(${x}, 0)$?`,
            `$[0, ${L}]$ 上的杆有 $u(0, t) = ${A}$，$u(${L}, t) = ${B}$，初始温度处处为 ${start}。把 $u$ 写成稳态加 $v$。$v(${x}, 0)$ 是多少？`,
          ],
          answer,
          [start, A + slope * x, start - A, answer + slope],
          [
            `The steady state at $x = ${x}$ is $${A + slope * x}$, so $v = ${start} - ${A + slope * x} = ${answer}$.`,
            `$x = ${x}$ 处的稳态是 $${A + slope * x}$，所以 $v = ${start} - ${A + slope * x} = ${answer}$。`,
          ],
        );
      },
    ),
    point(
      "a-steady-state-with-a-source",
      ["A steady state with a source", "有热源的稳态"],
      [
        "A heat source adds a constant to the right side of the equation. In the steady state the time derivative is zero, so the second x derivative equals minus the source divided by the diffusivity, and the temperature is a parabola rather than a line. With both ends at zero, it is q times x times L minus x, over twice c, and the rod is hottest in the middle.",
        "热源在方程右端加了一个常数。在稳态下时间导数为零，所以对 x 的二阶导数等于负的热源除以扩散系数，温度是抛物线而不是直线。两端为零时，它等于 q 乘 x 乘 (L − x) 再除以 2c，杆的中间最热。",
      ],
      (rng) => {
        const L = rng.int(2, 12);
        const x = rng.int(1, L - 1);
        const c = rng.int(1, 6);
        const q = rng.int(1, 12);
        const answer = Q.of(q * x * (L - x), 2 * c);
        return ask(
          [
            `Find the steady state of $u_t = ${times(c, "u_{xx}")} + ${q}$ on $[0, ${L}]$ with zero ends. What is its value at $x = ${x}$?`,
            `求 $[0, ${L}]$ 上 $u_t = ${times(c, "u_{xx}")} + ${q}$ 的稳态，两端为零。它在 $x = ${x}$ 处的值是多少？`,
          ],
          answer,
          [
            Q.of(q * x * (L - x), c),
            Q.of(q * x * x, 2 * c),
            Q.of(q * L * L, 8 * c).eq(answer) ? answer.add(Q.of(1)) : Q.of(q * L * L, 8 * c),
            answer.add(Q.of(1, 2)),
          ],
          [
            `$u = \\frac{${q}x(${L} - x)}{${2 * c}}$, which at $x = ${x}$ equals $${answer.toLatex()}$.`,
            `$u = \\frac{${q}x(${L} - x)}{${2 * c}}$，在 $x = ${x}$ 处等于 $${answer.toLatex()}$。`,
          ],
        );
      },
    ),
  ],
);

const waveEquation = topic(
  "the-wave-equation",
  ["The Wave Equation", "波动方程"],
  ["Check standing waves, and find the frequencies of a string.", "验证驻波，并求弦的频率。"],
  ["separation-of-variables-for-pdes"],
  [],
  [
    point(
      "a-standing-wave",
      ["A standing wave", "驻波"],
      [
        "The wave equation sets the second time derivative equal to c squared times the second x derivative, with c the wave speed. Separating variables gives standing waves, a fixed shape in x multiplied by an oscillation in t. Unlike a heat mode, a wave mode does not decay: energy is conserved, and it oscillates forever at its own frequency, which is proportional to its number in x.",
        "波动方程令时间的二阶导数等于 c 的平方乘 x 的二阶导数，c 是波速。分离变量得到驻波，也就是 x 的固定形状乘以 t 的振荡。与热模态不同，波的模态不衰减：能量守恒，它以自己的频率永远振荡，这个频率与它在 x 方向的序号成正比。",
      ],
      (rng) => {
        const c = rng.int(2, 9);
        const n = rng.int(2, 9);
        const a = rng.int(2, 9);
        const answer = c * n;
        return ask(
          [
            `For which positive $k$ does $u = ${a}\\sin(${n}x)\\cos(kt)$ solve $u_{tt} = ${c * c}u_{xx}$?`,
            `当正数 $k$ 为何值时，$u = ${a}\\sin(${n}x)\\cos(kt)$ 满足 $u_{tt} = ${c * c}u_{xx}$？`,
          ],
          answer,
          [c * c * n, c * n * n, c * c * n * n, n],
          [
            `$u_{tt} = -k^2u$ and $u_{xx} = -${n * n}u$, so $k^2 = ${c * c} \\times ${n * n}$ and $k = ${answer}$.`,
            `$u_{tt} = -k^2u$，$u_{xx} = -${n * n}u$，所以 $k^2 = ${c * c} \\times ${n * n}$，$k = ${answer}$。`,
          ],
        );
      },
    ),
    point(
      "the-period-of-a-string",
      ["The period of a string", "弦的周期"],
      [
        "A string fixed at both ends has modes numbered by n, with angular frequency n pi c over L. So the period of mode n is two L over n times c. The first mode is the fundamental, and the others are its harmonics, with frequencies at whole multiples of it. That is why a string sounds a musical note, while a drum, whose frequencies are not whole multiples, generally does not.",
        "两端固定的弦有按 n 编号的模态，角频率是 nπc/L。所以第 n 个模态的周期是 2L 除以 nc。第一个模态是基频，其他的是它的谐波，频率是基频的整数倍。这就是弦能发出乐音的原因，而鼓的频率不是整数倍，通常就发不出乐音。",
      ],
      (rng) => {
        const L = rng.int(2, 9);
        const c = rng.int(2, 8);
        const n = rng.int(1, 5);
        const answer = Q.of(2 * L, n * c);
        return ask(
          [
            `A string of length ${L} has wave speed ${c} and is fixed at both ends. What is the period of mode ${n}?`,
            `长度为 ${L}、波速为 ${c} 的弦两端固定。第 ${n} 个模态的周期是多少？`,
          ],
          answer,
          [Q.of(L, n * c), Q.of(2 * L * c, n), Q.of(n * c, 2 * L), Q.of(2 * L, c).eq(answer) ? answer.add(Q.of(1)) : Q.of(2 * L, c)],
          [
            `The angular frequency is $\\frac{${times(n, "\\pi")} \\cdot ${c}}{${L}}$, and the period is $2\\pi$ divided by it, which is $${answer.toLatex()}$.`,
            `角频率是 $\\frac{${times(n, "\\pi")} \\cdot ${c}}{${L}}$，周期是 $2\\pi$ 除以它，也就是 $${answer.toLatex()}$。`,
          ],
        );
      },
    ),
  ],
);

const dAlembert = topic(
  "dalemberts-formula",
  ["d'Alembert's Formula", "达朗贝尔公式"],
  ["Solve the wave equation on the whole line with travelling waves.", "用行波求解整条直线上的波动方程。"],
  ["the-wave-equation", "the-transport-equation"],
  [],
  [
    point(
      "an-initial-shape",
      ["An initial shape", "初始形状"],
      [
        "On the whole line, the wave equation factors into two transport equations, one moving right and one moving left. With initial shape f and zero initial velocity, the solution is half of f at x minus ct, plus half of f at x plus ct. So an initial bump splits into two equal halves that travel in opposite directions at speed c, and each keeps the shape of the original.",
        "在整条直线上，波动方程可以分解为两个输运方程，一个向右移动，一个向左移动。初始形状为 f、初始速度为零时，解是 f 在 x − ct 处的一半加上 f 在 x + ct 处的一半。所以初始的凸起分成相等的两半，以速度 c 向相反方向传播，每一半都保持原来的形状。",
      ],
      (rng) => {
        const c = rng.int(2, 5);
        const t = rng.int(1, 4);
        const x = rng.int(-6, 10);
        const p = rng.pick([2, 4, 6, 8]);
        const left = x - c * t;
        const right = x + c * t;
        const answer = (p * (left * left + right * right)) / 2;
        return ask(
          [
            `Let $u_{tt} = ${c * c}u_{xx}$ on the line with $u(x, 0) = ${p}x^2$ and $u_t(x, 0) = 0$. What is $u(${x}, ${t})$?`,
            `设直线上 $u_{tt} = ${c * c}u_{xx}$，$u(x, 0) = ${p}x^2$，$u_t(x, 0) = 0$。$u(${x}, ${t})$ 是多少？`,
          ],
          answer,
          [p * left * left, p * right * right, p * x * x, answer * 2],
          [
            `The solution averages $f$ at $${left}$ and $${right}$: $\\frac{${p * left * left} + ${p * right * right}}{2} = ${answer}$.`,
            `解是 $f$ 在 $${left}$ 和 $${right}$ 处的平均值：$\\frac{${p * left * left} + ${p * right * right}}{2} = ${answer}$。`,
          ],
        );
      },
    ),
    point(
      "an-initial-velocity",
      ["An initial velocity", "初始速度"],
      [
        "An initial velocity g adds a second term to d'Alembert's formula: one over two c, times the integral of g from x minus ct to x plus ct. So the value at a point depends only on initial data in that interval, called its domain of dependence. Information therefore travels no faster than the speed c, in sharp contrast with the heat equation, where any disturbance is felt everywhere at once.",
        "初始速度 g 给达朗贝尔公式增加第二项：1/(2c) 乘 g 从 x − ct 到 x + ct 的积分。所以一点的值只依赖这个区间上的初始数据，这个区间称为它的依赖域。因此信息的传播速度不超过 c，这与热方程形成鲜明对比，热方程的任何扰动都会立即在各处被感受到。",
      ],
      (rng) => {
        const c = rng.int(2, 5);
        const t = rng.int(1, 6);
        const x = rng.int(-5, 10);
        const a = rng.int(2, 9);
        const answer = a * x * t;
        return ask(
          [
            `Let $u_{tt} = ${c * c}u_{xx}$ on the line with $u(x, 0) = 0$ and $u_t(x, 0) = ${a}x$. What is $u(${x}, ${t})$?`,
            `设直线上 $u_{tt} = ${c * c}u_{xx}$，$u(x, 0) = 0$，$u_t(x, 0) = ${a}x$。$u(${x}, ${t})$ 是多少？`,
          ],
          answer,
          [a * x, 2 * c * answer, answer + a, a * x * c * t],
          [
            `The integrand's average over the interval is $${a * x}$ and the length is ${2 * c * t}, so $\\frac{1}{${2 * c}}\\int_{${x - c * t}}^{${x + c * t}} ${a}s\\,ds = ${answer}$.`,
            `被积函数在区间上的平均值是 $${a * x}$，长度是 ${2 * c * t}，所以 $\\frac{1}{${2 * c}}\\int_{${x - c * t}}^{${x + c * t}} ${a}s\\,ds = ${answer}$。`,
          ],
        );
      },
    ),
  ],
);

const waveSeries = topic(
  "the-wave-equation-on-a-finite-string",
  ["The Wave Equation on a Finite String", "有限长弦上的波动方程"],
  ["Evaluate string motions built from sine modes.", "计算由正弦模态构成的弦的运动。"],
  ["the-wave-equation", "fourier-sine-series"],
  [["the-wave-equation", 0.4]],
  [
    point(
      "a-plucked-mode-later",
      ["A plucked mode later on", "拨动的模态在之后的值"],
      [
        "If a string is released from rest in the shape of mode n, it keeps that shape and its size oscillates: u equals a sine in x times a cosine of n pi c t over L. After one half period, the cosine is minus one, so the string is exactly upside down. After a full period, it is back where it began. A general shape is a sum of such modes.",
        "如果弦从静止开始、形状为第 n 个模态，它保持这个形状，大小不断振荡：u 等于 x 的正弦乘以 nπct/L 的余弦。经过半个周期，余弦是 −1，弦恰好上下颠倒。经过一个完整周期，它回到起始位置。一般的形状是这样的模态之和。",
      ],
      (rng) => {
        const L = rng.int(2, 8);
        const c = rng.int(1, 5);
        const n = rng.int(1, 4);
        const a = rng.int(2, 15);
        const half = rng.bool();
        const t = half ? Q.of(L, n * c) : Q.of(2 * L, n * c);
        const answer = half ? -a : a;
        const x = Q.of(L, 2 * n);
        return ask(
          [
            `Let $u_{tt} = ${c * c === 1 ? "" : c * c}u_{xx}$ on $[0, ${L}]$ with fixed ends, $u(x, 0) = ${a}${mode(n, L)}$ and $u_t(x, 0) = 0$. What is $u$ at $x = ${x.toLatex()}$ and $t = ${t.toLatex()}$?`,
            `设 $[0, ${L}]$ 上 $u_{tt} = ${c * c === 1 ? "" : c * c}u_{xx}$，两端固定，$u(x, 0) = ${a}${mode(n, L)}$，$u_t(x, 0) = 0$。$u$ 在 $x = ${x.toLatex()}$，$t = ${t.toLatex()}$ 处是多少？`,
          ],
          answer,
          [-answer, 0, a + 1, Math.abs(a) * 2],
          [
            `At this $x$ the sine equals 1, and this $t$ is ${half ? "half a period" : "a full period"}, so the cosine is $${half ? -1 : 1}$. The value is $${answer}$.`,
            `在这个 $x$ 处正弦等于 1，这个 $t$ 是${half ? "半个周期" : "一个完整周期"}，所以余弦是 $${half ? -1 : 1}$。值是 $${answer}$。`,
          ],
        );
      },
    ),
    point(
      "the-coefficient-from-a-velocity",
      ["The coefficient from a velocity", "由速度得系数"],
      [
        "When a string starts flat with an initial velocity, the solution uses the sine in time rather than the cosine. Differentiating in t brings down the frequency n pi c over L, so the size of the mode is the initial velocity's coefficient divided by that frequency. So a higher mode responds with a smaller size to the same velocity, which is why a struck string has few high harmonics.",
        "弦从平直状态开始并有初始速度时，解用时间的正弦而不是余弦。对 t 求导会带下频率 nπc/L，所以模态的大小等于初始速度的系数除以这个频率。因此同样的速度下，高阶模态的响应更小，这就是被敲击的弦高次谐波很少的原因。",
      ],
      (rng) => {
        const L = rng.int(2, 8);
        const c = rng.int(1, 5);
        const n = rng.int(1, 5);
        const b = rng.int(2, 15);
        const answer = Q.of(b * L, n * c);
        return ask(
          [
            `Let $u_{tt} = ${c * c === 1 ? "" : c * c}u_{xx}$ on $[0, ${L}]$ with fixed ends, $u(x, 0) = 0$ and $u_t(x, 0) = ${b}${mode(n, L)}$. The solution is $\\frac{k}{\\pi}${mode(n, L)}\\sin(\\omega t)$. What is $k$?`,
            `设 $[0, ${L}]$ 上 $u_{tt} = ${c * c === 1 ? "" : c * c}u_{xx}$，两端固定，$u(x, 0) = 0$，$u_t(x, 0) = ${b}${mode(n, L)}$。解是 $\\frac{k}{\\pi}${mode(n, L)}\\sin(\\omega t)$。$k$ 是多少？`,
          ],
          answer,
          [Q.of(b * n * c, L), Q.of(b, n * c), Q.of(L, n * c), answer.add(Q.of(1))],
          [
            `The frequency is $\\omega = \\frac{${times(n, "\\pi")} \\cdot ${c}}{${L}}$, and $\\frac{${b}}{\\omega} = \\frac{${answer.toLatex()}}{\\pi}$.`,
            `频率是 $\\omega = \\frac{${times(n, "\\pi")} \\cdot ${c}}{${L}}$，而 $\\frac{${b}}{\\omega} = \\frac{${answer.toLatex()}}{\\pi}$。`,
          ],
        );
      },
    ),
  ],
);

const laplaceEquation = topic(
  "laplaces-equation",
  ["Laplace's Equation", "拉普拉斯方程"],
  ["Recognize harmonic functions, and use the mean value property.", "识别调和函数，并使用平均值性质。"],
  ["classifying-second-order-equations", "the-heat-equation"],
  [],
  [
    point(
      "completing-a-harmonic-function",
      ["Completing a harmonic function", "补全调和函数"],
      [
        "Laplace's equation says that the second derivatives in all directions add to zero. It describes steady temperatures, electrostatic potentials and many other equilibrium states, and its solutions are called harmonic functions. In three variables, three second derivatives must balance. A quadratic with squared terms is harmonic exactly when its coefficients add to zero, so one unknown coefficient is fixed by the other two.",
        "拉普拉斯方程说，各个方向的二阶导数之和为零。它描述稳态温度、静电势和许多其他平衡状态，它的解称为调和函数。三个变量时，三个二阶导数必须平衡。含平方项的二次函数调和，当且仅当这些系数之和为零，所以一个未知系数由另外两个确定。",
      ],
      (rng) => {
        const a = rng.int(1, 12);
        const b = rng.int(1, 12);
        const d = rng.int(2, 9);
        const answer = -(a + b);
        return ask(
          [
            `For which $k$ is $u = ${times(a, "x^2")} + ${times(b, "y^2")} + kz^2 + ${d}xy$ harmonic?`,
            `当 $k$ 为何值时，$u = ${times(a, "x^2")} + ${times(b, "y^2")} + kz^2 + ${d}xy$ 是调和函数？`,
          ],
          answer,
          [a + b, -a, -b, answer - d],
          [
            `The second derivatives are ${2 * a}, ${2 * b} and $2k$, and the term in $xy$ gives none. They add to zero when $k = ${answer}$.`,
            `二阶导数是 ${2 * a}，${2 * b} 和 $2k$，$xy$ 项没有贡献。它们的和为零时 $k = ${answer}$。`,
          ],
        );
      },
    ),
    point(
      "the-mean-value-property",
      ["The mean value property", "平均值性质"],
      [
        "A harmonic function has the mean value property: its value at the centre of any circle inside its domain equals the average of its values around that circle. So a steady temperature balances its surroundings, and one consequence is the maximum principle. To find such an average, there is no need to integrate at all, since evaluating the function at the centre gives it immediately.",
        "调和函数有平均值性质：它在定义域内任何圆的圆心的值，等于它在圆周上的平均值。所以稳态温度与周围保持平衡，极大值原理是它的一个结论。求这样的平均值根本不需要积分，因为计算函数在圆心的值就能立刻得到。",
      ],
      (rng) => {
        const [p, q] = [rng.int(-5, 6), rng.int(-5, 6)];
        const r = rng.int(1, 9);
        const [a, b] = [rng.int(2, 7), rng.int(2, 7)];
        const answer = p * p - q * q + a * p + b * q;
        return ask(
          [
            `The function $u = x^2 - y^2 + ${a}x + ${b}y$ is harmonic. What is its average value around the circle of radius ${r} about $(${p}, ${q})$?`,
            `函数 $u = x^2 - y^2 + ${a}x + ${b}y$ 是调和函数。它在以 $(${p}, ${q})$ 为圆心、半径为 ${r} 的圆周上的平均值是多少？`,
          ],
          answer,
          [answer + r * r, answer + r, a * p + b * q, p * p + q * q + a * p + b * q],
          [
            `The average equals the value at the centre: $${p * p} - ${q * q} + ${a}(${p}) + ${b}(${q}) = ${answer}$.`,
            `平均值等于圆心的值：$${p * p} - ${q * q} + ${a}(${p}) + ${b}(${q}) = ${answer}$。`,
          ],
        );
      },
    ),
  ],
);

const laplaceRegions = topic(
  "laplaces-equation-in-a-rectangle-and-a-disc",
  ["Laplace's Equation in a Rectangle and a Disc", "矩形和圆盘上的拉普拉斯方程"],
  ["Solve boundary value problems by separation, and apply the maximum principle.", "用分离变量解边值问题，并应用极大值原理。"],
  ["laplaces-equation"],
  [["laplaces-equation", 0.4]],
  [
    point(
      "a-boundary-value-on-a-disc",
      ["A boundary value on a disc", "圆盘上的边界值"],
      [
        "In polar coordinates, separation on a disc gives the harmonic functions r to the n times cosine or sine of n theta. Bounded solutions avoid negative powers of r, since these blow up at the centre. So if the boundary value on the circle of radius R is a times the cosine of n theta, then the solution inside is a times r over R to the power n, times that cosine.",
        "在极坐标中，圆盘上的分离变量给出调和函数：r 的 n 次方乘 $n\\theta$ 的余弦或正弦。有界的解不含 r 的负幂，因为它们在圆心处爆破。所以如果半径为 R 的圆周上的边界值是 a 乘 $n\\theta$ 的余弦，那么内部的解是 a 乘 r/R 的 n 次方，再乘这个余弦。",
      ],
      (rng) => {
        const R = rng.int(2, 6);
        const r = rng.int(1, R - 1);
        const n = rng.int(2, 4);
        const a = rng.int(2, 15);
        const b = rng.int(-5, 9);
        const answer = Q.of(a * r ** n, R ** n).add(Q.of(b));
        const boundary = shifted(`${a}\\cos(${n}\\theta)`, b);
        return ask(
          [
            `A function is harmonic in the disc $r \\le ${R}$ and equals $${boundary}$ on its edge. What is its value at $r = ${r}$, $\\theta = 0$?`,
            `一个函数在圆盘 $r \\le ${R}$ 内调和，在边界上等于 $${boundary}$。它在 $r = ${r}$，$\\theta = 0$ 处的值是多少？`,
          ],
          answer,
          [Q.of(a + b), Q.of(a * r, R).add(Q.of(b)), Q.of(a * r ** n, R ** n), Q.of(b)],
          [
            `Inside, the solution is $${shifted(`${a}\\left(\\frac{r}{${R}}\\right)^{${n}}\\cos(${n}\\theta)`, b)}$, which here equals $${answer.toLatex()}$.`,
            `内部的解是 $${shifted(`${a}\\left(\\frac{r}{${R}}\\right)^{${n}}\\cos(${n}\\theta)`, b)}$，这里等于 $${answer.toLatex()}$。`,
          ],
        );
      },
    ),
    point(
      "the-maximum-principle",
      ["The maximum principle", "极大值原理"],
      [
        "The maximum principle says that a harmonic function on a bounded region reaches its largest and smallest values on the boundary, and never inside, unless it is constant. A steady temperature cannot have a hot spot in the interior, as heat would flow away from it. So boundary values bound the whole solution, and this also shows that two solutions with the same boundary values must be identical.",
        "极大值原理说，有界区域上的调和函数在边界上取得最大值和最小值，除非它是常数，否则决不在内部取得。稳态温度在内部不可能有热点，因为热量会从那里流走。所以边界值限制了整个解，这也说明边界值相同的两个解必定相同。",
      ],
      (rng) => {
        const low = rng.int(-9, 10);
        const high = low + rng.int(5, 20);
        const inside = rng.int(low + 1, high - 1);
        const above = high + rng.int(1, 9);
        const below = low - rng.int(1, 9);
        return choose(
          rng,
          [
            `A nonconstant harmonic function on a square has boundary values from $${low}$ to $${high}$. Which could be its value at the centre?`,
            `正方形上非常数的调和函数的边界值从 $${low}$ 到 $${high}$。下列哪个可能是它在中心的值？`,
          ],
          same(`${inside}`),
          [same(`${above}`), same(`${below}`), same(`${high + 10}`)],
          [
            `A value inside must lie strictly between $${low}$ and $${high}$, and only $${inside}$ does.`,
            `内部的值必须严格介于 $${low}$ 和 $${high}$ 之间，只有 $${inside}$ 满足。`,
          ],
        );
      },
    ),
  ],
);

const eigenfunctions = topic(
  "orthogonal-eigenfunctions-for-pdes",
  ["Orthogonal Eigenfunctions for PDEs", "偏微分方程的正交特征函数"],
  ["Find eigenvalues for mixed conditions, and use orthogonality.", "求混合条件的特征值，并利用正交性。"],
  ["separation-of-variables-for-pdes", "introduction-to-fourier-series"],
  [],
  [
    point(
      "eigenvalues-for-mixed-ends",
      ["Eigenvalues for mixed ends", "混合端点的特征值"],
      [
        "Boundary conditions choose the eigenfunctions. If one end is fixed at zero and the other insulated, a sine must start at zero and be flat at the far end, so it fits an odd number of quarter waves. The eigenvalues are thus the square of two n minus one times pi over two L. Other conditions yield other sets, but the separated problem always has the same structure.",
        "边界条件决定特征函数。如果一端固定为零，另一端绝热，正弦必须从零开始，并在另一端变平，所以它容纳奇数个四分之一波。因此特征值是 (2n − 1)π/(2L) 的平方。其他条件给出其他的集合，但分离后的问题结构总是相同的。",
      ],
      (rng) => {
        const L = rng.int(1, 6);
        const n = rng.int(1, 6);
        const odd = 2 * n - 1;
        const answer = Q.of(odd * odd, 4 * L * L);
        return ask(
          [
            `For $X'' = -\\lambda X$ with $X(0) = 0$ and $X'(${L}) = 0$, eigenvalue number ${n} equals $k\\pi^2$. What is $k$?`,
            `对于 $X'' = -\\lambda X$，$X(0) = 0$，$X'(${L}) = 0$，第 ${n} 个特征值等于 $k\\pi^2$。$k$ 是多少？`,
          ],
          answer,
          [Q.of(n * n, L * L), Q.of(odd * odd, L * L), Q.of(odd, 2 * L), answer.add(Q.of(1))],
          [
            `$\\lambda = \\left(\\frac{${times(odd, "\\pi")}}{${2 * L}}\\right)^2$, so $k = ${answer.toLatex()}$.`,
            `$\\lambda = \\left(\\frac{${times(odd, "\\pi")}}{${2 * L}}\\right)^2$，所以 $k = ${answer.toLatex()}$。`,
          ],
        );
      },
    ),
    point(
      "orthogonality-of-sine-modes",
      ["Orthogonality of sine modes", "正弦模态的正交性"],
      [
        "Eigenfunctions with different eigenvalues are orthogonal: the integral of their product over the interval is zero. For sines on an interval of length L, the integral of a mode with itself is L over two. This is what makes series methods work, because multiplying an expansion by one mode and integrating kills all the other terms and isolates a single coefficient of the series.",
        "特征值不同的特征函数是正交的：它们的乘积在区间上的积分为零。对长度为 L 的区间上的正弦，一个模态与自身的积分是 L/2。这正是级数方法有效的原因，因为把展开式乘以一个模态再积分，就消去了其他所有项，只留下级数的一个系数。",
      ],
      (rng) => {
        const L = rng.int(1, 12);
        const n = rng.int(1, 7);
        const m = rng.bool() ? n : rng.pick([1, 2, 3, 4, 5, 6, 7].filter((v) => v !== n));
        const a = rng.int(2, 9);
        const answer = m === n ? Q.of(a * L, 2) : Q.of(0);
        return ask(
          [
            `What is $\\int_0^{${L}} ${a}${mode(n, L)}${mode(m, L)}\\,dx$?`,
            `$\\int_0^{${L}} ${a}${mode(n, L)}${mode(m, L)}\\,dx$ 是多少？`,
          ],
          answer,
          [m === n ? Q.of(0) : Q.of(a * L, 2), Q.of(a * L), Q.of(L, 2), answer.add(Q.of(a))],
          [
            m === n
              ? `A sine mode with itself gives $\\frac{${L}}{2}$, and multiplying by ${a} gives $${answer.toLatex()}$.`
              : "The two modes have different numbers, so they are orthogonal and the integral is 0.",
            m === n
              ? `正弦模态与自身的积分是 $\\frac{${L}}{2}$，乘以 ${a} 得 $${answer.toLatex()}$。`
              : "这两个模态的序号不同，所以它们正交，积分为 0。",
          ],
        );
      },
    ),
  ],
);

const fourierData = topic(
  "matching-initial-data-with-fourier-series",
  ["Matching Initial Data with Fourier Series", "用傅里叶级数匹配初始数据"],
  ["Compute coefficients of initial data, and evaluate a sum of modes.", "计算初始数据的系数，并求模态之和的值。"],
  ["orthogonal-eigenfunctions-for-pdes", "solving-bvps-using-fourier-series"],
  [],
  [
    point(
      "the-coefficient-of-a-constant",
      ["The coefficient of a constant", "常数的系数"],
      [
        "To match an initial condition, expand it in the eigenfunctions. By orthogonality, the sine coefficient is two over L times the integral of the function times that mode. For a constant function, the result is zero for even modes and four times the constant, over n pi, for odd ones. The coefficients fall slowly, because a constant does not match the zero boundary values of the sine modes.",
        "要匹配初始条件，就把它按特征函数展开。根据正交性，正弦系数是 2/L 乘函数与这个模态之积的积分。对常数函数，偶数模态的结果是零，奇数模态的结果是 4 倍常数除以 nπ。系数下降得很慢，因为常数与正弦模态的零边界值不相符。",
      ],
      (rng) => {
        const c = rng.int(2, 25);
        const L = rng.int(1, 9);
        const n = rng.int(1, 8);
        const odd = n % 2 === 1;
        const answer = odd ? Q.of(4 * c, n) : Q.of(0);
        return ask(
          [
            `The sine series of $f(x) = ${c}$ on $[0, ${L}]$ has mode ${n} coefficient $\\frac{k}{\\pi}$. What is $k$?`,
            `$[0, ${L}]$ 上 $f(x) = ${c}$ 的正弦级数中，第 ${n} 个模态的系数是 $\\frac{k}{\\pi}$。$k$ 是多少？`,
          ],
          answer,
          [Q.of(2 * c, n), odd ? Q.of(0) : Q.of(4 * c, n), Q.of(4 * c * L, n), Q.of(c, n)],
          [
            odd
              ? `For an odd mode, the coefficient is $\\frac{4(${c})}{${times(n, "\\pi")}}$, whatever the length of the interval, so $k = ${answer.toLatex()}$.`
              : "For an even mode, the integral over the interval cancels exactly, so the coefficient is 0.",
            odd
              ? `对奇数模态，系数是 $\\frac{4(${c})}{${times(n, "\\pi")}}$，与区间长度无关，所以 $k = ${answer.toLatex()}$。`
              : "对偶数模态，区间上的积分恰好相消，所以系数是 0。",
          ],
        );
      },
    ),
    point(
      "evaluating-a-sum-of-modes",
      ["Evaluating a sum of modes", "求模态之和的值"],
      [
        "A solution from a few modes is evaluated term by term. Since each term is a product of a coefficient, a space factor and a time factor, it helps to check the space factor first. At the midpoint of the interval, the sine of n pi over two is one, minus one, or zero, depending on n. So even modes vanish there, and odd modes alternate in sign.",
        "由几个模态构成的解要逐项求值。因为每一项都是系数、空间因子和时间因子之积，先检查空间因子会有帮助。在区间中点，nπ/2 的正弦是 1、−1 或 0，取决于 n。所以偶数模态在那里为零，奇数模态的符号交替变化。",
      ],
      (rng) => {
        const L = rng.int(2, 8);
        const [a, b, d] = [rng.int(2, 15), rng.int(2, 15), rng.int(2, 15)];
        const answer = a - b;
        return ask(
          [
            `Let $f(x) = ${a}${mode(1, L)} + ${d}${mode(2, L)} + ${b}${mode(3, L)}$ on $[0, ${L}]$. What is $f$ at the midpoint?`,
            `设 $[0, ${L}]$ 上 $f(x) = ${a}${mode(1, L)} + ${d}${mode(2, L)} + ${b}${mode(3, L)}$。$f$ 在中点的值是多少？`,
          ],
          answer,
          [a + b, a + d + b, a + d - b, b - a],
          [
            `At the midpoint the three sines equal $1$, $0$ and $-1$, so the value is $${a} - ${b} = ${answer}$.`,
            `在中点，三个正弦分别等于 $1$，$0$ 和 $-1$，所以值是 $${a} - ${b} = ${answer}$。`,
          ],
        );
      },
    ),
  ],
);

const finiteDifferences = topic(
  "finite-differences-for-the-heat-equation",
  ["Finite Differences for the Heat Equation", "热方程的有限差分"],
  ["Take a step of the explicit scheme, and choose a stable time step.", "进行显式格式的一步计算，并选择稳定的时间步长。"],
  ["the-heat-equation"],
  [],
  [
    point(
      "one-step-of-the-explicit-scheme",
      ["One step of the explicit scheme", "显式格式的一步"],
      [
        "A computer solves the heat equation on a grid. The explicit scheme replaces each derivative by a difference, which gives a new value equal to the old value plus r times the sum of the two neighbours minus twice the old value. Here r is c times the time step over the square of the grid spacing. Each new value thus depends only on three old values nearby.",
        "计算机在网格上求解热方程。显式格式用差分代替每个导数，得到的新值等于旧值加 r 乘（两个邻点之和减去旧值的两倍）。这里 r 是 c 乘时间步长除以网格间距的平方。因此每个新值只依赖附近的三个旧值。",
      ],
      (rng) => {
        const r = rng.pick([Q.of(1, 4), Q.of(1, 2), Q.of(1, 5), Q.of(2, 5), Q.of(1, 3)]);
        const [left, mid, right] = [rng.int(0, 30), rng.int(0, 30), rng.int(0, 30)];
        const change = left + right - 2 * mid;
        const answer = Q.of(mid).add(r.mul(Q.of(change)));
        return ask(
          [
            `With $r = ${r.toLatex()}$, a grid point has value ${mid} and its neighbours have values ${left} and ${right}. What is its value after one explicit step?`,
            `设 $r = ${r.toLatex()}$，一个网格点的值是 ${mid}，它的邻点的值是 ${left} 和 ${right}。显式格式一步后它的值是多少？`,
          ],
          answer,
          [Q.of(mid + change), Q.of(mid).add(r.mul(Q.of(left + right))), Q.of(mid).sub(r.mul(Q.of(change))), answer.add(Q.of(1))],
          [
            `The new value is $${mid} + ${r.toLatex()}(${left} + ${right} - ${2 * mid}) = ${answer.toLatex()}$.`,
            `新值是 $${mid} + ${r.toLatex()}(${left} + ${right} - ${2 * mid}) = ${answer.toLatex()}$。`,
          ],
        );
      },
    ),
    point(
      "a-stable-time-step",
      ["A stable time step", "稳定的时间步长"],
      [
        "The explicit scheme is stable only when r is at most one half. Beyond this, small errors grow at each step and soon swamp the solution. So the largest allowed time step is the square of the grid spacing over twice c, which is severe: halving the spacing forces four times as many steps. Implicit schemes avoid this limit, at the price of solving a linear system per step.",
        "显式格式只有在 r 不超过 1/2 时才稳定。超过这个值，小误差会逐步增长，很快淹没解。所以允许的最大时间步长是网格间距的平方除以 2c，这个限制很严格：间距减半要求步数变为四倍。隐式格式避免了这个限制，代价是每一步都要解一个线性方程组。",
      ],
      (rng) => {
        const denominator = rng.int(2, 12);
        const dx = Q.of(1, denominator);
        const c = rng.int(1, 9);
        const answer = Q.of(1, 2 * c * denominator * denominator);
        return ask(
          [
            `For $u_t = ${times(c, "u_{xx}")}$ with grid spacing $${dx.toLatex()}$, what is the largest time step that the explicit scheme allows?`,
            `对于 $u_t = ${times(c, "u_{xx}")}$，网格间距为 $${dx.toLatex()}$，显式格式允许的最大时间步长是多少？`,
          ],
          answer,
          [
            Q.of(1, c * denominator * denominator),
            Q.of(1, 2 * c * denominator),
            Q.of(c, 2 * denominator * denominator),
            answer.mul(Q.of(4)),
          ],
          [
            `$r \\le \\frac{1}{2}$ means that the step is at most $\\frac{(\\Delta x)^2}{2c} = ${answer.toLatex()}$.`,
            `$r \\le \\frac{1}{2}$ 表示步长至多为 $\\frac{(\\Delta x)^2}{2c} = ${answer.toLatex()}$。`,
          ],
        );
      },
    ),
  ],
);

/** partialDifferentialEquationsTopics holds the topics written for the Partial Differential Equations course. */
export const partialDifferentialEquationsTopics: readonly TopicDef[] = [
  introduction,
  classifying,
  transport,
  characteristics,
  separation,
  heatEquation,
  heatSeries,
  insulated,
  nonhomogeneous,
  waveEquation,
  dAlembert,
  waveSeries,
  laplaceEquation,
  laplaceRegions,
  eigenfunctions,
  fourierData,
  finiteDifferences,
];
