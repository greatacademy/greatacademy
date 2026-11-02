import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { numberProblem, steps } from "../problems.ts";

// ---------------------------------------------------------------------------
// 6.27 Vector Mechanics
// ---------------------------------------------------------------------------

/** velocityAndAccelerationAsFunctionsOfDisplacement applies the chain rule a = v dv/dx. */
export const velocityAndAccelerationAsFunctionsOfDisplacement: TopicDef = {
  id: "velocity-and-acceleration-as-functions-of-displacement",
  title: t("Velocity and Acceleration as Functions of Displacement", "位移的函数：速度与加速度"),
  summary: t(
    "When speed is given as a function of position v(x), acceleration is computed via the chain rule as a(x) = v dv/dx.",
    "当速度以位置的函数 v(x) 给出时，通过链式法则计算加速度：a(x) = v dv/dx。",
  ),
  prerequisites: ["calculating-velocity-for-straight-line-motion-using-differentiation"],
  encompasses: [
    {
      topic: "calculating-velocity-for-straight-line-motion-using-differentiation",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "relating-acceleration-to-velocity-and-displacement",
      title: t("Relating acceleration to velocity and displacement", "建立加速度、速度与位移之间的链式法则关系"),
      explanation: t(
        "By the chain rule, $a = \\frac{dv}{dt} = \\frac{dv}{dx}\\frac{dx}{dt} = v\\frac{dv}{dx}$. For $v(x) = c x^2$, the derivative is $v'(x) = 2cx$, so $a(x) = (cx^2)(2cx) = 2c^2 x^3$.",
        "由链式法则，$a = \\frac{dv}{dt} = \\frac{dv}{dx}\\frac{dx}{dt} = v\\frac{dv}{dx}$。对于 $v(x) = c x^2$，导数为 $v'(x) = 2cx$，故 $a(x) = (cx^2)(2cx) = 2c^2 x^3$。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(2, 7);
        const x0 = rng.int(1, 6);
        const ans = 2 * c * c * x0 * x0 * x0;

        const prompt = t(
          `A particle moves along a straight line with velocity given by $v(x) = ${c}x^2$ as a function of displacement $x$. Find the acceleration $a$ at position $x = ${x0}$.`,
          `一质点沿直线运动，其速度随位移 $x$ 的变化规律为 $v(x) = ${c}x^2$。求质点位于位置 $x = ${x0}$ 时的加速度 $a$。`,
        );
        const solution = t(
          steps(
            `Use the differential chain rule: $a = v \\frac{dv}{dx}$.`,
            `Differentiate $v(x) = ${c}x^2$ with respect to $x$: $\\frac{dv}{dx} = ${2 * c}x$.`,
            `Multiply by $v$: $a(x) = (${c}x^2)(${2 * c}x) = ${2 * c * c}x^3$.`,
            `Evaluate at $x = ${x0}$: $a(${x0}) = ${2 * c * c}(${x0})^3 = ${ans}$.`,
          ),
          steps(
            `应用微分链式法则：$a = v \\frac{dv}{dx}$。`,
            `对 $v(x) = ${c}x^2$ 关于 $x$ 求导：$\\frac{dv}{dx} = ${2 * c}x$。`,
            `与 $v$ 相乘：$a(x) = (${c}x^2)(${2 * c}x) = ${2 * c * c}x^3$。`,
            `代入 $x = ${x0}$：$a(${x0}) = ${2 * c * c}(${x0})^3 = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [c * x0 * x0, 2 * c * x0, ans + 2 * c],
        });
      },
    },
  ],
};

/** determiningPropertiesOfObjectsDescribedAsFunctionsOfDisplacement integrates motion relations. */
export const determiningPropertiesOfObjectsDescribedAsFunctionsOfDisplacement: TopicDef = {
  id: "determining-properties-of-objects-described-as-functions-of-displacement",
  title: t("Determining Properties of Objects Described as Functions of Displacement", "位移函数描述下物体的运动性质"),
  summary: t(
    "Integrating the work-acceleration differential v dv = a(x) dx yields v(x)^2 - v_0^2 = 2 ∫ a(x) dx.",
    "积分微分关系式 v dv = a(x) dx 可得速度平方差与位移积分的关系：v(x)^2 - v_0^2 = 2 ∫ a(x) dx。",
  ),
  prerequisites: ["velocity-and-acceleration-as-functions-of-displacement"],
  encompasses: [
    {
      topic: "velocity-and-acceleration-as-functions-of-displacement",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "integrating-equations-of-motion-with-displacement-dependence",
      title: t("Integrating equations of motion with displacement dependence", "积分含位移依赖的运动微分方程"),
      explanation: t(
        "From $a(x) = v \\frac{dv}{dx}$, separating variables gives $v\\,dv = a(x)\\,dx$. Integrating from $x = 0$ (starting from rest, $v(0) = 0$) to $x_1$ gives $\\frac{1}{2}v(x_1)^2 = \\int_0^{x_1} a(x)\\,dx$, so $v(x_1)^2 = 2 \\int_0^{x_1} a(x)\\,dx$.",
        "由 $a(x) = v \\frac{dv}{dx}$，分离变量得 $v\\,dv = a(x)\\,dx$。从 $x = 0$（初速为零 $v(0) = 0$）积分到 $x_1$ 可得 $\\frac{1}{2}v(x_1)^2 = \\int_0^{x_1} a(x)\\,dx$，即 $v(x_1)^2 = 2 \\int_0^{x_1} a(x)\\,dx$。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(2, 8);
        const b = rng.int(1, 8);
        const x1 = rng.int(1, 6);
        const vSq = k * x1 * x1 + 2 * b * x1;

        const prompt = t(
          `A particle starts from rest at $x = 0$ and moves along the $x$-axis with acceleration $a(x) = ${k}x + ${b}$. Find the squared speed $v^2$ when the particle reaches $x = ${x1}$.`,
          `一质点自 $x = 0$ 处由静止出发沿 $x$ 轴正向运动，加速度为 $a(x) = ${k}x + ${b}$。求质点到达 $x = ${x1}$ 处的速度平方 $v^2$。`,
        );
        const solution = t(
          steps(
            `Separate variables from $a = v \\frac{dv}{dx}$: $v\\,dv = a(x)\\,dx = (${k}x + ${b})\\,dx$.`,
            `Integrate both sides: $\\int_0^v v\\,dv = \\int_0^{${x1}} (${k}x + ${b})\\,dx$.`,
            `Left side evaluates to $\\frac{1}{2}v^2$. Right side evaluates to $[\\frac{${k}}{2}x^2 + ${b}x]_0^{${x1}} = \\frac{${k}}{2}(${x1 * x1}) + ${b * x1}$.`,
            `Multiply by 2 to solve for $v^2$: $v^2 = ${k}(${x1 * x1}) + 2(${b})(${x1}) = ${k * x1 * x1} + ${2 * b * x1} = ${vSq}$.`,
          ),
          steps(
            `由 $a = v \\frac{dv}{dx}$ 分离变量：$v\\,dv = a(x)\\,dx = (${k}x + ${b})\\,dx$。`,
            `两端积分：$\\int_0^v v\\,dv = \\int_0^{${x1}} (${k}x + ${b})\\,dx$。`,
            `左端为 $\\frac{1}{2}v^2$；右端为 $[\\frac{${k}}{2}x^2 + ${b}x]_0^{${x1}} = \\frac{${k}}{2}(${x1 * x1}) + ${b * x1}$。`,
            `两端同乘 2 求得 $v^2$：$v^2 = ${k}(${x1 * x1}) + 2(${b})(${x1}) = ${vSq}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: vSq,
          wrong: [vSq + 2 * b, k * x1 + b, 2 * (k * x1 + b)],
        });
      },
    },
  ],
};

/** theComponentsOfAcceleration decomposes acceleration along T and N. */
export const theComponentsOfAcceleration: TopicDef = {
  id: "the-components-of-acceleration",
  title: t("The Components of Acceleration", "加速度的切向与法向分量"),
  summary: t(
    "Acceleration decomposes into orthogonal tangential and normal components: a = a_T T + a_N N where a_T = v' and a_N = κ v^2.",
    "加速度正交分解为切向分量与法向分量：a = a_T T + a_N N，其中 a_T = v'，a_N = κ v^2。",
  ),
  prerequisites: ["principal-normal-vectors", "differentiation-rules-for-vector-valued-functions"],
  encompasses: [{ topic: "principal-normal-vectors", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "resolving-acceleration-into-tangential-and-normal-components",
      title: t("Resolving acceleration into tangential and normal components", "将加速度分解为切向与法向分量"),
      explanation: t(
        "For a helical trajectory $\\mathbf{r}(t) = \\langle R \\cos(k t), R \\sin(k t), c t \\rangle$, the velocity is $\\mathbf{v}(t) = \\langle -k R \\sin(k t), k R \\cos(k t), c \\rangle$ with constant speed $v = \\sqrt{k^2 R^2 + c^2}$. Since speed is constant, the tangential acceleration is $a_T = \\frac{dv}{dt} = 0$, and the normal acceleration is the full acceleration magnitude $a_N = \\|\\mathbf{a}(t)\\| = k^2 R$.",
        "对于螺旋线轨迹 $\\mathbf{r}(t) = \\langle R \\cos(k t), R \\sin(k t), c t \\rangle$，速度为 $\\mathbf{v}(t) = \\langle -k R \\sin(k t), k R \\cos(k t), c \\rangle$，速率恒定为 $v = \\sqrt{k^2 R^2 + c^2}$。由于速率恒定，切向加速度 $a_T = \\frac{dv}{dt} = 0$，法向加速度大小等于总加速度大小 $a_N = \\|\\mathbf{a}(t)\\| = k^2 R$。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(2, 6);
        const R = rng.int(2, 10);
        const c = rng.int(1, 8);
        const aN = k * k * R;

        const prompt = t(
          `A particle traverses the helix $\\mathbf{r}(t) = \\langle ${R} \\cos(${k}t), ${R} \\sin(${k}t), ${c}t \\rangle$. Find the magnitude of the normal component of acceleration $a_N$.`,
          `一质点沿螺旋线 $\\mathbf{r}(t) = \\langle ${R} \\cos(${k}t), ${R} \\sin(${k}t), ${c}t \\rangle$ 运动。求加速度法向分量的模长 $a_N$。`,
        );
        const solution = t(
          steps(
            `Compute velocity: $\\mathbf{v}(t) = \\mathbf{r}'(t) = \\langle -${k * R} \\sin(${k}t), ${k * R} \\cos(${k}t), ${c} \\rangle$.`,
            `The speed is $v = \\|\\mathbf{v}(t)\\| = \\sqrt{(${k * R})^2 + ${c}^2}$, which is constant, so tangential acceleration $a_T = \\frac{dv}{dt} = 0$.`,
            `Compute acceleration: $\\mathbf{a}(t) = \\mathbf{r}''(t) = \\langle -${k * k * R} \\cos(${k}t), -${k * k * R} \\sin(${k}t), 0 \\rangle$.`,
            `Because $a_T = 0$, $a_N = \\|\\mathbf{a}(t)\\| = \\sqrt{(-${k * k * R} \\cos(${k}t))^2 + (-${k * k * R} \\sin(${k}t))^2} = ${aN}$.`,
          ),
          steps(
            `计算速度向量：$\\mathbf{v}(t) = \\mathbf{r}'(t) = \\langle -${k * R} \\sin(${k}t), ${k * R} \\cos(${k}t), ${c} \\rangle$。`,
            `速率为 $v = \\|\\mathbf{v}(t)\\| = \\sqrt{(${k * R})^2 + ${c}^2}$ 为常数，故切向加速度 $a_T = \\frac{dv}{dt} = 0$。`,
            `计算加速度向量：$\\mathbf{a}(t) = \\mathbf{r}''(t) = \\langle -${k * k * R} \\cos(${k}t), -${k * k * R} \\sin(${k}t), 0 \\rangle$。`,
            `由 $a_T = 0$，法向加速度大小为 $a_N = \\|\\mathbf{a}(t)\\| = ${aN}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: aN,
          wrong: [k * R, 2 * k * R, aN + k],
        });
      },
    },
  ],
};

/** theWorkEnergyPrinciple equates work done along a path to kinetic energy change. */
export const theWorkEnergyPrinciple: TopicDef = {
  id: "the-work-energy-principle",
  title: t("The Work-Energy Principle", "动能定理与做功"),
  summary: t(
    "The line integral of net force along a path equals the total work done and the change in kinetic energy: W = ∫_C F · dr = ΔK.",
    "合外力沿路径的线积分等于所做的总功，亦等于质点动能的变化量：W = ∫_C F · dr = ΔK。",
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
      id: "computing-work-and-kinetic-energy-changes",
      title: t("Computing work and kinetic energy changes", "计算合外力做功与动能变化"),
      explanation: t(
        "The work-energy theorem states $W = \\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\frac{1}{2}m v_2^2 - \\frac{1}{2}m v_1^2$. For an even mass $m = 2k$, $W = k(v_2^2 - v_1^2)$.",
        "动能定理指出 $W = \\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\frac{1}{2}m v_2^2 - \\frac{1}{2}m v_1^2$。对于偶数质量 $m = 2k$，做功为 $W = k(v_2^2 - v_1^2)$。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(1, 4);
        const m = 2 * k; // ensure integer work
        const v1 = rng.int(1, 5);
        const v2 = rng.int(v1 + 1, v1 + 6);
        const work = k * (v2 * v2 - v1 * v1);

        const prompt = t(
          `A particle of mass $m = ${m}$ kg accelerates along a curved path from an initial speed $v_1 = ${v1}$ m/s to a final speed $v_2 = ${v2}$ m/s under net force $\\mathbf{F}$. Calculate the total work $W = \\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ done on the particle (in Joules).`,
          `一质量为 $m = ${m}$ kg 的质点在合外力 $\\mathbf{F}$ 作用下沿曲线路径加速，速率从初速度 $v_1 = ${v1}$ m/s 增加到末速度 $v_2 = ${v2}$ m/s。求合外力对质点所做的总功 $W = \\int_C \\mathbf{F} \\cdot d\\mathbf{r}$（单位：焦耳 J）。`,
        );
        const solution = t(
          steps(
            `By the Work-Energy Theorem, the total work equals the change in kinetic energy: $W = \\Delta K = \\frac{1}{2}m v_2^2 - \\frac{1}{2}m v_1^2$.`,
            `Compute initial kinetic energy: $K_1 = \\frac{1}{2}(${m})(${v1}^2) = ${k}(${v1 * v1}) = ${k * v1 * v1}$ J.`,
            `Compute final kinetic energy: $K_2 = \\frac{1}{2}(${m})(${v2}^2) = ${k}(${v2 * v2}) = ${k * v2 * v2}$ J.`,
            `Subtract to find total work: $W = K_2 - K_1 = ${k * v2 * v2} - ${k * v1 * v1} = ${work}$ J.`,
          ),
          steps(
            `根据动能定理，合外力所做的功等于动能的增量：$W = \\Delta K = \\frac{1}{2}m v_2^2 - \\frac{1}{2}m v_1^2$。`,
            `计算初动能：$K_1 = \\frac{1}{2}(${m})(${v1}^2) = ${k}(${v1 * v1}) = ${k * v1 * v1}$ J。`,
            `计算末动能：$K_2 = \\frac{1}{2}(${m})(${v2}^2) = ${k}(${v2 * v2}) = ${k * v2 * v2}$ J。`,
            `相减求总功：$W = K_2 - K_1 = ${k * v2 * v2} - ${k * v1 * v1} = ${work}$ J。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: work,
          wrong: [work + m, m * (v2 - v1), 2 * work],
        });
      },
    },
  ],
};

/** circularMotionAboutTheOrigin analyzes centripetal acceleration in circular paths. */
export const circularMotionAboutTheOrigin: TopicDef = {
  id: "circular-motion-about-the-origin",
  title: t("Circular Motion About the Origin", "绕原点的圆周运动"),
  summary: t(
    "In circular motion with radius R and constant angular speed ω, centripetal acceleration is directed inward with magnitude a_c = ω^2 R.",
    "在半径为 R、角速度为 ω 的匀速圆周运动中，向心加速度指向圆心，其大小为 a_c = ω^2 R。",
  ),
  prerequisites: ["the-components-of-acceleration"],
  encompasses: [{ topic: "the-components-of-acceleration", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "centripetal-acceleration-and-speed-in-circular-motion",
      title: t("Centripetal acceleration and speed in circular motion", "圆周运动中的向心加速度与速率计算"),
      explanation: t(
        "For $\\mathbf{r}(t) = \\langle R \\cos(\\omega t), R \\sin(\\omega t) \\rangle$, the acceleration is $\\mathbf{a}(t) = -\\omega^2 \\mathbf{r}(t)$, which has magnitude $a_c = \\omega^2 R$. The centripetal force required to keep mass $m$ in orbit is $F_c = m \\omega^2 R$.",
        "对于 $\\mathbf{r}(t) = \\langle R \\cos(\\omega t), R \\sin(\\omega t) \\rangle$，加速度为 $\\mathbf{a}(t) = -\\omega^2 \\mathbf{r}(t)$，大小为向心加速度 $a_c = \\omega^2 R$。维持质量为 $m$ 的物体做圆周运动所需的向心力为 $F_c = m \\omega^2 R$。",
      ),
      generate(rng: Rng): Problem {
        const m = rng.int(1, 6);
        const R = rng.int(2, 10);
        const w = rng.int(2, 7);
        const Fc = m * w * w * R;

        const prompt = t(
          `A particle of mass $m = ${m}$ kg moves in a horizontal circle of radius $R = ${R}$ m at a constant angular speed $\\omega = ${w}$ rad/s. Calculate the magnitude of the centripetal force $F_c$ acting on the particle (in Newtons).`,
          `一质量为 $m = ${m}$ kg 的质点在水平面内做半径为 $R = ${R}$ m 的匀速圆周运动，角速度为 $\\omega = ${w}$ rad/s。计算作用在质点上的向心力大小 $F_c$（单位：牛顿 N）。`,
        );
        const solution = t(
          steps(
            `The centripetal acceleration for circular motion is $a_c = \\omega^2 R = (${w})^2 (${R}) = ${w * w * R}$ m/s$^2$.`,
            `Apply Newton's Second Law for centripetal force: $F_c = m a_c = m \\omega^2 R$.`,
            `Calculate: $F_c = (${m})(${w * w * R}) = ${Fc}$ N.`,
          ),
          steps(
            `圆周运动的向心加速度为 $a_c = \\omega^2 R = (${w})^2 (${R}) = ${w * w * R}$ m/s$^2$。`,
            `根据牛顿第二定律，向心力为 $F_c = m a_c = m \\omega^2 R$。`,
            `代入数值计算：$F_c = (${m})(${w * w * R}) = ${Fc}$ N。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: Fc,
          wrong: [m * w * R, Fc + m * w, 2 * Fc],
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 6.28 Applications of Multiple Integrals
// ---------------------------------------------------------------------------

/** theAverageValueOfAMultivariableFunction computes f_avg = (1/Area) ∬ f dA. */
export const theAverageValueOfAMultivariableFunction: TopicDef = {
  id: "the-average-value-of-a-multivariable-function",
  title: t("The Average Value of a Multivariable Function", "多元函数的平均值"),
  summary: t(
    "The average value of a continuous function f(x, y) over a planar region D is f_avg = (1 / Area(D)) ∬_D f(x, y) dA.",
    "连续多元函数 f(x, y) 在平面区域 D 上的平均值定义为 f_avg = (1 / Area(D)) ∬_D f(x, y) dA。",
  ),
  prerequisites: ["double-integrals-over-rectangular-domains"],
  encompasses: [{ topic: "double-integrals-over-rectangular-domains", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "calculating-average-values-over-planar-domains",
      title: t("Calculating average values over planar domains", "计算平面区域上多元函数的平均值"),
      explanation: t(
        "For $f(x, y) = ax + by$ on a rectangle $[0, W] \\times [0, H]$, the integral is $\\iint_D (ax + by)\\,dA = a \\frac{W^2}{2} H + b W \\frac{H^2}{2}$. Dividing by $\\text{Area}(D) = W H$ yields $f_{\\text{avg}} = a \\frac{W}{2} + b \\frac{H}{2}$.",
        "对于定义在矩形 $[0, W] \\times [0, H]$ 上的函数 $f(x, y) = ax + by$，其二重积分为 $\\iint_D (ax + by)\\,dA = a \\frac{W^2}{2} H + b W \\frac{H^2}{2}$。除以底面面积 $\\text{Area}(D) = W H$ 得平均值 $f_{\\text{avg}} = a \\frac{W}{2} + b \\frac{H}{2}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 8);
        const b = rng.int(2, 8);
        const halfW = rng.int(1, 6);
        const halfH = rng.int(1, 6);
        const W = 2 * halfW;
        const H = 2 * halfH;
        const ans = a * halfW + b * halfH;

        const prompt = t(
          `Find the average value $f_{\\text{avg}}$ of $f(x, y) = ${a}x + ${b}y$ over the rectangle $D = [0, ${W}] \\times [0, ${H}]$.`,
          `求函数 $f(x, y) = ${a}x + ${b}y$ 在矩形区域 $D = [0, ${W}] \\times [0, ${H}]$ 上的平均值 $f_{\\text{avg}}$。`,
        );
        const solution = t(
          steps(
            `The average value formula is $f_{\\text{avg}} = \\frac{1}{\\text{Area}(D)} \\iint_D f(x, y)\\,dA$.`,
            `The area of rectangle $D$ is $W \\times H = ${W} \\times ${H} = ${W * H}$.`,
            `Compute the integral: $\\iint_D (${a}x + ${b}y)\\,dA = ${a} \\left(\\frac{${W}^2}{2}\\right)(${H}) + ${b}(${W})\\left(\\frac{${H}^2}{2}\\right) = ${a * halfW * W * H} + ${b * halfH * W * H} = ${ans * W * H}$.`,
            `Divide by area: $f_{\\text{avg}} = \\frac{${ans * W * H}}{${W * H}} = ${ans}$.`,
          ),
          steps(
            `平均值公式为 $f_{\\text{avg}} = \\frac{1}{\\text{Area}(D)} \\iint_D f(x, y)\\,dA$。`,
            `矩形区域面积为 $W \\times H = ${W} \\times ${H} = ${W * H}$。`,
            `计算二重积分：$\\iint_D (${a}x + ${b}y)\\,dA = ${ans * W * H}$。`,
            `除以面积即得平均值：$f_{\\text{avg}} = \\frac{${ans * W * H}}{${W * H}} = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [a * W + b * H, ans + a, ans - b],
        });
      },
    },
  ],
};

/** densityMassAndChargeOfPlaneLaminas calculates total mass M = ∬ ρ dA. */
export const densityMassAndChargeOfPlaneLaminas: TopicDef = {
  id: "density-mass-and-charge-of-plane-laminas",
  title: t("Density, Mass, and Charge of Plane Laminas", "平面薄片的密度、质量与电荷"),
  summary: t(
    "Total mass or net electric charge of a planar lamina with area density ρ(x, y) is M = ∬_D ρ(x, y) dA.",
    "面密度为 ρ(x, y) 的平面薄片的总质量或净电荷等于面密度的二重积分：M = ∬_D ρ(x, y) dA。",
  ),
  prerequisites: ["double-integrals-over-rectangular-domains"],
  encompasses: [{ topic: "double-integrals-over-rectangular-domains", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "calculating-total-mass-and-charge-from-area-density",
      title: t("Calculating total mass and charge from area density", "由面密度积分计算薄片总质量与总电荷"),
      explanation: t(
        "Given area density $\\rho(x, y) = ax + b$ on $[0, W] \\times [0, H]$, the total mass is $M = \\int_0^H dy \\int_0^W (ax + b)\\,dx = H [a \\frac{W^2}{2} + bW]$.",
        "对于在矩形 $[0, W] \\times [0, H]$ 上面密度为 $\\rho(x, y) = ax + b$ 的薄片，总质量为 $M = \\int_0^H dy \\int_0^W (ax + b)\\,dx = H [a \\frac{W^2}{2} + bW]$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const b = rng.int(1, 5);
        const halfW = rng.int(1, 5);
        const W = 2 * halfW;
        const H = rng.int(2, 6);
        const mass = H * (a * halfW * W + b * W);

        const prompt = t(
          `Find the total mass $M$ of a planar lamina occupying the rectangle $D = [0, ${W}] \\times [0, ${H}]$ with density function $\\rho(x, y) = ${a}x + ${b}$.`,
          `求占据矩形区域 $D = [0, ${W}] \\times [0, ${H}]$、面密度为 $\\rho(x, y) = ${a}x + ${b}$ 的平面薄片的总质量 $M$。`,
        );
        const solution = t(
          steps(
            `Total mass is given by $M = \\iint_D \\rho(x, y)\\,dA = \\int_0^{${H}} dy \\int_0^{${W}} (${a}x + ${b})\\,dx$.`,
            `Integrate with respect to $x$: $\\left[\\frac{${a}}{2}x^2 + ${b}x\\right]_0^{${W}} = ${a}\\left(\\frac{${W}^2}{2}\\right) + ${b}(${W}) = ${a * halfW * W} + ${b * W} = ${a * halfW * W + b * W}$.`,
            `Integrate with respect to $y$: multiply by $H = ${H}$: $M = (${a * halfW * W + b * W}) \\times ${H} = ${mass}$.`,
          ),
          steps(
            `总质量公式为 $M = \\iint_D \\rho(x, y)\\,dA = \\int_0^{${H}} dy \\int_0^{${W}} (${a}x + ${b})\\,dx$。`,
            `对 $x$ 积分：$\\left[\\frac{${a}}{2}x^2 + ${b}x\\right]_0^{${W}} = ${a * halfW * W + b * W}$。`,
            `对 $y$ 积分：乘以高 $H = ${H}$ 得 $M = (${a * halfW * W + b * W}) \\times ${H} = ${mass}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: mass,
          wrong: [W * H, mass + H, 2 * mass],
        });
      },
    },
  ],
};

/** momentsAndCenterOfMass defines moments and center of mass for planar regions. */
export const momentsAndCenterOfMass: TopicDef = {
  id: "moments-and-center-of-mass",
  title: t("Moments and Center of Mass", "质心与力矩的概念"),
  summary: t(
    "First moments M_y = ∬ x ρ dA and M_x = ∬ y ρ dA locate the center of mass (x̄, ȳ) = (M_y / M, M_x / M).",
    "一阶矩 M_y = ∬ x ρ dA 与 M_x = ∬ y ρ dA 确定质心坐标 (x̄, ȳ) = (M_y / M, M_x / M)。",
  ),
  prerequisites: ["density-mass-and-charge-of-plane-laminas"],
  encompasses: [{ topic: "density-mass-and-charge-of-plane-laminas", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "defining-moments-and-center-of-mass-coordinates",
      title: t("Defining moments and center of mass coordinates", "一阶矩与质心坐标的定义"),
      explanation: t(
        "The first moment about the $y$-axis is $M_y = \\iint_D x \\rho(x, y)\\,dA$. For a uniform lamina ($\\\\rho = 1$) over $[0, W] \\times [0, H]$, $M_y = \\int_0^H dy \\int_0^W x\\,dx = H \\frac{W^2}{2}$.",
        "薄片对 $y$ 轴的一阶矩为 $M_y = \\iint_D x \\rho(x, y)\\,dA$。对于矩形 $[0, W] \\times [0, H]$ 上的均匀薄片（$\\rho = 1$），$M_y = \\int_0^H dy \\int_0^W x\\,dx = H \\frac{W^2}{2}$。",
      ),
      generate(rng: Rng): Problem {
        const halfW = rng.int(1, 6);
        const W = 2 * halfW;
        const H = rng.int(2, 8);
        const My = H * halfW * W;

        const prompt = t(
          `Calculate the first moment about the $y$-axis, $M_y = \\iint_D x\\,dA$, for the uniform rectangular lamina $D = [0, ${W}] \\times [0, ${H}]$ (with density $\\rho = 1$).`,
          `计算均匀矩形薄片 $D = [0, ${W}] \\times [0, ${H}]$（面密度 $\\rho = 1$）对 $y$ 轴的一阶矩 $M_y = \\iint_D x\\,dA$。`,
        );
        const solution = t(
          steps(
            `The formula for the moment about the $y$-axis is $M_y = \\int_0^{${H}} dy \\int_0^{${W}} x\\,dx$.`,
            `Evaluate the inner integral: $\\int_0^{${W}} x\\,dx = \\left[\\frac{x^2}{2}\\right]_0^{${W}} = \\frac{${W}^2}{2} = ${halfW * W}$.`,
            `Multiply by the $y$-interval length $H = ${H}$: $M_y = ${halfW * W} \\times ${H} = ${My}$.`,
          ),
          steps(
            `对 $y$ 轴一阶矩计算公式为 $M_y = \\int_0^{${H}} dy \\int_0^{${W}} x\\,dx$。`,
            `内层对 $x$ 积分：$\\int_0^{${W}} x\\,dx = \\frac{${W}^2}{2} = ${halfW * W}$。`,
            `外层对 $y$ 积分：乘以区间长度 $H = ${H}$ 得 $M_y = ${My}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: My,
          wrong: [W * H, My + W, 2 * My],
        });
      },
    },
  ],
};

/** momentsAndCentersOfMassOfThinRods finds centers of mass in 1D. */
export const momentsAndCentersOfMassOfThinRods: TopicDef = {
  id: "moments-and-centers-of-mass-of-thin-rods",
  title: t("Moments and Centers of Mass of Thin Rods", "细棒的力矩与质心"),
  summary: t(
    "For a straight thin rod along [0, L] with linear density λ(x), total mass is m = ∫ λ dx and center of mass is x̄ = (1/m) ∫ x λ dx.",
    "对于位于 [0, L] 且线密度为 λ(x) 的细直棒，总质量为 m = ∫ λ dx，质心坐标为 x̄ = (1/m) ∫ x λ dx。",
  ),
  prerequisites: ["moments-and-center-of-mass"],
  encompasses: [{ topic: "moments-and-center-of-mass", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "one-dimensional-center-of-mass-integrals",
      title: t("One-dimensional center of mass integrals", "一维细棒质心的一元定积分计算"),
      explanation: t(
        "For a thin rod with linear density $\\lambda(x) = kx$ on $[0, L]$, total mass is $m = \\int_0^L kx\\,dx = \\frac{k L^2}{2}$, and the first moment about the origin is $M_0 = \\int_0^L k x^2\\,dx = \\frac{k L^3}{3}$.",
        "对于在 $[0, L]$ 上线密度为 $\\lambda(x) = kx$ 的细棒，总质量为 $m = \\int_0^L kx\\,dx = \\frac{k L^2}{2}$，对原点的一阶矩为 $M_0 = \\int_0^L k x^2\\,dx = \\frac{k L^3}{3}$。",
      ),
      generate(rng: Rng): Problem {
        const kappa = rng.int(1, 5);
        const k = 2 * kappa; // so mass = kappa * L^2 is an integer
        const L = rng.int(2, 8);
        const mass = kappa * L * L;

        const prompt = t(
          `A thin straight rod occupies the interval $[0, ${L}]$ with linear density $\\lambda(x) = ${k}x$. Find the total mass $m$ of the rod.`,
          `一根细直棒占据区间 $[0, ${L}]$，其线密度为 $\\lambda(x) = ${k}x$。求该细棒的总质量 $m$。`,
        );
        const solution = t(
          steps(
            `Total mass is obtained by integrating the linear density: $m = \\int_0^{${L}} \\lambda(x)\\,dx = \\int_0^{${L}} ${k}x\\,dx$.`,
            `Evaluate the integral: $m = \\left[${kappa}x^2\\right]_0^{${L}} = ${kappa}(${L})^2 = ${kappa}(${L * L}) = ${mass}$.`,
          ),
          steps(
            `总质量由对线密度积分求得：$m = \\int_0^{${L}} \\lambda(x)\\,dx = \\int_0^{${L}} ${k}x\\,dx$。`,
            `定积分求值：$m = \\left[${kappa}x^2\\right]_0^{${L}} = ${kappa}(${L})^2 = ${mass}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: mass,
          wrong: [k * L, mass + k, 2 * mass],
        });
      },
    },
  ],
};

/** momentsAndCentersOfMassOfPlaneLaminas calculates centers of mass of 2D laminas. */
export const momentsAndCentersOfMassOfPlaneLaminas: TopicDef = {
  id: "moments-and-centers-of-mass-of-plane-laminas",
  title: t("Moments and Centers of Mass of Plane Laminas", "平面薄片的质心计算"),
  summary: t(
    "For a planar lamina D with varying density ρ(x, y), center of mass coordinates are x̄ = (1/M) ∬ x ρ dA and ȳ = (1/M) ∬ y ρ dA.",
    "对于具有变面密度 ρ(x, y) 的平面薄片 D，质心坐标为 x̄ = (1/M) ∬ x ρ dA 与 ȳ = (1/M) ∬ y ρ dA。",
  ),
  prerequisites: ["moments-and-center-of-mass"],
  encompasses: [{ topic: "moments-and-center-of-mass", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "two-dimensional-center-of-mass-calculations",
      title: t("Two-dimensional center of mass calculations", "二维平面薄片质心坐标的计算"),
      explanation: t(
        "For a rectangle $[0, W] \\times [0, H]$ with density $\\rho(x, y) = c x$, the $x$-centroid coordinate is $\\bar{x} = \\frac{\\int_0^W x^2 dx}{\\int_0^W x dx} = \\frac{\\frac{1}{3}W^3}{\\frac{1}{2}W^2} = \\frac{2}{3}W$. When $W = 3w$, $\\bar{x} = 2w$.",
        "对于在矩形 $[0, W] \\times [0, H]$ 上面密度为 $\\rho(x, y) = c x$ 的薄片，质心横坐标为 $\\bar{x} = \\frac{\\int_0^W x^2 dx}{\\int_0^W x dx} = \\frac{\\frac{1}{3}W^3}{\\frac{1}{2}W^2} = \\frac{2}{3}W$。若 $W = 3w$，则 $\\bar{x} = 2w$。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(1, 5);
        const w = rng.int(1, 8);
        const W = 3 * w;
        const H = rng.int(2, 8);
        const xBar = 2 * w;

        const prompt = t(
          `Find the $x$-coordinate of the center of mass $\\bar{x}$ of the planar lamina occupying $D = [0, ${W}] \\times [0, ${H}]$ with density $\\rho(x, y) = ${c}x$.`,
          `求占据矩形区域 $D = [0, ${W}] \\times [0, ${H}]$、面密度为 $\\rho(x, y) = ${c}x$ 的平面薄片质心的横坐标 $\\bar{x}$。`,
        );
        const solution = t(
          steps(
            `The total mass is $M = \\iint_D ${c}x\\,dA = ${c} H \\int_0^{${W}} x\\,dx = ${c} H \\left(\\frac{${W}^2}{2}\\right)$.`,
            `The moment about the $y$-axis is $M_y = \\iint_D x(${c}x)\\,dA = ${c} H \\int_0^{${W}} x^2\\,dx = ${c} H \\left(\\frac{${W}^3}{3}\\right)$.`,
            `Compute $\\bar{x} = \\frac{M_y}{M} = \\frac{\\frac{1}{3}W^3}{\\frac{1}{2}W^2} = \\frac{2}{3}W = \\frac{2}{3}(${W}) = ${xBar}$.`,
          ),
          steps(
            `总质量为 $M = \\iint_D ${c}x\\,dA = ${c} H \\int_0^{${W}} x\\,dx = ${c} H \\frac{${W}^2}{2}$。`,
            `对 $y$ 轴一阶矩为 $M_y = \\iint_D x(${c}x)\\,dA = ${c} H \\int_0^{${W}} x^2\\,dx = ${c} H \\frac{${W}^3}{3}$。`,
            `计算质心横坐标：$\\bar{x} = \\frac{M_y}{M} = \\frac{2}{3}W = \\frac{2}{3}(${W}) = ${xBar}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: xBar,
          wrong: [w, W, xBar + 1],
        });
      },
    },
  ],
};

/** momentsOfInertiaOfLaminasAboutTheCoordinateAxes calculates rotational inertia. */
export const momentsOfInertiaOfLaminasAboutTheCoordinateAxes: TopicDef = {
  id: "moments-of-inertia-of-laminas-about-the-coordinate-axes",
  title: t("Moments of Inertia of Laminas About the Coordinate Axes", "薄片对坐标轴的转动惯量"),
  summary: t(
    "The moments of inertia about the coordinate axes are I_x = ∬ y^2 ρ dA and I_y = ∬ x^2 ρ dA.",
    "薄片对坐标轴的转动惯量定义为 I_x = ∬ y^2 ρ dA 与 I_y = ∬ x^2 ρ dA。",
  ),
  prerequisites: ["moments-and-centers-of-mass-of-plane-laminas"],
  encompasses: [
    {
      topic: "moments-and-centers-of-mass-of-plane-laminas",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-moments-of-inertia-about-axes",
      title: t("Evaluating moments of inertia about axes", "计算薄片对坐标轴的转动惯量"),
      explanation: t(
        "For a uniform rectangular lamina $[0, W] \\times [0, H]$ with $\\rho = 1$, the moment of inertia about the $x$-axis is $I_x = \\int_0^W dx \\int_0^H y^2\\,dy = W \\frac{H^3}{3}$.",
        "对于在 $[0, W] \\times [0, H]$ 上面密度为 $\\rho = 1$ 的均匀矩形薄片，对 $x$ 轴的转动惯量为 $I_x = \\int_0^W dx \\int_0^H y^2\\,dy = W \\frac{H^3}{3}$。",
      ),
      generate(rng: Rng): Problem {
        const W = rng.int(2, 8);
        const h = rng.int(1, 5);
        const H = 3 * h;
        const Ix = W * 9 * h * h * h;

        const prompt = t(
          `Calculate the moment of inertia about the $x$-axis, $I_x = \\iint_D y^2\\,dA$, for the uniform rectangular lamina $D = [0, ${W}] \\times [0, ${H}]$ (with density $\\rho = 1$).`,
          `计算均匀矩形薄片 $D = [0, ${W}] \\times [0, ${H}]$（面密度 $\\rho = 1$）对 $x$ 轴的转动惯量 $I_x = \\iint_D y^2\\,dA$。`,
        );
        const solution = t(
          steps(
            `The moment of inertia formula about the $x$-axis is $I_x = \\int_0^{${W}} dx \\int_0^{${H}} y^2\\,dy$.`,
            `Evaluate the $x$-integral: $\\int_0^{${W}} 1\\,dx = ${W}$.`,
            `Evaluate the $y$-integral: $\\int_0^{${H}} y^2\\,dy = \\left[\\frac{y^3}{3}\\right]_0^{${H}} = \\frac{${H}^3}{3} = \\frac{${H * H * H}}{3} = ${9 * h * h * h}$.`,
            `Multiply: $I_x = ${W} \\times ${9 * h * h * h} = ${Ix}$.`,
          ),
          steps(
            `对 $x$ 轴转动惯量计算公式为 $I_x = \\int_0^{${W}} dx \\int_0^{${H}} y^2\\,dy$。`,
            `对 $x$ 积分：区间长度为 $W = ${W}$。`,
            `对 $y$ 积分：$\\int_0^{${H}} y^2\\,dy = \\frac{${H}^3}{3} = ${9 * h * h * h}$。`,
            `相乘得：$I_x = ${W} \\times ${9 * h * h * h} = ${Ix}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: Ix,
          wrong: [W * H * H, Ix + W, 2 * Ix],
        });
      },
    },
  ],
};

/** momentsOfInertiaOfLaminasAboutOtherAxes computes inertia about arbitrary lines. */
export const momentsOfInertiaOfLaminasAboutOtherAxes: TopicDef = {
  id: "moments-of-inertia-of-laminas-about-other-axes",
  title: t("Moments of Inertia of Laminas About Other Axes", "薄片对任意轴的转动惯量"),
  summary: t(
    "The moment of inertia of a body about any axis L is I_L = ∬ d(x, y)^2 ρ dA where d(x, y) is perpendicular distance to line L.",
    "物体对任意轴 L 的转动惯量为 I_L = ∬ d(x, y)^2 ρ dA，其中 d(x, y) 为点 (x, y) 到直线 L 的垂直距离。",
  ),
  prerequisites: ["moments-of-inertia-of-laminas-about-the-coordinate-axes"],
  encompasses: [
    {
      topic: "moments-of-inertia-of-laminas-about-the-coordinate-axes",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-moments-of-inertia-about-shifted-axes",
      title: t("Evaluating moments of inertia about shifted axes", "计算对平移轴或端点轴的转动惯量"),
      explanation: t(
        "For a uniform thin rod of mass $M$ and length $L$, the moment of inertia about an axis through one end perpendicular to the rod is $I_{\\text{end}} = \\int_0^L \\frac{M}{L} x^2\\,dx = \\frac{1}{3} M L^2$. When $L = 6\\ell$, $\\frac{1}{3} M L^2 = 12 M \\ell^2$.",
        "对于质量为 $M$、长度为 $L$ 的均匀细棒，绕通过其一端且垂直于棒的轴的转动惯量为 $I_{\\text{end}} = \\int_0^L \\frac{M}{L} x^2\\,dx = \\frac{1}{3} M L^2$。若 $L = 6\\ell$，则 $\\frac{1}{3} M L^2 = 12 M \\ell^2$。",
      ),
      generate(rng: Rng): Problem {
        const M = rng.int(2, 7);
        const ell = rng.int(1, 5);
        const L = 6 * ell;
        const Iend = 12 * M * ell * ell;

        const prompt = t(
          `Find the moment of inertia $I$ of a uniform thin rod of mass $M = ${M}$ kg and length $L = ${L}$ m about an axis passing through one of its endpoints perpendicular to the rod.`,
          `一均匀细棒质量为 $M = ${M}$ kg，长度为 $L = ${L}$ m。求该细棒绕通过其一端且垂直于棒的转轴的转动惯量 $I$（单位：kg·m$^2$）。`,
        );
        const solution = t(
          steps(
            `The formula for the moment of inertia of a thin rod about an endpoint is $I = \\frac{1}{3} M L^2$.`,
            `Substitute $M = ${M}$ and $L = ${L}$: $L^2 = ${L * L}$.`,
            `Compute: $I = \\frac{1}{3}(${M})(${L * L}) = ${M} \\times ${(L * L) / 3} = ${Iend}$ kg·m$^2$.`,
          ),
          steps(
            `细棒绕端点的转动惯量公式为 $I = \\frac{1}{3} M L^2$。`,
            `代入 $M = ${M}$ 与 $L = ${L}$：$L^2 = ${L * L}$。`,
            `计算得：$I = \\frac{1}{3}(${M})(${L * L}) = ${Iend}$ kg·m$^2$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: Iend,
          wrong: [M * L * L, Iend + M, 2 * Iend],
        });
      },
    },
  ],
};

/** calculatingTheRadiusOfGyrationOfAPlaneLamina defines k_bar^2 = I / M. */
export const calculatingTheRadiusOfGyrationOfAPlaneLamina: TopicDef = {
  id: "calculating-the-radius-of-gyration-of-a-plane-lamina",
  title: t("Calculating the Radius of Gyration of a Plane Lamina", "计算平面薄片的回转半径"),
  summary: t(
    "The radius of gyration k̄ represents the effective distance at which the entire mass could be concentrated: I = M k̄^2.",
    "回转半径 k̄ 代表假设全部质量集中于单一点时保持相同转动惯量的有效距离：I = M k̄^2。",
  ),
  prerequisites: ["moments-of-inertia-of-laminas-about-the-coordinate-axes"],
  encompasses: [
    {
      topic: "moments-of-inertia-of-laminas-about-the-coordinate-axes",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "determining-the-squared-radius-of-gyration",
      title: t("Determining the squared radius of gyration", "确定回转半径的平方值"),
      explanation: t(
        "For a uniform rectangular lamina of height $H$ rotated about the base axis, $I_x = \\frac{1}{3} M H^2$, so the squared radius of gyration is $\\bar{k}_x^2 = \\frac{I_x}{M} = \\frac{H^2}{3}$. When $H = 3h$, $\\bar{k}_x^2 = 3h^2$.",
        "对于高为 $H$ 的均匀矩形薄片绕底边所在坐标轴旋转，$I_x = \\frac{1}{3} M H^2$，因此回转半径平方为 $\\bar{k}_x^2 = \\frac{I_x}{M} = \\frac{H^2}{3}$。当 $H = 3h$ 时，$\\bar{k}_x^2 = 3h^2$。",
      ),
      generate(rng: Rng): Problem {
        const W = rng.int(2, 9);
        const h = rng.int(1, 8);
        const H = 3 * h;
        const ans = 3 * h * h;

        const prompt = t(
          `Find the squared radius of gyration $\\bar{k}_x^2$ about the $x$-axis for the uniform rectangular lamina occupying $D = [0, ${W}] \\times [0, ${H}]$.`,
          `求占据矩形区域 $D = [0, ${W}] \\times [0, ${H}]$ 的均匀矩形薄片绕 $x$ 轴的回转半径平方 $\\bar{k}_x^2$。`,
        );
        const solution = t(
          steps(
            `The radius of gyration is defined by $I_x = M \\bar{k}_x^2$, so $\\bar{k}_x^2 = \\frac{I_x}{M}$.`,
            `For a uniform rectangle on $[0, W] \\times [0, H]$, $I_x = \\frac{1}{3} M H^2$.`,
            `Therefore, $\\bar{k}_x^2 = \\frac{H^2}{3} = \\frac{${H}^2}{3} = \\frac{${H * H}}{3} = ${ans}$.`,
          ),
          steps(
            `回转半径满足 $I_x = M \\bar{k}_x^2$，故 $\\bar{k}_x^2 = \\frac{I_x}{M}$。`,
            `对于矩形薄片，$I_x = \\frac{1}{3} M H^2$。`,
            `因此 $\\bar{k}_x^2 = \\frac{H^2}{3} = \\frac{${H * H}}{3} = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [H * H, ans + 3, ans - 3],
        });
      },
    },
  ],
};

/** theParallelAxisTheorem relates inertia about parallel axes: I = I_cm + M d^2. */
export const theParallelAxisTheorem: TopicDef = {
  id: "the-parallel-axis-theorem",
  title: t("The Parallel Axis Theorem", "平行轴定理"),
  summary: t(
    "The Parallel Axis Theorem states that the moment of inertia about any axis L is related to the centroidal moment of inertia by I = I_cm + M d^2.",
    "平行轴定理指出：物体绕任意轴 L 的转动惯量与绕过质心的平行轴的转动惯量满足关系式 I = I_cm + M d^2。",
  ),
  prerequisites: ["moments-of-inertia-of-laminas-about-other-axes"],
  encompasses: [
    {
      topic: "moments-of-inertia-of-laminas-about-other-axes",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "applying-the-parallel-axis-theorem",
      title: t("Applying the Parallel Axis Theorem", "应用平行轴定理计算转动惯量"),
      explanation: t(
        "The Parallel Axis Theorem states $I = I_{\\text{cm}} + M d^2$ where $I_{\\text{cm}}$ is the moment of inertia about an axis through the center of mass, $M$ is total mass, and $d$ is the distance between the two parallel axes.",
        "平行轴定理表述为 $I = I_{\\text{cm}} + M d^2$，其中 $I_{\\text{cm}}$ 为通过质心的轴的转动惯量，$M$ 为总质量，$d$ 为两平行轴之间的垂直距离。",
      ),
      generate(rng: Rng): Problem {
        const Icm = rng.int(10, 50);
        const M = rng.int(2, 9);
        const d = rng.int(2, 7);
        const ans = Icm + M * d * d;

        const prompt = t(
          `A rigid body of mass $M = ${M}$ kg has moment of inertia $I_{\\text{cm}} = ${Icm}$ kg·m$^2$ about an axis passing through its center of mass. Using the Parallel Axis Theorem, find the moment of inertia $I$ about a parallel axis located at distance $d = ${d}$ m.`,
          `一质量为 $M = ${M}$ kg 的刚体绕通过其质心的转轴的转动惯量为 $I_{\\text{cm}} = ${Icm}$ kg·m$^2$。利用平行轴定理，求该刚体绕与该轴距离为 $d = ${d}$ m 的平行转轴的转动惯量 $I$。`,
        );
        const solution = t(
          steps(
            `State the Parallel Axis Theorem: $I = I_{\\text{cm}} + M d^2$.`,
            `Compute the shift term: $M d^2 = ${M} \\times (${d})^2 = ${M} \\times ${d * d} = ${M * d * d}$.`,
            `Add to centroidal inertia: $I = ${Icm} + ${M * d * d} = ${ans}$ kg·m$^2$.`,
          ),
          steps(
            `应用平行轴定理公式：$I = I_{\\text{cm}} + M d^2$。`,
            `计算平移增量：$M d^2 = ${M} \\times (${d})^2 = ${M * d * d}$。`,
            `加上质心转动惯量：$I = ${Icm} + ${M * d * d} = ${ans}$ kg·m$^2$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [Icm + M * d, ans + M, ans - d],
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 6.29 Random Variables
// ---------------------------------------------------------------------------

/** probabilityDensityFunctionsOfContinuousRandomVariables defines joint pdfs. */
export const probabilityDensityFunctionsOfContinuousRandomVariables: TopicDef = {
  id: "probability-density-functions-of-continuous-random-variables",
  title: t("Probability Density Functions of Continuous Random Variables", "连续型随机变量的概率密度函数"),
  summary: t(
    "A continuous joint probability density function f(x, y) satisfies f(x, y) ≥ 0 and ∬_R^2 f(x, y) dA = 1.",
    "连续型联合概率密度函数 f(x, y) 满足非负性 f(x, y) ≥ 0 以及全平面归一化条件 ∬_R^2 f(x, y) dA = 1。",
  ),
  prerequisites: ["double-integrals-over-rectangular-domains"],
  encompasses: [{ topic: "double-integrals-over-rectangular-domains", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "normalizing-multivariable-probability-density-functions",
      title: t("Normalizing multivariable probability density functions", "多元概率密度函数的归一化条件与常数确定"),
      explanation: t(
        "For a uniform joint density $f(x, y) = C$ supported on the rectangle $[0, a] \\times [0, b]$, normalization requires $\\iint_D C\\,dA = C(ab) = 1$, so $C = \\frac{1}{ab}$, or $1/C = ab$.",
        "对于在矩形 $[0, a] \\times [0, b]$ 上均匀分布的联合概率密度 $f(x, y) = C$，由归一化条件 $\\iint_D C\\,dA = C(ab) = 1$，得 $C = \\frac{1}{ab}$，即常数倒数为 $1/C = ab$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const invC = a * b;

        const prompt = t(
          `A continuous two-dimensional random variable $(X, Y)$ is uniformly distributed over the rectangle $D = [0, ${a}] \\times [0, ${b}]$ with joint probability density function $f(x, y) = C$. Find the value of $1/C$.`,
          `二维连续型随机变量 $(X, Y)$ 在矩形区域 $D = [0, ${a}] \\times [0, ${b}]$ 上服从均匀分布，其联合概率密度函数为 $f(x, y) = C$。求常数倒数 $1/C$ 的值。`,
        );
        const solution = t(
          steps(
            `The total probability over the entire support domain must equal 1: $\\iint_D f(x, y)\\,dA = 1$.`,
            `Compute the integral: $\\iint_D C\\,dA = C \\times \\text{Area}(D) = C (${a} \\times ${b}) = ${invC}C$.`,
            `Equating to 1 gives $${invC}C = 1$, which implies $1/C = ${invC}$.`,
          ),
          steps(
            `全区域上的总概率必须满足归一化条件：$\\iint_D f(x, y)\\,dA = 1$。`,
            `计算二重积分：$\\iint_D C\\,dA = C \\times \\text{Area}(D) = C (${a} \\times ${b}) = ${invC}C$。`,
            `令其等于 1 得 $${invC}C = 1$，因此 $1/C = ${invC}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: invC,
          wrong: [a + b, 2 * invC, invC + a],
        });
      },
    },
  ],
};

/** calculatingProbabilitiesWithContinuousRandomVariables computes P((X, Y) ∈ R). */
export const calculatingProbabilitiesWithContinuousRandomVariables: TopicDef = {
  id: "calculating-probabilities-with-continuous-random-variables",
  title: t("Calculating Probabilities With Continuous Random Variables", "连续型随机变量区域概率的计算"),
  summary: t(
    "The probability that (X, Y) falls in a subregion R is evaluated by the double integral P((X, Y) ∈ R) = ∬_R f(x, y) dA.",
    "连续型随机变量落在区域 R 内的概率通过对联合概率密度做二重积分计算：P((X, Y) ∈ R) = ∬_R f(x, y) dA。",
  ),
  prerequisites: ["probability-density-functions-of-continuous-random-variables"],
  encompasses: [
    {
      topic: "probability-density-functions-of-continuous-random-variables",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-joint-probabilities-via-double-integrals",
      title: t("Evaluating joint probabilities via double integrals", "通过二重积分计算联合概率"),
      explanation: t(
        "If $(X, Y)$ is uniformly distributed with joint density $f(x, y) = \\frac{1}{W H}$ on $[0, W] \\times [0, H]$, the probability $P(X \\le x_1, Y \\le y_1) = \\frac{x_1 y_1}{W H}$.",
        "若 $(X, Y)$ 在 $[0, W] \\times [0, H]$ 上均匀分布，联合概率密度为 $f(x, y) = \\frac{1}{W H}$，则概率为 $P(X \\le x_1, Y \\le y_1) = \\frac{x_1 y_1}{W H}$。",
      ),
      generate(rng: Rng): Problem {
        const x1 = rng.int(1, 4);
        const y1 = rng.int(1, 4);
        const W = rng.int(x1 + 1, x1 + 6);
        const H = rng.int(y1 + 1, y1 + 6);
        const ans = Q.of(x1 * y1, W * H);

        const prompt = t(
          `Let $(X, Y)$ be uniformly distributed over the rectangle $[0, ${W}] \\times [0, ${H}]$. Calculate the probability $P(X \\le ${x1}, Y \\le ${y1})$.`,
          `设二维随机变量 $(X, Y)$ 在矩形区域 $[0, ${W}] \\times [0, ${H}]$ 上服从均匀分布。计算概率 $P(X \\le ${x1}, Y \\le ${y1})$。`,
        );
        const solution = t(
          steps(
            `The joint density is $f(x, y) = \\frac{1}{W H} = \\frac{1}{${W * H}}$.`,
            `The subregion is $R = [0, ${x1}] \\times [0, ${y1}]$, which has area $${x1} \\times ${y1} = ${x1 * y1}$.`,
            `Compute the probability: $P(X \\le ${x1}, Y \\le ${y1}) = \\frac{\\text{Area}(R)}{\\text{Area}(D)} = \\frac{${x1 * y1}}{${W * H}} = ${ans.toLatex()}$.`,
          ),
          steps(
            `联合概率密度为 $f(x, y) = \\frac{1}{W H} = \\frac{1}{${W * H}}$。`,
            `子区域为 $R = [0, ${x1}] \\times [0, ${y1}]$，其面积为 $${x1} \\times ${y1} = ${x1 * y1}$。`,
            `计算概率：$P(X \\le ${x1}, Y \\le ${y1}) = \\frac{${x1 * y1}}{${W * H}} = ${ans.toLatex()}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [Q.of(x1, W), Q.of(y1, H), ans.mul(Q.of(2))],
        });
      },
    },
  ],
};

/** continuousRandomVariablesOverInfiniteDomains integrates densities over ℝ_≥0^2. */
export const continuousRandomVariablesOverInfiniteDomains: TopicDef = {
  id: "continuous-random-variables-over-infinite-domains",
  title: t("Continuous Random Variables Over Infinite Domains", "无穷区域上的连续型随机变量"),
  summary: t(
    "Improper double integrals evaluate joint probability distributions supported on unbounded domains such as the first quadrant.",
    "通过反常二重积分计算在第一象限等无界区域上定义的联合概率分布。",
  ),
  prerequisites: ["calculating-probabilities-with-continuous-random-variables", "improper-integrals-involving-exponential-functions"],
  encompasses: [
    {
      topic: "calculating-probabilities-with-continuous-random-variables",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "integrating-joint-densities-over-unbounded-regions",
      title: t("Integrating joint densities over unbounded regions", "在无界区域上计算联合概率密度的反常二重积分"),
      explanation: t(
        "For independent exponential decay $f(x, y) = c e^{-ax - by}$ over $x \\ge 0, y \\ge 0$, the improper integral is $\\int_0^\\infty dx \\int_0^\\infty c e^{-ax - by} dy = c \\left(\\frac{1}{a}\\right)\\left(\\frac{1}{b}\\right) = \\frac{c}{ab}$.",
        "对于在第一象限 $x \\ge 0, y \\ge 0$ 上的指数衰减函数 $f(x, y) = c e^{-ax - by}$，其反常二重积分为 $\\int_0^\\infty dx \\int_0^\\infty c e^{-ax - by} dy = c \\left(\\frac{1}{a}\\right)\\left(\\frac{1}{b}\\right) = \\frac{c}{ab}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 6);
        const b = rng.int(2, 6);
        const k = rng.int(2, 8);
        const c = k * a * b;
        const ans = k;

        const prompt = t(
          `Evaluate the improper double integral $\\int_0^\\infty \\int_0^\\infty ${c} e^{-${a}x - ${b}y}\\,dx\\,dy$.`,
          `计算反常二重积分 $\\int_0^\\infty \\int_0^\\infty ${c} e^{-${a}x - ${b}y}\\,dx\\,dy$。`,
        );
        const solution = t(
          steps(
            `Separate the integral into independent single integrals: $I = ${c} \\left(\\int_0^\\infty e^{-${a}x}\\,dx\\right) \\left(\\int_0^\\infty e^{-${b}y}\\,dy\\right)$.`,
            `Evaluate the $x$-integral: $\\int_0^\\infty e^{-${a}x}\\,dx = \\left[-\\frac{1}{${a}} e^{-${a}x}\\right]_0^\\infty = \\frac{1}{${a}}$.`,
            `Evaluate the $y$-integral: $\\int_0^\\infty e^{-${b}y}\\,dy = \\left[-\\frac{1}{${b}} e^{-${b}y}\\right]_0^\\infty = \\frac{1}{${b}}$.`,
            `Multiply together: $I = ${c} \\times \\frac{1}{${a}} \\times \\frac{1}{${b}} = \\frac{${c}}{${a * b}} = ${ans}$.`,
          ),
          steps(
            `将积分拆解为两个独立的一维积分：$I = ${c} \\left(\\int_0^\\infty e^{-${a}x}\\,dx\\right) \\left(\\int_0^\\infty e^{-${b}y}\\,dy\\right)$。`,
            `计算 $x$ 积分：$\\int_0^\\infty e^{-${a}x}\\,dx = \\frac{1}{${a}}$。`,
            `计算 $y$ 积分：$\\int_0^\\infty e^{-${b}y}\\,dy = \\frac{1}{${b}}$。`,
            `相乘得：$I = ${c} \\times \\frac{1}{${a}} \\times \\frac{1}{${b}} = \\frac{${c}}{${a * b}} = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [c, ans + a, 2 * ans],
        });
      },
    },
  ],
};

/** jointDistributionsForDiscreteRandomVariables handles discrete joint PMFs. */
export const jointDistributionsForDiscreteRandomVariables: TopicDef = {
  id: "joint-distributions-for-discrete-random-variables",
  title: t("Joint Distributions for Discrete Random Variables", "离散型随机变量的联合分布"),
  summary: t(
    "For discrete random variables, joint pmf p(x_i, y_j) sums to 1 and marginal distributions are given by row and column sums.",
    "对于离散型随机变量，联合概率分布列 p(x_i, y_j) 总和为 1，边际分布通过行和与列和求得。",
  ),
  prerequisites: ["double-summations"],
  encompasses: [{ topic: "double-summations", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "marginal-probabilities-and-joint-pmf-sums",
      title: t("Marginal probabilities and joint pmf sums", "联合概率分布列的求和与边际概率"),
      explanation: t(
        "For a $2 \\times 2$ joint distribution table with probabilities $P(X=x, Y=y)$, the marginal probability is $P(X = x_1) = P(X=x_1, Y=y_1) + P(X=x_1, Y=y_2)$.",
        "对于包含概率 $P(X=x, Y=y)$ 的 $2 \\times 2$ 联合分布列，边际概率为行（或列）之和：$P(X = x_1) = P(X=x_1, Y=y_1) + P(X=x_1, Y=y_2)$。",
      ),
      generate(rng: Rng): Problem {
        const p11 = rng.int(10, 30); // in percent
        const p12 = rng.int(10, 30);
        const p21 = rng.int(10, 30);
        const p22 = 100 - p11 - p12 - p21;
        const pX1 = p11 + p12;

        const prompt = t(
          `Two discrete random variables $X \\in \\{1, 2\\}$ and $Y \\in \\{1, 2\\}$ have joint probabilities (in percent): $P(X=1, Y=1) = ${p11}\\%$, $P(X=1, Y=2) = ${p12}\\%$, $P(X=2, Y=1) = ${p21}\\%$, and $P(X=2, Y=2) = ${p22}\\%$. Find the marginal probability $P(X = 1)$ (in percent).`,
          `两离散型随机变量 $X \\in \\{1, 2\\}$ 与 $Y \\in \\{1, 2\\}$ 的联合概率（以百分比计）为：$P(X=1, Y=1) = ${p11}\\%$，$P(X=1, Y=2) = ${p12}\\%$，$P(X=2, Y=1) = ${p21}\\%$，$P(X=2, Y=2) = ${p22}\\%$。求边际概率 $P(X = 1)$（百分比整数值）。`,
        );
        const solution = t(
          steps(
            `Sum over all possible values of $Y$: $P(X = 1) = P(X=1, Y=1) + P(X=1, Y=2)$.`,
            `Add the given probabilities: $P(X = 1) = ${p11}\\% + ${p12}\\% = ${pX1}\\%$.`,
          ),
          steps(
            `对 $Y$ 的所有取值求和计算边际概率：$P(X = 1) = P(X=1, Y=1) + P(X=1, Y=2)$。`,
            `相加得：$P(X = 1) = ${p11}\\% + ${p12}\\% = ${pX1}\\%$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: pX1,
          wrong: [p11, p12, 100 - pX1],
        });
      },
    },
  ],
};

/** jointDistributionsForContinuousRandomVariables defines marginal densities. */
export const jointDistributionsForContinuousRandomVariables: TopicDef = {
  id: "joint-distributions-for-continuous-random-variables",
  title: t("Joint Distributions for Continuous Random Variables", "连续型随机变量的边际密度与独立性"),
  summary: t(
    "Marginal probability density functions are obtained by integrating out the unwanted variable: f_X(x) = ∫ f(x, y) dy.",
    "通过对多余变量进行定积分求得边际概率密度函数：f_X(x) = ∫ f(x, y) dy。",
  ),
  prerequisites: ["calculating-probabilities-with-continuous-random-variables"],
  encompasses: [
    {
      topic: "calculating-probabilities-with-continuous-random-variables",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "marginal-densities-and-independence-of-continuous-variables",
      title: t("Marginal densities and independence of continuous variables", "连续型随机变量边际密度的积分求解"),
      explanation: t(
        "The marginal probability density function of $X$ is $f_X(x) = \\int_{-\\infty}^\\infty f(x, y)\\,dy$. For $f(x, y) = c(x + a)$ on $[0, 1] \\times [0, 1]$, $f_X(x) = \\int_0^1 c(x + a)\\,dy = c(x + a)$.",
        "随机变量 $X$ 的边际概率密度函数为 $f_X(x) = \\int_{-\\infty}^\\infty f(x, y)\\,dy$。对于在 $[0, 1] \\times [0, 1]$ 上的联合密度 $f(x, y) = c(x + a)$，$f_X(x) = \\int_0^1 c(x + a)\\,dy = c(x + a)$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const c = rng.int(2, 7);
        const xVal = 1;
        const ans = c * (xVal + a);

        const prompt = t(
          `A continuous random vector $(X, Y)$ on $[0, 1] \\times [0, 1]$ has joint density $f(x, y) = ${c}(x + ${a})$. Evaluate the marginal probability density $f_X(x)$ at $x = ${xVal}$.`,
          `定义在 $[0, 1] \\times [0, 1]$ 上的连续型随机向量 $(X, Y)$ 具有联合密度 $f(x, y) = ${c}(x + ${a})$。求边际概率密度 $f_X(x)$ 在 $x = ${xVal}$ 处的值。`,
        );
        const solution = t(
          steps(
            `Integrate out $y$ over its domain $[0, 1]$: $f_X(x) = \\int_0^1 f(x, y)\\,dy = \\int_0^1 ${c}(x + ${a})\\,dy$.`,
            `Because ${c}(x + ${a}) does not depend on $y$, the integral is $f_X(x) = ${c}(x + ${a}) [y]_0^1 = ${c}(x + ${a})$.`,
            `Evaluate at $x = ${xVal}$: $f_X(${xVal}) = ${c}(${xVal} + ${a}) = ${c}(${xVal + a}) = ${ans}$.`,
          ),
          steps(
            `对 $y$ 在其取值区间 $[0, 1]$ 上积分：$f_X(x) = \\int_0^1 f(x, y)\\,dy = \\int_0^1 ${c}(x + ${a})\\,dy$。`,
            `由于被积式不含 $y$，$f_X(x) = ${c}(x + ${a}) [y]_0^1 = ${c}(x + ${a})$。`,
            `代入 $x = ${xVal}$：$f_X(${xVal}) = ${c}(${xVal} + ${a}) = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [c * a, c * xVal, ans + c],
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Export Array
// ---------------------------------------------------------------------------

export const multivariableCalculusApplicationTopics: readonly TopicDef[] = [
  // 6.27 Vector Mechanics
  velocityAndAccelerationAsFunctionsOfDisplacement,
  determiningPropertiesOfObjectsDescribedAsFunctionsOfDisplacement,
  theComponentsOfAcceleration,
  theWorkEnergyPrinciple,
  circularMotionAboutTheOrigin,

  // 6.28 Applications of Multiple Integrals
  theAverageValueOfAMultivariableFunction,
  densityMassAndChargeOfPlaneLaminas,
  momentsAndCenterOfMass,
  momentsAndCentersOfMassOfThinRods,
  momentsAndCentersOfMassOfPlaneLaminas,
  momentsOfInertiaOfLaminasAboutTheCoordinateAxes,
  momentsOfInertiaOfLaminasAboutOtherAxes,
  calculatingTheRadiusOfGyrationOfAPlaneLamina,
  theParallelAxisTheorem,

  // 6.29 Random Variables
  probabilityDensityFunctionsOfContinuousRandomVariables,
  calculatingProbabilitiesWithContinuousRandomVariables,
  continuousRandomVariablesOverInfiniteDomains,
  jointDistributionsForDiscreteRandomVariables,
  jointDistributionsForContinuousRandomVariables,
];
